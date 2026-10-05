# ALIVE Codex Multi-Agent Pipeline 구현 계획 v0.12

> 전체 시험지의 기본 생성 경로는 `ALIVE_FAST_EXAM_SKILL_REDESIGN_PLAN_v0.13.md`가 우선한다. 이 문서의 다중 후보·다중 검증·문항별 `R03`–`R17` 전체 시험지 루프는 구현된 `STRICT_AUDIT` 및 회귀 대조 계약으로 보존한다.

## 0. 문서 상태

- 상태: `DESIGN_CANDIDATE`
- 목적: 자연어 한 문장으로 기출 문항을 지정하면 Codex가 역할별 하위 에이전트를 조율하여 유사문제 후보, 독립 검증 증거, JS 산출물과 실제 렌더 결과를 만드는 저장소 전용 파이프라인을 구현한다.
- 상위 정책: `../01_CANONICAL/ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md`
- 세부 계약 후보: `ALIVE_QUALITY_PROOF_LOOP_ENGINE_세부구현계획서_v0.11.md`
- 이 문서와 v0.11은 운영 규칙이 아니며 구현 전 `alive/MANIFEST.md` 운영팩에 포함하지 않는다.

### 구현 스냅샷 — 2026-08-29

Phase 1~Phase 4B visual-active orchestration runtime으로 다음이 구현되었다.

- 저장소 Skill: `.agents/skills/apmath-similar-question-pipeline/`
- project custom agents: `.codex/agents/alive-*.toml`
- CLI 진입점: `python -m alive.engine.alive_cli`
- 자연어 source resolver와 모호성 fail-closed
- source JS/qKey/question ordinal/SHA-256 lock
- atomic `manifest.json`, Run 디렉터리, 상태·목록·Resume
- V0.1 capability precheck와 미지원 MODE 차단
- 원문 JS 비실행 정적 문항 추출과 SourceQuestion artifact
- `R03`~`R12` 역할별 task packet과 입력 격리
- immutable artifact submit과 SHA-256 기록
- Source/Plan/Candidate/Math/Fidelity/Judge artifact validator
- 후보당 독립 Math I2/I3, 최소 2 Plan·2 Candidate fail-closed reducer
- `prepare` / `submit` / `reduce` CLI와 `PHASE2_COMPLETE` 경계
- canonical metadata adapter와 `choices` label ownership 검증
- JS Archive serializer/parser semantic round-trip
- review-only shadow JS와 production Archive 미등록 경계
- exam/solution/answer 실제 브라우저 렌더 증거 Gate
- evidence ZIP CRC/member round-trip과 `LOCALLY_FROZEN` 경계
- 전체 시험 정적 추출, source hash, 문항 수·연속 ID·배점 계약 preflight
- `E00`~`E06` Exam Batch parent와 문항별 기존 `R03`~`R17` child Run 계약
- 미지원 문항 1개라도 발견 시 child Run 0개로 닫는 whole-exam fail-closed
- 전체 문항 ID 재배치, 원본 배점 표기·총점 보존, 중복 문항 차단, JS semantic round-trip
- 전체 exam/solution/answer 마지막 문항·마지막 페이지 실렌더 Gate와 비공개 ZIP
- 주관식·서술형 Answer Contract, 응답형 R11 Gate, Archive adapter
- source question type lock으로 서술형의 객관식 강등 차단
- Visual Spec v0.1 결정론적 SVG 렌더러와 spec/asset hash·비생성형 provenance report
- R10 독립 VISUAL_EVIDENCE, R12 선택 증거, R13 asset copy와 V5 sidecar
- R14 review shadow image 경로, R16 child ZIP, E03/E05 whole-exam asset 조립·ZIP

CLI 자체의 Agent·브라우저 자동 호출은 의도적으로 포함하지 않고 Codex Skill이 task packet을 보고 하위 에이전트와 실렌더 검수를 조율한다. 2026-08-29 기준 실제 금당고 고1 2025년 2학기 기말 19번 source lock으로 Core Golden Loop와 Phase 3를 완주했다. 최종 Run은 `20260828T202846Z-25년-금당고-2학기-기말-고1-19번-recovery-5-978a0d42`이며, 독립 검산과 모든 품질 Gate를 통과한 후보 2개 중 `candidate-b`를 선택했다. 이어 canonical structured adapter, JS semantic round-trip, production engine의 exam/solution/answer 실렌더, evidence package round-trip을 통과하여 `LOCALLY_FROZEN / R17_LOCAL_FREEZE`에 도달했다. production Archive에는 등록하지 않았다.

같은 날 전체 금당고 시험지(22문항, 100점)를 Phase 4B visual-active preflight에 다시 적용했다. 6·16번은 ESSENTIAL visual, 18번은 solution-only OPTIONAL visual로 잠겼고, 전체 22문항이 지원되어 `wholeExamReady=true`가 되었다. 실제 parent Run `20260829T025818Z-25년-금당고-2학기-기말-고1-전체-유사-visual-r-b1553f4c`은 `READY_FOR_CHILD_RUNS / E02_CHILD_RUNS`에서 자식 Run 22개를 준비했다. 아직 각 자식의 모델 생성·독립 검증·실렌더를 수행한 것은 아니며 production Archive에는 등록하지 않았다.

Golden Loop에서 확인된 구현 보완은 다음과 같다.

- Plan Critic은 생존 Plan이 2개 미만이면 유효한 `FAIL` artifact를 제출할 수 있어야 하며 reducer가 `PLAN_CRITIC_REJECTED`로 닫아야 한다.
- R10 task packet은 후보별 독립 수학 증거 `math-i2.json`, `math-i3.json`을 모두 참조해야 한다.
- 선택지 번호 계약은 학생용 1-based index이며 Solver task packet과 validator 문구에 명시해야 한다.
- R11 오답 Gate는 임의 근접값을 허용하지 않고 각 오답의 단일·구체적 오개념 매핑을 요구한다.
- immutable artifact 수정은 동일 Run 덮어쓰기가 아니라 source lock을 재사용한 새 Recovery Run으로 수행한다.
- 자동 retry 횟수·Run 계보·변경된 단계부터의 증거 재사용은 Coverage Expansion 전에 별도 runtime 계약으로 구현할 필요가 있다.

계약 상태는 다음 세 단계로 분리한다.

```text
DESIGN_PROPOSED       문서에만 존재
IMPLEMENTED_UNVERIFIED 코드·schema는 있으나 회귀검증 미통과
ACTIVE                artifact 존재 + schema 검증 + 회귀검증 PASS
```

실제 artifact가 없는 계약을 `ACTIVE`로 보고하지 않는다.

## 1. 사용자가 원하는 호출 경험

대표 호출:

```text
25년 J19 기말 기출을 가지고 유사문제 만들어줘.
```

Codex는 다음을 수행한다.

1. Archive index와 파일명·시험 메타데이터에서 `25년`, `J19`, `기말`에 대응하는 기준본을 찾는다.
2. 일치 결과가 하나면 source를 잠그고, 여러 개이거나 문항 번호가 없으면 필요한 최소 질문만 한다.
3. 기본값은 `EXAM_FOLLOWUP / CONFIRMATION`으로 해석하되 사용자가 심화·순수 숫자변형을 명시하면 MODE를 바꾼다.
4. 역할별 하위 에이전트가 분석·설계·생성·검산·검수한다.
5. 결정론적 도구가 schema, 수학 계산, JS 문법, archive 중복, 렌더 상태를 검사한다.
6. 모든 필수 Gate가 통과한 후보만 최종 폴더에 조립한다.
7. production Archive 반영은 별도 명시가 없으면 하지 않는다.

## 2. Codex 구성 방식

이 기능은 단일 거대 프롬프트가 아니라 다음 세 층으로 구현한다.

```text
Repository Skill
  └─ Orchestrator: 요청 해석, source lock, 단계 전환, 최종 reducer
       ├─ Custom subagents: 독립 분석·생성·검수
       └─ Deterministic tools: schema·계산·직렬화·렌더·hash 검사
```

권장 저장 위치:

```text
.agents/skills/apmath-similar-question-pipeline/
  SKILL.md
  references/
  scripts/

.codex/agents/
  alive-source-analyst.toml
  alive-plan-designer.toml
  alive-candidate-builder.toml
  alive-math-verifier.toml
  alive-fidelity-reviewer.toml
  alive-visual-reviewer.toml
  alive-serializer-render-reviewer.toml

alive/engine/
  contracts/
  schemas/
  registries/
  scripts/
  tests/
  fixtures/

alive/runtime/runs/{runId}/
  manifest.json
  source/
  plans/
  candidates/
  evidence/
  render/
  final/
```

외부의 존재하지 않는 `../AI_CENTER/ROUNDS/alive/` 경로를 기본값으로 고정하지 않는다. 런타임 루트는 프로젝트 내부 `alive/runtime/runs/`를 기본으로 하고 config에서 바꿀 수 있게 한다.

## 3. MODE와 작업 종류

현재 ALIVE Master와 맞추어 두 축을 분리한다.

```text
generationMode = TYPE_BANK | EXAM_FOLLOWUP | STRICT_VARIANT
operationMode  = GENERATE | REVIEW_ONLY | SERIALIZE_ONLY
outputProfile  = REVIEW_TEXT | PROBLEM_ANSWER_ONLY | JS_ARCHIVE
```

`EXAM_FOLLOWUP`은 `CONFIRMATION | ADVANCED`를 가진다.

MVP V0.1 지원 범위:

```text
generationMode = EXAM_FOLLOWUP
followupKind = CONFIRMATION
operationMode = GENERATE | REVIEW_ONLY
outputProfile = REVIEW_TEXT | JS_ARCHIVE
visualDependency = NONE
expectedQuestionCount = 1 기본
```

`TYPE_BANK`, `STRICT_VARIANT`, `ADVANCED`, 시각문항은 schema에서 인식하되 capability가 활성화되기 전 생성 요청은 조용히 낮춰 처리하지 않고 `CAPABILITY_PRECHECK_FAIL`로 중단한다.

시험지 전체 생성은 별도 Exam Profile이다. `expectedQuestionCount=24`를 전역 기본값으로 두지 않는다.

## 4. 하위 에이전트 역할과 쓰기 경계

| Agent | 핵심 책임 | 쓰기 허용 영역 |
|---|---|---|
| Source Analyst A/B | 원문 독립 해석, 교육과정·풀이 구조·Fingerprint 도출 | `source/analysis-a.json`, `source/analysis-b.json` |
| Plan Designer A/B/C | 서로 다른 변형 전략 작성 | `plans/plan-{a,b,c}.json` |
| Plan Critic | Fidelity·난도·숫자갈이 여부 판정 | `plans/critic.json` |
| Candidate Builder A/B/C | 승인 Plan별 ProblemIR/SolutionIR 생성 | `candidates/{id}/draft/` |
| Math Verifier I2/I3 | 의도 답을 보지 않고 최종 발문 독립 풀이 | `candidates/{id}/evidence/math/` |
| Fidelity Reviewer | 원문 핵심 구조·난도·교육과정·복제 여부 검수 | `candidates/{id}/evidence/fidelity/` |
| Visual Reviewer | 시각 capability 활성 시 asset·topology·실렌더 검수 | `candidates/{id}/evidence/visual/` |
| Serializer/Render Reviewer | JS 변환, exam/solution/answer 실렌더 검수 | `render/`, `final/staging/` |
| Main Orchestrator | Gate reducer, 후보 선택, 최종 조립 | `manifest.json`, `final/` |

병렬 Agent가 같은 파일을 수정하지 않는다. Agent는 자기 전용 디렉터리에 immutable artifact를 기록하며 최종 Orchestrator만 `final/`을 작성한다.

생성과 검증의 독립성을 위해 Candidate Builder에는 독립 Solver 결과나 정답 검증 결과를 미리 제공하지 않는다. Math Verifier에는 source 정답·source 해설·Candidate 의도 답을 숨긴 최종 학생용 payload만 제공한다.

## 5. Canonical 실행 순서

```text
R00 REQUEST NORMALIZE
R01 SOURCE RESOLVE
R02 SOURCE LOCK + HASH
R03 SOURCE ANALYSIS A/B [parallel read-only]
R04 CURRICULUM CONTRACT + SOURCE FINGERPRINT
R05 PLAN A/B/C [parallel]
R06 PLAN CRITIC + PLAN POOL REDUCER
R07 CANDIDATE A/B/C [separate output dirs]
R08 DETERMINISTIC LOCAL CHECKS
R09 INDEPENDENT MATH SOLVER I2/I3
R10 CURRICULUM + FIDELITY + DIFFICULTY + ANTI-CLONE
R11 DISTRACTOR CHECK [MCQ]
R12 CANDIDATE JUDGE + FINAL REDUCER
R13 STRUCTURED QUESTION ADAPTER
R14 JS ARCHIVE SERIALIZER [JS_ARCHIVE]
R15 EXAM / SOLUTION / ANSWER REAL RENDER
R16 PACKAGE ROUND-TRIP + FINAL REPORT
R17 LOCALLY_FROZEN
```

문항 후보 생성은 병렬화할 수 있지만 source lock, 최종 reducer, 직렬화, 렌더, package 조립은 순차 실행한다.

## 6. 데이터 계약 보완

### 6-1. ProblemIR와 현재 Structured Question 연결

내부 IR과 현재 JS용 payload를 혼합하지 않는다.

```text
ProblemIR.questionType: MCQ | SHORT_ANSWER | CONSTRUCTED_RESPONSE
        ↓ deterministic adapter
Structured Question.questionType: 객관식 | 주관식 | 서술형
```

Adapter version과 hash를 Run manifest에 기록한다.

### 6-2. Answer Contract

ProblemIR/SolutionIR 사이에 다음 정답 계약을 둔다.

```json
{
  "answerType": "expression",
  "canonicalAnswer": "",
  "acceptableAnswers": [],
  "equivalencePolicy": "symbolic_equivalence",
  "verificationProfile": "EXACT"
}
```

`equivalencePolicy`를 생략한 주관식·서술형은 최종 PASS할 수 없다.

### 6-3. Choice Label Ownership Lock

- 신규 `choices`에는 ①~⑤, `1.`, `(1)` 같은 보기 번호를 넣지 않는다.
- 배열에는 보기 내용만 저장하고 번호 표시는 Archive 엔진이 담당한다.
- `answer`의 선택지 index와 choices 순서는 deterministic adapter가 검증한다.
- 보기 순서를 섞으면 `choiceOrderMutable` 증거와 permutation history를 남긴다.

### 6-4. Sidecar 전환

현재 `ALIVE_VALIDATION_SIDECAR_SCHEMA_v1.0.md`의 외부 필드와 v0.11의 내부 Gate/Failure artifact를 바로 혼합하지 않는다.

```text
internal GateInstanceResult / FailurePolicy
        ↓ compatibility projection
Validation Sidecar v1 또는 향후 v2
```

새 내부 code가 Sidecar v1 registry에 없으면 임의 문자열을 넣지 않고 mapping 실패로 중단한다. 구현 시작 전 Sidecar v2 필요 여부를 결정한다.

## 7. 실렌더 필수 Gate

`JS_ARCHIVE` 최종 PASS에는 다음 실제 브라우저 화면 증거가 필요하다.

```text
exam render     PASS
solution render PASS
answer render   PASS
last question / last page checked
MathJax checked
SVG/PNG decode checked
horizontal overflow checked
```

수정 후에는 같은 세 화면을 다시 렌더한다. `NOT_TESTED`는 중간 WARN으로만 허용하고 `LOCALLY_FROZEN`, `SEALED`, `PUBLISHED`에는 허용하지 않는다.

## 8. Visual 경계

현재 `04_VISUAL` 문서는 수동 생산 규칙으로 사용할 수 있다. 이것이 곧 자동 엔진 Visual capability가 구현되었다는 뜻은 아니다.

```text
Manual visual production spec = CURRENT POLICY
Automated visual engine contract = DESIGN_PROPOSED
```

V0.1은 `visualDependency=NONE`만 자동 생산한다. V0.2에서 Visual schema, deterministic SVG/PNG builder, asset provenance, topology validator, 브라우저 render evidence가 모두 구현된 family만 활성화한다.

## 9. V0.1에서 뒤로 미루는 범위

다음은 Core Golden Loop가 통과한 뒤 구현한다.

- production Archive 자동 publish
- CAS/rollback ownership
- 24문항 전체 시험 자동 조립
- Visual 자동 생성
- ADVANCED 자동 생산
- 전체 95개 계약 일괄 활성화
- 외부 Human Review Queue 서비스
- 장기 drift/mutation release 자동화

V0.1은 생성 품질을 증명하는 데 필요한 계약만 구현한다. v0.11의 상세 계약은 삭제하지 않고 단계별 승격 후보로 사용한다.

## 10. 구현 단계

### Phase 0 — Contract Reconciliation

- 현재 ALIVE 8개 운영 문서와 v0.11 용어 매핑
- generationMode/operationMode/outputProfile schema
- ProblemIR/SolutionIR/AnswerContract 최소 schema
- status/code compatibility map
- source resolver contract
- Choice Label Ownership Lock
- real render evidence schema

### Phase 1 — Codex Orchestration Skeleton

- 저장소 전용 Skill 생성
- project custom agents 생성
- run directory와 manifest 생성기
- source resolver와 source lock
- 단계별 immutable artifact writer
- resume/checkpoint 최소 구현

### Phase 2 — One-Question Golden Loop

- 비시각 기출 문항 1개 입력
- Plan 3개와 Candidate 3개 생성
- 독립 Solver·Fidelity·Anti-clone 검수
- 최종 후보 1개 선택
- 실패 시 bounded retry

### Phase 3 — JS + Real Render

- Structured Question adapter
- Archive serializer/parser round-trip
- exam/solution/answer 브라우저 실렌더
- 최종 review report와 evidence pack

### Phase 4A — Whole-Exam Controller (IMPLEMENTED)

- 전체 source 정적 추출과 capability preflight
- all-or-nothing child Run 생성
- frozen child 검증과 전체 순서 조립
- 배점·총점·중복·serializer round-trip Gate
- 전체 실렌더와 비공개 package

### Phase 4B — Coverage Expansion (NEXT)

- 지원 수학 family 확대
- TYPE_BANK와 STRICT_VARIANT
- ADVANCED
- Visual deterministic production
- 서술형·주관식 adapter
- 시각자료·공통자료 capability
- batch retry·계보·동시 실행 lock

### Phase 5 — Publish/Release

- production publish 승인 정책
- CAS/atomic index update
- regression/mutation/drift
- 배포 rollback과 audit chain

## 11. 첫 Acceptance Test

입력 예:

```text
25년 J19 기말 기출에서 19번을 기준으로 확인 유사문제 1개 만들어줘.
JS아카이브 형식으로 만들고 실제 시험지·해설지·정답표 렌더까지 검수해.
하위 에이전트는 원문 분석, 후보 설계, 독립 수학검산, Fidelity 검수, 렌더 검수를 분리해.
```

PASS 조건:

- source가 유일하게 resolve되고 hash로 잠김
- 두 source 분석 결과의 핵심 구조 합의
- 서로 다른 Plan 최소 2개 이상 생존
- Candidate 최소 2개 독립 생성
- 독립 Solver가 의도 답을 보지 않고 같은 정답 도출
- Math/Curriculum/Fidelity/Difficulty/Anti-clone/Distractor PASS
- `choices` 번호 중복 없음
- JS syntax와 serializer round-trip PASS
- exam/solution/answer 실제 렌더 PASS
- production Archive는 사용자 승인 전 변경되지 않음
- 최종 문항·해설·정답·Sidecar·Evidence report가 한 Run 폴더에 존재

## 12. 최종 구현 원칙

이 파이프라인의 품질은 Agent 수가 아니라 역할 분리, 입력 차단, 결정론적 검사, 증거 완전성으로 보장한다.

```text
Codex Orchestrator가 판단을 조율한다.
Subagent는 독립 산출물을 만든다.
Deterministic tool은 검증 가능한 사실을 판정한다.
Final Reducer만 PASS와 최종 산출물을 확정한다.
```
