# -*- coding: utf-8 -*-
"""M3 Independent Mathematical Solver & Choice Verification Engine.

Performs deterministic, independent re-computation of answers, verifies
condition solvability, ensures uniqueness of choices, and applies slot permutations
ONLY AFTER mathematical truth has been certified.
"""

from __future__ import annotations
import math
import re
from fractions import Fraction
from typing import Any, Optional


class MathSolverError(ValueError):
    """Raised when mathematical conditions fail or choices are invalid."""
    pass


SLOT_SYMBOLS = ['①', '②', '③', '④', '⑤']


def normalize_math_str(s: str) -> str:
    """Normalize mathematical text for exact comparison."""
    s = s.strip()
    s = s.replace('$', '').replace(' ', '')
    s = re.sub(r'\\mathrm\{([^}]+)\}', r'\1', s)
    s = s.replace(r'\,', '')
    return s


def solve_right_triangle_trig(ab: float, bc: float, right_angle_at: str = 'B', target_ratio: str = 'sinA') -> str:
    """Solve right triangle trigonometry from sides."""
    if ab <= 0 or bc <= 0:
        raise MathSolverError("Triangle sides must be positive")
    ac = math.hypot(ab, bc)
    if target_ratio == 'sinA':
        # sin A = BC / AC
        val = bc / ac
        # Check if rational
        frac = Fraction(bc / ac).limit_denominator(1000)
        if abs(float(frac) - val) < 1e-9:
            if frac.denominator == 1:
                return str(frac.numerator)
            return f"\\dfrac{{{frac.numerator}}}{{{frac.denominator}}}"
        return f"{val:.4f}"
    elif target_ratio == 'cosA':
        frac = Fraction(ab / ac).limit_denominator(1000)
        return f"\\dfrac{{{frac.numerator}}}{{{frac.denominator}}}" if frac.denominator != 1 else str(frac.numerator)
    elif target_ratio == 'tanA':
        frac = Fraction(bc / ab).limit_denominator(1000)
        return f"\\dfrac{{{frac.numerator}}}{{{frac.denominator}}}" if frac.denominator != 1 else str(frac.numerator)
    raise MathSolverError(f"Unsupported ratio: {target_ratio}")


def solve_tangent_to_cos(tan_num: int, tan_den: int) -> str:
    """Given tan A = num / den, compute cos A = den / sqrt(num^2 + den^2)."""
    hypot_sq = tan_num**2 + tan_den**2
    hypot = int(math.isqrt(hypot_sq))
    if hypot**2 == hypot_sq:
        frac = Fraction(tan_den, hypot)
        return f"\\dfrac{{{frac.numerator}}}{{{frac.denominator}}}" if frac.denominator != 1 else str(frac.numerator)
    return f"\\dfrac{{{tan_den}\\sqrt{{{hypot_sq}}}}}{{{hypot_sq}}}"


def solve_external_tangent_collinear(pa: float, pq: float) -> float:
    """Given PA = PB, and P-B-Q are collinear on tangent, PQ = PB + BQ = PA + QC -> QC = PQ - PA."""
    if pq <= pa:
        raise MathSolverError(f"Collinear segment PQ ({pq}) must be strictly greater than PA ({pa})")
    qc = pq - pa
    return qc


def solve_concentric_circle_triangle(r_inner: float, r_outer: float) -> tuple[float, str]:
    """In concentric circles with radii r_inner, r_outer, chord AB is tangent to inner circle at M.
    OM = r_inner, OB = r_outer, BM = sqrt(r_outer^2 - r_inner^2), AB = 2*BM.
    Area(OAB) = 1/2 * AB * OM = BM * OM.
    """
    if r_inner >= r_outer:
        raise MathSolverError(f"Inner radius ({r_inner}) must be strictly less than outer radius ({r_outer})")
    bm_sq = r_outer**2 - r_inner**2
    bm = math.isqrt(int(bm_sq))
    if bm**2 == int(bm_sq):
        area = bm * r_inner
        if float(area).is_integer():
            return float(area), f"{int(area)}\\,\\mathrm{{cm}}^2"
        return float(area), f"{area}\\,\\mathrm{{cm}}^2"
    # Square root form
    pass
    val = math.sqrt(bm_sq) * r_inner
    return val, f"{val:.2f}\\,\\mathrm{{cm}}^2"


def solve_regular_hexagon_area_difference(oh: float) -> tuple[str, float]:
    """Regular hexagon inscribed in circle. OH is distance from center to side.
    OH = r * sqrt(3)/2 -> r = 2*OH / sqrt(3).
    Circle area = pi * r^2.
    Hexagon area = 6 * (sqrt(3)/4 * r^2) = 3*sqrt(3)/2 * r^2.
    Shaded area = circle - hexagon.
    """
    # If OH = a * sqrt(3), then r = 2*a.
    # r = 4 when OH = 2*sqrt(3).
    r = 2.0 * oh / math.sqrt(3.0)
    r_int = round(r)
    if abs(r - r_int) < 1e-6:
        circle_coeff = r_int**2
        # Hexagon area = 6 * (sqrt(3)/4 * r^2) = 3*sqrt(3)/2 * 16 = 24*sqrt(3)
        hex_coeff = int(circle_coeff * 3 / 2)
        ans_str = f"{circle_coeff}\\pi-{hex_coeff}\\sqrt{{3}}"
        num_val = circle_coeff * math.pi - hex_coeff * math.sqrt(3)
        return ans_str, num_val
    raise MathSolverError(f"Non-integer radius for OH={oh}")


def verify_choices_uniqueness(choices: list[str], expected_answer_str: str) -> int:
    """Verify that all 5 choices are unique and exactly one matches expected_answer_str.
    Returns the 0-based index of the correct choice.
    """
    if len(choices) != 5:
        raise MathSolverError(f"Multiple choice question must have exactly 5 choices, got {len(choices)}")

    norm_choices = [normalize_math_str(c) for c in choices]
    if len(set(norm_choices)) != 5:
        raise MathSolverError(f"Choices contain duplicates: {choices}")

    norm_expected = normalize_math_str(expected_answer_str)
    matches = [i for i, c in enumerate(norm_choices) if c == norm_expected]
    if len(matches) == 0:
        raise MathSolverError(f"No choice matches the expected answer '{expected_answer_str}'. Choices: {choices}")
    if len(matches) > 1:
        raise MathSolverError(f"Multiple choices match the expected answer: indices {matches}")

    return matches[0]


def permute_choices_to_slot(choices: list[str], current_ans_idx: int, target_slot_idx: int) -> tuple[list[str], str]:
    """Deterministically permute choices so the correct answer sits at target_slot_idx.
    Preserves all 5 choices without modifying their contents.
    """
    if current_ans_idx == target_slot_idx:
        return list(choices), SLOT_SYMBOLS[target_slot_idx]

    new_choices = list(choices)
    # Swap the current answer with the target slot
    new_choices[current_ans_idx], new_choices[target_slot_idx] = new_choices[target_slot_idx], new_choices[current_ans_idx]
    return new_choices, SLOT_SYMBOLS[target_slot_idx]
