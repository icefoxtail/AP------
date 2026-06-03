import json
import subprocess
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path.cwd()
QUALITY_REPORT = ROOT / "archive/textbook/reports/archive_asset_image_quality_20260603_195610.json"
GENERATED_ROOT = ROOT / "archive/_generated/past-exams/high_h2_probability_statistics_all_terms"
OUT_DIR = ROOT / "archive/textbook/reports"


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def find_pages(folder: str) -> list[Path]:
    return sorted(GENERATED_ROOT.glob(f"**/{folder}/pages/page_p*.png"))


def read_gray(path: Path):
    data = np.fromfile(str(path), dtype=np.uint8)
    return cv2.imdecode(data, cv2.IMREAD_GRAYSCALE)


def save_png(img, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    ok, encoded = cv2.imencode(".png", img)
    if not ok:
        raise RuntimeError(f"Could not encode {path}")
    encoded.tofile(str(path))


def text_density(gray):
    if gray is None or gray.size == 0:
        return 0
    # Count dark pixels. These pages are monochrome scans on white background.
    return int(np.sum(gray < 210))


def crop_box(page_w, page_h, x, y, w, h):
    center_x = x + w / 2
    mid = page_w / 2
    margin = max(40, int(page_w * 0.035))
    gutter = max(30, int(page_w * 0.02))

    if center_x < mid:
        left = margin
        right = int(mid - gutter)
    else:
        left = int(mid + gutter)
        right = page_w - margin

    # For wide snippets, preserve full snippet span plus padding.
    left = min(left, max(margin, x - 160))
    right = max(right, min(page_w - margin, x + w + 160))

    top = max(margin, y - 280)
    bottom = min(page_h - margin, y + h + 620)
    if bottom - top < 520:
        bottom = min(page_h - margin, top + 520)
    return left, top, right, bottom


def main():
    quality = json.loads(QUALITY_REPORT.read_text(encoding="utf-8"))
    bad = [item for item in quality["worstProbabilityStatisticsImages"] if item["score"] >= 40]

    actions = []
    for item in bad:
        asset = ROOT / item["path"]
        if not asset.exists():
            actions.append({**item, "status": "asset_missing"})
            continue

        folder = asset.parent.name
        pages = find_pages(folder)
        if not pages:
            actions.append({**item, "status": "source_pages_missing"})
            continue

        tpl = read_gray(asset)
        if tpl is None or tpl.shape[0] < 18 or tpl.shape[1] < 18:
            actions.append({**item, "status": "template_too_small"})
            continue
        if text_density(tpl) < 35:
            actions.append({**item, "status": "template_too_blank", "darkPixels": text_density(tpl)})
            continue

        best = None
        th, tw = tpl.shape[:2]
        for page in pages:
            src = read_gray(page)
            if src is None or src.shape[0] < th or src.shape[1] < tw:
                continue
            result = cv2.matchTemplate(src, tpl, cv2.TM_CCOEFF_NORMED)
            _, score, _, loc = cv2.minMaxLoc(result)
            if best is None or score > best["matchScore"]:
                best = {"page": page, "matchScore": float(score), "x": int(loc[0]), "y": int(loc[1]), "src": src}

        if best is None:
            actions.append({**item, "status": "no_match"})
            continue

        # Line-only fragments can match borders with high confidence. Avoid replacing those blindly.
        near_border = best["x"] < 20 or best["y"] < 20 or best["x"] + tw > best["src"].shape[1] - 20
        if best["matchScore"] < 0.72 or (near_border and (tw < 100 or th > 800)):
            actions.append({
                **item,
                "status": "match_rejected",
                "matchScore": best["matchScore"],
                "matchedPage": rel(best["page"]),
                "x": best["x"],
                "y": best["y"],
                "nearBorder": near_border,
                "darkPixels": text_density(tpl),
            })
            continue

        left, top, right, bottom = crop_box(best["src"].shape[1], best["src"].shape[0], best["x"], best["y"], tw, th)
        cropped = best["src"][top:bottom, left:right]
        before = {"width": item["width"], "height": item["height"], "bytes": item["bytes"]}
        save_png(cropped, asset)
        after_img = Image.open(asset)
        actions.append({
            **item,
            "status": "recropped",
            "matchedPage": rel(best["page"]),
            "matchScore": best["matchScore"],
            "matchBox": [best["x"], best["y"], tw, th],
            "cropBox": [left, top, right, bottom],
            "before": before,
            "after": {"width": after_img.width, "height": after_img.height, "bytes": asset.stat().st_size},
        })

    stamp = subprocess.check_output(["powershell", "-NoProfile", "-Command", "Get-Date -Format yyyyMMdd_HHmmss"], text=True).strip()
    out = OUT_DIR / f"probstat_bad_asset_template_recrop_{stamp}.json"
    out.write_text(json.dumps({
        "generatedAt": stamp,
        "qualityReport": rel(QUALITY_REPORT),
        "inputBadCount": len(bad),
        "statusCounts": {status: sum(1 for a in actions if a["status"] == status) for status in sorted(set(a["status"] for a in actions))},
        "actions": actions,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({
        "out": rel(out),
        "inputBadCount": len(bad),
        "statusCounts": {status: sum(1 for a in actions if a["status"] == status) for status in sorted(set(a["status"] for a in actions))},
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
