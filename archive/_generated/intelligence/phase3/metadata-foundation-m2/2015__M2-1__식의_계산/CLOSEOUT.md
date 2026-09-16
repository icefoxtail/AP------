# L1 Closeout — 2015 식의 계산

상태: **PASS / CLOSED**
Queue: `2015|M2-1|식의_계산`
curriculum/course: `2015 / 중2 수학`
canonical L1: `식의 계산`
canonical scope: `M2-1`

## Denominator

- fresh source denominator: **153 questions**
- source file count: **17**
- source join: PASS
- UID cardinality: PASS
- source fingerprint mutation: **0**

## Taxonomy result

- blind first-pass → freeze → legacy compare → independent recheck/adjudication 순서로 처리했다.
- 사용 L2 수: **2**, 사용 L3 수: **4**, 사용 L4 path 수: **8**

## Difficulty

| Bucket | Count |
|---:|---:|
| 1 | 0 |
| 2 | 49 |
| 3 | 44 |
| 4 | 60 |
| 5 | 0 |

| Confidence | Count |
|---|---:|
| high | 148 |
| medium | 3 |
| low | 2 |

| Boundary | Count |
|---|---:|
| NONE | 153 |
| B12 | 0 |
| B23 | 0 |
| B34 | 0 |
| B45 | 0 |

| Legacy compatibility | Count |
|---|---:|
| NORMAL | 79 |
| BORDERLINE_REVIEW | 0 |
| BORDERLINE_ACCEPTABLE | 52 |
| STRONG_CONFLICT | 5 |
| UNKNOWN | 17 |

## Recheck / review

- independent recheck: **118**
- recheck resolved: **104**
- boundary: **0**
- low confidence: **2**
- strong conflict: **5**
- same-type outlier: **98**
- HOLD/manual_review: **18**

## Applicability

- DEFAULT_SCOPE: **151**
- RPM_EXTENDED: **0**
- RPM_EXTENDED_CANDIDATE: **2**

## Validation

- validator: **PASS**
- builder parity: **PASS**
- runtime sidecar parity: **PASS**
- source/content mutation: **0 / PASS**

## 변경 파일

- `archive/data/question_metadata.json` (selected middle-grade-2 UID records only)
- queue evidence files under `archive/_generated/intelligence/phase3/metadata-foundation-m2/`
- `archive/_generated/intelligence/phase1/metadata-foundation-m2/M2_FRESH_INVENTORY.json`
- `archive/_generated/intelligence/phase1/metadata-foundation-m2/M2_L1_WORK_QUEUE.json`
- `archive/_generated/intelligence/phase1/metadata-foundation-m2/M2_L1_WORK_QUEUE.md`

이 closeout은 source JS의 content/choices/answer/solution/image/layoutTag/wide를 수정하지 않았다.
