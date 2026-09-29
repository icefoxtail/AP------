# 비상 공통수학2 — 선분의 내분과 직선 중단원학습점검

## 최종 set 범위

- 공식 인쇄 section: `선분의 내분과 직선`, 인쇄 p.26–27, PDF 물리 p.3–4.
- 최종 JS: `js/비상_공통수학2_선분의내분과직선_중단원학습점검_고1.js`
- 최종 setKey: `비상_공통수학2_선분의내분과직선_중단원학습점검_고1`; bookId: `visang-common2`.
- 문제 PDF SHA-256: `c1ba1424c5e28f04c64afa0fdc3f97479bef2b1e6fe422f668e98dac9846305c`.
- 정답·해설 PDF SHA-256: `b3b127f9f26e54778717e776898fba1e755744d043e33f62c43e0df1d1ee0db0`.
- 공식 답·해설 authority: 물리 p.2 / 인쇄 p.143.
- components: `codex/visang-plane-coordinates` @ `f032cb7aa4064a726b4ca2e94531e4359f81746d`의 01·05·11·12와 `codex/visang-straight-line` @ `ad396908ada97f2a49bf9ad38e67ea52d52121f7`의 02·03·04·06–10.

## 동결된 문항 분모와 L2 분류

| 인쇄 번호 | 문제 PDF 물리/인쇄 쪽 | final L2 | choices | 답·해설 |
|---|---|---|---|---|
| 01 | 3 / 26 | 평면좌표 | 없음 | PASS |
| 02 | 3 / 26 | 직선의 방정식 | 없음 | PASS |
| 03 | 3 / 26 | 직선의 방정식 | 없음 | PASS |
| 04 | 3 / 26 | 직선의 방정식 | 없음 | PASS |
| 05 | 4 / 27 | 평면좌표 | 없음 | PASS |
| 06 | 4 / 27 | 직선의 방정식 | 없음 | PASS |
| 07 | 4 / 27 | 직선의 방정식 | 없음 | PASS |
| 08 | 4 / 27 | 직선의 방정식 | 없음 | PASS |
| 09 | 4 / 27 | 직선의 방정식 | 없음 | PASS |
| 10 | 4 / 27 | 직선의 방정식 | 없음 | PASS |
| 11 | 4 / 27 | 평면좌표 | 없음 | PASS |
| 12 | 4 / 27 | 평면좌표 | 없음 | PASS |

최종 분모는 12이며 sourceNo 01–12가 인쇄 순서대로 모두 있다. L2 분모는 평면좌표 4문항(`H22-C2-01`)과 직선의 방정식 8문항(`H22-C2-02`)이다. component source identity와 final combined identity를 sidecar에서 연결했다. 정답과 해설 coverage 12/12, official answer match 12/12, manual review 예외 0건이다.

## assets 및 검증

- visual asset 2개: q09 삼각형 OAB/직선 l 도식, q12 마름모 좌표도. 두 이미지 모두 해당 문항 crop과 full-page 원본에 provenance가 연결되고 실제 exam mode에서 정상 로드됐다.
- source text/choices exact parity: 12/12. 모든 문항의 printed choice 없음과 `choices: []`를 확인했다.
- canonical mapping: 평면좌표 L2 order 1 + `H22-C2-01-COORDINATE_METRIC`; 직선 L2 order 2 + `H22-C2-02-LINE_EQUATION`.
- `node --check`, Node VM parse, static validation: **16/16 PASS**.
- 최종 JS를 `archive/engine.html`에 task-local route로 직접 공급한 실제 browser render: **exam 12/12, 3 pages; sol 12/12, 3 pages; ans 12/12, 1 page**. MathJax 및 두 그림 로드, horizontal overflow 0, console/page/network errors 0.
- 최종 screenshot과 상세 모드 보고서는 `evidence/{setKey}/browser-render-{exam,sol,ans}.png` 및 `browser-render-report.json`.
- 난이도 `level`과 difficulty 4-field는 `UNKNOWN`/공란이며, source-dependent upper metadata는 final하지 않았다.
- 공용 pipeline 코드, production archive/exams, DB, index, UI, package는 수정하지 않았다. 문제·정답 PDF 원본은 output에 복사하지 않았다.

## Elapsed (근사)

구조 정정 이후의 병합 라운드: component 원장과 branch 식별 약 3분, 01–12 mapping/identity/crop 통합 약 5분, answer/solution crosswalk와 visual asset 결합 약 3분, static/VM 검증 약 2분, 최종 browser render 및 시각 확인 약 2분. commit/push·Notion/coordinator closeout은 완료 후 기록한다.

## Artifact path와 branch

- output root: `archive-work/textbooks/visang-common2/middle/geometry/선분의내분과직선/`
- branch: `codex/visang-plane-coordinates` (이번 교정은 해당 branch에 최종 combined artifact를 추가하며 main에 merge하지 않음).
- 이번 correction commit 및 remote SHA는 push 이후 Notion 교재 원장과 coordinator handoff에 기록한다.

## Whole-job static schema correction — 2026-09-29

- Current pipeline machine checks require a non-empty questionType. The 12 combined plane/line items are constructed-response prompts in the source with no multiple-choice blocks, so all 12 canonical rows are now classified as `단답형`.
- Static source/inventory/answer checks PASS 16/16. Archive engine exam/solution/answer renders pass with 12 items in 3/3/1 pages, image assets loaded, MathJax and page/runtime errors 0, and horizontal overflow false.
