import unittest
from fractions import Fraction
from pathlib import Path

from alive.engine.final_closure import _static_findings
from alive.engine.middle_school_probability_engine import (
    MiddleSchoolProbabilityVariantError,
    build_middle_school_probability_capability_report,
    build_middle_school_probability_variant_inputs,
    load_middle_school_probability_fixtures,
    solve_middle_school_probability_fixture,
)


class MiddleSchoolProbabilityEngineTests(unittest.TestCase):
    root = Path(__file__).resolve().parents[3]

    def test_basic_and_counting_solvers_are_exact(self) -> None:
        expected = {
            "PROBABILITY_BASIC": [Fraction(1, 4), Fraction(1, 6), Fraction(2, 5), Fraction(3, 4), Fraction(9, 10), Fraction(3, 8)],
            "PROBABILITY_COUNTING": [Fraction(1, 4), Fraction(1, 10), Fraction(1, 4), Fraction(1, 3), Fraction(1, 3), Fraction(1, 4)],
        }
        for family_id, answers in expected.items():
            fixtures = load_middle_school_probability_fixtures(self.root, family_id)
            self.assertEqual(len(fixtures), 6)
            for fixture, answer in zip(fixtures, answers):
                self.assertEqual(solve_middle_school_probability_fixture(fixture)["answer"], answer)

    def test_a_b_inputs_are_clean_and_visual_not_required(self) -> None:
        for family_id in ("PROBABILITY_BASIC", "PROBABILITY_COUNTING"):
            for declared_class in ("A", "B"):
                inputs = build_middle_school_probability_variant_inputs(self.root, run_id=f"test-{family_id.lower()}-{declared_class.lower()}", declared_class=declared_class, family_id=family_id)
                self.assertEqual(inputs["questionCount"], 6)
                for candidate in inputs["candidates"]:
                    self.assertNotIn("_fmt(", candidate["solution"])
                    self.assertEqual(candidate["visualDependency"], "NONE")
                    self.assertFalse(candidate["solutionVisualElements"]["required"])
                    question = {"id": int(candidate["sourceQuestionId"]), **candidate["studentPayload"], "answer": candidate["answerContract"]["displayAnswer"], "solution": candidate["solution"], "tags": candidate["archiveMetadata"]["tags"]}
                    self.assertEqual(_static_findings(question, int(candidate["sourceQuestionId"]), similar=True), [])

    def test_capability_and_c_boundary(self) -> None:
        for family_id in ("PROBABILITY_BASIC", "PROBABILITY_COUNTING"):
            with self.assertRaises(MiddleSchoolProbabilityVariantError):
                build_middle_school_probability_variant_inputs(self.root, run_id=f"test-{family_id.lower()}-c", declared_class="C", family_id=family_id)
            report = build_middle_school_probability_capability_report(self.root, family_id)
            self.assertEqual(report["status"], "ACTIVE_BOUNDED")
            self.assertEqual(report["activeCount"], 2)
            self.assertEqual(report["holdCount"], 1)


if __name__ == "__main__":
    unittest.main()
