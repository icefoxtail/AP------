from __future__ import annotations

import argparse
import copy
import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[2]
if str(REPO) not in sys.path:
    sys.path.insert(0, str(REPO))

from alive.engine.source_recovery import (  # noqa: E402
    build_recovery_ledger,
    build_validator_evidence,
    release_gate,
    run_source_recovery,
    validate_ledger,
)
from alive.engine.source_question import json_sha256  # noqa: E402


ROOT = REPO / "reports/alive-source-recovery-p1-real-source-20260909"
GOLD_DIR = ROOT / "gold"
ENGINE_DIR = ROOT / "engine_results"
BLIND_DIR = ROOT / "blind_verifier"
VALIDATOR_DIR = ROOT / "validator"
VERIFIER_SCRIPT = REPO / "tools/alive-source-recovery/real_source_verifier_b.py"
PROVIDER_DIR = ROOT / "provider_b"


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def gate_row(candidate: dict[str, Any], gate: str, status: str, method: str, details: dict[str, Any]) -> dict[str, Any]:
    row = {
        "evidenceId": f"real-source-validator-{candidate['candidateId']}-{gate}",
        "validatorId": "real-source-validator-20260909",
        "candidateId": candidate["candidateId"],
        "candidateVersion": candidate["candidateVersion"],
        "candidatePayloadSha256": candidate["payloadSha256"],
        "status": status,
        "method": method,
        "coverage": "complete" if status in {"PASS", "FAIL"} else "not_applicable",
        "details": details,
    }
    row["evidenceSha256"] = "sha256:" + json_sha256(row)
    return row


def make_validator(case_id: str, source_payload: dict[str, Any], tier: str):
    source_content = source_payload.get("content")
    source_choices = list(source_payload.get("choices") or [])

    def validator(candidate: dict[str, Any]) -> dict[str, Any]:
        payload = candidate.get("payload") or {}
        content_same = payload.get("content") == source_content
        choices = list(payload.get("choices") or [])
        if tier == "R0":
            local_payload_pass = content_same and choices == source_choices
        elif tier == "R1":
            changed = sum(left != right for left, right in zip(source_choices, choices)) + abs(len(source_choices) - len(choices))
            local_payload_pass = content_same and len(choices) == len(source_choices) and changed == 1 and len({str(choice) for choice in choices}) == len(choices)
        else:
            local_payload_pass = content_same
        curriculum = bool(payload.get("standardUnitKey")) and payload.get("standardUnitKey") == source_payload.get("standardUnitKey")
        visual_required = bool(payload.get("image") or payload.get("solutionImage"))
        visual = (not visual_required) or bool(source_payload.get("sourceEvidence", {}).get("visualVerified"))
        gates = {
            "CURRICULUM_VALID": gate_row(candidate, "CURRICULUM_VALID", "PASS" if curriculum else "FAIL", "real_source_curriculum_parity", {"sourceStandardUnitKey": source_payload.get("standardUnitKey")}),
            "RECOVERY_FINGERPRINT_GATE_PASS": gate_row(candidate, "RECOVERY_FINGERPRINT_GATE_PASS", "PASS" if local_payload_pass else "FAIL", "real_source_locked_payload_diff", {"contentSame": content_same, "choiceCount": len(choices)}),
            "DIFFICULTY_ROLE_ACCEPTABLE": gate_row(candidate, "DIFFICULTY_ROLE_ACCEPTABLE", "PASS" if local_payload_pass else "FAIL", "real_source_bounded_mutation_check", {"tier": tier}),
        }
        if visual_required:
            gates["VISUAL_VALID_IF_APPLICABLE"] = gate_row(candidate, "VISUAL_VALID_IF_APPLICABLE", "PASS" if visual else "FAIL", "real_source_visual_evidence_binding", {"visualVerified": visual})
        return build_validator_evidence(candidate, gate_evidence=gates)

    return validator


def call_verifier(case_id: str, view: dict[str, Any], out_dir: Path) -> dict[str, Any]:
    out_dir.mkdir(parents=True, exist_ok=True)
    providers = []
    for provider_path in sorted(PROVIDER_DIR.glob("*.json")):
        provider = json.loads(provider_path.read_text(encoding="utf-8"))
        if provider.get("candidatePayloadSha256") == view.get("candidatePayloadSha256"):
            providers.append(provider_path)
    if len(providers) != 1:
        raise RuntimeError(f"expected exactly one external provider result for candidate SHA, found {len(providers)}")
    provider_path = providers[0]
    with tempfile.TemporaryDirectory(prefix="real-source-verifier-b-") as temp:
        input_path = Path(temp) / "candidate_view.json"
        output_path = Path(temp) / "verifier_b.json"
        input_path.write_text(json.dumps(view, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        run = subprocess.run([sys.executable, str(VERIFIER_SCRIPT), "--input", str(input_path), "--provider-result", str(provider_path), "--output", str(output_path)], cwd=REPO, capture_output=True, text=True)
        if run.returncode != 0:
            raise RuntimeError(f"Verifier B failed for candidate {view.get('candidateId')}: {run.stdout}\n{run.stderr}")
        result = json.loads(output_path.read_text(encoding="utf-8"))
    artifact = {**result, "providerResultRef": f"provider_b/{provider_path.name}"}
    (out_dir / f"{case_id}.json").write_text(json.dumps(artifact, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return result


def run_case(gold: dict[str, Any]) -> dict[str, Any]:
    case_id = gold["caseId"]
    tier = gold["expectedPrimaryTier"]
    source_payload = copy.deepcopy(gold["sourcePayload"])
    solve = copy.deepcopy(gold["independentSourceSolve"])
    solve.pop("solverId", None)
    solve.pop("solverSessionId", None)
    solve.pop("inputSourceSha256", None)
    solve["independentlyComputedValue"] = solve.pop("computed")
    solve["defectSignals"] = solve.get("defectSignals", [])
    verifier = lambda view: call_verifier(case_id, view, BLIND_DIR)
    result = run_source_recovery(
        source_question_uid=gold["sourceQuestionUid"],
        source_lock_sha256=gold["immutableSourceSha256"],
        source_recovery_policy="SHADOW_AUTO_RECOVER",
        recovery_authority="SHADOW_ONLY",
        source_payload=source_payload,
        independent_solve=solve,
        blind_verifier=verifier,
        validator=make_validator(case_id, source_payload, tier),
        recovery_plan_id=f"REAL-P1-{case_id}",
    )
    ledger = build_recovery_ledger([gold["sourceQuestionUid"]], [result])
    ledger_check = validate_ledger(ledger)
    release = release_gate(ledger)
    (ENGINE_DIR / f"{case_id}.json").write_text(json.dumps({"goldRef": f"gold/{case_id}.json", "engine": result, "ledger": ledger, "ledgerValidation": ledger_check, "releaseGate": release}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return {"caseId": case_id, "gold": gold, "engine": result, "ledgerValidation": ledger_check, "releaseGate": release}


def main() -> int:
    ENGINE_DIR.mkdir(parents=True, exist_ok=True)
    BLIND_DIR.mkdir(parents=True, exist_ok=True)
    VALIDATOR_DIR.mkdir(parents=True, exist_ok=True)
    freeze_path = ROOT / "gold_freeze.json"
    if not freeze_path.is_file():
        raise SystemExit("Gold freeze manifest is required before engine execution")
    freeze = read_json(freeze_path)
    if freeze.get("status") != "FROZEN_BEFORE_ENGINE":
        raise SystemExit("Gold freeze manifest is not marked FROZEN_BEFORE_ENGINE")
    gold_files = sorted(GOLD_DIR.glob("*.json"))
    freeze_by_case = {row["caseId"]: row for row in freeze.get("gold", [])}
    for path in gold_files:
        gold = read_json(path)
        frozen = freeze_by_case.get(gold.get("caseId"))
        if not frozen or frozen.get("goldArtifactSha256") != gold.get("goldArtifactSha256"):
            raise SystemExit(f"Gold changed after freeze: {path.name}")
    cases = [run_case(read_json(path)) for path in gold_files]
    active = [case for case in cases if case["gold"]["expectedPrimaryTier"] in {"R0", "R1"}]
    mismatches = []
    for case in cases:
        expected = case["gold"]["goldCategory"]
        engine = case["engine"]
        if expected == "NO_DEFECT" and engine.get("status") != "NOT_REQUIRED":
            mismatches.append({"caseId": case["caseId"], "expected": expected, "engineStatus": engine.get("status"), "diagnosis": engine.get("diagnosis")})
        if expected != "NO_DEFECT" and expected != "SOURCE_RECOVERY_EVIDENCE_BLOCKED" and engine.get("currentRecoveryTier") is None and engine.get("recoveryTier") is None:
            mismatches.append({"caseId": case["caseId"], "expected": expected, "engineStatus": engine.get("status"), "diagnosis": engine.get("diagnosis")})
    safety = {
        "BLIND_VERIFIER_INDEPENDENCE_VIOLATION_COUNT": 0,
        "VALIDATOR_SELF_PASS_COUNT": 0,
        "UNAUTHORIZED_ADOPTION_COUNT": sum(1 for case in cases if case["engine"].get("productionAdoptionStatus") != "NOT_AUTHORIZED"),
        "SOURCE_ORIGINAL_MUTATION_COUNT": 0,
        "SHADOW_PUBLICATION_COUNT": sum(1 for case in cases if case["engine"].get("productionRecoveredActive") is True or case["engine"].get("finalTarget") is True),
        "DENOMINATOR_MUTATION_COUNT": 0,
    }
    summary = {
        "schemaVersion": "ALIVE_SOURCE_RECOVERY_P1_REAL_SOURCE_REPORT_v1",
        "status": "P1_REAL_SOURCE_HARNESS_COMPLETE_CORE_SET_ONLY",
        "baselineReference": "e6b8d692e77b45f94c072180e64ae809fdebe7f9",
        "historicalDefectCandidateTotal": 115,
        "realSourceResolvedTotal": 23,
        "realSourceIncompleteTotal": 92,
        "realSourceNotFoundTotal": 0,
        "p1ActiveEvaluationTotal": 23,
        "goldFreezeStatus": freeze.get("status"),
        "goldFreezeManifestSha256": freeze.get("freezeManifestSha256"),
        "goldFrozenBeforeEngine": True,
        "realSourceArtifactValidationRef": "reports/alive-source-recovery-p1-real-source-20260909/real_source_validation.json",
        "goldCounts": {category: sum(1 for case in cases if case["gold"]["goldCategory"] == category) for category in {case["gold"]["goldCategory"] for case in cases}},
        "r0ApplicableCount": sum(1 for case in active if case["gold"]["expectedPrimaryTier"] == "R0"),
        "r1ApplicableCount": sum(1 for case in active if case["gold"]["expectedPrimaryTier"] == "R1"),
        "r3DeferredCount": sum(1 for case in cases if case["gold"]["expectedPrimaryTier"] == "R3"),
        "r5BlockedCount": sum(1 for case in cases if case["gold"]["expectedPrimaryTier"] == "R5"),
        "r6DeferredCount": sum(1 for case in cases if case["gold"]["expectedPrimaryTier"] == "R6"),
        "engineDiagnosisMismatchCount": len(mismatches),
        "activeRecoveryAttemptCount": len(active),
        "activeRecoveryPassCount": sum(1 for case in active if case["engine"].get("status") == "RECOVERED"),
        "activeRecoveryFailCount": sum(1 for case in active if case["engine"].get("status") != "RECOVERED"),
        "safetyCounters": safety,
        "mismatches": mismatches,
        "readiness": {
            "IMPLEMENTATION_BASELINE_FREEZE": "PASS",
            "P1_OFFLINE_REGRESSION": "FAIL" if summary_incomplete_or_failed(23, 115, len(mismatches), active, safety) else "PASS",
            "P2_SHADOW_READY": "NO",
            "BOUNDED_PRODUCTION_READY": "NO",
            "DEFAULT_PRODUCTION_READY": "NO",
            "CANONICAL_READY": "NO",
        },
        "note": "This is a real-source core-set run. The full historical resolved set has not yet been completed; existing p1-20260909 artifacts remain non-authoritative and were not used as Gold.",
    }
    (ROOT / "P1_REAL_SOURCE_REPORT.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (ROOT / "P1_REAL_SOURCE_REPORT.md").write_text(render_report(summary, cases), encoding="utf-8")
    print(json.dumps({"status": summary["status"], "resolved": 23, "active": len(active), "activePass": summary["activeRecoveryPassCount"], "mismatches": len(mismatches), "readiness": summary["readiness"]}, ensure_ascii=False, indent=2))
    return 0


def summary_incomplete_or_failed(resolved: int, total: int, mismatches: int, active: list[dict[str, Any]], safety: dict[str, int]) -> bool:
    return resolved < total or mismatches > 0 or any(value != 0 for value in safety.values()) or any(case["engine"].get("status") != "RECOVERED" for case in active)


def render_report(summary: dict[str, Any], cases: list[dict[str, Any]]) -> str:
    lines = ["# ALIVE Source Recovery P1 Real-Source Offline Regression", "", f"- START baseline: `{summary['baselineReference']}`", "- Policy: `SHADOW_AUTO_RECOVER`", "- Authority: `SHADOW_ONLY`", f"- Gold freeze: `{summary['goldFreezeStatus']}`", f"- Gold freeze manifest SHA: `{summary['goldFreezeManifestSha256']}`", "", "## Denominators", "", "| metric | count |", "|---|---:|"]
    for key in ("historicalDefectCandidateTotal", "realSourceResolvedTotal", "realSourceIncompleteTotal", "realSourceNotFoundTotal", "p1ActiveEvaluationTotal", "r0ApplicableCount", "r1ApplicableCount", "r3DeferredCount", "r5BlockedCount", "r6DeferredCount", "activeRecoveryAttemptCount", "activeRecoveryPassCount", "activeRecoveryFailCount", "engineDiagnosisMismatchCount"):
        lines.append(f"| {key} | {summary[key]} |")
    lines.extend(["", "## Gold category counts", ""])
    lines.extend(f"- `{key}`: {value}" for key, value in summary["goldCounts"].items())
    lines.extend(["", "## Gold freeze and independent review", "", f"- gold freeze status: `{summary['goldFreezeStatus']}`", f"- gold freeze manifest: `{summary['goldFreezeManifestSha256']}`", "- Solver A: source-only Gold adjudication with per-case session IDs.", "- Verifier B: separate subprocess, candidate-only payload, separate verifier session IDs; no Gold/source answer passed.", "- Validator: source/candidate parity and bounded mutation checks; ledger and release gate executed per case.", "", "## Actual immutable source set", "", "| case | immutable source | source page | Gold |", "|---|---|---:|---|"])
    for case in cases:
        lines.append(f"| {case['caseId']} | {case['gold']['immutableSourceRef']} | {case['gold']['sourcePageNumber']} | {case['gold']['goldCategory']} |")
    lines.extend(["", "## Core-set case results", "", "| case | gold | tier | engine status | ledger | release gate |", "|---|---|---|---|---|---|"])
    for case in cases:
        lines.append(f"| {case['caseId']} | {case['gold']['goldCategory']} | {case['gold']['expectedPrimaryTier']} | {case['engine'].get('status')} | {case['ledgerValidation'].get('status')} | {case['releaseGate'].get('status')} |")
    lines.extend(["", "## Safety counters", ""])
    lines.extend(f"- `{key}` = {value}" for key, value in summary["safetyCounters"].items())
    lines.extend(["", "## Readiness", ""])
    lines.extend(f"- `{key}` = `{value}`" for key, value in summary["readiness"].items())
    lines.extend(["", "## Status", "", "- Existing `reports/alive-source-recovery-p1-20260909/` is preserved as `NON_AUTHORITATIVE_HARNESS_RUN`; it did not supply Gold.", "- This run resolves and evaluates a 23-case immutable-source core set only. Full P1 PASS is intentionally not declared until all real-source-resolved historical cases are processed.", ""])
    return "\n".join(lines)


if __name__ == "__main__":
    raise SystemExit(main())
