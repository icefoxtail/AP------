import argparse
import json
import re
from pathlib import Path


def load_candidate(path):
    source = Path(path).read_text(encoding="utf-8")
    title_match = re.search(r"window\.examTitle\s*=\s*(.*?);\s*window\.questionBank", source, re.S)
    bank_match = re.search(r"window\.questionBank\s*=\s*(\[.*\]);\s*$", source, re.S)
    if not title_match or not bank_match:
        raise ValueError(f"Cannot parse candidate JS: {path}")
    return json.loads(title_match.group(1)), json.loads(bank_match.group(1))


def write_candidate(path, title, questions):
    payload = (
        "window.examTitle = "
        + json.dumps(title, ensure_ascii=False)
        + ";\nwindow.questionBank = "
        + json.dumps(questions, ensure_ascii=False, indent=2)
        + ";\n"
    )
    Path(path).write_text(payload, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    parser.add_argument("--report", required=True)
    args = parser.parse_args()

    root = Path(args.root)
    changed = []
    errors = []
    for candidate_file in sorted(root.glob("**/candidate/*.candidate.js")):
        try:
            title, questions = load_candidate(candidate_file)
            before = [q.get("id") for q in questions]
            expected = list(range(1, len(questions) + 1))
            if before == expected:
                continue
            for index, question in enumerate(questions, start=1):
                question["id"] = index
                if not str(question.get("displayNo", "")).strip():
                    question["displayNo"] = str(index)
            write_candidate(candidate_file, title, questions)
            changed.append({"candidateFile": str(candidate_file), "before": before, "after": expected})
        except Exception as exc:
            errors.append({"candidateFile": str(candidate_file), "error": str(exc)})
    report = {"root": str(root), "changedFileCount": len(changed), "changed": changed, "errors": errors}
    Path(args.report).write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"changedFileCount": len(changed), "errorCount": len(errors)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
