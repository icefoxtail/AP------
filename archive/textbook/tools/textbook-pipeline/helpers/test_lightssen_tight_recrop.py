import tempfile
import unittest
from pathlib import Path

from PIL import Image, ImageDraw

from tighten_lightssen_crops import content_bbox, tighten_image


class LightssenTightRecropTests(unittest.TestCase):
    def test_content_bbox_ignores_large_white_margins(self):
        image = Image.new("RGB", (500, 300), "white")
        draw = ImageDraw.Draw(image)
        draw.rectangle((180, 90, 310, 150), fill=(80, 80, 80))
        draw.text((120, 70), "0001", fill=(210, 60, 55))

        bbox = content_bbox(image)

        self.assertLessEqual(bbox[0], 125)
        self.assertGreaterEqual(bbox[2], 305)
        self.assertGreater(bbox[0], 80)
        self.assertLess(bbox[2], 360)

    def test_tighten_image_writes_smaller_crop_with_padding(self):
        with tempfile.TemporaryDirectory() as tmp:
            src = Path(tmp) / "wide.png"
            dest = Path(tmp) / "tight.png"
            image = Image.new("RGB", (600, 280), "white")
            draw = ImageDraw.Draw(image)
            draw.rectangle((240, 100, 430, 170), fill=(70, 70, 70))
            draw.text((200, 80), "0002", fill=(220, 70, 60))
            image.save(src)

            result = tighten_image(src, dest, padding=30, min_width=160, min_height=90)

            self.assertTrue(dest.exists())
            self.assertLess(result["newSize"][0], 600)
            self.assertLess(result["newSize"][1], 280)
            self.assertGreaterEqual(result["newSize"][0], 160)
            self.assertGreaterEqual(result["newSize"][1], 90)


if __name__ == "__main__":
    unittest.main()
