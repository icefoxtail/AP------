# Hermes Agent Textbook Pipeline Migration Assessment

작성일: 2026-05-25
작업 위치: `C:\Users\USER\Desktop\AP------`

## 1. 이번 작업 범위

이번 작업은 Hermes Agent를 설치하거나 실행하는 작업이 아니다. 목적은 `archive/textbook` 아래 교재/시험지 자동화 파이프라인의 실제 로컬 폴더 구조를 기준으로, Hermes식 운영 구조를 참고할 가치가 있는지 판단하고 다음 라운드 구현 지시서 초안을 만드는 것이다.

이번 작업에서 하지 않은 것:

- PDF 신규 변환 없음
- package 설치 없음
- Hermes Agent 실행/설치/의존성 추가/코드 복사 없음
- daemon/cron/MCP 서버 구현 없음
- `.agent` 또는 `docs` 운영 구조 확정 생성 없음
- generated/js, generated/assets, generated/reports 덮어쓰기 없음
- apmath, archive/index.html, mixer.html, mixed_engine.html, archive/exams 수정 없음
- 해설 생성, 발문 창작, 문제 id/sourceQuestionNo 변경 없음
- git add/commit/push 없음

## 2. 먼저 확인한 로컬 기준 문서와 상태

작업 시작 시 `Get-ChildItem -Force | Sort-Object Name`를 실행해 workspace 루트 상태를 확인했다. 루트에는 `.git`, `.codex_tmp`, `.codex_work`, `apmath`, `archive`, `docs`, `tools`, `CODEX_RESULT.md` 등이 존재한다.

먼저 확인한 기준 파일:

- `archive/textbook/CODEX_RESULT.md`
- `archive/textbook/tools/textbook-pipeline/README.md`
- `archive/textbook/tools/textbook-pipeline/package.json`
- `archive/textbook/pipeline.config.json`
- `archive/textbook/textbook_pipeline_queue.config.json`
- `archive/textbook/tools/textbook-pipeline/tests/pipeline-stage-contract.test.mjs`

## 3. archive/textbook 실제 구조 요약

`archive/textbook` 루트는 PDF 원본, 정답 PDF, 교재별 generated output root, 공통 reports, 파이프라인 tools, 룰북/프로토콜/단원키 문서가 섞여 있는 운영 작업장이다.

주요 루트 구성:

- 원본/정답 PDF: RPM, 라이트쎈, 마플시너지, 미래앤, 동아, 비상교육 교재/정답 PDF 다수
- 교재별 output root: `22개정 RPM ...`, `22개정_라이트쎈_...`, `22개정_마플시너지_...`, `_미래앤_...`, `_비상교육_...`
- 공통 pipeline config: `pipeline.config.json`, `pipeline.*.config.json`, `textbook_pipeline_queue.config.json`
- 공통 파이프라인: `archive/textbook/tools/textbook-pipeline`
- 공통 reports: `archive/textbook/reports`
- 룰북: `JS아카이브룰북.txt`, `🤖 JS아카이브 발문·보기 추출 프로토콜 v4.md`, `# JS아카이브 표준단원키 마스터 테이블.md`

확인된 파일 규모:

- `.png`: 42,779개
- `.json`: 3,495개
- `.js`: 929개
- `.py`: 532개
- `.zip`: 389개
- `.md`: 211개
- `.jpg`: 85개
- `.mjs`: 80개
- `.pdf`: 36개

교재별 산출물은 대체로 `generated/js`, `generated/assets` 또는 이미지 crop 계열, `generated/reports`, `generated/review_pack` 성격의 구조를 갖고 있다. 공통 `archive/textbook/generated`와 공통 `archive/textbook/reports`에도 과거/통합 산출물이 존재한다.

## 4. 현재 textbook-pipeline 구조

`archive/textbook/tools/textbook-pipeline`는 이미 stage 기반 파이프라인 구조를 갖는다.

주요 디렉터리:

- `stages`: 00~14 단계별 실행 모듈
- `lib`: config, paths, report, JS archive, standard unit, normalization, zip 유틸
- `helpers`: 교재별 fresh pack, crop, contact sheet, review pack, OCR/quality helper
- `tests`: stage contract 테스트

확인된 핵심 stage:

- `00-rulebook-gate.mjs`
- `04b-question-id-mapping-guard.mjs`
- `05-page-crop.mjs`
- `06-question-full-crop.mjs`
- `06c-question-page-mapping-audit.mjs`
- `06d-question-page-mapping-repair.mjs`
- `07-visual-asset-crop.mjs`
- `07a-visual-asset-link-audit.mjs`
- `08a-quick-answer-table.mjs`
- `08b-answer-solution-crop.mjs`
- `09-build-internal-model.mjs`
- `10b-transcribe-content-choices.mjs`
- `10b-fail-empty-content-cause-classify.mjs`
- `10c-answer-fill-and-verify.mjs`
- `10c-fail-missing-answer-cause-classify.mjs`
- `11-validate.mjs`
- `12-formula-repair-target-extract.mjs`
- `12b-gemini-formula-patch-dry-run.mjs`
- `12d-apply-gemini-formula-patches.mjs`
- `13-apply-corrections.mjs`
- `14-final-pre-review-validate.mjs`

README 기준 생산 순서는 mapping-first, `jsFile` scoped 방식이다. 운영 대상은 `archive/textbook/{book}/generated/js/**/*.js`로 고정하고, backup/review_pack/final_clean/draft_content/reports/root outputs는 제외하는 정책이 이미 명시되어 있다.

queue config는 batchSize 4, autoResume, retry, stage subset 실행, noGemini/noApply stage 구분을 갖는다. 즉, Hermes식 병렬 workstream의 일부 욕구는 이미 config에 존재하지만, 작업자 인수인계/기억/실패 반영 계층은 아직 report 파일과 대화 흐름에 흩어져 있다.

## 5. Hermes Agent GitHub 원본 확인 결과

참고 URL: https://github.com/NousResearch/hermes-agent

직접 확인한 파일/구조:

- `README.md`
- `AGENTS.md`
- `.plans`
- `plans`
- `skills`
- `optional-skills`
- `tools`
- `plugins`
- `mcp_serve.py`
- `trajectory_compressor.py`
- `cron`
- `providers`
- `gateway`
- `agent`

README에서 확인한 핵심 개념:

- built-in learning loop
- 경험으로부터 skill 생성 및 사용 중 self-improvement
- agent-curated memory
- 과거 대화 검색과 요약
- scheduled automations/cron
- isolated subagents for parallel workstreams
- trajectory compression for training/tool-calling trajectories
- tools, skills, memory, MCP, cron 관련 문서 체계

GitHub tree에서 확인한 구조:

- 루트에 `.plans`, `plans`가 모두 존재한다.
- `skills`와 `optional-skills`가 분리되어 있다.
- `tools` 아래에는 approval, checkpoint, file, browser, cronjob, delegate 등 도구 계층이 존재한다.
- `trajectory_compressor.py`는 긴 trajectory에서 앞/뒤 중요 turn을 보호하고 중간 turn을 요약으로 대체하는 구조를 가진다.
- `AGENTS.md`에는 config/env/working directory 등 운영 규칙을 문서화하는 방식이 보인다.

원본 확인은 성공했다. 다만 이번 작업에서는 GitHub 원본을 실행/설치/복사하지 않고 구조적 아이디어만 참고했다.

## 6. Hermes식 후보별 이식 판단

### boot: 도입 가치 높음

현재 `archive/textbook/CODEX_RESULT.md`, README, queue config, 최신 handoff/status report가 흩어져 있다. 다음 작업자가 시작할 때 어느 파일을 먼저 읽어야 하는지 매번 사용자 지시로 보정된다.

권장:

- 운영 구조 확정 전에는 새 `.agent`를 만들지 말고, 다음 라운드에서 `archive/textbook/reports/textbook_boot_manifest.draft.json` 같은 draft report만 먼저 만든다.
- boot manifest에는 기준 문서, 최신 status report, 금지 경로, 운영 JS scope, 현재 queue state를 기록한다.

### skills: 도입 가치 높음

현재 반복 SOP는 README, CODEX_RESULT, 사용자 지시, stage 코드에 분산되어 있다. content 입력, answer 매핑, crop 검수, protected-field scan, manual_review 분류는 반복 SOP로 분리할 가치가 크다.

권장 skill 후보:

- `content_from_full_page_crop`
- `answer_from_solution_source`
- `question_mapping_audit`
- `manual_review_reclassification`
- `protected_field_diff_scan`
- `review_pack_generation`
- `formula_patch_dry_run`

단, Hermes `skills` 코드를 복사하지 말고 `archive/textbook/reports/skills_draft/*.md` 또는 단일 draft JSON으로 먼저 설계한다.

### memory: 도입 가치 높음

반복 실수는 이미 명확하다.

- displayNo 단순 매칭 위험
- bboxSlotNo를 문항번호로 오인
- stale/extra JS를 정상 문항으로 처리
- answer source 불확실한데 짧은 답만 입력
- question crop만 보고 full page 맥락을 놓침
- generated reports와 운영 JS scope 혼동

권장:

- 다음 라운드에서 `memory_draft`를 만들어 확정 판단, 금지 규칙, 반복 실패 원인을 축약한다.
- 운영 memory로 확정하기 전까지는 report-only로 둔다.

### plans: 도입 가치 높음

현재 교재별/단원별/stage별 진행 계획은 queue config와 report에 부분적으로만 있다. 마플시너지처럼 reset/exclude/content/answer가 섞인 작업은 plan 없이는 긴 대화에서 쉽게 흔들린다.

권장:

- book/jsFile/setKey 단위 plan schema draft를 만든다.
- 각 plan item은 `scope`, `allowed_fields`, `evidence_required`, `success_gate`, `verification`, `handoff_summary`를 갖는다.

### subagent / parallel workstream: 제한적 도입 가치

현재 queue는 batchSize와 retry/autoResume이 있으나, 실제 병렬 작업에서는 같은 JS 파일 동시 수정 위험이 크다. Hermes의 isolated subagent 개념은 유용하지만, 이식은 “작업 배정표 + lock + merge 검증” 수준부터 시작해야 한다.

권장:

- book/jsFile lock 파일 또는 lock report draft
- subagent assignment manifest draft
- 각 workstream은 운영 JS 직접 수정 대신 patch/report 우선, 최종 적용은 단일 owner가 수행

도입 금지:

- 자동 daemon/cron/MCP 서버
- 임의 병렬 직접 수정

### trajectory compression: 도입 가치 높음

현재 CODEX_RESULT가 매우 길고, 한 작업자가 다음 작업자에게 넘겨야 하는 핵심 상태가 묻힌다. Hermes의 trajectory compression 방식은 특히 잘 맞는다.

권장:

- 긴 CODEX_RESULT/report를 직접 요약해 `handoff_digest`를 만든다.
- 앞부분: 작업 범위/금지사항/기준 파일
- 중간: 생략 가능한 상세 로그 요약
- 끝부분: 최신 counts, 남은 작업, 검증 결과, 실패 원인

단, LLM API 기반 compressor는 다음 라운드에서도 선택사항이다. 우선 deterministic reducer로 충분하다.

### self-improvement loop: 도입 가치 높음

현재 실패 report가 다음 run의 rule로 자동 반영되지 않는다. 예를 들어 `question_page_mapping_mismatch`, `answer_displayNo_mismatch`, `stale_or_extra_js_question` 같은 분류가 다음 작업 시작 전 자동 경고로 올라오면 효과가 크다.

권장:

- failure report reducer
- recurring failure taxonomy
- 다음 run preflight warning
- README/boot draft에 반영할 rule suggestions

단, 자동으로 stage 동작을 바꾸지 말고 사람 승인 전까지는 suggestion report로 둔다.

### tools / plugins / MCP: 구조만 참고

Hermes의 tools/plugins/MCP 구조는 범용 agent 실행 환경에 가깝다. `archive/textbook`에는 이미 Node/Python stage와 helper가 있으므로 Hermes tool runtime을 가져올 필요는 없다.

권장:

- 기존 stage를 “tool-like wrapper”로 설명하는 registry draft만 만든다.
- `stageId`, `inputs`, `outputs`, `writesGenerated`, `writesOperatingJs`, `safeDryRun`, `requiresPdfRender`, `requiresExternalApi` 같은 메타데이터를 붙인다.

도입 금지:

- MCP 서버 구현
- Hermes plugin 설치/복사
- 외부 dependency 추가

## 7. 전체 판단

Hermes Agent를 통째로 설치하거나 dependency로 추가할 필요는 없다. 현재 파이프라인은 이미 교재 도메인에 특화된 stage/lib/helper/report 구조를 갖고 있으며, Hermes의 런타임/CLI/gateway/cron/MCP 계층을 들여오면 오히려 운영 범위가 커진다.

권장 판단:

- Hermes 전체 설치: 비추천
- Hermes 외부 코드 복사: 금지
- Hermes 구조 참고: 추천
- 우선 이식할 것: boot, skills SOP, memory digest, plans, workstream assignment, trajectory compression, self-improvement suggestion loop
- 나중에 검토할 것: tool registry, dry-run orchestrator
- 이번 파이프라인에 불필요한 것: gateway, messaging, cron daemon, MCP server, provider management, package/dependency 설치

핵심은 “agent runtime 이식”이 아니라 “긴 교재 자동화 작업을 실패 없이 이어가는 운영 메모리/계획/검증 레이어”를 얹는 것이다.

## 8. 다음 라운드 구현 지시서 초안

아래 지시서는 다음 작업자에게 그대로 전달 가능한 초안이다. 아직 운영 구조로 확정하지 말고 draft 산출물만 만든다.

```text
작업 위치:
C:\Users\USER\Desktop\AP------

/goal archive/textbook 교재·시험지 자동화 파이프라인에 Hermes식 운영 구조를 "설치 없이, 코드 복사 없이, draft report-only" 방식으로 이식하기 위한 1차 기반을 만든다.

절대 금지:
- Hermes Agent 실행/설치 금지
- Hermes Agent dependency 추가 금지
- Hermes 외부 코드 복사 금지
- package 설치 금지
- PDF 신규 변환 금지
- daemon/cron/MCP 서버 구현 금지
- .agent 또는 docs 운영 구조 확정 생성 금지
- generated reports 덮어쓰기 금지
- generated/js 문항 내용 수정 금지
- sourceQuestionNo/id/displayNo/setKey/metadata 수정 금지
- apmath, archive/index.html, mixer.html, mixed_engine.html 수정 금지
- archive/exams 수정 금지
- 배포 금지
- git add/commit/push 금지

참고만 할 Hermes 원본:
- https://github.com/NousResearch/hermes-agent
- README.md
- AGENTS.md
- skills / optional-skills
- plans / .plans
- trajectory_compressor.py
- tools / plugins / mcp 구조

먼저 확인할 로컬 파일:
- Get-ChildItem -Force | Sort-Object Name
- archive/textbook/CODEX_RESULT.md
- archive/textbook/tools/textbook-pipeline/README.md
- archive/textbook/pipeline.config.json
- archive/textbook/textbook_pipeline_queue.config.json
- archive/textbook/tools/textbook-pipeline/tests/pipeline-stage-contract.test.mjs

구현 산출물은 운영 구조 확정이 아니라 draft report로만 만든다:
- archive/textbook/reports/textbook_hermes_boot_manifest_draft_YYYYMMDD.json
- archive/textbook/reports/textbook_hermes_skill_sop_draft_YYYYMMDD.json
- archive/textbook/reports/textbook_hermes_memory_digest_draft_YYYYMMDD.json
- archive/textbook/reports/textbook_hermes_plan_schema_draft_YYYYMMDD.json
- archive/textbook/reports/textbook_hermes_workstream_assignment_draft_YYYYMMDD.json
- archive/textbook/reports/textbook_hermes_self_improvement_suggestions_YYYYMMDD.json

Task 1. boot manifest draft 작성
- archive/textbook 루트의 기준 문서, queue config, 최신 status/report, 금지 경로, 운영 JS scope를 수집한다.
- generated/reports를 덮어쓰지 않는다.
- output은 root reports에 새 timestamp 파일로만 쓴다.

Task 2. skill SOP draft 작성
- 기존 README와 stage contract를 기준으로 반복 SOP를 분리한다.
- 최소 SOP:
  - content_from_full_page_crop
  - answer_from_solution_source
  - question_mapping_audit
  - manual_review_reclassification
  - protected_field_diff_scan
  - review_pack_generation
  - formula_patch_dry_run
- 각 SOP에는 input evidence, allowed writes, forbidden writes, success gate, verification, manual_review reason을 넣는다.

Task 3. memory digest draft 작성
- 최근 CODEX_RESULT와 reports에서 반복 실패 원인을 추출한다.
- 확정 규칙과 실패 사례를 구분한다.
- 예: displayNo 단순 매칭 금지, bboxSlotNo 문항번호 오인 금지, answer 추측 금지, question crop 단독 판정 금지.

Task 4. plan schema draft 작성
- book/jsFile/setKey 단위 작업 계획 schema를 만든다.
- 각 plan item은 scope, source files, allowed fields, required evidence, write mode, validation commands, handoff summary를 포함한다.
- 실제 plan을 운영에 적용하지 않는다.

Task 5. workstream assignment draft 작성
- 병렬 작업 단위는 book/jsFile/setKey 중 하나로 제한한다.
- 같은 jsFile 동시 수정 금지 rule을 명시한다.
- subagent는 직접 JS 수정보다 patch/report 생성 우선으로 설계한다.

Task 6. self-improvement suggestion draft 작성
- manual_review/failure/mismatch report에서 다음 run의 preflight warning으로 올릴 규칙을 추출한다.
- 자동으로 stage 동작을 바꾸지 말고 suggestion으로만 남긴다.

검증:
- git diff --name-only로 금지 경로 변경 없음 확인
- generated/js 변경 없음 확인
- generated/reports 덮어쓰기 없음 확인
- apmath/archive HTML/archive exams 변경 없음 확인
- package-lock/package.json 변경 없음 확인
- git add/commit/push 없음 확인

CODEX_RESULT.md 보고:
- 생성한 draft report 목록
- Hermes 원본 직접 확인 성공/실패
- 로컬 조사 기준 파일 목록
- 이식 추천/비추천 항목
- 금지 경로 미수정 확인
- git 작업 없음 확인
```

## 9. 다음 라운드 acceptance criteria

- Hermes 원본은 참고만 하고 실행/설치/복사하지 않는다.
- draft report는 `archive/textbook/reports`에 timestamp 새 파일로만 생성한다.
- `archive/textbook/generated/**`, 교재별 `generated/js/**`, `apmath/**`, `archive/exams/**`, 운영 HTML은 변경하지 않는다.
- package 관련 파일은 변경하지 않는다.
- CODEX_RESULT에는 “구조 이식 판단”과 “다음 구현 지시서”만 보고한다.
- git 작업을 하지 않는다.

