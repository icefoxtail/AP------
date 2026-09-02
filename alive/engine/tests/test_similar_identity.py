from __future__ import annotations

import tempfile
import unittest
import zipfile
from pathlib import Path

from alive.engine.similar_identity import (
    allocate_similar_identity,
    canonical_similar_identity,
    external_review_package,
    human_display_title,
    install_exam_path,
)


class SimilarIdentityTests(unittest.TestCase):
    def test_canonical_identity_and_display_title_are_separate(self) -> None:
        source = "archive/exams/original/high/h2/2mid/25_제일고_2학기_중간_고2_확률과통계.js"
        identity = canonical_similar_identity(source)

        self.assertEqual("25_제일고_2학기_중간_고2_확률과통계_유사", identity)
        self.assertEqual(
            "25년 제일고 고2 2학기 중간고사 확률과 통계 유사문제",
            human_display_title(identity),
        )
        self.assertEqual(
            "install/archive/exams/similar/high/h2/2mid/25_제일고_2학기_중간_고2_확률과통계_유사.js",
            install_exam_path(identity),
        )

    def test_class_identity_and_display_title(self) -> None:
        source = "archive/exams/original/high/h2/2mid/25_제일고_2학기_중간_고2_확률과통계.js"

        identity = canonical_similar_identity(source, "a")

        self.assertEqual("25_제일고_2학기_중간_고2_확률과통계_유사A", identity)
        self.assertEqual(
            "25년 제일고 고2 2학기 중간고사 확률과 통계 유사문제 A형",
            human_display_title(identity),
        )

    def test_class_collision_numbers_after_class_and_classes_are_independent(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            base_a = "25_제일고_2학기_중간_고2_확률과통계_유사A"
            base_b = "25_제일고_2학기_중간_고2_확률과통계_유사B"
            for identity in (base_a, f"{base_a}3"):
                path = root / "archive/exams/similar/high/h2/2mid" / f"{identity}.js"
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text("closed canonical artifact", encoding="utf-8")

            allocation_a = allocate_similar_identity(root, base_a)
            allocation_b = allocate_similar_identity(root, base_b)

            self.assertEqual(f"{base_a}2", allocation_a["identity"])
            self.assertEqual(base_b, allocation_b["identity"])

    def test_collision_uses_lowest_free_suffix_without_uisa1(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            base = "25_제일고_2학기_중간_고2_확률과통계_유사"
            canonical = root / "archive/exams/similar/high/h2/2mid" / f"{base}.js"
            canonical.parent.mkdir(parents=True)
            canonical.write_text("closed canonical artifact", encoding="utf-8")
            legacy = root / "archive/assets/images" / base.replace("_유사", "_유사1")
            legacy.mkdir(parents=True)

            allocation = allocate_similar_identity(root, base)

            self.assertEqual(f"{base}2", allocation["identity"])
            self.assertTrue(allocation["collision"])
            self.assertEqual(base, allocation["checks"][0]["identity"])
            self.assertTrue(allocation["checks"][0]["occupied"])

    def test_legacy_match_is_reported_without_silent_rename(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            base = "25_제일고_2학기_중간_고2_확률과통계_유사"
            legacy = root / "archive/exams/similar/high/h2/2mid" / f'{base.replace("_유사", "_유사문제")}.js'
            legacy.parent.mkdir(parents=True)
            legacy.write_text("legacy artifact", encoding="utf-8")

            allocation = allocate_similar_identity(root, base)

            self.assertEqual(base, allocation["identity"])
            self.assertFalse(allocation["collision"])
            self.assertEqual([base.replace("_유사", "_유사문제")], allocation["checks"][0]["legacyMatches"])

    def test_external_review_package_contains_only_two_lanes(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source_id = "25_제일고_2학기_중간_고2_확률과통계"
            similar_id = f"{source_id}_유사"
            source = root / "archive/exams/original/high/h2/2mid" / f"{source_id}.js"
            source.parent.mkdir(parents=True)
            source.write_text(
                'window.examTitle = "원본";\n'
                'window.questionBank = [{"id": 2, "image": '
                f'"assets/images/{source_id}/q2.png"}}];\n',
                encoding="utf-8",
            )
            original_asset = root / "archive/assets/images" / source_id / "q2.png"
            original_asset.parent.mkdir(parents=True)
            original_asset.write_bytes(b"original-png")

            canonical_zip = root / "canonical.zip"
            similar_js = (
                f'window.examTitle = "{similar_id}";\n'
                'window.questionBank = [{"id": 2, "image": '
                f'"assets/images/{similar_id}/q02.svg"}}];\n'
            ).encode("utf-8")
            with zipfile.ZipFile(canonical_zip, "w") as package:
                package.writestr("final/identity-manifest.json", '{"identity": "' + similar_id + '"}')
                package.writestr(
                    f"install/archive/exams/similar/high/h2/2mid/{similar_id}.js",
                    similar_js,
                )
                package.writestr(
                    f"install/archive/assets/images/{similar_id}/q02.svg",
                    b"similar-svg",
                )

            output = root / "external-review.zip"
            result = external_review_package(root, canonical_zip, output, str(source.relative_to(root)))

            self.assertEqual("EXTERNAL_REVIEW_PACKAGED", result["status"])
            self.assertEqual(4, result["fileCount"])
            with zipfile.ZipFile(output) as package:
                names = sorted(package.namelist())
                self.assertEqual(
                    [
                        f"original/archive/assets/images/{source_id}/q2.png",
                        f"original/archive/exams/original/high/h2/2mid/{source_id}.js",
                        f"similar/archive/assets/images/{similar_id}/q02.svg",
                        f"similar/archive/exams/similar/high/h2/2mid/{similar_id}.js",
                    ],
                    names,
                )
                self.assertEqual(b"original-png", package.read(names[0]))
                self.assertEqual(b"similar-svg", package.read(names[2]))


if __name__ == "__main__":
    unittest.main()
