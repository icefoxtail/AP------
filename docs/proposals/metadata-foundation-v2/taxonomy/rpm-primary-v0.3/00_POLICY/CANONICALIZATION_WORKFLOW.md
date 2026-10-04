# Canonicalization Workflow — v0.3

## A. taxonomy 봉인
1. RPM-primary L1/L2 확인
2. L3/L4 canonical draft
3. 독립 전수감사
4. 감사 adjudication
5. curriculum applicability 분리
6. JSON/CSV/Markdown/Pilot/Manifest parity 검증
7. `LOCKED` 승격 여부 결정

## B. Metadata Foundation v2
Taxonomy가 잠기면 실제 문항을 **대단원(L1) 단위**로 처리한다.
한 문항을 한 번 읽을 때:
- L1/L2/L3/L4
- difficultyBucket 1~5
- confidence/boundary
- secondary concept
을 함께 판정한다.

## C. 현행 출력
- 기본: `defaultSelectable=true`
- 확장/심화: `RPM_EXTENDED`를 명시적으로 포함
- `RPM_EXTENDED_CANDIDATE`: 자동출제 사용 금지

## D. production migration
정본문서와 Metadata Foundation 계약이 잠긴 뒤 source metadata → classification → builder → runtime 순으로 적용한다.
