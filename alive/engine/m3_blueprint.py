# -*- coding: utf-8 -*-
"""M3 Similar Question Blueprint Specification & Preflight Validation.

Before generating any question text, choices, or SVGs, every similar question
must have a validated Blueprint that locks mathematical invariants, fixed/variant
conditions, geometric topology, and stem requirements.
"""

from __future__ import annotations
import json
from dataclasses import dataclass, field, asdict
from typing import Any, Optional


class BlueprintValidationError(ValueError):
    """Raised when a blueprint violates structural or mathematical requirements."""
    pass


@dataclass
class GeometryModelBlueprint:
    type: str  # e.g., 'right_triangle', 'circle_tangent_external', 'regular_polygon_inscribed', 'concentric_circles'
    base_points: list[str] = field(default_factory=list)
    segments: list[tuple[str, str]] = field(default_factory=list)
    circles: list[dict[str, Any]] = field(default_factory=list)
    tangents: list[dict[str, Any]] = field(default_factory=list)
    right_angles: list[tuple[str, str, str]] = field(default_factory=list)  # (A, vertex, B)
    collinear_points: list[list[str]] = field(default_factory=list)  # list of points that must lie on the same line
    auxiliary_elements_for_solution: list[dict[str, Any]] = field(default_factory=list)


@dataclass
class QuestionBlueprint:
    id: int
    standardCourse: str
    standardUnitKey: str
    subUnitKey: str
    difficultyBucket: int
    corePrinciple: str
    reasoningSteps: list[str]
    invariants: list[str]
    fixedConditions: dict[str, Any]
    variantConditions: dict[str, Any]
    geometryModel: Optional[GeometryModelBlueprint] = None
    stemRequirements: list[str] = field(default_factory=list)
    choicesRequirements: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def validate_blueprint(bp: dict[str, Any]) -> None:
    """Validate that the blueprint contains all mandatory invariant specifications."""
    required_fields = [
        "id", "standardCourse", "standardUnitKey", "subUnitKey",
        "difficultyBucket", "corePrinciple", "reasoningSteps",
        "invariants", "fixedConditions", "variantConditions"
    ]
    for rf in required_fields:
        if rf not in bp or bp[rf] is None:
            raise BlueprintValidationError(f"Missing mandatory blueprint field: {rf}")

    if not isinstance(bp["reasoningSteps"], list) or len(bp["reasoningSteps"]) == 0:
        raise BlueprintValidationError(f"Q{bp['id']}: reasoningSteps must be a non-empty list")

    if not isinstance(bp["invariants"], list) or len(bp["invariants"]) == 0:
        raise BlueprintValidationError(f"Q{bp['id']}: invariants must be a non-empty list")

    # If geometryModel is specified, validate topological consistency
    geo = bp.get("geometryModel")
    if geo:
        if not isinstance(geo, dict) or "type" not in geo:
            raise BlueprintValidationError(f"Q{bp['id']}: geometryModel must specify 'type'")
        
        # Invariant checks for specific geometry types
        geo_type = geo.get("type")
        if geo_type == "circle_tangent_external":
            if not geo.get("collinear_points"):
                raise BlueprintValidationError(f"Q{bp['id']}: circle_tangent_external must define collinear_points")
            if not geo.get("tangents"):
                raise BlueprintValidationError(f"Q{bp['id']}: circle_tangent_external must specify tangent relations")
        elif geo_type == "regular_polygon_inscribed":
            if "vertices" not in geo.get("fixedConditions", {}) and "sides" not in geo.get("fixedConditions", {}):
                pass
        elif geo_type == "concentric_circles":
            circles = geo.get("circles", [])
            if len(circles) < 2:
                raise BlueprintValidationError(f"Q{bp['id']}: concentric_circles must define at least 2 circles")

    # If stem has proof box requirements, check stemRequirements
    if "proof_box" in bp.get("fixedConditions", {}):
        if not any("proof_box" in req for req in bp.get("stemRequirements", [])):
            raise BlueprintValidationError(f"Q{bp['id']}: proof_box condition requires explicit stemRequirement")
