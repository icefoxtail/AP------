import argparse
import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path


VISUAL_TERMS = [
    "그림", "그래프", "도형", "표", "좌표평면", "좌표축", "다음 그림", "아래 그림", "오른쪽 그림",
    "figure", "graph", "diagram", "table", "coordinate",
]
VISUAL_RE = re.compile("|".join(re.escape(term) for term in VISUAL_TERMS), re.I)


def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def extract_question_bank(text):
    match = re.search(r"window\.questionBank\s*=\s*(\[.*?\]);?\s*$", text, re.S)
    if not match:
        raise ValueError("window.questionBank array not found")
    return json.loads(match.group(1))


def visual_needed(question):
    if question.get("hasVisualAsset") is True:
        return True
    if "no_visual_asset_required" in str(question.get("visualAssetStatus") or ""):
        return False
    combined = "\n".join([
        str(question.get("content") or ""),
        " ".join(str(x) for x in question.get("tags") or []),
        *[str(x) for x in question.get("choices") or []],
    ])
    return bool(VISUAL_RE.search(combined))


def resolve_asset(candidate, rel):
    if not rel:
        return None
    path = Path(str(rel))
    if path.is_absolute():
        return path
    normalized = str(rel).replace("\\", "/")
    exam_dir = candidate.parent.parent
    candidate_path = exam_dir / normalized
    if candidate_path.exists():
        return candidate_path
    if normalized.startswith("assets/images/"):
        # Generated candidate can point to live archive-style assets. Walk upward defensively.
        for parent in candidate.parents:
            maybe = parent / normalized
            if maybe.exists():
                return maybe
    return candidate_path


def image_forbidden_statuses(question):
    image = str(question.get("image") or "")
    statuses = []
    if not image:
        return statuses
    normalized = image.replace("\\", "/")
    forbidden_fragments = ["pages/", "crops/questions", "crops/debug_questions", "debug_questions", "page_p"]
    if any(fragment in normalized for fragment in forbidden_fragments):
        statuses.append("image_points_to_page_or_question_crop")
    if question.get("cropPath") and image == str(question.get("cropPath")):
        statuses.append("image_equals_question_crop_path")
    if question.get("fullPageImagePath") and image == str(question.get("fullPageImagePath")):
        statuses.append("image_equals_full_page_path")
    return statuses


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    root = Path(args.root).resolve()
    out = Path(args.out).resolve()
    items = []
    parse_errors = []
    scanned = 0
    for candidate in sorted(root.rglob("*.candidate.js")):
        term = candidate.relative_to(root).parts[0] if len(candidate.relative_to(root).parts) else ""
        exam_id = candidate.parent.parent.name
        try:
            questions = extract_question_bank(candidate.read_text(encoding="utf-8"))
        except Exception as exc:
            parse_errors.append({"candidateFile": str(candidate), "error": str(exc)})
            continue
        for question in questions:
            scanned += 1
            need = visual_needed(question)
            visual_asset = question.get("visualAsset") or ""
            image = question.get("image") or ""
            statuses = image_forbidden_statuses(question)
            asset_path = resolve_asset(candidate, visual_asset)
            if need and not visual_asset:
                statuses.append("visual_asset_required_missing")
            if visual_asset and (not asset_path or not asset_path.exists()):
                statuses.append("visual_asset_file_missing")
            if visual_asset and image and image != visual_asset:
                statuses.append("image_not_visual_asset")
            if not statuses:
                continue
            items.append({
                "term": term,
                "examId": exam_id,
                "candidateFile": str(candidate),
                "id": question.get("id"),
                "displayNo": question.get("displayNo"),
                "needsVisual": need,
                "image": image,
                "visualAsset": visual_asset,
                "resolvedVisualAsset": str(asset_path) if asset_path else "",
                "statuses": sorted(set(statuses)),
                "status": sorted(set(statuses))[0],
            })
    counts = Counter()
    by_term = defaultdict(Counter)
    for item in items:
        for status in item["statuses"]:
            counts[status] += 1
            by_term[item["term"]][status] += 1
    report = {
        "stage": "past-exam-visual-asset-link-audit",
        "generatedAt": now_iso(),
        "root": str(root),
        "policy": "candidate image may be blank or point only to a visual asset crop; page/question crops are forbidden",
        "scannedQuestions": scanned,
        "parseErrors": parse_errors,
        "itemCount": len(items),
        "byStatus": dict(counts),
        "byTerm": {term: dict(counts) for term, counts in sorted(by_term.items())},
        "items": items,
        "status": "ok" if not items and not parse_errors else "manual_review",
    }
    write_json(out, report)
    print(json.dumps({k: report[k] for k in ["scannedQuestions", "itemCount", "byStatus", "byTerm", "status"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
