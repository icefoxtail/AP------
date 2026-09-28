# Rebound browser render check

Work batch: `visang-workbook-geometry-20260929-rebound`  
Run: `visang-workbook-geometry-20260929-rebound-run`  
Run input SHA: `sha256:0e97da22cf5a653776f336b8ad2a5f3a42d5afc76bfc6b675182aeaa7daec9a5`  
Freeze SHA: `sha256:c7d40739019c7a045ab5567984f030de48d14cfb1d900a83eaa515d3cae5aa8b`

The fresh rebound run uses the authority-evidence verifier from core commit `6f1159236`. It passed all 28 current STATIC/METADATA machine checks before capture.

## Capture coverage

The pipeline-core collector captured all six production-engine cases, covering 14 questions each:

| Mode | Viewport | Count | Runtime | MathJax | Fonts | Images | Clipping | Overflow | Browser errors |
|---|---|---:|---|---|---|---|---|---|---:|
| Exam | Desktop 1280×1000 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Exam | Mobile 390×844 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Solution | Desktop 1280×1000 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Solution | Mobile 390×844 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Answer | Desktop 1280×1000 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Answer | Mobile 390×844 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |

The six capture reports contain 84 item witnesses total, with no missing question/mode/viewport combinations. Every report ends with item id `14`, `mathErrors: 0`, `badImages: 0`, and `renderError: null`. Full raw PNGs and their hashes are bound in the capture records under `pipeline-core/render-capture-rebound-r1/`.

All reviewed representative screenshots (q03 solution, q11 solution, q14 mobile exam) are byte-identical to the preceding inspected capture set. The q03 and q11 visual exemptions remain symbolic and unchanged. Capture readability remains `NOT_TESTED`; independent review is still pending the serialized FINAL_AUDIT.
