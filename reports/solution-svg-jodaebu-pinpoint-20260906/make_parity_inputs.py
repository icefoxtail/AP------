from __future__ import annotations

import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
F23 = "archive/assets/images/23_조대부고_2학기_중간_고2_수학II"
F24 = "archive/assets/images/24_조대부고_2학기_중간_고2_수학II"


def num(v):
    return str(v).replace("-", "m").replace(".", "p")


def pid(ox, x, y):
    return f"point-o{num(ox)}-x{num(x)}-y{num(y)}"


def lid(cls, ox, x1, y1, x2, y2):
    return f"line-{cls}-o{num(ox)}-x1{num(x1)}-y1{num(y1)}-x2{num(x2)}-y2{num(y2)}"


def item(path, qid, model, facts):
    model = dict(model)
    ox = model["originX"]
    model["anchors"] = {
        "origin": {"element": f"anchor-origin-o{num(ox)}", "expected": [0, 0]},
        "xAxis": {"element": f"anchor-xaxis-o{num(ox)}", "expected": [1, 0]},
        "yAxis": {"element": f"anchor-yaxis-o{num(ox)}", "expected": [0, 1]},
    }
    return {"schemaVersion": "APMATH_SVG_COORDINATE_PARITY_INPUT_v1", "questionId": qid, "svg": path, "sourceFactStatus": "PASS", "expectedFactStatus": "PASS", "coordinateModel": model, "tolerance": 1e-5, "expectedFacts": facts, "renderResult": "PASS"}


inputs = {
    "2023-q01": item(f"{F23}/q01-solution.svg", 1, {"originX": 300, "originY": 260, "sx": 70, "sy": 60}, [
        {"factId": "q01-open-minus2", "type": "POINT", "element": pid(300, -2, 1), "expected": [-2, 1]},
        {"factId": "q01-open-zero", "type": "POINT", "element": pid(300, 0, 1), "expected": [0, 1]},
        {"factId": "q01-join-minus1", "type": "POINT", "element": pid(300, -1, 0), "expected": [-1, 0]},
    ]),
    "2023-q11": item(f"{F23}/q11-solution.svg", 11, {"originX": 320, "originY": 240, "sx": 35, "sy": 35}, [
        {"factId": "q11-external", "type": "POINT", "element": pid(320, -1, -2), "expected": [-1, -2]},
        {"factId": "q11-contact", "type": "POINT", "element": pid(320, 1, 2), "expected": [1, 2]},
        {"factId": "q11-tangent-slope", "type": "LINE_SLOPE", "element": lid("tangent", 320, -1.8, -3.6, 1.8, 3.6), "expected": 2},
    ]),
    "2023-q16": item(f"{F23}/q16-solution.svg", 16, {"originX": 180, "originY": 240, "sx": 110, "sy": 90}, [
        {"factId": "q16-h0", "type": "POINT", "element": pid(180, 0, 0), "expected": [0, 0]},
        {"factId": "q16-h1", "type": "POINT", "element": pid(180, 1, 0), "expected": [1, 0]},
        {"factId": "q16-right-limit1", "type": "POINT", "element": pid(180, 1, 1), "expected": [1, 1]},
        {"factId": "q16-left-slope0", "type": "LINE_SLOPE", "element": lid("indicator", 180, -0.45, 0, 0.45, 0), "expected": 0},
        {"factId": "q16-right-slope1", "type": "LINE_SLOPE", "element": lid("indicator", 180, 0.0, 0, 0.45, 0.45), "expected": 1},
    ]),
    "2023-q23": item(f"{F23}/q23-solution.svg", 23, {"originX": 100, "originY": 350, "sx": 100, "sy": 100}, [
        {"factId": "q23-A", "type": "POINT", "element": pid(100, 1, math.sqrt(3)), "expected": [1, math.sqrt(3)]},
        {"factId": "q23-B", "type": "POINT", "element": pid(100, 2, 0), "expected": [2, 0]},
        {"factId": "q23-C", "type": "MIDPOINT", "element": pid(100, 1.5, math.sqrt(3)/2), "points": [pid(100, 1, math.sqrt(3)), pid(100, 2, 0)], "expected": [1.5, math.sqrt(3)/2]},
        {"factId": "q23-D", "type": "POINT", "element": pid(100, 2, 2/math.sqrt(3)), "expected": [2, 2/math.sqrt(3)]},
        {"factId": "q23-perpendicular", "type": "PERPENDICULAR", "elements": [lid("main-line", 100, 1, math.sqrt(3), 2, 0), lid("main-line", 100, 1.5, math.sqrt(3)/2, 2, 2/math.sqrt(3))], "expected": True},
    ]),
    "2024-q01": item(f"{F24}/q01-solution.svg", 1, {"originX": 140, "originY": 210, "sx": 45, "sy": 35}, [
        {"factId": "q01-f-left-limit", "type": "POINT", "element": pid(140, 3, 0), "expected": [3, 0]},
    ]),
    "2024-q05": item(f"{F24}/q05-solution.svg", 5, {"originX": 220, "originY": 250, "sx": 55, "sy": 25}, [
        {"factId": "q05-left-limit", "type": "POINT", "element": pid(220, 0, 6), "expected": [0, 6]},
        {"factId": "q05-value", "type": "POINT", "element": pid(220, 0, -2), "expected": [0, -2]},
    ]),
    "2024-q07": item(f"{F24}/q07-solution.svg", 7, {"originX": 140, "originY": 220, "sx": 45, "sy": 45}, [
        {"factId": "q07-f-minus1-value", "type": "POINT", "element": pid(140, -1, 1), "expected": [-1, 1]},
        {"factId": "q07-f-minus1-right", "type": "POINT", "element": pid(140, -1, -1), "expected": [-1, -1]},
        {"factId": "q07-f-one-left", "type": "POINT", "element": pid(140, 1, 1), "expected": [1, 1]},
        {"factId": "q07-f-one-value", "type": "POINT", "element": pid(140, 1, -1), "expected": [1, -1]},
        {"factId": "q07-f-right-branch", "type": "LINE_SLOPE", "element": lid("main-line", 140, 1, -1, 3, -1), "expected": 0},
    ]),
    "2024-q08": item(f"{F24}/q08-solution.svg", 8, {"originX": 250, "originY": 300, "sx": 45, "sy": 45}, [
        {"factId": "q08-external", "type": "POINT", "element": pid(250, 1, 4), "expected": [1, 4]},
        {"factId": "q08-t0", "type": "POINT", "element": pid(250, 0, 3), "expected": [0, 3]},
        {"factId": "q08-t2", "type": "POINT", "element": pid(250, 2, 1), "expected": [2, 1]},
        {"factId": "q08-negative-slope", "type": "LINE_SLOPE", "element": lid("tangent", 250, 0.5, 5.5, 2.5, -0.5), "expected": -3},
        {"factId": "q08-negative-intercept", "type": "INTERCEPT", "element": lid("tangent", 250, 0.5, 5.5, 2.5, -0.5), "expected": {"y": 7}},
    ]),
    "2024-q12": item(f"{F24}/q12-solution.svg", 12, {"originX": 260, "originY": 260, "sx": 45, "sy": 45}, [
        {"factId": "q12-root-minus1", "type": "POINT", "element": pid(260, -1, 0), "expected": [-1, 0]},
        {"factId": "q12-root-left", "type": "POINT", "element": pid(260, 2-math.sqrt(2), 0), "expected": [2-math.sqrt(2), 0]},
        {"factId": "q12-root-right", "type": "POINT", "element": pid(260, 2+math.sqrt(2), 0), "expected": [2+math.sqrt(2), 0]},
        {"factId": "q12-root-five", "type": "POINT", "element": pid(260, 5, 0), "expected": [5, 0]},
    ]),
    "2024-q15": item(f"{F24}/q15-solution.svg", 15, {"originX": 260, "originY": 260, "sx": 20, "sy": 20}, [
        {"factId": "q15-point", "type": "POINT", "element": pid(260, -3, 2), "expected": [-3, 2]},
        {"factId": "q15-external", "type": "POINT", "element": pid(260, -11, 10), "expected": [-11, 10]},
        {"factId": "q15-tangent-slope", "type": "LINE_SLOPE", "element": lid("tangent", 260, -11, 10, 2, -3), "expected": -1},
        {"factId": "q15-tangent-intercept", "type": "INTERCEPT", "element": lid("tangent", 260, -11, 10, 2, -3), "expected": {"y": -1}},
    ]),
    "2024-q16": item(f"{F24}/q16-solution.svg", 16, {"originX": 200, "originY": 180, "sx": 45, "sy": 12}, [
        {"factId": "q16-join", "type": "POINT", "element": pid(200, 2, -4), "expected": [2, -4]},
        {"factId": "q16-line-slope", "type": "LINE_SLOPE", "element": lid("tangent", 200, 2, -4, 3.0, -16), "expected": -12},
    ]),
    "2024-q17": item(f"{F24}/q17-solution.svg", 17, {"originX": 250, "originY": 250, "sx": 55, "sy": 35}, [
        {"factId": "q17-t2", "type": "POINT", "element": pid(250, 0, 0), "expected": [0, 0]},
        {"factId": "q17-t23", "type": "POINT", "element": pid(250, 2, 4/3), "expected": [2, 4/3]},
        {"factId": "q17-slope2", "type": "LINE_SLOPE", "element": lid("tangent", 250, -0.35, -0.7, 1.2, 2.4), "expected": 2},
        {"factId": "q17-slope23", "type": "LINE_SLOPE", "element": lid("tangent", 250, 0.0, 0.0, 3.0, 2.0), "expected": 2/3},
    ]),
    "2024-q18": item(f"{F24}/q18-solution.svg", 18, {"originX": 280, "originY": 220, "sx": 32, "sy": 32}, [
        {"factId": "q18-cusp", "type": "POINT", "element": pid(280, 2, 0), "expected": [2, 0]},
        {"factId": "q18-left-slope", "type": "LINE_SLOPE", "element": lid("indicator", 280, 1.35, -1.3, 2, 0), "expected": 2},
        {"factId": "q18-right-slope", "type": "LINE_SLOPE", "element": lid("tangent", 280, 2, 0, 2.65, -1.3), "expected": -2},
    ]),
}

(OUT / "coordinate-parity-inputs.json").write_text(json.dumps(inputs, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps({"count": len(inputs), "files": list(inputs)}, ensure_ascii=False, indent=2))
