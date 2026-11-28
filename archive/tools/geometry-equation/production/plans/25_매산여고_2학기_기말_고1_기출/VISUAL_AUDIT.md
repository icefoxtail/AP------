# 2025 순천매산여고 고1 2학기 기말 — 문제·해설 46축 SVG 판정

- 대상: `archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js`
- 상태: **공식 production plan 14건 작성·lint 완료**, 실제 SVG 제작·학생 출고 판정은 아님. `main` 병합 금지(최종 검수 전).
- 입력: 원본 시험지 6쪽과 현행 JS 23문항. 기출 원본 그림은 3번·15번의 함수 대응도.
- 플랜 원칙: 수작업 SVG 및 시험지 PDF에서 그림 PNG 절취 금지. 공식 `set-diagram-figure-v1` 등 엔진 JSON만 작성한다.
- 검사 진실값: 본 감사는 문제·해설 필요성의 정적 판정이다. 공식 엔진 shallow lint **14/14 PASS**, full lint **14/14 PASS**(2026-11-28, 기존 문제 plan 2건 포함), SVG render **NOT_RUN**, 390px/A4 PNG 실물 검수 **NOT_RUN**, 학생 UI **NOT_RUN**.

| qid | 문제 그림 | 해설 그림 | 개별 판정 이유와 플랜 상태 |
| --- | --- | --- | --- |
| 01 | EXEMPT | EXEMPT | 함의의 참거짓과 정수 경계는 부등식만으로 충분. |
| 02 | EXEMPT | EXEMPT | 드모르간 법칙으로 교집합을 분리하면 원소가 정해짐; 임의의 벤다이어그램은 미지의 A 소속을 추정하게 됨. |
| 03 | REQUIRED | BENEFICIAL | 원문에 직접 주어진 두 함수의 화살표가 필수. 문제 plan 유지, 합성·역방향 경로 해설 plan 추가 작성. |
| 04 | EXEMPT | EXEMPT | 두 유리식 통분과 계수 비교의 순수 계산. |
| 05 | EXEMPT | EXEMPT | 근호 조건과 시작값으로 정의역·치역 확인 가능. |
| 06 | EXEMPT | BENEFICIAL | 점근선 이동 전후를 그래프에 표시하면 두 축 방향의 이동량을 이해하기 쉬움. 해설 plan 작성. |
| 07 | EXEMPT | EXEMPT | 제한된 닫힌구간의 단조성·끝점 대입으로 완결. |
| 08 | EXEMPT | EXEMPT | 양수 치환과 산술평균·기하평균의 관계만 사용. |
| 09 | EXEMPT | EXEMPT | 다항식 인수분해와 공집합 제외 부분집합 계산. |
| 10 | EXEMPT | BENEFICIAL | `~q` 닫힌구간이 `p`의 반열린구간에 들어가는 경계 관계를 수직선으로 확인하면 유익. 해설 plan 작성. |
| 11 | EXEMPT | BENEFICIAL | 점근선과 `y=x+1` 대칭축을 같은 좌표평면에 그리면 문장 ㄱ~ㄷ의 판단이 직관적. 해설 plan 작성. |
| 12 | EXEMPT | EXEMPT | 두 일차식의 기울기 부호 비교가 매개변수 전체를 증명함. 특정 a 그래프 한 장은 일반성을 보장하지 못함. |
| 13 | EXEMPT | BENEFICIAL | 평행이동과 y축 대칭의 순서를 그래프에서 보여 주면 계수 부호 오류를 줄일 수 있음. 해설 plan 작성. |
| 14 | EXEMPT | BENEFICIAL | 제한구간 끝점의 교점과 함수 `h(x)`의 단조성을 그래프로 확인하면 유익. 해설 plan 작성. |
| 15 | REQUIRED | EXEMPT | 원문 함수 `f`의 대응도 필수. 문제 plan `q15-problem.plan.json` 작성; 해설은 그 대응도로 구한 치역 원소 3개의 배치 수 계산이므로 추가 그림은 중복. |
| 16 | EXEMPT | BENEFICIAL | 구간별 함수 치역 `(-2,2)`와 `[2,∞)`의 맞물림을 수직선/그래프로 설명하면 유익. 원문 근호 밖 `+1` 반영한 해설 plan 작성. |
| 17 | EXEMPT | BENEFICIAL | 무리함수·역함수와 `y=x`의 교점 수를 보이면 제곱 후 가짜 해를 제외하는 이유가 선명함. 해설 plan 작성. |
| 18 | EXEMPT | REQUIRED | 두 무리함수의 평행이동과 평행한 직선 사이 넓이를 평행사변형으로 바꾸는 핵심 관계가 시각적. 해설 plan 작성, 렌더 필수. |
| 19 | EXEMPT | BENEFICIAL | 조각함수 `f(t)`와 방정식 `t+f(t)=4`의 해 위치를 그래프에 표시하면 근 후보의 개수가 명확함. 해설 plan 작성. |
| 20 | EXEMPT | BENEFICIAL | `p`·`q`의 열린구간과 정수 반례 0, 1, 2, 3을 같은 수직선에 표시하면 경계 조건을 확인하기 쉬움. 해설 plan 작성. |
| 21 | EXEMPT | EXEMPT | 명제 부정과 완전제곱 최소값 판단으로 완결. |
| 22 | EXEMPT | BENEFICIAL | 무리함수와 직선의 두 교점 및 `k=2` 경계 상황을 보여 주면 `t≥0` 조건을 이해하기 쉬움. 해설 plan 작성. |
| 23 | EXEMPT | EXEMPT | 유리함수의 두 방정식을 풀고 양의 근을 순서대로 비교하는 계산으로 완결. 원문 '오직 한 개의 음의 실근만'은 양의 근 추가를 배제하지 않아 정답이 불유일하므로, JS 발문에서 실근이 정확히 하나임을 최소 명확화함(원문과 다름; R1 검증 필요). |

## 계획 파일 현황

1. 문제 필수: `q03-problem.plan.json` — 기존 원문 6화살표 plan 보존, 공식 shallow/full lint **PASS**.
2. 문제 필수: `q15-problem.plan.json` — 기존 원문 4화살표 plan 보존, 공식 shallow/full lint **PASS**.
3. 해설 필요 12축: q03·q06·q10·q11·q13·q14·q16·q17·q18·q19·q20·q22 — 공식 production JSON **12개 신규 작성**, shallow/full lint **12/12 PASS**.
4. 학생 표시 연결: JS `image`·`solutionImage`는 엔진 생성 SVG가 아직 없으므로 비워 둠. 존재하지 않는 경로를 쓰지 않음.

## 다음 단계

- 기존 문제 2건 및 신규 해설 12건 모두 공식 `plan-lint` shallow/full을 통과했으므로, 다음은 **실제 엔진 렌더·도형 관계 시각 대조**다.
- 해설 REQUIRED인 q18부터 다른 BENEFICIAL 11축까지 SVG 실물을 제작·시각 검수한다.
- 모든 필수 SVG 파일 생성 후 JS 자산 참조, 메타·R1/R2/R3 검수와 함께 출고 판정.
