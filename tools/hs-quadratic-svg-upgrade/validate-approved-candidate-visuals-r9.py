from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
MANIFEST = REPORT / "40_approved_candidate_visual_manifest_r9.json"
OUTPUT = REPORT / "42_approved_candidate_visual_static_check_r9.json"
SVG_NS = "{http://www.w3.org/2000/svg}"


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    rows = []
    errors = []
    for item in manifest["rows"]:
        path = ROOT / item["assetPath"]
        row_errors = []
        if not path.exists():
            row_errors.append("missing_asset")
        else:
            raw = path.read_bytes()
            try:
                root = ET.fromstring(raw)
            except ET.ParseError as exc:
                row_errors.append(f"xml_parse:{exc}")
                root = None
            if root is not None:
                if root.tag != f"{SVG_NS}svg":
                    row_errors.append("root_not_svg")
                if root.attrib.get("data-visual-case") != item["caseId"]:
                    row_errors.append("case_id_mismatch")
                if root.attrib.get("data-fact-hash") != item["factSha256"]:
                    row_errors.append("fact_hash_mismatch")
                if root.attrib.get("preserveAspectRatio") != "xMidYMid meet":
                    row_errors.append("responsive_aspect_ratio_missing")
                if not root.attrib.get("viewBox"):
                    row_errors.append("viewbox_missing")
                if not root.find(f"{SVG_NS}title") is not None:
                    row_errors.append("title_missing")
                text = " ".join(node.text or "" for node in root.iter() if node.tag == f"{SVG_NS}text")
                if len(text.strip()) < 10:
                    row_errors.append("text_too_short")
                if not re.search(r"[가-힣]", text):
                    row_errors.append("korean_label_missing")
                if "font-family" not in raw.decode("utf-8"):
                    row_errors.append("font_fallback_missing")
                if len(raw) < 1000:
                    row_errors.append("asset_suspiciously_small")
        row = {"questionUid": item["questionUid"], "caseId": item["caseId"], "assetPath": item["assetPath"], "errors": row_errors, "status": "STATIC_CHECKED" if not row_errors else "STATIC_CHECK_FAILED"}
        rows.append(row)
        errors.extend({"questionUid": item["questionUid"], "error": error} for error in row_errors)
    output = {"schemaVersion": "HS_QUADRATIC_APPROVED_CANDIDATE_VISUAL_STATIC_CHECK_R9", "status": "STATIC_CHECK_PASS_NO_FINAL_PASS" if not errors else "STATIC_CHECK_FAIL", "productionAuthorized": False, "rows": rows, "errorCount": len(errors), "errors": errors, "note": "XML and structural checks only; this report does not substitute for artifact-only V2, V3, or actual desktop/mobile render review."}
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": output["status"], "rows": len(rows), "errorCount": len(errors)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
