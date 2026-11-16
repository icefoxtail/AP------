# TASK-03 결과: 기능 기본 OFF인 역사 판본 재결속

## 1. 먼저 조사한 현재 경로

기준 main: `18fa82034ce4189d2a15833cbe3ad44694a04675`. 이 커밋에서 새 `feat/registrar-rebind-20261116`을 만들었다. 운영 데이터 적용, main 병합, PR 생성, 배포는 하지 않았다.

- `auto-register-merged-source.mjs`의 기존 `planQuestion` 274행부터 UID/path/ordinal, authority hold, 명시 source UID, 번호를 확인한다. 기존 288~289행의 identity fingerprint 불일치와 canonical/current/prior fingerprint 충돌은 `SUPPLEMENT_PENDING`. `registerMergedSource`가 `.archive-meta-register/auto/state.json`의 pending에 lastReasons/attemptSignature를 저장하며, 성공한 APPLY만 requests/receipts와 latestReceipts를 만들었다. 새 기능은 이 두 fingerprint 거부 뒤에서만 진입하고 나머지 기존 판정은 우회하지 않는다.
- v2의 `loadPriorQuestionBank`/`validateReviewedSourceFingerprints`는 요청의 `rebind.priorSourceBlobSha1`을 실제 Git blob으로 읽고, before/after 지문, 같은 content fingerprint, source 번호, identityBefore를 확인하는 명시 요청 경로다. 새 경로는 개별 승인 요청이나 재승인을 만들지 않고 같은 파일의 실제 reachable history에서 canonical 지문을 재현하는 최신 blob을 찾는다. source+identity 지문이 이전 또는 현재 중 하나여야 하는 검증을 재사용했다.
- `register-basic-scope-rebind.mjs`는 승인된 기본범위의 새 그림과 제한된 본문 수정만 허용하고, SHA 결속 사람 검토와 부모 링크를 요구한다. 새 경로는 그것을 완화하지 않는다. 그림·표기·해설·발문·정답 변경을 별도 꼬리표로 기록하는 독립 opt-in이다. 기존 승인 종류나 기본범위 링크를 새로 만들지 않는다.
- 4칸 `build-4slot-runtime.cjs`는 역사 source blob으로 student payload baseline을 만들고 `STALE_STUDENT_PAYLOAD`를 검사한다. renderer/registered continuity/vector continuity는 각자의 증거를 재검증한 경우에만 예외다. 새 sourceDrift는 그 예외의 근거가 아니며 4칸 승인/사전/compact를 바꾸지 않는다.
- canonical `sourceFingerprint`는 content/choices/answer/solution/image, `contentFingerprint`는 content/choices/image를 동일 순서로 해시한다. identity sourceFingerprint도 결속한다. 카탈로그 빌더의 exact/content 결속, 브라우저 `archive2-source.js`, Worker 질문 도우미, canonical/runtime 배정, 4칸의 별도 payload 결속이 소비자다. 운영 활성화 시 catalog, canonical source/parent links, runtime projection, question index/identity 파생, 4칸 index 및 학생 화면을 각 공식 생성기로 다시 검증해야 한다. 지문 갱신만으로 이들을 완료했다고 하지 않는다.

## 2. 구현과 경계

코드 커밋: `b7d365d9101e0deb2959590873a04a6fda542c8b` (원격 브랜치 readback 및 변경 9파일 bytes 확인)

변경 파일:
- `archive/tools/meta-foundation/registrar-rebind.mjs` (새 순수 계획)
- `archive/tools/meta-foundation/source-history.mjs` (새 시험지별 history 공용 모듈)
- `archive/tools/meta-foundation/source-delta.mjs`
- `archive/tools/meta-foundation/source-delta-report.mjs`
- `archive/tools/meta-foundation/auto-register-merged-source.mjs`
- `tests/archive-registrar-rebind.test.mjs`
- `tests/archive-registrar-rebind-integration.test.mjs`
- `tests/archive-source-history.test.mjs`
- `tests/archive-source-delta.test.mjs`

`ARCHIVE_REBIND=1` 또는 `--rebind`에서만 적용한다. 기본 OFF. `--rebind-report <저장소 밖 경로>`는 config OFF에서도 읽기만 하며 `--write`와 함께 주면 거부한다. 내부/symlink 내부 경로, 값 없는 report 플래그도 거부한다. 과거 판본은 시험지별 log 1회+cat-file batch 1회로 읽고 같은 ordinal의 canonical 지문과 문항 수를 증명한다. UID/번호/authority hold/제3의 identity 지문은 거부한다.

REBIND는 지문/꼬리표만 바꾼다. 기존 fieldStatus, metadataStatus, 승인 근거, 값은 그대로다. receipt `kind: SOURCE_REBIND`, before/after 전체 행, prior blob, 현재 source SHA, identityBefore로 이력을 보존한다. BLOCK은 기존 지문을 결속하지 않고 `metadataExcluded: true`와 재분류 표시를 남긴다. 기존 값은 행과 불변 receipt before에 보존된다. 기존 receipt를 덮어쓰지 않으며 같은 입력 반복은 중복을 만들지 않는다. mode-aware attemptSignature로 기능을 처음 켤 때 재시도하되 반복 BLOCK이 bounded queue의 뒷 문항을 영구히 막지 않게 했다.

`--verify`는 새 receipt/identity/canonical/source core를 검증하되 `REBIND_CORE_VERIFIED_CONSUMERS_PENDING`과 `consumerVerification: NOT_RUN`을 반환한다. 새 경로의 runtime/UI 검증을 거짓 PASS로 표시하지 않는다.

## 3. 꼬리표와 어휘 / 임의 선택

- `sourceDrift: {class, at, priorBlob}`와 `reviewPending: [...]`: 기존 canonical 28,890행에서 두 이름의 선점은 각각 0건이었다. Meta OS의 “상태는 꼬리표, 실제 다른 문항 결함만 차단, 없는 판정은 만들지 않음”에 맞추고 기존 21종 metadataStatus나 fieldStatus 어휘를 추가·변환하지 않았다.
- `NONE`은 UNCHANGED의 무조치 action 이름으로 선택했다. at는 실행 HEAD의 commit ISO 시각으로 고정해 재현성을 유지한다.
- 복합 변화는 심각도 하나로 검토 의무를 잃지 않도록 method/stem/answer/other를 누적하고 figure도 보존한다. ANSWER_FILLED는 빈 정답→실제 채움이며 숫자 0은 빈 값이 아니다.
- REPLACED는 `sourceDrift.metadataExcluded: true`, `reviewPending: ["reclassification", ...]`로 표현한다. 현재 소비자가 이 새 표시를 읽지 않는다는 점 때문에 운영 스위치는 계속 OFF다.
- `source-delta`의 기존 golden 기대값은 변경하지 않았다. 숫자 사이 외부 공백, 중첩 text 공백, 인용 속성의 `>`, 빈 정답 채움 플래그를 회귀 테스트로 추가했다.

## 4. PR #2224 겹침

조사한 PR head: `b76eaf3a1ed8a1ade1dae6185e7b7c044455ef66`. 해당 diff를 먼저 읽고 main 기준으로 구현했다. PR 코드를 전제로 하지 않는다.

겹침은 같은 `auto-register-merged-source.mjs`의 imports, `planQuestion`(기존 274행 이후), `registerMergedSource`(기존 482행 이후의 history/nativeSource/result/receipt/state/replay 처리), `verifyMergedSource`(기존 642행 이후), CLI다. #2224는 `nativeReviewReceipt`의 issued-source/renderer/RPM evidence continuity, claim guard와 semantic-run-scope/deferred targets/replay 봉인을 확장한다. 본 작업은 이를 가져오지 않고 별도 `planSourceRebind`/history helper로 분리했다. 향후 합칠 때 두 경로의 authority hold, run-scope 제외, pending signature, replay 및 새 receipt 검증을 함께 재검해야 한다. 특히 scope 제외 문항을 새 rebind로 다시 활성화하면 안 된다.

## 5. 실제 main 대기 상태의 읽기 전용 결과

### 실측 요약

- 기준 HEAD: `18fa82034ce4189d2a15833cbe3ad44694a04675`. 소스·정본·identity·pending은 이 HEAD의 작업 사본, 실행은 새 등록기 보고 전용 경로. 메타/identity/영수증 쓰기 없음.
- 전체 실행 시간: 193.812초. 원본 JSON: 저장소 밖 읽기 전용 JSON 증거(운영 데이터·Git에 미커밋).
- 모집단: 로드 가능한 현재 시험지에서 정본 또는 identity sourceFingerprint가 현재 문항과 다른 정본 행. 삭제·로드 실패·순번 문항 누락은 별도 unresolved 후보로 보존하며 지문 불일치 건수와 구별함.
- 전체 후보: 9326건, 지문 불일치 9326건, unresolved 0건 (canonicalOnly 13, identityOnly 23, both 9290). action: REBIND 9072, BLOCK 79, REFUSE 175. class: STEM_EDIT 619, SOLUTION 7102, REPLACED 79, FIGURE 857, ANSWER 430, UNKNOWN 175, NOTATION 64. sourceDrift class: STEM_EDIT 619, SOLUTION 7102, REPLACED 79, FIGURE 857, ANSWER 308, NONE 175, ANSWER_FILLED 122, NOTATION 64.
- 현재 등록기 선택 후보: 6640건, action REBIND 6470, REFUSE 144, BLOCK 26, class SOLUTION 4969, FIGURE 845, ANSWER 233, UNKNOWN 144, STEM_EDIT 404, NOTATION 19, REPLACED 26.
- 실제 pending 12881건. 저장된 fingerprint 사유: IDENTITY_SOURCE_FINGERPRINT_MISMATCH 2393, METADATA_SOURCE_FINGERPRINT_CONFLICT 7. 저장된 lastReasons는 마지막 시도 기록이며 현재 판정과 동일하다고 가정하지 않음.
- 현재 불일치 ∩ pending: 6640건. action: REBIND 6470, REFUSE 144, BLOCK 26. class: SOLUTION 4969, FIGURE 845, ANSWER 233, UNKNOWN 144, STEM_EDIT 404, NOTATION 19, REPLACED 26.
- 위 교집합 중 lastReasons에 FINGERPRINT가 있는 행: 2298건. action: REBIND 2263, REFUSE 29, BLOCK 6. class: SOLUTION 2106, ANSWER 40, NOTATION 3, UNKNOWN 29, STEM_EDIT 94, FIGURE 20, REPLACED 6.

### 전체 학년·학기별

| 경로 그룹 | 건수 | action | class |
|---|---:|---|---|
| original/high/h1/1final | 627 | REBIND 594, REFUSE 32, BLOCK 1 | SOLUTION 571, NOTATION 3, STEM_EDIT 15, UNKNOWN 32, FIGURE 3, REPLACED 1, ANSWER 2 |
| original/high/h1/1mid | 525 | REBIND 516, REFUSE 1, BLOCK 8 | SOLUTION 388, STEM_EDIT 104, UNKNOWN 1, ANSWER 16, FIGURE 7, REPLACED 8, NOTATION 1 |
| original/high/h1/2final | 309 | REBIND 309 | SOLUTION 295, FIGURE 7, STEM_EDIT 4, ANSWER 3 |
| original/high/h1/2mid | 885 | REBIND 856, REFUSE 29 | SOLUTION 809, UNKNOWN 29, ANSWER 23, FIGURE 17, STEM_EDIT 6, NOTATION 1 |
| original/high/h2/1final | 293 | REBIND 262, REFUSE 31 | SOLUTION 225, STEM_EDIT 25, FIGURE 10, UNKNOWN 31, ANSWER 2 |
| original/high/h2/1mid | 450 | REBIND 408, REFUSE 40, BLOCK 2 | SOLUTION 347, UNKNOWN 40, STEM_EDIT 37, FIGURE 16, ANSWER 7, REPLACED 2, NOTATION 1 |
| original/high/h2/2final | 428 | REBIND 415, REFUSE 13 | SOLUTION 377, STEM_EDIT 30, UNKNOWN 13, ANSWER 4, NOTATION 2, FIGURE 2 |
| original/high/h2/2mid | 339 | REBIND 338, REFUSE 1 | SOLUTION 285, STEM_EDIT 7, NOTATION 36, FIGURE 8, ANSWER 2, UNKNOWN 1 |
| original/high/h3/1mid | 1 | REBIND 1 | SOLUTION 1 |
| original/middle/m1/1mid | 92 | REBIND 92 | SOLUTION 92 |
| original/middle/m1/2final | 247 | REBIND 243, REFUSE 4 | SOLUTION 229, FIGURE 7, UNKNOWN 4, STEM_EDIT 6, ANSWER 1 |
| original/middle/m1/2mid | 334 | REBIND 334 | SOLUTION 255, FIGURE 53, STEM_EDIT 8, NOTATION 16, ANSWER 2 |
| original/middle/m2/1final | 531 | REBIND 526, REFUSE 5 | SOLUTION 427, STEM_EDIT 57, FIGURE 32, ANSWER 10, UNKNOWN 5 |
| original/middle/m2/1mid | 374 | REBIND 360, BLOCK 7, REFUSE 7 | SOLUTION 290, STEM_EDIT 36, FIGURE 18, REPLACED 7, UNKNOWN 7, ANSWER 15, NOTATION 1 |
| original/middle/m2/2final | 444 | REBIND 442, BLOCK 2 | SOLUTION 252, FIGURE 93, ANSWER 84, STEM_EDIT 13, REPLACED 2 |
| original/middle/m2/2mid | 597 | REBIND 596, REFUSE 1 | SOLUTION 504, ANSWER 11, STEM_EDIT 38, FIGURE 43, UNKNOWN 1 |
| original/middle/m3/1final | 366 | REBIND 366 | SOLUTION 206, STEM_EDIT 35, FIGURE 123, NOTATION 1, ANSWER 1 |
| original/middle/m3/1mid | 546 | REBIND 536, BLOCK 10 | SOLUTION 390, FIGURE 80, STEM_EDIT 45, ANSWER 21, REPLACED 10 |
| original/middle/m3/2final | 589 | REBIND 584, BLOCK 2, REFUSE 3 | SOLUTION 420, ANSWER 35, STEM_EDIT 100, FIGURE 29, REPLACED 2, UNKNOWN 3 |
| original/middle/m3/2mid | 441 | REBIND 440, REFUSE 1 | SOLUTION 337, FIGURE 97, ANSWER 2, STEM_EDIT 4, UNKNOWN 1 |
| similar/high/h1/1final | 61 | REBIND 61 | ANSWER 53, SOLUTION 3, FIGURE 5 |
| similar/high/h1/1mid | 39 | REBIND 39 | STEM_EDIT 19, FIGURE 4, ANSWER 10, SOLUTION 6 |
| similar/high/h1/2final | 28 | REBIND 28 | SOLUTION 4, FIGURE 9, ANSWER 11, STEM_EDIT 4 |
| similar/high/h1/2mid | 55 | REBIND 55 | ANSWER 47, SOLUTION 4, FIGURE 4 |
| similar/high/h2/1mid | 23 | REBIND 23 | FIGURE 5, SOLUTION 15, ANSWER 2, STEM_EDIT 1 |
| similar/high/h2/2final | 18 | REBIND 18 | ANSWER 6, FIGURE 11, SOLUTION 1 |
| similar/high/h2/2mid | 24 | REBIND 24 | ANSWER 13, STEM_EDIT 4, FIGURE 4, SOLUTION 3 |
| similar/high/h3/1mid | 1 | REBIND 1 | SOLUTION 1 |
| similar/middle/m1/1final | 18 | REBIND 18 | FIGURE 18 |
| similar/middle/m1/1mid | 89 | BLOCK 45, REBIND 44 | REPLACED 45, SOLUTION 26, ANSWER 12, FIGURE 3, STEM_EDIT 3 |
| similar/middle/m1/2mid | 118 | REBIND 118 | FIGURE 104, ANSWER 2, STEM_EDIT 10, SOLUTION 2 |
| similar/middle/m3/1mid | 50 | REBIND 50 | ANSWER 33, STEM_EDIT 3, SOLUTION 11, FIGURE 3 |
| similar/middle/m3/2mid | 45 | REBIND 44, BLOCK 1 | FIGURE 41, STEM_EDIT 2, REPLACED 1, SOLUTION 1 |
| textbooks/동아출판_공통수학1/동아_공통수학1_경우의수와행렬_대단원평가_고1/동아_공통수학1_경우의수와행렬_대단원평가_고1.js | 4 | REBIND 2, REFUSE 2 | SOLUTION 2, UNKNOWN 2 |
| textbooks/동아출판_공통수학1/동아_공통수학1_행렬_중단원연습_고1/동아_공통수학1_행렬_중단원연습_고1.js | 1 | REFUSE 1 | UNKNOWN 1 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_Best1회_P42-45_20261022_유사50.js | 11 | REBIND 11 | SOLUTION 11 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_Best2회_P14-17_20261022_유사50.js | 7 | REBIND 7 | SOLUTION 7 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_교재완결_P158-160_20261023_유사50.js | 18 | REBIND 18 | SOLUTION 18 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P75-78_20261022_유사50.js | 5 | REBIND 5 | SOLUTION 5 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P78-81_20261022_유사50.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P82-85_20261022_유사50.js | 10 | REBIND 10 | SOLUTION 10 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P94-97_20261023_유사50.js | 5 | REBIND 5 | SOLUTION 5 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P98-101_20261023_유사50.js | 21 | REBIND 21 | SOLUTION 21 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_집합_P102-105_20261023_유사50.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_명제_P10-13_20261024_유사50.js | 4 | REBIND 4 | SOLUTION 4 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_명제_P14-17_20261024_유사50.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_명제_P18-21_20261024_유사50.js | 18 | REBIND 18 | SOLUTION 18 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_명제_P22-25_20261024_유사50.js | 4 | REBIND 4 | SOLUTION 4 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_명제_P26-29_20261025_유사50.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_실전2회_P62-65_20261022_유사50.js | 11 | REBIND 11 | SOLUTION 9, STEM_EDIT 2 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_실전모의4회_P152-155_20261023_유사50.js | 8 | REBIND 8 | SOLUTION 8 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_실전모의5회_P156-159_20261023_유사50.js | 14 | REBIND 14 | SOLUTION 14 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_원의방정식_BATCH04_20261022_유사50.js | 3 | REBIND 3 | SOLUTION 3 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_원의방정식_P50-53_20261022_유사50.js | 4 | REBIND 4 | SOLUTION 4 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_원의방정식_P54-57_20261022_유사50.js | 5 | REBIND 5 | SOLUTION 5 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_원의방정식_도형의이동_P26-29_20261022_유사50.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_유리함수_P89-92_20261031_유사50.js | 30 | REBIND 30 | SOLUTION 30 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P126-129_20261023_유사50.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P138-141_20261023_유사50.js | 9 | REBIND 9 | SOLUTION 9 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P142-145_20261023_유사50.js | 4 | REBIND 4 | SOLUTION 4 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P146-149_20261023_유사50.js | 6 | REBIND 6 | SOLUTION 6 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P30-33_20261025_유사50.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P34-37_20261025_유사50.js | 9 | REBIND 9 | SOLUTION 9 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_평면좌표_직선의방정식_P30-33_20261022_유사50.js | 17 | REBIND 17 | SOLUTION 17 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_학평기출_P66-70_20261022_유사50.js | 15 | REBIND 15 | SOLUTION 15 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P54-57_20261026_유사50.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P62-65_20261026_유사50.js | 11 | REBIND 11 | SOLUTION 11 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P66-69_20261026_유사50.js | 5 | REBIND 5 | SOLUTION 5 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_함수와그래프_P42-45_20261025_유사50.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_함수와그래프_P46-49_20261025_유사50.js | 4 | REBIND 4 | SOLUTION 4 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_함수와그래프_P50-53_20261025_유사50.js | 4 | REBIND 4 | SOLUTION 4 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_함수와그래프_P58-61_20261026_유사50.js | 4 | REBIND 4 | SOLUTION 4 |
| textbooks/비상교육_공통수학2/비상_공통수학2_원의방정식_중단원학습점검_고1.js | 3 | REBIND 3 | SOLUTION 3 |
| textbooks/비상교육_공통수학2/비상_공통수학2_집합과명제_대단원학습평가_고1.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/비상교육_기하/비상_기하_벡터_대단원학습평가_고2/비상_기하_벡터_대단원학습평가_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_기하/비상_기하_벡터_익힘책_고2/비상_기하_벡터_익힘책_고2.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/비상교육_기하/비상_기하_벡터의성분과내적_중단원학습점검_고2/비상_기하_벡터의성분과내적_중단원학습점검_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_기하/비상_기하_벡터의연산_중단원학습점검_고2/비상_기하_벡터의연산_중단원학습점검_고2.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/비상교육_기하/비상_기하_이차곡선_중단원학습점검_고2/비상_기하_이차곡선_중단원학습점검_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_기하/비상_기하_이차곡선의접선_중단원학습점검_고2/비상_기하_이차곡선의접선_중단원학습점검_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_미적분1/비상_미적분1_적분_대단원학습평가_고2/비상_미적분1_적분_대단원학습평가_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_미적분1/비상_미적분1_정적분의활용_중단원학습점검_고2/비상_미적분1_정적분의활용_중단원학습점검_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_확률과통계/비상_확률과통계_조건부확률_중단원학습점검_고2/비상_확률과통계_조건부확률_중단원학습점검_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_확률과통계/비상_확률과통계_통계_대단원학습평가_고2/비상_확률과통계_통계_대단원학습평가_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_확률과통계/비상_확률과통계_통계_익힘책_고2/비상_확률과통계_통계_익힘책_고2.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/비상교육_확률과통계/비상_확률과통계_통계적추정_중단원학습점검_고2/비상_확률과통계_통계적추정_중단원학습점검_고2.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/비상교육_확률과통계/비상_확률과통계_확률_대단원학습평가_고2/비상_확률과통계_확률_대단원학습평가_고2.js | 3 | REBIND 3 | SOLUTION 3 |
| textbooks/비상교육_확률과통계/비상_확률과통계_확률분포_중단원학습점검_고2/비상_확률과통계_확률분포_중단원학습점검_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| types/high/h1/여러가지방정식과부등식_고1_유형_모의고사.js | 1 | REBIND 1 | SOLUTION 1 |
| types/high/h2/25_제일고_1학기_중간_고2_심화.js | 10 | REBIND 10 | SOLUTION 9, STEM_EDIT 1 |
| types/high/h2/25_제일고_1학기_중간_고2_확률과통계_유형확인.js | 1 | REBIND 1 | FIGURE 1 |
| types/high/h2/비상_대수_사인코사인법칙_익힘책_고2_유형확인.js | 1 | REBIND 1 | SOLUTION 1 |
| types/high/h2/비상_대수_삼각함수_대단원_고2_유형확인.js | 1 | REBIND 1 | SOLUTION 1 |
| types/high/h2/비상_대수_삼각함수_중단원_고2_유형심화.js | 2 | REBIND 2 | SOLUTION 2 |
| types/high/h2/비상_대수_삼각함수_중단원_고2_유형확인.js | 3 | REBIND 3 | SOLUTION 3 |
| types/high/h2/비상_대수_지수로그_중단원_고2_유형확인.js | 1 | REBIND 1 | SOLUTION 1 |
| types/high/h2/비상_대수_지수로그함수_중단원_고2_유형심화.js | 1 | REBIND 1 | SOLUTION 1 |
| types/high/h2/비상_대수_지수로그함수_중단원_고2_유형확인.js | 1 | REBIND 1 | SOLUTION 1 |
| types/middle/m1/중1_1학기_정수와유리수.js | 1 | REBIND 1 | NOTATION 1 |
| types/middle/m1/중1_1학기_정수와유리수의덧셈과뺄셈.js | 2 | REBIND 1, BLOCK 1 | NOTATION 1, REPLACED 1 |
| types/middle/m1/중1_중간대비_3단원_문자와식.js | 1 | REBIND 1 | SOLUTION 1 |
| types/middle/m2/RPM_중2_2-1_유리수와순환소수_01_유리수와순환소수_중2.js | 1 | REBIND 1 | SOLUTION 1 |
| types/middle/m2/RPM_중2_2-2_부록_대표문제다시풀기_중2.js | 4 | REFUSE 4 | UNKNOWN 4 |

### pending 교집합 학년·학기별

| 경로 그룹 | 건수 | action | class |
|---|---:|---|---|
| original/high/h1/1final | 445 | REBIND 419, REFUSE 25, BLOCK 1 | SOLUTION 399, NOTATION 2, STEM_EDIT 13, UNKNOWN 25, FIGURE 3, REPLACED 1, ANSWER 2 |
| original/high/h1/1mid | 204 | REBIND 198, REFUSE 1, BLOCK 5 | SOLUTION 144, STEM_EDIT 38, UNKNOWN 1, ANSWER 9, FIGURE 7, REPLACED 5 |
| original/high/h1/2final | 121 | REBIND 121 | SOLUTION 108, FIGURE 7, STEM_EDIT 3, ANSWER 3 |
| original/high/h1/2mid | 541 | REBIND 519, REFUSE 22 | SOLUTION 487, UNKNOWN 22, ANSWER 14, FIGURE 14, STEM_EDIT 4 |
| original/high/h2/1final | 181 | REBIND 164, REFUSE 17 | SOLUTION 142, FIGURE 10, UNKNOWN 17, STEM_EDIT 11, ANSWER 1 |
| original/high/h2/1mid | 296 | REBIND 255, REFUSE 40, BLOCK 1 | SOLUTION 211, UNKNOWN 40, STEM_EDIT 23, FIGURE 16, ANSWER 4, REPLACED 1, NOTATION 1 |
| original/high/h2/2final | 238 | REBIND 227, REFUSE 11 | SOLUTION 207, STEM_EDIT 17, UNKNOWN 11, FIGURE 2, ANSWER 1 |
| original/high/h2/2mid | 161 | REBIND 160, REFUSE 1 | SOLUTION 156, STEM_EDIT 3, FIGURE 1, UNKNOWN 1 |
| original/high/h3/1mid | 1 | REBIND 1 | SOLUTION 1 |
| original/middle/m1/1mid | 5 | REBIND 5 | SOLUTION 5 |
| original/middle/m1/2final | 224 | REBIND 220, REFUSE 4 | SOLUTION 206, FIGURE 7, UNKNOWN 4, STEM_EDIT 6, ANSWER 1 |
| original/middle/m1/2mid | 333 | REBIND 333 | SOLUTION 255, FIGURE 53, STEM_EDIT 8, NOTATION 15, ANSWER 2 |
| original/middle/m2/1final | 306 | REBIND 301, REFUSE 5 | SOLUTION 240, STEM_EDIT 19, FIGURE 32, ANSWER 10, UNKNOWN 5 |
| original/middle/m2/1mid | 194 | REBIND 183, BLOCK 5, REFUSE 6 | SOLUTION 134, FIGURE 18, REPLACED 5, STEM_EDIT 20, UNKNOWN 6, ANSWER 10, NOTATION 1 |
| original/middle/m2/2final | 444 | REBIND 442, BLOCK 2 | SOLUTION 252, FIGURE 93, ANSWER 84, STEM_EDIT 13, REPLACED 2 |
| original/middle/m2/2mid | 593 | REBIND 592, REFUSE 1 | SOLUTION 501, ANSWER 11, STEM_EDIT 37, FIGURE 43, UNKNOWN 1 |
| original/middle/m3/1final | 278 | REBIND 278 | SOLUTION 124, STEM_EDIT 31, FIGURE 122, ANSWER 1 |
| original/middle/m3/1mid | 405 | REBIND 396, BLOCK 9 | SOLUTION 269, FIGURE 79, STEM_EDIT 31, ANSWER 17, REPLACED 9 |
| original/middle/m3/2final | 589 | REBIND 584, BLOCK 2, REFUSE 3 | SOLUTION 420, ANSWER 35, STEM_EDIT 100, FIGURE 29, REPLACED 2, UNKNOWN 3 |
| original/middle/m3/2mid | 441 | REBIND 440, REFUSE 1 | SOLUTION 337, FIGURE 97, ANSWER 2, STEM_EDIT 4, UNKNOWN 1 |
| similar/high/h1/1final | 21 | REBIND 21 | ANSWER 13, SOLUTION 3, FIGURE 5 |
| similar/high/h1/1mid | 10 | REBIND 10 | FIGURE 4, SOLUTION 6 |
| similar/high/h1/2final | 10 | REBIND 10 | FIGURE 9, ANSWER 1 |
| similar/high/h1/2mid | 10 | REBIND 10 | ANSWER 2, SOLUTION 4, FIGURE 4 |
| similar/high/h2/1mid | 21 | REBIND 21 | FIGURE 5, SOLUTION 15, STEM_EDIT 1 |
| similar/high/h2/2final | 12 | REBIND 12 | FIGURE 11, SOLUTION 1 |
| similar/high/h2/2mid | 17 | REBIND 17 | ANSWER 6, STEM_EDIT 4, FIGURE 4, SOLUTION 3 |
| similar/high/h3/1mid | 1 | REBIND 1 | SOLUTION 1 |
| similar/middle/m1/1final | 18 | REBIND 18 | FIGURE 18 |
| similar/middle/m1/1mid | 6 | REBIND 6 | SOLUTION 1, FIGURE 3, STEM_EDIT 2 |
| similar/middle/m1/2mid | 115 | REBIND 115 | FIGURE 104, ANSWER 1, STEM_EDIT 8, SOLUTION 2 |
| similar/middle/m3/1mid | 20 | REBIND 20 | STEM_EDIT 3, SOLUTION 11, FIGURE 3, ANSWER 3 |
| similar/middle/m3/2mid | 45 | REBIND 44, BLOCK 1 | FIGURE 41, STEM_EDIT 2, REPLACED 1, SOLUTION 1 |
| textbooks/동아출판_공통수학1/동아_공통수학1_경우의수와행렬_대단원평가_고1/동아_공통수학1_경우의수와행렬_대단원평가_고1.js | 2 | REFUSE 2 | UNKNOWN 2 |
| textbooks/동아출판_공통수학1/동아_공통수학1_행렬_중단원연습_고1/동아_공통수학1_행렬_중단원연습_고1.js | 1 | REFUSE 1 | UNKNOWN 1 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_Best1회_P42-45_20261022_유사50.js | 11 | REBIND 11 | SOLUTION 11 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_Best2회_P14-17_20261022_유사50.js | 7 | REBIND 7 | SOLUTION 7 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_교재완결_P158-160_20261023_유사50.js | 18 | REBIND 18 | SOLUTION 18 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P75-78_20261022_유사50.js | 5 | REBIND 5 | SOLUTION 5 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P78-81_20261022_유사50.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P82-85_20261022_유사50.js | 10 | REBIND 10 | SOLUTION 10 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P94-97_20261023_유사50.js | 5 | REBIND 5 | SOLUTION 5 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_P98-101_20261023_유사50.js | 21 | REBIND 21 | SOLUTION 21 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_도형의이동_집합_P102-105_20261023_유사50.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_명제_P10-13_20261024_유사50.js | 4 | REBIND 4 | SOLUTION 4 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_명제_P14-17_20261024_유사50.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_명제_P18-21_20261024_유사50.js | 18 | REBIND 18 | SOLUTION 18 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_명제_P22-25_20261024_유사50.js | 4 | REBIND 4 | SOLUTION 4 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_명제_P26-29_20261025_유사50.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_실전2회_P62-65_20261022_유사50.js | 11 | REBIND 11 | SOLUTION 9, STEM_EDIT 2 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_실전모의4회_P152-155_20261023_유사50.js | 8 | REBIND 8 | SOLUTION 8 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_실전모의5회_P156-159_20261023_유사50.js | 14 | REBIND 14 | SOLUTION 14 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_원의방정식_BATCH04_20261022_유사50.js | 3 | REBIND 3 | SOLUTION 3 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_원의방정식_P50-53_20261022_유사50.js | 4 | REBIND 4 | SOLUTION 4 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_원의방정식_P54-57_20261022_유사50.js | 5 | REBIND 5 | SOLUTION 5 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_원의방정식_도형의이동_P26-29_20261022_유사50.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_유리함수_P89-92_20261031_유사50.js | 30 | REBIND 30 | SOLUTION 30 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P126-129_20261023_유사50.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P138-141_20261023_유사50.js | 9 | REBIND 9 | SOLUTION 9 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P142-145_20261023_유사50.js | 4 | REBIND 4 | SOLUTION 4 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P146-149_20261023_유사50.js | 6 | REBIND 6 | SOLUTION 6 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P30-33_20261025_유사50.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_집합과명제_P34-37_20261025_유사50.js | 9 | REBIND 9 | SOLUTION 9 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_평면좌표_직선의방정식_P30-33_20261022_유사50.js | 17 | REBIND 17 | SOLUTION 17 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_학평기출_P66-70_20261022_유사50.js | 15 | REBIND 15 | SOLUTION 15 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P54-57_20261026_유사50.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P62-65_20261026_유사50.js | 11 | REBIND 11 | SOLUTION 11 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P66-69_20261026_유사50.js | 5 | REBIND 5 | SOLUTION 5 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_함수와그래프_P42-45_20261025_유사50.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_함수와그래프_P46-49_20261025_유사50.js | 4 | REBIND 4 | SOLUTION 4 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_함수와그래프_P50-53_20261025_유사50.js | 4 | REBIND 4 | SOLUTION 4 |
| textbooks/백발백중_공통수학2/백발백중_공통수학2_함수와그래프_P58-61_20261026_유사50.js | 4 | REBIND 4 | SOLUTION 4 |
| textbooks/비상교육_공통수학2/비상_공통수학2_원의방정식_중단원학습점검_고1.js | 3 | REBIND 3 | SOLUTION 3 |
| textbooks/비상교육_공통수학2/비상_공통수학2_집합과명제_대단원학습평가_고1.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/비상교육_기하/비상_기하_벡터_대단원학습평가_고2/비상_기하_벡터_대단원학습평가_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_기하/비상_기하_벡터_익힘책_고2/비상_기하_벡터_익힘책_고2.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/비상교육_기하/비상_기하_벡터의성분과내적_중단원학습점검_고2/비상_기하_벡터의성분과내적_중단원학습점검_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_기하/비상_기하_벡터의연산_중단원학습점검_고2/비상_기하_벡터의연산_중단원학습점검_고2.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/비상교육_기하/비상_기하_이차곡선_중단원학습점검_고2/비상_기하_이차곡선_중단원학습점검_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_기하/비상_기하_이차곡선의접선_중단원학습점검_고2/비상_기하_이차곡선의접선_중단원학습점검_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_미적분1/비상_미적분1_적분_대단원학습평가_고2/비상_미적분1_적분_대단원학습평가_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_미적분1/비상_미적분1_정적분의활용_중단원학습점검_고2/비상_미적분1_정적분의활용_중단원학습점검_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_확률과통계/비상_확률과통계_조건부확률_중단원학습점검_고2/비상_확률과통계_조건부확률_중단원학습점검_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_확률과통계/비상_확률과통계_통계_대단원학습평가_고2/비상_확률과통계_통계_대단원학습평가_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| textbooks/비상교육_확률과통계/비상_확률과통계_통계_익힘책_고2/비상_확률과통계_통계_익힘책_고2.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/비상교육_확률과통계/비상_확률과통계_통계적추정_중단원학습점검_고2/비상_확률과통계_통계적추정_중단원학습점검_고2.js | 2 | REBIND 2 | SOLUTION 2 |
| textbooks/비상교육_확률과통계/비상_확률과통계_확률_대단원학습평가_고2/비상_확률과통계_확률_대단원학습평가_고2.js | 3 | REBIND 3 | SOLUTION 3 |
| textbooks/비상교육_확률과통계/비상_확률과통계_확률분포_중단원학습점검_고2/비상_확률과통계_확률분포_중단원학습점검_고2.js | 1 | REBIND 1 | SOLUTION 1 |
| types/high/h1/여러가지방정식과부등식_고1_유형_모의고사.js | 1 | REBIND 1 | SOLUTION 1 |
| types/high/h2/25_제일고_1학기_중간_고2_심화.js | 10 | REBIND 10 | SOLUTION 9, STEM_EDIT 1 |
| types/high/h2/25_제일고_1학기_중간_고2_확률과통계_유형확인.js | 1 | REBIND 1 | FIGURE 1 |
| types/high/h2/비상_대수_사인코사인법칙_익힘책_고2_유형확인.js | 1 | REBIND 1 | SOLUTION 1 |
| types/high/h2/비상_대수_삼각함수_대단원_고2_유형확인.js | 1 | REBIND 1 | SOLUTION 1 |
| types/high/h2/비상_대수_삼각함수_중단원_고2_유형심화.js | 2 | REBIND 2 | SOLUTION 2 |
| types/high/h2/비상_대수_삼각함수_중단원_고2_유형확인.js | 3 | REBIND 3 | SOLUTION 3 |
| types/high/h2/비상_대수_지수로그_중단원_고2_유형확인.js | 1 | REBIND 1 | SOLUTION 1 |
| types/high/h2/비상_대수_지수로그함수_중단원_고2_유형심화.js | 1 | REBIND 1 | SOLUTION 1 |
| types/high/h2/비상_대수_지수로그함수_중단원_고2_유형확인.js | 1 | REBIND 1 | SOLUTION 1 |
| types/middle/m1/중1_중간대비_3단원_문자와식.js | 1 | REBIND 1 | SOLUTION 1 |
| types/middle/m2/RPM_중2_2-1_유리수와순환소수_01_유리수와순환소수_중2.js | 1 | REBIND 1 | SOLUTION 1 |
| types/middle/m2/RPM_중2_2-2_부록_대표문제다시풀기_중2.js | 4 | REFUSE 4 | UNKNOWN 4 |

### pending 표본 10개

판정 다양성을 우선하여 결정적으로 선정. 검증 거부 시 blob 없는 것은 판본을 확정하지 않았다는 뜻.

1. UID `qid_v1_00060be875e8dbf407e4950a45202e5f031974d44868133a21e20d9a523d0732`, `original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js#6`
   - REBIND / SOLUTION, reason=`SOLUTION`; priorBlob=`4fec5194ff42312bb636090cabed9f22c2cae9d9`.
   - changed=`{"stemText":false,"choicesText":false,"answer":false,"solutionText":true,"figure":false,"notationOnly":false}`; tags=`{"sourceDrift":{"class":"SOLUTION","at":"2026-11-16T21:21:40+09:00","priorBlob":"4fec5194ff42312bb636090cabed9f22c2cae9d9","otherChangedKeys":["boundaryStatus","conditionKeys","course","curriculum","decisiveStep","difficultyBoundaryFlag","difficultyBucket","difficultyConfidence","evidenceRefs","legacyLevelCompatibility","nullReason","primaryMethod","projectionReason","projectionStatus","questionType","rpmL3","rpmL4","rpmPrimaryPath","rpmPrimaryRecordId","rpmSemanticStatus","semanticConfidence","semanticScopeRelation","semanticSourceScope","tags"]},"reviewPending":["method","other"]}`; lastReasons=`[]`.
2. UID `qid_v1_000c592420f83a522564482a66077802ce16993e774c504239dc37f0bd526b41`, `similar/middle/m3/2mid/25_금당중_2학기_중간_중3_유사.js#12`
   - REBIND / FIGURE, reason=`FIGURE`; priorBlob=`b92b590839d3bac113d4a104d96dc80aaebd61b5`.
   - changed=`{"stemText":false,"choicesText":false,"answer":false,"solutionText":false,"figure":true,"notationOnly":false}`; tags=`{"sourceDrift":{"class":"FIGURE","at":"2026-11-16T21:21:40+09:00","priorBlob":"b92b590839d3bac113d4a104d96dc80aaebd61b5","figure":true}}`; lastReasons=`[]`.
3. UID `qid_v1_001c4c4c79c9eb18f41f339472ed5bba3d04a5da415a18a600ef605b178369c2`, `original/middle/m2/2mid/19_연향중_2학기_중간_중2_수학.js#17`
   - REBIND / ANSWER, reason=`ANSWER`; priorBlob=`05d5035af246fd440a32682a1fbd0bd00c4f1ee1`.
   - changed=`{"stemText":false,"choicesText":false,"answer":true,"solutionText":true,"figure":false,"notationOnly":false}`; tags=`{"sourceDrift":{"class":"ANSWER","at":"2026-11-16T21:21:40+09:00","priorBlob":"05d5035af246fd440a32682a1fbd0bd00c4f1ee1","otherChangedKeys":["conceptClusterKey","conditionKeys","crossConceptKeys","curriculumCode","decisiveStep","difficultyBoundaryFlag","difficultyBucket","difficultyConfidence","integrationPattern","legacyLevelCompatibility","primaryMethod","problemTypeKey","rpmL1","rpmL2","rpmL3","rpmL4","rpmPrimaryPath","standardCourse","standardUnit","standardUnitKey","standardUnitOrder","subUnit","subUnitKey","templateKey"]},"reviewPending":["method","answer","other"]}`; lastReasons=`[]`.
4. UID `qid_v1_009a25cbc59099eb9ade039d7cd4c1f3bc5d087c25a7d5db1f52ce73be3b1f08`, `original/high/h2/1mid/19_강남여고_1학기_중간_고2_수학I.js#11`
   - REFUSE / UNKNOWN, reason=`SOURCE_UID_CONFLICT`; priorBlob=`없음`.
   - changed=`{}`; tags=`{}`; lastReasons=`["SOURCE_UID_CONFLICT"]`.
5. UID `qid_v1_00d7608da16757167232941229aaed77b646c13060f98206586d0500ff4bb15c`, `original/middle/m3/1final/17_연향중_1학기_기말_중3_수학.js#10`
   - REBIND / STEM_EDIT, reason=`STEM_EDIT`; priorBlob=`fb3d90690a85c2ff4b3db8f182d2f4d7a10193bb`.
   - changed=`{"stemText":true,"choicesText":false,"answer":false,"solutionText":false,"figure":false,"notationOnly":false}`; tags=`{"sourceDrift":{"class":"STEM_EDIT","at":"2026-11-16T21:21:40+09:00","priorBlob":"fb3d90690a85c2ff4b3db8f182d2f4d7a10193bb"},"reviewPending":["stem"]}`; lastReasons=`[]`.
6. UID `qid_v1_00eff70fddb6b50065215f7f452cd5c150cd8c519160938a8eea6aede48ecdaa`, `original/high/h1/1final/25_매산고_1학기_기말_고1_기출c.js#3`
   - REBIND / NOTATION, reason=`NOTATION`; priorBlob=`81d76aae203c4765929766e2dcab0e6de49f24ad`.
   - changed=`{"stemText":false,"choicesText":false,"answer":false,"solutionText":false,"figure":false,"notationOnly":true}`; tags=`{"sourceDrift":{"class":"NOTATION","at":"2026-11-16T21:21:40+09:00","priorBlob":"81d76aae203c4765929766e2dcab0e6de49f24ad","otherChangedKeys":["subUnit"]},"reviewPending":["other"]}`; lastReasons=`["IDENTITY_SOURCE_FINGERPRINT_MISMATCH"]`.
7. UID `qid_v1_00fd0fd3e73fc633e532acd27a7106ee61a5fd9ee01629b772db67f8dcbbc88f`, `original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js#21`
   - REFUSE / UNKNOWN, reason=`IDENTITY_SOURCE_FINGERPRINT_CONFLICT`; priorBlob=`없음`.
   - changed=`{}`; tags=`{}`; lastReasons=`["IDENTITY_SOURCE_FINGERPRINT_MISMATCH"]`.
8. UID `qid_v1_01481c30bb40f142b153bb07a1860bfbe465b732a9fe8861849db3ad4faf3db7`, `original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js#19`
   - REFUSE / UNKNOWN, reason=`NUMBER_MISMATCH`; priorBlob=`없음`.
   - changed=`{}`; tags=`{}`; lastReasons=`["SOURCE_ORDINAL_CHANGED"]`.
9. UID `qid_v1_0ddffbe735f5032c40509da507a17887ba3147db967272332d29b711c383ad00`, `original/middle/m2/1mid/26_동산중_1학기_중간_중2_기출.js#21`
   - BLOCK / REPLACED, reason=`REPLACED`; priorBlob=`207f5007134f17ba49c26ad51af590d0981921b8`.
   - changed=`{"stemText":true,"choicesText":true,"answer":false,"solutionText":true,"figure":false,"notationOnly":false}`; tags=`{"sourceDrift":{"class":"REPLACED","at":"2026-11-16T21:21:40+09:00","priorBlob":"207f5007134f17ba49c26ad51af590d0981921b8","otherChangedKeys":["sharedMaterial","tags"],"metadataExcluded":true},"reviewPending":["method","stem","other","reclassification"]}`; lastReasons=`[]`.
10. UID `qid_v1_8599eef554e954c99d2f8419dd0bfa76be96099c7eb6f2207330439a00d2084c`, `original/middle/m2/1final/25_왕운중_1학기_기말_중2_수학.js#8`
   - REFUSE / UNKNOWN, reason=`PRIOR_SOURCE_UID_CONFLICT`; priorBlob=`없음`.
   - changed=`{}`; tags=`{}`; lastReasons=`[]`.

첫 cold-cache 실행은 454.654초였으며 partial clone의 6,460개 누락 역사 blob hydration이 포함되었다. 위 최종 수치는 guard 보강 뒤 warm-cache CLI 실행(193.812초)의 결과다. `selectedByCurrentRegistrar`는 현재 선택 집합이며 maxQuestionsPerRun=100의 한 배치 적용 건수를 뜻하지 않는다. 쓰기는 전혀 하지 않았다.


## 6. 검증과 후속

- 신규 순수 plan/history 및 기존 source-delta: 32/32 PASS.
- 신규 integration + 기존 main-meta batch replay/main-auto-parent retry: 46/46 PASS.
- source-delta/history/순수 plan + 기존 main-merge-meta/basic-scope-rebind/reviewed-exam-registration-v2 직접 회귀: 1,160/1,160 PASS, 140.811초. 위 집합은 일부 중복하므로 합산하지 않는다.
- 별도 외부 fixture에서 기준 main 모듈을 직접 로드하여 OFF의 mismatch/APPLY 두 경로 전체 반환 JSON과 생성된 모든 저장소 파일 bytes 비교: 2/2 PASS. 테스트 기대를 새 구현에서 생성해 서로 비교한 것이 아니다.
- 독립 검토 직접 실행 41/41 PASS, `git diff --check` PASS.
- 원격 feature commit의 parent가 기준 main이고 변경 9파일이 시험한 바이트와 일치함을 확인.

독립 코드 검토에서 발견한 bounded queue starvation, old UID 충돌, source 번호, authority hold, report 플래그 누락과 core verify 문제를 수정하고 회귀로 고정했다. 전체 suite/원격 CI/브라우저/카탈로그 생성/4칸 생성/운영 적용은 NOT_RUN. 기존 봉인 문서, crosswalk seal, 4칸 사전, 기존 receipt, 실제 metadata 데이터는 바꾸지 않았다.

운영 ON 전에 별도 후속 작업이 필요하다: catalog/UI가 sourceDrift 및 REPLACED 제외를 실제로 읽도록 연결, runtime/부모 링크의 fingerprint 연속성 증명, 4칸 payload continuity와 검토 대기 표시, 공식 파생 재생성 및 학생 화면 스모크. 현재 소비자들은 새 필드를 직접 참조하지 않아 알 수 없는 필드 자체로 오류를 내지 않지만, 이 사실은 REPLACED 화면 차단 완료나 소비자 parity PASS가 아니다. 특히 catalog의 기존 fallback 경로가 옛 값을 노출할 수 있어 이 작업만 병합하여 스위치를 켜면 안 된다.

