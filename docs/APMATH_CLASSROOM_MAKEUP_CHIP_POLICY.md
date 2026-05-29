# APMATH_CLASSROOM_MAKEUP_CHIP_POLICY

작성일: 2026-05-29

---

## 1. 목적

보강 기록을 자유 메모가 아닌 빠른 체크칩으로 처리한다.

선생님이 클래스룸 학생 행에서 [보강] 버튼을 누르면 5개의 보강 사유 칩이 펼쳐지며, 각 칩을 독립적으로 토글할 수 있다.

---

## 2. 보강 사유 (고정 5개)

| 내부 key | 표시명 |
|----------|--------|
| makeup:progress | 진도 |
| makeup:homework | 숙제 |
| makeup:absence | 결석 |
| makeup:exam | 시험 |
| makeup:other | 기타 |

---

## 3. 토글 정책

- 첫 클릭: 칩 적용 (on 상태)
- 두 번째 클릭: 칩 해제 (off 상태)
- 다시 클릭: 재적용
- 여러 칩 동시 선택 가능 (독립 토글)
- 잘못 눌렀을 때 같은 칩 재클릭으로 즉시 해제

---

## 4. UI 흐름

```
학생 행:
이름 | 출결 | 숙제 | 지각 | [보강] | 상담

[보강] 클릭 후 패널 펼침:
이름 | 출결 | 숙제 | 지각 | [보강●] | 상담
───────────────────────────────────────
[진도] [숙제] [결석] [시험] [기타]
```

- [보강] 버튼: 아무 칩도 선택 안 됨 → 빈 상태
- [보강●] 버튼: 1개 이상 칩 선택 → ○ 표시, 강조 색상
- [보강] 재클릭 → 패널 닫힘
- 패널 내 칩 선택/해제 → 즉시 저장 + [보강] 버튼 상태 갱신

---

## 5. 저장 방식

기존 `attendance.tags` 필드에 `makeup:*` 키를 comma-separated 형태로 저장한다.

```
예: tags = "makeup:progress,makeup:absence"
```

- 기존 `toggleAttendanceTag` 함수를 재사용
- 기존 `api.patch('attendance', { studentId, date, tags })` 경로 그대로 사용
- Worker 변경 없음
- DB schema 변경 없음 (기존 tags TEXT 컬럼 활용)
- 낙관적 업데이트 + 실패 시 자동 롤백 (기존 구조 그대로)

---

## 6. 일지 반영

`buildJournalContent` 함수에서 `makeup:*` 태그를 감지하여 보강 섹션에 사유를 포함시킨다.

**기존 형식 (보강 사유 없음):**
```
- 보강: 박○○, 이○○
```

**신규 형식 (보강 사유 있음):**
```
- 보강: 박○○(진도·결석), 이○○(숙제), 최○○
```

- 선택된 사유가 있으면 `(진도·결석)` 형태로 괄호 표시
- 사유 없이 기존 `'보강'` 태그만 있는 경우 이름만 표시 (하위 호환)
- 해제된 칩은 일지에 반영되지 않음

---

## 7. 방어 조건

1. `makeup_tags`가 null/undefined → 빈 배열 처리 (normalizeAttendanceTags 기존 로직)
2. 알 수 없는 key → MAKEUP_LABEL_MAP에 없으면 key 그대로 표시
3. 중복 저장 방지 → `window['makeup-lock-'+sid+'-'+d+'-'+key]` 잠금
4. 모든 칩 해제 → [보강] 버튼 off 상태로 전환, 일지에서 제거
5. 학생 이름 없음 → 기존 fallback 그대로
6. row DOM 없음 → 패널 열기 시도 무시
7. class/session id 없음 → `toggleAttendanceTag` 내부에서 처리
8. API 실패 → 롤백 + toast('저장 실패', 'warn') (기존 구조 그대로)
9. 기존 출석 상태와 보강 태그 독립 저장 → 덮어쓰기 없음
10. 선생님 화면에서만 노출 → 기존 권한 분기 미변경

---

## 8. 구현 파일

| 파일 | 역할 |
|------|------|
| apmath/js/classroom.js | MAKEUP_TAG_DEFS, renderMakeupExpandButton, toggleMakeupPanel, renderMakeupChipPanelInner, clickMakeupChip |
| apmath/js/dashboard.js | buildJournalContent 보강 사유 분기 |
| apmath/css/classroom-foundation.css | .makeup-chip-panel, .makeup-chip-list, .makeup-chip, .makeup-chip.on |

---

## 9. 한계 및 다음 보완

- 오늘 수업 요일이 아닌 학생(임시 보강 참여자)은 현재 클래스룸 화면에서 접근 가능한 학생에 한해서만 체크칩 적용 가능. 전체 학생 검색 기반 보강 참여자 추가는 별도 작업 필요.
- 보강 태그는 현재 세션 내 저장되며, 페이지 새로고침 후에는 API에서 불러온 데이터 기준으로 표시됨 (저장 지속성 있음).
- `makeup:*` 태그와 기존 `보강` 태그는 공존 가능하며, 기존 `보강` 태그 단독 사용도 하위 호환됨.
