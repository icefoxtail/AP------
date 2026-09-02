from __future__ import annotations

import unittest

from alive.engine.batch_planner import estimate_question_weight, weighted_batch_plan


class BatchPlannerTests(unittest.TestCase):
    def test_visual_and_constructed_questions_receive_more_work_weight(self) -> None:
        plain = {
            "visualDependency": "NONE",
            "solutionVisualRequirement": "NOT_REQUIRED",
            "solutionVisualElements": {},
        }
        visual = {
            "visualDependency": "ESSENTIAL",
            "solutionVisualRequirement": "MANDATORY",
            "solutionVisualElements": {"circle": True, "tangent": True},
        }
        self.assertGreater(
            estimate_question_weight(visual, {"questionType": "서술형", "wide": True}),
            estimate_question_weight(plain, {"questionType": "객관식", "wide": False}),
        )

    def test_weighted_plan_is_repeatable_and_balances_four_bins(self) -> None:
        preflight = [
            {
                "visualDependency": "ESSENTIAL" if ordinal in {2, 7, 9} else "NONE",
                "solutionVisualRequirement": "MANDATORY" if ordinal in {2, 7, 9} else "NOT_REQUIRED",
                "solutionVisualElements": {"line": True} if ordinal in {2, 7, 9} else {},
            }
            for ordinal in range(1, 23)
        ]
        questions = [
            {"questionType": "서술형" if ordinal == 18 else "객관식", "wide": ordinal == 18}
            for ordinal in range(1, 23)
        ]

        first = weighted_batch_plan(list(range(1, 23)), preflight, questions, 4)
        second = weighted_batch_plan(list(range(1, 23)), preflight, questions, 4)

        self.assertEqual(first, second)
        self.assertEqual(4, len(first["partitions"]))
        self.assertEqual(list(range(1, 23)), sorted(sum(first["partitions"], [])))
        self.assertLessEqual(max(map(len, first["partitions"])), 6)
        self.assertEqual("WEIGHTED_BALANCED", first["strategy"])
        self.assertEqual(22, len(first["questionWeights"]))


if __name__ == "__main__":
    unittest.main()
