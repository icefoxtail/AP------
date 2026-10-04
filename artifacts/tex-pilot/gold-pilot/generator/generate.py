#!/usr/bin/env python3
"""Deterministic JSON -> TikZ/PGFPlots source for the GOLD pilot.

Python owns numeric validation and function sampling. The emitted TeX is a
candidate artifact; it never changes production JS or SVG assets.
"""

from __future__ import annotations

import argparse
import ast
import hashlib
import json
import math
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
STYLE_TOKENS = {
    "axis": {"color": "black", "lineWidth": 0.8},
    "mainCurve": {"color": "blue", "lineWidth": 1.0},
    "secondaryCurve": {"color": "red", "lineWidth": 1.0},
    "tangent": {"color": "red", "lineWidth": 1.0},
    "auxiliary": {"color": "gray", "lineWidth": 0.8},
    "point": {"color": "black", "markSize": 1.8},
    "criticalPoint": {"color": "black", "markSize": 2.0},
    "label": {"fontSize": "small"},
    "mathLabel": {"fontSize": "small"},
    "conditionBox": {"padding": 4},
}


def fail(message: str) -> None:
    raise SystemExit(f"GOLD_GENERATOR_ERROR: {message}")


def number(value: Any, label: str) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        fail(f"{label} must be a finite number")
    return float(value)


def fmt(value: float) -> str:
    if abs(value) < 1e-12:
        value = 0.0
    return f"{value:.6f}".rstrip("0").rstrip(".")


def tex(text: str) -> str:
    # Inputs use a deliberately small label language: plain text plus math
    # delimiters. Escape TeX specials outside the common math punctuation.
    text = str(text)
    text = text.replace("\\", r"\textbackslash{}").replace("&", r"\&")
    text = text.replace("%", r"\%").replace("#", r"\#").replace("_", r"\_")
    return text


def math_label(text: str) -> str:
    """Render the pilot's small equation-label language in math mode."""
    raw = str(text)
    if "\\\\" in raw:
        fail("double-backslash corruption in math label")
    raw = re.sub(r"sqrt\(([^()]+)\)", r"\\sqrt{\1}", raw)
    raw = raw.replace("<=", r"\le ").replace(">=", r"\ge ").replace("->", r"\to ")
    raw = re.sub(r"([A-Za-z0-9)])\^([A-Za-z0-9+-]+)", r"\1^{\2}", raw)
    raw = raw.replace("prime", r"\prime")
    return "$" + raw + "$"


ALLOWED_AST = (ast.Expression, ast.BinOp, ast.UnaryOp, ast.Add, ast.Sub, ast.Mult,
               ast.Div, ast.Pow, ast.USub, ast.UAdd, ast.Constant, ast.Name,
               ast.Call, ast.Load)
FUNCTIONS = {"sin": math.sin, "cos": math.cos, "tan": math.tan,
             "exp": math.exp, "log": math.log, "sqrt": math.sqrt,
             "abs": abs}


def compile_expression(expression: str):
    source = expression.replace("^", "**")
    try:
        tree = ast.parse(source, mode="eval")
    except SyntaxError as exc:
        fail(f"invalid function expression {expression!r}: {exc.msg}")
    for node in ast.walk(tree):
        if not isinstance(node, ALLOWED_AST):
            fail(f"unsupported expression node {type(node).__name__} in {expression!r}")
        if isinstance(node, ast.Name) and node.id not in {"x", "pi", *FUNCTIONS}:
            fail(f"unsupported name {node.id!r} in {expression!r}")
        if isinstance(node, ast.Call) and not isinstance(node.func, ast.Name):
            fail("only named math functions are allowed")
    code = compile(tree, "<gold-function>", "eval")

    def evaluate(x: float) -> float:
        value = eval(code, {"__builtins__": {}}, {"x": x, "pi": math.pi, **FUNCTIONS})
        value = number(value, f"f({x})")
        return value

    return evaluate


def samples(expression: str, domain: list[Any], count: int) -> list[tuple[float, float]]:
    lo, hi = (number(domain[0], "domain[0]"), number(domain[1], "domain[1]"))
    if not hi > lo:
        fail("function domain must be increasing")
    count = max(2, min(int(count), 2001))
    evaluate = compile_expression(expression)
    points: list[tuple[float, float]] = []
    for index in range(count):
        x = lo + (hi - lo) * index / (count - 1)
        try:
            y = evaluate(x)
        except (ArithmeticError, ValueError, OverflowError):
            continue
        if math.isfinite(y):
            points.append((x, y))
    if len(points) < 2:
        fail(f"function {expression!r} produced fewer than two finite samples")
    return points


def style(value: dict[str, Any] | None, default: str = "black") -> str:
    value = value or {}
    color = str(value.get("color", default))
    width = fmt(number(value.get("lineWidth", 0.8), "lineWidth"))
    line_style = value.get("lineStyle", "solid")
    if line_style not in {"solid", "dashed", "dotted"}:
        fail(f"unsupported lineStyle {line_style!r}")
    return f"{color}, {line_style}, line width={width}pt"


def coordinate(value: list[Any], label: str) -> tuple[float, float]:
    if not isinstance(value, list) or len(value) != 2:
        fail(f"{label} must be a two-number array")
    return number(value[0], f"{label}[0]"), number(value[1], f"{label}[1]")


def line_coefficients(item: dict[str, Any], label: str) -> tuple[float, float, float]:
    """Return canonical a*x+b*y+c=0 coefficients."""
    if all(key in item for key in ("a", "b", "c")):
        a, b, c = (number(item[key], f"{label}.{key}") for key in ("a", "b", "c"))
    elif "through" in item:
        p, q = (coordinate(value, f"{label}.through[{i}]") for i, value in enumerate(item["through"]))
        a, b, c = p[1] - q[1], q[0] - p[0], p[0] * q[1] - q[0] * p[1]
    elif "slope" in item and "intercept" in item:
        m, k = number(item["slope"], f"{label}.slope"), number(item["intercept"], f"{label}.intercept")
        a, b, c = m, -1.0, k
    else:
        fail(f"{label} needs (a,b,c), through, or (slope,intercept)")
    norm = math.hypot(a, b)
    if norm == 0:
        fail(f"{label} has zero line normal")
    return a / norm, b / norm, c / norm


def line_intersection(first: tuple[float, float, float], second: tuple[float, float, float]) -> tuple[float, float] | None:
    a1, b1, c1 = first
    a2, b2, c2 = second
    determinant = a1 * b2 - a2 * b1
    if abs(determinant) < 1e-9:
        return None
    return ((b1 * c2 - b2 * c1) / determinant, (c1 * a2 - c2 * a1) / determinant)


def line_relation(kind: str, first: tuple[float, float, float], second: tuple[float, float, float]) -> bool:
    a1, b1, _ = first
    a2, b2, _ = second
    # Direction vectors are (b,-a).
    dot = b1 * b2 + a1 * a2
    cross = b1 * (-a2) - b2 * (-a1)
    if kind == "PERPENDICULAR":
        return abs(dot) < 1e-7
    if kind == "PARALLEL":
        return abs(cross) < 1e-7
    return False


def position_anchor(position: str | None, x: float, y: float, viewport: dict[str, Any], occupied: list[tuple[float, float]]) -> str:
    anchors = {"N": "south", "NE": "south west", "E": "west", "SE": "north west",
               "S": "north", "SW": "north east", "W": "east", "NW": "south east"}
    if position in anchors:
        return anchors[position]
    candidates = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    x_min, x_max = float(viewport["xMin"]), float(viewport["xMax"])
    y_min, y_max = float(viewport["yMin"]), float(viewport["yMax"])
    scored = []
    for candidate in candidates:
        dx = 0 if candidate in {"N", "S"} else (1 if candidate in {"NE", "E", "SE"} else -1)
        dy = 0 if candidate in {"E", "W"} else (1 if candidate in {"N", "NE", "NW"} else -1)
        edge = (x_max - x if dx > 0 else x - x_min if dx < 0 else min(x - x_min, x_max - x)) + (y_max - y if dy > 0 else y - y_min if dy < 0 else min(y - y_min, y_max - y))
        clearance = min((math.hypot(x - ox, y - oy) for ox, oy in occupied), default=10.0)
        scored.append((edge + clearance, candidate))
    return anchors[max(scored)[1]]


def label_content(item: dict[str, Any], force_math: bool = False) -> str:
    is_math = force_math or item.get("math", False) or item.get("kind") == "equation"
    return math_label(item["text"]) if is_math else tex(item["text"])


def by_id(items: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    result: dict[str, dict[str, Any]] = {}
    for item in items:
        item_id = item.get("id")
        if not isinstance(item_id, str) or not item_id:
            fail("every visual object needs a non-empty id")
        if item_id in result:
            fail(f"duplicate object id {item_id!r}")
        result[item_id] = item
    return result


def validate(data: dict[str, Any]) -> None:
    required = {"id", "visualType", "viewport"}
    missing = required - data.keys()
    if missing:
        fail(f"missing required keys: {sorted(missing)}")
    allowed_types = {"coordinate_geometry", "line_circle_geometry", "function_graph",
                     "calculus_graph", "explanation_card"}
    if data["visualType"] not in allowed_types:
        fail(f"unsupported visualType {data['visualType']!r}")
    vp = data["viewport"]
    if not isinstance(vp, dict):
        fail("viewport must be an object")
    for key in ("xMin", "xMax", "yMin", "yMax"):
        number(vp.get(key), f"viewport.{key}")
    if not vp["xMax"] > vp["xMin"] or not vp["yMax"] > vp["yMin"]:
        fail("viewport ranges must be increasing")
    for key in ("points", "lines", "segments", "circles", "functionGraphs", "labels",
                "annotations", "auxiliaryLines", "emphasis", "components"):
        if key in data and not isinstance(data[key], list):
            fail(f"{key} must be an array")
    by_id(data.get("points", []))
    by_id(data.get("lines", []))
    by_id(data.get("segments", []))
    by_id(data.get("circles", []))
    by_id(data.get("functionGraphs", []))
    by_id(data.get("labels", []))
    by_id(data.get("annotations", []))
    by_id(data.get("auxiliaryLines", []))
    for key in ("sourceFacts", "derivedFacts", "styleTokens"):
        if key in data and not isinstance(data[key], dict):
            fail(f"{key} must be an object")
    source = data.get("sourceFacts", {})
    derived = data.get("derivedFacts", {})
    for key in set(source).intersection(derived):
        if source[key] != derived[key]:
            fail(f"source/derived fact parity mismatch at {key}")
    for line_id, line in by_id(data.get("lines", [])).items():
        line_coefficients(line, f"line.{line_id}")
    for graph in data.get("functionGraphs", []):
        samples(graph["expression"], graph["domain"], graph.get("samples", 81))
    points = by_id(data.get("points", []))
    lines = by_id(data.get("lines", []))
    for component in data.get("components", []):
        kind = component["kind"]
        refs = component.get("refs", [])
        if kind in {"PARALLEL", "PERPENDICULAR", "PERPENDICULAR_MARK"}:
            if len(refs) != 2 or any(ref not in lines for ref in refs):
                fail(f"{kind} requires two known line refs")
            if not line_relation(kind if kind != "PERPENDICULAR_MARK" else "PERPENDICULAR", line_coefficients(lines[refs[0]], refs[0]), line_coefficients(lines[refs[1]], refs[1])):
                fail(f"{kind} relation check failed for {refs}")
        if kind == "INTERSECTION" and refs and len(refs) == 2 and all(ref in lines for ref in refs):
            expected = line_intersection(line_coefficients(lines[refs[0]], refs[0]), line_coefficients(lines[refs[1]], refs[1]))
            item = points.get(component.get("ref", ""))
            if expected is None or not item:
                fail(f"INTERSECTION {component.get('ref')} is not a unique line intersection")
            if math.hypot(expected[0] - number(item["x"], "intersection.x"), expected[1] - number(item["y"], "intersection.y")) > 1e-6:
                fail(f"INTERSECTION {component.get('ref')} does not match numeric authority")
        if kind == "TANGENT":
            options = component.get("options", {})
            line_id, graph_id = options.get("lineRef"), options.get("curveRef")
            if line_id not in lines or not graph_id:
                fail("TANGENT requires options.lineRef and options.curveRef")
            if "at" not in options:
                fail("TANGENT requires options.at")
            graph = by_id(data.get("functionGraphs", [])).get(graph_id)
            if not graph:
                fail(f"TANGENT curveRef {graph_id!r} is unknown")
            tx, ty = coordinate(options["at"], "TANGENT.at")
            evaluate = compile_expression(graph["expression"])
            if abs(evaluate(tx) - ty) > 1e-5:
                fail("TANGENT point is not on the referenced curve")
            h = 1e-5
            derivative = (evaluate(tx + h) - evaluate(tx - h)) / (2 * h)
            a, b, _ = line_coefficients(lines[line_id], line_id)
            slope = -a / b if abs(b) > 1e-12 else math.inf
            if not math.isfinite(slope) or abs(slope - derivative) > 1e-3:
                fail(f"TANGENT slope mismatch: line={slope}, derivative={derivative}")


def component_order(data: dict[str, Any]) -> list[dict[str, Any]]:
    if data.get("components"):
        return data["components"]
    result: list[dict[str, Any]] = [{"kind": "AXIS"}]
    for key, kind in (("functionGraphs", "FUNCTION_GRAPH"), ("lines", "LINE"),
                      ("segments", "SEGMENT"), ("circles", "CIRCLE"),
                      ("points", "POINT"), ("labels", "POINT_LABEL"),
                      ("annotations", "GRAPH_ANNOTATION"),
                      ("auxiliaryLines", "AUXILIARY_LINE")):
        result.extend({"kind": kind, "ref": item["id"]} for item in data.get(key, []))
    if data.get("conditionBox"):
        result.append({"kind": "CONDITION_BOX"})
    return result


def derive_facts(data: dict[str, Any]) -> tuple[dict[str, Any], dict[str, float]]:
    lines = by_id(data.get("lines", []))
    points = by_id(data.get("points", []))
    derived: dict[str, Any] = {"lineCoefficients": {}, "intersections": {}}
    for line_id, line in lines.items():
        derived["lineCoefficients"][line_id] = [round(value, 12) for value in line_coefficients(line, line_id)]
    for component in data.get("components", []):
        if component["kind"] == "INTERSECTION" and len(component.get("refs", [])) == 2:
            first, second = component["refs"]
            if first in lines and second in lines:
                hit = line_intersection(line_coefficients(lines[first], first), line_coefficients(lines[second], second))
                if hit is not None:
                    derived["intersections"][component.get("ref", f"{first}_{second}")] = [round(hit[0], 12), round(hit[1], 12)]
    samples_bounds: list[tuple[float, float]] = []
    for graph in data.get("functionGraphs", []):
        samples_bounds.extend(samples(graph["expression"], graph["domain"], graph.get("samples", 81)))
    samples_bounds.extend((number(point["x"], point["id"]), number(point["y"], point["id"])) for point in points.values())
    if samples_bounds:
        xs, ys = zip(*samples_bounds)
        margin_x = max(0.2, (max(xs) - min(xs)) * 0.08)
        margin_y = max(0.2, (max(ys) - min(ys)) * 0.08)
        suggestion = {"xMin": round(min(xs) - margin_x, 6), "xMax": round(max(xs) + margin_x, 6), "yMin": round(min(ys) - margin_y, 6), "yMax": round(max(ys) + margin_y, 6)}
    else:
        suggestion = {key: number(data["viewport"][key], f"viewport.{key}") for key in ("xMin", "xMax", "yMin", "yMax")}
    derived["viewportSuggestion"] = suggestion
    return derived, suggestion


def emit(data: dict[str, Any]) -> str:
    vp = data["viewport"]
    axes = data.get("axes", {})
    x_min, x_max = number(vp["xMin"], "xMin"), number(vp["xMax"], "xMax")
    y_min, y_max = number(vp["yMin"], "yMin"), number(vp["yMax"], "yMax")
    width = number(vp.get("width", 10), "viewport.width")
    height = number(vp.get("height", 7), "viewport.height")
    geometry_scale = data["visualType"] in {"coordinate_geometry", "line_circle_geometry", "explanation_card"}
    aspect = "axis equal image" if geometry_scale else "scale only axis"
    if not geometry_scale:
        # Keep graph SVGs intrinsically mobile-safe; graph readability comes
        # from the viewport and samples, not a fixed geometric unit scale.
        width = min(width, 9.0)
    axis_lines = "middle" if axes.get("visible", True) else "none"
    grid = "major" if axes.get("grid", True) else "none"
    x_label = tex(axes.get("xLabel", "x"))
    y_label = tex(axes.get("yLabel", "y"))
    lines = [
        "% Generated by AP Math GOLD PILOT deterministic Python generator.",
        f"% input id: {data['id']}",
        r"\documentclass{article}",
        r"\usepackage[margin=1cm]{geometry}",
        r"\def\pgfsysdriver{pgfsys-dvisvgm.def}",
        r"\usepackage{fontspec}",
        r"\setmainfont{Malgun Gothic}",
        r"\setsansfont{Malgun Gothic}",
        r"\usepackage{amsmath}",
        r"\usepackage{amssymb}",
        r"\usepackage{pgfplots}",
        r"\pgfplotsset{compat=1.18}",
        r"\pagestyle{empty}",
        r"\begin{document}",
        rf"\begin{{tikzpicture}}",
        rf"\begin{{axis}}[width={fmt(width)}cm,height={fmt(height)}cm,{aspect},axis lines={axis_lines},grid={grid},xmin={fmt(x_min)},xmax={fmt(x_max)},ymin={fmt(y_min)},ymax={fmt(y_max)},xlabel={{{x_label}}},ylabel={{{y_label}}},clip=true]",
    ]
    points = by_id(data.get("points", []))
    lines_by_id = by_id(data.get("lines", []))
    segments = by_id(data.get("segments", []))
    circles = by_id(data.get("circles", []))
    graphs = by_id(data.get("functionGraphs", []))
    labels = by_id(data.get("labels", []))
    annotations = by_id(data.get("annotations", []))
    auxiliaries = by_id(data.get("auxiliaryLines", []))
    emphasis = {item["target"]: item for item in data.get("emphasis", [])}
    occupied: list[tuple[float, float]] = []
    for component in component_order(data):
        kind = component["kind"]
        ref = component.get("ref")
        if kind == "AXIS":
            continue
        if kind in {"POINT", "INTERSECTION"}:
            item = points.get(ref)
            if not item:
                fail(f"{kind} refers to unknown point {ref!r}")
            st = emphasis.get(ref, item).get("color", "black")
            px, py = number(item["x"], ref), number(item["y"], ref)
            if kind == "INTERSECTION" and component.get("refs") and all(r in lines_by_id for r in component["refs"]):
                hit = line_intersection(line_coefficients(lines_by_id[component["refs"][0]], component["refs"][0]), line_coefficients(lines_by_id[component["refs"][1]], component["refs"][1]))
                if hit is not None:
                    px, py = hit
            lines.append(rf"\addplot[only marks,mark=*,mark size=1.8pt,{st}] coordinates {{({fmt(px)},{fmt(py)})}};")
            occupied.append((px, py))
        elif kind == "POINT_LABEL":
            item = points.get(ref) or labels.get(ref)
            if not item:
                fail(f"POINT_LABEL refers to unknown object {ref!r}")
            if "at" in item:
                x, y = coordinate(item["at"], ref)
                text = item["text"]
            else:
                x, y = number(item["x"], ref), number(item["y"], ref)
                text = item.get("label", ref)
            anchor = tex(item.get("anchor")) if item.get("anchor") else position_anchor(item.get("position", "AUTO"), x, y, vp, occupied)
            rendered = label_content({"text": text, "kind": item.get("kind"), "math": item.get("math", False)})
            lines.append(rf"\node[anchor={anchor}] at (axis cs:{fmt(x)},{fmt(y)}) {{{rendered}}};")
            occupied.append((x, y))
        elif kind == "LINE":
            item = lines_by_id.get(ref)
            if not item:
                fail(f"LINE refers to unknown line {ref!r}")
            lo, hi = item.get("domain", [x_min, x_max])
            lo, hi = number(lo, "line.domain[0]"), number(hi, "line.domain[1]")
            a, b, c = line_coefficients(item, ref)
            pts = [(x, (-a * x - c) / b) for x in [lo + (hi-lo)*i/80 for i in range(81)]] if abs(b) > 1e-12 else [(number(-c / a, ref), y_min + (y_max-y_min)*i/80) for i in range(81)]
            coords = " ".join(f"({fmt(x)},{fmt(y)})" for x, y in pts)
            lines.append(rf"\addplot[{style(item.get('style'), 'blue')}] coordinates {{{coords}}};")
        elif kind == "SEGMENT":
            item = segments.get(ref)
            if not item:
                fail(f"SEGMENT refers to unknown segment {ref!r}")
            a, b = coordinate(item["from"], ref+".from"), coordinate(item["to"], ref+".to")
            lines.append(rf"\draw[{style(item.get('style'), 'black')}] (axis cs:{fmt(a[0])},{fmt(a[1])}) -- (axis cs:{fmt(b[0])},{fmt(b[1])});")
        elif kind == "CIRCLE":
            item = circles.get(ref)
            if not item:
                fail(f"CIRCLE refers to unknown circle {ref!r}")
            c = coordinate(item["center"], ref+".center")
            r = number(item["radius"], ref+".radius")
            lines.append(rf"\draw[{style(item.get('style'), 'red')}] (axis cs:{fmt(c[0])},{fmt(c[1])}) circle [radius={fmt(r)}];")
        elif kind == "FUNCTION_GRAPH":
            item = graphs.get(ref)
            if not item:
                fail(f"FUNCTION_GRAPH refers to unknown graph {ref!r}")
            pts = samples(item["expression"], item["domain"], item.get("samples", 81))
            coords = " ".join(f"({fmt(x)},{fmt(y)})" for x, y in pts)
            lines.append(rf"\addplot[{style(item.get('style'), 'blue')}] coordinates {{{coords}}};")
            if item.get("label"):
                lines.append(rf"\node[anchor=west] at (axis cs:{fmt(pts[-1][0])},{fmt(pts[-1][1])}) {{{math_label(item['label'])}}};")
        elif kind in {"EQUATION_LABEL", "GRAPH_ANNOTATION"}:
            item = labels.get(ref) or annotations.get(ref)
            if not item:
                fail(f"{kind} refers to unknown label {ref!r}")
            x, y = coordinate(item["at"], ref)
            anchor = tex(item.get("anchor")) if item.get("anchor") else position_anchor(item.get("position", "AUTO"), x, y, vp, occupied)
            label = label_content(item)
            lines.append(rf"\node[anchor={anchor}] at (axis cs:{fmt(x)},{fmt(y)}) {{{label}}};")
            occupied.append((x, y))
        elif kind == "AUXILIARY_LINE":
            item = auxiliaries.get(ref)
            if not item:
                fail(f"AUXILIARY_LINE refers to unknown line {ref!r}")
            st = style(item.get("style"), "gray")
            value = number(item["value"], ref+".value")
            if item["orientation"] == "vertical":
                lines.append(rf"\draw[{st}] (axis cs:{fmt(value)},{fmt(y_min)}) -- (axis cs:{fmt(value)},{fmt(y_max)});")
            else:
                lines.append(rf"\draw[{st}] (axis cs:{fmt(x_min)},{fmt(value)}) -- (axis cs:{fmt(x_max)},{fmt(value)});")
        elif kind == "CONDITION_BOX":
            box = data.get("conditionBox")
            if not box:
                fail("CONDITION_BOX requested without conditionBox")
            x, y = coordinate(box["at"], "conditionBox.at")
            if box.get("lines"):
                rendered_lines = []
                for row in box["lines"]:
                    rendered_lines.append(math_label(row["text"]) if row.get("math") else tex(row["text"]))
                box_text = r"\shortstack[l]{" + r"\\[2pt]".join(rendered_lines) + "}"
            else:
                box_text = tex(box.get("text", "")).replace("\n", r"\\[2pt]")
            box_width = number(box.get("width", box.get("maxWidth", 3.8)), "conditionBox.width")
            box_width = max(number(box.get("minWidth", 2.2), "conditionBox.minWidth"), box_width)
            if "maxWidth" in box:
                box_width = min(box_width, number(box["maxWidth"], "conditionBox.maxWidth"))
            padding = number(box.get("padding", 3), "conditionBox.padding")
            lines.append(rf"\node[draw,rounded corners,inner sep={fmt(padding)}pt,align=left,anchor={tex(box.get('anchor','north west'))},text width={fmt(box_width)}cm] at (axis cs:{fmt(x)},{fmt(y)}) {{{box_text}}};")
        elif kind in {"PARALLEL", "PERPENDICULAR"}:
            refs = component.get("refs", [])
            if len(refs) != 2:
                fail(f"{kind} requires two refs")
            lines.append(rf"% verified relation {kind}: {tex(refs[0])} / {tex(refs[1])}")
        elif kind == "TANGENT":
            options = component.get("options", {})
            lines.append(rf"% verified tangent: {tex(options.get('lineRef',''))} / {tex(options.get('curveRef',''))}")
        elif kind == "LENGTH_LABEL":
            item = labels.get(ref) or annotations.get(ref)
            if not item:
                fail(f"LENGTH_LABEL refers to unknown label {ref!r}")
            x, y = coordinate(item["at"], ref)
            lines.append(rf"\node[anchor={tex(item.get('anchor','south west'))}] at (axis cs:{fmt(x)},{fmt(y)}) {{{label_content(item, True)}}};")
        elif kind == "PERPENDICULAR_MARK":
            opt = component.get("options", {})
            refs = component.get("refs", [])
            if len(refs) != 2:
                fail("PERPENDICULAR_MARK requires verified refs")
            x, y = coordinate(opt.get("at", [0, 0]), "PERPENDICULAR_MARK.at")
            size = number(opt.get("size", 0.2), "PERPENDICULAR_MARK.size")
            lines.append(rf"\node[draw,inner sep=1pt,font=\scriptsize] at (axis cs:{fmt(x+size)},{fmt(y+size)}) {{$\square$}};")
        elif kind == "ANGLE_MARK":
            opt = component.get("options", {})
            x, y = coordinate(opt.get("at", [0, 0]), "ANGLE_MARK.at")
            radius = number(opt.get("radius", 0.25), "ANGLE_MARK.radius")
            start, end = number(opt.get("start", 0), "ANGLE_MARK.start"), number(opt.get("end", 90), "ANGLE_MARK.end")
            lines.append(rf"\draw (axis cs:{fmt(x)},{fmt(y)}) ++({fmt(radius)}:{fmt(start)}) arc[start angle={fmt(start)},end angle={fmt(end)},radius={fmt(radius)}];")
        else:
            fail(f"unsupported semantic component {kind!r}")
    lines.extend([r"\end{axis}", r"\end{tikzpicture}", r"\end{document}", ""])
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--tex", type=Path, required=True)
    parser.add_argument("--witness", type=Path, required=True)
    args = parser.parse_args()
    data = json.loads(args.input.read_text(encoding="utf-8"))
    validate(data)
    derived, suggestion = derive_facts(data)
    canonical = json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    output = emit(data)
    args.tex.parent.mkdir(parents=True, exist_ok=True)
    args.witness.parent.mkdir(parents=True, exist_ok=True)
    args.tex.write_text(output, encoding="utf-8", newline="\n")
    args.witness.write_text(json.dumps({
        "schema": "APMATH_GOLD_TEX_WITNESS_v1",
        "generator": "artifacts/tex-pilot/gold-pilot/generator/generate.py",
        "inputSha256": hashlib.sha256(canonical.encode("utf-8")).hexdigest(),
        "texSha256": hashlib.sha256(output.encode("utf-8")).hexdigest(),
        "objectCount": sum(len(data.get(k, [])) for k in ("points", "lines", "segments", "circles", "functionGraphs", "labels", "annotations", "auxiliaryLines")),
        "componentKinds": [component["kind"] for component in component_order(data)],
        "numericAuthority": "python-sampled-coordinates",
        "derivedFacts": derived,
        "aspectPolicy": "equal-unit" if data["visualType"] in {"coordinate_geometry", "line_circle_geometry", "explanation_card"} else "readability",
        "styleTokens": data.get("styleTokens", STYLE_TOKENS),
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
