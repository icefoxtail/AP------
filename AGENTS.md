## CURRENT TOP — 작업별 진입 / 과거 Notion 필독 해제 (2026-10-22)

- **범용으로 'GPT 작업 전 필독 라우터' 900줄과 Archive 생명주기를 매 작업 선열람하는 의무를 폐지한다.** 사용자 지정 범위·역할·현행 exact Git/Notion CURRENT **한 곳과 실물**에서 바로 시작한다. [Notion 공통 행동 규칙](https://app.notion.com/p/3e10e68bd69f81f19397e7cd1c8d3cfd)은 실제 공통 원칙·충돌이 있을 때만 확인하며, [캠페인별 상세 문서](https://app.notion.com/p/4010e68bd69f81b7a445c7c48abe1c05)는 **자기 캠페인 담당자만** 연다.
- 캠페인 스케줄·NEW14/HIGH_DYNAMIC·ALIVE·M3 등 개별 품질·인계·예외·현황의 수정은 **각 캠페인/역할 문서에서만** 수행한다. 범용 필독 라우터에는 프로젝트별 작업 이력·PR·ON/OFF·시간표를 추가하지 않는다. 신규 CREATE/R1/R2/R3의 최초 수학·블라인드·검수 증거 품질은 유지한다.
- GPT **사후 FINAL QA**는 [단일 실행 카드 v2.0](docs/operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md)부터 읽고 열린 결함만 최소 수리 → 필요 시 시험지별 소형 등록 요청 → main 병합/대상 blob readback으로 종료. 후속 자동 DB/index/검색·Pages는 Git Actions 책임. Actions PASS를 근거 없이 선언하지 않고, 후속 CI poll은 GPT 종료조건에서 제외한다.

## CURRENT TOP — 메타 계약은 정확한 업무 정본으로 이동 (2026-10-22)

- [Notion 02-06 메타데이터 라우트](https://app.notion.com/p/4010e68bd69f81588ea0cc325bbe51cb)에서 **의미 판정**과 **공용 조회/소형 JSON 쓰기** 및 **Git 자동 등록 기술 담당**을 구분한다. 실질적인 규칙은 [의미 메타 정본](docs/architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md)과 [소형 JSON 쓰기 정본](docs/architecture/JS_Archive_Small_JSON_Meta_Write_Contract_CURRENT_v1.md)에 둔다. 기존 역할별 검수·Golden·Blind 의무는 유지한다.
- 공용 대형 메타는 조회용이며 시험지 UID 메타 수정은 시험지 소형 JSON/stage-local 패킷으로 작성한다. 공유 canonical 변경은 별도 `archive-reviewed-canonical-maintenance-request-v1` 인프라 요청으로만 제출하며 시험지 `items` 승인을 섞지 않는다. 병합 후 UID 등록·직접 영향 Consumer/Search parity는 Git 자동화/기술 소유 범위다. GPT 사후 FINAL QA의 종료는 [v2.0 카드](docs/operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md)대로 Git main/대상 blob 확인까지이며, PT/TPL 신규 검사 제외·후속 CI/Pages 수동 폴링 제외를 지킨다. 자동화 검증을 수행하지 않았으면 `PIPELINE_PASS`라고 주장하지 않는다.
- **읽기·쓰기·완료:** `archive/data/question_metadata.json`은 기존 UID 메타 조회용이며 필요한 시험지 N개만 필터한다. 의미 정본은 최신 ACTIVE registry/RPM/bindings다. 시험지 메타는 소형 JSON/stage-local 패킷으로 작성하고, 공유 canonical 변경은 별도 `archive-reviewed-canonical-maintenance-request-v1` 인프라 요청으로 제출한다. 허가된 단일 GitHub Actions writer만 공유 projection을 생성한다. 시험지 v2는 `REVIEW2`와 `FINAL_QA`를 분리하고 curriculum/course 및 ACTIVE binding을 정본에서 조회하며, 과목 코드로 지원 범위를 제한하지 않는다. Canonical maintenance는 `approval.type: CANONICAL_MAINTENANCE`, `items: []`, exact `registryChanges`/`crosswalkRefreshPaths`를 사용한다. `APPLIED`는 완료가 아니며 해당 schema의 `--verify-projection` 또는 `--verify-maintenance`, Actions main readback과 실제 결과를 구분한다. 브라우저/배포 미실행은 `NOT_RUN`이다. Legacy v1/미버전 H22-C2 제한을 v2에 일반화하지 않는다. 예약 워커 Git writer 금지와 역할별 품질 검수 의무는 유지한다.

## CURRENT TOP — 사용자 지정 시험지 출고: 상태값만으로 전건 보류 금지 (2026-10-19)

- 사용자가 범위·examUid를 지정해 `main` 운영병합을 명시하면, **지정 감독·출고 실행자 Codex/Work/ROOT가 실제 R3/MASTER 패킷 검토·표적 결함 수리·PR/main 병합·요청된 Drive DONE 마감까지 직접 수행**한다. `SUPERVISORY_REVIEW_REQUIRED`, `PENDING_SUPERVISOR_DECISION`, `R3_REVIEWED`, `readyForUnattendedMerge=false`, `qualityPass=false`, `NOT_RUN`이라는 상태명 **단독**으로 승인자 부재를 이유 삼아 0건 PR·전건 중단 보고하는 것은 금지한다. `readyForUnattendedMerge=false`는 사용자 승인 없는 무인 자동 병합 금지이지 사용자 직접 지정한 감독 실행 금지가 아니다.
- 기존 검수 실증거를 승계하되 진짜 open qid/원본 충돌/JS·에셋 손상 등 직접 차단은 해당 시험지에서 **최소 확인·수정·영향 재확인**, 해결 불가하면 해당 시험지만 정확한 근거로 분리. 품질 PASS/검사 실행을 꾸미지 말고 나머지는 병합을 계속한다. GitHub 보호 규칙 우회 및 범위 밖/공통 CI 수리/전면 R1~R3 재시작 금지.
- HIGH_DYNAMIC 출고 입력은 [Google Drive RELEASE_HUB](https://drive.google.com/drive/folders/1DQigbs29hiuvwxbS-6i7w6hK6iziNk57)의 대상 PENDING revision이며 구 ChatGPT Library 허브가 아니다. 병합 후 원격 `main` SHA·대상 blob SHA 확인, **같은 revision만** Drive DONE+PR/SHA 기록/readback. main 병합만 요청된 경우 `GIT_MAIN_MERGED`와 CI/Pages 검증 상태를 분리한다.
- **운영병합 세부 정본:** [Archive MAIN_FIRST / CI_DEFERRED — 2026-10-19 감독 인수 override](docs/operations/Archive_MAIN_FIRST_CI_DEFERRED_CURRENT.md). 이 상단 조항이 출고 상태만으로 별도 관리자 인증을 기다리게 하는 구 해석에 우선하며, 예약 CREATE/R1/R2/R3·MASTER의 Git writer 금지는 불변이다.

## CURRENT TOP — 명시적 MAIN 운영병합은 CI 후속 수리와 분리 (2026-10-18, user-directed)

- 사용자가 시험지/산출물의 `main` 운영병합을 지시하면 **인가된 출고 담당 GPT Work/Codex/ROOT는 병합부터 실행한다.** `CI` pending/fail/not_run이나 무관한 오래된 테스트 실패를 선행 승인·중단 게이트로 해석하지 않는다. GitHub가 허용하는 PR 병합을 CI 완료 전에 시도하고 실제 원격 main SHA 및 파일을 readback한다.
- **CI 결과와 병합은 독립 장부**: `GIT_MAIN_MERGED`는 실제 병합만 뜻하며 CI/Pages/학생 배포 PASS를 뜻하지 않는다. CI 오류는 `CI_DEFERRED/CI_FAIL_FOLLOWUP`으로 사실대로 남기고 **사용자가 따로 지시하기 전에는 CI 수리·공통 도구/워크플로 수정·재검수·게이트 완화를 하지 않는다.**
- branch protection/required checks가 실제 GitHub 병합 API를 거절하면 강제 push나 보호 해제는 금지하며, PR·정확한 오류를 남긴다. 기존 시험지의 정답/필수 자산 실제 결함도 거짓 PASS로 우회하지 않고 해당 대상만 분리한다. 예약 CREATE/R1/R2/R3 Git writer 금지는 유지한다.
- **공통 실행 정본:** [Archive MAIN_FIRST / CI_DEFERRED](docs/operations/Archive_MAIN_FIRST_CI_DEFERRED_CURRENT.md). 명시적 “main 병합만”은 전체 학생 사이트 배포 및 콘텐츠 재검수 지시가 아니다.

## CURRENT HARD — 모든 GPT 예약라인 프롬프트 개설·수정 공용 정본 (2026-10-17 / v1.0.0)

- 모든 신규·재설정 JS Archive GPT 예약(MASTER / CREATE / R1 / R2 / R3)은 **[예약라인 프롬프트 공용 CURRENT 정본](docs/rules/02_PIPELINES/gpt-reservation/README_CURRENT.md)**과 같은 디렉터리의 정확한 역할 파일을 실제 본문으로 읽고 캠페인별 manifest·원본·Library·스케줄·ON/OFF 값을 바인딩하여 만든다. 현재 캠페인 HIGH_DYNAMIC만의 시간·원본 ID·학교명은 타 캠페인으로 복사하지 않는다.
- 공용 프롬프트의 새 역할·실제 문서 필독 영수증·qid별 정밀 Meta 실조회·Golden/Negative·원래 단계 책임 구분(OWNER_INCOMPLETE vs 진짜 EVIDENCE_DEBT)과 nonblocking ROUTED≠PASS 원칙을 유지한다. 기존 캠페인의 frozen roster·유효한 freeze/해설·품질계약·현재 사용자 명시 지시가 우선이다.
- [역할별 문서](docs/rules/02_PIPELINES/gpt-reservation/README_CURRENT.md#3-역할-파일-5개--복사수정은-여기서-시작)·[변경 이력](docs/rules/02_PIPELINES/gpt-reservation/CHANGELOG.md)을 함께 확인한다. 새로 발견한 빈틈을 고치면 해당 역할 파일/README/변경 이력을 좁게 수정하고 Git main·노션 예약 CURRENT 링크 및 **실제 예약 prompt 별도 readback**을 구분한다. 문서 갱신만으로 예약 실행/활성 상태가 바뀌거나 실제 검사 PASS가 됐다고 주장하지 않는다.

## CURRENT TOP OVERRIDE — NEW14 supervisory GPT final decision & publication (2026-10-17, user-directed)

Scope strictly `SOURCE_ONLY_INTAKE14_20261016`; four current supervisor-selected exams are `22_효천고_1학기_중간_고2_수학I`, `21_금당고_1학기_중간_고2_수학I`, `21_순천여고_1학기_중간_고2_수학I`, `21_순천고_1학기_중간_고2_수학I`. This clause overrides older NEW14 statements that the scheduled MASTER alone issues final `FINAL_HOLD` / `R3_PASS` / `RELEASE_READY`. Scheduled CREATE→R1→R2→R3 keep the existing nonblocking Library handoff and actual quality work; R3 routes `R3_REVIEWED/READY_MASTER_DECISION` **to the supervisory interactive GPT**, not for a scheduled MASTER approval. An already-recorded scheduled MASTER `FINAL_HOLD` is a diagnostic record only, not a binding veto. The scheduled MASTER remains ON at :48 only for unoccupied CREATE/R1/R2/R3 bottleneck repair, not final release judging or Git mutation. Preserve R1 blind integrity, existing valid R2 fixes and stage evidence; don't demand complete stage reruns or unrelated Meta/Golden work for focused repair. Supervisory GPT independently examines actual Library JS/assets and residual qids, performs only justified minimal repairs, and decides content disposition. User-directed release means the supervisory GPT (or delegated technical publisher) publishes only truly ready exam JS and essential PNG/SVG on latest main and checks remote readback and relevant registration/technical QA; unresolved genuine content/asset defects are excluded rather than marked PASS. This override applies to NEW14 only; other campaigns and running schedule are untouched.

## CURRENT HARD — NEW14 R1/R2 proactive teacher-board upgrade, no artificial cap (2026-10-17 user direction)

For `SOURCE_ONLY_INTAKE14_20261016`, **R1/R2 are content-quality repair workers, not answer/Node/Meta checklist or merely routing workers.** R1 must solve and persist/freeze answer plus reasoning from answer-free source/student-visible visuals **before** seeing stored answer/solution; after comparing, it must actively examine and upgrade actual student solutions for mathematical logic, grade-appropriate methods, missing pivotal calculations/conditions, cases/boundaries and necessary solution diagrams. R2 is a **separate full-explanation teacher**: for every reviewable qid, actually follow the current solution like a student, reproduce each decisive calculation, verify why the equation/formula/auxiliary line is selected, explain transitions, cases, distractors and end conclusion, and actively rewrite inadequate explanations into readable Korean small-board teaching with real visuals when needed. R2 does **not** redo a full R1 blind pass; suspicious/high-risk qids are solved independently against the source. Record each qid as `UPGRADE` with deficiency→actual change→student benefit, `KEEP` with substantive sufficiency evidence, or exact `NOT_REVIEWED/EVIDENCE_DEBT`. **No maximum count of upgraded qids, no character/line/formula/image quota and no brevity optimization that drops necessary reasoning.** Do not force needless verbosity or a modification count. **At most one EXAM per run**, not one question or two revisions per exam; runtime, source availability and single-writer safety remain real limits. Partial execution still saves evidence and routes R1→R2→R3 without any worker HOLD or fake PASS. Earlier legitimate freezes and unmodified correct qids are preserved. The latest supervisory-GPT final decision override above remains authoritative; no changes to schedules, other campaigns or Git-publication permissions.

## CURRENT OVERRIDE — NEW14 GPT Library nonblocking conveyor (2026-10-17 user directive)

Scope ONLY `SOURCE_ONLY_INTAKE14_20261016`, its five GPT scheduled Library workers; other campaigns and Codex execution unchanged. User prioritizes keeping the CREATE→R1→R2→R3 conveyor moving over stage-local hold/closure. After making the best available real work, even when some stem/choices/answers/solutions/required source PNG or SVG/Meta are incomplete, CREATE must persist the actual candidate and exact missing qids/fields in Library and mark `CREATE_ROUTED/READY_R1`. R1 accepts partial input and independently freezes only qids it can actually solve, recording unreviewable qids without false blind PASS, then marks `R1_REVIEW_ROUTED/READY_R2`; R2 fills student small-board explanations, figures and metadata where possible and marks `R2_REVIEW_ROUTED/READY_R3`; R3 executes possible structural/asset/validator/render reviews, repairs defects and marks `R3_REVIEWED/READY_MASTER_DECISION`. NONE of CREATE/R1/R2/R3 may issue HOLD, reject a handoff for quality incompleteness, or block downstream progression. **Only the final MASTER** judges final `FINAL_HOLD` versus genuine, verified `R3_PASS/RELEASE_READY` after attempting repair and inspecting actual evidence. `ROUTED` is a transport marker, not a quality PASS or release authorization; distinguish old `*_DONE` compatibility routing labels from actually verified stage PASS. Preserve missing-field evidence, `EVIDENCE_DEBT`, `NOT_RUN`, R1 blind independence, existing legitimate review freezes, Library file identity/readback and no double-writing; Git mutation by these scheduled workers remains prohibited. No scheduled worker self-disables. The detailed NEW14 routing authority is the current GPT Scheduled Execution/Prompt Template and Notion GPT 예약 2.0 CURRENT. This targeted scope supersedes older CREATE validator/generic stage closure prerequisite text **only for routing**.

## CURRENT HARD — Git production-only / Drive cold evidence (2026-10-16 user direction)
- Git contains production sources/assets/runtime, build and test tools, current contracts, and only the index-declared offline hot evidence authorities. `archive/data/evidence-authority/v1/index.json` is the versioned source of exact aliases and per-entry source Git blob, SHA-256, byte length, role, and consumer bindings; consult it and the ROOT receipt for current counts and total bytes. Do not treat this lane as a quality verdict.
- After the authorized history rewrite, continue from a fresh clone and new rewritten history. Keep old dirty checkouts untouched for recovery; recover only reviewed changes by narrow cherry-picks onto the fresh clone, and never merge or cherry-pick an entire pre-rewrite graph. The active `tools/git-history-rewrite-policy.v1.json` and `docs/operations/Git_Footprint_and_Evidence_Retention_v1.md` define the ancestry guard and recovery path. Historical ROOT receipts' `historyRewrite: false` records their earlier preservation event only.
- The only permitted cold roots are the explicit prefixes `archive/analysis/`, `archive/_generated/`, `output/`, `reports/`, `render_review/`, `artifacts/`, `archive-work/`, `evidence/`, `archive/evidence/`, and `스캔_인테이크_산출물/`; each pack sidecar and ROOT receipt must carry the same allowlist subset. Raw histories, captures, catalog/conflict snapshots, backups, intermediate logs, and render outputs belong in the verified Drive vault and ignored local cache. Current/reusable source code stays in Git; historical scripts under a reviewed cold root may be archived when current-code consumer audit finds no active read/import. The prior blanket-ignore prohibition is superseded by this explicit user direction after the Drive pack and readback are verified. Until then, preserve source originals.
- Before removing any original Git paths, verify each Drive pack's exact ID, parent, name, MIME type, size, SHA-256, metadata readback, and full downloaded bytes against the sidecar path index and baseline Git blob/SHA-256. Git keeps only the compact verified ROOT pointer/receipt and the index-declared offline authority lane; the full path index and raw packs stay outside Git.
- Cold evidence is hydrated on demand into `.codex/archive-analysis-drive-cache/`. Verify the ZIP, internal manifest, member bytes, reconstructed full object SHA-256, size, and Git blob SHA-1 before returning bytes. Missing or corrupt evidence remains unavailable and cannot be converted to PASS.
- ROOT consumes compact verified completion receipts and fetches raw proof only when needed. Workers still inspect the actual source/evidence and perform the assigned independent quality review. Validators, review scope, and quality gates remain unchanged; Drive access must not become a GitHub CI prerequisite.

## CURRENT HARD — 실제 정본 숙독·제작 설계·UID별 품질 근거 (2026-10-14)
- **ALIVE/QID9 제작 시 역할별 선행:** 현재 ALIVE QID9·Meta·교육과정·해설·Visual/Golden 정본 중 **해당 제작 단계에 실제 적용되는 것만** 읽고 경로·SHA/적용 조항·실행 계획을 기록한다. 일반 FINAL QA나 다른 캠페인에 이 제작 전용 필독을 확대하지 않는다. 제목·목차만 훑고 읽었다고 선언하지 않는다.
- **제작 전에 설계:** 원본 qid·교육과정 내 풀이·고정 RPM Primary L3·L4·A/B/C의 실제 추가 사고·보기/정답 구조·문제/해설 SVG 필요성을 먼저 정한다.
- **UID별 증거 5축:** (1) 학습 level과 평가 difficultyBucket을 사고 단계·조건 분기·함정으로 독립 판정하고 각각 이유 기록(A/B/C 순서 자동 매핑 금지). (2) RPM L1~L4·PT/TPL·CrossConcept/Condition/Integration의 최종 풀이상 실제 필요성과 키의 정본 근거. (3) 해당 학년 교육과정 허용 공식/방법 및 학생 재현 가능한 해설·모든 보기와 조건 검증. (4) 문제 SVG (5) 해설 SVG 각각 필요성·실파일/SHA·좌표/primitive·라벨·경계점·가독성·실제 렌더 근거.
- **종료 조건:** 근거 없는 PASS 금지, 미확정 EVIDENCE_DEBT, 미실행 NOT_RUN. 변경 UID와 직접 의존 부분만 재검한다. 기존 예약 Library 인계/수동 Git 운영 경로 및 독립 검수 규정을 유지한다.

## CURRENT HARD — Codex 시험지 FAST LANE / 중복 검수·도구 수정 금지 (2026-10-12 사용자 직접 지시)

- **학생용 설명·SVG 표기:** 신규·이번 수정 qid의 학생 노출 설명은 한국어 정식 교육과정 용어로 쓰되 변수·점·좌표·함수·단위 등 표준 수학 기호는 보존한다. SVG에 raw TeX·caret·영어 제작 메모·debug·placeholder가 노출되지 않도록 하고, 필수 그림·좌표·점 라벨·조건은 삭제하지 않는다. SVG 내 수식 렌더가 불가능하면 본문 수식 엔진으로 옮겨 필수 의미를 보존한다. 기존 미변경 문항 전체에 소급하지 않는다.
- **2026-10-13 CREATE/R1/R2/R3 품질 기준:** CREATE는 전 문항을 직접 풀고 해당 연도·학년·과목 교육과정 안에서 논리적으로 완결된 학생용 해설 초안을 작성한다. R1은 완전한 학생용 지문·보기·그림·표로 전 qid 독립 답과 근거를 정답·해설 열람 전에 기록·동결한 뒤 비교한다. R1은 실제 최종 해설의 개념·공식·표기·방법을 교육과정과 대조해 최종 파일 ID+revision 또는 실바이트 SHA-256에 결속한다. 신규 R2는 별도 검수자가 **전 qid 현재 해설을 학생 관점에서 따라 검산·적극 개선**하고 중간 계산·조건 사용 이유·보조선 목적·논리 연결을 보완한다. R2 전체 blind 답안 동결은 요구하지 않으며 정답 불일치·의심·고위험은 원문/보기에서 독립 재풀이한다. 각 qid의 부족점·수정 전후·학생 이점, 무수정이면 설명 충분성의 근거를 누적 기록한다. 수정량 할당은 없다. R3는 변경·미해결·직접 영향과 최종 파일·구조만 확인하며 전수 의미검수를 반복하지 않는다. 검사기 PASS는 수학·교육과정 검수 완료를 대신하지 않는다. 실제 검사 범위/결과를 기록하고 미실행은 `NOT_RUN`으로 남긴다. 과거 유효한 blind/freeze/PASS는 보존하며 진행 중 작업은 재시작·중복배정하지 않는다.


- **2026-10-13 신규 문항 HOLD 발행 금지:** 신규 Codex 문항 작업은 임시 item/시험지/roster/run HOLD도 발행하지 않는다. 결함은 담당자·qid·다음 수정 행동을 지정해 수정프로토콜로 직접 수정하고 필요한 해당 영역만 원문 대조한다. 원문 복구 불가능이면 승인된 ALIVE 문형 대체를 반드시 적용하며, 후보가 실패하면 수정하거나 다른 후보를 생성해 해당 문항의 독립 검수·Meta·에셋·표시·main 반영까지 완성한다. ROOT는 수정/대체 인계와 완료를 수납하며 이미 위임된 대체를 재승인받지 않는다. 운영 보고는 제작/수정/대체 제작/검수/병합 진행으로 표현하고 HOLD로 반환·종료하지 않는다. 과거 원문/HOLD/실패/freeze 및 대체 provenance는 이력으로 보존하고 바뀐 qid만 새 입력으로 검수한다. 공유 도구 수정 금지는 문항 수정·대체 금지가 아니다. 실제 실행·권한 오류와 미실행 검수는 사실대로 기록하고 나머지 시험지는 계속 진행한다.

- 실행 정본: `docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Fast_Lane_CURRENT_v1.md`. Codex 원본 시험지의 기본 종료는 CREATE → R1 → R2 → R3 → 프로덕션 JS·필수 에셋 main 반영·원격 일치 확인이다. 등록·배포는 별도 요청 범위이며 병합 선행조건으로 자동 추가하지 않는다. ALIVE Generated 출시 계약과 명시적으로 지정한 다른 종료 조건은 유지한다.
- 기존 PASS/freeze/렌더는 재사용하고 첫 미완료 단계부터 이어간다. generic validator는 단계 정상 마감의 보조 기술검사로 한 번 수행하며 실제 범위·결과 또는 `NOT_RUN`을 남긴다. R1 전 qid 독립 풀이·해설/교육과정 deep 검수, R2 전 qid 학생 관점 해설 검산·개선 검토, R3 changed/open/direct-dependency 및 최종 구조·표시 마감으로 구분한다. 실제 실패·수정 qid와 필수 직접 의존성만 다시 확인하며 ROOT 재검과 무관한 rebuild는 금지한다.
- 시험지 run 중 공유 도구/validator/renderer/compiler/등록기/registry/CI 수정, 새 helper 작성, MASTER 자동 도구 복구를 절대 금지한다. preflight/bind/seal/verify/intake/dispatcher/등록 candidate는 생산 필수 호출에서 제거한다. 편의 도구가 막히면 JS·에셋·기존 증거를 직접 읽어 진행한다. 도구 호환 결함은 실제 품질 항목을 직접 확인한 MANUAL_STAGE_COMPLETE로 인계하되 generic FAIL_TOOL/NOT_RUN을 그대로 보존한다. 실제 품질·입력 결손은 완료로 우회하지 않는다. 도구 수정은 사용자에게 별도 맡긴 작업에서만 수행한다.
- 기존 CREATE 진행분이 있는 JS 2개 약 2시간을 운영 목표로 삼고 보고는 최소화한다. 아래 과거 NONSTOP/OWN_AND_FIX/기술 continuation 규정으로 이 범위를 확대하지 않는다. ROOT는 routing·publication, 하위 stage는 Luna High를 유지한다.

## CURRENT HARD — 승인 프로덕션에서 학생 조회 데이터 자동 생성·출시 결속 (2026-10-10 사용자 직접 지시)
- 승인된 Generated 프로덕션 문항과 학생 사용 가능 문항을 별도 수동 등록 상태로 관리하지 않는다. 문항 프로덕션 파일과 UID별 승인 기록이 authority이며, 학생 검색 index/Consumer는 여기서 자동 생성하는 조회 데이터다. 승인 문항을 다시 승인하거나 `NOT_REGISTERED` 보고만 남기고 종료하지 않는다.
- 실행 정본: `docs/architecture/Approved_Generated_Source_Derived_Student_Projection_RELEASE_CURRENT_v1.md`. 지원되는 QID9 생산 형식은 main 출시 빌드에서 자동 projection 생성 → 승인 UID 누락 0·Source/Meta/asset 결속 검증 → 실제 Chrome·runtime 검사 → 검증된 사이트 배포를 모두 닫는다. 미지원 승인 형식을 조용히 누락하지 말고 해당 compiler를 보강한다.
- Git 병합과 학생 사이트 배포를 구분한다. 승인 파일만 main에 들어갔다는 이유로 완료하지 않으며, 실패한 빌드는 기존 정상 사이트를 유지한다. 정확한 main SHA, 실제 배포 run, 학생 조회·선택·출력 evidence가 있어야 출시 완료다. 조회 파일을 수동으로 수정해 승인 authority와 분리하거나 실패 gate를 약화하여 통과시키지 않는다.

## CURRENT HARD — JS 신규·수정·검수 Meta 필수 확인 (2026-10-10)
- 모든 기출·유사·Generated·교재/평가용 JS의 신규 제작·기존 수정·문항 검수에서 [JS Metadata 필수 계약](docs/architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md)을 적용한다. 해당 작업 UID의 standardUnit/subUnit·RPM L1~L4·CrossConcept/Condition/Integration/PT/TPL·level/1~5 난이도·UID/sourceQid/provenance·Consumer/index 정합을 확인한다. 미확정 근거는 정확한 EVIDENCE_DEBT로 기록하고 가짜 키/추정값/가짜 NONE으로 채우지 않는다. 핀포인트 작업의 범위를 무관한 문항 전수 재검으로 확대하지 않는다. 메타 변경은 필수 직접 dependency와 운영 검색 projection에 결속한다.

## CURRENT HARD — 최신 요청의 작업 범위·종료 조건 우선 (2026-10-10)

- 먼저 최신 사용자 지시의 대상·작업 종류·종료 조건을 따른다. 아래 전수 생산·검수 규정은 명시적으로 맡긴 전체 작업에 적용하며, 기존 문항의 한정 수정 지시를 확대하는 근거가 아니다.
- **한정 수정:** 지정 qid/파일/필드와 수정에 꼭 필요한 직접 의존 부분만 고친다. 변경 영향에 필요한 검증을 1회 수행하고 정한 종료 조건에서 끝낸다. 실제 실패·추가 수정이 있을 때만 영향 부분을 재검한다. CREATE→R1→R2→R3 자동 재진입, unchanged 시험지 전체 재풀이·전수 재검은 금지한다.
- **전체 제작·전수 검수:** 사용자가 전체 작업을 명시하면 기존 전체 품질 절차와 분모를 유지한다. 전수 검수 중 든 ‘예시 qid’와 ‘이 qid만 수정’이라는 명시적 한정을 구별한다.
- 범위 밖 발견사항은 간단히 보고만 하고 임의 수정·전수 조사하지 않는다. 범위 확장은 사용자 승인을 받는다. OWN_AND_FIX도 승인된 범위 안의 책임이다.
- 출시·등록·main 반영까지 요청받았다면(적용 가능한 기존 사용자 지시 포함) 해당 범위의 publication·remote readback·필요한 학생 화면 기술 QA까지 책임진다. 이 책임이 변경하지 않은 전체 시험지 재검의 허가는 아니다. 패치·커밋·draft PR 등 명시된 종료 조건을 main 병합으로 바꾸지 않는다.
- 시작할 때 실제 읽은 관련 정본 경로/버전과 대상·필요 검증·종료 조건만 짧게 밝힌다. 별도 대형 원장·반복 read receipt·새 승인 절차를 만들지 않는다.

## CURRENT HARD — 다음 학교부터 ALIVE CREATE 중 해설 SVG 동시 제작 (2026-10-10 원장 지시)
- **적용: 팔마고 다음에 신규 착수하는 모든 학교 시험지의 ALIVE Generated 생산**(QID9/LITE 의미확장 공통). 제작자/작업자는 학교 작업 최초 진입에 기존 `.codex/skills/apmath-visual-upgrade/SKILL.md`, GPT Visual Contract, `도형추출.md`, 도형의방정식 해설 SVG 규정, **사용할 renderer schema/지원범위**를 필독하고 read receipt를 남긴다.
- **문항·발문·해설 작성 중** 문제용 시각정보와 해설용 SVG를 각각 결정하고, SVG 필요 시 같은 원본 qid의 CREATE closure 안에서 기존 엔진으로 사실 동결→spec→실파일 제작→좌표/semantic QA→UID/asset 결속을 완료한다. 도형의 방정식 H22-C2-01~04는 시각화 기본 필수, 예외는 수학적으로 좁게 기록. SVG 누락인데 TEXT_ONLY라고 정상완료 금지.
- **팔마고 기존 QID9 제작분은 적용 제외**: 형님이 별도 SVG 엔진 보강라인에 맡긴다. 기존 승인·문항은 일괄 재제작하지 않는다.
- 실행 정본: `alive/06_EXECUTION/ALIVE_NEXT_SCHOOL_CREATE_WITH_SOLUTION_SVG_CURRENT_v1.md`. 기존 엔진의 실제 미지원 family를 ACTIVE라 속이지 않고 HOLD/기존 대체 backend 경로로 마감하며, 실제 하지 않은 Chrome/Consumer 검사를 PASS라 표시하지 않는다.

## CURRENT HARD — 문제은행 전체 문제·해설 SVG 필요성 2축 전수판정 (2026-10-10 원장 지시)
- **문제은행의 모든 기출·ALIVE Generated·교재/유형/유사문항**에서 *문제용*과 *해설용* 시각자료의 필요성을 UID마다 **독립 판단**한다. 문자·수식만으로 문제를 풀 수 있어도 해설의 접선/교점/대칭/보조선/그래프/영역 관계를 학생에게 명확히 전달하는 SVG가 필요하면 반드시 제작한다. `VISUAL_OPTIONAL`도 실질 교육 효과가 있으면 ADD하며, 진짜 중복·장식은 근거 있는 EXEMPT.
- 기존 Visual 생성 스킬과 엔진을 재사용하고, source PNG 불변·교육과정·실제 primitive/렌더 검증을 유지한다. 기존 승인 문항의 품질 상태를 일괄 취소하지 말고 누락 UID의 시각 결함만 보강한다. 실측 누락률은 고유 UID × 문제/해설 전수조사 후 확정한다.
- 실행 정본: `docs/rules/04_VISUAL/Problem_Bank_Per_Item_Problem_Solution_SVG_Full_Audit_CURRENT_v1.md`. 문서 작성은 전수조사/SVG 생성/Chrome 완료가 아니다.

## CURRENT HARD — 문제은행 전 문항 문제·해설 SVG 필요시 의무 생성 (2026-10-10 형님 지시)
- **팔마고 한정 아님**. 기출·ALIVE Generated 후보/승인·교재/평가문항 등 실제 문제은행 모든 UID에 대해 **문제 그림과 해설 그림을 각각** 전수 triage한다. 텍스트만으로 풀이 가능하다는 이유로 해설 SVG를 자동 생략하지 않는다.
- 실제 결정적 교육 가치가 있는 REQUIRED/BENEFICIAL 해설 SVG 및 필수 문제 시각자료는 기존 `.codex/skills/apmath-visual-upgrade/SKILL.md`, `도형추출.md`, 현존 `alive/engine/visual_renderer.py` 등 적절한 backend로 **생성/보강→actual geometry parity→학생용 참조→실제 렌더 증거**까지 완료한다. 충분한 원본 PNG/기존 검증 SVG를 무의미하게 중복 제작하지 않는다.
- SVG 필요인데 자산 없음/학생 UI 미연결/렌더 미검증이면 신규 RELEASE DONE 금지. 기존 승인본은 일괄 무효화하지 않고 UID별로 보강한다. 신규 엔진 중복 제작·미지원 renderer 지원 허위 주장 금지.
- **실행 정본:** [문제은행 전 문항 문제·해설 Visual/SVG 게이트 CURRENT](docs/rules/04_VISUAL/Problem_Bank_All_Items_Problem_And_Solution_Visual_Gate_CURRENT_v1.md). 이번 문서 반영은 POLICY_ONLY이며 전수조사·SVG 신규 제작/렌더 완료를 의미하지 않는다.

## CURRENT HARD — 수정 AI OWN_AND_FIX / 메타 확장 / main 후 학생 화면 기술 마감 (2026-10-09 형님 직접 지시)
- 모든 JS Archive·ALIVE·문제은행 수정/검수/메타/출시 실행자는 [수정 AI 책임·Meta 확장·출시 마감 CURRENT](docs/architecture/Archive_Correction_Owner_EndToEnd_Closeout_CURRENT_v1.md)를 필독한다. **OWN_AND_FIX는 승인된 대상·종료 조건 안에서** 발견한 결함을 직접 수정하거나 실제 기술 실행자를 연결해 해결 결과를 수납하고, 해결 가능한 `NOT_TESTED`는 필요한 시도·연결을 이어 간다는 뜻이다. 범위 밖 결함은 보고하고 확장 승인을 받으며, 정확한 도구·권한 blocker나 명시된 한정 작업의 종료를 무한 재검으로 대신하지 않는다.
- 기존 canonical key를 먼저 검색하되 필요한 CrossConcept·Condition·Generated L4 키가 없으면 사용자 추가 승인 대기 없이 **Generated-only 확장 registry**에 의미·parent·evidence·UID를 등록한 뒤 Source/metadata/Consumer/index에 영구반영한다. RPM LOCKED·원본 기출 및 무관한 UID 보호, 무근거 추정 금지.
- 원장 직접 Generated 품질 지시의 별도 인증은 생략. **main 병합 이후 필요한 실제 Chrome 학생 조회/출력 등 기술 검사는 수정 AI가 끝까지 진행**한다. main write만으로 MAIN_DONE이 아니며, 실패하면 본 작업의 수리 대상으로 처리한다. 확인 완료·오류 발견·미실행·판단 불확실을 구분하고, 필수 확인이 남으면 초안/미완료로 보고한다. 산출량과 검사 종류별 실제 분모·범위를 분리하며 파일 존재·Meta 정적 PASS·배포 PASS를 문항 내용 품질 PASS로 확대하지 않는다. 실행 경로가 있으면 해결을 계속 시도하고, 막힌 항목은 실제 미실행/불확실과 정확한 blocker·시도·담당을 ledger에 남긴다. 미실행을 PASS로 기록하거나 재승인 요청/보고만 하고 끝내지 않는다.

# Repository Agent Instructions

## Archive 추출 입력 우선 — 사용자 지정 2026-10-09

`docs/rules/02_PIPELINES/Archive_Extracted_Source_First_v1.md`를 따른다. 발문·보기·수식·문제 이미지가 추출된 이후에는 CREATE부터 JS·실제 에셋을 기본 입력으로 쓰며 PDF routine 전수 대조를 하지 않는다. 원본이 실제로 필요한 문항 결함만 qid·확인할 사실을 명시해 해당 영역을 대조한다. JS/asset SHA·intake provenance는 재사용하고 실제 하지 않은 원문 대조 PASS를 기록하지 않는다. 완전한 학생 입력·실제 에셋 열람과 독립 freeze, 문항 품질·렌더·HOLD·publication 기준은 유지한다. 아래의 기존 PDF 자동 선행·전 페이지 대조 요구보다 최신 사용자 지시가 우선한다.

## Archive 2.0 코드 구현의 최우선 필수 조건

Archive 2.0의 화면, 검색·선택, 출력·미리보기, 저장·출제 연결, 공통 엔진 및 저장소 코드를 구현·수정할 때 반드시 `docs/rules/01_CANONICAL/Archive2_Runtime_Responsiveness_and_Original_Source_Contract_v1.md`를 먼저 읽고 따른다. 기능 추가·리팩터링·업데이트에도 동일하게 적용한다. 기능이 동작한다는 이유로 느린 클릭, 무응답, 빈 창, 저장소 의존 회귀를 허용하지 않는다.

- 원본 기출의 시험·해설·정답은 Archive 1의 `engine.html?data=exams/<file>&mode=exam|sol|ans` 직접 열기 경로를 유지한다. IndexedDB/localStorage에 원본 전체를 복사해야 열리는 구조로 되돌리지 않는다.
- 사용자의 클릭에 즉시 반응한다. 오래 걸리는 준비는 첫 화면 반응과 분리하고, 빈 화면이나 끝나지 않는 로딩으로 숨기지 않는다. 실제 아카이브 크기의 클릭 성능과 저장소 오류·용량 초과를 검증한다.
- 구현 완료·병합·MAIN_DONE 전에 `node tools/check-archive2-runtime.cjs`를 실행하고 결과를 확인한다. 해당 흐름을 바꿨다면 실제 Chrome 검증도 실행한다. 검증하지 않은 항목은 PASS로 기록하지 않는다.
- 이 검사를 생략·격리하거나 데이터 분모를 줄이고, 시간 상한·검증 조건을 완화하여 통과시키지 않는다. 구조 변경이 필요해도 기존 동작·응답성·내용 검증을 먼저 보존한다. 이 계약 자체의 변경은 명시적인 사용자 지시와 근거를 필요로 한다.
- 시험지 source만 수정하는 CREATE/R1/R2/R3 작업은 기존 시험지 품질 절차를 따른다. 런타임 흐름도 바꾸는 경우에는 이 계약을 함께 적용한다.

## Archive 2.0 Codex 실행 라인

이 섹션은 일반 production·qualification·canary를 포함한 **모든 Archive 2.0 Codex 실행 작업**에 적용한다. GPT 예약 실행 라인은 별도 실행 정본을 따른다.

1. Archive 2.0 Codex 작업 시작 시 아래 CURRENT를 **최초 1회만** 읽는다.
   - `docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Execution_v1.md`
   - 품질 공통 기준: `docs/rules/02_PIPELINES/JS_Archive_2.0_Common_Quality_Contract_v1.md`
   - 기존 `JS_Archive_2.0_Codex_Canary_Canonical_v1.md`는 과거 canary/history이며 CURRENT가 아니다.
2. CREATE → R1 → R2 → R3 전환 때 같은 canonical/문서를 반복 재조회하지 않는다.
3. 규칙 충돌, 실제 main drift, 새로운 오류, 새 사용자 지시가 생긴 경우에만 관련 문서만 다시 확인한다.
4. ROOT는 routing-only다. 시험지 품질 작업, 문제 풀이, Meta/Visual 판정, source 재판독을 직접 하지 않는다.
5. 실제 production 작업은 canonical에 정의된 stage subagent에게 맡긴다.
6. Notion 전체 재조회는 정상 stage routing의 prerequisite가 아니다. Git canonical과 현재 코드가 실행 authority다.
7. nested `AGENTS.md`가 추가로 존재하면 해당 scope에서는 더 구체적인 지시를 함께 따른다.
8. 신규 R2는 완전한 학생용 지문·보기·실제 그림/표와 **현재 해설**을 학생 관점에서 전 qid 따라 검산·개선한다. R1은 정답·해설을 보기 전에 전 qid 독립 답과 이유를 freeze한다. 과거 R2 blind 기록은 보존하고 신규 R2를 blind 동결로 표시하지 않는다. 기술 validator PASS가 수학적 검토를 대신하지 않는다.
9. CREATE/R1/R2/R3는 역할별 동시 담당을 각각 1개로 제한하는 직렬 컨베이어다. CREATE가 A를 인계하면 새 CREATE가 B를 시작하고, downstream 역할이 비는 즉시 다음 시험지를 받는다. CREATE 5개 동시 실행은 금지하며 concurrency 5는 상한이다. Codex 2.0은 CREATE/R1/R2/R3 stage worker를 고정 역할로 사용하되 새 `(examUid, stage)`는 fresh session을 기본으로 한다. 같은 시험지의 동일 stage 수정·재확인·closure는 기존 session에서 이어간다. R3가 actual render를 담당하고 ROOT는 publication·SHA·validator·receipt 수납·remote readback을 담당한다. ROOT는 화면을 다시 검수하지 않으며 MASTER는 실제 durable technical continuation에만 사용한다.
10. R1 DEEP는 전 qid의 독립 수학·answer freeze와 QUESTION_LAYOUT / SOLUTION_LAYOUT / META / VISUAL_SVG 4축 검수 및 교육과정 판단을 결속한다. 신규 R2는 전 qid의 현 해설을 따라 핵심 계산·설명·교육과정 적합성을 검토하고 필요한 개선을 하며, 불일치·의심·고위험에만 독립 재풀이한다. R3는 changed/open/direct dependency와 최종 구조·표시만 확인한다. MAIN_DONE은 필요한 실제 publication과 원격 main 파일 일치까지 구분해 확인한다.
11. 사용자에게 위임받은 이번 운영 라인에서 ROOT는 routing과 최종 운영 결정권을 가진다. worker의 검증된 근거에 따라 최소 수정안 적용, 오류 복구, 보류/인계 및 승인 범위 내 publication을 자율 결정하며 같은 적용 여부를 사용자에게 반복 확인하지 않는다. 수학·Meta·Visual·source의 직접 검수는 여전히 해당 worker가 수행한다. 원문 대비 수정은 provenance와 evidence에 명시하고 검증 실패를 강제 PASS로 처리하지 않는다. 위임 범위 밖의 새 목표나 복구 불가능한 필수 입력 부족만 사용자에게 요청한다.
12. CREATE/R1 worker가 해설을 작성·수정할 때는 현재 해설 품질 프로토콜의 Golden/Negative sample preflight를 실제 작업 전에 수행한다. 작업 뒤 읽은 샘플을 preflight로 소급 기록하지 않는다. 늦게 발견한 순서 오류는 보존하고, 프로토콜이 허용하는 최소 correction-review pass에서 샘플을 먼저 확인한 후 변경 locus만 다시 검수한다.
13. R1 독립답 freeze의 학생용 입력은 지문·보기뿐 아니라 모든 참조 그림·표·도형을 포함한다. 필요한 그림을 열기 전 답을 동결하거나 upstream 답을 열지 않는다. 신규 R2는 완전한 학생 입력과 현재 해설을 확인해 해설 검산·개선 검토를 하며 새로운 일괄 blind 동결을 요구하지 않는다.
14. 학생용 bundle은 실제 current final source에서 추출하고 문항별 학생 필드의 일치와 참조 자산을 freeze 전에 확인한다. 기존 CREATE/old student bundle을 현재 SHA만 붙여 재사용하지 않는다. Git blob SHA-1, 파일 SHA-256 및 각 gate의 raw/clean-filter hash 계약을 구별한다.
15. R1 및 과거 유효한 blind 검수의 freeze-before-compare는 보존한다. 기존 freeze 이후 발견한 계산·기호 오류는 기존 동결을 덮지 않고 근거 있는 판정·정정으로 기록한다. 신규 R2는 현재 해설을 검토하며 별도 blind answer freeze를 요구하지 않는다. 학생 입력이나 필수 자산이 바뀌어 기존 R1 답 freeze가 무효일 때만 영향 qid를 새 독립 검수한다.

16. 신규 Codex evidence는 qualityContractVersion을 반드시 기록하고, generic validator를 --quality-contract JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006으로 호출한다. 버전 누락/오타를 legacy PASS로 우회하지 않는다. R3의 targeted rows와 전 문항 artifactDispositions를 구분한다.
17. 기존 JS 발문 조판은 `docs/rules/01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md`를 따른다. AUTO-FIRST로 정상 자동 줄바꿈은 KEEP하고, 실제 렌더에서 식·정의·조건·질문 경계가 붙어 읽기 어려운 qid만 완결 수식 바깥에서 최소 개행한다. 글자 수·문장 길이·정규식 기반 일괄 조판을 금지하며, `SOURCE_TEXT_EXACT_PARITY`와 choices exact equality를 유지한다. 실제 Archive exam engine의 대상 문항 전체를 렌더 확인한다. 전수 검수가 명시된 작업에서 사용자가 든 예시 qid는 전체 분모의 독립 qid-by-qid 검토를 대체하지 않으며, 선정 분모의 모든 문항에 KEEP 또는 최종 disposition과 그 화면 근거를 남긴다. ‘이 qid만 수정’이라는 명시적 한정 작업은 해당 qid와 필수 직접 의존 부분만 검증하고 종료한다. MathJax `$...$` 안에 HTML/CSS placeholder를 넣지 않는다. `subjective-2up`은 canonical §6 근거가 있을 때만 개별 문항에 적용하며, 한 파일럿의 qid는 다른 문항/시험지의 자동 승격 근거가 아니다.

## Archive Codex 실행 증거·수납 보완

- assignment의 worktree/working JS/asset root/evidence root 절대 경로와 expected SHA를 첫 동작에서 확인한다. asset root는 실제 `assets/` 부모다.
- CREATE 결함은 해당 qid 담당자의 JS·에셋 직접 수정 → 필요한 해당 PDF 영역 대조 → 원문 복구 불가능 시 승인 ALIVE 문형 대체 → 변경 qid R1/R2 검수로 완성한다. 신규 item/시험지/run HOLD를 발행하지 않으며 ROOT가 담당자·다음 행동을 연결하고 완료를 수납한다.
- stage 결과는 `--quality-contract JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006 --execution-line CODEX --json`의 실제 raw generic report를 보존한다. custom PASS 요약이나 common-only PASS는 active artifact contract 증거를 대신하지 않는다.
- ROOT는 publish 전에 실제 report schema, 전 qid 분모, JS·자산·receipt SHA를 수납한다. Git index와 remote bytes를 각각 확인하고 기존 파일도 raw witness와 다르면 명시한 경로만 재정규화·stage한다. 기존 실패와 수정 provenance는 보존한다.
- 명시적 사용자 지시가 특정 run의 실제 캡처 요건을 면제하면 원문 지시·고정 roster·범위·SHA를 별도 evidence로 결속한다. `NOT_RUN_USER_WAIVER`와 `USER_DIRECTED_STATIC_COMPLETE`를 사용하고 실제 `RENDER_PASS`를 주장하지 않는다. JS/자산, R1/R2, item HOLD, production·remote readback 요건은 유지한다. 기본 actual render 계약은 유지한다.

## ROOT production 완성·예외·수정 대체 책임

CURRENT Execution v1.3 §25를 따른다. ROOT는 승인 범위에서 캡처/실제 render 조건을 근거 있게 면제하고 최소 수정·승인 ALIVE 문형 대체·실제 기술 실행 인계·publication을 자율 결정하고 결과를 수납한다. 신규 문항 HOLD를 발행하거나 결함 보고만으로 작업을 종료하지 않는다. 같은 적용 여부를 반복 요청하지 않는다. 완료 기준은 JS/정답/해설/Meta/이미지/SVG, 유효한 R1/R2 및 R3 static integrity, zero item HOLD, 실제 production·remote readback·closeout이다. 캡처만 없다는 이유로 최종 HOLD를 만들지 않는다. ROOT 결정은 ROOT_DELEGATED/ROOT_DIRECTED_STATIC_COMPLETE/NOT_RUN_ROOT_WAIVER와 범위·사유·대체 검수·SHA를 기록한다. actual RENDER_PASS를 가장하지 않으며 알려진 품질 결함을 면제하지 않는다. 일반 ROOT 경로는 archive-codex-root-waiver-intake.mjs 및 RootWaived static/MAIN_DONE validators·stage consumers로 수납한다. 새로운 예외 기능이 미지원일 때만 MASTER의 exact 기술 continuation으로 결속을 보완한다. 원 정상/실패/freeze/capture/권한 provenance는 보존한다.
