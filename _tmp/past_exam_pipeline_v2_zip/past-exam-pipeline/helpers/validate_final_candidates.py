import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path


DEFAULT_BATCH_ID = "1final_middle_m2_2022_2025"
DEFAULT_BATCH_DIR = Path("archive/_generated/past-exams/_batch")

V2_EXTERNAL_STATUS = "external_agent_required"
V2_ALLOWED_BLANK_ANSWER_STATUSES = {V2_EXTERNAL_STATUS, "not_in_pipeline", "pending_external_agent"}
V2_ALLOWED_BLANK_SOLUTION_STATUSES = {V2_EXTERNAL_STATUS, "not_in_pipeline", "pending_external_agent"}

FORBIDDEN_IMAGE_FRAGMENTS = [
    "pages/",
    "crops/questions",
    "crops/debug_questions",
    "debug_questions",
    "page_p",
]


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def write_json(path, data):
    path = Path(path)
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
    if status in V2_ALLOWED_BLANK_SOLUTION_STATUSES:
        return False
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
    source_label = str(question.get("sourceDisplayNoLabel") or question.get("sourceQuestionNo") or question.get("displayNo") or "")
    objective_cutoff = int(question.get("objectiveCutoff", 9999))
    if source_label.isdigit() and int(source_label) <= objective_cutoff:
        return True
    return str(question.get("questionType") or "") in {"objective", "객관식", "multiple_choice"}


def candidate_root_for(candidate_file):
    candidate_file = Path(candidate_file).resolve()
    # V2 output usually uses <examRoot>/candidate/*.candidate.js.
    if candidate_file.parent.name == "candidate":
        return candidate_file.parent.parent
    # Legacy generated candidates sometimes sit under output/ or nested term folders.
    if candidate_file.parent.name in {"output", "candidates"}:
        return candidate_file.parent.parent
    return candidate_file.parent


def resolve_candidate_relative_path(candidate_file, rel):
    if not rel:
        return None
    path = Path(str(rel))
    if path.is_absolute():
        return path
    normalized = str(rel).replace("\\", "/")
    exam_root = candidate_root_for(candidate_file)
    candidate_path = exam_root / normalized
    if candidate_path.exists():
        return candidate_path
    # Legacy archive-style asset paths can be rooted above the generated exam dir.
    if normalized.startswith("assets/images/"):
        for parent in Path(candidate_file).resolve().parents:
            maybe = parent / normalized
            if maybe.exists():
                return maybe
    return candidate_path


def image_path_gate(question):
    image = str(question.get("image") or "")
    visual_asset = str(question.get("visualAsset") or "")
    statuses = []
    if not image:
        return statuses
    normalized = image.replace("\\", "/")
    if any(fragment in normalized for fragment in FORBIDDEN_IMAGE_FRAGMENTS):
        statuses.append("image_points_to_page_or_question_crop")
    if question.get("cropPath") and image == str(question.get("cropPath")):
        statuses.append("image_equals_question_crop_path")
    if question.get("fullPageImagePath") and image == str(question.get("fullPageImagePath")):
        statuses.append("image_equals_full_page_path")
    if visual_asset and image != visual_asset:
        statuses.append("image_not_visual_asset")
    return statuses


def has_pending_external_answer(question):
    status = str(question.get("answerStatus") or "")
    source = str(question.get("answerSource") or "")
    return status in V2_ALLOWED_BLANK_ANSWER_STATUSES or source in {"not_in_pipeline", V2_EXTERNAL_STATUS}


def has_pending_external_solution(question):
    status = str(question.get("solutionStatus") or "")
    source = str(question.get("solutionSource") or "")
    return status in V2_ALLOWED_BLANK_SOLUTION_STATUSES or source in {"not_in_pipeline", V2_EXTERNAL_STATUS}


def validate_exam(row):
    exam_id = row["examId"]
    candidate_file = Path(row["candidateFile"])
    title, questions = load_candidate(candidate_file)
    expected = int(row.get("expectedQuestionCount") or len(questions))
    issues = []
    missing_images = []
    forbidden_images = []
    missing_content = []
    content_source_required = []
    missing_answers = []
    missing_solutions = []
    objective_choice_mismatches = []
    display_numbers = [str(q.get("displayNo")) for q in questions]
    expected_display_numbers = [str(i) for i in range(1, expected + 1)]

    if title != exam_id:
        issues.append("exam_title_mismatch")
    if len(questions) != expected:
        issues.append("question_count_mismatch")
    if display_numbers != expected_display_numbers:
        issues.append("display_no_sequence_mismatch")

    for q in questions:
        display_no = q.get("displayNo")

        image = str(q.get("image") or "")
        gate_statuses = image_path_gate(q)
        if gate_statuses:
            forbidden_images.append({"displayNo": display_no, "image": image, "statuses": gate_statuses})
        if image:
            image_path = resolve_candidate_relative_path(candidate_file, image)
            if not image_path or not image_path.exists():
                missing_images.append(display_no)
        # V2 policy: blank image is normal for no-visual questions. Do not fall back to fullPageImagePath/cropPath.
        elif q.get("hasVisualAsset") and str(q.get("visualAssetStatus") or "") == "cropped_from_full_page_bbox":
            missing_images.append(display_no)

        if not str(q.get("content") or "").strip():
            missing_content.append(display_no)
        if str(q.get("contentSource") or "") == "vision_required" or str(q.get("choicesSource") or "") == "vision_required":
            content_source_required.append(display_no)

        answer = str(q.get("answer") or "").strip()
        answer_status = str(q.get("answerStatus") or "")
        if not answer and not has_pending_external_answer(q):
            missing_answers.append(display_no)
        elif answer_status in {"missing_answer", ""} and not has_pending_external_answer(q):
            missing_answers.append(display_no)

        solution = str(q.get("solution") or "").strip()
        solution_status = str(q.get("solutionStatus") or "")
        if is_solution_required(q) and not has_pending_external_solution(q) and (
            not solution or solution_status in {"missing_solution", "required_missing_solution", ""}
        ):
            missing_solutions.append(display_no)

        if is_objective_question(q):
            choices = q.get("choices")
            if not isinstance(choices, list) or len(choices) != 5:
                objective_choice_mismatches.append(display_no)

    if missing_images:
        issues.append("missing_visual_asset_image_files")
    if forbidden_images:
        issues.append("forbidden_candidate_image_path")
    if missing_content:
        issues.append("missing_content")
    if content_source_required:
        issues.append("vision_required_content_or_choices")
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
        "candidateFile": str(candidate_file),
        "questionCount": len(questions),
        "expectedQuestionCount": expected,
        "policy": {
            "version": "past_exam_pipeline_v2_full_page_first",
            "image": "blank is valid for no-visual questions; nonblank image must point only to a visual asset crop",
            "fullPageImagePath": "source evidence only; never used as image fallback",
            "cropPath": "auxiliary/debug evidence only; never used as image fallback",
            "answerSolution": "blank answer/solution with external_agent_required is valid at extraction stage",
            "contentChoices": "contentSource/choicesSource=vision_required remains needs_work; no dummy content allowed",
        },
        "missingVisualAssetImageFiles": missing_images,
        "forbiddenCandidateImagePaths": forbidden_images,
        "missingContent": missing_content,
        "visionRequiredContentOrChoices": content_source_required,
        "missingAnswer": missing_answers,
        "missingRequiredSolution": missing_solutions,
        "objectiveChoiceCountMismatches": objective_choice_mismatches,
        "issues": issues,
        "notFailures": ["blank_image_when_no_visual_asset", "blank_answer_external_agent_required", "blank_solution_external_agent_required"],
        "protectedArchiveTouched": False,
        "status": status,
    }
    report_path = candidate_root_for(candidate_file) / "reports" / "final_validation_report.json"
    write_json(report_path, report)
    return report


def load_summary(batch_id, batch_dir, summary_path):
    if summary_path:
        return read_json(summary_path)
    return read_json(Path(batch_dir) / f"candidate_generation_summary_{batch_id}.json")


def main():
    parser = argparse.ArgumentParser(description="Validate generated candidate JS files. V2-compatible: full-page/cropPath are not image fallbacks, answer/solution may be external_agent_required.")
    parser.add_argument("--summary", default="", help="candidate_generation_summary json path")
    parser.add_argument("--batch-id", default=DEFAULT_BATCH_ID)
    parser.add_argument("--batch-dir", default=str(DEFAULT_BATCH_DIR))
    parser.add_argument("--out", default="", help="final validation summary json path")
    args = parser.parse_args()

    summary = load_summary(args.batch_id, args.batch_dir, args.summary)
    reports = [validate_exam(row) for row in summary["items"]]
    validation_path = Path(args.out) if args.out else Path(args.batch_dir) / f"final_validation_summary_{args.batch_id}.json"
    batch = {
        "generatedAt": now_iso(),
        "batchId": args.batch_id,
        "jobCount": len(reports),
        "passedCount": sum(1 for r in reports if r["status"] == "final_validation_passed"),
        "needsWorkCount": sum(1 for r in reports if r["status"] != "final_validation_passed"),
        "missingContentCount": sum(len(r["missingContent"]) for r in reports),
        "visionRequiredContentOrChoicesCount": sum(len(r["visionRequiredContentOrChoices"]) for r in reports),
        "missingAnswerCount": sum(len(r["missingAnswer"]) for r in reports),
        "missingRequiredSolutionCount": sum(len(r["missingRequiredSolution"]) for r in reports),
        "missingImageCount": sum(len(r["missingVisualAssetImageFiles"]) for r in reports),
        "forbiddenCandidateImagePathCount": sum(len(r["forbiddenCandidateImagePaths"]) for r in reports),
        "objectiveChoiceMismatchCount": sum(len(r["objectiveChoiceCountMismatches"]) for r in reports),
        "protectedArchiveTouched": False,
        "policy": "V2 extraction validation: fullPageImagePath/cropPath are not image fallbacks; external answer/solution blanks are not failures.",
        "status": "final_validation_passed"
        if all(r["status"] == "final_validation_passed" for r in reports)
        else "needs_work",
        "items": reports,
    }
    write_json(validation_path, batch)
    print(json.dumps(batch, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
