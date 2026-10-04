from __future__ import annotations

import argparse
import copy
import json
import sys
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[2]
if str(REPO) not in sys.path:
    sys.path.insert(0, str(REPO))

from alive.engine.source_question import json_sha256


FORBIDDEN_PAYLOAD_FIELDS = {
    "answer",
    "solution",
    "printedAnswer",
    "intendedAnswer",
    "repairTargetAnswer",
    "previousVerdict",
    "builderAnswer",
    "builderSolution",
}


def normalize(value: Any) -> str:
    text = str(value or "").strip()
    return text.replace("$", "").replace(r"\(", "").replace(r"\)", "")


def read(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"expected object: {path}")
    return value


def adapt_provider_result(candidate: dict[str, Any], provider: dict[str, Any]) -> dict[str, Any]:
    payload = candidate.get("payload") or {}
    leaked = sorted(FORBIDDEN_PAYLOAD_FIELDS.intersection(payload))
    if leaked:
        raise ValueError(f"candidate-only payload contains forbidden fields: {','.join(leaked)}")
    if provider.get("candidateId") != candidate.get("candidateId"):
        raise ValueError("provider candidateId binding mismatch")
    if provider.get("candidateVersion") != candidate.get("candidateVersion"):
        raise ValueError("provider candidateVersion binding mismatch")
    if provider.get("candidatePayloadSha256") != candidate.get("candidatePayloadSha256"):
        raise ValueError("provider candidatePayloadSha256 binding mismatch")
    if provider.get("inputVisibilityProfile") != "ARTIFACT_ONLY":
        raise ValueError("provider visibility profile must be ARTIFACT_ONLY")
    if provider.get("mathVerdict") != "PASS":
        raise ValueError("provider math verdict is not PASS")
    if provider.get("allChoicesChecked") is not True:
        raise ValueError("provider did not check all choices")

    raw_answer = provider.get("computedAnswer")
    choices = list(payload.get("choices") or [])
    matching = [index + 1 for index, choice in enumerate(choices) if normalize(choice) == normalize(raw_answer)]
    reported_matching = provider.get("matchingChoiceIndices")
    if not isinstance(reported_matching, list) or [int(value) for value in reported_matching] != matching:
        raise ValueError("provider choice-index result does not match candidate choices")
    if provider.get("answerUnique") is not True or len(matching) != 1:
        raise ValueError("provider answer is not unique in candidate choices")
    if provider.get("responseContractValid") is not True or provider.get("distractorsWrong") is not True:
        raise ValueError("provider response contract did not PASS")

    exact_answer = choices[matching[0] - 1] if matching else raw_answer
    body = {
        "candidateId": candidate.get("candidateId"),
        "candidateVersion": candidate.get("candidateVersion"),
        "candidatePayloadSha256": candidate.get("candidatePayloadSha256"),
        "verifierId": provider["verifierId"],
        "verifierSessionId": provider["verifierSessionId"],
        "inputVisibilityProfile": "ARTIFACT_ONLY",
        "blindInput": copy.deepcopy(payload),
        "independentlyComputedValue": exact_answer,
        "independentlyComputedAnswer": exact_answer,
        "answerUnique": True,
        "responseContractValid": True,
        "allChoicesChecked": True,
        "distractorsWrong": True,
        "mathVerdict": "PASS",
        "providerReasoningSummary": provider.get("reasoningSummary", ""),
    }
    body["evidenceSha256"] = "sha256:" + json_sha256(body)
    return body


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--provider-result", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    candidate = read(Path(args.input))
    provider = read(Path(args.provider_result))
    evidence = adapt_provider_result(candidate, provider)
    Path(args.output).write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": "PASS", "verifierId": evidence["verifierId"], "verifierSessionId": evidence["verifierSessionId"]}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
