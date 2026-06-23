# EIE 학생 패널 — 완전삭제 추가 + 상태 단축버튼 제거 작업 지시서

형님 지시: **EIE 시간표 학생 편집 패널에 원장/관리자 전용 "완전삭제(완전퇴원)" 버튼을 추가하고, 시간표 패널과 students 화면 양쪽의 중복 상태 단축버튼(`휴원 입력`/`퇴원 입력`/`재원 복구`)을 제거한다.**

실행: Codex / 검수: Claude

---

## 1. 목적

- 원장/관리자용 "학생 완전삭제"는 현재 **students 화면에만** 있고, 시간표 학생 편집 패널에는 없다. 시간표 패널에서도 퇴원생을 완전삭제할 수 있게 한다.
- `휴원 입력`/`퇴원 입력`/`재원 복구` 단축버튼은 상태 드롭다운 value만 바꾸는 **순수 중복 UI**(별도 저장 없음)이며, 상태 변경은 드롭다운+저장, 원클릭 퇴원은 danger-zone `퇴원` 버튼이 이미 담당하므로 제거한다.

---

## 2. 절대 금지

```text
- git add / git commit / git push / deploy 금지. (작업 트리 변경까지만)
- 백엔드/DB/마이그레이션 변경 금지 — 완전삭제 백엔드는 이미 완비됨(아래 5. 참고).
- 완전삭제의 권한 정책 완화 금지: 반드시 owner(원장/관리자) 세션 + 퇴원/보관 상태 학생일 때만 노출.
- EIE 외 다른 도메인(attendance/classroom/grade 등) 로직 변경 금지.
- 카드/패널 레이아웃의 그 외 요소(전반/퇴원/저장/연락처/담당교사 등) 변경 금지.
- 검수요청서 작성 금지.
```

---

## 3. 반드시 읽을 문서

- `docs/codex/CODEX_TASK_WRITING_RULE.md` (이 지시서 형식 근거)
- 본 파일(`CODEX_TASK.md`)

---

## 4. 반드시 확인할 파일 (현재 상태 기준 — 확인된 사실)

### 참고용 기존 구현 (그대로 미러링, 수정 대상 아님)
- `eie/js/views/eie-students.js:69` — `isOwnerSession()` (role admin/owner 또는 loginId admin)
- `eie/js/views/eie-students.js:75` — `canHardDeleteStudent(student)` (owner && status ∈ inactive/withdrawn/archived)
- `eie/js/views/eie-students.js:2065` — 완전삭제 버튼 렌더
- `eie/js/views/eie-students.js:2614` — `hardDeleteStudent` 핸들러 (`EieApi.deleteStudent` 호출)
- `eie/js/eie-api.js:290` — `deleteStudent(studentId)` → `DELETE students/:id`

### 수정 대상
- `eie/js/views/eie-timetable.js`
  - `:3088-3092` — 제거 대상 단축버튼 `<div class="eie-p-form-row">…휴원 입력/퇴원 입력/재원 복구…</div>`
  - `:3103-3107` — danger-zone 액션 영역(현재 `전반`/`퇴원` 버튼). 여기에 완전삭제 추가.
  - `:3081` 등 — 상태 헬퍼 `studentStatus(student)` 이미 존재(재사용).
  - `:4163` 부근 — `data-eie-v2-retire-student` 클릭 위임 처리 블록(바로 아래에 완전삭제 위임 추가).
  - `:5556` — `retireMiniStudent` (완전삭제 핸들러 미러링 기준).
  - ⚠️ 이 파일에는 owner 판정 헬퍼가 **없음** → 신규 추가 필요.
- `eie/js/views/eie-students.js`
  - `:2056-2060` — 제거 대상 단축버튼 블록
  - `:2562` — `setEditStatus` (단축버튼 제거 후 미사용 시 정리)

### 서버 게이트(변경 불필요, 동작 확인용)
- `workers/wangji-eie-worker/routes/eie.js:3541` — `DELETE /students/:id` 라우트, `requireEieOwner(teacher)` 게이트
- `workers/wangji-eie-worker/routes/eie.js:3173` — `handleDeleteStudent` cascade 삭제(성적/상담/출석/담당/연락처/시간표 배정/학생)
- `workers/wangji-eie-worker/index.js:118` — `verifyTeacher`가 owner→admin 정규화

---

## 5. 허용 수정 범위 (모두 `eie/` 프론트 한정)

### 작업 1 — 시간표 패널에 "완전삭제" 버튼 추가 (`eie/js/views/eie-timetable.js`)

**1-1. owner 판정 헬퍼 추가** (`eie-students.js:69`와 동일 규칙):
```js
function isEieOwnerSession() {
    var role = String((window.localStorage && window.localStorage.getItem('WANGJI_EIE_ROLE')) || '').toLowerCase();
    var loginId = String((window.localStorage && window.localStorage.getItem('WANGJI_EIE_LOGIN_ID')) || '').toLowerCase();
    return role === 'admin' || role === 'owner' || loginId === 'admin';
}
```

**1-2. danger-zone에 버튼 추가** (`:3103-3107`, `전반`/`퇴원` 옆). owner 세션 && status ∈ inactive/withdrawn/archived 일 때만:
```js
${(isEieOwnerSession() && ['inactive','withdrawn','archived'].includes(studentStatus(student)))
    ? `<button type="button" class="eie-p-btn-danger" data-eie-v2-hard-delete-student="${esc(sid)}">완전삭제</button>`
    : ''}
```

**1-3. 클릭 위임 추가** (`:4163` 부근 retire 처리 블록 바로 아래):
```js
const hardDeleteButton = event.target.closest?.('[data-eie-v2-hard-delete-student]');
if (hardDeleteButton) {
    event.preventDefault();
    event.stopPropagation();
    hardDeleteMiniStudent(hardDeleteButton.getAttribute('data-eie-v2-hard-delete-student') || '');
    return;
}
```

**1-4. 핸들러 추가** (`retireMiniStudent` `:5556` 미러링 + owner 재확인 + `EieApi.deleteStudent`):
```js
async function hardDeleteMiniStudent(studentId) {
    if (viewState.miniSaving || !isEieOwnerSession()) return;
    const sid = normalizeKey(studentId);
    if (!sid || !window.EieApi?.deleteStudent) return;
    if (!window.confirm('이 퇴원생을 완전히 삭제할까요?\n시간표 배정, 출석, 성적, 상담 기록도 함께 삭제되며 복구할 수 없습니다.')) return;
    viewState.miniSaving = true;
    viewState.miniError = '';
    viewState.miniNotice = '';
    try {
        await window.EieApi.deleteStudent(sid);
        if (window.EieApmsState?.loadFoundation) await window.EieApmsState.loadFoundation({ force: true }).catch(() => null);
        await refreshTimetableRowsAfterMiniSave();
        closeTimetableDetailPanel();
    } catch (error) {
        viewState.miniError = error?.message || '학생 완전삭제에 실패했습니다.';
    } finally {
        viewState.miniSaving = false;
        reopenPanelMountRoute();
        clearMiniNoticeLater(2000);
    }
}
```

### 작업 2 — 중복 상태 단축버튼 제거 (양쪽 화면)

**2-1. 시간표 패널**: `eie/js/views/eie-timetable.js:3088-3092` 의 `<div class="eie-p-form-row">…휴원 입력/퇴원 입력/재원 복구…</div>` 블록 삭제.

**2-2. students 화면**: `eie/js/views/eie-students.js:2056-2060` 의 `isEdit ? '<div class="eie-action-row is-wide">…휴원 입력/퇴원 입력/재원 복구…</div>' : ''` 블록 삭제.
- 삭제 후 `eie/js/views/eie-students.js:2562` 의 `setEditStatus`가 더 이상 호출되지 않으면(전체 `eie/` grep으로 참조 확인) 함께 제거. 다른 사용처가 있으면 유지.

> 상태 변경 경로는 드롭다운 + 패널 `저장`으로 유지되고, 원클릭 퇴원은 danger-zone `퇴원`(`data-eie-v2-retire-student`)이 담당하므로 기능 손실 없음.

---

## 6. 제외 범위

```text
- 완전삭제를 재원/휴원/확인필요 상태나 교사 세션에 노출하지 말 것.
- danger-zone의 전반/퇴원 동작 변경 금지(완전삭제만 신규 추가).
- 단축버튼 "기능화"(원클릭 저장 등)는 이번 범위 아님 — 제거만 한다.
- CSS는 기존 `eie-p-btn-danger` 클래스 재사용. 신규 스타일 추가 불필요(필요 최소만).
```

---

## 7. 검증 명령

```text
- 한글 인코딩(mojibake) 가드: tools/test-student-js-mojibake-guard.mjs 실행해 통과 확인.
- 관련 기존 테스트 실행:
    tests/eie-owner-hard-delete-student.test.js
    tests/eie-student-worker-crud-parity.test.js
- (프로젝트 표준 테스트 러너로 위 테스트가 녹색인지 확인. 회귀 없을 것.)
```

수동 확인:
```text
[ ] 원장/관리자 세션 + 퇴원/보관 학생 → 시간표 패널 danger-zone에 "완전삭제" 노출
[ ] 재원/휴원/확인필요 또는 교사 세션 → "완전삭제" 미노출
[ ] 완전삭제 → 확인창 → 확정 시 DELETE /api/eie/students/:id 호출, 패널 닫힘 + 시간표/명단 갱신(학생 사라짐)
[ ] 시간표 패널 / students 화면 모두 휴원·퇴원·재원복구 단축버튼 사라짐
[ ] 상태 변경(드롭다운+저장), 원클릭 퇴원(danger-zone) 정상 동작
[ ] 교사 세션 기존 동작(전반/퇴원/저장) 회귀 없음
```

---

## 8. `CODEX_RESULT.md` 작성 기준

작업 완료 후 `CODEX_RESULT.md`에 다음을 기록:

```text
- 변경 파일 목록 + 각 파일에서 한 일 요약
- 작업 1(완전삭제 추가): 추가한 헬퍼/렌더/위임/핸들러 위치(라인)
- 작업 2(단축버튼 제거): 시간표/students 제거 위치, setEditStatus 처리(제거/유지) 및 판단 근거(grep 결과)
- 검증 명령 실행 결과(통과/실패, 실패 시 원문)
- 미해결/판단 보류 항목(있으면)
```
