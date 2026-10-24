"""
Unit and Negative Tests for M3HarnessGate.
Verifies that deliberate defect injections are caught fail-closed across all 5 layers:
Layer 1: Schema & Completeness
Layer 2: Choice Uniqueness & Distractor Sanity
Layer 3: Visual Asset Parity
Layer 4: Meta Foundation Registry Parity
Layer 5: Small JSON Contract & Blob Parity
"""

import copy
import hashlib
import json
import unittest
from pathlib import Path

from alive.engine.m3_harness_gate import M3HarnessGate, compute_git_blob_sha1


class TestM3HarnessGate(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.gate = M3HarnessGate()
        # Build a valid synthetic 24-question fixture
        cls.valid_fixture = []
        for i in range(1, 25):
            is_descriptive = i >= 21
            q = {
                "id": i,
                "questionType": "서술형" if is_descriptive else "객관식",
                "content": f"테스트 문항 {i} 내용입니다. $x^2 - {i} = 0$",
                "solution": f"테스트 풀이 {i} 입니다. 단계별로 전개하여 계산합니다.",
                "answer": f"x = \\pm \\sqrt{{{i}}}" if is_descriptive else "③",
                "choices": [] if is_descriptive else ["1", "2", "3", "4", "5"],
                "standardCourse": "중3 수학",
                "standardUnitKey": "M3-01",
                "subUnitKey": "M3-01-SQUARE_ROOT_REAL_NUMBER",
                "integrationPattern": "NONE",
                "difficultyBucket": "D3",
                "crossConceptKeys": ["CC_POLYNOMIAL_FACTORIZATION"],
                "conditionKeys": ["COND_INTEGER"],
            }
            cls.valid_fixture.append(q)

    def test_clean_fixture_passes(self):
        """A clean, valid 24-question set passes all layers."""
        res = self.gate.validate_exam(self.valid_fixture)
        self.assertEqual(res["status"], "PASS")
        self.assertEqual(res["findingsCount"], 0)

    def test_layer1_incomplete_question_count(self):
        """Layer 1 fails closed if question count != 24."""
        partial = self.valid_fixture[:23]
        res = self.gate.validate_exam(partial)
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("QUESTION_COUNT_MISMATCH", codes)

    def test_layer1_forbidden_markup_in_solution(self):
        """Layer 1 fails closed if solution contains forbidden debug / placeholder tags."""
        bad = copy.deepcopy(self.valid_fixture)
        bad[2]["solution"] += "\n<debug> internal value check </debug>"
        res = self.gate.validate_exam(bad)
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("FORBIDDEN_MARKUP_IN_SOLUTION", codes)

    def test_layer2_duplicate_choices(self):
        """Layer 2 fails closed if multiple-choice question contains duplicate options."""
        bad = copy.deepcopy(self.valid_fixture)
        bad[0]["choices"] = ["1", "2", "3", "3", "5"]
        res = self.gate.validate_exam(bad)
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("DUPLICATE_CHOICES", codes)

    def test_layer2_invalid_answer_symbol(self):
        """Layer 2 fails closed if answer is not a circled digit for multiple choice."""
        bad = copy.deepcopy(self.valid_fixture)
        bad[0]["answer"] = "3"  # Non-circled digit
        res = self.gate.validate_exam(bad)
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("INVALID_ANSWER_SYMBOL", codes)

    def test_layer3_missing_image_asset(self):
        """Layer 3 fails closed if image refers to non-existent file on disk."""
        bad = copy.deepcopy(self.valid_fixture)
        bad[4]["image"] = "assets/images/non_existent_folder_xyz/q99.png"
        res = self.gate.validate_exam(bad)
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("ASSET_FILE_NOT_FOUND", codes)

    def test_layer4_invalid_concept_key(self):
        """Layer 4 fails closed if crossConceptKeys contains uncompiled invented string."""
        bad = copy.deepcopy(self.valid_fixture)
        bad[0]["crossConceptKeys"] = ["PYTHAGOREAN_THEOREM"]  # Missing CC_ prefix, non-canonical
        res = self.gate.validate_exam(bad)
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("METADATA_CONCEPT_KEY_INVALID", codes)

    def test_layer4_invalid_integration_pattern(self):
        """Layer 4 fails closed if integrationPattern is not in canonical enum."""
        bad = copy.deepcopy(self.valid_fixture)
        bad[0]["integrationPattern"] = "PARALLEL_FLOW"  # Invented pattern
        res = self.gate.validate_exam(bad)
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("INTEGRATION_PATTERN_INVALID", codes)

    def test_layer5_blob_sha1_mismatch(self):
        """Layer 5 fails closed if git blob SHA-1 doesn't match small JSON declaration."""
        js_bytes = b"window.questions = [];\n"
        actual_sha1 = compute_git_blob_sha1(js_bytes)
        tampered_sha1 = "a" * 40
        small_meta = {
            "schemaVersion": "archive-reviewed-exam-meta-register-request-v2",
            "expectedQuestionCount": 24,
            "expectedSourceBlobSha1": tampered_sha1,
        }
        res = self.gate.validate_exam(self.valid_fixture, raw_js_bytes=js_bytes, small_meta=small_meta)
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("BLOB_SHA_MISMATCH", codes)


if __name__ == "__main__":
    unittest.main()
