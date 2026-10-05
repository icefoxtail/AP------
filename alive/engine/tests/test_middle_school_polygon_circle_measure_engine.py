import unittest
from pathlib import Path

from alive.engine.final_closure import _static_findings
from alive.engine.middle_school_polygon_circle_measure_engine import (
    MiddleSchoolPolygonCircleMeasureVariantError,
    build_middle_school_polygon_circle_measure_capability_report,
    build_middle_school_polygon_circle_measure_variant_inputs,
    load_middle_school_polygon_circle_measure_fixtures,
    solve_middle_school_polygon_circle_measure_fixture,
)


class MiddleSchoolPolygonCircleMeasureEngineTests(unittest.TestCase):
    root = Path(__file__).resolve().parents[3]

    def test_polygon_circle_rectangle_answers_are_exact(self) -> None:
        fixtures = load_middle_school_polygon_circle_measure_fixtures(self.root)
        answers = [solve_middle_school_polygon_circle_measure_fixture(fixture)["answer"] for fixture in fixtures]
        self.assertEqual(answers[:6], ["180°", "360°", "540°", "720°", "1080°", "1440°"])
        self.assertEqual(answers[6:12], ["4π", "π", "10π", "49π", "2π", "100π"])
        self.assertEqual(answers[12:], [15, 22, 36, 22, 18, 28])

    def test_a_b_inputs_require_visuals_and_are_clean(self) -> None:
        for declared_class in ("A", "B"):
            inputs = build_middle_school_polygon_circle_measure_variant_inputs(
                self.root,
                run_id=f"test-middle-m1-06-{declared_class.lower()}",
                declared_class=declared_class,
            )
            self.assertEqual(inputs["questionCount"], 18)
            self.assertEqual({item["familyId"] for item in inputs["capabilityPreflight"]["assignments"]}, {"POLYGON_INTERIOR_ANGLE_SUM", "CIRCLE_AREA_CIRCUMFERENCE", "RECTANGLE_AREA_PERIMETER"})
            for candidate in inputs["candidates"]:
                self.assertEqual(candidate["visualDependency"], "MANDATORY")
                self.assertTrue(candidate["solutionVisualElements"]["required"])
                question = {"id": int(candidate["sourceQuestionId"]), **candidate["studentPayload"], "answer": candidate["answerContract"]["displayAnswer"], "solution": candidate["solution"], "tags": candidate["archiveMetadata"]["tags"]}
                self.assertEqual(_static_findings(question, int(candidate["sourceQuestionId"]), similar=True), [])
                self.assertNotIn("{target}", candidate["solution"])
                self.assertNotIn("원의 원의", candidate["solution"])
                if candidate["variantPlan"]["familyId"] == "CIRCLE_AREA_CIRCUMFERENCE":
                    self.assertEqual(candidate["solutionVisualSpec"]["type"], "circle_geometry")

    def test_capability_and_c_boundary(self) -> None:
        with self.assertRaises(MiddleSchoolPolygonCircleMeasureVariantError):
            build_middle_school_polygon_circle_measure_variant_inputs(self.root, run_id="test-middle-m1-06-c", declared_class="C")
        report = build_middle_school_polygon_circle_measure_capability_report(self.root)
        self.assertEqual(report["status"], "ACTIVE_BOUNDED")
        self.assertEqual(report["activeCount"], 6)
        self.assertEqual(report["holdCount"], 3)


if __name__ == "__main__":
    unittest.main()
