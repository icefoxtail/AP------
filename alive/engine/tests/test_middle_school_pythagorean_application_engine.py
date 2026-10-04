import unittest
from fractions import Fraction
from pathlib import Path

from alive.engine.final_closure import _static_findings
from alive.engine.middle_school_pythagorean_application_engine import (
    PYTHAGOREAN_APPLICATION_FAMILY_ID,
    PYTHAGOREAN_APPLICATION_UNIT_KEY,
    MiddleSchoolPythagoreanApplicationVariantError,
    build_middle_school_pythagorean_application_capability_report,
    build_middle_school_pythagorean_application_variant_inputs,
    load_middle_school_pythagorean_application_fixtures,
    solve_middle_school_pythagorean_application_fixture,
)
from alive.engine.visual_renderer import render_visual_spec


class MiddleSchoolPythagoreanApplicationEngineTests(unittest.TestCase):
    root = Path(__file__).resolve().parents[3]

    def test_application_solver_is_exact(self) -> None:
        fixtures = load_middle_school_pythagorean_application_fixtures(self.root)
        expected = [Fraction(5), Fraction(13), Fraction(10), Fraction(17), Fraction(15), Fraction(25)]
        self.assertEqual(len(fixtures), 6)
        for fixture, answer in zip(fixtures, expected):
            result = solve_middle_school_pythagorean_application_fixture(fixture)
            self.assertEqual(result["answer"], answer)
            self.assertIn("m", result["answerText"])

    def test_visual_specs_are_deterministic_and_right_angle_safe(self) -> None:
        fixture = load_middle_school_pythagorean_application_fixtures(self.root)[1]
        result = solve_middle_school_pythagorean_application_fixture(fixture)
        svg = render_visual_spec(result["visualSpec"])
        self.assertEqual(svg, render_visual_spec(result["visualSpec"]))
        self.assertIn("사다리 길이와 직각삼각형", svg)
        self.assertIn('class="right-angle"', svg)
        self.assertNotIn("^\\circ", svg)

    def test_a_b_inputs_are_clean_and_visual(self) -> None:
        for declared_class in ("A", "B"):
            inputs = build_middle_school_pythagorean_application_variant_inputs(self.root, run_id=f"test-pythagorean-application-{declared_class.lower()}", declared_class=declared_class)
            self.assertEqual(inputs["questionCount"], 6)
            for candidate in inputs["candidates"]:
                self.assertNotIn("_fmt(", candidate["solution"])
                self.assertEqual(candidate["visualDependency"], "MANDATORY")
                question = {"id": int(candidate["sourceQuestionId"]), **candidate["studentPayload"], "answer": candidate["answerContract"]["displayAnswer"], "solution": candidate["solution"], "tags": candidate["archiveMetadata"]["tags"]}
                self.assertEqual(_static_findings(question, int(candidate["sourceQuestionId"]), similar=True), [])

    def test_c_and_capability_boundary(self) -> None:
        with self.assertRaises(MiddleSchoolPythagoreanApplicationVariantError):
            build_middle_school_pythagorean_application_variant_inputs(self.root, run_id="test-pythagorean-application-c", declared_class="C")
        report = build_middle_school_pythagorean_application_capability_report(self.root)
        self.assertEqual(report["status"], "ACTIVE_BOUNDED")
        self.assertEqual(report["activeCount"], 2)
        self.assertEqual(report["holdCount"], 1)
        self.assertEqual((PYTHAGOREAN_APPLICATION_UNIT_KEY, PYTHAGOREAN_APPLICATION_FAMILY_ID), ("M2-07", "PYTHAGOREAN_APPLICATION"))


if __name__ == "__main__":
    unittest.main()
