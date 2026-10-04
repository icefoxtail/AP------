import unittest
from pathlib import Path

from alive.engine.final_closure import _static_findings
from alive.engine.middle_school_solid_figure_measure_engine import (
    MiddleSchoolSolidFigureMeasureVariantError,
    build_middle_school_solid_figure_measure_capability_report,
    build_middle_school_solid_figure_measure_variant_inputs,
    load_middle_school_solid_figure_measure_fixtures,
    solve_middle_school_solid_figure_measure_fixture,
)


class MiddleSchoolSolidFigureMeasureEngineTests(unittest.TestCase):
    root = Path(__file__).resolve().parents[3]

    def test_cube_and_cuboid_answers_are_exact(self) -> None:
        fixtures = load_middle_school_solid_figure_measure_fixtures(self.root)
        answers = [solve_middle_school_solid_figure_measure_fixture(fixture)["answer"] for fixture in fixtures]
        self.assertEqual(answers[:6], [12, 24, 36, 48, 60, 72])
        self.assertEqual(answers[6:], [24, 60, 30, 32, 30, 36])

    def test_a_b_inputs_require_visuals_and_are_clean(self) -> None:
        for declared_class in ("A", "B"):
            inputs = build_middle_school_solid_figure_measure_variant_inputs(
                self.root,
                run_id=f"test-middle-m1-07-{declared_class.lower()}",
                declared_class=declared_class,
            )
            self.assertEqual(inputs["questionCount"], 12)
            self.assertEqual({item["familyId"] for item in inputs["capabilityPreflight"]["assignments"]}, {"CUBE_TOTAL_EDGE_LENGTH", "RECTANGULAR_PRISM_VOLUME"})
            for candidate in inputs["candidates"]:
                self.assertEqual(candidate["visualDependency"], "MANDATORY")
                self.assertTrue(candidate["solutionVisualElements"]["required"])
                question = {
                    "id": int(candidate["sourceQuestionId"]),
                    **candidate["studentPayload"],
                    "answer": candidate["answerContract"]["displayAnswer"],
                    "solution": candidate["solution"],
                    "tags": candidate["archiveMetadata"]["tags"],
                }
                self.assertEqual(_static_findings(question, int(candidate["sourceQuestionId"]), similar=True), [])
                self.assertNotIn("{target}", candidate["solution"])
                self.assertNotIn("__import__", candidate["solution"])
                self.assertEqual(candidate["solutionVisualSpec"]["type"], "segment_geometry")

    def test_capability_and_c_boundary(self) -> None:
        with self.assertRaises(MiddleSchoolSolidFigureMeasureVariantError):
            build_middle_school_solid_figure_measure_variant_inputs(self.root, run_id="test-middle-m1-07-c", declared_class="C")
        report = build_middle_school_solid_figure_measure_capability_report(self.root)
        self.assertEqual(report["status"], "ACTIVE_BOUNDED")
        self.assertEqual(report["activeCount"], 4)
        self.assertEqual(report["holdCount"], 2)


if __name__ == "__main__":
    unittest.main()
