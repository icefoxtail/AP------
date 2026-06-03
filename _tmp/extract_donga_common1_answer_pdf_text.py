from pathlib import Path
from pypdf import PdfReader

root = Path.cwd()
pdf = root / "archive" / "textbook" / "_동아_고등_공통수학1_교과서_정답.pdf"
out = root / "archive" / "textbook" / "_동아_고등_공통수학1_교과서" / "generated" / "reports" / "donga_common1_answer_pdf_text.txt"

reader = PdfReader(str(pdf))
parts = []
for i, page in enumerate(reader.pages, start=1):
    text = page.extract_text() or ""
    parts.append(f"\n\n=== PAGE {i} ===\n{text}")

out.parent.mkdir(parents=True, exist_ok=True)
out.write_text("".join(parts), encoding="utf-8")
print({"pages": len(reader.pages), "out": str(out), "chars": sum(len(p) for p in parts)})
