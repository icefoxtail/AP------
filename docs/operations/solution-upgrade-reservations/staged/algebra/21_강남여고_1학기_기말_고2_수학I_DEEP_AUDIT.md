# 21_강남여고_1학기_기말_고2_수학I — 해설 DEEP AUDIT + 이미지 실물 검수 (2026-11-22)

> 엔진 인계용 문서. 원본 JS·PNG·SVG 및 학생 UI를 수정하지 않는다. `KEEP_MATH`는 CI/학생화면 PASS가 아니다.

## 범위와 결론

- 원본 `archive/exams/original/high/h2/1final/21_강남여고_1학기_기말_고2_수학I.js` (Git blob `bc01e0aa4397e7a1383a6e208e7eba0f83f8d841`), **30문항**.
- 정답·보기·해설 계산·구간·도형 조건 전수 대조 **KEEP_MATH 30 / HOLD_MATH 0**.
- 활성 이미지 **12개(PNG 6, SVG 6)**: PNG 원본 디코드, SVG Inkscape→PNG 실제 렌더, 합성 연락시트/원본 확대 육안 확인 **12/12 성공**. 가독성 개선 예약 **4개 파일**.
- 실제 학생 앱, 모바일/MathJax 크롭, preflight/CI, ALIVE/Golden/Negative **NOT_RUN**.

## 문항별 검산 (30/30)

| Q | 발문 식별 | 정답 | 독립 검산·제약 확인 | 현행 이미지 | 판정 |
|---:|---|---|---|---|---|
| 01 | 3⁰·8^(2/3) | ④ | 1·4=4. | 없음 | KEEP_MATH |
| 02 | log₅40+log₅(5/8) | ② | log₅25=2. | 없음 | KEEP_MATH |
| 03 | log₃(x+2)=3 | ③ | x+2=27→x25, 진수 양수. | 없음 | KEEP_MATH |
| 04 | (1/2)^(x−5)≥4, 자연수 합 | ⑤ | x≤3, 1+2+3=6. | 없음 | KEEP_MATH |
| 05 | log₃(x−2)<2 열린 구간 | ① | 진수 x>2, x<11→양끝 합13. | 없음 | KEEP_MATH |
| 06 | Σ(aₖ−3bₖ+2), k1..20 | ③ | 2−9+40=33. | 없음 | KEEP_MATH |
| 07 | 9/4,a,4 등비·a>0 | ② | a²=9→a3. | 없음 | KEEP_MATH |
| 08 | a=2√2,b3,C45°, c² | ① | 8+9−2·2√2·3·√2/2=5. | q08.png | KEEP_MATH |
| 09 | a₅16,a₈25, a₁₃ | ④ | d3, a₁₃=25+5·3=40. | 없음 | KEEP_MATH |
| 10 | aₙ₊₁+3aₙ=(−1)ⁿn | ① | a₁1→a₂−4→a₃14→a₄−45. | 없음 | KEEP_MATH |
| 11 | Σ1/[(k+1)(k+2)], 1..7 | ⑤ | 1/2−1/9=7/18. | 없음 | KEEP_MATH |
| 12 | GP S₃14,S₆126,a+r | ④ | r³8→r2,a2→4. | 없음 | KEEP_MATH |
| 13 | aₙ=√(n+1)−√n, 제곱차 합 | ④ | (a+1)²−(a−1)²=4a, Σa=3−1=2→8. | 없음 | KEEP_MATH |
| 14 | a,b,c AP·지수 조건·abc | ② | a+c=2b, a+c−b5→b5, ac16→abc80. | 없음 | KEEP_MATH |
| 15 | 반지름4·넓이4π/3 부채꼴 | ② | θπ/6, 호2π/3, π²/(θl)=9. | 없음 | KEEP_MATH |
| 16 | sinx=1/3, 0≤x<5π/2 세 근 | ① | α,π−α,2π+α→a+(b−c)/2=−π/2, sin=−1. | q16-solution.svg | KEEP_MATH |
| 17 | tanθ2, 삼각식 | ② | 분자 4cos²θ=4/5, 분모−2→−2/5. | 없음 | KEEP_MATH |
| 18 | AP·GP a₁=b₁2,a₂=b₂,a₄=b₄ | ① | r³−3r+2=(r−1)²(r+2)=0, r≠1→r−2,d−6; a₅+b₅=10. | 없음 | KEEP_MATH |
| 19 | 4항 AP 합36, 양끝 곱 차32 | ⑤ | 중심9, 공차 제곱16→3,7,11,15, 최대15. | 없음 | KEEP_MATH |
| 20 | 코흐 눈송이 첫 정삼각형→넷째 | ③ | 둘레 3·(4/3)³=64/9. | q20_1.png, q20_2.png | KEEP_MATH |
| 21 | 원 R2 속 역방향 정삼각형 둘 | ⑤ | 정삼각형 각각 3√3, 겹친 육각형 2√3, 음영4π−4√3→a²+b²=32. | q21.png, q21-solution.svg | KEEP_MATH |
| 22 | 3cos(2πx−π/3)=a, 0<x<2 | ④ | 두 주기 열린 구간; a=3/2는 양끝 2개 제외해 3근, 가능한 개수 0·2·3·4→m+n=13. | q22-solution.svg | KEEP_MATH |
| 23 | AB=BC2, B120°, 2AP=3CP | ② | AC2√3,R2,∠APC60°, AP3t·CP2t,t²12/7→7S/R=9√3. | q23.png, q23-solution.svg | KEEP_MATH |
| 24 | f(x)=x²/2, y축 자연수 좌표 합 | ⑤ | 홀수 n은 aₙ=n², 짝수는 3n²/2; 1..10 합165+330=495. | 없음 | KEEP_MATH |
| 25 | AP a₁14,a₃10와 GP 교점 | ③ | aₘ=16−2m (m≥2), 양의 후보 12,10,8,6,4,2; (b,r) 총23쌍. | 없음 | KEEP_MATH |
| 26 | sinx=sinnx·sinx=cosnx 근수 차 합 | ① | n mod4의 증가량 (2,−1,2,1), k2..m 합361→m360. | q26-solution.svg | KEEP_MATH |
| 27 | [서술] Sₙ=3n²+n−1 | a₁3,aₙ=6n−2(n≥2);59 | S₁3, 차분6n−2, a₄22+a₆34+a₁3=59. | 없음 | KEEP_MATH |
| 28 | [서술] 원 O 내부, 현 AB8√2, sinC2√2/3 | R6;sinB√5/3 | R=AB/(2sinC)=6; d(O,AB):d(O,AC)=cosC:cosB=1:2→cosB2/3. | q28.png, q28-solution.svg | KEEP_MATH |
| 29 | [서술] 두 근4·6, 이중합 | 144 | Σₖ₌₁⁶Σᵢ₌₁⁴(k+i)=4·21+10·6=144. | 없음 | KEEP_MATH |
| 30 | [서술] 1³+…+n³ 귀납 | 귀납법 성립 | n1 성립; (n(n+1)/2)²+(n+1)³=((n+1)(n+2)/2)². | 없음 | KEEP_MATH |

## 현행 참조 이미지 실물 검수 (12/12)

기준 `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/`; 각 SHA는 원본 Git blob. PNG 직접 열람, SVG는 Inkscape 렌더·연락시트 관찰.

| Q | 파일 | blob SHA | 관찰 및 판정 |
|---:|---|---|---|
| 08 | q08.png | 4e8aab526598398c7708a4e55c3c3c68c38a86bf | a,b,C45° 수치 판독 가능 |
| 16 | q16-solution.svg | abfe537e94e679eb2f2f57b48288f4c4df35312b | sinx·y1/3 교점 및 열린 오른쪽 끝 |
| 20 | q20_1.png | 43b986f895b62fe02904510bcb6469aed3dcfc4a | **VISUAL_UPGRADE:** 코흐 분할 과정 설명 상단 글자 잘림·스캔 흔적. 깨끗한 1차 변형 재도식 |
| 20 | q20_2.png | fd1c05533ebeddb5ba742b3aed9e9aa8e9e57752 | **VISUAL_UPGRADE:** 단계별 눈송이 원본이 거의 백지처럼 저대비·깨진 윤곽. 1~4단계 벡터 재제작 |
| 21 | q21.png | 6287ec7d52629b4538672500638560684f7c90d1 | **VISUAL_UPGRADE:** 바깥 음영·정삼각형 라벨이 거친 노이즈에 묻힘. 음영 영역을 실제 발문대로 선명하게 재도식 |
| 21 | q21-solution.svg | de748595e570bf42e7d3e3cac64d0b3760c4d8d7 | 두 정삼각형·겹친 정육각형과 중심거리 렌더 |
| 22 | q22-solution.svg | ca7e2b4c4092488c93892d210e25cd9479bc1962 | 두 주기·끝점 제외와 y=3/2 높이 확인 |
| 23 | q23.png | ef7a84290926fe5175fa943f6f1885fb6b093af8 | **VISUAL_UPGRADE:** 원 위 A,B,C,P와 호 표시 스캔 저대비·잡음. 호 위 점의 위치 정확히 재도식 |
| 23 | q23-solution.svg | 4f729936ebafe3eae5aacdeaef34ff979e1defe5 | 삼각형 APC의 3t·2t·각P60° 렌더 |
| 26 | q26-solution.svg | 40c706f1e2f5a24b1b845ee2d78d6f6631aacaa4 | 단위원 위치·교점 겹침 보조 |
| 28 | q28.png | 3bd1d18b140566a11e6067b317fdc5e61fca2e53 | 원내접 ABC·중심 O 원본 |
| 28 | q28-solution.svg | 6290d4681f706783e7a489f1fc944ffe3b37d083 | 현과 중심 수선거리 2:4 표시 |

## 엔진 인계

- **이미지 교체 예약 4건:** Q20 `q20_1.png`, `q20_2.png`; Q21 `q21.png`; Q23 `q23.png`. 노이즈를 확대/샤프닝으로 덮지 말고 원본 발문/좌표/음영 의미를 보존한 SVG로 재제작.
- Q22의 `a=3/2`는 코사인 주기 양 끝값이 같아 내부 해 **3개**라는 특수 사례를 유지. Q28 O가 삼각형 안에 있으므로 코사인 부호가 양수인 예각 조건을 유지.
- 이미지 렌더 자체는 성공. 실제 학생 UI·MathJax·CI·출고 검증 **NOT_RUN**.
