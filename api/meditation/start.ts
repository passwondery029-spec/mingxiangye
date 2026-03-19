import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getMatchedImage, getRandomImage, IMAGE_LIBRARY } from '../images';

// ==================== ARK API 调用 ====================
async function generateWithARK(obsession: string): Promise<{ 
  title: string; 
  poem: string; 
  imageBase64: string;
  matchedTags?: string[];
  matchedEmotions?: string[];
  debug?: any;
}> {
  const apiKey = process.env.ARK_API_KEY;
  const modelId = process.env.ARK_MODEL_ID || 'ep-m-20260305204118-rh2xg';
  
  // 调试信息
  const debug: any = {
    hasApiKey: !!apiKey,
    modelId: modelId,
  };

  // 默认值
  let title = "心境";
  let poem = "万物皆有裂痕，\n那是光照进来的地方。\n静候时光流转，\n心安即是归处。";
  let imageBase64 = getRandomImage();
  let matchedTags: string[] = [];
  let matchedEmotions: string[] = [];

  if (!apiKey) {
    console.error("[ARK] ARK_API_KEY not set");
    return { title, poem, imageBase64, matchedTags, matchedEmotions, debug: { ...debug, error: 'API key not set' } };
  }

  try {
    console.log("[ARK] Calling model:", modelId);
    
    // 调用 ARK API（火山引擎）
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: 'system',
            content: `你是一位充满东方禅意与温柔的疗愈师。当用户向你诉说执念或烦恼时，请用温暖的语气回应。

要求：
1. 写一首简短的现代诗（4-6行），帮助化解执念
2. 为诗起一个诗意的小标题（2-5个字）
3. 直接返回 JSON 格式，不要包裹在 markdown 代码块中

返回格式示例：
{"title": "心境", "poem": "心若止水\\n万物皆空\\n执念如云\\n随风而去"}`
          },
          {
            role: 'user',
            content: `我的执念是：「${obsession}」`
          }
        ],
        temperature: 0.8,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ARK] API error:", response.status, errorText);
      debug.error = `API error: ${response.status}`;
      return { title, poem, imageBase64, matchedTags, matchedEmotions, debug };
    }

    const data = await response.json();
    console.log("[ARK] Response received");
    
    const content = data.choices?.[0]?.message?.content || '';
    debug.rawContent = content.substring(0, 200);
    
    // 尝试解析 JSON
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      try {
        const jsonMatch = content.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        const lines = content.split(/\n/).filter((l: string) => l.trim());
        parsed = {
          title: "心境",
          poem: lines.slice(0, 4).join('\\n')
        };
      }
    }

    title = parsed.title || title;
    poem = (parsed.poem || poem).replace(/\\n/g, '\n');
    debug.poemGenerated = true;
    debug.title = title;
    console.log("[ARK] Poem generated:", title);

  } catch (e: any) {
    console.error("[ARK] Error:", e.message);
    debug.error = e.message;
    debug.errorType = e.constructor.name;
  }

  // 根据用户输入匹配图片
  const matchedImage = getMatchedImage(obsession);
  imageBase64 = matchedImage.url;
  matchedTags = matchedImage.tags;
  matchedEmotions = matchedImage.emotions;
  
  debug.imageMatched = true;
  debug.matchedTags = matchedTags;

  return { title, poem, imageBase64, matchedTags, matchedEmotions, debug };
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
    const result = await generateWithARK(obsession);

    return res.status(200).json({
      sessionId: `session_${Date.now()}`,
      status: 'completed',
      result: {
        title: result.title,
        poem: result.poem,
        imageBase64: result.imageBase64,
        matchedTags: result.matchedTags,
        matchedEmotions: result.matchedEmotions,
      },
      _debug: result.debug
    });

  } catch (error: any) {
    console.error('[API] Error:', error);
    
    const fallbackImage = getRandomImage();
    
    return res.status(200).json({
      sessionId: `session_${Date.now()}`,
      status: 'completed',
      result: {
        title: "心境",
        poem: "心若止水，\n万物皆空。\n执念如云，\n随风而去。",
        imageBase64: fallbackImage
      },
      _debug: { error: error.message }
    });
  }
}
