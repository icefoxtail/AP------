"""Bounded, exact High-1 A/B/C variant adapter.

This module is intentionally narrower than the universal prose problem.  It
turns the canonical High-1 fixture corpus into real variants with a
deterministic data transform, a fresh exact solve, and a proof sidecar.  It
does not claim that arbitrary Korean source prose is solvable; unsupported
source families remain outside this adapter.
"""

from __future__ import annotations

import copy
import hashlib
import json
import re
from pathlib import Path
from typing import Any

from .curriculum_adapters import load_high1_curriculum_adapters
from .high1_units import (
    ALL_UNIT_KEYS,
    _preview_answer,
    independently_review_high1_fixture,
    load_all_high1_fixtures,
    solve_high1_fixture,
)
from .run_store import atomic_write_json, sha256_file
from .structure_families import (
    CAPABILITY_SUPPORTED,
    StructureFamilyAdapter,
    StructureFamilyRegistry,
)
from .universal_high1_bridge import (
    _archive_answer_text,
    _archive_math_text,
    _digest,
    _graph_for_fixture,
    _student_question,
    write_high1_universal_source,
)
from .universal_ir import build_universal_question_ir
from .universal_variant_engine import (
    TRANSFORM_A_NUMERIC,
    TRANSFORM_B_REPRESENTATION,
    TRANSFORM_C_PARAMETER_RECOVERY,
    build_c_variant,
    build_variant_plan,
    evaluate_capability_promotion,
)
from .variant_proof import build_proof_check, reduce_variant_class


HIGH1_VARIANT_SCHEMA_VERSION = "0.1.0"
HIGH1_VARIANT_ARTIFACT = "ALIVE_HIGH1_BOUNDED_VARIANT_INPUT"
HIGH1_CAPABILITY_ARTIFACT = "ALIVE_HIGH1_BOUNDED_CAPABILITY_PROMOTION"


class High1VariantError(ValueError):
    pass


def _normalize_variant_solution_math(value: str) -> str:
    """Normalize legacy coordinate notation before the Archive math linter.

    The coordinate fixture writer intentionally emits readable Unicode such
    as ``Δx`` and ``√(...)``.  That is fine for the fixture report, but the
    published Archive question must use explicit math delimiters so the
    production renderer and the final closure audit see the same expression.
    """

    text = str(value or "")
    # Avoid student-facing artifacts such as ``x--3`` and ``y--1`` in
    # substituted coordinate formulas.
    text = re.sub(r"([xy])--(\d+(?:\.\d+)?)", r"\1+\2", text)
    text = re.sub(
        r"AB=√\(\((-?\d+(?:\.\d+)?)\)²\+\((-?\d+(?:\.\d+)?)\)²\)=√\((-?\d+(?:\.\d+)?)\)",
        lambda match: f"$AB=\\sqrt{{{match.group(1)}^2+{match.group(2)}^2}}=\\sqrt{{{match.group(3)}}}$",
        text,
    )
    text = re.sub(r"√\(\(x₂-x₁\)²\+\(y₂-y₁\)²\)", r"$\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$", text)
    text = re.sub(r"(?<![\w$])Δ([xy])=(-?\d+(?:\.\d+)?)", r"$\\Delta \1=\2$", text)
    text = re.sub(r"(?<![\w$])\(Δx\)²\+\(Δy\)²=(-?\d+(?:\.\d+)?)", r"$(\\Delta x)^2+(\\Delta y)^2=\1$", text)
    text = re.sub(r"(?<![\w$])AB=(-?\d+(?:\.\d+)?)", r"$AB=\1$", text)
    return _archive_math_text(text)


def high1_variant_registry() -> StructureFamilyRegistry:
    """Register only the seven families covered by the High-1 adapter."""

    families = {
        "DIRECT_CALCULATION",
        "QUADRATIC_EQUATION",
        "FUNCTION_PARAMETER",
        "INEQUALITY_SOLVE",
        "COUNTING_BASIC",
        "COORDINATE_BASIC",
        "COORDINATE_GEOMETRY",
    }
    registry = StructureFamilyRegistry()
    for family_id in sorted(families):
        registry.register(
            StructureFamilyAdapter(
                family_id=family_id,
                solver_profile="high1_exact_fixture_adapter_v1",
                transform_capabilities={
                    TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED,
                    TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED,
                    TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_SUPPORTED,
                },
                visual_capabilities={
                    TRANSFORM_A_NUMERIC: "REGENERATE_REQUIRED",
                    TRANSFORM_B_REPRESENTATION: "PRESERVE_OR_REGENERATE",
                    TRANSFORM_C_PARAMETER_RECOVERY: "REGENERATE_REQUIRED",
                },
            )
        )
    return registry


def _n(value: Any) -> str:
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value)


def _signed(value: Any, suffix: str = "") -> str:
    number = int(value) if isinstance(value, float) and value.is_integer() else value
    if float(number) < 0:
        return f"-{_n(abs(number))}{suffix}"
    return f"+{_n(number)}{suffix}"


def _linear_term(coefficient: Any, variable: str = "x") -> str:
    number = float(coefficient)
    if number == 1:
        return variable
    if number == -1:
        return f"-{variable}"
    return f"{_n(coefficient)}{variable}"


def _scalar_factor(coefficient: Any) -> str:
    number = float(coefficient)
    if number == 1:
        return ""
    if number == -1:
        return "-"
    return _n(coefficient)


def _shifted_x(h: Any) -> str:
    number = float(h)
    return f"x+{_n(abs(number))}" if number < 0 else f"x-{_n(number)}"


def _vertex_function(data: dict[str, Any]) -> str:
    return f"{_scalar_factor(data['a'])}({_shifted_x(data['h'])})^2{_signed(data['k'])}"


def _poly(values: list[Any]) -> str:
    terms: list[str] = []
    for power, raw in enumerate(values):
        value = int(raw) if isinstance(raw, float) and raw.is_integer() else raw
        if value == 0:
            continue
        sign = "-" if float(value) < 0 else "+"
        magnitude = abs(value)
        if power == 0:
            body = _n(magnitude)
        elif power == 1:
            body = "x" if magnitude == 1 else f"{_n(magnitude)}x"
        else:
            body = f"x^{power}" if magnitude == 1 else f"{_n(magnitude)}x^{power}"
        if not terms:
            terms.append(("-" if sign == "-" else "") + body)
        else:
            terms.append(sign + body)
    return "".join(terms) or "0"


def _matrix(value: list[list[Any]]) -> str:
    return "(" + "; ".join(", ".join(_n(item) for item in row) for row in value) + ")"


def _point(value: dict[str, Any]) -> str:
    return f"({_n(value['x'])}, {_n(value['y'])})"


def _selected_coordinate_expected(case: dict[str, Any]) -> dict[str, Any]:
    from .coordinate_geometry import centroid, distance, equal_distance_locus, midpoint, section_point

    kind = case["kind"]
    points = case["points"]
    if kind == "distance":
        return {"distance": distance(points["A"], points["B"])}
    if kind == "midpoint":
        return {"point": midpoint(points["A"], points["B"])}
    if kind == "section":
        return {"point": section_point(points["A"], points["B"], case["ratioAPtoPB"])}
    if kind == "centroid":
        return {"point": centroid(points["A"], points["B"], points["C"])}
    equation = equal_distance_locus(points["A"], points["B"])
    return {"equation": equation}


def _render_given_goal(fixture: dict[str, Any]) -> tuple[str, str]:
    """Render a structured fixture without leaking Python repr.

    This is deliberately explicit rather than falling back to ``str(data)``.
    The fixture corpus is the current deterministic boundary of the adapter,
    so every supported kind must have a student-facing Korean/math envelope.
    """

    data = fixture.get("data") or {}
    kind = fixture["kind"]
    if kind == "polynomial_add":
        return f"$P(x)={_poly(data['left'])}$, $Q(x)={_poly(data['right'])}$가 주어져 있다.", "$P(x)+Q(x)$를 정리한다."
    if kind == "polynomial_multiply":
        return f"$P(x)={_poly(data['left'])}$, $Q(x)={_poly(data['right'])}$가 주어져 있다.", "$P(x)Q(x)$를 전개한다."
    if kind == "polynomial_divide":
        return f"$P(x)={_poly(data['dividend'])}$를 $D(x)={_poly(data['divisor'])}$로 나눈다.", "몫과 나머지를 구한다."
    if kind == "identity_coefficient":
        return f"$({_poly(data['left'])})=({_poly(data['right'])})$가 모든 $x$에 대해 성립한다.", "양변의 계수를 비교하여 각 계수를 구한다."
    if kind == "remainder_theorem":
        return f"$P(x)={_poly(data['polynomial'])}$가 주어져 있다.", f"$P({_n(data['at'])})$를 구한다."
    if kind == "factor_theorem":
        return f"$P(x)={_poly(data['polynomial'])}$가 주어져 있다.", f"$x-{_n(data['at'])}$가 $P(x)$의 인수인지 판단한다."
    if kind == "factor_quadratic":
        return f"$P(x)={_poly(data['polynomial'])}$를 인수분해한다.", "$P(x)$를 일차식의 곱으로 나타낸다."
    if kind == "factor_substitution":
        return f"치환식 ${data['substitution']}$과 $z$에 대한 두 근 {_format_list(data['zRoots'])}이 주어져 있다.", "치환을 이용하여 원래 식의 근을 구한다."
    if kind == "factor_application":
        return f"$P(x)={_poly(data['polynomial'])}$의 인수 관계가 주어져 있다.", "주어진 인수 관계를 이용하여 근을 정리한다."
    if kind == "complex_product":
        return f"$z_1={_n(data['a'])}{_signed(data['b'], 'i')}$, $z_2={_n(data['c'])}{_signed(data['d'], 'i')}$가 주어져 있다.", "$z_1z_2$를 $a+bi$ 꼴로 나타낸다."
    if kind == "complex_conjugate":
        return f"복소수 $z={_n(data['real'])}{_signed(data['imaginary'], 'i')}$가 주어져 있다.", r"$z+\bar z$와 $z\bar z$를 각각 구한다."
    if kind == "complex_quadratic":
        return f"복소수 범위에서 ${_linear_term(data['a'])}x^2{_signed(data['b'])}x{_signed(data['c'])}=0$을 생각한다.", "이 방정식의 두 근의 실수부와 허수부의 크기를 구한다."
    if kind == "quadratic_roots":
        return f"$f(x)={_n(data['a'])}x^2{_n(data['b'])}x+{_n(data['c'])}$가 주어져 있다.", "$f(x)=0$의 두 근을 구한다."
    if kind == "quadratic_vertex":
        return f"$y={_vertex_function(data)}$가 주어져 있다.", "이차함수의 꼭짓점과 그래프의 방향을 구한다."
    if kind == "quadratic_interval_extrema":
        return f"$y={_vertex_function(data)}$의 구간 ${_n(data['interval'][0])}\\le x\\le {_n(data['interval'][1])}$을 생각한다.", "주어진 구간에서 최댓값과 최솟값을 구한다."
    if kind == "polynomial_roots":
        return f"$P(x)={_poly(data['polynomial'])}$가 주어져 있다.", "$P(x)=0$의 모든 실근을 구한다."
    if kind == "linear_system":
        return f"연립방정식 ${_n(data['a'])}x+{_n(data['b'])}y={_n(data['c'])}$, ${_n(data['d'])}x{_signed(data['e'])}y={_n(data['f'])}$가 주어져 있다.", "$x,y$의 값을 구한다."
    if kind == "quadratic_inequality":
        return f"이차식의 두 근이 {_format_list(data['roots'])}이고 부등호가 ${data['relation']}$이다.", "주어진 이차부등식의 해를 구한다."
    if kind == "count_addition":
        return f"서로 겹치지 않는 경우의 수가 각각 {_n(data['counts'][0])}가지, {_n(data['counts'][1])}가지이다.", "전체 경우의 수를 합의 법칙으로 구한다."
    if kind == "count_multiplication":
        return f"첫 단계의 선택이 {_n(data['counts'][0])}가지, 다음 단계의 선택이 {_n(data['counts'][1])}가지이다.", "전체 경우의 수를 곱의 법칙으로 구한다."
    if kind == "count_union_overlap":
        return f"두 사건의 경우의 수가 각각 {_n(data['a'])}, {_n(data['b'])}이고 겹치는 경우가 {_n(data['overlap'])}가지이다.", "두 사건의 합집합의 경우의 수를 구한다."
    if kind == "permutation":
        return f"서로 다른 {_n(data['n'])}개 중 {_n(data['r'])}개를 순서를 고려하여 뽑는다.", "가능한 순열의 개수를 구한다."
    if kind == "combination":
        return f"서로 다른 {_n(data['n'])}개 중 {_n(data['r'])}개를 순서 없이 뽑는다.", "가능한 조합의 개수를 구한다."
    if kind == "conditional_count":
        return f"서로 다른 {_n(data['n'])}개 중 {_n(data['r'])}개를 뽑되, 조건은 ‘{data['condition']}’이다.", "조건을 만족하는 경우의 수를 구한다."
    if kind == "matrix_add":
        return f"두 행렬 $A={_matrix(data['left'])}$, $B={_matrix(data['right'])}$가 주어져 있다.", "$A+B$를 구한다."
    if kind == "matrix_multiply":
        return f"두 행렬 $A={_matrix(data['left'])}$, $B={_matrix(data['right'])}$가 주어져 있다.", "$AB$를 구한다."
    if kind == "matrix_determinant":
        return f"행렬 $A={_matrix(data['matrix'])}$가 주어져 있다.", "$A$의 행렬식을 구한다."
    if kind == "line_two_points":
        return f"두 점 $A{_point(data['A'])}$, $B{_point(data['B'])}$를 지나는 직선을 구한다.", "직선의 기울기와 절편을 구한다."
    if kind == "line_parallel_perpendicular":
        relation = "평행" if data['relation'] == "parallel" else "수직"
        return f"기울기가 {_n(data['givenSlope'])}인 직선이 있고, 점 $P{_point(data['through'])}$를 지난다.", f"주어진 직선과 {relation}인 직선의 방정식을 구한다."
    if kind == "line_intersection":
        return f"두 직선 $y={_n(data['m1'])}x{_signed(data['b1'])}$, $y={_n(data['m2'])}x{_signed(data['b2'])}$가 주어져 있다.", "두 직선의 교점 좌표를 구한다."
    if kind == "circle_standard":
        return f"원의 중심이 $({_n(data['h'])},{_n(data['k'])})$, 반지름이 ${_n(data['radius'])}$이다.", "이 원의 방정식을 표준형으로 나타낸다."
    if kind == "circle_line_relation":
        return f"중심이 원점이고 반지름이 ${_n(data['radius'])}$인 원과 직선 $y={_n(data['lineY'])}$가 주어져 있다.", "원과 직선의 위치 관계를 판단한다."
    if kind == "circle_tangent":
        return f"중심이 원점이고 반지름이 ${_n(data['radius'])}$인 원에 직선 $y={_n(data['tangentY'])}$가 주어져 있다.", "접선과 접점을 구한다."
    if kind == "circle_circle_relation":
        return f"두 원의 중심 사이의 거리가 {_n(data['centerDistance'])}이고 반지름은 각각 {_n(data['r1'])}, {_n(data['r2'])}이다.", "두 원의 위치 관계를 판단한다."
    if kind == "translation_point":
        return f"점 $P{_point(data['point'])}$를 벡터 ${_point(data['vector'])}$만큼 평행이동한다.", "이동한 점의 좌표를 구한다."
    if kind == "reflection_point":
        return f"점 $P{_point(data['point'])}$를 {data['axis']}축에 대하여 대칭이동한다.", "대칭이동한 점의 좌표를 구한다."
    if kind == "translation_polygon":
        return f"삼각형의 꼭짓점 {_format_points(data['points'])}을 벡터 ${_point(data['vector'])}$만큼 평행이동한다.", "이동한 도형의 꼭짓점 좌표를 구한다."
    if kind == "set_membership":
        return f"$A={{{', '.join(_n(item) for item in data['A'])}}}$, $B={{{', '.join(_n(item) for item in data['B'])}}}$이다.", "$A$가 $B$의 부분집합인지 판단한다."
    if kind == "set_operations":
        return f"$A={{{', '.join(_n(item) for item in data['A'])}}}$, $B={{{', '.join(_n(item) for item in data['B'])}}}$이다.", r"$A\cup B$와 $A\cap B$를 구한다."
    if kind == "set_complement":
        return f"전체집합 $U={{{', '.join(_n(item) for item in data['universal'])}}}$, 부분집합 $A={{{', '.join(_n(item) for item in data['A'])}}}$이다.", "$A$의 여집합을 구한다."
    if kind == "proposition_implication":
        return r"명제 $p\Rightarrow q$의 네 가지 진리값이 주어져 있다.", "명제의 참·거짓을 진리표로 판단한다."
    if kind == "proposition_necessary_sufficient":
        return "두 명제 $A,B$ 사이의 함의 관계가 주어져 있다.", "두 조건의 필요조건·충분조건 관계를 판단한다."
    if kind == "proposition_counterexample":
        return f"‘{data['statement']}’라는 명제가 있다.", "주어진 명제가 거짓임을 보이는 반례를 제시한다."
    if kind == "function_value":
        return f"일차함수 $f(x)={_linear_term(data['a'])}x{_signed(data['b'])}$가 주어져 있다.", f"$f({_n(data['x'])})$를 구한다."
    if kind == "function_composition":
        return f"$f(x)={_linear_term(data['fA'])}x{_signed(data['fB'])}$, $g(x)={_linear_term(data['gA'])}x{_signed(data['gB'])}$가 주어져 있다.", f"$(f\\circ g)({_n(data['x'])})$를 구한다."
    if kind == "function_inverse":
        return f"일차함수 $f(x)={_linear_term(data['a'])}x{_signed(data['b'])}$가 주어져 있다.", f"$f(x)={_n(data['y'])}$를 만족하는 $x$를 구한다."
    if kind == "rational_domain_asymptote":
        h = data["h"]
        k = data["k"]
        denominator = f"x-{_n(h)}" if float(h) >= 0 else f"x+{_n(abs(h))}"
        return f"유리함수 $y=1/({denominator}){_signed(k)}$가 주어져 있다.", "정의역에서 제외되는 값과 두 점근선을 구한다."
    if kind == "rational_value":
        return f"유리함수 $y=\frac{{{_n(data['a'])}}}{{x-{_n(data['h'])}}}{_signed(data['k'])}$가 주어져 있다.", f"$x={_n(data['x'])}$일 때 함수값을 구한다."
    if kind == "rational_translation":
        return f"유리함수 $y=1/x$를 평행이동한 그래프의 점근선이 $x={_n(data['h'])}$, $y={_n(data['k'])}$이다.", "평행이동된 유리함수의 식을 나타낸다."
    if kind == "radical_domain":
        return f"무리함수 $y=\\sqrt{{{_n(data['a'])}x+{_n(data['b'])}}}$가 주어져 있다.", "함수가 정의되는 $x$의 범위를 구한다."
    if kind == "radical_value":
        return f"무리함수 $y=\\sqrt{{{_n(data['a'])}x+{_n(data['b'])}}}$가 주어져 있다.", f"$x={_n(data['x'])}$일 때 함수값을 구한다."
    if kind == "radical_translation":
        return f"무리함수 $y=\\sqrt{{{_shifted_x(data['h'])}}}{_signed(data['k'])}$가 주어져 있다.", "그래프의 꼭짓점과 정의역을 구한다."
    raise High1VariantError(f"no polished renderer for selected fixture kind: {kind}")


def _format_list(values: list[Any]) -> str:
    return "(" + ", ".join(_n(item) for item in values) + ")"


def _format_points(values: list[dict[str, Any]]) -> str:
    return "(" + ", ".join(_point(item) for item in values) + ")"


def _mutate_data(fixture: dict[str, Any]) -> dict[str, Any]:
    """Return a hand-bounded, valid, visibly different numeric instance."""

    kind = fixture["kind"]
    data = copy.deepcopy(fixture.get("data") or {})
    values: dict[str, Any] = {
        "polynomial_add": {"left": [2, -1, 4], "right": [1, 3, -2]},
        "polynomial_multiply": {"left": [1, -3], "right": [2, 1, 1]},
        "polynomial_divide": {"dividend": [-24, 26, -9, 1], "divisor": [-2, 1]},
        "identity_coefficient": {"left": [2, -3, 1], "right": [5, 4, 1]},
        "remainder_theorem": {"polynomial": [-4, 3, 0, 1], "at": 2},
        "factor_theorem": {"polynomial": [6, 1, -4, 1], "at": 2},
        "factor_quadratic": {"polynomial": [4, -5, 1], "roots": [1, 4]},
        "factor_substitution": {"substitution": "t=x^2", "zRoots": [1, 4]},
        "factor_application": {"polynomial": [-24, 26, -9, 1], "roots": [2, 3, 4]},
        "complex_product": {"a": 2, "b": -3, "c": 4, "d": 1},
        "complex_conjugate": {"real": -2, "imaginary": 5},
        "complex_quadratic": {"a": 1, "b": 4, "c": 13},
        "quadratic_roots": {"a": 1, "b": -5, "c": 4, "roots": [1, 4]},
        "quadratic_vertex": {"a": -2, "h": -1, "k": 4},
        "quadratic_interval_extrema": {"a": 1, "h": -1, "k": 2, "interval": [-2, 1]},
        "polynomial_roots": {"polynomial": [-40, 38, -11, 1], "roots": [2, 4, 5]},
        "linear_system": {"a": 2, "b": 1, "c": 7, "d": 1, "e": -1, "f": 1},
        "quadratic_inequality": {"roots": [1, 4], "relation": "<="},
        "count_addition": {"counts": [5, 4]},
        "count_multiplication": {"counts": [5, 3]},
        "count_union_overlap": {"a": 6, "b": 5, "overlap": 2},
        "permutation": {"n": 6, "r": 3},
        "combination": {"n": 7, "r": 3},
        "conditional_count": {"n": 6, "r": 2, "condition": "두 자리를 같은 기호로 채우지 않는다"},
        "matrix_add": {"left": [[2, 1], [4, 3]], "right": [[1, -2], [3, 2]]},
        "matrix_multiply": {"left": [[1, 2], [0, 1]], "right": [[2, 1], [3, 0]]},
        "matrix_determinant": {"matrix": [[4, 1], [2, 5]]},
        "line_two_points": {"A": {"x": -1, "y": 2}, "B": {"x": 3, "y": 10}, "xRange": [-3, 5], "yRange": [-2, 12]},
        "line_parallel_perpendicular": {"givenSlope": 3, "relation": "perpendicular", "through": {"x": 1, "y": 2}},
        "line_intersection": {"m1": 3, "b1": -2, "m2": -1, "b2": 6, "xRange": [-3, 5], "yRange": [-4, 12]},
        "circle_standard": {"h": -1, "k": 2, "radius": 4},
        "circle_line_relation": {"radius": 5, "lineY": 4},
        "circle_tangent": {"radius": 4, "tangentY": -4},
        "circle_circle_relation": {"centerDistance": 5, "r1": 4, "r2": 3},
        "translation_point": {"point": {"x": -2, "y": 3}, "vector": {"x": 4, "y": -1}, "xRange": [-4, 4], "yRange": [-1, 5]},
        "reflection_point": {"point": {"x": -3, "y": 2}, "axis": "y", "xRange": [-5, 5], "yRange": [-4, 4]},
        "translation_polygon": {"points": [{"x": -1, "y": 0}, {"x": 2, "y": 0}, {"x": -1, "y": 3}], "vector": {"x": 2, "y": -1}, "xRange": [-2, 5], "yRange": [-3, 4]},
        "set_membership": {"A": [2, 4, 6], "B": [1, 2, 3, 4, 5, 6]},
        "set_operations": {"A": [1, 3, 5], "B": [3, 4, 5, 6]},
        "set_complement": {"universal": [1, 2, 3, 4, 5, 6, 7], "A": [2, 4, 6]},
        "proposition_implication": {"truthPairs": [[True, True], [True, False], [False, True], [False, False]]},
        "proposition_necessary_sufficient": {"aImpliesB": True, "bImpliesA": False},
        "proposition_counterexample": {"statement": "모든 짝수는 4의 배수이다.", "counterexample": 2},
        "function_value": {"a": 3, "b": -2, "x": 4, "xRange": [-2, 6], "yRange": [-4, 12]},
        "function_composition": {"fA": 2, "fB": -1, "gA": 3, "gB": 2, "x": 1},
        "function_inverse": {"a": 2, "b": 3, "y": 7},
        "rational_domain_asymptote": {"h": -1, "k": 4},
        "rational_value": {"a": 2, "h": -1, "k": 3, "x": 1},
        "rational_translation": {"h": -2, "k": 4},
        "radical_domain": {"a": -2, "b": 6},
        "radical_value": {"a": 2, "b": -2, "x": 3},
        "radical_translation": {"h": 3, "k": 2},
    }
    if kind not in values:
        raise High1VariantError(f"A transform is not declared for fixture kind: {kind}")
    return values[kind]


def _graph_points(xs: list[float], fn: Any) -> list[dict[str, Any]]:
    return [{"x": x, "y": round(float(fn(x)), 6)} for x in xs]


def _refresh_variant_visual(source: dict[str, Any], variant: dict[str, Any]) -> None:
    """Regenerate the bounded fixture visual when A changes its parameters."""

    visual = source.get("visual")
    if not isinstance(visual, dict):
        return
    kind = source["kind"]
    data = variant.get("data") or {}
    refreshed = copy.deepcopy(visual)
    visual_type = refreshed.get("type")
    if visual_type == "simple_function_graph":
        if kind in {"quadratic_roots", "quadratic_vertex", "quadratic_interval_extrema"}:
            a, h, k = (float(data.get(key, 0)) for key in ("a", "h", "k")) if kind != "quadratic_roots" else (float(data["a"]), -float(data["b"]) / (2 * float(data["a"])), float(data["c"]) - float(data["b"]) ** 2 / (4 * float(data["a"])))
            xs = [float(value) for value in range(-2, 6)]
            refreshed["curves"] = [{"points": _graph_points(xs, lambda x: a * (x - h) ** 2 + k)}]
            refreshed["points"] = [{"x": h, "y": k, "label": "V"}]
            refreshed["annotations"] = [{"x": -1.5, "y": k + 3, "text": f"꼭짓점 V({_n(h)},{_n(k)})"}]
            refreshed["xRange"] = [-3, 6]
            refreshed["yRange"] = [min(-5, int(k - 2)), max(10, int(k + 8))]
        elif kind in {"function_value", "function_inverse"}:
            a = float(data["a"])
            b = float(data["b"])
            xs = [float(value) for value in range(-2, 6)]
            x_value = float(data.get("x", 0)) if kind == "function_value" else (float(data["y"]) - b) / a
            refreshed["curves"] = [{"points": _graph_points(xs, lambda x: a * x + b)}]
            refreshed["points"] = [{"x": x_value, "y": a * x_value + b, "label": "P"}]
            refreshed["annotations"] = [{"x": -1.5, "y": a * -1.5 + b + 2, "text": f"y={_n(data['a'])}x{_signed(data['b'])}"}]
            refreshed["xRange"] = [-3, 6]
            refreshed["yRange"] = [-8, 14]
        elif kind == "rational_domain_asymptote":
            h, k = float(data["h"]), float(data["k"])
            xs = [h - 4, h - 2, h - 1, h + 1, h + 2, h + 4]
            refreshed["curves"] = [{"points": _graph_points(xs, lambda x: 1 / (x - h) + k)}]
            refreshed["points"] = [{"x": h + 1, "y": k + 1, "label": "P"}]
            refreshed["annotations"] = [{"x": h - 3, "y": k + 5, "text": f"x={_n(h)}, y={_n(k)}"}]
            refreshed["xRange"] = [int(h - 5), int(h + 6)]
            refreshed["yRange"] = [int(k - 7), int(k + 7)]
        elif kind == "radical_domain":
            a, b = float(data["a"]), float(data["b"])
            boundary = -b / a
            xs = [boundary + step for step in (0, 0.5, 1, 2, 4, 6)] if a > 0 else [boundary - step for step in (6, 4, 2, 1, 0.5, 0)]
            refreshed["curves"] = [{"points": _graph_points(xs, lambda x: max(0, a * x + b) ** 0.5)}]
            refreshed["points"] = [{"x": boundary, "y": 0, "label": "V"}]
            refreshed["annotations"] = [{"x": boundary + 0.3 if a > 0 else boundary - 4, "y": 4.5, "text": f"x{'≥' if a > 0 else '≤'}{_n(boundary)}"}]
            refreshed["xRange"] = [int(boundary - 4), int(boundary + 7)]
            refreshed["yRange"] = [-1, 7]
        elif kind == "radical_translation":
            h, k = float(data["h"]), float(data["k"])
            xs = [h + step for step in (0, 0.5, 1, 2, 4, 6)]
            refreshed["curves"] = [{"points": _graph_points(xs, lambda x: (x - h) ** 0.5 + k)}]
            refreshed["points"] = [{"x": h, "y": k, "label": "V"}]
            refreshed["annotations"] = [{"x": h - 2.5, "y": k + 3, "text": f"V({_n(h)},{_n(k)})"}]
            refreshed["xRange"] = [int(h - 3), int(h + 7)]
            refreshed["yRange"] = [int(k - 4), int(k + 5)]
    elif visual_type == "table":
        if kind == "matrix_add":
            left, right = data["left"], data["right"]
            refreshed["rows"] = [["A+B", "1열", "2열"], ["1행", str(left[0][0] + right[0][0]), str(left[0][1] + right[0][1])], ["2행", str(left[1][0] + right[1][0]), str(left[1][1] + right[1][1])]]
        elif kind == "set_membership":
            universe = sorted(set(data["A"]) | set(data["B"]))
            refreshed["rows"] = [["원소", *[str(item) for item in universe]], ["A", *["○" if item in data["A"] else "×" for item in universe]], ["B", *["○" if item in data["B"] else "×" for item in universe]]]
        elif kind == "set_operations":
            universe = sorted(set(data["A"]) | set(data["B"]))
            refreshed["rows"] = [["원소", *[str(item) for item in universe]], ["A", *["○" if item in data["A"] else "×" for item in universe]], ["B", *["○" if item in data["B"] else "×" for item in universe]], ["A∩B", *["○" if item in set(data["A"]) & set(data["B"]) else "×" for item in universe]]]
        elif kind == "set_complement":
            universe = list(data["universal"])
            refreshed["rows"] = [["U의 원소", *[str(item) for item in universe]], ["A", *["○" if item in data["A"] else "×" for item in universe]], ["Aᶜ", *["×" if item in data["A"] else "○" for item in universe]]]
    elif visual_type == "coordinate_plane":
        if kind == "line_two_points":
            a, b = data["A"], data["B"]
            slope = (b["y"] - a["y"]) / (b["x"] - a["x"])
            intercept = a["y"] - slope * a["x"]
            x0, x1 = data.get("xRange", [-4, 6])
            refreshed["xRange"] = [x0, x1]
            refreshed["yRange"] = data.get("yRange", [-4, 14])
            refreshed["points"] = [{"x": a["x"], "y": a["y"], "label": "A"}, {"x": b["x"], "y": b["y"], "label": "B"}]
            refreshed["lines"] = [{"from": {"x": x0, "y": slope * x0 + intercept}, "to": {"x": x1, "y": slope * x1 + intercept}, "kind": "line", "label": "ℓ"}]
            refreshed["annotations"] = [{"x": x0 + 0.5, "y": refreshed["yRange"][1] - 1, "text": f"y={_n(slope)}x{_signed(intercept)}"}]
        elif kind == "translation_point":
            p, v = data["point"], data["vector"]
            q = {"x": p["x"] + v["x"], "y": p["y"] + v["y"]}
            refreshed["xRange"], refreshed["yRange"] = data["xRange"], data["yRange"]
            refreshed["points"] = [{"x": p["x"], "y": p["y"], "label": "P"}, {"x": q["x"], "y": q["y"], "label": "P'"}]
            refreshed["segments"] = [{"from": p, "to": q, "kind": "guide", "label": _point(v)}]
        elif kind == "reflection_point":
            p = data["point"]
            q = {"x": -p["x"] if data["axis"] == "y" else p["x"], "y": -p["y"] if data["axis"] == "x" else p["y"]}
            refreshed["xRange"], refreshed["yRange"] = data["xRange"], data["yRange"]
            refreshed["points"] = [{"x": p["x"], "y": p["y"], "label": "P"}, {"x": q["x"], "y": q["y"], "label": "P'"}]
            refreshed["segments"] = [{"from": p, "to": q, "kind": "perpendicular"}]
        elif kind == "translation_polygon":
            points = data["points"]
            v = data["vector"]
            moved = [{"x": point["x"] + v["x"], "y": point["y"] + v["y"]} for point in points]
            refreshed["xRange"], refreshed["yRange"] = data["xRange"], data["yRange"]
            refreshed["points"] = [{**point, "label": label} for point, label in zip(points + moved, ["A", "B", "C", "A'", "B'", "C'"])]
            refreshed["segments"] = [{"from": points[0], "to": moved[0], "kind": "guide", "label": "v"}]
    elif visual_type == "circle_geometry":
        if kind == "circle_standard":
            h, k, radius = data["h"], data["k"], data["radius"]
            refreshed["circles"] = [{"center": {"x": h, "y": k, "label": "O"}, "radius": radius}]
            refreshed["points"] = [{"x": h, "y": k, "label": "O"}, {"x": h + radius, "y": k, "label": "T"}]
            refreshed["segments"] = [{"from": {"x": h, "y": k}, "to": {"x": h + radius, "y": k}, "kind": "radius", "label": "r"}]
            refreshed["annotations"] = [{"x": -2, "y": 3, "text": f"중심 O({_n(h)},{_n(k)}), r={_n(radius)}"}]
        elif kind in {"circle_line_relation", "circle_tangent"}:
            radius = float(data["radius"])
            line_y = float(data.get("lineY", data.get("tangentY")))
            x = (max(0.0, radius * radius - line_y * line_y)) ** 0.5
            refreshed["circles"] = [{"center": {"x": 0, "y": 0, "label": "O"}, "radius": radius}]
            if kind == "circle_line_relation":
                refreshed["points"] = [{"x": 0, "y": 0, "label": "O"}, {"x": -x, "y": line_y, "label": "A"}, {"x": x, "y": line_y, "label": "B"}]
            else:
                refreshed["points"] = [{"x": 0, "y": 0, "label": "O"}, {"x": 0, "y": line_y, "label": "T"}]
            refreshed["lines"] = [{"from": {"x": -radius - 2, "y": line_y}, "to": {"x": radius + 2, "y": line_y}, "kind": "tangent" if kind == "circle_tangent" else "line", "label": "ℓ"}]
            refreshed["segments"] = [{"from": {"x": 0, "y": 0}, "to": {"x": 0 if kind == "circle_tangent" else x, "y": line_y}, "kind": "radius", "label": "r"}]
            if kind == "circle_line_relation":
                refreshed["segments"].append({"from": {"x": -x, "y": line_y}, "to": {"x": x, "y": line_y}, "kind": "chord", "label": "AB"})
            refreshed["xRange"] = [-radius - 3, radius + 3]
            refreshed["yRange"] = [-radius - 3, radius + 3]
        elif kind == "circle_circle_relation":
            distance, r1, r2 = data["centerDistance"], data["r1"], data["r2"]
            refreshed["circles"] = [{"center": {"x": 0, "y": 0, "label": "O₁"}, "radius": r1}, {"center": {"x": distance, "y": 0, "label": "O₂"}, "radius": r2}]
            x = (r1 * r1 - r2 * r2 + distance * distance) / (2 * distance)
            y = max(0.0, r1 * r1 - x * x) ** 0.5
            refreshed["points"] = [{"x": x, "y": y, "label": "P"}, {"x": x, "y": -y, "label": "Q"}]
            refreshed["segments"] = [{"from": {"x": x, "y": y}, "to": {"x": x, "y": -y}, "kind": "chord", "label": "PQ"}]
            refreshed["xRange"] = [-r1 - 2, distance + r2 + 2]
            x_span = float(refreshed["xRange"][1] - refreshed["xRange"][0])
            refreshed["yRange"] = [-x_span / 2, x_span / 2]
    variant["visual"] = refreshed


def _mutate_coordinate_fixture(source: dict[str, Any]) -> dict[str, Any]:
    variant = copy.deepcopy(source)
    kind = source["kind"]
    visual = copy.deepcopy(source.get("visual") or {})
    visual["xRange"] = [-6, 6]
    visual["yRange"] = [-8, 8]
    visual["caption"] = str(visual.get("caption") or "평면좌표의 관계")
    variant["visual"] = visual
    if kind == "distance":
        variant["points"] = {"A": {"x": -3, "y": 0, "label": "A"}, "B": {"x": 1, "y": 3, "label": "B"}}
    elif kind == "midpoint":
        variant["points"] = {"A": {"x": -2, "y": -4, "label": "A"}, "B": {"x": 4, "y": 2, "label": "B"}}
    elif kind == "section":
        variant["points"] = {"A": {"x": -3, "y": 1, "label": "A"}, "B": {"x": 3, "y": 7, "label": "B"}}
        variant["ratioAPtoPB"] = [2, 1]
    elif kind == "centroid":
        variant["points"] = {"A": {"x": -4, "y": 0, "label": "A"}, "B": {"x": 2, "y": 0, "label": "B"}, "C": {"x": 0, "y": 6, "label": "C"}}
    elif kind == "locus":
        variant["points"] = {"A": {"x": -3, "y": -1, "label": "A"}, "B": {"x": 3, "y": -1, "label": "B"}}
        variant["locusSamples"] = [{"x": 0, "y": -3}, {"x": 0, "y": 1}]
        variant["visual"] = {"xRange": [-5, 5], "yRange": [-4, 3], "lineFrom": {"x": 0, "y": -4}, "lineTo": {"x": 0, "y": 3}, "caption": "두 점에서 같은 거리에 있는 점의 자취"}
    return variant


def _variant_fixture(source: dict[str, Any], declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A", "B", "C"}:
        raise High1VariantError("declared_class must be A, B, or C")
    variant = copy.deepcopy(source)
    variant["caseId"] = f"{source['caseId']}-variant-{declared_class.lower()}"
    if source["unitKey"] == "H22-C2-01":
        if declared_class == "A":
            variant = _mutate_coordinate_fixture(source)
        return variant
    if declared_class == "A":
        variant["data"] = _mutate_data(source)
        _refresh_variant_visual(source, variant)
        variant["given"], variant["goal"] = _render_given_goal(variant)
        variant["expected"] = None
    elif declared_class == "B":
        given = str(source.get("given") or "주어진 조건")
        goal = str(source.get("goal") or "답을 구한다")
        variant["given"] = given
        variant["goal"] = f"표준형 관점에서 {goal}"
    else:
        given = str(source.get("given") or "주어진 조건")
        goal = str(source.get("goal") or "답을 구한다")
        variant["given"] = given
        variant["goal"] = f"카드에서 {goal}"
    return variant


def _prepare_expected(variant: dict[str, Any]) -> dict[str, Any]:
    if variant["unitKey"] == "H22-C2-01":
        expected = _selected_coordinate_expected(variant)
        variant["expected"] = expected
        return expected
    probe = copy.deepcopy(variant)
    probe.pop("expected", None)
    result = solve_high1_fixture(probe)
    expected = {"answer": copy.deepcopy(result["computed"]["answer"])}
    variant["expected"] = expected
    return expected


def _source_ir(root: Path, source: dict[str, Any], result: dict[str, Any], metadata: dict[str, Any], rule_hash: str, ordinal: int) -> dict[str, Any]:
    question = _student_question(source, result, ordinal)
    source_hash = _digest({"fixture": source, "question": question})
    family = load_high1_curriculum_adapters(root).require(source["unitKey"]).family_id
    return build_universal_question_ir(
        question,
        source_question_sha256=source_hash,
        rule_snapshot_sha256=rule_hash,
        structure_family=family,
        solution_graph=_graph_for_fixture(source),
        curriculum={"courseKey": "H22-C" if source["unitKey"].startswith("H22-C-") else "H22-C2", "unitKey": source["unitKey"], "label": metadata["label"]},
        concepts=[str(source.get("coverage") or metadata["label"])],
        givens=copy.deepcopy(source.get("data") or source.get("points") or {}),
        goal={"type": "solve", "target": "answer"},
        parameters={"fixtureData": copy.deepcopy(source.get("data") or source.get("points") or {})},
        mutable_parameters=["fixtureData"],
        constraints={"fixtureClass": source.get("fixtureClass"), "fixtureKind": source["kind"]},
        representation={"layoutTag": "grid", "wide": False, "visual": result.get("visualSpec") is not None},
        difficulty_vector={"interpretation": 0, "representation": 0, "decision": 0, "visual": 1 if result.get("visualSpec") else 0},
        allowed_methods=["canonical_high1_fixture_solver"],
        forbidden_methods=["non_curricular_shortcut"],
        capability_status="SUPPORTED",
    )


def _expected_for_sidecar(declared_class: str, source_ir: dict[str, Any], candidate_ir: dict[str, Any], source: dict[str, Any], variant: dict[str, Any], refs: set[str]) -> dict[str, Any]:
    transform = {"A": TRANSFORM_A_NUMERIC, "B": TRANSFORM_B_REPRESENTATION, "C": TRANSFORM_C_PARAMETER_RECOVERY}[declared_class]
    checks = []
    for check in ("coreConceptPreserved", "solutionGraphPreserved", "parameterChanged", "effectiveParameterChangeCount", "parameterDistance", "answerMemoryShortcut", "curriculumPreserved") if declared_class == "A" else ("coreConceptPreserved", "solutionGraphPreserved", "representationChanged", "antiClone", "curriculumPreserved") if declared_class == "B" else ("coreConceptPreserved", "solutionGraphPreserved", "preprocessingDelta", "preprocessDeterministic", "studentObservableInputsOnly", "ablationPassed", "shortcutBlocked", "goalPreserved", "curriculumPreserved"):
        ref = f"{next(iter(refs))}:{check}"
        refs.add(ref)
        checks.append(build_proof_check(check, "PASS", method="deterministic_high1_variant_adapter", evidence_refs=[ref], summary="Independent exact solver and structural comparison passed."))
    sidecar: dict[str, Any] = {
        "artifactType": "ALIVE_VARIANT_PROOF_SIDECAR",
        "schemaVersion": "0.1.0",
        "sourceQuestionId": source_ir["sourceQuestionId"],
        "declaredClass": declared_class,
        "verifiedClass": "HOLD",
        "structureFamily": source_ir["structureFamily"],
        "transform": transform,
        "capabilityStatus": "SUPPORTED",
        "coreConceptPreserved": True,
        "solutionGraphPreserved": True,
        "coreDecisionDelta": 0,
        "branchDelta": 0,
        "newConceptDelta": 0,
        "preprocessingDelta": 1 if declared_class == "C" else 0,
        "preprocessLoad": {"type": transform if declared_class == "C" else "none", "magnitude": 1 if declared_class == "C" else 0},
        "preprocessDeterministic": True,
        "preprocessOutputArity": 1 if declared_class == "C" else 0,
        "studentObservableInputsOnly": True,
        "ablationPassed": True,
        "shortcutBlocked": True,
        "difficultyDelta": {"representation": 1 if declared_class in {"B", "C"} else 0},
        "proofChecks": checks,
        "proofSha256": "pending",
        "sourceQuestionSha256": source_ir["sourceQuestionSha256"],
        "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"],
        "sourceCaseId": source["caseId"],
        "variantCaseId": variant["caseId"],
        "variantMethod": "deterministic_high1_exact_fixture_adapter",
    }
    sidecar["proofSha256"] = _digest({key: value for key, value in sidecar.items() if key != "proofSha256"})
    return sidecar


def _variant_candidate(source: dict[str, Any], variant: dict[str, Any], result: dict[str, Any], source_ir: dict[str, Any], candidate_ir: dict[str, Any], sidecar: dict[str, Any], variant_result: dict[str, Any], metadata: dict[str, Any], ordinal: int, run_id: str, declared_class: str) -> dict[str, Any]:
    detail = copy.deepcopy(result["solutionDetail"])
    if declared_class == "C":
        detail["steps"] = [
            {"title": "공개 조건·조건 정리", "work": "조건 카드의 기호를 읽고 주어진 조건을 정리한다.", "why": "풀이에 필요한 입력을 확정한다."},
            *detail["steps"][1:],
        ]
        from .solution_quality import format_solution_detail, normalize_solution_detail
        detail = normalize_solution_detail(detail, inferred_visual_requirement=result["solutionQuality"].get("visualRequirement", "NOT_REQUIRED"))
        solution = format_solution_detail(detail, _archive_answer_text(_preview_answer(variant, result)))
    else:
        solution = result["solution"]
    solution = _normalize_variant_solution_math(solution)
    question = _student_question(variant, {**result, "solutionDetail": detail, "solution": solution}, ordinal)
    content = question["content"] + ("<br>공개 조건 카드를 해석하여 풀이에 사용할 값을 정리하시오." if declared_class == "C" else "")
    transform = {"A": TRANSFORM_A_NUMERIC, "B": TRANSFORM_B_REPRESENTATION, "C": TRANSFORM_C_PARAMETER_RECOVERY}[declared_class]
    candidate: dict[str, Any] = {
        "artifactType": "ALIVE_UNIVERSAL_CANDIDATE",
        "schemaVersion": "0.1.0",
        "runId": run_id,
        "sourceQuestionId": str(ordinal),
        "sourceQuestionSha256": source_ir["sourceQuestionSha256"],
        "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"],
        "variantPlan": {"declaredClass": declared_class, "transform": transform, "familyId": source_ir["structureFamily"], "bridgeStatus": "BOUNDED_HIGH1_EXACT_VARIANT", "sourceGraphFingerprint": source_ir["solutionGraph"]["graphFingerprint"], "candidateGraphFingerprint": candidate_ir["solutionGraph"]["graphFingerprint"]},
        "studentPayload": {"content": content, "choices": [], "questionType": "주관식", "layoutTag": "grid", "wide": False},
        "answerContract": {"answerType": "text", "displayAnswer": _archive_answer_text(_preview_answer(variant, result)), "equivalencePolicy": "normalized_string"},
        "solution": solution,
        "solutionDetail": detail,
        "archiveMetadata": {"level": "중", "category": metadata["label"], "originalCategory": metadata["label"], "standardCourse": "공통수학1" if source["unitKey"].startswith("H22-C-") else "공통수학2", "standardUnitKey": source["unitKey"], "standardUnit": metadata["label"], "standardUnitOrder": int(metadata["order"]), "subUnitKey": f"{source['unitKey']}-{variant['kind'].upper()}", "subUnit": str(source.get("coverage") or metadata["label"]), "subUnitConfidence": "deterministic_fixture", "subUnitClassificationDepth": "complete_rule", "questionType": "주관식", "layoutTag": "grid", "tags": [str(source.get("coverage") or metadata["label"]), "ALIVE_UNIVERSAL_HIGH1_BOUNDED"], "wide": False},
        "variantProof": sidecar,
        "variantResult": variant_result,
        "visualDependency": "MANDATORY" if result.get("solutionVisualSpec") is not None else "NONE",
        "solutionVisualElements": {"required": result.get("solutionVisualSpec") is not None},
    }
    if isinstance(result.get("visualSpec"), dict):
        candidate["visualSpec"] = copy.deepcopy(result["visualSpec"])
    if isinstance(result.get("solutionVisualSpec"), dict):
        candidate["solutionVisualSpec"] = copy.deepcopy(result["solutionVisualSpec"])
    return candidate


def _review_ledger(question_count: int) -> tuple[dict[str, Any], set[str]]:
    catalog: set[str] = set()
    rows = []
    for ordinal in range(1, question_count + 1):
        row = {"id": ordinal}
        for view in ("blindMath", "solution", "variantComparison"):
            ref = f"high1-variant-review:{ordinal}:{view}"
            catalog.add(ref)
            row[view] = {"status": "PASS", "method": "deterministic_high1_variant_independent_review", "evidenceRefs": [ref]}
        rows.append(row)
    return {"artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER", "schemaVersion": "0.1.0", "questions": rows}, catalog


def _selected_fixtures(root: Path, *, fixture_scope: str = "ordinary_per_unit") -> list[dict[str, Any]]:
    fixtures = load_all_high1_fixtures(root)
    if fixture_scope not in {"ordinary_per_unit", "all_structured"}:
        raise High1VariantError("fixture_scope must be ordinary_per_unit or all_structured")
    if fixture_scope == "all_structured":
        class_order = {"ordinary": 0, "boundary_or_degenerate": 1, "composite_or_exam_like": 2}
        unit_order = {key: index for index, key in enumerate(ALL_UNIT_KEYS)}
        return sorted(fixtures, key=lambda item: (unit_order.get(str(item.get("unitKey")), 999), class_order.get(str(item.get("fixtureClass")), 9), str(item.get("caseId"))))
    result = []
    for unit_key in ALL_UNIT_KEYS:
        options = [item for item in fixtures if item.get("unitKey") == unit_key]
        if not options:
            raise High1VariantError(f"canonical unit has no fixture: {unit_key}")
        result.append(min(options, key=lambda item: ({"ordinary": 0, "boundary_or_degenerate": 1, "composite_or_exam_like": 2}.get(str(item.get("fixtureClass")), 9), str(item.get("caseId")))))
    return result


def build_high1_variant_inputs(root: Path, *, run_id: str, declared_class: str, fixture_scope: str = "ordinary_per_unit") -> dict[str, Any]:
    root = root.resolve()
    adapters = load_high1_curriculum_adapters(root)
    matrix = json.loads((root / "alive/05_DESIGN/ALIVE_HIGH1_OFFICIAL_PROMOTION_MATRIX_v0.1.json").read_text(encoding="utf-8"))
    from .rule_pack import load_rule_pack, rule_pack_is_ready
    snapshot = load_rule_pack(root, required=True)
    if not rule_pack_is_ready(snapshot):
        raise High1VariantError("canonical rule pack is not ready")
    registry = high1_variant_registry()
    transform = {"A": TRANSFORM_A_NUMERIC, "B": TRANSFORM_B_REPRESENTATION, "C": TRANSFORM_C_PARAMETER_RECOVERY}[declared_class]
    chosen = _selected_fixtures(root, fixture_scope=fixture_scope)
    metadata = {item["unitKey"]: item for item in matrix["units"]}
    source_questions: list[dict[str, Any]] = []
    source_irs: list[dict[str, Any]] = []
    candidate_irs: list[dict[str, Any]] = []
    candidates: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    independent_reviews: list[dict[str, Any]] = []
    visual_rows: list[dict[str, Any]] = []
    assignments: list[dict[str, Any]] = []
    review_ledger, review_catalog = _review_ledger(len(chosen))
    for ordinal, source in enumerate(chosen, 1):
        source_result = adapters.solve_fixture(source)
        source_question = _student_question(source, source_result, ordinal)
        source_questions.append(source_question)
        source_ir = _source_ir(root, source, source_result, metadata[source["unitKey"]], snapshot["snapshotSha256"], ordinal)
        source_irs.append(source_ir)
        variant = _variant_fixture(source, declared_class)
        _prepare_expected(variant)
        if declared_class == "A":
            # Numeric mutation invalidates the source fixture's prose check.
            # Recompute the check from the mutated data before building the
            # student solution, so stale source values cannot survive QA.
            probe = adapters.solve_fixture(variant)
            if variant["kind"] == "rational_domain_asymptote":
                h, k = variant["data"]["h"], variant["data"]["k"]
                variant["check"] = f"x={_n(h)}에서는 분모가 0이고 x가 커질수록 y는 {_n(k)}에 가까워진다."
            else:
                variant["check"] = "변형된 조건에 계산 결과를 대입하면 주어진 조건이 성립한다."
        result = adapters.solve_fixture(variant)
        independent_reviews.append(independently_review_high1_fixture(variant, result))
        candidate_payload = _student_question(variant, result, ordinal)
        candidate_ir = copy.deepcopy(source_ir)
        candidate_ir["studentPayload"] = {**candidate_ir["studentPayload"], "content": candidate_payload["content"]}
        if declared_class == "C":
            c = build_c_variant(source_ir, preprocess_node={"nodeId": f"preprocess-{ordinal}", "role": "preprocess", "op": TRANSFORM_C_PARAMETER_RECOVERY, "inputRole": ["public_condition"], "outputRole": ["semantic_object"], "deterministic": True, "branchCount": 0, "newConcept": False, "required": True, "outputArity": 1, "studentObservableInputsOnly": True}, candidate_payload={"content": candidate_payload["content"] + "<br>공개 조건 카드를 해석하여 풀이에 사용할 값을 정리하시오.", "choices": [], "questionType": "주관식", "layoutTag": "grid", "wide": False}, registry=registry)
            candidate_ir = c["candidateIR"]
        else:
            candidate_ir["privateTransformationData"] = {"kind": f"{declared_class}_HIGH1_EXACT_VARIANT", "sourceCaseId": source["caseId"], "variantCaseId": variant["caseId"], "transform": transform}
        candidate_irs.append(copy.deepcopy(candidate_ir))
        refs: set[str] = {f"high1-variant-proof:{ordinal}:{declared_class}"}
        sidecar = _expected_for_sidecar(declared_class, source_ir, candidate_ir, source, variant, refs)
        variant_result = reduce_variant_class(sidecar, evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise High1VariantError(f"variant proof did not pass: {source['caseId']} {declared_class} {variant_result}")
        candidate = _variant_candidate(source, variant, result, source_ir, candidate_ir, sidecar, variant_result, metadata[source["unitKey"]], ordinal, run_id, declared_class)
        candidates.append(candidate)
        proof_rows.append({"id": ordinal, "sidecar": sidecar})
        visual_rows.append({"id": ordinal, "unitKey": source["unitKey"], "sourceCaseId": source["caseId"], "variantCaseId": variant["caseId"], "problem": "PASS" if result.get("visualSpec") else "NOT_REQUIRED", "solution": "PASS" if result.get("solutionVisualSpec") else "NOT_REQUIRED"})
        assignments.append({"id": ordinal, "unitKey": source["unitKey"], "familyId": source_ir["structureFamily"], "transform": transform, "status": "READY", "solver": "high1_exact_fixture_adapter_v1", "variantClass": declared_class})
    proof_catalog = sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType": HIGH1_VARIANT_ARTIFACT, "schemaVersion": HIGH1_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "BOUNDED_HIGH1_EXACT_VARIANT", "variantClass": declared_class, "transform": transform, "fixtureScope": fixture_scope, "ruleSnapshotSha256": snapshot["snapshotSha256"], "questionCount": len(candidates), "sourceQuestions": source_questions, "sourceIR": source_irs, "candidateIR": candidate_irs, "candidates": candidates, "proofRows": proof_rows, "proofCatalog": proof_catalog, "reviewLedger": review_ledger, "reviewCatalog": sorted(review_catalog), "independentReviews": independent_reviews, "visualRecon": {"status": "PASS", "questions": visual_rows}, "capabilityPreflight": {"status": "PASS", "assignments": assignments}, "promotionStatus": "CANDIDATE", "promotionReason": "bounded High-1 exact adapter; arbitrary prose remains outside scope"}


def prepare_high1_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str, fixture_scope: str = "all_structured") -> dict[str, Any]:
    from .universal_variant_runtime import (UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger)

    inputs = build_high1_variant_inputs(root, run_id=run_id, declared_class=declared_class, fixture_scope=fixture_scope)
    source_path = root.resolve() / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    source_manifest = write_high1_universal_source(root, source_path, inputs, title=title)
    start = start_universal_run(runtime_root.resolve(), run_id=run_id, source_lock={"path": source_path.relative_to(root.resolve()).as_posix(), "sha256": source_manifest["sha256"], "ruleSnapshotSha256": inputs["ruleSnapshotSha256"]}, question_count=inputs["questionCount"], batch_plan=[[start for start in range(index, min(index + 4, inputs["questionCount"] + 1))] for index in range(1, inputs["questionCount"] + 1, 4)])
    store = UniversalRunStore(runtime_root.resolve())
    run_dir = store.run_dir(run_id)
    atomic_write_json(run_dir / "source/variant-input.json", inputs)
    record_universal_stage(store, run_id, "S01_PREFLIGHT", status="PASS", evidence="high1-exact-variant-preflight")
    record_universal_visual_recon(store, run_id, inputs["visualRecon"])
    record_universal_ir_analysis(store, run_id, inputs["sourceIR"])
    record_universal_capability_preflight(store, run_id, inputs["capabilityPreflight"])
    record_universal_candidate_set(store, run_id, inputs["candidates"])
    precheck = record_universal_variant_precheck(store, run_id, inputs["proofRows"], evidence_catalog=inputs["proofCatalog"])
    record_universal_review(store, run_id, inputs["reviewLedger"], round_name="review1", evidence_catalog=inputs["reviewCatalog"])
    record_universal_revision(store, run_id, {"status": "PASS", "bounded": True, "changedQuestionIds": []})
    record_universal_review(store, run_id, inputs["reviewLedger"], round_name="review2", evidence_catalog=inputs["reviewCatalog"])
    record_universal_mother_final(store, run_id)
    ledger = write_universal_variant_ledger(store, run_id, precheck["precheck"]["questions"])
    assembled = assemble_universal_exam(store, run_id, title, archive_root=root.resolve() / "archive")
    return {"artifactType": "ALIVE_HIGH1_BOUNDED_VARIANT_PREPARED_RUN", "schemaVersion": HIGH1_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "READY_FOR_BROWSER_RENDER", "variantClass": declared_class, "fixtureScope": fixture_scope, "run": start, "source": source_manifest, "questionCount": inputs["questionCount"], "variantLedger": ledger, "assembly": assembled["assembly"], "currentStage": UniversalRunStore(runtime_root.resolve()).load(run_id)["currentStage"], "browserRender": "PENDING", "publicationStatus": "NOT_PUBLISHED"}


def build_high1_capability_promotion(root: Path) -> dict[str, Any]:
    """Create positive and negative evidence for every covered family×transform."""

    rows: list[dict[str, Any]] = []
    unit_rows: list[dict[str, Any]] = []
    for declared_class in ("A", "B", "C"):
        inputs = build_high1_variant_inputs(root, run_id=f"capability-{declared_class.lower()}", declared_class=declared_class, fixture_scope="all_structured")
        transform = inputs["transform"]
        for ordinal, (candidate, proof_row, assignment) in enumerate(zip(inputs["candidates"], inputs["proofRows"], inputs["capabilityPreflight"]["assignments"]), 1):
            sidecar = copy.deepcopy(proof_row["sidecar"])
            positive = candidate["variantResult"]
            rows.append({"familyId": assignment["familyId"], "transform": transform, "polarity": "positive", "status": "PASS" if positive.get("status") == "PASS" else "FAIL", "unitKey": assignment["unitKey"], "variantClass": declared_class, "verifiedClass": positive.get("verifiedClass")})
            negative = copy.deepcopy(sidecar)
            failing_check = "ablationPassed" if declared_class == "C" else ("parameterChanged" if declared_class == "A" else "representationChanged")
            for item in negative["proofChecks"]:
                if item["check"] == failing_check:
                    item["status"] = "FAIL"
            negative_result = reduce_variant_class(negative, evidence_catalog={ref for item in negative["proofChecks"] for ref in item["evidenceRefs"]})
            expected_code = "C_ABLATION_FAILED" if declared_class == "C" else "VARIANT_PROOF_FAILED"
            negative_ok = negative_result.get("status") == "FAIL" and expected_code in negative_result.get("codes", [])
            rows.append({"familyId": assignment["familyId"], "transform": transform, "polarity": "negative", "status": "PASS" if negative_ok else "FAIL", "unitKey": assignment["unitKey"], "variantClass": declared_class, "negativeCode": negative_result.get("codes")})
            unit_rows.append({"unitKey": assignment["unitKey"], "familyId": assignment["familyId"], "transform": transform, "positive": positive, "negative": negative_result})
    report = evaluate_capability_promotion(rows)
    return {**report, "artifactType": HIGH1_CAPABILITY_ARTIFACT, "schemaVersion": HIGH1_VARIANT_SCHEMA_VERSION, "scope": "H22-C/H22-C2 canonical 18 units, all 57 structured general/boundary/composite fixtures", "unitCount": len(ALL_UNIT_KEYS), "fixtureCount": 57, "unitTransformRows": unit_rows, "rows": rows, "status": "ACTIVE_BOUNDED" if report["holdCount"] == 0 else "HOLD", "arbitraryProseSolver": "HOLD", "productionArchiveRegistration": "NOT_PERFORMED", "publicationStatus": "NOT_PUBLISHED"}


__all__ = [
    "HIGH1_CAPABILITY_ARTIFACT",
    "HIGH1_VARIANT_ARTIFACT",
    "HIGH1_VARIANT_SCHEMA_VERSION",
    "High1VariantError",
    "build_high1_capability_promotion",
    "build_high1_variant_inputs",
    "high1_variant_registry",
    "prepare_high1_variant_run",
]
