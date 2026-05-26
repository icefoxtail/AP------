import argparse
import json
import math
import shutil
from collections import Counter, defaultdict
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import Image, ImageChops, ImageDraw, ImageStat


MAP_CANDIDATES = [
    "question_crop_map.json",
    "visang2_question_crop_map.json",
    "miraen_question_crop_map.json",
    "miraen2_question_crop_map.json",
    "donga_question_crop_map.json",
    "text1_question_crop_map.json",
    "question_crop_id_map_cases.json",
]


DEFAULTS = {
    "minFileSizeBytes": 1024,
    "minWidth": 10,
    "minHeight": 10,
    "maxCropHeightRatio": 0.85,
    "minCropHeightRatio": 0.015,
    "bottomMarginWarningRatio": 0.05,
    "contactSheetItemsPerPage": 30,
}


def ensure(path):
    path.mkdir(parents=True, exist_ok=True)


def read_json(path, default=None):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def write_json(path, data):
    ensure(path.parent)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def find_map(generated_root):
    reports = generated_root / "reports"
    for name in MAP_CANDIDATES:
        path = reports / name
        data = read_json(path)
        if isinstance(data, dict) and isinstance(data.get("items"), list):
            return path, data["items"]
        if isinstance(data, list):
            return path, data
    return None, []


def resolve_crop_path(material_root, generated_root, item):
    candidates = []
    for key in ("refinedCropPath", "cropPath", "rawCropPath", "finalCropPath", "outputFile"):
        value = item.get(key)
        if value:
            p = Path(value)
            if p.is_absolute():
                candidates.append(p)
            else:
                candidates.append(material_root / p)
                candidates.append(generated_root / p)
    crop_file = item.get("cropFile") or item.get("rawCropFile") or item.get("finalCropFile")
    set_key = item.get("setKey")
    book_part = item.get("bookPart", "textbook")
    if crop_file and set_key:
        candidates.append(generated_root / "work" / "question_crops" / book_part / set_key / crop_file)
    for path in candidates:
        if path.exists():
            return path
    return candidates[0] if candidates else None


def resolve_page_path(material_root, generated_root, item):
    set_key = item.get("setKey")
    book_part = item.get("bookPart", "textbook")
    page_no = item.get("pageNo")
    if not set_key or not page_no:
        return None
    candidates = [
        generated_root / "work" / "page_crops" / book_part / set_key / f"page{page_no}.png",
        generated_root / "work" / "rendered_pages" / book_part / set_key / f"page{page_no}.png",
        material_root / "generated" / "work" / "page_crops" / book_part / set_key / f"page{page_no}.png",
    ]
    for path in candidates:
        if path.exists():
            return path
    return None


def image_is_blank(im):
    rgb = im.convert("RGB")
    stat = ImageStat.Stat(rgb)
    if min(stat.mean) > 252 and max(stat.stddev) < 1.2:
        return True
    bg = Image.new("RGB", rgb.size, "white")
    diff = ImageChops.difference(rgb, bg)
    bbox = diff.getbbox()
    return bbox is None


def edge_activity(im, ratio, edge):
    rgb = im.convert("L")
    w, h = rgb.size
    band_h = max(1, int(h * ratio))
    if edge == "bottom":
        band = rgb.crop((0, h - band_h, w, h))
    else:
        band = rgb.crop((0, 0, w, band_h))
    inv = ImageChops.invert(band)
    stat = ImageStat.Stat(inv)
    return stat.mean[0]


def classify(item, crop_path, page_path):
    warnings = []
    status = "pass"
    width = height = 0
    file_size = 0
    page_size = None

    if crop_path is None or not crop_path.exists():
        return {
            "cropQualityStatus": "corrupted_asset",
            "cropQualityWarnings": ["missing_file"],
            "width": 0,
            "height": 0,
            "fileSizeBytes": 0,
            "pageSize": None,
        }

    file_size = crop_path.stat().st_size
    try:
        with Image.open(crop_path) as im:
            im.load()
            width, height = im.size
            if file_size < DEFAULTS["minFileSizeBytes"]:
                warnings.append("file_size_below_1kb")
            if width <= DEFAULTS["minWidth"] or height <= DEFAULTS["minHeight"]:
                warnings.append("too_small_dimensions")
            if image_is_blank(im):
                warnings.append("blank_or_nearly_blank")
            if edge_activity(im, DEFAULTS["bottomMarginWarningRatio"], "bottom") > 4.5:
                warnings.append("bottom_edge_content_near_boundary")
            if edge_activity(im, 0.03, "top") > 10 and height < 180:
                warnings.append("top_edge_tight")
    except Exception as exc:
        return {
            "cropQualityStatus": "corrupted_asset",
            "cropQualityWarnings": [f"image_open_failed:{type(exc).__name__}"],
            "width": width,
            "height": height,
            "fileSizeBytes": file_size,
            "pageSize": None,
        }

    if page_path and page_path.exists():
        try:
            with Image.open(page_path) as page_im:
                page_size = list(page_im.size)
                ratio = height / max(1, page_im.size[1])
                if ratio < DEFAULTS["minCropHeightRatio"]:
                    warnings.append("too_small_relative_to_page")
                if ratio > DEFAULTS["maxCropHeightRatio"]:
                    warnings.append("too_large_relative_to_page")
        except Exception:
            warnings.append("page_image_open_failed")

    note = str(item.get("note", ""))
    if "scanned page visual marker" in note:
        warnings.append("scanned_visual_marker_manual_review_recommended")

    if any(w in warnings for w in ("missing_file", "too_small_dimensions", "blank_or_nearly_blank", "file_size_below_1kb")):
        status = "corrupted_asset"
    elif any(w in warnings for w in ("too_large_relative_to_page", "too_small_relative_to_page")):
        status = "manual_review"
    elif warnings:
        status = "warning"

    return {
        "cropQualityStatus": status,
        "cropQualityWarnings": sorted(set(warnings)),
        "width": width,
        "height": height,
        "fileSizeBytes": file_size,
        "pageSize": page_size,
    }


def make_contact_sheets(items, material_root, generated_root):
    index = []
    by_set = defaultdict(list)
    for item in items:
        by_set[item.get("setKey", "_unknown")].append(item)

    base = generated_root / "work" / "contact_sheets" / "question_crop_quality"
    for set_key, rows in by_set.items():
        chunks = [rows[i : i + DEFAULTS["contactSheetItemsPerPage"]] for i in range(0, len(rows), DEFAULTS["contactSheetItemsPerPage"])]
        for sheet_idx, chunk in enumerate(chunks, start=1):
            tiles = []
            for row in chunk:
                crop_path = Path(row["resolvedCropPath"]) if row.get("resolvedCropPath") else None
                if crop_path and crop_path.exists():
                    try:
                        im = Image.open(crop_path).convert("RGB")
                    except Exception:
                        im = Image.new("RGB", (260, 180), "white")
                else:
                    im = Image.new("RGB", (260, 180), "white")
                im.thumbnail((280, 170))
                tile = Image.new("RGB", (320, 245), "white")
                tile.paste(im, (20, 8))
                d = ImageDraw.Draw(tile)
                label = (
                    f"{set_key}\n"
                    f"p{row.get('pageNo')} q{row.get('displayNo')} id{row.get('jsIdCandidate') or row.get('id')}\n"
                    f"{row.get('cropQualityStatus')} {row.get('confidence', '')}\n"
                    f"{','.join(row.get('cropQualityWarnings', [])[:2])}"
                )
                d.text((8, 184), label, fill=(0, 0, 0))
                tiles.append(tile)
            cols = 3
            sheet = Image.new("RGB", (cols * 320, math.ceil(len(tiles) / cols) * 245), "white")
            for i, tile in enumerate(tiles):
                sheet.paste(tile, ((i % cols) * 320, (i // cols) * 245))
            dest = base / set_key / f"sheet_{sheet_idx:03d}.png"
            ensure(dest.parent)
            sheet.save(dest)
            index.append({
                "setKey": set_key,
                "sheetFile": str(dest.relative_to(generated_root)).replace("\\", "/"),
                "itemCount": len(chunk),
                "statuses": dict(Counter(r.get("cropQualityStatus") for r in chunk)),
            })
    return index


def summarize(rows):
    counts = Counter(row["cropQualityStatus"] for row in rows)
    return {
        "total": len(rows),
        "passCount": counts.get("pass", 0),
        "warningCount": counts.get("warning", 0),
        "recropCandidateCount": counts.get("recrop_candidate", 0),
        "recropAppliedCount": counts.get("recrop_applied", 0),
        "pageFallbackCount": counts.get("page_fallback", 0),
        "manualReviewCount": counts.get("manual_review", 0),
        "densePageRangeSkipCount": counts.get("dense_page_range_skip", 0),
        "corruptedAssetCount": counts.get("corrupted_asset", 0),
        "status": "pass" if counts.get("corrupted_asset", 0) == 0 and counts.get("manual_review", 0) == 0 else "partial",
    }


def add_quality_to_packs(generated_root, quality_rows, contact_index):
    by_unit_dir = generated_root / "review_pack" / "by_unit_fresh"
    if not by_unit_dir.exists():
        return []

    rows_by_set = defaultdict(list)
    for row in quality_rows:
        rows_by_set[row.get("setKey")].append(row)
    contact_by_set = defaultdict(list)
    for row in contact_index:
        contact_by_set[row["setKey"]].append(row)

    updated = []
    for pack_dir in by_unit_dir.iterdir():
        if not pack_dir.is_dir():
            continue
        js_dir = pack_dir / "js"
        set_keys = [p.stem for p in js_dir.glob("*.js")] if js_dir.exists() else []
        pack_rows = []
        for key in set_keys:
            pack_rows.extend(rows_by_set.get(key, []))
        quality_dir = pack_dir / "crop_quality"
        ensure(quality_dir)
        write_json(quality_dir / "question_crop_quality_report.json", {"items": pack_rows})
        write_json(quality_dir / "question_crop_quality_summary.json", summarize(pack_rows))
        write_json(quality_dir / "question_crop_quality_contact_sheet_index.json", {"items": [c for key in set_keys for c in contact_by_set.get(key, [])]})
        for key in set_keys:
            for c in contact_by_set.get(key, []):
                src = generated_root / c["sheetFile"]
                if src.exists():
                    dest = quality_dir / "contact_sheets" / key / Path(c["sheetFile"]).name
                    ensure(dest.parent)
                    shutil.copy2(src, dest)
        (pack_dir / "input_instruction.md").write_text(
            "## Crop 품질 주의\n\n"
            "이 input pack에는 cropQualityStatus가 warning, page_fallback, crop_issue, manual_review인 문항이 포함될 수 있습니다.\n\n"
            "- pass: 그대로 전사 가능\n"
            "- warning: 전사 전 crop 경계를 확인\n"
            "- page_fallback: page image에서 해당 번호를 찾아 전사\n"
            "- crop_issue: 전사 전 사람이 확인\n"
            "- manual_review: 자동 전사 금지, 별도 확인 필요\n",
            encoding="utf-8",
        )
        zip_path = pack_dir.with_name(pack_dir.name + "_fresh.zip")
        if zip_path.exists():
            zip_path.unlink()
        with ZipFile(zip_path, "w", ZIP_DEFLATED) as zf:
            for file in pack_dir.rglob("*"):
                if file.is_file():
                    zf.write(file, file.relative_to(pack_dir).as_posix())
        updated.append(str(zip_path.relative_to(generated_root)).replace("\\", "/"))
    return updated


def review_material(material_root):
    generated_root = material_root / "generated"
    map_path, items = find_map(generated_root)
    if not items:
        return {"materialRoot": str(material_root), "status": "skipped", "reason": "crop_map_not_found"}

    quality_rows = []
    page_fallback_rows = []
    manual_rows = []
    corrupted_rows = []
    warnings_rows = []
    recrop_candidates = []
    recrop_apply = []

    for item in items:
        row = dict(item)
        crop_path = resolve_crop_path(material_root, generated_root, row)
        page_path = resolve_page_path(material_root, generated_root, row)
        result = classify(row, crop_path, page_path)
        row.update(result)
        row["resolvedCropPath"] = str(crop_path) if crop_path else ""
        row["resolvedPagePath"] = str(page_path) if page_path else ""
        row["cropMode"] = "question_crop"
        if row["cropQualityStatus"] == "corrupted_asset":
            row["fallbackSourcePath"] = str(page_path) if page_path else ""
            row["cropMode"] = "page_fallback" if page_path else "missing"
            page_fallback_rows.append(row)
            corrupted_rows.append(row)
        elif row["cropQualityStatus"] == "manual_review":
            manual_rows.append(row)
        elif row["cropQualityStatus"] == "warning":
            warnings_rows.append(row)
        quality_rows.append(row)

    contact_index = make_contact_sheets(quality_rows, material_root, generated_root)
    summary = summarize(quality_rows)
    validation = {
        "questionCropQualityReportExists": True,
        "corruptedAssetCount": summary["corruptedAssetCount"],
        "recropCandidateCount": summary["recropCandidateCount"],
        "recropAppliedCount": summary["recropAppliedCount"],
        "pageFallbackCount": summary["pageFallbackCount"],
        "manualReviewCount": summary["manualReviewCount"],
        "passCount": summary["passCount"],
        "warningCount": summary["warningCount"],
        "contactSheetCount": len(contact_index),
        "status": "pass" if summary["corruptedAssetCount"] == 0 else "partial",
    }

    reports = generated_root / "reports"
    write_json(reports / "question_crop_quality_report.json", {"sourceMap": str(map_path.relative_to(generated_root)).replace("\\", "/"), "items": quality_rows})
    write_json(reports / "question_crop_recrop_candidates.json", recrop_candidates)
    write_json(reports / "question_crop_recrop_apply_report.json", recrop_apply)
    write_json(reports / "question_crop_page_fallback_report.json", page_fallback_rows)
    write_json(reports / "question_crop_manual_review_required.json", manual_rows)
    write_json(reports / "question_crop_quality_summary.json", summary)
    write_json(reports / "question_crop_quality_validation.json", validation)
    write_json(reports / "question_crop_quality_contact_sheet_index.json", {"items": contact_index})
    write_json(reports / "question_crop_too_small_report.json", [r for r in quality_rows if any("too_small" in w for w in r.get("cropQualityWarnings", []))])
    write_json(reports / "question_crop_too_large_report.json", [r for r in quality_rows if "too_large_relative_to_page" in r.get("cropQualityWarnings", [])])
    write_json(reports / "question_crop_bottom_cut_suspect_report.json", [r for r in quality_rows if "bottom_edge_content_near_boundary" in r.get("cropQualityWarnings", [])])
    updated_packs = add_quality_to_packs(generated_root, quality_rows, contact_index)

    result = {
        "materialRoot": str(material_root),
        "status": validation["status"],
        "sourceMap": str(map_path),
        "summary": summary,
        "validation": validation,
        "updatedPacks": updated_packs,
    }
    result_md = material_root / "CODEX_RESULT.md"
    with result_md.open("a", encoding="utf-8") as f:
        f.write(
            "\n## Round: crop quality review\n\n"
            f"- crop quality review 실행 여부: true\n"
            f"- 대상 crop 수: {summary['total']}\n"
            f"- pass 수: {summary['passCount']}\n"
            f"- warning 수: {summary['warningCount']}\n"
            f"- recrop_candidate 수: {summary['recropCandidateCount']}\n"
            f"- recrop_applied 수: {summary['recropAppliedCount']}\n"
            f"- page_fallback 수: {summary['pageFallbackCount']}\n"
            f"- manual_review 수: {summary['manualReviewCount']}\n"
            f"- corrupted_asset 수: {summary['corruptedAssetCount']}\n"
            f"- contact sheet 수: {len(contact_index)}\n"
            f"- question_crop_quality_report: `generated/reports/question_crop_quality_report.json`\n"
            f"- question_crop_manual_review_required: `generated/reports/question_crop_manual_review_required.json`\n"
            f"- validation 판정: {validation['status']}\n"
        )
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--material", action="append")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if args.material:
        materials = [root / m for m in args.material]
    else:
        materials = [
            p for p in root.iterdir()
            if p.is_dir() and (p / "generated").exists() and ("교과서" in p.name)
        ]
    results = [review_material(m) for m in materials]
    write_json(root / "generated" / "reports" / "textbook_crop_quality_review_all_summary.json", {"items": results})
    print(json.dumps({"items": results}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
