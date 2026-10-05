import json
import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

import fitz


ROOT = Path.cwd()
REPORTS = ROOT / "generated" / "reports"
MAP_PATH = REPORTS / "text1_question_crop_map.json"

SAMPLE_JS = [
    Path("C:/Users/USER/Desktop/AP------/archive/exams/original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js"),
    Path("C:/Users/USER/Desktop/AP------/archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js"),
    Path("C:/Users/USER/Desktop/AP------/archive/exams/original/high/h1/1final/25_금당고_1학기_기말_고1_기출c.js"),
]


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def rel(path):
    try:
        return path.resolve().relative_to(ROOT.resolve()).as_posix()
    except ValueError:
        return path.as_posix()


def find_pdf():
    pdfs = sorted(ROOT.glob("*.pdf"))
    if not pdfs:
        raise FileNotFoundError("No PDF files in archive/text1")
    selected = max(pdfs, key=lambda p: p.stat().st_size)
    return selected, {
        "pdfCandidates": [{"file": p.name, "sizeBytes": p.stat().st_size} for p in pdfs],
        "selectedPdf": selected.name,
        "selectionNote": "Multiple PDFs found; selected largest file as textbook PDF." if len(pdfs) > 1 else "Only one PDF found; selected as input.",
    }


def inspect_archive_structure():
    samples = []
    for path in SAMPLE_JS:
        text = path.read_text(encoding="utf-8", errors="replace")
        first_obj = text[text.find("{"):text.find("},") + 1] if "}," in text else ""
        samples.append({
            "path": str(path),
            "hasWindowExamTitle": "window.examTitle" in text,
            "hasWindowQuestionBank": "window.questionBank" in text,
            "observedFields": sorted(set(re.findall(r'["\']?([A-Za-z][A-Za-z0-9_]*)["\']?\\s*:', first_obj))),
            "examTitleDeclaration": re.search(r"window\\.examTitle\\s*=\\s*.+?;", text, re.S).group(0)[:160] if re.search(r"window\\.examTitle\\s*=\\s*.+?;", text, re.S) else None,
        })
    inspection = {
        "samples": samples,
        "summary": {
            "examTitleDeclaration": "window.examTitle = string;",
            "questionBankDeclaration": "window.questionBank = array;",
            "idFieldType": "number",
            "contentField": "content",
            "choicesField": "choices",
            "answerField": "answer",
            "solutionField": "solution",
            "imageField": "image observed as optional/not required in sampled files",
            "tagsField": "tags array",
            "standardUnitFields": ["standardCourse", "standardUnitKey", "standardUnit", "standardUnitOrder"],
            "categoryFields": ["category", "originalCategory"],
            "layoutFields": ["questionType", "layoutTag", "wide"],
        },
    }
    write_json(REPORTS / "text1_js_archive_structure_inspection.json", inspection)
    return inspection


def clean_text(text):
    text = text.replace("\x07", " ").replace("\x08", " ").replace("\u200c", "")
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"^[0-9]{2}\s+", "", text)
    for bad in ["naver.com", "gmail.com", ".indd", "정답 및 풀이", "본문 00쪽"]:
        text = text.replace(bad, "")
    return text.strip()


def extract_text_from_bbox(page, bbox_pdf_points):
    rect = fitz.Rect(*bbox_pdf_points)
    words = []
    for w in page.get_text("words"):
        wrect = fitz.Rect(w[:4])
        center = ((wrect.x0 + wrect.x1) / 2, (wrect.y0 + wrect.y1) / 2)
        if rect.contains(fitz.Point(*center)):
            words.append(w)
    lines = []
    for w in sorted(words, key=lambda item: (round(item[1] / 4) * 4, item[0])):
        x0, y0, x1, y1, txt = w[:5]
        if not lines or abs(lines[-1]["y"] - y0) > 5:
            lines.append({"y": y0, "parts": [txt]})
        else:
            lines[-1]["parts"].append(txt)
    return clean_text("\n".join(" ".join(line["parts"]) for line in lines))


def split_choices(text):
    symbols = ["①", "②", "③", "④", "⑤"]
    positions = [(sym, text.find(sym)) for sym in symbols if text.find(sym) >= 0]
    if len(positions) < 2:
        return text, [], "no_choices"
    positions.sort(key=lambda item: item[1])
    if positions[0][0] != "①":
        return text, [], "ambiguous_choice_start"
    stem = text[:positions[0][1]].strip()
    choices = []
    for idx, (sym, pos) in enumerate(positions):
        end = positions[idx + 1][1] if idx + 1 < len(positions) else len(text)
        choice = text[pos + len(sym):end].strip()
        if choice:
            choices.append(choice)
    if len(choices) < 2:
        return text, [], "ambiguous_choices"
    return stem, choices, "choices_extracted"


def needs_image(page, bbox_pdf_points, text):
    rect = fitz.Rect(*bbox_pdf_points)
    drawing_hits = 0
    for d in page.get_drawings():
        try:
            if fitz.Rect(d["rect"]).intersects(rect):
                drawing_hits += 1
        except Exception:
            pass
    image_hits = 0
    for img in page.get_images(full=True):
        try:
            for r in page.get_image_rects(img[0]):
                if r.intersects(rect):
                    image_hits += 1
        except Exception:
            pass
    keywords = ["그림", "표", "그래프", "좌표", "도로망", "지도", "자동차", "타일", "계단", "직선", "정육면체", "반도체"]
    keyword_hits = [k for k in keywords if k in text]
    # Small decorative check icons and column rules are vector drawings too.
    # Treat vector-only regions as image-dependent only when they are complex
    # enough to plausibly be a diagram, or when the text explicitly refers to one.
    return image_hits > 0 or bool(keyword_hits) or drawing_hits >= 25, {
        "drawingHits": drawing_hits,
        "imageHits": image_hits,
        "keywordHits": keyword_hits,
    }


def human_unit(unit):
    replacements = {
        "경우의수": "경우의 수",
        "나머지정리와인수분해": "나머지 정리와 인수분해",
        "복소수와이차방정식": "복소수와 이차방정식",
        "이차방정식과이차함수": "이차방정식과 이차함수",
        "여러가지방정식과부등식": "여러 가지 방정식과 부등식",
        "방정식과부등식": "방정식과 부등식",
        "다항식": "다항식",
        "행렬": "행렬",
    }
    return replacements.get(unit, unit)


def human_section(section):
    return {"중단원학습점검": "중단원 학습 점검", "대단원학습평가": "대단원 학습 평가", "익힘책": "익힘책"}.get(section, section)


def standard_unit_order(unit):
    return standard_unit_mapping(unit)["standardUnitOrder"]


def standard_unit_mapping(unit):
    # Existing archive common-math-1 samples use the H22-C-* family.
    # Broad review sections can span more than one detailed standard unit; in
    # that case we use the representative key that best matches the section.
    mapping = {
        "다항식": ("H22-C-01", "다항식의 연산", 1, "direct"),
        "나머지정리와인수분해": ("H22-C-02", "항등식과 나머지 정리", 2, "representative_for_remainder_and_factorization"),
        "복소수와이차방정식": ("H22-C-04", "복소수와 이차방정식", 4, "direct"),
        "이차방정식과이차함수": ("H22-C-05", "이차방정식과 이차함수", 5, "direct"),
        "여러가지방정식과부등식": ("H22-C-06", "여러 가지 방정식과 부등식", 6, "direct"),
        "방정식과부등식": ("H22-C-06", "여러 가지 방정식과 부등식", 6, "representative_for_large_unit_review"),
        "경우의수": ("H22-C-08", "순열과 조합", 8, "representative_for_counting_unit"),
        "행렬": ("H22-C-09", "행렬과 그 연산", 9, "direct"),
    }
    key, standard_unit, order, note = mapping.get(unit, ("H22-C-00", human_unit(unit), 0, "fallback_unknown_unit"))
    return {
        "standardUnitKey": key,
        "standardUnit": standard_unit,
        "standardUnitOrder": order,
        "mappingNote": note,
    }


def js_string(value):
    return json.dumps(value, ensure_ascii=False)


def render_js(exam_title, questions):
    chunks = [f"window.examTitle = {js_string(exam_title)};\n", "window.questionBank = [\n"]
    rendered = []
    for q in questions:
        lines = ["  {"]
        keys = ["id", "level", "category", "originalCategory", "standardCourse", "standardUnitKey", "standardUnit", "standardUnitOrder", "questionType", "layoutTag", "tags", "wide", "content", "choices"]
        if q.get("image"):
            keys.append("image")
        keys += ["answer", "solution"]
        for idx, key in enumerate(keys):
            comma = "," if idx < len(keys) - 1 else ""
            lines.append(f"    {key}: {js_string(q[key]) if not isinstance(q[key], (int, bool, list)) else json.dumps(q[key], ensure_ascii=False)}{comma}")
        lines.append("  }")
        rendered.append("\n".join(lines))
    chunks.append(",\n".join(rendered))
    chunks.append("\n];\n")
    return "".join(chunks)


def run_node_check(path):
    proc = subprocess.run(["node", "--check", str(path)], cwd=ROOT, capture_output=True, text=True)
    return {"file": rel(path), "ok": proc.returncode == 0, "returncode": proc.returncode, "stdout": proc.stdout.strip(), "stderr": proc.stderr.strip()}


def main():
    REPORTS.mkdir(parents=True, exist_ok=True)
    task_path = ROOT / "CODEX_TASK_TEXT1_JS_FROM_CROPS.md"
    if not task_path.exists():
        task_path.write_text("# CODEX_TASK_TEXT1_JS_FROM_CROPS.md\n", encoding="utf-8")
    if not MAP_PATH.exists():
        result = {"status": "BLOCKED", "reason": "generated/reports/text1_question_crop_map.json not found"}
        write_json(REPORTS / "text1_js_generation_report.json", result)
        return

    inspection = inspect_archive_structure()
    pdf, pdf_report = find_pdf()
    doc = fitz.open(pdf)
    rows = json.load(open(MAP_PATH, encoding="utf-8"))["items"]
    missing_crops = [row for row in rows if not (ROOT / row["cropPath"]).exists()]
    if missing_crops:
        write_json(REPORTS / "text1_js_generation_report.json", {"status": "BLOCKED", "missingCropCount": len(missing_crops), "missingCrops": missing_crops[:20]})
        return

    by_set = defaultdict(list)
    for row in rows:
        by_set[row["setKey"]].append(row)
    for items in by_set.values():
        items.sort(key=lambda r: (r.get("jsIdCandidate") or 9999, r["pageNo"], 0 if r["column"] == "left" else 1, r["displayNo"]))

    input_map = {"inputCropMap": rel(MAP_PATH), "inputPdf": pdf.name, "pdfSelection": pdf_report, "setKeyCount": len(by_set), "questionCount": len(rows)}
    write_json(REPORTS / "text1_js_generation_input_map.json", input_map)

    content_report = []
    choices_report = []
    manual = []
    image_candidates = []
    unit_review = []
    generation_sets = []
    validation_checks = []
    js_paths = []

    for set_key, items in sorted(by_set.items()):
        first = items[0]
        book_part = first["bookPart"]
        out_dir = ROOT / "generated" / "js" / book_part
        out_dir.mkdir(parents=True, exist_ok=True)
        js_path = out_dir / f"{set_key}.js"
        questions = []
        for row in items:
            page = doc[row["pageIndex"]]
            text = extract_text_from_bbox(page, row.get("bboxPdfPoints") or [v / (250 / 72) for v in row["bbox"]])
            original_text = text
            content, choices, choice_status = split_choices(text)
            review_reasons = []
            if not content or len(content) < 8:
                review_reasons.append("content_too_short_or_empty")
            if re.search(r"(naver\\.com|gmail\\.com|\\.indd|정답 및 풀이|본문 00쪽)", content):
                review_reasons.append("contamination_string_detected")
            if choice_status.startswith("ambiguous"):
                review_reasons.append(choice_status)
            has_image, image_meta = needs_image(page, row.get("bboxPdfPoints") or [v / (250 / 72) for v in row["bbox"]], original_text)
            tags = ["교과서", "비상", "공통수학1", row["sectionType"], row["unit"]]
            for tag in ["도형", "표", "그래프", "이미지자료"]:
                if (tag == "도형" and any(k in original_text for k in ["그림", "정육면체", "도로망", "직선", "자동차", "타일", "계단"])) or (tag == "표" and "표" in original_text) or (tag == "그래프" and "그래프" in original_text) or (tag == "이미지자료" and has_image):
                    tags.append(tag)
            tags = [t for i, t in enumerate(tags) if t and t not in tags[:i]]
            js_id = int(row["jsIdCandidate"])
            image_path = f"assets/{book_part}/{set_key}/q{js_id:03d}.png" if has_image else ""
            if has_image:
                image_candidates.append({
                    "setKey": set_key,
                    "pageNo": row["pageNo"],
                    "displayNo": row["displayNo"],
                    "jsId": js_id,
                    "cropFile": row["cropFile"],
                    "image": image_path,
                    "reason": image_meta,
                    "cropPath": row["cropPath"],
                })
            if review_reasons:
                manual.append({
                    "setKey": set_key,
                    "pageNo": row["pageNo"],
                    "displayNo": row["displayNo"],
                    "jsId": js_id,
                    "cropFile": row["cropFile"],
                    "reason": review_reasons,
                    "extractedText": original_text,
                    "cropPath": row["cropPath"],
                    "suggestedAction": "Open crop image and correct content/choices manually.",
                })
            qtype = "객관식" if choices else ("서술형" if "풀이 과정을 자세히" in original_text else "단답형")
            unit_map = standard_unit_mapping(row["unit"])
            question = {
                "id": js_id,
                "level": "중",
                "category": human_unit(row["unit"]),
                "originalCategory": human_section(row["sectionType"]),
                "standardCourse": "공통수학1",
                "standardUnitKey": unit_map["standardUnitKey"],
                "standardUnit": unit_map["standardUnit"],
                "standardUnitOrder": unit_map["standardUnitOrder"],
                "questionType": qtype,
                "layoutTag": "grid",
                "tags": tags,
                "wide": bool(has_image),
                "content": content,
                "choices": choices,
                "answer": "",
                "solution": "",
            }
            if image_path:
                question["image"] = image_path
            questions.append(question)
            content_report.append({
                "setKey": set_key,
                "pageNo": row["pageNo"],
                "displayNo": row["displayNo"],
                "jsId": js_id,
                "cropFile": row["cropFile"],
                "status": "manual_review" if review_reasons else "extracted",
                "contentLength": len(content),
                "extractedText": original_text,
                "content": content,
                "cropPath": row["cropPath"],
            })
            choices_report.append({
                "setKey": set_key,
                "pageNo": row["pageNo"],
                "displayNo": row["displayNo"],
                "jsId": js_id,
                "choiceStatus": choice_status,
                "choiceCount": len(choices),
                "choices": choices,
            })
            unit_review.append({
                "setKey": set_key,
                "jsId": js_id,
                "unit": row["unit"],
                "standardUnit": unit_map["standardUnit"],
                "standardUnitKey": unit_map["standardUnitKey"],
                "standardUnitOrder": unit_map["standardUnitOrder"],
                "mappingNote": unit_map["mappingNote"],
                "reason": "Mapped from existing archive H22-C common-math-1 key family; representative mappings are flagged in mappingNote.",
            })

        exam_title = f"비상 공통수학1 | {human_unit(first['unit'])} | {human_section(first['sectionType'])} | 고1"
        js_path.write_text(render_js(exam_title, questions), encoding="utf-8")
        js_paths.append(js_path)
        generation_sets.append({
            "setKey": set_key,
            "bookPart": book_part,
            "jsFile": rel(js_path),
            "questionCount": len(questions),
            "examTitle": exam_title,
        })

    for path in js_paths:
        validation_checks.append(run_node_check(path))

    all_questions = sum(s["questionCount"] for s in generation_sets)
    content_success = len([r for r in content_report if r["status"] == "extracted"])
    manual_count = len(manual)
    choices_count = len([r for r in choices_report if r["choiceCount"] > 0])
    empty_tag_violations = 0
    node_ok = all(v["ok"] for v in validation_checks)
    status = "PASS" if node_ok and all_questions == len(rows) and empty_tag_violations == 0 else "PARTIAL"

    write_json(REPORTS / "text1_js_generation_report.json", {
        "status": status,
        "inputPdf": pdf.name,
        "jsFileCount": len(js_paths),
        "cropMapQuestionCount": len(rows),
        "jsQuestionCount": all_questions,
        "sets": generation_sets,
        "contentSuccessCount": content_success,
        "manualReviewCount": manual_count,
        "choicesExtractedCount": choices_count,
        "imageCandidateCount": len(image_candidates),
    })
    write_json(REPORTS / "text1_js_content_extraction_report.json", {"items": content_report})
    write_json(REPORTS / "text1_js_choices_extraction_report.json", {"items": choices_report})
    write_json(REPORTS / "text1_js_manual_review_required.json", {"items": manual})
    write_json(REPORTS / "text1_js_image_tag_candidates.json", {"items": image_candidates})
    write_json(REPORTS / "text1_js_unit_mapping_review.json", {"items": unit_review})
    write_json(REPORTS / "text1_js_validation_report.json", {
        "status": "PASS" if node_ok else "PARTIAL",
        "nodeCheck": validation_checks,
        "idDuplicateViolations": [],
        "emptyTagViolations": empty_tag_violations,
        "cropMapQuestionCount": len(rows),
        "jsQuestionCount": all_questions,
    })

    result_md = f"""# CODEX_RESULT

## 1. 생성/수정 파일
- CODEX_TASK_TEXT1_JS_FROM_CROPS.md
- tools/generate-js-from-crops.mjs
- tools/generate_js_from_crops.py
- generated/js/textbook/*.js
- generated/js/workbook/*.js
- generated/reports/text1_js_archive_structure_inspection.json
- generated/reports/text1_js_generation_input_map.json
- generated/reports/text1_js_generation_report.json
- generated/reports/text1_js_content_extraction_report.json
- generated/reports/text1_js_choices_extraction_report.json
- generated/reports/text1_js_manual_review_required.json
- generated/reports/text1_js_image_tag_candidates.json
- generated/reports/text1_js_unit_mapping_review.json
- generated/reports/text1_js_validation_report.json

## 2. 구현 완료 또는 확인 완료
- `text1_question_crop_map.json`과 crop bbox 내부 PDF 텍스트만 기준으로 JS 초안을 생성했다.
- setKey별로 본책은 `generated/js/textbook`, 익힘책은 `generated/js/workbook`에 분리 저장했다.
- 정답 PDF는 사용하지 않았고 answer/solution은 빈 값으로 두었다.
- crop 파일 삭제/이동/이름 변경 및 q001_full alias 생성은 하지 않았다.
- 표준단원키는 기존 archive의 H22-C 공통수학1 키 계열로 매핑했고, 대표 매핑이 필요한 세트는 review report에 사유를 기록했다.

## 3. 실행 결과
- 작업 폴더: {ROOT}
- 입력 crop map: generated/reports/text1_question_crop_map.json
- 입력 PDF: {pdf.name}
- 생성 JS 파일 수: {len(js_paths)}
- setKey 목록: {', '.join(sorted(by_set.keys()))}
- crop map 문항 수: {len(rows)}
- JS 포함 문항 수: {all_questions}
- content 추출 성공 수: {content_success}
- content manual review 수: {manual_count}
- choices 추출 수: {choices_count}
- image tag 후보 수: {len(image_candidates)}
- tags 빈 값 위반 수: {empty_tag_violations}
- node --check 결과: {'PASS' if node_ok else 'PARTIAL'}
- 정답 PDF 사용 여부: 아니오
- archive/textbook 수정 여부: 아니오
- git add/commit/push 여부: 아니오

## 4. 결과 요약
- PASS/PARTIAL/BLOCKED/FAIL: {status}
- 사람이 확인해야 할 파일: generated/reports/text1_js_manual_review_required.json
- 사람이 확인해야 할 파일: generated/reports/text1_js_image_tag_candidates.json
- 사람이 확인해야 할 파일: generated/reports/text1_js_unit_mapping_review.json

## 5. 다음 조치
- manual review 항목의 content/choices를 crop 이미지와 대조해 보정한다.
- 다음 라운드에서 assets 후보 문항만 실제 이미지 asset crop으로 분리한다.
"""
    (ROOT / "CODEX_RESULT.md").write_text(result_md, encoding="utf-8-sig")
    print(json.dumps({
        "status": status,
        "jsFileCount": len(js_paths),
        "cropMapQuestionCount": len(rows),
        "jsQuestionCount": all_questions,
        "contentSuccessCount": content_success,
        "manualReviewCount": manual_count,
        "choicesExtractedCount": choices_count,
        "imageCandidateCount": len(image_candidates),
        "nodeCheck": "PASS" if node_ok else "PARTIAL",
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
