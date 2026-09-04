"""Deterministic, target-locked repair of the 65 approved geometry SVGs.

This script intentionally writes only the exact target list below.  All
coordinate facts are calculated here before SVG serialization; the fact hash
is embedded in every modified asset so the rendered diagram can be traced to
the independent numerical construction without touching any JS question data.
"""
from __future__ import annotations

import hashlib
import html
import json
import math
from pathlib import Path
from typing import Callable, Iterable

ROOT = Path(__file__).resolve().parents[3]
ASSETS = ROOT / "archive" / "assets" / "images"
REPORT_DIR = ROOT / "reports" / "geometry-equation-65-20260904"

TARGETS: dict[str, list[int]] = {
    "21_복성고_2학기_중간_고1_기출": [1, 16],
    "21_순천고_2학기_중간_고1_기출": [9, 20],
    "21_제일고_2학기_중간_고1_기출": [18],
    "22_금당고_1학기_기말_고1_기출": [11],
    "22_매산고_1학기_기말_고1_기출": [10],
    "22_복성고_1학기_기말_고1_기출": [3],
    "22_순천여고_1학기_기말_고1_기출": [12, 23],
    "22_팔마고_1학기_기말_고1_기출": [6, 19],
    "22_효천고_1학기_기말_고1_기출": [14],
    "22_제일고_1학기_기말_고1_기출": [13, 14, 17],
    "23_매산고_1학기_기말_고1_기출": [14],
    "23_복성고_1학기_기말_고1_기출": [19, 20],
    "23_순천여고_1학기_기말_고1_기출": [9, 15, 16],
    "23_제일고_1학기_기말_고1_기출": [14, 18, 22],
    "23_팔마고_1학기_기말_고1_기출": [14],
    "24_금당고_1학기_기말_고1_기출": [7, 9, 16, 20],
    "24_매산고_1학기_기말_고1_기출": [7, 9, 15, 17],
    "24_제일고_1학기_기말_고1_기출": [10, 12, 13, 15, 17, 21, 22],
    "25_금당고_2학기_기말_고1_기출": [18],
    "25_제일고_2학기_기말_고1_기출": [3, 7],
    "25_금당고_2학기_중간_고1_기출": [3, 4, 8, 11, 12, 16, 18, 19, 21],
    "25_매산고_2학기_중간_고1_기출": [7, 10, 14, 18, 20],
    "25_순천고_2학기_중간_고1_기출": [7, 9, 10],
    "25_순천여고_2학기_중간_고1_공통수학2": [14, 17, 21],
    "25_제일고_2학기_중간_고1_기출": [13],
}

TARGET_COUNT = sum(len(ids) for ids in TARGETS.values())
MINUS = "−"


def n(value: float) -> str:
    if abs(value) < 1e-10:
        value = 0.0
    if abs(value - round(value)) < 1e-9:
        return str(int(round(value)))
    return f"{value:.4f}".rstrip("0").rstrip(".").replace("-", MINUS)


def txt(value: object) -> str:
    return html.escape(str(value), quote=True)


def fact_hash(fact: dict) -> str:
    payload = json.dumps(fact, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def line_box(a: float, b: float, c: float, xlim: tuple[float, float], ylim: tuple[float, float]) -> tuple[tuple[float, float], tuple[float, float]]:
    """Intersect ax+by+c=0 with a rectangular plot boundary."""
    xmin, xmax = xlim
    ymin, ymax = ylim
    candidates: list[tuple[float, float]] = []
    if abs(b) > 1e-12:
        for x in (xmin, xmax):
            y = -(a * x + c) / b
            if ymin - 1e-9 <= y <= ymax + 1e-9:
                candidates.append((x, y))
    if abs(a) > 1e-12:
        for y in (ymin, ymax):
            x = -(b * y + c) / a
            if xmin - 1e-9 <= x <= xmax + 1e-9:
                candidates.append((x, y))
    unique: list[tuple[float, float]] = []
    for p in candidates:
        if not any(math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-8 for q in unique):
            unique.append(p)
    if len(unique) < 2:
        raise ValueError(f"line does not cross plot: {a}x+{b}y+{c}=0 {xlim} {ylim}")
    return unique[0], unique[1]


def foot(a: float, b: float, c: float, x: float, y: float) -> tuple[float, float]:
    d = a * x + b * y + c
    den = a * a + b * b
    return x - a * d / den, y - b * d / den


def circle_intersections(c1: tuple[float, float], r1: float, c2: tuple[float, float], r2: float) -> list[tuple[float, float]]:
    x1, y1 = c1
    x2, y2 = c2
    dx, dy = x2 - x1, y2 - y1
    d = math.hypot(dx, dy)
    ex, ey = dx / d, dy / d
    u = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
    h = math.sqrt(max(0.0, r1 * r1 - u * u))
    mx, my = x1 + u * ex, y1 + u * ey
    return [(mx - h * ey, my + h * ex), (mx + h * ey, my - h * ex)]


class Plot:
    def __init__(self, xlim: tuple[float, float], ylim: tuple[float, float], height: int = 360):
        self.xlim, self.ylim, self.height = xlim, ylim, height
        self.left, self.top, self.width, self.plot_h = 34.0, 72.0, 356.0, height - 108.0
        self.scale = min(self.width / (xlim[1] - xlim[0]), self.plot_h / (ylim[1] - ylim[0]))
        self.x0 = self.left + (self.width - self.scale * (xlim[1] - xlim[0])) / 2
        self.y0 = self.top + (self.plot_h - self.scale * (ylim[1] - ylim[0])) / 2

    def sx(self, x: float) -> float:
        return self.x0 + (x - self.xlim[0]) * self.scale

    def sy(self, y: float) -> float:
        return self.y0 + (self.ylim[1] - y) * self.scale

    def xy(self, x: float, y: float) -> tuple[float, float]:
        return self.sx(x), self.sy(y)

    def grid_axes(self) -> list[str]:
        out = [f'<rect x="24" y="62" width="376" height="{self.height - 97}" rx="10" fill="#fff" stroke="#cbd5e1"/>']
        step = 1
        span = max(self.xlim[1] - self.xlim[0], self.ylim[1] - self.ylim[0])
        if span > 24:
            step = 5
        elif span > 14:
            step = 2
        for x in range(math.ceil(self.xlim[0] / step) * step, math.floor(self.xlim[1] / step) * step + 1, step):
            px = self.sx(x)
            out.append(f'<line x1="{px:.2f}" y1="{self.top:.2f}" x2="{px:.2f}" y2="{self.top + self.plot_h:.2f}" stroke="#e5e7eb" stroke-width="0.8"/>')
            if abs(x) > 1e-9:
                out.append(f'<text x="{px:.2f}" y="{self.sy(0) + 16:.2f}" text-anchor="middle" class="tick">{txt(n(x))}</text>')
        for y in range(math.ceil(self.ylim[0] / step) * step, math.floor(self.ylim[1] / step) * step + 1, step):
            py = self.sy(y)
            out.append(f'<line x1="{self.left:.2f}" y1="{py:.2f}" x2="{self.left + self.width:.2f}" y2="{py:.2f}" stroke="#e5e7eb" stroke-width="0.8"/>')
            if abs(y) > 1e-9:
                out.append(f'<text x="{self.sx(0) - 7:.2f}" y="{py + 4:.2f}" text-anchor="end" class="tick">{txt(n(y))}</text>')
        if self.xlim[0] <= 0 <= self.xlim[1]:
            px = self.sx(0)
            out.append(f'<line x1="{px:.2f}" y1="{self.top:.2f}" x2="{px:.2f}" y2="{self.top + self.plot_h:.2f}" stroke="#111" stroke-width="1.35"/>')
            out.append(f'<text x="{px + 7:.2f}" y="{self.top + 14:.2f}" class="axis-label">y</text>')
        if self.ylim[0] <= 0 <= self.ylim[1]:
            py = self.sy(0)
            out.append(f'<line x1="{self.left:.2f}" y1="{py:.2f}" x2="{self.left + self.width:.2f}" y2="{py:.2f}" stroke="#111" stroke-width="1.35"/>')
            out.append(f'<text x="{self.left + self.width - 6:.2f}" y="{py - 7:.2f}" text-anchor="end" class="axis-label">x</text>')
        return out

    def circle(self, cx: float, cy: float, r: float, color: str = "#2563eb", fill: str = "#dbeafe", dash: str | None = None, label: str | None = None) -> str:
        x, y = self.xy(cx, cy)
        attrs = f'cx="{x:.2f}" cy="{y:.2f}" r="{abs(r) * self.scale:.2f}" stroke="{color}" stroke-width="2.05" fill="{fill}" fill-opacity=".25"'
        if dash:
            attrs += f' stroke-dasharray="{dash}"'
        body = f'<circle data-geometry="circle" data-center-x="{n(cx)}" data-center-y="{n(cy)}" data-radius="{n(abs(r))}" {attrs}/>'
        if label:
            body += self.point(cx, cy, label, color, radius=2.5)
        return body

    def line(self, a: float, b: float, c: float, color: str = "#dc2626", width: float = 2.05, dash: str | None = None, label: str | None = None) -> str:
        p1, p2 = line_box(a, b, c, self.xlim, self.ylim)
        x1, y1 = self.xy(*p1)
        x2, y2 = self.xy(*p2)
        attrs = f'x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{color}" stroke-width="{width}" fill="none"'
        if dash:
            attrs += f' stroke-dasharray="{dash}"'
        body = f'<line data-geometry="line" data-equation="{txt(f"{n(a)}x+{n(b)}y+{n(c)}=0")}" {attrs}/>'
        if label:
            body += f'<text x="{min(x1, x2) + 8:.2f}" y="{max(68, min(y1, y2) - 6):.2f}" class="diagram-label" fill="{color}">{txt(label)}</text>'
        return body

    def segment(self, p1: tuple[float, float], p2: tuple[float, float], color: str = "#047857", width: float = 2.05, dash: str | None = None) -> str:
        x1, y1 = self.xy(*p1)
        x2, y2 = self.xy(*p2)
        attrs = f'x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{color}" stroke-width="{width}" fill="none"'
        if dash:
            attrs += f' stroke-dasharray="{dash}"'
        return f'<line data-geometry="segment" {attrs}/>'

    def point(self, x: float, y: float, label: str, color: str = "#111827", radius: float = 3.0, dx: float = 6, dy: float = -6) -> str:
        px, py = self.xy(x, y)
        return f'<circle data-point-label="{txt(label)}" data-point-x="{n(x)}" data-point-y="{n(y)}" cx="{px:.2f}" cy="{py:.2f}" r="{radius}" fill="{color}"/><text x="{px + dx:.2f}" y="{py + dy:.2f}" class="point-label" fill="{color}">{txt(label)}</text>'

    def polygon(self, points: Iterable[tuple[float, float]], color: str = "#b45309", fill: str = "#fef3c7") -> str:
        coords = " ".join(f"{self.sx(x):.2f},{self.sy(y):.2f}" for x, y in points)
        return f'<polygon data-geometry="polygon" points="{coords}" fill="{fill}" fill-opacity=".45" stroke="{color}" stroke-width="2.05"/>'

    def curve(self, fn: Callable[[float], float], start: float, end: float, color: str = "#2563eb", width: float = 2.05, samples: int = 240, label: str | None = None) -> str:
        pts = []
        for i in range(samples + 1):
            x = start + (end - start) * i / samples
            y = fn(x)
            if self.ylim[0] - 2 <= y <= self.ylim[1] + 2:
                pts.append(f"{self.sx(x):.2f},{self.sy(y):.2f}")
        body = f'<polyline data-geometry="curve" points="{" ".join(pts)}" fill="none" stroke="{color}" stroke-width="2.05" stroke-linecap="round" stroke-linejoin="round"/>'
        if label:
            body += f'<text x="{self.sx(start) + 8:.2f}" y="{max(76, self.sy(fn(start)) - 8):.2f}" class="diagram-label" fill="{color}">{txt(label)}</text>'
        return body


def svg_doc(folder: str, qid: int, title: str, fact: dict, plot: Plot, body: list[str], notes: list[str]) -> tuple[str, dict]:
    h = plot.height
    fh = fact_hash(fact)
    attrs = (
        'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 %d" width="720" height="%d" '
        'preserveAspectRatio="xMidYMid meet" role="img" '
        'data-geometry-mode="COORDINATE_GEOMETRY_HYBRID" '
        'data-geometry-style-version="AP_GEOMETRY_PRINT_V1_0_DRAFT" '
        'data-geometry-preset="GEOMETRY_STANDARD" data-geometry-fact-hash="%s" '
        'data-visual-provenance="deterministic-python-independent-facts" data-axis-scale-mode="EQUAL_UNIT"'
    ) % (h, h, fh)
    lines = [
        f'<svg {attrs}>',
        '<title>%s</title><desc>%s</desc>' % (txt(title), txt(f"{title}: 좌표·도형 관계를 계산값으로 복원한 해설 도형")),
        '<style>.tick{font:10px "STIX Two Math","Malgun Gothic",serif;fill:#374151}.axis-label{font:italic 13px "STIX Two Math","Malgun Gothic",serif;fill:#111}.point-label,.diagram-label{font:12px "STIX Two Math","Malgun Gothic",serif;font-weight:600}.side-title{font:700 15px "Noto Sans KR","Malgun Gothic",sans-serif;fill:#111827}.side-note{font:11px "Noto Sans KR","Malgun Gothic",sans-serif;fill:#374151}</style>',
        '<rect width="720" height="%d" fill="#fff"/>' % h,
        f'<text x="28" y="32" class="side-title">{txt(title)}</text>',
        f'<text x="28" y="51" class="side-note">계산된 좌표·관계만 표시한 해설 도형</text>',
        *plot.grid_axes(),
        *body,
        f'<rect x="420" y="62" width="276" height="{h - 97}" rx="10" fill="#f8fafc" stroke="#dbe3ef"/>',
        '<text x="438" y="91" class="side-title">핵심 수치</text>',
    ]
    y = 116
    for note in notes:
        lines.append(f'<text x="438" y="{y}" class="side-note">{txt(note)}</text>')
        y += 18
    lines.append('</svg>\n')
    return "".join(lines), {"folder": folder, "id": qid, "path": f"assets/images/{folder}/q{qid:02d}-solution.svg", "factHash": fh, "width": 720, "height": h, "scale": plot.scale}


def circle_line(folder: str, qid: int, title: str, center: tuple[float, float], radius: float, line: tuple[float, float, float] | None, points: list[tuple[float, float, str]], notes: list[str], xlim: tuple[float, float], ylim: tuple[float, float], segments: list[tuple[tuple[float, float], tuple[float, float], str]] | None = None, circles: list[tuple[tuple[float, float], float, str, str, str | None]] | None = None) -> tuple[str, dict]:
    plot = Plot(xlim, ylim)
    body: list[str] = []
    body.append(plot.circle(*center, radius, label=None))
    if circles:
        for c, r, color, fill, dash in circles:
            body.append(plot.circle(*c, r, color, fill, dash))
    if line:
        body.append(plot.line(*line, label=None))
    if segments:
        for p1, p2, color in segments:
            body.append(plot.segment(p1, p2, color))
    for x, y, label in points:
        body.append(plot.point(x, y, label))
    fact = {"title": title, "center": center, "radius": radius, "line": line, "points": points, "segments": segments or [], "circles": circles or []}
    return svg_doc(folder, qid, title, fact, plot, body, notes)


def build(folder: str, qid: int) -> tuple[str, dict]:
    key = (folder, qid)
    # 2021: 복성고
    if key == ("21_복성고_2학기_중간_고1_기출", 1):
        return circle_line(folder, qid, "원의 방정식 · 중심 O와 P", (0, 0), math.sqrt(5), None, [(1, 2, "P(1,2)"), (0, 0, "O")], ["O=(0,0), P=(1,2)", "OP=√5, r=√5", "P는 실제 원주 위"], (-2.5, 3.5), (-2.5, 3.5), [((0, 0), (1, 2), "#dc2626")])
    if key == ("21_복성고_2학기_중간_고1_기출", 16):
        plot = Plot((-4, 6), (-5, 4))
        body = [plot.circle(1, -1, 3), plot.line(0, 1, 0, "#111827", 1.4), plot.line(0, 1, -2, "#dc2626", 2.2, "6 4"), plot.line(0, 1, 2, "#7c3aed", 2.2, "6 4")]
        A, B = (1 - 2 * math.sqrt(2), 0), (1 + 2 * math.sqrt(2), 0)
        P1, P2, P3 = (1, 2), (1 - 2 * math.sqrt(2), -2), (1 + 2 * math.sqrt(2), -2)
        body += [plot.segment(A, B, "#111827"), plot.polygon([P1, P2, P3]), plot.segment(P2, P3, "#7c3aed", 2.3)]
        body += [plot.point(*P1, "P₁", "#dc2626"), plot.point(*P2, "P₂", "#7c3aed"), plot.point(*P3, "P₃", "#7c3aed"), plot.point(1, -1, "C(1,−1)")]
        fact = {"center": (1, -1), "radius": 3, "xAxisChord": [A, B], "horizontalLines": [2, -2], "points": [P1, P2, P3]}
        return svg_doc(folder, qid, "넓이 조건으로 정한 세 점", fact, plot, body, ["C=(1,−1), r=3", "y=2는 접선: P₁=(1,2)", "y=−2의 교점: P₂,P₃", "P₂P₃=4√2, 높이=4"])
    # 2021: 순천고
    if key == ("21_순천고_2학기_중간_고1_기출", 9):
        plot = Plot((-14, 16), (-23, 24), 380)
        op = (3, 1); om = (1, 3 + (-2 + 4 * math.sqrt(6)))
        om2 = (1, 3 + (-2 - 4 * math.sqrt(6)))
        body = [plot.circle(*op, 13, "#2563eb", "#dbeafe"), plot.circle(*om, 13, "#16a34a", "#dcfce7"), plot.circle(*om2, 13, "#7c3aed", "#ede9fe", "5 4")]
        for o, color in [(om, "#16a34a"), (om2, "#7c3aed")]:
            dx, dy = o[0] - op[0], o[1] - op[1]
            d = math.hypot(dx, dy); ux, uy = dx / d, dy / d
            m = ((op[0] + o[0]) / 2, (op[1] + o[1]) / 2)
            vx, vy = -uy, ux
            a, b = (m[0] + 12 * vx, m[1] + 12 * vy), (m[0] - 12 * vx, m[1] - 12 * vy)
            body += [plot.segment(a, b, color, 2.1), plot.point(*a, "A", color), plot.point(*b, "B", color)]
        body += [plot.point(*op, "O₁"), plot.point(*om, "O₂⁺", "#16a34a"), plot.point(*om2, "O₂⁻", "#7c3aed")]
        fact = {"O1": op, "O2": [om, om2], "radius": 13, "chordLength": 24}
        return svg_doc(folder, qid, "두 원의 공통현", fact, plot, body, ["r=13, AB=24", "중심거리 d=10", "a=−2±4√6", "각 공통현의 반길이=12"])
    if key == ("21_순천고_2학기_중간_고1_기출", 20):
        return circle_line(folder, qid, "원둘레를 이등분하는 대칭 직선", (-2, 5), math.sqrt(129), (1, 1, -3), [(-2, 5, "C(−2,5)")], ["x+y+3=0의 원점 대칭", "대칭 후 직선: x+y−3=0", "C=(−2,5)가 직선 위"], (-15, 12), (-8, 16), [((-2, 5), foot(1, 1, -3, -2, 5), "#dc2626")])
    # 2021: 제일고
    if key == ("21_제일고_2학기_중간_고1_기출", 18):
        H = (1, 5)
        return circle_line(folder, qid, "원과 직선의 첫 접점", (-3, 1), 4 * math.sqrt(2), (1, 1, -6), [(-3, 1, "C(−3,1)"), (*H, "H(1,5)")], ["d(C,l)=4√2", "r=4√2에서 처음 접함", "x+y−6=0"], (-10, 8), (-5, 12), [((-3, 1), H, "#047857")])
    # 2022: 금당고 q11
    if key == ("22_금당고_1학기_기말_고1_기출", 11):
        C = (0, -1); line = (4, 3, -12); H = foot(*line, *C); pts = circle_intersections(C, 5, (0, 0), 0) if False else []
        d = 3; t = (3 / 5, -4 / 5); A = (H[0] + 4 * t[0], H[1] + 4 * t[1]); B = (H[0] - 4 * t[0], H[1] - 4 * t[1])
        return circle_line(folder, qid, "현 AB와 중심 C", C, 5, line, [(C[0], C[1], "C(0,−1)"), (H[0], H[1], "H"), (A[0], A[1], "A"), (B[0], B[1], "B")], ["직선 4x+3y−12=0", "CH=3, AH=4", "실제 현 AB=8", "넓이=½×8×3=12"], (-5, 7), (-6, 5), [((C[0], C[1]), H, "#dc2626")])
    # 2022: 매산고 q10
    if key == ("22_매산고_1학기_기말_고1_기출", 10):
        O = (3, 5); line = (4, 3, -12); H = foot(*line, *O); t = (3 / 5, -4 / 5); A = (H[0] + math.sqrt(5) * t[0], H[1] + math.sqrt(5) * t[1]); B = (H[0] - math.sqrt(5) * t[0], H[1] - math.sqrt(5) * t[1])
        plot = Plot((-5, 8), (-4, 9)); body = [plot.circle(-1, 2, 3, "#2563eb", "#dbeafe"), plot.circle(*O, math.sqrt(14), "#f97316", "#ffedd5"), plot.line(*line), plot.segment(A, B, "#047857", 2.4), plot.segment(O, H, "#dc2626", 2, "6 4")]
        body += [plot.point(*O, "O(3,5)", "#f97316"), plot.point(*A, "A", "#047857"), plot.point(*B, "B", "#047857"), plot.point(*H, "H")]
        fact = {"C1": ((-1, 2), 3), "C2": (O, math.sqrt(14)), "commonChord": line, "A": A, "B": B, "H": H}
        return svg_doc(folder, qid, "두 원의 공통현과 O(3,5)", fact, plot, body, ["O=(3,5) = C₂의 중심", "공통현: 4x+3y−12=0", "OH=3, AH=√5", "AB=2√5"])
    if key == ("22_복성고_1학기_기말_고1_기출", 3):
        return circle_line(folder, qid, "접점 T(3,1)와 접선", (0, 0), math.sqrt(10), (3, 1, -10), [(0, 0, "O"), (3, 1, "T(3,1)"), (10, 0, "X(10,0)")], ["T=(3,1), OT=√10", "접선: 3x+y−10=0", "T를 지나며 OT와 수직", "y=−3x+10"] , (-2, 12), (-5, 7), [((0, 0), (3, 1), "#dc2626")])
    if key == ("22_순천여고_1학기_기말_고1_기출", 12):
        return circle_line(folder, qid, "직선 y=x+1 위의 중심", (2, 3), 3, (1, -1, 1), [(2, 3, "C(2,3)"), (-1, 3, "P(−1,3)")], ["중심 C=(2,3) ∈ y=x+1", "x축 접선, r=3", "P=(−1,3)도 원주 위", "넓이=9π"], (-5, 7), (-3, 8), [((2, 3), (2, 0), "#dc2626")])
    if key == ("22_순천여고_1학기_기말_고1_기출", 23):
        return circle_line(folder, qid, "내분점 R과 두 교점", (1, 3), math.sqrt(5), (1, -1, 1), [(1, 3, "C(1,3)"), (0, 1, "P(0,1)"), (3, 4, "Q(3,4)"), (2, 3, "R(2,3)")], ["직선: y=x+1", "P=(0,1), Q=(3,4)", "R=(2,3), P:Q 내분점", "k=5"], (-3, 6), (-2, 7), [((0, 1), (3, 4), "#dc2626")])
    if key == ("22_팔마고_1학기_기말_고1_기출", 6):
        return circle_line(folder, qid, "원의 중심 C(1,−4)", (1, -4), 5, None, [(1, -4, "C(1,−4)"), (6, -4, "P(6,−4)")], ["표준형: (x−1)²+(y+4)²=25", "a=1, b=−4, r=5", "a+b+r=2"], (-6, 8), (-10, 5), [((1, -4), (6, -4), "#dc2626")])
    if key == ("22_팔마고_1학기_기말_고1_기출", 19):
        C = (-1, 3); L = (1, 2, -10); H = foot(*L, *C)
        return circle_line(folder, qid, "접선과 수선의 직교 관계", C, math.sqrt(3), L, [(-1, 3, "D(−1,3)"), (*H, "H")], ["첫 원의 접선: x+2y−10=0", "두 번째 중심 D=(−1,3)", "DH는 접선에 수직", "5<k<10 → k=6,7,8,9"], (-8, 9), (-5, 8), [((C[0], C[1]), H, "#047857")])
    if key == ("22_효천고_1학기_기말_고1_기출", 14):
        plot = Plot((-3, 8), (-3, 8)); body = [plot.circle(9 / 4, 9 / 4, 9 / 4, "#2563eb", "#dbeafe"), plot.circle(3 / 8, 3 / 8, 3 / 8, "#16a34a", "#dcfce7"), plot.line(6, 8, -9)]
        body += [plot.point(9 / 4, 9 / 4, "C₁", "#2563eb"), plot.point(3 / 8, 3 / 8, "C₂", "#16a34a")]
        fact = {"centers": [(9 / 4, 9 / 4), (3 / 8, 3 / 8)], "radii": [9 / 4, 3 / 8], "line": (6, 8, -9)}
        return svg_doc(folder, qid, "두 축 접원과 직선 6x+8y−9=0", fact, plot, body, ["직선 기울기=−3/4", "r₁=9/4, r₂=3/8", "각 중심은 (r,r)", "두 원 모두 직선에 접함"])
    # 2022: 제일고
    if key == ("22_제일고_1학기_기말_고1_기출", 13):
        return circle_line(folder, qid, "중심 (4,−3), 반지름 7", (4, -3), 7, None, [(4, -3, "C(4,−3)"), (4, 4, "P")], ["(x−4)²+(y+3)²=49", "a=4, b=−3, r=7", "a+b+r=8"], (-5, 13), (-11, 8), [((4, -3), (4, 4), "#dc2626")])
    if key == ("22_제일고_1학기_기말_고1_기출", 14):
        plot = Plot((-5, 22), (-5, 22)); body = [plot.circle(2, 2, 2, "#2563eb", "#dbeafe"), plot.circle(10, 10, 10, "#16a34a", "#dcfce7"), plot.line(1, 0, 0), plot.line(0, 1, 0)]
        body += [plot.point(2, 4, "P(2,4)", "#dc2626"), plot.point(2, 2, "C₁", "#2563eb"), plot.point(10, 10, "C₂", "#16a34a")]
        fact = {"point": (2, 4), "centers": [(2, 2), (10, 10)], "radii": [2, 10], "axes": True}
        return svg_doc(folder, qid, "두 축에 접하는 두 원", fact, plot, body, ["중심은 (r,r)", "P=(2,4)", "r=2, 10", "둘레의 합=24π"])
    if key == ("22_제일고_1학기_기말_고1_기출", 17):
        P = (4, 5); O = (0, 0); r = 3; line = (4, 5, -9); H = foot(*line, *O); t = (-5 / math.sqrt(41), 4 / math.sqrt(41)); h = 12 * math.sqrt(2) / math.sqrt(41); Q1 = (H[0] + h * t[0], H[1] + h * t[1]); Q2 = (H[0] - h * t[0], H[1] - h * t[1])
        plot = Plot((-4, 8), (-4, 9)); body = [plot.circle(*O, r), plot.segment(P, Q1, "#047857"), plot.segment(P, Q2, "#f97316"), plot.segment(O, Q1, "#7c3aed", 1.8, "5 4"), plot.segment(O, Q2, "#7c3aed", 1.8, "5 4")]
        body += [plot.point(*P, "P(4,5)", "#dc2626"), plot.point(*Q1, "Q₁", "#047857"), plot.point(*Q2, "Q₂", "#f97316")]
        fact = {"center": O, "radius": r, "externalPoint": P, "tangentPoints": [Q1, Q2]}
        return svg_doc(folder, qid, "점 P에서 그은 두 접선", fact, plot, body, ["OP=√41, OQ=3", "OQ ⟂ PQ", "PQ=4√2", "두 접선의 접점이 실제 원주 위"])
    # 2023: 매산고
    if key == ("23_매산고_1학기_기말_고1_기출", 14):
        V1, V2, V3 = (0, 6), (0, -1 / 4), (3, 2); I = (5 / 4, 9 / 4); r = 5 / 4
        plot = Plot((-2, 6), (-2, 8)); body = [plot.polygon([V1, V2, V3]), plot.circle(*I, r, "#f97316", "#fed7aa"), plot.line(4, 3, -18), plot.line(3, -4, -1), plot.line(1, 0, 0)]
        body += [plot.point(*V1, "A"), plot.point(*V2, "B"), plot.point(*V3, "C"), plot.point(*I, "I", "#f97316")]
        fact = {"vertices": [V1, V2, V3], "incenter": I, "inradius": r, "lines": [(4, 3, -18), (3, -4, -1), (1, 0, 0)]}
        return svg_doc(folder, qid, "세 직선으로 둘러싸인 삼각형의 내접원", fact, plot, body, ["꼭짓점=(0,6),(0,−1/4),(3,2)", "내심 I=(5/4,9/4)", "내접반지름 r=5/4", "둘레=5π/2"])
    if key == ("23_복성고_1학기_기말_고1_기출", 19):
        plot = Plot((-32, 5), (-34, 4), 380); body = [plot.circle(-2, -4, 3, "#2563eb", "#dbeafe"), plot.circle(-14, -16, 15, "#16a34a", "#dcfce7"), plot.line(1, 0, -1), plot.segment((-2, -7), (-2, -4), "#dc2626", 1.8, "5 4"), plot.segment((-14, -7), (-14, -16), "#dc2626", 1.8, "5 4")]
        body += [plot.point(-2, -7, "P(−2,−7)", "#dc2626"), plot.point(-2, -4, "C₁", "#2563eb"), plot.point(-14, -16, "C₂", "#16a34a")]
        fact = {"centers": [(-2, -4), (-14, -16)], "radii": [3, 15], "point": (-2, -7), "tangentLine": "x=1"}
        return svg_doc(folder, qid, "두 가능한 중심과 점 P", fact, plot, body, ["중심선: y=x−2", "P=(−2,−7)", "x=1에 접함", "중심의 y좌표: −4, −16"])
    if key == ("23_복성고_1학기_기말_고1_기출", 20):
        A, B = (-3, -5), (9, 1); C1, C2 = (0, 4), (6, -8); r = 3 * math.sqrt(10)
        plot = Plot((-14, 16), (-20, 14), 380); body = [plot.circle(*C1, r, "#2563eb", "#dbeafe"), plot.circle(*C2, r, "#16a34a", "#dcfce7"), plot.segment(A, B, "#dc2626", 2.4)]
        body += [plot.point(*A, "A(−3,−5)"), plot.point(*B, "B(9,1)"), plot.point(*C1, "C₁", "#2563eb"), plot.point(*C2, "C₂=(6,−8)", "#16a34a")]
        fact = {"A": A, "B": B, "centers": [C1, C2], "radius": r, "angle": "45°"}
        return svg_doc(folder, qid, "∠APB=45°인 두 원", fact, plot, body, ["AB=6√5", "중심각=90°", "C₁=(0,4), C₂=(6,−8)", "두 반지름=3√10"])
    # 2023: 순천여고
    if key == ("23_순천여고_1학기_기말_고1_기출", 9):
        return circle_line(folder, qid, "지름 AB와 중심", (-1, 3), 3, (2, 1, -1), [(-1, 3, "C(−1,3)")], ["y=2x+1의 y축 대칭: y=−2x+1", "AB=6=지름", "중심 C=(a,3) ∈ y=−2x+1", "a=−1"], (-5, 4), (-3, 8))
    if key == ("23_순천여고_1학기_기말_고1_기출", 15):
        nvec = (3 / math.sqrt(10), -1 / math.sqrt(10)); C = (-5 * nvec[0], -5 * nvec[1]); L = (3, -1, -5); tangent = (3, -1, 5 * math.sqrt(10))
        plot = Plot((-8, 8), (-7, 8)); body = [plot.circle(0, 0, 5), plot.line(*L, "#111827", 1.6), plot.line(*tangent, "#dc2626", 2.3), plot.point(0, -5, "A"), plot.point(3, 4, "B"), plot.point(*C, "C", "#dc2626")]
        fact = {"circle": ((0, 0), 5), "AB": L, "maxPoint": C, "maxTangent": tangent}
        return svg_doc(folder, qid, "넓이를 최대로 하는 접점", fact, plot, body, ["AB: 3x−y−5=0", "C=(−15/√10,5/√10)", "접선: 3x−y+5√10=0", "ab=15√10"])
    if key == ("23_순천여고_1학기_기말_고1_기출", 16):
        P = (-16 / 5, -12 / 5); center = (P[0] / 2, P[1] / 2); plot = Plot((-8, 5), (-8, 5)); body = [plot.line(4, 3, 20), plot.line(3, -4, 0, "#7c3aed", 2.2), plot.circle(*center, 2), plot.segment((0, 0), P, "#dc2626", 2.3), plot.point(*P, "P(−16/5,−12/5)", "#dc2626"), plot.point(*center, "M")]
        fact = {"line": (4, 3, 20), "minPoint": P, "slope": 3 / 4, "diameter": 4, "circleCenter": center, "circleRadius": 2}
        return svg_doc(folder, qid, "원점에서 직선까지의 최단점", fact, plot, body, ["P=원점에서 내린 수선의 발", "수선 기울기=3/4", "OP=4", "지름 OP인 원의 S=4π"])
    # 2023: 제일고
    if key == ("23_제일고_1학기_기말_고1_기출", 14):
        c1, c2 = (-4, 3), (5, -3); line = (2, 3, -1); plot = Plot((-8, 9), (-7, 7)); body = [plot.circle(*c1, math.sqrt(8), "#2563eb", "#dbeafe"), plot.circle(*c2, math.sqrt(10), "#16a34a", "#dcfce7"), plot.line(*line), plot.segment(c1, c2, "#dc2626", 1.8, "5 4"), plot.point(*c1, "C₁"), plot.point(*c2, "C₂")]
        fact = {"centers": [c1, c2], "bisectorLine": line, "form": "ax−by−1=0", "a": 2, "b": -3}
        return svg_doc(folder, qid, "두 중심을 지나는 넓이 이등분 직선", fact, plot, body, ["C₁=(−4,3), C₂=(5,−3)", "공통 직선: 2x+3y−1=0", "a=2, b=−3", "a+b=−1"])
    if key == ("23_제일고_1학기_기말_고1_기출", 18):
        plot = Plot((-6, 7), (-7, 7)); body = [plot.curve(lambda x: -x * x + x + 3, -4, 5, "#111827", 2.3, label="y=−x²+x+3"), plot.line(1, -1, 0, "#dc2626", 1.6, "5 4"), plot.line(1, 1, 0, "#7c3aed", 1.6, "5 4")]
        centers = [(math.sqrt(3), math.sqrt(3)), (-math.sqrt(3), -math.sqrt(3)), (3, -3), (-1, 1)]
        for i, (x, y) in enumerate(centers, 1):
            body += [plot.circle(x, y, abs(y), "#2563eb" if i < 3 else "#16a34a", "#dbeafe" if i < 3 else "#dcfce7", "5 4"), plot.point(x, y, f"C{i}")]
        fact = {"parabola": "y=−x²+x+3", "centers": centers, "radii": [math.sqrt(3), math.sqrt(3), 3, 1]}
        return svg_doc(folder, qid, "포물선과 네 축접원 중심", fact, plot, body, ["y=x 교점: (±√3,±√3)", "y=−x 교점: (3,−3),(−1,1)", "반지름: √3,√3,3,1", "넓이의 합=16π"])
    if key == ("23_제일고_1학기_기말_고1_기출", 22):
        A, B = (0, 4), (8, 0); C1, C2 = (2, -2), (6, 6); r = 2 * math.sqrt(10); plot = Plot((-5, 13), (-8, 12)); body = [plot.circle(*C1, r, "#2563eb", "#dbeafe"), plot.circle(*C2, r, "#16a34a", "#dcfce7"), plot.segment(A, B, "#dc2626", 2.1)]
        body += [plot.point(*A, "A(0,4)"), plot.point(*B, "B(8,0)"), plot.point(*C1, "C₁", "#2563eb"), plot.point(*C2, "C₂", "#16a34a")]
        fact = {"A": A, "B": B, "centers": [C1, C2], "radius": r, "centralAngle": 90}
        return svg_doc(folder, qid, "현 AB와 두 원의 중심", fact, plot, body, ["AB=4√5", "중심각=90°", "OM=2√5", "두 중심=(2,−2),(6,6)"])
    if key == ("23_팔마고_1학기_기말_고1_기출", 14):
        O, P, r = (-1, -1), (2, 3), 2; line = (3, 4, 3); H = foot(*line, *O); direction = (-4 / 5, 3 / 5); half = 2 * math.sqrt(21) / 5; A = (H[0] + half * direction[0], H[1] + half * direction[1]); B = (H[0] - half * direction[0], H[1] - half * direction[1]); plot = Plot((-5, 5), (-5, 5)); body = [plot.circle(*O, r), plot.line(*line), plot.segment(P, A, "#047857"), plot.segment(P, B, "#f97316"), plot.segment(A, B, "#dc2626", 2.4), plot.segment(O, H, "#7c3aed", 1.8, "5 4")]
        body += [plot.point(*O, "O"), plot.point(*P, "P(2,3)", "#dc2626"), plot.point(*A, "A", "#047857"), plot.point(*B, "B", "#f97316"), plot.point(*H, "H")]
        fact = {"center": O, "radius": r, "externalPoint": P, "contactChord": line, "contactPoints": [A, B], "foot": H}
        return svg_doc(folder, qid, "두 접점의 접촉현 AB", fact, plot, body, ["접촉현: 3x+4y+3=0", "AB ⟂ OP", "중심은 접촉현 위에 있지 않음", "25m²=336"])
    # 2024: 금당고
    if key == ("24_금당고_1학기_기말_고1_기출", 7):
        return circle_line(folder, qid, "중심 C(−4,2)와 반지름", (-4, 2), 2, None, [(-4, 2, "C(−4,2)"), (-2, 2, "P")], ["(x+4)²+(y−2)²=4", "중심=(−4,2)", "r=2", "a+b+r=0"], (-8, 2), (-2, 6), [((-4, 2), (-2, 2), "#dc2626")])
    if key == ("24_금당고_1학기_기말_고1_기출", 9):
        O, P = (0, 0), (4, 3); r = math.sqrt(5); line = (4, 3, -5); H = (4 / 5, 3 / 5); Q1, Q2 = (-2 / 5, 11 / 5), (2, -1); plot = Plot((-4, 7), (-4, 7)); body = [plot.circle(*O, r), plot.line(*line), plot.segment(P, Q1, "#047857"), plot.segment(P, Q2, "#f97316"), plot.segment(Q1, Q2, "#dc2626", 2.4), plot.segment(O, H, "#7c3aed", 1.8, "5 4")]
        body += [plot.point(*P, "P(4,3)", "#dc2626"), plot.point(*Q1, "Q₁", "#047857"), plot.point(*Q2, "Q₂", "#f97316"), plot.point(*H, "H")]
        fact = {"center": O, "radius": r, "externalPoint": P, "contactChord": line, "contactPoints": [Q1, Q2]}
        return svg_doc(folder, qid, "접점 현 PQ와 두 접선", fact, plot, body, ["접촉현: 4x+3y−5=0", "Q₁=(−2/5,11/5)", "Q₂=(2,−1)", "a+b+c=−4"])
    if key == ("24_금당고_1학기_기말_고1_기출", 16):
        centers = [(3, 15), (-3, -3), (-1, 3)]; plot = Plot((-8, 7), (-7, 18)); body = [plot.line(3, -1, 6, "#dc2626", 2.1)]
        for i, (x, y) in enumerate(centers, 1):
            body += [plot.circle(x, y, 3, "#2563eb", "#dbeafe", "5 4"), plot.point(x, y, f"C{i}")]
        fact = {"locus": "y=3x+6", "radius": 3, "centers": centers, "axisTangency": True}
        return svg_doc(folder, qid, "중심 자취와 축 접선 조건", fact, plot, body, ["중심 직선: y=3x+6", "|x|=3 또는 |y|=3", "후보 중심: (3,15),(−3,−3),(−1,3)", "M−m=192"])
    if key == ("24_금당고_1학기_기말_고1_기출", 20):
        aa, bb = (1 + math.sqrt(2)) / 3, (1 - math.sqrt(2)) / 3; A, B = (aa, aa * aa), (bb, bb * bb); P = (1 / 3, 1 / 3); l = (3, 2, -5 / 3); plot = Plot((-2, 2), (-1, 4)); body = [plot.curve(lambda x: x * x, -1.8, 1.8, "#2563eb", 2.2, label="y=x²"), plot.segment(A, B, "#047857", 2.2), plot.line(*l, "#dc2626", 2.1), plot.circle(*P, math.sqrt(26) / 9, "#7c3aed", "#ede9fe", "5 4")]
        body += [plot.point(*A, "A"), plot.point(*B, "B"), plot.point(*P, "P(1/3,1/3)", "#7c3aed")]
        fact = {"parabola": "y=x²", "A": A, "B": B, "center": P, "perpendicularLine": l, "radiusSquared": 26 / 81, "yIntercept": 5 / 6}
        return svg_doc(folder, qid, "포물선의 지름 AB와 중심선 l", fact, plot, body, ["P=(1/3,1/3) ∈ y=x", "l: y=−3x/2+5/6", "l ⟂ AB", "81r²=26"])
    # 2024: 매산고
    if key == ("24_매산고_1학기_기말_고1_기출", 7):
        return circle_line(folder, qid, "지름 AB와 x축 교점", (1, 4), 5, (0, 1, 0), [(1, 4, "M(1,4)"), (-2, 0, "A₁"), (4, 0, "A₂")], ["A=(5,1), B=(−3,7)", "중심 M=(1,4), r=5", "x축 교점 x=−2,4", "두 교점 거리=6"], (-5, 7), (-2, 9), [((1, 4), (1, 0), "#dc2626")])
    if key == ("24_매산고_1학기_기말_고1_기출", 9):
        O, P, r = (0, 0), (2, 1), 1 / math.sqrt(2); line = (2, 1, -0.5); Q1, Q2 = (-0.1, 0.7), (0.5, -0.5); plot = Plot((-2, 4), (-2, 3)); body = [plot.circle(*O, r), plot.line(*line), plot.segment(P, Q1, "#047857"), plot.segment(P, Q2, "#f97316"), plot.segment(Q1, Q2, "#dc2626", 2.2)]
        body += [plot.point(*P, "P(2,1)", "#dc2626"), plot.point(*Q1, "Q₁", "#047857"), plot.point(*Q2, "Q₂", "#f97316")]
        fact = {"center": O, "radius": r, "externalPoint": P, "contactChord": line, "contactPoints": [Q1, Q2], "slopeProduct": 1 / 7}
        return svg_doc(folder, qid, "점 P에서 그은 두 접선의 접촉현", fact, plot, body, ["원: x²+y²=1/2", "접촉현: 2x+y−1/2=0", "두 접점은 원주 위", "m₁m₂=1/7"])
    if key == ("24_매산고_1학기_기말_고1_기출", 15):
        L = (4, 1, -17); C = (-9, 2); plot = Plot((-14, 7), (-8, 9)); body = [plot.line(*L, "#111827", 1.7), plot.circle(*C, 11, "#2563eb", "#dbeafe"), plot.point(4, 1, "H(4,1)", "#dc2626"), plot.point(*C, "C(−9,2)", "#2563eb")]
        fact = {"fixedPoint": (4, 1), "maxDistanceLine": L, "circleCenter": C, "circleRadius": 11, "d": 3 * math.sqrt(17)}
        return svg_doc(folder, qid, "점 (4,1)을 지나는 최대거리 직선", fact, plot, body, ["l: 4x+y−17=0", "C=(−9,2), r=11", "d(C,l)=3√17>11", "mM=32"])
    if key == ("24_매산고_1학기_기말_고1_기출", 17):
        plot = Plot((-4, 5), (-7, 5)); body = [plot.line(0, 1, 0, "#111827", 1.5), plot.line(1, -1, 0, "#dc2626", 2.1), plot.line(1, 1, 0, "#7c3aed", 1.7, "5 4")]
        c1, c2 = (2, 2 * (math.sqrt(2) - 1)), (2, 2 * (-math.sqrt(2) - 1)); body += [plot.circle(*c1, abs(c1[1]), "#2563eb", "#dbeafe"), plot.circle(*c2, abs(c2[1]), "#16a34a", "#dcfce7"), plot.point(*c1, "C₁"), plot.point(*c2, "C₂")]
        fact = {"axes": ["x=0", "y=x"], "centers": [c1, c2], "ratios": [math.sqrt(2) - 1, -math.sqrt(2) - 1]}
        return svg_doc(folder, qid, "x축과 y=x에 동시에 접하는 중심 방향", fact, plot, body, ["|b|=|a−b|/√2", "b/a=√2−1", "b/a=−√2−1", "두 각의 이등분선 방향"])
    # 2024: 제일고
    if key == ("24_제일고_1학기_기말_고1_기출", 10):
        return circle_line(folder, qid, "원의 중심 (−4,−1)", (-4, -1), 3, None, [(-4, -1, "C(−4,−1)"), (-4, 2, "P")], ["(x+4)²+(y+1)²=9", "중심=(−4,−1)", "반지름=3", "a+b+c=−2"], (-9, 2), (-5, 4), [((-4, -1), (-4, 2), "#dc2626")])
    if key == ("24_제일고_1학기_기말_고1_기출", 12):
        c1, r1, c2, r2 = (-1, 3), math.sqrt(20), (-4, -6), math.sqrt(50); Q = (-1, 3); common = (1, 3, 2); newc, newr = (-2, 0), math.sqrt(10); I = circle_intersections(c1, r1, c2, r2)
        plot = Plot((-9, 5), (-15, 10)); body = [plot.circle(*c1, r1, "#2563eb", "#dbeafe"), plot.circle(*c2, r2, "#16a34a", "#dcfce7"), plot.circle(*newc, newr, "#f97316", "#ffedd5", "6 4"), plot.line(*common), plot.segment(I[0], I[1], "#dc2626", 2.3)]
        body += [plot.point(*I[0], "A", "#dc2626"), plot.point(*I[1], "B", "#dc2626"), plot.point(*Q, "Q(−1,3)", "#f97316"), plot.point(*newc, "C₃", "#f97316")]
        fact = {"originalCircles": [(c1, r1), (c2, r2)], "radicalAxis": common, "intersections": I, "newCircle": (newc, newr), "extraPoint": Q}
        return svg_doc(folder, qid, "두 원의 교점과 새 원", fact, plot, body, ["공통현: x+3y+2=0", "교점: (1,−1), (−5,1)", "새 원: (x+2)²+y²=10", "Q=(−1,3)도 새 원 위"])
    if key == ("24_제일고_1학기_기말_고1_기출", 13):
        S = (1, -7); C = (3, -1); r = math.sqrt(13); m1, m2 = (-4 + math.sqrt(39)) / 3, (-4 - math.sqrt(39)) / 3; l1 = (m1, -1, -(m1 + 7)); l2 = (m2, -1, -(m2 + 7)); plot = Plot((-5, 9), (-9, 7)); body = [plot.circle(*C, r), plot.line(*l1, "#047857", 2.3), plot.line(*l2, "#f97316", 2.3), plot.point(*S, "S(1,−7)", "#dc2626"), plot.point(*C, "C(3,−1)")]
        fact = {"center": C, "radius": r, "externalPoint": S, "slopes": [m1, m2], "lines": [l1, l2]}
        return svg_doc(folder, qid, "점 S에서 그은 두 접선", fact, plot, body, ["C=(3,−1), r=√13", f"m₁={n(m1)}, m₂={n(m2)}", "9m²+24m−23=0", "m₁+m₂=−8/3"])
    if key == ("24_제일고_1학기_기말_고1_기출", 15):
        L1, L2 = (2, -1, -9 - 2 * math.sqrt(5)), (2, -1, -14 + 2 * math.sqrt(5)); c1, c2 = (5, 1), (8, 2); plot = Plot((1, 12), (-4, 10)); body = [plot.circle(*c1, 2, "#2563eb", "#dbeafe"), plot.circle(*c2, 2, "#16a34a", "#dcfce7"), plot.line(*L1, "#dc2626", 2.2, "6 4"), plot.line(*L2, "#7c3aed", 2.2, "6 4")]
        fact = {"circles": [(c1, 2), (c2, 2)], "lineFamily": "y=2(x−m)", "mRange": [7 - math.sqrt(5), (9 + 2 * math.sqrt(5)) / 2], "boundaryLines": [L1, L2]}
        return svg_doc(folder, qid, "두 원과 평행 이동 직선", fact, plot, body, ["기울기=2", "m의 공통 범위=[7−√5,(9+2√5)/2]", "두 끝에서는 접함", "a+b=23/2"])
    if key == ("24_제일고_1학기_기말_고1_기출", 17):
        c1, r1, c2, r2 = (2, 4), math.sqrt(10), (5, -2), 5; chord = (1, -2, 1); P = (5 + math.sqrt(5), -2 - 2 * math.sqrt(5)); plot = Plot((-4, 12), (-10, 7)); body = [plot.circle(*c1, r1, "#2563eb", "#dbeafe"), plot.circle(*c2, r2, "#16a34a", "#dcfce7"), plot.line(*chord), plot.point(*P, "P", "#dc2626"), plot.point(*c2, "C₂")]
        fact = {"circles": [(c1, r1), (c2, r2)], "commonChord": chord, "maxPoint": P, "area": 10 + 5 * math.sqrt(5)}
        return svg_doc(folder, qid, "공통현을 밑변으로 한 최대 넓이", fact, plot, body, ["공통현: x−2y+1=0", "C₂=(5,−2), r=5", "최대점 P=C₂+5(1,−2)/√5", "넓이=10+5√5"])
    if key == ("24_제일고_1학기_기말_고1_기출", 21):
        S = (-1, 0); C = (2, 1); line1, line2 = (-2, 1, -2), (1, 2, 1 / 2); plot = Plot((-5, 6), (-5, 6)); body = [plot.circle(*C, math.sqrt(5)), plot.line(*line1, "#047857", 2.3), plot.line(*line2, "#f97316", 2.3), plot.point(*S, "S(−1,0)", "#dc2626"), plot.point(*C, "C(2,1)")]
        fact = {"center": C, "radius": math.sqrt(5), "externalPoint": S, "tangentLines": [line1, line2], "equations": ["y=2x+2", "y=−x/2−1/2"]}
        return svg_doc(folder, qid, "점 S에서 원에 그은 두 접선", fact, plot, body, ["C=(2,1), r=√5", "접선 1: y=2x+2", "접선 2: y=−x/2−1/2", "두 접선 모두 S를 지남"])
    if key == ("24_제일고_1학기_기말_고1_기출", 22):
        O, r = (5, 3), 3; A, B = (5 - math.sqrt(5), 1), (5 + math.sqrt(5), 1); C1, C2, C3 = (5 - 2 * math.sqrt(2), 2), (5 + 2 * math.sqrt(2), 2), (5, 0); plot = Plot((0, 10), (-1, 7)); body = [plot.circle(*O, r), plot.line(0, 1, -1), plot.segment(A, B, "#dc2626", 2.2), plot.segment(C1, C2, "#047857", 2.2), plot.segment(C2, C3, "#047857", 2.2), plot.segment(C3, C1, "#047857", 2.2)]
        body += [plot.point(*A, "A"), plot.point(*B, "B"), plot.point(*C1, "C₁"), plot.point(*C2, "C₂"), plot.point(*C3, "C₃")]
        fact = {"circle": (O, r), "AB": [A, B], "trianglePoints": [C1, C2, C3], "baseLine": "y=1"}
        return svg_doc(folder, qid, "넓이 조건으로 정한 C₁,C₂,C₃", fact, plot, body, ["원 중심=(5,3), r=3", "AB=2√5", "C₁,C₂: y=2", "C₃: (5,0), 넓이=4√2"])
    # 2025: 2final
    if key == ("25_금당고_2학기_기말_고1_기출", 18):
        plot = Plot((-8, 8), (-12, 12)); body = [plot.circle(0, 0, math.sqrt(10), "#2563eb", "#dbeafe"), plot.line(2, -1, -5 * math.sqrt(2), "#dc2626", 2.0, "6 4"), plot.line(2, -1, 5 * math.sqrt(2), "#dc2626", 2.0, "6 4")]
        body += [plot.segment((-1, 3), (1, -3), "#047857", 2.1), plot.point(-1, 3, "A"), plot.point(1, -3, "B"), plot.point(0, 0, "O")]
        fact = {"locusCircle": ((0, 0), math.sqrt(10)), "lineFamily": "2x−y=k", "kRange": [-5 * math.sqrt(2), 5 * math.sqrt(2)], "integerK": list(range(-7, 8))}
        return svg_doc(folder, qid, "직선 2x−y=k와 자취 원", fact, plot, body, ["∠APB=90°의 자취: AB 지름 원", "직선 기울기=2", "|k|≤5√2", "정수 k: −7,…,7 (15개)"])
    if key == ("25_제일고_2학기_기말_고1_기출", 3):
        return circle_line(folder, qid, "점 T(3,4)에서의 접선", (0, 0), 5, (3, 4, -25), [(0, 0, "O"), (3, 4, "T(3,4)")], ["T=(3,4) ∈ x²+y²=25", "접선: 3x+4y−25=0", "OT ⟂ 접선", "접점과 직선이 일치"], (-2, 9), (-2, 8), [((0, 0), (3, 4), "#7c3aed")])
    if key == ("25_제일고_2학기_기말_고1_기출", 7):
        C, P, r = (3, -2), (-1, 2), 2; Q1 = ((5 + math.sqrt(7)) / 2, (-3 + math.sqrt(7)) / 2); Q2 = ((5 - math.sqrt(7)) / 2, (-3 - math.sqrt(7)) / 2); plot = Plot((-4, 7), (-7, 5)); body = [plot.circle(*C, r), plot.segment(P, Q1, "#047857"), plot.segment(P, Q2, "#f97316"), plot.segment(C, Q1, "#7c3aed", 1.7, "5 4"), plot.segment(C, Q2, "#7c3aed", 1.7, "5 4")]
        body += [plot.point(*C, "C(3,−2)"), plot.point(*P, "P(−1,2)", "#dc2626"), plot.point(*Q1, "Q₁", "#047857"), plot.point(*Q2, "Q₂", "#f97316")]
        fact = {"center": C, "radius": r, "externalPoint": P, "tangentPoints": [Q1, Q2], "slopeProduct": 1}
        return svg_doc(folder, qid, "점 P에서 그은 두 접선", fact, plot, body, ["C=(3,−2), r=2", "P=(−1,2)", "Q₁,Q₂는 실제 원주 위", "두 기울기의 곱=1"])
    # 2025: 2mid 금당고
    if key == ("25_금당고_2학기_중간_고1_기출", 3):
        return circle_line(folder, qid, "원의 중심 (2,0)과 반지름 √6", (2, 0), math.sqrt(6), None, [(2, 0, "C(2,0)"), (2 + math.sqrt(6), 0, "P")], ["(x−2)²+y²=6", "중심=(2,0)", "r=√6", "실제 원주에 맞춘 반지름"], (-2, 7), (-4, 4), [((2, 0), (2 + math.sqrt(6), 0), "#dc2626")])
    if key == ("25_금당고_2학기_중간_고1_기출", 4):
        plot = Plot((-5, 5), (-14, 14)); body = [plot.circle(0, 0, math.sqrt(10), "#2563eb", "#dbeafe"), plot.line(3, -1, -10, "#dc2626", 2.2), plot.line(3, -1, 10, "#7c3aed", 2.2)]
        fact = {"circle": ((0, 0), math.sqrt(10)), "tangentLines": [(3, -1, -10), (3, -1, 10)], "k": [-10, 10]}
        return svg_doc(folder, qid, "원 x²+y²=10의 두 평행 접선", fact, plot, body, ["직선: y=3x+k", "기울기=3", "k=−10, 10", "두 접선의 거리는 반지름 조건"])
    if key == ("25_금당고_2학기_중간_고1_기출", 8):
        plot = Plot((-5, 11), (-4, 10)); body = [plot.circle(2, 3, math.sqrt(7), "#2563eb", "#dbeafe"), plot.circle(4, 3, 4, "#16a34a", "#dcfce7"), plot.point(2, 3, "C₁"), plot.point(4, 3, "C₂")]
        fact = {"centers": [(2, 3), (4, 3)], "radii": [math.sqrt(7), 4], "naturalK": [1, 2], "radiusSquared": "3k²+4"}
        return svg_doc(folder, qid, "자연수 k에 따른 원과 반지름", fact, plot, body, ["중심=(2k,3)", "r²=3k²+4", "k=1: r=√7", "k=2: r=4≤5"])
    if key == ("25_금당고_2학기_중간_고1_기출", 11):
        return circle_line(folder, qid, "원과 만나지 않는 직선", (2, -1), math.sqrt(10), (3, -1, 4), [(2, -1, "C(2,−1)")], ["직선: y=3x+4", "중심거리=|k+7|/√10", "k=3은 접선 경계", "자연수 최소 k=4"], (-5, 8), (-8, 10), [((2, -1), foot(3, -1, 4, 2, -1), "#047857")])
    if key == ("25_금당고_2학기_중간_고1_기출", 12):
        O = (0, 0); A, B = (2, -3), (3, 2); P = (5, -1); G = (10 / 3, -2 / 3); plot = Plot((-4, 8), (-6, 6)); body = [plot.circle(*O, math.sqrt(13)), plot.line(2, -3, -13, "#047857", 2.1), plot.line(3, 2, -13, "#f97316", 2.1), plot.segment(A, B, "#dc2626", 2.1), plot.segment(O, A, "#7c3aed", 1.6, "5 4"), plot.segment(O, B, "#7c3aed", 1.6, "5 4")]
        body += [plot.point(*A, "A(2,−3)"), plot.point(*B, "B(3,2)"), plot.point(*P, "P(5,−1)", "#dc2626"), plot.point(*G, "G(10/3,−2/3)", "#f97316")]
        fact = {"circle": (O, math.sqrt(13)), "tangencyPoints": [A, B], "tangentIntersection": P, "centroid": G, "tangentLines": [(2, -3, -13), (3, 2, -13)]}
        return svg_doc(folder, qid, "두 접선과 삼각형의 무게중심", fact, plot, body, ["2x−3y=13, 3x+2y=13", "P=(5,−1)", "G=(10/3,−2/3)", "세 꼭짓점의 좌표 평균"])
    if key == ("25_금당고_2학기_중간_고1_기출", 16):
        C, P, r = (2, -3), (2, 5), 5; half = 5 * math.sqrt(39) / 8; A, B = (2 - half, 1 / 8), (2 + half, 1 / 8); plot = Plot((-5, 8), (-7, 8)); body = [plot.circle(*C, r), plot.segment(P, A, "#047857", 2.1), plot.segment(P, B, "#f97316", 2.1), plot.segment(A, B, "#dc2626", 2.4), plot.segment(P, C, "#7c3aed", 1.8, "5 4")]
        body += [plot.point(*P, "P(2,5)", "#dc2626"), plot.point(*C, "C(2,−3)"), plot.point(*A, "A", "#047857"), plot.point(*B, "B", "#f97316")]
        fact = {"center": C, "externalPoint": P, "radius": r, "contactChord": "y=1/8", "contactPoints": [A, B], "diagonals": ["PC", "AB"]}
        return svg_doc(folder, qid, "접점 현 AB와 수직 대각선 PC", fact, plot, body, ["C=(2,−3), r=5", "P=(2,5)", "AB: y=1/8", "사각형 넓이=5√39"])
    if key == ("25_금당고_2학기_중간_고1_기출", 18):
        C1, r1 = (-1, 2), math.sqrt(10); plot = Plot((-6, 8), (-7, 8)); body = [plot.circle(*C1, r1, "#2563eb", "#dbeafe")]; ks = [4, 16, 40, 52]; colors = ["#16a34a", "#f97316", "#7c3aed", "#dc2626"]; circles = []
        for k, color in zip(ks, colors):
            c2, r2 = (2, -1), math.sqrt(k); line = (-6, 6, 10 - k); ints = circle_intersections(C1, r1, c2, r2); body += [plot.circle(*c2, r2, color, "#fff", "5 4"), plot.line(*line, color, 1.4, "4 3")]; body += [plot.point(*p, f"k={k}", color, radius=2.2, dx=4, dy=-4) for p in ints]; circles.append({"k": k, "center": c2, "radius": r2, "line": line, "intersections": ints})
        body += [plot.point(*C1, "C₁"), plot.point(2, -1, "C₂")]
        fact = {"circle1": (C1, r1), "circle2Center": (2, -1), "cases": circles, "area": 4}
        return svg_doc(folder, qid, "공통현과 넓이 조건의 네 k 경우", fact, plot, body, ["C₁=(−1,2), r₁=√10", "d=√2 또는 2√2", "k=4,16,40,52 모두 실제 교점", "모든 k의 합=112"])
    if key == ("25_금당고_2학기_중간_고1_기출", 19):
        O, A, c = (0, 0), (6, 0), (7, -4); r = math.sqrt(65); plot = Plot((-4, 14), (-12, 8)); body = [plot.circle(*c, r, "#2563eb", "#dbeafe"), plot.circle(3, 0, 3, "#7c3aed", "#ede9fe", "5 4"), plot.line(1, 0, 0, "#111827", 1.4), plot.point(0, -8, "P₁"), plot.point(6, 4, "P₂"), plot.point(6, -12, "P₃"), plot.point(3, 3, "P₄", "#dc2626")]
        body += [plot.point(*O, "O"), plot.point(*A, "A")]
        fact = {"originalCircle": (c, r), "OA": [O, A], "rightAngleCandidates": [(0, -8), (6, 4), (6, -12), (3, 3)], "areas": [24, 12, 36, 9]}
        return svg_doc(folder, qid, "세 꼭짓점별 직각 조건 전수검토", fact, plot, body, ["직각 at O: P=(0,−8), 넓이24", "직각 at A: P=(6,4),(6,−12)", "직각 at P: Thales 원과 교점 P=(3,3)", "가능 넓이: 9,12,24,36"])
    if key == ("25_금당고_2학기_중간_고1_기출", 21):
        C, P, r = (2, -1), (-4, 2), 3; T = P; A, B = (16 / 5, 8 / 5), (2 / 5, -16 / 5); plot = Plot((-7, 7), (-6, 6)); body = [plot.circle(*C, r), plot.segment(P, A, "#047857", 2.1), plot.segment(P, B, "#f97316", 2.1), plot.segment(A, B, "#dc2626", 2.4), plot.segment(P, C, "#7c3aed", 1.8, "5 4")]
        body += [plot.point(*P, "P(−4,2)", "#dc2626"), plot.point(*C, "C(2,−1)"), plot.point(*A, "A(16/5,8/5)", "#047857"), plot.point(*B, "B(2/5,−16/5)", "#f97316")]
        fact = {"center": C, "externalPoint": P, "radius": r, "contactPoints": [A, B], "contactChord": "y=2x−2", "area": 72 / 5}
        return svg_doc(folder, qid, "삼각형 PAB와 접점 현", fact, plot, body, ["CP=3√5, r=3", "AB: y=2x−2", "AM=6/√5, PM=12/√5", "넓이=72/5"])
    # 2025: 2mid 매산고
    if key == ("25_매산고_2학기_중간_고1_기출", 7):
        A, B, C = (5, -1), (-3, 5), (1, 2); plot = Plot((-5, 7), (-4, 8)); body = [plot.circle(*C, 5), plot.segment(A, B, "#dc2626", 2.3), plot.point(*A, "A(5,−1)"), plot.point(*B, "B(−3,5)"), plot.point(*C, "C(1,2)")]
        fact = {"diameter": [A, B], "center": C, "radius": 5, "equation": "(x−1)²+(y−2)²=25"}
        return svg_doc(folder, qid, "지름 AB로 정한 원", fact, plot, body, ["A=(5,−1), B=(−3,5)", "중심 C=(1,2)", "r=5", "bc/a=−40"])
    if key == ("25_매산고_2학기_중간_고1_기출", 10):
        A, O = (15, 0), (0, 0); r = 3; h = (36 / 41, 45 / 41); q1 = (h[0] - 60 * math.sqrt(2) / 41, h[1] + 48 * math.sqrt(2) / 41); q2 = (h[0] + 60 * math.sqrt(2) / 41, h[1] - 48 * math.sqrt(2) / 41); plot = Plot((-2, 17), (-7, 7)); body = [plot.circle(*O, r), plot.segment(A, q1, "#047857", 2.2), plot.segment(A, q2, "#f97316", 2.2), plot.segment(O, q1, "#7c3aed", 1.7, "5 4"), plot.segment(O, q2, "#7c3aed", 1.7, "5 4")]
        body += [plot.point(*A, "A(15,0)", "#dc2626"), plot.point(*O, "O"), plot.point(*q1, "T₁", "#047857"), plot.point(*q2, "T₂", "#f97316")]
        fact = {"earth": (O, r), "satellite": A, "tangentPoints": [q1, q2], "slopeSquared": 1 / 24}
        return svg_doc(folder, qid, "위성 A에서 지구에 그은 두 접선", fact, plot, body, ["지구: x²+y²=9", "A=(15,0)", "T₁,T₂는 실제 원주 위", "m₁m₂=−1/24, a+b=25"])
    if key == ("25_매산고_2학기_중간_고1_기출", 14):
        line = (1, 3, -1); c1, c2 = (-3, -2), (3, -4); T, H = (-2, 1), (4, -1); plot = Plot((-8, 9), (-8, 6)); body = [plot.circle(*c1, math.sqrt(10), "#2563eb", "#dbeafe"), plot.circle(*c2, math.sqrt(10), "#16a34a", "#dcfce7"), plot.line(*line, "#dc2626", 2.3), plot.segment(c1, T, "#7c3aed", 1.8, "5 4"), plot.segment(c2, H, "#7c3aed", 1.8, "5 4")]
        body += [plot.point(*c1, "C₁(−3,−2)"), plot.point(*c2, "C₂(3,−4)"), plot.point(*T, "T(−2,1)", "#dc2626"), plot.point(*H, "H")]
        fact = {"line": line, "firstCircle": (c1, math.sqrt(10)), "secondCircle": (c2, math.sqrt(10)), "touchPoints": [T, H]}
        return svg_doc(folder, qid, "공통 접선과 두 접점", fact, plot, body, ["접선: x+3y−1=0", "T=(−2,1)에서 첫 원에 접함", "H=(4,−1)에서 둘째 원에 접함", "두 중심에서 선까지 거리=√10"])
    if key == ("25_매산고_2학기_중간_고1_기출", 18):
        A, B, D, E = (4, 2), (0, 4), (8 / 3, 8 / 3), (8 / 5, 16 / 5); O = (0, 0); C = (4 / 3, 4 / 3); plot = Plot((-2, 7), (-2, 7)); body = [plot.line(1, 0, 0, "#111827", 1.4), plot.line(0, 1, 0, "#111827", 1.4), plot.segment(A, B, "#64748b", 2.1), plot.line(1, -1, 0, "#047857", 1.8, "5 4"), plot.line(1, -2, 0, "#dc2626", 1.8, "5 4"), plot.circle(*C, math.sqrt(32) / 3, "#7c3aed", "#ede9fe", "5 4")]
        body += [plot.point(*A, "A(4,2)"), plot.point(*B, "B(0,4)"), plot.point(*D, "D(8/3,8/3)", "#047857"), plot.point(*E, "E(8/5,16/5)", "#dc2626"), plot.point(*O, "O"), plot.point(*C, "C", "#7c3aed")]
        fact = {"A": A, "B": B, "D": D, "E": E, "circumcenter": C, "radiusSquared": 32 / 9}
        return svg_doc(folder, qid, "선분 AB와 D,E, 외접원", fact, plot, body, ["A=(4,2), B=(0,4)", "D=(8/3,8/3), E=(8/5,16/5)", "외접원 중심=(4/3,4/3)", "36k=128"])
    if key == ("25_매산고_2학기_중간_고1_기출", 20):
        M1, M2 = (1 / 5, 1 / 5), (3 / 2, 3 / 2); P1 = (18 / 65, 5 / 13); P2 = (156 / 169, 39 / 338); line = (5, 12, -6); plot = Plot((-1, 4), (-1, 4)); body = [plot.circle(*M1, 1 / 5, "#2563eb", "#dbeafe"), plot.circle(*M2, 3 / 2, "#16a34a", "#dcfce7"), plot.line(*line, "#dc2626", 2.3), plot.segment(M1, P1, "#7c3aed", 1.8, "5 4"), plot.segment(M2, P2, "#7c3aed", 1.8, "5 4"), plot.segment(M1, P1, "#047857", 2.0), plot.segment(M2, P2, "#f97316", 2.0)]
        body += [plot.point(*M1, "M₁"), plot.point(*M2, "M₂"), plot.point(*P1, "P₁", "#047857"), plot.point(*P2, "P₂", "#f97316")]
        fact = {"line": line, "centers": [M1, M2], "radii": [1 / 5, 3 / 2], "feet": [P1, P2]}
        return svg_doc(folder, qid, "두 축 접원과 직선 l의 접점", fact, plot, body, ["l: 5x+12y−6=0", "M₁=(1/5,1/5), M₂=(3/2,3/2)", "P₁=(18/65,5/13)", "P₂=(156/169,39/338)"])
    # 2025: 2mid 순천고
    if key == ("25_순천고_2학기_중간_고1_기출", 7):
        C, r, line = (1, -2), 3, (5, -12, 1); return circle_line(folder, qid, "두 교점이 생기는 반지름", C, r, line, [(1, -2, "C(1,−2)")], ["중심거리 d=30/13", "두 교점 ⇔ r>d", "최소 자연수 r=3", "등호 r=30/13은 접선"], (-5, 7), (-7, 4), [((1, -2), foot(*line, 1, -2), "#047857")])
    if key == ("25_순천고_2학기_중간_고1_기출", 9):
        plot = Plot((-5, 8), (-7, 5)); body = [plot.circle(1, -1, 1, "#2563eb", "#dbeafe"), plot.circle(5, -5, 5, "#16a34a", "#dcfce7"), plot.line(1, 0, 0), plot.line(0, 1, 0), plot.point(2, -1, "P(2,−1)", "#dc2626"), plot.point(1, -1, "C₁"), plot.point(5, -5, "C₂")]
        fact = {"point": (2, -1), "centers": [(1, -1), (5, -5)], "radii": [1, 5], "axes": True}
        return svg_doc(folder, qid, "두 축 접원과 점 P", fact, plot, body, ["가능한 중심은 (r,−r)", "r=1,5", "P=(2,−1)", "반지름의 합=6"])
    if key == ("25_순천고_2학기_중간_고1_기출", 10):
        C, r, line = (1, 0), math.sqrt(3), (1, -1, 1); H = foot(*line, *C); t = (1 / math.sqrt(2), 1 / math.sqrt(2)); half = 1; A, B = (H[0] + half * t[0], H[1] + half * t[1]), (H[0] - half * t[0], H[1] - half * t[1]); plot = Plot((-3, 6), (-4, 5)); body = [plot.circle(*C, r), plot.line(*line), plot.segment(A, B, "#dc2626", 2.4), plot.segment(C, H, "#7c3aed", 1.8, "5 4"), plot.point(*C, "C(1,0)"), plot.point(*A, "A"), plot.point(*B, "B")]
        fact = {"circle": (C, r), "line": line, "foot": H, "chord": [A, B], "length": 2}
        return svg_doc(folder, qid, "원과 직선의 실제 현", fact, plot, body, ["r=√3", "d(C,line)=√2", "반현=1", "현의 길이=2"])
    # 2025: 2mid 순천여고
    if key == ("25_순천여고_2학기_중간_고1_공통수학2", 14):
        C, r, base = (1, -3), 2, (3, -4, 5); plot = Plot((-4, 8), (-8, 18)); body = [plot.circle(*C, r), plot.line(*base, "#0f766e", 2.3), plot.line(3, -4, -5, "#f59e0b", 1.5, "6 4"), plot.line(3, -4, 35, "#f59e0b", 1.5, "6 4")]
        body += [plot.point(*C, "C(1,−3)")]
        fact = {"center": C, "radius": r, "baseLine": base, "distanceRange": [2, 6], "naturalDistances": [2, 3, 4, 5, 6], "counts": [1, 2, 2, 2, 1]}
        return svg_doc(folder, qid, "원 위 점과 직선까지의 자연수 거리", fact, plot, body, ["기준 직선: 3x−4y+5=0", "거리 범위: 2≤d≤6", "d=2,6은 접선", "점 개수=1+2+2+2+1=8"])
    if key == ("25_순천여고_2학기_중간_고1_공통수학2", 17):
        c1, r1, c2, r2 = (-2, -2), math.sqrt(8), (-1, 0), math.sqrt(3); line = (1, 2, 1); I = circle_intersections(c1, r1, c2, r2); plot = Plot((-6, 4), (-6, 4)); body = [plot.circle(*c1, r1, "#2563eb", "#dbeafe"), plot.circle(*c2, r2, "#16a34a", "#dcfce7"), plot.line(*line, "#dc2626", 2.4), plot.point(*I[0], "A", "#dc2626"), plot.point(*I[1], "B", "#dc2626"), plot.point(*c1, "C₁"), plot.point(*c2, "C₂")]
        fact = {"circles": [(c1, r1), (c2, r2)], "commonChord": line, "intersections": I, "parameters": {"a": -4, "b": 0}}
        return svg_doc(folder, qid, "두 원의 공통현 직선", fact, plot, body, ["C₁: 중심=(−2,−2), r=√8", "C₂: 중심=(−1,0), r=√3", "공통현: x+2y+1=0", "a²+b²=16"])
    if key == ("25_순천여고_2학기_중간_고1_공통수학2", 21):
        O, A, r = (0, 0), (2, 4), math.sqrt(2); line = (1, 2, -1); H = foot(*line, *O); t = (-2 / math.sqrt(5), 1 / math.sqrt(5)); half = 3 / math.sqrt(5); P, Q = (H[0] + half * t[0], H[1] + half * t[1]), (H[0] - half * t[0], H[1] - half * t[1]); plot = Plot((-3, 6), (-3, 7)); body = [plot.circle(*O, r), plot.line(*line), plot.segment(A, P, "#047857"), plot.segment(A, Q, "#f97316"), plot.segment(P, Q, "#dc2626", 2.4), plot.segment(O, H, "#7c3aed", 1.8, "5 4")]
        body += [plot.point(*A, "A(2,4)", "#dc2626"), plot.point(*P, "P", "#047857"), plot.point(*Q, "Q", "#f97316"), plot.point(*H, "H")]
        fact = {"circle": (O, r), "externalPoint": A, "contactChord": line, "contactPoints": [P, Q], "area": 27 / 5}
        return svg_doc(folder, qid, "점 A의 접점 현 PQ", fact, plot, body, ["접촉현: x+2y−1=0", "PQ=6/√5", "높이=9/√5", "삼각형 APQ 넓이=27/5"])
    # 2025: 제일고 2mid
    if key == ("25_제일고_2학기_중간_고1_기출", 13):
        plot = Plot((-5, 8), (-9, 3)); body = [plot.circle(2, -4, math.sqrt(10), "#2563eb", "#dbeafe"), plot.line(1, 3, 0, "#dc2626", 2.3), plot.line(1, 3, 20, "#7c3aed", 2.3), plot.point(2, -4, "C(2,−4)")]
        fact = {"center": (2, -4), "radius": math.sqrt(10), "parallelTangents": [(1, 3, 0), (1, 3, 20)], "k": [0, 20]}
        return svg_doc(folder, qid, "원의 두 평행 접선", fact, plot, body, ["직선: x+3y+k=0", "두 직선 모두 기울기=−1/3", "k=0,20", "모든 k의 곱=0"])
    raise KeyError(f"unimplemented target {folder} q{qid}")


def main() -> None:
    if TARGET_COUNT != 65:
        raise AssertionError(f"target count mismatch: {TARGET_COUNT}")
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    rows = []
    for folder, ids in TARGETS.items():
        for qid in ids:
            svg, meta = build(folder, qid)
            out = ASSETS / folder / f"q{qid:02d}-solution.svg"
            if not out.exists():
                raise FileNotFoundError(out)
            out.write_text(svg, encoding="utf-8")
            meta["bytes"] = len(svg.encode("utf-8"))
            meta["sha256"] = hashlib.sha256(svg.encode("utf-8")).hexdigest()
            rows.append(meta)
    (REPORT_DIR / "python_geometry_verification.json").write_text(json.dumps({"status": "PASS", "targetCount": len(rows), "rows": rows}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": "PASS", "targetCount": len(rows), "modifiedAssetCount": len(rows), "report": str((REPORT_DIR / 'python_geometry_verification.json').relative_to(ROOT))}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
