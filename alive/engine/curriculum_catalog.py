"""Read the complete canonical curriculum-unit catalog.

The High-1 adapter predates the universal curriculum layer and intentionally
covers only H22-C/H22-C2.  This module provides the missing Phase-5 catalog
boundary: every unit registered in the canonical rule master is discoverable,
while units without a dedicated solver remain explicit ``HOLD`` records.
It never infers a family from a label and never turns a catalog row into a
generation capability by itself.
"""

from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any


CURRICULUM_CATALOG_SCHEMA_VERSION = "0.1.0"
CANONICAL_MASTER_RELATIVE_PATH = Path(
    "docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md"
)
_COURSE_HEADING_RE = re.compile(r"^###\s+(.+?)\s+\(([^)]+)\)\s*$")
_UNIT_ROW_RE = re.compile(
    r"^\|\s*([A-Za-z0-9]+(?:-[A-Za-z0-9]+)+)\s*\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|\s*$",
    re.MULTILINE,
)


class CurriculumCatalogError(ValueError):
    """Raised when the canonical curriculum master cannot be trusted."""


@dataclass(frozen=True)
class CanonicalCurriculumUnit:
    course_key: str
    course_label: str
    unit_key: str
    label: str
    order: int
    master_path: str
    master_sha256: str
    adapter_status: str = "HOLD"
    family_id: str | None = None

    @property
    def promotion_state(self) -> str:
        return "HOLD"

    def planner_view(self) -> dict[str, Any]:
        """Return a planner-safe view without inventing a structure family."""

        return {
            "courseKey": self.course_key,
            "courseLabel": self.course_label,
            "unitKey": self.unit_key,
            "label": self.label,
            "order": self.order,
            "adapterStatus": self.adapter_status,
            "promotionState": self.promotion_state,
            "familyId": self.family_id,
            "masterPath": self.master_path,
            "masterSha256": self.master_sha256,
        }


class CurriculumCatalogRegistry:
    """Canonical unit lookup independent from solver capability."""

    def __init__(
        self,
        units: list[CanonicalCurriculumUnit],
        *,
        master_path: str,
        master_sha256: str,
    ) -> None:
        if not units:
            raise CurriculumCatalogError("canonical curriculum catalog is empty")
        by_key = {unit.unit_key: unit for unit in units}
        if len(by_key) != len(units):
            raise CurriculumCatalogError("canonical curriculum catalog has duplicate unit keys")
        self._units = by_key
        self.master_path = master_path
        self.master_sha256 = master_sha256

    def require(self, unit_key: str) -> CanonicalCurriculumUnit:
        try:
            return self._units[unit_key]
        except KeyError as error:
            raise CurriculumCatalogError(
                f"canonical curriculum unit is missing: {unit_key}"
            ) from error

    def get(self, unit_key: str) -> CanonicalCurriculumUnit | None:
        return self._units.get(unit_key)

    def list(self) -> list[CanonicalCurriculumUnit]:
        return sorted(self._units.values(), key=lambda item: (item.course_key, item.order, item.unit_key))

    def capability_report(self) -> dict[str, Any]:
        rows = []
        for unit in self.list():
            rows.append(
                {
                    **unit.planner_view(),
                    "capabilityStatus": "HOLD",
                    "code": "CURRICULUM_ADAPTER_NOT_REGISTERED",
                    "generationAllowed": False,
                }
            )
        return {
            "artifactType": "ALIVE_CANONICAL_CURRICULUM_CATALOG",
            "schemaVersion": CURRICULUM_CATALOG_SCHEMA_VERSION,
            "masterPath": self.master_path,
            "masterSha256": self.master_sha256,
            "courseCount": len({unit.course_key for unit in self._units.values()}),
            "unitCount": len(self._units),
            "supportedUnitCount": 0,
            "holdUnitCount": len(self._units),
            "rows": rows,
            "fallbackPolicy": "NO_LABEL_OR_MIXED_FAMILY_FALLBACK",
            "productionArchiveRegistration": "NOT_PERFORMED",
            "publicationStatus": "NOT_PUBLISHED",
        }


def _section_bounds(text: str, heading: re.Match[str]) -> str:
    start = heading.end()
    next_heading = re.search(r"^###\s+", text[start:], re.MULTILINE)
    end = start + next_heading.start() if next_heading else len(text)
    return text[start:end]


def load_curriculum_catalog(root: Path) -> CurriculumCatalogRegistry:
    root = Path(root).resolve()
    path = root / CANONICAL_MASTER_RELATIVE_PATH
    try:
        source = path.read_bytes()
        text = source.decode("utf-8")
    except (OSError, UnicodeError) as error:
        raise CurriculumCatalogError(f"canonical curriculum master cannot be read: {path}") from error

    master_sha256 = hashlib.sha256(source).hexdigest()
    units: list[CanonicalCurriculumUnit] = []
    seen_courses: set[str] = set()
    for heading in re.finditer(r"^###\s+.+?\s+\([^)]+\)\s*$", text, re.MULTILINE):
        parsed = _COURSE_HEADING_RE.match(heading.group(0))
        if parsed is None:
            continue
        course_label, course_key = parsed.groups()
        # The document also contains headings such as archive-policy sections;
        # only parenthesized canonical course keys with a numeric unit table
        # are catalog sections.
        section = _section_bounds(text, heading)
        matches = list(_UNIT_ROW_RE.finditer(section))
        if not matches:
            continue
        if course_key in seen_courses:
            raise CurriculumCatalogError(f"duplicate canonical course key: {course_key}")
        seen_courses.add(course_key)
        orders: list[int] = []
        for match in matches:
            unit_key, label, order_text = match.groups()
            order = int(order_text)
            if order < 1:
                raise CurriculumCatalogError(f"invalid order for canonical unit: {unit_key}")
            orders.append(order)
            units.append(
                CanonicalCurriculumUnit(
                    course_key=course_key,
                    course_label=course_label.strip(),
                    unit_key=unit_key,
                    label=label.strip(),
                    order=order,
                    master_path=CANONICAL_MASTER_RELATIVE_PATH.as_posix(),
                    master_sha256=master_sha256,
                )
            )
        if len(orders) != len(set(orders)):
            raise CurriculumCatalogError(f"duplicate order in canonical course: {course_key}")

    if not units:
        raise CurriculumCatalogError("no canonical unit tables were found")
    return CurriculumCatalogRegistry(
        units,
        master_path=CANONICAL_MASTER_RELATIVE_PATH.as_posix(),
        master_sha256=master_sha256,
    )


__all__ = [
    "CANONICAL_MASTER_RELATIVE_PATH",
    "CURRICULUM_CATALOG_SCHEMA_VERSION",
    "CanonicalCurriculumUnit",
    "CurriculumCatalogError",
    "CurriculumCatalogRegistry",
    "load_curriculum_catalog",
]
