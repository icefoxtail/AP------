"""Small, deterministic exact checks for arithmetic-safe question families.

This module is deliberately a capability lane, not a general theorem prover.
It only returns ``PASS`` when a supported family was recognized and checked
with exact rational arithmetic.  Unsupported families are reported as
``NOT_APPLICABLE`` and still require the independent reviewer.
"""

from __future__ import annotations

import math
import re
from fractions import Fraction
from typing import Any


EXACT_VERIFIER_VERSION = "0.1.0"
_NUMBER = r"-?(?:\d+(?:\.\d+)?|\.\d+)"
_PROBABILITY_RE = re.compile(r"확률\s*(?:은|이|가)\s*\$?\s*(" + _NUMBER + r")\s*\$?")
_TRIAL_COUNT_RE = re.compile(r"\$?\s*(\d+)\s*\$?\s*번")
_LOWER_TAIL_RE = re.compile(r"([A-Za-z][A-Za-z0-9_]*)\s*번\s*이하")
_LINEAR_BOUNDARY_RE = re.compile(
    r"(?<!\\)\b([A-Za-z][A-Za-z0-9_]*)\s*\+\s*(" + _NUMBER + r")\s*=\s*(" + _NUMBER + r")"
)
_NUMERIC_ASSIGNMENT_TEMPLATE = r"\b{variable}\s*=\s*(" + _NUMBER + r")"
_Z_BY_CDF = {
    Fraction("0.5000"): Fraction(0),
    Fraction("0.6915"): Fraction("0.5"),
    Fraction("0.8413"): Fraction(1),
    Fraction("0.9332"): Fraction("1.5"),
    Fraction("0.9772"): Fraction(2),
    Fraction("0.9938"): Fraction("2.5"),
    Fraction("0.9987"): Fraction(3),
}


def _fraction(value: str) -> Fraction:
    return Fraction(str(value).strip())


def _numeric_choice_values(choices: Any) -> list[Fraction]:
    if not isinstance(choices, list):
        return []
    values: list[Fraction] = []
    for choice in choices:
        if not isinstance(choice, str):
            return []
        cleaned = choice.replace("$", "").replace("\\,", "").strip()
        try:
            values.append(_fraction(cleaned))
        except (ValueError, ZeroDivisionError):
            return []
    return values


def _finding(code: str, message: str, *, gate: str = "computational", ordinal: int | None = None) -> dict[str, Any]:
    result: dict[str, Any] = {
        "gate": gate,
        "code": code,
        "severity": "HARD_FAIL",
        "message": message,
    }
    if ordinal is not None:
        result["ordinal"] = ordinal
    return result


def _verify_binomial_normal_approximation(question: dict[str, Any], ordinal: int | None) -> dict[str, Any] | None:
    content = str(question.get("content") or "")
    probabilities = [_fraction(match.group(1)) for match in _PROBABILITY_RE.finditer(content)]
    trial_match = _TRIAL_COUNT_RE.search(content)
    lower_tail = _LOWER_TAIL_RE.search(content)
    choices = _numeric_choice_values(question.get("choices"))
    if len(probabilities) < 2 or trial_match is None or lower_tail is None or len(choices) != 5:
        return None

    p, target_cdf = probabilities[0], probabilities[1]
    n = int(trial_match.group(1))
    z = _Z_BY_CDF.get(target_cdf)
    if z is None or not 0 < p < 1 or n <= 0:
        return None
    variance = Fraction(n) * p * (1 - p)
    numerator_root = math.isqrt(variance.numerator)
    denominator_root = math.isqrt(variance.denominator)
    if numerator_root * numerator_root != variance.numerator or denominator_root * denominator_root != variance.denominator:
        return {
            "status": "NOT_APPLICABLE",
            "applicable": False,
            "method": "binomial_normal_approximation",
            "reason": "standard deviation is not an exact rational square root",
            "findings": [],
        }
    sigma = Fraction(numerator_root, denominator_root)
    mean = Fraction(n) * p
    expected = mean + z * sigma - Fraction(1, 2)
    if expected.denominator != 1:
        return {
            "status": "FAIL",
            "applicable": True,
            "method": "binomial_normal_approximation",
            "checks": {"parameterExtraction": "PASS", "exactBoundary": "FAIL"},
            "findings": [_finding("EXACT_BOUNDARY_NOT_INTEGER", f"computed boundary answer is {expected}, not a natural number", ordinal=ordinal)],
        }
    choice_index = next((index for index, value in enumerate(choices, start=1) if value == expected), None)
    if choice_index is None:
        return {
            "status": "FAIL",
            "applicable": True,
            "method": "binomial_normal_approximation",
            "checks": {"parameterExtraction": "PASS", "exactBoundary": "PASS", "answerChoices": "FAIL"},
            "computedAnswer": str(expected.numerator),
            "findings": [_finding("EXPECTED_ANSWER_NOT_IN_CHOICES", f"computed answer {expected.numerator} is not in the choices", ordinal=ordinal)],
        }
    expected_answer = str(choice_index)
    actual_answer = str(question.get("answer") or "").strip()
    circled = {"①": "1", "②": "2", "③": "3", "④": "4", "⑤": "5"}
    actual_index = circled.get(actual_answer, actual_answer)
    findings: list[dict[str, Any]] = []
    if actual_index != expected_answer:
        findings.append(_finding("GENERATED_ANSWER_DISAGREES_WITH_EXACT_RESULT", f"computed choice {expected_answer} does not match answer {actual_answer}", ordinal=ordinal))
    return {
        "status": "FAIL" if findings else "PASS",
        "applicable": True,
        "method": "binomial_normal_approximation",
        "checks": {"parameterExtraction": "PASS", "exactBoundary": "PASS", "answerChoices": "PASS", "answer": "FAIL" if findings else "PASS"},
        "computedAnswer": str(expected.numerator),
        "computedChoiceIndex": choice_index,
        "mean": str(mean),
        "standardDeviation": str(sigma),
        "z": str(z),
        "findings": findings,
    }


def _verify_solution_linear_boundaries(question: dict[str, Any], ordinal: int | None) -> dict[str, Any] | None:
    solution = str(question.get("solution") or "")
    matches = list(_LINEAR_BOUNDARY_RE.finditer(solution))
    if not matches:
        return None
    findings: list[dict[str, Any]] = []
    equations: list[dict[str, str]] = []
    for match in matches:
        variable, offset_text, rhs_text = match.groups()
        expected = _fraction(rhs_text) - _fraction(offset_text)
        equations.append({"variable": variable, "equation": match.group(0), "expected": str(expected)})
        assignment_re = re.compile(_NUMERIC_ASSIGNMENT_TEMPLATE.format(variable=re.escape(variable)))
        assignments = [_fraction(value) for value in assignment_re.findall(solution)]
        if any(value != expected for value in assignments):
            actual = next(value for value in assignments if value != expected)
            findings.append(_finding("SOLUTION_EQUATION_ASSIGNMENT_CONFLICT", f"solution derives {match.group(0)} but assigns {variable}={actual}", gate="solutionArithmetic", ordinal=ordinal))
    return {
        "status": "FAIL" if findings else "PASS",
        "applicable": True,
        "method": "exact_linear_boundary_arithmetic",
        "checks": {"equationAssignments": "FAIL" if findings else "PASS"},
        "equations": equations,
        "findings": findings,
    }


def verify_question(question: dict[str, Any], ordinal: int | None = None) -> dict[str, Any]:
    """Run all supported exact checks without trusting generated answer text."""

    results = [
        result
        for result in (
            _verify_binomial_normal_approximation(question, ordinal),
            _verify_solution_linear_boundaries(question, ordinal),
        )
        if result is not None
    ]
    findings = [finding for result in results for finding in result.get("findings", [])]
    applicable = [result for result in results if result.get("applicable") is True]
    if findings:
        status = "FAIL"
    elif applicable and all(result.get("status") == "PASS" for result in applicable):
        status = "PASS"
    else:
        status = "NOT_APPLICABLE"
    return {
        "version": EXACT_VERIFIER_VERSION,
        "status": status,
        "applicable": bool(applicable),
        "methods": [result.get("method") for result in results],
        "results": results,
        "findings": findings,
    }


__all__ = ["EXACT_VERIFIER_VERSION", "verify_question"]
