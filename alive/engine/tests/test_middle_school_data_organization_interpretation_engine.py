import unittest
from fractions import Fraction
from pathlib import Path

from alive.engine.final_closure import _static_findings
from alive.engine.middle_school_data_organization_interpretation_engine import (
    MiddleSchoolDataVariantError,
    build_middle_school_data_capability_report,
    build_middle_school_data_variant_inputs,
    load_middle_school_data_fixtures,
    solve_middle_school_data_fixture,
)


class MiddleSchoolDataOrganizationInterpretationEngineTests(unittest.TestCase):
    root = Path(__file__).resolve().parents[3]

    def test_frequency_and_mean_answers_are_exact(self) -> None:
        fixtures = load_middle_school_data_fixtures(self.root)
        answers = [solve_middle_school_data_fixture(fixture)["answer"] for fixture in fixtures]
        self.assertEqual(answers[:6], [6, 7, 10, 6, 10, 8])
        self.assertEqual(answers[6:], [Fraction(4), Fraction(4), Fraction(6), Fraction(8), Fraction(5), Fraction(6)])

    def test_a_b_inputs_require_table_visuals_and_are_clean(self) -> None:
        for declared_class in ("A", "B"):
            inputs = build_middle_school_data_variant_inputs(
                self.root,
                run_id=f"test-middle-m1-08-{declared_class.lower()}",
                declared_class=declared_class,
            )
            self.assertEqual(inputs["questionCount"], 12)
            self.assertEqual({item["familyId"] for item in inputs["capabilityPreflight"]["assignments"]}, {"DATA_FREQUENCY_TOTAL", "DATA_MEAN"})
            for candidate in inputs["candidates"]:
                self.assertEqual(candidate["visualDependency"], "MANDATORY")
                self.assertTrue(candidate["solutionVisualElements"]["required"])
                self.assertEqual(candidate["visualSpec"]["type"], "table")
                self.assertEqual(candidate["solutionVisualSpec"]["type"], "table")
                question = {
                    "id": int(candidate["sourceQuestionId"]),
                    **candidate["studentPayload"],
                    "answer": candidate["answerContract"]["displayAnswer"],
                    "solution": candidate["solution"],
                    "tags": candidate["archiveMetadata"]["tags"],
                }
                self.assertEqual(_static_findings(question, int(candidate["sourceQuestionId"]), similar=True), [])
                self.assertNotIn("__import__", candidate["solution"])

    def test_capability_and_c_boundary(self) -> None:
        with self.assertRaises(MiddleSchoolDataVariantError):
            build_middle_school_data_variant_inputs(self.root, run_id="test-middle-m1-08-c", declared_class="C")
        report = build_middle_school_data_capability_report(self.root)
        self.assertEqual(report["status"], "ACTIVE_BOUNDED")
        self.assertEqual(report["activeCount"], 4)
        self.assertEqual(report["holdCount"], 2)


if __name__ == "__main__":
    unittest.main()
