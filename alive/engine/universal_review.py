"""Separated independent-review views and ledger for universal candidates."""

from __future__ import annotations

import copy
from typing import Any, Iterable


UNIVERSAL_REVIEW_SCHEMA_VERSION = "0.1.0"
UNIVERSAL_REVIEW_ARTIFACT = "ALIVE_UNIVERSAL_REVIEW_LEDGER"
REVIEW_VIEWS = ("blindMath", "solution", "variantComparison")


class UniversalReviewError(ValueError):
    pass


def build_independent_review_views(source_ir: dict[str, Any], candidate: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """Create disjoint input views; each reviewer gets only its own view."""

    if not isinstance(source_ir, dict) or not isinstance(candidate, dict):
        raise UniversalReviewError("source_ir and candidate must be objects")
    student = candidate.get("studentPayload")
    if not isinstance(student, dict):
        raise UniversalReviewError("candidate studentPayload is required")
    blind = {
        "view": "Blind Math View",
        "sourceAnswerHidden": True,
        "builderAnswerHidden": True,
        "studentPayload": copy.deepcopy(student),
        "visualSpec": copy.deepcopy(candidate.get("visualSpec")),
        "solutionVisualSpec": copy.deepcopy(candidate.get("solutionVisualSpec")),
    }
    solution = {
        "view": "Solution View",
        "sourceAnswerHidden": True,
        "candidateStudentPayload": copy.deepcopy(student),
        "solution": candidate.get("solution"),
        "solutionDetail": copy.deepcopy(candidate.get("solutionDetail")),
        "solutionVisualSpec": copy.deepcopy(candidate.get("solutionVisualSpec")),
    }
    comparison = {
        "view": "Variant Comparison View",
        "sourceIR": copy.deepcopy(source_ir),
        "candidateIR": copy.deepcopy(candidate),
        "previousReviewerReasoningVisible": False,
    }
    return {"blindMath": blind, "solution": solution, "variantComparison": comparison}


def validate_universal_review_ledger(
    value: Any,
    question_count: int,
    *,
    evidence_catalog: Iterable[str] | None = None,
) -> dict[str, Any]:
    """Validate all three review views and resolve every evidence reference."""

    findings: list[dict[str, Any]] = []
    if not isinstance(value, dict) or value.get("artifactType") != UNIVERSAL_REVIEW_ARTIFACT:
        return {"status": "FAIL", "findings": [{"code": "REVIEW_LEDGER_TYPE_INVALID"}]}
    if value.get("schemaVersion") != UNIVERSAL_REVIEW_SCHEMA_VERSION:
        findings.append({"code": "REVIEW_LEDGER_SCHEMA_INVALID"})
    rows_value = value.get("questions")
    if not isinstance(rows_value, list):
        return {"status": "FAIL", "findings": findings + [{"code": "REVIEW_ROWS_MISSING"}]}
    rows: dict[int, dict[str, Any]] = {}
    catalog = set(evidence_catalog) if evidence_catalog is not None else None
    for row in rows_value:
        if not isinstance(row, dict) or not isinstance(row.get("id"), int):
            findings.append({"code": "REVIEW_ROW_INVALID"})
            continue
        ordinal = row["id"]
        if ordinal in rows:
            findings.append({"code": "REVIEW_ROW_DUPLICATE", "id": ordinal})
        rows[ordinal] = row
        for view_name in REVIEW_VIEWS:
            view = row.get(view_name)
            if not isinstance(view, dict) or view.get("status") != "PASS":
                findings.append({"code": "REVIEW_VIEW_NOT_PASS", "id": ordinal, "view": view_name})
                continue
            method = view.get("method")
            refs = view.get("evidenceRefs")
            if not isinstance(method, str) or not method.strip() or not isinstance(refs, list) or not refs or not all(isinstance(ref, str) and ref.strip() for ref in refs):
                findings.append({"code": "REVIEW_EVIDENCE_CONTRACT_INVALID", "id": ordinal, "view": view_name})
            elif catalog is not None:
                findings.extend(
                    {"code": "REVIEW_EVIDENCE_UNRESOLVED", "id": ordinal, "view": view_name, "ref": ref}
                    for ref in refs
                    if ref not in catalog
                )
    expected = set(range(1, question_count + 1))
    findings.extend({"code": "REVIEW_ROW_MISSING", "id": ordinal} for ordinal in sorted(expected - set(rows)))
    findings.extend({"code": "REVIEW_ROW_OUT_OF_RANGE", "id": ordinal} for ordinal in sorted(set(rows) - expected))
    return {
        "status": "PASS" if not findings else "FAIL",
        "questionCount": question_count,
        "rowCount": len(rows),
        "views": list(REVIEW_VIEWS),
        "findings": findings,
    }


__all__ = [
    "REVIEW_VIEWS",
    "UNIVERSAL_REVIEW_ARTIFACT",
    "UNIVERSAL_REVIEW_SCHEMA_VERSION",
    "UniversalReviewError",
    "build_independent_review_views",
    "validate_universal_review_ledger",
]
