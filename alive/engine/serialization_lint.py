"""Safe serialization normalization for student-facing archive text."""

from __future__ import annotations

import re
from typing import Any


_MATH_OPERAND = r"(?:[-+−]?\s*(?:(?:\d+(?:\.\d+)?\s*)?(?:∠)?[A-Za-z][A-Za-z0-9_]*(?:\([^()\n]*\))?|\d+(?:\.\d+)?(?:°|\s*cm|\s*m|\s*L|\s*kPa)?|\([^()\n]*\)))"
_MATH_EXPR = rf"{_MATH_OPERAND}(?:\s*[+−*/×]\s*{_MATH_OPERAND})*"
_BARE_RELATION_RE = re.compile(
    rf"(?<![A-Za-z0-9])(?P<expr>{_MATH_EXPR}\s*(?:=|~|≤|≥|<|>|∥|⊥|≡)\s*{_MATH_EXPR}"
    rf"(?:\s*(?:=|~|≤|≥|<|>|∥|⊥|≡)\s*{_MATH_EXPR})*)(?![A-Za-z0-9])"
)
_BARE_ANGLE_EXPR_RE = re.compile(
    r"(?<![A-Za-z0-9])(?:[-+]?\s*\d+\s*)?∠[A-Za-z](?:\s*[+−]\s*(?:[-+]?\s*\d+\s*)?∠?[A-Za-z])+"
    r"(?![A-Za-z0-9])"
)
_MATH_PREFIX_RE = re.compile(
    rf"(?<![A-Za-z0-9])(?P<prefix>(?:√|∠|[-+−]\s*|{_MATH_OPERAND}(?:\s*[+−*/×]\s*)?))"
    rf"\$(?P<body>[^$\n]+)\$"
)
_MATH_SUFFIX_RE = re.compile(
    rf"\$(?P<body>(?=[^$\n가-힣]*[A-Za-z0-9\\∠=<>])[^$\n가-힣]+)\$"
    rf"(?P<suffix>\s*(?:[+−*/×]\s*{_MATH_EXPR}|\s*\([^$\n]{{1,40}}\)))"
)
_MATH_PAIR_RE = re.compile(
    rf"\$(?P<left>[^$\n]+)\$(?P<gap>\s*[+−*/×]\s*{_MATH_OPERAND}\s*[+−*/×]\s*)"
    rf"\$(?P<right>[^$\n]+)\$"
)
_MATH_DOUBLE_PAIR_RE = re.compile(
    r"\$(?P<left>[^$\n]+)\$\$(?P<right>[-+−*/×][^$\n]+)\$"
)


def _math_ranges(text: str) -> tuple[list[tuple[int, int]], list[str]]:
    ranges: list[tuple[int, int]] = []
    malformed: list[str] = []
    start: int | None = None
    index = 0
    while index < len(text):
        if text[index] == "\\" and index + 1 < len(text) and text[index + 1] == "$":
            index += 2
            continue
        if text[index] == "$":
            if start is None:
                start = index
            else:
                ranges.append((start, index))
                start = None
        index += 1
    if start is not None:
        malformed.append("unclosed dollar delimiter")
    return ranges, malformed


def _merge_math_fragments(text: str) -> tuple[str, bool]:
    """Repair high-confidence splits introduced around existing delimiters."""

    changed = False
    for _ in range(6):
        before = text
        text = _MATH_PAIR_RE.sub(
            lambda match: f"${match.group('left')}{match.group('gap')}{match.group('right')}$",
            text,
        )
        text = _MATH_DOUBLE_PAIR_RE.sub(
            lambda match: f"${match.group('left')}{match.group('right')}$",
            text,
        )
        ranges, _ = _math_ranges(text)
        text = _MATH_PREFIX_RE.sub(
            lambda match: (
                match.group(0)
                if any(left < match.start() < right for left, right in ranges)
                else (
                    re.match(r"\s*", match.group("prefix")).group(0)
                    + f"${match.group('prefix').strip()}{match.group('body')}$"
                )
            ),
            text,
        )
        text = _MATH_SUFFIX_RE.sub(
            lambda match: f"${match.group('body')}{match.group('suffix').strip()}$",
            text,
        )
        if text == before:
            break
        changed = True
    return text, changed


def _wrap_bare_math(text: str) -> tuple[str, bool]:
    """Wrap high-confidence equation/angle islands outside existing math.

    This intentionally handles only relations, coordinates, and angle
    expressions.  It does not guess at arbitrary Latin words in prose.
    """

    ranges, malformed = _math_ranges(text)
    if malformed:
        return text, False
    protected: list[tuple[int, int]] = ranges

    def is_protected(start: int, end: int) -> bool:
        return any(start >= left and end <= right for left, right in protected)

    replacements: list[tuple[int, int, str]] = []
    for pattern in (_BARE_RELATION_RE, _BARE_ANGLE_EXPR_RE):
        for match in pattern.finditer(text):
            if is_protected(match.start(), match.end()):
                continue
            raw = match.group(0)
            leading = re.match(r"\s*", raw).group(0)
            trailing = re.search(r"\s*$", raw).group(0)
            core = raw.strip()
            replacements.append((match.start(), match.end(), f"{leading}${core}${trailing}"))
    if not replacements:
        return text, False
    replacements.sort(key=lambda item: (item[0], item[1]))
    merged: list[tuple[int, int, str]] = []
    for replacement in replacements:
        if merged and replacement[0] < merged[-1][1]:
            continue
        merged.append(replacement)
    output = text
    for start, end, replacement in reversed(merged):
        output = output[:start] + replacement + output[end:]
    return output, output != text


def normalize_serializable_text(text: str) -> tuple[str, list[str], list[dict[str, Any]]]:
    """Normalize raw operators and high-confidence bare math islands."""

    text, merged = _merge_math_fragments(text)
    text, wrapped = _wrap_bare_math(text)
    ranges, malformed = _math_ranges(text)
    changes: list[str] = []
    if merged:
        changes.append("MATH_FRAGMENT_MERGED")
    if wrapped:
        changes.append("BARE_MATH_WRAPPED")
    if malformed:
        return text, changes, [{"code": "LATEX_DELIMITER_UNBALANCED", "message": item} for item in malformed]
    pieces: list[str] = []
    cursor = 0
    for start, end in ranges:
        pieces.append(text[cursor:start + 1])
        segment = text[start + 1:end]
        normalized = re.sub(r"\s*<\s*", lambda _match: r"\lt ", segment)
        normalized = re.sub(r"\s*>\s*", lambda _match: r"\gt ", normalized)
        if normalized != segment:
            changes.append("RAW_ORDER_OPERATOR_NORMALIZED")
        pieces.append(normalized + "$")
        cursor = end + 1
    pieces.append(text[cursor:])
    return "".join(pieces), sorted(set(changes)), []


__all__ = ["normalize_serializable_text"]
