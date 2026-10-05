from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
REPORT = ROOT / "docs" / "reports" / "high1-svg-exhaustive-20260905"
INPUT = REPORT / "inline_svg_payload.json"
OUTPUT = REPORT / "inline_svg_verification.json"


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def main() -> None:
    payload = json.loads(INPUT.read_text(encoding="utf-8"))
    results = []
    for item in payload:
        result = {
            "questionUid": item["questionUid"],
            "sourceJsPath": item["sourceJsPath"],
            "id": item["id"],
            "field": item["field"],
            "inlineIndex": item["inlineIndex"],
            "assetPath": item["assetPath"],
            "assetSha256": item["assetSha256"],
            "xmlParseStatus": "FAIL",
            "rootTag": "",
            "viewBox": "",
            "preserveAspectRatio": "",
            "primitiveCounts": {},
            "forbiddenNodeCount": 0,
            "externalRefCount": 0,
            "reasons": [],
        }
        try:
            root = ET.fromstring(item["svg"])
            result["xmlParseStatus"] = "PASS"
        except Exception as exc:  # noqa: BLE001
            result["reasons"].append(f"XML_PARSE_ERROR:{exc}")
            result["status"] = "FAIL"
            results.append(result)
            continue
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
                if key.endswith("href") and value and not value.startswith("#") and not value.startswith("data:"):
                    result["externalRefCount"] += 1
                    result["reasons"].append("EXTERNAL_REFERENCE")
        result["reasons"] = sorted(set(result["reasons"]))
        result["status"] = "PASS" if not result["reasons"] else "REVIEW_REQUIRED"
        results.append(result)
    summary = {
        "inlineSvgCount": len(results),
        "questionCount": len({item["questionUid"] for item in results}),
        "xmlParseFailCount": sum(item["xmlParseStatus"] != "PASS" for item in results),
        "reviewRequiredCount": sum(item.get("status") in {"FAIL", "REVIEW_REQUIRED"} for item in results),
        "missingViewBoxCount": sum("VIEWBOX_MISSING" in item["reasons"] for item in results),
        "forbiddenNodeCount": sum(item["forbiddenNodeCount"] > 0 for item in results),
        "externalReferenceCount": sum(item["externalRefCount"] > 0 for item in results),
    }
    OUTPUT.write_text(json.dumps({"summary": summary, "results": results}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
