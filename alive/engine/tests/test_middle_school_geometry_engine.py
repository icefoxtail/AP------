import unittest
from pathlib import Path

from alive.engine.middle_school_geometry_engine import (
    GEOMETRY_FAMILY_ID,
    GEOMETRY_UNIT_KEY,
    MiddleSchoolGeometryVariantError,
    build_middle_school_geometry_capability_report,
    build_middle_school_geometry_variant_inputs,
    load_middle_school_geometry_fixtures,
    solve_middle_school_geometry_fixture,
)
from alive.engine.final_closure import _static_findings
from alive.engine.visual_renderer import render_visual_spec


class MiddleSchoolGeometryEngineTests(unittest.TestCase):
    root = Path(__file__).resolve().parents[3]

    def test_all_triangle_fixtures_have_exact_expected_angles(self) -> None:
        fixtures = load_middle_school_geometry_fixtures(self.root)
        expected = [70, 45, 75, 70, 70, 45]
        self.assertEqual(len(fixtures), 6)
        for fixture, answer in zip(fixtures, expected):
            result = solve_middle_school_geometry_fixture(fixture)
            self.assertEqual(result["answer"], answer)
            self.assertEqual(result["angleA"] + result["angleB"] + result["angleC"], 180)

    def test_visual_specs_are_deterministic_and_svg_safe(self) -> None:
        fixture = load_middle_school_geometry_fixtures(self.root)[3]
        result = solve_middle_school_geometry_fixture(fixture)
        svg = render_visual_spec(result["visualSpec"])
        self.assertEqual(svg, render_visual_spec(result["visualSpec"]))
        self.assertNotIn("^\\circ", svg)
        self.assertIn("°", svg)
        self.assertIn('class="shape"', svg)

    def test_a_b_inputs_require_visuals_and_have_no_helper_leak(self) -> None:
        for declared_class in ("A", "B"):
            inputs = build_middle_school_geometry_variant_inputs(self.root, run_id=f"test-geometry-{declared_class.lower()}", declared_class=declared_class)
            self.assertEqual(inputs["questionCount"], 6)
            self.assertEqual(len(inputs["candidates"]), 6)
            for candidate in inputs["candidates"]:
                self.assertEqual(candidate["visualDependency"], "MANDATORY")
                self.assertTrue(candidate["solutionVisualElements"]["required"])
                self.assertNotIn("_fmt(", candidate["solution"])
                question = {
                    **candidate["studentPayload"],
                    "answer": candidate["answerContract"]["displayAnswer"],
                    "solution": candidate["solution"],
                    "tags": candidate["archiveMetadata"]["tags"],
                }
                latex_findings = [item for item in _static_findings(question, candidate["sourceQuestionId"], similar=True) if item["gate"] == "latex"]
                self.assertEqual(latex_findings, [])

    def test_c_and_capability_boundary(self) -> None:
        with self.assertRaises(MiddleSchoolGeometryVariantError):
            build_middle_school_geometry_variant_inputs(self.root, run_id="test-geometry-c", declared_class="C")
        report = build_middle_school_geometry_capability_report(self.root)
        self.assertEqual(report["status"], "ACTIVE_BOUNDED")
        self.assertEqual(report["activeCount"], 2)
        self.assertEqual(report["holdCount"], 1)
        self.assertEqual(report["unitCount"], 1)
        self.assertEqual(GEOMETRY_UNIT_KEY, "M2-05")
        self.assertEqual(GEOMETRY_FAMILY_ID, "TRIANGLE_PROPERTIES")


if __name__ == "__main__":
    unittest.main()
