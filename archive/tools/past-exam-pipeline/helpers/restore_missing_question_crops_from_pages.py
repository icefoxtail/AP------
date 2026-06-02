import argparse
import json
import re
from collections import Counter, defaultdict
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
    path.write_text(text[: match.start(1)] + payload + text[match.end(1) :], encoding="utf-8")


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
    return None


def infer_page_no_from_order(question, questions, page_count):
    try:
        qid = int(question.get("id") or question.get("displayNo") or 0)
    except Exception:
        qid = 0
    total = 0
    for item in questions or []:
        try:
            total = max(total, int(item.get("id") or item.get("displayNo") or 0))
        except Exception:
            continue
    if qid <= 0 or total <= 0 or page_count <= 0:
        return 1
    return min(page_count, max(1, int((qid - 1) * page_count / total) + 1))


def available_page_paths(exam_dir, question):
    evidence = []
    for item in question.get("sourcePageEvidencePaths") or []:
        p = Path(str(item))
        if p.exists():
            evidence.append(p)
    if evidence:
        return evidence
    return sorted((exam_dir / "pages").glob("page_p*.png"))


def full_page_path(exam_dir, question, questions=None):
    raw = question.get("fullPageImagePath") or question.get("image") or ""
    path = Path(str(raw))
    if path.is_absolute() and path.exists():
        return path
    evidence_paths = available_page_paths(exam_dir, question)
    evidence = [str(p) for p in evidence_paths]
    page_no_raw = question.get("pageNo")
    if page_no_raw is not None and str(page_no_raw) != "":
        page_no = int(page_no_raw)
        if page_no <= 0 and evidence:
            page_no = infer_page_no_from_order(question, questions, len(evidence))
        elif page_no <= 0:
            page_no = 1
        p = exam_dir / "pages" / f"page_p{page_no:03d}.png"
        if p.exists():
            return p
    if evidence_paths:
        try:
            page_index = int(question.get("pageNo") or 0)
        except Exception:
            page_index = 0
        if page_index <= 0:
            page_index = infer_page_no_from_order(question, questions, len(evidence_paths)) - 1
        elif page_index < len(evidence):
            page_index = page_index
        else:
            page_index = page_index - 1
        candidates = []
        if 0 <= page_index < len(evidence):
            candidates.append(evidence[page_index])
        candidates.extend(evidence)
        for item in candidates:
            p = Path(str(item))
            if p.exists():
                return p
    if raw:
        p = exam_dir / str(raw).replace("/", "\\")
        if p.exists():
            return p
    return None


def page_no_for(question, page_path, questions=None, exam_dir=None):
    if question.get("pageNo") is not None and str(question.get("pageNo")) != "":
        try:
            page_no = int(question.get("pageNo"))
            if page_no <= 0:
                evidence_count = len(question.get("sourcePageEvidencePaths") or [])
                if not evidence_count and exam_dir is not None:
                    evidence_count = len(list((exam_dir / "pages").glob("page_p*.png")))
                return infer_page_no_from_order(question, questions, evidence_count) if evidence_count else 1
            return page_no
        except Exception:
            pass
    match = re.search(r"page_p(\d+)", str(page_path or ""))
    return int(match.group(1)) if match else 0


def estimated_boxes(page_size, questions):
    width, height = page_size
    n = len(questions)
    if n <= 0:
        return {}
    top = int(height * 0.05)
    bottom = int(height * 0.97)
    left_margin = int(width * 0.025)
    right_margin = int(width * 0.025)
    mid_gap = int(width * 0.02)
    boxes = {}
    if width >= 1200 and n >= 3:
        left_count = (n + 1) // 2
        columns = [
            (questions[:left_count], left_margin, width // 2 - mid_gap),
            (questions[left_count:], width // 2 + mid_gap, width - right_margin),
        ]
        for col_questions, x0, x1 in columns:
            count = len(col_questions)
            if not count:
                continue
            step = (bottom - top) / count
            for idx, question in enumerate(col_questions):
                y0 = max(0, int(top + idx * step) - 20)
                y1 = min(height, int(top + (idx + 1) * step) + 20)
                boxes[id(question)] = (x0, y0, x1, y1)
    else:
        step = (bottom - top) / n
        for idx, question in enumerate(questions):
            y0 = max(0, int(top + idx * step) - 20)
            y1 = min(height, int(top + (idx + 1) * step) + 20)
            boxes[id(question)] = (left_margin, y0, width - right_margin, y1)
    return boxes


def make_contact_sheet(items, out_path):
    shown = [item for item in items if item.get("status") == "restored"][:180]
    tiles = []
    for item in shown:
        path = Path(item["cropPath"])
        if not path.exists():
            continue
        try:
            image = Image.open(path).convert("RGB")
        except Exception:
            continue
        image.thumbnail((280, 165))
        tile = Image.new("RGB", (320, 230), "white")
        tile.paste(image, (20, 10))
        draw = ImageDraw.Draw(tile)
        draw.text((10, 180), f"{item['term']} / {item['examId']}\nq{item['id']} p{item['pageNo']} estimated", fill=(0, 0, 0))
        tiles.append(tile)
    if not tiles:
        return False
    cols = 3
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * 320, rows * 230), "white")
    for idx, tile in enumerate(tiles):
        sheet.paste(tile, ((idx % cols) * 320, (idx // cols) * 230))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_path)
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    out = Path(args.out).resolve()
    results = []
    touched = []
    for candidate in sorted(root.rglob("*.candidate.js")):
        term = candidate.relative_to(root).parts[0]
        exam_dir = candidate.parent.parent
        exam_id = exam_dir.name
        try:
            text = candidate.read_text(encoding="utf-8")
            match, questions = extract_question_bank(text)
        except Exception as exc:
            results.append({"candidateFile": str(candidate), "status": "parse_failed", "error": str(exc)})
            continue
        page_groups = defaultdict(list)
        for question in questions:
            if question.get("visualAsset"):
                continue
            if not visual_needed(question):
                continue
            if question_crop_path(exam_dir, question):
                continue
            page_path = full_page_path(exam_dir, question, questions)
            if not page_path:
                results.append(
                    {
                        "term": term,
                        "examId": exam_id,
                        "candidateFile": str(candidate),
                        "id": question.get("id"),
                        "displayNo": question.get("displayNo"),
                        "status": "full_page_missing",
                    }
                )
                continue
            page_groups[(page_no_for(question, page_path, questions, exam_dir), str(page_path))].append(question)
        changed = False
        for (page_no, page_path_raw), target_questions in page_groups.items():
            page_path = Path(page_path_raw)
            try:
                page = Image.open(page_path).convert("RGB")
            except Exception as exc:
                for question in target_questions:
                    results.append(
                        {
                            "term": term,
                            "examId": exam_id,
                            "candidateFile": str(candidate),
                            "id": question.get("id"),
                            "displayNo": question.get("displayNo"),
                            "pageNo": page_no,
                            "fullPageImagePath": str(page_path),
                            "status": "full_page_open_failed",
                            "error": str(exc),
                        }
                    )
                continue
            all_on_page = [
                q
                for q in questions
                if page_no_for(q, full_page_path(exam_dir, q, questions) or page_path, questions, exam_dir) == page_no
            ]
            all_on_page.sort(key=lambda q: int(q.get("id") or 0))
            boxes = estimated_boxes(page.size, all_on_page)
            crop_dir = exam_dir / "crops" / "questions"
            if not args.dry_run:
                crop_dir.mkdir(parents=True, exist_ok=True)
            for question in target_questions:
                qid = int(question.get("id") or 0)
                box = boxes.get(id(question))
                if not box:
                    results.append(
                        {
                            "term": term,
                            "examId": exam_id,
                            "candidateFile": str(candidate),
                            "id": question.get("id"),
                            "displayNo": question.get("displayNo"),
                            "pageNo": page_no,
                            "status": "estimated_box_missing",
                        }
                    )
                    continue
                crop_path = crop_dir / f"q{qid:02d}.png"
                if not args.dry_run:
                    page.crop(box).save(crop_path)
                    question["cropPath"] = str(crop_path)
                    question["imageStatus"] = "estimated_question_crop_for_visual_asset"
                    changed = True
                results.append(
                    {
                        "term": term,
                        "examId": exam_id,
                        "candidateFile": str(candidate),
                        "id": question.get("id"),
                        "displayNo": question.get("displayNo"),
                        "pageNo": page_no,
                        "fullPageImagePath": str(page_path),
                        "cropPath": str(crop_path),
                        "bbox": list(box),
                        "status": "restored",
                        "method": "estimated_page_split_from_question_order",
                    }
                )
        if changed and not args.dry_run:
            write_candidate(candidate, text, match, questions)
            touched.append(str(candidate))
    counts = Counter(item["status"] for item in results)
    by_term = defaultdict(Counter)
    for item in results:
        if item.get("term"):
            by_term[item["term"]][item["status"]] += 1
    contact = out.with_name(out.stem + "_contact_sheet.png")
    contact_ok = make_contact_sheet(results, contact)
    report = {
        "stage": "restore-missing-question-crops-from-pages",
        "generatedAt": now_iso(),
        "root": str(root),
        "dryRun": args.dry_run,
        "itemCount": len(results),
        "byStatus": dict(counts),
        "byTerm": {term: dict(counts) for term, counts in sorted(by_term.items())},
        "touchedCandidateCount": len(touched),
        "touchedCandidates": touched,
        "contactSheetCreated": contact_ok,
        "contactSheetPath": str(contact),
        "items": results,
        "status": "ok" if not any(k.endswith("failed") or k.endswith("missing") for k in counts) else "manual_review",
    }
    write_json(out, report)
    print(json.dumps({k: report[k] for k in ["itemCount", "byStatus", "byTerm", "touchedCandidateCount", "contactSheetPath", "status"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
