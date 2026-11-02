#!/bin/bash
# usage: ocrun.sh <prompt-file> <log-file> [timeout-sec=3600]
# Runs one opencode DeepSeek worker in its own empty directory (never the repo, never shared).
# opencode sometimes hangs at "init" (seen 2026-11-02); if the run has not started its agent loop
# within 150 s, kill it and retry (up to 3 tries).
set -u
P="$1"; LOG="$2"; TO="${3:-3600}"
OCLOG=/root/.local/share/opencode/log/opencode.log
for try in 1 2 3; do
  D=$(mktemp -d /tmp/claude-0/oc-run-XXXXXX)
  ( cd "$D" && OPENCODE_API_KEY=proxy-injected timeout "$TO" opencode run -m opencode-go/deepseek-v4.1-flash "$(cat "$P")" > "$LOG" 2>&1; echo "exit $?" >> "$LOG" ) &
  PID=$!
  started=0
  for i in $(seq 1 30); do
    sleep 5
    RUN=$(grep "creating instance\" directory=$D" "$OCLOG" 2>/dev/null | tail -1 | sed -E 's/.* run=([a-z0-9]+) .*/\1/')
    if [ -n "$RUN" ] && grep -q "run=$RUN message=loop" "$OCLOG"; then started=1; break; fi
    kill -0 $PID 2>/dev/null || { started=1; break; }
  done
  if [ $started = 1 ]; then wait $PID; tail -12 "$LOG"; exit 0; fi
  echo "ocrun: try $try stuck at init in $D, restarting" >&2
  for p in $(pgrep -x opencode); do [ "$(readlink /proc/$p/cwd)" = "$D" ] && kill -9 $p; done
  sleep 2
done
echo "ocrun: failed to start after 3 tries" | tee -a "$LOG"; exit 1
