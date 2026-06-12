# CODEX_RESULT1

## 수정 파일
- `apmath/js/dashboard-teacher.js`

## 수정 내용

### 1. metricRow 제거
- `오늘 수업 n개 반`, `담당 학생 중등/고등 n명`, `수업 체크 결석/숙제 n개` 카드를 렌더링하는 `metricRow` 변수 및 관련 연산 코드 전체 삭제
- 삭제된 변수: `visibleClassIds`, `classStudentByStudentId`, `classById`, `activeStudents`, `visibleStudents`, `studentScopeCounts`, `todayClassCount`, `absentCount`, `homeworkMissCount`, `totalScopedStudents`, `metricRow`

### 2. shortcutPanel 버튼 순서 변경
- 기존: 시간표 → 출석부 → 아카이브
- 변경: 출석부 → 시간표 → 아카이브

### 3. shortcutPanel 위치 이동 및 중복 제거
- `shortcutPanel`을 `ap-dash-shell` 최상단(`ap-dash-grid` 위)으로 이동
- `ap-dash-side` 내부의 `shortcutPanel` 렌더링 제거 (중복 완전 삭제)

### 4. 상단 문구/제목 없음 확인
- `ap-dash-card` 클래스 제거 (section에 카드 박스 스타일 적용되지 않음)
- 별도 heading/제목 요소 없음, `aria-label`은 접근성 전용으로 유지
- 금지 문구(빠른 이동, 바로 처리 등) 없음

### 5. 상단 여백 제거
- `ap-dash-quick-panel`의 기본 `margin-top:16px`가 최상단에서 불필요하므로 `style="margin-top:0;"` 인라인 재정의 적용

### 6. 그리드 레이아웃
- `ap-dash-quick-grid`의 기존 CSS(`repeat(3,minmax(0,1fr))`)가 PC/모바일 모두 3열 유지 — 변경 없음
- `@media (max-width:420px)` 미디어 쿼리도 3열 유지로 이미 정의되어 있음

### 7. 기능 연결 유지
- 출석부: `openAttendanceLedger()` — 유지
- 시간표: `renderTimetable()` — 유지
- 아카이브: `openDashboardArchiveWindow(event)` — 유지

## 검수 결과

### node --check 결과
```
node --check apmath/js/dashboard-teacher.js
→ PASS (오류 없음)
```

### PC 확인 결과
- 미확인 (브라우저 환경 없음)

### 모바일 확인 결과
- 미확인 (브라우저 환경 없음)

## 미확인 항목
- 실제 브라우저에서 선생님 대시보드 로그인 후 상단 3버튼 렌더링 확인 불가 (원격 환경 브라우저 없음)
- PC에서 하단/사이드 중복 버튼 미노출 여부 시각 확인 불가
- 모바일 1줄 3개 가로 배치 시각 확인 불가
- 출석부/시간표/아카이브 클릭 동작 실제 실행 확인 불가
