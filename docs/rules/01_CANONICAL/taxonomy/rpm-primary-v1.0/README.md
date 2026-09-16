# JS아카이브 Taxonomy Canonical Pack — RPM Primary v1.0

이 package는 RPM Primary Taxonomy v0.3에 대한 bounded acceptance 결과를
정본 운용용으로 봉인한 것이다. 새로운 L3/L4 이론이나 production 문항
반영을 포함하지 않는다.

v0.2 독립 전수검수(221 L2 / 676 L3 / 1,399 L4 100% coverage)의 지적을 재검토하여 반영한 수정본이다.

## 감사 반영 원칙
독립 보고서를 100% 기계 수용하지 않았다.
- 35건: ACCEPT
- 7건: MODIFIED
- 3건: REJECT

핵심 차이는 **taxonomy 존재 여부와 현행 교육과정 기본 출력 여부를 분리**한 것이다.
교육과정에서 빠진 내용이라도 RPM/심화/실제 아카이브 유형으로 가치가 있으면 taxonomy에 보존하고 `defaultSelectable=false`로 관리한다.

## v0.3 acceptance 반영
- `CURRICULUM_APPLICABILITY_POLICY.md`
- `curriculumApplicability`, `defaultSelectable` 필드
- 감사 45건 adjudication 문서
- 평균값 정리 coverage 보강
- 과대통합/모호한 L4 다수 분리·개명
- representation-only L4 제거
- 원의 성질 Pilot ↔ master 동기화
- STATS/MANIFEST 재봉인

## 상태
- `TAXONOMY_AUTHORITY = LOCKED`
- `RPM_PRIMARY_TAXONOMY = v1.0`
- L1/L2: RPM primary
- L3/L4: 독립 전수감사 반영 canonical taxonomy
- production migration: 아직 금지
- 다음 단계: Metadata Contract v2 → 대단원 단위 문항 L1~L4 + difficultyBucket 동시 migration

## Package 범위

- 정본 master JSON 및 L2/L4 CSV
- RPM/교육과정 applicability/canonicalization 정책
- 2015/2022 26개 교육과정 Markdown view
- STATS 및 이 package의 파일 무결성을 기록하는 `MANIFEST.json`

독립검수 원문, adjudication, pilot, migration audit 자료는 proposal 쪽에
보존한다. production migration은 별도 단계에서 수행한다.
