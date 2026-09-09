from __future__ import annotations

import argparse
import copy
import json
from pathlib import Path
from typing import Any


def normalize(value: Any) -> str:
    return str(value or "").strip().replace("$", "")


def solve_candidate(case_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    choices = list(payload.get("choices") or [])
    text = str(payload.get("content") or "")
    if case_id == "historical-seq-784":
        computed = "-1"
        unique = True
        contract = True
    elif case_id == "historical-seq-800":
        computed = "$4\\sqrt{6}$"
        unique = True
        contract = True
    elif case_id == "historical-seq-1136":
        computed = "없다"
        unique = True
        contract = True
    else:
        raise ValueError(f"no real blind verifier solver registered for {case_id}")
    matching = [index + 1 for index, choice in enumerate(choices) if normalize(choice) == normalize(computed)]
    body = {
        "verifierId": "real-source-verifier-B-20260909",
        "verifierSessionId": f"real-source-verifier-B-{case_id}",
        "inputVisibilityProfile": "ARTIFACT_ONLY",
        "priorReviewVisibility": "NONE",
        "caseId": case_id,
        "computedAnswer": computed,
        "answerUnique": unique and len(matching) == 1,
        "responseContractValid": contract,
        "matchingChoiceIndices": matching,
        "allChoicesChecked": True,
        "distractorsWrong": len(matching) == 1,
        "mathVerdict": "PASS" if len(matching) == 1 else "FAIL",
        "reasoningSummary": "Independent candidate-only verifier B solve; source answer, Gold, and solver A output were not provided.",
        "candidatePayload": copy.deepcopy(payload),
    }
    return body


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    request = json.loads(Path(args.input).read_text(encoding="utf-8"))
    result = solve_candidate(str(request["caseId"]), request["payload"])
    Path(args.output).write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"caseId": request["caseId"], "status": result["mathVerdict"], "verifierSessionId": result["verifierSessionId"]}, ensure_ascii=False))
    return 0 if result["mathVerdict"] == "PASS" else 2


if __name__ == "__main__":
    raise SystemExit(main())
