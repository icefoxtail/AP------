from pathlib import Path
from pypdf import PdfReader

root = Path.cwd()
pdf = root / "archive" / "textbook" / "_비상교육_고등_공통수학2(김원경)_정답.pdf"
out = root / "archive" / "textbook" / "_비상교육_ 고등_공통수학2(김원경)_교과서" / "generated" / "reports" / "visang_common2_answer_pdf_text.txt"

reader = PdfReader(str(pdf))
parts = []
for i, page in enumerate(reader.pages, start=1):
    parts.append(f"\n\n=== PAGE {i} ===\n{page.extract_text() or ''}")

out.parent.mkdir(parents=True, exist_ok=True)
out.write_text("".join(parts), encoding="utf-8")
print({"pages": len(reader.pages), "chars": sum(len(part) for part in parts), "out": str(out)})
