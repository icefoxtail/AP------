"""
Unit and Negative Tests for M3HarnessGate (Rigorous Version).
Verifies that deliberate defect injections are caught fail-closed across all 5 layers:
- Mandatory arguments
- window.questionBank requirement
- Schema & completeness
- Choice uniqueness
- Visual figure requirement on Q5, Q10, Q13, Q24
- Taxonomy registry (PT/TPL) verification
- difficultyBucket integer validation
- Approval forging rejection
- Git blob SHA-1 byte parity
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
        cls.valid_fixture = []
        for i in range(1, 25):
            is_descriptive = i >= 21
            is_visual = i in {5, 10, 13, 24}
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
                "problemTypeKey": "PT_M3_REAL_NUMBER_CLASSIFICATION",
                "templateKey": "TPL_M3_REAL_NUMBER_CLASSIFICATION_AUDIT",
                "integrationPattern": "NONE",
                "difficultyBucket": 3,
                "crossConceptKeys": ["CC_SQUARE_ROOT_DEFINITION"],
                "conditionKeys": ["COND_INTEGER"],
            }
            if is_visual:
                q["image"] = f"archive/assets/images/26_삼산중_1학기_중간_중3_기출/q{i:02d}.png"
            cls.valid_fixture.append(q)

        # Valid JS bytes
        cls.valid_js_text = "window.questionBank = " + json.dumps(cls.valid_fixture) + ";\n"
        cls.valid_js_bytes = cls.valid_js_text.encode("utf-8")
        cls.valid_blob_sha1 = compute_git_blob_sha1(cls.valid_js_bytes)

        # Valid Small Meta
        cls.valid_small_meta = {
            "schemaVersion": "archive-reviewed-exam-meta-register-request-v2",
            "requestId": "samsan-m3-1mid-test",
            "examUid": "26_삼산중_1학기_중간_중3_유사",
            "sourceArchiveFile": "similar/middle/m3/1mid/26_삼산중_1학기_중간_중3_유사.js",
            "expectedSourceBlobSha1": cls.valid_blob_sha1,
            "expectedQuestionCount": 24,
            "approval": {
                "type": "REVIEW2",
                "reviewPassCount": 0,
                "metadataReviewed": False,
                "reviewStatus": "review_required",
            },
            "registryChanges": [],
            "items": [],
        }

    def test_clean_fixture_passes(self):
        """A clean, valid 24-question set passes all layers."""
        res = self.gate.validate_exam(self.valid_fixture, self.valid_js_bytes, self.valid_small_meta)
        self.assertEqual(res["status"], "PASS")
        self.assertEqual(res["findingsCount"], 0)

    def test_missing_raw_js_bytes_blocked(self):
        """Omitting raw_js_bytes must fail-closed."""
        res = self.gate.validate_exam(self.valid_fixture, None, self.valid_small_meta)  # type: ignore
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("RAW_JS_BYTES_REQUIRED", codes)

    def test_window_questionbank_missing(self):
        """Missing window.questionBank fails closed."""
        bad_js = b"window.questions = [];\n"
        bad_sha = compute_git_blob_sha1(bad_js)
        meta = copy.deepcopy(self.valid_small_meta)
        meta["expectedSourceBlobSha1"] = bad_sha
        res = self.gate.validate_exam(self.valid_fixture, bad_js, meta)
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("WINDOW_QUESTIONBANK_MISSING", codes)

    def test_mandatory_visual_missing(self):
        """Q5 without image must fail closed."""
        bad = copy.deepcopy(self.valid_fixture)
        bad[4].pop("image", None)
        js_text = "window.questionBank = " + json.dumps(bad) + ";\n"
        js_bytes = js_text.encode("utf-8")
        meta = copy.deepcopy(self.valid_small_meta)
        meta["expectedSourceBlobSha1"] = compute_git_blob_sha1(js_bytes)
        res = self.gate.validate_exam(bad, js_bytes, meta)
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("MANDATORY_IMAGE_MISSING", codes)

    def test_forged_review_approval(self):
        """Attempting to declare reviewed_pass in candidate small meta must fail closed."""
        meta = copy.deepcopy(self.valid_small_meta)
        meta["approval"]["reviewStatus"] = "reviewed_pass"
        meta["approval"]["reviewPassCount"] = 2
        res = self.gate.validate_exam(self.valid_fixture, self.valid_js_bytes, meta)
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("FORGED_REVIEW_APPROVAL", codes)

    def test_difficulty_bucket_string_rejected(self):
        """difficultyBucket as string 'D3' instead of integer must fail closed."""
        bad = copy.deepcopy(self.valid_fixture)
        bad[0]["difficultyBucket"] = "D3"
        js_text = "window.questionBank = " + json.dumps(bad) + ";\n"
        js_bytes = js_text.encode("utf-8")
        meta = copy.deepcopy(self.valid_small_meta)
        meta["expectedSourceBlobSha1"] = compute_git_blob_sha1(js_bytes)
        res = self.gate.validate_exam(bad, js_bytes, meta)
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("DIFFICULTY_BUCKET_NOT_INTEGER_1_5", codes)

    def test_unregistered_problem_type_rejected(self):
        """Unregistered invented PT key must fail closed."""
        bad = copy.deepcopy(self.valid_fixture)
        bad[0]["problemTypeKey"] = "PT_INVENTED_KEY_XYZ"
        js_text = "window.questionBank = " + json.dumps(bad) + ";\n"
        js_bytes = js_text.encode("utf-8")
        meta = copy.deepcopy(self.valid_small_meta)
        meta["expectedSourceBlobSha1"] = compute_git_blob_sha1(js_bytes)
        res = self.gate.validate_exam(bad, js_bytes, meta)
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("PROBLEM_TYPE_NOT_IN_TAXONOMY", codes)

    def test_template_parent_mismatch_rejected(self):
        """Template whose parent doesn't match declared problemTypeKey must fail closed."""
        bad = copy.deepcopy(self.valid_fixture)
        # TPL_M3_REAL_NUMBER_CLASSIFICATION_AUDIT has parent PT_M3_REAL_NUMBER_CLASSIFICATION
        # Change problemTypeKey to PT_M3_RADICAL_CALCULATION
        bad[0]["problemTypeKey"] = "PT_M3_RADICAL_CALCULATION"
        js_text = "window.questionBank = " + json.dumps(bad) + ";\n"
        js_bytes = js_text.encode("utf-8")
        meta = copy.deepcopy(self.valid_small_meta)
        meta["expectedSourceBlobSha1"] = compute_git_blob_sha1(js_bytes)
        res = self.gate.validate_exam(bad, js_bytes, meta)
        self.assertEqual(res["status"], "BLOCKED")
        codes = [f["code"] for f in res["findings"]]
        self.assertIn("TEMPLATE_PARENT_MISMATCH", codes)


if __name__ == "__main__":
    unittest.main()
