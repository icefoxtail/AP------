# JS아카이브 Metadata Foundation v2

## 현재 구성

1. RPM Primary L1~L4 taxonomy
2. `difficultyBucket` 1~5 세분화
3. 향후 문항별 metadata 통합 재분류

## 현재 상태

- taxonomy = `v0.3 AUDIT_INTEGRATED` / LOCK 전
- difficulty = v1.3 `LOCKED` / 독립재검 30/30 PASS
- production migration = 시작 전

현재 편입 자료는 `JS_ARCHIVE_TAXONOMY_CANONICAL_RPM_PRIMARY_v0.3_AUDIT_INTEGRATED.zip`, `JS아카이브_Metadata_Foundation_v2_통합실행계획서_v1.0.md`, difficulty 운영규칙 v1.0/v1.1/v1.2/v1.3 및 ZIP 안의 독립전수검수보고서다. v1.0~v1.2 candidate는 보존하고 v1.3을 canonical LOCK했다. 요청된 `JS아카이브_difficultyBucket_5단계_도입_핸드오프_2026-09-16.md`는 2026-09-16 Downloads에서 확인되지 않아 대체 문서를 만들지 않았다.

## 중요한 원칙

현재 taxonomy proposal 문서는 production authority가 아니며 LOCK 전 상태다. difficulty v1.3은 DF-001~DF-005를 모두 통과하고 30/30 전수재검 PASS 후 `docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md`로 승격되었다. difficulty authority는 봉인되었지만 production migration은 아직 시작하지 않았다.

기존 `docs/rules/01_CANONICAL/`의 `JS아카이브_세부단원_운영규칙_v1.md`, `JS아카이브_표준단원키_마스터테이블.md`, `JS아카이브룰북_v2.6.md`, `프로젝트_컨텍스트.md`는 현재 기준으로 유지하며 삭제·교체하지 않는다. v2 자료는 이 문서들을 즉시 대체하지 않고, 표준단원키·세부단원·`difficultyBucket`과 겹칠 수 있는 제안/검토 자료로 취급한다. 충돌 여부는 LOCK 전 재검에서 판정한다.

## 예정 승격 위치

taxonomy 및 난이도 운영규칙이 각각 LOCK되면 `docs/rules/01_CANONICAL/` 하위의 적절한 taxonomy/metadata canonical 위치로 승격한다. 현재 difficulty authority는 v1.3 canonical 문서로 LOCK되었고, taxonomy v0.3은 계속 proposal/LOCK 전 상태로 유지한다.
