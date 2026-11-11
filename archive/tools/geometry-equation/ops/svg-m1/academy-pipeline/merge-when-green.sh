#!/bin/bash
# usage: bash .tmp/work/merge-when-green.sh <PR번호>
# CI 검사가 실제로 등록되고(4개 이상) 전부 통과했을 때만 머지한다. 검사가 안 보이면 머지하지 않는다.
N=$1; REPO=icefoxtail/AP------
for i in $(seq 1 20); do
  C=$(gh pr checks $N --repo $REPO 2>/dev/null | grep -c -v '^observe')
  [ "$C" -ge 4 ] && break
  sleep 30
done
[ "$C" -ge 4 ] || { echo "$N NO_CHECKS_REGISTERED ($C) - not merging"; exit 2; }
gh pr checks $N --repo $REPO --watch --interval 60 >/dev/null 2>&1
OUT=$(gh pr checks $N --repo $REPO | grep -v '^observe')
echo "$OUT" | cut -f1,2
if echo "$OUT" | cut -f2 | grep -qv '^pass$'; then echo "$N NOT_ALL_PASS - not merging"; exit 3; fi
gh pr merge $N --repo $REPO --merge 2>&1 | tail -1
gh pr view $N --repo $REPO --json state -q '"'$N' "+.state'
