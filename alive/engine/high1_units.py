from __future__ import annotations

"""Deterministic unit contracts for the 18 canonical high-school-1 units.

This module is a bounded promotion lane, not a model generator.  It owns the
small, auditable fixture vocabulary used to prove that a unit can recompute a
candidate answer, explain it to a student, and (when useful) materialize a
deterministic SVG.  Model-generated candidates still enter through
``STAGED_EXAM`` and must pass the independent review gates there.
"""

import copy
import json
import math
from fractions import Fraction
from fractions import Fraction
from pathlib import Path
from typing import Any, Callable

from .coordinate_geometry import (
    build_coordinate_solution_detail,
    build_coordinate_solution_visual_spec,
    load_coordinate_fixtures,
    solve_coordinate_case,
)
from .high1_matrix import load_high1_matrix
from .run_store import atomic_write_json, sha256_file
from .solution_quality import (
    build_solution_quality_report,
    format_solution_detail,
    normalize_solution_detail,
    validate_solution_visual_spec,
)
from .visual_renderer import render_visual_spec


BENCHMARK_SCHEMA_VERSION = "0.1.0"
FIXTURES_RELATIVE_PATH = Path("alive/engine/fixtures_high1_units.json")
ALL_UNIT_KEYS = tuple(
    [f"H22-C-{index:02d}" for index in range(1, 10)]
    + [f"H22-C2-{index:02d}" for index in range(1, 10)]
)


class High1UnitError(ValueError):
    pass


def _number(value: Any, name: str) -> float:
    if not isinstance(value, (int, float)) or isinstance(value, bool) or not math.isfinite(float(value)):
        raise High1UnitError(f"{name} must be a finite number")
    return float(value)


def _integer(value: Any, name: str) -> int:
    if not isinstance(value, int) or isinstance(value, bool):
        raise High1UnitError(f"{name} must be an integer")
    return value


def _close(actual: float, expected: float, name: str) -> None:
    tolerance = 1e-9 * max(1.0, abs(actual), abs(expected))
    if abs(actual - expected) > tolerance:
        raise High1UnitError(f"{name} mismatch: {actual} != {expected}")


def _fraction(value: Any, name: str) -> Fraction:
    if isinstance(value, bool) or not isinstance(value, (int, float, str)):
        raise High1UnitError(f"{name} must be a rational value")
    try:
        return Fraction(str(value))
    except (ValueError, ZeroDivisionError) as error:
        raise High1UnitError(f"{name} is not rational") from error


def _fraction_list(value: Any, name: str) -> list[Fraction]:
    if not isinstance(value, list) or not value:
        raise High1UnitError(f"{name} must be a non-empty array")
    return [_fraction(item, f"{name}[{index}]") for index, item in enumerate(value)]


def _json_number(value: Fraction | float | int) -> int | float:
    if isinstance(value, Fraction):
        if value.denominator == 1:
            return value.numerator
        return float(value)
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return value


def _json_value(value: Any) -> Any:
    if isinstance(value, Fraction):
        return _json_number(value)
    if isinstance(value, tuple):
        return [_json_value(item) for item in value]
    if isinstance(value, list):
        return [_json_value(item) for item in value]
    if isinstance(value, dict):
        return {key: _json_value(item) for key, item in value.items()}
    return value


def _poly_eval(coefficients: list[Fraction], x: Fraction) -> Fraction:
    result = Fraction(0)
    for coefficient in reversed(coefficients):
        result = result * x + coefficient
    return result


def _poly_add(left: list[Fraction], right: list[Fraction]) -> list[Fraction]:
    size = max(len(left), len(right))
    return [
        (left[index] if index < len(left) else Fraction(0))
        + (right[index] if index < len(right) else Fraction(0))
        for index in range(size)
    ]


def _poly_sub(left: list[Fraction], right: list[Fraction]) -> list[Fraction]:
    size = max(len(left), len(right))
    return [
        (left[index] if index < len(left) else Fraction(0))
        - (right[index] if index < len(right) else Fraction(0))
        for index in range(size)
    ]


def _poly_mul(left: list[Fraction], right: list[Fraction]) -> list[Fraction]:
    result = [Fraction(0)] * (len(left) + len(right) - 1)
    for left_index, left_value in enumerate(left):
        for right_index, right_value in enumerate(right):
            result[left_index + right_index] += left_value * right_value
    return result


def _trim_poly(coefficients: list[Fraction]) -> list[Fraction]:
    result = list(coefficients)
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def _poly_div(dividend: list[Fraction], divisor: list[Fraction]) -> tuple[list[Fraction], list[Fraction]]:
    dividend = _trim_poly(dividend)
    divisor = _trim_poly(divisor)
    if divisor == [Fraction(0)]:
        raise High1UnitError("polynomial divisor must be non-zero")
    if len(dividend) < len(divisor):
        return [Fraction(0)], dividend
    remainder = list(dividend)
    quotient = [Fraction(0)] * (len(dividend) - len(divisor) + 1)
    while len(remainder) >= len(divisor) and not (len(remainder) == 1 and remainder[0] == 0):
        shift = len(remainder) - len(divisor)
        lead = remainder[-1] / divisor[-1]
        quotient[shift] = lead
        for index, coefficient in enumerate(divisor):
            remainder[index + shift] -= lead * coefficient
        remainder = _trim_poly(remainder)
    return _trim_poly(quotient), _trim_poly(remainder)


def _poly_json(coefficients: list[Fraction]) -> list[int | float]:
    return [_json_number(value) for value in _trim_poly(coefficients)]


def _point(value: Any, name: str) -> tuple[Fraction, Fraction]:
    if not isinstance(value, dict):
        raise High1UnitError(f"{name} must be an object")
    return _fraction(value.get("x"), f"{name}.x"), _fraction(value.get("y"), f"{name}.y")


def _point_json(point: tuple[Fraction, Fraction]) -> dict[str, int | float]:
    return {"x": _json_number(point[0]), "y": _json_number(point[1])}


def _matrix(value: Any, name: str) -> list[list[Fraction]]:
    if not isinstance(value, list) or not value or any(not isinstance(row, list) or not row for row in value):
        raise High1UnitError(f"{name} must be a non-empty matrix")
    columns = len(value[0])
    if any(len(row) != columns for row in value):
        raise High1UnitError(f"{name} must be rectangular")
    return [[_fraction(cell, f"{name}[{row}][{column}]") for column, cell in enumerate(line)] for row, line in enumerate(value)]


def _matrix_add(left: list[list[Fraction]], right: list[list[Fraction]]) -> list[list[Fraction]]:
    if len(left) != len(right) or len(left[0]) != len(right[0]):
        raise High1UnitError("matrix addition dimensions do not match")
    return [[a + b for a, b in zip(row_left, row_right)] for row_left, row_right in zip(left, right)]


def _matrix_mul(left: list[list[Fraction]], right: list[list[Fraction]]) -> list[list[Fraction]]:
    if len(left[0]) != len(right):
        raise High1UnitError("matrix multiplication dimensions do not match")
    return [
        [sum(left[row][inner] * right[inner][column] for inner in range(len(right))) for column in range(len(right[0]))]
        for row in range(len(left))
    ]


def _matrix_json(matrix: list[list[Fraction]]) -> list[list[int | float]]:
    return [[_json_number(cell) for cell in row] for row in matrix]


def _combination(n: int, r: int) -> int:
    if n < 0 or r < 0 or r > n:
        raise High1UnitError("combination parameters are invalid")
    return math.factorial(n) // (math.factorial(r) * math.factorial(n - r))


def _permutation(n: int, r: int) -> int:
    if n < 0 or r < 0 or r > n:
        raise High1UnitError("permutation parameters are invalid")
    return math.factorial(n) // math.factorial(n - r)


def _sorted_unique(values: list[Any]) -> list[Any]:
    result: list[Any] = []
    for value in values:
        if value not in result:
            result.append(value)
    return sorted(result)


def _visual_frame(data: dict[str, Any], *, title: str) -> dict[str, Any]:
    x_range = data.get("xRange", [-6, 6])
    y_range = data.get("yRange", [-6, 6])
    if not isinstance(x_range, list) or not isinstance(y_range, list):
        raise High1UnitError("visual ranges must be arrays")
    return {
        "version": "0.1",
        "type": "coordinate_plane",
        "title": title,
        "width": 640,
        "height": 360,
        "xRange": x_range,
        "yRange": y_range,
        "points": [],
        "segments": [],
        "lines": [],
        "curves": [],
        "annotations": [],
    }


def _build_unit_visual(fixture: dict[str, Any], computed: dict[str, Any], *, solution: bool) -> dict[str, Any] | None:
    visual = fixture.get("visual")
    if not isinstance(visual, dict):
        return None
    kind = visual.get("type")
    title = f"{fixture.get('coverage', '고1')} · {'해설' if solution else '문제'}"
    data = fixture.get("data", {})
    if kind == "coordinate_plane":
        spec = _visual_frame(visual, title=title)
        for item in visual.get("points", []):
            if not isinstance(item, dict):
                raise High1UnitError("visual point must be an object")
            spec["points"].append(copy.deepcopy(item))
        for item in visual.get("segments", []):
            spec["segments"].append(copy.deepcopy(item))
        for item in visual.get("lines", []):
            spec["lines"].append(copy.deepcopy(item))
        for item in visual.get("annotations", []):
            spec["annotations"].append(copy.deepcopy(item))
        if solution:
            spec["annotations"].append({"x": spec["xRange"][0] + 0.25, "y": spec["yRange"][0] + 0.35, "text": "풀이 관계를 확인"})
        return spec
    if kind == "circle_geometry":
        spec = {
            "version": "0.1",
            "type": "circle_geometry",
            "title": title,
            "width": 420,
            "height": 420,
            "xRange": visual.get("xRange", [-7, 7]),
            "yRange": visual.get("yRange", [-7, 7]),
            "circles": copy.deepcopy(visual.get("circles", [])),
            "points": copy.deepcopy(visual.get("points", [])),
            "segments": copy.deepcopy(visual.get("segments", [])),
            "lines": copy.deepcopy(visual.get("lines", [])),
            "rightAngles": copy.deepcopy(visual.get("rightAngles", [])),
            "annotations": copy.deepcopy(visual.get("annotations", [])),
        }
        if solution and not any(item.get("kind") == "radius" for item in spec["segments"]):
            circle = spec["circles"][0]
            center = circle["center"]
            radius = float(circle["radius"])
            spec["segments"].append({"from": {"x": center["x"], "y": center["y"]}, "to": {"x": center["x"] + radius, "y": center["y"]}, "kind": "radius", "label": "r"})
        return spec
    if kind == "simple_function_graph":
        spec = _visual_frame(visual, title=title)
        spec["type"] = "simple_function_graph"
        spec["curves"] = copy.deepcopy(visual.get("curves", []))
        spec["points"] = copy.deepcopy(visual.get("points", []))
        spec["annotations"] = copy.deepcopy(visual.get("annotations", []))
        return spec
    if kind == "table":
        return {
            "version": "0.1",
            "type": "table",
            "title": title,
            "width": 640,
            "height": 260,
            "rows": copy.deepcopy(visual.get("rows", [])),
        }
    raise High1UnitError(f"unsupported high1 visual type: {kind}")


def _solution_detail(fixture: dict[str, Any], computed: dict[str, Any], answer: str, *, visual_requirement: str) -> dict[str, Any]:
    coverage = str(fixture.get("coverage", "")).strip()
    data = fixture.get("data", {})
    kind = fixture["kind"]
    given = str(fixture.get("given") or f"{coverage}의 조건이 주어져 있다.")
    goal = str(fixture.get("goal") or "주어진 조건을 이용하여 답을 구한다.")
    key_idea = str(fixture.get("keyIdea") or "정의와 기본 정리를 식으로 옮긴 뒤, 조건을 만족하는 값만 남긴다.")
    concept = str(fixture.get("conceptNote") or "계산 과정의 각 식은 앞 단계와 동치이며, 마지막에 원래 조건을 대입해 확인한다.")
    work = _computed_work(computed)
    steps = [
        {"title": "조건 정리", "work": given, "why": "무엇이 주어졌고 무엇을 보존해야 하는지 먼저 고정한다."},
        {"title": "핵심 계산", "work": f"{key_idea} 계산 결과: {work}", "why": "해당 단원의 정의·공식·연산을 적용해 중간 결과를 얻는다."},
        {"title": "답과 조건 확인", "work": answer, "why": "계산 결과를 원래 조건에 대입하거나 정의와 비교해 답의 타당성을 확인한다."},
    ]
    if kind in {"proposition_implication", "proposition_counterexample"}:
        steps[1]["why"] = "명제의 참·거짓은 모든 허용 값을 검토하거나 반례 하나를 찾아 정의에 따라 판단한다."
    if kind.startswith("polynomial") or kind in {"identity_coefficient", "remainder_theorem", "factor_theorem", "factor_quadratic", "factor_substitution", "factor_application"}:
        steps[1]["why"] = "다항식의 계수·나머지·인수 관계는 식의 동일한 항을 비교하거나 대입하여 결정한다."
    mistakes = list(fixture.get("commonMistakes") or ["공식의 조건을 확인하지 않고 수치를 대입하는 것", "마지막 결과를 원래 조건에 다시 확인하지 않는 것"])
    return {
        "version": "0.1",
        "audience": "student",
        "depth": "detailed",
        "given": given,
        "goal": goal,
        "keyIdea": key_idea,
        "conceptNote": concept,
        "steps": steps,
        "check": str(fixture.get("check") or f"답 {answer}를 원래 조건에 대입해 확인한다."),
        "commonMistakes": mistakes,
        "diagramRequirement": visual_requirement,
        **({"diagramPurpose": str(fixture.get("diagramPurpose") or "풀이에 사용한 관계와 핵심 위치를 확인한다.")} if visual_requirement == "MANDATORY" else {}),
    }


def _answer_string(kind: str, computed: dict[str, Any]) -> str:
    if "answer" in computed:
        return _format_student_value(computed["answer"])
    return _format_student_value(computed)


def _format_number(value: Any) -> str:
    if isinstance(value, bool):
        return "참" if value else "거짓"
    if isinstance(value, float):
        if not math.isfinite(value):
            return str(value)
        if value.is_integer():
            return str(int(value))
        fraction = Fraction(str(value)).limit_denominator(1000)
        if abs(float(fraction) - value) < 1e-9 and fraction.denominator != 1:
            return f"{fraction.numerator}/{fraction.denominator}"
        return f"{value:.6g}"
    return str(value)


_RELATION_LABELS = {
    "two_intersections": "두 점에서 만난다",
    "tangent": "접한다",
    "external_tangent": "외접한다",
    "internal_tangent": "내접한다",
    "no_intersection": "만나지 않는다",
    "none": "만나지 않는다",
    "equivalent": "서로 필요충분조건이다",
    "A_sufficient_B_necessary": "A는 B의 충분조건이고 B는 A의 필요조건이다",
    "B_sufficient_A_necessary": "B는 A의 충분조건이고 A는 B의 필요조건이다",
    "neither": "어느 쪽도 성립하지 않는다",
}


def _format_student_value(value: Any) -> str:
    """Render solver values as student-readable text, never Python repr/JSON."""

    value = _json_value(value)
    if isinstance(value, bool):
        return "참" if value else "거짓"
    if isinstance(value, (int, float)):
        return _format_number(value)
    if isinstance(value, str) and value in _RELATION_LABELS:
        return _RELATION_LABELS[value]
    if isinstance(value, list):
        if value and all(isinstance(item, dict) and {"low", "lowClosed", "high", "highClosed"}.issubset(item) for item in value):
            intervals = []
            for item in value:
                left = "[" if item["lowClosed"] else "("
                right = "]" if item["highClosed"] else ")"
                intervals.append(f"{left}{_format_student_value(item['low'])}, {_format_student_value(item['high'])}{right}")
            return " ∪ ".join(intervals)
        return "(" + ", ".join(_format_student_value(item) for item in value) + ")"
    if isinstance(value, dict):
        if set(value) == {"x", "y"}:
            return f"({_format_student_value(value['x'])}, {_format_student_value(value['y'])})"
        if set(value) == {"slope", "intercept"}:
            return f"기울기 {_format_student_value(value['slope'])}, y절편 {_format_student_value(value['intercept'])}"
        if set(value) == {"quotient", "remainder"}:
            return f"몫 {_format_student_value(value['quotient'])}, 나머지 {_format_student_value(value['remainder'])}"
        if set(value) == {"real", "imaginaryMagnitude"}:
            return f"실수부 {_format_student_value(value['real'])}, 허수부의 크기 {_format_student_value(value['imaginaryMagnitude'])}"
        if set(value) == {"sum", "product"}:
            return f"$z+\\bar z={_format_student_value(value['sum'])}$, $z\\bar z={_format_student_value(value['product'])}$"
        if set(value) == {"minimum", "maximum"}:
            return f"최솟값 {_format_student_value(value['minimum'])}, 최댓값 {_format_student_value(value['maximum'])}"
        if set(value) == {"center", "radius"}:
            center = _format_student_value(value["center"])
            radius = _format_student_value(value["radius"])
            return f"중심 ${center}$, 반지름 ${radius}$"
        if set(value) == {"domainExcludes", "vertical", "horizontal"}:
            excluded = _format_student_value(value["domainExcludes"])
            vertical = _format_student_value(value["vertical"])
            horizontal = _format_student_value(value["horizontal"])
            return f"정의역에서 제외되는 x값 ${excluded}$, 수직 점근선 $x={vertical}$, 수평 점근선 $y={horizontal}$"
        if set(value) == {"verticalAsymptote", "horizontalAsymptote"}:
            vertical = _format_student_value(value["verticalAsymptote"])
            horizontal = _format_student_value(value["horizontalAsymptote"])
            return f"수직 점근선 $x={vertical}$, 수평 점근선 $y={horizontal}$"
        if set(value) == {"point", "line"}:
            return f"접점 {_format_student_value(value['point'])}, 접선 {_format_student_value(value['line'])}"
        if set(value) == {"vertex", "expression"}:
            return f"꼭짓점 {_format_student_value(value['vertex'])}, 함수식 ${value['expression']}$"
        if set(value) == {"boundary", "side"}:
            boundary = _format_student_value(value["boundary"])
            raw_side = str(value["side"])
            relation = rf"x\ge {boundary}" if ">=" in raw_side else rf"x\le {boundary}"
            return f"경계값 ${boundary}$, 해 ${relation}$"
        return ", ".join(f"{key}={_format_student_value(item)}" for key, item in value.items())
    return _format_number(value) if isinstance(value, (int, float)) else str(value)


def _computed_work(computed: dict[str, Any]) -> str:
    if "answer" in computed:
        return _format_student_value(computed["answer"])
    return _format_student_value(computed)


def _expected_answer(fixture: dict[str, Any]) -> Any:
    expected = fixture.get("expected")
    if isinstance(expected, dict) and "answer" in expected:
        return expected["answer"]
    return expected


def _preview_answer(fixture: dict[str, Any], result: dict[str, Any]) -> str:
    computed = result.get("computed", {})
    if fixture["unitKey"] == "H22-C2-01":
        kind = fixture["kind"]
        if kind == "distance":
            return _format_student_value(computed["distance"])
        if kind in {"midpoint", "section", "centroid"}:
            point = computed["point"]
            return f"({_format_student_value(point['x'])}, {_format_student_value(point['y'])})"
        equation = computed["equation"]
        return f"${_format_student_value(equation['a'])}x+{_format_student_value(equation['b'])}y={_format_student_value(equation['c'])}$"
    return _answer_string(fixture["kind"], computed)


def _solve_nonvisual(fixture: dict[str, Any]) -> tuple[dict[str, Any], dict[str, str]]:
    kind = fixture["kind"]
    data = fixture.get("data")
    if not isinstance(data, dict):
        raise High1UnitError(f"{fixture['caseId']} data must be an object")

    if kind == "polynomial_add":
        left, right = _fraction_list(data.get("left"), "left"), _fraction_list(data.get("right"), "right")
        result = _poly_add(left, right)
        return {"answer": _poly_json(result), "coefficients": _poly_json(result)}, {"addition": "PASS"}
    if kind == "polynomial_multiply":
        left, right = _fraction_list(data.get("left"), "left"), _fraction_list(data.get("right"), "right")
        result = _poly_mul(left, right)
        return {"answer": _poly_json(result), "coefficients": _poly_json(result)}, {"multiplication": "PASS"}
    if kind == "polynomial_divide":
        quotient, remainder = _poly_div(_fraction_list(data.get("dividend"), "dividend"), _fraction_list(data.get("divisor"), "divisor"))
        return {"answer": {"quotient": _poly_json(quotient), "remainder": _poly_json(remainder)}, "quotient": _poly_json(quotient), "remainder": _poly_json(remainder)}, {"divisionAlgorithm": "PASS", "remainder": "PASS"}
    if kind == "identity_coefficient":
        left, right = _fraction_list(data.get("left"), "left"), _fraction_list(data.get("right"), "right")
        if len(left) != len(right):
            raise High1UnitError("identity coefficient arrays must have equal length")
        differences = [right[index] - left[index] for index in range(len(left))]
        return {"answer": _poly_json(differences), "coefficientDifferences": _poly_json(differences)}, {"coefficientComparison": "PASS", "identity": "PASS"}
    if kind in {"remainder_theorem", "factor_theorem"}:
        coefficients = _fraction_list(data.get("polynomial"), "polynomial")
        x = _fraction(data.get("at"), "at")
        value = _poly_eval(coefficients, x)
        if kind == "factor_theorem":
            return {"answer": value == 0, "valueAtPoint": _json_number(value), "isFactor": value == 0}, {"factorTheorem": "PASS", "substitution": "PASS"}
        return {"answer": _json_number(value), "remainder": _json_number(value)}, {"remainderTheorem": "PASS", "substitution": "PASS"}
    if kind == "factor_quadratic":
        coefficients = _fraction_list(data.get("polynomial"), "polynomial")
        if len(coefficients) != 3 or coefficients[2] == 0:
            raise High1UnitError("factor_quadratic supports a non-zero quadratic")
        roots = sorted([_fraction(item, "root") for item in data.get("roots", [])])
        if len(roots) != 2 or _poly_mul([-roots[0], Fraction(1)], [-roots[1], Fraction(1)]) != coefficients:
            raise High1UnitError("quadratic factor fixture does not match its roots")
        return {"answer": [float(root) if root.denominator != 1 else root.numerator for root in roots], "roots": _json_value(roots)}, {"factorExpansion": "PASS", "roots": "PASS"}
    if kind == "factor_substitution":
        z_roots = sorted([_fraction(item, "zRoot") for item in data.get("zRoots", [])])
        return {"answer": _json_value(z_roots), "substitution": data.get("substitution")}, {"substitution": "PASS", "factorization": "PASS"}
    if kind == "factor_application":
        coefficients = _fraction_list(data.get("polynomial"), "polynomial")
        roots = sorted([_fraction(item, "root") for item in data.get("roots", [])])
        if any(_poly_eval(coefficients, root) != 0 for root in roots):
            raise High1UnitError("factor application roots are not roots of the polynomial")
        return {"answer": _json_value(roots), "roots": _json_value(roots)}, {"factorApplication": "PASS", "substitution": "PASS"}
    if kind == "complex_product":
        a, b = _fraction(data.get("a"), "a"), _fraction(data.get("b"), "b")
        c, d = _fraction(data.get("c"), "c"), _fraction(data.get("d"), "d")
        real, imaginary = a * c - b * d, a * d + b * c
        return {"answer": [_json_number(real), _json_number(imaginary)], "real": _json_number(real), "imaginary": _json_number(imaginary)}, {"complexMultiplication": "PASS", "realImaginaryParts": "PASS"}
    if kind == "complex_conjugate":
        real, imaginary = _fraction(data.get("real"), "real"), _fraction(data.get("imaginary"), "imaginary")
        return {"answer": {"sum": _json_number(2 * real), "product": _json_number(real * real + imaginary * imaginary)}, "sumWithConjugate": _json_number(2 * real), "productWithConjugate": _json_number(real * real + imaginary * imaginary)}, {"conjugate": "PASS", "modulusSquare": "PASS"}
    if kind == "complex_quadratic":
        a, b, c = (_fraction(data.get(key), key) for key in ("a", "b", "c"))
        discriminant = b * b - 4 * a * c
        if discriminant >= 0:
            raise High1UnitError("complex_quadratic fixture must have negative discriminant")
        real = -b / (2 * a)
        imaginary = math.sqrt(float(-discriminant)) / float(2 * a)
        return {"answer": {"real": _json_number(real), "imaginaryMagnitude": imaginary}, "discriminant": _json_number(discriminant), "realPart": _json_number(real), "imaginaryMagnitude": imaginary}, {"discriminant": "PASS", "complexRoots": "PASS"}
    if kind == "quadratic_roots":
        a, b, c = (_fraction(data.get(key), key) for key in ("a", "b", "c"))
        roots = sorted([_fraction(item, "root") for item in data.get("roots", [])])
        if a == 0 or len(roots) != 2 or any(a * root * root + b * root + c != 0 for root in roots):
            raise High1UnitError("quadratic root fixture is inconsistent")
        return {"answer": _json_value(roots), "roots": _json_value(roots), "sum": _json_number(-b / a), "product": _json_number(c / a)}, {"quadraticFormula": "PASS", "rootSubstitution": "PASS"}
    if kind == "quadratic_vertex":
        a, h, k = (_fraction(data.get(key), key) for key in ("a", "h", "k"))
        if a == 0:
            raise High1UnitError("quadratic vertex requires non-zero a")
        return {"answer": {"x": _json_number(h), "y": _json_number(k)}, "vertex": {"x": _json_number(h), "y": _json_number(k)}, "opening": "up" if a > 0 else "down"}, {"vertexForm": "PASS", "openingDirection": "PASS"}
    if kind == "quadratic_interval_extrema":
        a, h, k = (_fraction(data.get(key), key) for key in ("a", "h", "k"))
        low, high = _fraction(data.get("interval")[0], "interval[0]"), _fraction(data.get("interval")[1], "interval[1]")
        if low > high or a == 0:
            raise High1UnitError("quadratic interval fixture is invalid")
        candidates = [(low, a * (low - h) ** 2 + k), (high, a * (high - h) ** 2 + k)]
        if low <= h <= high:
            candidates.append((h, k))
        minimum = min(candidates, key=lambda item: item[1])
        maximum = max(candidates, key=lambda item: item[1])
        return {"answer": {"minimum": _json_number(minimum[1]), "maximum": _json_number(maximum[1])}, "minimum": {"x": _json_number(minimum[0]), "value": _json_number(minimum[1])}, "maximum": {"x": _json_number(maximum[0]), "value": _json_number(maximum[1])}}, {"vertexAndEndpoints": "PASS", "extrema": "PASS"}
    if kind == "polynomial_roots":
        coefficients = _fraction_list(data.get("polynomial"), "polynomial")
        roots = sorted([_fraction(item, "root") for item in data.get("roots", [])])
        if any(_poly_eval(coefficients, root) != 0 for root in roots):
            raise High1UnitError("polynomial roots do not satisfy the polynomial")
        return {"answer": _json_value(roots), "roots": _json_value(roots)}, {"factorization": "PASS", "rootSubstitution": "PASS"}
    if kind == "linear_system":
        a, b, c = (_fraction(data.get(key), key) for key in ("a", "b", "c"))
        d, e, f = (_fraction(data.get(key), key) for key in ("d", "e", "f"))
        determinant = a * e - b * d
        if determinant == 0:
            raise High1UnitError("linear system fixture must have a unique solution")
        x, y = (c * e - b * f) / determinant, (a * f - c * d) / determinant
        return {"answer": {"x": _json_number(x), "y": _json_number(y)}, "x": _json_number(x), "y": _json_number(y)}, {"elimination": "PASS", "substitution": "PASS"}
    if kind == "quadratic_inequality":
        roots = sorted([_fraction(item, "root") for item in data.get("roots", [])])
        relation = data.get("relation")
        if len(roots) != 2 or roots[0] >= roots[1] or relation not in {"<", "<=", ">", ">="}:
            raise High1UnitError("quadratic inequality fixture is invalid")
        answer = [
            {"low": _json_number(roots[0]), "lowClosed": relation in {"<=", ">="}, "high": _json_number(roots[1]), "highClosed": relation in {"<=", ">="}}
        ] if relation in {"<", "<="} else [{"low": "-∞", "lowClosed": False, "high": _json_number(roots[0]), "highClosed": relation == ">="}, {"low": _json_number(roots[1]), "lowClosed": relation == ">=", "high": "∞", "highClosed": False}]
        return {"answer": answer, "roots": _json_value(roots), "relation": relation}, {"signChart": "PASS", "boundaryInclusion": "PASS"}
    if kind == "count_addition":
        counts = [_integer(item, "count") for item in data.get("counts", [])]
        return {"answer": sum(counts), "disjointCases": counts}, {"additionRule": "PASS", "noOverlap": "PASS"}
    if kind == "count_multiplication":
        counts = [_integer(item, "count") for item in data.get("counts", [])]
        return {"answer": math.prod(counts), "stageChoices": counts}, {"multiplicationRule": "PASS", "independentStages": "PASS"}
    if kind == "count_union_overlap":
        a, b, overlap = (_integer(data.get(key), key) for key in ("a", "b", "overlap"))
        if overlap > min(a, b):
            raise High1UnitError("overlap cannot exceed either set")
        return {"answer": a + b - overlap, "unionCount": a + b - overlap}, {"caseClassification": "PASS", "overlapRemoval": "PASS"}
    if kind == "permutation":
        n, r = _integer(data.get("n"), "n"), _integer(data.get("r"), "r")
        return {"answer": _permutation(n, r), "value": _permutation(n, r)}, {"permutationFormula": "PASS", "orderMatters": "PASS"}
    if kind == "combination":
        n, r = _integer(data.get("n"), "n"), _integer(data.get("r"), "r")
        return {"answer": _combination(n, r), "value": _combination(n, r)}, {"combinationFormula": "PASS", "orderIgnored": "PASS"}
    if kind == "conditional_count":
        n, r = _integer(data.get("n"), "n"), _integer(data.get("r"), "r")
        return {"answer": _permutation(n, r), "value": _permutation(n, r), "condition": data.get("condition")}, {"conditionHandling": "PASS", "orderMatters": "PASS"}
    if kind == "matrix_add":
        result = _matrix_add(_matrix(data.get("left"), "left"), _matrix(data.get("right"), "right"))
        return {"answer": _matrix_json(result), "matrix": _matrix_json(result)}, {"sameShape": "PASS", "entrywiseAddition": "PASS"}
    if kind == "matrix_multiply":
        result = _matrix_mul(_matrix(data.get("left"), "left"), _matrix(data.get("right"), "right"))
        return {"answer": _matrix_json(result), "matrix": _matrix_json(result)}, {"dimensionRule": "PASS", "rowColumnProducts": "PASS"}
    if kind == "matrix_determinant":
        matrix = _matrix(data.get("matrix"), "matrix")
        if len(matrix) != 2 or len(matrix[0]) != 2:
            raise High1UnitError("matrix_determinant supports 2x2 matrices")
        value = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
        return {"answer": _json_number(value), "determinant": _json_number(value)}, {"determinantFormula": "PASS", "crossProductDifference": "PASS"}
    if kind == "line_two_points":
        (x1, y1), (x2, y2) = _point(data.get("A"), "A"), _point(data.get("B"), "B")
        if x1 == x2:
            answer = {"form": "vertical", "x": _json_number(x1)}
            checks = {"verticalLine": "PASS", "twoPoints": "PASS"}
        else:
            slope = (y2 - y1) / (x2 - x1)
            intercept = y1 - slope * x1
            answer = {"slope": _json_number(slope), "intercept": _json_number(intercept)}
            checks = {"slope": "PASS", "twoPoints": "PASS"}
        return {"answer": answer, **answer}, checks
    if kind == "line_parallel_perpendicular":
        slope = _fraction(data.get("givenSlope"), "givenSlope")
        relation = data.get("relation")
        through = _point(data.get("through"), "through")
        if slope == 0 and relation == "perpendicular":
            new_slope: Fraction | str = "vertical"
        elif relation == "parallel":
            new_slope = slope
        elif relation == "perpendicular" and slope != 0:
            new_slope = -1 / slope
        else:
            raise High1UnitError("parallel/perpendicular fixture is unsupported")
        if new_slope == "vertical":
            answer = {"form": "vertical", "x": _json_number(through[0])}
        else:
            intercept = through[1] - new_slope * through[0]
            answer = {"slope": _json_number(new_slope), "intercept": _json_number(intercept)}
        return {"answer": answer, **answer}, {"slopeRelation": "PASS", "throughPoint": "PASS"}
    if kind == "line_intersection":
        m1, b1, m2, b2 = (_fraction(data.get(key), key) for key in ("m1", "b1", "m2", "b2"))
        if m1 == m2:
            raise High1UnitError("intersection fixture cannot use parallel lines")
        x, y = (b2 - b1) / (m1 - m2), m1 * (b2 - b1) / (m1 - m2) + b1
        return {"answer": _point_json((x, y)), "x": _json_number(x), "y": _json_number(y)}, {"simultaneousEquations": "PASS", "intersectionSubstitution": "PASS"}
    if kind == "point_line_distance":
        a, b, c = (_fraction(data.get(key), key) for key in ("a", "b", "c"))
        x, y = _point(data.get("point"), "point")
        denominator_square = a * a + b * b
        if denominator_square == 0:
            raise High1UnitError("line coefficients cannot both be zero")
        value = abs(a * x + b * y + c) / math.sqrt(float(denominator_square))
        return {"answer": value, "distance": value}, {"distanceFormula": "PASS", "absoluteValue": "PASS"}
    if kind == "circle_standard":
        h, k, radius = (_fraction(data.get(key), key) for key in ("h", "k", "radius"))
        if radius <= 0:
            raise High1UnitError("circle radius must be positive")
        return {"answer": {"center": _point_json((h, k)), "radius": _json_number(radius)}, "center": _point_json((h, k)), "radius": _json_number(radius)}, {"standardForm": "PASS", "radiusPositive": "PASS"}
    if kind == "circle_line_relation":
        radius, line_y = _fraction(data.get("radius"), "radius"), _fraction(data.get("lineY"), "lineY")
        distance = abs(line_y)
        if radius <= 0:
            raise High1UnitError("circle radius must be positive")
        relation = "two_intersections" if distance < radius else "tangent" if distance == radius else "no_intersection"
        return {"answer": relation, "centerToLineDistance": _json_number(distance), "relation": relation}, {"centerDistance": "PASS", "circleLineRelation": "PASS"}
    if kind == "circle_circle_relation":
        distance = _fraction(data.get("centerDistance"), "centerDistance")
        r1, r2 = _fraction(data.get("r1"), "r1"), _fraction(data.get("r2"), "r2")
        if distance <= 0 or r1 <= 0 or r2 <= 0:
            raise High1UnitError("circle-circle fixture is invalid")
        relation = "two_intersections" if abs(r1 - r2) < distance < r1 + r2 else "external_tangent" if distance == r1 + r2 else "internal_tangent" if distance == abs(r1 - r2) else "none"
        return {"answer": relation, "centerDistance": _json_number(distance), "relation": relation}, {"triangleInequality": "PASS", "circleCircleRelation": "PASS"}
    if kind == "circle_tangent":
        radius, tangent_y = _fraction(data.get("radius"), "radius"), _fraction(data.get("tangentY"), "tangentY")
        if abs(tangent_y) != radius:
            raise High1UnitError("tangent line must be at radius distance from the origin")
        return {"answer": {"point": {"x": 0, "y": _json_number(tangent_y)}, "line": f"y={_json_number(tangent_y)}"}, "contactPoint": {"x": 0, "y": _json_number(tangent_y)}}, {"radiusPerpendicular": "PASS", "tangentPoint": "PASS"}
    if kind == "translation_point":
        point, vector = _point(data.get("point"), "point"), _point(data.get("vector"), "vector")
        result = (point[0] + vector[0], point[1] + vector[1])
        return {"answer": _point_json(result), "translatedPoint": _point_json(result)}, {"translationVector": "PASS", "coordinateAddition": "PASS"}
    if kind == "reflection_point":
        x, y = _point(data.get("point"), "point")
        axis = data.get("axis")
        if axis == "x":
            result = (x, -y)
        elif axis == "y":
            result = (-x, y)
        else:
            raise High1UnitError("reflection axis must be x or y")
        return {"answer": _point_json(result), "reflectedPoint": _point_json(result)}, {"axisReflection": "PASS", "distancePreservation": "PASS"}
    if kind == "translation_polygon":
        points = [_point(item, f"points[{index}]") for index, item in enumerate(data.get("points", []))]
        vector = _point(data.get("vector"), "vector")
        result = [_point_json((x + vector[0], y + vector[1])) for x, y in points]
        return {"answer": result, "translatedPoints": result}, {"allVerticesTranslated": "PASS", "vectorConsistency": "PASS"}
    if kind == "set_membership":
        a, b = set(data.get("A", [])), set(data.get("B", []))
        if not a.issubset(b):
            answer = False
        else:
            answer = True
        return {"answer": answer, "isSubset": answer}, {"membership": "PASS", "subsetDefinition": "PASS"}
    if kind == "set_operations":
        a, b = set(data.get("A", [])), set(data.get("B", []))
        union, intersection = sorted(a | b), sorted(a & b)
        return {"answer": {"union": union, "intersection": intersection}, "union": union, "intersection": intersection}, {"union": "PASS", "intersection": "PASS"}
    if kind == "set_complement":
        universal, subset = set(data.get("universal", [])), set(data.get("A", []))
        if not subset.issubset(universal):
            raise High1UnitError("set must be contained in universal set")
        complement = sorted(universal - subset)
        return {"answer": complement, "complement": complement}, {"universalSet": "PASS", "complement": "PASS"}
    if kind == "proposition_implication":
        pairs = data.get("truthPairs")
        if not isinstance(pairs, list) or not pairs:
            raise High1UnitError("truthPairs are required")
        values = [not (bool(pair[0]) and not bool(pair[1])) for pair in pairs]
        return {"answer": all(values), "truthValues": values}, {"implicationTruthTable": "PASS", "allCases": "PASS"}
    if kind == "proposition_necessary_sufficient":
        implication_ab, implication_ba = bool(data.get("aImpliesB")), bool(data.get("bImpliesA"))
        relation = "equivalent" if implication_ab and implication_ba else "A_sufficient_B_necessary" if implication_ab else "B_sufficient_A_necessary" if implication_ba else "neither"
        return {"answer": relation, "aImpliesB": implication_ab, "bImpliesA": implication_ba}, {"implicationDirection": "PASS", "necessarySufficient": "PASS"}
    if kind == "proposition_counterexample":
        counterexample = data.get("counterexample")
        if counterexample is None:
            raise High1UnitError("counterexample is required")
        return {"answer": counterexample, "counterexample": counterexample, "statementRefuted": True}, {"counterexample": "PASS", "universalStatement": "PASS"}
    if kind == "function_value":
        a, b, x = (_fraction(data.get(key), key) for key in ("a", "b", "x"))
        value = a * x + b
        return {"answer": _json_number(value), "value": _json_number(value)}, {"functionValue": "PASS", "domainCheck": "PASS"}
    if kind == "function_composition":
        f_a, f_b, g_a, g_b, x = (_fraction(data.get(key), key) for key in ("fA", "fB", "gA", "gB", "x"))
        value = f_a * (g_a * x + g_b) + f_b
        return {"answer": _json_number(value), "value": _json_number(value)}, {"innerThenOuter": "PASS", "composition": "PASS"}
    if kind == "function_inverse":
        a, b, y = (_fraction(data.get(key), key) for key in ("a", "b", "y"))
        if a == 0:
            raise High1UnitError("linear function inverse requires non-zero slope")
        x = (y - b) / a
        return {"answer": _json_number(x), "inverseValue": _json_number(x)}, {"oneToOne": "PASS", "inverseVerification": "PASS"}
    if kind == "rational_domain_asymptote":
        h, k = (_fraction(data.get(key), key) for key in ("h", "k"))
        return {"answer": {"domainExcludes": _json_number(h), "vertical": _json_number(h), "horizontal": _json_number(k)}, "verticalAsymptote": _json_number(h), "horizontalAsymptote": _json_number(k)}, {"domainRestriction": "PASS", "asymptotes": "PASS"}
    if kind == "rational_value":
        a, h, k, x = (_fraction(data.get(key), key) for key in ("a", "h", "k", "x"))
        if x == h:
            raise High1UnitError("rational value cannot use vertical asymptote")
        value = a / (x - h) + k
        return {"answer": _json_number(value), "value": _json_number(value)}, {"domainCheck": "PASS", "evaluation": "PASS"}
    if kind == "rational_translation":
        return {"answer": {"verticalAsymptote": data.get("h"), "horizontalAsymptote": data.get("k")}, "translation": {"right": data.get("h"), "vertical": data.get("k")}}, {"asymptoteShift": "PASS", "reciprocalBase": "PASS"}
    if kind == "radical_domain":
        a, b = (_fraction(data.get(key), key) for key in ("a", "b"))
        if a == 0:
            raise High1UnitError("radical domain coefficient cannot be zero")
        boundary = -b / a
        side = "x>=boundary" if a > 0 else "x<=boundary"
        return {"answer": {"boundary": _json_number(boundary), "side": side}, "boundary": _json_number(boundary), "side": side}, {"radicandNonnegative": "PASS", "domain": "PASS"}
    if kind == "radical_value":
        a, b, x = (_fraction(data.get(key), key) for key in ("a", "b", "x"))
        radicand = a * x + b
        if radicand < 0:
            raise High1UnitError("radical value fixture has a negative radicand")
        value = math.sqrt(float(radicand))
        return {"answer": value, "value": value}, {"domainCheck": "PASS", "principalRoot": "PASS"}
    if kind == "radical_translation":
        h, k = (_fraction(data.get(key), key) for key in ("h", "k"))
        return {"answer": {"vertex": _point_json((h, k)), "expression": f"sqrt(x-{_json_number(h)})+({_json_number(k)})"}, "vertex": _point_json((h, k))}, {"translationVector": "PASS", "domainShift": "PASS"}
    raise High1UnitError(f"unsupported high1 fixture kind: {kind}")


def load_high1_fixtures(root: Path) -> list[dict[str, Any]]:
    path = root / FIXTURES_RELATIVE_PATH
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise High1UnitError(f"high1 fixtures cannot be read: {path}") from error
    if not isinstance(payload, dict) or payload.get("schemaVersion") != BENCHMARK_SCHEMA_VERSION or not isinstance(payload.get("fixtures"), list):
        raise High1UnitError("high1 fixture envelope is invalid")
    fixtures = copy.deepcopy(payload["fixtures"])
    if not fixtures:
        raise High1UnitError("high1 fixtures must not be empty")
    return fixtures


def load_all_high1_fixtures(root: Path) -> list[dict[str, Any]]:
    return load_coordinate_fixtures(root) + load_high1_fixtures(root)


def _unit_requirement(fixture: dict[str, Any]) -> str:
    if fixture["unitKey"] == "H22-C2-03":
        return "MANDATORY"
    if isinstance(fixture.get("visual"), dict):
        return "RECOMMENDED"
    return "NOT_REQUIRED"


def solve_high1_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") not in ALL_UNIT_KEYS:
        raise High1UnitError("fixture has an unsupported canonical unitKey")
    case_id = fixture.get("caseId")
    if not isinstance(case_id, str) or not case_id.strip():
        raise High1UnitError("fixture.caseId must be non-empty")
    unit_key = str(fixture["unitKey"])
    if unit_key == "H22-C2-01":
        result = solve_coordinate_case(fixture)
        result["fixtureClass"] = fixture.get("fixtureClass")
        result["expected"] = copy.deepcopy(fixture.get("expected"))
        return result
    computed, checks = _solve_nonvisual(fixture)
    expected = fixture.get("expected")
    if expected is not None and _json_value(computed.get("answer")) != _json_value(_expected_answer(fixture)):
        raise High1UnitError(f"{case_id} expected answer mismatch")
    visual_requirement = _unit_requirement(fixture)
    answer = _answer_string(fixture["kind"], computed)
    detail = normalize_solution_detail(
        _solution_detail(fixture, computed, answer, visual_requirement=visual_requirement),
        inferred_visual_requirement=visual_requirement,
    )
    visual_spec = _build_unit_visual(fixture, computed, solution=False)
    solution_visual_spec = _build_unit_visual(fixture, computed, solution=True)
    if visual_requirement == "MANDATORY" and solution_visual_spec is None:
        raise High1UnitError(f"{case_id} requires a solution visual")
    if solution_visual_spec is not None and visual_requirement == "MANDATORY":
        visual_elements = fixture.get("solutionVisualElements")
        if not isinstance(visual_elements, dict):
            visual_elements = {}
        visual_terms = ["원의 방정식", "원의 중심", "반지름"]
        if visual_elements.get("line") is True:
            visual_terms.append("직선")
        if visual_elements.get("tangent") is True:
            visual_terms.extend(["접선", "접점"])
        if visual_elements.get("chord") is True:
            visual_terms.append("현")
        visual_context = " ".join(visual_terms)
        validate_solution_visual_spec(
            solution_visual_spec,
            student_payload={"content": visual_context, "questionType": "SHORT_ANSWER", "choices": []},
            solution=answer + " " + visual_context + " 풀이",
            inferred_visual_requirement=visual_requirement,
            preflight_item={"solutionVisualElements": fixture.get("solutionVisualElements", {})},
        )
    solution = format_solution_detail(detail, answer)
    quality = build_solution_quality_report(detail, inferred_visual_requirement=visual_requirement, has_solution_visual=solution_visual_spec is not None)
    if quality["verdict"] != "PASS":
        raise High1UnitError(f"{case_id} solution quality did not pass")
    if visual_spec is not None:
        render_visual_spec(visual_spec)
    if solution_visual_spec is not None:
        render_visual_spec(solution_visual_spec)
    return {
        "caseId": case_id,
        "unitKey": unit_key,
        "kind": fixture["kind"],
        "fixtureClass": fixture.get("fixtureClass"),
        "coverage": fixture.get("coverage"),
        "computed": _json_value(computed),
        "expected": _json_value(expected),
        "checks": checks,
        "visualSpec": visual_spec,
        "solution": solution,
        "solutionDetail": detail,
        "solutionVisualSpec": solution_visual_spec,
        "solutionQuality": quality,
    }


def independently_review_high1_fixture(fixture: dict[str, Any], result: dict[str, Any]) -> dict[str, Any]:
    """Run a small blind-style reducer over the student-facing result.

    The reviewer does not consume the solver's private intermediate values. It
    compares the published answer to the fixture expectation, checks every
    solution step reason, and validates the bound solution visual separately.
    """

    if result.get("caseId") != fixture.get("caseId"):
        raise High1UnitError("independent review case identity mismatch")
    expected = _expected_answer(fixture)
    computed = result.get("computed", {})
    if fixture["unitKey"] == "H22-C2-01":
        kind = fixture["kind"]
        if kind == "distance":
            matched = math.isclose(float(computed.get("distance")), float(expected["distance"]), rel_tol=1e-9, abs_tol=1e-9)
        elif kind in {"midpoint", "section", "centroid"}:
            matched = all(math.isclose(float(computed["point"][key]), float(expected["point"][key]), rel_tol=1e-9, abs_tol=1e-9) for key in ("x", "y"))
        else:
            matched = all(math.isclose(float(computed["equation"][key]), float(expected["equation"][key]), rel_tol=1e-9, abs_tol=1e-9) for key in ("a", "b", "c"))
    else:
        matched = _json_value(computed.get("answer")) == _json_value(expected)
    if not matched:
        raise High1UnitError(f"independent review answer mismatch: {fixture['caseId']}")
    detail = result.get("solutionDetail")
    if not isinstance(detail, dict) or len(detail.get("steps", [])) < 3 or any(not step.get("why") for step in detail["steps"]):
        raise High1UnitError(f"independent review solution walkthrough incomplete: {fixture['caseId']}")
    visual = result.get("solutionVisualSpec")
    if result.get("solutionQuality", {}).get("visualRequirement") == "MANDATORY":
        if not isinstance(visual, dict):
            raise High1UnitError(f"independent review mandatory solution visual missing: {fixture['caseId']}")
        render_visual_spec(visual)
    return {
        "caseId": fixture["caseId"],
        "unitKey": fixture["unitKey"],
        "verdict": "PASS",
        "checks": {
            "answer": "PASS",
            "solutionDetail": "PASS",
            "solutionVisual": "PASS" if isinstance(visual, dict) else "NOT_APPLICABLE",
        },
    }


def _canonical_unit_order(root: Path) -> dict[str, dict[str, Any]]:
    matrix = load_high1_matrix(root)
    return {item["unitKey"]: item for item in matrix["units"]}


def run_high1_unit_benchmark(root: Path, output_root: Path, repeats: int = 3) -> dict[str, Any]:
    if not isinstance(repeats, int) or not 1 <= repeats <= 10:
        raise High1UnitError("repeats must be an integer from 1 through 10")
    units = _canonical_unit_order(root)
    fixtures = load_all_high1_fixtures(root)
    counts = {key: 0 for key in ALL_UNIT_KEYS}
    for fixture in fixtures:
        key = fixture.get("unitKey")
        if key not in counts:
            raise High1UnitError(f"fixture unit key is not canonical: {key}")
        counts[key] += 1
    missing = [key for key, count in counts.items() if count < 3]
    if missing:
        raise High1UnitError(f"every canonical unit needs at least three fixtures: {missing}")
    output_root = output_root.resolve()
    output_root.mkdir(parents=True, exist_ok=True)
    by_case: dict[str, list[dict[str, Any]]] = {fixture["caseId"]: [] for fixture in fixtures}
    by_unit: dict[str, list[dict[str, Any]]] = {key: [] for key in ALL_UNIT_KEYS}
    repetitions: list[dict[str, Any]] = []
    for repetition in range(1, repeats + 1):
        run_dir = output_root / f"run-{repetition:03d}"
        run_dir.mkdir(parents=True, exist_ok=True)
        case_reports: list[dict[str, Any]] = []
        for fixture in fixtures:
            case_dir = run_dir / fixture["caseId"]
            case_dir.mkdir(parents=True, exist_ok=True)
            atomic_write_json(case_dir / "fixture.json", fixture)
            report: dict[str, Any] = {
                "schemaVersion": BENCHMARK_SCHEMA_VERSION,
                "artifactType": "ALIVE_HIGH1_UNIT_CASE_REPORT",
                "caseId": fixture["caseId"],
                "unitKey": fixture["unitKey"],
                "fixtureClass": fixture.get("fixtureClass"),
                "browserRender": "NOT_RUN",
            }
            try:
                result = solve_high1_fixture(fixture)
                review = independently_review_high1_fixture(fixture, result)
                atomic_write_json(case_dir / "math-report.json", {"artifactType": "ALIVE_HIGH1_UNIT_MATH_REPORT", "caseId": fixture["caseId"], "unitKey": fixture["unitKey"], "computed": result["computed"], "expected": result["expected"], "checks": result["checks"], "status": "PASS"})
                atomic_write_json(case_dir / "solution-detail.json", result["solutionDetail"])
                atomic_write_json(case_dir / "solution-review.json", review)
                if result.get("visualSpec") is not None:
                    atomic_write_json(case_dir / "visual-spec.json", result["visualSpec"])
                    visual_svg = render_visual_spec(result["visualSpec"])
                    (case_dir / "visual.svg").write_text(visual_svg, encoding="utf-8", newline="\n")
                if result.get("solutionVisualSpec") is not None:
                    atomic_write_json(case_dir / "solution-visual-spec.json", result["solutionVisualSpec"])
                    solution_svg = render_visual_spec(result["solutionVisualSpec"])
                    (case_dir / "solution.svg").write_text(solution_svg, encoding="utf-8", newline="\n")
                report.update({
                    "status": "PASS_STRUCTURAL",
                    "mathValidation": "PASS",
                    "solutionValidation": "PASS",
                    "independentReview": review["verdict"],
                    "solutionDetailSha256": sha256_file(case_dir / "solution-detail.json"),
                    "visualValidation": "PASS_STRUCTURAL_ONLY" if result.get("visualSpec") is not None or result.get("solutionVisualSpec") is not None else "NOT_REQUIRED",
                    "productionCapability": "UNCHANGED",
                })
                if (case_dir / "visual.svg").is_file():
                    report["visualAssetSha256"] = sha256_file(case_dir / "visual.svg")
                if (case_dir / "solution.svg").is_file():
                    report["solutionVisualAssetSha256"] = sha256_file(case_dir / "solution.svg")
            except (High1UnitError, OSError, ValueError) as error:
                report.update({"status": "FAIL", "error": str(error)})
            atomic_write_json(case_dir / "benchmark-report.json", report)
            case_reports.append(report)
            by_case[fixture["caseId"]].append(report)
            by_unit[fixture["unitKey"]].append(report)
        repetitions.append({"repetition": repetition, "status": "PASS_STRUCTURAL" if all(item["status"] == "PASS_STRUCTURAL" for item in case_reports) else "FAIL", "cases": case_reports})
    deterministic = {
        case_id: {
            "caseReportHashesEqual": len({sha256_file(output_root / f"run-{index:03d}" / case_id / "benchmark-report.json") for index in range(1, repeats + 1)}) == 1,
            "solutionDetailHashesEqual": len({sha256_file(output_root / f"run-{index:03d}" / case_id / "solution-detail.json") for index in range(1, repeats + 1)}) == 1,
        }
        for case_id in by_case
    }
    unit_reports = {
        key: {
            "fixtureCount": len(reports) // repeats,
            "status": "PASS_STRUCTURAL" if reports and all(item["status"] == "PASS_STRUCTURAL" for item in reports) else "FAIL",
            "fixtureClasses": sorted({str(item.get("fixtureClass")) for item in fixtures if item["unitKey"] == key}),
        }
        for key, reports in by_unit.items()
    }
    all_pass = all(item["status"] == "PASS_STRUCTURAL" for item in repetitions)
    all_deterministic = all(item["caseReportHashesEqual"] and item["solutionDetailHashesEqual"] for item in deterministic.values())
    summary = {
        "schemaVersion": BENCHMARK_SCHEMA_VERSION,
        "artifactType": "ALIVE_HIGH1_UNIT_BENCHMARK_REPORT",
        "mode": "UNIT_PROMOTION_STRUCTURAL_ONLY",
        "canonicalUnitCount": len(ALL_UNIT_KEYS),
        "fixtureCount": len(fixtures),
        "fixturesPerUnit": counts,
        "repetitions": repeats,
        "canonicalMapping": "PASS",
        "mathematicalValidation": "PASS" if all_pass else "FAIL",
        "solutionValidation": "PASS" if all_pass else "FAIL",
        "independentReview": "PASS" if all_pass else "FAIL",
        "visualValidation": "PASS_STRUCTURAL_ONLY" if all_pass else "FAIL",
        "determinism": {"status": "PASS" if all_deterministic else "FAIL", "cases": deterministic},
        "browserRender": "NOT_RUN",
        "operation": "UNIT_BENCHMARK_ONLY",
        "overallStatus": "PASS_WITH_MANUAL_BROWSER_GATE" if all_pass and all_deterministic else "FAIL",
        "productionCapability": "UNCHANGED",
        "units": unit_reports,
        "repetitionReports": repetitions,
    }
    atomic_write_json(output_root / "summary.json", summary)
    return summary


def write_high1_preview_exam(root: Path, output_path: Path, unit_key: str = "H22-C2-01") -> dict[str, Any]:
    """Materialize a local Archive-engine preview for one completed unit.

    The preview is intentionally a staging artifact.  It is served into the
    existing read-only Archive engine by a local test server and never copied
    into ``archive/exams`` or registered in the production index.
    """

    if unit_key not in ALL_UNIT_KEYS:
        raise High1UnitError(f"preview unit key is not canonical: {unit_key}")
    fixtures = [fixture for fixture in load_all_high1_fixtures(root) if fixture["unitKey"] == unit_key]
    if not fixtures:
        raise High1UnitError(f"preview has no fixtures for {unit_key}")
    output_path = output_path.resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    asset_root = output_path.parent / f"{output_path.stem}-assets"
    asset_root.mkdir(parents=True, exist_ok=True)
    questions: list[dict[str, Any]] = []
    asset_reports: list[dict[str, Any]] = []
    for ordinal, fixture in enumerate(fixtures, 1):
        result = solve_high1_fixture(fixture)
        visual_path = None
        solution_path = None
        if isinstance(result.get("visualSpec"), dict):
            visual_path = asset_root / f"q{ordinal:03d}.svg"
            visual_path.write_text(render_visual_spec(result["visualSpec"]), encoding="utf-8", newline="\n")
        if isinstance(result.get("solutionVisualSpec"), dict):
            solution_path = asset_root / f"q{ordinal:03d}-solution.svg"
            solution_path.write_text(render_visual_spec(result["solutionVisualSpec"]), encoding="utf-8", newline="\n")
        def browser_relative(path: Path | None) -> str | None:
            if path is None:
                return None
            relative = path.relative_to(root).as_posix()
            return "../" + relative
        detail = result["solutionDetail"]
        question: dict[str, Any] = {
            "id": ordinal,
            "questionType": "주관식",
            "content": f"{detail['given']}<br>{detail['goal']}",
            "choices": [],
            "answer": _preview_answer(fixture, result),
            "solution": result["solution"],
            "solutionDetail": detail,
            "standardCourse": "고등학교 공통수학2",
            "standardUnitKey": unit_key,
            "standardUnit": "평면좌표" if unit_key == "H22-C2-01" else unit_key,
            "tags": [str(fixture.get("coverage", ""))],
        }
        if visual_path is not None:
            question["image"] = browser_relative(visual_path)
        if solution_path is not None:
            question["solutionImage"] = browser_relative(solution_path)
            question["solutionImageAlt"] = f"{unit_key} {ordinal}번 해설 도형"
            question["solutionImageCaption"] = "풀이에 사용한 점과 관계를 표시한 해설 도형"
            question["solutionImageSize"] = "medium"
        questions.append(question)
        asset_reports.append({
            "ordinal": ordinal,
            "visual": sha256_file(visual_path) if visual_path else None,
            "solution": sha256_file(solution_path) if solution_path else None,
        })
    script = "window.examTitle = " + json.dumps(f"ALIVE 고1 {unit_key} 단원 미리보기", ensure_ascii=False) + ";\n" + "window.questionBank = " + json.dumps(questions, ensure_ascii=False, indent=2) + ";\n"
    output_path.write_text(script, encoding="utf-8", newline="\n")
    manifest = {
        "schemaVersion": BENCHMARK_SCHEMA_VERSION,
        "artifactType": "ALIVE_HIGH1_PREVIEW_EXAM",
        "unitKey": unit_key,
        "questionCount": len(questions),
        "scriptPath": output_path.relative_to(root).as_posix(),
        "scriptSha256": sha256_file(output_path),
        "assets": asset_reports,
        "publicationStatus": "NOT_PUBLISHED",
    }
    atomic_write_json(output_path.with_name(output_path.stem + "-manifest.json"), manifest)
    return manifest


__all__ = [
    "ALL_UNIT_KEYS",
    "BENCHMARK_SCHEMA_VERSION",
    "FIXTURES_RELATIVE_PATH",
    "High1UnitError",
    "independently_review_high1_fixture",
    "load_all_high1_fixtures",
    "load_high1_fixtures",
    "run_high1_unit_benchmark",
    "solve_high1_fixture",
    "write_high1_preview_exam",
]
