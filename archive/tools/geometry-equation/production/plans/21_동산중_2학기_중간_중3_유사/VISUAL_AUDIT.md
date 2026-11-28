# 21_동산중_2학기_중간_중3_유사 — SVG production plan 정적 감사

- 원본: `archive/exams/similar/middle/m3/2mid/21_동산중_2학기_중간_중3_유사.js`
- 문제·해설 2축 전수 판정, 손 SVG·PNG·JS 수정 없음.
- 렌더 / 학생 화면 / A4: **RENDER_NOT_RUN / NOT_RUN / NOT_RUN**.
- 공식 plan-lint **shallow/full 전부 PASS**, 실제 그리기 필드와 독립 SymPy 수치 검산 **PASS** (불일치 0). 원본 JS의 SVG 참조 자산 **6/6개 존재**.

| qid | 문제축 | 해설축 | 근거 | 필드 검수 | 공식 shallow/full | 실제 렌더 |
|---|---|---|---|---|---|---|
| q01 | EXEMPT | EXEMPT | 수직 평행이동의 미지 q를 대입해 구함. 임의로 이동한 곡선을 미리 그리면 답을 노출함 | 해당 없음 | 해당 없음 | 해당 없음 |
| q02 | EXEMPT | EXEMPT | 이차함수의 평행이동과 꼭짓점 좌표를 식으로 계산; 미지 a,b,c를 그림에 고정하면 답 노출 | 해당 없음 | 해당 없음 | 해당 없음 |
| q03 | EXEMPT | EXEMPT | 수평 평행이동 후 함수식을 구하는 순수 대수 계산; 별도 정적 그림이 필수 조건은 아님 | 해당 없음 | 해당 없음 | 해당 없음 |
| q04 | EXEMPT | EXEMPT | 두 포물선의 수평 이동과 계수를 식으로 비교하는 계산; 미지 p의 정답 노출 방지 | 해당 없음 | 해당 없음 | 해당 없음 |
| q05 | EXEMPT | EXEMPT | 정해진 두 축 평행이동에 따른 이차함수의 식 변형으로 완결 | 해당 없음 | 해당 없음 | 해당 없음 |
| q06 | REQUIRED | BENEFICIAL | 원본이 그림을 지시하지만 JS image가 비어 있음. 꼭짓점과 원점을 실제 곡선으로 복원 | P:3 / S:3 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q07 | EXEMPT | EXEMPT | 완전제곱식 변형으로 계수 a,p,q를 읽는 계산; 독립 도형 없이 완결 | 해당 없음 | 해당 없음 | 해당 없음 |
| q08 | EXEMPT | EXEMPT | 제3사분면 통과 여부의 모든 x<0 조건으로 a의 범위를 판정; 임의의 대표 a 곡선은 전체 범위를 나타내지 못함 | 해당 없음 | 해당 없음 | 해당 없음 |
| q09 | REQUIRED | BENEFICIAL | 원본 그림의 음의 이차계수와 두 근을 보존; 미정 계수는 명시적으로 대표 예시 | P:4 / S:4 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q10 | EXEMPT | EXEMPT | 이미 함수식이 제시된 이차함수 성질의 선택지 비교이며 그림 필수 요구가 없음 | 해당 없음 | 해당 없음 | 해당 없음 |
| q11 | EXEMPT | EXEMPT | 축의 방정식 x=-2에 대한 이차항 계수 관계를 식으로 판정하는 계산 | 해당 없음 | 해당 없음 | 해당 없음 |
| q12 | EXEMPT | EXEMPT | 두 이차함수의 꼭짓점을 완전제곱식으로 구해 일치시키는 계수 계산 | 해당 없음 | 해당 없음 | 해당 없음 |
| q13 | REQUIRED | BENEFICIAL | 원본 문제 그림의 직각·두 길이·수선·미지각을 도식화 | P:10 / S:11 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q14 | REQUIRED | BENEFICIAL | AC=BC와 CD:DA=1:2, DBC 각을 실제 점·선에 표시 | P:8 / S:8 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q15 | EXEMPT | EXEMPT | 특수각 삼각비의 수치 계산으로 완결되어 별도 도형 관계가 없음 | 해당 없음 | 해당 없음 | 해당 없음 |
| q16 | REQUIRED | BENEFICIAL | 전체 원 대신 사분원 호와 수선의 발 H를 그리는 필드 | P:9 / S:9 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q17 | REQUIRED | BENEFICIAL | 수치표의 68°와 100 길이, 직각 관계를 그리며 반올림된 92.72를 정확한 실길이 라벨로 쓰지 않음 | P:6 / S:6 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q18 | REQUIRED | BENEFICIAL | 직각·길이 6·탄젠트의 두 변 관계가 독립적으로 그려짐 | P:5 / S:6 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q19 | REQUIRED | BENEFICIAL | 30°·120°·12cm가 좌표에 수학적으로 맞게 구성됨 | P:10 / S:12 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q20 | REQUIRED | BENEFICIAL | 내각의 이등분에 따른 BD:DC=2:1을 도형에 반영 | P:11 / S:12 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q21 | REQUIRED | BENEFICIAL | 마름모의 네 변 길이와 60° 실제 각 관계 | P:7 / S:7 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q22 | REQUIRED | BENEFICIAL | 원본의 중점·삼등분점·두 연결선과 각을 정확히 재작도 | P:17 / S:21 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q23 | REQUIRED | BENEFICIAL | 이차함수와 사다리꼴 넓이의 기준 점·선분을 공식 그래프 오버레이로 제시 | P:8 / S:8 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q24 | REQUIRED | BENEFICIAL | 피타고라스 3-4-5와 4-4√3-8 관계를 실제 작도 | P:10 / S:12 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |
| q25 | REQUIRED | BENEFICIAL | 60° 삼각형에서 해설의 수선 발 H를 별도 도출해 표기 | P:6 / S:13 그리기 필드 — DRAWN_FEATURE_PARITY PASS | PASS / PASS | RENDER_NOT_RUN |

- 문항 25개 / 총 50축: 계획 28개, EXEMPT 22축.
- 정적 필드 감사: 문제·해설 **28축 전부 PASS**. 공식 shallow lint 및 full lint 각 **28/28 PASS**.
- 실제 점 좌표 독립 검산: 선분 117, 수치 길이 라벨 42, 각 24, 직각 27, 같은 길이 4묶음, 원호 끝점 4, 원 반지름 2, 그래프 필수점 10, 원 접선거리 0: **불일치 0**.
- 입체 정사면체는 공간모델·중점·각의 공식 full lint를 별도로 통과; 합성 수준별 문제는 각각 2패널을 전부 검수.
- 독립검사의 입력은 저장된 실제 plan JSON의 좌표·라벨·그림 필드이며 caption/sourceConditions 텍스트만으로 PASS 처리하지 않음.
- 공식 렌더 SVG·PNG 픽셀 대조·학생 화면·A4는 수행하지 않았으므로 **RENDER_NOT_RUN / NOT_RUN / NOT_RUN / NOT_RUN**. 이 정적 PASS는 렌더 시각 PASS를 의미하지 않음.
