# JS 아카이브 분류기 세부단원 fallback 통합 계획 v1

상태: `운영 반영 완료 / rollback sidecar 보존 (2026-08-22)`

## 결론

세부단원 disposition은 분류기 내부의 단어 규칙에 섞지 않고, **raw classifier 뒤의 정책층**으로 통합한다.

- raw classifier: 문항 본문·해설에서 근거를 추출하고 후보 세부키를 계산한다.
- fallback policy: 승인되지 않았거나 충돌·보류된 세부키를 표준단원으로 되돌린다.
- downstream consumer: 정책층이 적용된 버전만 추천·검색·통계에 사용한다.
- source JS와 active master: 승인된 운영 범위에서만 변경하며, raw output·candidate report를 rollback 기준으로 보존한다.

## 적용 순서

`source exclusion → canonical identity → raw hierarchical classification → disposition overlay → gate/audit → downstream`

overlay는 다음 조건을 모두 만족해야 한다.

1. `sourceClassificationDigest`가 overlay가 만들어진 raw 산출물과 일치한다.
2. overlay의 question UID가 raw output에 정확히 한 번씩 존재한다.
3. `fromSubUnitKey`가 현재 raw record와 일치한다.
4. `toSubUnitKey`가 빈 값이면 `standard_unit_only`와 `recommendationEligible=false`로 강등한다.
5. digest·UID·키 검증에 실패하면 전체 정책층을 fail-closed한다.

## 현재 검증 결과

- raw baseline sidecar: 10,498개 분류 레코드
- fallback overlay 대상: 28건
- overlay 적용 후 blocked 세부키: 0건
- overlay 적용 후 recommendation-eligible: 32건 → 4건
- documented template: 32건 → 4건
- standard-unit-only: 9,700건 → 9,728건
- 원본 classifier·원본 JS 변경: 없음

### 현재 운영 반영 정정

위 수치는 당시 shadow-mode 스냅샷이다. 현재 승인된 운영 적용은 430개 production 파일,
10,498문항이며 source JS와 canonical/compiled master가 동기화되었다. 적용 후에는
candidate→production parity, master membership, question-index, render QA를 게이트로 사용한다.
이전 baseline과의 숫자 차이는 historical report로 보존하고 현재 판정에는
`archive/_generated/intelligence/phase3/complete-subunit-classification/`의 최신 QA를 사용한다.

## 운영 전환 단계

### 1. Shadow mode

raw output과 overlay output을 동시에 만들고, UID 수·표준단원 키·문항 수·추천 대상 수를 비교한다. 불일치가 있으면 운영 출력을 전환하지 않는다.

### 2. Read-only consumer 연결

검색·추천·통계가 overlay output을 읽도록 연결하되, 원본 JS 쓰기와 master write는 금지한다.

### 3. 승인 후 공식 전환

사용자 승인과 baseline 재고정 이후에만 overlay를 공식 분류 출력 경로로 승격한다. 이때도 raw output은 rollback 기준점으로 보존한다.

## 현재 차단 사유

현재 작업 디렉터리에는 16:00 baseline 이후 추가된 고2 파일 2개가 있어 bulk baseline 테스트가 `432 files / 10,552 questions`에서 `434 files / 10,596 questions`로 변한다. 이 파일들은 canonical identity map에도 아직 포함되지 않아, rebaseline 또는 명시적 exclusion 전에는 bulk baseline을 통과시킬 수 없다.
