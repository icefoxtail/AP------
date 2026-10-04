from __future__ import annotations

import unittest
from pathlib import Path

from alive.engine.middle_school_function_engine import (
    MiddleSchoolFunctionVariantError,
    build_middle_school_function_capability_report,
    build_middle_school_function_variant_inputs,
    load_middle_school_function_fixtures,
    solve_middle_school_function_fixture,
)
from alive.engine.universal_candidate import validate_universal_candidate
from alive.engine.universal_ir import validate_universal_question_ir
from alive.engine.variant_proof import validate_variant_proof_sidecar
from alive.engine.visual_renderer import render_visual_spec


class MiddleSchoolFunctionEngineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.root = Path(__file__).resolve().parents[3]

    def test_exact_value_and_two_point_solvers(self) -> None:
        value = solve_middle_school_function_fixture({"unitKey":"M2-04","familyId":"LINEAR_FUNCTION_GRAPH","kind":"linear_function_value","data":{"a":2,"b":1,"targetX":3},"subUnitKey":"M2-04-LINEAR_FUNCTION_BASIC","subUnit":"일차함수의 뜻과 그래프"})
        self.assertEqual(7, value["answer"])
        points = solve_middle_school_function_fixture({"unitKey":"M2-04","familyId":"LINEAR_FUNCTION_GRAPH","kind":"linear_function_from_points","data":{"x1":1,"y1":4,"x2":3,"y2":8,"targetX":-1},"subUnitKey":"M2-04-LINEAR_FUNCTION_FROM_POINTS","subUnit":"두 점을 지나는 일차함수"})
        self.assertEqual(0, points["answer"])
        self.assertEqual(3, len(points["steps"]))

    def test_six_fixtures_have_deterministic_visual_specs(self) -> None:
        fixtures = load_middle_school_function_fixtures(self.root)
        self.assertEqual(6, len(fixtures))
        for fixture in fixtures:
            result = solve_middle_school_function_fixture(fixture)
            first = render_visual_spec(result["visualSpec"])
            second = render_visual_spec(result["visualSpec"])
            self.assertEqual(first, second)
            self.assertIn("그래프", result["check"])

    def test_a_and_b_cover_six_candidates_with_mandatory_solution_svg(self) -> None:
        for declared_class, verified in (("A", "VERIFIED_A"), ("B", "VERIFIED_B")):
            payload = build_middle_school_function_variant_inputs(self.root, run_id=f"test-middle-function-{declared_class.lower()}", declared_class=declared_class)
            self.assertEqual(6, payload["questionCount"])
            for candidate, source_ir in zip(payload["candidates"], payload["sourceIR"]):
                self.assertEqual("PASS", validate_universal_candidate(candidate)["candidateValidation"]["status"])
                self.assertEqual("PASS", validate_variant_proof_sidecar(candidate["variantProof"])["status"])
                self.assertEqual(verified, candidate["variantResult"]["verifiedClass"])
                self.assertEqual("MANDATORY", candidate["visualRequirement"])
                self.assertIsInstance(candidate["solutionVisualSpec"], dict)
                self.assertEqual("PASS", validate_universal_question_ir(source_ir)["status"])
                self.assertEqual(0, candidate["solution"].count("[자주 하는 실수]") - 1)
                self.assertNotIn("_fmt(", candidate["solution"])

    def test_c_is_fail_closed_and_capability_only_promotes_a_b(self) -> None:
        with self.assertRaisesRegex(MiddleSchoolFunctionVariantError, "C is HOLD"):
            build_middle_school_function_variant_inputs(self.root, run_id="test-middle-function-c", declared_class="C")
        report = build_middle_school_function_capability_report(self.root)
        self.assertEqual("ACTIVE_BOUNDED", report["status"])
        self.assertEqual(2, report["activeCount"])
        self.assertEqual(1, report["holdCount"])


if __name__ == "__main__":
    unittest.main()
