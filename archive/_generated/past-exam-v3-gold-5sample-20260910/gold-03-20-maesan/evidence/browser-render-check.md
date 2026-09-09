# GOLD #3 browser/render diagnostic — 20_매산고_2학기_기말_고1_기출

- candidate: `staging/extraction-v3/candidate/20_매산고_2학기_기말_고1_기출.candidate.js`
- source page denominator: 6 pages / 20 questions
- browser target: local staged candidate

| case | status | evidence / reason |
|---|---|---|
| exam / desktop | NOT_TESTED | archive engine path validator accepts only `exams/...js`; staged `_generated/...` candidate was rejected by the engine |
| exam / mobile | NOT_TESTED | same staged-path validator block |
| solution / desktop | NOT_TESTED | same staged-path validator block; core render collector did not materialize a capture |
| solution / mobile | NOT_TESTED | same staged-path validator block; core render collector did not materialize a capture |
| answer / desktop | NOT_TESTED | same staged-path validator block |
| answer / mobile | NOT_TESTED | same staged-path validator block |

The attempted direct engine load visibly returned “시험지 데이터를 불러올 수 없습니다” because `engine.html` requires a production-style `exams/...js` path. No production copy was made to bypass this gate.
