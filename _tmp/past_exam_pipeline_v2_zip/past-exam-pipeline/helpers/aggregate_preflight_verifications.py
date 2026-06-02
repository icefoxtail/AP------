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


def main():
    root = Path("archive/_generated/past-exams/_preflight_1final_middle_m2_2022_2025")
    batch = Path("archive/_generated/past-exams/_batch")
    manifest = read_json(batch / "selected_manifest_1final_middle_m2_2022_2025_preflight.json")

    rows = []
    missing = []
    needs_review = []
    verified = []

    for job in manifest["jobs"]:
        exam_id = job["examId"]
        report_path = root / exam_id / "question_count_verification.json"
        if not report_path.exists():
            missing.append(exam_id)
            rows.append({
                "examId": exam_id,
                "status": "missing_verification",
                "questionCount": None,
                "objectiveCount": None,
                "subjectiveCount": None,
                "unclearItems": ["question_count_verification.json missing"],
                "reportPath": str(report_path),
            })
            continue

        report = read_json(report_path)
        status = report.get("status") or "needs_manual_review"
        unclear = report.get("unclearItems") or []
        row = {
            "examId": exam_id,
            "agent": report.get("agent", ""),
            "status": status,
            "questionCount": report.get("questionCount"),
            "objectiveCount": report.get("objectiveCount"),
            "subjectiveCount": report.get("subjectiveCount"),
            "pageQuestionRanges": report.get("pageQuestionRanges", []),
            "answerEvidence": report.get("answerEvidence", {}),
            "unclearItems": unclear,
            "notes": report.get("notes", []),
            "reportPath": str(report_path),
        }
        rows.append(row)
        if status == "verified" and not unclear and isinstance(row["questionCount"], int):
            verified.append(exam_id)
        else:
            needs_review.append(exam_id)

    summary = {
        "generatedAt": now_iso(),
        "sourceManifest": str(batch / "selected_manifest_1final_middle_m2_2022_2025_preflight.json"),
        "expectedCount": len(manifest["jobs"]),
        "verificationCount": len(rows) - len(missing),
        "missingCount": len(missing),
        "verifiedCount": len(verified),
        "needsReviewCount": len(needs_review),
        "safeToProceedToCropMap": len(missing) == 0 and len(needs_review) == 0,
        "missing": missing,
        "needsReview": needs_review,
        "verified": verified,
        "items": rows,
    }
    write_json(batch / "preflight_verification_aggregate_1final_middle_m2_2022_2025.json", summary)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
