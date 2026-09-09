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
    return "$" + str(text).replace("\\", "\\\\") + "$"


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
    for graph in data.get("functionGraphs", []):
        samples(graph["expression"], graph["domain"], graph.get("samples", 81))


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


def emit(data: dict[str, Any]) -> str:
    vp = data["viewport"]
    axes = data.get("axes", {})
    x_min, x_max = number(vp["xMin"], "xMin"), number(vp["xMax"], "xMax")
    y_min, y_max = number(vp["yMin"], "yMin"), number(vp["yMax"], "yMax")
    width = number(vp.get("width", 10), "viewport.width")
    height = number(vp.get("height", 7), "viewport.height")
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
        r"\usepackage{amssymb}",
        r"\usepackage{pgfplots}",
        r"\pgfplotsset{compat=1.18}",
        r"\pagestyle{empty}",
        r"\begin{document}",
        rf"\begin{{tikzpicture}}",
        rf"\begin{{axis}}[width={fmt(width)}cm,height={fmt(height)}cm,axis equal image,axis lines={axis_lines},grid={grid},xmin={fmt(x_min)},xmax={fmt(x_max)},ymin={fmt(y_min)},ymax={fmt(y_max)},xlabel={{{x_label}}},ylabel={{{y_label}}},clip=true]",
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
            lines.append(rf"\addplot[only marks,mark=*,mark size=1.8pt,{st}] coordinates {{({fmt(item['x'])},{fmt(item['y'])})}};")
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
            lines.append(rf"\node[anchor={tex(item.get('anchor','south west'))}] at (axis cs:{fmt(x)},{fmt(y)}) {{{tex(text)}}};")
        elif kind == "LINE":
            item = lines_by_id.get(ref)
            if not item:
                fail(f"LINE refers to unknown line {ref!r}")
            lo, hi = item.get("domain", [x_min, x_max])
            lo, hi = number(lo, "line.domain[0]"), number(hi, "line.domain[1]")
            pts = [(x, number(item["slope"], "slope") * x + number(item["intercept"], "intercept")) for x in [lo + (hi-lo)*i/80 for i in range(81)]]
            coords = " ".join(f"({fmt(x)},{fmt(y)})" for x, y in pts)
            lines.append(rf"\addplot[{style(item.get('style'), 'blue')}] coordinates {{{coords}}};")
            if item.get("equation"):
                lines.append(rf"\node[anchor=south west] at (axis cs:{fmt(lo)},{fmt(number(item['slope'],'slope')*lo+number(item['intercept'],'intercept'))}) {{{math_label(item['equation'])}}};")
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
            label = math_label(item["text"]) if item.get("kind") == "equation" else tex(item["text"])
            lines.append(rf"\node[anchor={tex(item.get('anchor','south west'))}] at (axis cs:{fmt(x)},{fmt(y)}) {{{label}}};")
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
            box_text = tex(box["text"]).replace("\n", r"\\")
            lines.append(rf"\node[draw,rounded corners,align=left,anchor={tex(box.get('anchor','north west'))},text width={fmt(number(box.get('width',4),'conditionBox.width'))}cm] at (axis cs:{fmt(x)},{fmt(y)}) {{{box_text}}};")
        elif kind == "PERPENDICULAR_MARK":
            opt = component.get("options", {})
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
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
