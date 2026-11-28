# 21_매산중_2학기_중간_중3_유사 — SVG production plan 정적 감사

- 원본: `archive/exams/similar/middle/m3/2mid/21_매산중_2학기_중간_중3_유사.js`
- 문제·해설 2축 전수 판정, 손 SVG·PNG·JS 수정 없음.
- 렌더 / 학생 화면 / A4: **RENDER_NOT_RUN / NOT_RUN / NOT_RUN**.
- 공식 plan-lint **shallow/full 전부 PASS**, 실제 그리기 필드와 독립 SymPy 수치 검산 **PASS** (불일치 0). 원본 JS의 SVG 참조 자산 **8/8개 존재**.

| qid | 문제축 | 해설축 | 근거 | 필드 검수 | 공식 shallow/full | 실제 렌더 |
|---|---|---|---|---|---|---|
| q01 | REQUIRED | BENEFICIAL | 직각과 변 5·12·13이 실제 길이 비로 그려짐 | P:7 / S:7 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q02 | REQUIRED | BENEFICIAL | 길이비 3:4와 직각을 그리되 문제 축에 √7 길이 정답 비공개 | P:6 / S:7 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q03 | EXEMPT | EXEMPT | 특수각 삼각비 값의 사칙 계산이며 도형이 문제의 추가 정보를 제공하지 않음 | 해당 없음 | 해당 없음 | 해당 없음 |
| q04 | EXEMPT | EXEMPT | 본문에 삼각비 수치표가 이미 제시되어 있으며 독립 그림은 필요하지 않음 | 해당 없음 | 해당 없음 | 해당 없음 |
| q05 | REQUIRED | BENEFICIAL | 문제의 미지 x,y를 값 대신 실제 변 옆에 표시 | P:8 / S:8 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q06 | REQUIRED | BENEFICIAL | 좌표평면의 축과 단위원 OA=1, AB⊥OA, 각 x를 공식 좌표 작도로 표현 | P:9 / S:9 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q07 | REQUIRED | BENEFICIAL | 기존 원본 SVG 관계와 8-15-17 닮음 조건을 실제 수선으로 표현 | P:11 / S:12 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q08 | EXEMPT | EXEMPT | 겹치지 않는 합동 마름모 5장의 배치가 특정되지 않음; 임의 배치 그림은 원문 조건 이상을 꾸며냄 | 해당 없음 | 해당 없음 | 해당 없음 |
| q09 | REQUIRED | BENEFICIAL | 공식 REGULAR_POLYHEDRON 정사면체와 엔진 중점·공간각 기능으로 구현 | P:1 / S:1 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q10 | REQUIRED | BENEFICIAL | 원본 그림의 고도선 AH·빗변 AB·30°를 실제 좌표로 작도 | P:9 / S:10 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q11 | REQUIRED | BENEFICIAL | 높이차 두 직각삼각형의 공통 수평거리와 부호·각을 표시 | P:11 / S:13 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q12 | REQUIRED | BENEFICIAL | 직선의 기울기 2/3과 x절편 -3, y절편 2를 실제 좌표로 연결 | P:4 / S:4 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q13 | REQUIRED | BENEFICIAL | 3:4:5 비의 9-12-15 직각삼각형과 주어진 변 BC 표시 | P:5 / S:7 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q14 | REQUIRED | BENEFICIAL | 원 중심에서 현에 내린 수선과 현의 이등분 구조 | P:10 / S:12 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q15 | REQUIRED | BENEFICIAL | 5-12-13 직각삼각형을 현의 절반과 반지름으로 표시 | P:10 / S:11 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q16 | REQUIRED | BENEFICIAL | 두 접선과 반지름의 직각 및 PA=PB 실제 기하 일치; x의 값 문제 축 비공개 | P:11 / S:11 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q17 | REQUIRED | BENEFICIAL | 임의 예시 작은 반지름 5에 대한 R²-r²=36을 만족하는 동심원 작도 | P:10 / S:10 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q18 | REQUIRED | BENEFICIAL | 삼각형 반둘레 18, 접선분 AD=AF=6의 실제 접원과 접점으로 작도 | P:19 / S:20 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q19 | REQUIRED | BENEFICIAL | 8-15-17 직각삼각형과 실제 원의 접선 관계 | P:7 / S:8 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q20 | REQUIRED | BENEFICIAL | 두 교점 중 볼록한 D를 정확한 근호 좌표로 선택하고 반지름 2+√2인 접원 구성 | P:10 / S:12 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q21 | REQUIRED | BENEFICIAL | 수준별 1-①/② 두 문항을 한 가지 도형으로 합치지 않고 공식 평면 패널 2개로 제작 | P:11 / S:11 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q22 | REQUIRED | BENEFICIAL | 서로 다른 두 수준별 문제를 빠짐없이 도식화 | P:17 / S:17 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q23 | REQUIRED | BENEFICIAL | 수준별 3-①/②를 별도 패널로, ②의 사각형 DBEI를 실제 선분으로 표현 | P:23 / S:23 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q24 | REQUIRED | BENEFICIAL | 원에 내린 수선·접점과 다섯 소문항 길이를 실제 좌표에서 검증 | P:16 / S:21 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |

- 문항 24개 / 총 48축: 계획 42개, EXEMPT 6축.
- 정적 필드 감사: 문제·해설 **42축 전부 PASS**. 공식 shallow lint 및 full lint 각 **42/42 PASS**.
- 실제 점 좌표 독립 검산: 선분 236, 수치 길이 라벨 88, 각 24, 직각 58, 같은 길이 4묶음, 원호 끝점 0, 원 반지름 24, 그래프 필수점 0, 원 접선거리 14: **불일치 0**.
- 입체 정사면체는 공간모델·중점·각의 공식 full lint를 별도로 통과; 합성 수준별 문제는 각각 2패널을 전부 검수.
- 독립검사의 입력은 저장된 실제 plan JSON의 좌표·라벨·그림 필드이며 caption/sourceConditions 텍스트만으로 PASS 처리하지 않음.
- 공식 렌더 SVG·PNG 픽셀 대조·학생 화면·A4는 수행하지 않았으므로 **RENDER_NOT_RUN / NOT_RUN / NOT_RUN / NOT_RUN**. 이 정적 PASS는 렌더 시각 PASS를 의미하지 않음.
