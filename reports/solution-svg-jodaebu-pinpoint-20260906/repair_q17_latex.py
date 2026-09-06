from pathlib import Path

TARGET = Path(__file__).resolve().parents[2] / "archive/exams/original/high/h2/2mid/24_조대부고_2학기_중간_고2_수학II.js"
text = TARGET.read_text(encoding="utf-8")
for old, new in {
    "$t<\\dfrac23$": "$t<\\\\dfrac23$",
    "$t=\\dfrac23$": "$t=\\\\dfrac23$",
    "$\\dfrac23<t<2$": "$\\\\dfrac23<t<2$",
}.items():
    text = text.replace(old, new)
TARGET.write_text(text, encoding="utf-8", newline="\n")
print("q17 LaTeX backslashes restored")
