from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
FACTS = REPORT / "01_calibration_v1_source_only.json"
A1 = REPORT / "02_math_a1_blind.json"
BANKS = REPORT / "06_calibration_candidate_bank_manifest_r3.json"
OUTPUT = REPORT / "09_solution_candidate_comparison.json"


def load_bank(path: Path) -> dict:
    namespace = {"window": {}}
    source = path.read_text(encoding="utf-8")
    # Candidate banks are JSON-serialized questionBank assignments. Extract the
    # payload without importing or executing any production code.
    title = re.search(r"window\.examTitle\s*=\s*(\"(?:\\.|[^\"])*\")", source)
    bank = re.search(r"window\.questionBank\s*=\s*(\[[\s\S]*\]);\s*$", source)
    if not bank:
        raise ValueError(f"candidate bank parse failed: {path}")
    return {"examTitle": json.loads(title.group(1)) if title else "", "questionBank": json.loads(bank.group(1))}


def main() -> None:
    facts = json.loads(FACTS.read_text(encoding="utf-8"))
    a1 = {row["questionUid"]: row for row in json.loads(A1.read_text(encoding="utf-8"))["questions"]}
    manifest = json.loads(BANKS.read_text(encoding="utf-8"))
    bank_cache = {}
    rows = []
    for item in manifest["rows"]:
        candidate_path = ROOT / item["candidatePath"]
        bank_cache.setdefault(str(candidate_path), load_bank(candidate_path))
        candidate = next(q for q in bank_cache[str(candidate_path)]["questionBank"] if int(q["id"]) == int(item["id"]))
        a1_row = a1[item["questionUid"]]
        answer_text = a1_row["computedAnswer"]
        answer_parity = answer_text == str(candidate.get("answer", ""))
        wording_ok = True
        if int(item["id"]) == 20:
            wording_ok = "아래로 볼록한 포물선" in candidate["solution"] and "위로 볼록한 포물선" not in candidate["solution"]
        if int(item["id"]) == 22:
            wording_ok = "위로 볼록한 포물선" in candidate["solution"] and "아래로 볼록한 포물선" not in candidate["solution"]
        rows.append({"questionUid": item["questionUid"], "candidatePath": item["candidatePath"], "id": item["id"], "independentAnswer": answer_text, "sourceAnswerVisibility": "NOT_USED_FOR_A1; comparison target only", "answerParity": "PASS" if answer_parity else "FAIL", "solutionNonempty": bool(str(candidate.get("solution", "")).strip()), "solutionDirectionalWording": "PASS" if wording_ok else "FAIL", "inlineSvgRemoved": not bool(re.search(r"<svg\b", str(candidate.get("solution", "")), re.I)), "status": "CANDIDATE_SOLUTION_REVIEWED_NO_FINAL_PASS" if answer_parity and wording_ok else "CANDIDATE_SOLUTION_FAIL"})
    output = {"schemaVersion": "HS_QUADRATIC_SOLUTION_CANDIDATE_COMPARISON_V1", "status": "CANDIDATE_SOLUTION_REVIEWED_NO_FINAL_PASS" if all(row["status"] == "CANDIDATE_SOLUTION_REVIEWED_NO_FINAL_PASS" for row in rows) else "CANDIDATE_SOLUTION_FAIL", "rows": rows, "note": "A1 was source-only; this comparison reveals source answer and candidate solution only after A1 freeze. It is not provider-attested final evidence."}
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"status": output["status"], "rows": len(rows), "answerParityPass": sum(row["answerParity"] == "PASS" for row in rows), "directionalWordingPass": sum(row["solutionDirectionalWording"] == "PASS" for row in rows), "inlineSvgRemoved": sum(row["inlineSvgRemoved"] for row in rows)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
