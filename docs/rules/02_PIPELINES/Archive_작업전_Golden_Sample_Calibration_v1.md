# Archive 작업 전 Golden Sample Calibration v1

- 적용일: 2026-09-28
- 상태: ACTIVE
- 적용 범위: Archive 2.0 / JS Archive의 분석·제작·수정·검수·해설·조판·SVG·Meta·난이도·출시 전 품질작업
- 목적: 정본 규칙만 읽고 바로 작업하지 않고, 현재 main의 고품질 실물과 알려진 실패 실물을 먼저 보아 품질 눈높이를 고정한다.

---

## 0. 최상위 원칙

Golden Sample은 **품질 calibration reference**다. source truth, answer, solution truth, taxonomy, difficulty, Meta authority를 대체하지 않는다.

권위 순서:

```text
사용자 현재 명시 지시
→ 현재 Notion 라우터/생명주기
→ 최신 Git main의 canonical rules/data
→ target source / verified solution / actual artifact
→ Golden / Negative Sample calibration
```

샘플과 정본이 충돌하면 **정본과 target truth가 우선**한다.
샘플의 결함을 복제하지 않는다.

---

## 1. Archive 공통 START GATE

Archive 작업은 실제 생성·수정·검수에 들어가기 전에 아래 순서를 따른다.

```text
1. GPT 작업 전 필독 라우터 / Archive 시작 페이지 / 현재 lifecycle 확인
2. 기존 inventory / ledger / checkpoint 복원
3. 최신 origin/main + 해당 작업 canonical rules 확인
4. GOLDEN SAMPLE CALIBRATION
5. NEGATIVE SAMPLE CALIBRATION
6. 실제 target 작업 시작
```

단순 파일 이동·브랜치 정리·기계적 manifest 재생성처럼 학생 노출 품질과 무관한 작업은
`EXAM_SAMPLE_NOT_APPLICABLE`로 기록할 수 있다. 이 경우에도 동일 종류의 안전한 reference implementation/test가 있으면 먼저 확인한다.

---

## 2. Golden Sample 선택 규칙

작업과 가장 가까운 고품질 실물을 **2~3개** 고른다.

우선순위:

1. 같은 학년/과목
2. 같은 학기·시험 유형
3. 같은 단원/문항 구조
4. 같은 작업 종류(해설 / SVG / 조판 / 검수 / Meta evidence 등)
5. 최신년도 우선
6. latest main 또는 독립검수·repair가 끝난 current artifact 우선

전체 시험지를 무조건 정독할 필요는 없다.
작업에 직접 관련된 대표 문항 **2~5개씩**을 먼저 읽어 품질 눈높이를 맞춘다.
단, 시험지 전체 구성·밀도·일관성이 작업 핵심이면 시험지 전체를 본다.

샘플을 그대로 복사하거나 좌표·문장·풀이를 template처럼 기계 재사용하지 않는다.

---

## 3. Calibration 축

### 해설
- 학생이 실제로 재현할 수 있는 중간식 수
- 경우분리/조건정리의 명확성
- 작은칠판에서 한눈에 읽히는 줄바꿈과 판서 밀도
- 교육과정·학생용 언어
- 불필요한 장황함과 내부 작업용 표현의 부재

### SVG / visual
- 도형 비율과 정보 밀도
- 각도/길이/점 라벨의 대상 귀속
- label collision / clipping 0
- 외심·내심·중점·평행·수직·등거리 등 텍스트 주장과 실제 좌표 기하의 일치
- 학생이 해설의 결정 단계를 그림에서 즉시 찾을 수 있는지

### 문항 조판
- source text exact parity
- grid / 2up 판단
- problem image 크기·배치
- 보기·표·소문항 가독성
- 답안 공간의 실제 충분성

### 검수 evidence
- denominator가 먼저 고정되어 있는지
- 실제 확인한 축과 미실행 축이 분리되어 있는지
- PASS 근거가 최종 bytes/SHA와 결속되는지
- 수정 후 영향 범위 재검이 닫혀 있는지

---

## 4. Blind → Compare 보호 규칙

Golden Sample pre-read가 독립 의미 판정을 오염시키면 안 된다.

### 먼저 샘플을 봐도 되는 작업
- 해설 제작/업그레이드
- SVG/visual 제작
- 조판/레이아웃 제작
- 학생용 표현/가독성 개선
- evidence 형식·보고 품질 calibration

### target 의미 판정을 먼저 blind로 동결해야 하는 작업
- 정답·수학 검수
- difficulty fresh 판정
- L3/L4 / RPM / Meta semantic 판정
- CrossConcept 판정
- 독립 REVIEW의 실제 PASS/FAIL 판정

이 경우 순서는:

```text
target source + required authority만 읽음
→ blind decision freeze
→ 그 뒤 Golden/Negative Sample과 비교
→ 품질/일관성 차이만 보정
```

샘플의 정답·difficulty·Meta key를 target 판정의 힌트로 사용하지 않는다.

---

## 5. Negative Sample 규칙

Golden Sample만 보면 같은 유형의 false PASS를 반복할 수 있으므로,
관련 작업에는 알려진 실패 실물도 최소 **1~2개** 먼저 본다.

Negative Sample은 “이렇게 만들지 말라”는 regression fixture이며,
발견된 새 false PASS는 원인이 일반화 가능하면 이 문서 또는 해당 domain rule에 추가한다.

### CURRENT visual negative regression set — 2026-09-28

1. `24_신흥중_2학기_중간_중2_수학 q5`
   - 각도 값은 맞지만 실제 꼭짓점/각 영역 귀속 실패
2. `25_삼산중_2학기_기말_중2_기출 q12`
   - 점 라벨과 길이 라벨 실제 충돌
3. `25_삼산중_2학기_중간_중2_수학 q13`
   - D의 각도값이 D에서 떨어져 owner가 모호함
4. `25_삼산중_2학기_중간_중2_수학 q24`
   - “외심/수직이등분선” 텍스트와 실제 SVG 좌표 기하 불일치

이 네 건은 visual 생성·검수에서 최소 regression fixture로 사용한다.

---

## 6. 초기 Golden Sample Pool

아래는 **품질 calibration 후보**이며 semantic authority가 아니다.
새 결함이 확인되면 즉시 demote하고 registry를 갱신한다.

### 2025 고1 2학기 중간

- `archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js`
  - 작은칠판 해설 밀도·전개·중간식 calibration
- `archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js`
  - visual을 적극 사용하는 시험지의 SVG/해설 결합 calibration
- `archive/exams/original/high/h1/2mid/25_순천여고_2학기_중간_고1_기출.js`
  - 독립검수/repair 이력이 있는 solution·visual precision calibration
- `archive/exams/original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js`
  - 학생용 표현·visual 정밀도·검수 후 최소수정 calibration

한 작업에서 네 개를 모두 읽을 필요는 없다.
현재 target과 가장 가까운 **2~3개**만 선택한다.

SVG 개수가 많다는 이유만으로 Golden Sample이 되지 않는다.
“많이 그린 시험지”보다 **정확하고 읽기 좋은 시험지**를 우선한다.

---

## 7. 작업 증거 최소 기록

장시간/정식 작업에서는 최소 다음을 evidence/ledger 또는 작업 로그에 남긴다.

```text
goldenSampleRefs
negativeSampleRefs
calibrationAxes
sampleReadBeforeWork = true | false
blindDecisionFrozenBeforeCompare = true | false | NOT_APPLICABLE
calibrationStatus = PASS | NOT_APPLICABLE
```

Notion에는 상세 전문이 아니라 사용한 sample refs, calibration 완료 여부, 필요 시 demotion/새 regression만 짧게 기록한다.

---

## 8. Sample 승격 / 강등

### Golden 승격 조건
- latest main 또는 current reviewed artifact
- known open student-facing defect 0
- 해당 품질축을 대표할 만큼 충분한 완성도
- 필요 시 독립검수/targeted render evidence 존재

### Golden 강등 조건
- false PASS 발견
- source/solution identity mismatch
- 학생 노출 결함 발견
- current canonical과 충돌
- 더 나은 최신년도 sample로 대체

강등된 sample은 삭제하지 않고 필요하면 Negative Sample로 전환한다.

---

## 9. 최종 원칙

```text
RULES GIVE CONSTRAINTS.
GOLDEN SAMPLES SET THE QUALITY BAR.
NEGATIVE SAMPLES PREVENT REPEAT FAILURES.
TARGET TRUTH REMAINS INDEPENDENT.
```

Archive는 “규칙을 위반하지 않는 결과”에서 끝내지 않는다.
**현재 최고 품질 실물을 보고 눈높이를 맞춘 뒤, 그 수준 이상으로 target을 완성하는 것**을 기본 작업 방식으로 한다.
