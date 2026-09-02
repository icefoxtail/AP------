import unittest
from pathlib import Path

from alive.engine.final_closure import _static_findings
from alive.engine.middle_school_basic_geometry_engine import (
    MiddleSchoolBasicGeometryVariantError,
    build_middle_school_basic_geometry_capability_report,
    build_middle_school_basic_geometry_variant_inputs,
    load_middle_school_basic_geometry_fixtures,
    solve_middle_school_basic_geometry_fixture,
)


class MiddleSchoolBasicGeometryEngineTests(unittest.TestCase):
    root = Path(__file__).resolve().parents[3]

    def test_angle_and_position_relations_are_exact(self) -> None:
        fixtures = load_middle_school_basic_geometry_fixtures(self.root)
        answers = [solve_middle_school_basic_geometry_fixture(fixture)["answer"] for fixture in fixtures]
        self.assertEqual(answers[:6], ["예각", "직각", "둔각", "평각", "예각", "둔각"])
        self.assertEqual(answers[6:], ["평행", "수직", "한 점에서 만남", "평행", "수직", "한 점에서 만남"])

    def test_a_b_inputs_require_visuals_and_are_clean(self) -> None:
        for declared_class in ("A", "B"):
            inputs = build_middle_school_basic_geometry_variant_inputs(
                self.root,
                run_id=f"test-middle-basic-geometry-{declared_class.lower()}",
                declared_class=declared_class,
            )
            self.assertEqual(inputs["questionCount"], 12)
            self.assertEqual({item["familyId"] for item in inputs["capabilityPreflight"]["assignments"]}, {"BASIC_FIGURE_ANGLE_CLASSIFICATION", "POSITION_RELATION_LINE_PAIR"})
            for candidate in inputs["candidates"]:
                self.assertEqual(candidate["visualDependency"], "MANDATORY")
                self.assertTrue(candidate["solutionVisualElements"]["required"])
                self.assertNotIn("__import__", candidate["solution"])
                question = {"id": int(candidate["sourceQuestionId"]), **candidate["studentPayload"], "answer": candidate["answerContract"]["displayAnswer"], "solution": candidate["solution"], "tags": candidate["archiveMetadata"]["tags"]}
                self.assertEqual(_static_findings(question, int(candidate["sourceQuestionId"]), similar=True), [])

    def test_capability_and_c_boundary(self) -> None:
        with self.assertRaises(MiddleSchoolBasicGeometryVariantError):
            build_middle_school_basic_geometry_variant_inputs(self.root, run_id="test-middle-basic-geometry-c", declared_class="C")
        report = build_middle_school_basic_geometry_capability_report(self.root)
        self.assertEqual(report["status"], "ACTIVE_BOUNDED")
        self.assertEqual(report["activeCount"], 4)
        self.assertEqual(report["holdCount"], 2)


if __name__ == "__main__":
    unittest.main()
