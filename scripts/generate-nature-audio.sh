#!/bin/bash

# 自然音音频制作脚本
# 使用 ffmpeg 合成7分钟以上的自然音音频

set -e

OUTPUT_DIR="/workspace/projects/vibecoding-production/mingxiangye/public/audio"
DURATION=420  # 7分钟 = 420秒

mkdir -p "$OUTPUT_DIR"

echo "=== 开始制作自然音音频 (7分钟+) ==="

# ==================== 1. 林间鸟鸣 ====================
echo ""
echo "【1/3】林间鸟鸣 - 使用粉红噪音模拟森林环境"

# 粉红噪音作为基底（模拟树叶沙沙声）+ 随机高频音调（模拟鸟鸣）
ffmpeg -y -f lavfi -i "anoisesrc=d=$DURATION:c=pink:r=44100,lowpass=f=4000,volume=0.35" \
    -f lavfi -i "sine=frequency=2500:duration=$DURATION,lowpass=f=4000,volume=0.02" \
    -f lavfi -i "sine=frequency=3200:duration=$DURATION,lowpass=f=5000,volume=0.015" \
    -filter_complex "amix=inputs=3:duration=first:dropout_transition=2,volume=1.2" \
    -c:a libmp3lame -q:a 4 "$OUTPUT_DIR/forest.mp3" 2>/dev/null

echo "  ✓ 林间鸟鸣已生成: forest.mp3"

# ==================== 2. 溪水潺潺 ====================
echo ""
echo "【2/3】溪水潺潺 - 使用布朗噪音模拟流水声"

# 布朗噪音（棕色噪音）最适合模拟流水声
ffmpeg -y -f lavfi -i "anoisesrc=d=$DURATION:c=brown:r=44100,highpass=f=100,lowpass=f=6000,volume=0.45" \
    -f lavfi -i "sine=frequency=100:duration=$DURATION,volume=0.05" \
    -filter_complex "amix=inputs=2:duration=first:dropout_transition=2,volume=1.3" \
    -c:a libmp3lame -q:a 4 "$OUTPUT_DIR/stream.mp3" 2>/dev/null

echo "  ✓ 溪水潺潺已生成: stream.mp3"

# ==================== 3. 古刹钟声 ====================
echo ""
echo "【3/3】古刹钟声 - 静谧背景 + 低频共鸣"

# 静谧的低频背景 + 低频正弦波（模拟远处的钟声共鸣）
ffmpeg -y -f lavfi -i "anoisesrc=d=$DURATION:c=pink:r=44100,lowpass=f=600,volume=0.12" \
    -f lavfi -i "sine=frequency=80:duration=$DURATION,volume=0.08" \
    -f lavfi -i "sine=frequency=120:duration=$DURATION,volume=0.05" \
    -filter_complex "amix=inputs=3:duration=first:dropout_transition=2,volume=1.5" \
    -c:a libmp3lame -q:a 4 "$OUTPUT_DIR/bell.mp3" 2>/dev/null

echo "  ✓ 古刹钟声已生成: bell.mp3"

# ==================== 显示结果 ====================
echo ""
echo "=== 音频生成完成 ==="
echo ""
for f in forest stream bell; do
    FILE="$OUTPUT_DIR/${f}.mp3"
    SIZE=$(ls -lh "$FILE" | awk '{print $5}')
    DUR=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$FILE" 2>/dev/null | cut -d. -f1)
    MIN=$((DUR / 60))
    SEC=$((DUR % 60))
    echo "  ${f}.mp3: ${MIN}分${SEC}秒 (${SIZE})"
done

# 同步到小程序目录
echo ""
echo "同步到小程序目录..."
cp "$OUTPUT_DIR"/forest.mp3 "$OUTPUT_DIR"/stream.mp3 "$OUTPUT_DIR"/bell.mp3 \
    /workspace/projects/vibecoding-production/mingxiangye/miniprogram/audio/

echo "✅ 全部完成！"
