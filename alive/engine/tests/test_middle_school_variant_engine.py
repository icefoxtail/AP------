from __future__ import annotations

import unittest
from pathlib import Path

from alive.engine.middle_school_variant_engine import (
    MiddleSchoolVariantError,
    build_middle_school_capability_report,
    build_middle_school_variant_inputs,
    solve_middle_school_fixture,
)
from alive.engine.universal_candidate import validate_universal_candidate
from alive.engine.universal_ir import validate_universal_question_ir
from alive.engine.variant_proof import validate_variant_proof_sidecar


class MiddleSchoolVariantEngineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.root = Path(__file__).resolve().parents[3]

    def test_exact_linear_and_system_solvers(self) -> None:
        linear = solve_middle_school_fixture({"kind": "linear_equation", "data": {"a": 3, "b": 5, "c": 1, "d": 13}})
        self.assertEqual(4, linear["answer"])
        system = solve_middle_school_fixture({"kind": "system_equation", "data": {"a": 2, "b": 1, "c": 8, "d": 1, "e": -1, "f": 1}})
        self.assertEqual(3, system["answer"]["x"])
        self.assertEqual(2, system["answer"]["y"])
        self.assertNotIn("행렬식", " ".join(step["work"] for step in system["steps"]))

        boundary = solve_middle_school_fixture({"kind": "system_equation", "data": {"a": 2, "b": 0, "c": 6, "d": 0, "e": 3, "f": 9}})
        self.assertEqual(3, boundary["answer"]["x"])
        self.assertEqual(3, boundary["answer"]["y"])
        self.assertIn("바로 구한", boundary["steps"][0]["work"])

    def test_a_and_b_cover_six_structured_fixtures(self) -> None:
        for declared_class, verified in (("A", "VERIFIED_A"), ("B", "VERIFIED_B")):
            payload = build_middle_school_variant_inputs(self.root, run_id=f"test-middle-{declared_class.lower()}", declared_class=declared_class)
            self.assertEqual(6, payload["questionCount"])
            for candidate, source_ir in zip(payload["candidates"], payload["sourceIR"]):
                self.assertEqual("PASS", validate_universal_candidate(candidate)["candidateValidation"]["status"])
                self.assertEqual("PASS", validate_variant_proof_sidecar(candidate["variantProof"])["status"])
                self.assertEqual(verified, candidate["variantResult"]["verifiedClass"])
                self.assertEqual("PASS", validate_universal_question_ir(source_ir)["status"])

    def test_c_is_fail_closed_until_a_real_preprocess_fixture_exists(self) -> None:
        with self.assertRaisesRegex(MiddleSchoolVariantError, "C is HOLD"):
            build_middle_school_variant_inputs(self.root, run_id="test-middle-c", declared_class="C")

    def test_capability_promotes_only_a_and_b(self) -> None:
        report = build_middle_school_capability_report(self.root)
        self.assertEqual("ACTIVE_BOUNDED", report["status"])
        self.assertEqual(4, report["activeCount"])
        self.assertEqual(2, report["holdCount"])
        self.assertEqual(2, report["unitCount"])
        self.assertTrue(any(item["status"] == "HOLD" and "PARAMETER_RECOVERY" in item["familyTransform"] for item in report["capabilities"]))


if __name__ == "__main__":
    unittest.main()
