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

SETS = [
    {
        "setKey": "비상_공통수학1_경우의수_중단원학습점검_고1",
        "bookPart": "textbook",
        "publisher": "비상",
        "textbook": "공통수학1",
        "unit": "경우의수",
        "sectionType": "중단원학습점검",
        "grade": "고1",
        "pages": [105, 106],
        "sourceSectionTitle": "중단원 학습 점검",
        "expectedFirst": "01",
        "expectedLast": "11",
        "evidenceKeywords": ["중단원", "Ⅲ- 1. 경우의 수"],
    },
    {
        "setKey": "비상_공통수학1_경우의수_대단원학습평가_고1",
        "bookPart": "textbook",
        "publisher": "비상",
        "textbook": "공통수학1",
        "unit": "경우의수",
        "sectionType": "대단원학습평가",
        "grade": "고1",
        "pages": [108, 109, 110],
        "sourceSectionTitle": "대단원 학습 평가",
        "expectedFirst": "01",
        "expectedLast": "16",
        "evidenceKeywords": ["대단원 학습 평가", "Ⅲ. 경우의 수"],
    },
    {
        "setKey": "비상_공통수학1_경우의수_익힘책_고1",
        "bookPart": "workbook",
        "publisher": "비상",
        "textbook": "공통수학1",
        "unit": "경우의수",
        "sectionType": "익힘책",
        "grade": "고1",
        "pages": [138, 139],
        "sourceSectionTitle": "스스로 공부하는 수학 익힘책 Ⅲ. 경우의 수",
        "expectedFirst": "01",
        "expectedLast": "14",
        "evidenceKeywords": ["스스로 공부하는 수학 익힘책", "Ⅲ. 경우의 수"],
    },
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
    write_json(reports_dir / "cases_crop_tool_availability.json", checks)
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


def column_for(x0: float) -> str:
    return "left" if x0 < 250 else "right"


def column_bounds(column: str):
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
    chunks = []
    for page_no in pages:
        chunks.append(" ".join(doc[page_no - 1].get_text().split()))
    return " ".join(chunks)


def detect_sections(doc):
    detections = []
    for spec in SETS:
        evidence = text_for_pages(doc, spec["pages"])
        keyword_hits = [kw for kw in spec["evidenceKeywords"] if kw in evidence]
        first_page = doc[spec["pages"][0] - 1]
        last_page = doc[spec["pages"][-1] - 1]
        expected = {f"{i:02d}" for i in range(int(spec["expectedFirst"]), int(spec["expectedLast"]) + 1)}
        first_markers = detect_markers(first_page, spec["pages"][0], expected)
        last_markers = detect_markers(last_page, spec["pages"][-1], expected)
        confidence = 0.9 if keyword_hits and first_markers and last_markers else 0.55
        detections.append({
            "detectedSetKey": spec["setKey"],
            "bookPart": spec["bookPart"],
            "sectionType": spec["sectionType"],
            "startPage": spec["pages"][0],
            "endPage": spec["pages"][-1],
            "evidenceText": evidence[:700],
            "firstDisplayNo": first_markers[0].display_no if first_markers else None,
            "lastDisplayNo": last_markers[-1].display_no if last_markers else None,
            "confidence": confidence,
            "needsManualReview": confidence < 0.75,
            "note": "Detected by section header/unit text and top-level question marker range." if confidence >= 0.75 else "Section evidence or markers incomplete; manual review needed.",
        })
    return detections


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
            lines.append({"y0": y0, "y1": y1, "texts": [text]})
        else:
            lines[-1]["y1"] = max(lines[-1]["y1"], y1)
            lines[-1]["texts"].append(text)
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


def clear_cases_outputs(root: Path):
    targets = [
        root / "generated" / "work" / "question_crops" / "textbook" / SETS[0]["setKey"],
        root / "generated" / "work" / "question_crops" / "textbook" / SETS[1]["setKey"],
        root / "generated" / "work" / "question_crops" / "workbook" / SETS[2]["setKey"],
        root / "generated" / "work" / "rendered_pages" / "textbook" / SETS[0]["setKey"],
        root / "generated" / "work" / "rendered_pages" / "textbook" / SETS[1]["setKey"],
        root / "generated" / "work" / "rendered_pages" / "workbook" / SETS[2]["setKey"],
        root / "generated" / "reports" / "contact_sheets" / SETS[0]["setKey"],
        root / "generated" / "reports" / "contact_sheets" / SETS[1]["setKey"],
        root / "generated" / "reports" / "contact_sheets" / SETS[2]["setKey"],
    ]
    for target in targets:
        if target.exists() and root.resolve() in target.resolve().parents:
            shutil.rmtree(target)


def make_contact_sheet(set_key, rows, out_dir: Path):
    out_dir.mkdir(parents=True, exist_ok=True)
    font_path = Path("C:/Windows/Fonts/malgun.ttf")
    font = ImageFont.truetype(str(font_path), 9) if font_path.exists() else ImageFont.load_default()
    thumb_w, thumb_h = 430, 265
    cols = 2
    per_sheet = 8
    sheets = []
    for start in range(0, len(rows), per_sheet):
        batch = rows[start:start + per_sheet]
        sheet_no = len(sheets) + 1
        h = ((len(batch) + cols - 1) // cols) * thumb_h
        sheet = Image.new("RGB", (cols * thumb_w, h), "white")
        draw = ImageDraw.Draw(sheet)
        entries = []
        for i, row in enumerate(batch):
            src = Image.open(row["finalCropPathAbs"]).convert("RGB")
            src.thumbnail((thumb_w - 20, thumb_h - 70))
            x = (i % cols) * thumb_w + 10
            y = (i // cols) * thumb_h + 8
            draw.text((x, y), set_key, fill=(0, 0, 0), font=font)
            label = f"q{row['finalQuestionId']:03d} page{row['pageNo']} display{row['displayNo']} {row['column']} {row['status']}"
            draw.text((x, y + 12), label, fill=(0, 0, 0), font=font)
            sheet.paste(src, (x, y + 34))
            entries.append({
                "setKey": set_key,
                "finalQuestionId": row["finalQuestionId"],
                "pageNo": row["pageNo"],
                "displayNo": row["displayNo"],
                "column": row["column"],
                "status": row["status"],
                "finalCropPath": row["finalCropPath"],
            })
        out_path = out_dir / f"cases_crop_sheet_{sheet_no:03d}.png"
        sheet.save(out_path)
        sheets.append({"setKey": set_key, "sheetNo": sheet_no, "file": rel(out_path), "entries": entries})
    return sheets


def crop_sets(root: Path):
    reports_dir = root / "generated" / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)
    availability = tool_availability(reports_dir)
    pdf, pdf_report = find_pdf(root)
    doc = fitz.open(pdf)
    clear_cases_outputs(root)
    detections = detect_sections(doc)
    write_json(reports_dir / "section_set_detection_cases_report.json", {
        "inputPdf": pdf.name,
        "pdfSelection": pdf_report,
        "detections": detections,
    })

    failed = []
    map_rows = []
    result_sets = []
    contact_index = []
    rendered_count = 0

    for spec, detection in zip(SETS, detections):
        if detection["needsManualReview"]:
            failed.append({
                "setKey": spec["setKey"],
                "status": "section_not_found",
                "note": detection["note"],
            })
            result_sets.append({"setKey": spec["setKey"], "status": "manual_review", "cropCount": 0})
            continue

        expected = {f"{i:02d}" for i in range(int(spec["expectedFirst"]), int(spec["expectedLast"]) + 1)}
        base_crop = root / "generated" / "work" / "question_crops" / spec["bookPart"] / spec["setKey"]
        raw_dir = base_crop / "raw_by_page"
        final_dir = base_crop / "by_final_id"
        render_dir = root / "generated" / "work" / "rendered_pages" / spec["bookPart"] / spec["setKey"]
        set_rows = []

        final_id = 1
        for page_no in spec["pages"]:
            if page_no < 1 or page_no > doc.page_count:
                failed.append({"setKey": spec["setKey"], "pageNo": page_no, "status": "render_failed", "note": "Page outside PDF page count."})
                continue
            page = doc[page_no - 1]
            render_page(page, render_dir / f"page_{page_no}.png")
            rendered_count += 1
            markers = detect_markers(page, page_no, expected)
            if not markers:
                failed.append({"setKey": spec["setKey"], "pageNo": page_no, "pageIndex": page_no - 1, "status": "question_number_not_found", "note": "No top-level markers found."})
                continue
            for marker in markers:
                same_col_after = [m for m in markers if m.column == marker.column and m.y0 > marker.y0 + 2]
                next_marker = same_col_after[0] if same_col_after else None
                col_x0, col_x1 = column_bounds(marker.column)
                y0 = max(TOP_CROP_PT, marker.y0 - MARGIN_PT)
                y1 = content_bottom(page, marker, next_marker)
                rect = fitz.Rect(col_x0 - MARGIN_PT, y0, col_x1 + MARGIN_PT, min(y1, BOTTOM_CROP_PT))
                if rect.height < 25:
                    failed.append({
                        "setKey": spec["setKey"],
                        "pageNo": page_no,
                        "pageIndex": page_no - 1,
                        "displayNo": marker.display_no,
                        "status": "region_too_small",
                        "note": "Computed crop height too small.",
                    })
                    continue
                raw_file = f"{spec['setKey']}_page{page_no}_q{marker.display_no}_full.png"
                final_file = f"q{final_id:03d}_full.png"
                raw_path = raw_dir / raw_file
                final_path = final_dir / final_file
                width, height = render_clip(page, rect, raw_path)
                if width < 100 or height < 80:
                    failed.append({
                        "setKey": spec["setKey"],
                        "pageNo": page_no,
                        "pageIndex": page_no - 1,
                        "displayNo": marker.display_no,
                        "rawCropPath": rel(raw_path),
                        "status": "region_too_small",
                        "width": width,
                        "height": height,
                        "note": "Rendered crop below sanity threshold.",
                    })
                    continue
                final_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(raw_path, final_path)
                row = {
                    "setKey": spec["setKey"],
                    "bookPart": spec["bookPart"],
                    "publisher": spec["publisher"],
                    "textbook": spec["textbook"],
                    "unit": spec["unit"],
                    "sectionType": spec["sectionType"],
                    "grade": spec["grade"],
                    "pageNo": page_no,
                    "pageIndex": page_no - 1,
                    "displayNo": marker.display_no,
                    "finalQuestionId": final_id,
                    "rawCropFile": raw_file,
                    "finalCropFile": final_file,
                    "rawCropPath": rel(raw_path),
                    "finalCropPath": rel(final_path),
                    "finalCropPathAbs": str(final_path.resolve()),
                    "sourceSectionTitle": spec["sourceSectionTitle"],
                    "column": marker.column,
                    "bbox": rect_to_pixels(rect),
                    "bboxPdfPoints": [round(rect.x0, 2), round(rect.y0, 2), round(rect.x1, 2), round(rect.y1, 2)],
                    "status": "crop_success",
                    "confidence": 0.88 if next_marker else 0.8,
                    "note": "Cropped from top-level marker to same-column next marker or detected column body end.",
                    "columnCrossing": False,
                }
                set_rows.append(row)
                map_rows.append(row)
                final_id += 1

        sheets = make_contact_sheet(
            spec["setKey"],
            set_rows,
            reports_dir / "contact_sheets" / spec["setKey"],
        )
        contact_index.extend(sheets)
        result_sets.append({
            "setKey": spec["setKey"],
            "bookPart": spec["bookPart"],
            "pages": spec["pages"],
            "status": "crop_success" if set_rows else "no_crops",
            "cropCount": len(set_rows),
            "rawDir": rel(raw_dir),
            "finalDir": rel(final_dir),
            "contactSheets": [s["file"] for s in sheets],
        })

    public_rows = [{k: v for k, v in row.items() if k != "finalCropPathAbs"} for row in map_rows]
    write_json(reports_dir / "question_crop_id_map_cases.json", {"items": public_rows})
    write_json(reports_dir / "cases_full_crop_result_report.json", {
        "inputPdf": pdf.name,
        "sets": result_sets,
        "items": public_rows,
    })
    write_json(reports_dir / "cases_full_crop_failed.json", {"failures": failed})
    write_json(reports_dir / "cases_full_crop_contact_sheet_index.json", {"sheets": contact_index})

    status = "PASS" if map_rows and not failed and all(not d["needsManualReview"] for d in detections) else ("PARTIAL" if map_rows else "BLOCKED")
    summary = {
        "status": status,
        "workFolder": str(root.resolve()),
        "inputPdf": pdf.name,
        "targetUnit": "경우의 수",
        "detectedSetKeys": [d["detectedSetKey"] for d in detections if not d["needsManualReview"]],
        "textbookSetCount": len([d for d in detections if d["bookPart"] == "textbook" and not d["needsManualReview"]]),
        "workbookSetCount": len([d for d in detections if d["bookPart"] == "workbook" and not d["needsManualReview"]]),
        "renderedPageCount": rendered_count,
        "detectedTopLevelQuestionCount": len(map_rows) + len([f for f in failed if f.get("displayNo")]),
        "rawCropCount": len(map_rows),
        "finalIdCropCount": len(map_rows),
        "failureCount": len(failed),
        "contactSheetCreated": bool(contact_index),
        "toolAvailabilityReport": "generated/reports/cases_crop_tool_availability.json",
        "importantToolNotes": {
            "fitz": availability["python import fitz"]["ok"],
            "PIL": availability["python import PIL"]["ok"],
            "poppler": availability["pdftoppm -v"]["ok"] or availability["pdfinfo -v"]["ok"],
        },
    }
    write_json(reports_dir / "cases_full_crop_summary.json", summary)
    return summary, pdf, result_sets, failed


def write_result_md(root: Path, summary, pdf, result_sets, failed):
    files = [
        "CODEX_TASK_CASES_FULL_CROP_REORGANIZE.md",
        "tools/reorganize-cases-full-crop.mjs",
        "tools/reorganize_cases_full_crop.py",
        "generated/reports/cases_crop_tool_availability.json",
        "generated/reports/section_set_detection_cases_report.json",
        "generated/reports/question_crop_id_map_cases.json",
        "generated/reports/cases_full_crop_result_report.json",
        "generated/reports/cases_full_crop_failed.json",
        "generated/reports/cases_full_crop_summary.json",
        "generated/reports/cases_full_crop_contact_sheet_index.json",
        "generated/reports/contact_sheets/{setKey}/cases_crop_sheet_*.png",
        "generated/work/question_crops/textbook/{setKey}/raw_by_page/*.png",
        "generated/work/question_crops/textbook/{setKey}/by_final_id/*.png",
        "generated/work/question_crops/workbook/{setKey}/raw_by_page/*.png",
        "generated/work/question_crops/workbook/{setKey}/by_final_id/*.png",
        "generated/work/rendered_pages/textbook/{setKey}/page_*.png",
        "generated/work/rendered_pages/workbook/{setKey}/page_*.png",
    ]
    md = f"""# CODEX_RESULT

## 1. 생성/수정 파일
{chr(10).join(f'- {item}' for item in files)}

## 2. 구현 완료 또는 확인 완료
- `archive/text1` 내부에서만 cases reorganize 스크립트와 산출물을 생성했다.
- 입력 PDF는 폴더 listing 기준 유일한 PDF를 사용했다.
- 기존 `test_pages` 산출물은 삭제하지 않고, 이번 작업용 setKey 폴더에 새로 렌더링/크롭했다.
- 중단원학습점검과 대단원학습평가는 `textbook`, 익힘책은 `workbook`으로 분리했다.
- raw crop은 pageNo + displayNo 조합으로 저장했고, final id crop은 각 setKey 내부에서 q001부터 다시 시작했다.
- (1)(2), 선택지, 보기, 표, 도형, 그래프는 별도 crop으로 분리하지 않았다.
- 정답 PDF, JS 생성, assets 최종 crop, `archive/textbook`, git add/commit/push는 사용하지 않았다.

## 3. 실행 결과
- 작업 폴더: {root}
- 입력 PDF: {pdf.name}
- 대상 단원: {summary['targetUnit']}
- 감지된 setKey: {', '.join(summary['detectedSetKeys'])}
- textbook setKey 수: {summary['textbookSetCount']}
- workbook setKey 수: {summary['workbookSetCount']}
- 렌더링 성공 페이지 수: {summary['renderedPageCount']}
- 감지한 최상위 문항 수: {summary['detectedTopLevelQuestionCount']}
- 생성한 raw crop 수: {summary['rawCropCount']}
- 생성한 final id crop 수: {summary['finalIdCropCount']}
- 실패 문항 수: {summary['failureCount']}
- contact sheet 생성 여부: {'예' if summary['contactSheetCreated'] else '아니오'}
- tool availability: generated/reports/cases_crop_tool_availability.json
- 실행 명령: node tools/reorganize-cases-full-crop.mjs

## 4. 결과 요약
- PASS/PARTIAL/BLOCKED/FAIL: {summary['status']}
- 사람이 확인해야 할 파일: generated/reports/contact_sheets/비상_공통수학1_경우의수_중단원학습점검_고1/cases_crop_sheet_001.png
- 사람이 확인해야 할 파일: generated/reports/contact_sheets/비상_공통수학1_경우의수_대단원학습평가_고1/cases_crop_sheet_001.png
- 사람이 확인해야 할 파일: generated/reports/contact_sheets/비상_공통수학1_경우의수_익힘책_고1/cases_crop_sheet_001.png
- mapping report: generated/reports/question_crop_id_map_cases.json
- section detection report: generated/reports/section_set_detection_cases_report.json

## 5. 다음 조치
- contact sheet에서 각 setKey별 crop이 다음 최상위 문항을 포함하지 않는지 육안 검수한다.
- 검수 후 같은 setKey 구조를 이후 JS/assets 경로 기준으로 사용한다.
"""
    (root / "CODEX_RESULT.md").write_text(md, encoding="utf-8-sig")


def main():
    root = Path.cwd()
    summary, pdf, result_sets, failed = crop_sets(root)
    write_result_md(root, summary, pdf, result_sets, failed)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
