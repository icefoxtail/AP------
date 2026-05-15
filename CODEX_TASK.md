````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명

수업자료 오답 시스템 1차 MVP 구현

## 절대 기준

현재 프로젝트 루트 기준으로 작업한다.

반드시 먼저 아래 파일을 열어 현재 구조와 금지 원칙을 확인한 뒤 작업한다.

- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
- docs/PROJECT_RULEBOOK_AND_MAPS.md
- apmath/worker-backup/worker/schema.sql
- apmath/worker-backup/worker/index.js
- apmath/worker-backup/worker/routes/
- apmath/worker-backup/worker/helpers/
- apmath/student/index.html
- apmath/js/

절대 원칙:

- 기존 UI 문구·버튼명·화면명·메뉴명·운영 용어를 임의로 변경하지 않는다.
- 기존 기능을 개선 명목으로 바꾸지 않는다.
- 기존 버튼 배치, 기존 화면 흐름을 요청 없이 바꾸지 않는다.
- 원장님/관리자 대시보드에는 아무것도 추가하지 않는다.
- 원장님 대시보드 카드, 요약 카드, 운영 통계 카드, 관리 화면을 만들지 않는다.
- 학생이 시험지 또는 수업자료 원문을 직접 여는 기능을 만들지 않는다.
- 학생 포털에는 배정 확인과 오답 번호 입력 연결만 허용한다.
- 학생이 한 번 제출한 수업자료 오답 OMR은 다시 수정하지 못한다.
- 제출 완료 후 “수정하기”, “재입력”, “재제출” 기능을 만들지 않는다.
- 새 API 본문을 index.js에 직접 넣지 않는다.
- 새 API는 routes 파일로 분리한다.
- index.js에는 import와 route 위임 조건만 추가한다.
- 배포하지 않는다.
- wrangler deploy 하지 않는다.
- wrangler 명령을 실행하지 않는다.
- 원격 서버나 Cloudflare에 영향을 주는 명령을 실행하지 않는다.
- smoke test는 배포 후 사용자가 직접 수행한다.
- Codex는 로컬 문법검사와 정적 검증만 수행한다.
- git add . 하지 않는다.
- git add 하지 않는다.
- 커밋하지 않는다.
- push하지 않는다.
- 작업 파일만 수정하고 상태 보고만 남긴다.

---

## 목표

지금까지 설계한 “수업자료 오답 시스템”을 현재 AP Math OS 구조에 맞춰 1차 MVP로 구현한다.

이 기능은 원장님 운영 기능이 아니라 선생님 수업도구다.

핵심 흐름:

1. 선생님이 학원 공용 수업자료를 등록한다.
2. 선생님이 수업자료를 반에 배정한다.
3. 학생은 학생 포털에서 배정된 수업자료 오답 OMR을 연다.
4. 학생은 문제 원문을 보지 않고, 틀린 문제번호만 클릭한다.
5. 학생은 “오답 없음” 또는 선택한 오답 번호를 한 번 제출한다.
6. 제출 후 학생은 수정할 수 없다.
7. 선생님은 제출 현황, 학생별 오답, 반별 최다 오답, 단원별 오답을 확인한다.
8. 선생님은 학생별/반별 복습 지시표를 출력할 수 있다.

---

## 기능명 / 화면명 기준

새 기능의 사용자 표시명은 아래로 고정한다.

- 수업자료 오답
- 수업자료
- 오답 입력
- 제출 현황
- 학생별 오답표
- 반별 오답표
- 복습 지시표
- 오답 없음
- 제출 완료
- 미제출

기존 화면 문구는 건드리지 말고, 새 기능에서만 위 용어를 사용한다.

---

## 1. DB 작업

### 1.1 migration 추가

새 migration 파일을 생성한다.

경로:

- apmath/worker-backup/worker/migrations/20260516_study_material_wrongs.sql

아래 테이블을 추가한다.

```sql
CREATE TABLE IF NOT EXISTS study_materials (
  id TEXT PRIMARY KEY,
  material_type TEXT NOT NULL,
  title TEXT NOT NULL,
  grade TEXT,
  semester TEXT,
  subject TEXT DEFAULT '수학',
  numbering_type TEXT DEFAULT 'global',
  number_start INTEGER,
  number_end INTEGER,
  status TEXT DEFAULT 'active',
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_study_materials_type
  ON study_materials(material_type);

CREATE INDEX IF NOT EXISTS idx_study_materials_grade_semester
  ON study_materials(grade, semester);

CREATE INDEX IF NOT EXISTS idx_study_materials_status
  ON study_materials(status);

CREATE TABLE IF NOT EXISTS material_unit_ranges (
  id TEXT PRIMARY KEY,
  material_id TEXT NOT NULL,
  unit_order INTEGER DEFAULT 0,
  unit_text TEXT NOT NULL,
  subunit_text TEXT,
  start_no INTEGER NOT NULL,
  end_no INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(material_id, start_no, end_no)
);

CREATE INDEX IF NOT EXISTS idx_material_unit_ranges_material
  ON material_unit_ranges(material_id);

CREATE INDEX IF NOT EXISTS idx_material_unit_ranges_range
  ON material_unit_ranges(material_id, start_no, end_no);

CREATE INDEX IF NOT EXISTS idx_material_unit_ranges_unit
  ON material_unit_ranges(material_id, unit_text);

CREATE TABLE IF NOT EXISTS material_question_tags (
  id TEXT PRIMARY KEY,
  material_id TEXT NOT NULL,
  question_no INTEGER NOT NULL,
  unit_text TEXT,
  type_text TEXT,
  tags TEXT,
  difficulty TEXT,
  page_no TEXT,
  memo TEXT,
  needs_review INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(material_id, question_no)
);

CREATE INDEX IF NOT EXISTS idx_material_question_tags_material_question
  ON material_question_tags(material_id, question_no);

CREATE INDEX IF NOT EXISTS idx_material_question_tags_unit
  ON material_question_tags(material_id, unit_text);

CREATE INDEX IF NOT EXISTS idx_material_question_tags_type
  ON material_question_tags(material_id, type_text);

CREATE TABLE IF NOT EXISTS class_material_assignments (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  material_id TEXT NOT NULL,
  assignment_title TEXT,
  assigned_date TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_class_material_assignments_class
  ON class_material_assignments(class_id);

CREATE INDEX IF NOT EXISTS idx_class_material_assignments_material
  ON class_material_assignments(material_id);

CREATE INDEX IF NOT EXISTS idx_class_material_assignments_date
  ON class_material_assignments(assigned_date);

CREATE INDEX IF NOT EXISTS idx_class_material_assignments_status
  ON class_material_assignments(status);

CREATE TABLE IF NOT EXISTS student_material_submissions (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  is_submitted INTEGER DEFAULT 0,
  is_no_wrong INTEGER DEFAULT 0,
  submitted_at TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_student_material_submissions_assignment
  ON student_material_submissions(assignment_id);

CREATE INDEX IF NOT EXISTS idx_student_material_submissions_student
  ON student_material_submissions(student_id);

CREATE INDEX IF NOT EXISTS idx_student_material_submissions_submitted
  ON student_material_submissions(is_submitted);

CREATE TABLE IF NOT EXISTS student_material_wrong_answers (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  assignment_id TEXT NOT NULL,
  material_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  class_id TEXT,
  teacher_id TEXT,
  grade TEXT,
  wrong_date TEXT NOT NULL,
  question_no INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_submission
  ON student_material_wrong_answers(submission_id);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_assignment
  ON student_material_wrong_answers(assignment_id);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_material_question
  ON student_material_wrong_answers(material_id, question_no);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_student
  ON student_material_wrong_answers(student_id);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_class
  ON student_material_wrong_answers(class_id);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_teacher
  ON student_material_wrong_answers(teacher_id);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_grade
  ON student_material_wrong_answers(grade);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_date
  ON student_material_wrong_answers(wrong_date);
````

### 1.2 schema.sql 반영

위 테이블과 인덱스를 apmath/worker-backup/worker/schema.sql에도 동일하게 추가한다.

주의:

* 기존 테이블 정의를 수정하지 않는다.
* 기존 필드 의미를 변경하지 않는다.
* 기존 wrong_answers, exam_sessions 구조를 건드리지 않는다.
* 새 테이블만 추가한다.

---

## 2. Worker route 추가

### 2.1 새 route 파일 생성

파일 생성:

* apmath/worker-backup/worker/routes/study-material-wrongs.js

export 함수명:

```js
export async function handleStudyMaterialWrongs(request, env, teacher, path, url, body = {}) {
  ...
}
```

기존 route 스타일을 따른다.

route 내부에서 필요한 경우 Basic Auth를 직접 검증한다.

index.js에서 teacher가 null로 넘어올 수 있으므로, route 내부에서 requireTeacher 패턴을 사용한다.

---

## 3. API 설계

아래 API를 구현한다.

### 3.1 수업자료 마스터

#### GET /api/study-materials

query:

* status
* grade
* semester
* material_type
* q

동작:

* 기본은 status != 'deleted'
* q가 있으면 title LIKE 검색
* 전체 선생님이 조회 가능
* 원장 전용 제한을 두지 않는다

응답:

```json
{
  "success": true,
  "items": []
}
```

#### POST /api/study-materials

body:

```json
{
  "material_type": "problem_book",
  "title": "쎈 중3-1",
  "grade": "중3",
  "semester": "1학기",
  "subject": "수학",
  "numbering_type": "global",
  "number_start": 1,
  "number_end": 1350
}
```

검증:

* material_type 필수
* title 필수
* numbering_type 기본값 global
* number_start / number_end는 숫자일 때만 저장
* created_by는 로그인 선생님 id

응답:

```json
{
  "success": true,
  "item": {}
}
```

#### PATCH /api/study-materials/:id

수정 가능:

* material_type
* title
* grade
* semester
* subject
* numbering_type
* number_start
* number_end
* status

주의:

* 기존 자료가 여러 반에 사용 중이어도 삭제하지 말고 status 변경만 한다.
* 물리 삭제 금지.

#### PATCH /api/study-materials/:id/disable

동작:

* status = 'inactive'
* updated_at 갱신

---

### 3.2 단원별 번호구분

#### GET /api/material-unit-ranges?material_id=...

응답:

```json
{
  "success": true,
  "items": []
}
```

#### POST /api/material-unit-ranges/import

body:

```json
{
  "material_id": "sen_m3_1",
  "items": [
    {
      "unit_order": 1,
      "unit_text": "제곱근",
      "subunit_text": "제곱근의 뜻과 성질",
      "start_no": 1,
      "end_no": 80
    }
  ]
}
```

동작:

* material_id 필수
* items 배열 필수
* 같은 material_id + start_no + end_no는 upsert
* 기존 범위와 겹치는 경우에는 저장하지 말고 errors 배열에 담는다
* 전체 실패가 아니라 유효한 항목은 저장한다

응답:

```json
{
  "success": true,
  "inserted": 0,
  "updated": 0,
  "skipped": 0,
  "errors": []
}
```

#### PATCH /api/material-unit-ranges/:id

수정 가능:

* unit_order
* unit_text
* subunit_text
* start_no
* end_no

---

### 3.3 문항별 유형태그

#### GET /api/material-question-tags?material_id=...

응답:

```json
{
  "success": true,
  "items": []
}
```

#### POST /api/material-question-tags/import

body:

```json
{
  "material_id": "sen_m3_2",
  "items": [
    {
      "question_no": 224,
      "unit_text": "도형의 닮음",
      "type_text": "닮음 조건 찾기",
      "tags": "대응각,대응변,보조선",
      "difficulty": "중",
      "page_no": "58",
      "needs_review": 0
    }
  ]
}
```

동작:

* material_id 필수
* question_no 필수
* material_id + question_no 기준 upsert
* tags는 문자열로 저장한다
* needs_review는 0/1로 저장한다

---

### 3.4 수업자료 반 배정

#### POST /api/class-material-assignments

body:

```json
{
  "class_id": "m3_a",
  "material_id": "sen_m3_1",
  "assignment_title": "쎈 중3-1 오답 입력",
  "assigned_date": "2026-05-16"
}
```

동작:

* Basic Auth 필요
* class_id 접근 권한 확인
* class_id / material_id / assigned_date 필수
* class_material_assignments 생성
* 해당 반의 재원 학생을 class_students + students 기준으로 가져와 student_material_submissions를 자동 생성
* 이미 같은 assignment_id + student_id가 있으면 중복 생성하지 않음
* assignment_title이 비어 있으면 수업자료 title 기반으로 생성

응답:

```json
{
  "success": true,
  "assignment": {},
  "created_submissions": 0
}
```

#### GET /api/class-material-assignments

query:

* class_id
* material_id
* status

동작:

* class_id가 있으면 접근 권한 확인
* class_id가 없으면 전체 조회 가능
* 기본은 status != 'deleted'

#### PATCH /api/class-material-assignments/:id/disable

동작:

* status = 'inactive'
* 학생 제출 기록은 삭제하지 않는다

---

### 3.5 학생용 수업자료 OMR

#### GET /api/material-omr/assignment?assignment_id=...&student_id=...&token=...

동작:

* 학생 포털 token 검증
* token 검증 방식은 student-portal.js와 동일한 구조를 사용한다
* 학생이 해당 assignment의 submission 대상인지 확인
* 수업자료 원문 경로를 절대 반환하지 않는다
* number_start, number_end, numbering_type만 반환한다
* 이미 제출 완료인 경우 submitted=true로 반환한다
* 제출 완료일 때도 wrong_numbers는 보여도 되지만 수정 가능 플래그는 false로 반환한다

응답 예시:

```json
{
  "success": true,
  "assignment": {
    "id": "",
    "title": "",
    "assigned_date": "",
    "class_id": ""
  },
  "material": {
    "id": "",
    "title": "",
    "material_type": "",
    "grade": "",
    "semester": "",
    "numbering_type": "global",
    "number_start": 1,
    "number_end": 1350
  },
  "submission": {
    "id": "",
    "is_submitted": 0,
    "is_no_wrong": 0,
    "submitted_at": null,
    "wrong_numbers": [],
    "can_submit": true
  }
}
```

#### POST /api/material-omr/submit

body:

```json
{
  "assignment_id": "",
  "student_id": "",
  "token": "",
  "wrong_numbers": [123, 124, 130],
  "is_no_wrong": 0
}
```

동작:

* 학생 포털 token 검증
* assignment/submission 대상 확인
* 이미 is_submitted=1이면 409 반환
* 제출 후 수정 금지
* is_no_wrong=1이면 wrong_numbers는 빈 배열로 저장
* wrong_numbers는 중복 제거, 숫자 정렬
* number_start/end가 있는 자료는 범위 밖 번호 저장 금지
* student_material_submissions 업데이트

  * is_submitted=1
  * is_no_wrong
  * submitted_at 현재 시각
* student_material_wrong_answers에 번호별 insert
* class_id, teacher_id, grade, material_id, wrong_date를 함께 저장
* teacher_id는 class의 teacher_name과 teachers.name 매칭 또는 teacher_classes 매핑 기준으로 가능한 범위에서 저장한다
* teacher_id를 못 찾으면 null 허용
* 학생에게 원문 링크나 archive 경로 절대 반환하지 않는다

응답:

```json
{
  "success": true,
  "submitted": true,
  "wrong_count": 3
}
```

---

### 3.6 제출 현황

#### GET /api/material-omr/overview?assignment_id=...

동작:

* Basic Auth 필요
* assignment의 class_id 접근 권한 확인
* 학생별 제출 상태와 오답 번호를 반환

응답:

```json
{
  "success": true,
  "assignment": {},
  "material": {},
  "students": [
    {
      "student_id": "",
      "student_name": "",
      "status": "제출 완료",
      "is_submitted": 1,
      "is_no_wrong": 0,
      "submitted_at": "",
      "wrong_numbers": [123, 124, 130]
    }
  ]
}
```

상태명:

* 제출 완료
* 오답 없음
* 미제출

---

### 3.7 오답 조회 / 통계

#### GET /api/material-wrongs/student?student_id=...&material_id=...

동작:

* Basic Auth 필요
* 학생 접근 권한 확인
* 학생별 수업자료 오답 번호 목록 반환
* material_question_tags와 material_unit_ranges를 참고해 unit_text/type_text/tags를 가능한 범위에서 붙인다
* 정확한 문항 태그가 있으면 material_question_tags 우선
* 없으면 material_unit_ranges 범위 매핑 사용

#### GET /api/material-wrongs/class?class_id=...&material_id=...

동작:

* Basic Auth 필요
* class 접근 권한 확인
* 반별 최다 오답 번호 TOP 반환
* 학생별 오답 번호 목록 반환
* 단원별 오답 개수 반환

#### GET /api/material-wrongs/grade?grade=...&material_id=...

동작:

* Basic Auth 필요
* 전체 선생님 조회 가능
* 학년별 최다 오답 번호 TOP 반환
* 단원별 오답 개수 반환

주의:

* 원장님 대시보드용 요약 API로 연결하지 않는다.
* 이 API는 선생님 수업도구 화면에서만 사용한다.

---

### 3.8 복습 지시표

#### GET /api/material-review/student?student_id=...&material_id=...

학생별 복습 지시표 데이터를 반환한다.

#### GET /api/material-review/class?class_id=...&material_id=...

반별 복습 지시표 데이터를 반환한다.

응답에는 문제 원문이 없어야 한다.

포함 가능:

* 학생 이름
* 수업자료명
* 문제번호
* 단원명
* 유형명
* 태그
* 복습 안내 문구

포함 금지:

* 문제 원문
* PDF 경로
* archive 원본 경로
* 시험지 직접 열기 URL

---

## 4. index.js 연결

apmath/worker-backup/worker/index.js 수정:

1. import 추가

```js
import { handleStudyMaterialWrongs } from './routes/study-material-wrongs.js';
```

2. API 위임 조건 추가

resource가 아래 중 하나일 때 새 route로 위임한다.

* study-materials
* material-unit-ranges
* material-question-tags
* class-material-assignments
* material-omr
* material-wrongs
* material-review

주의:

* index.js에 API 본문 직접 작성 금지
* import와 위임 조건만 추가
* teacher is not defined 재발 금지
* route에 null teacher를 넘겨도 route 내부에서 검증 가능하게 구현

---

## 5. 학생 포털 연결

파일:

* apmath/student/index.html

목표:

학생 포털에서 배정된 수업자료 오답 OMR을 볼 수 있게 한다.

주의:

* 시험지 직접 열기 기능 추가 금지
* 수업자료 원문 열기 기능 추가 금지
* 제출 완료 후 수정 기능 추가 금지
* 기존 학생 포털 로그인/플래너/숙제 사진/OMR 흐름 보존
* 기존 문구 변경 금지

구현:

1. student-portal home 응답 또는 별도 API로 학생의 active 수업자료 오답 배정을 가져온다.
2. 학생 포털에 새 섹션을 추가한다.

표시명:

* 수업자료 오답

카드 정보:

* 수업자료명
* 반명
* 배정일
* 제출 상태

상태:

* 미제출
* 제출 완료
* 오답 없음

버튼:

* 미제출일 때만 “오답 입력”
* 제출 완료 또는 오답 없음이면 버튼 없이 “제출 완료” 상태만 표시

3. 오답 입력 화면

번호형 자료일 때:

* 1~100
* 101~200
* 201~300

처럼 100번 단위 구간 버튼 생성.

구간 클릭 시 해당 번호 버튼 표시.

번호 버튼 클릭 시 선택/해제.

하단 표시:

* 선택됨: 123, 124, 130

필수 버튼:

* 오답 없음
* 제출

보조 입력:

* 빠른 입력: 123,124,130
* 연속 입력: 123-128

빠른 입력은 있으면 구현하고, 시간이 부족하면 번호 클릭만 우선 구현한다.

제출 후:

* 화면을 제출 완료 상태로 바꾼다.
* 다시 입력 버튼을 만들지 않는다.

---

## 6. 선생님 프론트 연결

현재 프론트 구조를 먼저 확인하고 가장 안전한 위치에 독립 기능으로 추가한다.

원칙:

* 원장님 대시보드에 추가하지 않는다.
* 기존 대시보드 카드 수정 금지.
* 기존 classroom 화면 문구 변경 금지.
* 기존 출결/숙제/시험/OMR 버튼명 변경 금지.
* 새 기능은 “수업자료 오답” 독립 진입점으로 추가한다.

가능한 구현 방식:

1. apmath/js/study-material-wrong.js 새 파일 생성
2. apmath/index.html에 기존 JS 로딩 구조를 확인 후 안전하게 script 추가
3. 기존 메뉴 렌더링 구조를 확인해 선생님 화면에서만 “수업자료 오답” 진입 버튼 추가
4. 기존 원장님 대시보드 카드 영역에는 추가하지 않음

필수 화면:

### 6.1 수업자료 관리

기능:

* 수업자료 목록
* 수업자료 등록
* 수업자료 수정
* 비활성화

필드:

* 자료종류
* 자료명
* 학년
* 학기
* 번호체계
* 시작번호
* 끝번호

자료종류 표시값:

* 교과서
* 문제기본서
* 진도교재
* 시험대비교재
* 복습프린트
* 클리닉프린트
* 학교자료

내부값 예시:

* textbook
* problem_book
* progress_book
* test_prep
* review_print
* clinic_print
* school_material

### 6.2 단원별 번호구분

기능:

* 수업자료 선택
* 단원 범위 목록
* 단원 범위 추가/수정
* CSV 붙여넣기 import

CSV 컬럼:

```csv
unit_order,unit_text,subunit_text,start_no,end_no
```

예시:

```csv
1,제곱근,제곱근의 뜻과 성질,1,80
2,제곱근,근호를 포함한 식의 계산,81,160
3,다항식,인수분해,161,260
```

### 6.3 수업자료 반 배정

기능:

* 반 선택
* 수업자료 선택
* 배정일 선택
* 배정 생성
* 학생 제출 슬롯 자동 생성

### 6.4 제출 현황

기능:

* 배정 선택
* 학생별 상태 조회
* 학생별 오답 번호 조회

표시:

* 제출 완료
* 오답 없음
* 미제출

### 6.5 학생별 오답표

기능:

* 학생 선택
* 수업자료 선택
* 오답 번호 목록
* 단원별 묶음
* 인쇄용 보기

### 6.6 반별 오답표

기능:

* 반 선택
* 수업자료 선택
* 최다 오답 번호 TOP 10
* 학생별 오답 번호 목록
* 단원별 오답 개수
* 인쇄용 보기

### 6.7 복습 지시표 출력

기능:

* 학생별 복습 지시표 출력
* 반별 복습 지시표 출력

출력에는 문제 원문을 넣지 않는다.

예시:

```text
김시아 복습 지시표

쎈 중3-1

[제곱근]
- 123번
- 124번
- 130번

복습 방법
1. 위 번호만 다시 풀기
2. 풀이 과정을 표시하기
3. 다음 수업 때 선생님께 확인
```

---

## 7. 문항별 유형태그는 1차에서 기본 API만 구현

이번 1차에서는 문항별 유형태그 화면은 최소 구현 또는 API만 구현해도 된다.

우선순위:

1. 단원별 번호구분
2. 오답번호 클릭
3. 학생별/반별 오답표
4. 복습 지시표

문항별 세부 유형태그는 API와 CSV import 기반까지만 만들어도 된다.

유사문제 생성 기능은 절대 만들지 않는다.

---

## 8. 제외 항목

이번 작업에서 하지 말 것:

* 유사문제 생성
* 확인문제 JS 생성
* 기본서 PDF 업로드
* PDF 크롭
* PDF 위 체크 표시
* 문제 원문 저장
* 문제 이미지 저장
* 도형 문제 생성
* 원장님 대시보드 카드
* 관리자 운영 통계 화면
* 학생 제출 후 수정
* 학생이 자료 원문 열기
* 카카오 실제 발송 연동
* 문자 실제 발송 연동
* 배포
* wrangler deploy
* wrangler dev
* 원격 smoke test
* git add
* git commit
* git push

카카오 링크 공유는 이번 1차에서 실제 발송까지 만들지 않는다.

단, 복습 지시표 출력은 구현한다.

---

## 9. 권한 원칙

이 기능은 선생님 수업도구다.

조회는 강사 친화적으로 넓게 허용하되, 기존 프로젝트 권한 helper와 충돌하지 않게 구현한다.

기본 기준:

* 수업자료 마스터 조회: 모든 로그인 선생님 가능
* 수업자료 마스터 생성/수정/비활성화: 모든 로그인 선생님 가능
* 단원별 번호구분 등록/수정: 모든 로그인 선생님 가능
* 문항별 유형태그 등록/수정: 모든 로그인 선생님 가능
* 반 배정 생성: 해당 반 접근 가능한 선생님
* 제출 현황 조회: 해당 반 접근 가능한 선생님
* 학생별 오답 조회: 접근 가능한 학생
* 반별 오답 조회: 접근 가능한 반
* 학년별 오답 조회: 로그인 선생님 가능

원장님 전용 기능으로 잠그지 않는다.

---

## 10. 검증

배포하지 말고 로컬 정적/문법 검증만 한다.

필수 검증:

```powershell
node --check apmath\worker-backup\worker\index.js
node --check apmath\worker-backup\worker\routes\study-material-wrongs.js
```

새 JS 파일을 만들었다면:

```powershell
node --check apmath\js\study-material-wrong.js
```

학생 포털 HTML 안의 script가 깨지지 않았는지 확인한다.

가능하면 script 추출 후 node --check로 검증한다.

예시 방식은 현재 프로젝트의 기존 검증 방식에 맞춰 사용한다.

SQL 검증:

* migration SQL 문법 육안 확인
* schema.sql에 동일 테이블 반영 확인
* 기존 테이블 수정 없음 확인

금지:

* wrangler deploy 금지
* wrangler dev 금지
* 원격 API smoke test 금지
* Cloudflare/D1 원격 변경 금지

---

## 11. 문서 업데이트

새 route, 새 API, 새 DB 테이블, 새 프론트 진입점이 생기므로 기준 문서를 업데이트한다.

업데이트 대상:

* docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
* docs/PROJECT_RULEBOOK_AND_MAPS.md

반영 내용:

1. 새 route 추가

   * routes/study-material-wrongs.js
   * 담당: 수업자료 오답
   * API:

     * /api/study-materials
     * /api/material-unit-ranges
     * /api/material-question-tags
     * /api/class-material-assignments
     * /api/material-omr
     * /api/material-wrongs
     * /api/material-review

2. 새 DB 테이블 추가

   * study_materials
   * material_unit_ranges
   * material_question_tags
   * class_material_assignments
   * student_material_submissions
   * student_material_wrong_answers

3. 학생 포털 주의사항 추가

   * 수업자료 원문 열기 금지
   * 수업자료 오답 제출 후 수정 금지

4. 원장님 대시보드 주의사항 추가

   * 수업자료 오답은 원장님 대시보드에 노출하지 않음
   * 운영 요약 카드 추가하지 않음

---

## 12. 완료 보고

작업 완료 후 루트에 CODEX_RESULT.md를 생성 또는 갱신한다.

형식은 반드시 아래 구조를 사용한다.

```md
# CODEX_RESULT

## 1. 생성/수정 파일

## 2. 구현 완료 또는 확인 완료

## 3. 실행 결과

## 4. 결과 요약

## 5. 다음 조치
```

UI 관련 보고에는 반드시 아래 항목을 포함한다.

* 기존 문구 변경 여부
* 기존 버튼명 변경 여부
* 기존 화면명 변경 여부
* 기존 메뉴명 변경 여부
* 기존 운영 용어 변경 여부
* 원장님 대시보드 변경 여부
* 학생 제출 후 수정 기능 추가 여부
* 학생 자료 원문 열기 기능 추가 여부
* 배포 실행 여부
* wrangler 실행 여부
* git add/commit/push 실행 여부

특히 아래를 명확히 적는다.

```md
- 기존 문구 변경: 없음
- 기존 버튼명 변경: 없음
- 기존 화면명 변경: 없음
- 기존 메뉴명 변경: 없음
- 기존 운영 용어 변경: 없음
- 원장님 대시보드 변경: 없음
- 학생 제출 후 수정 기능 추가: 없음
- 학생 자료 원문 열기 기능 추가: 없음
- 배포 실행: 없음
- wrangler 실행: 없음
- git add/commit/push 실행: 없음
```

마지막 터미널 출력은 반드시 아래 문장으로 끝낸다.

```text
CODEX_RESULT.md에 완료 보고를 저장했습니다.
```

---

## 13. 작업 후 git 상태

작업 후 아래를 확인한다.

```powershell
git status --short
git diff --name-only
```

git add는 하지 않는다.

커밋하지 않는다.

push하지 않는다.

배포하지 않는다.

---

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

```
```
