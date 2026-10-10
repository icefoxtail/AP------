# JS Archive 2.0 — GPT Campaign / Generation Contract v1

status: CURRENT / GPT 2.0 GENERATION AUTHORITY
currentCampaignId: H1_GPT2_20261006
qualityContractVersion: JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006

## 1. 목적과 적용 상태

GPT 예약 2.0의 시험지 대상 배정과 generation identity를 고정한다. 현재 generation은 H1_GPT2_20261006이다. 이전 H1 pilot Library와 PASS는 HISTORY로 보존한다.

문서상 간소화 정책은 `JS_Archive_2.0_GPT_Scheduled_Execution_v1.md`에 정의한다. consumer/예약 지시 갱신과 예약 1건의 처음부터 최종 검사·게시까지 실증한 뒤 적용 담당자가 전환을 선언할 때부터 실행한다. 그 전까지 현 consumer의 기존 Library 경로·PASS/evidence 상태 규칙이 유효하며 진행 중 작업은 보존한다.

## 2. Generation Library와 시험지 기록

현재 generation root는 `Archive2-GPT/generations/H1_GPT2_20261006/`이다. 대상별 고정 stream namespace는 유지한다.

**전환 전:** 현 consumer와 예약이 사용하는 stage별 경로·artifact/evidence/PASS 체계를 따른다. 문서 준비만으로 이를 제거하지 않는다.

**전환 후:** 시험지별 Library에 작업본 하나와 append-only 누적 검수기록 하나를 둔다. stage별 복사본·폴더 이관 대신 작업본을 같은 위치에서 갱신하고, Library revision history 또는 불변 revision으로 검수 당시 실제 바이트를 보존한다. 누적 기록의 각 항목은 stage, 실행자, 시각, input/final SHA-256, 범위와 결과를 식별한다. revision 바이트를 보존할 수 없다면 덮어쓰지 말고 새 revision을 만든다. 단계별 PASS receipt/seal 대신 단계 판단을 누적하고, 최종 기술검사·게시에서만 validator/remote 증거를 남긴다.

이전 generation의 증거는 삭제·덮어쓰기·새 완료로 소급 승계하지 않는다.

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

A/B/C의 CREATE → R1 → R2 → R3 → 최종 기술검사·게시 역할과 시험지별 고정 배정은 유지한다. 한 시험지는 한 시점에 한 단계·한 작성자/실행자만 처리한다. 앞선 실행이 끝났는지 불확실하면 중복 시작하지 말고 상태를 확인한다. 다음 단계는 누적 기록이 지정한 정확한 revision을 이어받는다.

각 worker는 자기 frozen stream만 처리하며 다른 stream에서 가져오기, 재배정, 배정 변경을 하지 않는다. 진행 중 시험지를 전환만으로 재시작하지 않는다.

## 6. Generation identity

전환 후 Library 작업본과 누적 검수기록은 `executionLine=GPT_SCHEDULED`, `campaignId`, `stream`, `examUid`, `qualityContractVersion`을 유지한다. 각 검수 기록은 `stage`, 실행자, input/final revision SHA를 결속한다. campaignId 또는 stream이 다르면 현재 대상 작업으로 소비하지 않는다.

전환 전에는 기존 consumer가 요구하는 stage artifact/evidence identity를 따른다.

## 7. 이전 pilot 및 기존 증거

기존 pilot·PASS·FAIL·검수 evidence는 삭제하거나 덮어쓰지 않고 HISTORY로 보존한다. 증거를 새 완료로 복사·승격하지 않는다. 새 generation은 고유 namespace와 현재 manifest identity를 따른다. 기존 진행 작업은 적용 전환을 이유로 재시작하거나 기록을 소급 변경하지 않는다.

## 8. Reservation transition

아래는 기존 배정을 바꾸는 gate가 아니다. 15개 consumer/예약은 현재 적용 상태이며 문서 변경만으로 재구성하거나 켜고 끄지 않는다. 적용 담당자는 consumer와 예약 지시를 새 §2/§5/§6 정책에 맞게 최소 갱신하고, 예약 실행 한 건을 CREATE부터 최종 기술검사·게시까지 실증한 뒤 새 정책으로 전환한다. 실증 전에는 구 consumer 지시가 유효하다. 현재 작업/기존 증거는 보존한다.

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

## 10. Machine identity gate

전환 전 consumer의 validator/state/continuation/MAIN_DONE receipt는 `executionLine=GPT_SCHEDULED`, `campaignId=H1_GPT2_20261006`, manifest-fixed stream을 함께 가진다. 세 값 중 하나라도 누락/불일치하면 current generation artifact로 인정하지 않는다.

전환 후 같은 identity는 Library 작업본·누적 검수기록에 결속하며 각 stage review SHA를 구별한다. 단계별 validator/state/PASS receipt는 만들지 않는다. 최종 기술검사·게시의 결과에만 해당 technical receipt와 remote reference를 기록한다.
