#!/bin/bash
# \tf → \frac 일괄 변환 스크립트
# 실행 환경: Windows Git Bash
# 사용법: JS 파일들이 있는 폴더에서 bash convert_tf.sh

echo "===== \tf → \frac 변환 시작 ====="
echo ""

count=0

for f in *.js; do
  if grep -q "\\\\tf{" "$f"; then
    sed -i 's/\\tf{/\\frac{/g' "$f"
    echo "✓ $f 변환됨"
    ((count++))
  else
    echo "- $f 변환 불필요 (스킵)"
  fi
done

echo ""
echo "===== 완료: 총 ${count}개 파일 변환 ====="
echo ""

# 잔재 확인
remaining=$(grep -rl "\\\\tf{" *.js 2>/dev/null)
if [ -z "$remaining" ]; then
  echo "✅ 잔재 없음 - GitHub push 해도 됩니다"
else
  echo "⚠️ 아직 \\tf{ 남아있는 파일:"
  echo "$remaining"
fi
