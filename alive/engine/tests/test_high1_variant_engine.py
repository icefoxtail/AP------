from __future__ import annotations

import unittest
from pathlib import Path

from alive.engine.high1_variant_engine import (
    build_high1_capability_promotion,
    build_high1_variant_inputs,
)
from alive.engine.universal_high1_bridge import _archive_answer_text, _archive_math_text
from alive.engine.solution_graph import strip_preprocess_graph
from alive.engine.universal_candidate import validate_universal_candidate
from alive.engine.variant_proof import validate_variant_proof_sidecar


class High1VariantEngineTests(unittest.TestCase):

    def test_archive_math_text_keeps_structured_expressions_together(self):
        self.assertEqual(_archive_math_text("AP:PB=1:2"), "$AP:PB=1:2$")
        self.assertEqual(_archive_math_text("P(x)Q(x)"), "$P(x)Q(x)$")
        self.assertEqual(_archive_math_text("P=((1)A+(2)B)/(3)"), "$P=((1)A+(2)B)/(3)$")
        self.assertEqual(_archive_math_text("A=[[1,2],[0,1]], B=[[2,1],[3,0]]"), "$A=[[1,2],[0,1]], B=[[2,1],[3,0]]$")

    def test_archive_answer_text_delimits_fractional_coordinates_and_line_data(self):
        self.assertEqual(_archive_answer_text("(-2/3, 2)"), "$(-2/3, 2)$")
        self.assertEqual(_archive_answer_text("기울기 -1/3, y절편 7/3"), "기울기 $-1/3$, y절편 $7/3$")
    def setUp(self) -> None:
        self.root = Path(__file__).resolve().parents[3]

    def test_each_class_covers_all_18_units_and_candidate_contract(self) -> None:
        for declared_class, verified in (("A", "VERIFIED_A"), ("B", "VERIFIED_B"), ("C", "VERIFIED_C")):
            payload = build_high1_variant_inputs(self.root, run_id=f"test-{declared_class.lower()}", declared_class=declared_class)
            self.assertEqual(18, payload["questionCount"])
            self.assertEqual(18, len(payload["candidates"]))
            self.assertEqual(18, len(payload["independentReviews"]))
            for candidate in payload["candidates"]:
                self.assertEqual("PASS", validate_universal_candidate(candidate)["candidateValidation"]["status"])
                self.assertEqual(verified, candidate["variantResult"]["verifiedClass"])
                self.assertEqual("PASS", validate_variant_proof_sidecar(candidate["variantProof"])["status"])

    def test_a_and_b_keep_core_graph_and_c_strips_to_core_graph(self) -> None:
        a = build_high1_variant_inputs(self.root, run_id="test-graph-a", declared_class="A")
        b = build_high1_variant_inputs(self.root, run_id="test-graph-b", declared_class="B")
        c = build_high1_variant_inputs(self.root, run_id="test-graph-c", declared_class="C")
        for index in range(18):
            source_graph = a["sourceIR"][index]["solutionGraph"]
            self.assertEqual(source_graph["graphFingerprint"], a["candidates"][index]["variantPlan"]["candidateGraphFingerprint"])
            self.assertEqual(source_graph["graphFingerprint"], b["candidates"][index]["variantPlan"]["candidateGraphFingerprint"])
            c_graph = c["candidateIR"][index]["solutionGraph"]["graphFingerprint"]
            self.assertNotEqual(source_graph["graphFingerprint"], c_graph)
            self.assertEqual(source_graph["graphFingerprint"], strip_preprocess_graph(c["candidateIR"][index]["solutionGraph"])["graphFingerprint"])

    def test_all_structured_fixture_classes_cover_57_cases(self) -> None:
        for declared_class, verified in (("A", "VERIFIED_A"), ("B", "VERIFIED_B"), ("C", "VERIFIED_C")):
            payload = build_high1_variant_inputs(
                self.root,
                run_id=f"test-all-{declared_class.lower()}",
                declared_class=declared_class,
                fixture_scope="all_structured",
            )
            self.assertEqual("all_structured", payload["fixtureScope"])
            self.assertEqual(57, payload["questionCount"])
            self.assertEqual(57, len(payload["independentReviews"]))
            self.assertEqual(57, len(payload["visualRecon"]["questions"]))
            self.assertTrue(all(item["variantResult"]["verifiedClass"] == verified for item in payload["candidates"]))

    def test_capability_promotion_has_positive_and_negative_evidence(self) -> None:
        report = build_high1_capability_promotion(self.root)
        self.assertEqual("ACTIVE_BOUNDED", report["status"])
        self.assertEqual(21, report["activeCount"])
        self.assertEqual(0, report["holdCount"])
        self.assertEqual(18, report["unitCount"])
        self.assertEqual("HOLD", report["arbitraryProseSolver"])
        for capability in report["capabilities"]:
            self.assertGreaterEqual(capability["positiveCount"], 1)
            self.assertGreaterEqual(capability["negativeCount"], 1)
            self.assertEqual("ACTIVE", capability["status"])

    def test_variant_solution_normalizes_coordinate_math_and_recomputes_checks(self) -> None:
        a = build_high1_variant_inputs(self.root, run_id="test-solution-a", declared_class="A")
        distance = a["candidates"][9]
        rational = a["candidates"][16]
        self.assertIn(r"$AB=\sqrt{4^2+3^2}=\sqrt{25}$", distance["solution"])
        self.assertIn(r"$\Delta x=4$", distance["solution"])
        self.assertIn("x=-1", rational["solution"])
        self.assertNotIn("x=2", rational["solution"])

    def test_c_solution_keeps_visible_preprocess_without_extra_long_step(self) -> None:
        c = build_high1_variant_inputs(self.root, run_id="test-solution-c", declared_class="C")
        detail = c["candidates"][16]["solutionDetail"]
        self.assertEqual("\uacf5\uac1c \uc870\uac74\u00b7\uc870\uac74 \uc815\ub9ac", detail["steps"][0]["title"])
        self.assertEqual(3, len(detail["steps"]))


if __name__ == "__main__":
    unittest.main()
