from __future__ import annotations

import unittest

from alive.engine.exact_verifier import verify_question


class ExactVerifierTests(unittest.TestCase):
    def _question(self, solution: str) -> dict:
        return {
            "id": 18,
            "questionType": "객관식",
            "content": "어느 선수가 자유투를 성공시킬 확률은 $0.75$이다. 이 선수가 자유투를 $192$번 시도할 때 성공한 횟수가 a번 이하일 확률은 $0.8413$이라고 한다.",
            "choices": ["$145$", "$147$", "$149$", "$151$", "$153$"],
            "answer": "③",
            "solution": solution,
        }

    def test_binomial_normal_approximation_boundary_is_exactly_checked(self) -> None:
        report = verify_question(
            self._question("(a+0.5-144)/6=1, 따라서 a=149이다."),
            18,
        )
        self.assertEqual("FAIL", report["status"])
        self.assertEqual("EXACT_BOUNDARY_NOT_INTEGER", report["findings"][0]["code"])
        self.assertEqual("299/2", report["findings"][0]["message"].split(" ")[4].rstrip(","))

    def test_solution_assignment_conflict_is_hard_failure(self) -> None:
        report = verify_question(
            self._question("a+0.5=150, 따라서 a=149이다."),
            18,
        )
        self.assertEqual("FAIL", report["status"])
        self.assertIn("SOLUTION_EQUATION_ASSIGNMENT_CONFLICT", {item["code"] for item in report["findings"]})

    def test_unsupported_family_is_not_claimed_as_verified(self) -> None:
        report = verify_question({"content": "새로운 정리 문제", "choices": [], "solution": "풀이"}, 1)
        self.assertEqual("NOT_APPLICABLE", report["status"])
        self.assertFalse(report["applicable"])


if __name__ == "__main__":
    unittest.main()
