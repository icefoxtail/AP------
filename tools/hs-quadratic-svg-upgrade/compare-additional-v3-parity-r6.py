from __future__ import annotations

import json
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
FACTS = json.loads((REPORT / "25_additional_v1_expected_facts.json").read_text(encoding="utf-8"))
V2 = json.loads((REPORT / "28_additional_v2_artifact_only_r6.json").read_text(encoding="utf-8"))
BANK_MANIFEST = json.loads((REPORT / "30_additional_candidate_bank_manifest_r6.json").read_text(encoding="utf-8"))
OUTPUT = REPORT / "29_additional_v3_parity_r6.json"


def near(a: float, b: float, tolerance: float = 0.08) -> bool:
    return math.isclose(a, b, abs_tol=tolerance, rel_tol=0)


def has_point(circles: list[dict], x: float, y: float) -> bool:
    return any(near(circle["x"], x) and near(circle["y"], y) for circle in circles)


def main() -> None:
    v2_by_uid = {row["questionUid"]: row for row in V2["rows"]}
    bank_by_uid = {row["questionUid"]: row for row in BANK_MANIFEST["rows"]}
    rows = []
    for expected in FACTS["rows"]:
        uid = expected["questionUid"]
        observed = v2_by_uid[uid]["observedFacts"]
        circles = observed["circles"]
        errors = []
        if not observed["curves"] or observed["curves"][0]["pointCount"] != 401: errors.append("CURVE_DENSITY")
        f = expected["facts"]
        if "vertex" in f and not has_point(circles, *f["vertex"]): errors.append("VERTEX_PARITY")
        if "tangentX" in f and not has_point(circles, f["tangentX"], f["tangentX"] * f["tangentX"] * expected["function"]["a"] + f["tangentX"] * expected["function"]["b"] + expected["function"]["c"]): errors.append("TANGENT_POINT_PARITY")
        if "endpointValues" in f:
            for x_text, y in f["endpointValues"].items():
                if not has_point(circles, float(x_text), y): errors.append(f"ENDPOINT_PARITY:{x_text}")
        if "intersectionXs" in f:
            expected_line = expected.get("line", {})
            for x in f["intersectionXs"]:
                y = expected["function"]["a"] * x * x + expected["function"]["b"] * x + expected["function"]["c"]
                if not has_point(circles, x, y): errors.append(f"INTERSECTION_PARITY:{x}")
        if "interval" in f and not all(any(line["class"] == "guide" and near(line["x1"], value) and near(line["x2"], value) for line in observed["lines"]) for value in f["interval"]): errors.append("INTERVAL_GUIDE_PARITY")
        if "validAlpha" in f:
            for x in (f["validAlpha"], f["validBeta"]):
                y = expected["function"]["a"] * x * x + expected["function"]["b"] * x + expected["function"]["c"]
                if not has_point(circles, x, y): errors.append(f"ROOT_RATIO_POINT_PARITY:{x}")
        solution = bank_by_uid[uid]
        solution_status = "PASS" if solution else "FAIL"
        final_status = "PASS" if not errors and solution_status == "PASS" else "FAIL"
        rows.append({"questionUid": uid, "v2Status": v2_by_uid[uid]["status"], "v3Decision": final_status, "checks": {"expectedObservedParity": "PASS" if not errors else "FAIL", "solutionCandidateBound": solution_status, "render": "PENDING"}, "errors": errors, "status": "V3_PARITY_RECORDED_NO_FINAL_PASS" if final_status == "PASS" else "V3_FAIL"})
    output = {"schemaVersion": "HS_QUADRATIC_ADDITIONAL_V3_PARITY_R6", "status": "V3_PARITY_RECORDED_NO_FINAL_PASS" if all(row["v3Decision"] == "PASS" for row in rows) else "V3_FAIL", "rows": rows, "pipelineClosureStatus": "BLOCKED_MISSING_CURRENT_PIPELINE_EVIDENCE", "note": "Additional r6 parity is candidate evidence only; render and provider final audit remain open."}
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"status": output["status"], "rows": len(rows), "v3Pass": sum(row["v3Decision"] == "PASS" for row in rows), "v3Fail": sum(row["v3Decision"] == "FAIL" for row in rows)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
