# 21_연향중_2학기_중간_중3_유사 — 공식 SVG production plan 정적 감사

- 원본 JS: `archive/exams/similar/middle/m3/2mid/21_연향중_2학기_중간_중3_유사.js`; **문제 21축 + 해설 21축 = 42축** 독립 판정.
- 공식 geometry-equation 실행형 plan: **26개**, 근거 있는 EXEMPT: **16축**.
- 손 SVG·PNG·JS·자산 변경 없음. 기존 JS 참조 SVG **13/13개가 Git 메인 트리에 존재**함을 검증.
- 공식 plan-lint **shallow/full 각 26/26 PASS**, 정적 DRAWN_FEATURE_PARITY **26/26 PASS**. 독립 SymPy 및 기하 수치 감사 **불일치 0건**.
- 실제 SVG/PNG 렌더: **RENDER_NOT_RUN**; 이미지 픽셀 비교/학생 화면/A4: **NOT_RUN**. 정적 검증은 렌더 검증을 대체하지 않음.

| 문항 | 문제축 판정·근거 | 해설축 판정·근거 | 실제 필드 1:1 검증 | 공식 shallow/full | 실제 렌더 |
|---|---|---|---|---|---|
| q01 | REQUIRED — 반지름 17인 원의 지름 AB와 원주각 C=90도, 현 BC=16 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:8 / S:8 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q02 | REQUIRED — 반지름 1 사분원과 32도에 따른 수선·좌표 비율 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:11 / S:11 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q03 | EXEMPT — 세 변의 기호 관계 a²+b²=c², b=√3a만으로 직각과 비를 계산하며 별도 도식은 결과 설명을 추가하지 않음. | EXEMPT — 해설은 같은 수치·관계의 계산과 표 해석으로 완결됨; 도식의 추가 교육적 정보가 없음 | 해당 없음 | 해당 없음 | 해당 없음 |
| q04 | EXEMPT — 특수각 삼각비 식의 참·거짓을 대수적으로 평가하는 객관식; 시각 요소가 핵심 조건이 아님. | EXEMPT — 해설은 같은 수치·관계의 계산과 표 해석으로 완결됨; 도식의 추가 교육적 정보가 없음 | 해당 없음 | 해당 없음 | 해당 없음 |
| q05 | REQUIRED — 단위원 호 점의 x가 90도로 갈 때 길이·각 변화 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:8 / S:8 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q06 | REQUIRED — 34도 사분원에서 OB=cos34도와 BD=1-OB의 관계 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:9 / S:9 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q07 | REQUIRED — 중심에서 같은 거리 4인 두 평행 현과 반지름 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:10 / S:10 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q08 | REQUIRED — 중심에서 두 현에 내린 수선과 중심각 BOC=110도 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:15 / S:15 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q09 | REQUIRED — 내접원에 접하는 삼각형의 접선분 7·12·14 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:8 / S:9 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q10 | REQUIRED — 지름방향 현 AB의 절반 12와 CD=6 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:9 / S:9 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q11 | REQUIRED — 외접 두 원의 공통 접선과 공통 접점 T, 접선분 PA=PB=PT | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:4 / S:4 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q12 | REQUIRED — 반원의 현 AB와 중심수선 CD, 접선·원호의 길이 12/6 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:8 / S:8 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q13 | REQUIRED — 8×11 직사각형의 세 변에 접하는 원과 DE의 추가 접선 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:8 / S:8 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q14 | EXEMPT — 두 자료의 중앙값 조건을 정렬·부등식으로 비교하는 통계 계산. 실제 수직선 그림의 교육적 추가 가치가 낮음. | EXEMPT — 해설은 같은 수치·관계의 계산과 표 해석으로 완결됨; 도식의 추가 교육적 정보가 없음 | 해당 없음 | 해당 없음 | 해당 없음 |
| q15 | EXEMPT — 선수별 평균과 표준편차를 이미 표가 모두 제시하며, 별도 도표는 같은 수치를 반복함. | EXEMPT — 해설은 같은 수치·관계의 계산과 표 해석으로 완결됨; 도식의 추가 교육적 정보가 없음 | 해당 없음 | 해당 없음 | 해당 없음 |
| q16 | EXEMPT — 두 모둠의 성적 5개를 이미 표로 제시하고 평균·중앙값·최빈값만 비교함. | EXEMPT — 해설은 같은 수치·관계의 계산과 표 해석으로 완결됨; 도식의 추가 교육적 정보가 없음 | 해당 없음 | 해당 없음 | 해당 없음 |
| q17 | EXEMPT — 네 자료 집합의 중앙값과 최빈값을 순서대로 계산하는 판단으로, 그림보다 정렬 과정이 적절함. | EXEMPT — 해설은 같은 수치·관계의 계산과 표 해석으로 완결됨; 도식의 추가 교육적 정보가 없음 | 해당 없음 | 해당 없음 | 해당 없음 |
| q18 | EXEMPT — 두 학급의 동일 평균과 분산을 가중 평균하는 순수 통계식 계산; 그림에서 새로운 기하 관계가 없음. | EXEMPT — 해설은 같은 수치·관계의 계산과 표 해석으로 완결됨; 도식의 추가 교육적 정보가 없음 | 해당 없음 | 해당 없음 | 해당 없음 |
| q19 | REQUIRED — 직각삼각형의 두 단계 수선 CD,DE 및 BE=3,EC=12 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:13 / S:14 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q20 | REQUIRED — 직각삼각형의 내접원과 접점 D,E,F 및 BE=8,CE=12 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:10 / S:10 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q21 | EXEMPT — 모든 변량을 3만큼 평행이동할 때 평균·분산 불변 성질을 식으로 설명하면 완결됨. | EXEMPT — 해설은 같은 수치·관계의 계산과 표 해석으로 완결됨; 도식의 추가 교육적 정보가 없음 | 해당 없음 | 해당 없음 | 해당 없음 |

- 수량 검증: 42축 = 26개의 실행형 JSON + 16축 EXEMPT. EXEMPT를 실행형 plan으로 세지 않음.
- 독립 검산은 plan의 SOURCE_POINT·유도 노드·실제 세그먼트·라벨·직각·각·원호·원의 좌표를 직접 평가함. 제목, caption, sourceConditions만으로 PASS 처리하지 않음.
- 이 사이클 합계: 실선/선분 334개, 직각 72개, 각도 40개, 수치 길이 라벨 122개, 원호 끝점 28개, 접선 거리 66개, 별도 합동 검산 8건, 수학 결과 검산 8건, 입체 수학 점검 8건, SVG 참조 31개: **불일치 0건**.

## 수정 근거 및 후속 구분

- 신흥중 q03/q06/q21의 기존 `kind`·`elements` 예비 스케치는 엔진 실행형이 아니므로 공식 construction plan으로 교체. q04는 정육면체를 공식 solid-figure PRISM으로 다시 모델링하고 q22는 중점·각·정사각형 필드 신규 작성.
- 신흥중 q14의 예비 SVG 계획은 `OM=ON=3`으로 적으면서 실제 수선 거리가 약 3.746이었고, q16은 `AB=12` 라벨에 실제 현 약 13.856, q17은 `AP=12` 라벨에 실제 선분 약 10.392였음. 반지름·점 좌표를 수정하여 실제 길이와 표시를 일치시킴.
- 연향중 q01은 반지름 `AO=17` 라벨이 전체 지름 AB에 붙은 오류를 AO 선분으로 분리. q12는 원호 누락을 공식 `planeMarks.arcs`로 추가하여 상반원 호만 표시.
- 엔진 기능 미지원으로 필수 그리기를 caption만으로 대신한 축: **0**. 제작용 plan을 갖추지 않은 필수 축: **0**.
- 실제 렌더·PNG/학생/A4 판정은 후속 렌더 단계에서 수행해야 하며 본 회차에서 PASS를 주장하지 않음.
- 외부 Windows 큐 문서는 이 환경에서 접근 불가. 큐 체크는 병합 확인과 별개로 미수정이며 [ ] 여부도 직접 판정하지 않음.
