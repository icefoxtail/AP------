from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
MANIFEST = REPORT / "26_additional_candidate_manifest_r6.json"
OUTPUT = REPORT / "27_additional_candidate_static_check_r6.json"


def name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def check(item: dict) -> dict:
    path = ROOT / item["assetPath"]
    errors = []
    if not path.is_file():
        return {"questionUid": item["questionUid"], "assetPath": item["assetPath"], "status": "FAIL", "errors": ["MISSING_ASSET"]}
    raw = path.read_text(encoding="utf-8")
    try:
        root = ET.fromstring(raw)
    except Exception as exc:  # noqa: BLE001
        return {"questionUid": item["questionUid"], "assetPath": item["assetPath"], "status": "FAIL", "errors": [f"XML_PARSE:{exc}"]}
    if name(root.tag) != "svg": errors.append("ROOT_NOT_SVG")
    if not root.attrib.get("viewBox"): errors.append("VIEWBOX_MISSING")
    if not root.attrib.get("preserveAspectRatio"): errors.append("PRESERVE_ASPECT_RATIO_MISSING")
    if any(name(node.tag) in {"script", "foreignObject"} for node in root.iter()): errors.append("FORBIDDEN_NODE")
    if re.search(r"(?:href|xlink:href)\s*=\s*['\"](?!#|data:)", raw, re.I): errors.append("EXTERNAL_REFERENCE")
    if re.search(r"<br\b|\\(?:frac|sqrt|left|right|begin|end)|\$(?:[^$]|\$)+\$", raw, re.I): errors.append("RAW_LATEX_OR_BR")
    if re.search(r"정답|answer|choice|보기", raw, re.I): errors.append("ANSWER_LEAK")
    polylines = [node for node in root.iter() if name(node.tag) == "polyline"]
    point_counts = [len(node.attrib.get("points", "").split()) for node in polylines]
    if point_counts != [401]: errors.append(f"POLYLINE_DENSITY:{point_counts}")
    if root.attrib.get("data-fact-hash") != item["factSha256"]: errors.append("FACT_HASH_MISMATCH")
    if root.attrib.get("data-visual-case") != item["caseId"]: errors.append("CASE_ID_MISMATCH")
    return {"questionUid": item["questionUid"], "assetPath": item["assetPath"], "bytes": len(path.read_bytes()), "pointCounts": point_counts, "status": "STATIC_CHECKED_NO_PASS" if not errors else "STATIC_FAIL", "errors": errors}


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    rows = [check(item) for item in manifest["rows"]]
    output = {"schemaVersion": "HS_QUADRATIC_ADDITIONAL_STATIC_CHECK_R6", "status": "STATIC_CHECKED_NO_PASS" if all(row["status"] == "STATIC_CHECKED_NO_PASS" for row in rows) else "STATIC_FAIL", "rows": rows, "note": "Static check does not close V2/V3 or browser render review."}
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"status": output["status"], "rows": len(rows), "fail": sum(row["status"] == "STATIC_FAIL" for row in rows)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
