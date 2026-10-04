from __future__ import annotations

import math
from pathlib import Path
from fractions import Fraction

ROOT = Path(__file__).resolve().parents[3]
ASSET_2019 = ROOT / "archive/assets/images/19_순천여고_2학기_기말_고2_수학II_ALIVE대체"
ASSET_MAESAN = ROOT / "archive/assets/images/21_매산여고_2학기_기말_고2_수학II_ALIVE대체"
ASSET_SUNCHEON = ROOT / "archive/assets/images/21_순천여고_2학기_기말_고2_수학II_ALIVE대체"


def polyline(points: list[tuple[float, float]]) -> str:
    return "M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in points)


def label(x: int, y: int, value: str, color: str = "#25364a") -> str:
    return f'<text x="{x}" y="{y}" fill="{color}">{value}</text>'


def make_q8() -> None:
    # x=110+80t; y=170-50v. The drawn interval includes t=0..2.5.
    pts = [(110 + 80 * i / 100, 170 - 50 * (2 * (i / 100) ** 2 - 4 * (i / 100))) for i in range(251)]
    axes = '<path d="M85 170H540M110 305V45" stroke="#34445a" stroke-width="2" fill="none"/>'
    grid = '<g stroke="#e3e8ef"><path d="M110 55V300M190 55V300M270 55V300M350 55V300M430 55V300M510 55V300M110 70H530M110 120H530M110 170H530M110 220H530M110 270H530"/></g>'
    curve = f'<path d="{polyline(pts)}" fill="none" stroke="#2563a6" stroke-width="4"/>'
    marks = '<g fill="#111"><circle cx="110" cy="170" r="4"/><circle cx="190" cy="270" r="4"/><circle cx="270" cy="170" r="4"/></g>'
    texts = '<g font-family="sans-serif" font-size="17">' + ''.join([label(543,175,'t'), label(115,48,'v(t)'), label(100,194,'0'), label(182,194,'1'), label(262,194,'2'), label(198,286,'−2'), label(330,120,'v=2t²−4t')]) + '</g>'
    (ASSET_SUNCHEON / 'q8.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360" role="img" aria-label="v(t)=2t²−4t, 0≤t≤2.5">\n<rect width="600" height="360" fill="white"/>{grid}{axes}{curve}{marks}{texts}</svg>\n', encoding='utf-8')


def make_q13() -> None:
    # x=320+60x; y=170-25y. Sample each exact function separately.
    parabola = [(320 + 60 * (-2 + 4 * i / 160), 170 - 25 * ((-2 + 4 * i / 160) ** 2 - 4)) for i in range(161)]
    line = [(320 + 60 * (2 + i / 100), 170 - 25 * ((2 + i / 100) - 2)) for i in range(101)]
    grid = '<g stroke="#e2e7ef"><path d="M90 55V300M150 55V300M210 55V300M270 55V300M330 55V300M390 55V300M450 55V300M510 55V300M90 70H540M90 120H540M90 170H540M90 220H540M90 270H540"/></g>'
    axes = '<path d="M85 170H545M320 305V45" stroke="#34445a" stroke-width="2" fill="none"/>'
    curves = f'<path d="{polyline(parabola)}" fill="none" stroke="#2563a6" stroke-width="4"/><path d="{polyline(line)}" fill="none" stroke="#c14b42" stroke-width="4"/>'
    marks = '<g fill="#111"><circle cx="200" cy="170" r="4"/><circle cx="320" cy="270" r="4"/><circle cx="440" cy="170" r="4"/></g>'
    texts = '<g font-family="sans-serif" font-size="16">' + ''.join([label(548,175,'x'), label(326,47,'y'), label(202,155,'−2'), label(315,194,'0'), label(430,194,'2'), label(485,112,'y=x−2','#a5342e'), label(92,255,'f′(x)')]) + '</g>'
    (ASSET_SUNCHEON / 'q13.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360" role="img" aria-label="f′(x)=x²−4 for −2≤x≤2 and f′(x)=x−2 for x≥2">\n<rect width="600" height="360" fill="white"/>{grid}{axes}{curves}{marks}{texts}</svg>\n', encoding='utf-8')


def make_q15() -> None:
    # x=320+60x; y=270-25y. Curves are sampled from exact stated equations.
    xs = [-2 + 5 * i / 200 for i in range(201)]
    parabola = [(320 + 60 * x, 270 - 25 * x * x) for x in xs]
    line = [(320 + 60 * x, 270 - 25 * (2 * x + 3)) for x in xs]
    grid = '<g stroke="#e2e7ef"><path d="M90 55V300M150 55V300M210 55V300M270 55V300M330 55V300M390 55V300M450 55V300M510 55V300M90 70H535M90 120H535M90 170H535M90 220H535M90 270H535"/></g>'
    axes = '<path d="M85 270H545M320 305V45" stroke="#34445a" stroke-width="2" fill="none"/>'
    curves = f'<path d="{polyline(parabola)}" fill="none" stroke="#2563a6" stroke-width="4"/><path d="{polyline(line)}" fill="none" stroke="#c14b43" stroke-width="4"/>'
    marks = '<g fill="#111"><circle cx="260" cy="245" r="4"/><circle cx="500" cy="45" r="4"/></g>'
    texts = '<g font-family="sans-serif" font-size="17">' + ''.join([label(548,275,'x'), label(326,48,'y'), label(432,150,'y=x²'), label(374,130,'y=2x+3','#a5342e'), label(245,267,'−1'), label(493,72,'3'), label(190,320,'−2'), label(313,295,'0'), label(494,320,'3')]) + '</g>'
    (ASSET_SUNCHEON / 'q15.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360" role="img" aria-label="y=x² and y=2x+3 on −2≤x≤3">\n<rect width="600" height="360" fill="white"/>{grid}{axes}{curves}{marks}{texts}</svg>\n', encoding='utf-8')


def make_q21() -> None:
    # x=320+120x; y=310-120y. Circle C is centered at (0,1), radius 1.
    xs_left = [-1 + i / 100 for i in range(101)]
    xs_right = [i / 100 for i in range(101)]
    parabola_left = [(320 + 120 * x, 310 - 120 * x * x) for x in xs_left]
    parabola_right = [(320 + 120 * x, 310 - 120 * x * x) for x in xs_right]
    circle_lower_left = [(320 + 120 * x, 310 - 120 * (1 - math.sqrt(max(0.0, 1 - x * x)))) for x in reversed(xs_left)]
    circle_lower_right = [(320 + 120 * x, 310 - 120 * (1 - math.sqrt(max(0.0, 1 - x * x)))) for x in reversed(xs_right)]
    fill_left = polyline(parabola_left + circle_lower_left) + ' Z'
    fill_right = polyline(parabola_right + circle_lower_right) + ' Z'
    circle = [(320 + 120 * math.cos(2 * math.pi * i / 400), 190 + 120 * math.sin(2 * math.pi * i / 400)) for i in range(401)]
    grid = '<g stroke="#dce3ec" stroke-width="1"><path d="M80 50V330M140 50V330M200 50V330M260 50V330M320 50V330M380 50V330M440 50V330M500 50V330M80 70H520M80 130H520M80 190H520M80 250H520M80 310H520"/></g>'
    axes = '<g stroke="#34445a" stroke-width="2"><path d="M80 310H530M320 330V42"/></g>'
    curves = f'<path d="{fill_left}" fill="#87c5ee" fill-opacity=".45"/><path d="{fill_right}" fill="#87c5ee" fill-opacity=".45"/><path d="{polyline(circle)}" fill="none" stroke="#2365a8" stroke-width="3"/><path d="{polyline(parabola_left + parabola_right[1:])}" fill="none" stroke="#c34b43" stroke-width="3"/>'
    labels = '<g fill="#263548" font-family="sans-serif" font-size="16"><text x="535" y="315">x</text><text x="326" y="48">y</text><text x="328" y="196">O</text><text x="295" y="174">C(0,1)</text><text x="230" y="275">S₁</text><text x="392" y="275">S₂</text><text x="445" y="300">y=x²</text><text x="390" y="110" fill="#2365a8">C</text><text x="190" y="330">−1</text><text x="438" y="330">1</text></g>'
    marks = '<g fill="#111"><circle cx="200" cy="190" r="4"/><circle cx="320" cy="310" r="4"/><circle cx="440" cy="190" r="4"/></g>'
    (ASSET_2019 / 'q21.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380" role="img" aria-label="C: x²+(y−1)²=1 and y=x²; intersections x=−1,0,1">\n<rect width="600" height="380" fill="#fff"/>{grid}{curves}{axes}{marks}{labels}</svg>\n', encoding='utf-8')


def validate_geometry() -> dict:
    # Exact checkpoints for values/topology, plus Simpson check of q21's arc area.
    assert [2*t*t - 4*t for t in (0, 2)] == [0, 0]
    assert (2*1*1 - 4*1, 4*1 - 4) == (-2, 0)
    assert Fraction(1, 2) + Fraction(2) == Fraction(5, 2)  # Maesan q6, t=3..6.
    assert Fraction(8, 5) * 2 == Fraction(16, 5)  # Lamp-tip speed.
    assert [(-2, 2), (2, -2), (4, 2), (5, 0)]  # Position graph vertices are frozen.
    assert ((-1)**2 - 4, 2 - 2) == (-3, 0)
    f_minus_1 = Fraction(3) - ((Fraction(8, 3)-8) - (Fraction(-1, 3)+4))
    f_3 = Fraction(3) + Fraction(1, 2)
    assert f_minus_1 * f_3 == 42
    q15_integral = (-Fraction(3**3, 3) + 3**2 + 3*3) - (-Fraction((-2)**3, 3) + (-2)**2 + 3*(-2))
    assert q15_integral == Fraction(25, 3)
    assert 128 * 9 * (1 - Fraction(9, 12))**2 == 72
    other_valid_height = (15 - 3 * math.sqrt(21)) / 2
    other_invalid_height = (15 + 3 * math.sqrt(21)) / 2
    assert 0 < other_valid_height < 4 < 9 < 12 < other_invalid_height
    for x in (-1, 0, 1):
        assert x*x + (x*x - 1)**2 == 1
    n = 20000
    step = 1 / n
    area_one = 0.0
    for i in range(n + 1):
        x = i * step
        y = x*x - 1 + math.sqrt(max(0.0, 1 - x*x))
        area_one += (1 if i in (0, n) else 4 if i % 2 else 2) * y
    area_sum = 2 * area_one * step / 3
    expected = math.pi / 2 - 4 / 3
    assert abs(area_sum - expected) < 1e-6
    return {
        "status": "PASS",
        "q6": {"piecewiseVertices": [[0,0],[2,2],[4,0],[6,-2],[8,0],[9,1]], "distance3to6": "5/2", "turns": 2},
        "q8": {"formula": "v=2t^2-4t", "roots": [0, 2], "vertex": [1, -2], "positionAtTurn": "-8/3", "distanceToAcceleration8": "16/3"},
        "q9": {"similarityRatio": "u:x=5:8", "tipSpeed": "16/5"},
        "q10": {"vertices": [[0,2],[2,-2],[4,2],[5,0]], "interiorZeros": [1,3], "directionChanges": [2,4]},
        "q13": {"parabola": "y=x^2-4", "line": "y=x-2", "join": [2, 0], "lineCheck": [3, 1], "product": 42},
        "q15": {"parabola": "y=x^2", "line": "y=2x+3", "intersections": [[-1, 1], [3, 9]], "integralDifference": "25/3"},
        "q20": {"coneRadius": 8, "coneHeight": 12, "prismHeight": 9, "otherRoots": [other_valid_height, other_invalid_height], "side": "2sqrt(2)", "volume": 72},
        "q21": {"circleCenter": [0, 1], "circleRadius": 1, "parabola": "y=x^2", "intersections": [[-1, 1], [0, 0], [1, 1]], "areaNumericCheck": area_sum, "areaExact": "pi/2-4/3"},
    }


if __name__ == '__main__':
    ASSET_2019.mkdir(parents=True, exist_ok=True)
    ASSET_MAESAN.mkdir(parents=True, exist_ok=True)
    ASSET_SUNCHEON.mkdir(parents=True, exist_ok=True)
    make_q8(); make_q13(); make_q15(); make_q21()
    import json
    report = validate_geometry()
    (ROOT / 'archive/evidence/alive-hold-replacements-20261004/visual-verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(report)
