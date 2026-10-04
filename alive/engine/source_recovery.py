"""Fail-closed source-defect recovery contracts.

This module is the repository-local implementation of the v1.2 design
candidate.  It deliberately does not generate student questions itself.  It
owns the safety boundary around a recovery producer: diagnosis routing,
tier/capability bookkeeping, immutable candidate versions, independent gate
reduction, derived replacement parity, and release aggregation.

The original source remains outside this module's mutation surface.  A
recovered artifact can be used as a production replacement only after the
returned adoption transition has passed every hard gate.  Callers must persist
the returned record; no function mutates a frozen candidate or a caller-owned
ledger in place.
"""

from __future__ import annotations

import copy
import hashlib
import json
import re
from pathlib import Path
from typing import Any, Iterable, Mapping

from .run_store import atomic_write_json, sha256_file
from .source_question import json_sha256


SOURCE_RECOVERY_SCHEMA_VERSION = "ALIVE_SOURCE_RECOVERY_v1"
SOURCE_RECOVERY_LEDGER_SCHEMA_VERSION = "ALIVE_SOURCE_RECOVERY_LEDGER_v1"

RECOVERY_POLICIES = ("PRESERVE_ONLY", "SHADOW_AUTO_RECOVER", "AUTO_RECOVER")
RECOVERY_AUTHORITIES = ("SHADOW_ONLY", "BOUNDED_PRODUCTION", "DEFAULT_PRODUCTION")
ADOPTION_STATUSES = ("NOT_AUTHORIZED", "AUTHORIZED", "ADOPTED")
RECOVERY_STATUSES = (
    "NOT_REQUIRED",
    "SOURCE_RECHECK",
    "SOURCE_DEFECT_CONFIRMED",
    "RECOVERING",
    "RECOVERED",
    "RECOVERY_VALIDATION_FAILED",
    "SOURCE_RECOVERY_EVIDENCE_BLOCKED",
    "RECOVERY_CAPABILITY_BLOCKED",
    "RECOVERY_DEFERRED_CAPABILITY",
    "HUMAN_REQUIRED",
    "PRESERVE_ONLY",
)
RECOVERY_DISPOSITIONS = (
    "ANSWER_KEY_RECOVERED",
    "MINIMAL_RECOVERED",
    "STRUCTURAL_RECOVERED",
    "RECOVERED_RECONSTRUCTION",
    "SOURCE_PRESERVED_ONLY",
    "DERIVED_REPLACEMENT_VERIFIED",
)
APPLICABILITY = ("NOT_APPLICABLE", "APPLICABLE_PRIMARY", "APPLICABLE_FALLBACK")
CAPABILITIES = ("ACTIVE", "CAPABILITY_BLOCKED", "DEFERRED_CAPABILITY")
EXECUTIONS = (
    "NOT_RUN",
    "AVAILABLE_PENDING",
    "ATTEMPTED_PASS",
    "ATTEMPTED_EXHAUSTED",
    "SKIPPED_AFTER_LOWER_TIER_PASS",
)
TIERS = tuple(f"R{index}" for index in range(7))

DEFECT_TYPES = (
    "ANSWER_KEY_CONFLICT",
    "NO_CORRECT_ANSWER",
    "MULTIPLE_CORRECT_ANSWERS",
    "DUPLICATE_CHOICES",
    "UNDERDETERMINED_STEM",
    "CONTRADICTORY_CONDITIONS",
    "MISSING_CONDITION",
    "INVALID_DOMAIN",
    "INVALID_RANGE",
    "NUMERIC_DEFECT",
    "SIGN_DEFECT",
    "OPERATOR_DEFECT",
    "VARIABLE_OR_SYMBOL_DEFECT",
    "QUESTION_TARGET_DEFECT",
    "RESPONSE_FORM_DEFECT",
    "VISUAL_STEM_CONFLICT",
    "VISUAL_NUMERIC_CONFLICT",
    "VISUAL_LABEL_CONFLICT",
    "COMMON_MATERIAL_CONFLICT",
    "SOURCE_TEXT_AMBIGUITY",
    "OTHER_SOURCE_DEFECT",
)

CODE_SOURCE_RECOVERY_EVIDENCE_BLOCKED = "SOURCE_RECOVERY_EVIDENCE_BLOCKED"
CODE_SOURCE_RECOVERY_CAPABILITY_BLOCKED = "SOURCE_RECOVERY_CAPABILITY_BLOCKED"
CODE_SOURCE_RECOVERY_CAPABILITY_DEFERRED = "SOURCE_RECOVERY_CAPABILITY_DEFERRED"
CODE_SOURCE_RECOVERY_HUMAN_REQUIRED = "SOURCE_RECOVERY_HUMAN_REQUIRED"
CODE_SOURCE_RECOVERY_UNAUTHORIZED_ADOPTION = "SOURCE_RECOVERY_UNAUTHORIZED_ADOPTION"
CODE_DERIVED_REPLACEMENT_CARDINALITY_FAIL = "DERIVED_REPLACEMENT_CARDINALITY_FAIL"
CODE_DERIVED_REPLACEMENT_LINEAGE_FAIL = "DERIVED_REPLACEMENT_LINEAGE_FAIL"
CODE_DERIVED_REPLACEMENT_PARITY_FAIL = "DERIVED_REPLACEMENT_PARITY_FAIL"
CODE_DERIVED_REPLACEMENT_QUALITY_CLOSURE_FAIL = "DERIVED_REPLACEMENT_QUALITY_CLOSURE_FAIL"
CODE_SOURCE_RECOVERY_VALIDATION_FAIL = "SOURCE_RECOVERY_VALIDATION_FAIL"
CODE_SOURCE_RECOVERY_LEDGER_REQUIRED = "SOURCE_RECOVERY_LEDGER_REQUIRED"

RECOVERY_CODES = (
    "SOURCE_RECOVERY_EVIDENCE_BLOCKED",
    "SOURCE_RECOVERY_CAPABILITY_BLOCKED",
    "SOURCE_RECOVERY_CAPABILITY_DEFERRED",
    "SOURCE_RECOVERY_HUMAN_REQUIRED",
    "SOURCE_RECOVERY_UNAUTHORIZED_ADOPTION",
    "SOURCE_RECOVERY_VALIDATION_FAIL",
    "DERIVED_REPLACEMENT_CARDINALITY_FAIL",
    "DERIVED_REPLACEMENT_LINEAGE_FAIL",
    "DERIVED_REPLACEMENT_PARITY_FAIL",
    "DERIVED_REPLACEMENT_QUALITY_CLOSURE_FAIL",
    "SOURCE_RECOVERY_LEDGER_REQUIRED",
)

# Only the bounded R0/R1 producer and verifier adapters are operative in this
# scaffold. Higher tiers remain blocked/deferred until a real producer,
# validator, and (for visual tiers) visual capability are registered with
# evidence.
DEFAULT_CAPABILITY_REGISTRY: dict[str, dict[str, Any]] = {
    "R0": {"producerCapability": "answer-key-local", "validatorCapability": "blind-contract", "visualCapability": "NOT_APPLICABLE", "status": "ACTIVE", "evidenceRef": "source-recovery-r0-v1", "version": "1.0"},
    "R1": {"producerCapability": "choice-local-bounded", "validatorCapability": "blind-contract", "visualCapability": "NOT_APPLICABLE", "status": "ACTIVE", "evidenceRef": "source-recovery-r1-v1", "version": "1.1"},
    "R2": {"producerCapability": "token-numeric-not-registered", "validatorCapability": "NOT_REGISTERED", "visualCapability": "NOT_APPLICABLE", "status": "DEFERRED_CAPABILITY", "evidenceRef": None, "version": "0.0"},
    "R3": {"producerCapability": "condition-addition-requires-external-hint", "validatorCapability": "blind-contract", "visualCapability": "NOT_APPLICABLE", "status": "DEFERRED_CAPABILITY", "evidenceRef": "source-recovery-r3-adapter-v1", "version": "1.0"},
    "R4": {"producerCapability": "target-recovery-not-registered", "validatorCapability": "NOT_REGISTERED", "visualCapability": "NOT_APPLICABLE", "status": "DEFERRED_CAPABILITY", "evidenceRef": None, "version": "0.0"},
    "R5": {"producerCapability": "visual-recovery-not-registered", "validatorCapability": "NOT_REGISTERED", "visualCapability": "NOT_REGISTERED", "status": "CAPABILITY_BLOCKED", "evidenceRef": None, "version": "0.0"},
    "R6": {"producerCapability": "reconstruction-not-registered", "validatorCapability": "NOT_REGISTERED", "visualCapability": "NOT_REGISTERED", "status": "DEFERRED_CAPABILITY", "evidenceRef": None, "version": "0.0"},
}

_PRIMARY_TIER_BY_DEFECT = {
    "ANSWER_KEY_CONFLICT": "R0",
    "NO_CORRECT_ANSWER": "R1",
    "MULTIPLE_CORRECT_ANSWERS": "R1",
    "DUPLICATE_CHOICES": "R1",
    "NUMERIC_DEFECT": "R2",
    "SIGN_DEFECT": "R2",
    "OPERATOR_DEFECT": "R2",
    "VARIABLE_OR_SYMBOL_DEFECT": "R2",
    "UNDERDETERMINED_STEM": "R3",
    "CONTRADICTORY_CONDITIONS": "R3",
    "MISSING_CONDITION": "R3",
    "INVALID_DOMAIN": "R3",
    "INVALID_RANGE": "R3",
    "QUESTION_TARGET_DEFECT": "R4",
    "RESPONSE_FORM_DEFECT": "R4",
    "VISUAL_STEM_CONFLICT": "R5",
    "VISUAL_NUMERIC_CONFLICT": "R5",
    "VISUAL_LABEL_CONFLICT": "R5",
    "COMMON_MATERIAL_CONFLICT": "R3",
    "SOURCE_TEXT_AMBIGUITY": "R6",
    "OTHER_SOURCE_DEFECT": "R6",
}

_VISUAL_DEFECTS = {"VISUAL_STEM_CONFLICT", "VISUAL_NUMERIC_CONFLICT", "VISUAL_LABEL_CONFLICT"}
_FALLBACK_TIERS = {
    "R0": (),
    "R1": ("R2", "R3", "R4", "R6"),
    "R2": ("R3", "R4", "R6"),
    "R3": ("R4", "R6"),
    "R4": ("R6",),
    "R5": ("R6",),
    "R6": (),
}

_CORRECTNESS_AFFECTING = set(DEFECT_TYPES) - {"ANSWER_KEY_CONFLICT"}
_STRUCTURAL_SOURCE_DEFECTS = {
    "MISSING_CONDITION",
    "UNDERDETERMINED_STEM",
    "CONTRADICTORY_CONDITIONS",
    "INVALID_DOMAIN",
    "INVALID_RANGE",
    "QUESTION_TARGET_DEFECT",
    "OTHER_SOURCE_DEFECT",
}
_ANSWER_RESOLUTION_BLOCKERS = {"UNDETERMINED", "NO_UNIQUE_ANSWER", "UNKNOWN"}
_GATE_NAMES = (
    "MATH_VALID",
    "ANSWER_UNIQUE_OR_RESPONSE_CONTRACT_VALID",
    "CURRICULUM_VALID",
    "QUESTION_WELL_FORMED",
    "RECOVERY_FINGERPRINT_GATE_PASS",
    "DIFFICULTY_ROLE_ACCEPTABLE",
    "VISUAL_VALID_IF_APPLICABLE",
    "SERIALIZABLE",
)

_CIRCLED_ANSWERS = "①②③④⑤"
_MCQ_TYPES = {"객관식", "MCQ", "multiple_choice", "choice"}


class SourceRecoveryError(ValueError):
    """Raised when a recovery contract would violate a hard invariant."""


def _sha(value: Any) -> str:
    return json_sha256(value)


def _prefixed_sha(value: Any) -> str:
    return f"sha256:{_sha(value)}"


def _ordered_unique(values: Iterable[str]) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for value in values:
        if not isinstance(value, str) or not value:
            raise SourceRecoveryError("UID and enum values must be non-empty strings")
        if value not in seen:
            seen.add(value)
            result.append(value)
    return result


def _require_enum(value: Any, allowed: Iterable[str], field: str) -> str:
    if value not in set(allowed):
        raise SourceRecoveryError(f"{field} has invalid value: {value!r}")
    return value


def _candidate_payload_sha(payload: Mapping[str, Any]) -> str:
    return _prefixed_sha(dict(payload))


def _candidate_id(plan_id: str, version: int, payload_sha: str) -> str:
    if not isinstance(plan_id, str) or not plan_id:
        raise SourceRecoveryError("recoveryPlanId is required")
    if not isinstance(version, int) or version < 1:
        raise SourceRecoveryError("candidateVersion must be a positive integer")
    return f"{plan_id}-C{version:02d}-{payload_sha.removeprefix('sha256:')[:12]}"


def defect_is_correctness_affecting(defect_types: Iterable[str]) -> bool:
    return any(defect in _CORRECTNESS_AFFECTING for defect in defect_types)


def primary_tier(defect_types: Iterable[str]) -> str:
    defects = _ordered_unique(defect_types)
    if not defects:
        raise SourceRecoveryError("at least one source defect type is required")
    unknown = [defect for defect in defects if defect not in DEFECT_TYPES]
    if unknown:
        raise SourceRecoveryError(f"unknown source defect type: {unknown[0]}")
    # A stale answer key must not outrank a confirmed payload/source defect.
    # Likewise, RESPONSE_FORM_DEFECT and answer-cardinality symptoms are not
    # allowed to outrank the source defect that caused the unresolved result.
    structural = [defect for defect in defects if defect in _STRUCTURAL_SOURCE_DEFECTS]
    if structural:
        defects = structural
    else:
        non_answer = [defect for defect in defects if defect != "ANSWER_KEY_CONFLICT"]
        defects = non_answer or ["ANSWER_KEY_CONFLICT"]
    return min((_PRIMARY_TIER_BY_DEFECT[defect] for defect in defects), key=lambda tier: int(tier[1:]))


def _normalise_capability(value: Any) -> str:
    if isinstance(value, Mapping):
        value = value.get("status")
    if isinstance(value, str):
        return _require_enum(value, CAPABILITIES, "capability")
    if value is True:
        return "ACTIVE"
    if value is False or value is None:
        return "CAPABILITY_BLOCKED"
    raise SourceRecoveryError(f"invalid capability value: {value!r}")


def build_tier_matrix(
    defect_types: Iterable[str],
    capabilities: Mapping[str, Any] | None = None,
) -> dict[str, dict[str, str]]:
    """Build the independent applicability/capability/execution matrix."""

    defects = _ordered_unique(defect_types)
    primary = primary_tier(defects)
    primary_index = int(primary[1:])
    capability_map = DEFAULT_CAPABILITY_REGISTRY if capabilities is None else capabilities
    applicable = {primary, *_FALLBACK_TIERS[primary]}
    has_visual_defect = any(defect in _VISUAL_DEFECTS for defect in defects)
    if has_visual_defect and primary != "R5":
        applicable.add("R5")
    elif not has_visual_defect:
        applicable.discard("R5")
    matrix: dict[str, dict[str, str]] = {}
    for index, tier in enumerate(TIERS):
        applicability = (
            "APPLICABLE_PRIMARY"
            if index == primary_index
            else "APPLICABLE_FALLBACK"
            if tier in applicable
            else "NOT_APPLICABLE"
        )
        matrix[tier] = {
            "applicability": applicability,
            "capability": _normalise_capability(capability_map.get(tier, {"status": "CAPABILITY_BLOCKED"})),
            "execution": "NOT_RUN",
        }
    return matrix


def capability_registry_report() -> dict[str, Any]:
    """Return the explicit bounded capability registry used by the router."""

    return {
        "schemaVersion": "ALIVE_SOURCE_RECOVERY_CAPABILITY_REGISTRY_v1",
        "status": "BOUNDED_R0_R1_ONLY",
        "tiers": copy.deepcopy(DEFAULT_CAPABILITY_REGISTRY),
    }


def validate_design_mirror(left: Path, right: Path) -> dict[str, Any]:
    """Compare the design rulebook mirrors without treating CRLF as drift."""

    paths = (Path(left), Path(right))
    if any(not path.is_file() for path in paths):
        return {"status": "BLOCKED", "code": "SOURCE_RECOVERY_DESIGN_MIRROR_MISSING", "paths": [str(path) for path in paths]}
    normalized = [path.read_bytes().replace(b"\r\n", b"\n") for path in paths]
    return {
        "status": "PASS" if normalized[0] == normalized[1] else "FAIL",
        "code": None if normalized[0] == normalized[1] else "SOURCE_RECOVERY_DESIGN_MIRROR_DRIFT",
        "paths": [str(path) for path in paths],
        "sha256": [hashlib.sha256(value).hexdigest() for value in normalized],
    }


def validate_tier_matrix(matrix: Mapping[str, Mapping[str, Any]]) -> list[str]:
    errors: list[str] = []
    if set(matrix) != set(TIERS):
        errors.append("TIER_MATRIX_MUST_COVER_R0_TO_R6")
        return errors
    for tier in TIERS:
        row = matrix.get(tier, {})
        if row.get("applicability") not in APPLICABILITY:
            errors.append(f"TIER_APPLICABILITY_INVALID:{tier}")
        if row.get("capability") not in CAPABILITIES:
            errors.append(f"TIER_CAPABILITY_INVALID:{tier}")
        if row.get("execution") not in EXECUTIONS:
            errors.append(f"TIER_EXECUTION_INVALID:{tier}")
        if row.get("capability") in {"CAPABILITY_BLOCKED", "DEFERRED_CAPABILITY"} and row.get("execution") == "ATTEMPTED_EXHAUSTED":
            errors.append(f"TIER_CAPABILITY_COUNTED_AS_EXHAUSTION:{tier}")
    return errors


def make_candidate_version(
    recovery_plan_id: str,
    payload: Mapping[str, Any],
    *,
    candidate_version: int = 1,
    parent_candidate_id: str | None = None,
    freeze_status: str = "FROZEN",
) -> dict[str, Any]:
    """Create a new immutable candidate record with a content-bound identity."""

    candidate_payload = copy.deepcopy(dict(payload))
    payload_sha = _candidate_payload_sha(candidate_payload)
    candidate_id = _candidate_id(recovery_plan_id, candidate_version, payload_sha)
    return {
        "candidateId": candidate_id,
        "recoveryPlanId": recovery_plan_id,
        "candidateVersion": candidate_version,
        "parentCandidateId": parent_candidate_id,
        "payload": candidate_payload,
        "payloadSha256": payload_sha,
        "freeze": {"status": freeze_status, "payloadSha256": payload_sha, "immutable": True},
        "immutable": True,
    }


def targeted_repair_candidate(
    previous: Mapping[str, Any],
    repaired_payload: Mapping[str, Any],
    *,
    localized_failure: bool = True,
    locked_core_unchanged: bool = True,
    semantic_dimension_unchanged: bool = True,
) -> dict[str, Any]:
    """Return a new candidate version; never mutate ``previous`` in place."""

    if previous.get("immutable") is not True or previous.get("freeze", {}).get("status") != "FROZEN":
        raise SourceRecoveryError("targeted repair requires an immutable frozen candidate")
    if not localized_failure or not locked_core_unchanged or not semantic_dimension_unchanged:
        raise SourceRecoveryError("targeted repair is not eligible for this candidate")
    if not previous.get("recoveryPlanId") or not previous.get("candidateId"):
        raise SourceRecoveryError("previous candidate lineage is incomplete")
    version = previous.get("candidateVersion")
    if not isinstance(version, int):
        raise SourceRecoveryError("previous candidateVersion is invalid")
    repaired = make_candidate_version(
        str(previous["recoveryPlanId"]),
        repaired_payload,
        candidate_version=version + 1,
        parent_candidate_id=str(previous["candidateId"]),
    )
    if repaired["payloadSha256"] == previous.get("payloadSha256"):
        raise SourceRecoveryError("targeted repair must produce a new payload SHA")
    return repaired


def _hash_without_self_field(value: Mapping[str, Any], field: str) -> str:
    return _prefixed_sha({key: child for key, child in value.items() if key != field})


def validate_verifier_evidence(
    candidate: Mapping[str, Any],
    evidence: Mapping[str, Any] | None,
) -> dict[str, Any]:
    """Validate the independent, artifact-bound verifier envelope."""

    errors: list[str] = []
    if not isinstance(evidence, Mapping):
        return {"status": "FAIL", "errors": ["INDEPENDENT_VERIFIER_EVIDENCE_REQUIRED"]}
    required = (
        "candidateId",
        "candidateVersion",
        "candidatePayloadSha256",
        "verifierId",
        "verifierSessionId",
        "inputVisibilityProfile",
        "blindInput",
        "independentlyComputedAnswer",
        "answerUnique",
        "responseContractValid",
        "allChoicesChecked",
        "distractorsWrong",
        "mathVerdict",
        "evidenceSha256",
    )
    errors.extend(f"VERIFIER_EVIDENCE_FIELD_MISSING:{field}" for field in required if field not in evidence)
    if evidence.get("candidateId") != candidate.get("candidateId"):
        errors.append("VERIFIER_CANDIDATE_ID_MISMATCH")
    if evidence.get("candidateVersion") != candidate.get("candidateVersion"):
        errors.append("VERIFIER_CANDIDATE_VERSION_MISMATCH")
    if evidence.get("candidatePayloadSha256") != candidate.get("payloadSha256"):
        errors.append("VERIFIER_CANDIDATE_SHA_MISMATCH")
    if evidence.get("inputVisibilityProfile") not in {"ARTIFACT_ONLY", "RECOVERED_ONLY"}:
        errors.append("VERIFIER_BLIND_VISIBILITY_INVALID")
    blind_input = evidence.get("blindInput")
    if not isinstance(blind_input, Mapping):
        errors.append("VERIFIER_BLIND_INPUT_INVALID")
    else:
        forbidden = {"answer", "solution", "intendedAnswer", "printedAnswer", "repairTargetAnswer", "previousVerdict", "builderAnswer", "builderSolution"}
        leaked = sorted(forbidden.intersection(blind_input))
        if leaked:
            errors.append("VERIFIER_BLIND_INPUT_LEAK:" + ",".join(leaked))
    if evidence.get("answerUnique") is not True or evidence.get("responseContractValid") is not True or evidence.get("allChoicesChecked") is not True or evidence.get("distractorsWrong") is not True:
        errors.append("VERIFIER_RESPONSE_CONTRACT_NOT_PASS")
    if evidence.get("mathVerdict") != "PASS":
        errors.append("VERIFIER_MATH_NOT_PASS")
    candidate_payload = candidate.get("payload")
    if isinstance(candidate_payload, Mapping) and _is_mcq_payload(candidate_payload) and evidence.get("independentlyComputedAnswer") is not None:
        computed = {"independentlyComputedValue": evidence.get("independentlyComputedValue", evidence.get("independentlyComputedAnswer"))}
        resolution = resolve_independent_answer_against_choices(candidate_payload, computed)
        if len(resolution["matchingChoiceIndices"]) != 1:
            errors.append("VERIFIER_COMPUTED_VALUE_NOT_UNIQUE_IN_CHOICES")
        elif resolution["canonicalArchiveAnswer"] != candidate_payload.get("answer"):
            errors.append("VERIFIER_CANONICAL_ANSWER_MISMATCH")
    evidence_sha = evidence.get("evidenceSha256")
    if evidence_sha != _hash_without_self_field(evidence, "evidenceSha256"):
        errors.append("VERIFIER_EVIDENCE_SHA_MISMATCH")
    builder_session = candidate.get("builderSessionId") or candidate.get("builderSession")
    if builder_session and evidence.get("verifierSessionId") == builder_session:
        errors.append("VERIFIER_BUILDER_SESSION_COLLISION")
    return {"status": "PASS" if not errors else "FAIL", "errors": _ordered_unique(errors)}


def _validator_evidence_sha(value: Mapping[str, Any]) -> str:
    return _hash_without_self_field(value, "evidenceSha256")


def validate_validator_evidence(
    candidate: Mapping[str, Any],
    evidence: Mapping[str, Any] | None,
) -> dict[str, Any]:
    """Validate per-gate evidence emitted by real validators, not a builder claim."""

    errors: list[str] = []
    if not isinstance(evidence, Mapping):
        return {"status": "FAIL", "errors": ["VALIDATOR_EVIDENCE_REQUIRED"], "gates": {}}
    gate_rows = evidence.get("gates")
    if not isinstance(gate_rows, Mapping):
        return {"status": "FAIL", "errors": ["VALIDATOR_GATE_EVIDENCE_REQUIRED"], "gates": {}}
    statuses: dict[str, str] = {}
    for gate in _GATE_NAMES:
        row = gate_rows.get(gate)
        if not isinstance(row, Mapping):
            errors.append(f"VALIDATOR_GATE_EVIDENCE_MISSING:{gate}")
            statuses[gate] = "NOT_TESTED"
            continue
        statuses[gate] = str(row.get("status", "NOT_TESTED")).upper()
        for field in ("evidenceId", "validatorId", "method", "coverage", "candidateId", "candidateVersion", "candidatePayloadSha256", "evidenceSha256"):
            if field not in row:
                errors.append(f"VALIDATOR_GATE_FIELD_MISSING:{gate}:{field}")
        if row.get("candidateId") != candidate.get("candidateId"):
            errors.append(f"VALIDATOR_GATE_CANDIDATE_ID_MISMATCH:{gate}")
        if row.get("candidateVersion") != candidate.get("candidateVersion"):
            errors.append(f"VALIDATOR_GATE_CANDIDATE_VERSION_MISMATCH:{gate}")
        if row.get("candidatePayloadSha256") != candidate.get("payloadSha256"):
            errors.append(f"VALIDATOR_GATE_CANDIDATE_SHA_MISMATCH:{gate}")
        if row.get("evidenceSha256") != _validator_evidence_sha(row):
            errors.append(f"VALIDATOR_GATE_EVIDENCE_SHA_MISMATCH:{gate}")
        if row.get("coverage") not in {"complete", "not_applicable"}:
            errors.append(f"VALIDATOR_GATE_COVERAGE_INCOMPLETE:{gate}")
        if statuses[gate] != "PASS":
            errors.append(f"VALIDATOR_GATE_NOT_PASS:{gate}")
    return {"status": "PASS" if not errors else "FAIL", "errors": _ordered_unique(errors), "gates": statuses}


def _is_mcq_payload(payload: Mapping[str, Any]) -> bool:
    question_type = str(payload.get("questionType") or "").strip()
    return question_type in _MCQ_TYPES or isinstance(payload.get("choices"), list) and bool(payload.get("choices"))


def choice_index_to_canonical_answer(index: Any) -> str | None:
    """Convert a one-based archive choice index to its canonical circled key."""

    if isinstance(index, bool):
        return None
    try:
        numeric = int(index)
    except (TypeError, ValueError):
        return None
    return _CIRCLED_ANSWERS[numeric - 1] if 1 <= numeric <= len(_CIRCLED_ANSWERS) else None


def canonical_answer_to_choice_index(answer: Any) -> int | None:
    """Resolve a canonical archive answer key (and legacy numeric key) to an index."""

    text = _answer_text(answer)
    if text in _CIRCLED_ANSWERS:
        return _CIRCLED_ANSWERS.index(text) + 1
    if re.fullmatch(r"[1-5]", text):
        return int(text)
    return None


def canonical_answer_to_choice_indices(answer: Any) -> list[int]:
    """Resolve a single- or multi-select archive answer into one-based indices."""

    text = _answer_text(answer)
    circled = [index + 1 for index, value in enumerate(_CIRCLED_ANSWERS) if value in text]
    if circled:
        return circled
    numeric = [int(value) for value in re.findall(r"(?<!\d)([1-5])(?!\d)", text)]
    return list(dict.fromkeys(numeric))


def choice_indices_to_canonical_answer(indices: Iterable[int]) -> str | None:
    values = []
    for index in indices:
        canonical = choice_index_to_canonical_answer(index)
        if canonical is not None and canonical not in values:
            values.append(canonical)
    return ", ".join(values) if values else None


def resolve_independent_answer_against_choices(
    payload: Mapping[str, Any],
    independent_solve: Mapping[str, Any],
) -> dict[str, Any]:
    """Separate a computed value from the archive MCQ key it resolves to."""

    choices = payload.get("choices")
    choices = choices if isinstance(choices, list) else []
    value = _answer_text(
        independent_solve.get(
            "independentlyComputedValue",
            independent_solve.get("independentlyComputedAnswer", independent_solve.get("answer")),
        )
    )
    if independent_solve.get("answerCardinality") == "MULTIPLE":
        supplied = independent_solve.get("matchingChoiceIndices")
        if isinstance(supplied, list):
            matches = sorted({int(index) for index in supplied if isinstance(index, int) and not isinstance(index, bool) and 1 <= index <= len(choices)})
            return {
                "independentlyComputedValue": value,
                "matchingChoiceIndices": matches,
                "canonicalArchiveAnswer": choice_indices_to_canonical_answer(matches),
            }
    computed_key_index = canonical_answer_to_choice_index(value)
    if computed_key_index is not None and independent_solve.get("answerType") in {"choice_index", "choiceIndex"}:
        matches = [computed_key_index] if computed_key_index <= len(choices) else []
    else:
        matches = [index + 1 for index, choice in enumerate(choices) if _answer_text(choice) == value]
    matches = list(dict.fromkeys(matches))
    canonical = choice_index_to_canonical_answer(matches[0]) if len(matches) == 1 else None
    return {
        "independentlyComputedValue": value,
        "matchingChoiceIndices": matches,
        "canonicalArchiveAnswer": canonical,
    }


def _archive_serialization_errors(payload: Mapping[str, Any]) -> list[str]:
    errors: list[str] = []
    try:
        json.dumps(dict(payload), ensure_ascii=False, sort_keys=True, allow_nan=False)
    except (TypeError, ValueError):
        return ["ARCHIVE_JSON_SERIALIZATION_FAILED"]
    if not isinstance(payload.get("content"), str) or not payload.get("content", "").strip():
        errors.append("ARCHIVE_CONTENT_INVALID")
    if _is_mcq_payload(payload):
        choices = payload.get("choices")
        if not isinstance(choices, list) or not 1 < len(choices) <= len(_CIRCLED_ANSWERS):
            errors.append("ARCHIVE_MCQ_CHOICES_INVALID")
        answer_index = canonical_answer_to_choice_index(payload.get("answer"))
        if answer_index is None or not isinstance(choices, list) or answer_index > len(choices):
            errors.append("ARCHIVE_MCQ_ANSWER_KEY_INVALID")
        normalized = [_answer_text(choice) for choice in choices] if isinstance(choices, list) else []
        if len(normalized) != len(set(normalized)):
            errors.append("ARCHIVE_MCQ_DUPLICATE_CHOICES")
    elif not _answer_text(payload.get("answer")):
        errors.append("ARCHIVE_RESPONSE_ANSWER_MISSING")
    return errors


def _external_validator_status(
    candidate: Mapping[str, Any],
    gate: str,
    supplied: Mapping[str, Any] | None,
) -> tuple[str, dict[str, Any]]:
    if not isinstance(supplied, Mapping):
        return "NOT_TESTED", {"sourceError": f"{gate}_VALIDATOR_EVIDENCE_REQUIRED"}
    valid = (
        supplied.get("status") == "PASS"
        and isinstance(supplied.get("evidenceId"), str)
        and bool(supplied.get("evidenceId"))
        and isinstance(supplied.get("method"), str)
        and bool(supplied.get("method"))
        and supplied.get("candidateId") == candidate.get("candidateId")
        and supplied.get("candidateVersion") == candidate.get("candidateVersion")
        and supplied.get("candidatePayloadSha256") == candidate.get("payloadSha256")
        and supplied.get("coverage") in {"complete", "not_applicable"}
        and supplied.get("evidenceSha256") == _validator_evidence_sha(supplied)
        and isinstance(supplied.get("validatorId"), str)
        and bool(supplied.get("validatorId"))
    )
    return ("PASS" if valid else "FAIL"), {
        "sourceEvidenceId": supplied.get("evidenceId"),
        "sourceEvidenceSha256": supplied.get("evidenceSha256"),
        "sourceValidatorId": supplied.get("validatorId"),
    }


def build_validator_evidence(
    candidate: Mapping[str, Any],
    *,
    visual_required: bool = False,
    gate_evidence: Mapping[str, Mapping[str, Any]] | None = None,
) -> dict[str, Any]:
    """Run executable local checks and bind separately supplied validator evidence."""

    payload = candidate.get("payload")
    if not isinstance(payload, Mapping):
        raise SourceRecoveryError("candidate payload is required for validation")
    verifier = candidate.get("verifierEvidence") if isinstance(candidate.get("verifierEvidence"), Mapping) else {}
    supplied = gate_evidence or {}
    curriculum_status, curriculum_detail = _external_validator_status(candidate, "CURRICULUM_VALID", supplied.get("CURRICULUM_VALID"))
    fingerprint_status, fingerprint_detail = _external_validator_status(candidate, "RECOVERY_FINGERPRINT_GATE_PASS", supplied.get("RECOVERY_FINGERPRINT_GATE_PASS"))
    difficulty_status, difficulty_detail = _external_validator_status(candidate, "DIFFICULTY_ROLE_ACCEPTABLE", supplied.get("DIFFICULTY_ROLE_ACCEPTABLE"))
    serial_errors = _archive_serialization_errors(payload)
    visual_fields = ("image", "imagePath", "visual", "visualSpec", "solutionImage")
    detected_visual = any(payload.get(field) is not None and payload.get(field) != "" and payload.get(field) is not False for field in visual_fields)
    if visual_required or detected_visual:
        visual_status, visual_detail = _external_validator_status(candidate, "VISUAL_VALID_IF_APPLICABLE", supplied.get("VISUAL_VALID_IF_APPLICABLE"))
        visual_coverage = "complete"
    else:
        visual_status, visual_detail, visual_coverage = "PASS", {"applicability": "NOT_APPLICABLE", "checkedFields": list(visual_fields)}, "not_applicable"
    structural_pass = isinstance(payload.get("content"), str) and bool(payload.get("content", "").strip()) and (
        not _is_mcq_payload(payload) or isinstance(payload.get("choices"), list) and len(payload.get("choices", [])) > 1
    )
    statuses = {
        "MATH_VALID": "PASS" if verifier.get("mathVerdict") == "PASS" else "FAIL",
        "ANSWER_UNIQUE_OR_RESPONSE_CONTRACT_VALID": "PASS" if verifier.get("answerUnique") is True and verifier.get("responseContractValid") is True else "FAIL",
        "CURRICULUM_VALID": curriculum_status,
        "QUESTION_WELL_FORMED": "PASS" if structural_pass else "FAIL",
        "RECOVERY_FINGERPRINT_GATE_PASS": fingerprint_status,
        "DIFFICULTY_ROLE_ACCEPTABLE": difficulty_status,
        "VISUAL_VALID_IF_APPLICABLE": visual_status,
        "SERIALIZABLE": "PASS" if not serial_errors else "FAIL",
    }
    details = {
        "MATH_VALID": {"sourceEvidenceSha256": verifier.get("evidenceSha256")},
        "ANSWER_UNIQUE_OR_RESPONSE_CONTRACT_VALID": {"sourceEvidenceSha256": verifier.get("evidenceSha256")},
        "CURRICULUM_VALID": curriculum_detail,
        "QUESTION_WELL_FORMED": {"structuralChecksExecuted": True},
        "RECOVERY_FINGERPRINT_GATE_PASS": fingerprint_detail,
        "DIFFICULTY_ROLE_ACCEPTABLE": difficulty_detail,
        "VISUAL_VALID_IF_APPLICABLE": visual_detail,
        "SERIALIZABLE": {"serializer": "json.dumps(allow_nan=False)+archive-answer-contract", "errors": serial_errors},
    }
    rows: dict[str, dict[str, Any]] = {}
    for gate, status in statuses.items():
        row = {
            "evidenceId": f"validator-{candidate['candidateId']}-{gate}",
            "validatorId": "alive-bounded-validator",
            "candidateId": candidate["candidateId"],
            "candidateVersion": candidate["candidateVersion"],
            "candidatePayloadSha256": candidate["payloadSha256"],
            "status": status,
            "method": "bound_external_validator" if gate in {"CURRICULUM_VALID", "RECOVERY_FINGERPRINT_GATE_PASS", "DIFFICULTY_ROLE_ACCEPTABLE"} or gate == "VISUAL_VALID_IF_APPLICABLE" and visual_coverage == "complete" else "bounded_executable_validator",
            "coverage": visual_coverage if gate == "VISUAL_VALID_IF_APPLICABLE" else "complete",
            **details[gate],
        }
        rows[gate] = {**row, "evidenceSha256": _validator_evidence_sha(row)}
    return {"validatorId": "alive-bounded-validator", "gates": rows}


def blind_candidate_view(candidate: Mapping[str, Any]) -> dict[str, Any]:
    """Return the only candidate view a separate verifier may receive."""

    payload = copy.deepcopy(dict(candidate.get("payload") or {}))
    for field in ("answer", "solution", "intendedAnswer", "printedAnswer", "verifierEvidence", "validatorEvidence"):
        payload.pop(field, None)
    return {
        "candidateId": candidate.get("candidateId"),
        "candidateVersion": candidate.get("candidateVersion"),
        "candidatePayloadSha256": candidate.get("payloadSha256"),
        "payload": payload,
        "inputVisibilityProfile": "ARTIFACT_ONLY",
        "priorReviewVisibility": "NONE",
        "builderSessionId": candidate.get("builderSessionId"),
    }


def build_blind_verifier_adapter(blind_solve: Mapping[str, Any]) -> Any:
    """Adapt a separately-produced solve result into the verifier envelope.

    The adapter receives the artifact-only view and never reads the source
    ``independentSolve`` object. Its caller is responsible for supplying a
    verifier result produced by a separate identity/session.
    """

    if not isinstance(blind_solve, Mapping):
        raise SourceRecoveryError("separate blind verifier solve is required")

    def verify(view: Mapping[str, Any]) -> dict[str, Any]:
        blind_payload = copy.deepcopy(dict(view.get("payload") or {}))
        for field in ("answer", "solution", "intendedAnswer", "printedAnswer", "repairTargetAnswer", "previousVerdict", "builderAnswer", "builderSolution"):
            blind_payload.pop(field, None)
        body = {
            "candidateId": view.get("candidateId"),
            "candidateVersion": view.get("candidateVersion"),
            "candidatePayloadSha256": view.get("candidatePayloadSha256"),
            "verifierId": blind_solve.get("verifierId"),
            "verifierSessionId": blind_solve.get("verifierSessionId"),
            "inputVisibilityProfile": "ARTIFACT_ONLY",
            "blindInput": blind_payload,
            "independentlyComputedValue": blind_solve.get("independentlyComputedValue", blind_solve.get("independentlyComputedAnswer", blind_solve.get("answer"))),
            "independentlyComputedAnswer": blind_solve.get("independentlyComputedAnswer", blind_solve.get("independentlyComputedValue", blind_solve.get("answer"))),
            "answerUnique": blind_solve.get("answerUnique"),
            "responseContractValid": blind_solve.get("responseContractValid"),
            "allChoicesChecked": blind_solve.get("allChoicesChecked"),
            "distractorsWrong": blind_solve.get("distractorsWrong"),
            "mathVerdict": blind_solve.get("mathVerdict"),
        }
        return {**body, "evidenceSha256": _hash_without_self_field(body, "evidenceSha256")}

    return verify


def validate_producer_attempt(
    attempt: Mapping[str, Any] | None,
    *,
    generated_candidate_count: int | None = None,
) -> dict[str, Any]:
    """Prove that a tier producer actually ran before counting exhaustion."""

    errors: list[str] = []
    if not isinstance(attempt, Mapping):
        return {"status": "PENDING", "errors": ["RECOVERY_PRODUCER_ATTEMPT_EVIDENCE_REQUIRED"]}
    required = ("producerStatus", "attemptCount", "candidateBudget", "candidateBudgetConsumed", "retryBudget", "retryBudgetConsumed", "generatedCandidateCount", "attemptEvidenceRef", "attemptEvidenceSha", "allProducedCandidatesRejected")
    errors.extend(f"PRODUCER_ATTEMPT_FIELD_MISSING:{field}" for field in required if field not in attempt)
    if attempt.get("producerStatus") != "COMPLETED":
        errors.append("RECOVERY_PRODUCER_NOT_COMPLETED")
    if not isinstance(attempt.get("attemptCount"), int) or attempt.get("attemptCount", 0) < 1:
        errors.append("RECOVERY_PRODUCER_ATTEMPT_COUNT_INVALID")
    count = attempt.get("generatedCandidateCount")
    if not isinstance(count, int) or count < 0:
        errors.append("RECOVERY_PRODUCER_CANDIDATE_COUNT_INVALID")
    if generated_candidate_count is not None and count != generated_candidate_count:
        errors.append("RECOVERY_PRODUCER_CANDIDATE_COUNT_MISMATCH")
    candidate_budget = attempt.get("candidateBudget")
    candidate_consumed = attempt.get("candidateBudgetConsumed")
    retry_budget = attempt.get("retryBudget")
    if not isinstance(candidate_budget, int) or candidate_budget < 1 or not isinstance(candidate_consumed, int) or not 0 <= candidate_consumed <= candidate_budget:
        errors.append("RECOVERY_CANDIDATE_BUDGET_INVALID")
    if not isinstance(retry_budget, int) or retry_budget < 0 or not isinstance(attempt.get("retryBudgetConsumed"), bool):
        errors.append("RECOVERY_RETRY_BUDGET_INVALID")
    if not isinstance(attempt.get("attemptEvidenceRef"), str) or not attempt.get("attemptEvidenceRef"):
        errors.append("RECOVERY_PRODUCER_ATTEMPT_REF_INVALID")
    if not isinstance(attempt.get("attemptEvidenceSha"), str) or not re.fullmatch(r"sha256:[0-9a-f]{64}", attempt.get("attemptEvidenceSha", "")):
        errors.append("RECOVERY_PRODUCER_ATTEMPT_SHA_INVALID")
    if count == 0 and attempt.get("allProducedCandidatesRejected") is not True:
        errors.append("RECOVERY_EMPTY_PRODUCER_RESULT_NOT_CLOSED")
    if attempt.get("allProducedCandidatesRejected") is True and (
        candidate_consumed != candidate_budget or attempt.get("retryBudgetConsumed") is not True
    ):
        errors.append("RECOVERY_PRODUCER_BUDGET_NOT_EXHAUSTED")
    return {"status": "PASS" if not errors else "PENDING", "errors": _ordered_unique(errors)}


def validate_external_candidate(
    candidate: Mapping[str, Any] | None,
    *,
    recovery_plan_id: str,
) -> dict[str, Any]:
    """Recompute external candidate identity before any evidence is trusted."""

    errors: list[str] = []
    if not isinstance(candidate, Mapping):
        return {"status": "FAIL", "errors": ["EXTERNAL_CANDIDATE_REQUIRED"]}
    payload = candidate.get("payload")
    if not isinstance(payload, Mapping):
        errors.append("EXTERNAL_CANDIDATE_PAYLOAD_REQUIRED")
    actual_payload_sha = _candidate_payload_sha(payload) if isinstance(payload, Mapping) else None
    if candidate.get("payloadSha256") != actual_payload_sha:
        errors.append("EXTERNAL_CANDIDATE_PAYLOAD_SHA_MISMATCH")
    version = candidate.get("candidateVersion")
    if not isinstance(version, int) or isinstance(version, bool) or version < 1:
        errors.append("EXTERNAL_CANDIDATE_VERSION_INVALID")
    elif actual_payload_sha is not None and candidate.get("candidateId") != _candidate_id(recovery_plan_id, version, actual_payload_sha):
        errors.append("EXTERNAL_CANDIDATE_ID_MISMATCH")
    if candidate.get("recoveryPlanId") != recovery_plan_id:
        errors.append("EXTERNAL_CANDIDATE_PLAN_ID_MISMATCH")
    freeze = candidate.get("freeze")
    if not isinstance(freeze, Mapping) or freeze.get("status") != "FROZEN" or freeze.get("immutable") is not True:
        errors.append("EXTERNAL_CANDIDATE_FREEZE_REQUIRED")
    elif freeze.get("payloadSha256") != actual_payload_sha:
        errors.append("EXTERNAL_CANDIDATE_FREEZE_SHA_MISMATCH")
    if candidate.get("immutable") is not True:
        errors.append("EXTERNAL_CANDIDATE_IMMUTABLE_REQUIRED")
    return {"status": "PASS" if not errors else "FAIL", "errors": _ordered_unique(errors)}


def validate_source_evidence(source_payload: Mapping[str, Any] | None) -> dict[str, Any]:
    """Require the source recheck evidence needed before diagnosis."""

    if not isinstance(source_payload, Mapping):
        return {"status": "BLOCKED", "requiredResource": "SOURCE_FILE"}
    evidence = source_payload.get("sourceEvidence")
    if not isinstance(evidence, Mapping):
        return {"status": "BLOCKED", "requiredResource": "SOURCE_PAGE"}
    required = ("fullPageVerified", "questionZoomVerified", "choicesVerified")
    missing = [field for field in required if evidence.get(field) is not True]
    if missing:
        resource = "COMMON_MATERIAL" if evidence.get("commonMaterialRequired") is True and evidence.get("commonMaterialVerified") is not True else "SOURCE_VISUAL" if evidence.get("visualRequired") is True and evidence.get("visualVerified") is not True else "SOURCE_PAGE"
        return {"status": "BLOCKED", "requiredResource": resource, "missing": missing}
    return {"status": "PASS"}


def _answer_text(value: Any) -> str:
    if isinstance(value, Mapping):
        for key in ("canonicalAnswer", "independentlyComputedAnswer", "answer", "value", "selectedChoice"):
            if value.get(key) is not None:
                return str(value[key]).strip()
    return str(value).strip() if value is not None else ""


def _independent_computed_value(independent_solve: Mapping[str, Any]) -> str:
    return _answer_text(
        independent_solve.get(
            "independentlyComputedValue",
            independent_solve.get("independentlyComputedAnswer", independent_solve.get("answer")),
        )
    )


def _answer_values_equivalent(left: Any, right: Any) -> bool:
    def normalize(value: Any) -> str:
        text = _answer_text(value).strip()
        for opener, closer in (("$", "$"), (r"\(", r"\)"), (r"\[", r"\]")):
            if text.startswith(opener) and text.endswith(closer) and len(text) >= len(opener) + len(closer):
                text = text[len(opener):-len(closer)].strip()
                break
        return text
    return normalize(left) == normalize(right)


def diagnose_source_defects(
    source_payload: Mapping[str, Any],
    independent_solve: Mapping[str, Any],
) -> dict[str, Any]:
    """Classify source conflict from locked source data and a blind solve."""

    evidence = validate_source_evidence(source_payload)
    if evidence["status"] != "PASS":
        return {
            "status": "SOURCE_RECOVERY_EVIDENCE_BLOCKED",
            "finalStatus": "BLOCKED",
            "requiredResource": evidence["requiredResource"],
            "resumeFromStage": "SOURCE_RECHECK",
        }
    if not isinstance(independent_solve, Mapping):
        raise SourceRecoveryError("independent solve evidence is required for diagnosis")
    if independent_solve.get("extractionMatchesSource") is False:
        return {"status": "EXTRACTION_DEFECT", "defectTypes": ["SOURCE_TEXT_AMBIGUITY"]}
    if independent_solve.get("mathVerdict") != "PASS":
        return {
            "status": "SOURCE_RECOVERY_VALIDATION_FAILED",
            "finalStatus": "BLOCKED",
            "code": CODE_SOURCE_RECOVERY_VALIDATION_FAIL,
            "reason": "INDEPENDENT_MATH_NOT_PASS",
        }
    missing_response_evidence = [
        field for field in ("mathVerdict", "answerUnique", "responseContractValid")
        if field not in independent_solve
    ]
    has_computed_answer = any(
        field in independent_solve and independent_solve.get(field) is not None
        for field in ("independentlyComputedValue", "independentlyComputedAnswer", "answer")
    )
    if not has_computed_answer:
        missing_response_evidence.append("independentlyComputedAnswer")
    if missing_response_evidence:
        return {
            "status": "SOURCE_RECOVERY_VALIDATION_FAILED",
            "finalStatus": "BLOCKED",
            "code": CODE_SOURCE_RECOVERY_VALIDATION_FAIL,
            "reason": "INDEPENDENT_RESPONSE_EVIDENCE_INCOMPLETE",
            "missing": _ordered_unique(missing_response_evidence),
        }
    choices = source_payload.get("choices")
    choices = choices if isinstance(choices, list) else []
    normalized_choices = [_answer_text(choice) for choice in choices]
    resolution = resolve_independent_answer_against_choices(source_payload, independent_solve)
    answer = resolution["independentlyComputedValue"]
    matches = resolution["matchingChoiceIndices"]
    defects: list[str] = []
    multiple_response_contract = (
        independent_solve.get("answerCardinality") == "MULTIPLE"
        and independent_solve.get("answerUnique") is False
        and independent_solve.get("responseContractValid") is True
        and len(matches) > 1
    )
    if len(normalized_choices) != len(set(normalized_choices)):
        defects.append("DUPLICATE_CHOICES")
    signal_map = {
        "missingCondition": "MISSING_CONDITION",
        "missing_condition": "MISSING_CONDITION",
        "underdetermined": "UNDERDETERMINED_STEM",
        "contradictoryConditions": "CONTRADICTORY_CONDITIONS",
        "contradictory_conditions": "CONTRADICTORY_CONDITIONS",
        "domainValid": "INVALID_DOMAIN",
        "domain_valid": "INVALID_DOMAIN",
        "rangeValid": "INVALID_RANGE",
        "range_valid": "INVALID_RANGE",
        "targetValid": "QUESTION_TARGET_DEFECT",
        "target_valid": "QUESTION_TARGET_DEFECT",
    }
    for signal_source in (source_payload, independent_solve):
        for field, defect in signal_map.items():
            value = signal_source.get(field)
            if value is False or value is True and defect in {"MISSING_CONDITION", "UNDERDETERMINED_STEM", "CONTRADICTORY_CONDITIONS"}:
                defects.append(defect)
        for signal in signal_source.get("defectSignals", []):
            if signal in DEFECT_TYPES:
                defects.append(signal)
    resolution_blocked = answer.upper() in _ANSWER_RESOLUTION_BLOCKERS
    if independent_solve.get("answerUnique") is False and not multiple_response_contract and not resolution_blocked:
        defects.append("MULTIPLE_CORRECT_ANSWERS" if choices else "RESPONSE_FORM_DEFECT")
    if independent_solve.get("responseContractValid") is False:
        defects.append("RESPONSE_FORM_DEFECT")
    if choices and len(matches) == 0 and not resolution_blocked:
        defects.append("NO_CORRECT_ANSWER")
    if len(matches) > 1 and not multiple_response_contract:
        defects.append("MULTIPLE_CORRECT_ANSWERS")
    source_answer = _answer_text(source_payload.get("answer"))
    source_answer_indices = canonical_answer_to_choice_indices(source_answer) if choices else []
    if source_answer and choices and multiple_response_contract:
        if sorted(source_answer_indices) != sorted(matches):
            defects.append("ANSWER_KEY_CONFLICT")
    elif source_answer and choices and len(matches) == 1 and source_answer_indices != matches:
        defects.append("ANSWER_KEY_CONFLICT")
    elif source_answer and not choices and answer and not resolution_blocked and not _answer_values_equivalent(source_answer, answer):
        defects.append("ANSWER_KEY_CONFLICT")
    defects = _ordered_unique(defects)
    if not defects:
        return {
            "status": "NO_DEFECT",
            "defectTypes": [],
            "independentlyComputedValue": answer,
            "matchingChoiceIndices": matches,
            "canonicalArchiveAnswer": resolution["canonicalArchiveAnswer"],
        }
    return {
        "status": "ANSWER_KEY_DEFECT" if defects == ["ANSWER_KEY_CONFLICT"] else "QUESTION_PAYLOAD_DEFECT",
        "defectTypes": defects,
        "independentlyComputedValue": answer,
        "matchingChoiceIndices": matches,
        "canonicalArchiveAnswer": resolution["canonicalArchiveAnswer"],
    }


def _finalize_mcq_answer(payload: dict[str, Any], computed_value: str) -> dict[str, Any] | None:
    choices = payload.get("choices")
    if not isinstance(choices, list):
        return None
    normalized = [_answer_text(choice) for choice in choices]
    matches = [index + 1 for index, choice in enumerate(normalized) if choice == computed_value]
    if len(matches) != 1 or len(normalized) != len(set(normalized)):
        return None
    canonical = choice_index_to_canonical_answer(matches[0])
    if canonical is None:
        return None
    payload["answer"] = canonical
    payload.pop("recoveryReplacementChoice", None)
    return payload


def _bounded_replacement_choice(choices: list[Any], answer: str, supplied: Any = None) -> Any | None:
    normalized = {_answer_text(choice) for choice in choices}
    if supplied is not None and _answer_text(supplied) != answer and _answer_text(supplied) not in normalized:
        return supplied
    try:
        numeric_values = [int(_answer_text(choice)) for choice in choices]
        numeric_answer = int(answer)
    except ValueError:
        # Symbolic/radical answers are still bounded R1 repairs when the
        # independent verifier can prove the replacement is a distractor.
        # Keep the proposal deterministic and let the blind verifier reject
        # any mathematically unsafe replacement.
        for candidate in ("0", "1", "-1", "2", "-2", "3", "-3", "4", "-4", "5", "-5"):
            if candidate != answer and candidate not in normalized:
                return candidate
        return None
    for delta in range(1, 33):
        for candidate in (numeric_answer + delta, numeric_answer - delta, max(numeric_values) + delta):
            text = str(candidate)
            if text != answer and text not in normalized:
                return text
    return None


def _r1_no_correct_answer_payload(
    payload: dict[str, Any],
    answer: str,
    matches: list[Any],
) -> tuple[dict[str, Any], str] | None:
    if matches:
        return None
    choices = list(payload.get("choices") or [])
    if not choices:
        return None
    replace_index = next((index for index, choice in enumerate(choices) if _answer_text(choice) != answer), 0)
    choices[replace_index] = answer
    payload["choices"] = choices
    finalized = _finalize_mcq_answer(payload, answer)
    return (finalized, "NO_CORRECT_ANSWER") if finalized is not None else None


def _r1_multiple_answers_payload(
    payload: dict[str, Any],
    answer: str,
    matches: list[Any],
) -> tuple[dict[str, Any], str] | None:
    if len(matches) < 2:
        return None
    choices = list(payload.get("choices") or [])
    replacement = _bounded_replacement_choice(choices, answer, payload.get("recoveryReplacementChoice"))
    if replacement is None:
        return None
    replace_index = int(matches[-1]) - 1 if isinstance(matches[-1], int) else None
    if replace_index is None or not 0 <= replace_index < len(choices):
        return None
    if _answer_text(replacement) == answer or _answer_text(replacement) in {_answer_text(choice) for choice in choices}:
        return None
    choices[replace_index] = replacement
    payload["choices"] = choices
    finalized = _finalize_mcq_answer(payload, answer)
    return (finalized, "MULTIPLE_CORRECT_ANSWERS") if finalized is not None else None


def _r1_duplicate_choices_payload(
    payload: dict[str, Any],
    answer: str,
) -> tuple[dict[str, Any], str] | None:
    choices = list(payload.get("choices") or [])
    normalized = [_answer_text(choice) for choice in choices]
    duplicate_index = next((index for index, value in enumerate(normalized) if value and value in normalized[:index]), None)
    replacement = _bounded_replacement_choice(choices, answer, payload.get("recoveryReplacementChoice"))
    if duplicate_index is None or replacement is None:
        return None
    if _answer_text(replacement) == answer or _answer_text(replacement) in set(normalized):
        return None
    choices[duplicate_index] = replacement
    payload["choices"] = choices
    finalized = _finalize_mcq_answer(payload, answer)
    return (finalized, "DUPLICATE_CHOICES") if finalized is not None else None


def _r3_missing_condition_payload(
    payload: dict[str, Any],
    answer: str,
    independent_solve: Mapping[str, Any],
) -> tuple[dict[str, Any], str] | None:
    condition = payload.pop("recoveryCondition", None)
    if not isinstance(condition, str) or not condition.strip() or not payload.get("content"):
        return None
    payload["content"] = f"{payload['content']} 단, {condition.strip()}"
    payload["answer"] = answer
    if independent_solve.get("solution") is not None:
        payload["solution"] = independent_solve["solution"]
    return payload, "MISSING_CONDITION"


def _completed_empty_attempt(tier: str) -> dict[str, Any]:
    body = {"tier": tier, "generatedCandidateCount": 0, "candidateBudget": 1, "retryBudget": 0}
    return {
        "producerStatus": "COMPLETED",
        "attemptCount": 1,
        "candidateBudget": 1,
        "candidateBudgetConsumed": 1,
        "retryBudget": 0,
        "retryBudgetConsumed": True,
        "generatedCandidateCount": 0,
        "attemptEvidenceRef": f"recovery-attempt-{tier}",
        "attemptEvidenceSha": _prefixed_sha(body),
        "allProducedCandidatesRejected": True,
    }


def produce_recovery_candidates(
    source_payload: Mapping[str, Any],
    independent_solve: Mapping[str, Any],
    diagnosis: Mapping[str, Any],
    *,
    recovery_plan_id: str,
    builder_session_id: str = "recovery-builder",
) -> tuple[dict[str, list[dict[str, Any]]], dict[str, dict[str, Any]]]:
    """Build the bounded R0/R1 candidate and verifier handoff artifacts."""

    defect_types = diagnosis.get("defectTypes", [])
    primary = primary_tier(defect_types)
    payload = copy.deepcopy(dict(source_payload))
    payload.pop("sourceEvidence", None)
    payload.pop("answer", None)
    payload.pop("solution", None)
    if primary == "R0":
        computed_value = _independent_computed_value(independent_solve)
        if _is_mcq_payload(payload):
            finalized = _finalize_mcq_answer(payload, computed_value)
            if finalized is None:
                return {"R0": []}, {"R0": _completed_empty_attempt("R0")}
            payload = finalized
        else:
            payload["answer"] = computed_value
        if independent_solve.get("solution") is not None:
            payload["solution"] = independent_solve["solution"]
    elif primary == "R1":
        choices = list(payload.get("choices") or [])
        answer = _independent_computed_value(independent_solve)
        matches = diagnosis.get("matchingChoiceIndices") or []
        produced = (
            _r1_duplicate_choices_payload(payload, answer)
            if "DUPLICATE_CHOICES" in defect_types
            else _r1_multiple_answers_payload(payload, answer, matches)
            if "MULTIPLE_CORRECT_ANSWERS" in defect_types
            else _r1_no_correct_answer_payload(payload, answer, matches)
        )
        if produced is None:
            return {"R1": []}, {"R1": _completed_empty_attempt("R1")}
        payload, producer_kind = produced
    elif primary == "R3" and "MISSING_CONDITION" in defect_types:
        produced = _r3_missing_condition_payload(
            payload,
            _independent_computed_value(independent_solve),
            independent_solve,
        )
        if produced is None:
            return {"R3": []}, {"R3": _completed_empty_attempt("R3")}
        payload, producer_kind = produced
    else:
        return {}, {}
    candidate = make_candidate_version(recovery_plan_id, payload, candidate_version=1)
    candidate["builderSessionId"] = builder_session_id
    candidate["producerKind"] = "ANSWER_KEY_CONFLICT" if primary == "R0" else producer_kind
    attempt_body = {"tier": primary, "generatedCandidateCount": 1, "candidateId": candidate["candidateId"], "candidatePayloadSha256": candidate["payloadSha256"]}
    attempt = {
        "producerStatus": "COMPLETED",
        "attemptCount": 1,
        "candidateBudget": 3,
        "candidateBudgetConsumed": 1,
        "retryBudget": 1,
        "retryBudgetConsumed": False,
        "generatedCandidateCount": 1,
        "attemptEvidenceRef": f"recovery-attempt-{primary}",
        "attemptEvidenceSha": _prefixed_sha(attempt_body),
        "allProducedCandidatesRejected": False,
    }
    return {primary: [candidate]}, {primary: attempt}


def candidate_acceptance(
    candidate: Mapping[str, Any],
    *,
    recovery_tier: str,
    independent_verification: str | None = None,
    verifier_evidence: Mapping[str, Any] | None = None,
) -> dict[str, Any]:
    """Reduce explicit gate evidence without accepting missing gates."""

    _require_enum(recovery_tier, TIERS, "recoveryTier")
    payload = candidate.get("payload")
    if not isinstance(payload, Mapping):
        raise SourceRecoveryError("candidate payload is required")
    validator_result = validate_validator_evidence(candidate, candidate.get("validatorEvidence"))
    gate_status = validator_result["gates"]
    evidence = verifier_evidence or candidate.get("verifierEvidence")
    verifier_result = validate_verifier_evidence(candidate, evidence)
    verifier = str(
        independent_verification
        if independent_verification is not None
        else evidence.get("mathVerdict", "NOT_TESTED")
        if isinstance(evidence, Mapping)
        else "NOT_TESTED"
    ).upper()
    failed = [name for name, status in gate_status.items() if status != "PASS"]
    failed.extend(validator_result["errors"])
    if verifier_result["status"] != "PASS":
        failed.extend(verifier_result["errors"])
    if verifier != "PASS":
        failed.append("INDEPENDENT_VERIFICATION_NOT_PASS")
    if independent_verification is not None and (
        not isinstance(evidence, Mapping)
        or verifier != str(evidence.get("mathVerdict", "")).upper()
    ):
        failed.append("INDEPENDENT_VERIFICATION_VERDICT_MISMATCH")
    return {
        "status": "PASS" if not failed else "FAIL",
        "recoveryTier": recovery_tier,
        "gates": gate_status,
        "independentVerification": verifier,
        "verifierEvidence": verifier_result,
        "validatorEvidence": validator_result,
        "failedGates": failed,
    }


def rank_candidates(candidates: Iterable[Mapping[str, Any]]) -> dict[str, Any]:
    """Select one PASS candidate using deterministic contract-level ranking."""

    accepted = [item for item in candidates if item.get("acceptance", {}).get("status") == "PASS"]
    if not accepted:
        raise SourceRecoveryError("no independently verified recovery candidate")

    def key(item: Mapping[str, Any]) -> tuple[Any, ...]:
        acceptance = item.get("acceptance", {})
        payload = item.get("payload", {})
        ranking = payload.get("recoveryRanking", {}) if isinstance(payload, Mapping) else {}
        # Higher semantic preservation wins; lower mutation cost wins.  The
        # stable candidate id is the final tie-break and is never the answer.
        return (
            -int(ranking.get("mathCompleteness", 0)),
            -int(ranking.get("curriculum", 0)),
            -int(ranking.get("coreConcept", 0)),
            -int(ranking.get("problemType", 0)),
            -int(ranking.get("solutionGraph", 0)),
            -int(ranking.get("difficultyRole", 0)),
            int(ranking.get("semanticMutationCost", 0)),
            int(ranking.get("surfaceMutationCost", 0)),
            str(item.get("candidateId", "")),
        )

    return copy.deepcopy(sorted(accepted, key=key)[0])


def _required_replacement_fields(item: Mapping[str, Any]) -> list[str]:
    required = (
        "sourceQuestionUid",
        "recoveredQuestionUid",
        "replacementCardinality",
        "sourceOriginalPreserved",
        "productionOriginalActive",
        "productionRecoveredActive",
        "replacementLineageParity",
        "recoveredQualityClosure",
        "replacementEvidenceRef",
        "replacementEvidenceSha",
        "recoveryAuthority",
        "productionAdoptionStatus",
    )
    return [field for field in required if field not in item]


def validate_replacement(
    item: Mapping[str, Any],
    initial_scope_uids: Iterable[str],
    initial_scope_sha256: str | None = None,
) -> dict[str, Any]:
    """Validate a one-to-one derived replacement without changing state."""

    replacement = item.get("replacement") if isinstance(item.get("replacement"), Mapping) else item
    errors: list[str] = []
    combined = {**dict(item), **dict(replacement)}
    missing = _required_replacement_fields(combined)
    if missing:
        errors.append("REPLACEMENT_FIELDS_MISSING:" + ",".join(missing))
    initial = _ordered_unique(initial_scope_uids)
    if initial_scope_sha256 is not None and initial_scope_sha256 != _prefixed_sha(sorted(initial)):
        errors.append("INITIAL_SCOPE_UID_SET_SHA_MISMATCH")
    source_uid = combined.get("sourceQuestionUid")
    recovered_uid = combined.get("recoveredQuestionUid")
    if source_uid not in initial:
        errors.append(CODE_DERIVED_REPLACEMENT_LINEAGE_FAIL)
    if not isinstance(recovered_uid, str) or not recovered_uid or recovered_uid == source_uid:
        errors.append(CODE_DERIVED_REPLACEMENT_LINEAGE_FAIL)
    if combined.get("replacementCardinality") != "1:1":
        errors.append(CODE_DERIVED_REPLACEMENT_CARDINALITY_FAIL)
    if combined.get("sourceOriginalPreserved") is not True:
        errors.append(CODE_DERIVED_REPLACEMENT_LINEAGE_FAIL)
    if combined.get("productionOriginalActive") is not False or combined.get("productionRecoveredActive") is not True:
        errors.append(CODE_DERIVED_REPLACEMENT_PARITY_FAIL)
    if combined.get("replacementLineageParity") != "PASS":
        errors.append(CODE_DERIVED_REPLACEMENT_PARITY_FAIL)
    if combined.get("recoveredQualityClosure") != "PASS":
        errors.append(CODE_DERIVED_REPLACEMENT_QUALITY_CLOSURE_FAIL)
    if not re.fullmatch(r"sha256:[0-9a-f]{64}", str(combined.get("replacementEvidenceSha", ""))):
        errors.append(CODE_DERIVED_REPLACEMENT_LINEAGE_FAIL)
    if combined.get("recoveryAuthority") not in {"BOUNDED_PRODUCTION", "DEFAULT_PRODUCTION"}:
        errors.append(CODE_SOURCE_RECOVERY_UNAUTHORIZED_ADOPTION)
    if combined.get("productionAdoptionStatus") != "ADOPTED":
        errors.append(CODE_SOURCE_RECOVERY_UNAUTHORIZED_ADOPTION)
    return {
        "status": "PASS" if not errors else "FAIL",
        "errors": _ordered_unique(errors),
        "replacementCardinality": item.get("replacementCardinality"),
        "sourceQuestionUid": source_uid,
        "recoveredQuestionUid": recovered_uid,
    }


def validate_closure_evidence(
    evidence: Mapping[str, Any] | None,
    *,
    name: str,
    evidence_root: Path | None = None,
    expected_bindings: Mapping[str, Any] | None = None,
) -> dict[str, Any]:
    """Read and hash a closure receipt, then verify every adoption binding."""

    errors: list[str] = []
    if not isinstance(evidence, Mapping):
        return {"status": "FAIL", "errors": [f"{name.upper()}_EVIDENCE_REQUIRED"]}
    for field in ("evidenceId", "evidenceRef", "evidenceSha256"):
        if not evidence.get(field):
            errors.append(f"{name.upper()}_EVIDENCE_FIELD_MISSING:{field}")
    if evidence.get("status") != "PASS":
        errors.append(f"{name.upper()}_EVIDENCE_NOT_PASS")
    if not re.fullmatch(r"sha256:[0-9a-f]{64}", str(evidence.get("evidenceSha256", ""))):
        errors.append(f"{name.upper()}_EVIDENCE_SHA_INVALID")
    artifact: Any = None
    artifact_path: Path | None = None
    if evidence_root is None:
        errors.append(f"{name.upper()}_EVIDENCE_ROOT_REQUIRED")
    elif isinstance(evidence.get("evidenceRef"), str) and evidence.get("evidenceRef"):
        root = Path(evidence_root).resolve()
        candidate_path = Path(str(evidence["evidenceRef"]))
        artifact_path = (candidate_path if candidate_path.is_absolute() else root / candidate_path).resolve()
        try:
            artifact_path.relative_to(root)
        except ValueError:
            errors.append(f"{name.upper()}_EVIDENCE_REF_OUTSIDE_ROOT")
            artifact_path = None
        if artifact_path is not None and not artifact_path.is_file():
            errors.append(f"{name.upper()}_EVIDENCE_FILE_MISSING")
        elif artifact_path is not None:
            actual_sha = f"sha256:{sha256_file(artifact_path)}"
            if actual_sha != evidence.get("evidenceSha256"):
                errors.append(f"{name.upper()}_EVIDENCE_SHA_MISMATCH")
            try:
                artifact = json.loads(artifact_path.read_text(encoding="utf-8"))
            except (OSError, UnicodeError, json.JSONDecodeError):
                errors.append(f"{name.upper()}_EVIDENCE_JSON_INVALID")
    if isinstance(artifact, Mapping):
        if artifact.get("evidenceId") != evidence.get("evidenceId"):
            errors.append(f"{name.upper()}_EVIDENCE_ID_MISMATCH")
        if artifact.get("status") != "PASS" or artifact.get("status") != evidence.get("status"):
            errors.append(f"{name.upper()}_ARTIFACT_NOT_PASS")
        for field, expected in (expected_bindings or {}).items():
            if artifact.get(field) != expected:
                errors.append(f"{name.upper()}_BINDING_MISMATCH:{field}")
        if name == "quality_closure":
            gates = artifact.get("qualityGateResults")
            if not isinstance(gates, Mapping) or not gates or any(status != "PASS" for status in gates.values()):
                errors.append("QUALITY_CLOSURE_GATES_NOT_PASS")
        if name == "lineage_parity":
            required = {
                "slotUid": (expected_bindings or {}).get("sourceQuestionUid"),
                "replacementCardinality": "1:1",
                "sourceOriginalPreserved": True,
            }
            for field, expected in required.items():
                if artifact.get(field) != expected:
                    errors.append(f"LINEAGE_PARITY_BINDING_MISMATCH:{field}")
    elif artifact_path is not None and artifact_path.is_file():
        errors.append(f"{name.upper()}_EVIDENCE_OBJECT_REQUIRED")
    return {
        "status": "PASS" if not errors else "FAIL",
        "errors": _ordered_unique(errors),
        "artifact": copy.deepcopy(dict(artifact)) if isinstance(artifact, Mapping) else None,
    }


def _bound_path(root: Path | None, reference: Any, error_prefix: str) -> tuple[Path | None, list[str]]:
    if root is None:
        return None, [f"{error_prefix}_ROOT_REQUIRED"]
    if not isinstance(reference, str) or not reference:
        return None, [f"{error_prefix}_REF_REQUIRED"]
    resolved_root = Path(root).resolve()
    resolved = (Path(reference) if Path(reference).is_absolute() else resolved_root / reference).resolve()
    try:
        resolved.relative_to(resolved_root)
    except ValueError:
        return None, [f"{error_prefix}_REF_OUTSIDE_ROOT"]
    if not resolved.is_file():
        return None, [f"{error_prefix}_FILE_MISSING"]
    return resolved, []


def validate_final_artifact_binding(
    item: Mapping[str, Any],
    *,
    artifact_root: Path | None,
    evidence_root: Path | None = None,
) -> dict[str, Any]:
    """Verify the materialized student artifact and its replacement receipt."""

    errors: list[str] = []
    final_ref = item.get("finalArtifactRef")
    final_sha = item.get("finalArtifactSha256")
    if not re.fullmatch(r"sha256:[0-9a-f]{64}", str(final_sha or "")):
        errors.append("FINAL_ARTIFACT_SHA_INVALID")
    for field in ("afterPayloadSha256", "sourceLockSha256", "initialIncludedScopeUidSetSha256"):
        if not isinstance(item.get(field), str) or not item.get(field):
            errors.append(f"FINAL_ARTIFACT_{field.upper()}_MISSING")
    final_path, path_errors = _bound_path(artifact_root, final_ref, "FINAL_ARTIFACT")
    errors.extend(path_errors)
    if final_path is not None and re.fullmatch(r"sha256:[0-9a-f]{64}", str(final_sha or "")):
        if f"sha256:{sha256_file(final_path)}" != final_sha:
            errors.append("FINAL_ARTIFACT_SHA_MISMATCH")
    if evidence_root is not None:
        evidence_path, evidence_path_errors = _bound_path(evidence_root, item.get("replacementEvidenceRef"), "REPLACEMENT_EVIDENCE")
        errors.extend(evidence_path_errors)
        if evidence_path is not None:
            actual_evidence_sha = f"sha256:{sha256_file(evidence_path)}"
            if actual_evidence_sha != item.get("replacementEvidenceSha"):
                errors.append("REPLACEMENT_EVIDENCE_SHA_MISMATCH")
            try:
                evidence = json.loads(evidence_path.read_text(encoding="utf-8"))
            except (OSError, UnicodeError, json.JSONDecodeError):
                errors.append("REPLACEMENT_EVIDENCE_JSON_INVALID")
            else:
                if evidence.get("status") != "PASS":
                    errors.append("REPLACEMENT_EVIDENCE_ARTIFACT_NOT_PASS")
                for field in (
                    "sourceQuestionUid",
                    "recoveredQuestionUid",
                    "effectiveArtifactUid",
                    "candidatePayloadSha256",
                    "sourceLockSha256",
                    "initialIncludedScopeUidSetSha256",
                    "finalArtifactSha256",
                ):
                    expected = item.get(field)
                    if field == "candidatePayloadSha256":
                        expected = item.get("afterPayloadSha256")
                    if evidence.get(field) != expected and not (
                        field == "candidatePayloadSha256" and evidence.get(field) == item.get("afterPayloadSha256")
                    ):
                        errors.append(f"REPLACEMENT_EVIDENCE_BINDING_MISMATCH:{field}")
                if evidence.get("finalArtifactRef") != final_ref:
                    errors.append("REPLACEMENT_EVIDENCE_BINDING_MISMATCH:finalArtifactRef")
                if evidence.get("replacementCardinality") not in {None, "1:1"}:
                    errors.append("REPLACEMENT_EVIDENCE_CARDINALITY_INVALID")
                if evidence.get("sourceOriginalPreserved") not in {None, True}:
                    errors.append("REPLACEMENT_EVIDENCE_LINEAGE_INVALID")
        quality_ref = item.get("qualityClosureEvidenceRef")
        quality_sha = item.get("qualityClosureEvidenceSha")
        if not re.fullmatch(r"sha256:[0-9a-f]{64}", str(quality_sha or "")):
            errors.append("QUALITY_CLOSURE_EVIDENCE_SHA_INVALID")
        quality_path, quality_path_errors = _bound_path(evidence_root, quality_ref, "QUALITY_CLOSURE_EVIDENCE")
        errors.extend(quality_path_errors)
        if quality_path is not None:
            if f"sha256:{sha256_file(quality_path)}" != quality_sha:
                errors.append("QUALITY_CLOSURE_EVIDENCE_SHA_MISMATCH")
            try:
                quality = json.loads(quality_path.read_text(encoding="utf-8"))
            except (OSError, UnicodeError, json.JSONDecodeError):
                errors.append("QUALITY_CLOSURE_EVIDENCE_JSON_INVALID")
            else:
                for field in (
                    "sourceQuestionUid",
                    "recoveredQuestionUid",
                    "effectiveArtifactUid",
                    "candidatePayloadSha256",
                    "sourceLockSha256",
                    "initialIncludedScopeUidSetSha256",
                    "finalArtifactSha256",
                    "finalArtifactRef",
                ):
                    expected = item.get(field) if field != "candidatePayloadSha256" else item.get("afterPayloadSha256")
                    if quality.get(field) != expected:
                        errors.append(f"QUALITY_CLOSURE_EVIDENCE_BINDING_MISMATCH:{field}")
                gates = quality.get("qualityGateResults")
                if quality.get("status") != "PASS" or not isinstance(gates, Mapping) or not gates or any(status != "PASS" for status in gates.values()):
                    errors.append("QUALITY_CLOSURE_EVIDENCE_NOT_PASS")
    return {"status": "PASS" if not errors else "FAIL", "errors": _ordered_unique(errors)}


def validate_authorization_scope(
    recovered: Mapping[str, Any],
    authorization: Mapping[str, Any] | None,
) -> dict[str, Any]:
    """Validate the narrow runtime scope permitted to adopt a recovery."""

    errors: list[str] = []
    if not isinstance(authorization, Mapping):
        return {"status": "FAIL", "errors": ["RECOVERY_AUTHORIZATION_REQUIRED"]}
    if authorization.get("scopeAuthorizationStatus") != "PASS":
        errors.append("RECOVERY_SCOPE_AUTHORIZATION_NOT_PASS")
    scope = authorization.get("authorizedScope")
    if not isinstance(scope, Mapping):
        return {"status": "FAIL", "errors": _ordered_unique([*errors, "RECOVERY_AUTHORIZED_SCOPE_REQUIRED"])}
    authority = recovered.get("recoveryAuthority")
    declared_authority = authorization.get("authority", scope.get("authority"))
    if declared_authority != authority:
        errors.append("RECOVERY_AUTHORIZATION_AUTHORITY_MISMATCH")

    allowed_sources = scope.get("allowedSourceQuestionUids")
    if scope.get("sourceQuestionUid") != recovered.get("sourceQuestionUid") and not (
        isinstance(allowed_sources, list) and recovered.get("sourceQuestionUid") in allowed_sources
    ):
        errors.append("RECOVERY_AUTHORIZED_SOURCE_OUT_OF_SCOPE")

    allowed_tiers = scope.get("allowedRecoveryTiers")
    if scope.get("recoveryTier") != recovered.get("recoveryTier") and not (
        isinstance(allowed_tiers, list) and recovered.get("recoveryTier") in allowed_tiers
    ):
        errors.append("RECOVERY_AUTHORIZED_TIER_OUT_OF_SCOPE")

    authorized_defects = scope.get("defectTypes")
    if authorized_defects is None:
        authorized_defects = scope.get("allowedDefectTypes")
    if authorized_defects is None and scope.get("defectType") is not None:
        authorized_defects = [scope.get("defectType")]
    source_defects = recovered.get("sourceDefectTypes") or []
    if not isinstance(authorized_defects, list) or any(defect not in authorized_defects for defect in source_defects):
        errors.append("RECOVERY_AUTHORIZED_DEFECT_OUT_OF_SCOPE")

    for field in ("runId", "batchId"):
        if recovered.get(field) is not None and scope.get(field) != recovered.get(field):
            errors.append(f"RECOVERY_AUTHORIZED_{field.upper()}_OUT_OF_SCOPE")
    return {"status": "PASS" if not errors else "FAIL", "errors": _ordered_unique(errors)}


def atomic_adopt_replacement(
    recovered: Mapping[str, Any],
    *,
    authorization: Mapping[str, Any],
    initial_scope_uids: Iterable[str],
    initial_scope_sha256: str,
    quality_closure_evidence: Mapping[str, Any] | None = None,
    lineage_parity_evidence: Mapping[str, Any] | None = None,
    evidence_root: Path | None = None,
    artifact_root: Path | None = None,
) -> dict[str, Any]:
    """Perform AUTHORIZED -> ADOPTED and disposition in one returned snapshot.

    The input remains unchanged on both success and failure.  The function
    intentionally has no intermediate ``ADOPTED`` representation.
    """

    if recovered.get("status") != "RECOVERED":
        raise SourceRecoveryError("only a RECOVERED artifact can be adopted")
    if recovered.get("productionAdoptionStatus") != "AUTHORIZED":
        raise SourceRecoveryError("production adoption must be AUTHORIZED first")
    authority = recovered.get("recoveryAuthority")
    if authority not in {"BOUNDED_PRODUCTION", "DEFAULT_PRODUCTION"}:
        raise SourceRecoveryError(CODE_SOURCE_RECOVERY_UNAUTHORIZED_ADOPTION)
    if not isinstance(authorization, Mapping) or authorization.get("status") != "PASS" or not authorization.get("authorizationRef"):
        raise SourceRecoveryError("recovery authorization scope is not proven")
    authorization_scope = validate_authorization_scope(recovered, authorization)
    if authorization_scope["status"] != "PASS":
        raise SourceRecoveryError(";".join(authorization_scope["errors"]))
    final_artifact_check = validate_final_artifact_binding(recovered, artifact_root=artifact_root)
    if final_artifact_check["status"] != "PASS":
        raise SourceRecoveryError(";".join(final_artifact_check["errors"]))
    expected_bindings = {
        "sourceQuestionUid": recovered.get("sourceQuestionUid"),
        "recoveredQuestionUid": recovered.get("recoveredQuestionUid"),
        "effectiveArtifactUid": recovered.get("effectiveArtifactUid"),
        "candidateId": recovered.get("selectedCandidateId"),
        "candidateVersion": recovered.get("selectedCandidateVersion"),
        "candidatePayloadSha256": recovered.get("afterPayloadSha256"),
        "sourceLockSha256": recovered.get("sourceLockSha256"),
        "initialIncludedScopeUidSetSha256": recovered.get("initialIncludedScopeUidSetSha256"),
        "finalArtifactRef": recovered.get("finalArtifactRef"),
        "finalArtifactSha256": recovered.get("finalArtifactSha256"),
    }
    quality_evidence = validate_closure_evidence(
        quality_closure_evidence,
        name="quality_closure",
        evidence_root=evidence_root,
        expected_bindings=expected_bindings,
    )
    lineage_evidence = validate_closure_evidence(
        lineage_parity_evidence,
        name="lineage_parity",
        evidence_root=evidence_root,
        expected_bindings=expected_bindings,
    )
    if quality_evidence["status"] != "PASS":
        raise SourceRecoveryError(CODE_DERIVED_REPLACEMENT_QUALITY_CLOSURE_FAIL)
    if lineage_evidence["status"] != "PASS":
        raise SourceRecoveryError(CODE_DERIVED_REPLACEMENT_PARITY_FAIL)

    next_state = copy.deepcopy(dict(recovered))
    next_state["productionAdoptionStatus"] = "ADOPTED"
    next_state["replacementDisposition"] = "DERIVED_REPLACEMENT_VERIFIED"
    next_state["productionOriginalActive"] = False
    next_state["productionRecoveredActive"] = True
    next_state["replacementCardinality"] = "1:1"
    next_state["replacementLineageParity"] = "PASS"
    next_state["recoveredQualityClosure"] = "PASS"
    next_state["replacementEvidenceRef"] = lineage_parity_evidence["evidenceRef"]
    next_state["replacementEvidenceSha"] = lineage_parity_evidence["evidenceSha256"]
    next_state["replacement"] = {
        "status": "DERIVED_REPLACEMENT_VERIFIED",
        "replacementCardinality": "1:1",
        "productionOriginalActive": False,
        "productionRecoveredActive": True,
        "replacementLineageParity": "PASS",
        "recoveredQualityClosure": "PASS",
        "replacementEvidenceRef": lineage_parity_evidence["evidenceRef"],
        "replacementEvidenceSha": lineage_parity_evidence["evidenceSha256"],
    }
    next_state["authorizationRef"] = authorization["authorizationRef"]
    next_state["authorizationAuthority"] = authorization.get("authority", recovered.get("recoveryAuthority"))
    next_state["scopeAuthorizationStatus"] = authorization["scopeAuthorizationStatus"]
    next_state["authorizedScope"] = copy.deepcopy(dict(authorization["authorizedScope"]))
    next_state["qualityClosureEvidenceRef"] = quality_closure_evidence["evidenceRef"]
    next_state["qualityClosureEvidenceSha"] = quality_closure_evidence["evidenceSha256"]
    final_seal = validate_final_artifact_binding(next_state, artifact_root=artifact_root, evidence_root=evidence_root)
    if final_seal["status"] != "PASS":
        raise SourceRecoveryError(";".join(final_seal["errors"]))
    parity = validate_replacement(next_state, initial_scope_uids, initial_scope_sha256)
    if parity["status"] != "PASS":
        raise SourceRecoveryError(";".join(parity["errors"]))
    return next_state


def run_source_recovery(
    *,
    source_question_uid: str,
    source_lock_sha256: str,
    defect_types: Iterable[str] | None = None,
    source_recovery_policy: str = "SHADOW_AUTO_RECOVER",
    recovery_authority: str = "SHADOW_ONLY",
    initial_scope_uids: Iterable[str] | None = None,
    source_evidence_available: bool = True,
    required_resource: str = "SOURCE_PAGE",
    capabilities: Mapping[str, Any] | None = None,
    candidates_by_tier: Mapping[str, Iterable[Mapping[str, Any]]] | None = None,
    attempts_by_tier: Mapping[str, Mapping[str, Any]] | None = None,
    source_payload: Mapping[str, Any] | None = None,
    independent_solve: Mapping[str, Any] | None = None,
    builder_session_id: str = "recovery-builder",
    verifier_id: str = "recovery-blind-verifier",
    verifier_session_id: str = "recovery-verifier-session",
    blind_verifier: Any | None = None,
    validator: Any | None = None,
    authorization: Mapping[str, Any] | None = None,
    quality_closure_evidence: Mapping[str, Any] | None = None,
    lineage_parity_evidence: Mapping[str, Any] | None = None,
    recovery_plan_id: str | None = None,
    evidence_root: Path | None = None,
    artifact_root: Path | None = None,
    final_artifact_ref: str | None = None,
    final_artifact_sha256: str | None = None,
) -> dict[str, Any]:
    """Route one source question through the bounded recovery contract.

    R0/R1 bounded generation is built in for a locked source payload plus an
    independent solve.  Higher-tier or model-backed producers may still inject
    frozen candidates through ``candidates_by_tier``; every path uses the same
    blind-verification and release-safety reducer.
    """

    if not source_question_uid or not source_lock_sha256:
        raise SourceRecoveryError("sourceQuestionUid and sourceLockSha256 are required")
    _require_enum(source_recovery_policy, RECOVERY_POLICIES, "sourceRecoveryPolicy")
    _require_enum(recovery_authority, RECOVERY_AUTHORITIES, "recoveryAuthority")
    if not source_evidence_available:
        return source_evidence_blocked(required_resource, source_question_uid=source_question_uid, source_lock_sha256=source_lock_sha256)
    auto_diagnosis = None
    if defect_types is None:
        if source_payload is None or independent_solve is None:
            raise SourceRecoveryError("defectTypes or sourcePayload plus independentSolve is required")
        auto_diagnosis = diagnose_source_defects(source_payload, independent_solve)
        if auto_diagnosis["status"] == "SOURCE_RECOVERY_EVIDENCE_BLOCKED":
            return source_evidence_blocked(auto_diagnosis["requiredResource"], source_question_uid=source_question_uid, source_lock_sha256=source_lock_sha256)
        if auto_diagnosis["status"] == "EXTRACTION_DEFECT":
            return {
                "schemaVersion": SOURCE_RECOVERY_SCHEMA_VERSION,
                "sourceQuestionUid": source_question_uid,
                "status": "SOURCE_RECHECK",
                "finalStatus": "BLOCKED",
                "route": "SOURCE_FIDELITY_RESTORATION",
                "diagnosis": auto_diagnosis,
                "code": "SOURCE_RECHECK_REQUIRED",
                "resumeFromStage": "SOURCE_RECHECK",
                "nextAction": "RESTORE_EXTRACTION_TO_SOURCE",
                "productionAdoptionStatus": "NOT_AUTHORIZED",
                "candidatePool": [],
            }
        if auto_diagnosis["status"] == "SOURCE_RECOVERY_VALIDATION_FAILED":
            return {
                "schemaVersion": SOURCE_RECOVERY_SCHEMA_VERSION,
                "sourceQuestionUid": source_question_uid,
                "status": "RECOVERY_VALIDATION_FAILED",
                "finalStatus": "BLOCKED",
                "diagnosis": auto_diagnosis,
                "code": CODE_SOURCE_RECOVERY_VALIDATION_FAIL,
                "nextAction": "RECHECK_INDEPENDENT_SOLVE",
                "productionAdoptionStatus": "NOT_AUTHORIZED",
                "candidatePool": [],
            }
        if auto_diagnosis["status"] == "NO_DEFECT":
            return {
                "schemaVersion": SOURCE_RECOVERY_SCHEMA_VERSION,
                "sourceQuestionUid": source_question_uid,
                "status": "NOT_REQUIRED",
                "finalStatus": "PASS",
                "productionAdoptionStatus": "NOT_AUTHORIZED",
                "diagnosis": auto_diagnosis,
                "candidatePool": [],
            }
        defect_types = auto_diagnosis["defectTypes"]
        if candidates_by_tier is None:
            candidates_by_tier, generated_attempts = produce_recovery_candidates(
                source_payload,
                independent_solve,
                auto_diagnosis,
                recovery_plan_id=recovery_plan_id or f"RP-{source_question_uid}-{primary_tier(defect_types)}",
                builder_session_id=builder_session_id,
            )
            attempts_by_tier = {**(attempts_by_tier or {}), **generated_attempts}
    defects = _ordered_unique(defect_types or [])
    if not defects:
        return {
            "schemaVersion": SOURCE_RECOVERY_SCHEMA_VERSION,
            "sourceQuestionUid": source_question_uid,
            "status": "NOT_REQUIRED",
            "finalStatus": "PASS",
            "productionAdoptionStatus": "NOT_AUTHORIZED",
            "candidatePool": [],
        }
    raw_initial = list(initial_scope_uids or [source_question_uid])
    initial = _ordered_unique(raw_initial)
    if len(initial) != len(raw_initial):
        raise SourceRecoveryError("INITIAL_INCLUDED_SCOPE_UID_SET must be unique")
    initial_sha = _prefixed_sha(sorted(initial))
    if source_question_uid not in initial:
        raise SourceRecoveryError("source question must remain in INITIAL_INCLUDED_SCOPE_UID_SET")
    primary = primary_tier(defects)
    matrix = build_tier_matrix(defects, capabilities)
    base: dict[str, Any] = {
        "schemaVersion": SOURCE_RECOVERY_SCHEMA_VERSION,
        "sourceQuestionUid": source_question_uid,
        "sourceLockSha256": source_lock_sha256,
        "sourceDefectTypes": defects,
        "sourceRecoveryPolicy": source_recovery_policy,
        "recoveryAuthority": recovery_authority,
        "productionAdoptionStatus": "NOT_AUTHORIZED",
        "status": "SOURCE_DEFECT_CONFIRMED",
        "finalStatus": "BLOCKED",
        "currentRecoveryTier": primary,
        "tierMatrix": matrix,
        "recoveryPlanId": recovery_plan_id or f"RP-{source_question_uid}-{primary}",
        "candidateIndex": 0,
        "candidateVersion": 0,
        "candidatePool": [],
        "producerAttempts": {},
        "acceptedCandidates": [],
        "rejectedCandidates": [],
        "lastVerifierResult": None,
        "requiredResource": None,
        "resumeFromStage": None,
        "nextAction": "RECOVERY_SEARCH",
        "initialIncludedScopeUidSet": initial,
        "initialIncludedScopeUidSetSha256": initial_sha,
        "correctnessAffecting": defect_is_correctness_affecting(defects),
        "diagnosis": auto_diagnosis,
    }
    if final_artifact_ref is not None:
        base["finalArtifactRef"] = final_artifact_ref
    if final_artifact_sha256 is not None:
        base["finalArtifactSha256"] = final_artifact_sha256
    if source_recovery_policy == "PRESERVE_ONLY":
        base.update({
            "status": "PRESERVE_ONLY",
            "recoveryDisposition": "SOURCE_PRESERVED_ONLY",
            "nextAction": "CONTINUE_EXECUTION",
            "finalTarget": False,
        })
        return base

    candidates_by_tier = candidates_by_tier or {}
    attempts_by_tier = attempts_by_tier or {}
    for tier_index in range(int(primary[1:]), len(TIERS)):
        tier = f"R{tier_index}"
        row = base["tierMatrix"][tier]
        base["currentRecoveryTier"] = tier
        if row["capability"] != "ACTIVE":
            continue
        raw_candidates = list(candidates_by_tier.get(tier, ()))
        attempt = validate_producer_attempt(
            attempts_by_tier.get(tier),
            generated_candidate_count=len(raw_candidates),
        )
        if tier in attempts_by_tier:
            base["producerAttempts"][tier] = copy.deepcopy(attempts_by_tier[tier])
        if attempt["status"] != "PASS":
            row["execution"] = "AVAILABLE_PENDING"
            base["lastVerifierResult"] = {"producerAttempt": attempt}
            continue
        if not raw_candidates:
            row["execution"] = "ATTEMPTED_EXHAUSTED"
            continue
        accepted: list[dict[str, Any]] = []
        for raw in raw_candidates:
            payload = raw.get("payload") if isinstance(raw, Mapping) else None
            external_candidate = isinstance(raw, Mapping) and bool(raw.get("candidateId"))
            candidate = (
                copy.deepcopy(dict(raw))
                if external_candidate
                else make_candidate_version(
                    base["recoveryPlanId"],
                    payload if isinstance(payload, Mapping) else dict(raw),
                    candidate_version=base["candidateVersion"] + 1,
                )
            )
            candidate_version = candidate.get("candidateVersion")
            if isinstance(candidate_version, int) and not isinstance(candidate_version, bool):
                base["candidateVersion"] = max(base["candidateVersion"], candidate_version)
            trust_errors: list[str] = []
            if external_candidate:
                trust_errors.extend(validate_external_candidate(candidate, recovery_plan_id=base["recoveryPlanId"])["errors"])
                if blind_verifier is None:
                    candidate.pop("verifierEvidence", None)
                    trust_errors.append("EXTERNAL_CANDIDATE_VERIFIER_REDISPATCH_REQUIRED")
                else:
                    candidate["verifierEvidence"] = copy.deepcopy(blind_verifier(blind_candidate_view(candidate)))
                if validator is None:
                    candidate.pop("validatorEvidence", None)
                    trust_errors.append("EXTERNAL_CANDIDATE_VALIDATOR_REDISPATCH_REQUIRED")
                else:
                    candidate["validatorEvidence"] = copy.deepcopy(validator(candidate))
            else:
                if blind_verifier is not None:
                    candidate["verifierEvidence"] = copy.deepcopy(blind_verifier(blind_candidate_view(candidate)))
                if validator is not None:
                    candidate["validatorEvidence"] = copy.deepcopy(validator(candidate))
                elif not candidate.get("validatorEvidence"):
                    candidate["validatorEvidence"] = copy.deepcopy(build_validator_evidence(candidate))
            acceptance = candidate_acceptance(
                candidate,
                recovery_tier=tier,
                independent_verification=str(raw.get("independentVerification")) if isinstance(raw, Mapping) and raw.get("independentVerification") is not None else None,
                verifier_evidence=candidate.get("verifierEvidence"),
            )
            if trust_errors:
                acceptance["status"] = "FAIL"
                acceptance["failedGates"] = _ordered_unique([*acceptance.get("failedGates", []), *trust_errors])
            candidate["acceptance"] = acceptance
            base["candidatePool"].append(copy.deepcopy(candidate))
            base["candidateIndex"] += 1
            base["lastVerifierResult"] = acceptance
            if acceptance["status"] == "PASS":
                accepted.append(candidate)
                base["acceptedCandidates"].append(candidate["candidateId"])
            else:
                base["rejectedCandidates"].append(candidate["candidateId"])
        if not accepted:
            row["execution"] = "ATTEMPTED_EXHAUSTED" if (
                isinstance(attempts_by_tier.get(tier), Mapping)
                and attempts_by_tier[tier].get("allProducedCandidatesRejected") is True
                and validate_producer_attempt(
                    attempts_by_tier[tier],
                    generated_candidate_count=len(raw_candidates),
                )["status"] == "PASS"
            ) else "AVAILABLE_PENDING"
            continue
        row["execution"] = "ATTEMPTED_PASS"
        winner = rank_candidates(accepted)
        for skipped_index in range(tier_index + 1, len(TIERS)):
            skipped = base["tierMatrix"][f"R{skipped_index}"]
            if skipped["applicability"] == "APPLICABLE_FALLBACK" and skipped["execution"] == "NOT_RUN":
                skipped["execution"] = "SKIPPED_AFTER_LOWER_TIER_PASS"
        payload = winner["payload"]
        recovered_uid = payload.get("effectiveArtifactUid") or f"{source_question_uid}-R{winner['candidateVersion']}"
        disposition = "ANSWER_KEY_RECOVERED" if tier == "R0" else "MINIMAL_RECOVERED" if tier in {"R1", "R2"} else "STRUCTURAL_RECOVERED" if tier in {"R3", "R4", "R5"} else "RECOVERED_RECONSTRUCTION"
        base.update({
            "status": "RECOVERED",
            "recoveryTier": tier,
            "recoveryDisposition": disposition,
            "recoveredQuestionUid": recovered_uid,
            "effectiveArtifactUid": recovered_uid,
            "slotUid": source_question_uid,
            "selectedCandidateId": winner["candidateId"],
            "selectedCandidateVersion": winner["candidateVersion"],
            "beforePayloadSha256": payload.get("beforePayloadSha256"),
            "afterPayloadSha256": winner["payloadSha256"],
            "effectivePayloadSha256": winner["payloadSha256"],
            "mutations": copy.deepcopy(payload.get("mutations", [])),
            "sourceOriginalPreserved": True,
            "productionOriginalActive": True,
            "productionRecoveredActive": False,
            "finalTarget": False,
            "replacementDisposition": None,
            "nextAction": "QUALITY_CLOSURE",
        })
        if tier == "R0":
            base["answerKeyResolution"] = {
                "sourceAnswerKey": source_payload.get("answer") if isinstance(source_payload, Mapping) else None,
                "independentComputedValue": _answer_text((winner.get("verifierEvidence") or {}).get("independentlyComputedValue", (winner.get("verifierEvidence") or {}).get("independentlyComputedAnswer"))),
                "canonicalEffectiveAnswer": payload.get("answer"),
                "effectiveArtifactUid": recovered_uid,
                "effectiveArtifactSha256": winner["payloadSha256"],
                "lineageStatus": "PASS",
                "verifierEvidenceSha256": (winner.get("verifierEvidence") or {}).get("evidenceSha256"),
            }
        if source_recovery_policy == "AUTO_RECOVER" and recovery_authority != "SHADOW_ONLY":
            auth = authorization or {}
            if auth.get("status") == "PASS" and auth.get("authorizationRef"):
                scope_check = validate_authorization_scope(base, auth)
                if scope_check["status"] != "PASS":
                    base["codes"] = [CODE_SOURCE_RECOVERY_UNAUTHORIZED_ADOPTION]
                else:
                    base["productionAdoptionStatus"] = "AUTHORIZED"
                    try:
                        adopted = atomic_adopt_replacement(
                            base,
                            authorization=auth,
                            initial_scope_uids=initial,
                            initial_scope_sha256=initial_sha,
                            quality_closure_evidence=quality_closure_evidence,
                            lineage_parity_evidence=lineage_parity_evidence,
                            evidence_root=evidence_root,
                            artifact_root=artifact_root,
                        )
                    except SourceRecoveryError as error:
                        base["codes"] = [CODE_SOURCE_RECOVERY_VALIDATION_FAIL, CODE_DERIVED_REPLACEMENT_PARITY_FAIL]
                    else:
                        adopted["finalTarget"] = True
                        adopted["nextAction"] = "CONTINUE_EXECUTION"
                        return adopted
            else:
                base["codes"] = [CODE_SOURCE_RECOVERY_UNAUTHORIZED_ADOPTION]
        return base

    blocked = [
        row for row in base["tierMatrix"].values()
        if row["applicability"] != "NOT_APPLICABLE" and row["capability"] != "ACTIVE"
    ]
    if blocked:
        base.update({
            "status": "RECOVERY_DEFERRED_CAPABILITY" if any(row["capability"] == "DEFERRED_CAPABILITY" for row in blocked) else "RECOVERY_CAPABILITY_BLOCKED",
            "finalStatus": "BLOCKED",
            "code": CODE_SOURCE_RECOVERY_CAPABILITY_DEFERRED if any(row["capability"] == "DEFERRED_CAPABILITY" for row in blocked) else CODE_SOURCE_RECOVERY_CAPABILITY_BLOCKED,
            "resumeFromStage": "SOURCE_RECHECK",
            "nextAction": "ENABLE_RECOVERY_CAPABILITY",
        })
        return base
    if all(
        row["applicability"] == "NOT_APPLICABLE"
        or row["execution"] in {"ATTEMPTED_EXHAUSTED", "SKIPPED_AFTER_LOWER_TIER_PASS"}
        for row in base["tierMatrix"].values()
    ):
        base.update({
            "status": "HUMAN_REQUIRED",
            "exhaustionStatus": "AUTO_RECOVERY_EXHAUSTED",
            "finalStatus": "BLOCKED",
            "code": CODE_SOURCE_RECOVERY_HUMAN_REQUIRED,
            "reason": "AUTO_RECOVERY_EXHAUSTED",
            "nextAction": "HUMAN_REVIEW",
        })
        return base
    base.update({"status": "RECOVERY_VALIDATION_FAILED", "finalStatus": "FAIL"})
    return base


def resume_source_recovery(
    state: Mapping[str, Any],
    *,
    candidates_by_tier: Mapping[str, Iterable[Mapping[str, Any]]] | None = None,
    attempts_by_tier: Mapping[str, Mapping[str, Any]] | None = None,
    source_payload: Mapping[str, Any] | None = None,
    independent_solve: Mapping[str, Any] | None = None,
    blind_verifier: Any | None = None,
    validator: Any | None = None,
    evidence_root: Path | None = None,
    artifact_root: Path | None = None,
    final_artifact_ref: str | None = None,
    final_artifact_sha256: str | None = None,
) -> dict[str, Any]:
    """Resume only the remaining producer work from a saved checkpoint.

    Terminal results and accepted evidence are returned byte-for-byte as a
    deep copy. New work is evaluated under the original recovery plan; prior
    candidate evidence is merged append-only and is never regenerated.
    """

    if state.get("status") in {"NOT_REQUIRED", "RECOVERED", "PRESERVE_ONLY", "HUMAN_REQUIRED"}:
        return copy.deepcopy(dict(state))
    known_ids = {item.get("candidateId") for item in state.get("candidatePool", []) if isinstance(item, Mapping)}
    fresh: dict[str, list[Mapping[str, Any]]] = {}
    for tier, candidates in (candidates_by_tier or {}).items():
        fresh[tier] = [candidate for candidate in candidates if candidate.get("candidateId") not in known_ids]
    result = run_source_recovery(
        source_question_uid=str(state.get("sourceQuestionUid") or ""),
        source_lock_sha256=str(state.get("sourceLockSha256") or ""),
        defect_types=state.get("sourceDefectTypes") or None,
        source_recovery_policy=str(state.get("sourceRecoveryPolicy") or "SHADOW_AUTO_RECOVER"),
        recovery_authority=str(state.get("recoveryAuthority") or "SHADOW_ONLY"),
        initial_scope_uids=state.get("initialIncludedScopeUidSet"),
        capabilities=state.get("capabilities"),
        candidates_by_tier=fresh if candidates_by_tier is not None else None,
        attempts_by_tier=attempts_by_tier,
        source_payload=source_payload,
        independent_solve=independent_solve,
        blind_verifier=blind_verifier,
        validator=validator,
        evidence_root=evidence_root,
        artifact_root=artifact_root,
        final_artifact_ref=final_artifact_ref or state.get("finalArtifactRef"),
        final_artifact_sha256=final_artifact_sha256 or state.get("finalArtifactSha256"),
        recovery_plan_id=state.get("recoveryPlanId"),
    )
    result["candidatePool"] = [*copy.deepcopy(state.get("candidatePool", [])), *result.get("candidatePool", [])]
    result["acceptedCandidates"] = list(dict.fromkeys([*state.get("acceptedCandidates", []), *result.get("acceptedCandidates", [])]))
    result["rejectedCandidates"] = list(dict.fromkeys([*state.get("rejectedCandidates", []), *result.get("rejectedCandidates", [])]))
    result["candidateIndex"] = int(state.get("candidateIndex", 0)) + int(result.get("candidateIndex", 0))
    result["producerAttempts"] = {**copy.deepcopy(state.get("producerAttempts", {})), **copy.deepcopy(result.get("producerAttempts", {}))}
    result["resumedFromStatus"] = state.get("status")
    return result


def build_recovery_ledger(
    initial_scope_uids: Iterable[str],
    items: Iterable[Mapping[str, Any]] = (),
) -> dict[str, Any]:
    """Create a run-level append-only ledger with denominator preservation."""

    raw_initial = list(initial_scope_uids)
    ordered = _ordered_unique(raw_initial)
    if len(ordered) != len(raw_initial):
        raise SourceRecoveryError("INITIAL_INCLUDED_SCOPE_UID_SET must be unique")
    seen_sources: set[str] = set()
    normalized_items: list[dict[str, Any]] = []
    for raw in items:
        item = copy.deepcopy(dict(raw))
        source_uid = item.get("sourceQuestionUid")
        if source_uid in seen_sources:
            raise SourceRecoveryError("a source slot may have at most one recovery item")
        seen_sources.add(source_uid)
        normalized_items.append(item)
    return {
        "schemaVersion": SOURCE_RECOVERY_LEDGER_SCHEMA_VERSION,
        "initialIncludedScopeUidSet": ordered,
        "initialIncludedScopeUidSetSha256": _prefixed_sha(sorted(ordered)),
        "items": normalized_items,
    }


def persist_source_recovery(store: Any, run_id: str, record: Mapping[str, Any]) -> dict[str, Any]:
    """Append one recovery result and its immutable evidence to a Run.

    The evidence path is content-addressed by the record identity.  Replaying
    the same result is idempotent; attempting to reuse the same path for a
    different result raises instead of overwriting failed evidence.
    """

    manifest = copy.deepcopy(store.load(run_id))
    source_uid = record.get("sourceQuestionUid")
    if not isinstance(source_uid, str) or not source_uid:
        raise SourceRecoveryError("recovery record sourceQuestionUid is required")
    existing = manifest.get("sourceRecoveryLedger")
    if existing is None:
        initial = record.get("initialIncludedScopeUidSet") or [source_uid]
        ledger = build_recovery_ledger(initial)
    else:
        ledger = copy.deepcopy(existing)
        if validate_ledger(ledger)["status"] != "PASS":
            raise SourceRecoveryError("existing source recovery ledger is invalid")
    ledger.setdefault("events", [])
    ledger.setdefault("latestBySource", {})
    current = next((item for item in ledger["items"] if item.get("sourceQuestionUid") == source_uid), None)

    def record_identity(value: Mapping[str, Any]) -> str:
        ignored = {"evidenceRef", "evidenceSha256", "eventId", "eventRevision"}
        return _sha({key: child for key, child in value.items() if key not in ignored})

    if current is not None and record_identity(current) == record_identity(record):
        return manifest

    prior_revisions = [
        int(event.get("eventRevision", 0))
        for event in ledger["events"]
        if isinstance(event, Mapping) and event.get("sourceQuestionUid") == source_uid and isinstance(event.get("eventRevision"), int)
    ]
    revision = max(prior_revisions or [0]) + 1
    item = copy.deepcopy(dict(record))
    item["eventRevision"] = revision
    event_body = {
        "eventId": f"source-recovery-{source_uid}-r{revision}-{_sha(item)[:12]}",
        "eventRevision": revision,
        "sourceQuestionUid": source_uid,
        "status": item.get("status"),
        "record": item,
    }
    evidence_key = f"{source_uid}-r{revision}-{_sha(event_body)[:12]}"
    evidence_name = re.sub(r"[^0-9A-Za-z._-]+", "-", evidence_key).strip("-") or "recovery"
    evidence_path = f"evidence/source-recovery/{evidence_name}.json"
    absolute = store.run_dir(run_id) / evidence_path
    evidence_bytes = json.dumps(event_body, ensure_ascii=False, sort_keys=True, indent=2) + "\n"
    if absolute.exists():
        if absolute.read_text(encoding="utf-8") != evidence_bytes:
            raise SourceRecoveryError("recovery evidence path already contains different evidence")
    else:
        atomic_write_json(absolute, event_body)
    evidence_sha = f"sha256:{sha256_file(absolute)}"
    event = {
        "eventId": event_body["eventId"],
        "eventRevision": revision,
        "sourceQuestionUid": source_uid,
        "status": item.get("status"),
        "evidenceRef": evidence_path,
        "evidenceSha256": evidence_sha,
        "recordSha256": _prefixed_sha(item),
    }
    item["evidenceRef"] = evidence_path
    item["evidenceSha256"] = evidence_sha
    item["eventId"] = event["eventId"]
    ledger["items"] = [row for row in ledger["items"] if row.get("sourceQuestionUid") != source_uid] + [item]
    ledger["items"].sort(key=lambda row: str(row.get("sourceQuestionUid", "")))
    ledger["events"].append(event)
    ledger["latestBySource"][source_uid] = event["eventId"]
    if validate_ledger(ledger)["status"] != "PASS":
        raise SourceRecoveryError("recovery record violates ledger invariants")
    manifest["sourceRecoveryLedger"] = ledger
    manifest.setdefault("recoveryEvents", []).append({
        "type": "SOURCE_RECOVERY_RECORDED",
        "sourceQuestionUid": source_uid,
        "status": item.get("status"),
        "evidenceRef": evidence_path,
        "eventId": event["eventId"],
        "eventRevision": revision,
    })
    store.save(run_id, manifest)
    return manifest


def validate_ledger(ledger: Mapping[str, Any]) -> dict[str, Any]:
    errors: list[str] = []
    if ledger.get("schemaVersion") != SOURCE_RECOVERY_LEDGER_SCHEMA_VERSION:
        errors.append("SOURCE_RECOVERY_LEDGER_SCHEMA_INVALID")
    initial = ledger.get("initialIncludedScopeUidSet")
    if not isinstance(initial, list) or not initial or len(set(initial)) != len(initial):
        errors.append("INITIAL_SCOPE_UID_SET_INVALID")
        initial = []
    expected_sha = _prefixed_sha(sorted(initial)) if initial else None
    if ledger.get("initialIncludedScopeUidSetSha256") != expected_sha:
        errors.append("INITIAL_SCOPE_UID_SET_SHA_MISMATCH")
    items = ledger.get("items")
    if not isinstance(items, list):
        errors.append("SOURCE_RECOVERY_ITEMS_INVALID")
        items = []
    source_uids: set[str] = set()
    recovered_uids: set[str] = set()
    for item in items:
        if not isinstance(item, Mapping):
            errors.append("SOURCE_RECOVERY_ITEM_INVALID")
            continue
        source_uid = item.get("sourceQuestionUid")
        recovered_uid = item.get("recoveredQuestionUid")
        if source_uid in source_uids:
            errors.append(CODE_DERIVED_REPLACEMENT_CARDINALITY_FAIL)
        source_uids.add(source_uid)
        if recovered_uid:
            if recovered_uid in recovered_uids:
                errors.append(CODE_DERIVED_REPLACEMENT_CARDINALITY_FAIL)
            recovered_uids.add(recovered_uid)
        if item.get("replacementDisposition") == "DERIVED_REPLACEMENT_VERIFIED":
            errors.extend(validate_replacement(item, initial, ledger.get("initialIncludedScopeUidSetSha256"))["errors"])
            record_authorization = {
                "status": "PASS",
                "authorizationRef": item.get("authorizationRef"),
                "authority": item.get("authorizationAuthority", item.get("recoveryAuthority")),
                "scopeAuthorizationStatus": item.get("scopeAuthorizationStatus"),
                "authorizedScope": item.get("authorizedScope"),
            }
            errors.extend(validate_authorization_scope(item, record_authorization)["errors"])
        if item.get("productionOriginalActive") is True and item.get("productionRecoveredActive") is True:
            errors.append(CODE_DERIVED_REPLACEMENT_PARITY_FAIL)
        if (item.get("productionRecoveredActive") is True or item.get("productionAdoptionStatus") == "ADOPTED") and item.get("replacementDisposition") != "DERIVED_REPLACEMENT_VERIFIED":
            errors.append(CODE_DERIVED_REPLACEMENT_PARITY_FAIL)
        if item.get("recoveryDisposition") == "ANSWER_KEY_RECOVERED" and item.get("finalTarget") is True:
            resolution = item.get("answerKeyResolution")
            if not isinstance(resolution, Mapping) or not resolution.get("effectiveArtifactUid") or not resolution.get("effectiveArtifactSha256") or resolution.get("lineageStatus") != "PASS" or not resolution.get("verifierEvidenceSha256"):
                errors.append(CODE_SOURCE_RECOVERY_VALIDATION_FAIL)
            if isinstance(item.get("candidatePool"), list):
                selected = next((candidate for candidate in item["candidatePool"] if isinstance(candidate, Mapping) and candidate.get("candidateId") == item.get("selectedCandidateId")), None)
                selected_payload = selected.get("payload") if isinstance(selected, Mapping) else None
                if isinstance(selected_payload, Mapping) and _is_mcq_payload(selected_payload) and (
                    not isinstance(resolution, Mapping)
                    or not resolution.get("independentComputedValue")
                    or resolution.get("canonicalEffectiveAnswer") != selected_payload.get("answer")
                    or canonical_answer_to_choice_index(selected_payload.get("answer")) is None
                ):
                    errors.append(CODE_SOURCE_RECOVERY_VALIDATION_FAIL)
        matrix = item.get("tierMatrix")
        attempts = item.get("producerAttempts")
        if isinstance(matrix, Mapping):
            for tier, row in matrix.items():
                if isinstance(row, Mapping) and row.get("execution") == "ATTEMPTED_EXHAUSTED":
                    attempt_check = validate_producer_attempt(attempts.get(tier) if isinstance(attempts, Mapping) else None)
                    if attempt_check["status"] != "PASS":
                        errors.append("RECOVERY_PRODUCER_BUDGET_NOT_EXHAUSTED")
            if item.get("status") == "HUMAN_REQUIRED":
                for row in matrix.values():
                    if isinstance(row, Mapping) and row.get("applicability") != "NOT_APPLICABLE" and row.get("capability") == "ACTIVE" and row.get("execution") != "ATTEMPTED_EXHAUSTED":
                        errors.append("RECOVERY_HUMAN_REQUIRED_PATH_NOT_EXHAUSTED")
    events = ledger.get("events", [])
    latest = ledger.get("latestBySource", {})
    if not isinstance(events, list) or not isinstance(latest, Mapping):
        errors.append("SOURCE_RECOVERY_EVENT_HISTORY_INVALID")
        events = []
        latest = {}
    event_ids: set[str] = set()
    revisions_by_source: dict[str, list[int]] = {}
    for event in events:
        if not isinstance(event, Mapping) or not isinstance(event.get("eventId"), str) or not isinstance(event.get("eventRevision"), int) or not isinstance(event.get("sourceQuestionUid"), str) or not isinstance(event.get("evidenceRef"), str) or not re.fullmatch(r"sha256:[0-9a-f]{64}", str(event.get("evidenceSha256", ""))) or not re.fullmatch(r"sha256:[0-9a-f]{64}", str(event.get("recordSha256", ""))):
            errors.append("SOURCE_RECOVERY_EVENT_INVALID")
            continue
        if event["eventId"] in event_ids:
            errors.append("SOURCE_RECOVERY_EVENT_ID_DUPLICATE")
        event_ids.add(event["eventId"])
        revisions_by_source.setdefault(event["sourceQuestionUid"], []).append(event["eventRevision"])
    for source_uid, revisions in revisions_by_source.items():
        if revisions != sorted(set(revisions)) or revisions[0] < 1:
            errors.append("SOURCE_RECOVERY_EVENT_REVISION_INVALID")
        if latest.get(source_uid) not in {event.get("eventId") for event in events if isinstance(event, Mapping) and event.get("sourceQuestionUid") == source_uid}:
            errors.append("SOURCE_RECOVERY_LATEST_POINTER_INVALID")
    for item in items:
        source_uid = item.get("sourceQuestionUid") if isinstance(item, Mapping) else None
        if source_uid in latest and item.get("eventId") != latest.get(source_uid):
            errors.append("SOURCE_RECOVERY_CURRENT_POINTER_MISMATCH")
    return {"status": "PASS" if not errors else "FAIL", "errors": _ordered_unique(errors)}


def release_gate(
    ledger: Mapping[str, Any] | None,
    *,
    existing_final_status: str = "PASS",
    evidence_root: Path | None = None,
    artifact_root: Path | None = None,
) -> dict[str, Any]:
    """Aggregate recovery hard gates while allowing execution to continue."""

    counts = {
        "humanRequiredCount": 0,
        "recoveryEvidenceBlockedCount": 0,
        "recoveryCapabilityBlockedCount": 0,
        "correctnessAffectingPreserveOnlyCount": 0,
        "shadowRecoveredUnapprovedCount": 0,
        "unauthorizedRecoveryAdoptionCount": 0,
        "derivedReplacementParityFailCount": 0,
    }
    errors: list[str] = []
    if ledger is None:
        return {"status": existing_final_status if existing_final_status in {"PASS", "HOLD", "BLOCKED", "FAIL"} else "BLOCKED", "counts": counts, "errors": []}
    validation = validate_ledger(ledger)
    errors.extend(validation["errors"])
    for item in ledger.get("items", []):
        status = item.get("status")
        disposition = item.get("replacementDisposition")
        correctness_affecting = item.get("correctnessAffecting", disposition != "ANSWER_KEY_RECOVERED")
        if status == "HUMAN_REQUIRED":
            counts["humanRequiredCount"] += 1
        if status == "SOURCE_RECOVERY_EVIDENCE_BLOCKED":
            counts["recoveryEvidenceBlockedCount"] += 1
        if status in {"RECOVERY_CAPABILITY_BLOCKED", "RECOVERY_DEFERRED_CAPABILITY"}:
            counts["recoveryCapabilityBlockedCount"] += 1
        if status == "PRESERVE_ONLY" and correctness_affecting:
            counts["correctnessAffectingPreserveOnlyCount"] += 1
        final_target = item.get("finalTarget", item.get("productionRecoveredActive") is True)
        answer_key_recovery = item.get("recoveryDisposition") == "ANSWER_KEY_RECOVERED"
        if status == "RECOVERED" and final_target and not answer_key_recovery and (
            item.get("recoveryAuthority") == "SHADOW_ONLY"
            or item.get("productionAdoptionStatus") != "ADOPTED"
        ):
            counts["shadowRecoveredUnapprovedCount"] += 1
        if final_target and not answer_key_recovery and item.get("productionAdoptionStatus") not in {None, "ADOPTED"} and item.get("recoveryAuthority") not in {"BOUNDED_PRODUCTION", "DEFAULT_PRODUCTION"}:
            counts["unauthorizedRecoveryAdoptionCount"] += 1
        replacement = item.get("replacement") if isinstance(item.get("replacement"), Mapping) else item
        if disposition == "DERIVED_REPLACEMENT_VERIFIED" and (evidence_root is not None or artifact_root is not None):
            final_seal = validate_final_artifact_binding(
                item,
                artifact_root=artifact_root,
                evidence_root=evidence_root,
            )
            errors.extend(final_seal["errors"])
        if disposition == "DERIVED_REPLACEMENT_VERIFIED" and any(
            replacement.get(field) != expected
            for field, expected in (
                ("replacementCardinality", "1:1"),
                ("productionOriginalActive", False),
                ("productionRecoveredActive", True),
                ("replacementLineageParity", "PASS"),
                ("recoveredQualityClosure", "PASS"),
            )
        ):
            counts["derivedReplacementParityFailCount"] += 1
        if final_target and not answer_key_recovery and disposition != "DERIVED_REPLACEMENT_VERIFIED":
            counts["derivedReplacementParityFailCount"] += 1
    for name, value in counts.items():
        if value:
            errors.append(name.upper())
    if existing_final_status != "PASS":
        errors.append(f"EXISTING_FINAL_STATUS_{existing_final_status}")
    return {
        "status": "PASS" if not errors else "BLOCKED",
        "counts": counts,
        "errors": _ordered_unique(errors),
        "productionSeal": "PASS" if not errors else "BLOCKED",
        "executionContinues": True,
    }


def source_evidence_blocked(required_resource: str, *, source_question_uid: str = "", source_lock_sha256: str | None = None) -> dict[str, Any]:
    if required_resource not in {"SOURCE_PAGE", "FULL_SCAN", "COMMON_MATERIAL", "SOURCE_VISUAL", "SOURCE_FILE"}:
        raise SourceRecoveryError("invalid required source recovery resource")
    return {
        "schemaVersion": SOURCE_RECOVERY_SCHEMA_VERSION,
        "sourceQuestionUid": source_question_uid,
        "sourceLockSha256": source_lock_sha256,
        "status": "SOURCE_RECOVERY_EVIDENCE_BLOCKED",
        "finalStatus": "BLOCKED",
        "code": CODE_SOURCE_RECOVERY_EVIDENCE_BLOCKED,
        "requiredResource": required_resource,
        "resumeFromStage": "SOURCE_RECHECK",
        "nextAction": "LOAD_SOURCE_EVIDENCE",
    }


__all__ = [
    "ADOPTION_STATUSES",
    "APPLICABILITY",
    "CAPABILITIES",
    "DEFAULT_CAPABILITY_REGISTRY",
    "DEFECT_TYPES",
    "EXECUTIONS",
    "RECOVERY_AUTHORITIES",
    "RECOVERY_DISPOSITIONS",
    "RECOVERY_POLICIES",
    "RECOVERY_CODES",
    "RECOVERY_STATUSES",
    "SOURCE_RECOVERY_LEDGER_SCHEMA_VERSION",
    "SOURCE_RECOVERY_SCHEMA_VERSION",
    "TIERS",
    "SourceRecoveryError",
    "atomic_adopt_replacement",
    "build_blind_verifier_adapter",
    "build_recovery_ledger",
    "build_tier_matrix",
    "build_validator_evidence",
    "candidate_acceptance",
    "canonical_answer_to_choice_index",
    "capability_registry_report",
    "diagnose_source_defects",
    "defect_is_correctness_affecting",
    "make_candidate_version",
    "primary_tier",
    "persist_source_recovery",
    "rank_candidates",
    "release_gate",
    "run_source_recovery",
    "source_evidence_blocked",
    "choice_index_to_canonical_answer",
    "produce_recovery_candidates",
    "targeted_repair_candidate",
    "validate_ledger",
    "validate_design_mirror",
    "validate_producer_attempt",
    "validate_source_evidence",
    "validate_verifier_evidence",
    "validate_validator_evidence",
    "validate_closure_evidence",
    "resolve_independent_answer_against_choices",
    "validate_authorization_scope",
    "validate_external_candidate",
    "validate_final_artifact_binding",
    "validate_replacement",
    "validate_tier_matrix",
]
