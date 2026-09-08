from __future__ import annotations

import json
from copy import deepcopy
import tempfile
import unittest
from pathlib import Path
from alive.engine.tests.legacy_dispatch_fixture import legacy_dispatched_task

from alive.engine.task_runtime import (
    all_current_tasks_submitted,
    fail_task_dispatch,
    prepare_stage_tasks,
    start_task_dispatch,
    submit_task_artifact,
)


class TaskRuntimeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.run_dir = Path(self.temporary.name)
        for name in ("source", "plans", "candidates", "evidence", "render", "final"):
            (self.run_dir / name).mkdir()
        self.manifest = {
            "currentStage": "R03_SOURCE_ANALYSIS",
            "sourceLock": {"sha256": "a" * 64, "questionOrdinal": 3},
            "phase2": {},
        }

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def test_prepare_is_idempotent_and_outputs_are_disjoint(self) -> None:
        first = prepare_stage_tasks(self.run_dir, self.manifest)
        second = prepare_stage_tasks(self.run_dir, self.manifest)
        self.assertEqual(first, second)
        self.assertEqual(2, len(first))
        self.assertEqual(2, len({item["outputPath"] for item in first}))

    def test_prepare_uses_the_canonical_source_artifact_id(self) -> None:
        (self.run_dir / "source" / "source-question.json").write_text(
            json.dumps({"selection": {"sourceId": "q003"}}), encoding="utf-8"
        )

        tasks = prepare_stage_tasks(self.run_dir, self.manifest)

        self.assertEqual({"q003"}, {task["sourceQuestionId"] for task in tasks})

    def test_submit_validates_and_freezes_artifact(self) -> None:
        tasks = prepare_stage_tasks(self.run_dir, self.manifest)
        input_path = self.run_dir / "agent-output.json"
        input_path.write_text(
            json.dumps({
                "value": 1,
                "producerId": tasks[0]["producerId"],
                "sourceLockSha256": tasks[0]["sourceLockSha256"],
                "sourceQuestionId": tasks[0]["sourceQuestionId"],
            }) + "\n",
            encoding="utf-8",
        )

        def validator(kind, payload, context):
            self.assertEqual("source_analysis", kind)
            self.assertEqual("a", context["task"]["slot"])
            return {"artifactKind": kind, **payload}

        submitted = submit_task_artifact(
            self.run_dir,
            self.manifest,
            tasks[0]["taskId"],
            input_path,
            validator,
        )
        self.assertEqual("SUBMITTED", submitted["status"])
        output = json.loads((self.run_dir / submitted["outputPath"]).read_text(encoding="utf-8"))
        self.assertEqual("source_analysis", output["artifactKind"])
        with self.assertRaises(ValueError):
            submit_task_artifact(
                self.run_dir,
                self.manifest,
                tasks[0]["taskId"],
                input_path,
                validator,
            )
        self.assertFalse(all_current_tasks_submitted(self.manifest))

    def test_dispatch_receipt_is_idempotent_and_rejects_other_active_agent(self) -> None:
        task = prepare_stage_tasks(self.run_dir, self.manifest)[0]

        before = deepcopy(self.manifest)
        with self.assertRaisesRegex(ValueError, "HOLD:LEGACY_AGENT_DISPATCH_DISABLED"):
            start_task_dispatch(self.manifest, task["taskId"], "agent-123")
        self.assertEqual(before, self.manifest)
        dispatched = legacy_dispatched_task(task, "agent-123")

        repeated, idempotent = start_task_dispatch(self.manifest, task["taskId"], "agent-123")
        self.assertTrue(idempotent)
        self.assertIs(dispatched, repeated)
        self.assertEqual(1, len(dispatched["dispatch"]["attempts"]))
        before = deepcopy(self.manifest)
        with self.assertRaisesRegex(ValueError, "HOLD:LEGACY_AGENT_DISPATCH_DISABLED"):
            start_task_dispatch(self.manifest, task["taskId"], "agent-456")
        self.assertEqual(before, self.manifest)

    def test_dispatch_failure_preserves_active_receipt_without_retry(self) -> None:
        task = prepare_stage_tasks(self.run_dir, self.manifest)[0]
        legacy_dispatched_task(task, "agent-123")
        before = deepcopy(self.manifest)
        with self.assertRaisesRegex(ValueError, "HOLD:PROVIDER_RECONCILIATION_REQUIRED_NO_AUTOMATIC_RETRY"):
            fail_task_dispatch(self.manifest, task["taskId"], "AGENT_THREAD_LIMIT")
        with self.assertRaisesRegex(ValueError, "HOLD:LEGACY_AGENT_DISPATCH_DISABLED"):
            start_task_dispatch(self.manifest, task["taskId"], "agent-456")
        self.assertEqual(before, self.manifest)

    def test_submit_accepts_dispatched_task_and_closes_its_receipt(self) -> None:
        task = prepare_stage_tasks(self.run_dir, self.manifest)[0]
        legacy_dispatched_task(task, "agent-123")
        input_path = self.run_dir / "agent-output.json"
        input_path.write_text(
            json.dumps({
                "producerId": task["producerId"],
                "sourceLockSha256": task["sourceLockSha256"],
                "sourceQuestionId": task["sourceQuestionId"],
            }) + "\n",
            encoding="utf-8",
        )

        submitted = submit_task_artifact(
            self.run_dir,
            self.manifest,
            task["taskId"],
            input_path,
            lambda kind, payload, context: payload,
        )

        self.assertEqual("SUBMITTED", submitted["status"])
        self.assertEqual("SUBMITTED", submitted["dispatch"]["attempts"][0]["status"])

    def test_submit_rejects_source_analysis_identity_before_validator(self) -> None:
        tasks = prepare_stage_tasks(self.run_dir, self.manifest)
        task = tasks[0]
        payload = {
            "producerId": task["producerId"],
            "sourceLockSha256": task["sourceLockSha256"],
            "sourceQuestionId": task["sourceQuestionId"],
        }
        validator_called = False

        def validator(kind, artifact, context):
            nonlocal validator_called
            validator_called = True
            return artifact

        for field, wrong_value in (
            ("sourceQuestionId", "q001"),
            ("producerId", "other-producer"),
            ("sourceLockSha256", "b" * 64),
        ):
            with self.subTest(field=field):
                invalid_payload = {**payload, field: wrong_value}
                input_path = self.run_dir / f"invalid-{field}.json"
                input_path.write_text(json.dumps(invalid_payload) + "\n", encoding="utf-8")
                with self.assertRaisesRegex(ValueError, f"artifact\\.{field} does not match the task packet"):
                    submit_task_artifact(
                        self.run_dir,
                        self.manifest,
                        task["taskId"],
                        input_path,
                        validator,
                    )
                self.assertFalse(validator_called)
                self.assertEqual("PENDING", task["status"])
                self.assertFalse((self.run_dir / task["outputPath"]).exists())


if __name__ == "__main__":
    unittest.main()
