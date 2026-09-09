from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
RUN = ROOT / "archive" / "_generated" / "nightly-h1-2sem" / "20260908"
SOURCE = RUN / "work" / "23_buyeong_2mid" / "extraction" / "pages" / "page_p005.png"
BBOX = (900, 570, 1700, 1160)
REL = Path("assets") / "images" / "23_부영여고_2학기_중간_고1_기출" / "q18.png"
TARGETS = [
    RUN / "work" / "23_buyeong_2mid" / "fresh-extract-final" / REL,
    RUN / "packages" / "23_부영여고_2학기_중간_고1_기출_EXTERNAL_REVIEW" / REL,
    RUN / "packages" / "23_부영여고_2학기_중간_고1_기출_EXTERNAL_REVIEW_v2" / REL,
]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    with Image.open(SOURCE) as source:
        width, height = source.size
        if not (0 <= BBOX[0] < BBOX[2] <= width and 0 <= BBOX[1] < BBOX[3] <= height):
            raise SystemExit(f"invalid crop {BBOX} for {width}x{height}")
        crop = source.crop(BBOX)
        temp = RUN / "work" / "23_buyeong_2mid" / "q18-source-crop.png"
        crop.save(temp, format="PNG", optimize=False)
    for target in TARGETS:
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(temp, target)
    evidence = {
        "schemaVersion": "APMATH_SOURCE_VISUAL_CROP_v1",
        "source": str(SOURCE.relative_to(ROOT)).replace("\\", "/"),
        "sourceSha256": sha256(SOURCE),
        "sourcePageNo": 5,
        "bboxPx": {"x1": BBOX[0], "y1": BBOX[1], "x2": BBOX[2], "y2": BBOX[3]},
        "cropSha256": sha256(temp),
        "targetCount": len(TARGETS),
        "targetRelativePath": str(REL).replace("\\", "/"),
        "semanticPurpose": "source diagram for 23 Buyeong q18 circle-fold chord problem",
        "numericCoordinateReview": "BBOX is source-page pixel geometry only; no generated mathematical coordinates are asserted.",
    }
    out = RUN / "audits" / "23_buyeong_q18_visual_crop_evidence.json"
    out.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(evidence, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
