from __future__ import annotations

import copy
import unittest

from alive.engine.source_recovery import (
    SourceRecoveryError,
    atomic_adopt_replacement,
    build_recovery_ledger,
    build_tier_matrix,
    candidate_acceptance,
    make_candidate_version,
    rank_candidates,
    release_gate,
    persist_source_recovery,
    run_source_recovery,
    source_evidence_blocked,
    targeted_repair_candidate,
    validate_ledger,
    validate_replacement,
)
from alive.engine.run_store import RunStore
from alive.engine.alive_cli import build_parser


GATES = {
    "MATH_VALID": "PASS",
    "ANSWER_UNIQUE_OR_RESPONSE_CONTRACT_VALID": "PASS",
    "CURRICULUM_VALID": "PASS",
    "QUESTION_WELL_FORMED": "PASS",
    "RECOVERY_FINGERPRINT_GATE_PASS": "PASS",
    "DIFFICULTY_ROLE_ACCEPTABLE": "PASS",
    "VISUAL_VALID_IF_APPLICABLE": "PASS",
    "SERIALIZABLE": "PASS",
}


def candidate_payload(**extra: object) -> dict[str, object]:
    return {"acceptanceGates": dict(GATES), **extra}


class SourceRecoveryTests(unittest.TestCase):
    def test_cli_exposes_provider_neutral_recovery_route(self) -> None:
        args = build_parser().parse_args(["source-recovery-run", "--input", "request.json", "--json"])
        self.assertEqual("source-recovery-run", args.command)
        self.assertTrue(args.json)

    def test_tier_matrix_keeps_three_axes_independent(self) -> None:
        matrix = build_tier_matrix(
            ["MISSING_CONDITION"],
            {"R3": "ACTIVE", "R4": "CAPABILITY_BLOCKED", "R5": "DEFERRED_CAPABILITY"},
        )
        self.assertEqual("APPLICABLE_PRIMARY", matrix["R3"]["applicability"])
        self.assertEqual("CAPABILITY_BLOCKED", matrix["R4"]["capability"])
        self.assertEqual("NOT_RUN", matrix["R4"]["execution"])
        self.assertEqual("DEFERRED_CAPABILITY", matrix["R5"]["capability"])

    def test_evidence_blocked_is_resumable_not_human_required(self) -> None:
        result = source_evidence_blocked("SOURCE_VISUAL", source_question_uid="Q17")
        self.assertEqual("SOURCE_RECOVERY_EVIDENCE_BLOCKED", result["status"])
        self.assertEqual("BLOCKED", result["finalStatus"])
        self.assertEqual("SOURCE_RECHECK", result["resumeFromStage"])

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
            candidates_by_tier={"R0": [{"payload": candidate_payload(correctedAnswer="③")} ]},
        )
        self.assertEqual("R0", result["recoveryTier"])
        self.assertEqual("ANSWER_KEY_RECOVERED", result["recoveryDisposition"])
        self.assertIsNone(result["replacementDisposition"])

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
        candidate = make_candidate_version("RP-Q1-R1", candidate_payload())
        accepted = candidate_acceptance(candidate, recovery_tier="R1", independent_verification="PASS")
        self.assertEqual("PASS", accepted["status"])
        rejected = candidate_acceptance(
            make_candidate_version("RP-Q1-R1", {**candidate_payload(), "x": 1}),
            recovery_tier="R1",
            independent_verification="FAIL",
        )
        self.assertEqual("FAIL", rejected["status"])
        self.assertIn("INDEPENDENT_VERIFICATION", rejected["failedGates"])

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
            candidates_by_tier={"R1": [{"payload": candidate_payload(effectiveArtifactUid="Q17-R")} ]},
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
            candidates_by_tier={"R1": [{"payload": candidate_payload(effectiveArtifactUid="Q17-R")} ]},
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
            candidates_by_tier={"R1": [{"payload": candidate_payload(effectiveArtifactUid="Q17-R")} ]},
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
                candidates_by_tier={"R1": [{"payload": candidate_payload(effectiveArtifactUid="Q17-R")} ]},
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
