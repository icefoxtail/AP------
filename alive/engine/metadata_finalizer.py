"""Deterministic metadata cleanup and semantic consistency checks."""

from __future__ import annotations

import copy
import re
from typing import Any


STALE_SIMILAR_TAGS = frozenset({"기출", "기출문제", "원문"})
_CONSTRUCTED_MARKERS = re.compile(
    r"풀이\s*과정|과정을\s*(?:구체적으로\s*)?(?:서술|쓰|설명)|증명하|설명하|서술하"
)
_ARCHIVE_TYPES = {"객관식", "주관식", "단답형", "서술형"}


def infer_semantic_question_type(question: dict[str, Any]) -> str:
    choices = question.get("choices")
    if isinstance(choices, list) and len(choices) == 5:
        return "객관식"
    content = re.sub(r"<[^>]+>", " ", str(question.get("content") or ""))
    return "서술형" if _CONSTRUCTED_MARKERS.search(content) else "주관식"


def finalize_similar_metadata(
    source_question: dict[str, Any],
    student_payload: dict[str, Any],
    *,
    strict_type: bool = False,
) -> tuple[dict[str, Any], dict[str, Any]]:
    """Return cleaned metadata and a report; never invent curriculum values."""

    metadata = copy.deepcopy(source_question)
    original_tags = metadata.get("tags") if isinstance(metadata.get("tags"), list) else []
    tags = []
    removed: list[str] = []
    for tag in original_tags:
        if tag in STALE_SIMILAR_TAGS:
            removed.append(tag)
            continue
        if tag not in tags:
            tags.append(tag)
    metadata["tags"] = tags

    actual_type = str(student_payload.get("questionType") or "").strip()
    semantic_type = infer_semantic_question_type(student_payload)
    findings: list[dict[str, Any]] = []
    comparable_type = "주관식" if actual_type == "단답형" else actual_type
    if actual_type not in _ARCHIVE_TYPES:
        findings.append({"code": "QUESTION_TYPE_INVALID", "severity": "HARD_FAIL", "message": f"unsupported generated questionType: {actual_type}"})
    elif comparable_type != semantic_type:
        findings.append({"code": "QUESTION_TYPE_SEMANTIC_MISMATCH", "severity": "HARD_FAIL", "message": f"generated questionType {actual_type} conflicts with stem-derived type {semantic_type}"})
    report = {
        "version": "0.1.0",
        "similar": True,
        "removedStaleTags": removed,
        "remainingTags": tags,
        "generatedQuestionType": actual_type,
        "semanticQuestionType": semantic_type,
        "verdict": "FAIL" if findings and strict_type else "PASS",
        "findings": findings,
    }
    return metadata, report


__all__ = ["STALE_SIMILAR_TAGS", "finalize_similar_metadata", "infer_semantic_question_type"]
