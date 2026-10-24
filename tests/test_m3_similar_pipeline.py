# -*- coding: utf-8 -*-
"""Regression and Negative Test Suite for M3 Similar Question Pipeline.

Tests:
1. Regression tests for Wangun M3 defects (Q4, Q12, Q14, Q17, Q18, Q20, Q23)
2. Negative tests injecting deliberate errors (duplicate choices, invalid metadata, red text, etc.)
3. Positive tests verifying analytic geometry engine output passes all 7 gates
"""

import os
import sys
sys.path.insert(0, os.path.abspath('.'))
import json
import unittest

from alive.engine.m3_blueprint import validate_blueprint, BlueprintValidationError
from alive.engine.m3_math_solver import (
    verify_choices_uniqueness,
    permute_choices_to_slot,
    solve_external_tangent_collinear,
    solve_concentric_circle_triangle,
    solve_regular_hexagon_area_difference,
    MathSolverError
)
from alive.engine.m3_geometry_engine import (
    build_q1_right_triangle,
    build_q4_trig_table_svg,
    build_q7_quarter_circle,
    build_q12_regular_hexagon,
    build_q14_proof_svg,
    build_q17_external_tangents,
    build_q18_tangent_chain,
    build_q20_square_with_inscribed_30deg,
    build_q23_concentric_circles
)
from alive.engine.m3_quality_auditor import (
    check_1_stem_svg_numerical_parity,
    check_2_geometric_constraints,
    check_3_missing_elements,
    check_4_answer_exposure_in_problem_svg,
    check_5_choices_and_answer_uniqueness,
    check_6_canonical_metadata_registry,
    check_7_svg_xml_and_render_validity,
    audit_question_item
)


class TestM3SimilarPipeline(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        master_path = 'archive/data/master_tables/js_archive_tag_master.json'
        if os.path.exists(master_path):
            with open(master_path, 'r', encoding='utf-8') as f:
                cls.tag_master = json.load(f)
        else:
            cls.tag_master = []

    # ================= REGRESSION TESTS (Wangun Defects) =================

    def test_regression_q4_red_bold_answer_exposure(self):
        """Q4 flaw: Table in problem SVG highlighted answer cells in red bold text."""
        flawed_svg = '''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t d">
            <title id="t">표</title><desc id="d">표</desc>
            <text x="198" y="105" fill="#cc0000" font-weight="bold">0.2419</text>
        </svg>'''
        defects = check_4_answer_exposure_in_problem_svg(flawed_svg, {"id": 4})
        self.assertTrue(any("red highlighted text" in d for d in defects))
        self.assertTrue(any("bold highlighted cells" in d for d in defects))

    def test_regression_q12_missing_regular_hexagon_labels(self):
        """Q12 flaw: Regular hexagon SVG lacked vertex labels A~F and point H."""
        flawed_svg = '''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t d">
            <title id="t">육각형</title><desc id="d">육각형</desc>
            <polygon points="10,10 20,20 30,30"/>
        </svg>'''
        defects = check_3_missing_elements({"id": 12, "content": "정육각형 ABCDEF"}, flawed_svg)
        self.assertTrue(any("Regular hexagon SVG is missing vertex label 'A'" in d for d in defects))
        self.assertTrue(any("Regular hexagon SVG is missing vertex label 'H'" in d for d in defects))

    def test_regression_q14_missing_proof_box_text(self):
        """Q14 flaw: Question content asked for (가)~(마) but proof box was omitted."""
        flawed_q = {
            "id": 14,
            "content": "다음은 원의 중심에서 현에 내린 수선은 그 현을 수직이등분함을 증명하는 과정이다. (가)~(마)에 들어갈 것으로 옳지 않은 것은?"
        }
        defects = check_3_missing_elements(flawed_q, None)
        self.assertTrue(any("Proof box containing (가)~(마) blanks is missing" in d for d in defects))

    def test_regression_q17_missing_point_c_in_tangent(self):
        """Q17 flaw: External tangent problem had point C missing in SVG."""
        flawed_svg = '''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t d">
            <title id="t">접선</title><desc id="d">접선</desc>
            <text>P</text><text>A</text><text>B</text><text>Q</text>
        </svg>'''
        defects = check_3_missing_elements({"id": 17, "content": "PA=3, PQ=7, QC=x"}, flawed_svg)
        self.assertTrue(any("Tangent SVG is missing required point label 'C'" in d for d in defects))

    def test_regression_q18_missing_ray_labels(self):
        """Q18 flaw: Rays AB~AF missing in SVG."""
        flawed_svg = '''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t d">
            <title id="t">접선</title><desc id="d">접선</desc>
            <text>A</text><text>B</text><text>C</text><text>D</text><text>E</text>
        </svg>'''
        defects = check_3_missing_elements({"id": 18, "content": "AB, AC, AD, AE, AF"}, flawed_svg)
        self.assertTrue(any("Tangent chain SVG is missing ray label 'F'" in d for d in defects))

    def test_regression_q20_floating_points_in_square(self):
        """Q20 flaw: Points E and F floated inside square rather than lying on edges."""
        flawed_svg = '''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t d">
            <title id="t">정사각형</title><desc id="d">정사각형</desc>
            <rect x="50" y="40" width="240" height="180"/>
            <polygon points="50,220 180,100 240,165"/>
        </svg>'''
        defects = check_2_geometric_constraints({"id": 20}, flawed_svg)
        self.assertTrue(any("do not lie on square edges" in d for d in defects))

    def test_regression_q23_concentric_radii_ratio_mismatch(self):
        """Q23 flaw: Radii ratio was 60:100 (0.6) instead of 4:5 (0.8)."""
        flawed_svg = '''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t d">
            <title id="t">동심원</title><desc id="d">동심원</desc>
            <circle cx="180" cy="130" r="100"/>
            <circle cx="180" cy="130" r="60"/>
        </svg>'''
        defects = check_2_geometric_constraints({"id": 23}, flawed_svg)
        self.assertTrue(any("radii ratio is 0.60, expected 0.80" in d for d in defects))

    # ================= NEGATIVE INJECTION TESTS =================

    def test_negative_duplicate_choices(self):
        """Inject duplicate choices and verify detection."""
        q = {
            "id": 99,
            "questionType": "객관식",
            "choices": ["\\dfrac{1}{2}", "\\dfrac{1}{2}", "\\dfrac{3}{4}", "\\dfrac{4}{5}", "1"],
            "answer": "①"
        }
        defects = check_5_choices_and_answer_uniqueness(q)
        self.assertTrue(any("Duplicate choices found" in d for d in defects))

    def test_negative_invalid_canonical_subunit_key(self):
        """Inject non-existent canonical subunit key and verify detection."""
        q = {
            "id": 99,
            "subUnitKey": "M3-99-NONEXISTENT_KEY",
            "reviewStatus": "SELF_CHECKED"
        }
        defects = check_6_canonical_metadata_registry(q, self.tag_master)
        self.assertTrue(any("Unregistered canonical subUnitKey" in d for d in defects))

    def test_negative_illegal_reviewed_pass_status(self):
        """Inject illegally recorded reviewed_pass upon generation and verify rejection."""
        q = {
            "id": 99,
            "subUnitKey": "M3-05-TRIG_RATIO",
            "reviewStatus": "reviewed_pass"
        }
        defects = check_6_canonical_metadata_registry(q, self.tag_master)
        self.assertTrue(any("illegally set to 'reviewed_pass'" in d for d in defects))

    def test_negative_stem_svg_numerical_mismatch(self):
        """Inject mismatch where stem specifies PA=5 but SVG has PA=3."""
        q = {
            "id": 17,
            "content": "다음 그림과 같이 PA=5, PQ=7, QC=x일 때"
        }
        svg_content = "<svg><text>PA=3</text><text>PQ=7</text></svg>"
        defects = check_1_stem_svg_numerical_parity(q, svg_content)
        self.assertTrue(any("Stem numerical value 'PA=5' not found" in d for d in defects))

    # ================= POSITIVE ANALYTIC ENGINE TESTS =================

    def test_positive_q20_analytic_geometry_on_edges(self):
        """Verify that the new analytic Q20 generator places E and F exactly on square edges."""
        prob_svg, sol_svg = build_q20_square_with_inscribed_30deg(side_len=190.0)
        defects = check_2_geometric_constraints({"id": 20}, prob_svg)
        self.assertEqual(len(defects), 0, f"Analytic Q20 failed constraint check: {defects}")

    def test_positive_q23_concentric_circles_exact_ratio(self):
        """Verify that the new analytic Q23 generator produces exact 4:5 ratio (0.80)."""
        prob_svg, sol_svg = build_q23_concentric_circles(r_in=4.0, r_out=5.0)
        defects = check_2_geometric_constraints({"id": 23}, prob_svg)
        self.assertEqual(len(defects), 0, f"Analytic Q23 failed ratio check: {defects}")

    def test_positive_q17_analytic_tangents_all_labels(self):
        """Verify that the new analytic Q17 generator includes all labels P, A, B, Q, C."""
        prob_svg, sol_svg = build_q17_external_tangents(pa=3.0, pq=7.0)
        defects = check_3_missing_elements({"id": 17, "content": "PA=3, PQ=7, QC=x"}, prob_svg)
        self.assertEqual(len(defects), 0, f"Analytic Q17 missing labels: {defects}")


if __name__ == '__main__':
    unittest.main()
