# L1 Closeout — H15-SB-03

상태: **PASS / CLOSED**  
Queue: `H15-SB-03`  
curriculum/course: **2015 / 수학(하)**  
canonical L1: **함수**  
current standard key: `H15-SB-03`  
source files: **43**

## Denominator

- denominator: **270 questions**
- solution presence: source inventory checked
- visual dependency candidates: **51**
- shared-material candidates: **13**
- source join: PASS
- UID cardinality: PASS
- source JS SHA mutation: **0**
- source/content fingerprint mutation: **0**

canonical identity map에 등록된 260/270건만 global metadata sidecar에 반영했다. `original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js`의 fresh-only 10건은 source review 결과를 보존하되 identity 등록 전까지 명시적 identity reconciliation HOLD로 유지한다.

## Taxonomy result

blind first-pass → freeze → legacy compare → boundary/conflict recheck → adjudication 순서로 처리했다. 도형·그래프·표·입체는 representation/context일 수 있으므로, 실제 해결에 결정적인 교육과정 개념과 풀이 전략을 primary로 사용했다.
- L2 count: **1**
- L3 count: **4**
- L4 count: **7**
- invalid path: **0**
- duplicate primary: **0**

## Difficulty result

- bucket: {"1":20,"2":5,"3":16,"4":201,"5":28}
- confidence: {"high":185,"medium":85}
- legacy compatibility: {"BORDERLINE_ACCEPTABLE":80,"BORDERLINE_REVIEW":0,"NORMAL":138,"STRONG_CONFLICT":52}

## Review / adjudication

- first-pass freeze: PASS, 270/270
- legacy compare after freeze: PASS, 270/270
- recheck/adjudication: PASS, 270/270
- HOLD: 0

## Validation

- denominator before == after: PASS
- canonical path / difficulty / applicability: PASS
- runtime sidecar parity: PASS
- target-local builder parity: PASS
- source JS SHA mutation: 0
- content/choices/answer/solution/image/assets mutation: 0
- global builder rebuild: NOT RUN — identity reconciliation remains separate

## Apply
- identity-backed global sidecar updated: **260 records**
- fresh-only identity reconciliation HOLD: **10 records**
- updated existing: **260**
- fresh-only registration held: **10**
- global metadata record count after scope reconciliation: **11,034**
- reviewStatus: `reviewed_pass` 270 / `HOLD` 0

Evidence:
- blind_first_pass.json
- first_pass_freeze.json
- legacy_compare.json
- independent_recheck.json
- metadata_candidate.json
- L1_PREAPPLY_SUMMARY.json
- apply_receipt.json
