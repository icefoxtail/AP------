# 20_매산고_1학기_기말_고2_수학I — 해설 DEEP AUDIT + 이미지 실물 검수 (2026-11-22)

> 엔진 인계용 문서. 원본 JS·PNG·SVG와 학생 UI 수정 없음. `KEEP_MATH`는 출고 검증 PASS가 아니다.

## 범위와 결론

- 원본 `archive/exams/original/high/h2/1final/20_매산고_1학기_기말_고2_수학I.js` (Git blob `240f3415e44618fd4d1d54fc47d50adaec093afb`), **20문항**.
- 정답·해설·구간·선분 위치/보조조건 재검산 **KEEP_MATH 20 / HOLD_MATH 0**.
- 활성 참조 이미지 **12개(PNG 6, SVG 6)**: PNG 디코드·SVG Inkscape→PNG 렌더 및 원본-해설 보조도형 육안 확인 **12/12 성공**. 시각 명료화 **1건 예약**.
- 학생 화면·모바일·MathJax·preflight/CI·ALIVE/Golden/Negative **NOT_RUN**.

## 문항별 검산 (20/20)

| Q | 발문 식별 | 정답 | 독립 계산·제약 확인 | 현행 이미지 | 판정 |
|---:|---|---|---|---|---|
| 01 | AB6√3,C60°, 외접원 넓이 | ③ | R=AB/(2sinC)=6, 넓이36π. | q01.png | KEEP_MATH |
| 02 | AP a₁−2,a₅10,S₅ | ⑤ | S₅=5(−2+10)/2=20. | 없음 | KEEP_MATH |
| 03 | GP a₃12,a₆−96, −384의 항 번호 | ① | r³−8→r−2, a₈=12(−2)^5=−384. | 없음 | KEEP_MATH |
| 04 | Σ₂/[(2k−1)(2k+1)], k5..10 | ② | Σ(1/(2k−1)−1/(2k+1))=1/9−1/21=4/63. | 없음 | KEEP_MATH |
| 05 | 1−√2sinx<0, 0≤x<2π | ③ | sinx>1/√2→π/4<x<3π/4. | 없음 | KEEP_MATH |
| 06 | AB2k,BC3k+1,Bπ/6, 넓이 합 | ④ | Sₖ=k(3k+1)/2, k1..4는2+7+15+26=50. | q06.png | KEEP_MATH |
| 07 | 명제 p(1), p(n)→p(3n),p(4n) | ② | 보장 첨자 3ᵃ4ᵇ, 48=3·4² 가능. | 없음 | KEEP_MATH |
| 08 | 사면체 PA4, 두 직각, ABP30°·ACP45° | ③ | AB4√3,AC4,∠BAC30°→BC²=48+16−48=16, BC4. | q08.png, q8-solution.svg | KEEP_MATH |
| 09 | a,b,c GP·sinA,B,C AP | ④ | 사인법칙 2b=a+c, GP b²=ac→a=b=c 정삼각형. | 없음 | KEEP_MATH |
| 10 | x²−2nx+2n−5 두 근의 세제곱 합 | ⑤ | a³+b³=(2n)³−3(2n)(2n−5); n1..4 합740. | 없음 | KEEP_MATH |
| 11 | Σk³ 귀납의 f,g,h | ③ | f(5)225,g(3)25/4,h(4)15→5f(5)/(g(3)h(4))=12. | 없음 | KEEP_MATH |
| 12 | (aₙ+aₙ₊₁)²=4aₙaₙ₊₁+4ⁿ | ① | 양의 차 aₙ₊₁−aₙ=2ⁿ, a₃4→a₁₀=4+(2¹⁰−2³)=1020. | 없음 | KEEP_MATH |
| 13 | AC10, AD 각이등분, S₁:S₂=3:5 | ⑤ | 두 코사인법칙 근 t=√6,3√6; AB>AD로 t√6, AD√30, S₂5√14. | q13.png, q13-solution.svg | KEEP_MATH |
| 14 | AB5√6,AC10,AD7√2,C60° | ① | BC=5+5√3, CD 후보5±√23 모두 가능, BD 합2BC−10=10√3. | q14.png, q14-solution.svg | KEEP_MATH |
| 15 | a^(log₉125)=25ⁿ, log₃a₁..a₂₀ 합 | ① | log₃aₙ=4n/3, 합(4/3)·210=280. | 없음 | KEEP_MATH |
| 16 | [단답] Sₙ=2n²−5n+6, 일반항 | a₁3,aₙ=4n−7(n≥2) | S₁3, n≥2 차분4n−7. | 없음 | KEEP_MATH |
| 17 | [단답] 3sin²x−sinxcosx−1=0, 3사분면 | −1 | 2tan²x−tanx−1=0, tanx>0→tanx1, x5π/4, cos2x−sin2x=−1. | 없음 | KEEP_MATH |
| 18 | [단답] 사각형 ABCD, 면적 계수합 | 19 | BF4,FC4√3,DF4, BD4√2; 두 삼각형 넓이8+8√3+3√6→계수합19. | q18.png, q18-solution.svg | KEEP_MATH |
| 19 | [서술] f(2cosx)=1, 실근 4개 k 범위 | (−1,0)∪(0,1/8) | 유효한 f(t)=1 교점 t1/3,9/5와 x∈(0,2π), k 부등식 끝점·k0 제외. | q19.png, q19-solution.svg | KEEP_MATH |
| 20 | [서술] 부분합 Aₙ=pn²+pn,Bₙ=qn²−pn+q | p−2,q3 | aₙ2pn,bₙ=q(2n−1)−p(n≥2); Tₙ 차분 계수로 pq−6,p²4, p<q→(−2,3). | 없음 | KEEP_MATH |

## 현행 참조 이미지 실물 검수 (12/12)

기준 `archive/assets/images/20_매산고_1학기_기말_고2_수학I/`; SHA는 Git blob. PNG 원본, SVG Inkscape 렌더 후 각도·점 대응 확인.

| Q | 파일 | blob SHA | 관찰 및 판정 |
|---:|---|---|---|
| 01 | q01.png | 5372a78c2d91333bd03439c9704d2c3cd03901cb | AB6√3·Cπ/3 원본 판독 |
| 06 | q06.png | 835fabd2474e1d6928556c82231e90a8d3078181 | 두 변2k·3k+1, Bπ/6 판독 |
| 08 | q08.png | d87256935d1b9aab5c40b03bda6075166ecc65fa | 사면체 PABC·PA4cm 수선 |
| 08 | q8-solution.svg | 6ec2ab3f57698be3c674640ac10225280e01dbcc | 두 직각삼각형과 ABC 보조 |
| 13 | q13.png | 1d465ade9b900c48faa0f51da02e02af90efebdc | AC10·D 각이등분 원본 |
| 13 | q13-solution.svg | bfaa14d284a54bf58ab82b2596e49f9d33c04dfc | AD√30·분할 넓이 보조 |
| 14 | q14.png | 81dc79146355630e3c3a7be7b7623268c0f6991a | AB5√6·AC10·AD7√2·C60° |
| 14 | q14-solution.svg | c8b51b969a29fa4ba2a458a821708fa332146d76 | **VISUAL_UPGRADE:** 원래 삼각형과 동떨어진 AB/AD 길이선 및 별도 C—D′ 선분으로 두 후보가 실제 BC 위 어디에 놓이는지 혼란. BC 공통으로 두 D 후보를 비교하는 통합 도식 권장 |
| 18 | q18.png | 69c35ef349a35190e9eb4ffff4f02ca3291d331c | 사각형·∠D105°·∠C30° 원본 |
| 18 | q18-solution.svg | 6f1e7b4142e9ddfd04a8f338b5e864417f636706 | 수선 BF4·분할 삼각형 수치 |
| 19 | q19.png | ea555a621b04582b27e292b439c046dcdad5a19c | f(t) 구간 꺾은선 그래프 원본 |
| 19 | q19-solution.svg | 22a28300df160d8319cd5ea1e23653d817561377 | f(t)=1 해 t1/3,9/5·t<2 보조 |

## 엔진 인계

- Q14 `q14-solution.svg` **시각 명료화 1건 예약**. 같은 BC 위에서 `CD=5±√23` 두 가능한 D를 한 도식에 표시하고 원본 길이/각과 연결. 수학값은 수정 대상이 아님.
- Q12는 증가 조건으로 양의 제곱근만 선택. Q14는 두 CD 후보가 **모두 0<CD<BC**이므로 한쪽을 버리면 안 됨. Q16은 첫째항 특수식 유지.
- 이미지 12개 렌더 PASS, 학생 UI/MathJax/모바일·CI 출고 검증 **NOT_RUN**.
