import json
import re
from pathlib import Path


ROOT = Path(r"C:\Users\USER\Desktop\AP------\archive\_generated\past-exams\high1_2022_2025")
OUT_JSON = ROOT / "manager_round6_per_exam_report.json"
OUT_MD = ROOT / "manager_round6_per_exam_report.md"


def extract_question_bank(text):
    match = re.search(r"window\.questionBank\s*=\s*(\[.*?\]);?\s*$", text, re.S)
    if not match:
        raise ValueError("window.questionBank array not found")
    return json.loads(match.group(1))


def is_objective(question):
    qtype = str(question.get("questionType") or "")
    display = str(question.get("displayNo") or "")
    return "객관" in qtype or display.isdigit() and int(display) <= 20


def main():
    rows = []
    term_order = {"1mid": 0, "1final": 1, "2mid": 2, "2final": 3}
    for candidate in sorted(ROOT.rglob("*.candidate.js")):
        term = candidate.relative_to(ROOT).parts[0]
        exam_id = candidate.parent.parent.name
        questions = extract_question_bank(candidate.read_text(encoding="utf-8"))
        total = len(questions)
        restored_content = 0
        restored_answers = 0
        restored_solutions = 0
        objective_total = 0
        objective_choices_ok = 0
        issue_display = []
        for question in questions:
            display = str(question.get("displayNo") or question.get("id") or "")
            content_ok = bool(str(question.get("content") or "").strip())
            answer_ok = bool(str(question.get("answer") or "").strip())
            solution = str(question.get("solution") or "").strip()
            solution_ok = solution.startswith("[스포인트]")
            choices_ok = True
            if is_objective(question):
                objective_total += 1
                choices_ok = len(question.get("choices") or []) == 5
                if choices_ok:
                    objective_choices_ok += 1
            if content_ok:
                restored_content += 1
            if answer_ok:
                restored_answers += 1
            if solution_ok:
                restored_solutions += 1
            if not (content_ok and answer_ok and solution_ok and choices_ok):
                issue_display.append(display)
        complete = not issue_display
        rows.append(
            {
                "term": term,
                "examId": exam_id,
                "candidateFile": str(candidate),
                "questionCount": total,
                "restoredContent": restored_content,
                "restoredAnswers": restored_answers,
                "restoredSolutions": restored_solutions,
                "objectiveChoicesOk": objective_choices_ok,
                "objectiveTotal": objective_total,
                "remainingQuestions": len(issue_display),
                "remainingDisplayNos": issue_display,
                "complete": complete,
            }
        )

    rows.sort(key=lambda row: (term_order.get(row["term"], 99), row["examId"]))
    summary = {
        "root": str(ROOT),
        "candidateCount": len(rows),
        "completeCount": sum(1 for row in rows if row["complete"]),
        "blockedCount": sum(1 for row in rows if not row["complete"]),
        "questionCount": sum(row["questionCount"] for row in rows),
        "restoredContent": sum(row["restoredContent"] for row in rows),
        "remainingQuestions": sum(row["remainingQuestions"] for row in rows),
        "byTerm": {},
        "rows": rows,
    }
    for term in ("1mid", "1final", "2mid", "2final"):
        term_rows = [row for row in rows if row["term"] == term]
        summary["byTerm"][term] = {
            "candidateCount": len(term_rows),
            "completeCount": sum(1 for row in term_rows if row["complete"]),
            "blockedCount": sum(1 for row in term_rows if not row["complete"]),
            "questionCount": sum(row["questionCount"] for row in term_rows),
            "restoredContent": sum(row["restoredContent"] for row in term_rows),
            "remainingQuestions": sum(row["remainingQuestions"] for row in term_rows),
        }

    OUT_JSON.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    labels = {"1mid": "1학기 중간", "1final": "1학기 기말", "2mid": "2학기 중간", "2final": "2학기 기말"}
    lines = ["# 고1 2022-2025 Round 6 시험지별 중간보고\n\n"]
    lines.append(
        f"- 후보: {summary['candidateCount']}개\n"
        f"- 완료: {summary['completeCount']}개\n"
        f"- 잔여 있음: {summary['blockedCount']}개\n"
        f"- 문항: {summary['questionCount']}개\n"
        f"- content 복원: {summary['restoredContent']}개\n"
        f"- 잔여 문항: {summary['remainingQuestions']}개\n\n"
    )
    for term in ("1mid", "1final", "2mid", "2final"):
        item = summary["byTerm"][term]
        lines.append(f"## {labels[term]}\n\n")
        lines.append(
            f"- 시험지 {item['candidateCount']}개 / 완료 {item['completeCount']}개 / 잔여 {item['blockedCount']}개\n"
            f"- 문항 {item['questionCount']}개 / 복원 {item['restoredContent']}개 / 잔여 {item['remainingQuestions']}개\n\n"
        )
        lines.append("| 시험지 | 복원 | 객관식 5지 | 잔여 | 상태 |\n")
        lines.append("|---|---:|---:|---:|---|\n")
        for row in [r for r in rows if r["term"] == term]:
            state = "완료" if row["complete"] else "잔여"
            lines.append(
                f"| {row['examId']} | {row['restoredContent']}/{row['questionCount']} | "
                f"{row['objectiveChoicesOk']}/{row['objectiveTotal']} | {row['remainingQuestions']} | {state} |\n"
            )
        lines.append("\n")

    OUT_MD.write_text("".join(lines), encoding="utf-8-sig")
    print(json.dumps({k: summary[k] for k in ("candidateCount", "completeCount", "blockedCount", "questionCount", "restoredContent", "remainingQuestions", "byTerm")}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
