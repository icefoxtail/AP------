#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_source_artifacts.py
Assembles production JS, mirror JS, and .evidence.json artifacts
with automated SHA-256 integrity binding for GMDI pipeline.
"""

import os
import sys
import json
import hashlib
import argparse
from pathlib import Path
from datetime import datetime

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def main():
    parser = argparse.ArgumentParser(description="Assemble Source-Only JS and Evidence")
    parser.add_argument("--data", required=True, help="Path to exam JSON data file")
    parser.add_argument("--batch-tag", default="h2-1mid-20261005", help="Batch tag for generated artifacts")
    args = parser.parse_args()

    with open(args.data, "r", encoding="utf-8") as f:
        meta = json.load(f)

    exam_title = meta["examTitle"]
    questions = meta["questions"]
    pdf_path = meta.get("pdfPath", "")
    target_rel_js = meta.get("targetJs", f"archive/exams/original/high/h2/1mid/{exam_title}.js")

    # 1. Format JS Content
    js_content = f'window.examTitle = "{exam_title}";\nwindow.questionBank = ' + json.dumps(questions, ensure_ascii=False, indent=2) + ';\n'

    # 2. Production JS
    prod_path = Path(target_rel_js)
    prod_path.parent.mkdir(parents=True, exist_ok=True)
    with open(prod_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"1. Production JS : {prod_path}")

    # 3. Generated Mirror JS
    mirror_path = Path("archive/_generated/source-only") / args.batch_tag / f"{exam_title}.js"
    mirror_path.parent.mkdir(parents=True, exist_ok=True)
    with open(mirror_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"2. Generated JS  : {mirror_path}")

    # 4. Hash Images and PDF
    images_meta = []
    asset_dir = Path("archive/assets/images") / exam_title
    if asset_dir.exists():
        for img_p in sorted(asset_dir.glob("*.png")):
            rel_str = str(img_p.as_posix())
            images_meta.append({
                "path": rel_str,
                "sha256": sha256_file(str(img_p))
            })

    pdf_sha = sha256_file(pdf_path) if pdf_path and os.path.exists(pdf_path) else "N/A"

    choice_count = sum(1 for q in questions if q.get("questionType") == "객관식" or (isinstance(q.get("choices"), list) and len(q.get("choices")) > 0))
    essay_count = len(questions) - choice_count

    evidence = {
        "contractVersion": "source-only-intake-v1",
        "generatedAt": datetime.now().isoformat(),
        "source": {
            "pdfPath": pdf_path,
            "pdfSha256": pdf_sha,
            "dpi": 300
        },
        "exam": {
            "title": exam_title,
            "grade": meta.get("grade", "고2"),
            "subject": meta.get("subject", "수학"),
            "targetJs": str(prod_path.as_posix())
        },
        "inventory": {
            "totalQuestions": len(questions),
            "choiceCount": choice_count,
            "essayCount": essay_count,
            "imageCount": len(images_meta)
        },
        "images": images_meta,
        "validation": {
            "vmExecution": "PENDING",
            "choiceLengthCheck": "PENDING",
            "answerBlankCheck": "PENDING",
            "solutionBlankCheck": "PENDING",
            "assetExistenceCheck": "PENDING"
        }
    }

    ev_path = Path("archive/analysis") / f"source-only-{args.batch_tag}" / f"{exam_title}.evidence.json"
    ev_path.parent.mkdir(parents=True, exist_ok=True)
    with open(ev_path, "w", encoding="utf-8") as f:
        json.dump(evidence, f, ensure_ascii=False, indent=2)
    print(f"3. Evidence JSON : {ev_path}")

if __name__ == "__main__":
    main()
