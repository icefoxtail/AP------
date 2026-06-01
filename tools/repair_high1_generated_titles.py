import json
import re
from pathlib import Path


ROOT = Path(r"C:\Users\USER\Desktop\AP------\archive\_generated\past-exams\high1_2022_2025")


def replace_exam_title(text: str, exam_id: str) -> str:
    return re.sub(
        r'window\.examTitle\s*=\s*".*?";',
        "window.examTitle = " + json.dumps(exam_id, ensure_ascii=False) + ";",
        text,
        count=1,
        flags=re.S,
    )


def main():
    changed = []
    for candidate in ROOT.rglob("*.candidate.js"):
        exam_id = candidate.parent.parent.name
        text = candidate.read_text(encoding="utf-8")
        next_text = replace_exam_title(text, exam_id)
        next_text = re.sub(
            r'"examId"\s*:\s*".*?"',
            '"examId": ' + json.dumps(exam_id, ensure_ascii=False),
            next_text,
        )
        if next_text != text:
            candidate.write_text(next_text, encoding="utf-8")
            changed.append(str(candidate))

        manifest = candidate.parent.parent / "manifest.json"
        if manifest.exists():
            data = json.loads(manifest.read_text(encoding="utf-8"))
            dirty = False
            for key in ("examId", "canonicalExamId"):
                if data.get(key) != exam_id:
                    data[key] = exam_id
                    dirty = True
            if data.get("outputFileName") and not data["outputFileName"].startswith(exam_id):
                data["outputFileName"] = f"{exam_id}.candidate.js"
                dirty = True
            if dirty:
                manifest.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                changed.append(str(manifest))

    report = {
        "root": str(ROOT),
        "changedFileCount": len(changed),
        "changedFiles": changed,
    }
    out = ROOT / "manager_title_repair_report.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
