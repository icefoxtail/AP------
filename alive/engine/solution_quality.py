from __future__ import annotations

"""Student-facing solution and solution-visual contracts for STAGED_EXAM.

The model still writes the mathematical explanation, but the runtime owns the
minimum student-facing structure.  This keeps a concise teacher answer from
silently becoming the final student solution and makes solution diagrams a
first-class, hash-bound candidate asset.
"""

import copy
import re
from collections.abc import Mapping
from typing import Any


SOLUTION_CONTRACT_VERSION = "0.1"
SOLUTION_VISUAL_REQUIREMENTS = frozenset({"MANDATORY", "RECOMMENDED", "NOT_REQUIRED"})

_CIRCLE_TERMS = (
    "원의방정식",
    "원 방정식",
    "원과 직선",
    "원과직선",
    "접선",
    "접점",
    "공통현",
    "반지름",
    "원의 중심",
    "원 중심",
    # Do not use the bare phrase "중심에서" here.  It is a substring of
    # ordinary non-circle wording such as "무게중심에서도" and would
    # incorrectly force a circle_geometry diagram on coordinate problems.
)
_GEOMETRY_TERMS = _CIRCLE_TERMS + (
    "수선",
    "직각",
    "현",
    "삼각형",
    "사각형",
    "좌표평면",
    "기울기",
    "교점",
    "대칭",
    "평행이동",
)
_LINE_TERMS = ("직선", "접선", "공통현")
_TANGENT_TERMS = ("접선", "접점")
_CHORD_TERMS = ("공통현",)
_EXPLICIT_CHORD_RE = re.compile(r"공통\s*현|(?<![가-힣])현(?:[가-힣]*)")


class SolutionQualityError(ValueError):
    """Raised when the student-facing solution contract is incomplete."""


def _visual_kind_items(spec: Mapping[str, Any]) -> list[Mapping[str, Any]]:
    items: list[Mapping[str, Any]] = []
    for key in ("segments", "lines"):
        raw_items = spec.get(key, [])
        if isinstance(raw_items, list):
            items.extend(item for item in raw_items if isinstance(item, Mapping))
    return items


def validate_solution_visual_spec(
    spec: Any,
    *,
    student_payload: Mapping[str, Any],
    solution: str,
    inferred_visual_requirement: str,
    preflight_item: Mapping[str, Any] | None = None,
) -> dict[str, str]:
    """Validate the pedagogical contents of a solution diagram.

    The SVG renderer validates coordinates and determinism.  This second
    contract checks whether the diagram contains the mathematical objects a
    student needs to follow the written solution.  Requirements are derived
    from the question/solution text so a plain circle-equation question does
    not receive an invented tangent line.
    """

    elements = infer_solution_visual_elements(student_payload, solution, preflight_item)
    circle_required = elements["circle"]
    if circle_required and inferred_visual_requirement == "MANDATORY":
        if not isinstance(spec, Mapping) or spec.get("type") != "circle_geometry":
            raise SolutionQualityError(
                "circle-related student solutions require solutionVisualSpec.type=circle_geometry"
            )
    if not isinstance(spec, Mapping) or spec.get("type") != "circle_geometry":
        return {}

    errors: list[str] = []
    circles = spec.get("circles")
    if not isinstance(circles, list) or not circles:
        errors.append("circle_geometry must show at least one circle")

    labelled_point = False
    if isinstance(spec.get("points"), list):
        labelled_point = any(
            isinstance(point, Mapping)
            and isinstance(point.get("label"), str)
            and point["label"].strip()
            for point in spec["points"]
        )
    if isinstance(circles, list):
        labelled_point = labelled_point or any(
            isinstance(circle, Mapping)
            and isinstance(circle.get("center"), Mapping)
            and isinstance(circle["center"].get("label"), str)
            and circle["center"]["label"].strip()
            for circle in circles
        )
    if not labelled_point:
        errors.append("circle_geometry must include at least one labelled point or centre")

    items = _visual_kind_items(spec)
    kinds = {str(item.get("kind", "segment")).strip().casefold() for item in items}
    if "radius" not in kinds:
        errors.append("circle_geometry must include a radius construction")

    if elements["line"]:
        if not any(kind in kinds for kind in {"segment", "tangent", "chord", "line", "perpendicular"}):
            errors.append("the solution mentions a line but the diagram has no line construction")

    tangent_required = elements["tangent"]
    if tangent_required:
        if "tangent" not in kinds:
            errors.append("tangent/point-of-contact solutions require a tangent construction")
        if not isinstance(spec.get("rightAngles"), list) or not spec["rightAngles"]:
            errors.append("tangent solutions require at least one right-angle marker")

    if elements["chord"]:
        if "chord" not in kinds:
            errors.append("chord solutions require a chord construction")

    if errors:
        raise SolutionQualityError("; ".join(errors))
    return {
        "circle": "PASS",
        "labelledPoint": "PASS",
        "radius": "PASS",
        "line": "PASS" if elements["line"] else "NOT_APPLICABLE",
        "tangent": "PASS" if tangent_required else "NOT_APPLICABLE",
        "rightAngle": "PASS" if tangent_required else "NOT_APPLICABLE",
        "chord": "PASS" if elements["chord"] else "NOT_APPLICABLE",
    }


def _text(value: Any) -> str:
    return value.strip() if isinstance(value, str) else ""


def _joined_source_text(
    student_payload: Mapping[str, Any], solution: str, preflight_item: Mapping[str, Any]
) -> str:
    parts: list[str] = []
    for key in ("content", "category", "originalCategory", "standardUnit", "subUnit"):
        value = student_payload.get(key)
        if isinstance(value, list):
            parts.extend(str(item) for item in value)
        elif value is not None:
            parts.append(str(value))
    parts.append(solution)
    parts.extend(str(item) for item in preflight_item.get("tags", []) if item is not None)
    return " ".join(parts).casefold().replace(" ", "")


def infer_solution_visual_elements(
    student_payload: Mapping[str, Any],
    solution: str,
    preflight_item: Mapping[str, Any] | None = None,
) -> dict[str, bool]:
    """Infer which circle-geometry constructions the student solution uses."""

    context = preflight_item or {}
    compact = _joined_source_text(student_payload, solution, context)
    raw_parts: list[str] = []
    for key in ("content", "category", "originalCategory", "standardUnit", "subUnit"):
        value = student_payload.get(key)
        if isinstance(value, list):
            raw_parts.extend(str(item) for item in value)
        elif value is not None:
            raw_parts.append(str(value))
    raw_parts.append(solution)
    if isinstance(context, Mapping):
        raw_parts.extend(str(item) for item in context.get("tags", []) if item is not None)
    explicit_chord = bool(_EXPLICIT_CHORD_RE.search(" ".join(raw_parts).casefold()))
    hinted = context.get("solutionVisualElements") if isinstance(context, Mapping) else None
    result = {
        "circle": any(term.replace(" ", "") in compact for term in _CIRCLE_TERMS),
        "line": any(term.replace(" ", "") in compact for term in _LINE_TERMS) or explicit_chord,
        "tangent": any(term.replace(" ", "") in compact for term in _TANGENT_TERMS),
        "chord": explicit_chord,
    }
    if isinstance(hinted, Mapping):
        for key in result:
            result[key] = result[key] or hinted.get(key) is True
    return result


def infer_solution_visual_requirement(
    student_payload: Mapping[str, Any],
    solution: str,
    preflight_item: Mapping[str, Any],
    detail: Mapping[str, Any] | None = None,
) -> str:
    """Infer the minimum diagram policy without trusting a model downgrade.

    Circle/line/tangent geometry is mandatory because a student-facing proof
    benefits from construction lines and labelled points.  Other geometry is
    recommended unless the model explicitly requests a mandatory diagram.
    """

    elements = infer_solution_visual_elements(student_payload, solution, preflight_item)
    if elements["circle"]:
        return "MANDATORY"
    explicit = _text((detail or {}).get("diagramRequirement")).upper()
    if explicit == "MANDATORY":
        return "MANDATORY"
    text = _joined_source_text(student_payload, solution, preflight_item)
    if any(term.replace(" ", "") in text for term in _GEOMETRY_TERMS):
        return "RECOMMENDED"
    if preflight_item.get("visualDependency") != "NONE":
        return "RECOMMENDED"
    return "NOT_REQUIRED"


def _require_text(detail: Mapping[str, Any], key: str, errors: list[str]) -> str:
    value = _text(detail.get(key))
    if not value:
        errors.append(f"solutionDetail.{key} must be a non-empty string")
    return value


def normalize_solution_detail(
    raw: Any,
    *,
    inferred_visual_requirement: str,
) -> dict[str, Any]:
    """Validate and normalize the structured student solution contract."""

    if not isinstance(raw, Mapping):
        raise SolutionQualityError("solutionDetail must be an object")
    detail = copy.deepcopy(dict(raw))
    errors: list[str] = []
    if detail.get("version") != SOLUTION_CONTRACT_VERSION:
        errors.append(f"solutionDetail.version must equal {SOLUTION_CONTRACT_VERSION}")
    if detail.get("audience") != "student":
        errors.append("solutionDetail.audience must equal student")
    if detail.get("depth") not in {"detailed", "student_detailed"}:
        errors.append("solutionDetail.depth must be detailed")

    for key in ("given", "goal", "keyIdea", "check"):
        _require_text(detail, key, errors)
    concept_note = _text(detail.get("conceptNote"))
    if inferred_visual_requirement == "MANDATORY" and not concept_note:
        errors.append("solutionDetail.conceptNote is required for a mandatory solution diagram")

    raw_steps = detail.get("steps")
    if not isinstance(raw_steps, list):
        errors.append("solutionDetail.steps must be an array")
        raw_steps = []
    minimum_steps = 3 if inferred_visual_requirement == "MANDATORY" else 2
    if len(raw_steps) < minimum_steps:
        errors.append(f"solutionDetail.steps must contain at least {minimum_steps} steps")
    steps: list[dict[str, str]] = []
    for index, raw_step in enumerate(raw_steps):
        if not isinstance(raw_step, Mapping):
            errors.append(f"solutionDetail.steps[{index}] must be an object")
            continue
        title = _text(raw_step.get("title")) or f"풀이 {index + 1}"
        work = _text(raw_step.get("work") or raw_step.get("equation"))
        why = _text(raw_step.get("why") or raw_step.get("reason"))
        if not work:
            errors.append(f"solutionDetail.steps[{index}].work must be non-empty")
        if not why:
            errors.append(f"solutionDetail.steps[{index}].why must be non-empty")
        steps.append({"title": title, "work": work, "why": why})

    raw_mistakes = detail.get("commonMistakes")
    if not isinstance(raw_mistakes, list) or not raw_mistakes:
        errors.append("solutionDetail.commonMistakes must contain at least one item")
        raw_mistakes = []
    mistakes = [_text(item) for item in raw_mistakes]
    if any(not item for item in mistakes):
        errors.append("solutionDetail.commonMistakes must contain non-empty strings")

    visual_requirement = _text(detail.get("diagramRequirement")).upper()
    if visual_requirement not in SOLUTION_VISUAL_REQUIREMENTS:
        visual_requirement = inferred_visual_requirement
    if inferred_visual_requirement == "MANDATORY":
        visual_requirement = "MANDATORY"
    if visual_requirement == "MANDATORY" and not _text(detail.get("diagramPurpose")):
        errors.append("solutionDetail.diagramPurpose is required for a mandatory solution diagram")

    if errors:
        raise SolutionQualityError("; ".join(errors))
    detail.update(
        {
            "version": SOLUTION_CONTRACT_VERSION,
            "audience": "student",
            "depth": "detailed",
            "given": _text(detail.get("given")),
            "goal": _text(detail.get("goal")),
            "keyIdea": _text(detail.get("keyIdea")),
            "conceptNote": concept_note,
            "steps": steps,
            "check": _text(detail.get("check")),
            "commonMistakes": mistakes,
            "diagramRequirement": visual_requirement,
        }
    )
    return detail


def format_solution_detail(detail: Mapping[str, Any], answer_line: str) -> str:
    """Turn the structured contract into the Archive's single solution field."""

    sections = [
        f"[조건] {detail['given']}",
        f"[구할 것] {detail['goal']}",
        f"[풀이 아이디어] {detail['keyIdea']}",
    ]
    if detail.get("conceptNote"):
        sections.append(f"[개념 확인] {detail['conceptNote']}")
    step_lines = ["[풀이 과정]"]
    for index, step in enumerate(detail["steps"], 1):
        step_lines.append(f"{index}. {step['title']}")
        step_lines.append(f"   {step['work']}")
        step_lines.append(f"   이유: {step['why']}")
    sections.append("\n".join(step_lines))
    sections.append(f"[검산] {detail['check']}")
    sections.append("[자주 하는 실수]\n" + "\n".join(f"- {item}" for item in detail["commonMistakes"]))
    sections.append(answer_line)
    return "\n\n".join(sections).strip()


def build_solution_quality_report(
    detail: Mapping[str, Any],
    *,
    inferred_visual_requirement: str,
    has_solution_visual: bool,
) -> dict[str, Any]:
    requirement = str(detail.get("diagramRequirement") or inferred_visual_requirement)
    if requirement == "MANDATORY" and not has_solution_visual:
        visual_verdict = "FAIL"
    elif requirement == "RECOMMENDED" and not has_solution_visual:
        visual_verdict = "RECOMMENDED_NOT_ATTACHED"
    else:
        visual_verdict = "PASS" if has_solution_visual else "NOT_REQUIRED"
    return {
        "contractVersion": SOLUTION_CONTRACT_VERSION,
        "verdict": "PASS" if visual_verdict != "FAIL" else "FAIL",
        "audience": detail.get("audience"),
        "depth": detail.get("depth"),
        "stepCount": len(detail.get("steps", [])),
        "sectionCoverage": {
            "given": bool(detail.get("given")),
            "goal": bool(detail.get("goal")),
            "keyIdea": bool(detail.get("keyIdea")),
            "conceptNote": bool(detail.get("conceptNote")),
            "stepsWithReasons": all(
                bool(item.get("work")) and bool(item.get("why"))
                for item in detail.get("steps", [])
            ),
            "check": bool(detail.get("check")),
            "commonMistakes": bool(detail.get("commonMistakes")),
        },
        "visualRequirement": requirement,
        "solutionVisualVerdict": visual_verdict,
    }


__all__ = [
    "SOLUTION_CONTRACT_VERSION",
    "SOLUTION_VISUAL_REQUIREMENTS",
    "SolutionQualityError",
    "infer_solution_visual_requirement",
    "infer_solution_visual_elements",
    "normalize_solution_detail",
    "format_solution_detail",
    "validate_solution_visual_spec",
    "build_solution_quality_report",
]
