from __future__ import annotations

from collections import Counter
from typing import Any

from .run_store import RunStore


_PHASE2_STAGES = frozenset(
    {
        "R03_SOURCE_ANALYSIS",
        "R04_CURRICULUM_FINGERPRINT",
        "R05_PLAN_POOL",
        "R06_PLAN_CRITIC",
        "R07_CANDIDATE_BUILD",
        "R08_LOCAL_CHECKS",
        "R09_INDEPENDENT_MATH",
        "R10_QUALITY_GATES",
        "R11_DISTRACTOR",
        "R12_FINAL_REDUCER",
    }
)
_PHASE3_ACTIONS = {
    "R13_STRUCTURED_ADAPTER": "ADAPT",
    "R14_JS_SERIALIZER": "SERIALIZE",
    "R15_REAL_RENDER": "BROWSER_RENDER",
    "R16_PACKAGE": "PACKAGE",
    "R17_LOCAL_FREEZE": "FREEZE",
}
_EXAM_ACTIONS = {
    "E03_ASSEMBLY": "ASSEMBLE",
    "E04_REAL_RENDER": "EXAM_BROWSER_RENDER",
    "E05_PACKAGE": "EXAM_PACKAGE",
}
_CHILD_TERMINAL_STATUSES = frozenset({"BLOCKED", "FAILED", "HOLD"})
_PARENT_FAILURE_STATUSES = frozenset({"BLOCKED", "FAILED", "HOLD"})


def _stage_rank(stage_id: str) -> int:
    if len(stage_id) >= 3 and stage_id[0] == "R" and stage_id[1:3].isdigit():
        return int(stage_id[1:3])
    if len(stage_id) >= 3 and stage_id[0] == "E" and stage_id[1:3].isdigit():
        return 100 + int(stage_id[1:3])
    return 1_000


def _as_ordinal(value: Any) -> int | None:
    if isinstance(value, int) and not isinstance(value, bool) and value > 0:
        return value
    if isinstance(value, str) and value.isdigit() and int(value) > 0:
        return int(value)
    return None


def _action(
    kind: str,
    *,
    run_id: str,
    stage_id: str,
    ordinal: int | None,
    task: dict[str, Any] | None = None,
) -> dict[str, Any]:
    action: dict[str, Any] = {
        "kind": kind,
        "scope": "CHILD" if ordinal is not None else "PARENT",
        "runId": run_id,
        "ordinal": ordinal,
        "stageId": stage_id,
    }
    if kind in {"BROWSER_RENDER", "EXAM_BROWSER_RENDER"}:
        action["requiredModes"] = ["exam", "solution", "answer"]
    if kind == "AGENT_WAIT":
        action["poll"] = True
    if task is not None:
        action.update(
            {
                "taskId": task.get("taskId"),
                "taskStatus": task.get("status"),
                "agent": task.get("agent"),
                "artifactKind": task.get("artifactKind"),
                "taskPacketPath": task.get("taskPacketPath"),
                "outputPath": task.get("outputPath"),
            }
        )
    return action


def _action_sort_key(action: dict[str, Any], expected_count: int) -> tuple[int, int, str, str]:
    ordinal = action.get("ordinal")
    ordinal_rank = ordinal if isinstance(ordinal, int) else expected_count + 1
    return (
        ordinal_rank,
        _stage_rank(str(action.get("stageId", ""))),
        str(action.get("taskId") or ""),
        str(action.get("kind") or ""),
    )


def _current_stage_tasks(manifest: dict[str, Any]) -> list[dict[str, Any]]:
    phase2 = manifest.get("phase2")
    if not isinstance(phase2, dict):
        return []
    tasks = phase2.get("tasks")
    if not isinstance(tasks, dict):
        return []
    stage_id = manifest.get("currentStage")
    return sorted(
        [
            task
            for task in tasks.values()
            if isinstance(task, dict) and task.get("stageId") == stage_id
        ],
        key=lambda task: str(task.get("taskId", "")),
    )


def _child_queue(
    child_manifest: dict[str, Any], ordinal: int
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], int, int, int]:
    run_id = str(child_manifest.get("runId", ""))
    stage_id = str(child_manifest.get("currentStage", ""))
    tasks = _current_stage_tasks(child_manifest)
    pending_count = sum(task.get("status") == "PENDING" for task in tasks)
    dispatched_count = sum(task.get("status") == "DISPATCHED" for task in tasks)
    submitted_count = sum(task.get("status") == "SUBMITTED" for task in tasks)
    blocked: list[dict[str, Any]] = []

    if child_manifest.get("status") in _CHILD_TERMINAL_STATUSES:
        blocked.append(
            {
                "scope": "CHILD",
                "ordinal": ordinal,
                "runId": run_id,
                "stageId": stage_id,
                "code": "CHILD_TERMINAL_STATUS",
                "status": child_manifest.get("status"),
                "codes": list(child_manifest.get("codes", [])),
            }
        )
        return [], blocked, pending_count, dispatched_count, submitted_count
    if child_manifest.get("status") == "LOCALLY_FROZEN":
        return [], blocked, pending_count, dispatched_count, submitted_count

    if stage_id in _PHASE2_STAGES:
        if not tasks:
            return [
                _action("PREPARE", run_id=run_id, stage_id=stage_id, ordinal=ordinal)
            ], blocked, pending_count, dispatched_count, submitted_count
        pending = [task for task in tasks if task.get("status") == "PENDING"]
        dispatched = [task for task in tasks if task.get("status") == "DISPATCHED"]
        dispatch_failed = [task for task in tasks if task.get("status") == "DISPATCH_FAILED"]
        unsupported = sorted(
            {
                str(task.get("status"))
                for task in tasks
                if task.get("status")
                not in {"PENDING", "DISPATCHED", "SUBMITTED", "DISPATCH_FAILED"}
            }
        )
        if dispatch_failed:
            # Retryable dispatch failures are normalized to PENDING by the task
            # runtime.  This read-only status view must wait for that durable
            # transition instead of redispatching the failed packet itself.
            blocked.append(
                {
                    "scope": "CHILD",
                    "ordinal": ordinal,
                    "runId": run_id,
                    "stageId": stage_id,
                    "code": "TASK_DISPATCH_FAILED_AWAITING_RUNTIME_RETRY",
                    "taskIds": [str(task.get("taskId", "")) for task in dispatch_failed],
                }
            )
        if unsupported:
            blocked.append(
                {
                    "scope": "CHILD",
                    "ordinal": ordinal,
                    "runId": run_id,
                    "stageId": stage_id,
                    "code": "TASK_STATUS_NOT_DISPATCHABLE",
                    "taskStatuses": unsupported,
                }
            )
        actions = [
            _action("AGENT_TASK", run_id=run_id, stage_id=stage_id, ordinal=ordinal, task=task)
            for task in pending
        ]
        actions.extend(
            _action("AGENT_WAIT", run_id=run_id, stage_id=stage_id, ordinal=ordinal, task=task)
            for task in dispatched
        )
        if actions:
            return actions, blocked, pending_count, dispatched_count, submitted_count
        if all(task.get("status") == "SUBMITTED" for task in tasks):
            return [
                _action("REDUCE", run_id=run_id, stage_id=stage_id, ordinal=ordinal)
            ], blocked, pending_count, dispatched_count, submitted_count
        return [], blocked, pending_count, dispatched_count, submitted_count

    action_kind = _PHASE3_ACTIONS.get(stage_id)
    if action_kind is not None:
        return [
            _action(action_kind, run_id=run_id, stage_id=stage_id, ordinal=ordinal)
        ], blocked, pending_count, dispatched_count, submitted_count

    blocked.append(
        {
            "scope": "CHILD",
            "ordinal": ordinal,
            "runId": run_id,
            "stageId": stage_id,
            "code": "CHILD_STAGE_NOT_QUEUEABLE",
        }
    )
    return [], blocked, pending_count, dispatched_count, submitted_count


def build_exam_status(store: RunStore, run_id: str) -> dict[str, Any]:
    """Return a deterministic, read-only next-work view for an Exam Batch Run."""
    parent = store.load(run_id)
    if parent.get("artifactType") != "ALIVE_EXAM_BATCH_RUN":
        raise ValueError("Run is not an exam batch")

    parent_stage = str(parent.get("currentStage", ""))
    parent_status = str(parent.get("status", ""))
    children = parent.get("children")
    if not isinstance(children, dict):
        raise ValueError("exam batch children must be an object")
    expected = parent.get("request", {}).get("expectedQuestionCount", len(children))
    expected_count = expected if isinstance(expected, int) and expected >= 0 else len(children)

    actions: list[dict[str, Any]] = []
    blocked: list[dict[str, Any]] = []
    child_rows: list[dict[str, Any]] = []
    child_statuses: Counter[str] = Counter()
    frozen_count = 0
    pending_task_count = 0
    dispatched_task_count = 0
    submitted_task_count = 0

    ordered_children: list[tuple[int, str, dict[str, Any]]] = []
    for ordinal_text, child in children.items():
        ordinal = _as_ordinal(ordinal_text)
        if ordinal is None or not isinstance(child, dict):
            blocked.append(
                {
                    "scope": "PARENT",
                    "ordinal": ordinal_text,
                    "runId": run_id,
                    "stageId": parent_stage,
                    "code": "CHILD_RECORD_INVALID",
                }
            )
            continue
        ordered_children.append((ordinal, str(ordinal_text), child))

    for ordinal, ordinal_text, child in sorted(ordered_children):
        child_run_id = child.get("runId")
        if not isinstance(child_run_id, str) or not child_run_id:
            blocked.append(
                {
                    "scope": "CHILD",
                    "ordinal": ordinal,
                    "runId": None,
                    "stageId": None,
                    "code": "CHILD_RUN_ID_MISSING",
                }
            )
            continue
        try:
            child_manifest = store.load(child_run_id)
        except FileNotFoundError:
            blocked.append(
                {
                    "scope": "CHILD",
                    "ordinal": ordinal,
                    "runId": child_run_id,
                    "stageId": None,
                    "code": "CHILD_MANIFEST_MISSING",
                }
            )
            continue

        child_status = str(child_manifest.get("status", ""))
        child_stage = str(child_manifest.get("currentStage", ""))
        child_statuses[child_status] += 1
        if child_status == "LOCALLY_FROZEN":
            frozen_count += 1
        child_actions, child_blocked, pending, dispatched, submitted = _child_queue(child_manifest, ordinal)
        pending_task_count += pending
        dispatched_task_count += dispatched
        submitted_task_count += submitted
        actions.extend(child_actions)
        blocked.extend(child_blocked)
        child_rows.append(
            {
                "ordinal": ordinal,
                "runId": child_run_id,
                "status": child_status,
                "currentStage": child_stage,
                "pendingTaskCount": pending,
                "dispatchedTaskCount": dispatched,
                "submittedTaskCount": submitted,
            }
        )

    parent_is_terminal = parent_status in _PARENT_FAILURE_STATUSES or parent_status == "LOCALLY_FROZEN"
    if not parent_is_terminal:
        if parent_stage == "E02_CHILD_RUNS":
            if (
                len(child_rows) == expected_count
                and frozen_count == expected_count
                and not blocked
            ):
                actions.append(
                    _action("EXAM_SYNC", run_id=run_id, stage_id=parent_stage, ordinal=None)
                )
        else:
            action_kind = _EXAM_ACTIONS.get(parent_stage)
            if action_kind is not None:
                actions.append(
                    _action(action_kind, run_id=run_id, stage_id=parent_stage, ordinal=None)
                )
            elif parent_stage != "E06_LOCAL_FREEZE":
                blocked.append(
                    {
                        "scope": "PARENT",
                        "ordinal": None,
                        "runId": run_id,
                        "stageId": parent_stage,
                        "code": "PARENT_STAGE_NOT_QUEUEABLE",
                    }
                )

    if parent_is_terminal:
        actions = []

    if parent_status == "LOCALLY_FROZEN" and parent_stage == "E06_LOCAL_FREEZE":
        terminal: dict[str, Any] = {"state": "SUCCESS", "status": parent_status, "stageId": parent_stage}
    elif parent_status in _PARENT_FAILURE_STATUSES:
        terminal = {
            "state": "FAILURE",
            "status": parent_status,
            "stageId": parent_stage,
            "codes": list(parent.get("codes", [])),
        }
    else:
        terminal = {"state": "RUNNING", "status": parent_status, "stageId": parent_stage}

    actions.sort(key=lambda action: _action_sort_key(action, expected_count))
    progress = {
        "expectedChildRuns": expected_count,
        "configuredChildRuns": len(children),
        "loadedChildRuns": len(child_rows),
        "frozenChildRuns": frozen_count,
        "activeChildRuns": len(child_rows) - frozen_count - sum(
            count for status, count in child_statuses.items() if status in _CHILD_TERMINAL_STATUSES
        ),
        "terminalChildRuns": sum(
            count for status, count in child_statuses.items() if status in _CHILD_TERMINAL_STATUSES
        ),
        "pendingTaskCount": pending_task_count,
        "dispatchedTaskCount": dispatched_task_count,
        "submittedTaskCount": submitted_task_count,
        "nextActionCount": len(actions),
    }
    return {
        "schemaVersion": "0.1.0",
        "artifactType": "ALIVE_EXAM_ORCHESTRATION_STATUS",
        "runId": run_id,
        "parent": {
            "status": parent_status,
            "currentStage": parent_stage,
            "codes": list(parent.get("codes", [])),
        },
        "terminal": terminal,
        "progress": progress,
        "children": child_rows,
        "queue": actions,
        "blocked": blocked,
    }
