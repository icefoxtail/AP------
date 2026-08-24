# MASTER_NEXT_WORK

다음 작업과 보류/금지/완료 기준을 한눈에 정리하는 문서다.

## 1. 상태값 기준

- 완료: 실제 코드 또는 기준 문서로 확인됨.
- 일부 완료: 제한된 범위에서만 구현됨.
- 진행 중: foundation 또는 workflow가 있으나 후속 보강 필요.
- 보류: 의도적으로 숨김 또는 승인 대기.
- 확인 필요: 문서에는 있으나 실제 파일까지 확인하지 못함.
- 금지: 승인 없이 구현/노출/실행 금지.

## 2. 우선순위 요약

| 우선순위 | 작업 | 영역 | 완료 기준 | 업데이트 문서 |
|---|---|---|---|---|
| P0 | 문서 구조 정리 검수 | 문서 | docs 루트, `_index`, archive 이동 이력, review pack 확인 | 3대 기준 문서, `README`, `_index` |
| P0 | review pack final gate 유지 | Codex workflow | 새 zip 경로와 entries 확인 | `CODEX_RESULT.md`, review SOP |
| P1 | 하위 문서 stale 경로 감사 | 문서 | 이동된 경로 참조 중 현재 문서에 필요한 것 보정 | 관련 하위 문서 |
| P0 | JS 아카이브 master·룰북 계약 동기화 | archive/docs | **완료(2026-08-24)** — canonical Markdown·compiled JSON·운영 부록·schema가 같은 필드/예외/경로를 선언하고 manifest 22개 항목의 실제 해시가 일치함 | `docs/rules/JS아카이브_세부단원_운영규칙_v1.md`, `docs/rules/MANIFEST.md`, `archive/_generated/intelligence/phase1/master-audit/master-key-integrity-report.json` |
| P1 | 표준단원 라벨 변형 문항별 adjudication | archive/data | **완료(현재 inventory 0행·0문항)** — 검색 alias 4종은 유지하고, 교차 단원 465건·수동 라벨 34건은 문항 근거로 승격했다. 추가 source JS 수정은 없음 | `archive/_generated/intelligence/phase1/master-audit/label-variants/master-label-variant-inventory-v1.json`, `archive/_generated/intelligence/phase1/master-audit/cross-unit-adjudication/cross-unit-candidate-promotion-v1.json` |
| P1 | 세부단원 legacy·invalid·DB 예외 해소 | archive/data | 필수 schema 누락 53문항·167필드, parent evidence 48문항·144필드, subunit parent mismatch 306문항·624필드, canonical label/order 636필드, legacy enum 52필드를 정리했다. 현재 schema warning·parent mismatch·unknown/raw는 0건이며 source-dependent DB 예외만 보류다 | `archive/_generated/intelligence/phase4/archive-standard-master-label-order-application-v1.json`, `archive/_generated/intelligence/phase4/archive-legacy-enum-normalization-v1.json`, `archive/_generated/intelligence/phase4/archive-legacy-schema-inventory-v1.json` |
| P1 | `docs/implemented` 실제 코드 대조 감사 | 문서/구현 | 주요 path·route import/dispatch·schema 참조 대조 완료. 동작/브라우저 QA는 별도 범위 | implemented maps, 2026-08-24 result pack |
| P2 | source-dependent DB 메타데이터 evidence intake | archive/data | **영구 종결** — 직접 출처 0건인 28/60 queue를 활성 작업에서 제거했다. 빈 DB 필드와 감사 기록은 보존하고 재개·추정·물리 삭제는 하지 않는다 | `docs/rules/JS아카이브룰북_v2.5.md` 4-4, `archive/_generated/intelligence/phase3/archive-db-source-permanent-closure-v1.json`, `docs/review-packs/archive-db-metadata-source-unavailable-20260824/CODEX_RESULT.md` |
| P1 | report cohort / 평가리포트 검증 | Report AI / archive | archive_file + examYear + 학년 cohort 확인 | REPORT_AI, ARCHIVE_OMR, implemented maps |
| P2 | hidden foundation 노출 감사 | foundation | hidden/approved 목록 정리 | hidden foundation map |
| P2 | 시간표 staging/apply 보강 | timetable | staging/live 분리 확인 | TIMETABLE docs |
| P3 | CMath/EIE branch 정의 | 상위 OS | branch 분리 문서화 | roadmap/domain docs |

## 2-1. 2026-08-22 진행 결과

- docs 루트 감사: canonical entry 9개만 남기고, 잔여 루트 문서 19개를 `plans/`·`reports/`로 이동했다. 이동 이력은 `_index/ARCHIVE_INDEX.md`에 기록했고 현재 문서 본문의 이동 전 경로 링크를 보정했다.
- rules manifest: `docs/rules/` 활성 파일 22개를 실제 바이트 수·SHA-256으로 재생성했다. 룰북 파일과 `# ` legacy snapshot은 manifest 범위에서 명시적으로 제외한다.
- JS archive contract: Markdown master를 deterministic compiler로 재컴파일한 결과가 compiled JSON 1,093개와 byte-equal이고 schema required-field/중복 key-type 검사가 통과했다. 이 계약 게이트는 통과로 기록하되 compatibility map gap·label variant는 별도 review-only 예외로 남긴다.
- master-key integrity: Markdown master·compiled master·concept map을 읽기 전용으로 재검사했다. blocker는 없고 compatibility map은 현재 사용 공식키 106개를 커버한다. 최신 운영 JS 라벨 변형 inventory는 0행·0문항이며 검색 alias 4종은 source JS와 분리해 유지한다.
- historical review pack: 기존 `CODEX_RESULT.md`가 참조하는 2026-05 zip 4개가 현재 경로에 없음을 확인했다. historical 문서 본문은 보존하고, 새 review pack 재생성을 다음 P0로 남겼다.
- archive 운영 후속: DB 2건을 보강하고 question-index를 10,620문항으로 재생성했다. question identity map/runtime도 435개 파일·10,620문항, UID 중복 0·충돌 0으로 재생성·감사했다.
- archive QA: 원본 345개 파일·7,909문항 전수 결정적 content/answer/solution 감사에서 공란 0건으로 정리했다. 수피아여고 q10은 원본 부재 상태에서 기존 선택지·정답·해설에 맞춰 성립 문항으로 복구했고, question-index·identity runtime·브라우저 3모드 검증을 다시 통과했다. 운영 세부단원 QA는 10,522문항·전 게이트 통과, 최신 master gap은 0건이다.
- metadata gap: DB 29개 emptySchool·61개 필수 메타 gap을 파일별로 재분류했다. 파일명·내부 메타로 확정 가능한 `examType=mid` 3건과 `semester=2` 1건만 보강했고, 나머지 school/year/semester/examType은 source-dependent 보류로 남겼다. DB→question-index→identity runtime→운영 QA 재실행 결과 qCount/index mismatch 0, UID 중복·충돌 0, 운영 게이트 전부 통과다.
- types/similar solution scope: types 4개 파일·304문항과 similar 19개 파일·462문항을 JS 기준으로 해설 작성하고 파일 단위 exam/sol/ans QA를 완료했다. 최종 empty-solution inventory는 0개 파일·0문항이다. 그림 의존 보류 31건과 동일 범위 보강 2건은 원본 도형을 추정하지 않고 자립형 텍스트 문항으로 교체했으며, 대상 파일의 유효 실행 결과에 그림 보류 표기 0건을 확인했다. 중2 대표문제 파일의 DB `school` 공란은 출처 없는 값을 만들지 않고 source-dependent 예외로 유지한다.
- final operational gate: 후보 107개를 재검사해 매핑 후보 98개·2,219문항 byte-equal, 9개 비운영 후보를 격리했다. 구조 누락 `choices` 52건과 `examTitle` 2건을 보완했으며, 인덱스 10,620문항·UID 중복 0·qCount/index mismatch 0·빈 정답/해설 0·변경 파일 51회 렌더 QA 통과를 확인했다. 다음 작업은 source-dependent 메타데이터 29/61건과 master concept-map gap 63건·라벨 변형 40건의 근거 기반 adjudication이다.
- master compatibility completion: `archive/concept_map.js`에 사용 공식키 63건의 broad compatibility mapping과 검색용 표준 라벨 alias 4종을 추가해 106개 사용 공식키 전체가 매핑되도록 했다. 마스터/룰북에는 이 map이 source label·subUnit 승격을 하지 않는다는 경계를 기록했다. 라벨 변형 문항별 inventory는 `archive/_generated/intelligence/phase1/master-audit/label-variants/`에 생성했으며, fallback 차단 28건은 원문 근거 확인 전까지 보류한다.
- candidate/runtime: 후보 107개 중 매핑 가능한 98개(2,219문항)를 production 바이트와 동기화했고, 매핑 누락 9개는 기존 비운영 후보로 기록했다. 커밋·푸시는 하지 않았다.
- consumer regression: dashboard/high1 정적 테스트와 archive 검색·필터, mixer 로딩·카트·출력 모달, 대표 4개 파일의 exam/sol/ans 엔진을 재검증했다. canonical runtime 기준 소비처 게이트는 통과했으며, 결과는 `docs/review-packs/archive-consumer-regression-20260822/CODEX_RESULT.md`에 고정했다.

## 2-2. 2026-08-23 진행 결과

- cross-unit adjudication: 교차 단원 검토 465건 중 문항 내용·정식 master parent·세부단원 키가 일치하는 106건(26개 운영 JS)을 `candidate_evidence`/`complete_candidate`로 승격했다. 본문·보기·정답·해설·이미지는 수정하지 않았다.
- candidate sync: 운영과 매핑되는 후보 98개 파일·2,219문항을 byte-equal로 동기화했고, 비운영 후보 9개는 격리했다. question-index는 10,620문항으로 재생성됐다.
- post-promotion QA: metadata inventory 435개 파일·10,620문항·load/identity join 실패 0, master gateReady true, identity map/runtime UID 10,620개·충돌 0, 운영 subunit QA 전 게이트 true를 확인했다.
- residual queue: 라벨 변형은 46개 행·836문항으로 감소했고, 교차 단원 보류는 30개 그룹·359문항(자동 승격 후보 0)이다. fallback 차단 28건과 DB `emptySchool` 29건·필수 메타 gap 61건은 source-dependent 검토 목록으로 유지한다.
- targeted archive audit: 승격 파일 26개는 문항 수·인덱스·구조 오류가 없었다. 다만 기존 source-dependent 파일 1개에서 DB `school` 공란 경고가 재현되어 보류 목록과 일치한다.

## 2-3. 2026-08-23 교차 단원 2차 adjudication

- 정확 라벨 일치 잔여 16건을 재검토해 `H15-SA-04|이차방정식` 7건을 `H15-SA-05`로 승격했다. 판별식 2건, 방정식 기본 4건, 이차방정식 풀이 1건으로 세부단원을 문항 내용에 맞춰 지정했다.
- `H15-SB-02|함수` 9건은 이차함수 내용이지만 `H15-SA-05`와 `H15-SB-03` 부모 체계가 갈릴 수 있어 보류했다. 나머지 343건도 출처·교육과정 근거 부족으로 보류했다.
- 최신 결과: 교차 단원 29개 그룹·352문항, 자동 승격 후보 0건. 라벨 inventory는 45개 행·829문항(동일 키 누출 402, 교차 오분류 352, 수동보류 34, alias 후보 41)이다.

## 2-4. 2026-08-23 전체 adjudication 완료

- 잔여 352문항을 모두 문항별 처리했다. 중학교 220건, 고등학교 117건, 최종 함수 9건을 포함해 전체 교차 단원 465건을 근거 기반 candidate 메타데이터로 승격했다.
- 최종 교차 단원 queue: 0개 그룹·0문항. 최신 라벨 inventory: 13개 행·443문항(동일 키 세부단원 누출 402, alias 후보 41)이며 교차 오분류와 수동보류는 0건이다.
- question-index 10,620문항, identity map/runtime UID 10,620개·충돌 0, master gateReady true, 운영 subunit QA 전 게이트 true를 확인했다. DB qCount/index mismatch는 0이다.
- 전체 archive 결정적 감사는 구조·정답·해설·이미지 오류 없이 통과했으며, 기존 DB `emptySchool` 29건과 DB 미등록 유사 후보 3건만 별도 예외로 남는다.

## 2-5. 2026-08-24 수동 라벨 변형 inference adjudication

- `manual_review_required` 34문항(3개 관측 라벨 그룹)을 발문·수식·정답·해설 기준으로 문항별 재판정했다. 4개 운영 JS에 master에 이미 존재하는 표준키·세부단원만 적용했고, 새 키나 원본 출처값은 만들지 않았다.
- 34문항 모두 `category_or_cue_inferred`/`complete_category`로 승격했으며, 판정 rationale은 `manual-label-adjudication-v1.json` sidecar에 보존했다. 본문·보기·정답·해설·이미지는 수정하지 않았다.
- 승격 후 inventory는 13개 행·443문항(동일 키 누출 402, alias 후보 41), manual 보류 0건이다. question-index 10,620문항, used official keys 106개, identity UID 10,620개·충돌 0, master gateReady true, 운영 QA 전 게이트 true를 재확인했다.
- 전체 결정적 archive audit은 438개 JS·10,686문항에서 구조·내용·정답·해설·이미지 오류 없이 동일하게 재현됐다. 남은 것은 기존 `emptySchool` 29건과 DB 미등록 유사 후보 3건이며, DB 필수 메타 gap 61건은 별도 source-dependent 범위다.
- 커밋·푸시·배포는 하지 않았다.

## 2-6. 2026-08-24 DB 메타데이터·미등록 유사파일 정리

- `26_AP수학_1학기_중간_중1_중간고사`라는 JS `examTitle`로 근거가 직접 확인되는 단원평가 1건에 `school=AP수학`, `year=2026`을 반영했다.
- 파일명과 문항 `standardCourse`가 함께 일치하는 고1 공통수학2 유사파일 3건을 DB에 등록했다: 순천여고 21문항, 제일고 22문항, 효천고 23문항. 각 파일은 2025년 2학기 중간, `subject=공통수학2`, `contentType=유형`으로 기록했다.
- DB는 438개 레코드, question-index는 10,686문항, identity map/runtime은 438개 파일·10,686 UID로 재생성했다. 누락 파일·중복 DB·qCount mismatch·index mismatch는 0건이고 UID 충돌도 0건이다.
- 후보 동기화는 98개 파일·2,219문항 byte-equal, 운영 세부단원 QA는 전 게이트 통과, 전체 JS 스캔은 438개 파일·10,686문항을 통과했다. 변경 파일은 커밋·푸시·배포하지 않았다.
- 현재 보류는 `emptySchool` 28건(유형 26, 유사 2), 필수 메타 gap 60건(유형 47, 유사 13)이다. 교재/유형 파일의 학교·연도·시험시기와 학원 유사자료의 연도는 근거 없이 채우지 않는다. 상세 근거는 `archive/_generated/intelligence/phase3/archive-db-backfill-v2.json`에 고정했다.

## 2-7. 2026-08-24 source-dependent 메타데이터 운영 규칙 확정

- `types`·`similar`의 `school`, `year`, `semester`, `examType`는 해당 파일의 경로 규약·파일명·`window.examTitle`·명시 source metadata에 직접 값이 있을 때만 승격한다. 같은 폴더, 접미사 형제, 유사 학교 파일, 교육과정 연도, 파일 날짜, 문항 분류는 근거로 인정하지 않는다.
- `original`은 필수 메타 완결을 유지하고, `types`·`similar`의 28개 `emptySchool`·60개 필수 메타 gap은 `sourceDependentOnly` 예외로 유지한다. 현재 workspace에서 원본을 확인할 수 없으므로 이는 active blocker가 아니라 deferred queue다. `fullDbRequiredFieldsGate=false`와 `fullDbSchoolGate=false`는 이 보류 범위에서 예상된 상태다.
- `중간`/`기말`은 기존 enum `mid`/`final`로 직접 매핑할 수 있을 때만 사용한다. `모의고사`, `대표문제`, `유형확인`, `유형심화`, `익힘책`에서 시험 시기를 추정하거나 새 enum을 만들지 않는다.
- 향후 표지·원본·출처 문서가 추가될 때만 해당 파일을 재검토하고, 근거가 확인된 필드만 최소 변경한 뒤 DB consistency·qCount/index·identity runtime·exam/sol/ans QA를 재실행한다.
- 근거와 결정은 `docs/review-packs/archive-db-metadata-rules-20260824/CODEX_RESULT.md`에 고정했다. 이번 단계는 문서 규칙 확정이며 `archive/` 산출물은 추가 변경하지 않았다.
- 따라서 source-dependent 28/60건을 기다리며 archive 작업을 중단하지 않는다. 현재 계획상 다음 활성 우선순위는 `docs/implemented` 실제 코드 대조 감사다.

## 2-8. 2026-08-24 implemented 실제 코드 대조 감사

- frontend의 stale `report.js` 경로를 실제 로드 순서인 `report-text.js` → `report-center.js` → `report-print.js`로 보정했다.
- Worker `index.js`의 실제 import/dispatch와 route export를 대조해 `timetable-months`, `wrong-clinics`, `eie`, `backdoor` 4개 route를 map에 추가했다.
- `schema.sql` 선언 67개와 DB map을 대조해 누락된 7개 table을 기록하고, monthly snapshot·EIE·wrong-clinic처럼 migration 또는 route ensure가 관리하는 저장소를 구분했다.
- `report_exam_cohort_stats`는 DB table이 아니라 `initial-data` 계산 payload라는 점을 API/DB map에 명시했다.
- 검증은 path existence, route file/export, schema table-name cross-check, 문서 diff check로 한정했다. browser/behavior QA, Worker 실행, remote D1, deploy는 하지 않았다.
- source-dependent archive `emptySchool` 28건·필수 메타 gap 60건과 archive 산출물은 변경하지 않았다. 해당 원본이 들어오기 전까지 deferred queue로 유지한다.
- 이 감사 이후 다음 활성 후보는 P1 `report cohort / 평가리포트 검증`이며, 실제 UI/Worker 동작 검증을 수행할 때 별도 승인·검수 범위를 다시 확인한다.

## 2-9. 2026-08-24 report cohort / 평가리포트 검증

- Worker `buildReportExamCohortStats`의 실제 함수 본문을 임시 실행 컨텍스트에서 검증했다. 같은 `archive_file + examYear + 학년` scope, 학생 grade 우선·반 grade fallback, 다중 반 연결 dedupe, rank, questionStats, 제목·날짜 fallback을 확인했다.
- `report` 문자열을 포함하는 관련 테스트 31개가 모두 통과했다. report center 진입, 평가/학교시험 dashboard, 학생 view, print, archive image, parent 문구·sync를 포함한다.
- plain Node direct import는 `cloudflare:workers` loader 제약이 있지만, 해당 모듈만 loader stub으로 매핑한 기존 `tests/report-cohort-stats-worker.test.mjs`는 통과했다. 같은 loader로 실제 `index.js` `/api/initial-data` fetch를 mock D1에 연결해 cohort payload가 정상 생성되는 것도 확인했다.
- local `file://` 브라우저 접근은 Browser URL 정책으로 차단됐지만, 로컬 HTTP에서 대표 archive `26_금당고_1학기_기말_고2_대수`를 exam/sol/ans로 확인했다. 표시 시험지·해설·정답은 각각 21개로 source/DB `qCount=21`과 일치했고, exam 이미지 6개 로드·수평 overflow·visible 오류·console error/warning 0건이었다.
- remote D1/Worker initial-data payload write와 deploy는 수행하지 않았다.
- `archive/`, DB, question-index, identity runtime 및 source-dependent 28/60건은 변경하지 않았다. Wrangler read-only 점검에서 `wrangler.jsonc`의 `env.staging` 부재를 확인했고, 가능한 production live read-only fallback으로 cohort 5명·전체 평균 78점·반 평균 78점을 확인했다. production `0/-` 상태를 코드에서 추적해 `initial-data`가 cohort summary만 전달하고 blueprint를 전달하지 않는 점, report center가 blueprint lazy loader를 호출하지 않는 점을 확인했다.

## 2-10. 2026-08-24 report blueprint lazy-load 보정

- `apmath/js/report-center.js`의 시험 dashboard가 현재 archive 시험지에 필요한 blueprint만 인증 API로 lazy-load하도록 보정했다. 로드가 끝난 뒤 현재 같은 시험지를 보고 있을 때만 refresh하며, 빈 응답은 재요청하지 않는다.
- `node --check`와 핵심 report 회귀 4개를 재실행해 모두 통과했다. 전체 report 관련 31개 테스트도 기존 통과 상태다.
- DB/archive 산출물·remote D1·배포는 변경하지 않았다. 별도 staging target이 생기면 실제 payload와 lazy-load 후 문항 분석을 재확인한다.

## 2-11. 2026-08-24 archive 중간 점검

- DB·question-index·identity는 438개 파일·10,686문항 전체를 포함하고, DB qCount/index mismatch·identity 충돌·전체 JS 구조 오류는 0건이다.
- 세부단원 운영 QA 스냅샷은 431개 파일·10,522문항만 포함한다. 4개 original 파일 98문항과 새로 DB 등록한 3개 similar 파일 66문항, 총 7개 파일·164문항은 아직 세부단원 4개 필드가 전부 비어 있다.
- 다음 archive 우선 작업은 이 164문항을 세부단원 스냅샷에 편입하는 것이다. original 98문항은 원본 근거로, similar 66문항은 JS 문항·master 룰 기준으로 처리한 뒤 전체 10,686문항 기준 운영 QA를 재실행한다.
- 중간 점검 결과는 `archive/_generated/intelligence/phase3/archive-midpoint-audit-20260824.json`에 고정했다. source-dependent DB 메타데이터 28/60건은 별도 deferred queue로 유지한다.

## 2-12. 2026-08-24 전체 세부단원 현재 기준 재생성 완료

- 중간 점검 대상 7개 파일·164문항을 문항 본문·문항별 표준단원·현행 master 키로 재검토했다. original 4개 파일 98문항은 문항 category/content 근거로, similar 3개 파일 66문항은 JS category와 master rule로 매핑했다.
- 운영 JS에는 `subUnitKey`, `subUnit`, `subUnitConfidence`, `subUnitClassificationDepth` 4개 메타데이터만 반영했고 content·choices·answer·solution·image 보호 필드는 변경하지 않았다. 상세 문항별 결정은 `archive/_generated/intelligence/phase3/complete-subunit-classification/archive-current-subunit-manual-rebaseline-v1.json`에 보존했다.
- 현재 기준 분류 스냅샷은 438개 파일·10,686문항이며 공란 세부단원 0건, taxonomy gap 0건이다. frozen pilot exclusion은 historical backup으로 보존하고, 현재 operational baseline은 `archive/_generated/intelligence/phase2/archive-classification/archive-hierarchical-classification-v1.json`으로 재기준화했다.
- question-index 10,686건, identity map/runtime 438개 파일·10,686 UID, UID 충돌 0건을 재생성했다. 후보 JS는 98개 파일·2,219문항 byte-equal, 9개 비운영 후보 매핑 누락은 기존 정책대로 격리했다.
- 운영 QA `archive/_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-operational-qa-v1.json`의 모든 게이트가 통과했다. DB `emptySchool` 28건·필수 메타 gap 60건과 fallback 차단 28건은 source-dependent/근거 보류 목록으로 유지한다.
- 커밋·푸시·배포는 하지 않았다.

## 2-13. 2026-08-24 source-dependent 메타데이터 evidence intake 완료

- `emptySchool` 28건과 필수 메타 gap 60건(필드 occurrence 168건)을 대상으로 현재 archive와 `D:\` 전체를 읽기 전용 재검색했다. 5,731개 파일·텍스트 324개를 확인했으며, 대상 basename/examTitle과 1:1로 일치하는 source artifact는 0건이었다.
- 이름·단원·출판사만 겹치는 contextual 후보 58건은 다른 학교·학기·연도 또는 교재 자료와의 관계만 보여 출처 근거로 승격하지 않았다. 직접 승격 필드 0건, DB/production JS 쓰기 0건이다.
- 상세 row ledger는 `archive/_generated/intelligence/phase3/archive-db-source-evidence-intake-v1.json`(digest `52657952003347eeaaaf53a7fb2ad67c908fbfcc1a471cfb3b45eae19262fca9`)에 보존했다. 모든 필드 occurrence는 `no_direct_source_evidence` deferred로 남겼다.
- DB consistency는 파일 누락·중복·qCount/index mismatch 0건, question-index 10,686문항, identity map/runtime 10,686 UID·충돌 0건으로 재검증했다. 운영 세부단원 QA 전 게이트는 true이며, `fullDbRequiredFieldsGate`/`fullDbSchoolGate` false는 source-dependent 예외에 따른다.
- 다음 archive 검토 범위였던 fallback 차단 28건 수동 adjudication은 2-14에서 완료했다. 새 원본이 들어오기 전에는 source-dependent 메타데이터 queue를 다시 열지 않는다.

## 2-14. 2026-08-24 fallback 차단 28건 수동 adjudication 완료

- 이전 fallback-safety baseline의 28건을 문항 본문·보기·정답·해설 기준으로 전수 대조했다. 일차함수 5건, 확률 9건, 이차방정식 14건을 모두 정식 master 세부단원으로 확정했다.
- 실제 키를 교정한 문항은 4건이다. `M2-04`의 y축 평행 그래프 문항 1건은 `M2-04-LINEAR_FUNCTION_BASIC`으로, `M2-08`의 경기·주사위 순서쌍 문항 3건은 `M2-08-PROBABILITY_COUNTING`으로 이동했다. 나머지는 기존 키를 문항 근거로 확인했다.
- 운영 JS에는 `subUnitKey`, `subUnit`, `subUnitConfidence`, `subUnitClassificationDepth`만 반영했다. 28건 모두 `category_or_cue_inferred`/`complete_category`로 기록했으며 content·choices·answer·solution·image diff는 0건이다.
- 수동 판정 ledger는 `archive/_generated/intelligence/phase3/fallback-adjudication/archive-subunit-fallback-manual-adjudication-v1.json`(digest `0dcfa608de5f2dd4df101b68d9d590f84a1b333ac115e6beba09095d7efe8deb`)이고, 유효 안전 보고서는 `archive-subunit-fallback-safety-effective-v1.json`(digest `6a82ea70f8094eff8b530421041fb68f28124262be82b0b3c20c0adb728e3f2c`)이다. 기준 baseline의 28건은 모두 adjudicated되어 잔여 blocked 0건이다.
- complete classification은 438개 파일·10,686문항, 공란 0·taxonomy gap 0으로 재생성했다. master gap의 formal 추가 0, invalid 0, raw/unmapped 0이다.
- 후보 98개 파일·2,219문항을 다시 byte-equal로 동기화했다. question-index 10,686건, identity map/runtime 10,686 UID·충돌 0건, 운영 QA 전 게이트 true다. 변경 대상 25개 파일의 exam/sol/ans bundled audit도 모두 통과했다.
- DB는 수정하지 않았고 consistency는 파일 누락·중복·qCount/index mismatch 0건을 재확인했다. source-dependent `emptySchool` 28건·필수 메타 gap 60건은 기존 `sourceDependentOnly` 보류로 유지한다. 커밋·푸시·배포는 하지 않았다.

## 2-15. 2026-08-24 전체 archive 결정적 audit 재검증

- fallback adjudication 이후 운영 `archive/exams/**/*.js` 438개를 20개 단위로 전체 재검사했다. 438개 report, JSON parse failure 0건이다.
- report 오류 28건은 모두 기존 source-dependent `DB school is empty`와 일치했고, 예상 보류 외 오류는 0건이다. JS 평가 실패·빈 content/answer/solution·이미지 누락·DB qCount/index mismatch·candidate mismatch도 0건이다.
- 따라서 전체 archive gate는 `PASS_WITH_EXPECTED_SOURCE_DEPENDENT_DEFERRED`다. 이는 신규 결함이 아니라 `emptySchool` 28건·필수 메타 gap 60건을 원본 확보 전까지 보류하는 정책 예외다.
- 결과 문서는 `docs/review-packs/archive-full-deterministic-audit-20260824/CODEX_RESULT.md`에 고정했다. 이번 단계에서 archive/DB/index/identity와 커밋·푸시·배포는 변경하지 않았다.
- 현재 archive 기준 활성 blocker는 0건이며, 다음 archive 변경은 새 원본·출처가 들어올 때 source-dependent queue를 재개하거나 별도 승인된 범위를 지정할 때만 수행한다.

## 2-16. 2026-08-24 source-dependent 메타데이터 원본 확인 불가 종결

- 현재 workspace와 `D:\` evidence intake에서 대상 파일·`examTitle`과 1:1로 일치하는 원본은 0건이었다. contextual 후보 58건은 직접 출처가 아니므로 계속 거부한다.
- `emptySchool` 28건·필수 메타 gap 60건(고유 파일 60개, 필드 occurrence 168건)을 `CLOSED_SOURCE_UNAVAILABLE`로 종결했다. 이는 확인 완료가 아니라 현재 작업범위에서 원본 확인 불가로 닫은 상태다.
- `archive/db.js`의 빈 `school/year/semester/examType` 값은 그대로 유지했으며, 추정값·대체 학교·현재 연도·교육과정 연도를 기록하지 않았다. DB/production JS/question-index/identity runtime 쓰기는 0건이다.
- closure ledger는 `archive/_generated/intelligence/phase3/archive-db-source-unavailable-closure-v1.json`, 상세 결과는 `docs/review-packs/archive-db-metadata-source-unavailable-20260824/CODEX_RESULT.md`다.
- 이 queue는 `PERMANENT_SOURCE_UNAVAILABLE`로 영구 종결했다. 활성 작업 목록에서 제거했으며, 새 원본이 들어와도 재개하지 않는다. 기존 빈 DB 필드와 감사 ledger는 보존한다.

## 2-17. 2026-08-24 legacy schema 필수 필드 1차 보강

- schema inventory의 `missing_required_field` 167건을 3개 파일·53문항으로 묶어 문항별 확인했다. 모두 `questionType`, `layoutTag`, `tags`, `wide`의 legacy 누락이었다.
- 운영규칙 기본값만 추가했다: `questionType=""`, `layoutTag="grid"`, `tags=[]`, `wide=false`. content·choices·answer·solution·image와 나머지 필드는 보호했으며 diff는 0건이다.
- schema validator는 1,527건(오류 167·경고 1,360)에서 1,360건(오류 0·경고 1,360)으로 감소했다. 남은 warning은 자동 patch하지 않고 다음 문항별 adjudication 범위로 둔다.
- question-index 10,686건, identity UID 10,686개·충돌 0, DB qCount/index mismatch 0, 운영 QA 전 게이트 true, 전체 archive audit의 예상 source-dependent 28건 외 신규 오류 0건이다.
- 상세 결과는 `docs/review-packs/archive-legacy-schema-defaults-20260824/CODEX_RESULT.md`와 phase4 ledger에 고정했다. 커밋·푸시·배포는 하지 않았다.

## 2-18. 2026-08-24 legacy master-key adjudication 및 parent evidence 적용

- `unknown_standard_unit_key` 284건과 `raw_unit` 29건을 문항·파일 단위로 다시 묶었다. 두 경고가 겹치는 29문항을 제외한 고유 대상은 284문항·41개 파일이며, issue instance는 313건이다.
- 243문항은 canonical standard-unit 표에는 없지만 compiled master의 세부단원 부모로 문서화된 키(`H15-SA-13`, `STAT-02`, `H15-PS`, `H22-A-03-01/02/03`, `H22-C-10/11` 등)였다. 이 중 parent가 canonical master에 직접 연결되는 7개 mismatch 문항은 정식 parent로 교정했고, 나머지 236문항은 extension parent로 보존했다.
- `RAW` 29문항과 standardUnitKey 공란 12문항도 모두 `subUnitKey`의 canonical parent가 직접 확인돼 `standardUnitKey`, `standardUnit`, `standardUnitOrder`만 보강했다. 총 48문항·144필드를 변경했으며 content·choices·answer·solution·image diff는 0건이다.
- 검증기는 canonical 142개 표뿐 아니라 compiled master에 문서화된 extension parent를 인식하도록 수정했다. 당시 schema warning은 1,235건에서 999건으로 줄었고, unknown standard key·RAW warning은 0건이었다. 당시 남은 warning은 label/order/parent/type/layout의 별도 adjudication 범위였으며 parent 범위는 다음 절에서 해소했다.
- 적용 ledger는 `archive/_generated/intelligence/phase4/archive-legacy-master-key-parent-application-v1.json`, 결과팩은 `docs/review-packs/archive-legacy-master-key-parent-application-20260824/CODEX_RESULT.md`다. question-index 10,686건, identity 10,686 UID·충돌 0, DB qCount/index mismatch 0, 운영 QA 전 게이트 true, deterministic audit의 예상 source-dependent 28건 외 신규 오류 0건을 확인했다.
- 당시 다음 순서였던 306개 subunit parent mismatch는 다음 절에서 전수 해소했다. 현재 남은 schema warning은 `standard_unit_mismatch` 439건, `standard_unit_order_mismatch` 197건, `invalid_question_type` 33건, `invalid_layout_tag` 19건이며 모두 자동 patch하지 않고 별도 문항 근거 adjudication 범위로 유지한다.

## 2-19. 2026-08-24 subunit parent mismatch 전수 해소

- `archive/_generated/intelligence/phase4/archive-subunit-parent-mismatch-adjudication-v1.json`의 306개 mismatch row를 306문항·39개 파일 단위로 독립 판정했다. 표준단원과 세부단원을 함께 바꾸는 1건, 표준단원만 바꾸는 8건, 세부단원만 바꾸는 297건이다.
- 문항의 content·answer·solution과 compiled master를 함께 대조해 `M3-07` 통계 166건, `M1-03` 문자와 식 107건, `H22-C-04` 8건, `H22-C-05` 7건, 나머지 중등 단원 교차 18건을 정식 키로 승격했다. `H22-C-04/H22-C-05`는 경로가 `types/middle/m3`여도 문항 내용이 고등 공통수학 체계이므로 고등 표준키를 유지했다.
- 변경은 표준·세부단원 메타데이터에 한정했고 624필드를 적용했다. content·choices·answer·solution·image 등 보호 필드 diff는 0건이며 새 키를 만들지 않았다. 적용 digest는 `46f77bffafae6b42928a384471a491309007fa7627a64977609ae243ead17350`이다.
- 재생성·검증 결과 question-index 10,686문항, identity map/runtime 10,686 UID·충돌 0, DB 438개·qCount/index mismatch 0, 운영 세부단원 QA 모든 게이트 true다. 전체 deterministic audit은 438개 report·10,686문항에서 예상 source-dependent `DB school` 28건만 남고 candidate mismatch·unexpected error는 0건이다.
- 이 시점의 schema inventory는 warning 688건이었고 다음 절에서 canonical label/order와 legacy enum을 정리했다. parent mismatch·unknown standard key·RAW는 이미 0건이었다.

## 2-20. 2026-08-24 schema warning 0건 종결

- canonical `standardUnitKey`가 이미 master에 존재하는 636문항·64개 파일의 `standardUnit` 439건과 `standardUnitOrder` 197건을 master `labelKo/order`로 정규화했다. 표준키·세부키·content·choices·answer·solution·image 등은 보호했으며 636필드의 보호 diff는 0건이다. 적용 digest는 `3d08a10ce5f4146b6040f539b50c2079054db40ce5cb68aa33603fba367e5a79`다.
- 남은 legacy enum 52건(39문항·6개 파일)은 `multiple_choice→객관식` 20건, `short_answer→단답형` 5건, `서답형→단답형` 8건, invalid `layoutTag` 19건을 `grid`로 정규화했다. `wide`·본문·보기·정답·해설·이미지는 보호했고 52필드 보호 diff는 0건이다. 적용 digest는 `9bbf2f74d5d5439ae8daa1f35ca385dbfc6702286665cc67aa7abaacfeb48ef8`다.
- validator와 최신 schema inventory는 0건이다. 후보본 107개 중 운영 매핑 98개·2,219문항은 production byte-equal로 동기화했고, 비운영 후보 9개는 기존 격리 정책을 유지했다.
- Phase 0은 438개 파일·10,686문항·qKey duplicate 0, identity map/runtime은 10,686 UID·collision 0(`identityDigest=d9b6defffa198776554a395ac4dcdba50bc7c6657d3491b9d66e9ffa43a52793`, `runtimeDigest=e7539f1f01c1b2158a8d546b4326816fd17cd8ec2452e047fb9e3daa3ca1d396`), question-index는 10,686건이다.
- DB consistency는 438개 record·qCount/index mismatch 0이며 `emptySchool` 28건·필수 gap 60건은 source-dependent 보류 범위다. 운영 QA digest는 `0089007c30f633102b8c17dccb8857a4083508ee1eab9c0d2084ed6f6dd0ddc1`이고 모든 게이트가 true다.
- 전체 deterministic audit은 438개 report·10,686문항/indexed, 예상 source-dependent `DB school` 28건 외 오류 0건, candidate mismatch 0건으로 종료했다. 상세 결과는 `docs/review-packs/archive-schema-warning-closure-20260824/CODEX_RESULT.md`이며 커밋·푸시·배포는 하지 않았다.

## 2-21. 2026-08-24 승인 메타데이터 runtime 승격 기준점 재검증

- 승인된 운영 JS 메타데이터를 기준으로 `question-index.js`, `question_identity_map.json`, `question-identity.js`를 재생성·감사했다. 438개 파일·10,686문항/UID, qKey·UID collision 0, DB qCount/index mismatch 0을 유지했다.
- 후보 2개 파일에 남아 있던 구식 `imageSize` 차이를 운영본으로 동기화했다. 최종 후보 sync digest는 `2df0c9e33477dc49026cc0daeeace2300d8c24718bdf1b9232d151abd1b2e803`이며 98개 매핑 후보·2,219문항 byte-equal, 비운영 후보 9개는 격리 상태다.
- 전체 결정론 감사는 438개 report·10,686문항/indexed, 예상 `DB school` 28건 외 오류 0건·candidate mismatch 0건·unexpected error 0건이다. 운영 QA digest `0089007c30f633102b8c17dccb8857a4083508ee1eab9c0d2084ed6f6dd0ddc1`의 모든 게이트가 true다.
- source-dependent `emptySchool` 28건·필수 메타 gap 60건은 기존 `CLOSED_SOURCE_UNAVAILABLE` 기준을 유지하며, 새 원본이 확인될 때만 재개한다. 이번 단계도 commit/push/deploy는 하지 않았다.

## 2-22. 2026-08-24 master·룰북 계약 동기화

- `docs/rules/MANIFEST.md`의 실제 파일 대조에서 이전 해시로 남아 있던 세부단원 운영규칙과 표준단원 마스터 2건을 현재 바이트·SHA-256으로 갱신했다. 활성 manifest 22개 항목은 모두 실제 파일과 일치한다.
- 표준단원 마스터를 compiled JSON으로 재생성했으며 기존 compiled master 바이트는 이미 동일해 변경되지 않았다. 현재 master는 표준키 142, 세부키 459, 개념군 461, 문제유형 13, 템플릿 18개다.
- schema validator는 0 issues, master-key integrity는 `gateReady=true`, 사용 공식키 106개를 확인했다. review-only 라벨 변형은 0건이며 검색 alias 4종만 별도 유지한다.
- 이번 단계는 문서 manifest와 검증 산출물만 갱신했고 문항 JS·DB·question-index·identity runtime·commit/push/deploy는 변경하지 않았다.

## 2-23. 2026-08-24 source-dependent 메타데이터 영구 종결

- `emptySchool` 28건·필수 메타 gap 60건(필드 occurrence 168건)을 활성 queue에서 영구 제외했다. 영구 종결 ledger는 `archive/_generated/intelligence/phase3/archive-db-source-permanent-closure-v1.json`(digest `dbf57ce976c1d00e159abf6dbec034688a369af4bb79755f6ed928c390f49a42`)이다.
- 상태는 `PERMANENT_SOURCE_UNAVAILABLE`이며 재개 조건은 `never`다. 기존 `archive/db.js` 빈 필드·원본 불가 closure ledger·문항 파일은 보존하고, 값 추정·DB/JS/index/runtime 쓰기·물리 삭제는 하지 않았다.
- 따라서 현재 archive 작업 목록에서 이 28/60건은 제거되며, 이후 archive 작업은 새 원본이 아니라 별도 승인된 신규 범위가 있을 때만 시작한다.

## 2-24. 2026-08-24 archive consumer regression 재검증

- `archive/index.html` 검색·학년·연도·시험기간 필터와 `archive/mixer.html` 시험지 로딩·문항 목록·장바구니·출력 모달을 로컬 HTTP에서 확인했다.
- 대표 `26_금당고_1학기_기말_고2_대수`의 `exam`·`sol`·`ans` 모드에서 21문항, 해설 21개, 정답 21개, 이미지/overflow/console 오류 0건을 확인했다.
- 정적 dashboard/high1 소비자 테스트를 통과시켰고, 현재 canonical index에 맞지 않던 high1 단원별 기대 카운트만 갱신했다. 운영 문항·DB·question-index 생성 로직은 변경하지 않았다.
- 상세 결과는 `docs/review-packs/archive-consumer-regression-20260824/CODEX_RESULT.md`다. 일반 출력 handoff의 popup 최종 렌더는 Browser in-app이 새 탭을 유지하지 않아 선택적 후속 확인으로 남긴다.

## 2-25. 2026-08-24 Archive blueprint metadata bridge Phase 2A

- 계획서 기준 현재 archive 개발 단계는 출력 기능이 아니라 `Phase 2 Archive Metadata Bridge / APMS Sync`다.
- 2A additive migration을 설계·추가했다. `exam_blueprints`의 기존 identity와 primary key는 유지하고, `sub_unit_key`, `type_key`, `template_key`, `difficulty`, `metadata_revision`, `metadata_hash`를 nullable로 확장했다.
- schema/migration 계약 테스트와 canonical identity 회귀 테스트를 통과했다. 원격 D1 적용과 기존 blueprint backfill은 아직 하지 않았다.
- 다음은 Phase 2B `syncExamBlueprintsFromArchive()`의 metadata-aware upsert이며, 그 뒤 2C hash sync → 2D dry-run → 2E backfill → 2F QR/OMR 회귀 순서다.
- 상세 결과는 `docs/review-packs/archive-blueprint-metadata-bridge-phase2a-20260824/CODEX_RESULT.md`다.

## 2-26. 2026-08-24 Archive blueprint metadata bridge Phase 2B

- 계획서의 2B 범위에 맞춰 `syncExamBlueprintsFromArchive()`의 기존 “행이 하나라도 있으면 skip” 동작을 revision/hash 비교 방식으로 교체했다.
- archive JS 메타데이터를 deterministic payload로 정규화하고 `metadata_revision`·`metadata_hash`가 같을 때만 skip, 다르면 기존 primary key에 upsert한다. source ordinal 우선·legacy question number 보조 매칭으로 기존 blueprint update를 보장한다.
- `exam-blueprints` POST와 MIXED engine payload에 `sub_unit_key`, `type_key`, `template_key`, `difficulty`, `metadata_revision`을 연결했고, hash 누락 시 Worker가 계산한다. canonical source UID/ordinal은 계속 유지한다.
- `node --check apmath/worker-backup/worker/routes/exams.js`, metadata bridge contract, canonical identity propagation 테스트가 통과했다.
- 원격 D1에는 migration을 적용하지 않았고 backfill/QR·OMR 실환경 검증도 실행하지 않았다. 다음 활성 단계는 원격 schema 확인 후 Phase 2C hash sync 검증과 2D backfill dry-run이다.
- 상세 결과: `docs/review-packs/archive-blueprint-metadata-bridge-phase2b-20260824/CODEX_RESULT.md`.

## 2-27. 2026-08-24 Archive blueprint metadata bridge Phase 2C/2D dry-run

- 계획서의 hash-sync/backfill 순서에 맞춰 읽기 전용 도구 `archive/tools/intelligence/dry-run-archive-blueprint-backfill.mjs`를 추가했다. 입력은 로컬 D1 SQL export이며 DB 연결이나 쓰기를 하지 않는다.
- 기존 백업 `reports/backups/ap-math-os_before_schedule_series_20260622_220845.sql`로 첫 dry-run을 수행했다. 920 rows·40 files를 파싱했지만 export가 Phase 2A migration 전이라 `metadata_revision`·`metadata_hash`가 없어 상태는 `BLOCKED_SCHEMA_MISSING`이다.
- 이 stale baseline에서 source 비교 가능 문항은 805건, source file missing 3파일, MIXED source 1파일로 분리됐다. 805 `updateRequired`는 metadata 불일치 확정치가 아니라 schema가 없어서 생긴 보류 inventory다.
- 계약 테스트와 실제 dry-run 테스트가 통과했다. 원격 D1 migration·최신 export 확보 후 같은 도구를 다시 실행해 hash diff → sample review → batch backfill 순서로 진행한다.
- 상세 결과: `docs/review-packs/archive-blueprint-backfill-dry-run-20260824/CODEX_RESULT.md`.

## 2-28. 2026-08-24 Archive blueprint backfill SQL plan Phase 2E 준비

- `dry-run-archive-blueprint-backfill.mjs --sql-out <path>` 옵션을 추가해 Phase 2E batch backfill용 검토 전용 UPSERT SQL을 생성할 수 있게 했다.
- Phase 2A metadata 컬럼과 canonical source identity 컬럼이 모두 없는 export에서는 SQL plan 생성을 exit code 3으로 거부한다. 실제 D1 연결·SQL 실행·배포는 없다.
- fixture 검증에서 unchanged 행은 update를 만들지 않고, hash가 달라진 행은 deterministic `ON CONFLICT(archive_file, question_no) DO UPDATE` 한 건을 추가하는 것을 확인했다.
- 현재 2026-06-22 stale export에는 SQL plan을 생성하지 않았다. 최신 migration 적용 export가 확보되면 dry-run → sample review → SQL plan review → batch backfill로 진행한다.
- 상세 결과: `docs/review-packs/archive-blueprint-backfill-sql-plan-phase2e-20260824/CODEX_RESULT.md`.

## 2-29. 2026-08-24 Archive blueprint backfill sample review

- stale dry-run diff에서 300건을 뽑아 현재 archive JS를 독립 재평가했다. source ordinal·문항번호·metadata hash를 재계산한 결과 300/300이 `SOURCE_HASH_STABLE`이었다.
- sample 내 source missing, question number mismatch, hash mismatch는 0건이었다. 다만 원본 D1 export가 Phase 2A 이전 schema라 최종 상태는 `BLOCKED_SCHEMA_MISSING`으로 유지한다.
- 이는 archive source mapping의 결정성 확인이지 production backfill 승인 수치가 아니다. 최신 D1 export 확보 후 sample을 다시 실행한다.
- 상세 결과: `docs/review-packs/archive-blueprint-backfill-sample-review-20260824/CODEX_RESULT.md`.

## 2-30. 2026-08-24 Archive blueprint backfill batch safety gate

- batch backfill 직전 SQL plan validator를 추가했다. 실제 SQL은 실행하지 않고, destructive keyword·UPSERT 형식·문장 수 정합성만 검사한다.
- 현재 stale export는 `BLOCKED_SCHEMA_MISSING`으로 batch review가 차단된다. 안전 UPSERT fixture는 통과하고 destructive fixture는 거부되는 것을 확인했다.
- 최신 D1 export가 확보되면 SQL plan 생성 → safety gate → sample approval → batch update → post-audit 순서로 진행한다.
- 상세 결과: `docs/review-packs/archive-blueprint-backfill-plan-validation-20260824/CODEX_RESULT.md`.

## 2-31. 2026-08-24 Archive blueprint QR/OMR regression baseline

- Phase 2 완료 조건의 QR/OMR 게이트를 backfill 전 기준선으로 실행했다. 7개 정적 테스트가 모두 통과했다.
- 범위는 assignment identity, blueprint metadata flow, result item 저장, submit QR/OMR, solution link, QR payload regression이다.
- 결과는 `STATIC_REGRESSION_PASS`지만 `postBackfill=false`다. 실제 batch backfill·post-audit 후 동일 테스트를 재실행해야 Phase 2를 완료할 수 있다.
- 상세 결과: `docs/review-packs/archive-blueprint-qr-omr-regression-baseline-20260824/CODEX_RESULT.md`.

## 2-32. 2026-08-24 Archive blueprint post-audit 준비

- `audit-archive-blueprint-backfill.mjs`를 추가해 batch 이후 schema/diff/source/MIXED identity 상태를 자동 판정하도록 했다.
- 현재 stale export에서는 `BLOCKED_SCHEMA_MISSING`으로 유지되며, 920 rows·updateRequired 805·MIXED 1건이다. post-audit PASS로 오판하지 않는다.
- schema-ready zero-diff fixture는 `POST_AUDIT_PASS`를 확인했다. 실제 batch 결과가 생기면 같은 도구로 post-audit를 실행한다.
- 상세 결과: `docs/review-packs/archive-blueprint-post-audit-20260824/CODEX_RESULT.md`.

## 2-33. 2026-08-24 Archive blueprint migration·Worker 배포 정리

- 선행 `20260820_exam_blueprint_canonical_question_identity.sql`을 원격 D1에 먼저 적용했고, `20260824_archive_blueprint_metadata_bridge.sql`은 배포 baseline에 이미 있던 `type_key`·`difficulty`를 중복 추가하지 않도록 보정한 뒤 두 번째로 적용했다.
- 원격 `exam_blueprints`에서 `source_question_uid`, `source_question_ordinal`, `sub_unit_key`, `type_key`, `template_key`, `difficulty`, `metadata_revision`, `metadata_hash`와 신규 인덱스를 확인했다. migration ledger에는 두 파일이 각각 순서대로 기록됐다.
- `ap-math-os-v2612` Worker dry-run 및 production deploy를 완료했다. 배포 version ID는 `b3b4b8fa-f4f7-46b3-8f21-9da16820867a`이며, D1/R2/backup workflow binding이 확인됐다.
- 이번 단계는 schema·runtime bridge 배포까지다. 기존 920 blueprint의 metadata backfill, 최신 export 재생성, post-audit 및 Phase 3 진입은 별도 게이트로 남아 있다.

## 2-34. 2026-08-24 Archive blueprint backfill·post-audit

- 원격 D1 최신 export(1,675행)를 기준으로 1,260개 deterministic UPSERT 계획을 생성·검증하고 실제 backfill을 적용했다. Wrangler 결과는 1,260 queries processed, 7,572 rows written이다.
- backfill 후 export는 1,679행이며 source-backed 1,260문항은 `updateRequired=0`, `unchanged=1260`으로 hash diff가 0이다. QR/OMR 정적 회귀 7/7도 다시 통과했다.
- post-audit는 아직 `POST_AUDIT_REVIEW_REQUIRED`다. MIXED 7개 파일(총 343행)은 source UID/ordinal·metadata가 없고, source JS가 없는 3개 파일(총 72행)이 남았다.
- 추가로 legacy sparse-question-number 매칭에서 archive source와 맞지 않는 고아 blueprint 4행이 발견됐다. 해당 행은 삭제·추정 보강하지 않고 별도 검토 목록으로 보류한다.
- 따라서 Phase 3는 아직 시작하지 않는다. MIXED identity audit, 3개 source-unavailable 처리, 4개 orphan 행 처리가 끝난 뒤 post-audit와 QR/OMR 게이트를 최종 재실행한다.

## 2-35. 2026-08-24 MIXED identity 승격 및 잔여 blocker 재판정

- `audit-archive-blueprint-mixed-identity.mjs`로 MIXED 7개 파일·343행을 현재 archive JS의 `source_archive_file + source_question_no`와 대조했다. source file missing, source question missing, parse error, UID/ordinal mismatch는 모두 0건이며 canonical UID·source ordinal·metadata hash 후보가 343/343건 준비됐다.
- 검토 전용 UPDATE plan 343건을 생성·정적 안전검사 후, 변경 전 원격 D1 export를 보존하고 원격 `exam_blueprints`에 적용했다. 적용 후 export에서 343/343행의 UID·ordinal·metadata hash가 채워지고 재감사도 통과했다.
- 최신 post-audit는 MIXED identity blocker를 해소했고, source-backed metadata diff도 0이다. QR/OMR 정적 회귀는 7/7 통과했다.
- 현재 남은 blocker는 (1) sparse source에 매칭되지 않는 legacy orphan blueprint 4행, (2) 원본 JS가 없는 3개 파일 72행이다. 두 범위는 삭제·추정 보강하지 않고 disposition 보류로 유지한다.
- 다음 단계는 이 4+72행의 보류 사유와 운영 영향 보고서를 확정한 뒤, 승인 가능한 범위만 question-index/runtime 승격 전 검토하는 것이다. Phase 3 승격은 잔여 blocker 처리 전 시작하지 않는다.

## 3. 문서 구조 후속 관리

- 새 문서는 루트에 직접 만들지 말고 `docs/_index/DOCS_STRUCTURE.md` 기준으로 배치한다.
- 완료된 작업 문서와 과거 Codex 결과는 archive로 이동한다.
- 이동한 문서는 `docs/_index/ARCHIVE_INDEX.md`에 기록한다.
- archive 문서는 과거 근거이며 현재 기준이 아니다.
- 향후 작업 완료 시 3대 기준 문서 업데이트 필요 여부를 `CODEX_RESULT.md`에 기록한다.

## 4. 보류 / 금지 항목

- 문서 정리를 명분으로 한 코드, DB, Worker, UI, package 수정.
- `apmath/` 또는 repository-level `archive/` 산출물 변경.
- 세부단원 예외를 근거 없이 자동 재분류하거나 RAW/RRAW/UNMAPPED를 정식 키로 위장하는 행위.
- 명시 승인 없는 deploy, remote D1, production smoke.
- 삭제 판단이 불확실한 문서 삭제.
- archive 내부 과거 문서 본문 전체를 무리하게 현재 경로로 재작성.
- hidden foundation UI 노출.
- 실제 SMS/Kakao/email 발송 또는 실제 결제 gateway 연동.

## 5. 작업 유형별 완료 체크

| 작업 유형 | 완료 체크 |
|---|---|
| 문서 구조 변경 | root 목록, `_index`, archive index, read order, review pack 확인 |
| rulebook/policy 변경 | `MASTER_RULEBOOK.md`, `01_PROJECT_POLICY.md`, `08_DOCUMENT_UPDATE_RULE.md` 확인 |
| 현재 상태 변경 | `MASTER_CURRENT_PROGRESS.md`, 관련 `implemented/*.md` 확인 |
| 계획 변경 | `MASTER_NEXT_WORK.md`, 관련 `plans/*.md` 확인 |
| review 결과 반영 | 검증된 상태와 미확인 상태 분리 |

## 6. 다음 작업 시작 규칙

미래 작업은 먼저 아래 순서로 읽는다.

1. `docs/README.md`
2. `docs/00_READ_ME_FIRST.md`
3. `docs/MASTER_RULEBOOK.md`
4. `docs/MASTER_CURRENT_PROGRESS.md`
5. `docs/MASTER_NEXT_WORK.md`
6. 작업별 domain / implemented / plan 문서
