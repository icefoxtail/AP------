# 시험지 단위 launch 스크립트의 공통 함수 (launch-exam.sh, launch-exam-rev.sh가 `source`한다). env.sh를 먼저 source한 뒤 쓴다.

# 시험지 JS 이름으로 과목 문구를 만든다.
exam_subject() {
  case "$1" in
    *고1*) echo "과목: 고1 2학기 기말 시험지(고1 수학). 교육과정 기준은 고1로 읽는다(일차분모 유리함수·무리함수·이차함수·원·직선·집합·명제·경우의 수 등).";;
    *수학II*) echo "과목: 고2 수학II 2학기 기말 시험지. 교육과정 기준은 수학II(다항함수의 극한·연속·미분·적분)로 읽는다.";;
    *확률과통계*) echo "과목: 고2 확률과통계 2학기 기말 시험지. 교육과정 기준은 확률과통계(경우의 수·확률·확률분포·통계적 추정)로 읽는다.";;
    *) echo "과목: 시험지 파일명과 문항 내용으로 판단해 해당 과목 교육과정을 기준으로 읽는다.";;
  esac
}

# 판정표 key에 대응하는 dots 입력 폴더(있는 것만) 목록. INPUT_KEYS 환경변수(공백 구분)로 직접 지정할 수 있다.
exam_inputs() {
  local k=$1 keys="${INPUT_KEYS:-$1 $1-h1 $1-math2 $1-stat}" out="" x
  for x in $keys; do [ -d ".tmp/work/triage-20261107/inputs/$x/root-inputs" ] && out="$out .tmp/work/triage-20261107/inputs/$x/root-inputs/"; done
  echo "${out# }"
}

# 시험지 전 문항의 기존 해설 그림 분류표(exam-figs.cjs)를 출력한다.
exam_figs() { node .tmp/work/exam-figs.cjs "$1"; }
