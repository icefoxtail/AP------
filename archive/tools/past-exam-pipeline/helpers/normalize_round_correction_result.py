import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path


def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def write_text_atomic(path, text):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(text, encoding="utf-8", newline="\n")
    tmp.replace(path)


def write_json_atomic(path, data):
    write_text_atomic(path, json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def looks_garbled(text):
    return "??" in text or "�" in text or "???" in text


def parse_unambiguous_json_line(line):
    raw = line.strip()
    if not raw.startswith("{"):
        return None
    try:
        item = json.loads(raw)
    except Exception:
        return None
    required = {"examId", "candidateFile", "field", "status"}
    if not required.issubset(item):
        return None
    if item.get("status") != "repaired":
        return None
    return {
        "examId": item.get("examId") or "",
        "candidateFile": item.get("candidateFile") or "",
        "questionId": item.get("questionId"),
        "displayNo": item.get("displayNo") or "",
        "field": item.get("field") or "",
        "action": item.get("action") or "updated",
        "beforeHash": item.get("beforeHash") or "",
        "afterHash": item.get("afterHash") or "",
        "evidencePath": item.get("evidencePath") or "",
        "status": "repaired",
        "verifiedBy": item.get("verifiedBy") or "",
        "verifiedAt": item.get("verifiedAt") or "",
    }


def extract_bullets(input_md):
    bullets = []
    in_edit_section = False
    for line in input_md.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if stripped.startswith("## "):
            title = stripped.lower()
            in_edit_section = "edits" in title or "수정" in title
            continue
        if in_edit_section and stripped.startswith("- "):
            bullets.append(stripped[2:].strip())
    return bullets


def normalize_correction_result(review_dir, input_md, out_json):
    review_dir = Path(review_dir).resolve()
    input_md = Path(input_md).resolve()
    out_json = Path(out_json).resolve()
    items = []
    unparsed = []

    for raw in extract_bullets(input_md):
        parsed = parse_unambiguous_json_line(raw)
        if parsed and not looks_garbled(json.dumps(parsed, ensure_ascii=False)):
            items.append(parsed)
        else:
            reason = "garbled_or_unstructured_md"
            if raw.startswith("{"):
                reason = "json_line_missing_required_fields_or_not_repaired"
            unparsed.append({"raw": raw, "reason": reason})

    result = {
        "stage": "round-correction-result",
        "generatedAt": now_iso(),
        "reviewDir": str(review_dir),
        "items": items,
        "unparsedItems": unparsed,
        "status": "complete" if not unparsed else "manual_parse_required",
    }
    write_json_atomic(out_json, result)
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--review-dir", required=True)
    parser.add_argument("--input-md", default="")
    parser.add_argument("--out-json", required=True)
    args = parser.parse_args()
    review_dir = Path(args.review_dir)
    input_md = Path(args.input_md) if args.input_md else review_dir / "round1_correction_result.md"
    result = normalize_correction_result(review_dir=review_dir, input_md=input_md, out_json=args.out_json)
    print(json.dumps({
        "itemCount": len(result["items"]),
        "unparsedCount": len(result["unparsedItems"]),
        "status": result["status"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
