cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 작업명

APMS Dashboard/Classroom Typography Alignment 1차 보정

## 0. 최상위 명령

이번 작업은 기능 수정이 아니다.

이번 작업은 대시보드 학급관리 row와 클래스룸 상단 반 제목/row 타이포그래피를 같은 APMS UI Foundation 기준으로 맞추는 제한 보정이다.

절대 전체 디자인 리뉴얼하지 마라.
절대 기능/문구/버튼명/화면명을 변경하지 마라.
절대 git add, git commit, git push 하지 마라.

작업 후 CODEX_RESULT.md만 정리한다.

---

## 1. 현재 문제

브라우저 실화면 기준으로 다음 문제가 확인됐다.

1. 클래스룸 상단 반 이름 `중1A`가 학생 이름/버튼/보조문구보다 과하게 굵다.
2. 대시보드 학급관리 row의 반 이름 `중1A`, `중1C`, `중3A`, `고1A`도 과하게 굵다.
3. 대시보드 학급관리 chip의 `재원 6`, `등원 6`, `결석 0` 안에서 글자/숫자 위계가 아직 완전히 정돈되지 않았다.
4. 수업 없음 row와 수업 있는 row가 같은 typography 체계 안에 있어야 한다.
5. APMS UI Foundation 기준인 400~500 font-weight 중심이 아직 일부 cls-v4 또는 dashboard class에서 흔들린다.

---

## 2. 목표

다음 기준으로 대시보드 학급관리와 클래스룸 상단/row 타이포그래피를 보정한다.

### 공통 기준

- 반 이름: 14px 또는 기존 흐름에 맞는 크기 / font-weight 500 이하
- 학생 이름: 14px / font-weight 500 이하
- 보조문구: 12~13px / font-weight 400
- chip: 12px / font-weight 400~500
- chip 숫자만 과하게 굵게 만들지 않음
- 상태값만 과하게 굵게 만들지 않음
- font-weight 700/800/900 신규 추가 금지
- 색상 강조 추가 금지
- 기능/문구/버튼명 변경 금지

---

## 3. 수정 허용 파일

이번 작업에서 수정 가능한 파일은 아래로 제한한다.

- apmath/js/dashboard.js
- apmath/js/classroom.js
- apmath/css/dashboard-foundation.css
- apmath/css/classroom-foundation.css
- apmath/css/apms-ui-foundation.css
- CODEX_RESULT.md

단, 실제로 필요한 파일만 수정하라.

---

## 4. 수정 금지 파일

아래 파일은 절대 수정하지 마라.

- apmath/js/ui.js
- apmath/js/cumulative.js
- apmath/js/timetable.js
- apmath/js/report.js
- apmath/js/student.js
- apmath/student/index.html
- apmath/planner/index.html
- apmath/worker-backup
- apmath/worker
- schema.sql
- archive
- docs/design
- apmath/index.html

이번 작업은 이미 생성된 CSS link나 문서를 건드리지 않는다.

---

## 5. 작업 전 확인

작업 전 아래 파일을 실제로 열어 확인한다.

- apmath/js/dashboard.js
- apmath/js/classroom.js
- apmath/css/dashboard-foundation.css
- apmath/css/classroom-foundation.css
- apmath/css/apms-ui-foundation.css
- CODEX_RESULT.md

특히 아래 함수/selector를 확인한다.

### dashboard.js

- renderClassSummaryCard
- 대시보드 학급관리 row 렌더링 함수
- ap-class-row / ap-class-chip 사용 위치

### classroom.js

- renderClassTopBarV4B
- renderClassToolBarV4B
- renderClassStudentBoardV4B
- renderClassStudentRowV4B
- injectClassroomStyles
- getV4BadgeStyle

### CSS

- .ap-class-row
- .ap-class-row__name
- .ap-class-row__name--inactive
- .ap-class-chip
- .ap-classroom-chip
- .ap-classroom-chip__value
- .ap-classroom-row__title
- .ap-classroom-row__meta
- .cls-v4-title-main
- .cls-v4-student
- .cls-v4-pill
- .cls-v4-tool
- .cls-v4-status

---

## 6. 대시보드 학급관리 보정 기준

대상:

- 대시보드 학급관리 row
- `중1A`, `중1C`, `중3A`, `고1A`
- 수업 없음 row
- `재원`, `등원`, `결석` chip

수정 기준:

1. 반 이름은 font-weight 500 이하로 낮춘다.
2. 수업 없음 반 이름은 font-weight 400~500 범위로 맞춘다.
3. chip 내부 텍스트와 숫자는 12px / 400~500 범위로 통일한다.
4. chip 안 숫자만 `<b>` 또는 과한 bold로 튀면 안 된다.
5. 기존 카드 shell은 유지한다.
6. 학급 row가 텍스트만 떠 보이면 안 된다.
7. 카드 안 카드 구조를 새로 만들지 않는다.
8. 기존 클릭/필터/탭 동작은 변경하지 않는다.
9. `전체`, `중등`, `고등` 탭 문구는 변경하지 않는다.

---

## 7. 클래스룸 보정 기준

대상:

- 클래스룸 상단 반 제목 `중1A`
- 상단 운영일/학목금 보조문구
- 상단 출석/숙제 chip
- 학생 row 이름
- 출결/숙제/지각/보강/상담 상태 버튼/셀

수정 기준:

1. `중1A` 같은 반 제목은 font-weight 500 이하로 낮춘다.
2. 반 제목이 학생 이름보다 과하게 굵어 보이면 실패다.
3. 학생 이름도 500 이하로 유지한다.
4. 보조문구는 400으로 유지한다.
5. 출석/숙제 chip 숫자가 과하게 굵으면 안 된다.
6. 기존 버튼명 `진도`, `숙제`, `QR/OMR`, `시험성적`, `클리닉`, `플래너`를 변경하지 않는다.
7. 기존 출결/숙제/지각/보강/상담/플래너 동작을 변경하지 않는다.
8. 기존 모달/저장 로직을 변경하지 않는다.
9. 이모티콘/이모지/아이콘을 추가하지 않는다.

---

## 8. CSS 보정 원칙

다음 방식으로 해결한다.

1. 가능하면 CSS에서 typography만 보정한다.
2. JS 구조를 바꾸기보다 class/style 정의를 낮추는 방식으로 해결한다.
3. 단, `<b>` 또는 강한 inline style 때문에 CSS만으로 안 되면 해당 마크업을 최소 수정한다.
4. 새 inline style을 추가하지 않는다.
5. 전역 selector를 추가하지 않는다.
6. body/button/.card/*/td/tr/input/textarea/select 전역 selector를 추가하지 않는다.
7. `!important` 남발 금지. 정말 기존 주입 style 순서 때문에 불가피한 경우에도 최소 selector에만 사용하고 CODEX_RESULT.md에 이유를 남긴다.

---

## 9. 금지 사항

절대 하지 마라.

- 기능 추가
- 기능 삭제
- 문구 변경
- 버튼명 변경
- 화면명 변경
- toast 문구 변경
- API 호출 변경
- 저장 로직 변경
- 데이터 구조 변경
- 대시보드 수/목 일지 row 변경
- 사이드바 변경
- 출석부 로딩 최적화 코드 변경
- student portal 변경
- planner 변경
- worker 변경
- schema 변경
- docs/design 변경
- git add
- git commit
- git push

---

## 10. 검증

작업 후 반드시 실행한다.

node --check apmath/js/dashboard.js
node --check apmath/js/classroom.js

필요 시 CSS는 grep 또는 Select-String으로 확인한다.

확인할 것:

- 신규 font-weight 700/800/900 추가 없음
- chip 숫자 `<b>` 신규 없음
- 대시보드 학급관리 row class 유지
- 클래스룸 상단 반 제목 font-weight 500 이하
- 기존 버튼명/문구 변경 없음
- 기능 로직 변경 없음
- dashboard.js/classroom.js 문법 통과

---

## 11. CODEX_RESULT.md 작성 형식

작업 후 루트 CODEX_RESULT.md를 아래 형식으로 작성한다.

# CODEX_RESULT

## 1. 생성/수정 파일

- 수정 파일 목록

## 2. 구현 완료 또는 확인 완료

- 대시보드 학급관리 반 이름 font-weight 보정 여부
- 대시보드 chip typography 보정 여부
- 수업 없음 row typography 보정 여부
- 클래스룸 상단 반 제목 font-weight 보정 여부
- 클래스룸 학생 row/상태 typography 보정 여부
- 기존 문구/버튼명/화면명 보존 여부
- 기능/onclick/API/저장 로직 미변경 여부
- 이모티콘/이모지/아이콘 미추가 여부
- 전역 CSS 미수정 여부

## 3. 실행 결과

- node --check apmath/js/dashboard.js 결과
- node --check apmath/js/classroom.js 결과

## 4. 결과 요약

- 짧게 요약

## 5. 다음 조치

- 브라우저에서 대시보드 학급관리 확인 필요
- 브라우저에서 클래스룸 상단/학생 row 확인 필요
- 화면 미감 확인 후 커밋 여부 판단

---

## 12. 최종 명령

APMS Dashboard/Classroom Typography Alignment 1차 보정을 수행하라.

이번 작업은 타이포그래피 보정만 한다.
대시보드 학급관리와 클래스룸 상단/row의 글자 굵기/크기 통일감을 맞추되, 기능과 문구는 절대 변경하지 않는다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF