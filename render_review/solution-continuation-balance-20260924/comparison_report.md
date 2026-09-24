# 金당고 solution continuation balance — actual production render

## Verdict

**`PASS_WITH_MINOR`**

q22의 “마지막 a=4, b=6 두 줄만 18쪽에 고립”되는 현상은 실제 `mode=sol` 화면에서 개선됐다. After page18에는 `따라서 구하는 값은 …` 결론, k 값, a, b가 함께 있는 7 display-line block이 있다. 총 쪽수는 before/after 모두 18쪽이며, 사용자가 지정한 대로 페이지 수 감소를 pass 조건으로 삼지 않았다.

잔여 visual은 q9/q15의 짧은 마지막 열 조각과 q20의 기존 마지막 열 조각, 그리고 q22 page18의 넓은 하단 공백이다. q9/q15는 before보다 tail 높이가 커졌고 q20은 그대로라 회귀가 없다. 최종 답과 식은 보이며 학생 풀이 흐름을 끊지 않는다.

## 기준 / 입력 / 방법

- 작업 branch: `gpt/archive-solution-continuation-balance-20260924`
- Rendered engine HEAD: `c99642e5ba3cb10cfdcadfdc52396d022d81e852`
- Latest `origin/main`: `8b60db3a6ca04246e498ac4d94e44b4c2a3d54fa`
- Engine branch parent: `522c915eaa0c9e54bf43f3884f809d65075e1dbe`. `522c915e… → 8b60db3a…`와 `8b60db3a… → live origin/main` 사이에서 아래 4개 대상 파일의 diff는 모두 0이다.
  - `archive/solution-render-executor.js`
  - `archive/layout-authority.js`
  - `archive/engine.html`
  - `tests/layout-authority.test.js`
- Data authority는 `25년_2학기중간_고1_금당고_작은칠판_재조판_결과.zip` 안 JS다. SHA-256: `4423E6CA38BB27E6415269A00DD90A9CBEEF7E02767667D0ACF8F49FF8243CC5`. 물리 사본은 prior review commit `4669fd759b8cf316334a55d20920474ea9d4f4b9`에서 가져와 exact blob과 대조했다.
- Browser는 Chrome 153.0.8010.53/Blink, `mode=sol`, production default `batch` renderer, default solution authority, viewport `1440×1100`, 100% zoom, device scale 1을 사용했다. BrowserContext는 fresh, cache disabled, service worker bypass. Local MathJax readiness와 `document.fonts.ready`, 이미지 decode, engine `renderReady`까지 기다렸다.
- HTTP harness는 production engine, CSS, pagination, image, MathJax 파일을 branch worktree에서 직접 제공하고 금당고 data URL만 frozen artifact JS에 연결했다. Engine/CSS/DOM/solution을 수정하지 않았고 임시 CSS도 주입하지 않았다.
- Baseline PNG/PDF/metrics는 previous review commit `4669fd759b8cf316334a55d20920474ea9d4f4b9`의 산출물이며 baseline page capture Git blob identity를 확인했다.

## Static preflight 기록

- `node --check archive/solution-render-executor.js`: PASS
- `node --check archive/layout-authority.js`: PASS
- `node --test tests/layout-authority.test.js`: **10/11 PASS**
- 실패한 test #6 `measured solution production planner requests only source-free range geometry then seals placement`는 `NEEDS_MEASUREMENT`을 반환했다(기대 `READY`). Test fixture가 continuation `start=1` 측정치를 제공하지 않고, 기대 placement `[0,1]`의 chunk 높이 `35+70=105`가 usable height `100` + tolerance `2`를 넘는다.
- 새 regression test #11 `solution planners rebalance a tiny trailing continuation instead of orphaning only a few chunks`는 PASS이며 measured/legacy planner 모두 `[[0,3],[4,11]]`로 재배치한다.
- 최초 지시의 static-failure stop gate 뒤에 사용자가 “실제 렌더를 해야지”라고 명시해 실렌더를 진행했다. Static failure는 숨기지 않고 기록했으며 엔진/test는 고치지 않았다.

## 전수 렌더 요약

| 항목 | Before | After |
|---|---:|---:|
| 실제 렌더 문항 수 | 22 | 22 |
| 화면 page / PDF page / after page PNG | 18 / 18 / 18 | 18 / 18 / 18 |
| solution source lines / blank lines | 690 / 23 | 690 / 23 |
| artifact ↔ runtime id/content/choices/answer/solution | — | 각 22/22 일치 |
| missing / unexpected question / duplicate question header | — | 0 / 0 / 0 |
| duplicated layout block ID / fragment sequence gap | — | 0 / 0 |
| image decoded / broken image | 22 / 0 | 22 / 0 |
| unrendered MathJax / horizontal overflow / clipping | 0 / 0 / 0 | 0 / 0 / 0 |
| autoCompress fragments / console errors / network load failures | 0 / 0 / 0 | 0 / 0 / 0 |

After의 18개 page PNG를 전부 직접 열어 확인했다. SVG는 정상 표시됐고, 해설 문항 순서는 1~22였다. Solution 글자 크기는 8.5pt (`11.3333px`)로 유지됐으며 autoCompress inline style은 어느 fragment에도 적용되지 않았다.

## Continuation 분배

| 문항 | Before fragment (쪽 / 마지막 높이) | After fragment (쪽 / 마지막 높이) | 판정 |
|---|---|---|---|
| q9 | 2개 / 5,5쪽 / 101.2px | 2개 / 5,5쪽 / 163.4px, 13 visible lines | 오른쪽 열의 마지막 비율식과 답까지 더 큰 조각으로 이동. |
| q15 | 2개 / 10,10쪽 / 69.2px | 2개 / 10,10쪽 / 145.1px, 6 visible lines | 마지막 `m` 값·최댓값·답을 같이 보여준다. |
| q20 | 2개 / 15,15쪽 / 162.9px | 2개 / 15,15쪽 / 162.9px, 11 visible lines | 동일 배치, 악화 없음. |
| q18 | 2개 / 13,13쪽 / 944.1·850.2px | 동일 fragment·쪽·높이 | SVG, 줄 흐름 회귀 없음. |
| q19 | 2개 / 14,14쪽 / 944.8·744.9px | 동일 fragment·쪽·높이 | 줄 흐름 회귀 없음. |
| **q22** | **3개 / 17,17,18쪽 / 마지막 92.4px. 18쪽에는 a=4, b=6만 보임.** | **3개 / 17,17,18쪽 / 마지막 147.9px, 7 visible lines, 4 explicit breaks.** | **18쪽 마지막 조각이 최종 결론 블록으로 커졌다. 마지막 두 줄만 고립되는 현상은 해소됐다.** |

q22의 page17 중간 fragment 높이는 `952.7 → 914.7px`로 줄고, 마지막 fragment는 `92.4 → 147.9px`로 늘었다. q22는 18쪽에 남지만 “구하는 값은 …” 최종 문장과 k, a, b의 값을 함께 보여준다. 이는 한 덩어리 결론으로 읽힌다. Page18 하단은 여전히 비어 있지만, 마지막 조각은 standalone 두 식이 아니다.

Frozen solution source 자체에는 k 집합을 교점 개수 결론으로 말한 뒤, 최종 답에서 k·a·b를 다시 적는 흐름이 있다. 두 문장은 source에 각각 한 번 있고, runtime solution string parity는 22/22다. 따라서 반복으로 보이는 k set은 renderer가 복제한 텍스트가 아니다.

## 실제 캡처

- [q22 page17 — before](before/q22-before-page17.png) · [after](after/pages/page-17.png)
- [q22 page18 — before](before/q22-before-page18.png) · [after](after/pages/page-18.png)
- [q9 page5 — before](before/q9-before-page05.png) · [after](after/pages/page-05.png)
- [q15 page10 — before](before/q15-before-page10.png) · [after](after/pages/page-10.png)
- [q20 page15 — before](before/q20-before-page15.png) · [after](after/pages/page-15.png)
- [q18 page13 — before](before/q18-before-page13.png) · [after](after/pages/page-13.png)
- [q19 page14 — before](before/q19-before-page14.png) · [after](after/pages/page-14.png)
- [Comparison gallery](compare/index.html)
- [Before full render PNG](before/full-render-before.png) · [After full render PNG](after/full-render.png)
- [Before PDF](before/geumdang-before-fix.pdf) · [After PDF](after/geumdang-after-fix.pdf)
- [After metrics](after/render-metrics.json) · [Combined metrics](render-metrics.json)

## Git outcome

Verification artifacts are committed separately on `gpt/archive-solution-continuation-balance-20260924` under this folder only. Engine/test files remain untouched. `main` was not changed or merged.
