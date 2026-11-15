# Wangun original FINAL_QA renderer preservation

This packet preserves seven existing approvals from the original 23-question FINAL_QA receipt and its separately reviewed difficulty reuse. It creates no metadata, mathematical QA, review-pass, or difficulty approval. The original receipt, original authority documents, approved values and reviewed difficulty remain byte-for-byte unchanged.

## Exact authority and dependencies

The request is `m1s2-wangun26-original-renderer-preserve-20261115`. Its partial scope contains Q1, Q4, Q14, Q15, Q19, Q21 and Q23. The denominator remains 23. Every `before` and `after` is empty; `registryChanges` is empty. The explicit `archive-original-full-finalqa-renderer-preservation-v1` contract replays every original full-scope approval and requires the independent renderer witness.

The immutable independent witness is remote commit `d1211f80c81d92b07d91857f257773634429cb92`, with SHA-256 `24b9c3be9078dbcef39024697932a0c42831dfea4bd9c0a8d0b930fb8f2d4a17`. Its current source and all referenced renderer assets are bound to remote commit `a56b5fc60cd178bd84063b45221fd224a5eef01d`, including the independently re-inspected Q19 and Q21 corrections. Those corrections and the witness are separate, previously fixed dependencies. This packet authors no source or asset change.

The unchanged 16-question subset remains the separate request authored in local input commit `50d541fe2739420ca2d169bd16922055d732297b`. Its request bytes are unchanged. The local dependency baseline merely combines those exact inputs with the fixed renderer dependencies for validation. Local code/input commits are reproducibility references, not substituted remote approval authorities.

## Verified behavior

Official registrar dry-run, write and cumulative no-op replay pass for renderer7 and unchanged16. Actual original native authority revalidation and AutoMeta reuse pass for all 23, with zero APPLY and zero new approvals. The renderer write changes identity source fingerprints for six image-path changes; Q4 changes only its supported display-size hint, so its identity fingerprint remains unchanged. Existing approved metadata and difficulty values remain exact. No canonical registry row, source file, original receipt, original evidence, or outside-scope metadata/runtime row changes.

The unfiltered official catalog contains 1,211 exams and 28,882 questions. Registrar consumer projection verifies canonical7 plus canonical16 with no fallback lane. The changed-UID consumer verifies 23/23 with zero skipped rows, failures, unobserved fields or assignment-pending records.

The official immutable-shadow path selects all six applicable changed/inherited preservation requests: this request's 7, the separate unchanged16, and 37 other already approved inherited UIDs. All 60 preserved UIDs are re-derived through six official plans producing 12 exact generated outputs. No inherited request was filtered out to obtain a pass.

## Integration boundary

The typed code contract depends on the full-source preservation helper and code through local commit `137796456cab427c49d07297fa53e80cfb573fd4`; it passed the independent combined-marker deletion review. Actual production integration must include the exact code, immutable witness, two corrected assets and unchanged16 request. Generated metadata, runtime, identity, sidecar and receipt output is local validation data and is excluded from this input publication. The official main writer must produce those outputs.

Remote CI, actual main registration, Pages deployment and browser testing are separate gates and are not claimed by this packet. Machine-readable scope, hashes and verification references accompany this file.
