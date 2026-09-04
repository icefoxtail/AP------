from __future__ import annotations

import hashlib
import json
import tempfile
import unittest
from pathlib import Path

from alive.engine.reference_examples import select_reference_examples
from alive.engine.rule_pack import RULE_READ_ORDER, load_rule_pack


class RulePackTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def write_complete_rule_pack(self) -> None:
        entries: list[tuple[str, int, str]] = []
        for index, repository_path in enumerate(RULE_READ_ORDER, 1):
            path = self.root / repository_path
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(f"rule fixture {index}\n", encoding="utf-8")
            data = path.read_bytes()
            entries.append((repository_path.removeprefix("docs/rules/"), len(data), hashlib.sha256(data).hexdigest()))
        compiled = self.root / "archive/data/master_tables/js_archive_tag_master.json"
        compiled.parent.mkdir(parents=True, exist_ok=True)
        compiled.write_text(json.dumps([{"key": "FIXTURE", "status": "active"}]), encoding="utf-8")
        manifest = self.root / "docs/rules/MANIFEST.md"
        manifest.write_text(
            "# fixture\n\n"
            + "\n".join(f"- {path} | {size} bytes | sha256 {sha256}" for path, size, sha256 in entries)
            + "\n",
            encoding="utf-8",
        )

    def test_missing_pack_is_recorded_for_isolated_fixture(self) -> None:
        snapshot = load_rule_pack(self.root)
        self.assertEqual("NOT_AVAILABLE", snapshot["status"])
        self.assertFalse(snapshot["required"])
        self.assertIn("RULE_PACK_MANIFEST_MISSING", snapshot["codes"])

    def test_complete_pack_is_ready_and_stable(self) -> None:
        self.write_complete_rule_pack()
        first = load_rule_pack(self.root, required=True)
        second = load_rule_pack(self.root, required=True)
        self.assertEqual("READY", first["status"])
        self.assertEqual(22, len(first["files"]))
        self.assertIn("docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md", first["readOrder"])
        self.assertEqual("PASS", first["compiledMaster"]["status"])
        self.assertEqual(first["snapshotSha256"], second["snapshotSha256"])

    def test_manifest_hash_drift_is_fail_closed(self) -> None:
        self.write_complete_rule_pack()
        target = self.root / RULE_READ_ORDER[3]
        target.write_text("changed\n", encoding="utf-8")
        snapshot = load_rule_pack(self.root, required=True)
        self.assertEqual("SOURCE_PACK_DRIFT", snapshot["status"])
        self.assertIn("SOURCE_PACK_DRIFT", snapshot["codes"])

    def test_missing_common_protocol_is_fail_closed(self) -> None:
        self.write_complete_rule_pack()
        (self.root / "docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md").unlink()
        snapshot = load_rule_pack(self.root, required=True)
        self.assertEqual("SOURCE_PACK_DRIFT", snapshot["status"])
        self.assertIn("RULE_PACK_REQUIRED_FILE_MISSING", snapshot["codes"])
        self.assertIn("SOURCE_PACK_DRIFT", snapshot["codes"])


def _question(*, status: str, content: str, subunit: str = "H22-C2-01-COORDINATE_METRIC") -> dict:
    return {
        "id": 1,
        "level": "중",
        "category": "평면좌표",
        "originalCategory": "평면좌표",
        "standardCourse": "공통수학2",
        "standardUnitKey": "H22-C2-01",
        "standardUnit": "평면좌표",
        "standardUnitOrder": 1,
        "subUnitKey": subunit,
        "subUnit": "평면좌표와 거리",
        "subUnitConfidence": "rule_inferred",
        "subUnitClassificationDepth": "complete_rule",
        "questionType": "객관식",
        "layoutTag": "grid",
        "tags": ["평면좌표"],
        "wide": False,
        "content": content,
        "choices": ["1", "2", "3", "4", "5"],
        "answer": "③",
        "solution": "풀이 내용",
        "reviewStatus": status,
        "solutionStatus": status,
        "imageStatus": "none",
    }


class ReferenceSelectorTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.similar = self.root / "archive/exams/similar/high/h1"
        self.similar.mkdir(parents=True)

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def write_similar(self, name: str, question: dict) -> None:
        payload = "window.examTitle = \"fixture\";\nwindow.questionBank = " + json.dumps([question], ensure_ascii=False) + ";\n"
        (self.similar / name).write_text(payload, encoding="utf-8")

    def test_selects_reviewed_examples_and_hides_answer_solution(self) -> None:
        self.write_similar("reviewed.js", _question(status="reviewed_pass", content="검수된 유사 문항"))
        self.write_similar("pending.js", _question(status="generated_pending", content="보류된 유사 문항"))
        source = {
            "source": {"path": "archive/exams/original/source.js", "sha256": "source"},
            "questions": [_question(status="reviewed_pass", content="새로운 원문 문항")],
        }
        pack = select_reference_examples(
            self.root,
            source,
            source_path="archive/exams/original/source.js",
            limit_per_question=2,
        )
        self.assertEqual("READY", pack["status"])
        self.assertEqual(1, pack["selectedCount"])
        selected = pack["questions"]["1"]["selected"][0]
        self.assertIn("same_subunit", selected["matchReasons"])
        self.assertNotIn("answer", selected["studentPayload"])
        self.assertNotIn("solution", selected["studentPayload"])
        self.assertEqual(1, pack["catalog"]["eligibleQuestions"])
        self.assertGreaterEqual(pack["catalog"]["excludedByReason"].get("QUESTION_NOT_REVIEWED_PASS", 0), 1)


if __name__ == "__main__":
    unittest.main()
