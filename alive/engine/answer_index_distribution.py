"""Shared answer-index distribution contract and evaluator."""

from __future__ import annotations

from collections import Counter
from functools import lru_cache
from hashlib import sha256
import re
from typing import Any, Iterable


ANSWER_INDEX_DISTRIBUTION_VERSION = "ANSWER_INDEX_DISTRIBUTION_V1"
_CIRCLED = "①②③④⑤"
_MCQ_TYPES = {"객관식", "objective", "multiple_choice", "choice"}
_ANSWER_SEPARATOR_RE = re.compile(r"[,，、;/\s]+")
_EMBEDDED_CHOICE_LABEL_RE = re.compile(r"^\s*(?:[①②③④⑤]|[1-5]\s*[.)])(?:\s|$)")
_ORDERED_CHOICE_RE = re.compile(
    r"(?:보기|선택지|선택항목).{0,16}(?:오름차순|내림차순|순서|차례|왼쪽부터|시간순|단계순)"
    r"|(?:오름차순|내림차순)으로\s*(?:배열|나열|정렬)",
    re.IGNORECASE,
)
_SOLUTION_INDEX_RE = re.compile(
    r"(?:정답|답|따라서|그러므로|결과|answer|correct)[^\n]{0,120}"
    r"(?:[①②③④⑤]|[1-5]\s*번)",
    re.IGNORECASE,
)
_SOLUTION_INDEX_TAIL_RE = re.compile(
    r"(?:[①②③④⑤]|[1-5]\s*번)[^\n]{0,24}(?:이다|입니다|임|정답|answer)",
    re.IGNORECASE,
)
_SHARED_KEYS = {
    "commondata", "commondataid", "shareddata", "shareddataid",
    "sharedmaterial", "sharedmaterialid", "passageid",
}


def parse_answer_indices(value: Any) -> list[int]:
    """Return one-based answer indices for circled or explicit numeric keys."""

    if value is None:
        return []
    text = str(value).strip()
    if not text:
        return []
    if text in _CIRCLED:
        return [_CIRCLED.index(text) + 1]
    if re.fullmatch(r"[1-5]", text):
        return [int(text)]
    tokens = [token for token in _ANSWER_SEPARATOR_RE.split(text) if token]
    indices: list[int] = []
    for token in tokens:
        if token in _CIRCLED:
            indices.append(_CIRCLED.index(token) + 1)
        elif re.fullmatch(r"[1-5]", token):
            indices.append(int(token))
        else:
            return []
    return indices if len(indices) == len(set(indices)) else []


def is_objective_question(question: dict[str, Any]) -> bool:
    question_type = str(question.get("questionType") or "").strip().lower()
    choices = question.get("choices")
    return (
        question_type in {value.lower() for value in _MCQ_TYPES}
        or isinstance(choices, list) and len(choices) > 0
    )


def is_answer_distribution_target(
    source_file: str | None, *, exam_title: str | None = None
) -> bool:
    """Return whether the path is an active generated similar-exam target."""

    if not source_file:
        return False
    normalized = str(source_file).replace("\\", "/")
    if "/similar/" not in f"/{normalized.strip('/')}/":
        return False
    leaf = normalized.rsplit("/", 1)[-1]
    return bool(re.search(r"유사|확인|심화", f"{leaf} {exam_title or ''}"))


def _has_image(question: dict[str, Any]) -> bool:
    return any(question.get(key) for key in (
        "image", "images", "imageAsset", "imageAssets", "visual", "diagram"
    ))


def _shared_material_dependency(question: dict[str, Any]) -> bool:
    return any(
        str(key).replace("_", "").lower() in _SHARED_KEYS and value
        for key, value in question.items()
    )


def _ordered_choice_detected(question: dict[str, Any]) -> bool:
    if question.get("orderedChoice") is True:
        return True
    return bool(_ORDERED_CHOICE_RE.search(str(question.get("content") or "")))


def _embedded_choice_label_detected(question: dict[str, Any]) -> bool:
    choices = question.get("choices")
    if not isinstance(choices, list):
        return False
    return any(_EMBEDDED_CHOICE_LABEL_RE.search(str(choice)) for choice in choices)


def _solution_index_matches(question: dict[str, Any]) -> list[str]:
    solution = str(question.get("solution") or "")
    matches = [match.group(0).strip() for match in _SOLUTION_INDEX_RE.finditer(solution)]
    matches.extend(match.group(0).strip() for match in _SOLUTION_INDEX_TAIL_RE.finditer(solution))
    return list(dict.fromkeys(matches))


def choice_order_evidence(
    question: dict[str, Any], *, ordinal: int | None = None,
    target_answer_index: int | None = None,
) -> dict[str, Any]:
    """Build per-question choice-order mutability evidence."""

    choices = question.get("choices")
    choices_list = choices if isinstance(choices, list) else []
    answer_indices = parse_answer_indices(question.get("answer"))
    image_choice_detected = (choices_list == [] and _has_image(question)) or (
        "통이미지보기" in [str(tag) for tag in question.get("tags", [])]
    )
    ordered_choice_detected = _ordered_choice_detected(question)
    embedded_choice_label_detected = _embedded_choice_label_detected(question)
    shared_material_dependency = _shared_material_dependency(question)
    blocking_reasons: list[str] = []
    if image_choice_detected:
        blocking_reasons.append("IMAGE_ONLY_CHOICES")
    if len(choices_list) != 5:
        blocking_reasons.append("CHOICES_NOT_FIVE")
    if len(answer_indices) != 1:
        blocking_reasons.append("ANSWER_NOT_SINGLE_INDEX")
    if ordered_choice_detected:
        blocking_reasons.append("SEMANTIC_ORDER_DEPENDENCY")
    if embedded_choice_label_detected:
        blocking_reasons.append("EMBEDDED_CHOICE_LABEL")
    if shared_material_dependency:
        blocking_reasons.append("SHARED_MATERIAL_DEPENDENCY")
    matched_text = _solution_index_matches(question)
    mutable = not blocking_reasons
    valid_mcq = len(choices_list) == 5 and len(answer_indices) == 1
    return {
        "questionId": question.get("id", ordinal),
        "currentAnswerIndex": answer_indices[0] if len(answer_indices) == 1 else None,
        "currentAnswerIndices": answer_indices,
        "validMcq": valid_mcq,
        "targetAnswerIndex": target_answer_index,
        "choiceOrderMutable": mutable,
        "mutableRuleId": "TEXT_CHOICES_NO_ORDER_DEPENDENCY" if mutable else "CHOICE_ORDER_BLOCKED",
        "mutableReason": (
            "five textual choices with no detected semantic order dependency" if mutable else None
        ),
        "blockingReason": blocking_reasons,
        "orderedChoiceDetected": ordered_choice_detected,
        "embeddedChoiceLabelDetected": embedded_choice_label_detected,
        "imageChoiceDetected": image_choice_detected,
        "sharedMaterialDependency": shared_material_dependency,
        "solutionAnswerIndexDependent": bool(matched_text),
        "solutionMatchedText": matched_text,
    }


def _terminal_counts_valid(
    counts: tuple[int, ...], *, minimum_kinds: int, max_minus_min: int | None
) -> bool:
    if sum(1 for count in counts if count > 0) < minimum_kinds:
        return False
    return max_minus_min is None or max(counts) - min(counts) <= max_minus_min


def _counts_can_reach_terminal(
    counts: tuple[int, ...], *, remaining: int, minimum_kinds: int,
    max_minus_min: int | None
) -> bool:
    if max_minus_min is None:
        return True
    if minimum_kinds != 5:
        return True
    for minimum in range(1, sum(counts) + remaining + 1):
        if any(count > minimum + max_minus_min for count in counts):
            continue
        minimum_additions = sum(max(minimum - count, 0) for count in counts)
        maximum_additions = sum(minimum + max_minus_min - count for count in counts)
        if minimum_additions <= remaining <= maximum_additions:
            return True
    return False


def _question_ids_contiguous(rows: list[dict[str, Any]], index: int) -> bool:
    if index == 0:
        return False
    try:
        return int(rows[index]["questionId"]) == int(rows[index - 1]["questionId"]) + 1
    except (TypeError, ValueError):
        return rows[index]["questionId"] == rows[index - 1]["questionId"]


def _best_sequence(
    rows: list[dict[str, Any]], order: list[int], *, minimum_kinds: int,
    max_minus_min: int | None,
) -> dict[str, Any] | None:
    """Find the highest-match sequence over the complete allowed count space."""

    if not rows:
        return None
    impossible = -10**9

    @lru_cache(maxsize=None)
    def best_score(index: int, counts: tuple[int, ...], last: int, run: int) -> int:
        if index == len(rows):
            return 0 if _terminal_counts_valid(
                counts, minimum_kinds=minimum_kinds, max_minus_min=max_minus_min
            ) else impossible
        if not _question_ids_contiguous(rows, index):
            last, run = 0, 0
        if not _counts_can_reach_terminal(
            counts,
            remaining=len(rows) - index,
            minimum_kinds=minimum_kinds,
            max_minus_min=max_minus_min,
        ):
            return impossible
        allowed = order if rows[index]["choiceOrderMutable"] else [rows[index]["currentAnswerIndex"]]
        best = impossible
        for position in allowed:
            if position is None:
                continue
            slot = position - 1
            updated = list(counts)
            updated[slot] += 1
            if position == last and run >= 2:
                continue
            suffix = best_score(
                index + 1, tuple(updated), position, run + 1 if position == last else 1
            )
            if suffix <= impossible:
                continue
            score = (1 if position == rows[index]["currentAnswerIndex"] else 0) + suffix
            best = max(best, score)
        return best

    score = best_score(0, (0, 0, 0, 0, 0), 0, 0)
    if score <= impossible:
        return None
    sequence: list[int] = []
    counts = (0, 0, 0, 0, 0)
    last, run = 0, 0
    for index, row in enumerate(rows):
        if not _question_ids_contiguous(rows, index):
            last, run = 0, 0
        allowed = order if row["choiceOrderMutable"] else [row["currentAnswerIndex"]]
        options: list[tuple[int, int]] = []
        for position in allowed:
            if position is None:
                continue
            slot = position - 1
            updated = list(counts)
            updated[slot] += 1
            if position == last and run >= 2:
                continue
            suffix = best_score(
                index + 1, tuple(updated), position, run + 1 if position == last else 1
            )
            if suffix <= impossible:
                continue
            options.append((position, (1 if position == row["currentAnswerIndex"] else 0) + suffix))
        best = max(score for _position, score in options)
        position = next(position for position, value in options if value == best)
        sequence.append(position)
        updated = list(counts)
        updated[position - 1] += 1
        counts = tuple(updated)
        run = run + 1 if position == last else 1
        last = position
    return {"score": score, "sequence": sequence, "targetCounts": counts}


def _repair_is_feasible(rows: list[dict[str, Any]], *, minimum_kinds: int = 5) -> bool:
    if not rows:
        return False
    max_minus_min = 2 if len(rows) >= 10 else None
    return _best_sequence(
        rows, [1, 2, 3, 4, 5], minimum_kinds=minimum_kinds,
        max_minus_min=max_minus_min
    ) is not None


def _longest_runs(rows: list[dict[str, Any]]) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    longest = {"count": 0, "answerIndex": None, "fromQuestionId": None, "toQuestionId": None}
    repeated: list[dict[str, Any]] = []
    start = 0
    for index, row in enumerate(rows):
        if (
            index == 0
            or row["questionId"] != rows[index - 1]["questionId"] + 1
            or row["currentAnswerIndex"] != rows[index - 1]["currentAnswerIndex"]
        ):
            start = index
        count = index - start + 1
        if count > longest["count"]:
            longest = {
                "count": count,
                "answerIndex": row["currentAnswerIndex"],
                "fromQuestionId": rows[start]["questionId"],
                "toQuestionId": row["questionId"],
            }
    index = 0
    while index < len(rows):
        end = index + 1
        while (
            end < len(rows)
            and rows[end]["questionId"] == rows[end - 1]["questionId"] + 1
            and rows[end]["currentAnswerIndex"] == rows[index]["currentAnswerIndex"]
        ):
            end += 1
        if end - index >= 3:
            repeated.append({
                "answerIndex": rows[index]["currentAnswerIndex"],
                "fromQuestionId": rows[index]["questionId"],
                "toQuestionId": rows[end - 1]["questionId"],
                "count": end - index,
            })
        index = end
    return longest, repeated


def _deterministic_seed(source_file: str | None, policy_version: str) -> int:
    material = f"{source_file or ''}|{ANSWER_INDEX_DISTRIBUTION_VERSION}|{policy_version}"
    return int(sha256(material.encode("utf-8")).hexdigest()[:8], 16)


def _deterministic_order(seed: int) -> list[int]:
    order = [1, 2, 3, 4, 5]
    state = seed & 0xFFFFFFFF
    for index in range(4, 0, -1):
        state = (state * 1664525 + 1013904223) & 0xFFFFFFFF
        swap_index = state % (index + 1)
        order[index], order[swap_index] = order[swap_index], order[index]
    return order


def _solution_replacement_text(text: str, old_index: int, new_index: int) -> str:
    old_label, new_label = _CIRCLED[old_index - 1], _CIRCLED[new_index - 1]
    replaced = text.replace(old_label, new_label)
    return re.sub(rf"(?<!\d){old_index}(?=\s*번)", str(new_index), replaced)


def _stable_choice_move(question: dict[str, Any], old_index: int, new_index: int) -> dict[str, Any]:
    choices = list(question.get("choices") or [])
    correct = choices.pop(old_index - 1)
    choices.insert(new_index - 1, correct)
    return {"from": old_index, "to": new_index, "choices": choices}


def build_deterministic_repair_plan(
    questions: Iterable[dict[str, Any]], *, source_file: str | None,
    policy_version: str = "1.0.0", generation_version: str = "archive-current",
    policy_enabled: bool = True,
) -> dict[str, Any]:
    """Build a minimum-change, deterministic answer-index repair plan."""

    question_list = list(questions)
    current = evaluate_answer_index_distribution(
        question_list, policy_enabled=policy_enabled, source_file=source_file
    )
    evidence_by_id: dict[Any, dict[str, Any]] = {}
    valid_rows: list[dict[str, Any]] = []
    all_evidence: list[dict[str, Any]] = []
    for ordinal, question in enumerate(question_list, start=1):
        evidence = choice_order_evidence(question, ordinal=ordinal)
        all_evidence.append(evidence)
        evidence_by_id[evidence["questionId"]] = evidence
        if (
            isinstance(question.get("choices"), list)
            and len(question["choices"]) == 5
            and len(evidence["currentAnswerIndices"]) == 1
        ):
            valid_rows.append({
                "questionId": evidence["questionId"],
                "currentAnswerIndex": evidence["currentAnswerIndex"],
                "choiceOrderMutable": evidence["choiceOrderMutable"],
                "solutionAnswerIndexDependent": evidence["solutionAnswerIndexDependent"],
                "solutionMatchedText": evidence["solutionMatchedText"],
            })

    plan: dict[str, Any] = {
        "schemaVersion": "ANSWER_INDEX_DISTRIBUTION_REPAIR_PLAN_V1",
        "sourceFile": source_file,
        "policyVersion": policy_version,
        "generationVersion": generation_version,
        "seed": _deterministic_seed(source_file, policy_version),
        "sourceGateStatus": current["gateStatus"],
        "questionEvidence": all_evidence,
        "status": "NO_CHANGE",
        "targetCounts": None,
        "targetSequence": [],
        "changedQuestionIds": [],
        "changedQuestionCount": 0,
        "solutionSync": [],
        "permutations": [],
        "targetDistribution": None,
        "targetLongestRun": None,
        "targetRepeatedRuns": [],
        "errors": [],
    }
    if not policy_enabled or current["gateStatus"] in {
        "NOT_APPLICABLE_SCOPE", "NOT_APPLICABLE_LOW_MCQ_COUNT", "PASS"
    }:
        return plan
    if current["gateStatus"] == "BLOCKED":
        plan["status"] = "BLOCKED_IMMUTABLE"
        plan["errors"] = list(current["failureCodes"])
        return plan
    if not valid_rows:
        plan["status"] = "BLOCKED_NO_VALID_MCQ"
        plan["errors"] = ["NO_VALID_MCQ"]
        return plan

    seed = plan["seed"]
    order = _deterministic_order(seed)
    minimum_kinds = 5 if len(valid_rows) >= 10 else 3
    max_minus_min = 2 if len(valid_rows) >= 10 else None
    selected = _best_sequence(
        valid_rows, order, minimum_kinds=minimum_kinds,
        max_minus_min=max_minus_min
    )
    if selected is None:
        plan["status"] = "BLOCKED_IMMUTABLE"
        plan["errors"] = ["ANSWER_INDEX_REPAIR_BLOCKED_IMMUTABLE"]
        return plan

    selected_sequence = selected["sequence"]
    selected_target = selected["targetCounts"]

    plan["status"] = "PLANNED"
    plan["targetCounts"] = {index: selected_target[index - 1] for index in range(1, 6)}
    plan["targetSequence"] = selected_sequence
    plan["targetDistribution"] = [selected_sequence.count(index) for index in range(1, 6)]
    target_rows = [
        {"questionId": row["questionId"], "currentAnswerIndex": selected_sequence[index]}
        for index, row in enumerate(valid_rows)
    ]
    target_longest, target_runs = _longest_runs(target_rows)
    plan["targetLongestRun"] = target_longest
    plan["targetRepeatedRuns"] = target_runs
    for index, row in enumerate(valid_rows):
        old_index = row["currentAnswerIndex"]
        new_index = selected_sequence[index]
        evidence = evidence_by_id[row["questionId"]]
        evidence["targetAnswerIndex"] = new_index
        if old_index == new_index:
            continue
        plan["changedQuestionIds"].append(row["questionId"])
        question = next(q for q in question_list if q.get("id") == row["questionId"])
        plan["permutations"].append({
            "questionId": row["questionId"],
            "fromAnswerIndex": old_index,
            "toAnswerIndex": new_index,
            "answerValuePreserved": True,
            "choiceMove": _stable_choice_move(question, old_index, new_index),
        })
        if row["solutionAnswerIndexDependent"]:
            sync_rows = []
            for text in row["solutionMatchedText"]:
                sync_rows.append({
                    "matchedText": text,
                    "plannedReplacement": _solution_replacement_text(text, old_index, new_index),
                })
            plan["solutionSync"].append({
                "questionId": row["questionId"],
                "fromAnswerIndex": old_index,
                "toAnswerIndex": new_index,
                "matches": sync_rows,
            })
    plan["changedQuestionCount"] = len(plan["changedQuestionIds"])
    return plan


def evaluate_answer_index_distribution(
    questions: Iterable[dict[str, Any]], *, policy_enabled: bool = True,
    source_file: str | None = None,
) -> dict[str, Any]:
    """Evaluate one whole exam under the ACTIVE answer-index contract."""

    evidence: list[dict[str, Any]] = []
    valid_rows: list[dict[str, Any]] = []
    multiple_answer_count = 0
    empty_choices_mcq = 0
    other_structure_exception_count = 0
    for ordinal, question in enumerate(questions, start=1):
        if not is_objective_question(question):
            continue
        item = choice_order_evidence(question, ordinal=ordinal)
        evidence.append(item)
        choices = question.get("choices")
        choices_length = len(choices) if isinstance(choices, list) else 0
        answer_indices = item["currentAnswerIndices"]
        if choices_length == 0:
            empty_choices_mcq += 1
        elif len(answer_indices) > 1:
            multiple_answer_count += 1
        elif choices_length != 5 or len(answer_indices) != 1:
            other_structure_exception_count += 1
        if choices_length == 5 and len(answer_indices) == 1:
            valid_rows.append({
                "questionId": item["questionId"],
                "currentAnswerIndex": item["currentAnswerIndex"],
                "choiceOrderMutable": item["choiceOrderMutable"],
                "solutionAnswerIndexDependent": item["solutionAnswerIndexDependent"],
            })
    counts = Counter(row["currentAnswerIndex"] for row in valid_rows)
    count_map = {index: counts.get(index, 0) for index in range(1, 6)}
    valid_count = len(valid_rows)
    max_count = max(count_map.values(), default=0)
    min_count = min(count_map.values(), default=0)
    longest, repeated_runs = _longest_runs(valid_rows)
    used_kinds = sum(1 for count in count_map.values() if count > 0)
    mutable_count = sum(1 for row in valid_rows if row["choiceOrderMutable"])
    immutable_count = valid_count - mutable_count
    failure_codes: list[str] = []
    if not policy_enabled:
        gate_status = "NOT_APPLICABLE_SCOPE"
    elif valid_count < 5:
        gate_status = "NOT_APPLICABLE_LOW_MCQ_COUNT"
    else:
        if valid_count >= 10 and max_count - min_count > 2:
            failure_codes.append("ANSWER_INDEX_DISTRIBUTION_EXCESS")
        if longest["count"] >= 3:
            failure_codes.append("ANSWER_INDEX_RUN_EXCESS")
        if valid_count >= 10 and used_kinds < 5:
            if immutable_count == 0 or _repair_is_feasible(valid_rows, minimum_kinds=5):
                failure_codes.append("ANSWER_INDEX_VARIETY_INSUFFICIENT")
            else:
                failure_codes.append("ANSWER_INDEX_REPAIR_BLOCKED_IMMUTABLE")
        elif 5 <= valid_count < 10 and used_kinds < 3:
            if immutable_count == 0 or _repair_is_feasible(valid_rows, minimum_kinds=3):
                failure_codes.append("ANSWER_INDEX_VARIETY_INSUFFICIENT")
            else:
                failure_codes.append("ANSWER_INDEX_REPAIR_BLOCKED_IMMUTABLE")
        if failure_codes and immutable_count:
            required_kinds = 5 if valid_count >= 10 else 3
            if not _repair_is_feasible(valid_rows, minimum_kinds=required_kinds):
                failure_codes.append("ANSWER_INDEX_REPAIR_BLOCKED_IMMUTABLE")
        gate_status = "BLOCKED" if "ANSWER_INDEX_REPAIR_BLOCKED_IMMUTABLE" in failure_codes else (
            "FAIL" if failure_codes else "PASS"
        )
    return {
        "schemaVersion": ANSWER_INDEX_DISTRIBUTION_VERSION,
        "sourceFile": source_file,
        "policyEnabled": policy_enabled,
        "validMcqCount": valid_count,
        "counts": count_map,
        "maxCount": max_count,
        "minCount": min_count,
        "maxMinusMin": max_count - min_count,
        "usedAnswerKinds": used_kinds,
        "longestSameAnswerRun": longest["count"],
        "longestRun": longest,
        "repeatedRuns": repeated_runs,
        "mutableCount": mutable_count,
        "immutableCount": immutable_count,
        "multipleAnswerCount": multiple_answer_count,
        "emptyChoicesMcq": empty_choices_mcq,
        "otherStructureExceptionCount": other_structure_exception_count,
        "gateStatus": gate_status,
        "failureCodes": list(dict.fromkeys(failure_codes)),
        "questionEvidence": evidence,
    }
