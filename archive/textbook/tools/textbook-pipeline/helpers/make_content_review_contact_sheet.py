import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def resolve_path(material_root, generated_root, value):
    if not value:
        return None
    raw = Path(value)
    if raw.is_absolute():
        return raw
    for base in (material_root, generated_root, generated_root.parent):
        candidate = base / raw
        if candidate.exists():
            return candidate
    return material_root / raw


def text_preview(value, limit=70):
    text = " ".join(str(value or "").replace("\n", " ").split())
    return text[:limit] + ("..." if len(text) > limit else "")


def make_sheet(index_path, output_path, material_root, generated_root):
    data = read_json(index_path)
    items = data.get("items", [])
    review_items = [item for item in items if item.get("needsReview")]
    if not review_items:
        review_items = items[:60]
    review_items = review_items[:80]

    cols = 2
    tile_w = 720
    tile_h = 360
    rows = max(1, (len(review_items) + cols - 1) // cols)
    sheet = Image.new("RGB", (cols * tile_w, rows * tile_h), "white")
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("malgun.ttf", 18)
        small = ImageFont.truetype("malgun.ttf", 14)
    except Exception:
        font = ImageFont.load_default()
        small = ImageFont.load_default()

    for idx, item in enumerate(review_items):
        x = (idx % cols) * tile_w
        y = (idx // cols) * tile_h
        status_color = (215, 60, 60) if item.get("needsReview") else (40, 130, 70)
        draw.rectangle([x, y, x + tile_w - 1, y + tile_h - 1], outline=(210, 210, 210), width=1)
        draw.rectangle([x, y, x + tile_w - 1, y + 38], fill=status_color)
        title = f"{item.get('setKey', '')}  id={item.get('id')}  display={item.get('displayNo', '')}  p={item.get('pageNo', '')}"
        draw.text((x + 10, y + 8), title[:80], fill="white", font=small)

        crop_path = resolve_path(material_root, generated_root, item.get("cropPath"))
        thumb_box = (x + 10, y + 48, x + 280, y + tile_h - 12)
        if crop_path and crop_path.exists():
            try:
                image = Image.open(crop_path).convert("RGB")
                image.thumbnail((thumb_box[2] - thumb_box[0], thumb_box[3] - thumb_box[1]))
                sheet.paste(image, (thumb_box[0], thumb_box[1]))
            except Exception:
                draw.text((thumb_box[0], thumb_box[1]), "image open failed", fill=(180, 0, 0), font=small)
        else:
            draw.text((thumb_box[0], thumb_box[1]), "crop/page image missing", fill=(180, 0, 0), font=small)

        tx = x + 300
        ty = y + 50
        draw.text((tx, ty), f"needsReview: {item.get('needsReview')}", fill=(0, 0, 0), font=font)
        ty += 28
        draw.text((tx, ty), f"formulaRisk: {item.get('formulaRisk')}", fill=(0, 0, 0), font=font)
        ty += 28
        draw.text((tx, ty), f"confidence: {item.get('confidence')}", fill=(0, 0, 0), font=font)
        ty += 28
        draw.text((tx, ty), f"reason: {text_preview(item.get('reviewReason'), 44)}", fill=(120, 0, 0), font=small)
        ty += 38
        draw.text((tx, ty), "content:", fill=(0, 0, 0), font=small)
        ty += 22
        draw.multiline_text((tx, ty), text_preview(item.get("content"), 120), fill=(0, 0, 0), font=small, spacing=4)
        ty += 58
        choices = item.get("choices") if isinstance(item.get("choices"), list) else []
        draw.text((tx, ty), f"choices: {text_preview(' / '.join(map(str, choices)), 110)}", fill=(0, 0, 0), font=small)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output_path)
    return {"itemCount": len(items), "sheetItemCount": len(review_items), "outputPath": str(output_path)}


def main():
    if len(sys.argv) != 5:
        print("usage: make_content_review_contact_sheet.py review_index.json output.png material_root generated_root", file=sys.stderr)
        return 2
    index_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    material_root = Path(sys.argv[3])
    generated_root = Path(sys.argv[4])
    result = make_sheet(index_path, output_path, material_root, generated_root)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
