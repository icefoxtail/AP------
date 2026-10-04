from __future__ import annotations

import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
MANIFEST = REPORT / (sys.argv[1] if len(sys.argv) > 1 else "69_deterministic_candidate_visual_manifest_r11.json")
OUTPUT = REPORT / (sys.argv[2] if len(sys.argv) > 2 else "73_deterministic_v2_artifact_only_r11.json")
SVG_NS = "{http://www.w3.org/2000/svg}"

manifest = json.loads(MANIFEST.read_text(encoding="utf-8")); rows = []
for item in manifest["rows"]:
    root = ET.fromstring((ROOT / item["assetPath"]).read_bytes())
    text = " ".join((node.text or "").strip() for node in root.iter() if node.tag == f"{SVG_NS}text")
    rows.append({
        "questionUid": item["questionUid"],
        "caseId": item["caseId"],
        "assetPath": item["assetPath"],
        "artifactFactHash": root.attrib.get("data-fact-hash"),
        "artifactVisualType": "number-line" if "부등식 해집합 수직선" in text or "음수 p 후보" in text else "case-table" if "조건별 판정" in text else "cartesian",
        "observedText": text,
        "observedElements": {
            "svgTitlePresent": root.find(f"{SVG_NS}title") is not None,
            "polylineCount": len(root.findall(f"{SVG_NS}polyline")),
            "lineCount": len(root.findall(f"{SVG_NS}line")),
            "circleCount": len(root.findall(f"{SVG_NS}circle")),
            "textCount": len(root.findall(f"{SVG_NS}text")),
            "responsiveViewBox": root.attrib.get("preserveAspectRatio") == "xMidYMid meet",
        },
        "inputVisibilityProfile": "ARTIFACT_ONLY",
        "priorReviewVisibility": "NONE",
        "status": "V2_OBSERVED_RECORDED_NO_SEMANTIC_PASS"
    })
output = {
    "schemaVersion": "HS_QUADRATIC_DETERMINISTIC_V2_ARTIFACT_ONLY_R11",
    "status": "V2_ARTIFACT_ONLY_RECORDED_NO_FINAL_PASS",
    "productionAuthorized": False,
    "rows": rows,
    "semanticIndependentFactAdjudication": "PENDING",
    "note": "This pass reads SVG XML/text only and records observed artifact structure. It does not read V1 facts, problem source, or solution, and intentionally does not infer PASS from the embedded fact hash. Independent V3 semantic comparison remains pending."
}
OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"status": output["status"], "rows": len(rows), "semanticIndependentFactAdjudication": output["semanticIndependentFactAdjudication"]}, ensure_ascii=False, indent=2))
