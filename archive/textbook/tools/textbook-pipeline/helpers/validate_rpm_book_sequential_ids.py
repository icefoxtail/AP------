import json
import re
import sys
from collections import Counter
from pathlib import Path


BOOK_ROOTS = [
    Path("22개정 RPM 공통수학1"),
    Path("22개정 RPM 공통수학2"),
    Path("22개정 RPM 2-1"),
    Path("22개정 RPM 2-2"),
]


def parse_question_bank(path):
    text = path.read_text(encoding="utf-8")
    match = re.search(r"window\.questionBank\s*=\s*(\[.*\]);", text, re.S)
    if not match:
        raise ValueError(f"missing questionBank: {path}")
    return json.loads(match.group(1))


def validate_book(root):
    sequence_report = root / "generated" / "reports" / "id_sequence_report.json"
    if sequence_report.exists():
        data = json.loads(sequence_report.read_text(encoding="utf-8"))
        questions = data.get("items", [])
        by_setkey = data.get("by_setkey", {})
        ids = [item.get("id") for item in questions]
        restarts = [
            set_key
            for idx, (set_key, values) in enumerate(by_setkey.items())
            if idx > 0 and values and values[0] == 1
        ]
        js_files = list((root / "generated" / "js" / "workbook").glob("*.js"))
    else:
        questions = []
        restarts = []
        js_files = []
        ids = []
    if sequence_report.exists():
        pass
    else:
        return {
            "bookRoot": root.as_posix(),
            "jsFileCount": 0,
            "questionCount": 0,
            "status": "fail",
            "error": "missing id_sequence_report.json",
        }
    # Cross-check JS files still contain exactly the report ids.
    js_files = sorted((root / "generated" / "js" / "workbook").glob("*.js"))
    js_ids = []
    for js_file in js_files:
        bank = parse_question_bank(js_file)
        for question in bank:
            js_ids.append(question.get("id"))
    js_id_mismatch = sorted(set(ids) ^ set(js_ids), key=lambda value: str(value))
    counts = Counter(ids)
    duplicate_ids = sorted([key for key, count in counts.items() if count > 1])
    expected = list(range(1, len(ids) + 1))
    missing = sorted(set(expected) - set(ids))
    extra = sorted(set(ids) - set(expected), key=lambda value: str(value))
    bad_display = [item for item in questions if item.get("displayNo") in (None, "")]
    bad_question_no = [item for item in questions if item.get("questionNo") in (None, "")]
    return {
        "bookRoot": root.as_posix(),
        "jsFileCount": len(js_files),
        "questionCount": len(ids),
        "firstId": ids[0] if ids else None,
        "lastId": ids[-1] if ids else None,
        "duplicateIds": duplicate_ids[:50],
        "duplicateCount": len(duplicate_ids),
        "missingIds": missing[:50],
        "missingCount": len(missing),
        "extraIds": extra[:50],
        "extraCount": len(extra),
        "setKeyRestartViolations": restarts,
        "jsIdMismatchCount": len(js_id_mismatch),
        "jsIdMismatch": js_id_mismatch[:50],
        "missingDisplayNoCount": len(bad_display),
        "missingQuestionNoCount": len(bad_question_no),
        "status": "ok" if ids == expected and not restarts and not bad_display and not bad_question_no and not js_id_mismatch else "fail",
    }


def main():
    reports = [validate_book(root) for root in BOOK_ROOTS]
    status = "ok" if all(report["status"] == "ok" for report in reports) else "fail"
    print(json.dumps({"status": status, "books": reports}, ensure_ascii=False, indent=2))
    if status != "ok":
        sys.exit(1)


if __name__ == "__main__":
    main()
