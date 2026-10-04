from __future__ import annotations

import tempfile
import unittest
import json
from pathlib import Path

from alive.engine.visual_lane import (
    VisualLaneError,
    materialize_final_visual,
    render_staged_visual,
    validate_staged_visual_asset,
)


class VisualLaneTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.run_dir = self.root / "alive/runtime/staged-runs/run"
        self.run_dir.mkdir(parents=True)
        (self.root / "archive").mkdir()

    def tearDown(self) -> None:
        self.temporary.cleanup()

    @staticmethod
    def spec() -> dict:
        return {
            "type": "coordinate_plane",
            "width": 240,
            "height": 240,
            "xRange": [-3, 3],
            "yRange": [-3, 3],
            "segments": [{"from": {"x": -1, "y": -1}, "to": {"x": 2, "y": 2}}],
            "points": [{"x": 2, "y": 2, "label": "P"}],
        }

    def test_render_and_validate_deterministic_candidate(self) -> None:
        asset = render_staged_visual(self.run_dir, "b01", "round1", 1, self.spec())
        spec = json.loads((self.run_dir / asset["specPath"]).read_text(encoding="utf-8"))
        validated = validate_staged_visual_asset(self.run_dir, spec, asset)
        self.assertEqual(asset["sha256"], validated["assetSha256"])
        self.assertEqual("PASS", asset["deterministicRerender"])
        self.assertFalse(asset["generativeModelUsed"])

    def test_tampering_is_rejected_and_final_asset_is_materialized(self) -> None:
        spec = self.spec()
        asset = render_staged_visual(self.run_dir, "b01", "round1", 1, spec)
        path = self.run_dir / asset["path"]
        path.write_text(path.read_text(encoding="utf-8").replace("</svg>", "<script>x</script></svg>"), encoding="utf-8")
        with self.assertRaises(VisualLaneError):
            validate_staged_visual_asset(self.run_dir, spec, asset)

        asset = render_staged_visual(self.run_dir, "b01", "round1", 1, spec)
        final = materialize_final_visual(self.root, self.run_dir, "run", 1, spec, asset)
        self.assertTrue((self.run_dir / final["assetLocalPath"]).is_file())
        self.assertTrue((self.root / "archive" / final["archiveRelativePath"]).is_file())
        self.assertEqual("_generated/alive-staged-exam-runs/run/assets/q001.svg", final["archiveRelativePath"])


if __name__ == "__main__":
    unittest.main()
