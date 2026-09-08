from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path.cwd()
svg_path = ROOT / "reports" / "h2-s1-algebra-visual-upgrade" / "candidates" / "24_팔마고_1학기_기말_고2_수학I_q9_solution.svg"
report_path = ROOT / "reports" / "h2-s1-algebra-visual-upgrade" / "V2_artifact_only_q9.json"

source = svg_path.read_text(encoding="utf-8")
root = ET.fromstring(source)
ns = {"svg": "http://www.w3.org/2000/svg"}
polyline = root.find("svg:polyline", ns)
points = (polyline.attrib.get("points", "") if polyline is not None else "").split()
checks = {
    "xml_parse": True,
    "viewBox": "viewBox" in root.attrib,
    "preserveAspectRatio": "preserveAspectRatio" in root.attrib,
    "factHash": bool(root.attrib.get("data-fact-hash")),
    "candidateProvenance": "candidate" in root.attrib.get("data-visual-provenance", ""),
    "curvePointCount": len(points) >= 200,
    "noBr": "<br" not in source.lower(),
    "noLatex": not bool(re.search(r"\\(?:frac|sqrt|text)\b|\$", source)),
    "mainCurveToken": "main" in source.lower() or "class=\"curve\"" in source,
}
report = {
    "schemaVersion": "apmath-visual-v2-artifact-only-v1",
    "questionUid": "24_팔마고_1학기_기말_고2_수학I::q9",
    "inputVisibility": "candidate SVG only; source, solution, V1 facts hidden",
    "checks": checks,
    "pointCount": len(points),
    "status": "PASS" if all(checks.values()) else "FAIL",
}
report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, ensure_ascii=False))
