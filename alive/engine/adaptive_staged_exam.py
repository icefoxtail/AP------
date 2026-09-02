"""Experimental adaptive controller for whole-exam staged Runs.

This module is deliberately separate from :mod:`staged_exam`.  The baseline
controller is left untouched; the adaptive skill uses this controller through
an isolated runtime root and an explicit workflow profile.

The adaptive lane now carries two isolated experiment variables: a delta
review policy and a question-level curriculum-method lock.  The baseline
controller is still left untouched.  Any unresolved review finding creates a
new bounded correction cycle and cannot be approved until the fresh review,
mother gate, browser/render gate, and package gate all close.
"""

from __future__ import annotations

import copy
import re
import zipfile
from pathlib import Path
from typing import Any

from . import staged_exam as base
from . import solution_quality
from .adaptive_method_profile import (
    build_method_snapshot,
    lint_candidate_methods,
    lint_solution_method,
    method_profile_for_question,
)
from .run_store import atomic_write_json, sha256_file, utc_now
from .source_question import artifact_sha256


ADAPTIVE_PROFILE = "ADAPTIVE_XHIGH_V2_METHOD_LOCKED"
ADAPTIVE_REVIEW_POLICY = "DELTA_REVIEW_WITH_METHOD_LOCK_AND_CORRECTION_LOOP"
ADAPTIVE_RUNTIME_DIRECTORY = "adaptive-staged-runs"
# The baseline allows two dispatch attempts.  The experiment permits two
# additional attempts so an isolated quality run cannot stop merely because
# a model returned an unchanged or contract-invalid artifact.  This does not
# alter the production controller's retry budget.
ADAPTIVE_MAX_ATTEMPTS = 4
ADAPTIVE_MAX_CONCURRENT_TASKS = 4
ADAPTIVE_MAX_CORRECTION_CYCLES = 3
ADAPTIVE_CORRECTION_STAGE = "S04R_CORRECTION_LOOP"
ADAPTIVE_CORRECTION_REVIEW_STAGE = "S05R_CORRECTION_REVIEW"
ADAPTIVE_METHOD_PROFILE_PATH = "source/method-profiles.json"
ADAPTIVE_VISUAL_INSPECTION_PATH = "source/visual-inspection.json"
_BASE_INFER_SOLUTION_VISUAL_ELEMENTS = solution_quality.infer_solution_visual_elements
_BASE_NORMALIZE_DRAFT_BATCH = base._normalize_draft_batch
_BASE_CANDIDATE_FOR_REVIEW = base._candidate_for_review
_EXPLICIT_CHORD_RE = re.compile(r"공통\s*현|(?<![가-힣])현(?:[가-힣]*)")


def _adaptive_infer_solution_visual_elements(
    student_payload: dict[str, Any],
    solution: str,
    preflight_item: dict[str, Any] | None = None,
) -> dict[str, bool]:
    """Avoid treating the ``현`` syllable inside ``실현`` as a chord.

    The baseline visual heuristic intentionally stays untouched.  Its simple
    substring check can classify words such as ``실현`` as a chord, which then
    rejects an otherwise correct tangent-only diagram.  The adaptive
    experiment applies a process-local boundary-aware correction and still
    honours an explicit preflight chord hint.
    """

    result = _BASE_INFER_SOLUTION_VISUAL_ELEMENTS(
        student_payload, solution, preflight_item
    )
    hinted = (preflight_item or {}).get("solutionVisualElements", {})
    if isinstance(hinted, dict) and hinted.get("chord") is True:
        return result
    parts: list[str] = []
    for key in ("content", "category", "originalCategory", "standardUnit", "subUnit"):
        value = student_payload.get(key)
        if isinstance(value, list):
            parts.extend(str(item) for item in value)
        elif value is not None:
            parts.append(str(value))
    parts.append(solution)
    if isinstance(preflight_item, dict):
        parts.extend(str(item) for item in preflight_item.get("tags", []))
    if result.get("chord") and not _EXPLICIT_CHORD_RE.search(" ".join(parts)):
        result["chord"] = False
    return result


def adaptive_runtime_root(root: Path, override: str | None = None) -> Path:
    """Return the isolated runtime root used by the experimental skill."""

    return (
        Path(override).resolve()
        if override
        else root / "alive" / "runtime" / ADAPTIVE_RUNTIME_DIRECTORY
    )


def _set_adaptive_metadata(manifest: dict[str, Any]) -> None:
    request = manifest.setdefault("request", {})
    request["workflowProfile"] = ADAPTIVE_PROFILE
    request["reviewPolicy"] = ADAPTIVE_REVIEW_POLICY
    request["modelProfile"] = {"model": "gpt-5.6-luna", "reasoning": "xhigh"}
    request["methodProfilePath"] = ADAPTIVE_METHOD_PROFILE_PATH
    request["methodGate"] = "QUESTION_METHOD_PROFILE_HARD_LOCK"
    request["approvalPolicy"] = "FAIL_CLOSED_UNTIL_REVIEW2_MOTHER_RENDER_PACKAGE_PASS"
    request["correctionLoop"] = {
        "enabled": True,
        "maxCycles": ADAPTIVE_MAX_CORRECTION_CYCLES,
        "scope": "UNRESOLVED_ORDINALS_ONLY",
    }
    generation_profile = request.setdefault("generationProfile", {})
    generation_profile["workflowProfile"] = ADAPTIVE_PROFILE
    generation_profile["reviewPolicy"] = ADAPTIVE_REVIEW_POLICY
    generation_profile["methodProfilePath"] = ADAPTIVE_METHOD_PROFILE_PATH
    generation_profile["methodGate"] = "QUESTION_METHOD_PROFILE_HARD_LOCK"
    generation_profile["approvalPolicy"] = "FAIL_CLOSED_UNTIL_REVIEW2_MOTHER_RENDER_PACKAGE_PASS"
    generation_profile["correctionLoop"] = "UNRESOLVED_FINDINGS_REPEAT_BOUNDED"
    for stage_id, label in (
        (ADAPTIVE_CORRECTION_STAGE, "Adaptive correction loop"),
        (ADAPTIVE_CORRECTION_REVIEW_STAGE, "Adaptive correction review"),
    ):
        if not any(stage.get("stageId") == stage_id for stage in manifest.get("stages", [])):
            manifest.setdefault("stages", []).append(
                {"stageId": stage_id, "label": label, "status": "PENDING", "evidence": []}
            )
    manifest["experiment"] = {
        "name": "adaptive-staged-exam-v2",
        "workflowProfile": ADAPTIVE_PROFILE,
        "reviewPolicy": ADAPTIVE_REVIEW_POLICY,
        "model": "gpt-5.6-luna",
        "reasoning": "xhigh",
        "methodGate": "QUESTION_METHOD_PROFILE_HARD_LOCK",
        "approvalPolicy": "FAIL_CLOSED_UNTIL_REVIEW2_MOTHER_RENDER_PACKAGE_PASS",
        "correctionLoop": {
            "enabled": True,
            "maxCycles": ADAPTIVE_MAX_CORRECTION_CYCLES,
        },
        "productionPublication": "NOT_PUBLISHED",
        "qualityComparison": "REQUIRES_BASELINE_AND_BLIND_REVIEW",
    }


def _refresh_task_packets(run_dir: Path, manifest: dict[str, Any]) -> None:
    """Add the explicit experiment and method contracts to every packet."""

    snapshot = manifest.get("methodProfiles", {})
    profiles = snapshot.get("profiles", {}) if isinstance(snapshot, dict) else {}
    for task in manifest.get("tasks", {}).values():
        packet_path = task.get("packetPath")
        if not isinstance(packet_path, str):
            continue
        packet_file = run_dir / packet_path
        if not packet_file.is_file():
            continue
        packet = base._json_file(packet_file)
        packet["workflowProfile"] = ADAPTIVE_PROFILE
        packet["reviewPolicy"] = ADAPTIVE_REVIEW_POLICY
        packet["route"] = {"model": "gpt-5.6-luna", "reasoning": "xhigh"}
        allowed = packet.setdefault("allowedInputPaths", [])
        if ADAPTIVE_METHOD_PROFILE_PATH not in allowed:
            allowed.append(ADAPTIVE_METHOD_PROFILE_PATH)
        visual_inspection = manifest.get("visualInspection", {})
        if isinstance(visual_inspection, dict):
            packet["sourceVisualInspection"] = {
                "status": visual_inspection.get("status", "NOT_REQUIRED"),
                "path": visual_inspection.get("path", ADAPTIVE_VISUAL_INSPECTION_PATH),
                "requiredOrdinals": visual_inspection.get("requiredOrdinals", []),
            }
            if (
                visual_inspection.get("status") == "PASS"
                and ADAPTIVE_VISUAL_INSPECTION_PATH not in allowed
            ):
                allowed.append(ADAPTIVE_VISUAL_INSPECTION_PATH)
        packet["methodGate"] = "QUESTION_METHOD_PROFILE_HARD_LOCK"
        packet["methodProfilePath"] = ADAPTIVE_METHOD_PROFILE_PATH
        packet["methodProfiles"] = {
            str(ordinal): copy.deepcopy(profiles[str(ordinal)])
            for ordinal in task.get("ordinals", [])
            if str(ordinal) in profiles
        }
        atomic_write_json(packet_file, packet)


def _method_rule_authority(manifest: dict[str, Any]) -> dict[str, Any]:
    rule_pack = manifest.get("rulePack", {})
    if not isinstance(rule_pack, dict):
        rule_pack = {}
    manifest_record = rule_pack.get("manifest", {})
    compiled_master = rule_pack.get("compiledMaster", {})
    return {
        "rulePackSnapshotSha256": rule_pack.get("snapshotSha256"),
        "ruleManifestSha256": (
            manifest_record.get("sha256")
            if isinstance(manifest_record, dict)
            else None
        ),
        "compiledMasterSha256": (
            compiled_master.get("sha256")
            if isinstance(compiled_master, dict)
            else None
        ),
        "ruleManifestPath": "docs/rules/MANIFEST.md",
        "compiledMasterPath": "archive/data/master_tables/js_archive_tag_master.json",
    }


def _required_visual_ordinals(manifest: dict[str, Any]) -> list[int]:
    visual_recon = manifest.get("visualRecon", {})
    questions = visual_recon.get("questions", {}) if isinstance(visual_recon, dict) else {}
    if not isinstance(questions, dict):
        return []
    result: list[int] = []
    for ordinal, item in questions.items():
        if not isinstance(item, dict):
            continue
        if item.get("visualDependency", "NONE") != "NONE":
            result.append(int(ordinal))
    return sorted(set(result))


def _normalize_visual_inspection_payload(
    manifest: dict[str, Any],
    payload: dict[str, Any],
) -> dict[str, Any]:
    if payload.get("artifactType") != "ALIVE_ADAPTIVE_SOURCE_VISUAL_INSPECTION":
        raise base.StagedExamError("unsupported adaptive source visual inspection artifactType")
    if payload.get("runId") != manifest["runId"]:
        raise base.StagedExamError("source visual inspection belongs to another Run")
    if payload.get("actualBrowser") is not True:
        raise base.StagedExamError("source visual inspection must declare actualBrowser=true")
    expected = _required_visual_ordinals(manifest)
    raw_items = payload.get("questions")
    if not isinstance(raw_items, list):
        raise base.StagedExamError("source visual inspection questions must be a list")
    by_ordinal: dict[int, dict[str, Any]] = {}
    for raw in raw_items:
        if not isinstance(raw, dict):
            raise base.StagedExamError("source visual inspection item must be an object")
        try:
            ordinal = int(raw.get("ordinal"))
        except (TypeError, ValueError) as error:
            raise base.StagedExamError("source visual inspection ordinal is invalid") from error
        if ordinal in by_ordinal or ordinal not in expected:
            raise base.StagedExamError("source visual inspection ordinal set is invalid")
        if str(raw.get("verdict") or "").upper() != "PASS":
            raise base.StagedExamError(f"source visual inspection q{ordinal} did not PASS")
        if str(raw.get("semanticInspection") or "").upper() != "PASS":
            raise base.StagedExamError(f"source visual inspection q{ordinal} lacks semantic PASS")
        if str(raw.get("browserInspection") or "").upper() != "PASS":
            raise base.StagedExamError(f"source visual inspection q{ordinal} lacks browser PASS")
        if not isinstance(raw.get("screenshotPath"), str) or not raw["screenshotPath"].strip():
            raise base.StagedExamError(f"source visual inspection q{ordinal} screenshotPath is required")
        recon_item = manifest["visualRecon"]["questions"].get(str(ordinal), {})
        fingerprint = recon_item.get("visualFingerprint", {}) if isinstance(recon_item, dict) else {}
        expected_hashes = sorted(fingerprint.get("assetSha256", [])) if isinstance(fingerprint, dict) else []
        actual_hashes = raw.get("sourceAssetSha256")
        if not isinstance(actual_hashes, list) or sorted(str(value) for value in actual_hashes) != expected_hashes:
            raise base.StagedExamError(f"source visual inspection q{ordinal} source asset hashes do not match recon")
        by_ordinal[ordinal] = {
            "ordinal": ordinal,
            "verdict": "PASS",
            "semanticInspection": "PASS",
            "browserInspection": "PASS",
            "screenshotPath": raw["screenshotPath"],
            "sourceAssetSha256": expected_hashes,
            "notes": str(raw.get("notes") or ""),
        }
    if sorted(by_ordinal) != expected:
        raise base.StagedExamError(
            "source visual inspection must cover exactly "
            + ",".join(f"q{o}" for o in expected)
        )
    normalized: dict[str, Any] = {
        "schemaVersion": "0.1.0",
        "artifactType": "ALIVE_ADAPTIVE_SOURCE_VISUAL_INSPECTION",
        "runId": manifest["runId"],
        "actualBrowser": True,
        "productionEngine": payload.get("productionEngine") is True,
        "requiredOrdinals": expected,
        "questions": [by_ordinal[ordinal] for ordinal in expected],
        "inspectionScope": "source-visual-semantic-and-browser-before-generation",
    }
    normalized["artifactSha256"] = artifact_sha256(normalized)
    return normalized


def record_adaptive_visual_inspection(
    store: base.StagedRunStore,
    run_id: str,
    evidence_path: Path,
) -> dict[str, Any]:
    """Close the source-visual inspection gate before model generation."""

    manifest = store.load(run_id)
    required = _required_visual_ordinals(manifest)
    if not required:
        manifest["visualInspection"] = {
            "status": "NOT_REQUIRED",
            "requiredOrdinals": [],
        }
        store.save(run_id, manifest)
        return manifest
    payload = base._json_file(evidence_path.resolve())
    normalized = _normalize_visual_inspection_payload(manifest, payload)
    run_dir = store.run_dir(run_id)
    target = run_dir / ADAPTIVE_VISUAL_INSPECTION_PATH
    atomic_write_json(target, normalized)
    manifest["visualInspection"] = {
        "status": "PASS",
        "path": ADAPTIVE_VISUAL_INSPECTION_PATH,
        "artifactSha256": normalized["artifactSha256"],
        "requiredOrdinals": required,
    }
    manifest["visualInspectionPath"] = ADAPTIVE_VISUAL_INSPECTION_PATH
    manifest["codes"] = [
        code
        for code in manifest.get("codes", [])
        if code != "ADAPTIVE_VISUAL_INSPECTION_REQUIRED"
    ]
    if manifest.get("currentStage") == "S01A_VISUAL_RECON":
        method_ready = manifest.get("methodProfiles", {}).get("status") == "READY"
        recon_ready = manifest.get("visualRecon", {}).get("ready") is True
        preflight = next(
            (stage for stage in manifest.get("stages", []) if stage.get("stageId") == "S01_PREFLIGHT"),
            {},
        )
        if method_ready and recon_ready and preflight.get("status") == "PASS":
            base._set_stage(
                manifest,
                "S01A_VISUAL_RECON",
                "PASS",
                normalized["artifactSha256"],
            )
            manifest["status"] = "ROUND1_GENERATING"
            manifest["currentStage"] = "S02_ROUND1_GENERATION"
            base._append_event(
                manifest,
                "ADAPTIVE_SOURCE_VISUAL_INSPECTION_COMPLETE",
                requiredOrdinals=required,
            )
    _refresh_task_packets(run_dir, manifest)
    base._refresh(manifest)
    store.save(run_id, manifest)
    return manifest


def _ensure_method_snapshot(
    run_dir: Path,
    manifest: dict[str, Any],
) -> dict[str, Any]:
    """Materialize the V2 method snapshot, including for a held V1 Run."""

    existing = manifest.get("methodProfiles")
    authority = _method_rule_authority(manifest)
    if (
        isinstance(existing, dict)
        and existing.get("status") == "READY"
        and existing.get("ruleAuthority") == authority
    ):
        return existing
    method_questions: list[dict[str, Any]] = []
    for preflight_item in manifest.get("preflight", {}).get("questions", []):
        ordinal = int(preflight_item.get("ordinal", 0))
        student_path = run_dir / f"source/student/q{ordinal:03d}.json"
        student = base._json_file(student_path) if student_path.is_file() else {}
        method_questions.append({**preflight_item, **student})
    snapshot = build_method_snapshot(
        method_questions,
        rule_authority=authority,
    )
    manifest["methodProfiles"] = snapshot
    manifest["methodProfilePath"] = ADAPTIVE_METHOD_PROFILE_PATH
    atomic_write_json(run_dir / ADAPTIVE_METHOD_PROFILE_PATH, snapshot)
    return snapshot


def _coerce_positive_ordinals(value: Any, expected: int) -> list[int]:
    if not isinstance(value, list):
        return []
    result: list[int] = []
    for item in value:
        try:
            ordinal = int(item)
        except (TypeError, ValueError):
            continue
        if 1 <= ordinal <= expected:
            result.append(ordinal)
    return sorted(set(result))


def _render_failure_summary(
    manifest: dict[str, Any],
    evidence: dict[str, Any],
    error: str,
) -> dict[str, Any]:
    expected = int(manifest["request"]["expectedQuestionCount"])
    affected = _coerce_positive_ordinals(evidence.get("affectedOrdinals"), expected)
    failures: list[dict[str, Any]] = []
    modes = evidence.get("modes", {})
    if isinstance(modes, dict):
        for mode in ("exam", "solution", "answer"):
            result = modes.get(mode)
            if not isinstance(result, dict):
                continue
            if (
                result.get("verdict") != "PASS"
                or result.get("ready") is not True
                or result.get("renderError") is not None
                or result.get("lastQuestion") != expected
                or result.get("lastPageChecked") is not True
                or result.get("unrenderedMath") != 0
                or result.get("overflowCount") != 0
                or result.get("badImages") != []
            ):
                mode_ordinals = _coerce_positive_ordinals(
                    result.get("affectedOrdinals")
                    or result.get("overflowOrdinals")
                    or result.get("badImageOrdinals"),
                    expected,
                )
                affected = sorted(set(affected + mode_ordinals))
                failures.append(
                    {
                        "mode": mode,
                        "verdict": result.get("verdict"),
                        "renderError": result.get("renderError"),
                        "lastQuestion": result.get("lastQuestion"),
                        "unrenderedMath": result.get("unrenderedMath"),
                        "overflowCount": result.get("overflowCount"),
                        "badImages": result.get("badImages"),
                    }
                )
    if not affected:
        affected = list(range(1, expected + 1))
    return {
        "status": "HOLD",
        "error": error,
        "affectedOrdinals": affected,
        "failures": failures,
    }


def record_adaptive_render(
    store: base.StagedRunStore,
    run_id: str,
    evidence_path: Path,
) -> dict[str, Any]:
    """Record browser evidence or route a real render failure back to repair."""

    evidence = base._json_file(evidence_path.resolve())
    try:
        manifest = base.record_staged_render(store, run_id, evidence_path.resolve())
    except base.StagedExamError as error:
        modes = evidence.get("modes")
        if (
            evidence.get("actualBrowser") is not True
            or evidence.get("productionEngine") is not True
            or not isinstance(modes, dict)
            or set(modes) != {"exam", "solution", "answer"}
        ):
            raise
        manifest = store.load(run_id)
        run_dir = store.run_dir(run_id)
        failures = manifest.setdefault("renderFailures", [])
        index = len(failures) + 1
        failure_path = f"render/render-failure-{index:02d}.json"
        atomic_write_json(run_dir / failure_path, evidence)
        summary = _render_failure_summary(manifest, evidence, str(error))
        summary.update(
            {
                "path": failure_path,
                "evidenceSha256": sha256_file(run_dir / failure_path),
                "recordedAt": utc_now(),
            }
        )
        failures.append(copy.deepcopy(summary))
        manifest["renderFailure"] = summary
        manifest["status"] = "MANUAL_REVIEW_REQUIRED"
        manifest["currentStage"] = "S08_RENDER_REVIEW"
        manifest["codes"] = sorted(
            set(manifest.get("codes", []) + ["ADAPTIVE_RENDER_FINDINGS"])
        )
        base._set_stage(
            manifest,
            "S08_RENDER_REVIEW",
            "HOLD",
            summary["evidenceSha256"],
        )
        base._append_event(
            manifest,
            "ADAPTIVE_RENDER_FAILURE_ROUTED_TO_CORRECTION",
            affectedOrdinals=summary["affectedOrdinals"],
            failurePath=failure_path,
        )
        base._refresh(manifest)
        store.save(run_id, manifest)
        return manifest
    manifest = store.load(run_id)
    manifest["renderFailure"] = None
    base._refresh(manifest)
    store.save(run_id, manifest)
    return manifest


def start_adaptive_staged_exam(
    root: Path,
    store: base.StagedRunStore,
    source_file: str,
    query: str | None,
    engine_version: str,
    source_resolution: dict[str, Any] | None = None,
    batch_count: int = base.STAGED_MAX_BATCHES,
    variation_mode: str = "QUICK",
    batch_strategy: str = "CONTIGUOUS_BALANCED",
) -> dict[str, Any]:
    """Create an adaptive Run while preserving the baseline start path."""

    manifest = base.start_staged_exam(
        root,
        store,
        source_file,
        query,
        engine_version,
        source_resolution=source_resolution,
        batch_count=batch_count,
        variation_mode=variation_mode,
        batch_strategy=batch_strategy,
    )
    run_id = manifest["runId"]
    run_dir = store.run_dir(run_id)
    _set_adaptive_metadata(manifest)
    method_snapshot = _ensure_method_snapshot(run_dir, manifest)
    if method_snapshot.get("status") != "READY":
        manifest["status"] = "BLOCKED"
        manifest["currentStage"] = "S01_PREFLIGHT"
        manifest["codes"] = sorted(
            set(manifest.get("codes", []) + ["ADAPTIVE_METHOD_PROFILE_HOLD"])
        )
        base._append_event(
            manifest,
            "ADAPTIVE_METHOD_PROFILE_HOLD",
            unmappedOrdinals=method_snapshot.get("unmappedOrdinals", []),
        )
    visual_ordinals = _required_visual_ordinals(manifest)
    if visual_ordinals:
        existing_inspection = manifest.get("visualInspection", {})
        inspection_ready = (
            isinstance(existing_inspection, dict)
            and existing_inspection.get("status") == "PASS"
            and existing_inspection.get("requiredOrdinals") == visual_ordinals
        )
        if not inspection_ready:
            manifest["visualInspection"] = {
                "status": "PENDING",
                "path": ADAPTIVE_VISUAL_INSPECTION_PATH,
                "requiredOrdinals": visual_ordinals,
            }
            if (
                manifest.get("status") == "ROUND1_GENERATING"
                and manifest.get("currentStage") == "S02_ROUND1_GENERATION"
            ):
                base._set_stage(
                    manifest,
                    "S01A_VISUAL_RECON",
                    "HOLD",
                    "adaptive source visual inspection is required before generation",
                )
                manifest["status"] = "BLOCKED"
                manifest["currentStage"] = "S01A_VISUAL_RECON"
            manifest["codes"] = sorted(
                set(manifest.get("codes", []) + ["ADAPTIVE_VISUAL_INSPECTION_REQUIRED"])
            )
            base._append_event(
                manifest,
                "ADAPTIVE_SOURCE_VISUAL_INSPECTION_REQUIRED",
                requiredOrdinals=visual_ordinals,
            )
    else:
        manifest["visualInspection"] = {
            "status": "NOT_REQUIRED",
            "requiredOrdinals": [],
        }
    base._append_event(
        manifest,
        "ADAPTIVE_EXPERIMENT_CONFIGURED",
        workflowProfile=ADAPTIVE_PROFILE,
        reviewPolicy=ADAPTIVE_REVIEW_POLICY,
        model="gpt-5.6-luna",
        reasoning="xhigh",
        methodGate="QUESTION_METHOD_PROFILE_HARD_LOCK",
        methodProfilePath=ADAPTIVE_METHOD_PROFILE_PATH,
    )
    _refresh_task_packets(run_dir, manifest)
    base._refresh(manifest)
    store.save(run_id, manifest)
    return manifest


def start_adaptive_staged_dispatch(
    store: base.StagedRunStore,
    run_id: str,
    task_id: str,
    external_id: str,
    route: str | None = None,
) -> tuple[dict[str, Any], bool]:
    """Start an adaptive task attempt with the experiment-only retry budget."""

    manifest = store.load(run_id)
    task = base._task(manifest, task_id)
    if task.get("status") == "DISPATCHED":
        attempts = task.get("dispatch", {}).get("attempts", [])
        if attempts and attempts[-1].get("externalId") == external_id:
            return task, True
        raise base.StagedExamError("staged task already dispatched with another external id")
    if task.get("status") != "PENDING":
        raise base.StagedExamError(f"staged task is not dispatchable: {task.get('status')}")
    attempts = task.setdefault("dispatch", {}).setdefault("attempts", [])
    if len(attempts) >= ADAPTIVE_MAX_ATTEMPTS:
        raise base.StagedExamError("adaptive staged dispatch retry limit exhausted")
    receipt = {
        "attempt": len(attempts) + 1,
        "externalId": external_id,
        "route": route or "gpt-5.6-luna/xhigh",
        "status": "DISPATCHED",
        "startedAt": utc_now(),
    }
    candidate = store.run_dir(run_id) / task["outputPath"] if task.get("outputPath") else None
    if candidate is not None and candidate.is_file():
        receipt["baselineInputMtimeNs"] = candidate.stat().st_mtime_ns
    heartbeat_path = task.get("heartbeatPath")
    heartbeat = store.run_dir(run_id) / heartbeat_path if heartbeat_path else None
    if heartbeat is not None and heartbeat.is_file():
        # A retry must not inherit the previous attempt's heartbeat. Without
        # this baseline, the watchdog can reap the retry using stale activity
        # from the prior attempt before the new agent writes its first beat.
        receipt["heartbeatBaselineMtimeNs"] = heartbeat.stat().st_mtime_ns
    attempts.append(receipt)
    task["status"] = "DISPATCHED"
    task["completionRequired"] = True
    base._append_event(
        manifest,
        "STAGED_TASK_DISPATCH_STARTED",
        taskId=task_id,
        externalId=external_id,
        workflowProfile=ADAPTIVE_PROFILE,
        attempt=receipt["attempt"],
    )
    base._refresh(manifest)
    store.save(run_id, manifest)
    return task, False


def fail_adaptive_staged_dispatch(
    store: base.StagedRunStore,
    run_id: str,
    task_id: str,
    code: str,
) -> dict[str, Any]:
    """Fail one adaptive attempt without falling back to the baseline limit."""

    manifest = store.load(run_id)
    task = base._task(manifest, task_id)
    if task.get("status") != "DISPATCHED":
        raise base.StagedExamError("only dispatched adaptive tasks can fail")
    attempts = task.setdefault("dispatch", {}).setdefault("attempts", [])
    if not attempts or attempts[-1].get("status") != "DISPATCHED":
        raise base.StagedExamError("adaptive dispatch receipt is invalid")
    attempts[-1].update(
        {"status": "DISPATCH_FAILED", "code": code, "finishedAt": utc_now()}
    )
    marker_relative = task.get("completionMarkerPath")
    if isinstance(marker_relative, str):
        marker = base._inside(store.run_dir(run_id), store.run_dir(run_id) / marker_relative)
        if marker.exists():
            marker.unlink()
    if len(attempts) >= ADAPTIVE_MAX_ATTEMPTS:
        task["status"] = "FAILED"
        manifest["status"] = "FAILED"
        manifest["codes"] = sorted(
            set(manifest.get("codes", []) + ["ADAPTIVE_DISPATCH_RETRY_EXHAUSTED"])
        )
    else:
        task["status"] = "PENDING"
        stage_status = {
            "S02_ROUND1_GENERATION": "ROUND1_GENERATING",
            "S03_REVIEW1": "REVIEW1_RUNNING",
            "S04_REVISION": "REVISION_RUNNING",
            "S05_REVIEW2": "REVIEW2_RUNNING",
            ADAPTIVE_CORRECTION_STAGE: "CORRECTION_RUNNING",
            ADAPTIVE_CORRECTION_REVIEW_STAGE: "CORRECTION_REVIEW_RUNNING",
        }.get(manifest.get("currentStage"))
        if stage_status:
            manifest["status"] = stage_status
        manifest["codes"] = [
            existing
            for existing in manifest.get("codes", [])
            if existing
            not in {
                "STAGED_DISPATCH_RETRY_EXHAUSTED",
                "ADAPTIVE_DISPATCH_RETRY_EXHAUSTED",
            }
        ]
    base._append_event(
        manifest,
        "ADAPTIVE_TASK_DISPATCH_FAILED",
        taskId=task_id,
        code=code,
        attempt=len(attempts),
        retryable=task.get("status") == "PENDING",
    )
    base._refresh(manifest)
    store.save(run_id, manifest)
    return task


def _adaptive_record_rejection(
    store: base.StagedRunStore,
    run_id: str,
    task: dict[str, Any],
    error: str,
) -> None:
    """Record an invalid artifact using the adaptive four-attempt budget."""

    manifest = store.load(run_id)
    fresh = base._task(manifest, task["taskId"])
    attempts = fresh.setdefault("dispatch", {}).setdefault("attempts", [])
    if attempts and attempts[-1].get("status") == "DISPATCHED":
        attempts[-1].update(
            {
                "status": "ARTIFACT_REJECTED",
                "error": error,
                "finishedAt": utc_now(),
            }
        )
    fresh["lastError"] = error
    marker_relative = fresh.get("completionMarkerPath")
    if isinstance(marker_relative, str):
        marker = base._inside(store.run_dir(run_id), store.run_dir(run_id) / marker_relative)
        if marker.exists():
            marker.unlink()
    if len(attempts) >= ADAPTIVE_MAX_ATTEMPTS:
        fresh["status"] = "FAILED"
        manifest["status"] = "FAILED"
        manifest["currentStage"] = fresh.get("stage") or manifest.get("currentStage")
        manifest["codes"] = sorted(
            set(manifest.get("codes", []) + ["ADAPTIVE_ARTIFACT_RETRY_EXHAUSTED"])
        )
    else:
        fresh["status"] = "PENDING"
        stage_status = {
            "S02_ROUND1_GENERATION": "ROUND1_GENERATING",
            "S03_REVIEW1": "REVIEW1_RUNNING",
            "S04_REVISION": "REVISION_RUNNING",
            "S05_REVIEW2": "REVIEW2_RUNNING",
            ADAPTIVE_CORRECTION_STAGE: "CORRECTION_RUNNING",
            ADAPTIVE_CORRECTION_REVIEW_STAGE: "CORRECTION_REVIEW_RUNNING",
        }.get(manifest.get("currentStage"))
        if stage_status:
            manifest["status"] = stage_status
        manifest["codes"] = [
            existing
            for existing in manifest.get("codes", [])
            if existing
            not in {
                "STAGED_ARTIFACT_RETRY_EXHAUSTED",
                "ADAPTIVE_ARTIFACT_RETRY_EXHAUSTED",
            }
        ]
    base._append_event(manifest, "STAGED_TASK_REJECTED", taskId=fresh["taskId"], error=error)
    base._append_event(
        manifest,
        "ADAPTIVE_ARTIFACT_REJECTION_RECORDED",
        taskId=fresh["taskId"],
        attempt=len(attempts),
        retryable=fresh.get("status") == "PENDING",
    )
    base._refresh(manifest)
    store.save(run_id, manifest)


def _adaptive_normalize_draft_batch(
    manifest: dict[str, Any],
    task: dict[str, Any],
    payload: dict[str, Any],
    run_dir: Path | None = None,
) -> dict[str, Any]:
    """Normalize a candidate, then fail closed on its method route."""

    normalized = _BASE_NORMALIZE_DRAFT_BATCH(manifest, task, payload, run_dir)
    profiles = manifest.get("methodProfiles", {}).get("profiles", {})
    method_findings: list[dict[str, Any]] = []
    for question in normalized.get("questions", []):
        ordinal = int(question.get("ordinal", 0))
        preflight = manifest.get("preflight", {}).get("questions", [])
        preflight_item = preflight[ordinal - 1] if 0 < ordinal <= len(preflight) else {}
        profile = profiles.get(str(ordinal)) or method_profile_for_question(
            question.get("studentPayload"), preflight_item
        )
        report = lint_solution_method(
            profile,
            str(question.get("solution") or ""),
            question.get("solutionDetail"),
        )
        question["solutionMethodReview"] = report
        if report.get("verdict") != "PASS":
            method_findings.append({"ordinal": ordinal, "report": report})
    if method_findings:
        details = "; ".join(
            f"q{item['ordinal']}: {', '.join(item['report'].get('issues', []))}"
            for item in method_findings
        )
        raise base.StagedExamError(
            f"adaptive solution method gate failed ({details})"
        )
    normalized["artifactSha256"] = artifact_sha256(normalized)
    return normalized


def _adaptive_candidate_for_review(
    run_dir: Path,
    manifest: dict[str, Any],
    task: dict[str, Any],
) -> dict[str, Any]:
    """Resolve normal and custom correction-review candidates by batch state."""

    batch = manifest["batches"][task["batchId"]]
    relative = (
        batch.get("round1AcceptedPath")
        if task.get("round") == "review1"
        else batch.get("revisionAcceptedPath")
    )
    if not isinstance(relative, str):
        raise base.StagedExamError("adaptive review candidate path is missing")
    return base._json_file(base._inside(run_dir, run_dir / relative))


def _carry_forward_review1(
    run_dir: Path,
    manifest: dict[str, Any],
    batch_id: str,
) -> None:
    """Materialize a transparent review-2 carry-forward for an unchanged batch."""

    batch = manifest["batches"][batch_id]
    source_relative = batch.get("review1AcceptedPath")
    if not isinstance(source_relative, str):
        raise base.StagedExamError(
            f"adaptive carry-forward source is missing for {batch_id}"
        )
    source = base._inside(run_dir, run_dir / source_relative)
    review1 = base._json_file(source)
    reviews = review1.get("reviews")
    if not isinstance(reviews, list) or len(reviews) != len(batch["ordinals"]):
        raise base.StagedExamError(
            f"adaptive carry-forward review is incomplete for {batch_id}"
        )

    accepted_relative = f"evidence/{batch_id}/review2-carry-forward.json"
    accepted = {
        "schemaVersion": base.STAGED_SCHEMA_VERSION,
        "artifactType": "ALIVE_STAGED_BATCH_REVIEW",
        "runId": manifest["runId"],
        "batchId": batch_id,
        "round": "review2",
        "batchOrdinals": list(batch["ordinals"]),
        "independenceLevel": "I1_CARRIED_FORWARD",
        "reviewPolicy": ADAPTIVE_REVIEW_POLICY,
        "sourceReviewArtifactSha256": review1.get("artifactSha256"),
        "reviews": copy.deepcopy(reviews),
    }
    accepted["artifactSha256"] = artifact_sha256(accepted)
    target = run_dir / accepted_relative
    target.parent.mkdir(parents=True, exist_ok=True)
    atomic_write_json(target, accepted)

    task_id = base._batch_task_id(batch_id, "review2")
    task = {
        "taskId": task_id,
        "kind": "BATCH_REVIEWER",
        "round": "review2",
        "stage": "S05_REVIEW2",
        "batchId": batch_id,
        "ordinals": list(batch["ordinals"]),
        "status": "SKIPPED",
        "packetPath": None,
        "outputPath": None,
        "completionMarkerPath": None,
        "completionRequired": False,
        "acceptedPath": accepted_relative,
        "dispatch": {"attempts": []},
        "reason": "review1_passed_no_revision_needed",
        "reviewPolicy": ADAPTIVE_REVIEW_POLICY,
        "carriedForwardFrom": source_relative,
    }
    manifest.setdefault("tasks", {})[task_id] = task
    batch["review2TaskId"] = task_id
    batch["review2AcceptedPath"] = accepted_relative
    batch["review2"] = {
        "items": copy.deepcopy(accepted["reviews"]),
        "acceptedPath": accepted_relative,
        "policy": ADAPTIVE_REVIEW_POLICY,
        "carriedForward": True,
    }
    base._append_event(
        manifest,
        "ADAPTIVE_REVIEW2_CARRIED_FORWARD",
        batchId=batch_id,
        sourceReviewPath=source_relative,
        acceptedPath=accepted_relative,
    )


def _create_adaptive_review2_tasks(
    run_dir: Path,
    manifest: dict[str, Any],
) -> None:
    """Create delta review tasks and carry forward unchanged review evidence."""

    for batch_id, batch in manifest["batches"].items():
        revision_task = manifest.get("tasks", {}).get(batch.get("revisionTaskId"))
        if isinstance(revision_task, dict) and revision_task.get("status") == "SKIPPED":
            _carry_forward_review1(run_dir, manifest, batch_id)
            continue

        source_paths = [
            manifest["questions"][str(o)]["studentSourcePath"]
            for o in batch["ordinals"]
        ]
        source_visual_paths = [
            f"source/visual/q{o:03d}/**" for o in batch["ordinals"]
        ]
        candidate_path = f"candidates/{batch_id}/revision-student.json"
        solution_path = base._solution_view_path(batch_id, "revision")
        visual_paths = [
            f"candidates/{batch_id}/revision/visual/q{o:03d}/**"
            for o in batch["ordinals"]
        ]
        task = base._write_task(
            run_dir,
            manifest,
            batch_id,
            "review2",
            "BATCH_REVIEWER",
            source_paths
            + source_visual_paths
            + [
                candidate_path,
                solution_path,
                manifest["rulePackPath"],
                manifest["visualReconPath"],
            ]
            + visual_paths,
            [
                "source/source-exam.json",
                f"candidates/{batch_id}/revision.json",
                "evidence/*",
                "final/*",
            ],
        )
        packet_path = run_dir / task["packetPath"]
        packet = base._json_file(packet_path)
        packet["workflowProfile"] = ADAPTIVE_PROFILE
        packet["reviewPolicy"] = ADAPTIVE_REVIEW_POLICY
        packet["route"] = {"model": "gpt-5.6-luna", "reasoning": "xhigh"}
        atomic_write_json(packet_path, packet)


def _review_item_passes(item: dict[str, Any]) -> bool:
    return (
        item.get("verdict") == "PASS"
        and item.get("answerMatch") is True
        and item.get("solutionReview", {}).get("verdict") == "PASS"
        and item.get("solutionReview", {}).get("studentCanFollow") is True
    )


def _current_candidate_path(batch: dict[str, Any]) -> str:
    relative = batch.get("revisionAcceptedPath")
    if not isinstance(relative, str):
        raise base.StagedExamError("adaptive correction candidate path is missing")
    return relative


def _candidate_solution_view_for_path(relative: str) -> str:
    path = Path(relative)
    return (path.parent / f"{path.stem}-solution.json").as_posix()


def _adaptive_method_findings(
    run_dir: Path,
    manifest: dict[str, Any],
    batch_id: str,
) -> list[dict[str, Any]]:
    batch = manifest["batches"][batch_id]
    relative = batch.get("revisionAcceptedPath")
    if not isinstance(relative, str):
        return []
    candidate_path = base._inside(run_dir, run_dir / relative)
    if not candidate_path.is_file():
        return []
    candidate = base._json_file(candidate_path)
    return lint_candidate_methods(manifest, candidate)


def _adaptive_correction_findings(
    run_dir: Path,
    manifest: dict[str, Any],
) -> tuple[dict[str, list[dict[str, Any]]], list[int]]:
    """Collect review and method findings without changing their evidence."""

    findings_by_batch: dict[str, list[dict[str, Any]]] = {}
    pending_ordinals: list[int] = []
    for batch_id, batch in manifest.get("batches", {}).items():
        findings: list[dict[str, Any]] = []
        for item in batch.get("review2", {}).get("items", []):
            if not _review_item_passes(item):
                ordinal = int(item.get("ordinal", 0))
                pending_ordinals.append(ordinal)
                findings.append(
                    {
                        "ordinal": ordinal,
                        "source": "review2",
                        "verdict": item.get("verdict"),
                        "findings": copy.deepcopy(item.get("findings", [])),
                        "suggestedFixes": copy.deepcopy(item.get("suggestedFixes", [])),
                        "solutionReview": copy.deepcopy(item.get("solutionReview", {})),
                    }
                )
        for item in _adaptive_method_findings(run_dir, manifest, batch_id):
            ordinal = int(item.get("ordinal", 0))
            pending_ordinals.append(ordinal)
            findings.append(
                {
                    "ordinal": ordinal,
                    "source": "method-profile-hard-lock",
                    "methodReport": copy.deepcopy(item.get("report", {})),
                }
            )
        render_failure = manifest.get("renderFailure")
        if isinstance(render_failure, dict):
            render_ordinals = set(
                _coerce_positive_ordinals(
                    render_failure.get("affectedOrdinals"),
                    int(manifest["request"]["expectedQuestionCount"]),
                )
            )
            for ordinal in batch.get("ordinals", []):
                if ordinal not in render_ordinals:
                    continue
                pending_ordinals.append(ordinal)
                findings.append(
                    {
                        "ordinal": ordinal,
                        "source": "browser-render",
                        "renderFailurePath": render_failure.get("path"),
                        "findings": copy.deepcopy(render_failure.get("failures", [])),
                        "suggestedFixes": [
                            "브라우저에서 발견된 시각 오류를 수정하고 동일 문항을 다시 렌더한다."
                        ],
                    }
                )
        if findings:
            findings_by_batch[batch_id] = findings

    # A mother-final hold can have no review2 item of its own.  Preserve the
    # fail-closed behaviour by routing explicit mother ordinals, or the whole
    # exam when the mother report does not identify one.
    if not findings_by_batch and manifest.get("motherFinal", {}).get("verdict") != "PASS":
        mother_findings = manifest.get("motherFinal", {}).get("findings", [])
        mother_ordinals = {
            int(item.get("ordinal"))
            for item in mother_findings
            if isinstance(item, dict) and str(item.get("ordinal", "")).isdigit()
        }
        for batch_id, batch in manifest.get("batches", {}).items():
            selected = [
                ordinal for ordinal in batch.get("ordinals", [])
                if not mother_ordinals or ordinal in mother_ordinals
            ]
            if selected:
                findings_by_batch[batch_id] = [
                    {
                        "ordinal": ordinal,
                        "source": "mother-final",
                        "findings": ["마더 최종 게이트의 잔여 근거를 해결해야 합니다."],
                    }
                    for ordinal in selected
                ]
                pending_ordinals.extend(selected)
    return findings_by_batch, sorted(set(pending_ordinals))


def _write_adaptive_correction_task(
    run_dir: Path,
    manifest: dict[str, Any],
    batch_id: str,
    cycle: int,
    findings: list[dict[str, Any]],
) -> dict[str, Any]:
    round_name = f"repair-{cycle:02d}"
    task_id = f"{batch_id}-{round_name}"
    batch = manifest["batches"][batch_id]
    ordinals = list(batch["ordinals"])
    source_paths = [manifest["questions"][str(o)]["studentSourcePath"] for o in ordinals]
    source_visual_paths = [f"source/visual/q{o:03d}/**" for o in ordinals]
    current_candidate = _current_candidate_path(batch)
    current_solution = _candidate_solution_view_for_path(current_candidate)
    current_review = batch.get("review2AcceptedPath")
    visual_paths = [
        f"candidates/{batch_id}/revision/visual/q{o:03d}/**" for o in ordinals
    ]
    allowed = source_paths + source_visual_paths + [
        current_candidate,
        current_solution,
        manifest["rulePackPath"],
        base._reference_pack_path(manifest, batch_id),
        manifest["visualReconPath"],
        ADAPTIVE_METHOD_PROFILE_PATH,
    ] + visual_paths
    if isinstance(current_review, str):
        allowed.append(current_review)
    forbidden = [
        "source/source-exam.json",
        "final/*",
        "evidence/*",
    ]
    packet = base._packet_for(
        manifest,
        batch_id,
        round_name,
        "BATCH_BUILDER",
        list(dict.fromkeys(allowed)),
        forbidden,
    )
    output_path = f"inbox/{task_id}.json"
    completion_path = f"inbox/{task_id}.complete.json"
    accepted_path = f"candidates/{batch_id}/{round_name}.json"
    packet.update(
        {
            "taskId": task_id,
            "round": round_name,
            "outputPath": output_path,
            "completionMarkerPath": completion_path,
            "heartbeatPath": f"heartbeats/{task_id}.json",
            "acceptedPath": accepted_path,
            "repairCycle": cycle,
            "repairOnly": True,
            "currentCandidatePath": current_candidate,
            "currentSolutionPath": current_solution,
            "repairFindings": copy.deepcopy(findings),
            "methodGate": "QUESTION_METHOD_PROFILE_HARD_LOCK",
            "methodProfilePath": ADAPTIVE_METHOD_PROFILE_PATH,
        }
    )
    # The repair builder is allowed to consult the same blinded reference
    # pack as the original generator; the independent repair reviewer is not.
    packet["referencePackPath"] = base._reference_pack_path(manifest, batch_id)
    profiles = manifest.get("methodProfiles", {}).get("profiles", {})
    packet["methodProfiles"] = {
        str(ordinal): copy.deepcopy(profiles[str(ordinal)])
        for ordinal in ordinals
        if str(ordinal) in profiles
    }
    task = {
        "taskId": task_id,
        "kind": "BATCH_BUILDER",
        "round": round_name,
        "stage": ADAPTIVE_CORRECTION_STAGE,
        "batchId": batch_id,
        "ordinals": ordinals,
        "status": "PENDING",
        "packetPath": f"tasks/{task_id}.json",
        "outputPath": output_path,
        "completionMarkerPath": completion_path,
        "heartbeatPath": packet["heartbeatPath"],
        "completionRequired": False,
        "acceptedPath": accepted_path,
        "dispatch": {"attempts": []},
        "repairCycle": cycle,
        "repairFindings": copy.deepcopy(findings),
    }
    manifest.setdefault("tasks", {})[task_id] = task
    batch.setdefault("correctionTasks", {})[str(cycle)] = task_id
    atomic_write_json(run_dir / task["packetPath"], packet)
    return task


def _create_adaptive_correction_review_tasks(
    run_dir: Path,
    manifest: dict[str, Any],
) -> None:
    loop = manifest.get("correctionLoop", {})
    cycle = int(loop.get("activeCycle", 0))
    if cycle < 1:
        raise base.StagedExamError("adaptive correction cycle is not active")
    for task in list(manifest.get("tasks", {}).values()):
        if (
            task.get("stage") != ADAPTIVE_CORRECTION_STAGE
            or task.get("repairCycle") != cycle
            or task.get("kind") != "BATCH_BUILDER"
            or task.get("status") != "ACCEPTED"
        ):
            continue
        batch_id = task["batchId"]
        batch = manifest["batches"][batch_id]
        round_name = f"repair-review-{cycle:02d}"
        task_id = f"{batch_id}-{round_name}"
        ordinals = list(batch["ordinals"])
        candidate_path = _current_candidate_path(batch)
        solution_path = _candidate_solution_view_for_path(candidate_path)
        visual_paths = [
            f"candidates/{batch_id}/{task['round']}/visual/q{o:03d}/**"
            for o in ordinals
        ]
        allowed = [
            manifest["questions"][str(o)]["studentSourcePath"] for o in ordinals
        ]
        allowed += [f"source/visual/q{o:03d}/**" for o in ordinals]
        allowed += [
            candidate_path,
            solution_path,
            manifest["rulePackPath"],
            manifest["visualReconPath"],
            ADAPTIVE_METHOD_PROFILE_PATH,
            *visual_paths,
        ]
        packet = base._packet_for(
            manifest,
            batch_id,
            round_name,
            "BATCH_REVIEWER",
            list(dict.fromkeys(allowed)),
            [
                "source/source-exam.json",
                "evidence/*",
                "final/*",
            ],
        )
        output_path = f"inbox/{task_id}.json"
        completion_path = f"inbox/{task_id}.complete.json"
        accepted_path = f"evidence/{batch_id}/{round_name}.json"
        packet.update(
            {
                "taskId": task_id,
                "round": round_name,
                "outputPath": output_path,
                "completionMarkerPath": completion_path,
                "heartbeatPath": f"heartbeats/{task_id}.json",
                "acceptedPath": accepted_path,
                "repairCycle": cycle,
                "repairOnly": True,
                "candidatePath": candidate_path,
                "solutionViewPath": solution_path,
                "methodGate": "QUESTION_METHOD_PROFILE_HARD_LOCK",
                "methodProfilePath": ADAPTIVE_METHOD_PROFILE_PATH,
            }
        )
        profiles = manifest.get("methodProfiles", {}).get("profiles", {})
        packet["methodProfiles"] = {
            str(ordinal): copy.deepcopy(profiles[str(ordinal)])
            for ordinal in ordinals
            if str(ordinal) in profiles
        }
        review_task = {
            "taskId": task_id,
            "kind": "BATCH_REVIEWER",
            "round": round_name,
            "stage": ADAPTIVE_CORRECTION_REVIEW_STAGE,
            "batchId": batch_id,
            "ordinals": ordinals,
            "status": "PENDING",
            "packetPath": f"tasks/{task_id}.json",
            "outputPath": output_path,
            "completionMarkerPath": completion_path,
            "heartbeatPath": packet["heartbeatPath"],
            "completionRequired": False,
            "acceptedPath": accepted_path,
            "dispatch": {"attempts": []},
            "repairCycle": cycle,
        }
        manifest.setdefault("tasks", {})[task_id] = review_task
        batch.setdefault("correctionReviewTasks", {})[str(cycle)] = task_id
        atomic_write_json(run_dir / review_task["packetPath"], packet)


def start_adaptive_correction_cycle(
    store: base.StagedRunStore,
    run_id: str,
) -> dict[str, Any]:
    """Queue a bounded correction cycle for every unresolved ordinal.

    The function never approves a held Run.  It only creates repair and fresh
    review tasks; a later cycle is required if the new review still reports a
    finding.  After the configured cycle budget the Run remains held for a
    human decision.
    """

    manifest = store.load(run_id)
    if manifest.get("status") != "MANUAL_REVIEW_REQUIRED":
        raise base.StagedExamError(
            "adaptive correction cycle requires MANUAL_REVIEW_REQUIRED"
        )
    if manifest.get("currentStage") not in {
        "S05_REVIEW2",
        "S06_MOTHER_SEMANTIC_FINAL",
        "S08_RENDER_REVIEW",
        ADAPTIVE_CORRECTION_REVIEW_STAGE,
    }:
        raise base.StagedExamError("adaptive correction cycle is not available at this stage")
    run_dir = store.run_dir(run_id)
    # A held V1 Run may be resumed through the V2 lane.  Upgrade its durable
    # request/stage metadata before creating any new repair task so the
    # continuation is auditable and every subsequent packet is method-locked.
    _set_adaptive_metadata(manifest)
    _ensure_method_snapshot(run_dir, manifest)
    for stage_id, label in (
        (ADAPTIVE_CORRECTION_STAGE, "Adaptive correction loop"),
        (ADAPTIVE_CORRECTION_REVIEW_STAGE, "Adaptive correction review"),
    ):
        if not any(stage.get("stageId") == stage_id for stage in manifest.get("stages", [])):
            manifest.setdefault("stages", []).append(
                {"stageId": stage_id, "label": label, "status": "PENDING", "evidence": []}
            )
    loop = manifest.setdefault(
        "correctionLoop",
        {
            "enabled": True,
            "maxCycles": ADAPTIVE_MAX_CORRECTION_CYCLES,
            "nextCycle": 1,
            "cycles": [],
        },
    )
    cycle = int(loop.get("nextCycle", len(loop.get("cycles", [])) + 1))
    max_cycles = int(loop.get("maxCycles", ADAPTIVE_MAX_CORRECTION_CYCLES))
    if cycle > max_cycles:
        loop["status"] = "HOLD_NEEDS_MANUAL"
        base._append_event(
            manifest,
            "ADAPTIVE_CORRECTION_BUDGET_EXHAUSTED",
            maxCycles=max_cycles,
        )
        base._refresh(manifest)
        store.save(run_id, manifest)
        raise base.StagedExamError(
            f"adaptive correction cycle budget exhausted ({max_cycles}); Run remains held"
        )

    findings_by_batch, pending_ordinals = _adaptive_correction_findings(
        run_dir, manifest
    )
    if not findings_by_batch:
        raise base.StagedExamError("adaptive correction has no unresolved findings")
    for stage_id in (ADAPTIVE_CORRECTION_STAGE, ADAPTIVE_CORRECTION_REVIEW_STAGE):
        stage = next(
            stage for stage in manifest.get("stages", []) if stage.get("stageId") == stage_id
        )
        stage["status"] = "PENDING"
    for batch_id, findings in findings_by_batch.items():
        _write_adaptive_correction_task(run_dir, manifest, batch_id, cycle, findings)
    loop["activeCycle"] = cycle
    loop["nextCycle"] = cycle + 1
    loop["status"] = "RUNNING"
    loop.setdefault("cycles", []).append(
        {
            "cycle": cycle,
            "status": "RUNNING",
            "affectedBatches": sorted(findings_by_batch),
            "pendingOrdinals": pending_ordinals,
            "startedAt": utc_now(),
        }
    )
    manifest["status"] = "CORRECTION_RUNNING"
    manifest["currentStage"] = ADAPTIVE_CORRECTION_STAGE
    base._append_event(
        manifest,
        "ADAPTIVE_CORRECTION_CYCLE_STARTED",
        cycle=cycle,
        affectedBatches=sorted(findings_by_batch),
        pendingOrdinals=pending_ordinals,
    )
    base._refresh(manifest)
    store.save(run_id, manifest)
    return manifest


def _complete_adaptive_correction_review(
    run_dir: Path,
    manifest: dict[str, Any],
) -> None:
    loop = manifest.get("correctionLoop", {})
    cycle = int(loop.get("activeCycle", 0))
    for task in manifest.get("tasks", {}).values():
        if (
            task.get("stage") != ADAPTIVE_CORRECTION_REVIEW_STAGE
            or task.get("repairCycle") != cycle
            or task.get("kind") != "BATCH_REVIEWER"
            or task.get("status") != "ACCEPTED"
        ):
            continue
        accepted = base._json_file(
            base._inside(run_dir, run_dir / task["acceptedPath"])
        )
        batch = manifest["batches"][task["batchId"]]
        batch["review2"] = {
            "items": copy.deepcopy(accepted.get("reviews", [])),
            "acceptedPath": task["acceptedPath"],
            "correctionCycle": cycle,
        }
    cycle_record = next(
        (item for item in reversed(loop.get("cycles", [])) if item.get("cycle") == cycle),
        None,
    )
    all_pass = all(
        _review_item_passes(item)
        for batch in manifest["batches"].values()
        for item in batch.get("review2", {}).get("items", [])
    )
    if not all_pass:
        base._set_stage(
            manifest,
            ADAPTIVE_CORRECTION_REVIEW_STAGE,
            "HOLD",
            "correction review still contains unresolved findings",
        )
        manifest["status"] = "MANUAL_REVIEW_REQUIRED"
        manifest["currentStage"] = ADAPTIVE_CORRECTION_REVIEW_STAGE
        if isinstance(cycle_record, dict):
            cycle_record["status"] = "HOLD"
            cycle_record["unresolvedOrdinals"] = sorted(
                {
                    int(item.get("ordinal", 0))
                    for batch in manifest["batches"].values()
                    for item in batch.get("review2", {}).get("items", [])
                    if not _review_item_passes(item)
                }
            )
        manifest["codes"] = sorted(
            set(manifest.get("codes", []) + ["ADAPTIVE_CORRECTION_FINDINGS"])
        )
        base._append_event(
            manifest,
            "ADAPTIVE_CORRECTION_CYCLE_HOLD",
            cycle=cycle,
        )
        return

    base._set_stage(
        manifest,
        ADAPTIVE_CORRECTION_REVIEW_STAGE,
        "PASS",
        "all correction review records passed",
    )
    if isinstance(cycle_record, dict):
        cycle_record["status"] = "REVIEW_PASS"
        cycle_record["completedAt"] = utc_now()
    if manifest.get("renderFailure") is not None:
        manifest.setdefault("resolvedRenderFailures", []).append(
            copy.deepcopy(manifest["renderFailure"])
        )
        manifest["renderFailure"] = None
    mother = base._run_mother_semantic_final(run_dir, manifest)
    manifest["motherFinal"] = mother
    if mother["verdict"] != "PASS":
        base._set_stage(
            manifest,
            "S06_MOTHER_SEMANTIC_FINAL",
            "HOLD",
            "correction review passed but mother final still has findings",
        )
        manifest["status"] = "MANUAL_REVIEW_REQUIRED"
        manifest["currentStage"] = "S06_MOTHER_SEMANTIC_FINAL"
        manifest["codes"] = sorted(
            set(manifest.get("codes", []) + ["STAGED_MOTHER_SOLUTION_FINDINGS"])
        )
        if isinstance(cycle_record, dict):
            cycle_record["status"] = "MOTHER_HOLD"
        base._append_event(
            manifest,
            "ADAPTIVE_CORRECTION_MOTHER_HOLD",
            cycle=cycle,
        )
        return

    base._set_stage(
        manifest,
        "S06_MOTHER_SEMANTIC_FINAL",
        "PASS",
        "correction cycle passed whole-exam solution and visual gate",
    )
    manifest["status"] = "READY_FOR_ASSEMBLY"
    manifest["currentStage"] = "S07_ASSEMBLY"
    loop["status"] = "READY_FOR_ASSEMBLY"
    base._append_event(
        manifest,
        "ADAPTIVE_CORRECTION_CYCLE_COMPLETE",
        cycle=cycle,
    )


def _adaptive_advance(run_dir: Path, manifest: dict[str, Any]) -> None:
    """Baseline stage reducer with only the review-2 policy replaced."""

    if manifest.get("status") in {
        "FAILED",
        "BLOCKED",
        "MANUAL_REVIEW_REQUIRED",
        "READY_FOR_MANUAL_REVIEW",
        "DRAFT_PACKAGED",
        "RENDERED_PACKAGED",
    }:
        return
    if (
        manifest.get("currentStage") == "S02_ROUND1_GENERATION"
        and base._stage_complete(manifest, "S02_ROUND1_GENERATION")
    ):
        base._set_stage(
            manifest,
            "S02_ROUND1_GENERATION",
            "PASS",
            "all round1 batches accepted",
        )
        base._create_review1_tasks(run_dir, manifest)
        _refresh_task_packets(run_dir, manifest)
        manifest["status"] = "REVIEW1_RUNNING"
        manifest["currentStage"] = "S03_REVIEW1"
        base._append_event(
            manifest,
            "STAGED_REVIEW1_STARTED",
            batchCount=len(manifest["batches"]),
        )
    if (
        manifest.get("currentStage") == "S03_REVIEW1"
        and base._stage_complete(manifest, "S03_REVIEW1")
    ):
        base._set_stage(
            manifest,
            "S03_REVIEW1",
            "PASS",
            "all first independent reviews accepted",
        )
        base._create_revision_tasks(run_dir, manifest)
        _refresh_task_packets(run_dir, manifest)
        manifest["status"] = "REVISION_RUNNING"
        manifest["currentStage"] = "S04_REVISION"
        base._append_event(manifest, "STAGED_REVISION_STARTED")
    if (
        manifest.get("currentStage") == "S04_REVISION"
        and base._stage_complete(manifest, "S04_REVISION")
    ):
        base._set_stage(
            manifest,
            "S04_REVISION",
            "PASS",
            "all revisions accepted or explicitly skipped",
        )
        _create_adaptive_review2_tasks(run_dir, manifest)
        _refresh_task_packets(run_dir, manifest)
        manifest["status"] = "REVIEW2_RUNNING"
        manifest["currentStage"] = "S05_REVIEW2"
        base._append_event(
            manifest,
            "STAGED_REVIEW2_STARTED",
            batchCount=len(manifest["batches"]),
            policy=ADAPTIVE_REVIEW_POLICY,
        )
    if (
        manifest.get("currentStage") == ADAPTIVE_CORRECTION_STAGE
        and base._stage_complete(manifest, ADAPTIVE_CORRECTION_STAGE)
    ):
        base._set_stage(
            manifest,
            ADAPTIVE_CORRECTION_STAGE,
            "PASS",
            "all adaptive correction candidates accepted",
        )
        _create_adaptive_correction_review_tasks(run_dir, manifest)
        _refresh_task_packets(run_dir, manifest)
        manifest["status"] = "CORRECTION_REVIEW_RUNNING"
        manifest["currentStage"] = ADAPTIVE_CORRECTION_REVIEW_STAGE
        base._append_event(
            manifest,
            "ADAPTIVE_CORRECTION_REVIEW_STARTED",
            cycle=manifest.get("correctionLoop", {}).get("activeCycle"),
        )
    if (
        manifest.get("currentStage") == ADAPTIVE_CORRECTION_REVIEW_STAGE
        and base._stage_complete(manifest, ADAPTIVE_CORRECTION_REVIEW_STAGE)
    ):
        _complete_adaptive_correction_review(run_dir, manifest)
    if (
        manifest.get("currentStage") == "S05_REVIEW2"
        and base._stage_complete(manifest, "S05_REVIEW2")
    ):
        all_pass = all(
            item.get("verdict") == "PASS"
            and item.get("answerMatch") is True
            and item.get("solutionReview", {}).get("verdict") == "PASS"
            and item.get("solutionReview", {}).get("studentCanFollow") is True
            for batch in manifest["batches"].values()
            for item in batch.get("review2", {}).get("items", [])
        )
        if all_pass:
            base._set_stage(
                manifest,
                "S05_REVIEW2",
                "PASS",
                "all adaptive final review records passed",
            )
            mother = base._run_mother_semantic_final(run_dir, manifest)
            manifest["motherFinal"] = mother
            if mother["verdict"] == "PASS":
                base._set_stage(
                    manifest,
                    "S06_MOTHER_SEMANTIC_FINAL",
                    "PASS",
                    "whole-exam solution quality and visual coverage passed",
                )
                manifest["status"] = "READY_FOR_ASSEMBLY"
                manifest["currentStage"] = "S07_ASSEMBLY"
                base._append_event(manifest, "STAGED_READY_FOR_ASSEMBLY")
            else:
                base._set_stage(
                    manifest,
                    "S06_MOTHER_SEMANTIC_FINAL",
                    "HOLD",
                    "mother final solution review requires manual decision",
                )
                manifest["status"] = "MANUAL_REVIEW_REQUIRED"
                manifest["codes"] = sorted(
                    set(
                        manifest.get("codes", [])
                        + ["STAGED_MOTHER_SOLUTION_FINDINGS"]
                    )
                )
                base._append_event(manifest, "STAGED_MOTHER_FINAL_HOLD")
        else:
            base._set_stage(
                manifest,
                "S05_REVIEW2",
                "HOLD",
                "adaptive final review requires manual decision",
            )
            manifest["status"] = "MANUAL_REVIEW_REQUIRED"
            manifest["codes"] = sorted(
                set(manifest.get("codes", []) + ["STAGED_FINAL_REVIEW_FINDINGS"])
            )
            base._append_event(manifest, "STAGED_FINAL_REVIEW_HOLD")


def reconcile_adaptive_staged_run(
    store: base.StagedRunStore,
    run_id: str,
) -> dict[str, Any]:
    """Reconcile through the adaptive reducer without changing baseline code."""

    original_advance = base._advance
    original_normalize_draft = base._normalize_draft_batch
    original_candidate_for_review = base._candidate_for_review
    original_record_rejection = base._record_rejection
    original_visual_element_infer = solution_quality.infer_solution_visual_elements
    base._advance = _adaptive_advance
    base._normalize_draft_batch = _adaptive_normalize_draft_batch
    base._candidate_for_review = _adaptive_candidate_for_review
    base._record_rejection = _adaptive_record_rejection
    solution_quality.infer_solution_visual_elements = _adaptive_infer_solution_visual_elements
    try:
        result = base.reconcile_staged_run(store, run_id)
    finally:
        base._advance = original_advance
        base._normalize_draft_batch = original_normalize_draft
        base._candidate_for_review = original_candidate_for_review
        base._record_rejection = original_record_rejection
        solution_quality.infer_solution_visual_elements = original_visual_element_infer
    result["workflowProfile"] = ADAPTIVE_PROFILE
    result["reviewPolicy"] = ADAPTIVE_REVIEW_POLICY
    return result


def build_adaptive_status(
    store: base.StagedRunStore,
    run_id: str,
) -> dict[str, Any]:
    status = base.build_staged_status(store, run_id)
    status["workflowProfile"] = ADAPTIVE_PROFILE
    status["reviewPolicy"] = ADAPTIVE_REVIEW_POLICY
    manifest = store.load(run_id)
    current_stage = manifest.get("currentStage")
    filtered_queue: list[dict[str, Any]] = []
    pending_agent_items: list[dict[str, Any]] = []
    dispatched_agent_count = 0
    for item in status.get("queue", []):
        task_id = item.get("taskId") if isinstance(item, dict) else None
        task = manifest.get("tasks", {}).get(task_id) if isinstance(task_id, str) else None
        if (
            isinstance(task, dict)
            and item.get("kind") in {"AGENT_TASK", "AGENT_WAIT"}
            and task.get("stage") != current_stage
        ):
            continue
        if item.get("kind") == "AGENT_WAIT":
            dispatched_agent_count += 1
            filtered_queue.append(item)
            continue
        if item.get("kind") == "AGENT_TASK":
            pending_agent_items.append(item)
            continue
        filtered_queue.append(item)
    pending_window = max(0, ADAPTIVE_MAX_CONCURRENT_TASKS - dispatched_agent_count)
    filtered_queue.extend(pending_agent_items[:pending_window])
    status["queue"] = filtered_queue
    status["dispatchWindow"] = {
        "maxConcurrentTasks": ADAPTIVE_MAX_CONCURRENT_TASKS,
        "dispatchedCurrentStage": dispatched_agent_count,
        "visiblePendingCurrentStage": min(len(pending_agent_items), pending_window),
        "hiddenPendingCurrentStage": max(0, len(pending_agent_items) - pending_window),
    }
    visual_pending = manifest.get("visualInspection", {}).get("status") == "PENDING"
    if (
        visual_pending
        and current_stage == "S01A_VISUAL_RECON"
        and manifest.get("status") == "BLOCKED"
    ):
        status["queue"].append(
            {
                "kind": "RECORD_SOURCE_VISUAL_INSPECTION",
                "implemented": True,
                "path": ADAPTIVE_VISUAL_INSPECTION_PATH,
                "requiredOrdinals": manifest.get("visualInspection", {}).get(
                    "requiredOrdinals", []
                ),
            }
        )
    if (
        manifest.get("status") == "MANUAL_REVIEW_REQUIRED"
        and manifest.get("currentStage")
        in {
            "S05_REVIEW2",
            "S06_MOTHER_SEMANTIC_FINAL",
            "S08_RENDER_REVIEW",
            ADAPTIVE_CORRECTION_REVIEW_STAGE,
        }
    ):
        loop = manifest.get("correctionLoop", {})
        status.setdefault("queue", []).append(
            {
                "kind": "CORRECTION_START",
                "implemented": True,
                "nextCycle": loop.get("nextCycle", 1),
                "maxCycles": loop.get("maxCycles", ADAPTIVE_MAX_CORRECTION_CYCLES),
                "pendingOrdinals": sorted(
                    {
                        int(item.get("ordinal", 0))
                        for batch in manifest.get("batches", {}).values()
                        for item in batch.get("review2", {}).get("items", [])
                        if not _review_item_passes(item)
                    }
                    | set(
                        _coerce_positive_ordinals(
                            manifest.get("renderFailure", {}).get("affectedOrdinals"),
                            int(manifest["request"]["expectedQuestionCount"]),
                        )
                        if isinstance(manifest.get("renderFailure"), dict)
                        else []
                    )
                ),
            }
        )
    return status


def resolve_adaptive_manual_review(
    store: base.StagedRunStore,
    run_id: str,
    resolution_path: Path,
) -> dict[str, Any]:
    """Keep the legacy parent-resolution escape hatch method-locked."""

    manifest = store.load(run_id)
    resolution = base._json_file(resolution_path.resolve())
    mappings = resolution.get("batches")
    if isinstance(mappings, dict):
        run_dir = store.run_dir(run_id)
        for mapping in mappings.values():
            if not isinstance(mapping, dict):
                continue
            candidate_relative = mapping.get("candidatePath")
            if not isinstance(candidate_relative, str):
                continue
            candidate = base._json_file(
                base._inside(run_dir, run_dir / candidate_relative)
            )
            findings = lint_candidate_methods(manifest, candidate)
            if findings:
                ordinals = [str(item.get("ordinal")) for item in findings]
                raise base.StagedExamError(
                    "adaptive method gate failed during parent resolution for "
                    + ", ".join(f"q{o}" for o in ordinals)
                )
    return base.resolve_staged_manual_review(store, run_id, resolution_path)


def assemble_adaptive_exam(
    root: Path,
    store: base.StagedRunStore,
    run_id: str,
    title: str,
) -> dict[str, Any]:
    """Assemble with the baseline serializer and annotate the experiment."""

    manifest = base.assemble_staged_exam(root, store, run_id, title)
    run_dir = store.run_dir(run_id)
    report_path = run_dir / "final/review-report.json"
    report = base._json_file(report_path)
    report["workflowProfile"] = ADAPTIVE_PROFILE
    report["reviewPolicy"] = ADAPTIVE_REVIEW_POLICY
    report["reviewMode"] = (
        "independent_batch_plus_delta_review_and_student_solution_walkthrough"
    )
    method_snapshot = manifest.get("methodProfiles", {})
    report["methodGate"] = {
        "gate": "QUESTION_METHOD_PROFILE_HARD_LOCK",
        "status": method_snapshot.get("status") if isinstance(method_snapshot, dict) else "MISSING",
        "snapshotSha256": method_snapshot.get("snapshotSha256") if isinstance(method_snapshot, dict) else None,
        "profileCount": len(method_snapshot.get("profiles", {})) if isinstance(method_snapshot, dict) and isinstance(method_snapshot.get("profiles"), dict) else 0,
    }
    atomic_write_json(report_path, report)
    manifest = store.load(run_id)
    if isinstance(manifest.get("assembly"), dict):
        manifest["assembly"]["workflowProfile"] = ADAPTIVE_PROFILE
        manifest["assembly"]["reviewPolicy"] = ADAPTIVE_REVIEW_POLICY
    manifest["experiment"] = {
        **manifest.get("experiment", {}),
        "assembled": True,
        "productionPublication": "NOT_PUBLISHED",
        "methodGate": report["methodGate"],
    }
    store.save(run_id, manifest)
    return manifest


def _external_review_package_for_run(
    store: base.StagedRunStore,
    manifest: dict[str, Any],
    package_path: Path,
) -> dict[str, Any]:
    """Build the mandatory compact external-review ZIP for a closed Run.

    The internal staged package is intentionally verbose.  External review
    receives a derived two-lane package containing only the original/similar
    JS files and referenced SVG/PNG assets, written directly to the durable
    result root so a session file index can discover it.
    """

    from .similar_identity import (
        canonicalize_result_package,
        external_review_package,
    )

    request = manifest.get("request") if isinstance(manifest.get("request"), dict) else {}
    source_file = request.get("sourceFile")
    if not isinstance(source_file, str) or not source_file.strip():
        raise base.StagedExamError("external review requires a locked sourceFile")

    # Locate the repository root from the locked source rather than assuming a
    # particular runtime override layout.  This keeps temporary test Runs and
    # alternate local runtime roots self-contained.
    root: Path | None = None
    for candidate in store.runtime_root.parents:
        if (candidate / source_file).is_file():
            root = candidate
            break
    if root is None:
        raise base.StagedExamError(
            f"external review source is not inside the runtime repository: {source_file}"
        )

    run_dir = store.run_dir(manifest["runId"])
    canonical_path = run_dir / "final/canonical-similar-exam-package.zip"
    result_root = store.runtime_root.parent / "results"
    result_root.mkdir(parents=True, exist_ok=True)
    run_suffix = str(manifest["runId"])[-8:]
    external_path = result_root / f"external-review-{run_suffix}.zip"

    canonical = canonicalize_result_package(
        root,
        package_path,
        canonical_path,
        source_file,
        display_title=request.get("query") if isinstance(request.get("query"), str) else None,
    )
    external = external_review_package(root, canonical_path, external_path, source_file)

    with zipfile.ZipFile(external_path, "r") as archive:
        if archive.testzip() is not None:
            raise base.StagedExamError("external review ZIP round-trip failed")
        names = [info.filename for info in archive.infolist() if not info.is_dir()]
    bad_extensions = sorted(
        {
            Path(name).suffix.lower()
            for name in names
            if Path(name).suffix.lower() not in {".js", ".svg", ".png"}
        }
    )
    if bad_extensions:
        raise base.StagedExamError(
            "external review ZIP contains unsupported files: "
            + ", ".join(bad_extensions)
        )
    if not names or not any(name.startswith("original/") for name in names) or not any(
        name.startswith("similar/") for name in names
    ):
        raise base.StagedExamError("external review ZIP must contain original and similar lanes")

    try:
        output_relative = external_path.relative_to(root).as_posix()
    except ValueError as error:
        raise base.StagedExamError("external review output escaped the repository result root") from error
    return {
        **external,
        "output": output_relative,
        "sha256": sha256_file(external_path),
        "memberCount": len(names),
        "memberExtensions": sorted({Path(name).suffix.lower() for name in names}),
        "canonicalIdentity": canonical.get("identity"),
        "canonicalPackage": canonical_path.relative_to(run_dir).as_posix(),
        "sessionHandoff": "alive/runtime/results",
    }


def package_adaptive_exam(
    store: base.StagedRunStore,
    run_id: str,
) -> dict[str, Any]:
    """Package adaptive evidence, including its method and visual gates."""

    manifest = store.load(run_id)
    run_dir = store.run_dir(run_id)
    method_snapshot = _ensure_method_snapshot(run_dir, manifest)
    if method_snapshot.get("status") != "READY":
        raise base.StagedExamError("adaptive package requires a READY method profile snapshot")
    required_visuals = _required_visual_ordinals(manifest)
    if required_visuals and manifest.get("visualInspection", {}).get("status") != "PASS":
        raise base.StagedExamError("adaptive package requires source visual inspection evidence")
    manifest["methodProfiles"] = method_snapshot
    store.save(run_id, manifest)
    manifest = base.package_staged_exam(store, run_id)
    package_path = run_dir / "final/alive-staged-exam-pack.zip"
    extra_members = [ADAPTIVE_METHOD_PROFILE_PATH]
    if (run_dir / ADAPTIVE_VISUAL_INSPECTION_PATH).is_file():
        extra_members.append(ADAPTIVE_VISUAL_INSPECTION_PATH)
    with zipfile.ZipFile(package_path, "a", compression=zipfile.ZIP_DEFLATED) as archive:
        existing = set(archive.namelist())
        for relative in extra_members:
            if relative not in existing:
                archive.write(run_dir / relative, arcname=relative)
    with zipfile.ZipFile(package_path, "r") as archive:
        if archive.testzip() is not None:
            raise base.StagedExamError("adaptive package ZIP round-trip failed")
    package_report_path = run_dir / "final/package-report.json"
    report = base._json_file(package_report_path)
    report["members"] = sorted(set(report.get("members", []) + extra_members))
    report["adaptiveArtifacts"] = extra_members
    report["zipSha256"] = sha256_file(package_path)
    try:
        external_review = _external_review_package_for_run(
            store, manifest, package_path
        )
    except Exception as error:
        failed = store.load(run_id)
        failed["status"] = "FAILED"
        failed["codes"] = sorted(
            set(failed.get("codes", [])) | {"EXTERNAL_REVIEW_PACKAGE_REQUIRED"}
        )
        failed["externalReview"] = {
            "status": "FAIL",
            "error": str(error),
        }
        store.save(run_id, failed)
        raise base.StagedExamError(
            "external review package is mandatory: " + str(error)
        ) from error
    report["externalReviewPackage"] = external_review
    atomic_write_json(package_report_path, report)
    manifest = store.load(run_id)
    manifest["package"] = report
    manifest["externalReview"] = external_review
    manifest["experiment"] = {
        **manifest.get("experiment", {}),
        "packageArtifacts": extra_members,
    }
    store.save(run_id, manifest)
    return manifest
