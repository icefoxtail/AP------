import argparse
import json
import math
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


CHOICE_SYMBOL_RE = re.compile(r"[①②③④⑤]")
VISUAL_WORDS = [
    "그림",
    "그래프",
    "도형",
    "좌표평면",
    "표",
    "figure",
    "graph",
    "diagram",
    "table",
]


def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def read_candidate(candidate):
    text = candidate.read_text(encoding="utf-8")
    title_match = re.search(r"window\.examTitle\s*=\s*(.*?);\s*window\.questionBank", text, re.S)
    bank_match = re.search(r"window\.questionBank\s*=\s*(\[.*?\]);?\s*$", text, re.S)
    if not title_match or not bank_match:
        raise ValueError("candidate JS parse failed")
    return json.loads(title_match.group(1)), json.loads(bank_match.group(1))


def existing_path(raw):
    if not raw:
        return ""
    path = Path(str(raw))
    return str(path) if path.exists() else ""


def question_crop_path(exam_dir, question):
    raw = existing_path(question.get("cropPath"))
    if raw:
        return raw
    names = []
    qid = question.get("id")
    if isinstance(qid, int):
        names.extend([f"q{qid:02d}.png", f"q{qid:03d}.png", f"q{qid}.png"])
    display = str(question.get("displayNo") or "")
    if display.isdigit():
        n = int(display)
        names.extend([f"q{n:02d}.png", f"q{n:03d}.png", f"q{n}.png"])
    for name in names:
        path = exam_dir / "crops" / "questions" / name
        if path.exists():
            return str(path)
    return ""


def full_page_paths(exam_dir, question):
    paths = []
    for raw in [question.get("fullPageImagePath"), *(question.get("sourcePageEvidencePaths") or [])]:
        path = existing_path(raw)
        if path and path not in paths:
            paths.append(path)
    page_no = question.get("pageNo")
    try:
        page_no_int = int(page_no)
        if page_no_int <= 0:
            page_no_int = 1
        path = exam_dir / "pages" / f"page_p{page_no_int:03d}.png"
        if path.exists() and str(path) not in paths:
            paths.append(str(path))
    except Exception:
        pass
    if not paths:
        for path in sorted((exam_dir / "pages").glob("page_p*.png")):
            paths.append(str(path))
    return paths


def image_stats(path):
    if not path:
        return {"exists": False}
    try:
        image = Image.open(path).convert("RGB")
    except Exception as exc:
        return {"exists": False, "error": str(exc)}
    pix = image.resize((max(1, min(300, image.width)), max(1, int(image.height * min(300, image.width) / image.width))))
    values = list(pix.getdata())
    ink = 0
    for r, g, b in values:
        if min(r, g, b) < 235 and (max(r, g, b) < 218 or max(r, g, b) - min(r, g, b) > 8):
            ink += 1
    density = ink / max(len(values), 1)
    return {
        "exists": True,
        "width": image.width,
        "height": image.height,
        "inkDensity": round(density, 5),
        "blankLike": density < 0.0025,
        "tiny": image.width < 160 or image.height < 90,
    }


def has_visual_signal(question):
    combined = "\n".join(
        [
            str(question.get("content") or ""),
            " ".join(str(x) for x in question.get("choices") or []),
            " ".join(str(x) for x in question.get("tags") or []),
        ]
    ).lower()
    return any(word.lower() in combined for word in VISUAL_WORDS)


def risk_flags(question, crop_stats, full_pages):
    flags = []
    content = str(question.get("content") or "")
    choices = question.get("choices") if isinstance(question.get("choices"), list) else []
    qtype = str(question.get("questionType") or "")

    if not content.strip():
        flags.append("content_missing")
    if CHOICE_SYMBOL_RE.search(content):
        flags.append("content_contains_choice_symbols")
    if qtype in {"objective", "multiple_choice", "객관식"} or choices:
        if len(choices) != 5:
            flags.append("objective_choices_not_5")
        if any(not str(choice).strip() for choice in choices):
            flags.append("blank_choice")
    if choices and all(re.fullmatch(r"[①②③④⑤]?\s*(그림|그래프|도형|보기)?\s*", str(choice).strip()) for choice in choices):
        flags.append("label_only_visual_choices")
    if choices and any(CHOICE_SYMBOL_RE.search(str(choice)) for choice in choices):
        flags.append("choice_text_contains_number_symbol")
    if not crop_stats.get("exists"):
        flags.append("question_crop_missing")
    else:
        if crop_stats.get("blankLike"):
            flags.append("question_crop_blank_like")
        if crop_stats.get("tiny"):
            flags.append("question_crop_tiny")
    if not full_pages:
        flags.append("full_page_missing")
    visual_status = str(question.get("visualAssetStatus") or "")
    if has_visual_signal(question) and not question.get("visualAsset") and "no_visual_asset_required" not in visual_status:
        flags.append("visual_signal_without_asset")
    return flags


def split_weighted(items, chunks):
    buckets = [{"chunk": i + 1, "examCount": 0, "questionCount": 0, "riskCount": 0, "weight": 0, "items": []} for i in range(chunks)]
    for item in sorted(items, key=lambda row: (row["riskCount"] * 3 + row["questionCount"], row["questionCount"]), reverse=True):
        item_weight = item["riskCount"] * 3 + item["questionCount"]
        bucket = min(buckets, key=lambda row: (row["weight"], row["questionCount"]))
        bucket["items"].append(item)
        bucket["examCount"] += 1
        bucket["questionCount"] += item["questionCount"]
        bucket["riskCount"] += item["riskCount"]
        bucket["weight"] += item_weight
    return buckets


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    parser.add_argument("--out-dir", required=True)
    parser.add_argument("--chunks", type=int, default=4)
    args = parser.parse_args()

    root = Path(args.root).resolve()
    out_dir = Path(args.out_dir).resolve()
    exam_items = []
    all_questions = []
    parse_errors = []
    flag_counts = Counter()
    by_term = defaultdict(Counter)

    for candidate in sorted(root.rglob("*.candidate.js")):
        term = candidate.relative_to(root).parts[0]
        exam_dir = candidate.parent.parent
        try:
            exam_title, questions = read_candidate(candidate)
        except Exception as exc:
            parse_errors.append({"candidateFile": str(candidate), "error": str(exc)})
            continue
        question_rows = []
        for question in questions:
            crop = question_crop_path(exam_dir, question)
            pages = full_page_paths(exam_dir, question)
            stats = image_stats(crop)
            flags = risk_flags(question, stats, pages)
            for flag in flags:
                flag_counts[flag] += 1
                by_term[term][flag] += 1
            row = {
                "term": term,
                "examId": str(exam_title),
                "candidateFile": str(candidate),
                "id": question.get("id"),
                "displayNo": question.get("displayNo"),
                "questionType": question.get("questionType"),
                "content": question.get("content") or "",
                "choices": question.get("choices") or [],
                "image": question.get("image") or "",
                "visualAsset": question.get("visualAsset") or "",
                "visualAssetStatus": question.get("visualAssetStatus") or "",
                "questionCropPath": crop,
                "questionCropStats": stats,
                "fullPageImagePaths": pages,
                "sourceFile": question.get("sourceFile") or "",
                "reviewFlags": flags,
                "reviewInstruction": "Compare JS content/choices against questionCropPath first; if crop is cut/blank, use fullPageImagePaths. Do not inspect or change answer/solution in this round.",
                "allowedFieldsIfRepairApproved": ["content", "choices"],
            }
            question_rows.append(row)
            all_questions.append(row)
        risk_count = sum(1 for row in question_rows if row["reviewFlags"])
        item = {
            "term": term,
            "examId": str(exam_title),
            "candidateFile": str(candidate),
            "examDir": str(exam_dir),
            "questionCount": len(question_rows),
            "riskCount": risk_count,
            "questions": question_rows,
        }
        exam_items.append(item)

    out_dir.mkdir(parents=True, exist_ok=True)
    exams_dir = out_dir / "exam_worklists"
    exams_dir.mkdir(parents=True, exist_ok=True)
    for item in exam_items:
        safe = re.sub(r'[<>:"/\\|?*]+', "_", item["examId"])
        write_json(exams_dir / f"{item['term']}__{safe}.json", item)

    chunks = split_weighted(exam_items, args.chunks)
    for chunk in chunks:
        write_json(out_dir / f"agent_chunk_{chunk['chunk']:02d}.json", chunk)

    risk_items = [row for row in all_questions if row["reviewFlags"]]
    summary = {
        "stage": "content-choice-image-1to1-review-worklists",
        "generatedAt": now_iso(),
        "root": str(root),
        "rulesApplied": [
            "rules/무결성검수.md: review only; inspect every question; do not modify during audit",
            "rules/# 확통 JS 발문·보기·정답·해설 품질 업그레이드 GPT 에이전트 지시.md: image first, then JS; content/choices minimum repair only with image evidence",
            "rules/헬모드최종.txt: preserve original wording/order; no invented choices",
        ],
        "scope": "content and choices only; answer and solution excluded",
        "candidateFileCount": len(exam_items),
        "questionCount": len(all_questions),
        "riskQuestionCount": len(risk_items),
        "parseErrors": parse_errors,
        "flagCounts": dict(flag_counts),
        "flagCountsByTerm": {term: dict(counter) for term, counter in sorted(by_term.items())},
        "examWorklistDir": str(exams_dir),
        "chunkCount": args.chunks,
        "chunks": [
            {
                "chunk": chunk["chunk"],
                "examCount": chunk["examCount"],
                "questionCount": chunk["questionCount"],
                "riskCount": chunk["riskCount"],
                "weight": chunk["weight"],
                "path": str(out_dir / f"agent_chunk_{chunk['chunk']:02d}.json"),
            }
            for chunk in chunks
        ],
        "riskItemsPath": str(out_dir / "risk_items.json"),
        "status": "ready",
    }
    write_json(out_dir / "risk_items.json", {"items": risk_items})
    write_json(out_dir / "summary.json", summary)
    print(json.dumps({k: summary[k] for k in ["candidateFileCount", "questionCount", "riskQuestionCount", "flagCounts", "chunkCount", "status"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
