# School Identity Normalization & Exclusion Rules

## 1. Identity Key Tuple
A past exam is uniquely identified across both the raw source storage and the APMath Archive repository by the 4-tuple:
`Identity = (Year, NormalizedSchool, Grade, Term/Exam)`

Example:
- Source PDF: `2024_강남고1_1중간.pdf` -> `(2024, "강남여고", "h1", "1mid")`
- Existing JS: `24_강남여고_1학기_중간_고1_기출.js` -> `(2024, "강남여고", "h1", "1mid")`
- Match result: Same exam identity.

---

## 2. Normalized School Names & Aliases
The repository covers Korean high schools (primarily Suncheon, Gwangyang, Yeosu, and neighbouring Jeonnam districts, plus select reference schools). When normalizing, resolve abbreviations, gender-specific suffixes, and typographical variants to canonical school names:

| Canonical School Name | Source / Filename Aliases & Regex Patterns | Notes |
| :--- | :--- | :--- |
| **강남여고** | `강남고`, `강남여고`, `순천강남여고`, `강남고1`, `강남` | 순천강남여고는 통상 '강남여고'로 통칭 |
| **매산여고** | `매산여고`, `순천매산여고`, `매여고` | 순천매산여자고등학교 |
| **순천여고** | `순천여고`, `순여고` | 순천여자고등학교 |
| **매산고** | `매산고`, `순천매산고` (단, `여` 제외) | 순천매산고등학교 (남고) |
| **순천고** | `순천고`, `순고` (단, `여`, `제일`, `팔마` 등 제외) | 순천고등학교 |
| **금당고** | `금당고`, `순천금당고` | 순천금당고등학교 |
| **제일고** | `제일고`, `순천제일고` | 순천제일고등학교 |
| **효천고** | `효천고`, `순천효천고` | 순천효천고등학교 |
| **복성고** | `복성고`, `광양복성고` | 광양복성고등학교 |
| **팔마고** | `팔마고`, `순천팔마고` | 순천팔마고등학교 |
| **광양고** | `광양고` (단, `백운`, `제철`, `여` 제외) | 광양고등학교 |
| **광양여고** | `광양여고`, `광여고` | 광양여자고등학교 |
| **백운고** | `백운고`, `광양백운고` | 광양백운고등학교 |
| **중마고** | `중마고`, `광양중마고` | 광양중마고등학교 |
| **제철고** | `광양제철고`, `제철고` | 광양제철고등학교 |

---

## 3. Explicit Exclusion Schools
The following schools must be **completely excluded** from both source collection and missing-audit results:
1. **청암고** (순천청암고등학교 - 직업/특성화고)
2. **공고 / 공업고** (순천공업고등학교 등 모든 공업고등학교)
3. **효산고** (순천효산고등학교 - 특성화고)

---

## 4. File Type & Variant Filtering Rules
When scanning source folders:
1. **PDF Files Only**: Ignore `.hwp`, `.hwpx`, `.docx`, `.hwt`.
2. **Problem Sheets Only**: Exclude answer sheets, solution files, and supplementary files containing keywords:
   - `*정답*`, `*해설*`, `*답*`, `*주관식*`, `*채점기준*`, `*풀이*`
3. **Existing JS Name Invariants**:
   - In Archive repository, filenames may contain trailing `_c`, `c`, `기출`, `수학`, or minor spacing variants. These suffixes do NOT alter the identity tuple.
   - Example: `24_효천고_1학기_중간_고1_기출.js` and `24_효천고_1학기_중간_고1_기출_c.js` resolve to the exact same exam identity `(2024, "효천고", "h1", "1mid")`.
