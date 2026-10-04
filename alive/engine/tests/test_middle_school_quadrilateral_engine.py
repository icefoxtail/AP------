import unittest
from pathlib import Path

from alive.engine.final_closure import _static_findings
from alive.engine.middle_school_quadrilateral_engine import (
    QUADRILATERAL_FAMILY_ID,
    QUADRILATERAL_UNIT_KEY,
    MiddleSchoolQuadrilateralVariantError,
    build_middle_school_quadrilateral_capability_report,
    build_middle_school_quadrilateral_variant_inputs,
    load_middle_school_quadrilateral_fixtures,
    solve_middle_school_quadrilateral_fixture,
)
from alive.engine.visual_renderer import render_visual_spec


class MiddleSchoolQuadrilateralEngineTests(unittest.TestCase):
    root = Path(__file__).resolve().parents[3]

    def test_parallelogram_relations_are_exact(self) -> None:
        fixtures = load_middle_school_quadrilateral_fixtures(self.root)
        expected = [65, 90, 37, 108, 90, 67]
        self.assertEqual(len(fixtures), 6)
        for fixture, answer in zip(fixtures, expected):
            result = solve_middle_school_quadrilateral_fixture(fixture)
            self.assertEqual(result["answer"], answer)
            self.assertEqual(result["angleA"] + result["angleC"], 2 * result["angleA"])
            self.assertEqual(result["angleA"] + result["angleB"], 180)

    def test_visual_specs_are_deterministic_and_degree_safe(self) -> None:
        fixture = load_middle_school_quadrilateral_fixtures(self.root)[1]
        result = solve_middle_school_quadrilateral_fixture(fixture)
        svg = render_visual_spec(result["visualSpec"])
        self.assertEqual(svg, render_visual_spec(result["visualSpec"]))
        self.assertNotIn("^\\circ", svg)
        self.assertIn("°", svg)
        self.assertIn('class="right-angle"', svg)

    def test_a_b_inputs_require_visuals_and_have_no_latex_findings(self) -> None:
        for declared_class in ("A", "B"):
            inputs = build_middle_school_quadrilateral_variant_inputs(self.root, run_id=f"test-quadrilateral-{declared_class.lower()}", declared_class=declared_class)
            self.assertEqual(inputs["questionCount"], 6)
            for candidate in inputs["candidates"]:
                self.assertNotIn("_fmt(", candidate["solution"])
                question = {**candidate["studentPayload"], "answer": candidate["answerContract"]["displayAnswer"], "solution": candidate["solution"], "tags": candidate["archiveMetadata"]["tags"]}
                self.assertEqual([item for item in _static_findings(question, candidate["sourceQuestionId"], similar=True) if item["gate"] == "latex"], [])

    def test_c_and_capability_boundary(self) -> None:
        with self.assertRaises(MiddleSchoolQuadrilateralVariantError):
            build_middle_school_quadrilateral_variant_inputs(self.root, run_id="test-quadrilateral-c", declared_class="C")
        report = build_middle_school_quadrilateral_capability_report(self.root)
        self.assertEqual(report["status"], "ACTIVE_BOUNDED")
        self.assertEqual(report["activeCount"], 2)
        self.assertEqual(report["holdCount"], 1)
        self.assertEqual((QUADRILATERAL_UNIT_KEY, QUADRILATERAL_FAMILY_ID), ("M2-05", "QUADRILATERAL_PROPERTIES"))


if __name__ == "__main__":
    unittest.main()
