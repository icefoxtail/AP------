cat > CODEX_TASK.md <<'EOF'
# Codex 작업 지시서 — 학생 포털 OMR 제출 후 수정 완전 차단

## 목표

학생 포털에서 한 번 제출한 OMR은 다시 수정할 수 없게 한다.

절대 원칙:
- 학생이 한 번 제출한 OMR은 재입력/수정/재제출할 수 없다.
- 제출 완료 자료는 “제출 완료” 상태만 보여준다.
- `수정하기` 버튼은 학생 포털 OMR 흐름에서 완전히 제거한다.
- 제출 완료 상태에서 `renderOmrInput()`으로 진입할 수 없어야 한다.
- 시험지 직접 열기는 계속 절대 금지한다.

현재 문제:
- `apmath/student/index.html`의 배정 자료 섹션에서 제출 완료 자료에 `수정하기` 버튼이 표시된다.
- `renderOmrExamCard()`에서도 제출 완료 시험에 `수정하기` 버튼이 표시된다.
- `renderOmrInput(assignmentId)`가 제출 완료 여부를 막지 않으면 직접 호출로도 재입력 화면에 들어갈 수 있다.

이번 작업은 학생 포털 OMR 수정 차단만 처리한다.

---

## 수정 가능 파일

apmath/student/index.html
CODEX_RESULT.md

---

## 수정 금지 파일

archive/**
apmath/js/**
apmath/planner/**
schema.sql
index.js
worker/**
CODEX_TASK.md 외 기존 문서 파일

절대 금지:
- DB schema 수정 금지
- Worker API 수정 금지
- archive 파일 수정 금지
- apmath/js 파일 수정 금지
- planner 수정 금지
- 로그인/PIN/세션 흐름 수정 금지
- OMR 제출 API 변경 금지
- 시험지 직접 열기 링크 추가 금지
- 전체 파일 포맷팅 금지

---

## 작업 1. 배정 자료 섹션에서 제출 완료 버튼 제거

`renderStudentPortalAssignments()` 내부를 수정한다.

현재 구조에서 아래 흐름을 제거한다.

- 제출 완료인 경우 버튼 문구 `수정하기`
- 제출 완료인 경우 `openStudentPortalAssignmentOmr(...)` 연결

수정 기준:
- OMR exam이 있고 미제출일 때만 `OMR 입력` 버튼 표시
- OMR exam이 있고 제출 완료이면 버튼 없음
- OMR 미연결이면 버튼 없음

정확한 조건:
- `Number(exam?.is_submitted || 0) === 1` 이면 버튼을 렌더링하지 않는다.
- `showOmrButton`은 미제출 상태에서만 true가 되어야 한다.

예시 기준:

const isSubmitted = Number(exam?.is_submitted || 0) === 1;
const showOmrButton = !!assignmentId && !isSubmitted && typeof renderOmrInput === 'function';

버튼 문구:
- 미제출: OMR 입력
- 제출 완료: 버튼 없음

---

## 작업 2. OMR 목록에서 제출 완료 버튼 제거

`renderOmrExamCard(exam)` 내부를 수정한다.

현재 구조에서 제출 완료일 때 `수정하기` 버튼이 나오면 안 된다.

수정 기준:
- 미제출이면 `입력하기` 버튼 표시
- 제출 완료이면 버튼 없음
- 제출 완료 상태 pill은 유지
- 점수 표시가 있으면 상태 텍스트에 유지 가능

예시:
- 미제출: 버튼 `입력하기`
- 제출 완료: 버튼 영역 없음 또는 “제출 완료” 표시만 유지

주의:
- 제출 완료 자료에 클릭 가능한 입력 버튼이 남으면 실패
- `renderOmrInput()` 호출 버튼은 미제출 자료에만 존재해야 한다.

---

## 작업 3. renderOmrInput 직접 호출 방어

`renderOmrInput(assignmentId)` 시작 부분에 제출 완료 차단 방어를 추가한다.

기준:
1. `findOmrExam(assignmentId)`로 exam 확인
2. exam이 없으면 기존처럼 안내
3. `Number(exam.is_submitted || 0) === 1`이면 입력 화면을 열지 않는다.
4. 안내 toast만 띄우고 return

안내 문구:
이미 제출한 OMR은 수정할 수 없습니다.

주의:
- UI 버튼 제거만으로 끝내지 말 것
- 함수 직접 호출도 막아야 한다
- 기존 미제출 OMR 입력 흐름은 유지한다

---

## 작업 4. submitOmr 중복 제출 방어

`submitOmr()`에서도 제출 직전 한 번 더 방어한다.

기준:
- 현재 `exam = findOmrExam(omrDraft.assignment_id)` 이후
- `exam.is_submitted === 1`이면 제출하지 않고 return

안내 문구:
이미 제출한 OMR은 다시 제출할 수 없습니다.

주의:
- 중복 클릭/뒤로가기/상태 꼬임 방어 목적
- 기존 정상 제출 흐름은 유지한다

---

## 작업 5. 문구 검색 및 제거 확인

아래 문자열을 검색한다.

- `수정하기`
- `renderOmrInput(`
- `openStudentPortalAssignmentOmr(`

판정 기준:
- 학생 포털 OMR 제출 완료 상태에서 보이는 `수정하기` 문자열은 0건이어야 한다.
- `renderOmrInput(` 호출은 미제출 버튼 또는 내부 함수 정의에서만 허용한다.
- `openStudentPortalAssignmentOmr(` 호출은 미제출 상태 버튼에서만 허용한다.

`수정하기`가 과제 제출 등 OMR과 무관한 다른 기능에 있으면 건드리지 않는다.
단, OMR 카드/배정 자료 OMR 버튼에 있는 `수정하기`는 반드시 제거한다.

---

## 작업 6. 시험지 직접 열기 금지 재확인

이번 수정 후에도 아래가 없어야 한다.

금지:
- archive/engine.html 이동
- mixed_engine.html 이동
- archive/exams 직접 이동
- archive_file 기반 location.href
- MIXED:{key} 직접 실행

검색 기준:
- `archive/engine.html`
- `mixed_engine.html`
- `archive/exams`
- `location.href`
- `window.open`
- `fetch(`

판정:
- 기존 homework/planner 이동 등 기존 정상 흐름은 제외
- 시험지 직접 열기 관련 신규 로직이 있으면 실패

---

## 작업 7. 기존 기능 보존

반드시 보존:
- 학생 로그인
- PIN 로그인
- saveSession
- clearSession
- loginStudent
- openPlanner
- renderAssignments
- renderOmrExams
- renderOmrInput 미제출 입력 흐름
- submitOmr 최초 제출 흐름
- 기존 과제 제출/취소 흐름
- PWA 설치 안내

---

## 검증

HTML이므로 아래 방식으로 검증한다.

1. `<script>` 블록을 임시 JS 파일로 추출
2. `node --check` 실행
3. 임시 파일 삭제

추가 검색:
- `수정하기`
- `archive/engine.html`
- `mixed_engine.html`
- `archive/exams`

확인:
- `node --check` 통과
- OMR 제출 완료용 `수정하기` 제거
- 제출 완료 OMR에서 `renderOmrInput()` 진입 차단
- submitOmr 중복 제출 차단
- apmath/student/index.html 외 수정 파일 없음

---

## 완료 보고

CODEX_RESULT.md에 아래 형식으로만 기록한다.

# CODEX_RESULT

## 1. 생성/수정 파일
- apmath/student/index.html

## 2. 구현 완료
- 배정 자료 제출 완료 OMR 버튼 제거:
- OMR 목록 제출 완료 수정 버튼 제거:
- renderOmrInput 제출 완료 진입 차단:
- submitOmr 중복 제출 차단:
- 시험지 직접 열기 금지 유지:
- 기존 로그인/플래너/과제/최초 OMR 제출 흐름 보존:

## 3. 실행 결과
- apmath/student/index.html script 검증:
- OMR 수정 문구 검색:
- 직접 시험지 열기 문자열 검색:

## 4. 결과 요약
- 새 DB/API:
- 수정하지 않은 파일:
- 보류한 항목:

## 5. 다음 조치
- 실제 테스트 후 문제 발생 시 재수정

터미널 마지막 출력은 아래 한 줄만 남긴다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

