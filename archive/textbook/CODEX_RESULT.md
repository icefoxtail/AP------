# CODEX_RESULT

## 1. 생성/수정 파일

생성 파일:
- `docs/textbook-pipeline/JS_ARCHIVE_FORMULA_RULEBOOK.md`
- `docs/textbook-pipeline/FORMULA_CORRECTION_PATCH_SCHEMA.md`
- `archive/textbook/tools/textbook-pipeline/stages/12-formula-repair-target-extract.mjs`
- `archive/textbook/tools/textbook-pipeline/stages/12b-gemini-formula-patch-dry-run.mjs`

수정 파일:
- `docs/textbook-pipeline/AP_MATH_TEXTBOOK_ONECLICK_PIPELINE_APP.md`
- `docs/textbook-pipeline/AGENT_OPERATION_POLICY.md`
- `archive/textbook/tools/textbook-pipeline/README.md`
- `archive/textbook/CODEX_RESULT.md`

직접 수정하지 않은 기존 상태:
- 루트 `CODEX_RESULT.md`는 작업 전부터 modified 상태였고 이번 결과 보고 위치로 사용하지 않았다.
- 기존 generated/js, archive/exams JS, apmath 운영 JS 파일은 수정하지 않았다.

## 2. 구현 완료 또는 확인 완료

- `JS_ARCHIVE_FORMULA_RULEBOOK.md` 생성 완료.
  - 수식 토큰만 `$...$` 처리, 한국어 `\text{}` 금지, 조합/순열/지수/첨자/분수/루트/부등호/줄바꿈/choices 기준 및 금지사항을 문서화했다.
- `FORMULA_CORRECTION_PATCH_SCHEMA.md` 생성 완료.
  - API 출력은 최종 JS가 아니라 `targetText -> replacementText` correction patch 후보임을 고정했다.
  - `content`, `choices[0]`~`choices[4]`만 patch 대상이며 `answer`/`solution`은 제외했다.
- `12-formula-repair-target-extract.mjs` 생성 완료.
  - `--book-id`, `--reports-dir`, `--out`, `--limit` CLI 지원.
  - 존재하는 report만 읽고 없는 report는 `missingInputs`에 기록한다.
  - formulaRisk/rulebookRisk/formulaPatternRisk/formula 관련 needsReview/plain nCr-nPr/unicode 첨자/지수/bare caret/LaTeX escape/image-only 흔적/choices 수식 위험을 target으로 분리한다.
  - JS 수정 없음, replacementText 생성 없음.
- `12b-gemini-formula-patch-dry-run.mjs` 생성 완료.
  - `--book-id`, `--input`, `--out`, `--limit` CLI 지원.
  - `GEMINI_API_KEY` 환경변수만 사용하고 API 키 파일이나 `.env`를 만들지 않는다.
  - API 키가 없으면 skipped report로 정상 종료한다.
  - Gemini 결과는 formula correction patch JSON 후보만 생성하며 JS에 반영하지 않는다.
- README/APP/AGENT 문서 보강 완료.
  - v1 흐름: 발문/보기 입력 -> 정답 입력 -> 1차 구조 검수 -> 수식 보정 대상 자동 추출 -> Gemini patch dry-run -> 최종 적용/검수.
  - 08A/08B는 정답 자료 준비, 10B는 content/choices, 10C는 answer, 11은 구조/룰북, 12는 formula target extract, 12B는 Gemini dry-run, 13은 향후 final apply/review로 정리했다.
  - solution 제외 정책과 answerCandidate의 report-only 성격을 명시했다.

## 3. 실행 결과

- `node --check archive/textbook/tools/textbook-pipeline/stages/12-formula-repair-target-extract.mjs`: PASS
- `node --check archive/textbook/tools/textbook-pipeline/stages/12b-gemini-formula-patch-dry-run.mjs`: PASS
- `node --check archive/textbook/tools/textbook-pipeline/run-oneclick-pipeline.mjs`: PASS
- target extract stage 빈 reports 실행: PASS
  - 입력 report가 없어도 빈 target report를 생성하고 정상 종료함을 확인했다.
- target extract stage 샘플 risk report 실행: PASS
  - UTF-8 BOM JSON도 읽을 수 있게 보강했고, `formulaRisk=true` 항목 1개가 target으로 추출됨을 확인했다.
- Gemini stage API 키 없이 실행: PASS
  - `GEMINI_API_KEY`가 없을 때 `api_skipped_no_key` skipped 결과로 정상 종료함을 확인했다.
- 실제 Gemini API 호출: 수행하지 않음.
  - 현재 검증은 API 키 없이 dry-run skip 동작만 확인했다.
- 기존 JS 파일 변경 없음 확인:
  - `git diff --name-only | rg "(generated/js|archive/exams|apmath).*\.js"` 결과 없음.
- `.env` 생성 없음 확인:
  - 루트 `.env`: 없음.
  - `archive/textbook/tools/textbook-pipeline/.env`: 없음.
- API 키 저장 없음 확인:
  - 실제 키 문자열 또는 키 할당 패턴 검색 결과 없음.
- 검증 중 생성한 `.codex_tmp/formula-stage-test*` 임시 산출물은 정리했다.

## 4. 결과 요약

이번 작업은 교재 DB 제작 파이프라인 v1에 수식 보정 대상 자동 추출 stage와 Gemini patch dry-run stage를 추가하고, 관련 룰북/patch schema/운영 문서를 확정한 작업이다.

실제 교재 JS, `content`, `choices`, `answer`, `solution` 데이터는 수정하지 않았다.
Gemini stage는 patch 후보 생성까지만 담당하며, JS 자동 적용은 없다.
다음 단계는 `apply-formula-correction-patch.mjs` 구현 여부 결정이다.

## 5. 다음 조치

- sample 30개 formula repair targets 준비.
- `GEMINI_API_KEY` 설정 후 dry-run 실행.
- `formula_correction_patch` 품질 확인.
- exact-once 검증 기반 `apply-formula-correction-patch.mjs` 구현 여부 결정.
- 현재 정답표/answer crop 보유 현황 확인.
- 빠른정답이 필요한 문제집/교과서 목록 확인.
- 정답 없는 교재는 일단 보류.

## 6. 금지사항 확인

- generated/js 또는 실제 교재 JS 산출물 수정 없음.
- 기존 `content`/`choices`/`answer`/`solution` 실제 데이터 수정 없음.
- 기존 stage 삭제 없음.
- 기존 파이프라인 큰 구조 변경 없음.
- solution 자동 생성 없음.
- answer를 발문/보기 단계에서 수정하는 변경 없음.
- content/choices를 정답 단계에서 수정하는 변경 없음.
- Gemini API 결과를 JS에 즉시 반영하는 기능 없음.
- API 키 파일 저장 없음.
- `.env` 생성 없음.
- report에 API 키 기록 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서 변경 없음.
- 문항 내용 창작 없음.
- 수식 의미 추측 없음.
- 정답 추측 없음.
- image-only content PASS 처리 없음.
- git add / git commit / git push 실행 없음.

---

# CODEX_RESULT

## 1. 생성/수정 파일

생성한 `.agent` 문서:
- `.agent/BOOT.md`
- `.agent/SKILLS_INDEX.md`
- `.agent/PIPELINE_STATE.md`
- `.agent/WORKSTREAM_TEMPLATE.md`
- `.agent/RESULT_TEMPLATE.md`

생성한 `docs/agent-skills` 문서:
- `docs/agent-skills/textbook-pipeline-overview-sop.md`
- `docs/agent-skills/content-from-full-page-crop-sop.md`
- `docs/agent-skills/answer-from-solution-source-sop.md`
- `docs/agent-skills/question-mapping-audit-sop.md`
- `docs/agent-skills/manual-review-reclassification-sop.md`
- `docs/agent-skills/archive-compatible-js-sop.md`
- `docs/agent-skills/formula-repair-sop.md`
- `docs/agent-skills/validation-and-result-sop.md`
- `docs/agent-skills/parallel-workstream-sop.md`

생성한 `plans` 문서:
- `plans/BOOK_STATUS_BOARD.md`
- `plans/PIPELINE_NEXT_ACTIONS.md`
- `plans/PARALLEL_WORK_ASSIGNMENTS.md`

생성한 `reports/agent-memory` 문서:
- `reports/agent-memory/compressed-history.md`
- `reports/agent-memory/repeated-errors.md`
- `reports/agent-memory/verified-decisions.md`
- `reports/agent-memory/failed-stage-queue.json`
- `reports/agent-memory/manual-review-queue.json`
- `reports/agent-memory/correction-ingestion-queue.json`

수정 파일:
- `CODEX_RESULT.md`

## 2. 실제 확인한 기준 파일

- `CODEX_TASK.md`
- `CODEX_RESULT.md`
- `reports/textbook_hermes_boot_manifest_draft_20260525.json`
- `reports/textbook_hermes_skill_sop_draft_20260525.json`
- `reports/textbook_hermes_memory_digest_draft_20260525.json`
- `reports/textbook_hermes_plan_schema_draft_20260525.json`
- `reports/textbook_hermes_workstream_assignment_draft_20260525.json`
- `reports/textbook_hermes_self_improvement_suggestions_20260525.json`
- `C:\Users\USER\Desktop\AP------\docs\PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`

## 3. 구현 완료 또는 확인 완료

- 기존 Hermes draft JSON 6종을 읽고 모두 JSON parse PASS 확인.
- report-only draft 6종을 실제 운영 문서층으로 승격.
- `.agent` 시작 문서, skill index, pipeline state, workstream/result template 생성.
- `docs/agent-skills` SOP 9종 생성.
- `plans` 초기 board/action/assignment 문서 3종 생성.
- `reports/agent-memory` 압축 히스토리, 반복 오류, 확정 판단, queue JSON 3종 생성.
- Hermes runtime/dependency 도입 없음.
- generated/js, generated/reports, generated/assets, generated/review_pack 미수정 확인.
- tools/textbook-pipeline 미수정 확인.

## 4. 실행 결과

- `.agent` 생성 파일 수: 5
- `docs/agent-skills` 생성 파일 수: 9
- `plans` 생성 파일 수: 3
- `reports/agent-memory` 생성 파일 수: 6
- queue JSON parse:
  - `failed-stage-queue.json`: PASS
  - `manual-review-queue.json`: PASS
  - `correction-ingestion-queue.json`: PASS
- node --check: 해당 없음. 이번 작업은 Markdown/JSON 문서층 생성이며 JS 코드 수정 없음.
- 금지 경로 diff:
  - `generated/js`: 변경 없음
  - `generated/reports`: 기존 파일 덮어쓰기 없음
  - `generated/assets`: 변경 없음
  - `generated/review_pack`: 변경 없음
  - `tools/textbook-pipeline`: 변경 없음
  - `apmath`: 변경 없음
  - `archive/exams`: 변경 없음
  - 운영 HTML: 변경 없음
  - package files: 변경 없음

## 5. 결과 요약

이제 `archive/textbook` 작업자는 `.agent/BOOT.md` -> `.agent/SKILLS_INDEX.md` -> `plans/BOOK_STATUS_BOARD.md` -> `reports/agent-memory` 순서로 시작할 수 있다.

병렬 작업 전에는 `plans/PARALLEL_WORK_ASSIGNMENTS.md`와 `.agent/WORKSTREAM_TEMPLATE.md`를 기준으로 jsFile/report lock을 먼저 선언해야 한다.

## 6. 다음 조치

- `BOOK_STATUS_BOARD.md`를 실제 최신 report 기준으로 채우는 별도 라운드.
- `manual-review-queue.json`을 실제 generated reports에서 채우는 별도 라운드.
- answer-source evidence queue를 실제 source map/report 기준으로 채우는 별도 라운드.
- 이후 workstream 분할.

## 7. 하지 않은 작업

- pipeline stage 실행 없음.
- OCR/PDF/crop 실행 없음.
- generated/js 수정 없음.
- generated/reports 기존 파일 덮어쓰기 없음.
- tools/textbook-pipeline 수정 없음.
- Hermes 설치/실행 없음.
- dependency 추가 없음.
- git add/commit/push 없음.

---

# CODEX_RESULT

## 1. 생성/수정 파일

생성 파일:
- `archive/textbook/reports/hermes_agent_textbook_pipeline_migration_assessment_20260525.md`

수정 파일:
- `archive/textbook/CODEX_RESULT.md`

수정하지 않은 파일/경로:
- `archive/textbook/**/generated/js/**/*.js`
- `archive/textbook/**/generated/reports/**`
- `archive/textbook/**/generated/assets/**`
- `archive/textbook/**/generated/review_pack/**`
- `apmath/**`
- `archive/index.html`, `archive/mixer.html`, `archive/mixed_engine.html`
- `archive/exams/**`
- `package.json`, `package-lock.json`

## 2. 구현 완료 또는 확인 완료

- Hermes Agent GitHub 원본 직접 확인 완료.
  - 확인 URL: `https://github.com/NousResearch/hermes-agent`
  - 확인 항목: `README.md`, `AGENTS.md`, `.plans`, `plans`, `skills`, `optional-skills`, `tools`, `plugins`, `mcp_serve.py`, `trajectory_compressor.py`
- `archive/textbook` 실제 로컬 구조 조사 완료.
  - PDF/정답 PDF, pipeline config, tools/textbook-pipeline, stages/lib/helpers/tests, generated/js/assets/reports/review_pack 성격 산출물, manual_review/crop/answer/validation report 계열 확인.
- Hermes식 후보별 이식 가치 판단 완료.
  - 추천: boot, skills SOP, memory digest, plans, workstream assignment, trajectory compression, self-improvement suggestion loop.
  - 비추천: Hermes 전체 설치, dependency 추가, 외부 코드 복사, daemon/cron/MCP 서버 도입.
- 다음 라운드 구현 지시서 초안 작성 완료.

## 3. 실행 결과

- workspace 루트 `Get-ChildItem -Force | Sort-Object Name` 확인: 완료
- `archive/textbook/CODEX_RESULT.md` 선확인: 완료
- `archive/textbook/tools/textbook-pipeline/README.md` 확인: 완료
- `archive/textbook/pipeline.config.json` 확인: 완료
- `archive/textbook/textbook_pipeline_queue.config.json` 확인: 완료
- `archive/textbook/tools/textbook-pipeline/tests/pipeline-stage-contract.test.mjs` 확인: 완료
- `archive/textbook` 파일 규모 확인:
  - `.png`: 42,779
  - `.json`: 3,495
  - `.js`: 929
  - `.py`: 532
  - `.zip`: 389
  - `.md`: 211
  - `.pdf`: 36
- Hermes GitHub 직접 확인: 성공
- PDF 신규 변환: 없음
- package 설치: 없음
- Hermes 실행/설치/코드 복사: 없음
- generated reports 덮어쓰기: 없음
- 운영 JS 수정: 없음
- git add/commit/push: 없음

## 4. 결과 요약

Hermes Agent는 통째로 설치하거나 dependency로 추가할 대상이 아니라, `archive/textbook` 파이프라인의 긴 작업을 안정적으로 이어가기 위한 운영 구조 참고 대상으로 판단했다.

현재 파이프라인은 이미 stage/lib/helper/report 기반이 강하므로 Hermes runtime보다 `boot`, `skills`, `memory`, `plans`, `parallel workstream`, `trajectory compression`, `self-improvement loop`를 report-only draft로 먼저 도입하는 방식이 적합하다.

## 5. 다음 조치

- 다음 라운드에서 report-only draft 산출물 생성:
  - `textbook_hermes_boot_manifest_draft_YYYYMMDD.json`
  - `textbook_hermes_skill_sop_draft_YYYYMMDD.json`
  - `textbook_hermes_memory_digest_draft_YYYYMMDD.json`
  - `textbook_hermes_plan_schema_draft_YYYYMMDD.json`
  - `textbook_hermes_workstream_assignment_draft_YYYYMMDD.json`
  - `textbook_hermes_self_improvement_suggestions_YYYYMMDD.json`
- 운영 구조 확정 전까지 `.agent`/`docs` 생성 금지 유지.
- generated/js, generated/reports, apmath, archive/exams, 운영 HTML 수정 금지 유지.

---

# CODEX_RESULT

## 1. 생성/수정 파일

수정한 JS 파일:
- `_미래앤_고등_공통수학2_교과서/generated/js/textbook/*.js` 6개
- `_비상교육_고등_대수_교과서/generated/js/textbook/*.js` 9개
- `_비상교육_고등_대수_교과서/generated/js/workbook/*.js` 3개

생성/갱신한 report:
- `archive/textbook/reports/input_agent_assignment_4books_20260524.json`
- `archive/textbook/reports/input_protected_field_baseline_20260524.json`
- `archive/textbook/reports/content_choices_report.json`
- `archive/textbook/reports/manual_review_report.json`
- `archive/textbook/reports/formula_uncertain_report.json`
- `archive/textbook/reports/input_agent_summary.json`
- `archive/textbook/reports/node_check_4books_20260524.json`
- 각 대상 교재 `generated/reports/`의 동일 report 사본
- `_미래앤_고등_공통수학2_교과서/generated/reports/input_patch_*_20260524.json`
- `_미래앤_고등_공통수학2_교과서/generated/reports/input_patch_apply_report_20260524.json`

## 2. 구현 완료 또는 확인 완료

- 하위 에이전트 배정:
  - Popper: `_미래앤_고등_공통수학2_교과서`
  - Euler: `_비상교육_고등_대수_교과서` 앞 6개 JS
  - Chandrasekhar: `_비상교육_고등_대수_교과서` 뒤 6개 JS
- Popper가 직접 수정 중 JS 문자열 파손을 만든 3개 파일은 baseline 보호 필드가 일치하는 backup에서 복구했다.
- 복구 후 Popper/Euler/Chandrasekhar에게 남은 미래앤 공통수학2 68문항은 JS 직접 수정 대신 patch JSON만 만들게 했고, Codex가 id 기준으로 content/choices만 안전 적용했다.
- `answer`, `solution`, `id`, `displayNo`, `setKey`, `sourceQuestionNo`, 문항 순서, tags/metadata/standardUnit 계열 변경 없음 확인.
- 기존 visual asset crop만 사용 대상으로 유지했다. PDF 변환/crop 생성/07 visual asset crop 재실행 없음.

## 3. 실행 결과

- 작업 전 empty content: 371
- 작업 후 empty content: 42
- 새로 채운 content: 329
- 교재별 결과:
  - `_미래앤_고등_공통수학1_교과서`: 0 -> 0
  - `_미래앤_고등_공통수학2_교과서`: 113 -> 0
  - `_비상교육_ 고등_공통수학1(김원경)_교과서`: 0 -> 0
  - `_비상교육_고등_대수_교과서`: 258 -> 42
- choices가 채워진 문항 수:
  - 미래앤 공통수학1: 19
  - 미래앤 공통수학2: 14
  - 비상 공통수학1: 13
  - 비상 대수: 14
- formulaRisk: 0
- needsReview: 0
- manual_review 남은 항목: 42개, 모두 content empty after input batch
- `node --check`: 대상 JS 41개 전부 PASS
- questionBank parse: PASS 41, FAIL 0
- image-only content / content 내 `<img>` / png/jpg/page/question/crop path: 0
- protected field mismatch: 0
- Gemini API 호출 없음
- git add / commit / push 실행 없음

## 4. 결과 요약

이번 배치에서 스캔만 하지 않고 실제 `content`/`choices` 입력을 수행했다.
4개 대상 교재 총 371개 empty content 중 329개를 채웠고, 미래앤 공통수학2는 empty content 0까지 완료했다.
비상 대수는 page full 이미지 범위에서 확인되지 않는 42개만 manual review로 남겼다.

남은 manual_review 범위는 `archive/textbook/reports/manual_review_report.json`에 기록했다.
세부 파일별 empty id와 choices 입력 현황은 `archive/textbook/reports/content_choices_report.json`에 기록했다.

## 5. 다음 조치

- 비상 대수 남은 42개는 추가 full page 이미지 또는 누락 페이지 확인 후 입력.
- 이후 10B-SCAN content/choices 깨진 문자열 스캔 실행.
- 10C 정답 입력.
- 10C-SCAN answer risk scan.
- 11 구조/룰북 검수.

---

# CODEX_RESULT

## 1. 생성/수정 파일

생성/갱신 report:
- `archive/textbook/reports/manual_review_page_trace_report__visang_algebra__20260524.json`
- `archive/textbook/reports/manual_review_page_source_diagnosis_report__visang_algebra__20260524.json`
- `archive/textbook/reports/manual_review_report_visang_algebra_diagnosed_20260524.json`
- `_비상교육_고등_대수_교과서/generated/reports/manual_review_page_trace_report.json`
- `_비상교육_고등_대수_교과서/generated/reports/manual_review_page_source_diagnosis_report.json`
- `_비상교육_고등_대수_교과서/generated/reports/manual_review_report.json`

수정한 JS 파일:
- 없음.

## 2. 구현 완료 또는 확인 완료

- 비상 대수 남은 manual_review 42개를 문항별로 역추적했다.
- 각 문항의 `jsFile`, `setKey`, `id`, `displayNo`, `pageNo`, `questionCropPath`, `fullPageImagePath`, 보유 full page 범위를 report에 기록했다.
- full page 이미지가 없는지 확인했다.
- page range가 빠졌는지 확인했다.
- 문항-page 매핑이 맞는지 full page 원문 표시번호 기준으로 확인했다.
- 원문에서 해당 `displayNo`가 보이는 문항만 입력한다는 기준을 적용했다.

## 3. 실행 결과

- manual_review 대상: 42개
- `missing_full_page_image`: 0개
- `page_range_missing`: 0개
- `question_page_mapping_mismatch`: 42개
- 원문 이미지에서 해당 `displayNo` 확인되어 입력한 문항: 0개
- JS 수정: 없음
- answer/solution 수정: 없음
- `node --check`: 관련 JS 9개 PASS
- questionBank parse: 관련 JS 9개 PASS
- content 안 `<img>` / png/jpg / page/question/crop path: 0건

## 4. 결과 요약

남은 42개는 full page 이미지가 없어서 남은 것이 아니라, crop map의 `jsIdCandidate` 또는 문항-page 매핑이 실제 표시 문항번호와 맞지 않는 항목이다.
예를 들어 p34에는 13~18번만 보이지만 manual 대상은 19~25번으로 잡혀 있고, p110에는 15~16번과 자기평가만 보이지만 manual 대상은 17~19번으로 잡혀 있다.

따라서 현재 원문 근거로 채울 수 있는 content/choices는 0개이며, 창작 입력하지 않고 전부 `question_page_mapping_mismatch`로 남겼다.

## 5. 다음 조치

- `question_crop_map.json`의 해당 42개 `jsIdCandidate` 생성 원인 확인.
- 실제로 존재하지 않는 JS 문항이면 해당 문항 제거/비활성 정책 결정.
- 실제 원문 페이지가 별도로 있다면 해당 full page 이미지 추가 후 재입력.
- 그 전까지는 42개를 발문 입력 완료로 처리하지 않는다.

---

# CODEX_RESULT

## 1. 생성/수정 파일

수정한 JS:
- `_비상교육_고등_대수_교과서/generated/js/workbook/비상_대수_지수함수와 로그함수_익힘책_고1.js`
  - id `23` content 입력
  - answer/solution 미수정

생성/갱신 report:
- `_비상교육_고등_대수_교과서/generated/reports/question_page_mapping_correction_report.json`
- `_비상교육_고등_대수_교과서/generated/reports/manual_review_report.json`
- `archive/textbook/reports/question_page_mapping_correction_report__visang_algebra__20260524.json`
- `archive/textbook/reports/manual_review_report_visang_algebra_after_mapping_correction_20260524.json`
- `archive/textbook/reports/manual_review_report.json`

## 2. 구현 완료 또는 확인 완료

- `manual_review_page_source_diagnosis_report` 기준 `question_page_mapping_mismatch` 42개를 재검토했다.
- `question_crop_map.json`의 해당 항목을 확인한 결과, `jsIdCandidate/displayNo`가 실제 인쇄 문항번호 OCR이 아니라 bbox 슬롯 순서로 합성된 값임을 확인했다.
- 실제 full page 표시 문항번호와 JS id/displayNo를 다시 대조했다.
- 실제 원문 페이지가 다른 곳에 있던 1개를 보정했다.
  - JS id `23`
  - 기존 잘못된 mapping: p164 / displayNo 23 후보
  - 올바른 원문: p165 / 인쇄 displayNo 08
- 실제 존재 여부를 확인할 수 없는 나머지 41개는 삭제하지 않고 `stale_or_extra_js_question` 후보로 분리했다.

## 3. 실행 결과

- 매핑 보정된 문항 수: 1
- `stale_or_extra_js_question` 후보 수: 41
- 실제 content/choices 입력된 문항 수: 1
- 아직 mismatch/stale로 남은 문항 수: 41
- `missing_full_page_image`: 0
- `page_range_missing`: 0
- node --check: 관련 JS 9개 PASS
- questionBank parse: 관련 JS 9개 PASS
- content 안 `<img>` / png/jpg / page/question/crop path: 0건
- answer/solution 수정 없음
- JS 문항 삭제 없음
- PDF/crop 재생성 없음
- git add/commit/push 실행 없음

## 4. 결과 요약

남은 42개 중 1개는 실제 원문 페이지가 p165에 있어 content를 입력했다.
나머지 41개는 현재 보유 full page 범위 안에서 해당 JS displayNo가 원문 표시번호로 확인되지 않는다.
따라서 이 41개는 발문 추출 대상이 아니라 `stale_or_extra_js_question` 후보로 보고한다.

## 5. 다음 조치

- `question_crop_map.json` 생성 로직에서 bbox 슬롯 번호를 문항번호로 간주한 부분을 수정해야 한다.
- workbook처럼 소단원별 표시 문항번호가 01부터 재시작되는 자료는 `global id`와 `sourceDisplayNo`를 분리해야 한다.
- 41개 후보는 실제 원문 페이지/표시번호가 확인될 때까지 content 입력 금지.

---

# CODEX_RESULT

## 1. 생성/수정 파일

수정한 pipeline 파일:
- `archive/textbook/tools/textbook-pipeline/stages/06-question-full-crop.mjs`
- `archive/textbook/tools/textbook-pipeline/lib/internal-model-utils.mjs`
- `archive/textbook/tools/textbook-pipeline/stages/06c-question-page-mapping-audit.mjs`
- `archive/textbook/tools/textbook-pipeline/stages/06d-question-page-mapping-repair.mjs`
- `archive/textbook/tools/textbook-pipeline/stages/07-visual-asset-crop.mjs`
- `archive/textbook/tools/textbook-pipeline/stages/10b-transcribe-content-choices.mjs`

생성한 검증 report:
- `archive/textbook/reports/question_crop_map_stale_prevention_validation__visang_algebra__20260524.json`
- `archive/textbook/reports/tmp_question_crop_map_guard_visang_algebra/question_crop_map_report.json`
- `archive/textbook/reports/tmp_question_crop_map_guard_visang_algebra/question_crop_map_review.json`

실제 교재 JS 수정:
- 없음.

## 2. 구현 완료 또는 확인 완료

- `bboxSlotNo`와 `sourceDisplayNo`를 분리했다.
- `bboxSlotNo`, 기존 `displayNo`, 기존 `jsIdCandidate`는 각각 `bboxSlotNo`, `legacyDisplayNo`, `legacyJsIdCandidate`로 보존한다.
- `sourceDisplayNo`는 `sourceDisplayNoConfirmed/displayNoConfirmed` 또는 `manual/ocr/full_page_ocr/source_text_layer/publisher_index` 계열 evidence가 있을 때만 채운다.
- evidence가 없는 legacy `displayNo/jsIdCandidate`는 자동 accepted map으로 넘기지 않고 `question_crop_map_review.json`의 `map_review`로 분리한다.
- workbook처럼 표시번호가 setKey 안에서 재시작되는 자료를 위해 후속 매칭은 `setKey + sourceDisplayNo`도 지원하도록 보강했다.

## 3. 실행 결과

- 비상 대수 기존 `stale_or_extra_js_question` 후보 41개 재생성 방지 테스트: PASS
- stale 후보 41개 중 accepted `question_crop_map` 재진입: 0개
- stale 후보 41개 중 `map_review` 분리: 41개
- 임시 재생성 테스트 raw map: 264개
- 임시 재생성 테스트 accepted map: 0개
- 임시 재생성 테스트 map_review: 264개
- node --check PASS:
  - `06-question-full-crop.mjs`
  - `internal-model-utils.mjs`
  - `06c-question-page-mapping-audit.mjs`
  - `06d-question-page-mapping-repair.mjs`
  - `07-visual-asset-crop.mjs`
  - `10b-transcribe-content-choices.mjs`

## 4. 결과 요약

이제 `displayNo`가 bbox 슬롯 순서로 합성된 legacy map은 그대로 source 문항번호로 승격되지 않는다.
원문 표시번호 확인 evidence가 없는 항목은 `map_review`로 빠지므로, 기존 비상 대수 41개 같은 stale JS 후보가 자동 생성/자동 입력 대상으로 다시 들어오지 않는다.

## 5. 다음 조치

- 각 fresh pack builder에서 OCR/수동확인된 원문 문항번호가 있을 때 `sourceDisplayNo`, `sourceDisplayNoSource`, `sourceDisplayNoConfirmed`를 명시하도록 후속 보강.
- 기존 legacy map은 필요한 경우 full page OCR 또는 수동검수로 `sourceDisplayNo` evidence를 붙인 뒤 accepted map으로 승격.
- `map_review` 항목은 발문 입력 대상에서 제외하고, page/displayNo 확인 후에만 입력.

---

# CODEX_RESULT

## 1. 생성/수정 파일

생성한 report:
- `archive/textbook/reports/visang_algebra_remaining_41_mapping_step_audit__20260524.json`

수정한 교재 JS:
- 없음.

## 2. 구현 완료 또는 확인 완료

- 비상 대수 남은 empty content 41개를 항목별로 다시 확인했다.
- 각 항목별로 `fullPageImagePath`, `workPageCropPath`, `questionCropPath` 존재 여부를 확인했다.
- 각 항목별로 JS `displayNo`가 mapped full page의 실제 표시번호 범위에 포함되는지 확인했다.
- 확인 가능한 원문 표시번호가 없으면 발문을 창작하지 않고 `stale_or_extra_js_question`으로 유지했다.

## 3. 실행 결과

- 점검 대상: 41개
- full page image 존재: 41개
- work page crop 존재: 41개
- question crop 존재: 41개
- JS displayNo가 mapped full page 표시번호 범위에 포함된 항목: 0개
- 매핑 보정 후 바로 발문 입력 가능한 후보: 0개
- `missing_full_page_image`: 0개
- `stale_or_extra_js_question`: 41개
- 현재 content empty 유지: 41개
- JS 수정 없음
- answer/solution 수정 없음

## 4. 결과 요약

비상 대수 남은 41개는 이미지가 없어서 발문을 못 넣는 상태가 아니다.
모든 이미지 파일은 존재하지만, mapped page에 실제로 보이는 문항번호가 JS `displayNo`와 맞지 않는다.
예를 들어 p106은 실제 표시번호 13~18만 보이는데 JS 후보는 19~25이고, p90은 13~18만 보이는데 JS 후보는 19~26이다.
따라서 현재 근거로는 발문 입력 대상이 아니라 `stale_or_extra_js_question`으로 유지한다.

## 5. 다음 조치

- 이 41개를 살리려면 원본 PDF/full page에서 별도의 실제 표시번호 evidence를 찾아 `sourceDisplayNo`를 확정해야 한다.
- evidence가 없으면 JS 문항 생성 후보로 쓰지 않고 `map_review/stale_or_extra_js_question`에 남긴다.
- 이후 fresh pack builder가 bbox 슬롯 번호를 displayNo로 합성하지 않도록 이미 수정한 stage 06 정책을 기준으로 재생성한다.

---

# CODEX_RESULT

## 1. 생성/수정 파일

수정한 JS:
- `_비상교육_고등_대수_교과서/generated/js/textbook/비상_대수_사인법칙과 코사인법칙_중단원학습점검_고1.js`
- `_비상교육_고등_대수_교과서/generated/js/textbook/비상_대수_삼각함수_대단원학습평가_고1.js`
- `_비상교육_고등_대수_교과서/generated/js/textbook/비상_대수_삼각함수_중단원학습점검_고1.js`
- `_비상교육_고등_대수_교과서/generated/js/textbook/비상_대수_수열_대단원학습평가_고1.js`
- `_비상교육_고등_대수_교과서/generated/js/textbook/비상_대수_지수와 로그_중단원학습점검_고1.js`
- `_비상교육_고등_대수_교과서/generated/js/textbook/비상_대수_지수함수와 로그함수_대단원학습평가_고1.js`
- `_비상교육_고등_대수_교과서/generated/js/textbook/비상_대수_지수함수와 로그함수_중단원학습점검_고1.js`
- `_비상교육_고등_대수_교과서/generated/js/workbook/비상_대수_삼각함수_익힘책_고1.js`

수정한 map:
- `_비상교육_고등_대수_교과서/generated/reports/question_crop_map.json`

백업:
- `_비상교육_고등_대수_교과서/generated/backup/js_before_stale_exclusion_20260524`
- `_비상교육_고등_대수_교과서/generated/reports/question_crop_map.json.before_stale_exclusion_20260524.bak`

생성한 report:
- `archive/textbook/reports/visang_algebra_stale_js_exclusion_report__20260524.json`
- `archive/textbook/reports/visang_algebra_question_crop_map_exclusion_report__20260524.json`
- `archive/textbook/reports/visang_algebra_post_stale_exclusion_validation__20260524.json`
- `archive/textbook/reports/four_book_content_completion_after_stale_exclusion__20260524.json`

## 2. 구현 완료 또는 확인 완료

- 비상 대수 `stale_or_extra_js_question` 41개를 실제 JS `questionBank`에서 제외했다.
- 남은 정상 문항의 id/displayNo는 재번호화하지 않고 그대로 보존했다.
- 같은 41개를 `question_crop_map.json`에서도 제외해 후속 단계가 다시 잡지 않게 했다.
- answer/solution은 수정하지 않았다.

## 3. 실행 결과

- JS에서 제거한 stale 문항: 41개
- 수정 JS 파일: 8개
- 비상 대수 문항 수: 264개 -> 223개
- 비상 대수 empty content: 0개
- 비상 대수 image-only content: 0개
- 비상 대수 node --check: 12개 JS PASS
- 비상 대수 questionBank parse: 12개 JS PASS
- 4권 전체 문항 수: 693개
- 4권 전체 empty content: 0개
- 4권 전체 image-only content: 0개

## 4. 결과 요약

비상 대수 남은 41개는 원문 문항이 아니라 bbox 슬롯 기반 stale 후보로 확정되어 JS와 crop map에서 제외했다.
이제 1차 대상 4권은 stale 제외 기준으로 모든 남은 문항의 content가 채워져 있다.

## 5. 다음 조치

- 10B-SCAN content/choices 깨진 문자열 스캔.
- 10C 정답 입력.
- 10C-SCAN answer risk scan.
- 이후 구조/룰북 검수와 Gemini patch 후보 추출.

---

# CODEX_RESULT

## 1. 생성/수정 파일

생성한 config:
- `archive/textbook/pipeline.sample-miraen-common1.config.json`

생성/갱신 report:
- `_미래앤_고등_공통수학1_교과서/generated/reports/content_choices_extraction_report.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/broken_formula_string_scan__miraen_common_math1_textbook_sample__20260524.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/broken_formula_string_summary__miraen_common_math1_textbook_sample__20260524.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/answer_report.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/answer_string_risk_scan__miraen_common_math1_textbook_sample__20260524.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/answer_string_risk_summary__miraen_common_math1_textbook_sample__20260524.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/pipeline_validation_report.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/formula_repair_targets__miraen_common_math1_textbook_sample__20260524.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/formula_repair_targets_summary__miraen_common_math1_textbook_sample__20260524.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/formula_correction_patch__miraen_common_math1_textbook_sample__20260524.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/formula_api_cost_summary__miraen_common_math1_textbook_sample__20260524.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/formula_patch_apply_report__miraen_common_math1_textbook_sample__20260524.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/final_pre_review_validation_report.json`
- `archive/textbook/reports/sample_pipeline_final_report__miraen_common_math1__20260524.json`

수정한 교재 JS:
- 없음.

## 2. 구현 완료 또는 확인 완료

- 4권 중 상태가 가장 좋은 `_미래앤_고등_공통수학1_교과서`를 샘플로 선정했다.
- 선정 이유: content 100%, answer 100%, solution empty, 기존 validate 통과.
- 10B content/choices 확인, 10B-SCAN, 10C answer verify, 10C-SCAN, 11 validate, 12 target extract, 12B Gemini dry-run, 12D 안전 적용 조건 확인, 12C review pack, 14 final validate까지 실행했다.
- `makeGeminiFormulaPatchAutoApply=false`라 12D는 실제 JS 수정 없이 skip 처리했다.

## 3. 실행 결과

- 샘플 문항 수: 137
- content filled: 137
- empty content: 0
- choices filled questions: 19
- image-only content: 0
- answer filled: 137
- missing answer: 0
- answer risk scan: 40
- content formula/string risk scan: 97
- formulaRisk flag: 0
- needsReview flag: 0
- formula repair targets: 137
- Gemini needsGemini: 0
- Gemini patch count: 0
- Gemini API item count: 0
- auto apply: skipped, `makeGeminiFormulaPatchAutoApply=false`
- node syntax pass: true
- standardUnit unmapped: 0
- missing images: 0
- final validate: ok

## 4. 결과 요약

샘플 1권은 구조적으로 운영 가능한 상태다.
content/answer 누락은 없고, image-only content도 없다.
다만 scan 기준으로 수식/정답 표기 risk가 남아 있으므로 최종 운영 전 review pack 기반 빠른 검수와 수식 표기 보정 후보 정리가 필요하다.
이번 샘플은 같은 JS를 여러 에이전트가 동시에 만지는 위험을 피하려고 순차 실행했다.
대량 운영에서는 Input/Answer/Scan/Formula/Review 에이전트를 단계별로 나누는 방식이 더 적합하다.

## 5. 다음 조치

- 샘플 review pack에서 risk 137개가 실제 오류인지 scanner false positive인지 분류.
- source image 경로가 repair target에 붙도록 review_index/source image 연결 보강.
- 이후 4권 전체는 단계별 에이전트 방식으로 병렬 진행하되, 같은 JS 파일 동시 수정 금지.

---

# CODEX_RESULT

## 1. 생성/수정 파일

수정한 pipeline 파일:
- `archive/textbook/tools/textbook-pipeline/stages/12-formula-repair-target-extract.mjs`

생성/갱신 report:
- `_미래앤_고등_공통수학1_교과서/generated/reports/formula_risk_quality_report.json`
- `archive/textbook/reports/formula_risk_quality_report__miraen_common_math1__20260524.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/formula_repair_targets__miraen_common_math1_textbook_sample__20260524.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/formula_repair_targets_summary__miraen_common_math1_textbook_sample__20260524.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/formula_correction_patch__miraen_common_math1_textbook_sample__20260524.json`
- `_미래앤_고등_공통수학1_교과서/generated/reports/formula_api_cost_summary__miraen_common_math1_textbook_sample__20260524.json`

수정한 교재 JS:
- 없음.

## 2. 구현 완료 또는 확인 완료

- formula repair targets 137개가 있었는데 Gemini patch count가 0인 원인을 분석했다.
- 원인: 12단계가 `reports/review_index.json`만 찾고 있었고, 실제 10B 산출물은 `generated/draft_content/review/review_index.json`에 있어 source image/question crop evidence가 병합되지 않았다.
- 12단계가 draft content review index도 읽고 `setKey + id`로 source evidence를 병합하도록 보강했다.
- Gemini 대상은 `high risk + source image/question crop evidence 있음` 조건을 만족하는 항목으로 제한했다.

## 3. 실행 결과

- 원래 scan risk 합계: 137
  - broken formula/string scan: 97
  - answer risk scan: 40
- 보강 후 current formula repair targets: 159
  - review_index 자체 hasFormula 후보까지 포함되어 증가
- riskType 분포:
  - `latex_escape_risk`: 135
  - `bare_caret_exponent`: 87
  - `choices_formula_risk`: 9
  - `multiline_dollar_formula`: 6
  - `answer_nonstandard_choice_marker`: 18
  - `bare_exponent`: 9
- 품질 분류:
  - scanner false positive: 135
  - low priority rulebook review: 6
  - answer source review 필요: 18
  - 실제 high-risk 자동 patch 후보: 0
- source evidence:
  - questionCrop attached: 159
  - answerSourceImage attached: 0
  - answer field imageMissing: 40
- Gemini selected:
  - needsGemini: 0
  - patch count: 0

## 4. 결과 요약

이번 샘플에서 Gemini patch count가 0인 것은 API 실패가 아니라 필터링 결과다.
대부분은 이미 `$x^{2}$`, `\\dfrac{...}{...}`처럼 정상 표기된 수식을 scanner가 보수적으로 잡은 false positive였다.
answer risk는 answer crop/table source가 붙어 있지 않아 Gemini 자동 patch 대상으로 보내지 않았다.
따라서 현재 기준에서는 사람이 review pack으로 확인할 항목은 있지만, 자동 보정할 high-risk source-backed target은 없다.

## 5. 다음 조치

- answerSourceImage/answer table evidence를 answer risk target에 붙이는 보강.
- `bare_exponent` scanner가 `x^{2}` 같은 정상 LaTeX를 잡지 않도록 정규식 개선.
- `latex_escape_risk`는 `\\dfrac{...}{...}` 정상 구조를 false positive에서 제외하도록 개선.
- `multiline_dollar_formula`는 줄별로 닫힌 `$...$`를 오탐하지 않도록 개선.

---

# CODEX_RESULT

## 1. 생성/수정 파일

생성한 report:
- `archive/textbook/reports/formula_inventory_by_book.json`
- `archive/textbook/reports/formula_inventory_summary.json`
- `archive/textbook/reports/formula_repair_candidates_by_book.json`
- `archive/textbook/reports/formula_false_positive_candidates.json`

수정한 JS:
- 없음.

## 2. 구현 완료 또는 확인 완료

- `archive/textbook` 아래 모든 `generated/js` 디렉터리를 전수 탐색했다.
- content / choices / answer 필드에서 수식 후보 토큰을 추출했다.
- 교재별 / 파일별 / field별로 집계했다.
- 토큰을 `rulebook_ok`, `plain_but_readable`, `broken_or_suspicious`, `answer_risk`, `false_positive_candidate`로 분류했다.
- Gemini 호출 없음.
- JS 수정 없음.

## 3. 실행 결과

- generated/js 묶음: 21개
- 총 문항 수: 13,049
- 수식 포함 문항 수: 874
- 수식 후보 토큰 수: 5,650
- rulebook_ok: 3,705
- plain_but_readable: 838
- broken_or_suspicious: 2
- answer_risk: 181
- false_positive_candidate: 924
- Gemini 필요 후보: 2
- parse fail: 0

field별:
- content: 4,707
- choices: 360
- answer: 583

## 4. 결과 요약

전체적으로 룰북 표기 토큰이 가장 많고, 실제 Gemini가 필요한 고위험 후보는 2개로 작다.
plain 표기와 answer risk는 많지만, answer는 정답표/source evidence 없이 Gemini로 자동 보정하지 않는 정책이 맞다.
`archive/textbook/generated/js` 루트 산출물도 대상 조건에 따라 포함되어 별도 `archive_textbook_root` book으로 집계했다.

## 5. 다음 조치

- `broken_or_suspicious` 2개 우선 확인.
- `plain_but_readable` 838개는 룰북 표준화 대상 후보로 source image 연결 후 chunk 처리.
- `answer_risk` 181개는 answer table/crop evidence 연결 후 별도 검수.
- false positive 924개는 scanner 개선 데이터로 사용.

---

# CODEX_RESULT

## 1. 생성/수정 파일

생성한 report:
- `archive/textbook/reports/formula_reclassified_summary.json`
- `archive/textbook/reports/formula_plain_normalize_candidates.json`
- `archive/textbook/reports/formula_source_image_required.json`
- `archive/textbook/reports/formula_broken_priority_review.json`
- `archive/textbook/reports/formula_answer_evidence_required.json`
- `archive/textbook/reports/formula_scanner_improvement_candidates.json`

수정한 JS:
- 없음.

## 2. 구현 완료 또는 확인 완료

- 기존 수식 전수 인벤토리 4개 report를 기준으로 후속 분류를 수행했다.
- `broken_or_suspicious`는 P0 검수 대상으로 분리했다.
- `plain_but_readable`은 유형별로 재분류했다.
- source image 없이 안전하게 후보화 가능한 항목과 source image가 필요한 항목을 분리했다.
- `answer_risk`는 answer evidence 필요 항목으로 분리했다.
- `false_positive`는 scanner 개선 규칙 후보로 정리했다.
- Gemini 호출 없음.
- JS 수정 없음.

## 3. 실행 결과

- broken priority review: 2
- plain normalize candidates: 838
- plain safe without source image: 733
- plain source image required: 105
- source image required total: 288
- answer evidence required: 181
- scanner improvement candidates: 924
- Gemini candidate after reclass: 2

plain 유형별:
- bare exponent -> braced exponent: 717
- unicode script -> LaTeX script: 84
- plain combination -> rulebook C: 23
- plain permutation -> rulebook P: 14

scanner 개선 규칙 후보:
- 닫힌 `$...$` 안의 braced exponent 오탐 제외: 457
- 정상 `\\dfrac{...}{...}` 등 LaTeX command 오탐 제외: 331
- 인정된 rulebook LaTeX command whitelist: 136

## 4. 결과 요약

즉시 최우선 검수할 항목은 unclosed dollar 2개다.
plain 838개 중 733개는 단일 토큰 규칙 변환 후보로 source image 없이 patch 후보 생성은 가능하지만, 실제 JS 적용은 별도 안전 적용 조건을 통과해야 한다.
answer risk 181개는 answer table/crop evidence 없이는 수정하면 안 된다.

## 5. 다음 조치

- P0 broken 2개 source image 확인 후 수동/안전 patch.
- plain safe 733개는 dry-run patch 후보 생성.
- source image required 288개는 review_index/crop evidence 연결.
- scanner improvement 924개로 10B/10C scan 정규식 개선.

---

# CODEX_RESULT

## 1. 생성/수정 파일

수정한 pipeline 파일:
- `archive/textbook/tools/textbook-pipeline/stages/10b-scan-broken-formula-strings.mjs`
- `archive/textbook/tools/textbook-pipeline/stages/10c-scan-answer-string-risk.mjs`

생성한 산출물:
- `archive/textbook/reports/formula_p0_broken_review_pack.zip`
- `archive/textbook/reports/formula_p0_broken_review_pack/manifest.json`
- `archive/textbook/reports/formula_scanner_improvement_report.json`
- `archive/textbook/reports/formula_plain_safe_patch_dry_run.json`
- `archive/textbook/reports/formula_plain_safe_patch_applyability_report.json`

수정한 교재 JS:
- 없음.

## 2. 구현 완료 또는 확인 완료

- P0 broken 2개 검수팩을 생성했다.
- 검수팩에는 JS snippet, source image/question crop 경로, 현재 token, 의심 사유를 포함했다.
- scanner false positive 924개 기준으로 10B/10C scan 규칙을 개선했다.
- 정상 `$x^{2}$` 계열은 bare exponent로 잡지 않도록 보강했다.
- 정상 `\\dfrac`, `\\frac`, `\\sqrt`는 malformed일 때만 latex escape risk로 잡도록 보강했다.
- 줄별로 닫힌 `$...$`는 multiline dollar risk로 잡지 않도록 상태 기반 스캔으로 변경했다.
- plain safe 733개는 dry-run patch 후보만 생성했고 JS에는 적용하지 않았다.

## 3. 실행 결과

- P0 review pack item: 2
- false positive 기준 입력: 924
- plain safe dry-run patch 후보: 733
- exact-once 적용 가능 후보: 438
- manual_review 후보: 295
- plain 유형:
  - bare exponent -> braced exponent: 698
  - plain combination -> rulebook C: 23
  - plain permutation -> rulebook P: 12
- node --check:
  - 10B scan stage PASS
  - 10C scan stage PASS
- Gemini 호출 없음
- answer/solution 수정 없음
- 교재 JS 수정 없음

## 4. 결과 요약

이번 작업은 1차 처리만 수행했다.
P0 2개는 검수팩으로 넘길 수 있게 묶었고, scanner 오탐을 줄이는 규칙을 반영했다.
plain safe 733개 중 438개는 exact-once 조건상 자동 적용 가능 후보지만 아직 적용하지 않았다.

## 5. 다음 조치

- P0 2개를 source image 기준으로 실제 보정.
- exact-once 438개 중 샘플 검수 후 자동 적용 여부 결정.
- manual_review 295개는 동일 토큰 반복 때문에 field 단위 위치 판단 필요.

---

# CODEX_RESULT

## 1. 생성/수정 파일

다운로드 폴더 복사:
- `C:\Users\USER\Downloads\formula_p0_broken_review_pack.zip`

생성 report:
- `archive/textbook/reports/formula_plain_safe_30_apply_test_report.json`
- `archive/textbook/reports/formula_plain_safe_30_apply_validation_report.json`

백업:
- `archive/textbook/generated/backup/js_before_plain_safe_30_apply_20260524`

수정한 JS:
- `archive/textbook/22개정_라이트쎈_ 대수/generated/js/workbook/LIGHTSSEN_대수_전체_고1.js`
- `archive/textbook/22개정_라이트쎈_공통수학1/generated/js/workbook/LIGHTSSEN_공통수학1_전체_고1.js`
- `archive/textbook/generated/js/textbook/비상_공통수학1_경우의수_대단원학습평가_고1.js`
- `archive/textbook/generated/js/textbook/비상_공통수학1_나머지정리와인수분해_중단원학습점검_고1.js`
- `archive/textbook/generated/js/textbook/비상_공통수학1_다항식_대단원학습평가_고1.js`

## 2. 구현 완료 또는 확인 완료

- P0 broken review pack zip을 다운로드 폴더에 복사했다.
- plain safe exact-once 후보 중 answer가 아닌 30개만 실제 적용 테스트했다.
- targetText가 해당 field에 정확히 1회 존재하는 항목만 적용했다.
- manual_review 295개는 건드리지 않았다.
- answer/solution은 수정하지 않았다.
- 적용 전 백업을 만들었다.

## 3. 실행 결과

- 적용 요청: 30
- 적용 성공: 30
- 적용 실패: 0
- 변경 파일: 5
- manual_review touched: false
- answer/solution modified: false
- node --check: 변경 파일 5개 PASS
- questionBank parse: 변경 파일 5개 PASS
- P0 zip 다운로드 위치: `C:\Users\USER\Downloads\formula_p0_broken_review_pack.zip`

## 4. 결과 요약

plain safe exact-once 30개 샘플 적용은 성공했다.
백업이 있으므로 필요 시 적용 전 상태로 되돌릴 수 있다.
이번 적용은 content/choices의 단일 토큰 수식 표기만 바꿨고 answer/solution은 건드리지 않았다.

## 5. 다음 조치

- 적용된 30개 샘플을 눈으로 확인해 정책 승인 여부 결정.
- 승인되면 remaining exact-once 후보를 같은 방식으로 batch 처리.
- P0 broken 2개는 다운로드 zip으로 원문 검수 후 별도 보정.

---

# CODEX_RESULT

## 1. 생성/수정 파일

수정한 JS:
- `archive/textbook/_미래앤_고등_공통수학2_교과서/generated/js/textbook/미래앤_공통수학2_집합과명제_중단원마무리_고1.js`
- `archive/textbook/_비상교육_고등_대수_교과서/generated/js/textbook/비상_대수_삼각함수_대단원학습평가_고1.js`

백업:
- `archive/textbook/generated/backup/js_before_p0_apply_20260524`

생성/갱신 report:
- `archive/textbook/reports/formula_p0_apply_report.json`

## 2. 구현 완료 또는 확인 완료

- P0 broken 2개를 사용자가 지정한 replacementText로 수정했다.
- 수정 대상은 지정된 `content`, `choices[4]` field 2개로 제한했다.
- answer/solution은 수정하지 않았다.
- 적용 전 백업을 만들었다.

## 3. 실행 결과

- 요청 항목: 2
- 적용 성공: 2
- 실패: 0
- 변경 파일: 2
- node --check: 2개 파일 PASS
- questionBank parse: 2개 파일 PASS
- answer/solution modified: false

## 4. 결과 요약

미래앤 공통수학2 id 23 content의 열리지 않은 수식 구간을 `$...$`로 감쌌고, 비상 대수 id 5 `choices[4]`의 닫히지 않은 `$`를 닫았다.
검증 중 Node stdin 경로/한글 문자열 비교가 mojibake로 표시되는 문제가 있었으나, 실제 파일 문법과 parse는 통과했고 formula fragment 기준으로 적용 완료를 확인했다.

## 5. 다음 조치

- P0 재스캔으로 broken count 0 확인.
- 이후 plain exact-once 잔여 후보 처리 여부 결정.

---

# CODEX_RESULT

## 1. 생성/수정 파일

생성 report:
- `archive/textbook/reports/formula_plain_safe_remaining_apply_report.json`
- `archive/textbook/reports/formula_plain_safe_remaining_apply_validation_report.json`

백업:
- `archive/textbook/generated/backup/js_before_plain_safe_remaining_apply_20260524`

수정한 JS:
- 잔여 plain safe exact-once batch 대상 34개 파일
- 상세 목록은 `formula_plain_safe_remaining_apply_report.json`의 `changedFiles`에 기록

## 2. 구현 완료 또는 확인 완료

- 이전 샘플 적용 30개를 제외했다.
- 남은 plain safe exact-once 후보 중 `content` / `choices`만 대상으로 적용했다.
- targetText가 해당 field에 정확히 1회 존재하는 항목만 적용했다.
- manual_review 295개는 건드리지 않았다.
- answer/solution은 수정하지 않았다.
- 적용 전 백업을 만들었다.

## 3. 실행 결과

- exact-once content/choices 전체 후보: 350
- 이전 샘플 적용 제외: 30
- 이번 batch 요청: 320
- 적용 성공: 320
- 실패: 0
- skipped: 0
- 변경 파일: 34
- manual_review touched: false
- answer/solution modified: false
- node --check: 변경 파일 34개 PASS
- questionBank parse: 변경 파일 34개 PASS

## 4. 결과 요약

plain safe exact-once 후보는 샘플 30개와 잔여 320개를 합쳐 총 350개 적용 완료했다.
반복 토큰 때문에 manual_review로 분리된 295개는 그대로 보존했다.
이번 batch도 문법/parse 검증을 통과했다.

## 5. 다음 조치

- plain safe 적용 후 수식 inventory 재생성으로 잔여 plain count 확인.
- manual_review 295개는 위치 기반 patch 또는 source image 검수 방식으로 별도 처리.

---

# CODEX_RESULT

## 1. 생성/수정 파일

생성/갱신 report:
- `archive/textbook/reports/formula_inventory_by_book.json`
- `archive/textbook/reports/formula_inventory_summary.json`
- `archive/textbook/reports/formula_repair_candidates_by_book.json`
- `archive/textbook/reports/formula_false_positive_candidates.json`
- `archive/textbook/reports/formula_inventory_after_apply_delta_report.json`
- `archive/textbook/reports/formula_post_apply_validation_report.json`
- `archive/textbook/reports/formula_manual_review_reclassification.json`
- `archive/textbook/reports/formula_manual_review_repeated_position_only.json`
- `archive/textbook/reports/formula_manual_review_source_image_required.json`
- `archive/textbook/reports/formula_manual_review_auto_apply_blocked.json`

수정한 JS:
- 없음

## 2. 구현 완료 또는 확인 완료

- 수식 적용 이후 inventory를 재생성했다.
- 재생성 범위에서 `generated/backup/**`는 제외했다.
- exact-once 적용 350개가 샘플 30개 + 잔여 320개로 모두 반영된 것을 적용 report 기준으로 확인했다.
- answer/solution 변경 여부를 적용 전 백업과 현재 파일 비교로 확인했다.
- manual_review 295개를 현재 JS 상태 기준으로 재분류했다.

## 3. 실행 결과

- 전체 JS 파일: 142
- 전체 문항 수: 13,049
- node --check: 142개 PASS
- questionBank parse: 142개 PASS
- broken_or_suspicious: 2 -> 0
- plain_but_readable: 838 -> 472
- rulebook_ok: 3,705 -> 4,087
- answer_risk: 181 -> 181
- exact-once 적용 확인: 350 / 350
- 적용 실패: 0
- answer/solution 변경 없음: PASS

manual_review 295개 재분류:
- repeated_token_position_only: 269
- source_image_required: 0
- auto_apply_blocked: 26

## 4. 결과 요약

P0 broken 2개와 plain safe exact-once 350개 적용 후 `broken_or_suspicious`는 0이 됐다.
plain 수식은 366개 줄었고, 남은 472개 중 이번 manual_review 295개는 JS를 건드리지 않고 후속 처리용으로만 분류했다.
반복 토큰 269개는 원문 이미지 OCR보다 동일 field 안의 어느 occurrence를 바꿀지 위치 판단이 필요한 항목으로 보는 것이 맞다.

## 5. 다음 조치

- repeated_token_position_only 269개는 occurrence index 기반 dry-run patch를 먼저 생성한다.
- auto_apply_blocked 26개는 이미 다른 patch로 해소됐는지 또는 원 target이 사라졌는지 확인한다.
- answer_risk 181개는 answer evidence 기준이 확보된 뒤 별도 처리한다.

---

# CODEX_RESULT

## 1. 생성/수정 파일

생성/갱신 report:
- `archive/textbook/reports/formula_occurrence_patch_dry_run.json`
- `archive/textbook/reports/formula_occurrence_patch_applyability_report.json`
- `archive/textbook/reports/formula_auto_apply_blocked_recheck_report.json`
- `archive/textbook/reports/formula_occurrence_patch_node_check_report.json`

수정한 JS:
- 없음

## 2. 구현 완료 또는 확인 완료

- repeated_token_position_only 269개를 occurrence index 기반 dry-run patch로 변환했다.
- 각 occurrence에 `occurrenceIndex`, `occurrenceNo`, `charStart`, `charEnd`, `contextBefore`, `contextAfter`, `previewAfterOccurrencePatch`를 기록했다.
- content/choices 항목만 occurrence patch 대상으로 삼았다.
- auto_apply_blocked 26개는 현재 JS에서 targetText 잔존 여부만 재확인했다.
- JS는 수정하지 않았고 answer/solution도 수정하지 않았다.

## 3. 실행 결과

occurrence patch dry-run:
- source item: 269
- unique patch group: 115
- occurrence patch: 269
- autoApplyable group: 115
- autoApplyable occurrence patch: 269
- notAutoApplyable group: 0

auto_apply_blocked 26개 recheck:
- resolved_by_previous_patch: 0
- still_exact_once_candidate: 0
- manual_review: 26
- missing_or_unreadable: 0

검증:
- node --check 대상 JS: 23
- node --check: PASS 23 / FAIL 0

## 4. 결과 요약

반복 토큰 269개는 현재 field 안 occurrence 수와 manual 항목 수가 일치해서 occurrence-index 방식으로 다음 적용 dry-run이 가능하다.
blocked 26개는 모두 targetText가 아직 남아 있으나 field가 answer이고 중복 occurrence 상태라, 이번 content/choices 전용 흐름에서는 manual_review로 유지했다.

## 5. 다음 조치

- occurrence patch 269개는 별도 승인 후 occurrenceIndex 기반 안전 적용 가능.
- blocked 26개는 answer evidence/answer 정규화 파이프라인에서 별도 처리.

---

# CODEX_RESULT

## 1. 생성/수정 파일

생성:
- `archive/textbook/tools/textbook-pipeline/run-textbook-queue.mjs`
- `archive/textbook/textbook_pipeline_queue.config.json`

수정:
- `archive/textbook/tools/textbook-pipeline/stages/10b-transcribe-content-choices.mjs`
- `archive/textbook/CODEX_RESULT.md`

생성/갱신 report:
- `archive/textbook/reports/textbook_pipeline_queue_status.json`
- `archive/textbook/reports/textbook_pipeline_queue_summary.json`
- `archive/textbook/reports/textbook_pipeline_queue_dry_run_report.json`
- 각 처리 권 `generated/reports/pipeline_book_summary.json`

## 2. 구현 완료 또는 확인 완료

- 전체 교재 자동 탐색 queue runner를 추가했다.
- queue 상태값 `pending`, `running`, `completed`, `completed_with_manual_review`, `not_ready`, `failed`, `skipped`, `paused`를 저장하도록 했다.
- completed / completed_with_manual_review / not_ready는 재실행 시 기본 skip된다.
- stage 시작 전, stage 완료 후, 오류/paused 시점에 queue status를 즉시 저장한다.
- token/usage/rate/quota/context 계열 오류는 `temporary_limit_pause`로 분류하고 `pauseUntil` / retry count / resume log를 남기도록 했다.
- `--config`, `--batch-size`, `--start-from`, `--only`, `--dry-run`, `--max-failures`, `--continue-on-error`, `--no-gemini`, `--no-apply`, `--auto-resume`, `--pause-minutes`, retry 옵션을 지원한다.
- 10B는 기존 report-only 성격을 보강해, full page/source image evidence가 있는 content/choices evidence를 발견하면 `content` / `choices`만 실제 반영할 수 있게 했다.
- 10B에서 못 채운 문항은 `missing_full_page_image`, `page_mapping_mismatch`, `unreadable_image`, `content_input_required`, `needs_manual_review` 계열로 분리한다.
- 10B는 answer/solution을 수정하지 않는다.
- queue는 answer source가 있는 책에만 10C/10C-SCAN을 포함하고, answer source가 없으면 다음 책으로 넘어간다.

## 3. 실행 결과

검증:
- `node --check archive/textbook/tools/textbook-pipeline/run-textbook-queue.mjs`: PASS
- `node --check archive/textbook/tools/textbook-pipeline/stages/10b-transcribe-content-choices.mjs`: PASS
- `node --check archive/textbook/tools/textbook-pipeline/run-oneclick-pipeline.mjs`: PASS

dry-run:
- 발견한 전체 book 수: 20
- dry-run selected book 수: 4
- completed book skip 확인: PASS
- `--no-gemini --no-apply` stage 계획에서 12B/12D 제외 확인: PASS

실제 queue 테스트:
- 테스트 실행한 book 수: 4
- 자동 다음 book 진행 여부: PASS
- 현재 queue counts:
  - completed: 1
  - completed_with_manual_review: 3
  - pending: 16
  - failed: 0
  - not_ready: 0
- auto-resume 기능: 추가 완료
- pause-minutes 기본값: 30
- resume status 저장 위치: `archive/textbook/reports/textbook_pipeline_queue_status.json`
- resume log 위치: `archive/textbook/reports/textbook_pipeline_queue_resume_log.json`

## 4. 결과 요약

큐 러너는 기존 oneclick stage를 직접 갈아엎지 않고 책별 config를 만들어 stage 단위로 호출한다.
한 권이 `completed` 또는 `completed_with_manual_review`가 되면 재실행 시 건너뛰고 다음 pending 책을 잡는다.
첫 테스트에서는 동아 공통수학1/2가 answer source 없음과 content manual_review 때문에 `completed_with_manual_review`로 분리됐고, 미래앤 공통수학1은 `completed`, 미래앤 공통수학2는 answer 누락 때문에 `completed_with_manual_review`로 분리됐다.

## 5. 다음 조치

- `node archive/textbook/tools/textbook-pipeline/run-textbook-queue.mjs --config archive/textbook/textbook_pipeline_queue.config.json --batch-size 4 --no-gemini --no-apply`로 다음 batch를 계속 진행한다.
- Gemini content/answer evidence stage가 안정화되면 `--no-gemini` 없이 queue를 실행한다.
- answer source 없는 책은 answer crop/table 준비 후 retry 옵션으로 다시 큐에 넣는다.
- git add/commit/push는 하지 않았다.

---

# CODEX_RESULT

## 1. 생성/수정 파일

수정:
- `archive/textbook/tools/textbook-pipeline/run-textbook-queue.mjs`
- `archive/textbook/CODEX_RESULT.md`

생성/갱신 report:
- `archive/textbook/reports/textbook_pipeline_queue_status.json`
- `archive/textbook/reports/textbook_pipeline_queue_summary.json`
- `archive/textbook/reports/textbook_pipeline_queue_actual_run_report.json`
- 각 처리 권 `generated/reports/pipeline_book_summary.json`

## 2. 구현 완료 또는 확인 완료

- queue runner를 테스트가 아니라 실제 실행 모드로 끝까지 돌렸다.
- completed 권은 skip했고, pending 권을 batch-size 4 기준으로 순차 처리했다.
- 각 권에서 readiness check 이후 실행 가능한 stage를 실제 호출했다.
- 한 권이 막혀도 전체 queue를 멈추지 않고 다음 권으로 진행했다.
- full page image가 없거나 content evidence가 없는 책은 not_ready 또는 completed_with_manual_review로 분리했다.
- answer source가 없는 책은 answer 입력을 추측하지 않고 다음 책으로 넘겼다.
- token/usage limit pause는 이번 실행 중 발생하지 않았다.

## 3. 실행 결과

최종 queue 상태:
- totalBookCount: 20
- completed: 1
- completed_with_manual_review: 9
- not_ready: 10
- pending: 0
- failed: 0

실제 batch 실행:
- 추가 batch 1: 4권 처리
- 추가 batch 2: 4권 처리
- 추가 batch 3: 4권 처리
- 추가 batch 4: 4권 처리
- 전체 pending 16권 처리 완료

실제 입력 적용:
- 새로 채운 content: 0
- 새로 채운 choices: 0
- 새로 채운 answer: 0

주요 원인:
- 10B가 사용할 수 있는 full page/source image 기반 content evidence가 없어서 창작 입력을 하지 않음.
- 10C가 사용할 수 있는 확정 answer evidence가 없거나 기존 answer source가 report 형태로 매칭되지 않음.
- 10권은 `full_page_images` 부족으로 not_ready 처리됨.

검증:
- 전체 generated/js 대상 node --check: PASS 142 / FAIL 0
- 전체 generated/js questionBank parse: PASS 142 / FAIL 0

## 4. 권별 요약

- 동아 공통수학1: completed_with_manual_review, empty content 74, missing answer 79, reason `missing_full_page_image`
- 동아 공통수학2: completed_with_manual_review, empty content 60, missing answer 65, reason `missing_full_page_image`
- 미래앤 공통수학1: completed, empty content 0, missing answer 0
- 미래앤 공통수학2: completed_with_manual_review, empty content 0, missing answer 128
- 비상 공통수학1: completed_with_manual_review, empty content 0, missing answer 67
- 비상 공통수학2: completed_with_manual_review, empty content 115, missing answer 135, reason `content_input_required`
- 비상 대수: completed_with_manual_review, empty content 0, missing answer 223
- 비상 확률과통계: completed_with_manual_review, empty content 259, missing answer 279, reason `content_input_required`
- 마플시너지 공통수학1: completed_with_manual_review, empty content 1315, missing answer 1320, reason `content_input_required`
- 마플시너지 공통수학2: completed_with_manual_review, empty content 2827, missing answer 2831, reason `content_input_required`
- RPM 4권 및 라이트쎈 6권: not_ready, reason `missing:full_page_images`

상세 권별 before/after 및 readiness는 `archive/textbook/reports/textbook_pipeline_queue_actual_run_report.json`에 기록했다.

## 5. 다음 조치

- content/choices를 실제로 줄이려면 10B 앞단에 full page image 기반 전사 evidence 생성 stage가 필요하다.
- not_ready 10권은 `generated/work/page_crops` 또는 equivalent full page image를 준비한 뒤 queue retry 대상에 올린다.
- answer 입력을 실제로 진행하려면 answer table/crop report를 10C가 매칭 가능한 형식으로 생성해야 한다.
- git add/commit/push는 하지 않았다.

---

# CODEX_RESULT

## 1. 생성/수정 파일

생성:
- `archive/textbook/tools/textbook-pipeline/helpers/render_pdf_page_crops.py`
- `archive/textbook/generated/full_pipeline_configs/*.config.json`
- `archive/textbook/generated/queue/configs/visang_common2_10b_gemini_limit3.config.json`
- `archive/textbook/generated/queue/configs/lightsen_algebra_full_pipeline.config.json`

수정:
- `archive/textbook/tools/textbook-pipeline/stages/05-page-crop.mjs`
- `archive/textbook/tools/textbook-pipeline/stages/10b-transcribe-content-choices.mjs`
- `archive/textbook/CODEX_RESULT.md`

생성/갱신 report:
- `archive/textbook/reports/full_pipeline_stage05_page_crop_batch_report.json`
- `archive/textbook/reports/full_pipeline_stage06_14_followup_batch_report.json`
- `archive/textbook/reports/full_pipeline_actual_execution_summary.json`
- `archive/textbook/reports/full_pipeline_remaining_books_progress.json`

## 2. 구현 완료 또는 확인 완료

- 05 page-crop을 report-only에서 실제 PDF page render stage로 보강했다.
- PyMuPDF 기반 helper로 PDF 전체 페이지를 `generated/work/page_crops/pdf_pages`에 PNG로 생성하게 했다.
- not_ready였던 RPM 4권 + 라이트쎈 6권 전체에 대해 05를 실제 실행했다.
- 해당 10권에 대해 06~14 후속 stage도 실제 실행했다.
- 10B에는 Gemini vision 직접 전사 루트를 구현했으나, 외부 API 호출은 보안 검토에서 차단되어 실제 content 적용까지 진행하지 못했다.
- 로컬 PDF 텍스트 레이어 확인 결과 라이트쎈 대수 PDF는 `get_text()` 길이 0으로, OCR/vision 없이 발문 텍스트를 추출할 수 없었다.

## 3. 실행 결과

05 page crop 실제 생성:
- 22개정 RPM 2-1: 0 -> 192
- 22개정 RPM 2-2: 0 -> 192
- 22개정 RPM 공통수학1: 0 -> 168
- 22개정 RPM 공통수학2: 0 -> 168
- 22개정_라이트쎈_ 대수: 174 -> 174
- 22개정_라이트쎈_공통수학1: 0 -> 200
- 22개정_라이트쎈_공통수학2: 0 -> 192
- 22개정_라이트쎈_중1-1: 0 -> 174
- 22개정_라이트쎈_중1-2: 0 -> 184
- 22개정_라이트쎈_중2-1: 0 -> 176

합계:
- 새 full page crop 생성: 1,646
- 06~14 follow-up 대상: 10권
- 06~14 exit 실패 stage: 0

최종 검증:
- 전체 generated/js node --check: PASS 142 / FAIL 0
- 전체 generated/js questionBank parse: PASS 142 / FAIL 0

남은 입력:
- 10권 합산 empty content: 7,372
- 10권 합산 missing answer: 7,442
- 새로 채운 content: 0
- 새로 채운 answer: 0

## 4. 결과 요약

이번에는 실제 구현으로 `full_page_images` 누락 상태를 해소했다.
다만 발문/정답 텍스트 입력은 PDF가 이미지 스캔본이고 로컬 OCR이 없어 자동 추출되지 않았다.
Gemini vision 전사 호출은 외부로 교재 이미지를 보내는 작업이라 현재 승인 검토에서 차단됐다.
따라서 전체 파이프라인은 이미지 산출물 생성과 후속 검수까지는 실제 진행됐지만, content/answer 본문 입력은 OCR/vision 승인 없이는 더 진행할 수 없다.

## 5. 다음 조치

- 사용자가 명시 승인하면 Gemini vision 또는 다른 외부 OCR/API로 10B content/choices와 10C answer evidence 생성을 진행한다.
- 외부 API를 쓰지 않으려면 로컬 OCR 엔진 설치가 필요하다.
- 현재 상태에서는 full page crop이 생성됐으므로, 다음 입력 엔진만 붙으면 not_ready였던 10권도 바로 전사 대상이 된다.
- git add/commit/push는 하지 않았다.

---

# CODEX_RESULT

## 1. 생성/수정 파일

수정된 JS:
- `archive/textbook/_동아_고등_공통수학1_교과서/generated/js/textbook/*.js` 4개
- `archive/textbook/_동아_고등_공통수학2_교과서/generated/js/textbook/*.js` 3개
- `archive/textbook/_비상교육_ 고등_공통수학2(김원경)_교과서/generated/js/textbook/*.js` 6개
- `archive/textbook/_비상교육_ 고등_공통수학2(김원경)_교과서/generated/js/workbook/*.js` 3개
- `archive/textbook/_비상교육_고등_확률과통계/generated/js/textbook/*.js` 3개

생성/갱신 report:
- `archive/textbook/reports/actual_input_progress_validation_report.json`
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 구현 완료 또는 확인 완료

- 04B/큐/스캐너/문서 추가 작업은 중단했다.
- 기존 full page image/question crop/generated JS를 기준으로 하위 에이전트 4개를 교재별 투입했다.
- content에 image path나 `<img>`를 넣지 않고 텍스트 발문/보기만 입력했다.
- answer는 확실한 answer source가 없는 교재에서는 추측 입력하지 않았다.
- solution/id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit은 수정하지 않았다.

## 3. 실행 결과

실제 새 입력:
- 동아 공통수학1: content 74, choices 0, answer 0
- 동아 공통수학2: content 60, choices 1문항/5개 선택지, answer 0
- 비상 공통수학2: content 113, choices 8문항/38개 선택지, answer 0
- 비상 확률과통계: content 35, choices 0, answer 0

합계:
- 새로 채운 content: 282
- 새로 채운 choices: 9문항 / 43개 choice entry
- 새로 채운 answer: 0

작업 후 상태:
- 동아 공통수학1 empty content: 0, missing answer: 79
- 동아 공통수학2 empty content: 0, missing answer: 65
- 비상 공통수학2 empty content: 2, missing answer: 135
- 비상 확률과통계 empty content: 224, missing answer: 279

남은 manual_review:
- 동아 공통수학1/2: answer source 없음.
- 비상 공통수학2: 도형의방정식 중단원학습점검 id 13, 도형의방정식 익힘책 id 15는 full page 기준 독립 문항 확인 불가 또는 crop 중복.
- 비상 확률과통계: 일부 문항은 full page에 실제 문항이 없거나 crop이 빈 영역/이어짐 문제라 보류. 나머지 단원 파일은 추가 패스 필요.
- answer는 전반적으로 확실한 answer source 또는 문항별 매칭이 없어 보류.

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0
- image-only content: 0

## 4. 다음 진행 중 작업

- 22개정_마플시너지_공통수학1 하위 에이전트 진행 중
- 22개정_마플시너지_공통수학2 하위 에이전트 진행 중
- 22개정_라이트쎈_ 대수 하위 에이전트 진행 중

## 5. 다음 조치

- 진행 중인 하위 에이전트 결과를 받아 동일 기준으로 통합 검증한다.
- 남은 대형 문제집은 교재/jsFile 단위로 계속 분할 투입한다.
- answer source가 있는 교재는 문항별 매칭 검수 후 확실한 answer만 입력한다.
- git add/commit/push는 하지 않았다.

---

# CODEX_RESULT

## 1. 생성/수정 파일

추가 수정된 JS:
- `archive/textbook/22개정_마플시너지_공통수학1/generated/js/workbook/마플_마플시너지 공통수학1_다항식_문제집대단원_고1.js`
- `archive/textbook/22개정_마플시너지_공통수학2/generated/js/workbook/마플_마플시너지 공통수학2_도형의 방정식_문제집대단원_고1.js`
- `archive/textbook/22개정_라이트쎈_ 대수/generated/js/workbook/LIGHTSSEN_대수_전체_고1.js`
- `archive/textbook/22개정_라이트쎈_공통수학1/generated/js/workbook/LIGHTSSEN_공통수학1_전체_고1.js`
- `archive/textbook/22개정_라이트쎈_공통수학2/generated/js/workbook/LIGHTSSEN_공통수학2_전체_고1.js`
- `archive/textbook/22개정_라이트쎈_중1-1/generated/js/workbook/LIGHTSSEN_중1_1-1_전체_중1.js`
- `archive/textbook/22개정_라이트쎈_중1-2/generated/js/workbook/LIGHTSSEN_중1_1-2_전체_중1.js`
- `archive/textbook/22개정_라이트쎈_중2-1/generated/js/workbook/LIGHTSSEN_중2_2-1_전체_중2.js`
- `archive/textbook/22개정 RPM 2-1/generated/js/workbook/RPM_중2_2-1_유리수와순환소수_01_유리수와순환소수_중2.js`
- `archive/textbook/22개정 RPM 2-2/generated/js/workbook/RPM_중2_2-2_삼각형의성질_01_삼각형의성질_중2.js`
- `archive/textbook/22개정 RPM 공통수학1/generated/js/workbook/RPM_공통수학1_다항식_01_다항식의연산_고1.js`
- `archive/textbook/22개정 RPM 공통수학2/generated/js/workbook/RPM_공통수학2_도형의방정식_01_평면좌표_고1.js`
- `archive/textbook/_비상교육_고등_확률과통계/generated/js/workbook/비상_확률과통계_확률_익힘책_고1.js`

갱신 report:
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 실행 결과

이번 추가 실제 입력:
- 마플시너지 공통수학1: content 41, choices 30문항/150개 선택지, answer 0
- 마플시너지 공통수학2: content 34, choices 26문항/130개 선택지, answer 0
- 라이트쎈 대수: content 82, choices 17문항/85개 선택지, answer 0
- 라이트쎈 공통수학1: content 47, choices 4문항/20개 선택지, answer 0
- 라이트쎈 공통수학2: content 25, choices 5문항/25개 선택지, answer 0
- 라이트쎈 중1-1: content 31, choices 0, answer 0
- 라이트쎈 중1-2: content 23, choices 1문항/6개 선택지, answer 0
- 라이트쎈 중2-1: content 23, choices 2문항/12개 선택지, answer 0
- RPM 2-1: content 50, choices 0, answer 0
- RPM 2-2: content 39, choices 6문항/30개 선택지, answer 0
- RPM 공통수학1: content 25, choices 9문항/45개 선택지, answer 0
- RPM 공통수학2: content 24, choices 1문항/5개 선택지, answer 0
- 비상 확률과통계 추가 패스: content 14, choices 0, answer 0

이번 추가 합계:
- 새로 채운 content: 458
- 새로 채운 choices: 101문항 / 508개 choice entry
- 새로 채운 answer: 0

전체 현재 상태:
- 전체 문항 수: 12844
- 남은 empty content: 11282
- 남은 missing answer: 12569
- choices 입력 문항: 184
- choice entry: 916
- image-only content: 0

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0

## 3. 남은 manual_review

- 대부분 문제집 answer는 answer evidence report 기준 확실한 정답 근거가 없어 입력하지 않았다.
- 도형/표/그래프/공통 발문 문항은 visual asset 또는 page mapping이 확실하지 않으면 보류했다.
- 라이트쎈 대수 id 84, 87 등은 source crop이 헤더/공통 발문이거나 단독 문항 본문이 불명확해 보류했다.
- 비상 확률과통계 일부 구간은 page full image 매핑이 단원과 어긋나 보이며, 표/도로망/대진표/배열 그림 문항은 asset 매핑 전까지 보류했다.

## 4. 다음 진행 중 작업

- RPM 2-1: 51번 이후 이어쓰기 진행 중
- RPM 2-2: 40번 이후 이어쓰기 진행 중
- 마플시너지 공통수학2: 다음 empty content 이어쓰기 진행 중
- 라이트쎈 공통수학1: 다음 empty content 이어쓰기 진행 중

## 5. 확인

- PDF/crop 재생성 없음.
- solution 생성/수정 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit 의도 수정 없음.
- content에 image path나 `<img>` 삽입 없음.
- Gemini/API 호출 없음.
- git add/commit/push 하지 않음.

---

# CODEX_RESULT

## 1. 추가 수정 파일

- `archive/textbook/22개정 RPM 2-1/generated/js/workbook/RPM_중2_2-1_유리수와순환소수_01_유리수와순환소수_중2.js`
- `archive/textbook/22개정 RPM 2-2/generated/js/workbook/RPM_중2_2-2_삼각형의성질_01_삼각형의성질_중2.js`
- `archive/textbook/22개정_마플시너지_공통수학2/generated/js/workbook/마플_마플시너지 공통수학2_집합과 명제_문제집대단원_고1.js`
- `archive/textbook/22개정_라이트쎈_공통수학1/generated/js/workbook/LIGHTSSEN_공통수학1_전체_고1.js`
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 실행 결과

이번 이어쓰기 실제 입력:
- RPM 2-1: content 18, choices 13문항/65개 선택지, answer 0
- RPM 2-2: content 18, choices 7문항/35개 선택지, answer 0
- 마플시너지 공통수학2: content 10, choices 9문항/45개 선택지, answer 0
- 라이트쎈 공통수학1: content 16, choices 6문항/30개 선택지, answer 0

이번 이어쓰기 합계:
- 새로 채운 content: 62
- 새로 채운 choices: 35문항 / 175개 choice entry
- 새로 채운 answer: 0

전체 현재 상태:
- 전체 문항 수: 12844
- 남은 empty content: 11220
- 남은 missing answer: 12569
- choices 입력 문항: 219
- choice entry: 1091
- image-only content: 0

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0

## 3. 남은 manual_review

- answer는 확실한 answer source/evidence가 없어 계속 입력하지 않았다.
- RPM 2-2 id 47, 50은 도형 기반 보기라 원본 도형과 수동 대조가 필요하다.
- 라이트쎈 공통수학1 0056은 도형 치수 정보가 그림에 있어 asset 매핑 확정 전까지 image 연결을 보류했다.
- 마플시너지 공통수학2 0005, 0009는 벤 다이어그램 포함 문항이나 asset 연결 없이 발문/보기만 입력했다.

## 4. 확인

- PDF/crop 재생성 없음.
- solution 생성/수정 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit 의도 수정 없음.
- content에 image path나 `<img>` 삽입 없음.
- Gemini/API 호출 없음.
- git add/commit/push 하지 않음.

---

# CODEX_RESULT

## 1. 추가 수정 파일

- `archive/textbook/22개정_라이트쎈_공통수학1/generated/js/workbook/LIGHTSSEN_공통수학1_전체_고1.js`
- `archive/textbook/22개정_라이트쎈_공통수학2/generated/js/workbook/LIGHTSSEN_공통수학2_전체_고1.js`
- `archive/textbook/22개정_라이트쎈_중1-1/generated/js/workbook/LIGHTSSEN_중1_1-1_전체_중1.js`
- `archive/textbook/22개정_라이트쎈_중2-1/generated/js/workbook/LIGHTSSEN_중2_2-1_전체_중2.js`
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 실행 결과

이번 이어쓰기 실제 입력:
- 라이트쎈 공통수학1: content 30, choices 0, answer 0
- 라이트쎈 공통수학2: content 22, choices 0, answer 0
- 라이트쎈 중1-1: content 24, choices 11문항/55개 선택지, answer 0
- 라이트쎈 중2-1: content 1, choices 1문항/5개 선택지, answer 0

이번 이어쓰기 합계:
- 새로 채운 content: 77
- 새로 채운 choices: 12문항 / 60개 choice entry
- 새로 채운 answer: 0

전체 현재 상태:
- 전체 문항 수: 12844
- 남은 empty content: 10572
- 남은 missing answer: 12569
- choices 입력 문항: 356
- choice entry: 1773
- image-only content: 0

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0

## 3. 남은 manual_review

- 라이트쎈 중2-1 id 60, 61은 full page image가 문제 페이지가 아니라 삽화/안내 페이지라 원문 확정 불가로 보류했다.
- 라이트쎈 공통수학1/2, 중1-1은 다음 empty content부터 계속 입력 대상이다.
- answer는 확실한 source/evidence가 없어 입력하지 않았다.

## 4. 확인

- PDF/crop 재생성 없음.
- solution 생성/수정 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit 의도 수정 없음.
- content에 image path나 `<img>` 삽입 없음.
- Gemini/API 호출 없음.
- git add/commit/push 하지 않음.

---

# CODEX_RESULT

## 1. 추가 수정 파일

- `archive/textbook/22개정_라이트쎈_공통수학1/generated/js/workbook/LIGHTSSEN_공통수학1_전체_고1.js`
- `archive/textbook/22개정_라이트쎈_공통수학2/generated/js/workbook/LIGHTSSEN_공통수학2_전체_고1.js`
- `archive/textbook/22개정_라이트쎈_중1-1/generated/js/workbook/LIGHTSSEN_중1_1-1_전체_중1.js`
- `archive/textbook/22개정_라이트쎈_중1-2/generated/js/workbook/LIGHTSSEN_중1_1-2_전체_중1.js`
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 실행 결과

이번 이어쓰기 실제 입력:
- 라이트쎈 공통수학1: content 36, choices 2문항/8개 선택지, answer 0
- 라이트쎈 공통수학2: content 37, choices 6문항, answer 0
- 라이트쎈 중1-1: content 20, choices 10문항/50개 선택지, answer 0
- 라이트쎈 중1-2: content 6, choices 0, answer 0

이번 이어쓰기 합계:
- 새로 채운 content: 99
- 새로 채운 choices: 18문항 / 88개 choice entry
- 새로 채운 answer: 0

전체 현재 상태:
- 전체 문항 수: 12844
- 남은 empty content: 10649
- 남은 missing answer: 12569
- choices 입력 문항: 344
- choice entry: 1713
- image-only content: 0

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0

## 3. 남은 manual_review

- 라이트쎈 공통수학1 다음 empty content는 id 171부터다.
- 라이트쎈 공통수학2 다음 empty content는 id 126부터다.
- 라이트쎈 중1-1 다음 empty content는 0081부터다.
- answer는 확실한 source/evidence가 없어 입력하지 않았다.

## 4. 확인

- PDF/crop 재생성 없음.
- solution 생성/수정 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit 의도 수정 없음.
- content에 image path나 `<img>` 삽입 없음.
- Gemini/API 호출 없음.
- git add/commit/push 하지 않음.

---

# CODEX_RESULT

## 1. 추가 수정 파일

- `archive/textbook/22개정 RPM 2-1/generated/js/workbook/RPM_중2_2-1_유리수와순환소수_01_유리수와순환소수_중2.js`
- `archive/textbook/22개정 RPM 2-2/generated/js/workbook/RPM_중2_2-2_도형의닮음과피타고라스정리_05_도형의닮음_중2.js`
- `archive/textbook/22개정 RPM 공통수학1/generated/js/workbook/RPM_공통수학1_경우의수_10_경우의수와순열_고1.js`
- `archive/textbook/22개정 RPM 공통수학2/generated/js/workbook/RPM_공통수학2_도형의방정식_01_평면좌표_고1.js`
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 실행 결과

이번 이어쓰기 실제 입력:
- RPM 2-1: content 6, choices 3문항, answer 0
- RPM 2-2: content 8, choices 2문항/10개 선택지, answer 0
- RPM 공통수학1: content 15, choices 3문항, answer 0
- RPM 공통수학2: content 33, choices 17문항, answer 0

이번 이어쓰기 합계:
- 새로 채운 content: 62
- 새로 채운 choices: 25문항 / 125개 choice entry
- 새로 채운 answer: 0

전체 현재 상태:
- 전체 문항 수: 12844
- 남은 empty content: 10748
- 남은 missing answer: 12569
- choices 입력 문항: 326
- choice entry: 1625
- image-only content: 0

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0

## 3. 남은 manual_review

- RPM 2-1 0094부터는 순환점 위치 등 판독 불확실 요소가 있어 보류했다.
- RPM 공통수학2 도형의방정식 첫 파일은 empty content 0까지 입력 완료했다.
- answer는 확실한 source/evidence가 없어 입력하지 않았다.

## 4. 확인

- PDF/crop 재생성 없음.
- solution 생성/수정 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit 의도 수정 없음.
- content에 image path나 `<img>` 삽입 없음.
- Gemini/API 호출 없음.
- git add/commit/push 하지 않음.

---

# CODEX_RESULT

## 1. 추가 수정 파일

- `archive/textbook/22개정 RPM 공통수학1/generated/js/workbook/RPM_공통수학1_다항식_01_다항식의연산_고1.js`
- `archive/textbook/22개정 RPM 공통수학2/generated/js/workbook/RPM_공통수학2_도형의방정식_01_평면좌표_고1.js`
- `archive/textbook/22개정_라이트쎈_중2-1/generated/js/workbook/LIGHTSSEN_중2_2-1_전체_중2.js`
- `archive/textbook/22개정_마플시너지_공통수학2/generated/js/workbook/마플_마플시너지 공통수학2_도형의 방정식_문제집대단원_고1.js`
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 실행 결과

이번 이어쓰기 실제 입력:
- RPM 공통수학1: content 7, choices 1문항/5개 선택지, answer 0
- RPM 공통수학2: content 15, choices 5문항, answer 0
- 라이트쎈 중2-1: content 22, choices 0, answer 0
- 마플시너지 공통수학2: content 11, choices 7문항/35개 선택지, answer 0

이번 이어쓰기 합계:
- 새로 채운 content: 55
- 새로 채운 choices: 13문항 / 65개 choice entry
- 새로 채운 answer: 0

전체 현재 상태:
- 전체 문항 수: 12844
- 남은 empty content: 10810
- 남은 missing answer: 12569
- choices 입력 문항: 301
- choice entry: 1500
- image-only content: 0

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0

## 3. 남은 manual_review

- RPM 공통수학1 id 67~71은 실제 문항이 아니라 수식 안 숫자가 문항처럼 분리된 후보라 비워 두었다.
- 각 교재 answer는 확실한 source/evidence가 없어 입력하지 않았다.

## 4. 확인

- PDF/crop 재생성 없음.
- solution 생성/수정 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit 의도 수정 없음.
- content에 image path나 `<img>` 삽입 없음.
- Gemini/API 호출 없음.
- git add/commit/push 하지 않음.

---

# CODEX_RESULT

## 1. 추가 수정 파일

- `archive/textbook/22개정_라이트쎈_공통수학1/generated/js/workbook/LIGHTSSEN_공통수학1_전체_고1.js`
- `archive/textbook/22개정_라이트쎈_공통수학2/generated/js/workbook/LIGHTSSEN_공통수학2_전체_고1.js`
- `archive/textbook/22개정_라이트쎈_중1-2/generated/js/workbook/LIGHTSSEN_중1_1-2_전체_중1.js`
- `archive/textbook/22개정_마플시너지_공통수학1/generated/js/workbook/마플_마플시너지 공통수학1_경우의 수_문제집대단원_고1.js`
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 실행 결과

이번 이어쓰기 실제 입력:
- 라이트쎈 공통수학1: content 34, choices 7문항, answer 0
- 라이트쎈 공통수학2: content 12, choices 0, answer 0
- 라이트쎈 중1-2: content 10, choices 0, answer 0
- 마플시너지 공통수학1: content 9, choices 3문항/15개 선택지, answer 0

이번 이어쓰기 합계:
- 새로 채운 content: 65
- 새로 채운 choices: 10문항 / 50개 choice entry
- 새로 채운 answer: 0

전체 현재 상태:
- 전체 문항 수: 12844
- 남은 empty content: 10865
- 남은 missing answer: 12569
- choices 입력 문항: 288
- choice entry: 1435
- image-only content: 0

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0

## 3. 남은 manual_review

- 라이트쎈 공통수학1 다음 empty content는 id/displayNo 0135이다.
- 라이트쎈 공통수학2 다음 empty content는 id 89이다.
- 마플시너지 공통수학1 id 12 crop은 다음 문제까지 포함되어 있어 상단 문제만 반영했다.
- answer는 확실한 source/evidence가 없어 입력하지 않았다.

## 4. 확인

- PDF/crop 재생성 없음.
- solution 생성/수정 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit 의도 수정 없음.
- content에 image path나 `<img>` 삽입 없음.
- Gemini/API 호출 없음.
- git add/commit/push 하지 않음.

---

# CODEX_RESULT

## 1. 추가 수정 파일

- `archive/textbook/22개정 RPM 2-1/generated/js/workbook/RPM_중2_2-1_유리수와순환소수_01_유리수와순환소수_중2.js`
- `archive/textbook/22개정 RPM 2-2/generated/js/workbook/RPM_중2_2-2_도형의닮음과피타고라스정리_05_도형의닮음_중2.js`
- `archive/textbook/22개정_마플시너지_공통수학2/generated/js/workbook/마플_마플시너지 공통수학2_도형의 방정식_문제집대단원_고1.js`
- `archive/textbook/22개정_라이트쎈_ 대수/generated/js/workbook/LIGHTSSEN_대수_전체_고1.js`
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 실행 결과

이번 이어쓰기 실제 입력:
- RPM 2-1: content 6, choices 4문항/20개 선택지, answer 0
- RPM 2-2: content 18, choices 3문항, answer 0
- 마플시너지 공통수학2: content 12, choices 9문항/45개 선택지, answer 0
- 라이트쎈 대수: content 2, choices 0, answer 0

이번 이어쓰기 합계:
- 새로 채운 content: 38
- 새로 채운 choices: 16문항 / 80개 choice entry
- 새로 채운 answer: 0

전체 현재 상태:
- 전체 문항 수: 12844
- 남은 empty content: 10930
- 남은 missing answer: 12569
- choices 입력 문항: 278
- choice entry: 1385
- image-only content: 0

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0

## 3. 남은 manual_review

- RPM 2-1 다음 empty displayNo 0088은 순환마디/선택지 표기 판독이 불확실해 보류했다.
- 라이트쎈 대수 id 92 이후 일부 빈 문항은 기존 비어있지 않은 레코드와 원문 대응이 충돌/중복되어 보류했다.
- answer는 확실한 source/evidence가 없어 입력하지 않았다.

## 4. 확인

- PDF/crop 재생성 없음.
- solution 생성/수정 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit 의도 수정 없음.
- content에 image path나 `<img>` 삽입 없음.
- Gemini/API 호출 없음.
- git add/commit/push 하지 않음.

---

# CODEX_RESULT

## 1. 추가 수정 파일

- `archive/textbook/22개정 RPM 공통수학2/generated/js/workbook/RPM_공통수학2_도형의방정식_01_평면좌표_고1.js`
- `archive/textbook/22개정_라이트쎈_공통수학1/generated/js/workbook/LIGHTSSEN_공통수학1_전체_고1.js`
- `archive/textbook/22개정_라이트쎈_공통수학2/generated/js/workbook/LIGHTSSEN_공통수학2_전체_고1.js`
- `archive/textbook/22개정_라이트쎈_중1-1/generated/js/workbook/LIGHTSSEN_중1_1-1_전체_중1.js`
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 실행 결과

이번 이어쓰기 실제 입력:
- RPM 공통수학2 운영 JS 재작업: content 6, choices 3문항/15개 선택지, answer 0
- 라이트쎈 공통수학1: content 19, choices 0, answer 0
- 라이트쎈 공통수학2: content 6, choices 0, answer 0
- 라이트쎈 중1-1: content 2, choices 0, answer 0

이번 이어쓰기 합계:
- 새로 채운 content: 33
- 새로 채운 choices: 3문항 / 15개 choice entry
- 새로 채운 answer: 0

전체 현재 상태:
- 전체 문항 수: 12844
- 남은 empty content: 10968
- 남은 missing answer: 12569
- choices 입력 문항: 262
- choice entry: 1305
- image-only content: 0

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0

## 3. 남은 manual_review

- 라이트쎈 중1-1 id 61부터는 그룹 헤더/이미 입력된 문제 중복 가능성이 있어 보류했다.
- 라이트쎈 공통수학2 일부 구간은 여러 인쇄 문제 또는 개념+문제가 함께 잡혀 choices 배열 분리를 보류했다.
- answer는 확실한 source/evidence가 없어 입력하지 않았다.

## 4. 확인

- PDF/crop 재생성 없음.
- solution 생성/수정 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit 의도 수정 없음.
- content에 image path나 `<img>` 삽입 없음.
- Gemini/API 호출 없음.
- git add/commit/push 하지 않음.

---

# CODEX_RESULT

## 1. 추가 수정 파일

- `archive/textbook/22개정 RPM 2-1/generated/js/workbook/RPM_중2_2-1_부록_대표문제다시풀기_중2.js`
- `archive/textbook/22개정 RPM 2-2/generated/js/workbook/RPM_중2_2-2_삼각형의성질_01_삼각형의성질_중2.js`
- `archive/textbook/22개정 RPM 공통수학1/generated/js/workbook/RPM_공통수학1_경우의수_10_경우의수와순열_고1.js`
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 실행 결과

이번 이어쓰기 실제 입력:
- RPM 2-1: content 11, choices 7문항, answer 0
- RPM 2-2: content 11, choices 5문항/25개 선택지, answer 0
- RPM 공통수학1: content 19, choices 0, answer 0
- RPM 공통수학2 final_clean 오입력분: 운영 JS 미반영, 성공 수량에서 제외

이번 이어쓰기 합계:
- 새로 채운 content: 41
- 새로 채운 choices: 12문항 / 60개 choice entry
- 새로 채운 answer: 0

전체 현재 상태:
- 전체 문항 수: 12844
- 남은 empty content: 11001
- 남은 missing answer: 12569
- choices 입력 문항: 259
- choice entry: 1290
- image-only content: 0

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0

## 3. 남은 manual_review

- RPM 2-1 대표문제다시풀기 12번은 순환마디 점 위치가 불확실해 보류했다.
- RPM 2-2 answer는 확실한 source/evidence가 없어 유지했다.
- RPM 공통수학1 answer는 `answer_evidence_missing` 상태라 유지했다.
- RPM 공통수학2는 worker가 `generated/final_clean/archiveCompatible`에 잘못 입력해 운영 JS 성공 수량에서 제외했다.

## 4. 확인

- PDF/crop 재생성 없음.
- solution 생성/수정 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit 의도 수정 없음.
- content에 image path나 `<img>` 삽입 없음.
- Gemini/API 호출 없음.
- git add/commit/push 하지 않음.

---

# CODEX_RESULT

## 1. 추가 수정 파일

- `archive/textbook/22개정_라이트쎈_공통수학2/generated/js/workbook/LIGHTSSEN_공통수학2_전체_고1.js`
- `archive/textbook/22개정_라이트쎈_ 대수/generated/js/workbook/LIGHTSSEN_대수_전체_고1.js`
- `archive/textbook/22개정_마플시너지_공통수학1/generated/js/workbook/마플_마플시너지 공통수학1_경우의 수_문제집대단원_고1.js`
- `archive/textbook/_비상교육_고등_확률과통계/generated/js/textbook/비상_확률과통계_조건부확률_중단원학습점검_고1.js`
- `archive/textbook/_비상교육_고등_확률과통계/generated/reports/manual_review_content_fill_20260524.json`
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 실행 결과

이번 이어쓰기 실제 입력:
- 라이트쎈 공통수학2: content 30, choices 1문항/5개 선택지, answer 0
- 라이트쎈 대수: content 12, choices 0, answer 0
- 마플시너지 공통수학1: content 3, choices 2문항/9개 선택지, answer 0
- 비상 확률과통계: content 1, choices 0, answer 0

이번 이어쓰기 합계:
- 새로 채운 content: 46
- 새로 채운 choices: 3문항 / 14개 choice entry
- 새로 채운 answer: 0

전체 현재 상태:
- 전체 문항 수: 12844
- 남은 empty content: 11042
- 남은 missing answer: 12569
- choices 입력 문항: 247
- choice entry: 1230
- image-only content: 0

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0

## 3. 남은 manual_review

- 라이트쎈 공통수학2 0010은 대응 JS 슬롯이 이미 비어 있지 않아 이번 empty-only 작업에서 보류했다.
- 라이트쎈 대수는 bbox/공통 발문/둘 이상의 문항 겹침 구간을 보류했다.
- 마플시너지 공통수학1 경우의 수 일부 crop은 인접 문항이 함께 포함되어 확실한 주 문항만 입력했다.
- 비상 확률과통계는 일부 full page에 해당 문항 원문이 보이지 않아 `manual_review_content_fill_20260524.json`으로 분리했다.
- answer는 확실한 source/evidence가 없어 입력하지 않았다.

## 4. 확인

- PDF/crop 재생성 없음.
- solution 생성/수정 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit 의도 수정 없음.
- content에 image path나 `<img>` 삽입 없음.
- Gemini/API 호출 없음.
- git add/commit/push 하지 않음.

---

# CODEX_RESULT

## 1. 추가 수정 파일

- `archive/textbook/22개정_라이트쎈_공통수학1/generated/js/workbook/LIGHTSSEN_공통수학1_전체_고1.js`
- `archive/textbook/22개정 RPM 2-1/generated/js/workbook/RPM_중2_2-1_유리수와순환소수_01_유리수와순환소수_중2.js`
- `archive/textbook/22개정 RPM 2-2/generated/js/workbook/RPM_중2_2-2_도형의닮음과피타고라스정리_05_도형의닮음_중2.js`
- `archive/textbook/22개정_마플시너지_공통수학2/generated/js/workbook/마플_마플시너지 공통수학2_도형의 방정식_문제집대단원_고1.js`
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 실행 결과

이번 이어쓰기 실제 입력:
- 라이트쎈 공통수학1 운영 JS 재작업: content 12, choices 0, answer 0
- RPM 2-1: content 14, choices 5문항, answer 0
- RPM 2-2: content 19, choices 0, answer 0
- 마플시너지 공통수학2: content 11, choices 8문항/40개 선택지, answer 0

이번 이어쓰기 합계:
- 새로 채운 content: 56
- 새로 채운 choices: 13문항 / 65개 choice entry
- 새로 채운 answer: 0

전체 현재 상태:
- 전체 문항 수: 12844
- 남은 empty content: 11088
- 남은 missing answer: 12569
- choices 입력 문항: 244
- choice entry: 1216
- image-only content: 0

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0

## 3. 남은 manual_review

- 라이트쎈 공통수학1 0070~0081은 운영 JS에 재반영 완료했고, 해당 대상 한글 깨짐은 없음.
- RPM 2-1 answer는 `answer_missing_evidence` 상태라 유지했다.
- RPM 2-2 다음 empty content는 id 418부터 남아 있다.
- 마플시너지 공통수학2 0046은 full page image에서 문자 식별이 확실하지 않아 입력하지 않았다.
- 전체적으로 `??` 패턴 등 한글 깨짐 의심은 별도 검수 대상이다.

## 4. 확인

- PDF/crop 재생성 없음.
- solution 생성/수정 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit 의도 수정 없음.
- content에 image path나 `<img>` 삽입 없음.
- Gemini/API 호출 없음.
- git add/commit/push 하지 않음.

---

# CODEX_RESULT

## 1. 추가 수정 파일

- `archive/textbook/22개정_라이트쎈_중1-1/generated/js/workbook/LIGHTSSEN_중1_1-1_전체_중1.js`
- `archive/textbook/22개정_라이트쎈_중1-2/generated/js/workbook/LIGHTSSEN_중1_1-2_전체_중1.js`
- `archive/textbook/22개정_라이트쎈_중2-1/generated/js/workbook/LIGHTSSEN_중2_2-1_전체_중2.js`
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 실행 결과

이번 이어쓰기 실제 입력:
- 라이트쎈 중1-1: content 23, choices 0, answer 0
- 라이트쎈 중1-2: content 7, choices 0, answer 0
- 라이트쎈 중2-1: content 13, choices 0, answer 0
- 라이트쎈 공통수학1 review_pack 오입력분: 운영 JS 미반영, 성공 수량에서 제외

이번 이어쓰기 합계:
- 새로 채운 content: 43
- 새로 채운 choices: 0
- 새로 채운 answer: 0

전체 현재 상태:
- 전체 문항 수: 12844
- 남은 empty content: 11144
- 남은 missing answer: 12569
- choices 입력 문항: 231
- choice entry: 1151
- image-only content: 0

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0

## 3. 남은 manual_review

- 라이트쎈 공통수학1 0070~0081은 worker가 `generated/review_pack`에 잘못 입력했고, 해당 내용에 한글 깨짐이 있어 운영 JS로 옮기지 않았다. 실제 운영 JS 기준 재작업 진행 중이다.
- 라이트쎈 중1-1 id 43~45의 표는 원문 표 구조를 텍스트로 옮겼으나 asset image 연결은 보류했다.
- 라이트쎈 중1-2 일부 항목은 표지/개념부 오검출, 도형만 있는 crop, crop/문항 대응 겹침으로 보류했다.
- answer는 확실한 source/evidence가 없어 입력하지 않았다.

## 4. 확인

- PDF/crop 재생성 없음.
- solution 생성/수정 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit 의도 수정 없음.
- content에 image path나 `<img>` 삽입 없음.
- Gemini/API 호출 없음.
- git add/commit/push 하지 않음.

---

# CODEX_RESULT

## 1. 추가 수정 파일

- `archive/textbook/22개정_라이트쎈_공통수학2/generated/js/workbook/LIGHTSSEN_공통수학2_전체_고1.js`
- `archive/textbook/22개정_마플시너지_공통수학1/generated/js/workbook/마플_마플시너지 공통수학1_다항식_문제집대단원_고1.js`
- `archive/textbook/22개정 RPM 공통수학1/generated/js/workbook/RPM_공통수학1_다항식_01_다항식의연산_고1.js`
- `archive/textbook/22개정 RPM 공통수학2/generated/js/workbook/RPM_공통수학2_도형의방정식_01_평면좌표_고1.js`
- `archive/textbook/reports/actual_input_current_global_summary.json`

## 2. 실행 결과

이번 이어쓰기 실제 입력:
- 라이트쎈 공통수학2: content 9, choices 0, answer 0
- 마플시너지 공통수학1: content 8, choices 6문항/30개 선택지, answer 0
- RPM 공통수학1: content 8, choices 4문항/20개 선택지, answer 0
- RPM 공통수학2: content 8, choices 2문항/10개 선택지, answer 0

이번 이어쓰기 합계:
- 새로 채운 content: 33
- 새로 채운 choices: 12문항 / 60개 choice entry
- 새로 채운 answer: 0

전체 현재 상태:
- 전체 문항 수: 12844
- 남은 empty content: 11187
- 남은 missing answer: 12569
- choices 입력 문항: 231
- choice entry: 1151
- image-only content: 0

검증:
- 전체 generated/js node --check: PASS 127 / FAIL 0
- 전체 generated/js questionBank parse: PASS 127 / FAIL 0

## 3. 남은 manual_review

- 라이트쎈 공통수학2 0046, 0048은 crop이 공통 지시문만 잡은 항목이다.
- 라이트쎈 공통수학2 0049는 crop 안에 0118/0119 조건이 함께 보여 수동 대조가 필요하다.
- 마플시너지 공통수학1 0050은 sourceCropPath와 full page marker가 어긋나 보인다.
- RPM 공통수학1 일부 id는 식 안 숫자가 문제번호처럼 검출된 후보라 독립 문항으로 입력하지 않았다.
- RPM 공통수학2 id 25는 그림 문항이나 기존 asset 매핑 확증이 없어 image 연결을 보류했다.
- answer는 확실한 source/evidence가 없어 입력하지 않았다.

## 4. 확인

- PDF/crop 재생성 없음.
- solution 생성/수정 없음.
- id/displayNo/setKey/sourceQuestionNo/문항 순서/metadata/tags/standardUnit 의도 수정 없음.
- content에 image path나 `<img>` 삽입 없음.
- Gemini/API 호출 없음.
- git add/commit/push 하지 않음.



## 2026-05-24 운영 JS 제작 - 22개정_라이트쎈_중1-1
- 운영 JS: archive/textbook/22개정_라이트쎈_중1-1/generated/js/workbook/LIGHTSSEN_중1_1-1_전체_중1.js
- empty content: 571 -> 1
- missing answer: 675 -> 675 (answer source 없음, 추측 입력 안 함)
- choices 있는 문항: 29
- image-only/path content: 0
- manual_review: 1개 (329)
- node --check: PASS
- questionBank parse: PASS
- 수정 범위: content/choices만, solution/id/displayNo/setKey/sourceQuestionNo/문항순서/metadata 미수정
- git add/commit/push 안 함


## 2026-05-24 운영 JS 제작 - 22개정_라이트쎈_중1-2
- 운영 JS: archive/textbook/22개정_라이트쎈_중1-2/generated/js/workbook/LIGHTSSEN_중1_1-2_전체_중1.js
- empty content: 388 -> 2
- missing answer: 439 -> 439 (answer source 없음, 추측 입력 안 함)
- choices 있는 문항: 1
- image-only/path content: 0
- manual_review: 2개 (200, 343)
- node --check: PASS
- questionBank parse: PASS
- 수정 범위: content/choices만, solution/id/displayNo/setKey/sourceQuestionNo/문항순서/metadata 미수정
- git add/commit/push 안 함


## 2026-05-24 운영 JS 제작 - 22개정_라이트쎈_중2-1
- 운영 JS: archive/textbook/22개정_라이트쎈_중2-1/generated/js/workbook/LIGHTSSEN_중2_2-1_전체_중2.js
- empty content: 368 -> 2
- missing answer: 427 -> 427 (answer source 없음, 추측 입력 안 함)
- choices 있는 문항: 3
- image-only/path content: 0
- manual_review: 2개 (60, 61)
- node --check: PASS
- questionBank parse: PASS
- 수정 범위: content/choices만, solution/id/displayNo/setKey/sourceQuestionNo/문항순서/metadata 미수정
- git add/commit/push 안 함

## 2026-05-24 운영 JS 발문/보기 실제 입력 진행 결과

대상 순서:
- 22개정_라이트쎈_중1-1
- 22개정_라이트쎈_중1-2
- 22개정_라이트쎈_중2-1
- 22개정 RPM 2-1
- 22개정 RPM 2-2

작업 원칙:
- 운영 JS만 수정: archive/textbook/<교재>/generated/js/**/*.js
- full page image / question crop 기준으로 content/choices 실제 입력
- answer source를 확실히 쓰지 않은 범위는 answer 추측 입력하지 않음
- solution/id/displayNo/setKey/sourceQuestionNo/문항순서/metadata/tags/standardUnit 수정 금지
- content 안에 이미지 path 또는 <img> 삽입 금지
- git add/commit/push 미실행

최종 운영 JS 집계:
| book | files | total | emptyContent | missingAnswer | choicesQuestions | contentPathOrImg | questionMarkContent | nonemptySolution |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 22개정_라이트쎈_중1-1 | 1 | 675 | 1 | 675 | 29 | 0 | 0 | 0 |
| 22개정_라이트쎈_중1-2 | 1 | 439 | 2 | 439 | 1 | 0 | 0 | 0 |
| 22개정_라이트쎈_중2-1 | 1 | 427 | 2 | 427 | 3 | 0 | 0 | 0 |
| 22개정 RPM 2-1 | 11 | 1149 | 18 | 1149 | 380 | 0 | 0 | 0 |
| 22개정 RPM 2-2 | 11 | 1074 | 0 | 1074 | 323 | 0 | 0 | 0 |

검증:
- 위 5권 운영 JS 전체 node --check 통과
- Node VM questionBank parse 통과
- content 내 이미지 path / <img> 탐지 0
- 연속 ?? 기반 한글 깨짐 탐지 0
- solution 비어 있음 유지
- answer는 신뢰 가능한 answer source를 사용하지 않은 이번 pass에서는 미입력 유지

특이사항:
- 22개정 RPM 2-1의 일차함수_09 파일에서 한글이 ?로 깨진 초안이 발견되어 백업에서 복구 후 재입력 완료함.
- 22개정 RPM 2-2의 확률_09 파일에서도 동일한 인코딩 깨짐을 발견하여 백업에서 복구 후 재입력 완료함.
- 22개정 RPM 2-1에 남은 emptyContent 18개는 displayNo가 없거나 원문 문항으로 확정되지 않은 개념 조각/매핑 후보로, 창작하지 않고 manual_review로 유지함.

생성/갱신 report 주요 파일:
- archive/textbook/22개정 RPM 2-1/generated/reports/pipeline_book_summary.json
- archive/textbook/22개정 RPM 2-1/generated/reports/rpm2_1_content_completion_summary.json
- archive/textbook/22개정 RPM 2-2/generated/reports/pipeline_book_summary.json
- archive/textbook/22개정 RPM 2-2/generated/reports/rpm2_2_content_completion_summary.json
- archive/textbook/22개정 RPM 2-1/generated/reports/subagent_rpm2_1_*_content_report.json
- archive/textbook/22개정 RPM 2-2/generated/reports/subagent_rpm2_2_*_content_report.json

다음 조치:
- answer source/정답표가 확인되는 교재부터 answer 입력 단계 진행
- 남은 manual_review는 원문 페이지 매핑 확인 후 확정 가능한 항목만 입력

## 2026-05-24 추가 진행: 22개정_라이트쎈_공통수학1

작업 대상:
- archive/textbook/22개정_라이트쎈_공통수학1/generated/js/workbook/LIGHTSSEN_공통수학1_전체_고1.js

진행 내용:
- 다음 교재로 22개정_라이트쎈_공통수학1을 선택.
- OCR item id와 JS id가 일치하지 않는 것을 확인.
- 잘못된 단순 id 매칭 초안은 폐기.
- 중간에 하위 에이전트가 String.replace replacement 문자열의 `$` 처리 문제로 JS syntax error를 만든 것을 확인.
- 운영 JS를 backup/js_before_content_fill_20260523 기준으로 복구한 뒤, 안전한 unique displayNo OCR 매칭만 재적용.

현재 검증 결과:
- totalQuestions: 468
- emptyContent: 351
- missingAnswer: 468
- choicesQuestions: 0
- contentPathOrImg: 0
- questionMarkContent: 0
- nonemptySolution: 0
- bad displayNo-leading mismatch: 0
- node --check: PASS
- questionBank parse: PASS

생성/갱신 report:
- archive/textbook/22개정_라이트쎈_공통수학1/generated/reports/lightssen_common1_safe_displayno_ocr_fill_report.json
- archive/textbook/22개정_라이트쎈_공통수학1/generated/reports/pipeline_book_summary.json
- archive/textbook/22개정_라이트쎈_공통수학1/generated/reports/subagent_lightssen_common1_ids_300_397_content_report.json

주의/다음 조치:
- 이 권은 단일 운영 JS 파일이라 하위 에이전트 병렬 편집 금지.
- OCR item id와 JS id 단순 매칭 금지.
- 수식 `$...$`가 포함된 문자열을 Node String.replace replacement 인자로 직접 넣지 말 것. 콜백 replace 또는 AST/JSON 재생성 방식만 사용.
- 남은 351개는 full page 기준 순차 입력 또는 더 안전한 displayNo-page mapping 보정 후 처리.
- git add/commit/push 미실행.

## 2026-05-24 추가 진행: 22개정_라이트쎈_공통수학1 순차 입력 pass

- 대상: archive/textbook/22개정_라이트쎈_공통수학1/generated/js/workbook/LIGHTSSEN_공통수학1_전체_고1.js
- 방식: 하위 에이전트 병렬 편집 금지, OCR item id와 JS id 단순 매칭 금지, 같은 page에서 displayNo가 확인되는 항목만 순차 입력
- emptyContent before: 351
- emptyContent after: 279
- 새로 채운 content: 72
- 새로 채운 choices: 0
- 남은 manual_review: 279 (displayNo-page mapping 미확정 또는 OCR에서 displayNo 미검출)
- node --check: PASS
- questionBank parse: PASS
- contentPathOrImg: 0
- questionMarkContent: 0
- nonemptySolution: 0
- bad displayNo-leading mismatch: 0
- answer/solution/id/displayNo/setKey/sourceQuestionNo/문항순서/metadata 미수정
- git add/commit/push 미실행

갱신 report:
- archive/textbook/22개정_라이트쎈_공통수학1/generated/reports/lightssen_common1_same_page_displayno_fill_report.json
- archive/textbook/22개정_라이트쎈_공통수학1/generated/reports/lightssen_common1_manual_review_remaining_report.json
- archive/textbook/22개정_라이트쎈_공통수학1/generated/reports/pipeline_book_summary.json

## 2026-05-24 재작업: 22개정_라이트쎈_공통수학1 완전 리셋 후 안전 입력

- 대상: archive/textbook/22개정_라이트쎈_공통수학1/generated/js/workbook/LIGHTSSEN_공통수학1_전체_고1.js
- 조치: 운영 JS를 generated/backup/js_before_content_fill_20260523 기준으로 완전 리셋 후 재작업
- 입력 방식: OCR item id와 JS id 단순 매칭 금지. 같은 page에서 displayNo가 확인되는 항목만 순차 입력.
- 안전 방식: questionBank JSON 재생성. 수식 `$` 포함 문자열을 String.replace replacement 인자로 직접 넣지 않음(callback replacement 사용).

결과:
- totalQuestions: 468
- emptyContent before reset/rework: 468
- emptyContent after: 279
- 새로 채운 content: 189
- 새로 채운 choices: 0
- missingAnswer: 468
- contentPathOrImg: 0
- questionMarkContent: 0
- nonemptySolution: 0
- bad displayNo-leading mismatch: 0
- node --check: PASS
- questionBank parse: PASS

보호 필드:
- answer/solution/id/displayNo/setKey/sourceQuestionNo/문항순서/metadata 미수정
- git add/commit/push 미실행

갱신 report:
- archive/textbook/22개정_라이트쎈_공통수학1/generated/reports/lightssen_common1_reset_rework_displayno_fill_report.json
- archive/textbook/22개정_라이트쎈_공통수학1/generated/reports/pipeline_book_summary.json
## 2026-05-25 파이프라인 기준 순서 고정

사용자와 합의한 제작 순서를 파이프라인 기준으로 반영했다.

수정한 기준:

- operating JS scope를 `archive/textbook/{book}/generated/js/**/*.js`로 고정
- `generated/backup`, `review_pack`, `final_clean`, `draft_content`, `reports`, root `archive/textbook/generated/js`는 운영 집계에서 제외
- 작업 단위를 `jsFile` lock 기준으로 고정
- `question-page-displayNo mapping audit` 후 mapping 확정 문항만 `content/choices` 입력
- content 성공 판정 추가:
  - 빈 값 아님
  - 깨진 OCR/mojibake 없음
  - 이미지 path / `<img>` 없음
  - page/displayNo 근거 있음
  - image-only content 아님
  - source choices가 있으면 choices 구조 정상
- mapping 실패 원인 분리:
  - `source_image_missing`
  - `displayNo_page_mismatch`
  - `duplicate_slot_candidate`
  - `stale_or_extra_js_question`
  - `non_problem_page`
  - `unreadable_ocr`
  - `visual_asset_required`
  - `content_input_pending`
- `answer_source_map` 또는 동등한 answer evidence가 있는 경우에만 answer 입력
- 원클릭 stage 순서에서 `10B-SCAN`을 `10B-FAIL` 앞에 두어 content 성공 판정/깨진 문자열 스캔 후 empty cause 분리
- `10B-transcribe-content-choices`에 깨진 OCR / image-only content 차단 성공 게이트 보강

수정 파일:

- `docs/textbook-pipeline/AP_MATH_TEXTBOOK_ONECLICK_PIPELINE_APP.md`
- `docs/textbook-pipeline/AGENT_OPERATION_POLICY.md`
- `archive/textbook/tools/textbook-pipeline/README.md`
- `archive/textbook/tools/textbook-pipeline/run-oneclick-pipeline.mjs`
- `archive/textbook/tools/textbook-pipeline/stages/10b-transcribe-content-choices.mjs`
- `archive/textbook/tools/textbook-pipeline/tests/pipeline-stage-contract.test.mjs`

검증:

- `node --check archive/textbook/tools/textbook-pipeline/run-oneclick-pipeline.mjs`: PASS
- `node --check archive/textbook/tools/textbook-pipeline/stages/10b-transcribe-content-choices.mjs`: PASS
- `node --test archive/textbook/tools/textbook-pipeline/tests/pipeline-stage-contract.test.mjs`: PASS, 8/8

산출:

- 다운로드 폴더에 `textbook_pipeline_mapping_first_20260525.zip` 생성 예정

금지 사항 확인:

- 교재 운영 JS 수정 없음
- answer/solution 자동 추측 없음
- git add/commit/push 미실행

### 2026-05-25 검수 의견 반영: 04B 누락 패키지 보강

검수 의견:

- 이전 압축본에 `archive/textbook/tools/textbook-pipeline/stages/04b-question-id-mapping-guard.mjs`가 누락됨.
- `run-oneclick-pipeline.mjs`는 04B를 import하므로 새 환경에서 패키지 불완전 가능.
- 계약 테스트에 04B 존재/순서 및 09 단계의 `fresh_js_input_manifest` 우선 사용 검증 필요.

조치:

- 재압축 패키지에 `04b-question-id-mapping-guard.mjs` 포함.
- 재압축 패키지에 `09-build-internal-model.mjs`와 `lib/internal-model-utils.mjs` 포함.
- 문서에 no-stop production rule 추가:
  - mapping/OCR/answer source/stale/manual_review는 전체 중단 조건이 아님.
  - 실패 항목은 원인별 report로 분리하고 다음 문항/jsFile/book으로 진행.
  - syntax/parse 실패는 해당 jsFile만 안전 백업으로 복구 후 분리.
- `pipeline-stage-contract.test.mjs`에 다음 검증 추가:
  - 04B stage가 존재한다.
  - 04B가 06 이후, 09 이전에 위치한다.
  - 09/internal model 생성이 `question_crop_map.json`보다 `fresh_js_input_manifest.json`을 우선 사용한다.

검증:

- `node --check archive/textbook/tools/textbook-pipeline/stages/04b-question-id-mapping-guard.mjs`: PASS
- `node --test archive/textbook/tools/textbook-pipeline/tests/pipeline-stage-contract.test.mjs`: PASS, 9/9

재산출:

- 다운로드 폴더에 `textbook_pipeline_mapping_first_20260525.zip` 재생성 예정
