from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from alive.engine.adaptive_quality_gates import (
    AdaptiveQualityGateError,
    run_pre_review_gates,
)


def candidate(content: str, ordinal: int = 1, choices: list[str] | None = None) -> dict:
    return {
        "ordinal": ordinal,
        "studentPayload": {
            "id": ordinal,
            "content": content,
            "choices": choices or ["1", "2", "3", "4", "5"],
            "questionType": "객관식",
            "layoutTag": "grid",
            "wide": False,
        },
        "solution": "따라서 정답은 ①이다.",
        "solutionDetail": {"steps": []},
    }


class AdaptiveQualityGateTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.run_dir = Path(self.temp.name)
        (self.run_dir / "source").mkdir()
        (self.run_dir / "source" / "source-exam.json").write_text(
            json.dumps(
                {
                    "questions": [
                        {
                            "id": 1,
                            "content": "두 점 A(1,2), B(3,4)의 a+b를 구하여라.",
                            "choices": ["1", "2", "3", "4", "5"],
                            "questionType": "객관식",
                            "layoutTag": "grid",
                            "wide": False,
                        }
                    ]
                },
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )

    def tearDown(self) -> None:
        self.temp.cleanup()

    def test_exact_source_clone_is_rejected(self) -> None:
        with self.assertRaises(AdaptiveQualityGateError) as caught:
            run_pre_review_gates(
                self.run_dir,
                {"questions": [candidate("두 점 A(1,2), B(3,4)의 a+b를 구하여라.")]},
            )
        self.assertEqual("EXACT_SOURCE_CLONE", caught.exception.report["findings"][0]["code"])

    def test_degenerate_a_plus_b_target_is_rejected(self) -> None:
        with self.assertRaises(AdaptiveQualityGateError) as caught:
            run_pre_review_gates(
                self.run_dir,
                {"questions": [candidate("두 점 A(1,4), B(3,2)에 대하여 a+b의 값을 구하여라.")]},
            )
        codes = {item["code"] for item in caught.exception.report["findings"]}
        self.assertIn("DEGENERATE_TARGET_INVARIANT", codes)

    def test_malformed_latex_is_rejected(self) -> None:
        with self.assertRaises(AdaptiveQualityGateError) as caught:
            run_pre_review_gates(
                self.run_dir,
                {"questions": [candidate("새 문항") | {"solution": "\\frac12 and \\sqrt{x=1}"}]},
            )
        codes = {item["code"] for item in caught.exception.report["findings"]}
        self.assertIn("BARE_FRAC_COMMAND", codes)
        self.assertIn("MALFORMED_SQRT", codes)

    def test_braced_fraction_is_not_rejected(self) -> None:
        report = run_pre_review_gates(
            self.run_dir,
            {
                "questions": [
                    candidate("새 문항에서 분수값을 구하여라.")
                    | {"solution": "\\frac{\\sqrt{10}}{3}"}
                ]
            },
        )
        self.assertEqual("PASS", report["verdict"])

    def test_clean_changed_candidate_passes(self) -> None:
        report = run_pre_review_gates(
            self.run_dir,
            {"questions": [candidate("새 문항에서 7을 구하여라.")]},
        )
        self.assertEqual("PASS", report["verdict"])
        self.assertEqual("PASS", report["checks"]["sourceClone"])

    def test_different_svg_labels_at_same_point_are_rejected(self) -> None:
        visual_dir = self.run_dir / "candidates" / "b01" / "round1" / "visual" / "q001" / "solution"
        visual_dir.mkdir(parents=True)
        (visual_dir / "visual.svg").write_text(
            '<svg xmlns="http://www.w3.org/2000/svg"><text x="10" y="20">A</text><text x="10" y="20">B</text></svg>',
            encoding="utf-8",
        )
        item = candidate("새 시각 문항")
        item["solutionVisualAsset"] = {"path": "candidates/b01/round1/visual/q001/solution/visual.svg"}
        with self.assertRaises(AdaptiveQualityGateError) as caught:
            run_pre_review_gates(self.run_dir, {"questions": [item]})
        self.assertIn("SVG_LABEL_COLLISION", {item["code"] for item in caught.exception.report["findings"]})


if __name__ == "__main__":
    unittest.main()
