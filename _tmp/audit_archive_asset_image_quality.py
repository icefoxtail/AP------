from __future__ import annotations

import csv
import json
import math
from datetime import datetime
from pathlib import Path

import numpy as np
from PIL import Image, ImageStat


ROOT = Path.cwd()
ASSET_ROOT = ROOT / "archive" / "assets" / "images"
REPORT_DIR = ROOT / "archive" / "textbook" / "reports"


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def laplacian_variance(gray: np.ndarray) -> float:
    # Lightweight 4-neighbor Laplacian. Good enough for ranking blur suspects.
    if gray.shape[0] < 3 or gray.shape[1] < 3:
        return 0.0
    center = gray[1:-1, 1:-1] * 4
    lap = center - gray[:-2, 1:-1] - gray[2:, 1:-1] - gray[1:-1, :-2] - gray[1:-1, 2:]
    return float(lap.var())


def classify(path: Path, width: int, height: int, size: int, blur: float, brightness: float, contrast: float) -> list[str]:
    flags: list[str] = []
    folder = path.parent.name
    name = path.name
    area = width * height
    ratio = max(width / max(height, 1), height / max(width, 1))

    if width < 250 or height < 120:
        flags.append("tiny_resolution")
    if area < 120_000:
        flags.append("small_area")
    if size < 20_000:
        flags.append("small_file")
    if blur < 20:
        flags.append("very_blurry_metric")
    elif blur < 45:
        flags.append("blurry_metric")
    if contrast < 18:
        flags.append("low_contrast")
    if brightness < 35 or brightness > 245:
        flags.append("extreme_brightness")
    if ratio > 8:
        flags.append("extreme_aspect")
    if "page" in name.lower() or name.lower().startswith("p"):
        flags.append("page_like_name")
    if height > width * 1.8 and area > 1_000_000:
        flags.append("full_page_like")
    if "확률과통계" in folder or "확통" in folder:
        flags.append("probability_statistics_folder")
    if "기출" in folder or "중간" in folder or "기말" in folder:
        flags.append("exam_folder")
    return flags


def inspect(path: Path) -> dict:
    row = {
        "path": rel(path),
        "folder": path.parent.name,
        "file": path.name,
        "bytes": path.stat().st_size,
        "width": None,
        "height": None,
        "mode": None,
        "blur": None,
        "brightness": None,
        "contrast": None,
        "flags": ["open_error"],
    }
    try:
        with Image.open(path) as image:
            image.load()
            width, height = image.size
            gray_image = image.convert("L")
            # Downsample for speed while preserving enough signal.
            sample = gray_image.copy()
            sample.thumbnail((900, 900))
            arr = np.asarray(sample, dtype=np.float32)
            stat = ImageStat.Stat(sample)
            brightness = float(stat.mean[0])
            contrast = float(stat.stddev[0])
            blur = laplacian_variance(arr)
            flags = classify(path, width, height, path.stat().st_size, blur, brightness, contrast)
            row.update(
                {
                    "width": width,
                    "height": height,
                    "mode": image.mode,
                    "blur": round(blur, 2),
                    "brightness": round(brightness, 2),
                    "contrast": round(contrast, 2),
                    "flags": flags,
                }
            )
    except Exception as exc:
        row["error"] = str(exc)
    return row


def suspicion_score(row: dict) -> int:
    weights = {
        "open_error": 100,
        "tiny_resolution": 30,
        "small_area": 20,
        "small_file": 15,
        "very_blurry_metric": 30,
        "blurry_metric": 15,
        "low_contrast": 15,
        "extreme_brightness": 10,
        "extreme_aspect": 20,
        "full_page_like": 12,
        "page_like_name": 8,
        "probability_statistics_folder": 6,
        "exam_folder": 4,
    }
    return sum(weights.get(flag, 0) for flag in row.get("flags", []))


def main() -> None:
    files = sorted(
        [
            p
            for p in ASSET_ROOT.rglob("*")
            if p.is_file() and p.suffix.lower() in {".png", ".jpg", ".jpeg"}
        ],
        key=lambda p: rel(p),
    )
    rows = [inspect(path) for path in files]
    for row in rows:
        row["score"] = suspicion_score(row)

    확통 = [row for row in rows if "probability_statistics_folder" in row["flags"]]
    bad = [row for row in rows if row["score"] >= 40]
    bad_확통 = [row for row in 확통 if row["score"] >= 40]

    by_folder: dict[str, dict] = {}
    for row in rows:
        folder = row["folder"]
        item = by_folder.setdefault(
            folder,
            {
                "folder": folder,
                "count": 0,
                "probabilityStatistics": "probability_statistics_folder" in row["flags"],
                "examFolder": "exam_folder" in row["flags"],
                "badCount": 0,
                "worstScore": 0,
                "worstPath": "",
                "flagCounts": {},
            },
        )
        item["count"] += 1
        if row["score"] >= 40:
            item["badCount"] += 1
        if row["score"] > item["worstScore"]:
            item["worstScore"] = row["score"]
            item["worstPath"] = row["path"]
        for flag in row["flags"]:
            item["flagCounts"][flag] = item["flagCounts"].get(flag, 0) + 1

    folder_rows = sorted(
        by_folder.values(),
        key=lambda item: (item["badCount"], item["worstScore"], item["count"]),
        reverse=True,
    )

    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    out_json = REPORT_DIR / f"archive_asset_image_quality_{stamp}.json"
    out_csv = REPORT_DIR / f"archive_asset_image_quality_bad_{stamp}.csv"

    report = {
        "generatedAt": datetime.now().isoformat(),
        "scope": rel(ASSET_ROOT),
        "totalImages": len(rows),
        "probabilityStatisticsImages": len(확통),
        "badImagesScoreGte40": len(bad),
        "badProbabilityStatisticsImagesScoreGte40": len(bad_확통),
        "flagCounts": {},
        "worstImages": sorted(rows, key=lambda row: row["score"], reverse=True)[:80],
        "worstProbabilityStatisticsImages": sorted(확통, key=lambda row: row["score"], reverse=True)[:120],
        "folderSummary": folder_rows,
    }
    for row in rows:
        for flag in row["flags"]:
            report["flagCounts"][flag] = report["flagCounts"].get(flag, 0) + 1

    out_json.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    with out_csv.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["score", "path", "folder", "file", "bytes", "width", "height", "blur", "brightness", "contrast", "flags"],
            extrasaction="ignore",
        )
        writer.writeheader()
        for row in sorted(bad, key=lambda item: item["score"], reverse=True):
            writer.writerow({**row, "flags": ",".join(row["flags"])})

    print(
        json.dumps(
            {
                "outJson": rel(out_json),
                "outCsv": rel(out_csv),
                "totalImages": report["totalImages"],
                "probabilityStatisticsImages": report["probabilityStatisticsImages"],
                "badImagesScoreGte40": report["badImagesScoreGte40"],
                "badProbabilityStatisticsImagesScoreGte40": report["badProbabilityStatisticsImagesScoreGte40"],
                "flagCounts": report["flagCounts"],
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
