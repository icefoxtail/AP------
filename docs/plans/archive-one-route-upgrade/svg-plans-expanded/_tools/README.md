# 플랜 작성 도구 (batch64~67에서 사용)

경로가 작업 PC에 묶여 있다(`S=__dirname`의 `ex/`에 `git archive origin/main archive/exams`로 푼 시험지 JS, `mainledger.json`, `multirows.json` 등). 다시 쓰려면 같은 폴더 구조를 만들어 고친다.

- `lib.js`: `plane()`(평면도형 construction plan 생성), `composite()`, `src()`(sourceConditions), `write()`.
- `dec.js`: `_decisions.jsonl` 갱신(`upsert`)과 옛 플랜 history 이동(`toHistory`).
- `merge.js`·`merge2.js`·`apply2.js`: 한 문항 여러 플랜을 composite(또는 수직선 rows)로 통합. 엔진 규칙은 `archive/tools/geometry-equation/production/composite-candidate-svg-v1.mjs`.
- `r.sh`: 공장 render 도구로 플랜 하나 렌더하고 Chrome 헤드리스로 PNG를 만든다(`factory-render` worktree 필요).
- `a1.js`·`a2.js`: batch64 손으로 쓴 플랜의 본보기(벤 3패널, 좌표 교점, 접선 모형 3패널 등).
