from __future__ import annotations

import hashlib
import html
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT23 = ROOT / "archive/assets/images/23_조대부고_2학기_중간_고2_수학II"
OUT24 = ROOT / "archive/assets/images/24_조대부고_2학기_중간_고2_수학II"
EVIDENCE = Path(__file__).resolve().parent

TEXT_FONT = '"Noto Sans KR", "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif'
MATH_FONT = '"STIX Two Math", "Cambria Math", "Times New Roman", serif'


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def fact_hash(facts: dict) -> str:
    raw = json.dumps(facts, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def xy(x: float, y: float, ox: float, oy: float, sx: float, sy: float) -> tuple[float, float]:
    return ox + sx * x, oy - sy * y


def fmt(v: float) -> str:
    if abs(v) < 1e-10:
        v = 0.0
    return f"{v:.6f}".rstrip("0").rstrip(".")


def id_num(v) -> str:
    return str(v).replace("-", "m").replace(".", "p").replace("√", "r").replace("/", "d")


def sample(fn, a: float, b: float, n: int, ox, oy, sx, sy):
    pts = []
    for i in range(n + 1):
        x = a + (b - a) * i / n
        y = fn(x)
        px, py = xy(x, y, ox, oy, sx, sy)
        pts.append(f"{fmt(px)},{fmt(py)}")
    return " ".join(pts)


def text(x, y, s, cls="annotation", anchor="start"):
    return f'<text x="{fmt(x)}" y="{fmt(y)}" class="{cls}" text-anchor="{anchor}">{esc(s)}</text>'


def circle(x, y, ox, oy, sx, sy, label=None, open_=False, cls="point", r=3):
    px, py = xy(x, y, ox, oy, sx, sy)
    element_id = f"point-o{id_num(ox)}-x{id_num(x)}-y{id_num(y)}"
    attrs = f'id="{element_id}" cx="{fmt(px)}" cy="{fmt(py)}" r="{r}" data-point-x="{esc(str(x))}" data-point-y="{esc(str(y))}"'
    if open_:
        body = f'<circle {attrs} class="point open"/>'
    else:
        body = f'<circle {attrs} class="{cls}"/>'
    if label:
        body += text(px + 7, py - 7, label, "point-label")
    return body


def line_math(x1, y1, x2, y2, ox, oy, sx, sy, cls="main-line", extra=""):
    a, b = xy(x1, y1, ox, oy, sx, sy)
    c, d = xy(x2, y2, ox, oy, sx, sy)
    element_id = f"line-{cls}-o{id_num(ox)}-x1{id_num(x1)}-y1{id_num(y1)}-x2{id_num(x2)}-y2{id_num(y2)}"
    return f'<line id="{element_id}" x1="{fmt(a)}" y1="{fmt(b)}" x2="{fmt(c)}" y2="{fmt(d)}" class="{cls}" data-math-x1="{esc(str(x1))}" data-math-y1="{esc(str(y1))}" data-math-x2="{esc(str(x2))}" data-math-y2="{esc(str(y2))}" {extra}/>'


def axis(ox, oy, sx, sy, width, height, ticks=()):
    # Axes remain inside the 32 px safe margin and use one affine map throughout.
    out = [
        f'<line x1="32" y1="{fmt(oy)}" x2="{fmt(width-32)}" y2="{fmt(oy)}" class="axis"/>',
        f'<line x1="{fmt(ox)}" y1="{fmt(height-32)}" x2="{fmt(ox)}" y2="32" class="axis"/>',
    ]
    for t in ticks:
        px, py = xy(t, 0, ox, oy, sx, sy)
        if 32 <= px <= width - 32:
            out.append(f'<line x1="{fmt(px)}" y1="{fmt(oy-4)}" x2="{fmt(px)}" y2="{fmt(oy+4)}" class="tick"/>')
            out.append(text(px, oy + 20, str(t).replace("-", "−"), "tick-label", "middle"))
    out += [text(width - 26, oy - 8, "x", "axis-label"), text(ox + 9, 27, "y", "axis-label")]
    return "\n".join(out)


def root(width, height, ox, oy, sx, sy, scale_mode, facts, geometry=False):
    fh = fact_hash(facts)
    attrs = [
        'xmlns="http://www.w3.org/2000/svg"', f'width="{width}"', f'height="{height}"',
        f'viewBox="0 0 {width} {height}"', 'preserveAspectRatio="xMidYMid meet"',
        'role="img" aria-labelledby="title desc"', 'shape-rendering="geometricPrecision"',
        'data-graph-style-version="AP_GRAPH_PRINT_V1_1_DRAFT"', 'data-graph-preset="SOLUTION_WIDE"',
        f'data-axis-scale-mode="{scale_mode}"', f'data-origin-x="{fmt(ox)}"', f'data-origin-y="{fmt(oy)}"',
        f'data-sx="{fmt(sx)}"', f'data-sy="{fmt(sy)}"', f'data-fact-hash="{fh}"',
        'data-visual-provenance="independent-math-facts-to-deterministic-sampling"',
    ]
    if geometry:
        attrs += ['data-geometry-mode="COORDINATE_GEOMETRY_HYBRID"',
                  'data-geometry-style-version="AP_GEOMETRY_PRINT_V1_0_DRAFT"',
                  'data-geometry-preset="GEOMETRY_STANDARD"', f'data-geometry-fact-hash="{fh}"']
    return "<svg " + " ".join(attrs) + ">"


def defs():
    return '''<defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#111"/></marker></defs>'''


def styles():
    return f'''<style>
      .axis{{stroke:#111;stroke-width:1.4;fill:none;marker-end:url(#arrow)}}
      .tick{{stroke:#111;stroke-width:1}}
      .main-curve{{stroke:#333;stroke-width:2.1;fill:none;stroke-linecap:round;stroke-linejoin:round}}
      .secondary-curve{{stroke:#555;stroke-width:1.7;fill:none;stroke-linecap:round;stroke-linejoin:round}}
      .main-line{{stroke:#333;stroke-width:2.05;fill:none;stroke-linecap:round}}
      .tangent{{stroke:#b21f2d;stroke-width:2.1;fill:none;stroke-linecap:round}}
      .guide{{stroke:#777;stroke-width:0.95;stroke-dasharray:4 4;fill:none}}
      .indicator{{stroke:#1b6ca8;stroke-width:0.8;fill:none}}
      .point{{fill:#1b6ca8;stroke:#111;stroke-width:1}}
      .point.open{{fill:#fff;stroke:#b21f2d;stroke-width:1.3}}
      text{{font-family:{TEXT_FONT};fill:#111;font-size:13px}}
      .axis-label{{font-family:{MATH_FONT};font-size:13px;font-style:italic}}
      .tick-label{{font-size:11.5px}}
      .point-label,.function-label{{font-family:{MATH_FONT};font-size:13.5px;font-style:italic}}
      .annotation{{font-size:12px}}
      .fact{{fill:#1b6ca8;font-size:12px}}
      .warn{{fill:#b21f2d;font-size:12px}}
    </style>'''


def finish(title, desc, body, width, height, ox, oy, sx, sy, mode, facts, geometry=False, add_anchors=True):
    anchor_group = f'<g id="coordinate-anchors" class="coordinate-anchors"><circle id="anchor-origin-o{id_num(ox)}" cx="{fmt(ox)}" cy="{fmt(oy)}" r="1" class="anchor"/><circle id="anchor-xaxis-o{id_num(ox)}" cx="{fmt(ox+sx)}" cy="{fmt(oy)}" r="1" class="anchor"/><circle id="anchor-yaxis-o{id_num(ox)}" cx="{fmt(ox)}" cy="{fmt(oy-sy)}" r="1" class="anchor"/></g>' if add_anchors else ''
    return (root(width, height, ox, oy, sx, sy, mode, facts, geometry) + defs() + styles() +
            f'<title id="title">{esc(title)}</title><desc id="desc">{esc(desc)}</desc>' +
            f'<rect width="{width}" height="{height}" fill="white"/>{body}{anchor_group}</svg>\n')


def write(path: Path, svg: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(svg, encoding="utf-8", newline="\n")


FACTS = {}


def make_23_q01():
    ox, oy, sx, sy = 300, 260, 70, 60
    facts = {"x→−2+": 1, "x→0−": 1, "x→−1": 0, "open": [[-2, 1], [0, 1]], "closed": [[-2, 0], [-1, 0]]}
    body = '<g id="axes">' + axis(ox, oy, sx, sy, 640, 360, (-2, -1, 0)) + '</g>'
    body += '<g id="curves">'
    body += f'<polyline class="main-curve" points="{sample(lambda x: -(x+2), -3.6, -2, 220, ox, oy, sx, sy)}"/>'
    body += f'<polyline class="main-curve" points="{sample(lambda x: -x-1, -2, -1, 220, ox, oy, sx, sy)}"/>'
    body += f'<polyline class="main-curve" points="{sample(lambda x: x+1, -1, 0, 220, ox, oy, sx, sy)}"/>'
    body += '</g><g id="points">' + circle(-2, 1, ox, oy, sx, sy, "(-2,1)", True) + circle(-2, 0, ox, oy, sx, sy, "(-2,0)") + circle(-1, 0, ox, oy, sx, sy, "(-1,0)") + circle(0, 1, ox, oy, sx, sy, "(0,1)", True) + '</g>'
    body += '<g id="labels">' + text(340, 75, "y=f(x)", "function-label") + text(55, 340, "x→−2+ : 1", "fact") + text(210, 340, "x→0− : 1", "fact") + text(390, 340, "x→−1 : 0", "fact") + '</g>'
    FACTS["2023-q01"] = {"originX": ox, "originY": oy, "sx": sx, "sy": sy, **facts}
    return finish("2023 조대부고 1번 극한 해설 그래프", "원본 그래프에서 필요한 세 극한을 같은 x축척으로 표시", body, 640, 360, ox, oy, sx, sy, "UNEQUAL_UNIT_DECLARED", facts)


def make_23_q11():
    ox, oy, sx, sy = 320, 240, 35, 35
    facts = {"curve": "y=x³−x+2", "external": [-1, -2], "tangentPoint": [1, 2], "tangent": "y=2x", "slope": 2}
    body = '<g id="axes">' + axis(ox, oy, sx, sy, 640, 400, (-1, 0, 1)) + '</g><g id="curves">'
    body += f'<polyline class="main-curve" points="{sample(lambda x: x**3-x+2, -1.65, 1.55, 320, ox, oy, sx, sy)}"/>'
    body += line_math(-1.8, -3.6, 1.8, 3.6, ox, oy, sx, sy, "tangent")
    body += '</g><g id="points">' + circle(-1, -2, ox, oy, sx, sy, "(−1,−2)", False, "point", 3) + circle(1, 2, ox, oy, sx, sy, "(1,2)", False, "point", 3) + '</g>'
    body += '<g id="labels">' + text(405, 62, "y=x³−x+2", "function-label") + text(440, 145, "접선 y=2x", "warn") + text(60, 370, "x=1에서 곡선의 기울기 2", "fact") + text(365, 370, "k=1", "fact") + '</g>'
    FACTS["2023-q11"] = {"originX": ox, "originY": oy, "sx": sx, "sy": sy, **facts}
    return finish("2023 조대부고 11번 접선 해설", "곡선 y=x³−x+2와 외부점을 지나는 유일한 접선", body, 640, 400, ox, oy, sx, sy, "EQUAL_UNIT", facts, True)


def make_23_q16():
    ox, oy, sx, sy = 180, 240, 110, 90
    facts = {"h-left-at-0": 0, "h-right-at-0": 0, "leftDerivativeAt0": 0, "rightDerivativeAt0": 1, "leftAt1": 0, "rightAt1": 1, "h1": 0}
    body = '<g id="axes">' + axis(ox, oy, sx, sy, 640, 380, (0, 1, 2)) + '</g><g id="curves">'
    body += f'<polyline class="main-curve" points="{sample(lambda x: -x*x, -1.0, 0, 220, ox, oy, sx, sy)}"/>'
    body += f'<polyline class="main-curve" points="{sample(lambda x: -x*x+x, 0, 1, 220, ox, oy, sx, sy)}"/>'
    body += f'<polyline class="main-curve" points="{sample(lambda x: x*x, 1, 1.4, 260, ox, oy, sx, sy)}"/>'
    body += line_math(-0.45, 0, 0.45, 0, ox, oy, sx, sy, "indicator") + line_math(0.0, 0, 0.45, 0.45, ox, oy, sx, sy, "indicator")
    body += '</g><g id="points">' + circle(0, 0, ox, oy, sx, sy, "") + circle(1, 0, ox, oy, sx, sy, "h(1)=0") + circle(1, 1, ox, oy, sx, sy, "1", True) + '</g>'
    body += '<g id="labels">' + text(360, 60, "h(x)", "function-label") + text(38, 330, "x→0− h=0,  h′₋(0)=0", "fact") + text(245, 330, "x→0+ h=0,  h′₊(0)=1", "fact") + text(425, 350, "x→1− h=0,  x→1+ h=1", "fact") + text(455, 370, "h(1)=0", "fact") + '</g>'
    FACTS["2023-q16"] = {"originX": ox, "originY": oy, "sx": sx, "sy": sy, **facts}
    return finish("2023 조대부고 16번 곱함수 해설", "h=f·g의 좌우 극한과 한쪽 미분계수를 직접 표시", body, 640, 380, ox, oy, sx, sy, "UNEQUAL_UNIT_DECLARED", facts)


def make_23_q23():
    ox, oy, sx, sy = 100, 350, 100, 100
    rt3 = math.sqrt(3)
    facts = {"A": [1, "√3"], "B": [2, 0], "C": ["3/2", "√3/2"], "D": [2, "2/√3"], "ABSlope": "−√3", "CDSlope": "1/√3", "CD": "1/√3"}
    A = xy(1, rt3, ox, oy, sx, sy); B = xy(2, 0, ox, oy, sx, sy); C = xy(1.5, rt3/2, ox, oy, sx, sy); D = xy(2, 2/rt3, ox, oy, sx, sy)
    body = '<g id="axes">' + axis(ox, oy, sx, sy, 640, 420, (1, 2)) + '</g><g id="guides">' + line_math(2, -0.2, 2, 3.1, ox, oy, sx, sy, "guide") + '</g><g id="geometry">'
    body += line_math(0, 0, 1, rt3, ox, oy, sx, sy, "secondary-curve") + line_math(1, rt3, 2, 0, ox, oy, sx, sy, "main-line") + line_math(1.5, rt3/2, 2, 0, ox, oy, sx, sy, "main-line") + line_math(1.5, rt3/2, 2, 2/rt3, ox, oy, sx, sy, "main-line")
    body += '</g><g id="points">' + circle(1, rt3, ox, oy, sx, sy, "A") + circle(2, 0, ox, oy, sx, sy, "B") + circle(1.5, rt3/2, ox, oy, sx, sy, "C") + circle(2, 2/rt3, ox, oy, sx, sy, "D") + '</g>'
    body += '<g id="labels">' + text(145, 95, "A=(t,√3t)", "point-label") + text(310, 365, "B=(2t,0)", "point-label") + text(155, 292, "C=(3t/2,√3t/2)", "point-label") + text(320, 215, "D=(2t,2t/√3)", "point-label") + text(385, 120, "AB ⟂ CD", "fact") + text(385, 145, "ΔxCD=t/2,  ΔyCD=t/(2√3)", "fact") + text(385, 175, "|CD|=t/√3", "fact") + '</g>'
    FACTS["2023-q23"] = {"originX": ox, "originY": oy, "sx": sx, "sy": sy, **facts}
    return finish("2023 조대부고 23번 좌표기하 해설", "A와 B의 중점 C, AB에 수직인 CD를 등축척으로 표시", body, 640, 420, ox, oy, sx, sy, "EQUAL_UNIT", facts, True)


def make_24_q01():
    ox1, ox2, oy, sx, sy = 140, 460, 210, 45, 35
    facts = {"x→3− f": 0, "x→3− g": -2, "ratio": 0, "gRightAt3": 2}
    body = '<g id="axes">' + axis(ox1, oy, sx, sy, 640, 360, (3,)) + axis(ox2, oy, sx, sy, 640, 360, (3,)) + '</g><g id="curves">'
    body += f'<polyline class="main-curve" points="{sample(lambda x: 0.02*(x-3)**3, -2.0, 3.0, 300, ox1, oy, sx, sy)}"/>'
    body += line_math(-2, -2, 3, -2, ox2, oy, sx, sy, "main-line") + line_math(3, 2, 3.2, 2, ox2, oy, sx, sy, "main-line")
    body += '</g><g id="points">' + circle(3, 0, ox1, oy, sx, sy, "3−", True) + circle(3, -2, ox2, oy, sx, sy, "3−", True) + circle(3, 2, ox2, oy, sx, sy, "3", False) + '</g>'
    body += '<g id="labels">' + text(78, 55, "y=f(x)", "function-label") + text(425, 55, "y=g(x)", "function-label") + text(55, 330, "f→0", "fact") + text(370, 330, "g→−2", "fact") + text(505, 330, "0/(−2)=0", "fact") + '</g>'
    FACTS["2024-q01"] = {"originX": [ox1, ox2], "originY": oy, "sx": sx, "sy": sy, **facts}
    return finish("2024 조대부고 1번 좌극한 해설", "x=3의 왼쪽에서 f는 0, g는 −2로 접근", body, 640, 360, ox1, oy, sx, sy, "UNEQUAL_UNIT_DECLARED", facts).replace('data-origin-x="140"', 'data-origin-x="140" data-origin-x-2="460" data-origin-y-2="210" data-sx-2="45" data-sy-2="35" data-panel-origin-x="140,460"')


def make_24_q05():
    ox, oy, sx, sy = 220, 250, 55, 25
    facts = {"leftLimitAt0": 6, "valueAt0": -2, "rightLimitAt0": -2, "equation": "(6−a)²=(−2−a)²", "a": 2}
    body = '<g id="axes">' + axis(ox, oy, sx, sy, 640, 360, (0,)) + '</g><g id="curves">'
    body += f'<polyline class="main-curve" points="{sample(lambda x: 6-1.2*x*x, -2.3, 0, 300, ox, oy, sx, sy)}"/>'
    body += line_math(0, -2, 5.0, 3, ox, oy, sx, sy, "main-line")
    body += '</g><g id="points">' + circle(0, 6, ox, oy, sx, sy, "6", True) + circle(0, -2, ox, oy, sx, sy, "−2") + '</g><g id="labels">' + text(410, 65, "y=f(x)", "function-label") + text(50, 330, "(6−a)²=(−2−a)²", "fact") + text(410, 330, "a=2", "fact") + '</g>'
    FACTS["2024-q05"] = {"originX": ox, "originY": oy, "sx": sx, "sy": sy, **facts}
    return finish("2024 조대부고 5번 연속 해설", "0에서 y=6과 y=−2를 같은 y축척으로 비교", body, 640, 360, ox, oy, sx, sy, "UNEQUAL_UNIT_DECLARED", facts)


def make_24_q07():
    ox1, ox2, oy, sx, sy = 140, 460, 220, 45, 45
    facts = {"fAt1Left": 1, "fAt1Right": -1, "gAt1Left": -1, "gAt1Right": 1, "fAtMinus1": 1, "fMinus1Right": -1, "gAtMinus1": -1}
    body = '<g id="axes">' + axis(ox1, oy, sx, sy, 640, 360, (-1, 1)) + axis(ox2, oy, sx, sy, 640, 360, (-1, 1)) + '</g><g id="curves">'
    body += line_math(-2, 1, 1, 1, ox1, oy, sx, sy, "main-line") + line_math(-1, -1, 1, 1, ox1, oy, sx, sy, "main-line") + line_math(1, -1, 3, -1, ox1, oy, sx, sy, "main-line")
    body += f'<polyline class="main-curve" points="{sample(lambda x: 1-2*x*x, -1.2, 1, 260, ox2, oy, sx, sy)}"/>' + line_math(1, 1, 3, 1, ox2, oy, sx, sy, "main-line")
    body += '</g><g id="points">' + circle(1, 1, ox1, oy, sx, sy, "1", True) + circle(1, -1, ox1, oy, sx, sy, "−1") + circle(-1, 1, ox1, oy, sx, sy, "f(−1)") + circle(-1, -1, ox1, oy, sx, sy, "", True) + circle(1, -1, ox2, oy, sx, sy, "", True) + circle(1, 1, ox2, oy, sx, sy, "g(1)") + '</g>'
    body += '<g id="labels">' + text(90, 55, "f(x)", "function-label") + text(420, 55, "g(x)", "function-label") + text(45, 335, "x=1: 1·(−1)=−1", "fact") + text(350, 335, "x=1: (−1)·1=−1", "fact") + text(250, 355, "x=−1에서 f 좌우극한 불일치", "warn") + '</g>'
    FACTS["2024-q07"] = {"originX": [ox1, ox2], "originY": oy, "sx": sx, "sy": sy, **facts}
    return finish("2024 조대부고 7번 그래프 극한 해설", "x=1과 x=−1의 좌우 극한·함숫값을 분리 표시", body, 640, 360, ox1, oy, sx, sy, "EQUAL_UNIT", facts).replace('data-origin-x="140"', 'data-origin-x="140" data-origin-x-2="460" data-origin-y-2="220" data-sx-2="45" data-sy-2="45" data-panel-origin-x="140,460"')


def make_24_q08():
    ox, oy, sx, sy = 250, 300, 45, 45
    facts = {"curve": "y=−x²+x+3", "external": [1, 4], "contacts": [[0, 3], [2, 1]], "tangents": ["y=x+3", "y=−3x+7"], "selectedSlope": -3, "pq": -21}
    body = '<g id="axes">' + axis(ox, oy, sx, sy, 640, 400, (0, 1, 2, 3)) + '</g><g id="curves">'
    body += f'<polyline class="main-curve" points="{sample(lambda x: -x*x+x+3, -1.5, 2.5, 360, ox, oy, sx, sy)}"/>'
    body += line_math(-0.5, 2.5, 2.5, 5.5, ox, oy, sx, sy, "secondary-curve") + line_math(0.5, 5.5, 2.5, -0.5, ox, oy, sx, sy, "tangent")
    body += '</g><g id="points">' + circle(1, 4, ox, oy, sx, sy, "(1,4)") + circle(0, 3, ox, oy, sx, sy, "t=0") + circle(2, 1, ox, oy, sx, sy, "t=2") + '</g><g id="labels">' + text(405, 70, "y=−x²+x+3", "function-label") + text(385, 130, "y=x+3", "annotation") + text(400, 270, "y=−3x+7", "warn") + text(70, 375, "p=−3, q=7  →  pq=−21", "fact") + '</g>'
    FACTS["2024-q08"] = {"originX": ox, "originY": oy, "sx": sx, "sy": sy, **facts}
    return finish("2024 조대부고 8번 포물선 접선 해설", "두 접점과 두 접선을 실제 좌표에 표시하고 음의 기울기를 선택", body, 640, 400, ox, oy, sx, sy, "EQUAL_UNIT", facts, True)


def make_24_q12():
    ox, oy, sx, sy = 260, 260, 45, 45
    r2 = math.sqrt(2)
    roots = [-1, 2-r2, 2+r2, 5]
    facts = {"formula": ["x≤0: 2x+2", "0<x≤4: −1/2(x−2)²+1", "x>4: x−5"], "zeros": ["−1", "2−√2", "2+√2", "5"]}
    body = '<g id="axes">' + axis(ox, oy, sx, sy, 640, 400, (-1, 2, 5)) + '</g><g id="curves">'
    body += f'<polyline class="main-curve" points="{sample(lambda x: 2*x+2, -2.0, 0, 300, ox, oy, sx, sy)}"/>'
    body += f'<polyline class="main-curve" points="{sample(lambda x: -0.5*(x-2)**2+1, 0, 4, 320, ox, oy, sx, sy)}"/>'
    body += f'<polyline class="main-curve" points="{sample(lambda x: x-5, 4.000001, 7, 220, ox, oy, sx, sy)}"/>'
    body += '</g><g id="points">' + ''.join(circle(x, 0, ox, oy, sx, sy, label, False, "point", 2.4) for x, label in zip(roots, ("−1", "2−√2", "2+√2", "5"))) + circle(0, 2, ox, oy, sx, sy, "f(0)") + circle(0, -1, ox, oy, sx, sy, "", True) + '</g>'
    body += '<g id="labels">' + text(365, 65, "y=f(x)", "function-label") + text(48, 370, "영점: −1, 2−√2, 2+√2, 5", "fact") + text(340, 395, "하나의 x축척으로 세 조각을 연결", "fact") + '</g>'
    FACTS["2024-q12"] = {"originX": ox, "originY": oy, "sx": sx, "sy": sy, **facts}
    return finish("2024 조대부고 12번 조각함수 해설", "주어진 세 조각의 정확한 영점을 하나의 x축척으로 표시", body, 640, 400, ox, oy, sx, sy, "EQUAL_UNIT", facts)


def make_24_q15():
    ox, oy, sx, sy = 260, 260, 20, 20
    facts = {"formula": "1/4(x+1)²(x+5)", "point": [-3, 2], "slope": -1, "tangent": "y=−x−1", "external": [-11, 10], "a": 10}
    body = '<g id="axes">' + axis(ox, oy, sx, sy, 640, 400, (-11, -5, -3, -1, 0)) + '</g><g id="curves">'
    body += f'<polyline class="main-curve" points="{sample(lambda x: 0.25*(x+1)**2*(x+5), -5.5, 0.6, 420, ox, oy, sx, sy)}"/>'
    body += line_math(-11, 10, 2, -3, ox, oy, sx, sy, "tangent")
    body += '</g><g id="points">' + circle(-3, 2, ox, oy, sx, sy, "(−3,2)") + circle(-11, 10, ox, oy, sx, sy, "(−11,10)") + '</g><g id="labels">' + text(355, 70, "f(x)=1/4(x+1)²(x+5)", "function-label") + text(390, 165, "y=−x−1", "warn") + text(65, 375, "기울기 −1,  x=−11에서 y=10", "fact") + '</g>'
    FACTS["2024-q15"] = {"originX": ox, "originY": oy, "sx": sx, "sy": sy, **facts}
    return finish("2024 조대부고 15번 삼차함수 접선 해설", "실제 삼차함수와 접선 y=−x−1을 함께 표시", body, 640, 400, ox, oy, sx, sy, "EQUAL_UNIT", facts, True)


def make_24_q16():
    ox, oy, sx, sy = 200, 180, 45, 12
    facts = {"g": "−2t³+3t²", "line": "−12t+20", "join": [2, -4], "leftSlope": -12, "rightSlope": -12, "a": -6, "b": 20}
    body = '<g id="axes">' + axis(ox, oy, sx, sy, 640, 420, (0, 1, 2, 3)) + '</g><g id="curves">'
    body += f'<polyline class="main-curve" points="{sample(lambda t: -2*t**3+3*t**2, -1.0, 2.0, 360, ox, oy, sx, sy)}"/>'
    body += line_math(2, -4, 3.0, -16, ox, oy, sx, sy, "tangent")
    body += '</g><g id="points">' + circle(2, -4, ox, oy, sx, sy, "(2,−4)") + '</g><g id="labels">' + text(365, 55, "g(t)=−2t³+3t²", "function-label") + text(350, 300, "t≥2: −12t+20", "warn") + text(60, 375, "g(2)=−4", "fact") + text(220, 395, "좌우 기울기 −12  →  a=−6, b=20", "fact") + '</g>'
    FACTS["2024-q16"] = {"originX": ox, "originY": oy, "sx": sx, "sy": sy, **facts}
    return finish("2024 조대부고 16번 접선 y절편 함수 해설", "두 조각이 (2,−4)에서 만나고 좌우 기울기가 모두 −12", body, 640, 420, ox, oy, sx, sy, "UNEQUAL_UNIT_DECLARED", facts)


def make_24_q17():
    ox, oy, sx, sy = 250, 250, 55, 35
    facts = {"left": "−(x−1)²+1", "right": "1/3(x−1)²+1", "boundaries": ["2/3", "2"], "counts": {"t<2/3": 1, "t=2/3": 2, "2/3<t<2": 3, "t=2": 2, "t>2": 3}, "a": 3, "b": "8/3", "ab": 8}
    body = '<g id="axes">' + axis(ox, oy, sx, sy, 640, 420, (0, 1, 2, 3)) + '</g><g id="curves">'
    body += f'<polyline class="main-curve" points="{sample(lambda x: -(x-1)**2+1, -1.0, 0.999999, 320, ox, oy, sx, sy)}"/>'
    body += f'<polyline class="main-curve" points="{sample(lambda x: (x-1)**2/3+1, 1, 3.6, 360, ox, oy, sx, sy)}"/>'
    body += line_math(-0.35, -0.7, 1.2, 2.4, ox, oy, sx, sy, "tangent")
    body += line_math(0.0, 0.0, 3.0, 2.0, ox, oy, sx, sy, "tangent")
    body += '</g><g id="points">' + circle(0, 0, ox, oy, sx, sy, "t=2") + circle(2, 4/3, ox, oy, sx, sy, "t=2/3") + circle(1, 1, ox, oy, sx, sy, "", False, "point", 2.4) + '</g><g id="labels">' + text(55, 58, "x<1: −(x−1)²+1", "function-label") + text(390, 58, "x≥1: 1/3(x−1)²+1", "function-label") + text(405, 310, "경계 기울기 t=2/3, 2", "warn") + text(52, 365, "교점 수: 1, 2, 3, 2, 3", "fact") + text(310, 390, "t=1은 구성만 바뀌고 g는 연속", "fact") + text(55, 410, "a=3,  b=8/3  →  ab=8", "fact") + '</g>'
    FACTS["2024-q17"] = {"originX": ox, "originY": oy, "sx": sx, "sy": sy, **facts}
    return finish("2024 조대부고 17번 교점 개수 해설", "두 실제 포물선 조각과 경계 직선의 교점 수를 표시", body, 640, 420, ox, oy, sx, sy, "UNEQUAL_UNIT_DECLARED", facts, True)


def make_24_q18():
    ox, oy, sx, sy = 280, 220, 32, 32
    facts = {"formula": "−|x(x−2)|", "point": [2, 0], "leftBranch": "x²−2x", "rightBranch": "−x²+2x", "leftDerivative": 2, "rightDerivative": -2}
    body = '<g id="axes">' + axis(ox, oy, sx, sy, 640, 500, (-2, 0, 2, 4)) + '</g><g id="curves">'
    body += f'<polyline class="main-curve" points="{sample(lambda x: -x*x+2*x, -1.8, 0, 320, ox, oy, sx, sy)}"/>'
    body += f'<polyline class="main-curve" points="{sample(lambda x: x*x-2*x, 0, 2, 320, ox, oy, sx, sy)}"/>'
    body += f'<polyline class="main-curve" points="{sample(lambda x: -x*x+2*x, 2, 3.8, 360, ox, oy, sx, sy)}"/>'
    body += line_math(1.35, -1.3, 2, 0, ox, oy, sx, sy, "indicator") + line_math(2, 0, 2.65, -1.3, ox, oy, sx, sy, "tangent")
    body += '</g><g id="points">' + circle(2, 0, ox, oy, sx, sy, "(2,0)") + '</g><g id="labels">' + text(420, 70, "y=−|x(x−2)|", "function-label") + text(70, 430, "x<2: x²−2x,  좌미분계수 2", "fact") + text(350, 455, "x>2: −x²+2x,  우미분계수 −2", "warn") + text(205, 485, "모든 주변 값은 x축 아래", "fact") + '</g>'
    FACTS["2024-q18"] = {"originX": ox, "originY": oy, "sx": sx, "sy": sy, **facts}
    return finish("2024 조대부고 18번 절댓값 함수 해설", "x=2에서 두 아래쪽 branch가 만나고 좌우 미분계수가 다름", body, 640, 500, ox, oy, sx, sy, "EQUAL_UNIT", facts)


def make_24_q20():
    # A deterministic, student-facing sign table is required because the prompt
    # explicitly asks students to construct it.  It is a solution visual, not a
    # source problem image.
    ox, oy, sx, sy = 0, 0, 1, 1
    facts = {"criticalPoints": ["−1", "1"], "derivativeSigns": ["+", "0", "−", "0", "+"], "functionValues": ["증가", "1", "감소", "−3", "증가"]}
    W, H = 640, 280
    x0, x1, x2, x3, x4 = 145, 220, 325, 430, 550
    ys = [65, 120, 180]
    body = '<g id="table" class="solution-table">'
    body += f'<rect x="48" y="35" width="544" height="175" fill="white" stroke="#111" stroke-width="1.2"/>'
    body += f'<line x1="48" y1="95" x2="592" y2="95" stroke="#111" stroke-width="1"/><line x1="48" y1="150" x2="592" y2="150" stroke="#111" stroke-width="1"/>'
    body += f'<line x1="120" y1="35" x2="120" y2="210" stroke="#111" stroke-width="1"/>'
    for x in (x1, x2, x3):
        body += f'<line x1="{x}" y1="35" x2="{x}" y2="210" stroke="#777" stroke-width="0.8" stroke-dasharray="4 4"/>'
    body += text(84, 73, "x", "function-label", "middle") + text(84, 128, "f′(x)", "function-label", "middle") + text(84, 183, "f(x)", "function-label", "middle")
    for x, s in zip((x0, x1, x2, x3, x4), ("−∞", "−1", "1", "∞", "")):
        if s: body += text(x, 73, s, "point-label", "middle")
    for x, s in zip((x0, x1, x2, x3, x4), ("+", "0", "−", "0", "+")):
        body += text(x, 128, s, "fact", "middle")
    for x, s in zip((x0, x1, x2, x3, x4), ("증가", "1 (극대)", "감소", "−3 (극소)", "증가")):
        body += text(x, 183, s, "fact", "middle")
    body += '</g><g id="labels">' + text(60, 260, "f′(x)의 부호와 f(x)의 증감을 한 표에 정리", "annotation") + '</g>'
    FACTS["2024-q20"] = {"originX": ox, "originY": oy, "sx": sx, "sy": sy, **facts}
    return finish("2024 조대부고 20번 증감표 해설", "극대와 극소를 확인하는 완성된 증감표", body, W, H, ox, oy, sx, sy, "NOT_APPLICABLE", facts, add_anchors=False)


def main():
    outputs = {
        OUT23 / "q01-solution.svg": make_23_q01(),
        OUT23 / "q11-solution.svg": make_23_q11(),
        OUT23 / "q16-solution.svg": make_23_q16(),
        OUT23 / "q23-solution.svg": make_23_q23(),
        OUT24 / "q01-solution.svg": make_24_q01(),
        OUT24 / "q05-solution.svg": make_24_q05(),
        OUT24 / "q07-solution.svg": make_24_q07(),
        OUT24 / "q08-solution.svg": make_24_q08(),
        OUT24 / "q12-solution.svg": make_24_q12(),
        OUT24 / "q15-solution.svg": make_24_q15(),
        OUT24 / "q16-solution.svg": make_24_q16(),
        OUT24 / "q17-solution.svg": make_24_q17(),
        OUT24 / "q18-solution.svg": make_24_q18(),
        OUT24 / "q20-solution.svg": make_24_q20(),
    }
    for p, s in outputs.items():
        write(p, s)
    evidence = {"generated": sorted(str(p.relative_to(ROOT)).replace("\\", "/") for p in outputs), "facts": FACTS}
    (EVIDENCE / "expected-facts.json").write_text(json.dumps(evidence, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"svgCount": len(outputs), "files": evidence["generated"], "factHashes": {str(p.relative_to(ROOT)).replace("\\", "/"): fact_hash(FACTS[k]) for p, k in zip(outputs, FACTS)}}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
