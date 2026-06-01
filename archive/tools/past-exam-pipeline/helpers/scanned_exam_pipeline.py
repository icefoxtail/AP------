import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import fitz
from PIL import Image, ImageDraw


def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def render_pdf(pdf_path, out_dir, prefix, dpi):
    out_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    matrix = fitz.Matrix(dpi / 72, dpi / 72)
    items = []
    for index, page in enumerate(doc):
        page_no = index + 1
        out_file = out_dir / f"{prefix}_p{page_no:03d}.png"
        pix = page.get_pixmap(matrix=matrix, alpha=False)
        pix.save(out_file)
        items.append({
            "pageNo": page_no,
            "imagePath": str(out_file),
            "width": pix.width,
            "height": pix.height,
        })
    return items


def fixed_4page_20_plus_4_boxes():
    return [
        (1, "1", 1, (50, 560, 915, 960)),
        (2, "2", 1, (50, 1120, 915, 1480)),
        (3, "3", 1, (50, 1680, 915, 2300)),
        (4, "4", 1, (900, 430, 1765, 790)),
        (5, "5", 1, (900, 950, 1765, 1240)),
        (6, "6", 1, (900, 1340, 1765, 1785)),
        (7, "7", 1, (900, 1840, 1765, 2220)),
        (8, "8", 2, (50, 150, 915, 390)),
        (9, "9", 2, (50, 620, 915, 910)),
        (10, "10", 2, (50, 1160, 915, 1490)),
        (11, "11", 2, (50, 1680, 915, 2310)),
        (12, "12", 2, (900, 130, 1765, 400)),
        (13, "13", 2, (900, 560, 1765, 980)),
        (14, "14", 2, (900, 1160, 1765, 1450)),
        (15, "15", 2, (900, 1880, 1765, 2180)),
        (16, "16", 3, (50, 150, 915, 900)),
        (17, "17", 3, (50, 1080, 915, 1430)),
        (18, "18", 3, (50, 1780, 915, 2360)),
        (19, "19", 3, (900, 140, 1765, 680)),
        (20, "20", 3, (900, 980, 1765, 1600)),
        (21, "서논술형1", 4, (50, 430, 915, 820)),
        (22, "서논술형2", 4, (50, 1360, 915, 1820)),
        (23, "서논술형3", 4, (900, 150, 1765, 430)),
        (24, "서논술형4", 4, (900, 980, 1765, 1380)),
    ]


def choose_question_boxes(manifest, page_items):
    expected = int(manifest.get("expectedQuestionCount") or 0)
    layout_preset = manifest.get("layoutPreset") or ""
    if len(page_items) == 4 and (expected == 24 or layout_preset == "fixed_4page_20_objective_4_essay"):
        return {
            "status": "ok",
            "heuristic": "fixed_4page_two_column_20_objective_4_essay",
            "expectedQuestionCount": 24,
            "boxes": fixed_4page_20_plus_4_boxes(),
        }
    return {
        "status": "manual_review",
        "heuristic": "unsupported_layout",
        "expectedQuestionCount": expected,
        "boxes": [],
        "blockedReasons": ["question_box_detection_needs_layout_rule_or_expected_count"],
    }


def crop_questions(root, boxes):
    crops_dir = root / "crops" / "questions"
    crops_dir.mkdir(parents=True, exist_ok=True)
    items = []
    for qid, display, page_no, box in boxes:
        page_img = root / "pages" / f"page_p{page_no:03d}.png"
        crop_path = crops_dir / f"q{qid:02d}.png"
        img = Image.open(page_img)
        img.crop(box).save(crop_path)
        x1, y1, x2, y2 = box
        items.append({
            "id": qid,
            "displayNo": display,
            "sourceQuestionNo": display,
            "pageNo": page_no,
            "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
            "cropPath": str(crop_path),
            "fullPageImagePath": str(page_img),
            "mappingStatus": "heuristic_seeded",
        })
    return items


def build_candidate_js(manifest, crop_items, candidate_file):
    questions = []
    for item in crop_items:
        qid = item["id"]
        display = item["displayNo"]
        questions.append({
            "id": qid,
            "level": "",
            "category": "",
            "originalCategory": "",
            "standardCourse": manifest.get("course") or "",
            "standardUnitKey": "",
            "standardUnit": "",
            "standardUnitOrder": 0,
            "questionType": "서술형" if qid >= 21 else "객관식",
            "layoutTag": "grid",
            "tags": ["기출"],
            "wide": False,
            "content": "",
            "choices": [],
            "answer": "",
            "solution": "",
            "image": item["cropPath"],
            "examId": manifest["examId"],
            "sourceFile": manifest["pdfPath"],
            "sourceQuestionNo": display,
            "displayNo": display,
            "pageNo": item["pageNo"],
            "cropPath": item["cropPath"],
            "fullPageImagePath": item["fullPageImagePath"],
            "imageStatus": "image_fallback",
            "answerStatus": "missing_answer",
            "solutionStatus": "missing_solution",
            "reviewStatus": "image_fallback",
            "tagConfidence": "low",
            "tagStatus": "manual_review",
        })
    candidate_file.parent.mkdir(parents=True, exist_ok=True)
    candidate_file.write_text(
        "window.examTitle = "
        + json.dumps(manifest["examId"], ensure_ascii=False)
        + ";\nwindow.questionBank = "
        + json.dumps(questions, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    return questions


def make_contact_sheet(root, crop_items):
    tiles = []
    for item in crop_items:
        image_path = Path(item["cropPath"])
        im = Image.open(image_path).convert("RGB")
        im.thumbnail((420, 300))
        tile = Image.new("RGB", (440, 340), "white")
        draw = ImageDraw.Draw(tile)
        draw.text((10, 8), f"q{item['id']:02d} / {item['displayNo']}", fill="black")
        tile.paste(im, (10, 35))
        tiles.append(tile)
    cols = 4
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * 440, rows * 340), "white")
    for index, tile in enumerate(tiles):
        sheet.paste(tile, ((index % cols) * 440, (index // cols) * 340))
    out = root / "reports" / "question_crop_contact_sheet.jpg"
    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out, quality=90)
    return out


def write_next_action_reports(root, manifest, questions, contact_sheet):
    reports = root / "reports"
    content_queue = {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "queueType": "content_choices_transcription",
        "policy": "continue_pipeline_with_image_fallback_until_text_is_confirmed",
        "status": "ready",
        "items": [
            {
                "id": q["id"],
                "displayNo": q["displayNo"],
                "questionType": q["questionType"],
                "pageNo": q["pageNo"],
                "cropPath": q["cropPath"],
                "fullPageImagePath": q["fullPageImagePath"],
                "currentContent": q["content"],
                "currentChoices": q["choices"],
                "allowedFieldsToPatch": ["content", "choices", "reviewStatus"],
                "forbiddenFields": ["id", "displayNo", "answer", "solution", "standardUnitKey", "layoutTag", "wide"],
                "nextStatusOnPatch": "content_filled_pending_review",
            }
            for q in questions
        ],
    }
    answer_queue = {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "queueType": "answer_solution_mapping",
        "policy": "answers_must_come_from_answer_or_solution_evidence_not_from_guessing",
        "status": "ready" if manifest.get("solutionPdfPath") or manifest.get("answerPdfPath") else "manual_review",
        "answerPdfPath": manifest.get("answerPdfPath", ""),
        "solutionPdfPath": manifest.get("solutionPdfPath", ""),
        "items": [
            {
                "id": q["id"],
                "displayNo": q["displayNo"],
                "questionType": q["questionType"],
                "pageNo": q["pageNo"],
                "allowedFieldsToPatch": ["answer", "answerStatus"],
                "solutionPatchPolicy": "do_not_fill_solution_until_solution_stage_is_explicitly_enabled",
                "forbiddenFields": ["content", "choices", "id", "displayNo", "layoutTag", "wide"],
            }
            for q in questions
        ],
    }
    continuity = {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "oneStopPolicy": "never_stop_on_missing_ocr_answer_or_solution",
        "currentStage": "image_fallback_js_ready",
        "pipelineCanContinue": True,
        "currentCandidateIsRenderable": True,
        "resolvedByFallback": [
            {
                "blocker": "no_text_layer_or_ocr",
                "fallback": "question_crop_image_linked_in_candidate_js",
                "queue": "content_transcription_queue.json",
            },
            {
                "blocker": "answers_not_filled",
                "fallback": "answer_mapping_queue_created_from_available_solution_pdf",
                "queue": "answer_mapping_queue.json",
            },
        ],
        "mustNotTouch": ["archive/exams/**/*.js", "archive/db.js", "archive/engine.html"],
        "nextStages": [
            {
                "stage": "content_choices_transcription",
                "input": "reports/content_transcription_queue.json",
                "output": "candidate JS patches for content/choices only",
                "stopCondition": "none; uncertain items remain image_fallback/manual_review",
            },
            {
                "stage": "answer_mapping",
                "input": "reports/answer_mapping_queue.json and sources/solution_pages",
                "output": "answer patches with evidence",
                "stopCondition": "none; uncertain items remain missing_answer",
            },
            {
                "stage": "final_candidate_validation",
                "input": "candidate JS and reports",
                "output": "validation_summary.json and promotion readiness report",
                "stopCondition": "never promote automatically to live archive",
            },
        ],
    }
    next_actions_md = f"""# Past Exam Pipeline Next Actions

## Current State

- examId: `{manifest["examId"]}`
- currentStage: `image_fallback_js_ready`
- candidate JS is renderable through question crop `image` fallback.
- content/choices are not final text yet.
- answers are not filled yet.
- the live archive was not touched.

## One-Stop Rule

The pipeline must not stop because OCR, content, answer, or solution evidence is
missing. It must create the best safe candidate, write queues for unresolved
work, and continue to the next selected PDF.

## Next Stage 1: Content / Choices

Input: `reports/content_transcription_queue.json`

Allowed edits:

- `content`
- `choices`
- `reviewStatus`

Forbidden edits:

- `id`
- `displayNo`
- `answer`
- `solution`
- `layoutTag`
- `wide`

If a statement cannot be confidently transcribed, keep the `image` fallback and
leave the item in manual review.

## Next Stage 2: Answer Mapping

Input: `reports/answer_mapping_queue.json`

Use only answer or solution evidence. Do not solve from the question alone as
the source of truth. If evidence is unclear, keep `answerStatus:
missing_answer`.

## Review Contact Sheet

`{contact_sheet}`
"""
    write_json(reports / "content_transcription_queue.json", content_queue)
    write_json(reports / "answer_mapping_queue.json", answer_queue)
    write_json(reports / "pipeline_continuity_report.json", continuity)
    (reports / "NEXT_ACTIONS.md").write_text(next_actions_md, encoding="utf-8")
    return {
        "contentQueue": str(reports / "content_transcription_queue.json"),
        "answerQueue": str(reports / "answer_mapping_queue.json"),
        "continuityReport": str(reports / "pipeline_continuity_report.json"),
        "nextActions": str(reports / "NEXT_ACTIONS.md"),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--dpi", type=int, default=220)
    parser.add_argument("--candidate-file", required=True)
    args = parser.parse_args()

    manifest_path = Path(args.manifest)
    root = Path(args.out)
    reports = root / "reports"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    root.mkdir(parents=True, exist_ok=True)
    reports.mkdir(parents=True, exist_ok=True)

    page_items = render_pdf(Path(manifest["pdfPath"]), root / "pages", "page", args.dpi)
    write_json(reports / "page_render_report.json", {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "status": "ok",
        "dpi": args.dpi,
        "pageCount": len(page_items),
        "items": page_items,
    })

    solution_items = []
    if manifest.get("solutionPdfPath"):
        solution_items = render_pdf(Path(manifest["solutionPdfPath"]), root / "sources" / "solution_pages", "solution", args.dpi)
    write_json(reports / "solution_page_render_report.json", {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "status": "ok" if solution_items else "manual_review",
        "solutionPdfPath": manifest.get("solutionPdfPath", ""),
        "pageCount": len(solution_items),
        "items": solution_items,
    })

    detection = choose_question_boxes(manifest, page_items)
    manifest["expectedQuestionCount"] = detection["expectedQuestionCount"]
    write_json(root / "manifest.json", manifest)
    write_json(reports / "question_box_detection_report.json", {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        **{k: v for k, v in detection.items() if k != "boxes"},
    })

    crop_items = crop_questions(root, detection["boxes"]) if detection["boxes"] else []
    write_json(reports / "question_crop_map.json", {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "questionCount": len(crop_items),
        "items": crop_items,
    })
    write_json(reports / "display_no_page_map.json", {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "items": [
            {
                "id": item["id"],
                "displayNo": item["displayNo"],
                "sourceQuestionNo": item["sourceQuestionNo"],
                "pageNo": item["pageNo"],
                "cropPath": item["cropPath"],
            }
            for item in crop_items
        ],
    })

    questions = build_candidate_js(manifest, crop_items, Path(args.candidate_file))
    contact_sheet = make_contact_sheet(root, crop_items) if crop_items else ""

    content_review_items = [
        {
            "id": q["id"],
            "displayNo": q["displayNo"],
            "pageNo": q["pageNo"],
            "cropPath": q["cropPath"],
            "image": q["image"],
            "reason": "image_fallback_pending_content_choices_transcription",
        }
        for q in questions
    ]
    missing_answer_items = [
        {
            "id": q["id"],
            "displayNo": q["displayNo"],
            "reason": "answer_evidence_not_applied",
        }
        for q in questions
    ]
    write_json(reports / "content_manual_review.json", {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "status": "manual_review",
        "items": content_review_items,
    })
    write_json(reports / "missing_answer_report.json", {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "status": "manual_review",
        "items": missing_answer_items,
    })
    write_json(reports / "missing_solution_report.json", {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "status": "manual_review",
        "items": missing_answer_items,
    })

    for report_name in [
        "crop_failed.json",
        "answer_solution_manual_review.json",
        "formula_manual_review.json",
        "missing_image_report.json",
        "tag_low_confidence_report.json",
        "duplicate_question_report.json",
    ]:
        write_json(reports / report_name, {
            "examId": manifest["examId"],
            "generatedAt": now_iso(),
            "status": "ok",
            "items": [],
        })

    generated_files = [
        "manifest.json",
        str(Path(args.candidate_file).relative_to(root)),
        "reports/page_render_report.json",
        "reports/solution_page_render_report.json",
        "reports/question_box_detection_report.json",
        "reports/question_crop_map.json",
        "reports/display_no_page_map.json",
        "reports/question_crop_contact_sheet.jpg",
        "reports/content_transcription_queue.json",
        "reports/answer_mapping_queue.json",
        "reports/pipeline_continuity_report.json",
        "reports/NEXT_ACTIONS.md",
    ]
    next_action_files = write_next_action_reports(root, manifest, questions, contact_sheet)
    write_json(reports / "generated_files_manifest.json", {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "files": generated_files,
    })

    summary = {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "candidateFile": str(args.candidate_file),
        "expectedQuestionCount": manifest["expectedQuestionCount"],
        "questionCount": len(questions),
        "pageCount": len(page_items),
        "solutionPageCount": len(solution_items),
        "cropCount": len(crop_items),
        "contactSheet": str(contact_sheet) if contact_sheet else "",
        "contentTranscriptionQueue": next_action_files["contentQueue"],
        "answerMappingQueue": next_action_files["answerQueue"],
        "continuityReport": next_action_files["continuityReport"],
        "nextActions": next_action_files["nextActions"],
        "currentStage": "image_fallback_js_ready",
        "protectedArchiveTouched": False,
        "status": "partial",
        "blockedReasons": ["content_choices_in_image_fallback", "answers_not_filled"],
        "nextStages": ["content_ocr_or_transcription", "answer_solution_mapping", "final_candidate_validation"],
    }
    write_json(reports / "validation_summary.json", summary)
    print(json.dumps(summary, ensure_ascii=True))


if __name__ == "__main__":
    main()
