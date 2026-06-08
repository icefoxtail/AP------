#!/usr/bin/env python3
import argparse
import json
import math
import re
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageStat


QUESTION_BANK_RE = re.compile(
    r"window\.questionBank\s*=\s*(\[[\s\S]*?\])\s*;",
    re.MULTILINE,
)
EXAM_TITLE_RE = re.compile(r"window\.examTitle\s*=\s*(\"(?:\\.|[^\"])*\")\s*;")
EXAM_META_RE = re.compile(r"window\.examMeta\s*=\s*(\{[\s\S]*?\})\s*;")
CROP_RE = re.compile(
    r"page_(\d+)\s+crop:\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)",
    re.IGNORECASE,
)


def safe_name(value):
    return re.sub(r'[\\/:*?"<>|]', "_", str(value or "untitled")).strip() or "untitled"


def load_js(js_path):
    text = js_path.read_text(encoding="utf-8")
    title_match = EXAM_TITLE_RE.search(text)
    meta_match = EXAM_META_RE.search(text)
    bank_match = QUESTION_BANK_RE.search(text)
    if not title_match or not bank_match:
        raise ValueError(f"cannot parse JS globals: {js_path}")
    title = json.loads(title_match.group(1))
    meta = json.loads(meta_match.group(1)) if meta_match else {}
    bank = json.loads(bank_match.group(1))
    return text, title, meta, bank


def write_js(js_path, title, meta, bank):
    body = [
        f"window.examTitle = {json.dumps(title, ensure_ascii=False)};",
        f"window.examMeta = {json.dumps(meta, ensure_ascii=False, indent=2)};",
        f"window.questionBank = {json.dumps(bank, ensure_ascii=False, indent=2)};",
        "",
    ]
    js_path.write_text("\n".join(body), encoding="utf-8")


def parse_crop_target(value):
    match = CROP_RE.search(str(value or ""))
    if not match:
        return None
    page_no = int(match.group(1))
    coords = [int(round(float(match.group(i)))) for i in range(2, 6)]
    x1, y1, x2, y2 = coords
    if x2 < x1:
        x1, x2 = x2, x1
    if y2 < y1:
        y1, y2 = y2, y1
    return {"pageNo": page_no, "bbox": [x1, y1, x2, y2]}


def resolve_fullpage(workspace, source, page_no):
    candidates = []
    raw = str((source or {}).get("fullpage") or "")
    if raw:
        p = Path(raw)
        candidates.append(p if p.is_absolute() else workspace / p)
    candidates.extend(workspace.glob(f"archive/textbook/*/generated/work/rendered_pages/workbook/*/page_{page_no:03d}.png"))
    candidates.extend(workspace.glob(f"archive/textbook/*/generated/work/rendered_pages/**/*page_{page_no:03d}.png"))
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def clamp_bbox(bbox, width, height, padding):
    x1, y1, x2, y2 = bbox
    x1 = max(0, x1 - padding)
    y1 = max(0, y1 - padding)
    x2 = min(width, x2 + padding)
    y2 = min(height, y2 + padding)
    if x2 <= x1 or y2 <= y1:
        return None
    return [x1, y1, x2, y2]


def image_stats(image):
    gray = image.convert("L")
    stat = ImageStat.Stat(gray)
    extrema = gray.getextrema()
    bg = Image.new("L", gray.size, 255)
    diff = ImageChops.difference(gray, bg)
    nonwhite = sum(1 for v in diff.getdata() if v > 12)
    area = max(1, gray.size[0] * gray.size[1])
    return {
        "width": image.size[0],
        "height": image.size[1],
        "fileArea": area,
        "mean": round(stat.mean[0], 2),
        "stddev": round(stat.stddev[0], 2),
        "min": extrema[0],
        "max": extrema[1],
        "nonWhiteRatio": round(nonwhite / area, 5),
    }


def quality_flags(stats):
    flags = []
    if stats["width"] < 40 or stats["height"] < 30:
        flags.append("too_small")
    if stats["nonWhiteRatio"] < 0.003:
        flags.append("nearly_blank")
    if stats["stddev"] < 4:
        flags.append("low_variance")
    if stats["width"] > 1200 or stats["height"] > 900:
        flags.append("very_large")
    return flags


def asset_path_for(assets_root, title, display_no):
    folder = assets_root / safe_name(title)
    folder.mkdir(parents=True, exist_ok=True)
    return folder / f"q{display_no}.png"


def rel_asset_path(workspace, asset_path):
    try:
        rel = asset_path.relative_to(workspace / "archive")
        return str(rel).replace("\\", "/")
    except ValueError:
        return str(asset_path).replace("\\", "/")


def make_contact_sheets(items, report_dir, per_sheet=30, thumb_w=220, thumb_h=160):
    sheets = []
    font = ImageFont.load_default()
    for sheet_index in range(math.ceil(len(items) / per_sheet)):
        chunk = items[sheet_index * per_sheet : (sheet_index + 1) * per_sheet]
        if not chunk:
            continue
        cols = 5
        rows = math.ceil(len(chunk) / cols)
        cell_w = thumb_w + 28
        cell_h = thumb_h + 54
        sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), "white")
        draw = ImageDraw.Draw(sheet)
        for idx, item in enumerate(chunk):
            x = (idx % cols) * cell_w
            y = (idx // cols) * cell_h
            draw.rectangle([x, y, x + cell_w - 1, y + cell_h - 1], outline=(210, 210, 210))
            label = f"{item.get('displayNo')} p{item.get('pageNo')} {item.get('width')}x{item.get('height')}"
            if item.get("flags"):
                label += " " + ",".join(item["flags"])
            draw.text((x + 6, y + 5), label, fill=(0, 0, 0), font=font)
            path = item.get("assetAbsPath")
            if not path or not Path(path).exists():
                draw.text((x + 6, y + 28), "missing", fill=(180, 0, 0), font=font)
                continue
            with Image.open(path) as im:
                im = im.convert("RGB")
                im.thumbnail((thumb_w, thumb_h), Image.LANCZOS)
                ox = x + 6 + (thumb_w - im.size[0]) // 2
                oy = y + 28 + (thumb_h - im.size[1]) // 2
                sheet.paste(im, (ox, oy))
        out = report_dir / f"marker_crop_contact_sheet_{sheet_index + 1:02d}.jpg"
        sheet.save(out, quality=92)
        sheets.append(str(out))
    return sheets


def process(js_dir, workspace, assets_root, report_dir, padding):
    report_dir.mkdir(parents=True, exist_ok=True)
    items = []
    missing_markers = []
    errors = []
    updated_files = []

    for js_path in sorted(Path(js_dir).glob("*.js")):
        text, title, meta, bank = load_js(js_path)
        changed = False
        for q in bank:
            tags = q.get("tags") if isinstance(q.get("tags"), list) else []
            if "IMAGE_NEEDED" not in tags:
                continue
            display_no = str(q.get("displayNo") or q.get("id") or "").strip()
            source = q.get("source") if isinstance(q.get("source"), dict) else {}
            parsed = parse_crop_target(source.get("cropTarget"))
            if not parsed:
                missing_markers.append({
                    "jsFile": str(js_path),
                    "examTitle": title,
                    "displayNo": display_no,
                    "reason": "IMAGE_NEEDED_without_cropTarget",
                })
                continue
            page_no = parsed["pageNo"]
            fullpage = resolve_fullpage(workspace, source, page_no)
            if not fullpage:
                errors.append({
                    "jsFile": str(js_path),
                    "examTitle": title,
                    "displayNo": display_no,
                    "pageNo": page_no,
                    "reason": "fullpage_missing",
                })
                continue
            with Image.open(fullpage) as page:
                page = page.convert("RGB")
                bbox = clamp_bbox(parsed["bbox"], page.size[0], page.size[1], padding)
                if not bbox:
                    errors.append({
                        "jsFile": str(js_path),
                        "examTitle": title,
                        "displayNo": display_no,
                        "pageNo": page_no,
                        "bbox": parsed["bbox"],
                        "reason": "invalid_bbox",
                    })
                    continue
                crop = page.crop(tuple(bbox))
                out_path = asset_path_for(Path(assets_root), title, display_no)
                crop.save(out_path)
            stats = image_stats(crop)
            flags = quality_flags(stats)
            q["image"] = rel_asset_path(workspace, out_path)
            if "MARKER_CROPPED" not in tags:
                tags.append("MARKER_CROPPED")
            q["tags"] = tags
            source["cropBBoxPx"] = bbox
            source["assetPath"] = q["image"]
            q["source"] = source
            changed = True
            items.append({
                "jsFile": str(js_path),
                "examTitle": title,
                "displayNo": display_no,
                "pageNo": page_no,
                "fullpage": str(fullpage),
                "bbox": bbox,
                "assetPath": q["image"],
                "assetAbsPath": str(out_path),
                "flags": flags,
                **stats,
            })
        if changed:
            write_js(js_path, title, meta, bank)
            updated_files.append(str(js_path))

    contact_sheets = make_contact_sheets(items, report_dir)
    by_flag = {}
    for item in items:
        for flag in item["flags"]:
            by_flag[flag] = by_flag.get(flag, 0) + 1
    report = {
        "stage": "marker-visual-asset-crop",
        "createdAt": datetime.now().isoformat(timespec="seconds"),
        "jsDir": str(js_dir),
        "assetsRoot": str(assets_root),
        "reportDir": str(report_dir),
        "paddingPx": padding,
        "croppedCount": len(items),
        "missingMarkerCount": len(missing_markers),
        "errorCount": len(errors),
        "flagCounts": by_flag,
        "updatedFiles": updated_files,
        "contactSheets": contact_sheets,
        "items": items,
        "missingMarkers": missing_markers,
        "errors": errors,
    }
    (report_dir / "marker_crop_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return report


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--workspace", required=True)
    parser.add_argument("--js-dir", required=True)
    parser.add_argument("--assets-root", required=True)
    parser.add_argument("--report-dir", required=True)
    parser.add_argument("--padding", type=int, default=8)
    args = parser.parse_args()
    report = process(
        Path(args.js_dir),
        Path(args.workspace),
        Path(args.assets_root),
        Path(args.report_dir),
        args.padding,
    )
    print(json.dumps({
        "croppedCount": report["croppedCount"],
        "missingMarkerCount": report["missingMarkerCount"],
        "errorCount": report["errorCount"],
        "flagCounts": report["flagCounts"],
        "report": str(Path(args.report_dir) / "marker_crop_report.json"),
        "contactSheets": report["contactSheets"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
