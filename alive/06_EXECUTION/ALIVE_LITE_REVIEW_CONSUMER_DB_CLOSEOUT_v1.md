# ALIVE LITE — REVIEW → Consumer DB → MAIN 완료 계약 v1

2026-10-08 KST | CURRENT | 신규 ALIVE Generated Bank의 REVIEW+MAIN 작업자 실행 정본.
상위: ALIVE_LITE_FULL_SCAN_ADAPTIVE_BATCH_TWO_CHAT_CONTRACT_v1.md, ALIVE_LITE_ANSWER_POSITION_REVIEW_REPORT_GATE_v0.1.md, ALIVE_GPT_LITE_CURRICULUM_HARD_GATE_v0.4.md. 기존 original/RPM LOCKED/타 운영라인은 수정 금지.

## 1. 책임과 완료의 정의
- CREATE 채팅 = 전체 source 스캔·배치 A/B/C/D·생성 JS/Meta/SVG/UID/manifest/receipt 브랜치 저장. CREATE는 독립 수학 PASS·학생 공급·Consumer 등록을 선언하지 않는다.
- **REVIEW+MAIN 채팅이 단일 완료 책임자**다. 생성 브랜치 readback → 독립 수학검수 → 선택지 품질/정답 위치 분석 → 핀포인트 수리 → 승인 UID 확정 → Archive 2.0 **실제 학생용 Consumer DB 등록** → 학생 검색·문항 조회/선택 검증 → main push/remote readback까지 같은 채팅에서 닫는다. 기술 구현이 필요하더라도 담당 역할을 다른 정상 검수 단계로 떠넘기지 않는다.
- `REVIEW_PASS`, `GENERATED_BANK_APPROVED`, `CONSUMER_DB_REGISTERED`, `STUDENT_SUPPLY_VERIFIED`, `MAIN_DONE`은 독립 상태다. main에 shard/manifest만 복사한 것은 DB 등록 아님.
- DONE 이름은 `REVIEW_CONSUMER_MAIN_DONE`. Consumer 등록 또는 실제 조회가 빠지면 `REVIEW_PASSED_REGISTRATION_PENDING`이며 DONE 아님. 일부 UID HOLD라도 나머지 승인 UID의 등록은 계속 진행.

## 2. REVIEW 실행 순서 (동일 대상 반복 재검 최소화)
1. 최신 main, CREATE 브랜치, 기존 answer repair 브랜치, root/nested AGENTS, 관련 CURRENT와 학교 00~07을 1회 확인. 별도 worktree 또는 독립 Git 트리 사용, 기존 dirty checkout 불변. 원본 source SHA·original 파일 불변.
2. 실제 shard JS 런타임 25개·L2 메타·9 manifest·통합 UID index·visual asset 및 SHA로 분모를 확정. 이전 PASS ledger나 집계만으로 품질 승계 금지.
3. **학생 발문/보기/필수 problem SVG 조건만** 보고 독립 수학 풀이와 보기 5개 판정을 물리 동결. 이후 저장 answer·solution 비교; 해설 교육성·교육과정·RPM L1~L4·난이도·학교 원본 마커·Blueprint 중복 검수. 이전 정답이 최초 풀이 전에 노출된 UID는 새로운 clean review 이전 HOLD.
4. `ALIVE_LITE_ANSWER_POSITION_REVIEW_REPORT_GATE_v0.1.md`에 따라 전체·승인·HOLD 세 분모 각각 ①~⑤ **before/after 빈도/비율**을 작성. 정답 위치 한 곳 >40%이면 finding. 기존 보기의 오개념·부호·계산·조건오해 등 그럴듯한 오답 구성 확인. 단순 shuffle, ±k식 기계적 오답, 정답 위치 20% 강제균등은 PASS 근거 아님. 오름차순·표현 종속으로 재배치 불가면 `CHOICE_ORDER_LOCKED` 기록. 수학 정답 불변; 보기 배열·answer 기호·solution 안의 번호 참조는 함께 핀포인트 수정 후 영향 문항만 재검.
5. 원본 수학 정보가 SVG에 의존하면 실제 SVG 좌표·영점·수치·표를 독립 검산. 4 SVG 필수 asset bytes/path 존재 확인. SVG 디자인·라벨·폰트·겹침의 개별 렌더 재검수는 후속 Codex 일괄작업; 필수 수학 조건 불명확 UID는 HOLD.
6. 수학/보기/해설/메타/중복 검수 후 `APPROVED_UIDS` 집합과 `HOLD_UIDS`를 SHA 동결. 변형이 같은 유형을 새 Blueprint 수로 부풀리지 않고, HOLD·FAIL·의미 중복 UID는 Consumer selectable에서 배제한다.
7. 승인 집합만 §3의 실제 Consumer source registry에 등록. 등록 도구 미지원이면 본 실행의 최소 기술 scope 안에서 adapter를 추가·검증하되, 완성 전 DONE 금지. 같은 검수자 책임을 유지하고 정확한 `REGISTRATION_IMPLEMENTATION_REQUIRED` 부채를 기록한다.
8. 학생용 검색→문항 열기/선택→정답·해설·이미지 조회 경로를 실검증하고 `studentLookupVerifiedCount`를 확정. main 대상 파일만 커밋/푸시, HEAD·consumer bytes·UID·SHA·보호본 원격 readback.

## 3. 현재 실제 Archive 2.0 Consumer 구조 — 새 등록 adapter 필요
- 기존 원본 경로: `archive/archive2-entry.js`는 `data/archive2-catalog.json`을 읽고 `archive/archive2-source.js`는 `exams/<file>`를 가져오며 `qid_v1_<SHA(sourceFile#ordinal)>` UID를 검증한다.
- 기존 `archive/tools/prepare-target-registration-candidate.mjs`, `archive/tools/prepare-target-registration.mjs`, `archive/tools/verify-archive-registration.mjs`는 original 시험지/DB/index의 등록 계약이다. `archive2-canonical.js`도 기존 catalog·identity authority를 강하게 검증한다.
- ALIVE source는 `archive/generated/lite/v1/.../shards/*.js`이고 고유 UID는 `ALITE-*`. **이를 원본 시험지로 가장하거나 UID를 임의로 qid_v1로 변경하여 원본 인덱스를 오염시키지 않는다.**
- 구현 우선안: **Generated Bank 승인 registry + 현행 학생용 finder/selector가 읽는 좁은 read-only consumer adapter**. 원본 catalog/DB/원본 열기 경로 보호. 실제 최신 consumer 구조를 확인해 smallest compatible route를 택하고, 필요한 경우 전용 버전드 catalog/metadata projection을 정의한다. 기술 구현은 형님이 요청한 REVIEW+MAIN closure 작업 범위에 포함되지만, 독립 등록 파이프라인 코드를 건드리는 경우 해당 파일만 테스트.
- registry 최소 필드: `generatedUid`, `sourceKind=generated`, `sourceExamPath`+SHA, `schoolMarker`, `sourceQid`, `shardPath`+SHA, `localOrdinal`, `l1/l2/rpmL3/rpmL4`, `contentFingerprint`, `reviewFinalArtifactSha`, `reviewStatus`, `imagePath`+SHA(해당 시), `consumerSelectable`.
- **DB_REGISTERED 증거**는 운영 consumer가 실제 읽는 canonical index/DB(정적 catalog 또는 실제 서비스 DB)의 쓰기와 조회 readback. 생성 receipt·Git stage·제안 JSON 단독은 아님. 운영 화면이 D1/server를 쓴다면 해당 서버 저장·readback도 필요; 정적 catalog 기반이면 정적 최종 파일과 브라우저 실제 로드 증거로 완료. 양자를 혼동하지 않는다.

## 4. 필수 최소 검증 및 완료 회계
- 최종 unique `approvedCount == consumerRegisteredCount == studentSelectableCount == studentLookupVerifiedCount`. 이미 존재하는 UID는 멱등 upsert 후 중복 0. HOLD/FAIL은 조회·선택·출제에 절대 노출하지 않는다.
- L2 shard/meta/manifest ↔ approved UID ↔ Consumer registry ↔ actual asset path/content SHA를 1:1 결속. 소스 교체·정답/보기가 변하면 이전 review SHA를 무효화하고 영향 UID만 재검.
- 실제 학생 흐름에서 일반 승인 문항 1개 + 필수 SVG 승인 문항 1개를 열어 정답·해설·asset와 선택/출제 가능 여부 확인. HOLD 1개 조회·선택 거부 부정 테스트. 원본 시험지 direct-open 및 기존 catalog UID/row 개수 유지.
- Consumer adapter / runtime 파일을 수정했으면 `node tools/check-archive2-runtime.cjs` 및 영향 경로 실제 Chrome smoke 필수. 신규 UID duplicate, 잘못된 origin UID 변환, SHA drift, HOLD 포함, 보기 복수정답, broken SVG 경로, 재등록 멱등 회귀 추가. unrelated global CI·정상 문항 전수 재풀이·SVG 미관 전수 렌더는 금지.
- 기술 write 실패는 상태 갱신→안전 재시도/최소 대안→물리 readback 후 미해결 target만 debt. 안전하지 않은 우회 등록 금지.

## 5. 동일 채팅의 evidence와 간결 보고
`review-consumer-closeout.json`에 대상 원본/생성 SHA, CREATE·repair head, 독립 freeze, approved/HOLD UID SHA, 변경 UID/보기·answer·solution 수정, before/after ①~⑤ histogram(전체·승인·HOLD), CHOICE_ORDER_LOCKED, L2 manifest/asset SHA, registered/selectable/studentLookup 수, catalog/DB 경로와 SHA, 보호본 parity, main commit+remote readback, 최종 status를 기록.
완료 보고: 검수 분모, PASS/수정 PASS/HOLD/FAIL, 보기 재설계/고정 수, ①~⑤ 전후 분포, SVG 필수 수학, **실제 Consumer DB 등록·학생 조회 문항 수**, 마지막 원격 main SHA. 이 중 DB/조회가 0 또는 미확인이라면 등록 완료로 보고하지 않는다.

## 6. 효천고 2026 후속 처리 (2026-10-08 물리 증거)
- main candidate **94 UID, 25 shard, 9 L2 manifest**. 과거 REVIEW report는 PASS 91 + 수정 PASS 1 + HOLD 2이며 `archive2ConsumerRegisteredCount=0`. 이 92 승인 기록은 **정답 위치 신규 게이트 이전의 역사적 review 상태**이며 최종 학생 공급 승인 수를 자동 고정하지 않는다.
- 문제의 baseline 정답 위치: ①9/②5/③63/④13/⑤4 (③ 67.0%). `pilot/alive-lite-hyocheon-answer-position-repair-20261008`에는 4차 phase 19+9+14+3 = **45개 변경 기록**. 중복 변경 UID는 최종 diff로 구분하고 실제 unique 수정 분모를 다시 계산. phase 원장은 독립 수학 재검 `NOT_REPERFORMED`/`NOT_REPEATED`이므로 무검수 main 병합 금지.
- 시작할 검수자는 current main 94와 repair branch 최종 frozen bytes를 diff→기존 비변경 UID의 유효한 증거 재사용 여부 판정→변경 UID의 학생용 조건/보기부터 fresh 풀이·선지별 유일성 확인→필요한 경우에만 수정→분포/보기 품질·HOLD 재판정→최종 approved UID 집합 확정.
- 그 집합만 Consumer adapter에 등록 후 학생용 readback, school `07_RELEASE_STATUS.md`와 closeout·index 갱신. 현재 사실은 **Consumer DB registered 0 / student lookup verified 0**. 이 값을 근거 없는 완료로 바꾸지 않는다.
