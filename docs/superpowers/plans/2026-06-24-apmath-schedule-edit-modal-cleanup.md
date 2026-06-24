# apmath 일정 수정 모달 — 중복 버튼 제거 & 배치 정리 지시서

> **For agentic workers (Codex):** 이 문서는 단독 실행 가능한 세부 지시서다. 아래 작업을 순서대로 구현하라. 체크박스(`- [ ]`)로 진행을 추적한다. 데이터 계층(저장 포맷·API)은 바꾸지 않는다. UI/문구/배치만 손댄다.

**Goal:** 일정관리 "일정 수정" 모달에 `취소` 버튼이 **두 개**(상단 헤더 + 본문 하단) 보이고, 저장 버튼 문구(`수정 저장`)와 버튼 배치가 정돈되지 않았다. **중복 `취소`를 보이지 않게** 하고, **문구를 통일**하며, **저장/삭제를 최적 배치**한다. 기간시험 작업 모달도 같은 규칙으로 정리한다.

**대상 파일:**
- `apmath/js/schedule.js` (핵심 — 모달 렌더 + 복귀 흐름)
- 데이터/CSS 변경 없음 (필요 시 인라인 style만 조정)

---

## 배경: 현재 구조 (변경 전)

모달 헤더는 **모든 모달 공용**으로 좌측 상단에 `취소`(`closeModal()`) 버튼을 항상 띄운다.
- `apmath/index.html:979` — `<button id="modal-cancel-btn" onclick="closeModal()">취소</button>`

"일정 수정" 모달 본문은 별도로 버튼 3개를 더 그린다.
- `apmath/js/schedule.js:1041` — `수정 저장` (전폭, primary)
- `apmath/js/schedule.js:1043` — `취소` → **`openExamScheduleModal()`** (전체 닫기가 아니라 **달력 모달로 복귀**)
- `apmath/js/schedule.js:1044` — `삭제` → `deleteUnifiedSchedule(...)`

즉 두 `취소`는 **보기엔 중복이지만 동작이 다르다.**
- 헤더 `취소` = `closeModal()` → (스택 비어 있으면) **전체 닫기** → 대시보드로 빠짐
- 본문 `취소` = `openExamScheduleModal()` → **달력으로 복귀**

그래서 본문 `취소`만 단순 삭제하면 "달력 복귀" 동작이 사라지는 퇴행이 생긴다.

### 활용할 기존 메커니즘 (이미 코드에 있음)
- `apmath/js/ui.js:419` `showModalStep(t,b)` — 현재 모달 스냅샷을 `modalStepStack`에 push한 뒤 새 내용으로 교체.
- `apmath/js/ui.js:507` `closeModal()` — `modalStepStack`이 차 있으면 **pop해서 이전 모달을 복원**, 비어 있으면 완전 닫기.
- `apmath/js/ui.js:432` `clearModalSteps()` — 스택 비우기.

→ 수정 모달을 `showModalStep`으로 열면 **헤더 `취소` 한 개만으로 "달력 복귀"가 자동 처리**되어 본문 `취소`가 진짜 중복이 된다.

### 복귀 단일 지점
저장/삭제 성공 시 모두 `openExamScheduleModal()`로 달력을 **새로 그린다.**
- `schedule.js:1199` (`handleEditUnifiedSchedule` 성공)
- `schedule.js:1231` (`handleEditGroupedExamSchedule` 성공)
- `schedule.js:1281` (`deleteUnifiedSchedule` 성공)
- `schedule.js:1254` 부근 (`deleteGroupedExamSchedule` 성공)

이 함수가 `showModal`(스택 미정리)이므로, 스텝 방식 도입 시 **스택 잔존**이 발생할 수 있다 → `openExamScheduleModal()` 진입부에서 한 번 정리한다.

---

## 작업 항목

### 1. 중복 `취소` 숨김 — 헤더를 "달력 복귀"로 통합 (옵션 A)
- [ ] `schedule.js:1021` `openEditUnifiedScheduleModal` 의 `showModal('일정 수정', …)` → **`showModalStep('일정 수정', …)`** 로 변경.
  - 그러면 헤더 `취소`(`closeModal`)가 스택을 pop → **달력으로 복귀**.
- [ ] `schedule.js:1043` 본문 `취소` 버튼 **제거**(보이지 않게). 본문에는 `저장` / `삭제`만 남긴다.
- [ ] `schedule.js:800` `openExamScheduleModal()` **진입부 첫 줄**에 `if (typeof clearModalSteps === 'function') clearModalSteps();` 추가.
  - 저장·삭제 후 달력을 새로 그릴 때 leftover 스냅샷이 새지 않게 하는 안전망(모든 복귀 경로를 한 곳에서 커버). 달력 자체의 헤더 `취소`는 정상적으로 "완전 닫기"로 동작.

### 2. 문구 통일
- [ ] `schedule.js:1041` 버튼 라벨 `수정 저장` → **`저장`**.
- [ ] `schedule.js:1108` 기간시험 전체 모달의 `전체 기간 저장`은 의미가 분명하므로 **유지**(원하면 `저장`으로 통일 가능, 기본은 유지).

### 3. 저장/삭제 최적 배치
- [ ] `schedule.js:1041-1045` 버튼 영역을 **한 줄 `[저장][삭제]`** 로 재구성.
  - `저장` = primary(파랑, `btn-primary ap-primary-btn`), `삭제` = error 톤(빨강, 기존 style 유지).
  - 기존 `.exam-schedule-row` 클래스를 그대로 써서 두 버튼이 가로로 균등 분할(모바일 ≤600px에서는 기존 미디어쿼리로 세로 전환).
- [ ] 결과 마크업(예시):
  ```html
  <div class="exam-schedule-row">
      <button class="btn btn-primary ap-primary-btn" style="..." onclick="handleEditUnifiedSchedule(...)">저장</button>
      <button class="btn ap-mid-btn" style="color:var(--error); background:rgba(255,71,87,0.1); border:none;" onclick="deleteUnifiedSchedule(...)">삭제</button>
  </div>
  ```

### 4. 기간시험 모달 동일 정리
- [ ] `schedule.js:1070` `openGroupedExamScheduleActionModal` → `showModalStep`로 열고, 본문 `취소`(`schedule.js:1082`) 제거. 헤더 `취소`로 달력 복귀.
  - 작업선택 버튼 묶음(`이 날짜만 수정` / `전체 기간 수정` / `이 날짜만 삭제` / `전체 기간 삭제`)은 그대로 유지하되, **수정 계열(중립 톤) → 삭제 계열(error 톤)** 순서로 시각적 그룹이 분명하도록 정렬 점검.
- [ ] `schedule.js:1094` `openEditGroupedExamScheduleModal` → `showModalStep`로 열고, 본문 `취소`(`schedule.js:1109`) 제거. `전체 기간 저장`은 전폭 유지.

> 참고: 작업선택 모달이 `showModalStep`이면, 거기서 다시 여는 단일/전체 수정 모달도 `showModalStep`이라 헤더 `취소`가 **한 단계씩 뒤로(작업선택 → 달력)** 자연스럽게 되돌아간다. 의도된 동작.

---

## 검증 (수동)

- [ ] 달력에서 단일 일정 클릭 → 수정 모달:
  - 헤더 `취소` = **달력 복귀** (대시보드로 빠지지 않음)
  - `저장` = 토스트 후 달력 갱신, `삭제` = 토스트 후 달력 갱신
  - 본문에 `취소` 버튼이 **보이지 않음**, `[저장][삭제]` 한 줄 배치
- [ ] 달력 자체에서 헤더 `취소` = **완전 닫기**(스택 잔존 없음). 저장/삭제 직후에도 동일.
- [ ] 기간시험(2일 이상) 클릭 → 작업선택 모달 → 헤더 `취소` = 달력 복귀, 본문 `취소` 없음.
- [ ] 작업선택 → 전체 기간 수정 → 헤더 `취소` = 작업선택으로 복귀(또는 달력), 저장 정상.
- [ ] 모바일 폭(≤600px)에서 `[저장][삭제]`가 세로로 떨어지는지(기존 미디어쿼리) 확인.

## 비범위 (이번에 건드리지 않음)
- 헤더 `취소` 라벨/스타일(공용) 변경 — 전 화면 영향이라 제외.
- API·저장 포맷·`renderUnifiedScheduleForm` 폼 필드/플레이스홀더.
- 달력 일정 목록 카드(`renderUnifiedScheduleList`)의 디자인 — 별도 작업으로 분리.
