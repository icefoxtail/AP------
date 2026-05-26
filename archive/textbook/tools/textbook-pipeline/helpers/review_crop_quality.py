import json
import math
import sys
from collections import Counter, defaultdict
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import Image, ImageChops, ImageDraw


DEFAULTS = {
    "minFileSizeBytes": 1024,
    "minWidth": 10,
    "minHeight": 10,
    "maxCropHeightRatio": 0.85,
    "minCropHeightRatio": 0.015,
    "contactSheetItemsPerPage": 30,
    "autoRecrop": True,
    "minRecropWidth": 260,
    "minRecropHeight": 60,
    "recropPadding": 16,
}


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


def resolve_crop_path(item, generated_root):
    raw = item.get("cropPathAbs") or item.get("cropPath") or item.get("refinedCropPath")
    if not raw:
        return None
    path = Path(raw)
    if path.is_absolute():
        return path
    if path.exists():
        return path
    material_root = generated_root.parent
    candidate = material_root / raw
    if candidate.exists():
        return candidate
    return generated_root / raw


def path_relative_to_material(path, generated_root):
    material_root = generated_root.parent
    try:
        return path.relative_to(material_root).as_posix()
    except ValueError:
        return path.as_posix()


def resolve_rendered_page_path(item, generated_root):
    raw = item.get("pageImagePath") or item.get("renderedPagePath")
    if raw:
        path = Path(raw)
        if path.is_absolute():
            return path
        material_root = generated_root.parent
        for candidate in [material_root / raw, generated_root / raw]:
            if candidate.exists():
                return candidate
    set_key = item.get("setKey")
    page_no = item.get("pageNo")
    book_part = item.get("bookPart") or "workbook"
    if not set_key or not page_no:
        return None
    page_name = f"page_{int(page_no):03d}.png"
    for candidate in [
        generated_root / "work" / "rendered_pages" / book_part / set_key / page_name,
        generated_root / "work" / "rendered_pages" / "workbook" / set_key / page_name,
        generated_root / "work" / "rendered_pages" / set_key / page_name,
    ]:
        if candidate.exists():
            return candidate
    return None


def is_blank_image(image):
    rgb = image.convert("RGB")
    extrema = ImageChops.invert(rgb).getbbox()
    return extrema is None


def classify_crop(item, generated_root, page_size=None, options=None):
    options = {**DEFAULTS, **(options or {})}
    crop_path = resolve_crop_path(item, generated_root)
    warnings = []
    width = height = file_size = 0
    status = "pass"

    if not crop_path or not crop_path.exists():
        return {
            **item,
            "cropQualityStatus": "corrupted_asset",
            "cropQualityWarnings": ["missing_file"],
            "cropMode": "question_crop",
            "fallbackRecommended": True,
        }

    file_size = crop_path.stat().st_size
    if file_size < options["minFileSizeBytes"]:
        warnings.append("too_small_file")
    try:
        with Image.open(crop_path) as image:
            width, height = image.size
            if width <= options["minWidth"] or height <= options["minHeight"]:
                warnings.append("too_small_dimensions")
            if is_blank_image(image):
                warnings.append("blank_or_white_image")
    except Exception as error:
        return {
            **item,
            "cropQualityStatus": "corrupted_asset",
            "cropQualityWarnings": ["cannot_open_image", str(error)],
            "cropMode": "question_crop",
            "fallbackRecommended": True,
        }

    if "too_small_dimensions" in warnings or "blank_or_white_image" in warnings:
        status = "corrupted_asset"
    elif "too_small_file" in warnings:
        status = "manual_review"

    if page_size:
        _, page_height = page_size
        if page_height:
            ratio = height / page_height
            if ratio > options["maxCropHeightRatio"]:
                warnings.append("too_large_relative_to_page")
            if ratio < options["minCropHeightRatio"]:
                warnings.append("too_small_relative_to_page")
    if status == "pass" and warnings:
        status = "warning"

    return {
        **item,
        "cropQualityStatus": status,
        "cropQualityWarnings": warnings,
        "cropMode": "question_crop",
        "cropPathResolved": str(crop_path),
        "cropFileSize": file_size,
        "cropWidth": width,
        "cropHeight": height,
        "fallbackRecommended": status in ("corrupted_asset", "manual_review"),
    }


def is_recrop_eligible(result, options=None):
    options = {**DEFAULTS, **(options or {})}
    if not options.get("autoRecrop", True):
        return False
    warnings = set(result.get("cropQualityWarnings") or [])
    if not warnings.intersection({"too_small_file", "too_small_dimensions", "blank_or_white_image", "missing_file"}):
        return False
    return bool(result.get("bboxPx") and result.get("setKey") and result.get("pageNo"))


def recrop_from_rendered_page(item, generated_root, options=None):
    options = {**DEFAULTS, **(options or {})}
    page_path = resolve_rendered_page_path(item, generated_root)
    bbox = item.get("bboxPx")
    if not page_path or not page_path.exists() or not isinstance(bbox, list) or len(bbox) != 4:
        return None

    with Image.open(page_path) as page:
        page = page.convert("RGB")
        page_width, page_height = page.size
        x0, y0, x1, y1 = [int(round(value)) for value in bbox]
        pad = int(options["recropPadding"])
        min_width = int(options["minRecropWidth"])
        min_height = int(options["minRecropHeight"])

        width = max(0, x1 - x0)
        height = max(0, y1 - y0)
        if width < min_width:
            x1 = min(page_width, x0 + min_width)
        if height < min_height:
            y1 = min(page_height, y0 + min_height)
        x0 = max(0, x0 - pad)
        y0 = max(0, y0 - pad)
        x1 = min(page_width, x1 + pad)
        y1 = min(page_height, y1 + pad)
        if x1 <= x0 or y1 <= y0:
            return None

        crop = page.crop((x0, y0, x1, y1))
        original_path = resolve_crop_path(item, generated_root)
        file_name = original_path.name if original_path else f"q{item.get('globalQuestionNo') or item.get('id')}.png"
        book_part = item.get("bookPart") or "workbook"
        dest = generated_root / "work" / "question_crops_refined" / book_part / item["setKey"] / file_name
        ensure(dest.parent)
        crop.save(dest)
        dest_abs = dest.resolve()

    refined = {
        **item,
        "originalCropPath": item.get("cropPath"),
        "originalCropPathResolved": str(original_path) if original_path else "",
        "cropPath": path_relative_to_material(dest, generated_root),
        "cropPathAbs": str(dest_abs),
        "refinedCropPath": path_relative_to_material(dest, generated_root),
        "refinedCropPathAbs": str(dest_abs),
        "recropSourcePage": path_relative_to_material(page_path, generated_root),
        "recropBBoxPx": [x0, y0, x1, y1],
        "recropReason": "auto_recrop_from_rendered_page",
    }
    check = classify_crop(refined, generated_root, options=options)
    blocking_warnings = set(check.get("cropQualityWarnings") or []).intersection({
        "too_small_dimensions",
        "blank_or_white_image",
        "missing_file",
        "cannot_open_image",
    })
    if check.get("cropQualityStatus") in ("pass", "warning") or (
        check.get("cropQualityStatus") == "manual_review" and not blocking_warnings
    ):
        return {
            **check,
            "cropQualityStatus": "recrop_applied",
            "fallbackRecommended": False,
        }
    return None


def summarize_quality(results):
    counts = Counter(item.get("cropQualityStatus", "manual_review") for item in results)
    summary = {
        "cropCount": len(results),
        "passCount": counts["pass"],
        "warningCount": counts["warning"],
        "recropCandidateCount": counts["recrop_candidate"],
        "recropAppliedCount": counts["recrop_applied"],
        "pageFallbackCount": counts["page_fallback"],
        "manualReviewCount": counts["manual_review"],
        "corruptedAssetCount": counts["corrupted_asset"],
        "densePageRangeSkipCount": counts["dense_page_range_skip"],
    }
    accepted = summary["passCount"] + summary["warningCount"] + summary["recropAppliedCount"]
    unresolved = (
        summary["recropCandidateCount"]
        + summary["manualReviewCount"]
        + summary["corruptedAssetCount"]
        + summary["densePageRangeSkipCount"]
    )
    summary["status"] = "pass" if summary["cropCount"] and accepted == summary["cropCount"] and unresolved == 0 else "partial"
    if summary["corruptedAssetCount"] and not summary["pageFallbackCount"]:
        summary["status"] = "partial"
    return summary


def make_contact_sheet(items, dest, title="crop quality", per_page=30):
    ensure(dest.parent)
    tiles = []
    for item in items:
        crop_path = Path(item.get("cropPathResolved") or "")
        if not crop_path.exists():
            continue
        try:
            image = Image.open(crop_path).convert("RGB")
        except Exception:
            continue
        image.thumbnail((260, 170))
        tile = Image.new("RGB", (320, 235), "white")
        tile.paste(image, (30, 8))
        draw = ImageDraw.Draw(tile)
        label = (
            f"id {item.get('globalQuestionNo') or item.get('id') or item.get('jsIdCandidate')} "
            f"disp {item.get('displayNo')} p{item.get('pageNo')}\n"
            f"{item.get('cropQualityStatus')} {','.join(item.get('cropQualityWarnings', [])[:2])}"
        )
        draw.text((8, 185), label, fill=(0, 0, 0))
        tiles.append(tile)
    if not tiles:
        return False
    cols = 3
    rows = math.ceil(len(tiles) / cols)
    sheet = Image.new("RGB", (cols * 320, rows * 235 + 30), "white")
    draw = ImageDraw.Draw(sheet)
    draw.text((8, 8), title, fill=(0, 0, 0))
    for idx, tile in enumerate(tiles):
        sheet.paste(tile, ((idx % cols) * 320, 30 + (idx // cols) * 235))
    sheet.save(dest)
    return True


def zip_dir(src_dir, zip_path):
    if zip_path.exists():
        zip_path.unlink()
    ensure(zip_path.parent)
    with ZipFile(zip_path, "w", ZIP_DEFLATED) as archive:
        for file in src_dir.rglob("*"):
            if file.is_file():
                archive.write(file, file.relative_to(src_dir).as_posix())


def refresh_fresh_packs(generated_root, recrop_items):
    if not recrop_items:
        return {"refreshedPackCount": 0, "items": []}
    by_identity = {
        (item.get("setKey"), item.get("globalQuestionNo") or item.get("id") or item.get("jsIdCandidate")): item
        for item in recrop_items
    }
    review_root = generated_root / "review_pack" / "by_unit_fresh"
    if not review_root.exists():
        return {"refreshedPackCount": 0, "items": []}

    refreshed = []
    for pack_dir in [path for path in review_root.iterdir() if path.is_dir()]:
        index_path = pack_dir / "crop_index.json"
        index = read_json(index_path)
        if not isinstance(index, list):
            continue
        changed = []
        for entry in index:
            identity = (entry.get("setKey"), entry.get("globalQuestionNo") or entry.get("id") or entry.get("jsIdCandidate"))
            recrop = by_identity.get(identity)
            if not recrop:
                continue
            src = Path(recrop.get("refinedCropPathAbs") or "")
            if not src.exists():
                continue
            crop_dir = pack_dir / "question_crop_images"
            ensure(crop_dir)
            shutil_name = src.name
            dest = crop_dir / shutil_name
            dest.write_bytes(src.read_bytes())
            entry["originalCropPath"] = recrop.get("originalCropPath")
            entry["cropPath"] = recrop.get("refinedCropPath")
            entry["refinedCropPath"] = recrop.get("refinedCropPath")
            entry["cropQualityStatus"] = "recrop_applied"
            entry["recropReason"] = recrop.get("recropReason")
            changed.append(identity)
        if not changed:
            continue
        write_json(index_path, index)
        manifest_path = pack_dir / "manifest.json"
        manifest = read_json(manifest_path, {})
        if isinstance(manifest, dict):
            manifest["recropAppliedCount"] = int(manifest.get("recropAppliedCount") or 0) + len(changed)
            manifest["status"] = "pending_content_input_recrop_refreshed"
            write_json(manifest_path, manifest)
        zip_path = pack_dir.with_name(f"{pack_dir.name}_fresh.zip")
        zip_dir(pack_dir, zip_path)
        refreshed.append({
            "unitKey": pack_dir.name,
            "zip": path_relative_to_material(zip_path, generated_root),
            "recropAppliedCount": len(changed),
        })
    return {"refreshedPackCount": len(refreshed), "items": refreshed}


def load_crop_items(generated_root):
    reports = generated_root / "reports"
    for name in ["question_crop_map.json", "rpm_question_crop_map.json", "text1_question_crop_map.json"]:
        data = read_json(reports / name)
        if isinstance(data, dict) and isinstance(data.get("items"), list):
            return data["items"], name
        if isinstance(data, list):
            return data, name
    return [], ""


def review_generated_root(generated_root, options=None):
    generated_root = Path(generated_root)
    reports = generated_root / "reports"
    items, source_report = load_crop_items(generated_root)
    page_sizes = {}
    results = []
    for item in items:
        page_size = None
        if item.get("cropSize"):
            page_size = None
        result = classify_crop(item, generated_root, page_size=page_size, options=options)
        if is_recrop_eligible(result, options=options):
            recropped = recrop_from_rendered_page(result, generated_root, options=options)
            if recropped:
                result = recropped
            else:
                result = {
                    **result,
                    "cropQualityStatus": "recrop_candidate",
                    "fallbackRecommended": True,
                }
        results.append(result)
    summary = summarize_quality(results)
    by_set = defaultdict(list)
    for item in results:
        by_set[item.get("setKey", "unknown")].append(item)

    contact_index = []
    for set_key, set_items in by_set.items():
        interesting = [item for item in set_items if item.get("cropQualityStatus") != "pass"] or set_items[: min(30, len(set_items))]
        safe_set_key = "".join(ch if ch not in '<>:"/\\|?*' else "_" for ch in set_key)
        dest = generated_root / "work" / "contact_sheets" / "question_crop_quality" / safe_set_key / "sheet_001.png"
        made = make_contact_sheet(interesting, dest, title=f"{set_key} crop quality")
        if made:
            contact_index.append({
                "setKey": set_key,
                "sheet": dest.relative_to(generated_root).as_posix(),
                "itemCount": len(interesting),
            })

    recrop_candidates = [item for item in results if item.get("cropQualityStatus") == "recrop_candidate"]
    recrop_applied = [item for item in results if item.get("cropQualityStatus") == "recrop_applied"]
    manual = [item for item in results if item.get("cropQualityStatus") in ("manual_review", "corrupted_asset", "warning", "recrop_candidate")]
    page_fallback = [item for item in results if item.get("fallbackRecommended")]
    pack_refresh_report = refresh_fresh_packs(generated_root, recrop_applied)

    write_json(reports / "question_crop_quality_report.json", {"sourceReport": source_report, "items": results})
    write_json(reports / "question_crop_recrop_candidates.json", recrop_candidates)
    write_json(reports / "question_crop_recrop_apply_report.json", {
        "appliedCount": len(recrop_applied),
        "items": recrop_applied,
        "freshPackRefresh": pack_refresh_report,
    })
    write_json(reports / "question_crop_page_fallback_report.json", page_fallback)
    write_json(reports / "question_crop_manual_review_required.json", manual)
    write_json(reports / "question_crop_quality_contact_sheet_index.json", contact_index)
    write_json(reports / "question_crop_quality_summary.json", {**summary, "sourceReport": source_report, "contactSheetCount": len(contact_index)})
    write_json(reports / "question_crop_quality_validation.json", {
        "sourceReport": source_report,
        "cropCount": len(results),
        "hasQualityReport": True,
        "hasContactSheets": bool(contact_index),
        "status": "ok" if results and contact_index else "manual_review",
    })
    return {**summary, "sourceReport": source_report, "contactSheetCount": len(contact_index)}


def main(argv=None):
    argv = argv or sys.argv[1:]
    if not argv:
        raise SystemExit("usage: review_crop_quality.py <generatedRoot>")
    result = review_generated_root(Path(argv[0]))
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
