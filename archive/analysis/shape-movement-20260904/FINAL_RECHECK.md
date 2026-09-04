# 고1 「도형의 이동」 로컬 production 수정 최종 보고서

- 검수일: 2026-09-04 (Asia/Seoul)
- 기준 분모: H15 72문항 + H22 24문항 = 총 96문항
- production lane 판정: **PASS**
- Git fetch/pull/merge/checkout, commit, push: **실행하지 않음**

## 1. 수정 파일 수

- production JS: **27개**
- solution SVG: **81개**
- production 산출물 합계: **108개**
- 파생 question-index: `archive/question-index.js`, `archive/question-index-report.md`, `archive/question-index-audit.md` 재생성
- 재현 helper: `archive/tools/shape-movement-repair-20260904.mjs`

기존 working tree의 다른 변경은 보존했다.

## 2. 수정 문항 수

- 고유 수정 문항: **86개**
- solution SVG/참조 대상: 81개
- 세부단원 metadata: 51개
- 빈 tags: 10개
- 수학·해설 text: 2개(q19, q23)
- 중복 필드 수정은 문항을 한 번만 세었다.

## 3. 수학 수정 문항

- `21_효천고_2학기_중간_고1_기출 q19`
  - a=0: `y=2 → y=3 → x=3`, 교점 `(3,2)`는 y축 위가 아님
  - a≠0에서 형식적으로 a=1을 얻은 뒤 원식에 재대입
  - a=1이면 `l=l′=y=x+2`로 완전 중첩되어 고유 교점이 없음
  - `answer`를 `1`에서 `[정답불가]`로 변경
  - solutionImage에 a=0 예외와 완전 중첩을 실제 직선으로 반영
- `25_효천고_2학기_중간_고1_기출 q23`
  - 정답 순서쌍은 유지
  - 중심 통과 branch의 현이 지름이라는 필요조건 명시
  - 꼭짓점 거리 `√2|a−4|`에서 `|a−4|≥1` 도출
  - 다른 branch가 등호에서는 접하고 부등호에서는 원 밖이어서 추가 분할하지 않는 충분조건 확인

## 4. solution 수정 문항

- 21 효천고 2중간 q19: source defect를 명시한 무해답 해설
- 25 효천고 2중간 q23: 필요조건·충분조건을 순서대로 추적할 수 있도록 보강

content와 choices는 수정하지 않았다. q19는 명시된 source defect 때문에 answer만 `[정답불가]`로 바꾸었고, q23은 기존 answer를 유지했다.

## 5. metadata 수정 문항

- H15 `H15-SA-12-TRANSLATION / 평행이동`: **20개**
  - 22 금당고 1기말 q14; 22 매산고 1기말 q2; 22 복성고 1기말 q1; 23 강남여고 1기말 q7; 23 복성고 1기말 q6; 23 순천여고 1기말 q19; 24 매산고 1기말 q16,q19; 24 제일고 1기말 q11; 21 복성고 2중간 q3,q10; 21 효천고 2중간 q3; 22 효천고 2중간 q1; 23 금당고 2중간 q2,q7; 23 팔마고 2중간 q3,q7; 24 금당고 2중간 q1,q9; 21 제일고 2기말 q19
- H15 `H15-SA-12-REFLECTION / 대칭이동`: **25개**
  - 22 금당고 1기말 q1,q7; 22 매산고 1기말 q13; 23 복성고 1기말 q15,q18; 23 순천여고 1기말 q3; 24 매산고 1기말 q10,q18; 21 복성고 2중간 q4,q18,q22; 21 효천고 2중간 q5; 22 강남여고 2중간 q9,q23; 22 제일고 2중간 q1,q3,q5; 22 효천고 2중간 q13,q17; 23 금당고 2중간 q1,q12,q16,q18; 23 팔마고 2중간 q13,q20
- `23_매산여고_2학기_중간_고1_기출`: q11/q12 평행이동, q15 합성 변환, q16 대칭이동, q21 합성 변환
- `24_제일고_1학기_기말_고1_기출 q16`: 별도 C1 평행이동과 C2 대칭이동을 함께 쓰므로 scalar primary는 평행이동으로 두고 대칭이동은 tags와 visual에 보존
- 빈 tags: 23 강남여고 1기말 q7,q16; 23 순천여고 1기말 q3,q19; 25 순천여고 2중간 q6,q7,q15,q18; 25 제일고 2기말 q2,q6

## 6. SVG 수정 문항

지정된 81개 solution SVG를 실제 좌표·변환관계·대응점·원/직선/포물선/접선/대칭축에 맞춰 재생성했다. 대상은 다음과 같다.

- 22 금당고 1기말 q1,q7,q14,q16; 22 매산고 1기말 q2,q13; 22 복성고 1기말 q1,q9
- 23 강남여고 1기말 q7; 23 복성고 1기말 q14,q15,q18; 23 순천여고 1기말 q3,q19
- 24 매산고 1기말 q10,q16,q18,q19; 24 제일고 1기말 q11,q16,q18
- 21 복성고 2중간 q3,q4,q10,q11,q18,q22; 21 순천고 2중간 q1; 21 효천고 2중간 q5,q19
- 22 강남여고 2중간 q9,q23; 22 제일고 2중간 q1,q3,q5,q17; 22 효천고 2중간 q1,q13,q17
- 23 금당고 2중간 q1,q2,q7,q12,q16,q18; 23 매산여고 2중간 q11,q12,q15,q16,q21; 23 팔마고 2중간 q3,q7,q13,q20
- 24 금당고 2중간 q1,q9,q15; 21 제일고 2기말 q19; 21 효천고 2기말 q1
- 25 금당고 2중간 q5,q6,q13,q15,q20,q22; 25 효천고 2중간 q12,q13,q17,q18,q19,q23
- 25 매산고 2중간 q4,q8,q12; 25 순천고 2중간 q8,q15; 25 순천여고 2중간 q6,q18
- 25 제일고 2중간 q18; 25 제일고 2기말 q2,q6

공통 gate: Python 수치 검산 PASS, XML/viewBox/preserveAspectRatio/metadata/fact hash/유한좌표 **81/81 PASS**, SVG 내부 LaTeX 및 `<br>` 0건, EQUAL_UNIT, browser image 81/81·broken 0·horizontal overflow false.

25 금당고 2중간 q6의 사용자 요약 좌표 `(2,−5)+(3,1)=(5,−4)→(−4,5)`는 현재 production content/solution의 `(5,1)`, `(a,−3)`, `a=2`와 불일치한다. content를 역산해 변경하지 않고 현재 production source fidelity를 우선하여 SVG는 `(5,1)→(7,−2)→(−2,7)`을 표시했다.

## 7. 이미 정상이라 건드리지 않은 지정 문항

- `25_순천여고_2학기_중간_고1_공통수학2 q7`
- `25_순천여고_2학기_중간_고1_공통수학2 q15`

사용자 지시대로 두 정상 SVG는 변경하지 않았다. 빈 tags 지시 때문에 metadata(tags)만 보완했다.

## 8. 테스트 결과

- H1 production JS 112개: node --check **112/112 PASS**
- H1 production JS 112개: VM load·순차 ID **112/112 PASS**
- H15/H22 분모: **72/24/96 PASS**
- 지정 metadata 51개: compiled master key·label·parent 대조 **51/51 PASS**
- 지정 빈 tags 10개: **10/10 PASS**
- solutionImage path: **81/81 존재·비공백 PASS**
- 지정 27개 시험지 JS↔DB↔question-index: **27/27 PASS**, 합계 **593/593/593**
- question-index 전체: **10,980 questions**, source 10,980, duplicate qKey 0
- q19/q23 Python 독립 수학 검산: **PASS**
- browser solution SVG review: **81/81 loaded, broken 0**
- representative engine exam/sol/ans: H15 21 효천고, H15 23 매산여고, H22 25 효천고 모두 마지막 문항 표시·MathJax·broken image 0·overflow false

상세 브라우저 증거는 [browser_render_check.md](./browser_render_check.md)에 기록했다.

### 분리 기록한 strict-new WARN

`audit_archive_batch.mjs --strict-new`도 실행했다. production row의 JS load·indexed count·기본 오류는 없었다. 전체 `ok:false`는 production-only 범위 밖의 기존 generated candidate 불일치와 23 매산여고 q11/q12/q15/q16/q21 외 legacy subUnit 공란 때문이다. candidate 및 다른 정상/범위 밖 문항은 사용자 지시에 따라 수정하지 않았다.
