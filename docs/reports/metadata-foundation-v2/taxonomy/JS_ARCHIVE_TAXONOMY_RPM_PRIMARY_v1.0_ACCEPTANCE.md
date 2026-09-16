# JS Archive RPM Primary Taxonomy v1.0 Acceptance

검수일: 2026-09-16  
대상 proposal: `docs/proposals/metadata-foundation-v2/taxonomy/rpm-primary-v0.3/`  
canonical package: `docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/`

## 판정

**PASS — bounded acceptance 완료**

v0.3에 새 taxonomy 이론을 추가하지 않고, v0.2 독립 전수검수 45건의
disposition과 실제 master 반영을 대조했다. P0/P1 blocker는 0건이다.

| 항목 | 결과 |
|---|---:|
| v0.2 독립검수 disposition coverage | 45/45 |
| ACCEPT | 35 |
| MODIFIED | 7 |
| REJECT | 3 |
| P0 | 0 |
| P1 | 0 |

독립검수 원문은 `06_AUDIT/JS_ARCHIVE_TAXONOMY_CANONICAL_RPM_PRIMARY_v0.2_독립전수검수보고서.docx`에서 읽었고, adjudication은
`06_AUDIT/AUDIT_ADJUDICATION_45.md`에서 다시 확인했다.

## Cardinality와 parity

| Gate | 결과 |
|---|---|
| JSON cardinality | L1 90 / L2 221 / L3 678 / L4 1400 |
| JSON ↔ L2 CSV | PASS — 221 rows, full-path multiset exact |
| JSON ↔ L4 CSV | PASS — 1400 rows, full-path multiset exact |
| 26개 교육과정 Markdown | PASS — L1 90 / L2 221 / L3 678 / L4 1400 |
| full-path duplicate | PASS — 0 |
| Pilot ↔ master | PASS — 2015 M3-2 원의 성질 branch 14 L4 exact |
| v0.3 MANIFEST ↔ 실제 파일 | PASS — 47/47 bytes·SHA exact |

Markdown의 applicability 표시는 view annotation으로 제거한 뒤 canonical
path를 비교했으며, annotation이 붙은 4개 extended L4도 master와 exact
match한다.

## 필수 정책 확인

- `역삼각형 기본` 잔존: 0
- representation-only `표·나무그림` L4 잔존: 0
- 2022 중3-1 L2 `제곱근과 그 실수`: 유지
- `RPM_EXTENDED_CANDIDATE`: 5개 node entry 모두 `defaultSelectable=false`
  (L3 1개, L4 4개)
- 교육과정 밖이라는 이유만으로 taxonomy를 DELETE하지 않음
- `productionMigrationAllowed=false`
- production migration: 아직 시작하지 않음

이번 acceptance에서 수행하지 않은 일:

- 이름 선호에 따른 추가 RENAME
- 새로운 L3/L4 추가
- 전수 taxonomy 재설계
- 다른 출판사 taxonomy 혼합
- production exam JS, `question_metadata.json`, `question-meta.js`,
  `js_archive_tag_master.json` 수정

## 봉인 상태

`TAXONOMY_AUTHORITY = LOCKED`

운영용 정본은 canonical package의
`00_POLICY/CANONICAL_MASTER.json`이며, proposal v0.3과 독립검수 자료는
삭제하지 않고 보존한다. canonical package의 자체 파일 무결성은
`MANIFEST.json`으로 봉인했다.

다음 단계는 실제 현재 repo 코드에 근거한 Metadata Contract v2 작성이다.
