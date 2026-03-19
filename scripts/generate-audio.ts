/**
 * 冥想引导音频生成脚本
 * 使用 TTS 生成三段云英引导音频
 */

import { TTSClient, Config } from 'coze-coding-dev-sdk';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// 冥想引导文本
const MEDITATION_SCRIPTS = {
  morning: `晨曦云英，清晨冥想引导。

现在，请找一个安静舒适的地方坐下。
轻轻闭上眼睛，感受清晨的第一缕阳光。

深呼吸，吸气... 呼气...
让清新的空气充满你的身体。

想象自己置身于一片宁静的山林，
晨雾缭绕，鸟儿轻唱。
阳光透过树叶，洒下点点金光。

每一次呼吸，都让身体更加放松。
每一次呼气，都带走一夜的疲惫。

今天是新的一天，
带着希望和期待，
开启美好的一天。

继续深呼吸，吸气... 呼气...
感受内心的平静与安宁。`,

  noon: `午间云英，正午冥想引导。

此刻，请暂时放下手中的事务，
找一个安静的角落坐下。

闭上眼睛，让身体放松。
深呼吸，吸气... 呼气...

正午的阳光正暖，
想象它照在你的身上，
温暖而舒适。

让思绪像云一样飘过，
不追逐，不抗拒，
只是静静地看着它们。

每一次呼吸，
都让紧张和压力慢慢释放。
肩膀放松，手臂放松，
整个身体都变得轻盈。

此刻，你与自己在一起，
平静，安详，自在。

继续深呼吸，吸气... 呼气...`,

  evening: `暮色云英，傍晚冥想引导。

夜幕即将降临，
是时候让心灵回家了。

请找一个安静的地方坐下，
轻轻闭上眼睛。

深呼吸，吸气... 呼气...
让白天的忙碌慢慢沉淀。

想象夕阳西下，
天边染上温柔的橙红色。
余晖洒在大地上，
一切都变得柔和而宁静。

这一天，无论发生了什么，
都已经过去了。
此刻，只有你和当下的宁静。

感谢今天的自己，
感谢每一次经历，
感谢此刻的平静。

随着呼吸，
让身心慢慢放松，
准备迎接一个安稳的夜晚。

继续深呼吸，吸气... 呼气...`,
};

async function generateAudio() {
  const config = new Config();
  const client = new TTSClient(config);
  
  const outputDir = '/workspace/projects/vibecoding-production/mingxiangye/public/audio';
  
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 使用温柔的女声
  const speaker = 'zh_female_vv_uranus_bigtts';

  for (const [id, text] of Object.entries(MEDITATION_SCRIPTS)) {
    console.log(`\n[${id}] 开始生成...`);
    
    try {
      const response = await client.synthesize({
        uid: 'mingxiangye',
        text,
        speaker,
        audioFormat: 'mp3',
        sampleRate: 24000,
        speechRate: -10, // 稍慢一点，更有冥想感
      });

      console.log(`[${id}] 音频URL: ${response.audioUri}`);
      console.log(`[${id}] 音频大小: ${response.audioSize} bytes`);

      // 下载音频文件
      const audioData = await axios.get(response.audioUri, { 
        responseType: 'arraybuffer' 
      });
      
      const outputPath = path.join(outputDir, `${id}.mp3`);
      fs.writeFileSync(outputPath, audioData.data);
      
      console.log(`[${id}] 已保存: ${outputPath}`);
    } catch (error) {
      console.error(`[${id}] 生成失败:`, error);
    }
  }

  console.log('\n✅ 音频生成完成！');
}

generateAudio().catch(console.error);
