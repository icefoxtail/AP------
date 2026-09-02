"""Deterministic mixed-exam planner for universal A/B/C runs.

The planner assigns a requested class and transform to each source question
while preserving source order and question-level anchors.  It never silently
falls back from an unsupported capability; that assignment is explicitly
HOLD for later review.
"""

from __future__ import annotations

from collections import Counter
from typing import Any, Iterable, Mapping

from .curriculum_adapters import CurriculumAdapterRegistry
from .structure_families import StructureFamilyRegistry


class MixedExamPlannerError(ValueError):
    pass


_DEFAULT_TRANSFORM = {
    "A": "numeric",
    "B": "representation",
    "C": "PARAMETER_RECOVERY",
}


def _class_sequence(target_classes: Iterable[str] | None, count: int) -> list[str]:
    requested = list(target_classes or ("A", "B", "C"))
    if not requested or any(item not in {"A", "B", "C"} for item in requested):
        raise MixedExamPlannerError("target_classes must contain only A, B, or C")
    return [requested[index % len(requested)] for index in range(count)]


def _normalize_class_ranges(
    ranges: Mapping[str, Mapping[str, Any]] | None,
    count: int,
) -> dict[str, dict[str, int]]:
    """Validate optional A/B/C count ranges without guessing missing values."""

    if ranges is None:
        return {}
    if not isinstance(ranges, Mapping):
        raise MixedExamPlannerError("target_class_ranges must be an object")
    normalized: dict[str, dict[str, int]] = {}
    for variant_class, value in ranges.items():
        if variant_class not in {"A", "B", "C"} or not isinstance(value, Mapping):
            raise MixedExamPlannerError("target_class_ranges must map A/B/C to objects")
        minimum = value.get("min", 0)
        maximum = value.get("max", count)
        if isinstance(minimum, bool) or isinstance(maximum, bool):
            raise MixedExamPlannerError("target class range bounds must be integers")
        try:
            minimum = int(minimum)
            maximum = int(maximum)
        except (TypeError, ValueError) as error:
            raise MixedExamPlannerError("target class range bounds must be integers") from error
        if minimum < 0 or maximum < minimum or maximum > count:
            raise MixedExamPlannerError("target class range is invalid")
        normalized[variant_class] = {"min": minimum, "max": maximum}
    return normalized


def _source_distribution(source_questions: list[dict[str, Any]]) -> dict[str, Any]:
    """Capture source anchors so a planner cannot silently rebalance the paper."""

    families = Counter(str(item.get("structureFamily") or "MIXED") for item in source_questions)
    question_types = Counter(str(item.get("questionType") or "unknown") for item in source_questions)
    difficulty = Counter()
    for item in source_questions:
        anchor = item.get("difficultyVector")
        if isinstance(anchor, Mapping):
            # A named level is more useful than serializing the full vector;
            # retain an explicit fallback when only numeric dimensions exist.
            label = anchor.get("level") or anchor.get("band") or "vector"
        else:
            label = anchor if anchor is not None else item.get("level", "unknown")
        difficulty[str(label)] += 1
    constructed_types = {"주관식", "서술형"}
    return {
        "structureFamily": dict(sorted(families.items())),
        "questionType": dict(sorted(question_types.items())),
        "difficulty": dict(sorted(difficulty.items())),
        "visualCount": sum(bool(item.get("visualRequired", False)) for item in source_questions),
        "constructedResponseCount": sum(str(item.get("questionType")) in constructed_types for item in source_questions),
    }


def build_mixed_exam_plan(
    source_questions: list[dict[str, Any]],
    *,
    registry: StructureFamilyRegistry,
    curriculum_registry: CurriculumAdapterRegistry | None = None,
    target_classes: Iterable[str] | None = None,
    target_class_ranges: Mapping[str, Mapping[str, Any]] | None = None,
    planner_policy: Mapping[str, Any] | None = None,
    school_profile: Mapping[str, Any] | None = None,
) -> dict[str, Any]:
    """Plan a whole exam without generating or editing student questions."""

    if not isinstance(source_questions, list) or not source_questions:
        raise MixedExamPlannerError("source_questions must be a non-empty list")
    seen: set[int] = set()
    for question in source_questions:
        if not isinstance(question, dict) or not isinstance(question.get("id"), int):
            raise MixedExamPlannerError("every source question needs an integer id")
        if question["id"] in seen:
            raise MixedExamPlannerError(f"duplicate source question id: {question['id']}")
        seen.add(question["id"])

    sequence = _class_sequence(target_classes, len(source_questions))
    policy = dict(planner_policy or {})
    if not isinstance(policy, dict):
        raise MixedExamPlannerError("planner_policy must be an object")
    if school_profile is not None and not isinstance(school_profile, Mapping):
        raise MixedExamPlannerError("school_profile must be an object")
    ranges = _normalize_class_ranges(
        target_class_ranges if target_class_ranges is not None else policy.get("targetClassRanges"),
        len(source_questions),
    )
    allow_substitution = policy.get("allowClassSubstitution", False)
    if not isinstance(allow_substitution, bool):
        raise MixedExamPlannerError("allowClassSubstitution must be boolean")
    max_visual = policy.get("maxVisualCount")
    max_constructed = policy.get("maxConstructedResponseCount")
    for name, value in (("maxVisualCount", max_visual), ("maxConstructedResponseCount", max_constructed)):
        if value is not None and (isinstance(value, bool) or not isinstance(value, int) or value < 0):
            raise MixedExamPlannerError(f"{name} must be a non-negative integer")
    source_distribution = _source_distribution(source_questions)
    assigned_counts: Counter[str] = Counter()
    assigned_visual = 0
    assigned_constructed = 0
    assignments: list[dict[str, Any]] = []
    for question, preferred_class in zip(source_questions, sequence):
        declared_class = preferred_class
        eligible = question.get("allowedVariantClasses")
        eligibility_list = eligible if isinstance(eligible, list) else ["A", "B", "C"]
        if allow_substitution and preferred_class not in eligibility_list:
            alternatives = [item for item in sequence if item in eligibility_list]
            for alternative in alternatives:
                range_spec = ranges.get(alternative)
                if range_spec is None or assigned_counts[alternative] < range_spec["max"]:
                    declared_class = alternative
                    break
        range_spec = ranges.get(declared_class)
        if range_spec is not None and assigned_counts[declared_class] >= range_spec["max"]:
            declared_class = preferred_class
        unit_key = question.get("unitKey")
        canonical_adapter = None
        curriculum_mismatch = False
        if curriculum_registry is not None and unit_key is not None:
            canonical_adapter = curriculum_registry.require(str(unit_key))
            declared_family = question.get("structureFamily")
            canonical_family = getattr(canonical_adapter, "family_id", None)
            curriculum_mismatch = (
                canonical_family is not None
                and declared_family is not None
                and str(declared_family) != str(canonical_family)
            )
            # A catalog row without a registered adapter is still useful for
            # canonical ordering, but it must not invent a family.  Preserve
            # an explicit analyzed family; otherwise the safe result is MIXED
            # and the capability preflight will HOLD it.
            family = str(canonical_family or declared_family or "MIXED")
        else:
            family = str(question.get("structureFamily") or "MIXED")
        transform_by_class = question.get("transformByClass")
        if transform_by_class is not None and not isinstance(transform_by_class, dict):
            raise MixedExamPlannerError("transformByClass must be an object when provided")
        transform = str((transform_by_class or {}).get(declared_class) or _DEFAULT_TRANSFORM[declared_class])
        capability = registry.capability(family, transform)
        eligibility_ok = not isinstance(eligible, list) or declared_class in eligible
        if curriculum_mismatch:
            status = "HOLD"
            code = "CURRICULUM_FAMILY_MISMATCH"
        elif not eligibility_ok:
            status = "HOLD"
            code = "QUESTION_VARIANT_CLASS_NOT_ELIGIBLE"
        elif capability.get("status") == "SUPPORTED":
            status = "READY"
            code = None
        else:
            status = "HOLD"
            code = "CAPABILITY_PRECHECK_FAIL"
        is_visual = bool(question.get("visualRequired", False))
        is_constructed = str(question.get("questionType")) in {"주관식", "서술형"}
        if max_visual is not None and assigned_visual + int(is_visual) > max_visual:
            status = "HOLD"
            code = "VISUAL_WORKLOAD_LIMIT"
        if max_constructed is not None and assigned_constructed + int(is_constructed) > max_constructed:
            status = "HOLD"
            code = "CONSTRUCTED_RESPONSE_LIMIT"
        assigned_counts[declared_class] += 1
        assigned_visual += int(is_visual)
        assigned_constructed += int(is_constructed)
        assignments.append(
            {
                "id": question["id"],
                "sourceOrdinal": question["id"],
                "unitKey": str(unit_key) if unit_key is not None else None,
                "canonicalUnit": {
                    "label": canonical_adapter.label,
                    "courseKey": canonical_adapter.course_key,
                    "familyId": getattr(canonical_adapter, "family_id", None),
                    "adapterStatus": getattr(canonical_adapter, "adapter_status", "SUPPORTED"),
                    "promotionState": getattr(canonical_adapter, "promotion_state", "HOLD"),
                }
                if canonical_adapter is not None
                else None,
                "structureFamily": family,
                "declaredClass": declared_class,
                "transform": transform,
                "familyTransform": f"{family}×{transform}",
                "capability": capability,
                "difficultyAnchor": question.get("difficultyVector") or question.get("level"),
                "questionType": question.get("questionType"),
                "visualRequired": bool(question.get("visualRequired", False)),
                "status": status,
                "code": code,
            }
        )
    assignments.sort(key=lambda item: item["sourceOrdinal"])
    range_violations = [
        {
            "variantClass": variant_class,
            "count": assigned_counts[variant_class],
            "min": bounds["min"],
            "max": bounds["max"],
        }
        for variant_class, bounds in sorted(ranges.items())
        if assigned_counts[variant_class] < bounds["min"] or assigned_counts[variant_class] > bounds["max"]
    ]
    range_status = "PASS" if not range_violations else "HOLD"
    planned_distribution = {
        "variantClass": dict(sorted(assigned_counts.items())),
        "visualCount": assigned_visual,
        "constructedResponseCount": assigned_constructed,
    }
    return {
        "artifactType": "ALIVE_UNIVERSAL_MIXED_EXAM_PLAN",
        "schemaVersion": "0.1.0",
        "sourceQuestionCount": len(source_questions),
        "sourceQuestionOrder": [question["id"] for question in source_questions],
        "sourceOrderPreserved": [item["sourceOrdinal"] for item in assignments] == sorted(seen),
        "sourceDistribution": source_distribution,
        "schoolProfile": dict(school_profile or {}),
        "targetClassSequence": sequence,
        "targetClassRanges": ranges,
        "plannedDistribution": planned_distribution,
        "rangeStatus": range_status,
        "rangeViolations": range_violations,
        "plannerPolicy": {
            "allowClassSubstitution": allow_substitution,
            "maxVisualCount": max_visual,
            "maxConstructedResponseCount": max_constructed,
            "difficultyAnchorPolicy": "PRESERVE_SOURCE_ANCHOR",
            "questionTypePolicy": "PRESERVE_SOURCE_TYPE",
        },
        "assignments": assignments,
        "readyCount": sum(item["status"] == "READY" for item in assignments),
        "holdCount": sum(item["status"] == "HOLD" for item in assignments),
        "status": "PASS" if range_status == "PASS" and all(item["status"] == "READY" for item in assignments) else "HOLD",
        "fallbackPolicy": "NO_SILENT_VARIANT_OR_FAMILY_FALLBACK",
        "productionArchiveRegistration": "NOT_PERFORMED",
    }


__all__ = ["MixedExamPlannerError", "build_mixed_exam_plan"]
