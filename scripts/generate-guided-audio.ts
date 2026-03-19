/**
 * 冥想引导音频生成脚本
 * 生成四段完整的7分钟引导音频
 */

import { TTSClient, Config } from 'coze-coding-dev-sdk';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const config = new Config();
const client = new TTSClient(config);

const outputDir = '/workspace/projects/vibecoding-production/mingxiangye/public/audio';
const tempDir = '/tmp/meditation_audio';

// 确保目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// ==================== 冥想引导文本（分段，便于拼接静默）====================

const MEDITATION_SCRIPTS = {
  morning: {
    name: '晨曦云英',
    segments: [
      // 开场 (0:00-0:15)
      { text: '早安。请找一个安静的地方坐下，轻轻闭上眼睛。', duration: 15 },
      // 呼吸引导 (0:15-1:00)
      { text: '让我们从呼吸开始。深深地吸气，感受清晨的空气充满身体。缓缓地呼气，放下昨夜的疲惫。再来一次，吸气，呼气，让身体慢慢苏醒。', duration: 45 },
      // 意象导入 (1:00-1:30)
      { text: '想象晨曦的第一缕阳光，正温柔地照在你的头顶。温暖、明亮。阳光慢慢向下，照亮你的额头、眼睛、脸颊。', duration: 30 },
      // 静默 (1:30-3:30) - 2分钟
      { text: '', duration: 120, silence: true },
      // 中间提醒 (3:30-3:45)
      { text: '如果思绪飘走了，没关系。温柔地把它带回到呼吸上。吸气，呼气。', duration: 15 },
      // 静默 (3:45-5:30) - 1分45秒
      { text: '', duration: 105, silence: true },
      // 能量注入 (5:30-6:00)
      { text: '想象阳光已经充满你的全身。你感到温暖、充满力量。今天，是全新的一天。', duration: 30 },
      // 静默 (6:00-6:30)
      { text: '', duration: 30, silence: true },
      // 唤醒回归 (6:30-7:00)
      { text: '现在，慢慢地把注意力带回这个房间。轻轻动一动手指和脚趾。慢慢睁开眼睛。愿你今天充满能量和喜悦。', duration: 30 },
    ],
  },

  noon: {
    name: '午间云英',
    segments: [
      // 开场 (0:00-0:15)
      { text: '此刻，请暂时放下手中的一切。找一个安静的角落，让自己停下来。', duration: 15 },
      // 呼吸引导 (0:15-1:00)
      { text: '闭上眼睛。做几次深呼吸。深深地吸气，感受胸腔打开。缓缓地呼气，让紧张和压力慢慢释放。继续，吸气，呼气，肩膀放松，手臂放松，全身都变得轻盈。', duration: 45 },
      // 身体扫描 (1:00-1:30)
      { text: '把注意力带到你的肩膀。如果有紧绷感，允许它在这里，然后让它慢慢松开。你的后背、你的腰部，都在渐渐放松。', duration: 30 },
      // 静默 (1:30-3:30) - 2分钟
      { text: '', duration: 120, silence: true },
      // 中间提醒 (3:30-3:45)
      { text: '此刻，你与自己在一起。不追逐，不抗拒。只是静静地待在这里。', duration: 15 },
      // 静默 (3:45-5:15) - 1分30秒
      { text: '', duration: 90, silence: true },
      // 能量回归 (5:15-5:45)
      { text: '想象一阵清新的风，吹过你的全身。带走疲惫，留下清明。你已经休息好了。', duration: 30 },
      // 静默 (5:45-6:15)
      { text: '', duration: 30, silence: true },
      // 唤醒回归 (6:15-7:00)
      { text: '慢慢地，把注意力带回身体。动一动手指。感受你的双脚踩在地上。缓缓睁开眼睛。带着这份清明，继续你的下午。', duration: 45 },
    ],
  },

  evening: {
    name: '暮色云英',
    segments: [
      // 开场 (0:00-0:15)
      { text: '夜幕即将降临。是时候让心灵回家了。请找一个安静的地方坐下。', duration: 15 },
      // 呼吸引导 (0:15-1:00)
      { text: '轻轻闭上眼睛。让我们从呼吸开始。缓缓地吸气，感受气息进入身体。慢慢地呼气，让这一天的忙碌慢慢沉淀。继续呼吸，每一次呼气，都带走一些疲惫，一些牵挂。', duration: 45 },
      // 意象导入 (1:00-1:30)
      { text: '想象夕阳西下，天边染上温柔的橙红色。余晖洒在大地上，一切都变得柔和而宁静。你就在这片余晖中，安静地坐着。', duration: 30 },
      // 静默 (1:30-3:30) - 2分钟
      { text: '', duration: 120, silence: true },
      // 中间提醒 (3:30-3:45)
      { text: '这一天，无论发生了什么，都已经过去了。此刻，只有你和当下的宁静。', duration: 15 },
      // 静默 (3:45-5:15) - 1分30秒
      { text: '', duration: 90, silence: true },
      // 感恩放下 (5:15-5:45)
      { text: '感谢今天的自己。感谢每一次经历，每一次相遇。放下那些未完成的事，放下所有的期待。此刻，你只需要休息。', duration: 30 },
      // 静默 (5:45-6:15)
      { text: '', duration: 30, silence: true },
      // 唤醒回归 (6:15-7:00)
      { text: '慢慢地，感受你的身体。动一动手指和脚趾。深呼吸一次。缓缓睁开眼睛。愿你在今夜，拥有一个安稳的睡眠。晚安。', duration: 45 },
    ],
  },

  sleep: {
    name: '睡前云英',
    segments: [
      // 开场 (0:00-0:20)
      { text: '晚上好。请躺在床上，让自己完全放松。不需要做任何努力，只是让自己慢慢地、深深地休息。', duration: 20 },
      // 呼吸放松 (0:20-1:20)
      { text: '轻轻闭上眼睛。让我们从呼吸开始。慢慢地吸气，感受气息进入身体。缓缓地呼气，让身体越来越沉、越来越松。每一次呼气，都让身体更多地陷进床里。你已经累了，可以完全放下。', duration: 60 },
      // 身体放松 (1:20-2:00)
      { text: '感受你的头顶，慢慢放松。额头舒展开。眼睛、脸颊、下巴都松开了。肩膀下沉，手臂变得沉重，手指自然弯曲。你的后背、腰部、双腿，都在渐渐放松。', duration: 40 },
      // 静默 (2:00-4:00) - 2分钟
      { text: '', duration: 120, silence: true },
      // 深度引导 (4:00-4:20)
      { text: '如果思绪还在飘动，没关系。让它们像云一样，慢慢飘远。你只需要越来越沉、越来越放松。', duration: 20 },
      // 静默 (4:20-5:30) - 1分10秒
      { text: '', duration: 70, silence: true },
      // 入睡暗示 (5:30-6:00)
      { text: '现在，你可以让自己睡着了。什么都不需要想，什么都不需要做。只需要安心地睡去。晚安，好梦。', duration: 30 },
      // 静默尾音 (6:00-7:00) - 1分钟
      { text: '', duration: 60, silence: true },
    ],
  },
};

// 生成单个文本的音频
async function generateSpeech(text: string): Promise<string> {
  const response = await client.synthesize({
    uid: 'mingxiangye',
    text,
    speaker: 'zh_female_vv_uranus_bigtts',
    audioFormat: 'mp3',
    sampleRate: 24000,
    speechRate: -10, // 稍慢，更有冥想感
  });

  const audioData = await axios.get(response.audioUri, { responseType: 'arraybuffer' });
  const tempPath = path.join(tempDir, `speech_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`);
  fs.writeFileSync(tempPath, audioData.data);
  
  return tempPath;
}

// 生成静默音频
function generateSilence(durationSeconds: number): string {
  const tempPath = path.join(tempDir, `silence_${durationSeconds}_${Date.now()}.mp3`);
  execSync(`ffmpeg -y -f lavfi -i "anullsrc=r=24000:cl=mono" -t ${durationSeconds} -c:a libmp3lame -q:a 9 "${tempPath}" 2>/dev/null`);
  return tempPath;
}

// 获取音频时长
function getAudioDuration(filePath: string): number {
  const result = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`).toString().trim();
  return parseFloat(result);
}

// 拼接音频段
function concatenateAudio(files: string[], outputPath: string): void {
  const listPath = path.join(tempDir, `list_${Date.now()}.txt`);
  const listContent = files.map(f => `file '${f}'`).join('\n');
  fs.writeFileSync(listPath, listContent);
  
  execSync(`ffmpeg -y -f concat -safe 0 -i "${listPath}" -c:a libmp3lame -q:a 4 "${outputPath}" 2>/dev/null`);
  
  fs.unlinkSync(listPath);
}

// 生成完整的冥想音频
async function generateMeditationAudio(id: string, script: typeof MEDITATION_SCRIPTS.morning) {
  console.log(`\n[${script.name}] 开始生成...`);
  
  const audioFiles: string[] = [];
  
  for (let i = 0; i < script.segments.length; i++) {
    const segment = script.segments[i];
    console.log(`  段落 ${i + 1}/${script.segments.length}: ${segment.silence ? `静默 ${segment.duration}秒` : `语音 ~${segment.duration}秒`}`);
    
    if (segment.silence) {
      // 生成静默
      const silenceFile = generateSilence(segment.duration);
      audioFiles.push(silenceFile);
    } else {
      // 生成语音
      const speechFile = await generateSpeech(segment.text);
      const actualDuration = getAudioDuration(speechFile);
      
      // 如果语音比预期短，补静默
      if (actualDuration < segment.duration) {
        const paddingDuration = segment.duration - actualDuration;
        const paddingFile = generateSilence(paddingDuration);
        audioFiles.push(speechFile, paddingFile);
      } else {
        audioFiles.push(speechFile);
      }
    }
  }
  
  // 拼接所有音频
  const outputPath = path.join(outputDir, `${id}.mp3`);
  concatenateAudio(audioFiles, outputPath);
  
  // 清理临时文件
  audioFiles.forEach(f => {
    try { fs.unlinkSync(f); } catch {}
  });
  
  const finalDuration = getAudioDuration(outputPath);
  const min = Math.floor(finalDuration / 60);
  const sec = Math.floor(finalDuration % 60);
  
  console.log(`  ✓ 完成: ${min}分${sec}秒`);
  
  return outputPath;
}

// 主函数
async function main() {
  console.log('=== 开始生成冥想引导音频 ===\n');
  console.log('说明：每段音频约7分钟，包含语音引导和静默时间\n');
  
  for (const [id, script] of Object.entries(MEDITATION_SCRIPTS)) {
    await generateMeditationAudio(id, script);
  }
  
  console.log('\n=== 全部完成 ===\n');
  
  // 显示结果
  for (const id of Object.keys(MEDITATION_SCRIPTS)) {
    const file = path.join(outputDir, `${id}.mp3`);
    const stats = fs.statSync(file);
    const duration = getAudioDuration(file);
    const min = Math.floor(duration / 60);
    const sec = Math.floor(duration % 60);
    console.log(`  ${id}.mp3: ${min}分${sec}秒 (${(stats.size / 1024 / 1024).toFixed(1)}MB)`);
  }
  
  // 同步到小程序目录
  console.log('\n同步到小程序目录...');
  const miniprogramDir = '/workspace/projects/vibecoding-production/mingxiangye/miniprogram/audio';
  for (const id of Object.keys(MEDITATION_SCRIPTS)) {
    const src = path.join(outputDir, `${id}.mp3`);
    const dst = path.join(miniprogramDir, `${id}.mp3`);
    fs.copyFileSync(src, dst);
  }
  console.log('✅ 同步完成！');
}

main().catch(console.error);
