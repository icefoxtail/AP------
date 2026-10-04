# Archive 작업 전 Golden Sample Calibration v1

## CURRENT HARD RULE — 2026-10-03 — RECHECK PREFLIGHT ORDER

모든 REVIEW/repair worker의 calibration과 재검 순서는 다음으로 고정한다.

```text
stage assignment / selector
→ Golden Sample 2~3 + related Negative Sample
→ CALIBRATION_PREFLIGHT PASS
→ target + prior solution/verdict/checkpoint/repair를 필요 시 함께 읽을 수 있음
→ source/current authority에서 required scope 재계산·재판정
→ recheck decision snapshot 고정
→ prior 결과와 formal compare
→ final quality compare
→ validator / receipt / stage close
```

- 기존 `blindDecisionSha`, `blindFreezeSha256`, `blindDecisionFrozenBeforeCompare` 필드명은 schema/history 호환용으로 유지할 수 있다. **비노출 증명이 아니라 recheck decision snapshot 식별자**다.
- prior detail이 snapshot 전에 보였다는 이유로 attempt를 INVALID 처리하지 않는다.
- worker/thread를 contaminated로 취급하지 않고, fresh one-shot reviewer/task를 요구하지 않는다.
- prior PASS/FAIL, 기존 solution, 기존 Meta/difficulty 값은 **비교 자료**일 뿐 재검 evidence의 decision authority가 아니다.
- automation role/schedule/recovery는 `02_PIPELINES/JS_Archive_Automation_Stable_Operating_Contract_v1.md` 최신 main이 authority다.
- `solution-calibration-gate.mjs`의 sampleReadBeforeWork/calibration evidence 요구는 유지하되, target prior visibility를 FAIL 사유로 사용하지 않는다.

## CURRENT OVERRIDE — 2026-10-01 — ALL JS QUALITY WORKER START GATE

이 calibration은 더 이상 CREATE/solution production 전용이 아니다. **학생 노출 JS의 해설·solutionImage/SVG·문항 품질을 생성·수정·검수·승인하는 모든 worker의 공통 START GATE**다.

적용 worker:
- CREATE
- R1 / R2 / R3
- 기존 production solution upgrade
- REVIEW 내부 PASS_AFTER_REPAIR
- targeted repair / pinpoint repair
- post-R3 Codex R3 repair
- FINAL ITEM RECOVERY
- SVG/solutionImage add/repair/rebuild
- Codex/GPT 재검
- 예약/FLEX rescue가 위 역할을 대신 수행하는 경우

고정 순서:
```text
stage assignment / open scope 확인
→ Golden Sample 2~3 + 관련 Negative Sample 실제 판독
→ CALIBRATION_PREFLIGHT PASS
→ target-specific recheck/baseline/defect-scope 작업
→ 수정 또는 판정
→ Golden quality floor와 final/changed scope compare
→ 해당 stage close
```

**재검은 prior context를 가리는 절차가 아니다.** 외부 Golden/Negative는 작업 전에 읽어 품질 눈높이를 통일하고, target의 기존 solution·이전 reviewer verdict·repair answer도 볼 수 있다. 단, 최종 판정 근거는 source/current authority에서 다시 계산한 current-pass evidence여야 하며 prior 값을 정답처럼 복사하지 않는다.

모든 preflight는 sample별 대표 문항 2~5개의 `solutionSha256 + solutionExcerpt + observation`까지 실제 bytes와 결속한다. 공통 5축은 `STUDENT_REPRODUCIBILITY / SMALL_BOARD_STRUCTURE / EXPLANATION_DENSITY / VISUAL_SEMANTIC_PARITY / VISUAL_READABILITY`다.

repair/recovery worker는 아래 공용 gate를 target mutation 전에 통과한다.
```bash
node archive/tools/solution-calibration-gate.mjs --exam <js> --evidence <calibration.json> --stage REPAIR --preflight
```
stage는 실제 역할에 따라 `REPAIR / R3_REPAIR / ITEM_RECOVERY / VISUAL_REPAIR / INDEPENDENT_RECHECK`를 사용한다.


## CURRENT HARD GATE — 2026-10-01 — SOLUTION QUALITY CALIBRATION PHYSICAL BINDING

해설을 **생성·재작성·업그레이드·승인**하는 모든 JS Archive 작업은 Golden Sample calibration을 권고가 아니라 stage-close **HARD GATE**로 적용한다. 수동 GPT/Codex, 예약 CREATE/R1/R2/R3, 기존 production solution upgrade에 예외가 없다.

- NEW/SOURCE-ONLY 및 fresh-rewrite CREATE: target source/answer로 fresh solution을 먼저 동결 → Golden/Negative Sample을 실제 판독 → target 품질 보강. 기존 solution이 없으면 찾거나 억지로 참고하지 않는다.
- 기존 production SOLUTION UPGRADE: current solution baseline 확인 → 수학 정합성 확인 → Golden/Negative Sample calibration → 부족 문항 upgrade.
- R1/R2/R3: Golden/Negative preflight를 완료하고 target을 source/current authority에서 재검해 decision snapshot을 만든다. Sample의 정답·Meta·difficulty를 target의 semantic authority로 복사하지 않으며 final quality floor compare를 수행한다.
- solution을 생성·수정·승인하지 않는 순수 Meta-only/Git/manifest 작업만 `EXAM_SAMPLE_NOT_APPLICABLE` 가능. 이 경우 해설 품질 PASS/SOLUTION_COMPLETE를 새로 선언할 수 없다.

`JS_ARCHIVE_PHYSICAL_REVIEW_EVIDENCE_v1.solutionQualityCalibration` 최소 필드:
```text
goldenSampleRefs                  # 2~3개, path + sha256 + gitBlobSha
goldenSampleQuestionRefs          # sample별 대표 2~5문항, path + qid + solutionSha256 + observation
negativeSampleRefs                # path + sha256 + gitBlobSha
calibrationAxes
sampleReadBeforeWork=true
qualityCompareCount=N/N
calibrationStatus=PASS
solutionWorkMode
calibrationOrder
```

필수 quality axes는 최소 `STUDENT_REPRODUCIBILITY / SMALL_BOARD_STRUCTURE / EXPLANATION_DENSITY`다. `500자 이상`, `10줄 이상` 같은 길이 규칙은 금지한다. 파일명만 본 것은 calibration이 아니며 대표 문항의 실제 solution SHA까지 현재 파일 bytes와 결속한다.

`archive/tools/review-evidence-gate.mjs`가 위 evidence를 물리 검증한다. Golden Sample 2~3개, sample별 대표 solution 2~5문항, target 전체 `qualityCompareCount=N/N`, 그리고 `archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md`가 결속되지 않으면 solution-bearing DONE/PASS는 FAIL-closed다.


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

## 4. 재검 → Compare 보호 규칙

Golden Sample은 quality bar이며 target의 정답·Meta·difficulty를 대신 결정하는 authority가 아니다.

### 먼저 샘플을 보는 작업
- 해설 제작/업그레이드
- SVG/visual 제작
- 조판/레이아웃 제작
- 학생용 표현/가독성 개선
- evidence 형식·보고 품질 calibration
- R1/R2/R3 및 repair/recheck

### semantic 재검이 필요한 작업
- 정답·수학 검수
- difficulty current-pass 재검
- L3/L4 / RPM / Meta semantic 판정
- CrossConcept 판정
- REVIEW의 실제 PASS/FAIL 판정

```text
Golden/Negative Sample preflight
→ target + prior artifact를 필요 시 함께 읽음
→ source/current authority에서 target required scope 재계산·재판정
→ recheck decision snapshot 고정
→ prior artifact와 formal compare
→ Golden quality floor와 final compare
→ 품질/일관성 차이만 보정
```

샘플이나 prior artifact의 정답·difficulty·Meta key를 그대로 target 판정으로 복사하지 않는다. prior visibility는 허용되지만 **decision provenance는 source/current authority + current-pass calculation**이어야 한다.

기존 `blindDecisionFrozenBeforeCompare` 등 blind 계열 marker는 호환용 snapshot marker이며 fresh session/non-exposure를 요구하지 않는다.

## 5. Negative Sample 규칙

### CURRENT cross-axis negative regression set — 2026-10-01 복성고1

CREATE/R1/R2/R3의 학생용 해설 품질 calibration에서는
`archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md`를 우선 Negative Sample로 읽는다.

이 fixture는 한 시험지가 CREATE → R1 → R2 → R3 FAIL → R1 FULL → R2 FULL을 거친 뒤에도 direct R3에서 다시 발견된 false PASS다.

반드시 잡아야 하는 family:
- **SVG actual geometry:** q1/q3/q7/q8/q20 — 라벨 문구는 맞지만 실제 primitive 좌표/기울기/접점/곡선이 solution fact와 불일치
- **small-board structure:** q2/q17 — ㄱ/ㄴ/ㄷ 판정을 실제 block으로 분리하지 않았는데 N/N PASS
- **Meta null-but-resolvable:** q4/q11/q21 — exact ACTIVE mapping이 있는데 null
- **runtime/source escape:** q2/q7/q20 — source code를 훑는 것만으로 놓친 doubled TeX escape

이 세트는 별도 파일럿이 아니다. **현재 production CREATE/R1/R2/R3가 즉시 재발 방지해야 하는 HARD regression fixture**다.
`22/22`, `14/14` 같은 자기보고 count가 있어도 실제 physical evidence가 없으면 이 fixture를 통과한 것으로 보지 않는다.

Golden Sample만 보면 같은 유형의 false PASS를 반복할 수 있으므로,
관련 작업에는 알려진 실패 실물도 최소 **1~2개** 먼저 본다.

Negative Sample은 “이렇게 만들지 말라”는 regression fixture이며,
발견된 새 false PASS는 원인이 일반화 가능하면 이 문서 또는 해당 domain rule에 추가한다.

### CURRENT visual negative regression set — 2026-09-29

> **Negative Sample authority (2026-09-29 incremental audit):** 이번 53개 solution SVG 증분감사에서 false PASS로 확인된 5개 실패본은 `archive/fixtures/visual-negative-regressions/2026-09-29/README.md`와 같은 폴더의 frozen SVG를 사용한다. 현재 production `archive/assets/images/...`의 대응 SVG는 commit `0efb9a41c445ac31dd4444b7daaca250e0eacca7`에서 수리된 정상본이다. **실패본과 수리본을 반드시 쌍으로 비교**하고, 실패본을 production으로 복원하지 않는다.

1. `25_왕운중_2학기_중간_중2_수학 q7` — `MISSING_OWNER_RAY`
   - 풀이가 `△BDC`와 B·C의 30°를 사용하지만 실패 SVG에는 **선분 BC 자체가 없었다**.
   - 각도 숫자와 텍스트가 맞더라도 그 각을 이루는 두 ray/side가 실제 artifact에 존재하지 않으면 PASS가 아니다.
2. `25_왕운중_2학기_중간_중2_수학 q21` — `ANGLE_LABEL_OWNER_BINDING`
   - 마름모의 `x°`, `58°`가 해당 꼭짓점의 실제 angle wedge 밖/반대쪽에 놓여 owner가 모호했다.
   - **각도값 정확성 ≠ 각도 라벨 귀속 정확성**이다. `vertex + ray1 + ray2` 안쪽에 학생이 즉시 귀속할 수 있게 배치한다.
3. `25_왕운중_2학기_중간_중2_수학 q24` — `COORDINATE_SEMANTIC_PARITY`
   - D/E가 각각 AB/AC 위의 수선의 발이어야 하나 실패 SVG 좌표에서는 **D/E가 해당 변 위에 있지 않았고 MD/ME도 수직 조건을 만족하지 않았다**.
   - 수선발·중점·외심·내심·무게중심 등 수학적 명칭은 실제 좌표 기하로 검증한다.
4. `24_향림중_2학기_기말_중2_기출 q8` — `COORDINATE_SEMANTIC_PARITY`
   - 텍스트는 AD와 BE가 각의 이등분선이고 `DE ∥ AB`라고 설명했지만, 실패 SVG의 BE 좌표는 **∠B의 실제 이등분선이 아니었다**.
   - 여러 기하 조건이 동시에 주어지면 일부만 맞춘 스케치를 PASS하지 말고 **모든 조건의 동시 성립**을 좌표로 확인한다.
5. `24_향림중_2학기_기말_중2_기출 q12` — `LABEL_OWNER_BINDING`
   - `CG=10` 라벨이 실제 선분 CG가 아닌 반대쪽 중선 부근에 놓여 길이 owner를 오독하게 했다.
   - 길이 라벨은 `ownerSegment`에 실제로 붙어 있어야 하며, 다른 선분과의 거리/충돌까지 확인한다.

**2026-09-29 추가 하드 체크:** visual 생성·검수 시 `MISSING_OWNER_RAY / ANGLE_LABEL_OWNER_BINDING / LABEL_OWNER_BINDING / COORDINATE_SEMANTIC_PARITY` 네 축을 관련 문항에서 명시적으로 확인한다. 특히 “텍스트상 맞음”이나 “대충 비슷한 그림”만으로 PASS하지 않는다.

### CURRENT visual negative regression set — 2026-09-28
> **Negative Sample authority (2026-09-28 repair closure):** 아래 4건의 실패본은 `archive/fixtures/visual-negative-regressions/2026-09-28/README.md`와 같은 폴더의 frozen SVG를 사용한다. 현재 production `archive/assets/images/...` SVG는 정상 수리본이며 Negative Sample authority로 사용하지 않는다.


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
