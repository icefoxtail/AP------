"""Fail-closed candidate artifact contract for the universal variant lane."""

from __future__ import annotations

import copy
import re
from typing import Any

from .solution_quality import infer_solution_visual_requirement, normalize_solution_detail
from .variant_proof import validate_variant_proof_sidecar
from .visual_renderer import render_visual_spec


UNIVERSAL_CANDIDATE_SCHEMA_VERSION = "0.1.0"
_FORBIDDEN_STUDENT_KEYS = {
    "answer",
    "canonicalAnswer",
    "displayAnswer",
    "answerContract",
    "solution",
    "sourceAnswerContract",
    "privateTransformationData",
    "variantProof",
}
_ARCHIVE_METADATA_FIELDS = (
    "level",
    "category",
    "originalCategory",
    "standardCourse",
    "standardUnitKey",
    "standardUnit",
    "standardUnitOrder",
    "subUnitKey",
    "subUnit",
    "subUnitConfidence",
    "subUnitClassificationDepth",
    "questionType",
    "layoutTag",
    "tags",
    "wide",
)


class UniversalCandidateError(ValueError):
    pass


_CHOICE_LABEL_PREFIX = re.compile(r"^\s*(?:[①②③④⑤]|\(?[1-5]\)?\s*[.)])")


def _contains_forbidden_key(value: Any) -> str | None:
    if isinstance(value, dict):
        for key, nested in value.items():
            if key in _FORBIDDEN_STUDENT_KEYS:
                return key
            found = _contains_forbidden_key(nested)
            if found:
                return found
    elif isinstance(value, list):
        for item in value:
            found = _contains_forbidden_key(item)
            if found:
                return found
    return None


def validate_universal_candidate(candidate: Any) -> dict[str, Any]:
    """Validate and normalize one candidate without solving it again."""

    if not isinstance(candidate, dict):
        raise UniversalCandidateError("universal candidate must be an object")
    if candidate.get("artifactType") != "ALIVE_UNIVERSAL_CANDIDATE":
        raise UniversalCandidateError("universal candidate artifactType is invalid")
    if candidate.get("schemaVersion") != UNIVERSAL_CANDIDATE_SCHEMA_VERSION:
        raise UniversalCandidateError("universal candidate schemaVersion is unsupported")
    for field in ("runId", "sourceQuestionId", "sourceQuestionSha256", "ruleSnapshotSha256"):
        if not isinstance(candidate.get(field), str) or not candidate[field].strip():
            raise UniversalCandidateError(f"candidate.{field} is required")
    plan = candidate.get("variantPlan")
    if not isinstance(plan, dict) or plan.get("declaredClass") not in {"A", "B", "C"}:
        raise UniversalCandidateError("candidate.variantPlan with A/B/C declaredClass is required")
    student = candidate.get("studentPayload")
    if not isinstance(student, dict):
        raise UniversalCandidateError("candidate.studentPayload is required")
    leaked = _contains_forbidden_key(student)
    if leaked:
        raise UniversalCandidateError(f"studentPayload contains proof-only field: {leaked}")
    if not isinstance(student.get("content"), str) or not student["content"].strip():
        raise UniversalCandidateError("studentPayload.content is required")
    if not isinstance(student.get("choices"), list):
        raise UniversalCandidateError("studentPayload.choices must be an array")
    if any(not isinstance(choice, str) for choice in student["choices"]):
        raise UniversalCandidateError("studentPayload.choices must contain strings")
    if any(_CHOICE_LABEL_PREFIX.search(choice) for choice in student["choices"]):
        raise UniversalCandidateError("studentPayload.choices must not contain rendered choice labels")
    if not isinstance(student.get("questionType"), str) or not student["questionType"].strip():
        raise UniversalCandidateError("studentPayload.questionType is required")
    if not isinstance(student.get("layoutTag"), str) or not student["layoutTag"].strip():
        raise UniversalCandidateError("studentPayload.layoutTag is required")
    if not isinstance(student.get("wide"), bool):
        raise UniversalCandidateError("studentPayload.wide must be boolean")

    answer_contract = candidate.get("answerContract")
    if not isinstance(answer_contract, dict) or not isinstance(answer_contract.get("displayAnswer"), str) or not answer_contract["displayAnswer"].strip():
        raise UniversalCandidateError("candidate.answerContract.displayAnswer is required")
    solution = candidate.get("solution")
    if not isinstance(solution, str) or not solution.strip():
        raise UniversalCandidateError("candidate.solution is required")
    preflight = {
        "visualDependency": str(candidate.get("visualDependency") or "NONE"),
        "solutionVisualElements": candidate.get("solutionVisualElements") or {},
    }
    detail = candidate.get("solutionDetail")
    inferred_requirement = infer_solution_visual_requirement(student, solution, preflight, detail if isinstance(detail, dict) else None)
    normalized_detail = normalize_solution_detail(detail, inferred_visual_requirement=inferred_requirement)

    for field in ("visualSpec", "solutionVisualSpec"):
        visual = candidate.get(field)
        if visual is not None:
            if not isinstance(visual, dict):
                raise UniversalCandidateError(f"candidate.{field} must be an object")
            render_visual_spec(copy.deepcopy(visual))
    if inferred_requirement == "MANDATORY" and not isinstance(candidate.get("solutionVisualSpec"), dict):
        raise UniversalCandidateError("mandatory solution visual is missing")

    metadata = candidate.get("archiveMetadata")
    if not isinstance(metadata, dict):
        raise UniversalCandidateError("candidate.archiveMetadata is required")
    missing_metadata = [field for field in _ARCHIVE_METADATA_FIELDS if field not in metadata]
    if missing_metadata:
        raise UniversalCandidateError(f"candidate.archiveMetadata missing: {missing_metadata}")
    if not isinstance(metadata["standardUnitOrder"], int) or not isinstance(metadata["tags"], list) or not isinstance(metadata["wide"], bool):
        raise UniversalCandidateError("candidate.archiveMetadata has invalid types")

    sidecar = candidate.get("variantProof")
    proof_validation = validate_variant_proof_sidecar(sidecar)
    if proof_validation.get("status") != "PASS":
        raise UniversalCandidateError("candidate.variantProof sidecar is invalid")
    result = candidate.get("variantResult")
    if not isinstance(result, dict) or result.get("status") != "PASS" or result.get("verifiedClass") not in {"VERIFIED_A", "VERIFIED_B", "VERIFIED_C"}:
        raise UniversalCandidateError("candidate.variantResult must be a verified PASS result")
    normalized = copy.deepcopy(candidate)
    normalized["solutionDetail"] = normalized_detail
    normalized["visualRequirement"] = inferred_requirement
    normalized["candidateValidation"] = {
        "status": "PASS",
        "studentProofBoundary": "PASS",
        "solutionDetail": "PASS",
        "visualSpec": "PASS" if candidate.get("visualSpec") is not None else "NOT_APPLICABLE",
        "solutionVisualSpec": "PASS" if candidate.get("solutionVisualSpec") is not None else "NOT_APPLICABLE",
        "variantProof": "PASS",
    }
    return normalized


__all__ = [
    "UNIVERSAL_CANDIDATE_SCHEMA_VERSION",
    "UniversalCandidateError",
    "validate_universal_candidate",
]
