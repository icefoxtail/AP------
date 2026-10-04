import argparse
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


UNIT_RULES = [
    ("H15-PS-06", "통계적 추정", 6, re.compile(r"신뢰|추정|표본|모평균|모비율|신뢰도|신뢰구간|표본평균")),
    ("H15-PS-05", "확률분포", 5, re.compile(r"정규분포|이항분포|확률변수|확률분포|평균|분산|표준편차|기댓값|기대값")),
    ("H15-PS-04", "조건부확률", 4, re.compile(r"조건부|독립사건|종속사건|서로 독립|P\(|P\s*\(")),
    ("H15-PS-03", "확률의 뜻과 활용", 3, re.compile(r"확률|사건|여사건|배반사건|독립시행")),
    ("H15-PS-02", "이항정리", 2, re.compile(r"이항정리|전개식|계수|항의 계수|\\(.*\\+.*\\)")),
    ("H15-PS-01", "순열과 조합", 1, re.compile(r"순열|조합|경우의 수|위원|배열|일렬|원순열|뽑|택|함수의 개수")),
]

TITLE_TERM_DEFAULTS = [
    ("2기말", ("H15-PS-06", "통계적 추정", 6)),
    ("2학기_기말", ("H15-PS-06", "통계적 추정", 6)),
    ("2중간", ("H15-PS-05", "확률분포", 5)),
    ("2학기_중간", ("H15-PS-05", "확률분포", 5)),
    ("1기말", ("H15-PS-03", "확률의 뜻과 활용", 3)),
    ("1학기_기말", ("H15-PS-03", "확률의 뜻과 활용", 3)),
    ("1중간", ("H15-PS-01", "순열과 조합", 1)),
    ("1학기_중간", ("H15-PS-01", "순열과 조합", 1)),
]

REQUIRED_DEFAULTS = {
    "level": "중",
    "category": "확률과 통계",
    "originalCategory": "확률과 통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": 0,
    "questionType": "주관식",
    "layoutTag": "grid",
    "tags": ["기출"],
    "wide": False,
}

KEYPOINT_PREFIX = "[키포인트]"
CHOICE_SYMBOL_RE = re.compile(r"[①②③④⑤]")
MULTI_ANSWER_MARKERS = ["모두 고르", "모두 골", "옳은 것을 모두", "옳은 것만", "정답 2개", "두 개를 고르", "복수정답"]
POLLUTION_PATTERNS = ["cite:", "ChatGPT", "Gemini", "검토 결과", "문항 answer 기준", "문항 기준"]


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def load_candidate(path):
    source = Path(path).read_text(encoding="utf-8")
    title_match = re.search(r"window\.examTitle\s*=\s*(.*?);\s*window\.questionBank", source, re.S)
    bank_match = re.search(r"window\.questionBank\s*=\s*(\[.*\]);\s*$", source, re.S)
    if not title_match or not bank_match:
        raise ValueError(f"Cannot parse candidate JS: {path}")
    return json.loads(title_match.group(1)), json.loads(bank_match.group(1))


def write_candidate(path, title, questions):
    payload = (
        "window.examTitle = "
        + json.dumps(title, ensure_ascii=False)
        + ";\nwindow.questionBank = "
        + json.dumps(questions, ensure_ascii=False, indent=2)
        + ";\n"
    )
    Path(path).write_text(payload, encoding="utf-8")


def has_text(value):
    return bool(str(value or "").strip())


def has_mojibake(value):
    text = str(value or "")
    return "?" in text or "�" in text or "留" in text or "怨" in text


def infer_unit(content, title):
    text = str(content or "")
    for key, unit, order, pattern in UNIT_RULES:
        if pattern.search(text):
            return key, unit, order, "content_keyword"
    for needle, default in TITLE_TERM_DEFAULTS:
        if needle in str(title or ""):
            key, unit, order = default
            return key, unit, order, "term_default"
    return "H15-PS-01", "순열과 조합", 1, "fallback_default"


def should_be_objective(question):
    choices = question.get("choices")
    qtype = str(question.get("questionType") or "")
    answer = str(question.get("answer") or "")
    return (
        qtype == "객관식"
        or (isinstance(choices, list) and len(choices) > 0)
        or bool(CHOICE_SYMBOL_RE.search(answer))
    )


def ensure_tags(question):
    tags = question.get("tags")
    if not isinstance(tags, list):
        tags = []
    cleaned = []
    for tag in tags:
        tag_text = str(tag or "").strip()
        if tag_text and not has_mojibake(tag_text):
            cleaned.append(tag_text)
    if "기출" not in cleaned:
        cleaned.insert(0, "기출")
    if any(marker in str(question.get("content") or "") for marker in MULTI_ANSWER_MARKERS) and "복수정답" not in cleaned:
        cleaned.append("복수정답")
    return cleaned


def normalize_question(question, title, counters):
    changed = False
    for field, default in REQUIRED_DEFAULTS.items():
        if field not in question:
            question[field] = list(default) if isinstance(default, list) else default
            counters[f"added_{field}"] += 1
            changed = True

    if not has_text(question.get("level")) or str(question.get("level")) not in {"하", "중", "상"}:
        question["level"] = "중"
        question["levelStatus"] = "default_mid_pending_review"
        counters["level_defaulted"] += 1
        changed = True

    if not has_text(question.get("standardCourse")) or has_mojibake(question.get("standardCourse")):
        question["standardCourse"] = "확률과 통계"
        counters["standard_course_fixed"] += 1
        changed = True

    unit_key, unit, order, reason = infer_unit(question.get("content"), title)
    if not has_text(question.get("standardUnit")) or has_mojibake(question.get("standardUnit")):
        question["standardUnitKey"] = unit_key
        question["standardUnit"] = unit
        question["standardUnitOrder"] = order
        question["unitInferStatus"] = reason
        counters[f"unit_inferred_{reason}"] += 1
        changed = True
    elif not has_text(question.get("standardUnitKey")):
        question["standardUnitKey"] = unit_key
        question["standardUnitOrder"] = order
        question["unitInferStatus"] = "unit_key_filled_from_content"
        counters["unit_key_filled"] += 1
        changed = True

    if not has_text(question.get("category")) or has_mojibake(question.get("category")):
        question["category"] = question.get("standardUnit") or "확률과 통계"
        counters["category_fixed"] += 1
        changed = True

    if not has_text(question.get("originalCategory")) or has_mojibake(question.get("originalCategory")):
        question["originalCategory"] = title
        counters["original_category_fixed"] += 1
        changed = True

    tags = ensure_tags(question)
    if question.get("tags") != tags:
        question["tags"] = tags
        counters["tags_fixed"] += 1
        changed = True

    if not has_text(question.get("layoutTag")) or has_mojibake(question.get("layoutTag")):
        question["layoutTag"] = "grid"
        counters["layout_tag_fixed"] += 1
        changed = True

    if not isinstance(question.get("wide"), bool):
        question["wide"] = bool(question.get("wide"))
        counters["wide_fixed"] += 1
        changed = True

    if not isinstance(question.get("choices"), list):
        question["choices"] = []
        counters["choices_type_fixed"] += 1
        changed = True

    qtype = str(question.get("questionType") or "")
    if not has_text(qtype) or has_mojibake(qtype):
        question["questionType"] = "객관식" if should_be_objective(question) else "주관식"
        counters["question_type_fixed"] += 1
        changed = True

    solution = str(question.get("solution") or "").strip()
    if solution and not solution.startswith(KEYPOINT_PREFIX) and not any(marker in solution for marker in POLLUTION_PATTERNS):
        question["solution"] = f"{KEYPOINT_PREFIX} {solution}"
        question["solutionStatus"] = "solution_prefix_normalized_pending_math_review"
        counters["solution_prefix_added"] += 1
        changed = True

    return changed


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    parser.add_argument("--report", required=True)
    args = parser.parse_args()

    root = Path(args.root)
    candidate_files = sorted(root.glob("**/candidate/*.candidate.js"))
    counters = Counter()
    changed_files = []
    errors = []

    for candidate_file in candidate_files:
        try:
            title, questions = load_candidate(candidate_file)
            file_changed = False
            for question in questions:
                file_changed = normalize_question(question, title, counters) or file_changed
            if file_changed:
                write_candidate(candidate_file, title, questions)
                changed_files.append(str(candidate_file))
        except Exception as exc:
            errors.append({"candidateFile": str(candidate_file), "error": str(exc)})

    report = {
        "generatedAt": now_iso(),
        "root": str(root),
        "candidateFileCount": len(candidate_files),
        "changedFileCount": len(changed_files),
        "counters": dict(counters.most_common()),
        "changedFiles": changed_files,
        "errors": errors,
    }
    Path(args.report).write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: report[k] for k in ["candidateFileCount", "changedFileCount"]}, ensure_ascii=False, indent=2))
    print(json.dumps(report["counters"], ensure_ascii=False, indent=2))
    if errors:
        print(json.dumps({"errors": errors}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
