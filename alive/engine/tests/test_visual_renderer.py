from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from alive.engine.run_store import sha256_file
from alive.engine.visual_renderer import render_visual_file, render_visual_spec
from alive.engine.adaptive_quality_gates import _text_boxes


class VisualRendererTests(unittest.TestCase):
    def test_svg_emits_korean_accessibility_title_and_description(self) -> None:
        spec = {
            "type": "coordinate_plane",
            "width": 240,
            "height": 240,
            "xRange": [-2, 2],
            "yRange": [-2, 2],
            "segments": [{"from": {"x": 0, "y": 0}, "to": {"x": 1, "y": 1}}],
            "title": "두 점을 잇는 선분",
            "description": "좌표평면에서 원점과 점 A를 선분으로 이었다.",
        }

        svg = render_visual_spec(spec)

        self.assertIn('<title id="visual-title">두 점을 잇는 선분</title>', svg)
        self.assertIn(
            '<desc id="visual-description">좌표평면에서 원점과 점 A를 선분으로 이었다.</desc>',
            svg,
        )
        self.assertIn('role="img" aria-labelledby="visual-title" aria-describedby="visual-description"', svg)

    def test_renderer_rejects_unreviewed_english_sentence_in_visible_annotations(self) -> None:
        spec = {
            "type": "coordinate_plane",
            "width": 240,
            "height": 240,
            "xRange": [-2, 2],
            "yRange": [-2, 2],
            "title": "두 점을 잇는 선분",
            "description": "좌표평면에서 원점과 점 A를 선분으로 이었다.",
            "annotations": [{"x": 0, "y": 0, "text": "Reconstruct the orbit"}],
        }

        with self.assertRaisesRegex(ValueError, "SVG_ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW"):
            render_visual_spec(spec)

    def test_renderer_allows_standard_math_and_curriculum_terms_but_rejects_english_concept_labels(self) -> None:
        spec = {
            "type": "coordinate_plane",
            "width": 240,
            "height": 240,
            "xRange": [-2, 2],
            "yRange": [-2, 2],
            "title": "역함수와 공통접선",
            "description": "역함수 그래프와 두 곡선의 공통접선을 좌표평면에 나타낸 그림",
            "annotations": [
                {"x": -1, "y": -1, "text": "sin(A), max/min, AB=3 cm"},
                {"x": 0, "y": 0, "text": "yz평면, Pmin, nm=3"},
                {"x": 1, "y": 1, "text": "y=mx+5; cf(4)=9; ab≤10; af′(a)"},
            ],
        }
        self.assertIn("<desc", render_visual_spec(spec))
        spec["annotations"][0]["text"] = "common tangent sign chart"
        with self.assertRaisesRegex(ValueError, "SVG_ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW"):
            render_visual_spec(spec)

    def test_renderer_derives_accessible_description_from_actual_geometry(self) -> None:
        spec = {
            "type": "segment_geometry",
            "width": 240,
            "height": 240,
            "xRange": [-1, 4],
            "yRange": [-1, 4],
            "title": "직각삼각형의 빗변",
            "points": [{"x": 0, "y": 0, "label": "A"}, {"x": 3, "y": 0, "label": "B"}, {"x": 0, "y": 4, "label": "C"}],
            "segments": [{"from": {"x": 0, "y": 0}, "to": {"x": 3, "y": 0}, "label": "AB"}],
            "annotations": [{"x": 2, "y": 1, "text": "AB=3 cm"}],
        }
        svg = render_visual_spec(spec)
        self.assertIn("직각삼각형의 빗변: 점 A, B, C; 선분 AB; 풀이에 필요한 관계 AB=3 cm", svg)

    def test_coordinate_graph_is_deterministic_and_escapes_labels(self) -> None:
        spec = {
            "version": "0.1",
            "type": "simple_function_graph",
            "width": 300,
            "height": 300,
            "xRange": [-4, 4],
            "yRange": [-4, 4],
            "title": "함수 그래프와 수직 점근선",
            "description": "두 함수 곡선과 x=1인 수직 점근선을 좌표평면에 나타낸 그림",
            "asymptotes": [{"x": 1}],
            "curves": [
                {"points": [{"x": -4, "y": -1}, {"x": 0, "y": -2}]},
                {"points": [{"x": 2, "y": 2}, {"x": 4, "y": 1}]},
            ],
            "points": [{"x": 2, "y": 2, "label": "A&B"}],
        }
        first = render_visual_spec(spec)
        second = render_visual_spec(json.loads(json.dumps(spec)))
        self.assertEqual(first, second)
        self.assertIn("A&amp;B", first)
        self.assertNotIn("<script", first)

    def test_render_file_records_hash_and_rejects_invalid_geometry(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            spec_path = root / "spec.json"
            output = root / "asset.svg"
            report_path = root / "report.json"
            spec = {
                "type": "coordinate_plane",
                "width": 240,
                "height": 240,
                "xRange": [-3, 3],
                "yRange": [-3, 3],
                "title": "두 점을 잇는 선분",
                "description": "좌표평면에서 두 점을 잇는 선분을 나타낸 그림",
                "segments": [{"from": {"x": -1, "y": -1}, "to": {"x": 2, "y": 2}}],
                "points": [{"x": 2, "y": 2, "label": "P"}],
            }
            spec_path.write_text(json.dumps(spec), encoding="utf-8")
            report = render_visual_file(spec_path, output, report_path)
            self.assertEqual(sha256_file(output), report["assetSha256"])
            self.assertEqual("PASS", report["deterministicRerender"])
            self.assertFalse(report["generativeModelUsed"])
            broken = {**spec, "xRange": [2, -2]}
            with self.assertRaisesRegex(ValueError, "strictly increasing"):
                render_visual_spec(broken)

    def test_table_requires_rectangular_rows(self) -> None:
        spec = {
            "type": "table", "width": 300, "height": 160,
            "title": "조건을 정리한 표", "description": "두 행의 조건과 값을 표로 나타낸 그림",
            "rows": [["x", "1"], ["f(x)"]],
        }
        with self.assertRaisesRegex(ValueError, "rectangular"):
            render_visual_spec(spec)

    def test_coordinate_labels_are_deterministically_repositioned(self) -> None:
        spec = {
            "type": "circle_geometry",
            "width": 400,
            "height": 400,
            "xRange": [-5, 5],
            "yRange": [-5, 5],
            "title": "원과 선분의 관계",
            "description": "중심 C인 원과 지름 AB를 포함한 선분을 좌표평면에 나타낸 그림",
            "circles": [{"center": {"x": 0, "y": 0, "label": "C"}, "radius": 3}],
            "segments": [{"from": {"x": -3, "y": 0}, "to": {"x": 3, "y": 0}, "label": "AB"}],
            "points": [
                {"x": 0, "y": 0, "label": "C"},
                {"x": 0, "y": 0, "label": "M"},
            ],
            "lines": [],
        }
        with tempfile.TemporaryDirectory() as temporary:
            output = Path(temporary) / "visual.svg"
            output.write_text(render_visual_spec(spec), encoding="utf-8")
            boxes = _text_boxes(output)
            for index, left in enumerate(boxes):
                for right in boxes[index + 1 :]:
                    self.assertFalse(
                        left["x1"] < right["x2"]
                        and right["x1"] < left["x2"]
                        and left["y1"] < right["y2"]
                        and right["y1"] < left["y2"],
                        (left, right),
                    )
            self.assertEqual(1, sum(box["text"] == "C" for box in boxes))


if __name__ == "__main__":
    unittest.main()
