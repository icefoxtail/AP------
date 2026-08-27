from __future__ import annotations

import hashlib
import json
from pathlib import Path

import pdfplumber

REPO = Path(r"C:\Users\USER\Desktop\AP------")
OUT = REPO / "reports" / "h1-similar-full-audit-loop-20260826"
PDF_OUT = REPO / "tmp" / "pdfs" / "h1-loop-20260826"

TARGETS = [
    ("2mid", "25_금당고_2학기_중간_고1_유사.js", None, 22),
    ("2mid", "25_매산고_2학기_중간_고1_유사.js", None, 20),
    ("2mid", "25_순천고_2학기_중간_고1_유사.js", r"D:\기출\(3)2중간\공통수학2\2025_순천고1_2중간.pdf", 23),
    ("2final", "25_금당고_2학기_기말_고1_유사.js", r"D:\기출\(4)2기말\공통수학2\2025_금당고1_2기말.pdf", 22),
    ("2final", "25_순천고_2학기_기말_고1_유사.js", r"D:\기출\(4)2기말\공통수학2\2025_순천고1_2기말.pdf", 23),
    ("2final", "25_제일고_2학기_기말_고1_유사.js", r"D:\기출\(4)2기말\공통수학2\2025_제일고1_2기말.pdf", 22),
    ("2final", "25_팔마고_2학기_기말_고1_유사.js", None, 23),
    ("2final", "25_효천고_2학기_기말_고1_유사.js", r"D:\기출\(4)2기말\공통수학2\2025_효천고1_공통수학2_2기말.pdf", 23),
]

def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def page_files(pdf_path: Path) -> list[str]:
    d = PDF_OUT / pdf_path.stem.replace(" ", "_")
    return [str(p) for p in sorted(d.glob("page-*.png"))]

inventory = []
for term, sim_name, pdf_name, expected_q in TARGETS:
    row = {"term": term, "similar": sim_name, "expectedQuestionCount": expected_q,
           "pdf": pdf_name, "available": False, "pageCount": 0, "renderedPageCount": 0,
           "pages": [], "sha256": None, "textChars": 0, "text": []}
    if pdf_name:
        pdf_path = Path(pdf_name)
        row["available"] = pdf_path.exists()
        if row["available"]:
            row["sha256"] = sha256(pdf_path)
            with pdfplumber.open(str(pdf_path)) as pdf:
                row["pageCount"] = len(pdf.pages)
                for i, page in enumerate(pdf.pages, 1):
                    text = page.extract_text(x_tolerance=1, y_tolerance=3) or ""
                    row["text"].append({"page": i, "chars": len(text), "text": text})
            row["textChars"] = sum(p["chars"] for p in row["text"])
            row["pages"] = page_files(pdf_path)
            row["renderedPageCount"] = len(row["pages"])
    inventory.append(row)

OUT.mkdir(parents=True, exist_ok=True)
(OUT / "source-pdf-inventory.json").write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding="utf-8")
(OUT / "source-pdf-text.json").write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps([{k: r[k] for k in ("similar", "available", "pageCount", "renderedPageCount", "expectedQuestionCount", "textChars", "sha256")} for r in inventory], ensure_ascii=False, indent=2))
