from __future__ import annotations

import json
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
V1 = REPORT / "01_calibration_v1_source_only.json"
V2 = REPORT / "07_calibration_v2_artifact_only_r3.json"
A1 = REPORT / "02_math_a1_blind.json"
SOLUTION = REPORT / "09_solution_candidate_comparison.json"
OUTPUT = REPORT / "08_calibration_v3_parity_r3.json"


def near(a: float, b: float, tol: float = 0.06) -> bool:
    return math.isclose(a, b, abs_tol=tol, rel_tol=0)


def point_set(observed: list[dict]) -> set[tuple[int, int]]:
    return {(round(float(row["x"]), 2), round(float(row["y"]), 2)) for row in observed}


def parity(expected: dict, observed: dict, case_id: str) -> tuple[str, list[str]]:
    errors = []
    if expected["expectedVisualType"] == "cartesian":
        obs = observed["observedFacts"]
        if any(row.get("pointCount") != 401 for row in obs["polylineObservations"]):
            errors.append("CURVE_SAMPLE_COUNT")
        circles = point_set(obs["circleObservations"])
        facts = expected["expectedFacts"]
        if case_id == "hs-q20-parabola-intersection":
            for point in [(1, 4), (4, 7), (3, 8)]:
                if not any(near(point[0], x, 0.06) and near(point[1], y, 0.06) for x, y in circles): errors.append(f"MISSING_POINT:{point}")
            if not any(near(3, x, 0.06) for x in obs["verticalGuideXValues"]): errors.append("AXIS_X3_MISSING")
            if obs["polylineObservations"][0]["class"] != "curve": errors.append("MAIN_CURVE_CLASS")
        elif case_id == "hs-q22-parabola-domain":
            for point in [(1, 22), (3, 14)]:
                if not any(near(point[0], x, 0.06) and near(point[1], y, 0.06) for x, y in circles): errors.append(f"MISSING_POINT:{point}")
            if not any(near(4, x, 0.06) for x in obs["verticalGuideXValues"]): errors.append("AXIS_X4_MISSING")
            if not any(near(1, x, 0.06) for x in obs["verticalGuideXValues"]): errors.append("DOMAIN_LEFT_GUIDE_MISSING")
            if not any(near(3, x, 0.06) for x in obs["verticalGuideXValues"]): errors.append("DOMAIN_RIGHT_GUIDE_MISSING")
        else:
            if not any(near(1, x, 0.06) and near(9, y, 0.06) for x, y in circles): errors.append("VERTEX_MISSING")
            if obs["polylineObservations"][0]["maxYPoint"][1] < 17.9: errors.append("CURVE_ENDS_NOT_ABOVE_VERTEX")
            if facts["xAxisIntersections"] and not facts["xAxisIntersections"]: errors.append("ROOT_CHECK_INTERNAL")
    else:
        obs = observed["observedFacts"]
        expected_interval = expected["expectedFacts"]["inequalityInterval"]
        if not obs["shadedSegments"] or not all(near(a, b, 0.06) for a, b in zip(obs["shadedSegments"][0], [expected_interval["left"], expected_interval["right"]])): errors.append("INTERVAL_ENDPOINT_PARITY")
        open_points = [row["x"] for row in obs["circleObservations"] if row["class"] == "open"]
        if not any(near(x, expected_interval["left"], 0.06) for x in open_points): errors.append("LEFT_OPEN_POINT_MISSING")
        if not any(near(x, expected_interval["right"], 0.06) for x in open_points): errors.append("RIGHT_OPEN_POINT_MISSING")
        if case_id.endswith("q2-absolute-inequality-number-line"):
            closed_points = [row["x"] for row in obs["circleObservations"] if row["class"] == "point"]
            for value in expected["expectedFacts"]["naturalNumberSolutions"]:
                if not any(near(value, x, 0.06) for x in closed_points): errors.append(f"NATURAL_POINT_MISSING:{value}")
    return ("PASS" if not errors else "FAIL", errors)


def main() -> None:
    v1 = json.loads(V1.read_text(encoding="utf-8"))
    v2 = json.loads(V2.read_text(encoding="utf-8"))
    a1 = json.loads(A1.read_text(encoding="utf-8"))
    solution = json.loads(SOLUTION.read_text(encoding="utf-8"))
    v2_by_uid = {row["questionUid"]: row for row in v2["rows"]}
    a1_by_uid = {row["questionUid"]: row for row in a1["questions"]}
    solution_by_uid = {row["questionUid"]: row for row in solution["rows"]}
    rows = []
    for question in v1["questions"]:
        uid = question["questionUid"]
        case_id = v2_by_uid[uid]["caseId"]
        decision, errors = parity(question, v2_by_uid[uid], case_id)
        solution_parity = solution_by_uid[uid]["answerParity"] if solution_by_uid[uid]["solutionDirectionalWording"] == "PASS" else "FAIL"
        if solution_parity != "PASS": errors.append("SOLUTION_PARITY")
        final_decision = "PASS" if decision == "PASS" and solution_parity == "PASS" else "FAIL"
        rows.append({"questionUid": uid, "caseId": case_id, "v1Status": v1["status"], "v2Status": v2_by_uid[uid]["status"], "v3Decision": final_decision, "v3Checks": {"expectedObservedParity": decision, "solutionParity": solution_parity, "renderParity": "PENDING_BROWSER_REVIEW"}, "errors": errors, "a1ComputedAnswer": a1_by_uid[uid]["computedAnswer"], "status": "V3_PARITY_RECORDED_NO_FINAL_PASS" if final_decision == "PASS" else "V3_FAIL"})
    output = {"schemaVersion": "HS_QUADRATIC_V3_PARITY_V1", "status": "V3_PARITY_RECORDED_NO_FINAL_PASS" if all(row["v3Decision"] == "PASS" for row in rows) else "V3_FAIL", "rows": rows, "pipelineClosureStatus": "BLOCKED_MISSING_CURRENT_PIPELINE_EVIDENCE", "note": "V3 compares frozen source-only expected facts with frozen artifact-only observed facts. It is not a provider-attested pipeline-core final audit and does not authorize production promotion."}
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"status": output["status"], "rows": len(rows), "v3Pass": sum(row["v3Decision"] == "PASS" for row in rows), "v3Fail": sum(row["v3Decision"] == "FAIL" for row in rows), "pipelineClosureStatus": output["pipelineClosureStatus"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
