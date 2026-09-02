from __future__ import annotations

import copy
import tempfile
import unittest
from pathlib import Path

from alive.engine.staged_exam import staged_capability_report
from alive.engine.visual_benchmark import (
    benchmark_specs,
    render_experimental_visual_spec,
    run_visual_benchmarks,
)
from alive.engine.visual_renderer import render_visual_spec


class VisualBenchmarkTests(unittest.TestCase):
    def test_representative_future_topics_render_deterministically(self) -> None:
        for spec in benchmark_specs():
            first, first_checks = render_experimental_visual_spec(spec)
            second, second_checks = render_experimental_visual_spec(copy.deepcopy(spec))
            self.assertEqual(first, second, spec["caseId"])
            self.assertEqual(first_checks, second_checks, spec["caseId"])
            self.assertEqual("PASS", first_checks["deterministicRerender"], spec["caseId"])

    def test_benchmark_rejects_incorrect_math_before_svg_is_accepted(self) -> None:
        spec = next(item for item in benchmark_specs() if item["caseId"] == "function-quadratic")
        broken = copy.deepcopy(spec)
        broken["keyPoints"][0]["y"] = -1
        with self.assertRaisesRegex(ValueError, "not on the declared function"):
            render_experimental_visual_spec(broken)

    def test_experimental_types_stay_out_of_production_visual_lane(self) -> None:
        spec = next(item for item in benchmark_specs() if item["caseId"] == "conic-ellipse")
        with self.assertRaisesRegex(ValueError, "type is unsupported"):
            render_visual_spec(spec)

    def test_repeated_benchmark_writes_pass_with_browser_gate(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            summary = run_visual_benchmarks(Path(temporary), repeats=3)
            self.assertEqual("PASS_WITH_MANUAL_BROWSER_GATE", summary["overallStatus"])
            self.assertEqual("PASS", summary["determinism"]["status"])
            self.assertEqual("NOT_RUN", summary["browserRender"])
            for case in summary["determinism"]["cases"].values():
                self.assertTrue(case["assetHashesEqual"])
                self.assertTrue(case["specHashesEqual"])
            self.assertTrue((Path(temporary) / "summary.json").is_file())

    def test_coordinate_geometry_topics_can_run_as_filtered_benchmarks(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            for topic in ("coordinate_plane", "line_equation", "shape_translation"):
                summary = run_visual_benchmarks(Path(temporary) / topic, repeats=2, topic=topic)
                self.assertEqual("PASS_WITH_MANUAL_BROWSER_GATE", summary["overallStatus"])
                self.assertEqual(topic, summary["requestedTopic"])
                self.assertEqual(1, len(summary["cases"]))

    def test_capability_report_names_experiment_without_promoting_it(self) -> None:
        report = staged_capability_report()
        lane = report["experimentalVisualLane"]
        self.assertEqual("EXPERIMENTAL_ONLY", lane["status"])
        self.assertFalse(lane["feedsProductionStagedExam"])
        self.assertEqual("TWO_POINT_SLOPE_BENCHMARKED", lane["topics"]["line_equation"])
        self.assertEqual("POLYGON_VECTOR_BENCHMARKED", lane["topics"]["shape_translation"])
        self.assertEqual("NOT_IMPLEMENTED", report["visualTopicCapabilities"]["calculus"])


if __name__ == "__main__":
    unittest.main()
