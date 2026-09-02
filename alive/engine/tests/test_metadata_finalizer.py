from __future__ import annotations

import unittest

from alive.engine.metadata_finalizer import finalize_similar_metadata


class MetadataFinalizerTests(unittest.TestCase):
    def test_similar_tag_is_removed_without_touching_curriculum(self) -> None:
        metadata, report = finalize_similar_metadata(
            {"tags": ["기출", "확률분포", "기출"]},
            {"questionType": "객관식", "choices": ["1", "2", "3", "4", "5"]},
        )
        self.assertEqual(["확률분포"], metadata["tags"])
        self.assertEqual(["기출", "기출"], report["removedStaleTags"])
        self.assertEqual("PASS", report["verdict"])

    def test_stem_type_mismatch_is_reported_in_strict_mode(self) -> None:
        _, report = finalize_similar_metadata(
            {"tags": []},
            {"questionType": "서술형", "choices": [], "content": "두 자연수 x와 n을 구하시오."},
            strict_type=True,
        )
        self.assertEqual("FAIL", report["verdict"])
        self.assertEqual("QUESTION_TYPE_SEMANTIC_MISMATCH", report["findings"][0]["code"])


if __name__ == "__main__":
    unittest.main()
