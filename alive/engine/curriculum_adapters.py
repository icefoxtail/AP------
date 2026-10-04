"""Canonical curriculum adapters for the H22-C/H22-C2 high-1 slice.

The adapter registry is deliberately narrower than the universal variant
registry.  It proves that a source unit can be resolved to the canonical
matrix and to the existing deterministic high-1 solver/solution/visual lane;
it does not silently make every A/B/C transform supported.
"""

from __future__ import annotations

import copy
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .high1_matrix import EXPECTED_UNIT_KEYS, load_high1_matrix
from .high1_units import independently_review_high1_fixture, solve_high1_fixture
from .run_store import sha256_file
from .structure_families import StructureFamilyRegistry
from .visual_renderer import render_visual_spec


HIGH1_ADAPTER_SCHEMA_VERSION = "0.1.0"

_UNIT_FAMILY = {
    "H22-C-01": "DIRECT_CALCULATION",
    "H22-C-02": "DIRECT_CALCULATION",
    "H22-C-03": "DIRECT_CALCULATION",
    "H22-C-04": "QUADRATIC_EQUATION",
    "H22-C-05": "FUNCTION_PARAMETER",
    "H22-C-06": "INEQUALITY_SOLVE",
    "H22-C-07": "COUNTING_BASIC",
    "H22-C-08": "COUNTING_BASIC",
    "H22-C-09": "DIRECT_CALCULATION",
    "H22-C2-01": "COORDINATE_BASIC",
    "H22-C2-02": "COORDINATE_GEOMETRY",
    "H22-C2-03": "COORDINATE_GEOMETRY",
    "H22-C2-04": "COORDINATE_GEOMETRY",
    "H22-C2-05": "COORDINATE_GEOMETRY",
    "H22-C2-06": "COORDINATE_GEOMETRY",
    "H22-C2-07": "FUNCTION_PARAMETER",
    "H22-C2-08": "FUNCTION_PARAMETER",
    "H22-C2-09": "FUNCTION_PARAMETER",
}


class CurriculumAdapterError(ValueError):
    pass


@dataclass(frozen=True)
class CurriculumAdapter:
    course_key: str
    unit_key: str
    label: str
    order: int
    family_id: str
    visual_policy: str
    coverage: tuple[str, ...]
    promotion_state: str
    canonical_master_path: str
    matrix_sha256: str

    def solve_fixture(self, fixture: dict[str, Any]) -> dict[str, Any]:
        if not isinstance(fixture, dict) or fixture.get("unitKey") != self.unit_key:
            raise CurriculumAdapterError(f"fixture does not belong to {self.unit_key}")
        result = solve_high1_fixture(copy.deepcopy(fixture))
        if not isinstance(result.get("solutionDetail"), dict):
            raise CurriculumAdapterError(f"{self.unit_key} solver did not produce solutionDetail")
        for field in ("visualSpec", "solutionVisualSpec"):
            visual = result.get(field)
            if visual is not None:
                if not isinstance(visual, dict):
                    raise CurriculumAdapterError(f"{self.unit_key} {field} is invalid")
                render_visual_spec(copy.deepcopy(visual))
        return result

    def independently_review(self, fixture: dict[str, Any], result: dict[str, Any]) -> dict[str, Any]:
        return independently_review_high1_fixture(copy.deepcopy(fixture), copy.deepcopy(result))


class CurriculumAdapterRegistry:
    def __init__(self, adapters: dict[str, CurriculumAdapter], *, matrix_path: str, matrix_sha256: str) -> None:
        self._adapters = dict(adapters)
        self.matrix_path = matrix_path
        self.matrix_sha256 = matrix_sha256
        if set(self._adapters) != set(EXPECTED_UNIT_KEYS):
            raise CurriculumAdapterError("curriculum adapter registry must cover all 18 canonical high-1 units")

    def require(self, unit_key: str) -> CurriculumAdapter:
        try:
            return self._adapters[unit_key]
        except KeyError as error:
            raise CurriculumAdapterError(f"canonical curriculum adapter is missing: {unit_key}") from error

    def list(self) -> list[CurriculumAdapter]:
        return sorted(self._adapters.values(), key=lambda item: (item.course_key, item.order))

    def solve_fixture(self, fixture: dict[str, Any]) -> dict[str, Any]:
        unit_key = fixture.get("unitKey") if isinstance(fixture, dict) else None
        return self.require(str(unit_key)).solve_fixture(fixture)

    def independently_review(self, fixture: dict[str, Any], result: dict[str, Any]) -> dict[str, Any]:
        unit_key = fixture.get("unitKey") if isinstance(fixture, dict) else None
        return self.require(str(unit_key)).independently_review(fixture, result)

    def capability_report(
        self,
        structure_registry: StructureFamilyRegistry,
        transforms: tuple[str, ...] = ("numeric", "representation", "PARAMETER_RECOVERY"),
    ) -> dict[str, Any]:
        rows = []
        for adapter in self.list():
            for transform in transforms:
                capability = structure_registry.capability(adapter.family_id, transform)
                rows.append(
                    {
                        "courseKey": adapter.course_key,
                        "unitKey": adapter.unit_key,
                        "familyId": adapter.family_id,
                        "transform": transform,
                        "capability": capability,
                        "promotionState": adapter.promotion_state,
                        "visualPolicy": adapter.visual_policy,
                    }
                )
        return {
            "artifactType": "ALIVE_CURRICULUM_ADAPTER_CAPABILITY_REPORT",
            "schemaVersion": HIGH1_ADAPTER_SCHEMA_VERSION,
            "matrixPath": self.matrix_path,
            "matrixSha256": self.matrix_sha256,
            "canonicalUnitCount": len(self._adapters),
            "rows": rows,
            "productionArchiveRegistration": "NOT_PERFORMED",
        }


def load_high1_curriculum_adapters(root: Path) -> CurriculumAdapterRegistry:
    root = root.resolve()
    matrix = load_high1_matrix(root)
    matrix_path = root / "alive/05_DESIGN/ALIVE_HIGH1_OFFICIAL_PROMOTION_MATRIX_v0.1.json"
    matrix_sha256 = sha256_file(matrix_path)
    adapters: dict[str, CurriculumAdapter] = {}
    for unit in matrix["units"]:
        unit_key = str(unit["unitKey"])
        family_id = _UNIT_FAMILY.get(unit_key)
        if family_id is None:
            raise CurriculumAdapterError(f"no family mapping for canonical unit: {unit_key}")
        adapters[unit_key] = CurriculumAdapter(
            course_key=str(unit["courseKey"]),
            unit_key=unit_key,
            label=str(unit["label"]),
            order=int(unit["order"]),
            family_id=family_id,
            visual_policy=str(unit["visualPolicy"]),
            coverage=tuple(str(item) for item in unit["coverage"]),
            promotion_state=str(unit["promotionState"]),
            canonical_master_path=str(matrix["canonical"]["sourcePath"]),
            matrix_sha256=matrix_sha256,
        )
    return CurriculumAdapterRegistry(adapters, matrix_path=matrix_path.relative_to(root).as_posix(), matrix_sha256=matrix_sha256)


__all__ = [
    "CurriculumAdapter",
    "CurriculumAdapterError",
    "CurriculumAdapterRegistry",
    "HIGH1_ADAPTER_SCHEMA_VERSION",
    "load_high1_curriculum_adapters",
]
