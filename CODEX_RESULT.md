# CODEX_RESULT

작업명: AP Math OS 클래스룸 보강 체크칩 토글 기능 1차 구현  
작업일: 2026-05-29

---

## 1. 생성/수정 파일

| 파일 | 구분 | 내용 |
|------|------|------|
| apmath/js/classroom.js | 수정 | 보강 체크칩 함수 추가, 학생 행 보강 버튼 교체 |
| apmath/js/dashboard.js | 수정 | buildJournalContent 보강 사유 상세 표시 |
| apmath/css/classroom-foundation.css | 수정 | 보강 칩 패널 스타일 추가 |
| docs/APMATH_CLASSROOM_MAKEUP_CHIP_POLICY.md | 신규 | 보강 체크칩 정책 문서 |
| CODEX_RESULT.md | 수정 | 이번 작업 결과 기록 |

---

## 2. 구현 내용

### classroom.js 추가 함수

| 함수 | 역할 |
|------|------|
| `MAKEUP_TAG_DEFS` | 5개 보강 사유 정의 (key/label) |
| `getActiveMakeupTags(sid, date)` | 현재 선택된 makeup:* 태그 반환 |
| `hasAnyMakeupTag(sid, date)` | 하나라도 선택됐는지 확인 |
| `renderMakeupExpandButton(sid, date)` | [보강] expand 버튼 렌더링 |
| `toggleMakeupPanel(sid, date)` | 칩 패널 열기/닫기 토글 |
| `renderMakeupChipPanelInner(sid, date)` | 5개 칩 버튼 렌더링 |
| `clickMakeupChip(sid, date, key)` | 칩 클릭 → toggleAttendanceTag 위임 + 패널 갱신 |

### 학생 행 변경

`renderClassStudentRowV4B`에서:
- 기존: `renderAttendanceTagButton(s.id, rowDate, '보강')` (단순 on/off)
- 신규: `renderMakeupExpandButton(s.id, rowDate)` (칩 패널 expand)

### dashboard.js 변경

`buildJournalContent`에서:
- 기존: `makeups.push(s.name)` → `- 보강: 박○○, 이○○`
- 신규: `makeups.push({ name, makeupTags })` → `- 보강: 박○○(진도·결석), 이○○(숙제)`

---

## 3. 보강 체크칩 정책

| 내부 key | 표시명 |
|----------|--------|
| makeup:progress | 진도 |
| makeup:homework | 숙제 |
| makeup:absence | 결석 |
| makeup:exam | 시험 |
| makeup:other | 기타 |

- 각 칩 독립 토글 (첫 클릭 적용 / 재클릭 해제)
- 여러 칩 동시 선택 가능
- [보강] 버튼: 하나라도 선택 시 ○ 표시 + 강조 색상

---

## 4. 오늘 일지 반영 방식

선택된 `makeup:*` 태그가 있으면 사유를 괄호로 표시:

```
- 보강: 박○○(진도·결석), 이○○(숙제), 최○○
```

- 사유 없이 기존 `'보강'` 태그만 있는 경우 이름만 표시 (하위 호환)
- 해제된 칩은 일지에 반영 안 됨
- 보강 사유 없는 학생은 보강 일지에 표시 안 됨

---

## 5. 저장 방식

- 기존 `attendance.tags` TEXT 컬럼 재사용 (쉼표 구분)
- `makeup:progress,makeup:absence` 형태로 저장
- `toggleAttendanceTag` 기존 함수 위임 → 기존 `api.patch('attendance', ...)` 경로 그대로
- Worker 변경 없음 / DB schema 변경 없음
- 낙관적 업데이트 + 실패 시 자동 롤백 그대로 유지
- 중복 저장 방지: `window['makeup-lock-'+sid+'-'+d+'-'+key]` 잠금

---

## 6. 실행 결과

**node --check:**
- classroom.js: ✅ OK
- dashboard.js: ✅ OK

**git diff --name-only (이번 작업 파일):**
- apmath/css/classroom-foundation.css ✅
- apmath/js/classroom.js ✅
- apmath/js/dashboard.js ✅

**makeup 코드 검색:**
- classroom.js: MAKEUP_TAG_DEFS, renderMakeupExpandButton, toggleMakeupPanel, renderMakeupChipPanelInner, clickMakeupChip 확인 ✅
- dashboard.js: MAKEUP_LABEL_MAP, makeupTags, makeup:progress 확인 ✅

---

## 7. 기존 흐름 보존 확인

- apmath/index.html: 미수정 ✅
- apmath-home/index.html: 미수정 ✅
- archive/: 미수정 ✅
- apmath/student/index.html: 미수정 ✅
- 로그인/세션/dashboard 권한 분기: 미수정 ✅
- `toggleAttendanceTag` (기존 지각 태그 포함): 미수정 ✅
- `openAttendanceMetaModal` (기존 출결 메모 모달): 미수정 ✅

---

## 8. 수동 확인 항목

로컬 서버 실행 후 아래 항목을 수동 확인해야 한다.

1. 클래스룸에서 학생 행의 [보강] 버튼 클릭
2. [진도] [숙제] [결석] [시험] [기타] 칩 5개 표시 확인
3. [진도] 클릭 → 칩 강조 표시 + [보강] 버튼 ○ 표시
4. [진도] 재클릭 → 칩 해제 + [보강] 버튼 원상복귀
5. 여러 칩 동시 선택 확인
6. 선택된 칩이 오늘 일지(buildJournalContent)에 `박○○(진도·결석)` 형태로 반영 확인
7. 해제된 칩은 일지에서 제거 확인
8. 기존 출석/숙제/지각/상담 기능이 깨지지 않음 확인
9. 새로고침 후 저장 상태 유지 확인 (API에서 tags 불러옴)
10. 저장 실패 시 toast('저장 실패', 'warn') 표시 + 롤백 확인

---

## 9. 한계 및 다음 작업

**이번 라운드 한계:**
- 오늘 수업 요일이 아닌 학생(임시 보강 참여자)은 현재 클래스룸 화면에 노출된 학생만 적용 가능. 전체 학생 검색 기반 보강 참여자 추가는 별도 작업 필요.
- 패널 열림 상태는 페이지 새로고침 시 초기화됨 (의도된 동작).
- `'보강'` 단순 태그와 `makeup:*` 태그는 공존 가능 — 단순 태그를 체크칩으로 마이그레이션하는 작업은 별도 결정 필요.

**다음 작업 제안:**
1. 전체 학생 검색 + 임시 보강 참여자 추가 기능
2. 보강 통계 (학생별 보강 사유 집계) 화면 추가
3. `'보강'` 단순 태그 → `makeup:other`로 마이그레이션 (선택)

---

## 10. 자체 검수 및 검수팩

**자체 검수 결과:**
- node --check 통과 ✅
- 금지 파일 미수정 ✅
- MAKEUP_TAG_DEFS 5개 정의 확인 ✅
- renderMakeupExpandButton 학생 행 적용 확인 ✅
- buildJournalContent 보강 사유 분기 확인 ✅
- CSS 스타일 추가 확인 ✅
- 중복 저장 방지 잠금 로직 확인 ✅
- 방어 조건 10개 확인 ✅

**검수팩 zip 경로:**
`C:\Users\USER\AppData\Local\Temp\AP_PATCH_WORK\makeup_chip_20260529\review_pack_makeup_chip.zip`

---

## 11. 금지 작업 준수 확인

- git add: ❌ 하지 않음
- git commit: ❌ 하지 않음
- git push: ❌ 하지 않음
- apmath/index.html 덮어쓰기: ❌ 하지 않음
- 기존 운영 앱 로직 수정: ❌ 하지 않음
- archive/ 수정: ❌ 하지 않음
- student/ 수정: ❌ 하지 않음
- 로그인/세션 흐름 수정: ❌ 하지 않음
- Worker 수정: ❌ 하지 않음
- DB migration: ❌ 하지 않음
- 프로젝트 전체 압축: ❌ 하지 않음
