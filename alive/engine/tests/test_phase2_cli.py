from __future__ import annotations

import json
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from io import StringIO
from pathlib import Path
from unittest.mock import patch

from alive.engine.alive_cli import main
from alive.engine.contracts import initial_stages
from alive.engine.run_store import RunStore, sha256_file, utc_now


class Phase2CliTests(unittest.TestCase):
    def test_dispatch_receipt_cli_lifecycle(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source = root / "archive/exams/original/high/h1/2final/exam.js"
            source.parent.mkdir(parents=True)
            source.write_text(
                'window.examTitle="exam";\nwindow.questionBank='
                '[{"id":19,"content":"문항","choices":["1","2"],"answer":"②","solution":"풀이"}];\n',
                encoding="utf-8",
            )
            runtime = root / "alive/runtime/runs"
            store = RunStore(runtime)
            now = utc_now()
            manifest = {
                "schemaVersion": "0.1.0",
                "engineVersion": "test",
                "runId": "phase2-dispatch-cli-test",
                "createdAt": now,
                "updatedAt": now,
                "status": "READY_FOR_ORCHESTRATION",
                "currentStage": "R03_SOURCE_ANALYSIS",
                "codes": [],
                "request": {},
                "sourceResolution": {},
                "sourceLock": {
                    "path": source.relative_to(root).as_posix(),
                    "sha256": sha256_file(source),
                    "bytes": source.stat().st_size,
                    "questionOrdinal": 1,
                },
                "stages": initial_stages(),
                "events": [],
            }
            store.create(manifest["runId"], manifest)

            def invoke(arguments: list[str]) -> tuple[int, dict]:
                output = StringIO()
                with (
                    patch("alive.engine.alive_cli.repository_root", return_value=root),
                    redirect_stdout(output),
                    redirect_stderr(StringIO()),
                ):
                    result = main([*arguments, "--runtime-root", str(runtime), "--json"])
                return result, json.loads(output.getvalue()) if output.getvalue() else {}

            self.assertEqual(0, invoke(["prepare", "--run", manifest["runId"]])[0])
            task_id = "R03_SOURCE_ANALYSIS:source_analysis:a"
            result, payload = invoke([
                "dispatch-start", "--run", manifest["runId"], "--task", task_id,
                "--external-id", "agent-123", "--route", "gpt-5.6-luna",
            ])
            self.assertEqual(0, result)
            self.assertFalse(payload["idempotent"])
            persisted = store.load(manifest["runId"])
            task = persisted["phase2"]["tasks"][task_id]
            self.assertEqual("DISPATCHED", task["status"])
            self.assertEqual("agent-123", task["dispatch"]["attempts"][-1]["externalId"])

            result, payload = invoke([
                "dispatch-start", "--run", manifest["runId"], "--task", task_id,
                "--external-id", "agent-123",
            ])
            self.assertEqual(0, result)
            self.assertTrue(payload["idempotent"])
            self.assertEqual(1, len(store.load(manifest["runId"])["phase2"]["tasks"][task_id]["dispatch"]["attempts"]))

            self.assertEqual(
                1,
                invoke([
                    "dispatch-start", "--run", manifest["runId"], "--task", task_id,
                    "--external-id", "agent-456",
                ])[0],
            )
            result, payload = invoke([
                "dispatch-fail", "--run", manifest["runId"], "--task", task_id,
                "--code", "AGENT_THREAD_LIMIT",
            ])
            self.assertEqual(0, result)
            self.assertEqual("PENDING", payload["status"])
            self.assertEqual("DISPATCH_FAILED", payload["dispatchStatus"])
            retried = store.load(manifest["runId"])["phase2"]["tasks"][task_id]
            self.assertEqual("DISPATCH_FAILED", retried["dispatch"]["attempts"][-1]["status"])

    def test_prepare_submit_reduce_r03_round_trip(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source = root / "archive/exams/original/high/h1/2final/exam.js"
            source.parent.mkdir(parents=True)
            source.write_text(
                'window.examTitle="exam";\nwindow.questionBank='
                '[{"id":19,"content":"문항","choices":["1","2"],"answer":"②","solution":"풀이"}];\n',
                encoding="utf-8",
            )
            runtime = root / "alive/runtime/runs"
            store = RunStore(runtime)
            now = utc_now()
            manifest = {
                "schemaVersion": "0.1.0",
                "engineVersion": "test",
                "runId": "phase2-cli-test",
                "createdAt": now,
                "updatedAt": now,
                "status": "READY_FOR_ORCHESTRATION",
                "currentStage": "R03_SOURCE_ANALYSIS",
                "codes": [],
                "request": {},
                "sourceResolution": {},
                "sourceLock": {
                    "path": source.relative_to(root).as_posix(),
                    "sha256": sha256_file(source),
                    "bytes": source.stat().st_size,
                    "questionOrdinal": 1,
                },
                "stages": initial_stages(),
                "events": [],
            }
            store.create(manifest["runId"], manifest)

            def invoke(arguments: list[str]) -> int:
                with patch("alive.engine.alive_cli.repository_root", return_value=root), redirect_stdout(StringIO()):
                    return main([*arguments, "--runtime-root", str(runtime), "--json"])

            self.assertEqual(0, invoke(["prepare", "--run", manifest["runId"]]))
            locked_sha = manifest["sourceLock"]["sha256"]
            for lane in ("a", "b"):
                task_id = f"R03_SOURCE_ANALYSIS:source_analysis:{lane}"
                artifact = {
                    "schemaVersion": "0.2.0",
                    "artifactType": "SOURCE_ANALYSIS",
                    "artifactId": f"analysis-{lane}",
                    "producerId": task_id,
                    "sourceLockSha256": locked_sha,
                    "analysisLane": lane.upper(),
                    "sourceQuestionId": "19",
                    "curriculum": {"course": "공통수학2", "unitKey": "H22-C2-07"},
                    "solutionStructure": ["조건 해석", "계산"],
                    "sourceFingerprint": {
                        "coreInvariants": ["핵심 조건"],
                        "mutableFeatures": ["수치"],
                    },
                    "assumptions": [],
                    "unresolvedPoints": [],
                }
                artifact_path = root / f"analysis-{lane}.json"
                artifact_path.write_text(json.dumps(artifact, ensure_ascii=False), encoding="utf-8")
                self.assertEqual(
                    0,
                    invoke([
                        "submit", "--run", manifest["runId"], "--task", task_id,
                        "--file", str(artifact_path),
                    ]),
                )

            self.assertEqual(0, invoke(["reduce", "--run", manifest["runId"]]))
            reduced = store.load(manifest["runId"])
            self.assertEqual("R04_CURRICULUM_FINGERPRINT", reduced["currentStage"])
            self.assertEqual(["analysis-a", "analysis-b"], reduced["phase2"]["sourceAnalysisArtifactIds"])
            self.assertNotIn("phase2", reduced["phase2"])


if __name__ == "__main__":
    unittest.main()
