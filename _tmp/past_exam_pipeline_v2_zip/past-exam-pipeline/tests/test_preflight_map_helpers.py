import importlib.util
import tempfile
import unittest
from pathlib import Path


HELPER_PATH = Path(__file__).resolve().parents[1] / "helpers" / "build_display_page_maps_from_verified_counts.py"
SPEC = importlib.util.spec_from_file_location("display_map_helper", HELPER_PATH)
helper = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(helper)

VALIDATOR_PATH = Path(__file__).resolve().parents[1] / "helpers" / "validate_final_candidates.py"
VALIDATOR_SPEC = importlib.util.spec_from_file_location("final_validator", VALIDATOR_PATH)
validator = importlib.util.module_from_spec(VALIDATOR_SPEC)
VALIDATOR_SPEC.loader.exec_module(validator)


class PreflightMapHelperTests(unittest.TestCase):
    def test_expands_mixed_objective_and_subjective_ranges(self):
        with tempfile.TemporaryDirectory() as tmp:
            exam_root = Path(tmp)
            (exam_root / "pages").mkdir()
            verification = {
                "objectiveCount": 20,
                "questionCount": 24,
                "pageQuestionRanges": [
                    {"pageNo": 1, "range": "1-7", "notes": "객관식"},
                    {"pageNo": 2, "range": "8-16", "notes": "객관식"},
                    {"pageNo": 3, "range": "17-20, 서술형 1-2", "notes": "객관식 및 서술형"},
                    {"pageNo": 4, "range": "서술형 3-4", "notes": "서술형"},
                ],
            }

            items = helper.build_items(exam_root, verification)

        self.assertEqual(len(items), 24)
        self.assertEqual(items[0]["displayNo"], "1")
        self.assertEqual(items[19]["displayNo"], "20")
        self.assertEqual(items[20]["displayNo"], "서술형1")
        self.assertEqual(items[23]["displayNo"], "서술형4")

    def test_excludes_answer_memo_pages_from_display_map(self):
        with tempfile.TemporaryDirectory() as tmp:
            exam_root = Path(tmp)
            (exam_root / "pages").mkdir()
            verification = {
                "objectiveCount": 20,
                "questionCount": 24,
                "pageQuestionRanges": [
                    {"pageNo": 1, "range": "1-20", "notes": "객관식"},
                    {"pageNo": 2, "range": "서술형 1-4", "notes": "서술형"},
                    {"pageNo": 3, "range": "정답 메모", "notes": "문항 수 산정에서 제외"},
                ],
            }

            items = helper.build_items(exam_root, verification)

        self.assertEqual(len(items), 24)
        self.assertTrue(all(item["pageNo"] != 3 for item in items))

    def test_flags_missing_solution_only_when_required(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            image = root / "page.png"
            image.write_bytes(b"png")
            candidate_dir = root / "exam" / "candidate"
            candidate_dir.mkdir(parents=True)
            candidate_file = candidate_dir / "sample.candidate.js"
            questions = [
                {
                    "displayNo": 1,
                    "sourceDisplayNoLabel": "1",
                    "content": "2+2?",
                    "choices": ["1", "2", "3", "4", "5"],
                    "answer": "4",
                    "solution": "",
                    "image": str(image),
                    "answerStatus": "direct_solved_verified",
                    "solutionStatus": "required_missing_solution",
                    "solutionPolicy": "required_when_answer_known",
                }
            ]
            candidate_file.write_text(
                'window.examTitle = "sample";\nwindow.questionBank = '
                + validator.json.dumps(questions, ensure_ascii=False)
                + ";\n",
                encoding="utf-8",
            )

            report = validator.validate_exam({
                "examId": "sample",
                "candidateFile": str(candidate_file),
                "expectedQuestionCount": 1,
            })

        self.assertEqual(report["missingRequiredSolution"], [1])
        self.assertIn("missing_required_solutions", report["issues"])


if __name__ == "__main__":
    unittest.main()
