import csv
import json
import re
from collections import defaultdict
from pathlib import Path


SRC = Path(r"C:\Users\USER\Desktop\기출정리 파일")
AP = Path(r"C:\Users\USER\Desktop\AP------")
OUT = AP / "reports" / "high1_exam_inventory_20260601"

TERMS = {
    "(1)1중간": ("1학기", "중간", "1mid"),
    "(2)1기말": ("1학기", "기말", "1final"),
    "(3)2중간": ("2학기", "중간", "2mid"),
    "(4)2기말": ("2학기", "기말", "2final"),
}

HIGH1_SUBJECTS = {"공통수학1", "공통수학2", "수학(상)", "수학(하)"}
AUX_MARKERS = ("정답", "해설", "풀이", "답안", "answer", "solution")
EXCLUDE_PATH_MARKERS = ("타과목", "기타과목")
VALID_EXTS = {".pdf", ".hwp", ".hwpx"}

ALIASES = {
    "강남고": "강남여고",
    "강남여": "강남여고",
    "강남여고": "강남여고",
    "순여고": "순천여고",
    "순여": "순천여고",
    "매여고": "매산여고",
    "매여": "매산여고",
}


def strip_exts(name: str) -> str:
    result = name
    changed = True
    while changed:
        changed = False
        for ext in (".candidate.js", ".hwp.pdf", ".pdf", ".hwp", ".hwpx", ".js", ".json"):
            if result.lower().endswith(ext.lower()):
                result = result[: -len(ext)]
                changed = True
                break
    return result


def norm_school(raw: str) -> str:
    school = raw.strip("_ -").replace(" ", "")
    school = re.sub(r"(고?1|1)$", "", school)
    school = school.replace("강남고", "강남여고")
    return ALIASES.get(school, school)


def yy_from_year(year: str) -> str:
    numeric = int(year)
    if numeric < 100:
        numeric += 2000
    return f"{numeric % 100:02d}"


def infer_course(path: Path, base: str = "") -> str:
    parts = set(path.parts)
    for course in ("공통수학1", "공통수학2", "수학(상)", "수학(하)"):
        if course in parts or course in base:
            return course
    return ""


def parse_source_file(path: Path):
    rel = path.relative_to(SRC)
    top = rel.parts[0]
    if top not in TERMS:
        return None
    if any(marker in str(rel) for marker in EXCLUDE_PATH_MARKERS):
        return None
    if path.suffix.lower() not in VALID_EXTS:
        return None

    subject = rel.parts[1] if len(rel.parts) > 1 else ""
    if subject not in HIGH1_SUBJECTS:
        return None

    sem, exam, term_code = TERMS[top]
    base = strip_exts(path.name)
    is_aux = any(marker.lower() in base.lower() for marker in AUX_MARKERS)
    if "정답" in base or "답안" in base:
        file_role = "answer"
    elif "해설" in base or "풀이" in base:
        file_role = "solution"
    elif is_aux:
        file_role = "aux"
    else:
        file_role = "problem"
    match = re.match(r"^(20\d{2}|\d{2})[_\-\s]+([^_\-\s]+)", base)
    if not match:
        return None

    year_raw, school_grade_token = match.groups()
    if not re.search(r"(고1|여1|1)$", school_grade_token):
        return None
    if school_grade_token.endswith("고1"):
        school_raw = school_grade_token[:-1]
    elif school_grade_token.endswith("1"):
        school_raw = school_grade_token[:-1]
    else:
        return None
    if "중" in school_raw:
        return None

    yy = yy_from_year(year_raw)
    school = norm_school(school_raw)
    course = infer_course(path, base)
    key = f"{yy}|{school}|{term_code}"

    return {
        "key": key,
        "courseKey": f"{key}|{course}",
        "yy": yy,
        "year": 2000 + int(yy),
        "school": school,
        "semester": sem,
        "examType": exam,
        "termCode": term_code,
        "course": course,
        "isAux": is_aux,
        "fileRole": file_role,
        "extension": path.suffix.lower(),
        "sourcePath": str(path),
        "sourceName": path.name,
        "sourceSubjectFolder": subject,
    }


def parse_ap_name(name: str, source_kind: str):
    base = strip_exts(Path(name).name)
    match = re.match(r"^(\d{2})_(.+?)_(1학기|2학기)_(중간|기말)_고1(?:_|$)", base)
    if not match:
        return None
    yy, school_raw, sem, exam = match.groups()
    term_code = {
        "1학기_중간": "1mid",
        "1학기_기말": "1final",
        "2학기_중간": "2mid",
        "2학기_기말": "2final",
    }[f"{sem}_{exam}"]
    school = norm_school(school_raw)
    course = infer_course(Path(name), base)
    return {
        "key": f"{yy}|{school}|{term_code}",
        "courseKey": f"{yy}|{school}|{term_code}|{course}",
        "yy": yy,
        "school": school,
        "semester": sem,
        "examType": exam,
        "termCode": term_code,
        "course": course,
        "kind": source_kind,
        "path": name,
    }


def write_csv(path: Path, rows):
    with path.open("w", newline="", encoding="utf-8-sig") as file:
        if not rows:
            return
        writer = csv.DictWriter(file, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def make_pipeline_job(row, generated_root: Path):
    term_code = row["termCode"]
    exam_id = row["expectedExamId"]
    output_dir = generated_root / "high1_2022_2025" / term_code / exam_id
    return {
        "examId": exam_id,
        "canonicalExamId": exam_id,
        "year": row["yy"],
        "schoolName": row["school"],
        "grade": "고1",
        "semester": "1" if row["semester"] == "1학기" else "2",
        "examType": "mid" if row["examType"] == "중간" else "final",
        "course": row["courses"].split(",")[0] if row["courses"] else "",
        "sourceType": "past_exam",
        "pdfPath": row["candidateSourceFile"],
        "answerPdfPath": row["answerPaths"].split(" | ")[0] if row["answerPaths"] else "",
        "solutionPdfPath": row["solutionPaths"].split(" | ")[0] if row["solutionPaths"] else "",
        "pageRange": "",
        "expectedQuestionCount": 24,
        "layoutPreset": "fixed_4page_20_objective_4_essay",
        "outputFileName": f"{exam_id}.candidate.js",
        "outputDir": str(output_dir),
        "status": "pending",
        "notes": [
            "generated_from_high1_inventory_manifest",
            "강남고_normalized_to_강남여고",
            "recent_years_2022_2025",
        ],
    }


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    source_files = []
    for path in SRC.rglob("*"):
        if path.is_file():
            item = parse_source_file(path)
            if item:
                source_files.append(item)

    problem_files = [item for item in source_files if not item["isAux"]]
    source_by_key = defaultdict(list)
    for item in problem_files:
        source_by_key[item["key"]].append(item)
    all_source_by_key = defaultdict(list)
    for item in source_files:
        all_source_by_key[item["key"]].append(item)

    ap_items = []
    live_root = AP / "archive" / "exams" / "original" / "high" / "h1"
    for path in live_root.rglob("*.js"):
        item = parse_ap_name(str(path), "live_original")
        if item:
            ap_items.append(item)

    generated_root = AP / "archive" / "_generated" / "past-exams"
    for path in generated_root.rglob("*.candidate.js"):
        item = parse_ap_name(str(path), "generated_candidate")
        if item:
            ap_items.append(item)
    for path in generated_root.rglob("*"):
        if path.is_dir():
            item = parse_ap_name(path.name, "generated_dir")
            if item:
                ap_items.append(item)

    ap_by_key = defaultdict(list)
    for item in ap_items:
        ap_by_key[item["key"]].append(item)

    rows = []
    for key, files in sorted(
        source_by_key.items(),
        key=lambda pair: (pair[0].split("|")[2], pair[0].split("|")[0], pair[0].split("|")[1]),
    ):
        sample = files[0]
        all_files = all_source_by_key[key]
        problem_pdfs = [item for item in files if item["extension"] == ".pdf"]
        problem_hwps = [item for item in files if item["extension"] in {".hwp", ".hwpx"}]
        answer_files = [item for item in all_files if item["fileRole"] == "answer"]
        solution_files = [item for item in all_files if item["fileRole"] == "solution"]
        candidate_source = sorted(problem_pdfs or files, key=lambda row: row["sourcePath"])[0]
        ap_matches = ap_by_key.get(key, [])
        rows.append(
            {
                "key": key,
                "year": sample["year"],
                "yy": sample["yy"],
                "school": sample["school"],
                "semester": sample["semester"],
                "examType": sample["examType"],
                "termCode": sample["termCode"],
                "courses": ",".join(sorted({item["course"] for item in files if item["course"]})),
                "candidateSourceFile": candidate_source["sourcePath"],
                "problemPdfCount": len(problem_pdfs),
                "problemHwpCount": len(problem_hwps),
                "sourceProblemFileCount": len(files),
                "sourceProblemPaths": " | ".join(
                    item["sourcePath"] for item in sorted(files, key=lambda row: row["sourcePath"])
                ),
                "answerExists": bool(answer_files),
                "answerPaths": " | ".join(
                    item["sourcePath"] for item in sorted(answer_files, key=lambda row: row["sourcePath"])
                ),
                "solutionExists": bool(solution_files),
                "solutionPaths": " | ".join(
                    item["sourcePath"] for item in sorted(solution_files, key=lambda row: row["sourcePath"])
                ),
                "expectedExamId": f"{sample['yy']}_{sample['school']}_{sample['semester']}_{sample['examType']}_고1_기출",
                "expectedTitle": f"{sample['yy']}_{sample['school']}_{sample['semester']}_{sample['examType']}_고1_기출",
                "alreadyInAP": bool(ap_matches),
                "apMatchKinds": ",".join(sorted({item["kind"] for item in ap_matches})),
                "apMatchPaths": " | ".join(sorted({item["path"] for item in ap_matches})),
            }
        )

    summary = []
    for term_code in ("1mid", "1final", "2mid", "2final"):
        term_rows = [row for row in rows if row["termCode"] == term_code]
        source_unique = len(term_rows)
        in_ap = sum(1 for row in term_rows if row["alreadyInAP"])
        label = {
            "1mid": "1학기 중간",
            "1final": "1학기 기말",
            "2mid": "2학기 중간",
            "2final": "2학기 기말",
        }[term_code]
        summary.append(
            {
                "termCode": term_code,
                "label": label,
                "sourceUniqueExamPapers": source_unique,
                "sourceProblemFilesBeforeDedup": sum(row["sourceProblemFileCount"] for row in term_rows),
                "auxAnswerSolutionFilesExcluded": sum(
                    1 for item in source_files if item["termCode"] == term_code and item["isAux"]
                ),
                "alreadyInAP": in_ap,
                "notYetInAP": source_unique - in_ap,
            }
        )

    ap_summary = []
    for term_code in ("1mid", "1final", "2mid", "2final"):
        live_keys = {
            item["key"]
            for item in ap_items
            if item["termCode"] == term_code and item["kind"] == "live_original"
        }
        generated_keys = {
            item["key"]
            for item in ap_items
            if item["termCode"] == term_code and item["kind"] in {"generated_candidate", "generated_dir"}
        }
        ap_summary.append(
            {
                "termCode": term_code,
                "liveOriginalUnique": len(live_keys),
                "generatedUnique": len(generated_keys),
                "liveOrGeneratedUnique": len(live_keys | generated_keys),
            }
        )

    missing_rows = [row for row in rows if not row["alreadyInAP"]]
    already_rows = [row for row in rows if row["alreadyInAP"]]
    dup_rows = [row for row in rows if row["sourceProblemFileCount"] > 1]

    write_csv(OUT / "source_vs_ap_high1_exam_inventory.csv", rows)
    write_csv(OUT / "source_missing_from_ap_high1_exam_inventory.csv", missing_rows)
    write_csv(OUT / "source_already_in_ap_high1_exam_inventory.csv", already_rows)
    write_csv(OUT / "source_internal_duplicates_high1_exam_inventory.csv", dup_rows)
    write_csv(OUT / "manifest_new_high1_exam_targets.csv", missing_rows)
    (OUT / "manifest_new_high1_exam_targets.json").write_text(
        json.dumps(missing_rows, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    recent_rows = [row for row in missing_rows if 2022 <= int(row["year"]) <= 2025]
    write_csv(OUT / "manifest_new_high1_exam_targets_2022_2025.csv", recent_rows)
    (OUT / "manifest_new_high1_exam_targets_2022_2025.json").write_text(
        json.dumps(recent_rows, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    for term_code in ("1mid", "1final", "2mid", "2final"):
        term_recent = [row for row in recent_rows if row["termCode"] == term_code]
        write_csv(OUT / f"manifest_new_high1_{term_code}_2022_2025.csv", term_recent)
        (OUT / f"manifest_new_high1_{term_code}_2022_2025.json").write_text(
            json.dumps(term_recent, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        selected = {
            "generatedAt": "",
            "sourceRoot": str(SRC),
            "filters": {
                "years": [2022, 2023, 2024, 2025],
                "grade": "고1",
                "termCode": term_code,
                "existingArchiveExcluded": True,
            },
            "jobCount": len(term_recent),
            "jobs": [make_pipeline_job(row, AP / "archive" / "_generated" / "past-exams") for row in term_recent],
        }
        (OUT / f"selected_manifest_high1_{term_code}_2022_2025.pipeline.json").write_text(
            json.dumps(selected, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    report = {
        "sourceRoot": str(SRC),
        "apRoot": str(AP),
        "normalizationNotes": [
            "강남고 is normalized to 강남여고 for duplicate comparison.",
            "순여고/순여 is normalized to 순천여고; 매여고/매여 to 매산여고; 강남여 to 강남여고.",
            "Problem paper count excludes filenames containing 정답/해설/풀이/답안 and paths containing 타과목/기타과목.",
            "Duplicate comparison uses broad key: year + normalized school + term, not course.",
            "No recent-year cutoff was applied because no N-year range was specified.",
        ],
        "summaryByTerm": summary,
        "apExistingSummaryByTerm": ap_summary,
        "totals": {
            "sourceUniqueExamPapers": len(rows),
            "sourceProblemFilesBeforeDedup": sum(row["sourceProblemFileCount"] for row in rows),
            "sourceAuxFilesExcluded": sum(1 for item in source_files if item["isAux"]),
            "alreadyInAP": len(already_rows),
            "notYetInAP": len(missing_rows),
            "sourceInternalDuplicateKeys": len(dup_rows),
            "apExistingUniqueLiveOrGenerated": len({item["key"] for item in ap_items}),
        },
    }

    (OUT / "summary.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    md = ["# 고1 시험지 전수조사 요약\n\n", "## 기준\n\n"]
    for note in report["normalizationNotes"]:
        md.append(f"- {note}\n")
    md.append("\n## 소스 vs AP\n\n")
    md.append("| 구분 | 소스 고유 시험지 | 소스 문제지 파일(중복 전) | 제외한 정답/해설 | AP에 있음 | AP에 없음 |\n")
    md.append("|---|---:|---:|---:|---:|---:|\n")
    for item in summary:
        md.append(
            f"| {item['label']} | {item['sourceUniqueExamPapers']} | {item['sourceProblemFilesBeforeDedup']} | "
            f"{item['auxAnswerSolutionFilesExcluded']} | {item['alreadyInAP']} | {item['notYetInAP']} |\n"
        )
    md.append(
        f"| **합계** | **{report['totals']['sourceUniqueExamPapers']}** | "
        f"**{report['totals']['sourceProblemFilesBeforeDedup']}** | "
        f"**{report['totals']['sourceAuxFilesExcluded']}** | "
        f"**{report['totals']['alreadyInAP']}** | **{report['totals']['notYetInAP']}** |\n"
    )
    md.append("\n## AP 기존 보유\n\n")
    md.append("| 구분 | live original | generated | live 또는 generated |\n")
    md.append("|---|---:|---:|---:|\n")
    labels = {"1mid": "1학기 중간", "1final": "1학기 기말", "2mid": "2학기 중간", "2final": "2학기 기말"}
    for item in ap_summary:
        md.append(
            f"| {labels[item['termCode']]} | {item['liveOriginalUnique']} | "
            f"{item['generatedUnique']} | {item['liveOrGeneratedUnique']} |\n"
        )
    md.append("\n## 산출 파일\n\n")
    for filename in (
        "source_vs_ap_high1_exam_inventory.csv",
        "source_missing_from_ap_high1_exam_inventory.csv",
        "source_already_in_ap_high1_exam_inventory.csv",
        "source_internal_duplicates_high1_exam_inventory.csv",
        "manifest_new_high1_exam_targets.csv",
        "manifest_new_high1_exam_targets.json",
        "manifest_new_high1_exam_targets_2022_2025.csv",
        "manifest_new_high1_exam_targets_2022_2025.json",
        "manifest_new_high1_1mid_2022_2025.json",
        "manifest_new_high1_1final_2022_2025.json",
        "manifest_new_high1_2mid_2022_2025.json",
        "manifest_new_high1_2final_2022_2025.json",
        "selected_manifest_high1_1mid_2022_2025.pipeline.json",
        "selected_manifest_high1_1final_2022_2025.pipeline.json",
        "selected_manifest_high1_2mid_2022_2025.pipeline.json",
        "selected_manifest_high1_2final_2022_2025.pipeline.json",
        "summary.json",
    ):
        md.append(f"- `{filename}`\n")
    (OUT / "README.md").write_text("".join(md), encoding="utf-8-sig")

    print(json.dumps(report, ensure_ascii=False, indent=2))
    print(f"OUT={OUT}")


if __name__ == "__main__":
    main()
