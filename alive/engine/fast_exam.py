from __future__ import annotations

"""Durable state machine for the FAST_EXAM pipeline.

FAST_EXAM is the bounded, whole-exam production path.  It owns the local
parent Run, blinded artifacts, bounded recovery, assembly, render evidence,
and packaging.  The strict R03-R17 runtime remains separate and is never
silently substituted for this path.
"""

import copy
import json
import os
import re
import shutil
import uuid
import zipfile
from pathlib import Path
from typing import Any

from .exam_batch import preflight_exam
from .phase3 import _archive_projection, _parse_serialized_js
from .run_store import RunStore, atomic_write_json, make_run_id, sha256_file, utc_now
from .source_question import artifact_sha256, json_sha256
from .exact_verifier import verify_question
from .metadata_finalizer import finalize_similar_metadata, infer_semantic_question_type
from .serialization_lint import normalize_serializable_text


FAST_EXAM_VERSION = "0.1.1-distractor-evidence"
FAST_SCHEMA_VERSION = "0.1.0"
FAST_MAX_DISPATCH_ATTEMPTS = 3
FAST_VARIATION_MODES = ("CONFIRMATION", "STRUCTURAL_VARIANT")
FAST_DEFAULT_VARIATION_MODE = "STRUCTURAL_VARIANT"
FAST_STAGES = (
    ("F00_SOURCE_LOCK", "Fast source lock"),
    ("F01_PREFLIGHT", "Fast whole-exam preflight"),
    ("F02_GENERATION", "Question generation"),
    ("F03_BLINDED_REVIEW", "Blinded question review"),
    ("F04_ASSEMBLY", "Whole-exam assembly"),
    ("F05_REAL_RENDER", "Whole-exam real render"),
    ("F06_PACKAGE", "Fast evidence package"),
    ("F07_AUTO_READY", "Automatic production ready"),
)
_QUESTION_TYPES = {
    "MCQ",
    "SHORT_ANSWER",
    "CONSTRUCTED_RESPONSE",
    "객관식",
    "주관식",
    "단답형",
    "서술형",
}
_ANSWER_TYPES = {
    "choice_index",
    "choice_indices",
    "integer",
    "rational",
    "decimal",
    "expression",
    "equation",
    "inequality",
    "interval",
    "set",
    "ordered_pair",
    "multiple_values",
    "text",
}
_EQUIVALENCE_POLICIES = {
    "exact",
    "exact_index",
    "normalized_string",
    "numeric_equivalence",
    "symbolic_equivalence",
    "equation_equivalence",
    "set_equivalence",
    "interval_equivalence",
}
_HIDDEN_SOURCE_KEYS = {
    "answer",
    "solution",
    "explanation",
    "answerexplanation",
    "correctanswer",
    "solutionimage",
    "solutionimages",
    "solutionvisual",
}
_FORBIDDEN_REVIEW_KEYS = {
    "answercontract",
    "solution",
    "builderanswer",
    "buildernotes",
    "builderanalysis",
    "transformationplan",
    "sourcesolution",
}
_CHOICE_LABEL_RE = re.compile(r"^\s*(?:[①②③④⑤]|\(?[1-5]\)?[.)])\s*")
_CIRCLED_TO_INDEX = {"①": "1", "②": "2", "③": "3", "④": "4", "⑤": "5"}
_SCORE_TAIL_RE = re.compile(
    r"\s*\[(?:부분\s*점수\s*(?:없음|있음)\s*,\s*)?\d+(?:\.\d+)?\s*점\]\s*$"
)
_NUMERIC_LITERAL_RE = re.compile(
    r"[-+]?(?:\d+(?:\.\d*)?|\.\d+)"
)
_IR_TO_ARCHIVE = {
    "MCQ": "객관식",
    "SHORT_ANSWER": "주관식",
    "CONSTRUCTED_RESPONSE": "서술형",
}
_FAST_DISTRACTOR_ERROR_FAMILIES = frozenset(
    {
        "OMISSION",
        "SIGN",
        "COEFFICIENT",
        "EXPONENT",
        "BOUNDARY",
        "ORDER_OF_OPERATIONS",
        "ALGEBRAIC_MANIPULATION",
        "CONDITION_INTERPRETATION",
        "SUBSTITUTION",
        "ARITHMETIC",
        "REPRESENTATION_INTERPRETATION",
        "OTHER",
        # Historical ALIVE review envelopes sometimes use a precise trap
        # name instead of one of the short canonical labels.  Keep these
        # names auditable and distinct rather than collapsing unrelated traps
        # into one family during compatibility normalization.
        "WITNESS_AS_UNIVERSAL_AND_DOUBLE_DEGREE_DROP",
        "ZERO_VALUE_AS_EXTREMUM_WITH_PARITY_REVERSAL",
        "DERIVATIVE_BEHAVIOR_TRANSFER_AND_FACTOR_DEGREE_OMISSION",
        "EXTREMUM_TRANSFER_FROM_FUNCTION_TO_DERIVATIVE",
    }
)
_FAST_DISTRACTOR_FAMILY_ALIASES = {
    "누락": "OMISSION",
    "생략": "OMISSION",
    "OMISSION_ERROR": "OMISSION",
    "부호": "SIGN",
    "SIGN_ERROR": "SIGN",
    "계수": "COEFFICIENT",
    "COEFFICIENT_ERROR": "COEFFICIENT",
    "지수": "EXPONENT",
    "EXPONENT_ERROR": "EXPONENT",
    "경계": "BOUNDARY",
    "구간": "BOUNDARY",
    "끝점": "BOUNDARY",
    "BOUNDARY_ERROR": "BOUNDARY",
    "연산순서": "ORDER_OF_OPERATIONS",
    "연산_순서": "ORDER_OF_OPERATIONS",
    "ORDER_ERROR": "ORDER_OF_OPERATIONS",
    "전개": "ALGEBRAIC_MANIPULATION",
    "대수조작": "ALGEBRAIC_MANIPULATION",
    "ALGEBRA": "ALGEBRAIC_MANIPULATION",
    "ALGEBRA_ERROR": "ALGEBRAIC_MANIPULATION",
    "조건해석": "CONDITION_INTERPRETATION",
    "조건_해석": "CONDITION_INTERPRETATION",
    "CONDITION_ERROR": "CONDITION_INTERPRETATION",
    "DOMAIN_CONDITION_DISREGARD": "CONDITION_INTERPRETATION",
    "SINGLE_BRANCH_OF_SQUARED_PARAMETER": "CONDITION_INTERPRETATION",
    "대입": "SUBSTITUTION",
    "SUBSTITUTION_ERROR": "SUBSTITUTION",
    "산술": "ARITHMETIC",
    "계산": "ARITHMETIC",
    "계산오류": "ARITHMETIC",
    "계산_오류": "ARITHMETIC",
    "CALCULATION": "ARITHMETIC",
    "CALCULATION_ERROR": "ARITHMETIC",
    "ARITHMETIC_ERROR": "ARITHMETIC",
    "LINEAR_TERM_FACTORING_COEFFICIENT": "COEFFICIENT",
    "COMPLETED_SQUARE_CONSTANT_OMISSION": "OMISSION",
    "SQUARE_EXPANSION_CROSS_TERM_LOSS": "ALGEBRAIC_MANIPULATION",
    "SUM_INSTEAD_OF_DIFFERENCE": "ARITHMETIC",
    "SUM_SCOPE_MISREAD": "REPRESENTATION_INTERPRETATION",
    "TELESCOPE_ENDPOINT_OMISSION": "OMISSION",
    "TELESCOPE_SIGN_REVERSAL": "SIGN",
    "SUM_LIMIT_OFF_BY_ONE": "BOUNDARY",
    "VERTICAL_EXTREMUM_SPAN_AS_ANSWER": "REPRESENTATION_INTERPRETATION",
    "SQUARE_PARAMETER_WIDTH_CONFUSION": "ALGEBRAIC_MANIPULATION",
    "QUADRATIC_FORMULA_SIGN": "SIGN",
    "CONSTANT_TERM_OMISSION": "OMISSION",
    "BINOMIAL_CROSS_TERM_COEFFICIENT": "COEFFICIENT",
    "DISTRIBUTED_SIGN": "ALGEBRAIC_MANIPULATION",
    "표현해석": "REPRESENTATION_INTERPRETATION",
    "표현_해석": "REPRESENTATION_INTERPRETATION",
    "표현": "REPRESENTATION_INTERPRETATION",
    "REPRESENTATION": "REPRESENTATION_INTERPRETATION",
    "ORDER": "ORDER_OF_OPERATIONS",
}
_FAST_ROUTE_OPERATION_HINTS = (
    "누락", "빠뜨", "생략", "부호", "계수", "지수", "전개", "인수분해",
    "미분", "적분", "대입", "상한", "하한", "구간", "끝점", "교점",
    "연산", "분배", "치환", "조건", "해석", "계산", "이항", "방정식", "바꾸", "대신", "잘못", "omitt", "omit", "sign", "coefficient",
    "solve", "obtain", "drop", "ignore", "take", "reverse", "subtract", "subtraction", "minus", "endpoint", "upper", "lower", "expand", "factor", "differentiat", "integrat", "substitut",
    "bound", "endpoint", "interval", "intersection", "order of operation",
    "interpret", "algebra", "solve", "comput", "calculat",
)
_FAST_ROUTE_RESULT_HINTS = (
    "결과", "얻", "선택", "고르", "값", "계산하여", "=", "→", "->", "gives", "yields",
)


class FastExamError(ValueError):
    """Raised when a FAST_EXAM manifest or artifact violates its contract."""


def _fast_variation_profile(variation_mode: str | None) -> dict[str, Any]:
    """Return the explicit whole-exam variation policy.

    ``CONFIRMATION`` is the intentionally limited numeric/surface confirmation
    lane.  ``STRUCTURAL_VARIANT`` is the default similar-question lane and
    requires at least one non-numeric structural delta.  Both profiles keep
    the source response form and difficulty band; ``ADVANCED`` here describes
    the transformation policy, not an automatic difficulty increase.
    """

    aliases = {
        "NUMERIC": "CONFIRMATION",
        "NUMERIC_CONFIRMATION": "CONFIRMATION",
        "STRUCTURAL": "STRUCTURAL_VARIANT",
        "STRUCTURAL_SIMILARITY": "STRUCTURAL_VARIANT",
    }
    normalized = str(variation_mode or FAST_DEFAULT_VARIATION_MODE).strip().upper()
    normalized = aliases.get(normalized, normalized)
    if normalized not in FAST_VARIATION_MODES:
        raise FastExamError(
            f"unsupported FAST variation mode: {variation_mode}; "
            f"expected one of {', '.join(FAST_VARIATION_MODES)}"
        )
    if normalized == "CONFIRMATION":
        return {
            "variationMode": normalized,
            "generationMode": "EXAM_FOLLOWUP",
            "followupKind": "CONFIRMATION",
            "profileId": "WHOLE_EXAM_CONFIRMATION_FAST",
            "label": "numeric_confirmation",
            "numericOnlyAllowed": True,
            "structuralDeltaRequired": False,
            "distractorProvenanceRequired": True,
        }
    return {
        "variationMode": normalized,
        "generationMode": "EXAM_FOLLOWUP",
        "followupKind": "ADVANCED",
        "profileId": "WHOLE_EXAM_STRUCTURAL_FAST",
        "label": "structural_similarity",
        "numericOnlyAllowed": False,
        "structuralDeltaRequired": True,
        "distractorProvenanceRequired": True,
    }


class FastRunStore(RunStore):
    """RunStore with an isolated FAST_EXAM directory layout."""

    _DIRECTORIES = ("source", "questions", "inbox", "tasks", "final", "render")

    def create(self, run_id: str, manifest: dict[str, Any]) -> Path:
        run_dir = self.run_dir(run_id)
        run_dir.mkdir(parents=False, exist_ok=False)
        for name in self._DIRECTORIES:
            (run_dir / name).mkdir()
        atomic_write_json(run_dir / "manifest.json", manifest)
        return run_dir


def fast_runtime_root(root: Path, override: str | None = None) -> Path:
    return Path(override).resolve() if override else root / "alive" / "runtime" / "fast-runs"


def fast_capability_report() -> dict[str, Any]:
    """Report the bounded MVP capability and its deliberate visual boundary."""

    return {
        "active": True,
        "status": "ACTIVE_MVP",
        "version": FAST_EXAM_VERSION,
        "scope": "NONVISUAL_WHOLE_EXAM",
        "implemented": [
            "fast_parent_manifest",
            "fast_source_preflight",
            "fast_question_state",
            "fast_task_packets",
            "fast_inbox_acceptance",
            "fast_dispatch_receipts",
            "fast_resume_reconciliation",
            "fast_manifest_inbox_regression_tests",
            "fast_variation_profiles",
            "fast_draft_quality_precheck",
            "bounded_regeneration_reducer",
            "whole_exam_assembly",
            "whole_exam_serializer_round_trip",
            "whole_exam_real_render_gate",
            "evidence_package",
        ],
        "missing": ["essential_visual_generation_lane"],
        "variationModes": list(FAST_VARIATION_MODES),
        "defaultVariationMode": FAST_DEFAULT_VARIATION_MODE,
        "fallback": "STRICT_AUDIT_EXPLICIT_ONLY",
    }


def _fast_stages() -> list[dict[str, Any]]:
    return [
        {"stageId": stage_id, "label": label, "status": "PENDING", "evidence": []}
        for stage_id, label in FAST_STAGES
    ]


def _set_stage(manifest: dict[str, Any], stage_id: str, status: str, evidence: str) -> None:
    stage = next((item for item in manifest["stages"] if item["stageId"] == stage_id), None)
    if stage is None:
        raise FastExamError(f"unknown fast stage: {stage_id}")
    stage["status"] = status
    stage["evidence"].append(evidence)


def _atomic_copy(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(f".{target.name}.{uuid.uuid4().hex}.tmp")
    try:
        shutil.copyfile(source, temporary)
        temporary.replace(target)
    finally:
        if temporary.exists():
            temporary.unlink()


def _json_file(path: Path) -> dict[str, Any]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise FastExamError(f"invalid JSON artifact: {path}") from error
    if not isinstance(payload, dict):
        raise FastExamError("fast artifact root must be an object")
    return payload


def _student_payload(question: dict[str, Any]) -> dict[str, Any]:
    payload = {
        key: copy.deepcopy(value)
        for key, value in question.items()
        if key.lower() not in _HIDDEN_SOURCE_KEYS
    }
    payload.pop("artifactSha256", None)
    return payload


def _source_question_path(ordinal: int) -> str:
    return f"source/student/q{ordinal:03d}.json"


def _task_suffix(kind: str, lane: str) -> str:
    if kind == "QUESTION_BUILDER":
        return "builder"
    return "verifier" if lane == "primary" else "verifier-recheck"


def _task_id(ordinal: int, attempt: int, kind: str, lane: str = "primary") -> str:
    suffix = _task_suffix(kind, lane)
    return f"q{ordinal:03d}-a{attempt:02d}-{suffix}"


def _artifact_filename(
    ordinal: int, attempt: int, kind: str, lane: str = "primary"
) -> str:
    suffix = "draft" if kind == "QUESTION_BUILDER" else (
        "review" if lane == "primary" else "review-recheck"
    )
    return f"q{ordinal:03d}-{suffix}-a{attempt:02d}.json"


def _accepted_relative_path(
    ordinal: int, attempt: int, kind: str, lane: str = "primary"
) -> str:
    suffix = "draft" if kind == "QUESTION_BUILDER" else (
        "review" if lane == "primary" else "review-recheck"
    )
    return f"questions/q{ordinal:03d}/attempt-{attempt:02d}/{suffix}.json"


def _task_packet(
    manifest: dict[str, Any],
    *,
    ordinal: int,
    attempt: int,
    kind: str,
    lane: str,
    output_path: str,
    allowed_inputs: list[str],
    forbidden_inputs: list[str],
) -> dict[str, Any]:
    task_id = _task_id(ordinal, attempt, kind, lane)
    return {
        "schemaVersion": FAST_SCHEMA_VERSION,
        "artifactType": "ALIVE_FAST_TASK_PACKET",
        "taskId": task_id,
        "runId": manifest["runId"],
        "taskKind": kind,
        "lane": lane,
        "producerId": (
            "alive-fast-question-builder" if kind == "QUESTION_BUILDER"
            else "alive-fast-blinded-verifier"
        ),
        "questionOrdinal": ordinal,
        "attempt": attempt,
        "sourceLockSha256": manifest["sourceLock"]["sha256"],
        "sourceQuestionSha256": manifest["questions"][str(ordinal)]["sourceQuestionSha256"],
        "allowedInputPaths": allowed_inputs,
        "forbiddenInputPaths": forbidden_inputs,
        "generationProfile": copy.deepcopy(
            manifest.get("request", {}).get(
                "generationProfile", _fast_variation_profile("CONFIRMATION")
            )
        ),
        "outputPath": output_path,
        "route": {"model": "gpt-5.6-luna", "reasoning": "xhigh"},
        "status": "PENDING",
    }


def _new_task(
    manifest: dict[str, Any],
    *,
    ordinal: int,
    attempt: int,
    kind: str,
    lane: str,
    packet_path: str,
    output_path: str,
) -> dict[str, Any]:
    task_id = _task_id(ordinal, attempt, kind, lane)
    return {
        "taskId": task_id,
        "kind": kind,
        "lane": lane,
        "status": "PENDING",
        "ordinal": ordinal,
        "attempt": attempt,
        "producerId": (
            "alive-fast-question-builder" if kind == "QUESTION_BUILDER"
            else "alive-fast-blinded-verifier"
        ),
        "packetPath": packet_path,
        "outputPath": output_path,
        "acceptedPath": _accepted_relative_path(ordinal, attempt, kind, lane),
        "generationProfile": copy.deepcopy(
            manifest.get("request", {}).get(
                "generationProfile", _fast_variation_profile("CONFIRMATION")
            )
        ),
        "route": {"model": "gpt-5.6-luna", "reasoning": "xhigh"},
        "dispatch": {"attempts": []},
    }


def _append_event(manifest: dict[str, Any], event_type: str, **details: Any) -> None:
    manifest.setdefault("events", []).append({"at": utc_now(), "type": event_type, **details})


def _question_risk(preflight_item: dict[str, Any]) -> list[str]:
    flags: list[str] = []
    if preflight_item.get("visualDependency") != "NONE":
        flags.append("VISUAL_DEPENDENCY")
    if _normalize_question_type(preflight_item.get("normalizedQuestionType")) == "CONSTRUCTED_RESPONSE":
        flags.append("CONSTRUCTED_RESPONSE")
    return flags


def _write_builder_packet(run_dir: Path, manifest: dict[str, Any], ordinal: int, attempt: int) -> None:
    question = manifest["questions"][str(ordinal)]
    output_path = f"inbox/{_artifact_filename(ordinal, attempt, 'QUESTION_BUILDER', 'primary')}"
    packet = _task_packet(
        manifest,
        ordinal=ordinal,
        attempt=attempt,
        kind="QUESTION_BUILDER",
        lane="primary",
        output_path=output_path,
        allowed_inputs=[question["studentSourcePath"]],
        forbidden_inputs=["source/source-exam.json"],
    )
    packet_path = f"tasks/{packet['taskId']}.json"
    task = _new_task(
        manifest,
        ordinal=ordinal,
        attempt=attempt,
        kind="QUESTION_BUILDER",
        lane="primary",
        packet_path=packet_path,
        output_path=output_path,
    )
    manifest.setdefault("tasks", {})[task["taskId"]] = task
    question["builderTaskId"] = task["taskId"]
    atomic_write_json(run_dir / packet_path, packet)


def _write_verifier_packet(
    run_dir: Path,
    manifest: dict[str, Any],
    ordinal: int,
    attempt: int,
    draft_path: str,
    lane: str = "primary",
) -> None:
    question = manifest["questions"][str(ordinal)]
    output_path = f"inbox/{_artifact_filename(ordinal, attempt, 'BLINDED_VERIFIER', lane)}"
    student_path = f"questions/q{ordinal:03d}/attempt-{attempt:02d}/student.json"
    packet = _task_packet(
        manifest,
        ordinal=ordinal,
        attempt=attempt,
        kind="BLINDED_VERIFIER",
        lane=lane,
        output_path=output_path,
        allowed_inputs=[question["studentSourcePath"], student_path],
        forbidden_inputs=["source/source-exam.json", draft_path, "final/*"],
    )
    packet_path = f"tasks/{packet['taskId']}.json"
    task = _new_task(
        manifest,
        ordinal=ordinal,
        attempt=attempt,
        kind="BLINDED_VERIFIER",
        lane=lane,
        packet_path=packet_path,
        output_path=output_path,
    )
    manifest.setdefault("tasks", {})[task["taskId"]] = task
    question["verifierTaskId"] = task["taskId"]
    question.setdefault("reviewTaskIds", []).append(task["taskId"])
    atomic_write_json(run_dir / packet_path, packet)


def start_fast_exam(
    root: Path,
    store: FastRunStore,
    source_file: str,
    query: str | None,
    engine_version: str,
    source_resolution: dict[str, Any] | None = None,
    variation_mode: str = FAST_DEFAULT_VARIATION_MODE,
) -> dict[str, Any]:
    exam, preflight = preflight_exam(root, source_file)
    variation_profile = _fast_variation_profile(variation_mode)
    fast_held = [
        item["ordinal"]
        for item in preflight["questions"]
        if item.get("status") == "SUPPORTED" and item.get("visualDependency") != "NONE"
    ]
    preflight["fastCapability"] = {
        "profile": "NONVISUAL_WHOLE_EXAM_MVP",
        "supported": preflight["wholeExamReady"] and not fast_held,
        "heldOrdinals": fast_held,
        "reason": "essential or optional visual dependency is outside the first fast MVP"
        if fast_held else None,
    }
    fast_whole_exam_ready = preflight["wholeExamReady"] and not fast_held
    run_id = make_run_id(f"fast {query or preflight['examTitle']} 전체 유사")
    now = utc_now()
    manifest: dict[str, Any] = {
        "schemaVersion": FAST_SCHEMA_VERSION,
        "artifactType": "ALIVE_FAST_EXAM_RUN",
        "engineVersion": engine_version,
        "fastExamVersion": FAST_EXAM_VERSION,
        "runId": run_id,
        "createdAt": now,
        "updatedAt": now,
        "status": "PENDING",
        "currentStage": "F00_SOURCE_LOCK",
        "codes": [],
        "request": {
            "query": query or preflight["examTitle"],
            "sourceFile": preflight["sourceLock"]["path"],
            "executionMode": "FAST_EXAM",
            "generationMode": variation_profile["generationMode"],
            "followupKind": variation_profile["followupKind"],
            "variationMode": variation_profile["variationMode"],
            "generationProfile": variation_profile,
            "operationMode": "GENERATE",
            "outputProfile": "JS_ARCHIVE",
            "expectedQuestionCount": preflight["questionCount"],
            "examProfile": variation_profile["profileId"],
            "modelProfile": {"model": "gpt-5.6-luna", "reasoning": "xhigh"},
        },
        "sourceLock": preflight["sourceLock"],
        "sourceResolution": source_resolution or {
            "status": "UNIQUE",
            "selected": {"path": preflight["sourceLock"]["path"]},
            "questionOrdinal": None,
            "candidates": [],
        },
        "stages": _fast_stages(),
        "events": [],
        "preflight": {
            key: value for key, value in preflight.items()
            if key not in {"artifactType", "schemaVersion", "sourceLock"}
        },
        "questions": {},
        "tasks": {},
        "progress": {},
    }
    _set_stage(manifest, "F00_SOURCE_LOCK", "PASS", manifest["sourceLock"]["sha256"])
    _set_stage(
        manifest,
        "F01_PREFLIGHT",
        "PASS" if fast_whole_exam_ready else "BLOCKED",
        f"supported={preflight['supportedCount']} held={preflight['heldCount']} fastHeld={fast_held}",
    )
    if not fast_whole_exam_ready:
        manifest["status"] = "BLOCKED"
        manifest["currentStage"] = "F01_PREFLIGHT"
        codes = {
            "FAST_PREFLIGHT_FAIL",
            *preflight.get("examCodes", []),
            *(code for item in preflight["questions"] for code in item.get("codes", [])),
        }
        if fast_held:
            codes.add("FAST_VISUAL_NOT_SUPPORTED")
        manifest["codes"] = sorted(codes)
    else:
        manifest["status"] = "GENERATING"
        manifest["currentStage"] = "F02_GENERATION"

    run_dir = store.create(run_id, manifest)
    atomic_write_json(run_dir / "source" / "source-exam.json", exam)
    atomic_write_json(run_dir / "source" / "preflight-report.json", preflight)
    if not fast_whole_exam_ready:
        _append_event(manifest, "FAST_PREFLIGHT_BLOCKED", heldOrdinals=preflight["heldOrdinals"])
        store.save(run_id, manifest)
        return manifest

    for ordinal in preflight["supportedOrdinals"]:
        source_question = exam["questions"][ordinal - 1]
        preflight_item = preflight["questions"][ordinal - 1]
        student = _student_payload(source_question)
        student_path = _source_question_path(ordinal)
        atomic_write_json(run_dir / student_path, student)
        manifest["questions"][str(ordinal)] = {
            "ordinal": ordinal,
            "sourceId": source_question.get("id"),
            "sourceQuestionSha256": preflight_item["sourceQuestionSha256"],
            "studentSourcePath": student_path,
            "studentSourceSha256": json_sha256(student),
            "status": "PENDING",
            "attempt": 0,
            "riskFlags": _question_risk(preflight_item),
            "manualAuditRecommended": bool(_question_risk(preflight_item)),
            "codes": [],
            "builderTaskId": None,
            "verifierTaskId": None,
            "reviewTaskIds": [],
            "accepted": {},
            "attemptHistory": [],
        }
    for ordinal in preflight["supportedOrdinals"]:
        _write_builder_packet(run_dir, manifest, ordinal, 0)
    _append_event(manifest, "FAST_TASKS_PREPARED", count=len(manifest["tasks"]))
    _refresh_manifest(manifest)
    store.save(run_id, manifest)
    return manifest


def _resolve_task(manifest: dict[str, Any], task_id: str) -> dict[str, Any]:
    task = manifest.get("tasks", {}).get(task_id)
    if not isinstance(task, dict):
        raise FastExamError(f"fast task not found: {task_id}")
    return task


def _validate_identity(payload: dict[str, Any], task: dict[str, Any], manifest: dict[str, Any]) -> None:
    expected = {
        "schemaVersion": FAST_SCHEMA_VERSION,
        "runId": manifest["runId"],
        "producerId": task["producerId"],
        "sourceLockSha256": manifest["sourceLock"]["sha256"],
        "sourceQuestionSha256": manifest["questions"][str(task["ordinal"])]["sourceQuestionSha256"],
        "questionOrdinal": task["ordinal"],
        "attempt": task["attempt"],
    }
    for key, value in expected.items():
        if payload.get(key) != value:
            raise FastExamError(f"fast artifact identity mismatch: {key}")
    if payload.get("artifactType") not in {
        "ALIVE_FAST_QUESTION_DRAFT",
        "ALIVE_FAST_QUESTION_REVIEW",
    }:
        raise FastExamError("unsupported fast artifact type")
    if not isinstance(payload.get("artifactId"), str) or not payload["artifactId"].strip():
        raise FastExamError("fast artifactId is required")
    if payload.get("artifactSha256") != artifact_sha256(payload):
        raise FastExamError("fast artifactSha256 mismatch")


def _normalize_answer(value: Any, *, answer_type: str | None = None) -> str:
    if isinstance(value, dict):
        value = value.get("canonicalAnswer")
    if not isinstance(value, str):
        value = str(value) if isinstance(value, (int, float)) and not isinstance(value, bool) else ""
    normalized = value.strip().replace(" ", "")
    if answer_type == "choice_index":
        normalized = _CIRCLED_TO_INDEX.get(normalized, normalized)
    elif answer_type == "choice_indices":
        raw = re.split(r"[,，、;/;\s]+", normalized)
        indices: list[int] = []
        for item in raw:
            if not item:
                continue
            if item in _CIRCLED_TO_INDEX:
                index = int(_CIRCLED_TO_INDEX[item])
            elif item.isdigit():
                index = int(item)
            else:
                return normalized.casefold()
            if not 1 <= index <= 5 or index in indices:
                return normalized.casefold()
            indices.append(index)
        if indices:
            return ",".join(str(index) for index in sorted(indices))
    return normalized.casefold()


def _compat_choice_text(value: Any) -> str:
    """Compare historical choice text despite harmless math delimiters."""

    normalized = _normalize_answer(value)
    for token in ("$", r"\displaystyle", r"\left", r"\right", r"\(", r"\)"):
        normalized = normalized.replace(token, "")
    return normalized


def _manifest_variation_profile(manifest: dict[str, Any]) -> dict[str, Any]:
    """Resolve the variation profile, keeping old manifests readable."""

    request = manifest.get("request", {})
    profile = request.get("generationProfile")
    if isinstance(profile, dict) and profile.get("variationMode"):
        return _fast_variation_profile(profile["variationMode"])
    return _fast_variation_profile(request.get("variationMode", "CONFIRMATION"))


def _numeric_surface_signature(student: dict[str, Any]) -> str:
    """Normalize visible text enough to detect number-only structural clones."""

    visible = {
        "content": student.get("content", ""),
        "choices": student.get("choices", []),
    }
    serialized = json.dumps(visible, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    serialized = _SCORE_TAIL_RE.sub("", serialized)
    return _NUMERIC_LITERAL_RE.sub("<NUM>", serialized).replace(" ", "")


def _canonical_distractor_family(value: Any) -> str:
    """Normalize the small, auditable vocabulary used for distractor traps."""

    text = str(value or "").strip().casefold()
    if not text:
        return ""
    compact = re.sub(r"[\s-]+", "_", text).upper()
    return _FAST_DISTRACTOR_FAMILY_ALIASES.get(compact, compact)


def _route_has_concrete_evidence(route: str) -> bool:
    """Reject labels that merely call something a mistake without tracing it."""

    text = route.strip().casefold()
    if len(text) < 12:
        return False
    if text in {
        "계산 실수",
        "계산 오류",
        "계산상의 실수",
        "calculation mistake",
        "calculation error",
        "arithmetic mistake",
        "an error in calculation",
    }:
        return False
    has_operation = any(token in text for token in _FAST_ROUTE_OPERATION_HINTS)
    has_result = bool(_NUMERIC_LITERAL_RE.search(route)) or any(
        token in text for token in _FAST_ROUTE_RESULT_HINTS
    )
    return has_operation and has_result


def _validate_distractor_provenance(
    student: dict[str, Any], contract: dict[str, Any], plan: dict[str, Any]
) -> None:
    """Require one concrete, choice-indexed trap route for every distractor."""

    if student.get("questionType") not in {"MCQ", "객관식"}:
        return
    choices = student.get("choices")
    provenance = plan.get("distractorProvenance")
    if not isinstance(choices, list) or not isinstance(provenance, list):
        raise FastExamError("FAST_DISTRACTOR_PROVENANCE_REQUIRED")
    answer_type = contract.get("answerType")
    answer = _normalize_answer(contract.get("canonicalAnswer"), answer_type=answer_type)
    answer_indices = {
        int(item) for item in answer.split(",") if item.isdigit() and 1 <= int(item) <= 5
    }
    if not answer_indices:
        raise FastExamError("FAST_DISTRACTOR_PROVENANCE_ANSWER_INDEX_INVALID")
    expected = set(range(1, len(choices) + 1)) - answer_indices
    if len(provenance) != len(expected):
        raise FastExamError("FAST_DISTRACTOR_PROVENANCE_COUNT_MISMATCH")
    seen: set[int] = set()
    seen_families: set[str] = set()
    for item in provenance:
        if not isinstance(item, dict):
            raise FastExamError("FAST_DISTRACTOR_PROVENANCE_ENTRY_INVALID")
        choice_index = item.get("choiceIndex")
        route = item.get("errorRoute")
        if not isinstance(choice_index, int) or choice_index not in expected or choice_index in seen:
            raise FastExamError("FAST_DISTRACTOR_PROVENANCE_INDEX_INVALID")
        if not isinstance(route, str) or len(route.strip()) < 8:
            raise FastExamError("FAST_DISTRACTOR_PROVENANCE_ROUTE_MISSING")
        family = _canonical_distractor_family(item.get("errorFamily"))
        if not family:
            raise FastExamError("FAST_DISTRACTOR_PROVENANCE_FAMILY_REQUIRED")
        if family not in _FAST_DISTRACTOR_ERROR_FAMILIES:
            raise FastExamError("FAST_DISTRACTOR_PROVENANCE_FAMILY_INVALID")
        if family in seen_families:
            raise FastExamError("FAST_DISTRACTOR_PROVENANCE_FAMILY_DUPLICATE")
        if not _route_has_concrete_evidence(route):
            raise FastExamError("FAST_DISTRACTOR_PROVENANCE_ROUTE_NOT_CONCRETE")
        seen.add(choice_index)
        seen_families.add(family)
    if seen != expected:
        raise FastExamError("FAST_DISTRACTOR_PROVENANCE_INDEX_MISMATCH")


def _validate_generation_quality(
    payload: dict[str, Any],
    task: dict[str, Any],
    manifest: dict[str, Any],
    run_dir: Path | None,
) -> None:
    """Apply deterministic pre-builder gates before a candidate reaches review."""

    student = payload["studentPayload"]
    contract = payload["answerContract"]
    plan = payload["transformationPlan"]
    profile = _manifest_variation_profile(manifest)
    declared_mode = plan.get("variationMode")
    if declared_mode is not None:
        try:
            declared_mode = _fast_variation_profile(declared_mode)["variationMode"]
        except FastExamError as error:
            raise FastExamError("FAST_VARIATION_MODE_INVALID") from error
        if declared_mode != profile["variationMode"]:
            raise FastExamError("FAST_VARIATION_MODE_MISMATCH")
    if profile["structuralDeltaRequired"]:
        structural_delta = plan.get("structuralDelta")
        if not isinstance(structural_delta, list) or not structural_delta:
            raise FastExamError("FAST_STRUCTURAL_DELTA_REQUIRED")
        non_numeric_delta = False
        for item in structural_delta:
            if isinstance(item, str):
                description = item.strip()
                dimension = ""
            elif isinstance(item, dict):
                description = str(
                    item.get("description")
                    or item.get("change")
                    or item.get("rationale")
                    or item.get("summary")
                    or ""
                ).strip()
                dimension = str(item.get("dimension", "")).strip().casefold()
            else:
                description = ""
                dimension = ""
            if len(description) < 8:
                raise FastExamError("FAST_STRUCTURAL_DELTA_ENTRY_INVALID")
            if dimension not in {
                "numeric", "coefficient", "constant", "time", "score",
                "choice_values", "notation", "surface",
            }:
                non_numeric_delta = True
        if not non_numeric_delta:
            raise FastExamError("FAST_STRUCTURAL_DELTA_MUST_BE_NON_NUMERIC")
        if run_dir is not None:
            question = manifest["questions"][str(task["ordinal"])]
            source_path = run_dir / question["studentSourcePath"]
            if (
                source_path.is_file()
                and _numeric_surface_signature(_json_file(source_path))
                == _numeric_surface_signature(student)
            ):
                raise FastExamError("FAST_STRUCTURAL_SURFACE_CLONE")
    if profile["distractorProvenanceRequired"]:
        _validate_distractor_provenance(student, contract, plan)


def _validate_student_payload(payload: Any) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise FastExamError("studentPayload must be an object")
    question_type = payload.get("questionType")
    if question_type not in _QUESTION_TYPES:
        raise FastExamError("studentPayload.questionType is unsupported")
    content = payload.get("content")
    if not isinstance(content, str) or not content.strip():
        raise FastExamError("studentPayload.content is required")
    for key in payload:
        if key.lower() in _HIDDEN_SOURCE_KEYS or key.lower() in {
            "answercontract", "canonicalanswer", "acceptableanswers", "equivalencepolicy"
        }:
            raise FastExamError(f"studentPayload contains hidden field: {key}")
    choices = payload.get("choices", [])
    if not isinstance(choices, list) or any(not isinstance(choice, str) or not choice.strip() for choice in choices):
        raise FastExamError("studentPayload.choices must be a string array")
    is_mcq = question_type in {"MCQ", "객관식"}
    if is_mcq and len(choices) != 5:
        raise FastExamError("MCQ studentPayload must contain five choices")
    if not is_mcq and choices:
        raise FastExamError("non-MCQ studentPayload choices must be empty")
    if any(_CHOICE_LABEL_RE.match(choice) for choice in choices):
        raise FastExamError("studentPayload choices must not contain rendered labels")
    return payload


def _solution_text(value: Any) -> str:
    if isinstance(value, str):
        return value.strip()
    if not isinstance(value, dict):
        return ""
    lines: list[str] = []
    for key in ("text", "solutionText", "explanation"):
        text_value = value.get(key)
        if isinstance(text_value, str) and text_value.strip():
            lines.append(text_value.strip())
            break
    for key in ("completeSolution", "solutionIR"):
        nested_text = _solution_text(value.get(key))
        if nested_text:
            lines.append(nested_text)
            break
    method = value.get("method")
    if isinstance(method, str) and method.strip():
        lines.append(method.strip())
    steps = value.get("steps", [])
    if isinstance(steps, list):
        for index, step in enumerate(steps, 1):
            if isinstance(step, dict):
                expression = step.get("expression")
                explanation = step.get("explanation")
                conclusion = step.get("conclusion")
                claim = step.get("claim")
                work = step.get("work")
                body = " ".join(
                    str(item).strip()
                    for item in (expression, explanation, claim, work, conclusion)
                    if isinstance(item, str) and item.strip()
                )
            else:
                body = str(step).strip()
            if body:
                lines.append(f"{index}. {body}")
    for key in ("finalConclusion", "finalAnswer", "verification"):
        value_item = value.get(key)
        if isinstance(value_item, str) and value_item.strip():
            lines.append(value_item.strip())
    return "\n".join(lines).strip()


def _compat_student_payload(payload: dict[str, Any]) -> tuple[dict[str, Any], list[str]]:
    """Project historical ``problemIR`` output into the FAST student payload."""

    student = payload.get("studentPayload")
    if isinstance(student, dict):
        return copy.deepcopy(student), []
    source = payload.get("problemIR") or payload.get("ProblemIR")
    if not isinstance(source, dict):
        return {}, []
    nested_student = source.get("studentPayload")
    student = copy.deepcopy(nested_student if isinstance(nested_student, dict) else source)
    if not student.get("questionType") and student.get("responseForm"):
        response_form = str(student["responseForm"]).upper()
        student["questionType"] = _IR_TO_ARCHIVE.get(response_form, student["responseForm"])
    for key in list(student):
        if key.lower() in _HIDDEN_SOURCE_KEYS:
            student.pop(key, None)
    return student, ["DERIVED_STUDENT_PAYLOAD"]


def _compat_answer_contract(payload: dict[str, Any]) -> tuple[dict[str, Any], list[str]]:
    """Normalize the built-in ALIVE IR envelope into the FAST contract.

    The role runtime may emit the repository's historical ``AnswerContract``
    shape.  This adapter preserves the generated student payload and records
    every deterministic envelope conversion; it never invents a mathematical
    answer when a choice index or canonical answer is unavailable.
    """

    raw = payload.get("answerContract")
    source_key = "answerContract"
    if not isinstance(raw, dict):
        raw = payload.get("AnswerContract")
        source_key = "AnswerContract"
    if not isinstance(raw, dict):
        raise FastExamError("draft.answerContract is required")
    contract = copy.deepcopy(raw)
    normalizations: list[str] = []
    if "answerType" not in contract and contract.get("type") is not None:
        contract["answerType"] = contract["type"]
        normalizations.append("ANSWER_TYPE_FIELD_ALIAS")
    if "canonicalAnswer" not in contract:
        if contract.get("canonicalIndex") is not None:
            contract["canonicalAnswer"] = str(contract["canonicalIndex"])
            normalizations.append("CANONICAL_INDEX_FIELD_ALIAS")
        elif contract.get("correctChoiceOrdinal") is not None:
            contract["canonicalAnswer"] = str(contract["correctChoiceOrdinal"])
            normalizations.append("CORRECT_CHOICE_ORDINAL_ALIAS")
        elif payload.get("canonicalAnswer") is not None:
            contract["canonicalAnswer"] = payload["canonicalAnswer"]
            normalizations.append("TOP_LEVEL_CANONICAL_ANSWER_ALIAS")
    student = payload.get("studentPayload", {})
    is_mcq = isinstance(student, dict) and student.get("questionType") in {"MCQ", "객관식"}
    if source_key != "answerContract":
        normalizations.append("ANSWER_CONTRACT_KEY_CASE")
    raw_answer_type = contract.get("answerType")
    normalized_answer_type = (
        str(raw_answer_type).strip().casefold().replace("-", "_").replace(" ", "_")
        if raw_answer_type is not None else ""
    )
    if normalized_answer_type == "choiceindex":
        normalized_answer_type = "choice_index"
    elif normalized_answer_type in {
        "mcq", "multiple_choice", "choice", "single_choice", "singlechoice", "객관식",
    }:
        normalized_answer_type = "choice_index"
    elif normalized_answer_type in {
        "short_answer", "constructed_response", "subjective", "주관식", "단답형", "서술형",
    }:
        normalized_answer_type = "text"
    if normalized_answer_type == "choice_index":
        contract["answerType"] = "choice_index"
        if raw_answer_type != "choice_index":
            normalizations.append("ANSWER_TYPE_ALIAS")
        choices = student.get("choices", []) if isinstance(student, dict) else []
        canonical = contract.get("canonicalAnswer")
        canonical_text = _normalize_answer(canonical)
        answer_text = _normalize_answer(contract.get("answerText"))
        matched_choice = None
        if isinstance(choices, list):
            canonical_choice_text = _compat_choice_text(canonical)
            answer_choice_text = _compat_choice_text(contract.get("answerText"))
            for index, choice in enumerate(choices, start=1):
                choice_text = _compat_choice_text(choice)
                if canonical_choice_text and choice_text == canonical_choice_text:
                    matched_choice = index
                    break
                if matched_choice is None and answer_choice_text and choice_text == answer_choice_text:
                    matched_choice = index
        choice_number = contract.get("answerChoiceNumber")
        choice_index = contract.get("choiceIndex", contract.get("answerIndex"))
        key_choice_index = contract.get("keyChoiceIndex")
        zero_based_key_index = contract.get("keyIndexZeroBased")
        key_position = contract.get("keyPosition")
        if canonical_text in {"1", "2", "3", "4", "5"}:
            one_based = int(canonical_text)
        elif matched_choice is not None:
            one_based = matched_choice
        elif isinstance(key_choice_index, int) and 1 <= key_choice_index <= 5:
            one_based = key_choice_index
        elif isinstance(choice_number, int) and 1 <= choice_number <= 5:
            one_based = choice_number
        elif isinstance(choice_index, int) and 0 <= choice_index <= 4:
            one_based = choice_index + 1
        elif isinstance(zero_based_key_index, int) and 0 <= zero_based_key_index <= 4:
            one_based = zero_based_key_index + 1
        elif isinstance(key_position, int) and 1 <= key_position <= 5:
            one_based = key_position
        elif isinstance(contract.get("correctChoiceIndex"), int) and 0 <= contract["correctChoiceIndex"] <= 4:
            one_based = contract["correctChoiceIndex"] + 1
        else:
            one_based = _CIRCLED_TO_INDEX.get(canonical_text, canonical_text)
            if one_based not in {"1", "2", "3", "4", "5"}:
                raise FastExamError("historical MCQ contract has no usable choice index")
            one_based = int(one_based)
        if is_mcq:
            contract["canonicalAnswer"] = str(one_based)
            contract["acceptableAnswers"] = []
            contract["equivalencePolicy"] = "exact_index"
            if matched_choice is not None or canonical_text != str(one_based):
                normalizations.append("DERIVED_MCQ_CHOICE_INDEX")
    if "answerType" not in contract:
        if is_mcq:
            choice_number = contract.get("answerChoiceNumber")
            key_choice_index = contract.get("keyChoiceIndex")
            choice_index = contract.get("correctChoiceIndex", contract.get("answerChoiceIndex"))
            zero_based_key_index = contract.get("keyIndexZeroBased")
            key_position = contract.get("keyPosition")
            choices = student.get("choices", []) if isinstance(student, dict) else []
            canonical = (
                contract.get("canonicalAnswer")
                or contract.get("answerText")
                or contract.get("correctChoice")
                or contract.get("correctChoiceValue")
                or contract.get("keyContent")
                or contract.get("keyChoice")
                or contract.get("acceptedAnswer")
            )
            canonical_text = _normalize_answer(canonical)
            matched_choice = None
            if isinstance(choices, list) and canonical_text:
                for index, choice in enumerate(choices, start=1):
                    if _compat_choice_text(choice) == _compat_choice_text(canonical):
                        matched_choice = index
                        break
            if isinstance(key_choice_index, int) and 1 <= key_choice_index <= 5:
                one_based = key_choice_index
            elif matched_choice is not None:
                one_based = matched_choice
            elif isinstance(choice_number, int) and 1 <= choice_number <= 5:
                one_based = choice_number
            elif canonical_text in {"1", "2", "3", "4", "5"}:
                one_based = int(canonical_text)
            else:
                one_based = None
            if one_based is None and isinstance(choice_index, int) and 0 <= choice_index <= 4:
                one_based = choice_index + 1
            elif one_based is None and isinstance(zero_based_key_index, int) and 0 <= zero_based_key_index <= 4:
                one_based = zero_based_key_index + 1
            elif one_based is None and isinstance(key_position, int) and 1 <= key_position <= 5:
                one_based = key_position
            elif one_based is None:
                one_based = _CIRCLED_TO_INDEX.get(canonical_text, canonical_text)
                if one_based not in {"1", "2", "3", "4", "5"}:
                    raise FastExamError("historical MCQ contract has no usable choice index")
                one_based = int(one_based)
            contract["answerType"] = "choice_index"
            contract["canonicalAnswer"] = str(one_based)
            contract["acceptableAnswers"] = []
            contract["equivalencePolicy"] = "exact_index"
            normalizations.append("HISTORICAL_MCQ_CONTRACT")
        else:
            canonical = contract.get("canonicalAnswer")
            if not isinstance(canonical, str) or not canonical.strip():
                raise FastExamError("historical non-MCQ contract has no canonical answer")
            contract["answerType"] = "text"
            contract["acceptableAnswers"] = contract.get("acceptableAnswers", [])
            contract["equivalencePolicy"] = "normalized_string"
            normalizations.append("HISTORICAL_NON_MCQ_CONTRACT")
    if "equivalencePolicy" not in contract:
        contract["equivalencePolicy"] = "exact_index" if contract.get("answerType") == "choice_index" else "exact"
        normalizations.append("DEFAULT_EQUIVALENCE_POLICY")
    return contract, normalizations


def _normalize_fast_draft(
    payload: dict[str, Any],
    task: dict[str, Any],
    manifest: dict[str, Any],
) -> tuple[dict[str, Any], list[str]]:
    """Convert known historical builder envelopes before strict validation."""

    normalized = copy.deepcopy(payload)
    normalizations: list[str] = []
    if normalized.get("artifactType") in {
        "ALIVE_FAST_BUILDER_DRAFT",
        "ALIVE_FAST_DRAFT",
        "ALIVE_FAST_QUESTION_BUILDER_DRAFT",
    }:
        normalized["artifactType"] = "ALIVE_FAST_QUESTION_DRAFT"
        normalizations.append("DRAFT_ARTIFACT_TYPE_ALIAS")
    if not isinstance(normalized.get("artifactId"), str) or not normalized["artifactId"].strip():
        normalized["artifactId"] = f"{task['taskId']}-artifact"
        normalizations.append("DERIVED_ARTIFACT_ID")
    expected_source_lock = manifest["sourceLock"]["sha256"]
    expected_source_question = manifest["questions"][str(task["ordinal"])]["sourceQuestionSha256"]
    for key, expected, code in (
        ("runId", manifest["runId"], "DERIVED_RUN_ID"),
        ("producerId", task["producerId"], "DERIVED_PRODUCER_ID"),
        ("questionOrdinal", task["ordinal"], "DERIVED_QUESTION_ORDINAL"),
        ("attempt", task["attempt"], "DERIVED_ATTEMPT"),
    ):
        if normalized.get(key) is None:
            normalized[key] = expected
            normalizations.append(code)
    for key, expected, code in (
        ("sourceLockSha256", expected_source_lock, "DERIVED_SOURCE_LOCK_SHA256"),
        ("sourceQuestionSha256", expected_source_question, "DERIVED_SOURCE_QUESTION_SHA256"),
    ):
        if not isinstance(normalized.get(key), str) or not normalized[key].strip():
            normalized[key] = expected
            normalizations.append(code)
    if normalized.get("lane") != task.get("lane", "primary"):
        normalized["lane"] = task.get("lane", "primary")
        normalizations.append("DEFAULT_TASK_LANE")
    student, student_normalizations = _compat_student_payload(normalized)
    if student and normalized.get("studentPayload") != student:
        normalized["studentPayload"] = student
        normalizations.extend(student_normalizations)
    contract, contract_normalizations = _compat_answer_contract(normalized)
    if normalized.get("answerContract") != contract:
        normalized["answerContract"] = contract
        normalizations.extend(contract_normalizations)
    solution = normalized.get("solution")
    solution_sources = [
        solution,
        normalized.get("completeSolution"),
        normalized.get("SolutionIR"),
        normalized.get("solutionIR"),
    ]
    legacy_solution_distractors = next(
        (
            source.get("distractorAudit")
            for source in solution_sources
            if isinstance(source, dict) and isinstance(source.get("distractorAudit"), list)
        ),
        None,
    )
    solution_text = ""
    for solution_source in solution_sources:
        solution_text = _solution_text(solution_source)
        if solution_text:
            break
    if not solution_text:
        raise FastExamError("draft.solution is required")
    if not isinstance(solution, str) or solution != solution_text:
        normalized["solution"] = solution_text
        normalizations.append("SOLUTION_IR_TO_TEXT")
    if not isinstance(normalized.get("transformationPlan"), dict) or not normalized["transformationPlan"]:
        source_envelope = normalized.get("ProblemIR") or normalized.get("problemIR")
        source_plan = (
            source_envelope.get("transformationPlan")
            if isinstance(source_envelope, dict)
            and isinstance(source_envelope.get("transformationPlan"), dict)
            else source_envelope
        )
        if not isinstance(source_plan, dict) or not source_plan:
            source_plan = normalized.get("sourceAnalysis")
        normalized["transformationPlan"] = (
            copy.deepcopy(source_plan)
            if isinstance(source_plan, dict) and source_plan
            else {"operation": "fast-builder-output", "rationale": "historical ALIVE builder envelope"}
        )
        normalizations.append("DERIVED_TRANSFORMATION_PLAN")
    if isinstance(normalized.get("transformationPlan"), dict):
        structural_delta = normalized["transformationPlan"].get("structuralDelta")
        if isinstance(structural_delta, dict):
            normalized["transformationPlan"]["structuralDelta"] = [structural_delta]
            normalizations.append("STRUCTURAL_DELTA_OBJECT_TO_LIST")
        elif isinstance(structural_delta, str) and structural_delta.strip():
            normalized["transformationPlan"]["structuralDelta"] = [structural_delta]
            normalizations.append("STRUCTURAL_DELTA_STRING_TO_LIST")
        provenance = normalized["transformationPlan"].get("distractorProvenance")
        root_evidence = normalized.get("distractorEvidence")
        if not isinstance(provenance, list):
            audit = normalized["transformationPlan"].get("distractorAudit")
            audit_routes = (
                audit.get("choiceRoutes")
                if isinstance(audit, dict)
                else None
            )
            if isinstance(audit_routes, list):
                root_evidence = audit_routes
                normalizations.append("PLAN_DISTRACTOR_AUDIT_TO_EVIDENCE")
        if (
            not isinstance(root_evidence, list)
            and isinstance(normalized.get("answerContract"), dict)
        ):
            root_evidence = normalized["answerContract"].get("distractorEvidence")
        if not isinstance(root_evidence, list) and isinstance(legacy_solution_distractors, list):
            root_evidence = legacy_solution_distractors
        if not isinstance(provenance, list) and isinstance(root_evidence, list):
            choices = normalized.get("studentPayload", {}).get("choices", [])
            adapted_provenance: list[dict[str, Any]] = []
            for item in root_evidence:
                if not isinstance(item, dict) or item.get("isKey") is True:
                    continue
                adapted = copy.deepcopy(item)
                choice_value = (
                    item.get("choice")
                    or item.get("choiceValue")
                    or item.get("choiceContent")
                )
                if "choiceIndex" not in adapted and isinstance(choices, list):
                    for index, choice in enumerate(choices, start=1):
                        if _compat_choice_text(choice) == _compat_choice_text(choice_value):
                            adapted["choiceIndex"] = index
                            break
                if "choiceIndex" not in adapted and isinstance(item.get("choiceIndexZeroBased"), int):
                    zero_based_index = item["choiceIndexZeroBased"]
                    if 0 <= zero_based_index < len(choices):
                        adapted["choiceIndex"] = zero_based_index + 1
                route = adapted.get("errorRoute")
                if isinstance(route, dict):
                    route_parts = [
                        route.get("mistakenOperationOrInterpretation"),
                        route.get("operation"),
                        route.get("interpretation"),
                        route.get("intermediate"),
                        route.get("intermediateResult"),
                        route.get("result"),
                        route.get("finalResult"),
                    ]
                    adapted["errorRoute"] = " ".join(
                        (
                            " ".join(str(value).strip() for value in part if str(value).strip())
                            if isinstance(part, list)
                            else str(part).strip()
                        )
                        for part in route_parts
                        if part is not None and (
                            (isinstance(part, list) and any(str(value).strip() for value in part))
                            or (not isinstance(part, list) and str(part).strip())
                        )
                    )
                adapted_provenance.append(adapted)
            normalized["transformationPlan"]["distractorProvenance"] = adapted_provenance
            provenance = normalized["transformationPlan"]["distractorProvenance"]
            normalizations.append("ROOT_DISTRACTOR_EVIDENCE_TO_PLAN")
        if isinstance(provenance, list):
            for item in provenance:
                if not isinstance(item, dict) or "errorFamily" not in item:
                    continue
                family = _canonical_distractor_family(item.get("errorFamily"))
                if family and item.get("errorFamily") != family:
                    item["errorFamily"] = family
                    normalizations.append("DISTRACTOR_ERROR_FAMILY_ALIAS")
    if not isinstance(normalized.get("sourceFingerprint"), dict) or not normalized["sourceFingerprint"]:
        source_fingerprint = (
            normalized.get("ProblemIR")
            or normalized.get("problemIR")
            or normalized.get("sourceAnalysis")
        )
        normalized["sourceFingerprint"] = (
            copy.deepcopy(source_fingerprint)
            if isinstance(source_fingerprint, dict) and source_fingerprint
            else {"concept": "fast-builder-output"}
        )
        normalizations.append("DERIVED_SOURCE_FINGERPRINT")
    risk_flags = normalized.get("riskFlags")
    if not isinstance(risk_flags, list):
        normalized["riskFlags"] = []
        normalizations.append("DEFAULT_RISK_FLAGS")
    elif any(not isinstance(item, str) for item in risk_flags):
        adapted_risk_flags: list[str] = []
        for item in risk_flags:
            if isinstance(item, str):
                adapted_risk_flags.append(item)
                continue
            if isinstance(item, dict):
                code = item.get("code") or item.get("id") or item.get("name")
                detail = item.get("detail") or item.get("message") or item.get("description")
                severity = item.get("severity")
                prefix = str(code).strip() if code is not None else "RISK"
                if severity is not None and str(severity).strip():
                    prefix = f"{prefix} ({str(severity).strip()})"
                if detail is not None and str(detail).strip():
                    adapted_risk_flags.append(f"{prefix}: {str(detail).strip()}")
                else:
                    adapted_risk_flags.append(prefix)
                continue
            adapted_risk_flags.append(str(item).strip())
        normalized["riskFlags"] = adapted_risk_flags
        normalizations.append("RISK_FLAG_OBJECTS_TO_STRINGS")
    for legacy_key in ("selfHash", "selfHashSha256", "selfHashAlgorithm"):
        if legacy_key in normalized:
            normalized.pop(legacy_key, None)
            normalizations.append(f"DROP_{legacy_key.upper()}")
    if normalizations or normalized.get("artifactSha256") != artifact_sha256(normalized):
        normalized.pop("artifactSha256", None)
        normalized["artifactSha256"] = artifact_sha256(normalized)
        if "DERIVED_ARTIFACT_HASH" not in normalizations:
            normalizations.append("DERIVED_ARTIFACT_HASH")
    return normalized, sorted(set(normalizations))


def _normalize_fast_review(
    payload: dict[str, Any],
    task: dict[str, Any],
    manifest: dict[str, Any],
    run_dir: Path,
) -> tuple[dict[str, Any], list[str]]:
    """Normalize harmless historical review-envelope differences safely."""

    normalized = copy.deepcopy(payload)
    normalizations: list[str] = []
    if normalized.get("artifactType") in {
        "ALIVE_FAST_REVIEW",
        "ALIVE_FAST_VERIFIER_REVIEW",
        "ALIVE_FAST_REVIEW_SUBMISSION",
    }:
        normalized["artifactType"] = "ALIVE_FAST_QUESTION_REVIEW"
        normalizations.append("REVIEW_ARTIFACT_TYPE_ALIAS")
    if not isinstance(normalized.get("artifactId"), str) or not normalized["artifactId"].strip():
        normalized["artifactId"] = f"{task['taskId']}-artifact"
        normalizations.append("DERIVED_ARTIFACT_ID")
    expected_source_lock = manifest["sourceLock"]["sha256"]
    expected_source_question = manifest["questions"][str(task["ordinal"])] ["sourceQuestionSha256"]
    for key, expected, code in (
        ("runId", manifest["runId"], "DERIVED_RUN_ID"),
        ("sourceLockSha256", expected_source_lock, "DERIVED_SOURCE_LOCK_SHA256"),
        ("sourceQuestionSha256", expected_source_question, "DERIVED_SOURCE_QUESTION_SHA256"),
        ("questionOrdinal", task["ordinal"], "DERIVED_QUESTION_ORDINAL"),
        ("attempt", task["attempt"], "DERIVED_REVIEW_ATTEMPT"),
    ):
        if normalized.get(key) is None or (
            isinstance(expected, str)
            and (not isinstance(normalized.get(key), str) or not normalized[key].strip())
        ):
            normalized[key] = expected
            normalizations.append(code)
    if not isinstance(normalized.get("producerId"), str) or not normalized["producerId"].strip():
        normalized["producerId"] = task["producerId"]
        normalizations.append("DERIVED_PRODUCER_ID")
    if normalized.get("attempt") != task.get("attempt", 0):
        normalized["attempt"] = task.get("attempt", 0)
        normalizations.append("DEFAULT_REVIEW_ATTEMPT")
    if normalized.get("lane") != task.get("lane", "primary"):
        normalized["lane"] = task.get("lane", "primary")
        normalizations.append("DEFAULT_TASK_LANE")
    independent = normalized.get("independentAnswer")
    top_level_answer = normalized.get("canonicalAnswer")
    if not isinstance(independent, dict):
        for answer_key in ("answer", "derivedAnswer"):
            candidate_answer = normalized.get(answer_key)
            if isinstance(candidate_answer, dict):
                independent = copy.deepcopy(candidate_answer)
                normalizations.append(f"{answer_key.upper()}_TO_INDEPENDENT")
                break
    if not isinstance(independent, dict):
        scalar_key = next(
            (
                key
                for key in ("answer", "derivedAnswer")
                if isinstance(normalized.get(key), (str, int, float))
                and not isinstance(normalized.get(key), bool)
            ),
            None,
        )
        scalar_answer = normalized.get(scalar_key) if scalar_key else None
        if scalar_key is not None:
            raw_answer_type = normalized.get("answerType")
            answer_type_text = str(raw_answer_type or "").strip().casefold().replace("-", "_").replace(" ", "_")
            if answer_type_text in {"mcq", "choice", "multiple_choice", "choice_index", "choiceindex", "객관식"}:
                context = json.dumps(
                    {"checks": normalized.get("checks"), "gates": normalized.get("gates"), "findings": normalized.get("findings")},
                    ensure_ascii=False,
                ).casefold()
                if isinstance(scalar_answer, int) and 0 <= scalar_answer <= 4 and (
                    "choice_index" in context or "zero-based" in context or "0-based" in context
                ):
                    canonical = str(scalar_answer + 1)
                else:
                    canonical = _normalize_answer(scalar_answer, answer_type="choice_index")
                independent = {"answerType": "choice_index", "canonicalAnswer": canonical}
            else:
                independent = {"canonicalAnswer": str(scalar_answer)}
                if raw_answer_type is not None:
                    independent["answerType"] = raw_answer_type
            normalized["independentAnswer"] = independent
            normalizations.append(f"{scalar_key.upper()}_SCALAR_TO_INDEPENDENT")
    if not isinstance(independent, dict) and isinstance(top_level_answer, dict):
        independent = copy.deepcopy(top_level_answer)
        normalizations.append("TOP_LEVEL_CANONICAL_TO_INDEPENDENT")
    if isinstance(independent, dict) and not isinstance(independent.get("canonicalAnswer"), str):
        choice_index = independent.get("choiceIndex")
        zero_based_choice_index = independent.get("choice_index")
        if isinstance(zero_based_choice_index, int) and 0 <= zero_based_choice_index <= 4:
            independent["canonicalAnswer"] = str(zero_based_choice_index + 1)
        elif isinstance(choice_index, int) and 0 <= choice_index <= 5:
            # Current role envelopes use camelCase as a visible 1-based index.
            independent["canonicalAnswer"] = str(choice_index if choice_index else 1)
        elif isinstance(independent.get("value"), (str, int, float)):
            independent["canonicalAnswer"] = str(independent["value"])
            raw_value_type = str(independent.get("answerType") or "").strip().casefold().replace("-", "_").replace(" ", "_")
            if raw_value_type in {"choice_index", "choiceindex", "choice", "mcq", "multiple_choice"}:
                normalizations.append("REVIEW_VALUE_TO_CHOICE_INDEX")
    if isinstance(independent, dict) and normalized.get("independentAnswer") is not independent:
        normalized["independentAnswer"] = independent
        if "INDEPENDENT" not in "".join(normalizations):
            normalizations.append("DERIVED_INDEPENDENT_ANSWER")
    elif not isinstance(independent, dict) and isinstance(top_level_answer, (str, int, float)) and not isinstance(top_level_answer, bool):
        raw_answer_type = normalized.get("answerType")
        answer_type_text = str(raw_answer_type or "").strip().casefold().replace("-", "_").replace(" ", "_")
        if answer_type_text in {"mcq", "choice", "multiple_choice", "choice_index", "choiceindex", "객관식"}:
            independent = {
                "answerType": "choice_index",
                "canonicalAnswer": _normalize_answer(top_level_answer, answer_type="choice_index"),
            }
        else:
            independent = {"canonicalAnswer": str(top_level_answer)}
            if raw_answer_type is not None:
                independent["answerType"] = raw_answer_type
        normalized["independentAnswer"] = independent
        normalizations.append("TOP_LEVEL_ANSWER_TO_INDEPENDENT")
    if isinstance(independent, dict) and not isinstance(independent.get("canonicalAnswer"), str):
        value = independent.get("canonicalAnswer")
        if isinstance(value, (int, float)) and not isinstance(value, bool):
            independent["canonicalAnswer"] = str(value)
            normalizations.append("CANONICAL_ANSWER_TO_STRING")
    if isinstance(independent, dict):
        raw_answer_type = independent.get("answerType")
        normalized_answer_type = (
            str(raw_answer_type).strip().casefold().replace("-", "_").replace(" ", "_")
            if raw_answer_type is not None else ""
        )
        if normalized_answer_type in {"choiceindex", "choice", "mcq", "multiple_choice"}:
            normalized_answer_type = "choice_index"
        if normalized_answer_type == "choice_index":
            independent["answerType"] = "choice_index"
            if raw_answer_type != "choice_index":
                normalizations.append("ANSWER_TYPE_ALIAS")
    question = manifest["questions"][str(task["ordinal"])]
    accepted_draft = question.get("accepted", {}).get("draft")
    if (
        isinstance(accepted_draft, dict)
        and not isinstance(accepted_draft.get("answerContract"), dict)
        and isinstance(accepted_draft.get("path"), str)
    ):
        draft_path = run_dir / accepted_draft["path"]
        if draft_path.is_file():
            accepted_draft = _json_file(draft_path)
    if (
        isinstance(independent, dict)
        and "answerType" not in independent
        and isinstance(accepted_draft, dict)
        and isinstance(accepted_draft.get("answerContract"), dict)
    ):
        expected_answer_type = accepted_draft["answerContract"].get("answerType")
        if expected_answer_type in _ANSWER_TYPES:
            independent["answerType"] = expected_answer_type
            normalizations.append("INFERRED_REVIEW_ANSWER_TYPE")
    if isinstance(independent, dict):
        if independent.get("answerType") == "choice_index" and independent.get("value") is not None:
            value = _normalize_answer(independent.get("value"), answer_type="choice_index")
            if value in {"1", "2", "3", "4", "5"}:
                if independent.get("canonicalAnswer") != value:
                    independent["canonicalAnswer"] = value
                    normalizations.append("REVIEW_VALUE_TO_CHOICE_INDEX")
        if not isinstance(independent.get("canonicalAnswer"), str) or not independent["canonicalAnswer"].strip():
            top_level_answer = normalized.get("canonicalAnswer")
            if isinstance(top_level_answer, (str, int, float)) and not isinstance(top_level_answer, bool):
                independent["canonicalAnswer"] = str(top_level_answer)
                normalizations.append("TOP_LEVEL_ANSWER_TO_INDEPENDENT")
    if "verdict" not in normalized and normalized.get("overallStatus") in {"PASS", "FAIL"}:
        normalized["verdict"] = normalized["overallStatus"]
        normalizations.append("OVERALL_STATUS_TO_VERDICT")
    elif "verdict" not in normalized and normalized.get("overall") in {"PASS", "FAIL"}:
        normalized["verdict"] = normalized["overall"]
        normalizations.append("OVERALL_TO_VERDICT")
    elif normalized.get("verdict") == "UNVERIFIED":
        normalized["verdict"] = "FAIL"
        normalizations.append("UNVERIFIED_TO_FAIL")
    if isinstance(normalized.get("checks"), list) and normalized["checks"]:
        normalized["checks"] = {
            str(item.get("gate", index)) if isinstance(item, dict) else str(index): item
            for index, item in enumerate(normalized["checks"], start=1)
        }
        normalizations.append("CHECKS_LIST_TO_DICT")
    if not isinstance(normalized.get("checks"), dict) or not normalized["checks"]:
        gates = normalized.get("gates")
        if isinstance(gates, dict) and gates:
            normalized["checks"] = copy.deepcopy(gates)
            normalizations.append("GATES_TO_CHECKS")
        elif isinstance(gates, list) and gates:
            normalized["checks"] = {
                str(item.get("gate", index)) if isinstance(item, dict) else str(index): item
                for index, item in enumerate(gates, start=1)
            }
            normalizations.append("GATES_LIST_TO_CHECKS")
    if (
        "independenceLevel" not in normalized
        and normalized.get("independence") == "I2_SEPARATE_CALL"
    ):
        normalized["independenceLevel"] = normalized["independence"]
        normalizations.append("INDEPENDENCE_TO_LEVEL")
    expected_student_hash = question.get("accepted", {}).get("studentPayloadSha256")
    student_path = run_dir / f"questions/q{task['ordinal']:03d}/attempt-{task['attempt']:02d}/student.json"
    candidate_student_hash = (
        normalized.get("studentPayloadSha256")
        or normalized.get("studentQuestionSha256")
        or normalized.get("studentSha256")
        or normalized.get("studentHash")
    )
    if isinstance(expected_student_hash, str) and expected_student_hash.strip():
        if candidate_student_hash is None:
            normalized["studentPayloadSha256"] = expected_student_hash
            normalizations.append("DERIVED_STUDENT_PAYLOAD_HASH")
        elif normalized.get("studentPayloadSha256") is None:
            normalized["studentPayloadSha256"] = candidate_student_hash
            normalizations.append("STUDENT_QUESTION_HASH_ALIAS")
        elif (
            student_path.is_file()
            and candidate_student_hash == sha256_file(student_path)
            and candidate_student_hash != expected_student_hash
        ):
            normalized["studentPayloadSha256"] = expected_student_hash
            normalizations.append("STUDENT_HASH_FILE_TO_JSON")
    if not isinstance(normalized.get("findings"), list):
        normalized["findings"] = []
        normalizations.append("DEFAULT_FINDINGS")
    if normalizations or not isinstance(normalized.get("artifactSha256"), str):
        normalized.pop("artifactSha256", None)
        normalized["artifactSha256"] = artifact_sha256(normalized)
        normalizations.append("DERIVED_ARTIFACT_HASH")
    return normalized, sorted(set(normalizations))


def _validate_draft(
    payload: dict[str, Any],
    task: dict[str, Any],
    manifest: dict[str, Any],
    run_dir: Path | None = None,
) -> None:
    _validate_identity(payload, task, manifest)
    if payload["artifactType"] != "ALIVE_FAST_QUESTION_DRAFT":
        raise FastExamError("task requires a question draft artifact")
    _validate_student_payload(payload.get("studentPayload"))
    for key in ("sourceFingerprint", "transformationPlan", "answerContract"):
        if not isinstance(payload.get(key), dict) or not payload[key]:
            raise FastExamError(f"draft.{key} is required")
    contract = payload["answerContract"]
    answer_type = contract.get("answerType")
    canonical = contract.get("canonicalAnswer")
    if answer_type not in _ANSWER_TYPES:
        raise FastExamError("draft.answerContract.answerType is unsupported")
    equivalence = contract.get("equivalencePolicy")
    if equivalence not in _EQUIVALENCE_POLICIES:
        raise FastExamError("draft.answerContract.equivalencePolicy is unsupported")
    if not isinstance(canonical, str) or not canonical.strip():
        raise FastExamError("draft.answerContract.canonicalAnswer is required")
    acceptable = contract.get("acceptableAnswers", [])
    if not isinstance(acceptable, list) or any(not isinstance(item, str) for item in acceptable):
        raise FastExamError("draft.answerContract.acceptableAnswers must be a string array")
    student_type = payload["studentPayload"]["questionType"]
    if student_type in {"MCQ", "객관식"} and answer_type not in {"choice_index", "choice_indices"}:
        raise FastExamError("MCQ answerContract must use choice_index or choice_indices")
    if student_type not in {"MCQ", "객관식"} and answer_type in {"choice_index", "choice_indices"}:
        raise FastExamError("non-MCQ answerContract cannot use choice_index")
    if not isinstance(payload.get("solution"), str) or not payload["solution"].strip():
        raise FastExamError("draft.solution is required")
    risk_flags = payload.get("riskFlags", [])
    if not isinstance(risk_flags, list) or any(not isinstance(item, str) for item in risk_flags):
        raise FastExamError("draft.riskFlags must be a string array")
    _validate_generation_quality(payload, task, manifest, run_dir)


def _validate_review(payload: dict[str, Any], task: dict[str, Any], manifest: dict[str, Any]) -> None:
    _validate_identity(payload, task, manifest)
    if payload["artifactType"] != "ALIVE_FAST_QUESTION_REVIEW":
        raise FastExamError("task requires a blinded review artifact")
    for key in payload:
        if key.lower() in _FORBIDDEN_REVIEW_KEYS:
            raise FastExamError(f"review contains builder-only field: {key}")
    question = manifest["questions"][str(task["ordinal"])]
    accepted_draft = question.get("accepted", {}).get("draft")
    if not isinstance(accepted_draft, dict):
        raise FastExamError("review cannot be submitted before draft acceptance")
    if payload.get("studentPayloadSha256") != question.get("accepted", {}).get("studentPayloadSha256"):
        raise FastExamError("review studentPayloadSha256 does not match accepted draft")
    independent = payload.get("independentAnswer")
    if not isinstance(independent, dict) or not isinstance(independent.get("canonicalAnswer"), str):
        raise FastExamError("review.independentAnswer.canonicalAnswer is required")
    if not independent["canonicalAnswer"].strip():
        raise FastExamError("review.independentAnswer.canonicalAnswer is empty")
    if independent.get("answerType") not in _ANSWER_TYPES:
        raise FastExamError("review.independentAnswer.answerType is unsupported")
    if payload.get("verdict") not in {"PASS", "FAIL"}:
        raise FastExamError("review.verdict must be PASS or FAIL")
    if not isinstance(payload.get("checks"), dict) or not payload["checks"]:
        raise FastExamError("review.checks is required")
    if not isinstance(payload.get("findings", []), list):
        raise FastExamError("review.findings must be an array")
    if payload.get("independenceLevel") != "I2_SEPARATE_CALL":
        raise FastExamError("FAST_EXAM review must declare I2_SEPARATE_CALL")


def _same_answer(contract: dict[str, Any], independent: dict[str, Any]) -> bool:
    answer_type = contract.get("answerType")
    expected = {
        _normalize_answer(contract.get("canonicalAnswer"), answer_type=answer_type),
        *(
            _normalize_answer(item, answer_type=answer_type)
            for item in contract.get("acceptableAnswers", [])
        ),
    }
    actual = _normalize_answer(independent.get("canonicalAnswer"), answer_type=answer_type)
    return bool(actual) and actual in expected


def _inside_run(run_dir: Path, candidate: Path) -> Path:
    resolved = candidate.resolve()
    try:
        resolved.relative_to(run_dir.resolve())
    except ValueError as error:
        raise FastExamError("artifact path must stay inside the fast Run") from error
    return resolved


def _require_inbox_path(run_dir: Path, task: dict[str, Any], candidate: Path) -> Path:
    resolved = _inside_run(run_dir, candidate)
    expected = _inside_run(run_dir, run_dir / task["outputPath"])
    if resolved != expected:
        raise FastExamError(f"artifact must be written to task inbox path: {task['outputPath']}")
    if not resolved.is_file():
        raise FileNotFoundError(resolved)
    return resolved


def _add_question_code(question: dict[str, Any], code: str) -> None:
    question["codes"] = sorted(set(question.get("codes", []) + [code]))


def _schedule_recheck(
    run_dir: Path,
    manifest: dict[str, Any],
    question: dict[str, Any],
    task: dict[str, Any],
) -> None:
    """Schedule one independent recheck without creating a child Run."""

    ordinal = int(question["ordinal"])
    attempt = int(question.get("attempt", 0))
    existing = any(
        item.get("ordinal") == ordinal
        and item.get("attempt") == attempt
        and item.get("kind") == "BLINDED_VERIFIER"
        and item.get("lane") == "recheck"
        for item in manifest.get("tasks", {}).values()
    )
    if existing:
        return
    draft_path = question.get("accepted", {}).get("draft", {}).get("path")
    if not isinstance(draft_path, str):
        raise FastExamError("cannot recheck before a draft is accepted")
    question["status"] = "RECHECKING"
    _write_verifier_packet(
        run_dir,
        manifest,
        ordinal,
        attempt,
        draft_path,
        lane="recheck",
    )
    _append_event(
        manifest,
        "FAST_EXCEPTION_RECHECK_SCHEDULED",
        ordinal=ordinal,
        attempt=attempt,
        sourceTaskId=task["taskId"],
    )


def _schedule_regeneration(
    run_dir: Path,
    manifest: dict[str, Any],
    question: dict[str, Any],
    reason: str,
) -> None:
    """Reduce a failed question to one bounded regeneration attempt."""

    ordinal = int(question["ordinal"])
    current_attempt = int(question.get("attempt", 0))
    if current_attempt >= 1:
        question["status"] = "FAILED"
        _add_question_code(question, "FAST_REGENERATION_EXHAUSTED")
        manifest["codes"] = sorted(set(manifest.get("codes", []) + question["codes"]))
        manifest["status"] = "FAILED"
        manifest["currentStage"] = "F03_BLINDED_REVIEW"
        _append_event(
            manifest,
            "FAST_REGENERATION_EXHAUSTED",
            ordinal=ordinal,
            attempt=current_attempt,
            reason=reason,
        )
        return

    question.setdefault("attemptHistory", []).append({
        "attempt": current_attempt,
        "status": question.get("status"),
        "codes": list(question.get("codes", [])),
        "accepted": copy.deepcopy(question.get("accepted", {})),
        "reviewHistory": copy.deepcopy(question.get("reviewHistory", [])),
        "reviewVerdict": question.get("reviewVerdict"),
        "answerMatch": question.get("answerMatch"),
        "reason": reason,
    })
    next_attempt = current_attempt + 1
    question.update({
        "attempt": next_attempt,
        "status": "REGENERATING",
        "builderTaskId": None,
        "verifierTaskId": None,
        "reviewTaskIds": [],
        "accepted": {},
        "reviewHistory": [],
        "reviewVerdict": None,
        "answerMatch": None,
        "codes": [],
        "riskFlags": sorted(set(question.get("riskFlags", []) + ["REGENERATED"])),
        "manualAuditRecommended": True,
    })
    (run_dir / f"questions/q{ordinal:03d}/attempt-{next_attempt:02d}").mkdir(
        parents=True,
        exist_ok=True,
    )
    _write_builder_packet(run_dir, manifest, ordinal, next_attempt)
    _append_event(
        manifest,
        "FAST_REGENERATION_SCHEDULED",
        ordinal=ordinal,
        fromAttempt=current_attempt,
        toAttempt=next_attempt,
        reason=reason,
    )


def _refresh_manifest(manifest: dict[str, Any]) -> None:
    questions = manifest.get("questions", {})
    tasks = manifest.get("tasks", {})
    counts = {
        "pending": sum(task.get("status") == "PENDING" for task in tasks.values()),
        "dispatched": sum(task.get("status") == "DISPATCHED" for task in tasks.values()),
        "accepted": sum(task.get("status") == "ACCEPTED" for task in tasks.values()),
        "failed": sum(task.get("status") == "FAILED" for task in tasks.values()),
    }
    q_counts = {
        status.lower(): sum(item.get("status") == status for item in questions.values())
        for status in (
            "PENDING", "GENERATED", "VERIFIED", "RECHECKING", "REGENERATING",
            "READY", "FLAGGED", "FAILED",
        )
    }
    manifest["progress"] = {
        "expectedQuestions": len(questions),
        "pendingTasks": counts["pending"],
        "dispatchedTasks": counts["dispatched"],
        "acceptedTasks": counts["accepted"],
        "failedTasks": counts["failed"],
        "questionStates": q_counts,
    }
    if manifest.get("status") in {"BLOCKED", "FAILED"}:
        return
    if any(item.get("status") == "FAILED" for item in questions.values()):
        manifest["status"] = "FAILED"
        manifest["currentStage"] = "F03_BLINDED_REVIEW"
        manifest["codes"] = sorted(set(
            manifest.get("codes", [])
            + [code for item in questions.values() for code in item.get("codes", [])]
        ))
        return
    if any(item.get("status") == "FLAGGED" for item in questions.values()):
        manifest["status"] = "HOLD"
        manifest["currentStage"] = "F03_BLINDED_REVIEW"
        return
    if questions and all(item.get("status") == "READY" for item in questions.values()):
        manifest["status"] = "READY_FOR_ASSEMBLY"
        manifest["currentStage"] = "F04_ASSEMBLY"
        _set_stage(manifest, "F03_BLINDED_REVIEW", "PASS", "all questions independently verified")
        return
    if questions and all(
        item.get("status") in {"GENERATED", "RECHECKING", "READY"}
        for item in questions.values()
    ):
        manifest["status"] = "REVIEWING"
        manifest["currentStage"] = "F03_BLINDED_REVIEW"
        _set_stage(manifest, "F02_GENERATION", "PASS", "all drafts accepted")
        return
    manifest["status"] = "GENERATING"
    manifest["currentStage"] = "F02_GENERATION"
    _set_stage(manifest, "F02_GENERATION", "ACTIVE", "builder tasks pending or dispatched")


def prepare_fast_exam(store: FastRunStore, run_id: str) -> dict[str, Any]:
    manifest = store.load(run_id)
    if manifest.get("artifactType") != "ALIVE_FAST_EXAM_RUN":
        raise FastExamError("Run is not a FAST_EXAM Run")
    if manifest.get("status") == "BLOCKED":
        return manifest
    run_dir = store.run_dir(run_id)
    for ordinal_text, question in sorted(manifest.get("questions", {}).items(), key=lambda item: int(item[0])):
        ordinal = int(ordinal_text)
        task_id = question.get("builderTaskId")
        if not isinstance(task_id, str) or task_id not in manifest.get("tasks", {}):
            _write_builder_packet(run_dir, manifest, ordinal, int(question.get("attempt", 0)))
    _refresh_manifest(manifest)
    _append_event(manifest, "FAST_PREPARE_IDEMPOTENT")
    store.save(run_id, manifest)
    return manifest


def start_fast_dispatch(
    store: FastRunStore,
    run_id: str,
    task_id: str,
    external_id: str,
    route: str | None = None,
) -> tuple[dict[str, Any], bool]:
    manifest = store.load(run_id)
    task = _resolve_task(manifest, task_id)
    if task.get("status") == "DISPATCHED":
        attempts = task.get("dispatch", {}).get("attempts", [])
        if attempts and attempts[-1].get("externalId") == external_id:
            return task, True
        raise FastExamError("task is already dispatched with a different external id")
    if task.get("status") == "ACCEPTED":
        raise FastExamError("accepted task cannot be dispatched")
    if task.get("status") != "PENDING":
        raise FastExamError(f"task is not dispatchable: {task.get('status')}")
    attempts = task.setdefault("dispatch", {}).setdefault("attempts", [])
    if len(attempts) >= FAST_MAX_DISPATCH_ATTEMPTS:
        raise FastExamError("fast dispatch retry limit exhausted")
    run_dir = store.run_dir(run_id)
    receipt = {
        "attempt": len(attempts) + 1,
        "externalId": external_id,
        "route": route or "gpt-5.6-luna/xhigh",
        "status": "DISPATCHED",
        "startedAt": utc_now(),
    }
    candidate = run_dir / task["outputPath"]
    if candidate.is_file():
        receipt["baselineInputMtimeNs"] = candidate.stat().st_mtime_ns
    attempts.append(receipt)
    task["status"] = "DISPATCHED"
    _append_event(manifest, "FAST_TASK_DISPATCH_STARTED", taskId=task_id, externalId=external_id)
    _refresh_manifest(manifest)
    store.save(run_id, manifest)
    return task, False


def fail_fast_dispatch(store: FastRunStore, run_id: str, task_id: str, code: str) -> dict[str, Any]:
    manifest = store.load(run_id)
    task = _resolve_task(manifest, task_id)
    if task.get("status") != "DISPATCHED":
        raise FastExamError("only a dispatched fast task can be failed")
    attempts = task.setdefault("dispatch", {}).setdefault("attempts", [])
    if not attempts or attempts[-1].get("status") != "DISPATCHED":
        raise FastExamError("fast task dispatch receipt is invalid")
    attempts[-1].update({"status": "DISPATCH_FAILED", "code": code, "failedAt": utc_now()})
    if len(attempts) >= FAST_MAX_DISPATCH_ATTEMPTS:
        task["status"] = "FAILED"
        manifest["status"] = "FAILED"
        manifest["codes"] = sorted(set(manifest.get("codes", []) + ["FAST_DISPATCH_RETRY_EXHAUSTED"]))
    else:
        task["status"] = "PENDING"
    _append_event(manifest, "FAST_TASK_DISPATCH_FAILED", taskId=task_id, code=code)
    _refresh_manifest(manifest)
    store.save(run_id, manifest)
    return task


def submit_fast_artifact(
    store: FastRunStore,
    run_id: str,
    task_id: str,
    input_path: Path,
) -> dict[str, Any]:
    manifest = store.load(run_id)
    task = _resolve_task(manifest, task_id)
    run_dir = store.run_dir(run_id)
    inbox_path = _require_inbox_path(run_dir, task, input_path)
    if task.get("status") == "ACCEPTED":
        existing = task.get("inputSha256")
        if existing and sha256_file(inbox_path) == existing:
            return {"task": task, "idempotent": True, "questionStatus": manifest["questions"][str(task["ordinal"])]["status"]}
        raise FastExamError("accepted fast task is immutable")
    if task.get("status") not in {"PENDING", "DISPATCHED"}:
        raise FastExamError(f"task cannot accept an artifact from status {task.get('status')}")
    payload = _json_file(inbox_path)
    normalizations: list[str] = []
    if task["kind"] == "QUESTION_BUILDER":
        payload, normalizations = _normalize_fast_draft(payload, task, manifest)
        _validate_draft(payload, task, manifest, run_dir)
    elif task["kind"] == "BLINDED_VERIFIER":
        payload, normalizations = _normalize_fast_review(payload, task, manifest, run_dir)
        _validate_review(payload, task, manifest)
    else:
        raise FastExamError(f"unsupported fast task kind: {task['kind']}")

    accepted_path = run_dir / task["acceptedPath"]
    if accepted_path.exists():
        raise FastExamError("accepted fast artifact path already exists")
    if normalizations:
        atomic_write_json(accepted_path, payload)
    else:
        _atomic_copy(inbox_path, accepted_path)
    task["status"] = "ACCEPTED"
    task["inputSha256"] = sha256_file(inbox_path)
    task["artifactSha256"] = payload["artifactSha256"]
    task["acceptedAt"] = utc_now()
    if normalizations:
        task["normalizations"] = normalizations
    question = manifest["questions"][str(task["ordinal"])]
    if task["kind"] == "QUESTION_BUILDER":
        student_path = run_dir / f"questions/q{task['ordinal']:03d}/attempt-{task['attempt']:02d}/student.json"
        atomic_write_json(student_path, payload["studentPayload"])
        question["status"] = "GENERATED"
        question["accepted"]["draft"] = {
            "path": task["acceptedPath"],
            "sha256": sha256_file(accepted_path),
            "studentPayloadSha256": json_sha256(payload["studentPayload"]),
        }
        question["accepted"]["studentPayloadSha256"] = json_sha256(payload["studentPayload"])
        question["riskFlags"] = sorted(set(question.get("riskFlags", []) + payload.get("riskFlags", [])))
        question["manualAuditRecommended"] = bool(question["riskFlags"])
        _write_verifier_packet(run_dir, manifest, task["ordinal"], task["attempt"], task["acceptedPath"])
    else:
        draft_path = run_dir / question["accepted"]["draft"]["path"]
        draft = _json_file(draft_path)
        answer_match = _same_answer(draft["answerContract"], payload["independentAnswer"])
        question["accepted"]["review"] = {
            "path": task["acceptedPath"],
            "sha256": sha256_file(accepted_path),
            "lane": task.get("lane", "primary"),
        }
        question["reviewVerdict"] = payload["verdict"]
        question["answerMatch"] = answer_match
        question.setdefault("reviewHistory", []).append({
            "taskId": task["taskId"],
            "attempt": task["attempt"],
            "lane": task.get("lane", "primary"),
            "verdict": payload["verdict"],
            "answerMatch": answer_match,
            "findings": copy.deepcopy(payload.get("findings", [])),
        })
        if payload["verdict"] == "PASS" and answer_match:
            question["status"] = "READY"
        elif task.get("lane", "primary") == "primary":
            _schedule_recheck(run_dir, manifest, question, task)
        else:
            reason = "BLINDED_REVIEW_FAIL" if payload["verdict"] != "PASS" else "ANSWER_DISAGREEMENT"
            if not answer_match and payload["verdict"] != "PASS":
                reason = "BLINDED_REVIEW_FAIL+ANSWER_DISAGREEMENT"
            _schedule_regeneration(run_dir, manifest, question, reason)
    _append_event(
        manifest,
        "FAST_ARTIFACT_ACCEPTED",
        taskId=task_id,
        artifactType=payload["artifactType"],
        inputSha256=task["inputSha256"],
        normalizations=normalizations,
    )
    _refresh_manifest(manifest)
    store.save(run_id, manifest)
    return {
        "task": task,
        "idempotent": False,
        "questionStatus": question["status"],
        "parentStatus": manifest["status"],
        "acceptedPath": task["acceptedPath"],
        "normalizations": normalizations,
    }


def _record_rejected_artifact(
    store: FastRunStore,
    run_id: str,
    manifest: dict[str, Any],
    task: dict[str, Any],
    candidate_hash: str,
    error: str,
) -> bool:
    """Record one invalid candidate and make only that dispatch retryable."""

    fresh_manifest = store.load(run_id)
    fresh_task = _resolve_task(fresh_manifest, task["taskId"])
    if fresh_task.get("rejectedInputSha256") == candidate_hash:
        return False
    fresh_task["rejectedInputSha256"] = candidate_hash
    fresh_task["lastError"] = error
    attempts = fresh_task.setdefault("dispatch", {}).setdefault("attempts", [])
    if attempts and attempts[-1].get("status") == "DISPATCHED":
        attempts[-1].update({
            "status": "ARTIFACT_REJECTED",
            "code": "FAST_ARTIFACT_INVALID",
            "error": error,
            "finishedAt": utc_now(),
        })
    if len(attempts) >= FAST_MAX_DISPATCH_ATTEMPTS:
        fresh_task["status"] = "FAILED"
        fresh_manifest["status"] = "FAILED"
        fresh_manifest["codes"] = sorted(set(
            fresh_manifest.get("codes", []) + ["FAST_ARTIFACT_RETRY_EXHAUSTED"]
        ))
    else:
        fresh_task["status"] = "PENDING"
    _append_event(
        fresh_manifest,
        "FAST_ARTIFACT_REJECTED",
        taskId=fresh_task["taskId"],
        inputSha256=candidate_hash,
        error=error,
        retryable=fresh_task["status"] == "PENDING",
    )
    store.save(run_id, fresh_manifest)
    return True


def reconcile_fast_run(store: FastRunStore, run_id: str) -> dict[str, Any]:
    accepted: list[dict[str, Any]] = []
    errors: list[dict[str, str]] = []
    inspected_candidates: set[tuple[str, str]] = set()
    while True:
        manifest = store.load(run_id)
        run_dir = store.run_dir(run_id)
        accepted_this_pass = 0
        for task_id, task in list(manifest.get("tasks", {}).items()):
            if task.get("status") not in {"PENDING", "DISPATCHED"}:
                continue
            candidate = run_dir / task["outputPath"]
            if not candidate.is_file():
                continue
            candidate_hash = sha256_file(candidate)
            candidate_key = (task_id, candidate_hash)
            if candidate_key in inspected_candidates:
                continue
            inspected_candidates.add(candidate_key)
            attempts = task.get("dispatch", {}).get("attempts", [])
            last_attempt = attempts[-1] if attempts else {}
            baseline_mtime = last_attempt.get("baselineInputMtimeNs")
            if (
                last_attempt.get("status") == "DISPATCHED"
                and isinstance(baseline_mtime, int)
                and candidate.stat().st_mtime_ns <= baseline_mtime
            ):
                continue
            try:
                result = submit_fast_artifact(store, run_id, task_id, candidate)
                accepted.append(result)
                accepted_this_pass += 1
            except (FastExamError, FileNotFoundError) as error:
                errors.append({"taskId": task_id, "error": str(error)})
                if isinstance(error, FastExamError):
                    if _record_rejected_artifact(
                        store, run_id, manifest, task, candidate_hash, str(error)
                    ):
                        accepted_this_pass += 1
        if accepted_this_pass == 0:
            break
    manifest = store.load(run_id)
    _append_event(manifest, "FAST_RECONCILE", accepted=len(accepted), errors=len(errors))
    _refresh_manifest(manifest)
    store.save(run_id, manifest)
    return {"runId": run_id, "accepted": accepted, "errors": errors, "status": manifest["status"]}


def build_fast_status(store: FastRunStore, run_id: str) -> dict[str, Any]:
    """Build a read-only next-action view; this function never dispatches or saves."""

    manifest = store.load(run_id)
    if manifest.get("artifactType") != "ALIVE_FAST_EXAM_RUN":
        raise FastExamError("Run is not a FAST_EXAM Run")
    queue: list[dict[str, Any]] = []
    for task_id, task in manifest.get("tasks", {}).items():
        if task.get("status") == "PENDING":
            queue.append({
                "kind": "AGENT_TASK",
                "taskId": task_id,
                "taskKind": task["kind"],
                "ordinal": task["ordinal"],
                "packetPath": task["packetPath"],
                "outputPath": task["outputPath"],
                "route": "gpt-5.6-luna/xhigh",
            })
        elif task.get("status") == "DISPATCHED":
            queue.append({
                "kind": "AGENT_WAIT",
                "taskId": task_id,
                "taskKind": task["kind"],
                "ordinal": task["ordinal"],
                "externalId": task.get("dispatch", {}).get("attempts", [{}])[-1].get("externalId"),
            })
    for ordinal, question in manifest.get("questions", {}).items():
        if question.get("status") == "FLAGGED":
            queue.append({
                "kind": "REGENERATE",
                "ordinal": int(ordinal),
                "codes": question.get("codes", []),
                "implemented": True,
            })
    if manifest.get("status") == "READY_FOR_ASSEMBLY":
        queue.append({"kind": "ASSEMBLE", "stageId": "F04_ASSEMBLY", "implemented": True})
    elif manifest.get("status") == "READY_FOR_RENDER":
        queue.append({"kind": "RENDER_GATE", "stageId": "F05_REAL_RENDER", "implemented": True})
    elif manifest.get("status") == "READY_FOR_PACKAGE":
        queue.append({"kind": "PACKAGE", "stageId": "F06_PACKAGE", "implemented": True})
    queue.sort(key=lambda item: (int(item.get("ordinal", 10**9)), item["kind"], str(item.get("taskId", ""))))
    questions = [
        {
            "ordinal": int(ordinal),
            "status": question.get("status"),
            "attempt": question.get("attempt"),
            "codes": question.get("codes", []),
            "builderTaskId": question.get("builderTaskId"),
            "verifierTaskId": question.get("verifierTaskId"),
            "manualAuditRecommended": question.get("manualAuditRecommended", False),
        }
        for ordinal, question in sorted(manifest.get("questions", {}).items(), key=lambda item: int(item[0]))
    ]
    return {
        "schemaVersion": FAST_SCHEMA_VERSION,
        "artifactType": "ALIVE_FAST_EXAM_STATUS",
        "runId": run_id,
        "parent": {
            "status": manifest.get("status"),
            "currentStage": manifest.get("currentStage"),
            "codes": manifest.get("codes", []),
        },
        "progress": manifest.get("progress", {}),
        "questions": questions,
        "queue": queue,
        "terminal": {
            "state": (
                "SUCCESS" if manifest.get("status") == "AUTO_READY"
                else "FAILURE" if manifest.get("status") in {"FAILED", "BLOCKED"}
                else "RUNNING"
            ),
            "status": manifest.get("status"),
        },
    }


def _atomic_write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{uuid.uuid4().hex}.tmp")
    try:
        with temporary.open("w", encoding="utf-8", newline="\n") as output:
            output.write(text)
            output.flush()
            os.fsync(output.fileno())
        os.replace(temporary, path)
    finally:
        if temporary.exists():
            temporary.unlink()


def _normalize_question_type(value: Any) -> str:
    if value in {"MCQ", "객관식"}:
        return "MCQ"
    if value in {"SHORT_ANSWER", "주관식", "단답형"}:
        return "SHORT_ANSWER"
    if value in {"CONSTRUCTED_RESPONSE", "서술형"}:
        return "CONSTRUCTED_RESPONSE"
    return ""


def _score_content(content: str, score: dict[str, Any] | None) -> str:
    cleaned = _SCORE_TAIL_RE.sub("", content).rstrip()
    if score is None:
        return cleaned
    annotation = score.get("annotation")
    if not isinstance(annotation, str) or not annotation.strip():
        raise FastExamError("score contract annotation is missing")
    return f"{cleaned} {annotation}".strip()


def _build_fast_structured_question(
    source_question: dict[str, Any],
    preflight_item: dict[str, Any],
    draft: dict[str, Any],
    ordinal: int,
    *,
    allow_visual: bool = False,
) -> dict[str, Any]:
    if preflight_item.get("visualDependency") != "NONE" and not allow_visual:
        raise FastExamError(
            f"FAST_VISUAL_NOT_SUPPORTED: question {ordinal} requires a visual generation lane"
        )
    student = _validate_student_payload(draft.get("studentPayload"))
    expected_type = _normalize_question_type(preflight_item.get("normalizedQuestionType"))
    actual_type = _normalize_question_type(student.get("questionType"))
    if actual_type != expected_type:
        raise FastExamError(
            f"question {ordinal} type changed during generation: {expected_type} -> {actual_type}"
        )
    content = _score_content(str(student["content"]).strip(), preflight_item.get("score"))
    choices = copy.deepcopy(student.get("choices", []))
    contract = draft.get("answerContract")
    if not isinstance(contract, dict):
        raise FastExamError(f"question {ordinal} answer contract is missing")
    answer_type = contract.get("answerType")
    canonical = contract.get("canonicalAnswer")
    if not isinstance(canonical, str) or not canonical.strip():
        raise FastExamError(f"question {ordinal} canonical answer is empty")
    if actual_type == "MCQ":
        if answer_type not in {"choice_index", "choice_indices"} or len(choices) != 5:
            raise FastExamError(f"question {ordinal} MCQ answer contract is invalid")
        normalized = _normalize_answer(canonical, answer_type=answer_type)
        answer_indices = [
            int(item) for item in normalized.split(",")
            if item.isdigit() and 1 <= int(item) <= 5
        ]
        if not answer_indices or len(set(answer_indices)) != len(answer_indices):
            raise FastExamError(f"question {ordinal} MCQ answer index is invalid")
        if answer_type == "choice_index" and len(answer_indices) != 1:
            raise FastExamError(f"question {ordinal} single-choice answer has multiple indices")
        answer = ", ".join("①②③④⑤"[index - 1] for index in answer_indices)
        answer_line = f"따라서 정답은 {answer}이다."
    else:
        if answer_type == "choice_index" or choices:
            raise FastExamError(f"question {ordinal} non-MCQ output contract is invalid")
        display_answer = contract.get("displayAnswer", canonical)
        if not isinstance(display_answer, str) or not display_answer.strip():
            raise FastExamError(f"question {ordinal} display answer is empty")
        answer = display_answer.strip()
        answer_line = f"따라서 답은 {answer}이다."
    solution = str(draft["solution"]).strip()
    if answer_line not in solution:
        solution = f"{solution}\n\n{answer_line}"
    required = (
        "level", "category", "originalCategory", "standardCourse", "standardUnitKey",
        "standardUnit", "standardUnitOrder", "subUnitKey", "subUnit",
        "subUnitConfidence", "subUnitClassificationDepth", "layoutTag", "wide",
    )
    missing = [key for key in required if key not in source_question]
    if missing:
        raise FastExamError(f"question {ordinal} source metadata is incomplete: {missing}")
    normalized_content, content_changes, content_errors = normalize_serializable_text(content)
    normalized_solution, solution_changes, solution_errors = normalize_serializable_text(solution)
    normalized_answer, answer_changes, answer_errors = normalize_serializable_text(answer)
    serialization_errors = content_errors + solution_errors + answer_errors
    if serialization_errors:
        raise FastExamError(
            f"question {ordinal} serialization lint failed: "
            + "; ".join(str(item.get("message") or item.get("code")) for item in serialization_errors)
        )
    metadata_input = copy.deepcopy(student)
    metadata_input.update({"content": normalized_content, "choices": choices})
    semantic_type = infer_semantic_question_type(metadata_input)
    metadata_input["questionType"] = semantic_type
    metadata, metadata_report = finalize_similar_metadata(
        source_question,
        metadata_input,
        strict_type=False,
    )
    structured = metadata
    structured.update({
        "id": ordinal,
        "questionType": semantic_type,
        "tags": metadata["tags"],
        "content": normalized_content,
        "choices": choices,
        "answer": normalized_answer,
        "solution": normalized_solution,
        "metadataFinalizer": metadata_report,
        "serializationLint": {
            "contentChanges": content_changes,
            "solutionChanges": solution_changes,
            "answerChanges": answer_changes,
        },
    })
    exact = verify_question(structured, ordinal)
    structured["exactVerification"] = exact
    if exact.get("status") == "FAIL":
        codes = ", ".join(str(item.get("code")) for item in exact.get("findings", []))
        raise FastExamError(f"question {ordinal} exact verification failed: {codes}")
    return structured


def assemble_fast_exam(
    root: Path,
    store: FastRunStore,
    run_id: str,
    title: str | None = None,
) -> dict[str, Any]:
    """Assemble verified question artifacts into one local JS candidate."""

    manifest = store.load(run_id)
    if manifest.get("status") != "READY_FOR_ASSEMBLY" or manifest.get("currentStage") != "F04_ASSEMBLY":
        raise FastExamError("fast exam is not ready for assembly")
    run_dir = store.run_dir(run_id)
    source_exam = _json_file(run_dir / "source" / "source-exam.json")
    preflight = _json_file(run_dir / "source" / "preflight-report.json")
    locked_source = (root / manifest["sourceLock"]["path"]).resolve()
    if not locked_source.is_file() or sha256_file(locked_source) != manifest["sourceLock"]["sha256"]:
        raise FastExamError("fast source lock hash mismatch")
    locked_exam, locked_preflight = preflight_exam(root, manifest["sourceLock"]["path"])
    saved_preflight = copy.deepcopy(preflight)
    saved_preflight.pop("fastCapability", None)
    if locked_exam != source_exam or locked_preflight != saved_preflight:
        raise FastExamError("fast source snapshot no longer matches the locked source")
    exam_title = (title or preflight.get("examTitle") or "").strip()
    if not exam_title:
        raise FastExamError("fast exam title is required")
    expected_count = int(manifest["request"]["expectedQuestionCount"])
    if len(source_exam.get("questions", [])) != expected_count:
        raise FastExamError("source question count changed after FAST_EXAM start")
    structured_questions: list[dict[str, Any]] = []
    archive_questions: list[dict[str, Any]] = []
    question_hashes: dict[str, str] = {}
    for ordinal in range(1, expected_count + 1):
        question = manifest["questions"].get(str(ordinal))
        if not isinstance(question, dict) or question.get("status") != "READY":
            raise FastExamError(f"question {ordinal} is not READY for assembly")
        draft_meta = question.get("accepted", {}).get("draft")
        if not isinstance(draft_meta, dict):
            raise FastExamError(f"question {ordinal} accepted draft is missing")
        draft_relative = draft_meta.get("path")
        if not isinstance(draft_relative, str):
            raise FastExamError(f"question {ordinal} accepted draft path is invalid")
        draft_path = _inside_run(run_dir, run_dir / draft_relative)
        if not draft_path.is_file() or sha256_file(draft_path) != draft_meta.get("sha256"):
            raise FastExamError(f"question {ordinal} accepted draft hash mismatch")
        review_meta = question.get("accepted", {}).get("review")
        if not isinstance(review_meta, dict):
            raise FastExamError(f"question {ordinal} accepted review is missing")
        review_relative = review_meta.get("path")
        if not isinstance(review_relative, str):
            raise FastExamError(f"question {ordinal} accepted review path is invalid")
        review_path = _inside_run(run_dir, run_dir / review_relative)
        if not review_path.is_file() or sha256_file(review_path) != review_meta.get("sha256"):
            raise FastExamError(f"question {ordinal} accepted review hash mismatch")
        if question.get("reviewVerdict") != "PASS" or question.get("answerMatch") is not True:
            raise FastExamError(f"question {ordinal} review reducer has not passed")
        draft = _json_file(draft_path)
        source_question = source_exam["questions"][ordinal - 1]
        preflight_item = preflight["questions"][ordinal - 1]
        structured = _build_fast_structured_question(
            source_question,
            preflight_item,
            draft,
            ordinal,
        )
        final_path = run_dir / f"questions/q{ordinal:03d}/attempt-{question['attempt']:02d}/final.json"
        atomic_write_json(final_path, structured)
        structured_questions.append(structured)
        archive_questions.append(_archive_projection(structured))
        question_hashes[str(ordinal)] = sha256_file(final_path)
    structured_exam = {
        "schemaVersion": FAST_SCHEMA_VERSION,
        "artifactType": "ALIVE_FAST_STRUCTURED_EXAM",
        "examTitle": exam_title,
        "questionCount": expected_count,
        "questions": structured_questions,
    }
    structured_target = run_dir / "final" / "structured-exam.json"
    atomic_write_json(structured_target, structured_exam)
    script = (
        f"window.examTitle = {json.dumps(exam_title, ensure_ascii=False)};\n\n"
        f"window.questionBank = {json.dumps(archive_questions, ensure_ascii=False, indent=2)};\n"
    )
    staging = run_dir / "final" / "staging" / "generated-exam.js"
    _atomic_write_text(staging, script)
    shadow = root / "archive" / "_generated" / "alive-fast-exam-runs" / run_id / "candidate.js"
    _atomic_write_text(shadow, script)
    parsed_title, parsed_bank = _parse_serialized_js(staging.read_text(encoding="utf-8"))
    if parsed_title != exam_title or parsed_bank != archive_questions:
        raise FastExamError("fast whole-exam serializer semantic round-trip mismatch")
    content_hashes = [
        json_sha256({
            "content": _SCORE_TAIL_RE.sub("", str(question["content"])).rstrip(),
            "choices": question.get("choices", []),
        })
        for question in structured_questions
    ]
    if len(content_hashes) != len(set(content_hashes)):
        raise FastExamError("fast whole-exam assembly contains duplicate generated questions")
    score_total = sum(
        float(item["score"]["points"])
        for item in preflight["questions"]
        if item.get("score") is not None
    )
    expected_score_total = float(preflight["scoreContract"]["totalPoints"])
    if score_total != expected_score_total:
        raise FastExamError("fast whole-exam score contract mismatch")
    review_report = {
        "stageId": "F03_BLINDED_REVIEW",
        "verdict": "PASS",
        "questionCount": expected_count,
        "questions": [
            {
                "ordinal": ordinal,
                "status": manifest["questions"][str(ordinal)]["status"],
                "attempt": manifest["questions"][str(ordinal)]["attempt"],
                "reviewHistory": manifest["questions"][str(ordinal)].get("reviewHistory", []),
                "attemptHistory": manifest["questions"][str(ordinal)].get("attemptHistory", []),
                "riskFlags": manifest["questions"][str(ordinal)].get("riskFlags", []),
            }
            for ordinal in range(1, expected_count + 1)
        ],
        "independence": "I2_SEPARATE_CALL",
        "publicationStatus": "NOT_PUBLISHED",
    }
    atomic_write_json(run_dir / "final" / "review-report.json", review_report)
    assembly_report = {
        "stageId": "F04_ASSEMBLY",
        "verdict": "PASS",
        "questionCount": expected_count,
        "structuredExamSha256": sha256_file(structured_target),
        "stagingSha256": sha256_file(staging),
        "shadowSha256": sha256_file(shadow),
        "shadowArchiveRelativePath": shadow.relative_to(root / "archive").as_posix(),
        "questionFinalHashes": question_hashes,
        "semanticRoundTrip": "PASS",
        "duplicateQuestionCheck": "PASS",
        "scoreContract": {
            "status": "PASS",
            "totalPoints": preflight["scoreContract"]["totalPoints"],
        },
        "publicationStatus": "NOT_PUBLISHED",
    }
    atomic_write_json(run_dir / "final" / "assembly-report.json", assembly_report)
    _set_stage(manifest, "F04_ASSEMBLY", "PASS", f"{expected_count} questions assembled")
    manifest["assembly"] = assembly_report
    manifest["status"] = "READY_FOR_RENDER"
    manifest["currentStage"] = "F05_REAL_RENDER"
    store.save(run_id, manifest)
    return manifest


def record_fast_render(
    store: FastRunStore,
    run_id: str,
    evidence_path: Path,
) -> dict[str, Any]:
    """Accept only complete production-engine browser evidence."""

    manifest = store.load(run_id)
    if manifest.get("status") != "READY_FOR_RENDER" or manifest.get("currentStage") != "F05_REAL_RENDER":
        raise FastExamError("fast exam is not ready for real render")
    evidence = _json_file(evidence_path)
    if evidence.get("runId") not in {None, run_id}:
        raise FastExamError("fast render evidence runId mismatch")
    expected = int(manifest["request"]["expectedQuestionCount"])
    if evidence.get("actualBrowser") is not True or evidence.get("productionEngine") is not True:
        raise FastExamError("fast render requires actual production-engine browser evidence")
    modes = evidence.get("modes")
    if not isinstance(modes, dict) or set(modes) != {"exam", "solution", "answer"}:
        raise FastExamError("fast render requires exam, solution, and answer modes")
    for name, result in modes.items():
        if not isinstance(result, dict) or result.get("verdict") != "PASS":
            raise FastExamError(f"fast render mode {name} did not PASS")
        if result.get("ready") is not True or result.get("renderError") is not None:
            raise FastExamError(f"fast render mode {name} readiness is invalid")
        if result.get("unrenderedMath") != 0 or result.get("overflowCount") != 0:
            raise FastExamError(f"fast render mode {name} math or overflow failed")
        if result.get("lastQuestion") != expected or result.get("badImages") != []:
            raise FastExamError(f"fast render mode {name} did not cover the complete exam")
        if result.get("lastPageChecked") is not True:
            raise FastExamError(f"fast render mode {name} last page was not checked")
    target = store.run_dir(run_id) / "render" / "render-evidence.json"
    atomic_write_json(target, evidence)
    evidence_hash = sha256_file(target)
    report = {
        "stageId": "F05_REAL_RENDER",
        "verdict": "PASS",
        "evidenceSha256": evidence_hash,
        "modes": sorted(modes),
        "questionCount": expected,
    }
    atomic_write_json(store.run_dir(run_id) / "render" / "render-report.json", report)
    _set_stage(manifest, "F05_REAL_RENDER", "PASS", evidence_hash)
    manifest["render"] = report
    manifest["renderEvidenceSha256"] = evidence_hash
    manifest["status"] = "READY_FOR_PACKAGE"
    manifest["currentStage"] = "F06_PACKAGE"
    store.save(run_id, manifest)
    return manifest


def package_fast_exam(store: FastRunStore, run_id: str) -> dict[str, Any]:
    """Freeze the local evidence package without publishing to the Archive."""

    manifest = store.load(run_id)
    if manifest.get("status") != "READY_FOR_PACKAGE" or manifest.get("currentStage") != "F06_PACKAGE":
        raise FastExamError("fast exam is not ready for packaging")
    run_dir = store.run_dir(run_id)
    members = [
        "source/source-exam.json",
        "source/preflight-report.json",
        "final/structured-exam.json",
        "final/staging/generated-exam.js",
        "final/assembly-report.json",
        "final/review-report.json",
        "render/render-evidence.json",
        "render/render-report.json",
    ]
    members.extend(
        path.relative_to(run_dir).as_posix()
        for path in sorted((run_dir / "questions").rglob("*.json"))
    )
    missing = [relative for relative in members if not (run_dir / relative).is_file()]
    if missing:
        raise FastExamError(f"fast package member missing: {missing}")
    package = run_dir / "final" / "alive-fast-exam-pack.zip"
    with zipfile.ZipFile(package, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for relative in members:
            archive.write(run_dir / relative, arcname=relative)
    with zipfile.ZipFile(package, "r") as archive:
        if archive.testzip() is not None or sorted(archive.namelist()) != sorted(members):
            raise FastExamError("fast package round-trip failed")
    report = {
        "stageId": "F06_PACKAGE",
        "verdict": "PASS",
        "members": members,
        "zipSha256": sha256_file(package),
        "roundTrip": "PASS",
        "publicationStatus": "NOT_PUBLISHED",
    }
    atomic_write_json(run_dir / "final" / "package-report.json", report)
    _set_stage(manifest, "F06_PACKAGE", "PASS", report["zipSha256"])
    _set_stage(manifest, "F07_AUTO_READY", "PASS", "local fast evidence package frozen")
    manifest["package"] = report
    manifest["status"] = "AUTO_READY"
    manifest["currentStage"] = "F07_AUTO_READY"
    store.save(run_id, manifest)
    return manifest
