import argparse
import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path


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


def question_crop_exists(exam_dir, question):
    qid = question.get("id")
    names = []
    if isinstance(qid, int):
        names.extend([f"q{qid:02d}.png", f"q{qid:03d}.png", f"q{qid}.png"])
    display = str(question.get("displayNo") or "")
    if display.isdigit():
        n = int(display)
        names.extend([f"q{n:02d}.png", f"q{n:03d}.png", f"q{n}.png"])
    crop_dir = exam_dir / "crops" / "questions"
    if any((crop_dir / name).exists() for name in names):
        return True
    raw = question.get("cropPath")
    return bool(raw and Path(str(raw)).exists())


def full_page_path(exam_dir, question):
    raw = question.get("fullPageImagePath") or question.get("image") or ""
    path = Path(str(raw))
    if path.is_absolute() and path.exists():
        return path
    page_no = question.get("pageNo")
    if page_no:
        p = exam_dir / "pages" / f"page_p{int(page_no):03d}.png"
        if p.exists():
            return p
    if raw:
        p = exam_dir / str(raw).replace("/", "\\")
        if p.exists():
            return p
    return None


def resolve_pdf(question):
    for key in ("sourceFile", "pdfPath", "sourcePdfPath"):
        raw = question.get(key)
        if raw and Path(str(raw)).exists():
            return Path(str(raw))
    return None


def render_page(pdf_path, page_no, out_path, dpi):
    import fitz

    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    if page_no < 1 or page_no > len(doc):
        raise ValueError(f"pageNo {page_no} outside PDF page count {len(doc)}")
    page = doc[page_no - 1]
    matrix = fitz.Matrix(dpi / 72, dpi / 72)
    pix = page.get_pixmap(matrix=matrix, alpha=False)
    pix.save(out_path)
    return {"width": pix.width, "height": pix.height, "pageCount": len(doc)}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--input-report", default="", help="optional crop/audit report; targets question_crop_missing items from it")
    parser.add_argument("--dpi", type=int, default=220)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    out = Path(args.out).resolve()
    report_targets = None
    if args.input_report:
        data = json.loads(Path(args.input_report).read_text(encoding="utf-8"))
        report_targets = defaultdict(set)
        for item in data.get("results") or data.get("items") or []:
            if item.get("status") == "question_crop_missing":
                report_targets[str(Path(item["candidateFile"]).resolve())].add(int(item["id"]))
    rendered_cache = {}
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
            if question_crop_exists(exam_dir, question):
                continue
            if full_page_path(exam_dir, question):
                continue

            page_no = question.get("pageNo")
            pdf_path = resolve_pdf(question)
            result = {
                "term": term,
                "examId": exam_id,
                "candidateFile": str(candidate),
                "id": question.get("id"),
                "displayNo": question.get("displayNo"),
                "pageNo": page_no,
                "sourceFile": str(pdf_path) if pdf_path else "",
            }
            if not page_no:
                result["status"] = "page_no_missing"
                results.append(result)
                continue
            if not pdf_path:
                result["status"] = "source_pdf_missing"
                results.append(result)
                continue

            page_no_int = int(page_no)
            page_path = exam_dir / "pages" / f"page_p{page_no_int:03d}.png"
            cache_key = (str(pdf_path), page_no_int, str(page_path))
            try:
                info = rendered_cache.get(cache_key)
                if info is None:
                    if args.dry_run:
                        info = {"width": 0, "height": 0, "pageCount": 0}
                    else:
                        info = render_page(pdf_path, page_no_int, page_path, args.dpi)
                    rendered_cache[cache_key] = info
                if not args.dry_run:
                    question["fullPageImagePath"] = str(page_path)
                    if not question.get("image") or "page_p" not in str(question.get("image")):
                        question["imageStatus"] = "full_page_rendered_for_question_crop_restore"
                    changed = True
                result.update({"status": "rendered", "fullPageImagePath": str(page_path), **info})
            except Exception as exc:
                result.update({"status": "render_failed", "error": str(exc), "fullPageImagePath": str(page_path)})
            results.append(result)

        if changed and not args.dry_run:
            write_candidate(candidate, text, match, questions)
            touched.append(str(candidate))

    counts = Counter(item["status"] for item in results)
    by_term = defaultdict(Counter)
    for item in results:
        if item.get("term"):
            by_term[item["term"]][item["status"]] += 1
    report = {
        "stage": "render-missing-full-pages-for-visual-assets",
        "generatedAt": now_iso(),
        "root": str(root),
        "dpi": args.dpi,
        "dryRun": args.dry_run,
        "itemCount": len(results),
        "byStatus": dict(counts),
        "byTerm": {term: dict(counter) for term, counter in sorted(by_term.items())},
        "touchedCandidateCount": len(touched),
        "touchedCandidates": touched,
        "items": results,
        "status": "ok" if not any(k.endswith("missing") or k.endswith("failed") for k in counts) else "manual_review",
    }
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: report[k] for k in ["itemCount", "byStatus", "byTerm", "touchedCandidateCount", "status"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
