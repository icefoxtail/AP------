#!/usr/bin/env python3
"""
tools/route_queue.py - Sequential Middle School Exam Pipeline Queue

Enforces single-worker sequential progression from Middle 1-1 to Middle 3-2:
  Step 01: 중1 1학기 중간 (m1-1mid)
  Step 02: 중1 1학기 기말 (m1-1final)
  Step 03: 중1 2학기 중간 (m1-2mid)
  Step 04: 중1 2학기 기말 (m1-2final)
  Step 05: 중2 1학기 중간 (m2-1mid)
  Step 06: 중2 1학기 기말 (m2-1final)
  Step 07: 중2 2학기 중간 (m2-2mid)
  Step 08: 중2 2학기 기말 (m2-2final)
  Step 09: 중3 1학기 중간 (m3-1mid)
  Step 10: 중3 1학기 기말 (m3-1final)
  Step 11: 중3 2학기 중간 (m3-2mid)
  Step 12: 중3 2학기 기말 (m3-2final)

Cycles sequentially: 1 exam per step, moving to next step only upon MAIN_DONE.
"""

import os
import sys
import io
import re
import json
import argparse
from pathlib import Path

# Force UTF-8 on Windows stdout
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent.parent

SEQUENTIAL_STEPS = [
    ("m1-1mid", "m1", "1mid", "Step 01", "중1 1학기 중간"),
    ("m1-1final", "m1", "1final", "Step 02", "중1 1학기 기말"),
    ("m1-2mid", "m1", "2mid", "Step 03", "중1 2학기 중간"),
    ("m1-2final", "m1", "2final", "Step 04", "중1 2학기 기말"),
    ("m2-1mid", "m2", "1mid", "Step 05", "중2 1학기 중간"),
    ("m2-1final", "m2", "1final", "Step 06", "중2 1학기 기말"),
    ("m2-2mid", "m2", "2mid", "Step 07", "중2 2학기 중간"),
    ("m2-2final", "m2", "2final", "Step 08", "중2 2학기 기말"),
    ("m3-1mid", "m3", "1mid", "Step 09", "중3 1학기 중간"),
    ("m3-1final", "m3", "1final", "Step 10", "중3 1학기 기말"),
    ("m3-2mid", "m3", "2mid", "Step 11", "중3 2학기 중간"),
    ("m3-2final", "m3", "2final", "Step 12", "중3 2학기 기말"),
]

def extract_year(stem: str) -> int:
    m = re.match(r"^(\d{2})_", stem)
    if m:
        return int(m.group(1))
    return 0

def extract_school(stem: str) -> str:
    m = re.match(r"^\d{2}_(?:순천)?([가-힣]+중(?:학교)?)_", stem)
    if m:
        return m.group(1).replace("학교", "")
    return ""

def scan_sequential_queue():
    queue = []
    
    for route_key, grade, term, step_num, label in SEQUENTIAL_STEPS:
        orig_dir = REPO_ROOT / "archive" / "exams" / "original" / "middle" / grade / term
        sim_dir = REPO_ROOT / "archive" / "exams" / "similar" / "middle" / grade / term
        
        orig_files = []
        if orig_dir.exists():
            orig_files = sorted([f for f in orig_dir.glob("*.js") if f.is_file()], key=lambda x: extract_year(x.stem), reverse=True)
            
        sim_files = []
        if sim_dir.exists():
            sim_files = [f for f in sim_dir.glob("*.js") if f.is_file()]
            
        sim_records = []
        for sf in sim_files:
            sim_records.append({
                "stem": sf.stem,
                "file": str(sf.relative_to(REPO_ROOT)).replace("\\", "/"),
                "school": extract_school(sf.stem),
                "year": extract_year(sf.stem)
            })

        def get_base(st: str) -> str:
            return re.sub(r'_(기출|수학|수학[12I]+|유사.*)$', '', st)

        pending = []
        completed = []
        
        for of in orig_files:
            stem = of.stem
            school = extract_school(stem)
            year = extract_year(stem)
            base = get_base(stem)
            
            matched_sim = None
            for s in sim_records:
                s_base = get_base(s["stem"])
                if base and s_base and base == s_base:
                    matched_sim = s
                    break
                if stem in s["stem"] or s["stem"].startswith(stem):
                    matched_sim = s
                    break
                if school and s["school"] and school == s["school"] and year == s["year"]:
                    matched_sim = s
                    break
            
            item = {
                "stem": stem,
                "file": str(of.relative_to(REPO_ROOT)).replace("\\", "/"),
                "year": year,
                "school": school,
                "matchedSimilar": matched_sim["file"] if matched_sim else None
            }
            if matched_sim:
                completed.append(item)
            else:
                pending.append(item)
                
        pending.sort(key=lambda x: x["year"], reverse=True)
        next_exam = pending[0] if pending else None
        
        queue.append({
            "step": step_num,
            "routeKey": route_key,
            "grade": grade,
            "term": term,
            "label": label,
            "originalCount": len(orig_files),
            "completedCount": len(completed),
            "pendingCount": len(pending),
            "nextExam": next_exam,
            "pendingList": pending,
            "completedList": completed
        })
        
    return queue

def main():
    parser = argparse.ArgumentParser(description="Sequential Middle School Exam Pipeline Queue")
    parser.add_argument("--json", action="store_true", help="Output machine-readable JSON")
    parser.add_argument("--next-in-line", action="store_true", help="Print the exact next exam in the sequential chain")
    parser.add_argument("--step", type=int, help="Get next exam for specific step number (1 to 12)")
    
    args = parser.parse_args()
    queue = scan_sequential_queue()
    
    if args.step:
        if args.step < 1 or args.step > 12:
            print("Error: Step must be between 1 and 12", file=sys.stderr)
            sys.exit(1)
        item = queue[args.step - 1]
        if args.json:
            print(json.dumps(item, indent=2, ensure_ascii=False))
        else:
            print(f"[{item['step']}] {item['label']} ({item['routeKey']})")
            if item["nextExam"]:
                print(f"Next Target Exam: {item['nextExam']['stem']}")
                print(f"Path: {item['nextExam']['file']}")
            else:
                print("All exams in this step are completed!")
        return

    if args.next_in_line:
        # Find the active step: the first step that has pending items in round-robin or lowest completion count
        # In sequential chain, start from Step 1 (중1 1학기 중간)
        active_item = None
        for item in queue:
            if item["nextExam"]:
                active_item = item
                break
        if args.json:
            print(json.dumps(active_item, indent=2, ensure_ascii=False))
        else:
            if active_item:
                print(f"Active Sequential Step: [{active_item['step']}] {active_item['label']}")
                print(f"Target Exam: {active_item['nextExam']['stem']}")
                print(f"Path: {active_item['nextExam']['file']}")
                print(f"Year: 20{active_item['nextExam']['year']:02d}")
            else:
                print("Congratulations! All middle school exams are 100% completed!")
        return

    if args.json:
        print(json.dumps(queue, indent=2, ensure_ascii=False))
        return

    # Print sequential pipeline dashboard
    total_orig = sum(q["originalCount"] for q in queue)
    total_done = sum(q["completedCount"] for q in queue)
    total_pend = sum(q["pendingCount"] for q in queue)

    print("\n" + "="*95)
    print("               중등 순차 생산 파이프라인 대기열 (중1-1 -> 중3-2 순환)")
    print("="*95)
    print(f"{'진도 단계':<9} | {'학기/과정':<15} | {'원본':<5} | {'완료':<5} | {'잔여':<5} | {'상태':<8} | {'다음 우선 배정 시험지'}")
    print("-" * 95)
    for q in queue:
        next_stem = q["nextExam"]["stem"] if q["nextExam"] else "(전체 완료)"
        status = "대기" if q["pendingCount"] > 0 else "완료"
        print(f"{q['step']:<9} | {q['label']:<15} | {q['originalCount']:<5} | {q['completedCount']:<5} | {q['pendingCount']:<5} | {status:<8} | {next_stem}")
    print("-" * 95)
    print(f"{'총계':<9} | {'12단계 단일 컨베이어':<15} | {total_orig:<5} | {total_done:<5} | {total_pend:<5} | {(total_done/total_orig*100):.1f}%   |")
    print("="*95)
    print(" ※ 운영 방식: Step 01(중1-1중) 1건 완성(MAIN_DONE) -> Step 02(중1-1기) 1건 -> ... -> Step 12(중3-2기) 1건 순환\n")

if __name__ == "__main__":
    main()
