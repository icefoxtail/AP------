#!/usr/bin/env bash
# One supervisor for all CLI (opencode) workers. Exits — so the controller gets notified — on the first NEW event:
#   DONE <name>     a runner (<name>-runner.out) finished
#   DBERR <name>    a step log shows opencode's DB error
#   STALL <name>    a running worker's step log idle > 90 min (reported once per step; skipped while the runner is still queued)
#   DISK            C: free < 10 GB (all opencode killed)
# Already reported events are remembered in supervise.state, so re-running it waits for the next event.
B=${BRIEFS_POSIX:-/d/AI_WORKSPACES/APMS/briefs}; S=$B/supervise.state; touch $S
names=${*:-"x7 x8 x9 g1 g2 g3 g4 g5 g6"}
report(){ grep -qxF "$1" $S && return 1; echo "$1" >> $S; echo "EVENT $1"; return 0; }
while true; do
  free=$(df -BG /c | tail -1 | awk '{print $4}' | tr -d G)
  if [ "$free" -lt 10 ]; then taskkill //IM opencode.exe //F >/dev/null 2>&1; echo "EVENT DISK free=${free}G"; exit 0; fi
  ev=0
  for n in $names; do
    r=$B/$n-runner.out; l=$B/$n-steps.log
    if [ -f $r ] && grep -q '^DONE' $r; then report "DONE $n" && ev=1; continue; fi
    [ -f $l ] && grep -q "Failed to execute statement" $l && report "DBERR $n" && ev=1
    if [ -f $l ] && [ ! $r -nt $l ]; then age=$(( $(date +%s) - $(stat -c %Y $l) )); step=$(grep "=== STEP" $l | tail -1 | tr -d " :"); [ $age -gt 5400 ] && report "STALL $n $step" && ev=1; fi
  done
  if [ $ev = 1 ]; then
    echo "procs=$(tasklist 2>/dev/null | grep -i -c opencode.exe) C_free=${free}G db=$(( $(stat -c %s ~/.local/share/opencode/opencode.db 2>/dev/null || echo 0)/1048576 ))MB"
    exit 0
  fi
  sleep 120
done
