import argparse
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path


DEFAULT_BATCH_ID = "1final_middle_m2_2022_2025"
DEFAULT_BATCH_DIR = Path("archive/_generated/past-exams/_batch")

V2_EXTERNAL_STATUS = "external_agent_required"
V2_ALLOWED_BLANK_ANSWER_STATUSES = {V2_EXTERNAL_STATUS, "not_in_pipeline", "pending_external_agent"}
V2_ALLOWED_BLANK_SOLUTION_STATUSES = {V2_EXTERNAL_STATUS, "not_in_pipeline", "pending_external_agent"}
PLACEHOLDER_RE = re.compile(
    r"Source\s+question\b.*\bunresolved|\[\s*판독불가\s*\]|dummy\s+question|placeholder|truncated\s+summary|요약문만|조건을\s*생략|추측\s*복원",
    re.IGNORECASE,
)
SUBUNIT_REQUIRED_FIELDS = (
    "subUnitKey",
    "subUnit",
    "subUnitConfidence",
    "subUnitClassificationDepth",
)
SUBUNIT_CONFIDENCE_VALUES = {
    "existing_preserved",
    "candidate_evidence",
    "category_or_cue_inferred",
    "rule_inferred",
}
SUBUNIT_DEPTH_VALUES = {
    "complete_candidate",
    "complete_category",
    "complete_documented",
    "complete_rule",
}

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


def sha256_file(path):
    return "sha256:" + hashlib.sha256(Path(path).read_bytes()).hexdigest()


def candidate_reports_dir(candidate_file):
    root = candidate_root_for(candidate_file)
    return root / "reports"


def read_report(reports_dir, name):
    path = reports_dir / name
    if not path.exists():
        return None, ""
    try:
        return read_json(path), sha256_file(path)
    except Exception:
        return None, sha256_file(path)


def source_identity(question):
    document_sha = str(question.get("sourceDocumentSha256") or "").strip()
    question_no = str(question.get("sourceQuestionNo") or "").strip()
    page_no = question.get("sourcePageNo", question.get("pageNo"))
    if not document_sha or not question_no or not isinstance(page_no, int) or page_no < 1:
        return None
    if not document_sha.startswith("sha256:"):
        document_sha = "sha256:" + document_sha
    key = str(question.get("sourceIdentityKey") or f"{document_sha}|{question_no}")
    if key != f"{document_sha}|{question_no}":
        return None
    evidence_paths = question.get("sourcePageEvidencePaths") or []
    if not isinstance(evidence_paths, list) or not evidence_paths or not all(str(value).strip() for value in evidence_paths):
        return None
    source_evidence_path = str(question.get("sourceEvidencePath") or evidence_paths[0]).strip()
    if source_evidence_path not in {str(value).strip() for value in evidence_paths}:
        return None
    return {
        "sourceIdentityKey": key,
        "sourceDocumentSha256": document_sha,
        "sourceQuestionNo": question_no,
        "sourcePageNo": page_no,
        "sourcePageEvidencePaths": sorted(set(str(value).strip() for value in evidence_paths)),
        "sourceEvidencePath": source_evidence_path,
    }


def validate_source_evidence(candidate_file, questions):
    reports_dir = candidate_reports_dir(candidate_file)
    inventory, inventory_sha = read_report(reports_dir, "source_inventory.json")
    identity_map, identity_map_sha = read_report(reports_dir, "source_identity_map.json")
    result = {
        "status": "MISSING",
        "sourceInventorySha": inventory_sha,
        "sourceIdentityMapSha": identity_map_sha,
        "issues": [],
        "sourceFidelitySha": "",
        "mathReviewSha": "",
        "assetProvenanceSha": "",
    }
    if not inventory or inventory.get("schema") != "PAST_EXAM_SOURCE_INVENTORY_v1":
        result["issues"].append("SOURCE_INVENTORY_REQUIRED")
        return result
    if not identity_map or identity_map.get("schema") != "PAST_EXAM_SOURCE_IDENTITY_MAP_v1":
        result["issues"].append("SOURCE_IDENTITY_MAP_REQUIRED")
        return result
    expected = sorted(row.get("sourceIdentityKey") for row in inventory.get("questions", []) if row.get("disposition") != "EXCLUDED_WITH_EVIDENCE")
    if inventory.get("status") != "SOURCE_INVENTORY_FROZEN":
        result["issues"].append("SOURCE_INVENTORY_NOT_FROZEN")
    if identity_map.get("sourceInventorySha") != inventory_sha:
        result["issues"].append("SOURCE_IDENTITY_MAP_INVENTORY_STALE")
    inventory_keys = sorted(str(row.get("sourceIdentityKey") or "") for row in inventory.get("questions", []))
    map_keys = sorted(str(row.get("sourceIdentityKey") or "") for row in identity_map.get("questions", []))
    if inventory_keys != map_keys:
        result["issues"].append("SOURCE_IDENTITY_MAP_PARITY_FAIL")
    if sorted(str(key) for key in identity_map.get("includedIdentitySet", [])) != expected:
        result["issues"].append("SOURCE_IDENTITY_MAP_INCLUDED_SET_FAIL")
    actual = []
    inventory_by_key = {str(row.get("sourceIdentityKey")): row for row in inventory.get("questions", [])}
    for question in questions:
        identity = source_identity(question)
        if not identity:
            result["issues"].append(f"SOURCE_IDENTITY_MISSING:q{question.get('id')}")
        else:
            actual.append(identity["sourceIdentityKey"])
            source_row = inventory_by_key.get(identity["sourceIdentityKey"])
            if source_row:
                expected_paths = sorted(set(str(value).strip() for value in source_row.get("sourcePageEvidencePaths") or []))
                if source_row.get("sourceDocumentSha256") != identity["sourceDocumentSha256"] or str(source_row.get("sourceQuestionNo")) != identity["sourceQuestionNo"] or int(source_row.get("sourcePageNo", 0)) != identity["sourcePageNo"] or str(source_row.get("sourceEvidencePath") or (expected_paths[0] if expected_paths else "")) != identity["sourceEvidencePath"] or expected_paths != identity["sourcePageEvidencePaths"]:
                    result["issues"].append(f"SOURCE_IDENTITY_BINDING_FAIL:q{question.get('id')}")
    actual = sorted(actual)
    if actual != expected:
        result["issues"].append("SOURCE_INVENTORY_COVERAGE_FAIL")

    fidelity, fidelity_sha = read_report(reports_dir, "source_fidelity_evidence.json")
    math_review, math_sha = read_report(reports_dir, "math_review_evidence.json")
    asset, asset_sha = read_report(reports_dir, "asset_provenance_evidence.json")
    result["sourceFidelitySha"] = fidelity_sha
    result["mathReviewSha"] = math_sha
    result["assetProvenanceSha"] = asset_sha
    result["sourceFidelityStatus"] = fidelity.get("status") if fidelity else "MISSING"
    result["mathReviewStatus"] = math_review.get("status") if math_review else "MISSING"
    result["assetProvenanceStatus"] = asset.get("status") if asset else "MISSING"
    result["status"] = "PASS" if not result["issues"] else "FAIL"
    asset_applicable = any(bool(question.get("image") or question.get("visualAsset") or question.get("hasVisualAsset")) for question in questions)
    result["finalEvidencePass"] = all([
        fidelity and fidelity.get("status") == "PASS",
        math_review and math_review.get("status") == "PASS",
        asset and asset.get("status") in {"PASS", "NOT_APPLICABLE"},
        asset_applicable is False or (asset and asset.get("status") == "PASS"),
    ])
    return result


def serialization_issues(questions):
    issues = []
    for question in questions:
        values = [question.get("content"), question.get("answer"), question.get("solution")]
        values.extend(question.get("choices") or [])
        for value in values:
            if not isinstance(value, str):
                continue
            if re.search(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", value):
                issues.append(f"SERIALIZATION_FAIL:q{question.get('id')}:CONTROL_CHARACTER")
            if value.count("$") % 2:
                issues.append(f"SERIALIZATION_FAIL:q{question.get('id')}:ODD_MATH_DELIMITER")
            if re.search(r"(?<!\\)\\(?:pi|sqrt|neq|not)\b", value):
                issues.append(f"SERIALIZATION_FAIL:q{question.get('id')}:LATEX_ESCAPE")
            if PLACEHOLDER_RE.search(value):
                issues.append(f"PLACEHOLDER_PAYLOAD:q{question.get('id')}")
    return sorted(set(issues))


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
    missing_subunit_metadata = []
    invalid_subunit_metadata = []
    objective_choice_mismatches = []
    display_numbers = [str(q.get("displayNo")) for q in questions]
    expected_display_numbers = [str(q.get("sourceQuestionNo")) for q in questions] if all(q.get("sourceQuestionNo") for q in questions) else [str(i) for i in range(1, expected + 1)]

    if title != exam_id:
        issues.append("exam_title_mismatch")
    if len(questions) != expected:
        issues.append("question_count_mismatch")
    if display_numbers != expected_display_numbers:
        issues.append("display_no_sequence_mismatch")

    for q in questions:
        display_no = q.get("displayNo")

        missing_fields = [key for key in SUBUNIT_REQUIRED_FIELDS if not str(q.get(key) or "").strip()]
        if missing_fields:
            missing_subunit_metadata.append({"displayNo": display_no, "fields": missing_fields})
        if str(q.get("subUnitConfidence") or "") not in SUBUNIT_CONFIDENCE_VALUES:
            invalid_subunit_metadata.append({"displayNo": display_no, "field": "subUnitConfidence", "value": q.get("subUnitConfidence")})
        if str(q.get("subUnitClassificationDepth") or "") not in SUBUNIT_DEPTH_VALUES:
            invalid_subunit_metadata.append({"displayNo": display_no, "field": "subUnitClassificationDepth", "value": q.get("subUnitClassificationDepth")})

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
        if PLACEHOLDER_RE.search(str(q.get("content") or "")) or any(PLACEHOLDER_RE.search(str(value)) for value in q.get("choices") or []):
            issues.append(f"placeholder_payload:q{display_no}")
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
    if missing_subunit_metadata:
        issues.append("missing_subunit_metadata")
    if invalid_subunit_metadata:
        issues.append("invalid_subunit_metadata")
    if objective_choice_mismatches:
        issues.append("objective_choice_count_mismatch")

    serialization_errors = serialization_issues(questions)
    if serialization_errors:
        issues.append("SERIALIZATION_FAIL")
    source_evidence = validate_source_evidence(candidate_file, questions)

    extraction_status = "EXTRACTION_VALIDATED" if not issues and source_evidence.get("status") == "PASS" else "NEEDS_WORK"
    # Python owns extraction/package structure only. The JS hardening validator
    # is the single authority for PRE_PROMOTION_VALIDATED after item-level
    # fidelity, math, asset, handoff, and closure checks.
    pre_promotion_status = "BLOCKED"
    status = extraction_status
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
        "missingSubunitMetadata": missing_subunit_metadata,
        "invalidSubunitMetadata": invalid_subunit_metadata,
        "objectiveChoiceCountMismatches": objective_choice_mismatches,
        "serializationIssues": serialization_errors,
        "sourceEvidence": source_evidence,
        "extractionStatus": extraction_status,
        "prePromotionStatus": pre_promotion_status,
        "compatibility": {
            "final_validation_passed": False,
            "statusMeaning": "Python validates extraction structure only; PRE_PROMOTION_VALIDATED is emitted exclusively by the JS hardening validator",
        },
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
        "extractionValidatedCount": sum(1 for r in reports if r["status"] in {"EXTRACTION_VALIDATED", "PRE_PROMOTION_VALIDATED"}),
        "prePromotionValidatedCount": sum(1 for r in reports if r["status"] == "PRE_PROMOTION_VALIDATED"),
        "passedCount": sum(1 for r in reports if r["status"] == "PRE_PROMOTION_VALIDATED"),
        "needsWorkCount": sum(1 for r in reports if r["status"] not in {"EXTRACTION_VALIDATED", "PRE_PROMOTION_VALIDATED"}),
        "missingContentCount": sum(len(r["missingContent"]) for r in reports),
        "visionRequiredContentOrChoicesCount": sum(len(r["visionRequiredContentOrChoices"]) for r in reports),
        "missingAnswerCount": sum(len(r["missingAnswer"]) for r in reports),
        "missingRequiredSolutionCount": sum(len(r["missingRequiredSolution"]) for r in reports),
        "missingSubunitMetadataCount": sum(len(r["missingSubunitMetadata"]) for r in reports),
        "invalidSubunitMetadataCount": sum(len(r["invalidSubunitMetadata"]) for r in reports),
        "missingImageCount": sum(len(r["missingVisualAssetImageFiles"]) for r in reports),
        "forbiddenCandidateImagePathCount": sum(len(r["forbiddenCandidateImagePaths"]) for r in reports),
        "objectiveChoiceMismatchCount": sum(len(r["objectiveChoiceCountMismatches"]) for r in reports),
        "protectedArchiveTouched": False,
        "policy": "V2 extraction validation: fullPageImagePath/cropPath are not image fallbacks; external answer/solution blanks are not failures.",
        "status": "EXTRACTION_VALIDATED"
        if reports and all(r["status"] == "EXTRACTION_VALIDATED" for r in reports)
        else "NEEDS_WORK",
        "items": reports,
    }
    write_json(validation_path, batch)
    print(json.dumps(batch, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
