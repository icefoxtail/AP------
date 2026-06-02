import argparse
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


REQUIRED_FIELDS = [
    "id",
    "level",
    "category",
    "originalCategory",
    "standardCourse",
    "standardUnitKey",
    "standardUnit",
    "standardUnitOrder",
    "content",
    "choices",
    "answer",
    "solution",
    "questionType",
    "layoutTag",
    "tags",
    "wide",
]

POLLUTION_PATTERNS = [
    "cite:",
    "ChatGPT",
    "Gemini",
    "검토 결과",
    "문항 answer 기준",
    "문항 기준",
    "정답 오류지만",
    "수정함",
]

PLACEHOLDER_PATTERNS = [
    "full page",
    "image fallback",
    "OCR",
    "수동",
    "확인 필요",
    "문항 이미지",
    "본문 입력",
]

ANSWER_PLACEHOLDER_PATTERNS = [
    "answer unavailable",
    "unavailable",
    "unresolved",
    "pending",
    "확인 필요",
    "판독불가",
    "직접 풀이 필요",
]

SOLUTION_PLACEHOLDER_PATTERNS = [
    "solution unavailable",
    "unavailable",
    "unresolved",
    "pending",
    "확인 필요",
    "판독불가",
    "직접 풀이 필요",
]

MULTI_ANSWER_MARKERS = [
    "모두 고르",
    "모두 골",
    "옳은 것을 모두",
    "옳은 것만",
    "해당하는 것을 모두",
    "정답 2개",
    "정답 두 개",
    "두 개를 고르",
    "복수정답",
]

CHOICE_SYMBOL_RE = re.compile(r"[①②③④⑤]")
VALID_LEVELS = {"하", "중", "상"}
KEYPOINT_PREFIX = "[키포인트]"


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def load_candidate(path):
    source = Path(path).read_text(encoding="utf-8")
    title_match = re.search(r"window\.examTitle\s*=\s*(.*?);\s*window\.questionBank", source, re.S)
    bank_match = re.search(r"window\.questionBank\s*=\s*(\[.*\]);\s*$", source, re.S)
    if not title_match or not bank_match:
        raise ValueError(f"Cannot parse candidate JS: {path}")
    return json.loads(title_match.group(1)), json.loads(bank_match.group(1))


def has_text(value):
    return bool(str(value or "").strip())


def contains_any(text, patterns):
    lowered = str(text or "").lower()
    return any(pattern.lower() in lowered for pattern in patterns)


def is_objective(question):
    choices = question.get("choices")
    qtype = str(question.get("questionType") or "")
    answer = str(question.get("answer") or "")
    return (
        (isinstance(choices, list) and len(choices) > 0)
        or qtype in {"객관식", "objective", "multiple_choice"}
        or bool(CHOICE_SYMBOL_RE.search(answer))
    )


def answer_choices(answer):
    return CHOICE_SYMBOL_RE.findall(str(answer or ""))


def allows_multiple_answer(question):
    content = str(question.get("content") or "")
    tags = question.get("tags") if isinstance(question.get("tags"), list) else []
    tag_text = " ".join(str(tag) for tag in tags)
    return contains_any(content, MULTI_ANSWER_MARKERS) or "복수정답" in tag_text


def image_exists(question):
    image = question.get("image") or question.get("fullPageImagePath") or question.get("cropPath")
    if not image:
        return True
    return Path(image).exists()


def full_page_exists(question):
    image = question.get("fullPageImagePath")
    if not image:
        return False
    return Path(image).exists()


def expected_question_count(candidate_file):
    manifest = Path(candidate_file).parent.parent / "manifest.json"
    if not manifest.exists():
        return None
    try:
        data = json.loads(manifest.read_text(encoding="utf-8"))
        value = data.get("expectedQuestionCount")
        return int(value) if value else None
    except Exception:
        return None


def display_no_sequence_issues(questions, expected_count=None):
    raw = [q.get("displayNo") for q in questions]
    values = []
    invalid = []
    for index, value in enumerate(raw, start=1):
        try:
            values.append(int(str(value).strip()))
        except Exception:
            invalid.append({"index": index, "displayNo": value})
    issues = []
    if invalid:
        issues.append({"issue": "display_no_invalid", "detail": invalid})
    if values != sorted(values):
        issues.append({"issue": "display_no_order_mismatch", "detail": {"actual": raw}})
    duplicates = sorted({value for value in values if values.count(value) > 1})
    if duplicates:
        issues.append({"issue": "display_no_duplicate", "detail": {"duplicates": duplicates}})
    expected = list(range(1, (expected_count or len(questions)) + 1))
    if values != expected:
        missing = [value for value in expected if value not in values]
        extra = [value for value in values if value not in expected]
        issues.append({
            "issue": "display_no_sequence_mismatch",
            "detail": {"actual": raw, "expected": expected, "missing": missing, "extra": extra},
        })
    return issues


def review_file(candidate_file):
    title, questions = load_candidate(candidate_file)
    stage1_items = []
    stage2_items = []
    stage3_items = []
    final_items = []

    ids = [q.get("id") for q in questions]
    expected_ids = list(range(1, len(questions) + 1))
    if ids != expected_ids:
        stage1_items.append({
            "displayNo": "file",
            "issue": "id_sequence_mismatch",
            "detail": {"actual": ids, "expected": expected_ids},
        })

    expected_count = expected_question_count(candidate_file)
    if expected_count is not None and len(questions) != expected_count:
        stage1_items.append({
            "displayNo": "file",
            "issue": "expected_question_count_mismatch",
            "detail": {"actual": len(questions), "expected": expected_count},
        })
    for issue in display_no_sequence_issues(questions, expected_count):
        stage1_items.append({"displayNo": "file", **issue})

    for index, q in enumerate(questions, start=1):
        display_no = q.get("displayNo", index)
        missing_fields = [field for field in REQUIRED_FIELDS if field not in q]
        if missing_fields:
            stage1_items.append({"displayNo": display_no, "issue": "missing_required_fields", "fields": missing_fields})

        content = str(q.get("content") or "")
        solution = str(q.get("solution") or "")
        choices = q.get("choices")
        answer = str(q.get("answer") or "")

        if not has_text(content) or contains_any(content, PLACEHOLDER_PATTERNS):
            stage1_items.append({"displayNo": display_no, "issue": "content_missing_or_placeholder"})
        if is_objective(q) and (not isinstance(choices, list) or len(choices) != 5):
            stage1_items.append({"displayNo": display_no, "issue": "objective_choices_not_5"})
        if not has_text(answer):
            stage1_items.append({"displayNo": display_no, "issue": "answer_missing"})
        elif contains_any(answer, ANSWER_PLACEHOLDER_PATTERNS):
            stage1_items.append({"displayNo": display_no, "issue": "answer_placeholder"})
        if not has_text(solution):
            stage1_items.append({"displayNo": display_no, "issue": "solution_missing"})
        elif contains_any(solution, SOLUTION_PLACEHOLDER_PATTERNS):
            stage1_items.append({"displayNo": display_no, "issue": "solution_placeholder"})
        if contains_any(content + "\n" + solution + "\n" + answer, POLLUTION_PATTERNS):
            stage1_items.append({"displayNo": display_no, "issue": "pollution_marker"})
        if not image_exists(q):
            stage1_items.append({"displayNo": display_no, "issue": "image_path_missing"})
        if not full_page_exists(q):
            stage1_items.append({"displayNo": display_no, "issue": "full_page_image_missing"})

        if is_objective(q):
            selected = answer_choices(answer)
            multi_allowed = allows_multiple_answer(q)
            if len(selected) == 0 and has_text(answer):
                stage2_items.append({"displayNo": display_no, "issue": "objective_answer_not_choice_symbol"})
            if len(selected) > 1 and not multi_allowed:
                stage2_items.append({"displayNo": display_no, "issue": "multiple_answer_without_prompt_marker", "answer": answer})
            if len(selected) > 1 and multi_allowed:
                tags = q.get("tags") if isinstance(q.get("tags"), list) else []
                if "복수정답" not in tags:
                    stage3_items.append({"displayNo": display_no, "issue": "multiple_answer_tag_recommended"})

        if has_text(answer) and has_text(solution):
            selected = answer_choices(answer)
            solution_choices = answer_choices(solution)
            if selected and solution_choices and not any(choice in solution_choices for choice in selected):
                stage2_items.append({"displayNo": display_no, "issue": "solution_conclusion_may_not_match_answer"})
        if has_text(solution) and not solution.startswith(KEYPOINT_PREFIX):
            stage1_items.append({"displayNo": display_no, "issue": "solution_missing_keypoint_prefix"})

        if not has_text(q.get("standardCourse")) or not has_text(q.get("standardUnit")):
            stage3_items.append({"displayNo": display_no, "issue": "metadata_missing_course_or_unit"})
        if str(q.get("level") or "") not in VALID_LEVELS:
            stage3_items.append({"displayNo": display_no, "issue": "level_invalid_or_missing"})
        if not isinstance(q.get("tags"), list):
            stage3_items.append({"displayNo": display_no, "issue": "tags_not_array"})

    stage1_status = "PASS" if not stage1_items else "FAIL"
    if stage1_status == "FAIL":
        stage2_status = "BLOCKED"
    elif stage2_items:
        stage2_status = "FAIL"
    else:
        stage2_status = "REQUIRES_DIRECT_SOLVE_REVIEW"
    stage3_status = "BLOCKED" if stage1_status == "FAIL" else ("WARN" if stage3_items else "PASS")
    final_status = "PASS" if stage1_status == "PASS" and stage2_status == "PASS" and stage3_status in {"PASS", "WARN"} else "FAIL"
    if stage2_status == "REQUIRES_DIRECT_SOLVE_REVIEW":
        final_items.append({
            "issue": "math_review_required",
            "detail": "2차 수학·정오답 검수는 전 문항 직접 풀이 검수 보고가 있어야 PASS 처리할 수 있습니다.",
        })
        final_status = "FAIL"

    return {
        "examTitle": title,
        "candidateFile": str(candidate_file),
        "questionCount": len(questions),
        "stage1": {"name": "1차 구조·무결성 검수", "status": stage1_status, "issues": stage1_items},
        "stage2": {"name": "2차 수학·정오답 검수", "status": stage2_status, "issues": stage2_items},
        "stage3": {"name": "3차 분류·메타·난이도 태그 검수", "status": stage3_status, "issues": stage3_items},
        "finalIntegrity": {"name": "최종 무결성 검수", "status": final_status, "issues": final_items},
        "promotionReady": final_status == "PASS",
    }


def issue_counts(reports, stage):
    counter = Counter()
    for report in reports:
        for item in report[stage]["issues"]:
            counter[item["issue"]] += 1
    return dict(counter.most_common())


def write_markdown(path, summary):
    lines = [
        "# Final Review Pipeline Summary",
        "",
        f"- generatedAt: {summary['generatedAt']}",
        f"- candidateFileCount: {summary['candidateFileCount']}",
        f"- parseErrorCount: {summary['parseErrorCount']}",
        f"- promotionReadyCount: {summary['promotionReadyCount']}",
        f"- blockedCount: {summary['blockedCount']}",
        "",
        "## Issue Counts",
        "",
    ]
    for stage in ["stage1IssueCounts", "stage2IssueCounts", "stage3IssueCounts"]:
        lines.append(f"### {stage}")
        for issue, count in summary[stage].items():
            lines.append(f"- {issue}: {count}")
        lines.append("")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True, help="Root containing candidate JS files")
    parser.add_argument("--out", required=True, help="Output review summary JSON")
    parser.add_argument("--markdown-out", help="Optional output markdown report")
    args = parser.parse_args()

    root = Path(args.root)
    candidate_files = sorted(root.glob("**/candidate/*.candidate.js"))
    reports = []
    parse_errors = []
    for candidate_file in candidate_files:
        try:
            reports.append(review_file(candidate_file))
        except Exception as exc:
            parse_errors.append({"candidateFile": str(candidate_file), "error": str(exc)})

    summary = {
        "generatedAt": now_iso(),
        "root": str(root),
        "candidateFileCount": len(candidate_files),
        "parseErrorCount": len(parse_errors),
        "promotionReadyCount": sum(1 for report in reports if report["promotionReady"]),
        "blockedCount": sum(1 for report in reports if not report["promotionReady"]),
        "stage1FailCount": sum(1 for report in reports if report["stage1"]["status"] == "FAIL"),
        "stage2BlockedOrReviewCount": sum(1 for report in reports if report["stage2"]["status"] in {"BLOCKED", "REQUIRES_DIRECT_SOLVE_REVIEW"}),
        "stage3BlockedOrWarnCount": sum(1 for report in reports if report["stage3"]["status"] in {"BLOCKED", "WARN"}),
        "multipleAnswerWithoutPromptCount": sum(
            1
            for report in reports
            for item in report["stage2"]["issues"]
            if item["issue"] == "multiple_answer_without_prompt_marker"
        ),
        "stage1IssueCounts": issue_counts(reports, "stage1"),
        "stage2IssueCounts": issue_counts(reports, "stage2"),
        "stage3IssueCounts": issue_counts(reports, "stage3"),
        "parseErrors": parse_errors,
        "reports": reports,
    }
    out = Path(args.out)
    write_json(out, summary)
    if args.markdown_out:
        write_markdown(Path(args.markdown_out), summary)
    else:
        write_markdown(out.with_suffix(".md"), summary)
    print(json.dumps({
        "candidateFileCount": summary["candidateFileCount"],
        "promotionReadyCount": summary["promotionReadyCount"],
        "blockedCount": summary["blockedCount"],
        "parseErrorCount": summary["parseErrorCount"],
        "stage1FailCount": summary["stage1FailCount"],
        "multipleAnswerWithoutPromptCount": summary["multipleAnswerWithoutPromptCount"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
