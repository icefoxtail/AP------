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
DPI = 170
SCALE = DPI / 72


TARGET_BOOKS = [
    {
        "size": 48707392,
        "publisher": "비상",
        "textbook": "대수",
        "bookKind": "textbook",
        "detect": "colored_label",
        "note": "비상 대수 교과서. TOC text layer confirmed.",
        "sections": [
            {"unit": "지수와 로그", "sectionType": "중단원학습점검", "bookPart": "textbook", "pages": [32, 33, 34], "standard": ("대수", "H22-A-01", "지수와 로그", 1)},
            {"unit": "지수함수와 로그함수", "sectionType": "중단원학습점검", "bookPart": "textbook", "pages": [53, 54, 55], "standard": ("대수", "H22-A-02", "지수함수", 2)},
            {"unit": "지수함수와 로그함수", "sectionType": "대단원학습평가", "bookPart": "textbook", "pages": [58, 59, 60], "standard": ("대수", "H22-A-03", "로그함수", 3)},
            {"unit": "삼각함수", "sectionType": "중단원학습점검", "bookPart": "textbook", "pages": [88, 89, 90], "standard": ("대수", "H22-A-04", "삼각함수", 4)},
            {"unit": "사인법칙과 코사인법칙", "sectionType": "중단원학습점검", "bookPart": "textbook", "pages": [104, 105, 106], "standard": ("대수", "H22-A-05", "사인법칙과 코사인법칙", 5)},
            {"unit": "삼각함수", "sectionType": "대단원학습평가", "bookPart": "textbook", "pages": [108, 109, 110], "standard": ("대수", "H22-A-04", "삼각함수", 4)},
            {"unit": "등차수열과 등비수열", "sectionType": "중단원학습점검", "bookPart": "textbook", "pages": [132, 133, 134], "standard": ("대수", "H22-A-06", "등차수열과 등비수열", 6)},
            {"unit": "수열의 합과 수학적 귀납법", "sectionType": "중단원학습점검", "bookPart": "textbook", "pages": [149, 150, 151], "standard": ("대수", "H22-A-07", "수열의 합", 7)},
            {"unit": "수열", "sectionType": "대단원학습평가", "bookPart": "textbook", "pages": [154, 155, 156], "standard": ("대수", "H22-A-08", "수학적 귀납법", 8)},
            {"unit": "지수함수와 로그함수", "sectionType": "익힘책", "bookPart": "workbook", "pages": [162, 163, 164, 165], "standard": ("대수", "H22-A-02", "지수함수", 2)},
            {"unit": "삼각함수", "sectionType": "익힘책", "bookPart": "workbook", "pages": [166, 167, 168, 169], "standard": ("대수", "H22-A-04", "삼각함수", 4)},
            {"unit": "수열", "sectionType": "익힘책", "bookPart": "workbook", "pages": [170, 171, 172, 173], "standard": ("대수", "H22-A-06", "등차수열과 등비수열", 6)},
        ],
    },
    {
        "size": 44241112,
        "publisher": "비상",
        "textbook": "확률과통계",
        "bookKind": "textbook",
        "detect": "colored_label",
        "note": "비상 확률과 통계 교과서. Scanned pages, TOC manually verified from rendered pages 6-7.",
        "sections": [
            {"unit": "순열과 조합", "sectionType": "중단원학습점검", "bookPart": "textbook", "pages": [23, 24, 25], "standard": ("확률과통계", "H22-PS-01", "순열과 조합", 1)},
            {"unit": "경우의 수", "sectionType": "대단원학습평가", "bookPart": "textbook", "pages": [28, 29, 30], "standard": ("확률과통계", "H22-PS-01", "순열과 조합", 1)},
            {"unit": "확률", "sectionType": "중단원학습점검", "bookPart": "textbook", "pages": [46, 47, 48], "standard": ("확률과통계", "H22-PS-03", "확률의 뜻과 활용", 3)},
            {"unit": "조건부확률", "sectionType": "중단원학습점검", "bookPart": "textbook", "pages": [59, 60, 61], "standard": ("확률과통계", "H22-PS-04", "조건부확률", 4)},
            {"unit": "확률", "sectionType": "대단원학습평가", "bookPart": "textbook", "pages": [64, 65, 66], "standard": ("확률과통계", "H22-PS-04", "조건부확률", 4)},
            {"unit": "확률분포", "sectionType": "중단원학습점검", "bookPart": "textbook", "pages": [97, 98, 99], "standard": ("확률과통계", "H22-PS-05", "확률분포", 5)},
            {"unit": "통계적 추정", "sectionType": "중단원학습점검", "bookPart": "textbook", "pages": [119, 120, 121], "standard": ("확률과통계", "H22-PS-06", "통계적 추정", 6)},
            {"unit": "통계", "sectionType": "대단원학습평가", "bookPart": "textbook", "pages": [124, 125, 126], "standard": ("확률과통계", "H22-PS-06", "통계적 추정", 6)},
            {"unit": "경우의 수", "sectionType": "익힘책", "bookPart": "workbook", "pages": [132, 133, 134], "standard": ("확률과통계", "H22-PS-01", "순열과 조합", 1)},
            {"unit": "확률", "sectionType": "익힘책", "bookPart": "workbook", "pages": [135, 136, 137, 138], "standard": ("확률과통계", "H22-PS-03", "확률의 뜻과 활용", 3)},
            {"unit": "통계", "sectionType": "익힘책", "bookPart": "workbook", "pages": [139, 140, 141], "standard": ("확률과통계", "H22-PS-05", "확률분포", 5)},
        ],
    },
    {
        "size": 21978538,
        "publisher": "마플",
        "textbook": "마플시너지 공통수학1",
        "bookKind": "workbook",
        "detect": "mapl_marker",
        "note": "마플시너지 공통수학1. Scanned problem book; TOC pages 2-3 rendered and verified.",
        "sections": [
            {"unit": "다항식", "sectionType": "문제집대단원", "bookPart": "workbook", "pages": list(range(10, 76)), "standard": ("공통수학1", "H22-C-RAW", "다항식", 999), "standardNote": "대단원 pack spans H22-C-01/H22-C-02/H22-C-03; problem-level mapping deferred to transcription."},
            {"unit": "방정식과 부등식", "sectionType": "문제집대단원", "bookPart": "workbook", "pages": list(range(76, 246)), "standard": ("공통수학1", "H22-C-RAW", "방정식과 부등식", 999), "standardNote": "대단원 pack spans H22-C-04/H22-C-05/H22-C-06; problem-level mapping deferred to transcription."},
            {"unit": "경우의 수", "sectionType": "문제집대단원", "bookPart": "workbook", "pages": list(range(246, 296)), "standard": ("공통수학1", "H22-C-07", "합의 법칙과 곱의 법칙", 7)},
            {"unit": "행렬", "sectionType": "문제집대단원", "bookPart": "workbook", "pages": list(range(296, 325)), "standard": ("공통수학1", "H22-C-09", "행렬과 그 연산", 9)},
            {"unit": "모의평가", "sectionType": "모의평가", "bookPart": "workbook", "pages": list(range(325, 377)), "standard": ("공통수학1", "H22-C-RAW", "모의평가", 999), "standardNote": "Mixed assessment pages; problem-level mapping deferred to transcription."},
        ],
    },
    {
        "size": 31601285,
        "publisher": "마플",
        "textbook": "마플시너지 공통수학2",
        "bookKind": "workbook",
        "detect": "mapl_marker",
        "note": "마플시너지 공통수학2. Scanned problem book; TOC pages 2-3 rendered and verified.",
        "sections": [
            {"unit": "도형의 방정식", "sectionType": "문제집대단원", "bookPart": "workbook", "pages": list(range(10, 122)), "standard": ("공통수학2", "H22-C2-RAW", "도형의 방정식", 999), "standardNote": "대단원 pack spans H22-C2-01/H22-C2-02/H22-C2-03/H22-C2-04; problem-level mapping deferred to transcription."},
            {"unit": "집합과 명제", "sectionType": "문제집대단원", "bookPart": "workbook", "pages": list(range(122, 216)), "standard": ("공통수학2", "H22-C2-RAW", "집합과 명제", 999), "standardNote": "대단원 pack spans H22-C2-05/H22-C2-06; problem-level mapping deferred to transcription."},
            {"unit": "함수와 그래프", "sectionType": "문제집대단원", "bookPart": "workbook", "pages": list(range(216, 331)), "standard": ("공통수학2", "H22-C2-RAW", "함수와 그래프", 999), "standardNote": "대단원 pack spans H22-C2-07/H22-C2-08/H22-C2-09; problem-level mapping deferred to transcription."},
            {"unit": "모의평가", "sectionType": "모의평가", "bookPart": "workbook", "pages": list(range(331, 561)), "standard": ("공통수학2", "H22-C2-RAW", "모의평가", 999), "standardNote": "Mixed assessment pages; problem-level mapping deferred to transcription."},
        ],
    },
]


def ensure(path: Path):
    path.mkdir(parents=True, exist_ok=True)


def write_json(path: Path, data):
    ensure(path.parent)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def safe_key(text: str) -> str:
    return re.sub(r'[<>:"/\\\\|?*\\s]+', "", text).strip("_")


def render_js(title, questions):
    return "window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\n\nwindow.questionBank = " + json.dumps(questions, ensure_ascii=False, indent=2) + ";\n"


def zip_dir(src_dir: Path, zip_path: Path):
    if zip_path.exists():
        zip_path.unlink()
    ensure(zip_path.parent)
    with ZipFile(zip_path, "w", ZIP_DEFLATED) as archive:
        for file in src_dir.rglob("*"):
            if file.is_file():
                archive.write(file, file.relative_to(src_dir).as_posix())


def render_page(doc, page_no, dest):
    page = doc[page_no - 1]
    pix = page.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE), alpha=False)
    ensure(dest.parent)
    pix.save(dest)
    return pix.width, pix.height


def is_colored_label_pixel(r, g, b):
    mx = max(r, g, b)
    mn = min(r, g, b)
    return mx - mn > 45 and mx < 248 and mn < 220


def is_mapl_marker_pixel(r, g, b):
    green = g > 105 and g - r > 18 and g - b > 8
    blue = b > 105 and b - r > 20 and b - g > -15
    orange = r > 150 and g > 75 and r - b > 45
    return (green or blue or orange) and max(r, g, b) - min(r, g, b) > 35


def components(image, predicate, x0_ratio=0.03, x1_ratio=0.97):
    w, h = image.size
    data = image.tobytes()
    mask = bytearray(w * h)
    y_start = int(h * 0.07)
    y_end = int(h * 0.93)
    x_start = int(w * x0_ratio)
    x_end = int(w * x1_ratio)
    for y in range(y_start, y_end):
        row = y * w
        pixrow = row * 3
        for x in range(x_start, x_end):
            i = pixrow + x * 3
            if predicate(data[i], data[i + 1], data[i + 2]):
                mask[row + x] = 1
    out = []
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
            neighbors = (
                cur + 1 if x + 1 < w else -1,
                cur - 1 if x > 0 else -1,
                cur + w if y + 1 < h else -1,
                cur - w if y > 0 else -1,
            )
            for nb in neighbors:
                if nb >= 0 and mask[nb]:
                    mask[nb] = 0
                    stack.append(nb)
        if area >= 8:
            out.append({"x0": min_x, "y0": min_y, "x1": max_x + 1, "y1": max_y + 1, "area": area})
    return out


def merge_markers(comps, page_width, page_height, mode):
    digits = []
    for comp in comps:
        width = comp["x1"] - comp["x0"]
        height = comp["y1"] - comp["y0"]
        if mode == "mapl_marker":
            ok = 3 <= width <= 38 and 6 <= height <= 45 and 8 <= comp["area"] <= 650
        else:
            ok = 6 <= width <= 115 and 12 <= height <= 85 and 30 <= comp["area"] <= 6000
        if ok:
            digits.append(comp)
    digits.sort(key=lambda item: (item["y0"], item["x0"]))
    groups = []
    for digit in digits:
        placed = False
        for group in groups:
            same_row = abs(((group["y0"] + group["y1"]) / 2) - ((digit["y0"] + digit["y1"]) / 2)) <= (14 if mode == "mapl_marker" else 22)
            gap = 16 if mode == "mapl_marker" else 24
            close_x = digit["x0"] <= group["x1"] + gap and digit["x1"] >= group["x0"] - gap
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
        if mode == "mapl_marker":
            if group["digitCount"] < 2 or width < 12 or width > page_width * 0.90 or height < 8 or height > 48:
                continue
            starts_left = page_width * 0.055 <= group["x0"] <= page_width * 0.18
            starts_right = page_width * 0.51 <= group["x0"] <= page_width * 0.64
            starts_at_problem_number_gutter = starts_left or starts_right
            if not starts_at_problem_number_gutter or width < 58:
                continue
            if group["y0"] < page_height * 0.08 or group["y0"] > page_height * 0.90:
                continue
            column = "left" if starts_left else "right"
            markers.append({**group, "column": column})
            continue
        else:
            if width > 125 or height > 100 or group["area"] > 9000:
                continue
        if group["y0"] < page_height * 0.08 or group["y0"] > page_height * 0.90:
            continue
        if page_width * 0.04 <= x_mid < page_width * 0.49:
            column = "left"
        elif page_width * 0.49 <= x_mid <= page_width * 0.96:
            column = "right"
        else:
            continue
        markers.append({**group, "column": column})
    markers.sort(key=lambda item: (0 if item["column"] == "left" else 1, item["y0"], item["x0"]))
    deduped = []
    for marker in markers:
        if deduped and marker["column"] == deduped[-1]["column"] and abs(marker["y0"] - deduped[-1]["y0"]) < 24:
            deduped[-1]["x0"] = min(deduped[-1]["x0"], marker["x0"])
            deduped[-1]["x1"] = max(deduped[-1]["x1"], marker["x1"])
            deduped[-1]["y0"] = min(deduped[-1]["y0"], marker["y0"])
            deduped[-1]["y1"] = max(deduped[-1]["y1"], marker["y1"])
            deduped[-1]["area"] += marker["area"]
        else:
            deduped.append(marker.copy())
    return deduped


def detect_markers(page_png, mode):
    image = Image.open(page_png).convert("RGB")
    predicate = is_mapl_marker_pixel if mode == "mapl_marker" else is_colored_label_pixel
    comps = components(image, predicate)
    if mode == "mapl_marker":
        return detect_mapl_problem_markers(comps, image.width, image.height)
    return merge_markers(comps, image.width, image.height, mode)


def detect_mapl_problem_markers(comps, page_width, page_height):
    digits = []
    for comp in comps:
        width = comp["x1"] - comp["x0"]
        height = comp["y1"] - comp["y0"]
        if not (3 <= width <= 38 and 6 <= height <= 45 and 8 <= comp["area"] <= 650):
            continue
        if page_width * 0.055 <= comp["x0"] <= page_width * 0.18:
            column = "left"
        elif page_width * 0.51 <= comp["x0"] <= page_width * 0.64:
            column = "right"
        else:
            continue
        if comp["y0"] < page_height * 0.08 or comp["y0"] > page_height * 0.90:
            continue
        digits.append({**comp, "column": column, "cy": (comp["y0"] + comp["y1"]) / 2})
    digits.sort(key=lambda item: (item["column"], item["cy"], item["x0"]))
    rows = []
    for digit in digits:
        placed = False
        for row in rows:
            if row["column"] == digit["column"] and abs(row["cy"] - digit["cy"]) <= 14:
                row["items"].append(digit)
                row["cy"] = sum(item["cy"] for item in row["items"]) / len(row["items"])
                placed = True
                break
        if not placed:
            rows.append({"column": digit["column"], "cy": digit["cy"], "items": [digit]})
    markers = []
    for row in rows:
        items = sorted(row["items"], key=lambda item: item["x0"])
        # Problem numbers are four digits in this series; tolerate one missed digit.
        if len(items) < 3:
            continue
        x0 = min(item["x0"] for item in items)
        y0 = min(item["y0"] for item in items)
        x1 = max(item["x1"] for item in items)
        y1 = max(item["y1"] for item in items)
        if x1 - x0 < 45:
            continue
        markers.append({
            "x0": x0,
            "y0": y0,
            "x1": x1,
            "y1": y1,
            "area": sum(item["area"] for item in items),
            "digitCount": len(items),
            "column": row["column"],
        })
    markers.sort(key=lambda item: (0 if item["column"] == "left" else 1, item["y0"], item["x0"]))
    return markers


def crop_regions(page_png, mode):
    image = Image.open(page_png).convert("RGB")
    w, h = image.size
    markers = detect_markers(page_png, mode)
    regions = []
    by_col = defaultdict(list)
    for marker in markers:
        by_col[marker["column"]].append(marker)
    for column, items in by_col.items():
        items.sort(key=lambda item: item["y0"])
        if column == "left":
            x0 = int(w * (0.055 if mode == "mapl_marker" else 0.060))
            x1 = int(w * (0.500 if mode == "mapl_marker" else 0.495))
        else:
            x0 = int(w * (0.495 if mode == "mapl_marker" else 0.500))
            x1 = int(w * (0.955 if mode == "mapl_marker" else 0.945))
        for index, marker in enumerate(items):
            next_marker = items[index + 1] if index + 1 < len(items) else None
            y0 = max(int(h * 0.08), marker["y0"] - 22)
            y1 = next_marker["y0"] - 28 if next_marker else int(h * 0.915)
            min_height = 55 if mode == "mapl_marker" else 80
            if y1 - y0 < min_height:
                continue
            regions.append({
                "column": column,
                "markerBox": [marker["x0"], marker["y0"], marker["x1"], marker["y1"]],
                "bboxPx": [x0, y0, x1, y1],
                "confidence": 0.46 if mode == "mapl_marker" else 0.55,
            })
    regions.sort(key=lambda item: (0 if item["column"] == "left" else 1, item["bboxPx"][1]))
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


def make_contact_sheet(items, dest):
    tiles = []
    for item in items[:180]:
        try:
            image = Image.open(item["cropPathAbs"]).convert("RGB")
        except Exception:
            continue
        image.thumbnail((290, 190))
        tile = Image.new("RGB", (330, 250), "white")
        tile.paste(image, (20, 8))
        draw = ImageDraw.Draw(tile)
        draw.text((8, 203), f"id {item['jsIdCandidate']:04d} p{item['pageNo']} q{item['displayNo']} {item['column']}", fill=(0, 0, 0))
        tiles.append(tile)
    if not tiles:
        return False
    cols = 3
    rows = math.ceil(len(tiles) / cols)
    sheet = Image.new("RGB", (cols * 330, rows * 250), "white")
    for idx, tile in enumerate(tiles):
        sheet.paste(tile, ((idx % cols) * 330, (idx // cols) * 250))
    ensure(dest.parent)
    sheet.save(dest)
    return True


def question_object(item, book, section):
    standard_course, standard_key, standard_unit, standard_order = section["standard"]
    tags = ["교재", book["publisher"], book["textbook"], "고1", section["unit"], section["sectionType"]]
    if book["bookKind"] == "textbook":
        tags.append("교과서")
    else:
        tags.append("문제집")
    return {
        "id": item["jsIdCandidate"],
        "level": "",
        "category": section["sectionType"],
        "originalCategory": section["sectionType"],
        "standardCourse": standard_course,
        "standardUnitKey": standard_key,
        "standardUnit": standard_unit,
        "standardUnitOrder": standard_order,
        "questionType": "",
        "layoutTag": "grid",
        "tags": tags,
        "wide": False,
        "content": "",
        "choices": [],
        "image": "",
        "answer": "",
        "solution": "",
        "displayNo": item["displayNo"],
        "sourcePageNo": item["pageNo"],
        "sourceCropPath": item["cropPath"],
    }


def build_section(doc, pdf_path, out, book, section):
    gen = out / "generated"
    set_key = safe_key(f"{book['publisher']}_{book['textbook']}_{section['unit']}_{section['sectionType']}_고1")
    rendered_root = gen / "work" / "page_crops" / section["bookPart"] / set_key
    crop_root = gen / "work" / "question_crops" / section["bookPart"] / set_key
    js_root = gen / "js" / section["bookPart"]
    templates_root = gen / "input_templates"
    reports_root = gen / "reports"
    review_root = gen / "review_pack" / "by_unit_fresh"
    for folder in [rendered_root, crop_root, js_root, templates_root, reports_root, review_root]:
        ensure(folder)

    items = []
    failures = []
    local_id = 1
    for page_no in section["pages"]:
        if page_no < 1 or page_no > len(doc):
            failures.append({"setKey": set_key, "pageNo": page_no, "status": "page_out_of_range"})
            continue
        page_png = rendered_root / f"page{page_no}.png"
        render_page(doc, page_no, page_png)
        regions = crop_regions(page_png, book["detect"])
        if not regions:
            failures.append({"setKey": set_key, "pageNo": page_no, "status": "question_number_not_found"})
            continue
        for region in regions:
            display_no = f"{local_id:02d}" if book["bookKind"] == "textbook" else f"{local_id:04d}"
            crop_name = f"{set_key}_page{page_no}_q{display_no}_full.png"
            crop_path_abs = crop_root / crop_name
            bbox_px, crop_size = save_crop(page_png, region["bboxPx"], crop_path_abs)
            item = {
                "setKey": set_key,
                "bookPart": section["bookPart"],
                "publisher": book["publisher"],
                "textbook": book["textbook"],
                "unit": section["unit"],
                "sectionType": section["sectionType"],
                "grade": "고1",
                "pageNo": page_no,
                "pageIndex": page_no - 1,
                "sourcePageImage": page_png.relative_to(out).as_posix(),
                "displayNo": display_no,
                "cropFile": crop_name,
                "cropPath": crop_path_abs.relative_to(out).as_posix(),
                "cropPathAbs": str(crop_path_abs),
                "sourceSectionTitle": section["sectionType"],
                "column": region["column"],
                "bbox": bbox_px,
                "markerBox": region["markerBox"],
                "status": "crop_success",
                "confidence": region["confidence"],
                "note": section.get("standardNote", book["note"]),
                "jsIdCandidate": local_id,
                "cropWidth": crop_size[0],
                "cropHeight": crop_size[1],
            }
            items.append(item)
            local_id += 1

    questions = [question_object(item, book, section) for item in items]
    title = f"{book['publisher']} {book['textbook']} {section['unit']} {section['sectionType']} 고1"
    js_path = js_root / f"{set_key}.js"
    js_path.write_text(render_js(title, questions), encoding="utf-8")

    write_json(templates_root / f"{set_key}_input_template.json", {
        "setKey": set_key,
        "sourcePdf": pdf_path.name,
        "schemaVersion": 1,
        "items": [
            {
                "setKey": item["setKey"],
                "id": item["jsIdCandidate"],
                "displayNo": item["displayNo"],
                "pageNo": item["pageNo"],
                "sourcePageImage": item["sourcePageImage"],
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
        "allowedStatus": ["confirmed", "manual_review", "formula_uncertain", "crop_issue", "choices_uncertain", "answer_uncertain", "solution_pending", "skip_page_range"],
        "allowedCorrectionFields": ["content", "choices", "answer", "solution", "status", "note"],
    })
    make_contact_sheet(items, reports_root / "contact_sheets" / set_key / "question_crop_sheet.png")

    pack_dir = review_root / f"{set_key}_fresh"
    if pack_dir.exists():
        shutil.rmtree(pack_dir)
    ensure(pack_dir / "page_full_images")
    ensure(pack_dir / "question_crop_images")
    ensure(pack_dir / "js")
    ensure(pack_dir / "input_templates")
    ensure(pack_dir / "crop_quality")
    copied_pages = set()
    for item in items:
        page_no = int(item["pageNo"])
        page_src = out / item["sourcePageImage"]
        if page_no not in copied_pages and page_src.exists():
            shutil.copyfile(page_src, pack_dir / "page_full_images" / f"p{page_no:03d}.png")
            copied_pages.add(page_no)
        shutil.copyfile(out / item["cropPath"], pack_dir / "question_crop_images" / item["cropFile"])
    shutil.copyfile(js_path, pack_dir / "js" / js_path.name)
    shutil.copyfile(templates_root / f"{set_key}_input_template.json", pack_dir / "input_template.json")
    shutil.copyfile(templates_root / f"{set_key}_correction_result_schema.json", pack_dir / "correction_result_schema.json")
    instruction = ROOT / "발문_프롬프트.md"
    if instruction.exists():
        shutil.copyfile(instruction, pack_dir / "input_instruction.md")
    write_json(pack_dir / "crop_index.json", [{k: v for k, v in item.items() if k != "cropPathAbs"} for item in items])
    write_json(pack_dir / "manifest.json", {
        "sourcePdf": pdf_path.name,
        "publisher": book["publisher"],
        "textbook": book["textbook"],
        "unit": section["unit"],
        "sectionType": section["sectionType"],
        "setKey": set_key,
        "questionCropCount": len(items),
        "pageFullImageCount": len(copied_pages),
        "primaryEvidenceFolder": "page_full_images",
        "questionCropRole": "optional_zoom_reference",
        "imageFieldPolicy": "visual_asset_only",
        "pageRange": [min(section["pages"]), max(section["pages"])],
        "standardCourse": section["standard"][0],
        "standardUnitKey": section["standard"][1],
        "standardUnit": section["standard"][2],
        "standardUnitOrder": section["standard"][3],
        "standardNote": section.get("standardNote", ""),
        "status": "pending_content_input",
    })
    (pack_dir / "README.md").write_text(
        "# AP Math unit input pack\n\n"
        "- `page_full_images/` contains full page PNG files and is the primary evidence for transcription.\n"
        "- `question_crop_images/` contains optional per-question zoom/reference PNG files.\n"
        "- Final JS `image` may contain visual asset crop paths only, never page or question crop paths.\n"
        "- Transcribe only what is visible in the page evidence and its optional zoom references.\n"
        "- Do not infer answers or create solutions.\n",
        encoding="utf-8",
    )
    zip_path = review_root / f"{set_key}_fresh.zip"
    zip_dir(pack_dir, zip_path)
    return {
        "setKey": set_key,
        "bookPart": section["bookPart"],
        "unit": section["unit"],
        "sectionType": section["sectionType"],
        "pages": section["pages"],
        "itemCount": len(items),
        "failureCount": len(failures),
        "failures": failures,
        "zipPath": zip_path.relative_to(out).as_posix(),
        "standardUnitKey": section["standard"][1],
        "standardNote": section.get("standardNote", ""),
        "items": items,
        "status": "ok" if items else "manual_review",
    }


def build_book(book, pdf_path):
    out = ROOT / pdf_path.stem
    gen = out / "generated"
    if out.exists():
        # Preserve source PDF, but rebuild generated output for this fresh run.
        generated = out / "generated"
        if generated.exists():
            shutil.rmtree(generated)
    ensure(gen)
    doc = fitz.open(pdf_path)
    sections = []
    all_items = []
    all_failures = []
    for section in book["sections"]:
        result = build_section(doc, pdf_path, out, book, section)
        sections.append({k: v for k, v in result.items() if k != "items"})
        all_items.extend(result["items"])
        all_failures.extend(result["failures"])

    reports = gen / "reports"
    write_json(reports / "question_crop_map.json", {"items": [{k: v for k, v in item.items() if k != "cropPathAbs"} for item in all_items]})
    write_json(reports / "section_set_detection_report.json", [
        {
            "detectedSetKey": section["setKey"],
            "bookPart": section["bookPart"],
            "unit": section["unit"],
            "sectionType": section["sectionType"],
            "startPage": min(section["pages"]) if section["pages"] else None,
            "endPage": max(section["pages"]) if section["pages"] else None,
            "detectedQuestionCount": section["itemCount"],
            "confidence": 0.75 if section["itemCount"] else 0.2,
            "needsManualReview": section["itemCount"] == 0 or bool(section.get("standardNote")),
            "note": section.get("standardNote", book["note"]),
        }
        for section in sections
    ])
    write_json(reports / "question_crop_summary.json", {
        "sourcePdf": pdf_path.name,
        "bookFolder": out.name,
        "sectionCount": len(sections),
        "questionCropCount": len(all_items),
        "failureCount": len(all_failures),
        "status": "ok" if all_items else "manual_review",
    })
    write_json(reports / "question_crop_failed.json", all_failures)
    raw_or_unresolved = [
        {
            "setKey": section["setKey"],
            "standardUnitKey": section["standardUnitKey"],
            "reason": section["standardNote"] or "RAW high-level pack; problem-level standard unit mapping deferred",
        }
        for section in sections
        if "RAW" in section["standardUnitKey"] or section.get("standardNote")
    ]
    write_json(reports / "unresolved_standard_unit_report.json", raw_or_unresolved)
    write_json(reports / "tag_normalization_report.json", {
        "status": "ok",
        "tagsEmptyCount": 0,
        "principle": "All generated JS skeleton questions include publisher/textbook/grade/unit/section tags.",
    })
    write_json(reports / "standard_unit_mapping_report.json", {
        "mappedCount": len(all_items) - sum(1 for item in all_items if "RAW" in next(s for s in sections if s["setKey"] == item["setKey"])["standardUnitKey"]),
        "unresolvedSetCount": len(raw_or_unresolved),
        "unresolved": raw_or_unresolved,
    })
    ids_by_file = defaultdict(list)
    for item in all_items:
        ids_by_file[item["setKey"]].append(item["jsIdCandidate"])
    write_json(reports / "id_sequence_report.json", {
        "sets": [
            {
                "setKey": set_key,
                "count": len(ids),
                "firstId": ids[0] if ids else None,
                "lastId": ids[-1] if ids else None,
                "duplicateIds": sorted([value for value, count in Counter(ids).items() if count > 1]),
                "missingIds": sorted(set(range(1, len(ids) + 1)) - set(ids)),
            }
            for set_key, ids in ids_by_file.items()
        ]
    })
    zip_report = []
    for zip_path in (gen / "review_pack" / "by_unit_fresh").glob("*_fresh.zip"):
        with ZipFile(zip_path) as archive:
            names = archive.namelist()
        zip_report.append({
            "zip": zip_path.relative_to(out).as_posix(),
            "pageFullImageCount": sum(1 for name in names if name.startswith("page_full_images/") and name.endswith(".png")),
            "questionCropImageCount": sum(1 for name in names if name.startswith("question_crop_images/") and name.endswith(".png")),
            "hasInputInstruction": "input_instruction.md" in names,
            "hasJs": any(name.startswith("js/") and name.endswith(".js") for name in names),
        })
    write_json(reports / "fresh_pack_zip_validation.json", zip_report)
    (out / "CODEX_RESULT.md").write_text(
        "# CODEX_RESULT\n\n"
        "## Round: new4 fresh unit input packs\n\n"
        f"- 입력 PDF: {pdf_path.name}\n"
        f"- 생성 폴더: {out}\n"
        f"- section/setKey 수: {len(sections)}\n"
        f"- question full crop 수: {len(all_items)}\n"
        f"- 실패 page/section 항목 수: {len(all_failures)}\n"
        f"- fresh zip 수: {len(zip_report)}\n"
        f"- 표준단원 unresolved set 수: {len(raw_or_unresolved)}\n"
        "- git add/commit/push: 하지 않음\n",
        encoding="utf-8",
    )
    return {
        "pdf": pdf_path.name,
        "bookFolder": out.name,
        "sectionCount": len(sections),
        "questionCropCount": len(all_items),
        "failureCount": len(all_failures),
        "zipCount": len(zip_report),
        "unresolvedStandardUnitSetCount": len(raw_or_unresolved),
        "status": "ok" if all_items else "manual_review",
    }


def main():
    by_size = {book["size"]: book for book in TARGET_BOOKS}
    summaries = []
    missing = []
    for size, book in by_size.items():
        matches = [pdf for pdf in ROOT.glob("*.pdf") if pdf.stat().st_size == size]
        if not matches:
            missing.append({"size": size, "textbook": book["textbook"]})
            continue
        summaries.append(build_book(book, matches[0]))
    root_report = ROOT / "generated" / "reports" / "new4_fresh_pack_pipeline_summary.json"
    write_json(root_report, {
        "processed": summaries,
        "missing": missing,
        "status": "ok" if summaries and not missing else "partial",
    })
    print(json.dumps({"processed": summaries, "missing": missing}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
