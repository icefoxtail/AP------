# L1 Closeout — H15-SA-05

상태: **PASS / CLOSED**  
Queue: `H15-SA-05`  
curriculum/course: `2015 / 수학(상)`  
canonical L1: `방정식과 부등식`  
current standard key: `H15-SA-05`  
source files: **20**

## Denominator

- denominator: **60 questions**
- solution presence: source inventory checked
- visual dependency candidates: **5**
- shared-material candidates: **4**
- source join: PASS
- UID cardinality: PASS
- source JS SHA mutation: **0**
- source/content fingerprint mutation: **0**

## Taxonomy result

blind first-pass → freeze → legacy compare → boundary/conflict recheck → adjudication 순서로 처리했다. 도형·그래프·표·입체는 representation/context일 수 있으므로, 실제 해결에 결정적인 교육과정 개념과 풀이 전략을 primary로 사용했다.
- L2 count: **3**
- L3 count: **7**
- L4 count: **10**
- invalid path: **0**
- duplicate primary: **0**

## Difficulty result

- bucket: {"1":5,"3":12,"4":38,"5":5}
- confidence: {"high":46,"medium":14}
- legacy compatibility: {"BORDERLINE_REVIEW":22,"NORMAL":29,"STRONG_CONFLICT":9}

## Review / adjudication

- first-pass freeze: PASS, 60/60
- legacy compare after freeze: PASS, 60/60
- recheck/adjudication: PASS, 60/60
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
- global sidecar updated: **60 records**
- global metadata record count: **11038**
- reviewStatus: `reviewed_pass` 60 / `HOLD` 0

Evidence:
- blind_first_pass.json
- first_pass_freeze.json
- legacy_compare.json
- independent_recheck.json
- metadata_candidate.json
- L1_PREAPPLY_SUMMARY.json
- apply_receipt.json
