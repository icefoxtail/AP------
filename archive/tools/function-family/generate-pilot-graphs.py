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
    for case in PILOT_CASES + BATCH2_CASES:
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
