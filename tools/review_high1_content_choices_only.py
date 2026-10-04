import json
import re
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(r"C:\Users\USER\Desktop\AP------\archive\_generated\past-exams\high1_2022_2025")
OUT = ROOT / "manager_content_choices_review.json"
MD_OUT = ROOT / "manager_content_choices_review.md"


def extract_question_bank(text):
    match = re.search(r"window\.questionBank\s*=\s*(\[.*?\]);?\s*$", text, re.S)
    if not match:
        raise ValueError("window.questionBank array not found")
    return json.loads(match.group(1))


def is_objective(question):
    qtype = str(question.get("questionType") or "")
    display = str(question.get("displayNo") or "")
    return "객관" in qtype or display.isdigit() and int(display) <= 20


def bad_text(value):
    text = str(value or "").strip()
    return (not text) or "????" in text or "[????]" in text


def main():
    totals = Counter()
    by_term = defaultdict(Counter)
    rows = []
    parse_errors = []
    for candidate in sorted(ROOT.rglob("*.candidate.js")):
        term = candidate.relative_to(ROOT).parts[0]
        exam_id = candidate.parent.parent.name
        try:
            questions = extract_question_bank(candidate.read_text(encoding="utf-8"))
        except Exception as exc:
            parse_errors.append({"candidateFile": str(candidate), "error": str(exc)})
            totals["parse_errors"] += 1
            by_term[term]["parse_errors"] += 1
            continue

        content_missing = []
        choices_not_5 = []
        for q in questions:
            display = str(q.get("displayNo") or q.get("id") or "")
            if bad_text(q.get("content")):
                content_missing.append(display)
            if is_objective(q) and len(q.get("choices") or []) != 5:
                choices_not_5.append(display)
        row = {
            "term": term,
            "examId": exam_id,
            "candidateFile": str(candidate),
            "questionCount": len(questions),
            "contentMissingCount": len(content_missing),
            "choicesNot5Count": len(choices_not_5),
            "contentMissingDisplayNos": content_missing,
            "choicesNot5DisplayNos": choices_not_5,
            "contentChoicesComplete": not content_missing and not choices_not_5,
        }
        rows.append(row)
        totals["candidate_files"] += 1
        totals["questions"] += len(questions)
        totals["content_missing"] += len(content_missing)
        totals["objective_choices_not_5"] += len(choices_not_5)
        if not row["contentChoicesComplete"]:
            totals["blocked_candidates"] += 1
        by_term[term]["candidate_files"] += 1
        by_term[term]["questions"] += len(questions)
        by_term[term]["content_missing"] += len(content_missing)
        by_term[term]["objective_choices_not_5"] += len(choices_not_5)
        if not row["contentChoicesComplete"]:
            by_term[term]["blocked_candidates"] += 1

    term_order = {"1mid": 0, "1final": 1, "2mid": 2, "2final": 3}
    rows.sort(key=lambda r: (term_order.get(r["term"], 99), r["examId"]))
    summary = {
        "root": str(ROOT),
        "parseErrors": parse_errors,
        "issueCounts": dict(totals),
        "issueCountsByTerm": {term: dict(counts) for term, counts in sorted(by_term.items())},
        "rows": rows,
    }
    OUT.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    labels = {"1mid": "1학기 중간", "1final": "1학기 기말", "2mid": "2학기 중간", "2final": "2학기 기말"}
    lines = ["# Content + Choices Only Review\n\n"]
    for key in ("candidate_files", "questions", "blocked_candidates", "content_missing", "objective_choices_not_5", "parse_errors"):
        lines.append(f"- {key}: {totals[key]}\n")
    lines.append("\n")
    for term in ("1mid", "1final", "2mid", "2final"):
        counts = by_term[term]
        lines.append(f"## {labels[term]}\n\n")
        lines.append(f"- blocked: {counts['blocked_candidates']} / {counts['candidate_files']}\n")
        lines.append(f"- content_missing: {counts['content_missing']}\n")
        lines.append(f"- objective_choices_not_5: {counts['objective_choices_not_5']}\n\n")
        lines.append("| 시험지 | content 누락 | choices 미완 | 상태 |\n")
        lines.append("|---|---:|---:|---|\n")
        for row in [r for r in rows if r["term"] == term]:
            state = "완료" if row["contentChoicesComplete"] else "잔여"
            lines.append(f"| {row['examId']} | {row['contentMissingCount']} | {row['choicesNot5Count']} | {state} |\n")
        lines.append("\n")
    MD_OUT.write_text("".join(lines), encoding="utf-8-sig")
    print(json.dumps({"issueCounts": summary["issueCounts"], "issueCountsByTerm": summary["issueCountsByTerm"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
