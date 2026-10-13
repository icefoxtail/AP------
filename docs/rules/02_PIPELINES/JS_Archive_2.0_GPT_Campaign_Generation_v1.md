# JS Archive 2.0 — GPT Campaign / Generation Contract v1

status: CURRENT COMMON GENERATION POLICY / campaign identities remain manifest-specific
currentCampaignId: H1_GPT2_20261006
qualityContractVersion: JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006

## 1. 목적과 적용 범위

이 문서는 모든 GPT 제작·검수 예약 campaign의 공통 처리 절차와 generation identity 규칙을 정의한다. 각 campaign의 campaignId, frozen manifest, stream roster/data, source authority 및 기존 검수결과는 기존 정본 그대로 유지한다. 현재 H1 generation은 `H1_GPT2_20261006`이며 그 H1 manifest·배정 및 역사 기록을 바꾸지 않는다. M3를 포함한 다른 campaign도 각자 기존 ID와 manifest를 계속 사용한다. 과거 H1 pilot Library와 PASS는 HISTORY로 보존한다.

Library 단계 처리와 R3 완료 패킷·실제 검사결과 기록, 별도 Work/Codex 일괄 출고는 `JS_Archive_2.0_GPT_Scheduled_Execution_v1.md`를 따른다. 문서 수정과 실제 예약 prompt/consumer/validator 변경은 별개이며, 문서 편집만으로 runtime 변경·검증을 주장하지 않는다. 구 consumer의 과거 유효 상태를 이유로 중간 Git 쓰기나 복사를 handoff 관문으로 재도입하지 않는다.
## 2. Generation Library와 시험지 기록

각 campaign의 기존 generation root와 stream namespace를 유지한다. 시험지별 전체 Library 패킷(작업본, 원본·필요 시각 자산, 관계 자료, 누적 검수기록)을 두고 CREATE → R1 → R2 → R3를 수행한다. 패킷 수납만으로 품질 PASS를 부여하지 않는다.

모든 패킷 파일은 Library file ID+version/revision으로 식별한다. 제공자에게 revision이 없을 때에는 `revisionUnavailable=true`를 표시하고 정확한 실바이트 SHA-256으로 검수본을 식별한다. 불가피한 snapshot은 ID/revision 또는 실바이트 해시로 구별할 수 없을 때만 보존한다. 누적 기록에는 campaignId, stream, examUid, stage, 실행자/검수자, 시각, input/output file ID·revision 또는 SHA-256, 검토범위, 발견·수정·잔여항목, 다음 수신 단계와 입력본을 기록한다. 각 단계 예약은 Library에서 직전 단계가 완료한 최신 패킷을 직접 조회한다. UID와 file ID·revision 또는 실바이트 SHA-256으로 해당 단계에서 이미 처리한 패킷과 다른 작업자가 진행 중인 패킷을 제외한 뒤 이어간다. 기존 누적기록과 동시수정 보호를 그대로 사용하며 수동 인계 호출을 추가하지 않는다. Git은 원본 자산을 읽어 패킷에 보충할 수 있지만 중간 Git 쓰기는 필요하지 않다.

수학적 정확성, 의미 기반 Meta, 해설 완결성, Visual 필요성·정확성, 독립검수는 각각 검토근거를 보존한다. 완료되지 않은 축은 `NOT_RUN`, 미해결 항목은 미해결로 남기며 소급 PASS를 금지한다. 기존 동일 campaign의 유효 evidence는 원본을 보존해 링크로 승계하고 다음 미완료 단계부터 잇는다. 다른 generation 증거는 승계하지 않는다.

R3가 실제로 끝나면 예약은 출고 대상 production JS·이미지·SVG의 정확한 Library identity, 실제 검사 결과와 잔여항목을 기록하고 완료 패킷을 Library에 누적한다. 별도 Work/Codex 출고 담당이 완료 패킷을 모아 production JS·이미지·SVG만 일괄 push하고 main에 병합한다. GPT 예약은 Git에 직접 쓰지 않으며 중간 단계 handoff는 Git 저장·운영경로 복사·branch/commit/PR·Git writer lease를 요구하지 않는다.
## 3. Campaign manifest

frozen campaign manifest의 **정본은 Git** `archive/data/gpt-campaigns/H1_GPT2_20261006.json`이다. Library에는 manifest를 복제하지 않아도 된다. worker는 latest main의 이 파일만 partition authority로 읽는다.

필수 schema 예:

{
  "campaignId": "H1_GPT2_20261006",
  "qualityContractVersion": "JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006",
  "partitionStatus": "FROZEN",
  "inventoryDenominator": 44,
  "sourceAuthority": "<frozen branch + commit authority>",
  "streams": {
    "A": [],
    "B": [],
    "C": []
  }
}

각 stream 배열 항목은 최소 examUid와 sourceRef를 가진다.

현재 manifest는 실제 source authority branch `codex/source-only-h1-1mid-2019-2024-except-gangnam-20261005@b152d00f8c1daa7ba7f926565fc51d8aa10fc4d3`에서 original H1 1mid 2019~2024를 전수 추출한 44건으로 FROZEN이다. A=15 / B=15 / C=14, duplicate=0, unassigned=0이다.

## 4. Partition HARD

- 모든 examUid는 A/B/C 중 정확히 하나에만 배정
- duplicate = 0
- unassigned = 0
- streams.A + streams.B + streams.C 총합 = inventoryDenominator
- partitionStatus=FROZEN 이후 worker가 배정 수정 금지
- stream 간 work stealing 금지
- stream 간 overflow 금지
- MASTER도 자기 stream만 처리

배정 순서는 activation 전에 latest-year-first inventory를 기준으로 고정한다.
부하 균형을 위해 A/B/C에 분산할 수 있으나, 일단 frozen이면 실행 중 재배치하지 않는다.

## 5. Stream과 시험지 소유권

A/B/C의 CREATE → R1 → R2 → R3 역할과 시험지별 고정 배정은 유지한다. 별도 Work/Codex 출고 담당은 해당 roster의 시험지별 실행자가 아니라 Library 완료 패킷을 모으는 일괄 출고 역할이다. 한 시험지는 한 시점에 한 단계·한 작성자/실행자만 처리한다. 각 단계 예약은 Library에서 직전 단계 완료본 중 최신 패킷을 직접 조회하고, 정확한 file ID+revision 또는 실바이트 SHA-256을 확인해 이어간다. UID와 기존 누적기록으로 자기 단계에서 이미 처리했거나 다른 실행자가 진행 중인 항목을 제외한다. 별도 수동 인계 호출은 없다.

각 worker는 자기 frozen stream만 처리하며 다른 stream에서 가져오기, 재배정, 배정 변경을 하지 않는다. 각 단계 예약은 Library 조회에서 이미 처리했거나 다른 실행자가 진행 중인 패킷을 제외하고 기존 동시수정 보호를 재사용한다. 진행 중 시험지를 정책 변경만으로 재시작하지 않는다.

## 6. Generation identity

각 Library 패킷과 누적 검수기록은 해당 frozen manifest의 `executionLine=GPT_SCHEDULED`, 실제 `campaignId`, `stream`, `examUid`, `qualityContractVersion`에 결속한다. H1은 `H1_GPT2_20261006`을 유지하며 M3 등 기존 campaign도 각자의 ID/manifest를 유지한다. campaignId나 stream이 다르면 해당 대상의 작업으로 소비하지 않는다.

각 stage 기록은 입력·출력 Library file ID+revision, revision이 없을 때 실바이트 SHA-256, 실행자, 판단·수정·잔여항목과 다음 단계 역할을 식별한다. 다음 예약 단계는 Library에서 직전 단계 완료의 최신 패킷을 직접 조회하고 UID와 file ID·revision 또는 해시로 대상 입력을 확인해 이어간다. 자기 단계에서 이미 처리했거나 다른 실행자가 진행 중인 패킷은 기존 누적기록·동시수정 보호에 따라 제외한다. 별도 수동 인계 호출은 없다. 단계별 validator/state/PASS receipt를 요구하지 않는다. 실제 미실행은 `NOT_RUN`으로 남긴다. R3 reservation은 실제 검수·검사 결과와 출고 후보 identity를 Library에 기록하며, 별도 Work/Codex 출고 담당은 일괄 Git 출고·원격 확인 결과를 기록한다.
## 7. 이전 pilot 및 기존 증거

다른 generation의 pilot·PASS·FAIL·검수 evidence는 삭제하거나 덮어쓰지 않고 HISTORY로 보존하며 current campaign 완료로 승계하지 않는다. current campaign에서 검수본과 수정범위가 유효한 완료 기록은 링크로 승계해 다음 미완료 단계부터 진행한다. 새 generation은 고유 namespace와 현재 manifest identity를 따른다. 진행 중/완료 작업은 전환을 이유로 재시작하거나 기록을 소급 변경하지 않는다.

## 8. Reservation execution policy

이 절은 campaign roster나 예약을 재생성·ON/OFF하는 전환 관문이 아니다. 기존 예약과 campaign identity·roster/data는 그대로 유지한다. 모든 GPT 예약 작업은 전체 Library 패킷에서 CREATE → R1 → R2 → R3를 수행하고, R3 완료본·출고 대상 identity·실제 검사 결과를 Library에 누적한다. 별도 Work/Codex 출고 담당이 production JS·이미지·SVG만 모아 일괄 Git 출고한다. GPT 예약은 직접 Git에 쓰지 않는다. 구 consumer 지시의 “전환 전” 문구는 중간 Git 쓰기, 운영경로 복사, branch/commit/PR 또는 Git writer lease를 단계 간 의무로 만들지 않는다.

실제 예약 prompt/consumer/validator의 변경 여부는 문서 계약과 별도로 기록한다. 이 문서 정비는 그 runtime 요소가 수정·검증되었다는 뜻이 아니다. 기존 완료 evidence는 그대로 두고 유효한 다음 미완료 단계부터 이어간다. 이미 끝난 검수는 반복하지 않는다.
## 9. Activation gate

기존 campaign roster/예약을 새로 생성하거나 ON할 경우에만:
1. generation root 존재
2. Git `archive/data/gpt-campaigns/H1_GPT2_20261006.json` 존재
3. campaignId 정확
4. partitionStatus=FROZEN
5. denominator 확정
6. A/B/C assignment 합계=denominator
7. duplicate=0
8. unassigned=0
9. 15개 prompt에 STREAM 고정
10. old pilot automation OFF 유지

이 gate가 닫힌 뒤에만 예약 생성/가동으로 넘어간다.

## 10. Machine identity

각 Library 패킷과 누적 검수기록은 해당 frozen manifest의 `executionLine=GPT_SCHEDULED`, 실제 `campaignId`, `stream`, `examUid`, `qualityContractVersion`에 결속한다. H1은 `H1_GPT2_20261006`을 유지하며 M3 등 기존 campaign도 각자의 ID/manifest를 유지한다. campaignId나 stream이 다르면 해당 대상의 작업으로 소비하지 않는다.

각 stage 기록은 입력·출력 Library file ID+revision, revision이 없을 때 실바이트 SHA-256, 실행자, 판단·수정·잔여항목과 다음 단계 역할을 식별한다. 다음 예약 단계는 Library에서 직전 단계 완료의 최신 패킷을 직접 조회해 입력으로 가져간다. 단계별 validator/state/PASS receipt를 요구하지 않는다. 실제 미실행은 `NOT_RUN`으로 남긴다. R3 reservation은 실제 검수·검사 결과와 출고 후보 identity를 Library에 기록하며, 별도 Work/Codex 출고 담당은 일괄 Git 출고·원격 확인 결과를 기록한다.
