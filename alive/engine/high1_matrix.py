from __future__ import annotations

"""Load and validate the high-school-1 promotion matrix.

The aggregate status is kept separate from unit status: every completed unit
is ``ACTIVE_UNIT`` and only the verified 18-unit aggregate may become
``ACTIVE_PRODUCTION``.  This matrix still does not publish generated exams to
the production Archive.
"""

import json
import re
from pathlib import Path
from typing import Any


MATRIX_RELATIVE_PATH = Path("alive/05_DESIGN/ALIVE_HIGH1_OFFICIAL_PROMOTION_MATRIX_v0.1.json")
CANONICAL_MASTER_RELATIVE_PATH = Path("docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md")
EXPECTED_COURSES = ("H22-C", "H22-C2")
EXPECTED_UNIT_KEYS = tuple(
    [f"H22-C-{index:02d}" for index in range(1, 10)]
    + [f"H22-C2-{index:02d}" for index in range(1, 10)]
)
ALLOWED_STATES = {
    "NOT_AUDITED",
    "PARTIAL",
    "EXPERIMENTAL",
    "CANDIDATE",
    "ACTIVE_UNIT",
    "ACTIVE_PRODUCTION",
    "HOLD",
}
ALLOWED_MATRIX_STATUSES = {"DESIGN_ONLY", "ACTIVE_PRODUCTION"}


class High1MatrixError(ValueError):
    pass


def _require_string(value: Any, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise High1MatrixError(f"{field} must be a non-empty string")
    return value


def _canonical_units(root: Path) -> dict[str, dict[str, Any]]:
    source = root / CANONICAL_MASTER_RELATIVE_PATH
    try:
        text = source.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        raise High1MatrixError(f"canonical high1 master cannot be read: {source}") from error

    rows: dict[str, dict[str, Any]] = {}
    for course in EXPECTED_COURSES:
        if course == "H22-C":
            heading = "### 공통수학1 (H22-C)"
        else:
            heading = "### 공통수학2 (H22-C2)"
        start = text.find(heading)
        if start < 0:
            raise High1MatrixError(f"canonical heading is missing: {heading}")
        next_heading = text.find("\n### ", start + len(heading))
        section = text[start:] if next_heading < 0 else text[start:next_heading]
        pattern = re.compile(rf"^\|\s*({re.escape(course)}-\d{{2}})\s*\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|\s*$", re.MULTILINE)
        matches = list(pattern.finditer(section))
        if len(matches) != 9:
            raise High1MatrixError(f"canonical {course} unit table must contain 9 rows")
        for match in matches:
            key, label, order = match.groups()
            if key in rows:
                raise High1MatrixError(f"duplicate canonical high1 unit key: {key}")
            rows[key] = {"courseKey": course, "unitKey": key, "label": label.strip(), "order": int(order)}
    if set(rows) != set(EXPECTED_UNIT_KEYS):
        raise High1MatrixError("canonical high1 unit key set is incomplete")
    return rows


def _validate_matrix(matrix: dict[str, Any], root: Path | None = None) -> dict[str, Any]:
    if matrix.get("schemaVersion") != "0.1.0":
        raise High1MatrixError("unsupported high1 matrix schemaVersion")
    if matrix.get("artifactType") != "ALIVE_HIGH1_OFFICIAL_PROMOTION_MATRIX":
        raise High1MatrixError("invalid high1 matrix artifactType")
    if matrix.get("status") not in ALLOWED_MATRIX_STATUSES:
        raise High1MatrixError("high1 matrix status is invalid")

    canonical = matrix.get("canonical")
    if not isinstance(canonical, dict) or canonical.get("unitTableIsAuthority") is not True:
        raise High1MatrixError("canonical unit-table authority is missing")
    _require_string(canonical.get("sourcePath"), "canonical.sourcePath")
    if canonical.get("courseKeys") != list(EXPECTED_COURSES):
        raise High1MatrixError("canonical course keys do not match the high1 scope")

    states = matrix.get("promotionStates")
    if not isinstance(states, list) or set(states) != ALLOWED_STATES:
        raise High1MatrixError("promotion state vocabulary is invalid")

    units = matrix.get("units")
    if not isinstance(units, list) or len(units) != len(EXPECTED_UNIT_KEYS):
        raise High1MatrixError("high1 matrix must declare exactly 18 units")
    seen: set[str] = set()
    by_course: dict[str, list[int]] = {course: [] for course in EXPECTED_COURSES}
    for unit in units:
        if not isinstance(unit, dict):
            raise High1MatrixError("each high1 unit must be an object")
        key = _require_string(unit.get("unitKey"), "unit.unitKey")
        course = _require_string(unit.get("courseKey"), "unit.courseKey")
        _require_string(unit.get("label"), f"{key}.label")
        if key not in EXPECTED_UNIT_KEYS or key in seen:
            raise High1MatrixError(f"unexpected or duplicate high1 unit key: {key}")
        if course not in EXPECTED_COURSES:
            raise High1MatrixError(f"unexpected high1 course key: {course}")
        order = unit.get("order")
        if not isinstance(order, int) or order < 1 or order > 9:
            raise High1MatrixError(f"invalid order for {key}")
        state = unit.get("promotionState")
        if state not in ALLOWED_STATES:
            raise High1MatrixError(f"invalid promotion state for {key}")
        coverage = unit.get("coverage")
        if not isinstance(coverage, list) or not coverage or not all(isinstance(item, str) and item.strip() for item in coverage):
            raise High1MatrixError(f"coverage is missing for {key}")
        seen.add(key)
        by_course[course].append(order)
    if tuple(sorted(seen)) != tuple(sorted(EXPECTED_UNIT_KEYS)):
        raise High1MatrixError("high1 matrix unit key set is incomplete")
    if matrix.get("status") == "ACTIVE_PRODUCTION" and any(
        unit.get("promotionState") != "ACTIVE_UNIT" for unit in units
    ):
        raise High1MatrixError(
            "ACTIVE_PRODUCTION requires every canonical unit to be ACTIVE_UNIT"
        )
    if root is not None:
        canonical_units = _canonical_units(root)
        for unit in units:
            key = unit["unitKey"]
            expected = canonical_units[key]
            for field in ("courseKey", "label", "order"):
                if unit[field] != expected[field]:
                    raise High1MatrixError(
                        f"{key} does not match canonical {field}: {unit[field]!r} != {expected[field]!r}"
                    )
    for course, orders in by_course.items():
        if sorted(orders) != list(range(1, 10)):
            raise High1MatrixError(f"{course} must contain orders 1 through 9 exactly once")

    vertical = matrix.get("firstVerticalSlice")
    if not isinstance(vertical, dict):
        raise High1MatrixError("firstVerticalSlice is missing")
    expected_geometry = [f"H22-C2-{index:02d}" for index in range(1, 5)]
    if vertical.get("unitKeys") != expected_geometry or vertical.get("implementationOrder") != expected_geometry:
        raise High1MatrixError("first vertical slice must be the four H22-C2 geometry units in order")
    return matrix


def load_high1_matrix(root: Path) -> dict[str, Any]:
    path = root / MATRIX_RELATIVE_PATH
    try:
        matrix = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise High1MatrixError(f"high1 matrix is missing: {path}") from error
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise High1MatrixError(f"high1 matrix cannot be read: {path}") from error
    if not isinstance(matrix, dict):
        raise High1MatrixError("high1 matrix root must be an object")
    return _validate_matrix(matrix, root)


def summarize_high1_matrix(matrix: dict[str, Any]) -> dict[str, Any]:
    units = matrix["units"]
    counts: dict[str, int] = {state: 0 for state in ALLOWED_STATES}
    for unit in units:
        counts[unit["promotionState"]] += 1
    active_unit_count = counts["ACTIVE_UNIT"]
    active_production_unit_count = counts["ACTIVE_PRODUCTION"]
    official_ready = (
        matrix["status"] == "ACTIVE_PRODUCTION"
        and active_unit_count == len(units)
    )
    return {
        "status": matrix["status"],
        "unitCount": len(units),
        "courseCounts": {
            course: sum(1 for unit in units if unit["courseKey"] == course)
            for course in EXPECTED_COURSES
        },
        "promotionStateCounts": counts,
        "activeUnitCount": active_unit_count,
        "activeProductionUnitCount": active_production_unit_count,
        "officialHigh1Ready": official_ready,
        "firstVerticalSlice": matrix["firstVerticalSlice"],
        "productionFeedsEnabled": False,
    }
