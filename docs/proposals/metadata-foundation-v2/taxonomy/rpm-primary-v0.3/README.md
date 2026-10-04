# JS아카이브 Taxonomy Canonical Pack — RPM Primary v0.3 Audit Integrated

v0.2 독립 전수검수(221 L2 / 676 L3 / 1,399 L4 100% coverage)의 지적을 재검토하여 반영한 수정본이다.

## 감사 반영 원칙
독립 보고서를 100% 기계 수용하지 않았다.
- 35건: ACCEPT
- 7건: MODIFIED
- 3건: REJECT

핵심 차이는 **taxonomy 존재 여부와 현행 교육과정 기본 출력 여부를 분리**한 것이다.
교육과정에서 빠진 내용이라도 RPM/심화/실제 아카이브 유형으로 가치가 있으면 taxonomy에 보존하고 `defaultSelectable=false`로 관리한다.

## v0.3 추가
- `CURRICULUM_APPLICABILITY_POLICY.md`
- `curriculumApplicability`, `defaultSelectable` 필드
- 감사 45건 adjudication 문서
- 평균값 정리 coverage 보강
- 과대통합/모호한 L4 다수 분리·개명
- representation-only L4 제거
- 원의 성질 Pilot ↔ master 동기화
- STATS/MANIFEST 재봉인

## 상태
- L1/L2: RPM primary
- L3/L4: 독립 전수감사 반영 canonical draft
- production migration: 아직 금지
- 다음 단계: Metadata Foundation v2 계획서 → 대단원 단위 문항 L1~L4 + difficultyBucket 동시 migration
