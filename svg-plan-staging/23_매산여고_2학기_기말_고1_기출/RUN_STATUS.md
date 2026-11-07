# 23 매산여고 고1 2학기 기말 — 실행 상태

## 전체

- 계획 분모: 23문항.
- ROOT 계획 전문: ROOT_PLAN.md에 보존.
- ROOT README 기준 신규 초안 수: 18문항.
- 완전한 item·plan·publish 입력 세트: 15문항.
- 메시지 조각만 보존: Q7 publish 1개.
- 입력 본문 미복원: Q7 item/plan 일부, Q10 전체 세트, Q18 전체 세트.
- 공식 엔진 렌더: 0개. 모든 미보호 문항 렌더 상태 NOT_RUN.
- 독립 Claude Code 검수: NOT_RUN.
- 학생 화면·게시·PR·main 반영: NOT_RUN.
- Q6·Q9·Q16·Q22는 기존 작업 보호 지시에 따라 건드리지 않았다. Q8은 이력 확인 대기로 유지했다.

## 렌더 환경 차단 기록

공식 설정 명령 GEOMETRY_PYTHON=python3 node archive/tools/geometry-equation/production/setup-spikes.mjs로 의존성을 복원하려 했다.

1. 첫 실행은 npm 기본 캐시 경로 /home/agent/.npm/_cacache를 만들 수 없어 실패했다.
2. npm_config_cache=/tmp/apmath-npm-cache를 지정한 추가 설정 두 번은 npm 및 Python 의존성을 설치했지만, 고정된 Noto Sans KR 글꼴 파일 다운로드가 raw.githubusercontent.com DNS 오류 EAI_AGAIN으로 각각 실패했다.

이후 글꼴 다운로드를 우회하거나 재시도하지 않았다. 공식 renderer 준비가 완료되지 않았고 실제 render-plan.mjs 실행은 하지 않았다. 대체 폰트·수동 SVG·다른 renderer를 사용하지 않았다. 엔진 parser/observer, 실제 PNG, 학생 화면 및 시각 답 노출 검사는 NOT_RUN이다.

## 문항별 상태

| 문항 | 입력 | 원문 수학·정답 대조 | 엔진 계약 / 렌더 | 시각 QA |
| --- | --- | --- | --- | --- |
| Q01 | 확보 | 확인 | NOT_RUN | NOT_RUN |
| Q02 | 확보 | 확인 | NOT_RUN | NOT_RUN |
| Q03 | 확보 | 확인; 원본 q3.png 확인 | NOT_RUN | NOT_RUN |
| Q04 | 확보 | 확인 | NOT_RUN | NOT_RUN |
| Q05 | 확보 | 확인 | NOT_RUN | NOT_RUN |
| Q06 | 보호 | 기존 기록 유지 | OPEN | NOT_RUN |
| Q07 | publish 조각만 복원; 5회 시도·OPEN 기록 보존 | 판정 보류 | OPEN | NOT_RUN |
| Q08 | 이력 대기 | 판정 보류 | OPEN | NOT_RUN |
| Q09 | 보호; 기존 SVG 존재 | 기존 기록 유지 | OPEN | NOT_RUN |
| Q10 | 본문 미복원 | 판정 보류 | OPEN | NOT_RUN |
| Q11 | 확보 | 확인 | NOT_RUN | NOT_RUN |
| Q12 | 확보 | 확인 | NOT_RUN | NOT_RUN |
| Q13 | 확보 | 확인 | NOT_RUN | NOT_RUN |
| Q14 | 확보 | 확인 | NOT_RUN | NOT_RUN |
| Q15 | 확보 | 확인 | NOT_RUN | NOT_RUN |
| Q16 | 보호 | 기존 기록 유지 | OPEN | NOT_RUN |
| Q17 | 확보; 원본 q17.png 확인 | 예시 배열 조건 대조 | NOT_RUN | NOT_RUN |
| Q18 | 본문 미복원; 메시지 STATUS 조각만 확인 | 판정 보류 | OPEN | NOT_RUN |
| Q19 | 확보 | 확인 | NOT_RUN | NOT_RUN |
| Q20 | 확보 | 확인 | NOT_RUN | NOT_RUN |
| Q21 | 확보 | 확인 | NOT_RUN | NOT_RUN |
| Q22 | 보호; 기존 SVG 존재 | 기존 기록 유지 | OPEN | NOT_RUN |
| Q23 | 확보 | 확인 | NOT_RUN | NOT_RUN |

Q19의 초안에는 multi-curve 계약상 필수 sourceConditions 및 newVisualInformation이 빠져 있어 요청 원문에 근거해 보완했다. 정적 수학 검토 결과와 해시는 validation/static-review.json에 기록한다. 이 기록은 공식 renderer 또는 독립 시각 검수의 완료를 뜻하지 않는다.

이 상태 문서는 성공·완료가 확인되지 않은 항목을 OPEN/NOT_RUN으로 유지한다.
