from __future__ import annotations

import unittest

from alive.engine.serialization_lint import normalize_serializable_text


class SerializationLintTests(unittest.TestCase):
    def test_raw_order_operator_is_safely_normalized_inside_math(self) -> None:
        normalized, changes, errors = normalize_serializable_text("조건은 $0<x<3$이다.")
        self.assertEqual("조건은 $0\\lt x\\lt 3$이다.", normalized)
        self.assertIn("RAW_ORDER_OPERATOR_NORMALIZED", changes)
        self.assertEqual([], errors)

    def test_ambiguous_unclosed_math_is_not_repaired(self) -> None:
        normalized, changes, errors = normalize_serializable_text("조건은 $x<3이다.")
        self.assertEqual("조건은 $x<3이다.", normalized)
        self.assertEqual([], changes)
        self.assertEqual("LATEX_DELIMITER_UNBALANCED", errors[0]["code"])

    def test_bare_relations_and_split_fragments_are_repaired(self) -> None:
        raw = "조건은 y=30/x이고, ∠$1=82°$, 2y−$x=80°$, $25$(1-c)이다."
        normalized, changes, errors = normalize_serializable_text(raw)
        self.assertEqual(
            "조건은 $y=30/x$이고, $∠1=82°$, $2y−x=80°$, $25(1-c)$이다.",
            normalized,
        )
        self.assertIn("BARE_MATH_WRAPPED", changes)
        self.assertIn("MATH_FRAGMENT_MERGED", changes)
        self.assertEqual([], errors)

    def test_math_chain_with_two_delimiters_is_merged(self) -> None:
        normalized, changes, errors = normalize_serializable_text("계산하면 $60°$$-36°=24°$이다.")
        self.assertEqual("계산하면 $60°-36°=24°$이다.", normalized)
        self.assertIn("MATH_FRAGMENT_MERGED", changes)
        self.assertEqual([], errors)


if __name__ == "__main__":
    unittest.main()
