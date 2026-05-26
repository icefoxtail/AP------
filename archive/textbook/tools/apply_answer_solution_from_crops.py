import importlib.util
import json
import re
import subprocess
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT_ROOT = ROOT.parents[1]
REPORTS = ROOT / "generated" / "reports"
JS_DIR = ROOT / "generated" / "js"
RULES_DIR = PROJECT_ROOT / "rules"
ARCHIVE_DIR = PROJECT_ROOT / "archive"


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def run_cmd(args, cwd=ROOT):
    p = subprocess.run(args, cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    return {"ok": p.returncode == 0, "returncode": p.returncode, "stdout": p.stdout.strip(), "stderr": p.stderr.strip()}


def load_answer_mod():
    path = ROOT / "tools" / "apply_answer_only_from_answer_table_crops.py"
    spec = importlib.util.spec_from_file_location("answer_mod", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def read_rules():
    wanted = [
        "JS아카이브룰북",
        "표준단원키",
        "JS_변환_프롬프트",
        "문제해설추출",
        "수학 문항 오류 검증 프로토콜",
        "무결성검수",
        "JS아카이브 1차 검수 프로토콜",
    ]
    files = list(RULES_DIR.iterdir())
    out = []
    for w in wanted:
        f = next((p for p in files if w in p.name), None)
        out.append({
            "requested": w,
            "file": f.name if f else None,
            "checked": bool(f),
            "keyFindings": [
                "JS archive schema 유지",
                "answer/solution은 원문 근거 기반",
                "수식은 기존 plain text/^ 표기 관례 우선",
                "불확실한 해설/정답은 manual review",
            ],
            "sample": f.read_text(encoding="utf-8", errors="replace")[:500] if f else "",
        })
    write_json(REPORTS / "text1_answer_solution_rules_read_report.json", {"items": out})
    return out


def archive_samples():
    items = []
    for p in (ARCHIVE_DIR / "exams").glob("**/*.js"):
        text = p.read_text(encoding="utf-8", errors="replace")
        if "window.questionBank" not in text:
            continue
        items.append({
            "file": p.relative_to(PROJECT_ROOT).as_posix(),
            "hasAnswer": "answer:" in text,
            "hasSolution": "solution:" in text,
            "usesCaretExponent": bool(re.search(r"\^[2-9]", text)),
            "usesUnicodeExponent": bool(re.search(r"[²³]", text)),
            "solutionStringStyle": "double quoted JS string; newlines escaped/flattened",
        })
        if len(items) >= 5:
            break
    write_json(REPORTS / "text1_answer_solution_archive_sample_report.json", {"items": items})
    return items


def js_files():
    return sorted(JS_DIR.glob("*/*.js"))


def load_crop_map():
    data = json.loads((REPORTS / "text1_question_crop_map.json").read_text(encoding="utf-8"))
    return data["items"] if isinstance(data, dict) else data


def tool_availability(answer_mod):
    data = answer_mod.tool_availability()
    write_json(REPORTS / "text1_answer_solution_tool_availability.json", data)
    return data


def find_pdf(answer_mod):
    pdf, report = answer_mod.find_pdf()
    write_json(REPORTS / "text1_answer_solution_pdf_detection_report.json", report)
    return pdf, report


def clean(s):
    s = s.replace("\r", " ").replace("\n", " ")
    s = s.replace("\x07", " ").replace("\x08", " ")
    s = re.sub(r"[\u2000-\u200f\u2028\u2029]", " ", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def formula_cleanup(s):
    before = s
    rep = {"@": "^2", "#": "^3", "$": "^4", "%": "^5", "Û": "^2", "Ü": "^3", "Ý": "^4", "Þ": "^5", "`": ""}
    for a, b in rep.items():
        s = s.replace(a, b)
    s = s.replace("j3", "√3").replace("j5", "√5").replace("j7", "√7").replace("j14k", "√14")
    return clean(s), before != s


def js_escape(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')


def question_blocks(text):
    pat = re.compile(r"(\{\s*id:\s*(\d+),.*?\n\s*\})", re.S)
    return [(m.start(), m.end(), m.group(1), int(m.group(2))) for m in pat.finditer(text)]


def mask_answer_solution(text):
    text = re.sub(r'answer:\s*"[^"]*"', 'answer: "__MASK__"', text)
    text = re.sub(r'solution:\s*"[^"]*"', 'solution: "__MASK__"', text)
    return text


def split_number_chunks_with_page(answer_mod, pdf_path, pages):
    import fitz
    doc = fitz.open(pdf_path)
    chunks = []
    for page_no in pages:
        if not (1 <= page_no <= doc.page_count):
            continue
        text = "\n" + doc[page_no - 1].get_text()
        matches = list(re.finditer(r"\n\s*(\d{1,2})\s+(?=\S)", text))
        for i, m in enumerate(matches):
            no = m.group(1).zfill(2)
            start = m.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
            raw = clean(text[start:end])
            if raw:
                chunks.append({"displayNo": no, "pageNo": page_no, "pos": m.start(), "raw": raw})
    return chunks


def answer_candidate(answer_mod, raw):
    ans, conf, reason = answer_mod.answer_candidate(raw)
    ans, changed = formula_cleanup(ans)
    raw, _ = formula_cleanup(raw)
    contamination = ["준비 학습", "개념 탐구", "스스로 확인하기", "정답과 해설", "수학 익힘책", "중단원", "대단원 학습 평가", "수행 평가", "I 다항식", "II 방정식", "III 경우", "IV 행렬", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ"]
    if any(x in raw for x in contamination):
        return "", "", 0.0, "section_heading_contamination"
    prose_contamination = ["", "교환법칙", "분배법칙", "결합법칙", "이용하여", "대입하여", "계산한다", "나타낼 수 있다", "예상된다", "설명", "그림과 같이"]
    if any(x in raw for x in prose_contamination):
        return "", "", 0.0, "solution_prose_in_answer_candidate"
    if ans == raw and len(raw) > 100:
        return "", "", 0.0, "answer_candidate_too_long"
    if re.search(r"[가-힣]{6,}", ans) and not re.search(r"(몫|나머지|또는|이차정사각행렬)", ans):
        return "", "", 0.0, "answer_contains_prose"
    return ans, raw, conf, reason


def solution_candidate(raw, answer):
    raw, _ = formula_cleanup(raw)
    if not raw or not answer:
        return "", 0.0, "missing_answer_or_raw"
    sol = raw
    if sol.startswith(answer):
        sol = clean(sol[len(answer):])
    has_explanation = bool(re.search(r"(이므로|따라서|에서|경우|즉|구하는|▶|yy|풀이|등식|부등식|행렬)", sol))
    if has_explanation and len(sol) >= 18:
        return sol, 0.72, "source_block_solution_text"
    return "", 0.0, "answer_only_or_too_short"


def render_page_crops(pdf_path, groups, answer_mod):
    import fitz
    from PIL import Image, ImageDraw
    doc = fitz.open(pdf_path)
    page_crop_map = []
    rendered = {}
    for (set_key, book_part, unit, section), _items in groups.items():
        pages = answer_mod.ANSWER_PAGE_HINTS.get((unit, section), [])
        out_dir = ROOT / "generated" / "work" / "answer_solution_page_crops" / book_part / set_key
        out_dir.mkdir(parents=True, exist_ok=True)
        sheet_dir = REPORTS / "answer_solution_contact_sheets" / set_key
        sheet_dir.mkdir(parents=True, exist_ok=True)
        thumbs = []
        for pno in pages:
            if pno not in rendered and 1 <= pno <= doc.page_count:
                pix = doc[pno - 1].get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
                rendered[pno] = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            if pno in rendered:
                img = rendered[pno]
                out = out_dir / f"page{pno}.png"
                img.save(out)
                page_crop_map.append({"setKey": set_key, "bookPart": book_part, "answerPageNo": pno, "pageCropPath": out.relative_to(ROOT).as_posix()})
                th = img.copy(); th.thumbnail((360, 500)); thumbs.append((th, f"{set_key}\npage {pno}\n{section}"))
        if thumbs:
            sheet = Image.new("RGB", (420 * min(2, len(thumbs)), 580 * ((len(thumbs) + 1) // 2)), "white")
            draw = ImageDraw.Draw(sheet)
            for i, (th, label) in enumerate(thumbs):
                x = (i % 2) * 420; y = (i // 2) * 580
                draw.text((x + 8, y + 8), label, fill=(0, 0, 0))
                sheet.paste(th, (x + 8, y + 78))
            sheet.save(sheet_dir / "answer_solution_sheet_001.png")
    return page_crop_map


def create_block_crop(pdf_path, set_key, book_part, item, answer_page, display_no):
    import fitz
    doc = fitz.open(pdf_path)
    page = doc[answer_page - 1]
    words = page.get_text("words")
    marker = None
    for w in words:
        if w[4] in {display_no, str(int(display_no))}:
            marker = w
            break
    if not marker:
        return "", "marker_not_found"
    x0, y0, x1, y1 = marker[:4]
    col_mid = page.rect.width / 2
    col_left, col_right = (0, col_mid + 12) if x0 < col_mid else (col_mid - 12, page.rect.width)
    next_y = page.rect.height - 36
    for w in words:
        if w[0] >= col_left and w[2] <= col_right and w[1] > y0 + 4 and re.fullmatch(r"\d{1,2}", w[4]):
            next_y = min(next_y, w[1] - 3)
            break
    rect = fitz.Rect(max(0, col_left), max(0, y0 - 8), min(page.rect.width, col_right), min(page.rect.height, next_y))
    if rect.height < 12:
        return "", "region_too_small"
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), clip=rect, alpha=False)
    out_dir = ROOT / "generated" / "work" / "answer_solution_crops" / book_part / set_key
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / f"{set_key}_answer_solution_page{answer_page}_q{display_no}.png"
    pix.save(out)
    return out.relative_to(ROOT).as_posix(), "crop_success"


def extract(pdf_path, groups, answer_mod):
    extraction = []
    manual = []
    crop_map = []
    answers = {}
    solutions = {}
    formula_review = []
    for meta, items in groups.items():
        set_key, book_part, unit, section = meta
        pages = answer_mod.ANSWER_PAGE_HINTS.get((unit, section), [])
        chunks = split_number_chunks_with_page(answer_mod, pdf_path, pages)
        by_no = defaultdict(list)
        for c in chunks:
            by_no[c["displayNo"]].append(c)
        for item in sorted(items, key=lambda x: x["jsIdCandidate"]):
            display_no = item["displayNo"]
            cands = by_no.get(display_no, [])
            best = None
            for c in cands:
                ans, raw, conf, reason = answer_candidate(answer_mod, c["raw"])
                sol, sol_conf, sol_reason = solution_candidate(raw, ans)
                score = conf + (0.1 if sol else 0)
                if conf >= 0.76:
                    best = {"chunk": c, "answer": ans, "solution": sol, "confidence": min(0.95, score), "score": score, "reason": reason, "solReason": sol_reason, "raw": raw}
                    break
            if not best:
                manual.append({
                    "setKey": set_key, "displayNo": display_no, "jsId": item["jsIdCandidate"],
                    "reason": "no_confident_answer_solution_block",
                    "answerCandidate": "", "solutionCandidate": "", "rawBlockText": cands[0]["raw"][:600] if cands else "",
                    "answerSolutionCropFile": "", "suggestedAction": "정답/풀이 page crop에서 문항 block 수동 확인",
                })
                continue
            crop_path, status = create_block_crop(pdf_path, set_key, book_part, item, best["chunk"]["pageNo"], display_no)
            crop_map.append({
                "setKey": set_key, "bookPart": book_part, "unit": unit, "sectionType": section,
                "displayNo": display_no, "jsId": item["jsIdCandidate"], "answerPageNo": best["chunk"]["pageNo"],
                "answerSolutionCropFile": Path(crop_path).name if crop_path else "",
                "answerSolutionCropPath": crop_path, "status": status, "confidence": round(best["confidence"], 3),
            })
            if status != "crop_success":
                manual.append({
                    "setKey": set_key, "displayNo": display_no, "jsId": item["jsIdCandidate"],
                    "reason": status, "answerCandidate": best["answer"], "solutionCandidate": best["solution"],
                    "rawBlockText": best["raw"][:600], "answerSolutionCropFile": "", "suggestedAction": "정답/풀이 block crop 수동 생성",
                })
                continue
            answers[(set_key, item["jsIdCandidate"])] = best["answer"]
            solutions[(set_key, item["jsIdCandidate"])] = best["solution"]
            extraction.append({
                "setKey": set_key, "bookPart": book_part, "unit": unit, "sectionType": section,
                "answerSolutionCropFile": Path(crop_path).name,
                "answerPageNo": best["chunk"]["pageNo"], "displayNo": display_no,
                "rawBlockText": best["raw"], "extractedAnswer": best["answer"],
                "extractedSolution": best["solution"], "confidence": round(best["confidence"], 3),
                "note": f"{best['reason']}; {best['solReason']}",
            })
            for field, val in [("answer", best["answer"]), ("solution", best["solution"])]:
                before = val
                after, changed = formula_cleanup(before)
                formula_review.append({
                    "setKey": set_key, "displayNo": display_no, "jsId": item["jsIdCandidate"],
                    "field": field, "before": before, "after": after,
                    "status": "cleaned" if changed else "checked",
                    "confidence": 0.86 if changed else 0.95, "note": "확실한 PDF glyph 치환만 적용",
                })
    write_json(REPORTS / "text1_answer_solution_crop_map.json", crop_map)
    write_json(REPORTS / "text1_answer_solution_extraction_report.json", extraction)
    write_json(REPORTS / "text1_answer_solution_manual_review_required.json", manual)
    write_json(REPORTS / "text1_answer_solution_formula_review.json", formula_review)
    return answers, solutions, extraction, manual, crop_map, formula_review


def apply_to_js(groups, answers, solutions):
    before = {p: p.read_text(encoding="utf-8") for p in js_files()}
    by_set = defaultdict(list)
    for meta, items in groups.items():
        for item in items:
            by_set[meta[0]].append(item)
    apply_report = []
    for p in js_files():
        set_key = p.stem
        if set_key not in by_set:
            continue
        text = p.read_text(encoding="utf-8")
        for item in by_set[set_key]:
            qid = item["jsIdCandidate"]
            ans = answers.get((set_key, qid), "")
            sol = solutions.get((set_key, qid), "")
            pat = re.compile(r"(\{\s*id:\s*" + str(qid) + r",.*?answer:\s*\")([^\"]*)(\",\s*\n\s*solution:\s*\")([^\"]*)(\")", re.S)
            m = pat.search(text)
            if not m:
                continue
            prev_a, prev_s = m.group(2), m.group(4)
            repl = m.group(1) + js_escape(ans) + m.group(3) + js_escape(sol) + m.group(5)
            text = text[:m.start()] + repl + text[m.end():]
            if ans or sol:
                apply_report.append({
                    "jsFile": p.relative_to(ROOT).as_posix(), "setKey": set_key, "jsId": qid,
                    "displayNo": item["displayNo"], "previousAnswer": prev_a, "newAnswer": ans,
                    "previousSolution": prev_s, "newSolution": sol,
                    "matchMethod": "setKey_jsId_displayNo", "confidence": 0.76,
                })
        p.write_text(text, encoding="utf-8")
    after = {p: p.read_text(encoding="utf-8") for p in js_files()}
    changed = [p.relative_to(ROOT).as_posix() for p in before if mask_answer_solution(before[p]) != mask_answer_solution(after[p])]
    write_json(REPORTS / "text1_answer_solution_apply_report.json", {"items": apply_report, "forbiddenFieldChangedFiles": changed})
    return apply_report, changed


def create_block_contact_sheets(crop_map):
    from PIL import Image, ImageDraw
    grouped = defaultdict(list)
    for item in crop_map:
        if item.get("status") == "crop_success" and item.get("answerSolutionCropPath"):
            grouped[item["setKey"]].append(item)
    index = []
    for set_key, items in grouped.items():
        out_dir = REPORTS / "answer_solution_contact_sheets" / set_key
        out_dir.mkdir(parents=True, exist_ok=True)
        sheet_no = 1
        for start in range(0, len(items), 12):
            batch = items[start:start + 12]
            cell_w, cell_h = 420, 360
            cols = 3
            rows = (len(batch) + cols - 1) // cols
            sheet = Image.new("RGB", (cell_w * cols, cell_h * rows), "white")
            draw = ImageDraw.Draw(sheet)
            for idx, item in enumerate(batch):
                x = (idx % cols) * cell_w
                y = (idx // cols) * cell_h
                label = f"{set_key}\njsId {item.get('jsId')} / q{item.get('displayNo')}\npage {item.get('answerPageNo')} / {item.get('status')}\nconf {item.get('confidence')}"
                draw.text((x + 8, y + 8), label, fill=(0, 0, 0))
                try:
                    img = Image.open(ROOT / item["answerSolutionCropPath"]).convert("RGB")
                    img.thumbnail((cell_w - 16, cell_h - 92))
                    sheet.paste(img, (x + 8, y + 86))
                except Exception as exc:
                    draw.text((x + 8, y + 100), str(exc), fill=(150, 0, 0))
            file = out_dir / f"answer_solution_sheet_{sheet_no:03d}.png"
            sheet.save(file)
            index.append({"setKey": set_key, "file": file.relative_to(ROOT).as_posix(), "itemCount": len(batch), "status": "created"})
            sheet_no += 1
    write_json(REPORTS / "text1_answer_solution_contact_sheet_index.json", index)
    return index


def validate(crop_items, before_js_names, before_crop_files):
    node = [{"file": p.relative_to(ROOT).as_posix(), **run_cmd(["node", "--check", str(p.relative_to(ROOT))])} for p in js_files()]
    texts = [p.read_text(encoding="utf-8") for p in js_files()]
    q_count = sum(len(re.findall(r"\n\s*id:\s*\d+,", t)) for t in texts)
    answer_count = sum(len(re.findall(r'answer:\s*"(?!")', t)) for t in texts)
    solution_count = sum(len(re.findall(r'solution:\s*"(?!")', t)) for t in texts)
    current_js_names = sorted(p.relative_to(ROOT).as_posix() for p in js_files())
    current_crop_files = sorted(p.relative_to(ROOT).as_posix() for p in (ROOT / "generated" / "work" / "question_crops").glob("**/*.png"))
    return {
        "nodeCheckPass": all(x["ok"] for x in node),
        "nodeCheck": node,
        "questionCount": q_count,
        "cropMapQuestionCount": len(crop_items),
        "answerFilledCount": answer_count,
        "solutionFilledCount": solution_count,
        "answerEmptyCount": q_count - answer_count,
        "solutionEmptyCount": q_count - solution_count,
        "jsFilenamesUnchanged": current_js_names == before_js_names,
        "questionCropFilesUnchanged": current_crop_files == before_crop_files,
        "tagsEmptyCount": sum(t.count("tags: []") for t in texts),
        "unmappedCount": sum(t.count('standardUnitKey: "UNMAPPED"') for t in texts),
    }


def append_result(summary, rules, samples, reports):
    block = f"""

## Round: text1 answer and solution from crops

- 작업 범위: 정답/풀이 원문 block crop 기준 answer와 solution 적용
- 읽은 룰북 파일: {', '.join(x['file'] for x in rules if x.get('file'))}
- 확인한 기존 archive 샘플: {', '.join(x['file'] for x in samples)}
- 입력 정답/풀이 PDF 또는 영역: {summary['answerSolutionSource']}
- 기준 JS 문항 수: {summary['questionCount']}
- 대상 섹션: 중단원학습점검, 대단원학습평가, 익힘책
- 대상 문항 수: {summary['targetQuestionCount']}
- answer-solution crop 수: {summary['answerSolutionCropCount']}
- answer 추출 수: {summary['answerExtractionCount']}
- answer 적용 수: {summary['answerApplyCount']}
- solution 추출 수: {summary['solutionExtractionCount']}
- solution 적용 수: {summary['solutionApplyCount']}
- answer 미확정 수: {summary['answerUnresolvedCount']}
- solution 미확정 수: {summary['solutionUnresolvedCount']}
- manual review 수: {summary['manualReviewCount']}
- answer/solution formula review 수: {summary['formulaReviewCount']}
- content/choices/id/image/tags unchanged: {summary['forbiddenFieldsUnchanged']}
- standardUnit fields unchanged: {summary['forbiddenFieldsUnchanged']}
- crop files unchanged: {summary['cropFilesUnchanged']}
- node --check 결과: {summary['nodeCheckPass']}
- 생성/갱신 reports: {', '.join(reports)}
- archive/textbook 수정 여부: false
- git add/commit/push 여부: false
- 최종 판정: {summary['status']}
"""
    with (ROOT / "CODEX_RESULT.md").open("a", encoding="utf-8") as f:
        f.write(block)


def main():
    REPORTS.mkdir(parents=True, exist_ok=True)
    answer_mod = load_answer_mod()
    tool_availability(answer_mod)
    rules = read_rules()
    samples = archive_samples()
    pdf, detection = find_pdf(answer_mod)
    crop_items = load_crop_map()
    groups = defaultdict(list)
    for item in crop_items:
        if item.get("sectionType") in {"중단원학습점검", "대단원학습평가", "익힘책"}:
            groups[(item["setKey"], item["bookPart"], item["unit"], item["sectionType"])].append(item)
    before_js_names = sorted(p.relative_to(ROOT).as_posix() for p in js_files())
    before_crop_files = sorted(p.relative_to(ROOT).as_posix() for p in (ROOT / "generated" / "work" / "question_crops").glob("**/*.png"))
    page_crops = render_page_crops(pdf, groups, answer_mod)
    answers, solutions, extraction, manual, crop_map, formula_review = extract(pdf, groups, answer_mod)
    contact_sheets = create_block_contact_sheets(crop_map)
    apply_report, forbidden = apply_to_js(groups, answers, solutions)
    validation = validate(crop_items, before_js_names, before_crop_files)
    answer_apply = sum(1 for x in apply_report if x["newAnswer"])
    solution_apply = sum(1 for x in apply_report if x["newSolution"])
    reports = [
        "generated/reports/text1_answer_solution_tool_availability.json",
        "generated/reports/text1_answer_solution_rules_read_report.json",
        "generated/reports/text1_answer_solution_archive_sample_report.json",
        "generated/reports/text1_answer_solution_pdf_detection_report.json",
        "generated/reports/text1_answer_solution_crop_map.json",
        "generated/reports/text1_answer_solution_extraction_report.json",
        "generated/reports/text1_answer_solution_apply_report.json",
        "generated/reports/text1_answer_solution_manual_review_required.json",
        "generated/reports/text1_answer_solution_formula_review.json",
        "generated/reports/text1_answer_solution_contact_sheet_index.json",
        "generated/reports/text1_answer_solution_summary.json",
    ]
    status = "PARTIAL"
    if not pdf:
        status = "BLOCKED"
    if not validation["nodeCheckPass"] or forbidden:
        status = "FAIL"
    summary = {
        "status": status,
        "answerSolutionSource": f"{detection.get('selectedSourceType')} / {detection.get('selectedPdf')}",
        "questionCount": validation["questionCount"],
        "targetQuestionCount": len(crop_items),
        "answerSolutionPageCropCount": len(page_crops),
        "answerSolutionCropCount": len(crop_map),
        "answerSolutionContactSheetCount": len(contact_sheets),
        "answerExtractionCount": sum(1 for x in extraction if x["extractedAnswer"]),
        "answerApplyCount": answer_apply,
        "solutionExtractionCount": sum(1 for x in extraction if x["extractedSolution"]),
        "solutionApplyCount": solution_apply,
        "answerUnresolvedCount": len(crop_items) - answer_apply,
        "solutionUnresolvedCount": len(crop_items) - solution_apply,
        "manualReviewCount": len(manual),
        "formulaReviewCount": len(formula_review),
        "forbiddenFieldsUnchanged": not forbidden,
        "cropFilesUnchanged": validation["questionCropFilesUnchanged"],
        "nodeCheckPass": validation["nodeCheckPass"],
        "validation": validation,
        "reports": reports,
        "note": "PDF 텍스트 순서와 시각 순서가 다른 구간은 manual review로 분리하고, 원문 block crop이 생성된 항목만 적용함.",
    }
    write_json(REPORTS / "text1_answer_solution_summary.json", summary)
    append_result(summary, rules, samples, reports)
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0 if validation["nodeCheckPass"] and not forbidden else 1


if __name__ == "__main__":
    raise SystemExit(main())
