from __future__ import annotations

import unittest

from alive.engine.solution_quality import (
    SolutionQualityError,
    build_solution_quality_report,
    format_solution_detail,
    infer_solution_visual_requirement,
    normalize_solution_detail,
    validate_solution_visual_spec,
)
from alive.engine.visual_renderer import render_visual_spec


class SolutionQualityTests(unittest.TestCase):
    @staticmethod
    def detail() -> dict:
        return {
            "version": "0.1",
            "audience": "student",
            "depth": "detailed",
            "given": "원의 중심은 C(0,0)이고 반지름은 3이다.",
            "goal": "접선의 성질을 이용해 필요한 길이를 구한다.",
            "keyIdea": "반지름은 접선에 수직이라는 사실을 이용한다.",
            "conceptNote": "원의 접선과 접점에서 그은 반지름은 서로 수직이다.",
            "steps": [
                {"title": "중심과 접점을 확인", "work": "접점을 T라고 두고 CT를 그린다.", "why": "접선 문제의 기준점과 보조선을 분명히 하기 위해서이다."},
                {"title": "수직 관계 사용", "work": r"CT\perp\ell", "why": "접점에서의 반지름은 접선에 수직이기 때문이다."},
                {"title": "값 계산", "work": r"CT=3을 대입하여 구하는 값을 계산한다.", "why": "앞에서 확인한 반지름의 길이가 계산의 기준이 되기 때문이다."},
            ],
            "check": "구한 값을 원의 반지름 조건과 접선 조건에 대입해 확인한다.",
            "commonMistakes": ["접선과 반지름을 평행하다고 잘못 판단하지 않는다."],
            "diagramRequirement": "MANDATORY",
            "diagramPurpose": "중심 C, 접점 T, 반지름 CT와 접선의 수직 관계를 보여준다.",
        }

    def test_circle_geometry_is_mandatory(self) -> None:
        requirement = infer_solution_visual_requirement(
            {"content": "원의 방정식과 접선의 교점을 구하여라."},
            "접점에서 반지름을 그으면 접선과 수직이다.",
            {"visualDependency": "NONE"},
        )
        self.assertEqual("MANDATORY", requirement)

    def test_centroid_wording_does_not_force_circle_diagram(self) -> None:
        requirement = infer_solution_visual_requirement(
            {"content": "삼각형의 무게중심을 구하여라."},
            "무게중심은 세 꼭짓점 좌표의 평균이다.",
            {"visualDependency": "NONE"},
        )
        self.assertEqual("RECOMMENDED", requirement)

    def test_detail_is_formatted_for_students_and_reports_coverage(self) -> None:
        detail = normalize_solution_detail(self.detail(), inferred_visual_requirement="MANDATORY")
        text = format_solution_detail(detail, "따라서 정답은 ③이다.")
        self.assertIn("[풀이 아이디어]", text)
        self.assertIn("이유:", text)
        self.assertIn("[자주 하는 실수]", text)
        report = build_solution_quality_report(
            detail,
            inferred_visual_requirement="MANDATORY",
            has_solution_visual=True,
        )
        self.assertEqual("PASS", report["verdict"])
        self.assertEqual(3, report["stepCount"])

    def test_circle_solution_svg_supports_tangent_radius_and_right_angle(self) -> None:
        spec = {
            "version": "0.1",
            "type": "circle_geometry",
            "width": 300,
            "height": 300,
            "xRange": [-5, 5],
            "yRange": [-5, 5],
            "circles": [{"center": {"x": 0, "y": 0, "label": "C"}, "radius": 3}],
            "points": [
                {"x": 0, "y": 0, "label": "C"},
                {"x": 0, "y": 3, "label": "T"},
            ],
            "segments": [
                {"from": {"x": 0, "y": 0}, "to": {"x": 0, "y": 3}, "kind": "radius", "label": "r"},
            ],
            "lines": [
                {"from": {"x": -5, "y": 3}, "to": {"x": 5, "y": 3}, "kind": "tangent", "label": "ℓ"},
            ],
            "rightAngles": [
                {"vertex": {"x": 0, "y": 3}, "alongA": {"x": 0, "y": 0}, "alongB": {"x": 1, "y": 3}},
            ],
            "annotations": [{"x": 1, "y": 4, "text": "CT ⟂ ℓ"}],
        }
        svg = render_visual_spec(spec)
        self.assertIn('class="tangent"', svg)
        self.assertIn('class="radius"', svg)
        self.assertIn('class="right-angle"', svg)
        self.assertIn("CT ⟂ ℓ", svg)

    def test_circle_solution_visual_requires_relevant_labelled_constructions(self) -> None:
        with self.assertRaises(SolutionQualityError):
            validate_solution_visual_spec(
                {
                    "version": "0.1",
                    "type": "circle_geometry",
                    "circles": [{"center": {"x": 0, "y": 0}, "radius": 3}],
                    "width": 300,
                    "height": 300,
                    "xRange": [-5, 5],
                    "yRange": [-5, 5],
                    "segments": [{"from": {"x": 0, "y": 0}, "to": {"x": 0, "y": 3}, "kind": "radius"}],
                },
                student_payload={"content": "원의 방정식과 접선의 관계"},
                solution="접선은 반지름과 수직이다.",
                inferred_visual_requirement="MANDATORY",
            )


if __name__ == "__main__":
    unittest.main()
