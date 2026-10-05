from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "reports/alive-source-recovery-p1-real-source-20260909"
REPO = Path(__file__).resolve().parents[2]


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> int:
    errors: list[str] = []
    resolution = json.loads((ROOT / "source_resolution.json").read_text(encoding="utf-8"))
    freeze = json.loads((ROOT / "gold_freeze.json").read_text(encoding="utf-8"))
    if freeze.get("status") != "FROZEN_BEFORE_ENGINE":
        errors.append("GOLD_FREEZE_STATUS_INVALID")
    if not (REPO / "reports/alive-source-recovery-p1-20260909/NON_AUTHORITATIVE_HARNESS_RUN.md").is_file():
        errors.append("OLD_HARNESS_NOT_MARKED_NON_AUTHORITATIVE")
    for row in resolution["resolvedCases"]:
        pdf_ref = row["immutableSourceRef"].removeprefix("external-source:")
        pdf = Path(pdf_ref)
        if not pdf.is_file():
            errors.append(f"IMMUTABLE_SOURCE_MISSING:{row['caseId']}")
        elif f"sha256:{sha256_file(pdf)}" != row["immutableSourceSha256"]:
            errors.append(f"IMMUTABLE_SOURCE_SHA_MISMATCH:{row['caseId']}")
        page = Path(row["sourcePageEvidenceRef"])
        if not page.is_file():
            errors.append(f"SOURCE_PAGE_EVIDENCE_MISSING:{row['caseId']}")
        elif f"sha256:{sha256_file(page)}" != row["sourcePageEvidenceSha256"]:
            errors.append(f"SOURCE_PAGE_SHA_MISMATCH:{row['caseId']}")
        gold_path = REPO / row["goldRef"]
        if not gold_path.is_file():
            errors.append(f"GOLD_MISSING:{row['caseId']}")
            continue
        gold = json.loads(gold_path.read_text(encoding="utf-8"))
        body = dict(gold)
        stored = body.pop("goldArtifactSha256", None)
        actual = "sha256:" + hashlib.sha256((json.dumps(body, ensure_ascii=False, sort_keys=True) + "\n").encode("utf-8")).hexdigest()
        if stored != actual or stored != row["goldSha256"]:
            errors.append(f"GOLD_SHA_MISMATCH:{row['caseId']}")
        evidence = gold.get("sourcePayload", {}).get("sourceEvidence", {})
        for field in ("fullPageVerified", "questionZoomVerified", "choicesVerified"):
            if evidence.get(field) is not True:
                errors.append(f"SOURCE_EVIDENCE_FLAG_INVALID:{row['caseId']}:{field}")
    verifier_violations = 0
    validator_self_pass = 0
    for engine_path in sorted((ROOT / "engine_results").glob("*.json")):
        engine_record = json.loads(engine_path.read_text(encoding="utf-8"))
        engine = engine_record["engine"]
        case_id = engine_path.stem
        gold = json.loads((ROOT / "gold" / f"{case_id}.json").read_text(encoding="utf-8"))
        gold_session = gold["independentSourceSolve"]["solverSessionId"]
        for candidate in engine.get("candidatePool", []):
            evidence = candidate.get("verifierEvidence") or {}
            if evidence.get("verifierSessionId") == gold_session:
                verifier_violations += 1
            blind = evidence.get("blindInput") or {}
            if any(field in blind for field in ("answer", "solution", "printedAnswer", "intendedAnswer", "repairTargetAnswer", "builderAnswer", "builderSolution")):
                verifier_violations += 1
            gates = (candidate.get("validatorEvidence") or {}).get("gates", {})
            for gate in ("CURRICULUM_VALID", "RECOVERY_FINGERPRINT_GATE_PASS", "DIFFICULTY_ROLE_ACCEPTABLE"):
                row = gates.get(gate) or {}
                if row.get("status") == "PASS" and row.get("method") == "bound_external_validator" and row.get("sourceValidatorId") != "real-source-validator-20260909":
                    validator_self_pass += 1
    report = json.loads((ROOT / "P1_REAL_SOURCE_REPORT.json").read_text(encoding="utf-8"))
    counters = report.get("safetyCounters", {})
    if verifier_violations:
        errors.append(f"BLIND_VERIFIER_INDEPENDENCE_VIOLATION:{verifier_violations}")
    if validator_self_pass:
        errors.append(f"VALIDATOR_SELF_PASS:{validator_self_pass}")
    result = {
        "schemaVersion": "ALIVE_SOURCE_RECOVERY_P1_REAL_SOURCE_VALIDATION_v1",
        "status": "PASS" if not errors else "FAIL",
        "goldFreezeStatus": freeze.get("status"),
        "goldCount": len(resolution["resolvedCases"]),
        "blindVerifierIndependenceViolationCount": verifier_violations,
        "validatorSelfPassCount": validator_self_pass,
        "safetyCounters": counters,
        "errors": errors,
    }
    (ROOT / "real_source_validation.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
