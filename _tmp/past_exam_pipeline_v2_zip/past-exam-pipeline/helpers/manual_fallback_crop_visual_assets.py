import argparse
import json
import math
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw


VISUAL_TERMS = [
    "洹몃┝",
    "洹몃옒??",
    "?꾪삎",
    "醫뚰몴",
    "?ㅼ쓬 洹몃┝",
    "?꾨옒 洹몃┝",
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
    return text, match, json.loads(match.group(1))


def write_candidate(candidate, text, match, questions):
    payload = json.dumps(questions, ensure_ascii=False, indent=2)
    candidate.write_text(text[: match.start(1)] + payload + text[match.end(1) :], encoding="utf-8")


def visual_needed(question):
    combined = "\n".join(
        [
            str(question.get("content") or ""),
            " ".join(str(x) for x in question.get("tags") or []),
            *[str(x) for x in question.get("choices") or []],
        ]
    )
    return bool(VISUAL_RE.search(combined))


def question_crop_path(exam_dir, question):
    names = []
    qid = question.get("id")
    if isinstance(qid, int):
        names.extend([f"q{qid:02d}.png", f"q{qid:03d}.png", f"q{qid}.png"])
    display = str(question.get("displayNo") or "")
    if display.isdigit():
        n = int(display)
        names.extend([f"q{n:02d}.png", f"q{n:03d}.png", f"q{n}.png"])
    crop_dir = exam_dir / "crops" / "questions"
    for name in names:
        path = crop_dir / name
        if path.exists():
            return path
    raw = question.get("cropPath")
    if raw and Path(str(raw)).exists():
        return Path(str(raw))
    return None


def is_ink(pixel):
    r, g, b = pixel[:3]
    return min(r, g, b) < 236 and (max(r, g, b) < 220 or max(r, g, b) - min(r, g, b) > 7)


def ink_bbox(image, region):
    x0, y0, x1, y1 = region
    crop = image.crop(region).convert("RGB")
    pix = crop.load()
    minx = miny = 10**9
    maxx = maxy = -1
    ink_count = 0
    step = 2
    for y in range(0, crop.height, step):
        for x in range(0, crop.width, step):
            if is_ink(pix[x, y]):
                ink_count += 1
                minx = min(minx, x)
                maxx = max(maxx, x)
                miny = min(miny, y)
                maxy = max(maxy, y)
    if ink_count < 12:
        return None, 0
    pad = 24
    return (
        max(0, x0 + minx - pad),
        max(0, y0 + miny - pad),
        min(image.width, x0 + maxx + pad),
        min(image.height, y0 + maxy + pad),
    ), ink_count


def choose_manual_bbox(image):
    w, h = image.size
    regions = [
        ("right_half", (int(w * 0.42), int(h * 0.08), int(w * 0.98), int(h * 0.95))),
        ("lower_half", (int(w * 0.06), int(h * 0.38), int(w * 0.98), int(h * 0.96))),
        ("lower_right", (int(w * 0.36), int(h * 0.28), int(w * 0.98), int(h * 0.96))),
        ("middle_body", (int(w * 0.08), int(h * 0.18), int(w * 0.96), int(h * 0.90))),
    ]
    candidates = []
    for name, region in regions:
        bbox, ink_count = ink_bbox(image, region)
        if not bbox:
            continue
        bx0, by0, bx1, by1 = bbox
        bw = bx1 - bx0
        bh = by1 - by0
        area = bw * bh
        if bw < 60 or bh < 45:
            continue
        if area > w * h * 0.72:
            continue
        shape_bonus = 1.15 if bw > 120 and bh > 70 else 1.0
        right_bonus = 1.1 if bx0 > w * 0.32 else 1.0
        lower_bonus = 1.1 if by0 > h * 0.20 else 1.0
        score = ink_count * shape_bonus * right_bonus * lower_bonus
        candidates.append((score, name, bbox))
    if candidates:
        candidates.sort(reverse=True)
        return candidates[0][2], "manual_fallback_" + candidates[0][1], candidates[0][0]

    bbox, ink_count = ink_bbox(image, (int(w * 0.06), int(h * 0.12), int(w * 0.96), int(h * 0.94)))
    if bbox:
        return bbox, "manual_fallback_trimmed_question_body", ink_count
    return (
        int(w * 0.04),
        int(h * 0.10),
        int(w * 0.98),
        int(h * 0.96),
    ), "manual_last_resort_question_body_crop", 0


def write_contact_sheet(items, out_path):
    tiles = []
    for item in items:
        if item.get("status") != "manual_asset_crop_success":
            continue
        try:
            image = Image.open(item["assetPath"]).convert("RGB")
        except Exception:
            continue
        image.thumbnail((260, 180))
        tile = Image.new("RGB", (300, 235), "white")
        tile.paste(image, (20, 10))
        draw = ImageDraw.Draw(tile)
        draw.text((12, 188), f"{item['term']} / {item['examId']}\nq{item['id']} {item['method']}"[:120], fill=(0, 0, 0))
        tiles.append(tile)
    if not tiles:
        return False
    cols = 3
    rows = math.ceil(len(tiles) / cols)
    sheet = Image.new("RGB", (cols * 300, rows * 235), "white")
    for idx, tile in enumerate(tiles):
        sheet.paste(tile, ((idx % cols) * 300, (idx // cols) * 235))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_path)
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    parser.add_argument("--archive-root", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--input-report", default="", help="optional crop report; targets visual_component_not_detected items from it")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    archive_root = Path(args.archive_root).resolve()
    out = Path(args.out).resolve()
    report_targets = None
    if args.input_report:
        data = json.loads(Path(args.input_report).read_text(encoding="utf-8"))
        report_targets = defaultdict(set)
        for item in data.get("results") or data.get("items") or []:
            if item.get("status") == "visual_component_not_detected":
                report_targets[str(Path(item["candidateFile"]).resolve())].add(int(item["id"]))
    results = []
    touched = []

    for candidate in sorted(root.rglob("*.candidate.js")):
        term = candidate.relative_to(root).parts[0]
        exam_dir = candidate.parent.parent
        exam_id = exam_dir.name
        try:
            text, match, questions = read_questions(candidate)
        except Exception as exc:
            results.append({"candidateFile": str(candidate), "status": "parse_failed", "error": str(exc)})
            continue
        changed = False
        for question in questions:
            qid = int(question.get("id") or 0)
            from_report = report_targets is not None and qid in report_targets.get(str(candidate.resolve()), set())
            if question.get("visualAsset"):
                continue
            if not from_report and not visual_needed(question):
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
                bbox, method, score = choose_manual_bbox(image)
                if not bbox:
                    result.update({"status": "manual_crop_failed", "method": method, "score": score})
                    results.append(result)
                    continue
                qid = int(question.get("id"))
                asset_rel = f"assets/images/{exam_id}/q{qid}.png"
                asset_path = archive_root / asset_rel.replace("/", "\\")
                x0, y0, x1, y1 = bbox
                if not args.dry_run:
                    asset_path.parent.mkdir(parents=True, exist_ok=True)
                    image.crop(bbox).save(asset_path)
                    question["image"] = asset_rel
                    question["visualAsset"] = asset_rel
                    question["visualAssetStatus"] = "manual_fallback_crop_needs_contact_sheet_review"
                    question["visualAssetSource"] = str(source)
                    question["visualAssetBboxInQuestionCrop"] = [x0, y0, x1, y1]
                    question["visualAssetArchivePath"] = str(asset_path)
                    changed = True
                result.update(
                    {
                        "status": "manual_asset_crop_success",
                        "assetPath": str(asset_path),
                        "assetRel": asset_rel,
                        "bboxInQuestionCrop": [x0, y0, x1, y1],
                        "method": method,
                        "score": score,
                        "width": x1 - x0,
                        "height": y1 - y0,
                    }
                )
            except Exception as exc:
                result.update({"status": "manual_crop_exception", "error": str(exc)})
            results.append(result)
        if changed and not args.dry_run:
            write_candidate(candidate, text, match, questions)
            touched.append(str(candidate))

    counts = Counter(item["status"] for item in results)
    by_term = defaultdict(Counter)
    for item in results:
        if item.get("term"):
            by_term[item["term"]][item["status"]] += 1
    contact = out.with_name(out.stem + "_contact_sheet.png")
    contact_ok = write_contact_sheet(results, contact)
    report = {
        "stage": "manual-fallback-crop-visual-assets",
        "generatedAt": now_iso(),
        "root": str(root),
        "archiveRoot": str(archive_root),
        "dryRun": args.dry_run,
        "itemCount": len(results),
        "createdCount": counts.get("manual_asset_crop_success", 0),
        "byStatus": dict(counts),
        "byTerm": {term: dict(counter) for term, counter in sorted(by_term.items())},
        "touchedCandidateCount": len(touched),
        "touchedCandidates": touched,
        "contactSheetCreated": contact_ok,
        "contactSheetPath": str(contact),
        "items": results,
        "status": "ok" if not any(k.endswith("missing") or k.endswith("failed") for k in counts) else "manual_review",
    }
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: report[k] for k in ["itemCount", "createdCount", "byStatus", "byTerm", "touchedCandidateCount", "contactSheetPath", "status"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
