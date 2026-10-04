"""Deterministic whole-exam batch planning.

The default staged controller keeps its historical contiguous partitioning.
The optional weighted planner is used by the four-batch comparison lane to
balance model workload without changing question order in the final exam.
"""

from __future__ import annotations

import math
from typing import Any


WEIGHTED_BATCH_PLANNER_VERSION = "weighted-four-batch-v1"


def estimate_question_weight(
    preflight_item: dict[str, Any], source_question: dict[str, Any]
) -> float:
    """Estimate generation/review workload from locked source metadata.

    This is deliberately a routing estimate, not a difficulty or correctness
    judgement.  It uses only deterministic source fields and therefore cannot
    change the generated mathematics or the final question order.
    """

    weight = 1.0
    visual_dependency = str(preflight_item.get("visualDependency") or "NONE").upper()
    if visual_dependency == "ESSENTIAL":
        weight += 2.0
    elif visual_dependency == "OPTIONAL":
        weight += 1.0

    if str(preflight_item.get("solutionVisualRequirement") or "").upper() == "MANDATORY":
        weight += 1.0
    solution_elements = preflight_item.get("solutionVisualElements")
    if isinstance(solution_elements, dict):
        active_elements = sum(value is True for value in solution_elements.values())
        if active_elements >= 2:
            weight += 0.5

    question_type = str(source_question.get("questionType") or "")
    if question_type == "서술형":
        weight += 0.75
    elif question_type == "주관식":
        weight += 0.5

    if source_question.get("wide") is True:
        weight += 0.25

    content = source_question.get("content")
    content_length = len(str(content)) if content is not None else 0
    if content_length > 700:
        weight += 0.5
    elif content_length > 350:
        weight += 0.25

    level = str(source_question.get("level") or "").strip().lower()
    if level in {"최상", "고난도", "심화", "상"}:
        weight += 0.5

    return round(weight, 2)


def weighted_batch_plan(
    ordinals: list[int],
    preflight_questions: list[dict[str, Any]],
    source_questions: list[dict[str, Any]],
    requested: int,
) -> dict[str, Any]:
    """Build a stable, weight-balanced partition using greedy bin packing.

    Heavier questions are placed first into the currently lightest bin. Ties
    are resolved by bin index and source ordinal, making the result repeatable
    across resume and comparison runs. Each bin is sorted before it is
    returned, while the assembler still owns the canonical exam order.
    """

    if not ordinals:
        return {
            "plannerVersion": WEIGHTED_BATCH_PLANNER_VERSION,
            "strategy": "WEIGHTED_BALANCED",
            "partitions": [],
            "questionWeights": {},
            "batchWeights": [],
        }

    count = max(1, min(int(requested), len(ordinals)))
    entries: list[tuple[int, float]] = []
    for ordinal in ordinals:
        index = ordinal - 1
        preflight_item = preflight_questions[index] if index < len(preflight_questions) else {}
        source_question = source_questions[index] if index < len(source_questions) else {}
        entries.append((ordinal, estimate_question_weight(preflight_item, source_question)))

    # Stable descending-weight ordering creates a deterministic, reasonably
    # balanced workload while preserving canonical ordering inside each bin.
    entries.sort(key=lambda item: (-item[1], item[0]))
    bins: list[dict[str, Any]] = [
        {"ordinals": [], "weight": 0.0, "index": index}
        for index in range(count)
    ]
    max_questions_per_batch = math.ceil(len(entries) / count)
    for ordinal, weight in entries:
        available = [
            item for item in bins
            if len(item["ordinals"]) < max_questions_per_batch
        ]
        if not available:
            raise ValueError("weighted batch planner exhausted its capacity")
        target = min(
            available,
            key=lambda item: (round(float(item["weight"]), 2), len(item["ordinals"]), item["index"]),
        )
        target["ordinals"].append(ordinal)
        target["weight"] = round(float(target["weight"]) + weight, 2)

    partitions = [sorted(item["ordinals"]) for item in bins]
    question_weights = {str(ordinal): weight for ordinal, weight in entries}
    return {
        "plannerVersion": WEIGHTED_BATCH_PLANNER_VERSION,
        "strategy": "WEIGHTED_BALANCED",
        "partitions": partitions,
        "questionWeights": question_weights,
        "batchWeights": [round(float(item["weight"]), 2) for item in bins],
        "maxQuestionsPerBatch": max_questions_per_batch,
    }
