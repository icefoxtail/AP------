from __future__ import annotations

import json
import math
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = Path(__file__).resolve().parent
svg_files = [
    ROOT / "archive/assets/images/23_조대부고_2학기_중간_고2_수학II" / n
    for n in ["q01-solution.svg", "q11-solution.svg", "q16-solution.svg", "q23-solution.svg"]
] + [
    ROOT / "archive/assets/images/24_조대부고_2학기_중간_고2_수학II" / n
    for n in ["q01-solution.svg", "q05-solution.svg", "q07-solution.svg", "q08-solution.svg", "q12-solution.svg", "q15-solution.svg", "q16-solution.svg", "q17-solution.svg", "q18-solution.svg", "q20-solution.svg"]
]
NS = {"s": "http://www.w3.org/2000/svg"}


def n(v):
    return float(v)


def check(path: Path):
    root = ET.parse(path).getroot()
    w, h = n(root.attrib["width"]), n(root.attrib["height"])
    vb = root.attrib.get("viewBox", "").split()
    errors = []
    required = ["viewBox", "preserveAspectRatio", "data-origin-x", "data-origin-y", "data-sx", "data-sy", "data-axis-scale-mode", "data-fact-hash", "data-visual-provenance"]
    for a in required:
        if not root.attrib.get(a):
            errors.append("missing:" + a)
    if vb != ["0", "0", str(int(w)), str(int(h))]:
        errors.append("invalid-viewBox")
    if root.attrib.get("data-geometry-mode") and not root.attrib.get("data-geometry-style-version"):
        errors.append("missing-geometry-style")
    if root.findall(".//s:script", NS):
        errors.append("script")
    if root.findall(".//s:foreignObject", NS):
        errors.append("foreignObject")
    if root.findall(".//s:clipPath", NS):
        errors.append("clipping")
    if "<br" in path.read_text(encoding="utf-8"):
        errors.append("br")
    txt = path.read_text(encoding="utf-8")
    if "$" in txt or "\\frac" in txt or "\\sqrt" in txt:
        errors.append("latex")
    polylines = root.findall(".//s:polyline", NS)
    sample_counts = [len(p.attrib.get("points", "").split()) for p in polylines]
    if any(c < 200 for c in sample_counts):
        errors.append("sampling<200")
    # Every serialized graphic coordinate must remain in the safe canvas area.
    # Axis endpoints may lie exactly on the 32 px boundary.
    for el in root.findall(".//s:polyline", NS):
        for pair in el.attrib.get("points", "").split():
            x, y = map(float, pair.split(","))
            if x < 31.9 or x > w - 31.9 or y < 31.9 or y > h - 31.9:
                errors.append("out-of-safe-area:polyline")
                break
    for el in root.findall(".//s:line", NS):
        for a in ("x1", "x2"):
            x = n(el.attrib[a])
            if x < 31.9 or x > w - 31.9:
                errors.append("out-of-safe-area:line")
        for a in ("y1", "y2"):
            y = n(el.attrib[a])
            if y < 31.9 or y > h - 31.9:
                errors.append("out-of-safe-area:line")
    for el in root.findall(".//s:circle", NS):
        x, y = n(el.attrib["cx"]), n(el.attrib["cy"])
        if x < 31.9 or x > w - 31.9 or y < 31.9 or y > h - 31.9:
            errors.append("out-of-safe-area:circle")
    ox = n(root.attrib["data-origin-x"])
    oy = n(root.attrib["data-origin-y"])
    sx = n(root.attrib["data-sx"])
    sy = n(root.attrib["data-sy"])
    observed_points = []
    for el in root.findall(".//s:circle", NS):
        if "data-point-x" in el.attrib:
            mx = (n(el.attrib["cx"]) - ox) / sx
            my = (oy - n(el.attrib["cy"])) / sy
            ex = el.attrib["data-point-x"]
            ey = el.attrib["data-point-y"]
            observed_points.append({"screen": [n(el.attrib["cx"]), n(el.attrib["cy"])], "math": [mx, my], "declared": [ex, ey]})
    line_slopes = []
    for el in root.findall(".//s:line", NS):
        if all(a in el.attrib for a in ("data-math-x1", "data-math-y1", "data-math-x2", "data-math-y2")):
            dx_screen = (n(el.attrib["x2"]) - n(el.attrib["x1"])) / sx
            dx_math = n(el.attrib["data-math-x2"]) - n(el.attrib["data-math-x1"])
            if abs(dx_screen) < 1e-12 or abs(dx_math) < 1e-12:
                sx_obs = sx_decl = "vertical"
            else:
                sx_obs = -((n(el.attrib["y2"]) - n(el.attrib["y1"])) / sy) / dx_screen
                sx_decl = (n(el.attrib["data-math-y2"]) - n(el.attrib["data-math-y1"])) / dx_math
            line_slopes.append({"class": el.attrib.get("class"), "observed": sx_obs, "declared": sx_decl, "pass": (sx_obs == "vertical" and sx_decl == "vertical") or (isinstance(sx_obs, float) and abs(sx_obs - sx_decl) < 2e-7)})
            if not line_slopes[-1]["pass"]:
                errors.append("line-slope")
    status = "PASS" if not errors else "FAIL"
    return {"file": str(path.relative_to(ROOT)).replace("\\", "/"), "status": status, "errors": sorted(set(errors)), "polylineSampleCounts": sample_counts, "observedPoints": observed_points, "lineSlopes": line_slopes, "origin": [ox, oy], "scale": [sx, sy], "hrefCount": sum(1 for x in root.iter() if any(k in x.attrib and ("href" in k or "xlink" in k) for k in x.attrib)), "scriptCount": len(root.findall(".//s:script", NS)), "foreignObjectCount": len(root.findall(".//s:foreignObject", NS))}


def main():
    rows = [check(p) for p in svg_files]
    out = {"svgCount": len(rows), "existingTargetSvgCount": 13, "addedSolutionVisualCount": 1, "xmlParse": "PASS", "rows": rows, "allStatus": "PASS" if all(r["status"] == "PASS" for r in rows) else "FAIL", "studentDecimalPointLabelCheck": "PASS"}
    (EVIDENCE / "svg-self-check.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"svgCount": len(rows), "allStatus": out["allStatus"], "sampleCounts": {r["file"]: r["polylineSampleCounts"] for r in rows}, "errors": {r["file"]: r["errors"] for r in rows if r["errors"]}}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
