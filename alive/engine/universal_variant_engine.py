"""Bounded universal A/B/C transformation runtime.

This module connects the Phase 0 contracts without pretending that free-form
Korean mathematics is already solvable by one generic algorithm.  A/B/C
transforms require a registered ``family x transform`` capability and explicit
structured inputs.  Missing solver or review evidence remains HOLD.
"""

from __future__ import annotations

import copy
import hashlib
import json
from typing import Any

from .solution_graph import SolutionGraphError, normalize_solution_graph
from .structure_families import (
    CAPABILITY_HOLD,
    CAPABILITY_SUPPORTED,
    StructureFamilyRegistry,
)
from .universal_ir import UniversalIRError, require_valid_universal_question_ir


UNIVERSAL_ENGINE_SCHEMA_VERSION = "0.1.0"
TRANSFORM_A_NUMERIC = "numeric"
TRANSFORM_B_REPRESENTATION = "representation"
TRANSFORM_C_PARAMETER_RECOVERY = "PARAMETER_RECOVERY"
TRANSFORM_C_INTERMEDIATE_INFERENCE = "INTERMEDIATE_INFERENCE"
TRANSFORM_C_REPRESENTATION_DECODE = "REPRESENTATION_DECODE"


class UniversalVariantEngineError(ValueError):
    """Raised when a bounded structured transformation cannot be made safe."""


def _require_mapping(value: Any, field: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise UniversalVariantEngineError(f"{field} must be an object")
    return value


def _capability_or_hold(
    registry: StructureFamilyRegistry,
    family_id: str,
    transform: str,
) -> dict[str, Any]:
    capability = registry.capability(family_id, transform)
    if capability.get("status") != CAPABILITY_SUPPORTED:
        raise UniversalVariantEngineError(
            f"capability is not supported for {family_id}×{transform}: {capability.get('status', CAPABILITY_HOLD)}"
        )
    return capability


def build_variant_plan(
    source_ir: dict[str, Any],
    *,
    declared_class: str,
    transform: str,
    registry: StructureFamilyRegistry,
) -> dict[str, Any]:
    """Create a frozen plan or an explicit HOLD plan before model dispatch."""

    require_valid_universal_question_ir(source_ir)
    if declared_class not in {"A", "B", "C"}:
        raise UniversalVariantEngineError("declared_class must be A, B, or C")
    capability = registry.capability(source_ir["structureFamily"], transform)
    status = "READY" if capability.get("status") == CAPABILITY_SUPPORTED else "HOLD"
    return {
        "schemaVersion": UNIVERSAL_ENGINE_SCHEMA_VERSION,
        "artifactType": "ALIVE_UNIVERSAL_VARIANT_PLAN",
        "sourceQuestionId": source_ir["sourceQuestionId"],
        "sourceQuestionSha256": source_ir["sourceQuestionSha256"],
        "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"],
        "structureFamily": source_ir["structureFamily"],
        "familyTransform": f"{source_ir['structureFamily']}×{transform}",
        "declaredClass": declared_class,
        "transform": transform,
        "capability": capability,
        "status": status,
        "dispatchAllowed": status == "READY",
        "sourceGraphFingerprint": source_ir["solutionGraph"].get("graphFingerprint")
        if isinstance(source_ir["solutionGraph"], dict)
        else None,
        "frozen": True,
    }


def _replace_template(value: str, bindings: dict[str, Any]) -> tuple[str, int]:
    result = value
    count = 0
    for key, replacement in bindings.items():
        text = str(replacement)
        for token in (f"{{{{{key}}}}}", f"__{key}__"):
            occurrences = result.count(token)
            if occurrences:
                result = result.replace(token, text)
                count += occurrences
    return result, count


def _replace_public_payload(payload: dict[str, Any], bindings: dict[str, Any]) -> tuple[dict[str, Any], int]:
    result = copy.deepcopy(payload)
    changed = 0
    for field in ("content", "questionType", "layoutTag"):
        if isinstance(result.get(field), str):
            result[field], count = _replace_template(result[field], bindings)
            changed += count
    choices = result.get("choices")
    if isinstance(choices, list):
        replaced: list[Any] = []
        for choice in choices:
            if isinstance(choice, str):
                next_choice, count = _replace_template(choice, bindings)
                replaced.append(next_choice)
                changed += count
            else:
                replaced.append(choice)
        result["choices"] = replaced
    return result, changed


def apply_a_parameter_variant(
    source_ir: dict[str, Any],
    *,
    parameter_bindings: dict[str, Any],
    registry: StructureFamilyRegistry,
) -> dict[str, Any]:
    """Apply only explicit template-bound parameters for the A MVP lane.

    A mathematical solver must still recompute the answer and produce the
    proof sidecar.  This function only performs the safe public transformation
    and records the required anti-memory metadata.
    """

    require_valid_universal_question_ir(source_ir)
    _capability_or_hold(registry, source_ir["structureFamily"], TRANSFORM_A_NUMERIC)
    if not isinstance(parameter_bindings, dict) or not parameter_bindings:
        raise UniversalVariantEngineError("parameter_bindings must be a non-empty object")
    mutable = set(source_ir.get("mutableParameters", []))
    unknown = sorted(set(parameter_bindings) - mutable)
    if unknown:
        raise UniversalVariantEngineError(f"A binding contains immutable or unknown parameters: {unknown}")
    parameters = _require_mapping(source_ir.get("parameters"), "parameters")
    changed_keys = [key for key, value in parameter_bindings.items() if parameters.get(key) != value]
    if not changed_keys:
        raise UniversalVariantEngineError("A parameter binding does not change any parameter")
    source_payload = _require_mapping(source_ir.get("studentPayload"), "studentPayload")
    candidate_payload, public_replacements = _replace_public_payload(source_payload, parameter_bindings)
    if public_replacements == 0:
        raise UniversalVariantEngineError("A parameter change is not visible in the student payload")
    candidate = copy.deepcopy(source_ir)
    candidate["parameters"] = {**parameters, **parameter_bindings}
    candidate["studentPayload"] = candidate_payload
    candidate["privateTransformationData"] = {
        "kind": "A_PARAMETER_VARIANT",
        "changedParameters": changed_keys,
        "effectiveParameterChangeCount": len(changed_keys),
        "publicReplacementCount": public_replacements,
        "answerMemoryShortcut": False,
    }
    return {
        "status": "CANDIDATE_READY_FOR_SOLVER",
        "candidateIR": candidate,
        "evidence": {
            "method": "deterministic_template_parameter_transform",
            "changedParameters": changed_keys,
            "effectiveParameterChangeCount": len(changed_keys),
            "parameterDistance": len(changed_keys),
            "answerMemoryShortcut": False,
        },
    }


def adapt_b_candidate(
    source_ir: dict[str, Any],
    *,
    candidate_payload: dict[str, Any],
    candidate_solution_graph: Any,
    registry: StructureFamilyRegistry,
) -> dict[str, Any]:
    """Adapt an existing B candidate into the universal IR without rewriting B."""

    require_valid_universal_question_ir(source_ir)
    _capability_or_hold(registry, source_ir["structureFamily"], TRANSFORM_B_REPRESENTATION)
    payload = _require_mapping(candidate_payload, "candidate_payload")
    if not isinstance(payload.get("content"), str) or not payload["content"].strip():
        raise UniversalVariantEngineError("candidate payload content is required")
    if not isinstance(payload.get("choices"), list):
        raise UniversalVariantEngineError("candidate payload choices must be an array")
    adapter = registry.require(source_ir["structureFamily"])
    try:
        source_graph = adapter.normalize_solution_graph(source_ir["solutionGraph"])
        candidate_graph = adapter.normalize_solution_graph(candidate_solution_graph)
    except (SolutionGraphError, TypeError) as error:
        raise UniversalVariantEngineError(f"B candidate solution graph is invalid: {error}") from error
    candidate = copy.deepcopy(source_ir)
    candidate["studentPayload"] = copy.deepcopy(payload)
    candidate["solutionGraph"] = candidate_graph
    candidate["privateTransformationData"] = {
        "kind": "B_EXISTING_CANDIDATE_ADAPTER",
        "sourceGraphFingerprint": source_graph["graphFingerprint"],
        "candidateGraphFingerprint": candidate_graph["graphFingerprint"],
        "coreGraphPreserved": source_graph["graphFingerprint"] == candidate_graph["graphFingerprint"],
        "representationChanged": payload != source_ir["studentPayload"],
    }
    return {
        "status": "CANDIDATE_READY_FOR_PROOF",
        "candidateIR": candidate,
        "evidence": candidate["privateTransformationData"],
    }


def build_c_variant(
    source_ir: dict[str, Any],
    *,
    preprocess_node: dict[str, Any],
    candidate_payload: dict[str, Any] | None = None,
    transform: str = TRANSFORM_C_PARAMETER_RECOVERY,
    registry: StructureFamilyRegistry,
) -> dict[str, Any]:
    """Prepend exactly one structured, student-observable C preprocess node."""

    require_valid_universal_question_ir(source_ir)
    _capability_or_hold(registry, source_ir["structureFamily"], transform)
    node = _require_mapping(preprocess_node, "preprocess_node")
    required = {
        "role": "preprocess",
        "deterministic": True,
        "branchCount": 0,
        "newConcept": False,
        "required": True,
        "outputArity": 1,
        "studentObservableInputsOnly": True,
    }
    for field, expected in required.items():
        if node.get(field) != expected:
            raise UniversalVariantEngineError(f"C preprocess node {field} must be {expected!r}")
    if not isinstance(node.get("nodeId"), str) or not node["nodeId"].strip():
        raise UniversalVariantEngineError("C preprocess nodeId is required")
    source_graph = normalize_solution_graph(source_ir["solutionGraph"])
    if any(item["nodeId"] == node["nodeId"] for item in source_graph["nodes"]):
        raise UniversalVariantEngineError("C preprocess nodeId collides with source graph")
    core_nodes = copy.deepcopy(source_graph["nodes"])
    preprocess = {
        "nodeId": node["nodeId"],
        "role": "preprocess",
        "op": node.get("op", transform),
        "inputRole": node.get("inputRole", ["public_condition"]),
        "outputRole": node.get("outputRole", ["semantic_object"]),
        "order": 0,
    }
    graph_nodes = [preprocess, *core_nodes]
    edges = [
        {"from": source_graph["nodes"][edge["from"]]["nodeId"], "to": source_graph["nodes"][edge["to"]]["nodeId"]}
        for edge in source_graph["edges"]
    ]
    first_core = core_nodes[0]["nodeId"]
    edges.insert(0, {"from": preprocess["nodeId"], "to": first_core})
    candidate_graph = normalize_solution_graph(
        {
            "nodes": graph_nodes,
            "edges": edges,
            "coreDecisionCount": source_graph["coreDecisionCount"],
            "branchCount": source_graph["branchCount"],
            "newConceptCount": source_graph["newConceptCount"],
        }
    )
    candidate = copy.deepcopy(source_ir)
    if candidate_payload is not None:
        payload = _require_mapping(candidate_payload, "candidate_payload")
        if not isinstance(payload.get("content"), str) or not payload["content"].strip():
            raise UniversalVariantEngineError("candidate payload content is required")
        candidate["studentPayload"] = copy.deepcopy(payload)
    candidate["solutionGraph"] = candidate_graph
    candidate["preprocessingStepCount"] = int(source_ir["preprocessingStepCount"]) + 1
    candidate["privateTransformationData"] = {
        "kind": "C_SINGLE_PREPROCESS",
        "transform": transform,
        "preprocessNodeId": preprocess["nodeId"],
        "preprocessLoad": {"type": transform, "magnitude": 1},
        "studentObservableInputsOnly": True,
    }
    return {
        "status": "CANDIDATE_READY_FOR_PROOF",
        "candidateIR": candidate,
        "evidence": candidate["privateTransformationData"],
    }


def build_variant_proof_ledger(rows: list[dict[str, Any]], *, question_count: int | None = None) -> dict[str, Any]:
    """Build the final universal ledger without treating aggregate counts as proof."""

    if not isinstance(rows, list) or not rows:
        raise UniversalVariantEngineError("variant proof ledger rows are required")
    normalized: list[dict[str, Any]] = []
    seen: set[int] = set()
    for row in rows:
        if not isinstance(row, dict) or not isinstance(row.get("id"), int):
            raise UniversalVariantEngineError("every variant ledger row needs an integer id")
        if row["id"] in seen:
            raise UniversalVariantEngineError(f"duplicate variant ledger id: {row['id']}")
        seen.add(row["id"])
        result = row.get("result") or row.get("variant")
        if not isinstance(result, dict):
            raise UniversalVariantEngineError(f"variant result is missing for q{row['id']}")
        normalized.append({"id": row["id"], "variant": copy.deepcopy(result)})
    normalized.sort(key=lambda item: item["id"])
    expected = question_count if question_count is not None else len(normalized)
    expected_ids = set(range(1, expected + 1))
    complete = set(seen) == expected_ids and all(
        item["variant"].get("status") == "PASS"
        and item["variant"].get("verifiedClass") in {"VERIFIED_A", "VERIFIED_B", "VERIFIED_C"}
        for item in normalized
    )
    payload: dict[str, Any] = {
        "artifactType": "ALIVE_VARIANT_PROOF_LEDGER",
        "schemaVersion": UNIVERSAL_ENGINE_SCHEMA_VERSION,
        "questionCount": expected,
        "variantProofLedgerComplete": "PASS" if complete else "FAIL",
        "questions": normalized,
    }
    encoded = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    payload["ledgerSha256"] = hashlib.sha256(encoded).hexdigest()
    return payload


def evaluate_capability_promotion(
    fixture_records: list[dict[str, Any]],
    *,
    minimum_positive: int = 1,
    minimum_negative: int = 1,
) -> dict[str, Any]:
    """Evaluate promotion per family×transform, never as a family aggregate."""

    if minimum_positive < 1 or minimum_negative < 1:
        raise UniversalVariantEngineError("promotion fixture minimums must be positive")
    groups: dict[str, list[dict[str, Any]]] = {}
    for record in fixture_records:
        if not isinstance(record, dict):
            raise UniversalVariantEngineError("capability fixture record must be an object")
        family = str(record.get("familyId") or "").strip()
        transform = str(record.get("transform") or "").strip()
        if not family or not transform:
            raise UniversalVariantEngineError("capability fixture needs familyId and transform")
        groups.setdefault(f"{family}×{transform}", []).append(record)
    capabilities: list[dict[str, Any]] = []
    for key, records in sorted(groups.items()):
        positive = [item for item in records if item.get("polarity") == "positive"]
        negative = [item for item in records if item.get("polarity") == "negative"]
        all_pass = all(item.get("status") == "PASS" for item in positive)
        all_negative_pass = all(item.get("status") == "PASS" for item in negative)
        active = len(positive) >= minimum_positive and len(negative) >= minimum_negative and all_pass and all_negative_pass
        capabilities.append({
            "familyTransform": key,
            "status": "ACTIVE" if active else "HOLD",
            "positiveCount": len(positive),
            "negativeCount": len(negative),
            "allPositivePass": all_pass,
            "allNegativePass": all_negative_pass,
            "minimumPositive": minimum_positive,
            "minimumNegative": minimum_negative,
        })
    return {
        "artifactType": "ALIVE_UNIVERSAL_CAPABILITY_PROMOTION_REPORT",
        "schemaVersion": UNIVERSAL_ENGINE_SCHEMA_VERSION,
        "promotionUnit": "family×transform",
        "capabilities": capabilities,
        "activeCount": sum(item["status"] == "ACTIVE" for item in capabilities),
        "holdCount": sum(item["status"] == "HOLD" for item in capabilities),
        "productionArchiveRegistration": "NOT_PERFORMED",
    }


__all__ = [
    "TRANSFORM_A_NUMERIC",
    "TRANSFORM_B_REPRESENTATION",
    "TRANSFORM_C_INTERMEDIATE_INFERENCE",
    "TRANSFORM_C_PARAMETER_RECOVERY",
    "TRANSFORM_C_REPRESENTATION_DECODE",
    "UNIVERSAL_ENGINE_SCHEMA_VERSION",
    "UniversalVariantEngineError",
    "adapt_b_candidate",
    "apply_a_parameter_variant",
    "build_c_variant",
    "build_variant_plan",
    "build_variant_proof_ledger",
    "evaluate_capability_promotion",
]
