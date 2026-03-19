import { GoogleGenAI, Type } from "@google/genai";

// 提前准备100副不同的图、按标签命名 (10 tags * 10 images = 100 images)
const FALLBACK_TAGS = ['平静', '释放', '自然', '光芒', '流水', '迷雾', '生机', '空灵', '释怀', '新生'];
const FALLBACK_IMAGES: Record<string, string[]> = {};
FALLBACK_TAGS.forEach(tag => {
  FALLBACK_IMAGES[tag] = Array.from({ length: 10 }, (_, i) => 
    `https://picsum.photos/seed/zen_${encodeURIComponent(tag)}_${i}/800/800?blur=4`
  );
});

function getFallbackImage(text: string): string {
  const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const tag = FALLBACK_TAGS[hash % FALLBACK_TAGS.length];
  const images = FALLBACK_IMAGES[tag];
  return images[hash % images.length];
}

export async function generateHealingContent(obsession: string) {
  let title = "心境";
  let poem = "万物皆有裂痕，\n那是光照进来的地方。\n静候时光流转，\n心安即是归处。";
  let imagePrompt = "Abstract Chinese ink wash painting, minimalist, ethereal watercolor, zen style, white background, negative space. A single lotus blooming in the mist.";
  let imageBase64 = "";

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set");
      return { title, poem, imageBase64: getFallbackImage(obsession) };
    }
    const ai = new GoogleGenAI({ apiKey });

    // 1. Generate Poem, Title, and Image Prompt
    try {
      const poemPromise = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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
              title: { type: Type.STRING, description: "诗的小标题（2-5个字）" },
              poem: { type: Type.STRING, description: "诗的正文，使用 \\n 换行" },
              imagePrompt: { type: Type.STRING, description: "用于生成图片的英文Prompt" }
            },
            required: ["title", "poem", "imagePrompt"]
          }
        }
      });

      const parsed = JSON.parse(poemPromise.text || "{}");
      title = parsed.title || title;
      poem = parsed.poem || poem;
      poem = poem.replace(/\\n/g, '\n'); // Fix literal \n strings returned by LLM
      imagePrompt = parsed.imagePrompt || imagePrompt;
    } catch (e) {
      console.error("Failed to generate or parse poem JSON, using fallback text", e);
    }

    // 2. Generate Image with retry
    let attempts = 0;
    while (attempts < 2 && !imageBase64) {
      try {
        attempts++;
        const imageResult = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              { text: imagePrompt }
            ]
          }
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
        console.error(`Image generation attempt ${attempts} failed:`, err);
        if (attempts < 2) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
    }
  } catch (error: any) {
    console.error("Critical error in generateHealingContent:", error);
  }

  // 3. Fallback Image if API completely failed
  if (!imageBase64) {
    console.warn("Using fallback image from prepared 100 images dictionary.");
    imageBase64 = getFallbackImage(obsession + poem);
  }

  return { title, poem, imageBase64 };
}
