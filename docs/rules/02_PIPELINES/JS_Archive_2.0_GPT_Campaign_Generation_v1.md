# JS Archive 2.0 — GPT Campaign / Generation Contract v1

status: CURRENT / GPT 2.0 GENERATION AUTHORITY
currentCampaignId: H1_GPT2_20261006
qualityContractVersion: JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006

## 1. 목적

GPT 예약 2.0의 과거 PASS 재사용과 stream 혼합을 구조적으로 차단한다.

한 campaign은 독립 generation이다.
현재 generation은 H1_GPT2_20261006이다.

이전 H1 pilot Library와 PASS는 HISTORY로 보존하지만 현재 generation 상태 계산에는 사용하지 않는다.

## 2. Generation namespace

현재 root:

Archive2-GPT/generations/H1_GPT2_20261006/

이 root 밖의 artifact/evidence/PASS/continuation/MAIN_DONE은 현재 campaign authority가 아니다.

동일 examUid라도 과거 generation PASS는 새 generation PASS로 승계하지 않는다.
source bytes만 source authority에서 새 generation source/로 가져올 수 있다.

## 3. Campaign manifest

generation root에 campaign-manifest.json 하나를 둔다.

필수 schema 예:

{
  "campaignId": "H1_GPT2_20261006",
  "qualityContractVersion": "JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006",
  "partitionStatus": "FROZEN",
  "inventoryDenominator": 0,
  "sourceAuthority": "<current source authority>",
  "streams": {
    "A": [],
    "B": [],
    "C": []
  }
}

각 stream 배열 항목은 최소 examUid와 sourceRef를 가진다.

activation 전에 실제 inventory를 채우고 denominator와 정확히 맞춘다.

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

## 5. Stream conveyor

A:
CREATE-A → R1-A → R2-A → R3-A → MASTER-A

B:
CREATE-B → R1-B → R2-B → R3-B → MASTER-B

C:
CREATE-C → R1-C → R2-C → R3-C → MASTER-C

CREATE-A가 A1을 R1-A에 넘기면 CREATE-A는 A2를 시작한다.
R1-A는 A stream만 처리한다.
B/C도 동일하다.

다른 stream이 비어 있어도 가져오지 않는다.

## 6. Generation identity in artifacts

현재 generation의 stage artifact/evidence/PASS/continuation/MAIN_DONE은 최소:
- campaignId
- stream
- examUid
- stage
- qualityContractVersion
- inputArtifactSha
- finalArtifactSha
를 가진다.

campaignId 또는 stream이 다르면 current selector에서 무효다.

## 7. Old pilot handling

기존 pilot:
- 삭제 금지
- overwrite 금지
- HISTORY 보존
- 현재 generation으로 PASS/evidence copy 금지
- current generation selector에서 무시

새 generation을 시작할 때 old Library를 빈 것처럼 취급하는 것이 아니라, 아예 별도 namespace에서 새 Library를 생성한다.

## 8. Activation gate

15라인 생성/ON 전에:
1. generation root 존재
2. campaign-manifest 존재
3. campaignId 정확
4. partitionStatus=FROZEN
5. denominator 확정
6. A/B/C assignment 합계=denominator
7. duplicate=0
8. unassigned=0
9. 15개 prompt에 STREAM 고정
10. old pilot automation OFF 유지

이 gate가 닫힌 뒤에만 예약 생성/가동으로 넘어간다.
