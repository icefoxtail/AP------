import unittest
from pathlib import Path

from alive.engine.final_closure import _static_findings
from alive.engine.middle_school_coordinate_plane_engine import (
    MiddleSchoolCoordinatePlaneVariantError,
    build_middle_school_coordinate_plane_capability_report,
    build_middle_school_coordinate_plane_variant_inputs,
    load_middle_school_coordinate_plane_fixtures,
    solve_middle_school_coordinate_plane_fixture,
)


class MiddleSchoolCoordinatePlaneEngineTests(unittest.TestCase):
    root = Path(__file__).resolve().parents[3]

    def test_point_location_solver_covers_quadrants_and_axes(self) -> None:
        fixtures = load_middle_school_coordinate_plane_fixtures(self.root)
        expected = ["제1사분면", "제2사분면", "제3사분면", "제4사분면", "y축", "x축"]
        self.assertEqual(
            [solve_middle_school_coordinate_plane_fixture(fixture)["answer"] for fixture in fixtures],
            expected,
        )

    def test_a_b_inputs_require_coordinate_plane_visuals_and_are_clean(self) -> None:
        for declared_class in ("A", "B"):
            inputs = build_middle_school_coordinate_plane_variant_inputs(
                self.root,
                run_id=f"test-middle-coordinate-plane-{declared_class.lower()}",
                declared_class=declared_class,
            )
            self.assertEqual(inputs["questionCount"], 6)
            for candidate in inputs["candidates"]:
                self.assertEqual(candidate["visualDependency"], "MANDATORY")
                self.assertTrue(candidate["solutionVisualElements"]["required"])
                self.assertNotIn("__import__", candidate["solution"])
                question = {
                    "id": int(candidate["sourceQuestionId"]),
                    **candidate["studentPayload"],
                    "answer": candidate["answerContract"]["displayAnswer"],
                    "solution": candidate["solution"],
                    "tags": candidate["archiveMetadata"]["tags"],
                }
                self.assertEqual(
                    _static_findings(question, int(candidate["sourceQuestionId"]), similar=True),
                    [],
                )

    def test_capability_and_c_boundary(self) -> None:
        with self.assertRaises(MiddleSchoolCoordinatePlaneVariantError):
            build_middle_school_coordinate_plane_variant_inputs(
                self.root,
                run_id="test-middle-coordinate-plane-c",
                declared_class="C",
            )
        report = build_middle_school_coordinate_plane_capability_report(self.root)
        self.assertEqual(report["status"], "ACTIVE_BOUNDED")
        self.assertEqual(report["activeCount"], 2)
        self.assertEqual(report["holdCount"], 1)


if __name__ == "__main__":
    unittest.main()
