from __future__ import annotations

import json
import tempfile
import unittest
from argparse import Namespace
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
from unittest.mock import patch

from alive.engine.alive_cli import capability_issues, main
from alive.engine.contracts import initial_stages
from alive.engine.run_store import RunStore, sha256_file, utc_now
from alive.engine.source_resolver import resolve_explicit_source, resolve_source


class Phase1Tests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        (self.root / "alive").mkdir()
        source_dir = self.root / "archive" / "exams" / "original" / "high" / "h1" / "2final"
        source_dir.mkdir(parents=True)
        self.source = source_dir / "25_금당고_2학기_기말_고1_기출.js"
        self.source.write_text("window.questionBank=[];\n", encoding="utf-8")
        self.second_source = source_dir / "25_순천고_2학기_기말_고1_기출.js"
        self.second_source.write_text("window.questionBank=[];\n", encoding="utf-8")
        index = [
            {
                "qKey": "original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js_19",
                "sourceFile": "original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js",
                "sourceOrdinal": 19,
                "grade": "고1",
                "subject": "공통수학2",
                "school": "금당고",
                "examYear": 2025,
                "semester": "2",
                "examType": "final"
            },
            {
                "qKey": "original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js_19",
                "sourceFile": "original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js",
                "sourceOrdinal": 19,
                "grade": "고1",
                "subject": "공통수학2",
                "school": "순천고",
                "examYear": 2025,
                "semester": "2",
                "examType": "final"
            }
        ]
        (self.root / "archive" / "question-index.js").write_text(
            "window.questionIndex=" + json.dumps(index, ensure_ascii=False) + ";\n",
            encoding="utf-8",
        )

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def test_resolve_unique_source_from_metadata(self) -> None:
        result = resolve_source(self.root, "25년 금당고 2학기 기말 고1 19번")
        self.assertEqual("UNIQUE", result["status"])
        self.assertEqual(19, result["selected"]["questionOrdinal"])

    def test_explicit_source_stays_under_archive_exams(self) -> None:
        result = resolve_explicit_source(
            self.root,
            "archive/exams/original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js",
            19,
        )
        self.assertEqual("UNIQUE", result["status"])
        with self.assertRaises(ValueError):
            resolve_explicit_source(self.root, "alive/not-a-source.js")

    def test_run_store_writes_atomic_manifest(self) -> None:
        store = RunStore(self.root / "alive" / "runtime" / "runs")
        now = utc_now()
        manifest = {
            "schemaVersion": "0.1.0",
            "engineVersion": "test",
            "runId": "test-run",
            "createdAt": now,
            "updatedAt": now,
            "status": "READY_FOR_ORCHESTRATION",
            "currentStage": "R03_SOURCE_ANALYSIS",
            "codes": [],
            "request": {},
            "sourceResolution": {},
            "sourceLock": {"sha256": sha256_file(self.source)},
            "stages": initial_stages(),
            "events": [],
        }
        run_dir = store.create("test-run", manifest)
        loaded = store.load("test-run")
        self.assertEqual("test-run", loaded["runId"])
        self.assertTrue((run_dir / "candidates").is_dir())
        self.assertFalse(any(run_dir.glob(".manifest.json.*.tmp")))

    def test_capability_precheck_rejects_unsupported_mode(self) -> None:
        supported = Namespace(
            mode="EXAM_FOLLOWUP",
            followup_kind="CONFIRMATION",
            operation_mode="GENERATE",
            output_profile="JS_ARCHIVE",
        )
        unsupported = Namespace(
            mode="TYPE_BANK",
            followup_kind="CONFIRMATION",
            operation_mode="GENERATE",
            output_profile="JS_ARCHIVE",
        )
        self.assertEqual([], capability_issues(supported))
        self.assertIn("generationMode=TYPE_BANK", capability_issues(unsupported))

    def test_ambiguous_run_can_resume_with_explicit_source(self) -> None:
        runtime = self.root / "alive" / "runtime" / "runs"
        output = StringIO()
        with patch("alive.engine.alive_cli.repository_root", return_value=self.root), redirect_stdout(output):
            start_code = main(
                [
                    "start",
                    "--query",
                    "25년 2학기 기말 고1 19번",
                    "--runtime-root",
                    str(runtime),
                    "--json",
                ]
            )
        self.assertEqual(2, start_code)
        manifest_path = next(runtime.glob("*/manifest.json"))
        blocked = json.loads(manifest_path.read_text(encoding="utf-8"))
        self.assertEqual("SOURCE_AMBIGUOUS", blocked["codes"][0])

        source_relative = self.source.relative_to(self.root).as_posix()
        with patch("alive.engine.alive_cli.repository_root", return_value=self.root), redirect_stdout(StringIO()):
            resume_code = main(
                [
                    "resume",
                    "--run",
                    blocked["runId"],
                    "--source-file",
                    source_relative,
                    "--question",
                    "19",
                    "--runtime-root",
                    str(runtime),
                    "--json",
                ]
            )
        self.assertEqual(0, resume_code)
        resumed = json.loads(manifest_path.read_text(encoding="utf-8"))
        self.assertEqual("READY_FOR_ORCHESTRATION", resumed["status"])
        self.assertEqual("R03_SOURCE_ANALYSIS", resumed["currentStage"])
        self.assertEqual([], resumed["codes"])


if __name__ == "__main__":
    unittest.main()
