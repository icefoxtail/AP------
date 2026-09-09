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
import json
import re
from typing import Any, Iterable, Mapping

from .run_store import atomic_write_json
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

_CORRECTNESS_AFFECTING = set(DEFECT_TYPES) - {"ANSWER_KEY_CONFLICT"}
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
    return min((_PRIMARY_TIER_BY_DEFECT[defect] for defect in defects), key=lambda tier: int(tier[1:]))


def _normalise_capability(value: Any) -> str:
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

    primary = primary_tier(defect_types)
    primary_index = int(primary[1:])
    capability_map = capabilities or {}
    matrix: dict[str, dict[str, str]] = {}
    for index, tier in enumerate(TIERS):
        applicability = (
            "APPLICABLE_PRIMARY"
            if index == primary_index
            else "APPLICABLE_FALLBACK"
            if index > primary_index
            else "NOT_APPLICABLE"
        )
        matrix[tier] = {
            "applicability": applicability,
            "capability": _normalise_capability(capability_map.get(tier, "ACTIVE")),
            "execution": "NOT_RUN",
        }
    return matrix


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
        "freeze": {"status": freeze_status, "payloadSha256": payload_sha},
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


def candidate_acceptance(
    candidate: Mapping[str, Any],
    *,
    recovery_tier: str,
    independent_verification: str = "PASS",
) -> dict[str, Any]:
    """Reduce explicit gate evidence without accepting missing gates."""

    _require_enum(recovery_tier, TIERS, "recoveryTier")
    payload = candidate.get("payload")
    if not isinstance(payload, Mapping):
        raise SourceRecoveryError("candidate payload is required")
    gates = payload.get("acceptanceGates", candidate.get("acceptanceGates"))
    if not isinstance(gates, Mapping):
        gates = {}
    gate_status = {name: str(gates.get(name, "NOT_TESTED")).upper() for name in _GATE_NAMES}
    verifier = str(independent_verification).upper()
    failed = [name for name, status in gate_status.items() if status != "PASS"]
    if verifier != "PASS":
        failed.append("INDEPENDENT_VERIFICATION")
    return {
        "status": "PASS" if not failed else "FAIL",
        "recoveryTier": recovery_tier,
        "gates": gate_status,
        "independentVerification": verifier,
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


def atomic_adopt_replacement(
    recovered: Mapping[str, Any],
    *,
    authorization: Mapping[str, Any],
    initial_scope_uids: Iterable[str],
    initial_scope_sha256: str,
    quality_closure: str = "PASS",
    lineage_parity: str = "PASS",
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
    if authorization.get("status") != "PASS" or not authorization.get("authorizationRef"):
        raise SourceRecoveryError("recovery authorization scope is not proven")
    if quality_closure != "PASS":
        raise SourceRecoveryError(CODE_DERIVED_REPLACEMENT_QUALITY_CLOSURE_FAIL)
    if lineage_parity != "PASS":
        raise SourceRecoveryError(CODE_DERIVED_REPLACEMENT_PARITY_FAIL)

    next_state = copy.deepcopy(dict(recovered))
    next_state["productionAdoptionStatus"] = "ADOPTED"
    next_state["replacementDisposition"] = "DERIVED_REPLACEMENT_VERIFIED"
    next_state["productionOriginalActive"] = False
    next_state["productionRecoveredActive"] = True
    next_state["replacementCardinality"] = "1:1"
    next_state["replacementLineageParity"] = lineage_parity
    next_state["recoveredQualityClosure"] = quality_closure
    next_state["replacement"] = {
        "status": "DERIVED_REPLACEMENT_VERIFIED",
        "replacementCardinality": "1:1",
        "productionOriginalActive": False,
        "productionRecoveredActive": True,
        "replacementLineageParity": lineage_parity,
        "recoveredQualityClosure": quality_closure,
    }
    next_state["authorizationRef"] = authorization["authorizationRef"]
    parity = validate_replacement(next_state, initial_scope_uids, initial_scope_sha256)
    if parity["status"] != "PASS":
        raise SourceRecoveryError(";".join(parity["errors"]))
    return next_state


def run_source_recovery(
    *,
    source_question_uid: str,
    source_lock_sha256: str,
    defect_types: Iterable[str],
    source_recovery_policy: str = "SHADOW_AUTO_RECOVER",
    recovery_authority: str = "SHADOW_ONLY",
    initial_scope_uids: Iterable[str] | None = None,
    source_evidence_available: bool = True,
    required_resource: str = "SOURCE_PAGE",
    capabilities: Mapping[str, Any] | None = None,
    candidates_by_tier: Mapping[str, Iterable[Mapping[str, Any]]] | None = None,
    authorization: Mapping[str, Any] | None = None,
    quality_closure: str = "PASS",
    lineage_parity: str = "PASS",
    recovery_plan_id: str | None = None,
) -> dict[str, Any]:
    """Route one source question through the bounded recovery contract.

    Candidate generation remains an injected concern.  This keeps the router
    independent from a model/provider while making every recovery result pass
    through the same freeze, blind-verification, and release-safety rules.
    ``candidates_by_tier`` is therefore a provider-neutral boundary suitable
    for offline fixtures and the future Similar/Archive adapters.
    """

    if not source_question_uid or not source_lock_sha256:
        raise SourceRecoveryError("sourceQuestionUid and sourceLockSha256 are required")
    _require_enum(source_recovery_policy, RECOVERY_POLICIES, "sourceRecoveryPolicy")
    _require_enum(recovery_authority, RECOVERY_AUTHORITIES, "recoveryAuthority")
    defects = _ordered_unique(defect_types)
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
    if not source_evidence_available:
        return source_evidence_blocked(required_resource, source_question_uid=source_question_uid)

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
        "acceptedCandidates": [],
        "rejectedCandidates": [],
        "lastVerifierResult": None,
        "requiredResource": None,
        "resumeFromStage": None,
        "nextAction": "RECOVERY_SEARCH",
        "initialIncludedScopeUidSet": initial,
        "initialIncludedScopeUidSetSha256": initial_sha,
        "correctnessAffecting": defect_is_correctness_affecting(defects),
    }
    if source_recovery_policy == "PRESERVE_ONLY":
        base.update({
            "status": "PRESERVE_ONLY",
            "recoveryDisposition": "SOURCE_PRESERVED_ONLY",
            "nextAction": "CONTINUE_EXECUTION",
            "finalTarget": False,
        })
        return base

    candidates_by_tier = candidates_by_tier or {}
    for tier_index in range(int(primary[1:]), len(TIERS)):
        tier = f"R{tier_index}"
        row = base["tierMatrix"][tier]
        base["currentRecoveryTier"] = tier
        if row["capability"] != "ACTIVE":
            continue
        raw_candidates = list(candidates_by_tier.get(tier, ()))
        if not raw_candidates:
            row["execution"] = "ATTEMPTED_EXHAUSTED"
            continue
        accepted: list[dict[str, Any]] = []
        for raw in raw_candidates:
            payload = raw.get("payload") if isinstance(raw, Mapping) else None
            candidate = (
                copy.deepcopy(dict(raw))
                if isinstance(raw, Mapping) and raw.get("candidateId")
                else make_candidate_version(
                    base["recoveryPlanId"],
                    payload if isinstance(payload, Mapping) else dict(raw),
                    candidate_version=base["candidateVersion"] + 1,
                )
            )
            base["candidateVersion"] = max(base["candidateVersion"], int(candidate.get("candidateVersion", 0)))
            acceptance = candidate_acceptance(
                candidate,
                recovery_tier=tier,
                independent_verification=str(raw.get("independentVerification", "PASS")) if isinstance(raw, Mapping) else "PASS",
            )
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
            row["execution"] = "ATTEMPTED_EXHAUSTED"
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
            "mutations": copy.deepcopy(payload.get("mutations", [])),
            "sourceOriginalPreserved": True,
            "productionOriginalActive": True,
            "productionRecoveredActive": False,
            "finalTarget": False,
            "replacementDisposition": None,
            "nextAction": "QUALITY_CLOSURE",
        })
        if source_recovery_policy == "AUTO_RECOVER" and recovery_authority != "SHADOW_ONLY":
            auth = authorization or {}
            if auth.get("status") == "PASS" and auth.get("authorizationRef"):
                base["productionAdoptionStatus"] = "AUTHORIZED"
                try:
                    adopted = atomic_adopt_replacement(
                        base,
                        authorization=auth,
                        initial_scope_uids=initial,
                        initial_scope_sha256=initial_sha,
                        quality_closure=quality_closure,
                        lineage_parity=lineage_parity,
                    )
                except SourceRecoveryError as error:
                    base["codes"] = [CODE_DERIVED_REPLACEMENT_PARITY_FAIL, str(error)]
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
    if source_uid in {item.get("sourceQuestionUid") for item in ledger["items"]}:
        previous = next(item for item in ledger["items"] if item.get("sourceQuestionUid") == source_uid)
        previous_without_ref = {key: value for key, value in previous.items() if key != "evidenceRef"}
        if _sha(previous_without_ref) != _sha(dict(record)):
            raise SourceRecoveryError("source recovery ledger is append-only for each source slot")
        return manifest
    item = copy.deepcopy(dict(record))
    evidence_key = item.get("selectedCandidateId") or item.get("recoveryPlanId") or _sha(item)[:20]
    evidence_name = re.sub(r"[^0-9A-Za-z._-]+", "-", str(evidence_key)).strip("-") or "recovery"
    evidence_path = f"evidence/source-recovery/{evidence_name}.json"
    absolute = store.run_dir(run_id) / evidence_path
    if absolute.exists():
        existing_evidence = json.loads(absolute.read_text(encoding="utf-8"))
        if _sha(existing_evidence) != _sha(item):
            raise SourceRecoveryError("recovery evidence path already contains different evidence")
    else:
        atomic_write_json(absolute, item)
    item["evidenceRef"] = evidence_path
    ledger["items"].append(item)
    if validate_ledger(ledger)["status"] != "PASS":
        raise SourceRecoveryError("recovery record violates ledger invariants")
    manifest["sourceRecoveryLedger"] = ledger
    manifest.setdefault("recoveryEvents", []).append({
        "type": "SOURCE_RECOVERY_RECORDED",
        "sourceQuestionUid": source_uid,
        "status": item.get("status"),
        "evidenceRef": evidence_path,
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
        if item.get("productionOriginalActive") is True and item.get("productionRecoveredActive") is True:
            errors.append(CODE_DERIVED_REPLACEMENT_PARITY_FAIL)
        if (item.get("productionRecoveredActive") is True or item.get("productionAdoptionStatus") == "ADOPTED") and item.get("replacementDisposition") != "DERIVED_REPLACEMENT_VERIFIED":
            errors.append(CODE_DERIVED_REPLACEMENT_PARITY_FAIL)
    return {"status": "PASS" if not errors else "FAIL", "errors": _ordered_unique(errors)}


def release_gate(
    ledger: Mapping[str, Any] | None,
    *,
    existing_final_status: str = "PASS",
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
        if status == "RECOVERED" and final_target and (
            item.get("recoveryAuthority") == "SHADOW_ONLY"
            or item.get("productionAdoptionStatus") != "ADOPTED"
        ):
            counts["shadowRecoveredUnapprovedCount"] += 1
        if final_target and item.get("productionAdoptionStatus") not in {None, "ADOPTED"} and item.get("recoveryAuthority") not in {"BOUNDED_PRODUCTION", "DEFAULT_PRODUCTION"}:
            counts["unauthorizedRecoveryAdoptionCount"] += 1
        replacement = item.get("replacement") if isinstance(item.get("replacement"), Mapping) else item
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
        if final_target and disposition != "DERIVED_REPLACEMENT_VERIFIED":
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


def source_evidence_blocked(required_resource: str, *, source_question_uid: str = "") -> dict[str, Any]:
    if required_resource not in {"SOURCE_PAGE", "FULL_SCAN", "COMMON_MATERIAL", "SOURCE_VISUAL", "SOURCE_FILE"}:
        raise SourceRecoveryError("invalid required source recovery resource")
    return {
        "schemaVersion": SOURCE_RECOVERY_SCHEMA_VERSION,
        "sourceQuestionUid": source_question_uid,
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
    "DEFECT_TYPES",
    "EXECUTIONS",
    "RECOVERY_AUTHORITIES",
    "RECOVERY_DISPOSITIONS",
    "RECOVERY_POLICIES",
    "RECOVERY_STATUSES",
    "SOURCE_RECOVERY_LEDGER_SCHEMA_VERSION",
    "SOURCE_RECOVERY_SCHEMA_VERSION",
    "TIERS",
    "SourceRecoveryError",
    "atomic_adopt_replacement",
    "build_recovery_ledger",
    "build_tier_matrix",
    "candidate_acceptance",
    "defect_is_correctness_affecting",
    "make_candidate_version",
    "primary_tier",
    "persist_source_recovery",
    "rank_candidates",
    "release_gate",
    "run_source_recovery",
    "source_evidence_blocked",
    "targeted_repair_candidate",
    "validate_ledger",
    "validate_replacement",
    "validate_tier_matrix",
]
