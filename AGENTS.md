## CURRENT HARD — 문제은행 전 문항 문제·해설 SVG 필요시 의무 생성 (2026-10-10 형님 지시)
- **팔마고 한정 아님**. 기출·ALIVE Generated 후보/승인·교재/평가문항 등 실제 문제은행 모든 UID에 대해 **문제 그림과 해설 그림을 각각** 전수 triage한다. 텍스트만으로 풀이 가능하다는 이유로 해설 SVG를 자동 생략하지 않는다.
- 실제 결정적 교육 가치가 있는 REQUIRED/BENEFICIAL 해설 SVG 및 필수 문제 시각자료는 기존 `.codex/skills/apmath-visual-upgrade/SKILL.md`, `도형추출.md`, 현존 `alive/engine/visual_renderer.py` 등 적절한 backend로 **생성/보강→actual geometry parity→학생용 참조→실제 렌더 증거**까지 완료한다. 충분한 원본 PNG/기존 검증 SVG를 무의미하게 중복 제작하지 않는다.
- SVG 필요인데 자산 없음/학생 UI 미연결/렌더 미검증이면 신규 RELEASE DONE 금지. 기존 승인본은 일괄 무효화하지 않고 UID별로 보강한다. 신규 엔진 중복 제작·미지원 renderer 지원 허위 주장 금지.
- **실행 정본:** [문제은행 전 문항 문제·해설 Visual/SVG 게이트 CURRENT](docs/rules/04_VISUAL/Problem_Bank_All_Items_Problem_And_Solution_Visual_Gate_CURRENT_v1.md). 이번 문서 반영은 POLICY_ONLY이며 전수조사·SVG 신규 제작/렌더 완료를 의미하지 않는다.

## CURRENT HARD — 수정 AI OWN_AND_FIX / 메타 확장 / main 후 학생 화면 기술 마감 (2026-10-09 형님 직접 지시)
- 모든 JS Archive·ALIVE·문제은행 수정/검수/메타/출시 실행자는 [수정 AI 책임·Meta 확장·출시 마감 CURRENT](docs/architecture/Archive_Correction_Owner_EndToEnd_Closeout_CURRENT_v1.md)를 필독한다. **보고/미확정/NOT_TESTED로 작업 종료하지 않고**, 자신이 발견한 결함을 직접 수정하거나 실제 기술 실행자를 연결해 완료를 수납한다.
- 기존 canonical key를 먼저 검색하되 필요한 CrossConcept·Condition·Generated L4 키가 없으면 사용자 추가 승인 대기 없이 **Generated-only 확장 registry**에 의미·parent·evidence·UID를 등록한 뒤 Source/metadata/Consumer/index에 영구반영한다. RPM LOCKED·원본 기출 및 무관한 UID 보호, 무근거 추정 금지.
- 원장 직접 Generated 품질 지시의 별도 인증은 생략. **main 병합 이후 필요한 실제 Chrome 학생 조회/출력 등 기술 검사는 수정 AI가 끝까지 진행**한다. main write만으로 MAIN_DONE이 아니며, 실패하면 본 작업의 수리 대상으로 처리한다. 실제 미실행을 PASS로 꾸미지 않는다. 예외적 막힘은 시도·정확한 blockers·주체를 ledger에 남기되 재승인 요청/보고만 하고 끝내지 않는다.

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
8. R2 blind 입력은 정답/해설을 제외한 학생용 필드만 먼저 추출한다. freeze 전 답 노출은 실패 실행으로 보존하고, 새 `archive_r2`에서 clean blind 실행을 수행한다. 구조 validator PASS만으로 이 실패를 닫지 않는다.
9. CREATE/R1/R2/R3는 역할별 동시 담당을 각각 1개로 제한하는 직렬 컨베이어다. CREATE가 A를 인계하면 새 CREATE가 B를 시작하고, downstream 역할이 비는 즉시 다음 시험지를 받는다. CREATE 5개 동시 실행은 금지하며 concurrency 5는 상한이다. Codex 2.0은 CREATE/R1/R2/R3 stage worker를 고정 역할로 사용하되 새 `(examUid, stage)`는 fresh session을 기본으로 한다. 같은 시험지의 동일 stage 수정·재확인·closure는 기존 session에서 이어간다. R3가 actual render를 담당하고 ROOT는 publication·SHA·validator·receipt 수납·remote readback을 담당한다. ROOT는 화면을 다시 검수하지 않으며 MASTER는 실제 durable technical continuation에만 사용한다.
10. R1 DEEP는 수학/answer 검수와 별도로 전 qid의 QUESTION_LAYOUT / SOLUTION_LAYOUT / META / VISUAL_SVG 4축 독립 검수를 기록한다. R2는 전 qid blind answer sweep을 유지하며 유효한 unchanged freeze는 재사용한다. R3는 changed/open/direct dependency 및 전체 구조 integrity를 확인하고 actual render를 담당한다. MAIN_DONE은 R3 release/static-ready → actual render PASS 또는 CURRENT §25 ROOT 캡처 면제 gate → production canonical 반영 → asset reference 확인 → remote main parity까지 완료해야 한다.
11. 사용자에게 위임받은 이번 운영 라인에서 ROOT는 routing과 최종 운영 결정권을 가진다. worker의 검증된 근거에 따라 최소 수정안 적용, 오류 복구, 보류/인계 및 승인 범위 내 publication을 자율 결정하며 같은 적용 여부를 사용자에게 반복 확인하지 않는다. 수학·Meta·Visual·source의 직접 검수는 여전히 해당 worker가 수행한다. 원문 대비 수정은 provenance와 evidence에 명시하고 검증 실패를 강제 PASS로 처리하지 않는다. 위임 범위 밖의 새 목표나 복구 불가능한 필수 입력 부족만 사용자에게 요청한다.
12. CREATE/R1 worker가 해설을 작성·수정할 때는 현재 해설 품질 프로토콜의 Golden/Negative sample preflight를 실제 작업 전에 수행한다. 작업 뒤 읽은 샘플을 preflight로 소급 기록하지 않는다. 늦게 발견한 순서 오류는 보존하고, 프로토콜이 허용하는 최소 correction-review pass에서 샘플을 먼저 확인한 후 변경 locus만 다시 검수한다.
13. R1/R2의 학생용 입력은 지문·보기뿐 아니라 모든 참조 그림·표·도형을 포함한다. 필요한 그림을 실제로 열어 확인하기 전 blind/independent freeze를 하지 않는다. 입력 누락으로 결정할 수 없는 답을 freeze하고 upstream 답을 공개한 경우 해당 실행은 실패 기록으로 보존하고 완전한 학생용 입력으로 새 세션에서 검수한다.
14. 학생용 bundle은 실제 current final source에서 추출하고 문항별 학생 필드의 일치와 참조 자산을 freeze 전에 확인한다. 기존 CREATE/old student bundle을 현재 SHA만 붙여 재사용하지 않는다. Git blob SHA-1, 파일 SHA-256 및 각 gate의 raw/clean-filter hash 계약을 구별한다.
15. 완전한 학생 입력으로 답을 먼저 freeze한 뒤 비교에서 발견된 계산·선택기호 표기 오류는 blind 오염이 아니다. 원 freeze와 사전 추론은 보존하고 같은 stage에서 해당 locus만 근거 있는 adjudication/encoding correction을 한다. 정답을 맞힐 때까지 새 agent를 반복 호출하지 않는다. freeze 전 답 노출·그림 누락이나 student body 교체로 기존 freeze가 무효인 경우에만 영향 qid의 fresh 검수를 수행한다.

16. 신규 Codex evidence는 qualityContractVersion을 반드시 기록하고, generic validator를 --quality-contract JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006으로 호출한다. 버전 누락/오타를 legacy PASS로 우회하지 않는다. R3의 targeted rows와 전 문항 artifactDispositions를 구분한다.
17. 기존 JS 발문 조판은 `docs/rules/01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md`를 따른다. AUTO-FIRST로 정상 자동 줄바꿈은 KEEP하고, 실제 렌더에서 식·정의·조건·질문 경계가 붙어 읽기 어려운 qid만 완결 수식 바깥에서 최소 개행한다. 글자 수·문장 길이·정규식 기반 일괄 조판을 금지하며, `SOURCE_TEXT_EXACT_PARITY`와 choices exact equality를 유지한다. 실제 Archive exam engine의 대상 문항 전체를 렌더 확인한다. 사용자 지정 qid는 전체 분모의 독립 qid-by-qid 검토를 대체하지 않으며, 모든 문항에 KEEP 또는 최종 disposition과 그 화면 근거를 남긴다. MathJax `$...$` 안에 HTML/CSS placeholder를 넣지 않는다. `subjective-2up`은 canonical §6 근거가 있을 때만 개별 문항에 적용하며, 한 파일럿의 qid는 다른 문항/시험지의 자동 승격 근거가 아니다.

## Archive Codex 실행 증거·수납 보완

- assignment의 worktree/working JS/asset root/evidence root 절대 경로와 expected SHA를 첫 동작에서 확인한다. asset root는 실제 `assets/` 부모다.
- CREATE item HOLD는 JS·에셋 결함 판정 → 필요한 경우에만 scoped PDF 대조 → 최소 수정 → R1/R2 검수 → true item HOLD의 QUESTION_ONLY 대체 경로를 이어 간다. 복구 가능한 기술 결속 오류를 시험지 최종 HOLD로 종료하지 않는다.
- stage 결과는 `--quality-contract JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006 --execution-line CODEX --json`의 실제 raw generic report를 보존한다. custom PASS 요약이나 common-only PASS는 active artifact contract 증거를 대신하지 않는다.
- ROOT는 publish 전에 실제 report schema, 전 qid 분모, JS·자산·receipt SHA를 수납한다. Git index와 remote bytes를 각각 확인하고 기존 파일도 raw witness와 다르면 명시한 경로만 재정규화·stage한다. 기존 실패와 수정 provenance는 보존한다.
- 명시적 사용자 지시가 특정 run의 실제 캡처 요건을 면제하면 원문 지시·고정 roster·범위·SHA를 별도 evidence로 결속한다. `NOT_RUN_USER_WAIVER`와 `USER_DIRECTED_STATIC_COMPLETE`를 사용하고 실제 `RENDER_PASS`를 주장하지 않는다. JS/자산, R1/R2, item HOLD, production·remote readback 요건은 유지한다. 기본 actual render 계약은 유지한다.

## ROOT production 완성·예외·HOLD 해제 권한

CURRENT Execution v1.3 §25를 따른다. ROOT는 승인 범위에서 캡처/실제 render 조건을 근거 있게 면제하고 최소 수정·true item HOLD의 문항 대체·기술 복구·HOLD 해제·publication을 자율 결정한다. 같은 적용 여부를 반복 요청하지 않는다. 완료 기준은 JS/정답/해설/Meta/이미지/SVG, 유효한 R1/R2 및 R3 static integrity, zero item HOLD, 실제 production·remote readback·closeout이다. 캡처만 없다는 이유로 최종 HOLD를 만들지 않는다. ROOT 결정은 ROOT_DELEGATED/ROOT_DIRECTED_STATIC_COMPLETE/NOT_RUN_ROOT_WAIVER와 범위·사유·대체 검수·SHA를 기록한다. actual RENDER_PASS를 가장하지 않으며 알려진 품질 결함을 면제하지 않는다. 일반 ROOT 경로는 archive-codex-root-waiver-intake.mjs 및 RootWaived static/MAIN_DONE validators·stage consumers로 수납한다. 새로운 예외 기능이 미지원일 때만 MASTER의 exact 기술 continuation으로 결속을 보완한다. 원 정상/실패/freeze/capture/권한 provenance는 보존한다.
