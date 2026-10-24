import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("archive_build_db", ROOT / "archive" / "build_db.py")
build_db = importlib.util.module_from_spec(spec)
original_stdout = sys.stdout
spec.loader.exec_module(build_db)
sys.stdout = original_stdout


class BuildDbQCountTests(unittest.TestCase):
    def test_extracts_questions_from_window_exam_data_root_object(self):
        source = '''window.examData = {
  "title": "sample",
  "questions": [
    {"id": 1},
    {"id": 2}
  ]
};
'''
        with tempfile.TemporaryDirectory() as temp_dir:
            exam_path = Path(temp_dir) / "sample.js"
            exam_path.write_text(source, encoding="utf-8")

            self.assertEqual(build_db.extract_qcount_from_js(exam_path), 2)

    def test_extracts_questions_from_window_exam_data_with_bare_key(self):
        source = '''window.examData = {
  title: "sample",
  questions: [
    {id: 1},
    {id: 2},
    {id: 3}
  ]
};
'''
        with tempfile.TemporaryDirectory() as temp_dir:
            exam_path = Path(temp_dir) / "sample.js"
            exam_path.write_text(source, encoding="utf-8")

            self.assertEqual(build_db.extract_qcount_from_js(exam_path), 3)

    def test_exam_data_subject_requires_explicit_value_or_known_title_suffix(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            exam_path = Path(temp_dir) / "24_sample_1학기_중간_중3_기출.js"
            exam_path.write_text(
                'window.examData = {"title":"24_sample_1학기_중간_중3_수학", "questions": []};',
                encoding="utf-8",
            )
            meta = build_db.parse_source_metadata(exam_path.name, "original/middle/m3/1mid", exam_path)
            self.assertEqual(meta["subject"], "수학")

            exam_path.write_text(
                'window.examData = {"title":"sample exam", "subject":"확률과 통계", "questions": []};',
                encoding="utf-8",
            )
            meta = build_db.parse_source_metadata(exam_path.name, "original/middle/m3/1mid", exam_path)
            self.assertEqual(meta["subject"], "확률과 통계")

            exam_path.write_text(
                'window.examData = {"title":"sample 수학 exam", "questions": []};',
                encoding="utf-8",
            )
            meta = build_db.parse_source_metadata(exam_path.name, "original/middle/m3/1mid", exam_path)
            self.assertEqual(meta["subject"], "")


if __name__ == "__main__":
    unittest.main()
