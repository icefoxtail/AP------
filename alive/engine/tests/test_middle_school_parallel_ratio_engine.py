import unittest
from fractions import Fraction
from pathlib import Path

from alive.engine.final_closure import _static_findings
from alive.engine.middle_school_parallel_ratio_engine import (
    PARALLEL_RATIO_FAMILY_ID,
    PARALLEL_RATIO_UNIT_KEY,
    MiddleSchoolParallelRatioVariantError,
    build_middle_school_parallel_ratio_capability_report,
    build_middle_school_parallel_ratio_variant_inputs,
    load_middle_school_parallel_ratio_fixtures,
    solve_middle_school_parallel_ratio_fixture,
)
from alive.engine.visual_renderer import render_visual_spec


class MiddleSchoolParallelRatioEngineTests(unittest.TestCase):
    root = Path(__file__).resolve().parents[3]

    def test_parallel_segment_ratio_is_exact(self) -> None:
        fixtures = load_middle_school_parallel_ratio_fixtures(self.root)
        expected = [Fraction(10), Fraction(7), Fraction(72, 5), Fraction(4), Fraction(5), Fraction(55, 8)]
        self.assertEqual(len(fixtures), 6)
        for fixture, answer in zip(fixtures, expected):
            result = solve_middle_school_parallel_ratio_fixture(fixture)
            self.assertEqual(result["answer"], answer)

    def test_visual_specs_are_deterministic_and_parallel(self) -> None:
        fixture = load_middle_school_parallel_ratio_fixtures(self.root)[2]
        result = solve_middle_school_parallel_ratio_fixture(fixture)
        svg = render_visual_spec(result["visualSpec"])
        self.assertEqual(svg, render_visual_spec(result["visualSpec"]))
        self.assertIn("DE∥BC", svg)
        self.assertIn("평행선 사이의 선분의 비", svg)
        self.assertNotIn("_fmt(", svg)

    def test_a_b_inputs_are_clean_and_visual(self) -> None:
        for declared_class in ("A", "B"):
            inputs = build_middle_school_parallel_ratio_variant_inputs(self.root, run_id=f"test-parallel-ratio-{declared_class.lower()}", declared_class=declared_class)
            self.assertEqual(inputs["questionCount"], 6)
            for candidate in inputs["candidates"]:
                self.assertNotIn("_fmt(", candidate["solution"])
                self.assertEqual(candidate["visualDependency"], "MANDATORY")
                question = {"id": int(candidate["sourceQuestionId"]), **candidate["studentPayload"], "answer": candidate["answerContract"]["displayAnswer"], "solution": candidate["solution"], "tags": candidate["archiveMetadata"]["tags"]}
                self.assertEqual(_static_findings(question, int(candidate["sourceQuestionId"]), similar=True), [])

    def test_c_and_capability_boundary(self) -> None:
        with self.assertRaises(MiddleSchoolParallelRatioVariantError):
            build_middle_school_parallel_ratio_variant_inputs(self.root, run_id="test-parallel-ratio-c", declared_class="C")
        report = build_middle_school_parallel_ratio_capability_report(self.root)
        self.assertEqual(report["status"], "ACTIVE_BOUNDED")
        self.assertEqual(report["activeCount"], 2)
        self.assertEqual(report["holdCount"], 1)
        self.assertEqual((PARALLEL_RATIO_UNIT_KEY, PARALLEL_RATIO_FAMILY_ID), ("M2-06", "PARALLEL_LENGTH_RATIO"))


if __name__ == "__main__":
    unittest.main()
