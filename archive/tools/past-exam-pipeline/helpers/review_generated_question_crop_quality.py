import argparse
import json
import math
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageStat


DEFAULTS = {
    "minFileSizeBytes": 1024,
    "minWidth": 80,
    "minHeight": 50,
    "maxCropHeightRatio": 0.9,
    "minCropHeightRatio": 0.012,
    "edgeBandRatio": 0.035,
    "contactSheetItemsPerPage": 40,
}


def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def image_is_blank(image):
    rgb = image.convert("RGB")
    stat = ImageStat.Stat(rgb)
    if min(stat.mean) > 252 and max(stat.stddev) < 1.2:
        return True
    bg = Image.new("RGB", rgb.size, "white")
    return ImageChops.difference(rgb, bg).getbbox() is None


def edge_activity(image, edge, ratio):
    gray = image.convert("L")
    width, height = gray.size
    band = max(1, int((height if edge in {"top", "bottom"} else width) * ratio))
    if edge == "top":
        crop = gray.crop((0, 0, width, band))
    elif edge == "bottom":
        crop = gray.crop((0, height - band, width, height))
    elif edge == "left":
        crop = gray.crop((0, 0, band, height))
    else:
        crop = gray.crop((width - band, 0, width, height))
    inv = ImageChops.invert(crop)
    return ImageStat.Stat(inv).mean[0]


def page_for_crop(exam_dir, crop_path):
    stem = crop_path.stem
    qid = "".join(ch for ch in stem if ch.isdigit())
    if not qid:
        return None
    # Most generated exams keep full page references in JS, but the quality
    # gate can work with nearest pages even when exact mapping is unavailable.
    pages = sorted((exam_dir / "pages").glob("page_p*.png"))
    return pages[0] if pages else None


def classify_crop(exam_dir, crop_path):
    warnings = []
    status = "pass"
    page_size = None
    file_size = crop_path.stat().st_size if crop_path.exists() else 0
    width = height = 0
    if not crop_path.exists():
        return {
            "cropQualityStatus": "corrupted_asset",
            "cropQualityWarnings": ["missing_file"],
            "width": 0,
            "height": 0,
            "fileSizeBytes": 0,
            "pageSize": None,
        }
    try:
        with Image.open(crop_path) as image:
            image = image.convert("RGB")
            width, height = image.size
            if file_size < DEFAULTS["minFileSizeBytes"]:
                warnings.append("file_size_below_1kb")
            if width < DEFAULTS["minWidth"] or height < DEFAULTS["minHeight"]:
                warnings.append("too_small_dimensions")
            if image_is_blank(image):
                warnings.append("blank_or_nearly_blank")
            for edge in ("top", "bottom", "left", "right"):
                if edge_activity(image, edge, DEFAULTS["edgeBandRatio"]) > 8.0:
                    warnings.append(f"{edge}_edge_content_near_boundary")
    except Exception as exc:
        return {
            "cropQualityStatus": "corrupted_asset",
            "cropQualityWarnings": [f"image_open_failed:{type(exc).__name__}"],
            "width": width,
            "height": height,
            "fileSizeBytes": file_size,
            "pageSize": None,
        }
    page_path = page_for_crop(exam_dir, crop_path)
    if page_path and page_path.exists():
        try:
            with Image.open(page_path) as page:
                page_size = list(page.size)
                ratio = height / max(1, page.size[1])
                if ratio < DEFAULTS["minCropHeightRatio"]:
                    warnings.append("too_small_relative_to_page")
                if ratio > DEFAULTS["maxCropHeightRatio"]:
                    warnings.append("too_large_relative_to_page")
        except Exception:
            warnings.append("page_image_open_failed")
    if any(w in warnings for w in ("file_size_below_1kb", "too_small_dimensions", "blank_or_nearly_blank")):
        status = "corrupted_asset"
    elif any(w.endswith("_edge_content_near_boundary") for w in warnings):
        status = "warning"
    elif any(w in warnings for w in ("too_small_relative_to_page", "too_large_relative_to_page")):
        status = "manual_review"
    return {
        "cropQualityStatus": status,
        "cropQualityWarnings": sorted(set(warnings)),
        "width": width,
        "height": height,
        "fileSizeBytes": file_size,
        "pageSize": page_size,
    }


def make_contact_sheet(items, out_path):
    review_items = [item for item in items if item["cropQualityStatus"] != "pass"]
    if not review_items:
        review_items = items[: min(len(items), DEFAULTS["contactSheetItemsPerPage"])]
    tiles = []
    for item in review_items[:160]:
        path = Path(item["cropPath"])
        try:
            image = Image.open(path).convert("RGB")
        except Exception:
            image = Image.new("RGB", (260, 170), "white")
        image.thumbnail((280, 165))
        tile = Image.new("RGB", (320, 230), "white")
        tile.paste(image, (20, 10))
        draw = ImageDraw.Draw(tile)
        label = f"{item['term']} / {item['examId']}\n{path.name} {item['cropQualityStatus']}"
        draw.text((10, 180), label[:120], fill=(0, 0, 0))
        tiles.append(tile)
    if not tiles:
        return False
    cols = 3
    rows = math.ceil(len(tiles) / cols)
    sheet = Image.new("RGB", (cols * 320, rows * 230), "white")
    for idx, tile in enumerate(tiles):
        sheet.paste(tile, ((idx % cols) * 320, (idx // cols) * 230))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_path)
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    root = Path(args.root).resolve()
    out = Path(args.out).resolve()
    items = []
    for crop in sorted(root.glob("*/*/crops/questions/*.png")):
        rel = crop.relative_to(root)
        term = rel.parts[0]
        exam_id = rel.parts[1]
        exam_dir = root / term / exam_id
        quality = classify_crop(exam_dir, crop)
        items.append(
            {
                "term": term,
                "examId": exam_id,
                "cropPath": str(crop),
                **quality,
            }
        )
    counts = Counter(item["cropQualityStatus"] for item in items)
    by_term = defaultdict(Counter)
    for item in items:
        by_term[item["term"]][item["cropQualityStatus"]] += 1
    contact_sheet = out.with_name(out.stem + "_contact_sheet.png")
    contact_ok = make_contact_sheet(items, contact_sheet)
    report = {
        "stage": "past-exam-question-crop-quality",
        "generatedAt": now_iso(),
        "root": str(root),
        "cropCount": len(items),
        "byStatus": dict(counts),
        "byTerm": {term: dict(counts) for term, counts in sorted(by_term.items())},
        "contactSheetCreated": contact_ok,
        "contactSheetPath": str(contact_sheet),
        "items": items,
        "status": "ok" if counts.get("corrupted_asset", 0) == 0 else "manual_review",
    }
    write_json(out, report)
    print(json.dumps({k: report[k] for k in ["cropCount", "byStatus", "byTerm", "contactSheetPath", "status"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
