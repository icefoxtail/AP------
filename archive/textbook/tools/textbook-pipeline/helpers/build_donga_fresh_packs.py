import argparse
import json
import math
import shutil
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

import fitz
from PIL import Image, ImageDraw


ROOT = Path.cwd()
DPI = 150
SCALE = DPI / 72

CONFIGS = {
    "math1": {
        "pdf": "_동아_고등_공통수학1_교과서.pdf",
        "publisher": "동아",
        "textbook": "공통수학1",
        "sidebarPages": [31, 54, 71, 100, 119, 139],
        "expectedPageCounts": {
            31: 4, 32: 8, 33: 3,
            54: 4, 55: 8, 56: 3,
            71: 4, 72: 8, 73: 3,
            100: 4, 101: 8, 102: 3,
            119: 4, 120: 8, 121: 4,
            139: 4, 140: 6, 141: 2,
        },
        "sections": [
            {"unit": "다항식", "section": "단원마무리", "setKey": "동아_공통수학1_다항식_단원마무리_고1", "pages": [31, 32, 33], "bookPart": "textbook"},
            {"unit": "방정식과부등식", "section": "단원마무리", "setKey": "동아_공통수학1_방정식과부등식_단원마무리_고1", "pages": [54, 55, 56, 71, 72, 73, 100, 101, 102], "bookPart": "textbook"},
            {"unit": "경우의수", "section": "단원마무리", "setKey": "동아_공통수학1_경우의수_단원마무리_고1", "pages": [119, 120, 121], "bookPart": "textbook"},
            {"unit": "행렬", "section": "단원마무리", "setKey": "동아_공통수학1_행렬_단원마무리_고1", "pages": [139, 140, 141], "bookPart": "textbook"},
        ],
    },
    "math2": {
        "pdf": "_동아_고등_공통수학2_교과서.pdf",
        "publisher": "동아",
        "textbook": "공통수학2",
        "sidebarPages": [28, 53, 99, 120, 139],
        "expectedPageCounts": {
            28: 4, 29: 8, 30: 4,
            53: 4, 54: 8, 55: 3,
            99: 4, 100: 7, 101: 4,
            120: 4, 121: 8, 122: 3,
            139: 4, 140: 7, 141: 3,
        },
        "sections": [
            {"unit": "도형의방정식", "section": "단원마무리", "setKey": "동아_공통수학2_도형의방정식_단원마무리_고1", "pages": [28, 29, 30, 53, 54, 55], "bookPart": "textbook"},
            {"unit": "집합과명제", "section": "단원마무리", "setKey": "동아_공통수학2_집합과명제_단원마무리_고1", "pages": [99, 100, 101], "bookPart": "textbook"},
            {"unit": "함수와그래프", "section": "단원마무리", "setKey": "동아_공통수학2_함수와그래프_단원마무리_고1", "pages": [120, 121, 122, 139, 140, 141], "bookPart": "textbook"},
        ],
    },
}


def ensure(path):
    path.mkdir(parents=True, exist_ok=True)


def write_json(path, data):
    ensure(path.parent)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def render_page(doc, page_no, dest):
    pix = doc[page_no - 1].get_pixmap(matrix=fitz.Matrix(SCALE, SCALE), alpha=False)
    ensure(dest.parent)
    pix.save(dest)
    return pix.width, pix.height


def colored_components(img):
    w, h = img.size
    data = img.tobytes()
    mask = bytearray(w * h)
    for y in range(int(h * 0.10), int(h * 0.90)):
        row = y * w
        pixrow = row * 3
        for x in range(w):
            i = pixrow + x * 3
            r, g, b = data[i], data[i + 1], data[i + 2]
            # DongA top-level question numbers are printed in a red/purple tone.
            # Restricting to that hue avoids blue self-check boxes and green labels.
            mx = max(r, g, b)
            if r > 120 and r - g > 18 and r - b > 5 and mx < 245:
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
            min_x = min(min_x, x)
            max_x = max(max_x, x)
            min_y = min(min_y, y)
            max_y = max(max_y, y)
            for nb in (
                cur + 1 if x + 1 < w else -1,
                cur - 1 if x > 0 else -1,
                cur + w if y + 1 < h else -1,
                cur - w if y > 0 else -1,
            ):
                if nb >= 0 and mask[nb]:
                    mask[nb] = 0
                    stack.append(nb)
        if area > 25:
            comps.append((min_x, min_y, max_x + 1, max_y + 1, area))
    return comps


def detect_marker_rows(page_png):
    img = Image.open(page_png).convert("RGB")
    w, h = img.size
    rows = []
    for x0, y0, x1, y1, area in colored_components(img):
        ww = x1 - x0
        hh = y1 - y0
        xmid = (x0 + x1) / 2
        if not (7 <= ww <= 110 and 14 <= hh <= 95 and area >= 70):
            continue
        if w * 0.07 <= xmid <= w * 0.22:
            column = "left"
        elif w * 0.47 <= xmid <= w * 0.66:
            column = "right"
        else:
            continue
        if y0 < h * 0.11 or y0 > h * 0.86:
            continue
        rows.append({"x0": x0, "y0": y0, "x1": x1, "y1": y1, "column": column, "area": area})
    rows.sort(key=lambda r: (0 if r["column"] == "left" else 1, r["y0"], r["x0"]))
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
    return [g for g in grouped if g["area"] < 9000]


def crop_regions(page_png, page_no, sidebar_pages, expected_page_counts):
    img = Image.open(page_png).convert("RGB")
    w, h = img.size
    markers = detect_marker_rows(page_png)
    if page_no in sidebar_pages:
        markers = [m for m in markers if m["column"] != "left"]
    expected = expected_page_counts.get(page_no)
    if expected and len(markers) > expected:
        markers = sorted(markers, key=lambda r: (r["y0"], r["x0"]))[:expected]
        markers.sort(key=lambda r: (0 if r["column"] == "left" else 1, r["y0"], r["x0"]))
    regions = []
    for marker in markers:
        same_col = [m for m in markers if m["column"] == marker["column"] and m["y0"] > marker["y0"] + 35]
        next_marker = same_col[0] if same_col else None
        if marker["column"] == "left":
            x0 = int(w * 0.075)
            x1 = int(w * 0.485)
        else:
            x0 = int(w * 0.49)
            x1 = int(w * 0.94)
        y0 = max(int(h * 0.10), marker["y0"] - 22)
        y1 = next_marker["y0"] - 16 if next_marker else int(h * 0.90)
        if y1 - y0 < 80:
            continue
        regions.append({"pageNo": page_no, "column": marker["column"], "bbox": [x0, y0, x1, y1], "confidence": 0.55})
    regions.sort(key=lambda r: (0 if r["column"] == "left" else 1, r["bbox"][1]))
    return regions


def save_crop(page_png, bbox, dest):
    img = Image.open(page_png).convert("RGB")
    x0, y0, x1, y1 = bbox
    pad = 18
    box = (max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad))
    crop = img.crop(box)
    ensure(dest.parent)
    crop.save(dest)
    return list(crop.size)


def make_contact_sheet(items, dest):
    tiles = []
    for item in items:
        im = Image.open(item["cropPathAbs"]).convert("RGB")
        im.thumbnail((280, 185))
        tile = Image.new("RGB", (320, 240), "white")
        tile.paste(im, (20, 10))
        d = ImageDraw.Draw(tile)
        d.text((10, 200), f"{item['setKey']}\nq{item['jsIdCandidate']:03d} p{item['pageNo']} #{item['displayNo']}", fill=(0, 0, 0))
        tiles.append(tile)
    if not tiles:
        return False
    cols = 3
    sheet = Image.new("RGB", (cols * 320, math.ceil(len(tiles) / cols) * 240), "white")
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


def build(which):
    cfg = CONFIGS[which]
    pdf = ROOT / cfg["pdf"]
    out = ROOT / pdf.stem
    gen = out / "generated"
    doc = fitz.open(pdf)
    all_map = []
    failures = []
    summaries = []
    for section in cfg["sections"]:
        set_key = section["setKey"]
        crops = []
        pages_dir = gen / "work" / "page_crops" / section["bookPart"] / set_key
        crops_dir = gen / "work" / "question_crops" / section["bookPart"] / set_key
        for page_no in section["pages"]:
            page_png = pages_dir / f"page{page_no}.png"
            render_page(doc, page_no, page_png)
            regions = crop_regions(page_png, page_no, set(cfg.get("sidebarPages", [])), cfg.get("expectedPageCounts", {}))
            if not regions:
                failures.append({**section, "pageNo": page_no, "status": "question_marker_not_found"})
            for region in regions:
                js_id = len(crops) + 1
                display_no = f"{js_id:02d}"
                crop_file = f"{set_key}_page{page_no}_q{display_no}_full.png"
                crop_path = crops_dir / crop_file
                width, height = save_crop(page_png, region["bbox"], crop_path)
                item = {
                    "setKey": set_key,
                    "bookPart": section["bookPart"],
                    "publisher": cfg["publisher"],
                    "textbook": cfg["textbook"],
                    "unit": section["unit"],
                    "sectionType": section["section"],
                    "grade": "고1",
                    "pageNo": page_no,
                    "pageIndex": page_no - 1,
                    "displayNo": display_no,
                    "cropFile": crop_file,
                    "cropPath": str(crop_path.relative_to(out)).replace("\\", "/"),
                    "sourceSectionTitle": section["section"],
                    "column": region["column"],
                    "bbox": region["bbox"],
                    "status": "crop_success",
                    "confidence": region["confidence"],
                    "note": "scanned page visual marker crop; displayNo is sequential within setKey",
                    "jsIdCandidate": js_id,
                    "cropPathAbs": str(crop_path),
                }
                crops.append(item)
                all_map.append(item)
        js_questions = []
        templates = []
        for item in crops:
            qid = item["jsIdCandidate"]
            js_questions.append({
                "id": qid,
                "level": "",
                "category": item["sectionType"],
                "originalCategory": item["sectionType"],
                "standardCourse": "고1 수학",
                "standardUnitKey": "UNMAPPED",
                "standardUnit": item["unit"],
                "standardUnitOrder": 0,
                "questionType": "단답형",
                "layoutTag": "grid",
                "tags": ["교과서", cfg["publisher"], cfg["textbook"], "고1", item["unit"], item["sectionType"]],
                "wide": False,
                "content": "",
                "choices": [],
                "answer": "",
                "solution": "",
            })
            templates.append({"setKey": set_key, "id": qid, "displayNo": item["displayNo"], "cropFile": item["cropFile"], "cropPath": item["cropPath"], "status": "manual_review"})
        js_dir = gen / "js" / section["bookPart"]
        ensure(js_dir)
        (js_dir / f"{set_key}.js").write_text(render_js(f"{cfg['publisher']} {cfg['textbook']} {section['unit']} {section['section']} 고1", js_questions), encoding="utf-8")
        write_json(gen / "input_templates" / f"{set_key}_input_template.json", {"setKey": set_key, "items": templates})
        write_json(gen / "input_templates" / f"{set_key}_correction_result_schema.json", {"setKey": set_key, "required": ["setKey", "id", "status"], "allowedCorrectionFields": ["content", "choices", "answer", "solution", "note"]})
        make_contact_sheet(crops, gen / "reports" / "contact_sheets" / set_key / "question_crop_sheet.png")
        summaries.append({**section, "questionCropCount": len(crops)})
    for item in all_map:
        item.pop("cropPathAbs", None)
    write_json(gen / "reports" / "donga_question_crop_map.json", {"items": all_map})
    write_json(gen / "reports" / "donga_crop_failed.json", failures)
    write_json(gen / "reports" / "donga_section_detection_report.json", summaries)
    pack_report = []
    by_unit = {}
    for item in all_map:
        by_unit.setdefault(item["unit"], []).append(item)
    for unit, items in by_unit.items():
        unit_key = f"{cfg['publisher']}_{cfg['textbook']}_{unit}_고1"
        pack_dir = gen / "review_pack" / "by_unit_fresh" / unit_key
        if pack_dir.exists():
            shutil.rmtree(pack_dir)
        ensure(pack_dir / "question_crop_images")
        ensure(pack_dir / "js")
        for item in items:
            shutil.copy2(out / item["cropPath"], pack_dir / "question_crop_images" / item["cropFile"])
        for set_key in sorted({i["setKey"] for i in items}):
            js_src = gen / "js" / "textbook" / f"{set_key}.js"
            if js_src.exists():
                shutil.copy2(js_src, pack_dir / "js" / js_src.name)
        write_json(pack_dir / "input_template.json", {"unit": unit, "items": [{"setKey": i["setKey"], "id": i["jsIdCandidate"], "cropFile": i["cropFile"], "cropPath": f"question_crop_images/{i['cropFile']}", "status": "manual_review"} for i in items]})
        write_json(pack_dir / "correction_result_schema.json", {"required": ["setKey", "id", "status"], "allowedStatuses": ["confirmed", "manual_review", "formula_uncertain", "crop_issue", "choices_uncertain", "answer_uncertain", "solution_pending", "skip_page_range"]})
        (pack_dir / "README.md").write_text(f"# {unit_key}\n\nquestion_crop_images/ 안에 처음 잘랐던 문항 full crop PNG가 개별 파일로 들어 있습니다.\n이 이미지를 기준으로 content/choices를 전사합니다.\n", encoding="utf-8")
        zip_path = gen / "review_pack" / "by_unit_fresh" / f"{unit_key}_fresh.zip"
        zip_dir(pack_dir, zip_path)
        pack_report.append({"unit": unit, "unitKey": unit_key, "questionCropCount": len(items), "zipPath": str(zip_path.relative_to(out)).replace("\\", "/")})
    write_json(gen / "reports" / "donga_fresh_unit_pack_report.json", {"packs": pack_report, "status": "ok" if not failures else "partial"})
    (out / "CODEX_RESULT.md").write_text(
        f"# CODEX_RESULT\n\n## Round: DongA {cfg['textbook']} unit input packs\n\n- 입력 PDF: `archive/textbook/{pdf.name}`\n- 생성 setKey 수: {len(summaries)}\n- 생성 question full crop 수: {len(all_map)}\n- crop 실패 수: {len(failures)}\n- fresh zip 수: {len(pack_report)}\n- 룰북/마스터테이블 정규화: 후속 normalize-generated-js 단계에서 수행\n- 최종 판정: {'PASS' if not failures else 'PARTIAL'}\n",
        encoding="utf-8",
    )
    print(json.dumps({"out": str(out), "sets": len(summaries), "questionCrops": len(all_map), "failures": len(failures), "packs": pack_report}, ensure_ascii=False, indent=2))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--which", choices=CONFIGS.keys(), required=True)
    args = parser.parse_args()
    build(args.which)


if __name__ == "__main__":
    main()
