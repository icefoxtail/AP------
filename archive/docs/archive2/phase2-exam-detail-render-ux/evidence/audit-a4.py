import json
import pathlib
import sys
from pypdf import PdfReader

phase = sys.argv[1] if len(sys.argv) > 1 else "baseline"
root = pathlib.Path(__file__).resolve().parent
pdf_dir = root / "a4" / phase
expected_pages = {
    "text": {4: 5, 6: 4, 8: 3},
    "math": {4: 6, 6: 4, 8: 3},
    "geometry": {4: 6, 6: 4, 8: 3},
}
titles = {
    "text": "2026 금당고 고1 1학기 기말고사",
    "math": "2026 금당고 고2 1학기 기말고사",
    "geometry": "2026 매산고 고2 1학기 중간고사",
}
compose_expected_pages = {}
compose_summary = root / "compose-final.json"
if phase == "final" and compose_summary.exists():
    compose_data = json.loads(compose_summary.read_text(encoding="utf-8"))
    compose_expected_pages = {
        int(item["qpp"]): int(item["pages"])
        for item in compose_data.get("desktop", {}).get("qppPreview", [])
    }
report = []
failures = []
for pdf in sorted(pdf_dir.glob("*.pdf")):
    stem = pdf.stem
    fixture, mode, qpp_text = stem.rsplit("-", 2)
    qpp = int(qpp_text.removeprefix("qpp"))
    reader = PdfReader(str(pdf))
    sizes = []
    texts = []
    image_pages = 0
    for page in reader.pages:
        sizes.append((float(page.mediabox.width), float(page.mediabox.height)))
        texts.append(page.extract_text() or "")
        resources = page.get("/Resources") or {}
        xobjects = resources.get("/XObject") if hasattr(resources, "get") else None
        xobjects = xobjects.get_object() if hasattr(xobjects, "get_object") else xobjects
        if xobjects and any(obj.get_object().get("/Subtype") == "/Image" for obj in xobjects.values()):
            image_pages += 1
    all_text = chr(10).join(texts)
    width_ok = all(abs(width - 594.96) <= 1 for width, _ in sizes)
    height_ok = all(abs(height - 841.92) <= 1 for _, height in sizes)
    title_ok = fixture not in titles or titles[fixture] in texts[0]
    no_error_page = "apRenderError" not in all_text and "렌더링 중 오류가 발생했습니다" not in all_text
    expected = expected_pages.get(fixture, {}).get(qpp) if mode == "exam" else len(reader.pages)
    if fixture == "mixed-compose" and mode == "exam":
        expected = compose_expected_pages.get(qpp)
    page_count_ok = expected is None or len(reader.pages) == expected
    row = {
        "file": pdf.name,
        "bytes": pdf.stat().st_size,
        "pages": len(reader.pages),
        "expectedPages": expected,
        "allPagesA4": width_ok and height_ok,
        "headerTitleVisible": title_ok,
        "renderErrorAbsent": no_error_page,
        "pagesWithImages": image_pages,
    }
    report.append(row)
    for key, ok in [
        ("allPagesA4", width_ok and height_ok),
        ("headerTitleVisible", title_ok),
        ("renderErrorAbsent", no_error_page),
        ("pageCount", page_count_ok),
    ]:
        if not ok:
            failures.append(pdf.name + ": " + key)
result = {"phase": phase, "pdfCount": len(report), "results": report, "failures": failures}
(pdf_dir / "pdf-audit.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(result, ensure_ascii=True, indent=2))
if failures:
    raise SystemExit(1)
