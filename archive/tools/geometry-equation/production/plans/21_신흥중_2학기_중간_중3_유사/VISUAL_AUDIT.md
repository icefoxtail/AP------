# 21_신흥중_2학기_중간_중3_유사 — 공식 SVG production plan 정적 감사

- 원본 JS: `archive/exams/similar/middle/m3/2mid/21_신흥중_2학기_중간_중3_유사.js`; **문제 23축 + 해설 23축 = 46축** 독립 판정.
- 공식 geometry-equation 실행형 plan: **44개**, 근거 있는 EXEMPT: **2축**.
- 손 SVG·PNG·JS·자산 변경 없음. 기존 JS 참조 SVG **18/18개가 Git 메인 트리에 존재**함을 검증.
- 공식 plan-lint **shallow/full 각 44/44 PASS**, 정적 DRAWN_FEATURE_PARITY **44/44 PASS**. 독립 SymPy 및 기하 수치 감사 **불일치 0건**.
- 실제 SVG/PNG 렌더: **RENDER_NOT_RUN**; 이미지 픽셀 비교/학생 화면/A4: **NOT_RUN**. 정적 검증은 렌더 검증을 대체하지 않음.

| 문항 | 문제축 판정·근거 | 해설축 판정·근거 | 실제 필드 1:1 검증 | 공식 shallow/full | 실제 렌더 |
|---|---|---|---|---|---|
| q01 | REQUIRED — 5-12-13 직각삼각형에 직각과 세 변을 직접 표시 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:7 / S:7 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q02 | REQUIRED — 8-15-17 직각삼각형과 D에서 BC에 내린 수선 DE, 각 BDE의 위치 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:9 / S:10 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q03 | REQUIRED — 직선 y=2x+6과 양의 x축의 예각 및 해설의 기울기 1:2 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:3 / S:8 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q04 | REQUIRED — 실제 3차원 정육면체 모델의 AG 공간 대각선과 GE 밑면 대각선 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:6 / S:6 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q05 | EXEMPT — 특수각 삼각비의 값만 대입하는 사칙연산. 문제·해설 모두 도형과 무관한 수치계산이 완결됨. | EXEMPT — 해설은 같은 수치·관계의 계산과 표 해석으로 완결됨; 도식의 추가 교육적 정보가 없음 | 해당 없음 | 해당 없음 | 해당 없음 |
| q06 | REQUIRED — 반지름 1 사분원과 호의 점 A, x축 수선의 발 B 및 BD 구간 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:9 / S:9 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q07 | REQUIRED — 내심 I와 BIC=105도 및 직각 C의 위치 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:7 / S:7 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q08 | REQUIRED — AC=10,BC=14,각 C의 3:4:5 삼각비 비율 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:5 / S:8 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q09 | REQUIRED — B,C 사이 발 H와 서로 다른 두 앙각 45도,60도 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:8 / S:8 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q10 | REQUIRED — 변 AB=10,AC=15와 60도 각 A의 이등분선 AD | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:9 / S:9 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q11 | REQUIRED — 한 중심 둘레의 합동 마름모 6개의 60도 모임과 변 10 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:19 / S:19 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q12 | REQUIRED — 폭 6의 종이테이프 접기와 45도 이등변삼각형의 기하 관계 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:8 / S:8 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q13 | REQUIRED — 중심에서 현에 내린 수선 OM와 현 AB, 호상의 C까지 거리 MC=4 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:9 / S:10 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q14 | REQUIRED — 원 내 접선 길이가 아닌 중심에서 두 현으로 내린 수선의 동일 길이 3 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:12 / S:12 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q15 | REQUIRED — 반지름 6 원의 접기 대칭 축과 현 AB | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:6 / S:6 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q16 | REQUIRED — 중심에서 세 현에 내린 동거리 수선이 만드는 정삼각형 ABC | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:12 / S:12 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q17 | REQUIRED — 접선 PA,PB와 OP의 각 이등분, 반지름 OA,OB의 직각 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:9 / S:9 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q18 | REQUIRED — AB를 지름으로 하는 위쪽 반원과 세 접선 AD,CD,BC | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:9 / S:9 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q19 | REQUIRED — 두 접선의 접선분 길이 AC=4, CE=10, PC=12의 관계 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:9 / S:9 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q20 | REQUIRED — 원 외접 사각형의 네 변과 직각 C 및 대각선 BD | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:10 / S:10 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q21 | REQUIRED — 관측점에서 탑까지 수평거리 100m와 35도 앙각 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:6 / S:7 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q22 | BENEFICIAL — 정사각형의 중점 M,N과 각 MBN=x 및 삼각형 BMN | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:10 / S:13 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |
| q23 | REQUIRED — 9-12-15 직각삼각형과 반지름 3인 접원, 세 접점 | BENEFICIAL — 주어진 조건과 풀이의 해당 기하 관계를 도식으로 재확인 | P:8 / S:8 실제 필드 — **DRAWN_FEATURE_PARITY PASS** | PASS / PASS | RENDER_NOT_RUN |

- 수량 검증: 46축 = 44개의 실행형 JSON + 2축 EXEMPT. EXEMPT를 실행형 plan으로 세지 않음.
- 독립 검산은 plan의 SOURCE_POINT·유도 노드·실제 세그먼트·라벨·직각·각·원호·원의 좌표를 직접 평가함. 제목, caption, sourceConditions만으로 PASS 처리하지 않음.
- 이 사이클 합계: 실선/선분 334개, 직각 72개, 각도 40개, 수치 길이 라벨 122개, 원호 끝점 28개, 접선 거리 66개, 별도 합동 검산 8건, 수학 결과 검산 8건, 입체 수학 점검 8건, SVG 참조 31개: **불일치 0건**.

## 수정 근거 및 후속 구분

- 신흥중 q03/q06/q21의 기존 `kind`·`elements` 예비 스케치는 엔진 실행형이 아니므로 공식 construction plan으로 교체. q04는 정육면체를 공식 solid-figure PRISM으로 다시 모델링하고 q22는 중점·각·정사각형 필드 신규 작성.
- 신흥중 q14의 예비 SVG 계획은 `OM=ON=3`으로 적으면서 실제 수선 거리가 약 3.746이었고, q16은 `AB=12` 라벨에 실제 현 약 13.856, q17은 `AP=12` 라벨에 실제 선분 약 10.392였음. 반지름·점 좌표를 수정하여 실제 길이와 표시를 일치시킴.
- 연향중 q01은 반지름 `AO=17` 라벨이 전체 지름 AB에 붙은 오류를 AO 선분으로 분리. q12는 원호 누락을 공식 `planeMarks.arcs`로 추가하여 상반원 호만 표시.
- 엔진 기능 미지원으로 필수 그리기를 caption만으로 대신한 축: **0**. 제작용 plan을 갖추지 않은 필수 축: **0**.
- 실제 렌더·PNG/학생/A4 판정은 후속 렌더 단계에서 수행해야 하며 본 회차에서 PASS를 주장하지 않음.
- 외부 Windows 큐 문서는 이 환경에서 접근 불가. 큐 체크는 병합 확인과 별개로 미수정이며 [ ] 여부도 직접 판정하지 않음.
