import argparse
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


MAX_PAGE_AREA_RATIO = 0.40
MIN_WIDTH = 20
MIN_HEIGHT = 20


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


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def normalize_bbox(raw):
    if not raw:
        return None
    if isinstance(raw, dict) and all(k in raw for k in ("x1", "y1", "x2", "y2")):
        return {k: int(round(float(raw[k]))) for k in ("x1", "y1", "x2", "y2")}
    if isinstance(raw, dict) and all(k in raw for k in ("left", "top", "right", "bottom")):
        return {
            "x1": int(round(float(raw["left"]))),
            "y1": int(round(float(raw["top"]))),
            "x2": int(round(float(raw["right"]))),
            "y2": int(round(float(raw["bottom"]))),
        }
    if isinstance(raw, list) and len(raw) == 4:
        return {"x1": int(round(float(raw[0]))), "y1": int(round(float(raw[1]))), "x2": int(round(float(raw[2]))), "y2": int(round(float(raw[3])))}
    return None


def validate_bbox(bbox, width, height):
    if not bbox:
        return ["visual_asset_bbox_missing"]
    x1, y1, x2, y2 = bbox["x1"], bbox["y1"], bbox["x2"], bbox["y2"]
    reasons = []
    if x2 <= x1 or y2 <= y1:
        reasons.append("visual_asset_bbox_invalid_order")
    if x1 < 0 or y1 < 0 or x2 > width or y2 > height:
        reasons.append("visual_asset_bbox_outside_page")
    crop_w = x2 - x1
    crop_h = y2 - y1
    if crop_w < MIN_WIDTH or crop_h < MIN_HEIGHT:
        reasons.append("visual_asset_bbox_too_small")
    if (crop_w * crop_h) / max(width * height, 1) > MAX_PAGE_AREA_RATIO:
        reasons.append("visual_asset_bbox_too_large_possible_question_or_page_crop")
    return reasons


def resolve_page_path(candidate, question):
    raw = question.get("fullPageImagePath") or question.get("fullPageImageRelPath") or ""
    if not raw:
        return None
    path = Path(str(raw))
    if path.is_absolute():
        return path
    exam_dir = candidate.parent.parent
    candidate_path = exam_dir / path
    if candidate_path.exists():
        return candidate_path
    return exam_dir / str(raw).replace("/", "\\")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True, help="generated past-exam root")
    parser.add_argument("--out", required=True, help="report json path")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--only-missing", action="store_true")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    out = Path(args.out).resolve()
    results = []
    touched = []
    candidates = sorted(root.rglob("*.candidate.js"))
    for candidate in candidates:
        try:
            text, questions = read_questions(candidate)
        except Exception as exc:
            results.append({"candidateFile": str(candidate), "status": "candidate_parse_failed", "error": str(exc)})
            continue
        exam_dir = candidate.parent.parent
        changed = False
        for q in questions:
            if not q.get("hasVisualAsset"):
                continue
            if args.only_missing and q.get("visualAsset"):
                continue
            result = {
                "candidateFile": str(candidate),
                "id": q.get("id"),
                "displayNo": q.get("displayNo"),
                "pageNo": q.get("pageNo"),
            }
            page_path = resolve_page_path(candidate, q)
            bbox = normalize_bbox(q.get("visualAssetBBoxOnPage") or q.get("visualAssetBBox"))
            result["fullPageImagePath"] = str(page_path) if page_path else ""
            result["bbox"] = bbox
            if not page_path or not page_path.exists():
                result["status"] = "full_page_image_missing"
                results.append(result)
                continue
            try:
                with Image.open(page_path).convert("RGB") as img:
                    reasons = validate_bbox(bbox, img.width, img.height)
                    if reasons:
                        result.update({"status": "visual_asset_bbox_rejected", "reasons": reasons})
                        q["visualAssetStatus"] = "bbox_manual_review"
                        q["imageStatus"] = "visual_asset_crop_failed_no_fallback"
                        q["reviewStatus"] = "manual_review"
                        q.setdefault("reviewReason", []).extend(reasons)
                        changed = True
                        results.append(result)
                        continue
                    x1, y1, x2, y2 = bbox["x1"], bbox["y1"], bbox["x2"], bbox["y2"]
                    asset_rel = f"assets/q{int(q.get('id')):03d}_visual.png"
                    asset_path = exam_dir / asset_rel
                    if not args.dry_run:
                        asset_path.parent.mkdir(parents=True, exist_ok=True)
                        img.crop((x1, y1, x2, y2)).save(asset_path)
                        q["image"] = asset_rel
                        q["visualAsset"] = asset_rel
                        q["visualAssetStatus"] = "cropped_from_full_page_bbox"
                        q["imageStatus"] = "visual_asset_only"
                        changed = True
                    result.update({
                        "status": "asset_crop_success",
                        "assetRel": asset_rel,
                        "assetPath": str(asset_path),
                        "width": x2 - x1,
                        "height": y2 - y1,
                        "areaRatioOfPage": round(((x2 - x1) * (y2 - y1)) / max(img.width * img.height, 1), 6),
                    })
            except Exception as exc:
                result.update({"status": "visual_asset_crop_exception", "error": str(exc)})
            results.append(result)
        if changed and not args.dry_run:
            write_candidate(candidate, text, questions)
            touched.append(str(candidate))

    counts = Counter(item.get("status", "unknown") for item in results)
    report = {
        "stage": "past-exam-full-page-visual-asset-crop",
        "generatedAt": now_iso(),
        "root": str(root),
        "dryRun": args.dry_run,
        "candidateCount": len(candidates),
        "itemCount": len(results),
        "byStatus": dict(counts),
        "touchedCandidateCount": len(touched),
        "touchedCandidates": touched,
        "results": results,
    }
    write_json(out, report)
    print(json.dumps({k: report[k] for k in ["candidateCount", "itemCount", "byStatus", "touchedCandidateCount"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
