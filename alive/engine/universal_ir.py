"""Universal Question IR and StudentIR/ProofIR separation.

This is a transport contract, not a universal solver.  It preserves the
student-visible payload separately from source answers, private transforms,
and verification evidence so independent reviewers can be kept blind to
builder intent.
"""

from __future__ import annotations

import re
from typing import Any

from .solution_graph import SolutionGraphError, normalize_solution_graph


UNIVERSAL_IR_SCHEMA_VERSION = "0.1.0"
CAPABILITY_STATUSES = {"SUPPORTED", "HOLD", "UNSUPPORTED", "PENDING"}
_SHA256_RE = re.compile(r"^[0-9a-f]{64}$")


class UniversalIRError(ValueError):
    """Raised when a Universal Question IR is incomplete or unsafe."""


REQUIRED_FIELDS = (
    "schemaVersion",
    "sourceQuestionId",
    "sourceQuestionSha256",
    "ruleSnapshotSha256",
    "curriculum",
    "questionType",
    "structureFamily",
    "concepts",
    "givens",
    "goal",
    "solutionGraph",
    "coreDecisionCount",
    "branchCount",
    "preprocessingStepCount",
    "representation",
    "parameters",
    "mutableParameters",
    "constraints",
    "difficultyVector",
    "allowedMethods",
    "forbiddenMethods",
    "capabilityStatus",
)

STUDENT_IR_FIELDS = (
    "schemaVersion",
    "sourceQuestionId",
    "curriculum",
    "questionType",
    "content",
    "choices",
    "layoutTag",
    "wide",
    "representation",
    "visual",
)

PROOF_IR_FIELDS = (
    "schemaVersion",
    "sourceQuestionId",
    "sourceQuestionSha256",
    "ruleSnapshotSha256",
    "structureFamily",
    "sourceAnswerContract",
    "sourceCalculation",
    "sourceSolutionGraph",
    "parameterConstraints",
    "variantProof",
    "privateTransformationData",
    "allowedMethods",
    "forbiddenMethods",
    "capabilityStatus",
)


def _required_string(value: Any, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise UniversalIRError(f"{field} must be a non-empty string")
    return value.strip()


def _sha256(value: Any, field: str) -> str:
    result = _required_string(value, field).lower()
    if not _SHA256_RE.fullmatch(result):
        raise UniversalIRError(f"{field} must be a lowercase sha256 hex digest")
    return result


def _non_negative_int(value: Any, field: str) -> int:
    if not isinstance(value, int) or isinstance(value, bool) or value < 0:
        raise UniversalIRError(f"{field} must be a non-negative integer")
    return value


def validate_universal_question_ir(value: Any) -> dict[str, Any]:
    """Validate the Phase 0 IR without silently filling missing fields."""

    if not isinstance(value, dict):
        return {"status": "FAIL", "errors": ["UniversalQuestionIR must be an object"]}
    errors: list[str] = []
    missing = [field for field in REQUIRED_FIELDS if field not in value]
    errors.extend(f"missing:{field}" for field in missing)
    if value.get("schemaVersion") != UNIVERSAL_IR_SCHEMA_VERSION:
        errors.append("schemaVersion is unsupported")
    for field in ("sourceQuestionId", "questionType", "structureFamily"):
        if field in value:
            try:
                _required_string(value[field], field)
            except UniversalIRError as error:
                errors.append(str(error))
    for field in ("sourceQuestionSha256", "ruleSnapshotSha256"):
        if field in value:
            try:
                _sha256(value[field], field)
            except UniversalIRError as error:
                errors.append(str(error))
    for field in ("curriculum", "givens", "goal", "representation", "parameters", "constraints", "difficultyVector"):
        if field in value and not isinstance(value[field], dict):
            errors.append(f"{field} must be an object")
    for field in ("concepts", "mutableParameters", "allowedMethods", "forbiddenMethods"):
        if field in value and not isinstance(value[field], list):
            errors.append(f"{field} must be an array")
    for field in ("coreDecisionCount", "branchCount", "preprocessingStepCount"):
        if field in value:
            try:
                _non_negative_int(value[field], field)
            except UniversalIRError as error:
                errors.append(str(error))
    if value.get("capabilityStatus") not in CAPABILITY_STATUSES:
        errors.append("capabilityStatus is unsupported")

    student_payload = value.get("studentPayload")
    if student_payload is not None:
        if not isinstance(student_payload, dict):
            errors.append("studentPayload must be an object")
        else:
            if not isinstance(student_payload.get("content"), str) or not student_payload.get("content", "").strip():
                errors.append("studentPayload.content must be a non-empty string")
            if not isinstance(student_payload.get("choices"), list):
                errors.append("studentPayload.choices must be an array")
            leaked = {"answer", "solution", "canonicalAnswer", "sourceAnswerContract", "privateTransformationData"}.intersection(student_payload)
            if leaked:
                errors.append(f"studentPayload contains proof-only fields: {sorted(leaked)}")

    graph_fingerprint_value: str | None = None
    if "solutionGraph" in value:
        try:
            graph = normalize_solution_graph(value["solutionGraph"])
            graph_fingerprint_value = graph["graphFingerprint"]
        except (SolutionGraphError, TypeError) as error:
            errors.append(f"solutionGraph invalid: {error}")
    return {
        "status": "PASS" if not errors else "FAIL",
        "errors": errors,
        "graphFingerprint": graph_fingerprint_value,
    }


def require_valid_universal_question_ir(value: Any) -> dict[str, Any]:
    report = validate_universal_question_ir(value)
    if report["status"] != "PASS":
        raise UniversalIRError("; ".join(report["errors"]))
    return value


def build_universal_question_ir(
    source_question: dict[str, Any],
    *,
    source_question_sha256: str,
    rule_snapshot_sha256: str,
    structure_family: str,
    solution_graph: Any,
    curriculum: dict[str, Any] | None = None,
    concepts: list[str] | None = None,
    givens: dict[str, Any] | None = None,
    goal: dict[str, Any] | None = None,
    parameters: dict[str, Any] | None = None,
    mutable_parameters: list[str] | None = None,
    constraints: dict[str, Any] | None = None,
    representation: dict[str, Any] | None = None,
    difficulty_vector: dict[str, Any] | None = None,
    allowed_methods: list[str] | None = None,
    forbidden_methods: list[str] | None = None,
    capability_status: str = "HOLD",
) -> dict[str, Any]:
    """Build a strict IR from a source question and explicit analysis output."""

    if not isinstance(source_question, dict):
        raise UniversalIRError("source_question must be an object")
    source_id = source_question.get("sourceQuestionId", source_question.get("id"))
    if source_id is None:
        raise UniversalIRError("source question id is missing")
    student_content = source_question.get("content")
    if not isinstance(student_content, str) or not student_content.strip():
        raise UniversalIRError("source question content is missing")
    choices = source_question.get("choices", [])
    if not isinstance(choices, list):
        raise UniversalIRError("source question choices must be an array")
    visual = {
        key: source_question[key]
        for key in ("visualAsset", "solutionVisualAsset", "visualSpec", "solutionVisualSpec")
        if key in source_question
    }
    try:
        canonical_graph = normalize_solution_graph(solution_graph)
    except SolutionGraphError as error:
        raise UniversalIRError(f"solution_graph is invalid: {error}") from error
    ir: dict[str, Any] = {
        "schemaVersion": UNIVERSAL_IR_SCHEMA_VERSION,
        "sourceQuestionId": str(source_id),
        "sourceQuestionSha256": source_question_sha256.lower(),
        "ruleSnapshotSha256": rule_snapshot_sha256.lower(),
        "curriculum": curriculum or {},
        "questionType": str(source_question.get("questionType") or ""),
        "structureFamily": structure_family,
        "concepts": concepts or [],
        "givens": givens or {},
        "goal": goal or {},
        "solutionGraph": canonical_graph,
        "coreDecisionCount": int(source_question.get("coreDecisionCount", 0)),
        "branchCount": int(source_question.get("branchCount", 0)),
        "preprocessingStepCount": int(source_question.get("preprocessingStepCount", 0)),
        "representation": representation or {
            "layoutTag": source_question.get("layoutTag"),
            "wide": bool(source_question.get("wide", False)),
        },
        "parameters": parameters or {},
        "mutableParameters": mutable_parameters or [],
        "constraints": constraints or {},
        "difficultyVector": difficulty_vector or {},
        "allowedMethods": allowed_methods or [],
        "forbiddenMethods": forbidden_methods or [],
        "capabilityStatus": capability_status,
        "studentPayload": {
            "content": student_content,
            "choices": choices,
            "questionType": source_question.get("questionType"),
            "layoutTag": source_question.get("layoutTag"),
            "wide": bool(source_question.get("wide", False)),
            "visual": visual or None,
        },
        "sourceAnswerContract": {
            "answer": source_question.get("answer"),
            "canonicalAnswer": source_question.get("canonicalAnswer"),
            "answerType": source_question.get("answerType"),
            "equivalencePolicy": source_question.get("equivalencePolicy"),
        },
        "sourceCalculation": source_question.get("computed"),
        "privateTransformationData": {},
    }
    require_valid_universal_question_ir(ir)
    return ir


def split_student_proof_ir(value: Any) -> dict[str, dict[str, Any]]:
    """Split a valid IR and reject accidental answer leakage into StudentIR."""

    ir = require_valid_universal_question_ir(value)
    student_payload = ir.get("studentPayload")
    if not isinstance(student_payload, dict):
        raise UniversalIRError("studentPayload is required to split the IR")
    student = {
        "schemaVersion": UNIVERSAL_IR_SCHEMA_VERSION,
        "sourceQuestionId": ir["sourceQuestionId"],
        "curriculum": ir["curriculum"],
        "questionType": student_payload.get("questionType"),
        "content": student_payload.get("content"),
        "choices": student_payload.get("choices", []),
        "layoutTag": student_payload.get("layoutTag"),
        "wide": student_payload.get("wide", False),
        "representation": ir["representation"],
        "visual": student_payload.get("visual"),
    }
    forbidden_student_keys = {"answer", "solution", "canonicalAnswer", "sourceAnswerContract", "privateTransformationData"}
    if forbidden_student_keys.intersection(student):
        raise UniversalIRError("StudentIR contains proof-only fields")
    proof = {
        "schemaVersion": UNIVERSAL_IR_SCHEMA_VERSION,
        "sourceQuestionId": ir["sourceQuestionId"],
        "sourceQuestionSha256": ir["sourceQuestionSha256"],
        "ruleSnapshotSha256": ir["ruleSnapshotSha256"],
        "structureFamily": ir["structureFamily"],
        "sourceAnswerContract": ir.get("sourceAnswerContract", {}),
        "sourceCalculation": ir.get("sourceCalculation"),
        "sourceSolutionGraph": ir["solutionGraph"],
        "parameterConstraints": ir["constraints"],
        "variantProof": ir.get("variantProof"),
        "privateTransformationData": ir.get("privateTransformationData", {}),
        "allowedMethods": ir["allowedMethods"],
        "forbiddenMethods": ir["forbiddenMethods"],
        "capabilityStatus": ir["capabilityStatus"],
    }
    return {"studentIR": student, "proofIR": proof}


__all__ = [
    "CAPABILITY_STATUSES",
    "PROOF_IR_FIELDS",
    "REQUIRED_FIELDS",
    "STUDENT_IR_FIELDS",
    "UNIVERSAL_IR_SCHEMA_VERSION",
    "UniversalIRError",
    "build_universal_question_ir",
    "require_valid_universal_question_ir",
    "split_student_proof_ir",
    "validate_universal_question_ir",
]
