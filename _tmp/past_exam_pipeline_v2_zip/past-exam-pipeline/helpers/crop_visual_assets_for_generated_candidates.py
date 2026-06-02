import argparse
import json
import math
import re
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw


VISUAL_TERMS = [
    "그림",
    "그래프",
    "도형",
    "표",
    "좌표평면",
    "좌표축",
    "다음 그림",
    "아래 그림",
    "오른쪽 그림",
    "洹몃┝",
    "洹몃옒",
    "醫뚰몴",
    "醫뚰몴?됰㈃",
    "吏곸꽑",
    "?꾪삎",
    "figure",
    "graph",
    "diagram",
    "table",
    "coordinate",
]
VISUAL_RE = re.compile("|".join(re.escape(term) for term in VISUAL_TERMS), re.I)


def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def read_questions(candidate):
    text = candidate.read_text(encoding="utf-8")
    match = re.search(r"window\.questionBank\s*=\s*(\[.*?\]);?\s*$", text, re.S)
    if not match:
        raise ValueError("window.questionBank array not found")
    return text, json.loads(match.group(1))


def write_candidate(candidate, text, questions):
    payload = json.dumps(questions, ensure_ascii=False, indent=2)
    updated = re.sub(
        r"window\.questionBank\s*=\s*\[.*?\];?\s*$",
        lambda _match: f"window.questionBank = {payload};\n",
        text,
        flags=re.S,
    )
    candidate.write_text(updated, encoding="utf-8")


def is_visual_needed(question):
    tags = " ".join(str(x) for x in question.get("tags") or [])
    combined = "\n".join(
        [
            str(question.get("content") or ""),
            tags,
            *[str(x) for x in question.get("choices") or []],
        ]
    )
    if VISUAL_RE.search(combined):
        return True
    return False


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
    found = []
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
            found.append((minx, miny, maxx + 1, maxy + 1, count))
    return found


def score_bbox(bbox, image_size):
    x0, y0, x1, y1, count = bbox
    w = x1 - x0
    h = y1 - y0
    iw, ih = image_size
    area = w * h
    if w < 36 or h < 30:
        return -1
    if area > iw * ih * 0.68:
        return -1
    if h < 42 and w > 180:
        return -1
    density = count / max(area, 1)
    right_bonus = 1.35 if x0 > iw * 0.38 else 1.0
    lower_bonus = 1.12 if y0 > ih * 0.18 else 1.0
    compact_bonus = 1.08 if area < iw * ih * 0.4 else 1.0
    return area * (0.55 + min(density * 3.2, 1.3)) * right_bonus * lower_bonus * compact_bonus


def choose_visual_bbox(image):
    mask, scale = build_mask(image, scale=3)
    mask = dilate(mask, radius=3)
    iw, ih = image.size
    scaled = []
    for x0, y0, x1, y1, count in components(mask):
        scaled.append(
            (
                max(0, x0 * scale),
                max(0, y0 * scale),
                min(iw, x1 * scale),
                min(ih, y1 * scale),
                count * scale * scale,
            )
        )
    ranked = sorted(((score_bbox(b, (iw, ih)), b) for b in scaled), reverse=True)
    if ranked and ranked[0][0] > 0:
        x0, y0, x1, y1, _ = ranked[0][1]
        pad = 18
        return (max(0, x0 - pad), max(0, y0 - pad), min(iw, x1 + pad), min(ih, y1 + pad)), "component_detected", ranked[0][0]
    return None, "visual_component_not_detected", 0


def question_crop_path(exam_dir, question):
    qid = question.get("id")
    candidates = []
    if isinstance(qid, int):
        candidates.extend([f"q{qid:02d}.png", f"q{qid:03d}.png", f"q{qid}.png"])
    display = str(question.get("displayNo") or "")
    if display.isdigit():
        n = int(display)
        candidates.extend([f"q{n:02d}.png", f"q{n:03d}.png", f"q{n}.png"])
    crop_dir = exam_dir / "crops" / "questions"
    for name in candidates:
        path = crop_dir / name
        if path.exists():
            return path
    raw = question.get("cropPath")
    if raw and Path(str(raw)).exists():
        return Path(str(raw))
    return None


def write_contact_sheet(items, out_path):
    thumbs = []
    for item in items:
        if item.get("status") != "asset_crop_success":
            continue
        try:
            image = Image.open(item["assetPath"]).convert("RGB")
        except Exception:
            continue
        image.thumbnail((260, 180))
        tile = Image.new("RGB", (300, 230), "white")
        tile.paste(image, (20, 12))
        draw = ImageDraw.Draw(tile)
        draw.text((12, 190), f"{item['term']} / {item['examId']}\nq{item['id']} {item['method']}"[:110], fill=(0, 0, 0))
        thumbs.append(tile)
    if not thumbs:
        return False
    cols = 3
    rows = math.ceil(len(thumbs) / cols)
    sheet = Image.new("RGB", (cols * 300, rows * 230), "white")
    for idx, tile in enumerate(thumbs):
        sheet.paste(tile, ((idx % cols) * 300, (idx // cols) * 230))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_path)
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True, help="generated high1 root")
    parser.add_argument("--out", required=True, help="report json path")
    parser.add_argument("--archive-root", default="", help="when set, write runtime assets under archive/assets/images/{examId}/q{id}.png")
    parser.add_argument("--only-missing-visual-asset", action="store_true", help="skip questions that already have visualAsset")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    archive_root = Path(args.archive_root).resolve() if args.archive_root else None
    report_path = Path(args.out).resolve()
    results = []
    touched = []
    for candidate in sorted(root.rglob("*.candidate.js")):
        term = candidate.relative_to(root).parts[0]
        exam_dir = candidate.parent.parent
        exam_id = exam_dir.name
        try:
            text, questions = read_questions(candidate)
        except Exception as exc:
            results.append({"candidateFile": str(candidate), "status": "candidate_parse_failed", "error": str(exc)})
            continue
        changed = False
        for question in questions:
            if args.only_missing_visual_asset and question.get("visualAsset"):
                continue
            if not is_visual_needed(question):
                continue
            source = question_crop_path(exam_dir, question)
            result = {
                "term": term,
                "examId": exam_id,
                "candidateFile": str(candidate),
                "id": question.get("id"),
                "displayNo": question.get("displayNo"),
                "sourceQuestionCrop": str(source) if source else "",
            }
            if not source:
                result["status"] = "question_crop_missing"
                results.append(result)
                continue
            try:
                image = Image.open(source).convert("RGB")
                bbox, method, score = choose_visual_bbox(image)
                if not bbox:
                    result.update({"status": "visual_component_not_detected", "method": method, "score": score})
                    results.append(result)
                    continue
                x0, y0, x1, y1 = bbox
                qid = int(question.get("id"))
                if archive_root:
                    asset_rel = f"assets/images/{exam_id}/q{qid}.png"
                    asset_path = archive_root / asset_rel.replace("/", "\\")
                    working_rel = f"assets/q{qid:02d}_figure1.png"
                    working_path = exam_dir / working_rel
                else:
                    asset_rel = f"assets/q{qid:02d}_figure1.png"
                    asset_path = exam_dir / asset_rel
                    working_rel = asset_rel
                    working_path = asset_path
                if not args.dry_run:
                    asset_path.parent.mkdir(parents=True, exist_ok=True)
                    cropped = image.crop(bbox)
                    cropped.save(asset_path)
                    if working_path != asset_path:
                        working_path.parent.mkdir(parents=True, exist_ok=True)
                        cropped.save(working_path)
                    question["image"] = asset_rel.replace("\\", "/")
                    question["visualAsset"] = asset_rel.replace("\\", "/")
                    question["visualAssetStatus"] = "archive_assets_images_linked" if archive_root else "cropped_from_question_crop"
                    question["visualAssetSource"] = str(source)
                    question["visualAssetBboxInQuestionCrop"] = [x0, y0, x1, y1]
                    if archive_root:
                        question["visualAssetArchivePath"] = str(asset_path)
                        question["visualAssetWorkingPath"] = str(working_path)
                    if "그래프" in str(question.get("content") or "") and "그래프" not in (question.get("tags") or []):
                        question.setdefault("tags", []).append("그래프")
                    elif "그림" in str(question.get("content") or "") and "도형" not in (question.get("tags") or []):
                        question.setdefault("tags", []).append("도형")
                    changed = True
                result.update(
                    {
                        "status": "asset_crop_success",
                        "assetPath": str(asset_path),
                        "assetRel": asset_rel.replace("\\", "/"),
                        "workingAssetPath": str(working_path),
                        "bboxInQuestionCrop": [x0, y0, x1, y1],
                        "method": method,
                        "score": score,
                        "width": x1 - x0,
                        "height": y1 - y0,
                    }
                )
            except Exception as exc:
                result.update({"status": "asset_crop_failed", "error": str(exc)})
            results.append(result)
        if changed and not args.dry_run:
            write_candidate(candidate, text, questions)
            touched.append(str(candidate))

    created = sum(1 for item in results if item.get("status") == "asset_crop_success")
    by_status = {}
    for item in results:
        by_status[item.get("status", "unknown")] = by_status.get(item.get("status", "unknown"), 0) + 1
    contact_sheet = report_path.with_name(report_path.stem + "_contact_sheet.png")
    contact_ok = write_contact_sheet(results, contact_sheet) if not args.dry_run else False
    report = {
        "stage": "past-exam-visual-asset-crop",
        "generatedAt": now_iso(),
        "root": str(root),
        "dryRun": args.dry_run,
        "candidateCount": len(list(root.rglob("*.candidate.js"))),
        "itemCount": len(results),
        "createdCount": created,
        "byStatus": by_status,
        "touchedCandidateCount": len(touched),
        "touchedCandidates": touched,
        "contactSheetCreated": contact_ok,
        "contactSheetPath": str(contact_sheet),
        "results": results,
    }
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: report[k] for k in ["candidateCount", "itemCount", "createdCount", "byStatus", "touchedCandidateCount", "contactSheetPath"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
