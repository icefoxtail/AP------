from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path
from typing import Any


def _compact(value: str) -> str:
    return re.sub(r"[^0-9a-z가-힣]+", "", value.lower())


def _parse_query(query: str, explicit_question: int | None) -> dict[str, Any]:
    year_match = re.search(r"(?<!\d)(20)?(\d{2})\s*년", query)
    semester_match = re.search(r"([12])\s*학기", query)
    grade_match = re.search(r"([중고][123])", query)
    question_match = re.search(r"(?:문항|문제|q)?\s*(\d{1,2})\s*번", query, re.IGNORECASE)
    return {
        "compact": _compact(query),
        "year": 2000 + int(year_match.group(2)) if year_match else None,
        "semester": semester_match.group(1) if semester_match else None,
        "grade": grade_match.group(1) if grade_match else None,
        "question": explicit_question or (int(question_match.group(1)) if question_match else None),
        "examType": "final" if "기말" in query else "mid" if "중간" in query else None,
    }


def load_question_index(repository_root: Path) -> list[dict[str, Any]]:
    index_path = repository_root / "archive" / "question-index.js"
    if not index_path.is_file():
        return []
    text = index_path.read_text(encoding="utf-8-sig")
    start = text.find("[")
    end = text.rfind("]")
    if start < 0 or end < start:
        raise ValueError("archive/question-index.js does not contain a JSON array")
    payload = json.loads(text[start : end + 1])
    if not isinstance(payload, list):
        raise ValueError("question index payload must be an array")
    return payload


def _source_path(repository_root: Path, source_file: str) -> Path:
    return repository_root / "archive" / "exams" / Path(source_file)


def resolve_explicit_source(
    repository_root: Path, source_file: str, question: int | None = None
) -> dict[str, Any]:
    candidate = Path(source_file)
    path = candidate if candidate.is_absolute() else repository_root / candidate
    path = path.resolve()
    allowed_root = (repository_root / "archive" / "exams").resolve()
    try:
        path.relative_to(allowed_root)
    except ValueError as error:
        raise ValueError("source file must stay under archive/exams") from error
    if not path.is_file() or path.suffix.lower() != ".js":
        raise FileNotFoundError(f"source JS not found: {source_file}")
    return {
        "status": "UNIQUE",
        "query": source_file,
        "questionOrdinal": question,
        "selected": {"path": path.relative_to(repository_root).as_posix()},
        "candidates": [],
    }


def resolve_source(
    repository_root: Path, query: str, question: int | None = None, limit: int = 10
) -> dict[str, Any]:
    parsed = _parse_query(query, question)
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in load_question_index(repository_root):
        source_file = str(record.get("sourceFile", ""))
        if source_file.startswith("original/"):
            grouped[source_file].append(record)

    candidates: list[dict[str, Any]] = []
    for source_file, questions in grouped.items():
        first = questions[0]
        if parsed["year"] is not None and first.get("examYear") != parsed["year"]:
            continue
        if parsed["semester"] is not None and str(first.get("semester", "")) != parsed["semester"]:
            continue
        if parsed["grade"] is not None and first.get("grade") != parsed["grade"]:
            continue
        if parsed["examType"] is not None and first.get("examType") != parsed["examType"]:
            continue
        if parsed["question"] is not None and not any(
            int(item.get("sourceOrdinal", -1)) == parsed["question"] for item in questions
        ):
            continue

        school = _compact(str(first.get("school", "")))
        school_match = bool(school and school in parsed["compact"])
        score = sum(
            (
                5 if parsed["year"] is not None else 0,
                3 if parsed["examType"] is not None else 0,
                2 if parsed["semester"] is not None else 0,
                2 if parsed["grade"] is not None else 0,
                5 if school_match else 0,
                2 if parsed["question"] is not None else 0,
            )
        )
        selected_question = None
        if parsed["question"] is not None:
            selected_question = next(
                item for item in questions if int(item.get("sourceOrdinal", -1)) == parsed["question"]
            )
        path = _source_path(repository_root, source_file)
        if not path.is_file():
            continue
        candidates.append(
            {
                "path": path.relative_to(repository_root).as_posix(),
                "sourceFile": source_file,
                "examYear": first.get("examYear"),
                "school": first.get("school"),
                "grade": first.get("grade"),
                "subject": first.get("subject"),
                "semester": first.get("semester"),
                "examType": first.get("examType"),
                "questionCount": len(questions),
                "questionOrdinal": parsed["question"],
                "qKey": selected_question.get("qKey") if selected_question else None,
                "score": score,
                "schoolMatch": school_match,
            }
        )

    candidates.sort(key=lambda item: (-int(item["score"]), str(item["path"])))
    exact_candidates = [item for item in candidates if item["schoolMatch"]]
    selected_pool = exact_candidates if exact_candidates else candidates
    status = "NOT_FOUND"
    selected = None
    if len(selected_pool) == 1:
        status = "UNIQUE"
        selected = selected_pool[0]
    elif len(selected_pool) > 1:
        status = "AMBIGUOUS"
    return {
        "status": status,
        "query": query,
        "questionOrdinal": parsed["question"],
        "selected": selected,
        "candidates": selected_pool[: max(1, limit)],
        "candidateCount": len(selected_pool),
    }
