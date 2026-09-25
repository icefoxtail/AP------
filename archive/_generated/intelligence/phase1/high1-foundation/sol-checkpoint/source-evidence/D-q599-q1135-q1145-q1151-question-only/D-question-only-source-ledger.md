# D source ledger — question-only source audit

## Scope and dispositions

This audit compared only original exam question pages with JS content, choices, and image fields. It did not use any answer key or solution source.

- q599 / Suncheon Girls 2025 midterm: exact printed-source mismatch in content; repaired content only. Choices and image already matched.
- q1135 / Gwangyang Steel 2026 final: SOURCE_MATCH.
- q1145 / Maesan 2026 final: SOURCE_MATCH.
- q1151 / Bokseong 2026 final: SOURCE_MATCH.
- No answer or solution field was changed. No answer/solution verdict is made; such concerns remain outside this D audit.

## Source identity and full-page evidence

### q599 — 순천여고 2025 first-semester midterm

- Original exam PDF: D:\2025년\1학기중간_2025\고1\순천여고\순천여고.pdf
- PDF SHA-256: B57CAB0CC8ADB2316AA0B3F77B7BFF0A55E2564E2F3972A8955FEFC9FB61851D
- Page 1 header identifies 2025 first-semester midterm, grade 1, Common Mathematics 1, date 2025-04-23; the footer names 순천여자고등학교.
- Source question: p.5/6, the first of the three written-response items, corresponding to archive source ordinal 19. Full-page raster suncheon-girls-2025-page-5.png SHA-256 8AA744A2258D6FB4B7FA0676CFB6085E281956B6B6E262238F24CA73602F4ADF; [focused question crop](suncheon-girls-q19-exact-stem-crop.png) SHA-256 1EA21E1910AA0A7C18718826F1AC008E7A241A942C5FC19C8BAAB719EC6C1DCD.
- Identity raster: suncheon-girls-2025-page-1.png SHA-256 08EECD48334C2F6E574B696F5AFE706DBEED2B5DD7533DBB507FE4D630184CCC.

### q1135 — 광양제철고 2026 first-semester final

- Original question scans are from D:\2026년 기출\1학기기말\분류완료\고1\광양제철고등학교\공통수학1.
- q6 is on the full p.3/6 question scan S28BW-826071419320_0035.jpg, SHA-256 395A0EE75D1BC4DDD80D0AEA17F728962A2E84885CBA26BC3B8B0FA19BFC3861; [q6 crop](gwangyang-q6-p3-crop.png) SHA-256 76053B2827C898B4EC31FF8FAB4368753BB5ECE2D4222A71F802CBF7AAE9145E.
- The p.2/6 full scan S28BW-826071419320_0034.jpg, SHA-256 CC743BDFC65C8163AA8D0806A38B030C7EE008C961A3A3C723DEFCB0BD671E62, confirms the school, term, and Common Mathematics 1 exam series. The p.3 footer identifies the same school and page number.
- The classification folder contains the target full question pages but not the p.1/6 cover page; q6’s own full-page footer and the 2026 source folder establish the relevant identity.

### q1145 — 순천매산고 2026 first-semester final

- Original question scans are from D:\2026년 기출\1학기기말\분류완료\고1\순천매산고등학교\공통수학1.
- Page 1 header identifies the 2026 first-semester second regular exam, Common Mathematics 1, dated 2026-07-02; footer identifies 순천매산고등학교.
- q16 is the first short-answer problem on p.5/6, printed as 단답형 1. Full p.1 scan S28BW-826071419370_0001.jpg SHA-256 B85CB84CE237885DC51341A85E9BC2CB6360FE212913BB9BEC6E2CB163FD7D81. Full p.5 scan S28BW-826071419370_0005.jpg SHA-256 0DC5F7E76BC9914CB28ECEFF58D1C22AC8E2019C4143A39D51C2E86E5805960E; [short-answer-1 crop](maesan-short-answer1-p5-crop.png) SHA-256 90652E6B0F36900768E8A0D9CCE674426A773ED534D2BED6262E43CBDFCC3D34.

### q1151 — 순천복성고 2026 first-semester final

- Original question scans are from D:\2026년 기출\1학기기말\분류완료\고1\순천복성고등학교\공통수학1.
- Page 1 header identifies the 2026 first-semester second exam, Common Mathematics 1, dated 2026-07-03; footer identifies 순천복성고등학교.
- q20 is on p.4/5. Full p.1 scan S28BW-826071419330_0034.jpg SHA-256 A1C2B682765D8387B477EE9354FD85E9B690431C32F7CEE717681D992385ABAC. Full p.4 scan S28BW-826071419330_0037.jpg SHA-256 458352B1D710254F60F29090936688BB50D4C8AA19845B0B85F839D29FC7D19F; [q20 crop](bokseong-p4-question-crop.png) SHA-256 10AE9D4DF53CDAD3E054ECC6B9109941C28E5769599D27597A53F85DCE94F720.

## Per-item comparison and payload hashes

The field digest is SHA-256 of UTF-8 JSON.stringify({content, choices, image}) for the indicated current JS question.

### q599

- UID qid_v1_6c79454fc7a40b3688142b677112a76b316ef7a84cfe1810a6de5c7b648d59f4; source file original/high/h1/1mid/25_순천여고_1학기_중간_고1_기출.js, ordinal 19.
- The printed question begins with its written-section number “1.” and prints the score as “[6.0]”. The baseline JS instead added “[서술형 1]”, a comma not present after “인수분해하고”, and the suffix “점”. This exact source mismatch was repaired in content only. The question’s polynomial and all other printed wording match. choices=[] and image="" already matched the source’s no-choice, no-figure written question.
- content SHA-256 before: 48389D5172BBF331974D1FA48F3D5C867E5871D311C2BA19E4EDCB3176B321B7
- content SHA-256 after: 76DD0FE9BEAE21BEE38926C8C77154FD5D5E725A4D50E8A95C4972D5B5E5F277
- current content/choices/image payload digest: 506DC41FB23B3B6A19F657AE93B64083062B5A52CB9BE5E90ED9034BDDE58BFD
- target JS SHA-256 before: 3254231071C81E63512DE29CD439B355C2926FB4FB71B4D7A01B6321151C9A46
- target JS SHA-256 after: C2E74B341E4E0C8B99865DA3194576B3D27B6CA9ECFDE98AA37D2ED04093B491

### q1135

- UID qid_v1_043dfcf4899c69f665dd7961825775cbc49f3c25cf5a0ff03bc71bd965cf15d0; source file original/high/h1/1final/26_광양제철고_1학기_기말_고1_기출.js, ordinal 6.
- The printed matrix A=[[1,a],[0,1]], A^n entry-sum 56 prompt and choices 6,7,8,9,10 match JS. No printed figure; image="".
- current content/choices/image payload digest: 8BD106EDC4A0B6127D9ACBA87273A5CCEE2A3AFD8C55567E2E39BE96703AF137
- current JS SHA-256: 93FAE1061C984D73F5855A85FB203B383A94338FB624EBEFA30B42ED3656561F

### q1145

- UID qid_v1_a2c2bef00a61ded3d33a8394f619fc26270d2ec7d70e06b39e06d6f7bb45e7ff; source file original/high/h1/1final/26_매산고_1학기_기말_고1_기출.js, ordinal 16.
- The printed 단답형 1 matrix definitions for A and B, target matrix AB, and request for real x match JS. choices=[] and image="" match the short-answer source page; no figure is printed.
- current content/choices/image payload digest: 3192B9552A08554A64DB0A30EB7E63ED27F0B88C7045AD62B4310C34C2B9C3DA
- current JS SHA-256: 16A083F8B24FAA1BD46A651D251B26E97C113B44369A475E3959DDE0324981EE

### q1151

- UID qid_v1_af6e931563a5683cf80e1f76074ccaea2dc5084a4365931307f2f0fc641eb9a4; source file original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js, ordinal 20.
- The printed A, B, C matrix definitions, three conditions, B+C target matrix, “a is nonzero” qualifier, and choices 1,2,3,4,5 match JS. No figure; image="".
- current content/choices/image payload digest: 768B3384F224D2EA10DB040B1E0B53706259F469184C0192686D7071C828D752
- current JS SHA-256: 6A7324708D6FC8B5CE17530AA8A8BD73BB557289A04C616F6A6C336EBA7D1EF7

## Gates

- node --check on the q599 target JS: PASS.
- Scoped archive JS schema validator for q599 exam: PASS, 0 issues.
- Targeted q19 question-field check (content string, choices array, image string): PASS.
- Exam-only desktop render: PASS at 1920×855; 21 question boxes, 6 pages, 100 MathJax containers, 0 broken images, no render/load errors or horizontal overflow; the updated q19 is visible and typeset on page 5.
- Exam-only mobile render: PASS at 390×844 in screen-fit mode; 21 question boxes, 6 pages, 100 MathJax containers, 0 broken images, no render/load errors or horizontal overflow; the updated q19 is visible after scrolling. Browser console error/warning list was empty.
- Answer and solution modes were not rendered under the question-only source authority.
- Non-used exposure note: a git diff hunk used to confirm the content-only patch included adjacent existing answer/solution lines in tool output. Those lines were not used for any source comparison, were not changed, and were not consulted further.
