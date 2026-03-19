/**
 * 声音测试脚本 - 生成多个声音样本供选择
 */

import { TTSClient, Config } from 'coze-coding-dev-sdk';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const config = new Config();
const client = new TTSClient(config);

const outputDir = '/workspace/projects/vibecoding-production/mingxiangye/public/audio';
const tempDir = '/tmp/voice_test';

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// 测试文本 - 冥想引导风格
const TEST_TEXT = '早安。请找一个安静的地方坐下，轻轻闭上眼睛。让我们从呼吸开始。深深地吸气，感受清晨的空气充满身体。';

// 候选声音列表
const VOICES = [
  {
    id: 'saturn_zh_female_cancan_tob',
    name: '知性Cancan',
    desc: '知性、让人安心',
  },
  {
    id: 'zh_female_santongyongns_saturn_bigtts',
    name: 'Smooth Female',
    desc: '顺滑、温柔',
  },
  {
    id: 'zh_female_mizai_saturn_bigtts',
    name: 'Mizai',
    desc: '视频配音，自然',
  },
  {
    id: 'zh_female_vv_uranus_bigtts',
    name: 'Vivi (当前)',
    desc: '当前使用的声音',
  },
];

async function testVoice(voice: typeof VOICES[0]) {
  console.log(`\n测试: ${voice.name} (${voice.id})`);
  console.log(`  特点: ${voice.desc}`);
  
  try {
    const response = await client.synthesize({
      uid: 'voice_test',
      text: TEST_TEXT,
      speaker: voice.id,
      audioFormat: 'mp3',
      sampleRate: 24000,
      speechRate: -15, // 更慢一点
    });

    const audioData = await axios.get(response.audioUri, { responseType: 'arraybuffer' });
    const outputPath = path.join(tempDir, `test_${voice.name.replace(/\s/g, '_')}.mp3`);
    fs.writeFileSync(outputPath, audioData.data);
    
    console.log(`  ✓ 已生成: ${outputPath}`);
    console.log(`  文件大小: ${(audioData.data.byteLength / 1024).toFixed(1)}KB`);
    
    return outputPath;
  } catch (error: any) {
    console.error(`  ✗ 失败: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('=== 冥想引导声音测试 ===\n');
  console.log('测试文本:');
  console.log(`"${TEST_TEXT}"\n`);
  
  const results: { voice: typeof VOICES[0]; path: string | null }[] = [];
  
  for (const voice of VOICES) {
    const path = await testVoice(voice);
    results.push({ voice, path });
  }
  
  console.log('\n=== 测试完成 ===\n');
  console.log('生成的测试文件:');
  for (const { voice, path } of results) {
    if (path) {
      console.log(`  - ${voice.name}: ${path}`);
    }
  }
  
  console.log('\n请试听这些文件，选择最合适的声音。');
}

main().catch(console.error);
