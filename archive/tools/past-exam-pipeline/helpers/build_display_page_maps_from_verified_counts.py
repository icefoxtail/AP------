import json
import re
from datetime import datetime, timezone
from pathlib import Path


OBJECTIVE_PREFIXES = ("objective", "객관식")
SUBJECTIVE_PREFIXES = ("subjective", "서술형", "서·논술형", "서답형")


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def expand_numeric_range(text):
    values = []
    for start, end in re.findall(r"(\d+)\s*-\s*(\d+)", text):
        a, b = int(start), int(end)
        if a <= b:
            values.extend(range(a, b + 1))
    singles = re.findall(r"(?<![-\d])(\d+)(?!\s*-|\d)", text)
    for single in singles:
        value = int(single)
        if value not in values:
            values.append(value)
    return values


def expand_subjective_range(text):
    values = []
    for start, end in re.findall(r"(?:subjective|서술형|서·논술형|서답형)\s*(\d+)\s*-\s*(\d+)", text, flags=re.I):
        a, b = int(start), int(end)
        if a <= b:
            values.extend(range(a, b + 1))
    for single in re.findall(r"(?:subjective|서술형|서·논술형|서답형)\s*(\d+)", text, flags=re.I):
        value = int(single)
        if value not in values:
            values.append(value)
    return values


def is_answer_memo(row):
    text = f"{row.get('range', '')} {row.get('notes', '')}"
    return "정답 메모" in text or "문항 수 산정에서 제외" in text


def build_items(exam_root, verification):
    items = []
    objective_seen = set()
    subjective_seen = set()
    objective_count = verification.get("objectiveCount") or 0

    for page_range in verification.get("pageQuestionRanges", []):
        if is_answer_memo(page_range):
            continue
        page_no = int(page_range["pageNo"])
        full_page = exam_root / "pages" / f"page_p{page_no:03d}.png"
        text = f"{page_range.get('range', '')} {page_range.get('notes', '')}"

        subjective_values = expand_subjective_range(text)
        numeric_values = expand_numeric_range(page_range.get("range", ""))

        for no in numeric_values:
            if no <= objective_count and no not in objective_seen:
                objective_seen.add(no)
                items.append({
                    "id": len(items) + 1,
                    "displayNo": str(no),
                    "sourceQuestionNo": str(no),
                    "questionType": "객관식",
                    "pageNo": page_no,
                    "fullPageImagePath": str(full_page),
                    "mappingStatus": "page_range_verified",
                    "cropStatus": "pending_variable_crop",
                })

        for sub_no in subjective_values:
            if sub_no not in subjective_seen:
                subjective_seen.add(sub_no)
                display = f"서술형{sub_no}"
                items.append({
                    "id": len(items) + 1,
                    "displayNo": display,
                    "sourceQuestionNo": display,
                    "questionType": "서술형",
                    "pageNo": page_no,
                    "fullPageImagePath": str(full_page),
                    "mappingStatus": "page_range_verified",
                    "cropStatus": "pending_variable_crop",
                })

    return items


def main():
    batch = Path("archive/_generated/past-exams/_batch")
    preflight_root = Path("archive/_generated/past-exams/_preflight_1final_middle_m2_2022_2025")
    manifest = read_json(batch / "selected_manifest_1final_middle_m2_2022_2025_verified_counts.json")

    rows = []
    for job in manifest["jobs"]:
        exam_id = job["examId"]
        exam_root = preflight_root / exam_id
        verification_path = exam_root / "question_count_verification.json"
        verification = read_json(verification_path)
        items = build_items(exam_root, verification)
        expected = verification.get("questionCount")
        status = "ready_for_variable_crop" if len(items) == expected else "needs_manual_review"
        report = {
            "examId": exam_id,
            "generatedAt": now_iso(),
            "sourceVerification": str(verification_path),
            "expectedQuestionCount": expected,
            "mappedQuestionCount": len(items),
            "status": status,
            "items": items,
            "issues": [] if status == "ready_for_variable_crop" else ["mapped_count_does_not_match_verified_question_count"],
        }
        write_json(exam_root / "display_no_page_map_verified.json", report)
        rows.append({
            "examId": exam_id,
            "expectedQuestionCount": expected,
            "mappedQuestionCount": len(items),
            "status": status,
            "reportPath": str(exam_root / "display_no_page_map_verified.json"),
        })

    summary = {
        "generatedAt": now_iso(),
        "sourceManifest": str(batch / "selected_manifest_1final_middle_m2_2022_2025_verified_counts.json"),
        "jobCount": len(rows),
        "readyCount": sum(1 for row in rows if row["status"] == "ready_for_variable_crop"),
        "needsReviewCount": sum(1 for row in rows if row["status"] != "ready_for_variable_crop"),
        "safeToProceedToVariableCrop": all(row["status"] == "ready_for_variable_crop" for row in rows),
        "items": rows,
    }
    write_json(batch / "display_page_map_aggregate_1final_middle_m2_2022_2025.json", summary)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
