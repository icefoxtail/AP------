# 공통 환경 (다른 스크립트가 `source`한다). 저장소 루트 R, 도구 폴더 W_DIR, Codex 설정을 정한다.
# 이식성: 경로를 하드코딩하지 않는다. 도구는 <저장소>/.tmp/work/ 에 펼쳐 쓰고(restore.sh), 작업 데이터도 거기에 쓴다.
W_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
R=$(cd "$W_DIR" && git rev-parse --show-toplevel 2>/dev/null) || { echo "ERROR: $W_DIR 가 git 저장소 안에 있지 않다." >&2; exit 1; }
if [ ! -f "$R/.tmp/work/prompts/impl-common.md" ]; then
  echo "ERROR: $R/.tmp/work 에 도구가 펼쳐져 있지 않다. 먼저 실행: bash archive/tools/geometry-equation/ops/claude-batch/restore.sh" >&2
  exit 1
fi
# 저장소 루트의 Windows 형식 경로(Codex --add-dir, 지시서의 작업 트리 경로). Windows가 아니면 pwd 그대로.
R_WIN=$(cd "$R" && { pwd -W 2>/dev/null || pwd; })

# .tmp/svg-m1 도구(svg2png.cjs, pubflow.py 등)가 있어야 한다. 없으면 복원 방법 안내.
need_svgm1() {
  if [ ! -f "$R/.tmp/svg-m1/svg2png.cjs" ]; then
    echo "ERROR: $R/.tmp/svg-m1 이 없다. 복원(HANDOFF_SVG_ENGINE.md §3):" >&2
    echo "  cd \"$R\" && mkdir -p .tmp/svg-m1/runs .tmp/svg-m1/packets && cp -r archive/tools/geometry-equation/ops/svg-m1/. .tmp/svg-m1/" >&2
    return 1
  fi
}

# Codex 실행 파일과 루나 작업 폴더. 환경변수 CODEX_BIN, CODEX_CWD로 바꾼다. 아래 기본값은 개발 PC(Windows) 전용 예시다.
need_codex() {
  CODEX_BIN="${CODEX_BIN:-C:/Users/USER/AppData/Local/OpenAI/Codex/bin/f71a721e0e6193a9/codex.exe}"
  CODEX_CWD="${CODEX_CWD:-C:/Users/USER/codex-svg-cwd}"
  if [ ! -f "$CODEX_BIN" ]; then
    echo "ERROR: Codex 실행 파일이 없다: $CODEX_BIN" >&2
    echo "  Codex CLI 0.167 이상(gpt-6-luna 사용 가능)을 설치하고 CODEX_BIN 환경변수로 경로를 지정한다." >&2
    echo "  Windows 앱 번들 예: find ~/AppData/Local/OpenAI/Codex/bin -name codex.exe (해시 폴더는 앱 갱신 시 바뀐다)." >&2
    return 1
  fi
  if [ ! -d "$CODEX_CWD" ]; then
    echo "ERROR: 루나 작업 폴더가 없다: $CODEX_CWD" >&2
    echo "  저장소 밖의 빈 폴더를 만들어 CODEX_CWD로 지정한다(저장소의 .codex/config.toml이 구버전 codex를 깨뜨리는 것을 피하는 용도)." >&2
    return 1
  fi
  if [ -z "${GEOMETRY_NODE_MODULES:-}" ] && [ ! -d "$R/.tmp/apmath-visual-engine/dependencies/node_modules/playwright" ]; then
    echo "WARN: 렌더 의존성이 없다. GEOMETRY_NODE_MODULES(playwright가 든 node_modules) 설정 또는 .tmp/apmath-visual-engine 준비가 필요하다(HANDOFF_SVG_ENGINE.md §3)." >&2
  fi
  [ -n "${GEOMETRY_NODE_MODULES:-}" ] && export GEOMETRY_NODE_MODULES
  return 0
}

# 지시서 파일을 읽어 <WORKTREE>를 이 PC의 저장소 경로로 바꿔 출력한다.
prompt_file() { sed "s#<WORKTREE>#$R_WIN#g" "$1"; }
