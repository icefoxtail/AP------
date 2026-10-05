import json
import re
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(r"C:\Users\USER\Desktop\AP------\archive\_generated\past-exams\high1_2022_2025")
OUT = ROOT / "manager_semantic_review.json"
MD_OUT = ROOT / "manager_semantic_review.md"
PLACEHOLDERS = ("unavailable", "pending", "확인 필요", "직접불가", "????", "[????]")


def extract_question_bank(text: str):
    match = re.search(r"window\.questionBank\s*=\s*(\[.*?\]);?\s*$", text, re.S)
    if not match:
        raise ValueError("window.questionBank array not found")
    return json.loads(match.group(1))


def is_objective(question):
    qtype = str(question.get("questionType") or "")
    display = str(question.get("displayNo") or "")
    return "객관" in qtype or display.isdigit() and int(display) <= 20


def main():
    reports = []
    totals = Counter()
    by_term = defaultdict(Counter)
    parse_errors = []

    for candidate in sorted(ROOT.rglob("*.candidate.js")):
        term = candidate.relative_to(ROOT).parts[0]
        try:
            text = candidate.read_text(encoding="utf-8")
            questions = extract_question_bank(text)
        except Exception as exc:
            parse_errors.append({"candidateFile": str(candidate), "error": str(exc)})
            totals["parse_errors"] += 1
            by_term[term]["parse_errors"] += 1
            continue

        report = {
            "candidateFile": str(candidate),
            "term": term,
            "examId": candidate.parent.parent.name,
            "questionCount": len(questions),
            "issues": [],
        }
        for question in questions:
            display = str(question.get("displayNo") or question.get("id") or "")
            content = str(question.get("content") or "").strip()
            answer = str(question.get("answer") or "").strip()
            solution = str(question.get("solution") or "").strip()
            choices = question.get("choices") or []

            if not content:
                report["issues"].append({"displayNo": display, "issue": "content_missing"})
                totals["content_missing"] += 1
                by_term[term]["content_missing"] += 1
            if is_objective(question) and len(choices) != 5:
                report["issues"].append({"displayNo": display, "issue": "objective_choices_not_5"})
                totals["objective_choices_not_5"] += 1
                by_term[term]["objective_choices_not_5"] += 1
            if not answer:
                report["issues"].append({"displayNo": display, "issue": "answer_missing"})
                totals["answer_missing"] += 1
                by_term[term]["answer_missing"] += 1
            elif answer in {"?", "？"}:
                report["issues"].append({"displayNo": display, "issue": "answer_placeholder"})
                totals["answer_placeholder"] += 1
                by_term[term]["answer_placeholder"] += 1
            if not solution:
                report["issues"].append({"displayNo": display, "issue": "solution_missing"})
                totals["solution_missing"] += 1
                by_term[term]["solution_missing"] += 1
            elif not solution.startswith("[스포인트]"):
                report["issues"].append({"displayNo": display, "issue": "solution_missing_spoint_prefix"})
                totals["solution_missing_spoint_prefix"] += 1
                by_term[term]["solution_missing_spoint_prefix"] += 1

            combined = "\n".join([content, answer, solution, json.dumps(choices, ensure_ascii=False)])
            if any(token in combined for token in PLACEHOLDERS):
                report["issues"].append({"displayNo": display, "issue": "placeholder_literal"})
                totals["placeholder_literal"] += 1
                by_term[term]["placeholder_literal"] += 1

        if report["issues"]:
            totals["blocked_candidates"] += 1
            by_term[term]["blocked_candidates"] += 1
        reports.append(report)
        totals["candidate_files"] += 1
        totals["questions"] += len(questions)
        by_term[term]["candidate_files"] += 1
        by_term[term]["questions"] += len(questions)

    summary = {
        "root": str(ROOT),
        "candidateFileCount": totals["candidate_files"],
        "questionCount": totals["questions"],
        "parseErrorCount": totals["parse_errors"],
        "blockedCandidateCount": totals["blocked_candidates"],
        "issueCounts": dict(totals),
        "issueCountsByTerm": {term: dict(counts) for term, counts in sorted(by_term.items())},
        "parseErrors": parse_errors,
        "reports": reports,
    }
    OUT.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# High1 Generated Semantic Review\n\n",
        f"- candidateFileCount: {summary['candidateFileCount']}\n",
        f"- questionCount: {summary['questionCount']}\n",
        f"- parseErrorCount: {summary['parseErrorCount']}\n",
        f"- blockedCandidateCount: {summary['blockedCandidateCount']}\n\n",
        "## Issue Counts\n\n",
    ]
    for key, value in sorted(summary["issueCounts"].items()):
        lines.append(f"- {key}: {value}\n")
    lines.append("\n## By Term\n\n")
    for term, counts in summary["issueCountsByTerm"].items():
        lines.append(f"### {term}\n")
        for key, value in sorted(counts.items()):
            lines.append(f"- {key}: {value}\n")
        lines.append("\n")
    MD_OUT.write_text("".join(lines), encoding="utf-8-sig")
    print(json.dumps({k: summary[k] for k in ("candidateFileCount", "questionCount", "parseErrorCount", "blockedCandidateCount", "issueCountsByTerm")}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
