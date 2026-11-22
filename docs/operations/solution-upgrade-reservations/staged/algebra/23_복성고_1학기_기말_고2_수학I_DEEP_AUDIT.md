# 23_복성고_1학기_기말_고2_수학I — 해설 DEEP AUDIT + 이미지 실물 검수 (2026-11-22)

> 문서 전용(engine handoff). JS/그림/학생 UI/엔진 수정 없음. `KEEP_MATH`는 앱 출고 PASS가 아니다.

## 원본·범위

- 원본 JS `archive/exams/original/high/h2/1final/23_복성고_1학기_기말_고2_수학I.js`, Git blob `abdb384fdbafeb495da017d041684331c748f642`, **22문항**.
- 브랜치 `work/solution-upgrade-lane-30-20261121`; 해설·정답·보기·발문·도형을 교차 대조, **KEEP_MATH 22 / HOLD 0**.
- 직접 참조 **14개 이미지(PNG 4 / SVG 10)** 모두 확보해 원본 PNG 디코드 및 Inkscape SVG→PNG 실물 렌더, 연락시트 관찰. **렌더 실패 0/14**, 신규 이미지 교체 예약 0.
- 학생 브라우저·모바일·MathJax·CI/preflight·ALIVE/Golden/Negative **NOT_RUN**.

## 문항별 수학 검산 (22/22)

| Q | 발문 식별 | 기존 정답 | 확인한 결정식·예외 | 관련 이미지 | 판정 |
|---:|---|---|---|---|---|
| 01 | y=3cos(2x+1)+4 최소 | ① | 3·(−1)+4=1. | 없음 | KEEP_MATH |
| 02 | a1=4, aₙ₊₁−aₙ=2n | ⑤ | a5=4+2(1+2+3+4)=24. | 없음 | KEEP_MATH |
| 03 | a1=40, d=−3 최초 음수 | ④ | an=43−3n<0 →n≥15. | 없음 | KEEP_MATH |
| 04 | Σ(a+3b)=20, Σ(b−1/2)=4/3 | ① | B=19/3; A=20−3B=1. | 없음 | KEEP_MATH |
| 05 | a=8, B=150°, 면적18 | ② | (1/2)·8·c·sin150°=18→c=9. | q5-solution.svg | KEEP_MATH |
| 06 | sin 그래프 진폭·주기·평행이동 | ③ | 최대1·최소−5→a=3,c=−2; 주기 π→b=2; abc=−12. | q6.png | KEEP_MATH |
| 07 | Sₙ=2n²+kn, a5=24 | ① | a5=S5−S4=18+k→k=6, a1=2+6=8. | 없음 | KEEP_MATH |
| 08 | cos(π/3) 값 같은 보기 | ④ | cosπ/3=1/2=sin(5π/6). | 없음 | KEEP_MATH |
| 09 | a,a+b,ab 등차; a²,ab,2b 등비 | ② | b=2, a=4(0 아닌 조건); a+b=6. | 없음 | KEEP_MATH |
| 10 | 2cosB·sinA=sinC | ③ | sinC=sin(A+B)=sinAcosB+cosAsinB →sin(A−B)=0, a=b. | q10-solution.svg | KEEP_MATH |
| 11 | a=4,b=5,c=6 외접반지름 | ⑤ | cosA=(25+36−16)/60=3/4; sinA=√7/4, R=a/(2sinA)=8√7/7. | q11-solution.svg | KEEP_MATH |
| 12 | S3=7,S6=63,S9 | ③ | r³=S6/S3−1=8; S9=7(1+8+64)=511. | 없음 | KEEP_MATH |
| 13 | 1·3+2·5+⋯+10·21 | ② | 2Σk²+Σk=2·385+55=825. | 없음 | KEEP_MATH |
| 14 | 내접사각형 변 2,3,5,6 넓이 | ① | 대각선·맞꼭지 보각 연립 cos B=−2/3, 사각형 면적6√5. | q14-solution.svg | KEEP_MATH |
| 15 | B,O,P 일직선·C 접선·sinθ=1/3 | ⑤ | OC⊥PC, ∠BOC=π/2+θ; cosBOC=−1/3, sinA=√((1+1/3)/2)=√6/3. | q15.png, q15-solution.svg | KEEP_MATH |
| 16 | 4sin²x+4cosx−5, [0,π] | ③ | t=cosx∈[−1,1], y=−4t²+4t−1; 최솟값 −9 at t=−1, a=π → ab=−9π. | 없음 | KEEP_MATH |
| 17 | 1000의 약수 중 4원소 정수공비 GP | ⑤ | 1000=2³5³; 공비 지수쌍 (1,0),(0,1),(1,1), 시작점 수 4+4+1=9. | 없음 | KEEP_MATH |
| 18 | sin(ax) 주기 π·교점 x합13π/2 | ④ | a=2k, k개 주기에서 해의 x합=(a−1)π/2; a=14. | q18-solution.svg | KEEP_MATH |
| 19 | a cos(πx/b), AB=BC | ② | A=(b,−a), B=(b/3,a/2), C=(5b/3,a/2); a/b=4√3/9, 기울기 합 a/(2b)=2√3/9. | q19.png, q19-solution.svg | KEEP_MATH |
| 20 | b=√3+1,c=2,A=30° | √2/2 | 코사인법칙 a²=b²+c²−2bc cos30°=2, 사인법칙 sinC=c sinA/a=√2/2. | q20-solution.svg | KEEP_MATH |
| 21 | 2cos²x+3sin(π/2+x)−2≥0 | [0,π/3]∪[5π/3,2π) | t=cosx, 2t²+3t−2≥0 ⇒ t≥1/2 (t∈[−1,1]); 경계 포함과 2π 제외 확인. | q21-solution.svg | KEEP_MATH |
| 22 | 직각삼각형 고도와 세 면적 등차 | √3/3 | [ADC],[CDB],[CAB] 등차→BD=2AD, AB=3AD; AC²=AD·AB →cosA=√3/3. | q22.png, q22-solution.svg | KEEP_MATH |

## 원본 이미지 렌더 대장 (14/14)

모든 파일의 상대 기준: `archive/assets/images/23_복성고_1학기_기말_고2_수학I/`. SVG는 Inkscape→PNG, PNG는 원본 디코드 후 눈으로 도형·라벨·스캔을 관찰함. 아래는 변경 전 Git blob SHA.

| Q | 필드 | 파일 | SHA | 판정 |
|---:|---|---|---|---|
| 05 | solutionImage | q5-solution.svg | 2f8e80ac7c38cbc119e0fd0f5ebdebfb151cca9b | 렌더·무플래그 |
| 06 | image | q6.png | f03e2cb08d9ffe3f8a3412c2015c4d6297272422 | 그래프 디코드·무플래그 |
| 10 | solutionImage | q10-solution.svg | 4486c7b3c718f37b4046cc05f022467e0618b581 | 렌더·무플래그 |
| 11 | solutionImage | q11-solution.svg | 2ade13ab1b0fa13c68c1d9278d878a576507745a | 렌더·무플래그 |
| 14 | solutionImage | q14-solution.svg | 5403a7cf76bea6eea57541671f7fbb6b073ea878 | 렌더·무플래그 |
| 15 | image | q15.png | 1c6cfe8fbbbb70bb090f2c0912a83f4f1e048b12 | 접선 스캔 디코드·무플래그 |
| 15 | solutionImage | q15-solution.svg | 105401f16d70c8b5a3da09700b82b5bf44a6e25d | 접선·중심각 렌더·무플래그 |
| 18 | solutionImage | q18-solution.svg | a87929b6ef78a5f2a991d8319a0512e4ce6df2ad | 렌더·무플래그 |
| 19 | image | q19.png | b7f6bd4b32d53d91f2d96e11a1390c6300fd94a3 | 코사인 그래프 디코드·무플래그 |
| 19 | solutionImage | q19-solution.svg | 8c78c1edccae5b37830be0c184b8b4e121789035 | 렌더·무플래그 |
| 20 | solutionImage | q20-solution.svg | 1e3cea5da5a05560243900f869751eec2636c772 | 렌더·무플래그 |
| 21 | solutionImage | q21-solution.svg | 92739f97c356af6b069fe8245becfb7550a4ed20 | 렌더·무플래그 |
| 22 | image | q22.png | 53a197536e6f563f93bd53b6f1c9315780552286 | 직각도형 디코드·무플래그 |
| 22 | solutionImage | q22-solution.svg | 891308a143bad67339020fb0ccb342405839f475 | 렌더·무플래그 |

## 엔진 인계

- 정지 이미지 검수에서 별도 신규 VISUAL_UPGRADE 예약 없음. 실제 앱 내 텍스트/수식 중첩·축척·색상은 별도 확인해야 한다.
- 정답/해설 KEEP와 실제 화면 PASS는 다르다. 향후 이미지 변환·교체 시 Q와 원본 SHA 연결을 재확인하고 회귀테스트를 별도로 실행할 것.
