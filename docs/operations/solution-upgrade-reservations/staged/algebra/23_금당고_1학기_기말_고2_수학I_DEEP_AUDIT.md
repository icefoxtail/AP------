# 23_금당고_1학기_기말_고2_수학I — 해설 DEEP AUDIT + 이미지 실물 검수 (2026-11-22)

> 문서 전용(engine handoff). 원본 JS·이미지·엔진·학생 UI 변경 없음. 수학 검산은 실제 브라우저 PASS가 아니다.

## 원본과 검수 범위

- JS: `archive/exams/original/high/h2/1final/23_금당고_1학기_기말_고2_수학I.js` (Git blob `ff9700baba171055d0536fb1527779ff4003db1c`), **18문항**, 브랜치 `work/solution-upgrade-lane-30-20261121`.
- 발문·보기·기존 정답·해설 계산 교차 검산: **KEEP_MATH 18 / HOLD_MATH 0**.
- 발문 HTML 내 이미지 포함 실사용 **15개(PNG 7 / SVG 8)**, PNG 디코드 및 Inkscape SVG→PNG 렌더 성공 **15/15**. 도형 원본과 해설 도형을 연락시트에서 육안 비교, 신규 확정 이미지 교체 예약 **0**.
- 원본 내용 중 HTML 태그 **표시 리스크 4문항(Q12/Q14/Q17/Q18)**을 별도 엔진 인계. 실제 DOM·MathJax·모바일·CI/preflight/ALIVE/Golden/Negative는 **NOT_RUN**이므로 이는 화면 결함 확정이 아니다.

## 문항별 수학 검산 (18/18)

| Q | 발문 식별 | 기존 정답 | 계산·제약·끝점 검증 | 이미지 | 판정 |
|---:|---|---|---|---|---|
| 01 | a=6,b=4,C=120° 면적 | ③ | (1/2)·6·4·sin120°=6√3. | 없음 | KEEP_MATH |
| 02 | a1=10, a2/a3=3 등차 | ④ | (10+d)/(10+2d)=3 →d=−4, a10=−26. | 없음 | KEEP_MATH |
| 03 | 한 변 4 정육각형, BC 중점 M | ② | 대칭좌표로 ME²=52 →2√13; 원본 M 위치 확인. | q3.png, q3-solution.svg | KEEP_MATH |
| 04 | sinA+sinB=sinC(cosA+cosB) | ③ | 합차공식 후 양의 cos((A−B)/2), cos(C/2)를 나누면 sin²(C/2)=1/2 →C=90°. | 없음 | KEEP_MATH |
| 05 | 내접이 아닌 사각형 변 5,6,3,4; D=120° | ① | △ADC의 AC²=37, 두 삼각형 넓이 분할 →3√3+3√21. | q5.png, q5-solution.svg | KEEP_MATH |
| 06 | Sₙ=n²+n, Σk·a₂ₖ | ④ | an=2n, a₂ₖ=4k; 4Σ1..10 k²=1540. | 없음 | KEEP_MATH |
| 07 | √x 곡선의 두 단면점으로 만든 사각형 Sₖ | ② | 사각형은 직선 변을 잇는 사다리꼴; Sₖ=(√k+√(k+1))/2, 역수=2(√(k+1)−√k) →k=1..120 합20. | q7.png, q7-solution.svg | KEEP_MATH |
| 08 | 일직선 A,B,C와 강 건너 P 거리 | ④ | AB=200, BC=300, PB=700, PC=500; 수선 발 좌표 550, 높이²=187500 →PA=500√3; 속력 조건 대입 시 50√3. | q8.png, q8-solution.svg | KEEP_MATH |
| 09 | 두 원 교점 Q의 y좌표 수열 | ⑤ | 원 식 차분 y=2−1/(2n²); ∑ 1/(4k²−1) 부분분수 →20/41. | q9-solution.svg | KEEP_MATH |
| 10 | `1010…` 교대 자리 n자리 정수 | ⑤ | 40자리 10(1+100+⋯+100¹⁹)=10(100²⁰−1)/99=(10⁴¹−10)/99. | 없음 | KEEP_MATH |
| 11 | 2aₙ₊₁=aₙ²−5aₙ, a1=1 | ③ | a2=−2, a3=7, 이후 고정 7; ∑2..m=7m−16>101 →m최소17. | 없음 | KEEP_MATH |
| 12 | bₙ=aₙ+2ⁿ, 옳은 보기 | ④ | bₙ₊₁=4bₙ, ㄴ·ㄷ 참; ㄱ의 좌변은 2^(n+1)−2로 제시식과 불일치. | 없음 | KEEP_MATH / UI_TAG_CHECK |
| 13 | 점 Aₖ 10개와 단위원의 거리 극값 | ⑤ | 원점거리 r>1에서 P최대/최소 거리 r±1; 제곱 합 2r²+2, ∑r²=90 →200. | 없음 | KEEP_MATH |
| 14 | 귀납법 조화합 >1, 가/나/다 | ② | (가)=1/(k+1), (나)=<, (다)=2/(3k+3); 분모 곱은 (3k+3)²−1. | 없음 | KEEP_MATH / UI_TAG_CHECK |
| 15 | AB6 AC5, 내부점 P와 세 수선 | ② | sinA=3/5, 둔각 가지는 면적9와 PD√13 조건에 모순; cosA=4/5, BC=√13, PF=5/18, [EPF]=1/18 →p+q=19. | q15.png, q15-solution.svg | KEEP_MATH |
| 16 | R=10,a=16, bc 최댓값 | ① | sinA=4/5, cosA는 ±3/5; bc≤200(1+cosA)이므로 예각 가지 최대320(둔각 가지80). | q16.png, q16-solution.svg | KEEP_MATH |
| 17 | 절댓값 인접항 합 2n+1, Σ1..51=1322 | 51 | 절댓값 크기 n; 전체 양의 합1326과 차4→a2만 −2, Σ1..10=55−4=51. | 없음 | KEEP_MATH / UI_TAG_CHECK |
| 18 | 반지름1 부채꼴·세 변 접원 | (√10−2)/25 | 중심 d=1/(1+sin(θ/2)), OP=d cos(θ/2), OH=cosθ=1/5; [OPH]=(1/2)OP·OH·sinθ=(√10−2)/25. | q18.png, q18-solution.svg | KEEP_MATH / UI_TAG_CHECK |

## 이미지별 실물 렌더 대장 (15/15)

기준 폴더 `archive/assets/images/23_금당고_1학기_기말_고2_수학I/`. SVG는 Inkscape로 PNG 렌더, PNG는 원본 디코드해 원문과 해설 도형을 비교한 결과이다. SHA는 변경 전 원본 Git blob.

| Q | 참조 위치 | 파일 | blob SHA | 정지 이미지 관찰 |
|---:|---|---|---|---|
| 03 | 발문 HTML `<img>` | q3.png | 657535056194810af90d151f20a50c4c0997136a | 육각형·M 판독 |
| 03 | solutionImage | q3-solution.svg | 3b09b2971403d75d06989af3faef92abd66d6efc | 육각형·M 렌더 |
| 05 | 발문 HTML `<img>` | q5.png | 3b0eb68cdc9ddd07e9b0862798a7d57c410c4638 | D각·변 수치 판독 |
| 05 | solutionImage | q5-solution.svg | e8e9987784e246a3411ee41a46d9cf7c79298281 | 대각선 분할 도식 렌더 |
| 07 | 발문 HTML `<img>` | q7.png | 8780c9091596b1de68d4848359954f1836e7f0d5 | 그래프·k 단면 판독 |
| 07 | solutionImage | q7-solution.svg | c7f41cf8fa120a08e890e1bc6cb61a7027fb3db9 | 1~2구간 도식 렌더 |
| 08 | 발문 HTML `<img>` | q8.png | bf558b219c9fdbb85c5fcffc22e3743a49c4fbff | 강·세 지점·선박 스캔 판독 |
| 08 | solutionImage | q8-solution.svg | 8a4d83138decf4ae87e9e3314bf1636f28873ad5 | A/B/C/P 위치 렌더 |
| 09 | solutionImage | q9-solution.svg | 2d26cce2358925fbf6fcd3a03ea45027549a28b1 | 두 원 교점 렌더 |
| 15 | 발문 HTML `<img>` | q15.png | f2685d747672ffbe4441a34e71118eb76a59d065 | 내부점·수선 도식 판독 |
| 15 | solutionImage | q15-solution.svg | 647303054d4c9565e61c7e37686ebeed26c72aab | 수선 위치 렌더 |
| 16 | 발문 HTML `<img>` | q16.png | 3cb1bdfe66825875ebfe7d2cb0025e61f6e2feff | 원·현·반지름 판독 |
| 16 | solutionImage | q16-solution.svg | 93b4b2bd09f83eb475d774727571e414a73172a1 | 내접삼각형 렌더 |
| 18 | 발문 HTML `<img>` | q18.png | a749b708401617bbe6e44aee6f5d244e54284410 | 부채꼴·접원 판독 |
| 18 | solutionImage | q18-solution.svg | 7a0f3e3b6091bec6334083f082c4dcd9d174e3b1 | 두 원·접점 렌더 |

## 엔진 인계 — 표기 보존 리스크

- **Q12:** 발문 문자열의 `<b><보 기></b>`는 `<보 기>`가 사용자에게 문자 그대로 표시된다고 보장되지 않는 비표준 HTML 태그 형식이다. ㄱ·ㄴ·ㄷ 자체는 원본에 있으나 **보기 제목 출력**을 학생 DOM에서 확인할 것.
- **Q14/Q17/Q18:** `<증명>`, `<서술형 1>`, `<서술형 2>`가 텍스트가 아니라 HTML 요소로 파싱될 가능성이 있다. 증명/서술형 머리말의 누락·후속 마크업 범위를 엔진 UI에서 재현 검수할 것. 원문을 이 문서 작업 중 변경하지 않음.
- **Q16:** 그림은 A가 예각인 배치다. 향후 이미지 교체 시 그 조건을 흐리지 않게 유지하고 코사인 부호를 재검산할 것.
- **정지 이미지 결함 확정 0**과 **UI 태그 확인 예약 4문항**은 서로 다른 층의 결과다. 태그 확인 전 `PASS_UI`로 승격하지 말 것.
