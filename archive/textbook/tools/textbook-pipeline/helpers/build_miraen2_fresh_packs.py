import json
import math
import os
import re
import shutil
from pathlib import Path

import fitz
from PIL import Image, ImageDraw


ROOT = Path.cwd()
PDF = next(p for p in ROOT.glob("*.pdf") if p.stat().st_size == 22968961)
OUT = ROOT / PDF.stem
GEN = OUT / "generated"
DPI = 220
SCALE = DPI / 72

SECTIONS = [
    {"unit": "도형의방정식", "section": "중단원마무리", "setKey": "미래앤_공통수학2_도형의방정식_중단원마무리_고1", "pages": [26, 27, 40, 41, 54, 55], "bookPart": "textbook"},
    {"unit": "도형의방정식", "section": "대단원평가", "setKey": "미래앤_공통수학2_도형의방정식_대단원평가_고1", "pages": [57, 58, 59], "bookPart": "textbook"},
    {"unit": "집합과명제", "section": "중단원마무리", "setKey": "미래앤_공통수학2_집합과명제_중단원마무리_고1", "pages": [78, 79, 96, 97], "bookPart": "textbook"},
    {"unit": "집합과명제", "section": "대단원평가", "setKey": "미래앤_공통수학2_집합과명제_대단원평가_고1", "pages": [99, 100, 101], "bookPart": "textbook"},
    {"unit": "함수와그래프", "section": "중단원마무리", "setKey": "미래앤_공통수학2_함수와그래프_중단원마무리_고1", "pages": [118, 119, 133, 134], "bookPart": "textbook"},
    {"unit": "함수와그래프", "section": "대단원평가", "setKey": "미래앤_공통수학2_함수와그래프_대단원평가_고1", "pages": [136, 137, 138], "bookPart": "textbook"},
]

PAGE_ALLOWED_NUMBERS = {
    26: range(1, 5),
    27: range(5, 12),
    40: range(1, 5),
    41: range(5, 12),
    54: range(1, 5),
    55: range(5, 12),
    57: range(1, 9),
    58: range(9, 16),
    59: range(16, 19),
    78: range(1, 6),
    79: range(6, 13),
    96: range(1, 5),
    97: range(5, 12),
    99: range(1, 8),
    100: range(8, 15),
    101: range(15, 18),
    118: range(1, 5),
    119: range(5, 11),
    133: range(1, 5),
    134: range(5, 11),
    136: range(1, 8),
    137: range(8, 15),
    138: range(15, 18),
}


def ensure(path):
    path.mkdir(parents=True, exist_ok=True)


def write_json(path, data):
    ensure(path.parent)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def page_text(page):
    return page.get_text("text").replace("\n", " ")


def render_page(doc, page_no, dest):
    page = doc[page_no - 1]
    pix = page.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE), alpha=False)
    ensure(dest.parent)
    pix.save(dest)
    return pix.width, pix.height


def word_number_candidates(page):
    words = page.get_text("words")
    out = []
    for w in words:
        x0, y0, x1, y1, text = w[:5]
        raw = str(text).strip()
        if re.fullmatch(r"0[1-9]|[12][0-9]|30", raw):
            n = int(raw)
            if 1 <= n <= 30:
                out.append({"displayNo": f"{n:02d}", "n": n, "bboxPt": [x0, y0, x1, y1]})
    return out


def filter_question_markers(candidates, page_width, page_height):
    filtered = []
    for c in candidates:
        x0, y0, x1, y1 = c["bboxPt"]
        if y0 < 35 or y0 > page_height - 35:
            continue
        if x0 < 25 or x0 > page_width - 25:
            continue
        # Most top-level numbers sit near the left of a column. Keep a broad range.
        column = "left" if x0 < page_width * 0.50 else "right"
        filtered.append({**c, "column": column})
    # Remove duplicated OCR words for the same printed number.
    filtered.sort(key=lambda c: (c["column"], c["bboxPt"][1], c["bboxPt"][0]))
    dedup = []
    for c in filtered:
        if dedup and c["displayNo"] == dedup[-1]["displayNo"] and abs(c["bboxPt"][1] - dedup[-1]["bboxPt"][1]) < 8:
            continue
        dedup.append(c)
    return dedup


def page_body_bounds(page_no, page_width, page_height):
    top = 45
    bottom = page_height - 45
    if page_no in (13, 33, 37, 57, 69, 89, 93, 120, 123, 142, 145):
        top = 35
    return top, bottom


def crop_regions_for_page(page, page_no):
    page_width = page.rect.width
    page_height = page.rect.height
    markers = filter_question_markers(word_number_candidates(page), page_width, page_height)
    allowed = PAGE_ALLOWED_NUMBERS.get(page_no)
    if allowed:
        allowed_set = set(allowed)
        markers = [m for m in markers if m["n"] in allowed_set]
    seen_numbers = set()
    deduped = []
    for marker in markers:
        if marker["displayNo"] in seen_numbers:
            continue
        seen_numbers.add(marker["displayNo"])
        deduped.append(marker)
    markers = deduped
    top, bottom = page_body_bounds(page_no, page_width, page_height)
    regions = []
    for idx, marker in enumerate(markers):
        x0, y0, x1, y1 = marker["bboxPt"]
        column = marker["column"]
        col_x0 = 25 if column == "left" else page_width * 0.50
        col_x1 = page_width * 0.50 if column == "left" else page_width - 25
        same_col_next = None
        for nxt in markers[idx + 1:]:
            if nxt["column"] == column and nxt["bboxPt"][1] > y0 + 8:
                same_col_next = nxt
                break
        crop_y0 = max(top, y0 - 8)
        crop_y1 = (same_col_next["bboxPt"][1] - 5) if same_col_next else bottom
        if crop_y1 - crop_y0 < 28:
            continue
        regions.append({
            "pageNo": page_no,
            "displayNo": marker["displayNo"],
            "column": column,
            "bboxPt": [col_x0, crop_y0, col_x1, crop_y1],
            "confidence": 0.62,
            "note": "auto column crop from top-level number candidates",
        })
    return regions


def crop_png(page_png, bbox_pt, dest):
    im = Image.open(page_png).convert("RGB")
    x0, y0, x1, y1 = [int(round(v * SCALE)) for v in bbox_pt]
    pad = 14
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(im.width, x1 + pad)
    y1 = min(im.height, y1 + pad)
    crop = im.crop((x0, y0, x1, y1))
    ensure(dest.parent)
    crop.save(dest)
    return [x0, y0, x1, y1], crop.size


def make_contact_sheet(items, dest):
    thumbs = []
    for item in items:
        try:
            im = Image.open(item["cropPathAbs"]).convert("RGB")
        except Exception:
            continue
        im.thumbnail((260, 180))
        tile = Image.new("RGB", (300, 225), "white")
        tile.paste(im, (20, 10))
        draw = ImageDraw.Draw(tile)
        draw.text((10, 190), f"{item['setKey']}\nq{item['jsIdCandidate']:03d} p{item['pageNo']} #{item['displayNo']}", fill=(0, 0, 0))
        thumbs.append(tile)
    if not thumbs:
        return False
    cols = 3
    rows = math.ceil(len(thumbs) / cols)
    sheet = Image.new("RGB", (cols * 300, rows * 225), "white")
    for i, tile in enumerate(thumbs):
        sheet.paste(tile, ((i % cols) * 300, (i // cols) * 225))
    ensure(dest.parent)
    sheet.save(dest)
    return True


def render_js(set_key, title, questions):
    return "window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\n\nwindow.questionBank = " + json.dumps(questions, ensure_ascii=False, indent=2) + ";\n"


def make_zip(src_dir, zip_path):
    if zip_path.exists():
        zip_path.unlink()
    shutil.make_archive(str(zip_path.with_suffix("")), "zip", src_dir)


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    ensure(GEN)
    doc = fitz.open(PDF)
    all_map = []
    failures = []
    set_summaries = []

    for section in SECTIONS:
        set_key = section["setKey"]
        crops = []
        pages_dir = GEN / "work" / "page_crops" / section["bookPart"] / set_key
        crops_dir = GEN / "work" / "question_crops" / section["bookPart"] / set_key
        for page_no in section["pages"]:
            if page_no < 1 or page_no > doc.page_count:
                failures.append({**section, "pageNo": page_no, "status": "page_out_of_range"})
                continue
            page_png = pages_dir / f"page{page_no}.png"
            render_page(doc, page_no, page_png)
            regions = crop_regions_for_page(doc[page_no - 1], page_no)
            if not regions:
                failures.append({**section, "pageNo": page_no, "status": "question_number_not_found"})
            allowed = PAGE_ALLOWED_NUMBERS.get(page_no)
            if allowed:
                found = {int(r["displayNo"]) for r in regions}
                for expected in allowed:
                    if expected not in found:
                        failures.append({**section, "pageNo": page_no, "displayNo": f"{expected:02d}", "status": "question_number_not_found"})
            for region in regions:
                js_id = len(crops) + 1
                crop_file = f"{set_key}_page{page_no}_q{region['displayNo']}_full.png"
                crop_path = crops_dir / crop_file
                bbox_px, size = crop_png(page_png, region["bboxPt"], crop_path)
                item = {
                    "setKey": set_key,
                    "bookPart": section["bookPart"],
                    "publisher": "미래앤",
                    "textbook": "공통수학2",
                    "unit": section["unit"],
                    "sectionType": section["section"],
                    "grade": "고1",
                    "pageNo": page_no,
                    "pageIndex": page_no - 1,
                    "displayNo": region["displayNo"],
                    "jsIdCandidate": js_id,
                    "cropFile": crop_file,
                    "cropPath": str(crop_path.relative_to(OUT)).replace("\\", "/"),
                    "cropPathAbs": str(crop_path),
                    "column": region["column"],
                    "bbox": bbox_px,
                    "status": "crop_success",
                    "confidence": region["confidence"],
                    "note": region["note"],
                }
                crops.append(item)
                all_map.append({k: v for k, v in item.items() if k != "cropPathAbs"})

        # JS skeleton and input template.
        js_questions = []
        template_items = []
        for item in crops:
            js_questions.append({
                "id": item["jsIdCandidate"],
                "level": "",
                "category": item["sectionType"],
                "originalCategory": item["sectionType"],
                "standardCourse": "고1 수학",
                "standardUnitKey": "UNMAPPED",
                "standardUnit": item["unit"],
                "standardUnitOrder": 0,
                "questionType": "단답형",
                "layoutTag": "",
                "tags": ["교과서", "미래앤", "공통수학2", item["unit"], item["sectionType"]],
                "wide": False,
                "content": "",
                "choices": [],
                "image": "",
                "answer": "",
                "solution": "",
            })
            template_items.append({
                "setKey": set_key,
                "id": item["jsIdCandidate"],
                "displayNo": item["displayNo"],
                "pageNo": item["pageNo"],
                "sourceCropPath": item["cropPath"],
                "current": {"content": "", "choices": [], "answer": "", "solution": ""},
                "correction": {"status": "pending", "content": "", "choices": [], "answer": "", "solution": "", "note": ""},
            })
        js_dir = GEN / "js" / section["bookPart"]
        ensure(js_dir)
        (js_dir / f"{set_key}.js").write_text(render_js(set_key, f"미래앤 공통수학2 {section['unit']} {section['section']} 고1", js_questions), encoding="utf-8")
        write_json(GEN / "input_templates" / f"{set_key}_input_template.json", {"setKey": set_key, "items": template_items})
        write_json(GEN / "input_templates" / f"{set_key}_correction_result_schema.json", {"setKey": set_key, "required": ["setKey", "id", "status"], "allowedCorrectionFields": ["content", "choices", "answer", "solution", "note"]})
        contact = GEN / "reports" / "contact_sheets" / set_key / "question_crop_sheet.png"
        make_contact_sheet(crops, contact)
        set_summaries.append({**section, "questionCropCount": len(crops), "contactSheet": str(contact.relative_to(OUT)).replace("\\", "/")})

    write_json(GEN / "reports" / "miraen2_question_crop_map.json", {"items": all_map})
    write_json(GEN / "reports" / "miraen2_crop_failed.json", failures)
    write_json(GEN / "reports" / "miraen2_section_detection_report.json", set_summaries)

    # Unit-level fresh packs.
    by_unit = {}
    for item in all_map:
        by_unit.setdefault(item["unit"], []).append(item)
    pack_report = []
    for unit, items in by_unit.items():
        unit_key = f"미래앤_공통수학2_{unit}_고1"
        pack_dir = GEN / "review_pack" / "by_unit_fresh" / unit_key
        ensure(pack_dir / "question_crop_images")
        set_keys = sorted(set(i["setKey"] for i in items))
        for item in items:
            src = OUT / item["cropPath"]
            dst = pack_dir / "question_crop_images" / item["cropFile"]
            shutil.copy2(src, dst)
        for set_key in set_keys:
            js_src = GEN / "js" / "textbook" / f"{set_key}.js"
            if js_src.exists():
                ensure(pack_dir / "js")
                shutil.copy2(js_src, pack_dir / "js" / js_src.name)
            for suffix in ["input_template", "correction_result_schema"]:
                src = GEN / "input_templates" / f"{set_key}_{suffix}.json"
                if src.exists():
                    ensure(pack_dir / "input_templates")
                    shutil.copy2(src, pack_dir / "input_templates" / src.name)
        write_json(pack_dir / "crop_index.json", items)
        (pack_dir / "README.md").write_text(
            f"# {unit_key}\n\nquestion_crop_images/ 안에 처음 잘랐던 문항 full crop PNG가 개별 파일로 들어 있습니다.\n이 이미지를 기준으로 content/choices를 전사합니다.\n",
            encoding="utf-8",
        )
        zip_path = GEN / "review_pack" / "by_unit_fresh" / f"{unit_key}_fresh.zip"
        make_zip(pack_dir, zip_path)
        pack_report.append({"unit": unit, "unitKey": unit_key, "questionCropCount": len(items), "zipPath": str(zip_path.relative_to(OUT)).replace("\\", "/")})

    write_json(GEN / "reports" / "miraen2_fresh_unit_pack_report.json", {"packs": pack_report, "status": "ok"})
    pack_lines = "\n".join(
        f"- `generated/review_pack/by_unit_fresh/{p['unitKey']}_fresh.zip` (crop {p['questionCropCount']}개)"
        for p in pack_report
    )
    result_md = f"""# CODEX_RESULT

## Round: MiraeN common math 2 unit input packs

- 작업 범위: 미래앤 공통수학2 PDF에서 중단원마무리/대단원평가 문항 full crop 및 발문 입력용 단원별 fresh pack 생성
- 작업 폴더: `archive/textbook/{PDF.stem}`
- 입력 PDF: `archive/textbook/{PDF.name}`
- 익힘책: 현재 PDF에서 별도 익힘책 영역 미탐지
- 생성 setKey 수: {len(set_summaries)}
- 생성 question full crop 수: {len(all_map)}
- crop 실패 수: {len(failures)}
- 생성 JS skeleton 수: {len(set_summaries)}
- 생성 report:
  - `generated/reports/miraen2_question_crop_map.json`
  - `generated/reports/miraen2_section_detection_report.json`
  - `generated/reports/miraen2_crop_failed.json`
  - `generated/reports/miraen2_fresh_unit_pack_report.json`
- 생성 fresh zip:
{pack_lines}
- zip 내부 구조: `question_crop_images/`에 원본 문항 full crop PNG가 각각 개별 파일로 포함됨
- archive/text1 수정 여부: false
- archive/textbook 밖 운영 archive 수정 여부: false
- git add/commit/push 여부: false
- 최종 판정: {'PASS' if not failures else 'PARTIAL'}
"""
    (OUT / "CODEX_RESULT.md").write_text(result_md, encoding="utf-8")
    print(json.dumps({"out": str(OUT), "sets": len(set_summaries), "questionCrops": len(all_map), "failures": len(failures), "packs": pack_report}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
