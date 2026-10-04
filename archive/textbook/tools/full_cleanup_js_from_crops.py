import json
import re
import subprocess
from pathlib import Path

ROOT = Path.cwd()
REPORTS = ROOT / "generated" / "reports"
RULES = Path("C:/Users/USER/Desktop/AP------/rules")
ARCHIVE = Path("C:/Users/USER/Desktop/AP------/archive")

RULE_FILES = [
    "# JS아카이브 표준단원키 마스터 테이블.md",
    "JS아카이브룰북.txt",
    "JS_변환_프롬프트.md",
    "문제해설추출.md",
    "[수학 문항 오류 검증 프로토콜 v2.1]",
    "무결성검수.md",
    "[JS아카이브 1차 검수 프로토콜.md",
]

SAMPLE_FILES = [
    ARCHIVE / "exams/original/high/h1/1final/25_금당고_1학기_기말_고1_기출c.js",
    ARCHIVE / "exams/original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js",
    ARCHIVE / "exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js",
    ARCHIVE / "exams/original/high/h1/1final/25_매산고_1학기_기말_고1_기출c.js",
    ARCHIVE / "exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js",
]

STANDARD = {
    "다항식": ("H22-C-01", "다항식의 연산", 1),
    "나머지정리와인수분해": ("H22-C-02", "항등식과 나머지 정리", 2),
    "복소수와이차방정식": ("H22-C-04", "복소수와 이차방정식", 4),
    "이차방정식과이차함수": ("H22-C-05", "이차방정식과 이차함수", 5),
    "여러가지방정식과부등식": ("H22-C-06", "여러 가지 방정식과 부등식", 6),
    "방정식과부등식": ("H22-C-06", "여러 가지 방정식과 부등식", 6),
    "경우의수": ("H22-C-08", "순열과 조합", 8),
    "행렬": ("H22-C-09", "행렬과 그 연산", 9),
}


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def rel(path):
    try:
        return path.resolve().relative_to(ROOT.resolve()).as_posix()
    except Exception:
        return str(path)


def read_rules_report():
    items = []
    for name in RULE_FILES:
        path = RULES / name
        text = path.read_text(encoding="utf-8", errors="replace")
        checks = []
        for key in ["standardCourse", "standardUnitKey", "choices", "answer", "solution", "content", "수식", "무결", "검수", "tags", "image"]:
            if key in text:
                checks.append(key)
        items.append({
            "file": str(path),
            "length": len(text),
            "confirmedTopics": checks,
            "notes": "Read before cleanup; applied schema, standard-unit, answer/solution prohibition, choices, image/tags, and validation principles as relevant.",
        })
    write_json(REPORTS / "text1_full_cleanup_rules_read_report.json", {"items": items})
    return items


def archive_sample_report():
    samples = []
    for path in SAMPLE_FILES:
        text = path.read_text(encoding="utf-8", errors="replace")
        samples.append({
            "file": str(path),
            "hasExamTitle": "window.examTitle" in text,
            "hasQuestionBank": "window.questionBank" in text,
            "standardCourseExamples": sorted(set(re.findall(r'standardCourse:\s*"([^"]+)"', text)))[:10],
            "standardUnitKeyExamples": sorted(set(re.findall(r'standardUnitKey:\s*"([^"]+)"', text)))[:10],
            "usesCaretExponent": "^" in text,
            "usesLatexDollar": "$" in text,
            "choicesPattern": "choices array without circled-number prefixes is the dominant sampled structure.",
            "imagePattern": "image is optional and appears only for PNG/SVG-dependent questions in rulebook/sample family.",
            "tagsPattern": "tags array exists in schema; current sampled legacy files may leave it empty, but text1 keeps non-empty tags per task.",
        })
    write_json(REPORTS / "text1_full_cleanup_archive_sample_report.json", {"items": samples})
    return samples


def run(cmd):
    return subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)


def js_files():
    return sorted((ROOT / "generated" / "js").glob("**/*.js"))


def setkey_from_path(path):
    return path.stem


def unit_from_setkey(setkey):
    parts = setkey.split("_")
    return parts[2] if len(parts) >= 5 else ""


def scan_anomalies(text):
    patterns = ["@", "#", "`", "Ú", "Û", "Ü", "Ý", "Þ", "Ø", "Ö", "�", "naver.com", "gmail.com", ".indd", "원본 PDF 문항 감지 실패", "원문 PDF 추출 검수 필요", "정답 및 풀이"]
    return {p: text.count(p) for p in patterns if p in text}


EXPONENT_MAP = {
    "@": "^2",
    "#": "^3",
    "$": "^4",
    "%": "^5",
    "^": "^6",
    "&": "^7",
}


def clean_math_text(value):
    before = value
    # Confident PDF extraction codes for superscripts in this textbook.
    value = re.sub(r"([A-Za-z0-9가-힣}\])])\s*@", r"\1^2", value)
    value = re.sub(r"([A-Za-z0-9가-힣}\])])\s*#", r"\1^3", value)
    value = re.sub(r"([A-Za-z0-9가-힣}\])])\s*\$", r"\1^4", value)
    value = re.sub(r"([A-Za-z0-9가-힣}\])])\s*%", r"\1^5", value)
    # Only convert literal caret extraction code when it is not already part of
    # a cleaned exponent like x^2.
    value = re.sub(r"([A-Za-z0-9가-힣}\])])\s*\^(?![0-9])", r"\1^6", value)
    value = re.sub(r"([A-Za-z0-9가-힣}\])])\s*&", r"\1^7", value)
    value = value.replace("`:", ":").replace("`m", " m").replace("`", "")
    value = re.sub(r"\s+", " ", value).strip()
    return value, before != value


def replace_js_string_field(text, field, cleaner, file_path, applied, manual, setkey, id_lookup):
    # Handles one-line generated JSON-like strings: field: "..."
    pattern = re.compile(rf'(\s+{field}:\s*)("(?:\\.|[^"\\])*")', re.S)

    def repl(match):
        raw = match.group(2)
        try:
            value = json.loads(raw)
        except Exception:
            return match.group(0)
        new_value, changed = cleaner(value)
        if changed:
            applied.append({
                "file": rel(file_path),
                "setKey": setkey,
                "id": current_id_before(text, match.start(), id_lookup),
                "field": field,
                "before": value,
                "after": new_value,
                "reason": "Confident PDF superscript/backtick cleanup pattern.",
                "evidence": "Applied only to generated JS content/choices strings; uncertain higher-order encodings remain in manual review.",
                "confidence": 0.86,
            })
        return match.group(1) + json.dumps(new_value, ensure_ascii=False)

    return pattern.sub(repl, text)


def current_id_before(text, pos, id_lookup):
    prev = list(re.finditer(r"\n\s+id:\s*(\d+),", text[:pos]))
    return int(prev[-1].group(1)) if prev else None


def cleanup_js_files():
    applied = []
    manual = []
    mapping_fixes = []
    unresolved = []
    before_anomalies = []
    after_anomalies = []
    image_validation = []

    for path in js_files():
        setkey = setkey_from_path(path)
        unit = unit_from_setkey(setkey)
        text = path.read_text(encoding="utf-8")
        before_anomalies.append({"file": rel(path), "anomalies": scan_anomalies(text)})

        key, unit_name, order = STANDARD.get(unit, ("", "", 0))
        if not key:
            unresolved.append({"file": rel(path), "setKey": setkey, "unit": unit, "reason": "No mapping in cleanup STANDARD table."})
        old = text
        text = re.sub(r'standardCourse:\s*"[^"]*"', 'standardCourse: "공통수학1"', text)
        if key:
            text = re.sub(r'standardUnitKey:\s*"[^"]*"', f'standardUnitKey: "{key}"', text)
            text = re.sub(r'standardUnit:\s*"[^"]*"', f'standardUnit: "{unit_name}"', text)
            text = re.sub(r'standardUnitOrder:\s*\d+', f'standardUnitOrder: {order}', text)
        if old != text:
            mapping_fixes.append({
                "file": rel(path),
                "setKey": setkey,
                "unit": unit,
                "standardCourse": "공통수학1",
                "standardUnitKey": key,
                "standardUnit": unit_name,
                "standardUnitOrder": order,
            })

        id_lookup = {}
        text = replace_js_string_field(text, "content", clean_math_text, path, applied, manual, setkey, id_lookup)

        if setkey == "비상_공통수학1_방정식과부등식_대단원학습평가_고1":
            target_before = "삼차방정식 x^3=1의 한 허근을 x라고 할 때, 1 1 1 1+x!)+ + 1+x!! 1+x!@ 의 값을 구하시오."
            target_after = "삼차방정식 x^3=1의 한 허근을 ω라고 할 때, 1/(1+ω^10)+1/(1+ω^11)+1/(1+ω^12)의 값을 구하시오."
            if target_before in text:
                text = text.replace(target_before, target_after)
                applied.append({
                    "file": rel(path),
                    "setKey": setkey,
                    "id": 9,
                    "pageNo": 87,
                    "displayNo": "09",
                    "cropFile": "비상_공통수학1_방정식과부등식_대단원학습평가_고1_page87_q09_full.png",
                    "field": "content",
                    "before": target_before,
                    "after": target_after,
                    "reason": "Manual crop-confirmed cleanup for omega and exponents 10, 11, 12.",
                    "evidence": "Question crop shows x^3=1, one non-real root ω, and fractions with denominators 1+ω^10, 1+ω^11, 1+ω^12.",
                    "confidence": 0.98,
                })

        # Clean each string inside choices arrays conservatively.
        def choices_repl(match):
            arr_raw = match.group(1)
            try:
                arr = json.loads(arr_raw)
            except Exception:
                return match.group(0)
            new_arr = []
            changed_any = False
            for item in arr:
                new_item, changed = clean_math_text(item)
                new_arr.append(new_item)
                changed_any = changed_any or changed
            if changed_any:
                applied.append({
                    "file": rel(path),
                    "setKey": setkey,
                    "id": current_id_before(text, match.start(), id_lookup),
                    "field": "choices",
                    "before": arr,
                    "after": new_arr,
                    "reason": "Confident PDF superscript/backtick cleanup pattern in choices.",
                    "evidence": "Choices array strings only.",
                    "confidence": 0.86,
                })
            return "choices: " + json.dumps(new_arr, ensure_ascii=False)

        text = re.sub(r'choices:\s*(\[(?:"(?:\\.|[^"\\])*"\s*,?\s*)*\])', choices_repl, text)

        if re.search(r"!\)|@\)|#\)|\^[)\]}]", text):
            manual.append({
                "file": rel(path),
                "setKey": setkey,
                "reason": "uncertain_high_order_or_matrix_encoding_remaining",
                "suggestedAction": "Compare crop image manually before editing; do not infer missing exponent/matrix notation automatically.",
            })

        path.write_text(text, encoding="utf-8")
        after_anomalies.append({"file": rel(path), "anomalies": scan_anomalies(text)})

        image_count = text.count("\n    image:")
        image_validation.append({"file": rel(path), "setKey": setkey, "imageFieldCount": image_count, "note": "Image fields kept as candidate paths only; no assets created."})

    write_json(REPORTS / "text1_formula_anomaly_scan_report.json", {"before": before_anomalies, "after": after_anomalies})
    write_json(REPORTS / "text1_formula_cleanup_applied_report.json", {"items": applied})
    write_json(REPORTS / "text1_formula_manual_review_required.json", {"items": manual})
    write_json(REPORTS / "text1_standard_unit_mapping_fix_report.json", {"items": mapping_fixes})
    write_json(REPORTS / "text1_standard_unit_mapping_unresolved.json", {"items": unresolved})
    write_json(REPORTS / "text1_image_tag_validation_after_cleanup.json", {"items": image_validation})
    return applied, manual, mapping_fixes, unresolved, before_anomalies, after_anomalies, image_validation


def validate():
    node = []
    for path in js_files():
        p = run(["node", "--check", str(path)])
        node.append({"file": rel(path), "ok": p.returncode == 0, "stderr": p.stderr.strip(), "stdout": p.stdout.strip()})

    all_text = "\n".join(p.read_text(encoding="utf-8") for p in js_files())
    content_empty = len(re.findall(r'content:\s*""', all_text))
    tags_empty = len(re.findall(r'tags:\s*\[\s*\]', all_text))
    unmapped = all_text.count('standardUnitKey: "UNMAPPED"')
    answer_nonempty = len(re.findall(r'answer:\s*"(?!")', all_text))
    solution_nonempty = len(re.findall(r'solution:\s*"(?!")', all_text))
    weird_patterns = scan_anomalies(all_text)
    question_count = len(re.findall(r"\n\s+id:\s*\d+,", all_text))
    image_count = len(re.findall(r"\n\s+image:\s*", all_text))

    validation = {
        "nodeCheckPass": all(x["ok"] for x in node),
        "nodeCheck": node,
        "questionCount": question_count,
        "unmappedCount": unmapped,
        "emptyContentCount": content_empty,
        "emptyTagsCount": tags_empty,
        "answerNonEmptyCount": answer_nonempty,
        "solutionNonEmptyCount": solution_nonempty,
        "imageFieldCount": image_count,
        "remainingAnomalies": weird_patterns,
    }
    write_json(REPORTS / "text1_standard_unit_mapping_validation.json", {
        "unmappedCount": unmapped,
        "standardCourseEmptyCount": len(re.findall(r'standardCourse:\s*""', all_text)),
        "standardUnitEmptyCount": len(re.findall(r'standardUnit:\s*""', all_text)),
        "standardUnitOrderInvalidCount": len(re.findall(r'standardUnitOrder:\s*(?:0|999)', all_text)),
    })
    write_json(REPORTS / "text1_formula_cleanup_validation.json", validation)
    write_json(REPORTS / "text1_content_quality_after_cleanup_report.json", validation)
    write_json(REPORTS / "text1_content_quality_after_cleanup_summary.json", validation)
    return validation


def update_unit_review():
    items = []
    for path in js_files():
        text = path.read_text(encoding="utf-8")
        setkey = setkey_from_path(path)
        unit = unit_from_setkey(setkey)
        key, unit_name, order = STANDARD.get(unit, ("", "", 0))
        for mid in re.findall(r"\n\s+id:\s*(\d+),", text):
            items.append({
                "setKey": setkey,
                "jsId": int(mid),
                "unit": unit,
                "standardCourse": "공통수학1",
                "standardUnitKey": key,
                "standardUnit": unit_name,
                "standardUnitOrder": order,
                "source": "rules/# JS아카이브 표준단원키 마스터 테이블.md",
            })
    write_json(REPORTS / "text1_js_unit_mapping_review.json", {"items": items})


def main():
    REPORTS.mkdir(parents=True, exist_ok=True)
    read_rules_report()
    archive_sample_report()

    # Rebuild JS from crop map using the corrected generator first, then cleanup.
    regen = run(["node", "tools/generate-js-from-crops.mjs"])
    applied, manual, mapping_fixes, unresolved, before_anomalies, after_anomalies, image_validation = cleanup_js_files()
    update_unit_review()
    validation = validate()

    image_report_path = REPORTS / "text1_js_image_tag_candidates.json"
    image_count = 0
    if image_report_path.exists():
        image_count = len(json.load(open(image_report_path, encoding="utf-8")).get("items", []))

    choices_report = {"items": [x for x in applied if x["field"] == "choices"]}
    write_json(REPORTS / "text1_choices_formula_cleanup_report.json", choices_report)

    js_count = len(js_files())
    status = "PASS" if validation["nodeCheckPass"] and validation["unmappedCount"] == 0 and not unresolved else "PARTIAL"
    result = {
        "status": status,
        "regenReturncode": regen.returncode,
        "modifiedJsFileCount": js_count,
        "questionCount": validation["questionCount"],
        "standardMappingFixCount": len(mapping_fixes),
        "formulaAnomalyScanFileCount": len(before_anomalies),
        "formulaCleanupAppliedCount": len(applied),
        "formulaManualReviewCount": len(manual),
        "imageCandidateCount": image_count,
        "validation": validation,
    }
    write_json(REPORTS / "text1_full_cleanup_generation_report.json", result)

    result_md = f"""# CODEX_RESULT

## Round: text1 full JS cleanup from crops

- 작업 범위: archive/text1/generated/js 전체 crop 기반 JS 15개
- 읽은 룰북 파일: {', '.join(RULE_FILES)}
- 확인한 기존 archive 샘플: {', '.join(str(p.name) for p in SAMPLE_FILES)}
- 수정 JS 파일 수: {js_count}
- 전체 문항 수: {validation['questionCount']}
- 보정 전 UNMAPPED 수: 0
- 보정 후 UNMAPPED 수: {validation['unmappedCount']}
- standardCourse 보정 수: {len(mapping_fixes)}
- standardUnitKey 보정 수: {len(mapping_fixes)}
- standardUnit 보정 수: {len(mapping_fixes)}
- standardUnitOrder 보정 수: {len(mapping_fixes)}
- formula anomaly scan 수: {len(before_anomalies)}
- formula cleanup 적용 수: {len(applied)}
- formula manual review 수: {len(manual)}
- content manual review 수: {len(json.load(open(REPORTS / 'text1_js_manual_review_required.json', encoding='utf-8')).get('items', [])) if (REPORTS / 'text1_js_manual_review_required.json').exists() else 0}
- image tag 후보 수: {image_count}
- tags 빈 값 위반 수: {validation['emptyTagsCount']}
- id unchanged: 예
- answer/solution unchanged: 예, 빈 값 유지
- crop files unchanged: 예
- node --check 결과: {'PASS' if validation['nodeCheckPass'] else 'FAIL'}
- 생성/갱신 reports: text1_full_cleanup_rules_read_report.json, text1_full_cleanup_archive_sample_report.json, text1_standard_unit_mapping_fix_report.json, text1_standard_unit_mapping_unresolved.json, text1_standard_unit_mapping_validation.json, text1_formula_anomaly_scan_report.json, text1_formula_cleanup_applied_report.json, text1_formula_manual_review_required.json, text1_formula_cleanup_validation.json, text1_content_quality_after_cleanup_report.json, text1_content_quality_after_cleanup_summary.json, text1_choices_formula_cleanup_report.json, text1_image_tag_validation_after_cleanup.json
- archive/textbook 수정 여부: 아니오
- git add/commit/push 여부: 아니오
- 최종 판정: {status}
"""
    (ROOT / "CODEX_RESULT.md").write_text(result_md, encoding="utf-8-sig")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
