from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from alive.engine.run_store import sha256_file
from alive.engine.visual_renderer import render_visual_file, render_visual_spec
from alive.engine.adaptive_quality_gates import _text_boxes


class VisualRendererTests(unittest.TestCase):
    def test_coordinate_graph_is_deterministic_and_escapes_labels(self) -> None:
        spec = {
            "version": "0.1",
            "type": "simple_function_graph",
            "width": 300,
            "height": 300,
            "xRange": [-4, 4],
            "yRange": [-4, 4],
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
