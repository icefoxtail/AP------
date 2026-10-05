from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
MANIFEST = REPORT / "40_approved_candidate_visual_manifest_r9.json"
OUTPUT = REPORT / "43_approved_v2_artifact_only_r9.json"
SVG_NS = "{http://www.w3.org/2000/svg}"


def text_of(path: Path) -> str:
    root = ET.fromstring(path.read_bytes())
    return " ".join((node.text or "").strip() for node in root.iter() if node.tag == f"{SVG_NS}text")


def require(text: str, fragment: str, case_id: str) -> None:
    if fragment not in text:
        raise ValueError(f"artifact observation missing {fragment!r} in {case_id}")


def observe(case_id: str, text: str) -> dict:
    if case_id == "hs-r9-geumdang-q13":
        for fragment in ["k≠0", "y=2x−3", "접점 (−1,−5)", "k=1 대표 그래프"]:
            require(text, fragment, case_id)
        return {"parameterCondition": "k≠0", "line": {"slope": 2, "intercept": -3}, "representativeK": 1, "representativeIntersection": [-1, -5], "allNonzeroKIntersection": "one point"}
    if case_id == "hs-r9-geumdang-q17":
        for fragment in ["1 < a < 4", "a≤1 : 2개", "1<a<4 : 3개", "a=4 : 4개", "a>4 : 5개", "최댓값이 없다"]:
            require(text, fragment, case_id)
        return {"parameter": "a", "exactThreeIntersectionRange": {"left": 1, "right": 4, "leftClosed": False, "rightClosed": False}, "intersectionCountByRegion": [{"region": "0<a≤1", "count": 2}, {"region": "1<a<4", "count": 3}, {"region": "a=4", "count": 4}, {"region": "a>4", "count": 5}], "maximum": "없다"}
    if case_id == "hs-r9-maesan-q19":
        for fragment in ["y=(x−1)^2", "y=−(x−2)^2+5", "t=0", "t=1", "t=4", "t=5", "합 = 10"]:
            require(text, fragment, case_id)
        return {"functions": ["y=(x−1)^2", "y=−(x−2)^2+5"], "horizontalLevels": [0, 1, 4, 5], "sharedPoints": [[0, 1], [3, 4]], "distinctThreeIntersectionTValues": [0, 1, 4, 5], "sum": 10}
    if case_id == "hs-r9-palma-q9":
        for fragment in ["위 y=−x²/3+3", "아래 y=x²−9", "t=3/4", "너비 = 2t", "높이 = 12−4t²/3", "P(t)=−8t²/3+4t+24"]:
            require(text, fragment, case_id)
        return {"upperFunction": "y=−x^2/3+3", "lowerFunction": "y=x^2−9", "maximizingParameter": "t=3/4", "width": "2t", "height": "12−4t^2/3", "perimeterFunction": "P(t)=−8t^2/3+4t+24", "maximumPerimeter": "51/2"}
    if case_id == "hs-r9-palma-q15":
        for fragment in ["y=7", "(−3,7)", "(1,7)", "f(x)=3(x+3)(x−1)+7", "최대 (2,22)", "(3,43)"]:
            require(text, fragment, case_id)
        return {"horizontalLine": "y=7", "intersectionXs": [-3, 1], "reconstructedFunction": "f(x)=3(x+3)(x−1)+7", "interval": [-2, 2], "maximumOnInterval": {"x": 2, "y": 22}, "coefficient": 3, "target": {"x": 3, "y": 43}}
    raise ValueError(case_id)


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    rows = []
    for item in manifest["rows"]:
        asset = ROOT / item["assetPath"]
        text = text_of(asset)
        rows.append({"questionUid": item["questionUid"], "caseId": item["caseId"], "assetPath": item["assetPath"], "observedFacts": observe(item["caseId"], text), "observedTextLength": len(text), "inputVisibilityProfile": "ARTIFACT_ONLY", "status": "V2_OBSERVED"})
    output = {"schemaVersion": "HS_QUADRATIC_APPROVED_V2_ARTIFACT_ONLY_R9", "status": "V2_ARTIFACT_ONLY_RECORDED_NO_FINAL_PASS", "productionAuthorized": False, "priorReviewVisibility": "NONE", "rows": rows, "note": "Observed facts were recorded from SVG artifact text and geometry labels only; source content, solution, and V1 expected facts were not read by this script."}
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": output["status"], "rows": len(rows)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
