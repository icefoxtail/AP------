import json
import math
import os
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def is_ink(pixel):
    if len(pixel) == 4 and pixel[3] < 20:
        return False
    r, g, b = pixel[:3]
    return min(r, g, b) < 238 and (max(r, g, b) - min(r, g, b) > 8 or max(r, g, b) < 215)


def build_mask(image, scale=3):
    w, h = image.size
    sw = max(1, math.ceil(w / scale))
    sh = max(1, math.ceil(h / scale))
    small = image.convert("RGB").resize((sw, sh))
    pix = small.load()
    mask = [[False] * sw for _ in range(sh)]
    for y in range(sh):
        for x in range(sw):
            if is_ink(pix[x, y]):
                mask[y][x] = True
    return mask, scale


def dilate(mask, radius=2):
    h = len(mask)
    w = len(mask[0]) if h else 0
    out = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if not mask[y][x]:
                continue
            y0 = max(0, y - radius)
            y1 = min(h, y + radius + 1)
            x0 = max(0, x - radius)
            x1 = min(w, x + radius + 1)
            for yy in range(y0, y1):
                row = out[yy]
                for xx in range(x0, x1):
                    row[xx] = True
    return out


def components(mask):
    h = len(mask)
    w = len(mask[0]) if h else 0
    seen = [[False] * w for _ in range(h)]
    comps = []
    for y in range(h):
        for x in range(w):
            if not mask[y][x] or seen[y][x]:
                continue
            stack = [(x, y)]
            seen[y][x] = True
            minx = maxx = x
            miny = maxy = y
            count = 0
            while stack:
                cx, cy = stack.pop()
                count += 1
                minx = min(minx, cx)
                maxx = max(maxx, cx)
                miny = min(miny, cy)
                maxy = max(maxy, cy)
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < w and 0 <= ny < h and mask[ny][nx] and not seen[ny][nx]:
                        seen[ny][nx] = True
                        stack.append((nx, ny))
            comps.append((minx, miny, maxx + 1, maxy + 1, count))
    return comps


def score_bbox(bbox, image_size):
    x0, y0, x1, y1, count = bbox
    w = x1 - x0
    h = y1 - y0
    iw, ih = image_size
    area = w * h
    image_area = iw * ih
    if w < 32 or h < 24:
        return -1
    if area > image_area * 0.7:
        return -1
    if h < 38 and w > 160:
        return -1
    right_bonus = 1.25 if x0 > iw * 0.35 else 1.0
    lower_bonus = 1.12 if y0 > ih * 0.2 else 1.0
    density = count / max(area, 1)
    return area * right_bonus * lower_bonus * (0.6 + min(density * 3, 1.2))


def choose_visual_bbox(image):
    scale = 3
    mask, scale = build_mask(image, scale=scale)
    mask = dilate(mask, radius=3)
    raw = components(mask)
    iw, ih = image.size
    scaled = []
    for x0, y0, x1, y1, count in raw:
        box = (
            max(0, x0 * scale),
            max(0, y0 * scale),
            min(iw, x1 * scale),
            min(ih, y1 * scale),
            count * scale * scale,
        )
        scaled.append(box)
    ranked = sorted(((score_bbox(b, (iw, ih)), b) for b in scaled), reverse=True)
    if ranked and ranked[0][0] > 0:
        x0, y0, x1, y1, _ = ranked[0][1]
        pad = 18
        return (max(0, x0 - pad), max(0, y0 - pad), min(iw, x1 + pad), min(ih, y1 + pad)), "component_detected", ranked[0][0]
    return (0, 0, iw, ih), "full_question_crop_fallback", 0


def write_contact_sheet(items, out_path):
    thumbs = []
    for item in items:
        if item.get("status") != "asset_crop_success":
            continue
        try:
            im = Image.open(item["outputPath"]).convert("RGB")
        except Exception:
            continue
        im.thumbnail((260, 180))
        tile = Image.new("RGB", (300, 230), "white")
        tile.paste(im, (20, 12))
        draw = ImageDraw.Draw(tile)
        label = f"{item['setKey']}\nid {item['id']} {item['method']}"
        draw.text((12, 190), label[:90], fill=(0, 0, 0))
        thumbs.append(tile)
    if not thumbs:
        return False
    cols = 3
    rows = math.ceil(len(thumbs) / cols)
    sheet = Image.new("RGB", (cols * 300, rows * 230), "white")
    for idx, tile in enumerate(thumbs):
        sheet.paste(tile, ((idx % cols) * 300, (idx // cols) * 230))
    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_path)
    return True


def main():
    if len(sys.argv) != 3:
        print("usage: crop_visual_assets.py manifest.json report.json", file=sys.stderr)
        return 2
    manifest_path = Path(sys.argv[1])
    report_path = Path(sys.argv[2])
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    results = []
    for item in manifest.get("candidates", []):
        result = dict(item)
        source = Path(item["sourceCropPath"])
        output = Path(item["outputPath"])
        try:
            if not source.exists():
                raise FileNotFoundError(str(source))
            image = Image.open(source).convert("RGB")
            bbox, method, score = choose_visual_bbox(image)
            x0, y0, x1, y1 = bbox
            if x1 - x0 < 30 or y1 - y0 < 30:
                raise ValueError("detected region too small")
            output.parent.mkdir(parents=True, exist_ok=True)
            image.crop(bbox).save(output)
            result.update({
                "status": "asset_crop_success",
                "bboxInQuestionCrop": [x0, y0, x1, y1],
                "method": method,
                "score": score,
                "width": x1 - x0,
                "height": y1 - y0,
                "note": "fallback keeps the full question crop when visual-only isolation is ambiguous" if method.endswith("fallback") else "",
            })
        except Exception as exc:
            result.update({"status": "asset_crop_failed", "error": str(exc)})
        results.append(result)
    created = sum(1 for item in results if item.get("status") == "asset_crop_success")
    contact_path = manifest.get("contactSheetPath", "")
    contact_ok = write_contact_sheet(results, contact_path) if contact_path else False
    report = {
        "stage": "07-visual-asset-crop",
        "candidateCount": len(results),
        "createdCount": created,
        "failedCount": len(results) - created,
        "contactSheetCreated": contact_ok,
        "contactSheetPath": contact_path,
        "results": results,
        "status": "ok" if created == len(results) else "manual_review",
    }
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 0 if created == len(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())

