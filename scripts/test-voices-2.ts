/**
 * 声音测试脚本 - 第二批测试
 */

import { TTSClient, Config } from 'coze-coding-dev-sdk';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const config = new Config();
const client = new TTSClient(config);

const tempDir = '/tmp/voice_test2';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// 测试文本
const TEST_TEXT = '早安。请找一个安静的地方坐下，轻轻闭上眼睛。让我们从呼吸开始。深深地吸气，感受清晨的空气充满身体。';

// 更多候选声音
const VOICES = [
  {
    id: 'zh_female_xiaohe_uranus_bigtts',
    name: 'Xiaohe',
    desc: '默认通用女声',
  },
  {
    id: 'zh_female_xueayi_saturn_bigtts',
    name: 'Xueayi',
    desc: '有声书朗读，讲故事风格',
  },
  {
    id: 'zh_female_jitangnv_saturn_bigtts',
    name: 'Jitangnv',
    desc: '激励型女性',
  },
  {
    id: 'saturn_zh_female_keainvsheng_tob',
    name: 'Keainvsheng',
    desc: '可爱女生',
  },
  {
    id: 'saturn_zh_female_tiaopigongzhu_tob',
    name: 'Tiaopigongzhu',
    desc: '调皮公主',
  },
  // 男声也试试
  {
    id: 'zh_male_ruyayichen_saturn_bigtts',
    name: 'Ruyayichen_M',
    desc: '儒雅男声',
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
      speechRate: -15,
    });

    const audioData = await axios.get(response.audioUri, { responseType: 'arraybuffer' });
    const outputPath = path.join(tempDir, `test_${voice.name}.mp3`);
    fs.writeFileSync(outputPath, audioData.data);
    
    console.log(`  ✓ 已生成: ${outputPath}`);
    return outputPath;
  } catch (error: any) {
    console.error(`  ✗ 失败: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('=== 冥想引导声音测试 - 第二批 ===\n');
  
  for (const voice of VOICES) {
    await testVoice(voice);
  }
  
  console.log('\n=== 测试完成 ===');
}

main().catch(console.error);
