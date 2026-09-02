from __future__ import annotations

import json
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

from alive.engine import adaptive_quality_runtime as runtime
from alive.engine.run_store import atomic_write_json
from alive.engine.staged_exam import (
    StagedExamError,
    StagedRunStore,
    mark_staged_task_complete,
    record_staged_task_heartbeat,
)


def _source_question(ordinal: int) -> dict:
    return {
        "id": ordinal,
        "level": "중",
        "category": "함수",
        "originalCategory": "함수",
        "standardCourse": "공통수학2",
        "standardUnitKey": "H22-C2-07",
        "standardUnit": "함수",
        "standardUnitOrder": 7,
        "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
        "subUnit": "함수의 뜻과 그래프",
        "subUnitConfidence": "rule_inferred",
        "subUnitClassificationDepth": "complete_rule",
        "questionType": "객관식",
        "layoutTag": "grid",
        "tags": ["객관식", "함수"],
        "wide": False,
        "content": f"문항 {ordinal}의 값을 구하여라. [{ordinal + 2}점]",
        "choices": ["1", "2", "3", "4", "5"],
        "answer": "③",
        "solution": "원문 풀이",
    }


class AdaptiveQualityRuntimeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.source = self.root / "archive/exams/original/high/h1/2final/adaptive.js"
        self.source.parent.mkdir(parents=True)
        self.runtime_root = self.root / "alive/runtime/adaptive-staged-runs"
        self.store = StagedRunStore(self.runtime_root)

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def start(
        self, count: int = 10, *, batch_strategy: str = "AUTO"
    ) -> dict:
        self.source.write_text(
            'window.examTitle = "적응형 런타임 테스트";\n'
            + "window.questionBank = "
            + json.dumps(
                [_source_question(i) for i in range(1, count + 1)],
                ensure_ascii=False,
            )
            + ";\n",
            encoding="utf-8",
        )
        return runtime.start_adaptive_staged_exam(
            self.root,
            self.store,
            self.source.relative_to(self.root).as_posix(),
            "적응형 런타임 테스트 전체 유사",
            "test-engine",
            batch_strategy=batch_strategy,
        )

    def mark_browser_ready(self, manifest: dict) -> None:
        evidence = self.root / "browser-readiness.json"
        atomic_write_json(
            evidence,
            {
                "actualBrowser": True,
                "productionEngine": True,
                "smoke": {"ready": True, "renderError": None},
            },
        )
        runtime.record_adaptive_render_readiness(
            self.store, manifest["runId"], evidence
        )

    def test_auto_batch_policy_keeps_each_batch_at_four_questions_or_less(self) -> None:
        manifest = self.start(10)
        self.assertEqual(3, len(manifest["batches"]))
        self.assertEqual([4, 3, 3], [len(item["ordinals"]) for item in manifest["batches"].values()])
        self.assertEqual(
            "AUTO_MAX_QUESTIONS_PER_BATCH",
            manifest["request"]["batchPolicy"]["mode"],
        )
        self.assertEqual(4, manifest["request"]["batchPolicy"]["targetBatchSize"])

    def test_four_balanced_policy_creates_four_weighted_batches(self) -> None:
        manifest = self.start(10, batch_strategy="FOUR_BALANCED")
        self.assertEqual(4, len(manifest["batches"]))
        self.assertEqual(
            "FOUR_BALANCED_WEIGHTED",
            manifest["request"]["batchPolicy"]["mode"],
        )
        self.assertEqual("FOUR_BALANCED", manifest["request"]["batchPolicy"]["strategy"])
        self.assertEqual("WEIGHTED_BALANCED", manifest["request"]["batchStrategy"])
        self.assertEqual("WEIGHTED_BALANCED", manifest["batchPlan"]["strategy"])
        self.assertEqual(list(range(1, 11)), sorted(
            ordinal
            for batch in manifest["batches"].values()
            for ordinal in batch["ordinals"]
        ))
        self.assertLessEqual(
            max(len(batch["ordinals"]) for batch in manifest["batches"].values()),
            6,
        )

    def test_dispatch_requires_browser_readiness_then_allows_ready_evidence(self) -> None:
        manifest = self.start(4)
        task_id = "b01-round1"
        with self.assertRaises(StagedExamError):
            runtime.start_adaptive_staged_dispatch(
                self.store, manifest["runId"], task_id, "before-readiness"
            )
        self.assertEqual("BLOCKED", self.store.load(manifest["runId"])["status"])
        self.mark_browser_ready(manifest)
        task, idempotent = runtime.start_adaptive_staged_dispatch(
            self.store, manifest["runId"], task_id, "after-readiness"
        )
        self.assertFalse(idempotent)
        self.assertEqual("DISPATCHED", task["status"])

    def test_stale_watchdog_requeues_then_exhausts_dispatch_budget(self) -> None:
        manifest = self.start(4)
        self.mark_browser_ready(manifest)
        task_id = "b01-round1"
        runtime.start_adaptive_staged_dispatch(
            self.store, manifest["runId"], task_id, "stale-1"
        )
        old = (datetime.now(timezone.utc) - timedelta(seconds=120)).isoformat().replace("+00:00", "Z")
        manifest = self.store.load(manifest["runId"])
        manifest["tasks"][task_id]["dispatch"]["attempts"][-1]["startedAt"] = old
        self.store.save(manifest["runId"], manifest)

        reaped = runtime.reap_stale_adaptive_dispatches(
            self.store, manifest["runId"], timeout_seconds=10
        )
        self.assertEqual([task_id], reaped)
        manifest = self.store.load(manifest["runId"])
        task = manifest["tasks"][task_id]
        self.assertEqual("PENDING", task["status"])
        self.assertEqual(1, task["retryCounters"]["dispatch"])
        self.assertEqual("dispatch", task["dispatch"]["attempts"][-1]["failureClass"])

        runtime.start_adaptive_staged_dispatch(
            self.store, manifest["runId"], task_id, "stale-2"
        )
        manifest = self.store.load(manifest["runId"])
        manifest["tasks"][task_id]["dispatch"]["attempts"][-1]["startedAt"] = old
        self.store.save(manifest["runId"], manifest)
        runtime.reap_stale_adaptive_dispatches(
            self.store, manifest["runId"], timeout_seconds=10
        )
        manifest = self.store.load(manifest["runId"])
        self.assertEqual("FAILED", manifest["tasks"][task_id]["status"])
        self.assertIn("ADAPTIVE_DISPATCH_RETRY_EXHAUSTED", manifest["codes"])

    def test_fresh_agent_heartbeat_prevents_false_stale_reap(self) -> None:
        manifest = self.start(4)
        self.mark_browser_ready(manifest)
        task_id = "b01-round1"
        runtime.start_adaptive_staged_dispatch(
            self.store, manifest["runId"], task_id, "heartbeat-test"
        )
        manifest = self.store.load(manifest["runId"])
        old = (datetime.now(timezone.utc) - timedelta(seconds=120)).isoformat().replace("+00:00", "Z")
        manifest["tasks"][task_id]["dispatch"]["attempts"][-1]["startedAt"] = old
        self.store.save(manifest["runId"], manifest)

        heartbeat = record_staged_task_heartbeat(
            self.store,
            manifest["runId"],
            task_id,
            "SOURCE_VISUAL_RECON",
            progress=25,
        )
        self.assertEqual("SOURCE_VISUAL_RECON", heartbeat["phase"])
        self.assertEqual([], runtime.reap_stale_adaptive_dispatches(
            self.store, manifest["runId"], timeout_seconds=10
        ))
        self.assertEqual(
            "DISPATCHED",
            self.store.load(manifest["runId"])["tasks"][task_id]["status"],
        )

    def test_retry_records_previous_heartbeat_baseline(self) -> None:
        manifest = self.start(4)
        self.mark_browser_ready(manifest)
        task_id = "b01-round1"
        runtime.start_adaptive_staged_dispatch(
            self.store, manifest["runId"], task_id, "first-attempt"
        )
        record_staged_task_heartbeat(
            self.store, manifest["runId"], task_id, "S02_ROUND1_GENERATION", progress=10
        )
        runtime.fail_adaptive_dispatch(
            self.store, manifest["runId"], task_id, "AGENT_TRANSIENT_FAILURE"
        )
        runtime.start_adaptive_staged_dispatch(
            self.store, manifest["runId"], task_id, "retry-attempt"
        )
        manifest = self.store.load(manifest["runId"])
        retry = manifest["tasks"][task_id]["dispatch"]["attempts"][-1]
        self.assertIsInstance(retry.get("heartbeatBaselineMtimeNs"), int)
        self.assertEqual([], runtime.reap_stale_adaptive_dispatches(
            self.store, manifest["runId"], timeout_seconds=10
        ))

    def test_artifact_budget_is_counted_separately_from_dispatch_budget(self) -> None:
        manifest = self.start(4)
        self.mark_browser_ready(manifest)
        task_id = "b01-round1"
        for attempt in range(2):
            runtime.start_adaptive_staged_dispatch(
                self.store, manifest["runId"], task_id, f"artifact-{attempt}"
            )
            manifest = self.store.load(manifest["runId"])
            atomic_write_json(
                self.store.run_dir(manifest["runId"]) / manifest["tasks"][task_id]["outputPath"],
                {"artifactType": "INVALID_ADAPTIVE_ARTIFACT"},
            )
            mark_staged_task_complete(self.store, manifest["runId"], task_id)
            runtime.reconcile_adaptive_staged_run(self.store, manifest["runId"])
            manifest = self.store.load(manifest["runId"])
            if attempt == 0:
                self.assertEqual("PENDING", manifest["tasks"][task_id]["status"])
        self.assertEqual("FAILED", manifest["tasks"][task_id]["status"])
        self.assertEqual(2, manifest["tasks"][task_id]["retryCounters"]["artifact"])
        self.assertIn("ADAPTIVE_ARTIFACT_RETRY_EXHAUSTED", manifest["codes"])
