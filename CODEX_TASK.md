````markdown
# CODEX_TASK.md

## 작업명
AP Math OS — 오답 클리닉 출력 센터 1차 설계/구현

---

## 0. 실행 환경 고정

이 프로젝트의 Codex 작업은 반드시 VS Code의 Ubuntu(WSL) 터미널에서 실행한다.

Windows PowerShell에서 `codex` 실행 금지.

정상 실행 경로:

```bash
cd /mnt/c/Users/USER/Desktop/AP------
codex
````

현재 프로젝트 루트:

```bash
/mnt/c/Users/USER/Desktop/AP------
```

---

## 1. 작업 목표

AP Math OS 반 화면에서 선생님이 원클릭에 가깝게 오답지를 출력할 수 있는 **오답 클리닉 출력 센터**를 만든다.

핵심 목표는 다음과 같다.

1. 선생님이 반 화면에서 `[오답지 출력]` 버튼을 누른다.
2. 특정 시험 1개, 여러 시험, 기간 기준으로 오답 데이터를 선택한다.
3. 학생별 오답지 또는 반별 공통 오답지를 선택한다.
4. 시스템이 `exam_sessions`, `wrong_answers`, `archive_file`, `exam_blueprints` 데이터를 이용해 오답 문항을 자동 수집한다.
5. `wrong_print_engine.html` 전용 출력 엔진이 JS아카이브 원문을 자동 로드한다.
6. 선생님이 믹서나 아카이브에 들어가지 않아도 바로 출력한다.

---

## 2. 최종 기능명

기능명:

```text
오답 클리닉 출력 센터
```

반 화면 버튼명:

```text
오답지 출력
```

신규 출력 엔진명:

```text
wrong_print_engine.html
```

신규 프론트 모듈명:

```text
apmath/js/clinic-print.js
```

---

## 3. 절대 원칙

아래 사항은 반드시 지킨다.

1. `mixed_engine.html` 직접 수정 금지
2. `engine.html` 직접 수정 금지
3. `mixer.html` 직접 수정 금지
4. `worker/index.js` 수정 금지
5. `schema.sql` 수정 금지
6. DB 신규 테이블 생성 금지
7. 기존 QR/OMR 저장 로직 변경 금지
8. 기존 리포트 출력/AI 리포트 로직 변경 금지
9. 기존 출석/숙제/상담/진도 기능 변경 금지
10. 기존 안정 파일을 불필요하게 리팩터링하지 말 것

이번 1차 작업은 **프론트 기능 추가**로 한정한다.

---

## 4. 수정/신규 파일 범위

### 신규 파일

```text
apmath/js/clinic-print.js
apmath/wrong_print_engine.html
```

### 수정 파일

```text
apmath/js/classroom.js
apmath/index.html
```

### 참고만 할 파일

```text
apmath/js/qr-omr.js
apmath/js/report.js
apmath/js/core.js
apmath/mixed_engine.html
apmath/engine.html
```

참고 파일은 필요한 함수/구조를 확인하기 위한 용도다. 직접 수정하지 않는다.

---

## 5. 기존 구조 참고 기준

### 5-1. qr-omr.js 참고 사항

`qr-omr.js`에는 이미 성적/오답 저장 구조가 있다.

활용할 데이터 흐름:

```text
exam_title
exam_date
question_count
archive_file
class_id
student_id
wrong_ids
```

`exam_sessions`와 `wrong_answers`를 기반으로 오답지 데이터를 구성한다.

기존 QR/OMR 입력 및 저장 로직은 건드리지 않는다.

---

### 5-2. report.js 참고 사항

`report.js`에는 이미 JS아카이브 원문 연결에 필요한 로직이 있다.

참고할 로직:

```text
archiveFile 정규화
아카이브 JS fetch
questionBank 추출
문항 번호로 questionBank에서 문항 찾기
```

단, `report.js`를 직접 수정하지 말고, 필요한 로직은 `wrong_print_engine.html` 내부에 독립 구현하거나 안전하게 참고한다.

---

### 5-3. mixed_engine.html 참고 사항

`mixed_engine.html`은 수정하지 않는다.

참고할 부분:

```text
A4 출력 스타일
문항 렌더링 구조
MathJax 설정
보기 출력 방식
정답표/해설지 모드 구조
인쇄 버튼 구조
```

`wrong_print_engine.html`은 독립 엔진이어야 한다.

---

### 5-4. core.js 참고 사항

`core.js`의 `state.db`에는 다음 데이터가 이미 들어온다.

```text
students
classes
class_students
exam_sessions
wrong_answers
exam_blueprints
```

1차 구현은 이 데이터를 사용한다.

Worker API 추가는 하지 않는다.

---

## 6. classroom.js 수정 지시

### 목표

반 화면 툴바에 `[오답지 출력]` 버튼을 추가한다.

### 위치

`classroom.js`의 반 화면 툴바 영역에 추가한다.

현재 반 화면에는 다음 성격의 버튼들이 있다.

```text
QR/OMR
시험성적
클리닉
진도관리
플래너
```

이 근처에 `[오답지 출력]` 버튼을 추가한다.

### 버튼 동작

```js
openClinicPrintCenter(classId)
```

을 호출한다.

### 스타일

기존 `cls-v4-tool` 버튼 스타일을 사용한다.

추천:

```html
<button class="btn cls-v4-tool red" onclick="openClinicPrintCenter('${classId}')">오답지 출력</button>
```

단, 실제 변수명과 문자열 이스케이프는 기존 classroom.js 방식에 맞춘다.

### 주의

* classroom.js 전체 구조를 대개편하지 말 것
* 버튼 추가 외 기존 로직 수정 금지
* 출석/숙제 상태 순환 로직 절대 변경 금지
* 상담 버튼/진도관리/플래너/QR 버튼 기능 변경 금지

---

## 7. index.html 수정 지시

`apmath/index.html`에 신규 스크립트를 추가한다.

추가 대상:

```html
<script src="js/clinic-print.js"></script>
```

위치는 `qr-omr.js`, `report.js`, `classroom.js` 등 주요 모듈들이 로드되는 기존 script 목록 근처에 둔다.

주의:

* 기존 script 순서를 무리하게 재정렬하지 말 것
* 다른 script 제거 금지
* CSS 대개편 금지

---

## 8. clinic-print.js 신규 파일 설계

파일 경로:

```text
apmath/js/clinic-print.js
```

### 역할

`clinic-print.js`는 AP Math OS 안에서 오답 출력 데이터를 만드는 전용 모듈이다.

담당 기능:

1. 반별 시험 목록 생성
2. 시험 1개 선택
3. 여러 시험 선택
4. 기간 선택
5. 학생별 오답 수 계산
6. 반별 공통 오답 중복 제거
7. 오답 출력 센터 모달 생성
8. `wrongPrintPayload` 생성
9. `sessionStorage`에 payload 저장
10. `wrong_print_engine.html` 새 창 열기

---

## 9. clinic-print.js 필수 함수

아래 함수들을 구현한다.

```js
function openClinicPrintCenter(classId) {}
```

반 화면에서 호출되는 진입 함수.

```js
function clinicPrintGetClassStudents(classId) {}
```

해당 반의 재원생 목록 반환.

```js
function clinicPrintGetClassExamGroups(classId) {}
```

해당 반의 시험 이력 그룹 반환.

그룹 기준:

```text
exam_date + exam_title + archive_file + question_count
```

```js
function clinicPrintGetSessionsForExamGroup(classId, examGroupKey) {}
```

선택된 시험 그룹에 해당하는 학생별 session 목록 반환.

```js
function clinicPrintGetWrongIdsBySession(sessionId) {}
```

해당 session의 wrong_answers.question_id 목록 반환.

```js
function clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, selectedStudentIds, options) {}
```

학생별 오답지용 데이터 생성.

```js
function clinicPrintBuildClassWrongItems(studentWrongItems) {}
```

반별 공통 오답지용 데이터 생성.

중복 제거 기준:

```text
archiveFile + questionNo
```

```js
function clinicPrintBuildPayload(classId, config) {}
```

`wrong_print_engine.html`에 넘길 최종 payload 생성.

```js
function clinicPrintOpenEngine(payload) {}
```

`sessionStorage`에 저장 후 `wrong_print_engine.html` 새 창 열기.

---

## 10. 오답 출력 센터 UI

`openClinicPrintCenter(classId)` 호출 시 모달을 띄운다.

모달 제목:

```text
오답 클리닉 출력 센터
```

### UI 구성

```text
[빠른 출력]
- 최근 시험 학생별 오답
- 최근 시험 반별 오답

[상세 설정]
출력 기준:
○ 시험 1개
○ 여러 시험 선택
○ 기간 선택

출력 방식:
○ 학생별 오답지
○ 반별 공통 오답지
○ 학생별 + 반별

시험 목록:
□ 2026-05-03 금당고 기출 22문항
□ 2026-05-06 매산고 기출 21문항
□ 2026-05-09 단원평가 20문항

학생:
☑ 오답 있는 학생 전체
☑ 김민준 5문항
☑ 이서연 3문항
☑ 박지후 1문항

옵션:
☑ 오답 없는 학생 제외
☑ 학생별 페이지 분리
☑ 문항별 오답 학생 표시
☐ 정답 포함
☐ 해설 포함

[오답지 만들기]
```

### 1차 필수 UI

너무 복잡하게 만들지 않는다.

1차에서는 최소한 아래가 동작하면 된다.

```text
1. 시험 목록 체크
2. 출력 방식 선택
3. 학생 체크
4. 오답지 만들기
```

---

## 11. 출력 모드 정의

### 11-1. 학생별 오답지

mode:

```text
student
```

출력 방식:

```text
김민준 오답지
- 금당고 기출 3번
- 금당고 기출 7번

다음 페이지

이서연 오답지
- 금당고 기출 1번
- 매산고 기출 3번
```

특징:

* 학생마다 페이지 분리
* 학생이 실제로 틀린 문제만 출력
* 오답 없는 학생은 기본 제외

---

### 11-2. 반별 공통 오답지

mode:

```text
class
```

출력 방식:

```text
중2A 반별 공통 오답지

금당고 기출 3번
오답 학생: 김민준, 이서연, 박지후 / 총 3명

금당고 기출 7번
오답 학생: 김민준 / 총 1명
```

특징:

* 같은 문항은 한 번만 출력
* 문항별 오답 학생명 표시
* 중복 제거 기준은 `archiveFile + questionNo`
* 오답 많은 문항 순으로 정렬 가능하면 적용

---

### 11-3. 하이브리드

mode:

```text
hybrid
```

출력 방식:

```text
1부. 반별 공통 오답
2부. 학생별 개인 오답
```

1차에서 완전 구현이 어렵다면 payload 구조만 대비하고 UI 옵션은 남겨도 된다.

---

## 12. wrongPrintPayload 구조

`clinic-print.js`가 생성해서 `sessionStorage`에 저장할 구조는 아래를 기준으로 한다.

```js
{
  version: "1.0",
  mode: "student", 
  // student | class | hybrid

  printTitle: "중2A 오답 클리닉",
  classId: "class_001",
  className: "중2A",

  range: {
    type: "multi_exam",
    from: "",
    to: ""
  },

  options: {
    groupByStudent: true,
    groupByExam: true,
    dedupeByQuestion: true,
    showWrongStudents: true,
    pageBreakByStudent: true,
    includeAnswer: false,
    includeSolution: false,
    includeHomeworkCheckBox: true
  },

  exams: [
    {
      examKey: "2026-05-03|금당고 기출|exams/25_금당고.js|22",
      examTitle: "금당고 기출",
      examDate: "2026-05-03",
      archiveFile: "exams/25_금당고.js",
      questionCount: 22
    }
  ],

  students: [
    {
      studentId: "stu_001",
      studentName: "김민준",
      wrongItems: [
        {
          examKey: "2026-05-03|금당고 기출|exams/25_금당고.js|22",
          examTitle: "금당고 기출",
          examDate: "2026-05-03",
          archiveFile: "exams/25_금당고.js",
          questionNo: 3,
          unitKey: "H22-C-03",
          unit: "인수분해"
        }
      ]
    }
  ],

  classWrongItems: [
    {
      itemKey: "exams/25_금당고.js|3",
      examTitle: "금당고 기출",
      examDate: "2026-05-03",
      archiveFile: "exams/25_금당고.js",
      questionNo: 3,
      wrongCount: 3,
      wrongStudents: [
        { studentId: "stu_001", studentName: "김민준" },
        { studentId: "stu_002", studentName: "이서연" },
        { studentId: "stu_003", studentName: "박지후" }
      ],
      unitKey: "H22-C-03",
      unit: "인수분해"
    }
  ]
}
```

---

## 13. sessionStorage 저장 규칙

저장 key:

```text
AP_CLINIC_PRINT_PAYLOAD
```

저장 후 열 경로:

```text
wrong_print_engine.html
```

`clinicPrintOpenEngine(payload)` 동작:

```js
sessionStorage.setItem('AP_CLINIC_PRINT_PAYLOAD', JSON.stringify(payload));
window.open('wrong_print_engine.html', '_blank', 'noopener');
```

경로는 `apmath/index.html` 기준에서 `apmath/wrong_print_engine.html`로 열리게 맞춘다.

---

## 14. wrong_print_engine.html 신규 파일 설계

파일 경로:

```text
apmath/wrong_print_engine.html
```

### 역할

1. `sessionStorage.AP_CLINIC_PRINT_PAYLOAD` 읽기
2. payload 검증
3. `archiveFile`별 JS아카이브 파일 fetch
4. questionBank 추출
5. `archiveFile + questionNo`로 원문 문항 찾기
6. 학생별 오답지 렌더링
7. 반별 공통 오답지 렌더링
8. 인쇄 가능 화면 제공

---

## 15. wrong_print_engine.html 필수 기능

### 15-1. 상단 컨트롤바

```text
AP Math 오답 클리닉
[문제지] [정답표] [해설지]
[인쇄 / PDF 저장]
```

1차에서는 `[문제지]`만 완성해도 된다.

정답표/해설지는 버튼만 두고, 가능하면 기본 구현한다.

---

### 15-2. 아카이브 로딩

`archiveFile` 정규화 규칙:

```text
exams/파일명.js → archive/exams/파일명.js 또는 현재 상대경로 기준 확인
파일명.js → exams/파일명.js
http URL → 그대로 fetch
```

주의:

현재 AP Math OS에서 JS아카이브 경로는 배포 구조에 따라 다를 수 있다.

우선 `report.js`의 archive base URL 구조를 참고한다.

필요하면 아래 base URL을 사용한다.

```js
const ARCHIVE_BASE_URL = 'https://icefoxtail.github.io/AP------/archive/';
```

---

### 15-3. questionBank 추출

아카이브 JS 파일은 `window.questionBank` 구조일 수 있다.

다음 형태를 지원한다.

```text
window.questionBank = [...]
window.questionBank = { questions: [...] }
window.questionBank = { items: [...] }
window.questionBank = { data: [...] }
```

문항 번호 후보:

```text
questionNo
question_no
no
number
qno
qid
id
배열 index + 1
```

---

### 15-4. 문항 렌더링

`mixed_engine.html`의 출력 스타일을 참고한다.

필수 출력:

```text
문항 번호
발문 content
보기 choices
이미지/image 필드
표/table HTML
```

지원 필드 후보:

```text
content
question
text
prompt
choices
options
answer
solution
explanation
image
imageUrl
```

---

### 15-5. 학생별 출력

학생별 오답지는 다음 구조로 출력한다.

```text
[학생명] 오답지
반명 · 시험명 또는 오답 클리닉 · 날짜

문제 1
문제 2
문제 3

숙제 체크란:
□ 다시 풀기 완료
□ 풀이 과정 확인
□ 선생님 확인
```

학생별 페이지 분리 적용.

---

### 15-6. 반별 공통 오답 출력

반별 공통 오답지는 다음 구조로 출력한다.

```text
[반명] 반별 공통 오답지

문항 정보:
시험명 · 원본 번호

오답 학생:
김민준, 이서연, 박지후 / 총 3명

문제 본문
보기
```

정렬 기준:

1. wrongCount 내림차순
2. examDate 오름차순 또는 내림차순
3. questionNo 오름차순

---

## 16. 단원 정보 연결

가능하면 `exam_blueprints` 정보를 활용한다.

각 wrongItem 생성 시 다음 정보를 넣는다.

```text
unitKey
unit
course
cluster
```

찾는 기준:

```text
archive_file === session.archive_file
question_no === wrong_answers.question_id
```

없으면 빈 값으로 둔다.

---

## 17. 1차 제외 항목

아래는 이번에 구현하지 않는다.

```text
재풀이 완료 저장
반복 오답 DB 저장
오답 출력 이력 저장
AI 코멘트 생성
학부모용 요약지
카카오톡 자동 발송
Worker API 추가
D1 schema 변경
```

---

## 18. 구현 전 먼저 보고할 것

Codex는 파일 수정 전에 먼저 아래를 보고한다.

```text
1. 이해한 작업 범위
2. 수정/신규 생성할 파일 목록
3. classroom.js에서 버튼을 넣을 정확한 위치
4. clinic-print.js 내부 함수 설계
5. wrong_print_engine.html 내부 렌더링 설계
6. mixed_engine.html에서 참고할 함수/스타일
7. report.js에서 참고할 archive 로딩 로직
8. qr-omr.js에서 참고할 시험 이력 로직
9. 예상 위험 지점
10. Worker 수정 없이 가능한지 최종 판단
```

파일 수정은 이 보고 이후 승인받고 진행한다.

---

## 19. 구현 후 검수 조건

구현 완료 후 반드시 아래를 보고한다.

```text
1. 신규 파일 목록
2. 수정 파일 목록
3. 각 파일별 변경 요약
4. 기존 기능 영향 여부
5. node --check 결과
6. 브라우저 수동 테스트 체크리스트
7. 미구현/2차 확장 항목
```

필수 명령:

```bash
node --check apmath/js/classroom.js
node --check apmath/js/clinic-print.js
```

HTML 파일은 `node --check` 대상이 아니므로 `wrong_print_engine.html` 내부 `<script>` 문법을 자체 점검한다.

---

## 20. 수동 테스트 체크리스트

브라우저에서 아래 흐름을 확인한다.

```text
1. AP Math OS 로그인
2. 반 화면 진입
3. [오답지 출력] 버튼 표시 확인
4. 버튼 클릭 시 오답 클리닉 출력 센터 모달 표시
5. 시험 목록 표시 확인
6. 오답 있는 학생 표시 확인
7. 학생별 오답지 생성
8. wrong_print_engine.html 새 창 열림
9. 학생별 페이지 분리 확인
10. 반별 공통 오답지 생성
11. 같은 문제 중복 제거 확인
12. 문항별 오답 학생명/인원 표시 확인
13. 인쇄 버튼 동작 확인
14. 기존 QR/OMR 입력 기능 정상 확인
15. 기존 반 화면 출석/숙제 버튼 정상 확인
```

---

## 21. 최종 주의

이 작업의 핵심은 “선생님 원클릭 오답지 출력”이다.

선생님이 직접 믹서에 들어가 문제를 고르게 만들면 실패다.

정답은 다음 구조다.

```text
반 화면
→ 오답지 출력
→ 시험/학생 자동 선택
→ wrong_print_engine.html
→ 바로 인쇄
```

최대한 기존 시스템을 건드리지 말고, 신규 기능은 `clinic-print.js`와 `wrong_print_engine.html`에 격리한다.

```
```
