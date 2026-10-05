from __future__ import annotations

import hashlib
import json
import tempfile
import unittest
from pathlib import Path

from alive.engine.source_question import (
    SourceQuestionError,
    artifact_sha256,
    canonical_json_bytes,
    extract_source_exam,
    extract_source_question,
)


class SourceQuestionTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.source = self.root / "exam.js"

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def write_source(self, question_bank: str, prefix: str = "") -> bytes:
        text = (
            f'{prefix}window.examTitle = "25_금당고_2학기_기말_고1_기출";\n'
            f"window.questionBank = {question_bank};\n"
        )
        self.source.write_text(text, encoding="utf-8")
        return self.source.read_bytes()

    def test_extracts_by_array_ordinal_and_preserves_complete_question(self) -> None:
        questions = [
            {
                "id": 40,
                "content": "첫 문항",
                "choices": ["가", "나"],
                "answer": "①",
                "solution": "첫 풀이",
            },
            {
                "id": 99,
                "level": "상",
                "standardCourse": "공통수학2",
                "standardUnitKey": "H22-C2-07",
                "content": "둘째 문항 $x^2$",
                "choices": ["$1$", "$2$", "$3$"],
                "answer": "②",
                "solution": "둘째 풀이",
                "tags": ["함수", "객관식"],
                "wide": False,
            },
        ]
        source_bytes = self.write_source(json.dumps(questions, ensure_ascii=False))

        artifact = extract_source_question(
            self.source,
            2,
            {
                "path": "archive/exams/original/example.js",
                "sha256": hashlib.sha256(source_bytes).hexdigest(),
                "bytes": len(source_bytes),
                "questionOrdinal": 2,
            },
        )

        self.assertEqual(2, artifact["selection"]["ordinal"])
        self.assertEqual(1, artifact["selection"]["arrayIndex"])
        self.assertEqual(99, artifact["selection"]["sourceId"])
        self.assertEqual(questions[1], artifact["question"])
        self.assertEqual("25_금당고_2학기_기말_고1_기출", artifact["examTitle"])
        self.assertEqual("archive/exams/original/example.js", artifact["source"]["path"])

    def test_extracts_complete_exam_without_executing_javascript(self) -> None:
        questions = [
            {"id": 1, "content": "첫 문항", "choices": [], "answer": "1", "solution": "풀이"},
            {"id": 2, "content": "둘째 문항", "choices": [], "answer": "2", "solution": "풀이"},
        ]
        source_bytes = self.write_source(json.dumps(questions, ensure_ascii=False))
        artifact = extract_source_exam(
            self.source,
            {"path": "archive/exams/original/example.js", "sha256": hashlib.sha256(source_bytes).hexdigest()},
        )
        self.assertEqual("ALIVE_SOURCE_EXAM", artifact["artifactType"])
        self.assertEqual(2, artifact["questionCount"])
        self.assertEqual(questions, artifact["questions"])
        self.assertEqual(artifact["artifactSha256"], artifact_sha256(artifact))

    def test_artifact_is_canonical_json_and_self_hash_verifies(self) -> None:
        questions = [{"content": "문항", "choices": [], "answer": "7", "solution": "풀이"}]
        self.write_source(json.dumps(questions, ensure_ascii=False))

        source_lock = {
            "path": "source.js",
            "sha256": hashlib.sha256(self.source.read_bytes()).hexdigest(),
        }
        first = extract_source_question(self.source, 1, source_lock)
        second = extract_source_question(self.source, 1, source_lock)

        self.assertEqual(canonical_json_bytes(first), canonical_json_bytes(second))
        self.assertEqual(first["artifactSha256"], artifact_sha256(first))
        json.loads(canonical_json_bytes(first).decode("utf-8"))

    def test_ignores_assignment_text_inside_strings_and_comments(self) -> None:
        prefix = (
            '// window.questionBank = [{"content":"fake"}];\n'
            'const note = "window.questionBank = notReal";\n'
            "/* window.questionBank = [] */\n"
        )
        self.write_source(
            '[{"content":"real","choices":[],"answer":"1","solution":"ok"}]',
            prefix=prefix,
        )

        artifact = extract_source_question(self.source, 1)

        self.assertEqual("real", artifact["question"]["content"])

    def test_rejects_source_hash_mismatch(self) -> None:
        self.write_source('[{"content":"q","choices":[],"answer":"1","solution":"s"}]')

        with self.assertRaisesRegex(SourceQuestionError, "locked source"):
            extract_source_question(self.source, 1, {"sha256": "0" * 64})

    def test_rejects_source_lock_ordinal_and_byte_size_mismatch(self) -> None:
        source_bytes = self.write_source(
            '[{"content":"q","choices":[],"answer":"1","solution":"s"}]'
        )
        source_hash = hashlib.sha256(source_bytes).hexdigest()

        with self.assertRaisesRegex(SourceQuestionError, "question ordinal"):
            extract_source_question(
                self.source,
                1,
                {"sha256": source_hash, "questionOrdinal": 2},
            )
        with self.assertRaisesRegex(SourceQuestionError, "byte size"):
            extract_source_question(
                self.source,
                1,
                {"sha256": source_hash, "bytes": len(source_bytes) + 1},
            )

    def test_rejects_dynamic_javascript_without_executing_it(self) -> None:
        marker = self.root / "must-not-exist.txt"
        self.source.write_text(
            "window.questionBank = buildQuestions();\n"
            f'require("fs").writeFileSync({json.dumps(str(marker))}, "bad");\n',
            encoding="utf-8",
        )

        with self.assertRaisesRegex(SourceQuestionError, "literal JSON array"):
            extract_source_question(self.source, 1)
        self.assertFalse(marker.exists())

    def test_rejects_non_json_array_members_and_duplicate_keys(self) -> None:
        self.write_source(
            '[{"content":"q","choices":[],"answer":"1","solution":"s",'
            '"content":"overwritten"}]'
        )
        with self.assertRaisesRegex(SourceQuestionError, "duplicate JSON object key"):
            extract_source_question(self.source, 1)

        self.write_source(
            '[{"content":"q","choices":[],"answer":"1","solution":"s"}, makeQuestion()]'
        )
        with self.assertRaisesRegex(SourceQuestionError, "dynamic JavaScript"):
            extract_source_question(self.source, 1)

    def test_rejects_multiple_banks_and_out_of_range_ordinal(self) -> None:
        self.source.write_text(
            'window.questionBank = [{"content":"q","answer":"1","solution":"s"}];\n'
            "window.questionBank = [];\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(SourceQuestionError, "exactly one"):
            extract_source_question(self.source, 1)

        self.write_source('[{"content":"q","answer":"1","solution":"s"}]')
        with self.assertRaisesRegex(SourceQuestionError, "outside the source range"):
            extract_source_question(self.source, 2)
        with self.assertRaisesRegex(SourceQuestionError, "positive integer"):
            extract_source_question(self.source, 0)

    def test_rejects_missing_or_invalid_required_payload(self) -> None:
        self.write_source('[{"content":"q","choices":"not-an-array","answer":"1","solution":"s"}]')
        with self.assertRaisesRegex(SourceQuestionError, "choices"):
            extract_source_question(self.source, 1)

        self.write_source('[{"content":"q","choices":[],"answer":"1"}]')
        with self.assertRaisesRegex(SourceQuestionError, "missing required field: solution"):
            extract_source_question(self.source, 1)


if __name__ == "__main__":
    unittest.main()
