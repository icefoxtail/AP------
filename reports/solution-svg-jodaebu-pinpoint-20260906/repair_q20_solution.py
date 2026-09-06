from pathlib import Path
import re

TARGET = Path(__file__).resolve().parents[2] / "archive/exams/original/high/h2/2mid/24_조대부고_2학기_중간_고2_수학II.js"
text = TARGET.read_text(encoding="utf-8")
pattern = re.compile(r'요구한 증감표는 다음과 같다\. <table[\s\S]*?</table>')
text, count = pattern.subn(lambda _: '요구한 증감표는 아래 해설 그림으로 확인한다.', text, count=1)
if count != 1:
    raise SystemExit("q20 solution table fragment not found")
TARGET.write_text(text, encoding="utf-8", newline="\n")
print("q20 solution now delegates the required sign table to its validated solution visual")
