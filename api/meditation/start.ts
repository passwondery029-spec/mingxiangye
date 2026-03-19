import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

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

// ==================== Gemini API ====================
async function generateWithGemini(obsession: string): Promise<{ 
  title: string; 
  poem: string; 
  imageBase64: string;
  debug?: any;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // 调试信息
  const debug: any = {
    hasApiKey: !!apiKey,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
  };

  // 默认值
  let title = "心境";
  let poem = "万物皆有裂痕，\n那是光照进来的地方。\n静候时光流转，\n心安即是归处。";
  let imageBase64 = getFallbackImage(obsession);

  if (!apiKey) {
    console.error("[Gemini] GEMINI_API_KEY not set!");
    return { title, poem, imageBase64, debug: { ...debug, error: 'API key not set' } };
  }

  try {
    console.log("[Gemini] Initializing client...");
    const ai = new GoogleGenAI({ apiKey });

    // 生成诗句
    console.log("[Gemini] Generating poem...");
    const poemResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      contents: `用户输入了一个心中的执念或烦恼："${obsession}"。
请你作为一位充满东方禅意与温柔的疗愈师，帮助他化解。
你需要构思一个具体的视觉隐喻（比如：融化的冰山、绽放的莲花、散开的墨滴等）。
然后：
1. 写一首简短的现代诗（4-6行），用来化解这个执念。
2. 为这首诗起一个简短的、充满诗意的小标题（2-5个字）。
3. 写一段用于AI绘画的英文Prompt，风格为：Abstract Chinese ink wash painting, minimalist, ethereal watercolor, zen style.`,
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
    const imagePrompt = parsed.imagePrompt || "Abstract Chinese ink wash painting, zen style";
    
    debug.poemGenerated = true;
    debug.title = title;
    console.log("[Gemini] Poem generated:", title);

    // 生成图片
    console.log("[Gemini] Generating image...");
    try {
      const imageResult = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-05-20',
        contents: { parts: [{ text: imagePrompt }] }
      });
      
      if (imageResult.candidates?.[0]?.content?.parts) {
        for (const part of imageResult.candidates[0].content.parts) {
          if (part.inlineData) {
            imageBase64 = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
            debug.imageGenerated = true;
            console.log("[Gemini] Image generated successfully");
            break;
          }
        }
      }
    } catch (imgErr: any) {
      console.error("[Gemini] Image failed:", imgErr.message);
      debug.imageError = imgErr.message;
    }

  } catch (e: any) {
    console.error("[Gemini] API failed:", e.message);
    debug.error = e.message;
    debug.errorType = e.constructor.name;
  }

  return { title, poem, imageBase64, debug };
}

// ==================== 主处理函数 ====================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { obsession } = req.body || {};
    
    if (!obsession || typeof obsession !== 'string') {
      return res.status(400).json({ error: '请输入你的执念' });
    }

    // 生成内容
    const result = await generateWithGemini(obsession);

    return res.status(200).json({
      sessionId: `session_${Date.now()}`,
      status: 'completed',
      result: {
        title: result.title,
        poem: result.poem,
        imageBase64: result.imageBase64,
      },
      // 仅在测试时返回调试信息，生产环境可移除
      _debug: result.debug
    });

  } catch (error: any) {
    console.error('[API] Error:', error);
    
    return res.status(200).json({
      sessionId: `session_${Date.now()}`,
      status: 'completed',
      result: {
        title: "心境",
        poem: FALLBACK_POEMS[Math.floor(Math.random() * FALLBACK_POEMS.length)],
        imageBase64: getFallbackImage("error")
      },
      _debug: { error: error.message }
    });
  }
}
