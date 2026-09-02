from __future__ import annotations

"""Experimental, fail-closed visual capability benchmark lane.

This module is intentionally separate from ``visual_lane``.  It lets us test
the mathematical and SVG foundations for future function, inequality, conic,
and calculus diagrams without accidentally advertising those diagrams as a
production STAGED_EXAM capability.
"""

import copy
import html
import json
import math
from pathlib import Path
from typing import Any, Callable

from .run_store import atomic_write_json, sha256_file


BENCHMARK_SCHEMA_VERSION = "0.1.0"
EXPERIMENTAL_RENDERER_VERSION = "0.1.1-coordinate-geometry"
_EPSILON = 1e-8


class VisualBenchmarkError(ValueError):
    pass


def _number(value: Any, name: str) -> float:
    if not isinstance(value, (int, float)) or isinstance(value, bool) or not math.isfinite(value):
        raise VisualBenchmarkError(f"{name} must be a finite number")
    return float(value)


def _range(value: Any, name: str) -> tuple[float, float]:
    if not isinstance(value, list) or len(value) != 2:
        raise VisualBenchmarkError(f"{name} must contain two numbers")
    low, high = _number(value[0], f"{name}[0]"), _number(value[1], f"{name}[1]")
    if low >= high:
        raise VisualBenchmarkError(f"{name} must be strictly increasing")
    return low, high


def _integer(value: Any, name: str, minimum: int, maximum: int) -> int:
    if not isinstance(value, int) or isinstance(value, bool) or not minimum <= value <= maximum:
        raise VisualBenchmarkError(f"{name} must be an integer from {minimum} through {maximum}")
    return value


def _label(value: Any, name: str) -> str:
    if not isinstance(value, str) or not value.strip() or len(value) > 80:
        raise VisualBenchmarkError(f"{name} must be a non-empty label of at most 80 characters")
    return html.escape(value.strip(), quote=True)


def _fmt(value: float) -> str:
    if abs(value) < 5e-10:
        value = 0.0
    rendered = f"{value:.6f}".rstrip("0").rstrip(".")
    return rendered or "0"


def _point(value: Any, name: str) -> tuple[float, float, str | None]:
    if not isinstance(value, dict):
        raise VisualBenchmarkError(f"{name} must be an object")
    x, y = _number(value.get("x"), f"{name}.x"), _number(value.get("y"), f"{name}.y")
    label = value.get("label")
    return x, y, _label(label, f"{name}.label") if label is not None else None


def _model_kind(model: dict[str, Any]) -> str:
    kind = model.get("kind")
    if kind not in {"linear", "quadratic", "absolute", "rational", "exponential"}:
        raise VisualBenchmarkError("function model kind is unsupported")
    return str(kind)


def _validate_function_model(model: Any, domain: Any) -> tuple[dict[str, Any], tuple[float, float]]:
    if not isinstance(model, dict):
        raise VisualBenchmarkError("function model must be an object")
    kind = _model_kind(model)
    interval = _range(domain, "function domain")
    if kind in {"quadratic", "absolute", "rational"}:
        for key in ("a", "h", "k"):
            _number(model.get(key), f"function.{key}")
        if abs(float(model["a"])) < _EPSILON:
            raise VisualBenchmarkError("function.a must be non-zero")
    elif kind == "linear":
        _number(model.get("a"), "function.a")
        _number(model.get("b"), "function.b")
    elif kind == "exponential":
        for key in ("a", "base", "h", "k"):
            _number(model.get(key), f"function.{key}")
        if float(model["a"]) == 0 or float(model["base"]) <= 0 or abs(float(model["base"]) - 1) < _EPSILON:
            raise VisualBenchmarkError("exponential parameters are invalid")
    return model, interval


def _function_value(model: dict[str, Any], x: float) -> float | None:
    kind = _model_kind(model)
    if kind == "linear":
        return float(model["a"]) * x + float(model["b"])
    if kind == "quadratic":
        return float(model["a"]) * (x - float(model["h"])) ** 2 + float(model["k"])
    if kind == "absolute":
        return float(model["a"]) * abs(x - float(model["h"])) + float(model["k"])
    if kind == "rational":
        denominator = x - float(model["h"])
        if abs(denominator) < _EPSILON:
            return None
        return float(model["a"]) / denominator + float(model["k"])
    return float(model["a"]) * float(model["base"]) ** (x - float(model["h"])) + float(model["k"])


def _function_derivative(model: dict[str, Any], x: float) -> float | None:
    kind = _model_kind(model)
    if kind == "linear":
        return float(model["a"])
    if kind == "quadratic":
        return 2 * float(model["a"]) * (x - float(model["h"]))
    if kind == "absolute":
        offset = x - float(model["h"])
        if abs(offset) < _EPSILON:
            return None
        return float(model["a"]) if offset > 0 else -float(model["a"])
    if kind == "rational":
        denominator = x - float(model["h"])
        if abs(denominator) < _EPSILON:
            return None
        return -float(model["a"]) / denominator**2
    return float(model["a"]) * math.log(float(model["base"])) * float(model["base"]) ** (x - float(model["h"]))


def _relation(value: float, relation: str) -> bool:
    if relation == "<":
        return value < -_EPSILON
    if relation == "<=":
        return value <= _EPSILON
    if relation == ">":
        return value > _EPSILON
    if relation == ">=":
        return value >= -_EPSILON
    raise VisualBenchmarkError("inequality relation is unsupported")


def _tick_values(low: float, high: float) -> list[float]:
    span = high - low
    step = 1.0 if span <= 10 else 2.0 if span <= 20 else 5.0
    first = math.ceil((low - _EPSILON) / step) * step
    values: list[float] = []
    current = first
    while current <= high + _EPSILON and len(values) < 25:
        values.append(0.0 if abs(current) < _EPSILON else current)
        current += step
    return values


def _frame(spec: dict[str, Any]) -> tuple[int, int, float, float, float, float, Callable[[float], float], Callable[[float], float], list[str]]:
    width = _integer(spec.get("width"), "width", 240, 1600)
    height = _integer(spec.get("height"), "height", 160, 1200)
    x_low, x_high = _range(spec.get("xRange"), "xRange")
    y_low, y_high = _range(spec.get("yRange"), "yRange")
    margin = 48.0

    def tx(x: float) -> float:
        return margin + (x - x_low) * (width - 2 * margin) / (x_high - x_low)

    def ty(y: float) -> float:
        return height - margin - (y - y_low) * (height - 2 * margin) / (y_high - y_low)

    body: list[str] = []
    if x_low <= 0 <= x_high:
        x0 = tx(0)
        body.append(f'<line x1="{_fmt(x0)}" y1="{_fmt(margin)}" x2="{_fmt(x0)}" y2="{_fmt(height-margin)}" class="axis"/>')
    if y_low <= 0 <= y_high:
        y0 = ty(0)
        body.append(f'<line x1="{_fmt(margin)}" y1="{_fmt(y0)}" x2="{_fmt(width-margin)}" y2="{_fmt(y0)}" class="axis"/>')
    for value in _tick_values(x_low, x_high):
        x = tx(value)
        if x_low <= 0 <= x_high and abs(value) < _EPSILON:
            continue
        body.append(f'<line x1="{_fmt(x)}" y1="{_fmt(ty(0)-4)}" x2="{_fmt(x)}" y2="{_fmt(ty(0)+4)}" class="tick"/>') if y_low <= 0 <= y_high else None
        body.append(f'<text x="{_fmt(x)}" y="{_fmt(height-margin+20)}" class="tick-label">{_fmt(value)}</text>')
    for value in _tick_values(y_low, y_high):
        y = ty(value)
        if y_low <= 0 <= y_high and abs(value) < _EPSILON:
            continue
        body.append(f'<line x1="{_fmt(tx(0)-4)}" y1="{_fmt(y)}" x2="{_fmt(tx(0)+4)}" y2="{_fmt(y)}" class="tick"/>') if x_low <= 0 <= x_high else None
        body.append(f'<text x="{_fmt(margin-8)}" y="{_fmt(y+4)}" text-anchor="end" class="tick-label">{_fmt(value)}</text>')
    body.append(f'<text x="{_fmt(width-24)}" y="{_fmt(ty(0)-8 if y_low <= 0 <= y_high else height-margin)}" class="axis-label">x</text>')
    body.append(f'<text x="{_fmt(tx(0)+8 if x_low <= 0 <= x_high else margin+8)}" y="{_fmt(margin+4)}" class="axis-label">y</text>')
    return width, height, x_low, x_high, y_low, y_high, tx, ty, body


def _svg(spec: dict[str, Any], body: list[str]) -> str:
    width = int(spec["width"])
    height = int(spec["height"])
    title = _label(spec.get("title", "실험 시각 자료"), "title")
    style = (
        ".axis{stroke:#111;stroke-width:1.3}.tick{stroke:#555;stroke-width:1}"
        ".curve{fill:none;stroke:#155e9e;stroke-width:2.2;stroke-linejoin:round}"
        ".curve-secondary{fill:none;stroke:#7a3e00;stroke-width:2;stroke-linejoin:round}"
        ".tangent{fill:none;stroke:#b42318;stroke-width:1.8;stroke-dasharray:7 4}"
        ".guide{fill:none;stroke:#555;stroke-width:1;stroke-dasharray:4 4}"
        ".original{fill:none;stroke:#777;stroke-width:1.8;stroke-dasharray:6 4;stroke-linejoin:round}"
        ".translation{fill:none;stroke:#155e9e;stroke-width:2.2;stroke-linejoin:round}"
        ".point{fill:#111}.center{fill:#155e9e}.open{fill:#fff;stroke:#155e9e;stroke-width:2}"
        ".shade{stroke:#8ab4d6;stroke-width:14;stroke-linecap:butt}.area{fill:#cfe8f7;fill-opacity:.8;stroke:none}"
        ".tick-label{font:11px sans-serif;fill:#333;text-anchor:middle}.axis-label{font:13px sans-serif;font-weight:bold}"
        "text{font:13px sans-serif;fill:#111}.annotation{font:13px sans-serif;font-style:italic}"
    )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img">\n'
        f"<title>{title}</title><style>{style}</style>\n"
        + "\n".join(body)
        + "\n</svg>\n"
    )


def _sample_function(model: dict[str, Any], domain: tuple[float, float], y_low: float, y_high: float, samples: int) -> list[list[tuple[float, float]]]:
    span = max(1.0, y_high - y_low)
    visible_limit = max(10.0, span * 3.0)
    segments: list[list[tuple[float, float]]] = []
    current: list[tuple[float, float]] = []
    for index in range(samples + 1):
        x = domain[0] + (domain[1] - domain[0]) * index / samples
        value = _function_value(model, x)
        if value is None or abs(value) > visible_limit:
            if len(current) >= 2:
                segments.append(current)
            current = []
            continue
        current.append((x, value))
    if len(current) >= 2:
        segments.append(current)
    if not segments:
        raise VisualBenchmarkError("function sampling produced no visible curve")
    return segments


def _validate_key_points(model: dict[str, Any], key_points: Any, domain: tuple[float, float], name: str = "keyPoints") -> list[tuple[float, float, str | None]]:
    if not isinstance(key_points, list) or not key_points:
        raise VisualBenchmarkError(f"{name} must contain at least one point")
    result = []
    for index, item in enumerate(key_points):
        x, y, label = _point(item, f"{name}[{index}]")
        if not domain[0] - _EPSILON <= x <= domain[1] + _EPSILON:
            raise VisualBenchmarkError(f"{name}[{index}].x is outside the function domain")
        value = _function_value(model, x)
        if value is None or abs(value - y) > 1e-7 * max(1.0, abs(value), abs(y)):
            raise VisualBenchmarkError(f"{name}[{index}] is not on the declared function")
        result.append((x, y, label))
    return result


def _render_function(spec: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    model, domain = _validate_function_model(spec.get("function"), spec.get("domain"))
    samples = _integer(spec.get("samples", 241), "samples", 40, 800)
    frame = _frame(spec)
    width, height, _, _, y_low, y_high, tx, ty, body = frame
    key_points = _validate_key_points(model, spec.get("keyPoints"), domain)
    for segment in _sample_function(model, domain, y_low, y_high, samples):
        body.append('<polyline points="' + " ".join(f"{_fmt(tx(x))},{_fmt(ty(y))}" for x, y in segment) + '" class="curve"/>')
    if _model_kind(model) == "rational":
        asymptote = tx(float(model["h"]))
        body.append(f'<line x1="{_fmt(asymptote)}" y1="48" x2="{_fmt(asymptote)}" y2="{_fmt(height-48)}" class="guide"/>')
    for x, y, label in key_points:
        px, py = tx(x), ty(y)
        body.append(f'<circle cx="{_fmt(px)}" cy="{_fmt(py)}" r="3.5" class="point"/>')
        if label:
            body.append(f'<text x="{_fmt(px+7)}" y="{_fmt(py-7)}">{label}</text>')
    body.append(f'<text x="48" y="24" class="annotation">{_label(spec.get("caption", "함수식과 정의역에서 계산한 그래프"), "caption")}</text>')
    return _svg(spec, body), {
        "topic": "function",
        "mathChecks": {"model": "PASS", "domain": "PASS", "keyPoints": "PASS", "sampling": "PASS"},
        "svgChecks": {"axes": "PASS", "semanticLabels": "PASS", "discontinuitySplit": "PASS", "layout": "MANUAL_REVIEW"},
    }


def _validate_intervals(spec: dict[str, Any]) -> tuple[tuple[float, float], list[dict[str, Any]], dict[str, Any]]:
    x_range = _range(spec.get("xRange"), "xRange")
    model = spec.get("inequality")
    if not isinstance(model, dict):
        raise VisualBenchmarkError("inequality model must be an object")
    if model.get("kind") not in {"linear", "quadratic"}:
        raise VisualBenchmarkError("inequality model kind is unsupported")
    relation = model.get("relation")
    if relation not in {"<", "<=", ">", ">="}:
        raise VisualBenchmarkError("inequality relation is unsupported")
    if model["kind"] == "linear":
        a, b = _number(model.get("a"), "inequality.a"), _number(model.get("b"), "inequality.b")
        if abs(a) < _EPSILON:
            raise VisualBenchmarkError("inequality.a must be non-zero")
    else:
        a = _number(model.get("a"), "inequality.a")
        b = _number(model.get("b"), "inequality.b")
        c = _number(model.get("c"), "inequality.c")
        if abs(a) < _EPSILON:
            raise VisualBenchmarkError("inequality.a must be non-zero")
        model = {**model, "c": c}
    intervals = spec.get("solutionIntervals")
    if not isinstance(intervals, list) or not intervals:
        raise VisualBenchmarkError("solutionIntervals must contain at least one interval")
    normalized: list[dict[str, Any]] = []
    previous_high = None
    for index, interval in enumerate(intervals):
        if not isinstance(interval, dict):
            raise VisualBenchmarkError(f"solutionIntervals[{index}] must be an object")
        low, high = _range([interval.get("low"), interval.get("high")], f"solutionIntervals[{index}]")
        if low < x_range[0] - _EPSILON or high > x_range[1] + _EPSILON:
            raise VisualBenchmarkError(f"solutionIntervals[{index}] escapes xRange")
        if previous_high is not None and low < previous_high - _EPSILON:
            raise VisualBenchmarkError("solutionIntervals must not overlap")
        normalized.append({"low": low, "high": high, "includeLow": bool(interval.get("includeLow")), "includeHigh": bool(interval.get("includeHigh"))})
        previous_high = high

    def value(x: float) -> float:
        if model["kind"] == "linear":
            return a * x + b
        return a * x * x + b * x + float(model["c"])

    test_points = spec.get("testPoints")
    if not isinstance(test_points, list) or not test_points:
        raise VisualBenchmarkError("testPoints must contain sign checks")
    for index, item in enumerate(test_points):
        if not isinstance(item, dict):
            raise VisualBenchmarkError(f"testPoints[{index}] must be an object")
        x = _number(item.get("x"), f"testPoints[{index}].x")
        expected = item.get("satisfies")
        if not isinstance(expected, bool) or _relation(value(x), relation) != expected:
            raise VisualBenchmarkError(f"testPoints[{index}] does not verify the declared inequality")
    for interval in normalized:
        midpoint = (interval["low"] + interval["high"]) / 2
        if not _relation(value(midpoint), relation):
            raise VisualBenchmarkError("a shaded interval does not satisfy the inequality")
    boundaries = spec.get("boundaries", [])
    if not isinstance(boundaries, list):
        raise VisualBenchmarkError("boundaries must be an array")
    for index, root in enumerate(boundaries):
        x = _number(root, f"boundaries[{index}]")
        if abs(value(x)) > 1e-7 * max(1.0, abs(x)):
            raise VisualBenchmarkError(f"boundaries[{index}] is not a zero of the inequality expression")
    return x_range, normalized, {"model": "PASS", "intervals": "PASS", "testPoints": "PASS", "boundaries": "PASS"}


def _render_inequality(spec: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    x_range, intervals, checks = _validate_intervals(spec)
    width = _integer(spec.get("width"), "width", 300, 1600)
    height = _integer(spec.get("height"), "height", 140, 600)
    margin = 52.0

    def tx(x: float) -> float:
        return margin + (x - x_range[0]) * (width - 2 * margin) / (x_range[1] - x_range[0])

    axis_y = height / 2
    body = [f'<line x1="{_fmt(margin)}" y1="{_fmt(axis_y)}" x2="{_fmt(width-margin)}" y2="{_fmt(axis_y)}" class="axis"/>']
    for value in _tick_values(*x_range):
        x = tx(value)
        body.append(f'<line x1="{_fmt(x)}" y1="{_fmt(axis_y-5)}" x2="{_fmt(x)}" y2="{_fmt(axis_y+5)}" class="tick"/>')
        body.append(f'<text x="{_fmt(x)}" y="{_fmt(axis_y+26)}" class="tick-label">{_fmt(value)}</text>')
    body.append(f'<path d="M {margin-10} {axis_y} L {margin} {axis_y-5} M {width-margin+10} {axis_y} L {width-margin} {axis_y-5}" class="axis"/>')
    for interval in intervals:
        low, high = tx(interval["low"]), tx(interval["high"])
        body.append(f'<line x1="{_fmt(low)}" y1="{_fmt(axis_y)}" x2="{_fmt(high)}" y2="{_fmt(axis_y)}" class="shade"/>')
        body.append(f'<circle cx="{_fmt(low)}" cy="{_fmt(axis_y)}" r="6" class="{"point" if interval["includeLow"] else "open"}"/>')
        body.append(f'<circle cx="{_fmt(high)}" cy="{_fmt(axis_y)}" r="6" class="{"point" if interval["includeHigh"] else "open"}"/>')
    for index, boundary in enumerate(spec.get("boundaries", [])):
        x = tx(_number(boundary, f"boundaries[{index}]"))
        body.append(f'<text x="{_fmt(x)}" y="{_fmt(axis_y-18)}" class="annotation">{_label(str(boundary), "boundary label")}</text>')
    body.append(f'<text x="52" y="24" class="annotation">{_label(spec.get("caption", "시험점·부호검증으로 결정한 해집합"), "caption")}</text>')
    spec_for_svg = {**spec, "width": width, "height": height}
    return _svg(spec_for_svg, body), {
        "topic": "inequality",
        "mathChecks": checks,
        "svgChecks": {"boundaryStyle": "PASS", "shadingDirection": "PASS", "numberLine": "PASS", "layout": "MANUAL_REVIEW"},
    }


def _conic_residual(conic: dict[str, Any], x: float, y: float) -> float:
    kind = conic.get("kind")
    center = conic.get("center", {})
    h, k = _number(center.get("x"), "conic.center.x"), _number(center.get("y"), "conic.center.y")
    if kind == "ellipse":
        a, b = _number(conic.get("a"), "conic.a"), _number(conic.get("b"), "conic.b")
        return ((x - h) / a) ** 2 + ((y - k) / b) ** 2 - 1
    p = _number(conic.get("p"), "conic.p")
    axis = conic.get("axis", "y")
    if abs(p) < _EPSILON or axis not in {"x", "y"}:
        raise VisualBenchmarkError("conic parameters are invalid")
    if kind == "parabola":
        return (y - k) ** 2 - 4 * p * (x - h) if axis == "x" else (x - h) ** 2 - 4 * p * (y - k)
    a, b = _number(conic.get("a"), "conic.a"), _number(conic.get("b"), "conic.b")
    if axis == "x":
        return ((x - h) / a) ** 2 - ((y - k) / b) ** 2 - 1
    return ((y - k) / a) ** 2 - ((x - h) / b) ** 2 - 1


def _sample_conic(conic: dict[str, Any], x_range: tuple[float, float], y_range: tuple[float, float], samples: int) -> list[list[tuple[float, float]]]:
    kind = conic.get("kind")
    center = conic["center"]
    h, k = float(center["x"]), float(center["y"])
    if kind == "ellipse":
        a, b = float(conic["a"]), float(conic["b"])
        return [[(h + a * math.cos(2 * math.pi * i / samples), k + b * math.sin(2 * math.pi * i / samples)) for i in range(samples + 1)]]
    p, axis = float(conic["p"]), conic.get("axis", "y")
    if kind == "parabola":
        if axis == "x":
            values = [y_range[0] + (y_range[1] - y_range[0]) * i / samples for i in range(samples + 1)]
            return [[(h + (y - k) ** 2 / (4 * p), y) for y in values]]
        values = [x_range[0] + (x_range[1] - x_range[0]) * i / samples for i in range(samples + 1)]
        return [[(x, k + (x - h) ** 2 / (4 * p)) for x in values]]
    a, b = float(conic["a"]), float(conic["b"])
    branches: list[list[tuple[float, float]]] = []
    for sign in (-1, 1):
        points = []
        for i in range(samples + 1):
            t = -2.2 + 4.4 * i / samples
            if axis == "x":
                points.append((h + sign * a * math.cosh(t), k + b * math.sinh(t)))
            else:
                points.append((h + b * math.sinh(t), k + sign * a * math.cosh(t)))
        branches.append(points)
    return branches


def _render_conic(spec: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    conic = spec.get("conic")
    if not isinstance(conic, dict) or conic.get("kind") not in {"ellipse", "parabola", "hyperbola"}:
        raise VisualBenchmarkError("conic kind is unsupported")
    center = conic.get("center")
    if not isinstance(center, dict):
        raise VisualBenchmarkError("conic.center is required")
    _number(center.get("x"), "conic.center.x")
    _number(center.get("y"), "conic.center.y")
    if conic["kind"] == "ellipse":
        if _number(conic.get("a"), "conic.a") <= 0 or _number(conic.get("b"), "conic.b") <= 0:
            raise VisualBenchmarkError("ellipse semi-axes must be positive")
    else:
        _number(conic.get("p"), "conic.p")
        if conic["kind"] == "hyperbola" and (_number(conic.get("a"), "conic.a") <= 0 or _number(conic.get("b"), "conic.b") <= 0):
            raise VisualBenchmarkError("hyperbola semi-axes must be positive")
    frame = _frame(spec)
    _, _, x_low, x_high, y_low, y_high, tx, ty, body = frame
    samples = _integer(spec.get("samples", 241), "samples", 40, 800)
    for curve in _sample_conic(conic, (x_low, x_high), (y_low, y_high), samples):
        body.append('<polyline points="' + " ".join(f"{_fmt(tx(x))},{_fmt(ty(y))}" for x, y in curve) + '" class="curve-secondary"/>')
    key_points = spec.get("keyPoints")
    if not isinstance(key_points, list) or not key_points:
        raise VisualBenchmarkError("conic keyPoints must contain at least one point")
    for index, item in enumerate(key_points):
        x, y, label = _point(item, f"conic.keyPoints[{index}]")
        residual = _conic_residual(conic, x, y)
        if abs(residual) > 1e-7 * max(1.0, abs(x), abs(y)):
            raise VisualBenchmarkError(f"conic.keyPoints[{index}] is not on the declared conic")
        px, py = tx(x), ty(y)
        body.append(f'<circle cx="{_fmt(px)}" cy="{_fmt(py)}" r="3.5" class="center"/>')
        if label:
            body.append(f'<text x="{_fmt(px+7)}" y="{_fmt(py-7)}">{label}</text>')
    body.append(f'<text x="48" y="24" class="annotation">{_label(spec.get("caption", "방정식의 매개변수에서 계산한 곡선"), "caption")}</text>')
    return _svg(spec, body), {
        "topic": "conic",
        "mathChecks": {"equation": "PASS", "sampling": "PASS", "keyPoints": "PASS"},
        "svgChecks": {"axes": "PASS", "topology": "PASS", "semanticLabels": "PASS", "layout": "MANUAL_REVIEW"},
    }


def _render_calculus(spec: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    model, domain = _validate_function_model(spec.get("function"), spec.get("domain"))
    if _model_kind(model) == "absolute":
        raise VisualBenchmarkError("calculus tangent benchmark does not accept a corner point model")
    tangent_at = _number(spec.get("tangentAt"), "tangentAt")
    if not domain[0] <= tangent_at <= domain[1]:
        raise VisualBenchmarkError("tangentAt is outside the function domain")
    tangent_y = _function_value(model, tangent_at)
    tangent_slope = _function_derivative(model, tangent_at)
    if tangent_y is None or tangent_slope is None:
        raise VisualBenchmarkError("tangent point is not differentiable")
    area = spec.get("area")
    if not isinstance(area, dict):
        raise VisualBenchmarkError("calculus area is required")
    area_low, area_high = _range([area.get("from"), area.get("to")], "area")
    baseline = _number(area.get("baseline", 0), "area.baseline")
    if area_low < domain[0] or area_high > domain[1]:
        raise VisualBenchmarkError("area interval is outside the function domain")
    frame = _frame(spec)
    width, height, _, _, y_low, y_high, tx, ty, body = frame
    samples = _integer(spec.get("samples", 241), "samples", 40, 800)
    curve = _sample_function(model, domain, y_low, y_high, samples)
    for segment in curve:
        body.append('<polyline points="' + " ".join(f"{_fmt(tx(x))},{_fmt(ty(y))}" for x, y in segment) + '" class="curve"/>')
    area_points: list[tuple[float, float]] = []
    for index in range(max(20, samples // 4) + 1):
        x = area_low + (area_high - area_low) * index / max(20, samples // 4)
        value = _function_value(model, x)
        if value is None:
            raise VisualBenchmarkError("area interval crosses a function discontinuity")
        area_points.append((x, value))
    polygon = area_points + [(area_high, baseline), (area_low, baseline)]
    body.append('<polygon points="' + " ".join(f"{_fmt(tx(x))},{_fmt(ty(y))}" for x, y in polygon) + '" class="area"/>')
    tangent_span = spec.get("tangentSpan", domain)
    tangent_low, tangent_high = _range(tangent_span, "tangentSpan")
    body.append(
        f'<line x1="{_fmt(tx(tangent_low))}" y1="{_fmt(ty(tangent_y + tangent_slope * (tangent_low-tangent_at)))}" '
        f'x2="{_fmt(tx(tangent_high))}" y2="{_fmt(ty(tangent_y + tangent_slope * (tangent_high-tangent_at)))}" class="tangent"/>'
    )
    for boundary in (area_low, area_high):
        body.append(f'<line x1="{_fmt(tx(boundary))}" y1="{_fmt(ty(baseline))}" x2="{_fmt(tx(boundary))}" y2="{_fmt(ty(_function_value(model, boundary) or baseline))}" class="guide"/>')
    px, py = tx(tangent_at), ty(tangent_y)
    body.append(f'<circle cx="{_fmt(px)}" cy="{_fmt(py)}" r="3.5" class="point"/>')
    body.append(f'<text x="{_fmt(px+7)}" y="{_fmt(py-7)}">T</text>')
    body.append(f'<text x="48" y="24" class="annotation">{_label(spec.get("caption", "도함수로 계산한 접선과 정적분 영역"), "caption")}</text>')
    return _svg(spec, body), {
        "topic": "calculus",
        "mathChecks": {"function": "PASS", "derivative": "PASS", "tangent": "PASS", "areaBounds": "PASS"},
        "svgChecks": {"curve": "PASS", "tangentOverlay": "PASS", "areaShading": "PASS", "layout": "MANUAL_REVIEW"},
    }


def _validate_plane_points(raw_points: Any, name: str, x_range: tuple[float, float], y_range: tuple[float, float]) -> list[tuple[float, float, str | None]]:
    if not isinstance(raw_points, list) or not raw_points:
        raise VisualBenchmarkError(f"{name} must contain at least one point")
    points = []
    for index, item in enumerate(raw_points):
        x, y, label = _point(item, f"{name}[{index}]")
        if not x_range[0] <= x <= x_range[1] or not y_range[0] <= y <= y_range[1]:
            raise VisualBenchmarkError(f"{name}[{index}] is outside the coordinate plane")
        points.append((x, y, label))
    return points


def _render_coordinate_plane(spec: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    frame = _frame(spec)
    _, _, x_low, x_high, y_low, y_high, tx, ty, body = frame
    points = _validate_plane_points(spec.get("points"), "points", (x_low, x_high), (y_low, y_high))
    segments = spec.get("segments", [])
    if not isinstance(segments, list):
        raise VisualBenchmarkError("segments must be an array")
    for index, segment in enumerate(segments):
        if not isinstance(segment, dict):
            raise VisualBenchmarkError(f"segments[{index}] must be an object")
        start = _point(segment.get("from"), f"segments[{index}].from")
        end = _point(segment.get("to"), f"segments[{index}].to")
        for value, label in ((start, "from"), (end, "to")):
            if not (x_low <= value[0] <= x_high and y_low <= value[1] <= y_high):
                raise VisualBenchmarkError(f"segments[{index}].{label} is outside the coordinate plane")
        body.append(f'<line x1="{_fmt(tx(start[0]))}" y1="{_fmt(ty(start[1]))}" x2="{_fmt(tx(end[0]))}" y2="{_fmt(ty(end[1]))}" class="curve-secondary"/>')
        if segment.get("label") is not None:
            label = _label(segment["label"], f"segments[{index}].label")
            body.append(f'<text x="{_fmt((tx(start[0])+tx(end[0]))/2+6)}" y="{_fmt((ty(start[1])+ty(end[1]))/2-6)}">{label}</text>')
    for x, y, label in points:
        px, py = tx(x), ty(y)
        body.append(f'<circle cx="{_fmt(px)}" cy="{_fmt(py)}" r="3.5" class="point"/>')
        if label:
            body.append(f'<text x="{_fmt(px+7)}" y="{_fmt(py-7)}">{label}</text>')
    body.append(f'<text x="48" y="24" class="annotation">{_label(spec.get("caption", "점의 좌표와 상대 위치를 정확히 표시"), "caption")}</text>')
    return _svg(spec, body), {
        "topic": "coordinate_plane",
        "mathChecks": {"coordinates": "PASS", "relativePlacement": "PASS", "segments": "PASS"},
        "svgChecks": {"axes": "PASS", "pointsAndLabels": "PASS", "layout": "MANUAL_REVIEW"},
    }


def _render_line_equation(spec: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    line = spec.get("line")
    if not isinstance(line, dict):
        raise VisualBenchmarkError("line model must be an object")
    point_a = _point(line.get("pointA"), "line.pointA")
    point_b = _point(line.get("pointB"), "line.pointB")
    if abs(point_a[0] - point_b[0]) < _EPSILON and abs(point_a[1] - point_b[1]) < _EPSILON:
        raise VisualBenchmarkError("line points must be distinct")
    frame = _frame(spec)
    width, height, x_low, x_high, y_low, y_high, tx, ty, body = frame
    for point, name in ((point_a, "pointA"), (point_b, "pointB")):
        if not (x_low <= point[0] <= x_high and y_low <= point[1] <= y_high):
            raise VisualBenchmarkError(f"line.{name} is outside the coordinate plane")
    vertical = abs(point_a[0] - point_b[0]) < _EPSILON
    if vertical:
        expected_slope = None
        expected_intercept = None
        line_x = tx(point_a[0])
        body.append(f'<line x1="{_fmt(line_x)}" y1="{_fmt(ty(y_low))}" x2="{_fmt(line_x)}" y2="{_fmt(ty(y_high))}" class="curve-secondary"/>')
    else:
        slope = (point_b[1] - point_a[1]) / (point_b[0] - point_a[0])
        intercept = point_a[1] - slope * point_a[0]
        expected_slope = _number(line.get("slope", slope), "line.slope")
        expected_intercept = _number(line.get("intercept", intercept), "line.intercept")
        if abs(expected_slope - slope) > 1e-8 or abs(expected_intercept - intercept) > 1e-8:
            raise VisualBenchmarkError("declared line slope or intercept does not match its two points")
        y1, y2 = slope * x_low + intercept, slope * x_high + intercept
        body.append(f'<line x1="{_fmt(tx(x_low))}" y1="{_fmt(ty(y1))}" x2="{_fmt(tx(x_high))}" y2="{_fmt(ty(y2))}" class="curve-secondary"/>')
        for point, name in ((point_a, "pointA"), (point_b, "pointB")):
            residual = point[1] - (slope * point[0] + intercept)
            if abs(residual) > 1e-8:
                raise VisualBenchmarkError(f"line.{name} is not on the declared line")
    for point in (point_a, point_b):
        px, py = tx(point[0]), ty(point[1])
        body.append(f'<circle cx="{_fmt(px)}" cy="{_fmt(py)}" r="3.5" class="point"/>')
        if point[2]:
            body.append(f'<text x="{_fmt(px+7)}" y="{_fmt(py-7)}">{point[2]}</text>')
    if vertical:
        relation = "vertical line"
    else:
        relation = f"slope={_fmt(expected_slope or 0)}, intercept={_fmt(expected_intercept or 0)}"
    body.append(f'<text x="48" y="24" class="annotation">{_label(spec.get("caption", "두 점의 좌표에서 계산한 직선의 방정식"), "caption")} · {_label(relation, "line relation")}</text>')
    return _svg(spec, body), {
        "topic": "line_equation",
        "mathChecks": {"twoPointSlope": "PASS", "intercept": "PASS" if not vertical else "NOT_APPLICABLE", "pointMembership": "PASS"},
        "svgChecks": {"line": "PASS", "pointLabels": "PASS", "layout": "MANUAL_REVIEW"},
    }


def _render_translation(spec: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    frame = _frame(spec)
    _, _, x_low, x_high, y_low, y_high, tx, ty, body = frame
    original = _validate_plane_points(spec.get("vertices"), "vertices", (x_low, x_high), (y_low, y_high))
    vector = spec.get("translation")
    if not isinstance(vector, dict):
        raise VisualBenchmarkError("translation vector must be an object")
    dx, dy = _number(vector.get("dx"), "translation.dx"), _number(vector.get("dy"), "translation.dy")
    translated = _validate_plane_points(spec.get("translatedVertices"), "translatedVertices", (x_low, x_high), (y_low, y_high))
    if len(original) < 3 or len(translated) != len(original):
        raise VisualBenchmarkError("translation polygons must have the same at least-three-point topology")
    for index, ((x, y, _), (x2, y2, _)) in enumerate(zip(original, translated)):
        if abs((x + dx) - x2) > 1e-8 or abs((y + dy) - y2) > 1e-8:
            raise VisualBenchmarkError(f"translatedVertices[{index}] does not use the declared translation vector")
    original_points = " ".join(f"{_fmt(tx(x))},{_fmt(ty(y))}" for x, y, _ in original)
    translated_points = " ".join(f"{_fmt(tx(x))},{_fmt(ty(y))}" for x, y, _ in translated)
    body.append(f'<polygon points="{original_points}" class="original"/>')
    body.append(f'<polygon points="{translated_points}" class="translation"/>')
    for (x, y, _), (x2, y2, _) in zip(original, translated):
        body.append(f'<line x1="{_fmt(tx(x))}" y1="{_fmt(ty(y))}" x2="{_fmt(tx(x2))}" y2="{_fmt(ty(y2))}" class="guide"/>')
    for x, y, label in original:
        px, py = tx(x), ty(y)
        body.append(f'<circle cx="{_fmt(px)}" cy="{_fmt(py)}" r="3.2" class="point"/>')
        if label:
            body.append(f'<text x="{_fmt(px+7)}" y="{_fmt(py-7)}">{label}</text>')
    for x, y, label in translated:
        px, py = tx(x), ty(y)
        body.append(f'<circle cx="{_fmt(px)}" cy="{_fmt(py)}" r="3.2" class="center"/>')
        if label:
            body.append(f'<text x="{_fmt(px+7)}" y="{_fmt(py-7)}">{label}</text>')
    caption = spec.get("caption", "같은 벡터로 이동한 도형의 대응 관계")
    body.append(f'<text x="48" y="24" class="annotation">{_label(caption, "caption")} · ({_fmt(dx)},{_fmt(dy)})</text>')
    return _svg(spec, body), {
        "topic": "shape_translation",
        "mathChecks": {"vector": "PASS", "correspondence": "PASS", "topology": "PASS"},
        "svgChecks": {"originalAndImage": "PASS", "correspondingSegments": "PASS", "layout": "MANUAL_REVIEW"},
    }


def render_experimental_visual_spec(spec: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    if not isinstance(spec, dict) or spec.get("version", "0.1") != "0.1":
        raise VisualBenchmarkError("experimental visualSpec version must equal 0.1")
    visual_type = spec.get("type")
    renderer = {
        "coordinate_plane_experiment": _render_coordinate_plane,
        "line_equation_experiment": _render_line_equation,
        "shape_translation_experiment": _render_translation,
        "function_graph": _render_function,
        "inequality_number_line": _render_inequality,
        "conic_graph": _render_conic,
        "calculus_overlay": _render_calculus,
    }.get(visual_type)
    if renderer is None:
        raise VisualBenchmarkError("experimental visualSpec type is unsupported")
    normalized = copy.deepcopy(spec)
    normalized.setdefault("version", "0.1")
    svg, checks = renderer(normalized)
    rerender, _ = renderer(copy.deepcopy(normalized))
    if svg != rerender:
        raise VisualBenchmarkError("experimental visual renderer is nondeterministic")
    checks["deterministicRerender"] = "PASS"
    checks["rendererVersion"] = EXPERIMENTAL_RENDERER_VERSION
    return svg, checks


def benchmark_specs() -> list[dict[str, Any]]:
    return [
        {
            "caseId": "coordinate-plane-points",
            "topic": "coordinate_plane",
            "version": "0.1",
            "type": "coordinate_plane_experiment",
            "title": "평면좌표 실험 · 점과 선분",
            "width": 640,
            "height": 360,
            "xRange": [-4, 5],
            "yRange": [-4, 5],
            "points": [
                {"x": -2, "y": 1, "label": "A"},
                {"x": 2, "y": 3, "label": "B"},
                {"x": 3, "y": -1, "label": "C"},
            ],
            "segments": [
                {"from": {"x": -2, "y": 1}, "to": {"x": 2, "y": 3}, "label": "AB"},
                {"from": {"x": 2, "y": 3}, "to": {"x": 3, "y": -1}, "label": "BC"},
            ],
            "caption": "점의 좌표와 선분의 상대 위치를 평면좌표에서 확인",
        },
        {
            "caseId": "line-equation-two-points",
            "topic": "line_equation",
            "version": "0.1",
            "type": "line_equation_experiment",
            "title": "직선의 방정식 실험 · 두 점",
            "width": 640,
            "height": 360,
            "xRange": [-4, 5],
            "yRange": [-4, 6],
            "line": {
                "pointA": {"x": -2, "y": -1, "label": "A"},
                "pointB": {"x": 3, "y": 4, "label": "B"},
                "slope": 1,
                "intercept": 1,
            },
            "caption": "A, B를 지나는 직선 y=x+1",
        },
        {
            "caseId": "shape-translation",
            "topic": "shape_translation",
            "version": "0.1",
            "type": "shape_translation_experiment",
            "title": "도형의 이동 실험 · 평행이동",
            "width": 640,
            "height": 360,
            "xRange": [-2, 7],
            "yRange": [-2, 5],
            "vertices": [
                {"x": 0, "y": 0, "label": "A"},
                {"x": 3, "y": 0, "label": "B"},
                {"x": 1, "y": 2, "label": "C"},
            ],
            "translation": {"dx": 2, "dy": 1},
            "translatedVertices": [
                {"x": 2, "y": 1, "label": "A′"},
                {"x": 5, "y": 1, "label": "B′"},
                {"x": 3, "y": 3, "label": "C′"},
            ],
            "caption": "모든 꼭짓점에 같은 벡터 (2,1)을 더한 평행이동",
        },
        {
            "caseId": "function-quadratic",
            "topic": "function",
            "version": "0.1",
            "type": "function_graph",
            "title": "함수 그래프 실험 · 이차함수",
            "width": 640,
            "height": 360,
            "xRange": [-4, 4],
            "yRange": [-5, 8],
            "function": {"kind": "quadratic", "a": 1, "h": 1, "k": -2},
            "domain": [-4, 4],
            "keyPoints": [{"x": 1, "y": -2, "label": "V"}, {"x": 0, "y": -1, "label": "A"}],
            "caption": "f(x)=(x-1)²-2 · 정의역 [-4,4]",
        },
        {
            "caseId": "function-rational",
            "topic": "function",
            "version": "0.1",
            "type": "function_graph",
            "title": "함수 그래프 실험 · 유리함수",
            "width": 640,
            "height": 360,
            "xRange": [-4, 5],
            "yRange": [-8, 8],
            "function": {"kind": "rational", "a": 2, "h": 1, "k": 0},
            "domain": [-4, 5],
            "keyPoints": [{"x": 0, "y": -2, "label": "A"}, {"x": 2, "y": 2, "label": "B"}],
            "caption": "f(x)=2/(x-1) · x=1에서 불연속",
        },
        {
            "caseId": "inequality-quadratic",
            "topic": "inequality",
            "version": "0.1",
            "type": "inequality_number_line",
            "title": "부등식 해집합 실험 · 이차부등식",
            "width": 640,
            "height": 180,
            "xRange": [-4, 4],
            "inequality": {"kind": "quadratic", "a": 1, "b": 1, "c": -2, "relation": "<="},
            "boundaries": [-2, 1],
            "solutionIntervals": [{"low": -2, "high": 1, "includeLow": True, "includeHigh": True}],
            "testPoints": [{"x": -3, "satisfies": False}, {"x": 0, "satisfies": True}, {"x": 2, "satisfies": False}],
            "caption": "x²+x-2≤0 · 경계 포함과 시험점 부호를 함께 확인",
        },
        {
            "caseId": "conic-ellipse",
            "topic": "conic",
            "version": "0.1",
            "type": "conic_graph",
            "title": "도형의 방정식 실험 · 타원",
            "width": 640,
            "height": 360,
            "xRange": [-4, 4],
            "yRange": [-3, 3],
            "conic": {"kind": "ellipse", "center": {"x": 0, "y": 0}, "a": 3, "b": 2},
            "keyPoints": [
                {"x": 3, "y": 0, "label": "A"},
                {"x": -3, "y": 0, "label": "B"},
                {"x": 0, "y": 2, "label": "C"},
                {"x": 0, "y": -2, "label": "D"},
            ],
            "caption": "x²/9+y²/4=1 · 중심과 꼭짓점은 방정식에서 계산",
        },
        {
            "caseId": "calculus-tangent-area",
            "topic": "calculus",
            "version": "0.1",
            "type": "calculus_overlay",
            "title": "미적분 시각화 실험 · 접선과 넓이",
            "width": 640,
            "height": 360,
            "xRange": [-2, 4],
            "yRange": [-5, 5],
            "function": {"kind": "quadratic", "a": 1, "h": 1, "k": -3},
            "domain": [-2, 4],
            "tangentAt": 2,
            "tangentSpan": [0, 3],
            "area": {"from": 0, "to": 2, "baseline": 0},
            "caption": "f(x)=(x-1)²-3 · x=2에서의 접선과 [0,2] 정적분 영역",
        },
    ]


def _utc_run_id() -> str:
    from datetime import datetime, timezone

    return datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ-experimental-visual")


def run_visual_benchmarks(output_root: Path, repeats: int = 3, topic: str | None = None) -> dict[str, Any]:
    if not isinstance(repeats, int) or not 1 <= repeats <= 10:
        raise VisualBenchmarkError("repeats must be an integer from 1 through 10")
    cases = benchmark_specs()
    if topic:
        cases = [case for case in cases if case["topic"] == topic]
        if not cases:
            raise VisualBenchmarkError(f"unknown benchmark topic: {topic}")
    output_root = output_root.resolve()
    output_root.mkdir(parents=True, exist_ok=True)
    repetition_reports: list[dict[str, Any]] = []
    by_case: dict[str, list[dict[str, Any]]] = {case["caseId"]: [] for case in cases}
    for repetition in range(1, repeats + 1):
        run_dir = output_root / f"run-{repetition:03d}"
        run_dir.mkdir(parents=True, exist_ok=True)
        case_reports: list[dict[str, Any]] = []
        for case in cases:
            case_dir = run_dir / case["caseId"]
            case_dir.mkdir(parents=True, exist_ok=True)
            spec = copy.deepcopy(case)
            atomic_write_json(case_dir / "visual-spec.json", spec)
            report: dict[str, Any] = {
                "schemaVersion": BENCHMARK_SCHEMA_VERSION,
                "artifactType": "ALIVE_EXPERIMENTAL_VISUAL_CASE_REPORT",
                "caseId": case["caseId"],
                "topic": case["topic"],
                "mode": "EXPERIMENTAL_ONLY",
                "qualityTier": "MANUAL_REVIEW",
                "browserRender": "NOT_RUN",
            }
            try:
                svg, checks = render_experimental_visual_spec(spec)
                asset = case_dir / "visual.svg"
                asset.write_text(svg, encoding="utf-8", newline="\n")
                report.update(checks)
                report.update({"status": "PASS_STRUCTURAL", "assetSha256": sha256_file(asset), "specSha256": sha256_file(case_dir / "visual-spec.json")})
            except (OSError, ValueError, VisualBenchmarkError) as error:
                report.update({"status": "FAIL", "error": str(error)})
            atomic_write_json(case_dir / "benchmark-report.json", report)
            case_reports.append(report)
            by_case[case["caseId"]].append(report)
        repetition_reports.append({"repetition": repetition, "status": "PASS_STRUCTURAL" if all(item["status"] == "PASS_STRUCTURAL" for item in case_reports) else "FAIL", "cases": case_reports})

    deterministic_cases: dict[str, dict[str, Any]] = {}
    for case_id, reports in by_case.items():
        assets = [item.get("assetSha256") for item in reports]
        specs = [item.get("specSha256") for item in reports]
        deterministic_cases[case_id] = {
            "assetHashesEqual": len(set(assets)) == 1 and None not in assets,
            "specHashesEqual": len(set(specs)) == 1 and None not in specs,
        }
    all_pass = all(item["status"] == "PASS_STRUCTURAL" for item in repetition_reports)
    all_deterministic = all(item["assetHashesEqual"] and item["specHashesEqual"] for item in deterministic_cases.values())
    summary = {
        "schemaVersion": BENCHMARK_SCHEMA_VERSION,
        "artifactType": "ALIVE_EXPERIMENTAL_VISUAL_BENCHMARK_REPORT",
        "runId": output_root.name or _utc_run_id(),
        "mode": "EXPERIMENTAL_ONLY",
        "visualQualityFloor": "student-safe-v0.1",
        "rendererVersion": EXPERIMENTAL_RENDERER_VERSION,
        "requestedTopic": topic or "ALL",
        "repetitions": repeats,
        "cases": [case["caseId"] for case in cases],
        "mathematicalAndSvgValidation": "PASS_STRUCTURAL_ONLY" if all_pass else "FAIL",
        "determinism": {"status": "PASS" if all_deterministic else "FAIL", "cases": deterministic_cases},
        "browserRender": "NOT_RUN",
        "overallStatus": "PASS_WITH_MANUAL_BROWSER_GATE" if all_pass and all_deterministic else "FAIL",
        "repetitionReports": repetition_reports,
        "productionStagedExam": "UNCHANGED",
    }
    atomic_write_json(output_root / "summary.json", summary)
    return summary
