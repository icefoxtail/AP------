# HIGH1 Direct Tagging Mother Closure Checkpoint

체크포인트 날짜: 2026-09-17 (Asia/Seoul)

브랜치: `codex/metadata-foundation-h1`

목적: 사용자가 브랜치를 별도로 검수할 수 있도록 HIGH1 direct tagging의 현재 저장 artifact와 Mother adjudication closure 상태를 기록한다.

## 현재 범위

- source file: 113개 HIGH1 JS
- 전체 source 문항: 2,498개
- curriculum cohort: 2015 1,588개 / 2022 910개
- A packet coverage: 2,498/2,498
- B packet coverage: 2,498/2,498
- A/B semantic 완전 일치: 221개
- A/B semantic 불일치: 2,277개

## Mother closure

현재 Mother ledger/pick 기준으로 A/B 불일치 2,277건을 전부 덮었다.

| Mother decision | 문항 수 |
|---|---:|
| A 채택 | 1,669 |
| B 채택 | 589 |
| HOLD | 19 |
| 합계 | 2,277 |

추가로 A/B가 semantic-normalized 기준으로 완전히 같은 221건은 공통 packet 값으로 자동 final candidate에 포함할 수 있는 상태다. Mother ledger의 고유 recordIndex는 2,279건이며, 이는 2,277개 disagreement decision과 기존 exact-match `AB_EQUAL` 기록을 포함한 수치다.

현재 미판정 disagreement: 0건.

## 저장 artifact

이 체크포인트 커밋에는 별도 검수를 위해 다음 artifact를 추적한다.

- `archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/source_manifest.json`
- `archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/mother-diff-manifest.json`
- `archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/b-packet-validation.json`
- `archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/a-full/`
- `archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/a-full-repair/`
- `archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/b-full/`
- `archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/b-full-repair/`
- `archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/mother/`
- direct-tagging manifest/compare/validation/gate scripts under `archive/tools/intelligence/`

## 보존 및 비변경 원칙

- A/B packet은 source를 직접 읽은 독립 결과로 보존한다.
- 기존 classifier/full-rebuild/staging은 diagnostic baseline으로만 유지한다.
- source JS와 source image는 수정하지 않았다.
- production metadata 반영은 하지 않았다.
- Mother decision ledger는 기존 기록을 수정하지 않고 새 ledger/pick 파일을 추가하는 방식으로 닫았다.
- `HOLD`, `AMBIGUOUS_PRIMARY`, `EVIDENCE_INSUFFICIENT`, `FOUNDATION_DEFECT_CANDIDATE`, `SOURCE_DEFECT_CANDIDATE`, `CONFLICT`는 Direct로 뭉개지 않고 상태를 보존한다.

## 별도 검수 시 확인할 것

1. source manifest 2,498건과 A/B packet identity가 1:1인지 확인한다.
2. `mother-diff-manifest.json`의 disagreement 2,277건이 Mother ledger/pick에 모두 존재하는지 확인한다.
3. Mother A/B/HOLD 합계가 1,669+589+19=2,277인지 확인한다.
4. B의 repair packet에서 `UNKNOWN`, `FOUNDATION_DEFECT_CANDIDATE`, curriculum/taxonomy drift가 의도적으로 남아 있는지 확인한다.
5. source JS/image와 production metadata가 이 checkpoint commit에서 변경되지 않았는지 확인한다.
6. 이 체크포인트는 Mother ledger closure 상태이며, production promotion을 의미하지 않는다. 최종 candidate merge와 production apply는 별도 fail-closed gate를 통과해야 한다.

