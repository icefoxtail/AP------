import argparse
import json
import re
import shutil
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path


def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def extract_question_bank(text):
    match = re.search(r"window\.questionBank\s*=\s*(\[.*?\]);?\s*$", text, re.S)
    if not match:
        raise ValueError("window.questionBank array not found")
    return match, json.loads(match.group(1))


def write_candidate(path, text, match, questions):
    payload = json.dumps(questions, ensure_ascii=False, indent=2)
    updated = text[: match.start(1)] + payload + text[match.end(1) :]
    path.write_text(updated, encoding="utf-8")


def resolve_generated_asset(candidate, question):
    raw = question.get("visualAsset") or question.get("image") or ""
    if not raw:
        return None
    path = Path(str(raw))
    if path.is_absolute():
        return path
    return candidate.parent.parent / str(raw).replace("/", "\\")


def filename_for_question(question):
    qid = question.get("id")
    if isinstance(qid, int):
        return f"q{qid}.png"
    display = str(question.get("displayNo") or "")
    if display.isdigit():
        return f"q{int(display)}.png"
    safe = re.sub(r'[\\/:*?"<>|\s]+', "_", display).strip("_") or "q"
    return f"{safe}.png"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True, help="generated candidate root")
    parser.add_argument("--archive-root", default="archive", help="archive root containing assets/images")
    parser.add_argument("--out", required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    archive_root = Path(args.archive_root).resolve()
    archive_images = archive_root / "assets" / "images"
    out = Path(args.out).resolve()

    items = []
    touched = []
    parse_errors = []
    for candidate in sorted(root.rglob("*.candidate.js")):
        term = candidate.relative_to(root).parts[0]
        exam_dir = candidate.parent.parent
        exam_id = exam_dir.name
        try:
            text = candidate.read_text(encoding="utf-8")
            match, questions = extract_question_bank(text)
        except Exception as exc:
            parse_errors.append({"candidateFile": str(candidate), "error": str(exc)})
            continue
        changed = False
        for question in questions:
            current = str(question.get("visualAsset") or "")
            if not current:
                continue
            source = resolve_generated_asset(candidate, question)
            filename = filename_for_question(question)
            dest = archive_images / exam_id / filename
            rel = f"assets/images/{exam_id}/{filename}"
            item = {
                "term": term,
                "examId": exam_id,
                "candidateFile": str(candidate),
                "id": question.get("id"),
                "displayNo": question.get("displayNo"),
                "sourceAsset": str(source) if source else "",
                "archiveAsset": str(dest),
                "archiveRel": rel,
            }
            if not source or not source.exists():
                item["status"] = "source_asset_missing"
                items.append(item)
                continue
            if not args.dry_run:
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, dest)
                question["image"] = rel
                question["visualAsset"] = rel
                question["visualAssetStatus"] = "archive_assets_images_linked"
                question["visualAssetArchivePath"] = str(dest)
                changed = True
            item["status"] = "promoted"
            items.append(item)
        if changed and not args.dry_run:
            write_candidate(candidate, text, match, questions)
            touched.append(str(candidate))

    counts = Counter(item["status"] for item in items)
    by_term = defaultdict(Counter)
    for item in items:
        by_term[item["term"]][item["status"]] += 1
    report = {
        "stage": "past-exam-promote-visual-assets-to-archive-assets",
        "generatedAt": now_iso(),
        "root": str(root),
        "archiveImagesRoot": str(archive_images),
        "dryRun": args.dry_run,
        "itemCount": len(items),
        "byStatus": dict(counts),
        "byTerm": {term: dict(counts) for term, counts in sorted(by_term.items())},
        "touchedCandidateCount": len(touched),
        "touchedCandidates": touched,
        "parseErrors": parse_errors,
        "items": items,
        "status": "ok" if not parse_errors and not counts.get("source_asset_missing", 0) else "manual_review",
    }
    write_json(out, report)
    print(json.dumps({k: report[k] for k in ["itemCount", "byStatus", "byTerm", "touchedCandidateCount", "status"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
