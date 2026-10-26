#!/usr/bin/env bash
# Like step-task3.sh (DB-error retry, session delete) with snapshots disabled via OPENCODE_CONFIG (much faster on this huge repo).
# usage: step-task4.sh <name> <brief file in the briefs folder> "A B C" [max concurrent]
# A step that dies with opencode's DB error is retried (fresh session) up to 3 times.
export OPENCODE_CONFIG="${OPENCODE_CONFIG:-$(cd "$(dirname "$0")" && pwd -W)/opencode-worker.json}"  # snapshots off (repo copy)
name=$1 brief=$2 steps=$3 max=${4:-6}
B=${BRIEFS_POSIX:-/d/AI_WORKSPACES/APMS/briefs}; W=${BRIEFS_WIN:-D:/AI_WORKSPACES/APMS/briefs}  # brief + log folder
for s in $steps; do
  for try in 1 2 3; do
    sleep $((RANDOM % 30))
    while [ "$(tasklist 2>/dev/null | grep -i -c 'opencode.exe')" -ge "$max" ]; do sleep 60; done
    title="$name-$s"
    echo "=== STEP $s try $try $(date)" >> "$B/$name-steps.log"
    before=$(grep -c "Failed to execute statement" "$B/$name-steps.log")
    cd /d/AI_WORKSPACES/APMS/svg-$name && opencode run "Do STEP $s only (see the attached small-steps rules), for the attached task brief. Then stop with a short Korean report." --model opencode-go/deepseek-v4.1-flash --dir "D:/AI_WORKSPACES/APMS/svg-$name" --auto --title "$title" -f "$W/common-engine-rules.md" "$W/small-steps.md" "$W/$brief" >> "$B/$name-steps.log" 2>&1
    after=$(grep -c "Failed to execute statement" "$B/$name-steps.log")
    for sid in $(opencode session list 2>/dev/null | awk -v t="$title" '$2==t{print $1}'); do opencode session delete "$sid" >/dev/null 2>&1; done
    [ "$after" -gt "$before" ] || break
    echo "RETRY step $s after DB error" >> "$B/$name-steps.log"
  done
done
echo "DONE $name"; grep -n "=== STEP\|RETRY" "$B/$name-steps.log" | tail -8; tail -25 "$B/$name-steps.log"
