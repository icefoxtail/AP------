# Taxonomy Schema v2 — v0.3 audit integrated

## Primary hierarchy
- Curriculum
- Grade/Course
- Semester (middle school only)
- L1 `majorUnit`
- L2 `midUnit`
- L3 `concept`
- L4 `problemType`

## Orthogonal tags
- difficultyBucket
- secondaryConceptKeys
- skillTags
- representationTags
- templateKey

## Taxonomy status
- `RPM_VERIFIED`: RPM 공개 목차에서 L1/L2 확인
- `CANONICAL_DRAFT`: L3/L4 수학적 정규화 초안
- `HOLD`: 정본 확정 전 근거/경계 확인 필요
- `LOCKED`: 사람 검수와 migration gate까지 통과한 production authority

## Curriculum applicability
각 L3/L4에는 taxonomy 존재 여부와 별도로 다음을 둘 수 있다.
- `curriculumApplicability`
- `defaultSelectable`

상세 규칙은 `CURRICULUM_APPLICABILITY_POLICY.md`를 따른다.

## Primary-path rule
문항은 primary L1→L4 경로를 하나만 갖는다.
복합 개념은 `secondaryConceptKeys`로 추가한다.

## Canonical identity scope
canonical identity는 **한글 label 전역값이 아니라 전체 경로**다.

`curriculum + level + scope/course + L1 + L2 + L3 + L4`

따라서 같은 수학 아이디어/같은 표시명이 서로 다른 교육과정 또는 과목에서 다시 등장하는 것은 허용된다.
예: 공통수학의 기초 경우의 수와 확률과통계의 확장 순열은 같은 label 일부를 공유할 수 있다.

금지되는 것은 같은 scope 안에서 같은 역할/전략의 primary path가 불필요하게 이중화되는 경우다.

## 기존 필드와의 관계
현재 repo의 `standardUnitKey/subUnitKey` 깊이는 중등/고등에서 일관되지 않으므로 새 L1/L2와 직접 동일시하지 않는다.
migration map을 통해 호환한다.
