import json
import math
import shutil
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

import fitz
from PIL import Image, ImageDraw


ROOT = Path.cwd()
PDF = ROOT / "_비상교육_ 고등_공통수학2(김원경)_교과서.pdf"
OUT = ROOT / PDF.stem
GEN = OUT / "generated"
DPI = 150

SECTIONS = [
    {"unit": "도형의방정식", "section": "중단원학습점검", "setKey": "비상_공통수학2_도형의방정식_중단원학습점검_고1", "pages": [26, 27], "bookPart": "textbook"},
    {"unit": "도형의방정식", "section": "대단원학습평가", "setKey": "비상_공통수학2_도형의방정식_대단원학습평가_고1", "pages": [54, 55, 56], "bookPart": "textbook"},
    {"unit": "집합과명제", "section": "중단원학습점검", "setKey": "비상_공통수학2_집합과명제_중단원학습점검_고1", "pages": [74, 75], "bookPart": "textbook"},
    {"unit": "집합과명제", "section": "대단원학습평가", "setKey": "비상_공통수학2_집합과명제_대단원학습평가_고1", "pages": [94, 95, 96], "bookPart": "textbook"},
    {"unit": "함수와그래프", "section": "중단원학습점검", "setKey": "비상_공통수학2_함수와그래프_중단원학습점검_고1", "pages": [113, 114], "bookPart": "textbook"},
    {"unit": "함수와그래프", "section": "대단원학습평가", "setKey": "비상_공통수학2_함수와그래프_대단원학습평가_고1", "pages": [130, 131, 132], "bookPart": "textbook"},
    {"unit": "도형의방정식", "section": "익힘책", "setKey": "비상_공통수학2_도형의방정식_익힘책_고1", "pages": [136, 137], "bookPart": "workbook"},
    {"unit": "집합과명제", "section": "익힘책", "setKey": "비상_공통수학2_집합과명제_익힘책_고1", "pages": [138, 139], "bookPart": "workbook"},
    {"unit": "함수와그래프", "section": "익힘책", "setKey": "비상_공통수학2_함수와그래프_익힘책_고1", "pages": [140, 141], "bookPart": "workbook"},
]


def ensure(path):
    path.mkdir(parents=True, exist_ok=True)


def write_json(path, data):
    ensure(path.parent)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def render_page(doc, page_no, dest):
    page = doc[page_no - 1]
    scale = DPI / 72
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
    ensure(dest.parent)
    pix.save(dest)
    return pix.width, pix.height


def components_for_colored_pixels(img):
    w, h = img.size
    data = img.tobytes()
    mask = bytearray(w * h)
    y_start = int(h * 0.09)
    y_end = int(h * 0.93)
    for y in range(y_start, y_end):
        row = y * w
        pix_row = row * 3
        for x in range(w):
            i = pix_row + x * 3
            r, g, b = data[i], data[i + 1], data[i + 2]
            mx = max(r, g, b)
            mn = min(r, g, b)
            if mx - mn > 45 and mx < 245:
                mask[row + x] = 1
    comps = []
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
            if x + 1 < w and mask[cur + 1]:
                mask[cur + 1] = 0
                stack.append(cur + 1)
            if x > 0 and mask[cur - 1]:
                mask[cur - 1] = 0
                stack.append(cur - 1)
            if y + 1 < h and mask[cur + w]:
                mask[cur + w] = 0
                stack.append(cur + w)
            if y > 0 and mask[cur - w]:
                mask[cur - w] = 0
                stack.append(cur - w)
        if area > 25:
            comps.append((min_x, min_y, max_x + 1, max_y + 1, area))
    return comps


def detect_marker_rows(page_png):
    img = Image.open(page_png).convert("RGB")
    w, h = img.size
    rows = []
    for x0, y0, x1, y1, area in components_for_colored_pixels(img):
        ww = x1 - x0
        hh = y1 - y0
        if not (8 <= ww <= 95 and 22 <= hh <= 150 and area >= 150):
            continue
        xmid = (x0 + x1) / 2
        if w * 0.075 <= xmid <= w * 0.18:
            col = "left"
        elif w * 0.50 <= xmid <= w * 0.60:
            col = "right"
        else:
            continue
        if y0 < h * 0.12 or y0 > h * 0.90:
            continue
        rows.append({"x0": x0, "y0": y0, "x1": x1, "y1": y1, "column": col, "area": area})
    rows.sort(key=lambda r: (r["column"], r["y0"], r["x0"]))
    grouped = []
    for row in rows:
        if grouped and grouped[-1]["column"] == row["column"] and abs(grouped[-1]["y0"] - row["y0"]) < 32:
            grouped[-1]["x0"] = min(grouped[-1]["x0"], row["x0"])
            grouped[-1]["x1"] = max(grouped[-1]["x1"], row["x1"])
            grouped[-1]["y0"] = min(grouped[-1]["y0"], row["y0"])
            grouped[-1]["y1"] = max(grouped[-1]["y1"], row["y1"])
            grouped[-1]["area"] += row["area"]
        else:
            grouped.append(row.copy())
    # Remove known non-question label clusters near section tabs.
    return [g for g in grouped if g["area"] < 9000]


def crop_regions(page_png, page_no):
    img = Image.open(page_png).convert("RGB")
    w, h = img.size
    markers = detect_marker_rows(page_png)
    markers.sort(key=lambda r: (0 if r["column"] == "left" else 1, r["y0"]))
    regions = []
    for marker in markers:
        same_col = [m for m in markers if m["column"] == marker["column"] and m["y0"] > marker["y0"] + 35]
        next_marker = same_col[0] if same_col else None
        if marker["column"] == "left":
            x0 = int(w * 0.065)
            x1 = int(w * 0.485)
        else:
            x0 = int(w * 0.50)
            x1 = int(w * 0.94)
        y0 = max(int(h * 0.10), marker["y0"] - 24)
        y1 = next_marker["y0"] - 18 if next_marker else int(h * 0.92)
        if y1 - y0 < 90:
            continue
        regions.append({
            "pageNo": page_no,
            "column": marker["column"],
            "bbox": [x0, y0, x1, y1],
            "confidence": 0.58,
            "note": "visual marker detection from scanned page",
        })
    return regions


def save_crop(page_png, bbox, dest):
    img = Image.open(page_png).convert("RGB")
    x0, y0, x1, y1 = bbox
    pad = 18
    crop = img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))
    ensure(dest.parent)
    crop.save(dest)
    return list(crop.size)


def make_contact_sheet(items, dest):
    tiles = []
    for item in items:
        try:
            im = Image.open(item["cropPathAbs"]).convert("RGB")
        except Exception:
            continue
        im.thumbnail((280, 185))
        tile = Image.new("RGB", (320, 240), "white")
        tile.paste(im, (20, 10))
        d = ImageDraw.Draw(tile)
        d.text((10, 200), f"{item['setKey']}\nq{item['jsIdCandidate']:03d} p{item['pageNo']} #{item['displayNo']}", fill=(0, 0, 0))
        tiles.append(tile)
    if not tiles:
        return False
    cols = 3
    rows = math.ceil(len(tiles) / cols)
    sheet = Image.new("RGB", (cols * 320, rows * 240), "white")
    for i, tile in enumerate(tiles):
        sheet.paste(tile, ((i % cols) * 320, (i // cols) * 240))
    ensure(dest.parent)
    sheet.save(dest)
    return True


def render_js(title, questions):
    return "window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\n\nwindow.questionBank = " + json.dumps(questions, ensure_ascii=False, indent=2) + ";\n"


def zip_dir(src_dir, zip_path):
    if zip_path.exists():
        zip_path.unlink()
    with ZipFile(zip_path, "w", ZIP_DEFLATED) as zf:
        for file in src_dir.rglob("*"):
            if file.is_file():
                zf.write(file, file.relative_to(src_dir).as_posix())


def main():
    if not PDF.exists():
        raise SystemExit(f"missing pdf: {PDF}")
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
            page_png = pages_dir / f"page{page_no}.png"
            render_page(doc, page_no, page_png)
            regions = crop_regions(page_png, page_no)
            if not regions:
                failures.append({**section, "pageNo": page_no, "status": "question_marker_not_found"})
            for region in regions:
                js_id = len(crops) + 1
                display_no = f"{js_id:02d}"
                crop_file = f"{set_key}_page{page_no}_q{display_no}_full.png"
                crop_path = crops_dir / crop_file
                size = save_crop(page_png, region["bbox"], crop_path)
                item = {
                    "setKey": set_key,
                    "bookPart": section["bookPart"],
                    "publisher": "비상",
                    "textbook": "공통수학2",
                    "unit": section["unit"],
                    "sectionType": section["section"],
                    "grade": "고1",
                    "pageNo": page_no,
                    "pageIndex": page_no - 1,
                    "displayNo": display_no,
                    "jsIdCandidate": js_id,
                    "cropFile": crop_file,
                    "cropPath": str(crop_path.relative_to(OUT)).replace("\\", "/"),
                    "cropPathAbs": str(crop_path),
                    "column": region["column"],
                    "bbox": region["bbox"],
                    "status": "crop_success",
                    "confidence": region["confidence"],
                    "note": region["note"],
                }
                crops.append(item)
                all_map.append({k: v for k, v in item.items() if k != "cropPathAbs"})

        js_questions = []
        template_items = []
        for item in crops:
            tags = ["교재", "비상", "공통수학2", "고1", item["unit"], item["sectionType"]]
            js_questions.append({
                "id": item["jsIdCandidate"],
                "level": "",
                "category": item["sectionType"],
                "originalCategory": item["sectionType"],
                "standardCourse": "공통수학2",
                "standardUnitKey": "UNMAPPED",
                "standardUnit": item["unit"],
                "standardUnitOrder": 999,
                "questionType": "단답형",
                "layoutTag": "grid",
                "tags": tags,
                "wide": False,
                "content": "",
                "choices": [],
                "image": "",
                "answer": "",
                "solution": "",
            })
            template_items.append({
                "setKey": set_key,
                "bookPart": item["bookPart"],
                "id": item["jsIdCandidate"],
                "displayNo": item["displayNo"],
                "pageNo": item["pageNo"],
                "sourceCropPath": item["cropPath"],
                "current": {"content": "", "choices": [], "answer": "", "solution": ""},
                "correction": {"status": "pending", "content": "", "choices": [], "answer": "", "solution": "", "note": ""},
            })
        js_dir = GEN / "js" / section["bookPart"]
        ensure(js_dir)
        title = f"비상 공통수학2 {section['unit']} {section['section']} 고1"
        (js_dir / f"{set_key}.js").write_text(render_js(title, js_questions), encoding="utf-8")
        write_json(GEN / "input_templates" / f"{set_key}_input_template.json", {"setKey": set_key, "schemaVersion": 1, "items": template_items})
        write_json(GEN / "input_templates" / f"{set_key}_correction_result_schema.json", {"setKey": set_key, "required": ["setKey", "id", "status"], "allowedCorrectionFields": ["content", "choices", "answer", "solution", "note"]})
        contact = GEN / "reports" / "contact_sheets" / set_key / "question_crop_sheet.png"
        make_contact_sheet(crops, contact)
        set_summaries.append({**section, "questionCropCount": len(crops), "contactSheet": str(contact.relative_to(OUT)).replace("\\", "/")})

    write_json(GEN / "reports" / "question_crop_map.json", {"items": all_map})
    write_json(GEN / "reports" / "visang2_question_crop_map.json", {"items": all_map})
    write_json(GEN / "reports" / "visang2_crop_failed.json", failures)
    write_json(GEN / "reports" / "visang2_section_detection_report.json", set_summaries)

    by_unit = {}
    for item in all_map:
        by_unit.setdefault(item["unit"], []).append(item)
    pack_report = []
    for unit, items in by_unit.items():
        unit_key = f"비상_공통수학2_{unit}_고1"
        pack_dir = GEN / "review_pack" / "by_unit_fresh" / unit_key
        if pack_dir.exists():
            shutil.rmtree(pack_dir)
        ensure(pack_dir / "question_crop_images")
        set_keys = sorted(set(i["setKey"] for i in items))
        for item in items:
            shutil.copy2(OUT / item["cropPath"], pack_dir / "question_crop_images" / item["cropFile"])
        for set_key in set_keys:
            for part in ["textbook", "workbook"]:
                js_src = GEN / "js" / part / f"{set_key}.js"
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
            f"# {unit_key}\n\nquestion_crop_images/ 안에 문항 full crop PNG가 각각 개별 파일로 들어 있습니다. 이미지를 기준으로 content/choices를 전사합니다.\n",
            encoding="utf-8",
        )
        zip_path = GEN / "review_pack" / "by_unit_fresh" / f"{unit_key}_fresh.zip"
        zip_dir(pack_dir, zip_path)
        pack_report.append({"unit": unit, "unitKey": unit_key, "questionCropCount": len(items), "zipPath": str(zip_path.relative_to(OUT)).replace("\\", "/")})
    write_json(GEN / "reports" / "visang2_fresh_unit_pack_report.json", {"packs": pack_report, "status": "ok" if not failures else "manual_review"})
    result = {
        "out": str(OUT),
        "sets": len(SECTIONS),
        "questionCrops": len(all_map),
        "failures": len(failures),
        "packs": pack_report,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
