from __future__ import annotations

"""Lifecycle management for ALIVE's generated runtime artifacts.

Run directories are useful while a run is active, but they are not durable
project artifacts.  This module promotes the small, reviewable result surface
to ``alive/runtime/results`` and moves the verbose working directory outside
the repository.  Held and active runs are deliberately protected.
"""

import json
import re
import shutil
import tempfile
import zipfile
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any

from .run_store import atomic_write_json, sha256_file, utc_now


RUN_ID_RE = re.compile(r"[0-9A-Za-z가-힣._-]+")
TERMINAL_STATUSES = frozenset(
    {"FAILED", "DRAFT_PACKAGED", "RENDERED_PACKAGED", "AUTO_READY"}
)
HELD_STATUSES = frozenset(
    {"READY_FOR_MANUAL_REVIEW", "MANUAL_REVIEW_REQUIRED", "ROUND1_GENERATING"}
)
KNOWN_RUNTIME_ROOTS = ("runs", "fast-runs", "staged-runs", "adaptive-staged-runs")


class RuntimeLifecycleError(ValueError):
    """Raised when a runtime lifecycle operation would be unsafe or invalid."""


def _resolved(path: Path) -> Path:
    return path.expanduser().resolve()


def _is_within(path: Path, parent: Path) -> bool:
    path = _resolved(path)
    parent = _resolved(parent)
    return path == parent or parent in path.parents


def _validate_run_id(run_id: str) -> str:
    if not run_id or not RUN_ID_RE.fullmatch(run_id):
        raise RuntimeLifecycleError(f"invalid run id: {run_id!r}")
    return run_id


def _default_result_root(runtime_root: Path) -> Path:
    return _resolved(runtime_root).parent / "results"


def _default_quarantine_root() -> Path:
    return _resolved(Path(tempfile.gettempdir()) / "apmath-alive-runtime-quarantine")


def _read_manifest(run_dir: Path) -> dict[str, Any]:
    path = run_dir / "manifest.json"
    if not path.is_file():
        raise RuntimeLifecycleError(f"manifest missing: {path}")
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise RuntimeLifecycleError(f"manifest unreadable: {path}") from error
    if not isinstance(payload, dict):
        raise RuntimeLifecycleError(f"manifest must be an object: {path}")
    return payload


def _parse_timestamp(value: Any) -> datetime | None:
    if not isinstance(value, str) or not value:
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=UTC)
    return parsed.astimezone(UTC)


def _age_hours(manifest: dict[str, Any], now: datetime) -> float | None:
    timestamp = _parse_timestamp(manifest.get("updatedAt")) or _parse_timestamp(
        manifest.get("createdAt")
    )
    if timestamp is None:
        return None
    return max(0.0, (now - timestamp).total_seconds() / 3600)


def _package_source(run_dir: Path) -> Path | None:
    preferred = (
        run_dir / "final" / "alive-staged-exam-pack.zip",
        run_dir / "final" / "alive-fast-exam-pack.zip",
    )
    existing = [path for path in preferred if path.is_file()]
    if len(existing) == 1:
        return existing[0]
    if len(existing) > 1:
        raise RuntimeLifecycleError(f"ambiguous package files in {run_dir / 'final'}")
    final_dir = run_dir / "final"
    if not final_dir.is_dir():
        return None
    discovered = sorted(
        path for path in final_dir.rglob("*-pack.zip") if path.is_file()
    )
    if len(discovered) > 1:
        raise RuntimeLifecycleError(f"ambiguous package files in {final_dir}")
    return discovered[0] if discovered else None


def _verify_package(package: Path, expected_sha256: str | None) -> str:
    try:
        with zipfile.ZipFile(package, "r") as archive:
            if archive.testzip() is not None:
                raise RuntimeLifecycleError(f"package round-trip failed: {package}")
    except zipfile.BadZipFile as error:
        raise RuntimeLifecycleError(f"invalid package ZIP: {package}") from error
    digest = sha256_file(package)
    if expected_sha256 and digest != expected_sha256:
        raise RuntimeLifecycleError(
            f"package hash mismatch: expected {expected_sha256}, got {digest}"
        )
    return digest


def _copy_file_atomic(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_name(f".{destination.name}.tmp")
    try:
        shutil.copy2(source, temporary)
        temporary.replace(destination)
    finally:
        if temporary.exists():
            temporary.unlink()


def _summary_payload(
    manifest: dict[str, Any],
    *,
    manifest_sha256: str,
    package_name: str | None,
    package_sha256: str | None,
    cleanup_status: str,
    finalized_at: str,
    quarantine_run_id: str | None,
) -> dict[str, Any]:
    request = manifest.get("request") if isinstance(manifest.get("request"), dict) else {}
    package = manifest.get("package") if isinstance(manifest.get("package"), dict) else {}
    failures = []
    tasks = manifest.get("tasks") if isinstance(manifest.get("tasks"), dict) else {}
    for task_id, task in tasks.items():
        if not isinstance(task, dict) or task.get("status") not in {"FAILED", "DISPATCH_FAILED"}:
            continue
        failures.append(
            {
                "taskId": task_id,
                "status": task.get("status"),
                "code": task.get("code") or task.get("lastError"),
            }
        )
    result: dict[str, Any] = {
        "schemaVersion": "ALIVE_RUNTIME_RESULT_0.1",
        "runId": manifest.get("runId"),
        "status": manifest.get("status"),
        "currentStage": manifest.get("currentStage"),
        "createdAt": manifest.get("createdAt"),
        "updatedAt": manifest.get("updatedAt"),
        "finalizedAt": finalized_at,
        "query": request.get("query"),
        "sourceFile": request.get("sourceFile") or request.get("sourcePath"),
        "questionCount": request.get("expectedQuestionCount"),
        "codes": manifest.get("codes", []),
        "failureTasks": failures,
        "eventCount": len(manifest.get("events", [])) if isinstance(manifest.get("events"), list) else 0,
        "manifestSha256": manifest_sha256,
        "package": {
            "file": package_name,
            "sha256": package_sha256,
            "roundTrip": package.get("roundTrip"),
            "publicationStatus": package.get("publicationStatus", "NOT_PUBLISHED"),
            "externalReviewPackage": package.get("externalReviewPackage"),
        }
        if package_name
        else None,
        "cleanup": {
            "status": cleanup_status,
            "quarantineRunId": quarantine_run_id,
        },
    }
    return result


def finalize_run(
    runtime_root: Path,
    run_id: str,
    *,
    result_root: Path | None = None,
    quarantine_root: Path | None = None,
    allow_blocked: bool = False,
    move_workdir: bool = True,
) -> dict[str, Any]:
    """Promote one terminal Run to a compact result and quarantine its workdir."""

    run_id = _validate_run_id(run_id)
    runtime_root = _resolved(runtime_root)
    run_dir = runtime_root / run_id
    result_root = _resolved(result_root or _default_result_root(runtime_root))
    quarantine_root = _resolved(quarantine_root or _default_quarantine_root())
    summary_path = result_root / f"{run_id}-summary.json"

    if not run_dir.is_dir():
        if summary_path.is_file():
            return {
                **json.loads(summary_path.read_text(encoding="utf-8")),
                "idempotent": True,
            }
        raise RuntimeLifecycleError(f"run not found: {run_id}")
    if _is_within(result_root, run_dir) or _is_within(quarantine_root, run_dir):
        raise RuntimeLifecycleError("result/quarantine root cannot be inside the run directory")
    if _is_within(quarantine_root, runtime_root):
        raise RuntimeLifecycleError("quarantine root cannot be inside runtime root")

    manifest = _read_manifest(run_dir)
    status = str(manifest.get("status", ""))
    allowed = set(TERMINAL_STATUSES)
    if allow_blocked:
        allowed.add("BLOCKED")
    if status not in allowed:
        if status in HELD_STATUSES:
            raise RuntimeLifecycleError(
                f"held run is protected from cleanup: {run_id} ({status})"
            )
        raise RuntimeLifecycleError(f"run is not finalizable: {run_id} ({status})")

    manifest_path = run_dir / "manifest.json"
    manifest_sha256 = sha256_file(manifest_path)
    package_source = _package_source(run_dir)
    package_sha256: str | None = None
    package_name: str | None = None
    if package_source:
        package_report = manifest.get("package")
        expected = package_report.get("zipSha256") if isinstance(package_report, dict) else None
        package_sha256 = _verify_package(package_source, expected)
        package_name = f"{run_id}.zip"
        package_destination = result_root / package_name
        if package_destination.is_file() and sha256_file(package_destination) != package_sha256:
            raise RuntimeLifecycleError(
                f"result package collision with a different hash: {package_destination}"
            )
        if not package_destination.is_file():
            _copy_file_atomic(package_source, package_destination)

    finalized_at = utc_now()
    summary = _summary_payload(
        manifest,
        manifest_sha256=manifest_sha256,
        package_name=package_name,
        package_sha256=package_sha256,
        cleanup_status="PENDING" if move_workdir else "WORKDIR_RETAINED",
        finalized_at=finalized_at,
        quarantine_run_id=run_id if move_workdir else None,
    )
    atomic_write_json(summary_path, summary)

    if move_workdir:
        quarantine_root.mkdir(parents=True, exist_ok=True)
        quarantine_target = quarantine_root / run_id
        if quarantine_target.exists():
            raise RuntimeLifecycleError(f"quarantine target already exists: {quarantine_target}")
        shutil.move(str(run_dir), str(quarantine_target))
        summary["cleanup"]["status"] = "MOVED"
        atomic_write_json(summary_path, summary)
    return summary


def _runtime_roots(repository_root: Path, runtime_root: Path | None) -> list[Path]:
    if runtime_root is not None:
        return [_resolved(runtime_root)]
    base = _resolved(repository_root) / "alive" / "runtime"
    return [base / name for name in KNOWN_RUNTIME_ROOTS]


def runtime_gc(
    repository_root: Path,
    *,
    runtime_root: Path | None = None,
    result_root: Path | None = None,
    quarantine_root: Path | None = None,
    older_than_hours: float = 24,
    apply: bool = False,
    include_blocked: bool = False,
) -> dict[str, Any]:
    """Find or finalize old terminal runs; active/held runs are never swept."""

    if older_than_hours < 0:
        raise RuntimeLifecycleError("older-than-hours must be non-negative")
    now = datetime.now(UTC)
    candidates: list[dict[str, Any]] = []
    skipped: list[dict[str, Any]] = []
    finalized: list[dict[str, Any]] = []
    errors: list[dict[str, Any]] = []
    eligible = set(TERMINAL_STATUSES)
    if include_blocked:
        eligible.add("BLOCKED")

    for root in _runtime_roots(repository_root, runtime_root):
        if not root.is_dir():
            continue
        for run_dir in sorted(path for path in root.iterdir() if path.is_dir()):
            manifest_path = run_dir / "manifest.json"
            if not manifest_path.is_file():
                skipped.append({"runtimeRoot": str(root), "runId": run_dir.name, "reason": "NO_MANIFEST"})
                continue
            try:
                manifest = _read_manifest(run_dir)
            except RuntimeLifecycleError as error:
                errors.append({"runtimeRoot": str(root), "runId": run_dir.name, "error": str(error)})
                continue
            status = str(manifest.get("status", ""))
            age = _age_hours(manifest, now)
            entry = {
                "runtimeRoot": str(root),
                "runId": run_dir.name,
                "status": status,
                "ageHours": round(age, 3) if age is not None else None,
            }
            if status not in eligible:
                skipped.append({**entry, "reason": "PROTECTED_STATUS"})
                continue
            if age is None or age < older_than_hours:
                skipped.append({**entry, "reason": "TOO_NEW_OR_NO_TIMESTAMP"})
                continue
            candidates.append(entry)
            if apply:
                try:
                    finalized.append(
                        finalize_run(
                            root,
                            run_dir.name,
                            result_root=result_root,
                            quarantine_root=quarantine_root,
                            allow_blocked=include_blocked,
                        )
                    )
                except RuntimeLifecycleError as error:
                    errors.append({**entry, "error": str(error)})

    return {
        "schemaVersion": "ALIVE_RUNTIME_GC_0.1",
        "mode": "APPLY" if apply else "DRY_RUN",
        "olderThanHours": older_than_hours,
        "includeBlocked": include_blocked,
        "candidateCount": len(candidates),
        "candidates": candidates,
        "finalizedCount": len(finalized),
        "finalized": finalized,
        "skippedCount": len(skipped),
        "skipped": skipped,
        "errorCount": len(errors),
        "errors": errors,
    }
