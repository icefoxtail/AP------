import json
import math
import re
import shutil
from collections import Counter, defaultdict
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

import fitz
from PIL import Image, ImageDraw


ROOT = Path.cwd()
DPI = 180
SCALE = DPI / 72


BOOKS = [
    {
        "pdf": "22개정 RPM 공통수학1.pdf",
        "bookKey": "RPM_공통수학1",
        "textbook": "RPM 공통수학1",
        "grade": "고1",
        "sections": [
            ("다항식", "01_다항식의연산", 6, 19),
            ("다항식", "02_항등식과나머지정리", 20, 31),
            ("다항식", "03_인수분해", 32, 43),
            ("방정식과부등식", "04_복소수", 44, 55),
            ("방정식과부등식", "05_이차방정식", 56, 69),
            ("방정식과부등식", "06_이차방정식과이차함수", 70, 81),
            ("방정식과부등식", "07_여러가지방정식", 82, 99),
            ("방정식과부등식", "08_연립일차부등식", 100, 109),
            ("방정식과부등식", "09_이차부등식과연립이차부등식", 110, 129),
            ("경우의수", "10_경우의수와순열", 130, 141),
            ("경우의수", "11_조합", 142, 155),
            ("행렬", "12_행렬", 156, 168),
        ],
    },
    {
        "pdf": "22개정 RPM 공통수학2.pdf",
        "bookKey": "RPM_공통수학2",
        "textbook": "RPM 공통수학2",
        "grade": "고1",
        "sections": [
            ("도형의방정식", "01_평면좌표", 6, 17),
            ("도형의방정식", "02_직선의방정식", 18, 31),
            ("도형의방정식", "03_원의방정식", 32, 47),
            ("도형의방정식", "04_도형의이동", 48, 63),
            ("집합과명제", "05_집합의뜻과포함관계", 64, 75),
            ("집합과명제", "06_집합의연산", 76, 93),
            ("집합과명제", "07_명제", 94, 115),
            ("함수", "08_함수", 116, 135),
            ("함수", "09_유리함수", 136, 153),
            ("함수", "10_무리함수", 154, 168),
        ],
    },
    {
        "pdf": "22개정 RPM 2-1.pdf",
        "bookKey": "RPM_중2_2-1",
        "textbook": "RPM 중학수학 2-1",
        "grade": "중2",
        "sections": [
            ("유리수와순환소수", "01_유리수와순환소수", 8, 27),
            ("식의계산", "02_단항식의계산", 28, 43),
            ("식의계산", "03_다항식의계산", 44, 57),
            ("일차부등식", "04_일차부등식", 58, 71),
            ("일차부등식", "05_일차부등식의활용", 72, 85),
            ("연립일차방정식", "06_연립일차방정식", 86, 103),
            ("연립일차방정식", "07_연립일차방정식의활용", 104, 119),
            ("일차함수", "08_일차함수와그래프1", 120, 133),
            ("일차함수", "09_일차함수와그래프2", 134, 147),
            ("일차함수", "10_일차함수와일차방정식의관계", 148, 163),
            ("부록", "대표문제다시풀기", 164, 192),
        ],
    },
    {
        "pdf": "22개정 RPM 2-2.pdf",
        "bookKey": "RPM_중2_2-2",
        "textbook": "RPM 중학수학 2-2",
        "grade": "중2",
        "sections": [
            ("삼각형의성질", "01_삼각형의성질", 8, 23),
            ("삼각형의성질", "02_삼각형의외심과내심", 24, 39),
            ("사각형의성질", "03_평행사변형", 40, 53),
            ("사각형의성질", "04_여러가지사각형", 54, 73),
            ("도형의닮음과피타고라스정리", "05_도형의닮음", 74, 89),
            ("도형의닮음과피타고라스정리", "06_평행선사이의선분의길이의비", 90, 103),
            ("도형의닮음과피타고라스정리", "07_삼각형의무게중심", 104, 117),
            ("도형의닮음과피타고라스정리", "08_피타고라스정리", 118, 135),
            ("확률", "09_경우의수", 136, 151),
            ("확률", "10_확률", 152, 167),
            ("부록", "대표문제다시풀기", 168, 192),
        ],
    },
]

STANDARD_META = {
    "01_다항식의연산": ("공통수학1", "H22-C-01", "다항식의 연산", 1),
    "02_항등식과나머지정리": ("공통수학1", "H22-C-02", "항등식과 나머지 정리", 2),
    "03_인수분해": ("공통수학1", "H22-C-03", "인수분해", 3),
    "04_복소수": ("공통수학1", "H22-C-04", "복소수와 이차방정식", 4),
    "05_이차방정식": ("공통수학1", "H22-C-04", "복소수와 이차방정식", 4),
    "06_이차방정식과이차함수": ("공통수학1", "H22-C-05", "이차방정식과 이차함수", 5),
    "07_여러가지방정식": ("공통수학1", "H22-C-06", "여러 가지 방정식과 부등식", 6),
    "08_연립일차부등식": ("공통수학1", "H22-C-06", "여러 가지 방정식과 부등식", 6),
    "09_이차부등식과연립이차부등식": ("공통수학1", "H22-C-06", "여러 가지 방정식과 부등식", 6),
    "10_경우의수와순열": ("공통수학1", "H22-C-07", "합의 법칙과 곱의 법칙", 7),
    "11_조합": ("공통수학1", "H22-C-08", "순열과 조합", 8),
    "12_행렬": ("공통수학1", "H22-C-09", "행렬과 그 연산", 9),
    "01_평면좌표": ("공통수학2", "H22-C2-01", "평면좌표", 1),
    "02_직선의방정식": ("공통수학2", "H22-C2-02", "직선의 방정식", 2),
    "03_원의방정식": ("공통수학2", "H22-C2-03", "원의 방정식", 3),
    "04_도형의이동": ("공통수학2", "H22-C2-04", "도형의 이동", 4),
    "05_집합의뜻과포함관계": ("공통수학2", "H22-C2-05", "집합", 5),
    "06_집합의연산": ("공통수학2", "H22-C2-05", "집합", 5),
    "07_명제": ("공통수학2", "H22-C2-06", "명제", 6),
    "08_함수": ("공통수학2", "H22-C2-07", "함수", 7),
    "09_유리함수": ("공통수학2", "H22-C2-08", "유리함수", 8),
    "10_무리함수": ("공통수학2", "H22-C2-09", "무리함수", 9),
    "01_유리수와순환소수": ("중2 수학", "M2-01", "수와 식", 1),
    "02_단항식의계산": ("중2 수학", "M2-01", "수와 식", 1),
    "03_다항식의계산": ("중2 수학", "M2-01", "수와 식", 1),
    "04_일차부등식": ("중2 수학", "M2-02", "일차부등식", 2),
    "05_일차부등식의활용": ("중2 수학", "M2-02", "일차부등식", 2),
    "06_연립일차방정식": ("중2 수학", "M2-03", "연립일차방정식", 3),
    "07_연립일차방정식의활용": ("중2 수학", "M2-03", "연립일차방정식", 3),
    "08_일차함수와그래프1": ("중2 수학", "M2-04", "일차함수와 그래프", 4),
    "09_일차함수와그래프2": ("중2 수학", "M2-04", "일차함수와 그래프", 4),
    "10_일차함수와일차방정식의관계": ("중2 수학", "M2-04", "일차함수와 그래프", 4),
    "01_삼각형의성질": ("중2 수학", "M2-05", "도형의 성질", 5),
    "02_삼각형의외심과내심": ("중2 수학", "M2-05", "도형의 성질", 5),
    "03_평행사변형": ("중2 수학", "M2-05", "도형의 성질", 5),
    "04_여러가지사각형": ("중2 수학", "M2-05", "도형의 성질", 5),
    "05_도형의닮음": ("중2 수학", "M2-06", "도형의 닮음", 6),
    "06_평행선사이의선분의길이의비": ("중2 수학", "M2-06", "도형의 닮음", 6),
    "07_삼각형의무게중심": ("중2 수학", "M2-06", "도형의 닮음", 6),
    "08_피타고라스정리": ("중2 수학", "M2-07", "피타고라스 정리", 7),
    "09_경우의수": ("중2 수학", "M2-08", "확률", 8),
    "10_확률": ("중2 수학", "M2-08", "확률", 8),
}

SECTION_TAGS = {
    "01_다항식의연산": "다항식의 연산",
    "02_항등식과나머지정리": "항등식과 나머지 정리",
    "03_인수분해": "인수분해",
    "04_복소수": "복소수",
    "05_이차방정식": "이차방정식",
    "06_이차방정식과이차함수": "이차방정식과 이차함수",
    "07_여러가지방정식": "여러 가지 방정식",
    "08_연립일차부등식": "연립일차부등식",
    "09_이차부등식과연립이차부등식": "이차부등식과 연립이차부등식",
    "10_경우의수와순열": "경우의 수와 순열",
    "11_조합": "조합",
    "12_행렬": "행렬",
    "01_평면좌표": "평면좌표",
    "02_직선의방정식": "직선의 방정식",
    "03_원의방정식": "원의 방정식",
    "04_도형의이동": "도형의 이동",
    "05_집합의뜻과포함관계": "집합의 뜻과 포함 관계",
    "06_집합의연산": "집합의 연산",
    "07_명제": "명제",
    "08_함수": "함수",
    "09_유리함수": "유리함수",
    "10_무리함수": "무리함수",
    "01_유리수와순환소수": "유리수와 순환소수",
    "02_단항식의계산": "단항식의 계산",
    "03_다항식의계산": "다항식의 계산",
    "04_일차부등식": "일차부등식",
    "05_일차부등식의활용": "일차부등식의 활용",
    "06_연립일차방정식": "연립일차방정식",
    "07_연립일차방정식의활용": "연립일차방정식의 활용",
    "08_일차함수와그래프1": "일차함수와 그래프 1",
    "09_일차함수와그래프2": "일차함수와 그래프 2",
    "10_일차함수와일차방정식의관계": "일차함수와 일차방정식의 관계",
    "01_삼각형의성질": "삼각형의 성질",
    "02_삼각형의외심과내심": "삼각형의 외심과 내심",
    "03_평행사변형": "평행사변형",
    "04_여러가지사각형": "여러 가지 사각형",
    "05_도형의닮음": "도형의 닮음",
    "06_평행선사이의선분의길이의비": "평행선 사이의 선분의 길이의 비",
    "07_삼각형의무게중심": "삼각형의 무게중심",
    "08_피타고라스정리": "피타고라스 정리",
    "09_경우의수": "경우의 수",
    "10_확률": "확률",
    "대표문제다시풀기": "대표문제 다시 풀기",
}


def ensure(path):
    path.mkdir(parents=True, exist_ok=True)


def write_json(path, data):
    ensure(path.parent)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def render_js(title, questions):
    return "window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\n\nwindow.questionBank = " + json.dumps(questions, ensure_ascii=False, indent=2) + ";\n"


def set_key(book, unit, section):
    return f"{book['bookKey']}_{unit}_{section}_{book['grade']}"


def clean_section_name(section):
    return SECTION_TAGS.get(section, re.sub(r"^\d+_", "", section).replace("_", " "))


def book_tag(book):
    return book["bookKey"].replace("RPM_", "").replace("중2_2-", "중2-")


def standard_meta(section):
    if section in STANDARD_META:
        return STANDARD_META[section]
    if section == "대표문제다시풀기":
        return ("중2 수학", "RAW-대표문제다시풀기", "대표문제 다시 풀기", 999)
    return ("", "", "", 0)


def render_page(doc, page_no, dest):
    page = doc[page_no - 1]
    pix = page.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE), alpha=False)
    ensure(dest.parent)
    pix.save(dest)
    return pix.width, pix.height


def problem_code_candidates(page):
    candidates = []
    height = page.rect.height
    for word in page.get_text("words"):
        x0, y0, x1, y1, text = word[:5]
        raw = str(text).strip()
        if not re.fullmatch(r"\d{4}", raw):
            continue
        value = int(raw)
        if value < 1 or value > 1800:
            continue
        if y0 < 40 or y0 > height - 65:
            continue
        if x0 < 25 or x0 > page.rect.width - 70:
            continue
        candidates.append({
            "code": raw,
            "codeNumber": value,
            "x0": float(x0),
            "y0": float(y0),
            "x1": float(x1),
            "y1": float(y1),
        })
    return candidates


def marker_columns(doc, start_page, end_page):
    xs = []
    for page_no in range(start_page, min(end_page, len(doc)) + 1):
        for candidate in problem_code_candidates(doc[page_no - 1]):
            xs.append(round(candidate["x0"] / 10) * 10)
    counts = Counter(xs)
    return sorted(x for x, count in counts.items() if count >= 3)


def nearest_column(x, columns):
    if not columns:
        return None
    best = min(columns, key=lambda col: abs(col - x))
    return best if abs(best - x) <= 28 else None


def crop_regions(page, columns):
    raw = []
    for candidate in problem_code_candidates(page):
        col = nearest_column(candidate["x0"], columns)
        if col is None:
            continue
        raw.append({**candidate, "columnKey": col})
    raw.sort(key=lambda item: (item["y0"], item["x0"], item["code"]))
    deduped = []
    seen = set()
    for item in raw:
        key = (item["code"], round(item["x0"]), round(item["y0"]))
        if key in seen:
            continue
        seen.add(key)
        deduped.append(item)
    by_col = defaultdict(list)
    for item in deduped:
        by_col[item["columnKey"]].append(item)
    columns_sorted = sorted(columns)
    regions = []
    for col, items in by_col.items():
        items.sort(key=lambda item: item["y0"])
        col_idx = columns_sorted.index(col)
        next_col = columns_sorted[col_idx + 1] if col_idx + 1 < len(columns_sorted) else None
        x_right = (next_col - 8) if next_col is not None else page.rect.width - 25
        for idx, item in enumerate(items):
            next_item = items[idx + 1] if idx + 1 < len(items) else None
            y_bottom = (next_item["y0"] - 6) if next_item else page.rect.height - 55
            x_left = max(20, item["x0"] - 5)
            y_top = max(35, item["y0"] - 7)
            if y_bottom - y_top < 18:
                y_bottom = min(page.rect.height - 55, y_top + 42)
            regions.append({
                "code": item["code"],
                "bboxPt": [x_left, y_top, x_right, y_bottom],
                "columnKey": col,
                "confidence": 0.58,
                "note": "RPM 4-digit problem-code crop",
            })
    regions.sort(key=lambda item: (item["bboxPt"][1], item["bboxPt"][0], item["code"]))
    return regions


def save_crop(page_png, bbox_pt, dest):
    im = Image.open(page_png).convert("RGB")
    x0, y0, x1, y1 = [int(round(value * SCALE)) for value in bbox_pt]
    pad = 10
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(im.width, x1 + pad)
    y1 = min(im.height, y1 + pad)
    crop = im.crop((x0, y0, x1, y1))
    ensure(dest.parent)
    crop.save(dest)
    return [x0, y0, x1, y1], list(crop.size)


def question_object(item, book, unit, section, index):
    course, unit_key, standard_unit, unit_order = standard_meta(section)
    category = standard_unit or unit
    section_name = clean_section_name(section)
    tags = ["교재", "RPM", book_tag(book), book["grade"], standard_unit or unit]
    if section_name and section_name != standard_unit:
        tags.append(section_name)
    return {
        "id": item["globalQuestionNo"],
        "level": "",
        "category": category,
        "originalCategory": category,
        "standardCourse": course,
        "standardUnitKey": unit_key,
        "standardUnit": standard_unit,
        "standardUnitOrder": unit_order,
        "questionType": "",
        "layoutTag": "grid",
        "tags": list(dict.fromkeys(tags)),
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


def input_template(item):
    return {
        "setKey": item["setKey"],
        "id": item["globalQuestionNo"],
        "globalQuestionNo": item["globalQuestionNo"],
        "displayNo": item["displayNo"],
        "problemCode": item["problemCode"],
        "questionNo": item["questionNo"],
        "sourceQuestionNo": item["sourceQuestionNo"],
        "pageNo": item["pageNo"],
        "sourcePageImage": f"generated/work/rendered_pages/{item['bookPart']}/{item['setKey']}/page_{int(item['pageNo']):03d}.png",
        "sourceCropPath": item["cropPath"],
        "content": "",
        "choices": [],
        "answer": "",
        "solution": "",
        "status": "pending_input",
    }


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
        draw = ImageDraw.Draw(tile)
        draw.text((10, 200), f"{item['setKey']}\nq{item['jsIdCandidate']:03d} code {item['problemCode']} p{item['pageNo']}", fill=(0, 0, 0))
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


def copy_for_pack(items, pack_dir, gen):
    page_dir = pack_dir / "page_full_images"
    crop_dir = pack_dir / "question_crop_images"
    ensure(page_dir)
    ensure(crop_dir)
    copied_pages = set()
    for item in items:
        page_no = int(item["pageNo"])
        page_src = gen / "work" / "rendered_pages" / item["bookPart"] / item["setKey"] / f"page_{page_no:03d}.png"
        if page_no not in copied_pages and page_src.exists():
            shutil.copyfile(page_src, page_dir / f"p{page_no:03d}.png")
            copied_pages.add(page_no)
        src = gen.parent / item["cropPath"]
        if src.exists():
            shutil.copyfile(src, crop_dir / Path(item["cropPath"]).name)


def process_book(book):
    pdf = ROOT / book["pdf"]
    if not pdf.exists():
        return {"pdf": book["pdf"], "status": "missing_pdf"}
    out = ROOT / pdf.stem
    gen = out / "generated"
    reports = gen / "reports"
    work = gen / "work"
    js_root = gen / "js" / "workbook"
    templates_root = gen / "input_templates"
    review_root = gen / "review_pack" / "by_unit_fresh"
    for folder in [reports, work, js_root, templates_root, review_root]:
        ensure(folder)

    doc = fitz.open(pdf)
    all_items = []
    failures = []
    section_reports = []
    unit_items = defaultdict(list)
    by_setkey = defaultdict(list)
    global_question_no = 1

    for unit, section, start_page, end_page in book["sections"]:
        end_page = min(end_page, len(doc))
        key = set_key(book, unit, section)
        columns = marker_columns(doc, start_page, end_page)
        section_items = []
        for page_no in range(start_page, end_page + 1):
            page = doc[page_no - 1]
            page_png = work / "rendered_pages" / "workbook" / key / f"page_{page_no:03d}.png"
            render_page(doc, page_no, page_png)
            regions = crop_regions(page, columns)
            for region in regions:
                idx = len(section_items) + 1
                source_question_no = int(region["code"])
                crop_name = f"{key}_p{page_no:03d}_code{region['code']}_q{idx:03d}_full.png"
                crop_path_abs = work / "question_crops" / "workbook" / key / crop_name
                bbox_px, size = save_crop(page_png, region["bboxPt"], crop_path_abs)
                rel_crop = crop_path_abs.relative_to(out).as_posix()
                item = {
                    "materialKey": book["bookKey"],
                    "setKey": key,
                    "bookPart": "workbook",
                    "unit": unit,
                    "section": section,
                    "pageNo": page_no,
                    "idPolicy": "book_sequential",
                    "globalQuestionNo": global_question_no,
                    "displayNo": region["code"],
                    "problemCode": region["code"],
                    "questionNo": source_question_no,
                    "sourceQuestionNo": source_question_no,
                    "jsIdCandidate": global_question_no,
                    "setKeyLocalIndex": idx,
                    "cropPath": rel_crop,
                    "cropPathAbs": str(crop_path_abs),
                    "bboxPt": region["bboxPt"],
                    "bboxPx": bbox_px,
                    "cropSize": size,
                    "confidence": region["confidence"],
                    "status": "success",
                }
                section_items.append(item)
                by_setkey[key].append(global_question_no)
                global_question_no += 1
        questions = [question_object(item, book, unit, section, i + 1) for i, item in enumerate(section_items)]
        (js_root / f"{key}.js").write_text(render_js(key, questions), encoding="utf-8")
        write_json(templates_root / f"{key}_input_template.json", {
            "setKey": key,
            "schemaVersion": 1,
            "items": [input_template(item) for item in section_items],
        })
        write_json(templates_root / f"{key}_correction_result_schema.json", {
            "setKey": key,
            "required": ["setKey", "id", "status"],
            "allowedCorrectionFields": ["content", "choices", "answer", "solution", "note"],
        })
        make_contact_sheet(section_items, reports / "rpm_contact_sheets" / f"{key}.png")
        all_items.extend(section_items)
        unit_items[unit].extend(section_items)
        if not section_items:
            failures.append({"setKey": key, "reason": "no_problem_code_crops_detected", "pageRange": [start_page, end_page]})
        section_reports.append({
            "setKey": key,
            "unit": unit,
            "section": section,
            "pageRange": [start_page, end_page],
            "markerColumns": columns,
            "questionCropCount": len(section_items),
            "status": "ok" if section_items else "manual_review",
        })

    pack_reports = []
    for unit, items in unit_items.items():
        unit_key = f"{book['bookKey']}_{unit}_{book['grade']}"
        pack_dir = review_root / unit_key
        if pack_dir.exists():
            shutil.rmtree(pack_dir)
        ensure(pack_dir)
        copy_for_pack(items, pack_dir, gen)
        unit_set_keys = sorted({item["setKey"] for item in items})
        js_dir = pack_dir / "js"
        input_dir = pack_dir / "input_templates"
        ensure(js_dir)
        ensure(input_dir)
        for key in unit_set_keys:
            src_js = js_root / f"{key}.js"
            if src_js.exists():
                shutil.copyfile(src_js, js_dir / src_js.name)
            for suffix in ["input_template.json", "correction_result_schema.json"]:
                src = templates_root / f"{key}_{suffix}"
                if src.exists():
                    shutil.copyfile(src, input_dir / src.name)
        write_json(pack_dir / "crop_index.json", [{k: v for k, v in item.items() if k != "cropPathAbs"} for item in items])
        write_json(pack_dir / "manifest.json", {
            "bookKey": book["bookKey"],
            "textbook": book["textbook"],
            "grade": book["grade"],
            "unit": unit,
            "setKeys": unit_set_keys,
            "questionCropCount": len(items),
            "primaryEvidenceFolder": "page_full_images",
            "questionCropRole": "optional_zoom_reference",
            "imageFieldPolicy": "visual_asset_only",
            "sourcePdf": book["pdf"],
            "status": "pending_content_input",
        })
        (pack_dir / "README.md").write_text(
            "# RPM fresh unit pack\n\n"
            "Use `page_full_images/` as the primary source evidence for content and choices.\n"
            "`question_crop_images/` is optional zoom/reference material only.\n"
            "Only visual asset crops may be written to the final JS `image` field.\n"
            "Generated JS is a skeleton; content, choices, answer, and solution remain pending input.\n",
            encoding="utf-8",
        )
        zip_path = review_root / f"{unit_key}_fresh.zip"
        zip_dir(pack_dir, zip_path)
        pack_reports.append({
            "unitKey": unit_key,
            "zip": zip_path.relative_to(out).as_posix(),
            "setCount": len(unit_set_keys),
            "questionCropCount": len(items),
        })

    write_json(reports / "rpm_question_crop_map.json", {"items": [{k: v for k, v in item.items() if k != "cropPathAbs"} for item in all_items]})
    write_json(reports / "rpm_section_detection_report.json", section_reports)
    write_json(reports / "rpm_crop_failed.json", failures)
    ids = [item["globalQuestionNo"] for item in all_items]
    duplicate_ids = sorted([id_value for id_value, count in Counter(ids).items() if count > 1])
    expected_ids = list(range(1, len(ids) + 1))
    missing_ids = sorted(set(expected_ids) - set(ids))
    extra_ids = sorted(set(ids) - set(expected_ids))
    restart_violations = [
        {"setKey": key, "firstId": values[0]}
        for key, values in by_setkey.items()
        if values and values[0] == 1 and key != all_items[0]["setKey"]
    ]
    id_sequence_items = [
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
        for item in all_items
    ]
    write_json(reports / "id_sequence_report.json", {
        "sourcePdf": book["pdf"],
        "idPolicy": "book_sequential",
        "idStart": 1,
        "idPad": 0,
        "displayNoPolicy": "preserve_original",
        "setKeyLocalIdPolicy": "forbidden",
        "questionCount": len(ids),
        "firstId": ids[0] if ids else None,
        "lastId": ids[-1] if ids else None,
        "by_setkey": dict(by_setkey),
        "items": id_sequence_items,
        "status": "ok" if ids == expected_ids and not restart_violations else "manual_review",
    })
    write_json(reports / "id_duplicate_report.json", {
        "duplicateIds": duplicate_ids,
        "duplicateCount": len(duplicate_ids),
        "status": "ok" if not duplicate_ids else "manual_review",
    })
    write_json(reports / "id_gap_report.json", {
        "missingIds": missing_ids,
        "missingCount": len(missing_ids),
        "extraIds": extra_ids,
        "extraCount": len(extra_ids),
        "status": "ok" if not missing_ids and not extra_ids else "manual_review",
    })
    write_json(reports / "setkey_id_restart_violation_report.json", {
        "violations": restart_violations,
        "violationCount": len(restart_violations),
        "status": "ok" if not restart_violations else "manual_review",
    })
    write_json(reports / "rpm_fresh_unit_pack_report.json", {
        "sourcePdf": book["pdf"],
        "bookKey": book["bookKey"],
        "idPolicy": "book_sequential",
        "sectionCount": len(section_reports),
        "questionCropCount": len(all_items),
        "failureCount": len(failures),
        "packs": pack_reports,
        "status": "ok" if all_items and not failures else "manual_review",
    })
    return {
        "pdf": book["pdf"],
        "generatedRoot": gen.as_posix(),
        "sectionCount": len(section_reports),
        "questionCropCount": len(all_items),
        "failureCount": len(failures),
        "packCount": len(pack_reports),
        "status": "ok" if all_items and not failures else "manual_review",
    }


def main():
    summaries = [process_book(book) for book in BOOKS]
    write_json(ROOT / "generated" / "reports" / "rpm_4book_fresh_pipeline_summary.json", {
        "books": summaries,
        "status": "ok" if all(item["status"] == "ok" for item in summaries) else "manual_review",
        "note": "Fresh packs contain question crops and JS skeletons. Content, choices, answers, and solutions are intentionally pending.",
    })
    print(json.dumps({"books": summaries}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
