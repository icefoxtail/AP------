import json
import shutil
import sys
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import Image, ImageDraw


LIGHTSSEN_ROOTS = [
    "22개정_라이트쎈_공통수학1",
    "22개정_라이트쎈_공통수학2",
    "22개정_라이트쎈_ 대수",
    "22개정_라이트쎈_중1-1",
    "22개정_라이트쎈_중1-2",
    "22개정_라이트쎈_중2-1",
]


def ensure(path):
    path.mkdir(parents=True, exist_ok=True)


def write_json(path, data):
    ensure(path.parent)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def read_json(path, fallback=None):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fallback


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
                if x < min_x:
                    min_x = x
                if x > max_x:
                    max_x = x
                if y < min_y:
                    min_y = y
                if y > max_y:
                    max_y = y
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

    cur_width = x1 - x0
    cur_height = y1 - y0
    if cur_width < min_width:
        add = min_width - cur_width
        x0 = max(0, x0 - add // 2)
        x1 = min(width, x1 + add - add // 2)
    if cur_height < min_height:
        add = min_height - cur_height
        y0 = max(0, y0 - add // 2)
        y1 = min(height, y1 + add - add // 2)
    return [x0, y0, x1, y1]


def tighten_image(src, dest, padding=34, min_width=180, min_height=95):
    with Image.open(src) as image:
        image = image.convert("RGB")
        bbox = content_bbox(image)
        if bbox is None:
            ensure(dest.parent)
            image.save(dest)
            return {
                "status": "unchanged_blank",
                "oldSize": list(image.size),
                "newSize": list(image.size),
                "contentBBox": None,
                "tightBBox": [0, 0, image.width, image.height],
            }
        tight = expand_bbox(bbox, image.size, padding, min_width, min_height)
        crop = image.crop(tuple(tight))
        ensure(dest.parent)
        crop.save(dest)
        return {
            "status": "tightened" if crop.size != image.size else "unchanged",
            "oldSize": list(image.size),
            "newSize": list(crop.size),
            "contentBBox": bbox,
            "tightBBox": tight,
            "widthReduction": image.width - crop.width,
            "heightReduction": image.height - crop.height,
        }


def relative_to_root(path, root):
    return path.relative_to(root).as_posix()


def make_contact_sheet(items, root, dest):
    tiles = []
    for item in items[:150]:
        crop_path = root / item["cropPath"]
        if not crop_path.exists():
            continue
        try:
            image = Image.open(crop_path).convert("RGB")
        except Exception:
            continue
        image.thumbnail((280, 185))
        tile = Image.new("RGB", (320, 240), "white")
        tile.paste(image, (20, 10))
        draw = ImageDraw.Draw(tile)
        draw.text((10, 200), f"id {item.get('globalQuestionNo')} p{item.get('pageNo')}\n{item.get('cropTightenStatus')}", fill=(0, 0, 0))
        tiles.append(tile)
    if not tiles:
        return False
    cols = 3
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * 320, rows * 240), "white")
    for idx, tile in enumerate(tiles):
        sheet.paste(tile, ((idx % cols) * 320, (idx // cols) * 240))
    ensure(dest.parent)
    sheet.save(dest)
    return True


def zip_dir(src_dir, zip_path):
    if zip_path.exists():
        zip_path.unlink()
    with ZipFile(zip_path, "w", ZIP_DEFLATED) as archive:
        for file in src_dir.rglob("*"):
            if file.is_file():
                archive.write(file, file.relative_to(src_dir).as_posix())


def refresh_pack(root, generated, items):
    review_root = generated / "review_pack" / "by_unit_fresh"
    pack_dirs = [path for path in review_root.iterdir() if path.is_dir()] if review_root.exists() else []
    refreshed = []
    for pack_dir in pack_dirs:
        crop_dir = pack_dir / "question_crop_images"
        if crop_dir.exists():
            shutil.rmtree(crop_dir)
        ensure(crop_dir)
        for item in items:
            src = root / item["cropPath"]
            if src.exists():
                shutil.copyfile(src, crop_dir / Path(item["cropPath"]).name)
        index_path = pack_dir / "crop_index.json"
        if index_path.exists():
            write_json(index_path, [{k: v for k, v in item.items() if k != "cropPathAbs"} for item in items])
        manifest_path = pack_dir / "manifest.json"
        manifest = read_json(manifest_path, {})
        if isinstance(manifest, dict):
            manifest["tightRecropApplied"] = True
            manifest["questionCropCount"] = len(items)
            write_json(manifest_path, manifest)
        zip_path = pack_dir.with_name(f"{pack_dir.name}.zip")
        zip_dir(pack_dir, zip_path)
        refreshed.append({"packDir": pack_dir.name, "zip": relative_to_root(zip_path, root), "questionCropCount": len(items)})
    return refreshed


def tighten_book(root):
    root = Path(root)
    generated = root / "generated"
    report_path = generated / "reports" / "question_crop_map.json"
    data = read_json(report_path, {})
    items = data.get("items", []) if isinstance(data, dict) else []
    tightened = []
    updated_items = []
    for item in items:
        original_rel = item.get("originalCropPath") or item.get("cropPath")
        original_path = root / original_rel
        if not original_path.exists():
            updated_items.append(item)
            continue
        dest = generated / "work" / "question_crops_tight" / item.get("bookPart", "workbook") / item["setKey"] / Path(original_rel).name
        result = tighten_image(original_path, dest)
        new_item = {
            **item,
            "originalCropPath": original_rel,
            "cropPath": relative_to_root(dest, root),
            "cropTightenStatus": result["status"],
            "cropTightenOldSize": result["oldSize"],
            "cropTightenNewSize": result["newSize"],
            "cropTightenBBox": result["tightBBox"],
        }
        updated_items.append(new_item)
        tightened.append({**new_item, "tighten": result})
    write_json(report_path, {"items": updated_items})
    write_json(generated / "reports" / "question_crop_tighten_apply_report.json", {
        "appliedCount": sum(1 for item in tightened if item["tighten"]["status"] == "tightened"),
        "itemCount": len(tightened),
        "items": tightened,
    })
    make_contact_sheet(updated_items, root, generated / "reports" / "contact_sheets_tight" / "question_crop_sheet.png")
    refreshed = refresh_pack(root, generated, updated_items)
    summary = {
        "bookRoot": root.name,
        "cropCount": len(updated_items),
        "tightenedCount": sum(1 for item in tightened if item["tighten"]["status"] == "tightened"),
        "refreshedPackCount": len(refreshed),
        "packs": refreshed,
        "status": "ok" if updated_items else "manual_review",
    }
    write_json(generated / "reports" / "question_crop_tighten_summary.json", summary)
    return summary


def main(argv=None):
    argv = argv or sys.argv[1:]
    base = Path.cwd()
    roots = [Path(arg) for arg in argv] if argv else [base / name for name in LIGHTSSEN_ROOTS]
    summaries = [tighten_book(root) for root in roots]
    write_json(base / "generated" / "reports" / "lightssen_6book_tight_recrop_summary.json", {
        "books": summaries,
        "status": "ok" if all(item["status"] == "ok" for item in summaries) else "manual_review",
    })
    print(json.dumps({"books": summaries}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
