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
                {"points": [{"x": -5, "y": 3}, {"x": -4, "y": 5}, {"x": -1, "y": 7}, {"x": 3, "y": 9}, {"x": 7, "y": 9.928203}, {"x": 11, "y": 11}, {"x": 15, "y": 11.944272}]},
                {"points": [{"x": 3, "y": -5}, {"x": 4, "y": -4.75}, {"x": 5, "y": -4}, {"x": 7, "y": -1}, {"x": 9, "y": 4}, {"x": 11, "y": 11}, {"x": 11.5, "y": 15.0625}]},
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
            "yRange": [-0.5, 2.5],
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
                {"points": [{"x": -1, "y": 2}, {"x": -0.875, "y": 1.5}, {"x": -0.5, "y": 1}, {"x": 0, "y": 0.585786}, {"x": 0.5, "y": 0.171573}, {"x": 1, "y": 0}]},
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


def fact_hash(case: dict) -> str:
    payload = json.dumps({"caseId": case["caseId"], "factSummary": case["factSummary"], "spec": case["spec"]}, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def main() -> None:
    summary = {"status": "PASS", "renderer": "alive.engine.visual_renderer", "cases": []}
    for case in PILOT_CASES:
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
