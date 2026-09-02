from __future__ import annotations

import json
import tempfile
import unittest
import zipfile
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
from unittest.mock import patch

from alive.engine.alive_cli import build_parser, main
from alive.engine.run_store import RunStore, sha256_file
from alive.engine.runtime_lifecycle import (
    RuntimeLifecycleError,
    finalize_run,
    runtime_gc,
)


class RuntimeLifecycleTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.runtime = self.root / "alive/runtime/staged-runs"
        self.results = self.root / "alive/runtime/results"
        self.quarantine = self.root / "quarantine"
        self.store = RunStore(self.runtime)

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def create_run(self, run_id: str, status: str, *, package: bool = False) -> Path:
        manifest = {
            "runId": run_id,
            "status": status,
            "currentStage": "S09_PACKAGE" if package else "S04_REVISION",
            "createdAt": "2020-01-01T00:00:00Z",
            "updatedAt": "2020-01-01T00:00:00Z",
            "request": {
                "query": "런타임 수명주기 테스트",
                "sourceFile": "archive/exams/test.js",
                "expectedQuestionCount": 1,
            },
            "codes": [],
            "events": [{"type": "TEST"}],
            "tasks": {},
        }
        run_dir = self.store.create(run_id, manifest)
        if package:
            package_path = run_dir / "final/alive-staged-exam-pack.zip"
            with zipfile.ZipFile(package_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
                archive.writestr("final/structured-exam.json", "{}")
            manifest["package"] = {
                "zipSha256": sha256_file(package_path),
                "roundTrip": "PASS",
                "publicationStatus": "NOT_PUBLISHED",
            }
            self.store.save(run_id, manifest)
        return run_dir

    def test_finalize_preserves_compact_summary_and_moves_workdir(self) -> None:
        run_dir = self.create_run("failed-run", "FAILED")

        result = finalize_run(
            self.runtime,
            "failed-run",
            result_root=self.results,
            quarantine_root=self.quarantine,
        )

        self.assertEqual("MOVED", result["cleanup"]["status"])
        self.assertFalse(run_dir.exists())
        self.assertTrue((self.quarantine / "failed-run/manifest.json").is_file())
        summary_path = self.results / "failed-run-summary.json"
        self.assertTrue(summary_path.is_file())
        summary = json.loads(summary_path.read_text(encoding="utf-8"))
        self.assertEqual("FAILED", summary["status"])
        self.assertIsNone(summary["package"])

        repeated = finalize_run(
            self.runtime,
            "failed-run",
            result_root=self.results,
            quarantine_root=self.quarantine,
        )
        self.assertTrue(repeated["idempotent"])

    def test_finalize_copies_and_verifies_package(self) -> None:
        self.create_run("packaged-run", "DRAFT_PACKAGED", package=True)

        result = finalize_run(
            self.runtime,
            "packaged-run",
            result_root=self.results,
            quarantine_root=self.quarantine,
        )

        package = self.results / "packaged-run.zip"
        self.assertTrue(package.is_file())
        self.assertEqual(sha256_file(package), result["package"]["sha256"])
        with zipfile.ZipFile(package) as archive:
            self.assertIsNone(archive.testzip())
            self.assertIn("final/structured-exam.json", archive.namelist())

    def test_held_run_is_never_finalized_implicitly(self) -> None:
        run_dir = self.create_run("held-run", "MANUAL_REVIEW_REQUIRED")

        with self.assertRaisesRegex(RuntimeLifecycleError, "held run is protected"):
            finalize_run(
                self.runtime,
                "held-run",
                result_root=self.results,
                quarantine_root=self.quarantine,
            )
        self.assertTrue(run_dir.exists())

    def test_gc_dry_run_then_apply_only_handles_old_terminal_runs(self) -> None:
        self.create_run("failed-old", "FAILED")
        self.create_run("active-old", "ROUND1_GENERATING")
        self.create_run("blocked-old", "BLOCKED")

        dry_run = runtime_gc(
            self.root,
            runtime_root=self.runtime,
            result_root=self.results,
            quarantine_root=self.quarantine,
            older_than_hours=0,
        )
        self.assertEqual("DRY_RUN", dry_run["mode"])
        self.assertEqual(["failed-old"], [item["runId"] for item in dry_run["candidates"]])
        self.assertTrue((self.runtime / "failed-old").exists())
        self.assertTrue((self.runtime / "active-old").exists())
        self.assertTrue((self.runtime / "blocked-old").exists())

        applied = runtime_gc(
            self.root,
            runtime_root=self.runtime,
            result_root=self.results,
            quarantine_root=self.quarantine,
            older_than_hours=0,
            apply=True,
        )
        self.assertEqual("APPLY", applied["mode"])
        self.assertEqual(1, applied["finalizedCount"])
        self.assertFalse((self.runtime / "failed-old").exists())
        self.assertTrue((self.runtime / "active-old").exists())
        self.assertTrue((self.runtime / "blocked-old").exists())

    def test_gc_can_include_blocked_only_when_explicit(self) -> None:
        self.create_run("blocked-run", "BLOCKED")
        result = runtime_gc(
            self.root,
            runtime_root=self.runtime,
            result_root=self.results,
            quarantine_root=self.quarantine,
            older_than_hours=0,
            apply=True,
            include_blocked=True,
        )
        self.assertEqual(1, result["finalizedCount"])
        self.assertFalse((self.runtime / "blocked-run").exists())

    def test_package_commands_default_to_cleanup_with_escape_hatch(self) -> None:
        parser = build_parser()
        args = parser.parse_args(["staged-exam-package", "--run", "run-1"])
        self.assertFalse(args.keep_workdir)
        retained = parser.parse_args(["staged-exam-package", "--run", "run-1", "--keep-workdir"])
        self.assertTrue(retained.keep_workdir)

    def test_staged_package_cli_auto_finalizes_by_default(self) -> None:
        self.create_run("cli-run", "DRAFT_PACKAGED", package=True)
        manifest = self.store.load("cli-run")
        output = StringIO()

        with patch("alive.engine.alive_cli.repository_root", return_value=self.root), patch(
            "alive.engine.staged_exam.package_staged_exam", return_value=manifest
        ), redirect_stdout(output):
            code = main(
                [
                    "staged-exam-package",
                    "--run",
                    "cli-run",
                    "--runtime-root",
                    str(self.runtime),
                    "--result-root",
                    str(self.results),
                    "--quarantine-root",
                    str(self.quarantine),
                    "--json",
                ]
            )

        self.assertEqual(0, code)
        payload = json.loads(output.getvalue())
        self.assertEqual("MOVED", payload["cleanup"]["cleanup"]["status"])
        self.assertFalse((self.runtime / "cli-run").exists())
        self.assertTrue((self.results / "cli-run.zip").is_file())


if __name__ == "__main__":
    unittest.main()
