import argparse
import json
import math
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw


def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def is_content_pixel(r, g, b):
    if r > 248 and g > 248 and b > 248:
        return False
    if max(r, g, b) - min(r, g, b) <= 3 and r > 242:
        return False
    return True


def content_bbox(image):
    image = image.convert("RGB")
    width, height = image.size
    pixels = image.load()
    min_x, min_y = width, height
    max_x = max_y = -1
    for y in range(height):
        for x in range(width):
            if is_content_pixel(*pixels[x, y]):
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if max_x < min_x or max_y < min_y:
        return None
    return [min_x, min_y, max_x + 1, max_y + 1]


def expand_bbox(bbox, image_size, padding, min_width, min_height):
    width, height = image_size
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - padding)
    y0 = max(0, y0 - padding)
    x1 = min(width, x1 + padding)
    y1 = min(height, y1 + padding)
    if x1 - x0 < min_width:
        add = min_width - (x1 - x0)
        x0 = max(0, x0 - add // 2)
        x1 = min(width, x1 + add - add // 2)
    if y1 - y0 < min_height:
        add = min_height - (y1 - y0)
        y0 = max(0, y0 - add // 2)
        y1 = min(height, y1 + add - add // 2)
    return [x0, y0, x1, y1]


def tighten_image(path, padding=24, min_width=120, min_height=80, dry_run=False):
    with Image.open(path) as image:
        image = image.convert("RGB")
        bbox = content_bbox(image)
        if bbox is None:
            return {
                "status": "unchanged_blank",
                "oldSize": list(image.size),
                "newSize": list(image.size),
                "contentBBox": None,
                "tightBBox": [0, 0, image.width, image.height],
            }
        tight = expand_bbox(bbox, image.size, padding, min_width, min_height)
        crop = image.crop(tuple(tight))
        status = "tightened" if crop.size != image.size else "unchanged"
        if not dry_run and status == "tightened":
            crop.save(path)
        return {
            "status": status,
            "oldSize": list(image.size),
            "newSize": list(crop.size),
            "contentBBox": bbox,
            "tightBBox": tight,
            "widthReduction": image.width - crop.width,
            "heightReduction": image.height - crop.height,
        }


def make_contact_sheet(items, out_path):
    shown = [item for item in items if item.get("status") == "tightened"][:160]
    if not shown:
        shown = items[:80]
    tiles = []
    for item in shown:
        path = Path(item["assetPath"])
        if not path.exists():
            continue
        try:
            image = Image.open(path).convert("RGB")
        except Exception:
            continue
        image.thumbnail((280, 165))
        tile = Image.new("RGB", (320, 230), "white")
        tile.paste(image, (20, 10))
        draw = ImageDraw.Draw(tile)
        label = f"{item['term']} / {item['examId']}\n{path.name} {item['status']}"
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
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    out = Path(args.out).resolve()
    items = []
    for asset in sorted(root.glob("*/*/assets/*_figure*.png")):
        rel = asset.relative_to(root)
        term = rel.parts[0]
        exam_id = rel.parts[1]
        try:
            result = tighten_image(asset, dry_run=args.dry_run)
        except Exception as exc:
            result = {"status": "failed", "error": str(exc)}
        items.append({"term": term, "examId": exam_id, "assetPath": str(asset), **result})
    counts = Counter(item["status"] for item in items)
    by_term = defaultdict(Counter)
    for item in items:
        by_term[item["term"]][item["status"]] += 1
    contact_sheet = out.with_name(out.stem + "_contact_sheet.png")
    contact_ok = make_contact_sheet(items, contact_sheet) if not args.dry_run else False
    report = {
        "stage": "past-exam-visual-asset-tighten",
        "generatedAt": now_iso(),
        "root": str(root),
        "dryRun": args.dry_run,
        "assetCount": len(items),
        "byStatus": dict(counts),
        "byTerm": {term: dict(counts) for term, counts in sorted(by_term.items())},
        "contactSheetCreated": contact_ok,
        "contactSheetPath": str(contact_sheet),
        "items": items,
        "status": "ok" if not counts.get("failed", 0) else "manual_review",
    }
    write_json(out, report)
    print(json.dumps({k: report[k] for k in ["assetCount", "byStatus", "byTerm", "contactSheetPath", "status"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
