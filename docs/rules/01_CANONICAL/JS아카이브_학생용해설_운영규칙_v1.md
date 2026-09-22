# JS아카이브 학생용 해설 운영규칙 v1

- 적용일: 2026-09-23
- 상태: ACTIVE
- 적용 대상: 신규 `solution` 생성, 기존 production JS 학생용 해설 업그레이드, 해설 품질 검수
- 비적용: L1/L2/L3/L4/CrossConcept/Condition의 canonical 정의·승격, SVG 제작 수치 규칙, source repair 자체

---

## 0. 권위와 목적

이 문서는 **학생에게 실제로 노출되는 `solution`의 내용·표현·계산 전개·가독성·업그레이드 판정**에 대한 canonical authority다.

권위 관계:

1. 사용자의 현재 명시 지시
2. `COMMON_PROTOCOL_v1.2.10.md`의 source/math/pedagogy/real-render HARD gate
3. 본 문서
4. `해설프로토콜.md`, `JS_문항품질_업그레이드.md`, `수정프로토콜.md`, review 문서의 실행 세부

하위 문서의 과거 예시가 본 문서와 충돌하면 본 문서를 따른다.

> **학생용 해설은 ‘작은 칠판’이다. 선생님이 옆에서 판서하듯 문제를 처음부터 끝까지 따라갈 수 있어야 한다.**

---

## 1. 학생 재현 가능성 HARD GATE

학생이 문제와 최종 해설만 보고 다음을 재현할 수 있어야 한다.

`문제 해석 → 개념 선택 → 식 설정 → 계산 전개 → 조건 적용 → 경우 분리 → 결론`

다음 중 하나라도 해당하면 `STUDENT_REPRODUCIBLE_FAIL`이다.

- 핵심 중간식이 빠져 다음 식이 갑자기 등장함
- ‘계산하면’, ‘정리하면’, ‘공식에 대입하면’ 한마디로 결정적인 2단계 이상 계산을 건너뜀
- 조건을 사용했지만 어느 식에 어떻게 적용했는지 보이지 않음
- 경우를 나누어야 하는데 경우별 계산 또는 탈락 이유가 없음
- 결과는 맞지만 풀이 논리의 결정적 연결이 빠짐
- 설명은 길지만 실제 계산 전개가 없음
- 계산식만 나열되어 왜 그 식을 세우는지 알 수 없음

설명과 계산은 서로를 대체하지 않는다.

- 한국어 문장: 왜 이 식을 세우는지, 어떤 개념을 쓰는지, 다음 단계의 목적을 설명
- 수식: 실제 변형·대입·정리·범위 결정·경우 분리·결론을 보여 줌

---

## 2. 기존 production 해설의 UPGRADE GATE

기존 production JS 해설 업그레이드는 **무조건 재작성하지 않는다.** 대상 시험지의 모든 문항을 읽되 문항별 disposition을 다음 셋 중 하나로 기록한다.

- `KEEP`: 기존 해설이 정확하고 교육과정에 맞으며 학생 재현 가능성과 렌더 가독성을 이미 만족
- `UPGRADE`: 객관적으로 개선할 결함이 확인됨
- `HOLD`: source/정답/수학/시각자료 충돌 등으로 안전한 수정이 불가능

`KEEP`은 미작업이 아니다. 기존 해설이 충분하다는 판정과 근거가 있는 정상 결과다.

`UPGRADE`는 최소 하나 이상의 명확한 개선 근거가 있어야 한다.

권장 reason code:

- `MATH_ERROR`
- `LOGIC_JUMP`
- `CALCULATION_OMISSION`
- `CONDITION_USAGE_OMISSION`
- `CASE_SPLIT_OMISSION`
- `CURRICULUM_TERM`
- `NONSTUDENT_LANGUAGE`
- `ENGLISH_PROSE`
- `LINEBREAK_READABILITY`
- `RENDER_OVERFLOW`
- `VISUAL_SOLUTION_MISMATCH`

단순히 문장을 더 길게 쓰거나 문체를 바꾼 것은 업그레이드 근거가 아니다.

### 2.1 이전보다 좋아져야 한다

수정 문항은 baseline solution과 final solution을 비교한다.

`UPGRADE_PASS` 최소 조건:

- 기존에 확인된 결함이 실제로 해소됨
- 기존의 맞는 수학 내용과 유효한 풀이 단계가 사라지지 않음
- answer와 최종 결론이 유지·일치
- 새로운 교육과정 밖 개념이나 불필요한 용어가 추가되지 않음
- 계산 전개와 학생 재현성이 같거나 좋아짐
- 줄바꿈과 화면 가독성이 같거나 좋아짐
- 실제 `sol` 렌더에서 신규 clipping/overflow/MathJax 파손이 없음

객관적 개선이 없으면 재작성하지 않고 `KEEP`한다.

---

## 3. 판서형 계산 전개

해설은 선생님이 칠판에 쓰듯 **식의 변화가 위에서 아래로 추적**되어야 한다.

예:

```text
2x+3=9
2x=6
x=3
```

부등식·범위 조건도 실제 계산을 보여 준다.

```text
b=2-|4-a|

|b|≤4 이므로
-4≤2-|4-a|≤4

왼쪽 부등식에서
-6≤-|4-a|
|4-a|≤6
```

규칙:

- 결정적인 식 변형·대입·범위 정리는 중간 단계를 생략하지 않는다.
- 여러 값을 대입해야 하면 필요한 대입 과정을 실제로 적는다.
- 정수·자연수·양수·음수·범위 조건이 해 선택에 영향을 주면 그 적용 과정을 보여 준다.
- 경우 분리는 각 경우를 별도 흐름으로 보여 주고 채택·탈락 이유를 적는다.
- 정답을 먼저 알고 역산하여 풀이를 구성하지 않는다.
- 고난도라고 식을 압축하지 않는다.

---

## 4. 별도 검산 문단 금지

학생용 `solution`에는 풀이 종료 후 별도의 검산 단계나 검수 흔적을 넣지 않는다.

금지 예:

- `검산:`
- `확인:`을 별도 코너처럼 두고 답을 다시 대입하는 구성
- `대입하여 확인하면`을 정답 도출 뒤 별도 검산 단계로 추가
- `내부 검산 완료`
- `모델 검산 완료`
- `정답 오류 없음`

단, **문제 풀이 자체에서 필요·충분성을 증명하거나 후보를 걸러야 하는 과정은 본풀이**이므로 생략하지 않는다. 이 경우 검산이라고 부르지 않고 그 논리를 결정 단계에서 직접 설명한다.

독립 수학 검증자는 answer/solution을 blind solve 뒤 대조할 수 있지만, 그 내부 검증 과정은 학생용 `solution`에 노출하지 않는다.

---

## 5. 교육과정 용어와 학생용 언어

학생용 해설의 용어는 Meta Foundation의 `EDUCATIONAL_TERMINOLOGY_LOCK` 원칙을 따른다.

우선순위:

1. 해당 교육과정의 공식 용어
2. 교과서·학교 수학에서 통용되는 표현
3. 승인된 canonical 한국어 라벨

L3/L4/CrossConcept는 학생에게 key를 보여 주는 용도가 아니다.

- L3: 해설에서 명확히 설명해야 할 핵심 문제 유형·전략을 찾는 기준
- L4: 반복되는 결정적 풀이 골격과 단계 누락을 찾는 기준
- CrossConcept: 주개념 밖에서 실제 결정 단계에 필요한 추가 개념을 빠뜨리지 않는 기준
- Condition/IntegrationPattern: 조건 적용과 경우 분기의 누락을 찾는 보조 기준

금지:

- `problemTypeKey`, `templateKey`, `CC_*` 같은 내부 key 노출
- `branch`, `case`, `step`, `point`, `line`, `range`, `vertex`, `center`, `slope`, `intercept` 등 불필요한 영어 설명어
- 개발자·엔진·모델 내부 표현
- 번역투 때문에 학생이 교과서 개념과 연결하기 어려운 표현

수학 기호와 표준 표기인 `x`, `y`, `A`, `B`, `O`, `sin`, `log` 등은 영어 설명어 문제로 보지 않는다.

영어 표현은 기계적으로 일괄 치환하지 않는다. 실제 문맥을 읽고 교육과정 안의 자연스러운 한국어 표현으로 바꾼다.

---

## 6. 줄바꿈·가독성 HARD RULE

줄바꿈은 디자인 장식이 아니라 학생 재현성과 렌더 안정성의 일부다.

- 한 문단에는 한 가지 핵심 생각만 둔다.
- 설명에서 계산으로 넘어갈 때 줄을 바꾼다.
- 풀이 단계가 바뀌면 줄을 바꾼다.
- 연속된 등호·부등호 계산은 학생이 한 단계씩 따라갈 수 있게 나눈다.
- 경우 1 / 경우 2처럼 흐름이 갈리면 별도 문단으로 나눈다.
- 결론은 앞 계산과 구분하여 명확히 보이게 한다.
- 긴 순서쌍·해집합·조건 목록은 화면 폭을 넘지 않도록 의미 단위로 나눈다.
- 긴 MathJax inline 한 덩어리를 만들지 말고 독립 수식 블록으로 분리한다.

JS `solution` 문자열의 줄바꿈은 실제 소스 개행이 아니라 `\n` escape를 사용한다.

줄바꿈을 만들기 위해 계산이나 문장을 삭제하지 않는다.

---

## 7. 구조는 자연스럽게, 고정 라벨은 강제하지 않는다

`[키포인트]`, `조건 정리:`, `풀이 방향:`, `정석 풀이:` 같은 고정 라벨은 필수 필드가 아니다.

필요하면 사용할 수 있지만, 최종 해설은 자연스러운 판서 흐름을 우선한다.

학생이 화면에서 다음 순서를 자연스럽게 읽을 수 있으면 된다.

`무엇을 보는가 → 왜 이 식인가 → 실제 계산 → 조건/경우 → 결론`

정답만 있는 짧은 해설도 실패이고, 라벨만 많고 계산이 빈 해설도 실패다.

---

## 8. 보호 필드와 수정 범위

해설 업그레이드 단계의 기본 target field는 `solution`이다.

기본 보호:

- `content`
- `choices`
- `answer`
- `image`
- L1/L2/L3/L4/CrossConcept/Condition/difficulty 등 완료된 metadata

해설 검토 중 보호 필드의 별도 결함을 발견하면 조용히 함께 수정하지 않는다. 별도 defect/HOLD로 기록하고 해당 수정 authority를 따른다.

기존 `solutionImage`/SVG가 해설과 명백히 충돌하면 `VISUAL_SOLUTION_MISMATCH`로 기록한다. 4단계 로드맵의 해설 단계에서는 시각자료의 대규모 재제작을 시작하지 않는다.

---

## 9. 4단계 업그레이드 프로그램과의 관계

현재 장기 업그레이드 순서는 다음과 같다.

1. 메타데이터 업데이트
2. 해설 업그레이드
3. SVG 툴 업그레이드
4. SVG 전체 업그레이드

따라서 2단계에서 완료된 metadata는 **읽기 전용 개념 기준**으로 사용하며 해설 작업 때문에 다시 분류하지 않는다.

2단계에서는 시각자료 필요성과 mismatch를 inventory할 수 있지만, 신규·대규모 SVG 제작은 3단계 툴 qualification 이후 4단계에서 수행한다. 단, 사용자가 특정 blocking visual defect의 즉시 수리를 별도로 지시한 경우는 예외다.

`SOLUTION_TEXT_UPGRADE_PASS`는 2단계 checkpoint이며 전체 4단계 프로젝트의 Final Seal과 동의어가 아니다. 기존 Common Protocol의 visual/real-render HARD gate를 약화하지 않는다.

---

## 10. 문항별 물리 evidence

시험지별 전수 작업은 먼저 denominator를 고정하고 item-level ledger를 물리 파일로 남긴다.

최소 필드:

```text
filePath
questionUid / id
beforeSolutionHash
disposition = KEEP | UPGRADE | HOLD
upgradeReasons[]
primaryMethod
decisiveSteps[]
curriculumTerms[]
calculationOmissions[]
languageIssues[]
linebreakIssues[]
afterSolutionHash
protectedFieldDiffStatus
solutionRenderStatus
upgradeGateStatus
```

`UPGRADE`인데 before/after와 개선 근거가 없으면 완료가 아니다.

---

## 11. 시험지 한 장 완료 게이트

한 시험지는 다음을 모두 만족해야 해설 업그레이드 checkpoint를 닫을 수 있다.

- 전체 문항 denominator 확정
- 모든 문항 `KEEP / UPGRADE / HOLD` 판정
- `UPGRADE` 문항은 기존보다 개선됐다는 delta evidence 존재
- 핵심 계산·조건·경우 분리 생략 없음
- 교육과정 밖 핵심 풀이 0
- 불필요한 영어·운영 표현 0
- 학생용 별도 검산 문단 0
- 긴 수식/정답열의 가독성·overflow 문제 0
- 보호 필드 무단 변경 0
- 최종 `exam / sol / ans` 실제 렌더
- 후반 문항·마지막 페이지·MathJax·이미지 decode 확인

HOLD가 있으면 그 이유와 다음 필요한 자료를 남기고 전체 Final PASS로 닫지 않는다.

---

## 12. 첫 calibration 순서

4단계 프로그램의 해설 단계는 **메타데이터가 완료된 고1 2학기 과정**부터 시작한다.

초기 calibration은:

- 2025년 고1 2학기 중간고사 시험지
- 시험지 한 장씩 완결
- 한 장의 baseline 전체 판독 → KEEP/UPGRADE/HOLD → 수정 → 실렌더 → 이전 대비 UPGRADE GATE

순서로 수행한다.

첫 시험지의 실제 결과를 보고 본 문서의 문구가 너무 강하거나 약한 부분이 있으면 **근거가 있는 canonical revision**으로만 수정한다. 시험지 작업 중 임의로 기준을 바꾸지 않는다.

---

## 13. 절대 금지

- 기존 solution을 읽지 않고 일괄 재작성
- 문항 수만 맞추고 전수 판독했다고 주장
- 정답에 맞춘 역산 풀이
- 학생용 solution에 검산/운영 메모 삽입
- 내부 영어·분석 용어 노출
- 가독성을 이유로 계산 단계 삭제
- `KEEP` 가능한 정상 해설을 스타일 취향으로 재작성
- 렌더 실패를 validation 완화로 숨기기
- 해설 단계에서 완료된 metadata를 다시 임의 수정
- 전체 4단계가 끝나지 않았는데 해설 checkpoint를 전체 업그레이드 Final Seal로 표현

---

## 14. 한 줄 정본

> **좋은 학생용 해설은 선생님의 작은 칠판처럼, 교육과정 안의 정확한 말과 생략 없는 계산을 적절한 줄바꿈으로 보여 주며, 기존 production을 수정할 때는 반드시 이전보다 실제로 좋아져야 한다.**
