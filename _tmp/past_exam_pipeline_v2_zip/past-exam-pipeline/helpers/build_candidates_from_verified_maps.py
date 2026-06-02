import json
from datetime import datetime, timezone
from pathlib import Path


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def make_question(job, item, display_no):
    return {
        "id": item["id"],
        "level": "",
        "category": "",
        "originalCategory": "",
        "standardCourse": job.get("course") or "수학",
        "standardUnitKey": "",
        "standardUnit": "",
        "standardUnitOrder": 0,
        "questionType": item.get("questionType") or "",
        "layoutTag": "grid",
        "tags": ["기출"],
        "wide": False,
        "content": "",
        "choices": [],
        "answer": "",
        "solution": "",
        "image": item["fullPageImagePath"],
        "examId": job["examId"],
        "sourceFile": job["pdfPath"],
        "sourceQuestionNo": item["sourceQuestionNo"],
        "sourceDisplayNoLabel": item["displayNo"],
        "displayNo": display_no,
        "pageNo": item["pageNo"],
        "fullPageImagePath": item["fullPageImagePath"],
        "imageStatus": "full_page_fallback",
        "answerStatus": "missing_answer",
        "solutionStatus": "missing_solution",
        "reviewStatus": "full_page_fallback_pending_crop_or_transcription",
        "tagConfidence": "low",
        "tagStatus": "manual_review",
    }


def write_candidate_js(path, exam_id, questions):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "window.examTitle = "
        + json.dumps(exam_id, ensure_ascii=False)
        + ";\nwindow.questionBank = "
        + json.dumps(questions, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )


def validate_candidate(job, questions):
    missing_images = [
        q["displayNo"]
        for q in questions
        if q.get("image") and not Path(q["image"]).exists()
    ]
    duplicate_display = []
    seen = set()
    for q in questions:
        display_no = q["displayNo"]
        if display_no in seen:
            duplicate_display.append(display_no)
        seen.add(display_no)
    expected = int(job.get("expectedQuestionCount") or 0)
    issues = []
    if len(questions) != expected:
        issues.append("question_count_mismatch")
    if missing_images:
        issues.append("missing_full_page_images")
    if duplicate_display:
        issues.append("duplicate_display_no")
    return {
        "expectedQuestionCount": expected,
        "questionCount": len(questions),
        "missingImages": missing_images,
        "duplicateDisplayNo": duplicate_display,
        "status": "full_page_fallback_validation_passed" if not issues else "needs_review",
        "issues": issues,
    }


def main():
    batch = Path("archive/_generated/past-exams/_batch")
    preflight_root = Path("archive/_generated/past-exams/_preflight_1final_middle_m2_2022_2025")
    generated_root = Path("archive/_generated/past-exams/_candidates_1final_middle_m2_2022_2025")
    manifest = read_json(batch / "selected_manifest_1final_middle_m2_2022_2025_verified_counts.json")

    rows = []
    for job in manifest["jobs"]:
        exam_id = job["examId"]
        map_report = read_json(preflight_root / exam_id / "display_no_page_map_verified.json")
        out_dir = generated_root / exam_id
        reports_dir = out_dir / "reports"
        candidate_file = out_dir / "candidate" / f"{exam_id}.candidate.js"
        questions = [
            make_question(job, item, index)
            for index, item in enumerate(map_report["items"], start=1)
        ]
        write_candidate_js(candidate_file, exam_id, questions)

        validation = validate_candidate(job, questions)
        content_queue = {
            "examId": exam_id,
            "generatedAt": now_iso(),
            "queueType": "content_choices_transcription",
            "status": "ready",
            "items": [
                {
                    "id": q["id"],
                    "displayNo": q["displayNo"],
                    "questionType": q["questionType"],
                    "pageNo": q["pageNo"],
                    "fullPageImagePath": q["fullPageImagePath"],
                    "allowedFieldsToPatch": ["content", "choices", "reviewStatus"],
                    "forbiddenFields": ["id", "displayNo", "answer", "solution", "layoutTag", "wide"],
                }
                for q in questions
            ],
        }
        answer_queue = {
            "examId": exam_id,
            "generatedAt": now_iso(),
            "queueType": "answer_mapping",
            "status": "ready" if job.get("answerPdfPath") or job.get("solutionPdfPath") else "ready_for_direct_solve",
            "answerPdfPath": job.get("answerPdfPath", ""),
            "solutionPdfPath": job.get("solutionPdfPath", ""),
            "answerFallbackPolicy": "Directly solve after extraction from verified content, choices, and source images. Use official answer evidence only as cross-check material. Do not guess.",
            "solutionFallbackPolicy": "Write a student-facing solution immediately after the answer is solved, then cross-check official solution evidence if present.",
            "crossValidationPolicy": "When official answer/solution sources exist, compare them after direct solving. Fix confirmed mistakes; if the source appears wrong, keep the direct solution and report the conflict.",
            "rulebooksToReadWhenSolving": [
                "archive/archive/docs/PAST_EXAM_PDF_TO_JS_PIPELINE_RULEBOOK.md",
                "rules/해설프로토콜.md",
                "archive/textbook/🤖 JS아카이브 발문·보기 추출 프로토콜 v4.md",
            ],
            "items": [
                {
                    "id": q["id"],
                    "displayNo": q["displayNo"],
                    "questionType": q["questionType"],
                    "pageNo": q["pageNo"],
                    "allowedFieldsToPatch": [
                        "answer",
                        "answerStatus",
                        "solution",
                        "solutionStatus",
                        "level",
                        "category",
                        "originalCategory",
                        "standardCourse",
                        "standardUnitKey",
                        "standardUnit",
                        "standardUnitOrder",
                        "tagConfidence",
                        "tagStatus",
                    ],
                    "forbiddenFields": ["content", "choices", "id", "displayNo", "layoutTag", "wide"],
                    "directSolveRequiredWhenMissing": ["answer", "solution"],
                }
                for q in questions
            ],
        }
        final_report = {
            "examId": exam_id,
            "generatedAt": now_iso(),
            "candidateFile": str(candidate_file),
            "displayPageMap": str(preflight_root / exam_id / "display_no_page_map_verified.json"),
            "protectedArchiveTouched": False,
            "currentStage": validation["status"],
            **validation,
            "contentTranscriptionQueue": str(reports_dir / "content_transcription_queue.json"),
            "answerMappingQueue": str(reports_dir / "answer_mapping_queue.json"),
        }
        write_json(reports_dir / "content_transcription_queue.json", content_queue)
        write_json(reports_dir / "answer_mapping_queue.json", answer_queue)
        write_json(reports_dir / "final_validation_report.json", final_report)
        rows.append({
            "examId": exam_id,
            "candidateFile": str(candidate_file),
            "questionCount": validation["questionCount"],
            "expectedQuestionCount": validation["expectedQuestionCount"],
            "status": validation["status"],
            "issues": validation["issues"],
            "contentTranscriptionQueue": str(reports_dir / "content_transcription_queue.json"),
            "answerMappingQueue": str(reports_dir / "answer_mapping_queue.json"),
        })

    summary = {
        "generatedAt": now_iso(),
        "sourceManifest": str(batch / "selected_manifest_1final_middle_m2_2022_2025_verified_counts.json"),
        "generatedRoot": str(generated_root),
        "jobCount": len(rows),
        "passedCount": sum(1 for row in rows if row["status"] == "full_page_fallback_validation_passed"),
        "needsReviewCount": sum(1 for row in rows if row["status"] != "full_page_fallback_validation_passed"),
        "protectedArchiveTouched": False,
        "status": "full_page_fallback_candidates_ready"
        if all(row["status"] == "full_page_fallback_validation_passed" for row in rows)
        else "needs_review",
        "items": rows,
    }
    write_json(batch / "candidate_generation_summary_1final_middle_m2_2022_2025.json", summary)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
