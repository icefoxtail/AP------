# Archive GPT Artifact-First Lightweight v1

- 적용 시점: **중3 생산 라인부터**
- 상태: PREPARED / ACTIVATE_AFTER_M2_COMPLETE
- 적용 대상: JS Archive 정상 시험지 CREATE / REVIEW1 / REVIEW2 / FINAL handoff
- 비적용: 공통 generator/validator 개발, 대량 migration, 전역 Meta/Foundation 수술, 시스템 파이프라인 구현

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
- solution 완성
- 필요한 visual 완성
- micro layout 정상
- known defect 0
- 다음 reviewer가 읽을 최종 artifact 존재

CREATE 종료 기록은 최소:
`examFile / stage / artifact SHA / changed files / known blocker`.

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

Meta/RPM/L3/L4/CrossConcept/difficulty는 정상 production review에서 제외한다.

REVIEW 종료 기록도 최소:
`examFile / REVIEW stage / PASS_AFTER_REPAIR 여부 / changed files / final SHA / blocker`.

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
PASS / PASS_AFTER_REPAIR / BLOCKED
blockerReason (있을 때만)
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
known defect 0
Git 안전
```

이 조건을 만족하면 경량 evidence만 남기고 다음 단계로 넘긴다.
