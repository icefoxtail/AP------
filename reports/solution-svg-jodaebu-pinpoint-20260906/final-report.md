# 조대부고 2023·2024 수학II 도형·해설 핀포인트 수정 및 독립검수

## 기준

- 사용자 기준 SHA: `ce6c8ade8e020e11d8593f803359e7664ff713b6`
- 최초 fetch 직후에는 HEAD와 `origin/main`이 위 SHA와 일치했다.
- 작업 중 `origin/main`이 `ed074fde0a5a3476c0764525ce670e9a1177ad07`로 갱신되었고, `ce6c8ade..ed074fde`의 두 대상 JS·관련 자산·DB·question-index diff는 0이었다.
- 최종 HEAD/`origin/main`: `ed074fde0a5a3476c0764525ce670e9a1177ad07`
- 규정 manifest 25개 파일 hash/byte 검증: PASS (`rule-pack-check.json`)
- 문제 PNG는 재제작하지 않았고 SHA-256이 baseline과 동일하다 (`hash-lock.json`, `source-facts.json`).

## 수정 파일·문항

- 2023 JS: q11 `tags`에 `그래프` 추가.
- 2024 JS: q8/q15/q16/q17/q18 `tags`에 `그래프` 추가; q11의 category/standardUnit/subUnit을 `H15-M2-01` 함수의 극한으로 교정(원본 `originalCategory` 유지); q13 최고차항 비교 논리 보강; q17 교점수 전수 경우분류와 `t=1` 연속성 설명 보강; q20은 해설 본문에서 검증된 증감표 SVG를 사용하도록 보강; q23 퇴화 분모 `A+2k=0` 검토 추가.
- 기존 13개 solution SVG 전부 좌표 기반으로 재구성: 2023 q01/q11/q16/q23, 2024 q01/q05/q07/q08/q12/q15/q16/q17/q18.
- 2024 q20에는 발문이 요구하는 완성 증감표 보조 SVG를 추가했다. 따라서 solutionImage 총량은 기존 13개에서 14개가 되었다.
- `archive/db.js`는 변경하지 않았다. 시험 ID·문항 수·경로·범위가 이미 정확했기 때문이다.

허용 범위 검사 결과: 46문항 비교에서 비허용 필드 변경 `0` (`scope-check.json`). 보호 문항의 content/choices/answer/image/메타데이터는 건드리지 않았다.

## 수학·SVG 검수

- PNG 의존 문항 2023 q1/q16, 2024 q1/q5/q7을 실제 PNG로 먼저 판독하고 source facts를 고정했다.
- 독립 수학검산: 46/46 PASS (`independent-review.md`, `independent-math-checks.json`).
- 기존 13개 SVG critical EXPECTED FACT 46건 → 실제 circle/line/polyline geometry 역산 OBSERVED FACT 46건: 46/46 PASS.
- 새 공식 도구 실행: `node archive/tools/geometry-equation/verify-svg-coordinate-parity.mjs ...`; 13/13 `svgMathStatus=PASS`, `svgFinalStatus=PASS` (`coordinate-parity-summary.json`).
- 13개 기존 SVG + q20 보조표 SVG 14/14 XML/static PASS: viewBox/preserveAspectRatio, 외부 href 0, script 0, foreignObject 0, clipping 0, safe area, branch sampling PASS (`svg-self-check.json`).
- 학생용 좌표 근삿값 라벨: `STUDENT_DECIMAL_POINT_LABEL_CHECK PASS`, 실패 0.
- q23 등축척 좌표계, q11/q8/q15 접선 slope/intercept, q16/q18 좌우 미분계수, q12 정확 영점, q17 `t=2/3,2` 경계가 실제 element에서 역산된다.

## question-index / DB

- 두 시험지 JS 문항 수: 23 + 23 = 46.
- question-index 재생성: `node archive/tools/build-question-index.mjs`.
- 대상 46행 유지, 허용된 8행만 태그/분류/solutionImage 파생값이 변경되었고 DB record는 unchanged (`index-parity.json`, `db-parity.json`).

## 브라우저 실렌더

실제 `archive/engine.html`에서 두 시험지 전체를 `exam`, `sol`, `ans`로 다시 렌더했다 (`browser-render-check.md`).

| 시험지 | exam | sol | ans |
|---|---|---|---|
| 2023 | 23 q-box / 6 pages / PNG 3/3 / overflow 없음 | 23 q-box / 8 pages / SVG 4/4 / 빈 해설 0 / overflow 없음 | 23 ans-n / 1 page |
| 2024 | 23 q-box / 6 pages / PNG 4/4 / overflow 없음 | 23 q-box / 10 pages / SVG 10/10( q20 포함) / 빈 해설 0 / overflow 없음 | 23 ans-n / 1 page |

후반·마지막 q23의 결론, 2024 q17 경우분류, 2024 q20 증감표가 실제 화면에 존재한다. MathJax 미렌더 수식·broken asset은 0이다.

## LaTeX 감사와 최종 판정

`npm --prefix archive/tools/past-exam-pipeline run check`와 두 JS `node --check`는 PASS다. 공식 전역 명령

```powershell
node archive/tools/audit-latex-escapes.mjs --repo .
```

은 대상 밖에 이미 존재하던 다음 2건 때문에 `ok:false`다 (`global-latex-audit.json`).

- `archive/exams/_generated/alive-high1-operation-inputs/h22-c2-09.js` q3 answer: `runtime-bare-sqrt`
- `archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js` q15 solution: 기존 slash/runtime 결함

이 범위 밖 파일들은 사용자 지시에 따라 수정하지 않았다. 따라서 대상 작업의 독립검수·수학·SVG·실렌더는 PASS이지만, 전역 LaTeX HARD gate를 만족하지 못해 엄격한 최종 토큰은 `FAIL (GLOBAL_LATEX_AUDIT_BLOCKED_BY_PRE-EXISTING_OUT_OF_SCOPE_FINDINGS)`이다. `PASS / 전수검수 완료 / FINAL / SEALED`를 선언하지 않는다.

commit/push는 수행하지 않았다.
