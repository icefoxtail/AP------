from __future__ import annotations

from functools import lru_cache
import unittest

from alive.engine.answer_index_distribution import (
    build_deterministic_repair_plan,
    choice_order_evidence,
    evaluate_answer_index_distribution,
    is_answer_distribution_target,
)


def question(ordinal: int, answer_index: int, *, ordered: bool = False) -> dict:
    item = {
        "id": ordinal,
        "questionType": "객관식",
        "content": f"문항 {ordinal}",
        "choices": ["1", "2", "3", "4", "5"],
        "answer": "①②③④⑤"[answer_index - 1],
        "solution": f"따라서 정답은 {'①②③④⑤'[answer_index - 1]}이다.",
    }
    if ordered:
        item["orderedChoice"] = True
    return item


def exam(positions: list[int], *, ordered: bool = False) -> list[dict]:
    return [question(index, position, ordered=ordered) for index, position in enumerate(positions, 1)]


class AnswerIndexDistributionTests(unittest.TestCase):
    def test_concentrated_nineteen_is_fail(self) -> None:
        result = evaluate_answer_index_distribution(exam([2] + [3] * 18))
        self.assertEqual("FAIL", result["gateStatus"])
        self.assertEqual(
            {
                "ANSWER_INDEX_DISTRIBUTION_EXCESS",
                "ANSWER_INDEX_RUN_EXCESS",
                "ANSWER_INDEX_VARIETY_INSUFFICIENT",
            },
            set(result["failureCodes"]),
        )

    def test_balanced_nineteen_with_two_run_is_pass(self) -> None:
        positions = [1, 2, 3, 4, 5] * 2 + [1, 1, 2, 3, 4] + [2, 3, 4, 5]
        result = evaluate_answer_index_distribution(exam(positions))
        self.assertEqual("PASS", result["gateStatus"])
        self.assertEqual(1, result["maxMinusMin"])
        self.assertEqual(2, result["longestSameAnswerRun"])

    def test_fourteen_max_minus_min_excess_is_fail(self) -> None:
        positions = [3, 2, 3, 5, 3, 2, 3, 4, 3, 5, 1, 3, 4, 5]
        result = evaluate_answer_index_distribution(exam(positions))
        self.assertEqual("FAIL", result["gateStatus"])
        self.assertIn("ANSWER_INDEX_DISTRIBUTION_EXCESS", result["failureCodes"])

    def test_fourteen_balanced_counts_is_pass(self) -> None:
        result = evaluate_answer_index_distribution(exam([1, 2, 3, 4, 5] * 2 + [1, 2, 3, 4]))
        self.assertEqual("PASS", result["gateStatus"])

    def test_uniform_counts_with_three_run_is_fail(self) -> None:
        positions = [1, 2, 3] * 3 + [4, 4, 4] + [1, 2, 3, 4, 5] + [5, 5, 5]
        result = evaluate_answer_index_distribution(exam(positions))
        self.assertEqual("FAIL", result["gateStatus"])
        self.assertIn("ANSWER_INDEX_RUN_EXCESS", result["failureCodes"])

    def test_immutable_questions_can_block_repair(self) -> None:
        positions = [1, 1, 1, 2, 3, 4, 5, 2, 3, 4]
        result = evaluate_answer_index_distribution(exam(positions, ordered=True))
        self.assertEqual("BLOCKED", result["gateStatus"])
        self.assertIn("ANSWER_INDEX_REPAIR_BLOCKED_IMMUTABLE", result["failureCodes"])
        self.assertEqual(10, result["immutableCount"])

    def test_embedded_choice_labels_are_immutable(self) -> None:
        item = question(1, 3)
        item["choices"] = ["① 1", "② 2", "③ 3", "④ 4", "⑤ 5"]
        evidence = choice_order_evidence(item)
        self.assertFalse(evidence["choiceOrderMutable"])
        self.assertTrue(evidence["embeddedChoiceLabelDetected"])
        self.assertIn("EMBEDDED_CHOICE_LABEL", evidence["blockingReason"])

    def test_generated_scope_excludes_type_banks(self) -> None:
        self.assertTrue(is_answer_distribution_target("similar/high/h1/test_유사.js"))
        self.assertTrue(is_answer_distribution_target("similar/high/h1/candidate.js", exam_title="테스트 확인"))
        self.assertFalse(is_answer_distribution_target("types/high/h2/test_유형확인.js"))
        self.assertFalse(is_answer_distribution_target("types/high/h2/candidate.js", exam_title="테스트 유사"))

    def test_image_only_choices_are_excluded_with_evidence(self) -> None:
        item = {
            "id": 1,
            "questionType": "객관식",
            "content": "그림 보기",
            "choices": [],
            "answer": "③",
            "solution": "정답은 ③이다.",
            "image": "assets/q01.png",
        }
        result = evaluate_answer_index_distribution([item])
        self.assertEqual("NOT_APPLICABLE_LOW_MCQ_COUNT", result["gateStatus"])
        self.assertEqual(0, result["validMcqCount"])
        self.assertEqual(1, result["emptyChoicesMcq"])
        self.assertTrue(result["questionEvidence"][0]["imageChoiceDetected"])
        self.assertFalse(result["questionEvidence"][0]["choiceOrderMutable"])

    def test_repair_plan_is_deterministic_and_minimum_change(self) -> None:
        positions = [2] + [3] * 18
        first = build_deterministic_repair_plan(
            exam(positions), source_file="similar/high/h1/test.js"
        )
        second = build_deterministic_repair_plan(
            exam(positions), source_file="similar/high/h1/test.js"
        )
        self.assertEqual(first, second)
        self.assertEqual("PLANNED", first["status"])
        self.assertEqual(19, sum(first["targetCounts"].values()))
        self.assertEqual(first["targetCounts"], {
            index: first["targetDistribution"][index - 1] for index in range(1, 6)
        })
        self.assertLessEqual(first["targetLongestRun"]["count"], 2)
        self.assertEqual(first["changedQuestionCount"], len(first["changedQuestionIds"]))

        @lru_cache(maxsize=None)
        def independent_best(index: int, counts: tuple[int, ...], last: int, run: int) -> int:
            if index == len(positions):
                return (
                    0
                    if sum(value > 0 for value in counts) == 5
                    and max(counts) - min(counts) <= 2
                    else -10**9
                )
            best = -10**9
            for candidate in range(1, 6):
                if candidate == last and run >= 2:
                    continue
                next_counts = list(counts)
                next_counts[candidate - 1] += 1
                best = max(
                    best,
                    (candidate == positions[index])
                    + independent_best(
                        index + 1,
                        tuple(next_counts),
                        candidate,
                        run + 1 if candidate == last else 1,
                    ),
                )
            return best

        minimum_changes = len(positions) - independent_best(0, (0, 0, 0, 0, 0), 0, 0)
        self.assertEqual(minimum_changes, first["changedQuestionCount"])

    def test_small_exam_uses_minimum_three_kinds_not_five_kind_balance(self) -> None:
        first = build_deterministic_repair_plan(
            exam([1, 1, 1, 2, 2, 2]), source_file="similar/high/h1/small.js"
        )
        self.assertEqual("PLANNED", first["status"])
        self.assertLessEqual(first["targetLongestRun"]["count"], 2)
        self.assertGreaterEqual(sum(value > 0 for value in first["targetCounts"].values()), 3)
        self.assertEqual(3, sum(value > 0 for value in first["targetCounts"].values()))
        self.assertEqual(2, first["changedQuestionCount"])


if __name__ == "__main__":
    unittest.main()
