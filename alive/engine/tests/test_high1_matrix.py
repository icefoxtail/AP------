from __future__ import annotations

import unittest
from pathlib import Path

from alive.engine.high1_matrix import load_high1_matrix, summarize_high1_matrix


class High1MatrixTests(unittest.TestCase):
    def setUp(self) -> None:
        self.root = Path(__file__).resolve().parents[3]

    def test_matrix_declares_the_canonical_high1_scope(self) -> None:
        matrix = load_high1_matrix(self.root)
        self.assertEqual("ACTIVE_PRODUCTION", matrix["status"])
        self.assertEqual(18, len(matrix["units"]))
        self.assertEqual(
            [f"H22-C-{index:02d}" for index in range(1, 10)]
            + [f"H22-C2-{index:02d}" for index in range(1, 10)],
            [unit["unitKey"] for unit in matrix["units"]],
        )

    def test_matrix_labels_and_orders_are_checked_against_canonical_master(self) -> None:
        matrix = load_high1_matrix(self.root)
        by_key = {unit["unitKey"]: unit for unit in matrix["units"]}
        self.assertEqual("다항식의 연산", by_key["H22-C-01"]["label"])
        self.assertEqual("원의 방정식", by_key["H22-C2-03"]["label"])
        self.assertEqual(9, by_key["H22-C-09"]["order"])

    def test_all_units_are_active_but_archive_feeds_remain_unpublished(self) -> None:
        matrix = load_high1_matrix(self.root)
        summary = summarize_high1_matrix(matrix)
        self.assertTrue(summary["officialHigh1Ready"])
        self.assertFalse(summary["productionFeedsEnabled"])
        geometry = [unit for unit in matrix["units"] if unit["unitKey"].startswith("H22-C2-0") and unit["order"] <= 4]
        self.assertEqual(["ACTIVE_UNIT"] * 4, [unit["promotionState"] for unit in geometry])
        self.assertEqual(18, summary["activeUnitCount"])


if __name__ == "__main__":
    unittest.main()
