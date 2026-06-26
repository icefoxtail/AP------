# APMS 오답 출력 센터 고도화 계획서

# 0. 핵심 전제

이번 작업은 오답 출력 센터를 다음 4개 카드 구조로 재정리하는 작업이다.

```text
학생
반
학년
유형
```

기존 `학생별 / 반별 / 학년별` 오답 출력은 유지한다.
새로 추가하는 고도화 영역은 `유형` 카드 안에 둔다.

`분석 오답`이라는 문구는 사용하지 않는다.

최종 화면 구조는 다음 기준으로 간다.

```text
오답 출력

[ 학생 ] [ 반 ] [ 학년 ] [ 유형 ]

카드 클릭 시 하단 설정 영역이 변경됨
```

이번 작업에서 가장 중요한 기준은 단원이다.

깃 확인 결과, JS아카이브에는 이미 표준단원키 마스터 문서와 `archive/concept_map.js`가 존재한다.
따라서 이번 작업에서 단원 마스터를 새로 invent하지 않는다.

```text
단원 기준 = JS아카이브 표준단원키 / concept_map.js 우선 재사용
오답 문항 연결키 = standard_unit_key / unitKey
```

APMS DB에 별도 `standard_units` 또는 `unit_master` 테이블을 새로 만드는 것은 이번 1차 구현 범위가 아니다.
필요하면 이후 저장형 오답 세트 단계에서 DB 테이블화한다.

---

# 1. 최종 목표

오답 출력 센터를 다음 구조로 개편한다.

```text
상위 카드:
- 학생
- 반
- 학년
- 유형
```

## 학생 카드

기존 학생별 오답 출력 유지.

```text
- 시험 선택
- 학생 선택
- 학생별 오답 출력
```

## 반 카드

기존 반별 오답 출력 유지.

```text
- 시험 선택
- 현재 반 기준
- 반별 공통 오답 출력
```

## 학년 카드

기존 학년별 오답 출력 유지.

```text
- 시험 선택
- 같은 학년 전체 기준
- 학년별 공통 오답 출력
```

학년별 오답은 코드상 `teacher_name`으로 담임 필터를 걸지 않고, 같은 grade의 active class 전체를 모으는 구조다.
단, 실제 결과는 현재 로그인 역할에서 로드된 `state.db.classes`, `state.db.exam_sessions` 범위에 영향을 받을 수 있으므로 이 부분은 구현 시 검수한다.

## 유형 카드

유형 카드 안에는 작은 카드들을 둔다.

```text
[ 최다빈출 ]
정답률 50% 이상
반복 오답 문항

[ 최다오답 ]
정답률 50% 미만
다수 취약 문항

[ 단원별 오답 ]
마스터 단원 기준 선택 출력
```

---

# 2. Scope 규칙

## 이번 작업에서 건드리는 범위

주요 대상 파일 후보는 다음이다.

```text
apmath/js/clinic-print.js
apmath/wrong_print_engine.html
오답 출력 센터 관련 CSS
필요 시 APMS HTML 모달 영역
```

단원 마스터 데이터 연결 확인 대상은 다음이다.

```text
archive/concept_map.js
docs/rules/JS아카이브_표준단원키_마스터테이블.md
docs/rules/# JS아카이브 표준단원키 마스터 테이블.md
apmath/worker-backup/worker/schema.sql
apmath/worker-backup/worker/migrations/stage6a_exam_blueprints.sql
```

## 이번 작업에서 건드리지 않는 범위

다음은 건드리지 않는다.

```text
archive/engine.html 핵심 렌더링 알고리즘
archive/mixed_engine.html 핵심 렌더링 알고리즘
wrapLatex
autoCompress
fitQuestionBox
renderSol
renderAns
기존 시험지 출력 페이지 압축 로직
기존 학생별/반별/학년별 payload 호환성
```

## DB 원칙

이번 라운드에서는 단원 마스터 DB 테이블을 새로 만들지 않는다.

이유:

```text
1. JS아카이브 표준단원키 마스터가 이미 존재함
2. concept_map.js가 이미 있음
3. APMS 오답 item에는 unitKey / standard_unit_key가 이미 들어감
4. 1차 목표는 UI/출력 고도화이지 마스터 데이터 재설계가 아님
```

단, 장기 저장형 오답 세트 단계에서는 별도 DB snapshot을 만든다.

---

# 3. 데이터 기준

## 현재 오답 item 기준

현재 오답 출력 쪽에서 문항별로 다음 정보가 들어간다.

```text
examKey
examTitle
examDate
archiveFile
questionNo
unitKey
unit
course
cluster
```

이 중 단원 연결의 핵심은 `unitKey`다.

```text
wrongItem.unitKey
= exam_blueprints.standard_unit_key
= JS아카이브 표준단원키
```

## 단원 마스터 기준

단원 목록은 다음 우선순위로 만든다.

```text
1순위: archive/concept_map.js의 표준단원키 데이터
2순위: JS아카이브 표준단원키 마스터 문서 기준
3순위: exam_blueprints에 실제 등장한 unitKey 목록
```

1순위와 2순위는 마스터 기준이다.
3순위는 fallback이다.

단원명 문자열만 보고 목록을 만들면 안 된다.

금지 예시:

```text
standard_unit 이름만 모아서 Set으로 단원 목록 생성
```

허용 예시:

```text
unitKey 기준으로 마스터 단원에 매칭
마스터에 있으면 마스터 표시명/순서 사용
마스터에 없으면 기타 / 단원 미분류로 보냄
```

---

# 4. UI 구조

## 상위 카드

```text
학생
반
학년
유형
```

카드 클릭 시 하단 설정 패널이 바뀐다.

## 유형 카드 내부

유형 카드 클릭 시 다음 작은 카드를 표시한다.

```text
최다빈출
최다오답
단원별 오답
```

## 최다빈출

```text
기준:
- 정답률 50% 이상
- 오답 발생 수 많은 순

의미:
- 절반 이상은 맞혔지만 반복적으로 틀린 학생이 있는 문항
- 실수, 조건 누락, 계산 실수, 개인 약점 점검용
```

화면 문구:

```text
최다빈출
정답률 50% 이상
반복 오답 문항
```

## 최다오답

```text
기준:
- 정답률 50% 미만
- 오답 발생 수 많은 순

의미:
- 다수 학생이 막힌 문항
- 개념 재설명, 단원 보강 필요 문항
```

화면 문구:

```text
최다오답
정답률 50% 미만
다수 취약 문항
```

## 단원별 오답

단원별 오답은 마스터 단원 기준으로 선택한다.

```text
범위 선택:
- 현재 반
- 같은 학년 전체

유형 선택:
- 최다빈출
- 최다오답

단원 선택:
- 마스터 단원 목록에서 선택
- 선택한 단원은 출력할 단원 목록으로 이동
- 출력할 단원 목록은 드래그로 순서 변경 가능
```

---

# 5. 단원 드래그 설계

단원별 오답 화면은 다음 구조로 만든다.

```text
단원별 오답

[현재 반] [같은 학년 전체]

[최다빈출] [최다오답]

마스터 단원
┌────────────────────┐
│ 여러 가지 방정식과 부등식  + │
│ 이차함수                  + │
│ 도형의 방정식              + │
└────────────────────┘

출력할 단원
┌────────────────────┐
│ ≡ 1. 여러 가지 방정식과 부등식 │
│ ≡ 2. 이차함수                 │
└────────────────────┘

[오답지 출력]
```

## 드래그 기능

```text
1. 출력할 단원 목록 안에서 순서 변경 가능
2. 모바일 터치 조작 가능
3. 드래그가 어려운 환경을 위해 위/아래 버튼도 보조 제공 가능
```

## 단원 미분류 처리

마스터에 매칭되지 않는 문항은 누락시키지 않는다.

```text
기타 / 단원 미분류
```

로 모은다.

FAIL 조건:

```text
unitKey 없는 문항을 조용히 버림
마스터 매칭 실패 문항을 출력에서 누락
```

---

# 6. 출력 payload 설계

기존 payload 호환성을 깨지 않는다.

신규 유형 출력에는 payload에 다음 정보를 추가한다.

```text
mode: "type" 또는 기존 mode 확장
typeMode: "frequent" | "mostWrong" | "unit"
scope: "class" | "grade"
rateRule: "gte50" | "lt50"
selectedUnitKeys: []
unitOrder: []
```

기존 `students`, `classWrongItems`, `gradeWrongItems` 구조는 유지한다.

## 최다빈출 payload

```text
scope = class 또는 grade
rateRule = gte50
정렬 = wrongCount desc
```

## 최다오답 payload

```text
scope = class 또는 grade
rateRule = lt50
정렬 = wrongCount desc
```

## 단원별 payload

```text
scope = class 또는 grade
rateRule = gte50 또는 lt50
selectedUnitKeys = 사용자가 선택한 단원키
unitOrder = 드래그 순서
```

출력 엔진에서는 단원별 section을 만든다.

```text
[여러 가지 방정식과 부등식]
문항 1
문항 2

[이차함수]
문항 1
문항 2
```

---

# 7. 구현 Loop 설계

## Loop 0. 마스터 단원 연결 검증

이번에는 단순 조사가 아니라, 이미 깃에서 확인된 전제를 바탕으로 **연결 검증**만 한다.

### 목표

```text
1. archive/concept_map.js를 APMS 오답 출력 센터에서 읽을 수 있는지 확인
2. concept_map.js 안의 단원키/단원명/순서 구조 확인
3. exam_blueprints.standard_unit_key와 매칭 가능한지 확인
4. clinic-print.js의 unitKey와 연결 가능한지 확인
```

### 산출물

```text
CODEX_LOOP0_WRONG_PRINT_UNIT_MASTER_VERIFY.md
```

### 금지

```text
UI 구현 금지
DB 생성 금지
기존 출력 수정 금지
```

---

## Loop 1. 오답 출력 카드 UI 개편

### 목표

상위 카드를 다음으로 개편한다.

```text
학생
반
학년
유형
```

### 구현

```text
기존 학생별/반별/학년별 로직 유지
mode 선택 UI만 카드형으로 정리
유형 카드는 신규 패널로 연결
```

### 산출물

```text
CODEX_LOOP1_WRONG_PRINT_CARD_UI.md
```

---

## Loop 2. 유형 카드 내부 구현

### 목표

유형 카드 안에 작은 카드 3개를 만든다.

```text
최다빈출
최다오답
단원별 오답
```

### 구현

```text
최다빈출 = 정답률 50% 이상
최다오답 = 정답률 50% 미만
단원별 오답 = 마스터 단원 선택 패널 진입
```

### 산출물

```text
CODEX_LOOP2_WRONG_PRINT_TYPE_CARDS.md
```

---

## Loop 3. 단원별 오답 드래그 UI

### 목표

마스터 단원 기준으로 단원을 선택하고, 출력 순서를 드래그로 바꿀 수 있게 한다.

### 구현

```text
마스터 단원 목록 생성
선택 단원 목록 생성
선택 단원 순서 변경
모바일 터치 대응
위/아래 버튼 보조 검토
```

### 산출물

```text
CODEX_LOOP3_WRONG_PRINT_UNIT_DRAG.md
```

---

## Loop 4. 유형별 payload 연결

### 목표

유형별 카드 선택 결과를 실제 오답 출력 payload에 연결한다.

### 구현

```text
최다빈출 payload 생성
최다오답 payload 생성
단원별 payload 생성
wrong_print_engine.html에서 유형별 제목/섹션 출력
```

### 산출물

```text
CODEX_LOOP4_WRONG_PRINT_TYPE_PAYLOAD.md
```

---

## Loop 5. UI/UX 검수

### 목표

선생님이 실제로 이해하고 쓸 수 있는지 검수한다.

### 검수 기준

```text
학생/반/학년/유형 카드가 명확한가
유형 안의 작은 카드가 과하지 않은가
최다빈출/최다오답 문구가 헷갈리지 않는가
단원 드래그가 모바일에서 가능한가
선택한 단원 순서가 출력에 반영되는가
빈 데이터 안내가 있는가
```

### 산출물

```text
CODEX_LOOP5_WRONG_PRINT_UI_REVIEW.md
```

---

## Loop 6. 회귀 검수

### 목표

기존 출력 기능이 깨지지 않았는지 확인한다.

### 검수 항목

```text
기존 학생별 오답 출력 정상
기존 반별 오답 출력 정상
기존 학년별 오답 출력 정상
기존 QR payload 정상
기존 archiveFile 문항 로드 정상
이미지 문항 로드 정상
단원 없는 문항 누락 없음
콘솔 에러 없음
모바일 깨짐 없음
```

### 산출물

```text
CODEX_LOOP6_WRONG_PRINT_REGRESSION.md
```

---

# 8. PASS 기준

```text
학생/반/학년/유형 카드 구조가 적용됨
기존 학생별/반별/학년별 출력 유지
유형 카드 안에 최다빈출/최다오답/단원별 오답 표시
최다빈출 = 정답률 50% 이상
최다오답 = 정답률 50% 미만
단원별 오답 = 마스터 단원키 기준
단원 선택 순서가 출력 순서에 반영
단원 미분류 문항 누락 없음
기존 출력 엔진 회귀 없음
모바일 사용 가능
```

---

# 9. FAIL 기준

```text
단원 목록을 standard_unit 문자열만 모아서 만듦
JS아카이브 표준단원키 / concept_map.js를 무시하고 새 기준을 invent함
최다빈출/최다오답 기준이 50% 이상/미만과 다르게 작동함
학생별/반별/학년별 기존 출력이 깨짐
유형 카드가 기존 모드와 섞여 의미가 불명확함
단원 드래그 순서가 출력에 반영되지 않음
unitKey 없는 문항이 누락됨
마스터 매칭 실패 문항이 누락됨
모바일에서 카드/드래그 UI가 깨짐
권한 밖 학년/반 데이터가 노출됨
기존 렌더링 엔진 핵심 함수를 불필요하게 수정함
```

---

# 10. Codex 지시문

## 작업명

```text
APMS 오답 출력 센터 고도화 - Loop 0 마스터 단원 연결 검증
```

## 지시문

```text
APMS 오답 출력 센터 고도화를 위한 Loop 0 마스터 단원 연결 검증을 진행해줘.

이번 라운드는 코드 수정 금지다.
UI 구현, CSS 수정, DB 생성, API 추가 모두 금지다.

이미 깃에서 다음 파일 존재는 확인했다.

- docs/rules/JS아카이브_표준단원키_마스터테이블.md
- docs/rules/# JS아카이브 표준단원키 마스터 테이블.md
- archive/concept_map.js

이번 Loop 0의 목표는 “마스터 단원 기준을 새로 만들지 않고 기존 JS아카이브 표준단원키/ concept_map.js를 APMS 오답 출력 센터에서 재사용할 수 있는지” 검증하는 것이다.

확인할 것:

1. archive/concept_map.js의 실제 데이터 구조
2. 표준단원키, 단원명, 과목/course, 순서/order 필드 존재 여부
3. APMS의 exam_blueprints.standard_unit_key와 concept_map.js 단원키가 매칭 가능한지
4. clinic-print.js에서 생성하는 wrongItem.unitKey와 concept_map.js 단원키가 매칭 가능한지
5. 현재 wrongItem에 unitKey, unit, course, cluster가 들어가는 흐름
6. 단원별 오답 UI에서 마스터 단원 목록을 생성할 최소 경로
7. concept_map.js를 APMS 화면에서 직접 로드할지, 빌드된 별도 JSON/API adapter가 필요한지
8. 마스터에 없는 unitKey를 “기타 / 단원 미분류”로 처리할 방법
9. 단원 드래그 UI 구현 시 필요한 데이터 형태
10. 회귀 위험 파일과 함수

보고서 파일명:

CODEX_LOOP0_WRONG_PRINT_UNIT_MASTER_VERIFY.md

보고서에는 반드시 다음 결론을 포함해라.

- 기존 마스터 단원 데이터를 재사용 가능한가
- 재사용한다면 어떤 파일/필드를 기준으로 할 것인가
- APMS DB에 새 standard_units 테이블이 필요한가, 아니면 이번 라운드에서는 불필요한가
- 단원별 오답 드래그 UI 구현 전 필요한 최소 adapter는 무엇인가
- 다음 Loop 1에서 바로 UI 개편으로 들어가도 되는가

이번 라운드에서는 구현하지 말고, 검증 보고서만 제출해라.
```
