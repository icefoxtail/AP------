# H2 MathII Limit Foundation — transfer / merge prep

- transferred result: ChatGPT direct rebuild of **104 limit questions**
- target branch: `codex/metadata-foundation-h2-math2-continuity`
- branch base: current `main` `8269189d9b121459da62278e5c506d874a74562e`
- denominator parity: **104/104 PASS**
- primary hierarchy: **L3 3 / assigned L4 paths 16**
- template candidates: **18**
- source JS mutation: **0**
- canonical master mutation in this transfer: **0**
- production metadata mutation in this transfer: **0**

## Canonical hierarchy candidate

### L3 `함수의 극한`
- 좌극한·우극한 — 3
- 극한값 계산 — 16
- 극한 존재 판정 — 5
- 합성·변환함수 — 6
- 그래프 해석 — 8
- 도형 활용 — 4

### L3 `극한의 성질`
- 대수적 계산 — 4
- 미정계수 — 11
- 명제 판정·반례 — 6
- 대소 관계·조임정리 — 10
- 다항함수 결정 — 12
- 영점·중복도 활용 — 5

### L3 `무한대에서의 극한`
- 다항·유리함수 — 5
- 무리식 — 1
- 점근관계 — 4
- 도형 활용 — 4
- 기존 canonical `그래프 해석` leaf는 삭제하지 않고 미사용 상태로 유지

## Boundary decision

`23_팔마고_2학기_중간_고2_수학II.js#9`은 극한 scope에 유지한다.
primary는 `극한의 성질 > 미정계수`, 미분계수는 secondary concept candidate다.

## Difficulty gate

작업 중 legacy `level`이 이미 노출되었으므로 LOCKED difficulty rule의 strict blind-first-pass 완료를 주장하지 않는다.
기존 작업 후보 분포는 `1:16 / 2:31 / 3:32 / 4:23 / 5:2`로 보존하되,
**문항별 canonical difficulty export는 fresh blind recheck 전까지 차단**한다.

## Merge-prep state

이 커밋은 극한 결과를 연속 브랜치에 실어 함께 검토/병합할 수 있게 만드는 transfer다.
아직 `CANONICAL_MASTER.json`, source JS, production metadata는 수정하지 않는다.
