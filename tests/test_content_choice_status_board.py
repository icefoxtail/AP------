import json
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HELPERS = ROOT / "archive" / "tools" / "past-exam-pipeline" / "helpers"
sys.path.insert(0, str(HELPERS))

from build_content_choice_image_review_status_board import build_status_board


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


class ContentChoiceStatusBoardTest(unittest.TestCase):
    def test_builds_status_board_queues_and_respects_marker_override(self):
        with tempfile.TemporaryDirectory() as tmp:
            review_dir = Path(tmp)
            candidate_root = review_dir / "generated"

            def candidate(name):
                return str(candidate_root / "1mid" / name / "candidate" / f"{name}.candidate.js")

            files = {
                "pass": candidate("pass_exam"),
                "warn": candidate("warn_exam"),
                "repair": candidate("repair_exam"),
                "repaired": candidate("repaired_exam"),
                "blocked": candidate("blocked_exam"),
                "unchecked": candidate("unchecked_exam"),
                "skip": candidate("skip_exam"),
            }
            items = []
            for idx, (name, path) in enumerate(files.items(), start=1):
                items.append(
                    {
                        "term": "1mid",
                        "examId": f"{name}_exam",
                        "candidateFile": path,
                        "examDir": str(Path(path).parents[1]),
                        "questionCount": 10 + idx,
                        "riskCount": idx,
                        "questions": [],
                    }
                )

            write_json(
                review_dir / "summary.json",
                {
                    "stage": "content-choice-image-1to1-review-worklists",
                    "sourceEvidencePolicy": "full_page_first_crop_zoom_only",
                    "chunks": [{"chunk": 1, "path": str(review_dir / "agent_chunk_01.json")}],
                },
            )
            write_json(review_dir / "agent_chunk_01.json", {"chunk": 1, "items": items})

            stale_findings = [
                {
                    "severity": "PASS",
                    "term": "1mid",
                    "examId": "warn_exam",
                    "candidateFile": files["warn"],
                    "id": 1,
                    "field": "content",
                    "issue": "",
                    "expectedCorrection": {},
                }
            ]
            strict_findings = [
                {"severity": "PASS", "term": "1mid", "examId": "pass_exam", "candidateFile": files["pass"], "id": 1},
                {
                    "severity": "WARN",
                    "term": "1mid",
                    "examId": "warn_exam",
                    "candidateFile": files["warn"],
                    "id": 2,
                    "field": "source",
                    "issue": "questionCropPath missing; used fullPageImagePaths for source evidence.",
                    "expectedCorrection": {},
                    "notes": "No question crop available; full page image inspected instead.",
                },
                {
                    "severity": "FAIL",
                    "term": "1mid",
                    "examId": "repair_exam",
                    "candidateFile": files["repair"],
                    "id": 3,
                    "field": "content",
                    "issue": "content mismatch",
                    "expectedCorrection": {"content": "fixed", "choices": []},
                },
                {
                    "severity": "NOT_INSPECTED",
                    "term": "1mid",
                    "examId": "blocked_exam",
                    "candidateFile": files["blocked"],
                    "id": 4,
                    "field": "source",
                    "issue": "source not located from assigned evidence",
                    "expectedCorrection": {},
                    "notes": "source recovery required",
                },
                {"severity": "PASS", "term": "1mid", "examId": "skip_exam", "candidateFile": files["skip"], "id": 5},
            ]
            write_json(review_dir / "aggregate_findings.json", {"findings": stale_findings})
            write_json(review_dir / "aggregate_findings_final_strict_round1.json", {"findings": strict_findings})
            write_json(
                review_dir / "aggregate_findings_final_strict_round1_repair_candidates.json",
                {"items": [strict_findings[2]]},
            )
            write_json(
                review_dir / "aggregate_findings_repair_candidates.json",
                {
                    "items": [
                        {
                            "severity": "FAIL",
                            "term": "1mid",
                            "examId": "warn_exam",
                            "candidateFile": files["warn"],
                            "id": 8,
                            "field": "content",
                            "issue": "stale lower-priority candidate",
                            "expectedCorrection": {"content": "do not mix", "choices": []},
                        }
                    ]
                },
            )
            write_json(
                review_dir / "round1_correction_result.json",
                {
                    "items": [
                        {
                            "examId": "repaired_exam",
                            "candidateFile": files["repaired"],
                            "questionId": 9,
                            "field": "content",
                            "status": "repaired",
                            "verifiedAt": "2026-06-15T00:00:00Z",
                        }
                    ],
                    "unparsedItems": [],
                },
            )
            markers_dir = review_dir / "markers"
            write_json(
                markers_dir / "skip_exam.review.json",
                {
                    "stage": "content-choice-image-review-marker",
                    "fileKey": files["skip"].replace("\\", "/"),
                    "examId": "skip_exam",
                    "candidateFile": files["skip"],
                    "status": "skip_final",
                    "reason": "manual override",
                    "updatedAt": "2026-06-15T01:00:00Z",
                    "updatedBy": "manual",
                },
            )

            board = build_status_board(
                review_dir=review_dir,
                out_json=review_dir / "review_status_board.json",
                out_md=review_dir / "review_status_board.md",
                correction_json=review_dir / "round1_correction_result.json",
                markers_dir=markers_dir,
                queues_dir=review_dir / "queues",
                write_markers=False,
            )

            by_exam = {item["examId"]: item for item in board["files"]}
            self.assertEqual(by_exam["pass_exam"]["status"], "reviewed_pass")
            self.assertEqual(by_exam["warn_exam"]["status"], "reviewed_warn")
            self.assertEqual(by_exam["repair_exam"]["status"], "repair_ready")
            self.assertEqual(by_exam["repaired_exam"]["status"], "repaired")
            self.assertEqual(by_exam["blocked_exam"]["status"], "blocked_source_missing")
            self.assertEqual(by_exam["unchecked_exam"]["status"], "unchecked")
            self.assertEqual(by_exam["skip_exam"]["status"], "skip_final")

            self.assertEqual(board["statusCounts"]["reviewed_warn"], 1)
            self.assertEqual(board["statusCounts"]["repair_ready"], 1)
            self.assertEqual(board["findingSourcePolicy"], "aggregate_only_when_available_priority_fallback")
            self.assertEqual(len(board["selectedFindingSources"]), 1)
            self.assertTrue(board["selectedFindingSources"][0]["path"].endswith("aggregate_findings_final_strict_round1.json"))
            self.assertEqual(board["unparsedItems"], [])
            self.assertEqual(by_exam["blocked_exam"]["notInspectedCount"], 1)
            self.assertEqual(by_exam["warn_exam"]["repairCandidateCount"], 0)
            self.assertTrue((review_dir / "review_status_board.md").exists())
            md = (review_dir / "review_status_board.md").read_text(encoding="utf-8")
            self.assertIn("## Finding Source Policy", md)
            self.assertIn("aggregate_findings_final_strict_round1.json", md)

            todo_repair = json.loads((review_dir / "queues" / "todo_repair.json").read_text(encoding="utf-8"))
            source_recovery = json.loads((review_dir / "queues" / "todo_source_recovery.json").read_text(encoding="utf-8"))
            done = json.loads((review_dir / "queues" / "done_skip_final.json").read_text(encoding="utf-8"))
            self.assertEqual([item["examId"] for item in todo_repair["items"]], ["repair_exam"])
            self.assertEqual([item["examId"] for item in source_recovery["items"]], ["blocked_exam"])
            self.assertEqual({item["examId"] for item in done["items"]}, {"pass_exam", "repaired_exam", "skip_exam"})


if __name__ == "__main__":
    unittest.main()
