import json
from datetime import datetime, timezone, timedelta
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REVIEW = ROOT / "archive" / "_generated" / "past-exams" / "high1_2022_2025" / "manager_content_choices_review.json"
OUT = ROOT / "reports" / "high1_exam_inventory_20260601" / "round18_1mid_content_choices_latest_B_remaining_after_worker.json"

ROUND18_B_EXAMS = {
    "24_매산여고_1학기_중간_고1_기출",
    "22_매산여고_1학기_중간_고1_기출",
    "22_복성고_1학기_중간_고1_기출",
}


def main() -> None:
    review = json.loads(REVIEW.read_text(encoding="utf-8"))
    rows = [
        row for row in review["rows"]
        if row["term"] == "1mid"
        and row["examId"] in ROUND18_B_EXAMS
        and (row["contentMissingCount"] or row["choicesNot5Count"])
    ]
    items = []
    for row in rows:
        item = dict(row)
        item["issueWeight"] = row["contentMissingCount"] + row["choicesNot5Count"]
        items.append(item)

    payload = {
        "generatedAt": datetime.now(timezone(timedelta(hours=9))).isoformat(timespec="seconds"),
        "sourceReview": str(REVIEW),
        "scope": "round18 latest 1mid content+choices remaining split B after worker",
        "split": "B",
        "itemCount": len(items),
        "issueWeight": sum(item["issueWeight"] for item in items),
        "items": items,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(OUT)
    print(f"itemCount={payload['itemCount']}")
    print(f"issueWeight={payload['issueWeight']}")


if __name__ == "__main__":
    main()
