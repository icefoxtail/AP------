이제 네 문서를 전부 통합해 최종본을 작성한다.

---

# CODEX_TASK_FINAL

## 0. 이 문서의 성격

이 문서는 ChatGPT 원지시(CHATGPT_CODEX_TASK), Codex 1차 검토(CODEX_TASK_REVIEW), Claude 반박(CLAUDE_REBUTTAL), Codex 재반박(CODEX_REBUTTAL)을 통합해 보정한 최종 지시서다.

**이번 작업은 구현이 아니다.** 조사, 확인, 계획서 작성만 한다.

이 문서는 Codex 앱에 직접 붙여넣어 실행한다. PowerShell 래퍼, `Set-Content`, `@'...'@` 형식 없이 순수 Markdown이다.

---

## 1. 최종 목표

EIE 클래스룸과 학생상담의 실제 구현 수준을 코드 기준으로 확인하고, AP MATH와 개념 비교하여, 다음 구현 라운드를 나누기 위한 계획서를 작성한다.

**목표 범위:**
1. EIE 클래스룸 현재 구현 수준 확인
2. EIE 학생상담 현재 구현 수준 확인
3. 선생님 대시보드와 클래스룸/학생상담 연결 흐름 확인
4. 원장 관전 구조 가능성과 미결 정책 조사 (구현 금지)
5. 원장 대시보드 선생님 현황판 후속 연결 조건 조사 (구현 금지)

---

## 2. 구현 범위

**이번 작업에서 허용되는 유일한 파일 생성:** `CODEX_RESULT1.md` (루트)

그 외 어떤 파일도 생성하지 않는다. 어떤 코드도 수정하지 않는다.

---

## 3. 금지 범위

- 코드 수정 금지
- CSS 수정 금지
- route/hash 변경 금지
- 파일명 변경/삭제/rename/move 금지
- 대량 문자열 치환 금지
- AP MATH 원본 수정 금지 (읽기만 허용)
- AP MATH 코드 복사/이식 금지 (개념 비교만)
- EIE 시간표 핵심 로직 수정 금지
- DB migration 금지
- Worker/API 권한 구조 변경 금지
- 원장 관전/관람 실제 구현 금지
- 원장 대시보드 선생님 현황판 실제 구현 금지
- 상담/출결 저장 로직 신규 구현 금지
- UI 문구 임의 확정 금지
- git add 금지
- git commit 금지
- git push 금지
- 자동 zip 생성 금지
- 파일명이 다르면 대응 파일 탐색만 하고 rename/이동 금지
- shell 명령 실행 금지 (node --check 등 검증 명령도 이번 단계에서는 금지)

---

## 4. ChatGPT 원지시에서 보정한 누락/오판

| 원지시 표현 | 보정 방향 | 이유 |
|---|---|---|
| "Phase 1~3: 구현 완성" 전제 | "Phase 1~3: 실제 코드 확인 → 안정화/검증 전환 가능" | Claude 확인에 따르면 API CRUD 함수, isDirector(), consultation tab이 이미 존재한다. 구현 전제가 틀릴 수 있음 |
| "AP MATH에서 가져올 수 있는 구조" | "AP MATH에서 개념 참고할 수 있는 부분" | 파일 구조 자체가 다름(EIE: eie-teacher.js 단일 / AP MATH: dashboard-teacher.js 분리). 파일 단위 이식 위험 |
| "상담 유형 사용자 확인 필요" | "현재 코드값 확인 + 현장 용어와 일치하는지 검증" | 이미 코드에 학습/태도/성적/기타로 구현되어 있을 가능성. 새로 정하는 게 아니라 기존값 검증 문제 |
| "AP MATH CSS 파일" 뭉뚱그림 | 실제 CSS 파일명 탐색 후 목록 작성 | 모호한 표현은 조사 근거를 흐림 |
| 맨 아래 Set-Content shell 스크립트 | 완전 제거 | "파일 수정 금지" 조건과 정면 충돌 |
| Phase 2 "상담 기본 흐름 완성" | "상담 UX 안정화 및 연결 검증"으로 표현 조정 | saveConsultation() 등이 이미 존재한다면 신규 구현이 아니라 검증 문제 |

---

## 5. Codex 검토에서 반영한 기술 위험

아래 위험은 코드 확인 전 추정이지만 반드시 확인해야 한다.

- **API 함수 존재 ≠ 운영 흐름 완성.** 함수 이름만 있고 form submit, null guard, refresh, 실패 처리, 권한 차단이 연결되어야 "구현됨"이다.
- **`isDirector()` 존재 ≠ 원장 관전 준비 완료.** route 진입, 읽기 전용 상태 전파, 쓰기 API 차단, state mutation 방지가 없으면 준비 완료가 아니다.
- **import/export 방식과 script 로딩 순서 미확인.** `index.html` script 순서에 따라 함수가 undefined일 수 있다. global window 함수인지 ES module인지 확인 필요.
- **route/state partial 위험.** teacherId/classId/lessonId 중 일부만 있는 상태에서 classroom이 열릴 경우 null 접근 위험이 있다.
- **API 응답 shape 미확인.** `{ data: [] }`, `{ students: [] }`, raw array 충돌 가능성.
- **상담 저장 후 local state 갱신 vs API 재조회 여부 미확인.** 저장 후 화면이 outdated 상태로 남을 수 있다.
- **hash route와 내부 state 동시 변경 시 뒤로가기/새로고침 회귀 위험.** 기존 진입 경로가 무엇인지 먼저 확인해야 한다.
- **`next_action` 필드가 API payload, local state, 렌더링, 수정 폼, 이력 표시에서 동일하게 쓰이는지 확인 필요.** 단순 레이블 문제가 아니라 schema 문제일 수 있다.

---

## 6. Claude 반박에서 반영한 사용자 의도/UI/운영 흐름

- **이미 구현되어 있다면 Phase 목표를 "완성"에서 "검증/현장 확인"으로 낮춘다.** 각 Phase는 실제 코드 확인 결과에 따라 재조정된다.
- **"클래스룸 → 상담 연결"이 이미 경로가 있다면 Phase 3은 "연결 구현"이 아니라 "경로 확인 및 UX 검증"이다.**
- **상담 유형(학습/태도/성적/기타)이 코드에 이미 존재한다면 현장 용어와 일치하는지 검증이 필요하다.** 변경 시 기존 저장 데이터와의 호환성, API enum, 마이그레이션 영향까지 확인해야 한다.
- **`openTeacherStudentList` 목적지(담당 학생만/전체 학생)는 사용자 운영 의도 확인 전 확정 금지.**
- **원장 대시보드 최근 상담 placeholder는 우선순위 후보로만 기록한다.** 상담 저장/조회/권한/개인정보/학생명 노출 정책 확정 전 구현 대상으로 당기지 않는다.
- **원장이 선생님 대시보드를 볼 때 route 유지 방식인지 별도 뷰 전환인지 UX 정책이 미결이다.** 기술 함수 존재와 별개로 정책 확인이 먼저다.
- **출결 3-state 순환(등원→결석→수업없음)이 현장 운영과 맞는지 검증 항목에 포함.**

---

## 7. 파일별 작업 지시

### 7.1 반드시 실제로 열어 확인할 EIE 파일

각 파일을 열어 아래 항목을 확인하고 CODEX_RESULT1.md에 기록한다.

파일이 없거나 이름이 다르면 실제 대응 파일을 탐색해 기록한다. **파일명 변경이나 이동은 금지.**

| 파일 | 확인할 핵심 항목 |
|---|---|
| `eie/index.html` | script 로딩 순서, 전역 객체 생성 순서, 뷰 파일 script 태그 존재 여부 |
| `eie/js/eie-router.js` | hash listener 함수명, route param parse 방식, classroom/student/teacher route 처리 함수 |
| `eie/js/eie-state.js` | currentUser, selectedTeacher, selectedClass, selectedLesson, selectedStudent, attendance, consultations 상태 구조 |
| `eie/js/eie-api.js` | consultation CRUD 함수명, attendance save/load 함수명, 응답 shape, 실패 처리, 권한 파라미터 |
| `eie/js/utils/eie-classroom-scope.js` | `isDirector()` 또는 동등한 함수 존재 여부, teacher scope 필터 방식, read-only 상태 후보 |
| `eie/js/views/eie-dashboard.js` | 원장/선생님 대시보드 분기 조건, 최근 상담 placeholder 위치, 데이터 연동 여부 |
| `eie/js/views/eie-teacher.js` | 오늘 수업 카드 click handler, `openTeacherStudentList` 또는 동등 함수, classroom shortcut 목적지 |
| `eie/js/views/eie-classroom.js` | classroom render/open 함수명, 호출자, student row click handler, attendance toggle 함수, consultation 진입 연결 |
| `eie/js/views/eie-students.js` | student detail open 함수, consultation tab 전환 방식, create/update/delete consultation 연결, `next_action` 필드 처리 |
| `eie/js/views/eie-timetable-v2.js` | timetable cell 데이터 구조(classId, lessonId, teacherId, studentIds, 후보 학생 여부) |
| `eie/css/eie.css` | classroom, student-detail, consultation 관련 클래스명 존재 여부만 확인 |

### 7.2 개념 비교용으로만 읽을 AP MATH 파일

**읽기만 허용. 수정 금지. 복사/이식 금지. 개념 비교 근거로만 사용.**

| 파일 | 비교 관점 |
|---|---|
| `apmath/js/dashboard.js` | 원장/선생님 분기 처리 방식 |
| `apmath/js/dashboard-teacher.js` | 선생님 대시보드 카드 구조, shortcut 흐름 |
| `apmath/js/classroom.js` | 클래스룸 진입, 학생 목록, 출결 처리 |
| `apmath/js/student.js` | 학생상세, 상담 탭, 상담 저장 흐름 |
| `apmath/js/schedule.js` | timetable cell 구조 참고 |
| `apmath/js/memo.js` | 일지/메모 연결 흐름 참고 |
| `apmath/js/ui.js` | 공통 UI 패턴 참고 |

AP MATH CSS 파일은 실제 파일명을 먼저 탐색한 뒤 목록을 작성하고 읽는다. "AP MATH 관련 CSS 파일"이라는 표현으로 뭉뚱그리지 않는다.

---

## 8. 방어 조건

조사 중 아래 조건을 항상 지킨다.

1. **"함수 존재"와 "운영 흐름 완성"은 다른 판정이다.** API 함수 이름만 보고 구현됨으로 판정하지 않는다. form submit, null guard, refresh, 실패 처리, 권한 차단까지 연결된 경우만 "구현됨"이다.

2. **모든 확인 항목은 세 등급으로 표기한다.**
   - `확인됨 (함수 존재만)`: 함수명이 있지만 전체 흐름 미검증
   - `확인됨 (운영 흐름 완성)`: 진입→실행→저장→갱신 전체 경로 확인
   - `추정`: 파일을 열었지만 근거가 간접적
   - `확인 불가`: 파일 없음 또는 내용 불명

3. **학생 ID 없는 timetable 후보 학생은 상담 탭으로 보내지 않는다.** 이 조건이 현재 코드에서 지켜지고 있는지 확인한다.

4. **selectedStudent가 null인 상태에서 상담 탭/상세 패널 접근이 차단되어 있는지 확인한다.**

5. **첫 학생 자동 진입 위험이 현재 코드에 있는지 확인한다.**

6. **AP MATH 파일을 읽으면서 EIE 코드에 대한 판단을 내리지 않는다.** 비교 근거와 EIE 판정은 별도로 작성한다.

7. **확인하지 않은 파일을 확인한 것처럼 쓰지 않는다.** 파일을 실제로 열지 않았으면 "미확인"으로 표기한다.

8. **원장 관전/관람 관련 기술 함수가 존재해도 "원장 관전 준비 완료"로 판정하지 않는다.** route 진입, state 전파, 쓰기 API 차단, mutation 방지가 모두 확인된 경우만 준비 완료다.

9. **UI 문구를 조사 과정에서 임의로 확정하지 않는다.** 코드에 이미 있는 값이라도 "현재 코드값 확인됨, 현장 용어와 일치 여부 사용자 확인 필요"로 표기한다.

10. **route/hash 변경이 필요한 제안이 있다면 "후속 사용자 승인 필요"로만 표시하고 다음 CODEX_TASK 초안에 포함하지 않는다.**

---

## 9. 검증 명령

이번 작업은 코드 수정이 아니므로 `node --check`는 실행하지 않는다.

다음 구현 라운드(Phase 1 실행 후)에서 아래를 사용한다.

```
node --check eie/js/eie-router.js
node --check eie/js/eie-state.js
node --check eie/js/eie-api.js
node --check eie/js/utils/eie-classroom-scope.js
node --check eie/js/views/eie-dashboard.js
node --check eie/js/views/eie-teacher.js
node --check eie/js/views/eie-classroom.js
node --check eie/js/views/eie-students.js
node --check eie/js/views/eie-timetable-v2.js
```

브라우저 수동 검증 체크리스트 (구현 라운드용):
- 선생님 대시보드 → 오늘 수업 카드 → 클래스룸 진입
- timetable cell → 클래스룸 진입
- 클래스룸 학생 선택 → 학생상세 진입
- 학생 ID 없는 후보 학생 클릭 → 상담 탭 진입 차단 확인
- selectedStudent null 상태 → 상담 탭 접근 차단 확인
- 상담 저장 실패 시 UI/state 깨짐 없는지 확인
- 원장 계정에서 쓰기 버튼/API 호출 가능성 확인

---

## 10. CODEX_RESULT1.md 작성 형식

작업 완료 후 루트에 `CODEX_RESULT1.md`를 작성한다. 이것이 이번 작업의 유일한 파일 산출물이다.

아래 형식을 그대로 따른다.

---

# CODEX_RESULT1

## 1. 작업 요약

- 이번 작업은 구현이 아니라 조사 및 계획서 작성임을 명시한다.
- 코드 수정 여부: [없음]
- 생성한 파일: CODEX_RESULT1.md 1개만
- Claude Code 직접 검토 여부: [직접 검토 / 직접 검토 아님] 명시

## 2. 실제 확인한 파일

| 구분 | 파일 | 확인 여부 | 확인한 핵심 함수/상태/API/클래스 | 비고 |
|---|---|---|---|---|
| EIE | eie/index.html | | | |
| EIE | eie/js/eie-router.js | | | |
| ... | ... | | | |

확인 여부는 반드시 아래 중 하나:
- `확인됨 (운영 흐름 완성)` — 진입→실행→저장→갱신 전체 경로 확인
- `확인됨 (함수 존재만)` — 함수명 확인, 전체 흐름 미검증
- `추정` — 간접 근거
- `확인 불가` — 파일 없음 또는 내용 불명
- `미확인` — 파일을 열지 않음

## 3. Codex 1차 조사 결과

### 3.1 클래스룸 구현 상태

| 항목 | 현재 상태 | 근거 파일/함수 | 위험 | 후속 필요 여부 |
|---|---|---|---|---|
| 클래스룸 화면 진입 함수 | | | | |
| 선생님별 수업 범위 필터 | | | | |
| 오늘 수업 기준 진입 | | | | |
| timetable cell 기준 진입 | | | | |
| 학생 목록 표시 | | | | |
| 출결 입력/표시 | | | | |
| 숙제/진도/메모 표시 | | | | |
| 학생상세 연결 | | | | |
| 상담 연결 | | | | |
| 학급상세/수업상세 패널 | | | | |
| 원장 계정 접근 가능 여부 | | | | |
| 원장 쓰기 기능 차단 가능성 | | | | |
| 모바일/PC 레이아웃 상태 | | | | |
| 클릭/route/state 위험 | | | | |

현재 상태는 반드시 아래 중 하나:
구현됨 (운영 흐름 완성) / 구현됨 (함수 존재만) / 일부 구현 / 구조만 있음 / 없음 / 위험함 / 확인 불가

### 3.2 학생상담 구현 상태

| 항목 | 현재 상태 | 근거 파일/함수 | 위험 | 후속 필요 여부 |
|---|---|---|---|---|
| 학생상세 패널 존재 여부 | | | | |
| 상담 탭 존재 여부 | | | | |
| 상담 입력 폼 존재 여부 | | | | |
| 상담 이력 표시 여부 | | | | |
| 상담 저장 API 연결 여부 | | | | |
| 상담 수정/삭제 여부 | | | | |
| 상담 유형/상담일/상담내용/next_action 구조 | | | | |
| 선생님 대시보드 → 상담 흐름 | | | | |
| 클래스룸 → 상담 흐름 | | | | |
| 원장 대시보드 최근 상담 반영 | | | | |
| 학생 ID 없는 후보 학생 차단 | | | | |
| 첫 학생 자동 진입 위험 | | | | |
| selectedStudent null guard | | | | |
| 상담 저장 후 상태 갱신 방식 | | | | |

## 4. Claude Code / 검토자 반박 결과

**Claude Code 직접 검토 여부: [직접 검토 / 직접 검토 아님]**

- Codex 1차 조사에서 "함수 존재"를 "구현됨"으로 과대평가한 항목:
- Codex 1차 조사에서 누락한 파일/함수:
- 클래스룸 관련 위험 (route/state/null 포함):
- 학생상담 관련 위험 (상담 저장/권한/schema 포함):
- 권한/쓰기 기능 관련 위험 (UI 숨김 vs API 차단 분리):
- route/state/API 관련 위험:
- UI/문구/현장 운영 흐름 관련 위험:

## 5. 최종 판단

### 클래스룸

등급: [거의 완성 / 일부 보정 필요 / 구조만 있음 / 재설계 필요]

근거:

### 학생상담

등급: [거의 완성 / 일부 보정 필요 / 구조만 있음 / 재설계 필요]

근거:

## 6. AP MATH → EIE 개념 비교표

**이 표는 이식 가능성이 아니라 개념 참고 범위를 정리한다. 코드 복사 금지.**

| AP MATH 기능 | AP MATH 근거 파일/함수 | EIE 대응 파일/함수 | 개념만 참고 가능한가 | EIE에서 다른 점 | 위험도 |
|---|---|---|---|---|---|
| | | | | | |

## 7. 구현 단계 계획

**각 Phase는 실제 코드 확인 결과에 따라 "신규 구현"이 아니라 "안정화/검증"으로 목표를 조정한다.**

### Phase 1 — 클래스룸 안정화/검증

목표: 실제 코드에서 클래스룸 진입 경로가 안전한지 확인하고 위험 항목만 보정한다.

- 목표 (확인 결과에 따라 신규 구현 / 안정화 / 검증 중 선택)
- 수정 후보 파일 (실제 코드 확인 후 작성)
- 구현 내용
- 검증 방법
- 회귀 위험
- 사용자 확인 필요

### Phase 2 — 학생상담 안정화/검증

목표: 상담 입력/이력/저장 흐름 전체가 연결되어 있는지 확인하고 누락된 연결만 보정한다.

(Phase 1 이후 별도 지시서로 실행)

- 목표
- 수정 후보 파일
- 구현 내용
- 검증 방법
- 회귀 위험
- 사용자 확인 필요

### Phase 3 — 클래스룸 → 학생상담 연결 검증

목표: 클래스룸 → 학생상세 → 상담 경로가 이미 있는지 확인하고, 있다면 안전성만 검증한다. 없다면 이 Phase에서 연결한다.

(Phase 2 이후)

### Phase 4 — 선생님 대시보드 shortcut 정리

목표: `openTeacherStudentList` 목적지를 사용자 확인 후 확정하고 첫 학생 자동 진입 위험을 제거한다.

선행 조건: shortcut 목적지(담당 학생만/전체 학생) 사용자 확인 필요

### Phase 5 — 원장 관전/관람 구조 정책 확정 (구현 금지)

목표: `isDirector()` 존재를 확인하고, route 진입/state 전파/쓰기 차단/mutation 방지 방식을 정책 수준에서 결정한다. 실제 구현은 하지 않는다.

미결 정책: route 유지 방식 vs 선생님 뷰 전환 / 버튼 숨김 vs API 차단 / 관전 진입점 UX

### Phase 6 — 원장 대시보드 선생님 현황판 연결 (후속 후보)

목표: Phase 1~5 완료 후 원장 대시보드 최근 상담 placeholder를 실데이터로 연동하고 선생님 카드 클릭 흐름을 연결한다.

선행 조건: Phase 5 정책 확정, 상담 저장/조회 안정화, 학생명 노출 정책 사용자 확인

## 8. 우선순위

실제 조사 결과에 따라 아래 순서를 조정해도 된다.

1. 클래스룸 안정화 (Phase 1)
2. 학생상담 안정화 (Phase 2) — Phase 1과 독립적이면 병행 가능
3. 클래스룸 → 상담 연결 검증 (Phase 3)
4. 선생님 대시보드 shortcut 정리 (Phase 4)
5. 원장 관전 정책 확정 (Phase 5, 구현 없음)
6. 원장 대시보드 연결 (Phase 6)

## 9. 사용자 확인 필요 항목

아래 항목은 코드 확인으로 해결되지 않는 운영 정책 결정이다. 구현 전 반드시 사용자에게 확인한다.

| 항목 | 현재 코드 상태 | 필요한 확인 |
|---|---|---|
| 상담 유형 레이블 | 코드에 학습/태도/성적/기타 존재 추정 | 실제 학원에서 쓰는 분류와 일치하는가 |
| 출결 3-state 순환 | 등원→결석→수업없음 구현 추정 | 현장 운영에서 다른 상태가 필요한가 |
| 학생상담 shortcut 목적지 | openTeacherStudentList 존재 추정 | 담당 학생만 보여야 하는가, 전체 학생인가 |
| 원장 대시보드 최근 상담 | placeholder만 존재 추정 | 지금 당장 구현이 필요한가 |
| 원장이 선생님 대시보드 보는 방식 | isDirector() 존재 추정, 진입 UX 미결 | route 유지인가, 별도 선생님 뷰 전환인가 |
| next_action 필드 UI 레이블 | 코드에 next_action, 지시서에 조치사항 | 실제 화면 레이블이 현장 언어와 맞는가 |
| 원장 관전 시 버튼 처리 | isDirector() 있음, 차단 로직 미확인 | 버튼 숨김인가 비활성인가, API 차단도 필요한가 |
| 클래스룸에서 보여야 할 핵심 정보 | 현재 표시 항목 코드 확인 필요 | 숙제/진도/메모 표시 여부 |

## 10. 절대 건드리면 안 되는 범위

| 범위 | 이유 |
|---|---|
| route/hash | 기존 진입 경로 전체가 의존함 |
| 파일명/파일 위치 | 모든 import/참조가 깨짐 |
| eie-timetable-v2.js 핵심 로직 | 시간표 전체 의존 |
| API/DB 권한 구조 | Worker 범위 변경 필요, 이번 단계 금지 |
| AP MATH 원본 파일 | EIE 비교 기준 오염 |
| 기존 상담/출결 저장 로직 | 기존 저장 데이터와 호환성 |
| 상담 유형 enum 값 | 기존 DB 저장 데이터 호환성 |
| UI 문구 | 사용자 확인 전 확정 금지 |

## 11. 보류/사용자 확인 필요

| 항목 | 보류 이유 |
|---|---|
| 원장 관전 실제 구현 | UX 정책, route 방식, API 차단 방식 미결 |
| 원장 대시보드 최근 상담 연동 | 우선순위 사용자 확인 전 |
| 상담 유형 변경 | 현장 용어 확인 + 데이터 마이그레이션 영향 분석 전 |
| next_action 레이블 변경 | API/state schema 영향 확인 전 |
| shortcut 목적지 확정 | 사용자 운영 의도 확인 전 |
| 원장 뷰 route 방식 | 정책 결정 전 |

## 12. 다음 확장 후보

이번 조사에서 확인된 경우에만 작성한다. 불확실하면 생략한다.

**다음 실행용 CODEX_TASK 초안은 반드시 1개 Phase, 1개 진입 흐름만 대상으로 작성한다.**

Phase 1 클래스룸 안정화용 초안 예시 구조 (실제 조사 결과가 있을 때만 작성):

```
대상: eie/js/views/eie-classroom.js, eie/js/views/eie-teacher.js
진입 흐름 1개: 선생님 대시보드 오늘 수업 카드 → 클래스룸
수정 범위: [조사 결과 기반으로 작성]
금지: route/hash 변경, 파일명 변경, AP MATH 이식, git 명령
검증: node --check + 브라우저 수동
```

---

## 13. 마무리

CODEX_RESULT1.md 작성 후 멈춘다.

자동 zip 생성하지 않는다.

git add, git commit, git push 하지 않는다.

이 파일(CODEX_TASK_FINAL)을 다시 열어 처음부터 끝까지 읽고 그대로 실행하라.

---

**보정 요약:**

| 출처 | 보정 내용 |
|---|---|
| ChatGPT 원지시 | shell 스크립트 제거 / Phase 목표를 "구현"에서 "확인 결과에 따라 조정"으로 변경 / AP MATH "이식" → "개념 비교" / CSS 파일 뭉뚱그림 제거 |
| Codex 검토 | "확인됨/추정/확인 불가" 3분류 의무화 / import/export/script 순서 확인 항목 유지 / API 함수 존재 ≠ 구현됨 조건 추가 / 1 Phase 1 흐름 제한 |
| Claude 반박 | 이미 구현된 API(CRUD, isDirector 추정) 반영해 Phase 목표 재조정 / 상담 유형 "새로 정하기"에서 "현재 코드값 검증"으로 변경 / Phase 5 원장 관전: 기술 준비 완료 ≠ UX 정책 확정 구분 |
| Codex 재반박 | "API 함수 존재"를 구현 가능 판정으로 쓰지 않도록 방어 조건 8번 강화 / isDirector() 존재 ≠ 관전 준비 완료 명시 / Phase 2 신규 구현 아니라 연결/검증으로 표현 / 상담 유형 변경 시 마이그레이션 위험 추가 |
