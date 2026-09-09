from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
MANIFEST = REPORT / "04_calibration_candidate_manifest_r3.json"
OUTPUT = REPORT / "05_calibration_candidate_static_check_r3.json"


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def points_count(value: str) -> int:
    return len([part for part in re.split(r"[\s]+", value.strip()) if part])


def check(item: dict) -> dict:
    path = ROOT / item["assetPath"]
    result = {"questionUid": item["questionUid"], "caseId": item["caseId"], "assetPath": item["assetPath"], "status": "FAIL", "reasons": []}
    if not path.is_file():
        result["reasons"].append("MISSING_ASSET")
        return result
    raw = path.read_text(encoding="utf-8")
    result["bytes"] = len(path.read_bytes())
    try:
        root = ET.fromstring(raw)
    except Exception as exc:  # noqa: BLE001
        result["reasons"].append(f"XML_PARSE_ERROR:{exc}")
        return result
    if local_name(root.tag) != "svg":
        result["reasons"].append("ROOT_NOT_SVG")
    if not root.attrib.get("viewBox"):
        result["reasons"].append("VIEWBOX_MISSING")
    if not root.attrib.get("preserveAspectRatio"):
        result["reasons"].append("PRESERVE_ASPECT_RATIO_MISSING")
    for forbidden in ("script", "foreignObject"):
        if any(local_name(node.tag) == forbidden for node in root.iter()):
            result["reasons"].append(f"FORBIDDEN_NODE:{forbidden}")
    if re.search(r"(?:href|xlink:href)\s*=\s*['\"](?!#|data:)", raw, re.I):
        result["reasons"].append("EXTERNAL_REFERENCE")
    if re.search(r"<br\b|\\(?:frac|sqrt|left|right|begin|end)|\$(?:[^$]|\$)+\$", raw, re.I):
        result["reasons"].append("RAW_LATEX_OR_BR")
    if re.search(r"정답|answer|choice|보기", raw, re.I):
        result["reasons"].append("ANSWER_LEAK_TOKEN")
    hashes = {root.attrib.get("data-fact-hash"), root.attrib.get("data-visual-case")}
    if None in hashes or "" in hashes:
        result["reasons"].append("PROVENANCE_METADATA_MISSING")
    polylines = [node for node in root.iter() if local_name(node.tag) == "polyline"]
    result["polylineCount"] = len(polylines)
    result["polylineTokenCounts"] = [points_count(node.attrib.get("points", "")) for node in polylines]
    if item["visualType"] == "cartesian" and any(count != 401 for count in result["polylineTokenCounts"]):
        result["reasons"].append("NON_DENSE_OR_UNEXPECTED_POLYLINE")
    text_nodes = [node for node in root.iter() if local_name(node.tag) == "text"]
    result["textCount"] = len(text_nodes)
    result["emptyTextCount"] = sum(not "".join(node.itertext()).strip() for node in text_nodes)
    if result["emptyTextCount"]:
        result["reasons"].append("EMPTY_LABEL")
    result["status"] = "STATIC_CHECKED_NO_PASS" if not result["reasons"] else "STATIC_FAIL"
    return result


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    rows = [check(item) for item in manifest["rows"]]
    output = {
        "schemaVersion": "HS_QUADRATIC_CANDIDATE_STATIC_CHECK_V1",
        "status": "STATIC_CHECKED_NO_PASS" if all(row["status"] == "STATIC_CHECKED_NO_PASS" for row in rows) else "STATIC_FAIL",
        "candidateManifest": MANIFEST.relative_to(ROOT).as_posix(),
        "rows": rows,
        "note": "Static validity does not establish V2 artifact-only facts, V3 parity, solution parity, or render PASS.",
    }
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"status": output["status"], "rows": len(rows), "passLikeStaticRows": sum(row["status"] == "STATIC_CHECKED_NO_PASS" for row in rows), "failRows": sum(row["status"] == "STATIC_FAIL" for row in rows)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
