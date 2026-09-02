from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from typing import Any, Callable

from .run_store import atomic_write_json, utc_now
from .task_packets import build_task_packets


ArtifactValidator = Callable[[str, dict[str, Any], dict[str, Any]], dict[str, Any]]


_SUBMITTABLE_TASK_STATUSES = {"PENDING", "DISPATCHED"}


def _task_file_name(task_id: str) -> str:
    return re.sub(r"[^0-9A-Za-z._-]+", "_", task_id) + ".json"


def _source_question_id_for_packet(run_dir: Path) -> str | None:
    source_question_path = run_dir / "source" / "source-question.json"
    if not source_question_path.is_file():
        return None
    try:
        source_question = json.loads(source_question_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise ValueError("source question artifact is not valid JSON") from error
    if not isinstance(source_question, dict):
        raise ValueError("source question artifact must be an object")
    selection = source_question.get("selection")
    if not isinstance(selection, dict) or "sourceId" not in selection:
        return None
    source_id = selection["sourceId"]
    if source_id is None:
        return None
    if isinstance(source_id, str) and source_id.strip():
        return source_id.strip()
    if isinstance(source_id, int) and not isinstance(source_id, bool):
        return str(source_id)
    raise ValueError("source question selection.sourceId must be a non-empty string or integer")


def prepare_stage_tasks(run_dir: Path, manifest: dict[str, Any]) -> list[dict[str, Any]]:
    stage_id = str(manifest["currentStage"])
    phase2 = manifest.setdefault("phase2", {})
    tasks = phase2.setdefault("tasks", {})
    existing = [task for task in tasks.values() if task.get("stageId") == stage_id]
    if existing:
        return sorted(existing, key=lambda item: str(item["taskId"]))

    packets = build_task_packets(
        stage_id,
        manifest,
        source_question_id=_source_question_id_for_packet(run_dir)
        if stage_id == "R03_SOURCE_ANALYSIS" else None,
    )
    created = utc_now()
    task_dir = run_dir / "evidence" / "tasks"
    for packet in packets:
        packet["createdAt"] = created
        packet["submittedAt"] = None
        packet["artifactHash"] = None
        packet["dispatch"] = {"attempts": [], "lastFailure": None}
        packet["taskPacketPath"] = f"evidence/tasks/{_task_file_name(packet['taskId'])}"
        persist_task_packet(run_dir, packet)
        tasks[packet["taskId"]] = packet
    return packets


def task_for_id(manifest: dict[str, Any], task_id: str) -> dict[str, Any]:
    try:
        return manifest["phase2"]["tasks"][task_id]
    except KeyError as error:
        raise ValueError(f"unknown task id: {task_id}") from error


def persist_task_packet(run_dir: Path, task: dict[str, Any]) -> None:
    task_packet_path = task.get("taskPacketPath")
    if not isinstance(task_packet_path, str) or not task_packet_path:
        raise ValueError("task packet path is missing")
    atomic_write_json(run_dir / task_packet_path, task)


def _ensure_current_stage_task(manifest: dict[str, Any], task_id: str) -> dict[str, Any]:
    task = task_for_id(manifest, task_id)
    if task.get("stageId") != manifest.get("currentStage"):
        raise ValueError("task does not belong to the current stage")
    return task


def _dispatch_ledger(task: dict[str, Any]) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    dispatch = task.setdefault("dispatch", {"attempts": [], "lastFailure": None})
    if not isinstance(dispatch, dict):
        raise ValueError("task dispatch ledger must be an object")
    attempts = dispatch.setdefault("attempts", [])
    if not isinstance(attempts, list) or any(not isinstance(item, dict) for item in attempts):
        raise ValueError("task dispatch attempts must be a list of objects")
    dispatch.setdefault("lastFailure", None)
    return dispatch, attempts


def _active_dispatch_attempt(task: dict[str, Any]) -> dict[str, Any]:
    _, attempts = _dispatch_ledger(task)
    active = [item for item in attempts if item.get("status") == "DISPATCHED"]
    if len(active) != 1:
        raise ValueError("dispatched task must have exactly one active dispatch receipt")
    return active[0]


def start_task_dispatch(
    manifest: dict[str, Any],
    task_id: str,
    external_id: str,
    route: str | None = None,
) -> tuple[dict[str, Any], bool]:
    """Record an external-agent receipt; return whether an existing receipt was reused."""
    if not isinstance(external_id, str) or not external_id.strip():
        raise ValueError("external id must be a non-empty string")
    if route is not None and (not isinstance(route, str) or not route.strip()):
        raise ValueError("route must be a non-empty string when supplied")

    task = _ensure_current_stage_task(manifest, task_id)
    status = task.get("status")
    if status == "SUBMITTED":
        raise ValueError("task artifact is immutable after submission")
    if status == "DISPATCHED":
        receipt = _active_dispatch_attempt(task)
        if receipt.get("externalId") == external_id:
            return task, True
        raise ValueError("task already has an active dispatch receipt for a different external id")
    if status != "PENDING":
        raise ValueError(f"task cannot start dispatch from status {status}")

    _, attempts = _dispatch_ledger(task)
    attempts.append(
        {
            "attempt": len(attempts) + 1,
            "externalId": external_id,
            "route": route,
            "startedAt": utc_now(),
            "status": "DISPATCHED",
        }
    )
    task["status"] = "DISPATCHED"
    return task, False


def fail_task_dispatch(manifest: dict[str, Any], task_id: str, code: str) -> dict[str, Any]:
    """Durably retain a failed dispatch attempt, then return the task to PENDING."""
    if not isinstance(code, str) or not code.strip():
        raise ValueError("dispatch failure code must be a non-empty string")

    task = _ensure_current_stage_task(manifest, task_id)
    status = task.get("status")
    if status == "SUBMITTED":
        raise ValueError("cannot fail dispatch after artifact submission")
    if status not in {"PENDING", "DISPATCHED"}:
        raise ValueError(f"task cannot fail dispatch from status {status}")

    dispatch, attempts = _dispatch_ledger(task)
    failed_at = utc_now()
    if status == "DISPATCHED":
        receipt = _active_dispatch_attempt(task)
    else:
        # A spawn can fail before it returns an agent id, so retain that failed attempt too.
        receipt = {
            "attempt": len(attempts) + 1,
            "externalId": None,
            "route": None,
            "startedAt": None,
            "status": "DISPATCH_FAILED",
        }
        attempts.append(receipt)
    receipt["status"] = "DISPATCH_FAILED"
    receipt["failedAt"] = failed_at
    receipt["failureCode"] = code
    dispatch["lastFailure"] = {
        "attempt": receipt["attempt"],
        "externalId": receipt["externalId"],
        "route": receipt["route"],
        "at": failed_at,
        "code": code,
    }
    task["status"] = "PENDING"
    return task


def _validate_submission_identity(payload: dict[str, Any], task: dict[str, Any]) -> None:
    for field in ("producerId", "sourceLockSha256", "sourceQuestionId"):
        expected = task.get(field)
        if expected is not None and payload.get(field) != expected:
            raise ValueError(f"artifact.{field} does not match the task packet")


def submit_task_artifact(
    run_dir: Path,
    manifest: dict[str, Any],
    task_id: str,
    input_path: Path,
    validator: ArtifactValidator,
) -> dict[str, Any]:
    task = _ensure_current_stage_task(manifest, task_id)
    previous_status = task.get("status")
    if previous_status not in _SUBMITTABLE_TASK_STATUSES:
        raise ValueError("task artifact is immutable after submission")
    if not input_path.is_file():
        raise FileNotFoundError(f"artifact input not found: {input_path}")
    payload = json.loads(input_path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ValueError("artifact payload must be an object")
    _validate_submission_identity(payload, task)
    validation_context: dict[str, Any] = {
        "task": task,
        "manifest": manifest,
        "producerId": task["producerId"],
        "lane": str(task["slot"]).split("-", 1)[0].upper()
        if task["artifactKind"] in {"source_analysis", "transformation_plan"}
        else None,
    }
    source_lock = manifest.get("sourceLock")
    if isinstance(source_lock, dict) and isinstance(source_lock.get("sha256"), str):
        validation_context["sourceLockSha256"] = source_lock["sha256"]
    normalized = validator(
        task["artifactKind"],
        payload,
        validation_context,
    )
    output_path = run_dir / task["outputPath"]
    if output_path.exists():
        raise ValueError(f"assigned output already exists: {task['outputPath']}")
    atomic_write_json(output_path, normalized)
    artifact_hash = hashlib.sha256(
        (json.dumps(normalized, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8")
    ).hexdigest()
    task["status"] = "SUBMITTED"
    task["submittedAt"] = utc_now()
    task["artifactHash"] = artifact_hash
    task["sourceInputPath"] = str(input_path.resolve())
    if previous_status == "DISPATCHED":
        receipt = _active_dispatch_attempt(task)
        receipt["status"] = "SUBMITTED"
        receipt["submittedAt"] = task["submittedAt"]
    persist_task_packet(run_dir, task)
    manifest.setdefault("phase2", {}).setdefault("artifacts", {})[task["outputPath"]] = {
        "taskId": task_id,
        "kind": task["artifactKind"],
        "sha256": artifact_hash,
    }
    return task


def current_stage_tasks(manifest: dict[str, Any]) -> list[dict[str, Any]]:
    stage_id = manifest["currentStage"]
    tasks = manifest.get("phase2", {}).get("tasks", {})
    return sorted(
        [task for task in tasks.values() if task.get("stageId") == stage_id],
        key=lambda item: str(item["taskId"]),
    )


def all_current_tasks_submitted(manifest: dict[str, Any]) -> bool:
    tasks = current_stage_tasks(manifest)
    return bool(tasks) and all(task.get("status") == "SUBMITTED" for task in tasks)
