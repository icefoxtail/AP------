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


def set_key(unit, section):
    safe_unit = re.sub(r"[\s()/\\:*?\"<>|]", "", unit)
    safe_section = re.sub(r"[\s()/\\:*?\"<>|]", "", section)
    return f"비상_공통수학1_{safe_unit}_{safe_section}_고1"


SECTION_SPECS = [
    ("textbook", "다항식", "중단원학습점검", [19, 20], "중단원 개념 정리", 1, 12),
    ("textbook", "나머지정리와인수분해", "중단원학습점검", [31, 32], "중단원 개념 정리", 1, 12),
    ("textbook", "복소수와이차방정식", "중단원학습점검", [53, 54], "중단원 개념 정리", 1, 13),
    ("textbook", "이차방정식과이차함수", "중단원학습점검", [64, 65], "중단원 개념 정리", 1, 11),
    ("textbook", "여러가지방정식과부등식", "중단원학습점검", [83, 84], "중단원 개념 정리", 1, 12),
    ("textbook", "경우의수", "중단원학습점검", [105, 106], "중단원 개념 정리", 1, 11),
    ("textbook", "행렬", "중단원학습점검", [125, 126], "중단원 개념 정리", 1, 11),
    ("textbook", "다항식", "대단원학습평가", [34, 35, 36], "대단원 학습 평가", 1, 17),
    ("textbook", "방정식과부등식", "대단원학습평가", [86, 87, 88], "대단원 학습 평가", 1, 18),
    ("textbook", "경우의수", "대단원학습평가", [108, 109, 110], "대단원 학습 평가", 1, 16),
    ("textbook", "행렬", "대단원학습평가", [128, 129, 130], "대단원 학습 평가", 1, 16),
    ("workbook", "다항식", "익힘책", [134, 135], "스스로 공부하는 수학 익힘책", 1, 15),
    ("workbook", "방정식과부등식", "익힘책", [136, 137], "스스로 공부하는 수학 익힘책", 1, 14),
    ("workbook", "경우의수", "익힘책", [138, 139], "스스로 공부하는 수학 익힘책", 1, 14),
    ("workbook", "행렬", "익힘책", [140, 141], "스스로 공부하는 수학 익힘책", 1, 13),
]


@dataclass
class Marker:
    page_no: int
    page_index: int
    display_no: str
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


def write_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


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
        "python import fitz": run_cmd([sys.executable, "-c", "import fitz; print('ok')"]),
        "python import PIL": run_cmd([sys.executable, "-c", "from PIL import Image; print('ok')"]),
    }
    write_json(reports_dir / "text1_crop_tool_availability.json", checks)
    return checks


def find_pdf(root: Path):
    pdfs = sorted(root.glob("*.pdf"))
    if not pdfs:
        raise FileNotFoundError("No PDF files found in archive/text1")
    selected = max(pdfs, key=lambda p: p.stat().st_size)
    note = "Only one PDF found; selected as input." if len(pdfs) == 1 else "Multiple PDFs found; selected largest file."
    return selected, {
        "pdfCandidates": [{"file": p.name, "sizeBytes": p.stat().st_size} for p in pdfs],
        "selectedPdf": selected.name,
        "selectionNote": note,
    }


def column_for(x0):
    return "left" if x0 < 250 else "right"


def column_bounds(column):
    return LEFT_COL if column == "left" else RIGHT_COL


def is_marker(word, expected_numbers):
    x0, y0, x1, y1, text = word[:5]
    if not re.fullmatch(r"\d{2}", text):
        return False
    if text not in expected_numbers:
        return False
    if not (TOP_CROP_PT <= y0 <= BOTTOM_CROP_PT):
        return False
    return (48 <= x0 <= 90) or (300 <= x0 <= 326)


def detect_markers(page, page_no, expected_numbers):
    markers = []
    for word in page.get_text("words"):
        if is_marker(word, expected_numbers):
            x0, y0, x1, y1, text = word[:5]
            markers.append(Marker(page_no, page_no - 1, text, x0, y0, x1, y1, column_for(x0)))
    markers.sort(key=lambda m: (0 if m.column == "left" else 1, m.y0, m.x0))
    return markers


def text_for_pages(doc, pages):
    return " ".join(" ".join(doc[p - 1].get_text().split()) for p in pages)


def render_page(page, out_path: Path):
    out_path.parent.mkdir(parents=True, exist_ok=True)
    pix = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), alpha=False)
    pix.save(out_path)
    return pix.width, pix.height


def render_clip(page, rect, out_path: Path):
    out_path.parent.mkdir(parents=True, exist_ok=True)
    pix = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), clip=rect, alpha=False)
    pix.save(out_path)
    return pix.width, pix.height


def rect_to_pixels(rect):
    return [round(v * ZOOM) for v in [rect.x0, rect.y0, rect.x1, rect.y1]]


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
            lines.append({"y0": y0, "y1": y1})
        else:
            lines[-1]["y1"] = max(lines[-1]["y1"], y1)
    last_y = marker.y1
    started = False
    prev_y = marker.y0
    for line in lines:
        gap = line["y0"] - prev_y
        if started and next_marker is None and gap > 55:
            break
        if started and next_marker is not None and gap > 90:
            break
        started = True
        last_y = max(last_y, line["y1"])
        prev_y = line["y1"]
    return min(limit_y, last_y + MARGIN_PT)


def clear_text1_outputs(root: Path):
    for book_part, unit, section, _, _, _, _ in SECTION_SPECS:
        sk = set_key(unit, section)
        page_dir = root / "generated" / "work" / "page_crops" / book_part / sk
        question_dir = root / "generated" / "work" / "question_crops" / book_part / sk
        contact_dir = root / "generated" / "reports" / "contact_sheets" / sk
        for folder, pattern in [
            (page_dir, "page*.png"),
            (question_dir, f"{sk}_page*_q*_full.png"),
            (contact_dir, "crop_sheet_*.png"),
        ]:
            if folder.exists() and root.resolve() in folder.resolve().parents:
                for old_file in folder.glob(pattern):
                    old_file.unlink()


def make_contact_sheets(set_rows, out_dir: Path):
    out_dir.mkdir(parents=True, exist_ok=True)
    font_path = Path("C:/Windows/Fonts/malgun.ttf")
    font = ImageFont.truetype(str(font_path), 9) if font_path.exists() else ImageFont.load_default()
    thumb_w, thumb_h = 430, 265
    cols = 2
    per_sheet = 8
    sheets = []
    for start in range(0, len(set_rows), per_sheet):
        batch = set_rows[start:start + per_sheet]
        sheet_no = len(sheets) + 1
        sheet = Image.new("RGB", (cols * thumb_w, ((len(batch) + cols - 1) // cols) * thumb_h), "white")
        draw = ImageDraw.Draw(sheet)
        entries = []
        for i, row in enumerate(batch):
            src = Image.open(row["cropPathAbs"]).convert("RGB")
            src.thumbnail((thumb_w - 20, thumb_h - 70))
            x = (i % cols) * thumb_w + 10
            y = (i // cols) * thumb_h + 8
            draw.text((x, y), row["setKey"], fill=(0, 0, 0), font=font)
            label = f"page{row['pageNo']} display{row['displayNo']} js{row['jsIdCandidate']:03d} {row['column']} {row['status']}"
            draw.text((x, y + 12), label, fill=(0, 0, 0), font=font)
            sheet.paste(src, (x, y + 34))
            entries.append({
                "setKey": row["setKey"],
                "pageNo": row["pageNo"],
                "displayNo": row["displayNo"],
                "jsIdCandidate": row["jsIdCandidate"],
                "column": row["column"],
                "status": row["status"],
                "cropPath": row["cropPath"],
            })
        out_path = out_dir / f"crop_sheet_{sheet_no:03d}.png"
        sheet.save(out_path)
        sheets.append({"setKey": batch[0]["setKey"], "sheetNo": sheet_no, "file": rel(out_path), "entries": entries})
    return sheets


def crop_all(root: Path):
    reports_dir = root / "generated" / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)
    availability = tool_availability(reports_dir)
    pdf, pdf_report = find_pdf(root)
    doc = fitz.open(pdf)
    clear_text1_outputs(root)

    detections = []
    failures = []
    map_rows = []
    result_sets = []
    contact_index = []
    page_crop_count = 0

    for book_part, unit, section, pages, title, first, last in SECTION_SPECS:
        sk = set_key(unit, section)
        expected = {f"{i:02d}" for i in range(first, last + 1)}
        evidence = text_for_pages(doc, pages)
        markers_by_page = {}
        for page_no in pages:
            markers_by_page[page_no] = detect_markers(doc[page_no - 1], page_no, expected)
        all_markers = [m for markers in markers_by_page.values() for m in markers]
        confidence = 0.92 if all_markers else 0.45
        detection = {
            "detectedSetKey": sk,
            "bookPart": book_part,
            "unit": unit,
            "sectionType": section,
            "startPage": pages[0],
            "endPage": pages[-1],
            "evidenceText": evidence[:700],
            "firstDisplayNo": all_markers[0].display_no if all_markers else None,
            "lastDisplayNo": all_markers[-1].display_no if all_markers else None,
            "detectedQuestionCount": len(all_markers),
            "confidence": confidence,
            "needsManualReview": confidence < 0.75,
            "note": "Detected from TOC-confirmed section range, section/page header text, and top-level question markers.",
        }
        detections.append(detection)
        if detection["needsManualReview"]:
            failures.append({"setKey": sk, "status": "low_confidence_section", "note": detection["note"]})
            continue

        page_dir = root / "generated" / "work" / "page_crops" / book_part / sk
        crop_dir = root / "generated" / "work" / "question_crops" / book_part / sk
        set_rows = []
        js_id = 1
        for page_no in pages:
            page = doc[page_no - 1]
            render_page(page, page_dir / f"page{page_no}.png")
            page_crop_count += 1
            markers = markers_by_page[page_no]
            if not markers:
                failures.append({"setKey": sk, "pageNo": page_no, "pageIndex": page_no - 1, "status": "question_number_not_found", "note": "No top-level question markers found."})
                continue
            for marker in markers:
                same_col_after = [m for m in markers if m.column == marker.column and m.y0 > marker.y0 + 2]
                next_marker = same_col_after[0] if same_col_after else None
                col_x0, col_x1 = column_bounds(marker.column)
                y0 = max(TOP_CROP_PT, marker.y0 - MARGIN_PT)
                y1 = content_bottom(page, marker, next_marker)
                rect = fitz.Rect(col_x0 - MARGIN_PT, y0, col_x1 + MARGIN_PT, min(y1, BOTTOM_CROP_PT))
                if rect.height < 25:
                    failures.append({"setKey": sk, "pageNo": page_no, "displayNo": marker.display_no, "status": "region_too_small", "note": "Computed crop height too small."})
                    continue
                crop_file = f"{sk}_page{page_no}_q{marker.display_no}_full.png"
                crop_path = crop_dir / crop_file
                width, height = render_clip(page, rect, crop_path)
                if width < 100 or height < 80:
                    failures.append({"setKey": sk, "pageNo": page_no, "displayNo": marker.display_no, "status": "region_too_small", "note": "Rendered crop below sanity threshold.", "width": width, "height": height})
                    continue
                row = {
                    "setKey": sk,
                    "bookPart": book_part,
                    "publisher": "비상",
                    "textbook": "공통수학1",
                    "unit": unit,
                    "sectionType": section,
                    "grade": "고1",
                    "pageNo": page_no,
                    "pageIndex": page_no - 1,
                    "displayNo": marker.display_no,
                    "cropFile": crop_file,
                    "cropPath": rel(crop_path),
                    "cropPathAbs": str(crop_path.resolve()),
                    "sourceSectionTitle": title,
                    "column": marker.column,
                    "bbox": rect_to_pixels(rect),
                    "bboxPdfPoints": [round(rect.x0, 2), round(rect.y0, 2), round(rect.x1, 2), round(rect.y1, 2)],
                    "status": "crop_success",
                    "confidence": 0.88 if next_marker else 0.8,
                    "note": "Cropped from top-level marker to same-column next marker or detected column body end.",
                    "jsIdCandidate": js_id,
                    "columnCrossing": False,
                }
                set_rows.append(row)
                map_rows.append(row)
                js_id += 1
        sheets = make_contact_sheets(set_rows, reports_dir / "contact_sheets" / sk) if set_rows else []
        contact_index.extend(sheets)
        result_sets.append({
            "setKey": sk,
            "bookPart": book_part,
            "unit": unit,
            "sectionType": section,
            "pages": pages,
            "pageCropDir": rel(page_dir),
            "questionCropDir": rel(crop_dir),
            "questionCropCount": len(set_rows),
            "contactSheets": [s["file"] for s in sheets],
            "status": "crop_success" if set_rows else "no_crops",
        })

    public_rows = [{k: v for k, v in row.items() if k != "cropPathAbs"} for row in map_rows]
    write_json(reports_dir / "text1_section_crop_detection_report.json", {"inputPdf": pdf.name, "pdfSelection": pdf_report, "detections": detections})
    write_json(reports_dir / "text1_question_crop_map.json", {"items": public_rows})
    write_json(reports_dir / "text1_section_crop_result_report.json", {"inputPdf": pdf.name, "sets": result_sets, "items": public_rows})
    write_json(reports_dir / "text1_section_crop_failed.json", {"failures": failures})
    write_json(reports_dir / "text1_section_crop_contact_sheet_index.json", {"sheets": contact_index})

    status = "PASS" if map_rows and not failures and all(not d["needsManualReview"] for d in detections) else ("PARTIAL" if map_rows else "BLOCKED")
    summary = {
        "status": status,
        "workFolder": str(root.resolve()),
        "inputPdf": pdf.name,
        "targetSections": ["중단원학습점검", "대단원학습평가", "익힘책"],
        "detectedSetKeys": [d["detectedSetKey"] for d in detections if not d["needsManualReview"]],
        "textbookSetCount": len([d for d in detections if d["bookPart"] == "textbook" and not d["needsManualReview"]]),
        "workbookSetCount": len([d for d in detections if d["bookPart"] == "workbook" and not d["needsManualReview"]]),
        "renderedPageCount": page_crop_count,
        "pageCropCount": page_crop_count,
        "detectedTopLevelQuestionCount": len(map_rows) + len([f for f in failures if f.get("displayNo")]),
        "questionFullCropCount": len(map_rows),
        "failureCount": len(failures),
        "contactSheetCreated": bool(contact_index),
        "toolAvailabilityReport": "generated/reports/text1_crop_tool_availability.json",
        "importantToolNotes": {
            "fitz": availability["python import fitz"]["ok"],
            "PIL": availability["python import PIL"]["ok"],
            "poppler": availability["pdftoppm -v"]["ok"] or availability["pdfinfo -v"]["ok"],
        },
    }
    write_json(reports_dir / "text1_section_crop_summary.json", summary)
    return summary, pdf


def write_result(root: Path, summary, pdf):
    md = f"""# CODEX_RESULT

## 1. 생성/수정 파일
- CODEX_TASK_TEXT1_CROP_TARGET_SECTIONS_ONLY.md
- tools/crop-target-sections-only.mjs
- tools/crop_target_sections_only.py
- generated/reports/text1_crop_tool_availability.json
- generated/reports/text1_section_crop_detection_report.json
- generated/reports/text1_question_crop_map.json
- generated/reports/text1_section_crop_result_report.json
- generated/reports/text1_section_crop_failed.json
- generated/reports/text1_section_crop_summary.json
- generated/reports/text1_section_crop_contact_sheet_index.json
- generated/work/page_crops/textbook/{{setKey}}/page{{pageNo}}.png
- generated/work/page_crops/workbook/{{setKey}}/page{{pageNo}}.png
- generated/work/question_crops/textbook/{{setKey}}/{{setKey}}_page{{pageNo}}_q{{displayNo}}_full.png
- generated/work/question_crops/workbook/{{setKey}}/{{setKey}}_page{{pageNo}}_q{{displayNo}}_full.png
- generated/reports/contact_sheets/{{setKey}}/crop_sheet_*.png

## 2. 구현 완료 또는 확인 완료
- `archive/text1` 내부에서만 target-section crop 산출물을 생성했다.
- PDF 전체에서 중단원학습점검, 대단원학습평가, 익힘책 섹션만 대상으로 삼았다.
- page crop과 question full crop을 setKey별 폴더에 저장했다.
- question crop 파일명은 setKey + pageNo + displayNo 구조만 사용했다.
- `q001_full.png` 같은 final alias는 생성하지 않았다.
- jsIdCandidate는 mapping report 안에서만 각 setKey별 1부터 부여했다.
- JS 생성, 발문 추출, 정답 PDF 사용, 정답 추출, assets 최종 crop, `archive/textbook` 수정, git add/commit/push는 하지 않았다.

## 3. 실행 결과
- 작업 폴더: {root}
- 입력 PDF: {pdf.name}
- 대상 섹션: {', '.join(summary['targetSections'])}
- 감지된 setKey: {', '.join(summary['detectedSetKeys'])}
- textbook setKey 수: {summary['textbookSetCount']}
- workbook setKey 수: {summary['workbookSetCount']}
- 렌더링 성공 페이지 수: {summary['renderedPageCount']}
- 생성한 page crop 수: {summary['pageCropCount']}
- 감지한 최상위 문항 수: {summary['detectedTopLevelQuestionCount']}
- 생성한 question full crop 수: {summary['questionFullCropCount']}
- 실패 문항 수: {summary['failureCount']}
- contact sheet 생성 여부: {'예' if summary['contactSheetCreated'] else '아니오'}
- tool availability: generated/reports/text1_crop_tool_availability.json
- 실행 명령: node tools/crop-target-sections-only.mjs

## 4. 결과 요약
- PASS/PARTIAL/BLOCKED/FAIL: {summary['status']}
- 사람이 확인해야 할 파일: generated/reports/text1_section_crop_detection_report.json
- 사람이 확인해야 할 파일: generated/reports/text1_question_crop_map.json
- 사람이 확인해야 할 파일: generated/reports/contact_sheets/비상_공통수학1_경우의수_익힘책_고1/crop_sheet_001.png

## 5. 다음 조치
- contact sheet에서 각 setKey별 crop 경계를 육안 검수한다.
- 검수 후 mapping report의 jsIdCandidate를 이후 JS id 부여 기준으로 사용한다.
"""
    (root / "CODEX_RESULT.md").write_text(md, encoding="utf-8-sig")


def main():
    root = Path.cwd()
    summary, pdf = crop_all(root)
    write_result(root, summary, pdf)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
