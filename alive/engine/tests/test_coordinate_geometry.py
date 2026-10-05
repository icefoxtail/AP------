from __future__ import annotations

import copy
import tempfile
import unittest
from pathlib import Path

from alive.engine.coordinate_geometry import (
    CoordinateGeometryError,
    load_coordinate_fixtures,
    run_coordinate_fixture_benchmark,
    solve_coordinate_case,
)
from alive.engine.visual_renderer import render_visual_spec


class CoordinateGeometryTests(unittest.TestCase):
    def setUp(self) -> None:
        self.root = Path(__file__).resolve().parents[3]
        self.cases = load_coordinate_fixtures(self.root)

    def test_all_first_slice_fixture_kinds_pass_math_and_visual_contract(self) -> None:
        self.assertEqual({"distance", "midpoint", "section", "centroid", "locus"}, {case["kind"] for case in self.cases})
        for case in self.cases:
            result = solve_coordinate_case(case)
            self.assertEqual("H22-C2-01", result["unitKey"])
            self.assertTrue(all(value == "PASS" for value in result["checks"].values()), case["caseId"])
            detail = result["solutionDetail"]
            self.assertEqual("student", detail["audience"])
            self.assertGreaterEqual(len(detail["steps"]), 3)
            self.assertTrue(all(step["work"] and step["why"] for step in detail["steps"]))
            self.assertEqual("PASS", result["solutionQuality"]["verdict"])
            self.assertEqual("RECOMMENDED", result["solutionQuality"]["visualRequirement"])
            self.assertIn("[검산]", result["solution"])
            self.assertIn("solutionVisualSpec", result)
            first = render_visual_spec(result["visualSpec"])
            second = render_visual_spec(copy.deepcopy(result["visualSpec"]))
            self.assertEqual(first, second, case["caseId"])
            self.assertEqual(
                render_visual_spec(result["solutionVisualSpec"]),
                render_visual_spec(copy.deepcopy(result["solutionVisualSpec"])),
                case["caseId"],
            )

    def test_degenerate_and_invalid_cases_fail_closed(self) -> None:
        distance_case = copy.deepcopy(next(case for case in self.cases if case["kind"] == "distance"))
        distance_case["points"]["B"] = copy.deepcopy(distance_case["points"]["A"])
        with self.assertRaisesRegex(CoordinateGeometryError, "distinct points"):
            solve_coordinate_case(distance_case)

        section_case = copy.deepcopy(next(case for case in self.cases if case["kind"] == "section"))
        section_case["ratioAPtoPB"] = [0, 2]
        with self.assertRaisesRegex(CoordinateGeometryError, "positive"):
            solve_coordinate_case(section_case)

        locus_case = copy.deepcopy(next(case for case in self.cases if case["kind"] == "locus"))
        locus_case["locusSamples"][0]["x"] = 1
        with self.assertRaisesRegex(CoordinateGeometryError, "not on the equal-distance locus"):
            solve_coordinate_case(locus_case)

    def test_repeated_unit_benchmark_is_deterministic_and_stays_experimental(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            summary = run_coordinate_fixture_benchmark(self.root, Path(temporary), repeats=3)
            self.assertEqual("PASS_WITH_MANUAL_BROWSER_GATE", summary["overallStatus"])
            self.assertEqual("PASS", summary["mathematicalValidation"])
            self.assertEqual("PASS_STRUCTURAL_ONLY", summary["visualValidation"])
            self.assertEqual("PASS", summary["determinism"]["status"])
            self.assertEqual("NOT_RUN", summary["browserRender"])
            self.assertEqual("UNCHANGED", summary["productionCapability"])
            self.assertTrue((Path(temporary) / "summary.json").is_file())
            for case in summary["determinism"]["cases"].values():
                self.assertTrue(case["assetHashesEqual"])
                self.assertTrue(case["specHashesEqual"])
                self.assertTrue(case["mathReportHashesEqual"])


if __name__ == "__main__":
    unittest.main()
