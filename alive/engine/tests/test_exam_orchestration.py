from __future__ import annotations

import json
import tempfile
import unittest
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
from unittest.mock import patch

from alive.engine.alive_cli import main
from alive.engine.exam_orchestration import build_exam_status
from alive.engine.run_store import RunStore


class ExamOrchestrationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.runtime = self.root / "alive/runtime/runs"
        self.store = RunStore(self.runtime)

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def _create_batch(
        self,
        run_id: str,
        children: list[dict],
        *,
        parent_status: str = "READY_FOR_CHILD_RUNS",
        parent_stage: str = "E02_CHILD_RUNS",
    ) -> dict:
        child_map = {
            str(item["ordinal"]): {"runId": item["runId"]}
            for item in children
        }
        parent = {
            "schemaVersion": "0.4.0",
            "artifactType": "ALIVE_EXAM_BATCH_RUN",
            "runId": run_id,
            "status": parent_status,
            "currentStage": parent_stage,
            "codes": [],
            "request": {"expectedQuestionCount": len(children)},
            "children": child_map,
        }
        self.store.create(run_id, parent)
        for item in children:
            child = {
                "schemaVersion": "0.1.0",
                "runId": item["runId"],
                "status": item.get("status", "ACTIVE"),
                "currentStage": item["stage"],
                "codes": item.get("codes", []),
                "phase2": item.get("phase2", {}),
            }
            self.store.create(item["runId"], child)
        return parent

    @staticmethod
    def _task(task_id: str, status: str) -> dict:
        return {
            "taskId": task_id,
            "stageId": "R03_SOURCE_ANALYSIS",
            "status": status,
            "agent": "alive_source_analyst",
            "artifactKind": "source_analysis",
            "taskPacketPath": f"evidence/tasks/{task_id}.json",
            "outputPath": f"source/{task_id}.json",
        }

    def test_status_is_read_only_orders_work_and_never_redispatches_submitted(self) -> None:
        parent = self._create_batch(
            "parent-order",
            [
                {
                    "ordinal": 2,
                    "runId": "child-two",
                    "stage": "R04_CURRICULUM_FINGERPRINT",
                    "phase2": {
                        "tasks": {
                            "R04_CURRICULUM_FINGERPRINT:curriculum_fingerprint:main": {
                                "taskId": "R04_CURRICULUM_FINGERPRINT:curriculum_fingerprint:main",
                                "stageId": "R04_CURRICULUM_FINGERPRINT",
                                "status": "SUBMITTED",
                            }
                        }
                    },
                },
                {
                    "ordinal": 1,
                    "runId": "child-one",
                    "stage": "R03_SOURCE_ANALYSIS",
                    "phase2": {
                        "tasks": {
                            "R03_SOURCE_ANALYSIS:source_analysis:b": self._task(
                                "R03_SOURCE_ANALYSIS:source_analysis:b", "SUBMITTED"
                            ),
                            "R03_SOURCE_ANALYSIS:source_analysis:a": self._task(
                                "R03_SOURCE_ANALYSIS:source_analysis:a", "PENDING"
                            ),
                        }
                    },
                },
            ],
        )
        before = {
            item["runId"]: (self.store.run_dir(item["runId"]) / "manifest.json").read_bytes()
            for item in [parent, {"runId": "child-one"}, {"runId": "child-two"}]
        }

        report = build_exam_status(self.store, parent["runId"])

        self.assertEqual("RUNNING", report["terminal"]["state"])
        self.assertEqual(["AGENT_TASK", "REDUCE"], [action["kind"] for action in report["queue"]])
        self.assertEqual(
            "R03_SOURCE_ANALYSIS:source_analysis:a", report["queue"][0]["taskId"]
        )
        self.assertNotIn(
            "R03_SOURCE_ANALYSIS:source_analysis:b",
            [action.get("taskId") for action in report["queue"]],
        )
        self.assertEqual(2, report["progress"]["submittedTaskCount"])
        after = {
            item["runId"]: (self.store.run_dir(item["runId"]) / "manifest.json").read_bytes()
            for item in [parent, {"runId": "child-one"}, {"runId": "child-two"}]
        }
        self.assertEqual(before, after)

    def test_partial_dispatch_waits_without_redispatch_and_runtime_retry_requeues_pending(self) -> None:
        parent = self._create_batch(
            "parent-partial-dispatch",
            [
                {
                    "ordinal": 2,
                    "runId": "child-reduce",
                    "stage": "R03_SOURCE_ANALYSIS",
                    "phase2": {
                        "tasks": {
                            "R03_SOURCE_ANALYSIS:source_analysis:complete": self._task(
                                "R03_SOURCE_ANALYSIS:source_analysis:complete", "SUBMITTED"
                            )
                        }
                    },
                },
                {
                    "ordinal": 1,
                    "runId": "child-partial-dispatch",
                    "stage": "R03_SOURCE_ANALYSIS",
                    "phase2": {
                        "tasks": {
                            "R03_SOURCE_ANALYSIS:source_analysis:a": self._task(
                                "R03_SOURCE_ANALYSIS:source_analysis:a", "DISPATCHED"
                            ),
                            "R03_SOURCE_ANALYSIS:source_analysis:b": self._task(
                                "R03_SOURCE_ANALYSIS:source_analysis:b", "PENDING"
                            ),
                            "R03_SOURCE_ANALYSIS:source_analysis:c": self._task(
                                "R03_SOURCE_ANALYSIS:source_analysis:c", "SUBMITTED"
                            ),
                            "R03_SOURCE_ANALYSIS:source_analysis:d": self._task(
                                "R03_SOURCE_ANALYSIS:source_analysis:d", "DISPATCH_FAILED"
                            ),
                        }
                    },
                },
            ],
        )
        child_path = self.store.run_dir("child-partial-dispatch") / "manifest.json"
        before = child_path.read_bytes()

        report = build_exam_status(self.store, parent["runId"])

        self.assertEqual(
            ["AGENT_WAIT", "AGENT_TASK", "REDUCE"],
            [action["kind"] for action in report["queue"]],
        )
        self.assertEqual(
            [
                "R03_SOURCE_ANALYSIS:source_analysis:a",
                "R03_SOURCE_ANALYSIS:source_analysis:b",
                None,
            ],
            [action.get("taskId") for action in report["queue"]],
        )
        self.assertTrue(report["queue"][0]["poll"])
        self.assertEqual("DISPATCHED", report["queue"][0]["taskStatus"])
        self.assertEqual(1, report["progress"]["dispatchedTaskCount"])
        self.assertNotIn(
            "R03_SOURCE_ANALYSIS:source_analysis:a",
            [
                action.get("taskId")
                for action in report["queue"]
                if action["kind"] == "AGENT_TASK"
            ],
        )
        self.assertIn(
            {
                "scope": "CHILD",
                "ordinal": 1,
                "runId": "child-partial-dispatch",
                "stageId": "R03_SOURCE_ANALYSIS",
                "code": "TASK_DISPATCH_FAILED_AWAITING_RUNTIME_RETRY",
                "taskIds": ["R03_SOURCE_ANALYSIS:source_analysis:d"],
            },
            report["blocked"],
        )
        self.assertEqual(before, child_path.read_bytes())

        retried_child = self.store.load("child-partial-dispatch")
        retried_child["phase2"]["tasks"]["R03_SOURCE_ANALYSIS:source_analysis:d"]["status"] = "PENDING"
        self.store.save("child-partial-dispatch", retried_child)

        retry_report = build_exam_status(self.store, parent["runId"])

        self.assertEqual(
            ["R03_SOURCE_ANALYSIS:source_analysis:b", "R03_SOURCE_ANALYSIS:source_analysis:d"],
            [
                action["taskId"]
                for action in retry_report["queue"]
                if action["kind"] == "AGENT_TASK"
            ],
        )
        self.assertNotIn(
            "TASK_DISPATCH_FAILED_AWAITING_RUNTIME_RETRY",
            [item["code"] for item in retry_report["blocked"]],
        )

    def test_queue_covers_child_prepare_phase3_and_parent_transitions(self) -> None:
        parent = self._create_batch(
            "parent-child-actions",
            [
                {"ordinal": 1, "runId": "child-prepare", "stage": "R03_SOURCE_ANALYSIS"},
                {"ordinal": 2, "runId": "child-adapt", "stage": "R13_STRUCTURED_ADAPTER", "status": "PHASE2_COMPLETE"},
                {"ordinal": 3, "runId": "child-serialize", "stage": "R14_JS_SERIALIZER"},
                {"ordinal": 4, "runId": "child-browser", "stage": "R15_REAL_RENDER"},
                {"ordinal": 5, "runId": "child-package", "stage": "R16_PACKAGE"},
                {"ordinal": 6, "runId": "child-freeze", "stage": "R17_LOCAL_FREEZE"},
            ],
        )

        child_report = build_exam_status(self.store, parent["runId"])

        self.assertEqual(
            ["PREPARE", "ADAPT", "SERIALIZE", "BROWSER_RENDER", "PACKAGE", "FREEZE"],
            [action["kind"] for action in child_report["queue"]],
        )
        self.assertEqual(
            ["exam", "solution", "answer"], child_report["queue"][3]["requiredModes"]
        )

        parent_cases = (
            ("E03_ASSEMBLY", "READY_FOR_ASSEMBLY", "ASSEMBLE"),
            ("E04_REAL_RENDER", "READY_FOR_RENDER", "EXAM_BROWSER_RENDER"),
            ("E05_PACKAGE", "READY_FOR_PACKAGE", "EXAM_PACKAGE"),
        )
        for stage, status, expected_kind in parent_cases:
            with self.subTest(stage=stage):
                case = self._create_batch(
                    f"parent-{stage}", [], parent_status=status, parent_stage=stage
                )
                report = build_exam_status(self.store, case["runId"])
                self.assertEqual([expected_kind], [action["kind"] for action in report["queue"]])

    def test_all_frozen_children_queue_sync_and_terminal_parent_has_no_work(self) -> None:
        parent = self._create_batch(
            "parent-sync",
            [
                {
                    "ordinal": 1,
                    "runId": "child-frozen",
                    "stage": "R17_LOCAL_FREEZE",
                    "status": "LOCALLY_FROZEN",
                }
            ],
        )

        report = build_exam_status(self.store, parent["runId"])

        self.assertEqual(["EXAM_SYNC"], [action["kind"] for action in report["queue"]])
        self.assertEqual(1, report["progress"]["frozenChildRuns"])

        failed = self._create_batch(
            "parent-failed",
            [{"ordinal": 1, "runId": "child-still-active", "stage": "R03_SOURCE_ANALYSIS"}],
            parent_status="FAILED",
        )
        failed_report = build_exam_status(self.store, failed["runId"])
        self.assertEqual("FAILURE", failed_report["terminal"]["state"])
        self.assertEqual([], failed_report["queue"])

        frozen = self._create_batch(
            "parent-frozen", [], parent_status="LOCALLY_FROZEN", parent_stage="E06_LOCAL_FREEZE"
        )
        frozen_report = build_exam_status(self.store, frozen["runId"])
        self.assertEqual("SUCCESS", frozen_report["terminal"]["state"])
        self.assertEqual([], frozen_report["queue"])

    def test_cli_exam_status_emits_json_without_manifest_mutation(self) -> None:
        parent = self._create_batch(
            "parent-cli",
            [{"ordinal": 1, "runId": "child-cli", "stage": "R03_SOURCE_ANALYSIS"}],
        )
        manifest_path = self.store.run_dir(parent["runId"]) / "manifest.json"
        before = manifest_path.read_bytes()
        stdout = StringIO()

        with patch("alive.engine.alive_cli.repository_root", return_value=self.root), redirect_stdout(stdout):
            code = main([
                "exam-status", "--run", parent["runId"], "--runtime-root", str(self.runtime), "--json",
            ])

        self.assertEqual(0, code)
        payload = json.loads(stdout.getvalue())
        self.assertEqual("ALIVE_EXAM_ORCHESTRATION_STATUS", payload["artifactType"])
        self.assertEqual(["PREPARE"], [action["kind"] for action in payload["queue"]])
        self.assertEqual(before, manifest_path.read_bytes())


if __name__ == "__main__":
    unittest.main()
