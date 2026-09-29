# 비상 공통수학Ⅱ — 집합 중단원 학습점검

## 현재 상태

문항 작성, 원문·공식 정답 대조, 로컬 JS/asset 검사, 실제 Archive 엔진의 6개 브라우저 캡처까지 완료했다. 독립 provider/V3 readability review는 아직 실행되지 않았으므로 이 set은 **local review complete / independent review pending**이며 final-closeout은 아니다.

## 원문과 분모

- 문제 PDF 물리 19–20쪽(인쇄 74–75쪽), 11문항.
- 공식 정답·해설 PDF 물리 8쪽(인쇄 149쪽), 11문항 답을 모두 대조했고 독립 계산 결과와 11/11 일치했다.
- 문제 PDF SHA-256: `c1ba1424c5e28f04c64afa0fdc3f97479bef2b1e6fe422f668e98dac9846305c`.
- 정답·해설 PDF SHA-256: `b3b127f9f26e54778717e776898fba1e755744d043e33f62c43e0df1d1ee0db0`.

## 산출물과 검사

- 원제목 JS: `js/비상_공통수학2_집합_중단원학습점검_고1.js` — 11문항, 객관식 3 / 단답형 8, L1/L2 매핑 `H22-C2-05` / `H22-C2-05-CORE`.
- 설명용 SVG: q07 집합 항등식 Venn 비교, q11 교집합 최댓값·최솟값 영역도. 나머지 9문항은 개별 도형이 없어 시각자료 면제로 기록했다.
- `node --check`, VM parse, qid·문항 분모·필수 필드·solution asset 경로 검사 PASS.
- `static-validation-report.json`: 문항 11/11, 공식 답 대조 11/11, missing/duplicate 0, Venn disposition required 2 / exempt 9.
- `browser-render-report.json`: Archive 엔진에서 exam/solution/answer 각각 desktop/mobile 6/6 PASS; console error, failed request, broken solution image, horizontal overflow 0.
- 문제 원문 physical-page renders, 답 crosswalk, 2025년 고1 2학기 중간 calibration references, visual-benefit ledger, SVG review를 같은 evidence 폴더에 보관했다.

## 브랜치

이 set은 통합 worktree `codex/visang-common2-textbook`에 로컬로 작성 중이며, 아직 stage/commit/push 및 독립 검수를 하지 않았다. 최종 통합 branch에는 task 제목과 일치하는 JS 및 별도 assets/evidence 경로만 넣는다.
