#!/bin/bash
# 묶음 작업 도구를 저장소(ops/claude-batch)에서 <repo>/.tmp/work/ 로 펼친다. (svg-m1 복원과 같은 방식)
# usage: bash archive/tools/geometry-equation/ops/claude-batch/restore.sh [--force | --save]
#   (기본)  저장소 → .tmp/work. 도구 파일만 복사한다. runs/ pub/ triage-20261107/ dec-*.json render.lock 등 작업 데이터는 건드리지 않는다.
#           .tmp/work의 같은 파일이 더 최신이면(로컬에서 고친 것) 덮어쓰지 않고 알린다.
#   --force 로컬이 더 최신이어도 저장소 판으로 덮어쓴다.
#   --save  .tmp/work → 저장소. 로컬에서 고친 도구·지시서·ENGINE_GAPS.md를 저장소 폴더로 되돌려 복사한다(그 뒤 커밋은 직접).
set -u
SRC=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
R=$(cd "$SRC" && git rev-parse --show-toplevel) || { echo "ERROR: git 저장소가 아니다" >&2; exit 1; }
DST="$R/.tmp/work"
MODE=${1:-restore}
case "$MODE" in restore|--force|--save) ;; *) echo "usage: restore.sh [--force|--save]" >&2; exit 2;; esac
mkdir -p "$DST/prompts" "$DST/runs" "$DST/pub"

# 도구 파일 목록 = 저장소 폴더의 파일 중 README.md, restore.sh 제외
FILES=$(cd "$SRC" && find . -type f ! -name README.md ! -name restore.sh | sed 's#^\./##' | sort)
n=0; skip=0
for f in $FILES; do
  if [ "$MODE" = "--save" ]; then from="$DST/$f"; to="$SRC/$f"; else from="$SRC/$f"; to="$DST/$f"; fi
  [ -f "$from" ] || continue
  if [ -f "$to" ] && cmp -s "$from" "$to"; then continue; fi
  if [ "$MODE" = "restore" ] && [ -f "$to" ] && [ "$to" -nt "$from" ]; then
    echo "SKIP (로컬이 더 최신, 덮어쓰려면 --force 또는 먼저 --save): $f"; skip=$((skip+1)); continue
  fi
  mkdir -p "$(dirname "$to")"; cp -p "$from" "$to"; n=$((n+1)); echo "copied: $f"
done
[ "$MODE" = "--save" ] || chmod +x "$DST"/*.sh 2>/dev/null
echo "done: $n copied, $skip skipped -> $([ "$MODE" = "--save" ] && echo "$SRC" || echo "$DST")"
if [ "$MODE" != "--save" ]; then
  [ -f "$R/.tmp/svg-m1/svg2png.cjs" ] || echo "NOTE: .tmp/svg-m1 이 없다. 복원: cd \"$R\" && mkdir -p .tmp/svg-m1/runs .tmp/svg-m1/packets && cp -r archive/tools/geometry-equation/ops/svg-m1/. .tmp/svg-m1/"
  [ -d "$DST/triage-20261107" ] || echo "NOTE: .tmp/work/triage-20261107 이 없다. README.md의 'triage 브랜치 풀기' 절차를 따른다."
fi
