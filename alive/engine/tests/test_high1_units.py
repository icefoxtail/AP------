from __future__ import annotations

import copy
import tempfile
import unittest
from pathlib import Path

from alive.engine.high1_units import (
    ALL_UNIT_KEYS,
    High1UnitError,
    independently_review_high1_fixture,
    load_all_high1_fixtures,
    run_high1_unit_benchmark,
    solve_high1_fixture,
)


class High1UnitTests(unittest.TestCase):
    def setUp(self) -> None:
        self.root = Path(__file__).resolve().parents[3]
        self.fixtures = load_all_high1_fixtures(self.root)

    def test_all_canonical_units_have_three_fixture_classes(self) -> None:
        by_unit = {key: [] for key in ALL_UNIT_KEYS}
        for fixture in self.fixtures:
            by_unit[fixture["unitKey"]].append(fixture)
        self.assertEqual(18, len(by_unit))
        for unit_key, fixtures in by_unit.items():
            self.assertGreaterEqual(len(fixtures), 3, unit_key)
            self.assertTrue({"ordinary", "boundary_or_degenerate", "composite_or_exam_like"}.issubset({item["fixtureClass"] for item in fixtures}), unit_key)

    def test_every_fixture_passes_math_solution_and_independent_review(self) -> None:
        for fixture in self.fixtures:
            result = solve_high1_fixture(fixture)
            review = independently_review_high1_fixture(fixture, result)
            self.assertEqual("PASS", review["verdict"], fixture["caseId"])
            self.assertEqual("PASS", result["solutionQuality"]["verdict"], fixture["caseId"])
            self.assertGreaterEqual(len(result["solutionDetail"]["steps"]), 3, fixture["caseId"])

    def test_circle_solution_visuals_are_mandatory_and_hashable_by_renderer(self) -> None:
        circle_fixtures = [item for item in self.fixtures if item["unitKey"] == "H22-C2-03"]
        self.assertEqual(4, len(circle_fixtures))
        for fixture in circle_fixtures:
            result = solve_high1_fixture(fixture)
            self.assertEqual("MANDATORY", result["solutionQuality"]["visualRequirement"])
            self.assertIsNotNone(result["solutionVisualSpec"])
            self.assertEqual("PASS", independently_review_high1_fixture(fixture, result)["checks"]["solutionVisual"])

    def test_structured_answers_do_not_leak_solver_field_names(self) -> None:
        expected_labels = {
            "circle_standard": ("중심", "center="),
            "rational_domain_asymptote": ("정의역에서 제외되는", "domainExcludes="),
            "radical_domain": ("경계값", "boundary="),
        }
        for kind, (label, leaked_key) in expected_labels.items():
            fixture = next(item for item in self.fixtures if item["kind"] == kind)
            answer = solve_high1_fixture(fixture)["solutionDetail"]["steps"][2]["work"]
            self.assertIn(label, answer, kind)
            self.assertNotIn(leaked_key, answer, kind)

    def test_independent_review_rejects_tampered_published_answer(self) -> None:
        fixture = next(item for item in self.fixtures if item["kind"] == "matrix_determinant")
        result = solve_high1_fixture(fixture)
        tampered = copy.deepcopy(result)
        tampered["computed"]["answer"] = 11
        with self.assertRaisesRegex(High1UnitError, "answer mismatch"):
            independently_review_high1_fixture(fixture, tampered)

    def test_repeated_full_unit_benchmark_is_deterministic_and_unpromoted(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            summary = run_high1_unit_benchmark(self.root, Path(temporary), repeats=3)
            self.assertEqual(18, summary["canonicalUnitCount"])
            self.assertEqual(57, summary["fixtureCount"])
            self.assertEqual("PASS", summary["mathematicalValidation"])
            self.assertEqual("PASS", summary["solutionValidation"])
            self.assertEqual("PASS", summary["independentReview"])
            self.assertEqual("PASS", summary["determinism"]["status"])
            self.assertEqual("NOT_RUN", summary["browserRender"])
            self.assertEqual("UNCHANGED", summary["productionCapability"])
            self.assertEqual("PASS_WITH_MANUAL_BROWSER_GATE", summary["overallStatus"])


if __name__ == "__main__":
    unittest.main()
