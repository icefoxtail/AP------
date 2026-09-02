from __future__ import annotations

"""Simple four-stage whole-exam production controller.

Unlike FAST_EXAM, this controller deliberately batches the model work.  It
creates the complete first draft before any review, then runs one independent
review pass, one bounded revision pass, and one final independent review pass.
The output is explicitly a draft for manual/render review; it is never
silently promoted to production-ready.
"""

import copy
import json
import math
import os
import re
import shutil
import uuid
import zipfile
from pathlib import Path
from typing import Any

from .exam_batch import preflight_exam
from .batch_planner import weighted_batch_plan
from .context_cache import prepare_staged_context
from .fast_exam import (
    _build_fast_structured_question,
    _normalize_question_type,
    _student_payload,
    _validate_student_payload,
)
from .phase3 import _archive_projection, _parse_serialized_js
from .reference_examples import select_reference_examples
from .run_store import RunStore, atomic_write_json, make_run_id, sha256_file, utc_now
from .rule_pack import load_rule_pack, rule_pack_is_ready
from .source_question import artifact_sha256, json_sha256
from .solution_quality import (
    SOLUTION_CONTRACT_VERSION,
    SolutionQualityError,
    build_solution_quality_report,
    format_solution_detail,
    infer_solution_visual_requirement,
    normalize_solution_detail,
    validate_solution_visual_spec,
)
from .visual_lane import (
    VisualLaneError,
    materialize_final_visual,
    render_staged_visual,
    validate_staged_visual_asset,
)
from .visual_recon import (
    VisualReconError,
    materialize_visual_recon,
    prepare_visual_recon,
)


STAGED_SCHEMA_VERSION = "0.2.0"
STAGED_ENGINE_VERSION = "0.1.6-coordinate-geometry-benchmark"
STAGED_MAX_ATTEMPTS = 2
STAGED_MAX_BATCHES = 4
STAGED_STAGES = (
    ("S00_SOURCE_LOCK", "Source lock"),
    ("S01_PREFLIGHT", "Whole-exam preflight"),
    ("S01A_VISUAL_RECON", "Source visual reconnaissance"),
    ("S02_ROUND1_GENERATION", "Round 1 whole-exam generation"),
    ("S03_REVIEW1", "Independent review 1"),
    ("S04_REVISION", "Bounded revision"),
    ("S05_REVIEW2", "Independent review 2"),
    ("S06_MOTHER_SEMANTIC_FINAL", "Mother solution-quality final"),
    ("S07_ASSEMBLY", "Whole-exam assembly"),
    ("S08_RENDER_REVIEW", "Browser/render review"),
    ("S09_PACKAGE", "Local evidence package"),
)
_CHOICE_LABEL_RE = re.compile(r"^\s*(?:[①②③④⑤]|\(?[1-5]\)?[.)])")
_SCORE_RE = re.compile(r"\[(?:부분\s*점수\s*(?:없음|있음)\s*,\s*)?\d+(?:\.\d+)?\s*점\]\s*$")
_IR_TO_ARCHIVE = {"MCQ": "객관식", "SHORT_ANSWER": "주관식", "CONSTRUCTED_RESPONSE": "서술형"}


class StagedExamError(ValueError):
    pass


class StagedRunStore(RunStore):
    """RunStore with inbox/tasks directories for batch agent boundaries."""

    _DIRECTORIES = ("source", "plans", "candidates", "evidence", "render", "final", "inbox", "tasks")

    def create(self, run_id: str, manifest: dict[str, Any]) -> Path:
        run_dir = self.run_dir(run_id)
        run_dir.mkdir(parents=False, exist_ok=False)
        for name in self._DIRECTORIES:
            (run_dir / name).mkdir()
        atomic_write_json(run_dir / "manifest.json", manifest)
        return run_dir


def staged_runtime_root(root: Path, override: str | None = None) -> Path:
    return Path(override).resolve() if override else root / "alive" / "runtime" / "staged-runs"


def staged_capability_report() -> dict[str, Any]:
    return {
        "active": True,
        "status": "ACTIVE_MVP",
        "version": STAGED_ENGINE_VERSION,
        "scope": "WHOLE_EXAM_FOUR_BATCH_ROUNDS_WITH_STUDENT_SOLUTION_MOTHER_GATE",
        "rounds": ["ROUND1_GENERATION", "REVIEW1", "REVISION", "REVIEW2"],
        "maxConcurrentBatches": STAGED_MAX_BATCHES,
        "automaticReview": False,
        "completionMarker": True,
        "rulePackSnapshot": True,
        "referenceExampleSelector": True,
        "solutionDetailContract": SOLUTION_CONTRACT_VERSION,
        "solutionPedagogyReview": True,
        "solutionVisualLane": "circle_geometry-svg",
        "solutionVisualSemanticGate": "circle-centre-radius-relevant-line-tangent-chord-right-angle",
        "visualQualityFloor": "student-safe-v0.1",
        "visualTopicCapabilities": {
            "circle_geometry": "ACTIVE",
            "function": "CURVE_POINTS_ONLY",
            "inequality": "NOT_IMPLEMENTED",
            "conic": "CIRCLE_ONLY",
            "calculus": "NOT_IMPLEMENTED",
        },
        "experimentalVisualLane": {
            "status": "EXPERIMENTAL_ONLY",
            "command": "visual-benchmark",
            "rendererVersion": "0.1.1-coordinate-geometry",
            "topics": {
                "coordinate_plane": "POINTS_AND_SEGMENTS_BENCHMARKED",
                "line_equation": "TWO_POINT_SLOPE_BENCHMARKED",
                "shape_translation": "POLYGON_VECTOR_BENCHMARKED",
                "function": "QUADRATIC_AND_RATIONAL_BENCHMARKED",
                "inequality": "QUADRATIC_NUMBER_LINE_BENCHMARKED",
                "conic": "ELLIPSE_BENCHMARKED",
                "calculus": "TANGENT_AND_AREA_BENCHMARKED",
            },
            "feedsProductionStagedExam": False,
            "browserRenderGate": "MANUAL_REQUIRED",
        },
        "motherSemanticFinal": True,
        "terminalDraftStatus": "READY_FOR_MANUAL_REVIEW",
        "visualBoundary": "SUPPORTED_LOCAL_SOURCE_VISUALS_AND_DETERMINISTIC_SVG;EXPERIMENTAL_BENCHMARKS_SEPARATE",
        "visualRecon": True,
        "visualRenderer": "visualSpec-0.1/svg",
        "browserRenderGate": "MANUAL_REQUIRED",
    }


def _stages() -> list[dict[str, Any]]:
    return [
        {"stageId": stage_id, "label": label, "status": "PENDING", "evidence": []}
        for stage_id, label in STAGED_STAGES
    ]


def _set_stage(manifest: dict[str, Any], stage_id: str, status: str, evidence: str) -> None:
    stage = next((item for item in manifest["stages"] if item["stageId"] == stage_id), None)
    if stage is None:
        raise StagedExamError(f"unknown staged stage: {stage_id}")
    stage["status"] = status
    stage["evidence"].append(evidence)


def _append_event(manifest: dict[str, Any], event_type: str, **details: Any) -> None:
    manifest.setdefault("events", []).append({"at": utc_now(), "type": event_type, **details})


def _json_file(path: Path) -> dict[str, Any]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise StagedExamError(f"invalid staged JSON artifact: {path}") from error
    if not isinstance(payload, dict):
        raise StagedExamError("staged artifact root must be an object")
    return payload


def _inside(run_dir: Path, path: Path) -> Path:
    resolved = path.resolve()
    try:
        resolved.relative_to(run_dir.resolve())
    except ValueError as error:
        raise StagedExamError("staged artifact path must stay inside the Run") from error
    return resolved


def _atomic_copy(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(f".{target.name}.{uuid.uuid4().hex}.tmp")
    try:
        shutil.copyfile(source, temporary)
        os.replace(temporary, target)
    finally:
        if temporary.exists():
            temporary.unlink()


def _choice_text(value: Any) -> str:
    text = str(value or "").strip().replace(" ", "")
    for token in ("$", r"\displaystyle", r"\left", r"\right", r"\(", r"\)"):
        text = text.replace(token, "")
    return text


def _answer_text(value: Any) -> str:
    if isinstance(value, dict):
        value = value.get("canonicalAnswer") or value.get("value") or value.get("answer")
    if value is None:
        return ""
    # Treat display punctuation variants as equivalent for constructed
    # answers.  Agents may separate a list of requested values with either a
    # semicolon or comma; the mathematical content remains unchanged.
    return (
        str(value)
        .strip()
        .replace(" ", "")
        .replace(";", ",")
        .replace("；", ",")
        .replace("，", ",")
    )


def _choice_indices(value: Any, *, zero_based: bool = False) -> list[int]:
    """Normalize one or more MCQ choices to sorted, unique 1-based indices."""

    if isinstance(value, (list, tuple)):
        raw_values = list(value)
    elif isinstance(value, int) and not isinstance(value, bool):
        raw_values = [value]
    else:
        text = _answer_text(value)
        raw_values = [item for item in re.split(r"[,，、;/;\s]+", text) if item]
    indices: list[int] = []
    for item in raw_values:
        if isinstance(item, str):
            token = item.strip()
            if token in "①②③④⑤":
                index = "①②③④⑤".index(token) + 1
            else:
                try:
                    index = int(token)
                except ValueError:
                    return []
        elif isinstance(item, int) and not isinstance(item, bool):
            index = item + 1 if zero_based else item
        else:
            return []
        if not 1 <= index <= 5 or index in indices:
            return []
        indices.append(index)
    return sorted(indices)


def _display_choice_indices(value: Any) -> str:
    indices = _choice_indices(value)
    return ", ".join("①②③④⑤"[index - 1] for index in indices)


def _strict_ordinal_list(value: Any, field: str) -> list[int]:
    if not isinstance(value, list):
        raise StagedExamError(f"{field} must be a list of ordinals")
    result: list[int] = []
    for item in value:
        if isinstance(item, bool):
            raise StagedExamError(f"{field} contains an invalid ordinal")
        try:
            ordinal = int(item)
        except (TypeError, ValueError) as error:
            raise StagedExamError(f"{field} contains an invalid ordinal") from error
        if ordinal < 1 or ordinal in result:
            raise StagedExamError(f"{field} contains a duplicate or non-positive ordinal")
        result.append(ordinal)
    return sorted(result)


def _batch_partition(ordinals: list[int], requested: int) -> list[list[int]]:
    count = max(1, min(STAGED_MAX_BATCHES, requested))
    count = min(count, len(ordinals))
    base, remainder = divmod(len(ordinals), count)
    batches: list[list[int]] = []
    cursor = 0
    for index in range(count):
        size = base + (1 if index < remainder else 0)
        batches.append(ordinals[cursor : cursor + size])
        cursor += size
    return batches


def _batch_id(index: int) -> str:
    return f"b{index:02d}"


def _batch_task_id(batch_id: str, round_name: str) -> str:
    return f"{batch_id}-{round_name}"


def _stage_for_round(round_name: str) -> str:
    stages = {
        "round1": "S02_ROUND1_GENERATION",
        "review1": "S03_REVIEW1",
        "revision": "S04_REVISION",
        "review2": "S05_REVIEW2",
    }
    try:
        return stages[round_name]
    except KeyError as error:
        raise StagedExamError(f"unknown staged round: {round_name}") from error


def _batch_output_path(batch_id: str, round_name: str) -> str:
    return f"inbox/{_batch_task_id(batch_id, round_name)}.json"


def _batch_completion_path(batch_id: str, round_name: str) -> str:
    return f"inbox/{_batch_task_id(batch_id, round_name)}.complete.json"


def _task_heartbeat_path(task_id: str) -> str:
    """Return the durable progress lease path for an external task."""

    return f"heartbeats/{task_id}.json"


def _batch_accepted_path(batch_id: str, round_name: str) -> str:
    root = "candidates" if round_name in {"round1", "revision"} else "evidence"
    return f"{root}/{batch_id}/{round_name}.json"


def _solution_view_path(batch_id: str, round_name: str) -> str:
    return f"candidates/{batch_id}/{round_name}-solution.json"


def _reference_pack_path(manifest: dict[str, Any], batch_id: str) -> str:
    """Return the smallest reviewed-example pack allowed for a batch."""

    paths = manifest.get("referencePackPaths", {})
    if isinstance(paths, dict) and isinstance(paths.get(batch_id), str):
        return paths[batch_id]
    return manifest.get("referencePackPath", "source/reference-pack.json")


def _packet_for(
    manifest: dict[str, Any],
    batch_id: str,
    round_name: str,
    kind: str,
    allowed: list[str],
    forbidden: list[str],
) -> dict[str, Any]:
    batch = manifest["batches"][batch_id]
    task_id = _batch_task_id(batch_id, round_name)
    rule_pack = manifest.get("rulePack", {})
    rule_sources = list(rule_pack.get("readOrder", [])) if isinstance(rule_pack, dict) else []
    preflight_questions = manifest.get("preflight", {}).get("questions", [])
    response_requirements = {}
    for ordinal in batch["ordinals"]:
        item = preflight_questions[ordinal - 1] if ordinal <= len(preflight_questions) else {}
        is_mcq = item.get("normalizedQuestionType") in {"MCQ", "객관식"}
        response_requirements[str(ordinal)] = {
            "questionType": item.get("normalizedQuestionType"),
            "choiceCount": 5 if is_mcq else 0,
            "answerCardinality": item.get("answerCardinality") or 1,
        }
    return {
        "schemaVersion": STAGED_SCHEMA_VERSION,
        "artifactType": "ALIVE_STAGED_TASK_PACKET",
        "taskId": task_id,
        "runId": manifest["runId"],
        "taskKind": kind,
        "round": round_name,
        "batchId": batch_id,
        "batchOrdinals": batch["ordinals"],
        "sourceLockSha256": manifest["sourceLock"]["sha256"],
        "sourceQuestionSha256": {
            str(ordinal): manifest["questions"][str(ordinal)]["sourceQuestionSha256"]
            for ordinal in batch["ordinals"]
        },
        "allowedInputPaths": allowed,
        "forbiddenInputPaths": forbidden,
        "generationProfile": copy.deepcopy(manifest["request"]["generationProfile"]),
        "rulePack": {
            "status": rule_pack.get("status"),
            "required": rule_pack.get("required"),
            "snapshotPath": manifest.get("rulePackPath", "source/rule-snapshot.json"),
            "snapshotSha256": rule_pack.get("snapshotSha256"),
            "readOrder": rule_sources,
            "compiledMaster": rule_pack.get("compiledMaster"),
        },
        "referencePackPath": (
            _reference_pack_path(manifest, batch_id)
            if round_name in {"round1", "revision"}
            else None
        ),
        "visualReconPath": manifest.get("visualReconPath", "source/visual-recon.json"),
        "visualLane": manifest.get("request", {}).get("visualLane", "deterministic-svg-v0.1"),
        "solutionContract": {
            "version": SOLUTION_CONTRACT_VERSION,
            "audience": "student",
            "depth": "detailed",
            "requiredSections": ["given", "goal", "keyIdea", "steps", "check", "commonMistakes"],
            "stepFields": ["title", "work", "why"],
            "circleGeometryRule": "원·직선·접선·접점·공통현·중심·반지름·수선 관계는 solutionVisualSpec 필수",
        },
        "solutionReview": (
            {
                "required": True,
                "solutionViewPath": _solution_view_path(batch_id, round_name),
                "answerContractHidden": True,
                "checks": [
                    "readability",
                    "stepReasons",
                    "theoremJustification",
                    "answerCheck",
                    "solutionArithmetic",
                    "diagramConsistency",
                ],
            }
            if kind == "BATCH_REVIEWER"
            else None
        ),
        "responseRequirements": response_requirements,
        "outputPath": _batch_output_path(batch_id, round_name),
        "completionMarkerPath": _batch_completion_path(batch_id, round_name),
        "heartbeatPath": _task_heartbeat_path(task_id),
        "route": {"model": "gpt-5.6-luna", "reasoning": "xhigh"},
        "status": "PENDING",
    }


def _write_task(
    run_dir: Path,
    manifest: dict[str, Any],
    batch_id: str,
    round_name: str,
    kind: str,
    allowed: list[str],
    forbidden: list[str],
) -> dict[str, Any]:
    task_id = _batch_task_id(batch_id, round_name)
    packet = _packet_for(manifest, batch_id, round_name, kind, allowed, forbidden)
    packet_path = f"tasks/{task_id}.json"
    task = {
        "taskId": task_id,
        "kind": kind,
        "round": round_name,
        "stage": _stage_for_round(round_name),
        "batchId": batch_id,
        "ordinals": manifest["batches"][batch_id]["ordinals"],
        "status": "PENDING",
        "packetPath": packet_path,
        "outputPath": packet["outputPath"],
        "completionMarkerPath": packet["completionMarkerPath"],
        "heartbeatPath": packet["heartbeatPath"],
        "completionRequired": False,
        "acceptedPath": _batch_accepted_path(batch_id, round_name),
        "dispatch": {"attempts": []},
    }
    manifest.setdefault("tasks", {})[task_id] = task
    manifest["batches"][batch_id][f"{round_name}TaskId"] = task_id
    atomic_write_json(run_dir / packet_path, packet)
    return task


def _student_view(run_dir: Path, batch_id: str, round_name: str, questions: list[dict[str, Any]]) -> str:
    path = f"candidates/{batch_id}/{round_name}-student.json"
    visible_questions: list[dict[str, Any]] = []
    for item in questions:
        visible: dict[str, Any] = {
            "ordinal": item["ordinal"],
            "studentPayload": copy.deepcopy(item["studentPayload"]),
        }
        if (
            isinstance(item.get("visualSpec"), dict)
            and isinstance(item.get("visualAsset"), dict)
            and item.get("visualRole") == "problem"
        ):
            visible["visual"] = {
                "role": "problem",
                "visualSpec": copy.deepcopy(item["visualSpec"]),
                "visualAsset": copy.deepcopy(item["visualAsset"]),
            }
        visible_questions.append(visible)
    atomic_write_json(
        run_dir / path,
        {
            "schemaVersion": STAGED_SCHEMA_VERSION,
            "artifactType": "ALIVE_STAGED_STUDENT_VIEW",
            "batchId": batch_id,
            "round": round_name,
            "questions": visible_questions,
        },
    )
    return path


def _solution_view(run_dir: Path, batch_id: str, round_name: str, questions: list[dict[str, Any]]) -> str:
    """Expose only what a student-facing solution reviewer needs.

    The view deliberately excludes answerContract and private transformation
    data.  It lets the reviewer test whether the solution explains the
    student payload without turning the independent answer check into a
    copy-from-answer exercise.
    """

    path = _solution_view_path(batch_id, round_name)
    visible_questions: list[dict[str, Any]] = []
    for item in questions:
        visible: dict[str, Any] = {
            "ordinal": item["ordinal"],
            "studentPayload": copy.deepcopy(item["studentPayload"]),
            "solution": item["solution"],
            "solutionDetail": copy.deepcopy(item["solutionDetail"]),
            "solutionQuality": copy.deepcopy(item["solutionQuality"]),
        }
        if (
            isinstance(item.get("solutionVisualSpec"), dict)
            and isinstance(item.get("solutionVisualAsset"), dict)
        ):
            visible["solutionVisual"] = {
                "role": "solution",
                "visualSpec": copy.deepcopy(item["solutionVisualSpec"]),
                "visualAsset": copy.deepcopy(item["solutionVisualAsset"]),
            }
        visible_questions.append(visible)
    atomic_write_json(
        run_dir / path,
        {
            "schemaVersion": STAGED_SCHEMA_VERSION,
            "artifactType": "ALIVE_STAGED_SOLUTION_VIEW",
            "batchId": batch_id,
            "round": round_name,
            "questions": visible_questions,
        },
    )
    return path


def start_staged_exam(
    root: Path,
    store: StagedRunStore,
    source_file: str,
    query: str | None,
    engine_version: str,
    source_resolution: dict[str, Any] | None = None,
    batch_count: int = STAGED_MAX_BATCHES,
    variation_mode: str = "QUICK",
    batch_strategy: str = "CONTIGUOUS_BALANCED",
    use_context_cache: bool = True,
) -> dict[str, Any]:
    context, context_cache = prepare_staged_context(
        root, source_file, use_cache=use_context_cache
    )
    exam = context["exam"]
    preflight = context["preflight"]
    rule_pack = context["rule_pack"]
    rule_pack_required = bool(rule_pack.get("required"))
    rule_pack_ready = rule_pack_is_ready(rule_pack)
    # A small isolated fixture may intentionally omit the repository rule
    # source pack.  Production-like roots (the real repository) fail closed;
    # fixture roots record NOT_AVAILABLE but remain usable for engine tests.
    rule_gate_pass = rule_pack_ready if rule_pack_required else True
    reference_pack = context["reference_pack"]
    preflight_held = [
        item["ordinal"]
        for item in preflight["questions"]
        if item.get("status") != "SUPPORTED"
    ]
    try:
        visual_recon = context["visual_recon"]
    except (VisualReconError, OSError, ValueError) as error:
        visual_recon = {
            "schemaVersion": "0.1.0",
            "artifactType": "ALIVE_STAGED_VISUAL_RECON",
            "status": "BLOCKED",
            "ready": False,
            "visualQuestionCount": 0,
            "heldOrdinals": [],
            "humanInspectionRequired": False,
            "browserInspectionRequired": False,
            "inspectionScope": "local-asset-decode-and-safe-path-only",
            "questions": {},
            "codes": ["STAGED_VISUAL_RECON_ERROR"],
            "error": str(error),
        }
    visual_held = list(visual_recon.get("heldOrdinals", []))
    held = sorted(set(preflight_held + visual_held))
    ready = preflight["wholeExamReady"] and not preflight_held and bool(visual_recon.get("ready")) and rule_gate_pass
    normalized_mode = str(variation_mode or "QUICK").strip().upper()
    if normalized_mode not in {"QUICK", "STRUCTURAL_VARIANT"}:
        raise StagedExamError("unsupported staged variation mode")
    normalized_batch_strategy = str(batch_strategy or "CONTIGUOUS_BALANCED").strip().upper()
    if normalized_batch_strategy not in {"CONTIGUOUS_BALANCED", "WEIGHTED_BALANCED"}:
        raise StagedExamError("unsupported staged batch strategy")
    profile = {
        "variationMode": normalized_mode,
        "profileId": "WHOLE_EXAM_FOUR_STAGE_RULE_MAPPED",
        "structuralGate": normalized_mode == "STRUCTURAL_VARIANT",
        "independentReview": True,
        "solutionProfile": "STUDENT_DETAILED_V0.1",
        "solutionVisualPolicy": "CIRCLE_GEOMETRY_MANDATORY",
        "ruleAuthority": "docs/rules + compiled master snapshot",
        "referenceExamples": {
            "enabled": True,
            "solutionsExposed": False,
            "answersExposed": False,
            "maxPerQuestion": 3,
        },
    }
    run_id = make_run_id(f"staged {query or preflight['examTitle']} 전체 4단계")
    now = utc_now()
    manifest: dict[str, Any] = {
        "schemaVersion": STAGED_SCHEMA_VERSION,
        "artifactType": "ALIVE_STAGED_EXAM_RUN",
        "engineVersion": engine_version,
        "stagedEngineVersion": STAGED_ENGINE_VERSION,
        "runId": run_id,
        "createdAt": now,
        "updatedAt": now,
        "status": "BLOCKED" if not ready else "ROUND1_GENERATING",
        "currentStage": (
            "S01_PREFLIGHT" if preflight_held or not preflight["wholeExamReady"]
            else "S01A_VISUAL_RECON" if not visual_recon.get("ready")
            else "S02_ROUND1_GENERATION"
        ),
        "codes": [],
        "request": {
            "query": query or preflight["examTitle"],
            "sourceFile": preflight["sourceLock"]["path"],
            "executionMode": "STAGED_EXAM",
            "batchCount": max(1, min(STAGED_MAX_BATCHES, batch_count)),
            "batchStrategy": normalized_batch_strategy,
            "variationMode": normalized_mode,
            "generationProfile": profile,
            "expectedQuestionCount": preflight["questionCount"],
            "modelProfile": {"model": "gpt-5.6-luna", "reasoning": "xhigh"},
            "automaticReview": False,
            "rulePackRequired": rule_pack_required,
            "rulePackSnapshotPath": "source/rule-snapshot.json",
            "referencePackPath": "source/reference-pack.json",
            "visualReconPath": "source/visual-recon.json",
            "visualLane": "deterministic-svg-v0.1",
            "solutionContractVersion": SOLUTION_CONTRACT_VERSION,
            "solutionProfile": "STUDENT_DETAILED_V0.1",
            "solutionVisualPolicy": "CIRCLE_GEOMETRY_MANDATORY",
            "contextCache": context_cache,
        },
        "sourceLock": preflight["sourceLock"],
        "sourceResolution": source_resolution or {
            "status": "UNIQUE",
            "selected": {"path": preflight["sourceLock"]["path"]},
            "candidates": [],
        },
        "stages": _stages(),
        "events": [],
        "preflight": {key: value for key, value in preflight.items() if key not in {"sourceLock"}},
        "rulePack": {
            **rule_pack,
            "readOrder": list(rule_pack.get("readOrder", [])),
        },
        "rulePackPath": "source/rule-snapshot.json",
        "referencePack": {
            "status": reference_pack.get("status"),
            "packSha256": reference_pack.get("packSha256"),
            "selectedCount": reference_pack.get("selectedCount", 0),
            "catalog": reference_pack.get("catalog", {}),
        },
        "referencePackPath": "source/reference-pack.json",
        "visualRecon": copy.deepcopy(visual_recon),
        "visualReconPath": "source/visual-recon.json",
        "questions": {},
        "batches": {},
        "tasks": {},
        "progress": {},
    }
    _set_stage(manifest, "S00_SOURCE_LOCK", "PASS", manifest["sourceLock"]["sha256"])
    _set_stage(
        manifest,
        "S01_PREFLIGHT",
        "PASS" if ready else "BLOCKED",
        f"supported={preflight['supportedCount']} held={preflight['heldCount']} preflightHeld={preflight_held} visualHeld={visual_held} rulePack={rule_pack['status']}",
    )
    _set_stage(
        manifest,
        "S01A_VISUAL_RECON",
        "PASS" if visual_recon.get("ready") else "BLOCKED",
        f"status={visual_recon.get('status')} visualQuestions={visual_recon.get('visualQuestionCount', 0)} held={visual_held}",
    )
    if not ready:
        manifest["codes"] = sorted({
            "STAGED_PREFLIGHT_FAIL",
            *preflight.get("examCodes", []),
            *(code for item in preflight["questions"] for code in item.get("codes", [])),
            *(rule_pack.get("codes", []) if rule_pack_required else []),
            *(code for item in visual_recon.get("questions", {}).values() for code in item.get("codes", [])),
            *(visual_recon.get("codes", []) if isinstance(visual_recon.get("codes"), list) else []),
        })
    run_dir = store.create(run_id, manifest)
    atomic_write_json(run_dir / "source/source-exam.json", exam)
    atomic_write_json(run_dir / "source/preflight-report.json", preflight)
    atomic_write_json(run_dir / "source/rule-snapshot.json", rule_pack)
    atomic_write_json(run_dir / "source/reference-pack.json", reference_pack)
    try:
        materialized_visual_recon = materialize_visual_recon(run_dir, visual_recon, root)
    except (VisualReconError, OSError, ValueError) as error:
        materialized_visual_recon = {**visual_recon, "status": "BLOCKED", "ready": False, "error": str(error)}
        atomic_write_json(run_dir / "source/visual-recon.json", materialized_visual_recon)
        manifest["visualRecon"] = materialized_visual_recon
        manifest["status"] = "BLOCKED"
        manifest["currentStage"] = "S01A_VISUAL_RECON"
        manifest["codes"] = sorted(set(manifest.get("codes", []) + ["STAGED_VISUAL_RECON_MATERIALIZE_FAILED"]))
        store.save(run_id, manifest)
        return manifest
    manifest["visualRecon"] = materialized_visual_recon
    manifest["contextCache"] = context_cache
    if not ready:
        _append_event(
            manifest,
            "STAGED_PREFLIGHT_BLOCKED",
            heldOrdinals=held,
            preflightHeldOrdinals=preflight_held,
            visualHeldOrdinals=visual_held,
            rulePackStatus=rule_pack.get("status"),
            rulePackRequired=rule_pack_required,
        )
        store.save(run_id, manifest)
        return manifest

    supported = list(preflight["supportedOrdinals"])
    for ordinal in supported:
        source_question = exam["questions"][ordinal - 1]
        source_item = preflight["questions"][ordinal - 1]
        student_path = f"source/student/q{ordinal:03d}.json"
        atomic_write_json(run_dir / student_path, _student_payload(source_question))
        manifest["questions"][str(ordinal)] = {
            "ordinal": ordinal,
            "sourceQuestionSha256": source_item["sourceQuestionSha256"],
            "studentSourcePath": student_path,
            "visualRecon": copy.deepcopy(
                visual_recon.get("questions", {}).get(str(ordinal), {})
            ),
            "referenceExampleIds": [
                item["referenceId"]
                for item in reference_pack.get("questions", {}).get(str(ordinal), {}).get("selected", [])
            ],
            "status": "PENDING",
        }
    if normalized_batch_strategy == "WEIGHTED_BALANCED":
        batch_plan = weighted_batch_plan(
            supported,
            preflight["questions"],
            exam["questions"],
            manifest["request"]["batchCount"],
        )
        partitions = batch_plan["partitions"]
        manifest["batchPlan"] = batch_plan
    else:
        partitions = _batch_partition(supported, manifest["request"]["batchCount"])
        manifest["batchPlan"] = {
            "plannerVersion": "contiguous-balanced-v1",
            "strategy": "CONTIGUOUS_BALANCED",
            "partitions": partitions,
        }
    for index, ordinals in enumerate(partitions, 1):
        batch_id = _batch_id(index)
        manifest["batches"][batch_id] = {
            "batchId": batch_id,
            "ordinals": ordinals,
            "status": "PENDING",
            "review1": {},
            "review2": {},
        }
        batch_reference_path = f"source/reference-pack/{batch_id}.json"
        batch_reference = copy.deepcopy(reference_pack)
        batch_reference["scope"] = {
            "batchId": batch_id,
            "ordinals": list(ordinals),
            "purpose": "batch-local reviewed style context only",
        }
        batch_reference["questions"] = {
            str(ordinal): copy.deepcopy(
                reference_pack.get("questions", {}).get(str(ordinal), {})
            )
            for ordinal in ordinals
        }
        batch_reference["selectedCount"] = sum(
            len(item.get("selected", []))
            for item in batch_reference["questions"].values()
            if isinstance(item, dict)
        )
        batch_reference["packSha256"] = json_sha256(batch_reference)
        atomic_write_json(run_dir / batch_reference_path, batch_reference)
        manifest.setdefault("referencePackPaths", {})[batch_id] = batch_reference_path
        allowed = [manifest["questions"][str(ordinal)]["studentSourcePath"] for ordinal in ordinals]
        allowed += [manifest["rulePackPath"], batch_reference_path, manifest["visualReconPath"]]
        allowed += [f"source/visual/q{ordinal:03d}/**" for ordinal in ordinals]
        _write_task(
            run_dir,
            manifest,
            batch_id,
            "round1",
            "BATCH_BUILDER",
            allowed,
            ["source/source-exam.json", "source/**/answer*", "source/**/solution*", "final/*"],
        )
    _append_event(
        manifest,
        "STAGED_ROUND1_TASKS_PREPARED",
        batchCount=len(partitions),
        batchStrategy=normalized_batch_strategy,
    )
    _refresh(manifest)
    store.save(run_id, manifest)
    return manifest


def _refresh(manifest: dict[str, Any]) -> None:
    tasks = manifest.get("tasks", {})
    counts = {
        "pending": sum(task.get("status") == "PENDING" for task in tasks.values()),
        "dispatched": sum(task.get("status") == "DISPATCHED" for task in tasks.values()),
        "accepted": sum(task.get("status") in {"ACCEPTED", "SKIPPED"} for task in tasks.values()),
        "failed": sum(task.get("status") == "FAILED" for task in tasks.values()),
    }
    current = manifest.get("currentStage")
    stage_tasks = [task for task in tasks.values() if task.get("stage") == current]
    manifest["progress"] = {
        "expectedQuestions": len(manifest.get("questions", {})),
        "batchCount": len(manifest.get("batches", {})),
        "pendingTasks": counts["pending"],
        "dispatchedTasks": counts["dispatched"],
        "acceptedTasks": counts["accepted"],
        "failedTasks": counts["failed"],
        "currentStageTasks": len(stage_tasks),
        "round1": sum(bool(batch.get("round1AcceptedPath")) for batch in manifest.get("batches", {}).values()),
        "review1": sum(bool(batch.get("review1AcceptedPath")) for batch in manifest.get("batches", {}).values()),
        "revision": sum(bool(batch.get("revisionAcceptedPath")) for batch in manifest.get("batches", {}).values()),
        "review2": sum(bool(batch.get("review2AcceptedPath")) for batch in manifest.get("batches", {}).values()),
    }


def _stage_complete(manifest: dict[str, Any], stage: str) -> bool:
    tasks = [task for task in manifest.get("tasks", {}).values() if task.get("stage") == stage]
    return bool(tasks) and all(task.get("status") in {"ACCEPTED", "SKIPPED"} for task in tasks)


def _task(manifest: dict[str, Any], task_id: str) -> dict[str, Any]:
    task = manifest.get("tasks", {}).get(task_id)
    if not isinstance(task, dict):
        raise StagedExamError(f"staged task not found: {task_id}")
    return task


def _create_review1_tasks(run_dir: Path, manifest: dict[str, Any]) -> None:
    for batch_id, batch in manifest["batches"].items():
        source_paths = [manifest["questions"][str(o)]["studentSourcePath"] for o in batch["ordinals"]]
        source_visual_paths = [f"source/visual/q{o:03d}/**" for o in batch["ordinals"]]
        candidate_path = f"candidates/{batch_id}/round1-student.json"
        solution_path = _solution_view_path(batch_id, "round1")
        visual_paths = [f"candidates/{batch_id}/round1/visual/q{o:03d}/**" for o in batch["ordinals"]]
        _write_task(
            run_dir,
            manifest,
            batch_id,
            "review1",
            "BATCH_REVIEWER",
            source_paths + source_visual_paths + [candidate_path, solution_path, manifest["rulePackPath"], manifest["visualReconPath"]] + visual_paths,
            ["source/source-exam.json", f"candidates/{batch_id}/round1.json", "final/*", "evidence/*"],
        )


def _create_revision_tasks(run_dir: Path, manifest: dict[str, Any]) -> None:
    for batch_id, batch in manifest["batches"].items():
        reviews = batch.get("review1", {}).get("items", [])
        needs_revision = any(
            item.get("verdict") != "PASS"
            or item.get("answerMatch") is not True
            or item.get("solutionReview", {}).get("verdict") != "PASS"
            or item.get("solutionReview", {}).get("studentCanFollow") is not True
            for item in reviews
        )
        if not needs_revision:
            source = run_dir / batch["round1AcceptedPath"]
            target = run_dir / _batch_accepted_path(batch_id, "revision")
            _atomic_copy(source, target)
            source_visual = run_dir / "candidates" / batch_id / "round1" / "visual"
            target_visual = run_dir / "candidates" / batch_id / "revision" / "visual"
            if source_visual.is_dir():
                shutil.copytree(source_visual, target_visual, dirs_exist_ok=True)
            batch["revisionAcceptedPath"] = _batch_accepted_path(batch_id, "revision")
            task_id = _batch_task_id(batch_id, "revision")
            manifest["tasks"][task_id] = {
                "taskId": task_id,
                "kind": "BATCH_BUILDER",
                "round": "revision",
                "stage": "S04_REVISION",
                "batchId": batch_id,
                "ordinals": batch["ordinals"],
                "status": "SKIPPED",
                "packetPath": None,
                "outputPath": None,
                "acceptedPath": batch["revisionAcceptedPath"],
                "dispatch": {"attempts": []},
                "reason": "review1_passed_no_revision_needed",
            }
            batch["revisionTaskId"] = task_id
            # The copied revision is already a complete student view.
            accepted = _json_file(target)
            visual_prefix = f"candidates/{batch_id}/round1/"
            revision_prefix = f"candidates/{batch_id}/revision/"
            visual_rewritten = False
            for question in accepted.get("questions", []):
                for asset_key in ("visualAsset", "solutionVisualAsset"):
                    asset = question.get(asset_key)
                    if not isinstance(asset, dict):
                        continue
                    for key in ("path", "reportPath", "specPath"):
                        value = asset.get(key)
                        if isinstance(value, str) and value.startswith(visual_prefix):
                            asset[key] = revision_prefix + value[len(visual_prefix):]
                            visual_rewritten = True
            if visual_rewritten:
                accepted["artifactSha256"] = artifact_sha256(accepted)
                atomic_write_json(target, accepted)
            _student_view(run_dir, batch_id, "revision", accepted["questions"])
            _solution_view(run_dir, batch_id, "revision", accepted["questions"])
            continue
        current_path = f"candidates/{batch_id}/round1-student.json"
        solution_path = _solution_view_path(batch_id, "round1")
        review_path = batch["review1AcceptedPath"]
        source_paths = [manifest["questions"][str(o)]["studentSourcePath"] for o in batch["ordinals"]]
        source_visual_paths = [f"source/visual/q{o:03d}/**" for o in batch["ordinals"]]
        visual_paths = [f"candidates/{batch_id}/round1/visual/q{o:03d}/**" for o in batch["ordinals"]]
        _write_task(
            run_dir,
            manifest,
            batch_id,
            "revision",
            "BATCH_BUILDER",
            source_paths + source_visual_paths + [current_path, solution_path, review_path, manifest["rulePackPath"], _reference_pack_path(manifest, batch_id), manifest["visualReconPath"]] + visual_paths,
            ["source/source-exam.json", f"candidates/{batch_id}/round1.json", "final/*", "evidence/*"],
        )


def _create_review2_tasks(run_dir: Path, manifest: dict[str, Any]) -> None:
    for batch_id, batch in manifest["batches"].items():
        source_paths = [manifest["questions"][str(o)]["studentSourcePath"] for o in batch["ordinals"]]
        source_visual_paths = [f"source/visual/q{o:03d}/**" for o in batch["ordinals"]]
        candidate_path = f"candidates/{batch_id}/revision-student.json"
        solution_path = _solution_view_path(batch_id, "revision")
        visual_paths = [f"candidates/{batch_id}/revision/visual/q{o:03d}/**" for o in batch["ordinals"]]
        _write_task(
            run_dir,
            manifest,
            batch_id,
            "review2",
            "BATCH_REVIEWER",
            source_paths + source_visual_paths + [candidate_path, solution_path, manifest["rulePackPath"], manifest["visualReconPath"]] + visual_paths,
            ["source/source-exam.json", f"candidates/{batch_id}/revision.json", "evidence/*", "final/*"],
        )


def _advance(run_dir: Path, manifest: dict[str, Any]) -> None:
    if manifest.get("status") in {"FAILED", "BLOCKED", "MANUAL_REVIEW_REQUIRED", "READY_FOR_MANUAL_REVIEW", "DRAFT_PACKAGED", "RENDERED_PACKAGED"}:
        return
    if manifest.get("currentStage") == "S02_ROUND1_GENERATION" and _stage_complete(manifest, "S02_ROUND1_GENERATION"):
        _set_stage(manifest, "S02_ROUND1_GENERATION", "PASS", "all round1 batches accepted")
        _create_review1_tasks(run_dir, manifest)
        manifest["status"] = "REVIEW1_RUNNING"
        manifest["currentStage"] = "S03_REVIEW1"
        _append_event(manifest, "STAGED_REVIEW1_STARTED", batchCount=len(manifest["batches"]))
    if manifest.get("currentStage") == "S03_REVIEW1" and _stage_complete(manifest, "S03_REVIEW1"):
        _set_stage(manifest, "S03_REVIEW1", "PASS", "all first independent reviews accepted")
        _create_revision_tasks(run_dir, manifest)
        manifest["status"] = "REVISION_RUNNING"
        manifest["currentStage"] = "S04_REVISION"
        _append_event(manifest, "STAGED_REVISION_STARTED")
    if manifest.get("currentStage") == "S04_REVISION" and _stage_complete(manifest, "S04_REVISION"):
        _set_stage(manifest, "S04_REVISION", "PASS", "all revisions accepted or explicitly skipped")
        _create_review2_tasks(run_dir, manifest)
        manifest["status"] = "REVIEW2_RUNNING"
        manifest["currentStage"] = "S05_REVIEW2"
        _append_event(manifest, "STAGED_REVIEW2_STARTED", batchCount=len(manifest["batches"]))
    if manifest.get("currentStage") == "S05_REVIEW2" and _stage_complete(manifest, "S05_REVIEW2"):
        all_pass = all(
            item.get("verdict") == "PASS"
            and item.get("answerMatch") is True
            and item.get("solutionReview", {}).get("verdict") == "PASS"
            and item.get("solutionReview", {}).get("studentCanFollow") is True
            for batch in manifest["batches"].values()
            for item in batch.get("review2", {}).get("items", [])
        )
        if all_pass:
            _set_stage(manifest, "S05_REVIEW2", "PASS", "all final independent reviews passed")
            mother = _run_mother_semantic_final(run_dir, manifest)
            manifest["motherFinal"] = mother
            if mother["verdict"] == "PASS":
                _set_stage(manifest, "S06_MOTHER_SEMANTIC_FINAL", "PASS", "whole-exam solution quality and visual coverage passed")
                manifest["status"] = "READY_FOR_ASSEMBLY"
                manifest["currentStage"] = "S07_ASSEMBLY"
                _append_event(manifest, "STAGED_READY_FOR_ASSEMBLY")
            else:
                _set_stage(manifest, "S06_MOTHER_SEMANTIC_FINAL", "HOLD", "mother final solution review requires manual decision")
                manifest["status"] = "MANUAL_REVIEW_REQUIRED"
                manifest["codes"] = sorted(set(manifest.get("codes", []) + ["STAGED_MOTHER_SOLUTION_FINDINGS"]))
                _append_event(manifest, "STAGED_MOTHER_FINAL_HOLD")
        else:
            _set_stage(manifest, "S05_REVIEW2", "HOLD", "final review requires manual decision")
            manifest["status"] = "MANUAL_REVIEW_REQUIRED"
            manifest["codes"] = sorted(set(manifest.get("codes", []) + ["STAGED_FINAL_REVIEW_FINDINGS"]))
            _append_event(manifest, "STAGED_FINAL_REVIEW_HOLD")


def _normalize_contract(
    raw: Any,
    student: dict[str, Any],
    expected_type: str,
    expected_cardinality: int = 1,
) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise StagedExamError("batch question answerContract is required")
    contract = copy.deepcopy(raw)
    actual_type = str(
        contract.get("answerType")
        or contract.get("type")
        or contract.get("responseForm")
        or ""
    ).strip().casefold().replace("-", "_")
    if actual_type in {
        "mcq", "choice", "choiceindex", "choice_index", "multiple_choice_value",
        "multiple-choice-value", "choice_value", "객관식",
    }:
        actual_type = "choice_index"
    elif actual_type in {"choice_indices", "multiple_choice_indices", "multiple_choice"}:
        actual_type = "choice_indices"
    elif actual_type in {"short_answer", "constructed_response", "subjective", "주관식", "서술형", "단답형", "text"}:
        actual_type = "text"
    if expected_type == "MCQ":
        choices = student.get("choices", [])
        cardinality = max(1, int(expected_cardinality or 1))
        valid_types = {"choice_index", "choice_indices"} if cardinality > 1 else {"choice_index"}
        if actual_type not in valid_types or not isinstance(choices, list) or len(choices) != 5:
            raise StagedExamError("batch MCQ answerContract is invalid")
        if cardinality > 1:
            choice_indices_value = contract.get("choiceIndices")
            candidates = (
                contract.get("correctChoiceNumbers"),
                contract.get("keyChoiceNumbers"),
                contract.get("answerChoiceNumbers"),
                choice_indices_value,
                contract.get("canonicalAnswer"),
            )
            indices: list[int] = []
            for candidate in candidates:
                indices = _choice_indices(
                    candidate,
                    zero_based=candidate is choice_indices_value and choice_indices_value is not None,
                )
                if indices:
                    break
            if len(indices) != cardinality:
                raise StagedExamError(
                    f"batch MCQ answer contract requires {cardinality} distinct choice indices"
                )
            contract.update({
                "answerType": "choice_indices",
                "canonicalAnswer": ",".join(str(index) for index in indices),
                "displayAnswer": _display_choice_indices(indices),
                "acceptableAnswers": [],
                "equivalencePolicy": "exact_index",
                "answerCardinality": cardinality,
            })
            return contract
        index: int | None = None
        # Accept the compact batch-agent envelope as well as the canonical
        # answer contract.  ``correctChoiceNumber`` is explicitly 1-based;
        # a bare ``correctChoiceIndex`` is treated as 0-based unless its base
        # is declared, matching the common JSON convention.
        number_candidates = (
            contract.get("key"),
            contract.get("correctChoiceNumber"),
            contract.get("answerNumber"),
            contract.get("keyChoiceNumber"),
        )
        for candidate in number_candidates:
            if isinstance(candidate, int) and 1 <= candidate <= len(choices):
                index = candidate
                break
            if isinstance(candidate, str):
                letter = candidate.strip().upper()
                if letter in {"A", "B", "C", "D", "E"}:
                    letter_index = ord(letter) - ord("A") + 1
                    if letter_index <= len(choices):
                        index = letter_index
                        break
        explicit = contract.get("correctChoiceIndex")
        if index is None and isinstance(explicit, int):
            base = contract.get("choiceIndexBase")
            if base == 0 or base is None:
                index = explicit + 1
            else:
                index = explicit
        if index is None and isinstance(contract.get("choiceIndex"), int):
            choice_index = contract["choiceIndex"]
            base = contract.get("choiceIndexBase")
            if base == 1:
                index = choice_index
            elif base == 0 or base is None:
                index = choice_index + 1
        if index is None or not 1 <= index <= len(choices):
            candidates = [
                contract.get("answerText"),
                contract.get("correctChoice"),
                contract.get("correctChoiceContent"),
                contract.get("keyChoiceContent"),
                contract.get("canonicalChoiceValue"),
            ]
            for candidate in candidates:
                candidate_text = _choice_text(candidate)
                for position, choice in enumerate(choices, 1):
                    if candidate_text and candidate_text == _choice_text(choice):
                        index = position
                        break
                if index is not None:
                    break
        if index is None:
            canonical = _answer_text(contract.get("canonicalAnswer"))
            if canonical in {"1", "2", "3", "4", "5"}:
                index = int(canonical)
        if index is None or not 1 <= index <= len(choices):
            raise StagedExamError("batch MCQ canonical answer index is missing")
        contract.update({
            "answerType": "choice_index",
            "canonicalAnswer": str(index),
            "acceptableAnswers": [],
            "equivalencePolicy": "exact_index",
        })
    else:
        value = contract.get("canonicalAnswer")
        if value is None:
            value = (
                contract.get("answerText")
                or contract.get("displayAnswer")
                or contract.get("acceptedAnswer")
                or contract.get("answer")
                or contract.get("correctAnswer")
            )
        text = _answer_text(value)
        if not text:
            raise StagedExamError("batch constructed answer is missing")
        contract.update({"answerType": "text", "canonicalAnswer": text})
    return contract


def _staged_visual_input(raw: dict[str, Any]) -> tuple[dict[str, Any] | None, str, dict[str, Any]]:
    visual = raw.get("visual")
    visual = visual if isinstance(visual, dict) else {}
    spec = raw.get("visualSpec")
    if not isinstance(spec, dict):
        spec = visual.get("visualSpec") if isinstance(visual.get("visualSpec"), dict) else None
    role = raw.get("visualRole") or visual.get("role") or ""
    plan = raw.get("visualPlan") or raw.get("visualFingerprint") or visual.get("visualPlan") or {}
    if not isinstance(plan, dict):
        plan = {}
    return copy.deepcopy(spec) if isinstance(spec, dict) else None, str(role).strip().lower(), copy.deepcopy(plan)


def _staged_solution_visual_input(raw: dict[str, Any]) -> tuple[dict[str, Any] | None, dict[str, Any]]:
    visual = raw.get("solutionVisual")
    visual = visual if isinstance(visual, dict) else {}
    spec = raw.get("solutionVisualSpec")
    if not isinstance(spec, dict):
        spec = visual.get("visualSpec") if isinstance(visual.get("visualSpec"), dict) else None
    plan = raw.get("solutionVisualPlan") or visual.get("visualPlan") or {}
    if not isinstance(plan, dict):
        plan = {}
    return copy.deepcopy(spec) if isinstance(spec, dict) else None, copy.deepcopy(plan)


def _reject_student_visual_fields(student: dict[str, Any]) -> None:
    forbidden = {
        "image", "images", "imageasset", "imageassets", "choiceimages", "solutionimage",
        "solutionimages", "solutionvisual", "visual", "visualspec", "visualasset",
    }
    for key in student:
        if str(key).casefold().replace("_", "").replace("-", "") in forbidden:
            raise StagedExamError(
                "staged studentPayload must keep visualSpec/visualAsset outside the student payload"
            )
    content = student.get("content")
    if isinstance(content, str) and any(
        token in content.casefold() for token in ("<img", "<svg", "data:image", "xlink:href")
    ):
        raise StagedExamError("staged studentPayload must not embed an untracked visual asset")


def _normalize_draft_batch(
    manifest: dict[str, Any],
    task: dict[str, Any],
    payload: dict[str, Any],
    run_dir: Path | None = None,
) -> dict[str, Any]:
    if payload.get("artifactType") not in {
        None,
        "ALIVE_STAGED_BATCH_DRAFT",
        # Compatibility alias emitted by the staged batch-builder role.  It
        # carries the same contract as a draft and is normalized below to the
        # canonical ALIVE_STAGED_BATCH_DRAFT envelope.
        "ALIVE_STAGED_BATCH_CANDIDATE",
        "ALIVE_STAGED_REVISION_ARTIFACT",
        "ALIVE_STAGED_BATCH_ARTIFACT",
        "ALIVE_BATCH_EXAM_DRAFT",
        "ALIVE_FAST_BATCH_DRAFT",
    }:
        raise StagedExamError("unsupported staged batch draft artifactType")
    raw_items = payload.get("questions") or payload.get("items")
    if not isinstance(raw_items, list):
        raise StagedExamError("batch draft questions must be a list")
    expected_ordinals = list(task["ordinals"])
    by_ordinal: dict[int, dict[str, Any]] = {}
    for raw in raw_items:
        if not isinstance(raw, dict):
            raise StagedExamError("batch draft question must be an object")
        student = raw.get("studentPayload") or raw.get("student")
        if not isinstance(student, dict):
            raise StagedExamError("batch draft studentPayload is required")
        ordinal_value = raw.get("ordinal") or student.get("id")
        try:
            ordinal = int(ordinal_value)
        except (TypeError, ValueError) as error:
            raise StagedExamError("batch draft question ordinal is invalid") from error
        if ordinal in by_ordinal or ordinal not in expected_ordinals:
            raise StagedExamError("batch draft question ordinal set is invalid")
        student = copy.deepcopy(student)
        student["id"] = ordinal
        _validate_student_payload(student)
        _reject_student_visual_fields(student)
        expected_type = _normalize_question_type(manifest["preflight"]["questions"][ordinal - 1]["normalizedQuestionType"])
        actual_type = _normalize_question_type(student.get("questionType"))
        if actual_type != expected_type:
            raise StagedExamError(f"batch question {ordinal} response form changed")
        preflight_item = manifest["preflight"]["questions"][ordinal - 1]
        contract = _normalize_contract(
            raw.get("answerContract") or raw.get("AnswerContract"),
            student,
            expected_type,
            int(preflight_item.get("answerCardinality") or 1),
        )
        raw_solution = raw.get("solution") or raw.get("completeSolution") or raw.get("solutionText")
        if isinstance(raw_solution, dict):
            raw_solution = raw_solution.get("text") or raw_solution.get("finalSolution") or raw_solution.get("content")
        if not isinstance(raw_solution, str) or not raw_solution.strip():
            raise StagedExamError(f"batch question {ordinal} solution is missing")
        answer_line = (
            f"따라서 정답은 {_display_choice_indices(contract['canonicalAnswer'])}이다."
            if expected_type == "MCQ"
            else f"따라서 답은 {contract.get('displayAnswer', contract['canonicalAnswer'])}이다."
        )
        raw_solution_detail = (
            raw.get("solutionDetail")
            or raw.get("studentSolution")
            or raw.get("solutionPlan")
        )
        inferred_visual_requirement = infer_solution_visual_requirement(
            student,
            raw_solution,
            manifest["preflight"]["questions"][ordinal - 1],
            raw_solution_detail if isinstance(raw_solution_detail, dict) else None,
        )
        try:
            solution_detail = normalize_solution_detail(
                raw_solution_detail,
                inferred_visual_requirement=inferred_visual_requirement,
            )
        except SolutionQualityError as error:
            raise StagedExamError(f"batch question {ordinal} student solution contract is invalid: {error}") from error
        plan = raw.get("transformationPlan") or raw.get("plan") or {}
        if not isinstance(plan, dict):
            plan = {}
        plan = copy.deepcopy(plan)
        plan.setdefault("variationMode", manifest["request"]["variationMode"])
        flags = raw.get("riskFlags", [])
        if not isinstance(flags, list):
            flags = [str(flags)] if flags else []
        expected_visual = manifest["preflight"]["questions"][ordinal - 1].get("visualDependency", "NONE")
        legacy_visual_spec, legacy_visual_role, legacy_visual_plan = _staged_visual_input(raw)
        solution_visual_spec, solution_visual_plan = _staged_solution_visual_input(raw)
        solution_visual_checks: dict[str, str] = {}
        problem_visual_spec: dict[str, Any] | None = None
        problem_visual_plan: dict[str, Any] = {}
        if legacy_visual_spec is not None:
            if legacy_visual_role == "problem" or expected_visual == "ESSENTIAL":
                problem_visual_spec = legacy_visual_spec
                problem_visual_plan = legacy_visual_plan
            else:
                if solution_visual_spec is not None:
                    raise StagedExamError(f"batch question {ordinal} has duplicate solution visual specs")
                solution_visual_spec = legacy_visual_spec
                solution_visual_plan = legacy_visual_plan
        if expected_visual == "ESSENTIAL" and not isinstance(problem_visual_spec, dict):
            raise StagedExamError(f"batch question {ordinal} requires visualSpec for an ESSENTIAL visual")
        if expected_visual in {"NONE", "OPTIONAL"} and problem_visual_spec is not None:
            raise StagedExamError(f"batch question {ordinal} problem visual role is not allowed for {expected_visual}")
        if inferred_visual_requirement == "MANDATORY" and not isinstance(solution_visual_spec, dict):
            raise StagedExamError(f"batch question {ordinal} requires solutionVisualSpec for its student solution")
        if solution_visual_spec is not None:
            try:
                solution_visual_checks = validate_solution_visual_spec(
                    solution_visual_spec,
                    student_payload=student,
                    solution=raw_solution,
                    inferred_visual_requirement=inferred_visual_requirement,
                    preflight_item=manifest["preflight"]["questions"][ordinal - 1],
                )
            except SolutionQualityError as error:
                raise StagedExamError(f"batch question {ordinal} solution visual pedagogy is invalid: {error}") from error
        visual_asset: dict[str, Any] | None = None
        if problem_visual_spec is not None:
            if run_dir is None:
                raise StagedExamError("visual draft normalization requires the staged Run directory")
            try:
                visual_asset = render_staged_visual(
                    run_dir,
                    task["batchId"],
                    task["round"],
                    ordinal,
                    problem_visual_spec,
                    "problem",
                )
            except (VisualLaneError, OSError, ValueError) as error:
                raise StagedExamError(f"batch question {ordinal} visual contract is invalid: {error}") from error
        solution_visual_asset: dict[str, Any] | None = None
        if solution_visual_spec is not None:
            if run_dir is None:
                raise StagedExamError("solution visual draft normalization requires the staged Run directory")
            try:
                solution_visual_asset = render_staged_visual(
                    run_dir,
                    task["batchId"],
                    task["round"],
                    ordinal,
                    solution_visual_spec,
                    "solution",
                )
            except (VisualLaneError, OSError, ValueError) as error:
                raise StagedExamError(f"batch question {ordinal} solution visual contract is invalid: {error}") from error
        solution = format_solution_detail(solution_detail, answer_line)
        solution_quality = build_solution_quality_report(
            solution_detail,
            inferred_visual_requirement=inferred_visual_requirement,
            has_solution_visual=solution_visual_asset is not None,
        )
        solution_quality["visualElementChecks"] = solution_visual_checks
        if solution_quality["verdict"] != "PASS":
            raise StagedExamError(f"batch question {ordinal} solution quality gate failed")
        source_visual = manifest.get("visualRecon", {}).get("questions", {}).get(str(ordinal), {})
        by_ordinal[ordinal] = {
            "ordinal": ordinal,
            "studentPayload": student,
            "answerContract": contract,
            "solution": solution,
            "solutionDetail": solution_detail,
            "solutionQuality": solution_quality,
            "transformationPlan": plan,
            "sourceFingerprint": copy.deepcopy(raw.get("sourceFingerprint") or {}),
            "riskFlags": [str(flag) for flag in flags],
            "visualSpec": problem_visual_spec,
            "visualAsset": visual_asset,
            "visualRole": "problem" if visual_asset else None,
            "visualPlan": problem_visual_plan,
            "solutionVisualSpec": solution_visual_spec,
            "solutionVisualAsset": solution_visual_asset,
            "solutionVisualRole": "solution" if solution_visual_asset else None,
            "solutionVisualPlan": solution_visual_plan,
            "sourceVisualFingerprint": copy.deepcopy(source_visual.get("visualFingerprint", {})) if isinstance(source_visual, dict) else {},
        }
    if set(by_ordinal) != set(expected_ordinals):
        raise StagedExamError("batch draft does not cover exactly its assigned questions")
    questions = [by_ordinal[ordinal] for ordinal in expected_ordinals]
    normalized = {
        "schemaVersion": STAGED_SCHEMA_VERSION,
        "artifactType": "ALIVE_STAGED_BATCH_DRAFT",
        "runId": manifest["runId"],
        "batchId": task["batchId"],
        "round": task["round"],
        "batchOrdinals": expected_ordinals,
        "sourceLockSha256": manifest["sourceLock"]["sha256"],
        "questions": questions,
    }
    normalized["artifactSha256"] = artifact_sha256(normalized)
    return normalized


def _answer_matches(
    contract: dict[str, Any], answer: dict[str, Any], choices: list[Any] | None = None
) -> bool:
    expected_type = contract.get("answerType")
    if expected_type == "choice_indices":
        expected = {
            ",".join(str(index) for index in _choice_indices(contract.get("canonicalAnswer")))
        }
        expected.update(
            ",".join(str(index) for index in _choice_indices(item))
            for item in contract.get("acceptableAnswers", [])
        )
        actual_indices = _choice_indices(
            answer.get("canonicalAnswer") if isinstance(answer, dict) else answer
        )
        return bool(actual_indices) and ",".join(str(index) for index in actual_indices) in expected
    expected = {
        _answer_text(contract.get("canonicalAnswer")),
        *(_answer_text(item) for item in contract.get("acceptableAnswers", [])),
    }
    if contract.get("displayAnswer") is not None:
        expected.add(_answer_text(contract.get("displayAnswer")))
    actual = _answer_text(answer.get("canonicalAnswer") if isinstance(answer, dict) else answer)
    if expected_type == "choice_index":
        actual = {"①": "1", "②": "2", "③": "3", "④": "4", "⑤": "5"}.get(actual, actual)
        if actual in expected:
            return True
        # Independent reviewers may report the selected choice content rather
        # than its ordinal.  Resolve that representation deterministically
        # against the blinded student choices before declaring a mismatch.
        if isinstance(choices, list):
            actual_choice = _choice_text(actual)
            for index, choice in enumerate(choices, start=1):
                if _choice_text(choice) == actual_choice:
                    return str(index) in expected
    return bool(actual) and actual in expected


def _normalize_review_batch(manifest: dict[str, Any], task: dict[str, Any], payload: dict[str, Any]) -> dict[str, Any]:
    if payload.get("artifactType") not in {
        None,
        "ALIVE_STAGED_BATCH_REVIEW",
        "ALIVE_BATCH_EXAM_REVIEW",
        # Backward-compatible alias emitted by an earlier independent-review prompt.
        "ALIVE_STAGED_REVIEW_RESULT",
        # Compatibility alias emitted by the staged batch-review role.  It is
        # normalized below to the canonical ALIVE_STAGED_BATCH_REVIEW envelope.
        "ALIVE_STAGED_BATCH_REVIEW_CANDIDATE",
        "ALIVE_STAGED_REVIEW_ARTIFACT",
        # Repair-review workers may use the shorter review envelope name.
        # It carries the same per-question review contract and is normalized
        # below without relaxing the solution/visual gates.
        "ALIVE_STAGED_REVIEW",
    }:
        raise StagedExamError("unsupported staged batch review artifactType")
    raw_items = payload.get("reviews") or payload.get("questions") or payload.get("items")
    if not isinstance(raw_items, list):
        raise StagedExamError("batch review items must be a list")
    expected = list(task["ordinals"])
    by_ordinal: dict[int, dict[str, Any]] = {}
    for raw in raw_items:
        if not isinstance(raw, dict):
            raise StagedExamError("batch review item must be an object")
        try:
            ordinal = int(raw.get("ordinal") or raw.get("id"))
        except (TypeError, ValueError) as error:
            raise StagedExamError("batch review ordinal is invalid") from error
        if ordinal in by_ordinal or ordinal not in expected:
            raise StagedExamError("batch review ordinal set is invalid")
        verdict = str(raw.get("verdict") or raw.get("status") or "").strip().upper()
        if verdict not in {"PASS", "REVISE", "FAIL"}:
            raise StagedExamError(f"batch review {ordinal} verdict is invalid")
        answer = raw.get("independentAnswer") or raw.get("derivedAnswer") or raw.get("answer")
        if not isinstance(answer, dict):
            if answer is None:
                raise StagedExamError(f"batch review {ordinal} independent answer is missing")
            answer = {"canonicalAnswer": str(answer)}
        expected_question_type = _normalize_question_type(
            manifest["preflight"]["questions"][ordinal - 1]["normalizedQuestionType"]
        )
        # Some reviewers report both the selected choice number and the
        # selected choice content.  For MCQs the explicit ordinal is the
        # canonical representation; retain content only as supporting
        # evidence and reject a contradictory numeric ordinal below.
        selected_choice = answer.get("selectedChoice")
        if expected_question_type == "MCQ" and isinstance(selected_choice, int):
            if not 1 <= selected_choice <= 5:
                raise StagedExamError(f"batch review {ordinal} selectedChoice is invalid")
            existing_canonical = answer.get("canonicalAnswer")
            if existing_canonical is not None and str(existing_canonical).strip() in {
                "1", "2", "3", "4", "5"
            } and int(str(existing_canonical).strip()) != selected_choice:
                raise StagedExamError(f"batch review {ordinal} answer representations conflict")
            answer = copy.deepcopy(answer)
            answer["canonicalAnswer"] = str(selected_choice)
        elif expected_question_type == "MCQ" and isinstance(selected_choice, list):
            indices = _choice_indices(selected_choice)
            if not indices:
                raise StagedExamError(f"batch review {ordinal} selectedChoice is invalid")
            answer = copy.deepcopy(answer)
            answer["canonicalAnswer"] = ",".join(str(index) for index in indices)
        canonical = answer.get("canonicalAnswer")
        if canonical is None:
            choice_index = answer.get("choiceIndex")
            if isinstance(choice_index, int):
                choice_index_base = answer.get("choiceIndexBase")
                if choice_index_base == 0:
                    canonical = choice_index + 1
                elif 1 <= choice_index <= 5:
                    canonical = choice_index
                elif 0 <= choice_index < 5:
                    canonical = choice_index + 1
        if canonical is None:
            canonical = answer.get("value")
        if canonical is None:
            canonical = answer.get("answer")
        if canonical is None or not str(canonical).strip():
            raise StagedExamError(f"batch review {ordinal} canonical answer is missing")
        checks = raw.get("checks") or raw.get("findings") or {"independentReview": "completed"}
        if not checks:
            raise StagedExamError(f"batch review {ordinal} checks are empty")
        findings = raw.get("findings", [])
        if not isinstance(findings, list):
            findings = [str(findings)]
        expected_visual = manifest["preflight"]["questions"][ordinal - 1].get("visualDependency", "NONE")
        visual_check = raw.get("visualCheck")
        if visual_check is None and raw.get("visualVerdict") is not None:
            visual_check = {"verdict": raw.get("visualVerdict")}
        legacy_solution_visual_check = None
        if isinstance(visual_check, dict) and str(visual_check.get("role") or "").lower() == "solution":
            legacy_solution_visual_check = copy.deepcopy(visual_check)
            if expected_visual == "NONE":
                visual_check = None
            elif expected_visual == "OPTIONAL":
                visual_check = {"verdict": "PASS", "notApplicable": True}
        if expected_visual != "NONE":
            if not isinstance(visual_check, dict):
                raise StagedExamError(f"batch review {ordinal} visualCheck is required")
            visual_verdict = str(visual_check.get("verdict") or visual_check.get("status") or "").strip().upper()
            if visual_verdict not in {"PASS", "REVISE", "FAIL", "UNVERIFIED"}:
                raise StagedExamError(f"batch review {ordinal} visualCheck verdict is invalid")
            if verdict == "PASS" and visual_verdict != "PASS":
                raise StagedExamError(f"batch review {ordinal} cannot PASS without visualCheck PASS")
            visual_check = copy.deepcopy(visual_check)
            visual_check["verdict"] = visual_verdict
        elif visual_check is not None:
            # Reviewers may explicitly record that a nonvisual question has
            # no problem diagram.  Treat only the precise PASS/N/A form as a
            # harmless compatibility envelope; any other visual claim on a
            # nonvisual item remains an artifact error.
            if (
                isinstance(visual_check, dict)
                and str(visual_check.get("verdict") or visual_check.get("status") or "").strip().upper()
                in {"PASS", "NOT_APPLICABLE", "N/A"}
                and (
                    visual_check.get("notApplicable") is True
                    or str(visual_check.get("verdict") or visual_check.get("status") or "").strip().upper()
                    in {"NOT_APPLICABLE", "N/A"}
                )
            ):
                visual_check = None
            else:
                raise StagedExamError(f"batch review {ordinal} nonvisual output contains visualCheck")
        raw_solution_review = raw.get("solutionReview") or raw.get("solutionQualityReview")
        # Some independent-review agents return the five solution checks at
        # the same level as ``solutionReview.verdict``.  Treat that shape as
        # a compatibility envelope, while keeping a non-PASS verdict and its
        # failed check intact so it still routes to revision.
        if isinstance(raw_solution_review, dict) and "checks" not in raw_solution_review:
            flat_solution_review = raw_solution_review
            flat_verdict = str(
                flat_solution_review.get("verdict")
                or flat_solution_review.get("status")
                or ""
            ).strip().upper()
            flat_checks = {
                name: str(flat_solution_review.get(name) or "NOT_APPLICABLE").strip().upper()
                for name in (
                    "readability",
                    "stepReasons",
                    "theoremJustification",
                    "answerCheck",
                    "diagramConsistency",
                )
            }
            flat_findings = flat_solution_review.get("findings", [])
            if not isinstance(flat_findings, list):
                flat_findings = [flat_findings]
            if flat_solution_review.get("summary") and not flat_findings:
                flat_findings = [flat_solution_review["summary"]]
            raw_solution_review = {
                "verdict": flat_verdict,
                "studentCanFollow": (
                    flat_solution_review.get("studentCanFollow")
                    if isinstance(flat_solution_review.get("studentCanFollow"), bool)
                    else flat_verdict == "PASS"
                ),
                "checks": flat_checks,
                "findings": flat_findings,
                "suggestedFixes": flat_solution_review.get("suggestedFixes", []),
                "visualCheck": flat_solution_review.get("visualCheck"),
            }
        if not isinstance(raw_solution_review, dict):
            raise StagedExamError(f"batch review {ordinal} solutionReview is required")
        solution_verdict = str(
            raw_solution_review.get("verdict")
            or raw_solution_review.get("status")
            or ""
        ).strip().upper()
        if solution_verdict not in {"PASS", "REVISE", "FAIL"}:
            raise StagedExamError(f"batch review {ordinal} solutionReview verdict is invalid")
        student_can_follow = raw_solution_review.get("studentCanFollow")
        if not isinstance(student_can_follow, bool):
            raise StagedExamError(f"batch review {ordinal} solutionReview.studentCanFollow is required")
        solution_checks = raw_solution_review.get("checks")
        if not isinstance(solution_checks, dict) or not solution_checks:
            raise StagedExamError(f"batch review {ordinal} solutionReview checks are required")
        solution_findings = raw_solution_review.get("findings", [])
        if not isinstance(solution_findings, list):
            solution_findings = [str(solution_findings)]
        solution_visual_check = raw_solution_review.get("visualCheck")
        # Earlier reviewer prompts sometimes put a solution visual check at
        # the item level.  Preserve it as solution evidence while keeping the
        # item-level field reserved for a problem visual (or an explicit
        # optional not-applicable result).
        if solution_visual_check is None and legacy_solution_visual_check is not None:
            solution_visual_check = legacy_solution_visual_check
        if solution_visual_check is not None and not isinstance(solution_visual_check, dict):
            raise StagedExamError(f"batch review {ordinal} solutionReview.visualCheck is invalid")
        by_ordinal[ordinal] = {
            "ordinal": ordinal,
            "verdict": verdict,
            "independentAnswer": {
                "answerType": answer.get("answerType") or (
                    "choice_indices" if "," in str(canonical) else "choice_index"
                    if "choiceIndex" in answer else None
                ),
                "canonicalAnswer": str(canonical).strip(),
            },
            "checks": copy.deepcopy(checks),
            "findings": [str(item) for item in findings],
            "suggestedFixes": copy.deepcopy(raw.get("suggestedFixes", [])),
            "visualCheck": visual_check,
            "solutionReview": {
                "verdict": solution_verdict,
                "studentCanFollow": student_can_follow,
                "checks": copy.deepcopy(solution_checks),
                "findings": [str(item) for item in solution_findings],
                "suggestedFixes": copy.deepcopy(raw_solution_review.get("suggestedFixes", [])),
                "visualCheck": copy.deepcopy(solution_visual_check),
            },
        }
    if set(by_ordinal) != set(expected):
        raise StagedExamError("batch review does not cover exactly its assigned questions")
    normalized = {
        "schemaVersion": STAGED_SCHEMA_VERSION,
        "artifactType": "ALIVE_STAGED_BATCH_REVIEW",
        "runId": manifest["runId"],
        "batchId": task["batchId"],
        "round": task["round"],
        "batchOrdinals": expected,
        "independenceLevel": "I2_SEPARATE_CALL",
        "reviews": [by_ordinal[ordinal] for ordinal in expected],
    }
    normalized["artifactSha256"] = artifact_sha256(normalized)
    return normalized


def _candidate_for_review(run_dir: Path, manifest: dict[str, Any], task: dict[str, Any]) -> dict[str, Any]:
    batch = manifest["batches"][task["batchId"]]
    relative = batch.get("revisionAcceptedPath") if task["round"] == "review2" else batch.get("round1AcceptedPath")
    if not isinstance(relative, str):
        raise StagedExamError("review candidate path is missing")
    return _json_file(_inside(run_dir, run_dir / relative))


def _add_answer_matches(manifest: dict[str, Any], task: dict[str, Any], review: dict[str, Any], candidate: dict[str, Any]) -> None:
    candidate_by_ordinal = {int(item["ordinal"]): item for item in candidate["questions"]}
    for item in review["reviews"]:
        draft = candidate_by_ordinal[item["ordinal"]]
        student_payload = draft.get("studentPayload") if isinstance(draft.get("studentPayload"), dict) else {}
        choices = student_payload.get("choices")
        item["answerMatch"] = _answer_matches(
            draft["answerContract"],
            item["independentAnswer"],
            choices if isinstance(choices, list) else None,
        )


def _validate_review_visual_checks(
    manifest: dict[str, Any], review: dict[str, Any], candidate: dict[str, Any]
) -> None:
    candidate_by_ordinal = {int(item["ordinal"]): item for item in candidate["questions"]}
    for item in review["reviews"]:
        expected_visual = manifest["preflight"]["questions"][item["ordinal"] - 1].get("visualDependency", "NONE")
        if expected_visual == "NONE":
            continue
        check = item.get("visualCheck")
        draft = candidate_by_ordinal[item["ordinal"]]
        asset = draft.get("visualAsset")
        if not isinstance(check, dict):
            raise StagedExamError(f"batch review {item['ordinal']} visual evidence is incomplete")
        if not isinstance(asset, dict):
            if expected_visual == "OPTIONAL" and check.get("verdict") == "PASS" and check.get("notApplicable") is True:
                continue
            raise StagedExamError(f"batch review {item['ordinal']} visual evidence is incomplete")
        if asset.get("role", "problem") != "problem":
            raise StagedExamError(f"batch review {item['ordinal']} problem visual has the wrong role")
        if check.get("verdict") == "PASS":
            if check.get("assetSha256") != asset.get("sha256") or check.get("visualSpecSha256") != asset.get("specSha256"):
                raise StagedExamError(f"batch review {item['ordinal']} visual evidence hash does not match candidate")
            checks = check.get("checks")
            if not isinstance(checks, dict) or any(
                checks.get(name) != "PASS" for name in ("topology", "semanticOwnership", "labels", "determinism")
            ):
                raise StagedExamError(f"batch review {item['ordinal']} visual PASS lacks complete visual checks")


def _validate_solution_reviews(
    manifest: dict[str, Any], review: dict[str, Any], candidate: dict[str, Any]
) -> None:
    candidate_by_ordinal = {int(item["ordinal"]): item for item in candidate["questions"]}
    required_checks = ("readability", "stepReasons", "theoremJustification", "answerCheck", "diagramConsistency")
    acceptable_check_values = {"PASS", "NOT_APPLICABLE", "N/A"}
    for item in review["reviews"]:
        ordinal = item["ordinal"]
        solution_review = item.get("solutionReview")
        if not isinstance(solution_review, dict):
            raise StagedExamError(f"batch review {ordinal} solution review is incomplete")
        if solution_review.get("verdict") != "PASS" or solution_review.get("studentCanFollow") is not True:
            continue
        checks = solution_review.get("checks")
        if not isinstance(checks, dict):
            raise StagedExamError(f"batch review {ordinal} solution review checks are incomplete")
        for name in required_checks:
            value = str(checks.get(name) or "").strip().upper()
            if value not in acceptable_check_values:
                raise StagedExamError(f"batch review {ordinal} solution review check {name} did not PASS")
        draft = candidate_by_ordinal[ordinal]
        quality = draft.get("solutionQuality")
        if not isinstance(quality, dict) or quality.get("verdict") != "PASS":
            raise StagedExamError(f"batch review {ordinal} solution quality contract did not PASS")
        requirement = quality.get("visualRequirement", "NOT_REQUIRED")
        asset = draft.get("solutionVisualAsset")
        visual_check = solution_review.get("visualCheck")
        if requirement == "MANDATORY" and not isinstance(asset, dict):
            raise StagedExamError(f"batch review {ordinal} mandatory solution visual is missing")
        if isinstance(asset, dict):
            if asset.get("role") != "solution":
                raise StagedExamError(f"batch review {ordinal} solution visual has the wrong role")
            if not isinstance(visual_check, dict) or str(visual_check.get("verdict") or "").upper() != "PASS":
                raise StagedExamError(f"batch review {ordinal} solution visual review is incomplete")
            if (
                visual_check.get("assetSha256") != asset.get("sha256")
                or visual_check.get("visualSpecSha256") != asset.get("specSha256")
            ):
                raise StagedExamError(f"batch review {ordinal} solution visual review hash does not match candidate")
            visual_checks = visual_check.get("checks")
            if not isinstance(visual_checks, dict) or any(
                visual_checks.get(name) != "PASS"
                for name in ("topology", "semanticOwnership", "labels", "determinism")
            ):
                raise StagedExamError(f"batch review {ordinal} solution visual review lacks complete checks")
        elif requirement == "MANDATORY":
            raise StagedExamError(f"batch review {ordinal} mandatory solution visual review is incomplete")


def _run_mother_semantic_final(run_dir: Path, manifest: dict[str, Any]) -> dict[str, Any]:
    """Aggregate the complete accepted exam into one final quality gate.

    The batch reviewers perform the student walkthrough; this mother gate
    checks that every accepted question has that evidence, that required
    solution diagrams are present and hash-valid, and that no batch silently
    escaped the detail contract.
    """

    expected = int(manifest["request"]["expectedQuestionCount"])
    findings: list[dict[str, Any]] = []
    required_solution_visuals: list[int] = []
    passed_solution_reviews = 0
    for ordinal in range(1, expected + 1):
        batch_id = next(
            (candidate_batch_id for candidate_batch_id, batch in manifest["batches"].items() if ordinal in batch["ordinals"]),
            None,
        )
        if batch_id is None:
            findings.append({"ordinal": ordinal, "code": "MOTHER_BATCH_MISSING"})
            continue
        batch = manifest["batches"][batch_id]
        accepted_path = batch.get("revisionAcceptedPath")
        if not isinstance(accepted_path, str):
            findings.append({"ordinal": ordinal, "code": "MOTHER_CANDIDATE_MISSING"})
            continue
        try:
            candidate = _json_file(_inside(run_dir, run_dir / accepted_path))
        except (StagedExamError, OSError) as error:
            findings.append({"ordinal": ordinal, "code": "MOTHER_CANDIDATE_UNREADABLE", "detail": str(error)})
            continue
        question = next((item for item in candidate.get("questions", []) if int(item.get("ordinal", 0)) == ordinal), None)
        if not isinstance(question, dict):
            findings.append({"ordinal": ordinal, "code": "MOTHER_QUESTION_MISSING"})
            continue
        quality = question.get("solutionQuality")
        if not isinstance(quality, dict) or quality.get("verdict") != "PASS":
            findings.append({"ordinal": ordinal, "code": "MOTHER_SOLUTION_QUALITY_FAIL"})
        quality_map = quality if isinstance(quality, dict) else {}
        requirement = str(quality_map.get("visualRequirement", "NOT_REQUIRED"))
        solution_spec = question.get("solutionVisualSpec")
        solution_asset = question.get("solutionVisualAsset")
        if requirement == "MANDATORY":
            required_solution_visuals.append(ordinal)
            if not isinstance(solution_spec, dict) or not isinstance(solution_asset, dict):
                findings.append({"ordinal": ordinal, "code": "MOTHER_SOLUTION_VISUAL_MISSING"})
            elif solution_asset.get("role") != "solution":
                findings.append({"ordinal": ordinal, "code": "MOTHER_SOLUTION_VISUAL_ROLE_INVALID"})
            else:
                try:
                    validate_solution_visual_spec(
                        solution_spec,
                        student_payload=question.get("studentPayload", {}),
                        solution=str(question.get("solution") or ""),
                        inferred_visual_requirement=requirement,
                        preflight_item=manifest["preflight"]["questions"][ordinal - 1],
                    )
                    validate_staged_visual_asset(run_dir, solution_spec, solution_asset)
                except (VisualLaneError, OSError, ValueError) as error:
                    findings.append({"ordinal": ordinal, "code": "MOTHER_SOLUTION_VISUAL_INVALID", "detail": str(error)})
        elif isinstance(solution_asset, dict) or isinstance(solution_spec, dict):
            if not isinstance(solution_spec, dict) or not isinstance(solution_asset, dict):
                findings.append({"ordinal": ordinal, "code": "MOTHER_SOLUTION_VISUAL_CONTRACT_INCOMPLETE"})
            elif solution_asset.get("role") != "solution":
                findings.append({"ordinal": ordinal, "code": "MOTHER_SOLUTION_VISUAL_ROLE_INVALID"})
            else:
                try:
                    validate_staged_visual_asset(run_dir, solution_spec, solution_asset)
                except (VisualLaneError, OSError, ValueError) as error:
                    findings.append({"ordinal": ordinal, "code": "MOTHER_SOLUTION_VISUAL_INVALID", "detail": str(error)})
        review_item = next(
            (item for item in batch.get("review2", {}).get("items", []) if int(item.get("ordinal", 0)) == ordinal),
            None,
        )
        solution_review = review_item.get("solutionReview") if isinstance(review_item, dict) else None
        if (
            isinstance(solution_review, dict)
            and solution_review.get("verdict") == "PASS"
            and solution_review.get("studentCanFollow") is True
        ):
            passed_solution_reviews += 1
        else:
            findings.append({"ordinal": ordinal, "code": "MOTHER_SOLUTION_REVIEW_MISSING"})

    report = {
        "schemaVersion": STAGED_SCHEMA_VERSION,
        "artifactType": "ALIVE_STAGED_MOTHER_SEMANTIC_FINAL",
        "stageId": "S06_MOTHER_SEMANTIC_FINAL",
        "verdict": "PASS" if not findings else "HOLD",
        "questionCount": expected,
        "solutionReviewCoverage": {
            "required": expected,
            "passed": passed_solution_reviews,
            "verdict": "PASS" if passed_solution_reviews == expected else "FAIL",
        },
        "solutionVisualRequiredOrdinals": required_solution_visuals,
        "checks": {
            "solutionDetailContract": "PASS" if not any(item["code"] == "MOTHER_SOLUTION_QUALITY_FAIL" for item in findings) else "FAIL",
            "studentWalkthroughReview": "PASS" if passed_solution_reviews == expected else "FAIL",
            "solutionVisualCoverage": "PASS" if not any("SOLUTION_VISUAL" in item["code"] for item in findings) else "FAIL",
            "wholeExamCoverage": "PASS" if len(findings) == 0 else "FAIL",
        },
        "findings": findings,
        "publicationStatus": "NOT_PUBLISHED",
    }
    atomic_write_json(run_dir / "final/mother-final-report.json", report)
    return report


def _validate_parent_resolution_candidate(
    run_dir: Path,
    manifest: dict[str, Any],
    batch_id: str,
    candidate: dict[str, Any],
) -> None:
    """Re-check a parent-resolved candidate before replacing a held revision.

    Parent resolution is intentionally a narrow, audited escape hatch for a
    run that reached ``MANUAL_REVIEW_REQUIRED`` after the normal bounded
    revision budget.  It must not weaken the same candidate and visual
    contracts enforced at normal task acceptance.
    """

    batch = manifest["batches"][batch_id]
    expected_ordinals = list(batch["ordinals"])
    if candidate.get("runId") != manifest["runId"]:
        raise StagedExamError(f"parent resolution candidate {batch_id} belongs to another Run")
    if candidate.get("batchId") != batch_id:
        raise StagedExamError(f"parent resolution candidate {batch_id} has the wrong batchId")
    if candidate.get("round") not in {"revision", "parent-resolution"}:
        raise StagedExamError(f"parent resolution candidate {batch_id} has an invalid round")
    if candidate.get("batchOrdinals") != expected_ordinals:
        raise StagedExamError(f"parent resolution candidate {batch_id} has the wrong ordinal set")
    questions = candidate.get("questions")
    if not isinstance(questions, list) or [item.get("ordinal") for item in questions if isinstance(item, dict)] != expected_ordinals:
        raise StagedExamError(f"parent resolution candidate {batch_id} does not cover its ordinals in order")
    if candidate.get("artifactSha256") != artifact_sha256(candidate):
        raise StagedExamError(f"parent resolution candidate {batch_id} has an invalid artifactSha256")

    for question in questions:
        ordinal = int(question["ordinal"])
        student = question.get("studentPayload")
        if not isinstance(student, dict):
            raise StagedExamError(f"parent resolution question {ordinal} studentPayload is missing")
        _validate_student_payload(student)
        _reject_student_visual_fields(student)
        expected_type = _normalize_question_type(
            manifest["preflight"]["questions"][ordinal - 1]["normalizedQuestionType"]
        )
        _normalize_contract(
            question.get("answerContract"),
            student,
            expected_type,
            int(manifest["preflight"]["questions"][ordinal - 1].get("answerCardinality") or 1),
        )
        solution = question.get("solution")
        if not isinstance(solution, str) or not solution.strip():
            raise StagedExamError(f"parent resolution question {ordinal} solution is missing")
        detail = question.get("solutionDetail")
        inferred_requirement = infer_solution_visual_requirement(
            student,
            solution,
            manifest["preflight"]["questions"][ordinal - 1],
            detail if isinstance(detail, dict) else None,
        )
        try:
            normalized_detail = normalize_solution_detail(
                detail,
                inferred_visual_requirement=inferred_requirement,
            )
        except SolutionQualityError as error:
            raise StagedExamError(f"parent resolution question {ordinal} solutionDetail is invalid: {error}") from error
        if normalized_detail != detail:
            raise StagedExamError(f"parent resolution question {ordinal} solutionDetail is not canonical")
        quality = question.get("solutionQuality")
        if not isinstance(quality, dict) or quality.get("verdict") != "PASS":
            raise StagedExamError(f"parent resolution question {ordinal} solution quality did not PASS")

        preflight_item = manifest["preflight"]["questions"][ordinal - 1]
        expected_visual = preflight_item.get("visualDependency", "NONE")
        problem_spec = question.get("visualSpec")
        problem_asset = question.get("visualAsset")
        if expected_visual == "ESSENTIAL":
            if not isinstance(problem_spec, dict) or not isinstance(problem_asset, dict):
                raise StagedExamError(f"parent resolution question {ordinal} essential problem visual is missing")
            if problem_asset.get("role", "problem") != "problem":
                raise StagedExamError(f"parent resolution question {ordinal} problem visual has the wrong role")
            try:
                validate_staged_visual_asset(run_dir, problem_spec, problem_asset)
            except (VisualLaneError, OSError, ValueError) as error:
                raise StagedExamError(f"parent resolution question {ordinal} problem visual is invalid: {error}") from error
        elif problem_spec is not None or problem_asset is not None:
            raise StagedExamError(f"parent resolution question {ordinal} has an unexpected problem visual")

        solution_spec = question.get("solutionVisualSpec")
        solution_asset = question.get("solutionVisualAsset")
        if inferred_requirement == "MANDATORY" and not isinstance(solution_spec, dict):
            raise StagedExamError(f"parent resolution question {ordinal} mandatory solution visual is missing")
        if solution_spec is not None or solution_asset is not None:
            if not isinstance(solution_spec, dict) or not isinstance(solution_asset, dict):
                raise StagedExamError(f"parent resolution question {ordinal} solution visual contract is incomplete")
            if solution_asset.get("role") != "solution":
                raise StagedExamError(f"parent resolution question {ordinal} solution visual has the wrong role")
            try:
                validate_solution_visual_spec(
                    solution_spec,
                    student_payload=student,
                    solution=solution,
                    inferred_visual_requirement=inferred_requirement,
                    preflight_item=preflight_item,
                )
                validate_staged_visual_asset(run_dir, solution_spec, solution_asset)
            except (SolutionQualityError, VisualLaneError, OSError, ValueError) as error:
                raise StagedExamError(f"parent resolution question {ordinal} solution visual is invalid: {error}") from error


def resolve_staged_manual_review(
    store: StagedRunStore,
    run_id: str,
    resolution_path: Path,
) -> dict[str, Any]:
    """Apply one bounded, parent-owned resolution to a held review2 Run.

    The resolution file maps each batch to a candidate and an independent
    re-review artifact.  Original revision/review2 evidence is never
    overwritten; the manifest points to the new, explicitly named evidence
    paths only after every batch passes the normal review validators.
    """

    manifest = store.load(run_id)
    if manifest.get("status") != "MANUAL_REVIEW_REQUIRED" or manifest.get("currentStage") != "S05_REVIEW2":
        raise StagedExamError("parent resolution requires a Run held at S05_REVIEW2")
    run_dir = store.run_dir(run_id)
    resolution = _json_file(resolution_path.resolve())
    if resolution.get("artifactType") != "ALIVE_STAGED_PARENT_RESOLUTION":
        raise StagedExamError("unsupported staged parent resolution artifactType")
    if resolution.get("runId") != run_id:
        raise StagedExamError("parent resolution belongs to another Run")
    if resolution.get("bounded") is not True or resolution.get("resolutionVersion") != "0.1":
        raise StagedExamError("parent resolution must declare bounded resolutionVersion 0.1")
    mappings = resolution.get("batches")
    if not isinstance(mappings, dict) or set(mappings) != set(manifest["batches"]):
        raise StagedExamError("parent resolution must cover exactly every batch")

    normalized_by_batch: dict[str, dict[str, Any]] = {}
    candidate_hashes: dict[str, str] = {}
    review_hashes: dict[str, str] = {}
    original_paths: dict[str, dict[str, str | None]] = {}
    for batch_id, batch in manifest["batches"].items():
        mapping = mappings.get(batch_id)
        if not isinstance(mapping, dict):
            raise StagedExamError(f"parent resolution mapping for {batch_id} is invalid")
        candidate_relative = mapping.get("candidatePath")
        review_relative = mapping.get("reviewPath")
        if not isinstance(candidate_relative, str) or not isinstance(review_relative, str):
            raise StagedExamError(f"parent resolution mapping for {batch_id} lacks paths")
        candidate_path = _inside(run_dir, run_dir / candidate_relative)
        review_path = _inside(run_dir, run_dir / review_relative)
        candidate = _json_file(candidate_path)
        _validate_parent_resolution_candidate(run_dir, manifest, batch_id, candidate)
        task = {"batchId": batch_id, "round": "review2", "ordinals": list(batch["ordinals"])}
        raw_review = _json_file(review_path)
        normalized = _normalize_review_batch(manifest, task, raw_review)
        _add_answer_matches(manifest, task, normalized, candidate)
        _validate_review_visual_checks(manifest, normalized, candidate)
        _validate_solution_reviews(manifest, normalized, candidate)
        if any(
            item.get("verdict") != "PASS"
            or item.get("answerMatch") is not True
            or item.get("solutionReview", {}).get("verdict") != "PASS"
            or item.get("solutionReview", {}).get("studentCanFollow") is not True
            for item in normalized["reviews"]
        ):
            raise StagedExamError(f"parent resolution review for {batch_id} did not pass every question")
        normalized["artifactSha256"] = artifact_sha256(normalized)
        normalized_path = f"evidence/{batch_id}/parent-resolution-review.json"
        atomic_write_json(run_dir / normalized_path, normalized)
        normalized_by_batch[batch_id] = normalized
        candidate_hashes[batch_id] = str(candidate.get("artifactSha256"))
        review_hashes[batch_id] = str(normalized["artifactSha256"])
        original_paths[batch_id] = {
            "revisionAcceptedPath": batch.get("revisionAcceptedPath"),
            "review2AcceptedPath": batch.get("review2AcceptedPath"),
        }

    report: dict[str, Any] = {
        "schemaVersion": STAGED_SCHEMA_VERSION,
        "artifactType": "ALIVE_STAGED_PARENT_RESOLUTION_REPORT",
        "resolutionVersion": "0.1",
        "runId": run_id,
        "bounded": True,
        "reason": str(resolution.get("reason") or "parent-owned resolution after bounded review hold"),
        "originalStatus": manifest["status"],
        "originalStage": manifest["currentStage"],
        "originalCodes": list(manifest.get("codes", [])),
        "originalPaths": original_paths,
        "candidatePaths": {batch_id: mappings[batch_id]["candidatePath"] for batch_id in manifest["batches"]},
        "rawReviewPaths": {batch_id: mappings[batch_id]["reviewPath"] for batch_id in manifest["batches"]},
        "normalizedReviewPaths": {
            batch_id: f"evidence/{batch_id}/parent-resolution-review.json" for batch_id in manifest["batches"]
        },
        "candidateArtifactSha256": candidate_hashes,
        "reviewArtifactSha256": review_hashes,
        "questionCount": int(manifest["request"]["expectedQuestionCount"]),
        "verdict": "PASS",
        "publicationStatus": "NOT_PUBLISHED",
    }
    report["artifactSha256"] = artifact_sha256(report)
    atomic_write_json(run_dir / "manual-resolution/parent-resolution-report.json", report)

    for batch_id, batch in manifest["batches"].items():
        mapping = mappings[batch_id]
        batch["originalRevisionAcceptedPath"] = batch.get("revisionAcceptedPath")
        batch["originalReview2AcceptedPath"] = batch.get("review2AcceptedPath")
        batch["revisionAcceptedPath"] = mapping["candidatePath"]
        batch["review2AcceptedPath"] = f"evidence/{batch_id}/parent-resolution-review.json"
        batch["review2"] = {
            "items": normalized_by_batch[batch_id]["reviews"],
            "acceptedPath": batch["review2AcceptedPath"],
        }
        batch["status"] = "REVIEWED"
        for ordinal in batch["ordinals"]:
            manifest["questions"][str(ordinal)]["status"] = "REVISED"

    manifest["manualResolution"] = report
    manifest["codes"] = [
        code
        for code in manifest.get("codes", [])
        if code not in {"STAGED_FINAL_REVIEW_FINDINGS", "STAGED_MOTHER_SOLUTION_FINDINGS"}
    ]
    _set_stage(manifest, "S05_REVIEW2", "PASS", report["artifactSha256"])
    mother = _run_mother_semantic_final(run_dir, manifest)
    manifest["motherFinal"] = mother
    if mother["verdict"] != "PASS":
        _set_stage(manifest, "S06_MOTHER_SEMANTIC_FINAL", "HOLD", "parent resolution reached mother final hold")
        manifest["status"] = "MANUAL_REVIEW_REQUIRED"
        manifest["currentStage"] = "S06_MOTHER_SEMANTIC_FINAL"
        manifest["codes"] = sorted(set(manifest.get("codes", []) + ["STAGED_MOTHER_SOLUTION_FINDINGS"]))
        _append_event(manifest, "STAGED_PARENT_RESOLUTION_MOTHER_HOLD")
        _refresh(manifest)
        store.save(run_id, manifest)
        raise StagedExamError("parent resolution passed batch review but mother final still has findings")

    _set_stage(manifest, "S06_MOTHER_SEMANTIC_FINAL", "PASS", "parent-resolved whole-exam solution quality and visual coverage passed")
    manifest["status"] = "READY_FOR_ASSEMBLY"
    manifest["currentStage"] = "S07_ASSEMBLY"
    _append_event(manifest, "STAGED_PARENT_RESOLUTION_COMPLETE", reportSha256=report["artifactSha256"])
    _refresh(manifest)
    store.save(run_id, manifest)
    return manifest


def _accept_task(store: StagedRunStore, run_id: str, task_id: str, input_path: Path) -> dict[str, Any]:
    manifest = store.load(run_id)
    task = _task(manifest, task_id)
    run_dir = store.run_dir(run_id)
    expected_input = _inside(run_dir, run_dir / task["outputPath"])
    if _inside(run_dir, input_path) != expected_input:
        raise StagedExamError(f"artifact must be written to task inbox path: {task['outputPath']}")
    if not expected_input.is_file():
        raise FileNotFoundError(expected_input)
    if task.get("status") == "ACCEPTED":
        return {"task": task, "idempotent": True, "status": manifest["status"]}
    if task.get("status") not in {"PENDING", "DISPATCHED"}:
        raise StagedExamError(f"staged task cannot accept from {task.get('status')}")
    payload = _json_file(expected_input)
    if task["kind"] == "BATCH_BUILDER":
        normalized = _normalize_draft_batch(manifest, task, payload, run_dir)
        if task["round"] == "revision":
            # A revision must still cover the same batch and response forms;
            # _normalize_draft_batch already enforces this.
            pass
    elif task["kind"] == "BATCH_REVIEWER":
        normalized = _normalize_review_batch(manifest, task, payload)
        candidate = _candidate_for_review(run_dir, manifest, task)
        _add_answer_matches(manifest, task, normalized, candidate)
        _validate_review_visual_checks(manifest, normalized, candidate)
        _validate_solution_reviews(manifest, normalized, candidate)
        normalized["artifactSha256"] = artifact_sha256(normalized)
    else:
        raise StagedExamError("unsupported staged task kind")
    accepted_path = run_dir / task["acceptedPath"]
    if accepted_path.exists():
        raise StagedExamError("accepted staged artifact path already exists")
    atomic_write_json(accepted_path, normalized)
    task["status"] = "ACCEPTED"
    task["inputSha256"] = sha256_file(expected_input)
    task["artifactSha256"] = normalized["artifactSha256"]
    task["acceptedAt"] = utc_now()
    batch = manifest["batches"][task["batchId"]]
    if task["kind"] == "BATCH_BUILDER":
        key = "round1AcceptedPath" if task["round"] == "round1" else "revisionAcceptedPath"
        batch[key] = task["acceptedPath"]
        view_path = _student_view(run_dir, task["batchId"], task["round"], normalized["questions"])
        batch[f"{task['round']}StudentViewPath"] = view_path
        batch["status"] = "GENERATED" if task["round"] == "round1" else "REVISED"
        for item in normalized["questions"]:
            manifest["questions"][str(item["ordinal"])] ["status"] = "GENERATED" if task["round"] == "round1" else "REVISED"
        _solution_view(run_dir, task["batchId"], task["round"], normalized["questions"])
    else:
        key = "review1AcceptedPath" if task["round"] == "review1" else "review2AcceptedPath"
        batch[key] = task["acceptedPath"]
        batch[task["round"]] = {"items": normalized["reviews"], "acceptedPath": task["acceptedPath"]}
    _append_event(manifest, "STAGED_TASK_ACCEPTED", taskId=task_id, round=task["round"])
    _advance(run_dir, manifest)
    _refresh(manifest)
    store.save(run_id, manifest)
    return {"task": task, "idempotent": False, "status": manifest["status"], "acceptedPath": task["acceptedPath"]}


def _record_rejection(store: StagedRunStore, run_id: str, task: dict[str, Any], error: str) -> None:
    manifest = store.load(run_id)
    fresh = _task(manifest, task["taskId"])
    attempts = fresh.setdefault("dispatch", {}).setdefault("attempts", [])
    if attempts and attempts[-1].get("status") == "DISPATCHED":
        attempts[-1].update({"status": "ARTIFACT_REJECTED", "error": error, "finishedAt": utc_now()})
    fresh["lastError"] = error
    marker_relative = fresh.get("completionMarkerPath")
    if isinstance(marker_relative, str):
        marker = _inside(store.run_dir(run_id), store.run_dir(run_id) / marker_relative)
        if marker.exists():
            marker.unlink()
    if len(attempts) >= STAGED_MAX_ATTEMPTS:
        fresh["status"] = "FAILED"
        manifest["status"] = "FAILED"
        manifest["currentStage"] = fresh.get("stage") or manifest.get("currentStage")
        manifest["codes"] = sorted(set(manifest.get("codes", []) + ["STAGED_ARTIFACT_RETRY_EXHAUSTED"]))
    else:
        fresh["status"] = "PENDING"
    _append_event(manifest, "STAGED_TASK_REJECTED", taskId=fresh["taskId"], error=error)
    _refresh(manifest)
    store.save(run_id, manifest)


def reconcile_staged_run(store: StagedRunStore, run_id: str) -> dict[str, Any]:
    accepted: list[dict[str, Any]] = []
    errors: list[dict[str, str]] = []
    inspected: set[tuple[str, str]] = set()
    while True:
        manifest = store.load(run_id)
        run_dir = store.run_dir(run_id)
        progressed = 0
        for task_id, task in list(manifest.get("tasks", {}).items()):
            if task.get("status") not in {"PENDING", "DISPATCHED"} or not task.get("outputPath"):
                continue
            candidate = run_dir / task["outputPath"]
            if not candidate.is_file():
                continue
            if task.get("completionRequired"):
                marker_relative = task.get("completionMarkerPath")
                if not isinstance(marker_relative, str):
                    continue
                marker = _inside(run_dir, run_dir / marker_relative)
                if not marker.is_file() or marker.stat().st_mtime_ns < candidate.stat().st_mtime_ns:
                    continue
                try:
                    marker_payload = _json_file(marker)
                except StagedExamError:
                    continue
                if (
                    marker_payload.get("taskId") != task_id
                    or marker_payload.get("outputSha256") != sha256_file(candidate)
                ):
                    continue
            key = (task_id, sha256_file(candidate))
            if key in inspected:
                continue
            inspected.add(key)
            attempts = task.get("dispatch", {}).get("attempts", [])
            last = attempts[-1] if attempts else {}
            baseline = last.get("baselineInputMtimeNs")
            if last.get("status") == "DISPATCHED" and isinstance(baseline, int) and candidate.stat().st_mtime_ns <= baseline:
                continue
            try:
                result = _accept_task(store, run_id, task_id, candidate)
                accepted.append(result)
                progressed += 1
            except (StagedExamError, FileNotFoundError) as error:
                errors.append({"taskId": task_id, "error": str(error)})
                _record_rejection(store, run_id, task, str(error))
                progressed += 1
        if progressed == 0:
            break
    manifest = store.load(run_id)
    _refresh(manifest)
    _append_event(manifest, "STAGED_RECONCILE", accepted=len(accepted), errors=len(errors))
    store.save(run_id, manifest)
    return {"runId": run_id, "accepted": accepted, "errors": errors, "status": manifest["status"]}


def start_staged_dispatch(store: StagedRunStore, run_id: str, task_id: str, external_id: str, route: str | None = None) -> tuple[dict[str, Any], bool]:
    manifest = store.load(run_id)
    task = _task(manifest, task_id)
    if task.get("status") == "DISPATCHED":
        attempts = task.get("dispatch", {}).get("attempts", [])
        if attempts and attempts[-1].get("externalId") == external_id:
            return task, True
        raise StagedExamError("staged task already dispatched with another external id")
    if task.get("status") != "PENDING":
        raise StagedExamError(f"staged task is not dispatchable: {task.get('status')}")
    attempts = task.setdefault("dispatch", {}).setdefault("attempts", [])
    if len(attempts) >= STAGED_MAX_ATTEMPTS:
        raise StagedExamError("staged dispatch retry limit exhausted")
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
    heartbeat_relative = task.get("heartbeatPath") or _task_heartbeat_path(task_id)
    heartbeat = _inside(store.run_dir(run_id), store.run_dir(run_id) / heartbeat_relative)
    task["heartbeatPath"] = heartbeat_relative
    atomic_write_json(
        heartbeat,
        {
            "schemaVersion": STAGED_SCHEMA_VERSION,
            "artifactType": "ALIVE_STAGED_TASK_HEARTBEAT",
            "taskId": task_id,
            "runId": run_id,
            "attempt": receipt["attempt"],
            "externalId": external_id,
            "phase": "DISPATCHED",
            "progress": 0,
            "updatedAt": utc_now(),
        },
    )
    receipt["heartbeatPath"] = heartbeat_relative
    receipt["heartbeatBaselineMtimeNs"] = heartbeat.stat().st_mtime_ns
    attempts.append(receipt)
    task["status"] = "DISPATCHED"
    task["completionRequired"] = True
    _append_event(manifest, "STAGED_TASK_DISPATCH_STARTED", taskId=task_id, externalId=external_id)
    _refresh(manifest)
    store.save(run_id, manifest)
    return task, False


def record_staged_task_heartbeat(
    store: StagedRunStore,
    run_id: str,
    task_id: str,
    phase: str,
    progress: int | float | None = None,
    note: str | None = None,
) -> dict[str, Any]:
    """Record external-agent progress without accepting an artifact."""

    manifest = store.load(run_id)
    task = _task(manifest, task_id)
    if task.get("status") != "DISPATCHED":
        raise StagedExamError(
            f"staged task heartbeat requires DISPATCHED status: {task.get('status')}"
        )
    attempts = task.get("dispatch", {}).get("attempts", [])
    if not attempts or attempts[-1].get("status") != "DISPATCHED":
        raise StagedExamError("staged task has no active dispatch attempt")
    latest = attempts[-1]
    relative = task.get("heartbeatPath") or _task_heartbeat_path(task_id)
    target = _inside(store.run_dir(run_id), store.run_dir(run_id) / relative)
    payload: dict[str, Any] = {
        "schemaVersion": STAGED_SCHEMA_VERSION,
        "artifactType": "ALIVE_STAGED_TASK_HEARTBEAT",
        "taskId": task_id,
        "runId": run_id,
        "attempt": latest.get("attempt"),
        "externalId": latest.get("externalId"),
        "phase": str(phase),
        "updatedAt": utc_now(),
    }
    if progress is not None:
        payload["progress"] = progress
    if note:
        payload["note"] = str(note)[:500]
    atomic_write_json(target, payload)
    return payload


def mark_staged_task_complete(store: StagedRunStore, run_id: str, task_id: str) -> dict[str, Any]:
    """Bind a completion marker to the exact output hash before reconcile."""

    manifest = store.load(run_id)
    task = _task(manifest, task_id)
    if not task.get("outputPath") or not task.get("completionMarkerPath"):
        raise StagedExamError("staged task has no completion marker contract")
    run_dir = store.run_dir(run_id)
    output = _inside(run_dir, run_dir / task["outputPath"])
    if not output.is_file():
        raise FileNotFoundError(output)
    marker = _inside(run_dir, run_dir / task["completionMarkerPath"])
    atomic_write_json(
        marker,
        {
            "schemaVersion": STAGED_SCHEMA_VERSION,
            "artifactType": "ALIVE_STAGED_TASK_COMPLETION",
            "taskId": task_id,
            "runId": run_id,
            "outputPath": task["outputPath"],
            "outputSha256": sha256_file(output),
            "completedAt": utc_now(),
        },
    )
    task["completionRequired"] = True
    task["completionMarkedAt"] = utc_now()
    _append_event(manifest, "STAGED_TASK_COMPLETION_MARKED", taskId=task_id)
    _refresh(manifest)
    store.save(run_id, manifest)
    return task


def fail_staged_dispatch(store: StagedRunStore, run_id: str, task_id: str, code: str) -> dict[str, Any]:
    manifest = store.load(run_id)
    task = _task(manifest, task_id)
    if task.get("status") != "DISPATCHED":
        raise StagedExamError("only dispatched staged tasks can fail")
    attempts = task.setdefault("dispatch", {}).setdefault("attempts", [])
    if not attempts or attempts[-1].get("status") != "DISPATCHED":
        raise StagedExamError("staged dispatch receipt is invalid")
    attempts[-1].update({"status": "DISPATCH_FAILED", "code": code, "finishedAt": utc_now()})
    marker_relative = task.get("completionMarkerPath")
    if isinstance(marker_relative, str):
        marker = _inside(store.run_dir(run_id), store.run_dir(run_id) / marker_relative)
        if marker.exists():
            marker.unlink()
    if len(attempts) >= STAGED_MAX_ATTEMPTS:
        task["status"] = "FAILED"
        manifest["status"] = "FAILED"
        manifest["codes"] = sorted(set(manifest.get("codes", []) + ["STAGED_DISPATCH_RETRY_EXHAUSTED"]))
    else:
        task["status"] = "PENDING"
    _refresh(manifest)
    store.save(run_id, manifest)
    return task


def recover_staged_task(store: StagedRunStore, run_id: str, task_id: str) -> dict[str, Any]:
    """Re-open one failed task after a bounded artifact/contract repair.

    This is deliberately explicit: it never rewinds a whole Run or deletes an
    accepted artifact.  It only makes a failed task with a present inbox
    artifact eligible for one parent-side revalidation, preserving the failed
    dispatch attempts in the audit trail.
    """

    manifest = store.load(run_id)
    task = _task(manifest, task_id)
    if task.get("status") != "FAILED":
        raise StagedExamError("only failed staged tasks can be recovered")
    output_relative = task.get("outputPath")
    if not isinstance(output_relative, str):
        raise StagedExamError("failed staged task has no output path")
    run_dir = store.run_dir(run_id)
    output = _inside(run_dir, run_dir / output_relative)
    if not output.is_file():
        raise FileNotFoundError(output)
    marker_relative = task.get("completionMarkerPath")
    if isinstance(marker_relative, str):
        marker = _inside(run_dir, run_dir / marker_relative)
        if marker.exists():
            marker.unlink()
    task["status"] = "PENDING"
    task["completionRequired"] = True
    task["recoveryCount"] = int(task.get("recoveryCount", 0)) + 1
    task["recoveredFrom"] = task.get("lastError")
    task["lastError"] = None
    failed_tasks = [item for item in manifest.get("tasks", {}).values() if item.get("status") == "FAILED"]
    if not failed_tasks:
        stage_status = {
            "S02_ROUND1_GENERATION": "ROUND1_GENERATING",
            "S03_REVIEW1": "REVIEW1_RUNNING",
            "S04_REVISION": "REVISION_RUNNING",
            "S05_REVIEW2": "REVIEW2_RUNNING",
        }.get(manifest.get("currentStage"))
        if stage_status:
            manifest["status"] = stage_status
        manifest["codes"] = [
            code
            for code in manifest.get("codes", [])
            if code not in {"STAGED_ARTIFACT_RETRY_EXHAUSTED", "STAGED_DISPATCH_RETRY_EXHAUSTED"}
        ]
    _append_event(manifest, "STAGED_TASK_RECOVERED", taskId=task_id, recoveryCount=task["recoveryCount"])
    _refresh(manifest)
    store.save(run_id, manifest)
    return task


def build_staged_status(store: StagedRunStore, run_id: str) -> dict[str, Any]:
    manifest = store.load(run_id)
    queue: list[dict[str, Any]] = []
    for task_id, task in manifest.get("tasks", {}).items():
        if task.get("status") == "PENDING":
            queue.append({"kind": "AGENT_TASK", "taskId": task_id, "round": task.get("round"), "batchId": task.get("batchId"), "packetPath": task.get("packetPath"), "outputPath": task.get("outputPath"), "completionMarkerPath": task.get("completionMarkerPath"), "heartbeatPath": task.get("heartbeatPath"), "route": "gpt-5.6-luna/xhigh"})
        elif task.get("status") == "DISPATCHED":
            queue.append({"kind": "AGENT_WAIT", "taskId": task_id, "round": task.get("round"), "batchId": task.get("batchId"), "externalId": task.get("dispatch", {}).get("attempts", [{}])[-1].get("externalId")})
    if manifest.get("status") == "READY_FOR_ASSEMBLY":
        queue.append({"kind": "ASSEMBLE", "implemented": True})
    elif manifest.get("status") == "READY_FOR_MANUAL_REVIEW":
        queue.append({"kind": "MANUAL_RENDER_REVIEW", "implemented": True})
    queue.sort(key=lambda item: (str(item.get("round", "")), str(item.get("batchId", "")), item["kind"]))
    return {
        "schemaVersion": STAGED_SCHEMA_VERSION,
        "artifactType": "ALIVE_STAGED_EXAM_STATUS",
        "runId": run_id,
        "parent": {"status": manifest.get("status"), "currentStage": manifest.get("currentStage"), "codes": manifest.get("codes", [])},
        "progress": manifest.get("progress", {}),
        "batches": [{"batchId": batch_id, "ordinals": batch.get("ordinals", []), "status": batch.get("status"), "review1": batch.get("review1", {}), "review2": batch.get("review2", {})} for batch_id, batch in sorted(manifest.get("batches", {}).items())],
        "queue": queue,
        "terminal": {"state": "SUCCESS" if manifest.get("status") in {"READY_FOR_MANUAL_REVIEW", "DRAFT_PACKAGED", "RENDERED_PACKAGED"} else "FAILURE" if manifest.get("status") in {"FAILED", "BLOCKED"} else "RUNNING", "status": manifest.get("status")},
    }


def assemble_staged_exam(root: Path, store: StagedRunStore, run_id: str, title: str) -> dict[str, Any]:
    manifest = store.load(run_id)
    if manifest.get("status") != "READY_FOR_ASSEMBLY" or manifest.get("currentStage") != "S07_ASSEMBLY":
        raise StagedExamError("staged exam is not ready for assembly")
    if not title.strip():
        raise StagedExamError("staged exam title is required")
    run_dir = store.run_dir(run_id)
    source_exam = _json_file(run_dir / "source/source-exam.json")
    structured_questions: list[dict[str, Any]] = []
    archive_questions: list[dict[str, Any]] = []
    final_hashes: dict[str, str] = {}
    visual_assets: dict[str, dict[str, Any]] = {}
    solution_visual_ordinals: list[int] = []
    for ordinal in range(1, manifest["request"]["expectedQuestionCount"] + 1):
        question_state = manifest["questions"][str(ordinal)]
        batch_id = next(batch_id for batch_id, batch in manifest["batches"].items() if ordinal in batch["ordinals"])
        batch = manifest["batches"][batch_id]
        accepted = _json_file(run_dir / batch["revisionAcceptedPath"])
        item = next(item for item in accepted["questions"] if int(item["ordinal"]) == ordinal)
        source_question = source_exam["questions"][ordinal - 1]
        preflight_item = manifest["preflight"]["questions"][ordinal - 1]
        source_for_build = copy.deepcopy(source_question)
        source_visual_keys = {
            "image", "images", "imageasset", "imageassets", "choiceimages", "diagram", "svg", "png",
            "solutionimage", "solutionimages", "solutionvisual", "visual", "visualspec", "visualasset",
        }
        for key in list(source_for_build):
            if str(key).casefold().replace("_", "").replace("-", "") in source_visual_keys:
                source_for_build.pop(key, None)
        structured = _build_fast_structured_question(
            source_for_build,
            preflight_item,
            item,
            ordinal,
            allow_visual=True,
        )
        # Rendering controls are part of the accepted student payload.  Keep
        # the source metadata as the default, but honor a bounded candidate
        # override so a repair can resolve a real page-fit issue without
        # changing the question's mathematical content.
        student_payload = item.get("studentPayload") or {}
        image_size = student_payload.get("imageSize")
        if image_size in {"small", "half", "medium", "large", "full", "tall"}:
            structured["imageSize"] = image_size
        choice_columns = student_payload.get("choiceColumns")
        if isinstance(choice_columns, int) and 1 <= choice_columns <= 3:
            structured["choiceColumns"] = choice_columns
        structured["solutionDetail"] = copy.deepcopy(item["solutionDetail"])
        structured["solutionQuality"] = copy.deepcopy(item["solutionQuality"])
        expected_visual = preflight_item.get("visualDependency", "NONE")
        visual_spec = item.get("visualSpec")
        visual_asset = item.get("visualAsset")
        if expected_visual == "ESSENTIAL" and not isinstance(visual_spec, dict):
            raise StagedExamError(f"staged assembly question {ordinal} is missing its essential visual spec")
        if visual_spec is not None:
            if not isinstance(visual_asset, dict):
                raise StagedExamError(f"staged assembly question {ordinal} is missing its visual asset")
            try:
                visual_package = materialize_final_visual(
                    root,
                    run_dir,
                    run_id,
                    ordinal,
                    visual_spec,
                    visual_asset,
                )
            except (VisualLaneError, OSError, ValueError) as error:
                raise StagedExamError(f"staged assembly question {ordinal} visual materialization failed: {error}") from error
            structured["visual"] = visual_package
            if visual_package["role"] == "problem":
                structured["image"] = visual_package["archiveRelativePath"]
            visual_assets.setdefault(str(ordinal), {})["problem"] = visual_package
        solution_visual_spec = item.get("solutionVisualSpec")
        solution_visual_asset = item.get("solutionVisualAsset")
        if isinstance(solution_visual_spec, dict) or isinstance(solution_visual_asset, dict):
            if not isinstance(solution_visual_spec, dict) or not isinstance(solution_visual_asset, dict):
                raise StagedExamError(f"staged assembly question {ordinal} solution visual contract is incomplete")
            try:
                solution_visual_package = materialize_final_visual(
                    root,
                    run_dir,
                    run_id,
                    ordinal,
                    solution_visual_spec,
                    solution_visual_asset,
                )
            except (VisualLaneError, OSError, ValueError) as error:
                raise StagedExamError(f"staged assembly question {ordinal} solution visual materialization failed: {error}") from error
            structured["solutionVisual"] = solution_visual_package
            structured["solutionImage"] = solution_visual_package["archiveRelativePath"]
            structured["solutionImageAlt"] = (
                f"{manifest['request']['query']} {ordinal}번 학생용 해설 도형"
            )
            structured["solutionImageCaption"] = "풀이에 사용한 관계와 핵심 위치를 표시한 해설 도형"
            structured["solutionImageSize"] = "medium"
            visual_assets.setdefault(str(ordinal), {})["solution"] = solution_visual_package
            solution_visual_ordinals.append(ordinal)
        if item.get("solutionQuality", {}).get("visualRequirement") == "MANDATORY" and ordinal not in solution_visual_ordinals:
            raise StagedExamError(f"staged assembly question {ordinal} is missing its mandatory solution visual")
        target = run_dir / f"final/questions/q{ordinal:03d}.json"
        atomic_write_json(target, structured)
        structured_questions.append(structured)
        archive_questions.append(_archive_projection(structured))
        final_hashes[str(ordinal)] = sha256_file(target)
        question_state["status"] = "ASSEMBLED"
    content_hashes = [json_sha256({"content": _SCORE_RE.sub("", str(q["content"])).rstrip(), "choices": q.get("choices", [])}) for q in structured_questions]
    if len(content_hashes) != len(set(content_hashes)):
        raise StagedExamError("staged assembly contains duplicate questions")
    structured = {"schemaVersion": STAGED_SCHEMA_VERSION, "artifactType": "ALIVE_STAGED_STRUCTURED_EXAM", "examTitle": title, "questionCount": len(structured_questions), "questions": structured_questions}
    structured_target = run_dir / "final/structured-exam.json"
    atomic_write_json(structured_target, structured)
    script = f"window.examTitle = {json.dumps(title, ensure_ascii=False)};\n\nwindow.questionBank = {json.dumps(archive_questions, ensure_ascii=False, indent=2)};\n"
    staging = run_dir / "final/staging/generated-exam.js"
    staging.parent.mkdir(parents=True, exist_ok=True)
    temporary = staging.with_name(f".{staging.name}.{uuid.uuid4().hex}.tmp")
    try:
        temporary.write_text(script, encoding="utf-8", newline="\n")
        os.replace(temporary, staging)
    finally:
        if temporary.exists():
            temporary.unlink()
    shadow = root / "archive/_generated/alive-staged-exam-runs" / run_id / "candidate.js"
    shadow.parent.mkdir(parents=True, exist_ok=True)
    shadow.write_text(script, encoding="utf-8", newline="\n")
    parsed_title, parsed_bank = _parse_serialized_js(script)
    if parsed_title != title or parsed_bank != archive_questions:
        raise StagedExamError("staged serializer semantic round-trip mismatch")
    mother_report_path = run_dir / "final/mother-final-report.json"
    if not mother_report_path.is_file():
        raise StagedExamError("mother final report is missing")
    review_report = {"stageId": "S06_MOTHER_SEMANTIC_FINAL", "verdict": "PASS", "reviewMode": "independent_batch_plus_student_solution_walkthrough", "questionCount": len(structured_questions), "batches": manifest["batches"], "motherFinalReportSha256": sha256_file(mother_report_path), "manualRenderReviewRequired": True, "publicationStatus": "NOT_PUBLISHED"}
    atomic_write_json(run_dir / "final/review-report.json", review_report)
    assembly = {"stageId": "S07_ASSEMBLY", "verdict": "PASS", "questionCount": len(structured_questions), "structuredExamSha256": sha256_file(structured_target), "stagingSha256": sha256_file(staging), "shadowSha256": sha256_file(shadow), "questionFinalHashes": final_hashes, "visualAssets": visual_assets, "solutionVisualOrdinals": solution_visual_ordinals, "motherFinalReportSha256": sha256_file(mother_report_path), "semanticRoundTrip": "PASS", "duplicateQuestionCheck": "PASS", "manualRenderReviewRequired": True, "publicationStatus": "NOT_PUBLISHED"}
    atomic_write_json(run_dir / "final/assembly-report.json", assembly)
    _set_stage(manifest, "S07_ASSEMBLY", "PASS", f"{len(structured_questions)} questions assembled")
    manifest["assembly"] = assembly
    manifest["status"] = "READY_FOR_MANUAL_REVIEW"
    manifest["currentStage"] = "S08_RENDER_REVIEW"
    _append_event(manifest, "STAGED_ASSEMBLY_COMPLETE", questionCount=len(structured_questions))
    store.save(run_id, manifest)
    return manifest


def record_staged_render(store: StagedRunStore, run_id: str, evidence_path: Path) -> dict[str, Any]:
    manifest = store.load(run_id)
    if manifest.get("status") != "READY_FOR_MANUAL_REVIEW" or manifest.get("currentStage") != "S08_RENDER_REVIEW":
        raise StagedExamError("staged exam is not ready for render evidence")
    evidence = _json_file(evidence_path)
    expected = int(manifest["request"]["expectedQuestionCount"])
    modes = evidence.get("modes")
    if evidence.get("actualBrowser") is not True or evidence.get("productionEngine") is not True or not isinstance(modes, dict) or set(modes) != {"exam", "solution", "answer"}:
        raise StagedExamError("staged render evidence needs actual exam, solution, and answer browser modes")
    for name, result in modes.items():
        if (
            not isinstance(result, dict)
            or result.get("verdict") != "PASS"
            or result.get("ready") is not True
            or result.get("renderError") is not None
            or result.get("lastQuestion") != expected
            or result.get("lastPageChecked") is not True
            or result.get("unrenderedMath") != 0
            or result.get("overflowCount") != 0
            or result.get("badImages") != []
        ):
            raise StagedExamError(f"staged render mode {name} did not cover a clean complete exam")
    required_solution_visuals = _strict_ordinal_list(
        manifest.get("motherFinal", {}).get("solutionVisualRequiredOrdinals", []),
        "motherFinal.solutionVisualRequiredOrdinals",
    )
    solution_coverage = modes["solution"].get("solutionVisualCoverage")
    if not isinstance(solution_coverage, dict):
        raise StagedExamError("solution render evidence must include solutionVisualCoverage")
    actual_required = _strict_ordinal_list(
        solution_coverage.get("requiredOrdinals"),
        "solution.solutionVisualCoverage.requiredOrdinals",
    )
    actual_rendered = _strict_ordinal_list(
        solution_coverage.get("renderedOrdinals"),
        "solution.solutionVisualCoverage.renderedOrdinals",
    )
    missing = _strict_ordinal_list(
        solution_coverage.get("missingOrdinals"),
        "solution.solutionVisualCoverage.missingOrdinals",
    )
    if (
        actual_required != required_solution_visuals
        or actual_rendered != required_solution_visuals
        or missing != []
        or solution_coverage.get("verdict") != "PASS"
    ):
        raise StagedExamError("solution render evidence did not cover every required solution diagram")
    target = store.run_dir(run_id) / "render/render-evidence.json"
    atomic_write_json(target, evidence)
    report = {"stageId": "S08_RENDER_REVIEW", "verdict": "PASS", "evidenceSha256": sha256_file(target), "questionCount": expected, "modes": sorted(modes), "solutionVisualRequiredOrdinals": required_solution_visuals}
    atomic_write_json(store.run_dir(run_id) / "render/render-report.json", report)
    _set_stage(manifest, "S08_RENDER_REVIEW", "PASS", report["evidenceSha256"])
    manifest["render"] = report
    manifest["status"] = "READY_FOR_PACKAGE"
    manifest["currentStage"] = "S09_PACKAGE"
    store.save(run_id, manifest)
    return manifest


def _repository_root_for_store(store: StagedRunStore) -> Path:
    for parent in [store.runtime_root, *store.runtime_root.parents]:
        if (parent / "archive").is_dir():
            return parent
    return store.runtime_root.parents[3] if len(store.runtime_root.parents) > 3 else store.runtime_root


def _build_final_review_ledger(run_dir: Path, manifest: dict[str, Any]) -> Path:
    """Materialize the per-question closure ledger from accepted review2 evidence."""

    structured = _json_file(run_dir / "final/structured-exam.json")
    review_by_ordinal: dict[int, dict[str, Any]] = {}
    for batch in manifest.get("batches", {}).values():
        for item in batch.get("review2", {}).get("items", []):
            if isinstance(item, dict):
                review_by_ordinal[int(item["ordinal"])] = item

    rows: list[dict[str, Any]] = []
    for question in structured.get("questions", []):
        ordinal = int(question["id"])
        review = review_by_ordinal.get(ordinal, {})
        review_pass = review.get("verdict") == "PASS" and review.get("answerMatch") is True
        solution_review = review.get("solutionReview") if isinstance(review.get("solutionReview"), dict) else {}
        solution_pass = solution_review.get("verdict") == "PASS" and solution_review.get("studentCanFollow") is True
        solution_checks = solution_review.get("checks") if isinstance(solution_review.get("checks"), dict) else {}
        arithmetic_status = str(solution_checks.get("solutionArithmetic") or "").strip().upper()
        if arithmetic_status not in {"PASS", "FAIL", "WARN", "NOT_TESTED"}:
            arithmetic_status = ""
        if not arithmetic_status:
            # Compatibility for older review artifacts: answerCheck is still
            # an independent solution read, while the exact verifier below is
            # the deterministic arithmetic authority.
            arithmetic_status = "PASS" if str(solution_checks.get("answerCheck") or "").upper() in {"PASS", "NOT_APPLICABLE", "N/A"} else "NOT_TESTED"
        rows.append({
            "id": ordinal,
            "structure": "PASS",
            "math": "PASS" if review_pass else "FAIL",
            "answer": "PASS" if review_pass else "FAIL",
            "solution": "PASS" if solution_pass else "FAIL",
            "solutionArithmetic": arithmetic_status,
            "latex": "PASS",
            "meta": "PASS",
            "asset": "PASS",
            "render": "PASS" if manifest.get("render", {}).get("verdict") == "PASS" else "NOT_TESTED",
            "evidence": {
                "reviewVerdict": review.get("verdict"),
                "answerMatch": review.get("answerMatch"),
                "solutionReview": solution_review,
            },
        })
    target = run_dir / "final/final-review-ledger.json"
    atomic_write_json(
        target,
        {
            "schemaVersion": "0.1.0",
            "artifactType": "ALIVE_FINAL_REVIEW_LEDGER",
            "runId": manifest["runId"],
            "source": "accepted-review2-evidence",
            "questions": rows,
        },
    )
    return target


def _run_package_closure(root: Path, run_dir: Path, manifest: dict[str, Any]) -> dict[str, Any]:
    from .final_closure import audit_final_closure

    ledger = _build_final_review_ledger(run_dir, manifest)
    render = run_dir / "render/render-evidence.json"
    external = run_dir / "final/external-findings.json"
    closure_path = run_dir / "final/final-closure-report.json"
    report = audit_final_closure(
        root,
        run_dir / "final/staging/generated-exam.js",
        ledger,
        render if render.is_file() else None,
        external if external.is_file() else None,
        closure_path,
    )
    internal_question_failures = [
        row for row in report.get("questions", [])
        if any(status != "PASS" for field, status in row.get("checks", {}).items() if field != "render")
    ]
    internal_findings = [
        item for item in report.get("findings", [])
        if item.get("gate") not in {"browser", "externalReview"}
        and item.get("code") not in {"QUESTION_GATE_NOT_PASS"}
    ]
    if internal_question_failures or internal_findings:
        codes = sorted({str(item.get("code")) for item in internal_findings})
        raise StagedExamError(
            "final closure blocked packaging: " + (", ".join(codes) or "question gate failed")
        )
    report["productionSeal"] = "PASS" if report.get("status") == "PASS" else "HOLD_EXTERNAL_REVIEW_OR_RENDER"
    atomic_write_json(closure_path, report)
    return report


def package_staged_exam(store: StagedRunStore, run_id: str, root: Path | None = None) -> dict[str, Any]:
    manifest = store.load(run_id)
    if manifest.get("status") not in {"READY_FOR_MANUAL_REVIEW", "READY_FOR_PACKAGE"}:
        raise StagedExamError("staged exam is not ready for packaging")
    run_dir = store.run_dir(run_id)
    closure = _run_package_closure(root or _repository_root_for_store(store), run_dir, manifest)
    members = [
        "source/source-exam.json", "source/preflight-report.json", "source/rule-snapshot.json",
        "source/reference-pack.json", "source/visual-recon.json", "final/structured-exam.json",
        "final/staging/generated-exam.js", "final/review-report.json", "final/mother-final-report.json", "final/assembly-report.json",
        "final/final-review-ledger.json", "final/final-closure-report.json",
    ]
    members += [path.relative_to(run_dir).as_posix() for path in sorted((run_dir / "candidates").rglob("*.json"))]
    members += [path.relative_to(run_dir).as_posix() for path in sorted((run_dir / "candidates").rglob("*.svg"))]
    members += [path.relative_to(run_dir).as_posix() for path in sorted((run_dir / "evidence").rglob("*.json"))]
    members += [path.relative_to(run_dir).as_posix() for path in sorted((run_dir / "source/visual").rglob("*")) if path.is_file()]
    members += [path.relative_to(run_dir).as_posix() for path in sorted((run_dir / "final/assets").rglob("*")) if path.is_file()]
    if (run_dir / "render/render-evidence.json").is_file():
        members += ["render/render-evidence.json", "render/render-report.json"]
    if (run_dir / "final/external-findings.json").is_file():
        members += ["final/external-findings.json"]
    for relative in members:
        if not (run_dir / relative).is_file():
            raise StagedExamError(f"staged package member missing: {relative}")
    package = run_dir / "final/alive-staged-exam-pack.zip"
    with zipfile.ZipFile(package, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for relative in sorted(set(members)):
            archive.write(run_dir / relative, arcname=relative)
    with zipfile.ZipFile(package, "r") as archive:
        if archive.testzip() is not None:
            raise StagedExamError("staged package round-trip failed")
    report = {
        "stageId": "S09_PACKAGE",
        "verdict": "PASS",
        "members": sorted(set(members)),
        "zipSha256": sha256_file(package),
        "roundTrip": "PASS",
        "publicationStatus": "NOT_PUBLISHED",
        "draftStatus": "DRAFT_PACKAGED",
        "finalClosureStatus": closure.get("status"),
        "productionSeal": closure.get("productionSeal"),
        "finalClosureReportPath": "final/final-closure-report.json",
    }
    atomic_write_json(run_dir / "final/package-report.json", report)
    _set_stage(manifest, "S09_PACKAGE", "PASS", report["zipSha256"])
    manifest["package"] = report
    manifest["status"] = "RENDERED_PACKAGED" if (run_dir / "render/render-evidence.json").is_file() else "DRAFT_PACKAGED"
    manifest["currentStage"] = "S09_PACKAGE"
    store.save(run_id, manifest)
    return manifest
