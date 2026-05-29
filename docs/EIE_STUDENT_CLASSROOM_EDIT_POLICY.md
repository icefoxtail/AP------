# EIE_STUDENT_CLASSROOM_EDIT_POLICY

작성일: 2026-05-30

---

## 1. 목적

EIE 학생관리와 클래스룸 학생상세를 보기 전용이 아니라 수정 가능한 운영 화면으로 만든다.
AP MATH와 나중에 합칠 수 있게 필드·UX·운영 흐름을 AP MATH 기준으로 맞춘다.

---

## 2. AP MATH와 맞출 입력 필드

| 필드 | EIE 컬럼 | AP MATH 대응 |
|------|---------|-------------|
| 이름 | eie_students.display_name | students.name |
| 학년 | eie_students.grade | students.grade |
| 연락처 | eie_student_contacts.phone | parent_contacts.phone |
| 상태 | eie_students.status (active/inactive/archived) | students.status |
| 메모 | eie_students.memo | students.memo |
| 수업 배정 | eie_student_schedule_assignments | class_students |

---

## 3. 학생관리 정책

### 등록
- 학생관리 화면 상단 "+ 학생 등록" 버튼
- 오른쪽 패널에 등록 폼 표시
- 필수: 이름 / 선택: 학년, 연락처, 상태, 메모
- API: POST /api/eie/students

### 상세 열람
- 학생 목록에서 이름 클릭 → 오른쪽 상세 패널
- 이름, 학년, 연락처, 수업 배정, 메모 표시
- 전화번호는 상세 패널에서만 표시 (목록에 미노출)

### 수정
- 상세 패널 우상단 "수정" 버튼 → 수정 모드 전환
- 필드 인라인 수정 → 저장
- API: PATCH /api/eie/students/:id

### 비활성/보관
- 수정 폼 내 상태 셀렉트박스
- active / inactive / archived / needs_review
- "삭제" 버튼 전면 배치 금지 → 상태 변경으로 처리

---

## 4. 클래스룸 학생상세 정책

- 수업 카드 클릭 → 수업 상세 패널 (배정 학생 목록)
- 학생 이름 클릭 → 학생 상세 패널 (수정 가능)
- 상세 패널 "수정" 버튼 → 인라인 수정 모드
- 수정 가능 필드: 이름, 학년, 연락처, 상태, 메모
- API: PATCH /api/eie/students/:id

---

## 5. 학생 배정 정책

### 배정 추가
- 수업 상세 패널 → "학생 추가" 버튼
- 이미 배정된 학생 제외한 전체 학생 목록 표시
- 클릭으로 즉시 배정
- API: POST /api/eie/timetable-cells/:id/students

### 배정 해제
- 학생 상세 패널 → "배정 해제" 버튼 (빨간 테두리)
- 실제 삭제 아닌 soft delete (status: archived)
- 배정 해제 ≠ 학생 삭제
- API: DELETE /api/eie/timetable-cells/:cellId/students/:studentId (→ soft delete)

---

## 6. 반/수업 생성 정책

기존 시간표 셀 편집 패널 활용:
- 반명(class_name_raw)
- 담당 선생님(teacher_name_raw)
- 요일(day_label)
- 교시(period_label)
- 시작/종료 시간(start_time, end_time)
- 교실(room_raw)
- 상태(status)
- 메모(memo)

API: POST /api/eie/timetable-cells (기존), PATCH /api/eie/timetable-cells/:id (기존)

---

## 7. 삭제 정책

- 학생 완전 삭제: 이번 라운드 미구현 (위험)
- 대신 status: archived (보관) 처리
- 배정 해제: soft delete (eie_student_schedule_assignments.status = 'archived')
- 시간표 셀 삭제: 이번 라운드 미구현 (status: archived 처리 권장)

---

## 8. API 목록

| 메서드 | 경로 | 역할 | 신규 여부 |
|--------|------|------|----------|
| GET | /api/eie/confirmed-students | 학생 목록 | 기존 |
| POST | /api/eie/students | 학생 직접 등록 | **신규** |
| PATCH | /api/eie/students/:id | 학생 정보 수정 | **신규** |
| PATCH | /api/eie/students/:id/status | 상태 변경 | **신규** |
| POST | /api/eie/timetable-cells/:id/students | 학생 배정 | **신규** |
| DELETE | /api/eie/timetable-cells/:id/students/:sid | 배정 해제 | **신규** |

---

## 9. AP MATH와 통합 전제

현재는 EIE 독립 Worker/D1을 유지한다.
필드명과 UX를 AP MATH와 맞춰 두어 나중에 통합 레이어로 묶기 쉽게 한다.

---

## 10. 다음 작업 (로드맵)

1. 로그인 UX 정리 (토큰 저장/불러오기 UI)
2. 출석 기록 (EIE 클래스룸 출석 체크)
3. 숙제 관리
4. 교재/수업일지
5. 학부모 연락처 관리 고도화
6. 리포트 생성
7. AP MATH + EIE 통합 학생 레이어 (장기)

---

## 11. Remote D1 Migration SQL

아래 SQL은 이번 작업에서 새로 추가된 테이블/컬럼이 없음을 확인했다.
`eie_students`, `eie_student_contacts`, `eie_student_schedule_assignments` 테이블은
Round 6 migration(`20260528_eie_round2_import_core.sql` 등)에서 이미 정의되어 있다.

신규 API들은 기존 테이블 구조를 그대로 활용하므로 추가 migration이 필요 없다.

단, Round 6 migration이 아직 remote D1에 적용되지 않았다면:
```sql
-- 확인 명령 (wrangler d1 execute 사용)
-- wrangler d1 execute wangji-eie-os --config wrangler.toml --command "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'eie_%';" --remote

-- 테이블이 없을 경우 Round 6 migration을 먼저 적용해야 한다.
```
