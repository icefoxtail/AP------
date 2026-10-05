from pathlib import Path
import json

root = Path(__file__).resolve().parent
rows = []
for p in sorted((root / "coordinate-parity").glob("2024-q*.json")) + sorted((root / "coordinate-parity").glob("2023-q*.json")):
    if p.name.endswith("input.json"):
        continue
    d = json.loads(p.read_text(encoding="utf-8"))
    rows.append({"file": p.name, "questionId": d.get("questionId"), "svg": d.get("svg"), "svgSha256": d.get("svgSha256"), "expectedFactCount": d.get("expectedFactCount"), "observedFactCount": d.get("observedFactCount"), "factParityPassCount": d.get("factParityPassCount"), "svgMathStatus": d.get("svgMathStatus"), "svgFinalStatus": d.get("svgFinalStatus"), "failures": d.get("failures", [])})
out = {"targetExistingSvgCount": 13, "status": "PASS" if len(rows) == 13 and all(r["svgMathStatus"] == "PASS" and r["factParityPassCount"] == r["expectedFactCount"] for r in rows) else "FAIL", "rows": rows, "expectedTotalFacts": sum(r["expectedFactCount"] for r in rows), "observedTotalFacts": sum(r["observedFactCount"] for r in rows), "parityTotal": sum(r["factParityPassCount"] for r in rows)}
(root / "coordinate-parity-summary.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps({"status":out["status"],"svgCount":len(rows),"expectedTotalFacts":out["expectedTotalFacts"],"parityTotal":out["parityTotal"]},ensure_ascii=False,indent=2))
