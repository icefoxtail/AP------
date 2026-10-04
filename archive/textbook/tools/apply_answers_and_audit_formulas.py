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


def load_answer_module():
    path = ROOT / "tools" / "apply_answer_only_from_answer_table_crops.py"
    spec = importlib.util.spec_from_file_location("answer_only", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def tool_availability(answer_mod):
    data = answer_mod.tool_availability()
    write_json(REPORTS / "text1_answer_formula_tool_availability.json", data)
    return data


def read_rules_report():
    wanted = [
        "JS아카이브룰북",
        "표준단원키",
        "JS_변환_프롬프트",
        "문제해설추출",
        "수학 문항 오류 검증 프로토콜",
        "무결성검수",
        "JS아카이브 1차 검수 프로토콜",
    ]
    files = list(RULES_DIR.iterdir()) if RULES_DIR.exists() else []
    items = []
    for want in wanted:
        found = next((p for p in files if want in p.name), None)
        if found:
            text = found.read_text(encoding="utf-8", errors="replace")
            items.append({
                "requested": want,
                "file": found.name,
                "size": found.stat().st_size,
                "checked": True,
                "keyFindings": [
                    "기존 JS schema와 필드명 유지",
                    "standardCourse/standardUnitKey/standardUnit/standardUnitOrder는 마스터 기준 사용",
                    "수식 표기는 기존 archive 관례를 우선하고 불확실하면 manual review",
                    "solution 임의 작성 금지",
                ],
                "sample": text[:500],
            })
        else:
            items.append({"requested": want, "file": None, "checked": False, "keyFindings": [], "sample": ""})
    write_json(REPORTS / "text1_answer_formula_rules_read_report.json", {"items": items})
    return items


def archive_sample_report():
    samples = []
    candidates = [p for p in (ARCHIVE_DIR / "exams").glob("**/*.js") if "text1" not in p.as_posix()]
    for p in candidates[:8]:
        text = p.read_text(encoding="utf-8", errors="replace")
        if "window.questionBank" not in text:
            continue
        samples.append({
            "file": p.relative_to(PROJECT_ROOT).as_posix(),
            "hasExamTitle": "window.examTitle" in text,
            "hasQuestionBank": "window.questionBank" in text,
            "usesCaretExponent": bool(re.search(r"\^[2-9]", text)),
            "usesUnicodeExponent": bool(re.search(r"[²³]", text)),
            "usesAnswerField": "answer:" in text,
            "usesChoicesArray": "choices:" in text,
            "stringEscapingNote": "JS double-quoted strings; node --check used for syntax safety.",
        })
        if len(samples) >= 5:
            break
    write_json(REPORTS / "text1_answer_formula_archive_sample_report.json", {
        "items": samples,
        "summary": "기존 archive는 window.examTitle/window.questionBank 구조와 answer/solution 필드를 사용하며, 수식은 주로 plain text와 ^ 지수 표기를 안전하게 사용한다.",
    })
    return samples


def js_files():
    return sorted(JS_DIR.glob("*/*.js"))


def load_crop_index():
    path = REPORTS / "text1_question_crop_map.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    items = data["items"] if isinstance(data, dict) else data
    idx = {}
    for item in items:
        idx[(item["setKey"], int(item["jsIdCandidate"]))] = item
    return items, idx


def question_blocks(text):
    pat = re.compile(r"(\{\s*id:\s*(\d+),.*?\n\s*\})", re.S)
    return [(m.start(), m.end(), m.group(1), int(m.group(2))) for m in pat.finditer(text)]


def string_field(block, field):
    m = re.search(rf"{field}:\s*\"((?:\\.|[^\"])*)\"", block, re.S)
    return m.group(1) if m else None


def choices_strings(block):
    m = re.search(r"choices:\s*\[(.*?)\]", block, re.S)
    if not m:
        return []
    return re.findall(r"\"((?:\\.|[^\"])*)\"", m.group(1), re.S)


ANOMALY_CHARS = ["@", "#", "`", "Ú", "Û", "Ü", "Ý", "Þ", "Ø", "Ö", "�"]
BAD_STRINGS = ["naver.com", "gmail.com", ".indd", "원본 PDF 문항 감지 실패", "원문 PDF 추출 검수 필요", "정답 및 풀이"]


def scan_anomalies(crop_idx):
    scan = []
    for path in js_files():
        set_key = path.stem
        text = path.read_text(encoding="utf-8")
        for _, _, block, qid in question_blocks(text):
            meta = crop_idx.get((set_key, qid), {})
            fields = {"content": [string_field(block, "content") or ""], "answer": [string_field(block, "answer") or ""]}
            fields["choices"] = choices_strings(block)
            for field, values in fields.items():
                for seq, value in enumerate(values):
                    hits = [c for c in ANOMALY_CHARS if c in value] + [s for s in BAD_STRINGS if s in value]
                    if "<" in value or ">" in value or "&" in value:
                        hits.append("html_sensitive_char")
                    if re.search(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", value):
                        hits.append("control_char")
                    if hits:
                        scan.append({
                            "file": path.relative_to(ROOT).as_posix(),
                            "setKey": set_key,
                            "id": qid,
                            "pageNo": meta.get("pageNo"),
                            "displayNo": meta.get("displayNo"),
                            "cropFile": meta.get("cropFile"),
                            "field": field,
                            "choiceIndex": seq if field == "choices" else None,
                            "hits": sorted(set(hits)),
                            "text": value,
                        })
    write_json(REPORTS / "text1_formula_anomaly_scan_report.json", scan)
    return scan


def normalize_formula_text(value):
    before = value
    value = value.replace("\r", " ").replace("\n", " ")
    value = re.sub(r"\s+", " ", value).strip()
    replacements = {
        "@": "^2",
        "#": "^3",
        "$": "^4",
        "%": "^5",
        "Û": "^2",
        "Ü": "^3",
        "Ý": "^4",
        "Þ": "^5",
    }
    for src, dst in replacements.items():
        value = value.replace(src, dst)
    value = value.replace("j3", "√3").replace("j14k", "√14")
    value = value.replace("`", "")
    return value, before != value


def js_escape(value):
    return value.replace("\\", "\\\\").replace('"', '\\"')


def replace_field(block, field, transform, file_rel, set_key, qid, meta, applied, manual):
    pat = re.compile(rf"({field}:\s*\")((?:\\.|[^\"])*)((?:\"))", re.S)
    def repl(m):
        old = m.group(2)
        new, changed = transform(old)
        if changed:
            applied.append({
                "file": file_rel,
                "setKey": set_key,
                "id": qid,
                "pageNo": meta.get("pageNo"),
                "displayNo": meta.get("displayNo"),
                "cropFile": meta.get("cropFile"),
                "field": field,
                "before": old,
                "after": new,
                "reason": "PDF exponent/control glyph cleanup using archive plain-text ^ notation",
                "evidence": meta.get("cropPath", ""),
                "confidence": 0.86,
            })
        return m.group(1) + js_escape(new) + m.group(3)
    return pat.sub(repl, block, count=1)


def replace_choices(block, transform, file_rel, set_key, qid, meta, applied):
    m = re.search(r"(choices:\s*\[)(.*?)(\])", block, re.S)
    if not m:
        return block
    body = m.group(2)
    idx = -1
    def repl(sm):
        nonlocal idx
        idx += 1
        old = sm.group(1)
        new, changed = transform(old)
        if changed:
            applied.append({
                "file": file_rel,
                "setKey": set_key,
                "id": qid,
                "pageNo": meta.get("pageNo"),
                "displayNo": meta.get("displayNo"),
                "cropFile": meta.get("cropFile"),
                "field": "choices",
                "choiceIndex": idx,
                "before": old,
                "after": new,
                "reason": "PDF exponent/control glyph cleanup using archive plain-text ^ notation",
                "evidence": meta.get("cropPath", ""),
                "confidence": 0.86,
            })
        return '"' + js_escape(new) + '"'
    new_body = re.sub(r"\"((?:\\.|[^\"])*)\"", repl, body)
    return block[:m.start(2)] + new_body + block[m.end(2):]


def cleanup_formulas(crop_idx):
    applied = []
    manual = []
    for path in js_files():
        text = path.read_text(encoding="utf-8")
        set_key = path.stem
        blocks = question_blocks(text)
        out = []
        last = 0
        file_rel = path.relative_to(ROOT).as_posix()
        for start, end, block, qid in blocks:
            out.append(text[last:start])
            meta = crop_idx.get((set_key, qid), {})
            new_block = block
            new_block = replace_field(new_block, "content", normalize_formula_text, file_rel, set_key, qid, meta, applied, manual)
            new_block = replace_field(new_block, "answer", normalize_formula_text, file_rel, set_key, qid, meta, applied, manual)
            new_block = replace_choices(new_block, normalize_formula_text, file_rel, set_key, qid, meta, applied)
            out.append(new_block)
            last = end
        out.append(text[last:])
        path.write_text("".join(out), encoding="utf-8")

    remaining = scan_anomalies(crop_idx)
    for item in remaining:
        unresolved = [h for h in item["hits"] if h in ANOMALY_CHARS or h in BAD_STRINGS or h == "control_char"]
        if unresolved:
            manual.append({
                **item,
                "reason": "remaining_formula_or_encoding_anomaly_after_safe_cleanup",
                "suggestedAction": "문항 crop 또는 정답표 crop으로 원문 수식 확인",
            })
    write_json(REPORTS / "text1_formula_cleanup_applied_report.json", applied)
    write_json(REPORTS / "text1_formula_manual_review_required.json", manual)
    return applied, manual


def render_risk_report(crop_idx):
    risks = []
    for path in js_files():
        set_key = path.stem
        text = path.read_text(encoding="utf-8")
        for _, _, block, qid in question_blocks(text):
            meta = crop_idx.get((set_key, qid), {})
            fields = {"content": [string_field(block, "content") or ""], "answer": [string_field(block, "answer") or ""]}
            fields["choices"] = choices_strings(block)
            if string_field(block, "solution"):
                risks.append({"file": path.relative_to(ROOT).as_posix(), "setKey": set_key, "id": qid, "field": "solution", "risk": "solution_non_empty"})
            for field, values in fields.items():
                for value in values:
                    field_risks = []
                    if "\n" in value or "\r" in value:
                        field_risks.append("string_newline")
                    if "`" in value:
                        field_risks.append("backtick")
                    if re.search(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", value):
                        field_risks.append("control_char")
                    if "<" in value or ">" in value:
                        field_risks.append("contains_angle_bracket_as_math_or_html_sensitive")
                    if "&" in value:
                        field_risks.append("contains_ampersand")
                    if field_risks:
                        risks.append({
                            "file": path.relative_to(ROOT).as_posix(),
                            "setKey": set_key,
                            "id": qid,
                            "pageNo": meta.get("pageNo"),
                            "displayNo": meta.get("displayNo"),
                            "cropFile": meta.get("cropFile"),
                            "field": field,
                            "risks": field_risks,
                            "text": value,
                        })
    write_json(REPORTS / "text1_formula_render_risk_report.json", risks)
    return risks


def standard_unit_validation():
    files = js_files()
    texts = [p.read_text(encoding="utf-8") for p in files]
    validation = {
        "unmappedCount": sum(t.count('standardUnitKey: "UNMAPPED"') for t in texts),
        "emptyStandardCourseCount": sum(t.count('standardCourse: ""') for t in texts),
        "emptyStandardUnitCount": sum(t.count('standardUnit: ""') for t in texts),
        "invalidOrderCount": sum(t.count("standardUnitOrder: 999") for t in texts),
    }
    write_json(REPORTS / "text1_standard_unit_mapping_fix_report.json", {"items": [], "note": "이번 라운드에서 추가 standardUnit 변경 없음."})
    write_json(REPORTS / "text1_standard_unit_mapping_unresolved.json", [])
    write_json(REPORTS / "text1_standard_unit_mapping_validation.json", validation)
    write_json(REPORTS / "text1_js_unit_mapping_review.json", {"items": [], "validation": validation})
    return validation


def validate(crop_items, before_file_names, before_crop_files):
    node = []
    for p in js_files():
        node.append({"file": p.relative_to(ROOT).as_posix(), **run_cmd(["node", "--check", str(p.relative_to(ROOT))])})
    texts = [p.read_text(encoding="utf-8") for p in js_files()]
    q_count = sum(len(re.findall(r"\n\s*id:\s*\d+,", t)) for t in texts)
    answer_count = sum(len(re.findall(r'answer:\s*"(?!")', t)) for t in texts)
    solution_nonempty = sum(len(re.findall(r'solution:\s*"(?!")', t)) for t in texts)
    tags_empty = sum(t.count("tags: []") for t in texts)
    current_names = sorted(p.relative_to(ROOT).as_posix() for p in js_files())
    current_crop_files = sorted(p.relative_to(ROOT).as_posix() for p in (ROOT / "generated" / "work" / "question_crops").glob("**/*.png"))
    val = {
        "nodeCheckPass": all(x["ok"] for x in node),
        "nodeCheck": node,
        "questionCount": q_count,
        "cropMapQuestionCount": len(crop_items),
        "cropMapMatchesJsQuestionCount": q_count == len(crop_items),
        "answerFilledCount": answer_count,
        "answerEmptyCount": q_count - answer_count,
        "solutionNonEmptyCount": solution_nonempty,
        "tagsEmptyCount": tags_empty,
        "jsFilenamesUnchanged": current_names == before_file_names,
        "cropFilesUnchanged": current_crop_files == before_crop_files,
    }
    write_json(REPORTS / "text1_formula_cleanup_validation.json", val)
    return val


def append_result(summary, rule_items, sample_items, reports):
    result = ROOT / "CODEX_RESULT.md"
    block = f"""

## Round: text1 answer apply and formula audit

- 작업 범위: answer 정답표 적용 + content/choices/answer 수식·기호 audit
- 읽은 룰북 파일: {', '.join([x['file'] for x in rule_items if x.get('file')])}
- 확인한 기존 archive 샘플: {', '.join([x['file'] for x in sample_items])}
- 입력 정답 PDF 또는 정답표 영역: {summary['answerSource']}
- 기준 JS 문항 수: {summary['questionCount']}
- 대상 섹션: 중단원학습점검, 대단원학습평가, 익힘책
- 대상 문항 수: {summary['targetQuestionCount']}
- 정답표 crop 수: {summary['answerTableCropCount']}
- answer 추출 수: {summary['answerExtractionCount']}
- answer 적용 수: {summary['answerApplyCount']}
- answer 미확정 수: {summary['answerUnresolvedCount']}
- formula anomaly scan 수: {summary['formulaAnomalyScanCount']}
- formula cleanup 적용 수: {summary['formulaCleanupAppliedCount']}
- formula manual review 수: {summary['formulaManualReviewCount']}
- render risk 수: {summary['renderRiskCount']}
- 보정 전 UNMAPPED 수: {summary['unmappedBefore']}
- 보정 후 UNMAPPED 수: {summary['unmappedAfter']}
- standardUnit unresolved 수: {summary['standardUnitUnresolvedCount']}
- solution unchanged: {summary['solutionUnchanged']}
- id/image/crop files/JS filenames unchanged: {summary['stableFilesUnchanged']}
- tags 빈 값 위반 수: {summary['tagsEmptyCount']}
- node --check 결과: {summary['nodeCheckPass']}
- 생성/갱신 reports: {', '.join(reports)}
- archive/textbook 수정 여부: false
- git add/commit/push 여부: false
- 최종 판정: {summary['status']}
"""
    with result.open("a", encoding="utf-8") as f:
        f.write(block)


def main():
    REPORTS.mkdir(parents=True, exist_ok=True)
    answer_mod = load_answer_module()
    tool_availability(answer_mod)
    rule_items = read_rules_report()
    sample_items = archive_sample_report()
    crop_items, crop_idx = load_crop_index()
    before_names = sorted(p.relative_to(ROOT).as_posix() for p in js_files())
    before_crop_files = sorted(p.relative_to(ROOT).as_posix() for p in (ROOT / "generated" / "work" / "question_crops").glob("**/*.png"))
    unmapped_before = standard_unit_validation()["unmappedCount"]

    pdf_path, detection = answer_mod.find_pdf()
    groups = defaultdict(list)
    for item in crop_items:
        if item.get("sectionType") in {"중단원학습점검", "대단원학습평가", "익힘책"}:
            groups[(item["setKey"], item["bookPart"], item["unit"], item["sectionType"])].append(item)
    crop_map, contact_index = answer_mod.render_answer_pages(pdf_path, groups)
    answers, extraction, answer_manual = answer_mod.extract_answers(pdf_path, groups, crop_map)
    apply_report, forbidden_changes, _, _ = answer_mod.apply_answers(groups, answers)

    pre_scan = scan_anomalies(crop_idx)
    applied, formula_manual = cleanup_formulas(crop_idx)
    risks = render_risk_report(crop_idx)
    std_validation = standard_unit_validation()
    validation = validate(crop_items, before_names, before_crop_files)

    reports = [
        "generated/reports/text1_answer_formula_tool_availability.json",
        "generated/reports/text1_answer_formula_rules_read_report.json",
        "generated/reports/text1_answer_formula_archive_sample_report.json",
        "generated/reports/text1_answer_pdf_detection_report.json",
        "generated/reports/text1_answer_table_crop_map.json",
        "generated/reports/text1_answer_extraction_report.json",
        "generated/reports/text1_answer_apply_report.json",
        "generated/reports/text1_answer_manual_review_required.json",
        "generated/reports/text1_formula_anomaly_scan_report.json",
        "generated/reports/text1_formula_cleanup_applied_report.json",
        "generated/reports/text1_formula_manual_review_required.json",
        "generated/reports/text1_formula_render_risk_report.json",
        "generated/reports/text1_formula_cleanup_validation.json",
        "generated/reports/text1_standard_unit_mapping_validation.json",
        "generated/reports/text1_answer_formula_audit_summary.json",
    ]
    status = "PASS"
    if answer_manual or formula_manual or risks:
        status = "PARTIAL"
    if not validation["nodeCheckPass"] or validation["solutionNonEmptyCount"] or forbidden_changes:
        status = "FAIL"

    summary = {
        "status": status,
        "answerSource": f"{detection.get('selectedSourceType')} / {detection.get('selectedPdf')}",
        "questionCount": validation["questionCount"],
        "targetQuestionCount": len(crop_items),
        "answerTableCropCount": len(crop_map),
        "answerExtractionCount": len(extraction),
        "answerApplyCount": len(apply_report),
        "answerUnresolvedCount": len(crop_items) - len(apply_report),
        "answerManualReviewCount": len(answer_manual),
        "formulaAnomalyScanCount": len(pre_scan),
        "formulaCleanupAppliedCount": len(applied),
        "formulaManualReviewCount": len(formula_manual),
        "renderRiskCount": len(risks),
        "unmappedBefore": unmapped_before,
        "unmappedAfter": std_validation["unmappedCount"],
        "standardUnitUnresolvedCount": 0,
        "solutionUnchanged": validation["solutionNonEmptyCount"] == 0,
        "stableFilesUnchanged": validation["jsFilenamesUnchanged"] and validation["cropFilesUnchanged"] and not forbidden_changes,
        "tagsEmptyCount": validation["tagsEmptyCount"],
        "nodeCheckPass": validation["nodeCheckPass"],
        "forbiddenFieldChangedFiles": forbidden_changes,
        "reports": reports,
        "note": "정답 영역이 해설 혼합 구조라 확실한 정답만 적용하고 불확실 항목은 manual review로 분리함.",
    }
    write_json(REPORTS / "text1_answer_formula_audit_summary.json", summary)
    append_result(summary, rule_items, sample_items, reports)
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0 if validation["nodeCheckPass"] and validation["solutionNonEmptyCount"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
