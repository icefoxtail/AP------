# 제일고 고2 2학기 기말 수학Ⅱ 유사 — 문항·해설 전축 SVG 감사

- 감사 기준: `origin/main` **40d9d72bbe8d31dd9c22f4d9838cdc987be6af82** (2026-11-27 작업 중 재조회·fast-forward). 원본 시험지 JS blob: `c03b99b795666eba2f52686142e1ce2ee94b4599`. 최초 조회 `ac9cfd50d`에서 다른 학교 관련 커밋으로 전진했으나 본 두 시험지·plan 경로와는 충돌하지 않았다.
- 대상: `archive/exams/similar/high/h2/2final/25_제일고_2학기_기말_고2_수학II_유사.js`. 문항 **23**, 문제 축 **23**, 해설 축 **23**, 총 **46/46축** 조사.
- 해당 JS가 직접 연결한 문제 SVG: **5개**(q07, q09, q12, q14, q23); 직접 연결한 해설 SVG **0개**. 별도 `_plans/` 레거시 plan ref는 46축에 존재하지만 이를 실제 SVG 출력/엔진 통과로 간주하지 않았다.
- 신규 공식 production plan **16개**: 문제 **5**(q07/09/12/14/23), 해설 **11**(q01/02/03/04/06/07/16/17/19/21/23). `REQUIRED` 5축, `BENEFICIAL` 11축, `EXEMPT` 30축.
- `STATIC_FIELD_PARITY=PASS`는 **JS 원문·해설에 적힌 조건과 JSON의 정적 필드/수치/구간을 대조**했다는 뜻이지 SVG 렌더 검증을 뜻하지 않는다. `DRAWN_FEATURE_PARITY=STATIC_MATCH / RENDER_NOT_RUN`는 원본 SVG의 핵심 요소(있을 때)와 plan 도형 요소를 코드·벡터 정의 수준으로 대조했으나 **실제 출력 벡터/픽셀 검수는 불가**하다는 뜻이다. 원본이 없는 해설 BENEFICIAL은 `NO_ORIGINAL / RENDER_NOT_RUN`.
- 원본 SVG에 배경용 흰색 `rect`/캔버스가 들어 있더라도 원본을 직접 수정하거나 베끼지 않았다. 작성 plan은 수학적 영역(q06/07/14/19)만 음영 의도로 지정한다. 최종 엔진 산출물의 배경 투명 여부는 확인하지 못했다.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
|---|---|---|---|---|---|---|---|
| 01 | EXEMPT | BENEFICIAL | 없음 | `q01-solution.plan.json` | PASS | NO_ORIGINAL / RENDER_NOT_RUN | 원문은 롤의 정리 조건·양 끝값을 식으로 완결; 해설의 `[1,5]`, 양 끝 높이 5와 정지점 x=3을 시각화. |
| 02 | EXEMPT | BENEFICIAL | 없음 | `q02-solution.plan.json` | PASS | NO_ORIGINAL / RENDER_NOT_RUN | 문제는 감소구간 기호식으로 완결; 도함수 `6(x+1)(x-4)`의 영점 −1,4와 사이 음수 부호를 보조 시각화. |
| 03 | EXEMPT | BENEFICIAL | 없음 | `q03-solution.plan.json` | PASS | NO_ORIGINAL / RENDER_NOT_RUN | 극대 `(0,5)`, 극소 `(2,-7)`인 삼차함수의 모양; 원문 그림 필수 아님. |
| 04 | EXEMPT | BENEFICIAL | 없음 | `q04-solution.plan.json` | PASS | NO_ORIGINAL / RENDER_NOT_RUN | 사차함수 y=3x⁴−8x³−18x²의 극값 −7, 0, −135 및 수평선 근 개수 해석. |
| 05 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 적분의 차분몫은 극한 계산식으로 완결, 별도 그래프가 필수 정보 아님. |
| 06 | EXEMPT | BENEFICIAL | 없음 | `q06-solution.plan.json` | PASS | NO_ORIGINAL / RENDER_NOT_RUN | a=4로 정해진 뒤 포물선의 x축 아래 구간 [0,4]만 수학적 면적 음영. |
| 07 | REQUIRED | BENEFICIAL | `assets/images/25_제일고_2학기_기말_고2_수학II_유사/q7-readable-v2.svg` (문제) | `q07-problem.plan.json`, `q07-solution.plan.json` | PASS | STATIC_MATCH / RENDER_NOT_RUN | 5개 꼭짓점 (0,0),(2,2),(3,2),(5,−2),(7,0), 네 선분, 시각축 t·속도축 v, x축 횡단 t=4; 해설은 t=0~4 양/4~7 음의 부호 있는 넓이를 구분. 원본 흰 배경 제거 의도, 실제 출력 미확인. |
| 08 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 매개변수 a에 따라 움직이는 극점; 위치 부등식/인수분해 해설만으로 충분하며 임의 a 그래프는 오해 우려. |
| 09 | REQUIRED | EXEMPT | `assets/images/25_제일고_2학기_기말_고2_수학II_유사/q9.svg` (문제) | `q09-problem.plan.json` | PASS | STATIC_MATCH / RENDER_NOT_RUN | x=2 단순 횡단, x=8 중근 접점과 최고차계수 양수. 절대 세로축 배율은 원문 미정이므로 c=1/8은 **양의 대표 배율**일 뿐 수치 조건 아님; 해설은 부호·도함수 계산으로 완결. |
| 10 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 12×12 종이, 모서리 x 절단과 부피 x(12−2x)²가 텍스트로 완결; 원문에 도형 참조 없음. |
| 11 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 두 물체 가속도 교점의 수는 k 매개변수 부등식 판정; 원문 시각 요소 없음. |
| 12 | REQUIRED | EXEMPT | `assets/images/25_제일고_2학기_기말_고2_수학II_유사/q12-readable-v3.svg` (문제) | `q12-problem.plan.json` | PASS | STATIC_MATCH / RENDER_NOT_RUN | 한 주기 [−2,4]의 접합점 (−2,0),(0,3),(4,0), 증가 기울기 3/2·감소 기울기 −3/4, 주기 6. 해설은 정적분 분해식으로 충분. |
| 13 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 매개변수 적분 방정식 두 번 미분·대입으로 결정; 그래프 조건 없음. |
| 14 | REQUIRED | EXEMPT | `assets/images/25_제일고_2학기_기말_고2_수학II_유사/q14-quality-v4.svg` (문제) | `q14-problem.plan.json` | PASS | STATIC_MATCH / RENDER_NOT_RUN | y=x², y=3, y축, x=k 및 교점 √3; S₁:[0,√3], S₂:[√3,k] 경계를 분리하여 면적만 음영. 도형 표현용 k=3은 해설의 동면적 해이며 문제 plan의 점 P 좌표는 숨김. 정확한 그리기/라벨 배치는 미확인. |
| 15 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | f(0)=f(2)=f(a), 접선 조건의 대수적 복원; 임의 그래프는 원문에 없는 정보를 보탤 수 있음. |
| 16 | EXEMPT | BENEFICIAL | 없음 | `q16-solution.plan.json` | PASS | NO_ORIGINAL / RENDER_NOT_RUN | [0,t], 임계점 0·4 및 최댓값 32·최솟값 0 판단을 원 다항함수 개형에 대응. |
| 17 | EXEMPT | BENEFICIAL | 없음 | `q17-solution.plan.json` | PASS | NO_ORIGINAL / RENDER_NOT_RUN | 열린 정의역 (−1,3)을 유지하고 도함수 최솟값 (1,8)을 표시. |
| 18 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 사차함수의 정수 a,b 경우 분석이 핵심; 하나의 확정 도형 없음. |
| 19 | EXEMPT | BENEFICIAL | 없음 | `q19-solution.plan.json` | PASS | NO_ORIGINAL / RENDER_NOT_RUN | f(x)=x²+3x (−3/2~0), 최댓값 함수 g의 두 식이 x=−1에서 접합; [−3/2,−1], [−1,0]의 **두 경계 곡선 사이**만 음영. |
| 20 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 자연수 n 전부를 판정하는 미분 부등식, 고정 그래프가 없어 수식으로 충분. |
| 21 | EXEMPT | BENEFICIAL | 없음 | `q21-solution.plan.json` | PASS | NO_ORIGINAL / RENDER_NOT_RUN | 문제의 x=t 교점 P,Q와 3:2 외분점 R의 관계를 구해 y_R=6t−2t³; 극소 −4·극대 4의 그래프를 해설 보조. 문제축은 텍스트로 점과 선을 정의해 도식 없이 해석 가능. |
| 22 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 다항함수 속 상수 적분값을 대입해 계산; 의미 있는 그림 조건 없음. |
| 23 | REQUIRED | BENEFICIAL | `assets/images/25_제일고_2학기_기말_고2_수학II_유사/q23-readable-v3.svg` (문제) | `q23-problem.plan.json`, `q23-solution.plan.json` | PASS | STATIC_MATCH / RENDER_NOT_RUN | 도함수 f의 x절편 −1,3, y절편 3, 아래로 열린 포물선; 해설 F(0)=0의 극솟값 −5/3·극댓값 9에 따른 수평선 교점 3개 판단. |

## 검수·한계·후속

| 단계 | 결과 |
|---|---|
| JSON 파싱·공식 스키마 | **16/16 PASS** (Shallow lint에 포함) |
| Shallow lint | **16 PASS / 0 FAIL / 0 SKIP** |
| Full lint | **16 PASS / 0 FAIL / 0 SKIP** |
| STATIC_FIELD_PARITY | plan 적용 **16 PASS**, 그림 불필요 **30 N/A** |
| DRAWN_FEATURE_PARITY | plan 16축 **정적 구성 대조**, 엔진 산출 SVG·픽셀 확인 **0/16**, 기존 SVG 5축과의 실제 이미지 동등성 미확인 |
| ENGINE_CAPABILITY_PENDING | **0 확정**. 명시적 미지원 기능 때문에 필수 도형을 포기한 축은 없다. 다만 런타임 결과 미검증 상태를 '완료된 이미지'로 승격하지 않는다. |
| 실제 렌더·육안 검수 | **RENDER_NOT_RUN**. `render-plan.mjs` q07 문제 축 실행: 초기 sparse checkout의 `archive/engine.html` 누락 해소 후에도 `ARCHIVE_PREFLIGHT_FAIL`: Playwright Chrome `/opt/google/chrome/chrome` 미설치. |

**시각적 미해결:** 기존 흰색 배경 rect의 실제 제거, 글자·틱·접합점·음영의 출력 위치, 경계 정확도 및 실질 `DRAWN_FEATURE_PARITY`는 Chrome이 있는 공식 production 환경에서 각 plan을 렌더한 뒤 별도 검수 필요. 이 문서는 실제 SVG 시각 검수를 PASS라 선언하지 않는다. JS와 원본 SVG를 수정하거나 수동 SVG를 새로 만든 내역은 없다.
