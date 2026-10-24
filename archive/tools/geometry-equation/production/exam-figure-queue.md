# 시험지별 해설 그림 작업 큐 (2026-10-24)

**닫는 법:** 시험지 하나를 끝낼 때마다 `exam-figure-ledger.json`의 해당 시험지 항목을 갱신한다. 문항 `state`를 최종값(PUBLISHED/EXEMPT, 또는 최종 사유를 단 OPEN_*)으로 바꾸고 `figures`에 게시 에셋 경로를 넣는다. OPEN_* 문항이 하나도 없으면 `status`를 `CLOSED`로, `closedBy`에 PR 번호를 적는다. CLOSED 시험지는 다시 작업하지 않는다. 이 큐 파일의 해당 줄도 함께 지운다. 엔진 확장(#778~#790)으로 UNSUPPORTED/LIMIT 문항 일부가 그릴 수 있게 되었을 수 있으므로 해당 클러스터부터 확인한다.

## 현황

- 시험지 141개: CLOSED 78 / OPEN 63 (골든 샘플 2 포함)
- 문항 422개(시험지+번호 기준 중복 제거): EXEMPT 97, OPEN_LAYOUT 28, OPEN_OTHER 6, OPEN_UNSUPPORTED 67, PUBLISHED 224
- 원 캠페인 461건 중 39쌍이 재실행으로 중복되어 최종 상태 하나로 합쳤다.

## OPEN 큐 (열린 문항 수 내림차순, 같으면 시험지명순)

- [x] **19_금당고_1학기_기말_고1_기출** (4건): q3 OPEN_LAYOUT capture:ARCHIVE_BANK_RESPONSE_MISMATCH — ABANDONED(저작 4회 실패) · q4 OPEN_LAYOUT capture:ARCHIVE_BANK_RESPONSE_MISMATCH — ABANDONED(저작 4회 실패) · q8 OPEN_UNSUPPORTED other — a=2, a=-11 두 경우의 직선을 비교하는 그림은 이차함수가 아닌 직선이라 composite-panels · q16 OPEN_LAYOUT capture:ARCHIVE_BANK_RESPONSE_MISMATCH — LIMIT
- [x] **19_매산고_1학기_기말_고1_기출** (4건): q4 OPEN_LAYOUT measure:ARCHIVE_PREFLIGHT_FAIL — LIMIT · q11 OPEN_LAYOUT measure:ARCHIVE_PREFLIGHT_FAIL — LIMIT · q13 OPEN_LAYOUT measure:ARCHIVE_PREFLIGHT_FAIL — LIMIT · q15 OPEN_LAYOUT measure:ARCHIVE_PREFLIGHT_FAIL — LIMIT
- [x] **21_금당고_1학기_기말_고2_수학I** (4건): q1 OPEN_UNSUPPORTED D_exp_log_trig — 사인 함수 그래프와 직선 y=-1/2의 교점을 보여야 하는데 삼각함수 곡선은 지원되지 않는다. · q13 OPEN_LAYOUT measure:ARCHIVE_PREFLIGHT_FAIL — LIMIT · q14 OPEN_LAYOUT measure:ARCHIVE_PREFLIGHT_FAIL — LIMIT · q19 OPEN_LAYOUT measure:ARCHIVE_PREFLIGHT_FAIL — LIMIT
- [x] **19_강남여고_1학기_기말_고1_기출** (3건): q4 OPEN_UNSUPPORTED A_construction_ops — 원점 대칭이동한 중심(원래 원의 중심)을 만드는 파생 연산이 없어 두 원과 대칭 관계를 계약으로 표현할 수  · q11 OPEN_UNSUPPORTED A_construction_ops — 외분점 D, E, F와 무게중심 G를 계약의 연산으로 도출할 수 없고 도출점에 원시 좌표를 쓸 수 없다. · q23 OPEN_UNSUPPORTED A_construction_ops — 선분 AB를 2:3으로 내분·외분하는 점을 도출하는 연산이 계약에 없어 도출점을 좌표 없이 만들 수 없다.
- [x] **20_순천고_1학기_중간_고1_기출** (3건): q12 OPEN_LAYOUT measure:ARCHIVE_PREFLIGHT_FAIL — LIMIT · q13 OPEN_LAYOUT measure:ARCHIVE_PREFLIGHT_FAIL — LIMIT · q14 OPEN_LAYOUT measure:ARCHIVE_PREFLIGHT_FAIL — LIMIT
- [x] **21_강남여고_1학기_중간_고1_기출** (3건): q3 OPEN_LAYOUT measure:ARCHIVE_PREFLIGHT_FAIL — LIMIT · q8 OPEN_LAYOUT measure:ARCHIVE_PREFLIGHT_FAIL — LIMIT · q25 OPEN_LAYOUT measure:ARCHIVE_PREFLIGHT_FAIL — LIMIT
- [x] **21_매산여고_1학기_기말_고1_기출** (3건): q11 OPEN_UNSUPPORTED other — 기울기가 같은 직선족의 k 범위와 두 원의 배치를 한 그림으로 표현할 수 없다. · q13 OPEN_UNSUPPORTED F_irrational_coefficients — 같은 중심의 두 원(반지름 3√2, 6)과 임의의 점 P에서 그은 접선을 한 그림에 그려야 하나 임의 점 P · q21 OPEN_LAYOUT compose:LAYOUT_INVENTORY_INCOMPLETE — ABANDONED(저작 4회 실패)
- [x] **22_강남여고_1학기_기말_고1_기출** (3건): q10 OPEN_LAYOUT compose:COMPOSITE_PANEL_NOT_COMPOSED — ABANDONED(저작 4회 실패) · q21 OPEN_UNSUPPORTED F_irrational_coefficients — 원과 기울기가 같은 두 접선을 한 그림에 그리려면 구하는 직선 √3x-y±6=0을 GIVEN 직선으로 두어야 · q23 OPEN_UNSUPPORTED A_construction_ops — 선분의 내분점·외분점을 작도하는 연산이 지원 범위에 없다.
- [x] **26_순천고_1학기_기말_고1_기출** (3건): q11 OPEN_LAYOUT frame:EQUAL_UNIT_PARABOLA_TOO_NARROW — LIMIT · q15 OPEN_UNSUPPORTED C_number_line — 해가 매개변수 n에 따라 3과 n 사이 구간으로 바뀌는 경우 나눔(n=1, n=2~4, n≥5)이라, 수직선 · q20 OPEN_UNSUPPORTED G_axis_scale — x 범위 0~50 대비 이익 0~45000으로 두 축의 단위 길이가 같아야 하는 엔진에서 곡선이 지나치게 좁
- [x] **21_강남여고_1학기_기말_고1_기출** (2건): q10 OPEN_UNSUPPORTED C_number_line — 수직선 위 구간의 교집합 표시가 필요하나 계약에 수직선 도식이 없다. · q21 OPEN_UNSUPPORTED other — 매개변수 m에 따라 변하는 직선군과 고정점 (3,6)을 한 그림에 나타내야 한다.
- [x] **21_고흥고_1학기_기말_고1_기출** (2건): q4 OPEN_LAYOUT compose:LAYOUT_INVENTORY_INCOMPLETE — ABANDONED(저작 4회 실패) · q7 OPEN_UNSUPPORTED A_construction_ops — 2:1 내분점과 외분점은 계약의 점 생성 연산(중점 등)으로 정확히 표현할 수 없다.
- [x] **21_복성고_1학기_기말_고1_기출** (2건): q12 OPEN_UNSUPPORTED A_construction_ops — 선분의 내분점·외분점(3:2)을 작도하는 연산이 없어 P, Q를 정확히 유도할 수 없음 · q18 OPEN_UNSUPPORTED A_construction_ops — A가 문자 좌표(u,v)인 일반 삼각형의 내분점·외분점 구성이라 지원하는 연산으로 표현할 수 없다.
- [x] **21_제일고_1학기_중간_고1_기출** (2건): q21 OPEN_LAYOUT compose:COMPOSITE_PANEL_NOT_COMPOSED — ABANDONED(저작 4회 실패) · q22 OPEN_UNSUPPORTED G_axis_scale — x축 값(0~10)과 y축 값(최대 38400)의 크기 차가 너무 커서 같은 눈금 단위의 그래프로 그릴 수 
- [x] **22_금당고_1학기_기말_고1_기출** (2건): q3 OPEN_LAYOUT compose:LAYOUT_INVENTORY_INCOMPLETE — ABANDONED(저작 4회 실패) · q17 OPEN_UNSUPPORTED E_abs_piecewise_slanted_line — 절댓값으로 이루어진 구간별 이차함수 그래프와 직선 p(x-3)+3의 비교가 필요함
- [x] **23_매산여고_1학기_중간_고1_기출** (2건): q11 OPEN_UNSUPPORTED F_irrational_coefficients — 접하는 두 경우 m=3±sqrt(7)의 이차함수 계수가 무리수라 정수·유리수 계수만 허용하는 그래프로 그릴  · q23 OPEN_UNSUPPORTED E_abs_piecewise_slanted_line — 구간별로 정의된 두 이차함수 f,g를 이어 붙인 h(x)와 직선 y=mx+12를 한 그림에 그려야 하는데 두
- [x] **23_팔마고_1학기_기말_고1_기출** (2건): q1 OPEN_UNSUPPORTED A_construction_ops — 선분 AB를 2:1로 나누는 내분점은 파생점이라 좌표를 줄 수 없고, 비율 분할을 만드는 연산이 계약에 없다 · q10 OPEN_UNSUPPORTED C_number_line — 수직선 위에서 두 부등식의 해 구간과 가우스 기호 조건의 공통 범위를 겹쳐 보이는 그림이 필요하지만 계약의 
- [x] **24_매산여고_1학기_중간_고1_기출** (2건): q18 OPEN_LAYOUT composite-panels:COMPOSITE_PLAN_INVALID — ABANDONED(저작 4회 실패) · q23 OPEN_UNSUPPORTED F_irrational_coefficients — 구간별로 다른 두 포물선과 매개변수 직선을 한 그림에 그려야 하며 무리수 경계값도 필요해 지원되지 않음
- [x] **24_효천고_1학기_중간_고1_기출** (2건): q11 OPEN_UNSUPPORTED G_shaded_region — 둘레 P와 넓이 S의 관계 S<=(P/4)^2를 나타내는 포물선과 그 아래 영역(음영) 표현이 필요함 · q22 OPEN_UNSUPPORTED F_irrational_coefficients — 경우마다 a=2-√2, √2 같은 무리수 계수의 이차함수와 구간 최대·최소 비교가 필요해 정수·유리수 계수만
- [x] **25_강남여고_1학기_기말_고1_기출c** (2건): q9 OPEN_UNSUPPORTED G_symbolic_coefficient — 최고차항 계수 a가 주어지지 않아 포물선의 구체적 모양을 확정할 수 없음 · q19 OPEN_UNSUPPORTED C_number_line — 수직선 위에 정수해의 범위를 나타내는 그림이 필요한데 지원되지 않는다.
- **25_매산고_1학기_기말_고1_기출c** (2건): q15 OPEN_UNSUPPORTED E_abs_piecewise_slanted_line — 절댓값 그래프 y=x^2-2/x/+1(두 포물선 조각)과 움직이는 직선 y=x+k의 교점 개수 비교가 필요하 · q18 OPEN_UNSUPPORTED B_two_curves — 두 이차함수 f, g의 그래프를 한 그림에 겹쳐 그리고 /f/=1, /g/=1의 근 관계를 나타내야 하므로 
- **26_금당고_1학기_중간_고1_기출_c** (2건): q17 OPEN_UNSUPPORTED E_abs_piecewise_slanted_line — 구간별 정의 함수(이차식과 일차식 조각)를 한 그림에 겹쳐 그려야 하며 계약이 지원하지 않는다. · q20 OPEN_UNSUPPORTED E_abs_piecewise_slanted_line — 구간별로 정의된 g(t)의 그래프(이차식과 일차식이 이어진 조각 함수)와 수평선 y=1/2, 1, 3/2가 
- **26_매산고_1학기_중간_고1_기출c** (2건): q11 OPEN_UNSUPPORTED F_irrational_coefficients — k=-3±2√3 이 무리수라 두 포물선 계수를 정확한 정수·유리수로 줄 수 없고, 접선 포함 두 경우 그림이 · q18 OPEN_UNSUPPORTED B_two_curves — 두 이차함수 그래프와 수평선 y=t를 한 그림에 함께 그려야 하는데, 한 그림에 두 곡선을 그리거나 수평선을
- **26_복성고_1학기_중간_고1_기출** (2건): q7 OPEN_UNSUPPORTED B_two_curves — 서로 다른 두 포물선과 직선을 한 그림에 함께 그려야 하는데 계약이 지원하지 않는다 · q22 OPEN_LAYOUT frame:EQUAL_UNIT_PARABOLA_TOO_NARROW — LIMIT
- **19_순천고_1학기_기말_고1_기출** (1건): q1 OPEN_UNSUPPORTED A_construction_ops — 수직선 위에서 외분점이 선분 AB 바깥에 놓이는 관계를 보이는 1차원 수직선 그림이 필요하나 계약으로 표현할
- **20_금당고_2학기_중간_고1_기출** (1건): q1 OPEN_UNSUPPORTED A_construction_ops — 도형의 평행이동으로 얻은 직선과 이동 벡터를 표현하는 연산이 계약에 없음
- **20_매산고_2학기_중간_고2_수학II** (1건): q7 OPEN_LAYOUT measure:ARCHIVE_PREFLIGHT_FAIL — LIMIT
- **20_매산여고_1학기_기말_고2_수학I** (1건): q21 OPEN_OTHER AUTHORING — 상태 AUTHORING
- **20_매산여고_1학기_중간_고1_기출** (1건): q11 OPEN_OTHER BOUND_NOT_PUBLISHED — solutionImageAlt/Caption/Size만 있고 solutionImage 참조·에셋 없음(반등록
- **20_효천고_1학기_기말_고1_기출** (1건): q4 OPEN_UNSUPPORTED A_construction_ops — 2:3 내분점은 계약의 점 생성 연산(중점 등)으로 정확히 표현할 수 없다.
- **21_강남여고_1학기_기말_고2_수학I** (1건): q26 OPEN_UNSUPPORTED D_exp_log_trig — 서로 다른 두 사인·코사인 곡선의 교점을 한 그림에 그려야 한다.
- **21_금당고_1학기_중간_고2_수학I** (1건): q13 OPEN_UNSUPPORTED D_exp_log_trig — 로그함수 곡선과 수직이등분선 x=-3(수직선)이 필요하나 지원되지 않음
- **21_순천고_1학기_기말_고1_기출** (1건): q7 OPEN_UNSUPPORTED other — x축과 y축에 접하는 두 원의 중심 (1,1),(5,5)는 이차방정식으로 구한 유도점이라 원본 좌표 없이 만
- **21_순천고_1학기_중간_고1_기출** (1건): q15 OPEN_UNSUPPORTED B_two_curves — a의 값마다 달라지는 여러 포물선이 한 직선에 접하는 관계를 한 그림에 그려야 하는데 한 그림에 두 곡선 이
- **21_제일고_1학기_중간_고2_수학I** (1건): q9 OPEN_UNSUPPORTED D_exp_log_trig — 지수함수 곡선과 그 평행이동·대칭이동 그래프(a에 따른 곡선 족)는 지원되지 않는다
- **22_금당고_1학기_기말_고2_수학I** (1건): q19 OPEN_UNSUPPORTED D_exp_log_trig — 사인 그래프와 수평선의 교점 개수를 보이는 삼각함수 그래프가 필요하다.
- **22_매산고_1학기_중간_고1_기출** (1건): q20 OPEN_UNSUPPORTED B_two_curves — 두 이차함수 f, g의 그래프를 한 그림에 함께 그리고 수평선 y=k까지 보여야 함
- **22_매산여고_1학기_중간_고1_기출** (1건): q15 OPEN_UNSUPPORTED B_two_curves — 두 이차함수 f, g의 그래프를 한 그림에 함께 그려야 하므로 지원되지 않는다.
- **22_복성고_1학기_기말_고1_기출** (1건): q18 OPEN_UNSUPPORTED C_number_line — 수직선 위 해집합 4<x<a 와 정수 5, 6의 위치를 나타내야 하며 수직선 도식은 계약에 없다.
- **22_복성고_1학기_중간_고1_기출** (1건): q10 OPEN_UNSUPPORTED A_construction_ops — 변을 2:1로 내분하는 점을 만드는 연산이 없어 D,E,F를 정확히 작도할 수 없다
- **22_순천고_1학기_기말_고2_수학I** (1건): q2 OPEN_UNSUPPORTED other — 변의 길이가 없고 각 두 개와 한 변만 주어진 삼각형이라 좌표 없이 그릴 수 없다.
- **22_순천여고_1학기_중간_고1_기출** (1건): q8 OPEN_UNSUPPORTED F_irrational_coefficients — 접하는 포물선의 계수 k=-2±2sqrt2가 무리수라 정확한 유리 계수 그래프 계획으로 표현할 수 없음
- **22_팔마고_1학기_기말_고1_기출** (1건): q3 OPEN_UNSUPPORTED A_construction_ops — 1:3 내분점 D,E,F와 삼각형 DEF의 무게중심을 작도하는 연산(일반 내분점·무게중심)이 계약에 없고 파
- **23_강남여고_1학기_기말_고1_기출** (1건): q3 OPEN_UNSUPPORTED A_construction_ops — 2:1 내분점과 외분점은 계약의 작도 연산(중점, 수선의 발 등)으로 정확히 표현할 수 없다.
- **23_금당고_1학기_기말_고1_기출** (1건): q16 OPEN_UNSUPPORTED B_two_curves — 두 이차함수 f, g를 한 그림에 겹쳐 그려야 하고 계수 a가 문자로 남음
- **23_금당고_1학기_중간_고1_기출** (1건): q17 OPEN_UNSUPPORTED E_abs_piecewise_slanted_line — y=/f(x)/ 절댓값 그래프와 직선의 교점 개수 비교가 필요하며 절댓값 함수는 표현할 수 없다.
- **23_매산고_1학기_기말_고2_수학I** (1건): q15 OPEN_UNSUPPORTED D_exp_log_trig — 이차함수, 지수함수 y=3^x, 로그함수 y=log_3 x 세 곡선과 점 A,B,C가 한 그림에 필요하다.
- **23_매산고_1학기_중간_고1_기출** (1건): q20 OPEN_LAYOUT compose:LAYOUT_INVENTORY_INCOMPLETE — ABANDONED(저작 4회 실패)
- **23_여천고_1학기_중간_고1_기출** (1건): q18 OPEN_UNSUPPORTED B_two_curves — 계수가 문자인 두 이차함수 곡선을 한 그림에 함께 그려야 하며 구체적인 좌표가 없어 지원되지 않음
- **23_제일고_1학기_중간_고1_기출** (1건): q12 OPEN_UNSUPPORTED A_construction_ops — 수직선 위 내분점·외분점을 구성하는 연산이 계약에 없어 파생 점 P(1), Q(-8)을 정확히 구성할 수 없
- **24_매산고_1학기_중간_고1_기출** (1건): q17 OPEN_UNSUPPORTED other — 두 경우(a=1/8, a=-1)의 삼차함수 그래프가 필요하나 합성 패널은 이차함수만 지원한다
- **24_순천여고_1학기_중간_고1_기출** (1건): q18 OPEN_UNSUPPORTED E_abs_piecewise_slanted_line — 절댓값 함수 그래프(꺾인 곡선)와 직선의 교점 개수 비교가 필요하며 이는 지원되지 않는다.
- **25_강남여고_1학기_중간_고1_기출** (1건): q14 OPEN_LAYOUT compose:COMPOSITE_PANEL_NOT_COMPOSED — ABANDONED(저작 4회 실패)
- **25_매산고_1학기_중간_고1_기출** (1건): q18 OPEN_UNSUPPORTED F_irrational_coefficients — 포물선과 직선의 무리수 교점, x축에 내린 수선의 발 C, D와 삼각형을 한 그림에 그려야 하는데 지원되지 
- **25_매산고_1학기_중간_고2_대수** (1건): q7 OPEN_UNSUPPORTED D_exp_log_trig — 로그함수와 지수함수 그래프(역함수 대칭)가 필요하나 다항 그래프만 지원된다.
- **25_매산여고_1학기_기말_고1_기출c** (1건): q16 OPEN_UNSUPPORTED C_number_line — 끝점이 a에 따라 움직이는 두 부등식 해집합의 수직선 구간 그림이 필요함
- **25_제일고_1학기_기말_고1_기출c** (1건): q6 OPEN_UNSUPPORTED G_symbolic_coefficient — 문자 a를 포함한 이차함수의 그래프(f(-1)<0, f(2)>0 위치 관계)는 계수를 정할 수 없어 그릴 수
- **26_강남여고_1학기_중간_고1_기출** (1건): q20 OPEN_LAYOUT frame:EQUAL_UNIT_PARABOLA_TOO_NARROW — LIMIT
- **26_금당고_2학기_중간_고1_기출** (1건): q7 OPEN_UNSUPPORTED A_construction_ops — 주어진 직선에 수직이고 한 점을 지나는 직선을 작도하는 연산이 계약에 없다
- **26_매산여고_1학기_중간_고1_기출_c** (1건): q19 OPEN_UNSUPPORTED B_two_curves — 서로 다른 두 포물선과 수평선 y=t를 한 그림에 그려야 하는데 두 곡선을 한 그림에 그리는 형식이 없다
- **26_순천여고_1학기_기말_고1_기출** (1건): q12 OPEN_UNSUPPORTED E_abs_piecewise_slanted_line — 절댓값 y=2x^2-4/x/-3의 구간 그래프(두 이차식 조각이 이어진 함수)가 필요함
- **26_효천고_1학기_중간_고1_기출c** (1건): q26 OPEN_UNSUPPORTED E_abs_piecewise_slanted_line — 구간별 함수(두 이차곡선을 이어 붙인 그래프)와 직선을 한 그림에 그려야 하는데 계약이 지원하지 않는다

## 골든 샘플 (마지막 순서)

- **25_매산여고_2학기_중간_고1_기출** (4건): q1 OPEN_UNSUPPORTED A_construction_ops — 선분 AB를 2:1로 나누는 내분점 P를 작도하는 연산이 지원되지 않는다. · q2 OPEN_OTHER BOUND_NOT_PUBLISHED — 골든 샘플: #777이 그림 제거(CREATE 게이트 골든 SHA 고정). 재고정은 별도 결정 · q3 OPEN_OTHER BOUND_NOT_PUBLISHED — 골든 샘플: #777이 그림 제거(CREATE 게이트 골든 SHA 고정). 재고정은 별도 결정 · q4 OPEN_OTHER BOUND_NOT_PUBLISHED — 골든 샘플: #777이 그림 제거(CREATE 게이트 골든 SHA 고정). 재고정은 별도 결정  
  메모: figures removed by #777 (CREATE-gate golden SHA pin); re-pinning is a separate decision
- **25_효천고_2학기_중간_고1_기출** (1건): q1 OPEN_OTHER BOUND_NOT_PUBLISHED — 골든 샘플: #777이 그림 제거(CREATE 게이트 골든 SHA 고정). 재고정은 별도 결정  
  메모: figures removed by #777 (CREATE-gate golden SHA pin); re-pinning is a separate decision
