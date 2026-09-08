from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path

ROOT = Path.cwd()
OUT = ROOT / "reports" / "h2-s1-algebra-visual-upgrade" / "candidates" / "24_팔마고_1학기_기말_고2_수학I_q9_solution.svg"
FACT = {
    "visualType": "SINE_GRAPH",
    "expression": "y=3sin(2x-pi/3)",
    "domain": [-math.pi / 3, 4 * math.pi / 3],
    "amplitude": 3,
    "period": math.pi,
    "phaseShift": math.pi / 6,
    "specialPoints": [
        {"name": "max_1", "x": 5 * math.pi / 12, "y": 3},
        {"name": "min_1", "x": 11 * math.pi / 12, "y": -3},
        {"name": "max_2", "x": 17 * math.pi / 12, "y": 3},
    ],
    "scalePolicy": "PROPORTIONAL_REQUIRED",
    "provenance": "source-only reconstruction from readable graph extrema, period, and phase markers; candidate only",
}
FACT_HASH = hashlib.sha256(json.dumps(FACT, sort_keys=True, separators=(",", ":")).encode()).hexdigest()

W, H = 720, 440
LEFT, RIGHT, TOP, BOTTOM = 72, 30, 34, 52
X0, X1 = FACT["domain"]
Y0, Y1 = -3.8, 3.8

def sx(x: float) -> float:
    return LEFT + (x - X0) / (X1 - X0) * (W - LEFT - RIGHT)

def sy(y: float) -> float:
    return TOP + (Y1 - y) / (Y1 - Y0) * (H - TOP - BOTTOM)

samples = []
for i in range(721):
    x = X0 + (X1 - X0) * i / 720
    y = 3 * math.sin(2 * x - math.pi / 3)
    samples.append(f"{sx(x):.3f},{sy(y):.3f}")

def text(x, y, value, cls="label", anchor="start"):
    return f'<text x="{x:.3f}" y="{y:.3f}" class="{cls}" text-anchor="{anchor}">{value}</text>'

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"
 data-graph-style-version="AP_GRAPH_PRINT_V1_1_DRAFT"
 data-graph-preset="SOLUTION_GRAPH"
 data-axis-scale-mode="PROPORTIONAL_REQUIRED"
 data-fact-hash="{FACT_HASH}"
 data-visual-provenance="deterministic-python-independent-facts-candidate">
<title>삼각함수 그래프 candidate · 24 팔마고 q9</title>
<desc>y=3sin(2x−π/3), amplitude 3, period π, phase shift π/6</desc>
<style>
.axis{{stroke:#111;stroke-width:1.4;fill:none}} .guide{{stroke:#777;stroke-width:0.9;stroke-dasharray:5 4;fill:none}}
.curve{{stroke:#111;stroke-width:2.1;fill:none;stroke-linecap:round;stroke-linejoin:round}}
.point{{fill:#111}} .label{{font:13px "STIX Two Math","Malgun Gothic",serif;fill:#111}}
.note{{font:12px "Noto Sans KR","Malgun Gothic",sans-serif;fill:#444}}
</style>
<defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#111"/></marker></defs>
<rect width="100%" height="100%" fill="#fff"/>
<line class="guide" x1="{sx(X0):.3f}" y1="{sy(3):.3f}" x2="{sx(X1):.3f}" y2="{sy(3):.3f}"/>
<line class="guide" x1="{sx(X0):.3f}" y1="{sy(-3):.3f}" x2="{sx(X1):.3f}" y2="{sy(-3):.3f}"/>
<line class="axis" x1="{sx(X0):.3f}" y1="{sy(0):.3f}" x2="{sx(X1):.3f}" y2="{sy(0):.3f}" marker-end="url(#arrow)"/>
<line class="axis" x1="{sx(0):.3f}" y1="{sy(Y0):.3f}" x2="{sx(0):.3f}" y2="{sy(Y1):.3f}" marker-end="url(#arrow)"/>
<polyline class="curve" points="{' '.join(samples)}"/>
{text(sx(X1)-4, sy(3)-8, 'y=3', 'label', 'end')}
{text(sx(X1)-4, sy(-3)+16, 'y=−3', 'label', 'end')}
{text(sx(X1), sy(0)+22, 'x', 'label', 'end')}
{text(sx(0)-10, sy(Y1)+12, 'y', 'label', 'end')}
{text(sx(0)-8, sy(0)+18, 'O', 'label', 'end')}
{''.join(f'<circle class="point" cx="{sx(p["x"]):.3f}" cy="{sy(p["y"]):.3f}" r="3"/>' for p in FACT["specialPoints"])}
{text(28, 26, 'candidate · source-blur reconstruction', 'note')}
</svg>\n'''

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(svg, encoding="utf-8")
(OUT.with_suffix(".facts.json")).write_text(json.dumps({"factModel": FACT, "factHash": FACT_HASH}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"output": str(OUT), "factHash": FACT_HASH, "sampleCount": 721}, ensure_ascii=False))
