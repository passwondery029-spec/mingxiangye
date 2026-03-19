/**
 * 后端 API 服务
 * 前端通过此服务调用后端 API，后端处理 Gemini API 调用和频控逻辑
 */

const API_BASE = '/api';

export interface HealingContent {
  title: string;
  poem: string;
  imageBase64: string;
}

/**
 * 开始冥想会话
 * 立即返回 sessionId，后台异步生成内容
 */
export async function startMeditation(obsession: string): Promise<string> {
  const response = await fetch(`${API_BASE}/meditation/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getUserId(),
    },
    body: JSON.stringify({ obsession }),
  });

  if (!response.ok) {
    throw new Error('Failed to start meditation');
  }

  const data = await response.json();
  return data.sessionId;
}

/**
 * 获取冥想结果
 * 轮询直到生成完成
 */
export async function getMeditationResult(sessionId: string): Promise<HealingContent> {
  const maxAttempts = 120; // 最多等待 2 分钟
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(`${API_BASE}/meditation/result/${sessionId}`, {
      headers: {
        'x-user-id': getUserId(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get result');
    }

    const data = await response.json();

    if (data.status === 'completed') {
      return {
        title: data.result.title,
        poem: data.result.poem,
        imageBase64: data.result.imageBase64,
      };
    }

    // 等待 1 秒后重试
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }

  throw new Error('Timeout waiting for result');
}

/**
 * 获取历史记录
 */
export async function getHistory(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/meditation/history`, {
    headers: {
      'x-user-id': getUserId(),
    },
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

/**
 * 生成疗愈内容（兼容旧接口）
 * 此函数现在调用后端 API
 */
export async function generateHealingContent(obsession: string): Promise<HealingContent> {
  // 开始冥想
  const sessionId = await startMeditation(obsession);
  
  // 等待结果
  return getMeditationResult(sessionId);
}

/**
 * 获取用户 ID（简化版，实际应使用设备指纹或登录系统）
 */
function getUserId(): string {
  let userId = localStorage.getItem('mingxiangye_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('mingxiangye_user_id', userId);
  }
  return userId;
}
