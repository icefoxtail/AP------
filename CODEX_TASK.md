cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 작업명
2차 작은 안정화 B묶음: 리포트·출력·QR 안정성 4종 보강

## 작업 목적

A묶음 프론트 운영 안정성 4종 보강이 완료되었으므로, 이어서 B묶음 안정화 4개를 진행한다.

이번 작업은 신규 기능 추가가 아니라 리포트/출력/QR 쪽에서 운영 중 터질 수 있는 작은 안정성 문제를 보강하는 작업이다.

이번 B묶음 범위는 아래 4개만 처리한다.

1. `report.js` report payload 누적 제한
2. `report.js` html2canvas 실패 처리 보강
3. `clinic-print.js` JS 문자열 escape 분리
4. `qr-omr.js` `getCheckBaseUrl()` 안전화

아래 A묶음 4개는 이미 완료된 것으로 보고 이번 작업에서 다시 건드리지 않는다.

- `core.js` syncQueue 데드락 방지
- `dashboard.js` 전화번호 복사 fallback
- `management.js` 주소록 검색 디바운스
- `schedule.js` 일정 달력 클릭 이벤트 중복 방지

## 반드시 먼저 읽을 문서

작업 전 반드시 아래 문서를 처음부터 끝까지 읽고, 그 원칙을 우선 적용하라.

- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`

있다면 아래 문서도 함께 읽어라.

- `docs/INITIAL_DATA_SPLIT_ANALYSIS.md`
- `docs/WANGJI_OS_ROADMAP.md`
- `docs/WANGJI_OS_STRUCTURE.md`

문서가 없으면 새로 추정해서 만들지 말고, 현재 레포에 존재하는 문서 기준으로만 작업한다.

## 절대 원칙

- 이번 작업은 B묶음 4개 안정화만 진행한다.
- 기존 UI 문구·버튼명·화면명·메뉴명·운영 용어를 임의로 변경하지 않는다.
- “숙제”를 “과제”로 바꾸는 식의 용어 변경 금지.
- 원장/관리자 대시보드에 새 카드, 새 버튼, 새 메뉴를 노출하지 않는다.
- 학생 포털, 학생 OMR, 플래너 흐름은 이번 작업에서 건드리지 않는다.
- 학생의 시험지 직접 열기 금지 원칙을 건드리지 않는다.
- 학생 OMR 제출 완료 후 재수정 금지 원칙을 건드리지 않는다.
- 세션 토큰 인증 구조를 건드리지 않는다.
- `raw_password`, `password`, `pw` 저장 구조를 다시 만들지 않는다.
- 수납·출납 foundation initial-data 축소 결과를 되돌리지 않는다.
- 수납·출납 foundation 진입점 숨김 상태를 유지한다.
- A묶음에서 수정한 `core.js`, `dashboard.js`, `management.js`, `schedule.js`는 이번 작업에서 다시 수정하지 않는다.
- 실제 청구 생성 금지.
- 실제 결제 연동 금지.
- 실제 알림톡/문자 발송 금지.
- DB schema 변경 금지.
- migration 추가 금지.
- Worker route 수정 금지.
- 사용자가 명시하지 않았으므로 Worker 배포 금지.
- 사용자가 명시하지 않았으므로 운영 API smoke test 금지.
- 사용자가 명시하지 않았으므로 git add / git commit / git push 금지.
- `git add .` 금지.

## 수정 가능 파일

이번 작업에서 수정 가능한 파일은 아래로 제한한다.

- `apmath/js/report.js`
- `apmath/js/clinic-print.js`
- `apmath/js/qr-omr.js`
- `CODEX_RESULT.md`

## 수정 금지 파일

아래 파일은 수정하지 않는다.

- `apmath/js/core.js`
- `apmath/js/dashboard.js`
- `apmath/js/management.js`
- `apmath/js/schedule.js`
- `apmath/js/classroom.js`
- `apmath/js/student.js`
- `apmath/js/cumulative.js`
- `apmath/js/textbook.js`
- `apmath/worker-backup/worker/index.js`
- `apmath/worker-backup/worker/routes/auth.js`
- `apmath/worker-backup/worker/routes/billing-accounting-foundation.js`
- `apmath/worker-backup/worker/schema.sql`
- `apmath/worker-backup/worker/migrations/`
- `apmath/student/index.html`
- `apmath/planner/index.html`
- `archive/`

수정 금지 파일에 문제가 발견되면 수정하지 말고 `CODEX_RESULT.md`에 “다음 작업 필요”로 기록한다.

## 1. report.js report payload 누적 제한

대상 파일:

- `apmath/js/report.js`

목표:

`window.AP_REPORT_CONTEXT_OPTIONS` 또는 유사한 report context/payload 배열이 리포트 생성/열람을 반복할 때 계속 누적되어 메모리와 payload가 불필요하게 커지는 문제를 방지한다.

확인할 대상 후보:

- `window.AP_REPORT_CONTEXT_OPTIONS`
- `AP_REPORT_CONTEXT_OPTIONS`
- report context 저장 함수
- report payload 생성 함수
- report modal open/render 함수
- print/export/pdf 관련 함수

실제 함수명은 현재 코드 기준으로 확인한다.

구현 기준:

- 기존 리포트 생성 흐름과 출력 결과를 바꾸지 않는다.
- 기존 리포트 문구, 버튼명, 제목, 안내문은 변경하지 않는다.
- `window.AP_REPORT_CONTEXT_OPTIONS` 같은 전역 배열이 있으면 최대 보관 개수를 제한한다.
- 권장 최대 개수는 20~30개 범위로 잡되, 기존 사용 패턴을 보고 적절히 결정한다.
- 같은 report id/session/student 조합이 반복 저장될 경우 중복 누적을 줄인다.
- 오래된 항목부터 제거한다.
- 기존 참조 방식이 깨지지 않도록 배열 자체를 유지하거나, 필요한 경우 splice로 정리한다.
- 전역 객체를 아예 삭제하지 않는다.
- report 생성 직후 필요한 context가 사라지지 않도록 너무 공격적으로 지우지 않는다.

권장 구현 방향:

- `limitReportContextOptions()` 같은 작은 helper 추가 가능
- context push 직후 limit helper 호출
- 중복 판별 가능한 key가 있으면 중복 제거 후 push
- 중복 판별이 애매하면 단순 length cap만 적용

검증 포인트:

- `node --check apmath/js/report.js` 통과
- 리포트 생성/출력 버튼명 변경 없음
- `window.AP_REPORT_CONTEXT_OPTIONS`가 무제한 증가하지 않음

## 2. report.js html2canvas 실패 처리 보강

대상 파일:

- `apmath/js/report.js`

목표:

이미지 저장 또는 캡처 과정에서 `html2canvas`가 없거나 실패할 때 화면이 멈추거나 로딩 상태가 풀리지 않는 문제를 방지한다.

확인할 대상 후보:

- `html2canvas`
- 이미지 저장 함수
- 리포트 캡처 함수
- PNG/JPG 다운로드 함수
- clean PDF / report export 함수
- loading indicator 또는 버튼 disabled 처리

실제 함수명은 현재 코드 기준으로 확인한다.

구현 기준:

- `window.html2canvas` 또는 `html2canvas` 존재 여부를 확인한다.
- html2canvas가 없으면 안전하게 안내하고 종료한다.
- html2canvas promise 실패 시 catch에서 안내하고 종료한다.
- finally에서 로딩/버튼 disabled/body class 등을 원복한다.
- 기존 성공 흐름은 바꾸지 않는다.
- 기존 리포트 출력 문구, 버튼명, 화면 구조는 변경하지 않는다.
- 실패 시 과도한 alert 남발 금지. 기존 toast 함수가 있으면 기존 스타일을 따른다.
- 캡처 대상 DOM이 없을 때도 안전 종료한다.

권장 구현 방향:

- try/catch/finally 구조로 감싼다.
- `const html2canvasFn = window.html2canvas || html2canvas`처럼 접근할 경우 ReferenceError가 나지 않게 `typeof html2canvas !== 'undefined'`를 사용한다.
- `finally`에서 버튼/로딩 상태 원복.
- 실패 로그는 `console.warn` 수준으로 남긴다.

검증 포인트:

- `node --check apmath/js/report.js` 통과
- html2canvas 미존재 환경에서 JS exception 없음
- 실패 후 버튼/로딩 상태가 원복됨

## 3. clinic-print.js JS 문자열 escape 분리

대상 파일:

- `apmath/js/clinic-print.js`

목표:

HTML attribute escape와 인라인 JS 문자열 escape가 같은 함수로 처리되어 따옴표, 역슬래시, 줄바꿈, `</script>`류 문자열에서 깨질 수 있는 위험을 줄인다.

확인할 대상 후보:

- `clinicPrintEscapeAttr`
- inline `onclick`
- JS 문자열로 삽입되는 archive/session/student/title 값
- clinic print 버튼 렌더링
- wrong print payload 조립 부분

실제 함수명은 현재 코드 기준으로 확인한다.

구현 기준:

- 기존 `clinicPrintEscapeAttr()`는 HTML attribute escape 용도로 유지한다.
- 인라인 JS 문자열에는 별도 helper를 사용한다.
- 새 helper 이름 예시: `clinicPrintEscapeJsString`
- JS string escape는 최소한 아래를 안전하게 처리한다.
  - backslash
  - single quote
  - double quote
  - newline
  - carriage return
  - `<`
  - `>`
  - `&`
  - `</script>` 위험 문자
- 기존 버튼명, 문구, 출력 UI는 변경하지 않는다.
- clinic print payload 구조는 변경하지 않는다.
- MIXED archive 처리나 wrong print engine 경로는 변경하지 않는다.
- 기존 함수 호출 중 HTML attribute에 넣는 부분과 JS string에 넣는 부분을 구분한다.

권장 구현 방향:

- HTML attribute: 기존 `clinicPrintEscapeAttr(value)` 유지
- JS string: `clinicPrintEscapeJsString(value)` 신규 추가
- onclick 내부 `'${...}'`에 들어가는 값만 JS escape helper로 교체
- innerHTML 텍스트 출력용 escape는 기존 escape 사용

검증 포인트:

- `node --check apmath/js/clinic-print.js` 통과
- 기존 clinic print 버튼 렌더링 유지
- 문자열에 따옴표/줄바꿈이 있어도 onclick 깨짐 위험 감소

## 4. qr-omr.js getCheckBaseUrl() 안전화

대상 파일:

- `apmath/js/qr-omr.js`

목표:

현재 페이지 경로 계산 방식이 배포 위치, 하위 경로, trailing slash, query/hash에 따라 깨질 수 있는 문제를 줄이고, QR/OMR check base URL 계산을 더 안전하게 만든다.

확인할 대상 후보:

- `getCheckBaseUrl`
- QR URL 생성 함수
- OMR check URL 생성 함수
- location origin/pathname 사용 부분

실제 함수명은 현재 코드 기준으로 확인한다.

구현 기준:

- 기존 QR/OMR 기능 흐름을 바꾸지 않는다.
- 학생 시험지 직접 열기 금지 원칙을 건드리지 않는다.
- 학생 OMR 제출 완료 후 재수정 금지 원칙을 건드리지 않는다.
- `window.location.origin`이 있으면 우선 사용한다.
- pathname에서 파일명과 query/hash를 안전하게 제거한다.
- `/apmath/` 하위 배포와 루트 배포 모두 가능한 형태로 계산한다.
- 중복 slash를 줄인다.
- 반환 URL 끝 slash 처리 기준을 일관되게 한다.
- 기존 QR 파라미터명, 링크 구조를 임의로 바꾸지 않는다.

권장 구현 방향:

- `new URL('.', window.location.href)` 사용 가능하면 우선 고려한다.
- 단, 현재 기존 링크 구조가 특정 base를 기대하면 그 구조를 보존한다.
- `try/catch`로 URL 계산 실패 시 fallback 사용.
- fallback은 `window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/')` 형태를 안전하게 정리.
- hash/query는 base에 포함하지 않는다.

검증 포인트:

- `node --check apmath/js/qr-omr.js` 통과
- 기존 QR 생성 함수명 유지
- check URL에 query/hash 중복 포함 없음
- 학생 직접 시험지 열기 기능 추가 없음

## 5. 검증

수정한 파일에 대해 문법 검증을 실행한다.

필수:

- `node --check apmath/js/report.js`
- `node --check apmath/js/clinic-print.js`
- `node --check apmath/js/qr-omr.js`

가능하면 추가 확인:

- `git diff --name-only`
- `git status --short`
- `Select-String -Path "apmath/js/report.js" -Pattern "AP_REPORT_CONTEXT_OPTIONS","html2canvas"`
- `Select-String -Path "apmath/js/clinic-print.js" -Pattern "clinicPrintEscapeAttr","clinicPrintEscapeJsString","onclick"`
- `Select-String -Path "apmath/js/qr-omr.js" -Pattern "getCheckBaseUrl"`

허용 변경 파일:

- `apmath/js/report.js`
- `apmath/js/clinic-print.js`
- `apmath/js/qr-omr.js`
- `CODEX_RESULT.md`

`CODEX_TASK.md`가 기존 dirty 상태라면 `CODEX_RESULT.md`에 별도 확인 대상으로 적고, 커밋 대상에서는 제외하라.

Worker 배포는 실행하지 않는다.
운영 API smoke test는 실행하지 않는다.
git add / commit / push는 실행하지 않는다.

## 6. 완료 보고

작업 완료 후 프로젝트 루트에 `CODEX_RESULT.md`를 작성한다.

반드시 아래 형식을 사용한다.

# CODEX_RESULT

## 1. 생성/수정 파일
- 생성/수정한 파일 목록

## 2. 구현 완료 또는 확인 완료
- report.js report payload 누적 제한 완료 여부
- report.js html2canvas 실패 처리 보강 완료 여부
- clinic-print.js JS 문자열 escape 분리 완료 여부
- qr-omr.js getCheckBaseUrl 안전화 완료 여부
- 기존 UI 문구·버튼명·화면명 보존 여부
- 학생 시험지 직접 열기 금지 원칙 보존 여부
- 학생 OMR 제출 완료 후 재수정 금지 원칙 보존 여부
- 세션 토큰 인증 구조 보존 여부
- 수납·출납 initial-data 축소 결과 보존 여부
- 실제 청구/결제/발송 미실행 여부
- 코드 수정 범위 준수 여부

## 3. 실행 결과
- node --check 실행 결과
- 관련 키워드 검색 결과 요약
- git diff --name-only 결과
- git status --short 결과
- Worker 배포 실행 여부: 미실행 - 사용자 직접 실행 대상
- 운영 smoke 실행 여부: 미실행 - 사용자 직접 실행 대상
- git commit 실행 여부: 미실행 - 사용자 직접 실행 대상
- git push 실행 여부: 미실행 - 사용자 직접 실행 대상

## 4. 결과 요약
- 이번 B묶음 안정화에서 실제 보강된 내용
- 기존 기능 영향 여부
- 2차 작은 안정화 전체 완료 여부

## 5. 다음 조치
- 사용자가 직접 코드 diff 확인
- 필요 시 Gemini 또는 다른 리뷰어에게 B묶음 검수 요청
- 필요 시 사용자가 직접 지정 파일만 git add
- 권장 커밋 메시지
- 커밋 대상 파일

완료 보고에는 반드시 아래 항목을 포함한다.

- 기존 문구 변경 여부:
- 기존 버튼명 변경 여부:
- 기존 화면명 변경 여부:
- 기존 메뉴명 변경 여부:
- 기존 운영 용어 변경 여부:
- 학생 시험지 직접 열기 금지 원칙 변경 여부:
- 학생 OMR 제출 완료 후 재수정 금지 원칙 변경 여부:
- 세션 토큰 인증 구조 변경 여부:
- Basic fallback 변경 여부:
- initial-data 응답 구조 변경 여부:
- 수납·출납 foundation 진입점 숨김 유지 여부:
- DB schema 변경 여부:
- migration 추가 여부:
- 실제 청구 생성 여부:
- 실제 결제 연동 여부:
- 실제 알림톡/문자 발송 여부:
- 배포 실행 여부:
- 운영 smoke 실행 여부:
- git commit 실행 여부:
- git push 실행 여부:

## 7. 권장 커밋 메시지

작업 완료 후 사용자가 직접 커밋할 경우 권장 메시지:

Stabilize report export and QR helpers

## 8. 최종 출력

터미널 마지막 출력은 아래 문장으로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

EOF