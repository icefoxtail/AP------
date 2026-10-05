# 왕지교육 공통 학생관리 v1 — 데이터 맵 (DATA_MAP)

> 설계 보정 문서. 아래는 실제 저장소에서 읽은 구조 기준.
> 대원칙: **기존 AP/EIE DB는 원본. 새 공통 DB는 overlay/link/index. 재입력·일괄 복사 금지.**

## 0. 시스템 경계 (가장 중요)

| 시스템 | 프론트 | Worker | D1 데이터베이스 | API 접두 | 역할 |
|---|---|---|---|---|---|
| AP수학(APMS) | `apmath/` (정적, app.js/student.js 커스텀 라우팅) | `apmath/worker-backup/worker/` (index.js → routes/*.js) | `ap-math-os` (binding `DB`) | `/api/*` | **원본** |
| EIE영어 | `eie/` (SPA, `eie/js/eie-router.js` 해시 라우팅) | `workers/wangji-eie-worker/` (index.js → routes/eie.js) | `wangji-eie-os` (binding `DB`) | `/api/eie/*`만 | **원본** |
| 왕지 공통(신규) | 신규 독립 페이지 | 신규/확장 (미정) | 신규 `wangji-common-os`(권장) | 미정 | **overlay/link/index** |

→ **두 원본 D1은 물리 분리**. 크로스-DB JOIN 불가. 공통 모듈은 두 워커 HTTP API를 각각 호출(adapter=HTTP read).

---

## 1. 기존 AP 학생 데이터 위치 (원본 — 복사 금지)

파일: `apmath/worker-backup/worker/schema.sql`
```
students (D1: ap-math-os)
  id TEXT PK            -- AP 고유 ID 체계
  name, school_name, grade, target_score, status('재원'), memo
  guardian_name, guardian_relation, student_phone, parent_phone
  student_address, vehicle_info, student_identity_key, student_pin(UNIQUE)
  created_at, updated_at
```
API: `routes/students.js`(`handleStudents`) — students, detail-data, batch-pins, restore/hide/delete. 인증 teacher 세션.

## 2. 기존 EIE 학생 데이터 위치 (원본 — 복사 금지)

파일: `migrations/20260528_eie_round6_*.sql` (+ `20260601_eie_student_info_class_teachers.sql` ALTER)
```
eie_students (D1: wangji-eie-os)
  id TEXT PK            -- EIE 고유 ID 체계 (AP와 무관)
  display_name, normalized_name, grade, status('active'), source_type('candidate')
  source_import_session_id, source_cell_id, memo, raw_meta_json
  -- ALTER 추가: school_name, student_phone, parent_phone, guardian_relation,
  --             student_address, vehicle_info, student_pin, student_type('일반')
eie_student_contacts (phone, normalized_phone, is_primary, ...)
eie_student_teachers (student_id, teacher_name, sort_order)
```
API: `routes/eie.js` → `POST/PATCH/DELETE /api/eie/students`, `GET /api/eie/students/:id/contacts`. 인증 Bearer 토큰.

## 3. 기존 반 / 수업시간 데이터 위치 (원본 — 복사 금지)

### AP (ap-math-os)
```
classes (id, name, grade, subject, teacher_name, schedule_days, textbook, is_active, day_group, time_label)
class_students (class_id, student_id)         -- 학생-반 매핑
teacher_classes (teacher_id, class_id)
class_time_slots (class_id, day_of_week, start_time, end_time, room_name, memo)
timetable_versions ...
```
API: `routes/classes.js`, `routes/class-time-slots.js`, `routes/timetable-versions.js`.

### EIE (wangji-eie-os)
```
eie_timetable_cells (id, import_session_id, day_label, period_label, start_time, end_time,
                     class_name_raw, teacher_name_raw, room_raw, column_index, student_count)
eie_student_schedule_assignments (student_id, timetable_cell_id, status)
eie_timetable_cell_teachers (timetable_cell_id, teacher_name)
```
→ **AP는 class 중심, EIE는 timetable-cell 중심** — 구조가 다름(위험 #5).
API: `GET /api/eie/timetable`, `POST /api/eie/timetable-cells/:id/students`.

## 4. 기존 상담 데이터 위치 (원본 — 복사 금지)

- AP (ap-math-os): `consultations(id, student_id, date, type, content, next_action, created_at)` — `routes/operations.js`(resource `consultations`).
- EIE (wangji-eie-os): `consultations`(동일 이름, 다른 DB) — `routes/eie.js` `handleGet/PostConsultation` (`/api/eie/consultations`).
→ 이름 같지만 다른 DB라 현재 충돌 없음. 단일 DB 통합 시에만 충돌(위험).

## 5. 새 공통 overlay/link/index 테이블 후보

> **별도 D1(`wangji-common-os`, 권장)** 또는 별도 네임스페이스에 둔다. AP/EIE 어느 원본 DB에도 넣지 않아 스키마 침범 0.
> 이 테이블들은 **원본 복사본이 아니라 anchor/link/공통입력 저장소**다.

### 5.1 wangji_students — 공통 학생 anchor (전체 복사본 아님)
```
id
display_name
school_name_snapshot       -- 검색 편의용 최소 snapshot (원본 대체값 아님)
grade_snapshot
primary_phone_snapshot
status
memo
created_at, updated_at, is_deleted
```
주의: snapshot은 원본 우선. 표시 시 adapter의 원본값이 우선권을 가진다.

### 5.2 wangji_student_links — 핵심 연결 테이블
```
id
wangji_student_id
source_app: AP / EIE
source_student_id                 -- AP students.id 또는 eie_students.id (외부 참조)
source_display_name_snapshot
source_school_snapshot
source_grade_snapshot
source_phone_snapshot
link_status: candidate / active / rejected / archived
confidence_reason                 -- 후보 근거(동명이인/번호일치 등)
confirmed_by, confirmed_at
created_at, updated_at, is_deleted
UNIQUE(source_app, source_student_id)   -- 한 외부 학생 중복 링크 방지
```
원칙: 자동 확정 금지 / 후보는 candidate까지만 / active는 관리자 확인 / cross-DB FK 불가(외부 참조).

### 5.3 wangji_consultations — 공통 상담
```
id, wangji_student_id
source_scope: COMMON / AP / EIE
source_app, source_student_id
consultation_date, category, content, next_action, followup_status, visibility
created_by, created_at, updated_at, is_deleted
```
원칙: 1차는 신규 공통 상담만 저장 / 기존 AP·EIE 상담은 read-only / 일괄 복사 금지 / 장기적으로 상담 입력 주 진입점을 왕지로 이전(write-through).

## 6. Adapter 매핑표 (1차 read-only)

| 공통 화면 요소 | AP 소스 (ap-math-os HTTP, read) | EIE 소스 (wangji-eie-os HTTP, read) |
|---|---|---|
| 연결 학생 기본 | `GET /api/students` 상세 | `GET /api/eie/students/:id` |
| 수강 과목 | `classes.subject` | `eie_timetable_cells.class_name_raw` |
| 수강 반 | `classes.name` (via class_students) | timetable_cell (via schedule_assignments) |
| 담당 교사 | `classes.teacher_name`/teacher_classes | `eie_timetable_cell_teachers`/`eie_student_teachers` |
| 수업 시간 | `class_time_slots(day_of_week,start,end)` | `eie_timetable_cells(day_label,start_time,end_time)` |
| 기존 상세 이동 | AP 학생상세 deeplink + `students.id` | EIE 해시 라우트 `#students` + `eie_students.id` |
| 상담(기존, read) | `GET /api/.../consultations?student_id=` | `GET /api/eie/consultations?student_id=` |

각 adapter 반환에는 항상 `source_app`, `source_student_id`를 명시.

공통 반환 모델 후보:
```
source_app, source_student_id, display_name, school_name, grade, phone, status,
enrollments[], schedules[], consultations[], detail_url, section_errors[]
```

## 7. 후속 write-through 매핑 (장기, 1차 구현 금지)

장기적으로 왕지 화면에서 입력한 내용은 **저장 위치에 따라** 다르게 반영한다.
```
공통 링크 / 공통 메모 / 공통 상담      → wangji overlay DB 저장
AP 학생정보 / 수강 연결 / 반 배정 수정 → AP 공식 API 또는 AP write-through adapter로 ap-math-os 반영
EIE 학생정보 / 시간표 배정 수정        → EIE 공식 API 또는 EIE write-through adapter로 wangji-eie-os 반영
```
원칙: 원본 DB 직접 SQL UPDATE보다 **기존 공식 route/API 재사용 우선**. write-through 전 별도 검수·테스트 필수(위험 참조).

> 미확인: AP 학생상세 deeplink 파라미터 형식은 `apmath/js/student.js` 상세 진입부 추가 확인 필요(구현 전 확인 항목).
