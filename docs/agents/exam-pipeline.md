# 시험지 제작·검수 (CREATE·R1·R2·R3, Codex·ROOT)

> 2026-10-30 루트 `AGENTS.md`에서 옮긴 원문이다. 문구는 그대로 두고, 링크 경로만 이 폴더 기준으로 고쳤다. 본문 속 백틱 경로는 저장소 루트 기준이다.
> 이 영역 작업을 시작할 때 읽는다. 공통 규칙과 작업별 안내는 루트 [AGENTS.md](../../AGENTS.md)에 있다. 새 지시는 루트 `AGENTS.md`가 아니라 이 문서에 추가한다.

## CURRENT HARD — Codex 시험지 FAST LANE / 중복 검수·도구 수정 금지 (2026-10-12 사용자 직접 지시)

- **학생용 설명·SVG 표기:** 신규·이번 수정 qid의 학생 노출 설명은 한국어 정식 교육과정 용어로 쓰되 변수·점·좌표·함수·단위 등 표준 수학 기호는 보존한다. SVG에 raw TeX·caret·영어 제작 메모·debug·placeholder가 노출되지 않도록 하고, 필수 그림·좌표·점 라벨·조건은 삭제하지 않는다. SVG 내 수식 렌더가 불가능하면 본문 수식 엔진으로 옮겨 필수 의미를 보존한다. 기존 미변경 문항 전체에 소급하지 않는다.
- **2026-10-13 CREATE/R1/R2/R3 품질 기준:** CREATE는 전 문항을 직접 풀고 해당 연도·학년·과목 교육과정 안에서 논리적으로 완결된 학생용 해설 초안을 작성한다. R1은 완전한 학생용 지문·보기·그림·표로 전 qid 독립 답과 근거를 정답·해설 열람 전에 기록·동결한 뒤 비교한다. R1은 실제 최종 해설의 개념·공식·표기·방법을 교육과정과 대조해 최종 파일 ID+revision 또는 실바이트 SHA-256에 결속한다. 신규 R2는 별도 검수자가 **전 qid 현재 해설을 학생 관점에서 따라 검산·적극 개선**하고 중간 계산·조건 사용 이유·보조선 목적·논리 연결을 보완한다. R2 전체 blind 답안 동결은 요구하지 않으며 정답 불일치·의심·고위험은 원문/보기에서 독립 재풀이한다. 각 qid의 부족점·수정 전후·학생 이점, 무수정이면 설명 충분성의 근거를 누적 기록한다. 수정량 할당은 없다. R3는 변경·미해결·직접 영향과 최종 파일·구조만 확인하며 전수 의미검수를 반복하지 않는다. 검사기 PASS는 수학·교육과정 검수 완료를 대신하지 않는다. 실제 검사 범위/결과를 기록하고 미실행은 `NOT_RUN`으로 남긴다. 과거 유효한 blind/freeze/PASS는 보존하며 진행 중 작업은 재시작·중복배정하지 않는다.


- **2026-10-13 신규 문항 HOLD 발행 금지:** 신규 Codex 문항 작업은 임시 item/시험지/roster/run HOLD도 발행하지 않는다. 결함은 담당자·qid·다음 수정 행동을 지정해 수정프로토콜로 직접 수정하고 필요한 해당 영역만 원문 대조한다. 원문 복구 불가능이면 승인된 ALIVE 문형 대체를 반드시 적용하며, 후보가 실패하면 수정하거나 다른 후보를 생성해 해당 문항의 독립 검수·Meta·에셋·표시·main 반영까지 완성한다. ROOT는 수정/대체 인계와 완료를 수납하며 이미 위임된 대체를 재승인받지 않는다. 운영 보고는 제작/수정/대체 제작/검수/병합 진행으로 표현하고 HOLD로 반환·종료하지 않는다. 과거 원문/HOLD/실패/freeze 및 대체 provenance는 이력으로 보존하고 바뀐 qid만 새 입력으로 검수한다. 공유 도구 수정 금지는 문항 수정·대체 금지가 아니다. 실제 실행·권한 오류와 미실행 검수는 사실대로 기록하고 나머지 시험지는 계속 진행한다.

- 실행 정본: `docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Fast_Lane_CURRENT_v1.md`. Codex 원본 시험지의 기본 종료는 CREATE → R1 → R2 → R3 → 프로덕션 JS·필수 에셋 main 반영·원격 일치 확인이다. 등록·배포는 별도 요청 범위이며 병합 선행조건으로 자동 추가하지 않는다. ALIVE Generated 출시 계약과 명시적으로 지정한 다른 종료 조건은 유지한다.
- 기존 PASS/freeze/렌더는 재사용하고 첫 미완료 단계부터 이어간다. generic validator는 단계 정상 마감의 보조 기술검사로 한 번 수행하며 실제 범위·결과 또는 `NOT_RUN`을 남긴다. R1 전 qid 독립 풀이·해설/교육과정 deep 검수, R2 전 qid 학생 관점 해설 검산·개선 검토, R3 changed/open/direct-dependency 및 최종 구조·표시 마감으로 구분한다. 실제 실패·수정 qid와 필수 직접 의존성만 다시 확인하며 ROOT 재검과 무관한 rebuild는 금지한다.
- 시험지 run 중 공유 도구/validator/renderer/compiler/등록기/registry/CI 수정, 새 helper 작성, MASTER 자동 도구 복구를 절대 금지한다. preflight/bind/seal/verify/intake/dispatcher/등록 candidate는 생산 필수 호출에서 제거한다. 편의 도구가 막히면 JS·에셋·기존 증거를 직접 읽어 진행한다. 도구 호환 결함은 실제 품질 항목을 직접 확인한 MANUAL_STAGE_COMPLETE로 인계하되 generic FAIL_TOOL/NOT_RUN을 그대로 보존한다. 실제 품질·입력 결손은 완료로 우회하지 않는다. 도구 수정은 사용자에게 별도 맡긴 작업에서만 수행한다.
- 기존 CREATE 진행분이 있는 JS 2개 약 2시간을 운영 목표로 삼고 보고는 최소화한다. 아래 과거 NONSTOP/OWN_AND_FIX/기술 continuation 규정으로 이 범위를 확대하지 않는다. ROOT는 routing·publication, 하위 stage는 Luna High를 유지한다.

## Archive 추출 입력 우선 — 사용자 지정 2026-10-09

`docs/rules/02_PIPELINES/Archive_Extracted_Source_First_v1.md`를 따른다. 발문·보기·수식·문제 이미지가 추출된 이후에는 CREATE부터 JS·실제 에셋을 기본 입력으로 쓰며 PDF routine 전수 대조를 하지 않는다. 원본이 실제로 필요한 문항 결함만 qid·확인할 사실을 명시해 해당 영역을 대조한다. JS/asset SHA·intake provenance는 재사용하고 실제 하지 않은 원문 대조 PASS를 기록하지 않는다. 완전한 학생 입력·실제 에셋 열람과 독립 freeze, 문항 품질·렌더·HOLD·publication 기준은 유지한다. 아래의 기존 PDF 자동 선행·전 페이지 대조 요구보다 최신 사용자 지시가 우선한다.

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
