#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
audit_exams.py
Cross-references raw PDF exam sources against the APMath archive repository
to identify missing exams by normalized exam identity (Year, School, Grade, Term).
"""

import os
import re
import sys
import glob
import json
import argparse
from pathlib import Path

# Ensure stdout handles UTF-8 on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

EXCLUDED_SCHOOL_KEYWORDS = ["청암", "공고", "공업", "효산"]

SCHOOL_ALIASES = [
    ("강남여고", [r"강남고1", r"강남고", r"강남여고", r"순천강남"]),
    ("매산여고", [r"매여고", r"매산여고", r"순천매산여고"]),
    ("순천여고", [r"순여고", r"순천여고"]),
    ("매산고",   [r"매산고", r"순천매산고"]),
    ("순천고",   [r"순천고", r"순고"]),
    ("금당고",   [r"금당고", r"금당"]),
    ("제일고",   [r"제일고", r"제일"]),
    ("효천고",   [r"효천고", r"효천"]),
    ("복성고",   [r"복성고", r"복성"]),
    ("팔마고",   [r"팔마고", r"팔마"]),
    ("광양여고", [r"광양여고", r"광여고"]),
    ("광양고",   [r"광양고"]),
    ("백운고",   [r"백운고"]),
    ("중마고",   [r"중마고"]),
    ("제철고",   [r"제철고", r"광양제철고"]),
]

def normalize_school(text):
    for excluded in EXCLUDED_SCHOOL_KEYWORDS:
        if excluded in text:
            return None
    for canonical, patterns in SCHOOL_ALIASES:
        for p in patterns:
            if re.search(p, text):
                return canonical
    return None

def extract_year(text):
    m = re.search(r"(20\d{2})", text)
    if m:
        return int(m.group(1))
    m2 = re.search(r"(?:^|[^\d])(\d{2})(?:_|년|\s|강남|매산|순천|금당|제일|효천|복성|팔마|광양)", text)
    if m2:
        val = int(m2.group(1))
        if 15 <= val <= 35:
            return 2000 + val
    return None

def is_answer_or_solution_sheet(filename):
    lower = filename.lower()
    for kw in ["정답", "해설", "답안", "주관식", "채점", "풀이"]:
        if kw in lower:
            return True
    return False

def scan_source_pdfs(source_dir):
    source_path = Path(source_dir)
    pdf_files = list(source_path.rglob("*.pdf"))
    valid_candidates = []

    for f in pdf_files:
        fn = f.name
        if is_answer_or_solution_sheet(fn):
            continue
        school = normalize_school(fn)
        if not school:
            continue
        year = extract_year(fn)
        if not year:
            continue
        
        valid_candidates.append({
            "year": year,
            "school": school,
            "filename": fn,
            "path": str(f.resolve()),
            "identity": f"{year}_{school}_h1_1mid"
        })
    return valid_candidates

def scan_archive_js(archive_dir):
    archive_path = Path(archive_dir)
    js_files = list(archive_path.glob("*.js"))
    existing_exams = {}

    for f in js_files:
        fn = f.name
        school = normalize_school(fn)
        if not school:
            continue
        year = extract_year(fn)
        if not year:
            continue
        
        identity = f"{year}_{school}_h1_1mid"
        existing_exams[identity] = {
            "year": year,
            "school": school,
            "filename": fn,
            "path": str(f.resolve())
        }
    return existing_exams

def main():
    parser = argparse.ArgumentParser(description="Audit and compare exam sources against archive JS")
    parser.add_argument("--source-dir", required=True, help="Directory containing source PDFs")
    parser.add_argument("--archive-dir", default="archive/exams/original/high/h1/1mid", help="Repository archive exams directory")
    parser.add_argument("--json", action="store_true", help="Output JSON report")
    parser.add_argument("--output", help="Write report to file")

    args = parser.parse_args()

    source_candidates = scan_source_pdfs(args.source_dir)
    archive_exams = scan_archive_js(args.archive_dir)

    # Unique source identities (deduplicating same exam multiple files)
    unique_sources = {}
    for sc in source_candidates:
        ident = sc["identity"]
        if ident not in unique_sources:
            unique_sources[ident] = sc
        else:
            # If root vs subfolder, prefer root
            if "과년도" not in sc["path"] and "backup" not in sc["path"]:
                unique_sources[ident] = sc

    matched = []
    missing = []

    for ident, sc in unique_sources.items():
        if ident in archive_exams:
            matched.append({
                "source": sc,
                "archive": archive_exams[ident]
            })
        else:
            missing.append(sc)

    missing.sort(key=lambda x: (x["year"], x["school"]), reverse=True)

    report = {
        "summary": {
            "totalSourcePdfsScanned": len(source_candidates),
            "uniqueSourceExamIdentities": len(unique_sources),
            "existingArchiveMatches": len(matched),
            "missingExamsCount": len(missing)
        },
        "matched": matched,
        "missing": missing
    }

    if args.json:
        out_str = json.dumps(report, ensure_ascii=False, indent=2)
        if args.output:
            with open(args.output, "w", encoding="utf-8") as out_f:
                out_f.write(out_str)
        else:
            print(out_str)
    else:
        lines = []
        lines.append("=" * 60)
        lines.append("  APMath Exam Source Intake Audit Report")
        lines.append("=" * 60)
        lines.append(f"1. Total Valid Source Candidates : {len(source_candidates)}")
        lines.append(f"2. Unique Source Exam Identities  : {len(unique_sources)}")
        lines.append(f"3. Existing JS in Archive Matches : {len(matched)}")
        lines.append(f"4. Missing JS Exams Count         : {len(missing)}")
        lines.append("-" * 60)
        lines.append("Missing Exams (Sorted by Year DESC):")
        for idx, m in enumerate(missing, 1):
            lines.append(f"[{idx:02d}] {m['year']}년 {m['school']} (고1 1학기 중간)")
            lines.append(f"     Path: {m['path']}")
        lines.append("=" * 60)
        out_str = "\n".join(lines)
        if args.output:
            with open(args.output, "w", encoding="utf-8") as out_f:
                out_f.write(out_str)
        else:
            print(out_str)

if __name__ == "__main__":
    main()
