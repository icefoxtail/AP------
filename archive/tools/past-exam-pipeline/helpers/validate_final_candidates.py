import json
import re
from datetime import datetime, timezone
from pathlib import Path


BATCH_ID = "1final_middle_m2_2022_2025"
BATCH_DIR = Path("archive/_generated/past-exams/_batch")
SUMMARY_PATH = BATCH_DIR / f"candidate_generation_summary_{BATCH_ID}.json"
VALIDATION_PATH = BATCH_DIR / f"final_validation_summary_{BATCH_ID}.json"


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


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


def is_solution_required(question):
    policy = str(question.get("solutionPolicy") or "")
    status = str(question.get("solutionStatus") or "")
    return (
        policy in {"required", "required_when_answer_known"}
        or status
        in {
            "direct_solution_pending_review",
            "solution_unresolved_after_direct_solve",
            "required_missing_solution",
        }
    )


def is_objective_question(question):
    source_label = str(question.get("sourceDisplayNoLabel") or question.get("sourceQuestionNo") or "")
    objective_cutoff = int(question.get("objectiveCutoff", 9999))
    if source_label.isdigit() and int(source_label) <= objective_cutoff:
        return True
    return str(question.get("questionType") or "") in {"objective", "객관식", "multiple_choice"}


def validate_exam(row):
    exam_id = row["examId"]
    candidate_file = row["candidateFile"]
    title, questions = load_candidate(candidate_file)
    expected = int(row["expectedQuestionCount"])
    issues = []
    missing_images = []
    missing_content = []
    missing_answers = []
    missing_solutions = []
    objective_choice_mismatches = []
    display_numbers = [q.get("displayNo") for q in questions]

    if title != exam_id:
        issues.append("exam_title_mismatch")
    if len(questions) != expected:
        issues.append("question_count_mismatch")
    if display_numbers != list(range(1, expected + 1)):
        issues.append("display_no_sequence_mismatch")

    for q in questions:
        display_no = q.get("displayNo")
        image = q.get("image") or q.get("fullPageImagePath") or q.get("cropPath")
        if not image or not Path(image).exists():
            missing_images.append(display_no)
        if not str(q.get("content") or "").strip():
            missing_content.append(display_no)

        answer = str(q.get("answer") or "").strip()
        answer_status = str(q.get("answerStatus") or "")
        if not answer or answer_status in {"missing_answer", ""}:
            missing_answers.append(display_no)

        solution = str(q.get("solution") or "").strip()
        solution_status = str(q.get("solutionStatus") or "")
        if is_solution_required(q) and (
            not solution or solution_status in {"missing_solution", "required_missing_solution", ""}
        ):
            missing_solutions.append(display_no)

        if is_objective_question(q):
            choices = q.get("choices")
            if not isinstance(choices, list) or len(choices) != 5:
                objective_choice_mismatches.append(display_no)

    if missing_images:
        issues.append("missing_image_files")
    if missing_content:
        issues.append("missing_content")
    if missing_answers:
        issues.append("missing_answers")
    if missing_solutions:
        issues.append("missing_required_solutions")
    if objective_choice_mismatches:
        issues.append("objective_choice_count_mismatch")

    status = "final_validation_passed" if not issues else "needs_work"
    report = {
        "examId": exam_id,
        "generatedAt": now_iso(),
        "candidateFile": candidate_file,
        "questionCount": len(questions),
        "expectedQuestionCount": expected,
        "missingImageFiles": missing_images,
        "missingContent": missing_content,
        "missingAnswer": missing_answers,
        "missingRequiredSolution": missing_solutions,
        "objectiveChoiceCountMismatches": objective_choice_mismatches,
        "issues": issues,
        "protectedArchiveTouched": False,
        "status": status,
    }
    report_path = Path(candidate_file).parents[1] / "reports" / "final_validation_report.json"
    write_json(report_path, report)
    return report


def main():
    summary = read_json(SUMMARY_PATH)
    reports = [validate_exam(row) for row in summary["items"]]
    batch = {
        "generatedAt": now_iso(),
        "batchId": BATCH_ID,
        "jobCount": len(reports),
        "passedCount": sum(1 for r in reports if r["status"] == "final_validation_passed"),
        "needsWorkCount": sum(1 for r in reports if r["status"] != "final_validation_passed"),
        "missingContentCount": sum(len(r["missingContent"]) for r in reports),
        "missingAnswerCount": sum(len(r["missingAnswer"]) for r in reports),
        "missingRequiredSolutionCount": sum(len(r["missingRequiredSolution"]) for r in reports),
        "missingImageCount": sum(len(r["missingImageFiles"]) for r in reports),
        "objectiveChoiceMismatchCount": sum(len(r["objectiveChoiceCountMismatches"]) for r in reports),
        "protectedArchiveTouched": False,
        "status": "final_validation_passed"
        if all(r["status"] == "final_validation_passed" for r in reports)
        else "needs_work",
        "items": reports,
    }
    write_json(VALIDATION_PATH, batch)
    print(json.dumps(batch, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
