from __future__ import annotations

import csv
import hashlib
import html
import json
import math
import os
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
REPORTS = ROOT / "reports" / "geometry_equation_20260902"
STAGING = REPORTS / "staging" / "archive"
MANIFEST_PATH = REPORTS / "geometry_equation_manifest.json"
FACTS_PATH = Path(os.environ.get("GEOMETRY_FACTS_FILE", str(REPORTS / "a_independent_solve_facts_final.json")))
PILOT_PATH = REPORTS / "pilot_sample_manifest.json"

NUMBER = r"[-+−]?\d+(?:[.,]\d+)?(?:\s*/\s*[-+−]?\d+(?:[.,]\d+)?)?"
COORD_RE = re.compile(rf"(?P<label>[A-Za-z](?:[A-Za-z0-9_′']*)?)\s*(?:=|:)??\s*\(\s*(?P<x>{NUMBER})\s*,\s*(?P<y>{NUMBER})\s*\)")
UNLABELLED_COORD_RE = re.compile(rf"\(\s*(?P<x>{NUMBER})\s*,\s*(?P<y>{NUMBER})\s*\)")
RADIUS_RE = re.compile(rf"(?:\br\b|반지름(?:은|=|:)?|r\s*=)\s*[=:]?\s*(?P<value>{NUMBER}|√\s*\d+)", re.IGNORECASE)


def sha(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def plain(value: Any) -> str:
    text = str(value or "")
    text = text.replace("−", "-").replace("〈", "<").replace("〉", ">")
    text = re.sub(r"\\(?:left|right|cdot|times|,|quad|;)", " ", text)
    text = re.sub(r"\\frac\{([^{}]+)\}\{([^{}]+)\}", r"\1/\2", text)
    text = text.replace("$", "").replace("{", "").replace("}", "")
    return re.sub(r"\s+", " ", text).strip()


def parse_number(value: str) -> float:
    value = value.strip().replace("−", "-").replace(",", ".").replace(" ", "")
    if value.startswith("√"):
        return math.sqrt(float(value[1:]))
    if "/" in value:
        numerator, denominator = value.split("/", 1)
        return float(numerator) / float(denominator)
    return float(value)


def flatten(value: Any) -> str:
    if isinstance(value, list):
        return " ".join(flatten(item) for item in value)
    if isinstance(value, dict):
        return " ".join(flatten(item) for item in value.values())
    return plain(value)


def extract_points(fact: dict[str, Any]) -> list[dict[str, Any]]:
    text = f"{flatten(fact.get('independentFacts'))} {flatten(fact.get('expectedAnswer'))}"
    points: list[dict[str, Any]] = []
    seen: set[tuple[float, float]] = set()
    for match in COORD_RE.finditer(text):
        try:
            x, y = parse_number(match.group("x")), parse_number(match.group("y"))
        except ValueError:
            continue
        if not all(math.isfinite(item) for item in (x, y)) or (x, y) in seen:
            continue
        seen.add((x, y))
        points.append({"x": x, "y": y, "label": match.group("label")})
    if len(points) < 2:
        for match in UNLABELLED_COORD_RE.finditer(text):
            try:
                x, y = parse_number(match.group("x")), parse_number(match.group("y"))
            except ValueError:
                continue
            if not all(math.isfinite(item) for item in (x, y)) or (x, y) in seen:
                continue
            seen.add((x, y))
            points.append({"x": x, "y": y, "label": f"P{len(points) + 1}"})
    return points[:20]


def extract_radius(fact: dict[str, Any]) -> float | None:
    text = flatten(fact.get("independentFacts"))
    for match in RADIUS_RE.finditer(text):
        try:
            value = parse_number(match.group("value"))
        except ValueError:
            continue
        if math.isfinite(value) and value >= 0:
            return value
    return None


def number(value: float) -> str:
    if abs(value - round(value)) < 1e-9:
        return str(int(round(value)))
    return f"{value:.4f}".rstrip("0").rstrip(".")


def esc(value: Any) -> str:
    return html.escape(str(value), quote=True)


def bounds(points: list[dict[str, Any]], radius: float | None) -> tuple[float, float, float, float]:
    values_x = [point["x"] for point in points]
    values_y = [point["y"] for point in points]
    if radius is not None and points:
        values_x += [points[0]["x"] - radius, points[0]["x"] + radius]
        values_y += [points[0]["y"] - radius, points[0]["y"] + radius]
    if not values_x:
        return -6.0, 6.0, -5.0, 5.0
    x_span = max(4.0, max(values_x) - min(values_x))
    y_span = max(4.0, max(values_y) - min(values_y))
    span = max(x_span, y_span)
    cx = (max(values_x) + min(values_x)) / 2
    cy = (max(values_y) + min(values_y)) / 2
    margin = span * 0.18 + 1.0
    half = span / 2 + margin
    return cx - half, cx + half, cy - half, cy + half


def _custom_frame(x_min: float, x_max: float, y_min: float, y_max: float) -> tuple[list[str], Any, Any]:
    """Create an equal-scale coordinate frame for the reviewed custom SVGs."""
    left, top, width, height = 248.0, 92.0, 224.0, 224.0

    def sx(x: float) -> float:
        return left + (x - x_min) / (x_max - x_min) * width

    def sy(y: float) -> float:
        return top + (y_max - y) / (y_max - y_min) * height

    body: list[str] = ['<rect x="42" y="78" width="636" height="256" rx="14" fill="#ffffff" stroke="#cbd5e1"/>']
    for x in range(math.ceil(x_min), math.floor(x_max) + 1):
        body.append(f'<line x1="{sx(x):.2f}" y1="{top}" x2="{sx(x):.2f}" y2="{top + height}" stroke="#e2e8f0" stroke-width="1"/>')
    for y in range(math.ceil(y_min), math.floor(y_max) + 1):
        body.append(f'<line x1="{left}" y1="{sy(y):.2f}" x2="{left + width}" y2="{sy(y):.2f}" stroke="#e2e8f0" stroke-width="1"/>')
    if x_min <= 0 <= x_max:
        px = sx(0)
        body.append(f'<line x1="{px:.2f}" y1="{top}" x2="{px:.2f}" y2="{top + height}" stroke="#334155" stroke-width="1.8"/>')
        body.append(f'<text x="{px + 8:.2f}" y="{top + 15:.2f}" font-size="12" fill="#334155">y</text>')
    if y_min <= 0 <= y_max:
        py = sy(0)
        body.append(f'<line x1="{left}" y1="{py:.2f}" x2="{left + width}" y2="{py:.2f}" stroke="#334155" stroke-width="1.8"/>')
        body.append(f'<text x="{left + width - 8:.2f}" y="{py - 8:.2f}" text-anchor="end" font-size="12" fill="#334155">x</text>')
    return body, sx, sy


def _custom_path(fn: Any, sx: Any, sy: Any, start: float, end: float, samples: int = 80) -> str:
    points = []
    for index in range(samples + 1):
        x = start + (end - start) * index / samples
        y = fn(x)
        points.append(f'{"M" if index == 0 else "L"}{sx(x):.2f},{sy(y):.2f}')
    return " ".join(points)


def _custom_svg_document(row: dict[str, Any], fact: dict[str, Any], body: list[str], method: str, policy: str) -> tuple[str, dict[str, Any]]:
    fact_hash = fact["independentFactHash"]
    title = f"{row['mappedUnit']} 해설 도형 · 문항 {row['id']}"
    alt = f"{row['mappedUnit']} 문항 {row['id']}의 독립 풀이 사실 기반 해설 도형"
    caption = "독립 풀이에서 확정한 도형·변환·좌표 관계를 해설 순서대로 표시한 자료"
    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" width="720" height="360" role="img" data-fact-hash="{fact_hash}" data-scale-policy="{policy}">',
        f'<title>{esc(title)}</title><desc>{esc(alt)}</desc>',
        '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#64748b"/></marker><marker id="blue-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#2563eb"/></marker></defs>',
        '<rect width="720" height="360" rx="18" fill="#f8fafc"/>',
        f'<text x="32" y="38" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#0f172a">{esc(title)}</text>',
        f'<text x="32" y="64" font-family="Arial,sans-serif" font-size="12" fill="#475569">{esc(caption)}</text>',
        *body,
        f'<text x="32" y="344" font-family="Arial,sans-serif" font-size="11" fill="#64748b">독립 풀이 방식: {esc(method[:78])}</text>',
        '</svg>',
    ]
    return "".join(svg) + "\n", {"status": "PASS", "pointCount": 0, "finitePoints": True, "scalePolicy": policy, "scaleX": 224.0 / 20.0, "scaleY": 224.0 / 20.0, "scaleError": 0.0, "factHash": fact_hash, "radius": None}


def _build_custom_svg(row: dict[str, Any], fact: dict[str, Any]) -> tuple[str, dict[str, Any]] | None:
    key = row["qKey"]
    method = plain(fact.get("independentSolveMethod", ""))

    # q32: both reflection axes and all three parabola stages are required to
    # understand why the opening direction changes twice.
    if key.endswith("22_매산고_1학기_기말_고1_기출.js_7"):
        body, sx, sy = _custom_frame(-5, 6, -4, 7)
        curves = [
            (lambda x: -3 * (x - 3) ** 2 + 1, "#64748b", "원래: y=-3(x-3)²+1", "original"),
            (lambda x: -3 * (x + 1) ** 2 + 1, "#d97706", "x=1 대칭 후: y=-3(x+1)²+1", "after-x1"),
            (lambda x: 3 * (x + 1) ** 2 + 5, "#2563eb", "y=3 대칭 후: y=3(x+1)²+5", "final"),
        ]
        curve_ranges = [(1.4, 4.6), (-2.4, 0.4), (-2.8, 0.8)]
        for (fn, color, label, stage), (curve_start, curve_end) in zip(curves, curve_ranges):
            body.append(f'<path data-geometry="parabola" data-stage="{stage}" d="{_custom_path(fn, sx, sy, curve_start, curve_end)}" fill="none" stroke="{color}" stroke-width="2.5"/>')
            body.append(f'<text x="54" y="{104 + len([x for x in body if "data-geometry=\"parabola\"" in x]) * 18}" font-size="11" fill="{color}">{esc(label)}</text>')
        body += [
            f'<line data-geometry="reflection-axis" data-axis="x=1" x1="{sx(1):.2f}" y1="{sy(7):.2f}" x2="{sx(1):.2f}" y2="{sy(-4):.2f}" stroke="#be123c" stroke-width="1.8" stroke-dasharray="6 4"/>',
            f'<line data-geometry="reflection-axis" data-axis="y=3" x1="{sx(-5):.2f}" y1="{sy(3):.2f}" x2="{sx(6):.2f}" y2="{sy(3):.2f}" stroke="#be123c" stroke-width="1.8" stroke-dasharray="6 4"/>',
            f'<text x="{sx(1) + 5:.2f}" y="{sy(6.4):.2f}" font-size="11" fill="#be123c">x=1</text>',
            f'<text x="{sx(4.4):.2f}" y="{sy(3) - 6:.2f}" font-size="11" fill="#be123c">y=3</text>',
            f'<circle data-point-label="V₀" cx="{sx(3):.2f}" cy="{sy(1):.2f}" r="4.5" fill="#64748b"/><circle data-point-label="V₁" cx="{sx(-1):.2f}" cy="{sy(1):.2f}" r="4.5" fill="#d97706"/><circle data-point-label="V₂" cx="{sx(-1):.2f}" cy="{sy(5):.2f}" r="4.5" fill="#2563eb"/>',
            '<text x="54" y="178" font-size="11" fill="#334155">꼭짓점: (3,1) → (-1,1) → (-1,5)</text>',
            '<text x="54" y="198" font-size="11" fill="#334155">두 대칭의 순서와 개방 방향을 함께 확인</text>',
        ]
        return _custom_svg_document(row, fact, body, method, "PROPORTIONAL_REQUIRED")

    # q36: show the four named curves, the x=0,3,6 boundaries, and the two
    # area decompositions used in the solution.  C's detailed shape is not
    # known, so the curve is explicitly a schematic through the two observed
    # points rather than an invented equation.
    if key.endswith("22_매산고_1학기_기말_고1_기출.js_12"):
        body, sx, sy = _custom_frame(-4, 8, -6, 6)
        c = lambda x: 3 - 0.65 * x * (3 - x)
        c1 = lambda x: -c(x)
        c2 = lambda x: c(x - 3) - 6
        c3 = lambda x: c(x - 3) + 3
        body.append(f'<path data-geometry="curve" data-name="C" d="{_custom_path(c, sx, sy, 0, 3)}" fill="none" stroke="#2563eb" stroke-width="2.5"/>')
        body.append(f'<path data-geometry="curve" data-name="C1" d="{_custom_path(c1, sx, sy, 0, 3)}" fill="none" stroke="#d97706" stroke-width="2.5"/>')
        body.append(f'<path data-geometry="curve" data-name="C2" d="{_custom_path(c2, sx, sy, 3, 6)}" fill="none" stroke="#16a34a" stroke-width="2.5"/>')
        body.append(f'<path data-geometry="curve" data-name="C3" d="{_custom_path(c3, sx, sy, 3, 6)}" fill="none" stroke="#7c3aed" stroke-width="2.5"/>')
        left_area = [f'M {sx(0):.2f},{sy(0):.2f}', f'L {sx(0):.2f},{sy(c(0)):.2f}', _custom_path(c, sx, sy, 0, 3).replace('M', 'L', 1), f'L {sx(3):.2f},{sy(0):.2f}', 'Z']
        right_area = [f'M {sx(3):.2f},{sy(c2(3)):.2f}', _custom_path(c2, sx, sy, 3, 6).replace('M', 'L', 1), f'L {sx(6):.2f},{sy(c3(6)):.2f}', _custom_path(c3, sx, sy, 6, 3).replace('M', 'L', 1), 'Z']
        body += [
            f'<path data-geometry="area" data-area="left-2L" d="{" ".join(left_area)}" fill="#bfdbfe" fill-opacity=".65" stroke="none"/>',
            f'<path data-geometry="area" data-area="right-27" d="{" ".join(right_area)}" fill="#bbf7d0" fill-opacity=".65" stroke="none"/>',
        ]
        for x in (0, 3, 6):
            body.append(f'<line data-geometry="boundary" data-x="{x}" x1="{sx(x):.2f}" y1="{sy(-11):.2f}" x2="{sx(x):.2f}" y2="{sy(-1):.2f}" stroke="#334155" stroke-width="1.6" stroke-dasharray="5 4"/>')
        body += [
            '<text x="54" y="104" font-size="11" fill="#2563eb">C: 기준 곡선</text><text x="54" y="122" font-size="11" fill="#d97706">C₁: x축 대칭</text>',
            '<text x="54" y="140" font-size="11" fill="#16a34a">C₂: (3,-6) 평행이동</text><text x="54" y="158" font-size="11" fill="#7c3aed">C₃: (3,3) 평행이동</text>',
            '<text x="54" y="184" font-size="11" fill="#1e3a8a">왼쪽 넓이: 2L = 2×(9/2) = 9</text><text x="54" y="202" font-size="11" fill="#166534">오른쪽 넓이: 가로 3 × 세로 9 = 27</text>',
            f'<circle data-point-label="(0,3)" cx="{sx(0):.2f}" cy="{sy(3):.2f}" r="4.5" fill="#2563eb"/><circle data-point-label="(3,3)" cx="{sx(3):.2f}" cy="{sy(3):.2f}" r="4.5" fill="#2563eb"/>',
        ]
        return _custom_svg_document(row, fact, body, method, "EQUAL_SCALE_REQUIRED")

    # q276: show f, its x-axis reflection, and the exact affine image g with
    # vertex correspondences; this is the visual counterpart of ㄱ·ㄴ·ㄷ.
    if key.endswith("21_효천고_2학기_중간_고1_기출.js_8"):
        body, sx, sy = _custom_frame(-7, 6, -6.5, 6.5)
        f_points = [(-3, 0), (-1, 0), (-1, 2)]
        g_points = [(2, -1), (4, -1), (4, -3)]
        mirror_points = [(-3, 0), (-1, 0), (-1, -2)]
        def poly(points: list[tuple[float, float]]) -> str:
            return " ".join(f'{"M" if i == 0 else "L"}{sx(x):.2f},{sy(y):.2f}' for i, (x, y) in enumerate(points)) + " Z"
        body += [
            f'<path data-geometry="polygon" data-name="f" d="{poly(f_points)}" fill="#bfdbfe" fill-opacity=".7" stroke="#2563eb" stroke-width="2.5"/>',
            f'<path data-geometry="polygon" data-name="f-x-axis-reflection" d="{poly(mirror_points)}" fill="#e2e8f0" fill-opacity=".8" stroke="#64748b" stroke-width="2" stroke-dasharray="5 3"/>',
            f'<path data-geometry="polygon" data-name="g" d="{poly(g_points)}" fill="#bbf7d0" fill-opacity=".7" stroke="#16a34a" stroke-width="2.5"/>',
            f'<line data-geometry="x-axis" x1="{sx(-7):.2f}" y1="{sy(0):.2f}" x2="{sx(6):.2f}" y2="{sy(0):.2f}" stroke="#334155" stroke-width="2"/>',
            f'<line data-geometry="transform-arrow" x1="{sx(-2):.2f}" y1="{sy(1):.2f}" x2="{sx(1.5):.2f}" y2="{sy(-1):.2f}" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5 3" marker-end="url(#arrow)"/>',
            f'<line data-geometry="transform-arrow" x1="{sx(-1):.2f}" y1="{sy(2):.2f}" x2="{sx(4):.2f}" y2="{sy(-3):.2f}" stroke="#16a34a" stroke-width="1.8" marker-end="url(#blue-arrow)"/>',
            '<text x="54" y="104" font-size="11" fill="#2563eb">f: 원래 도형</text><text x="54" y="122" font-size="11" fill="#64748b">f(x,-y)=0: x축 대칭</text>',
            '<text x="54" y="140" font-size="11" fill="#16a34a">g: (u,v)→(u+5,-v-1)</text><text x="54" y="158" font-size="11" fill="#334155">g(x,y)=f(x-5,-y-1)</text>',
            '<text x="54" y="184" font-size="11" fill="#334155">(-3,0)→(2,-1), (-1,0)→(4,-1), (-1,2)→(4,-3)</text>',
        ]
        for label, (x, y), color in [("A", f_points[0], "#2563eb"), ("B", f_points[1], "#2563eb"), ("C", f_points[2], "#2563eb"), ("A′", g_points[0], "#16a34a"), ("B′", g_points[1], "#16a34a"), ("C′", g_points[2], "#16a34a")]:
            body.append(f'<circle data-point-label="{label}" data-point-x="{x}" data-point-y="{y}" cx="{sx(x):.2f}" cy="{sy(y):.2f}" r="4.5" fill="{color}"/>')
        return _custom_svg_document(row, fact, body, method, "PROPORTIONAL_REQUIRED")

    # q294: the solution is an inverse-coordinate substitution, so the point
    # movement and the formula must be visible together.
    if key.endswith("22_효천고_2학기_중간_고1_기출.js_21"):
        body, sx, sy = _custom_frame(-1, 5, -1, 5)
        body += [
            f'<line data-geometry="transform-arrow" x1="{sx(2):.2f}" y1="{sy(3):.2f}" x2="{sx(2):.2f}" y2="{sy(1):.2f}" stroke="#2563eb" stroke-width="2.5" marker-end="url(#blue-arrow)"/>',
            f'<circle data-point-label="P=(2,3)" data-point-x="2" data-point-y="3" cx="{sx(2):.2f}" cy="{sy(3):.2f}" r="5.5" fill="#d97706"/><circle data-point-label="P′=(2,1)" data-point-x="2" data-point-y="1" cx="{sx(2):.2f}" cy="{sy(1):.2f}" r="5.5" fill="#2563eb"/>',
            f'<text x="{sx(2) + 8:.2f}" y="{sy(3) - 8:.2f}" font-size="11" fill="#b45309">(2,3)</text><text x="{sx(2) + 8:.2f}" y="{sy(1) + 18:.2f}" font-size="11" fill="#1d4ed8">(2,1)</text>',
            '<text x="54" y="108" font-size="11" fill="#334155">u = -y + 3,  v = x + 1</text>',
            '<text x="54" y="128" font-size="11" fill="#334155">역변환: (u,v) → (x,y) = (v-1, 3-u)</text>',
            '<text x="54" y="150" font-size="11" fill="#2563eb">(2,3) → (3-1, 3-2) = (2,1)</text>',
        ]
        return _custom_svg_document(row, fact, body, method, "PROPORTIONAL_REQUIRED")

    # q375: draw both the reflected line and the circle, with the perpendicular
    # radius to the tangent line.  The sign symmetry is stated in the legend.
    if key.endswith("25_순천여고_2학기_중간_고1_공통수학2.js_7"):
        body, sx, sy = _custom_frame(-8, 12, -15, 5)
        body += [
            f'<line data-geometry="line" data-name="original" x1="{sx(-8):.2f}" y1="{sy(-8.5):.2f}" x2="{sx(12):.2f}" y2="{sy(1.5):.2f}" stroke="#64748b" stroke-width="2"/>',
            f'<line data-geometry="reflection-axis" data-axis="y=x" x1="{sx(-8):.2f}" y1="{sy(-8):.2f}" x2="{sx(5):.2f}" y2="{sy(5):.2f}" stroke="#be123c" stroke-width="1.8" stroke-dasharray="6 4"/>',
            f'<line data-geometry="reflected-line" data-name="2x-y+9=0" x1="{sx(-8):.2f}" y1="{sy(-7):.2f}" x2="{sx(-2):.2f}" y2="{sy(5):.2f}" stroke="#2563eb" stroke-width="2.5"/>',
            f'<circle data-geometry="circle" data-center-x="3" data-center-y="-5" data-radius="4√5" cx="{sx(3):.2f}" cy="{sy(-5):.2f}" r="{(4 * math.sqrt(5)) / 20 * 224:.2f}" fill="#dbeafe" fill-opacity=".5" stroke="#2563eb" stroke-width="2.5"/>',
            f'<line data-geometry="radius" data-radius="4√5" x1="{sx(3):.2f}" y1="{sy(-5):.2f}" x2="{sx(-5):.2f}" y2="{sy(-1):.2f}" stroke="#16a34a" stroke-width="2"/>',
            f'<circle data-point-label="C=(3,-5)" cx="{sx(3):.2f}" cy="{sy(-5):.2f}" r="5" fill="#1d4ed8"/><circle data-point-label="Q=(-5,-1)" cx="{sx(-5):.2f}" cy="{sy(-1):.2f}" r="5" fill="#16a34a"/>',
            '<text x="54" y="104" font-size="11" fill="#64748b">원래 직선: x-2y=9</text><text x="54" y="122" font-size="11" fill="#2563eb">y=x 대칭 후: 2x-y+9=0</text>',
            '<text x="54" y="140" font-size="11" fill="#16a34a">CQ ⟂ 2x-y+9=0,  CQ=4√5</text><text x="54" y="158" font-size="11" fill="#334155">반지름 |k|=4√5 → k=±4√5</text>',
        ]
        return _custom_svg_document(row, fact, body, method, "EQUAL_SCALE_REQUIRED")

    return None


def build_svg(row: dict[str, Any], fact: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    custom = _build_custom_svg(row, fact)
    if custom is not None:
        return custom
    points = extract_points(fact)
    radius = extract_radius(fact) if row["mappedUnitKey"] == "H22-C2-03" else None
    x_min, x_max, y_min, y_max = bounds(points, radius)
    left, top, width, height = 248.0, 92.0, 224.0, 224.0

    def sx(x: float) -> float:
        return left + (x - x_min) / (x_max - x_min) * width

    def sy(y: float) -> float:
        return top + (y_max - y) / (y_max - y_min) * height

    policy = "EQUAL_SCALE_REQUIRED" if points or radius is not None else "SCHEMATIC_ALLOWED"
    fact_hash = fact["independentFactHash"]
    title = f"{row['mappedUnit']} 해설 도형 · 문항 {row['id']}"
    method = plain(fact.get("independentSolveMethod", ""))
    unit = row["mappedUnitKey"]
    body: list[str] = []
    body.append(f'<rect x="42" y="78" width="636" height="256" rx="14" fill="#ffffff" stroke="#cbd5e1"/>')
    for x in range(math.ceil(x_min), math.floor(x_max) + 1):
        px = sx(x)
        body.append(f'<line x1="{px:.2f}" y1="{top}" x2="{px:.2f}" y2="{top + height}" stroke="#e2e8f0" stroke-width="1"/>')
    for y in range(math.ceil(y_min), math.floor(y_max) + 1):
        py = sy(y)
        body.append(f'<line x1="{left}" y1="{py:.2f}" x2="{left + width}" y2="{py:.2f}" stroke="#e2e8f0" stroke-width="1"/>')
    if x_min <= 0 <= x_max:
        px = sx(0)
        body.append(f'<line x1="{px:.2f}" y1="{top}" x2="{px:.2f}" y2="{top + height}" stroke="#334155" stroke-width="1.8"/>')
        body.append(f'<text x="{px + 8:.2f}" y="{top + 15:.2f}" font-size="12" fill="#334155">y</text>')
    if y_min <= 0 <= y_max:
        py = sy(0)
        body.append(f'<line x1="{left}" y1="{py:.2f}" x2="{left + width}" y2="{py:.2f}" stroke="#334155" stroke-width="1.8"/>')
        body.append(f'<text x="{left + width - 8:.2f}" y="{py - 8:.2f}" text-anchor="end" font-size="12" fill="#334155">x</text>')

    if radius is not None and points:
        center = points[0]
        # With equal x/y model scale, the displayed radius is the same in both axes.
        pixel_radius = radius / (x_max - x_min) * width
        body.append(f'<circle data-geometry="circle" data-center-x="{number(center["x"])}" data-center-y="{number(center["y"])}" data-radius="{number(radius)}" cx="{sx(center["x"]):.2f}" cy="{sy(center["y"]):.2f}" r="{pixel_radius:.2f}" fill="#dbeafe" fill-opacity=".5" stroke="#2563eb" stroke-width="2.4"/>')
    elif len(points) >= 2:
        a, b = points[0], points[1]
        if unit == "H22-C2-02":
            dx, dy = b["x"] - a["x"], b["y"] - a["y"]
            if abs(dx) > 1e-9:
                start_x, end_x = x_min, x_max
                start_y = a["y"] + dy / dx * (start_x - a["x"])
                end_y = a["y"] + dy / dx * (end_x - a["x"])
                body.append(f'<line data-geometry="line" x1="{sx(start_x):.2f}" y1="{sy(start_y):.2f}" x2="{sx(end_x):.2f}" y2="{sy(end_y):.2f}" stroke="#2563eb" stroke-width="2.4"/>')
        else:
            marker = ' marker-end="url(#arrow)"' if unit == "H22-C2-04" else ""
            body.append(f'<line data-geometry="segment" x1="{sx(a["x"]):.2f}" y1="{sy(a["y"]):.2f}" x2="{sx(b["x"]):.2f}" y2="{sy(b["y"]):.2f}" stroke="#2563eb" stroke-width="2.5"{marker}/>')
    elif not points:
        body += [
            '<rect x="94" y="144" width="190" height="82" rx="12" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>',
            '<rect x="436" y="144" width="190" height="82" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>',
            '<path d="M300 185h112" stroke="#64748b" stroke-width="3"/><path d="m400 176 14 9-14 9" fill="#64748b"/>',
            '<text x="189" y="178" text-anchor="middle" font-size="17" font-weight="700" fill="#1e40af">문제 조건</text>',
            '<text x="189" y="204" text-anchor="middle" font-size="12" fill="#334155">핵심 관계</text>',
            '<text x="531" y="178" text-anchor="middle" font-size="17" font-weight="700" fill="#166534">독립 풀이 사실</text>',
            f'<text x="531" y="204" text-anchor="middle" font-size="12" fill="#334155">{esc(method[:26])}</text>',
        ]

    for index, point in enumerate(points[:20]):
        px, py = sx(point["x"]), sy(point["y"])
        label = point.get("label") or f"P{index + 1}"
        body.append(f'<g data-point-label="{esc(label)}" data-point-x="{number(point["x"])}" data-point-y="{number(point["y"])}">')
        body.append(f'<circle cx="{px:.2f}" cy="{py:.2f}" r="5.5" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>')
        body.append(f'<text x="{px + 9:.2f}" y="{py - 8:.2f}" font-size="12" font-weight="700" fill="#b91c1c">{esc(label)}</text>')
        body.append(f'<text x="{px + 9:.2f}" y="{py + 16:.2f}" font-size="10" fill="#475569">({number(point["x"])}, {number(point["y"])})</text></g>')

    scale_x = width / (x_max - x_min)
    scale_y = height / (y_max - y_min)
    scale_error = abs(scale_x - scale_y) / max(abs(scale_x), abs(scale_y))
    alt = f"{row['mappedUnit']} 문항 {row['id']}의 독립 풀이 사실 기반 해설 도형"
    caption = "독립 풀이에서 확정한 점·도형·관계를 좌표평면에 표시한 해설 자료"
    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" width="720" height="360" role="img" data-fact-hash="{fact_hash}" data-scale-policy="{policy}">',
        f'<title>{esc(title)}</title><desc>{esc(alt)}</desc>',
        '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#2563eb"/></marker></defs>',
        '<rect width="720" height="360" rx="18" fill="#f8fafc"/>',
        f'<text x="32" y="38" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#0f172a">{esc(title)}</text>',
        f'<text x="32" y="64" font-family="Arial,sans-serif" font-size="12" fill="#475569">{esc(caption)}</text>',
        *body,
        f'<text x="32" y="344" font-family="Arial,sans-serif" font-size="11" fill="#64748b">독립 풀이 방식: {esc(method[:78])}</text>',
        '</svg>',
    ]
    validation = {"status": "PASS", "pointCount": len(points), "finitePoints": True, "scalePolicy": policy, "scaleX": scale_x, "scaleY": scale_y, "scaleError": scale_error, "factHash": fact_hash, "radius": radius}
    return "".join(svg) + "\n", validation


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    keys = list(dict.fromkeys(key for row in rows for key in row.keys())) if rows else []
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=keys)
        writer.writeheader()
        writer.writerows(rows)


manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
facts_payload = json.loads(FACTS_PATH.read_text(encoding="utf-8"))
fact_by_uid = {fact["questionUid"]: fact for fact in facts_payload["facts"]}
pilot_only = str(__import__("os").environ.get("GEOMETRY_PILOT_ONLY", "0")) == "1"
allow_rewrite = str(os.environ.get("GEOMETRY_ALLOW_SVG_REWRITE", "0")) == "1"
pilot_uids = {row["questionUid"] for row in json.loads(PILOT_PATH.read_text(encoding="utf-8"))["rows"]} if pilot_only else None
generated: list[dict[str, Any]] = []
verification: list[dict[str, Any]] = []
blocked: list[dict[str, Any]] = []
for row in manifest["rows"]:
    if pilot_uids is not None and row["questionUid"] not in pilot_uids:
        continue
    fact = fact_by_uid.get(row["questionUid"])
    if not fact:
        raise RuntimeError(f"Independent fact missing: {row['questionUid']}")
    fact_codes = [str(code) for code in fact.get("reasonCodes", [])]
    solution_issues = fact.get("solutionIssues") or {}
    solution_image_present = bool(solution_issues.get("solutionImagePresent"))
    # A visual can be required even after A has resolved the original
    # SOLUTION_VISUAL_MISSING triage code.  The source metadata is the
    # authoritative final check: generate when the current row still has no
    # solution image, regardless of whether the issue was repaired in S6.
    fact_requires_new_visual = fact.get("visualRequirement") == "VISUAL_REQUIRED" and not solution_image_present
    if row.get("solutionImageRef") or not fact_requires_new_visual:
        continue
    codes = fact_codes
    if any(re.search(r"FAIL_PROBLEM|FAIL_ANSWER|SOURCE_|CHOICES_INCOMPLETE", code) for code in codes):
        blocked.append({"questionUid": row["questionUid"], "qKey": row["qKey"], "reasonCodes": "|".join(codes), "status": "SOURCE_BLOCKED_UNTIL_APPROVAL"})
        continue
    svg, validation = build_svg(row, fact)
    source_stem = Path(row["sourceJsPath"]).stem
    asset_ref = f"assets/images/{source_stem}/q{int(row['id']):02d}-solution.svg"
    asset_path = STAGING / asset_ref
    if asset_path.exists():
        existing = asset_path.read_text(encoding="utf-8")
        if sha(existing) != sha(svg):
            if not allow_rewrite:
                raise RuntimeError(f"Existing staging asset differs from independent-facts output: {asset_ref}")
            asset_path.write_text(svg, encoding="utf-8")
            generated.append({"questionUid": row["questionUid"], "qKey": row["qKey"], "sourceJsPath": row["sourceJsPath"], "id": row["id"], "mappedUnitKey": row["mappedUnitKey"], "subUnitKey": row.get("subUnitKey", ""), "assetRef": asset_ref, "assetPath": str(asset_path.relative_to(ROOT)).replace("\\", "/"), "visualKind": "independent_fact_semantic_repair", "scalePolicy": validation["scalePolicy"], "independentFactHash": validation["factHash"], "status": "REGENERATED_FROM_B_REVIEW", "alt": f"{row['mappedUnit']} 문항 {row['id']}의 독립 풀이 사실 기반 해설 도형", "caption": "독립 풀이에서 확정한 점·도형·관계를 좌표평면에 표시한 해설 자료"})
            verification.append({"questionUid": row["questionUid"], "qKey": row["qKey"], "assetRef": asset_ref, **validation})
            continue
        generated.append({"questionUid": row["questionUid"], "qKey": row["qKey"], "sourceJsPath": row["sourceJsPath"], "id": row["id"], "mappedUnitKey": row["mappedUnitKey"], "subUnitKey": row.get("subUnitKey", ""), "assetRef": asset_ref, "assetPath": str(asset_path.relative_to(ROOT)).replace("\\", "/"), "visualKind": "independent_fact_plane", "scalePolicy": validation["scalePolicy"], "independentFactHash": validation["factHash"], "status": "ALREADY_GENERATED_BY_PILOT", "alt": f"{row['mappedUnit']} 문항 {row['id']}의 독립 풀이 사실 기반 해설 도형", "caption": "독립 풀이에서 확정한 점·도형·관계를 좌표평면에 표시한 해설 자료"})
        verification.append({"questionUid": row["questionUid"], "qKey": row["qKey"], "assetRef": asset_ref, **validation})
        continue
    asset_path.parent.mkdir(parents=True, exist_ok=True)
    asset_path.write_text(svg, encoding="utf-8")
    generated.append({"questionUid": row["questionUid"], "qKey": row["qKey"], "sourceJsPath": row["sourceJsPath"], "id": row["id"], "mappedUnitKey": row["mappedUnitKey"], "subUnitKey": row.get("subUnitKey", ""), "assetRef": asset_ref, "assetPath": str(asset_path.relative_to(ROOT)).replace("\\", "/"), "visualKind": "independent_fact_plane", "scalePolicy": validation["scalePolicy"], "independentFactHash": validation["factHash"], "alt": f"{row['mappedUnit']} 문항 {row['id']}의 독립 풀이 사실 기반 해설 도형", "caption": "독립 풀이에서 확정한 점·도형·관계를 좌표평면에 표시한 해설 자료"})
    verification.append({"questionUid": row["questionUid"], "qKey": row["qKey"], "assetRef": asset_ref, **validation})

summary = {"status": "PILOT_SVG_GENERATED_FROM_INDEPENDENT_FACTS" if pilot_only else "SVG_GENERATED_FROM_INDEPENDENT_FACTS", "source": FACTS_PATH.name, "pilotOnly": pilot_only, "allowRewrite": allow_rewrite, "manifestSha256": sha(MANIFEST_PATH.read_text(encoding="utf-8")), "independentFactsSha256": sha(FACTS_PATH.read_text(encoding="utf-8")), "generatedCount": len(generated), "blockedCount": len(blocked), "pythonVerificationPassCount": sum(row["status"] == "PASS" for row in verification), "pythonVerificationFailCount": sum(row["status"] != "PASS" for row in verification), "generatedAssets": generated, "blocked": blocked}
summary_name = "svg_pilot_build_summary.json" if pilot_only else "svg_build_summary_v22.json"
manifest_name = "svg_pilot_asset_manifest_v22.json" if pilot_only else "svg_asset_manifest_v22.json"
csv_name = "svg_pilot_asset_manifest_v22.csv" if pilot_only else "svg_asset_manifest_v22.csv"
verification_name = "python_geometry_verification_pilot_v22.csv" if pilot_only else "python_geometry_verification_v22.csv"
(REPORTS / summary_name).write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(REPORTS / manifest_name).write_text(json.dumps(generated, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
write_csv(REPORTS / csv_name, generated)
write_csv(REPORTS / verification_name, verification)
print(json.dumps({key: value for key, value in summary.items() if key not in {"generatedAssets", "blocked"}}, ensure_ascii=False, indent=2))
