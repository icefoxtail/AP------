"""Deterministic pre-review quality gates for the adaptive ALIVE lane.

The model reviewers remain responsible for mathematical and pedagogical
judgement.  This module only rejects defects that can be checked without a
model: an unchanged public question, malformed surface LaTeX, a degenerate
coordinate target, or colliding SVG text labels.
"""

from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any


_LATEX_FIELDS = ("content", "solution")
_NUMBER = r"[-+]?(?:\d+(?:\.\d+)?|\d+\/\d+)"
_COORDINATE_RE = re.compile(rf"\(\s*({_NUMBER})\s*,\s*({_NUMBER})\s*\)")
_BAD_SQRT_RE = re.compile(r"\\sqrt\{[^{}]*=")
_FRAC_COMMAND_RE = re.compile(r"(?<![A-Za-z])\\frac(?![A-Za-z])")


class AdaptiveQualityGateError(ValueError):
    """Raised when a deterministic pre-review gate fails."""

    def __init__(self, message: str, report: dict[str, Any]) -> None:
        super().__init__(message)
        self.report = report


def _load_json(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"expected JSON object: {path}")
    return value


def _braced_group_end(text: str, start: int) -> int | None:
    """Return the exclusive end of a balanced ``{...}`` group."""

    if start >= len(text) or text[start] != "{":
        return None
    depth = 0
    for index in range(start, len(text)):
        char = text[index]
        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return index + 1
    return None


def _has_bare_frac_command(text: str) -> bool:
    """Detect ``\\frac12`` while allowing nested braced numerators.

    The previous gate matched every ``\\frac`` token, including the valid
    ``\\frac{1}{2}`` form.  That false positive made a correct carry-forward
    solution impossible to accept.  A fraction is valid here only when both
    numerator and denominator are balanced braced groups.
    """

    for match in _FRAC_COMMAND_RE.finditer(text):
        cursor = match.end()
        while cursor < len(text) and text[cursor].isspace():
            cursor += 1
        numerator_end = _braced_group_end(text, cursor)
        if numerator_end is None:
            return True
        cursor = numerator_end
        while cursor < len(text) and text[cursor].isspace():
            cursor += 1
        denominator_end = _braced_group_end(text, cursor)
        if denominator_end is None:
            return True
    return False


def _public_question(item: dict[str, Any]) -> dict[str, Any]:
    student = item.get("studentPayload")
    if not isinstance(student, dict):
        student = item.get("student")
    if not isinstance(student, dict):
        return {}
    return {
        key: student.get(key)
        for key in ("content", "choices", "questionType", "layoutTag", "wide")
    }


def _source_clone_findings(
    run_dir: Path, questions: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    source_path = run_dir / "source" / "source-exam.json"
    if not source_path.is_file():
        return [{"code": "SOURCE_EXAM_MISSING", "severity": "MAJOR"}]
    source = _load_json(source_path)
    source_items = source.get("questions")
    if not isinstance(source_items, list):
        return [{"code": "SOURCE_EXAM_INVALID", "severity": "MAJOR"}]
    by_ordinal = {
        int(item.get("id") or item.get("ordinal")): item
        for item in source_items
        if isinstance(item, dict) and (item.get("id") or item.get("ordinal")) is not None
    }
    findings: list[dict[str, Any]] = []
    for item in questions:
        ordinal = int(item.get("ordinal", 0))
        source_item = by_ordinal.get(ordinal)
        if not isinstance(source_item, dict):
            findings.append({"code": "SOURCE_QUESTION_MISSING", "ordinal": ordinal, "severity": "MAJOR"})
            continue
        candidate = _public_question(item)
        source_public = {
            key: source_item.get(key)
            for key in ("content", "choices", "questionType", "layoutTag", "wide")
        }
        if candidate == source_public:
            findings.append({
                "code": "EXACT_SOURCE_CLONE",
                "ordinal": ordinal,
                "severity": "MAJOR",
                "message": "student-facing content and choices are unchanged from the locked source",
            })
    return findings


def _latex_findings(questions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    findings: list[dict[str, Any]] = []
    for item in questions:
        ordinal = int(item.get("ordinal", 0))
        student = item.get("studentPayload")
        values = {
            "content": student.get("content") if isinstance(student, dict) else "",
            "solution": item.get("solution") or "",
        }
        detail = item.get("solutionDetail")
        if isinstance(detail, dict):
            values["solution"] += "\n" + json.dumps(detail, ensure_ascii=False)
        for field, value in values.items():
            text = str(value)
            if _BAD_SQRT_RE.search(text):
                findings.append({
                    "code": "MALFORMED_SQRT",
                    "ordinal": ordinal,
                    "field": field,
                    "severity": "MAJOR",
                    "message": "sqrt command contains an equality inside its radicand",
                })
            if _has_bare_frac_command(text):
                findings.append({
                    "code": "BARE_FRAC_COMMAND",
                    "ordinal": ordinal,
                    "field": field,
                    "severity": "MAJOR",
                    "message": "use the staged display-math fraction form (dfrac or an approved equivalent)",
                })
    return findings


def _degenerate_coordinate_findings(questions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Catch the common H1 internal-division trap where a+b is invariant.

    This deliberately stays narrow: it only applies when the generated stem
    asks for ``a+b`` and supplies two numeric coordinate pairs.  It prevents a
    known invalid family without pretending to be a general theorem prover.
    """

    findings: list[dict[str, Any]] = []
    for item in questions:
        student = item.get("studentPayload")
        text = str(student.get("content") if isinstance(student, dict) else "")
        if "a+b" not in text.replace(" ", ""):
            continue
        pairs = _COORDINATE_RE.findall(text)
        if len(pairs) < 2:
            continue
        try:
            sums = [float(left) + float(right) for left, right in pairs[:2]]
        except ValueError:
            continue
        if sums[0] == sums[1]:
            findings.append({
                "code": "DEGENERATE_TARGET_INVARIANT",
                "ordinal": int(item.get("ordinal", 0)),
                "severity": "MAJOR",
                "message": "the first two endpoints have the same x+y, so an internal-division ratio cannot determine a+b",
            })
    return findings


def _text_boxes(svg_path: Path) -> list[dict[str, Any]]:
    root = ET.fromstring(svg_path.read_text(encoding="utf-8"))
    boxes: list[dict[str, Any]] = []
    for element in root.iter():
        if element.tag.rsplit("}", 1)[-1].casefold() != "text":
            continue
        text = "".join(element.itertext()).strip()
        if not text:
            continue
        try:
            x = float(str(element.attrib.get("x", "")).split()[0])
            y = float(str(element.attrib.get("y", "")).split()[0])
        except (TypeError, ValueError, IndexError):
            continue
        style = str(element.attrib.get("style", ""))
        font_size = 14.0
        match = re.search(r"font-size\s*:\s*([0-9.]+)", style)
        if match:
            font_size = float(match.group(1))
        width = max(font_size * 0.6 * len(text), font_size * 0.6)
        anchor = element.attrib.get("text-anchor", "start")
        if anchor == "middle":
            x -= width / 2
        elif anchor == "end":
            x -= width
        boxes.append({"text": text, "x1": x, "y1": y - font_size, "x2": x + width, "y2": y + 3})
    return boxes


def _svg_label_findings(run_dir: Path, questions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    findings: list[dict[str, Any]] = []
    for item in questions:
        ordinal = int(item.get("ordinal", 0))
        for role_key in ("visualAsset", "solutionVisualAsset"):
            asset = item.get(role_key)
            if not isinstance(asset, dict) or not isinstance(asset.get("path"), str):
                continue
            path = run_dir / asset["path"]
            if not path.is_file():
                findings.append({"code": "SVG_ASSET_MISSING", "ordinal": ordinal, "role": role_key, "severity": "MAJOR"})
                continue
            try:
                boxes = _text_boxes(path)
            except (OSError, UnicodeError, ET.ParseError, ValueError) as error:
                findings.append({"code": "SVG_LABEL_PARSE_ERROR", "ordinal": ordinal, "role": role_key, "severity": "MAJOR", "message": str(error)})
                continue
            for index, left in enumerate(boxes):
                for right in boxes[index + 1 :]:
                    if left["text"] == right["text"]:
                        continue
                    if left["x1"] < right["x2"] and right["x1"] < left["x2"] and left["y1"] < right["y2"] and right["y1"] < left["y2"]:
                        findings.append({
                            "code": "SVG_LABEL_COLLISION",
                            "ordinal": ordinal,
                            "role": role_key,
                            "severity": "MAJOR",
                            "labels": [left["text"], right["text"]],
                        })
                        break
                else:
                    continue
                break
    return findings


def run_pre_review_gates(
    run_dir: Path, normalized: dict[str, Any]
) -> dict[str, Any]:
    """Run cheap fail-closed checks before an artifact reaches a reviewer."""

    questions = normalized.get("questions")
    if not isinstance(questions, list):
        raise AdaptiveQualityGateError(
            "adaptive pre-review gate requires normalized questions",
            {"verdict": "FAIL", "findings": [{"code": "QUESTIONS_MISSING", "severity": "MAJOR"}]},
        )
    findings = []
    findings.extend(_source_clone_findings(run_dir, questions))
    findings.extend(_latex_findings(questions))
    findings.extend(_degenerate_coordinate_findings(questions))
    findings.extend(_svg_label_findings(run_dir, questions))
    report = {
        "schemaVersion": "0.1.0",
        "gate": "ADAPTIVE_PRE_REVIEW_DETERMINISTIC_QUALITY",
        "verdict": "PASS" if not findings else "FAIL",
        "checks": {
            "sourceClone": "PASS" if not any(item["code"] in {"EXACT_SOURCE_CLONE", "SOURCE_EXAM_MISSING", "SOURCE_EXAM_INVALID", "SOURCE_QUESTION_MISSING"} for item in findings) else "FAIL",
            "latexSurface": "PASS" if not any(item["code"] in {"MALFORMED_SQRT", "BARE_FRAC_COMMAND"} for item in findings) else "FAIL",
            "degenerateTarget": "PASS" if not any(item["code"] == "DEGENERATE_TARGET_INVARIANT" for item in findings) else "FAIL",
            "svgLabels": "PASS" if not any(item["code"].startswith("SVG_") for item in findings) else "FAIL",
        },
        "questionCount": len(questions),
        "findings": findings,
    }
    if findings:
        summary = "; ".join(
            f"q{item.get('ordinal', '?')}:{item['code']}" for item in findings
        )
        raise AdaptiveQualityGateError(f"adaptive deterministic pre-review gate failed ({summary})", report)
    return report
