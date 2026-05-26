import json
import math
import re
from pathlib import Path

import fitz
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[3]
REPORTS = ROOT / "generated" / "reports"

KEYWORDS = [
    "빠른 정답",
    "정답과 해설",
    "정답 및 해설",
    "정답 해설",
    "정답",
    "해설",
    "풀이",
    "답안",
]


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def safe_name(value):
    return re.sub(r'[\\/:*?"<>|]+', "_", str(value))


def book_dirs():
    for entry in sorted(ROOT.iterdir(), key=lambda p: p.name):
        if not entry.is_dir():
            continue
        if (entry / "generated" / "js").exists():
            yield entry


def matching_pdf(book_dir):
    exact = ROOT / f"{book_dir.name}.pdf"
    if exact.exists():
        return exact
    compact_name = re.sub(r"\s+", "", book_dir.name)
    candidates = []
    for pdf in ROOT.glob("*.pdf"):
        compact_pdf = re.sub(r"\s+", "", pdf.stem)
        if compact_name in compact_pdf or compact_pdf in compact_name:
            candidates.append(pdf)
    candidates.sort(key=lambda p: p.stat().st_size, reverse=True)
    return candidates[0] if candidates else None


def keyword_hits(text):
    return [kw for kw in KEYWORDS if kw in text]


def find_candidate_pages(doc):
    candidates = []
    page_count = doc.page_count
    late_start = max(0, math.floor(page_count * 0.55) - 1)
    for index in range(page_count):
        text = doc[index].get_text("text") or ""
        hits = keyword_hits(text)
        if not hits:
            continue
        late_bonus = index >= late_start
        score = len(hits) + (2 if late_bonus else 0)
        candidates.append({
            "pageNo": index + 1,
            "score": score,
            "keywordHits": hits,
            "lateBookPage": late_bonus,
            "textExcerpt": " ".join(text.split())[:500],
        })
    candidates.sort(key=lambda item: (-item["score"], item["pageNo"]))
    return candidates


def render_page(doc, page_no, out_path, zoom=2.0):
    page = doc[page_no - 1]
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path)
    return img


def make_contact_sheet(images, labels, out_path):
    if not images:
        return None
    thumbs = []
    for img in images:
        thumb = img.copy()
        thumb.thumbnail((360, 520))
        thumbs.append(thumb)
    width = 760
    margin = 16
    label_h = 30
    cell_w = 360
    cell_h = 560
    cols = 2
    rows = math.ceil(len(thumbs) / cols)
    sheet = Image.new("RGB", (width, margin + rows * cell_h), "white")
    draw = ImageDraw.Draw(sheet)
    for idx, thumb in enumerate(thumbs):
        col = idx % cols
        row = idx // cols
        x = margin + col * (cell_w + margin)
        y = margin + row * cell_h
        draw.text((x, y), labels[idx], fill=(0, 0, 0))
        sheet.paste(thumb, (x, y + label_h))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_path)
    return out_path


def process_book(book_dir, max_pages):
    generated = book_dir / "generated"
    reports = generated / "reports"
    pdf = matching_pdf(book_dir)
    result = {
        "book": book_dir.name,
        "bookDir": str(book_dir),
        "pdf": str(pdf) if pdf else "",
        "status": "blocked_missing_pdf" if not pdf else "pending",
        "candidatePageCount": 0,
        "renderedPageCount": 0,
        "candidatePages": [],
        "renderedPages": [],
        "contactSheet": "",
    }
    if not pdf:
        write_json(reports / "answer_candidate_page_crop_report.json", result)
        return result

    doc = fitz.open(pdf)
    candidates = find_candidate_pages(doc)
    selected = candidates[:max_pages]
    out_dir = generated / "work" / "answer_candidate_pages"
    images = []
    labels = []
    rendered = []
    for item in selected:
        page_no = item["pageNo"]
        file_name = f"{safe_name(book_dir.name)}_answer_candidate_p{page_no:03d}.png"
        out_path = out_dir / file_name
        img = render_page(doc, page_no, out_path)
        rel = out_path.relative_to(book_dir).as_posix()
        rendered.append({**item, "imagePath": rel})
        images.append(img)
        labels.append(f"p{page_no} score={item['score']} {','.join(item['keywordHits'][:3])}")

    sheet_path = reports / "answer_candidate_pages_contact_sheet.png"
    if images:
        make_contact_sheet(images, labels, sheet_path)

    result.update({
        "status": "has_answer_candidate_pages" if selected else "no_answer_candidate_pages_detected",
        "pageCount": doc.page_count,
        "candidatePageCount": len(candidates),
        "renderedPageCount": len(rendered),
        "candidatePages": candidates,
        "renderedPages": rendered,
        "contactSheet": sheet_path.relative_to(book_dir).as_posix() if images else "",
    })
    write_json(reports / "answer_candidate_page_crop_report.json", result)
    return result


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--max-pages", type=int, default=24)
    args = parser.parse_args()

    REPORTS.mkdir(parents=True, exist_ok=True)
    results = [process_book(book, args.max_pages) for book in book_dirs()]
    summary = {
        "createdAt": __import__("datetime").datetime.now().isoformat(),
        "mode": "ANSWER_CANDIDATE_PAGE_CROP_ALL",
        "bookCount": len(results),
        "withCandidatePages": sum(1 for item in results if item["status"] == "has_answer_candidate_pages"),
        "withoutCandidatePages": sum(1 for item in results if item["status"] == "no_answer_candidate_pages_detected"),
        "missingPdf": sum(1 for item in results if item["status"] == "blocked_missing_pdf"),
        "results": results,
        "noAnswerCandidateBooks": [
            {"book": item["book"], "status": item["status"], "pdf": item["pdf"]}
            for item in results
            if item["status"] != "has_answer_candidate_pages"
        ],
    }
    write_json(REPORTS / "answer_candidate_page_crop_all_report.json", summary)
    print(json.dumps({
        "bookCount": summary["bookCount"],
        "withCandidatePages": summary["withCandidatePages"],
        "withoutCandidatePages": summary["withoutCandidatePages"],
        "missingPdf": summary["missingPdf"],
        "report": str(REPORTS / "answer_candidate_page_crop_all_report.json"),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
