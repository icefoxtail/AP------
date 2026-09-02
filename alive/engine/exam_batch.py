from __future__ import annotations

import json
import os
import re
import uuid
import zipfile
import shutil
from pathlib import Path
from typing import Any

from .contracts import initial_stages
from .phase3 import _archive_projection, _parse_serialized_js
from .run_store import RunStore, atomic_write_json, make_run_id, sha256_file, utc_now
from .solution_quality import infer_solution_visual_elements, infer_solution_visual_requirement
from .source_question import extract_source_exam, extract_source_question, json_sha256


EXAM_BATCH_VERSION = "0.6.0-exam-batch-recovery"
_CHILD_RECOVERY_MAX_ATTEMPTS = 1
EXAM_STAGES = (
    ("E00_EXAM_LOCK", "Exam source lock"),
    ("E01_PREFLIGHT", "Whole-exam capability preflight"),
    ("E02_CHILD_RUNS", "Per-question child Runs"),
    ("E03_ASSEMBLY", "Whole-exam assembly"),
    ("E04_REAL_RENDER", "Whole-exam real render"),
    ("E05_PACKAGE", "Whole-exam package"),
    ("E06_LOCAL_FREEZE", "Whole-exam local freeze"),
)
_CIRCLED = {"①", "②", "③", "④", "⑤"}
_MCQ_ANSWER_SEPARATOR_RE = re.compile(r"[,，、;/;\s]+")
_VISUAL_KEYS = {
    "image", "images", "imageasset", "imageassets", "choiceimages",
    "assets", "visual", "visualspec", "diagram", "svg", "png",
}
_SOLUTION_VISUAL_KEYS = {"solutionimage", "solutionimages", "solutionvisual"}
_COMMON_KEYS = {"commondata", "commondataid", "shareddata", "sharedmaterial", "passageid"}
_SCORE_ANNOTATION_RE = re.compile(
    r"\[(?P<partial>부분\s*점수\s*(?:없음|있음)\s*,\s*)?"
    r"(?P<points>\d+(?:\.\d+)?)\s*점\]"
)
_SCORE_RE = re.compile(_SCORE_ANNOTATION_RE.pattern + r"\s*$")
_CHOICE_LABEL_RE = re.compile(r"^\s*(?:[①②③④⑤]|\(?[1-5]\)?[.)])")
_CONTEXT_FIELDS = (
    "level", "category", "originalCategory", "standardCourse", "standardUnitKey",
    "standardUnit", "standardUnitOrder", "subUnitKey", "subUnit", "subUnitConfidence",
    "subUnitClassificationDepth", "layoutTag", "tags", "wide",
)
_ARCHIVE_TO_IR = {
    "객관식": "MCQ",
    "주관식": "SHORT_ANSWER",
    "단답형": "SHORT_ANSWER",
    "서술형": "CONSTRUCTED_RESPONSE",
}
_IR_TO_ARCHIVE = {
    "MCQ": "객관식",
    "SHORT_ANSWER": "주관식",
    "CONSTRUCTED_RESPONSE": "서술형",
}
_LOCAL_IMAGE_SUFFIXES = {".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"}
_RECOVERY_INTEGRITY_MARKERS = (
    "SOURCE_LOCK",
    "SOURCE_QUESTION",
    "LINEAGE",
    "SHA256",
    "HASH",
    "INTEGRITY",
    "CRC",
    "PACKAGE",
)


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


def _atomic_copy(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(f".{target.name}.{uuid.uuid4().hex}.tmp")
    try:
        shutil.copyfile(source, temporary)
        os.replace(temporary, target)
    finally:
        if temporary.exists():
            temporary.unlink()


def _inside_archive_exams(root: Path, source_file: str) -> tuple[Path, str]:
    source = (root / source_file).resolve()
    exam_root = (root / "archive" / "exams").resolve()
    try:
        relative = source.relative_to(root).as_posix()
        source.relative_to(exam_root)
    except ValueError as error:
        raise ValueError("exam batch source must stay under archive/exams") from error
    if not source.is_file() or source.suffix.lower() != ".js":
        raise FileNotFoundError(f"exam batch source not found: {source_file}")
    return source, relative


def _has_nonempty_key(value: Any, keys: set[str]) -> bool:
    if isinstance(value, dict):
        for key, nested in value.items():
            if key.lower() in keys and nested not in (None, "", [], {}):
                return True
            if _has_nonempty_key(nested, keys):
                return True
    elif isinstance(value, list):
        return any(_has_nonempty_key(item, keys) for item in value)
    return False


def _visual_dependency(question: dict[str, Any]) -> str:
    if _has_nonempty_key(question, _VISUAL_KEYS):
        return "ESSENTIAL"
    student_text = str(question.get("content", "")).lower()
    if any(
        token in student_text
        for token in ("<img", "<svg", "<table", "data:image", "그림과 같", "다음 그림")
    ):
        return "ESSENTIAL"
    if _has_nonempty_key(question, _SOLUTION_VISUAL_KEYS) or any(
        token in str(question.get("solution", "")).lower()
        for token in ("<img", "<svg", "data:image")
    ):
        return "OPTIONAL"
    return "NONE"


def _common_material_dependency(question: dict[str, Any]) -> bool:
    if _has_nonempty_key(question, _COMMON_KEYS):
        return True
    tags = question.get("tags", [])
    if isinstance(tags, list) and "공통자료" in tags:
        return True
    content = str(question.get("content", ""))
    return bool(
        re.search(r"\[\s*\d+\s*[~～-]\s*\d+\s*\]", content)
        or re.search(r"(?:위|앞의)\s*(?:표|자료|그림|조건)", content)
    )


def _has_local_image_only_choices(question: dict[str, Any], archive_root: Path | None) -> bool:
    """Accept the Archive's image-panel MCQ encoding only with a local image asset.

    An empty `choices` array is normally unsupported.  Some canonical Archive
    questions instead keep all five rendered choices in a single student-facing
    image.  The image must be a local asset inside `archive/`; a remote URL,
    data URI, missing path, or a solution-only image cannot open this exception.
    """
    image = question.get("image")
    if archive_root is None or not isinstance(image, str) or not image.strip():
        return False
    root = archive_root.resolve()
    candidate = (root / image).resolve()
    try:
        candidate.relative_to(root)
    except ValueError:
        return False
    if not candidate.is_file() or candidate.suffix.lower() not in _LOCAL_IMAGE_SUFFIXES:
        return False
    header = candidate.read_bytes()[:512]
    suffix = candidate.suffix.lower()
    if suffix == ".png":
        return header.startswith(b"\x89PNG\r\n\x1a\n")
    if suffix in {".jpeg", ".jpg"}:
        return header.startswith(b"\xff\xd8\xff")
    if suffix == ".gif":
        return header.startswith((b"GIF87a", b"GIF89a"))
    if suffix == ".webp":
        return header.startswith(b"RIFF") and header[8:12] == b"WEBP"
    return b"<svg" in header.lower()


def _mcq_answer_indices(value: Any) -> list[int]:
    """Return a validated 1-based MCQ key, including explicit multi-keys."""

    if not isinstance(value, str):
        return []
    tokens = [token for token in _MCQ_ANSWER_SEPARATOR_RE.split(value.strip()) if token]
    if not tokens or any(token not in _CIRCLED for token in tokens):
        return []
    indices = ["①②③④⑤".index(token) + 1 for token in tokens]
    return indices if len(set(indices)) == len(indices) else []


def _score_contract(question: dict[str, Any]) -> dict[str, Any] | None:
    content = str(question.get("content", ""))
    matches = list(_SCORE_ANNOTATION_RE.finditer(content))
    partial_score_matches = [match for match in matches if match.group("partial") is not None]
    if len(partial_score_matches) == 1:
        match = partial_score_matches[0]
        notation = "PARTIAL_SCORE_ANNOTATION"
    elif not partial_score_matches and len(matches) == 1:
        match = matches[0]
        notation = (
            "TERMINAL_SCORE_ANNOTATION"
            if not content[match.end():].strip()
            else "INLINE_SCORE_ANNOTATION"
        )
    else:
        return None
    number = float(match.group("points"))
    return {
        "points": int(number) if number.is_integer() else number,
        "annotation": match.group(0),
        "notation": notation,
    }


def _adapter_context(question: dict[str, Any], ordinal: int) -> dict[str, Any]:
    return {
        "id": 1,
        "level": question["level"],
        "category": question["category"],
        "originalCategory": question["originalCategory"],
        "standardCourse": question["standardCourse"],
        "standardUnitKey": question["standardUnitKey"],
        "standardUnit": question["standardUnit"],
        "standardUnitOrder": question["standardUnitOrder"],
        "subUnitKey": question["subUnitKey"],
        "subUnit": question["subUnit"],
        "subUnitConfidence": question["subUnitConfidence"],
        "subUnitClassificationDepth": question["subUnitClassificationDepth"],
        "layoutTag": question["layoutTag"],
        "tags": [tag for tag in question["tags"] if tag not in _ARCHIVE_TO_IR],
        "wide": question["wide"],
        "expectedQuestionType": _ARCHIVE_TO_IR[question["questionType"]],
        "expectedVisualDependency": _visual_dependency(question),
    }


def classify_question(
    question: dict[str, Any], ordinal: int, *, archive_root: Path | None = None
) -> dict[str, Any]:
    codes: list[str] = []
    normalizations: list[str] = []
    visual = _visual_dependency(question)
    solution_visual_context = {"visualDependency": visual}
    solution_visual_requirement = infer_solution_visual_requirement(
        question,
        str(question.get("solution") or ""),
        solution_visual_context,
    )
    solution_visual_elements = infer_solution_visual_elements(
        question,
        str(question.get("solution") or ""),
        solution_visual_context,
    )
    if _common_material_dependency(question):
        codes.append("COMMON_MATERIAL_UNSUPPORTED")
    question_type = question.get("questionType")
    ir_question_type = _ARCHIVE_TO_IR.get(question_type)
    normalized_question_type = _IR_TO_ARCHIVE.get(ir_question_type)
    if ir_question_type is None:
        codes.append("QUESTION_TYPE_UNSUPPORTED")
    elif question_type != normalized_question_type:
        normalizations.append("QUESTION_TYPE_SHORT_ANSWER_ALIAS")
    choices = question.get("choices")
    choice_representation: str | None = None
    if question_type == "객관식":
        has_text_choices = isinstance(choices, list) and len(choices) == 5 and all(
            isinstance(choice, str) and choice.strip() for choice in choices
        )
        has_image_only_choices = choices == [] and _has_local_image_only_choices(question, archive_root)
        if has_text_choices:
            choice_representation = "TEXT"
        elif has_image_only_choices:
            choice_representation = "IMAGE_ONLY"
            normalizations.append("MCQ_IMAGE_ONLY_CHOICES")
        else:
            codes.append("MCQ_FIVE_CHOICES_REQUIRED")
        answer_indices = _mcq_answer_indices(question.get("answer"))
        if not answer_indices:
            codes.append("MCQ_CIRCLED_ANSWER_REQUIRED")
        else:
            normalizations.append(
                "MCQ_MULTIPLE_ANSWER" if len(answer_indices) > 1 else "MCQ_SINGLE_ANSWER"
            )
        if isinstance(choices, list) and any(
            isinstance(choice, str) and _CHOICE_LABEL_RE.search(choice) for choice in choices
        ):
            codes.append("CHOICE_LABEL_EMBEDDED")
    elif question_type in {"주관식", "서술형"}:
        if choices != []:
            codes.append("NON_MCQ_CHOICES_MUST_BE_EMPTY")
        if not isinstance(question.get("answer"), str) or not question["answer"].strip():
            codes.append("NON_MCQ_ANSWER_REQUIRED")
    missing = [field for field in _CONTEXT_FIELDS if field not in question]
    if missing:
        codes.append("ADAPTER_METADATA_MISSING")
    elif (
        not isinstance(question.get("tags"), list)
        or not isinstance(question.get("wide"), bool)
        or not isinstance(question.get("standardUnitOrder"), int)
    ):
        codes.append("ADAPTER_METADATA_INVALID")
    score = _score_contract(question)
    if score is not None and score["notation"] != "TERMINAL_SCORE_ANNOTATION":
        normalizations.append(score["notation"])
    result = {
        "ordinal": ordinal,
        "sourceId": question.get("id"),
        "questionType": question.get("questionType"),
        "normalizedQuestionType": normalized_question_type,
        "choiceRepresentation": choice_representation,
        "visualDependency": visual,
        "solutionVisualRequirement": solution_visual_requirement,
        "solutionVisualElements": solution_visual_elements,
        "status": "SUPPORTED" if not codes else "HOLD",
        "codes": sorted(set(codes)),
        "normalizations": sorted(set(normalizations)),
    }
    if question_type == "객관식":
        answer_indices = _mcq_answer_indices(question.get("answer"))
        result["answerCardinality"] = len(answer_indices) if answer_indices else None
        result["answerRepresentation"] = "MULTIPLE_CIRCLED" if len(answer_indices) > 1 else "CIRCLED"
    result["score"] = score
    return result


def preflight_exam(root: Path, source_file: str) -> tuple[dict[str, Any], dict[str, Any]]:
    source, relative = _inside_archive_exams(root, source_file)
    lock = {
        "path": relative,
        "sha256": sha256_file(source),
        "bytes": source.stat().st_size,
        "questionOrdinal": None,
        "qKey": None,
        "resolvedBy": "explicit-exam-path",
    }
    exam = extract_source_exam(source, lock)
    questions = []
    for ordinal, question in enumerate(exam["questions"], 1):
        item = classify_question(question, ordinal, archive_root=(root / "archive"))
        item["sourceQuestionSha256"] = json_sha256(question)
        questions.append(item)
    supported = [item["ordinal"] for item in questions if item["status"] == "SUPPORTED"]
    held = [item["ordinal"] for item in questions if item["status"] == "HOLD"]
    source_ids = [question.get("id") for question in exam["questions"]]
    exam_codes: list[str] = []
    if source_ids != list(range(1, len(source_ids) + 1)):
        exam_codes.append("SOURCE_IDS_NOT_CONTIGUOUS")
    score_presence = [item["score"] is not None for item in questions]
    if any(score_presence) and not all(score_presence):
        exam_codes.append("PARTIAL_SCORE_CONTRACT")
    total_points = sum(
        float(item["score"]["points"]) for item in questions if item["score"] is not None
    )
    report = {
        "schemaVersion": "0.4.0",
        "artifactType": "ALIVE_EXAM_PREFLIGHT",
        "examTitle": exam.get("examTitle") or source.stem,
        "sourceLock": lock,
        "questionCount": exam["questionCount"],
        "supportedCount": len(supported),
        "heldCount": len(held),
        "supportedOrdinals": supported,
        "heldOrdinals": held,
        "examCodes": exam_codes,
        "scoreContract": {
            "status": "PRESENT" if score_presence and all(score_presence) else (
                "ABSENT" if not any(score_presence) else "INVALID"
            ),
            "totalPoints": int(total_points) if total_points.is_integer() else total_points,
        },
        "questions": questions,
        "wholeExamReady": not held and not exam_codes and bool(questions),
    }
    return exam, report


def _exam_stages() -> list[dict[str, Any]]:
    return [
        {"stageId": stage_id, "label": label, "status": "PENDING", "evidence": []}
        for stage_id, label in EXAM_STAGES
    ]


def _set_exam_stage(manifest: dict[str, Any], stage_id: str, status: str, evidence: str) -> None:
    stage = next(item for item in manifest["stages"] if item["stageId"] == stage_id)
    stage["status"] = status
    stage["evidence"].append(evidence)


def _child_manifest(
    *, parent: dict[str, Any], run_id: str, ordinal: int, engine_version: str
) -> dict[str, Any]:
    now = utc_now()
    lock = {**parent["sourceLock"], "questionOrdinal": ordinal}
    stages = initial_stages()
    for stage_id in ("R00_REQUEST_NORMALIZE", "R00A_CAPABILITY_PRECHECK", "R01_SOURCE_RESOLVE", "R02_SOURCE_LOCK"):
        stage = next(item for item in stages if item["stageId"] == stage_id)
        stage["status"] = "PASS"
        stage["evidence"] = ["prepared by exam batch parent"]
    return {
        "schemaVersion": "0.1.0",
        "engineVersion": engine_version,
        "runId": run_id,
        "createdAt": now,
        "updatedAt": now,
        "status": "READY_FOR_ORCHESTRATION",
        "currentStage": "R03_SOURCE_ANALYSIS",
        "codes": [],
        "request": {
            "query": f"{parent['request']['query']} {ordinal}번",
            "sourceFile": parent["sourceLock"]["path"],
            "questionOrdinal": ordinal,
            "generationMode": "EXAM_FOLLOWUP",
            "followupKind": "CONFIRMATION",
            "operationMode": "GENERATE",
            "outputProfile": "JS_ARCHIVE",
            "expectedQuestionCount": 1,
            "visualDependency": "NONE",
            "parentExamRunId": parent["runId"],
        },
        "sourceResolution": {
            "status": "UNIQUE",
            "query": parent["sourceLock"]["path"],
            "questionOrdinal": ordinal,
            "selected": {"path": parent["sourceLock"]["path"]},
            "candidates": [],
        },
        "sourceLock": lock,
        "stages": stages,
        "events": [{"at": now, "type": "EXAM_BATCH_CHILD_CREATED", "parentRunId": parent["runId"]}],
    }


def _failure_reason_code(child_manifest: dict[str, Any]) -> str:
    codes = child_manifest.get("codes", [])
    if isinstance(codes, list):
        values = sorted({code.strip() for code in codes if isinstance(code, str) and code.strip()})
        if values:
            return values[0]
    return "CHILD_FAILED_WITHOUT_REASON_CODE"


def _is_integrity_failure(reason_code: str) -> bool:
    normalized = reason_code.upper()
    return any(marker in normalized for marker in _RECOVERY_INTEGRITY_MARKERS)


def _expected_source_question_hash(parent: dict[str, Any], ordinal: int) -> str | None:
    questions = parent.get("preflight", {}).get("questions")
    if not isinstance(questions, list) or ordinal > len(questions):
        return None
    expected = questions[ordinal - 1]
    if not isinstance(expected, dict):
        return None
    value = expected.get("sourceQuestionSha256")
    return value if isinstance(value, str) and value else None


def _recovery_lineage(
    child: dict[str, Any], child_manifest: dict[str, Any]
) -> tuple[dict[str, Any] | None, str | None]:
    run_id = child.get("runId")
    if not isinstance(run_id, str) or not run_id:
        return None, "CHILD_RECOVERY_LINEAGE_INVALID"
    root_run_id = child.get("rootRunId", child_manifest.get("rootRunId", run_id))
    predecessor_run_id = child.get(
        "predecessorRunId", child_manifest.get("predecessorRunId")
    )
    recovery_attempt = child.get("recoveryAttempt", child_manifest.get("recoveryAttempt", 0))
    if (
        not isinstance(root_run_id, str)
        or not root_run_id
        or isinstance(recovery_attempt, bool)
        or not isinstance(recovery_attempt, int)
        or recovery_attempt < 0
        or (predecessor_run_id is not None and (
            not isinstance(predecessor_run_id, str) or not predecessor_run_id
        ))
    ):
        return None, "CHILD_RECOVERY_LINEAGE_INVALID"
    if recovery_attempt == 0:
        if root_run_id != run_id or predecessor_run_id is not None:
            return None, "CHILD_RECOVERY_LINEAGE_INVALID"
    elif root_run_id == run_id or predecessor_run_id is None:
        return None, "CHILD_RECOVERY_LINEAGE_INVALID"
    for key, value in (
        ("rootRunId", root_run_id),
        ("predecessorRunId", predecessor_run_id),
        ("recoveryAttempt", recovery_attempt),
    ):
        if key in child_manifest and child_manifest[key] != value:
            return None, "CHILD_RECOVERY_LINEAGE_MISMATCH"
    attempts = child.get("attempts")
    if attempts is not None:
        if not isinstance(attempts, list) or any(not isinstance(item, dict) for item in attempts):
            return None, "CHILD_RECOVERY_LINEAGE_INVALID"
        current_attempts = [item for item in attempts if item.get("runId") == run_id]
        if len(current_attempts) != 1:
            return None, "CHILD_RECOVERY_LINEAGE_MISMATCH"
        current = current_attempts[0]
        if (
            current.get("rootRunId") != root_run_id
            or current.get("predecessorRunId") != predecessor_run_id
            or current.get("recoveryAttempt") != recovery_attempt
        ):
            return None, "CHILD_RECOVERY_LINEAGE_MISMATCH"
    return {
        "rootRunId": root_run_id,
        "predecessorRunId": predecessor_run_id,
        "recoveryAttempt": recovery_attempt,
    }, None


def _child_recovery_integrity_code(
    parent: dict[str, Any], ordinal: int, child: dict[str, Any], child_manifest: dict[str, Any]
) -> str | None:
    expected_hash = _expected_source_question_hash(parent, ordinal)
    if expected_hash is None or child.get("sourceQuestionSha256") != expected_hash:
        return "CHILD_SOURCE_QUESTION_HASH_INTEGRITY_FAILURE"
    child_hash = child_manifest.get("sourceQuestionSha256")
    if child_hash is not None and child_hash != expected_hash:
        return "CHILD_SOURCE_QUESTION_HASH_INTEGRITY_FAILURE"
    if child_manifest.get("runId") != child.get("runId"):
        return "CHILD_RUN_ID_INTEGRITY_FAILURE"
    lock = child_manifest.get("sourceLock")
    parent_lock = parent.get("sourceLock")
    if not isinstance(lock, dict) or not isinstance(parent_lock, dict):
        return "CHILD_SOURCE_LOCK_INTEGRITY_FAILURE"
    if (
        lock.get("path") != parent_lock.get("path")
        or lock.get("sha256") != parent_lock.get("sha256")
        or lock.get("bytes") != parent_lock.get("bytes")
        or lock.get("questionOrdinal") != ordinal
    ):
        return "CHILD_SOURCE_LOCK_INTEGRITY_FAILURE"
    request = child_manifest.get("request")
    if not isinstance(request, dict) or (
        request.get("generationMode") != "EXAM_FOLLOWUP"
        or request.get("followupKind") != "CONFIRMATION"
        or request.get("operationMode") != "GENERATE"
        or request.get("outputProfile") != "JS_ARCHIVE"
        or request.get("expectedQuestionCount") != 1
        or request.get("questionOrdinal") != ordinal
        or request.get("parentExamRunId") != parent.get("runId")
    ):
        return "CHILD_PROFILE_INTEGRITY_FAILURE"
    return None


def _upsert_child_attempt(
    child: dict[str, Any], child_manifest: dict[str, Any], lineage: dict[str, Any], *,
    failure_reason_code: str | None = None,
) -> None:
    attempts = child.setdefault("attempts", [])
    if not isinstance(attempts, list):
        raise ValueError("child recovery attempts must be a list")
    run_id = child_manifest["runId"]
    record = next((item for item in attempts if item.get("runId") == run_id), None)
    if record is None:
        record = {"runId": run_id}
        attempts.append(record)
    record.update({
        "predecessorRunId": lineage["predecessorRunId"],
        "rootRunId": lineage["rootRunId"],
        "recoveryAttempt": lineage["recoveryAttempt"],
        "recoveryReasonCode": child_manifest.get("recoveryReasonCode"),
        "status": child_manifest.get("status"),
        "currentStage": child_manifest.get("currentStage"),
        "codes": sorted({
            code for code in child_manifest.get("codes", []) if isinstance(code, str) and code
        }),
        "sourceQuestionSha256": child["sourceQuestionSha256"],
        "updatedAt": utc_now(),
    })
    if failure_reason_code is not None:
        record["failureReasonCode"] = failure_reason_code
        record["endedAt"] = utc_now()


def _create_child_recovery(
    root: Path,
    store: RunStore,
    parent: dict[str, Any],
    ordinal: int,
    child: dict[str, Any],
    child_manifest: dict[str, Any],
    lineage: dict[str, Any],
    recovery_reason_code: str,
) -> tuple[bool, str | None]:
    expected_hash = child["sourceQuestionSha256"]
    old_child_dir = store.run_dir(child_manifest["runId"])
    context_relative = child.get("adapterContextPath", "evidence/adapter-context.json")
    if context_relative != "evidence/adapter-context.json":
        return False, "CHILD_ADAPTER_CONTEXT_INTEGRITY_FAILURE"
    context_path = old_child_dir / context_relative
    try:
        context = json.loads(context_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError):
        return False, "CHILD_ADAPTER_CONTEXT_INTEGRITY_FAILURE"
    if not isinstance(context, dict):
        return False, "CHILD_ADAPTER_CONTEXT_INTEGRITY_FAILURE"
    next_attempt = lineage["recoveryAttempt"] + 1
    recovery_run_id = f"{lineage['rootRunId']}-recovery-{next_attempt:02d}"
    if store.run_dir(recovery_run_id).exists():
        return False, "CHILD_RECOVERY_RUN_ID_COLLISION"
    recovery_manifest = _child_manifest(
        parent=parent,
        run_id=recovery_run_id,
        ordinal=ordinal,
        engine_version=str(parent.get("engineVersion", EXAM_BATCH_VERSION)),
    )
    recovery_manifest.update({
        "predecessorRunId": child_manifest["runId"],
        "rootRunId": lineage["rootRunId"],
        "recoveryAttempt": next_attempt,
        "recoveryReasonCode": recovery_reason_code,
        "sourceQuestionSha256": expected_hash,
    })
    try:
        source_question = extract_source_question(
            root / recovery_manifest["sourceLock"]["path"],
            ordinal,
            recovery_manifest["sourceLock"],
        )
    except Exception:
        return False, "CHILD_SOURCE_QUESTION_HASH_INTEGRITY_FAILURE"
    if source_question.get("questionSha256") != expected_hash:
        return False, "CHILD_SOURCE_QUESTION_HASH_INTEGRITY_FAILURE"
    recovery_manifest["events"].append({
        "at": utc_now(),
        "type": "EXAM_BATCH_CHILD_RECOVERY_CREATED",
        "parentRunId": parent["runId"],
        "predecessorRunId": child_manifest["runId"],
        "rootRunId": lineage["rootRunId"],
        "recoveryAttempt": next_attempt,
        "recoveryReasonCode": recovery_reason_code,
    })
    recovery_dir = store.create(recovery_run_id, recovery_manifest)
    atomic_write_json(recovery_dir / "source" / "source-question.json", source_question)
    _atomic_copy(context_path, recovery_dir / "evidence" / "adapter-context.json")
    recovery_manifest.setdefault("phase2", {}).setdefault("artifacts", {})[
        "source/source-question.json"
    ] = {
        "kind": "source_question",
        "sha256": sha256_file(recovery_dir / "source" / "source-question.json"),
    }
    store.save(recovery_run_id, recovery_manifest)
    child.update({
        "runId": recovery_run_id,
        "status": recovery_manifest["status"],
        "currentStage": recovery_manifest["currentStage"],
        "adapterContextPath": "evidence/adapter-context.json",
        "predecessorRunId": child_manifest["runId"],
        "rootRunId": lineage["rootRunId"],
        "recoveryAttempt": next_attempt,
        "recoveryReasonCode": recovery_reason_code,
    })
    _upsert_child_attempt(
        child,
        recovery_manifest,
        {
            "predecessorRunId": child_manifest["runId"],
            "rootRunId": lineage["rootRunId"],
            "recoveryAttempt": next_attempt,
        },
    )
    return True, None


def start_exam_batch(
    root: Path, store: RunStore, source_file: str, query: str | None, engine_version: str
) -> dict[str, Any]:
    exam, preflight = preflight_exam(root, source_file)
    run_id = make_run_id(query or f"{preflight['examTitle']} 전체 유사")
    now = utc_now()
    manifest: dict[str, Any] = {
        "schemaVersion": "0.4.0",
        "artifactType": "ALIVE_EXAM_BATCH_RUN",
        "engineVersion": engine_version,
        "examBatchVersion": EXAM_BATCH_VERSION,
        "runId": run_id,
        "createdAt": now,
        "updatedAt": now,
        "status": "PENDING",
        "currentStage": "E00_EXAM_LOCK",
        "codes": [],
        "request": {
            "query": query or preflight["examTitle"],
            "sourceFile": preflight["sourceLock"]["path"],
            "generationMode": "EXAM_FOLLOWUP",
            "followupKind": "CONFIRMATION",
            "operationMode": "GENERATE",
            "outputProfile": "JS_ARCHIVE",
            "expectedQuestionCount": preflight["questionCount"],
            "examProfile": "WHOLE_EXAM_CONFIRMATION",
        },
        "sourceLock": preflight["sourceLock"],
        "stages": _exam_stages(),
        "events": [],
        "preflight": {
            key: value for key, value in preflight.items()
            if key not in {"artifactType", "schemaVersion", "sourceLock"}
        },
        "children": {},
    }
    _set_exam_stage(manifest, "E00_EXAM_LOCK", "PASS", manifest["sourceLock"]["sha256"])
    _set_exam_stage(
        manifest, "E01_PREFLIGHT", "PASS" if preflight["wholeExamReady"] else "BLOCKED",
        f"supported={preflight['supportedCount']} held={preflight['heldCount']}",
    )
    if not preflight["wholeExamReady"]:
        manifest["codes"].append("EXAM_CAPABILITY_PREFLIGHT_FAIL")
        manifest["codes"].extend(preflight["examCodes"])
    manifest["codes"] = sorted(set(manifest["codes"]))
    manifest["status"] = "BLOCKED" if not preflight["wholeExamReady"] else "READY_FOR_CHILD_RUNS"
    manifest["currentStage"] = "E01_PREFLIGHT" if not preflight["wholeExamReady"] else "E02_CHILD_RUNS"
    parent_dir = store.create(run_id, manifest)
    atomic_write_json(parent_dir / "source" / "source-exam.json", exam)
    atomic_write_json(parent_dir / "source" / "preflight-report.json", preflight)
    if not preflight["wholeExamReady"]:
        manifest["events"].append({
            "at": utc_now(), "type": "EXAM_BATCH_PREFLIGHT_BLOCKED",
            "heldOrdinals": preflight["heldOrdinals"],
        })
        store.save(run_id, manifest)
        return manifest
    for ordinal in preflight["supportedOrdinals"]:
        child_id = f"{run_id}-q{ordinal:03d}"
        child = _child_manifest(
            parent=manifest, run_id=child_id, ordinal=ordinal, engine_version=engine_version
        )
        child_dir = store.create(child_id, child)
        question = exam["questions"][ordinal - 1]
        context = _adapter_context(question, ordinal)
        atomic_write_json(child_dir / "evidence" / "adapter-context.json", context)
        manifest["children"][str(ordinal)] = {
            "runId": child_id,
            "status": child["status"],
            "currentStage": child["currentStage"],
            "adapterContextPath": "evidence/adapter-context.json",
            "sourceQuestionSha256": preflight["questions"][ordinal - 1]["sourceQuestionSha256"],
        }
    manifest["events"].append({
        "at": utc_now(), "type": "EXAM_BATCH_CHILDREN_CREATED",
        "count": len(manifest["children"]),
    })
    store.save(run_id, manifest)
    return manifest


def _validate_frozen_child(store: RunStore, parent: dict[str, Any], ordinal: int, child: dict[str, Any]) -> str:
    child_manifest = store.load(child["runId"])
    if child_manifest.get("status") != "LOCALLY_FROZEN" or child_manifest.get("currentStage") != "R17_LOCAL_FREEZE":
        raise ValueError(f"child question {ordinal} is not locally frozen")
    lock = child_manifest.get("sourceLock", {})
    if lock.get("path") != parent["sourceLock"]["path"] or lock.get("sha256") != parent["sourceLock"]["sha256"]:
        raise ValueError(f"child question {ordinal} source lock mismatch")
    if lock.get("questionOrdinal") != ordinal:
        raise ValueError(f"child question {ordinal} ordinal mismatch")
    request = child_manifest.get("request", {})
    if (
        request.get("generationMode") != "EXAM_FOLLOWUP"
        or request.get("followupKind") != "CONFIRMATION"
        or request.get("operationMode") != "GENERATE"
        or request.get("outputProfile") != "JS_ARCHIVE"
        or request.get("expectedQuestionCount") != 1
        or request.get("parentExamRunId") != parent["runId"]
    ):
        raise ValueError(f"child question {ordinal} profile mismatch")
    child_dir = store.run_dir(child["runId"])
    source_question = json.loads((child_dir / "source" / "source-question.json").read_text(encoding="utf-8"))
    if source_question.get("questionSha256") != child.get("sourceQuestionSha256"):
        raise ValueError(f"child question {ordinal} source question hash mismatch")
    sidecar = json.loads((child_dir / "final" / "validation-sidecar.json").read_text(encoding="utf-8"))
    if sidecar.get("finalStatus") != "PASS":
        raise ValueError(f"child question {ordinal} sidecar did not PASS")
    package = child_dir / "final" / "alive-evidence-pack.zip"
    report = json.loads((child_dir / "final" / "package-report.json").read_text(encoding="utf-8"))
    if (
        report.get("zipSha256") != sha256_file(package)
        or report.get("publicationStatus") != "NOT_PUBLISHED"
        or report.get("roundTrip") != "PASS"
        or report.get("validationSidecarFinalStatus") != "PASS"
        or not isinstance(report.get("members"), list)
    ):
        raise ValueError(f"child question {ordinal} package integrity mismatch")
    structured = child_dir / "final" / "structured-question.json"
    sidecar_path = child_dir / "final" / "validation-sidecar.json"
    if not structured.is_file():
        raise ValueError(f"child question {ordinal} structured question missing")
    with zipfile.ZipFile(package, "r") as archive:
        names = archive.namelist()
        required = {"final/structured-question.json", "final/validation-sidecar.json"}
        if (
            archive.testzip() is not None
            or sorted(names) != sorted(report["members"])
            or not required.issubset(names)
            or archive.read("final/structured-question.json") != structured.read_bytes()
            or archive.read("final/validation-sidecar.json") != sidecar_path.read_bytes()
        ):
            raise ValueError(f"child question {ordinal} package CRC failed")
    return sha256_file(structured)


def sync_exam_batch(root: Path, store: RunStore, run_id: str) -> dict[str, Any]:
    manifest = store.load(run_id)
    if manifest.get("artifactType") != "ALIVE_EXAM_BATCH_RUN":
        raise ValueError("Run is not an exam batch")
    if manifest.get("status") == "BLOCKED" and "EXAM_CAPABILITY_PREFLIGHT_FAIL" in manifest.get("codes", []):
        return manifest
    if manifest.get("status") == "FAILED" and any(
        code in manifest.get("codes", [])
        for code in ("CHILD_RECOVERY_EXHAUSTED", "CHILD_RECOVERY_INTEGRITY_FAILURE")
    ):
        return manifest
    source = root / manifest["sourceLock"]["path"]
    if not source.is_file() or sha256_file(source) != manifest["sourceLock"]["sha256"]:
        raise ValueError("SOURCE_LOCK_DRIFT")
    completed = 0
    blocked = 0
    terminal_failures: list[dict[str, Any]] = []
    recoveries_created = 0
    for ordinal_text, child in manifest["children"].items():
        ordinal = int(ordinal_text)
        child_manifest = store.load(child["runId"])
        child["status"] = child_manifest["status"]
        child["currentStage"] = child_manifest["currentStage"]
        if child_manifest["status"] == "LOCALLY_FROZEN":
            child["frozenStructuredSha256"] = _validate_frozen_child(
                store, manifest, ordinal, child
            )
            completed += 1
        elif child_manifest["status"] == "FAILED":
            lineage, lineage_error = _recovery_lineage(child, child_manifest)
            reason_code = _failure_reason_code(child_manifest)
            integrity_error = lineage_error or _child_recovery_integrity_code(
                manifest, ordinal, child, child_manifest
            )
            if lineage is not None:
                _upsert_child_attempt(
                    child, child_manifest, lineage, failure_reason_code=reason_code
                )
            if integrity_error is not None or _is_integrity_failure(reason_code):
                terminal_failures.append({
                    "ordinal": ordinal,
                    "runId": child_manifest["runId"],
                    "reasonCode": integrity_error or reason_code,
                    "terminalCode": "CHILD_RECOVERY_INTEGRITY_FAILURE",
                })
            elif lineage is None:
                terminal_failures.append({
                    "ordinal": ordinal,
                    "runId": child_manifest["runId"],
                    "reasonCode": "CHILD_RECOVERY_LINEAGE_INVALID",
                    "terminalCode": "CHILD_RECOVERY_INTEGRITY_FAILURE",
                })
            elif lineage["recoveryAttempt"] >= _CHILD_RECOVERY_MAX_ATTEMPTS:
                terminal_failures.append({
                    "ordinal": ordinal,
                    "runId": child_manifest["runId"],
                    "reasonCode": reason_code,
                    "terminalCode": "CHILD_RECOVERY_EXHAUSTED",
                })
            else:
                recovered, recovery_error = _create_child_recovery(
                    root, store, manifest, ordinal, child, child_manifest, lineage, reason_code
                )
                if recovered:
                    recoveries_created += 1
                    manifest["events"].append({
                        "at": utc_now(),
                        "type": "EXAM_BATCH_CHILD_RECOVERY_STARTED",
                        "ordinal": ordinal,
                        "predecessorRunId": child_manifest["runId"],
                        "recoveryRunId": child["runId"],
                        "rootRunId": child["rootRunId"],
                        "recoveryAttempt": child["recoveryAttempt"],
                        "recoveryReasonCode": reason_code,
                    })
                else:
                    terminal_failures.append({
                        "ordinal": ordinal,
                        "runId": child_manifest["runId"],
                        "reasonCode": recovery_error or reason_code,
                        "terminalCode": "CHILD_RECOVERY_INTEGRITY_FAILURE",
                    })
        elif child_manifest["status"] == "BLOCKED":
            blocked += 1
    manifest["progress"] = {
        "expected": manifest["request"]["expectedQuestionCount"],
        "childRuns": len(manifest["children"]),
        "completed": completed,
        "failedOrBlocked": len(terminal_failures) + blocked,
        "unsupported": manifest["preflight"]["heldCount"],
        "recoveriesCreated": recoveries_created,
    }
    if terminal_failures:
        terminal_codes = sorted({item["terminalCode"] for item in terminal_failures})
        manifest["codes"] = sorted(set(manifest["codes"] + terminal_codes))
        manifest["status"] = "FAILED"
        manifest["currentStage"] = "E02_CHILD_RUNS"
        _set_exam_stage(
            manifest,
            "E02_CHILD_RUNS",
            "FAIL",
            "; ".join(
                f"q{item['ordinal']:03d}:{item['reasonCode']}" for item in terminal_failures
            ),
        )
        manifest["events"].append({
            "at": utc_now(),
            "type": "EXAM_BATCH_CHILD_RECOVERY_TERMINAL",
            "failures": terminal_failures,
        })
    elif blocked:
        manifest["status"] = "HOLD"
        manifest["codes"] = sorted(set(manifest["codes"] + ["CHILD_RUN_NOT_COMPLETE"]))
    elif manifest["preflight"]["heldCount"]:
        manifest["status"] = "HOLD" if completed == len(manifest["children"]) else "ACTIVE"
    elif completed == len(manifest["children"]) and completed == manifest["request"]["expectedQuestionCount"]:
        manifest["status"] = "READY_FOR_ASSEMBLY"
        manifest["currentStage"] = "E03_ASSEMBLY"
        _set_exam_stage(manifest, "E02_CHILD_RUNS", "PASS", f"{completed} child Runs frozen")
    else:
        manifest["status"] = "ACTIVE"
    store.save(run_id, manifest)
    return manifest


def assemble_exam(root: Path, store: RunStore, run_id: str, title: str) -> dict[str, Any]:
    manifest = sync_exam_batch(root, store, run_id)
    if manifest["status"] != "READY_FOR_ASSEMBLY" or manifest["currentStage"] != "E03_ASSEMBLY":
        raise ValueError("exam batch is not ready for complete assembly")
    parent_dir = store.run_dir(run_id)
    structured_questions: list[dict[str, Any]] = []
    archive_questions: list[dict[str, Any]] = []
    child_hashes: dict[str, str] = {}
    source_exam = json.loads((parent_dir / "source" / "source-exam.json").read_text(encoding="utf-8"))
    shadow = root / "archive" / "_generated" / "alive-exam-runs" / run_id / "candidate.js"
    visual_assets: dict[str, str] = {}
    for ordinal in range(1, manifest["request"]["expectedQuestionCount"] + 1):
        child = manifest["children"].get(str(ordinal))
        if not child:
            raise ValueError(f"missing child Run for question {ordinal}")
        path = store.run_dir(child["runId"]) / "final" / "structured-question.json"
        question = json.loads(path.read_text(encoding="utf-8"))
        question["id"] = ordinal
        visual = question.get("visual")
        if isinstance(visual, dict):
            source_asset = store.run_dir(child["runId"]) / visual["assetLocalPath"]
            if sha256_file(source_asset) != visual["assetSha256"]:
                raise ValueError(f"child question {ordinal} visual asset hash mismatch")
            asset_name = f"q{ordinal:02d}.svg"
            parent_asset = parent_dir / "final" / "assets" / asset_name
            shadow_asset = shadow.parent / "assets" / asset_name
            _atomic_copy(source_asset, parent_asset)
            _atomic_copy(source_asset, shadow_asset)
            question["image"] = f"_generated/alive-exam-runs/{run_id}/assets/{asset_name}"
            question["visual"] = {
                **visual,
                "assetLocalPath": f"final/assets/{asset_name}",
            }
            visual_assets[str(ordinal)] = sha256_file(parent_asset)
        score = manifest["preflight"]["questions"][ordinal - 1].get("score")
        if score is not None:
            content = _SCORE_RE.sub("", str(question["content"])).rstrip()
            question["content"] = f"{content} {score['annotation']}"
        structured_questions.append(question)
        archive_questions.append(_archive_projection(question))
        child_hashes[str(ordinal)] = sha256_file(path)
    structured_exam = {
        "schemaVersion": "0.4.0", "artifactType": "ALIVE_STRUCTURED_EXAM",
        "examTitle": title, "questionCount": len(structured_questions),
        "questions": structured_questions,
    }
    structured_target = parent_dir / "final" / "structured-exam.json"
    atomic_write_json(structured_target, structured_exam)
    script = (
        f"window.examTitle = {json.dumps(title, ensure_ascii=False)};\n\n"
        f"window.questionBank = {json.dumps(archive_questions, ensure_ascii=False, indent=2)};\n"
    )
    staging = parent_dir / "final" / "staging" / "generated-exam.js"
    _atomic_write_text(staging, script)
    _atomic_write_text(shadow, script)
    parsed_title, parsed_bank = _parse_serialized_js(staging.read_text(encoding="utf-8"))
    if parsed_title != title or parsed_bank != archive_questions:
        raise ValueError("whole-exam serializer semantic round-trip mismatch")
    content_hashes = [
        json_sha256({
            "content": _SCORE_RE.sub("", str(question["content"])).rstrip(),
            "choices": question.get("choices", []),
        })
        for question in structured_questions
    ]
    if len(content_hashes) != len(set(content_hashes)):
        raise ValueError("whole-exam assembly contains duplicate generated questions")
    generated_points = sum(
        float(contract["score"]["points"])
        for contract in manifest["preflight"]["questions"]
        if contract.get("score") is not None
    )
    expected_points = float(manifest["preflight"]["scoreContract"]["totalPoints"])
    if generated_points != expected_points or len(source_exam["questions"]) != len(structured_questions):
        raise ValueError("whole-exam score or source-count contract mismatch")
    report = {
        "stageId": "E03_ASSEMBLY", "verdict": "PASS", "questionCount": len(archive_questions),
        "childStructuredHashes": child_hashes, "structuredExamSha256": sha256_file(structured_target),
        "stagingSha256": sha256_file(staging), "shadowSha256": sha256_file(shadow),
        "shadowArchiveRelativePath": shadow.relative_to(root / "archive").as_posix(),
        "semanticRoundTrip": "PASS", "duplicateQuestionCheck": "PASS",
        "scoreContract": {
            "status": "PASS",
            "totalPoints": manifest["preflight"]["scoreContract"]["totalPoints"],
        },
        "visualAssets": visual_assets,
        "publicationStatus": "NOT_PUBLISHED",
    }
    report_target = parent_dir / "final" / "assembly-report.json"
    atomic_write_json(report_target, report)
    _set_exam_stage(manifest, "E03_ASSEMBLY", "PASS", f"{len(archive_questions)} questions assembled")
    manifest["status"] = "READY_FOR_RENDER"
    manifest["currentStage"] = "E04_REAL_RENDER"
    manifest["assembly"] = report
    store.save(run_id, manifest)
    return manifest


def record_exam_render(store: RunStore, run_id: str, evidence_path: Path) -> dict[str, Any]:
    manifest = store.load(run_id)
    if manifest.get("currentStage") != "E04_REAL_RENDER" or manifest.get("status") != "READY_FOR_RENDER":
        raise ValueError("exam batch is not ready for real render")
    evidence = json.loads(evidence_path.read_text(encoding="utf-8"))
    modes = evidence.get("modes")
    expected = manifest["request"]["expectedQuestionCount"]
    if evidence.get("actualBrowser") is not True or evidence.get("productionEngine") is not True:
        raise ValueError("whole-exam render requires actual production-engine browser evidence")
    if not isinstance(modes, dict) or set(modes) != {"exam", "solution", "answer"}:
        raise ValueError("whole-exam render requires exam, solution, and answer modes")
    for name, result in modes.items():
        if not isinstance(result, dict) or result.get("verdict") != "PASS":
            raise ValueError(f"whole-exam render mode {name} did not PASS")
        if result.get("ready") is not True or result.get("renderError") is not None:
            raise ValueError(f"whole-exam render mode {name} readiness invalid")
        if result.get("unrenderedMath") != 0 or result.get("overflowCount") != 0:
            raise ValueError(f"whole-exam render mode {name} math or overflow failed")
        if result.get("lastQuestion") != expected or result.get("badImages") != []:
            raise ValueError(f"whole-exam render mode {name} did not cover the complete exam")
        if result.get("lastPageChecked") is not True:
            raise ValueError(f"whole-exam render mode {name} last page was not checked")
    target = store.run_dir(run_id) / "render" / "render-evidence.json"
    atomic_write_json(target, evidence)
    _set_exam_stage(manifest, "E04_REAL_RENDER", "PASS", sha256_file(target))
    manifest["renderEvidenceSha256"] = sha256_file(target)
    manifest["status"] = "READY_FOR_PACKAGE"
    manifest["currentStage"] = "E05_PACKAGE"
    store.save(run_id, manifest)
    return manifest


def package_exam(store: RunStore, run_id: str) -> dict[str, Any]:
    manifest = store.load(run_id)
    if manifest.get("currentStage") != "E05_PACKAGE" or manifest.get("status") != "READY_FOR_PACKAGE":
        raise ValueError("exam batch is not ready for packaging")
    run_dir = store.run_dir(run_id)
    members = [
        "source/source-exam.json", "source/preflight-report.json", "final/structured-exam.json",
        "final/staging/generated-exam.js", "final/assembly-report.json",
        "render/render-evidence.json",
    ]
    members.extend(
        path.relative_to(run_dir).as_posix()
        for path in sorted((run_dir / "final" / "assets").glob("*.svg"))
    )
    for relative in members:
        if not (run_dir / relative).is_file():
            raise ValueError(f"whole-exam package member missing: {relative}")
    package = run_dir / "final" / "alive-whole-exam-pack.zip"
    with zipfile.ZipFile(package, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for relative in members:
            archive.write(run_dir / relative, arcname=relative)
    with zipfile.ZipFile(package, "r") as archive:
        if archive.testzip() is not None or sorted(archive.namelist()) != sorted(members):
            raise ValueError("whole-exam package round-trip failed")
    report = {
        "stageId": "E05_PACKAGE", "verdict": "PASS", "members": members,
        "zipSha256": sha256_file(package), "roundTrip": "PASS",
        "publicationStatus": "NOT_PUBLISHED",
    }
    atomic_write_json(run_dir / "final" / "package-report.json", report)
    _set_exam_stage(manifest, "E05_PACKAGE", "PASS", report["zipSha256"])
    _set_exam_stage(manifest, "E06_LOCAL_FREEZE", "PASS", "whole exam locally frozen")
    manifest["package"] = report
    manifest["status"] = "LOCALLY_FROZEN"
    manifest["currentStage"] = "E06_LOCAL_FREEZE"
    store.save(run_id, manifest)
    return manifest
