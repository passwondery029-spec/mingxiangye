import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

// ==================== 配置 ====================
const DAILY_LIMIT = 3;

// ==================== 数据存储 ====================
interface Session {
  id: string;
  userId: string;
  obsession: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  title?: string;
  poem?: string;
  imageBase64?: string;
  createdAt: Date;
}

interface UserQuota {
  userId: string;
  date: string;
  count: number;
}

// 全局变量存储
declare global {
  var sessions: Map<string, Session> | undefined;
  var quotas: Map<string, UserQuota> | undefined;
}

const sessions = globalThis.sessions || (globalThis.sessions = new Map<string, Session>());
const quotas = globalThis.quotas || (globalThis.quotas = new Map<string, UserQuota>());

// ==================== 兜底内容 ====================
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80',
  'https://images.unsplash.com/photo-1494472155656-f34e81b17ddc?w=800&q=80',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
  'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
  'https://images.unsplash.com/photo-1518882605630-8eb7c5f5a1ed?w=800&q=80',
  'https://images.unsplash.com/photo-1564064235862-0b9b86828f6e?w=800&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80',
  'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80',
  'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800&q=80',
  'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=800&q=80',
  'https://images.unsplash.com/photo-1509225770129-fbcf8a696c0b?w=800&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=800&q=80',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80',
  'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=800&q=80',
  'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
];

const FALLBACK_POEMS = [
  '心若止水，\n万物皆空。\n执念如云，\n随风而去。',
  '一念花开，\n一念花落。\n心安处，\n即是归处。',
  '静观自在，\n心无挂碍。\n万物静默，\n皆是答案。',
  '执念深处，\n自有光明。\n放下刹那，\n便是永恒。',
  '山高水长，\n心境澄明。\n一呼一吸，\n皆是修行。',
  '云卷云舒，\n皆是风景。\n心随云动，\n自在从容。',
];

function getFallbackImage(text: string): string {
  const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getQuotaKey(userId: string): string {
  return `${userId}:${getToday()}`;
}

function checkQuota(userId: string): { exceeded: boolean; count: number } {
  const key = getQuotaKey(userId);
  const quota = quotas.get(key);
  const count = quota ? quota.count : 0;
  return { exceeded: count >= DAILY_LIMIT, count };
}

function incrementQuota(userId: string): void {
  const key = getQuotaKey(userId);
  const quota = quotas.get(key);
  if (quota) {
    quota.count++;
  } else {
    quotas.set(key, { userId, date: getToday(), count: 1 });
  }
}

function generateId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ==================== Gemini API ====================
async function generateWithGemini(obsession: string): Promise<{ title: string; poem: string; imageBase64: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  let title = "心境";
  let poem = "万物皆有裂痕，\n那是光照进来的地方。\n静候时光流转，\n心安即是归处。";
  let imagePrompt = "Abstract Chinese ink wash painting, minimalist, ethereal watercolor, zen style, white background, negative space. A single lotus blooming in the mist.";
  let imageBase64 = "";

  if (!apiKey) {
    console.warn("[Gemini] GEMINI_API_KEY not set, using fallback");
    return { title, poem, imageBase64: getFallbackImage(obsession) };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const poemResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      contents: `用户输入了一个心中的执念或烦恼："${obsession}"。
请你作为一位充满东方禅意与温柔的疗愈师，帮助他化解。
你需要构思一个具体的视觉隐喻（比如：融化的冰山、绽放的莲花、散开的墨滴等）。
然后：
1. 写一首简短的现代诗（4-6行），用来化解这个执念。诗句中必须明确提到你构思的这个视觉隐喻。
2. 为这首诗起一个简短的、充满诗意的小标题（2-5个字）。
3. 写一段用于AI绘画的英文Prompt，要求画出这个视觉隐喻。风格必须是：Abstract Chinese ink wash painting, minimalist, ethereal watercolor, zen style, white background, negative space. 绝对不要包含任何文字。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            poem: { type: Type.STRING },
            imagePrompt: { type: Type.STRING }
          },
          required: ["title", "poem", "imagePrompt"]
        }
      }
    });

    const parsed = JSON.parse(poemResponse.text || "{}");
    title = parsed.title || title;
    poem = (parsed.poem || poem).replace(/\\n/g, '\n');
    imagePrompt = parsed.imagePrompt || imagePrompt;

    // 生成图片
    for (let i = 0; i < 2 && !imageBase64; i++) {
      try {
        const imageResult = await ai.models.generateContent({
          model: 'gemini-2.5-flash-preview-05-20',
          contents: { parts: [{ text: imagePrompt }] }
        });
        
        if (imageResult.candidates?.[0]?.content?.parts) {
          for (const part of imageResult.candidates[0].content.parts) {
            if (part.inlineData) {
              imageBase64 = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch (err) {
        console.error(`[Gemini] Image attempt ${i + 1} failed:`, err);
        if (i < 1) await new Promise(r => setTimeout(r, 1500));
      }
    }
  } catch (e) {
    console.error("[Gemini] Failed:", e);
  }

  if (!imageBase64) {
    imageBase64 = getFallbackImage(obsession);
  }

  return { title, poem, imageBase64 };
}

// ==================== 处理函数 ====================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.url?.split('?')[0] || '';
  const userId = (req.headers['x-user-id'] as string) || 'anonymous';

  try {
    // 健康检查
    if (path === '/api/health' || path === '/api/') {
      return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    }

    // 开始冥想
    if (path === '/api/meditation/start' && req.method === 'POST') {
      const { obsession } = req.body || {};
      
      if (!obsession || typeof obsession !== 'string') {
        return res.status(400).json({ error: '请输入你的执念' });
      }

      const sessionId = generateId();
      const session: Session = {
        id: sessionId,
        userId,
        obsession,
        status: 'pending',
        createdAt: new Date()
      };
      sessions.set(sessionId, session);

      const quotaStatus = checkQuota(userId);

      // 立即返回 sessionId
      res.status(200).json({ sessionId, status: 'pending' });

      // 异步生成（注意：Serverless 中可能需要等待）
      session.status = 'processing';
      
      let result;
      if (quotaStatus.exceeded) {
        result = {
          title: "心境",
          poem: FALLBACK_POEMS[Math.floor(Math.random() * FALLBACK_POEMS.length)],
          imageBase64: getFallbackImage(obsession)
        };
      } else {
        result = await generateWithGemini(obsession);
        incrementQuota(userId);
      }

      session.status = 'completed';
      session.title = result.title;
      session.poem = result.poem;
      session.imageBase64 = result.imageBase64;
      
      return;
    }

    // 获取结果
    const resultMatch = path.match(/^\/api\/meditation\/result\/([^/]+)$/);
    if (resultMatch && req.method === 'GET') {
      const sessionId = resultMatch[1];
      const session = sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({ error: '冥想会话不存在' });
      }

      return res.status(200).json({
        status: session.status,
        result: session.status === 'completed' ? {
          title: session.title,
          poem: session.poem,
          imageBase64: session.imageBase64
        } : undefined
      });
    }

    // 历史记录
    if (path === '/api/meditation/history' && req.method === 'GET') {
      const userSessions = Array.from(sessions.values())
        .filter(s => s.userId === userId && s.status === 'completed')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 20)
        .map(s => ({
          id: s.id,
          obsession: s.obsession,
          title: s.title,
          poem: s.poem,
          imageBase64: s.imageBase64,
          date: s.createdAt.toISOString()
        }));

      return res.status(200).json(userSessions);
    }

    return res.status(404).json({ error: 'Not found' });

  } catch (error) {
    console.error('[API] Error:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
}
