#!/usr/bin/env python3
"""
tools/high_similar_status.py - 고등 유사시험지 현황 보고 (읽기 전용)

origin/main 기준으로 "무엇이 main에 병합됐는지 / 진행 중인지 / 아직 안 만들었는지"를 낸다.
- 병합 완료: origin/main의 archive/exams/similar/high/<g>/<term>/ 에 `<원본키>_유사*.js` 가 있음
- 진행 중:   원격 브랜치 claude/similar-high-<stem> 가 있고 아직 main에 없음
- 미생성:    나머지
- 메타 등록: 병합된 유사 stem 이 archive/data/question_metadata.json 에 있는지(main 등록 writer가 만든 행)
쓰기·push 없음. 사용 전 `git fetch origin main` 을 한다.

  python3 tools/high_similar_status.py            # 요약
  python3 tools/high_similar_status.py --merged   # 병합 완료 목록
  python3 tools/high_similar_status.py --json
"""
import argparse
import io
import json
import re
import subprocess
import sys
from pathlib import Path

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from route_queue_high import HIGH_STEPS, base_key, is_match  # noqa: E402

REF = "origin/main"


def git(*args):
    r = subprocess.run(["git", "-c", "core.quotepath=off", *args], cwd=ROOT, capture_output=True, text=True, encoding="utf-8")
    return r.stdout


def tree(prefix):
    return [p for p in git("ls-tree", "-r", "--name-only", REF, "--", prefix.rstrip("/") + "/").split("\n") if p]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--merged", action="store_true")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    heads = [l.split("refs/heads/")[-1] for l in git("ls-remote", "--heads", "origin", "claude/similar-high-*").split("\n") if "refs/heads/" in l]
    branch_stems = {h.replace("claude/similar-high-", "", 1) for h in heads}

    inbox_files = tree(".archive-meta-register/inbox")
    result = []
    for i, (route_key, grade, term, label) in enumerate(HIGH_STEPS, 1):
        orig = [Path(p).stem for p in tree(f"archive/exams/original/high/{grade}/{term}") if p.endswith(".js")]
        sims = [Path(p).stem for p in tree(f"archive/exams/similar/high/{grade}/{term}") if re.search(r"_유사\d*\.js$", p)]
        sim_keys = [(re.sub(r"_유사\d*$", "", s), s) for s in sims]
        merged, progress, todo = [], [], []
        for o in orig:
            ok = base_key(o)
            hit = [s for k, s in sim_keys if is_match(ok, k)]
            if hit:
                merged.append((o, hit))
            elif (ok + "_유사") in branch_stems:
                progress.append(o)
            else:
                todo.append(o)
        result.append({"step": i, "label": label, "original": len(orig), "merged": len(merged),
                       "inProgress": len(progress), "todo": len(todo),
                       "mergedList": merged, "inProgressList": progress})

    # 예약 라인(2026-11-11~)이 새로 병합한 유사 JS와 등록 요청(inbox) 여부
    added = git("log", "--since=2026-11-11T00:00:00+09:00", "--diff-filter=A", "--name-only", "--format=", REF, "--", "archive/exams/similar/high")
    campaign = []
    for p in sorted(set(x for x in added.split("\n") if re.search(r"_유사\d*\.js$", x))):
        st = Path(p).stem
        # main 등록 writer가 만든 행: question_metadata.json 에 stem 이 있으면 등록됨
        found = bool(git("grep", "-l", "-F", st, REF, "--", "archive/data/question_metadata.json").strip())
        campaign.append({"similar": st, "registered": found})

    if args.json:
        print(json.dumps({"steps": result, "branches": sorted(branch_stems)}, ensure_ascii=False, indent=2))
        return

    to = sum(r["original"] for r in result)
    tm = sum(r["merged"] for r in result)
    print(f"고등 유사시험지 현황 ({REF} 기준)")
    print(f"{'단계':<5} {'구간':<12} {'원본':>4} {'main 병합':>8} {'진행 중':>6} {'미생성':>6}")
    for r in result:
        print(f"{r['step']:<5} {r['label']:<12} {r['original']:>4} {r['merged']:>8} {r['inProgress']:>6} {r['todo']:>6}")
    print(f"합계: 원본 {to}, main 병합 {tm} ({tm / to * 100:.1f}%), 진행 중 {sum(r['inProgress'] for r in result)}, 미생성 {sum(r['todo'] for r in result)}")
    if args.merged:
        print("\n[main 병합 완료 목록]")
        for r in result:
            for o, sims in r["mergedList"]:
                print(f"  {r['label']}: {', '.join(sims)}")
    print("\n[진행 중(브랜치만 있음)]")
    for r in result:
        for o in r["inProgressList"]:
            print(f"  {r['label']}: {o}")
    print("\n[2026-11-11~ 새로 main에 병합된 유사와 메타 등록(question_metadata.json) 여부]")
    for c in campaign:
        print(f"  {c['similar']}: {'등록됨' if c['registered'] else '등록 대기(main 등록 writer 처리 전)'}")
    if not campaign:
        print("  (없음)")

if __name__ == "__main__":
    main()
