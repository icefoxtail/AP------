# Past Exam V3 COMPLETE — 작성·검수 실행 계약 v1

적용: 2026-09-09. V2 full-page-first 추출은 유지하고 시작 calibration과
학생용 해설·분류·시각자료 완성을 공통 pipeline-core v2에 연결한다.
추출 성공, 소프트웨어 테스트 성공, 실제 문항 품질 PASS는 서로 다른 상태다.

## 실행 순서

1. **S0 RULE PREFLIGHT**: 현재 index/manifest 및 적용 규칙을 읽고 raw SHA를 확인한다.
2. **S0.5 CANONICAL PRODUCTION SAMPLE CALIBRATION**: 최신 Git `origin/main`의
   정상 production `archive/exams/original/...js` 2~3개를 전체 파일로 직접 읽는다.
   `git ls-remote origin refs/heads/main`과 로컬 main ref가 다르면 갱신 후 다시 준비한다.
   같은 과목·학년·시험 시기, 유사 교육과정, 최근 품질 업그레이드 순으로 선택하고
   선택 이유와 정상 완성품이라고 판단한 이유를 기록한다. 대상 기존 JS는 샘플로 세지 않는다.
3. **PRODUCTION QUALITY PROFILE FREEZE**: 샘플마다 main commit, path, bytes,
   raw SHA, examTitle, 과목, 문항 수를 고정한다. 전체 문항의 question SHA,
   실제 solution 인용, 관찰 기록으로 마지막 문항까지 읽은 범위를 기록한다.
   schema/solutionQuality/metadata/problemVisual/solutionVisual/layout 6축의
   관찰과 아래 품질 기준의 근거를 작성한다. 누락·NOT_TESTED·수기 PASS만 있으면
   `REFERENCE_SAMPLE_LOCK != PASS → BUILDER_START_BLOCKED`.
4. **TARGET BASELINE REVIEW**: 기존 target JS가 있으면 전체를 읽고 identity와 보존 필드를
   확인한다. 기존 해설은 진단 대상이며 새 해설의 품질 기준이나 풀이 seed가 아니다.
   전체 문항 관찰을 남기고 lock 안에 당시 raw-byte snapshot을 보존한다.
5. **S1~S3**: 원본 PDF/페이지 inventory → 전체 페이지 정확 추출 → source fidelity freeze.
6. **S4~S8 BUILDER**: 원문으로 직접 풀이 → 전 일반문항 신규 학생용 해설 + 분류 → 전 문항
   visual triage → EXPECTED FACT 동결 → Python 수치 모델 → 필요한 SVG 생성.
7. **S9~S14**: STATIC/METADATA 및 exam/solution/answer × desktop/mobile 실렌더 수집,
   한 번의 FINAL_AUDIT에서 sealed U1(SOURCE/MATH_A1/V1), U2(V2 artifact-only),
   U3(MATH_A2/SOLUTION/V3/RENDER_REVIEW) 검수. 독립 U1 판정은 builder 예상과 다를 수 있다.
   불일치는 결함으로 반환하고 원본·동결된 첫 판정을 덮어쓰지 않는다.
8. **S15~DONE**: 결함 수정 및 영향 범위 계산 → 최대 한 번 TARGETED_RECHECK → 전 문항
   공통 품질 closure + production authority → canonical promotion helper → DB/index/최종 release.

실행 topology와 launch/recheck 권위는 `archive/tools/pipeline-core/AGENT_BUDGET.md`다.
위 단계마다 별도 하위 agent를 실행하지 않는다. builder 풀이/EXPECTED는 제작 근거이며
독립 MATH_A1/V1 증거로 둔갑시키지 않는다. Source defect는 별도 recovery 경계를 유지한다.

## 세 입력의 역할

| 입력 | 역할 | 금지 |
|---|---|---|
| 정상 main production 샘플 | QUALITY CALIBRATION | target 수학 사실·정답 복사 |
| 현재 target JS | CURRENT BASELINE / identity | 기존 부실 해설을 품질 seed로 사용 |
| target PDF / 전체 페이지 | SOURCE TRUTH | 샘플 문구로 원문 대체 |

Calibration은 builder의 작업 준비 증거다. U1 source-only나 U2 artifact-only packet에
샘플 해설·target 기존 정답/해설을 넣지 않는다. 정독 여부를 boolean만으로 증명할 수 없으므로
문항별 실제 인용·관찰과 전체 coverage를 확인하되, 이를 수학적 정확성 인증으로 표현하지 않는다.

## Production quality profile

- 답만 제시하지 않고 사용 개념, 핵심 조건 해석, 중간 추론을 보존한다.
- 객관식 결론의 보기 번호, 상 난이도 논리 전개, 서술형의 재현 가능한 과정을 확인한다.
- 문제 `image`와 해설 `solutionImage`를 분리한다.
- 학생 이해에 명확한 이득이 있으면 SVG를 적극 작성하고 alt/caption/size와 수학 parity를 갖춘다.
- 샘플의 `[키포인트]` 같은 라벨은 통과 조건이 아니다. 밀도·재현성·내용이 기준이다.

실행 스키마는 `past-exam-pipeline/lib/calibration.mjs`의
`PAST_EXAM_REFERENCE_SAMPLE_LOCK_v1`이다. 각 품질 항목은 PASS, 최소 기준의 문장,
실제 샘플 문항 anchor를 요구한다. 부족한 샘플은 관찰 내용을 꾸며 통과시키지 말고 교체한다.

## Calibration consumption binding

S0.5에서 동결한 calibration은 builder 시작 조건만으로 끝나지 않는다. 실제 독립
검수의 quality-sensitive 입력은 `APMATH_CALIBRATION_CONSUMPTION_BINDING_v1`으로
동결 lock과 profile을 다시 결박한다. binding은
`referenceSampleLockSha`, `productionQualityProfileSha`, `frozenMainCommit`,
`consumedCalibrationAxes`, `reviewerPhase`, `comparisonResult`,
`comparisonReason`, `referenceAnchorsUsed`를 모두 가져야 하며, 단순한
"샘플을 참고했다" 문장은 증거가 아니다. target source, answer, existing target
solution은 이 binding의 reference authority가 아니다.

수정 전 실제 packet/evidence/closure wiring inventory는 다음과 같았다.

| CALIBRATION AXIS | BUILDER CONSUMES? | U1 CONSUMES? | U2 CONSUMES? | U3 CONSUMES? | RENDER_REVIEW CONSUMES? | FINAL CLOSURE BINDS? | GAP |
|---|---|---|---|---|---|---|---|
| schema | S0.5 lock/start gate | NO (blind) | NO | NO | NO | NO | builder-start only |
| solutionQuality | S0.5 profile/start gate | NO (blind) | NO | NO | NO | NO | typed SOLUTION was not bound to profile |
| metadata | S0.5 profile/start gate | NO | NO | NO | NO | NO | style observation was discarded |
| problemVisual | S0.5 profile/start gate | NO (blind) | NO | NO | NO | NO | crop usability floor was not consumed |
| solutionVisual | S0.5 profile/start gate | NO (blind) | artifact-only, but no calibration binding | NO | mechanical render only | NO | semantic visual floor was not bound |
| layout | S0.5 profile/start gate | NO (blind) | NO | render packet had no calibration input | mechanical checks only | NO | NO_CLIP/NO_OVERFLOW did not prove readability floor |

The new contract preserves the stage order and binds only phase-safe derived packets:
U1 receives `NONE`; U2 receives visual/layout profile and safe visual anchors without
answer or solution authority; U3 receives solution-quality profile plus selected
solution/visual/layout anchors; `RENDER_REVIEW` receives layout/readability profile.
Applicable solution, visual, and render closure rows are blocked when their binding
is absent, stale, or not `PASS`. Targeted recheck must use the same frozen lock,
profile SHA, main commit, and reference-anchor set as FINAL_AUDIT.
For a quality-sensitive PASS, `qualityFloorComparison` records typed per-axis
comparisons: solution explanation/reasoning/reproducibility/conditional logic and
student density; problem crop completeness/padding/labels/readability; instructional
visual clarity and fact/text parity; or desktop/mobile layout readability as
applicable. A final answer match or a no-overflow screenshot cannot substitute for
these comparisons.

## Typed Solution Quality

독립 U3 `SOLUTION.payload.solutionQuality`는 `APMATH_SOLUTION_QUALITY_v1`이다.
모든 검사는 `{status, reason, solutionExcerpts[]}`로 기록하며, PASS의 인용은 현재 solution에
실제로 존재해야 한다. 구현은 `pipeline-core/solution-quality.mjs`다.

- 필수: mathCorrect, answerConclusionParity, keyIdeaAdequate,
  conditionInterpretationAdequate, reasoningDirectionAdequate,
  intermediateReasoningComplete, studentReproducible, curriculumBoundaryPass,
  forbiddenExpressionPass. NOT_APPLICABLE 불가.
- 조건부: caseSplitComplete, rangeBoundaryComplete, uniquenessOrOverlapExplained,
  highLevelEnhanced, subjectiveScoringReady. 적용 제외도 근거를 요구한다.
- `level=상`이면 highLevelEnhanced, choices가 없거나 서술/서답형이면
  subjectiveScoringReady는 필수 PASS다. 난이도·유형 변경은 SOLUTION/V3를 재검한다.

`SOLUTION_QUALITY_PASS`는 reducer가 applicable check를 모두 확인해 계산한다.
문자열 PASS, 해설의 길이, 특정 제목, MathJax/렌더 성공은 내용 품질을 대신하지 않는다.
핵심 추론 생략 여부와 조건부 검사의 적용 여부는 독립 reviewer가 판단한다.

## Typed Visual Benefit / 기하 정책

전 문항 V1/V3의 `payload.visualBenefit`은 `APMATH_SOLUTION_VISUAL_BENEFIT_v1`이다.
visualRequirement, visualAction, studentUnderstandingBenefit, benefitReasons,
geometryVisualRole, expectedVisualType, decisiveStep, sourceFigurePresence,
sourceFigureUsedAsExemption=false, expectedFacts, applicablePolicyRefs를 요구한다.
V3는 V1 contract SHA와 EXPECTED fact SHA를 참조하며 동결한 critical fact 목록을 유지한다.
기존 V2 actual geometry 역산 및 V3 typed fact parity는 별도로 모두 통과해야 한다.

`VISUAL_OPTIONAL`이라도 이해 이득이 true이면 ADD/REBUILD/검증된 KEEP을 요구한다.
원본 그림이 없거나 쉬운 문제라는 이유만으로 자동 면제하지 않는다.
required/beneficial인데 실제 해설 시각자료가 없으면 `SOLUTION_VISUAL_MISSING`이다.

기하 v1.1은 `PROJECT_REFERENCED_ONLY`로 적용한다. V3 project config의
geometryPolicyRef는 `past-exam-pipeline/completion-contract.json`의 path/version/raw SHA와
동일해야 하고, applied run rule input에도 같은 ref를 넣는다. 전역 채택 선언은 하지 않는다.
집합·명제 Semantic Overlay v1.4는 qualification-only이며 production release 권위로 승격하지 않는다.

## 인계·변경·이행

새 V3 인계는 원본 보호 hash와 전체 completionBaseline을 보존한다. 허용 필드는
`completion-contract.json`의 allowedCompletionFields가 정본이다. 해설, 정답, 분류,
solutionImage 계열만 허용하며 content/choices/문제 image/identity/배치는 보호한다.
`changedFields` 자기신고만 믿지 않고 실제 baseline과 candidate의 차이를 검사한다.
새 추출 자산은 staging에서 처음부터 `assets/images/<examId>/...` canonical 경로를 사용한다.
prepare의 assetRoot/sourceAssetRoot로 문제·해설 자산을 읽고, 검수 전에 production에
복사하지 않는다. 전체 페이지 evidence는 sourceTruthRefs로 보존하며 JS bank로 실행하지 않는다.

새 past-exam 최종 closure는 core v2, calibration lock, 프로젝트 기하 pin,
전체 시험 publicationIntent를 요구한다. 이전 V1의 PASS나 빈 새 필드를 자동 승격하지 않는다.
기존 production 및 동결된 과거 evidence는 그대로 보존하고, 새 작업은 현재 증거로 작성한다.
샘플 main 기준이 바뀌면 새 builder 시작에서 calibration을 다시 한다. 시작 후의 최종 검수는
동결된 main commit의 바이트를 검증하며 네트워크 변화로 이미 진행 중인 수학 검수를 다시 띄우지 않는다.

GOLD/pilot/benchmark/holdout JOB은 시작 전에 required main/rule/calibration
baseline을 확인하고 `START_SHA`와 calibration identity를 freeze한다. freeze
뒤 live `origin/main`이 앞으로 이동한 것은 `POST_START_MAIN_ADVANCE`이며
실행 중 JOB을 stale 처리하지 않는다. `START_TIME_STALE`은 시작 시점에
baseline 자체가 stale한 경우이고, frozen bytes/hash 또는 JOB evidence가
frozen identity와 다르면 FAIL이다.

V4 GOLD benchmark denominator는 `SOURCE_FORMAT == PDF` 및
`SOURCE_PIXEL_RENDER_AVAILABLE == true`인 입력만 포함한다. HWP/HWPX 등은
`GOLD_INELIGIBLE_SOURCE_FORMAT`으로 분류하여 denominator에서 제외하며,
이는 production input capability를 제거하는 선언이 아니다. GOLD의
requested/actual model과 reasoning effort는 start/closure에서 관찰해
`MODEL_ROUTE_PARITY`를 계산한다. 관찰 불가·중간 변경은 성능 증거가 아닌
`FAIL`/`MIXED_MODEL_ROUTE` diagnostic 결과다.

candidate/asset/solutionImage/metadata mutation 뒤 MACHINE_CURRENT evidence는
STALE/INVALIDATED로 기록하고 재수집한다. 최종 evidence는 current candidate
artifact SHA와 axis input SHA를 함께 bind해야 한다. V1 `ADD`는 generated
artifact → candidate attachment → V2 artifact-only → V3 expected↔observed
fact parity → render review의 연결 또는 명시적 defect/HOLD/reclassification
evidence 없이는 closure할 수 없다. Diagnostic continuation은 downstream
관찰을 허용할 뿐 canonical PASS나 promotion authority가 아니다.

19 강남여고 q1/q10/q20/q21/q23~25의 결함 유형은 회귀 대상으로 사용하되,
테스트용 reviewer FAIL 기록을 실제 시험 전수검수 완료로 보고하지 않는다.
