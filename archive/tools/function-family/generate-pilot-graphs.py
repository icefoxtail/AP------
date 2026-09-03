"""Generate deterministic solution graphs for the first function-family pilot.

The source questions and answers are intentionally not edited here.  This
script only creates solution SVG assets from hand-reviewed mathematical facts
that are recorded next to each case.
"""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
ARCHIVE = ROOT / "archive"
sys.path.insert(0, str(ROOT))

from alive.engine.visual_renderer import render_visual_spec  # noqa: E402


PILOT_CASES = [
    {
        "caseId": "h1-21-gangnam-2final-q23-inverse-area",
        "sourceJsPath": "original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js",
        "id": 23,
        "assetRef": "assets/images/21_강남여고_2학기_기말_고1_기출/q23-solution.svg",
        "visualKind": "INVERSE_GRAPH",
        "factSummary": "f(x)=2sqrt(x+5)+3, f^-1 reflection, A=(11,11), B=(-1,7), C=(7,-1), triangle AB=AC",
        "spec": {
            "version": "0.1",
            "type": "simple_function_graph",
            "width": 540,
            "height": 540,
            "xRange": [-5, 16],
            "yRange": [-5, 16],
            "curves": [
                {"points": [{"x": -5, "y": 3}, {"x": -4, "y": 5}, {"x": -1, "y": 7}, {"x": 3, "y": 8.656854}, {"x": 7, "y": 9.928203}, {"x": 11, "y": 11}, {"x": 15, "y": 11.944272}]},
                {"points": [{"x": 3, "y": -5}, {"x": 4, "y": -4.75}, {"x": 5, "y": -4}, {"x": 7, "y": -1}, {"x": 9, "y": 4}, {"x": 11, "y": 11}, {"x": 11.5, "y": 13.0625}]},
            ],
            "lines": [
                {"from": {"x": -5, "y": -5}, "to": {"x": 16, "y": 16}, "label": "y=x", "kind": "guide", "dashed": True},
            ],
            "segments": [
                {"from": {"x": -1, "y": 7}, "to": {"x": 7, "y": -1}, "label": "BC", "kind": "guide", "dashed": True},
                {"from": {"x": 11, "y": 11}, "to": {"x": -1, "y": 7}, "label": "AB", "kind": "segment"},
                {"from": {"x": 11, "y": 11}, "to": {"x": 7, "y": -1}, "label": "AC", "kind": "segment"},
            ],
            "points": [
                {"x": 11, "y": 11, "label": "A"},
                {"x": -1, "y": 7, "label": "B"},
                {"x": 7, "y": -1, "label": "C"},
            ],
            "annotations": [
                {"x": -4.5, "y": 13.8, "text": "y=f(x)"},
                {"x": 8.5, "y": 13.7, "text": "y=f⁻¹(x)"},
                {"x": 11.1, "y": 10.3, "text": "A=(11,11)"},
            ],
        },
    },
    {
        "caseId": "h1-21-gangnam-2final-q29-absolute-radical-three-intersections",
        "sourceJsPath": "original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js",
        "id": 29,
        "assetRef": "assets/images/21_강남여고_2학기_기말_고1_기출/q29-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=0 for x<0; y=sqrt(2x) for x>=0; k=1/4 demonstrates three intersections; boundary k=0 and k=1/2",
        "spec": {
            "version": "0.1",
            "type": "simple_function_graph",
            "width": 620,
            "height": 460,
            "xRange": [-1, 2.5],
            "yRange": [-1, 2.5],
            "curves": [
                {"points": [{"x": -1, "y": 0}, {"x": -0.5, "y": 0}, {"x": -0.01, "y": 0}]},
                {"points": [{"x": 0, "y": 0}, {"x": 0.125, "y": 0.5}, {"x": 0.5, "y": 1}, {"x": 1.125, "y": 1.5}, {"x": 2, "y": 2}, {"x": 2.5, "y": 2.236068}]},
                {"points": [{"x": -1, "y": -0.75}, {"x": 0, "y": 0.25}, {"x": 0.043, "y": 0.293}, {"x": 1, "y": 1.25}, {"x": 1.457, "y": 1.707}, {"x": 2.25, "y": 2.5}]},
            ],
            "points": [
                {"x": -0.25, "y": 0, "label": "P₁"},
                {"x": 0.042893, "y": 0.292893, "label": "P₂"},
                {"x": 1.457107, "y": 1.707107, "label": "P₃"},
            ],
            "annotations": [
                {"x": -0.8, "y": 0.8, "text": "y=0 (x<0)"},
                {"x": 1.35, "y": 2.25, "text": "y=√(2x) (x≥0)"},
                {"x": -0.8, "y": 2.1, "text": "k=1/4"},
            ],
        },
    },
    {
        "caseId": "h1-25-suncheon-2final-q17-absolute-radical-minimum-slope",
        "sourceJsPath": "original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
        "id": 17,
        "assetRef": "assets/images/25_순천고_2학기_기말_고1_기출/q17-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=|sqrt(2x+2)-2|, two branches at t=0..2 and t>=2, minimum valid slope k=-1/2",
        "spec": {
            "version": "0.1",
            "type": "simple_function_graph",
            "width": 620,
            "height": 460,
            "xRange": [-1, 6],
            "yRange": [-1, 4],
            "curves": [
                {"points": [{"x": -1, "y": 2}, {"x": -0.875, "y": 1.5}, {"x": -0.5, "y": 1}, {"x": 0, "y": 0.585786}, {"x": 0.5, "y": 0.267949}, {"x": 1, "y": 0}]},
                {"points": [{"x": 1, "y": 0}, {"x": 1.5, "y": 0.236068}, {"x": 2, "y": 0.44949}, {"x": 3, "y": 0.828427}, {"x": 4, "y": 1.162278}, {"x": 6, "y": 1.741657}]},
                {"points": [{"x": -1, "y": 2}, {"x": 0, "y": 1.5}, {"x": 1, "y": 1}, {"x": 2, "y": 0.5}, {"x": 3, "y": 0}, {"x": 5, "y": -1}]},
            ],
            "points": [
                {"x": -1, "y": 2, "label": "P₁"},
                {"x": 2.055728, "y": 0.472136, "label": "P₂"},
            ],
            "annotations": [
                {"x": -0.8, "y": 3.4, "text": "y=|√(2x+2)−2|"},
                {"x": 3.2, "y": -0.65, "text": "k=−1/2"},
                {"x": 1.05, "y": 0.55, "text": "(1,0)"},
            ],
        },
    },
    {
        "caseId": "h1-25-suncheon-2final-q23-piecewise-four-intersections",
        "sourceJsPath": "original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
        "id": 23,
        "assetRef": "assets/images/25_순천고_2학기_기말_고1_기출/q23-solution.svg",
        "visualKind": "PIECEWISE_GRAPH",
        "factSummary": "left endpoint (1,2), right endpoint (2,3), line y=x+1, k=1 gives four distinct intersections",
        "spec": {
            "version": "0.1",
            "type": "simple_function_graph",
            "width": 620,
            "height": 460,
            "xRange": [-5, 5],
            "yRange": [-2, 6],
            "curves": [
                {"points": [{"x": -5, "y": -0.44949}, {"x": -4, "y": -0.236068}, {"x": -3, "y": 0}, {"x": -2, "y": 0.267949}, {"x": -1, "y": 0.585786}, {"x": 0, "y": 1}, {"x": 1, "y": 2}]},
                {"points": [{"x": 2, "y": 3}, {"x": 2.25, "y": 3.5}, {"x": 3, "y": 4}, {"x": 4, "y": 4.414214}, {"x": 5, "y": 4.732051}]},
                {"points": [{"x": -3, "y": -2}, {"x": -2, "y": -1}, {"x": -1, "y": 0}, {"x": 0, "y": 1}, {"x": 1, "y": 2}, {"x": 2, "y": 3}, {"x": 3, "y": 4}, {"x": 5, "y": 6}]},
            ],
            "points": [
                {"x": 0, "y": 1, "label": "P₁"},
                {"x": 1, "y": 2, "label": "P₂"},
                {"x": 2, "y": 3, "label": "P₃"},
                {"x": 3, "y": 4, "label": "P₄"},
            ],
            "annotations": [
                {"x": -4.5, "y": 1.6, "text": "x≤1"},
                {"x": 2.1, "y": 5.25, "text": "x≥2"},
                {"x": -3.8, "y": -1.0, "text": "y=x+1 (k=1)"},
                {"x": 0.4, "y": 2.45, "text": "(1,2)"},
                {"x": 1.6, "y": 3.45, "text": "(2,3)"},
            ],
        },
    },
    {
        "caseId": "h1-25-hyocheon-2final-q18-rational-circle-two-intersections",
        "sourceJsPath": "original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js",
        "id": 18,
        "assetRef": "assets/images/25_효천고_2학기_기말_고1_기출/q18-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "after X=x-2,Y=y-3, hyperbola XY=1 and circle X²+Y²=2 meet at (1,1),(-1,-1)",
        "spec": {
            "version": "0.1",
            "type": "coordinate_plane",
            "width": 540,
            "height": 540,
            "xRange": [-2, 6],
            "yRange": [-1, 7],
            "curves": [
                {"points": [{"x": -2, "y": 2.75}, {"x": -1, "y": 2.666667}, {"x": 0, "y": 2.5}, {"x": 1, "y": 2}, {"x": 1.5, "y": 1}, {"x": 1.7, "y": -0.333333}]},
                {"points": [{"x": 2.3, "y": 6.333333}, {"x": 2.5, "y": 5}, {"x": 3, "y": 4}, {"x": 4, "y": 3.5}, {"x": 5, "y": 3.333333}, {"x": 6, "y": 3.25}]},
            ],
            "asymptotes": [
                {"x": 2, "label": "x=2"},
                {"y": 3, "label": "y=3"},
            ],
            "circles": [
                {"center": {"x": 2, "y": 3, "label": "C"}, "radius": 1.414213562, "label": "r=√2"},
            ],
            "points": [
                {"x": 1, "y": 2, "label": "P"},
                {"x": 3, "y": 4, "label": "Q"},
                {"x": 2, "y": 3, "label": "C"},
            ],
            "annotations": [
                {"x": -1.5, "y": 5.8, "text": "y=3+1/(x−2)"},
                {"x": 2.4, "y": 6.3, "text": "X²+Y²=2"},
                {"x": 2.35, "y": 2.7, "text": "center (2,3)"},
            ],
        },
    },
]


BATCH2_CASES = [
    {
        "caseId": "h1-24-geumdang-2final-q03-rational-asymptotes",
        "sourceJsPath": "original/high/h1/2final/24_금당고_2학기_기말_고1_기출.js",
        "id": 3,
        "assetRef": "assets/images/24_금당고_2학기_기말_고1_기출/q03-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=1/(x+2)+2, vertical asymptote x=-2, horizontal asymptote y=2",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-8, 7], "yRange": [-8, 7],
            "asymptotes": [{"x": -2, "label": "x=−2"}, {"y": 2, "label": "y=2"}],
            "curves": [
                {"points": [{"x": -8, "y": 1.833333}, {"x": -5, "y": 1.666667}, {"x": -4, "y": 1.5}, {"x": -3, "y": 1}, {"x": -2.5, "y": 0}, {"x": -2.2, "y": -3}]},
                {"points": [{"x": -1.8, "y": 7}, {"x": -1.5, "y": 4}, {"x": -1, "y": 3}, {"x": 0, "y": 2.5}, {"x": 2, "y": 2.25}, {"x": 6, "y": 2.125}]},
            ],
            "points": [{"x": -3, "y": 1, "label": "P"}],
            "annotations": [{"x": -7, "y": 4.8, "text": "y=1/(x+2)+2"}, {"x": -7, "y": -6.8, "text": "center (−2,2)"}],
        },
    },
    {
        "caseId": "h1-24-geumdang-2final-q05-radical-minimum",
        "sourceJsPath": "original/high/h1/2final/24_금당고_2학기_기말_고1_기출.js",
        "id": 5,
        "assetRef": "assets/images/24_금당고_2학기_기말_고1_기출/q05-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=sqrt(2-x)+3, domain x<=2, endpoint/minimum (2,3)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-8, 7], "yRange": [-8, 7],
            "curves": [{"points": [{"x": -8, "y": 6.162278}, {"x": -7, "y": 6}, {"x": -6, "y": 5.828427}, {"x": -4, "y": 5.44949}, {"x": -2, "y": 5}, {"x": 0, "y": 4.414214}, {"x": 1, "y": 4}, {"x": 2, "y": 3}]}],
            "points": [{"x": 2, "y": 3, "label": "V"}],
            "annotations": [{"x": -7, "y": 1.5, "text": "y=√(2−x)＋3"}, {"x": -7, "y": -6.8, "text": "x≤2, minimum 3"}],
        },
    },
    {
        "caseId": "h1-25-palmas-2final-q04-rational-quadrants",
        "sourceJsPath": "original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js",
        "id": 4,
        "assetRef": "assets/images/25_팔마고_2학기_기말_고1_기출/q04-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=5/(3-x)-2, asymptotes x=3,y=-2, x-intercept (1/2,0), no quadrant II",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-6, 8], "yRange": [-8, 6],
            "asymptotes": [{"x": 3, "label": "x=3"}, {"y": -2, "label": "y=−2"}],
            "curves": [
                {"points": [{"x": -6, "y": -1.444444}, {"x": -2, "y": -1}, {"x": 0, "y": -0.333333}, {"x": 0.5, "y": 0}, {"x": 1, "y": 0.5}, {"x": 2, "y": 3}, {"x": 2.3, "y": 5.142857}]},
                {"points": [{"x": 3.9, "y": -7.555556}, {"x": 4, "y": -7}, {"x": 5, "y": -4.5}, {"x": 6, "y": -3.666667}, {"x": 8, "y": -3}]},
            ],
            "points": [{"x": 0.5, "y": 0, "label": "x-int"}],
            "annotations": [{"x": -5.5, "y": 4.8, "text": "y=5/(3−x)−2"}, {"x": -5.5, "y": -6.8, "text": "I, III, IV quadrants"}],
        },
    },
    {
        "caseId": "h1-25-palmas-2final-q06-rational-inverse-value",
        "sourceJsPath": "original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js",
        "id": 6,
        "assetRef": "assets/images/25_팔마고_2학기_기말_고1_기출/q06-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "f(x)=4+1/(x+1), asymptotes x=-1,y=4, f^-1(3)=-2",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-7, 5], "yRange": [-2, 10],
            "asymptotes": [{"x": -1, "label": "x=−1"}, {"y": 4, "label": "y=4"}],
            "curves": [
                {"points": [{"x": -7, "y": 3.833333}, {"x": -4, "y": 3.666667}, {"x": -2, "y": 3}, {"x": -1.5, "y": 2}, {"x": -1.2, "y": -1}]},
                {"points": [{"x": -0.8, "y": 9}, {"x": -0.5, "y": 6}, {"x": 0, "y": 5}, {"x": 1, "y": 4.5}, {"x": 5, "y": 4.166667}]},
            ],
            "points": [{"x": -2, "y": 3, "label": "f⁻¹(3)"}],
            "annotations": [{"x": -6, "y": 8.8, "text": "y=4+1/(x+1)"}, {"x": -6, "y": -0.8, "text": "a+b=−1+4=3"}],
        },
    },
    {
        "caseId": "h1-25-jeil-2final-q11-radical-quadrants",
        "sourceJsPath": "original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js",
        "id": 11,
        "assetRef": "assets/images/25_제일고_2학기_기말_고1_기출/q11-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=sqrt(-x-1)-1, endpoint (-1,-1), x-intercept (-2,0), quadrants II and III",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-8, 5], "yRange": [-6, 7],
            "curves": [{"points": [{"x": -8, "y": 1.645751}, {"x": -7, "y": 1.44949}, {"x": -5, "y": 1}, {"x": -3, "y": 0.414214}, {"x": -2, "y": 0}, {"x": -1.5, "y": -0.292893}, {"x": -1, "y": -1}]}],
            "points": [{"x": -2, "y": 0, "label": "x-int"}, {"x": -1, "y": -1, "label": "V"}],
            "annotations": [{"x": -7, "y": 5.8, "text": "y=√(−x−1)−1"}, {"x": -7, "y": -4.8, "text": "domain x≤−1"}],
        },
    },
    {
        "caseId": "h1-25-jeil-2final-q13-rational-properties",
        "sourceJsPath": "original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js",
        "id": 13,
        "assetRef": "assets/images/25_제일고_2학기_기말_고1_기출/q13-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=-x/(x-1)=-1-1/(x-1), asymptotes x=1,y=-1, center (1,-1)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-7, 9], "yRange": [-9, 7],
            "asymptotes": [{"x": 1, "label": "x=1"}, {"y": -1, "label": "y=−1"}],
            "curves": [
                {"points": [{"x": -7, "y": -0.875}, {"x": -4, "y": -0.8}, {"x": -1, "y": -0.5}, {"x": 0, "y": 0}, {"x": 0.5, "y": 1}, {"x": 0.8, "y": 4}]},
                {"points": [{"x": 1.2, "y": -6}, {"x": 1.5, "y": -3}, {"x": 2, "y": -2}, {"x": 4, "y": -1.333333}, {"x": 9, "y": -1.125}]},
            ],
            "points": [{"x": 0, "y": 0, "label": "O"}],
            "annotations": [{"x": -6, "y": 5.8, "text": "y=−1−1/(x−1)"}, {"x": -6, "y": -7.5, "text": "center (1,−1)"}],
        },
    },
    {
        "caseId": "h1-23-gangnam-2final-q05-positive-reciprocal",
        "sourceJsPath": "original/high/h1/2final/23_강남여고_2학기_기말_고1_기출.js",
        "id": 5,
        "assetRef": "assets/images/23_강남여고_2학기_기말_고1_기출/q05-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=k/x with k>0, graph in quadrants I and III, axes are asymptotes, domain/range exclude zero",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-8, 8], "yRange": [-8, 8],
            "asymptotes": [{"x": 0, "label": "x=0"}, {"y": 0, "label": "y=0"}],
            "curves": [
                {"points": [{"x": -8, "y": -0.5}, {"x": -4, "y": -1}, {"x": -2, "y": -2}, {"x": -1, "y": -4}, {"x": -0.5, "y": -8}]},
                {"points": [{"x": 0.5, "y": 8}, {"x": 1, "y": 4}, {"x": 2, "y": 2}, {"x": 4, "y": 1}, {"x": 8, "y": 0.5}]},
            ],
            "points": [{"x": 2, "y": 2, "label": "P"}, {"x": -2, "y": -2, "label": "Q"}],
            "annotations": [{"x": 2.8, "y": 6.8, "text": "k>0: I, III"}, {"x": -7, "y": -6.8, "text": "D=R\\{0}, R=R\\{0}"}],
        },
    },
    {
        "caseId": "h1-23-geumdang-2final-q07-rational-symmetry",
        "sourceJsPath": "original/high/h1/2final/23_금당고_2학기_기말_고1_기출.js",
        "id": 7,
        "assetRef": "assets/images/23_금당고_2학기_기말_고1_기출/q07-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=(x+1)/(1-x)=-1-2/(x-1), asymptotes x=1,y=-1, center (1,-1), symmetry line y=x-2",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-7, 9], "yRange": [-9, 7],
            "asymptotes": [{"x": 1, "label": "x=1"}, {"y": -1, "label": "y=−1"}],
            "lines": [{"from": {"x": -7, "y": -9}, "to": {"x": 9, "y": 7}, "label": "y=x−2", "kind": "guide", "dashed": True}],
            "curves": [
                {"points": [{"x": -7, "y": -0.75}, {"x": -3, "y": -0.5}, {"x": -1, "y": 0}, {"x": 0, "y": 1}, {"x": 0.5, "y": 3}, {"x": 0.75, "y": 7}]},
                {"points": [{"x": 1.25, "y": -9}, {"x": 1.5, "y": -5}, {"x": 2, "y": -3}, {"x": 4, "y": -1.666667}, {"x": 9, "y": -1.25}]},
            ],
            "points": [{"x": 0, "y": 1, "label": "P"}],
            "annotations": [{"x": -6, "y": 5.8, "text": "y=−1−2/(x−1)"}, {"x": -6, "y": -7.5, "text": "center (1,−1)"}],
        },
    },
    {
        "caseId": "h1-24-gangnam-2final-q06-translated-radical",
        "sourceJsPath": "original/high/h1/2final/24_강남여고_2학기_기말_고1_기출.js",
        "id": 6,
        "assetRef": "assets/images/24_강남여고_2학기_기말_고1_기출/q06-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "translate y=sqrt(-3x) right 2 and up 1 to y=sqrt(6-3x)+1, endpoint (2,1)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-6, 6], "yRange": [-6, 6],
            "curves": [{"points": [{"x": -6, "y": 5.898979}, {"x": -4, "y": 5.242641}, {"x": -2, "y": 4.464102}, {"x": 0, "y": 3.44949}, {"x": 1, "y": 2.732051}, {"x": 2, "y": 1}]}],
            "points": [{"x": 2, "y": 1, "label": "V"}],
            "annotations": [{"x": -5.5, "y": -2.5, "text": "y=√(−3x+6)+1"}, {"x": -5.5, "y": -5.2, "text": "x≤2"}],
        },
    },
    {
        "caseId": "h1-25-suncheon-2final-q18-rational-circle-distance",
        "sourceJsPath": "original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
        "id": 18,
        "assetRef": "assets/images/25_순천고_2학기_기말_고1_기출/q18-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=1/(x-1)+2 for x>1, circle center (1,2) radius 3, intersections symmetric and distance sqrt14",
        "spec": {
            "version": "0.1", "type": "coordinate_plane", "width": 540, "height": 540,
            "xRange": [-2, 8], "yRange": [-2, 8],
            "asymptotes": [{"x": 1, "label": "x=1"}, {"y": 2, "label": "y=2"}],
            "curves": [{"points": [{"x": 1.2, "y": 7}, {"x": 1.335437, "y": 4.981188}, {"x": 1.5, "y": 4}, {"x": 2, "y": 3}, {"x": 3, "y": 2.5}, {"x": 3.981188, "y": 2.335437}, {"x": 5, "y": 2.25}, {"x": 8, "y": 2.142857}]}],
            "circles": [{"center": {"x": 1, "y": 2, "label": "O"}, "radius": 3, "label": "r=3"}],
            "points": [{"x": 1.335437, "y": 4.981188, "label": "P"}, {"x": 3.981188, "y": 2.335437, "label": "Q"}],
            "annotations": [{"x": -1.5, "y": 6.7, "text": "y=1/(x−1)+2"}, {"x": -1.5, "y": -0.8, "text": "PQ=√14"}],
        },
    },
]


BATCH3_CASES = [
    {
        "caseId": "h1-24-geumdang-2final-q10-radical-two-intersections",
        "sourceJsPath": "original/high/h1/2final/24_금당고_2학기_기말_고1_기출.js",
        "id": 10,
        "assetRef": "assets/images/24_금당고_2학기_기말_고1_기출/q10-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=-sqrt(2-2x) and y=x+k, -3/2<k<=-1 gives two intersections",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 460,
            "xRange": [-6, 2], "yRange": [-5, 3],
            "curves": [
                {"points": [{"x": -6, "y": -3.741657}, {"x": -4, "y": -3.162278}, {"x": -2, "y": -2.44949}, {"x": 0, "y": -1.414214}, {"x": 0.5, "y": -1}, {"x": 1, "y": 0}]},
                {"points": [{"x": -3, "y": -4.4}, {"x": -2, "y": -3.4}, {"x": -1, "y": -2.4}, {"x": 0, "y": -1.4}, {"x": 1, "y": -0.4}, {"x": 2, "y": 0.6}]},
            ],
            "points": [{"x": -0.047214, "y": -1.447214, "label": "P₁"}, {"x": 0.847214, "y": -0.552786, "label": "P₂"}],
            "annotations": [{"x": -5.2, "y": 2.3, "text": "y=−√(2−2x)"}, {"x": -5.2, "y": 1.5, "text": "k=−1.4"}, {"x": -5.2, "y": -4.4, "text": "−3/2<k≤−1"}],
        },
    },
    {
        "caseId": "h1-25-geumdang-2final-q22-radical-two-intersections",
        "sourceJsPath": "original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js",
        "id": 22,
        "assetRef": "assets/images/25_금당고_2학기_기말_고1_기출/q22-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=sqrt(x-2) and y=x+k, -2<=k<-7/4 gives two nonnegative t roots",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 460,
            "xRange": [-1, 6], "yRange": [-3, 5],
            "curves": [
                {"points": [{"x": 2, "y": 0}, {"x": 2.012702, "y": 0.112702}, {"x": 2.25, "y": 0.5}, {"x": 3, "y": 1}, {"x": 4, "y": 1.414214}, {"x": 6, "y": 2}]},
                {"points": [{"x": -1, "y": -2.9}, {"x": 0, "y": -1.9}, {"x": 2, "y": 0.1}, {"x": 2.787298, "y": 0.887298}, {"x": 4, "y": 2.1}, {"x": 6, "y": 4.1}]},
            ],
            "points": [{"x": 2.012702, "y": 0.112702, "label": "P₁"}, {"x": 2.787298, "y": 0.887298, "label": "P₂"}],
            "annotations": [{"x": -0.5, "y": 4.6, "text": "y=√(x−2)"}, {"x": -0.5, "y": 3.8, "text": "k=−1.9"}, {"x": -0.5, "y": -2.5, "text": "−2≤k<−7/4"}],
        },
    },
    {
        "caseId": "h1-25-palmas-2final-q23-radical-line-range",
        "sourceJsPath": "original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js",
        "id": 23,
        "assetRef": "assets/images/25_팔마고_2학기_기말_고1_기출/q23-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=sqrt(2-3x) and y=-x/2+k, 1/3<=k<11/6; k=1 shows two intersections",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 460,
            "xRange": [-10, 3], "yRange": [-2, 11],
            "curves": [
                {"points": [{"x": -10, "y": 5.656854}, {"x": -8, "y": 5.09902}, {"x": -4, "y": 3.741657}, {"x": 0, "y": 1.414214}, {"x": 0.5, "y": 0.707107}, {"x": 0.666666, "y": 0.001414}]},
                {"points": [{"x": -10, "y": 6}, {"x": -8.47178, "y": 5.23589}, {"x": -4, "y": 3}, {"x": 0, "y": 1}, {"x": 0.47178, "y": 0.76411}, {"x": 3, "y": -0.5}]},
            ],
            "points": [{"x": -8.47178, "y": 5.23589, "label": "P₁"}, {"x": 0.47178, "y": 0.76411, "label": "P₂"}],
            "annotations": [{"x": -9.4, "y": 9.7, "text": "y=√(2−3x)"}, {"x": -9.4, "y": 8.8, "text": "k=1"}, {"x": -9.4, "y": -1.2, "text": "1/3≤k<11/6"}],
        },
    },
    {
        "caseId": "h1-25-jeil-2final-q20-inverse-intersection",
        "sourceJsPath": "original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js",
        "id": 20,
        "assetRef": "assets/images/25_제일고_2학기_기말_고1_기출/q20-solution.svg",
        "visualKind": "INVERSE_GRAPH",
        "factSummary": "f(x)=sqrt(x+2), inverse y=x²-2 for x>=0, intersection A=(2,2)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-2, 6], "yRange": [-2, 6],
            "curves": [
                {"points": [{"x": -2, "y": 0}, {"x": -1, "y": 1}, {"x": 0, "y": 1.414214}, {"x": 1, "y": 1.732051}, {"x": 2, "y": 2}, {"x": 6, "y": 2.828427}]},
                {"points": [{"x": 0, "y": -2}, {"x": 1, "y": -1}, {"x": 1.414214, "y": 0}, {"x": 2, "y": 2}, {"x": 2.828427, "y": 6}]},
            ],
            "lines": [{"from": {"x": -2, "y": -2}, "to": {"x": 6, "y": 6}, "label": "y=x", "kind": "guide", "dashed": True}],
            "points": [{"x": 2, "y": 2, "label": "A"}],
            "annotations": [{"x": -1.5, "y": 5.5, "text": "y=f(x)"}, {"x": 3.2, "y": 5.5, "text": "y=f⁻¹(x)"}, {"x": 2.2, "y": 1.2, "text": "A=(2,2)"}],
        },
    },
    {
        "caseId": "h1-24-geumdang-2final-q11-radical-chord-slope",
        "sourceJsPath": "original/high/h1/2final/24_금당고_2학기_기말_고1_기출.js",
        "id": 11,
        "assetRef": "assets/images/24_금당고_2학기_기말_고1_기출/q11-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=3sqrt(x), choose sqrt(a)=1/4 and sqrt(c)=3/4 so b+d=3 and chord slope 3",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 460,
            "xRange": [-0.2, 1.4], "yRange": [-0.5, 4.5],
            "curves": [{"points": [{"x": 0, "y": 0}, {"x": 0.0625, "y": 0.75}, {"x": 0.25, "y": 1.5}, {"x": 0.5625, "y": 2.25}, {"x": 1, "y": 3}, {"x": 1.4, "y": 3.549648}]}],
            "segments": [{"from": {"x": 0.0625, "y": 0.75}, "to": {"x": 0.5625, "y": 2.25}, "label": "PQ", "kind": "segment"}],
            "points": [{"x": 0.0625, "y": 0.75, "label": "P"}, {"x": 0.5625, "y": 2.25, "label": "Q"}],
            "annotations": [{"x": 0.05, "y": 4.1, "text": "y=3√x"}, {"x": 0.75, "y": 1.2, "text": "slope=3"}],
        },
    },
    {
        "caseId": "h1-24-geumdang-2final-q16-rational-area-minimum",
        "sourceJsPath": "original/high/h1/2final/24_금당고_2학기_기말_고1_기출.js",
        "id": 16,
        "assetRef": "assets/images/24_금당고_2학기_기말_고1_기출/q16-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "A=(sqrt2,sqrt2) on y=2/x minimizes distance to BC: x+y+3=0 through B=(-1,-2),C=(3,-6)",
        "spec": {
            "version": "0.1", "type": "coordinate_plane", "width": 620, "height": 460,
            "xRange": [-3, 5], "yRange": [-8, 5],
            "curves": [
                {"points": [{"x": -3, "y": -0.666667}, {"x": -2, "y": -1}, {"x": -1, "y": -2}, {"x": -0.5, "y": -4}, {"x": 0.5, "y": 4}, {"x": 1, "y": 2}, {"x": 1.414214, "y": 1.414214}, {"x": 2, "y": 1}, {"x": 5, "y": 0.4}]},
            ],
            "segments": [{"from": {"x": -1, "y": -2}, "to": {"x": 3, "y": -6}, "label": "BC", "kind": "segment"}, {"from": {"x": 1.414214, "y": 1.414214}, "to": {"x": 1.414214, "y": -4.414214}, "label": "height", "kind": "perpendicular", "dashed": True}],
            "points": [{"x": -1, "y": -2, "label": "B"}, {"x": 3, "y": -6, "label": "C"}, {"x": 1.414214, "y": 1.414214, "label": "A"}],
            "annotations": [{"x": -2.5, "y": 4.2, "text": "y=2/x"}, {"x": -2.5, "y": -7.3, "text": "BC: x+y+3=0"}, {"x": 1.7, "y": 2.3, "text": "A=(√2,√2)"}],
        },
    },
    {
        "caseId": "h1-23-gangnam-2final-q24-radical-line-slope-range",
        "sourceJsPath": "original/high/h1/2final/23_강남여고_2학기_기말_고1_기출.js",
        "id": 24,
        "assetRef": "assets/images/23_강남여고_2학기_기말_고1_기출/q24-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=sqrt(3x-3), y=ax+1, endpoint slopes a=-1 and a=1/2 bound -1<=a<=1/2",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 460,
            "xRange": [0, 6], "yRange": [-5, 5],
            "curves": [{"points": [{"x": 1, "y": 0}, {"x": 1.333333, "y": 1}, {"x": 2, "y": 1.732051}, {"x": 3, "y": 2.44949}, {"x": 4, "y": 3}, {"x": 6, "y": 3.872983}]}],
            "lines": [
                {"from": {"x": 0, "y": 1}, "to": {"x": 6, "y": -5}, "label": "a=−1", "kind": "guide", "dashed": True},
                {"from": {"x": 0, "y": 1}, "to": {"x": 6, "y": 4}, "label": "a=1/2", "kind": "guide", "dashed": True},
            ],
            "points": [{"x": 1, "y": 0, "label": "T₁"}, {"x": 4, "y": 3, "label": "T₂"}],
            "annotations": [{"x": 1.2, "y": 4.7, "text": "y=√(3x−3)"}, {"x": 0.2, "y": -1.4, "text": "−1≤a≤1/2"}],
        },
    },
    {
        "caseId": "h1-24-maesan-2final-q23-inverse-area",
        "sourceJsPath": "original/high/h1/2final/24_매산여고_2학기_기말_고1_기출.js",
        "id": 23,
        "assetRef": "assets/images/24_매산여고_2학기_기말_고1_기출/q23-solution.svg",
        "visualKind": "INVERSE_GRAPH",
        "factSummary": "f=sqrt(3x+4), inverse=(x²-4)/3 for x>=0, A=(4,4), B=(5/3,3), C=(3,5/3), l:y=-x+14/3",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 460,
            "xRange": [-2, 5], "yRange": [-3, 6],
            "curves": [
                {"points": [{"x": -1.333333, "y": 0.001}, {"x": 0, "y": 2}, {"x": 1.666667, "y": 3.000001}, {"x": 3, "y": 3.605551}, {"x": 4, "y": 4}, {"x": 4.5, "y": 4.1833}]},
                {"points": [{"x": 0, "y": -1.333333}, {"x": 1, "y": -1}, {"x": 1.666667, "y": -0.407407}, {"x": 3, "y": 1.666667}, {"x": 4, "y": 4}, {"x": 4.5, "y": 5.416667}]},
            ],
            "lines": [
                {"from": {"x": -1.3, "y": 5.933333}, "to": {"x": 4.5, "y": 0.166667}, "label": "l", "kind": "guide", "dashed": True},
                {"from": {"x": -2, "y": -2}, "to": {"x": 4.5, "y": 4.5}, "label": "y=x", "kind": "guide", "dashed": True},
            ],
            "segments": [{"from": {"x": 1.666667, "y": 3}, "to": {"x": 3, "y": 1.666667}, "label": "BC", "kind": "segment"}, {"from": {"x": 4, "y": 4}, "to": {"x": 1.666667, "y": 3}, "label": "AB", "kind": "segment"}, {"from": {"x": 4, "y": 4}, "to": {"x": 3, "y": 1.666667}, "label": "AC", "kind": "segment"}],
            "points": [{"x": 4, "y": 4, "label": "A"}, {"x": 1.666667, "y": 3, "label": "B"}, {"x": 3, "y": 1.666667, "label": "C"}],
            "annotations": [{"x": -1.5, "y": 5.1, "text": "y=f(x)"}, {"x": 3.3, "y": 5.4, "text": "y=f⁻¹(x)"}],
        },
    },
]


BATCH4_CASES = [
    {
        "caseId": "h1-25-geumdang-2final-q09-rational-asymptotes-point",
        "sourceJsPath": "original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js",
        "id": 9,
        "assetRef": "assets/images/25_금당고_2학기_기말_고1_기출/q09-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=-8/(x-1)-4, asymptotes x=1,y=-4, through (0,4)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-10, 15], "yRange": [-21, 4],
            "asymptotes": [{"x": 1, "label": "x=1"}, {"y": -4, "label": "y=−4"}],
            "curves": [
                {"points": [{"x": -10, "y": -3.272727}, {"x": -6, "y": -2.857143}, {"x": -2, "y": -1.333333}, {"x": 0, "y": 4}]},
                {"points": [{"x": 1.5, "y": -20}, {"x": 2, "y": -12}, {"x": 3, "y": -8}, {"x": 8, "y": -5.142857}, {"x": 15, "y": -4.571429}]},
            ],
            "points": [{"x": 0, "y": 4, "label": "P"}],
            "annotations": [{"x": -8, "y": 1.8, "text": "y=−8/(x−1)−4"}, {"x": -8, "y": -18.5, "text": "P=(0,4)"}],
        },
    },
    {
        "caseId": "h1-25-palmas-2final-q14-reciprocal-domain-range",
        "sourceJsPath": "original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js",
        "id": 14,
        "assetRef": "assets/images/25_팔마고_2학기_기말_고1_기출/q14-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=1/x, self-inverse, quadrants I and III, axes excluded from domain/range",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-6, 6], "yRange": [-6, 6],
            "asymptotes": [{"x": 0, "label": "x=0"}, {"y": 0, "label": "y=0"}],
            "curves": [{"points": [{"x": -6, "y": -0.166667}, {"x": -3, "y": -0.333333}, {"x": -1, "y": -1}, {"x": -0.5, "y": -2}, {"x": -0.166667, "y": -6}]}, {"points": [{"x": 0.166667, "y": 6}, {"x": 0.5, "y": 2}, {"x": 1, "y": 1}, {"x": 3, "y": 0.333333}, {"x": 6, "y": 0.166667}]}],
            "points": [{"x": 1, "y": 1, "label": "P"}, {"x": -1, "y": -1, "label": "Q"}],
            "annotations": [{"x": 1.4, "y": 5.2, "text": "f=f⁻¹"}, {"x": -5.5, "y": -5.2, "text": "D=R\\{0}, R=R\\{0}"}],
        },
    },
    {
        "caseId": "h1-24-maesan-2final-q03-rational-translation",
        "sourceJsPath": "original/high/h1/2final/24_매산여고_2학기_기말_고1_기출.js",
        "id": 3,
        "assetRef": "assets/images/24_매산여고_2학기_기말_고1_기출/q03-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=2+7/(x-1), translated y=7/x by (1,2)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-7, 9], "yRange": [-7, 9],
            "asymptotes": [{"x": 1, "label": "x=1"}, {"y": 2, "label": "y=2"}],
            "curves": [{"points": [{"x": -7, "y": 1.125}, {"x": -3, "y": 0.25}, {"x": 0, "y": -5}]}, {"points": [{"x": 2, "y": 9}, {"x": 3, "y": 5.5}, {"x": 5, "y": 3.75}, {"x": 9, "y": 2.875}]}],
            "points": [{"x": 2, "y": 9, "label": "P"}],
            "annotations": [{"x": -6, "y": 7.5, "text": "y=2+7/(x−1)"}, {"x": -6, "y": -5.8, "text": "shift: (1,2)"}],
        },
    },
    {
        "caseId": "h1-24-maesan-2final-q05-rational-properties",
        "sourceJsPath": "original/high/h1/2final/24_매산여고_2학기_기말_고1_기출.js",
        "id": 5,
        "assetRef": "assets/images/24_매산여고_2학기_기말_고1_기출/q05-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=-3+5/(x+1), asymptotes x=-1,y=-3, center (-1,-3)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-8, 8], "yRange": [-8, 8],
            "asymptotes": [{"x": -1, "label": "x=−1"}, {"y": -3, "label": "y=−3"}],
            "curves": [{"points": [{"x": -8, "y": -3.714286}, {"x": -3, "y": -5.5}, {"x": -2, "y": -8}]}, {"points": [{"x": 0, "y": 2}, {"x": 1, "y": -0.5}, {"x": 2, "y": -1.333333}, {"x": 8, "y": -2.444444}]}],
            "points": [{"x": 0, "y": 2, "label": "P"}],
            "annotations": [{"x": -7, "y": 6.2, "text": "y=−3+5/(x+1)"}, {"x": -7, "y": -6.5, "text": "center (−1,−3)"}],
        },
    },
    {
        "caseId": "h1-24-maesan-2final-q07-absolute-rational-levels",
        "sourceJsPath": "original/high/h1/2final/24_매산여고_2학기_기말_고1_기출.js",
        "id": 7,
        "assetRef": "assets/images/24_매산여고_2학기_기말_고1_기출/q07-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=|(2x+1)/(3-x)|, vertical asymptote x=3, horizontal levels y=1,2,3 count intersections",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 460,
            "xRange": [-6, 6], "yRange": [-1, 10],
            "asymptotes": [{"x": 3, "label": "x=3"}],
            "lines": [{"from": {"x": -6, "y": 1}, "to": {"x": 6, "y": 1}, "kind": "guide", "dashed": True, "label": "k=1"}, {"from": {"x": -6, "y": 2}, "to": {"x": 6, "y": 2}, "kind": "guide", "dashed": True, "label": "k=2"}, {"from": {"x": -6, "y": 3}, "to": {"x": 6, "y": 3}, "kind": "guide", "dashed": True, "label": "k=3"}],
            "curves": [{"points": [{"x": -6, "y": 1.222222}, {"x": -2, "y": 0.6}, {"x": -0.5, "y": 0}, {"x": 0, "y": 0.333333}, {"x": 1, "y": 1.5}, {"x": 2, "y": 5}, {"x": 2.2, "y": 6.75}]}, {"points": [{"x": 4, "y": 9}, {"x": 5, "y": 5.5}, {"x": 6, "y": 4.333333}]}],
            "points": [{"x": -0.5, "y": 0, "label": "x-int"}],
            "annotations": [{"x": -5.5, "y": 8.6, "text": "y=|(2x+1)/(3−x)|"}],
        },
    },
    {
        "caseId": "h1-23-gangnam-2final-q06-translated-radical-quadrants",
        "sourceJsPath": "original/high/h1/2final/23_강남여고_2학기_기말_고1_기출.js",
        "id": 6,
        "assetRef": "assets/images/23_강남여고_2학기_기말_고1_기출/q06-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=-sqrt(2x-4)+3, endpoint (2,3), x-intercept (13/2,0), quadrants I and IV",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 460,
            "xRange": [0, 10], "yRange": [-5, 5],
            "curves": [{"points": [{"x": 2, "y": 3}, {"x": 3, "y": 2}, {"x": 4, "y": 1.585786}, {"x": 5, "y": 1}, {"x": 6.5, "y": 0}, {"x": 8, "y": -0.464102}, {"x": 10, "y": -1}]}],
            "points": [{"x": 2, "y": 3, "label": "V"}, {"x": 6.5, "y": 0, "label": "x-int"}],
            "annotations": [{"x": 2.2, "y": 4.5, "text": "y=−√(2x−4)+3"}, {"x": 0.3, "y": -4.2, "text": "x≥2, y≤3"}],
        },
    },
    {
        "caseId": "h1-23-geumdang-2final-q20-radical-line-counts",
        "sourceJsPath": "original/high/h1/2final/23_금당고_2학기_기말_고1_기출.js",
        "id": 20,
        "assetRef": "assets/images/23_금당고_2학기_기말_고1_기출/q20-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=sqrt(x+3), lines y=x+2,y=x+3,y=x+4 give counts 1,2,0",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 460,
            "xRange": [-3, 6], "yRange": [-2, 10],
            "curves": [{"points": [{"x": -3, "y": 0}, {"x": -2, "y": 1}, {"x": -1, "y": 1.414214}, {"x": 0, "y": 1.732051}, {"x": 1, "y": 2}, {"x": 3, "y": 2.44949}, {"x": 6, "y": 3}]}],
            "lines": [{"from": {"x": -3, "y": -1}, "to": {"x": 6, "y": 8}, "label": "k=2", "kind": "guide", "dashed": True}, {"from": {"x": -3, "y": 0}, "to": {"x": 6, "y": 9}, "label": "k=3", "kind": "guide", "dashed": True}, {"from": {"x": -3, "y": 1}, "to": {"x": 6, "y": 10}, "label": "k=4", "kind": "guide", "dashed": True}],
            "points": [{"x": -1, "y": 1.414214, "label": "f(2)"}],
            "annotations": [{"x": -2.7, "y": 6.8, "text": "y=√(x+3)"}, {"x": 2.5, "y": -1.2, "text": "counts: 1,2,0"}],
        },
    },
    {
        "caseId": "h1-24-geumdang-2final-q18-rational-radical-one-intersection",
        "sourceJsPath": "original/high/h1/2final/24_금당고_2학기_기말_고1_기출.js",
        "id": 18,
        "assetRef": "assets/images/24_금당고_2학기_기말_고1_기출/q18-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=(x+1)/(x-1)=1+2/(x-1) and y=sqrt(x-k), one intersection iff k>-1",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 460,
            "xRange": [-4, 8], "yRange": [-6, 6],
            "asymptotes": [{"x": 1, "label": "x=1"}, {"y": 1, "label": "y=1"}],
            "curves": [{"points": [{"x": -4, "y": 0.6}, {"x": -2, "y": 0.333333}, {"x": 0, "y": -1}, {"x": 0.5, "y": -5}]}, {"points": [{"x": 1.5, "y": 5}, {"x": 2, "y": 3}, {"x": 3, "y": 2}, {"x": 5, "y": 1.5}, {"x": 8, "y": 1.285714}]}, {"points": [{"x": 0, "y": 0}, {"x": 1, "y": 1}, {"x": 2, "y": 1.414214}, {"x": 4, "y": 2}, {"x": 8, "y": 2.828427}]}],
            "points": [{"x": 4, "y": 2, "label": "P"}],
            "annotations": [{"x": -3.5, "y": 5.2, "text": "y=(x+1)/(x−1)"}, {"x": 4.7, "y": 3.4, "text": "y=√x (k=0)"}],
        },
    },
    {
        "caseId": "h1-25-geumdang-2final-q15-inverse-intersections",
        "sourceJsPath": "original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js",
        "id": 15,
        "assetRef": "assets/images/25_금당고_2학기_기말_고1_기출/q15-solution.svg",
        "visualKind": "INVERSE_GRAPH",
        "factSummary": "f=(x-6)^2+6 for x>=6, inverse 6+sqrt(x-6), intersections P=(6,6),Q=(7,7)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 460,
            "xRange": [5, 12], "yRange": [5, 22],
            "curves": [{"points": [{"x": 6, "y": 6}, {"x": 6.5, "y": 6.25}, {"x": 7, "y": 7}, {"x": 8, "y": 10}, {"x": 9, "y": 15}, {"x": 10, "y": 22}]}, {"points": [{"x": 6, "y": 6}, {"x": 7, "y": 7}, {"x": 8, "y": 7.414214}, {"x": 9, "y": 7.732051}, {"x": 12, "y": 8.44949}]}],
            "lines": [{"from": {"x": 5, "y": 5}, "to": {"x": 12, "y": 12}, "label": "y=x", "kind": "guide", "dashed": True}],
            "points": [{"x": 6, "y": 6, "label": "P"}, {"x": 7, "y": 7, "label": "Q"}],
            "annotations": [{"x": 6.2, "y": 17, "text": "y=f(x)"}, {"x": 9, "y": 10, "text": "y=f⁻¹(x)"}],
        },
    },
    {
        "caseId": "h1-25-jeil-2final-q14-two-rational-asymptote-rectangle",
        "sourceJsPath": "original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js",
        "id": 14,
        "assetRef": "assets/images/25_제일고_2학기_기말_고1_기출/q14-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "k=4: y=2/(x-4) asymptotes x=4,y=0; second y=4+3/(x-1) asymptotes x=1,y=4; rectangle area 12",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 460,
            "xRange": [-4, 8], "yRange": [-9, 16],
            "asymptotes": [{"x": 4, "label": "x=4"}, {"y": 0, "label": "y=0"}, {"x": 1, "label": "x=1"}, {"y": 4, "label": "y=4"}],
            "curves": [{"points": [{"x": -4, "y": -0.25}, {"x": 0, "y": -0.5}, {"x": 2, "y": -1}, {"x": 3, "y": -2}, {"x": 3.5, "y": -4}]}, {"points": [{"x": 4.5, "y": 4}, {"x": 5, "y": 2}, {"x": 6, "y": 1}, {"x": 8, "y": 0.5}]}, {"points": [{"x": -4, "y": 3.4}, {"x": -2, "y": 3.5}, {"x": 0, "y": 3}, {"x": 0.5, "y": -2}, {"x": 0.75, "y": -8}]}, {"points": [{"x": 1.25, "y": 16}, {"x": 2, "y": 7}, {"x": 3, "y": 5.5}, {"x": 5, "y": 4.75}, {"x": 8, "y": 4.428571}]}],
            "segments": [{"from": {"x": 1, "y": 0}, "to": {"x": 4, "y": 0}, "label": "3", "kind": "segment"}, {"from": {"x": 4, "y": 0}, "to": {"x": 4, "y": 4}, "label": "4", "kind": "segment"}],
            "annotations": [{"x": -3.5, "y": 8.5, "text": "area=|4−1|×|4−0|=12"}],
        },
    },
]


BATCH5_CASES = [
    {
        "caseId": "h1-25-hyocheon-2final-q08-radical-quadrants",
        "sourceJsPath": "original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js",
        "id": 8,
        "assetRef": "assets/images/25_효천고_2학기_기말_고1_기출/q08-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=-sqrt(2-x)+4, endpoint (2,4), x-intercept (-14,0), no quadrant IV",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 460,
            "xRange": [-15, 5], "yRange": [-2, 6],
            "curves": [{"points": [{"x": -15, "y": -0.123106}, {"x": -14, "y": 0}, {"x": -10, "y": 0.535898}, {"x": -6, "y": 1.171573}, {"x": 0, "y": 2.585786}, {"x": 2, "y": 4}]}],
            "points": [{"x": -14, "y": 0, "label": "x-int"}, {"x": 2, "y": 4, "label": "V"}],
            "annotations": [{"x": -13.5, "y": 5.5, "text": "y=−√(2−x)+4"}, {"x": -13.5, "y": -1.2, "text": "x≤2, y≤4; no IV"}],
        },
    },
    {
        "caseId": "h1-25-hyocheon-2final-q11-radical-inverse-point",
        "sourceJsPath": "original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js",
        "id": 11,
        "assetRef": "assets/images/25_효천고_2학기_기말_고1_기출/q11-solution.svg",
        "visualKind": "INVERSE_GRAPH",
        "factSummary": "f=sqrt(2x-5)+2, b=2,a=-5, inverse=(x-2)^2/2+5/2, intersection A=(3,3), f(9/2)=4",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [2, 6], "yRange": [1, 9],
            "curves": [{"points": [{"x": 2.5, "y": 2}, {"x": 3, "y": 3}, {"x": 3.5, "y": 3.414214}, {"x": 4.5, "y": 4}, {"x": 6, "y": 4.645751}]}, {"points": [{"x": 2, "y": 2.5}, {"x": 3, "y": 3}, {"x": 4, "y": 4.5}, {"x": 4.5, "y": 5.625}, {"x": 5.5, "y": 8.625}]}],
            "lines": [{"from": {"x": 2, "y": 2}, "to": {"x": 6, "y": 6}, "label": "y=x", "kind": "guide", "dashed": True}],
            "points": [{"x": 3, "y": 3, "label": "A"}, {"x": 4.5, "y": 4, "label": "f(9/2)"}],
            "annotations": [{"x": 2.2, "y": 8.3, "text": "y=f(x)"}, {"x": 4.2, "y": 7.5, "text": "y=f⁻¹(x)"}],
        },
    },
    {
        "caseId": "h1-25-palmas-2final-q11-inverse-tangent",
        "sourceJsPath": "original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js",
        "id": 11,
        "assetRef": "assets/images/25_팔마고_2학기_기말_고1_기출/q11-solution.svg",
        "visualKind": "INVERSE_GRAPH",
        "factSummary": "f=x²-6x+49/4 for x>=3, f=x has double root x=7/2, inverse is 3+sqrt(x-13/4)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [2, 7], "yRange": [2, 20],
            "curves": [{"points": [{"x": 3, "y": 3.25}, {"x": 3.5, "y": 3.5}, {"x": 4, "y": 4.25}, {"x": 5, "y": 7.25}, {"x": 7, "y": 19.25}]}, {"points": [{"x": 3.25, "y": 3}, {"x": 3.5, "y": 3.5}, {"x": 4.25, "y": 4}, {"x": 6, "y": 4.658312}, {"x": 7, "y": 4.936492}]}],
            "lines": [{"from": {"x": 2, "y": 2}, "to": {"x": 7, "y": 7}, "label": "y=x", "kind": "guide", "dashed": True}],
            "points": [{"x": 3.5, "y": 3.5, "label": "T"}],
            "annotations": [{"x": 3.1, "y": 10.5, "text": "tangent at (7/2,7/2)"}],
        },
    },
    {
        "caseId": "h1-21-bokseong-2final-q03-rational-asymptotes",
        "sourceJsPath": "original/high/h1/2final/21_복성고_2학기_기말_고1_기출.js",
        "id": 3,
        "assetRef": "assets/images/21_복성고_2학기_기말_고1_기출/q03-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=(-4x+8)/(2x-3)=-2+1/(x-3/2), asymptotes x=3/2,y=-2",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-6, 9], "yRange": [-9, 6],
            "asymptotes": [{"x": 1.5, "label": "x=3/2"}, {"y": -2, "label": "y=−2"}],
            "curves": [{"points": [{"x": -6, "y": -2.133333}, {"x": -2, "y": -2.285714}, {"x": 0, "y": -2.666667}, {"x": 1, "y": -4}, {"x": 1.3, "y": -7}]}, {"points": [{"x": 1.7, "y": 3}, {"x": 2, "y": 0}, {"x": 3, "y": -1.333333}, {"x": 5, "y": -1.714286}, {"x": 9, "y": -1.866667}]}],
            "points": [{"x": 2, "y": 0, "label": "P"}],
            "annotations": [{"x": -5.5, "y": 4.8, "text": "y=−2+1/(x−3/2)"}],
        },
    },
    {
        "caseId": "h1-21-gangnam-2final-q03-rational-center",
        "sourceJsPath": "original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js",
        "id": 3,
        "assetRef": "assets/images/21_강남여고_2학기_기말_고1_기출/q03-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=(2x-3)/(x-1)=2-1/(x-1), asymptotes x=1,y=2, center (1,2)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-7, 9], "yRange": [-6, 10],
            "asymptotes": [{"x": 1, "label": "x=1"}, {"y": 2, "label": "y=2"}],
            "curves": [{"points": [{"x": -7, "y": 2.125}, {"x": -3, "y": 2.25}, {"x": 0, "y": 3}, {"x": 0.5, "y": 4}, {"x": 0.8, "y": 7}]}, {"points": [{"x": 1.2, "y": -3}, {"x": 1.5, "y": 0}, {"x": 2, "y": 1}, {"x": 4, "y": 1.666667}, {"x": 9, "y": 1.875}]}],
            "points": [{"x": 0, "y": 3, "label": "P"}],
            "annotations": [{"x": -6, "y": 8.5, "text": "center (1,2)"}, {"x": -6, "y": -4.5, "text": "b−a=1"}],
        },
    },
    {
        "caseId": "h1-21-suncheon-2final-q08-radical-line-range",
        "sourceJsPath": "original/high/h1/2final/21_순천고_2학기_기말_고1_기출.js",
        "id": 8,
        "assetRef": "assets/images/21_순천고_2학기_기말_고1_기출/q08-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=sqrt(2x+4), y=x+k, 2<=k<5/2, k=2.2 has two intersections",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 460,
            "xRange": [-5, 5], "yRange": [-3, 5],
            "curves": [{"points": [{"x": -2, "y": 0}, {"x": -1.9746, "y": 0.2254}, {"x": -1, "y": 1.414214}, {"x": 0, "y": 2}, {"x": 1, "y": 2.44949}, {"x": 3, "y": 3.162278}, {"x": 5, "y": 3.741657}]}, {"points": [{"x": -5, "y": -2.8}, {"x": -2, "y": 0.2}, {"x": 0, "y": 2.2}, {"x": 2, "y": 4.2}]}],
            "points": [{"x": -1.9746, "y": 0.2254, "label": "P₁"}, {"x": -0.4254, "y": 1.7746, "label": "P₂"}],
            "annotations": [{"x": -4.5, "y": 4.6, "text": "y=√(2x+4)"}, {"x": -4.5, "y": -1.7, "text": "k=2.2; 2≤k<5/2"}],
        },
    },
    {
        "caseId": "h1-21-suncheon-2final-q11-radical-inverse-distance",
        "sourceJsPath": "original/high/h1/2final/21_순천고_2학기_기말_고1_기출.js",
        "id": 11,
        "assetRef": "assets/images/21_순천고_2학기_기말_고1_기출/q11-solution.svg",
        "visualKind": "INVERSE_GRAPH",
        "factSummary": "f=sqrt(x-3)+3, inverse=(x-3)^2+3 for x>=3, fixed points (3,3),(4,4), distance sqrt2",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [2, 7], "yRange": [2, 7],
            "curves": [{"points": [{"x": 3, "y": 3}, {"x": 3.25, "y": 3.5}, {"x": 4, "y": 4}, {"x": 5, "y": 4.414214}, {"x": 7, "y": 5}]}, {"points": [{"x": 3, "y": 3}, {"x": 3.5, "y": 3.25}, {"x": 4, "y": 4}, {"x": 5, "y": 7}] }],
            "lines": [{"from": {"x": 2, "y": 2}, "to": {"x": 7, "y": 7}, "label": "y=x", "kind": "guide", "dashed": True}],
            "points": [{"x": 3, "y": 3, "label": "P"}, {"x": 4, "y": 4, "label": "Q"}],
            "annotations": [{"x": 2.3, "y": 6.5, "text": "PQ=√2"}],
        },
    },
    {
        "caseId": "h1-21-geumdang-2final-q08-inverse-point",
        "sourceJsPath": "original/high/h1/2final/21_금당고_2학기_기말_고1_기출.js",
        "id": 8,
        "assetRef": "assets/images/21_금당고_2학기_기말_고1_기출/q08-solution.svg",
        "visualKind": "INVERSE_GRAPH",
        "factSummary": "f=(x-3)^2+1 for x>=3, inverse=3+sqrt(x-1), fixed point P=(5,5), OP=5sqrt2",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [2, 7], "yRange": [0, 10],
            "curves": [{"points": [{"x": 3, "y": 1}, {"x": 4, "y": 2}, {"x": 5, "y": 5}, {"x": 6, "y": 10}]}, {"points": [{"x": 3, "y": 4.414214}, {"x": 4, "y": 4.732051}, {"x": 5, "y": 5}, {"x": 7, "y": 5.44949}]}],
            "lines": [{"from": {"x": 2, "y": 2}, "to": {"x": 7, "y": 7}, "label": "y=x", "kind": "guide", "dashed": True}],
            "points": [{"x": 5, "y": 5, "label": "P"}],
            "annotations": [{"x": 3.1, "y": 9.3, "text": "P=(5,5), OP=5√2"}],
        },
    },
    {
        "caseId": "h1-21-geumdang-2final-q04-radical-translation",
        "sourceJsPath": "original/high/h1/2final/21_금당고_2학기_기말_고1_기출.js",
        "id": 4,
        "assetRef": "assets/images/21_금당고_2학기_기말_고1_기출/q04-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=sqrt(2-2x)+4=sqrt(-2(x-1))+4, endpoint (1,4), translated y=sqrt(-2x)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-5, 5], "yRange": [-2, 8],
            "curves": [{"points": [{"x": -5, "y": 7.464102}, {"x": -3, "y": 6.828427}, {"x": -1, "y": 6}, {"x": 0, "y": 5.414214}, {"x": 1, "y": 4}]}],
            "points": [{"x": 1, "y": 4, "label": "V"}],
            "annotations": [{"x": -4.5, "y": 1.2, "text": "right 1, up 4"}, {"x": -4.5, "y": -0.8, "text": "a=−2,m=1,n=4"}],
        },
    },
    {
        "caseId": "h1-21-palmas-2final-q05-rational-inverse-translation",
        "sourceJsPath": "original/high/h1/2final/21_팔마고_2학기_기말_고1_기출.js",
        "id": 5,
        "assetRef": "assets/images/21_팔마고_2학기_기말_고1_기출/q05-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "f=3+7/(x-2), inverse=2+7/(x-3), shift right 1 and down 1, ab=-1",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-6, 8], "yRange": [-6, 18],
            "asymptotes": [{"x": 2, "label": "f: x=2"}, {"y": 3, "label": "f: y=3"}, {"x": 3, "label": "f⁻¹: x=3"}, {"y": 2, "label": "f⁻¹: y=2"}],
            "curves": [{"points": [{"x": -6, "y": 2.125}, {"x": -2, "y": 1.25}, {"x": 0, "y": -0.5}, {"x": 1, "y": -4}]}, {"points": [{"x": 2.5, "y": 17}, {"x": 4, "y": 6.5}, {"x": 5, "y": 5.333333}, {"x": 8, "y": 4.166667}]}, {"points": [{"x": -6, "y": 1.222222}, {"x": -2, "y": 0.6}, {"x": 0, "y": -0.333333}, {"x": 2, "y": -5}]}, {"points": [{"x": 3.5, "y": 16}, {"x": 4, "y": 9}, {"x": 5, "y": 5.5}, {"x": 8, "y": 3.4}]}],
            "points": [{"x": 0, "y": -0.5, "label": "f(0)"}],
            "annotations": [{"x": -5.5, "y": 6.8, "text": "f: 3+7/(x−2)"}, {"x": -5.5, "y": -4.5, "text": "f⁻¹: 2+7/(x−3)"}],
        },
    },
]


BATCH6_CASES = [
    {
        "caseId": "h1-21-hyocheon-2final-q11-rational-quadrants-count",
        "sourceJsPath": "original/high/h1/2final/21_효천고_2학기_기말_고1_기출.js",
        "id": 11,
        "assetRef": "assets/images/21_효천고_2학기_기말_고1_기출/q11-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=3/(x-1)+2, representative a=1 has asymptotes x=1,y=2 and crosses all four quadrants",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-6, 6], "yRange": [-8, 8],
            "asymptotes": [{"x": 1, "label": "x=1"}, {"y": 2, "label": "y=2"}],
            "curves": [{"points": [{"x": -6, "y": 1.571429}, {"x": -2, "y": 1}, {"x": -0.5, "y": 0}, {"x": 0, "y": -1}, {"x": 0.5, "y": -4}]}, {"points": [{"x": 1.5, "y": 8}, {"x": 2, "y": 5}, {"x": 3, "y": 3.5}, {"x": 5, "y": 2.75}, {"x": 6, "y": 2.6}]}],
            "points": [{"x": -0.5, "y": 0, "label": "x-int"}],
            "annotations": [{"x": -5.5, "y": 6.8, "text": "y=3/(x−1)+2"}, {"x": -5.5, "y": -6.8, "text": "a=1: four quadrants"}],
        },
    },
    {
        "caseId": "h1-21-palmas-2final-q03-rational-properties",
        "sourceJsPath": "original/high/h1/2final/21_팔마고_2학기_기말_고1_기출.js",
        "id": 3,
        "assetRef": "assets/images/21_팔마고_2학기_기말_고1_기출/q03-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=(-3x+2)/(x+1)=-3+5/(x+1), asymptotes x=-1,y=-3, center (-1,-3)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-8, 8], "yRange": [-8, 8],
            "asymptotes": [{"x": -1, "label": "x=−1"}, {"y": -3, "label": "y=−3"}],
            "curves": [{"points": [{"x": -8, "y": -3.714286}, {"x": -3, "y": -5.5}, {"x": -2, "y": -8}]}, {"points": [{"x": 0, "y": 2}, {"x": 1, "y": -0.5}, {"x": 2, "y": -1.333333}, {"x": 8, "y": -2.444444}]}],
            "points": [{"x": 0, "y": 2, "label": "P"}],
            "annotations": [{"x": -7, "y": 6.2, "text": "y=−3+5/(x+1)"}, {"x": -7, "y": -6.5, "text": "center (−1,−3)"}],
        },
    },
    {
        "caseId": "h1-21-palmas-2final-q04-radical-inverse",
        "sourceJsPath": "original/high/h1/2final/21_팔마고_2학기_기말_고1_기출.js",
        "id": 4,
        "assetRef": "assets/images/21_팔마고_2학기_기말_고1_기출/q04-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=-sqrt(-2x+1)+2, endpoint (1/2,2), x-intercept (-3/2,0), inverse domain x<=2",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-6, 4], "yRange": [-4, 6],
            "curves": [{"points": [{"x": -6, "y": -1.605551}, {"x": -4, "y": -1.}, {"x": -1.5, "y": 0}, {"x": -1, "y": 0.267949}, {"x": 0, "y": 1}, {"x": 0.5, "y": 2}]}],
            "points": [{"x": -1.5, "y": 0, "label": "x-int"}, {"x": 0.5, "y": 2, "label": "V"}],
            "annotations": [{"x": -5.5, "y": 5.4, "text": "y=−√(−2x+1)+2"}, {"x": -5.5, "y": -3.2, "text": "inverse domain x≤2"}],
        },
    },
    {
        "caseId": "h1-21-jeil-2final-q05-radical-properties",
        "sourceJsPath": "original/high/h1/2final/21_제일고_2학기_기말_고1_기출.js",
        "id": 5,
        "assetRef": "assets/images/21_제일고_2학기_기말_고1_기출/q05-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=-sqrt(4-4x)+3=-2sqrt(1-x)+3, endpoint (1,3), x-intercept (-5/4,0)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-7, 4], "yRange": [-5, 5],
            "curves": [{"points": [{"x": -7, "y": -2.656854}, {"x": -4, "y": -1.472136}, {"x": -1.25, "y": 0}, {"x": -1, "y": 0.171573}, {"x": 0, "y": 1}, {"x": 1, "y": 3}]}],
            "points": [{"x": -1.25, "y": 0, "label": "x-int"}, {"x": 1, "y": 3, "label": "V"}],
            "annotations": [{"x": -6.5, "y": 4.5, "text": "y=−2√(1−x)+3"}, {"x": -6.5, "y": -4.2, "text": "domain x≤1"}],
        },
    },
    {
        "caseId": "h1-21-jeil-2final-q04-rational-properties",
        "sourceJsPath": "original/high/h1/2final/21_제일고_2학기_기말_고1_기출.js",
        "id": 4,
        "assetRef": "assets/images/21_제일고_2학기_기말_고1_기출/q04-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=(2x+1)/(x+3)=2-5/(x+3), asymptotes x=-3,y=2, center (-3,2)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-9, 7], "yRange": [-6, 10],
            "asymptotes": [{"x": -3, "label": "x=−3"}, {"y": 2, "label": "y=2"}],
            "curves": [{"points": [{"x": -9, "y": 2.833333}, {"x": -5, "y": 4.5}, {"x": -4, "y": 7}, {"x": -3.7, "y": 9.142857}]}, {"points": [{"x": -2, "y": -3}, {"x": -1, "y": -0.5}, {"x": 0, "y": 0.333333}, {"x": 3, "y": 1.166667}, {"x": 7, "y": 1.5}]}],
            "points": [{"x": -0.5, "y": 0, "label": "x-int"}],
            "annotations": [{"x": -8, "y": 8.5, "text": "y=2−5/(x+3)"}, {"x": -8, "y": -4.5, "text": "center (−3,2)"}],
        },
    },
    {
        "caseId": "h1-21-suncheon-2final-q18-rational-circle-ratio",
        "sourceJsPath": "original/high/h1/2final/21_순천고_2학기_기말_고1_기출.js",
        "id": 18,
        "assetRef": "assets/images/21_순천고_2학기_기말_고1_기출/q18-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "circle x²+y²=5 and y=(3/2)/x meet in first quadrant at x²=1/2,9/2; x ratio 1:3",
        "spec": {
            "version": "0.1", "type": "coordinate_plane", "width": 540, "height": 540,
            "xRange": [-3, 3], "yRange": [-3, 3],
            "asymptotes": [{"x": 0, "label": "x=0"}, {"y": 0, "label": "y=0"}],
            "circles": [{"center": {"x": 0, "y": 0, "label": "O"}, "radius": 2.236068, "label": "r=√5"}],
            "curves": [{"points": [{"x": 0.5, "y": 3}, {"x": 0.707107, "y": 2.12132}, {"x": 1, "y": 1.5}, {"x": 1.5, "y": 1}, {"x": 2.12132, "y": 0.707107}, {"x": 3, "y": 0.5}]}],
            "points": [{"x": 0.707107, "y": 2.12132, "label": "P"}, {"x": 2.12132, "y": 0.707107, "label": "Q"}],
            "annotations": [{"x": -2.7, "y": 2.7, "text": "y=(3/2)/x"}, {"x": -2.7, "y": -2.5, "text": "x²=1/2, 9/2"}],
        },
    },
    {
        "caseId": "h1-21-bokseong-2final-q04-radical-domain-range",
        "sourceJsPath": "original/high/h1/2final/21_복성고_2학기_기말_고1_기출.js",
        "id": 4,
        "assetRef": "assets/images/21_복성고_2학기_기말_고1_기출/q04-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=-sqrt(4-2x)+4, endpoint (2,4), domain x<=2, range y<=4",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [-8, 5], "yRange": [-4, 6],
            "curves": [{"points": [{"x": -8, "y": -0.472136}, {"x": -6, "y": 0}, {"x": -4, "y": 0.535898}, {"x": -2, "y": 1.171573}, {"x": 0, "y": 2}, {"x": 2, "y": 4}]}],
            "points": [{"x": -6, "y": 0, "label": "x-int"}, {"x": 2, "y": 4, "label": "V"}],
            "annotations": [{"x": -7.5, "y": 5.2, "text": "y=−√(4−2x)+4"}, {"x": -7.5, "y": -3.2, "text": "x≤2, y≤4"}],
        },
    },
    {
        "caseId": "h1-21-bokseong-2final-q12-radical-inverse-tangent",
        "sourceJsPath": "original/high/h1/2final/21_복성고_2학기_기말_고1_기출.js",
        "id": 12,
        "assetRef": "assets/images/21_복성고_2학기_기말_고1_기출/q12-solution.svg",
        "visualKind": "INVERSE_GRAPH",
        "factSummary": "f=2sqrt(x-4)+3 when a=4, inverse=(x-3)^2/4+4, tangent fixed point (5,5)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 540, "height": 540,
            "xRange": [2, 7], "yRange": [1, 8],
            "curves": [{"points": [{"x": 4, "y": 3}, {"x": 4.25, "y": 4}, {"x": 5, "y": 5}, {"x": 6, "y": 5.828427}, {"x": 7, "y": 6.464102}]}, {"points": [{"x": 3, "y": 4}, {"x": 4, "y": 4.25}, {"x": 5, "y": 5}, {"x": 6, "y": 6.25}, {"x": 7, "y": 8}] }],
            "lines": [{"from": {"x": 2, "y": 2}, "to": {"x": 7, "y": 7}, "label": "y=x", "kind": "guide", "dashed": True}],
            "points": [{"x": 5, "y": 5, "label": "T"}],
            "annotations": [{"x": 2.4, "y": 6.5, "text": "a=4, tangent T=(5,5)"}],
        },
    },
    {
        "caseId": "h1-21-gangnam-2final-q17-rational-line-distance",
        "sourceJsPath": "original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js",
        "id": 17,
        "assetRef": "assets/images/21_강남여고_2학기_기말_고1_기출/q17-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "P=(a,1/(a-1)), Q=(a,-4a), a>1, minimum PQ=8 at a=3/2",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 460,
            "xRange": [0, 4], "yRange": [-16, 6],
            "asymptotes": [{"x": 1, "label": "x=1"}],
            "curves": [{"points": [{"x": 1.2, "y": 5}, {"x": 1.5, "y": 2}, {"x": 2, "y": 1}, {"x": 3, "y": 0.5}, {"x": 4, "y": 0.333333}]}, {"points": [{"x": 0, "y": 0}, {"x": 1, "y": -4}, {"x": 2, "y": -8}, {"x": 3, "y": -12}, {"x": 4, "y": -16}]}],
            "segments": [{"from": {"x": 1.5, "y": 2}, "to": {"x": 1.5, "y": -6}, "label": "PQ=8", "kind": "segment"}],
            "points": [{"x": 1.5, "y": 2, "label": "P"}, {"x": 1.5, "y": -6, "label": "Q"}],
            "annotations": [{"x": 2.2, "y": 5.2, "text": "y=1/(x−1)"}, {"x": 2.2, "y": -14.5, "text": "y=−4x; a=3/2"}],
        },
    },
]


BATCH7_CASES = [
    {
        "caseId": "h1-25-hyocheon-2final-q12-rational-symmetry-axes",
        "sourceJsPath": "original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js",
        "id": 12,
        "assetRef": "assets/images/25_효천고_2학기_기말_고1_기출/q12-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "a=-2,b=2, y=3-1/(x+2), center (-2,3), symmetry axes y=x+5 and y=-x+1",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 520,
            "xRange": [-8, 6], "yRange": [-8, 10],
            "asymptotes": [{"x": -2, "label": "x=−2"}, {"y": 3, "label": "y=3"}],
            "curves": [
                {"points": [{"x": -8, "y": 3.166667}, {"x": -4, "y": 3.5}, {"x": -3, "y": 4}, {"x": -2.5, "y": 5}, {"x": -2.2, "y": 8}]},
                {"points": [{"x": -1.8, "y": -2}, {"x": -1.5, "y": 1}, {"x": -1, "y": 2}, {"x": 0, "y": 2.5}, {"x": 2, "y": 2.75}, {"x": 6, "y": 2.875}]},
            ],
            "lines": [
                {"from": {"x": -8, "y": -3}, "to": {"x": 5, "y": 10}, "label": "y=x+5", "kind": "guide", "dashed": True},
                {"from": {"x": -8, "y": 9}, "to": {"x": 6, "y": -5}, "label": "y=−x+1", "kind": "guide", "dashed": True},
            ],
            "points": [{"x": -2, "y": 3, "label": "C"}],
            "annotations": [{"x": -7.5, "y": 8.5, "text": "y=3−1/(x+2)"}, {"x": -7.5, "y": -6.8, "text": "axes: y=x+5, y=−x+1"}],
        },
    },
    {
        "caseId": "h1-22-palmas-2final-q12-radical-line-tangent",
        "sourceJsPath": "original/high/h1/2final/22_팔마고_2학기_기말_고1_기출.js",
        "id": 12,
        "assetRef": "assets/images/22_팔마고_2학기_기말_고1_기출/q12-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=-sqrt(x-5) and y=-x+19/4 are tangent at T=(21/4,-1/2), minimum k=19/4",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 600, "height": 500,
            "xRange": [3, 10], "yRange": [-6, 4],
            "curves": [{"points": [{"x": 5, "y": 0}, {"x": 5.25, "y": -0.5}, {"x": 6, "y": -1}, {"x": 7.25, "y": -1.5}, {"x": 9, "y": -2}, {"x": 10, "y": -2.236068}]}],
            "lines": [{"from": {"x": 3, "y": 1.75}, "to": {"x": 10, "y": -5.25}, "label": "y=−x+19/4", "kind": "line"}],
            "points": [{"x": 5, "y": 0, "label": "V"}, {"x": 5.25, "y": -0.5, "label": "T"}],
            "annotations": [{"x": 3.25, "y": 3.3, "text": "y=−√(x−5)"}, {"x": 6.1, "y": -5.4, "text": "one contact: k=19/4"}],
        },
    },
    {
        "caseId": "h1-22-jeil-2final-q09-radical-line-two-intersections",
        "sourceJsPath": "original/high/h1/2final/22_제일고_2학기_기말_고1_기출.js",
        "id": 9,
        "assetRef": "assets/images/22_제일고_2학기_기말_고1_기출/q09-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "for representative k=17/8, y=sqrt(2-x) and y=-x+k meet twice; 2≤k<9/4",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 600, "height": 500,
            "xRange": [-3, 4], "yRange": [-5, 6],
            "curves": [{"points": [{"x": -3, "y": 2.236068}, {"x": -1, "y": 1.732051}, {"x": 0, "y": 1.414214}, {"x": 1, "y": 1}, {"x": 2, "y": 0}]}],
            "lines": [{"from": {"x": -3, "y": 5.125}, "to": {"x": 4, "y": -1.875}, "label": "y=−x+17/8", "kind": "line"}],
            "points": [{"x": 1.271447, "y": 0.853553, "label": "P"}, {"x": 1.978553, "y": 0.146447, "label": "Q"}],
            "annotations": [{"x": -2.7, "y": 5.3, "text": "y=√(2−x)"}, {"x": -2.7, "y": -4.2, "text": "2≤k<9/4: two points"}],
        },
    },
    {
        "caseId": "h1-22-suncheon-girls-2final-q07-rational-quadrants",
        "sourceJsPath": "original/high/h1/2final/22_순천여고_2학기_기말_고1_기출.js",
        "id": 7,
        "assetRef": "assets/images/22_순천여고_2학기_기말_고1_기출/q07-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "minimum natural k=3 in y=-2+k/(x+1); representative graph crosses all four quadrants",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 600, "height": 500,
            "xRange": [-6, 6], "yRange": [-8, 8],
            "asymptotes": [{"x": -1, "label": "x=−1"}, {"y": -2, "label": "y=−2"}],
            "curves": [
                {"points": [{"x": -6, "y": -2.6}, {"x": -3, "y": -3.5}, {"x": -2, "y": -5}]},
                {"points": [{"x": -0.5, "y": 4}, {"x": 0, "y": 1}, {"x": 1, "y": -0.5}, {"x": 2, "y": -1}, {"x": 6, "y": -1.571429}]},
            ],
            "points": [{"x": -0.5, "y": 4, "label": "QII"}, {"x": 0, "y": 1, "label": "QI"}, {"x": 2, "y": -1, "label": "QIV"}, {"x": -3, "y": -3.5, "label": "QIII"}],
            "annotations": [{"x": -5.5, "y": 6.8, "text": "y=−2+3/(x+1)"}, {"x": -5.5, "y": -6.8, "text": "k=3: all quadrants"}],
        },
    },
    {
        "caseId": "h1-22-suncheon-girls-2final-q08-rational-line-no-intersection",
        "sourceJsPath": "original/high/h1/2final/22_순천여고_2학기_기말_고1_기출.js",
        "id": 8,
        "assetRef": "assets/images/22_순천여고_2학기_기말_고1_기출/q08-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "at representative k=8, y=x/(x-2) and y=-2x+8 have discriminant -7 and no intersection; 1<k<9",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 600, "height": 500,
            "xRange": [-1, 6], "yRange": [-12, 12],
            "asymptotes": [{"x": 2, "label": "x=2"}, {"y": 1, "label": "y=1"}],
            "curves": [
                {"points": [{"x": -1, "y": 0.333333}, {"x": 0, "y": 0}, {"x": 1, "y": -1}, {"x": 1.5, "y": -3}]},
                {"points": [{"x": 2.5, "y": 5}, {"x": 3, "y": 3}, {"x": 4, "y": 2}, {"x": 6, "y": 1.5}]},
            ],
            "lines": [{"from": {"x": -1, "y": 10}, "to": {"x": 6, "y": -4}, "label": "y=−2x+8", "kind": "line"}],
            "annotations": [{"x": -0.8, "y": 11, "text": "D=(k−1)(k−9)<0"}, {"x": 3.2, "y": -10.3, "text": "k=8: no intersection"}],
        },
    },
    {
        "caseId": "h1-22-bokseong-2final-q07-radical-domain-range",
        "sourceJsPath": "original/high/h1/2final/22_복성고_2학기_기말_고1_기출.js",
        "id": 7,
        "assetRef": "assets/images/22_복성고_2학기_기말_고1_기출/q07-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=-sqrt(2x+3)+2 has endpoint (-3/2,2), domain x≥-3/2, range y≤2, and passes (3,-1)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 600, "height": 500,
            "xRange": [-4, 7], "yRange": [-6, 6],
            "curves": [{"points": [{"x": -1.5, "y": 2}, {"x": 0, "y": 0.267949}, {"x": 3, "y": -1}, {"x": 6, "y": -1.872983}, {"x": 7, "y": -2.123106}]}],
            "points": [{"x": -1.5, "y": 2, "label": "V"}, {"x": 3, "y": -1, "label": "P"}],
            "annotations": [{"x": -3.7, "y": 5.3, "text": "y=−√(2x+3)+2"}, {"x": -3.7, "y": -4.8, "text": "x≥−3/2, y≤2"}],
        },
    },
    {
        "caseId": "h1-22-geumdang-2final-q01-rational-asymptotes",
        "sourceJsPath": "original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js",
        "id": 1,
        "assetRef": "assets/images/22_금당고_2학기_기말_고1_기출/q01-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=2/(x-2)-1 has vertical asymptote x=2, horizontal asymptote y=-1, p+q=1",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 600, "height": 500,
            "xRange": [-6, 8], "yRange": [-10, 10],
            "asymptotes": [{"x": 2, "label": "x=2"}, {"y": -1, "label": "y=−1"}],
            "curves": [
                {"points": [{"x": -6, "y": -1.25}, {"x": -2, "y": -1.5}, {"x": 0, "y": -2}, {"x": 1, "y": -3}, {"x": 1.5, "y": -5}]},
                {"points": [{"x": 2.5, "y": 3}, {"x": 3, "y": 1}, {"x": 4, "y": 0}, {"x": 6, "y": -0.5}, {"x": 8, "y": -0.666667}]},
            ],
            "points": [{"x": 0, "y": -2, "label": "P"}],
            "annotations": [{"x": -5.5, "y": 8.3, "text": "y=2/(x−2)−1"}, {"x": -5.5, "y": -8.3, "text": "p=2, q=−1"}],
        },
    },
    {
        "caseId": "h1-22-gangnam-2final-q11-radical-inverse-intersections",
        "sourceJsPath": "original/high/h1/2final/22_강남여고_2학기_기말_고1_기출.js",
        "id": 11,
        "assetRef": "assets/images/22_강남여고_2학기_기말_고1_기출/q11-solution.svg",
        "visualKind": "INVERSE_GRAPH",
        "factSummary": "f=sqrt(x-1)+1, inverse=(x-1)^2+1 on x≥1, intersections (1,1),(2,2), distance sqrt2",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 600, "height": 500,
            "xRange": [0, 5], "yRange": [0, 12],
            "curves": [
                {"points": [{"x": 1, "y": 1}, {"x": 1.25, "y": 1.5}, {"x": 2, "y": 2}, {"x": 3, "y": 2.414214}, {"x": 5, "y": 3}]},
                {"points": [{"x": 1, "y": 1}, {"x": 1.5, "y": 1.25}, {"x": 2, "y": 2}, {"x": 3, "y": 5}, {"x": 4, "y": 10}]},
            ],
            "lines": [{"from": {"x": 0, "y": 0}, "to": {"x": 5, "y": 5}, "label": "y=x", "kind": "guide", "dashed": True}],
            "points": [{"x": 1, "y": 1, "label": "A"}, {"x": 2, "y": 2, "label": "B"}],
            "annotations": [{"x": 0.3, "y": 10.8, "text": "f(x)=√(x−1)+1"}, {"x": 0.3, "y": 9.2, "text": "AB=√2"}],
        },
    },
    {
        "caseId": "h1-25-suncheon-2final-q13-rational-asymptotes-intercepts",
        "sourceJsPath": "original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
        "id": 13,
        "assetRef": "assets/images/25_순천고_2학기_기말_고1_기출/q13-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=(x+5)/(x+3)=1+2/(x+3), x-intercept -5, asymptotes x=-3 and y=1, a+b+c=9",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 600, "height": 500,
            "xRange": [-9, 6], "yRange": [-8, 8],
            "asymptotes": [{"x": -3, "label": "x=−3"}, {"y": 1, "label": "y=1"}],
            "curves": [
                {"points": [{"x": -9, "y": 0.666667}, {"x": -6, "y": 0.333333}, {"x": -5, "y": 0}, {"x": -4, "y": -1}, {"x": -3.5, "y": -3}]},
                {"points": [{"x": -2.5, "y": 5}, {"x": -2, "y": 3}, {"x": 0, "y": 1.666667}, {"x": 3, "y": 1.333333}, {"x": 6, "y": 1.222222}]},
            ],
            "points": [{"x": -5, "y": 0, "label": "x-int"}, {"x": -3, "y": 1, "label": "C"}],
            "annotations": [{"x": -8.5, "y": 6.8, "text": "y=(x+5)/(x+3)"}, {"x": -8.5, "y": -6.8, "text": "x-int −5, asymptotes x=−3,y=1"}],
        },
    },
    {
        "caseId": "h1-25-suncheon-2final-q14-rational-all-quadrants",
        "sourceJsPath": "original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
        "id": 14,
        "assetRef": "assets/images/25_순천고_2학기_기말_고1_기출/q14-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "a=-1/4 gives y=1/(2-x)-1/4 and the graph passes all four quadrants; -1/2<a<0",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 600, "height": 500,
            "xRange": [-6, 8], "yRange": [-10, 10],
            "asymptotes": [{"x": 2, "label": "x=2"}, {"y": -0.25, "label": "y=−1/4"}],
            "curves": [
                {"points": [{"x": -6, "y": -0.125}, {"x": -2, "y": 0}, {"x": -0.5, "y": 0.15}, {"x": 0, "y": 0.25}, {"x": 1, "y": 0.75}, {"x": 1.5, "y": 1.75}]},
                {"points": [{"x": 2.5, "y": -2.25}, {"x": 3, "y": -1.25}, {"x": 4, "y": -0.75}, {"x": 8, "y": -0.416667}]},
            ],
            "points": [{"x": -0.5, "y": 0.15, "label": "QII"}, {"x": 1, "y": 0.75, "label": "QI"}, {"x": 3, "y": -1.25, "label": "QIV"}, {"x": -6, "y": -0.125, "label": "QIII"}],
            "annotations": [{"x": -5.5, "y": 8.3, "text": "y=1/(2−x)−1/4"}, {"x": -5.5, "y": -8.3, "text": "−1/2<a<0: all quadrants"}],
        },
    },
]


BATCH8_CASES = [
    {
        "caseId": "h1-21-gangnam-2final-q16-lens-rational-asymptotes",
        "sourceJsPath": "original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js",
        "id": 16,
        "assetRef": "assets/images/21_강남여고_2학기_기말_고1_기출/q16-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "1/x+1/y=1/4 gives y=4+16/(x-4), asymptotes x=4,y=4 and a+b=8",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 520,
            "xRange": [-6, 12], "yRange": [-16, 32],
            "asymptotes": [{"x": 4, "label": "x=4"}, {"y": 4, "label": "y=4"}],
            "curves": [
                {"points": [{"x": -6, "y": 2.4}, {"x": -4, "y": 2}, {"x": 0, "y": 0}, {"x": 2, "y": -4}, {"x": 3, "y": -12}]},
                {"points": [{"x": 5, "y": 20}, {"x": 6, "y": 12}, {"x": 8, "y": 8}, {"x": 12, "y": 6}]},
            ],
            "points": [{"x": 0, "y": 0, "label": "O"}],
            "annotations": [{"x": -5.5, "y": 27, "text": "y=4+16/(x−4)"}, {"x": -5.5, "y": -13.5, "text": "asymptotes x=4, y=4"}],
        },
    },
    {
        "caseId": "h1-21-gangnam-2final-q28-rational-interval-extrema",
        "sourceJsPath": "original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js",
        "id": 28,
        "assetRef": "assets/images/21_강남여고_2학기_기말_고1_기출/q28-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "passing (-2,-4) gives f=-2/(x+4)-3 on [-3,6], m=-5 at -3 and M=-16/5 at 6",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 500,
            "xRange": [-4.5, 7], "yRange": [-6, 1],
            "asymptotes": [{"x": -4, "label": "x=−4"}, {"y": -3, "label": "y=−3"}],
            "curves": [{"points": [{"x": -3, "y": -5}, {"x": -2, "y": -4}, {"x": 0, "y": -3.5}, {"x": 2, "y": -3.333333}, {"x": 6, "y": -3.2}]}],
            "points": [{"x": -3, "y": -5, "label": "m"}, {"x": -2, "y": -4, "label": "P"}, {"x": 6, "y": -3.2, "label": "M"}],
            "annotations": [{"x": -4.35, "y": 0.2, "text": "f=−2/(x+4)−3"}, {"x": -4.35, "y": -5.6, "text": "−3≤x≤6, M×m=16"}],
        },
    },
    {
        "caseId": "h1-21-suncheon-2final-q02-rational-asymptotes",
        "sourceJsPath": "original/high/h1/2final/21_순천고_2학기_기말_고1_기출.js",
        "id": 2,
        "assetRef": "assets/images/21_순천고_2학기_기말_고1_기출/q02-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=(3x+2)/(x-2)=3+8/(x-2), asymptotes x=2,y=3 and ab=6",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 520,
            "xRange": [-6, 8], "yRange": [-16, 24],
            "asymptotes": [{"x": 2, "label": "x=2"}, {"y": 3, "label": "y=3"}],
            "curves": [
                {"points": [{"x": -6, "y": 2}, {"x": -2, "y": 1}, {"x": 0, "y": -1}, {"x": 1, "y": -5}, {"x": 1.5, "y": -13}]},
                {"points": [{"x": 2.5, "y": 19}, {"x": 3, "y": 11}, {"x": 4, "y": 7}, {"x": 6, "y": 5}, {"x": 8, "y": 4.333333}]},
            ],
            "points": [{"x": -2 / 3, "y": 0, "label": "x-int"}, {"x": 0, "y": -1, "label": "y-int"}],
            "annotations": [{"x": -5.5, "y": 20, "text": "y=3+8/(x−2)"}, {"x": -5.5, "y": -14.2, "text": "a=2, b=3, ab=6"}],
        },
    },
    {
        "caseId": "h1-21-bokseong-2final-q11-radical-line-two-intersections",
        "sourceJsPath": "original/high/h1/2final/21_복성고_2학기_기말_고1_기출.js",
        "id": 11,
        "assetRef": "assets/images/21_복성고_2학기_기말_고1_기출/q11-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=-sqrt(4-2x) and y=-x+9/4 meet twice; 2≤k<5/2",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 500,
            "xRange": [-3, 4], "yRange": [-5, 6],
            "curves": [{"points": [{"x": -3, "y": 3.162278}, {"x": -1, "y": 2.44949}, {"x": 0, "y": 2}, {"x": 1, "y": 1.414214}, {"x": 2, "y": 0}]}],
            "lines": [{"from": {"x": -3, "y": 5.25}, "to": {"x": 4, "y": -1.75}, "label": "y=−x+9/4", "kind": "line"}],
            "points": [{"x": 0.542893, "y": 1.707107, "label": "P"}, {"x": 1.957107, "y": 0.292893, "label": "Q"}],
            "annotations": [{"x": -2.7, "y": 4.8, "text": "y=−√(4−2x)"}, {"x": -2.7, "y": -4.2, "text": "2≤k<5/2: two points"}],
        },
    },
    {
        "caseId": "h1-21-palmas-2final-q20-radical-line-single-intersection",
        "sourceJsPath": "original/high/h1/2final/21_팔마고_2학기_기말_고1_기출.js",
        "id": 20,
        "assetRef": "assets/images/21_팔마고_2학기_기말_고1_기출/q20-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=sqrt(4x-8) and y=x-1 are tangent at (3,2), one-intersection case k=-1",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 500,
            "xRange": [0, 6], "yRange": [-3, 6],
            "curves": [{"points": [{"x": 2, "y": 0}, {"x": 2.25, "y": 1}, {"x": 3, "y": 2}, {"x": 4, "y": 2.828427}, {"x": 6, "y": 4}]}],
            "lines": [{"from": {"x": 0, "y": -1}, "to": {"x": 6, "y": 5}, "label": "y=x−1", "kind": "line"}],
            "points": [{"x": 2, "y": 0, "label": "V"}, {"x": 3, "y": 2, "label": "T"}],
            "annotations": [{"x": 0.25, "y": 5.3, "text": "y=√(4x−8)"}, {"x": 0.25, "y": -2.2, "text": "one point: k=−1"}],
        },
    },
    {
        "caseId": "h1-22-gangnam-2final-q15-rational-symmetry-axes",
        "sourceJsPath": "original/high/h1/2final/22_강남여고_2학기_기말_고1_기출.js",
        "id": 15,
        "assetRef": "assets/images/22_강남여고_2학기_기말_고1_기출/q15-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=(x-1)/(x-2)=1+1/(x-2), center (2,1), axes y=x-1 and y=-x+3",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 520,
            "xRange": [-6, 8], "yRange": [-10, 12],
            "asymptotes": [{"x": 2, "label": "x=2"}, {"y": 1, "label": "y=1"}],
            "curves": [
                {"points": [{"x": -6, "y": 0.875}, {"x": -2, "y": 0.75}, {"x": 0, "y": 0.5}, {"x": 1, "y": 0}, {"x": 1.5, "y": -1}]},
                {"points": [{"x": 2.5, "y": 3}, {"x": 3, "y": 2}, {"x": 4, "y": 1.5}, {"x": 8, "y": 1.166667}]},
            ],
            "lines": [
                {"from": {"x": -6, "y": -7}, "to": {"x": 8, "y": 7}, "label": "y=x−1", "kind": "guide", "dashed": True},
                {"from": {"x": -6, "y": 9}, "to": {"x": 8, "y": -5}, "label": "y=−x+3", "kind": "guide", "dashed": True},
            ],
            "points": [{"x": 2, "y": 1, "label": "C"}, {"x": 1, "y": 0, "label": "x-int"}],
            "annotations": [{"x": -5.5, "y": 10.3, "text": "y=1+1/(x−2)"}, {"x": -5.5, "y": -8.4, "text": "center (2,1), two axes"}],
        },
    },
    {
        "caseId": "h1-22-gangnam-2final-q22-radical-inverse-domain",
        "sourceJsPath": "original/high/h1/2final/22_강남여고_2학기_기말_고1_기출.js",
        "id": 22,
        "assetRef": "assets/images/22_강남여고_2학기_기말_고1_기출/q22-solution.svg",
        "visualKind": "INVERSE_GRAPH",
        "factSummary": "f=sqrt(2x+16)-4 passes origin, a=16; inverse=(x^2)/2+4x with domain x≥-4",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 520,
            "xRange": [-8, 5], "yRange": [-10, 36],
            "curves": [
                {"points": [{"x": -8, "y": -4}, {"x": -6, "y": -2}, {"x": 0, "y": 0}, {"x": 2, "y": 0.472136}, {"x": 4, "y": 0.898979}]},
                {"points": [{"x": -4, "y": -8}, {"x": -3, "y": -7.5}, {"x": -2, "y": -6}, {"x": -1, "y": -3.5}, {"x": 0, "y": 0}, {"x": 2, "y": 10}, {"x": 4, "y": 24}]},
            ],
            "lines": [{"from": {"x": -8, "y": -8}, "to": {"x": 5, "y": 5}, "label": "y=x", "kind": "guide", "dashed": True}],
            "points": [{"x": 0, "y": 0, "label": "O"}, {"x": -4, "y": -8, "label": "V⁻¹"}],
            "annotations": [{"x": -7.5, "y": 31, "text": "f=√(2x+16)−4"}, {"x": -7.5, "y": -9, "text": "f⁻¹=x²/2+4x, x≥−4"}],
        },
    },
    {
        "caseId": "h1-22-maesan-2final-q03-radical-domain-range",
        "sourceJsPath": "original/high/h1/2final/22_매산고_2학기_기말_고1_기출.js",
        "id": 3,
        "assetRef": "assets/images/22_매산고_2학기_기말_고1_기출/q03-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "domain x≥3 and point (5,1) give y=-sqrt(2x-6)+3, range y≤3",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 500,
            "xRange": [1, 9], "yRange": [-6, 5],
            "curves": [{"points": [{"x": 3, "y": 3}, {"x": 4, "y": 1.585786}, {"x": 5, "y": 1}, {"x": 6, "y": 0.55051}, {"x": 9, "y": -0.464102}]}],
            "points": [{"x": 3, "y": 3, "label": "V"}, {"x": 5, "y": 1, "label": "P"}],
            "annotations": [{"x": 1.3, "y": 4.2, "text": "y=−√(2x−6)+3"}, {"x": 1.3, "y": -5, "text": "x≥3, y≤3"}],
        },
    },
    {
        "caseId": "h1-22-hyocheon-2final-q18-radical-domain-range",
        "sourceJsPath": "original/high/h1/2final/22_효천고_2학기_기말_고1_기출.js",
        "id": 18,
        "assetRef": "assets/images/22_효천고_2학기_기말_고1_기출/q18-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=sqrt(6-2x)-1 has endpoint (3,-1), domain x≤3 and range y≥-1",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 500,
            "xRange": [-7, 5], "yRange": [-2, 8],
            "curves": [{"points": [{"x": -7, "y": 3.472136}, {"x": -3, "y": 2.464102}, {"x": 0, "y": 1.44949}, {"x": 2, "y": 0.414214}, {"x": 3, "y": -1}]}],
            "points": [{"x": 3, "y": -1, "label": "V"}],
            "annotations": [{"x": -6.5, "y": 7.2, "text": "y=√(6−2x)−1"}, {"x": -6.5, "y": -1.7, "text": "x≤3, y≥−1"}],
        },
    },
    {
        "caseId": "h1-22-palmas-2final-q08-rational-line-min-distance",
        "sourceJsPath": "original/high/h1/2final/22_팔마고_2학기_기말_고1_기출.js",
        "id": 8,
        "assetRef": "assets/images/22_팔마고_2학기_기말_고1_기출/q08-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=(x+1)/(x-1)=1+2/(x-1), line y=x at k=0 gives minimum distance 4",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 520,
            "xRange": [-5, 6], "yRange": [-8, 10],
            "asymptotes": [{"x": 1, "label": "x=1"}, {"y": 1, "label": "y=1"}],
            "curves": [
                {"points": [{"x": -5, "y": 0.666667}, {"x": -1, "y": 0}, {"x": 0, "y": -1}, {"x": 0.5, "y": -3}]},
                {"points": [{"x": 1.5, "y": 5}, {"x": 2.414214, "y": 2.414214}, {"x": 3, "y": 2}, {"x": 6, "y": 1.4}]},
            ],
            "lines": [{"from": {"x": -5, "y": -5}, "to": {"x": 6, "y": 6}, "label": "y=x (k=0)", "kind": "line"}],
            "points": [{"x": -0.414214, "y": -0.414214, "label": "P"}, {"x": 2.414214, "y": 2.414214, "label": "Q"}],
            "annotations": [{"x": -4.6, "y": 8.4, "text": "y=(x+1)/(x−1)"}, {"x": -4.6, "y": -6.8, "text": "minimum distance PQ=4"}],
        },
    },
]


BATCH9_CASES = [
    {
        "caseId": "h1-21-gangnam-2final-q14-transformed-rational-asymptotes",
        "sourceJsPath": "original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js",
        "id": 14,
        "assetRef": "assets/images/21_강남여고_2학기_기말_고1_기출/q14-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "f(x)=-x+6 from f(1)=5 and f(4)=2; transformed graph y=(11-x)/(x-4)=-1+7/(x-4)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 520,
            "xRange": [-6, 10], "yRange": [-16, 16],
            "asymptotes": [{"x": 4, "label": "x=4"}, {"y": -1, "label": "y=−1"}],
            "curves": [
                {"points": [{"x": -6, "y": -1.7}, {"x": -2, "y": -2.166667}, {"x": 0, "y": -2.75}, {"x": 2, "y": -4.5}, {"x": 3.5, "y": -15}]},
                {"points": [{"x": 4.5, "y": 13}, {"x": 5, "y": 6}, {"x": 6, "y": 2.5}, {"x": 8, "y": 0.75}, {"x": 10, "y": 0.166667}]},
            ],
            "points": [{"x": 4, "y": -1, "label": "asymptote-center"}],
            "annotations": [{"x": -5.5, "y": 13.5, "text": "g(x)=−1+7/(x−4)"}, {"x": -5.5, "y": -13.5, "text": "f(3)=3"}],
        },
    },
    {
        "caseId": "h1-21-bokseong-2final-q22-radical-coordinate-triangle",
        "sourceJsPath": "original/high/h1/2final/21_복성고_2학기_기말_고1_기출.js",
        "id": 22,
        "assetRef": "assets/images/21_복성고_2학기_기말_고1_기출/q22-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "at t=1, A=(1,3) on y=3sqrt(x), B=(1,1), C=(9,3) on y=sqrt(x), AB:AC=1:4 and area 8",
        "spec": {
            "version": "0.1", "type": "coordinate_plane", "width": 620, "height": 520,
            "xRange": [-1, 10], "yRange": [-1, 10],
            "curves": [{"points": [{"x": 0, "y": 0}, {"x": 1, "y": 1}, {"x": 4, "y": 2}, {"x": 9, "y": 3}]}, {"points": [{"x": 0, "y": 0}, {"x": 1, "y": 3}, {"x": 4, "y": 6}, {"x": 9, "y": 9}]}],
            "segments": [{"from": {"x": 1, "y": 1}, "to": {"x": 1, "y": 3}, "label": "AB=2", "kind": "segment"}, {"from": {"x": 1, "y": 3}, "to": {"x": 9, "y": 3}, "label": "AC=8", "kind": "segment"}],
            "points": [{"x": 1, "y": 3, "label": "A"}, {"x": 1, "y": 1, "label": "B"}, {"x": 9, "y": 3, "label": "C"}],
            "annotations": [{"x": 0.3, "y": 9.7, "text": "y=3√x"}, {"x": 5.2, "y": 2.2, "text": "y=√x, area=8"}],
        },
    },
    {
        "caseId": "h1-22-gangnam-2final-q18-radical-vertical-differences",
        "sourceJsPath": "original/high/h1/2final/22_강남여고_2학기_기말_고1_기출.js",
        "id": 18,
        "assetRef": "assets/images/22_강남여고_2학기_기말_고1_기출/q18-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "P_k=(k,sqrt(k+1)), Q_k=(k,sqrt(k)); telescoping sum k=1..31 equals 4sqrt(2)-1",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 500,
            "xRange": [0, 6], "yRange": [0, 4],
            "curves": [{"points": [{"x": 0, "y": 1}, {"x": 1, "y": 1.414214}, {"x": 2, "y": 1.732051}, {"x": 3, "y": 2}, {"x": 6, "y": 2.645751}]}, {"points": [{"x": 0, "y": 0}, {"x": 1, "y": 1}, {"x": 2, "y": 1.414214}, {"x": 3, "y": 1.732051}, {"x": 6, "y": 2.44949}]}],
            "segments": [{"from": {"x": 1, "y": 1}, "to": {"x": 1, "y": 1.414214}, "label": "P₁Q₁", "kind": "segment"}, {"from": {"x": 2, "y": 1.414214}, "to": {"x": 2, "y": 1.732051}, "label": "P₂Q₂", "kind": "segment"}],
            "points": [{"x": 1, "y": 1.414214, "label": "P₁"}, {"x": 1, "y": 1, "label": "Q₁"}, {"x": 2, "y": 1.732051, "label": "P₂"}, {"x": 2, "y": 1.414214, "label": "Q₂"}],
            "annotations": [{"x": 0.3, "y": 3.6, "text": "√(x+1)−√x"}, {"x": 3.2, "y": 0.4, "text": "sum=√32−1=4√2−1"}],
        },
    },
    {
        "caseId": "h1-22-maesan-2final-q19-rational-line-triangle",
        "sourceJsPath": "original/high/h1/2final/22_매산고_2학기_기말_고1_기출.js",
        "id": 19,
        "assetRef": "assets/images/22_매산고_2학기_기말_고1_기출/q19-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "k=-5 from y=-5/x and y=x+6 intersections P=(-5,1), Q=(-1,5), triangle OPQ area 12",
        "spec": {
            "version": "0.1", "type": "coordinate_plane", "width": 620, "height": 520,
            "xRange": [-8, 4], "yRange": [-8, 14],
            "asymptotes": [{"x": 0, "label": "x=0"}, {"y": 0, "label": "y=0"}],
            "curves": [{"points": [{"x": -8, "y": 0.625}, {"x": -5, "y": 1}, {"x": -1, "y": 5}]}, {"points": [{"x": 1, "y": -5}, {"x": 2, "y": -2.5}, {"x": 4, "y": -1.25}]}],
            "lines": [{"from": {"x": -8, "y": -2}, "to": {"x": 4, "y": 10}, "label": "y=x+6", "kind": "line"}],
            "segments": [{"from": {"x": 0, "y": 0}, "to": {"x": -5, "y": 1}, "label": "OP", "kind": "segment"}, {"from": {"x": 0, "y": 0}, "to": {"x": -1, "y": 5}, "label": "OQ", "kind": "segment"}],
            "points": [{"x": -5, "y": 1, "label": "P"}, {"x": -1, "y": 5, "label": "Q"}, {"x": 0, "y": 0, "label": "O"}],
            "annotations": [{"x": -7.5, "y": 12.2, "text": "y=−5/x"}, {"x": -7.5, "y": -6.5, "text": "area OPQ=12"}],
        },
    },
    {
        "caseId": "h1-22-hyocheon-2final-q04-rational-symmetry-axes",
        "sourceJsPath": "original/high/h1/2final/22_효천고_2학기_기말_고1_기출.js",
        "id": 4,
        "assetRef": "assets/images/22_효천고_2학기_기말_고1_기출/q04-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "y=(2-5x)/(x-1)=-5-3/(x-1), center (1,-5), axes y=x-6 and y=-x-4",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 520,
            "xRange": [-6, 8], "yRange": [-12, 12],
            "asymptotes": [{"x": 1, "label": "x=1"}, {"y": -5, "label": "y=−5"}],
            "curves": [{"points": [{"x": -6, "y": -4.571429}, {"x": -2, "y": -4}, {"x": 0, "y": -2}, {"x": 0.5, "y": 1}]}, {"points": [{"x": 1.5, "y": -11}, {"x": 2, "y": -8}, {"x": 3, "y": -6.5}, {"x": 8, "y": -5.428571}]}],
            "lines": [{"from": {"x": -6, "y": -12}, "to": {"x": 8, "y": 2}, "label": "y=x−6", "kind": "guide", "dashed": True}, {"from": {"x": -6, "y": 2}, "to": {"x": 8, "y": -12}, "label": "y=−x−4", "kind": "guide", "dashed": True}],
            "points": [{"x": 1, "y": -5, "label": "C"}],
            "annotations": [{"x": -5.5, "y": 10.2, "text": "y=−5−3/(x−1)"}, {"x": -5.5, "y": -9.7, "text": "a+b=−10"}],
        },
    },
    {
        "caseId": "h1-22-hyocheon-2final-q05-radical-inverse-point",
        "sourceJsPath": "original/high/h1/2final/22_효천고_2학기_기말_고1_기출.js",
        "id": 5,
        "assetRef": "assets/images/22_효천고_2학기_기말_고1_기출/q05-solution.svg",
        "visualKind": "INVERSE_GRAPH",
        "factSummary": "inverse point (5,3) corresponds to original point (3,5), giving a=22 for y=sqrt(x+22)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 520,
            "xRange": [-23, 6], "yRange": [-25, 15],
            "curves": [{"points": [{"x": -22, "y": 0}, {"x": -18, "y": 2}, {"x": -13, "y": 3}, {"x": -6, "y": 4}, {"x": 3, "y": 5}, {"x": 6, "y": 5.291503}]}, {"points": [{"x": 0, "y": -22}, {"x": 1, "y": -21}, {"x": 3, "y": -13}, {"x": 5, "y": 3}, {"x": 6, "y": 14}]}],
            "lines": [{"from": {"x": -23, "y": -23}, "to": {"x": 6, "y": 6}, "label": "y=x", "kind": "guide", "dashed": True}],
            "points": [{"x": -22, "y": 0, "label": "V"}, {"x": 3, "y": 5, "label": "P"}, {"x": 5, "y": 3, "label": "P⁻¹"}],
            "annotations": [{"x": -22.5, "y": 12, "text": "y=√(x+22)"}, {"x": -22.5, "y": -20.5, "text": "a=22, inverse point (5,3)"}],
        },
    },
    {
        "caseId": "h1-22-palmas-2final-q16-radical-area",
        "sourceJsPath": "original/high/h1/2final/22_팔마고_2학기_기말_고1_기출.js",
        "id": 16,
        "assetRef": "assets/images/22_팔마고_2학기_기말_고1_기출/q16-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "f=sqrt(x+2)+5 and g=sqrt(2-x)-5 on [-2,2], symmetric excesses cancel and area is 40",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 500,
            "xRange": [-3, 3], "yRange": [-6, 8],
            "curves": [{"points": [{"x": -2, "y": 5}, {"x": -1, "y": 6}, {"x": 0, "y": 6.414214}, {"x": 1, "y": 6.732051}, {"x": 2, "y": 7}]}, {"points": [{"x": -2, "y": -3}, {"x": -1, "y": -3.267949}, {"x": 0, "y": -3.585786}, {"x": 1, "y": -4}, {"x": 2, "y": -5}]}],
            "segments": [{"from": {"x": -2, "y": -3}, "to": {"x": -2, "y": 5}, "label": "x=−2", "kind": "segment"}, {"from": {"x": 2, "y": -5}, "to": {"x": 2, "y": 7}, "label": "x=2", "kind": "segment"}],
            "points": [{"x": -2, "y": 5, "label": "f-end"}, {"x": 2, "y": -5, "label": "g-end"}],
            "annotations": [{"x": -2.8, "y": 7.5, "text": "f=√(x+2)+5"}, {"x": -2.8, "y": -5.6, "text": "g=√(2−x)−5, area=40"}],
        },
    },
    {
        "caseId": "h1-23-geumdang-2final-q08-radical-quadratic-inverse",
        "sourceJsPath": "original/high/h1/2final/23_금당고_2학기_기말_고1_기출.js",
        "id": 8,
        "assetRef": "assets/images/23_금당고_2학기_기말_고1_기출/q08-solution.svg",
        "visualKind": "INVERSE_GRAPH",
        "factSummary": "f=(x-1/2)^2+1/2 for x≥1/2, inverse=1/2+sqrt(x-1/2), intersections (1/2,1/2),(3/2,3/2)",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 500,
            "xRange": [0, 4], "yRange": [0, 12],
            "curves": [{"points": [{"x": 0.5, "y": 0.5}, {"x": 1, "y": 0.75}, {"x": 1.5, "y": 1.5}, {"x": 2, "y": 2.75}, {"x": 3, "y": 6.75}]}, {"points": [{"x": 0.5, "y": 0.5}, {"x": 1, "y": 1.207107}, {"x": 1.5, "y": 1.5}, {"x": 2, "y": 1.724745}, {"x": 3, "y": 2.081139}]}],
            "lines": [{"from": {"x": 0, "y": 0}, "to": {"x": 4, "y": 4}, "label": "y=x", "kind": "guide", "dashed": True}],
            "points": [{"x": 0.5, "y": 0.5, "label": "P"}, {"x": 1.5, "y": 1.5, "label": "Q"}],
            "annotations": [{"x": 0.25, "y": 10.8, "text": "f=(x−1/2)²+1/2"}, {"x": 0.25, "y": 9.2, "text": "PQ=√2"}],
        },
    },
    {
        "caseId": "h1-22-hyocheon-2final-q15-rational-quadrants-condition",
        "sourceJsPath": "original/high/h1/2final/22_효천고_2학기_기말_고1_기출.js",
        "id": 15,
        "assetRef": "assets/images/22_효천고_2학기_기말_고1_기출/q15-solution.svg",
        "visualKind": "RATIONAL_GRAPH",
        "factSummary": "representative k=1/3: first y=-5/(3(x+4))+1/3 passes all quadrants, second y=2-5/(3(x+1)) avoids QIV; 0≤k<2/3",
        "spec": {
            "version": "0.1", "type": "simple_function_graph", "width": 620, "height": 520,
            "xRange": [-8, 8], "yRange": [-10, 10],
            "asymptotes": [{"x": -4, "label": "f: x=−4"}, {"y": 1 / 3, "label": "f: y=1/3"}, {"x": -1, "label": "g: x=−1"}, {"y": 2, "label": "g: y=2"}],
            "curves": [
                {"points": [{"x": -8, "y": 0.75}, {"x": -6, "y": 1.166667}, {"x": -5, "y": 2}, {"x": -3, "y": -1.333333}, {"x": -2, "y": -0.5}, {"x": 0, "y": -0.083333}, {"x": 0.5, "y": -0.037037}, {"x": 2, "y": 0.055556}, {"x": 8, "y": 0.194444}]},
                {"points": [{"x": -8, "y": 2.238095}, {"x": -3, "y": 2.833333}, {"x": -2, "y": 3.666667}, {"x": -1.5, "y": 5.333333}]},
                {"points": [{"x": -0.5, "y": -1.333333}, {"x": 0, "y": 0.333333}, {"x": 1, "y": 1.166667}, {"x": 3, "y": 1.583333}, {"x": 8, "y": 1.814815}]},
            ],
            "points": [{"x": 0.5, "y": -0.037037, "label": "f-QIV"}, {"x": -3, "y": -1.333333, "label": "f-QIII"}, {"x": 0, "y": 0.333333, "label": "g-QI"}],
            "annotations": [{"x": -7.5, "y": 8.5, "text": "k=1/3, f: all quadrants"}, {"x": -7.5, "y": -8.5, "text": "g: no QIV, 0≤k<2/3"}],
        },
    },
    {
        "caseId": "h1-21-suncheon-2final-q09-radical-sign-cases",
        "sourceJsPath": "original/high/h1/2final/21_순천고_2학기_기말_고1_기출.js",
        "id": 9,
        "assetRef": "assets/images/21_순천고_2학기_기말_고1_기출/q09-solution.svg",
        "visualKind": "RADICAL_GRAPH",
        "factSummary": "y=-sqrt(ax): a=1 gives the fourth-quadrant branch x≥0; a=-1 gives the third-quadrant branch x≤0, both through origin",
        "spec": {
            "version": "0.1", "type": "coordinate_plane", "width": 620, "height": 500,
            "xRange": [-4, 4], "yRange": [-3, 3],
            "curves": [{"points": [{"x": 0, "y": 0}, {"x": 1, "y": -1}, {"x": 4, "y": -2}]}, {"points": [{"x": -4, "y": -2}, {"x": -1, "y": -1}, {"x": 0, "y": 0}]}],
            "points": [{"x": 0, "y": 0, "label": "O"}, {"x": 1, "y": -1, "label": "a=1"}, {"x": -1, "y": -1, "label": "a=−1"}],
            "annotations": [{"x": -3.7, "y": 2.4, "text": "a=1: y=−√x"}, {"x": -3.7, "y": -2.6, "text": "a=−1: y=−√(−x)"}],
        },
    },
]


def fact_hash(case: dict) -> str:
    payload = json.dumps({"caseId": case["caseId"], "factSummary": case["factSummary"], "spec": case["spec"]}, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def _close(actual: float, expected: float, label: str, tolerance: float = 2e-5) -> None:
    if abs(actual - expected) > tolerance:
        raise AssertionError(f"{label}: {actual} != {expected}")


def _check_curve(curve: dict, fn, label: str) -> None:
    for index, point in enumerate(curve["points"]):
        x, y = float(point["x"]), float(point["y"])
        _close(y, fn(x), f"{label}[{index}]")


def validate_math(case: dict) -> None:
    curves = case["spec"].get("curves", [])
    case_id = case["caseId"]
    if case_id == "h1-21-gangnam-2final-q23-inverse-area":
        _check_curve(curves[0], lambda x: 2 * (x + 5) ** 0.5 + 3, "inverse.f")
        _check_curve(curves[1], lambda x: (x - 3) ** 2 / 4 - 5, "inverse.finverse")
        for point in case["spec"]["points"]:
            _close(point["x"], point["y"], f"inverse.y=x.{point['label']}") if point["label"] == "A" else None
    elif case_id == "h1-21-gangnam-2final-q29-absolute-radical-three-intersections":
        _check_curve(curves[0], lambda x: 0, "absolute.left")
        _check_curve(curves[1], lambda x: (2 * x) ** 0.5, "absolute.radical")
        _check_curve(curves[2], lambda x: x + 0.25, "absolute.line")
    elif case_id == "h1-25-suncheon-2final-q17-absolute-radical-minimum-slope":
        _check_curve(curves[0], lambda x: abs((2 * x + 2) ** 0.5 - 2), "minimum.left")
        _check_curve(curves[1], lambda x: abs((2 * x + 2) ** 0.5 - 2), "minimum.right")
        _check_curve(curves[2], lambda x: -0.5 * x + 1.5, "minimum.line")
    elif case_id == "h1-25-suncheon-2final-q23-piecewise-four-intersections":
        _check_curve(curves[0], lambda x: 2 - (1 - x) ** 0.5, "piecewise.left")
        _check_curve(curves[1], lambda x: (x - 2) ** 0.5 + 3, "piecewise.right")
        _check_curve(curves[2], lambda x: x + 1, "piecewise.line")
    elif case_id == "h1-25-hyocheon-2final-q18-rational-circle-two-intersections":
        _check_curve(curves[0], lambda x: 3 + 1 / (x - 2), "circle.hyperbola.left")
        _check_curve(curves[1], lambda x: 3 + 1 / (x - 2), "circle.hyperbola.right")
        for point in case["spec"]["points"]:
            if point["label"] in {"P", "Q"}:
                _close((point["x"] - 2) * (point["y"] - 3), 1, f"circle.hyperbola.{point['label']}")
                _close((point["x"] - 2) ** 2 + (point["y"] - 3) ** 2, 2, f"circle.radius.{point['label']}", 5e-5)
    elif case_id == "h1-24-geumdang-2final-q03-rational-asymptotes":
        _check_curve(curves[0], lambda x: 1 / (x + 2) + 2, "q03.left")
        _check_curve(curves[1], lambda x: 1 / (x + 2) + 2, "q03.right")
    elif case_id == "h1-24-geumdang-2final-q05-radical-minimum":
        _check_curve(curves[0], lambda x: (2 - x) ** 0.5 + 3, "q05.radical")
    elif case_id == "h1-25-palmas-2final-q04-rational-quadrants":
        _check_curve(curves[0], lambda x: 5 / (3 - x) - 2, "q04.left")
        _check_curve(curves[1], lambda x: 5 / (3 - x) - 2, "q04.right")
    elif case_id == "h1-25-palmas-2final-q06-rational-inverse-value":
        _check_curve(curves[0], lambda x: (4 * x + 5) / (x + 1), "q06.left")
        _check_curve(curves[1], lambda x: (4 * x + 5) / (x + 1), "q06.right")
    elif case_id == "h1-25-jeil-2final-q11-radical-quadrants":
        _check_curve(curves[0], lambda x: (-x - 1) ** 0.5 - 1, "q11.radical")
    elif case_id == "h1-25-jeil-2final-q13-rational-properties":
        _check_curve(curves[0], lambda x: -x / (x - 1), "q13.left")
        _check_curve(curves[1], lambda x: -x / (x - 1), "q13.right")
    elif case_id == "h1-23-gangnam-2final-q05-positive-reciprocal":
        _check_curve(curves[0], lambda x: 4 / x, "q05.negative")
        _check_curve(curves[1], lambda x: 4 / x, "q05.positive")
    elif case_id == "h1-23-geumdang-2final-q07-rational-symmetry":
        _check_curve(curves[0], lambda x: (x + 1) / (1 - x), "q07.left")
        _check_curve(curves[1], lambda x: (x + 1) / (1 - x), "q07.right")
    elif case_id == "h1-24-gangnam-2final-q06-translated-radical":
        _check_curve(curves[0], lambda x: (6 - 3 * x) ** 0.5 + 1, "q06.radical")
    elif case_id == "h1-25-suncheon-2final-q18-rational-circle-distance":
        _check_curve(curves[0], lambda x: 1 / (x - 1) + 2, "q18.hyperbola")
        for point in case["spec"]["points"]:
            _close((point["x"] - 1) * (point["y"] - 2), 1, f"q18.hyperbola.{point['label']}", 5e-5)
            _close((point["x"] - 1) ** 2 + (point["y"] - 2) ** 2, 9, f"q18.circle.{point['label']}", 5e-5)
    elif case_id == "h1-24-geumdang-2final-q10-radical-two-intersections":
        _check_curve(curves[0], lambda x: -(2 - 2 * x) ** 0.5, "q10.radical")
        _check_curve(curves[1], lambda x: x - 1.4, "q10.line")
    elif case_id == "h1-25-geumdang-2final-q22-radical-two-intersections":
        _check_curve(curves[0], lambda x: (x - 2) ** 0.5, "q22.radical")
        _check_curve(curves[1], lambda x: x - 1.9, "q22.line")
    elif case_id == "h1-25-palmas-2final-q23-radical-line-range":
        _check_curve(curves[0], lambda x: (2 - 3 * x) ** 0.5, "palma23.radical")
        _check_curve(curves[1], lambda x: -0.5 * x + 1, "palma23.line")
    elif case_id == "h1-25-jeil-2final-q20-inverse-intersection":
        _check_curve(curves[0], lambda x: (x + 2) ** 0.5, "jeil20.f")
        _check_curve(curves[1], lambda x: x ** 2 - 2, "jeil20.finverse")
    elif case_id == "h1-24-geumdang-2final-q11-radical-chord-slope":
        _check_curve(curves[0], lambda x: 3 * x ** 0.5, "geumdang11.radical")
    elif case_id == "h1-24-geumdang-2final-q16-rational-area-minimum":
        _check_curve(curves[0], lambda x: 2 / x, "geumdang16.rational")
    elif case_id == "h1-23-gangnam-2final-q24-radical-line-slope-range":
        _check_curve(curves[0], lambda x: (3 * x - 3) ** 0.5, "gangnam24.radical")
    elif case_id == "h1-24-maesan-2final-q23-inverse-area":
        _check_curve(curves[0], lambda x: (3 * x + 4) ** 0.5, "maesan23.f")
        _check_curve(curves[1], lambda x: (x ** 2 - 4) / 3, "maesan23.finverse")
    elif case_id == "h1-25-hyocheon-2final-q08-radical-quadrants":
        _check_curve(curves[0], lambda x: -(2 - x) ** 0.5 + 4, "hyocheon08.radical")
    elif case_id == "h1-25-hyocheon-2final-q11-radical-inverse-point":
        _check_curve(curves[0], lambda x: (2 * x - 5) ** 0.5 + 2, "hyocheon11.f")
        _check_curve(curves[1], lambda x: (x - 2) ** 2 / 2 + 2.5, "hyocheon11.finverse")
    elif case_id == "h1-25-palmas-2final-q11-inverse-tangent":
        _check_curve(curves[0], lambda x: x ** 2 - 6 * x + 49 / 4, "palma11.f")
        _check_curve(curves[1], lambda x: 3 + (x - 13 / 4) ** 0.5, "palma11.finverse")
    elif case_id == "h1-21-bokseong-2final-q03-rational-asymptotes":
        _check_curve(curves[0], lambda x: (-4 * x + 8) / (2 * x - 3), "bokseong03.left")
        _check_curve(curves[1], lambda x: (-4 * x + 8) / (2 * x - 3), "bokseong03.right")
    elif case_id == "h1-21-gangnam-2final-q03-rational-center":
        _check_curve(curves[0], lambda x: (2 * x - 3) / (x - 1), "gangnam03.left")
        _check_curve(curves[1], lambda x: (2 * x - 3) / (x - 1), "gangnam03.right")
    elif case_id == "h1-21-suncheon-2final-q08-radical-line-range":
        _check_curve(curves[0], lambda x: (2 * x + 4) ** 0.5, "suncheon08.radical")
        _check_curve(curves[1], lambda x: x + 2.2, "suncheon08.line")
    elif case_id == "h1-21-suncheon-2final-q11-radical-inverse-distance":
        _check_curve(curves[0], lambda x: (x - 3) ** 0.5 + 3, "suncheon11.f")
        _check_curve(curves[1], lambda x: (x - 3) ** 2 + 3, "suncheon11.finverse")
    elif case_id == "h1-21-geumdang-2final-q08-inverse-point":
        _check_curve(curves[0], lambda x: (x - 3) ** 2 + 1, "geumdang08.f")
        _check_curve(curves[1], lambda x: 3 + (x - 1) ** 0.5, "geumdang08.finverse")
    elif case_id == "h1-21-geumdang-2final-q04-radical-translation":
        _check_curve(curves[0], lambda x: (2 - 2 * x) ** 0.5 + 4, "geumdang04.radical")
    elif case_id == "h1-21-palmas-2final-q05-rational-inverse-translation":
        _check_curve(curves[0], lambda x: 3 + 7 / (x - 2), "palma05.f")
        _check_curve(curves[1], lambda x: 3 + 7 / (x - 2), "palma05.f.right")
        _check_curve(curves[2], lambda x: 2 + 7 / (x - 3), "palma05.finverse.left")
        _check_curve(curves[3], lambda x: 2 + 7 / (x - 3), "palma05.finverse.right")
    elif case_id == "h1-21-hyocheon-2final-q11-rational-quadrants-count":
        _check_curve(curves[0], lambda x: 3 / (x - 1) + 2, "hyocheon11.rational.left")
        _check_curve(curves[1], lambda x: 3 / (x - 1) + 2, "hyocheon11.rational.right")
    elif case_id == "h1-21-palmas-2final-q03-rational-properties":
        _check_curve(curves[0], lambda x: (-3 * x + 2) / (x + 1), "palma03.left")
        _check_curve(curves[1], lambda x: (-3 * x + 2) / (x + 1), "palma03.right")
    elif case_id == "h1-21-palmas-2final-q04-radical-inverse":
        _check_curve(curves[0], lambda x: -( -2 * x + 1) ** 0.5 + 2, "palma04.radical")
    elif case_id == "h1-21-jeil-2final-q05-radical-properties":
        _check_curve(curves[0], lambda x: -(4 - 4 * x) ** 0.5 + 3, "jeil05.radical")
    elif case_id == "h1-21-jeil-2final-q04-rational-properties":
        _check_curve(curves[0], lambda x: (2 * x + 1) / (x + 3), "jeil04.left")
        _check_curve(curves[1], lambda x: (2 * x + 1) / (x + 3), "jeil04.right")
    elif case_id == "h1-21-suncheon-2final-q18-rational-circle-ratio":
        _check_curve(curves[0], lambda x: 1.5 / x, "suncheon18.rational")
        for point in case["spec"]["points"]:
            _close(point["x"] ** 2 + point["y"] ** 2, 5, f"suncheon18.circle.{point['label']}", 5e-5)
            _close(point["x"] * point["y"], 1.5, f"suncheon18.hyperbola.{point['label']}", 5e-5)
    elif case_id == "h1-21-bokseong-2final-q04-radical-domain-range":
        _check_curve(curves[0], lambda x: -(4 - 2 * x) ** 0.5 + 4, "bokseong04.radical")
    elif case_id == "h1-21-bokseong-2final-q12-radical-inverse-tangent":
        _check_curve(curves[0], lambda x: 2 * (x - 4) ** 0.5 + 3, "bokseong12.f")
        _check_curve(curves[1], lambda x: (x - 3) ** 2 / 4 + 4, "bokseong12.finverse")
    elif case_id == "h1-21-gangnam-2final-q17-rational-line-distance":
        _check_curve(curves[0], lambda x: 1 / (x - 1), "gangnam17.rational")
        _check_curve(curves[1], lambda x: -4 * x, "gangnam17.line")
    elif case_id == "h1-25-hyocheon-2final-q12-rational-symmetry-axes":
        _check_curve(curves[0], lambda x: 3 - 1 / (x + 2), "hyocheon12.left")
        _check_curve(curves[1], lambda x: 3 - 1 / (x + 2), "hyocheon12.right")
        for item, fn, label in ((case["spec"]["lines"][0], lambda x: x + 5, "hyocheon12.axis.plus"), (case["spec"]["lines"][1], lambda x: -x + 1, "hyocheon12.axis.minus")):
            _check_curve({"points": [item["from"], item["to"]]}, fn, label)
        _close(case["spec"]["points"][0]["x"], -2, "hyocheon12.center.x")
        _close(case["spec"]["points"][0]["y"], 3, "hyocheon12.center.y")
    elif case_id == "h1-22-palmas-2final-q12-radical-line-tangent":
        _check_curve(curves[0], lambda x: -(x - 5) ** 0.5, "palma22q12.radical")
        _check_curve({"points": [case["spec"]["lines"][0]["from"], case["spec"]["lines"][0]["to"]]}, lambda x: -x + 19 / 4, "palma22q12.line")
        _close(case["spec"]["points"][1]["x"], 21 / 4, "palma22q12.tangent.x")
        _close(case["spec"]["points"][1]["y"], -1 / 2, "palma22q12.tangent.y")
    elif case_id == "h1-22-jeil-2final-q09-radical-line-two-intersections":
        _check_curve(curves[0], lambda x: (2 - x) ** 0.5, "jeil22q09.radical")
        _check_curve({"points": [case["spec"]["lines"][0]["from"], case["spec"]["lines"][0]["to"]]}, lambda x: -x + 17 / 8, "jeil22q09.line")
        for point in case["spec"]["points"]:
            _close(point["y"], (2 - point["x"]) ** 0.5, f"jeil22q09.point.{point['label']}")
            _close(point["y"], -point["x"] + 17 / 8, f"jeil22q09.line.{point['label']}")
    elif case_id == "h1-22-suncheon-girls-2final-q07-rational-quadrants":
        _check_curve(curves[0], lambda x: -2 + 3 / (x + 1), "suncheon22q07.left")
        _check_curve(curves[1], lambda x: -2 + 3 / (x + 1), "suncheon22q07.right")
    elif case_id == "h1-22-suncheon-girls-2final-q08-rational-line-no-intersection":
        _check_curve(curves[0], lambda x: x / (x - 2), "suncheon22q08.left")
        _check_curve(curves[1], lambda x: x / (x - 2), "suncheon22q08.right")
        _check_curve({"points": [case["spec"]["lines"][0]["from"], case["spec"]["lines"][0]["to"]]}, lambda x: -2 * x + 8, "suncheon22q08.line")
    elif case_id == "h1-22-bokseong-2final-q07-radical-domain-range":
        _check_curve(curves[0], lambda x: -(2 * x + 3) ** 0.5 + 2, "bokseong22q07.radical")
    elif case_id == "h1-22-geumdang-2final-q01-rational-asymptotes":
        _check_curve(curves[0], lambda x: 2 / (x - 2) - 1, "geumdang22q01.left")
        _check_curve(curves[1], lambda x: 2 / (x - 2) - 1, "geumdang22q01.right")
    elif case_id == "h1-22-gangnam-2final-q11-radical-inverse-intersections":
        _check_curve(curves[0], lambda x: (x - 1) ** 0.5 + 1, "gangnam22q11.f")
        _check_curve(curves[1], lambda x: (x - 1) ** 2 + 1, "gangnam22q11.finverse")
        for point in case["spec"]["points"]:
            _close(point["x"], point["y"], f"gangnam22q11.diagonal.{point['label']}")
    elif case_id == "h1-25-suncheon-2final-q13-rational-asymptotes-intercepts":
        _check_curve(curves[0], lambda x: (x + 5) / (x + 3), "suncheon25q13.left")
        _check_curve(curves[1], lambda x: (x + 5) / (x + 3), "suncheon25q13.right")
        _close(case["spec"]["points"][0]["x"], -5, "suncheon25q13.xint.x")
        _close(case["spec"]["points"][0]["y"], 0, "suncheon25q13.xint.y")
    elif case_id == "h1-25-suncheon-2final-q14-rational-all-quadrants":
        _check_curve(curves[0], lambda x: 1 / (2 - x) - 1 / 4, "suncheon25q14.left")
        _check_curve(curves[1], lambda x: 1 / (2 - x) - 1 / 4, "suncheon25q14.right")
    elif case_id == "h1-21-gangnam-2final-q16-lens-rational-asymptotes":
        _check_curve(curves[0], lambda x: 4 + 16 / (x - 4), "gangnam21q16.left")
        _check_curve(curves[1], lambda x: 4 + 16 / (x - 4), "gangnam21q16.right")
    elif case_id == "h1-21-gangnam-2final-q28-rational-interval-extrema":
        _check_curve(curves[0], lambda x: -2 / (x + 4) - 3, "gangnam21q28.rational")
        for point in case["spec"]["points"]:
            _close(point["y"], -2 / (point["x"] + 4) - 3, f"gangnam21q28.point.{point['label']}")
    elif case_id == "h1-21-suncheon-2final-q02-rational-asymptotes":
        _check_curve(curves[0], lambda x: (3 * x + 2) / (x - 2), "suncheon21q02.left")
        _check_curve(curves[1], lambda x: (3 * x + 2) / (x - 2), "suncheon21q02.right")
    elif case_id == "h1-21-bokseong-2final-q11-radical-line-two-intersections":
        _check_curve(curves[0], lambda x: (4 - 2 * x) ** 0.5, "bokseong21q11.radical")
        _check_curve({"points": [case["spec"]["lines"][0]["from"], case["spec"]["lines"][0]["to"]]}, lambda x: -x + 9 / 4, "bokseong21q11.line")
        for point in case["spec"]["points"]:
            _close(point["y"], (4 - 2 * point["x"]) ** 0.5, f"bokseong21q11.radical.{point['label']}")
            _close(point["y"], -point["x"] + 9 / 4, f"bokseong21q11.line.{point['label']}")
    elif case_id == "h1-21-palmas-2final-q20-radical-line-single-intersection":
        _check_curve(curves[0], lambda x: (4 * x - 8) ** 0.5, "palma21q20.radical")
        _check_curve({"points": [case["spec"]["lines"][0]["from"], case["spec"]["lines"][0]["to"]]}, lambda x: x - 1, "palma21q20.line")
        _close(case["spec"]["points"][1]["x"], 3, "palma21q20.tangent.x")
        _close(case["spec"]["points"][1]["y"], 2, "palma21q20.tangent.y")
    elif case_id == "h1-22-gangnam-2final-q15-rational-symmetry-axes":
        _check_curve(curves[0], lambda x: (x - 1) / (x - 2), "gangnam22q15.left")
        _check_curve(curves[1], lambda x: (x - 1) / (x - 2), "gangnam22q15.right")
        for item, fn, label in ((case["spec"]["lines"][0], lambda x: x - 1, "gangnam22q15.axis.plus"), (case["spec"]["lines"][1], lambda x: -x + 3, "gangnam22q15.axis.minus")):
            _check_curve({"points": [item["from"], item["to"]]}, fn, label)
    elif case_id == "h1-22-gangnam-2final-q22-radical-inverse-domain":
        _check_curve(curves[0], lambda x: (2 * x + 16) ** 0.5 - 4, "gangnam22q22.f")
        _check_curve(curves[1], lambda x: x ** 2 / 2 + 4 * x, "gangnam22q22.finverse")
        for point in case["spec"]["points"]:
            if point["label"] == "O":
                _close(point["x"], 0, "gangnam22q22.origin.x")
                _close(point["y"], 0, "gangnam22q22.origin.y")
    elif case_id == "h1-22-maesan-2final-q03-radical-domain-range":
        _check_curve(curves[0], lambda x: -(2 * x - 6) ** 0.5 + 3, "maesan22q03.radical")
    elif case_id == "h1-22-hyocheon-2final-q18-radical-domain-range":
        _check_curve(curves[0], lambda x: (6 - 2 * x) ** 0.5 - 1, "hyocheon22q18.radical")
    elif case_id == "h1-22-palmas-2final-q08-rational-line-min-distance":
        _check_curve(curves[0], lambda x: (x + 1) / (x - 1), "palma22q08.left")
        _check_curve(curves[1], lambda x: (x + 1) / (x - 1), "palma22q08.right")
        _check_curve({"points": [case["spec"]["lines"][0]["from"], case["spec"]["lines"][0]["to"]]}, lambda x: x, "palma22q08.line")
        for point in case["spec"]["points"]:
            _close(point["x"], point["y"], f"palma22q08.diagonal.{point['label']}")
    elif case_id == "h1-21-gangnam-2final-q14-transformed-rational-asymptotes":
        _check_curve(curves[0], lambda x: -1 + 7 / (x - 4), "gangnam21q14.left")
        _check_curve(curves[1], lambda x: -1 + 7 / (x - 4), "gangnam21q14.right")
    elif case_id == "h1-21-bokseong-2final-q22-radical-coordinate-triangle":
        _check_curve(curves[0], lambda x: x ** 0.5, "bokseong21q22.sqrt")
        _check_curve(curves[1], lambda x: 3 * x ** 0.5, "bokseong21q22.triple")
        for point in case["spec"]["points"]:
            if point["label"] == "A":
                _close(point["y"], 3 * point["x"] ** 0.5, "bokseong21q22.A")
            elif point["label"] in {"B", "C"}:
                _close(point["y"], point["x"] ** 0.5, f"bokseong21q22.{point['label']}")
    elif case_id == "h1-22-gangnam-2final-q18-radical-vertical-differences":
        _check_curve(curves[0], lambda x: (x + 1) ** 0.5, "gangnam22q18.upper")
        _check_curve(curves[1], lambda x: x ** 0.5, "gangnam22q18.lower")
    elif case_id == "h1-22-maesan-2final-q19-rational-line-triangle":
        _check_curve(curves[0], lambda x: -5 / x, "maesan22q19.left")
        _check_curve(curves[1], lambda x: -5 / x, "maesan22q19.right")
        _check_curve({"points": [case["spec"]["lines"][0]["from"], case["spec"]["lines"][0]["to"]]}, lambda x: x + 6, "maesan22q19.line")
        for point in case["spec"]["points"]:
            _close(point["y"], -5 / point["x"], f"maesan22q19.hyperbola.{point['label']}") if point["label"] != "O" else None
    elif case_id == "h1-22-hyocheon-2final-q04-rational-symmetry-axes":
        _check_curve(curves[0], lambda x: (2 - 5 * x) / (x - 1), "hyocheon22q04.left")
        _check_curve(curves[1], lambda x: (2 - 5 * x) / (x - 1), "hyocheon22q04.right")
        for item, fn, label in ((case["spec"]["lines"][0], lambda x: x - 6, "hyocheon22q04.axis.plus"), (case["spec"]["lines"][1], lambda x: -x - 4, "hyocheon22q04.axis.minus")):
            _check_curve({"points": [item["from"], item["to"]]}, fn, label)
    elif case_id == "h1-22-hyocheon-2final-q05-radical-inverse-point":
        _check_curve(curves[0], lambda x: (x + 22) ** 0.5, "hyocheon22q05.f")
        _check_curve(curves[1], lambda x: x ** 2 - 22, "hyocheon22q05.finverse")
    elif case_id == "h1-22-palmas-2final-q16-radical-area":
        _check_curve(curves[0], lambda x: (x + 2) ** 0.5 + 5, "palma22q16.f")
        _check_curve(curves[1], lambda x: (2 - x) ** 0.5 - 5, "palma22q16.g")
    elif case_id == "h1-23-geumdang-2final-q08-radical-quadratic-inverse":
        _check_curve(curves[0], lambda x: x ** 2 - x + 3 / 4, "geumdang23q08.f")
        _check_curve(curves[1], lambda x: 1 / 2 + (x - 1 / 2) ** 0.5, "geumdang23q08.finverse")
        for point in case["spec"]["points"]:
            _close(point["x"], point["y"], f"geumdang23q08.diagonal.{point['label']}")
    elif case_id == "h1-22-hyocheon-2final-q15-rational-quadrants-condition":
        _check_curve(curves[0], lambda x: (1 / 3 - 2) / (x + 4) + 1 / 3, "hyocheon22q15.f")
        _check_curve(curves[1], lambda x: 2 + (1 / 3 - 2) / (x + 1), "hyocheon22q15.g.left")
        _check_curve(curves[2], lambda x: 2 + (1 / 3 - 2) / (x + 1), "hyocheon22q15.g.right")
    elif case_id == "h1-21-suncheon-2final-q09-radical-sign-cases":
        _check_curve(curves[0], lambda x: -x ** 0.5, "suncheon21q09.a-positive")
        _check_curve(curves[1], lambda x: -(-x) ** 0.5, "suncheon21q09.a-negative")

    x_low, x_high = case["spec"]["xRange"]
    y_low, y_high = case["spec"]["yRange"]
    for group_name in ("curves", "lines", "segments"):
        for item in case["spec"].get(group_name, []):
            points = item.get("points", []) if group_name == "curves" else [item.get("from"), item.get("to")]
            for point in points:
                if point is None:
                    continue
                if not x_low <= point["x"] <= x_high or not y_low <= point["y"] <= y_high:
                    raise AssertionError(f"{case_id}: {group_name} point outside range: {point}")
    for point in case["spec"].get("points", []):
        if not x_low <= point["x"] <= x_high or not y_low <= point["y"] <= y_high:
            raise AssertionError(f"{case_id}: marked point outside range: {point}")


def main() -> None:
    summary = {"status": "PASS", "renderer": "alive.engine.visual_renderer", "cases": []}
    for case in PILOT_CASES + BATCH2_CASES + BATCH3_CASES + BATCH4_CASES + BATCH5_CASES + BATCH6_CASES + BATCH7_CASES + BATCH8_CASES + BATCH9_CASES:
        validate_math(case)
        svg = render_visual_spec(case["spec"])
        graph_hash = fact_hash(case)
        svg = svg.replace(
            '<svg xmlns="http://www.w3.org/2000/svg"',
            f'<svg xmlns="http://www.w3.org/2000/svg" data-graph-case="{case["caseId"]}" data-fact-hash="{graph_hash}" data-visual-provenance="reconstructed_from_independent_solution_facts"',
            1,
        )
        asset_path = ARCHIVE.joinpath(*case["assetRef"].split("/"))
        asset_path.parent.mkdir(parents=True, exist_ok=True)
        asset_path.write_text(svg, encoding="utf-8", newline="\n")
        summary["cases"].append({
            "caseId": case["caseId"],
            "sourceJsPath": case["sourceJsPath"],
            "id": case["id"],
            "assetRef": case["assetRef"],
            "visualKind": case["visualKind"],
            "factHash": graph_hash,
            "assetSha256": hashlib.sha256(svg.encode("utf-8")).hexdigest(),
            "bytes": len(svg.encode("utf-8")),
            "status": "PASS",
        })
    output = ROOT / "docs" / "reports" / "function-family-20260903" / "function_family_pilot_graphs.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
