from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
MANIFEST = REPORT / "69_deterministic_candidate_visual_manifest_r11.json"
OUTPUT = REPORT / "71_deterministic_candidate_visual_static_check_r11.json"
SVG_NS = "{http://www.w3.org/2000/svg}"

manifest = json.loads(MANIFEST.read_text(encoding="utf-8")); rows = []; errors = []
for item in manifest["rows"]:
    path = ROOT / item["assetPath"]; row_errors = []
    if not path.exists(): row_errors.append("MISSING_ASSET")
    else:
        raw = path.read_bytes()
        try: root = ET.fromstring(raw)
        except ET.ParseError as exc: root = None; row_errors.append(f"XML_PARSE:{exc}")
        if root is not None:
            if root.tag != f"{SVG_NS}svg": row_errors.append("ROOT_NOT_SVG")
            if root.attrib.get("data-visual-case") != item["caseId"]: row_errors.append("CASE_ID_MISMATCH")
            if root.attrib.get("data-fact-hash") != item["factSha256"]: row_errors.append("FACT_HASH_MISMATCH")
            if root.attrib.get("preserveAspectRatio") != "xMidYMid meet": row_errors.append("RESPONSIVE_VIEWPORT_MISSING")
            if not root.attrib.get("viewBox"): row_errors.append("VIEWBOX_MISSING")
            if root.find(f"{SVG_NS}title") is None: row_errors.append("TITLE_MISSING")
            text = " ".join(node.text or "" for node in root.iter() if node.tag == f"{SVG_NS}text")
            if not re.search(r"[가-힣]", text): row_errors.append("KOREAN_LABEL_MISSING")
            if "font-family" not in raw.decode("utf-8"): row_errors.append("FONT_FAMILY_MISSING")
            if len(raw) < 1000: row_errors.append("ASSET_TOO_SMALL")
    rows.append({"questionUid": item["questionUid"], "caseId": item["caseId"], "assetPath": item["assetPath"], "errors": row_errors, "status": "STATIC_CHECKED" if not row_errors else "STATIC_CHECK_FAILED"}); errors.extend({"questionUid": item["questionUid"], "error": error} for error in row_errors)
output = {"schemaVersion": "HS_QUADRATIC_DETERMINISTIC_CANDIDATE_VISUAL_STATIC_CHECK_R11", "status": "STATIC_CHECK_PASS_NO_FINAL_PASS" if not errors else "STATIC_CHECK_FAIL", "productionAuthorized": False, "rows": rows, "errorCount": len(errors), "errors": errors, "note": "Static SVG XML/metadata/font checks only; current pipeline V2/V3 and provider render review remain separate."}
OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"status": output["status"], "rows": len(rows), "errorCount": len(errors)}, ensure_ascii=False, indent=2))
