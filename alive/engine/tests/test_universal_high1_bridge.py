from __future__ import annotations

import copy
import unittest
from pathlib import Path

from alive.engine.universal_candidate import UniversalCandidateError, validate_universal_candidate
from alive.engine.universal_high1_bridge import build_high1_universal_inputs
from alive.engine.universal_ir import validate_universal_question_ir


class UniversalHigh1BridgeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.root = Path(__file__).resolve().parents[3]

    def test_bridge_covers_all_canonical_units_with_exact_review_and_assets(self) -> None:
        value = build_high1_universal_inputs(self.root, run_id="bridge-test")
        self.assertEqual("EXPERIMENTAL_FIXTURE_REPLAY", value["status"])
        self.assertEqual(18, value["questionCount"])
        self.assertEqual(18, len(value["sourceIR"]))
        self.assertEqual(18, len(value["candidates"]))
        self.assertEqual(18, len(value["independentReviews"]))
        self.assertEqual(10, sum(item.get("visualSpec") is not None for item in value["candidates"]))
        self.assertEqual(10, sum(item.get("solutionVisualSpec") is not None for item in value["candidates"]))
        for ordinal, ir in enumerate(value["sourceIR"], 1):
            self.assertEqual(str(ordinal), ir["sourceQuestionId"])
            self.assertEqual("PASS", validate_universal_question_ir(ir)["status"])
        for candidate in value["candidates"]:
            self.assertEqual("PASS", validate_universal_candidate(candidate)["candidateValidation"]["status"])

    def test_candidate_rejects_engine_rendered_choice_labels(self) -> None:
        value = build_high1_universal_inputs(self.root, run_id="bridge-choice-label-test")
        bad = copy.deepcopy(value["candidates"][0])
        bad["studentPayload"]["choices"] = ["① 1", "2", "3"]
        with self.assertRaisesRegex(UniversalCandidateError, "rendered choice labels"):
            validate_universal_candidate(bad)


if __name__ == "__main__":
    unittest.main()
