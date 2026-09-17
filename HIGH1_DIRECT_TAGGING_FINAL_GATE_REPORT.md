# HIGH1 Direct Tagging Final-Gate Report

생성일: 2026-09-17 (Asia/Seoul)

범위: HIGH1 direct tagging 전체 source manifest 2,498문항 / 113개 JS source file

상태: **Mother disagreement closure와 canonical/applicability candidate gate는 완료되었고, production promotion만 별도 승인 대기 상태**

이 보고서는 현재 branch에 저장된 source manifest, A/B frozen packet, B validation, Mother ledger/pick, 그리고 final candidate merge artifact를 기준으로 작성했다. 최종 후보를 만들기 위해 source JS, source image, canonical master, production metadata를 수정하지 않았다. 이 보고서는 최종 metadata를 production에 반영했다는 뜻이 아니며, 별도 검수를 위한 branch checkpoint다.

## 1. 제출 checkpoint

- branch: `codex/metadata-foundation-h1`
- 직전 pushed checkpoint: `07c341e5f06dba820c1811848c8b97c6475d0728`
- 직전 checkpoint report: `HIGH1_DIRECT_TAGGING_MOTHER_CLOSURE_CHECKPOINT.md`
- 이번 report와 final-candidate merge script/artifact는 이 branch의 다음 commit에 포함한다.

## 2. 전체 closure 수치

| 항목 | 수치 |
|---|---:|
| 전체 대상 문항 | 2,498 |
| A 완료 | 2,498 |
| B 완료 | 2,498 |
| A/B 둘 다 완료 | 2,498 |
| A/B 정규화 완전 일치 | 221 (8.85%) |
| A/B 정규화 불일치 | 2,277 (91.15%) |
| Mother가 최종 선택/판정한 불일치 | 2,277 (100.00%) |
| Mother 미판정 불일치 | 0 |

Mother decision 분포는 다음과 같다.

| Mother decision | 문항 수 |
|---|---:|
| A 채택 | 1,670 |
| B 채택 | 588 |
| HOLD | 19 |
| 합계 (불일치 2,277) | 2,277 |

정확히 일치한 221건 중 2건은 기존 `AB_EQUAL` ledger record로 보존되었고, 219건은 `AB_EQUAL_AUTO`로 final candidate에 닫혔다. 따라서 final candidate의 전체 decision count는 `A 1,670 / B 588 / HOLD 19 / AB_EQUAL 2 / AB_EQUAL_AUTO 219`다.

## 3. A/B field disagreement

아래 값은 문항별 중복 집계가 허용되는 field-level count다.

| 불일치 field | 문항 수 |
|---|---:|
| canonical L1~L4 | 1,594 |
| primaryConcept | 1,950 |
| secondaryConceptKeys | 1,133 |
| difficultyBucket | 886 |
| status | 797 |

추가적인 저장값 기반 사유 유형은 다음과 같다. 분류는 서로 겹칠 수 있다.

| 유형 | 문항 수 | 기준 |
|---|---:|---|
| difficulty만 다름 | 80 | `differingFields`가 `difficultyBucket` 하나 |
| L4만 다름 | 26 | canonical L1~L3는 같고 L4만 다름 |
| primary taxonomy field가 다름 | 1,950 | `primaryConcept` disagreement 포함 |
| B UNKNOWN 운영 predicate | 687 | disagreement set 안에서 B의 unknown/null predicate |
| B canonical path disagreement | 1,594 | canonical field disagreement |
| A no-fit/defect vs B Direct | 224 | A defect/no-fit 계열, B `DIRECT_TAGGED` |
| A Direct vs B no-fit/defect | 526 | A `DIRECT_TAGGED`, B defect/no-fit/conflict 계열 |
| source/evidence 상태 포함 | 27 | A/B 중 HOLD, CONFLICT, EVIDENCE_INSUFFICIENT, SOURCE_DEFECT 계열 포함 |

## 4. B 독립 packet 품질 지표

아래 B 지표는 B packet을 `manifestUid`로 freeze한 뒤 raw field를 읽어 집계했다. `UNKNOWN`은 canonical L1~L4가 모두 unknown이거나 `primaryConcept`/`difficultyBucket`이 null 또는 unknown인 경우다. `generic/no-fit`은 이 predicate에 더해 explicit `CANONICAL_NO_FIT`, `FOUNDATION_DEFECT_CANDIDATE`, primary 부재, primary가 canonical L2/L3/L4 literal과 같은 경우를 합집합으로 센다.

| B 지표 | 문항 수 | 전체 대비 |
|---|---:|---:|
| B `UNKNOWN` | 688 | 27.54% |
| B `EVIDENCE_INSUFFICIENT` | 10 | 0.40% |
| B `HOLD` | 17 | 0.68% |
| B `CONFLICT` | 7 | 0.28% |
| B explicit `CANONICAL_NO_FIT` | 1 | 0.04% |
| B `FOUNDATION_DEFECT_CANDIDATE` | 713 | 28.54% |
| B generic/no-fit 운영 합집합 | 2,268 | 90.79% |
| B curriculumKey mismatch | 30 | 1.20% |
| A Direct인데 B generic/no-fit | 1,854 | 74.22% |
| A Direct인데 B UNKNOWN | 519 | 20.78% |
| Mother가 B canonical path를 채택한 불일치 | 388 | 불일치의 17.04% |

`B UNKNOWN`과 `generic/no-fit`은 B가 틀렸다고 자동 판정한 수가 아니다. packet에 저장된 상태와 literal field에 대한 운영상 위험범위다. 특히 B `FOUNDATION_DEFECT_CANDIDATE`는 source/question foundation 문제 후보를 뜻하므로 taxonomy 오판과 동일시하지 않는다.

## 5. Batch 구간별 요약

개별 문항의 batch, packet 파일, A/B 값, Mother ledger file은 `mother-final-candidate.json`의 각 record에 보존되어 있다. 아래는 그 record를 batch filename 기준으로 재집계한 구간 요약이다.

| batch 구간 | 문항수 | A-B 일치 | 불일치 | B generic/no-fit | Mother A 채택 | Mother B 채택 | Mother 제3판정(HOLD) | 최종 HOLD·CONFLICT·EVIDENCE·AMBIGUOUS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 001–009 | 225 | 12 | 213 | 87 | 63 | 150 | 0 | 1 |
| 010–059 | 1,250 | 37 | 1,213 | 1,235 | 1,052 | 142 | 19 | 18 |
| 060–093 | 1,023 | 172 | 851 | 946 | 555 | 296 | 0 | 0 |
| 합계 | 2,498 | 221 | 2,277 | 2,268 | 1,670 | 588 | 19 | 19 |

이는 batch 구간별 저장 artifact 분포다. 이 표만으로 B의 원인이나 모델 품질을 추론하지 않았다.

## 6. Mother final candidate 상태

최종 후보 파일은 Mother가 선택한 packet의 semantic value를 보존하며, A/B raw packet path와 Mother ledger file을 함께 남긴다.

파일: `archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/mother-final-candidate.json`

| final status | 문항 수 |
|---|---:|
| `DIRECT_TAGGED` | 2,169 |
| `FOUNDATION_DEFECT_CANDIDATE` | 306 |
| `AMBIGUOUS_PRIMARY` | 1 |
| `EVIDENCE_INSUFFICIENT` | 13 |
| `CONFLICT` | 5 |
| `SOURCE_DEFECT_CANDIDATE` | 4 |
| 합계 | 2,498 |

Mother ledger closure 수치(`2,277/2,277`, unresolved `0`)와 final candidate record cardinality(`2,498`)가 닫혔다. 이후 Mother가 source·solution의 주된 풀이 원리를 다시 확인해 L1 completeness correction을 수행했고, canonical resolution도 raw path와 resolved path를 분리 보존한 상태로 2,498건 전체가 exact master match 또는 명시적 no-fit/unknown으로 닫혔다.

## 7. Canonical/applicability gate

final candidate의 L1~L4를 `docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json`의 exact hierarchy와 대조한 결과는 다음과 같다.

| canonical state | 문항 수 |
|---|---:|
| `CANONICAL_PATH_MATCH` | 2,193 |
| `EXPLICIT_NO_FIT_OR_UNKNOWN` | 305 |
| `CANONICAL_PATH_UNMATCHED` | 0 |

최종 merge script는 Mother-level canonical resolution을 수행한다. 기존 raw canonical을 임의로 버리지 않고 `final.canonicalRaw`로 보존한다. 전체 242건은 raw path와 resolved path가 달라졌으며, 그중 229건은 exact master path로, 13건은 L1~L3 primary를 복원한 partial/no-fit path로 정리했다. 현재 `EXPLICIT_NO_FIT_OR_UNKNOWN`은 305건이며, exact unmatched는 0건이다.

```json
{
  "unresolvedDisagreementCount": 0,
  "canonicalCounts": {
    "CANONICAL_PATH_MATCH": 2193,
    "EXPLICIT_NO_FIT_OR_UNKNOWN": 305,
    "CANONICAL_PATH_UNMATCHED": 0
  },
  "errorCount": 0,
  "readyForGate": true
}
```

canonical resolution이 적용된 대표 raw path 유형은 다음과 같다.

- `함수 | 무리함수 | 무리함수의 교점 | 무리함수의 교점` 22건 → `함수 | 무리함수 | 무리함수의 활용 | 무리함수의 교점`
- `함수 | 무리함수 | 무리함수의 정의역과 치역 | 그래프 위치` 17건 → `함수 | 무리함수 | 정의역과 치역 | 그래프 위치`
- `다항식 | 다항식의 나눗셈 | 나머지정리 | 고차식 조건` 16건 → `다항식 | 항등식과 나머지정리 | 나머지정리 | 고차식 조건`
- `다항식 | 다항식의 나눗셈 | 다항식의 나눗셈 | 몫과 나머지` 11건 → `다항식 | 다항식의 연산 | 다항식의 나눗셈 | 몫과 나머지`
- `함수 | 무리함수 | 무리함수의 정의역과 치역 | 정의역 조건` 8건 → `함수 | 무리함수 | 정의역과 치역 | 정의역 조건`
- `집합과 명제 | 명제 | 명제와 조건 | 명제 변환` 8건 → `집합과 명제 | 명제 | 역·이·대우 | 명제 변환`
- `경우의 수 | 순열과 조합 | 조합의 활용 | 선택 조건` 6건 → `경우의 수 | 조합 | 조합의 활용 | 선택 조건`
- `집합과 명제 | 명제 | 명제 변환 | 대우를 이용한 증명` 6건 → `집합과 명제 | 명제 | 역·이·대우 | 대우를 이용한 증명`

이 resolution은 기존 A/B packet을 재작성하지 않는다. 예를 들어 `무리함수의 교점`은 master의 `무리함수의 활용 → 무리함수의 교점`으로, `다항식의 나눗셈`/`나머지정리`는 master의 `항등식과 나머지정리 → 나머지정리`로 연결된다. exact leaf가 없는 대표 사례인 경로합 최솟값, solid-geometry sphere volume, 흡수법칙, 일부 절댓값·정수해 generic leaf는 다른 problemType으로 강제하지 않고 `EXPLICIT_NO_FIT_OR_UNKNOWN`으로 남겼다.

### L1 completeness correction

초기 candidate에서 L1이 `UNKNOWN` 또는 `CANONICAL_NO_FIT`으로 남았던 35건을 Mother가 source content, choices, answer, solution의 주된 풀이법 기준으로 다시 읽었다.

| 보정 결과 | 문항 수 |
|---|---:|
| exact master path로 복원 | 22 |
| L1~L3 primary를 복원하고 L4만 no-fit으로 보존 | 13 |
| 최종 candidate에서 master가 인식하는 L1 | 2,498 / 2,498 |
| L1 미인식 final record | 0 |

따라서 현재 no-fit은 L1 자체를 포기한 상태가 아니다. L1~L3를 결정할 수 있는 문항은 primary를 보존하고, source 결함·다중 primary·현재 master에 없는 L4만 별도 상태로 남긴다.

## 8. Gate 및 검증 결과

실행한 명령과 결과:

```text
node --test tests/metadata-foundation-gates.test.mjs \
  tests/metadata-foundation-h1-full-rebuild.test.mjs \
  tests/metadata-foundation-h1-pilot.test.mjs
28 passed, 0 failed

node archive/tools/intelligence/validate-h1-direct-b-packets.mjs
expectedCount=2498
validCoverageCount=2498
missingCount=0

node archive/tools/intelligence/merge-h1-direct-tagging-mother-final.mjs
expectedCount=2498
finalizedDisagreementCount=2277
unresolvedDisagreementCount=0
errorCount=0
readyForGate=true
```

B validator의 raw audit mismatch/duplicate count는 각각 48/57로 남아 있다. 이들은 이전 invalid/audit-only packet의 흔적이며, validator가 선택한 replacement packet의 valid coverage는 2,498/2,498이다. audit trail을 삭제하지 않았다.

`git diff --check`도 통과했다.

## 9. 원본·production 불변성 범위

이번 final candidate 단계에서 다음을 production에 반영하지 않았다.

- HIGH1 source JS payload
- HIGH1 source image/solution image
- canonical master
- production promotion of `mother-final-candidate.json`

final candidate는 `_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/` 아래의 검수 artifact로만 저장된다. canonical/applicability candidate gate는 닫혔지만, production metadata 반영은 별도 external inspection과 promotion 승인 뒤의 후속 gate로 남긴다.

## 10. 별도 검사자가 볼 핵심 지점

1. `source_manifest.json`의 2,498 source identity와 A/B packet의 1:1 coverage.
2. `mother-diff-manifest.json`의 2,277 disagreement과 `mother/` ledger/pick의 recordIndex closure.
3. `mother-final-candidate.json`의 각 record에서 source fingerprint, A packet, B packet, Mother ledger file, final value의 연결.
4. `final.canonicalRaw`와 `final.canonical`의 resolution reason이 source/Mother evidence에 부합하는지.
5. `readyForGate: true`가 production promotion 승인으로 오용되지 않았는지.

현재 branch는 Mother closure와 canonical/applicability candidate 검수용으로 제출 가능하지만, production promotion 승인 상태는 아니다.
