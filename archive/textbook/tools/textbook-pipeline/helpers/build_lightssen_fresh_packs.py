import json
import math
import re
import shutil
from collections import Counter, defaultdict
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

import fitz
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[3]
DPI = 180
SCALE = DPI / 72


BOOKS = [
    {"pdf": "22개정_라이트쎈_공통수학1.pdf", "bookKey": "LIGHTSSEN_공통수학1", "textbook": "라이트쎈 공통수학1", "grade": "고1", "course": "공통수학1", "unitKey": "H22-C-RAW"},
    {"pdf": "22개정_라이트쎈_공통수학2.pdf", "bookKey": "LIGHTSSEN_공통수학2", "textbook": "라이트쎈 공통수학2", "grade": "고1", "course": "공통수학2", "unitKey": "H22-C2-RAW"},
    {"pdf": "22개정_라이트쎈_ 대수.pdf", "bookKey": "LIGHTSSEN_대수", "textbook": "라이트쎈 대수", "grade": "고1", "course": "대수", "unitKey": "H22-A-RAW"},
    {"pdf": "22개정_라이트쎈_중1-1.pdf", "bookKey": "LIGHTSSEN_중1_1-1", "textbook": "라이트쎈 중학수학 1-1", "grade": "중1", "course": "중학수학 1-1", "unitKey": "M1-RAW"},
    {"pdf": "22개정_라이트쎈_중1-2.pdf", "bookKey": "LIGHTSSEN_중1_1-2", "textbook": "라이트쎈 중학수학 1-2", "grade": "중1", "course": "중학수학 1-2", "unitKey": "M1-RAW"},
    {"pdf": "22개정_라이트쎈_중2-1.pdf", "bookKey": "LIGHTSSEN_중2_2-1", "textbook": "라이트쎈 중학수학 2-1", "grade": "중2", "course": "중학수학 2-1", "unitKey": "M2-RAW"},
]


def ensure(path):
    path.mkdir(parents=True, exist_ok=True)


def write_json(path, data):
    ensure(path.parent)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def render_js(title, questions):
    return "window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\n\nwindow.questionBank = " + json.dumps(questions, ensure_ascii=False, indent=2) + ";\n"


def safe_key(text):
    return re.sub(r'[<>:"/\\\\|?*\\s]+', "_", text).strip("_")


def render_page(doc, page_no, dest):
    page = doc[page_no - 1]
    pix = page.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE), alpha=False)
    ensure(dest.parent)
    pix.save(dest)
    return pix.width, pix.height


def is_marker_pixel(r, g, b):
    return r > 135 and r - g > 35 and r - b > 25 and g < 145 and b < 145


def colored_components(image):
    w, h = image.size
    data = image.tobytes()
    mask = bytearray(w * h)
    y_start = int(h * 0.07)
    y_end = int(h * 0.92)
    for y in range(y_start, y_end):
        row = y * w
        pixrow = row * 3
        for x in range(int(w * 0.03), int(w * 0.97)):
            i = pixrow + x * 3
            if is_marker_pixel(data[i], data[i + 1], data[i + 2]):
                mask[row + x] = 1
    components = []
    for idx, value in enumerate(mask):
        if not value:
            continue
        stack = [idx]
        mask[idx] = 0
        min_x = max_x = idx % w
        min_y = max_y = idx // w
        area = 0
        while stack:
            cur = stack.pop()
            area += 1
            x = cur % w
            y = cur // w
            if x < min_x:
                min_x = x
            if x > max_x:
                max_x = x
            if y < min_y:
                min_y = y
            if y > max_y:
                max_y = y
            for nb in (
                cur + 1 if x + 1 < w else -1,
                cur - 1 if x > 0 else -1,
                cur + w if y + 1 < h else -1,
                cur - w if y > 0 else -1,
            ):
                if nb >= 0 and mask[nb]:
                    mask[nb] = 0
                    stack.append(nb)
        if area >= 8:
            components.append({"x0": min_x, "y0": min_y, "x1": max_x + 1, "y1": max_y + 1, "area": area})
    return components


def merge_digit_components(components, page_width, page_height):
    digits = []
    for component in components:
        width = component["x1"] - component["x0"]
        height = component["y1"] - component["y0"]
        if 3 <= width <= 35 and 6 <= height <= 36 and 8 <= component["area"] <= 450:
            digits.append(component)
    digits.sort(key=lambda item: (item["y0"], item["x0"]))
    groups = []
    for digit in digits:
        placed = False
        for group in groups:
            same_row = abs(((group["y0"] + group["y1"]) / 2) - ((digit["y0"] + digit["y1"]) / 2)) <= 12
            close_x = digit["x0"] <= group["x1"] + 14
            if same_row and close_x:
                group["x0"] = min(group["x0"], digit["x0"])
                group["y0"] = min(group["y0"], digit["y0"])
                group["x1"] = max(group["x1"], digit["x1"])
                group["y1"] = max(group["y1"], digit["y1"])
                group["area"] += digit["area"]
                group["digitCount"] += 1
                placed = True
                break
        if not placed:
            groups.append({**digit, "digitCount": 1})

    markers = []
    for group in groups:
        width = group["x1"] - group["x0"]
        height = group["y1"] - group["y0"]
        x_mid = (group["x0"] + group["x1"]) / 2
        if group["digitCount"] < 2 or width < 14 or width > 95 or height < 8 or height > 42:
            continue
        if not (page_width * 0.04 <= x_mid <= page_width * 0.93):
            continue
        if group["y0"] < page_height * 0.09 or group["y0"] > page_height * 0.89:
            continue
        if page_width * 0.04 <= x_mid < page_width * 0.48:
            column = "left"
        elif page_width * 0.48 <= x_mid <= page_width * 0.95:
            column = "right"
        else:
            continue
        markers.append({**group, "column": column})
    markers.sort(key=lambda item: (0 if item["column"] == "left" else 1, item["y0"], item["x0"]))
    return markers


def detect_markers(page_png):
    image = Image.open(page_png).convert("RGB")
    components = colored_components(image)
    markers = merge_digit_components(components, image.width, image.height)
    deduped = []
    for marker in markers:
        if deduped and marker["column"] == deduped[-1]["column"] and abs(marker["y0"] - deduped[-1]["y0"]) < 22:
            deduped[-1]["x0"] = min(deduped[-1]["x0"], marker["x0"])
            deduped[-1]["x1"] = max(deduped[-1]["x1"], marker["x1"])
            deduped[-1]["y0"] = min(deduped[-1]["y0"], marker["y0"])
            deduped[-1]["y1"] = max(deduped[-1]["y1"], marker["y1"])
            deduped[-1]["area"] += marker["area"]
        else:
            deduped.append(marker.copy())
    return deduped


def crop_regions(page_png):
    image = Image.open(page_png).convert("RGB")
    w, h = image.size
    markers = detect_markers(page_png)
    regions = []
    by_col = defaultdict(list)
    for marker in markers:
        by_col[marker["column"]].append(marker)
    for column, items in by_col.items():
        items.sort(key=lambda item: item["y0"])
        if column == "left":
            x0 = int(w * 0.055)
            x1 = int(w * 0.505)
        else:
            x0 = int(w * 0.50)
            x1 = int(w * 0.955)
        for index, marker in enumerate(items):
            next_marker = items[index + 1] if index + 1 < len(items) else None
            y0 = max(int(h * 0.08), marker["y0"] - 22)
            y1 = next_marker["y0"] - 14 if next_marker else int(h * 0.91)
            if y1 - y0 < 55:
                continue
            regions.append({
                "column": column,
                "markerBox": [marker["x0"], marker["y0"], marker["x1"], marker["y1"]],
                "bboxPx": [x0, y0, x1, y1],
                "confidence": 0.48,
            })
    regions.sort(key=lambda item: (item["bboxPx"][1], item["bboxPx"][0]))
    return regions


def save_crop(page_png, bbox, dest):
    image = Image.open(page_png).convert("RGB")
    x0, y0, x1, y1 = bbox
    pad = 16
    box = (max(0, x0 - pad), max(0, y0 - pad), min(image.width, x1 + pad), min(image.height, y1 + pad))
    crop = image.crop(box)
    ensure(dest.parent)
    crop.save(dest)
    return list(box), list(crop.size)


def question_object(item, book):
    return {
        "id": item["globalQuestionNo"],
        "level": "",
        "category": "전체",
        "originalCategory": "전체",
        "standardCourse": book["course"],
        "standardUnitKey": book["unitKey"],
        "standardUnit": "전체",
        "standardUnitOrder": 999,
        "questionType": "",
        "layoutTag": "grid",
        "tags": ["교재", "라이트쎈", book["course"], book["grade"], "전체", "스캔본"],
        "wide": False,
        "content": "",
        "choices": [],
        "image": "",
        "answer": "",
        "solution": "",
        "displayNo": item["displayNo"],
        "questionNo": item["questionNo"],
        "sourceQuestionNo": item["sourceQuestionNo"],
    }


def make_contact_sheet(items, dest):
    tiles = []
    for item in items[:120]:
        try:
            image = Image.open(item["cropPathAbs"]).convert("RGB")
        except Exception:
            continue
        image.thumbnail((280, 185))
        tile = Image.new("RGB", (320, 240), "white")
        tile.paste(image, (20, 10))
        draw = ImageDraw.Draw(tile)
        draw.text((10, 200), f"id {item['globalQuestionNo']:04d} p{item['pageNo']} {item['column']}", fill=(0, 0, 0))
        tiles.append(tile)
    if not tiles:
        return False
    cols = 3
    rows = math.ceil(len(tiles) / cols)
    sheet = Image.new("RGB", (cols * 320, rows * 240), "white")
    for idx, tile in enumerate(tiles):
        sheet.paste(tile, ((idx % cols) * 320, (idx // cols) * 240))
    ensure(dest.parent)
    sheet.save(dest)
    return True


def zip_dir(src_dir, zip_path):
    if zip_path.exists():
        zip_path.unlink()
    ensure(zip_path.parent)
    with ZipFile(zip_path, "w", ZIP_DEFLATED) as archive:
        for file in src_dir.rglob("*"):
            if file.is_file():
                archive.write(file, file.relative_to(src_dir).as_posix())


def build_book(book):
    pdf = ROOT / book["pdf"]
    out = ROOT / pdf.stem
    gen = out / "generated"
    reports = gen / "reports"
    work = gen / "work"
    set_key = safe_key(f"{book['bookKey']}_전체_{book['grade']}")
    js_root = gen / "js" / "workbook"
    templates_root = gen / "input_templates"
    review_root = gen / "review_pack" / "by_unit_fresh"
    for folder in [reports, work, js_root, templates_root, review_root]:
        ensure(folder)

    doc = fitz.open(pdf)
    items = []
    failures = []
    global_question_no = 1
    for page_no in range(1, len(doc) + 1):
        page_png = work / "rendered_pages" / "workbook" / set_key / f"page_{page_no:03d}.png"
        render_page(doc, page_no, page_png)
        regions = crop_regions(page_png)
        if not regions:
            continue
        for page_index, region in enumerate(regions, start=1):
            display_no = f"{global_question_no:04d}"
            crop_name = f"{set_key}_p{page_no:03d}_q{display_no}_full.png"
            crop_path_abs = work / "question_crops" / "workbook" / set_key / crop_name
            bbox_px, size = save_crop(page_png, region["bboxPx"], crop_path_abs)
            item = {
                "materialKey": book["bookKey"],
                "setKey": set_key,
                "bookPart": "workbook",
                "unit": "전체",
                "section": "visual_marker",
                "pageNo": page_no,
                "idPolicy": "book_sequential",
                "globalQuestionNo": global_question_no,
                "displayNo": display_no,
                "problemCode": display_no,
                "questionNo": global_question_no,
                "sourceQuestionNo": global_question_no,
                "jsIdCandidate": global_question_no,
                "setKeyLocalIndex": global_question_no,
                "cropPath": crop_path_abs.relative_to(out).as_posix(),
                "cropPathAbs": str(crop_path_abs),
                "bboxPx": bbox_px,
                "markerBoxPx": region["markerBox"],
                "cropSize": size,
                "column": region["column"],
                "confidence": region["confidence"],
                "status": "success",
                "note": "scanned visual-marker crop; displayNo/questionNo are provisional book-sequential values because PDF has no text layer",
            }
            items.append(item)
            global_question_no += 1
    if not items:
        failures.append({"setKey": set_key, "reason": "no_visual_markers_detected"})

    questions = [question_object(item, book) for item in items]
    (js_root / f"{set_key}.js").write_text(render_js(set_key, questions), encoding="utf-8")
    write_json(templates_root / f"{set_key}_input_template.json", {
        "setKey": set_key,
        "schemaVersion": 1,
        "items": [
            {
                "setKey": item["setKey"],
                "id": item["globalQuestionNo"],
                "globalQuestionNo": item["globalQuestionNo"],
                "displayNo": item["displayNo"],
                "questionNo": item["questionNo"],
                "sourceQuestionNo": item["sourceQuestionNo"],
                "pageNo": item["pageNo"],
                "sourcePageImage": f"generated/work/rendered_pages/workbook/{set_key}/page_{int(item['pageNo']):03d}.png",
                "sourceCropPath": item["cropPath"],
                "content": "",
                "choices": [],
                "answer": "",
                "solution": "",
                "status": "pending_input",
            }
            for item in items
        ],
    })
    write_json(templates_root / f"{set_key}_correction_result_schema.json", {
        "setKey": set_key,
        "required": ["setKey", "id", "status"],
        "allowedCorrectionFields": ["content", "choices", "answer", "solution", "note"],
    })
    make_contact_sheet(items, reports / "contact_sheets" / set_key / "question_crop_sheet.png")

    pack_dir = review_root / f"{set_key}_fresh"
    if pack_dir.exists():
        shutil.rmtree(pack_dir)
    ensure(pack_dir / "page_full_images")
    ensure(pack_dir / "question_crop_images")
    ensure(pack_dir / "js")
    ensure(pack_dir / "input_templates")
    copied_pages = set()
    for item in items:
        page_no = int(item["pageNo"])
        page_src = work / "rendered_pages" / "workbook" / set_key / f"page_{page_no:03d}.png"
        if page_no not in copied_pages and page_src.exists():
            shutil.copyfile(page_src, pack_dir / "page_full_images" / f"p{page_no:03d}.png")
            copied_pages.add(page_no)
        shutil.copyfile(out / item["cropPath"], pack_dir / "question_crop_images" / Path(item["cropPath"]).name)
    shutil.copyfile(js_root / f"{set_key}.js", pack_dir / "js" / f"{set_key}.js")
    for suffix in ["input_template.json", "correction_result_schema.json"]:
        shutil.copyfile(templates_root / f"{set_key}_{suffix}", pack_dir / "input_templates" / f"{set_key}_{suffix}")
    write_json(pack_dir / "crop_index.json", [{k: v for k, v in item.items() if k != "cropPathAbs"} for item in items])
    write_json(pack_dir / "manifest.json", {
        "bookKey": book["bookKey"],
        "textbook": book["textbook"],
        "grade": book["grade"],
        "unit": "전체",
        "setKeys": [set_key],
        "questionCropCount": len(items),
        "primaryEvidenceFolder": "page_full_images",
        "questionCropRole": "optional_zoom_reference",
        "imageFieldPolicy": "visual_asset_only",
        "sourcePdf": book["pdf"],
        "idPolicy": "book_sequential",
        "status": "pending_content_input",
        "note": "visual marker crop from scanned Lightssen PDF",
    })
    (pack_dir / "README.md").write_text(
        "# Lightssen fresh pack\n\n"
        "Use `page_full_images/` as the primary source evidence for content and choices.\n"
        "`question_crop_images/` is optional zoom/reference material only.\n"
        "Only visual asset crops may be written to the final JS `image` field.\n"
        "This PDF has no usable text layer, so crop detection used visual red markers.\n",
        encoding="utf-8",
    )
    zip_path = review_root / f"{set_key}_fresh.zip"
    zip_dir(pack_dir, zip_path)

    ids = [item["globalQuestionNo"] for item in items]
    expected_ids = list(range(1, len(ids) + 1))
    duplicates = sorted([value for value, count in Counter(ids).items() if count > 1])
    missing = sorted(set(expected_ids) - set(ids))
    write_json(reports / "question_crop_map.json", {"items": [{k: v for k, v in item.items() if k != "cropPathAbs"} for item in items]})
    write_json(reports / "lightssen_visual_marker_detection_report.json", {
        "setKey": set_key,
        "pageCount": len(doc),
        "questionCropCount": len(items),
        "failureCount": len(failures),
        "failures": failures,
        "status": "ok" if items else "manual_review",
    })
    write_json(reports / "id_sequence_report.json", {
        "sourcePdf": book["pdf"],
        "idPolicy": "book_sequential",
        "idStart": 1,
        "idPad": 0,
        "displayNoPolicy": "provisional_book_sequential_for_scanned_pdf",
        "setKeyLocalIdPolicy": "forbidden",
        "questionCount": len(ids),
        "firstId": ids[0] if ids else None,
        "lastId": ids[-1] if ids else None,
        "by_setkey": {set_key: ids},
        "items": [
            {
                "id": item["globalQuestionNo"],
                "globalQuestionNo": item["globalQuestionNo"],
                "displayNo": item["displayNo"],
                "sourceQuestionNo": item["sourceQuestionNo"],
                "questionNo": item["questionNo"],
                "setKey": item["setKey"],
                "pageNo": item["pageNo"],
                "cropPath": item["cropPath"],
                "idPolicy": "book_sequential",
            }
            for item in items
        ],
        "status": "ok" if ids == expected_ids else "manual_review",
    })
    write_json(reports / "id_duplicate_report.json", {"duplicateIds": duplicates, "duplicateCount": len(duplicates), "status": "ok" if not duplicates else "manual_review"})
    write_json(reports / "id_gap_report.json", {"missingIds": missing, "missingCount": len(missing), "extraIds": [], "extraCount": 0, "status": "ok" if not missing else "manual_review"})
    write_json(reports / "setkey_id_restart_violation_report.json", {"violations": [], "violationCount": 0, "status": "ok"})
    write_json(reports / "lightssen_fresh_pack_report.json", {
        "sourcePdf": book["pdf"],
        "bookKey": book["bookKey"],
        "idPolicy": "book_sequential",
        "questionCropCount": len(items),
        "packCount": 1,
        "packs": [{"unitKey": f"{set_key}_fresh", "zip": zip_path.relative_to(out).as_posix(), "questionCropCount": len(items)}],
        "status": "ok" if items else "manual_review",
    })
    return {
        "pdf": book["pdf"],
        "generatedRoot": gen.as_posix(),
        "setKey": set_key,
        "questionCropCount": len(items),
        "packCount": 1 if items else 0,
        "status": "ok" if items else "manual_review",
    }


def main():
    summaries = [build_book(book) for book in BOOKS]
    write_json(ROOT / "generated" / "reports" / "lightssen_6book_fresh_pipeline_summary.json", {
        "books": summaries,
        "status": "ok" if all(item["status"] == "ok" for item in summaries) else "manual_review",
        "note": "Lightssen PDFs are scanned/image-based; crops use visual red marker detection.",
    })
    print(json.dumps({"books": summaries}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
