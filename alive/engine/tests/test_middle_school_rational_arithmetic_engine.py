import unittest
from fractions import Fraction
from pathlib import Path

from alive.engine.final_closure import _static_findings
from alive.engine.middle_school_rational_arithmetic_engine import (
    MiddleSchoolRationalArithmeticVariantError,
    build_middle_school_rational_arithmetic_capability_report,
    build_middle_school_rational_arithmetic_variant_inputs,
    load_middle_school_rational_arithmetic_fixtures,
    solve_middle_school_rational_arithmetic_fixture,
)


class MiddleSchoolRationalArithmeticEngineTests(unittest.TestCase):
    root = Path(__file__).resolve().parents[3]

    def test_signed_rational_solver_is_exact(self) -> None:
        fixtures = load_middle_school_rational_arithmetic_fixtures(self.root)
        expected = [Fraction(5, 4), Fraction(0), Fraction(-1, 10), Fraction(7, 6), Fraction(-9, 8), Fraction(3, 2)]
        for fixture, answer in zip(fixtures, expected):
            self.assertEqual(solve_middle_school_rational_arithmetic_fixture(fixture)["answer"], answer)

    def test_a_b_inputs_are_clean_and_visual_not_required(self) -> None:
        for declared_class in ("A", "B"):
            inputs = build_middle_school_rational_arithmetic_variant_inputs(self.root, run_id=f"test-middle-rational-arithmetic-{declared_class.lower()}", declared_class=declared_class)
            self.assertEqual(inputs["questionCount"], 6)
            for candidate in inputs["candidates"]:
                self.assertNotIn("_fraction", candidate["solution"])
                self.assertNotIn("__import__", candidate["solution"])
                self.assertEqual(candidate["visualDependency"], "NONE")
                self.assertFalse(candidate["solutionVisualElements"]["required"])
                question = {"id": int(candidate["sourceQuestionId"]), **candidate["studentPayload"], "answer": candidate["answerContract"]["displayAnswer"], "solution": candidate["solution"], "tags": candidate["archiveMetadata"]["tags"]}
                self.assertEqual(_static_findings(question, int(candidate["sourceQuestionId"]), similar=True), [])

    def test_capability_and_c_boundary(self) -> None:
        with self.assertRaises(MiddleSchoolRationalArithmeticVariantError):
            build_middle_school_rational_arithmetic_variant_inputs(self.root, run_id="test-middle-rational-arithmetic-c", declared_class="C")
        report = build_middle_school_rational_arithmetic_capability_report(self.root)
        self.assertEqual(report["status"], "ACTIVE_BOUNDED")
        self.assertEqual(report["activeCount"], 2)
        self.assertEqual(report["holdCount"], 1)


if __name__ == "__main__":
    unittest.main()
