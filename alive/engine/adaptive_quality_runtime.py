"""Public adaptive-run facade with pre-review gates and state closure.

``adaptive_staged_exam`` is an experimental, historically untracked module.
This small facade keeps the compatibility controller intact while making the
new deterministic gates and optional-stage state rules available to the CLI.
"""

from __future__ import annotations

import copy
import math
from pathlib import Path
from typing import Any

from . import adaptive_staged_exam as adaptive
from . import staged_exam as base
from .adaptive_quality_gates import AdaptiveQualityGateError, run_pre_review_gates
from .run_store import atomic_write_json, sha256_file, utc_now
from .source_question import artifact_sha256


ADAPTIVE_DEFAULT_BATCH_SIZE = 4
ADAPTIVE_MAX_BATCHES = 8
ADAPTIVE_FOUR_BATCH_COUNT = 4
# Luna xhigh batch generation can legitimately spend more than ten minutes
# thinking before its first artifact/heartbeat update. Keep the watchdog
# useful for genuinely lost agents without reaping healthy long-running work.
ADAPTIVE_STALE_TIMEOUT_SECONDS = 1800
ADAPTIVE_DISPATCH_RETRY_BUDGET = 2
ADAPTIVE_ARTIFACT_RETRY_BUDGET = 2
ADAPTIVE_RENDER_READINESS_PATH = "source/render-readiness.json"


def _failure_class(code: str) -> str:
    normalized = str(code or "").upper()
    if "ARTIFACT" in normalized or "LATEX" in normalized or "SVG" in normalized:
        return "artifact"
    if "REVIEW" in normalized or "MATH" in normalized or "SOLUTION" in normalized:
        return "review"
    return "dispatch"


def _retry_counters(task: dict[str, Any]) -> dict[str, int]:
    counters = task.setdefault(
        "retryCounters", {"dispatch": 0, "artifact": 0, "review": 0}
    )
    for key in ("dispatch", "artifact", "review"):
        counters[key] = int(counters.get(key, 0))
    return counters


def _annotate_latest_failure(task: dict[str, Any], code: str) -> dict[str, int]:
    counters = _retry_counters(task)
    failure_class = _failure_class(code)
    counters[failure_class] += 1
    attempts = task.get("dispatch", {}).get("attempts", [])
    if attempts:
        attempts[-1]["failureClass"] = failure_class
        attempts[-1]["retryBudget"] = (
            ADAPTIVE_DISPATCH_RETRY_BUDGET
            if failure_class == "dispatch"
            else ADAPTIVE_ARTIFACT_RETRY_BUDGET
            if failure_class == "artifact"
            else adaptive.ADAPTIVE_MAX_CORRECTION_CYCLES
        )
        attempts[-1]["retryCountForClass"] = counters[failure_class]
    return counters


def _rebuild_retry_counters(task: dict[str, Any]) -> dict[str, int]:
    counters = {"dispatch": 0, "artifact": 0, "review": 0}
    attempts = task.get("dispatch", {}).get("attempts", [])
    for attempt in attempts:
        if attempt.get("status") not in {"DISPATCH_FAILED", "ARTIFACT_REJECTED"}:
            continue
        failure_class = attempt.get("failureClass")
        if failure_class not in counters:
            code = attempt.get("code") or (
                "ARTIFACT_REJECTED"
                if attempt.get("status") == "ARTIFACT_REJECTED"
                else "DISPATCH_FAILED"
            )
            failure_class = _failure_class(str(code))
            attempt["failureClass"] = failure_class
        counters[failure_class] += 1
    task["retryCounters"] = counters
    return counters


def _parse_utc(value: Any) -> float | None:
    if not isinstance(value, str) or not value:
        return None
    try:
        from datetime import datetime, timezone

        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc).timestamp()
    except (TypeError, ValueError, OverflowError):
        return None


def _adaptive_batch_count(
    root: Path,
    source_file: str,
    requested: int | None,
    batch_strategy: str = "AUTO",
) -> int:
    normalized_strategy = str(batch_strategy or "AUTO").strip().upper()
    if normalized_strategy not in {"AUTO", "FOUR_BALANCED"}:
        raise base.StagedExamError("unsupported adaptive batch strategy")
    if requested is not None and int(requested) > 0:
        if normalized_strategy == "FOUR_BALANCED":
            requested = ADAPTIVE_FOUR_BATCH_COUNT
        else:
            return max(1, min(ADAPTIVE_MAX_BATCHES, int(requested)))
    _, preflight = base.preflight_exam(root, source_file)
    question_count = int(preflight.get("questionCount") or len(preflight.get("questions", [])))
    if normalized_strategy == "FOUR_BALANCED":
        return max(1, min(ADAPTIVE_FOUR_BATCH_COUNT, question_count))
    return max(1, min(ADAPTIVE_MAX_BATCHES, math.ceil(question_count / ADAPTIVE_DEFAULT_BATCH_SIZE)))


def _initial_render_readiness() -> dict[str, Any]:
    return {
        "status": "NOT_CHECKED",
        "required": True,
        "checkedBeforeGeneration": False,
        "reason": "browser smoke evidence is required before model dispatch",
        "path": ADAPTIVE_RENDER_READINESS_PATH,
    }


def _normalize_render_readiness(payload: dict[str, Any]) -> dict[str, Any]:
    smoke = payload.get("smoke")
    ready = (
        payload.get("actualBrowser") is True
        and payload.get("productionEngine") is True
        and isinstance(smoke, dict)
        and smoke.get("ready") is True
        and smoke.get("renderError") is None
    )
    normalized = copy.deepcopy(payload)
    normalized["schemaVersion"] = "0.1.0"
    normalized["artifactType"] = "ALIVE_ADAPTIVE_RENDER_READINESS"
    normalized["verdict"] = "PASS" if ready else "BLOCKED"
    normalized["checkedAt"] = utc_now()
    return normalized


def _close_unused_correction_stages(manifest: dict[str, Any]) -> None:
    loop = manifest.get("correctionLoop")
    if isinstance(loop, dict) and loop.get("cycles"):
        return
    for stage in manifest.get("stages", []):
        if stage.get("stageId") not in {
            adaptive.ADAPTIVE_CORRECTION_STAGE,
            adaptive.ADAPTIVE_CORRECTION_REVIEW_STAGE,
        }:
            continue
        if stage.get("status") == "PENDING":
            stage["status"] = "NOT_APPLICABLE"
            stage.setdefault("evidence", []).append(
                "no unresolved review or render finding required a correction cycle"
            )
    if isinstance(loop, dict) and loop.get("status") is None:
        loop["status"] = "NOT_USED"
    manifest.setdefault("events", []).append(
        {"at": utc_now(), "type": "ADAPTIVE_OPTIONAL_STAGES_CLOSED"}
    )


def start_adaptive_staged_exam(
    root: Path,
    store: Any,
    source_file: str,
    query: str | None,
    engine_version: str,
    source_resolution: dict[str, Any] | None = None,
    batch_count: int | None = None,
    variation_mode: str = "QUICK",
    batch_strategy: str = "AUTO",
) -> dict[str, Any]:
    normalized_batch_strategy = str(batch_strategy or "AUTO").strip().upper()
    resolved_batch_count = _adaptive_batch_count(
        root, source_file, batch_count, normalized_batch_strategy
    )
    original_limit = base.STAGED_MAX_BATCHES
    base.STAGED_MAX_BATCHES = max(original_limit, resolved_batch_count)
    try:
        manifest = adaptive.start_adaptive_staged_exam(
            root,
            store,
            source_file,
            query,
            engine_version,
            source_resolution=source_resolution,
            batch_count=resolved_batch_count,
            variation_mode=variation_mode,
            batch_strategy=(
                "WEIGHTED_BALANCED"
                if normalized_batch_strategy == "FOUR_BALANCED"
                else "CONTIGUOUS_BALANCED"
            ),
        )
    finally:
        base.STAGED_MAX_BATCHES = original_limit
    request = manifest.setdefault("request", {})
    question_count = int(request.get("expectedQuestionCount") or 0)
    request["batchPolicy"] = {
        "mode": (
            "FOUR_BALANCED_WEIGHTED"
            if normalized_batch_strategy == "FOUR_BALANCED"
            else "AUTO_MAX_QUESTIONS_PER_BATCH"
        ),
        "strategy": normalized_batch_strategy,
        "targetBatchSize": (
            math.ceil(question_count / resolved_batch_count)
            if normalized_batch_strategy == "FOUR_BALANCED" and resolved_batch_count
            else ADAPTIVE_DEFAULT_BATCH_SIZE
        ),
        "resolvedBatchCount": resolved_batch_count,
        "maxConcurrentTasks": adaptive.ADAPTIVE_MAX_CONCURRENT_TASKS,
        "maxQuestionsPerBatch": max(
            (len(batch.get("ordinals", [])) for batch in manifest.get("batches", {}).values()),
            default=0,
        ),
    }
    request["retryBudgets"] = {
        "dispatch": ADAPTIVE_DISPATCH_RETRY_BUDGET,
        "artifact": ADAPTIVE_ARTIFACT_RETRY_BUDGET,
        "correctionCycles": adaptive.ADAPTIVE_MAX_CORRECTION_CYCLES,
    }
    request["staleTimeoutSeconds"] = ADAPTIVE_STALE_TIMEOUT_SECONDS
    manifest["renderReadiness"] = _initial_render_readiness()
    manifest.setdefault("events", []).append(
        {
            "at": utc_now(),
            "type": "ADAPTIVE_BATCH_POLICY_CONFIGURED",
            "strategy": normalized_batch_strategy,
            "targetBatchSize": request["batchPolicy"]["targetBatchSize"],
            "resolvedBatchCount": resolved_batch_count,
        }
    )
    manifest.setdefault("events", []).append(
        {
            "at": utc_now(),
            "type": "ADAPTIVE_RENDER_READINESS_REQUIRED",
            "path": ADAPTIVE_RENDER_READINESS_PATH,
        }
    )
    _close_unused_correction_stages(manifest)
    store.save(manifest["runId"], manifest)
    return manifest


def record_adaptive_render_readiness(
    store: Any, run_id: str, evidence_path: Path
) -> dict[str, Any]:
    manifest = store.load(run_id)
    payload = base._json_file(evidence_path.resolve())
    normalized = _normalize_render_readiness(payload)
    run_dir = store.run_dir(run_id)
    target = run_dir / ADAPTIVE_RENDER_READINESS_PATH
    atomic_write_json(target, normalized)
    artifact_hash = sha256_file(target)
    readiness = {
        "status": normalized["verdict"],
        "required": True,
        "checkedBeforeGeneration": manifest.get("currentStage") == "S02_ROUND1_GENERATION",
        "path": ADAPTIVE_RENDER_READINESS_PATH,
        "artifactSha256": artifact_hash,
        "checkedAt": normalized["checkedAt"],
    }
    manifest["renderReadiness"] = readiness
    manifest["codes"] = [
        code
        for code in manifest.get("codes", [])
        if code not in {"ADAPTIVE_RENDER_READINESS_REQUIRED", "ADAPTIVE_RENDER_READINESS_BLOCKED"}
    ]
    if normalized["verdict"] == "PASS":
        if manifest.get("status") == "BLOCKED" and manifest.get("currentStage") == "S02_ROUND1_GENERATION":
            manifest["status"] = "ROUND1_GENERATING"
        manifest.setdefault("events", []).append(
            {"at": utc_now(), "type": "ADAPTIVE_RENDER_READINESS_PASS", "artifactSha256": artifact_hash}
        )
    else:
        if (
            manifest.get("currentStage") == "S02_ROUND1_GENERATION"
            and not any(
                task.get("status") == "DISPATCHED"
                for task in manifest.get("tasks", {}).values()
                if isinstance(task, dict)
            )
        ):
            manifest["status"] = "BLOCKED"
        manifest["codes"] = sorted(set(manifest.get("codes", []) + ["ADAPTIVE_RENDER_READINESS_BLOCKED"]))
        manifest.setdefault("events", []).append(
            {"at": utc_now(), "type": "ADAPTIVE_RENDER_READINESS_BLOCKED", "artifactSha256": artifact_hash}
        )
    base._refresh(manifest)
    store.save(run_id, manifest)
    return manifest


def start_adaptive_staged_dispatch(
    store: Any,
    run_id: str,
    task_id: str,
    external_id: str,
    route: str | None = None,
) -> tuple[dict[str, Any], bool]:
    manifest = store.load(run_id)
    readiness = manifest.get("renderReadiness", {})
    if readiness.get("status") != "PASS":
        if (
            manifest.get("currentStage") == "S02_ROUND1_GENERATION"
            and not any(
                task.get("status") == "DISPATCHED"
                for task in manifest.get("tasks", {}).values()
                if isinstance(task, dict)
            )
        ):
            manifest["status"] = "BLOCKED"
        manifest["codes"] = sorted(
            set(manifest.get("codes", []) + ["ADAPTIVE_RENDER_READINESS_REQUIRED"])
        )
        base._refresh(manifest)
        store.save(run_id, manifest)
        raise base.StagedExamError(
            "adaptive dispatch requires passing browser render readiness evidence"
        )
    return adaptive.start_adaptive_staged_dispatch(
        store, run_id, task_id, external_id, route
    )


def fail_adaptive_dispatch(
    store: Any, run_id: str, task_id: str, code: str
) -> dict[str, Any]:
    adaptive.fail_adaptive_staged_dispatch(store, run_id, task_id, code)
    manifest = store.load(run_id)
    task = manifest["tasks"][task_id]
    counters = _annotate_latest_failure(task, code)
    budget = (
        ADAPTIVE_DISPATCH_RETRY_BUDGET
        if _failure_class(code) == "dispatch"
        else ADAPTIVE_ARTIFACT_RETRY_BUDGET
        if _failure_class(code) == "artifact"
        else adaptive.ADAPTIVE_MAX_CORRECTION_CYCLES
    )
    if counters[_failure_class(code)] >= budget and task.get("status") == "PENDING":
        task["status"] = "FAILED"
        manifest["status"] = "FAILED"
        manifest["codes"] = sorted(
            set(manifest.get("codes", []) + [
                "ADAPTIVE_DISPATCH_RETRY_EXHAUSTED"
                if _failure_class(code) == "dispatch"
                else "ADAPTIVE_ARTIFACT_RETRY_EXHAUSTED"
            ])
        )
        base._append_event(
            manifest,
            "ADAPTIVE_RETRY_BUDGET_EXHAUSTED",
            taskId=task_id,
            failureClass=_failure_class(code),
            budget=budget,
        )
    base._refresh(manifest)
    store.save(run_id, manifest)
    return task


def reap_stale_adaptive_dispatches(
    store: Any,
    run_id: str,
    timeout_seconds: int = ADAPTIVE_STALE_TIMEOUT_SECONDS,
) -> list[str]:
    manifest = store.load(run_id)
    now = _parse_utc(utc_now()) or 0.0
    run_dir = store.run_dir(run_id)
    current_stage = manifest.get("currentStage")
    reaped: list[str] = []
    for task_id, task in manifest.get("tasks", {}).items():
        if task.get("status") != "DISPATCHED" or task.get("stage") != current_stage:
            continue
        attempts = task.get("dispatch", {}).get("attempts", [])
        latest = attempts[-1] if attempts else {}
        started = _parse_utc(latest.get("startedAt"))
        if started is None:
            continue
        activity = started
        output_path = task.get("outputPath")
        baseline = latest.get("baselineInputMtimeNs")
        if isinstance(output_path, str):
            output = run_dir / output_path
            if output.is_file():
                mtime_ns = output.stat().st_mtime_ns
                if not isinstance(baseline, int) or mtime_ns > baseline:
                    activity = max(activity, output.stat().st_mtime)
        heartbeat_path = task.get("heartbeatPath")
        heartbeat_baseline = latest.get("heartbeatBaselineMtimeNs")
        if isinstance(heartbeat_path, str):
            heartbeat = run_dir / heartbeat_path
            if heartbeat.is_file():
                heartbeat_mtime_ns = heartbeat.stat().st_mtime_ns
                if not isinstance(heartbeat_baseline, int) or heartbeat_mtime_ns > heartbeat_baseline:
                    try:
                        heartbeat_payload = base._json_file(heartbeat)
                    except base.StagedExamError:
                        heartbeat_payload = {}
                    if (
                        heartbeat_payload.get("taskId") == task_id
                        and heartbeat_payload.get("runId") == run_id
                        and heartbeat_payload.get("attempt") == latest.get("attempt")
                        and heartbeat_payload.get("externalId") == latest.get("externalId")
                    ):
                        activity = max(activity, heartbeat.stat().st_mtime)
        if now - activity < max(1, int(timeout_seconds)):
            continue
        fail_adaptive_dispatch(store, run_id, task_id, "AGENT_STALE_TIMEOUT")
        reaped.append(task_id)
    if reaped:
        manifest = store.load(run_id)
        base._append_event(
            manifest,
            "ADAPTIVE_STALE_WATCHDOG_REAPED",
            taskIds=reaped,
            timeoutSeconds=timeout_seconds,
        )
        base._refresh(manifest)
        store.save(run_id, manifest)
    return reaped


def resume_adaptive_staged_run(
    store: Any,
    run_id: str,
    timeout_seconds: int = ADAPTIVE_STALE_TIMEOUT_SECONDS,
) -> dict[str, Any]:
    manifest = store.load(run_id)
    reaped: list[str] = []
    # A blocked Run may have been created before a missing unit profile was
    # added.  Recompile the deterministic snapshot on resume so an engine
    # correction can actually unblock the same Run instead of requiring a
    # destructive restart.
    if manifest.get("status") == "BLOCKED":
        run_dir = store.run_dir(run_id)
        method_snapshot = adaptive._ensure_method_snapshot(run_dir, manifest)
        if method_snapshot.get("status") == "READY":
            manifest["codes"] = [
                code
                for code in manifest.get("codes", [])
                if code != "ADAPTIVE_METHOD_PROFILE_HOLD"
            ]
            visual_pending = manifest.get("visualInspection", {}).get("status") == "PENDING"
            if manifest.get("currentStage") == "S01_PREFLIGHT":
                if visual_pending:
                    adaptive.base._set_stage(
                        manifest,
                        "S01A_VISUAL_RECON",
                        "HOLD",
                        "method profile snapshot rebuilt during resume; source visual inspection remains required",
                    )
                    manifest["currentStage"] = "S01A_VISUAL_RECON"
                    manifest["status"] = "BLOCKED"
                else:
                    manifest["currentStage"] = "S02_ROUND1_GENERATION"
                    manifest["status"] = "BLOCKED"
                adaptive.base._append_event(
                    manifest,
                    "ADAPTIVE_METHOD_PROFILE_REBUILT_ON_RESUME",
                    snapshotSha256=method_snapshot.get("snapshotSha256"),
                    visualInspectionPending=visual_pending,
                )
            adaptive._refresh_task_packets(run_dir, manifest)
            adaptive.base._refresh(manifest)
            store.save(run_id, manifest)
    if manifest.get("status") not in {"FAILED", "BLOCKED", "MANUAL_REVIEW_REQUIRED", "READY_FOR_MANUAL_REVIEW", "DRAFT_PACKAGED", "RENDERED_PACKAGED"}:
        try:
            reconcile_adaptive_staged_run(store, run_id)
        except base.StagedExamError:
            pass
        reaped = reap_stale_adaptive_dispatches(store, run_id, timeout_seconds)
        if reaped:
            try:
                reconcile_adaptive_staged_run(store, run_id)
            except base.StagedExamError:
                pass
    status = adaptive.build_adaptive_status(store, run_id)
    status["reapedTaskIds"] = reaped
    return status


def recover_adaptive_staged_task(
    store: Any,
    run_id: str,
    task_id: str,
) -> dict[str, Any]:
    """Re-open one failed adaptive task after a bounded artifact repair.

    Adaptive runs use the baseline task recovery primitive for the durable
    file/marker checks, then restore the adaptive stage status.  The failed
    attempts remain in the audit trail; the adaptive controller's four-attempt
    ceiling and per-class retry counters still bound the next dispatch.
    """

    task = base.recover_staged_task(store, run_id, task_id)
    manifest = store.load(run_id)
    if task.get("stage") not in {
        "S02_ROUND1_GENERATION",
        "S03_REVIEW1",
        "S04_REVISION",
        "S05_REVIEW2",
        adaptive.ADAPTIVE_CORRECTION_STAGE,
        adaptive.ADAPTIVE_CORRECTION_REVIEW_STAGE,
    }:
        raise base.StagedExamError("task is not an adaptive staged task")
    stage_status = {
        "S02_ROUND1_GENERATION": "ROUND1_GENERATING",
        "S03_REVIEW1": "REVIEW1_RUNNING",
        "S04_REVISION": "REVISION_RUNNING",
        "S05_REVIEW2": "REVIEW2_RUNNING",
        adaptive.ADAPTIVE_CORRECTION_STAGE: "CORRECTION_RUNNING",
        adaptive.ADAPTIVE_CORRECTION_REVIEW_STAGE: "CORRECTION_REVIEW_RUNNING",
    }
    if task.get("status") == "PENDING":
        manifest["status"] = stage_status[task["stage"]]
        manifest["codes"] = [
            code
            for code in manifest.get("codes", [])
            if code
            not in {
                "STAGED_ARTIFACT_RETRY_EXHAUSTED",
                "STAGED_DISPATCH_RETRY_EXHAUSTED",
                "ADAPTIVE_ARTIFACT_RETRY_EXHAUSTED",
                "ADAPTIVE_DISPATCH_RETRY_EXHAUSTED",
            }
        ]
        base._append_event(
            manifest,
            "ADAPTIVE_TASK_RECOVERED",
            taskId=task_id,
            recoveryCount=task.get("recoveryCount", 0),
            preservedAttempts=len(task.get("dispatch", {}).get("attempts", [])),
        )
        base._refresh(manifest)
        store.save(run_id, manifest)
    return task


def revalidate_adaptive_correction_review(
    store: Any,
    run_id: str,
    task_id: str,
) -> dict[str, Any]:
    """Re-normalize an accepted correction-review artifact with current gates.

    This is a deterministic evidence repair for controller-version changes,
    such as a reviewer reporting both ``selectedChoice`` and answer content.
    It never edits the candidate or weakens a review gate; it writes a new
    evidence file and records the superseded accepted path.
    """

    manifest = store.load(run_id)
    task = base._task(manifest, task_id)
    if task.get("stage") != adaptive.ADAPTIVE_CORRECTION_REVIEW_STAGE:
        raise base.StagedExamError("task is not an adaptive correction-review task")
    if task.get("status") != "ACCEPTED":
        raise base.StagedExamError("only accepted correction-review tasks can be revalidated")
    run_dir = store.run_dir(run_id)
    output_relative = task.get("outputPath")
    if not isinstance(output_relative, str):
        raise base.StagedExamError("correction-review output path is missing")
    payload = base._json_file(base._inside(run_dir, run_dir / output_relative))
    normalized = base._normalize_review_batch(manifest, task, payload)
    batch = manifest["batches"][task["batchId"]]
    candidate_relative = batch.get("revisionAcceptedPath")
    if not isinstance(candidate_relative, str):
        raise base.StagedExamError("correction-review candidate path is missing")
    candidate = base._json_file(base._inside(run_dir, run_dir / candidate_relative))
    base._add_answer_matches(manifest, task, normalized, candidate)
    base._validate_review_visual_checks(manifest, normalized, candidate)
    base._validate_solution_reviews(manifest, normalized, candidate)
    normalized["artifactSha256"] = artifact_sha256(normalized)
    old_relative = task.get("acceptedPath")
    new_relative = f"evidence/{task['batchId']}/{task_id}-revalidated.json"
    target = run_dir / new_relative
    target.parent.mkdir(parents=True, exist_ok=True)
    atomic_write_json(target, normalized)
    task["acceptedPath"] = new_relative
    task["revalidatedFrom"] = old_relative
    task["revalidatedAt"] = utc_now()
    base._append_event(
        manifest,
        "ADAPTIVE_CORRECTION_REVIEW_REVALIDATED",
        taskId=task_id,
        previousEvidencePath=old_relative,
        evidencePath=new_relative,
        artifactSha256=normalized["artifactSha256"],
    )
    correction_review_tasks = [
        item
        for item in manifest.get("tasks", {}).values()
        if item.get("stage") == adaptive.ADAPTIVE_CORRECTION_REVIEW_STAGE
        and item.get("repairCycle") == manifest.get("correctionLoop", {}).get("activeCycle")
        and item.get("kind") == "BATCH_REVIEWER"
    ]
    if correction_review_tasks and all(
        item.get("status") == "ACCEPTED" for item in correction_review_tasks
    ):
        adaptive._complete_adaptive_correction_review(run_dir, manifest)
        if manifest.get("status") == "READY_FOR_ASSEMBLY":
            manifest["codes"] = [
                code
                for code in manifest.get("codes", [])
                if code
                not in {
                    "ADAPTIVE_CORRECTION_FINDINGS",
                    "STAGED_FINAL_REVIEW_FINDINGS",
                    "ADAPTIVE_ARTIFACT_RETRY_EXHAUSTED",
                    "ADAPTIVE_DISPATCH_RETRY_EXHAUSTED",
                    "STAGED_MOTHER_SOLUTION_FINDINGS",
                }
            ]
    base._refresh(manifest)
    store.save(run_id, manifest)
    return manifest


def reconcile_adaptive_staged_run(store: Any, run_id: str) -> dict[str, Any]:
    original = adaptive._adaptive_normalize_draft_batch

    def normalize(
        manifest: dict[str, Any],
        task: dict[str, Any],
        payload: dict[str, Any],
        run_dir: Path | None = None,
    ) -> dict[str, Any]:
        normalized = original(manifest, task, payload, run_dir)
        try:
            normalized["adaptivePreReviewGate"] = run_pre_review_gates(
                run_dir or store.run_dir(run_id), normalized
            )
        except AdaptiveQualityGateError as error:
            raise adaptive.base.StagedExamError(str(error)) from error
        normalized["artifactSha256"] = artifact_sha256(normalized)
        return normalized

    adaptive._adaptive_normalize_draft_batch = normalize
    try:
        adaptive.reconcile_adaptive_staged_run(store, run_id)
    finally:
        adaptive._adaptive_normalize_draft_batch = original
    manifest = store.load(run_id)
    _close_unused_correction_stages(manifest)
    for task in manifest.get("tasks", {}).values():
        if isinstance(task, dict):
            counters = _rebuild_retry_counters(task)
            if (
                counters["artifact"] >= ADAPTIVE_ARTIFACT_RETRY_BUDGET
                and task.get("status") == "PENDING"
            ):
                task["status"] = "FAILED"
                manifest["status"] = "FAILED"
                manifest["codes"] = sorted(
                    set(
                        manifest.get("codes", [])
                        + ["ADAPTIVE_ARTIFACT_RETRY_EXHAUSTED"]
                    )
                )
                base._append_event(
                    manifest,
                    "ADAPTIVE_RETRY_BUDGET_EXHAUSTED",
                    taskId=task.get("taskId"),
                    failureClass="artifact",
                    budget=ADAPTIVE_ARTIFACT_RETRY_BUDGET,
                )
    # A recovered artifact may be accepted after the adaptive attempt budget
    # recorded a historical rejection.  Keep that history in events, but do
    # not leave a stale terminal-looking code on an otherwise running Run.
    if manifest.get("status") not in {"FAILED", "BLOCKED"}:
        manifest["codes"] = [
            code
            for code in manifest.get("codes", [])
            if code != "ADAPTIVE_ARTIFACT_RETRY_EXHAUSTED"
        ]
    store.save(run_id, manifest)
    return manifest


def assemble_adaptive_exam(root: Path, store: Any, run_id: str, title: str) -> dict[str, Any]:
    manifest = store.load(run_id)
    _close_unused_correction_stages(manifest)
    store.save(run_id, manifest)
    return adaptive.assemble_adaptive_exam(root, store, run_id, title)


def package_adaptive_exam(store: Any, run_id: str) -> dict[str, Any]:
    manifest = store.load(run_id)
    _close_unused_correction_stages(manifest)
    store.save(run_id, manifest)
    return adaptive.package_adaptive_exam(store, run_id)


def __getattr__(name: str) -> Any:
    return getattr(adaptive, name)
