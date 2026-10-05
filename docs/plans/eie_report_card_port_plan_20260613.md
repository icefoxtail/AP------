# EIE 성적표 포팅 계획서

## 0. 목적

AP MATH의 성적표 구조를 확인한 뒤, EIE에도 동일한 운영 흐름의 성적표 화면을 만든다.

다만 EIE는 영어 수업이므로 수학 성적표를 그대로 복사하지 않고, 공통 성적표 뼈대 위에 영어 전용 시험 항목을 추가한다.

성적표는 단순 조회 화면이 아니라, 선생님이 수업 현장에서 바로 입력·수정·확인할 수 있는 작업 화면이어야 한다.

---

## 1. AP MATH 성적표에서 가져올 구조

AP MATH 성적표의 핵심은 다음 흐름이다.

1. 학생 선택
2. 시험 이력 조회
3. 시험별 점수/날짜/반/시험명 확인
4. 누적 변화 확인
5. 학부모에게 보여줄 수 있는 요약 문구 또는 리포트 연결

EIE에서도 이 흐름은 그대로 가져간다.

### 포팅 대상 공통 구조

- 학생 상세 안의 `성적표` 탭 또는 카드
- 반/학생 기준 시험 이력 목록
- 시험명, 날짜, 점수, 만점, 환산점수
- 최근 시험 추세
- 월별 요약
- 교사용 입력/수정 흐름
- 원장/관리자 조회 흐름

---

## 2. EIE에서 추가해야 하는 영어 전용 구조

EIE는 수학 단일 시험 점수만으로 부족하다. 영어 학원 운영상 아래 항목을 성적표 모델에 추가해야 한다.

### A. 월말평가

월말평가는 EIE 성적표의 핵심 평가 단위로 별도 유형으로 둔다.

필드 예시:

- `test_type`: `monthly`
- `test_name`: 예) 6월 월말평가
- `month_key`: 예) `2026-06`
- `level_name`: EIE 레벨/교재 단계
- `score`
- `max_score`
- `percentile` 또는 `rate` 선택 가능
- `teacher_comment`

### B. 단원/교재 테스트

정규 수업 중 교재 단원 테스트를 기록한다.

- `test_type`: `unit`
- `book_name`
- `unit_name`
- `lesson_no`
- `score`
- `max_score`

### C. 어휘 테스트

영어에서는 단어 시험이 별도 축이다.

- `test_type`: `vocab`
- `word_range`
- `score`
- `max_score`
- `wrong_count`
- `retry_required`

### D. 문법 테스트

- `test_type`: `grammar`
- `grammar_topic`
- `score`
- `max_score`
- `weak_points`

### E. 리딩/리스닝 테스트

필요하면 월말평가 내부 하위 영역으로도 넣을 수 있고, 별도 테스트로도 기록할 수 있다.

- `reading_score`
- `listening_score`
- `speaking_score`
- `writing_score`

초기 MVP에서는 월말평가에 영역별 점수 필드를 두고, 개별 상시 테스트는 `test_type`으로 분리한다.

---

## 3. 권장 DB 구조

기존 AP MATH 시험 이력 구조를 침범하지 말고, EIE 전용 테이블을 만든다.

### `eie_exam_results`

```sql
CREATE TABLE IF NOT EXISTS eie_exam_results (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  class_id TEXT,
  teacher_id TEXT,
  test_type TEXT NOT NULL,
  test_name TEXT NOT NULL,
  test_date TEXT NOT NULL,
  month_key TEXT,
  level_name TEXT,
  book_name TEXT,
  unit_name TEXT,
  lesson_no TEXT,
  score REAL,
  max_score REAL,
  reading_score REAL,
  listening_score REAL,
  speaking_score REAL,
  writing_score REAL,
  vocab_score REAL,
  grammar_score REAL,
  word_range TEXT,
  wrong_count INTEGER,
  retry_required INTEGER DEFAULT 0,
  weak_points TEXT,
  teacher_comment TEXT,
  private_note TEXT,
  payload_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

`payload_json`은 시험 유형별로 필드가 달라지는 것을 받아주는 자유 입력 확장 칸이다. 예를 들어 월말평가 세부 영역, 교재별 특수 점수, 선생님이 추가한 임시 평가 항목을 보존한다.

### 인덱스

```sql
CREATE INDEX IF NOT EXISTS idx_eie_exam_results_student_date
ON eie_exam_results(student_id, test_date DESC);

CREATE INDEX IF NOT EXISTS idx_eie_exam_results_class_month
ON eie_exam_results(class_id, month_key);

CREATE INDEX IF NOT EXISTS idx_eie_exam_results_type
ON eie_exam_results(test_type);

CREATE INDEX IF NOT EXISTS idx_eie_exam_results_teacher_date
ON eie_exam_results(teacher_id, test_date DESC);
```

### 자유 입력 저장 보조 테이블

성적표 상단 카드별로 입력 형태가 달라질 수 있으므로, 초기에는 고정 필드와 자유 JSON을 병행한다. 후속으로 선생님별 입력 템플릿을 저장하려면 아래 테이블을 추가한다.

```sql
CREATE TABLE IF NOT EXISTS eie_report_templates (
  id TEXT PRIMARY KEY,
  teacher_id TEXT,
  template_name TEXT NOT NULL,
  test_type TEXT NOT NULL,
  fields_json TEXT NOT NULL,
  is_default INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. 화면 구조

### 학생 상세 > 성적표

학생 상세 화면에 `성적표` 섹션을 추가한다.

구성:

1. 상단 요약 카드
   - 최근 월말평가
   - 최근 단어 테스트
   - 최근 문법/단원 테스트
   - 이번 달 평균

2. 월별 성적표
   - 월말평가를 가장 위에 표시
   - 단어/문법/단원 테스트는 하단 리스트

3. 영역별 카드
   - Reading
   - Listening
   - Vocabulary
   - Grammar
   - Speaking/Writing은 후속 확장

4. 교사용 입력 버튼
   - 월말평가 입력
   - 단어 테스트 입력
   - 단원 테스트 입력

### 상단 카드 클릭 변형 구조

상단 카드는 단순 요약 카드가 아니라 성적표 화면의 모드 전환 버튼이다.

상단 카드 예시:

- `월말평가`
- `단어`
- `문법`
- `교재/단원`
- `Reading`
- `Listening`
- `자유기록`

카드를 누르면 아래 영역이 해당 모드로 변형된다.

예시 동작:

- `월말평가` 카드 클릭 → 월말평가 입력/조회 폼 표시
- `단어` 카드 클릭 → 단어 시험 빠른 입력표 표시
- `문법` 카드 클릭 → 문법 주제/오답 유형 입력 표시
- `교재/단원` 카드 클릭 → 교재명, Unit, Lesson 기준 입력 표시
- `Reading` 카드 클릭 → 지문/레벨/정답률/코멘트 표시
- `Listening` 카드 클릭 → 회차/점수/듣기 약점 표시
- `자유기록` 카드 클릭 → 선생님이 원하는 항목명과 값을 직접 추가하는 폼 표시

카드 클릭 시 화면 전체를 이동하지 말고, 학생 상세 안의 성적표 섹션 내부만 교체한다. 뒤로가기나 route를 깨면 안 된다.

### 선생님 자유 입출력 구조

선생님들은 실제 수업 중에 정형화되지 않은 평가를 남길 수 있어야 한다.

필수 원칙:

- 고정 시험 유형만 강제하지 않는다.
- 점수형, 체크형, 메모형, 등급형을 모두 허용한다.
- 저장 전 미리보기 또는 즉시 반영이 가능해야 한다.
- 한 학생씩 입력 가능해야 한다.
- 반 전체 학생을 표 형태로 빠르게 입력할 수 있어야 한다.
- 같은 시험을 여러 학생에게 한 번에 입력할 수 있어야 한다.
- 저장 후 다시 열면 선생님이 입력한 항목명 그대로 보여야 한다.

자유 입력 필드 타입:

- `number`: 점수
- `text`: 짧은 메모
- `textarea`: 긴 코멘트
- `checkbox`: 재시험 필요, 숙제 미흡 등
- `select`: 등급, 통과/미통과, A/B/C 등
- `date`: 시험일

초기 MVP에서는 템플릿 편집 UI까지 완성하지 않아도 된다. 대신 `자유기록` 모드에서 항목명/값을 추가하고 `payload_json`에 저장할 수 있게 한다.

### 반 전체 빠른 입력 화면

학생 상세 성적표 외에도 선생님 화면에서 반 전체 입력이 필요하다.

흐름:

1. 선생님 대시보드 또는 클래스룸에서 반 선택
2. `성적 입력` 클릭
3. 테스트 유형 선택
4. 학생 목록 표 출력
5. 학생별 점수/메모 입력
6. 일괄 저장

표 예시:

```text
학생명 | 점수 | 만점 | 오답/약점 | 재시험 | 선생님 메모
```

단어 테스트처럼 단순한 경우:

```text
학생명 | 맞은 개수 | 전체 개수 | 틀린 개수 | 재시험
```

월말평가처럼 복합적인 경우:

```text
학생명 | Reading | Listening | Vocabulary | Grammar | 총점 | 코멘트
```

---

## 5. AP MATH에서 그대로 가져오면 안 되는 부분

아래는 수학 성적표 전용이므로 EIE로 그대로 복사하면 안 된다.

- 수학 단원/개념 약점명
- OMR 문항별 정오표 중심 구조
- 시험지 아카이브 파일 연결 중심 구조
- 수학 학부모 리포트 문구 엔진
- 수학 반 시험 자동등록 구조

EIE에서는 `시험지 기반 분석`보다 `월말평가 + 상시 테스트 누적 + 선생님 자유기록`이 우선이다.

---

## 6. 구현 순서

### 1단계 — 조사

- AP MATH 성적표 관련 파일 확인
  - `apmath/js/report.js`
  - `apmath/js/student.js`
  - `apmath/js/classroom.js`
  - `workers` 또는 `schema.sql`의 시험/성적 관련 API
- EIE 학생 상세 파일 확인
  - `eie/js/views/eie-students.js`
  - `eie/js/views/eie-classroom.js`
  - `eie/js/views/eie-teacher.js`
  - `eie/css/eie.css`

### 2단계 — DB/API 추가

- `eie_exam_results` 테이블 추가
- `payload_json`, `teacher_id`, `private_note` 포함
- API 추가
  - `GET /api/eie/exam-results?student_id=`
  - `GET /api/eie/exam-results?class_id=&month_key=`
  - `POST /api/eie/exam-results`
  - `POST /api/eie/exam-results/bulk`
  - `PUT /api/eie/exam-results/:id`
  - `DELETE /api/eie/exam-results/:id`

### 3단계 — UI 추가

- 학생 상세에 성적표 섹션 추가
- 상단 카드 클릭 모드 전환 구현
- 월말평가/단어/단원/문법 테스트 입력 모달 또는 인라인 패널 추가
- 자유기록 모드 추가
- 반 전체 빠른 입력 화면 추가
- 기존 EIE 카드 토큰 사용
- AP MATH UI를 참고하되 EIE 색상/카드 규격 유지

### 4단계 — 저장 UX 보강

- 입력 중 로컬 draft 보존
- 저장 성공/실패 상태 표시
- 저장 후 화면이 닫히지 않게 유지
- 동일 시험을 여러 학생에게 일괄 저장
- 기존 기록 수정 시 원래 입력 항목명 유지

### 5단계 — 검수

- 학생 상세 기존 정보/상담/출결 기능 회귀 없음
- 성적 입력 후 새로고침해도 유지
- 월말평가가 월별 요약 최상단에 표시
- 단어 테스트는 별도 축으로 표시
- 자유기록 payload가 저장/재조회됨
- 반 전체 일괄 입력 저장 확인
- 원장/선생님 권한별 표시 확인
- 모바일 카드 깨짐 확인

---

## 7. Codex 지시 핵심

이번 작업은 “AP MATH 성적표 복붙”이 아니라 “AP MATH 성적표 운영 구조를 EIE 영어 평가 모델로 포팅”이다.

성적표 섹션은 고정 화면이 아니다. 상단 카드 클릭에 따라 아래 입력/조회 패널이 변형되는 구조로 만든다.

선생님 입력은 자유로워야 한다. 정해진 시험 유형만 저장되면 실패다. 고정 필드와 `payload_json`을 병행해, 현장에서 선생님이 추가한 항목명과 값을 보존해야 한다.

Codex는 먼저 AP MATH 성적표 파일과 EIE 학생 상세 파일을 직접 읽고, `CODEX_RESULT1.md`에 다음을 반드시 분리 보고한다.

1. AP MATH 성적표 구조 확인 결과
2. EIE에 재사용할 구조
3. EIE에서 새로 추가할 영어 테스트 구조
4. 상단 카드 클릭 모드 전환 구현 방식
5. 선생님 자유 입력 저장 방식
6. 실제 수정 파일
7. 테스트 결과
8. 브라우저 미확인 시 미확인 명시

---

## 8. 하위 에이전트 검수 고정

### Codex A — 구현

- DB/API/UI 구현
- 상단 카드 클릭 모드 전환 구현
- 반 전체 빠른 입력 구현
- 기존 EIE 학생 상세 기능 보존

### Codex B — 로직 검수

- AP MATH 성적표 구조를 정확히 참고했는지 확인
- 수학 전용 개념/OMR 구조가 EIE에 섞이지 않았는지 확인
- 월말평가/단어/문법/단원 테스트 구분 확인
- 자유 입력 항목이 `payload_json`에 저장/복원되는지 확인

### Codex C — UI 검수

- EIE 카드/버튼/색상 토큰 사용 확인
- 상단 카드 클릭 시 아래 패널만 바뀌는지 확인
- 학생 상세 화면과 이질감 없는지 확인
- 반 전체 빠른 입력표가 모바일에서 깨지지 않는지 확인
- 모바일 확인

### Codex D — 회귀 검수

- `node --check` 관련 JS 전체
- 기존 EIE 학생 상세/상담/클래스룸 이동 회귀 확인
- 성적 입력 저장 후 새로고침 재조회 확인
- 일괄 저장 중 일부 실패 처리 확인
- 테스트 파일 생성 시 테스트 후 삭제

---

## 9. 보류 사항

초기 MVP에서 보류한다.

- 자동 학부모 리포트 문구 생성
- AI 약점 분석
- 시험지 문항별 상세 분석
- speaking/writing 루브릭 세부 채점
- 월말평가 PDF 출력
- 선생님별 템플릿 편집 전용 관리자 화면

먼저 입력/저장/조회/월별 요약/상단 카드 변형/자유기록 저장을 안정화한다.
