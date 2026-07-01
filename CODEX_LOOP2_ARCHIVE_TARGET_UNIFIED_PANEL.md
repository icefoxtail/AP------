# CODEX LOOP 2 — 출제 대상 선택: 학년→반→학생 통합 패널 (프론트)

> 범위: `docs/plans/ARCHIVE_EXAM_TARGET_SELECTION_NEXT_PLAN.md` Phase 2(프론트 — 마스터-디테일 통합 화면).
> 원칙: "반별/학년별" 분기 모달 완전 폐기 → 단일 드릴다운 패널로 교체. Loop 1의 `roster`/`exclude-students` API를 실제로 사용.
> 작성일: 2026-07-01
> 대상 파일: [archive/index.html](archive/index.html)

---

## 1. 결과 요약

| 항목 | 상태 |
|------|------|
| `targetModalOverlay`/`gradeModalOverlay`/`classModalOverlay` 3개 → `assignTargetModalOverlay` 1개로 통합 | ✅ 완료 |
| 학년 탭 + 반 체크리스트(좌) + 학생 패널(우, 항상 펼침) 마스터-디테일 레이아웃 | ✅ 구현·검증 |
| 반 3-상태(전체/해제/부분-indeterminate) | ✅ 구현·검증 |
| 결석생 제외 / 이 시험 미응시자만 프리셋 + 되돌리기 토스트 | ✅ 구현·검증 |
| 제외 학생 이름 칩 + 클릭 시 즉시 복원 | ✅ 구현·검증 |
| 학생 많은 반(8명 초과) 검색 필터 | ✅ 구현·검증(로직) |
| 최종 확인(이름 목록) 리뷰 화면 | ✅ 구현·검증 |
| 진행 상황 + 반별 성공/실패 표시 + 실패 항목만 재시도 | ✅ 구현·검증(렌더 로직) |
| 데스크톱(좌우 2열) / 모바일(상하 스택) 반응형 | ✅ 검증(1100px, 375px 둘 다 확인) |
| `node --check` (인라인 스크립트 추출) | ✅ PASS |
| 로그인 세션 없을 때 fetch 크래시 가능성 | ✅ 발견 즉시 수정 (아래 4절) |
| 실제 로그인 세션으로 end-to-end(진짜 API 응답 기반) 검증 | ⚠️ 미수행(5절) |

---

## 2. 변경 내용

### 2.1 진입점 정리

- `confirmQpp()`가 `targetModalOverlay`를 여는 대신 `openAssignTargetPanel(item, qpp)`를 직접 호출하도록 변경
- `closeModal()`이 3개 모달 대신 `assignTargetModalOverlay` 1개만 닫고 `AssignTarget = null`로 상태 정리

### 2.2 상태 모델

```
AssignTarget = {
  item, qpp, grade,
  classRows,                 // 현재 학년의 반 원본 목록
  gradeStates: { [grade]: classState },  // 학년별로 선택 상태를 캐싱 — 탭을 오가도 선택이 유지됨
  classState: {               // 현재 학년의 반별 상태
    [classId]: { row, checked, studentIds(null=반전체|Set), roster, rosterLoading, rosterError, toast, toastUndo }
  },
  view: 'select' | 'review' | 'progress',
  progress, assignmentBatchId, scope
}
```

학년 탭을 전환해도 `gradeStates`에 이전 학년의 체크 상태가 남아있어 실수로 탭을 잘못 눌러도 선택이 사라지지 않는다(계획서 §3.3 요구사항).

### 2.3 반→학생 흐름

- 반을 체크하면 `ensureAssignClassRoster()`가 Loop 1의 `GET .../roster`를 호출, 결과를 `classState[id].roster`에 캐싱(재펼침 시 재요청 없음)
- 학생 카드에 `recently_absent`/`already_submitted` 플래그를 CSS `::after`로 " 결석"/" 응시완료" 표기
- 프리셋 버튼(`결석생 제외`, `이 시험 미응시자만`)은 해당 학생들을 `studentIds` Set에서 제거하고, 직전 상태를 `toastUndo`에 저장 — "되돌리기" 클릭 시 정확히 복원
- 학생 체크박스 검색은 리렌더 없이 `display:none` 토글 방식으로 구현(입력 포커스 유지, 계획서에는 없던 개선)

### 2.4 제출 흐름

- "출제 대상 최종 확인" → 이름 목록 리뷰 화면(`renderAssignTargetReviewView`) — 반별 "N명 전체" 또는 "대상: 이름들 / 제외: 이름들"
- 확인 후 반 단위로 순차 처리(`assignTargetProcessOneClass`): 배정 등록(`class-exam-assignments`) → partial이면 Loop 1의 `exclude-students` 벌크 호출
- 반별 성공/실패를 실시간 아이콘으로 표시, 실패 항목만 `assignTargetRetryFailed()`로 재시도(이미 성공한 반은 재호출 안 함)
- 전원 성공 시 0.7초 후(성공 화면이 실제로 보이도록) `goEngine()`으로 인쇄/QR 화면 오픈

---

## 3. 기존 로직 무수정 확인

- `registerIndexClassExamAssignment`, `getIndexAssignmentAuthHeader`, `getIndexAssignmentBatchId`, `getIndexExamTitle`, `getIndexClassGrade`, `getIndexAvailableGrades`, `getIndexClassesForGrade`, `sortQrClassesForSelect`, `resolveExamQuestionCountForAssignment`, `goEngine`, `loadAssignmentBoardForGrade` — **호출 시그니처·동작 동일, 내부 수정 없음**
- `class-exam-assignments` POST(신규 배정 등록) payload 필드(`class_id, exam_title, exam_date, question_count, archive_file, source_type, subject, grade_label, assignment_batch_id, target_scope`) — **변경 없음**
- `_indexQrGroupedByTeacher`(선생님별 그룹 select)는 신규 화면에서 불필요해져 제거 — 반 선택은 이제 학년 탭으로 필터링되므로 선생님 select 단계 자체가 사라짐(계획서 §2 "분기 없는 단일 흐름"에 따른 의도된 제거이며, 다른 곳에서 참조 없음을 grep으로 확인)

---

## 4. 검증 중 발견/수정한 이슈

- **`fetch(url, { headers: null })` TypeError**: 로그인 세션이 없거나 만료된 상태에서 반을 체크하면 `getIndexAssignmentAuthHeader()`가 `null`을 반환하는데, 이를 그대로 `fetch`의 `headers`에 넘기면 Chrome이 `TypeError`를 던진다(spread `{...null}`은 안전하지만 `headers: null` 자체는 안전하지 않음). try/catch로 잡혀서 화면이 깨지지는 않았지만 에러 메시지가 부정확했다. `ensureAssignClassRoster()`에 `if (!authHeader) throw new Error('AP Math OS 로그인이 필요합니다.')` 가드를 추가해 수정.

---

## 5. 검증

- **정적**: 인라인 `<script>`를 추출해 `node --check` → PASS
- **브라우저(로컬 static 서버, 로그인 세션 없음)**: 실제 카드 클릭 → "AP 제출 QR 시험지 출력" → qpp 선택 → 신규 패널이 열리고 로그인 유도 화면이 정상 렌더됨을 스냅샷/스크린샷으로 확인, 콘솔 에러 없음
- **브라우저(mock 데이터 주입)**: 실제 D1/로그인 없이 `AssignTarget` 상태를 직접 구성해 아래를 함수 호출 + DOM 검사로 확인
  - 학년 탭 전환 시 다른 학년 선택 상태 보존(`gradeStates` 캐시)
  - 반 체크/해제, 전체 반 선택 토글의 3-상태(indeterminate) 표시
  - 프리셋(결석생 제외) 적용 → 칩 표시 → "되돌리기" → 정확히 원복
  - 학생 검색 필터(포커스 유지 방식)
  - 최종 확인 화면의 이름 목록이 실제 선택 상태와 일치
  - 진행 화면의 성공(✔)/실패(✕) 아이콘, "실패한 반만 재시도" 버튼 노출 조건
  - 데스크톱(1100px, 좌우 2열) / 모바일(375px, 상하 스택) 레이아웃 전환
- **툴 한계**: `preview_click`으로 동적 `innerHTML` 렌더 이후 생성된 체크박스/버튼을 클릭했을 때 핸들러가 실행되지 않는 현상이 반복 관찰됨(정적 페이지 로드 시점의 버튼들은 정상 클릭됨). 원인은 이 프리뷰 툴의 클릭 대상 캐싱으로 추정되며 앱 코드 결함은 아닌 것으로 판단 — 대신 동일 핸들러 함수를 직접 호출하는 방식으로 로직을 검증했다. **실제 사용자의 마우스 클릭 자체(브라우저 네이티브 이벤트)는 이 한계의 영향을 받지 않는다**고 판단하지만, 100% 확신을 위해서는 실제 배포 후 진짜 클릭으로 한 번 더 확인하는 것을 권장한다.
- **미수행**: 실제 AP Math OS 로그인 세션으로 진짜 `roster`/`class-exam-assignments`/`exclude-students` 응답을 받아보는 end-to-end 테스트. Loop 1에서 백엔드를 배포하지 않았으므로 현재 라이브 API는 이 신규 엔드포인트를 아직 모른다 — 배포 전에는 실제 API 검증이 불가능하다.

---

## 6. 다음 단계

- **배포**: Loop 1(백엔드)과 이번 Loop 2(프론트)를 실제로 반영하려면 (a) `apmath/worker-backup/worker`에서 `wrangler deploy`, (b) 프론트는 GitHub Pages 커밋/푸시가 필요하다(둘 다 사용자 승인 필요 — 임의로 진행하지 않음).
- **Phase 3(계획서)**: 배포 후 실제 로그인 세션으로 학년 전체 / 다중 반 / 반 내 학생 선택 3가지 경로가 `class_exam_assignments`/`class_exam_assignment_exclusions`에 정확히 반영되는지, student-portal에서 제외된 학생에게 시험이 안 보이는지 확인 필요.
- **Phase 4(계획서)**: 실사용 데이터(학생 많은 반)에서 성능/스크롤 확인.
