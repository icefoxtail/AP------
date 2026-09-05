from __future__ import annotations

import csv
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
REPORT = ROOT / "docs" / "reports" / "high1-svg-exhaustive-20260905"
MANIFEST = REPORT / "04_svg_asset_manifest.csv"
OUTPUT = REPORT / "svg_static_verification.json"


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def numeric(value: str | None) -> bool:
    if value is None:
        return False
    return bool(re.fullmatch(r"[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?", value.strip()))


def verify(row: dict[str, str]) -> dict:
    relative = row["assetPath"]
    file_path = ROOT / relative
    result = {
        "assetPath": relative,
        "exists": file_path.is_file(),
        "xmlParseStatus": "NOT_TESTED",
        "rootTag": "",
        "viewBox": "",
        "preserveAspectRatio": "",
        "titleCount": 0,
        "descCount": 0,
        "forbiddenNodeCount": 0,
        "externalRefCount": 0,
        "numericAttributeIssues": [],
        "primitiveCounts": {},
        "status": "FAIL",
        "reasons": [],
    }
    if not file_path.is_file():
        result["reasons"].append("MISSING_FILE")
        return result
    try:
        root = ET.parse(file_path).getroot()
        result["xmlParseStatus"] = "PASS"
    except Exception as exc:  # noqa: BLE001
        result["xmlParseStatus"] = "FAIL"
        result["reasons"].append(f"XML_PARSE_ERROR:{exc}")
        return result

    result["rootTag"] = local_name(root.tag)
    result["viewBox"] = root.attrib.get("viewBox", "")
    result["preserveAspectRatio"] = root.attrib.get("preserveAspectRatio", "")
    if result["rootTag"] != "svg":
        result["reasons"].append("ROOT_NOT_SVG")
    if not result["viewBox"]:
        result["reasons"].append("VIEWBOX_MISSING")
    for element in root.iter():
        name = local_name(element.tag)
        result["primitiveCounts"][name] = result["primitiveCounts"].get(name, 0) + 1
        if name in {"script", "foreignObject"}:
            result["forbiddenNodeCount"] += 1
            result["reasons"].append(f"FORBIDDEN_NODE:{name}")
        for key, value in element.attrib.items():
            if key in {"href", "{http://www.w3.org/1999/xlink}href"} and value and not value.startswith("#") and not value.startswith("data:"):
                result["externalRefCount"] += 1
                result["reasons"].append("EXTERNAL_REFERENCE")
            if key in {"cx", "cy", "r", "rx", "ry", "x", "y", "x1", "y1", "x2", "y2", "width", "height"} and value and not numeric(value.rstrip("px")):
                result["numericAttributeIssues"].append({"tag": name, "attribute": key, "value": value})
    result["titleCount"] = result["primitiveCounts"].get("title", 0)
    result["descCount"] = result["primitiveCounts"].get("desc", 0)
    if result["numericAttributeIssues"]:
        result["reasons"].append("NON_NUMERIC_GEOMETRY_ATTRIBUTE")
    result["reasons"] = sorted(set(result["reasons"]))
    result["status"] = "PASS" if not result["reasons"] else "REVIEW_REQUIRED"
    return result


def main() -> int:
    if not MANIFEST.is_file():
        print(f"missing manifest: {MANIFEST}", file=sys.stderr)
        return 2
    with MANIFEST.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    results = [verify(row) for row in rows]
    summary = {
        "assetCount": len(results),
        "xmlParseFailCount": sum(item["xmlParseStatus"] != "PASS" for item in results),
        "staticPassCount": sum(item["status"] == "PASS" for item in results),
        "reviewRequiredCount": sum(item["status"] == "REVIEW_REQUIRED" for item in results),
        "forbiddenNodeAssetCount": sum(item["forbiddenNodeCount"] > 0 for item in results),
        "externalReferenceAssetCount": sum(item["externalRefCount"] > 0 for item in results),
        "numericAttributeIssueAssetCount": sum(bool(item["numericAttributeIssues"]) for item in results),
        "missingViewBoxCount": sum("VIEWBOX_MISSING" in item["reasons"] for item in results),
    }
    OUTPUT.write_text(json.dumps({"summary": summary, "results": results}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0 if summary["xmlParseFailCount"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
