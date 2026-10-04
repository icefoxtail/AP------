# Past Exam V3 파이프라인 업그레이드 결과

상태: **PASS_SOFTWARE_REGRESSION / 로컬 구현 완료**

요청한 계획을 운영 계약으로 작성하고 실행 코드·스킬·검증기에 연결했다.
실제 시험지 독립검수, 실브라우저 시험지 qualification, production promotion 완료 보고가 아니다.

## 계획과 반영 결과

| 순서 | 변경 | 결과 |
|---|---|---|
| 1 | S0 규칙팩 + S0.5 정상 main production 2~3개 전체 정독 | 시작 함수·직접 Python 추출·core prepare에 HARD GATE |
| 2 | 문항별 샘플 관찰과 production quality profile 동결 | main commit/raw SHA/전체 coverage/실제 solution 인용/품질 anchor 검사 |
| 3 | target baseline과 source truth 분리 | baseline 전 문항 관찰 및 바이트 snapshot, target 원본 SHA 보존 |
| 4 | typed 해설 품질 | 14개 검사, 필수 N/A 금지, 근거·현재 solution 인용, 상/서술형 강화 |
| 5 | typed visual benefit | 모든 V1/V3에 필요성·효용·역할·결정적 단계·critical facts·정책 ref 요구 |
| 6 | 공통 closure 연결 | core v2, FULL_EXAM, calibration/project config/source inventory/기하 pin 필수 |
| 7 | V3 completion 인계 | 허용 분류·solutionImage 필드, 전체 baseline 실제 diff 검사 |
| 8 | staging 자산 경로 | 새 source crop의 canonical 경로, 별도 assetRoot/sourceAssetRoot 지원 |
| 9 | 실패 사례와 기존 회귀 | 최종 187 tests PASS, Node/Python syntax PASS, rule manifest PASS |

운영 정본: `docs/rules/02_PIPELINES/Past_Exam_V3_COMPLETE.md`.
명령·관찰 작성 방법: `archive/tools/past-exam-pipeline/README.md`.
실행 토폴로지는 기존 AGENT_BUDGET의 한 번 FINAL_AUDIT / 최대 한 번 TARGETED_RECHECK를 유지한다.
builder 풀이와 독립 U1/A1 풀이를 구분한다. 생성기·캡처·테스트가 독립 검수 PASS를 만들지 않는다.

## 최종 검증

- 공통 코어: **155/155 PASS**
  - `node archive/tools/pipeline-core/run-checks.mjs --core-only --out reports/past-exam-v3-core-regression-final.json`
  - 결과: `past-exam-v3-core-regression-final.json`, `past-exam-v3-core-regression-final.txt`
- 기출 파이프라인: **29/29 PASS**
  - `npm --prefix archive/tools/past-exam-pipeline test`
  - 결과: `past-exam-v3-past-regression-complete.txt`
- 기존 경로/스키마 계약: **3/3 PASS**
  - `node --test tests/past-exam-pipeline-contract.test.mjs`
  - 결과: `past-exam-v3-route-contract-final.txt`
- Node syntax 및 Python AST 검사: **PASS**
- 규칙팩 raw-byte SHA: **PASS / drift 0**
  - 결과: `past-exam-v3-rule-preflight-final.json`

실패를 차단한 사례: calibration 없음, 샘플 1개/중복, 마지막 문항 누락,
가짜 solution 인용, 읽지 않은 visual 축, sample/source 혼동, target 변경,
main 변경, baseline 미검토, 해설 FAIL을 렌더 PASS로 덮기, 적용 대상 N/A,
optional-benefit SVG 누락, frozen EXPECTED 변경, 정책 SHA 누락,
legacy closure로 downgrade, 실제 source inventory coverage 누락,
changedFields에서 숨긴 layout 변경, production 대신 staging 자산 연결.

19 강남여고 q1/q10/q20/q21/q23~25는 전달받은 **결함 유형을 합성 reviewer 결과로
재현**했다. 이 테스트는 해당 실제 시험 JS의 전수 수학·교육성 검수를 대신하지 않는다.
테스트용 정상 fixture/독립 reviewer envelope를 production 증거로 발행하지 않았다.

## 버전·적용 범위

- 작업 시작 시 branch: `codex/hs-quadratic-svg-upgrade`.
- 로컬 branch는 `origin/main` 대비 ahead 67 / behind 11이었다. 진행 중인 다른
  기출·SVG 작업을 보존하기 위해 main 전체 merge나 production 재작성은 하지 않았다.
- 누락된 기하 v1.1 문서만 로컬 origin/main의 Git blob 바이트 그대로 추가했다.
  SHA: `e136ca000b5e16fa0bd493cf7067c1e219683bfecbe4daa7e487f020b87bac3b`.
- 해당 정책은 PROJECT_REFERENCED_ONLY로 V3 project config에 pin한다.
  전역 채택 또는 집합·명제 qualification overlay의 production 권위 승격은 하지 않았다.
- 스킬 파일 자체 검사 항목은 통과했으나 전체 verify-skills는 main 미반영과
  이번 로컬 스킬 수정의 uncommitted 상태 때문에 FAIL로 남는다.
  결과: `past-exam-v3-skill-check.txt`.
- core verifier 계약이 바뀌었으므로 새 최종 판정에서 과거 SHA의 evidence를
  그대로 재사용할 수 없다. 기존 frozen 증거를 덮어쓰거나 PASS를 자동 마이그레이션하지 않는다.

## 다음 실제 시험 작업의 시작점

최신 main 동기화 → 현재 규칙 읽기 → 정상 production 샘플 선택·전체 관찰 →
calibration freeze → target 전체 source inventory → V2 추출 → 신규 해설·분류·SVG 제작 →
V3 core prepare → 공통 machine collection/독립 FINAL_AUDIT → closure 및 허가된 promotion.

코드는 정독의 내적 과정이나 수학의 참을 일반적으로 자동 증명하지 못한다.
따라서 이번 강화는 자료·coverage·SHA·명시적인 항목별 판정을 검증하고,
해설 내용과 시각자료 의미의 판단은 실제 격리된 reviewer에게 남긴다.
