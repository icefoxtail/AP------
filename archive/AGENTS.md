# Archive implementation instructions

## CURRENT storage boundary — production Git and Drive cold evidence

Use root `AGENTS.md`'s 2026-10-16 Git/Drive policy. Keep source, required assets, current tools/contracts/tests, and the 65 exact byte-bound offline authorities listed by `archive/data/evidence-authority/v1/index.json` in Git. Raw `archive/analysis` histories and rebuildable outputs move to the Drive vault only after full pack/index/readback verification. The previous ban on a blanket `archive/analysis/` ignore is superseded after that verification; do not remove originals early. ROOT consumes compact verified completion receipts and hydrates requested raw bytes through `tools/archive-cold-evidence.mjs` into the ignored cache. Workers still inspect full inputs and perform actual independent quality review. A missing or mismatched Drive pack stays unavailable; it never becomes PASS and never bypasses a validator or quality stage. GitHub CI must remain offline-capable.

Codex 원본 시험지 생산은 `../docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Fast_Lane_CURRENT_v1.md`를 우선한다. JS·실제 asset 직접 검수로 진행하고 preflight/bind/seal/verify/intake/등록 candidate를 필수 호출하지 않는다. 시험지 run에서 공통 도구 수정·새 wrapper·MASTER 자동 수리는 금지한다. 아래 런타임 구현 지시는 실제 런타임 수정 작업에만 적용하며 단순 시험지 생산의 추가 gate가 아니다.

신규 문항 HOLD 발행 금지: 결함은 해당 qid 담당자의 수정→필요한 원문 영역 대조→승인 ALIVE 대체→영향 검수로 완성한다. 임시 item/시험지/run HOLD로 반환하지 않는다. ROOT는 담당자·다음 행동을 연결하고 완료를 수납한다. 과거 HOLD 이력과 원 freeze는 보존하며 실제 권한·실행 오류 및 미실행 검수는 사실대로 기록한다.

상위 `AGENTS.md`와 `../docs/rules/01_CANONICAL/Archive2_Runtime_Responsiveness_and_Original_Source_Contract_v1.md`를 함께 적용한다. Archive 2.0 런타임 코드를 변경하기 전에 계약을 읽는다.

원본 기출을 열기 위한 브라우저 저장소 복사, 클릭마다 반복되는 전체 아카이브 검사, 저장소 장애·용량 초과로 출력 창이 닫히는 회귀를 허용하지 않는다. 새 기능을 위해 기존 안정 경로와 사용자 응답성을 희생하지 않는다.

화면·공통 엔진·출력·저장소 변경의 완료 조건은 `node tools/check-archive2-runtime.cjs` PASS와 해당 경로의 실제 브라우저 검증이다. 로그 없이 "문제없음"이라고 보고하지 않는다. 원본 내용·정답·해설, UID 순서, frozen snapshot 및 서버 권한 검증을 성능 개선의 대가로 바꾸지 않는다.

단순 원본 시험지 source/asset 검수는 기존 stage 품질 절차의 대상이며, 이 문서가 시험지별 전체 런타임 점검을 추가로 요구하는 것은 아니다.
