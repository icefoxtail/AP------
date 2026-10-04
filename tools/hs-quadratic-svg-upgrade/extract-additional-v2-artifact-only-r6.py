from __future__ import annotations

import hashlib
import json
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
MANIFEST = REPORT / "26_additional_candidate_manifest_r6.json"
OUTPUT = REPORT / "28_additional_v2_artifact_only_r6.json"


MODELS = {
    "hs-r6-geumdang-q6": (620.0, 380.0, -2.0, 4.0, -7.0, 12.0),
    "hs-r6-geumdang-q9": (620.0, 360.0, -2.0, 2.0, -1.0, 6.0),
    "hs-r6-geumdang-q16": (620.0, 380.0, -2.0, 3.0, -12.0, 16.0),
    "hs-r6-maesan-q6": (620.0, 360.0, -1.0, 7.0, -2.0, 18.0),
    "hs-r6-maesan-q7": (620.0, 340.0, 0.0, 4.0, -2.0, 5.0),
    "hs-r6-maesan-q13": (620.0, 380.0, -5.0, 1.0, -3.0, 16.0),
    "hs-r6-maesan-q14": (620.0, 320.0, -1.0, 3.0, 4.0, 14.0),
    "hs-r6-palma-q4": (620.0, 340.0, -2.0, 4.0, -1.0, 10.0),
    "hs-r6-palma-q5": (620.0, 380.0, -3.0, 2.0, -10.0, 15.0),
}


def attr(node: ET.Element, key: str, default: str = "") -> str:
    return node.attrib.get(key, default)


def number(value: str) -> float:
    return float(value.replace("−", "-"))


def name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    rows = []
    for item in manifest["rows"]:
        width, height, x_low, x_high, y_low, y_high = MODELS[item["caseId"]]
        margin = 48.0

        def mx(px: float) -> float:
            return x_low + (px - margin) * (x_high - x_low) / (width - 2 * margin)

        def my(py: float) -> float:
            return y_low + (height - margin - py) * (y_high - y_low) / (height - 2 * margin)

        root = ET.fromstring((ROOT / item["assetPath"]).read_bytes())
        curves = []
        for node in root.iter():
            if name(node.tag) != "polyline":
                continue
            points = [[round(mx(number(pair.split(",")[0])), 6), round(my(number(pair.split(",")[1])), 6)] for pair in attr(node, "points").split()]
            curves.append({"class": attr(node, "class"), "pointCount": len(points), "first": points[0], "last": points[-1], "minYPoint": min(points, key=lambda point: point[1]), "maxYPoint": max(points, key=lambda point: point[1])})
        circles = []
        for node in root.iter():
            if name(node.tag) == "circle" and attr(node, "cx") and attr(node, "cy"):
                circles.append({"class": attr(node, "class"), "x": round(mx(number(attr(node, "cx"))), 6), "y": round(my(number(attr(node, "cy"))), 6), "fill": attr(node, "fill")})
        lines = []
        for node in root.iter():
            if name(node.tag) != "line":
                continue
            a = node.attrib
            if all(key in a for key in ("x1", "y1", "x2", "y2")):
                lines.append({"class": attr(node, "class"), "x1": round(mx(number(a["x1"])), 6), "y1": round(my(number(a["y1"])), 6), "x2": round(mx(number(a["x2"])), 6), "y2": round(my(number(a["y2"])), 6)})
        rows.append({"questionUid": item["questionUid"], "caseId": item["caseId"], "artifactPath": item["assetPath"], "artifactSha256": hashlib.sha256((ROOT / item["assetPath"]).read_bytes()).hexdigest(), "observedFacts": {"coordinateModel": {"width": width, "height": height, "margin": margin, "xRange": [x_low, x_high], "yRange": [y_low, y_high]}, "curves": curves, "circles": circles, "lines": lines}, "status": "V2_ARTIFACT_ONLY_FROZEN_NO_PASS"})
    output = {"schemaVersion": "HS_QUADRATIC_ADDITIONAL_V2_ARTIFACT_ONLY_R6", "status": "V2_ARTIFACT_ONLY_FROZEN_NO_PASS", "inputVisibilityProfile": "ARTIFACT_ONLY", "priorReviewVisibility": "NONE", "rows": rows, "note": "Only SVG geometry was read. Expected facts and candidate solution text were withheld from this extraction."}
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"status": output["status"], "rows": len(rows), "curves401": sum(row["observedFacts"]["curves"] and row["observedFacts"]["curves"][0]["pointCount"] == 401 for row in rows)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
