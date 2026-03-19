import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getMatchedImage, getRandomImage } from '../images';

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
    step: 'init',
    hasApiKey: !!apiKey,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'not set',
    modelId: modelId,
    timestamp: new Date().toISOString(),
  };

  // 默认值（兜底）
  const fallbackTitle = "心境";
  const fallbackPoem = "心若止水，\n万物皆空。\n执念如云，\n随风而去。";

  if (!apiKey) {
    console.error("[ARK] ❌ ARK_API_KEY 未配置");
    debug.error = 'ARK_API_KEY not set';
    debug.step = 'error_no_key';
    
    // 即使没有 API Key，也要进行图片匹配
    const matchedImage = getMatchedImage(obsession);
    return { 
      title: fallbackTitle, 
      poem: fallbackPoem, 
      imageBase64: matchedImage.url,
      matchedTags: matchedImage.tags,
      matchedEmotions: matchedImage.emotions,
      debug 
    };
  }

  try {
    console.log("[ARK] 🚀 开始调用模型:", modelId);
    debug.step = 'calling_ark';
    
    const requestBody = {
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
    };

    debug.requestBody = JSON.stringify(requestBody).substring(0, 200);

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    debug.responseStatus = response.status;
    debug.responseOk = response.ok;

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ARK] ❌ API 错误:", response.status, errorText);
      debug.error = `API error: ${response.status}`;
      debug.errorDetail = errorText.substring(0, 500);
      debug.step = 'error_api';
      
      // API 错误时也要匹配图片
      const matchedImage = getMatchedImage(obsession);
      return { 
        title: fallbackTitle, 
        poem: fallbackPoem, 
        imageBase64: matchedImage.url,
        matchedTags: matchedImage.tags,
        matchedEmotions: matchedImage.emotions,
        debug 
      };
    }

    const data = await response.json();
    console.log("[ARK] ✅ 收到响应");
    debug.step = 'parsing_response';
    debug.responseData = JSON.stringify(data).substring(0, 300);
    
    const content = data.choices?.[0]?.message?.content || '';
    debug.rawContent = content.substring(0, 300);
    
    // 尝试解析 JSON
    let parsed;
    try {
      // 先尝试直接解析
      parsed = JSON.parse(content);
      debug.parseMethod = 'direct';
    } catch {
      try {
        // 尝试提取 JSON 块
        const jsonMatch = content.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
          debug.parseMethod = 'extracted';
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        // 最后按行解析
        const lines = content.split(/\n/).filter((l: string) => l.trim());
        parsed = {
          title: "心境",
          poem: lines.slice(0, 4).join('\n')
        };
        debug.parseMethod = 'fallback_lines';
      }
    }

    const title = parsed.title || fallbackTitle;
    const poem = (parsed.poem || fallbackPoem).replace(/\\n/g, '\n');
    
    debug.step = 'ark_success';
    debug.poemGenerated = true;
    debug.title = title;
    debug.poemPreview = poem.substring(0, 50);
    console.log("[ARK] ✅ 诗句生成成功:", title);

    // 匹配图片
    const matchedImage = getMatchedImage(obsession);
    
    return { 
      title, 
      poem, 
      imageBase64: matchedImage.url,
      matchedTags: matchedImage.tags,
      matchedEmotions: matchedImage.emotions,
      debug 
    };

  } catch (e: any) {
    console.error("[ARK] ❌ 异常:", e.message);
    debug.error = e.message;
    debug.errorType = e.constructor.name;
    debug.step = 'error_exception';
    
    // 异常时也要匹配图片
    const matchedImage = getMatchedImage(obsession);
    return { 
      title: fallbackTitle, 
      poem: fallbackPoem, 
      imageBase64: matchedImage.url,
      matchedTags: matchedImage.tags,
      matchedEmotions: matchedImage.emotions,
      debug 
    };
  }
}

// ==================== 主处理函数 ====================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  
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
    
    console.log('[API] ========== 新请求 ==========');
    console.log('[API] 用户输入:', obsession);
    
    if (!obsession || typeof obsession !== 'string') {
      return res.status(400).json({ error: '请输入你的执念' });
    }

    // 生成内容
    const result = await generateWithARK(obsession);
    
    const duration = Date.now() - startTime;
    console.log(`[API] ✅ 处理完成，耗时: ${duration}ms`);

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
      _debug: {
        ...result.debug,
        duration: `${duration}ms`
      }
    });

  } catch (error: any) {
    console.error('[API] ❌ 未捕获异常:', error);
    
    const duration = Date.now() - startTime;
    
    return res.status(200).json({
      sessionId: `session_${Date.now()}`,
      status: 'completed',
      result: {
        title: "心境",
        poem: "心若止水，\n万物皆空。\n执念如云，\n随风而去。",
        imageBase64: getRandomImage()
      },
      _debug: { 
        error: error.message,
        step: 'uncaught_exception',
        duration: `${duration}ms`
      }
    });
  }
}
