# Archive GPT Artifact-First Lightweight v1

- 적용 시점: **중3 생산 라인부터**
- 상태: ACTIVE / CURRENT RECERTIFICATION
- 적용 대상: JS Archive 정상 시험지 CREATE / REVIEW1 / REVIEW2 / FINAL handoff
- 비적용: 공통 generator/validator 개발, 대량 migration, 전역 Meta/Foundation 수술, 시스템 파이프라인 구현
- current certification generation: `MIDDLE_RECERT_2026-09-29_V1`

---

## CURRENT — 중등 current-generation 재인증 HARD RULE

2026-09-29 형님 지시로 다음 134시험지는 과거 stage를 면제권으로 사용하지 않고 **현재 품질 기준으로 전면 재인증**한다.

- M3 전체 69
- M1 전체 31
- M2 1학기 중간 16 + 1학기 기말 18 = 34
- 현재 이미 진행 중인 M2 2학기 고정 20은 본 재인증 reset 대상이 아니며 기존 current REVIEW/BATCH/FINAL 흐름을 그대로 완주한다.

재인증 scope의 모든 시험지는 반드시 다음 current-generation 경로를 새로 통과한다.

```text
CURRENT CREATE
→ CURRENT REVIEW1
→ CURRENT REVIEW2
→ BATCH / FINAL
→ MAIN
```

과거 `CREATE_DONE`, `REVIEW1_DONE`, legacy R2/R2E, 과거 main 반영, 예전 solution/SVG 존재는 **현재 세대 CREATE/REVIEW 면제 근거가 아니다.** 과거 결과는 baseline/reference로만 재사용한다.

`CREATE_DONE 이상이면 skip`, `기존 R1 완료면 승계` 같은 문구는 본 scope에서 **같은 `certificationGeneration=MIDDLE_RECERT_2026-09-29_V1`의 durable receipt + final artifact SHA 일치가 있을 때만** 성립한다. generation 필드가 없거나 다른 generation이면 legacy/history로 취급하고 해당 current stage를 다시 수행한다.

CURRENT CREATE는 기존 해설 검수/보수 단계가 아니다. **모든 문항의 `solution`을 기존 solution 품질과 무관하게 새로 작성한다. 기존 solution KEEP은 금지한다.** 먼저 source/content/choices/answer를 고정하고, 기존 solution을 초안·문장 재사용·판정 기준으로 사용하지 않은 채 source + answer만으로 학생용 작은칠판 solution을 독립 작성한다. 결정적 중간식·경우분리·이유·결론을 학생이 그대로 따라갈 수 있게 현재 교육과정과 학생언어로 작성한다. 새 solution을 완성한 뒤에만 기존 solution을 source truth/계산 사실 누락 여부를 확인하는 비교 참고로 사용할 수 있다. 발문/보기/정답은 source exact를 보존하고, QUESTION MICRO_LAYOUT과 solution 조판, SVG/solutionImage 필요성·정확성은 새 solution 기준으로 다시 판정한다.

CURRENT CREATE receipt에는 반드시 `solutionRewrite=FULL_ALL_QUESTIONS`와 `solutionRewriteCount=N/N`을 기록한다. 이 marker나 전수 문항수 evidence가 없으면 current-generation CREATE_DONE이라도 **해설 전면 재작성 계약 관점에서는 미완**이다.

현재 REVIEW는 REVIEW1 + REVIEW2 두 번의 FULL 독립검수다. 이미 CURRENT CREATE가 완료됐더라도 위 full-rewrite marker가 없는 시험지는 CREATE 큐를 되감지 않는다. **REVIEW1이 전 문항 solution 전면 재작성 catch-up을 수행해 같은 branch에서 닫고, REVIEW2가 그 결과를 처음 보는 것처럼 전 문항 수학·solution·작은칠판·SVG를 독립 재검하여 남은 결함을 직접 수정한다.** REVIEW1 catch-up receipt에는 `solutionRewriteCatchup=FULL_ALL_QUESTIONS`와 문항수 evidence를 남긴다. REVIEW2는 CREATE 또는 REVIEW1 중 하나의 full-rewrite evidence를 확인하되 상세 verdict는 선입력으로 읽지 않는다. 이 catch-up 규칙은 M3 69 → M1 31 → M2 1학기 34에 적용하며, reset 예외인 M2 2학기 고정 20에는 소급 전면재작성 의무를 추가하지 않는다. 향후 반복 SVG false PASS 등 구체적 품질 근거가 누적되면 형님 지시에 따라 REVIEW3를 추가할 수 있으나, 문서 작업자가 임의로 review 횟수나 예약 cadence를 바꾸지 않는다.

---

## CURRENT — QUESTION-LEVEL HOLD ONLY / EXAM HOLD FORBIDDEN

형님 2026-09-29 명시 지시를 HARD RULE로 적용한다. CREATE/REVIEW에서 발견된 불확실성이나 결함의 HOLD 단위는 **항상 개별 문항 `questionUid/qid`**다. **시험지 전체 HOLD·BLOCK·격리는 절대 금지**한다.

`EXAM FLOWS / ITEM HOLDS TRAVEL / FINAL PUBLISH REQUIRES itemHoldCount=0`을 고정한다.

금지 상태/행동:
- `EXAM_HOLD`, `CREATE_BLOCKED`, `REVIEW1_BLOCKED`, `REVIEW2_BLOCKED`
- 시험지 전체 `SOURCE_REVIEW`
- 문항 결함 하나 이상을 이유로 시험지 branch 전체를 quarantine하고 다음 REVIEW 진입을 막는 행위
- CREATE의 1차 판단을 최종 source/math 판정처럼 고정하는 행위

허용되는 미해결 상태는 문항별 `ITEM_HOLD`뿐이다. reason code는 `SOURCE_HOLD`, `MATH_HOLD`, `ENGINE_CAPABILITY_BLOCK`, `SOURCE_ASSET_MISSING` 등 실제 원인을 기록한다. visual-only 결함은 기존 SVG NO-HOLD 규칙대로 가능한 경우 같은 단계에서 repair한다.

단계 전이:
- CREATE: 해결 가능한 결함은 즉시 수정한다. 해결 불가 문항만 item hold로 남기고 `CREATE_DONE_WITH_ITEM_HOLDS → READY_FOR_REVIEW1_WITH_ITEM_HOLDS`로 넘긴다.
- REVIEW1: CREATE의 hold 결론을 신뢰하지 않고 전체 문항과 held item을 처음부터 독립 검수한다. 해결되면 hold를 제거하고, 남으면 `REVIEW1_DONE_WITH_ITEM_HOLDS → READY_FOR_REVIEW2_WITH_ITEM_HOLDS`로 넘긴다.
- REVIEW2: 다시 독립 재판정한다. 남으면 `REVIEW2_DONE_WITH_ITEM_HOLDS`로 stage 완료를 기록하고 held UID만 `ITEM_RECOVERY_QUEUE`로 보낸다. 시험지 전체 HOLD를 만들지 않는다.
- BATCH/FINAL: item hold가 남은 시험지를 그 실행에서 건너뛰되 다른 시험지는 계속 처리한다. 해당 시험지는 item recovery가 끝나 `itemHoldCount=0`이 되면 `READY_FOR_COMMIT`으로 승격한다.
- authority/connector/Git write 실패는 콘텐츠 HOLD가 아니라 `AUTHORITY_WRITE_PENDING` 같은 운영 상태다.

각 item hold 최소 기록: `questionUid/qid`, `reason`, `observedEvidence`, `unresolvedPoint`, `nextRequiredEvidenceOrCapability`, `createdStage`, `lastReviewedStage`.

CURRENT full-solution-rewrite와의 결합:
- item hold가 0이면 기존 `solutionRewrite=FULL_ALL_QUESTIONS`, `solutionRewriteCount=N/N`을 그대로 사용한다.
- item hold가 있으면 held item 때문에 시험지 전체 CREATE를 실패시키지 않는다. `solutionRewriteAttempted=N/N`, `solutionRewriteResolved=(N-H)/N`, `itemHoldQuestionIds=[...]`를 기록하고 다음 REVIEW로 진행한다.
- REVIEW1/2는 이 명시적 item-hold lineage를 유효한 upstream evidence로 인정하고 held item을 독립 재시도한다. 명시적 item hold 때문에 N/N marker가 없다는 이유만으로 CREATE 전체를 되감거나 REVIEW 진입을 차단하지 않는다.
- 최종 MAIN publish 직전에만 해당 시험지의 `itemHoldCount=0`을 HARD gate로 요구한다.

---
## 0. 목적

정상 시험지 작업에서 모델의 집중력을 pipeline ceremony가 아니라 **학생에게 바로 줄 수 있는 최종 산출물 품질**에 사용한다.

기본 철학:

```text
ARTIFACT FIRST
RULES AS GUARDRAILS
SAMPLES SET THE BAR
PIPELINE ONLY WHEN NEEDED
```

정상 시험지 한 장의 제작/검수에서 V1/V2/V3, packet, seal, cohort, bridge, 대량 evidence ceremony를 작업자의 전면 과제로 두지 않는다.
필요한 안전정보는 작업 종료 뒤 최소 상태로 기록한다.

---

## 1. 작업자가 시작 전에 읽는 것

정상 시험지 CREATE/REVIEW 작업자는 아래만 먼저 읽는다.

1. Notion `GPT 작업 전 필독 라우터`
2. Archive 시작 페이지 / 현재 학년 상태
3. `Archive_작업전_Golden_Sample_Calibration_v1.md`
4. 작업에 직접 필요한 정본만:
   - 발문/보기/이미지 작업 → 문항조판 정본
   - 학생 해설 작업 → 학생용해설 정본
   - SVG/solutionImage 작업 → visual router + 해당 visual 정본
   - Git 반영 작업 → GPT 격리작업/Git safety
5. target 원본 시험지와 현재 JS

**관련 없는 pipeline 문서를 습관적으로 전부 읽지 않는다.**

---

## 2. CREATE — Artifact-first

CREATE의 전면 지시는 다음 정도로 유지한다.

> 원본 시험지를 직접 보고 학생에게 바로 줄 수 있는 완성본으로 만들어라.  
> 발문·보기·정답·이미지는 원본과 정확히 맞추고, 학생이 따라갈 수 있는 작은칠판 해설을 만든다.  
> 필요한 도형/SVG는 실제 수학 관계에 맞고 읽기 좋게 만든다.  
> 작업 전 Golden Sample 2~3개와 관련 Negative Sample을 확인한다.  
> 끝나면 자기 결과를 처음 보는 것처럼 한 번 다시 읽고 바로 고친다.

CREATE 필수 결과:
- source/content/choices/answer/image exact
- 전 문항 current-generation fresh coverage
- **solution 전 문항 새 작성 완료 — 기존 solution KEEP 0건**
- `solutionRewrite=FULL_ALL_QUESTIONS`
- `solutionRewriteCount=N/N`
- 필요한 visual의 fresh 필요성 판정 + KEEP/ADD/REPAIR/REBUILD 완료
- micro layout 정상
- 해결 가능한 known defect 0
- 미해결 사항은 반드시 문항별 item hold로 추적되어 untracked defect 0
- item hold가 있어도 다음 reviewer가 읽을 final/candidate artifact 존재

CREATE 종료 기록은 최소:
`examFile / certificationGeneration / stage / artifact SHA / changed files / solutionRewrite 또는 solutionRewriteAttempted / solutionRewriteCount 또는 solutionRewriteResolved / itemHoldCount / itemHoldQuestionIds / itemHoldReasons`.

재인증 scope에서 `certificationGeneration` 누락은 current CREATE 완료 증거가 아니다.

---

## 3. REVIEW1 / REVIEW2 — Fresh artifact review

REVIEW1과 REVIEW2의 전면 지시는 다음으로 단순화한다.

> 이전 PASS나 상세 코멘트를 정답으로 보지 말고 완성된 시험지를 처음 보는 것처럼 1번부터 끝까지 본다.  
> 틀린 수학, 부족한 해설, 잘못 자른 이미지, 어색한 조판, 이상한 SVG, 라벨 겹침이나 잘못된 기하가 있으면 같은 작업에서 직접 고친다.

각 REVIEW에서 실제 확인:
- 원문/보기/정답
- 수학 및 solution 재현성
- 작은칠판 해설 품질
- 이미지/크롭
- QUESTION MICRO_LAYOUT
- 연결 SVG/solutionImage
- JS 기본 무결성
- current-generation M3/M1/M2 1학기에서는 CREATE receipt의 `solutionRewrite=FULL_ALL_QUESTIONS` + 문항수 evidence 확인
- marker가 없으면 REVIEW1이 전 문항 solution full-rewrite catch-up을 수행하고, REVIEW2 시점까지도 marker/catch-up evidence가 없으면 REVIEW2가 직접 catch-up한 뒤 독립검수를 계속한다

Meta/RPM/L3/L4/CrossConcept/difficulty는 정상 production review에서 제외한다.

REVIEW 종료 기록도 최소:
`examFile / REVIEW stage / PASS_AFTER_REPAIR 또는 DONE_WITH_ITEM_HOLDS / changed files / final SHA / itemHoldCount / itemHoldQuestionIds / itemHoldReasons`.

REVIEW에서 item hold가 남아도 시험지 전체를 BLOCKED로 만들지 않는다. 다음 REVIEW가 있으면 그대로 넘기고, REVIEW2 뒤에는 held UID만 ITEM_RECOVERY_QUEUE로 분리한다.

---

## 4. SVG / visual

SVG 작업에서는 복잡한 ceremony보다 실제 artifact를 우선한다.

반드시 확인:
- 실제 점·선·각·길이 관계
- 각도값이 정확한 꼭짓점의 해당 각에 붙었는지
- 길이/점/각 라벨 충돌 0
- 외심·내심·중점·수직·평행·등거리 등 텍스트 주장과 실제 좌표가 일치하는지
- 학생이 해설의 결정 단계를 그림에서 바로 찾을 수 있는지

코드로 확정되지 않는 겹침/귀속/가독성은 해당 SVG만 targeted render한다.

visual pipeline의 세부 ceremony는 **새 generator/validator 검증, 공통 엔진 변경, 고위험 신규 시각화**에서만 전면 적용한다.

---

## 5. Golden + Negative Sample

정상 작업은 규칙만 읽고 시작하지 않는다.

- 현재 target과 가까운 Golden Sample 2~3개
- 관련 Negative Sample 1~2개

를 먼저 확인한다.

Golden Sample은 복사 template가 아니라 **품질 눈높이**다.
Negative Sample은 이미 실제로 놓친 false PASS를 재발 방지하는 기준이다.

독립 수학/난이도/Meta semantic 판정이 포함되는 별도 작업에서는 Blind→Compare를 지킨다.

---

## 6. Evidence 경량화

정상 시험지 작업에서 receipt/evidence는 **작업 목적이 아니다**.

필수 최소값:
```text
examFile
stage
base/input SHA
final artifact SHA
changedFiles
PASS / PASS_AFTER_REPAIR / DONE_WITH_ITEM_HOLDS / AUTHORITY_WRITE_PENDING
itemHoldQuestionIds (있을 때만)
itemHoldReasons (있을 때만)
```

문항별 긴 evidence JSON, snapshot dump, render dump, packet/seal은
다음 중 하나일 때만 생성한다.

- 실제 blocker 분석
- 재현 가능한 공통 결함
- generator/validator 개발
- 대량 migration
- 사용자가 명시적으로 요구
- canonical rule이 해당 작업에 실제로 요구

---

## 7. Git safety는 유지

경량화해도 아래는 줄이지 않는다.

- latest main 확인
- 자기 시험지 파일만 수정
- unrelated diff 0
- `git add .` / `git add -A` 금지
- force-push/reset/stash/clean 금지
- 작업 1건 = 독립 commit 원칙
- push 후 remote 반영 확인
- FINAL writer만 main 승격

---

## 8. M3 운영 구조

M3부터 레인 골격은 유지할 수 있다.

```text
CREATE
→ REVIEW1
→ REVIEW2
→ BATCH/FINAL mechanical handoff
→ MAIN
→ SVG FINAL AUDIT
```

단, CREATE/REVIEW 프롬프트는 본 문서의 Artifact-first 짧은 지시를 사용한다.

BATCH/FINAL은 콘텐츠를 다시 검수하지 않는다.
MAIN 반영 뒤 SVG/solutionImage만 별도 final audit 1회를 수행하여
새 false PASS가 발견되면 핀포인트 수정하고 Negative Sample/규칙에 일반화 가능한 내용만 추가한다.

---

## 9. Pipeline을 다시 전면 적용하는 경우

다음은 경량 모드가 아니라 pipeline/system mode로 전환한다.

- 같은 결함이 여러 시험지에서 반복
- 공통 generator/validator 결함
- 수십~수백 파일 migration
- canonical/runtime/compiled 전역 변경
- 새로운 시각 엔진/validator 개발
- 재현성·idempotence 자체가 작업 목표

즉 pipeline은 **모든 시험지의 기본 작업 방식이 아니라 공통 시스템 문제를 해결하는 도구**다.

---

## 10. 완료 기준

정상 시험지의 품질 완료는 checklist 수가 아니라 실제 artifact로 판단한다.

```text
원본 정확
수학 정확
학생 해설 재현 가능
이미지 적절
SVG 정확하고 읽기 좋음
조판 정상
untracked defect 0
item hold 0  ← MAIN publish 시점에만 강제
Git 안전
```

CREATE/REVIEW 중간 단계에서는 명시적 item hold가 있어도 다음 단계로 넘긴다. 위 `item hold 0`은 MAIN publish 직전 최종 조건이다. 각 중간 단계는 held UID를 정확히 기록하고 다음 독립 reviewer가 다시 판정할 수 있게 artifact와 lineage를 남긴다.
