from __future__ import annotations

import hashlib
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(r"C:\Users\work1\Desktop\AP-------h2-math2-visual-repair")
EVIDENCE = ROOT / "reports" / "h2-2final-math2-visual" / "independent-review-20260909"
REPAIR_OUT = ROOT / "reports" / "h2-2final-math2-visual" / "repair-20260909"
SVG = ROOT / "archive" / "assets" / "images" / "25_매산여고_2학기_기말_고2_수학II" / "q22-solution.svg"
UID = "25_매산여고_2학기_기말_고2_수학II:q22"


def file_ref(path: Path):
    data = path.read_bytes()
    return {"path": path.relative_to(ROOT).as_posix(), "bytes": len(data), "sha256": "sha256:" + hashlib.sha256(data).hexdigest()}


def main():
    frozen = None
    expected_path = EVIDENCE / "expected-facts.jsonl"
    if expected_path.exists():
        for line in expected_path.read_text(encoding="utf-8").splitlines():
            if line.strip():
                row = json.loads(line)
                if row.get("questionUid") == UID:
                    frozen = row
                    break

    source_ref = frozen["sourceRef"] if frozen else None
    svg_ref = file_ref(SVG)
    xml = ET.fromstring(SVG.read_text(encoding="utf-8"))
    ns = {"s": "http://www.w3.org/2000/svg"}
    texts = ["".join(t.itertext()).strip() for t in xml.findall(".//s:text", ns)]
    title = "".join(xml.find("s:title", ns).itertext()).strip()
    desc = "".join(xml.find("s:desc", ns).itertext()).strip()
    polylines = xml.findall(".//s:polyline", ns)
    points = []
    if polylines:
        points = [tuple(map(float, p.split(","))) for p in polylines[0].attrib.get("points", "").split()]

    errors = []
    root_attrs = xml.attrib
    if root_attrs.get("role") != "img":
        errors.append("ROLE_IMG_MISSING")
    if root_attrs.get("preserveAspectRatio") != "xMidYMid meet":
        errors.append("PRESERVE_ASPECT_RATIO")
    if xml.attrib.get("viewBox") != "0 0 760 620":
        errors.append("VIEWBOX")
    raw = SVG.read_text(encoding="utf-8")
    if re.search(r"<script\b|<foreignObject\b|\son[a-z]+\s*=", raw, re.I):
        errors.append("STATIC_UNSAFE_ELEMENT")
    required_tokens = [
        "K(x)=-8x, x<0",
        "K(x)=x(x-3)², x≥0",
        "0<k<4",
        "(1,4)",
        "(3,0)",
        "서로 다른 네 실근",
    ]
    observed_text = " ".join([title, desc, *texts])
    for token in required_tokens:
        if token not in observed_text:
            errors.append(f"MISSING_LABEL:{token}")
    if not points:
        errors.append("POLYLINE_MISSING")
    else:
        # The repaired curve uses the declared screen mapping x=0..4 ->
        # px=116.4..438 and k=0..4 -> py=370..188.
        checks = [(points[0], (116.4, 370.0)), (points[5], (196.8, 188.0)), (points[15], (357.6, 370.0)), (points[-1], (438.0, 188.0))]
        for actual, wanted in checks:
            if abs(actual[0] - wanted[0]) > 0.2 or abs(actual[1] - wanted[1]) > 0.2:
                errors.append(f"GEOMETRY_POINT:{actual}!={wanted}")
    if frozen and frozen.get("computedValues", {}).get("requestedInterval") != "(0,4)":
        errors.append("FROZEN_SOURCE_EXPECTED_INTERVAL")

    result = {
        "schemaVersion": "repair-protocol-q22-20260909",
        "protocolStatus": "APPLIED_AND_VERIFIED" if not errors else "BLOCKED",
        "questionUid": UID,
        "reason": "Independent SVG observed-fact parity failed: prior asset described another function and interval.",
        "sourceRef": source_ref,
        "preRepairSvgRef": frozen.get("svgRef") if frozen else None,
        "postRepairSvgRef": svg_ref,
        "changes": [
            "Replaced unrelated F(x)=x·(x−3)^2 graph with the source-derived piecewise K(x) graph.",
            "Added explicit branches K(x)=-8x for x<0 and K(x)=x(x−3)^2 for x≥0.",
            "Added critical points (1,4), (3,0), the 0<k<4 band, and four-intersection witness at k=2.",
        ],
        "checks": {
            "sourceExpectedInterval": frozen.get("computedValues", {}).get("requestedInterval") if frozen else None,
            "staticContract": "PASS" if not any(x in errors for x in ("ROLE_IMG_MISSING", "PRESERVE_ASPECT_RATIO", "VIEWBOX", "STATIC_UNSAFE_ELEMENT")) else "FAIL",
            "labelParity": "PASS" if not any(x.startswith("MISSING_LABEL") for x in errors) else "FAIL",
            "geometryParity": "PASS" if not any(x.startswith("GEOMETRY_POINT") or x in ("POLYLINE_MISSING",) for x in errors) else "FAIL",
        },
        "findings": errors,
        "status": "PASS" if not errors else "FAIL",
    }
    REPAIR_OUT.mkdir(parents=True, exist_ok=True)
    (REPAIR_OUT / "post-repair-q22-verify.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": result["status"], "svgRef": svg_ref, "output": str(REPAIR_OUT / "post-repair-q22-verify.json")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
