import tempfile
import unittest
from pathlib import Path

from PIL import Image

from review_crop_quality import classify_crop, review_generated_root, summarize_quality


class CropQualityReviewTests(unittest.TestCase):
    def make_image(self, path, size=(120, 80), color="white"):
        image = Image.new("RGB", size, color)
        image.save(path)

    def test_missing_file_is_corrupted_asset(self):
        result = classify_crop({"cropPathAbs": "missing.png"}, Path.cwd())
        self.assertEqual(result["cropQualityStatus"], "corrupted_asset")
        self.assertIn("missing_file", result["cropQualityWarnings"])

    def test_small_file_is_manual_review_candidate(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "tiny.png"
            self.make_image(path, size=(8, 8))
            result = classify_crop({"cropPathAbs": str(path), "setKey": "A"}, Path.cwd())
            self.assertEqual(result["cropQualityStatus"], "corrupted_asset")
            self.assertIn("too_small_dimensions", result["cropQualityWarnings"])

    def test_extreme_height_is_warning(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "tall.png"
            self.make_image(path, size=(120, 900), color=(230, 230, 230))
            item = {"cropPathAbs": str(path), "setKey": "A", "pageNo": 1}
            result = classify_crop(item, Path.cwd(), page_size=(1200, 1000))
            self.assertEqual(result["cropQualityStatus"], "warning")
            self.assertIn("too_large_relative_to_page", result["cropQualityWarnings"])

    def test_summary_counts_statuses(self):
        summary = summarize_quality([
            {"cropQualityStatus": "pass"},
            {"cropQualityStatus": "warning"},
            {"cropQualityStatus": "manual_review"},
        ])
        self.assertEqual(summary["passCount"], 1)
        self.assertEqual(summary["warningCount"], 1)
        self.assertEqual(summary["manualReviewCount"], 1)
        self.assertEqual(summary["status"], "partial")

    def test_narrow_crop_is_auto_recropped_from_rendered_page(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "book"
            generated = root / "generated"
            reports = generated / "reports"
            set_key = "RPM_TEST_SET"
            crop_dir = generated / "work" / "question_crops" / "workbook" / set_key
            page_dir = generated / "work" / "rendered_pages" / "workbook" / set_key
            crop_dir.mkdir(parents=True)
            page_dir.mkdir(parents=True)
            reports.mkdir(parents=True)

            page = Image.new("RGB", (500, 700), "white")
            for x in range(90, 420):
                for y in range(110, 250):
                    page.putpixel((x, y), (120, 120, 120))
            page.save(page_dir / "page_001.png")

            crop_path = crop_dir / "bad.png"
            self.make_image(crop_path, size=(8, 8))
            item = {
                "setKey": set_key,
                "bookPart": "workbook",
                "pageNo": 1,
                "globalQuestionNo": 1,
                "displayNo": "0001",
                "cropPath": crop_path.relative_to(root).as_posix(),
                "bboxPx": [100, 120, 108, 170],
            }
            (reports / "rpm_question_crop_map.json").write_text(
                '{"items": [' + __import__("json").dumps(item) + "]}",
                encoding="utf-8",
            )

            summary = review_generated_root(generated, options={"minFileSizeBytes": 1024, "minRecropWidth": 220})
            apply_report = __import__("json").loads((reports / "question_crop_recrop_apply_report.json").read_text(encoding="utf-8"))

            self.assertEqual(summary["recropAppliedCount"], 1)
            self.assertEqual(apply_report["appliedCount"], 1)
            refined_path = root / apply_report["items"][0]["refinedCropPath"]
            self.assertTrue(refined_path.exists())
            with Image.open(refined_path) as image:
                self.assertGreaterEqual(image.size[0], 220)


if __name__ == "__main__":
    unittest.main()
