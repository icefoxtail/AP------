"""Deterministic evidence comparison for baseline and adaptive staged Runs."""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .staged_exam import StagedRunStore
from .run_store import utc_now


def _time(value: Any) -> datetime | None:
    if not isinstance(value, str) or not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(
            timezone.utc
        )
    except ValueError:
        return None


def _elapsed_seconds(manifest: dict[str, Any]) -> float | None:
    start = _time(manifest.get("createdAt"))
    end = _time(manifest.get("updatedAt"))
    if start is None or end is None:
        return None
    return round(max(0.0, (end - start).total_seconds()), 3)


def _event_counts(manifest: dict[str, Any]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for event in manifest.get("events", []):
        if not isinstance(event, dict):
            continue
        event_type = event.get("type")
        if isinstance(event_type, str):
            counts[event_type] = counts.get(event_type, 0) + 1
    return counts


def _task_metrics(manifest: dict[str, Any]) -> dict[str, int]:
    attempts = 0
    dispatched = 0
    artifact_rejected = 0
    dispatch_failed = 0
    for task in manifest.get("tasks", {}).values():
        if not isinstance(task, dict):
            continue
        for attempt in task.get("dispatch", {}).get("attempts", []):
            if not isinstance(attempt, dict):
                continue
            attempts += 1
            status = attempt.get("status")
            if status == "DISPATCHED":
                dispatched += 1
            elif status == "ARTIFACT_REJECTED":
                artifact_rejected += 1
            elif status == "DISPATCH_FAILED":
                dispatch_failed += 1
    events = _event_counts(manifest)
    return {
        "dispatchAttempts": attempts,
        "dispatchedReceipts": dispatched,
        "artifactRejectedEvents": events.get("STAGED_TASK_REJECTED", 0),
        "artifactRejectedAttempts": artifact_rejected,
        "dispatchFailedAttempts": dispatch_failed,
        "recoveryEvents": events.get("STAGED_TASK_RECOVERED", 0),
        "acceptedTaskEvents": events.get("STAGED_TASK_ACCEPTED", 0),
    }


def _method_summary(manifest: dict[str, Any]) -> dict[str, Any]:
    """Expose adaptive method-lock evidence without making a quality decision."""

    snapshot = manifest.get("methodProfiles")
    if not isinstance(snapshot, dict):
        return {
            "status": "NOT_APPLICABLE",
            "gate": None,
            "profileCount": 0,
            "unmappedOrdinals": [],
            "forbiddenMethodRejectionEvents": [],
        }
    rejection_events: list[dict[str, Any]] = []
    for event in manifest.get("events", []):
        if not isinstance(event, dict) or event.get("type") != "STAGED_TASK_REJECTED":
            continue
        error = str(event.get("error") or "")
        if "method gate" in error.lower() or "METHOD_PROFILE" in error:
            rejection_events.append(
                {
                    "taskId": event.get("taskId"),
                    "error": error,
                    "at": event.get("at") or event.get("timestamp"),
                }
            )
    profiles = snapshot.get("profiles", {})
    unmapped = snapshot.get("unmappedOrdinals", [])
    return {
        "status": snapshot.get("status"),
        "gate": snapshot.get("gate"),
        "profileCount": len(profiles) if isinstance(profiles, dict) else 0,
        "unmappedOrdinals": copy_list(unmapped),
        "snapshotSha256": snapshot.get("snapshotSha256"),
        "ruleAuthority": snapshot.get("ruleAuthority", {}),
        "forbiddenMethodRejectionEvents": rejection_events,
    }


def copy_list(value: Any) -> list[Any]:
    """Return a shallow list copy for JSON-like evidence values."""

    return list(value) if isinstance(value, list) else []


def _correction_summary(manifest: dict[str, Any]) -> dict[str, Any]:
    loop = manifest.get("correctionLoop")
    if not isinstance(loop, dict):
        return {"status": "NOT_APPLICABLE", "cycles": [], "maxCycles": None}
    cycles = loop.get("cycles", [])
    return {
        "status": loop.get("status"),
        "activeCycle": loop.get("activeCycle"),
        "nextCycle": loop.get("nextCycle"),
        "maxCycles": loop.get("maxCycles"),
        "cycles": copy_list(cycles),
    }


def _run_summary(manifest: dict[str, Any]) -> dict[str, Any]:
    batches: dict[str, Any] = manifest.get("batches", {})
    carried = sorted(
        batch_id
        for batch_id, batch in batches.items()
        if isinstance(batch, dict)
        and isinstance(batch.get("review2"), dict)
        and batch["review2"].get("carriedForward") is True
    )
    fresh = sorted(
        batch_id
        for batch_id, batch in batches.items()
        if isinstance(batch, dict)
        and isinstance(batch.get("review2"), dict)
        and batch["review2"].get("carriedForward") is not True
    )
    mother = manifest.get("motherFinal")
    render = manifest.get("render")
    package = manifest.get("package")
    visual_inspection = manifest.get("visualInspection")
    render_failures = manifest.get("renderFailures", [])
    active_render_failure = manifest.get("renderFailure")
    return {
        "runId": manifest.get("runId"),
        "workflowProfile": manifest.get("request", {}).get("workflowProfile", "BASELINE"),
        "reviewPolicy": manifest.get("request", {}).get("reviewPolicy"),
        "modelProfile": manifest.get("request", {}).get("modelProfile"),
        "status": manifest.get("status"),
        "currentStage": manifest.get("currentStage"),
        "createdAt": manifest.get("createdAt"),
        "updatedAt": manifest.get("updatedAt"),
        "elapsedSeconds": _elapsed_seconds(manifest),
        "questionCount": manifest.get("request", {}).get("expectedQuestionCount"),
        "batchCount": manifest.get("request", {}).get("batchCount"),
        "taskMetrics": _task_metrics(manifest),
        "methodGate": _method_summary(manifest),
        "correctionLoop": _correction_summary(manifest),
        "sourceVisualInspection": {
            "status": visual_inspection.get("status")
            if isinstance(visual_inspection, dict)
            else "NOT_APPLICABLE",
            "requiredOrdinals": copy_list(
                visual_inspection.get("requiredOrdinals", [])
                if isinstance(visual_inspection, dict)
                else []
            ),
            "artifactSha256": visual_inspection.get("artifactSha256")
            if isinstance(visual_inspection, dict)
            else None,
        },
        "renderFailures": {
            "count": len(render_failures) if isinstance(render_failures, list) else 0,
            "active": active_render_failure is not None,
            "activeAffectedOrdinals": copy_list(
                active_render_failure.get("affectedOrdinals", [])
                if isinstance(active_render_failure, dict)
                else []
            ),
        },
        "reviewEvidence": {
            "review1": _review_summary(manifest, "review1"),
            "review2": _review_summary(manifest, "review2"),
        },
        "carriedForwardReview2Batches": carried,
        "freshReview2Batches": fresh,
        "motherFinal": {
            "verdict": mother.get("verdict") if isinstance(mother, dict) else None,
            "findings": len(mother.get("findings", []))
            if isinstance(mother, dict)
            else None,
        },
        "render": {
            "verdict": render.get("verdict") if isinstance(render, dict) else None,
            "status": render.get("status") if isinstance(render, dict) else None,
        },
        "package": {
            "verdict": package.get("verdict") if isinstance(package, dict) else None,
            "roundTrip": package.get("roundTrip") if isinstance(package, dict) else None,
        },
        "publicationStatus": manifest.get("request", {}).get(
            "publicationStatus", "NOT_PUBLISHED"
        ),
    }


def _is_terminal(summary: dict[str, Any]) -> bool:
    return summary.get("status") in {
        "READY_FOR_MANUAL_REVIEW",
        "DRAFT_PACKAGED",
        "RENDERED_PACKAGED",
    }


def _review_summary(manifest: dict[str, Any], round_name: str) -> dict[str, Any]:
    verdict_counts = {"PASS": 0, "REVISE": 0, "FAIL": 0, "OTHER": 0}
    non_pass_ordinals: list[int] = []
    carried_forward_batches: list[str] = []
    batches = manifest.get("batches", {})
    if not isinstance(batches, dict):
        batches = {}
    for batch_id, batch in batches.items():
        if not isinstance(batch, dict):
            continue
        evidence = batch.get(round_name)
        if not isinstance(evidence, dict):
            continue
        if evidence.get("carriedForward") is True:
            carried_forward_batches.append(str(batch_id))
        items = evidence.get("items", [])
        if not isinstance(items, list):
            continue
        for item in items:
            if not isinstance(item, dict):
                continue
            verdict = str(item.get("verdict") or "OTHER").upper()
            if verdict not in verdict_counts:
                verdict = "OTHER"
            verdict_counts[verdict] += 1
            if verdict != "PASS":
                try:
                    non_pass_ordinals.append(int(item.get("ordinal")))
                except (TypeError, ValueError):
                    pass
    return {
        "verdictCounts": verdict_counts,
        "nonPassOrdinals": sorted(set(non_pass_ordinals)),
        "carriedForwardBatches": sorted(carried_forward_batches),
    }


def compare_staged_runs(
    baseline_store: StagedRunStore,
    baseline_run_id: str,
    adaptive_store: StagedRunStore,
    adaptive_run_id: str,
) -> dict[str, Any]:
    """Compare observable evidence without making a quality-pass decision."""

    baseline = baseline_store.load(baseline_run_id)
    adaptive = adaptive_store.load(adaptive_run_id)
    baseline_summary = _run_summary(baseline)
    adaptive_summary = _run_summary(adaptive)
    baseline_source = baseline.get("sourceLock", {})
    adaptive_source = adaptive.get("sourceLock", {})
    source_same = baseline_source.get("sha256") == adaptive_source.get("sha256")
    count_same = baseline_summary["questionCount"] == adaptive_summary["questionCount"]
    model_same = baseline_summary["modelProfile"] == adaptive_summary["modelProfile"]
    baseline_elapsed = baseline_summary.get("elapsedSeconds")
    adaptive_elapsed = adaptive_summary.get("elapsedSeconds")
    both_terminal = _is_terminal(baseline_summary) and _is_terminal(adaptive_summary)
    speedup = None
    if (
        both_terminal
        and isinstance(baseline_elapsed, (int, float))
        and baseline_elapsed > 0
        and isinstance(adaptive_elapsed, (int, float))
    ):
        speedup = round(1 - adaptive_elapsed / baseline_elapsed, 4)

    structural_checks = {
        "sameSourceLock": source_same,
        "sameQuestionCount": count_same,
        "sameModelProfile": model_same,
        "adaptiveUsesLunaXhigh": adaptive_summary["modelProfile"]
        == {"model": "gpt-5.6-luna", "reasoning": "xhigh"},
        "adaptiveSourceVisualInspectionClosed": adaptive_summary[
            "sourceVisualInspection"
        ]["status"]
        in {"PASS", "NOT_REQUIRED", "NOT_APPLICABLE"},
        "baselineTerminal": baseline_summary["status"]
        in {"READY_FOR_MANUAL_REVIEW", "DRAFT_PACKAGED", "RENDERED_PACKAGED"},
        "adaptiveTerminal": adaptive_summary["status"]
        in {"READY_FOR_MANUAL_REVIEW", "DRAFT_PACKAGED", "RENDERED_PACKAGED"},
    }
    return {
        "schemaVersion": "0.2.0",
        "artifactType": "ALIVE_STAGED_EXAM_COMPARISON",
        "generatedAt": utc_now(),
        "comparisonVerdict": "QUALITY_REVIEW_REQUIRED",
        "qualityDecision": "NOT_AUTOMATICALLY_DECIDED",
        "structuralChecks": structural_checks,
        "speed": {
            "comparisonStatus": "READY" if both_terminal else "WAITING_FOR_TERMINAL_RUNS",
            "baselineSeconds": baseline_elapsed,
            "adaptiveSeconds": adaptive_elapsed if both_terminal else None,
            "estimatedSpeedupFraction": speedup,
        },
        "baseline": baseline_summary,
        "adaptive": adaptive_summary,
        "qualityReviewChecklist": {
            "mathAndAnswer": "BLIND_REVIEW_REQUIRED",
            "solutionDetail": "BLIND_REVIEW_REQUIRED",
            "curriculumMethod": "EVIDENCE_REQUIRED",
            "visualAndSvg": "BLIND_REVIEW_REQUIRED",
            "browserExamSolutionAnswer": "EVIDENCE_REQUIRED",
            "packageRoundTrip": "EVIDENCE_REQUIRED",
        },
        "publicationStatus": "NOT_PUBLISHED",
    }
