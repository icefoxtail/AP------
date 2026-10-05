import unittest
from fractions import Fraction
from pathlib import Path

from alive.engine.final_closure import _static_findings
from alive.engine.middle_school_pythagorean_engine import (
    PYTHAGOREAN_FAMILY_ID,
    PYTHAGOREAN_UNIT_KEY,
    MiddleSchoolPythagoreanVariantError,
    build_middle_school_pythagorean_capability_report,
    build_middle_school_pythagorean_variant_inputs,
    load_middle_school_pythagorean_fixtures,
    solve_middle_school_pythagorean_fixture,
)
from alive.engine.visual_renderer import render_visual_spec


class MiddleSchoolPythagoreanEngineTests(unittest.TestCase):
    root = Path(__file__).resolve().parents[3]

    def test_pythagorean_solver_is_exact(self) -> None:
        fixtures = load_middle_school_pythagorean_fixtures(self.root)
        expected = [Fraction(5), Fraction(13), Fraction(10), Fraction(17), Fraction(15), Fraction(25)]
        self.assertEqual(len(fixtures), 6)
        for fixture, answer in zip(fixtures, expected):
            result = solve_middle_school_pythagorean_fixture(fixture)
            self.assertEqual(result["answer"], answer)

    def test_visual_specs_are_deterministic_and_right_angle_safe(self) -> None:
        fixture = load_middle_school_pythagorean_fixtures(self.root)[1]
        result = solve_middle_school_pythagorean_fixture(fixture)
        svg = render_visual_spec(result["visualSpec"])
        self.assertEqual(svg, render_visual_spec(result["visualSpec"]))
        self.assertIn("∠A=90°", svg)
        self.assertIn('class="right-angle"', svg)
        self.assertNotIn("^\\circ", svg)

    def test_a_b_inputs_are_clean_and_visual(self) -> None:
        for declared_class in ("A", "B"):
            inputs = build_middle_school_pythagorean_variant_inputs(self.root, run_id=f"test-pythagorean-{declared_class.lower()}", declared_class=declared_class)
            self.assertEqual(inputs["questionCount"], 6)
            for candidate in inputs["candidates"]:
                self.assertNotIn("_fmt(", candidate["solution"])
                self.assertEqual(candidate["visualDependency"], "MANDATORY")
                question = {"id": int(candidate["sourceQuestionId"]), **candidate["studentPayload"], "answer": candidate["answerContract"]["displayAnswer"], "solution": candidate["solution"], "tags": candidate["archiveMetadata"]["tags"]}
                self.assertEqual(_static_findings(question, int(candidate["sourceQuestionId"]), similar=True), [])

    def test_c_and_capability_boundary(self) -> None:
        with self.assertRaises(MiddleSchoolPythagoreanVariantError):
            build_middle_school_pythagorean_variant_inputs(self.root, run_id="test-pythagorean-c", declared_class="C")
        report = build_middle_school_pythagorean_capability_report(self.root)
        self.assertEqual(report["status"], "ACTIVE_BOUNDED")
        self.assertEqual(report["activeCount"], 2)
        self.assertEqual(report["holdCount"], 1)
        self.assertEqual((PYTHAGOREAN_UNIT_KEY, PYTHAGOREAN_FAMILY_ID), ("M2-07", "PYTHAGOREAN_THEOREM"))


if __name__ == "__main__":
    unittest.main()
