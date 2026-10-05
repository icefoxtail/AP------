from __future__ import annotations

import unittest

from alive.engine.task_packets import build_task_packets


class TaskPacketTests(unittest.TestCase):
    def test_source_analysts_have_disjoint_outputs_and_blinding(self) -> None:
        source_lock = {"sha256": "a" * 64, "questionOrdinal": 3}
        packets = build_task_packets("R03_SOURCE_ANALYSIS", {"sourceLock": source_lock})
        self.assertEqual(2, len(packets))
        self.assertEqual(2, len({packet["outputPath"] for packet in packets}))
        self.assertEqual({"3"}, {packet["sourceQuestionId"] for packet in packets})
        self.assertEqual({source_lock["sha256"]}, {packet["sourceLockSha256"] for packet in packets})
        analyst_b = next(packet for packet in packets if packet["slot"] == "b")
        self.assertIn("source answer", analyst_b["forbiddenInputs"])
        self.assertEqual("STUDENT_PAYLOAD_ONLY", analyst_b["inputRefs"][0]["view"])
        self.assertTrue(any("canonical source artifact ID" in hint for hint in analyst_b["contractHints"]))

    def test_source_analysis_requires_a_canonical_source_lock(self) -> None:
        with self.assertRaisesRegex(ValueError, "questionOrdinal"):
            build_task_packets("R03_SOURCE_ANALYSIS", {"sourceLock": {"sha256": "a" * 64}})

    def test_parallel_plans_cannot_read_siblings(self) -> None:
        packets = build_task_packets("R05_PLAN_POOL", {})
        self.assertEqual({"a", "b", "c"}, {packet["slot"] for packet in packets})
        for packet in packets:
            self.assertEqual(2, len(packet["forbiddenInputs"]))
            self.assertNotIn(packet["outputPath"], packet["forbiddenInputs"])

    def test_math_verifier_does_not_receive_answer_or_solution(self) -> None:
        packets = build_task_packets("R09_INDEPENDENT_MATH", {})
        self.assertEqual(6, len(packets))
        self.assertEqual(2, len({packet["slot"].split("-", 1)[1] for packet in packets}))
        for packet in packets:
            self.assertEqual("STUDENT_PAYLOAD_ONLY", packet["inputRefs"][0]["view"])
            self.assertIn("candidate answer", packet["forbiddenInputs"])
            self.assertIn("candidate solution", packet["forbiddenInputs"])
            self.assertTrue(any("1-based" in hint for hint in packet["contractHints"]))

    def test_candidate_slots_can_be_reduced(self) -> None:
        manifest = {"phase2": {"approvedCandidateSlots": ["a", "c"]}}
        packets = build_task_packets("R10_QUALITY_GATES", manifest)
        self.assertEqual(["a", "c"], [packet["slot"] for packet in packets])
        for packet in packets:
            paths = {item["path"] for item in packet["inputRefs"]}
            self.assertIn(f"candidates/{packet['slot']}/evidence/math-i2.json", paths)
            self.assertIn(f"candidates/{packet['slot']}/evidence/math-i3.json", paths)

    def test_late_gate_packets_expose_exact_container_contracts(self) -> None:
        distractor = build_task_packets("R11_DISTRACTOR", {"phase2": {"approvedCandidateSlots": ["a"]}})[0]
        self.assertTrue(any("dimensions.distractor" in hint for hint in distractor["contractHints"]))
        judge = build_task_packets("R12_FINAL_REDUCER", {"phase2": {"approvedCandidateSlots": ["a"]}})[0]
        self.assertTrue(any("fidelityEvidence" in hint and "arrays" in hint for hint in judge["contractHints"]))

    def test_visual_candidate_gets_independent_visual_review_packet(self) -> None:
        manifest = {"phase2": {
            "approvedCandidateSlots": ["a", "b"],
            "candidateVisualDependencies": {"a": "ESSENTIAL", "b": "NONE"},
        }}
        packets = build_task_packets("R10_QUALITY_GATES", manifest)
        visual = [packet for packet in packets if packet["artifactKind"] == "visual_evidence"]
        self.assertEqual(1, len(visual))
        self.assertEqual("a", visual[0]["slot"])
        self.assertEqual("alive_visual_reviewer", visual[0]["agent"])
        judge = build_task_packets("R12_FINAL_REDUCER", manifest)
        visual_refs = {item["path"] for item in judge[0]["inputRefs"]}
        self.assertIn("candidates/a/evidence/visual.json", visual_refs)


if __name__ == "__main__":
    unittest.main()
