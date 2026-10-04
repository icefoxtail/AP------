from __future__ import annotations

"""Select reviewed similar-question examples without leaking solutions.

Existing Archive similar files are a valuable pattern library, but they are
not a second canonical rule source.  This selector therefore requires review
evidence, ranks by taxonomy/type similarity, caps the context, and emits only
student-facing fields.  Builders may use the pack as a design reference; they
must recompute the mathematics and cannot copy an answer or solution from it.
"""

import copy
from collections import Counter
from pathlib import Path
from typing import Any

from .run_store import sha256_file
from .source_question import SourceQuestionError, extract_source_exam, json_sha256


REFERENCE_SCHEMA_VERSION = "0.1.0"
APPROVED_REVIEW_STATUSES = frozenset({"reviewed_pass", "auto_high"})
_QUESTION_TYPE_MAP = {
    "객관식": "MCQ",
    "주관식": "SHORT_ANSWER",
    "서술형": "CONSTRUCTED_RESPONSE",
    "MCQ": "MCQ",
    "SHORT_ANSWER": "SHORT_ANSWER",
    "CONSTRUCTED_RESPONSE": "CONSTRUCTED_RESPONSE",
}
_STUDENT_KEYS = (
    "level",
    "category",
    "originalCategory",
    "standardCourse",
    "standardUnitKey",
    "standardUnit",
    "standardUnitOrder",
    "subUnitKey",
    "subUnit",
    "subUnitConfidence",
    "subUnitClassificationDepth",
    "conceptClusterKey",
    "problemTypeKey",
    "templateKey",
    "difficultyBucket",
    "questionType",
    "layoutTag",
    "tags",
    "wide",
    "content",
    "choices",
    "image",
    "imageStatus",
    "visualDependency",
    "visualSpec",
    "diagramBlueprint",
    "visualFingerprint",
)


class ReferenceSelectorError(ValueError):
    """Raised when a reference selection request is malformed."""


def _text(value: Any) -> str:
    return str(value or "").strip()


def _question_type(value: Any) -> str:
    return _QUESTION_TYPE_MAP.get(_text(value), _text(value))


def _visual_dependency(question: dict[str, Any]) -> str:
    explicit = _text(question.get("visualDependency")).upper()
    if explicit in {"NONE", "OPTIONAL", "ESSENTIAL"}:
        return explicit
    if question.get("image") or question.get("visualSpec") or question.get("diagramBlueprint"):
        return "ESSENTIAL"
    return "NONE"


def _metadata(question: dict[str, Any]) -> dict[str, Any]:
    keys = (
        "standardCourse",
        "standardUnitKey",
        "subUnitKey",
        "conceptClusterKey",
        "problemTypeKey",
        "templateKey",
        "difficultyBucket",
        "standardUnit",
        "subUnit",
        "category",
        "level",
        "layoutTag",
        "wide",
    )
    metadata = {key: copy.deepcopy(question[key]) for key in keys if key in question}
    metadata["questionType"] = _question_type(question.get("questionType"))
    metadata["visualDependency"] = _visual_dependency(question)
    metadata["tags"] = copy.deepcopy(question.get("tags", [])) if isinstance(question.get("tags", []), list) else []
    return metadata


def _compact_value(value: Any, *, limit: int = 3500) -> Any:
    if isinstance(value, str):
        if len(value) <= limit:
            return value
        return {"truncated": True, "sha256": json_sha256(value), "characters": len(value)}
    if isinstance(value, list):
        return [_compact_value(item, limit=limit) for item in value[:20]]
    if isinstance(value, dict):
        return {str(key): _compact_value(item, limit=limit) for key, item in list(value.items())[:40]}
    return copy.deepcopy(value)


def _student_payload(question: dict[str, Any]) -> dict[str, Any]:
    payload = {
        key: _compact_value(question[key])
        for key in _STUDENT_KEYS
        if key in question and key.lower() not in {"answer", "solution", "solutionimage"}
    }
    payload.pop("id", None)
    return payload


def _review_status(question: dict[str, Any]) -> tuple[str, str]:
    review = _text(question.get("reviewStatus") or question.get("review_status")).lower()
    solution = _text(question.get("solutionStatus") or question.get("solution_status")).lower()
    # A reviewed question with no separate solutionStatus is treated as one
    # review envelope, not as automatically unreviewed.  Explicit non-pass
    # solution state still excludes the example.
    if not solution:
        solution = review
    return review, solution


def _eligible(question: dict[str, Any]) -> tuple[bool, str]:
    review, solution = _review_status(question)
    if review not in APPROVED_REVIEW_STATUSES:
        return False, "QUESTION_NOT_REVIEWED_PASS"
    if solution not in APPROVED_REVIEW_STATUSES:
        return False, "SOLUTION_NOT_REVIEWED_PASS"
    return True, ""


def _normalized_content(question: dict[str, Any]) -> str:
    return "".join(_text(question.get("content")).split()).lower()


def _score(source: dict[str, Any], candidate: dict[str, Any]) -> tuple[int, list[str]]:
    score = 0
    reasons: list[str] = []
    weighted_fields = (
        ("problemTypeKey", 80, "same_problem_type"),
        ("templateKey", 70, "same_template"),
        ("subUnitKey", 55, "same_subunit"),
        ("conceptClusterKey", 40, "same_concept_cluster"),
        ("standardUnitKey", 28, "same_standard_unit"),
        ("standardCourse", 10, "same_course"),
        ("category", 8, "same_category"),
    )
    for field, weight, reason in weighted_fields:
        source_value = _text(source.get(field))
        candidate_value = _text(candidate.get(field))
        if source_value and candidate_value and source_value == candidate_value:
            score += weight
            reasons.append(reason)
    if _question_type(source.get("questionType")) == _question_type(candidate.get("questionType")):
        score += 18
        reasons.append("same_response_form")
    if _text(source.get("level")) and _text(source.get("level")) == _text(candidate.get("level")):
        score += 12
        reasons.append("same_level_band")
    if _visual_dependency(source) == _visual_dependency(candidate):
        score += 15
        reasons.append("same_visual_dependency")
    return score, reasons


def _reference_id(path: str, ordinal: int, source_sha256: str) -> str:
    return "ref-" + json_sha256({"path": path, "ordinal": ordinal, "sha256": source_sha256})[:16]


def _relative(root: Path, path: Path) -> str:
    return path.resolve().relative_to(root.resolve()).as_posix()


def _catalog(root: Path, source_path: str | None) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    similar_root = root / "archive" / "exams" / "similar"
    source_resolved: Path | None = None
    if source_path:
        candidate = Path(source_path)
        source_resolved = (root / candidate).resolve() if not candidate.is_absolute() else candidate.resolve()
    candidates: list[dict[str, Any]] = []
    excluded = Counter()
    parse_errors: list[dict[str, str]] = []
    files_scanned = 0
    parsed_files = 0
    questions_scanned = 0
    if not similar_root.is_dir():
        return [], {
            "filesScanned": 0,
            "parsedFiles": 0,
            "questionsScanned": 0,
            "eligibleQuestions": 0,
            "excludedByReason": {},
            "parseErrors": [],
        }
    for path in sorted(similar_root.rglob("*.js"), key=lambda item: item.as_posix()):
        files_scanned += 1
        if source_resolved is not None and path.resolve() == source_resolved:
            excluded["SOURCE_FILE_EXCLUDED"] += 1
            continue
        try:
            exam = extract_source_exam(path)
        except (SourceQuestionError, OSError, UnicodeError) as error:
            parse_errors.append({"path": _relative(root, path), "error": str(error)[:240]})
            excluded["SOURCE_PARSE_ERROR"] += 1
            continue
        parsed_files += 1
        source = exam.get("source", {})
        source_sha256 = _text(source.get("sha256")) or sha256_file(path)
        relative = _relative(root, path)
        for ordinal, question in enumerate(exam.get("questions", []), 1):
            questions_scanned += 1
            eligible, reason = _eligible(question)
            if not eligible:
                excluded[reason] += 1
                continue
            candidates.append(
                {
                    "path": relative,
                    "sha256": source_sha256,
                    "ordinal": ordinal,
                    "question": question,
                    "metadata": _metadata(question),
                    "reviewStatus": _review_status(question)[0],
                    "solutionStatus": _review_status(question)[1],
                    "contentKey": _normalized_content(question),
                }
            )
    return candidates, {
        "filesScanned": files_scanned,
        "parsedFiles": parsed_files,
        "questionsScanned": questions_scanned,
        "eligibleQuestions": len(candidates),
        "excludedByReason": dict(sorted(excluded.items())),
        "parseErrors": parse_errors[:20],
    }


def select_reference_examples(
    root: Path,
    source_exam: dict[str, Any],
    *,
    source_path: str | None = None,
    limit_per_question: int = 3,
    max_per_file: int = 2,
) -> dict[str, Any]:
    """Build a bounded, solution-free reference pack for one source exam."""

    if limit_per_question < 0 or limit_per_question > 8:
        raise ReferenceSelectorError("limit_per_question must be between 0 and 8")
    if max_per_file < 1 or max_per_file > 8:
        raise ReferenceSelectorError("max_per_file must be between 1 and 8")
    questions = source_exam.get("questions")
    if not isinstance(questions, list):
        raise ReferenceSelectorError("source_exam.questions must be a list")
    root = Path(root).resolve()
    candidates, catalog_stats = _catalog(root, source_path)
    selected_total = 0
    question_packs: dict[str, Any] = {}
    for ordinal, source_question in enumerate(questions, 1):
        source_meta = _metadata(source_question)
        source_content = _normalized_content(source_question)
        ranked: list[tuple[int, str, int, list[str], dict[str, Any]]] = []
        for candidate in candidates:
            if candidate["contentKey"] and candidate["contentKey"] == source_content:
                continue
            score, reasons = _score(source_meta, candidate["metadata"])
            if score <= 0:
                continue
            ranked.append((score, candidate["path"], candidate["ordinal"], reasons, candidate))
        ranked.sort(key=lambda item: (-item[0], item[1], item[2]))
        selected: list[dict[str, Any]] = []
        per_file: Counter[str] = Counter()
        for score, path, candidate_ordinal, reasons, candidate in ranked:
            if len(selected) >= limit_per_question:
                break
            if per_file[path] >= max_per_file:
                continue
            review_status = candidate["reviewStatus"]
            selected.append(
                {
                    "referenceId": _reference_id(path, candidate_ordinal, candidate["sha256"]),
                    "sourcePath": path,
                    "sourceSha256": candidate["sha256"],
                    "sourceOrdinal": candidate_ordinal,
                    "matchScore": score,
                    "matchReasons": reasons,
                    "reviewStatus": review_status,
                    "solutionStatus": candidate["solutionStatus"],
                    "metadata": copy.deepcopy(candidate["metadata"]),
                    "studentPayload": _student_payload(candidate["question"]),
                }
            )
            per_file[path] += 1
        selected_total += len(selected)
        question_packs[str(ordinal)] = {
            "sourceMetadata": source_meta,
            "selected": selected,
            "selection": {
                "requested": limit_per_question,
                "rankedEligibleMatches": len(ranked),
                "selectedCount": len(selected),
                "status": "READY" if selected else "NO_VERIFIED_MATCH",
            },
        }

    pack: dict[str, Any] = {
        "schemaVersion": REFERENCE_SCHEMA_VERSION,
        "artifactType": "ALIVE_SIMILAR_REFERENCE_PACK",
        "status": "READY" if selected_total else "NO_VERIFIED_MATCH",
        "source": {
            "path": source_exam.get("source", {}).get("path"),
            "sha256": source_exam.get("source", {}).get("sha256"),
            "questionCount": len(questions),
        },
        "policy": {
            "approvedReviewStatuses": sorted(APPROVED_REVIEW_STATUSES),
            "solutionsExposed": False,
            "answersExposed": False,
            "purpose": "structural and pedagogical reference only; canonical rules and fresh mathematics remain authoritative",
            "limitPerQuestion": limit_per_question,
            "maxPerFile": max_per_file,
        },
        "catalog": catalog_stats,
        "questions": question_packs,
    }
    pack["selectedCount"] = selected_total
    pack["packSha256"] = json_sha256(pack)
    return pack

