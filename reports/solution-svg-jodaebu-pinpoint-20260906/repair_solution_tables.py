from pathlib import Path
import re

TARGET = Path(__file__).resolve().parents[2] / "archive/exams/original/high/h2/2mid/24_조대부고_2학기_중간_고2_수학II.js"
text = TARGET.read_text(encoding="utf-8")
pattern = re.compile(r'따라서 전체 교점 수 \$g\(t\)\$는 <table[\s\S]*?</table> 이다\.')
new = r'따라서 전체 교점 수는 $t<\dfrac23$이면 $1$, $t=\dfrac23$이면 $2$, $\dfrac23<t<2$이면 $3$, $t=2$이면 $2$, $t>2$이면 $3$으로 분류된다.'
text, count = pattern.subn(lambda _: new, text, count=1)
if count != 1:
    raise SystemExit("q17 solution table fragment not found")
TARGET.write_text(text, encoding="utf-8", newline="\n")
print("q17 solution table replaced by rendered-safe explicit case classification")
