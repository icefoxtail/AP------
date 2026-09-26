from __future__ import annotations

import csv
import html
import json
import math
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
ARCHIVE = ROOT / "archive"

NUMBER = r"[-+]?\d+(?:\.\d+)?(?:\s*/\s*[-+]?\d+)?"
FRACTION = r"\\frac\{[-+]?\d+(?:\.\d+)?\}\{[-+]?\d+(?:\.\d+)?\}"
COORDINATE_TOKEN = rf"(?:{FRACTION}|{NUMBER})"
PAIR_RE = re.compile(rf"\(\s*({COORDINATE_TOKEN})\s*,\s*({COORDINATE_TOKEN})\s*\)")
LABEL_PAIR_RE = re.compile(rf"\b([A-Z][A-Za-z']?)\s*\(\s*({COORDINATE_TOKEN})\s*,\s*({COORDINATE_TOKEN})\s*\)")


def parse_number(value: str) -> float:
    value = value.strip().replace(" ", "")
    fraction = re.fullmatch(r"\\frac\{([-+]?\d+(?:\.\d+)?)\}\{([-+]?\d+(?:\.\d+)?)\}", value)
    if fraction:
        numerator, denominator = float(fraction.group(1)), float(fraction.group(2))
        if denominator == 0:
            raise ValueError("zero denominator")
        return numerator / denominator
    if "/" in value:
        numerator, denominator = value.split("/", 1)
        if float(denominator) == 0:
            raise ValueError("zero denominator")
        return float(numerator) / float(denominator)
    return float(value)


def plain_text(value: str) -> str:
    value = value.replace("<br>", " ").replace("&nbsp;", " ")
    value = value.replace("\\left", "").replace("\\right", "")
    value = re.sub(r"\\frac\{([^{}]+)\}\{([^{}]+)\}", r"\1/\2", value)
    value = value.replace("\\sqrt", "√").replace("\\times", "×")
    value = value.replace("\\cdot", "·").replace("\\pm", "±")
    value = value.replace("$", "").replace("{", "").replace("}", "")
    value = value.replace("\\,", " ").replace("\\", "")
    value = re.sub(r"\s+", " ", value).strip()
    return value


def extract_points(row: dict[str, Any]) -> tuple[list[dict[str, Any]], list[str]]:
    text = f"{row.get('content', '')}\n{row.get('solution', '')}"
    labelled: dict[tuple[float, float], str] = {}
    for match in LABEL_PAIR_RE.finditer(text):
        try:
            point = (parse_number(match.group(2)), parse_number(match.group(3)))
        except ValueError:
            continue
        labelled.setdefault(point, match.group(1))
    points: list[dict[str, Any]] = []
    seen: set[tuple[float, float]] = set()
    for match in PAIR_RE.finditer(text):
        try:
            point = (parse_number(match.group(1)), parse_number(match.group(2)))
        except ValueError:
            continue
        if not all(math.isfinite(item) for item in point) or point in seen:
            continue
        seen.add(point)
        points.append({"x": point[0], "y": point[1], "label": labelled.get(point, f"P{len(points) + 1}")})
    return points, plain_text(text)


def clamp_text(value: str, limit: int = 55) -> str:
    value = plain_text(value)
    return value if len(value) <= limit else value[: limit - 1] + "…"


def visual_kind(row: dict[str, Any], points: list[dict[str, Any]]) -> str:
    unit = row["mappedUnitKey"]
    sub = f"{row.get('subUnitKey', '')} {row.get('subUnit', '')}"
    content = plain_text(f"{row.get('content', '')} {row.get('solution', '')}")
    if unit == "H22-C2-01":
        if len(points) >= 3 and re.search(r"삼각형|무게중심|넓이|centroid|area", f"{sub} {content}", re.I):
            return "triangle"
        if len(points) >= 2:
            return "segment"
        return "coordinate_relation"
    if unit == "H22-C2-02":
        if len(points) >= 2:
            return "line_points"
        return "line_relation"
    if unit == "H22-C2-04":
        if len(points) >= 2:
            return "transformation_points"
        return "transformation_relation"
    return "coordinate_relation"


def ranges_for(points: list[dict[str, Any]]) -> tuple[float, float, float, float]:
    if not points:
        return -6.0, 6.0, -5.0, 5.0
    xs = [point["x"] for point in points]
    ys = [point["y"] for point in points]
    x_min, x_max = min(xs), max(xs)
    y_min, y_max = min(ys), max(ys)
    x_span = max(4.0, x_max - x_min)
    y_span = max(4.0, y_max - y_min)
    x_margin = max(1.5, x_span * 0.28)
    y_margin = max(1.5, y_span * 0.28)
    return math.floor(x_min - x_margin), math.ceil(x_max + x_margin), math.floor(y_min - y_margin), math.ceil(y_max + y_margin)


def svg_escape(value: str) -> str:
    return html.escape(str(value), quote=True)


def fmt_number(value: float) -> str:
    if abs(value - round(value)) < 1e-9:
        return str(int(round(value)))
    return f"{value:.3f}".rstrip("0").rstrip(".")


# Historical extraction compatibility only; never geometry authority.
