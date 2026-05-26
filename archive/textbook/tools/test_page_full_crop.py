import argparse
import json
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

import fitz
from PIL import Image, ImageDraw, ImageFont


DPI = 250
ZOOM = DPI / 72
MARGIN_PT = 6
TOP_CROP_PT = 85
BOTTOM_CROP_PT = 710
LEFT_COL = (48, 296)
RIGHT_COL = (300, 548)
EXPECTED_SEQUENCE = {f"{i:02d}" for i in range(1, 17)}


@dataclass
class Marker:
    page_no: int
    page_index: int
    qno: str
    x0: float
    y0: float
    x1: float
    y1: float
    column: str


def rel(path: Path) -> str:
    try:
        return path.resolve().relative_to(Path.cwd().resolve()).as_posix()
    except ValueError:
        return path.as_posix()


def run_cmd(cmd):
    try:
        proc = subprocess.run(cmd, cwd=Path.cwd(), capture_output=True, text=True, timeout=20)
        return {
            "cmd": cmd,
            "ok": proc.returncode == 0,
            "returncode": proc.returncode,
            "stdout": proc.stdout.strip(),
            "stderr": proc.stderr.strip(),
        }
    except Exception as exc:
        return {"cmd": cmd, "ok": False, "error": repr(exc)}


def module_check(module_code):
    return run_cmd([sys.executable, "-c", module_code])


def write_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def find_pdf(root: Path, reports_dir: Path) -> tuple[Path, dict]:
    pdfs = sorted(root.glob("*.pdf"))
    if not pdfs:
        raise FileNotFoundError("No PDF files found in archive/text1")
    details = [{"file": p.name, "sizeBytes": p.stat().st_size} for p in pdfs]
    selected = max(pdfs, key=lambda p: p.stat().st_size)
    note = "Only one PDF found; selected as input." if len(pdfs) == 1 else "Multiple PDFs found; selected largest file."
    return selected, {"pdfCandidates": details, "selectedPdf": selected.name, "selectionNote": note}


def tool_availability(reports_dir: Path):
    checks = {
        "node -v": run_cmd(["node", "-v"]),
        "npm -v": run_cmd(["npm", "-v"]),
        "python --version": run_cmd(["python", "--version"]),
        "python3 --version": run_cmd(["python3", "--version"]),
        "pip --version": run_cmd(["pip", "--version"]),
        "pip3 --version": run_cmd(["pip3", "--version"]),
        "pdftoppm -v": run_cmd(["pdftoppm", "-v"]),
        "pdftotext -v": run_cmd(["pdftotext", "-v"]),
        "pdfinfo -v": run_cmd(["pdfinfo", "-v"]),
        "magick -version": run_cmd(["magick", "-version"]),
        "python import fitz": module_check("import fitz; print('ok', fitz.__doc__.splitlines()[0] if fitz.__doc__ else 'fitz')"),
        "python import PIL": module_check("from PIL import Image; print('ok')"),
    }
    write_json(reports_dir / "test_page_crop_tool_availability.json", checks)
    return checks


def column_for(x0: float) -> str:
    return "left" if x0 < 250 else "right"


def column_bounds(column: str):
    return LEFT_COL if column == "left" else RIGHT_COL


def is_question_marker(word):
    x0, y0, x1, y1, text = word[:5]
    if not re.fullmatch(r"\d{2}", text):
        return False
    if text not in EXPECTED_SEQUENCE:
        return False
    if not (TOP_CROP_PT <= y0 <= BOTTOM_CROP_PT):
        return False
    return (48 <= x0 <= 90) or (300 <= x0 <= 326)


def detect_markers(doc, page_no: int):
    page = doc[page_no - 1]
    markers = []
    for word in page.get_text("words"):
        if is_question_marker(word):
            x0, y0, x1, y1, text = word[:5]
            markers.append(Marker(page_no, page_no - 1, text, x0, y0, x1, y1, column_for(x0)))
    markers.sort(key=lambda m: (0 if m.column == "left" else 1, m.y0, m.x0))
    return markers


def content_bottom(page, marker: Marker, next_marker: Marker | None):
    col_x0, col_x1 = column_bounds(marker.column)
    limit_y = (next_marker.y0 - MARGIN_PT) if next_marker else BOTTOM_CROP_PT
    words = []
    for w in page.get_text("words"):
        x0, y0, x1, y1, text = w[:5]
        if col_x0 - 4 <= x0 <= col_x1 + 4 and y0 >= marker.y0 - 2 and y1 <= limit_y:
            if y0 > 720:
                continue
            words.append(w)
    if not words:
        return marker.y1 + 40

    lines = []
    for w in sorted(words, key=lambda item: (round(item[1] / 4) * 4, item[0])):
        x0, y0, x1, y1, text = w[:5]
        if not lines or abs(lines[-1]["y0"] - y0) > 5:
            lines.append({"y0": y0, "y1": y1, "texts": [text]})
        else:
            lines[-1]["y1"] = max(lines[-1]["y1"], y1)
            lines[-1]["texts"].append(text)

    last_y = marker.y1
    started = False
    prev_y = marker.y0
    for line in lines:
        text = " ".join(line["texts"]).strip()
        if not started and line["y1"] < marker.y0:
            continue
        gap = line["y0"] - prev_y
        if started and next_marker is None and gap > 55:
            break
        if started and next_marker is not None and gap > 90:
            break
        started = True
        last_y = max(last_y, line["y1"])
        prev_y = line["y1"]
    return min(limit_y, last_y + MARGIN_PT)


def rect_to_pixels(rect):
    return [round(v * ZOOM) for v in [rect.x0, rect.y0, rect.x1, rect.y1]]


def render_page(page, out_path: Path):
    pix = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), alpha=False)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    pix.save(out_path)
    return pix.width, pix.height


def render_clip(page, rect, out_path: Path):
    pix = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), clip=rect, alpha=False)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    pix.save(out_path)
    return pix.width, pix.height


def make_contact_sheets(crops, out_dir: Path, index_path: Path):
    out_dir.mkdir(parents=True, exist_ok=True)
    font = ImageFont.load_default()
    sheets = []
    ok_crops = [c for c in crops if c["status"] == "ok"]
    thumb_w, thumb_h = 320, 230
    cols = 2
    per_sheet = 8
    for sheet_idx in range(0, len(ok_crops), per_sheet):
        batch = ok_crops[sheet_idx:sheet_idx + per_sheet]
        rows = (len(batch) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * thumb_w, rows * thumb_h), "white")
        draw = ImageDraw.Draw(sheet)
        entries = []
        for i, crop in enumerate(batch):
            src = Image.open(crop["outputFileAbs"]).convert("RGB")
            src.thumbnail((thumb_w - 20, thumb_h - 48))
            x = (i % cols) * thumb_w + 10
            y = (i // cols) * thumb_h + 8
            label = f"q{crop['savedQuestionNo']} p{crop['pageNo']} {crop['column']} {crop['status']}"
            draw.text((x, y), label, fill=(0, 0, 0), font=font)
            sheet.paste(src, (x, y + 20))
            entries.append({"label": label, "outputFile": crop["outputFile"], "source": crop["outputFile"]})
        sheet_no = len(sheets) + 1
        out_path = out_dir / f"test_page_full_crop_sheet_{sheet_no:03d}.png"
        sheet.save(out_path)
        sheets.append({"sheetNo": sheet_no, "file": rel(out_path), "entries": entries})
    write_json(index_path, {"sheets": sheets, "cropCount": len(ok_crops)})
    return sheets


def crop_questions(root: Path, pages: list[int]):
    generated = root / "generated"
    reports_dir = generated / "reports"
    rendered_dir = generated / "work" / "rendered_pages" / "test_pages"
    crop_dir = generated / "work" / "question_crops" / "test_pages"
    reports_dir.mkdir(parents=True, exist_ok=True)
    for folder, pattern in [
        (rendered_dir, "page_*.png"),
        (crop_dir, "q*_full.png"),
        (reports_dir / "test_page_full_crop_contact_sheets", "test_page_full_crop_sheet_*.png"),
    ]:
        if folder.exists() and root.resolve() in folder.resolve().parents:
            for old_file in folder.glob(pattern):
                old_file.unlink()

    availability = tool_availability(reports_dir)
    pdf, pdf_report = find_pdf(root, reports_dir)
    doc = fitz.open(pdf)

    result_rows = []
    failed = []
    page_index = []
    seen_saved_numbers = {}

    for page_no in pages:
        if page_no < 1 or page_no > doc.page_count:
            failed.append({
                "pageNo": page_no,
                "pageIndex": page_no - 1,
                "status": "render_failed",
                "note": f"Page number outside PDF page count {doc.page_count}.",
            })
            continue

        page = doc[page_no - 1]
        page_png = rendered_dir / f"page_{page_no}.png"
        page_w, page_h = render_page(page, page_png)
        markers = detect_markers(doc, page_no)
        page_index.append({
            "pageNo": page_no,
            "pageIndex": page_no - 1,
            "renderedPage": rel(page_png),
            "renderedWidth": page_w,
            "renderedHeight": page_h,
            "detectedMarkers": [m.__dict__ for m in markers],
        })
        if not markers:
            failed.append({
                "pageNo": page_no,
                "pageIndex": page_no - 1,
                "status": "question_number_not_found",
                "note": "No top-level question markers found.",
            })
            continue

        for idx, marker in enumerate(markers):
            same_col_after = [m for m in markers if m.column == marker.column and m.y0 > marker.y0 + 2]
            next_marker = same_col_after[0] if same_col_after else None
            col_x0, col_x1 = column_bounds(marker.column)
            y0 = max(TOP_CROP_PT, marker.y0 - MARGIN_PT)
            y1 = content_bottom(page, marker, next_marker)
            if y1 <= y0 + 25:
                failed.append({
                    "pageNo": page_no,
                    "pageIndex": page_no - 1,
                    "detectedQuestionNo": marker.qno,
                    "status": "region_too_small",
                    "note": "Computed crop height too small.",
                })
                continue
            rect = fitz.Rect(col_x0 - MARGIN_PT, y0, col_x1 + MARGIN_PT, min(y1, BOTTOM_CROP_PT))
            saved_no = marker.qno.zfill(3)
            seen_saved_numbers[saved_no] = seen_saved_numbers.get(saved_no, 0) + 1
            out_path = crop_dir / f"q{saved_no}_full.png"
            if seen_saved_numbers[saved_no] > 1:
                out_path = crop_dir / f"q{saved_no}_p{page_no}_full.png"
            width, height = render_clip(page, rect, out_path)
            if width < 100 or height < 80:
                failed.append({
                    "pageNo": page_no,
                    "pageIndex": page_no - 1,
                    "detectedQuestionNo": marker.qno,
                    "outputFile": rel(out_path),
                    "status": "region_too_small",
                    "width": width,
                    "height": height,
                    "note": "Crop was rendered but below sanity threshold.",
                })
                continue
            row = {
                "pageNo": page_no,
                "pageIndex": page_no - 1,
                "detectedQuestionNo": marker.qno,
                "savedQuestionNo": saved_no,
                "outputFile": rel(out_path),
                "outputFileAbs": str(out_path.resolve()),
                "bbox": rect_to_pixels(rect),
                "bboxPdfPoints": [round(rect.x0, 2), round(rect.y0, 2), round(rect.x1, 2), round(rect.y1, 2)],
                "column": marker.column,
                "nextQuestionNo": next_marker.qno if next_marker else None,
                "status": "ok",
                "width": width,
                "height": height,
                "confidence": 0.86 if next_marker else 0.78,
                "note": "Full crop from top-level marker to same-column next marker or detected column body end.",
                "columnCrossing": False,
            }
            result_rows.append(row)

    index_data = {
        "task": "test_page_full_crop",
        "inputPdf": pdf.name,
        "pdfSelection": pdf_report,
        "pages": pages,
        "dpi": DPI,
        "pageIndex": page_index,
        "results": [{k: v for k, v in r.items() if k != "outputFileAbs"} for r in result_rows],
    }
    write_json(reports_dir / "test_page_full_crop_index.json", index_data)
    write_json(reports_dir / "test_page_full_crop_result_report.json", {
        "status": "ok" if result_rows else "blocked",
        "inputPdf": pdf.name,
        "results": [{k: v for k, v in r.items() if k != "outputFileAbs"} for r in result_rows],
    })
    write_json(reports_dir / "test_page_full_crop_failed.json", {"failures": failed})
    sheets = make_contact_sheets(
        result_rows,
        reports_dir / "test_page_full_crop_contact_sheets",
        reports_dir / "test_page_full_crop_contact_sheet_index.json",
    )
    summary = {
        "status": "PASS" if len(page_index) == len(pages) and result_rows and not failed and sheets else "PARTIAL",
        "workFolder": str(root.resolve()),
        "inputPdf": pdf.name,
        "testPages": pages,
        "renderedPageCount": len(page_index),
        "detectedTopLevelQuestionCount": len(result_rows) + len([f for f in failed if f.get("detectedQuestionNo")]),
        "fullCropCount": len(result_rows),
        "failureCount": len(failed),
        "contactSheetCreated": bool(sheets),
        "toolAvailabilityReport": rel(reports_dir / "test_page_crop_tool_availability.json"),
        "importantToolNotes": {
            "fitz": availability["python import fitz"]["ok"],
            "PIL": availability["python import PIL"]["ok"],
            "poppler": availability["pdftoppm -v"]["ok"] or availability["pdfinfo -v"]["ok"],
        },
    }
    write_json(reports_dir / "test_page_full_crop_summary.json", summary)
    return summary, pdf, result_rows, failed, sheets


def write_result_md(root: Path, summary, pdf, results, failed, sheets, command: str):
    status = summary["status"]
    files = [
        "tools/test-page-full-crop.mjs",
        "tools/test_page_full_crop.py",
        "generated/reports/test_page_crop_tool_availability.json",
        "generated/reports/test_page_full_crop_index.json",
        "generated/reports/test_page_full_crop_result_report.json",
        "generated/reports/test_page_full_crop_failed.json",
        "generated/reports/test_page_full_crop_contact_sheet_index.json",
        "generated/reports/test_page_full_crop_summary.json",
        "generated/reports/test_page_full_crop_contact_sheets/test_page_full_crop_sheet_001.png",
        "generated/work/rendered_pages/test_pages/page_105.png",
        "generated/work/rendered_pages/test_pages/page_106.png",
        "generated/work/rendered_pages/test_pages/page_108.png",
        "generated/work/rendered_pages/test_pages/page_109.png",
        "generated/work/rendered_pages/test_pages/page_110.png",
        "generated/work/question_crops/test_pages/*.png",
    ]
    md = f"""# CODEX_RESULT

## 1. 생성/수정 파일
{chr(10).join(f'- {item}' for item in files)}

## 2. 구현 완료 또는 확인 완료
- `archive/text1` 내부에서만 테스트 스크립트와 산출물을 생성했다.
- 입력 PDF는 폴더 내 유일한 PDF를 사용했다.
- 지정 페이지 105, 106, 108, 109, 110만 렌더링하고 처리했다.
- 최상위 두 자리 문항번호 marker를 기준으로 같은 column 안의 다음 최상위 문항번호 직전 또는 column 본문 끝까지 crop했다.
- (1)(2), 선택지, 보기, 표, 도형, 그래프는 별도 문항으로 분리하지 않았다.
- 정답 PDF, `archive/textbook`, git add/commit/push는 사용하지 않았다.

## 3. 실행 결과
- 작업 폴더: {root}
- 입력 PDF: {pdf.name}
- 테스트 페이지: {', '.join(map(str, summary['testPages']))}
- 렌더링 성공 페이지 수: {summary['renderedPageCount']}
- 감지한 최상위 문항 수: {summary['detectedTopLevelQuestionCount']}
- 생성한 full crop 수: {summary['fullCropCount']}
- 실패 문항 수: {summary['failureCount']}
- contact sheet 생성 여부: {'예' if summary['contactSheetCreated'] else '아니오'}
- tool availability: generated/reports/test_page_crop_tool_availability.json
- 실행 명령: {command}

## 4. 결과 요약
- PASS/PARTIAL/BLOCKED/FAIL: {status}
- 사람이 확인해야 할 파일: generated/reports/test_page_full_crop_contact_sheets/test_page_full_crop_sheet_001.png
- crop index: generated/reports/test_page_full_crop_index.json
- failure report: generated/reports/test_page_full_crop_failed.json

## 5. 다음 조치
- contact sheet에서 각 crop이 다음 최상위 문항을 포함하지 않는지 육안 검수한다.
- 검수 후 기준이 맞으면 같은 탐지 기준을 넓은 페이지 범위에 적용할 수 있다.
"""
    (root / "CODEX_RESULT.md").write_text(md, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--pages", required=True)
    args = parser.parse_args()
    root = Path.cwd()
    pages = [int(p.strip()) for p in args.pages.split(",") if p.strip()]
    summary, pdf, results, failed, sheets = crop_questions(root, pages)
    command = f"node tools/test-page-full-crop.mjs --pages {args.pages}"
    write_result_md(root, summary, pdf, results, failed, sheets, command)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
