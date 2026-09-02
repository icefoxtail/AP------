from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from alive.engine.visual_recon import (
    inspect_source_visuals,
    materialize_visual_recon,
    prepare_visual_recon,
)


class VisualReconTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.asset = self.root / "archive/assets/source.svg"
        self.asset.parent.mkdir(parents=True)
        self.asset.write_text(
            '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="5"/></svg>',
            encoding="utf-8",
        )

    def tearDown(self) -> None:
        self.temporary.cleanup()

    @staticmethod
    def preflight(dependency: str) -> dict:
        return {
            "questions": [{"ordinal": 1, "visualDependency": dependency}],
        }

    def test_local_problem_asset_is_fingerprinted_and_materialized(self) -> None:
        exam = {"questions": [{"id": 1, "content": "그림과 같이", "image": "assets/source.svg"}]}
        report = prepare_visual_recon(self.root, exam, self.preflight("ESSENTIAL"))
        self.assertEqual("READY", report["status"])
        self.assertTrue(report["ready"])
        self.assertEqual("PASS", report["questions"]["1"]["roles"]["problem"]["status"])
        self.assertTrue(report["humanInspectionRequired"])
        run_dir = self.root / "alive/runtime/staged-runs/example"
        run_dir.mkdir(parents=True)
        materialized = materialize_visual_recon(run_dir, report, self.root)
        asset = materialized["questions"]["1"]["roles"]["problem"]["assets"][0]
        self.assertTrue((run_dir / asset["runPath"]).is_file())
        self.assertEqual(asset["sha256"], asset["runSha256"])

    def test_missing_or_remote_asset_blocks_only_the_visual_recon(self) -> None:
        missing = {"questions": [{"id": 1, "content": "그림", "image": "assets/missing.svg"}]}
        report = inspect_source_visuals(self.root, missing, self.preflight("ESSENTIAL"))
        self.assertEqual("BLOCKED", report["status"])
        self.assertEqual([1], report["heldOrdinals"])
        self.assertIn("VISUAL_SOURCE_ASSET_MISSING", report["questions"]["1"]["codes"])

        remote = {"questions": [{"id": 1, "content": "그림", "image": "https://example.com/q.svg"}]}
        report = inspect_source_visuals(self.root, remote, self.preflight("ESSENTIAL"))
        self.assertIn("VISUAL_SOURCE_REMOTE_OR_EMBEDDED", report["questions"]["1"]["codes"])

    def test_no_visual_question_is_not_required(self) -> None:
        exam = {"questions": [{"id": 1, "content": "텍스트"}]}
        report = inspect_source_visuals(self.root, exam, self.preflight("NONE"))
        self.assertEqual("NOT_REQUIRED", report["status"])
        self.assertTrue(report["ready"])
        self.assertFalse(report["humanInspectionRequired"])


if __name__ == "__main__":
    unittest.main()
