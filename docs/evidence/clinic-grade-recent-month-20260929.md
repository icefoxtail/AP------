# 오답 클리닉 학년 전체 최근 1개월 집계 (2026-09-29)

## 동작

- 학년 공통 오답과 유형의 같은 학년 전체 범위는 모든 선생님의 같은 학년 활성 반을 조회한다.
- 한국 날짜 기준 조회일에서 이전 달 같은 날짜까지 포함한다. 월말은 이전 달 마지막 날짜로 보정한다. 예: 2026-09-29 조회는 2026-08-29~2026-09-29, 2026-03-31 조회는 2026-02-28~2026-03-31.
- 시험 원문 연도/학기 필터는 그대로 시험지 분류를 뜻하며, 최근 1개월은 학생의 응시일 범위다.
- 같은 문제지는 표시 제목과 풀이 날짜가 달라도 한 시험 항목으로 합친다. 같은 학생의 같은 문제지 재응시는 가장 최근 결과 하나를 반영한다.
- 다른 선생님 반에서만 출제한 시험도 학년 목록에 표시하고, 최초 학년 범위 선택 시 보이는 시험을 모두 선택한다.
- 최다빈출은 정답률 50% 초과, 최다오답은 50% 이하를 유지한다. 유형 순위는 오답 학생 수 내림차순을 우선한다.
- 배포 학생 선택은 통계 모집단을 바꾸지 않는다.
- 서로 다른 조립 문제지에 같은 원문 문항이 있을 때에는 그 문항을 푼 학생의 합집합으로 정답률을 계산한다. 다른 문제지에서 정답을 맞힌 학생도 분모에 포함한다.
- 학년 조회 오류/불완전 응답은 내 반 데이터로 대체하지 않는다. 결과와 미리보기를 비우고 재시도를 제공하며, 출력을 차단한다.
- 학년 목록은 여러 날짜의 통계이므로 개별 시험 삭제는 반 범위에서 수행한다.

## 서버 변경

학년 조회의 학생/응시 ID IN 목록을 JOIN 조회로 대체하고 응시 2,000건 제한을 제거했다. Blueprint/시험 제외 목록은 쿼리당 최대 100개, 학년 배포 권한 검사는 학년 파라미터를 포함해 학생 99명씩 처리한다. 배포 학생 해석은 100명씩 처리한다. Archive metadata 동기화는 4파일씩 수행한다.

## 검증

- `node --test tests/clinic-archive2-identity.test.cjs`: 12개 PASS. 다른 반/날짜 통합, 이전 달 및 윤년 월말, 반복 응시 최신 결과, 다른 반 전용 시험 기본 선택, 공유 원문 문항의 정답 응시자 포함, 응답을 기준으로 한 캐시 처리, 오류 시 재시도 표시, 두 유형의 정렬 및 원본 순번/UID 보존.
- `node --test tests/clinic-grade-recent-month-worker.test.cjs`: 7개 PASS. 실제 workerd + 로컬 D1에서 담당 반 1개뿐인 teacher가 같은 학년 다른 반까지 조회. 최근 응시 2,102건, 학생 125명, 시험/blueprint/제외 기록 105개 처리. 기간 밖/미래/다른 학년/비활성 반 제외. 권한 유지. 다른 선생님 반 학생을 포함한 125명 대상 유형 오답지 저장과 출력 payload 재조회. 학년 공통 오답 저장/재조회 시 정답률 80%와 20% 문항 모두 보존.
- `node tests/clinic-grade-recent-month-browser.cjs`: 9개 시나리오 PASS, 브라우저 오류 0개. 상단 학년 버튼의 공통 오답 4문항이 최다빈출 2문항과 최다오답 2문항의 합집합과 동일함을 확인. 내 반 4명으로 시작해 같은 학년 12명과 다른 반 전용 시험까지 확장. 최다오답 7명/5명 및 정답률 42%/38%, 최다빈출 정답률 83%/75% 확인. 수신자 1명 선택 시 통계 유지. 실패 시 결과와 iframe payload 제거, 재시도 복구.
- 기존 assignment visibility, exam identity, student portal wrong clinic 회귀 검사 PASS.
- Worker의 `npm run check` PASS: index/backup 문법 검사 및 Wrangler 4.110.0 `deploy --dry-run` 빌드. 실제 배포는 실행하지 않았다.

브라우저 테스트는 `AP_PLAYWRIGHT_MODULE`에 설치된 Playwright 모듈을 지정해 실행한다. 화면/JSON은 `reports/clinic-grade-recent-month-20260929/`에 저장한다. 위 검증은 배포 전 독립 검증 데이터를 사용한 결과이며 운영 학생 데이터는 사용하지 않았다.

## 운영 반영 전 전체 CI 확인

`node tools/run-tests.js`: PASS 182 / FAIL 6 / total 188. 변경 전 원격 main `1fe5a06c002ec51a2d68647a7d768896cf95f881`의 [CI 실행](https://github.com/icefoxtail/AP------/actions/runs/36523436244)에도 아래 5개 실패가 존재했다.

- archive-condition-marker-breaks.test.js
- archive-hangul-statement-breaks.test.js
- archive-latex-escapes.test.js
- print-render-authority-phase0-baseline.test.js
- svg-point-decimal-labels.test.js

Windows 로컬 실행은 추가로 `tests/apmath-class-progress-contract.test.mjs`의 taxonomy projection stale 검사에 실패했다. 해당 테스트가 읽는 canonical taxonomy, generator, projection 및 classroom/core/timetable/class-daily 파일은 이번 작업에서 변경하지 않았다. 기존 실패를 수정하거나 quarantine하는 변경은 이 배포에 포함하지 않는다. 로그는 같은 reports 폴더의 `full-ci-local.txt`, `upstream-ci-failures.txt`에 저장했다.
