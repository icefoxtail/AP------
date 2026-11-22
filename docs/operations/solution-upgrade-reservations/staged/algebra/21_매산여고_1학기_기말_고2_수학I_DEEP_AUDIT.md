# 21_매산여고_1학기_기말_고2_수학I — 해설 DEEP AUDIT + 이미지 실물 검수 (2026-11-22)

> 엔진 인계용 문서. 원본 JS·PNG·SVG와 학생 UI는 수정하지 않는다. `KEEP_MATH`는 실제 앱 PASS와 다르다.

## 범위와 결론

- 원본 `archive/exams/original/high/h2/1final/21_매산여고_1학기_기말_고2_수학I.js` (Git blob `17ec9798f674de7f469f49f215b550a859d6ec7c`), **23문항**.
- 선택지/서술형 풀이·수치·도형 조건 재계산 **KEEP_MATH 23 / HOLD_MATH 0**.
- 활성 이미지 **9개(PNG 3, SVG 6)**: PNG 디코드, SVG Inkscape→PNG 렌더 및 원본/연락시트 비교 **9/9 성공**. 시각 개선 예약 **1개 파일**.
- 현행 `q18-content-correction.svg`, `q19-solution-v2.svg`, `q21-problem-v2.svg`/`q21-solution-v2.svg`를 기준으로 함. 앱/MathJax/preflight/CI/ALIVE/Golden/Negative **NOT_RUN**.

## 문항별 검산 (23/23)

| Q | 발문 식별 | 정답 | 독립 검산·제약 확인 | 현행 이미지 | 판정 |
|---:|---|---|---|---|---|
| 01 | AP a₁−30,d4 최초 양수 | ④ | aₙ=4n−34>0→최소 n9. | 없음 | KEEP_MATH |
| 02 | Σaₙ12,Σaₙ²84, 이차식 합 | ① | Σ(aₙ²−aₙ−6)=84−12−72=0. | 없음 | KEEP_MATH |
| 03 | Sₙ=3^(n+1)−3, S₅ | ② | 3⁶−3=726. | 없음 | KEEP_MATH |
| 04 | Σ₁¹⁰(k²+k+5) | ⑤ | 385+55+50=490. | 없음 | KEEP_MATH |
| 05 | A60°,B45°,BC√6, AC | ③ | AC=BCsinB/sinA=√6·√2/√3=2. | q05.png | KEEP_MATH |
| 06 | 삼각형 변 a2,b3,c4, cosA=p/q | ① | (9+16−4)/(2·3·4)=7/8→p+q15. | q6-solution.svg | KEEP_MATH |
| 07 | 지름2 외접원, Σsin각=5/2, 둘레 | ⑤ | R1, 둘레=2RΣsin각=5. | 없음 | KEEP_MATH |
| 08 | 3,x₁..x₅,243 양수 GP 로그 | ② | r⁶=81,r=3^(2/3), x₅=3^(13/3), 12log₃x₅=52. | 없음 | KEEP_MATH |
| 09 | S₂ₙ−S₂ₙ₋₁=6n+2, a₇ | ③ | a₂8,a₄14→d3,a₇23. | 없음 | KEEP_MATH |
| 10 | GP a₁+a₂18,a₆+a₇576, a₁₀ | ① | r⁵=32→r2,a₁6,a₁₀3072. | 없음 | KEEP_MATH |
| 11 | 2aₙ₊₁=aₙ+aₙ₊₂,a₂−2,a₃1 | ⑤ | 등차 d3,a₁−5,S₂₀=10(−10+57)=470. | 없음 | KEEP_MATH |
| 12 | GP S₅8,S₁₀24,S₁₅ | ③ | r⁵=2, S₁₅=8(1+2+4)=56. | 없음 | KEEP_MATH |
| 13 | AB8,AC7,BD3,CD6, AD² | ② | 두 코사인법칙 6xcosθ=x²−55, 12xcosθ=13−x²→x²=41. | q13.png, q13-solution.svg | KEEP_MATH |
| 14 | n³−n은 3의 배수 귀납 빈칸 | ④ | (k+1)³−(k+1)=(k³−k)+3(k²+k), f(2)+g(1)=6+2=8. | 없음 | KEEP_MATH |
| 15 | R10, 넓이25√2, abc | ② | abc=4RΔ=1000√2. | 없음 | KEEP_MATH |
| 16 | 2,p,16 AP 및 a₄p,a₂₀71 | ⑤ | p9,d31/8,a₁−21/8, S₂₃=920. | 없음 | KEEP_MATH |
| 17 | a₁1, 합₁³¹496, abs 인접합 | ③ | abs(aₙ)=n 귀납, 최대 합496 달성→a₈8. | 없음 | KEEP_MATH |
| 18 | cos2θ=√3/2, A3θ·Bθ·AD2 | ③ | θ15°, AE√2, ΔADE=(√3−1)/2→20S=10(√3−1). | q18-content-correction.svg | KEEP_MATH |
| 19 | [단답] 정육각형 변2√7, M=BC 중점 | 8√91/91 | MD7, ME√91, DE2√7; cosDME=(49+91−28)/(14√91)=8/√91. | q19.png, q19-solution-v2.svg | KEEP_MATH |
| 20 | [단답] a₁2, Σaₖ₊₁/(SₖSₖ₊₁)=1/7 | 5/14 | Σ(1/Sₖ−1/Sₖ₊₁)=1/2−1/S₈=1/7→1/S₈5/14. | 없음 | KEEP_MATH |
| 21 | [서술] AB3,AC6,A120° 각이등분선 | AP2;PC2√7;R2√21/3 | BC3√7,BP√7,PC2√7; 두 코사인법칙 공통 양근 AP2. | q21-problem-v2.svg, q21-solution-v2.svg | KEEP_MATH |
| 22 | [서술] d<0, abs(a₇)=abs(a₁₃) | a₁27,d−3;n최소32 | a₇=−a₁₃, 절댓값 합36→d−3,a₁27; S₃₁−558,S₃₂−624. | 없음 | KEEP_MATH |
| 23 | [서술] aₙ₊₁=((n+1)aₙ+6)/(n+2) | aₙ=(6n+4)/(n+1);248 | n1·귀납 성립, Σ₁⁸(n+1)aₙ=Σ(6n+4)=248. | 없음 | KEEP_MATH |

## 현행 참조 이미지 실물 검수 (9/9)

기준 `archive/assets/images/21_매산여고_1학기_기말_고2_수학I/`; PNG 직접 확인, SVG 실제 렌더 후 수치·점 위치 대조. SHA는 Git blob.

| Q | 파일 | blob SHA | 관찰 및 판정 |
|---:|---|---|---|
| 05 | q05.png | 779d6dcf74632067dff4e3f9fd045c80b834ba4d | A60°·B45°·BC√6 읽힘 |
| 06 | q6-solution.svg | effe69ca3f49991ba5c93e34dd096351f4023270 | a2,b3,c4와 삼각형 대응 |
| 13 | q13.png | f6bc8ddca146591b64365359f0c2ef84195413e0 | AB8,AC7,BD3,CD6 원본 판독 |
| 13 | q13-solution.svg | 05fa0062e15212bee3930c1828a2810a1c50e42c | D의 θ/180°−θ 보조 |
| 18 | q18-content-correction.svg | f2436b6a6ff61b021cdc0cbfc4712e2da0b589c6 | 현행 정정 도형의 A·B·C·D·E와 θ,3θ,AD2 |
| 19 | q19.png | 3cc14b923098d3456ca19e574657b4673d9892cc | **VISUAL_UPGRADE:** 원본 하단 C·D 표기와 호 형태가 크롭/스캔 흔적으로 흐려져 정육각형 경계 재제작 권장 |
| 19 | q19-solution-v2.svg | 2f87b5ec6dcce9e6cac66c1537186b12f7f9309a | 정육각형 전점·ME√91·MD7 선명 |
| 21 | q21-problem-v2.svg | 3b52f4f04e5983923c3b17dc8fe0aaffae2fbd91 | AB3·AC6·A120°와 각이등분선 |
| 21 | q21-solution-v2.svg | 280ce934c543f2bb981de2ce6c783574a193b995 | ∠BAP=∠PAC60°, BP√7·PC2√7 |

## 엔진 인계

- Q19 `q19.png` 벡터 교체 **1건 예약**. 원본 정육각형 점 순서 ABCDEF, M=BC 중점, DE 변2√7와 각 DME를 그대로 재현. 해설 `q19-solution-v2.svg`의 수치와 일치시킬 것.
- Q18은 현행 `q18-content-correction.svg`가 발문에서 참조되는 파일이며 기존 도형으로 회귀하지 말 것. Q17의 합 최대 달성 조건에서 부호가 전부 양수임을 유지.
- 앱/MathJax/모바일·CI·출고 검증 **NOT_RUN**.
