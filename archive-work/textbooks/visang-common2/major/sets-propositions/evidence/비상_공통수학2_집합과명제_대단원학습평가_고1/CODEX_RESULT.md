# 비상 공통수학Ⅱ — 집합과 명제 대단원 학습평가

## 상태

17문항의 canonical JS와 source/answer evidence를 작성하고 실제 Archive 엔진에서 6개 화면을 캡처했다. 독립 provider/V3 review는 pending이므로 이 set은 **local authoring and render review complete; independent review pending**이며 final-closeout은 아니다.

## 원문·정답

- 문제 PDF 물리 26–28쪽(인쇄 94–96쪽), 문항 01–17.
- 공식 정답·해설 PDF 물리 10–11쪽(인쇄 151–152쪽). p.10에는 01–09 정답과 10–11 풀이 시작이 있고, p.11에는 10–11 풀이가 이어지며 12–17 정답/풀이가 있다.
- 문제 PDF SHA-256: `c1ba1424c5e28f04c64afa0fdc3f97479bef2b1e6fe422f668e98dac9846305c`.
- 정답·해설 PDF SHA-256: `b3b127f9f26e54778717e776898fba1e755744d043e33f62c43e0df1d1ee0db0`.
- 공식 답과 독립 계산/증명 대조: 17/17, unresolved 0.

## 산출물과 검사

- `js/비상_공통수학2_집합과명제_대단원학습평가_고1.js` — exact set title, 17문항, 객관식 4 / 단답형 13. L1/L2 keys `H22-C2-05` 집합 / `H22-C2-06` 명제.
- 원본 그림이 필요한 q04 Venn shading과 q10 decision flowchart crops를 source image assets로 보존했다.
- 학생 풀이 SVG는 q05 truth-set counterexamples, q09 truth-set interval inclusion, q14 set-complement Venn, q15 implication intervals, q17 equality-case inscribed square이다.
- `node --check`, 17-question UID/file-path binding, required-field and all image-path checks pass.
- `browser-render-report.json`: Archive engine exam/solution/answer desktop/mobile 6/6 PASS; broken images, page errors, failed requests, horizontal overflow 0.
- `question-inventory.json`, physical/printed page crosswalk, official answer crosswalk, 2025 sample refs, visual benefit ledger, source full-page images, render screenshots and static report are in this evidence folder.

## Git

Only the coordinator’s local integration branch `codex/visang-common2-textbook` contains this draft; the set is not independently reviewed, committed, or pushed yet. No production main path was changed, and no candidate/generated lifecycle folders were created.
