import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import fitz


BATCH_ID = "1final_middle_m2_2022_2025"
BATCH_DIR = Path("archive/_generated/past-exams/_batch")
SUMMARY_PATH = BATCH_DIR / f"candidate_generation_summary_{BATCH_ID}.json"
PREFLIGHT_ROOT = Path(f"archive/_generated/past-exams/_preflight_{BATCH_ID}")


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def render_pdf_pages(pdf_path, out_dir, prefix):
    out_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    paths = []
    for index, page in enumerate(doc, start=1):
        out = out_dir / f"{prefix}_p{index:03d}.png"
        if not out.exists():
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
            pix.save(out)
        paths.append(out)
    return paths


def ocr_image(engine, image_path):
    result = engine(str(image_path))
    rows = []
    boxes = result.boxes if result.boxes is not None else []
    txts = result.txts or []
    scores = result.scores or []
    for box, text, score in zip(boxes, txts, scores):
        xs = [float(point[0]) for point in box]
        ys = [float(point[1]) for point in box]
        rows.append(
            {
                "text": str(text),
                "score": float(score),
                "box": [min(xs), min(ys), max(xs), max(ys)],
            }
        )
    rows.sort(key=lambda row: (row["box"][1], row["box"][0]))
    return rows


def ocr_images(engine, image_paths, out_path, source_kind):
    if out_path.exists():
        return read_json(out_path)
    pages = []
    for index, image_path in enumerate(image_paths, start=1):
        lines = ocr_image(engine, image_path)
        pages.append(
            {
                "pageNo": index,
                "imagePath": str(image_path),
                "lineCount": len(lines),
                "lines": lines,
            }
        )
    data = {
        "generatedAt": now_iso(),
        "sourceKind": source_kind,
        "pageCount": len(pages),
        "pages": pages,
    }
    write_json(out_path, data)
    return data


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    from rapidocr import RapidOCR
    from rapidocr.utils.typings import LangRec

    engine = RapidOCR(params={"Rec.lang_type": LangRec.KOREAN})
    summary = read_json(SUMMARY_PATH)
    manifest = read_json(BATCH_DIR / f"selected_manifest_{BATCH_ID}_verified_counts.json")
    jobs = {job["examId"]: job for job in manifest["jobs"]}
    outputs = []

    for row in summary["items"]:
        exam_id = row["examId"]
        candidate_root = Path(row["candidateFile"]).parents[1]
        reports_dir = candidate_root / "reports" / "ocr_pages"
        page_images = sorted((PREFLIGHT_ROOT / exam_id / "pages").glob("page_p*.png"))
        problem_ocr_path = reports_dir / "problem_pages_ocr.json"
        problem = ocr_images(engine, page_images, problem_ocr_path, "problem_pdf_pages")

        job = jobs.get(exam_id, {})
        evidence = []
        for kind, key in [("answer_pdf", "answerPdfPath"), ("solution_pdf", "solutionPdfPath")]:
            pdf_path = job.get(key) or ""
            if not pdf_path:
                continue
            rendered_dir = reports_dir / kind
            rendered_pages = render_pdf_pages(pdf_path, rendered_dir, kind)
            ocr_path = reports_dir / f"{kind}_ocr.json"
            evidence.append(
                {
                    "kind": kind,
                    "pdfPath": pdf_path,
                    "ocrPath": str(ocr_path),
                    "pageCount": len(rendered_pages),
                }
            )
            ocr_images(engine, rendered_pages, ocr_path, kind)

        outputs.append(
            {
                "examId": exam_id,
                "problemOcrPath": str(problem_ocr_path),
                "problemPageCount": problem["pageCount"],
                "problemLineCount": sum(page["lineCount"] for page in problem["pages"]),
                "evidence": evidence,
            }
        )

    summary_out = {
        "generatedAt": now_iso(),
        "batchId": BATCH_ID,
        "jobCount": len(outputs),
        "items": outputs,
    }
    write_json(BATCH_DIR / f"ocr_cache_summary_{BATCH_ID}.json", summary_out)
    print(json.dumps(summary_out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
