from __future__ import annotations

import copy
import json
import tempfile
import unittest
from pathlib import Path

from alive.engine.source_recovery import (
    SourceRecoveryError,
    atomic_adopt_replacement,
    build_recovery_ledger,
    build_blind_verifier_adapter,
    build_tier_matrix,
    build_validator_evidence,
    candidate_acceptance,
    capability_registry_report,
    diagnose_source_defects,
    make_candidate_version,
    produce_recovery_candidates,
    rank_candidates,
    release_gate,
    RECOVERY_CODES,
    persist_source_recovery,
    resume_source_recovery,
    run_source_recovery,
    source_evidence_blocked,
    targeted_repair_candidate,
    validate_ledger,
    validate_replacement,
    validate_verifier_evidence,
    validate_design_mirror,
)
from alive.engine.run_store import RunStore
from alive.engine.alive_cli import build_parser
from alive.engine.source_question import extract_source_question, json_sha256
from alive.engine.run_store import sha256_file


def candidate_payload(**extra: object) -> dict[str, object]:
    return {"content": "bounded candidate", "choices": ["1", "2", "3", "4", "5"], **extra}


def verified_candidate(payload: dict[str, object], *, builder_session: str = "builder") -> dict[str, object]:
    candidate = make_candidate_version("RP-Q1-R1", payload)
    candidate["builderSessionId"] = builder_session
    evidence = {
        "candidateId": candidate["candidateId"],
        "candidateVersion": candidate["candidateVersion"],
        "candidatePayloadSha256": candidate["payloadSha256"],
        "verifierId": "blind-verifier",
        "verifierSessionId": "verifier-session",
        "inputVisibilityProfile": "ARTIFACT_ONLY",
        "blindInput": {"content": payload.get("content", ""), "choices": payload.get("choices", [])},
        "independentlyComputedAnswer": "1",
        "answerUnique": True,
        "responseContractValid": True,
        "allChoicesChecked": True,
        "distractorsWrong": True,
        "mathVerdict": "PASS",
    }
    evidence["evidenceSha256"] = "sha256:" + json_sha256(evidence)
    candidate["verifierEvidence"] = evidence
    candidate["validatorEvidence"] = build_validator_evidence(candidate)
    return candidate


def producer_attempt(tier: str, generated: int) -> dict[str, object]:
    return {
        "producerStatus": "COMPLETED",
        "attemptCount": 1,
        "candidateBudget": 1,
        "candidateBudgetConsumed": 1,
        "retryBudget": 0,
        "retryBudgetConsumed": True,
        "generatedCandidateCount": generated,
        "attemptEvidenceRef": f"attempt-{tier}",
        "attemptEvidenceSha": "sha256:" + "a" * 64,
        "allProducedCandidatesRejected": generated == 0,
    }


def closure_evidence(kind: str) -> dict[str, object]:
    return {
        "evidenceId": f"{kind}-closure-1",
        "evidenceRef": f"evidence/{kind}-closure-1.json",
        "evidenceSha256": "sha256:" + "c" * 64,
        "status": "PASS",
    }


def blind_verifier_evidence(view: dict[str, object], answer: str = "12") -> dict[str, object]:
    evidence = {
        "candidateId": view["candidateId"],
        "candidateVersion": view["candidateVersion"],
        "candidatePayloadSha256": view["candidatePayloadSha256"],
        "verifierId": "separate-blind-verifier",
        "verifierSessionId": "separate-blind-session",
        "inputVisibilityProfile": "ARTIFACT_ONLY",
        "blindInput": view["payload"],
        "independentlyComputedAnswer": answer,
        "answerUnique": True,
        "responseContractValid": True,
        "allChoicesChecked": True,
        "distractorsWrong": True,
        "mathVerdict": "PASS",
    }
    return {**evidence, "evidenceSha256": "sha256:" + json_sha256(evidence)}


class SourceRecoveryTests(unittest.TestCase):
    def test_cli_exposes_provider_neutral_recovery_route(self) -> None:
        args = build_parser().parse_args(["source-recovery-run", "--input", "request.json", "--json"])
        self.assertEqual("source-recovery-run", args.command)
        self.assertTrue(args.json)

    def test_capability_registry_does_not_claim_unimplemented_tiers_active(self) -> None:
        registry = capability_registry_report()
        self.assertEqual("BOUNDED_R0_R1_R3_ONLY", registry["status"])
        self.assertEqual("ACTIVE", registry["tiers"]["R0"]["status"])
        self.assertEqual("ACTIVE", registry["tiers"]["R1"]["status"])
        self.assertEqual("ACTIVE", registry["tiers"]["R3"]["status"])
        self.assertNotEqual("ACTIVE", registry["tiers"]["R5"]["status"])
        self.assertNotEqual("ACTIVE", registry["tiers"]["R6"]["status"])

    def test_sidecar_code_registry_covers_every_emitted_recovery_code(self) -> None:
        schema_doc = (Path(__file__).resolve().parents[2] / "03_SCHEMA/ALIVE_VALIDATION_SIDECAR_SCHEMA_v1.0.md").read_text(encoding="utf-8")
        for code in RECOVERY_CODES:
            with self.subTest(code=code):
                self.assertIn(f"`{code}`", schema_doc)

    def test_design_mirrors_and_historical_corpus_are_available(self) -> None:
        root = Path(__file__).resolve().parents[2]
        mirror = validate_design_mirror(
            root / "05_DESIGN/ALIVE_SOURCE_DEFECT_AUTORECOVERY_RULEBOOK_v1.2.md",
            root.parent / "docs/rules/05_DESIGN/ALIVE_SOURCE_DEFECT_AUTORECOVERY_RULEBOOK_v1.2.md",
        )
        self.assertEqual("PASS", mirror["status"])
        corpus = json.loads((root / "engine/fixtures_source_recovery.json").read_text(encoding="utf-8"))
        self.assertEqual("OFFLINE_REGRESSION_ONLY", corpus["status"])
        self.assertGreaterEqual(len(corpus["cases"]), 4)
        self.assertTrue({"ANSWER_KEY_DEFECT", "NO_CORRECT_ANSWER", "MULTIPLE_CORRECT_ANSWERS", "VISUAL_STEM_CONFLICT"}.issubset({d for case in corpus["cases"] for d in case["expectedDiagnosis"]}))
        for case in corpus["cases"]:
            evidence_ref = case.get("sourceEvidenceRef")
            if isinstance(evidence_ref, str) and not evidence_ref.startswith("synthetic:"):
                self.assertTrue((root.parent / evidence_ref).is_file(), evidence_ref)

    def test_tier_matrix_keeps_three_axes_independent(self) -> None:
        matrix = build_tier_matrix(
            ["MISSING_CONDITION"],
            {"R3": "ACTIVE", "R4": "CAPABILITY_BLOCKED", "R5": "DEFERRED_CAPABILITY"},
        )
        self.assertEqual("APPLICABLE_PRIMARY", matrix["R3"]["applicability"])
        self.assertEqual("CAPABILITY_BLOCKED", matrix["R4"]["capability"])
        self.assertEqual("NOT_RUN", matrix["R4"]["execution"])
        self.assertEqual("DEFERRED_CAPABILITY", matrix["R5"]["capability"])

    def test_applicability_is_diagnosis_specific(self) -> None:
        choice_matrix = build_tier_matrix(["NO_CORRECT_ANSWER"])
        self.assertEqual("NOT_APPLICABLE", choice_matrix["R5"]["applicability"])
        visual_matrix = build_tier_matrix(["VISUAL_STEM_CONFLICT"])
        self.assertEqual("APPLICABLE_PRIMARY", visual_matrix["R5"]["applicability"])
        answer_matrix = build_tier_matrix(["ANSWER_KEY_CONFLICT"])
        self.assertEqual("NOT_APPLICABLE", answer_matrix["R1"]["applicability"])

    def test_evidence_blocked_is_resumable_not_human_required(self) -> None:
        result = source_evidence_blocked("SOURCE_VISUAL", source_question_uid="Q17")
        self.assertEqual("SOURCE_RECOVERY_EVIDENCE_BLOCKED", result["status"])
        self.assertEqual("BLOCKED", result["finalStatus"])
        self.assertEqual("SOURCE_RECHECK", result["resumeFromStage"])

    def test_extraction_defect_is_routed_to_fidelity_restoration(self) -> None:
        result = run_source_recovery(
            source_question_uid="Q17",
            source_lock_sha256="b" * 64,
            source_payload={"sourceEvidence": {"fullPageVerified": True, "questionZoomVerified": True, "choicesVerified": True}},
            independent_solve={"extractionMatchesSource": False},
        )
        self.assertEqual("SOURCE_FIDELITY_RESTORATION", result["route"])
        self.assertNotIn("recoveredQuestionUid", result)

    def test_diagnosis_cannot_turn_invalid_independent_solve_or_structural_defects_into_no_defect(self) -> None:
        source = {
            "choices": ["1", "2", "3"],
            "sourceEvidence": {"fullPageVerified": True, "questionZoomVerified": True, "choicesVerified": True},
            "missingCondition": True,
            "targetValid": False,
        }
        invalid_math = diagnose_source_defects(source, {"mathVerdict": "FAIL"})
        self.assertNotEqual("NO_DEFECT", invalid_math["status"])
        invalid_contract = diagnose_source_defects(source, {"mathVerdict": "PASS", "answerUnique": False, "responseContractValid": False, "answer": "1"})
        self.assertNotEqual("NO_DEFECT", invalid_contract["status"])
        self.assertIn("MULTIPLE_CORRECT_ANSWERS", invalid_contract["defectTypes"])
        self.assertIn("RESPONSE_FORM_DEFECT", invalid_contract["defectTypes"])
        self.assertIn("MISSING_CONDITION", invalid_contract["defectTypes"])
        self.assertIn("QUESTION_TARGET_DEFECT", invalid_contract["defectTypes"])

    def test_evidence_block_checkpoint_resumes_with_new_source_material(self) -> None:
        blocked = run_source_recovery(
            source_question_uid="Q17",
            source_lock_sha256="b" * 64,
            source_evidence_available=False,
        )
        resumed = resume_source_recovery(
            blocked,
            source_payload={
                "content": "계산 결과를 고르시오.",
                "choices": ["3", "6", "9", "10", "15"],
                "answer": "①",
                "sourceEvidence": {"fullPageVerified": True, "questionZoomVerified": True, "choicesVerified": True},
            },
            independent_solve={"independentlyComputedAnswer": "12", "answerUnique": True, "responseContractValid": True, "mathVerdict": "PASS"},
            blind_verifier=lambda view: blind_verifier_evidence(view),
        )
        self.assertEqual("RECOVERED", resumed["status"])
        self.assertEqual("SOURCE_RECOVERY_EVIDENCE_BLOCKED", blocked["status"])

    def test_preserve_only_blocks_release_but_execution_can_continue(self) -> None:
        result = run_source_recovery(
            source_question_uid="Q1",
            source_lock_sha256="a" * 64,
            defect_types=["NO_CORRECT_ANSWER"],
            source_recovery_policy="PRESERVE_ONLY",
        )
        self.assertEqual("PRESERVE_ONLY", result["status"])
        self.assertTrue(release_gate(build_recovery_ledger(["Q1"], [result]))["errors"])
        self.assertTrue(release_gate(build_recovery_ledger(["Q1"], [result]))["executionContinues"])

    def test_answer_key_defect_uses_r0_without_payload_recovery(self) -> None:
        result = run_source_recovery(
            source_question_uid="Q1",
            source_lock_sha256="a" * 64,
            defect_types=["ANSWER_KEY_CONFLICT"],
            candidates_by_tier={"R0": [verified_candidate(candidate_payload(correctedAnswer="③"))] },
            attempts_by_tier={"R0": producer_attempt("R0", 1)},
        )
        self.assertEqual("R0", result["recoveryTier"])
        self.assertEqual("ANSWER_KEY_RECOVERED", result["recoveryDisposition"])
        self.assertIsNone(result["replacementDisposition"])
        result["finalTarget"] = True
        self.assertEqual("PASS", release_gate(build_recovery_ledger(["Q1"], [result]))["status"])
        result["answerKeyResolution"].pop("verifierEvidenceSha256")
        self.assertEqual("BLOCKED", release_gate(build_recovery_ledger(["Q1"], [result]))["status"])

    def test_source_defect_categories_route_to_expected_tiers(self) -> None:
        expected = {
            "NO_CORRECT_ANSWER": "R1",
            "DUPLICATE_CHOICES": "R1",
            "SIGN_DEFECT": "R2",
            "UNDERDETERMINED_STEM": "R3",
            "QUESTION_TARGET_DEFECT": "R4",
            "VISUAL_STEM_CONFLICT": "R5",
            "OTHER_SOURCE_DEFECT": "R6",
        }
        for defect, tier in expected.items():
            with self.subTest(defect=defect):
                matrix = build_tier_matrix([defect])
                self.assertEqual(
                    tier,
                    next(key for key, row in matrix.items() if row["applicability"] == "APPLICABLE_PRIMARY"),
                )

    def test_candidate_acceptance_is_fail_closed_and_independent(self) -> None:
        candidate = verified_candidate(candidate_payload())
        accepted = candidate_acceptance(candidate, recovery_tier="R1", independent_verification="PASS")
        self.assertEqual("PASS", accepted["status"])
        rejected = candidate_acceptance(
            verified_candidate({**candidate_payload(), "x": 1}),
            recovery_tier="R1",
            independent_verification="FAIL",
        )
        self.assertEqual("FAIL", rejected["status"])
        self.assertIn("INDEPENDENT_VERIFICATION_VERDICT_MISMATCH", rejected["failedGates"])

    def test_missing_or_mismatched_verifier_evidence_cannot_claim_pass(self) -> None:
        candidate = make_candidate_version("RP-Q1-R1", candidate_payload())
        missing = candidate_acceptance(candidate, recovery_tier="R1")
        self.assertEqual("FAIL", missing["status"])
        self.assertIn("INDEPENDENT_VERIFIER_EVIDENCE_REQUIRED", missing["failedGates"])
        forged = verified_candidate(candidate_payload())
        forged["verifierEvidence"]["candidatePayloadSha256"] = "sha256:" + "0" * 64
        mismatched = candidate_acceptance(forged, recovery_tier="R1")
        self.assertEqual("FAIL", mismatched["status"])
        self.assertIn("VERIFIER_CANDIDATE_SHA_MISMATCH", mismatched["failedGates"])
        self_claim = make_candidate_version("RP-Q1-R1", {**candidate_payload(), "acceptanceGates": {"MATH_VALID": "PASS"}})
        self.assertEqual("FAIL", candidate_acceptance(self_claim, recovery_tier="R1")["status"])

    def test_automatic_diagnosis_producer_and_blind_verifier_close_r1_shadow_lane(self) -> None:
        result = run_source_recovery(
            source_question_uid="Q17",
            source_lock_sha256="b" * 64,
            source_payload={
                "content": "다음 계산 결과를 고르시오.",
                "choices": ["3", "6", "9", "10", "15"],
                "answer": "②",
                "sourceEvidence": {
                    "fullPageVerified": True,
                    "questionZoomVerified": True,
                    "choicesVerified": True,
                },
            },
            independent_solve={
                "independentlyComputedAnswer": "12",
                "answerUnique": True,
                "responseContractValid": True,
                "mathVerdict": "PASS",
            },
            blind_verifier=lambda view: blind_verifier_evidence(view),
        )
        self.assertEqual("NO_CORRECT_ANSWER", result["diagnosis"]["defectTypes"][0])
        self.assertEqual("RECOVERED", result["status"])
        self.assertEqual("R1", result["recoveryTier"])
        self.assertEqual("NOT_AUTHORIZED", result["productionAdoptionStatus"])
        self.assertEqual("PASS", result["candidatePool"][0]["acceptance"]["verifierEvidence"]["status"])
        result["finalTarget"] = True
        shadow_gate = release_gate(build_recovery_ledger(["Q17"], [result]))
        self.assertEqual("BLOCKED", shadow_gate["status"])

    def test_historical_source_question_runs_through_r3_shadow_e2e(self) -> None:
        repository = Path(__file__).resolve().parents[3]
        source_path = repository / "archive/exams/original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js"
        source = extract_source_question(source_path, 18, {"sha256": sha256_file(source_path)})
        payload = dict(source["question"])
        payload.update({
            "sourceEvidence": {
                "fullPageVerified": True,
                "questionZoomVerified": True,
                "choicesVerified": True,
                "sourceEvidenceRef": "archive/analysis/2026-09-02-issues-only-report.md#L6-L15",
            },
            "defectSignals": ["UNDERDETERMINED_STEM", "MISSING_CONDITION"],
            "recoveryCondition": "n은 양의 정수이다",
        })
        result = run_source_recovery(
            source_question_uid=f"{source['source']['path']}|18",
            source_lock_sha256=source["source"]["sha256"],
            source_payload=payload,
            independent_solve={
                "independentlyComputedAnswer": "9",
                "answerUnique": False,
                "responseContractValid": True,
                "mathVerdict": "PASS",
                "solution": "양의 정수 조건을 포함하면 n=9이다.",
            },
            blind_verifier=lambda view: blind_verifier_evidence(view, "9"),
        )
        self.assertEqual("UNDERDETERMINED_STEM", result["diagnosis"]["defectTypes"][0])
        self.assertEqual("RECOVERED", result["status"])
        self.assertEqual("R3", result["recoveryTier"])
        self.assertEqual("MISSING_CONDITION", result["candidatePool"][0]["producerKind"])
        self.assertEqual("PASS", result["candidatePool"][0]["acceptance"]["verifierEvidence"]["status"])
        ledger = build_recovery_ledger([result["sourceQuestionUid"]], [result])
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            js = root / "recovered.js"
            question = dict(result["candidatePool"][0]["payload"])
            question["id"] = 1
            js.write_text(
                'window.examTitle = "recovered-e2e";\nwindow.questionBank = '
                + json.dumps([question], ensure_ascii=False)
                + ";\n",
                encoding="utf-8",
            )
            ledger_path = root / "source-recovery-ledger.json"
            ledger_path.write_text(json.dumps(ledger, ensure_ascii=False), encoding="utf-8")
            from alive.engine.final_closure import audit_final_closure

            closure = audit_final_closure(root, js, None, None, None, source_recovery_ledger_path=ledger_path)
            self.assertEqual("PASS", closure["sourceRecovery"]["status"])
            self.assertEqual("NOT_PUBLISHED", closure["publicationStatus"])

    def test_r1_producer_has_separate_normalizers_for_each_choice_defect(self) -> None:
        cases = [
            (
                "NO_CORRECT_ANSWER",
                {"content": "x", "choices": ["3", "6", "9"], "answer": "①"},
                {"defectTypes": ["NO_CORRECT_ANSWER"], "matchingChoiceIndices": []},
                "12",
                ["12", "6", "9"],
            ),
            (
                "MULTIPLE_CORRECT_ANSWERS",
                {"content": "x", "choices": ["12", "12", "9"], "recoveryReplacementChoice": "10"},
                {"defectTypes": ["MULTIPLE_CORRECT_ANSWERS"], "matchingChoiceIndices": [1, 2]},
                "12",
                ["12", "10", "9"],
            ),
            (
                "DUPLICATE_CHOICES",
                {"content": "x", "choices": ["4", "4", "6"], "recoveryReplacementChoice": "9"},
                {"defectTypes": ["DUPLICATE_CHOICES"], "matchingChoiceIndices": [3]},
                "6",
                ["4", "9", "6"],
            ),
        ]
        for kind, source, diagnosis, answer, expected_choices in cases:
            with self.subTest(kind=kind):
                candidates, _ = produce_recovery_candidates(
                    source,
                    {"independentlyComputedAnswer": answer},
                    diagnosis,
                    recovery_plan_id=f"RP-Q1-{kind}",
                )
                self.assertEqual(1, len(candidates["R1"]))
                candidate = candidates["R1"][0]
                self.assertEqual(kind, candidate["producerKind"])
                self.assertEqual(expected_choices, candidate["payload"]["choices"])

    def test_json_blind_verifier_adapter_is_separate_from_source_solve(self) -> None:
        adapter = build_blind_verifier_adapter({
            "verifierId": "separate-verifier",
            "verifierSessionId": "separate-session",
            "independentlyComputedAnswer": "12",
            "answerUnique": True,
            "responseContractValid": True,
            "allChoicesChecked": True,
            "distractorsWrong": True,
            "mathVerdict": "PASS",
        })
        view = {
            "candidateId": "candidate-1",
            "candidateVersion": 1,
            "candidatePayloadSha256": "sha256:" + "a" * 64,
            "payload": {"content": "x", "choices": ["12", "2"]},
            "builderSessionId": "builder-session",
        }
        evidence = adapter(view)
        candidate = {"candidateId": "candidate-1", "candidateVersion": 1, "payloadSha256": "sha256:" + "a" * 64, "payload": view["payload"], "builderSessionId": "builder-session", "verifierEvidence": evidence}
        self.assertEqual("PASS", validate_verifier_evidence(candidate, evidence)["status"])
        self.assertEqual("separate-verifier", evidence["verifierId"])
        self.assertNotIn("answer", evidence["blindInput"])

    def test_empty_candidate_without_attempt_stays_pending(self) -> None:
        result = run_source_recovery(
            source_question_uid="Q17",
            source_lock_sha256="b" * 64,
            defect_types=["NO_CORRECT_ANSWER"],
            candidates_by_tier={},
        )
        self.assertNotEqual("HUMAN_REQUIRED", result["status"])
        self.assertEqual("AVAILABLE_PENDING", result["tierMatrix"]["R1"]["execution"])

    def test_targeted_repair_creates_new_immutable_version(self) -> None:
        original = make_candidate_version("RP-Q1-R3", candidate_payload(value=1))
        snapshot = copy.deepcopy(original)
        repaired = targeted_repair_candidate(original, candidate_payload(value=2))
        self.assertEqual(snapshot, original)
        self.assertEqual("RP-Q1-R3", repaired["recoveryPlanId"])
        self.assertEqual(2, repaired["candidateVersion"])
        self.assertEqual(original["candidateId"], repaired["parentCandidateId"])
        self.assertNotEqual(original["payloadSha256"], repaired["payloadSha256"])

    def test_targeted_repair_rejects_non_local_or_unfrozen_mutation(self) -> None:
        candidate = make_candidate_version("RP-Q1-R3", candidate_payload())
        with self.assertRaises(SourceRecoveryError):
            targeted_repair_candidate(candidate, candidate_payload(), locked_core_unchanged=False)
        not_frozen = {**candidate, "freeze": {"status": "DRAFT"}}
        with self.assertRaises(SourceRecoveryError):
            targeted_repair_candidate(not_frozen, candidate_payload())

    def test_one_to_one_adoption_is_atomic(self) -> None:
        recovered = run_source_recovery(
            source_question_uid="Q17",
            source_lock_sha256="b" * 64,
            defect_types=["NO_CORRECT_ANSWER"],
            source_recovery_policy="AUTO_RECOVER",
            recovery_authority="BOUNDED_PRODUCTION",
            initial_scope_uids=["Q1", "Q17", "Q18"],
            authorization={"status": "PASS", "authorizationRef": "auth/rp-q17.json"},
            quality_closure_evidence=closure_evidence("quality"),
            lineage_parity_evidence=closure_evidence("lineage"),
            candidates_by_tier={"R1": [verified_candidate(candidate_payload(effectiveArtifactUid="Q17-R"))] },
            attempts_by_tier={"R1": producer_attempt("R1", 1)},
        )
        self.assertEqual("ADOPTED", recovered["productionAdoptionStatus"])
        self.assertEqual("DERIVED_REPLACEMENT_VERIFIED", recovered["replacementDisposition"])
        self.assertFalse(recovered["productionOriginalActive"])
        self.assertTrue(recovered["productionRecoveredActive"])
        self.assertEqual(
            "PASS",
            release_gate(build_recovery_ledger(["Q1", "Q17", "Q18"], [recovered]))["status"],
        )

    def test_atomic_adoption_does_not_leave_adopted_on_failure(self) -> None:
        recovered = run_source_recovery(
            source_question_uid="Q17",
            source_lock_sha256="b" * 64,
            defect_types=["NO_CORRECT_ANSWER"],
            source_recovery_policy="SHADOW_AUTO_RECOVER",
            candidates_by_tier={"R1": [verified_candidate(candidate_payload(effectiveArtifactUid="Q17-R"))] },
            attempts_by_tier={"R1": producer_attempt("R1", 1)},
        )
        before = copy.deepcopy(recovered)
        recovered["productionAdoptionStatus"] = "AUTHORIZED"
        with self.assertRaises(SourceRecoveryError):
            atomic_adopt_replacement(
                recovered,
                authorization={"status": "FAIL", "authorizationRef": "auth/nope"},
                initial_scope_uids=["Q17"],
                initial_scope_sha256="sha256:" + "0" * 64,
            )
        self.assertEqual("RECOVERED", recovered["status"])
        self.assertEqual("AUTHORIZED", recovered["productionAdoptionStatus"])
        self.assertEqual(before["sourceQuestionUid"], recovered["sourceQuestionUid"])
        with self.assertRaises(SourceRecoveryError):
            atomic_adopt_replacement(
                recovered,
                authorization={"status": "PASS", "authorizationRef": "auth/ok"},
                initial_scope_uids=["Q17"],
                initial_scope_sha256="sha256:" + "0" * 64,
            )

    def test_replacement_parity_rejects_one_to_many_and_simultaneous_active(self) -> None:
        item = {
            "sourceQuestionUid": "Q17",
            "recoveredQuestionUid": "Q17-R",
            "replacementCardinality": "1:N",
            "sourceOriginalPreserved": True,
            "productionOriginalActive": True,
            "productionRecoveredActive": True,
            "replacementLineageParity": "PASS",
            "recoveredQualityClosure": "PASS",
            "replacementEvidenceRef": "evidence/q17-replacement.json",
            "replacementEvidenceSha": "sha256:" + "a" * 64,
            "recoveryAuthority": "BOUNDED_PRODUCTION",
            "productionAdoptionStatus": "ADOPTED",
        }
        result = validate_replacement(item, ["Q17"], "sha256:" + "0" * 64)
        self.assertEqual("FAIL", result["status"])
        self.assertIn("DERIVED_REPLACEMENT_CARDINALITY_FAIL", result["errors"])
        self.assertIn("DERIVED_REPLACEMENT_PARITY_FAIL", result["errors"])

    def test_initial_denominator_is_unchanged_and_duplicate_slots_fail(self) -> None:
        ledger = build_recovery_ledger(["Q1", "Q17"])
        self.assertEqual(["Q1", "Q17"], ledger["initialIncludedScopeUidSet"])
        self.assertEqual("FAIL", validate_ledger({**ledger, "initialIncludedScopeUidSet": ["Q1"]})["status"])
        duplicate = {**ledger, "items": [{"sourceQuestionUid": "Q17"}, {"sourceQuestionUid": "Q17"}]}
        self.assertEqual("FAIL", validate_ledger(duplicate)["status"])

    def test_shadow_recovery_can_continue_but_cannot_release(self) -> None:
        item = run_source_recovery(
            source_question_uid="Q17",
            source_lock_sha256="b" * 64,
            defect_types=["DUPLICATE_CHOICES"],
            source_recovery_policy="SHADOW_AUTO_RECOVER",
            recovery_authority="SHADOW_ONLY",
            candidates_by_tier={"R1": [verified_candidate(candidate_payload(effectiveArtifactUid="Q17-R"))] },
            attempts_by_tier={"R1": producer_attempt("R1", 1)},
        )
        item["finalTarget"] = True
        gate = release_gate(build_recovery_ledger(["Q17"], [item]))
        self.assertEqual("BLOCKED", gate["status"])
        self.assertGreater(gate["counts"]["shadowRecoveredUnapprovedCount"], 0)

    def test_capability_blocked_is_not_exhaustion_or_human_required(self) -> None:
        result = run_source_recovery(
            source_question_uid="Q17",
            source_lock_sha256="b" * 64,
            defect_types=["VISUAL_STEM_CONFLICT"],
            capabilities={"R5": "CAPABILITY_BLOCKED", "R6": "CAPABILITY_BLOCKED"},
        )
        self.assertEqual("RECOVERY_CAPABILITY_BLOCKED", result["status"])
        self.assertNotEqual("HUMAN_REQUIRED", result["status"])

    def test_human_required_requires_all_active_paths_exhausted(self) -> None:
        result = run_source_recovery(
            source_question_uid="Q17",
            source_lock_sha256="b" * 64,
            defect_types=["NO_CORRECT_ANSWER"],
            capabilities={tier: "ACTIVE" for tier in ("R1", "R2", "R3", "R4", "R6")},
            attempts_by_tier={tier: producer_attempt(tier, 0) for tier in ("R1", "R2", "R3", "R4", "R6")},
            candidates_by_tier={},
        )
        self.assertEqual("HUMAN_REQUIRED", result["status"])
        self.assertEqual("AUTO_RECOVERY_EXHAUSTED", result["exhaustionStatus"])
        self.assertEqual("BLOCKED", result["finalStatus"])

    def test_ranker_uses_stable_tie_break_not_answer(self) -> None:
        left = make_candidate_version("RP-Q1-R1", candidate_payload(answer="1"))
        right = make_candidate_version("RP-Q1-R1", candidate_payload(answer="2"))
        for item in (left, right):
            item["acceptance"] = {"status": "PASS"}
        winner = rank_candidates([right, left])
        self.assertEqual(min(left["candidateId"], right["candidateId"]), winner["candidateId"])

    def test_run_store_persists_recovery_evidence_append_only_and_idempotently(self) -> None:
        import tempfile
        from pathlib import Path

        with tempfile.TemporaryDirectory() as temporary:
            store = RunStore(Path(temporary))
            store.create("run-1", {"runId": "run-1", "status": "RECOVERING"})
            record = run_source_recovery(
                source_question_uid="Q17",
                source_lock_sha256="b" * 64,
                defect_types=["NO_CORRECT_ANSWER"],
                candidates_by_tier={"R1": [verified_candidate(candidate_payload(effectiveArtifactUid="Q17-R"))] },
                attempts_by_tier={"R1": producer_attempt("R1", 1)},
            )
            first = persist_source_recovery(store, "run-1", record)
            second = persist_source_recovery(store, "run-1", record)
            self.assertEqual(first["sourceRecoveryLedger"], second["sourceRecoveryLedger"])
            self.assertEqual(1, len(second["sourceRecoveryLedger"]["items"]))
            self.assertTrue((Path(temporary) / "run-1/evidence/source-recovery").is_dir())
            with self.assertRaises(SourceRecoveryError):
                persist_source_recovery(store, "run-1", {**record, "status": "PRESERVE_ONLY"})


if __name__ == "__main__":
    unittest.main()
