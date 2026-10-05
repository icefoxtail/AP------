from __future__ import annotations

import hashlib
import json
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
MANIFEST = REPORT / "04_calibration_candidate_manifest_r3.json"
OUTPUT = REPORT / "07_calibration_v2_artifact_only_r3.json"


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def number(value: str) -> float:
    return float(value.replace("−", "-"))


def attrs(node: ET.Element) -> dict[str, str]:
    return {str(k).rsplit("}", 1)[-1]: str(v) for k, v in node.attrib.items()}


def observe_cartesian(case_id: str, root: ET.Element) -> dict:
    model = {
        "hs-q20-parabola-intersection": (620.0, 380.0, 0.5, 4.5, -1.0, 9.0),
        "hs-q22-parabola-domain": (620.0, 300.0, 0.5, 4.8, 12.0, 24.0),
        "hs-q5-parabola-minimum": (620.0, 360.0, -2.0, 4.0, 0.0, 18.0),
    }[case_id]
    width, height, x_low, x_high, y_low, y_high = model
    margin = 48.0

    def mx(px: float) -> float:
        return x_low + (px - margin) * (x_high - x_low) / (width - 2 * margin)

    def my(py: float) -> float:
        return y_low + (height - margin - py) * (y_high - y_low) / (height - 2 * margin)

    polylines = []
    for node in root.iter():
        if local_name(node.tag) != "polyline":
            continue
        attrs_map = attrs(node)
        if attrs_map.get("class") not in {"curve", "secondary"}:
            continue
        points = []
        for pair in attrs_map.get("points", "").split():
            px, py = pair.split(",")
            points.append([round(mx(number(px)), 6), round(my(number(py)), 6)])
        polylines.append({"class": attrs_map.get("class"), "pointCount": len(points), "first": points[0], "last": points[-1], "maxYPoint": max(points, key=lambda p: p[1]), "minYPoint": min(points, key=lambda p: p[1])})
    circles = []
    for node in root.iter():
        if local_name(node.tag) != "circle":
            continue
        a = attrs(node)
        if "cx" not in a or "cy" not in a:
            continue
        circles.append({"class": a.get("class", ""), "x": round(mx(number(a["cx"])), 6), "y": round(my(number(a["cy"])), 6), "fill": a.get("fill", ""), "label": None})
    verticals = []
    for node in root.iter():
        if local_name(node.tag) != "line":
            continue
        a = attrs(node)
        if a.get("class") != "guide" or a.get("x1") != a.get("x2"):
            continue
        verticals.append(round(mx(number(a["x1"])), 6))
    return {"coordinateModel": {"width": width, "height": height, "margin": margin, "xRange": [x_low, x_high], "yRange": [y_low, y_high]}, "polylineObservations": polylines, "circleObservations": circles, "verticalGuideXValues": sorted(verticals)}


def observe_number_line(case_id: str, root: ET.Element) -> dict:
    width = 620.0
    height = 180.0
    x_low, x_high = (-1.0, 5.0) if case_id.endswith("q2-absolute-inequality-number-line") else (-3.0, 4.0)
    margin = 56.0

    def mx(px: float) -> float:
        return x_low + (px - margin) * (x_high - x_low) / (width - 2 * margin)

    shade = []
    circles = []
    for node in root.iter():
        name = local_name(node.tag)
        a = attrs(node)
        if name == "line" and a.get("class") == "shade":
            shade.append([round(mx(number(a["x1"])), 6), round(mx(number(a["x2"])), 6)])
        if name == "circle" and "cx" in a:
            circles.append({"x": round(mx(number(a["cx"])), 6), "class": a.get("class", ""), "fill": a.get("fill", "")})
    return {"coordinateModel": {"width": width, "height": height, "margin": margin, "xRange": [x_low, x_high]}, "shadedSegments": shade, "circleObservations": circles}


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    rows = []
    for item in manifest["rows"]:
        asset = ROOT / item["assetPath"]
        raw = asset.read_bytes()
        root = ET.fromstring(raw)
        case_id = item["caseId"]
        observed = observe_cartesian(case_id, root) if item["visualType"] == "cartesian" else observe_number_line(case_id, root)
        rows.append({"questionUid": item["questionUid"], "caseId": case_id, "artifactPath": item["assetPath"], "artifactSha256": hashlib.sha256(raw).hexdigest(), "observedFacts": observed, "status": "V2_ARTIFACT_ONLY_FROZEN_NO_PASS"})
    output = {"schemaVersion": "HS_QUADRATIC_V2_ARTIFACT_ONLY_V1", "status": "V2_ARTIFACT_ONLY_FROZEN_NO_PASS", "inputVisibilityProfile": "ARTIFACT_ONLY", "priorReviewVisibility": "NONE", "rows": rows, "note": "Observed facts were extracted from SVG geometry only. Expected facts, answer, solution, alt/caption, and V1 verdicts were not used by the extractor."}
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"status": output["status"], "rows": len(rows), "artifactHashes": [row["artifactSha256"] for row in rows]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
