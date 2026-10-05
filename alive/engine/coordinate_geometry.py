from __future__ import annotations

"""Deterministic first vertical slice for H22-C2-01 평면좌표.

This module owns arithmetic and VisualSpec construction for a bounded set of
coordinate-geometry cases.  It is a unit benchmark, not a production
capability switch: browser evidence and student-solution review remain open.
"""

import copy
import json
import math
from fractions import Fraction
from pathlib import Path
from typing import Any

from .run_store import atomic_write_json, sha256_file
from .solution_quality import (
    build_solution_quality_report,
    format_solution_detail,
    normalize_solution_detail,
)
from .visual_renderer import render_visual_spec


UNIT_KEY = "H22-C2-01"
BENCHMARK_SCHEMA_VERSION = "0.1.0"
FIXTURES_RELATIVE_PATH = Path("alive/engine/fixtures_h22_c2_01_coordinate_plane.json")
_EPSILON = 1e-8


class CoordinateGeometryError(ValueError):
    pass


def _number(value: Any, name: str) -> float:
    if not isinstance(value, (int, float)) or isinstance(value, bool) or not math.isfinite(value):
        raise CoordinateGeometryError(f"{name} must be a finite number")
    return float(value)


def _point(value: Any, name: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise CoordinateGeometryError(f"{name} must be an object")
    point = {"x": _number(value.get("x"), f"{name}.x"), "y": _number(value.get("y"), f"{name}.y")}
    if value.get("label") is not None:
        if not isinstance(value["label"], str) or not value["label"].strip():
            raise CoordinateGeometryError(f"{name}.label must be a non-empty string")
        point["label"] = value["label"]
    return point


def _range(value: Any, name: str) -> list[float]:
    if not isinstance(value, list) or len(value) != 2:
        raise CoordinateGeometryError(f"{name} must contain two numbers")
    low, high = _number(value[0], f"{name}[0]"), _number(value[1], f"{name}[1]")
    if low >= high:
        raise CoordinateGeometryError(f"{name} must be strictly increasing")
    return [low, high]


def _fmt(value: float) -> str:
    if abs(value) < 5e-10:
        value = 0.0
    if float(value).is_integer():
        return str(int(value))
    fraction = Fraction(str(value)).limit_denominator(1000)
    if abs(float(fraction) - float(value)) < 1e-9 and fraction.denominator != 1:
        return f"{fraction.numerator}/{fraction.denominator}"
    rendered = f"{value:.6f}".rstrip("0").rstrip(".")
    return rendered or "0"


def _close(actual: float, expected: float, name: str) -> None:
    tolerance = 1e-7 * max(1.0, abs(actual), abs(expected))
    if abs(actual - expected) > tolerance:
        raise CoordinateGeometryError(f"{name} mismatch: {actual} != {expected}")


def _point_close(actual: dict[str, Any], expected: dict[str, Any], name: str) -> None:
    _close(actual["x"], _number(expected.get("x"), f"{name}.x"), f"{name}.x")
    _close(actual["y"], _number(expected.get("y"), f"{name}.y"), f"{name}.y")


def distance(a: dict[str, Any], b: dict[str, Any]) -> float:
    ax, ay = _number(a.get("x"), "A.x"), _number(a.get("y"), "A.y")
    bx, by = _number(b.get("x"), "B.x"), _number(b.get("y"), "B.y")
    value = math.hypot(bx - ax, by - ay)
    if value <= _EPSILON:
        raise CoordinateGeometryError("distance requires two distinct points")
    return value


def midpoint(a: dict[str, Any], b: dict[str, Any]) -> dict[str, float]:
    return {
        "x": (_number(a.get("x"), "A.x") + _number(b.get("x"), "B.x")) / 2,
        "y": (_number(a.get("y"), "A.y") + _number(b.get("y"), "B.y")) / 2,
    }


def section_point(a: dict[str, Any], b: dict[str, Any], ratio_ap_to_pb: list[Any]) -> dict[str, float]:
    if not isinstance(ratio_ap_to_pb, list) or len(ratio_ap_to_pb) != 2:
        raise CoordinateGeometryError("ratioAPtoPB must contain two numbers")
    m, n = _number(ratio_ap_to_pb[0], "ratioAPtoPB[0]"), _number(ratio_ap_to_pb[1], "ratioAPtoPB[1]")
    if m <= 0 or n <= 0:
        raise CoordinateGeometryError("section ratio parts must be positive")
    ax, ay = _number(a.get("x"), "A.x"), _number(a.get("y"), "A.y")
    bx, by = _number(b.get("x"), "B.x"), _number(b.get("y"), "B.y")
    denominator = m + n
    return {"x": (n * ax + m * bx) / denominator, "y": (n * ay + m * by) / denominator}


def centroid(a: dict[str, Any], b: dict[str, Any], c: dict[str, Any]) -> dict[str, float]:
    return {
        "x": (_number(a.get("x"), "A.x") + _number(b.get("x"), "B.x") + _number(c.get("x"), "C.x")) / 3,
        "y": (_number(a.get("y"), "A.y") + _number(b.get("y"), "B.y") + _number(c.get("y"), "C.y")) / 3,
    }


def equal_distance_locus(a: dict[str, Any], b: dict[str, Any]) -> dict[str, float]:
    ax, ay = _number(a.get("x"), "A.x"), _number(a.get("y"), "A.y")
    bx, by = _number(b.get("x"), "B.x"), _number(b.get("y"), "B.y")
    if math.hypot(bx - ax, by - ay) <= _EPSILON:
        raise CoordinateGeometryError("equal-distance locus requires two distinct fixed points")
    return {"a": 2 * (bx - ax), "b": 2 * (by - ay), "c": bx * bx + by * by - ax * ax - ay * ay}


def _line_residual(equation: dict[str, float], point: dict[str, Any]) -> float:
    return equation["a"] * _number(point.get("x"), "point.x") + equation["b"] * _number(point.get("y"), "point.y") - equation["c"]


def _base_visual(case: dict[str, Any]) -> dict[str, Any]:
    visual = case.get("visual")
    if not isinstance(visual, dict):
        raise CoordinateGeometryError("visual configuration is required")
    x_range, y_range = _range(visual.get("xRange"), "visual.xRange"), _range(visual.get("yRange"), "visual.yRange")
    return {
        "version": "0.1",
        "type": "coordinate_plane",
        "title": case.get("title", "평면좌표"),
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


def _inside(point: dict[str, Any], visual: dict[str, Any], name: str) -> None:
    if not visual["xRange"][0] <= point["x"] <= visual["xRange"][1] or not visual["yRange"][0] <= point["y"] <= visual["yRange"][1]:
        raise CoordinateGeometryError(f"{name} is outside the visual coordinate range")


def _add_points(spec: dict[str, Any], points: list[dict[str, Any]], visual: dict[str, Any]) -> None:
    for index, point in enumerate(points):
        normalized = _point(point, f"visual.points[{index}]")
        _inside(normalized, spec, f"visual.points[{index}]")
        spec["points"].append(normalized)


def _add_annotation(spec: dict[str, Any], text: str) -> None:
    spec["annotations"].append({"x": spec["xRange"][0] + 0.25, "y": spec["yRange"][1] - 0.25, "text": text})


def build_visual_spec(case: dict[str, Any], computed: dict[str, Any]) -> dict[str, Any]:
    spec = _base_visual(case)
    points = case["points"]
    normalized_points = {name: _point(value, f"points.{name}") for name, value in points.items()}
    for name, point in normalized_points.items():
        _inside(point, spec, f"points.{name}")

    kind = case["kind"]
    if kind == "distance":
        a, b = normalized_points["A"], normalized_points["B"]
        spec["points"] = [a, b]
        spec["segments"] = [{"from": a, "to": b, "kind": "segment", "label": "AB"}]
        _add_annotation(spec, f"d(A,B)={_fmt(computed['distance'])}")
    elif kind == "midpoint":
        a, b = normalized_points["A"], normalized_points["B"]
        m = {"x": computed["point"]["x"], "y": computed["point"]["y"], "label": "M"}
        _inside(m, spec, "computed midpoint")
        spec["points"] = [a, b, m]
        spec["segments"] = [{"from": a, "to": b, "kind": "segment", "label": "AB"}]
        _add_annotation(spec, f"M=({_fmt(m['x'])},{_fmt(m['y'])})")
    elif kind == "section":
        a, b = normalized_points["A"], normalized_points["B"]
        p = {"x": computed["point"]["x"], "y": computed["point"]["y"], "label": "P"}
        _inside(p, spec, "computed section point")
        spec["points"] = [a, p, b]
        spec["segments"] = [
            {"from": a, "to": p, "kind": "segment", "label": "AP"},
            {"from": p, "to": b, "kind": "segment", "label": "PB"},
        ]
        _add_annotation(spec, f"P=({_fmt(p['x'])},{_fmt(p['y'])})")
    elif kind == "centroid":
        a, b, c = normalized_points["A"], normalized_points["B"], normalized_points["C"]
        g = {"x": computed["point"]["x"], "y": computed["point"]["y"], "label": "G"}
        _inside(g, spec, "computed centroid")
        spec["points"] = [a, b, c, g]
        spec["segments"] = [
            {"from": a, "to": b, "kind": "segment", "label": "AB"},
            {"from": b, "to": c, "kind": "segment", "label": "BC"},
            {"from": c, "to": a, "kind": "segment", "label": "CA"},
            {"from": a, "to": g, "kind": "guide", "label": "AG"},
        ]
        _add_annotation(spec, f"G=({_fmt(g['x'])},{_fmt(g['y'])})")
    elif kind == "locus":
        samples = [_point(item, f"locusSamples[{index}]") for index, item in enumerate(case.get("locusSamples", []))]
        for index, point in enumerate(samples):
            _inside(point, spec, f"locusSamples[{index}]")
        visual = case["visual"]
        line_from = _point(visual.get("lineFrom"), "visual.lineFrom")
        line_to = _point(visual.get("lineTo"), "visual.lineTo")
        _inside(line_from, spec, "visual.lineFrom")
        _inside(line_to, spec, "visual.lineTo")
        spec["points"] = [normalized_points["A"], normalized_points["B"], *samples]
        spec["lines"] = [{"from": line_from, "to": line_to, "kind": "guide", "label": "자취"}]
        equation = computed["equation"]
        _add_annotation(spec, f"{_fmt(equation['a'])}x+{_fmt(equation['b'])}y={_fmt(equation['c'])}")
    else:
        raise CoordinateGeometryError(f"unsupported coordinate case kind: {kind}")
    caption = case.get("visual", {}).get("caption")
    if not isinstance(caption, str) or not caption.strip():
        raise CoordinateGeometryError("visual.caption must be a non-empty string")
    spec["annotations"].insert(0, {"x": spec["xRange"][0] + 0.25, "y": spec["yRange"][1] - 0.85, "text": caption})
    return spec


def _point_text(point: dict[str, Any]) -> str:
    return f"({ _fmt(float(point['x'])) }, { _fmt(float(point['y'])) })"


def build_coordinate_solution_detail(case: dict[str, Any], computed: dict[str, Any]) -> dict[str, Any]:
    """Build a deterministic, student-facing explanation for the slice.

    This is deliberately separate from the mathematical result.  The result
    proves the value; this contract explains why each transformation is valid
    and gives the renderer/reviewer a stable walkthrough to inspect.
    """

    kind = case["kind"]
    points = case["points"]
    if kind == "distance":
        a, b = points["A"], points["B"]
        dx = float(b["x"]) - float(a["x"])
        dy = float(b["y"]) - float(a["y"])
        value = computed["distance"]
        given = f"A{_point_text(a)}, B{_point_text(b)}가 주어져 있다."
        goal = "두 점 A, B 사이의 거리를 구한다."
        key_idea = "두 점을 대각선으로 하는 직각삼각형의 가로·세로 길이에 피타고라스 정리를 적용한다."
        concept = "좌표평면에서 거리 공식은 √((x₂-x₁)²+(y₂-y₁)²)이다. 좌표의 차이는 부호와 관계없이 제곱되어 길이가 된다."
        steps = [
            {"title": "좌표의 차이 계산", "work": f"Δx={_fmt(dx)}, Δy={_fmt(dy)}", "why": "A에서 B로 이동할 때 가로와 세로로 변한 양을 각각 구한다."},
            {"title": "거리 공식에 대입", "work": f"AB=√(({_fmt(dx)})²+({_fmt(dy)})²)=√({_fmt(dx*dx+dy*dy)})", "why": "가로·세로 변화량이 만드는 직각삼각형에 피타고라스 정리를 적용한다."},
            {"title": "근호 계산", "work": f"AB={_fmt(value)}", "why": "거리이므로 음수가 될 수 없으며 양의 제곱근을 선택한다."},
        ]
        check = f"계산한 거리 {_fmt(value)}를 제곱하면 {_fmt(value * value)}이고, (Δx)²+(Δy)²={_fmt(dx*dx+dy*dy)}로 일치한다."
        mistakes = ["x좌표끼리, y좌표끼리 대응시키지 않고 더하는 것", "거리에서 제곱근을 빠뜨리거나 음의 제곱근을 선택하는 것"]
        purpose = "점 A와 B를 잇는 선분과 거리 계산의 관계를 확인한다."
    elif kind == "midpoint":
        a, b = points["A"], points["B"]
        point = computed["point"]
        given = f"A{_point_text(a)}, B{_point_text(b)}가 선분의 양 끝점이다."
        goal = "선분 AB의 중점 M의 좌표를 구한다."
        key_idea = "중점은 두 끝점의 좌표를 각각 평균한 점이다."
        concept = "M이 AB의 중점이면 AM=MB이므로 x좌표와 y좌표 모두 양 끝점 좌표의 산술평균이 된다."
        steps = [
            {"title": "x좌표 평균", "work": f"x_M=({_fmt(float(a['x']))}+{_fmt(float(b['x']))})/2={_fmt(point['x'])}", "why": "중점은 수평 방향에서도 두 끝점의 정확한 가운데에 있어야 한다."},
            {"title": "y좌표 평균", "work": f"y_M=({_fmt(float(a['y']))}+{_fmt(float(b['y']))})/2={_fmt(point['y'])}", "why": "수직 방향 좌표도 같은 방식으로 평균을 취한다."},
            {"title": "좌표 정리", "work": f"M={_point_text(point)}", "why": "두 좌표를 함께 써서 중점의 위치를 완성한다."},
        ]
        check = f"M에서 A와 B까지의 좌표 차이는 각각 절댓값이 같으므로 AM=MB가 성립한다."
        mistakes = ["x좌표만 평균하고 y좌표를 그대로 두는 것", "두 좌표의 차이를 2로 나누는 것으로 중점 좌표를 잘못 구하는 것"]
        purpose = "끝점 A, B와 그 사이의 중점 M의 관계를 확인한다."
    elif kind == "section":
        a, b = points["A"], points["B"]
        point = computed["point"]
        m, n = case["ratioAPtoPB"]
        m_value, n_value = int(m) if float(m).is_integer() else m, int(n) if float(n).is_integer() else n
        given = f"A{_point_text(a)}, B{_point_text(b)}이고 AP:PB={m_value}:{n_value}이다."
        goal = "선분 AB를 AP:PB의 비로 내분하는 점 P의 좌표를 구한다."
        key_idea = "내분점은 반대편 끝점의 비를 가중치로 사용한다. P=(nA+mB)/(m+n)이다."
        concept = "AP:PB=m:n이면 P는 A에서 B 쪽으로 m/(m+n)만큼 간 점이므로, A에는 n, B에는 m을 곱해 평균한다."
        steps = [
            {"title": "내분 공식 확인", "work": f"P=(({n_value})A+({m_value})B)/({m_value+n_value})", "why": "A에서 가까운 정도와 반대쪽 끝점의 가중치가 서로 반대가 되는 내분 공식이다."},
            {"title": "좌표 대입", "work": f"x_P=({_fmt(n*float(a['x']))}+{_fmt(m*float(b['x']))})/{_fmt(float(m)+float(n))}={_fmt(point['x'])}, y_P=({_fmt(n*float(a['y']))}+{_fmt(m*float(b['y']))})/{_fmt(float(m)+float(n))}={_fmt(point['y'])}", "why": "x좌표와 y좌표에 같은 내분 비율을 적용한다."},
            {"title": "좌표 정리", "work": f"P={_point_text(point)}", "why": "두 좌표를 묶어 내분점의 위치를 나타낸다."},
        ]
        check = "P가 선분 AB 위에 있고, AP:PB가 주어진 비와 같은지 좌표 차이의 절댓값으로 확인한다."
        mistakes = ["AP:PB=m:n에서 A와 B의 가중치를 같은 쪽에 곱하는 것", "내분비의 순서를 PB:AP로 뒤집는 것"]
        purpose = "선분 AB 위에서 내분점 P가 놓이는 위치와 비율을 확인한다."
    elif kind == "centroid":
        a, b, c = points["A"], points["B"], points["C"]
        point = computed["point"]
        given = f"삼각형의 세 꼭짓점이 A{_point_text(a)}, B{_point_text(b)}, C{_point_text(c)}이다."
        goal = "삼각형 ABC의 무게중심 G의 좌표를 구한다."
        key_idea = "무게중심은 세 꼭짓점 좌표를 각각 더해 3으로 나눈 점이다."
        concept = "세 중선은 한 점에서 만나며, 그 교점의 좌표는 세 꼭짓점 좌표의 산술평균으로 계산된다."
        steps = [
            {"title": "x좌표 평균", "work": f"x_G=({_fmt(float(a['x']))}+{_fmt(float(b['x']))}+{_fmt(float(c['x']))})/3={_fmt(point['x'])}", "why": "세 꼭짓점의 수평 위치를 평균하면 무게중심의 x좌표가 된다."},
            {"title": "y좌표 평균", "work": f"y_G=({_fmt(float(a['y']))}+{_fmt(float(b['y']))}+{_fmt(float(c['y']))})/3={_fmt(point['y'])}", "why": "세 꼭짓점의 수직 위치에도 같은 평균 원리를 적용한다."},
            {"title": "무게중심 정리", "work": f"G={_point_text(point)}", "why": "x좌표와 y좌표를 함께 정리하면 무게중심이 결정된다."},
        ]
        check = "G를 한 꼭짓점과 대변의 중점을 연결한 중선 위에 대입하면, 두 방향 좌표가 모두 일치한다."
        mistakes = ["세 좌표의 합을 2로 나누는 것", "x좌표와 y좌표의 평균 대상을 섞는 것"]
        purpose = "삼각형의 꼭짓점과 무게중심의 좌표 관계를 확인한다."
    else:
        a, b = points["A"], points["B"]
        equation = computed["equation"]
        given = f"두 점 A{_point_text(a)}, B{_point_text(b)}가 주어져 있다."
        goal = "A와 B에서 같은 거리에 있는 점의 자취 방정식을 구한다."
        key_idea = "임의의 점 P(x,y)에 대해 PA²=PB²를 세우고 정리한다."
        concept = "거리가 같다는 조건은 양변을 제곱해도 동치이며, 제곱하면 근호 없이 일차식으로 정리할 수 있다."
        equation_text = f"{_fmt(equation['a'])}x+{_fmt(equation['b'])}y={_fmt(equation['c'])}"
        steps = [
            {"title": "거리 조건 세우기", "work": "PA²=PB²", "why": "P가 두 고정점에서 같은 거리에 있다는 자취의 정의를 식으로 옮긴다."},
            {"title": "좌표 대입과 정리", "work": f"(x-{_fmt(float(a['x']))})²+(y-{_fmt(float(a['y']))})²=(x-{_fmt(float(b['x']))})²+(y-{_fmt(float(b['y']))})²", "why": "거리 공식의 제곱 형태를 사용하면 양변의 x², y²가 소거되어 직선식이 된다."},
            {"title": "자취 방정식", "work": equation_text, "why": "정리된 식을 만족하는 모든 점이 두 점에서 같은 거리에 있는 점이다."},
        ]
        check = "자취 위의 표본점들을 식에 대입하면 모두 등식이 성립하고, 두 점까지의 거리도 같다."
        mistakes = ["PA=PB를 좌표 차이의 부호까지 같다고 해석하는 것", "거리 제곱식을 전개할 때 상수항의 부호를 바꾸는 것"]
        purpose = "두 점에서 같은 거리에 있다는 조건이 수직이등분선으로 바뀌는 과정을 보여준다."
    return {
        "version": "0.1",
        "audience": "student",
        "depth": "detailed",
        "given": given,
        "goal": goal,
        "keyIdea": key_idea,
        "conceptNote": concept,
        "steps": steps,
        "check": check,
        "commonMistakes": mistakes,
        "diagramRequirement": "RECOMMENDED",
        "diagramPurpose": purpose,
    }


def build_coordinate_solution_visual_spec(case: dict[str, Any], computed: dict[str, Any]) -> dict[str, Any]:
    """Create a solution-role diagram without copying a source image."""

    spec = build_visual_spec(case, computed)
    spec["title"] = f"{case.get('title', '평면좌표')} · 해설"
    if case["kind"] == "locus":
        spec["annotations"].append({
            "x": spec["xRange"][0] + 0.25,
            "y": spec["yRange"][0] + 0.35,
            "text": "PA=PB",
        })
    return spec


def _solution_answer_text(case: dict[str, Any], computed: dict[str, Any]) -> str:
    if case["kind"] == "distance":
        return f"따라서 AB={_fmt(computed['distance'])}이다."
    if case["kind"] in {"midpoint", "section", "centroid"}:
        return f"따라서 답은 {_point_text(computed['point'])}이다."
    equation = computed["equation"]
    return f"따라서 자취의 방정식은 {_fmt(equation['a'])}x+{_fmt(equation['b'])}y={_fmt(equation['c'])}이다."


def solve_coordinate_case(case: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(case, dict) or case.get("unitKey") != UNIT_KEY:
        raise CoordinateGeometryError(f"coordinate case must use unitKey {UNIT_KEY}")
    case_id = case.get("caseId")
    kind = case.get("kind")
    if not isinstance(case_id, str) or not case_id.strip():
        raise CoordinateGeometryError("caseId must be a non-empty string")
    if kind not in {"distance", "midpoint", "section", "centroid", "locus"}:
        raise CoordinateGeometryError(f"unsupported coordinate case kind: {kind}")
    points = case.get("points")
    if not isinstance(points, dict):
        raise CoordinateGeometryError("points must be an object")
    normalized = {name: _point(value, f"points.{name}") for name, value in points.items()}
    expected = case.get("expected")
    if not isinstance(expected, dict):
        raise CoordinateGeometryError("expected must be an object")

    if kind == "distance":
        computed = {"distance": distance(normalized["A"], normalized["B"])}
        _close(computed["distance"], _number(expected.get("distance"), "expected.distance"), "distance")
        checks = {"distanceFormula": "PASS", "expectedValue": "PASS"}
    elif kind == "midpoint":
        computed = {"point": midpoint(normalized["A"], normalized["B"])}
        _point_close(computed["point"], expected.get("point"), "midpoint")
        checks = {"midpointFormula": "PASS", "expectedPoint": "PASS"}
    elif kind == "section":
        computed = {"point": section_point(normalized["A"], normalized["B"], case.get("ratioAPtoPB"))}
        _point_close(computed["point"], expected.get("point"), "sectionPoint")
        checks = {"sectionFormula": "PASS", "ratio": "PASS", "expectedPoint": "PASS"}
    elif kind == "centroid":
        computed = {"point": centroid(normalized["A"], normalized["B"], normalized["C"])}
        _point_close(computed["point"], expected.get("point"), "centroid")
        checks = {"centroidFormula": "PASS", "expectedPoint": "PASS"}
    else:
        equation = equal_distance_locus(normalized["A"], normalized["B"])
        declared = expected.get("equation")
        if not isinstance(declared, dict):
            raise CoordinateGeometryError("expected.equation must be an object")
        for key in ("a", "b", "c"):
            _close(equation[key], _number(declared.get(key), f"expected.equation.{key}"), f"locus equation {key}")
        samples = case.get("locusSamples")
        if not isinstance(samples, list) or not samples:
            raise CoordinateGeometryError("locusSamples must contain at least one point")
        for index, sample in enumerate(samples):
            point = _point(sample, f"locusSamples[{index}]")
            if abs(_line_residual(equation, point)) > 1e-7 * max(1.0, abs(equation["a"]), abs(equation["b"]), abs(equation["c"])):
                raise CoordinateGeometryError(f"locusSamples[{index}] is not on the equal-distance locus")
        computed = {"equation": equation, "sampleCount": len(samples)}
        checks = {"equalDistanceEquation": "PASS", "samplePoints": "PASS", "expectedEquation": "PASS"}

    visual_spec = build_visual_spec(case, computed)
    solution_detail = normalize_solution_detail(
        build_coordinate_solution_detail(case, computed),
        inferred_visual_requirement="RECOMMENDED",
    )
    solution_visual_spec = build_coordinate_solution_visual_spec(case, computed)
    solution_text = format_solution_detail(
        solution_detail,
        _solution_answer_text(case, computed),
    )
    solution_quality = build_solution_quality_report(
        solution_detail,
        inferred_visual_requirement="RECOMMENDED",
        has_solution_visual=True,
    )
    return {
        "caseId": case_id,
        "unitKey": UNIT_KEY,
        "kind": kind,
        "coverage": case.get("coverage"),
        "computed": computed,
        "checks": checks,
        "visualSpec": visual_spec,
        "solution": solution_text,
        "solutionDetail": solution_detail,
        "solutionVisualSpec": solution_visual_spec,
        "solutionQuality": solution_quality,
    }


def load_coordinate_fixtures(root: Path) -> list[dict[str, Any]]:
    path = root / FIXTURES_RELATIVE_PATH
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise CoordinateGeometryError(f"coordinate fixtures cannot be read: {path}") from error
    if not isinstance(data, list) or not data:
        raise CoordinateGeometryError("coordinate fixtures must be a non-empty array")
    return copy.deepcopy(data)


def run_coordinate_fixture_benchmark(root: Path, output_root: Path, repeats: int = 3) -> dict[str, Any]:
    if not isinstance(repeats, int) or not 1 <= repeats <= 10:
        raise CoordinateGeometryError("repeats must be an integer from 1 through 10")
    cases = load_coordinate_fixtures(root)
    output_root = output_root.resolve()
    output_root.mkdir(parents=True, exist_ok=True)
    by_case: dict[str, list[dict[str, Any]]] = {case["caseId"]: [] for case in cases}
    repetition_reports: list[dict[str, Any]] = []

    for repetition in range(1, repeats + 1):
        run_dir = output_root / f"run-{repetition:03d}"
        run_dir.mkdir(parents=True, exist_ok=True)
        case_reports: list[dict[str, Any]] = []
        for case in cases:
            case_dir = run_dir / case["caseId"]
            case_dir.mkdir(parents=True, exist_ok=True)
            atomic_write_json(case_dir / "fixture.json", case)
            report: dict[str, Any] = {
                "schemaVersion": BENCHMARK_SCHEMA_VERSION,
                "artifactType": "ALIVE_H22_C2_01_COORDINATE_CASE_REPORT",
                "caseId": case["caseId"],
                "unitKey": UNIT_KEY,
                "mode": "EXPERIMENTAL_UNIT_ONLY",
                "browserRender": "NOT_RUN",
            }
            try:
                result = solve_coordinate_case(case)
                math_report = {
                    "schemaVersion": BENCHMARK_SCHEMA_VERSION,
                    "artifactType": "ALIVE_H22_C2_01_COORDINATE_MATH_REPORT",
                    "caseId": result["caseId"],
                    "unitKey": UNIT_KEY,
                    "kind": result["kind"],
                    "coverage": result["coverage"],
                    "computed": result["computed"],
                    "checks": result["checks"],
                    "status": "PASS",
                }
                atomic_write_json(case_dir / "math-report.json", math_report)
                atomic_write_json(case_dir / "visual-spec.json", result["visualSpec"])
                atomic_write_json(case_dir / "solution-detail.json", result["solutionDetail"])
                atomic_write_json(case_dir / "solution-visual-spec.json", result["solutionVisualSpec"])
                svg = render_visual_spec(result["visualSpec"])
                if svg != render_visual_spec(copy.deepcopy(result["visualSpec"])):
                    raise CoordinateGeometryError("coordinate visual renderer is nondeterministic")
                asset = case_dir / "visual.svg"
                asset.write_text(svg, encoding="utf-8", newline="\n")
                solution_svg = render_visual_spec(result["solutionVisualSpec"])
                if solution_svg != render_visual_spec(copy.deepcopy(result["solutionVisualSpec"])):
                    raise CoordinateGeometryError("coordinate solution visual renderer is nondeterministic")
                solution_asset = case_dir / "solution.svg"
                solution_asset.write_text(solution_svg, encoding="utf-8", newline="\n")
                report.update(
                    {
                        "status": "PASS_STRUCTURAL",
                        "mathValidation": "PASS",
                        "visualValidation": "PASS_STRUCTURAL_ONLY",
                        "deterministicRerender": "PASS",
                        "mathReportSha256": sha256_file(case_dir / "math-report.json"),
                        "specSha256": sha256_file(case_dir / "visual-spec.json"),
                        "assetSha256": sha256_file(asset),
                        "solutionSpecSha256": sha256_file(case_dir / "solution-visual-spec.json"),
                        "solutionAssetSha256": sha256_file(solution_asset),
                        "solutionDetailSha256": sha256_file(case_dir / "solution-detail.json"),
                        "solutionQuality": result["solutionQuality"],
                        "solutionValidation": "PASS",
                        "productionCapability": "UNCHANGED",
                    }
                )
            except (OSError, ValueError, CoordinateGeometryError) as error:
                report.update({"status": "FAIL", "error": str(error)})
            atomic_write_json(case_dir / "benchmark-report.json", report)
            case_reports.append(report)
            by_case[case["caseId"]].append(report)
        repetition_reports.append(
            {
                "repetition": repetition,
                "status": "PASS_STRUCTURAL" if all(item["status"] == "PASS_STRUCTURAL" for item in case_reports) else "FAIL",
                "cases": case_reports,
            }
        )

    deterministic_cases: dict[str, dict[str, Any]] = {}
    for case_id, reports in by_case.items():
        assets = [item.get("assetSha256") for item in reports]
        specs = [item.get("specSha256") for item in reports]
        math_reports = [item.get("mathReportSha256") for item in reports]
        deterministic_cases[case_id] = {
            "assetHashesEqual": len(set(assets)) == 1 and None not in assets,
            "specHashesEqual": len(set(specs)) == 1 and None not in specs,
            "mathReportHashesEqual": len(set(math_reports)) == 1 and None not in math_reports,
        }
    all_pass = all(item["status"] == "PASS_STRUCTURAL" for item in repetition_reports)
    all_deterministic = all(
        item["assetHashesEqual"] and item["specHashesEqual"] and item["mathReportHashesEqual"]
        for item in deterministic_cases.values()
    )
    summary = {
        "schemaVersion": BENCHMARK_SCHEMA_VERSION,
        "artifactType": "ALIVE_H22_C2_01_COORDINATE_BENCHMARK_REPORT",
        "mode": "EXPERIMENTAL_UNIT_ONLY",
        "unitKey": UNIT_KEY,
        "fixtureCount": len(cases),
        "repetitions": repeats,
        "mathematicalValidation": "PASS" if all_pass else "FAIL",
        "visualValidation": "PASS_STRUCTURAL_ONLY" if all_pass else "FAIL",
        "solutionValidation": "PASS" if all_pass else "FAIL",
        "determinism": {"status": "PASS" if all_deterministic else "FAIL", "cases": deterministic_cases},
        "browserRender": "NOT_RUN",
        "overallStatus": "PASS_WITH_MANUAL_BROWSER_GATE" if all_pass and all_deterministic else "FAIL",
        "productionCapability": "UNCHANGED",
        "repetitionReports": repetition_reports,
    }
    atomic_write_json(output_root / "summary.json", summary)
    return summary
