# 22 매산고 고2 수학I 1학기 중간 — SVG 입력 판정

- 원문: `archive/exams/original/high/h2/1mid/22_매산고_1학기_중간_고2_수학I.js` (blob `87cbfcd33cb71672a60effac24b67a18f2bfb07e`), questionBank 20문항 Q01–Q20.
- 최신 기준 커밋: `3d4ba3bf88a56daed262fa8cbe1cbaf1639e971e` (2026-11-11 12:55 UTC에 갱신된 main). 계약 파일 blob: phase2 `162671c18144ade668e7f6201890c465f650ec0f`; graph framing `cccea19db583f5fa56d0a0c99d7445a4a761c004`; number line `aeac72606b976e692b1da1e7d690eb2f4abda736`; construction `1544db76302491f0325dfff4292f9b712ae71f50`; plane marks `4d8d56e5877a2eada87191073d1f64f68e2f42e2`; semantic model `7cf3cabe87d7c8e551065d35ec5c2d9a7bbe1d21`; geometry engine `a8454a161bf844dbe35c1170d787b4ed717894b0`; `AUTHOR_GUIDE.md` `7c53de0abbf5fcd77a99a532c8db8b6b3c21b41e`.
- 작업 범위: `triage-20261107/inputs/22-maesan-h2-math1-1mid/root-inputs/qNN/` 아래 item/plan/publish/STATUS만 신규 작성. 기존 PNG Q03/Q09/Q11/Q14 및 기존 SVG Q09/Q12/Q14/Q15/Q18/Q20은 건드리지 않았다. SVG/PNG 렌더 산출물은 생성물에 포함하지 않았고 브라우저 visual QA도 하지 않았다.
- 현재 작성: `item.json` 20개, `plan.json` 20개, `STATUS.md` 20개, `publish.json` 8개. 결과: 8 plan-ready, 9 exempt, 3 unsupported. 모든 입력은 미렌더 상태다.

| 문항 | 판정 | 결과 / 근거 |
|---|---|---|
| Q01 | EXEMPT | 같은 밑 로그 계산 |
| Q02 | EXEMPT | 중첩 근호를 거듭제곱으로 바꾸는 지수 계산 |
| Q03 | PLAN_READY_NOT_RENDERED | 밑 3 지수·로그 역함수와 y=x. frame/graph/spec/semantic prepare 통과. 엔진이 exp-log 곡선의 임의 좌표 앵커를 지원하지 않아 (2,9),(9,2) 표시는 생략했다 (`OVERLAY_POINT_CURVE_UNKNOWN`). |
| Q04 | EXEMPT | 기호 각의 삼각함수 항등식. 임의 수치각 예시는 근거가 아님 |
| Q05 | PLAN_READY_NOT_RENDERED | QIII 3–4–5 도형. construction model/spec/prepare 및 `of4`, `fp3`, `op5`, `rightAtF` audits 통과 |
| Q06 | EXEMPT | 실수 n제곱근 정의 판별 |
| Q07 | EXEMPT | 로그 조건의 대수 치환 |
| Q08 | EXEMPT | 로그 밑변환·치환 계산 |
| Q09 | PLAN_READY_NOT_RENDERED | h=f−4와 g의 정확한 곡선, 표시 범위 1≤x≤6. `piecewise-polynomial` + `referenceCurves`로 semantic prepare 통과. 본래 multi-curve plan은 prepare에서 `INVALID_GRAPH_BRANCH_TAG`여서 쓰지 않았다. y:x 눈금 비는 1:4이며 캡션·alt에 비례 개형이 아님을 공개. 곡선 간 교점 목록은 `(13−√13)/2` 하나. |
| Q10 | EXEMPT | 치환으로 계산하는 순수 지수 대수 |
| Q11 | PLAN_READY_NOT_RENDERED | y=sin(3x)−1, 정확히 한 주기 `[-π/3,π/3]`, 주기 2π/3. trig frame/graph/spec/semantic prepare 통과. x축 π 눈금 ±π/4만 사용; y눈금은 `TICK_PI_LABEL_MISMATCH`가 나서 제외했고 극값·중심선은 key points로 둔다. |
| Q12 | PLAN_READY_NOT_RENDERED | u=x/π 정규화 수직선. 두 조건 `[1/3,5/3]`, `[0,1/4]∪[5/4,2)` 및 정확한 교집합 `[5/4,5/3]`. expand/solve/layout/spec 통과. |
| Q13 | PLAN_READY_NOT_RENDERED | 양의 사분면에 해당하는 원호와 극점 도형. construction model/spec/prepare 및 원 위 membership 네 건 통과; 전체 원은 표시하지 않는다. |
| Q14 | PLAN_READY_NOT_RENDERED | 주어진 밑변 길이·평행·교점비를 동시에 만족하는 한 정확한 사다리꼴 예. 7 geometry audits 통과; 대칭/각 조건을 추가하지 않는다. |
| Q15 | UNSUPPORTED | 역함수 두 곡선 사이 넓이 및 주기·정수 n 경우를 현재 계약이 전체적으로 표현하지 못함 |
| Q16 | EXEMPT | 곱셈공식 지수 계산 |
| Q17 | PLAN_READY_NOT_RENDERED | u∈[-1,1]의 이차식 단조 감소. frame/graph/spec/semantic prepare 통과 |
| Q18 | UNSUPPORTED | 매개변수 수평선과 SIN/COS 두 곡선의 간격 비교를 지원하지 않음. 고정 예시로 일반 결론을 대체하지 않음 |
| Q19 | EXEMPT | 로그 근삿값을 이용한 자리 수 계산 |
| Q20 | UNSUPPORTED | 정확한 복합 지수·로그 조각함수와 역함수 세 교점 동시 표현을 지원하지 않음 |

## 검사 기록

- 2026-11-11 12:58 UTC: Q03, Q05, Q09, Q11, Q13, Q14, Q17에서 현재 계약 frame/model/spec/semantic prepare 확인. Q05 construction audits 4건, Q13 circle-membership audits 4건, Q14 geometry audits 7건 전부 PASS. Q12는 `expandNumberLineFigure`, `solveNumberLineFigure`, `figureLayout`, `numberLineFigureSpec`과 정확한 RESULT 교집합을 확인했다.
- Q11의 실제 검사에서 0을 y tick으로 지정하면 `INVALID_AXIS_TICK_VALUE:y`; π tick을 닫힌 구간 끝에 놓으면 `TRIG_PI_TICK_OUTSIDE_VIEW`; π x-ticks와 y-ticks를 같이 쓰면 `TICK_PI_LABEL_MISMATCH`가 확인됐다. 최종안은 내부 x π-ticks만 두고 y ticks를 비웠다.
- Q09는 multi-curve `frame_graph`/`graph`/spec까지는 가능했지만 semantic prepare가 `INVALID_GRAPH_BRANCH_TAG`로 거절했다. 같은 정확 함수 관계를 현행 `piecewise-polynomial` + `referenceCurves` 계약으로 재표현해 semantic prepare까지 통과했다. f 원문으로부터 `f(x)=−(4/3)(x−3)(x−7)`, `h(x)=f(x)−4=−(4/3)(x−4)(x−6)`, `g(x)=−4(x−5)`를 독립 전개했다.
- 화면 렌더, 캡처, 독립 SVG observer, 실제 archive publication은 실행하지 않았다. 입력 준비 및 semantic preflight만 완료했다.
- 지정 구현자 확인이 없어 외부 인계하지 않았다. 렌더·visual QA·publication은 하지 않았으며, 이 초안에는 계획 입력만 담았다.
