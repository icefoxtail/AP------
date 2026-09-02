"""Structure-family and curriculum-adapter contracts.

The registry is deliberately conservative: declaring a family does not make
it generatable.  A transform is ACTIVE only after an adapter, solver,
fixtures, and review evidence are registered for that exact
``family x transform`` capability.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable, Mapping

from .solution_graph import normalize_solution_graph


FAMILY_CANDIDATES = (
    "DIRECT_CALCULATION",
    "LINEAR_EQUATION",
    "SYSTEM_EQUATION",
    "QUADRATIC_EQUATION",
    "INEQUALITY_SOLVE",
    "FUNCTION_PARAMETER",
    "SEQUENCE_BASIC",
    "COUNTING_BASIC",
    "PROBABILITY_BASIC",
    "DISTRIBUTION",
    "COORDINATE_BASIC",
    "COORDINATE_GEOMETRY",
    "GEOMETRY_RELATION",
    "TRIG_RELATION",
    "LIMIT_CONTINUITY",
    "DERIVATIVE",
    "INTEGRAL",
    "VECTOR_RELATION",
    # Registered bounded adapters from the Phase-5 middle-school vertical
    # slices.  They remain HOLD in the default registry until their concrete
    # adapter is explicitly registered; listing them here only makes the
    # shared contract capable of validating those adapters.
    "LINEAR_FUNCTION_GRAPH",
    "TRIANGLE_PROPERTIES",
    "QUADRILATERAL_PROPERTIES",
    "SIMILAR_FIGURE",
    "PARALLEL_LENGTH_RATIO",
    "PYTHAGOREAN_THEOREM",
    "PYTHAGOREAN_APPLICATION",
    "PROBABILITY_BASIC",
    "PROBABILITY_COUNTING",
    "PRIME_FACTORIZATION",
    "RATIONAL_ARITHMETIC",
    "COORDINATE_PLANE_POINT",
    "BASIC_FIGURE_ANGLE_CLASSIFICATION",
    "POSITION_RELATION_LINE_PAIR",
    "POLYGON_INTERIOR_ANGLE_SUM",
    "CIRCLE_AREA_CIRCUMFERENCE",
    "RECTANGLE_AREA_PERIMETER",
    "CUBE_TOTAL_EDGE_LENGTH",
    "RECTANGULAR_PRISM_VOLUME",
    "DATA_FREQUENCY_TOTAL",
    "DATA_MEAN",
    "MIXED",
)

CAPABILITY_SUPPORTED = "SUPPORTED"
CAPABILITY_HOLD = "HOLD"
CAPABILITY_UNSUPPORTED = "UNSUPPORTED"


GraphCanonicalizer = Callable[[Any], dict[str, Any]]


@dataclass(frozen=True)
class StructureFamilyAdapter:
    """The minimum adapter surface required by the universal IR."""

    family_id: str
    operationRegistry: Mapping[str, str] = field(default_factory=dict)
    graphCanonicalizer: GraphCanonicalizer = normalize_solution_graph
    equivalenceClassRegistry: Mapping[str, tuple[str, ...]] = field(default_factory=dict)
    supported_ops: tuple[str, ...] = ()
    allowed_methods: tuple[str, ...] = ()
    forbidden_methods: tuple[str, ...] = ()
    parameter_domains: Mapping[str, Any] = field(default_factory=dict)
    constraint_rules: tuple[str, ...] = ()
    solver_profile: str = "pending"
    transform_capabilities: Mapping[str, str] = field(default_factory=dict)
    visual_capabilities: Mapping[str, str] = field(default_factory=dict)
    difficulty_rules: Mapping[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        if self.family_id not in FAMILY_CANDIDATES:
            raise ValueError(f"unknown structure family: {self.family_id}")
        if self.family_id == "MIXED" and any(
            status == CAPABILITY_SUPPORTED for status in self.transform_capabilities.values()
        ):
            raise ValueError("MIXED cannot register a supported transform without a dedicated family adapter")

    def normalize_solution_graph(self, graph: Any) -> dict[str, Any]:
        return self.graphCanonicalizer(graph, operation_registry=self.operationRegistry)

    def capability(self, transform: str) -> dict[str, Any]:
        status = self.transform_capabilities.get(transform, CAPABILITY_HOLD)
        if self.family_id == "MIXED":
            status = CAPABILITY_UNSUPPORTED
        return {
            "familyId": self.family_id,
            "transform": transform,
            "status": status,
            "familyTransform": f"{self.family_id}×{transform}",
            "solverProfile": self.solver_profile,
            "visualStatus": self.visual_capabilities.get(transform, "HOLD"),
        }


class StructureFamilyRegistry:
    """In-memory registry used by Phase 0 and later persisted by a Run."""

    def __init__(self, adapters: Mapping[str, StructureFamilyAdapter] | None = None) -> None:
        self._adapters: dict[str, StructureFamilyAdapter] = dict(adapters or {})
        unexpected = set(self._adapters) - set(FAMILY_CANDIDATES)
        if unexpected:
            raise ValueError(f"unexpected family ids: {sorted(unexpected)}")

    def register(self, adapter: StructureFamilyAdapter) -> None:
        self._adapters[adapter.family_id] = adapter

    def get(self, family_id: str) -> StructureFamilyAdapter | None:
        return self._adapters.get(family_id)

    def require(self, family_id: str) -> StructureFamilyAdapter:
        adapter = self.get(family_id)
        if adapter is None:
            raise KeyError(f"structure family is not registered: {family_id}")
        return adapter

    def capability(self, family_id: str, transform: str) -> dict[str, Any]:
        adapter = self.get(family_id)
        if adapter is None:
            return {
                "familyId": family_id,
                "transform": transform,
                "status": CAPABILITY_HOLD,
                "code": "FAMILY_ADAPTER_MISSING",
            }
        return adapter.capability(transform)

    def capability_report(self, transforms: list[str] | tuple[str, ...]) -> list[dict[str, Any]]:
        return [
            self.capability(family_id, transform)
            for family_id in FAMILY_CANDIDATES
            for transform in transforms
        ]


def default_structure_family_registry() -> StructureFamilyRegistry:
    """Return a conservative Phase 0 registry.

    All families are HOLD until a real adapter is registered.  MIXED is
    explicitly UNSUPPORTED and can never become a generic fallback.
    """

    adapters = {
        family_id: StructureFamilyAdapter(
            family_id=family_id,
            solver_profile="pending" if family_id != "MIXED" else "unsupported",
        )
        for family_id in FAMILY_CANDIDATES
    }
    return StructureFamilyRegistry(adapters)


__all__ = [
    "CAPABILITY_HOLD",
    "CAPABILITY_SUPPORTED",
    "CAPABILITY_UNSUPPORTED",
    "FAMILY_CANDIDATES",
    "StructureFamilyAdapter",
    "StructureFamilyRegistry",
    "default_structure_family_registry",
]
