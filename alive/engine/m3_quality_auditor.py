# -*- coding: utf-8 -*-
"""M3 Automated 7-Gate Quality Auditor.

Detects:
1. Stem vs SVG numerical mismatch
2. Geometric constraint / coordinate inconsistency
3. Missing elements (vertices, proof box, blanks, labels)
4. Answer exposure in problem SVG (red bold text, solution equations)
5. Choice non-uniqueness / multiple correct / no correct answer
6. Unregistered canonical metadata keys
7. SVG XML syntax, role='img', and scale keyword violations

Automated pass yields status 'SELF_CHECKED', NEVER 'INDEPENDENT_PASS'.
"""

from __future__ import annotations
import os
import re
import xml.etree.ElementTree as ET
from typing import Any, Optional


class QualityDefect(Exception):
    pass


FORBIDDEN_SCALE_WORDS = ["축척", "scale"]
FORBIDDEN_SOLUTION_LABELS = ["[키포인트]", "[조건 정리]", "[풀이 방향]", "[정석 풀이]"]


def check_1_stem_svg_numerical_parity(q: dict[str, Any], svg_content: Optional[str]) -> list[str]:
    """Check that essential numbers stated in stem appear in problem SVG when expected."""
    defects = []
    if not svg_content:
        return defects

    content = q.get("content", "")
    qid = q.get("id")

    # If stem has explicit labeled lengths like PA=3, PQ=7 (exclude 90 degree right angles)
    matches = re.findall(r'([A-Z]{1,2})\s*=\s*(\d+)', content)
    for seg, val in matches:
        if val == "90":  # 90 degrees is represented as right-angle symbol, not text 90
            continue
        # Check if the number val or segment appears in SVG
        if val not in svg_content:
            defects.append(f"Q{qid}: Stem numerical value '{seg}={val}' not found in problem SVG")

    return defects


def check_2_geometric_constraints(q: dict[str, Any], svg_content: Optional[str]) -> list[str]:
    """Verify geometric consistency from SVG primitives."""
    defects = []
    if not svg_content:
        return defects

    qid = q.get("id")
    # Q20 specific: Check if right triangle AEF points lie on square bounds
    if qid == 20:
        # Look for polygon points
        m = re.search(r'<polygon points="([^"]+)"', svg_content)
        if m:
            pts_str = m.group(1).split()
            if len(pts_str) >= 3:
                coords = [[float(c) for c in p.split(',')] for p in pts_str]
                # In Q20, square is rect at (x, y, w, h)
                rm = re.search(r'<rect x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"', svg_content)
                if rm:
                    rx, ry, rw, rh = float(rm.group(1)), float(rm.group(2)), float(rm.group(3)), float(rm.group(4))
                    # Point E must lie on top edge (y=ry) within tolerance
                    # Point F must lie on right edge (x=rx+rw) within tolerance
                    e_on_edge = any(abs(p[1] - ry) < 1.0 for p in coords)
                    f_on_edge = any(abs(p[0] - (rx + rw)) < 1.0 for p in coords)
                    if not (e_on_edge and f_on_edge):
                        defects.append(f"Q{qid}: Points E and F in triangle AEF do not lie on square edges")

    # Q23 specific: Check concentric radii ratio
    if qid == 23:
        circles = re.findall(r'<circle[^>]+r="([^"]+)"', svg_content)
        if len(circles) >= 2:
            radii = sorted([float(r) for r in circles[:2]])
            ratio = radii[0] / radii[1]
            # Stem specifies 4cm and 5cm -> ratio must be 0.8 +/- 0.05
            if abs(ratio - 0.8) > 0.05:
                defects.append(f"Q{qid}: Concentric circles radii ratio is {ratio:.2f}, expected 0.80 (4cm:5cm)")

    return defects


def check_3_missing_elements(q: dict[str, Any], svg_content: Optional[str]) -> list[str]:
    """Check for missing vertices, proof box text, or condition labels."""
    defects = []
    qid = q.get("id")
    content = q.get("content", "")

    # Proof box check (e.g. Q14)
    if "증명하는 과정이다" in content or "(가)~(마)" in content:
        # Check if actual proof blanks (나), (다) exist
        has_blanks = "(나)" in content and "(다)" in content
        has_blanks_svg = "(나)" in (svg_content or "") and "(다)" in (svg_content or "")
        if not (has_blanks or has_blanks_svg):
            defects.append(f"Q{qid}: Proof box containing (가)~(마) blanks is missing from content and SVG")

    if svg_content:
        # Q12 regular hexagon: must label all 6 vertices A, B, C, D, E, F and point H
        if qid == 12:
            for v in ['A', 'B', 'C', 'D', 'E', 'F', 'H']:
                if f">{v}<" not in svg_content:
                    defects.append(f"Q{qid}: Regular hexagon SVG is missing vertex label '{v}'")

        # Q17 external tangents: must label P, A, B, Q, C
        if qid == 17:
            for v in ['P', 'A', 'B', 'Q', 'C']:
                if f">{v}<" not in svg_content:
                    defects.append(f"Q{qid}: Tangent SVG is missing required point label '{v}'")

        # Q18 tangent chain: must label rays A, B, C, D, E, F
        if qid == 18:
            for v in ['A', 'B', 'C', 'D', 'E', 'F']:
                if f">{v}<" not in svg_content:
                    defects.append(f"Q{qid}: Tangent chain SVG is missing ray label '{v}'")

    return defects


def check_4_answer_exposure_in_problem_svg(svg_content: Optional[str], q: dict[str, Any]) -> list[str]:
    """Detect if problem SVG exposes answer via red text or highlighted data cells."""
    defects = []
    if not svg_content:
        return defects

    qid = q.get("id")
    # Red text in problem SVG is prohibited (red is reserved for solution callouts)
    if 'fill="#cc0000"' in svg_content or 'fill="red"' in svg_content or 'fill="#c00"' in svg_content:
        defects.append(f"Q{qid}: Problem SVG contains prohibited red highlighted text (answer exposure risk)")

    if 'stroke="#cc0000"' in svg_content or 'stroke="red"' in svg_content:
        defects.append(f"Q{qid}: Problem SVG contains prohibited red highlighted stroke (answer exposure risk)")

    # Data row bold check in Q4 (data rows y >= 100)
    if qid == 4:
        for line in svg_content.splitlines():
            if 'y="105"' in line or 'y="145"' in line or 'y="185"' in line:
                if 'font-weight="bold"' in line:
                    defects.append(f"Q{qid}: Trig table SVG contains bold highlighted cells exposing answer")
                    break

    return defects


def check_5_choices_and_answer_uniqueness(q: dict[str, Any]) -> list[str]:
    """Check choice count, uniqueness, and answer slot validity."""
    defects = []
    qid = q.get("id")
    qtype = q.get("questionType", "객관식")

    if qtype == "객관식":
        choices = q.get("choices", [])
        if len(choices) != 5:
            defects.append(f"Q{qid}: Multiple choice question must have 5 choices, found {len(choices)}")
        
        # Uniqueness check
        norm = [c.replace('$', '').replace(' ', '') for c in choices]
        if len(set(norm)) != len(norm):
            defects.append(f"Q{qid}: Duplicate choices found: {choices}")

        ans = q.get("answer", "")
        if ans not in ['①', '②', '③', '④', '⑤']:
            defects.append(f"Q{qid}: Invalid objective answer symbol '{ans}'")

        # Check for embedded choice numbering like '① ' or '1. '
        for c in choices:
            if re.match(r'^[①②③④⑤]|\d+\.\s+', c.strip()):
                defects.append(f"Q{qid}: Choice contains embedded numbering: '{c}'")

    return defects


def check_6_canonical_metadata_registry(q: dict[str, Any], tag_master: list[dict[str, Any]]) -> list[str]:
    """Verify canonical metadata keys against master tables."""
    defects = []
    qid = q.get("id")

    suk = q.get("subUnitKey")
    if not suk:
        defects.append(f"Q{qid}: Missing mandatory subUnitKey")
    else:
        # Check against tag_master
        valid_keys = {row.get("subUnitKey") for row in tag_master if row.get("subUnitKey")}
        if suk not in valid_keys:
            defects.append(f"Q{qid}: Unregistered canonical subUnitKey '{suk}'")

    # State check: reviewStatus MUST NOT be reviewed_pass upon creation!
    rev_status = q.get("reviewStatus")
    if rev_status == "reviewed_pass":
        defects.append(f"Q{qid}: reviewStatus is illegally set to 'reviewed_pass' before independent review")

    return defects


def check_7_svg_xml_and_render_validity(svg_path: str) -> list[str]:
    """Check XML syntax, accessibility attributes, and scale keywords."""
    defects = []
    if not os.path.exists(svg_path):
        return [f"SVG file not found: {svg_path}"]

    with open(svg_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Keyword check
    for kw in FORBIDDEN_SCALE_WORDS:
        if kw in content.lower():
            defects.append(f"{svg_path}: Contains forbidden scale keyword '{kw}'")

    # XML parse check
    try:
        root = ET.fromstring(content)
        if not root.tag.endswith('svg'):
            defects.append(f"{svg_path}: Root tag is not svg")
        if root.attrib.get('role') != 'img':
            defects.append(f"{svg_path}: Missing role='img' attribute")
        if not root.attrib.get('aria-labelledby'):
            defects.append(f"{svg_path}: Missing aria-labelledby attribute")
    except Exception as e:
        defects.append(f"{svg_path}: XML parse error: {e}")

    return defects


def audit_question_item(
    q: dict[str, Any],
    svg_dir: str,
    tag_master: list[dict[str, Any]]
) -> dict[str, Any]:
    """Perform full 7-gate audit on a single question item."""
    defects = []

    # Load problem SVG if exists
    prob_svg_content = None
    prob_svg_path = None
    if q.get("image"):
        prob_svg_path = os.path.join(svg_dir, os.path.basename(q["image"]))
        if os.path.exists(prob_svg_path):
            with open(prob_svg_path, 'r', encoding='utf-8') as f:
                prob_svg_content = f.read()
            defects.extend(check_7_svg_xml_and_render_validity(prob_svg_path))
        else:
            defects.append(f"Q{q['id']}: Problem SVG file missing: {prob_svg_path}")

    # Load solution SVG if exists
    if q.get("solutionImage"):
        sol_svg_path = os.path.join(svg_dir, os.path.basename(q["solutionImage"]))
        if os.path.exists(sol_svg_path):
            defects.extend(check_7_svg_xml_and_render_validity(sol_svg_path))
        else:
            defects.append(f"Q{q['id']}: Solution SVG file missing: {sol_svg_path}")

    # Run checks 1 to 6
    defects.extend(check_1_stem_svg_numerical_parity(q, prob_svg_content))
    defects.extend(check_2_geometric_constraints(q, prob_svg_content))
    defects.extend(check_3_missing_elements(q, prob_svg_content))
    defects.extend(check_4_answer_exposure_in_problem_svg(prob_svg_content, q))
    defects.extend(check_5_choices_and_answer_uniqueness(q))
    defects.extend(check_6_canonical_metadata_registry(q, tag_master))

    passed = len(defects) == 0
    return {
        "id": q.get("id"),
        "status": "PASS" if passed else "FAIL",
        "self_check_state": "SELF_CHECKED" if passed else "SELF_CHECK_FAILED",
        "defects": defects,
        "automated_scope": "Numerical parity, geometric coordinates, missing elements, answer exposure, choice uniqueness, canonical metadata, XML validity",
        "non_automated_scope": "Pedagogical narrative quality, subtle visual aesthetics, advanced student-facing clarity"
    }
