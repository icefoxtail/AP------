import unittest
from pathlib import Path

from alive.engine.final_closure import _static_findings
from alive.engine.middle_school_similarity_engine import (
    SIMILARITY_FAMILY_ID,
    SIMILARITY_UNIT_KEY,
    MiddleSchoolSimilarityVariantError,
    build_middle_school_similarity_capability_report,
    build_middle_school_similarity_variant_inputs,
    load_middle_school_similarity_fixtures,
    solve_middle_school_similarity_fixture,
)
from alive.engine.visual_renderer import render_visual_spec


class MiddleSchoolSimilarityEngineTests(unittest.TestCase):
    root = Path(__file__).resolve().parents[3]

    def test_corresponding_side_solver_is_exact(self) -> None:
        fixtures = load_middle_school_similarity_fixtures(self.root)
        expected = [6, 7, 9 / 2, 8, 10, 24 / 5]
        expected_text = ["6", "7", "\\dfrac{9}{2}", "8", "10", "\\dfrac{24}{5}"]
        self.assertEqual(len(fixtures), 6)
        for fixture, answer, answer_text in zip(fixtures, expected, expected_text):
            result = solve_middle_school_similarity_fixture(fixture)
            self.assertEqual(float(result["answer"]), answer)
            self.assertEqual(result["answerText"], f"$x={answer_text}$")

    def test_visual_specs_are_deterministic_and_degree_safe(self) -> None:
        fixture = load_middle_school_similarity_fixtures(self.root)[0]
        result = solve_middle_school_similarity_fixture(fixture)
        svg = render_visual_spec(result["visualSpec"])
        self.assertEqual(svg, render_visual_spec(result["visualSpec"]))
        self.assertNotIn("^\\circ", svg)
        self.assertIn("AB↔DE, BC↔EF", svg)
        self.assertIn("닮은 두 삼각형", svg)

    def test_a_b_inputs_require_visuals_and_have_no_static_findings(self) -> None:
        for declared_class in ("A", "B"):
            inputs = build_middle_school_similarity_variant_inputs(self.root, run_id=f"test-similarity-{declared_class.lower()}", declared_class=declared_class)
            self.assertEqual(inputs["questionCount"], 6)
            for candidate in inputs["candidates"]:
                self.assertNotIn("_fmt(", candidate["solution"])
                self.assertEqual(candidate["visualDependency"], "MANDATORY")
                question = {"id": int(candidate["sourceQuestionId"]), **candidate["studentPayload"], "answer": candidate["answerContract"]["displayAnswer"], "solution": candidate["solution"], "tags": candidate["archiveMetadata"]["tags"]}
                self.assertEqual(_static_findings(question, int(candidate["sourceQuestionId"]), similar=True), [])

    def test_c_and_capability_boundary(self) -> None:
        with self.assertRaises(MiddleSchoolSimilarityVariantError):
            build_middle_school_similarity_variant_inputs(self.root, run_id="test-similarity-c", declared_class="C")
        report = build_middle_school_similarity_capability_report(self.root)
        self.assertEqual(report["status"], "ACTIVE_BOUNDED")
        self.assertEqual(report["activeCount"], 2)
        self.assertEqual(report["holdCount"], 1)
        self.assertEqual((SIMILARITY_UNIT_KEY, SIMILARITY_FAMILY_ID), ("M2-06", "SIMILAR_FIGURE"))


if __name__ == "__main__":
    unittest.main()
