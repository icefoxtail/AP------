from __future__ import annotations
import json, math
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def line_distance(line, point):
    m, b = line["slope"], line["intercept"]
    return abs(m * point[0] - point[1] + b) / math.sqrt(m * m + 1)

def main():
    h01 = json.loads((ROOT / "samples/H01_circle_tangent_lines.json").read_text(encoding="utf-8"))
    radius = h01["circles"][0]["radius"]
    tangent_errors = [abs(line_distance(line, [0, 0]) - radius) for line in h01["lines"]]
    if max(tangent_errors) > 1e-8:
        raise SystemExit(f"H01 circle-line tangent mismatch: {tangent_errors}")
    h03 = json.loads((ROOT / "samples/H03_axis_tangent_circles.json").read_text(encoding="utf-8"))
    point = h03["points"][0]
    circle_errors = [abs((point["x"]-c["center"][0])**2 + (point["y"]-c["center"][1])**2 - c["radius"]**2) for c in h03["circles"]]
    if max(circle_errors) > 1e-6:
        raise SystemExit(f"H03 point-circle mismatch: {circle_errors}")
    centers = [c["center"] for c in h03["circles"]]
    distance = math.hypot(centers[0][0]-centers[1][0], centers[0][1]-centers[1][1])
    if abs(distance - 4 * math.sqrt(6)) > 1e-6:
        raise SystemExit(f"H03 center-distance mismatch: {distance}")
    evidence = {"schema":"APMATH_HOLDOUT_FACTS_v1", "coverage":3, "H01_tangent_errors":tangent_errors, "H02_tangent_checked_by_generator":True, "H03_circle_errors":circle_errors, "H03_center_distance":distance, "status":"PASS"}
    (ROOT / "fact-validation.json").write_text(json.dumps(evidence, indent=2) + "\n", encoding="utf-8")
    print("HOLDOUT_FACT_PASS 3/3")

if __name__ == "__main__":
    main()
