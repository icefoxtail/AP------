# MASTER_CURRENT_PROGRESS

현재 구현과 문서 기준의 진행 상태를 한눈에 보는 문서다. 상세 근거는 `docs/implemented`, `docs/domains`, `docs/plans`, `docs/_index`에 둔다.

## 1. 상태값 기준

- 완료: 실제 코드 또는 기준 문서로 확인됨.
- 일부 완료: 제한된 범위에서만 구현됨.
- 진행 중: foundation 또는 workflow가 있으나 후속 보강 필요.
- 보류: 의도적으로 숨김 또는 승인 대기.
- 확인 필요: 문서에는 있으나 실제 파일까지 확인하지 못함.
- 금지: 승인 없이 구현/노출/실행 금지.

## 2. 현재 상태 요약

| 영역 | 현재 상태 | 근거 문서 | 비고 |
|---|---|---|---|
| docs 루트 구조 정리 | 일부 완료 | `docs/_index/DOCS_STRUCTURE.md`, `docs/_index/ARCHIVE_INDEX.md` | 2026-08-22 감사에서 루트 잔여 19개 문서를 `plans`·`reports`로 이동하고 design 자료를 `guides/design`으로, superpowers를 `archive/old-plans/superpowers`로 이동했다. 빈 호환 디렉터리 정리와 historical review-pack zip 복구는 별도 보류 |
| 3대 기준 문서 | 진행 중 | `MASTER_RULEBOOK.md`, `MASTER_CURRENT_PROGRESS.md`, `MASTER_NEXT_WORK.md` | 문서 구조 변경 반영 |
| domain 문서 | 진행 중 | `docs/domains/*.md` | 경로 유지 |
| implemented 문서 | 진행 중 | `docs/implemented/*.md` | root의 implemented index가 하위 폴더로 이동됨 |
| plan 문서 | 진행 중 | `docs/plans/*.md` | root의 planning rule과 Wangji roadmap이 하위 폴더로 이동됨 |
| Codex 규칙 문서 | 진행 중 | `docs/codex/*.md` | root의 Codex 실행/검수 규칙과 patch workflow가 하위 폴더로 이동됨 |
| guides / reports | 진행 중 | `docs/guides/*`, `docs/reports/*` | 디자인/reference/textbook/timetable/initial-data 보조 문서 분리 |
| archive 구조 | 진행 중 | `docs/archive/*`, `docs/_index/ARCHIVE_INDEX.md` | 완료/과거 결과 폴더 재배치 |
| AP Math JS 아카이브 세부단원 | 운영 QA 완료 | `docs/rules/JS아카이브_세부단원_운영규칙_v1.md`, `archive/_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-operational-qa-v1.json` | 현재 DB·인덱스·식별 맵은 438개 파일·10,686문항이며, 운영 세부단원 분류 범위 433개 파일·10,522문항은 QA 전 게이트 통과. 중복 ID 정규화와 DB 누락 원본 2건 보강, 이미지 경로 보정, 후보 98개 파일 동기화를 완료했다. original 기출 345개 파일·7,909문항은 content/answer/solution 공란 0건으로 정리했으며, 원본이 없는 수피아여고 q10은 기존 선택지·정답·해설에 맞춘 성립 문항으로 복구하고 question-index·identity runtime·브라우저 3모드 검증을 완료했다. 유형·유사 자료의 출처 확인 가능한 DB 4건을 추가 정리했고, 남은 28개 emptySchool·60개 필수 메타 gap은 source-dependent 보류로 분리했다. 이후 types 4개/304문항과 similar 19개/462문항의 JS 기준 해설을 작성해 전체 빈 해설 inventory를 0건으로 만들고 exam/sol/ans 렌더 QA를 완료했다. 추가로 그림 의존 보류 31건과 동일 범위 보강 2건을 자립형 텍스트 문항으로 교체해 그림 보류 표기 0건을 확인했고, 최종 운영 게이트에서 구조 누락 52건과 examTitle 누락 2건도 보완했다. compatibility map은 현재 사용 공식키 106개를 커버하도록 확장했고 검색 alias 4종을 추가했다. 교차 단원 465건과 수동 라벨 변형 34건을 모두 문항 근거 기반으로 승격했고 잔여 교차·수동 보류는 0건이다. 최신 운영 JS 라벨 변형 inventory는 0행·0문항이다. |
| AP Math 운영센터 | 정적 map 대조 완료 | `docs/implemented/CURRENT_FRONTEND_MAP.md`, `docs/implemented/CURRENT_WORKER_ROUTE_MAP.md`, `docs/implemented/CURRENT_DB_MAP.md` | 2026-08-24 주요 frontend 경로·Worker route import/dispatch·schema 참조 대조 완료. 동작/브라우저 QA는 별도 범위 |
| 학생/반 관리 | 진행 중 | `docs/domains/STUDENTS_CLASSES_DOMAIN.md` | 이번 작업에서 코드 검증 없음 |
| 리포트 AI / 평가리포트 | 일부 완료 | `docs/domains/REPORT_AI_DOMAIN.md`, `docs/plans/REPORT_AI_NEXT_PLAN.md`, `docs/review-packs/report-cohort-validation-20260824/CODEX_RESULT.md` | cohort identity/grade/dedupe/fallback, 실제 index.js initial-data mock D1 통합, 대표 archive 로컬 HTTP exam/sol/ans smoke, production live read-only에서 cohort 5명·평균 78점 확인. `initial-data`의 blueprint 누락 경로를 확인해 report center archive-scoped lazy load를 보강했고 핵심 회귀 4개·report 관련 테스트 31개 통과. 별도 staging target과 remote 실제 payload는 후속 확인 |
| CMath / EIE / 홈페이지 | 확인 필요 | `docs/plans/MASTER_ROADMAP.md`, domain docs | 별도 확인 필요 |

> 갱신 메모: AP Math JS 아카이브 행의 433개 파일·10,522문항 수치는 중간 점검 시점의 historical snapshot이다. 현재 운영 기준은 아래 `세부단원 현재 기준 완료` 섹션의 438개 파일·10,686문항이다.

### AP Math JS 아카이브 source-dependent 메타데이터 (2026-08-24)

- `original` 348개 레코드는 필수 DB 메타가 완결됐다.
- `types` 49개와 `similar` 41개에서 확인된 `emptySchool` 28건·필수 메타 gap 60건은 원본 영구 부재로 간주해 활성 queue에서 제거했다. DB 빈 필드와 감사 기록은 보존하며 재개하지 않는다.
- `school/year/semester/examType`의 직접 근거·상속 금지·재검토 절차를 `docs/rules/JS아카이브룰북_v2.5.md` 4-4에 확정했다. 이 단계에서는 archive 산출물을 추가 변경하지 않는다.

### AP Math JS 아카이브 세부단원 중간 점검 (2026-08-24)

- DB·question-index·identity는 438개 파일·10,686문항 전체를 포함하고 DB qCount/index mismatch와 identity 충돌은 0건이다.
- 세부단원 운영 QA 스냅샷은 431개 파일·10,522문항이다. 4개 original 파일 98문항과 3개 similar 파일 66문항, 총 7개 파일·164문항은 아직 세부단원 4개 필드가 비어 있어 다음 분류 대상이다.
- 전체 JS 스캔은 438개 파일·10,686문항에서 구조 오류 0건으로 통과했지만, 운영 세부단원 커버리지는 전체 대비 98.46%다. 상세 중간 점검은 `archive/_generated/intelligence/phase3/archive-midpoint-audit-20260824.json`에 보존했다.

### AP Math JS 아카이브 세부단원 현재 기준 완료 (2026-08-24)

- 중간 점검 대상 7개 파일·164문항을 문항별로 매핑해 운영 JS의 세부단원 4개 필드를 완성했다. 변경 ledger는 `archive/_generated/intelligence/phase3/complete-subunit-classification/archive-current-subunit-manual-rebaseline-v1.json`이다.
- 현재 complete classification은 438개 파일·10,686문항, `emptySubUnitKeys=0`, `taxonomyKeyGaps=0`이다. fallback adjudication 후 운영 QA digest는 `89a17394b8b5b161c2ee7a79d32c121e938ff84810394a628b9f5c8ad3d666d3`이며 모든 핵심 게이트가 true다.
- question-index 10,686건, identity map digest `90395ad8670b6a1c561a979ce33d08f05551565842dfc09b6a7d99b3f87117e9`, identity runtime digest `0a19ef79ff1cdf145ef0763a8b62ce731821411f9390ad18012515769ce5ec34`, 후보 동기화 98개 파일·2,219문항 byte-equal을 확인했다.
- DB consistency는 파일 존재·중복·문항 수·index 수 게이트가 통과했고, `emptySchool` 28건·필수 메타 gap 60건은 source-dependent deferred queue로 남아 있다. fallback 차단 28건은 별도 문항 adjudication으로 해소했다.
- 커밋·푸시·배포는 하지 않았다.

### AP Math JS 아카이브 전체 결정적 audit 재검증 (2026-08-24)

- fallback adjudication 이후 `archive/exams/**/*.js` 438개를 전체 재검사했다. 438개 report·parse failure 0건이며, 예상 source-dependent `DB school is empty` 28건 외 오류는 0건이다.
- JS 평가 실패, 빈 content/answer/solution, 이미지 누락, DB qCount/index mismatch, candidate mismatch는 모두 0건이다. 결과는 `PASS_WITH_EXPECTED_SOURCE_DEPENDENT_DEFERRED`로 기록했다.
- 상세 결과는 `docs/review-packs/archive-full-deterministic-audit-20260824/CODEX_RESULT.md`이며, archive/DB/index/identity와 커밋·푸시·배포는 변경하지 않았다.

### AP Math JS 아카이브 source-unavailable 메타데이터 종결 (2026-08-24)

- 현재 workspace와 `D:\` evidence intake에서 대상 파일·`examTitle`과 직접 1:1로 일치하는 원본은 0건이었다. contextual 후보 58건은 직접 근거로 승격하지 않았다.
- `emptySchool` 28건·필수 메타 gap 60건(고유 파일 60개, 필드 occurrence 168건)을 `PERMANENT_SOURCE_UNAVAILABLE`로 영구 종결했다. DB의 빈 source-dependent 필드와 기존 closure ledger는 유지하며 값을 추정하거나 재개하지 않는다. 영구 종결 ledger는 `archive/_generated/intelligence/phase3/archive-db-source-permanent-closure-v1.json`이다.
- closure ledger는 `archive/_generated/intelligence/phase3/archive-db-source-unavailable-closure-v1.json`(digest `03ba09fc5bad6e366dedd15d96bd6868a382cd6e6a2ddf3e268e5dfc6d3d8e04`)이다. DB/production JS/question-index/identity runtime 쓰기와 커밋·푸시는 0건이다.
- 새 원본·표지·명시 source metadata가 대상 file 또는 `examTitle`과 직접 1:1로 확인될 때만 해당 행을 다시 연다. 현재 archive 활성 blocker는 0건이다.

### AP Math JS 아카이브 legacy schema 1차 보강 (2026-08-24)

- `missing_required_field` 167건(3개 파일·53문항)을 확인해 운영 기본값 167필드만 추가했다: `questionType=""`, `layoutTag="grid"`, `tags=[]`, `wide=false`.
- content·choices·answer·solution·image와 기타 기존 필드는 변경하지 않았다. schema validator는 오류 167건이 0건으로 줄었고, 남은 warning은 1,360건이다.
- question-index/identity/DB consistency/운영 QA와 전체 archive deterministic audit을 재실행했으며 예상 source-dependent `DB school` 28건 외 신규 오류는 0건이다.
- ledger는 `archive/_generated/intelligence/phase4/archive-legacy-schema-default-application-v1.json`이며, 다음은 남은 warning의 문항별 adjudication이다.

### AP Math JS 아카이브 legacy master-key adjudication inventory (2026-08-24)

- `unknown_standard_unit_key` 284건과 `raw_unit` 29건을 compiled master·master-key integrity·운영 JS 문항으로 대조했다. 고유 대상은 284문항·41개 파일, 중복 포함 issue instance는 313건이다.
- 243문항은 canonical standard-unit 표에는 없지만 세부단원 master가 부모로 문서화한 키였다. 236문항은 subUnitKey parent가 일치했고 7문항은 parent mismatch로 남겼다. 29문항은 RAW source label, 12문항은 standardUnitKey 공란이며 미확인 비-RAW 키는 0건이다.
- 부모키를 정식 canonical 키로 바꾸거나 RAW를 추정 승격하지 않았다. production JS/DB/question-index/identity runtime 쓰기는 0건이다.
- 상세 판정표는 `archive/_generated/intelligence/phase4/archive-legacy-master-key-adjudication-v1.json`, 요약 결과는 `docs/review-packs/archive-legacy-master-key-adjudication-20260824/CODEX_RESULT.md`다. 당시 다음 범위는 7개 parent mismatch 문항과 RAW/공란의 근거 기반 판정이었다.

### AP Math JS 아카이브 legacy master-key parent evidence 적용 (2026-08-24)

- compiled subunit parent가 canonical master에 직접 연결되는 48문항(15개 파일)을 적용했다: RAW 29, standardUnitKey 공란 12, documented parent mismatch 7.
- `standardUnitKey`, `standardUnit`, `standardUnitOrder`만 144필드 변경했으며 content·choices·answer·solution·image 및 기타 기존 필드는 보호 diff 0건이다. 적용 ledger digest는 `b572ece63e8f7ee5158c3074bca4d12e5f4a8d98728fc70ff48a9963de35a240`다.
- validator가 compiled extension parent를 허용하도록 정합화한 직후 schema warning은 999건(standard label 443, subunit parent 306, order 198, questionType 33, layout 19)이었다. 현재 unknown standard key·RAW는 0건이다.
- question-index 10,686건, identity map/runtime 10,686 UID·충돌 0건, DB qCount/index mismatch 0건, 운영 QA 전 게이트 true, 전체 deterministic audit은 기존 source-dependent `DB school` 28건 외 신규 오류 0건이다.

### AP Math JS 아카이브 subunit parent mismatch 전수 해소 (2026-08-24)

- parent mismatch inventory 306개 row를 306문항·39개 파일에서 문항 내용과 compiled master 기준으로 판정했다. 표준단원+세부단원 1건, 표준단원 8건, 세부단원 297건을 분리 적용했다.
- 표준·세부단원 메타데이터 624필드만 변경했고 content·choices·answer·solution·image 등 보호 필드 diff는 0건이다. 적용 ledger digest는 `46f77bffafae6b42928a384471a491309007fa7627a64977609ae243ead17350`다.
- `M3-07` 166건, `M1-03` 107건, `H22-C-04` 8건, `H22-C-05` 7건과 중등 교차 18건을 정식 master 체계로 정리했다. 현재 subunit parent mismatch·unknown standard key·RAW는 0건이다.
- 최신 schema inventory는 warning 688건(`standard_unit_mismatch` 439, `standard_unit_order_mismatch` 197, `invalid_question_type` 33, `invalid_layout_tag` 19)이다. 자동 추정은 중단하고 남은 label/order/type/layout은 별도 adjudication 범위로 둔다.
- question-index 10,686문항, identity map/runtime 10,686 UID·충돌 0건, DB 438개·qCount/index mismatch 0건, 운영 QA 전 게이트 true다. 전체 deterministic audit은 예상 source-dependent `DB school` 28건 외 오류 0건, candidate mismatch 0건으로 종료했다.
- 결과팩은 `docs/review-packs/archive-subunit-parent-mismatch-resolution-20260824/CODEX_RESULT.md`다. 커밋·푸시·배포는 하지 않았다.

### AP Math JS 아카이브 schema warning 0건 종결 (2026-08-24)

- canonical master label/order가 어긋난 636문항·64개 파일을 정리했다: `standardUnit` 439건, `standardUnitOrder` 197건, 총 636필드. 적용 ledger digest는 `3d08a10ce5f4146b6040f539b50c2079054db40ce5cb68aa33603fba367e5a79`다.
- legacy enum 52건(39문항·6개 파일)을 정규화했다: `multiple_choice` 20→`객관식`, `short_answer` 5→`단답형`, `서답형` 8→`단답형`, invalid `layoutTag` 19→`grid`. `wide`와 문항 본문·정답·해설·이미지는 보호했고 보호 필드 diff 0건이다. 적용 ledger digest는 `9bbf2f74d5d5439ae8daa1f35ca385dbfc6702286665cc67aa7abaacfeb48ef8`다.
- schema validator/inventory warning 0건, parent mismatch·unknown standard key·RAW 0건이다. 후보 98개 파일·2,219문항은 production byte-equal이며 비운영 후보 9개는 격리 유지다.
- question-index 10,686건, identity map/runtime 10,686 UID·충돌 0, DB qCount/index mismatch 0, 운영 QA 전 게이트 true다. 전체 deterministic audit은 예상 source-dependent `DB school` 28건 외 오류 0건, candidate mismatch 0건이다.
- 결과팩은 `docs/review-packs/archive-schema-warning-closure-20260824/CODEX_RESULT.md`다. source-dependent DB 28/60 queue는 원본 확보 전까지 보류한다.

### AP Math JS 아카이브 source-dependent 메타데이터 evidence intake (2026-08-24)

- `emptySchool` 28건·필수 메타 gap 60건을 대상으로 `D:\` 전체 5,731개 파일과 텍스트 324개를 읽기 전용 재검색했다. 대상 basename/examTitle과 정확히 일치하는 출처는 0건이며, contextual 후보 58건은 다른 학교·학기·연도·교재 관계만 겹쳐 거부했다.
- 직접 승격 필드와 DB/production JS 쓰기는 0건이다. `school` 28, `year` 60, `semester` 37, `examType` 43 occurrence 전부 `no_direct_source_evidence`로 deferred 유지한다. row별 ledger는 `archive/_generated/intelligence/phase3/archive-db-source-evidence-intake-v1.json`(digest `52657952003347eeaaaf53a7fb2ad67c908fbfcc1a471cfb3b45eae19262fca9`)이다.
- 재검증 결과 question-index 10,686문항, identity map/runtime 10,686 UID·충돌 0건, DB 파일/중복/qCount/index mismatch 0건, 운영 세부단원 QA 전 게이트 true다. `fullDbRequiredFieldsGate=false`와 `fullDbSchoolGate=false`는 이 source-dependent 예외에서 예상된 상태다.
- 새 표지·원본·출처 문서가 들어오기 전까지 메타데이터 queue는 보류하고, 다음 archive 작업은 fallback 차단 28건 수동 adjudication으로 진행한다.

### AP Math JS 아카이브 fallback 차단 수동 adjudication (2026-08-24)

- frozen fallback-safety baseline의 28건을 문항 본문·보기·정답·해설로 전수 확인했다. 일차함수 5건, 확률 9건, 이차방정식 14건 모두 정식 master 키로 확정했다.
- 실제 키 교정은 4건이다. y축과 평행한 직선 문항 1건을 `M2-04-LINEAR_FUNCTION_BASIC`으로, 경기 순서·주사위 순서쌍 문항 3건을 `M2-08-PROBABILITY_COUNTING`으로 정정했다. 모든 대상은 `category_or_cue_inferred`/`complete_category`로 sidecar에 남겼다.
- 운영 JS 보호 필드 diff 0건, 후보 98개 파일·2,219문항 byte-equal, complete classification 438개 파일·10,686문항(`emptySubUnitKeys=0`, `taxonomyKeyGaps=0`)이다. 수동 ledger digest는 `0dcfa608de5f2dd4df101b68d9d590f84a1b333ac115e6beba09095d7efe8deb`이다.
- question-index 10,686건, identity map digest `90395ad8670b6a1c561a979ce33d08f05551565842dfc09b6a7d99b3f87117e9`, runtime digest `0a19ef79ff1cdf145ef0763a8b62ce731821411f9390ad18012515769ce5ec34`, 운영 QA digest `89a17394b8b5b161c2ee7a79d32c121e938ff84810394a628b9f5c8ad3d666d3`로 재생성·검증했다.
- fallback effective safety는 baseline 28건·adjudicated 28건·잔여 blocked 0건이다. DB·master·commit/push/deploy는 변경하지 않았으며 source-dependent 28/60 queue는 그대로 보류한다.

### AP Math JS 아카이브 승인 메타데이터 runtime 기준점 재검증 (2026-08-24)

- 승인된 운영 JS 메타데이터를 기준으로 question-index·identity map/runtime을 재생성·감사했다. 438개 파일·10,686문항/UID, qKey·UID collision 0, DB qCount/index mismatch 0을 유지했다.
- 후보 2개 파일에 남아 있던 구식 `imageSize` 차이를 운영본 기준으로 동기화했다. 최종 candidate sync digest는 `2df0c9e33477dc49026cc0daeeace2300d8c24718bdf1b9232d151abd1b2e803`이며 98개 매핑 후보·2,219문항 byte-equal, 비운영 후보 9개는 격리 상태다.
- 전체 결정론 감사는 438개 report·10,686문항/indexed, 예상 `DB school` 28건 외 오류 0건·candidate mismatch 0건·unexpected error 0건이다. 운영 QA digest `0089007c30f633102b8c17dccb8857a4083508ee1eab9c0d2084ed6f6dd0ddc1`의 모든 게이트가 true다.
- source-dependent `emptySchool` 28건·필수 메타 gap 60건은 `PERMANENT_SOURCE_UNAVAILABLE`로 활성 작업에서 제거했으며, DB 값 추정·물리 삭제·commit/push/deploy를 하지 않았다.

### AP Math JS 아카이브 master·룰북 계약 동기화 (2026-08-24)

- `docs/rules/MANIFEST.md` 활성 22개 항목을 실제 파일과 대조해 stale hash 2건을 현재 값으로 갱신했다. 현재 manifest 불일치 0건이다.
- 표준단원 마스터 compiled JSON은 재생성했지만 기존 바이트와 동일했다. master 집계는 표준키 142·세부키 459·개념군 461·문제유형 13·템플릿 18개다.
- schema validator 0 issues, master-key integrity `gateReady=true`, 사용 공식키 106개를 확인했다. 최신 라벨 변형 inventory는 0행·0문항이며 검색용 alias 4종만 source JS와 분리해 유지한다.
- 문항 JS·DB·question-index·identity runtime과 commit/push/deploy는 변경하지 않았다.

### AP Math JS 아카이브 source-dependent 메타데이터 영구 종결 (2026-08-24)

- `emptySchool` 28건·필수 메타 gap 60건(필드 occurrence 168건)을 `PERMANENT_SOURCE_UNAVAILABLE`로 영구 종결하고 활성 작업 목록에서 제거했다.
- 영구 종결 ledger는 `archive/_generated/intelligence/phase3/archive-db-source-permanent-closure-v1.json`(digest `dbf57ce976c1d00e159abf6dbec034688a369af4bb79755f6ed928c390f49a42`)이며 `reopenOnlyWhen=never`다.
- DB의 빈 필드·기존 closure ledger·문항 파일은 보존했고, 값 추정·DB/JS/index/runtime 쓰기·물리 삭제·commit/push/deploy는 하지 않았다.

### docs/implemented 실제 코드 대조 (2026-08-24)

- frontend의 오래된 `report.js` 참조를 실제 분할 모듈 `report-text.js`·`report-center.js`·`report-print.js` 기준으로 보정했다.
- `index.js`에서 실제 import·dispatch되는 누락 route 4개(`timetable-months`, `wrong-clinics`, `eie`, `backdoor`)를 route map에 기록했다.
- `schema.sql`의 67개 선언 중 기존 표에 없던 7개 table과 route-managed 저장소를 DB map에 기록했다. `report_exam_cohort_stats`는 table이 아닌 `initial-data` 계산 응답 key임을 명시했다.
- 이번 대조는 문서만 변경했다. route/schema/frontend runtime, archive data/index/identity, deploy·remote D1·production smoke는 수행하지 않았다.

### report cohort / 평가리포트 검증 (2026-08-24)

- Worker `buildReportExamCohortStats`의 실제 함수 본문을 임시 실행 컨텍스트에서 검증했다. 같은 `archive_file + examYear + 학년` scope, 학생 grade 우선·반 grade fallback, 다중 반 연결 dedupe, rank, questionStats, 제목·날짜 fallback을 확인했다.
- `report` 문자열을 포함하는 관련 테스트 31개를 실행해 전부 통과했다. report center 진입, 평가/학교시험 dashboard, 학생 view, print, archive image, parent 문구·sync까지 포함한다.
- plain Node direct import는 `cloudflare:workers` loader 제약이 있지만, 해당 모듈만 loader stub으로 매핑한 기존 `tests/report-cohort-stats-worker.test.mjs`는 통과했다. 같은 loader로 실제 `index.js` `/api/initial-data` fetch를 mock D1에 연결해 `report_exam_cohort_stats` payload가 정상 생성되는 것도 확인했다.
- local `file://` 브라우저 접근은 Browser URL 정책으로 차단됐지만, 로컬 HTTP에서 대표 archive `26_금당고_1학기_기말_고2_대수`를 exam/sol/ans로 확인했다. 표시 시험지·해설·정답은 각각 21개로 source/DB `qCount=21`과 일치했고, exam 이미지 6개 로드·수평 overflow·visible 오류·console error/warning 0건이었다.
- remote D1/Worker initial-data payload, production smoke, deploy는 수행하지 않았다.
- 이번 단계에서 `apmath/`, `archive/`, DB, question-index, identity runtime은 변경하지 않았다. source-dependent `emptySchool` 28건·필수 메타 gap 60건도 그대로 deferred queue다.
- production live read-only에서 archive 시험지의 cohort 인원 5명·전체 평균 78점·반 평균 78점을 확인했다. 같은 화면의 문항분석은 `0/-`, 문항 상태는 `분석 대기`, 블루프린트는 없음으로 표시됐다.
- 코드 대조로 `initial-data`의 `report_exam_cohort_stats`와 `exam_blueprints` 전달 차이 및 report center의 lazy loader 미호출을 확인했고, `report-center.js`에 archive-scoped blueprint lazy load·완료 후 refresh·빈 응답 재요청 방지를 추가했다. `node --check`와 핵심 회귀 4개가 통과했다. 별도 staging Worker/D1 target이 확보되면 동일 payload와 화면을 재확인한다.

### AP Math JS 아카이브 consumer regression 재검증 (2026-08-24)

- archive 목록 검색·학년·연도·시험기간 필터와 mixer 시험지 로딩·문항 목록·장바구니·출력 모달을 로컬 HTTP에서 재확인했다.
- 대표 `26_금당고_1학기_기말_고2_대수`는 `exam` 21문항·`sol` 해설 21개·`ans` 정답 21개를 표시했고 이미지 3개, overflow, visible error, console error/warning은 0건이었다.
- dashboard/high1 정적 소비자 테스트가 통과했다. 현재 canonical index와 어긋난 high1 단원별 기대 카운트만 테스트에 갱신했으며 운영 문항·DB·question-index 생성 로직은 건드리지 않았다.
- 상세 결과는 `docs/review-packs/archive-consumer-regression-20260824/CODEX_RESULT.md`다. Browser in-app이 popup 탭을 유지하지 않아 `mixed_engine.html` 최종 렌더는 선택적 후속 확인으로 남긴다.

### AP Math JS 아카이브 blueprint metadata bridge Phase 2A (2026-08-24)

- 현재 archive 계획 단계는 출력 QA가 아니라 `Phase 2 Archive Metadata Bridge / APMS Sync`다.
- `exam_blueprints`에 기존 identity·primary key를 보존한 채 `sub_unit_key`, `type_key`, `template_key`, `difficulty`, `metadata_revision`, `metadata_hash` nullable 컬럼과 인덱스를 additive로 추가했다.
- schema/migration 계약 테스트·canonical identity 회귀 테스트·Worker syntax check가 통과했다. 원격 D1 적용과 기존 blueprint backfill은 수행하지 않았다.
- 다음 활성 단계는 `syncExamBlueprintsFromArchive()` metadata-aware upsert(Phase 2B)이며, 이후 revision/hash sync·backfill dry-run·backfill·QR/OMR 회귀 순서다.
- 상세 결과는 `docs/review-packs/archive-blueprint-metadata-bridge-phase2a-20260824/CODEX_RESULT.md`다.

### AP Math JS 아카이브 blueprint metadata bridge Phase 2B (2026-08-24)

- 계획서의 현재 단계에 맞춰 archive metadata → `exam_blueprints` bridge를 구현했다. 기존 행 존재 여부가 아니라 `metadata_revision`·`metadata_hash` 비교 결과로 skip/upsert를 결정한다.
- standard/subunit/concept/problem type/template/difficulty/tags를 정규화하고 `problemTypeKey → type_key`, `difficultyBucket → difficulty` 등 기존 필드 호환 alias를 적용했다. source ordinal을 우선으로 비교하고 legacy question number를 보조로 사용한다.
- `exam-blueprints` POST와 MIXED payload에도 bridge 필드를 전달하며, 누락된 hash는 Worker에서 동일한 payload로 계산한다. canonical source UID/ordinal은 보존된다.
- Worker syntax check, metadata bridge contract, canonical identity propagation 테스트가 통과했다. 원격 D1 migration, backfill dry-run/backfill, QR/OMR 실환경 회귀는 아직 실행하지 않았다.
- 상세 결과는 `docs/review-packs/archive-blueprint-metadata-bridge-phase2b-20260824/CODEX_RESULT.md`다.

### AP Math JS 아카이브 blueprint metadata bridge Phase 2C/2D dry-run (2026-08-24)

- 로컬 SQL export를 읽어 archive JS와 blueprint를 비교하는 `dry-run-archive-blueprint-backfill.mjs`를 만들고 보고서를 생성했다. 실제 D1 접속·쓰기·배포는 없다.
- 기준 export는 2026-06-22 백업으로, 920 blueprint rows·40 files를 파싱했다. Phase 2A 컬럼이 없는 stale schema라 보고서 상태는 `BLOCKED_SCHEMA_MISSING`이다.
- 805문항은 source와 비교 가능한 inventory로, 3파일은 source missing, 1개 MIXED는 archive source 없음으로 분리됐다. `updateRequired=805`는 실제 production update 승인 수치가 아니다.
- 최신 Phase 2A 적용 후 D1 export를 다시 받아 hash diff를 재판정해야 한다. dry-run contract/실행 테스트는 통과했다.
- 상세 결과는 `docs/review-packs/archive-blueprint-backfill-dry-run-20260824/CODEX_RESULT.md`다.

### AP Math JS 아카이브 blueprint backfill SQL plan Phase 2E 준비 (2026-08-24)

- dry-run 도구에 `--sql-out` 검토 전용 SQL plan 생성을 추가했다. Phase 2A metadata와 canonical identity 컬럼이 모두 있는 export에서만 동작하며, SQL을 실행하지 않는다.
- 생성 형식은 기존 `(archive_file, question_no)` primary key를 보존하는 deterministic UPSERT다. unchanged 행은 제외하고 update/insert 대상만 계획에 포함한다.
- 현재 사용 가능한 2026-06-22 stale export는 schema guard에 걸려 SQL plan을 생성하지 않았다. 최신 D1 export와 sample review가 선행되어야 실제 Phase 2E backfill로 넘어갈 수 있다.
- `node --check archive/tools/intelligence/dry-run-archive-blueprint-backfill.mjs` 및 `node tests/archive-blueprint-backfill-dry-run.test.mjs`가 통과했다.
- 상세 결과는 `docs/review-packs/archive-blueprint-backfill-sql-plan-phase2e-20260824/CODEX_RESULT.md`다.

### AP Math JS 아카이브 blueprint backfill sample review (2026-08-24)

- stale dry-run diff 300건을 현재 archive JS와 독립 재대조했다. source ordinal·question number·metadata hash 모두 300/300 일치했다.
- sample의 source missing·문항번호 mismatch·hash mismatch는 0건이다. 원본 export schema가 오래되어 report status는 여전히 `BLOCKED_SCHEMA_MISSING`이며, 실제 backfill은 실행하지 않았다.
- `node --check archive/tools/intelligence/review-archive-blueprint-backfill-sample.mjs` 및 sample review 실행 테스트가 통과했다.
- 상세 결과는 `docs/review-packs/archive-blueprint-backfill-sample-review-20260824/CODEX_RESULT.md`다.

### AP Math JS 아카이브 blueprint backfill batch safety gate (2026-08-24)

- `validate-archive-blueprint-backfill-plan.mjs`를 추가해 SQL plan의 destructive statement, deterministic UPSERT 형식, report 문장 수 일치 여부를 검사한다.
- 현재 stale export에서는 `BLOCKED_SCHEMA_MISSING`으로 batch review를 차단한다. 안전/위험 fixture 검증은 각각 통과/거부됐다.
- 최신 D1 export와 승인된 sample review 전에는 batch update나 post-audit를 실행하지 않는다.
- 상세 결과는 `docs/review-packs/archive-blueprint-backfill-plan-validation-20260824/CODEX_RESULT.md`다.

### AP Math JS 아카이브 blueprint QR/OMR regression baseline (2026-08-24)

- Phase 2 완료 게이트의 QR/OMR 정적 회귀 7개를 backfill 전 기준선으로 실행했으며 7/7 통과했다.
- 결과는 `STATIC_REGRESSION_PASS`, `postBackfill=false`다. 최신 D1 export와 승인된 batch/post-audit 후 동일 테스트를 재실행해야 한다.
- 실행 도구는 `archive/tools/intelligence/run-archive-blueprint-qr-omr-regression.mjs`이며 D1/Worker/browser를 변경하지 않는다.
- 상세 결과는 `docs/review-packs/archive-blueprint-qr-omr-regression-baseline-20260824/CODEX_RESULT.md`다.

### AP Math JS 아카이브 blueprint post-audit 준비 (2026-08-24)

- batch 이후 schema/diff/source/MIXED identity를 판정하는 read-only `audit-archive-blueprint-backfill.mjs`를 추가했다.
- 현재 stale export는 `BLOCKED_SCHEMA_MISSING`이며 post-audit PASS를 주장하지 않는다. schema-ready zero-diff fixture는 `POST_AUDIT_PASS`로 확인했다.
- 실제 D1 batch 결과 확보 후 이 도구를 재실행해 Phase 2 최종 판정을 내린다.
- 상세 결과는 `docs/review-packs/archive-blueprint-post-audit-20260824/CODEX_RESULT.md`다.

### AP Math JS 아카이브 blueprint migration·Worker 배포 (2026-08-24)

- `20260820_exam_blueprint_canonical_question_identity.sql` → `20260824_archive_blueprint_metadata_bridge.sql` 순서로 원격 D1 migration을 적용했다. 원격 baseline에 이미 있던 `type_key`·`difficulty`는 보존하고, 누락된 bridge 컬럼·인덱스만 두 번째 migration에서 추가했다.
- 원격 `exam_blueprints`의 8개 identity/metadata 컬럼과 3개 신규 인덱스, `d1_migrations` 순서 기록을 read-only query로 확인했다.
- Worker `ap-math-os-v2612`의 syntax check·dry-run·production deploy가 통과했다. version ID는 `b3b4b8fa-f4f7-46b3-8f21-9da16820867a`다.
- backfill은 실행하지 않았다. 최신 D1 export → hash dry-run → sample review → SQL safety gate → batch update → post-audit → QR/OMR 재검증 후에만 Phase 3로 넘어간다.

### AP Math JS 아카이브 blueprint backfill·post-audit (2026-08-24)

- Phase 2A schema-ready 원격 export에서 1,260개 review-only UPSERT를 safety gate 통과 후 적용했다. 실행 결과는 1,260 queries, 7,572 rows written이다.
- backfill 후 source-backed 1,260문항의 `metadata_revision`·`metadata_hash` diff는 0이며, QR/OMR 정적 회귀 7/7을 재실행해 통과했다.
- post-audit는 `POST_AUDIT_REVIEW_REQUIRED`다. MIXED 7개 파일/343행은 source identity가 없고, source JS 부재 3개 파일/72행과 legacy orphan blueprint 4행이 남아 있다.
- orphan 4행은 sparse question number를 잘못 ordinal로 해석하지 않도록 dry-run/audit에 `unmatchedDbRows` blocker를 추가해 보류했다. 이 상태에서 Phase 3로 승격하지 않는다.

### AP Math JS 아카이브 MIXED identity 승격 및 잔여 blocker 재판정 (2026-08-24)

- MIXED 7개 파일·343행을 원본 JS의 출처 파일/문항번호와 전수 대조했다. 누락·파싱 오류·UID/ordinal 불일치 없이 343/343행을 canonical UID·source ordinal·metadata hash로 확정했다.
- 변경 전 원격 D1 export를 보존하고 검토 전용 UPDATE 343건을 적용했다. 적용 후 재수출·재감사에서 343/343행의 identity와 metadata hash가 안정적으로 일치했으며, QR/OMR 정적 회귀도 7/7 통과했다.
- post-audit의 MIXED identity blocker와 source-backed metadata diff는 해소됐다. 다만 sparse source orphan 4행과 원본 부재 3파일·72행은 여전히 보류 중이며, 삭제·추정 보강 없이 별도 disposition을 확정해야 한다.

### AP Math JS 아카이브 잔여 blueprint blocker disposition (2026-08-24)

- 최신 disposition 보고서에서 source-unavailable 3개 파일·72행과 sparse legacy orphan 4행, 총 76행을 `DISPOSITION_REQUIRED`로 고정했다.
- 원본 부재 행은 보강·삭제하지 않고, orphan은 question number를 ordinal로 추정하지 않고 그대로 보류한다. 따라서 question-index/runtime 승격 게이트는 아직 닫혀 있다.

### AP Math JS 아카이브 운영 index·identity 재생성 및 QA (2026-08-24)

- 현재 운영 JS 기준으로 Phase 0 inventory/collision과 세부단원 classification snapshot을 재생성했다. 438개 파일·10,686문항, UID 충돌 0건이다.
- question-index·identity map/runtime을 재생성해 identity digest `aec6a7d1d9eb05dfb2f6b1e36014094b0971da5e6b480825638682862b4b7523`, runtime digest `3c51696802ebf67c3b34eead165640d5f8883e16a4436196cd570205e2064deb`로 고정했다.
- 운영 세부단원 QA와 DB consistency에서 index/production 필드·문항 수·파일 매핑 게이트가 모두 통과했다. source-dependent DB 28/60건과 blueprint 보류 76행은 변경하지 않았다.

### AP Math JS 아카이브 Phase 2 최종 게이트 (2026-08-24)

- blueprint post-audit·MIXED identity·QR/OMR 회귀·identity map·DB consistency·운영 세부단원 QA를 최종 재실행해 통과했다.
- 남은 범위는 원본 부재/legacy orphan blueprint 76행과 source-dependent DB 28/60건이며, 자동 추정·삭제 없이 보류한다. Phase 3 신규 승격은 이 보류 범위 처리 전에는 진행하지 않는다.

### AP Math JS 아카이브 후보 기출 승격 후 재검증 (2026-08-24)

- 효천고 26행·매산여고 23행·순천고 23행의 `기출c.js` 후보를 blueprint source로 승격했다. 후보 파일을 복제해 중복 등록하지 않고 기존 `original/...` 경로를 정식 source로 연결했다.
- 원본 부재 72행은 해소됐고, 최신 post-audit의 source missing·metadata diff는 0이다. QR/OMR 7/7과 MIXED identity 343/343도 통과했다.
- 현재 blueprint 보류는 삼산중 sparse orphan 4행으로 축소됐다. source-dependent DB 28/60건은 별도 정책 보류로 유지한다.

### AP Math JS 아카이브 삼산중 orphan D드라이브 원본 대조 (2026-08-24)

- D드라이브의 2026-04-27 삼산중 1학기 1차 정기시험 PDF를 확인했다. PDF q1~q4, q9~q20 및 서술형 4개 항목은 현재 운영 JS와 일치한다.
- PDF q5~q8은 서로 다른 실제 문항으로 존재하지만 운영 JS에는 누락되어 있다. DB orphan q5~q8은 source q9~q12를 잘못 참조하는 레거시 오지정이다.
- 이번 라운드에서는 JS·DB를 변경하지 않았고, orphan 4행을 삭제·재매핑하지 않았다. 원본 대조 보고서는 `archive/_generated/intelligence/phase2/samsan-orphan-d-drive-comparison-20260824.md`다.

### AP Math JS 아카이브 삼산중 q5~q8 전사 및 동기화 완료 (2026-08-24)

- D드라이브 PDF의 q5~q8을 전사하고 q5 도형 asset을 추가했다. 운영 JS는 24문항(ID 1~24)으로 복구됐으며 q5~q8의 정답·풀이를 독립 검증했다.
- question-index·identity map/runtime·분류 스냅샷을 438개 파일·10,690문항 기준으로 재생성했다. UID 충돌·identity 실패·분류 제외는 모두 0이다.
- sparse question number를 ordinal로 오인하지 않도록 backfill dry-run의 source question 우선 매칭 및 identity 검사 로직을 보강했다. 원격 D1에 삼산중 q1~q24의 canonical UID/ordinal/hash를 반영했다.
- post dry-run 및 post-audit는 `POST_AUDIT_PASS`다. source question 1,336건 전부 unchanged, update/insert 0, unmatched/source missing/parse error 0으로 확인됐고, 삼산중 orphan 4행은 실제 q5~q8로 해소됐다. 배치 audit도 24/24 indexed, errors 0으로 통과했다.

### AP Math JS 아카이브 전체 운영 QA 및 향림중 해설 보강 (2026-08-24)

- 전체 audit에서 발견된 24_향림중_2학기_기말_중1_기출.js 24문항의 해설 공란을 D드라이브 시험지·해설 PDF 근거로 채웠다. 빈 해설 inventory는 0건이다.
- 향림중 3모드 QA는 exam 24문항/6쪽, sol 24해설/5쪽, ans 24정답/1쪽으로 통과했다. 이미지 로딩, overflow, render error, console error/warning 모두 이상이 없다.
- 운영 index·identity·분류 스냅샷을 다시 생성해 438개 파일·10,690문항, UID 충돌 0, identity 실패 0, metadata load/join 실패 0을 확인했다. QR/OMR 정적 회귀도 7/7 통과했다.
- 후보 JS는 운영 JS와 byte/hash를 다시 맞췄고, 전체 deterministic audit에서 candidate mismatch·empty solution은 0건이다. 남은 audit 경고 28건은 기존 source-dependent DB school 공란 정책 예외다.

### AP Math 출제 대상 통합 패널 Phase 3 사전 검증 (2026-08-24)

- `ARCHIVE_EXAM_TARGET_SELECTION_NEXT_PLAN.md` 기준으로 Loop 1(학생 roster·벌크 제외 API)과 Loop 2(학년→반→학생 통합 패널)는 구현 상태를 다시 대조했다.
- `exams.js`·`check-omr.js` `node --check`와 Wrangler Worker `--dry-run` 번들 검증이 통과했다. 새 migration은 없으며 기존 `attendance`, `exam_sessions`, `class_exam_assignment_exclusions`를 재사용한다.
- 통합 패널의 stale grade-target 정적 테스트 2건을 현재 계약(`assignTargetModalOverlay`, `AssignTarget.scope`, 최종 확인·부분 제외)에 맞춰 갱신했고 관련 5개 테스트가 모두 통과했다.
- Phase 3의 실제 로그인 E2E(학년 전체·다중 반·학생 부분 선택·student-portal 노출/제외)는 배포된 Worker와 인증 세션이 필요하므로 아직 실행하지 않았다. 배포 전에는 원격 DB/API를 호출하지 않는다.
- 현재 production Worker version 217(`b3b4b8fa-f4f7-46b3-8f21-9da16820867a`)에서 `class-exam-assignments/roster`를 무인증으로 호출해 `401 Unauthorized`를 확인했다. 브라우저에서도 `assignTargetModalOverlay` 진입과 로그인 유도 화면을 확인했으며, 계정 입력 없이 학생 데이터를 조회하거나 배정 쓰기를 시도하지 않았다.
- 로그인된 Chrome 세션에서 삼산중 중3 roster 2개 반(총 11명)을 실제 조회했다. 학년 전체 최종 확인(2개 반·11명)과 반 내 부분 선택 최종 확인(한 반 일부 + 다른 반 전체·총 10명·제외 1명)까지 통과했으며, 실제 배정 POST/제외 POST는 운영 데이터 보호를 위해 승인 전 실행하지 않았다.

### AP Math 출제 대상 통합 패널 Phase 3 승인 실행 (2026-08-24)

- 사용자 승인 후 삼산중 중3 기출(24문항)을 운영 세션에서 실제 출제했다. 중3A는 4명 중 3명만 대상으로 등록하고 1명은 `exclude-students` 벌크 제외로 처리했으며, 중3B는 7명 전체를 등록했다.
- 통합 패널 진행 화면에서 중3A·중3B 모두 `✔` 성공으로 종료됐다. 두 반은 하나의 공유 `assignment_batch_id`로 순차 등록됐다.
- 출제 후 중3 출제보드 read-only 조회에서 `26_삼산중_1학기_기말_중3_기출`이 `중3A, 중3B`로 표시되는 것을 확인했다(기준일 2026-08-24, 최근 30일 범위).
- 학생 포털은 기존 `student-portal.js`의 `class_exam_assignment_exclusions`/`AND NOT EXISTS` 필터가 배정 조회의 단일 기준으로 유지되고 있으며, 이번 변경에서 해당 로직을 수정하지 않았다. 따라서 별도 학생 계정 E2E를 추가 보류하지 않고 기존 계약 충족으로 정리한다. 이번 실행은 커밋·푸시 없이 운영 API 반영과 보드 검증까지만 수행했다.

## 3. 문서 구조 정리 결과

- `docs/` 루트는 진입/3대 기준/정책/구조/도메인 인덱스/문서 업데이트 규칙 중심으로 정리했다. 2026-08-22 감사에서 루트 잔여 문서도 의미별 하위 폴더로 이동했다.
- 보조 구조 문서는 `docs/guides/`, 현재 구현 상태는 `docs/implemented/`, 계획은 `docs/plans/`, Codex 규칙은 `docs/codex/`로 이동했다.
- 과거 결과와 완료 문서는 `docs/archive/` 하위 표준 폴더로 이동했다.
- 삭제한 문서는 없다.
- 이동 이력은 `docs/_index/ARCHIVE_INDEX.md`에 기록했다.

## 4. 확인 필요

- 이번 라운드에서 `docs/implemented`의 주요 path·route import/dispatch·schema table 참조는 정적 대조했다. Worker/frontend 동작의 line-by-line·브라우저 QA와 remote 상태는 별도 확인이 필요하다.
- archive 내부 과거 문서 본문의 과거 경로는 모두 고치지 않았다. 현재 진입 문서와 index의 경로를 우선 보정했다.
- 현재 문서 본문에서 이동된 루트 경로를 가리키던 링크는 보정했다. `docs/review-packs/**`의 historical `CODEX_RESULT.md`는 당시 zip 경로를 보존하므로 별도 final-gate 복구 전까지 historical snapshot으로 취급한다.
- 현재 archive 운영 문서와 master/rulebook은 세부단원 운영규칙 v1을 기준으로 동기화했다. 과거 `archive/_generated/**`와 `archive/archive/docs/**` 보고서는 당시 수치와 판단을 보존하는 historical snapshot으로 유지한다.

## 5. 근거 문서

- 문서 구조: `docs/_index/DOCS_STRUCTURE.md`
- 이동 이력: `docs/_index/ARCHIVE_INDEX.md`
- 루트 진입: `docs/README.md`, `docs/00_READ_ME_FIRST.md`
- 도메인 정책: `docs/domains/*.md`
- 현재 구현 지도: `docs/implemented/*.md`
- 다음 계획: `docs/plans/*.md`
- Codex workflow: `docs/codex/*.md`
