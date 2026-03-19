/**
 * 后端 API 服务
 * 调用 Vercel Serverless Functions
 */

const API_BASE = '/api';

export interface HealingContent {
  title: string;
  poem: string;
  imageBase64: string;
}

/**
 * 生成疗愈内容
 * 直接调用后端 API，同步返回结果
 */
export async function generateHealingContent(obsession: string): Promise<HealingContent> {
  try {
    const response = await fetch(`${API_BASE}/meditation/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId(),
      },
      body: JSON.stringify({ obsession }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();

    // 新的 API 直接返回结果
    if (data.status === 'completed' && data.result) {
      return {
        title: data.result.title,
        poem: data.result.poem,
        imageBase64: data.result.imageBase64,
      };
    }

    throw new Error('Invalid response');

  } catch (error) {
    console.error('API Error:', error);
    
    // 返回兜底内容
    return {
      title: "心境",
      poem: "心若止水，\n万物皆空。\n执念如云，\n随风而去。",
      imageBase64: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
    };
  }
}

/**
 * 兼容旧接口
 */
export const startMeditation = generateHealingContent;
export const getMeditationResult = generateHealingContent;

/**
 * 获取历史记录（简化版）
 */
export async function getHistory(): Promise<any[]> {
  // 由于 Serverless 无状态，历史记录暂不实现
  return [];
}

/**
 * 获取用户 ID
 */
function getUserId(): string {
  let userId = localStorage.getItem('mingxiangye_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('mingxiangye_user_id', userId);
  }
  return userId;
}
