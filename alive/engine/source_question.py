from __future__ import annotations

import hashlib
import hmac
import json
import re
from pathlib import Path
from typing import Any


ARTIFACT_SCHEMA_VERSION = "0.1.0"
_QUESTION_BANK_ASSIGNMENT = re.compile(r"\bwindow\s*\.\s*questionBank\s*=")
_EXAM_TITLE_ASSIGNMENT = re.compile(r"\bwindow\s*\.\s*examTitle\s*=")
_SHA256 = re.compile(r"[0-9a-f]{64}")


class SourceQuestionError(ValueError):
    """Raised when a source question cannot be extracted without evaluating JS."""


def canonical_json_bytes(value: Any) -> bytes:
    """Return the stable UTF-8 JSON representation used by ALIVE artifact hashes."""

    try:
        rendered = json.dumps(
            value,
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
            allow_nan=False,
        )
    except (TypeError, ValueError) as error:
        raise SourceQuestionError("artifact contains a non-canonical JSON value") from error
    return rendered.encode("utf-8")


def json_sha256(value: Any) -> str:
    return hashlib.sha256(canonical_json_bytes(value)).hexdigest()


def artifact_sha256(artifact: dict[str, Any]) -> str:
    """Hash an artifact while excluding its self-describing artifactSha256 field."""

    payload = {key: value for key, value in artifact.items() if key != "artifactSha256"}
    return json_sha256(payload)


def _mask_strings_and_comments(text: str) -> str:
    """Mask JS strings/comments while preserving offsets for structural scanning."""

    masked = list(text)
    index = 0
    length = len(text)
    while index < length:
        char = text[index]
        if char in {'"', "'", "`"}:
            quote = char
            masked[index] = " "
            index += 1
            closed = False
            while index < length:
                char = text[index]
                masked[index] = "\n" if char == "\n" else " "
                if char == "\\":
                    index += 1
                    if index < length:
                        masked[index] = "\n" if text[index] == "\n" else " "
                elif char == quote:
                    closed = True
                    index += 1
                    break
                elif char in "\r\n" and quote != "`":
                    break
                index += 1
            if not closed:
                raise SourceQuestionError("unterminated JavaScript string before extraction")
            continue
        if char == "/" and index + 1 < length and text[index + 1] == "/":
            masked[index] = masked[index + 1] = " "
            index += 2
            while index < length and text[index] not in "\r\n":
                masked[index] = " "
                index += 1
            continue
        if char == "/" and index + 1 < length and text[index + 1] == "*":
            masked[index] = masked[index + 1] = " "
            index += 2
            closed = False
            while index < length:
                if index + 1 < length and text[index] == "*" and text[index + 1] == "/":
                    masked[index] = masked[index + 1] = " "
                    index += 2
                    closed = True
                    break
                masked[index] = "\n" if text[index] == "\n" else " "
                index += 1
            if not closed:
                raise SourceQuestionError("unterminated JavaScript block comment")
            continue
        index += 1
    return "".join(masked)


def _next_code_character(masked: str, start: int) -> int:
    index = start
    while index < len(masked) and masked[index].isspace():
        index += 1
    return index


def _question_bank_json(text: str, masked: str) -> str:
    assignments = list(_QUESTION_BANK_ASSIGNMENT.finditer(masked))
    if len(assignments) != 1:
        raise SourceQuestionError(
            "source must contain exactly one window.questionBank assignment"
        )

    start = _next_code_character(masked, assignments[0].end())
    if start >= len(masked) or masked[start] != "[":
        raise SourceQuestionError(
            "window.questionBank must be assigned a literal JSON array"
        )

    depth = 0
    for index in range(start, len(masked)):
        char = masked[index]
        if char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
            if depth == 0:
                return text[start : index + 1]
            if depth < 0:
                break
    raise SourceQuestionError("window.questionBank array is not balanced")


def _reject_duplicate_keys(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise SourceQuestionError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def _reject_json_constant(value: str) -> Any:
    raise SourceQuestionError(f"non-finite JSON number is unsupported: {value}")


def _load_question_bank(payload: str) -> list[Any]:
    try:
        value = json.loads(
            payload,
            object_pairs_hook=_reject_duplicate_keys,
            parse_constant=_reject_json_constant,
        )
    except SourceQuestionError:
        raise
    except json.JSONDecodeError as error:
        raise SourceQuestionError(
            "window.questionBank is not strict JSON; dynamic JavaScript is unsupported"
        ) from error
    if not isinstance(value, list):
        raise SourceQuestionError("window.questionBank payload must be an array")
    return value


def _optional_exam_title(text: str, masked: str) -> str | None:
    assignments = list(_EXAM_TITLE_ASSIGNMENT.finditer(masked))
    if len(assignments) != 1:
        return None
    start = assignments[0].end()
    while start < len(text) and text[start].isspace():
        start += 1
    if start >= len(text) or text[start] != '"':
        return None
    try:
        value, _ = json.JSONDecoder().raw_decode(text[start:])
    except json.JSONDecodeError:
        return None
    return value if isinstance(value, str) else None


def _validate_question(question: Any, ordinal: int) -> dict[str, Any]:
    if not isinstance(question, dict):
        raise SourceQuestionError(f"question at ordinal {ordinal} must be a JSON object")
    for field in ("content", "answer", "solution"):
        if field not in question:
            raise SourceQuestionError(
                f"question at ordinal {ordinal} is missing required field: {field}"
            )
    if not isinstance(question["content"], str):
        raise SourceQuestionError("question content must be a string")
    if not isinstance(question["solution"], str):
        raise SourceQuestionError("question solution must be a string")
    if question["answer"] is None or isinstance(question["answer"], (dict, bool)):
        raise SourceQuestionError("question answer must be a non-null JSON scalar or array")
    if "choices" in question:
        choices = question["choices"]
        if not isinstance(choices, list) or not all(isinstance(item, str) for item in choices):
            raise SourceQuestionError("question choices must be an array of strings")
    return question


def _extract_source_question(
    source_file: str | Path,
    ordinal: int,
    *,
    expected_source_sha256: str | None = None,
    source_label: str | None = None,
) -> dict[str, Any]:
    """Extract one ordinal question from a locked Archive JS source.

    Only a strict-JSON ``window.questionBank = [...]`` payload is supported. The
    source is read as text and never evaluated as JavaScript.
    """

    if isinstance(ordinal, bool) or not isinstance(ordinal, int) or ordinal < 1:
        raise SourceQuestionError("question ordinal must be a positive integer")

    path = Path(source_file)
    if not path.is_file() or path.suffix.lower() != ".js":
        raise SourceQuestionError(f"source JS not found: {path}")
    source_bytes = path.read_bytes()
    source_hash = hashlib.sha256(source_bytes).hexdigest()
    if expected_source_sha256 is not None:
        expected = expected_source_sha256.lower()
        if not _SHA256.fullmatch(expected):
            raise SourceQuestionError("expected source SHA-256 must be 64 lowercase hex characters")
        if not hmac.compare_digest(source_hash, expected):
            raise SourceQuestionError("source SHA-256 does not match the locked source")

    try:
        text = source_bytes.decode("utf-8-sig")
    except UnicodeDecodeError as error:
        raise SourceQuestionError("source JS must be UTF-8 or UTF-8 with BOM") from error
    masked = _mask_strings_and_comments(text)
    question_bank = _load_question_bank(_question_bank_json(text, masked))
    if ordinal > len(question_bank):
        raise SourceQuestionError(
            f"question ordinal {ordinal} is outside the source range 1..{len(question_bank)}"
        )

    question = _validate_question(question_bank[ordinal - 1], ordinal)
    label = source_label if source_label is not None else path.as_posix()
    artifact: dict[str, Any] = {
        "schemaVersion": ARTIFACT_SCHEMA_VERSION,
        "artifactType": "ALIVE_SOURCE_QUESTION",
        "source": {
            "path": str(label).replace("\\", "/"),
            "sha256": source_hash,
            "bytes": len(source_bytes),
        },
        "selection": {
            "ordinal": ordinal,
            "arrayIndex": ordinal - 1,
            "sourceId": question.get("id"),
        },
        "question": question,
        "questionSha256": json_sha256(question),
    }
    exam_title = _optional_exam_title(text, masked)
    if exam_title is not None:
        artifact["examTitle"] = exam_title
    artifact["artifactSha256"] = artifact_sha256(artifact)
    return artifact


def extract_source_question(
    source_path: Path,
    question_ordinal: int,
    source_lock: dict | None = None,
) -> dict:
    """Stable CLI-facing source-question extraction API.

    When supplied, ``source_lock`` must carry the locked SHA-256. Its optional
    path, byte size, and question ordinal are also enforced or propagated.
    """

    if source_lock is not None and not isinstance(source_lock, dict):
        raise SourceQuestionError("source_lock must be a dictionary or None")

    expected_sha256: str | None = None
    source_label: str | None = None
    locked_bytes: Any = None
    if source_lock is not None:
        expected_sha256 = source_lock.get("sha256")
        if not isinstance(expected_sha256, str):
            raise SourceQuestionError("source_lock.sha256 is required")
        source_label_value = source_lock.get("path")
        if source_label_value is not None:
            if not isinstance(source_label_value, str) or not source_label_value:
                raise SourceQuestionError("source_lock.path must be a non-empty string")
            source_label = source_label_value
        locked_ordinal = source_lock.get("questionOrdinal")
        if locked_ordinal is not None and locked_ordinal != question_ordinal:
            raise SourceQuestionError(
                "question ordinal does not match source_lock.questionOrdinal"
            )
        locked_bytes = source_lock.get("bytes")
        if locked_bytes is not None and (
            isinstance(locked_bytes, bool) or not isinstance(locked_bytes, int) or locked_bytes < 0
        ):
            raise SourceQuestionError("source_lock.bytes must be a non-negative integer")

    artifact = _extract_source_question(
        source_path,
        question_ordinal,
        expected_source_sha256=expected_sha256,
        source_label=source_label,
    )
    if locked_bytes is not None and artifact["source"]["bytes"] != locked_bytes:
        raise SourceQuestionError("source byte size does not match source_lock.bytes")
    return artifact


def extract_source_exam(source_path: Path, source_lock: dict | None = None) -> dict[str, Any]:
    """Extract a complete strict-JSON Archive exam without evaluating JavaScript."""

    path = Path(source_path)
    if not path.is_file() or path.suffix.lower() != ".js":
        raise SourceQuestionError(f"source JS not found: {path}")
    source_bytes = path.read_bytes()
    source_hash = hashlib.sha256(source_bytes).hexdigest()
    source_label = path.as_posix()
    if source_lock is not None:
        if not isinstance(source_lock, dict):
            raise SourceQuestionError("source_lock must be a dictionary or None")
        expected = source_lock.get("sha256")
        if not isinstance(expected, str) or not _SHA256.fullmatch(expected):
            raise SourceQuestionError("source_lock.sha256 is required")
        if not hmac.compare_digest(source_hash, expected):
            raise SourceQuestionError("source SHA-256 does not match the locked source")
        locked_bytes = source_lock.get("bytes")
        if locked_bytes is not None and locked_bytes != len(source_bytes):
            raise SourceQuestionError("source byte size does not match source_lock.bytes")
        if isinstance(source_lock.get("path"), str) and source_lock["path"]:
            source_label = source_lock["path"]
    try:
        text = source_bytes.decode("utf-8-sig")
    except UnicodeDecodeError as error:
        raise SourceQuestionError("source JS must be UTF-8 or UTF-8 with BOM") from error
    masked = _mask_strings_and_comments(text)
    bank = _load_question_bank(_question_bank_json(text, masked))
    questions = [_validate_question(question, ordinal) for ordinal, question in enumerate(bank, 1)]
    artifact: dict[str, Any] = {
        "schemaVersion": ARTIFACT_SCHEMA_VERSION,
        "artifactType": "ALIVE_SOURCE_EXAM",
        "source": {
            "path": str(source_label).replace("\\", "/"),
            "sha256": source_hash,
            "bytes": len(source_bytes),
        },
        "questionCount": len(questions),
        "questions": questions,
        "questionsSha256": json_sha256(questions),
    }
    title = _optional_exam_title(text, masked)
    if title is not None:
        artifact["examTitle"] = title
    artifact["artifactSha256"] = artifact_sha256(artifact)
    return artifact
