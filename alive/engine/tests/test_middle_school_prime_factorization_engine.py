import unittest
from pathlib import Path

from alive.engine.final_closure import _static_findings
from alive.engine.middle_school_prime_factorization_engine import (
    MiddleSchoolPrimeFactorizationVariantError,
    build_middle_school_prime_factorization_capability_report,
    build_middle_school_prime_factorization_variant_inputs,
    load_middle_school_prime_factorization_fixtures,
    solve_middle_school_prime_factorization_fixture,
)


class MiddleSchoolPrimeFactorizationEngineTests(unittest.TestCase):
    root = Path(__file__).resolve().parents[3]

    def test_factorization_is_exact_and_complete(self) -> None:
        fixtures = load_middle_school_prime_factorization_fixtures(self.root)
        self.assertEqual(len(fixtures), 6)
        expected = [r"2^{2}\times 3", "17", r"2^{3}\times 3^{2}", r"2\times 3^{2}\times 5", "97", r"2^{2}\times 3^{2}\times 5"]
        for fixture, answer in zip(fixtures, expected):
            result = solve_middle_school_prime_factorization_fixture(fixture)
            self.assertEqual(result["answer"], answer)
            self.assertNotIn("1\\times", result["answer"])

    def test_a_b_inputs_are_clean_and_visual_not_required(self) -> None:
        for declared_class in ("A", "B"):
            inputs = build_middle_school_prime_factorization_variant_inputs(self.root, run_id=f"test-middle-prime-factorization-{declared_class.lower()}", declared_class=declared_class)
            self.assertEqual(inputs["questionCount"], 6)
            for candidate in inputs["candidates"]:
                self.assertNotIn("_factorization", candidate["solution"])
                self.assertNotIn("_prime_product", candidate["solution"])
                self.assertEqual(candidate["visualDependency"], "NONE")
                self.assertFalse(candidate["solutionVisualElements"]["required"])
                question = {"id": int(candidate["sourceQuestionId"]), **candidate["studentPayload"], "answer": candidate["answerContract"]["displayAnswer"], "solution": candidate["solution"], "tags": candidate["archiveMetadata"]["tags"]}
                self.assertEqual(_static_findings(question, int(candidate["sourceQuestionId"]), similar=True), [])

    def test_capability_and_c_boundary(self) -> None:
        with self.assertRaises(MiddleSchoolPrimeFactorizationVariantError):
            build_middle_school_prime_factorization_variant_inputs(self.root, run_id="test-middle-prime-factorization-c", declared_class="C")
        report = build_middle_school_prime_factorization_capability_report(self.root)
        self.assertEqual(report["status"], "ACTIVE_BOUNDED")
        self.assertEqual(report["activeCount"], 2)
        self.assertEqual(report["holdCount"], 1)


if __name__ == "__main__":
    unittest.main()
