# CODEX_RESULT

## 1. 생성/수정 파일

- 생성: `docs/design/APMS_TYPOGRAPHY_AUDIT_POLICY.md`
- 수정: `apmath/js/dashboard.js`
- 수정: `apmath/js/classroom.js`
- 수정: `apmath/js/management.js`
- 수정: `apmath/js/student.js`
- 수정: `apmath/js/memo.js`
- 수정: `apmath/js/schedule.js`
- 수정: `apmath/js/textbook.js`
- 수정: `apmath/js/qr-omr.js`
- 수정: `apmath/student/index.html`
- 수정: `apmath/planner/index.html`
- 수정: `CODEX_RESULT.md`

## 2. 작업 내용

### 정책 문서
- APMS Typography Policy를 `400 / 500 / 600` 3단계 기준으로 문서화했다.
- `700 / 800 / 900` 신규 사용 금지와 `b / strong` 처리 기준을 명시했다.
- dashboard, classroom, student portal, planner, OMR/QR, 고위험 인쇄/리포트/시간표 영역의 적용 기준을 분리했다.

### b / strong 감사 및 보정
- 현재 작업분의 `b` / `strong` 위치를 전수 검색했다.
- 브라우저 기본 bold가 700처럼 보일 수 있는 태그를 `span`과 명시 weight로 전환했다.
- 의미 강조는 600 이하, 구조 정보는 500, 보조 정보는 400 기준으로 정리했다.

### 600 강조 후보 분류
- 유지: dashboard 위험 상태 라벨 `상태: ...`
- 유지: student portal `확인 필요`, 현재 선택 오답 수, 예상 점수
- 유지: qr-omr O/X 판정
- 유지: management PIN 안내의 핵심 대상 문구
- 하향: meta / desc / empty / 날짜 / 일반 label / 입력값 계열 600

### 정책 범위 보정
- 기능/문구/API/onclick/저장 로직은 변경하지 않았다.
- OMR 제출 완료 후 수정 금지 흐름, QR payload, 플래너 query/PIN 흐름은 변경하지 않았다.
- 플래너 피드백 이모지 값은 저장 데이터와 연결될 수 있어 삭제하지 않았다.

## 3. 실행 결과

- `node --check apmath/js/dashboard.js` 통과
- `node --check apmath/js/classroom.js` 통과
- `node --check apmath/js/management.js` 통과
- `node --check apmath/js/student.js` 통과
- `node --check apmath/js/memo.js` 통과
- `node --check apmath/js/schedule.js` 통과
- `node --check apmath/js/textbook.js` 통과
- `node --check apmath/js/study-material-wrong.js` 통과
- `node --check apmath/js/qr-omr.js` 통과
- `node --check apmath/js/clinic-print.js` 통과
- `apmath/student/index.html` inline script parse 확인 통과
- `apmath/planner/index.html` inline script parse 확인 통과

검색 확인:

- 대상 파일 내 `<b>`, `</b>`, `<strong`, `</strong>` 검색 결과 없음
- 대상 파일 내 `font-weight:700/800/900` 검색 결과 없음
- 남은 `font-weight:600`은 정책상 허용한 의미 강조 후보만 남김

## 4. 결과 요약

APMS Typography Policy를 문서화하고, 현재 작업분의 bold/strong/600 강조를 정책 기준에 맞게 1차 정리했다. 전체 UI를 평평하게 만든 것이 아니라, 의미 있는 짧은 정보만 600으로 남기고 나머지는 400~500 중심으로 낮췄다.

## 5. 다음 조치

- 브라우저에서 dashboard, classroom, student portal, planner, QR/OMR 화면 확인
- 남은 600 강조가 실제 화면에서 과하지 않은지 PC/모바일 확인
- 2차 확산 후보: core, ui, index, sidebar, homework
- 고위험 보류: timetable, cumulative, report, wrong_print_engine, print CSS
