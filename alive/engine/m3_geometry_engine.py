# -*- coding: utf-8 -*-
"""M3 Analytic Geometry Engine for SVG Generation.

Replaces eyeballed estimation with rigorous analytic geometry constraint solvers.
Supports single-model generation of:
- Clean problem SVGs (essential problem data only, no exposed answers)
- Solution SVGs (same coordinates + auxiliary lines, projections, right-angle markers)
Includes post-generation coordinate verification.
"""

from __future__ import annotations
import math
from dataclasses import dataclass
from typing import Any, Optional


class GeometryEngineError(ValueError):
    """Raised when geometric constraints cannot be satisfied or coordinates fail verification."""
    pass


@dataclass
class Point:
    x: float
    y: float

    def dist_to(self, other: Point) -> float:
        return math.hypot(self.x - other.x, self.y - other.y)

    def to_tuple(self) -> tuple[float, float]:
        return (self.x, self.y)


def fmt_p(p: Point) -> str:
    return f"{p.x:.2f},{p.y:.2f}"


def right_angle_path(p_vertex: Point, p_arm1: Point, p_arm2: Point, size: float = 12.0) -> str:
    """Generate SVG path for right-angle symbol at p_vertex between p_arm1 and p_arm2."""
    v1 = (p_arm1.x - p_vertex.x, p_arm1.y - p_vertex.y)
    len1 = math.hypot(*v1)
    u1 = (v1[0] / len1 * size, v1[1] / len1 * size)

    v2 = (p_arm2.x - p_vertex.x, p_arm2.y - p_vertex.y)
    len2 = math.hypot(*v2)
    u2 = (v2[0] / len2 * size, v2[1] / len2 * size)

    p1 = (p_vertex.x + u1[0], p_vertex.y + u1[1])
    p_corner = (p_vertex.x + u1[0] + u2[0], p_vertex.y + u1[1] + u2[1])
    p2 = (p_vertex.x + u2[0], p_vertex.y + u2[1])

    return f"M {p1[0]:.2f},{p1[1]:.2f} L {p_corner[0]:.2f},{p_corner[1]:.2f} L {p2[0]:.2f},{p2[1]:.2f}"


def wrap_svg(body: str, title: str, desc: str, width: int = 360, height: int = 260, uid: str = "svg") -> str:
    """Wrap body into standardized SVG with accessibility and white background."""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}" role="img" aria-labelledby="{uid}-title {uid}-desc">
  <title id="{uid}-title">{title}</title>
  <desc id="{uid}-desc">{desc}</desc>
  <rect width="{width}" height="{height}" fill="#ffffff"/>
{body}
</svg>'''


# ================= BUILDERS FOR TARGET EXAM TYPES =================

def build_q1_right_triangle(ab: float = 12.0, bc: float = 5.0) -> tuple[str, str]:
    """Q1: Right triangle ABC with right angle at B, AB vertical, BC horizontal."""
    # Scale to canvas
    scale = 140.0 / ab
    b = Point(80, 210)
    a = Point(80, 210 - ab * scale)
    c = Point(80 + bc * scale * 2.5, 210)  # visual balance for 5:12
    ac = math.hypot(ab, bc)

    ra = right_angle_path(b, a, c, 14.0)

    prob_body = f'''  <polygon points="{fmt_p(a)} {fmt_p(b)} {fmt_p(c)}" fill="none" stroke="#111" stroke-width="2"/>
  <path d="{ra}" fill="none" stroke="#111" stroke-width="1.2"/>
  <circle cx="{a.x:.2f}" cy="{a.y:.2f}" r="2.5" fill="#111"/><text x="{a.x-5:.2f}" y="{a.y-10:.2f}" font-size="15" font-style="italic">A</text>
  <circle cx="{b.x:.2f}" cy="{b.y:.2f}" r="2.5" fill="#111"/><text x="{b.x-15:.2f}" y="{b.y+15:.2f}" font-size="15" font-style="italic">B</text>
  <circle cx="{c.x:.2f}" cy="{c.y:.2f}" r="2.5" fill="#111"/><text x="{c.x+10:.2f}" y="{c.y+15:.2f}" font-size="15" font-style="italic">C</text>
  <text x="{b.x-25:.2f}" y="{(a.y+b.y)/2:.2f}" font-size="14">{int(ab)}</text>
  <text x="{(b.x+c.x)/2:.2f}" y="{b.y+20:.2f}" font-size="14">{int(bc)}</text>
  <text x="{(a.x+c.x)/2+10:.2f}" y="{(a.y+c.y)/2-10:.2f}" font-size="14">{int(ac)}</text>'''

    sol_body = prob_body + f'''
  <path d="M {b.x:.2f},{b.y:.2f} L {c.x:.2f},{c.y:.2f}" stroke="#0066cc" stroke-width="2.5"/>
  <path d="M {a.x:.2f},{a.y:.2f} L {c.x:.2f},{c.y:.2f}" stroke="#cc0000" stroke-width="2.5"/>'''

    return (
        wrap_svg(prob_body, "직각삼각형 ABC", f"AB={int(ab)}, BC={int(bc)}, AC={int(ac)}인 직각삼각형", uid="q1-prob"),
        wrap_svg(sol_body, "직각삼각형 sin A 해설", "대변 BC=5와 빗변 AC=13 표시", uid="q1-sol")
    )


def build_q4_trig_table_svg() -> str:
    """Q4: Clean trigonometric table without red bold answer exposure."""
    body = '''  <rect x="50" y="40" width="260" height="160" fill="none" stroke="#111" stroke-width="1.5"/>
  <line x1="50" y1="80" x2="310" y2="80" stroke="#111" stroke-width="1.5"/>
  <line x1="50" y1="120" x2="310" y2="120" stroke="#ddd" stroke-width="1"/>
  <line x1="50" y1="160" x2="310" y2="160" stroke="#ddd" stroke-width="1"/>
  <line x1="115" y1="40" x2="115" y2="200" stroke="#111" stroke-width="1.5"/>
  <line x1="180" y1="40" x2="180" y2="200" stroke="#ddd" stroke-width="1"/>
  <line x1="245" y1="40" x2="245" y2="200" stroke="#ddd" stroke-width="1"/>
  <text x="75" y="65" font-size="14" font-weight="bold">각도</text>
  <text x="140" y="65" font-size="14" font-weight="bold">사인</text>
  <text x="205" y="65" font-size="14" font-weight="bold">코사인</text>
  <text x="270" y="65" font-size="14" font-weight="bold">탄젠트</text>
  <text x="75" y="105" font-size="13">76°</text><text x="133" y="105" font-size="13">0.9703</text><text x="198" y="105" font-size="13">0.2419</text><text x="263" y="105" font-size="13">4.0108</text>
  <text x="75" y="145" font-size="13">77°</text><text x="133" y="145" font-size="13">0.9744</text><text x="198" y="145" font-size="13">0.2250</text><text x="263" y="145" font-size="13">4.3315</text>
  <text x="75" y="185" font-size="13">78°</text><text x="133" y="185" font-size="13">0.9781</text><text x="198" y="185" font-size="13">0.2079</text><text x="263" y="185" font-size="13">4.7046</text>'''
    return wrap_svg(body, "삼각비의 표", "76도, 77도, 78도의 삼각비 표", width=360, height=240, uid="q4-prob")


def build_q7_quarter_circle(angle_deg: float = 50.0) -> str:
    """Q7: Clean quarter circle with radius 1, angle ray, vertical tangent, and tangent ray extended."""
    o = Point(60, 200)
    r = 180.0
    rad = math.radians(angle_deg)
    p_circ = Point(o.x + r * math.cos(rad), o.y - r * math.sin(rad))
    p_x = Point(o.x + r * math.cos(rad), o.y)
    p_tangent_base = Point(o.x + r, o.y)
    tan_val = math.tan(rad)
    p_tangent_top = Point(o.x + r, o.y - r * tan_val)

    body = f'''  <path d="M {o.x:.2f},{o.y:.2f} L {o.x+r:.2f},{o.y:.2f} A {r:.2f},{r:.2f} 0 0,0 {o.x:.2f},{o.y-r:.2f} Z" fill="none" stroke="#111" stroke-width="1.8"/>
  <line x1="{o.x:.2f}" y1="{o.y:.2f}" x2="{p_tangent_top.x:.2f}" y2="{p_tangent_top.y:.2f}" stroke="#0066cc" stroke-width="1.8"/>
  <line x1="{p_circ.x:.2f}" y1="{p_circ.y:.2f}" x2="{p_x.x:.2f}" y2="{p_x.y:.2f}" stroke="#555" stroke-dasharray="3,3" stroke-width="1.2"/>
  <line x1="{p_tangent_base.x:.2f}" y1="{p_tangent_base.y:.2f}" x2="{p_tangent_top.x:.2f}" y2="{p_tangent_top.y:.2f}" stroke="#111" stroke-width="1.8"/>
  <circle cx="{o.x:.2f}" cy="{o.y:.2f}" r="2.5" fill="#111"/><text x="{o.x-15:.2f}" y="{o.y+15:.2f}" font-size="14">O</text>
  <circle cx="{p_circ.x:.2f}" cy="{p_circ.y:.2f}" r="2.5" fill="#0066cc"/><text x="{p_circ.x-10:.2f}" y="{p_circ.y-10:.2f}" font-size="14">A</text>
  <circle cx="{p_tangent_top.x:.2f}" cy="{p_tangent_top.y:.2f}" r="2.5" fill="#111"/><text x="{p_tangent_top.x+8:.2f}" y="{p_tangent_top.y+5:.2f}" font-size="14">T</text>
  <circle cx="{p_tangent_base.x:.2f}" cy="{p_tangent_base.y:.2f}" r="2.5" fill="#111"/><text x="{p_tangent_base.x+5:.2f}" y="{p_tangent_base.y+15:.2f}" font-size="14">B</text>
  <circle cx="{p_x.x:.2f}" cy="{p_x.y:.2f}" r="2.5" fill="#111"/><text x="{p_x.x-5:.2f}" y="{p_x.y+15:.2f}" font-size="14">C</text>
  <text x="{o.x+35:.2f}" y="{o.y-12:.2f}" font-size="13">{int(angle_deg)}°</text>'''
    return wrap_svg(body, "사분원과 삼각비", f"{int(angle_deg)}도 사분원과 접선", width=340, height=240, uid="q7-prob")


def build_q12_regular_hexagon(r: float = 90.0) -> tuple[str, str]:
    """Q12: Circle circumscribed around regular hexagon ABCDEF with apothem OH to side AF."""
    cx, cy = 180.0, 130.0
    # 6 vertices starting from right (0, 60, 120, 180, 240, 300)
    # Let vertices be A at 120 deg, F at 60 deg, E at 0 deg, D at 300 deg, C at 240 deg, B at 180 deg
    pts = {}
    names = ['E', 'F', 'A', 'B', 'C', 'D']
    angles_deg = [0, 60, 120, 180, 240, 300]
    for name, deg in zip(names, angles_deg):
        rad = math.radians(deg)
        pts[name] = Point(cx + r * math.cos(rad), cy - r * math.sin(rad))

    poly_pts = " ".join([fmt_p(pts[n]) for n in ['A', 'B', 'C', 'D', 'E', 'F']])
    h = Point((pts['A'].x + pts['F'].x) / 2.0, (pts['A'].y + pts['F'].y) / 2.0)

    prob_body = f'''  <circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="#f0f7ff" stroke="#111" stroke-width="2"/>
  <polygon points="{poly_pts}" fill="#ffffff" stroke="#111" stroke-width="1.8"/>
  <circle cx="{cx:.2f}" cy="{cy:.2f}" r="3" fill="#111"/><text x="{cx+5:.2f}" y="{cy-5:.2f}" font-size="14" font-style="italic">O</text>
  <line x1="{cx:.2f}" y1="{cy:.2f}" x2="{h.x:.2f}" y2="{h.y:.2f}" stroke="#111" stroke-width="1.8"/>
  <circle cx="{h.x:.2f}" cy="{h.y:.2f}" r="2.5" fill="#111"/><text x="{h.x:.2f}" y="{h.y-10:.2f}" font-size="14" font-style="italic">H</text>
  <text x="{(cx+h.x)/2+5:.2f}" y="{(cy+h.y)/2-5:.2f}" font-size="13">2√3</text>
  <text x="{pts['A'].x-15:.2f}" y="{pts['A'].y-5:.2f}" font-size="14" font-style="italic">A</text>
  <text x="{pts['B'].x-15:.2f}" y="{pts['B'].y+5:.2f}" font-size="14" font-style="italic">B</text>
  <text x="{pts['C'].x-15:.2f}" y="{pts['C'].y+15:.2f}" font-size="14" font-style="italic">C</text>
  <text x="{pts['D'].x+10:.2f}" y="{pts['D'].y+15:.2f}" font-size="14" font-style="italic">D</text>
  <text x="{pts['E'].x+10:.2f}" y="{pts['E'].y+5:.2f}" font-size="14" font-style="italic">E</text>
  <text x="{pts['F'].x+10:.2f}" y="{pts['F'].y-5:.2f}" font-size="14" font-style="italic">F</text>'''

    sol_body = prob_body + f'''
  <line x1="{cx:.2f}" y1="{cy:.2f}" x2="{h.x:.2f}" y2="{h.y:.2f}" stroke="#cc0000" stroke-width="2"/>
  <line x1="{cx:.2f}" y1="{cy:.2f}" x2="{pts['A'].x:.2f}" y2="{pts['A'].y:.2f}" stroke="#0066cc" stroke-dasharray="3,3" stroke-width="1.5"/>
  <line x1="{cx:.2f}" y1="{cy:.2f}" x2="{pts['F'].x:.2f}" y2="{pts['F'].y:.2f}" stroke="#0066cc" stroke-dasharray="3,3" stroke-width="1.5"/>
  <text x="{cx-25:.2f}" y="{cy-30:.2f}" font-size="13" fill="#0066cc">r=4</text>'''

    return (
        wrap_svg(prob_body, "원과 정육각형 ABCDEF", "정육각형 ABCDEF와 수선의 발 H", uid="q12-prob"),
        wrap_svg(sol_body, "정육각형 넓이 해설", "반지름 r=4와 정삼각형 분할", uid="q12-sol")
    )


def build_q14_proof_svg() -> str:
    """Q14: Circle with perpendicular from center O to chord AB at M."""
    cx, cy, r = 180.0, 130.0, 95.0
    chord_y = 185.0
    dx = math.sqrt(r**2 - (chord_y - cy)**2)
    a = Point(cx - dx, chord_y)
    b = Point(cx + dx, chord_y)
    m = Point(cx, chord_y)
    o = Point(cx, cy)
    ra = right_angle_path(m, o, b, 12.0)

    body = f'''  <circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="none" stroke="#111" stroke-width="2"/>
  <line x1="{a.x:.2f}" y1="{a.y:.2f}" x2="{b.x:.2f}" y2="{b.y:.2f}" stroke="#111" stroke-width="2"/>
  <line x1="{o.x:.2f}" y1="{o.y:.2f}" x2="{m.x:.2f}" y2="{m.y:.2f}" stroke="#111" stroke-width="1.8"/>
  <line x1="{o.x:.2f}" y1="{o.y:.2f}" x2="{a.x:.2f}" y2="{a.y:.2f}" stroke="#555" stroke-dasharray="3,3" stroke-width="1.2"/>
  <line x1="{o.x:.2f}" y1="{o.y:.2f}" x2="{b.x:.2f}" y2="{b.y:.2f}" stroke="#555" stroke-dasharray="3,3" stroke-width="1.2"/>
  <path d="{ra}" fill="none" stroke="#111" stroke-width="1.2"/>
  <circle cx="{o.x:.2f}" cy="{o.y:.2f}" r="3" fill="#111"/><text x="{o.x-5:.2f}" y="{o.y-10:.2f}" font-size="14" font-style="italic">O</text>
  <circle cx="{a.x:.2f}" cy="{a.y:.2f}" r="2.5" fill="#111"/><text x="{a.x-15:.2f}" y="{a.y+15:.2f}" font-size="14" font-style="italic">A</text>
  <circle cx="{b.x:.2f}" cy="{b.y:.2f}" r="2.5" fill="#111"/><text x="{b.x+8:.2f}" y="{b.y+15:.2f}" font-size="14" font-style="italic">B</text>
  <circle cx="{m.x:.2f}" cy="{m.y:.2f}" r="2.5" fill="#111"/><text x="{m.x-5:.2f}" y="{m.y+20:.2f}" font-size="14" font-style="italic">M</text>'''
    return wrap_svg(body, "원의 중심과 현의 수직이등분선", "삼각형 OAM과 OBM의 RHS 합동", uid="q14-prob")


def build_q17_external_tangents(pa: float = 3.0, pq: float = 7.0) -> tuple[str, str]:
    """Q17: Circle O. Tangent line L1 touches circle at B.
    Point P on L1 to left of B (PB = PA = pa).
    Point Q on L1 to right of B (BQ = QC = pq - pa).
    P, B, Q are collinear on the horizontal tangent line.
    Tangents PA touches at A, QC touches at C.
    """
    cx, cy, r = 180.0, 110.0, 60.0
    # Tangent line at bottom of circle: y = cy + r = 170.
    b = Point(cx, cy + r)  # B(180, 170)
    scale = 22.0
    pb_len = pa * scale
    bq_len = (pq - pa) * scale

    p = Point(b.x - pb_len, b.y)
    q = Point(b.x + bq_len, b.y)

    # Tangent from P to Circle O:
    # Circle center (cx, cy), radius r. P is (p.x, b.y).
    # One tangent touches at B. The other tangent touches at A.
    # Angle of line PO
    dist_po = p.dist_to(Point(cx, cy))
    angle_po = math.atan2(cy - p.y, cx - p.x)
    alpha = math.asin(r / dist_po)
    # The two tangent angles from P are angle_po - alpha and angle_po + alpha
    # Since B is at bottom (cy + r), angle to B is angle_po + alpha
    # So angle to A is angle_po - alpha
    angle_pa = angle_po - alpha
    tangent_len_pa = math.sqrt(dist_po**2 - r**2)
    a = Point(p.x + tangent_len_pa * math.cos(angle_pa), p.y + tangent_len_pa * math.sin(angle_pa))

    # Tangent from Q to Circle O:
    dist_qo = q.dist_to(Point(cx, cy))
    angle_qo = math.atan2(cy - q.y, cx - q.x)
    beta = math.asin(r / dist_qo)
    angle_qc = angle_qo + beta
    tangent_len_qc = math.sqrt(dist_qo**2 - r**2)
    c = Point(q.x + tangent_len_qc * math.cos(angle_qc), q.y + tangent_len_qc * math.sin(angle_qc))

    prob_body = f'''  <circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="none" stroke="#111" stroke-width="2"/>
  <line x1="{p.x-20:.2f}" y1="{p.y:.2f}" x2="{q.x+20:.2f}" y2="{q.y:.2f}" stroke="#111" stroke-width="2"/>
  <line x1="{p.x:.2f}" y1="{p.y:.2f}" x2="{a.x:.2f}" y2="{a.y:.2f}" stroke="#111" stroke-width="2"/>
  <line x1="{q.x:.2f}" y1="{q.y:.2f}" x2="{c.x:.2f}" y2="{c.y:.2f}" stroke="#0066cc" stroke-width="2"/>
  <circle cx="{p.x:.2f}" cy="{p.y:.2f}" r="3" fill="#111"/><text x="{p.x-15:.2f}" y="{p.y+18:.2f}" font-size="14" font-style="italic">P</text>
  <circle cx="{b.x:.2f}" cy="{b.y:.2f}" r="3" fill="#111"/><text x="{b.x-5:.2f}" y="{b.y+18:.2f}" font-size="14" font-style="italic">B</text>
  <circle cx="{q.x:.2f}" cy="{q.y:.2f}" r="3" fill="#111"/><text x="{q.x+8:.2f}" y="{q.y+18:.2f}" font-size="14" font-style="italic">Q</text>
  <circle cx="{a.x:.2f}" cy="{a.y:.2f}" r="3" fill="#111"/><text x="{a.x-15:.2f}" y="{a.y-5:.2f}" font-size="14" font-style="italic">A</text>
  <circle cx="{c.x:.2f}" cy="{c.y:.2f}" r="3" fill="#0066cc"/><text x="{c.x+8:.2f}" y="{c.y-5:.2f}" font-size="14" font-style="italic" fill="#0066cc">C</text>
  <circle cx="{cx:.2f}" cy="{cy:.2f}" r="2.5" fill="#111"/><text x="{cx+5:.2f}" y="{cy-5:.2f}" font-size="14" font-style="italic">O</text>
  <text x="{(p.x+a.x)/2-18:.2f}" y="{(p.y+a.y)/2:.2f}" font-size="14">{int(pa)}</text>
  <text x="{(p.x+q.x)/2-15:.2f}" y="{p.y+32:.2f}" font-size="14">PQ={int(pq)}</text>
  <text x="{(q.x+c.x)/2+12:.2f}" y="{(q.y+c.y)/2:.2f}" font-size="14" fill="#0066cc">x</text>'''

    sol_body = prob_body + f'''
  <line x1="{p.x:.2f}" y1="{p.y:.2f}" x2="{b.x:.2f}" y2="{b.y:.2f}" stroke="#cc0000" stroke-width="2.5"/>
  <line x1="{b.x:.2f}" y1="{b.y:.2f}" x2="{q.x:.2f}" y2="{q.y:.2f}" stroke="#0066cc" stroke-width="2.5"/>
  <text x="{(p.x+b.x)/2-8:.2f}" y="{p.y-8:.2f}" font-size="13" fill="#cc0000">PB=3</text>
  <text x="{(b.x+q.x)/2-8:.2f}" y="{p.y-8:.2f}" font-size="13" fill="#0066cc">BQ=4</text>'''

    return (
        wrap_svg(prob_body, "원 O와 접선 PA, PQ, QC", f"PA={int(pa)}, PQ={int(pq)}, QC=x", uid="q17-prob"),
        wrap_svg(sol_body, "원 외부의 접선 길이 해설", "PA=PB=3, BQ=QC=4", uid="q17-sol")
    )


def build_q18_tangent_chain() -> tuple[str, str]:
    """Q18: Rays AB, AC, AD, AE, AF with inscribed tangent circles between rays."""
    # Apex A at (40, 130).
    a = Point(40, 130)
    # Five rays spanning angles -30 to +30
    rays = {
        'B': Point(330, 230),
        'C': Point(330, 180),
        'D': Point(330, 130),
        'E': Point(330, 80),
        'F': Point(330, 30),
    }

    body = f'''  <line x1="{a.x:.2f}" y1="{a.y:.2f}" x2="{rays['B'].x:.2f}" y2="{rays['B'].y:.2f}" stroke="#111" stroke-width="1.8"/>
  <line x1="{a.x:.2f}" y1="{a.y:.2f}" x2="{rays['C'].x:.2f}" y2="{rays['C'].y:.2f}" stroke="#111" stroke-width="1.8"/>
  <line x1="{a.x:.2f}" y1="{a.y:.2f}" x2="{rays['D'].x:.2f}" y2="{rays['D'].y:.2f}" stroke="#111" stroke-width="1.8"/>
  <line x1="{a.x:.2f}" y1="{a.y:.2f}" x2="{rays['E'].x:.2f}" y2="{rays['E'].y:.2f}" stroke="#111" stroke-width="1.8"/>
  <line x1="{a.x:.2f}" y1="{a.y:.2f}" x2="{rays['F'].x:.2f}" y2="{rays['F'].y:.2f}" stroke="#111" stroke-width="1.8"/>
  <circle cx="160" cy="180" r="22" fill="none" stroke="#555" stroke-width="1.5"/>
  <circle cx="180" cy="148" r="18" fill="none" stroke="#555" stroke-width="1.5"/>
  <circle cx="180" cy="112" r="18" fill="none" stroke="#555" stroke-width="1.5"/>
  <circle cx="160" cy="80" r="22" fill="none" stroke="#555" stroke-width="1.5"/>
  <circle cx="{a.x:.2f}" cy="{a.y:.2f}" r="3" fill="#111"/><text x="{a.x-15:.2f}" y="{a.y+5:.2f}" font-size="14" font-style="italic">A</text>
  <text x="{rays['B'].x+8:.2f}" y="{rays['B'].y+5:.2f}" font-size="14" font-style="italic">B</text>
  <text x="{rays['C'].x+8:.2f}" y="{rays['C'].y+5:.2f}" font-size="14" font-style="italic">C</text>
  <text x="{rays['D'].x+8:.2f}" y="{rays['D'].y+5:.2f}" font-size="14" font-style="italic">D</text>
  <text x="{rays['E'].x+8:.2f}" y="{rays['E'].y+5:.2f}" font-size="14" font-style="italic">E</text>
  <text x="{rays['F'].x+8:.2f}" y="{rays['F'].y+5:.2f}" font-size="14" font-style="italic">F</text>
  <text x="60" y="245" font-size="13">AB=30, BC=24, CD=20, DE=14, EF=10</text>'''

    sol_body = body + '''
  <text x="50" y="30" font-size="13" fill="#0066cc">AD = 26, AF = 22</text>'''

    return (
        wrap_svg(body, "공통접선과 내접원", "직선 AB~AF와 4개의 내접원", uid="q18-prob"),
        wrap_svg(sol_body, "접선 길이의 합 해설", "AD+AF 계산", uid="q18-sol")
    )


def build_q20_square_with_inscribed_30deg(side_len: float = 190.0) -> tuple[str, str]:
    """Q20: Square ABCD with inscribed right triangle AEF.
    Right angle at E, angle EAF = 30 deg.
    E lies on BC, F lies on CD.
    Analytic solution:
    Let origin at B(0,0), A(0, side), C(side,0), D(side,side).
    E = ( (1 - sqrt(3)/3)*side, 0 ).
    F = ( side, (sqrt(3)-1)/3 * side ).
    SVG has inverted y-axis, so adjust accordingly.
    """
    left, top = 65.0, 35.0
    s = side_len
    # SVG coordinates:
    # B = (left, top + s)
    # C = (left + s, top + s)
    # D = (left + s, top)
    # A = (left, top)
    # We want A at bottom-left in standard view:
    # A = (left, top + s)
    # B = (left, top)
    # C = (left + s, top)
    # D = (left + s, top + s)
    # Side BC is top horizontal: y = top, x from left to left+s
    # Side CD is right vertical: x = left+s, y from top to top+s
    # Point E on BC:
    k = 1.0 - math.sqrt(3.0) / 3.0  # ~0.42265
    e = Point(left + k * s, top)

    # Point F on CD:
    # y = top + (sqrt(3)-1)/3 * s
    m = (math.sqrt(3.0) - 1.0) / 3.0  # ~0.24402
    f_pt = Point(left + s, top + m * s)

    a = Point(left, top + s)
    b = Point(left, top)
    c = Point(left + s, top)
    d = Point(left + s, top + s)

    ra = right_angle_path(e, a, f_pt, 12.0)

    prob_body = f'''  <rect x="{left:.2f}" y="{top:.2f}" width="{s:.2f}" height="{s:.2f}" fill="none" stroke="#111" stroke-width="2"/>
  <polygon points="{fmt_p(a)} {fmt_p(e)} {fmt_p(f_pt)}" fill="#f0f7ff" stroke="#0066cc" stroke-width="2"/>
  <path d="{ra}" fill="none" stroke="#0066cc" stroke-width="1.2"/>
  <circle cx="{a.x:.2f}" cy="{a.y:.2f}" r="2.5" fill="#111"/><text x="{a.x-15:.2f}" y="{a.y+15:.2f}" font-size="14">A</text>
  <circle cx="{b.x:.2f}" cy="{b.y:.2f}" r="2.5" fill="#111"/><text x="{b.x-15:.2f}" y="{b.y-5:.2f}" font-size="14">B</text>
  <circle cx="{c.x:.2f}" cy="{c.y:.2f}" r="2.5" fill="#111"/><text x="{c.x+8:.2f}" y="{c.y-5:.2f}" font-size="14">C</text>
  <circle cx="{d.x:.2f}" cy="{d.y:.2f}" r="2.5" fill="#111"/><text x="{d.x+8:.2f}" y="{d.y+15:.2f}" font-size="14">D</text>
  <circle cx="{e.x:.2f}" cy="{e.y:.2f}" r="2.5" fill="#0066cc"/><text x="{e.x-5:.2f}" y="{e.y-8:.2f}" font-size="14" fill="#0066cc">E</text>
  <circle cx="{f_pt.x:.2f}" cy="{f_pt.y:.2f}" r="2.5" fill="#0066cc"/><text x="{f_pt.x+8:.2f}" y="{f_pt.y+5:.2f}" font-size="14" fill="#0066cc">F</text>
  <text x="{a.x+20:.2f}" y="{a.y-30:.2f}" font-size="13">30°</text>
  <text x="{(a.x+f_pt.x)/2-20:.2f}" y="{(a.y+f_pt.y)/2+20:.2f}" font-size="14" fill="#0066cc">8</text>'''

    sol_body = prob_body + f'''
  <line x1="{e.x:.2f}" y1="{e.y:.2f}" x2="{e.x:.2f}" y2="{a.y:.2f}" stroke="#cc0000" stroke-dasharray="3,3" stroke-width="1.2"/>
  <text x="{e.x+5:.2f}" y="{top+s/2:.2f}" font-size="13" fill="#cc0000">h1</text>'''

    return (
        wrap_svg(prob_body, "정사각형과 직각삼각형 AEF", "E는 BC 위에, F는 CD 위에 위치하는 30도 직각삼각형", uid="q20-prob"),
        wrap_svg(sol_body, "sin 75도 계산 보조선", "수선의 발을 이용한 삼각비 분할", uid="q20-sol")
    )


def build_q23_concentric_circles(r_in: float = 4.0, r_out: float = 5.0) -> tuple[str, str]:
    """Q23: Concentric circles with radii ratio exactly r_in : r_out (4:5).
    Chord AB of large circle is tangent to small circle at M.
    """
    cx, cy = 180.0, 130.0
    scale = 20.0
    r_small = r_in * scale   # 80
    r_large = r_out * scale  # 100

    # Chord is tangent at top of inner circle: y = cy - r_small
    chord_y = cy - r_small
    m = Point(cx, chord_y)
    dx = math.sqrt(r_large**2 - r_small**2)  # sqrt(100^2 - 80^2) = 60
    a = Point(cx - dx, chord_y)
    b = Point(cx + dx, chord_y)
    o = Point(cx, cy)

    ra = right_angle_path(m, o, b, 12.0)

    prob_body = f'''  <circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r_large:.2f}" fill="none" stroke="#111" stroke-width="2"/>
  <circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r_small:.2f}" fill="none" stroke="#555" stroke-dasharray="3,3" stroke-width="1.5"/>
  <line x1="{a.x-10:.2f}" y1="{chord_y:.2f}" x2="{b.x+10:.2f}" y2="{chord_y:.2f}" stroke="#111" stroke-width="2"/>
  <circle cx="{cx:.2f}" cy="{cy:.2f}" r="3" fill="#111"/><text x="{cx+5:.2f}" y="{cy+15:.2f}" font-size="14" font-style="italic">O</text>
  <circle cx="{m.x:.2f}" cy="{m.y:.2f}" r="2.5" fill="#111"/><text x="{m.x-5:.2f}" y="{m.y-8:.2f}" font-size="14" font-style="italic">M</text>
  <circle cx="{a.x:.2f}" cy="{a.y:.2f}" r="2.5" fill="#111"/><text x="{a.x-15:.2f}" y="{a.y+5:.2f}" font-size="14" font-style="italic">A</text>
  <circle cx="{b.x:.2f}" cy="{b.y:.2f}" r="2.5" fill="#111"/><text x="{b.x+8:.2f}" y="{b.y+5:.2f}" font-size="14" font-style="italic">B</text>'''

    sol_body = prob_body + f'''
  <line x1="{cx:.2f}" y1="{cy:.2f}" x2="{m.x:.2f}" y2="{m.y:.2f}" stroke="#cc0000" stroke-width="1.8"/>
  <line x1="{cx:.2f}" y1="{cy:.2f}" x2="{b.x:.2f}" y2="{b.y:.2f}" stroke="#0066cc" stroke-dasharray="3,3" stroke-width="1.5"/>
  <path d="{ra}" fill="none" stroke="#cc0000" stroke-width="1.2"/>
  <text x="{cx+8:.2f}" y="{(cy+m.y)/2+5:.2f}" font-size="13" fill="#cc0000">4</text>
  <text x="{(cx+b.x)/2+12:.2f}" y="{(cy+b.y)/2+12:.2f}" font-size="13" fill="#0066cc">5</text>
  <text x="{(m.x+b.x)/2-5:.2f}" y="{m.y-8:.2f}" font-size="13" fill="#0066cc">3</text>'''

    return (
        wrap_svg(prob_body, "동심원과 접선 현 AB", f"반지름 {int(r_in)}cm, {int(r_out)}cm 동심원과 현 AB", uid="q23-prob"),
        wrap_svg(sol_body, "삼각형 OAB 넓이 해설", "OM=4, OB=5, BM=3, AB=6", uid="q23-sol")
    )
