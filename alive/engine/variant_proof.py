"""Variant evidence sidecar validation and deterministic class reduction."""

from __future__ import annotations

from typing import Any, Iterable


VARIANT_PROOF_SCHEMA_VERSION = "0.1.0"
VARIANT_PROOF_ARTIFACT = "ALIVE_VARIANT_PROOF_SIDECAR"
DECLARED_CLASSES = {"A", "B", "C"}
VERIFIED_CLASSES = {"VERIFIED_A", "VERIFIED_B", "VERIFIED_C", "FAKE_C", "ADVANCED", "REJECT", "HOLD"}
CHECK_STATUSES = {"PASS", "FAIL", "UNVERIFIED", "NOT_APPLICABLE"}


class VariantProofError(ValueError):
    """Raised when a proof sidecar violates its transport contract."""


REQUIRED_SIDECAR_FIELDS = (
    "artifactType",
    "schemaVersion",
    "sourceQuestionId",
    "declaredClass",
    "verifiedClass",
    "structureFamily",
    "transform",
    "capabilityStatus",
    "coreConceptPreserved",
    "solutionGraphPreserved",
    "coreDecisionDelta",
    "branchDelta",
    "newConceptDelta",
    "preprocessingDelta",
    "preprocessLoad",
    "preprocessDeterministic",
    "preprocessOutputArity",
    "studentObservableInputsOnly",
    "ablationPassed",
    "shortcutBlocked",
    "difficultyDelta",
    "proofChecks",
    "proofSha256",
)

REQUIRED_CHECKS = {
    "A": (
        "coreConceptPreserved",
        "solutionGraphPreserved",
        "parameterChanged",
        "effectiveParameterChangeCount",
        "parameterDistance",
        "answerMemoryShortcut",
        "curriculumPreserved",
    ),
    "B": (
        "coreConceptPreserved",
        "solutionGraphPreserved",
        "representationChanged",
        "antiClone",
        "curriculumPreserved",
    ),
    "C": (
        "coreConceptPreserved",
        "solutionGraphPreserved",
        "preprocessingDelta",
        "preprocessDeterministic",
        "studentObservableInputsOnly",
        "ablationPassed",
        "shortcutBlocked",
        "goalPreserved",
        "curriculumPreserved",
    ),
}


def build_proof_check(
    check: str,
    status: str,
    *,
    method: str,
    evidence_refs: Iterable[str],
    summary: str | None = None,
) -> dict[str, Any]:
    """Create a short, auditable check record without chain-of-thought."""

    if not isinstance(check, str) or not check.strip():
        raise VariantProofError("proof check name is required")
    if status not in CHECK_STATUSES:
        raise VariantProofError(f"unsupported proof check status: {status}")
    if not isinstance(method, str) or not method.strip():
        raise VariantProofError(f"method is required for proof check: {check}")
    refs = list(evidence_refs)
    if not all(isinstance(ref, str) and ref.strip() for ref in refs):
        raise VariantProofError(f"evidenceRefs must contain non-empty strings: {check}")
    if status in {"PASS", "FAIL"} and not refs:
        raise VariantProofError(f"evidenceRefs are required for {status} check: {check}")
    result: dict[str, Any] = {
        "check": check.strip(),
        "status": status,
        "method": method.strip(),
        "evidenceRefs": [ref.strip() for ref in refs],
    }
    if summary:
        result["summary"] = summary.strip()
    return result


def validate_variant_proof_sidecar(value: Any) -> dict[str, Any]:
    """Validate sidecar shape and evidence metadata, without class reduction."""

    if not isinstance(value, dict):
        return {"status": "FAIL", "errors": ["variant proof sidecar must be an object"]}
    errors: list[str] = []
    errors.extend(f"missing:{field}" for field in REQUIRED_SIDECAR_FIELDS if field not in value)
    if value.get("artifactType") != VARIANT_PROOF_ARTIFACT:
        errors.append("artifactType is invalid")
    if value.get("schemaVersion") != VARIANT_PROOF_SCHEMA_VERSION:
        errors.append("schemaVersion is unsupported")
    for field in ("sourceQuestionId", "structureFamily", "transform", "proofSha256"):
        if field in value and (not isinstance(value[field], str) or not value[field].strip()):
            errors.append(f"{field} must be a non-empty string")
    if value.get("declaredClass") not in DECLARED_CLASSES:
        errors.append("declaredClass must be A, B, or C")
    if value.get("verifiedClass") not in VERIFIED_CLASSES:
        errors.append("verifiedClass is invalid")
    if value.get("capabilityStatus") not in {"SUPPORTED", "HOLD", "UNSUPPORTED", "PENDING"}:
        errors.append("capabilityStatus is invalid")
    for field in ("coreConceptPreserved", "solutionGraphPreserved", "preprocessDeterministic", "studentObservableInputsOnly", "ablationPassed", "shortcutBlocked"):
        if field in value and not isinstance(value[field], bool):
            errors.append(f"{field} must be boolean")
    for field in ("coreDecisionDelta", "branchDelta", "newConceptDelta", "preprocessingDelta", "preprocessOutputArity"):
        field_value = value.get(field)
        if field in value and (not isinstance(field_value, int) or isinstance(field_value, bool)):
            errors.append(f"{field} must be an integer")
        elif field in value and field_value < 0:
            errors.append(f"{field} must be non-negative")
    if "preprocessLoad" in value:
        load = value["preprocessLoad"]
        if not isinstance(load, dict) or not isinstance(load.get("type"), str) or not load.get("type", "").strip():
            errors.append("preprocessLoad must contain a non-empty type")
        elif not isinstance(load.get("magnitude"), int) or isinstance(load.get("magnitude"), bool) or load["magnitude"] < 0:
            errors.append("preprocessLoad.magnitude must be a non-negative integer")
    if "proofChecks" in value:
        checks = value["proofChecks"]
        if not isinstance(checks, list):
            errors.append("proofChecks must be an array")
        else:
            seen: set[str] = set()
            for index, item in enumerate(checks):
                if not isinstance(item, dict):
                    errors.append(f"proofChecks[{index}] must be an object")
                    continue
                name = item.get("check")
                if not isinstance(name, str) or not name.strip():
                    errors.append(f"proofChecks[{index}].check is required")
                elif name in seen:
                    errors.append(f"duplicate proof check: {name}")
                else:
                    seen.add(name)
                if item.get("status") not in CHECK_STATUSES:
                    errors.append(f"proofChecks[{index}].status is invalid")
                if not isinstance(item.get("method"), str) or not item.get("method", "").strip():
                    errors.append(f"proofChecks[{index}].method is required")
                refs = item.get("evidenceRefs")
                if not isinstance(refs, list) or not all(isinstance(ref, str) and ref.strip() for ref in refs):
                    errors.append(f"proofChecks[{index}].evidenceRefs is invalid")
                elif item.get("status") in {"PASS", "FAIL"} and not refs:
                    errors.append(f"proofChecks[{index}].evidenceRefs is empty")
    return {"status": "PASS" if not errors else "FAIL", "errors": errors}


def _check_map(sidecar: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {item["check"]: item for item in sidecar["proofChecks"]}


def _result(status: str, verified_class: str, *, codes: list[str], **extra: Any) -> dict[str, Any]:
    return {"status": status, "verifiedClass": verified_class, "codes": codes, **extra}


def reduce_variant_class(
    sidecar: Any,
    *,
    evidence_catalog: set[str] | None = None,
) -> dict[str, Any]:
    """Reduce evidence to a class using fixed, fail-closed rules.

    ``evidence_catalog`` is intentionally required in production callers.  A
    sidecar containing references but no resolvable evidence is HOLD, never an
    automatic PASS.
    """

    report = validate_variant_proof_sidecar(sidecar)
    if report["status"] != "PASS":
        return _result("HOLD", "HOLD", codes=["VARIANT_PROOF_INVALID"], errors=report["errors"])
    assert isinstance(sidecar, dict)
    declared = sidecar["declaredClass"]
    if sidecar["structureFamily"] == "MIXED":
        return _result("HOLD", "HOLD", codes=["MIXED_OR_UNSUPPORTED_CAPABILITY"])
    if sidecar["capabilityStatus"] != "SUPPORTED":
        return _result("HOLD", "HOLD", codes=["CAPABILITY_NOT_SUPPORTED"])
    checks = _check_map(sidecar)
    required = REQUIRED_CHECKS[declared]
    missing = [name for name in required if name not in checks]
    if missing:
        return _result("HOLD", "HOLD", codes=["VARIANT_PROOF_CHECK_MISSING"], missingChecks=missing)
    if evidence_catalog is None:
        return _result("HOLD", "HOLD", codes=["EVIDENCE_CATALOG_MISSING"])
    unresolved_refs = sorted(
        {
            ref
            for item in checks.values()
            for ref in item["evidenceRefs"]
            if ref not in evidence_catalog
        }
    )
    if unresolved_refs:
        return _result("HOLD", "HOLD", codes=["EVIDENCE_REFERENCE_UNRESOLVED"], unresolvedRefs=unresolved_refs)
    unresolved = [name for name in required if checks[name]["status"] in {"UNVERIFIED", "NOT_APPLICABLE"}]
    if unresolved:
        return _result("HOLD", "HOLD", codes=["VARIANT_PROOF_UNVERIFIED"], unresolvedChecks=unresolved)
    failed = [name for name in required if checks[name]["status"] == "FAIL"]
    if failed:
        if declared == "C" and "ablationPassed" in failed:
            return _result("FAIL", "FAKE_C", codes=["C_ABLATION_FAILED"], failedChecks=failed)
        return _result("FAIL", "REJECT", codes=["VARIANT_PROOF_FAILED"], failedChecks=failed)

    core_delta = sidecar["coreDecisionDelta"]
    branch_delta = sidecar["branchDelta"]
    concept_delta = sidecar["newConceptDelta"]
    if core_delta > 0 or branch_delta > 0 or concept_delta > 0:
        return _result("FAIL", "ADVANCED", codes=["CORE_STRUCTURE_DELTA"])

    preprocessing_delta = sidecar["preprocessingDelta"]
    if declared == "A":
        if preprocessing_delta != 0:
            return _result("FAIL", "REJECT", codes=["A_PREPROCESSING_DELTA"])
        if sidecar["preprocessOutputArity"] != 0 or sidecar["preprocessLoad"]["magnitude"] != 0:
            return _result("FAIL", "REJECT", codes=["A_PREPROCESSING_CONTRACT"])
        return _result("PASS", "VERIFIED_A", codes=[])
    if declared == "B":
        if preprocessing_delta != 0:
            return _result("FAIL", "REJECT", codes=["B_PREPROCESSING_DELTA"])
        return _result("PASS", "VERIFIED_B", codes=[])

    # C is exactly one deterministic, required, student-observable semantic
    # preprocessing object before the unchanged core route.
    if preprocessing_delta == 0:
        return _result("FAIL", "FAKE_C", codes=["C_NO_PREPROCESSING"])
    if preprocessing_delta != 1 or sidecar["preprocessLoad"]["magnitude"] != 1:
        return _result("FAIL", "ADVANCED", codes=["C_MULTIPLE_PREPROCESS"])
    if not sidecar["preprocessDeterministic"] or sidecar["preprocessOutputArity"] != 1:
        return _result("FAIL", "REJECT", codes=["C_PREPROCESSING_CONTRACT"])
    if not sidecar["studentObservableInputsOnly"]:
        return _result("FAIL", "REJECT", codes=["C_PRIVATE_INPUT"])
    return _result("PASS", "VERIFIED_C", codes=[])


__all__ = [
    "CHECK_STATUSES",
    "DECLARED_CLASSES",
    "REQUIRED_CHECKS",
    "REQUIRED_SIDECAR_FIELDS",
    "VARIANT_PROOF_ARTIFACT",
    "VARIANT_PROOF_SCHEMA_VERSION",
    "VariantProofError",
    "build_proof_check",
    "reduce_variant_class",
    "validate_variant_proof_sidecar",
]
