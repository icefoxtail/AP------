# 20_매산여고_1학기_기말_고2_수학I — 해설 DEEP AUDIT + 이미지 실물 검수 (2026-11-22)

> 엔진 인계용 문서. 원본 JS/PNG/SVG와 학생 UI 변경 없음. `KEEP_MATH`는 CI/실기기 테스트 PASS가 아니다.

## 범위와 결론

- 원본 `archive/exams/original/high/h2/1final/20_매산여고_1학기_기말_고2_수학I.js` (Git blob `6291c196dc9e54da377846b9b29eb153c11fe0f2`), **23문항**.
- 답·해설 계산, 부분합의 첫항 예외, 열린 구간·수열 조건 전수 대조 **KEEP_MATH 23 / HOLD_MATH 0**.
- 활성 이미지 **8개(PNG 2, SVG 6)**, PNG 디코드·SVG Inkscape→PNG 렌더 후 육안 대조 **8/8 성공**; 신규 확정 교체 예약 없음.
- 학생 앱/모바일/MathJax, preflight/CI, ALIVE/Golden/Negative **NOT_RUN**.

## 문항별 검산 (23/23)

| Q | 발문 식별 | 정답 | 독립 검산·경계 확인 | 현행 이미지 | 판정 |
|---:|---|---|---|---|---|
| 01 | aₙ=n²+1, a₂+a₇ | ① | 5+50=55. | 없음 | KEEP_MATH |
| 02 | Σ3k/(k+6)+Σ18/(k+6), k1..19 | ③ | 한 항 3, 19개→57. | 없음 | KEEP_MATH |
| 03 | AP a₁−3,a₇9,a₁₀ | ⑤ | d2, a₁₀15. | 없음 | KEEP_MATH |
| 04 | GP a₁−3,r2,a₆ | ① | −3·2⁵=−96. | 없음 | KEEP_MATH |
| 05 | AP a₁97,d−3, 처음 aₙ<2 | ② | aₙ=100−3n<2→n33, n32는4. | 없음 | KEEP_MATH |
| 06 | f(x+2)=f(x), f(44/3) | ④ | 44/3=14+2/3, cos[(π/2)(2/3)]=1/2. | 없음 | KEEP_MATH |
| 07 | 7항 AP √3..5, 가중합 | ④ | a+2b+4c+2d+e=10√3+30(5−√3)/6=25+5√3. | 없음 | KEEP_MATH |
| 08 | sin²B+sin²C=2sinBsin(A+B) | ⑤ | sin(A+B)=sinC→(sinB−sinC)²=0, B=C 이등변. | 없음 | KEEP_MATH |
| 09 | GP 8항씩 묶음합 16,24 | ② | r⁸=3/2, 다음8항36→S₂₄=76. | 없음 | KEEP_MATH |
| 10 | AB8,AC4,A120°, AD 각이등분선 | ① | BD:DC=2:1, 코사인법칙 두 식으로 AD=8/3. | q10.png, q10-solution.svg | KEEP_MATH |
| 11 | 모든 x, cos²x−3cosx−a+8≥0 | ④ | t=cosx∈[−1,1], 최솟값6−a→a 최대6. | q11-solution.svg | KEEP_MATH |
| 12 | AB30m, 관측각 75°·60°·30° | ③ | ∠AQB45°, AQ=15√6m, 나무 높이 AQtan30°=15√2m. | q12.png, q12-solution.svg | KEEP_MATH |
| 13 | 방정식 근 α+β3,αβ−2, 삼중합 | ① | (1/8)Σ₁¹⁵(k³+3k²−2k)=2235. | 없음 | KEEP_MATH |
| 14 | 14개 양항, 짝수항/홀수항3배 | ④ | (a₂ₙ₋₁,a₂ₙ)=(4n−3,3(4n−3)), n1..7 합364. | 없음 | KEEP_MATH |
| 15 | sin(πcosx)=0, 0≤x<π | ② | cosx=1 또는0, x0·π/2→합π/2; xπ는 제외. | q15-solution.svg | KEEP_MATH |
| 16 | floor(2cosx), −π/2≤x≤π/2 명제 | ③ | 치역 {0,1,2}, y축 대칭; f=1인 구간에서 x0 제외→ㄱㄴ만 참. | q16-solution.svg | KEEP_MATH |
| 17 | 수열 참거짓 4개 명제 | ③ | ㄱ 짝수첨자 AP, ㄹ n≥2 차분 참; ㄴ·ㄷ 반례→ㄱㄹ. | 없음 | KEEP_MATH |
| 18 | 4주기 첨자 aₙ, Σ₁³²log₃aₖ | ⑤ | 홀수첨자 합108, 짝수첨자 합96→204. | 없음 | KEEP_MATH |
| 19 | 월초 복리 진아 36회 vs 윤민 18회 | 진아, 8000원 | 20만·1.007·(1.28−1)/.007=805.6만, 40만·1.006·(.12)/.006=804.8만. | 없음 | KEEP_MATH |
| 20 | AP a₁3,d4,S₉ | 171 | a₉35, 9(3+35)/2=171. | 없음 | KEEP_MATH |
| 21 | [서술] a7,b9,c6, cosB·넓이 | 1/21;2√110 | cosB=(49+36−81)/84=1/21, 넓이21sinB=2√110. | q21-solution.svg | KEEP_MATH |
| 22 | [서술] Sₙ=2n²+1, 10≤aₙ≤40 | a₁3,aₙ=4n−2;8개;192 | n≥2 차분4n−2; n3..10 8개, 합8(10+38)/2=192. | 없음 | KEEP_MATH |
| 23 | [서술] Σ1/(√(2k−1)+√(2k+1))=7 | p112;28/345 | Σ=(√(2n+1)−1)/2→n112; 새 Sₙ=n²+5n→aₙ=2n+4, 망원합 28/345. | 없음 | KEEP_MATH |

## 현행 참조 이미지 실물 검수 (8/8)

기준 `archive/assets/images/20_매산여고_1학기_기말_고2_수학I/`; SHA는 Git blob. PNG 직접 확인, SVG 실제 렌더하여 기호/각·축과 원본 대조.

| Q | 파일 | blob SHA | 관찰 및 판정 |
|---:|---|---|---|
| 10 | q10.png | bc2be3489a1f096c3a4f2cb6088a16d3312b377b | AB8·AC4·A 이등분 표기 |
| 10 | q10-solution.svg | 2f301a50eb4376bccaa466cc88b562bbaed65a63 | BD2t·DCt·A60° 보조 |
| 11 | q11-solution.svg | 59d2a307077b2e306ab3fec90fe30d9306b67eaa | t=cosx 이차함수 최솟값 방향 |
| 12 | q12.png | 55f8af6b9e76cfc88ce8425f76e93fac37692f57 | 나무·관측지점 A,B·각 30/75/60° 원본 |
| 12 | q12-solution.svg | b42cd96e8b9d05b4e86897c1bd1eb97384d4a140 | 지면 삼각형 AQB·직각 AQP 다중 패널 |
| 15 | q15-solution.svg | 7394aa0805c1cf14fc71645bbbd83d277d540665 | cosx가 1에서 −1까지 감소, 열린 xπ |
| 16 | q16-solution.svg | 389a3d01303aad6c40fdab36a62ac8fd78463028 | 눈금함수의 0에서 단일 최고값2·열린 경계 |
| 21 | q21-solution.svg | bde16e38c7d15f02faadb3480d83c52e01e264b5 | 변 a7,b9,c6 삼각형 배치 |

## 엔진 인계

- Q15는 x=π가 열린 끝점이라 근 합에 포함되지 않음. Q16은 x=0에서만 floor(2cosx)=2인 경계값을 유지.
- Q22의 `a₁=S₁=3`은 이후 일반식 `4n−2`와 다르므로 따로 표시. Q23은 처음 수열과 (2)의 새 수열을 구분.
- 원본 정지 이미지에서 확정 교체 예약 없음. 앱/실기기/CI·출고 검증 **NOT_RUN**.
