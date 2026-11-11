#!/usr/bin/env python3
"""
tools/route_queue_high.py - Sequential High School Similar-Exam Queue

고등 유사시험지 예약 라인(HIGH_SIMILAR_GENERATOR / REVIEWER_MERGER)의 대기열.
중등 큐(tools/route_queue.py)와 독립이며, 중등 큐 동작은 바꾸지 않는다.

탐색 순서(HIGH_STEPS): 유사 시험지가 하나도 없는 구간을 먼저 채운 뒤,
유사 비율이 낮은 구간 순으로 진행한다. 한 구간 안에서는 연도 최신순 -> 학교명 가나다순 -> 과목명 가나다순.
앞 구간에 남은 시험지가 있으면 다음 구간으로 넘어가지 않는다.

완료 판정: 같은 (연도·학교·학기·시험·학년·과목) 키의 `_유사.js`가
archive/exams/similar/high/<grade>/<term>/ 에 있으면 완료.
유사 쪽 이름에 과목이 없는 예전 파일(예: 24_금당고_1학기_중간_고2_유사)은
같은 접두어의 원본을 모두 완료로 간주한다(보수적 건너뛰기).

사용:
  python tools/route_queue_high.py                 # 대시보드
  python tools/route_queue_high.py --next-in-line --json
  python tools/route_queue_high.py --step 3 --json
  python tools/route_queue_high.py --skip <stem> [--skip <stem> ...]   # 진행 중(열린 PR/브랜치) 시험지 제외
"""

import argparse
import io
import json
import re
import sys
from pathlib import Path

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent.parent

# (routeKey, grade, term, label)
HIGH_STEPS = [
    ("h1-1final", "h1", "1final", "고1 1학기 기말"),
    ("h2-1final", "h2", "1final", "고2 1학기 기말"),
    ("h1-2mid", "h1", "2mid", "고1 2학기 중간"),
    ("h2-2mid", "h2", "2mid", "고2 2학기 중간"),
    ("h1-1mid", "h1", "1mid", "고1 1학기 중간"),
    ("h2-1mid", "h2", "1mid", "고2 1학기 중간"),
    ("h1-2final", "h1", "2final", "고1 2학기 기말"),
    ("h2-2final", "h2", "2final", "고2 2학기 기말"),
    ("h3-1mid", "h3", "1mid", "고3 1학기 중간"),
    ("h3-1final", "h3", "1final", "고3 1학기 기말"),
]

TAIL_RE = re.compile(r"_(기출[a-z]?|유사)$")


def extract_year(stem: str) -> int:
    m = re.match(r"^(\d{2})_", stem)
    return int(m.group(1)) if m else 0


def extract_school(stem: str) -> str:
    parts = stem.split("_")
    return parts[1] if len(parts) > 1 else ""


def base_key(stem: str) -> str:
    return TAIL_RE.sub("", stem)


def is_match(orig_key: str, sim_key: str) -> bool:
    if orig_key == sim_key:
        return True
    # 과목 표기가 없는 예전 유사 파일: 접두어가 같으면 같은 시험으로 본다
    return orig_key.startswith(sim_key + "_")


def scan_high_queue(skip=()):
    skip = set(skip)
    queue = []
    for i, (route_key, grade, term, label) in enumerate(HIGH_STEPS, start=1):
        orig_dir = REPO_ROOT / "archive" / "exams" / "original" / "high" / grade / term
        sim_dir = REPO_ROOT / "archive" / "exams" / "similar" / "high" / grade / term

        orig_files = sorted(orig_dir.glob("*.js")) if orig_dir.exists() else []
        sim_files = sorted(sim_dir.glob("*_유사.js")) if sim_dir.exists() else []
        sim_keys = [(base_key(f.stem), f) for f in sim_files]

        pending, completed, in_progress = [], [], []
        for of in orig_files:
            stem = of.stem
            okey = base_key(stem)
            hit = next((f for k, f in sim_keys if is_match(okey, k)), None)
            item = {
                "stem": stem,
                "similarStem": okey + "_유사",
                "file": of.relative_to(REPO_ROOT).as_posix(),
                "year": extract_year(stem),
                "school": extract_school(stem),
                "matchedSimilar": hit.relative_to(REPO_ROOT).as_posix() if hit else None,
            }
            if hit:
                completed.append(item)
            elif stem in skip or okey in skip or okey + "_유사" in skip:
                in_progress.append(item)
            else:
                pending.append(item)

        pending.sort(key=lambda x: (-x["year"], x["school"], x["stem"]))
        queue.append({
            "step": f"Step {i:02d}",
            "routeKey": route_key,
            "grade": grade,
            "term": term,
            "label": label,
            "originalCount": len(orig_files),
            "completedCount": len(completed),
            "inProgressCount": len(in_progress),
            "pendingCount": len(pending),
            "nextExam": pending[0] if pending else None,
            "pendingList": pending,
        })
    return queue


def main():
    ap = argparse.ArgumentParser(description="Sequential High School Similar-Exam Queue")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--next-in-line", action="store_true")
    ap.add_argument("--step", type=int, help="1..%d" % len(HIGH_STEPS))
    ap.add_argument("--skip", action="append", default=[], help="진행 중인 stem (열린 PR/브랜치)")
    args = ap.parse_args()

    queue = scan_high_queue(args.skip)

    if args.step:
        if not 1 <= args.step <= len(queue):
            print(f"Error: Step must be between 1 and {len(queue)}", file=sys.stderr)
            sys.exit(1)
        item = queue[args.step - 1]
        print(json.dumps(item, indent=2, ensure_ascii=False)) if args.json else print(
            f"[{item['step']}] {item['label']} next={item['nextExam']['stem'] if item['nextExam'] else '(완료)'}")
        return

    if args.next_in_line:
        active = next((q for q in queue if q["nextExam"]), None)
        if args.json:
            print(json.dumps(active, indent=2, ensure_ascii=False))
        elif active:
            n = active["nextExam"]
            print(f"Active Step: [{active['step']}] {active['label']}")
            print(f"Target Exam: {n['stem']}")
            print(f"Path: {n['file']}")
        else:
            print("All high school exams are completed.")
        return

    if args.json:
        print(json.dumps(queue, indent=2, ensure_ascii=False))
        return

    print("=" * 100)
    print("               고등 유사시험지 순차 대기열")
    print("=" * 100)
    print(f"{'단계':<8} | {'구간':<14} | {'원본':<5} | {'완료':<5} | {'진행':<5} | {'잔여':<5} | 다음 시험지")
    print("-" * 100)
    for q in queue:
        nxt = q["nextExam"]["stem"] if q["nextExam"] else "(완료)"
        print(f"{q['step']:<8} | {q['label']:<14} | {q['originalCount']:<5} | {q['completedCount']:<5} | {q['inProgressCount']:<5} | {q['pendingCount']:<5} | {nxt}")
    to = sum(q["originalCount"] for q in queue)
    td = sum(q["completedCount"] for q in queue)
    print("-" * 100)
    print(f"총 원본 {to}, 완료 {td} ({(td / to * 100) if to else 0:.1f}%)")


if __name__ == "__main__":
    main()
