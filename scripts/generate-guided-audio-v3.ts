/**
 * 冥想引导音频生成脚本 - V3
 * 背景音：全程持续低音量，语音叠加其上
 */

import { TTSClient, Config } from 'coze-coding-dev-sdk';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const config = new Config();
const client = new TTSClient(config);

const outputDir = '/workspace/projects/vibecoding-production/mingxiangye/public/audio';
const tempDir = '/tmp/meditation_audio_v3';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// 选定的声音
const SPEAKER = 'zh_female_jitangnv_saturn_bigtts';
const TOTAL_DURATION = 420; // 7分钟

// ==================== 背景音生成 ====================

// 生成持续7分钟的背景音（低频嗡鸣，极低音量）
function generateContinuousAmbient(): string {
  const outputPath = path.join(tempDir, 'ambient_continuous.mp3');
  
  // 低频正弦波 + 粉红噪音，背景音量
  execSync(`ffmpeg -y \
    -f lavfi -i "sine=frequency=55:duration=${TOTAL_DURATION},volume=0.05" \
    -f lavfi -i "sine=frequency=82:duration=${TOTAL_DURATION},volume=0.03" \
    -f lavfi -i "anoisesrc=d=${TOTAL_DURATION}:c=pink:r=24000,lowpass=f=300,volume=0.04" \
    -filter_complex "amix=inputs=3:duration=first:dropout_transition=2,volume=0.8" \
    -c:a libmp3lame -q:a 4 "${outputPath}" 2>/dev/null`);
  
  return outputPath;
}

// ==================== 语音生成 ====================

async function generateSpeech(text: string): Promise<string> {
  const response = await client.synthesize({
    uid: 'mingxiangye',
    text,
    speaker: SPEAKER,
    audioFormat: 'mp3',
    sampleRate: 24000,
    speechRate: -12,
  });

  const audioData = await axios.get(response.audioUri, { responseType: 'arraybuffer' });
  const tempPath = path.join(tempDir, `speech_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`);
  fs.writeFileSync(tempPath, audioData.data);
  return tempPath;
}

function getAudioDuration(filePath: string): number {
  const result = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`).toString().trim();
  return parseFloat(result);
}

// ==================== 冥想脚本（带时间轴）====================

interface Segment {
  text: string;
  startTime: number; // 开始时间（秒）
}

const MEDITATION_SCRIPTS = {
  morning: {
    name: '晨曦云英',
    segments: [
      { text: '早安。请找一个安静的地方坐下，轻轻闭上眼睛。', startTime: 0 },
      { text: '让我们从呼吸开始。深深地吸气，感受清晨的空气充满身体。缓缓地呼气，放下昨夜的疲惫。再来一次，吸气，呼气，让身体慢慢苏醒。', startTime: 15 },
      { text: '想象晨曦的第一缕阳光，正温柔地照在你的头顶。温暖、明亮。阳光慢慢向下，照亮你的额头、眼睛、脸颊。', startTime: 60 },
      { text: '如果思绪飘走了，没关系。温柔地把它带回到呼吸上。吸气，呼气。', startTime: 200 },
      { text: '想象阳光已经充满你的全身。你感到温暖、充满力量。今天，是全新的一天。', startTime: 330 },
      { text: '现在，慢慢地把注意力带回这个房间。轻轻动一动手指和脚趾。慢慢睁开眼睛。愿你今天充满能量和喜悦。', startTime: 390 },
    ],
  },
  noon: {
    name: '午间云英',
    segments: [
      { text: '此刻，请暂时放下手中的一切。找一个安静的角落，让自己停下来。', startTime: 0 },
      { text: '闭上眼睛。做几次深呼吸。深深地吸气，感受胸腔打开。缓缓地呼气，让紧张和压力慢慢释放。继续，吸气，呼气，肩膀放松，手臂放松，全身都变得轻盈。', startTime: 15 },
      { text: '把注意力带到你的肩膀。如果有紧绷感，允许它在这里，然后让它慢慢松开。你的后背、你的腰部，都在渐渐放松。', startTime: 60 },
      { text: '此刻，你与自己在一起。不追逐，不抗拒。只是静静地待在这里。', startTime: 200 },
      { text: '想象一阵清新的风，吹过你的全身。带走疲惫，留下清明。你已经休息好了。', startTime: 315 },
      { text: '慢慢地，把注意力带回身体。动一动手指。感受你的双脚踩在地上。缓缓睁开眼睛。带着这份清明，继续你的下午。', startTime: 370 },
    ],
  },
  evening: {
    name: '暮色云英',
    segments: [
      { text: '夜幕即将降临。是时候让心灵回家了。请找一个安静的地方坐下。', startTime: 0 },
      { text: '轻轻闭上眼睛。让我们从呼吸开始。缓缓地吸气，感受气息进入身体。慢慢地呼气，让这一天的忙碌慢慢沉淀。继续呼吸，每一次呼气，都带走一些疲惫，一些牵挂。', startTime: 15 },
      { text: '想象夕阳西下，天边染上温柔的橙红色。余晖洒在大地上，一切都变得柔和而宁静。你就在这片余晖中，安静地坐着。', startTime: 60 },
      { text: '这一天，无论发生了什么，都已经过去了。此刻，只有你和当下的宁静。', startTime: 200 },
      { text: '感谢今天的自己。感谢每一次经历，每一次相遇。放下那些未完成的事，放下所有的期待。此刻，你只需要休息。', startTime: 315 },
      { text: '慢慢地，感受你的身体。动一动手指和脚趾。深呼吸一次。缓缓睁开眼睛。愿你在今夜，拥有一个安稳的睡眠。晚安。', startTime: 370 },
    ],
  },
  sleep: {
    name: '睡前云英',
    segments: [
      { text: '晚上好。请躺在床上，让自己完全放松。不需要做任何努力，只是让自己慢慢地、深深地休息。', startTime: 0 },
      { text: '轻轻闭上眼睛。让我们从呼吸开始。慢慢地吸气，感受气息进入身体。缓缓地呼气，让身体越来越沉、越来越松。每一次呼气，都让身体更多地陷进床里。你已经累了，可以完全放下。', startTime: 20 },
      { text: '感受你的头顶，慢慢放松。额头舒展开。眼睛、脸颊、下巴都松开了。肩膀下沉，手臂变得沉重，手指自然弯曲。你的后背、腰部、双腿，都在渐渐放松。', startTime: 70 },
      { text: '如果思绪还在飘动，没关系。让它们像云一样，慢慢飘远。你只需要越来越沉、越来越放松。', startTime: 230 },
      { text: '现在，你可以让自己睡着了。什么都不需要想，什么都不需要做。只需要安心地睡去。晚安，好梦。', startTime: 330 },
    ],
  },
};

// ==================== 主生成函数 ====================

async function generateMeditationAudio(id: string, script: typeof MEDITATION_SCRIPTS.morning) {
  console.log(`\n[${script.name}] 开始生成...`);
  
  // 1. 生成持续背景音
  console.log('  生成持续背景音...');
  const ambientFile = generateContinuousAmbient();
  
  // 2. 生成所有语音段落
  console.log('  生成语音段落...');
  const speechFiles: { file: string; startTime: number; duration: number }[] = [];
  
  for (const segment of script.segments) {
    const speechFile = await generateSpeech(segment.text);
    const duration = getAudioDuration(speechFile);
    speechFiles.push({ file: speechFile, startTime: segment.startTime, duration });
    console.log(`    ${segment.startTime}s: "${segment.text.substring(0, 20)}..."`);
  }
  
  // 3. 将语音按时间位置叠加到背景音上
  console.log('  混合音频...');
  const outputPath = path.join(outputDir, `${id}.mp3`);
  
  // 构建 ffmpeg 命令
  // 背景音作为基底，每个语音用 adelay 定位后混合
  const inputs = [`-i "${ambientFile}"`];
  const filterParts: string[] = [];
  const mixInputs = ['[0:a]']; // 背景音
  
  speechFiles.forEach((sf, i) => {
    inputs.push(`-i "${sf.file}"`);
    const delayMs = Math.round(sf.startTime * 1000);
    filterParts.push(`[${i + 1}:a]adelay=${delayMs}|${delayMs}[speech${i}]`);
    mixInputs.push(`[speech${i}]`);
  });
  
  // 混合所有音轨
  const filterComplex = filterParts.join('; ') + `; ${mixInputs.join('')}amix=inputs=${mixInputs.length}:duration=first:dropout_transition=2,volume=1.5`;
  
  execSync(`ffmpeg -y ${inputs.join(' ')} -filter_complex "${filterComplex}" -t ${TOTAL_DURATION} -c:a libmp3lame -q:a 4 "${outputPath}" 2>/dev/null`);
  
  // 清理临时文件
  try { fs.unlinkSync(ambientFile); } catch {}
  speechFiles.forEach(sf => { try { fs.unlinkSync(sf.file); } catch {} });
  
  const finalDuration = getAudioDuration(outputPath);
  const min = Math.floor(finalDuration / 60);
  const sec = Math.floor(finalDuration % 60);
  console.log(`  ✓ 完成: ${min}分${sec}秒`);
  
  return outputPath;
}

// ==================== 主函数 ====================

async function main() {
  console.log('=== 冥想引导音频生成 V3 ===');
  console.log('声音: Jitangnv');
  console.log('背景: 全程持续低音量\n');
  
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
    console.log(`  ${id}.mp3: ${min}分${sec}秒 (${(stats.size / 1024).toFixed(0)}KB)`);
  }
  
  // 同步到小程序
  console.log('\n同步到小程序目录...');
  const miniprogramDir = '/workspace/projects/vibecoding-production/mingxiangye/miniprogram/audio';
  for (const id of Object.keys(MEDITATION_SCRIPTS)) {
    fs.copyFileSync(path.join(outputDir, `${id}.mp3`), path.join(miniprogramDir, `${id}.mp3`));
  }
  console.log('✅ 完成！');
}

main().catch(console.error);
