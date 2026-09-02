# ALIVE 운영 문서 통합 인덱스

이 문서는 `alive/`의 단일 진입점이다. ALIVE 문항 생산 체계의 현재 정본·실행 계약·스키마·시각자료 규격과 과거 프롬프트를 역할별로 분리한다.

## 1. 현재 작업 읽기 순서

1. `01_CANONICAL/ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md`
2. `02_PIPELINES/ALIVE_PIPELINE_RUNTIME_SPEC_v1.0.md`
3. `02_PIPELINES/ALIVE_PROMPT_COMPILER_SPEC_v1.0.md`
4. `03_SCHEMA/ALIVE_STRUCTURED_QUESTION_SCHEMA_v1.0.md`
5. `03_SCHEMA/ALIVE_VALIDATION_SIDECAR_SCHEMA_v1.0.md`
6. `04_VISUAL/ALIVE_VISUAL_SPEC_v0.1.md` (시각문항인 경우)
7. `04_VISUAL/ALIVE_SIMILAR_ADVANCED_VISUAL_REGEN_SPEC_v1.0.md` (유사·심화·시각 에셋 재생성인 경우)
8. `02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.2.md` (JS 아카이브 작업인 경우)

장기 시각 capability를 시험할 때는 production 문서와 별도로
`.agents/skills/apmath-similar-question-pipeline/references/visual-benchmark-lane.md`
와 `alive.py visual-benchmark`를 사용한다. 이 lane은 평면좌표·직선의 방정식·
도형의 이동·함수·부등식·타원·미적분 대표 사례만 검증하고 staged production
lane에는 투입하지 않는다.

고1 정식 승격 작업의 첫 단원 fixture는 `alive.py coordinate-benchmark`로
`H22-C2-01 평면좌표`의 거리·중점·내분점·무게중심·자취를 별도 반복 검증한다.
이 명령 역시 브라우저 렌더 전의 실험 단위이며 production capability를 바꾸지 않는다.

고1 18개 canonical 단원의 결정론적 수학·학생용 해설·독립 검수·SVG 구조를
한 번에 반복 확인할 때는 `alive.py high1-benchmark`를 사용한다. 이 명령은
단원당 최소 3개 fixture(일반형·경계형·복합형)를 읽어 `alive/runtime`에
증거를 남기지만, 실제 브라우저 렌더와 전체 시험지 Run을 통과하기 전에는
어떤 단원도 `ACTIVE_UNIT`으로 올리거나 production capability를 변경하지 않는다.

고1 전체의 운영 경로는 `alive.py high1-operation-benchmark`로 18개 단원별
staged whole-exam Run을 만들고, 실제 `archive/engine.html`의 exam·solution·answer
화면을 확인한 뒤 `alive.py high1-operation-record-render`로 렌더 증거와 package를
기록한다. 마지막으로 `alive.py high1-finalize-promotion`이 canonical·수학·해설·
독립검수·결정성·브라우저·resume·assembly·package 증거를 모두 재대조하여 통과할
때만 각 단원을 `ACTIVE_UNIT`, 전체를 `ACTIVE_PRODUCTION`으로 표시한다. 이 경로는
검증용 staging 입력만 만들며 production Archive/question-index에는 등록하지 않는다.

엔진을 구현하거나 설계 계약을 검토할 때만 다음 문서를 추가로 읽는다.

9. `05_DESIGN/ALIVE_FAST_EXAM_SKILL_REDESIGN_PLAN_v0.13.md` (전체 시험지 기본 생성 엔진)
10. `05_DESIGN/ALIVE_CODEX_MULTI_AGENT_PIPELINE_IMPLEMENTATION_PLAN_v0.12.md` (`STRICT_AUDIT` 구현·회귀 대조용)
11. `05_DESIGN/ALIVE_QUALITY_PROOF_LOOP_ENGINE_세부구현계획서_v0.11.md` (상세 계약 후보·회귀 대조용)
12. `05_DESIGN/ALIVE_HIGH1_OFFICIAL_PROMOTION_MATRIX_v0.1.md` (고1 18개 canonical 단원 정식 승격 매트릭스)
13. `05_DESIGN/ALIVE_UNIVERSAL_VARIANT_ENGINE_IMPLEMENTATION_PLAN_v0.1.md` (중1~고등 전 과정 A/B/C 범용 엔진 구현계획)

JS 아카이브의 최신 통합 운영 기준은 `docs/rules/02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md`이며, 이 폴더의 v1.2 문서는 ALIVE 생산 체계에서 사용하는 참고 프로토콜이다.

## 2. 디렉터리별 역할

| 디렉터리 | 역할 | 기준 상태 |
|---|---|---|
| `01_CANONICAL/` | ALIVE 정책 정본 | 현재 기준 |
| `02_PIPELINES/` | 런타임·프롬프트 컴파일·JS 아카이브 실행 프로토콜 | 현재 실행 계약 |
| `03_SCHEMA/` | 문항 payload·검증 sidecar 스키마 | 현재 데이터 계약 |
| `04_VISUAL/` | 시각문항·유사/심화 시각 에셋 규격 | 조건부 적용 |
| `05_DESIGN/` | Codex 다중 에이전트 엔진 계획·차기 계약 후보 | 설계 전용, 운영팩 제외 |
| `90_ARCHIVE/LEGACY_PROMPTS/` | 기존 루트 프롬프트와 과거 생산 규칙 | 회귀·참고 전용 |

현재 엔진은 `alive/engine/`에 있으며 Phase 1 source lock, Phase 2 `R03`~`R12` task/reducer, Phase 3 `R13`~`R17` 객관식·주관식·서술형·ESSENTIAL SVG 문항 구조화·JS 직렬화·실렌더·패키징·로컬 동결, Phase 4A `E00`~`E06` 전체 시험지 preflight·자식 Run·시각 에셋 조립·전체 실렌더·패키징 계약을 `STRICT_AUDIT` 경로로 구현한다. Phase 4B Visual Spec 기반 결정론적 SVG, 독립 `VISUAL_EVIDENCE`, adapter 복사, review shadow, child/whole-exam ZIP 연결이 활성화되었다. 별도로 Phase 4C `FAST_EXAM` MVP는 부모 Run 하나, 문항별 Builder/블라인드 Verifier, bounded recheck·regeneration, 전체 조립·직렬화·렌더 증거·ZIP을 `NONVISUAL_WHOLE_EXAM` 범위에서 제공한다. FAST MVP는 기본 `STRUCTURAL_VARIANT`와 명시적 `CONFIRMATION` 프로필을 지원하고, 구조형 숫자·표면 clone 및 객관식 distractor provenance를 inbox 단계에서 결정론적으로 검사한다. 시각 의존 문항은 `F01`에서 `FAST_VISUAL_NOT_SUPPORTED`로 차단하며 STRICT 경로로 자동 전환하지 않는다. 전체 시험지는 각 capability 밖 문항이 하나라도 있으면 해당 preflight에서 자식/문항 작업을 만들지 않고 부분 시험지를 완성본으로 만들지 않는다. STRICT Run 상태는 `alive/runtime/runs/{runId}/`, FAST Run 상태는 `alive/runtime/fast-runs/{runId}/`에 저장한다. 저장소 Skill 진입점은 `.agents/skills/apmath-similar-question-pipeline/`, 역할별 Agent 설정은 `.codex/agents/`에 둔다. CLI는 모델이나 브라우저를 직접 호출하지 않으며 Codex가 task packet과 실제 브라우저 검수에 따라 하위 에이전트를 조율한다. 이 코드·런타임 영역은 MD 운영팩 manifest와 별도로 관리한다.

## 3. 우선순위

`사용자 현재 지시 > ALIVE_MASTER_RULEBOOK > Similar/Advanced 보강 Spec > 선택된 개별 Spec > LEGACY_PROMPTS`

Master Rulebook 전체를 매 호출에 그대로 붙이지 않는다. Runtime Prompt는 Prompt Compiler 규격에 따라 현재 MODE/Profile에 필요한 규칙만 조립한다.

## 4. 레거시 처리

기존 루트 프롬프트는 삭제하지 않고 `90_ARCHIVE/LEGACY_PROMPTS/`에 보존한다. 새 작업의 현재 정책 기준으로 자동 적용하지 않으며, 필요할 때만 회귀 비교·이전 작업 확인용으로 읽는다.

확장자가 없는 기존 오류 검증 파일도 원문 보존을 위해 이름을 바꾸지 않고 그대로 보관한다.

## 5. 무결성 관리

`MANIFEST.md`는 현재 운영 문서의 파일 목록과 SHA-256을 기록한다. 문서 이동·내용 수정 후에는 manifest를 다시 생성하고, 레거시 문서는 manifest 범위에서 제외한다.

현재 운영 문서만 압축하거나 전달할 때는 manifest에 등록된 파일만 사용하며, ZIP 내부에는 하위 폴더를 만들지 않는다.

`05_DESIGN/` 문서는 실제 engine artifact와 회귀검증이 완료되기 전 현재 운영 정본으로 승격하지 않으며 운영 manifest·운영 ZIP에서 제외한다.
