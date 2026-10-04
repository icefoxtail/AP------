# JS아카이브 `difficultyBucket` 5단계 운영규칙 v1.0

작성일: 2026-09-16  
대상: 코드검사실 / JS아카이브  
상태: **CANONICAL_CANDIDATE — 독립검수 및 채택 전**  
적용 대상: 기존 기출 JS 메타데이터 고도화 / 신규 candidate·production metadata / 향후 Archive 2.0 검색·자동출제·유사문제 난이도 조절  
비적용 대상: 문제 본문·보기·정답·해설·이미지 수정

---

# 0. 문서 목적

이 문서는 JS아카이브의 기존 3단계 난이도 `level`을 폐기하거나 대체하기 위한 문서가 아니다.

기존:

```text
level = 하 | 중 | 상
```

은 유지한다.

신규:

```text
difficultyBucket = 1 | 2 | 3 | 4 | 5
```

은 **기출 중심 문제은행에서 같은 `level` 내부의 난이도 차이를 더 세밀하게 구분하기 위한 내부 확장 메타데이터**다.

주 용도:

- Archive 2.0 Finder / Selector의 정밀 난이도 필터
- 자동 시험지 난이도 분포 구성
- 유사문제 난이도 상승·하강 추천
- 같은 L4 `problemType` 안에서 난이도 차이 구분
- 문항 부족(shortage) 판단
- 학생별 재출제 강도 조절

핵심 원칙:

> `difficultyBucket`은 기존 `level`보다 정밀한 내부 난이도이지만, 기존 `level`의 historical authority를 자동 폐기하지 않는다.

---

# 1. Authority 관계

본 문서가 채택되어 `LOCKED` 상태가 되면 `difficultyBucket`의:

- 허용값
- 단계 의미
- 4개 경계
- 판정 evidence
- blind 판정
- confidence
- boundary
- legacy level compatibility
- recheck
- production apply
- 자동출제 사용 gate

에 대한 **단일 canonical authority**가 된다.

다른 문서는 상세 기준을 복제하지 않고 본 문서를 참조한다.

기존 문서 역할:

- `JS아카이브룰북_v2.6`
  - `difficultyBucket`이 `level`을 대체하지 않는 확장 메타데이터임을 유지
- `JS아카이브_3차검수_프로토콜`
  - 기존 `level` 3단계의 독립 재판정 규칙을 유지
- `JS아카이브_세부단원_운영규칙`
  - `difficultyBucket`이 승인된 확장 필드임을 유지
- `JS아카이브_표준단원키_마스터테이블`
  - 자동출제·유사문제에서 사용하는 보조 난이도 필드라는 역할을 유지
- Metadata Foundation v2
  - L1~L4 분류와 본 5단계 난이도를 한 번의 문항 판독에서 병행 적용

---

# 2. 절대 원칙

1. `difficultyBucket`은 반드시 `1|2|3|4|5` 중 하나로 판정한다.
2. `difficultyBucket`은 기존 `level`을 단순 변환하여 생성하지 않는다.
3. 최초 판정에서는 기존 `level`과 기존 `difficultyBucket`을 숨긴다.
4. 문제를 직접 읽고, 필요한 경우 보기·시각자료·공통자료·검수 완료 solution을 함께 본다.
5. **계산량만으로 난이도를 올리거나 내리지 않는다.**
6. **solution 길이·문장 수·친절함 자체를 난이도 근거로 쓰지 않는다.**
7. 객관식/서술형 형식만으로 난이도를 올리거나 내리지 않는다.
8. 학교명·시험지의 전반적 난이도·문항 번호만으로 판정하지 않는다.
9. L1/L2/L3/L4 분류가 다르다는 이유만으로 난이도를 자동 결정하지 않는다.
10. RPM 확장 유형이라는 이유만으로 난이도를 자동 상향하지 않는다.
11. 난이도 분포를 예쁘게 맞추기 위해 문항을 강제로 다른 bucket으로 이동하지 않는다.
12. 기존 `level`과 충돌했다고 즉시 기존 `level`을 수정하지 않는다.
13. 경계 문항은 강제로 한쪽 논리를 만들어내지 말고 `boundaryFlag`와 confidence로 표시한다.
14. 문항 source structure가 바뀌지 않았는데 검수자 취향만으로 bucket을 반복 변경하지 않는다.
15. taxonomy/difficulty 작업으로 `content`, `choices`, `answer`, `solution`, `image`, `layoutTag`, `wide`를 수정하지 않는다.

---

# 3. Canonical 5단계

## Bucket 1

기존 level 대응:

```text
1 → 하
```

정의:

> 핵심 개념·공식·절차가 문제를 읽는 즉시 사실상 결정되고, 조건 해석이나 전략 선택 부담이 매우 낮은 직접 적용형.

대표 특징:

- 핵심 개념 1개 직접 적용
- 공식/정의/기본 성질을 바로 사용
- 풀이 방향 선택 거의 없음
- 조건 해석이 단순
- 계산 또는 추론 1~2개의 직선적 단계
- 보기 함정이 거의 없음
- 기본 확인형 기출

Bucket 1이 아닌 경우:

- 계산이 짧더라도 숨은 조건 해석이나 사고 전환이 핵심이면 1이 아니다.
- 짧게 풀리는 발상형 문제는 1이 아니다.

---

## Bucket 2

기존 level 대응:

```text
2 → 중
```

정의:

> 기본~표준 초입의 기출로, 한 번의 조건 해석이나 익숙한 변형이 필요하지만 사용할 풀이법 자체는 쉽게 결정되는 문제.

대표 특징:

- 사용할 개념·전략은 익숙하고 명확
- 조건 한 번 해석
- 간단한 식 변형 또는 전처리
- 2개 개념이 등장해도 결합 방식이 직접적
- 계산이 다소 길 수 있으나 전략 선택 부담은 작음
- 학생이 “무엇을 해야 하는지”는 비교적 바로 알 수 있음

---

## Bucket 3

기존 level 대응:

```text
3 → 중
```

정의:

> 일반적인 내신 표준·중간 변별 문제로, 조건 사이 관계를 파악하고 표현·식·접근 중 적절한 풀이 방향을 한 번 이상 선택해야 하는 문제.

대표 특징:

- 조건 관계 파악 필요
- 둘 이상의 개념이 실제로 결합
- 식/그래프/도형/경우 분류 중 접근 선택 필요
- 전형적인 유형 안이지만 단순 대입으로 끝나지 않음
- 함정 보기 또는 조건 재확인이 있을 수 있음
- 학습한 표준 유형 안에서 충분히 예상 가능한 구조

Bucket 2와의 핵심 차이:

> `방법이 바로 결정되는가`가 아니라 `풀이 방향을 한 번 선택해야 하는가`.

---

## Bucket 4

기존 level 대응:

```text
4 → 상
```

정의:

> 준고난도·상위권 변별 문제로, 복합 조건을 구조화하거나 비정형 변형·경우 분기·범위·정수조건·존재성 판단 등을 풀이 중심부에서 처리해야 하는 문제.

대표 특징:

- 복합 조건
- 비정형 변형
- 여러 단계 구조화
- 경우 분기
- 범위 조건
- 정수/자연수 조건이 핵심
- 존재성·가능성 판단
- 조건을 다시 적용하거나 후보를 제거
- 상위권 변별에 실제로 작동

Bucket 5와의 차이:

> 어렵지만 **학습된 고난도 패턴과 구조화로 접근할 수 있는가**.

---

## Bucket 5

기존 level 대응:

```text
5 → 상
```

정의:

> 최고난도 기출군으로, 결정적인 관찰·발상·구조 재구성이 없으면 풀이가 시작되지 않거나 중간 진행이 사실상 막히는 문제.

대표 특징:

- 표면에서 접근법이 잘 드러나지 않음
- 결정적 insight 필요
- 조건의 숨은 의미를 재구성
- 익숙한 고난도 패턴의 단순 조합만으로 해결되지 않음
- 발상 이후 계산은 짧을 수도 있음
- 시험에서 최상위권 변별에 해당

Bucket 5 금지 휴리스틱:

- 계산이 길다 → 5 아님
- 문항 번호가 마지막이다 → 5 아님
- 서술형이다 → 5 아님
- 교사가 어렵다고 느낀다 → 5 아님
- 여러 개념이 나온다 → 그것만으로 5 아님

---

# 4. 4개 경계 규칙

단계 설명보다 **경계 규칙을 우선**한다.

---

## 4.1 `1 ↔ 2`

핵심 질문:

> 문제를 읽자마자 사용할 개념·식·절차가 사실상 결정되는가?

### 1 쪽

```text
문제 읽기
→ 사용할 개념/공식 즉시 결정
→ 직접 적용
→ 답
```

### 2 쪽

```text
문제 읽기
→ 조건 한 번 해석 또는 식 정리
→ 익숙한 방법 적용
→ 답
```

경계 판정 포인트:

- 조건을 단순히 숫자로 치환하는 정도는 1 가능
- 조건의 의미를 한 번 변환해야 하면 2 고려
- 계산량만 늘어난 1을 2로 자동 승격하지 않는다

---

## 4.2 `2 ↔ 3`

핵심 질문:

> 익숙한 풀이 틀을 그대로 적용하면 되는가, 학생이 풀이 방향을 선택해야 하는가?

### 2 쪽

```text
조건 파악
→ 사용할 방법이 바로 결정
→ 실행
→ 답
```

### 3 쪽

```text
조건 관계 파악
→ 어떤 표현/식/전략을 쓸지 선택
→ 실행
→ 조건 재확인
→ 답
```

핵심:

> **전략 선택 여부**가 가장 중요한 기준이다.

계산량 차이는 2↔3의 primary 기준이 아니다.

---

## 4.3 `3 ↔ 4`

핵심 질문:

> 표준적인 개념 결합으로 해결되는가, 비정형 사고 전환·복합조건 구조화가 필요한가?

### 3 쪽

- 전형적 내신 표준
- 학습한 유형 안에서 예상 가능한 접근
- 조건 해석과 개념 결합이 있으나 비정형성이 낮음

### 4 쪽

- 조건을 구조화해야 함
- 직접 적용되지 않는 형태를 변환
- 경우/범위/정수/존재성 중 하나 이상이 풀이 중심
- 조건을 여러 번 다시 적용
- 상위권 변별

---

## 4.4 `4 ↔ 5`

핵심 질문:

> 어렵지만 익숙한 고난도인가, 결정적 발상이 없으면 진행 자체가 어려운가?

### 4 쪽

```text
복합 조건
→ 익숙한 고난도 구조로 정리
→ 여러 단계 추론/분기
→ 답
```

### 5 쪽

```text
표면 접근이 막힘
→ 결정적 관찰/발상
→ 문제 구조 재구성
→ 이후 계산/추론
→ 답
```

핵심:

> `decisiveInsight`가 실제 필수인가.

짧게 풀려도 결정적 발상이 강하면 5 가능.

---

# 5. Curriculum-relative 원칙

난이도는 **해당 교육과정·과목·학습 단계에서 요구되는 인지 부담**을 기준으로 판정한다.

금지:

- 중1 bucket 5와 미적분II bucket 5를 절대 수학 난도로 직접 비교
- 고등 개념이라는 이유로 중등보다 자동 상향
- RPM 확장 유형이라는 이유로 자동 상향

허용:

- 같은 과목/단원 안에서 난이도 상대 비교
- 같은 L4 내부에서 변형 복잡도 차이 비교
- 해당 교육과정 학생에게 필요한 전략 선택·발상 부담을 기준으로 비교

---

# 6. Evidence 우선순위

난이도 판정 입력:

1. `content`
2. `choices`
3. 필요한 시각자료
4. shared material
5. 검수 완료 `solution`
6. curriculum / course / L1 context

## solution 사용 원칙

solution은 난이도 판정의 강한 evidence다.

이유:

- 필수 조건 정리
- 실제 풀이 전략
- 경우 분기
- 숨은 제약
- 결정적 발상
- 계산/추론 구조

가 문제 표면보다 명확히 드러날 수 있다.

하지만 다음은 금지한다.

```text
해설이 길다 → 어렵다
해설이 짧다 → 쉽다
설명이 친절하다 → 단계가 많다
```

판정 대상은 **solution의 문장 수가 아니라 필수 풀이 구조**다.

---

# 7. Solution Structure Extraction

first-pass에서 바로 숫자만 고르지 않고, 필요한 경우 내부 sidecar에 풀이 구조를 먼저 기록한다.

권장 필드:

```text
questionUid
conceptCount
conditionInterpretation
strategyChoice
nonRoutineTransformation
caseBranching
rangeConstraint
integerConstraint
existenceCheck
decisiveInsight
executionBurden
difficultyBucket
confidence
boundaryFlag
```

권장 의미:

- `conceptCount`: 실제 결합되는 핵심 개념 수
- `conditionInterpretation`: low / medium / high
- `strategyChoice`: 풀이 방향 선택 필요 여부
- `nonRoutineTransformation`: 비정형 변형 필요 여부
- `caseBranching`: 경우 분기 필요 여부
- `rangeConstraint`: 범위 조건이 핵심인지
- `integerConstraint`: 정수/자연수 조건이 핵심인지
- `existenceCheck`: 존재성·가능성 판단 필요 여부
- `decisiveInsight`: 결정적 발상 없이는 진행이 막히는지
- `executionBurden`: 계산·대수 실행 부담

최종 bucket은 단순 점수 합산으로 정하지 않는다.

```text
축별 evidence
+
지배적 난도 요소
+
4개 경계 규칙
=
difficultyBucket
```

---

# 8. Blind First-Pass

최초 판정 시 다음을 숨긴다.

```text
기존 level
기존 difficultyBucket
이전 reviewer verdict
이전 difficulty 사유
```

보여주는 것:

```text
문제
보기
필요한 visual
shared material
검수 완료 solution
curriculum/course/L1 context
```

순서:

```text
evidence 읽기
→ solution structure 추출
→ bucket 판정
→ confidence / boundary 판정
→ first-pass 결과 freeze
```

**freeze 전에 기존 level을 공개하지 않는다.**

---

# 9. Confidence

허용값:

```text
high
medium
low
```

## high

다음에 대부분 해당:

- 문제/해설/시각자료 evidence가 충분
- 특정 bucket 정의와 명확히 일치
- 인접 bucket보다 한 단계가 우세
- 핵심 풀이 구조에 해석 불확실성이 거의 없음

## medium

다음 중 하나:

- 특정 bucket이 우세하지만 인접 bucket도 일부 합리적
- 난도 요소가 서로 다른 방향으로 작용
- solution은 충분하지만 경계성이 존재
- 같은 유형 내 변형 정도가 판단에 영향을 줌

## low

다음 중 하나:

- 인접 두 bucket을 안정적으로 구분하기 어려움
- solution 또는 필수 visual evidence가 불완전
- 풀이가 여러 전략으로 가능하여 핵심 부담을 확정하기 어려움
- source/solution 불일치 의심
- curriculum/context 귀속이 불명확

운영:

- `low`는 자동 확정 금지
- `medium + boundaryFlag`는 recheck 대상
- `high`라도 strong legacy conflict면 recheck 대상

---

# 10. Boundary Flag

허용값:

```text
NONE
B12
B23
B34
B45
```

의미:

- `B12`: 1↔2 경계
- `B23`: 2↔3 경계
- `B34`: 3↔4 경계
- `B45`: 4↔5 경계

원칙:

- boundary는 실패가 아니다.
- 경계 문항을 감추기 위해 confidence를 억지로 high로 올리지 않는다.
- 재검 후에도 인접 양쪽이 합리적이면 기존 확정값 또는 adjudication값을 유지하고 `BORDERLINE_ACCEPTABLE`을 기록할 수 있다.

---

# 11. 기존 `level`과 compatibility

기본 expected mapping:

| difficultyBucket | expected legacy level |
|---:|---|
| 1 | 하 |
| 2 | 중 |
| 3 | 중 |
| 4 | 상 |
| 5 | 상 |

## 11.1 정상

```text
level 하 + bucket 1
level 중 + bucket 2
level 중 + bucket 3
level 상 + bucket 4
level 상 + bucket 5
```

## 11.2 인접 경계 충돌 — REVIEW

아래는 자동 오류로 확정하지 않고 경계 재검한다.

```text
level 하 + bucket 2
level 중 + bucket 1
level 중 + bucket 4
level 상 + bucket 3
```

조건:

- 실제로 해당 legacy level 경계가 합리적인 경우에만 허용
- `compatibilityStatus = BORDERLINE_REVIEW`
- 근거 기록 필요

## 11.3 Strong conflict

아래는 strong conflict로 재검한다.

```text
level 하 + bucket 3
level 하 + bucket 4
level 하 + bucket 5

level 중 + bucket 5

level 상 + bucket 1
level 상 + bucket 2
```

원칙:

- strong conflict = 신규 bucket이 틀렸다는 뜻이 아니다.
- strong conflict = 기존 level이 틀렸다는 뜻도 아니다.
- 반드시 independent recheck 후 adjudication한다.

기존 level 수정은 **별도 승인된 명백한 오분류만** 수행한다.

---

# 12. 기존 level 안정화 규칙과의 관계

기존 통합 프로토콜의 `LEVEL BORDERLINE STABILITY LOCK`을 유지한다.

즉:

- `하↔중`
- `중↔상`

모두 합리적으로 설명 가능한 기존 level 경계 문항을 검수자 취향만으로 반복 수정하지 않는다.

신규 `difficultyBucket` 도입은 이 규칙을 무효화하지 않는다.

다만 신규 bucket은 더 세밀한 정보이므로:

```text
level 중
difficultyBucket 2
```

와

```text
level 중
difficultyBucket 3
```

을 서로 다른 내부 난이도로 정상 허용한다.

같은 방식으로:

```text
level 상
difficultyBucket 4
```

와

```text
level 상
difficultyBucket 5
```

도 정상 허용한다.

---

# 13. Same-type Outlier Review

같은 L4 `problemType` 또는 신뢰 가능한 동일 `templateKey` 문항의 bucket 차이가 비정상적으로 크면 재검한다.

기본 review trigger:

```text
동일 problemType / template인데 bucket 차이 >= 2
```

단, 이것은 자동 FAIL 규칙이 아니다.

다음이 실제로 다르면 2단계 이상 차이도 가능하다.

- 조건 복잡도
- 경우 분기
- 정수/범위 제약
- 비정형 변형
- 결정적 발상
- 복합 개념 결합

목표는 분포를 평준화하는 것이 아니라 **이상치를 다시 읽게 만드는 것**이다.

---

# 14. Anchor 운영

Anchor는 모델이 작업 중 난이도 기준을 잃지 않게 하는 기준 문항이다.

## 14.1 Anchor 종류

가능한 경우:

```text
Bucket 1 대표
1/2 경계
Bucket 2 대표
2/3 경계
Bucket 3 대표
3/4 경계
Bucket 4 대표
4/5 경계
Bucket 5 대표
```

모든 L1에 9종을 억지로 만들지 않는다.

실제 문항 분포에 없는 난이도는 만들지 않는다.

## 14.2 Anchor 범위

기본:

- course 수준 공통 anchor
- 실제 L1 작업에서는 해당 L1의 local anchor를 함께 사용

Anchor는:

- reviewed_pass
- evidence 충분
- 분류와 난이도 모두 안정
- source 구조 변경 없음

이어야 한다.

## 14.3 금지

- 특정 bucket 수를 맞추기 위한 가짜 anchor
- 문항 번호나 학교명으로 anchor 선택
- 아직 conflict가 남은 문항을 anchor로 사용

---

# 15. Calibration

전수 migration 전에 rubric을 실제 production 문항에서 검증한다.

Metadata Foundation v2의 기본 calibration 방식:

> 실제 L1 대단원 2~3개를 calibration 겸 production candidate 작업으로 사용한다.

서로 성격이 다른 L1을 선택한다.

예:

- 대수형
- 함수/도형형
- 확률/미적분형

정확한 L1은 fresh production inventory 후 결정한다.

Calibration 확인 항목:

- 1↔2 흔들림
- 2↔3 흔들림
- 3↔4 흔들림
- 4↔5 흔들림
- 기존 level strong conflict
- same-type outlier
- 세션/batch drift
- confidence 규칙 실효성

Calibration PASS 후:

```text
DIFFICULTY_RUBRIC = FROZEN
```

이후 작업 중 임의 변경 금지.

---

# 16. 작업 단위와 Drift 방지

기본 작업 단위:

```text
L1 대단원 1개
```

L1이 너무 크면 L2 2~3개 묶음으로 분할할 수 있으나, 같은 L1을 연속 완료한 뒤 다음 L1로 간다.

매 작업 시작 시 반드시 본 문서의 다음을 다시 로드한다.

- bucket 1~5 정의
- 4개 경계
- blind rule
- confidence
- boundary
- compatibility
- 금지 휴리스틱

금지:

```text
“이번 단원은 원래 어려우니 전체를 한 단계 높이자”
“bucket 1이 너무 적으니 일부 2를 1로 내리자”
“5가 너무 적으니 가장 어려운 몇 문제를 5로 올리자”
```

분포는 결과이지 목표가 아니다.

---

# 17. Batch 처리

L1 내부에서 모델 입력이 너무 커질 경우 adaptive batch를 허용한다.

고정 `20문항` 또는 `30문항` 자체를 authority로 두지 않는다.

batch 결정 기준:

- content/solution token량
- visual/shared material 비율
- 문항 복잡도
- 예상 출력량

각 batch는 같은 rubric/anchor를 사용한다.

L1 종료 전 반드시 전체 batch를 합친 후:

- bucket 분포
- 경계 분포
- confidence
- same-type outlier
- legacy conflict

를 L1 단위로 다시 검사한다.

---

# 18. Independent Recheck 대상

전체 문항을 무조건 2회 전수판정하지 않는다.

다음만 독립 재검한다.

1. `confidence = low`
2. `boundaryFlag != NONE`
3. strong legacy conflict
4. same-type outlier
5. first-pass와 existing metadata의 강한 의미 충돌
6. source/solution 불일치 의심
7. 필수 visual/shared material 해석이 난이도에 직접 영향을 미치는 경우
8. adjudication reviewer가 필요하다고 표시한 경우

재검에서도 해결되지 않으면:

```text
manual_review
```

또는 명시 HOLD로 남긴다.

억지로 숫자를 채우지 않는다.

---

# 19. Production Apply

## 19.1 반영 가능한 항목

승인 후 production metadata에는 최소:

```text
difficultyBucket
tagConfidence
tagStatus
reviewStatus
```

를 반영할 수 있다.

필요한 audit sidecar에는:

```text
difficultyBoundaryFlag
compatibilityStatus
difficultyReason
structureEvidence
reviewer
```

등을 보존할 수 있다.

## 19.2 금지

difficulty migration으로 다음을 수정하지 않는다.

```text
content
choices
answer
solution
image
layoutTag
wide
```

source fingerprint가 문항 내용 변경 때문에 달라지면 작업 범위 위반이다.

## 19.3 기존 level

기존 level은 자동 재작성하지 않는다.

명백한 mismatch만:

```text
LEGACY_LEVEL_REVIEW_CANDIDATE
```

로 별도 queue에 넣는다.

기존 level 수정은 별도 검수/승인 후 수행한다.

---

# 20. `tagConfidence` / `tagStatus`와의 관계

기존 허용 상태:

```text
existing
auto_high
auto_medium
auto_low
manual_review
reviewed_pass
reviewed_fail
```

difficultyBucket도 동일 운영 원칙을 따른다.

## 자동추천·자동출제 사용 가능

기본 허용:

```text
reviewed_pass
```

기존 정책에서 허용된 신뢰도 높은 `auto_high` 사용은 migration 단계에서 별도 engine gate가 명시된 경우에만 허용한다.

Metadata Foundation v2 전수 migration의 최종 목표는:

```text
difficultyBucket + reviewed_pass
```

상태다.

## 사용 금지

```text
auto_low
manual_review
reviewed_fail
```

은:

- 자동 유사문제 추천
- 자동 시험지 구성
- 학생 자동 재출제

에서 제외한다.

---

# 21. Archive 2.0 사용 Gate

Archive 2.0은 본 5단계 난이도 contract가 `LOCKED` 되고 calibration이 PASS된 후 사용한다.

미분류 문항:

```text
difficultyBucket = UNKNOWN
```

으로 안전하게 취급한다.

금지:

- UNKNOWN을 UI에서 임의 추정
- legacy `level`을 신규 bucket으로 자동 변환하여 정답처럼 사용
- manual_review를 자동출제에 사용
- bucket 분포를 맞추기 위해 런타임에서 임의 보정

향후 가능한 사용:

```text
1~2 중심
2~3 중심
3~4 중심
4~5 중심
정확히 bucket 3
bucket 4 이상
```

구체적인 자동출제 비율은 전체 distribution을 본 뒤 별도 설계한다.

---

# 22. 신규 문항 운영

신규 candidate에서 difficultyBucket을 생성하는 권장 시점:

```text
문제/정답 검산 완료
→ solution 작성·검수
→ L1~L4 분류
→ difficultyBucket blind 판정
→ 3차 metadata 검수
→ reviewed_pass
→ production
```

즉 solution이 없는 상태에서 난이도를 확정하는 것을 기본 경로로 하지 않는다.

필수 visual이 있는 문항은 visual 확인 없이 bucket 확정 금지.

---

# 23. 3차 검수 통합 규칙

향후 3차 검수는 난이도를 두 층으로 본다.

```text
A. legacy level
B. difficultyBucket
```

A와 B는 같은 필드가 아니다.

3차에서 확인:

- current level
- level 적정성
- current difficultyBucket
- recommended difficultyBucket
- confidence
- boundary
- legacy compatibility
- adjudication required
- tagStatus

기존 level 판단 기준은 기존 3차 프로토콜을 유지한다.

difficultyBucket 상세 판정은 본 문서를 따른다.

---

# 24. 보고서 권장 형식

## `reports/difficulty_review.csv`

권장 컬럼:

```text
questionUid,
sourceArchiveFile,
sourceOrdinal,
L1,
L2,
L3,
L4,
current_level,
blind_bucket,
confidence,
boundary_flag,
compatibility_status,
recheck_bucket,
final_bucket,
tag_status,
review_status,
reason
```

## L1 Closeout

```text
L1:
총 문항:

bucket 1:
bucket 2:
bucket 3:
bucket 4:
bucket 5:

confidence high:
confidence medium:
confidence low:

boundary B12:
boundary B23:
boundary B34:
boundary B45:

legacy normal:
legacy borderline:
legacy strong conflict:

recheck:
resolved:
HOLD:

final reviewed_pass:
manual_review:

판정:
PASS / FAIL
```

---

# 25. Validation Gate

L1 적용 전후 최소 확인:

```text
denominator before == denominator after
UID cardinality 유지
difficultyBucket ∈ {1,2,3,4,5} 또는 explicit UNKNOWN/HOLD
불법 문자열 bucket = 0
blind first-pass ledger 존재
compare가 first-pass freeze 이후 수행됨
low confidence 재검 또는 HOLD
boundary 재검 또는 BORDERLINE_ACCEPTABLE
strong conflict 전수 adjudication
reviewed_pass / manual_review 상태 구분
source content fingerprint mutation = 0
```

분포 자체에는 PASS 비율을 강제하지 않는다.

---

# 26. 금지 휴리스틱 총정리

아래 하나만으로 bucket을 판정하지 않는다.

- 풀이 줄 수
- 해설 글자 수
- 계산량
- 객관식/서술형
- 문항 번호
- 학교 이름
- 시험지 평균 난도
- 정답률을 모르는 상태에서 “어려워 보임”
- 도형이 있음
- 함수가 있음
- 정수조건이라는 단어가 있음
- L4 이름이 ‘활용’임
- RPM_EXTENDED임
- 기존 level
- 기존 reviewer verdict

반드시 실제 필수 풀이 구조를 본다.

---

# 27. Foundation Defect 처리

작업 도중 현 rubric 자체의 재현 가능한 결함이 발견되면 현재 L1 작업 안에서 규칙을 즉석 수정하지 않는다.

기록:

```text
FOUNDATION_DEFECT_CANDIDATE
```

필수 내용:

```text
재현 문항
현 규칙 적용 결과
왜 모순이 생기는지
영향 범위
제안 수정
```

별도 검수·승인 후에만 본 문서를 revision한다.

경미한 취향 차이로 버전업하지 않는다.

---

# 28. Adoption Gate

본 문서를 `LOCKED`로 승격하기 전 최소 조건:

1. 기존 룰북의 `difficultyBucket은 level 대체가 아니다`와 충돌 없음
2. 기존 3차 level 규칙과 충돌 없음
3. 기존 `LEVEL BORDERLINE STABILITY LOCK`을 무효화하지 않음
4. `tagConfidence/tagStatus` 운영 원칙과 충돌 없음
5. Metadata Foundation v2 taxonomy contract와 충돌 없음
6. 독립 검수 PASS 또는 승인 가능한 핀포인트 수정 완료
7. calibration L1 작업 전에 canonical 위치 확정

채택 후 다른 문서는 난이도 5단계 상세 규칙을 복제하지 않고 본 문서를 참조한다.

---

# 29. 최종 운영 요약

```text
기존 level
하 / 중 / 상
= 유지

신규 difficultyBucket
1 / 2 / 3 / 4 / 5
= 내부 정밀 난이도 authority

compatibility
1 → 하
2,3 → 중
4,5 → 상

판정
문제 + 보기 + visual/shared + 검수된 solution
→ 구조 추출
→ blind bucket
→ freeze
→ 기존 level compare
→ conflict/boundary 재검
→ reviewed_pass

자동출제
reviewed_pass 중심
manual_review / auto_low / reviewed_fail 제외

핵심
분포를 맞추지 말고 실제 풀이 부담을 분류한다.
```

---

# 30. 다음 단계

본 문서 독립검수 및 채택 후:

1. `Metadata Contract v2` 작성
2. 기존 룰북 / 3차검수 / 세부단원 운영규칙 / 표준단원키 마스터 / 통합운영프로토콜에 참조 관계 반영
3. fresh production inventory
4. calibration L1 2~3개
5. rubric freeze
6. L1 대단원 단위 전수 migration

---

## STATUS

```text
DOCUMENT:
JS아카이브_difficultyBucket_5단계_운영규칙_v1.0.md

STATE:
CANONICAL_CANDIDATE

LEGACY_LEVEL:
PRESERVED

DIFFICULTY_BUCKET:
1|2|3|4|5

MAPPING:
1→하
2,3→중
4,5→상

PRODUCTION_MIGRATION:
NOT_STARTED

NEXT:
INDEPENDENT_REVIEW
→ ADJUDICATION
→ LOCK
→ Metadata Contract v2
```
