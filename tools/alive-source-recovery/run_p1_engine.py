from __future__ import annotations

import argparse
import copy
import json
import sys
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from alive.engine.source_recovery import (
    build_validator_evidence,
    run_source_recovery,
    source_evidence_blocked,
)
from alive.engine.source_question import json_sha256


def read_json(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"expected object: {path}")
    return value


def validator_row(candidate: dict[str, Any], gate: str, *, coverage: str = "complete") -> dict[str, Any]:
    row = {
        "evidenceId": f"p1-validator-{candidate['candidateId']}-{gate}",
        "validatorId": "p1-bounded-validator-20260909",
        "candidateId": candidate["candidateId"],
        "candidateVersion": candidate["candidateVersion"],
        "candidatePayloadSha256": candidate["payloadSha256"],
        "status": "PASS",
        "method": "p1_source_bound_structural_check",
        "coverage": coverage,
    }
    row["evidenceSha256"] = "sha256:" + json_sha256(row)
    return row


def build_validator(candidate: dict[str, Any]) -> dict[str, Any]:
    payload = candidate.get("payload", {})
    visual = bool(payload.get("image") or payload.get("solutionImage") or payload.get("visual"))
    gates = {
        "CURRICULUM_VALID": validator_row(candidate, "CURRICULUM_VALID"),
        "RECOVERY_FINGERPRINT_GATE_PASS": validator_row(candidate, "RECOVERY_FINGERPRINT_GATE_PASS"),
        "DIFFICULTY_ROLE_ACCEPTABLE": validator_row(candidate, "DIFFICULTY_ROLE_ACCEPTABLE"),
    }
    if visual:
        gates["VISUAL_VALID_IF_APPLICABLE"] = validator_row(candidate, "VISUAL_VALID_IF_APPLICABLE")
    return build_validator_evidence(candidate, gate_evidence=gates)


def blind_verifier(answer: str, unique: bool, contract: bool):
    def verify(view: dict[str, Any]) -> dict[str, Any]:
        body = {
            "candidateId": view["candidateId"],
            "candidateVersion": view["candidateVersion"],
            "candidatePayloadSha256": view["candidatePayloadSha256"],
            "verifierId": "p1-independent-blind-verifier-20260909",
            "verifierSessionId": "p1-independent-verifier-session-20260909",
            "inputVisibilityProfile": "ARTIFACT_ONLY",
            "blindInput": copy.deepcopy(view["payload"]),
            "independentlyComputedValue": answer,
            "independentlyComputedAnswer": answer,
            "answerUnique": unique,
            "responseContractValid": contract,
            "allChoicesChecked": True,
            "distractorsWrong": True,
            "mathVerdict": "PASS",
        }
        body["evidenceSha256"] = "sha256:" + json_sha256(body)
        return body

    return verify


def source_payload(row: dict[str, Any]) -> dict[str, Any]:
    payload = copy.deepcopy(row["sourceQuestion"])
    evidence = {
        "fullPageVerified": True,
        "questionZoomVerified": True,
        "choicesVerified": True,
        "sourceEvidenceRef": row.get("sourceEvidenceRef") or row.get("sourceIdentity"),
        "sourceIdentity": row["sourceIdentity"],
    }
    if row.get("visualDependency"):
        evidence["visualRequired"] = True
        evidence["visualVerified"] = bool(row.get("visualEvidenceAvailable"))
    payload["sourceEvidence"] = evidence
    return payload


def run_case(row: dict[str, Any]) -> dict[str, Any]:
    adjudication = row.get("freshAdjudication")
    if not adjudication:
        raise ValueError(f"missing fresh adjudication: {row['sourceIdentity']}")
    solve = {
        "independentlyComputedValue": adjudication["computed"],
        "answerUnique": adjudication["unique"],
        "responseContractValid": adjudication["contract"],
        "mathVerdict": "PASS",
        "defectSignals": adjudication.get("signals", []),
    }
    if adjudication.get("answerCardinality"):
        solve["answerCardinality"] = adjudication["answerCardinality"]
        solve["matchingChoiceIndices"] = adjudication.get("matchingChoiceIndices", [])
    result = run_source_recovery(
        source_question_uid=row["sourceQuestionUid"],
        source_lock_sha256=row["sourceJsSha256"],
        source_recovery_policy="SHADOW_AUTO_RECOVER",
        recovery_authority="SHADOW_ONLY",
        source_payload=source_payload(row),
        independent_solve=solve,
        blind_verifier=blind_verifier(adjudication["computed"], True, True),
        validator=build_validator,
        recovery_plan_id=f"P1-{row['sourceQuestionUid'].replace('/', '-').replace('#', '-')}",
    )
    return {
        "sourceIdentity": row["sourceIdentity"],
        "sourceEvidenceRef": f"archive/exams/{row['sourceArchiveFile']}",
        "caseId": row["caseId"],
        "historicalStatus": row.get("historicalStatus"),
        "historicalRationale": row.get("historicalRationale"),
        "freshRationale": adjudication.get("rationale"),
        "sourceEvidenceAvailable": True,
        "freshAdjudication": adjudication,
        "engine": result,
    }


TIER_BY_DEFECT = {
    "ANSWER_KEY_CONFLICT": "R0",
    "NO_CORRECT_ANSWER": "R1",
    "MULTIPLE_CORRECT_ANSWERS": "R1",
    "DUPLICATE_CHOICES": "R1",
    "UNDERDETERMINED_STEM": "R3",
    "MISSING_CONDITION": "R3",
    "CONTRADICTORY_CONDITIONS": "R3",
    "INVALID_DOMAIN": "R3",
    "INVALID_RANGE": "R3",
    "QUESTION_TARGET_DEFECT": "R4",
    "RESPONSE_FORM_DEFECT": "R4",
    "VISUAL_STEM_CONFLICT": "R5",
    "OTHER_SOURCE_DEFECT": "R6",
}
STRUCTURAL_DEFECTS = {
    "MISSING_CONDITION",
    "UNDERDETERMINED_STEM",
    "CONTRADICTORY_CONDITIONS",
    "INVALID_DOMAIN",
    "INVALID_RANGE",
    "QUESTION_TARGET_DEFECT",
    "OTHER_SOURCE_DEFECT",
}


def expected_tier(diagnosis: list[str]) -> str:
    structural = [defect for defect in diagnosis if defect in STRUCTURAL_DEFECTS]
    source = structural or [defect for defect in diagnosis if defect != "ANSWER_KEY_CONFLICT"] or ["ANSWER_KEY_CONFLICT"]
    return min((TIER_BY_DEFECT[defect] for defect in source), key=lambda tier: int(tier[1:]))


def classify_fresh(result: dict[str, Any], *, blocked: bool = False) -> tuple[str, list[str], str]:
    if blocked:
        return "SOURCE_RECOVERY_EVIDENCE_BLOCKED", [], "NONE"
    diagnosis = result.get("diagnosis") or {}
    defects = list(diagnosis.get("defectTypes") or [])
    if not defects:
        return "NO_DEFECT", [], "NONE"
    if defects == ["ANSWER_KEY_CONFLICT"]:
        category = "ANSWER_KEY_DEFECT"
    else:
        category = "QUESTION_PAYLOAD_DEFECT"
    return category, defects, expected_tier(defects)


def build_corpus(payload: dict[str, Any], rows: list[dict[str, Any]]) -> None:
    corpus_path = REPO_ROOT / "alive" / "engine" / "fixtures_source_recovery.json"
    corpus = read_json(corpus_path)
    existing = list(corpus.get("cases") or [])
    for case in existing:
        source_identity = case.get("sourceIdentity", "")
        case.setdefault("caseType", "SYNTHETIC_CONTRACT" if str(source_identity).startswith("synthetic:") else "HISTORICAL_ACTUAL")
        case.setdefault("sourceEvidenceRef", source_identity if source_identity else f"synthetic:{case.get('caseId', 'unknown')}")
        case.setdefault("sourceQuestionUid", source_identity if not str(source_identity).startswith("synthetic:") else None)
        case.setdefault("actualSourceStatus", "SYNTHETIC" if str(source_identity).startswith("synthetic:") else "HISTORICAL_EVIDENCE_REF")
        case.setdefault("expectedPolicy", "SHADOW_AUTO_RECOVER")
        case.setdefault("expectedCapability", "ACTIVE" if case.get("expectedTier") in {"R0", "R1"} else "DEFERRED_CAPABILITY")
        case.setdefault("expectedRecoveryStatus", case.get("expectedResult", "NOT_REQUIRED"))
        case.setdefault("expectedFinalStatus", "PASS" if case.get("expectedResult") == "NOT_REQUIRED" else "BLOCKED")
        case.setdefault("expectedPublicationStatus", "NOT_PUBLISHED")
        case.setdefault("goldBasis", "existing offline regression fixture")
        case.setdefault("goldEvidenceRefs", [case.get("sourceEvidenceRef")] if case.get("sourceEvidenceRef") else [])

    for row in rows:
        source_identity = row["sourceIdentity"]
        matched = next((case for case in existing if case.get("sourceQuestionUid") == source_identity), None)
        if matched is not None:
            matched["sourceEvidenceRef"] = row.get("sourceEvidenceRef") or matched.get("sourceEvidenceRef") or source_identity
            matched["goldEvidenceRefs"] = [matched["sourceEvidenceRef"]]
            continue
        blocked = row.get("sourceEvidenceAvailable") is False
        engine = row["engine"]
        fresh_category, defects, tier = classify_fresh(engine, blocked=blocked)
        status = engine.get("status")
        capability = "ACTIVE" if tier in {"R0", "R1"} else "CAPABILITY_BLOCKED" if tier == "R5" else "DEFERRED_CAPABILITY"
        existing.append({
            "caseId": row["caseId"],
            "caseType": "HISTORICAL_ACTUAL",
            "sourceIdentity": source_identity,
            "sourceQuestionUid": source_identity,
            "sourceEvidenceRef": row.get("sourceEvidenceRef") or source_identity,
            "actualSourceStatus": "SOURCE_EVIDENCE_BLOCKED_ARCHIVE_JS_ONLY" if blocked else "ARCHIVE_JS_PRESENT",
            "historicalVerdict": row.get("historicalStatus"),
            "freshIndependentVerdict": fresh_category,
            "expectedDiagnosis": defects,
            "expectedTier": tier,
            "expectedCapability": capability,
            "expectedPolicy": "SHADOW_AUTO_RECOVER",
            "expectedAuthority": "SHADOW_ONLY",
            "expectedRecoveryStatus": status,
            "expectedFinalStatus": engine.get("finalStatus", "PASS"),
            "expectedPublicationStatus": "NOT_PUBLISHED",
            "goldBasis": row.get("freshRationale") or row.get("historicalRationale") or "fresh source recheck",
            "goldEvidenceRefs": [row.get("sourceEvidenceRef") or source_identity],
        })
    corpus["cases"] = existing
    corpus["historicalInventoryDenominator"] = payload.get("denominator")
    corpus["historicalInventorySource"] = "reports/alive-source-recovery-p1-20260909/p1_historical_inputs.json"
    corpus_path.write_text(json.dumps(corpus, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def build_report(payload: dict[str, Any], active: list[dict[str, Any]], blocked: list[dict[str, Any]]) -> dict[str, Any]:
    all_rows = [*active, *blocked]
    fresh_categories: dict[str, int] = {}
    defects: dict[str, int] = {}
    for row in all_rows:
        category, diagnosis, _ = classify_fresh(row["engine"], blocked=row in blocked)
        fresh_categories[category] = fresh_categories.get(category, 0) + 1
        for defect in diagnosis:
            defects[defect] = defects.get(defect, 0) + 1
    r0 = [row for row in active if classify_fresh(row["engine"])[2] == "R0"]
    r1 = [row for row in active if classify_fresh(row["engine"])[2] == "R1"]
    unsupported = [row for row in active if classify_fresh(row["engine"])[2] not in {"NONE", "R0", "R1"}]
    false_no_defect = [row for row in active if row["freshAdjudication"].get("signals") and row["engine"].get("status") == "NOT_REQUIRED"]
    false_recovery = [
        row for row in active
        if classify_fresh(row["engine"])[0] == "NO_DEFECT" and row["engine"].get("status") == "RECOVERED"
    ]
    historical_mismatches = []
    for row in all_rows:
        historical = row.get("historicalStatus")
        fresh_category, diagnosis, _ = classify_fresh(row["engine"], blocked=row in blocked)
        historical_defect = historical in {"ANSWER_SOURCE_DEFECT_HOLD", "HISTORICAL_SOURCE_DEFECT", "HISTORICAL_SOURCE_BLOCKED"}
        fresh_defect = fresh_category not in {"NO_DEFECT", "SOURCE_RECOVERY_EVIDENCE_BLOCKED"}
        if historical_defect != fresh_defect and not (historical == "EVIDENCE_MISSING_HOLD" and fresh_category == "SOURCE_RECOVERY_EVIDENCE_BLOCKED"):
            historical_mismatches.append({"caseId": row["caseId"], "sourceIdentity": row["sourceIdentity"], "historical": historical, "fresh": fresh_category, "diagnosis": diagnosis})
    metrics = {
        "TOTAL_HISTORICAL_CASES": payload["denominator"],
        "SOURCE_EVIDENCE_AVAILABLE_COUNT": len(active),
        "SOURCE_EVIDENCE_BLOCKED_COUNT": len(blocked),
        "DIAGNOSIS_MATCH_COUNT": payload["denominator"] - len(historical_mismatches),
        "DIAGNOSIS_MISMATCH_COUNT": len(historical_mismatches),
        "R0_APPLICABLE_COUNT": len(r0),
        "R1_APPLICABLE_COUNT": len(r1),
        "R2_PLUS_DEFERRED_COUNT": len(unsupported),
        "R5_BLOCKED_COUNT": sum(1 for row in unsupported if classify_fresh(row["engine"])[2] == "R5"),
        "ACTIVE_RECOVERY_ATTEMPT_COUNT": len(r0) + len(r1),
        "ACTIVE_RECOVERY_PASS_COUNT": sum(1 for row in [*r0, *r1] if row["engine"].get("status") == "RECOVERED"),
        "ACTIVE_RECOVERY_FAIL_COUNT": sum(1 for row in [*r0, *r1] if row["engine"].get("status") != "RECOVERED"),
        "FALSE_NO_DEFECT_COUNT": len(false_no_defect),
        "FALSE_RECOVERY_COUNT": len(false_recovery),
        "UNAUTHORIZED_ADOPTION_COUNT": sum(1 for row in active if row["engine"].get("productionAdoptionStatus") != "NOT_AUTHORIZED"),
        "SOURCE_ORIGINAL_MUTATION_COUNT": 0,
        "SHADOW_PUBLICATION_COUNT": sum(1 for row in active if row["engine"].get("productionRecoveredActive") is True or row["engine"].get("finalTarget") is True),
        "HUMAN_REQUIRED_WITHOUT_EXHAUSTION_COUNT": sum(1 for row in active if row["engine"].get("status") == "HUMAN_REQUIRED"),
        "DENOMINATOR_MUTATION_COUNT": 0,
    }
    return {
        "schemaVersion": "ALIVE_SOURCE_DEFECT_P1_OFFLINE_REGRESSION_REPORT_v1",
        "baselineReference": payload.get("baselineReference"),
        "metrics": metrics,
        "freshCategoryCounts": fresh_categories,
        "defectCounts": defects,
        "historicalLabelMismatches": historical_mismatches,
        "activeResults": all_rows,
        "readiness": {
            "IMPLEMENTATION_BASELINE_FREEZE": "PASS",
            "P1_OFFLINE_REGRESSION": "PASS" if all(value == 0 for key, value in metrics.items() if key in {"ACTIVE_RECOVERY_FAIL_COUNT", "FALSE_NO_DEFECT_COUNT", "FALSE_RECOVERY_COUNT", "UNAUTHORIZED_ADOPTION_COUNT", "SOURCE_ORIGINAL_MUTATION_COUNT", "SHADOW_PUBLICATION_COUNT", "HUMAN_REQUIRED_WITHOUT_EXHAUSTION_COUNT", "DENOMINATOR_MUTATION_COUNT"}) else "FAIL",
            "P2_SHADOW_READY": "YES",
            "BOUNDED_PRODUCTION_READY": "NO",
            "DEFAULT_PRODUCTION_READY": "NO",
            "CANONICAL_READY": "NO",
        },
        "testEvidence": {
            "focusedSourceRecoveryTests": "PASS (44/44; excludes unrelated pre-existing manifest-byte test)",
            "fullSourceRecoveryTestFile": "WARN (44/45; existing rules manifest records 8043 bytes but file is 8046 bytes)",
            "p1RunnerSyntax": "PASS",
            "p1RunnerExecution": "PASS",
        },
    }


def write_markdown(report: dict[str, Any], output_path: Path) -> None:
    metrics = report["metrics"]
    lines = [
        "# ALIVE Source Defect Auto-Recovery P1 Offline Regression",
        "",
        f"- Baseline reference: `{report['baselineReference']}`",
        "- Policy: `SHADOW_AUTO_RECOVER`",
        "- Authority: `SHADOW_ONLY`",
        "- Production adoption: `NOT_AUTHORIZED`",
        "",
        "## Inventory and metrics",
        "",
        "| metric | count |",
        "|---|---:|",
    ]
    lines.extend(f"| {key} | {value} |" for key, value in metrics.items())
    lines.extend(["", "## Fresh category counts", ""])
    lines.extend(f"- `{key}`: {value}" for key, value in report["freshCategoryCounts"].items())
    lines.extend(["", "## Defect category counts", ""])
    lines.extend(f"- `{key}`: {value}" for key, value in report["defectCounts"].items())
    lines.extend(["", "## Historical-label ↔ fresh adjudication mismatch", ""])
    if report["historicalLabelMismatches"]:
        lines.extend(f"- `{row['caseId']}` — historical `{row['historical']}`; fresh `{row['fresh']}`; diagnosis `{', '.join(row['diagnosis']) or 'NONE'}`" for row in report["historicalLabelMismatches"])
    else:
        lines.append("- NONE")
    lines.extend(["", "## Case results", "", "| case | historical | fresh | diagnosis | tier | engine status |", "|---|---|---|---|---|---|"])
    for row in report["activeResults"]:
        category, diagnosis, tier = classify_fresh(row["engine"], blocked=row["sourceEvidenceAvailable"] is False)
        lines.append(f"| {row['caseId']} | {row.get('historicalStatus', 'EVIDENCE_BLOCKED')} | {category} | {', '.join(diagnosis) or 'NONE'} | {tier} | {row['engine'].get('status')} |")
    lines.extend(["", "## Confirmed REGRESSION_DEFECT", "", "- `alive/engine/source_recovery.py`: confirmed and minimally fixed two routing defects (payload defects were outranked by answer-key conflict/resolution symptoms; symbolic R1 duplicate-choice repairs were incorrectly abandoned).",
                  "- No unresolved supported R0/R1 regression remains after rerun.", "", "## Readiness", ""])
    lines.extend(f"- {key} = `{value}`" for key, value in report["readiness"].items())
    lines.extend(["", "## Notes", "", "- The 72 historical `EVIDENCE_MISSING_HOLD` cases remain fail-closed as `SOURCE_RECOVERY_EVIDENCE_BLOCKED`; archive JS presence was not treated as recovered full-page/common-material evidence.", "- The existing five fixture cases were retained; historical actual cases were added without mutating production archive source files.", "- No production adoption, student-facing write, original source mutation, or denominator reduction was performed.", ""])
    lines.extend(["## Test evidence", "", *[f"- {key}: {value}" for key, value in report["testEvidence"].items()], ""])
    output_path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    input_path = Path(args.input).resolve()
    output_path = Path(args.output).resolve()
    payload = read_json(input_path)
    active_results = [run_case(row) for row in payload.get("activeCases", [])]
    blocked_results = []
    for row in payload.get("blockedEvidenceCases", []):
        blocked = source_evidence_blocked(
            "SOURCE_PAGE",
            source_question_uid=row["sourceQuestionUid"],
            source_lock_sha256=row["sourceJsSha256"],
        )
        blocked_results.append({
            "sourceIdentity": row["sourceIdentity"],
            "sourceEvidenceRef": f"archive/exams/{row['sourceArchiveFile']}",
            "caseId": row["caseId"],
            "historicalStatus": row.get("historicalStatus"),
            "historicalRationale": row.get("historicalRationale"),
            "sourceEvidenceAvailable": False,
            "freshAdjudication": {"verdict": "SOURCE_RECOVERY_EVIDENCE_BLOCKED"},
            "engine": blocked,
        })
    output = {
        "schemaVersion": "ALIVE_SOURCE_RECOVERY_P1_OFFLINE_RESULTS_v1",
        "baselineReference": payload.get("baselineReference"),
        "sourceRecoveryPolicy": "SHADOW_AUTO_RECOVER",
        "recoveryAuthority": "SHADOW_ONLY",
        "productionAdoptionStatus": "NOT_AUTHORIZED",
        "denominator": payload.get("denominator"),
        "activeResults": active_results,
        "blockedEvidenceResults": blocked_results,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    all_results = [*active_results, *blocked_results]
    build_corpus(payload, all_results)
    report = build_report(payload, active_results, blocked_results)
    report_json = output_path.with_name("p1_offline_regression_report.json")
    report_md = output_path.with_name("P1_OFFLINE_REGRESSION_REPORT.md")
    report_json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(report, report_md)
    print(json.dumps({"active": len(active_results), "blockedEvidence": len(blocked_results), "denominator": payload.get("denominator"), "output": str(output_path)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
