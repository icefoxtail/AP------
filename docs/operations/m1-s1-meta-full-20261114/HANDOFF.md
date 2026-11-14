# M1-S1-META-FULL · Codex 출고 전 인계

## 현재 결론

**12시험지·286 canonical UID 전부에 대해 분류·PT/TPL·보조 메타·학습 level·평가 difficultyBucket·4칸을 함께 검토했고, 시험지마다 commit/push와 원격 HEAD readback을 마쳤습니다.** 세 실제 작업자가 서로 다른 시험지를 맡았으며 root가 시험지당 3문항, 총 36문항을 독립 표본 확인했습니다. 이미지 63개는 원본 지문을 결속했고, 그중 기존 해설 SVG 13개도 별도 렌더·직접 열람했습니다.

**상태: `PAUSED_WITH_REMAINING / RESUME_READY`.** 전체 열람과 검토안 보존은 끝났지만 해설 근거·현재 판본 승인·정의/binding·일부 시각 및 범위 판단이 남아 있습니다. `REVIEW_COMPLETE_RELEASE_PENDING` 또는 전량 품질 PASS가 아닙니다. 미착수 0시험지, 미열람 0문항이며, 남은 것은 `REMAINING.md`와 `gap-index.json`에 결속했습니다.

현재 사용자의 지시에 따라 main 병합·공용 등록·배포는 모두 `NOT_RUN`입니다. 이 문서가 그 작업을 새로 허가하지 않습니다. 검토 브랜치를 통째로 main에 병합하지 말고, 남은 필수 근거와 승인 경로를 해결한 뒤 별도 명시적 실행 권한 범위에서 출고를 진행해야 합니다.

## 정확한 작업과 판본

- workKey: `M1-S1-META-FULL`
- taskId: `ef319e48-5efb-4d99-a4ac-5ded7ac1d74d`
- 이전 root owner: `GPT_ROOT_75DAEF2BA0F3` — writer `CLOSED`
- 브랜치: `review/m1-s1-meta-full-20261114`
- 최초 기준 main: `8c3b8fe05348d7235546d7d2d9ec063029d19e4d`
- 마지막 관측 main: `a5d7986a745fc1e6bd2f9cd8423c9d16fa45bc50`
- 진행표: `docs/operations/m1-s1-meta-full-20261114/progress.json`
- 시작 지시: https://app.notion.com/p/4180e68bd69f81a1820bd5aeddb464a4
- 재개 인덱스: https://app.notion.com/p/4180e68bd69f8185950ce1fc23821831

마지막 관측 main에서 원본 12개 source blob과 대상 286개의 shared metadata/identity 행, 적용 계약 및 registry 판본은 최초 기준과 같았습니다. 다른 작업의 main 변경은 이 브랜치에 병합하지 않았습니다. 재개 시 main이 더 바뀌었다면 대상 source·UID·registry·계약의 실제 드리프트를 새로 확인합니다. 최종 commit SHA는 자기 commit 안에 넣지 않고 push/readback 후 위 Notion과 AWCR에 기록합니다.

## 분모와 완료의 의미

| 항목 | 수 | 의미 |
| --- | ---: | --- |
| 대상 시험지 / canonical UID | 12 / 286 | 중1 1학기 원본 중간 8시험지·기말 4시험지 |
| 이번 신규 검토 | 286 | 기존 값은 대조하되 현행 판본 전체를 새로 읽음 |
| 과거 완전 판본 승인 그대로 재사용 | 0 | 이 값은 기존 정상 메타값을 전부 바꿨다는 뜻이 아님 |
| 미착수 / 미열람 | 0 / 0 | 검토 대상을 빠뜨리지 않음 |
| 독립 표본 | 36 | 작성자 외 root, 시험지당 3문항 |
| 기존 해설 있음 | 93 | 현재 QFULL 등록 지문 불일치 부채가 있음 |
| SOURCE_ONLY | 193 | 정답·해설 공란 보존, method 근거 미완 |
| 난이도 미판정 | 1 | 17매산 중간 14번의 그림 판독 불가 |
| 표준 범위 미확정 | 1 | 17삼산 중간 23번의 반복 배열 분류 |
| source 실제 수정 | 17 | 4시험지, 지원 메타 21필드만 변경 |
| 공용 등록 실행 / 등록 보류 | 0 / 286 | 보류에는 근거·정의 해결이 필요한 항목 포함 |
| 등록 준비 완료로 선언한 문항 | 0 | 전체 의미 PASS를 추정하지 않음 |

난이도 미판정, 범위 미확정, method 부채, 유형 공백은 서로 겹치는 속성입니다. 문항 수로 단순 합산하지 않습니다. 전량 286개의 method가 완결되었다고 보고하지 않습니다.

## 세 작업자와 시험지별 원격 보존

META_A는 5시험지 118문항, META_B는 4시험지 95문항, META_C는 3시험지 73문항을 실제 검토했습니다. 먼저 끝난 META_A에게 미착수였던 16연향을 넘겨 처리했습니다. 세 작업자의 파일 경로를 분리했고 root 한 명만 Git index·commit·push를 다뤘습니다. 모든 작업자의 쓰기는 종료했습니다.

| 시험지 | 문항 | 작성자 | 원본 근거 | 실제 수정 문항 | 시험지별 보존 commit |
| --- | ---: | --- | --- | ---: | --- |
| 23_동산중_1학기_중간_중1_기출 | 23 | META_A | 기존 해설 있음 | 11 | `eeab3bb2e07e` |
| 19_금당중_1학기_기말_중1_수학 | 24 | META_B | SOURCE_ONLY | 0 | `f18c282b4233` |
| 19_동산중_1학기_기말_중1_수학 | 25 | META_C | SOURCE_ONLY | 0 | `40f43100027e` |
| 19_연향중_1학기_기말_중1_수학 | 23 | META_A | SOURCE_ONLY | 0 | `4fabdeee184f` |
| 19_왕운중_1학기_기말_중1_수학 | 24 | META_B | SOURCE_ONLY | 0 | `0acdc0e650ce` |
| 19_연향중_1학기_중간_중1_기출 | 23 | META_C | 기존 해설 있음 | 2 | `66b6f3f06785` |
| 19_왕운중_1학기_중간_중1_기출 | 24 | META_A | 기존 해설 있음 | 3 | `7742a1c61b0b` |
| 19_팔마중_1학기_중간_중1_기출 | 23 | META_B | 기존 해설 있음 | 1 | `06cc662e24ff` |
| 17_금당중_1학기_중간_중1_수학 | 25 | META_C | SOURCE_ONLY | 0 | `805968cef649` |
| 17_매산중_1학기_중간_중1_수학 | 24 | META_A | SOURCE_ONLY | 0 | `ace250399a79` |
| 17_삼산중_1학기_중간_중1_수학 | 24 | META_B | SOURCE_ONLY | 0 | `8dad9aef44c7` |
| 16_연향중_1학기_중간_중1_수학 | 24 | META_A | SOURCE_ONLY | 0 | `e0ae0de9bc07` |

각 commit의 전체 SHA·부모·tree·원격 HEAD 재조회 시각과 방법은 `progress.json.remoteReceipts`에 있습니다. 이 표 이후의 최종 통합 commit은 저자 최종본, 교차 판정, 추가 solution QASSET, 인계 문서를 함께 보존합니다. 시험지별 중간 commit을 마지막 최종 상태로 오해하지 마세요.

## 실제 source 수정과 보류한 제안

| 시험지 | 문항 | 적용한 최소 변경 |
| --- | --- | --- |
| 23 동산 중간 | 2, 7 | bucket 2→1, legacy compatibility를 경계 허용으로 기록; 기존 level 보존 |
| 23 동산 중간 | 4 | 발문의 자연수 제한을 기존 ACTIVE Condition 키로 기록 |
| 23 동산 중간 | 6, 9, 10, 14, 16, 18 | 주유형 내부 단계 나열을 개념 결합으로 과대평가한 integration을 NONE으로 정정 |
| 23 동산 중간 | 21, 22 | 실제 후보/부호 분기를 CASE_BRANCH로 정정 |
| 19 왕운 중간 | 17, 18 | 단일 핵심 개념 적용의 integration을 NONE으로 정정 |
| 19 왕운 중간 | 24 | bucket 4→3, legacy compatibility 경계 기록; level 상·B34/medium 보존 |
| 19 연향 중간 | 16, 23 | 실제 분기를 CASE_BRANCH로 정정 |
| 19 팔마 중간 | 4 | bucket 3→2, boundary B34→B23 |

총 필드 변경은 difficultyBucket 4, legacyLevelCompatibility 3, Condition 1, Integration 12, difficultyBoundaryFlag 1로 21건입니다. PT/TPL·단원 후보, 그 밖의 confidence 조정, 새 학습 level 제안은 검토 패킷에 보존했습니다. 정의 또는 정확 binding이 해결되지 않은 후보를 운영 source에 확정하지 않았습니다.

`review.json.after`와 `sourcePatch`는 **작성자의 제안**입니다. 그것을 통째로 실행하면 안 됩니다. 실제 반영된 값과 차이는 각 항목의 `rootSourceDisposition.currentMetadata / appliedFieldDeltas`, 실제 Git source diff, `verification/final-verification.json.changedSourceItems`를 함께 확인하세요. SOURCE_ONLY source 8개는 변경하지 않았습니다. 기존 level 문자열도 전부 보존했습니다.

## 분류·PT/TPL·보조 메타

실제 발문·보기·기존 해설·그림의 결정적 단계를 근거로 주제, 보조 개념과 제한, Integration을 판정했습니다. 파일명이나 키 이름만으로 적합성을 승인하지 않았습니다. SOURCE_ONLY의 원본 교육과정은 근거가 없어 UNKNOWN으로 남겼고 2015·2022 RPM 경로는 비교 후보로 구별했습니다. 해설 있는 source의 2015 문맥은 실제 등록 근거를 따랐으며 원본 교육과정을 일괄 변경하지 않았습니다.

ACTIVE 후보 키 545회·고유 162개를 확인했고 키 상태·TPL 부모·단원/세부단원 부모 오류는 0건입니다. 정확 binding 문맥은 716회 검사하여 일치 340, 누락 155, 문맥 미확정 221로 구별했습니다. 45 UID의 과정명 차이 `중1 수학` / `中1 수학`은 공용 정본에서 해결할 사항입니다. 키/부모 기계검사의 성공은 의미 적합성을 증명하지 않습니다.

기존 정의가 특정 예제의 수치·방향·문항 형태로 지나치게 좁아 현재 문항에 그대로 쓰기 어려운 사례가 있습니다. `gap-index.json`은 기존 정의 재사용·범위 검토, binding/crosswalk 누락, 신규 PT/TPL 또는 확장 필요, RPM leaf 공백, 내용/근거 부채를 분리합니다. 신규 제안은 차이·후보 부모·지원 UID·근거를 보존하되 정식 등록 준비가 부족하면 `NOT_READY_FOR_REGISTRATION`로 남겼습니다. 미등록 키를 ACTIVE로 추가하지 않았습니다.


## 유형·근거 공백 집계

| 표시 범주 | 원문 항목 수 | 해당 고유 UID |
| --- | ---: | ---: |
| 기존 정의 재사용/정의범위검토 | 137 | 134 |
| binding/crosswalk 누락 | 103 | 98 |
| 신규 PT/TPL 또는 확장 제안 | 22 | 22 |
| RPM leaf 공백 | 41 | 41 |
| 내용·시각·해설근거 부채 | 311 | 239 |

원문 gaps 475건과 contentDebt 139건, 총 614개 기록을 집계했습니다. 원문 배열에 등장하는 UID는 284개이며, 정의·binding·leaf 관련 검토 항목의 합집합은 222 UID입니다. 여기에 모든 SOURCE_ONLY 193과 solved fingerprint93의 전역 근거 부채를 명시하여 전체286의 등록 보류 상태를 연결했습니다. 범주별 UID와 전역 부채는 서로 겹치므로 합산하지 않습니다.

신규·확장 표시 22건 중 PT/TPL 관련 명시 NEW_*는 18건, Condition은 3건, CrossConcept은 1건입니다. 이는 새 유형 22개가 확정되었다는 뜻이 아닙니다. 현재 22건 모두 정식 부모/정의 초안/등록 승인 등의 미비를 `NOT_READY_FOR_REGISTRATION`으로 기록했습니다. RPM 범주에는 원문 NOTE도 포함되므로 41개 전부가 leaf 부재 확정인 것은 아닙니다.

## 난이도와 주제 번호

학습 level과 5단계 difficultyBucket은 별도로 판단했습니다. 기존 level을 숫자로 자동 변환하거나 분포를 맞추지 않았습니다. 검토 제안 집계는 학습 level 하 116·중 157·상 12·UNKNOWN 1, bucket 1단계 78·2단계 160·3단계 43·4단계 4·5단계 0·UNKNOWN 1입니다. 이는 운영에 일괄 반영된 분포가 아닙니다.

시험지별 모든 주제의 문항 번호·개수는 `TOPICS.md`, 기계 판독 집계는 `topics.json`에 있습니다. 라벨이 없는 after는 이미 검토한 subUnitKey의 정본 labelKo를 표시용으로 조회했습니다. 17삼산 23번의 비교 후보와 17매산 14번의 시각 부채를 표에 별도로 표시했습니다.

## 필수 검사 결과와 한계

`verification/final-verification.json`의 상태는 `MECHANICAL_CHECKS_PASSED_WITH_DECLARED_SEMANTIC_DEBT`입니다.

- 12 source의 구문, 286 UID의 수·고유성·순서·source 결속, 공식 키/부모를 확인했습니다.
- 정답·해설·그림·레이아웃·UID·순서 등 보호 필드 변경 0, 기존 level 변경 0입니다.
- 4칸 사전·인용·판본 결속 286건, 인용 1,188개를 검사했습니다. 예상 밖 4칸 오류는 0입니다.
- 해설 있는 93건에는 공식 4칸 구조/인용 FAIL이 없지만, 19연향 7번의 방법 포괄 부채와 현행 판본 승인 부채는 남습니다.
- SOURCE_ONLY 193건은 공식 validator의 `empty method` FAIL 193개를 예상된 미완료로 기록했습니다. 발문 기반 전략을 해설 인용으로 위장하지 않았습니다.
- 이미지 63개의 QASSET SHA-256을 Git 원바이트에 대조했습니다. 읽을 수 없는 매산14 PNG도 지문만 확보했으며 내용을 판독했다고 하지 않았습니다.
- 추가 solution SVG 13개는 실제 렌더 열람 후 중대한 시각 모순 없음으로 기록했습니다. 독립 풀이 검증·새 VERIFIED_FINAL 판정은 아닙니다.
- 공식 ACTIVE registry 로더의 무결성 오류는 0입니다. 공식 Resolver 실행은 `NOT_RUN`이며 선행 솔루션 판본 검증을 우회하지 않았습니다.

SOURCE_ONLY 193건의 등록 QFULL은 일치하지만 구형 `question` 본문을 공식 `content` fingerprint가 담지 않으므로 보조 raw question hash·UID/순서/source blob 검사도 보존했습니다. 해설 있는 93건은 등록 지문과 현재 QFULL이 0/93 일치하므로 과거 VERIFIED_FINAL 재사용을 주장할 수 없습니다.

검사 재현은 저장소 root에서 다음 읽기 전용 명령으로 합니다. shared metadata나 inbox를 생성·등록하지 않습니다.

```bash
node docs/operations/m1-s1-meta-full-20261114/verify-checkpoint.cjs /tmp/m1-s1-checkpoint-verification.json
```

`verify-packet.cjs`는 공식 validator를 사용하여 각 패킷을 검사합니다. 이전 `source-change-cross-audit-summary.json`은 최종 판정 전 15문항 단계의 중간 관측이고, 최종 실제 수정 수는 **17문항**으로 `final-verification.json`을 따릅니다. 문서·보존만을 위해 전체 build/Chrome/Pages 검사를 반복하지 않았습니다.

## Codex가 이어받을 순서

1. Notion 라우터·시작/생명주기와 정확 workKey 재개 인덱스를 읽습니다. 이 taskId·owner·브랜치와 AWCR의 마지막 raw 검증 checkpoint를 대조하고 OFFERED→ACCEPTED 인수를 기록합니다. 새 task나 날짜별 브랜치를 만들지 않습니다.
2. 최신 원격 브랜치를 fetch하고 root `WORKER_CURRENT.md`, `progress.json`, 이 HANDOFF, `REMAINING.md`, `gap-index.json`, 최종 검증 증거를 읽습니다. 현재 final SHA는 Notion/AWCR과 실제 원격 ref로 확인하며 과거 SHA로 reset하지 않습니다.
3. 최신 main의 대상 source·UID·계약·registry 변경만 확인합니다. 이미 검토한 286문항의 불필요한 전체 재작업은 하지 않습니다.
4. 먼저 R02의 93문항 판본/승인 근거와 R01의 193문항 해설 근거를 해결할 수 있는 경로를 정합니다. 새 전수 풀이와 해설 작성은 이 인계의 권한이 아닙니다.
5. `gap-index.json`의 정의·binding·crosswalk·leaf를 정확 문맥으로 검토합니다. 45건 과정명 차이를 무시한 근사 binding 승인은 금지합니다. 별도 권한 없이는 공용 정본에 쓰지 않습니다.
6. 매산14·연향7·삼산23과 내용 확인 항목만 선택적으로 재개하여 새 근거를 결속합니다. 고친 판본에 필요한 인용·QASSET·표본·schema 검사를 수행하고 변경되지 않은 근거는 재사용합니다.
7. 실제 승인된 최소 source 변경과 등록 가능한 검토 패킷만 정리합니다. 모든 선행 조건과 별도 출고 권한을 확인한 후 해당 절차로 전달합니다. 현재 main 병합·공용 등록·배포 금지를 자동 해제하지 않습니다.
8. 진행표와 재개 인덱스의 자기 항목, immutable AWCR 다음 revision을 갱신하고 raw SHA/revision을 다시 확인합니다. 다음 작업자가 남은 항목만 이어갈 수 있게 기록합니다.

## 복사할 인계문

```text
M1-S1-META-FULL을 기존 작업에서 이어받아 출고 전 미완료를 처리해.
taskId: ef319e48-5efb-4d99-a4ac-5ded7ac1d74d
이전 owner: GPT_ROOT_75DAEF2BA0F3 (CLOSED / RESUME_READY)
저장소: icefoxtail/AP------
브랜치: review/m1-s1-meta-full-20261114
진행표: docs/operations/m1-s1-meta-full-20261114/progress.json
인계서: 같은 폴더 HANDOFF.md
Notion 재개 인덱스와 AWCR의 정확 task/revision/원격 HEAD를 실제 Git과 확인하고 인수를 기록해.
12시험지 286문항은 모두 읽었고 12회 시험지별 원격 보존, 36문항 독립 표본까지 되어 있어.
PAUSED_WITH_REMAINING이므로 REMAINING.md와 gap-index.json의 미완료만 이어가.
193 SOURCE_ONLY method 근거, solved93 현재 QFULL 승인 결속, 정의/binding/leaf 공백,
과정명 불일치45, 매산14 그림, 연향7 methodCoverage, 삼산23 범위와 contentDebt를 확인해.
review.json의 after/sourcePatch는 제안이고 실제 반영은 rootSourceDisposition과 Git diff를 따라.
새 브랜치·과거 SHA reset·전체 재풀이·해설 재작성·R1/R2/R3는 하지 마.
현재 사용자의 main 병합·공용 등록·배포 금지를 유지해. 별도 권한을 추정하지 마.
진행표/Notion 자기 행/AWCR immutable 다음 revision과 raw SHA를 갱신해.
```
