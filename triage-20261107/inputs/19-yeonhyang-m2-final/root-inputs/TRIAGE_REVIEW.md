# 19 연향중 2학기 기말 중2 입력 판정 및 검토

- Source: `archive/exams/original/middle/m2/2final/19_연향중_2학기_기말_중2_기출.js` (SHA-256 `21c76cbc84ae75c5ca61130579d786f8b1f6110f14d56e870cc1171e3b4e7fec`)
- Source items: 24; figures: 12; exempt: 12; source PNGs: 12.
- Existing question PNGs remain read-only; these are separate solution-figure input candidates. EXEMPT plans have no publish.json. All figure publish.json files are drafts and have no final renderer size.
- Current validation boundary: construction plans use the pinned construction-spike-v1 runner; Q09 uses the local solid-figure-v1 plan/model/spec check. Plane mark and region declarations are checked by the current plane-marks and plane-regions contracts. The local full phase2/composite/render/review stack is stale for current main; no claim of final SVG/official renderer qualification is made. All publish.json files remain drafts without final renderer size.

| ID | Decision | Source answer | Reason / warning |
|---|---|---|---|
| Q01 | FIGURE | ④ | 중선·무게중심의 거리비를 도형으로 보이는 편이 선택지 검토에 유리하다. |
| Q02 | FIGURE | ③ | 두 단계 무게중심과 전체·부분 넓이 관계가 도형에서 명확해진다. |
| Q03 | FIGURE | ① | 두 무게중심 사이 거리와 BC의 평행 관계를 도형으로 설명한다. |
| Q04 | FIGURE | ① | 세 변 바깥에 놓인 정사각형의 대응과 직각삼각형을 함께 보인다. |
| Q05 | FIGURE | ④ | 공유 밑변의 두 직각삼각형과 x,y의 위치를 유지한다. |
| Q06 | FIGURE | ② | 두 정사각형 및 AE 대각선 교차 위치가 계산의 핵심이다. |
| Q07 | EXEMPT | ②,⑤ | 세 변의 제곱 비교는 간단한 식으로 충분해 새 그림이 더하지 않는다. |
| Q08 | FIGURE | ④ | 네 초승달의 경계인 원호와 색칠 영역이 해법에 직접 필요하다. |
| Q09 | FIGURE | ③ | 정육면체 맞은편 꼭짓점 사이 최단 모서리 경로를 한 예로 시각화한다. |
| Q10 | EXEMPT | ③ | 동전 개수별 정수 경우 3개를 짧게 열거하면 충분하다. |
| Q11 | EXEMPT | ④ | 원문의 메뉴판 표 자체가 필요한 정보이므로 기존 문제 이미지로 충분하다. |
| Q12 | EXEMPT | ⑤ | 각 y값의 경우 수를 식 두 줄로 설명할 수 있다. |
| Q13 | EXEMPT | ② | 13×12÷2 계산이 직접적이어서 그림이 필요 없다. |
| Q14 | FIGURE | ① | 평행선 위 점 선택 원리를 대표 삼각형과 함께 설명한다. |
| Q15 | EXEMPT | ① | 3의 배수·5의 배수 목록과 교집합 수를 식으로 제시하면 충분하다. |
| Q16 | EXEMPT | ④ | 복원추출의 독립 시행은 4/9×4/9 한 식으로 명확하다. |
| Q17 | FIGURE | ① | 네 영역의 정확한 인접 그래프가 색칠 경우 계산의 핵심이다. |
| Q18 | EXEMPT | ② | 여사건 1−6×5×4/6³가 간단하고 충분하다. |
| Q19 | EXEMPT | ⑤ | 묶음 원리와 1−48/120 계산을 식으로 설명하면 충분하다. |
| Q20 | EXEMPT | ⑤ | 발문은 두 신호 정답 사건의 독립을 말하지 않는다. 정답 ⑤(2/3)는 해설의 독립 가정이 추가될 때만 유도된다. |
| Q21 | FIGURE | 16 cm | 중선 위의 G와 G′ 및 거리비가 서술형 풀이의 핵심이다. |
| Q22 | FIGURE | 20, 52 | 빗변이 6인 경우와 a인 경우를 구분해야 하므로 두 예시 도형을 나란히 보인다. |
| Q23 | EXEMPT | (1) 24가지, (2) 24가지 | 3×4×2=24와 홀짝 균등은 세 줄 계산으로 충분하다. |
| Q24 | EXEMPT | 은도끼 복권 | 풀이의 1/15 및 1/13 비교는 가능한 당첨 조합이 동등하게 가능하다는 전제를 쓴다. 이는 원문에 적힌 당첨 규칙과 구분한다. |

## High-risk source/contract checks

- Q06: source labels A…G and JS coordinates agree with the screenshot. Internal geometry review confirms AE crosses the square side CG at (12,3), not at G=(12,4); no false incidence or point merge is encoded. That coordinate note is kept in this review/plan note and omitted from the student-facing caption and publish text.
- Q08: four highlighted semi-circles plus four mixed straight/arc free-loop regions are supported by the current plane-region contract; the region tool checks drawn coverage and exact sweep. Use no HOLD.
- Q09: a fixed orthographic PRISM/RECT with depth-tested AUTO segments is supported; the highlighted route uses E→H→G→C. The source start is E and opposite upper/back destination is C in this vertex mapping. Model check reports route edges visible and hidden edges E-F, F-G, F-B, automatically dashed by depth.
- Q17: direct screenshot/source solution agree on exactly A-B, A-C, B-C, B-D, C-D; A-D is not adjacent. Polygon edge inventory is de-duplicated and has no A-D shared boundary.
- Q20: visual triage EXEMPT; the independent assumption is not inserted into the original prompt and stays a content warning.
- Q21: unlike Q02, scale was fixed to preserve AG=12 cm exactly (AG=12, GD=6, GG′=4, AG′=16).
- Q24: equal-likelihood outcomes are recorded as a solver assumption, not a prompt fact.

## Validation results

- `construction-validation-results.json`: pinned construction contract and executable math model passed for Q01–Q06, Q08, Q14, Q17, Q21, Q22 (11/11); provenance audit PASS for all.
- `plane-mark-region-validation-results.json`: current plane-marks and plane-regions contract checks passed for all 11 plane plans; Q08's four highlighted arcs and four mixed arc/line loops all validate.
- `q09-solid-validation.json`: solid-figure-v1 model/spec construction passed with `SOLID_FIGURE_MODEL_v2`, yaw 28°, pitch 20°, three route edges visible; hidden back edges are depth-classified. No renderer output or final SVG observer ran.
- Coverage integrity check: 24 source ordinals each have an exact item binding and plan; 12 FIGURE + 12 EXEMPT; only FIGURE has publish draft; every quote matches source prompt; Q17 unique adjacency set exactly `{A-B,A-C,B-C,B-D,C-D}`.
- The engine renderer, full current phase2, official publication pipeline, independent final-SVG observers, final size-class and layout/accessibility review were not run.
