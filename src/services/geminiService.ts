/**
 * 后端 API 服务
 * 调用 Vercel Serverless Functions
 */

const API_BASE = '/api';

export interface HealingContent {
  title: string;
  poem: string;
  imageBase64: string;
  matchedTags?: string[];
  matchedEmotions?: string[];
  debug?: any;
}

/**
 * 生成疗愈内容
 * 直接调用后端 API，同步返回结果
 */
export async function generateHealingContent(obsession: string): Promise<HealingContent> {
  console.log('[前端] 开始生成内容，执念:', obsession);
  
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
      console.error('[前端] API 请求失败:', response.status);
      throw new Error('API request failed');
    }

    const data = await response.json();
    console.log('[前端] API 响应:', data);

    // 返回结果和调试信息
    if (data.status === 'completed' && data.result) {
      // 打印调试信息到控制台
      if (data._debug) {
        console.log('========== 调试信息 ==========');
        console.log('步骤:', data._debug.step);
        console.log('ARK API Key 配置:', data._debug.hasApiKey ? '✅ 已配置' : '❌ 未配置');
        if (data._debug.error) {
          console.error('错误:', data._debug.error);
        }
        if (data._debug.matchedTags) {
          console.log('匹配标签:', data._debug.matchedTags);
        }
        console.log('耗时:', data._debug.duration);
        console.log('==============================');
      }
      
      return {
        title: data.result.title,
        poem: data.result.poem,
        imageBase64: data.result.imageBase64,
        matchedTags: data.result.matchedTags,
        matchedEmotions: data.result.matchedEmotions,
        debug: data._debug,
      };
    }

    throw new Error('Invalid response');

  } catch (error) {
    console.error('[前端] API 错误:', error);
    
    // 返回兜底内容
    return {
      title: "心境",
      poem: "心若止水，\n万物皆空。\n执念如云，\n随风而去。",
      imageBase64: "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg",
      debug: { error: '前端捕获异常', step: 'frontend_error' }
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
