# Browser Render Check — GOLD #2 / source-only V3 diagnostic

Run: `gold-02-23-buyeong-v2-20260910-r1`

The fresh V3 candidate was not created because the mandatory reference-sample
calibration gate stopped the official runner. These are target-production
diagnostics against the clean worktree, not fresh-candidate PASS evidence.

| Case | Status | Evidence |
|---|---|---|
| fresh candidate / exam / desktop | NOT_TESTED | Candidate write blocked by `REFERENCE_SAMPLE_LOCK_REQUIRED`. |
| fresh candidate / exam / mobile | NOT_TESTED | Candidate write blocked by `REFERENCE_SAMPLE_LOCK_REQUIRED`. |
| fresh candidate / solution / desktop | NOT_TESTED | Candidate write blocked by `REFERENCE_SAMPLE_LOCK_REQUIRED`. |
| fresh candidate / solution / mobile | NOT_TESTED | Candidate write blocked by `REFERENCE_SAMPLE_LOCK_REQUIRED`. |
| fresh candidate / answer / desktop | NOT_TESTED | Candidate write blocked by `REFERENCE_SAMPLE_LOCK_REQUIRED`. |
| fresh candidate / answer / mobile | NOT_TESTED | Candidate write blocked by `REFERENCE_SAMPLE_LOCK_REQUIRED`. |
| target production / exam / desktop | FAIL | Browser tab 2; target JS path absent; load-error text; `.q-box=0`, `.ans-n=0`, broken images `0`. |
| target production / solution / desktop | FAIL | Browser tab 3; target JS path absent; load-error text; `.sol-exp=0`, broken images `0`. |
| target production / answer / desktop | FAIL | Browser tab 4; target JS path absent; load-error text; `.ans-n=0`, broken images `0`. |

Target diagnostic URL shape:

`http://127.0.0.1:8123/archive/engine.html?mode={exam|sol|ans}&qpp=4&data=exams/original/high/h1/2mid/23_%EB%B6%80%EC%98%81%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A01_%EA%B8%B0%EC%B6%9C.js`

The browser warning for all three cases was:

`[archive-engine] failed to load exam data script: exams/original/high/h1/2mid/23_부영여고_2학기_중간_고1_기출.js`

No browser result is promoted to semantic render PASS.
