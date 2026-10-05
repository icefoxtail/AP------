import json
import os
import re
import shutil
import subprocess
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / "generated" / "reports"
JS_ROOTS = [ROOT / "generated" / "js" / "textbook", ROOT / "generated" / "js" / "workbook"]
MAP_PATH = REPORTS / "text1_question_crop_map.json"


ANSWER_PAGE_HINTS = {
    ("다항식", "중단원학습점검"): [142],
    ("나머지정리와인수분해", "중단원학습점검"): [144],
    ("복소수와이차방정식", "중단원학습점검"): [146],
    ("이차방정식과이차함수", "중단원학습점검"): [148],
    ("여러가지방정식과부등식", "중단원학습점검"): [149],
    ("경우의수", "중단원학습점검"): [153],
    ("행렬", "중단원학습점검"): [155],
    ("다항식", "대단원학습평가"): [144, 145],
    ("방정식과부등식", "대단원학습평가"): [150, 151],
    ("경우의수", "대단원학습평가"): [153, 154],
    ("행렬", "대단원학습평가"): [156],
    ("다항식", "익힘책"): [157],
    ("방정식과부등식", "익힘책"): [157, 158],
    ("경우의수", "익힘책"): [158, 159],
    ("행렬", "익힘책"): [159],
}

ANSWER_RANGE_LABELS = {
    ("다항식", "중단원학습점검"): "19~20쪽",
    ("나머지정리와인수분해", "중단원학습점검"): "31~32쪽",
    ("복소수와이차방정식", "중단원학습점검"): "53~54쪽",
    ("이차방정식과이차함수", "중단원학습점검"): "64~65쪽",
    ("여러가지방정식과부등식", "중단원학습점검"): "83~84쪽",
    ("경우의수", "중단원학습점검"): "105~106쪽",
    ("행렬", "중단원학습점검"): "125~126쪽",
    ("다항식", "대단원학습평가"): "34~36쪽",
    ("방정식과부등식", "대단원학습평가"): "86~88쪽",
    ("경우의수", "대단원학습평가"): "108~110쪽",
    ("행렬", "대단원학습평가"): "128~130쪽",
    ("다항식", "익힘책"): "134~135쪽",
    ("방정식과부등식", "익힘책"): "136~137쪽",
    ("경우의수", "익힘책"): "138~139쪽",
    ("행렬", "익힘책"): "140~141쪽",
}


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def run_cmd(args):
    try:
        p = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=30)
        return {"ok": p.returncode == 0, "stdout": p.stdout.strip(), "stderr": p.stderr.strip(), "returncode": p.returncode}
    except Exception as exc:
        return {"ok": False, "stdout": "", "stderr": str(exc), "returncode": None}


def tool_availability():
    tools = {
        "node": run_cmd(["node", "-v"]),
        "npm": run_cmd(["npm", "-v"]),
        "python": run_cmd(["python", "--version"]),
        "python3": run_cmd(["python3", "--version"]),
        "pip": run_cmd(["pip", "--version"]),
        "pip3": run_cmd(["pip3", "--version"]),
        "pdftoppm": run_cmd(["pdftoppm", "-v"]),
        "pdftotext": run_cmd(["pdftotext", "-v"]),
        "pdfinfo": run_cmd(["pdfinfo", "-v"]),
        "magick": run_cmd(["magick", "-version"]),
    }
    for mod in ["fitz", "PIL"]:
        tools[f"python_import_{mod}"] = run_cmd([sys.executable, "-c", f"import {mod}; print('ok')"])
    write_json(REPORTS / "text1_answer_tool_availability.json", tools)
    return tools


def find_pdf():
    pdfs = sorted(ROOT.glob("*.pdf"))
    answer_candidates = [p for p in pdfs if any(k in p.name.lower() for k in ["정답", "해설", "풀이", "answer"])]
    textbook_candidates = [p for p in pdfs if "공통수학1" in p.name and "교과서" in p.name]
    textbook = max(textbook_candidates or pdfs, key=lambda p: p.stat().st_size, default=None)
    chosen = answer_candidates[0] if answer_candidates else textbook
    report = {
        "pdfFiles": [{"file": p.name, "size": p.stat().st_size} for p in pdfs],
        "separateAnswerPdfFound": bool(answer_candidates),
        "selectedPdf": chosen.name if chosen else None,
        "selectedSourceType": "separate_answer_pdf" if answer_candidates else "textbook_back_answer_section",
        "note": "별도 정답 PDF를 찾지 못해 교과서 뒤쪽 정답과 해설 영역을 사용함." if not answer_candidates else "",
    }
    write_json(REPORTS / "text1_answer_pdf_detection_report.json", report)
    return chosen, report


def load_crop_map():
    if not MAP_PATH.exists():
        raise FileNotFoundError(str(MAP_PATH))
    data = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    return data["items"] if isinstance(data, dict) and "items" in data else data


def render_answer_pages(pdf_path, groups):
    import fitz
    from PIL import Image, ImageDraw, ImageFont

    doc = fitz.open(pdf_path)
    crop_map = []
    contact_index = []
    rendered_cache = {}
    for meta, items in groups.items():
        set_key, book_part, unit, section = meta
        pages = ANSWER_PAGE_HINTS.get((unit, section), [])
        out_dir = ROOT / "generated" / "work" / "answer_table_crops" / book_part / set_key
        out_dir.mkdir(parents=True, exist_ok=True)
        contact_dir = REPORTS / "answer_table_contact_sheets" / set_key
        contact_dir.mkdir(parents=True, exist_ok=True)
        sheet_images = []
        for page_no in pages:
            if page_no < 1 or page_no > doc.page_count:
                continue
            if page_no not in rendered_cache:
                page = doc[page_no - 1]
                pix = page.get_pixmap(matrix=fitz.Matrix(2.0, 2.0), alpha=False)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                rendered_cache[page_no] = img
            img = rendered_cache[page_no]
            file_name = f"{set_key}_answer_table_page{page_no}.png"
            out_path = out_dir / file_name
            img.save(out_path)
            rel = out_path.relative_to(ROOT).as_posix()
            crop_map.append({
                "setKey": set_key,
                "bookPart": book_part,
                "unit": unit,
                "sectionType": section,
                "answerPageNo": page_no,
                "answerTableCropFile": file_name,
                "answerTableCropPath": rel,
                "status": "crop_success",
            })
            thumb = img.copy()
            thumb.thumbnail((420, 560))
            sheet_images.append((thumb, f"{set_key}\npage {page_no}\n{section}\ncrop_success"))
        if sheet_images:
            cell_w, cell_h = 460, 640
            sheet = Image.new("RGB", (cell_w * min(2, len(sheet_images)), cell_h * ((len(sheet_images) + 1) // 2)), "white")
            draw = ImageDraw.Draw(sheet)
            for idx, (thumb, label) in enumerate(sheet_images):
                x = (idx % 2) * cell_w
                y = (idx // 2) * cell_h
                draw.text((x + 10, y + 10), label, fill=(0, 0, 0))
                sheet.paste(thumb, (x + 10, y + 80))
            sheet_path = contact_dir / "answer_table_sheet_001.png"
            sheet.save(sheet_path)
            contact_index.append({
                "setKey": set_key,
                "bookPart": book_part,
                "file": sheet_path.relative_to(ROOT).as_posix(),
                "pageCount": len(sheet_images),
                "status": "created",
            })
    write_json(REPORTS / "text1_answer_table_crop_map.json", crop_map)
    write_json(REPORTS / "text1_answer_table_contact_sheet_index.json", contact_index)
    return crop_map, contact_index


def page_texts(pdf_path, pages):
    import fitz
    doc = fitz.open(pdf_path)
    out = {}
    for p in sorted(set(pages)):
        if 1 <= p <= doc.page_count:
            out[p] = doc[p - 1].get_text()
    return out


def clean_text(s):
    s = re.sub(r"[\u2000-\u200f\u2028\u2029]", " ", s)
    s = s.replace("\x07", " ").replace("\x08", " ")
    s = s.replace("\r", " ").replace("\n", " ")
    s = re.sub(r"[ \t]+", " ", s)
    return s.strip()


def split_number_chunks(text):
    text = "\n" + text
    pat = re.compile(r"\n\s*(\d{1,2})\s+(?=\S)")
    matches = list(pat.finditer(text))
    chunks = defaultdict(list)
    for i, m in enumerate(matches):
        no = m.group(1).zfill(2)
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        chunk = clean_text(text[start:end])
        if chunk:
            chunks[no].append(chunk)
    return chunks


def split_number_chunks_with_positions(text):
    text = "\n" + text
    pat = re.compile(r"\n\s*(\d{1,2})\s+(?=\S)")
    matches = list(pat.finditer(text))
    chunks = []
    for i, m in enumerate(matches):
        no = m.group(1).zfill(2)
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        chunk = clean_text(text[start:end])
        if chunk:
            chunks.append({"no": no, "pos": m.start(), "chunk": chunk})
    return chunks


def section_near_chunks(text, unit, section, display_nos):
    display_set = set(display_nos)
    chunks = split_number_chunks_with_positions(text)
    label = ANSWER_RANGE_LABELS.get((unit, section), "")
    if not label or label not in text:
        grouped = defaultdict(list)
        for c in chunks:
            grouped[c["no"]].append(c["chunk"])
        return grouped
    marker = text.rfind(label)
    before = [c for c in chunks if c["pos"] < marker and c["no"] in display_set]
    after = [c for c in chunks if c["pos"] > marker and c["no"] in display_set]
    after_n = {c["no"] for c in after}
    before_n = {c["no"] for c in before}
    # Some answer pages expose the page-range title before the answers, while
    # others expose it as a footer after the answer block. Prefer the side that
    # contains a convincing share of target display numbers; otherwise use the
    # nearest candidates before the marker.
    if len(after_n) >= max(3, len(display_set) // 2):
        selected = after
        reverse = False
    else:
        selected = before
        reverse = True
    grouped = defaultdict(list)
    ordered = list(reversed(selected)) if reverse else selected
    for c in ordered:
        grouped[c["no"]].append(c["chunk"])
    return grouped


def first_line_candidate(chunk):
    raw = clean_text(chunk)
    raw = re.sub(r"^[:：.)\]]+", "", raw).strip()
    line = clean_text(re.split(r"\n", raw)[0])
    line = re.sub(r"\s{2,}", " ", line).strip()
    return line


def conclusion_candidate(chunk):
    raw = clean_text(chunk)
    patterns = [
        r"따라서\s+구하는\s+(?:값|수|개수|방법의 수|길이|범위|행렬의 모든 성분의 합|성분)은\s*([^\.。\n]+)",
        r"구하는\s+(?:값|수|개수|방법의 수|길이|범위|행렬의 모든 성분의 합|성분)은\s*([^\.。\n]+)",
        r"이므로\s+([①②③④⑤]|[-+]?[\d][^\.。\n]{0,30})",
        r"이므로\s+([^\.。\n]{1,35})이다",
    ]
    found = []
    for pat in patterns:
        for m in re.finditer(pat, raw):
            found.append(clean_text(m.group(1)))
    return found[-1] if found else ""


def answer_candidate(chunk):
    line = first_line_candidate(chunk)
    if not line:
        return "", 0.0, "empty"
    line = re.sub(r"\s*▶.*$", "", line).strip()
    raw = clean_text(chunk)
    contamination = r"(준비 학습|개념 탐구|스스로 확인하기|정답과 해설|수학 익힘책|중단원|대단원 학습 평가|수행 평가|[ⅠⅡⅢⅣ]\.?\s*[가-힣])"
    if re.search(contamination, raw):
        return "", 0.0, "section_heading_contamination"
    if raw.startswith("⑴"):
        raw = re.sub(r"\s*▶.*$", "", raw).strip()
        prose_markers = r"(이므로|따라서|에서|구하는|이고|일 때|경우|이때|문제의|연립방정식|부등식|함수|그래프|직선)"
        if len(raw) <= 180 and not re.search(prose_markers, raw) and not re.search(r"\s\d{2}\s", raw):
            return raw, 0.91, "sub_answers_full_chunk"
    if re.match(r"^[①②③④⑤](?:\s*[,，]\s*[①②③④⑤])*$", line):
        return line.replace(" ", ""), 0.98, "circled_choice"
    if re.match(r"^[OX○×]$", line):
        return line, 0.95, "ox"
    if re.match(r"^⑴\s*[^가-힣]{1,25}", line) and len(line) <= 80:
        return line, 0.84, "sub_answers_first_line"
    if len(line) <= 36 and not re.search(r"(이므로|따라서|에서|경우|꼴|방법|구하는|행렬|이차방정식|부등식|함수|직선|학생|회사)", line):
        return line, 0.82, "short_first_line"
    conc = conclusion_candidate(chunk)
    if conc and len(conc) <= 50 and not re.search(r"(때|하면|이고|이며|따라서|구하는|방법|경우)", conc):
        conc = conc.replace("이다", "").strip()
        return conc, 0.76, "conclusion_phrase"
    return "", 0.0, "not_confident_solution_mixed"


def extract_answers(pdf_path, groups, crop_map):
    all_pages = []
    for meta in groups:
        all_pages.extend(ANSWER_PAGE_HINTS.get((meta[2], meta[3]), []))
    texts = page_texts(pdf_path, all_pages)
    page_use_count = Counter(p for meta in groups for p in ANSWER_PAGE_HINTS.get((meta[2], meta[3]), []))
    extraction = []
    manual = []
    answers = {}
    crop_by_set_page = {(x["setKey"], x["answerPageNo"]): x for x in crop_map}

    for meta, items in groups.items():
        set_key, book_part, unit, section = meta
        pages = ANSWER_PAGE_HINTS.get((unit, section), [])
        display_nos = sorted({x["displayNo"] for x in items}, key=lambda v: int(re.sub(r"\D", "", v) or 0))
        combined = "\n".join(texts.get(p, "") for p in pages)
        chunks = section_near_chunks(combined, unit, section, display_nos)
        shared_pages = [p for p in pages if page_use_count[p] > 1]
        for display_no in display_nos:
            candidates = chunks.get(display_no, [])
            crop_file = next((crop_by_set_page[(set_key, p)]["answerTableCropFile"] for p in pages if (set_key, p) in crop_by_set_page), "")
            if not candidates:
                manual.append({
                    "setKey": set_key, "displayNo": display_no, "jsId": next((x["jsIdCandidate"] for x in items if x["displayNo"] == display_no), None),
                    "reason": "answer_number_not_found_in_answer_pages",
                    "answerCandidate": "", "rawAnswerText": "", "answerTableCropFile": crop_file,
                    "suggestedAction": "정답표 crop에서 해당 번호를 수동 확인",
                })
                continue
            best_answer, best_conf, best_reason, best_chunk = "", 0.0, "", ""
            for chunk in candidates:
                ans, conf, reason = answer_candidate(chunk)
                if conf > best_conf:
                    best_answer, best_conf, best_reason, best_chunk = ans, conf, reason, chunk
            if shared_pages and best_conf < 0.9:
                manual.append({
                    "setKey": set_key, "displayNo": display_no, "jsId": next((x["jsIdCandidate"] for x in items if x["displayNo"] == display_no), None),
                    "reason": "answer_page_shared_and_candidate_not_strong",
                    "answerCandidate": best_answer, "rawAnswerText": best_chunk[:500], "answerTableCropFile": crop_file,
                    "suggestedAction": "동일 정답 페이지에 여러 섹션이 있어 crop 원본으로 수동 매칭",
                })
                continue
            if best_conf >= 0.76:
                key = (set_key, display_no)
                answers[key] = best_answer
                extraction.append({
                    "setKey": set_key, "bookPart": book_part, "unit": unit, "sectionType": section,
                    "answerTableCropFile": crop_file,
                    "answerPageNo": pages,
                    "displayNo": display_no,
                    "extractedAnswer": best_answer,
                    "rawAnswerText": best_chunk[:800],
                    "confidence": round(best_conf, 3),
                    "note": best_reason + ("; shared answer page" if shared_pages else ""),
                })
            else:
                manual.append({
                    "setKey": set_key, "displayNo": display_no, "jsId": next((x["jsIdCandidate"] for x in items if x["displayNo"] == display_no), None),
                    "reason": best_reason,
                    "answerCandidate": best_answer, "rawAnswerText": best_chunk[:500], "answerTableCropFile": crop_file,
                    "suggestedAction": "해설 문장과 정답이 섞여 있어 수동 확인",
                })
    write_json(REPORTS / "text1_answer_extraction_report.json", extraction)
    write_json(REPORTS / "text1_answer_manual_review_required.json", manual)
    return answers, extraction, manual


def snapshot_js():
    return {p: p.read_text(encoding="utf-8") for root in JS_ROOTS for p in sorted(root.glob("*.js"))}


def mask_answers(text):
    return re.sub(r'answer:\s*"[^"]*"', 'answer: "__ANSWER_MASK__"', text)


def apply_answers(groups, answers):
    before = snapshot_js()
    apply_report = []
    setkey_to_file = {}
    for root in JS_ROOTS:
        for p in root.glob("*.js"):
            setkey_to_file[p.stem] = p

    entries_by_set = defaultdict(list)
    for meta, items in groups.items():
        for item in items:
            entries_by_set[meta[0]].append(item)

    for set_key, items in entries_by_set.items():
        js_file = setkey_to_file.get(set_key)
        if not js_file:
            continue
        text = js_file.read_text(encoding="utf-8")
        for item in sorted(items, key=lambda x: x["jsIdCandidate"]):
            ans = answers.get((set_key, item["displayNo"]))
            obj_pat = re.compile(r"(\{\s*id:\s*" + str(item["jsIdCandidate"]) + r",.*?answer:\s*\")([^\"]*)(\",)", re.S)
            m = obj_pat.search(text)
            if not m:
                continue
            prev = m.group(2)
            new_answer = "" if ans is None else ans.replace('"', '\\"')
            text = text[:m.start(2)] + new_answer + text[m.end(2):]
            if ans is not None:
                apply_report.append({
                    "jsFile": js_file.relative_to(ROOT).as_posix(),
                    "setKey": set_key,
                    "jsId": item["jsIdCandidate"],
                    "displayNo": item["displayNo"],
                    "previousAnswer": prev,
                    "newAnswer": ans,
                    "solutionUnchanged": True,
                    "matchMethod": "setKey_displayNo_jsId",
                    "confidence": 0.76,
                })
        js_file.write_text(text, encoding="utf-8")

    after = snapshot_js()
    forbidden_changes = []
    for path, old in before.items():
        new = after.get(path, "")
        if mask_answers(old) != mask_answers(new):
            forbidden_changes.append(path.relative_to(ROOT).as_posix())
    write_json(REPORTS / "text1_answer_apply_report.json", {
        "items": apply_report,
        "forbiddenFieldChangedFiles": forbidden_changes,
        "contentChoicesIdImageTagsStandardUnitUnchanged": len(forbidden_changes) == 0,
    })
    return apply_report, forbidden_changes, before, after


def validate_js():
    files = [p for root in JS_ROOTS for p in sorted(root.glob("*.js"))]
    checks = []
    for p in files:
        r = run_cmd(["node", "--check", str(p.relative_to(ROOT))])
        checks.append({"file": p.relative_to(ROOT).as_posix(), **r})
    answer_count = 0
    solution_nonempty = 0
    question_count = 0
    for p in files:
        text = p.read_text(encoding="utf-8")
        question_count += len(re.findall(r"\n\s*id:\s*\d+,", text))
        answer_count += len(re.findall(r'answer:\s*"(?!")', text))
        solution_nonempty += len(re.findall(r'solution:\s*"(?!")', text))
    return {
        "nodeCheckPass": all(x["ok"] for x in checks),
        "nodeCheck": checks,
        "jsFileCount": len(files),
        "questionCount": question_count,
        "answerFilledCount": answer_count,
        "solutionNonEmptyCount": solution_nonempty,
    }


def append_codex_result(summary, detection_report):
    result_path = ROOT / "CODEX_RESULT.md"
    reports = [
        "generated/reports/text1_answer_pdf_detection_report.json",
        "generated/reports/text1_answer_tool_availability.json",
        "generated/reports/text1_answer_table_crop_map.json",
        "generated/reports/text1_answer_extraction_report.json",
        "generated/reports/text1_answer_apply_report.json",
        "generated/reports/text1_answer_manual_review_required.json",
        "generated/reports/text1_answer_table_contact_sheet_index.json",
        "generated/reports/text1_answer_round_summary.json",
    ]
    block = f"""

## Round: text1 answer only from answer table crops

- 작업 범위: 중단원학습점검 / 대단원학습평가 / 익힘책 JS answer 필드만 보정
- 입력 정답 PDF 또는 정답표 영역: {detection_report.get('selectedSourceType')} / {detection_report.get('selectedPdf')}
- 기준 JS 문항 수: {summary['targetQuestionCount']}
- 대상 섹션: 중단원학습점검, 대단원학습평가, 익힘책
- 대상 문항 수: {summary['targetQuestionCount']}
- 정답표 crop 수: {summary['answerTableCropCount']}
- answer 추출 수: {summary['answerExtractionCount']}
- answer 적용 수: {summary['answerApplyCount']}
- answer 미확정 수: {summary['answerUnresolvedCount']}
- manual review 수: {summary['manualReviewCount']}
- solution unchanged: {summary['solutionUnchanged']}
- content/choices/id/image/tags unchanged: {summary['forbiddenFieldsUnchanged']}
- standardUnit fields unchanged: {summary['forbiddenFieldsUnchanged']}
- node --check 결과: {summary['nodeCheckPass']}
- 생성/갱신 reports: {', '.join(reports)}
- archive/textbook 수정 여부: false
- git add/commit/push 여부: false
- 최종 판정: {summary['status']}
"""
    with result_path.open("a", encoding="utf-8") as f:
        f.write(block)


def main():
    REPORTS.mkdir(parents=True, exist_ok=True)
    tools = tool_availability()
    if not MAP_PATH.exists():
        summary = {"status": "BLOCKED", "reason": "missing text1_question_crop_map.json"}
        write_json(REPORTS / "text1_answer_round_summary.json", summary)
        return 2
    pdf_path, detection = find_pdf()
    if not pdf_path:
        summary = {"status": "BLOCKED", "reason": "missing pdf"}
        write_json(REPORTS / "text1_answer_round_summary.json", summary)
        return 2
    items = load_crop_map()
    groups = defaultdict(list)
    for item in items:
        if item.get("sectionType") in {"중단원학습점검", "대단원학습평가", "익힘책"}:
            groups[(item["setKey"], item["bookPart"], item["unit"], item["sectionType"])].append(item)
    crop_map, contact_index = render_answer_pages(pdf_path, groups)
    answers, extraction, manual = extract_answers(pdf_path, groups, crop_map)
    apply_report, forbidden_changes, before, after = apply_answers(groups, answers)
    validation = validate_js()
    solution_unchanged = validation["solutionNonEmptyCount"] == 0
    status = "PASS" if len(apply_report) == len(items) and not manual and validation["nodeCheckPass"] and not forbidden_changes and solution_unchanged else "PARTIAL"
    if not extraction and manual:
        status = "BLOCKED"
    summary = {
        "status": status,
        "workFolder": str(ROOT),
        "selectedPdf": pdf_path.name,
        "targetSetCount": len(groups),
        "targetQuestionCount": len(items),
        "answerTableCropCount": len(crop_map),
        "contactSheetCount": len(contact_index),
        "answerExtractionCount": len(extraction),
        "answerApplyCount": len(apply_report),
        "answerUnresolvedCount": len(items) - len(apply_report),
        "manualReviewCount": len(manual),
        "solutionUnchanged": solution_unchanged,
        "forbiddenFieldsUnchanged": len(forbidden_changes) == 0,
        "forbiddenFieldChangedFiles": forbidden_changes,
        "nodeCheckPass": validation["nodeCheckPass"],
        "validation": validation,
        "toolAvailabilityReport": "generated/reports/text1_answer_tool_availability.json",
        "note": "정답과 해설 영역이 빠른 정답표가 아닌 혼합 구조라 확실한 번호-정답 후보만 answer에 적용함.",
    }
    write_json(REPORTS / "text1_answer_round_summary.json", summary)
    append_codex_result(summary, detection)
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0 if validation["nodeCheckPass"] and not forbidden_changes and solution_unchanged else 1


if __name__ == "__main__":
    raise SystemExit(main())
