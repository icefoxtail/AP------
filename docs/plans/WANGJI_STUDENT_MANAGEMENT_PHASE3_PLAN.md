# 3차 세부계획서 — AP/EIE 실데이터 연결 정밀화 (PHASE3_PLAN)

> 이 문서는 3차 CODEX_TASK 지시서의 원본이다.
> 상위 문서: `WANGJI_STUDENT_MANAGEMENT_PHASE_ROADMAP.md` / 선행: 2차 완료

## 0. 목표

```text
AP/EIE 기존 데이터를 정확히 읽어서 학생별로 통합 상세에 붙인다.
```

## 1. 작업 항목

### 1.1 AP 학생별 반/수업시간 정확 조회
- `GET /api/students/:id/detail-data` 실제 응답 구조를 먼저 확인(curl 또는 route 코드 정독)하고 adapter 매핑을 확정한다.
- 매핑 목표: `class_students` → `classes`(name/subject/teacher_name) → `class_time_slots`(day_of_week/start/end/room).
- detail-data가 부족하면 `GET /api/classes` + `class-students` read 조합으로 보완. **새 AP endpoint 생성 금지.**

### 1.2 EIE 학생별 수업시간 endpoint 확정
- 목표 조회: `eie_student_schedule_assignments(student_id)` → `eie_timetable_cells` + `eie_timetable_cell_teachers`.
- 기존 GET으로 불가능하면 EIE Worker에 **read-only GET 1개만 최소 추가**:
  `GET /api/eie/students/:id/schedules` — routes/eie.js handleGet에 분기 추가, SELECT만.
- POST/PATCH/DELETE 추가 금지. 기존 handler 수정 금지(분기 추가만).

### 1.3 EIE 전체 timetable 오표시 완전 차단
- adapter에서 `GET /api/eie/timetable` 전체 결과를 학생 schedules에 넣는 코드 제거(또는 제거 확인).
- 학생별 endpoint 연결 전: schedules는 빈 배열 + 안내 "EIE 학생별 수업시간 연결이 필요합니다."
- 검수 grep: `api/eie/timetable` 사용처가 학생 상세 경로에 없을 것.

### 1.4 AP/EIE 기존 상담 read-only 정밀 조회
- AP: `GET /api/consultations?student_id=` (routes/operations.js 분기 확인 후 정확 파라미터 사용)
- EIE: `GET /api/eie/consultations?student_id=`
- 표시: 날짜 내림차순, 최근 N건 + 더보기. 원본 수정 버튼 없음.

### 1.5 AP/EIE 상세 deeplink 확정
- AP: `apmath/js/student.js`의 상세 진입 함수(`openStudentDetail(sid,...)`) 조사 → `apmath/index.html` 로드 후 해당 학생을 여는 URL 파라미터/해시 방식 확정. 없으면 **읽기 전용 쿼리 파라미터 처리 1곳만 최소 추가**할지 사용자 결정 후 진행.
- EIE: `eie/index.html#students` + 학생 자동 선택 방식 조사. 자동 선택이 불가하면 `#students` 이동까지만 연결하고 한계를 보고.
- 확정된 deeplink로 "AP 상세 열기"/"EIE 상세 열기" 버튼 활성화 (새 탭).

### 1.6 연결 후보(candidate) 생성 로직
- 비교 기준: ① 이름 정확 일치 + 보호자번호 일치(강) ② 이름 + 학교 + 학년 일치(중)
- 보호자번호 없는 학생은 자동 후보 생성 금지(수동 연결만).
- 생성 시 `confidence_reason`에 근거 문자열 기록 (예: `name+parent_phone match`).
- 후보는 2차 API `POST /api/wangji/links`로 저장 (서버가 candidate 강제).

### 1.7 관리자 확인 후 active 전환 운영
- 연결 섹션에서 후보 검토 → 확정/거절 버튼 → `PATCH /links/:id/status` (confirmed_by 기록).

## 2. 수정 허용 파일

```text
apmath/js/wangji-student-management.js (+html/css)
workers/wangji-common-worker/* (후보 생성 보조 API 필요 시)
workers/wangji-eie-worker/routes/eie.js  -- 1.2의 read-only GET 분기 1개만
apmath/js/student.js                     -- 1.5 deeplink 수신부 최소 추가 (사용자 승인 시에만)
```

그 외 기존 파일 수정 금지. EIE 분기 추가 시 기존 코드 라인 변경 0(추가만)이어야 한다.

## 3. 금지

- 자동 병합 / 원본 DB 수정 / 기존 학생상세 교체
- AP/EIE API POST·PATCH·DELETE 호출
- EIE Worker에 read 외 endpoint 추가
- 전체 데이터를 학생별 데이터처럼 표시

## 4. 검증 / 완료 기준

```text
node --check (수정 JS 전부)
git diff workers/wangji-eie-worker/routes/eie.js  -- 추가 분기만 확인
표본 학생 5명: AP 반/시간, EIE 셀/시간이 기존 원본 화면과 일치
전체 timetable→학생 schedule 경로 grep 0
deeplink 버튼: 기존 상세 정상 오픈 + 기존 화면 회귀 없음
candidate 자동 active 경로 0
보호자번호 없는 학생 자동 후보 0
```

## 5. 산출물

adapter 정밀화 + deeplink + 후보 로직 + `CODEX_RESULT.md` (확정한 endpoint/매핑표, 미확정 항목 보고 포함)
