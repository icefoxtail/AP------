# 21_매산고_1학기_기말_고2_수학I — 해설 DEEP AUDIT + 실물 이미지 검수 (2026-11-22)

> 문서 전용(engine handoff). 원본 JS/PNG/SVG·학생 UI·엔진 수정 없음. 해설 `KEEP_MATH`는 런타임 PASS와 별개다.

## 원본·검수 범위

- 원본 `archive/exams/original/high/h2/1final/21_매산고_1학기_기말_고2_수학I.js`, Git blob `43e254fa96efacd3707cc6c21c21bc63e252d592`, **20문항**.
- 객관식 15·단답/서술형 5의 정답·해설·수치·정의역 확인: **KEEP_MATH 20 / HOLD_MATH 0**.
- 현행 이미지 **9개(PNG 2, SVG 7)**: 원본 PNG 디코드 및 SVG Inkscape→PNG 렌더 **9/9 성공**; Q14 보조도형의 시각 혼잡 **1건 개선 예약**, 수학적 정오와 분리.
- `q15-solution-v2.svg`가 현행 해설 자산; 옛 `q15-solution.svg`는 이 표의 활성 자산이 아니다. 앱·모바일·MathJax·preflight/CI·ALIVE/Golden/Negative **NOT_RUN**.

## 문항별 수학 검산 (20/20)

| Q | 발문 식별 | 정답 | 독립 계산·조건 확인 | 이미지 | 판정 |
|---:|---|---|---|---|---|
| 01 | cos(11π/6) | ⑤ | 제4사분면, 값 √3/2. | 없음 | KEEP_MATH |
| 02 | a₁+a₃=18,a₂+a₄=28 | ② | 두 식 차 2d=10 →d=5. | 없음 | KEEP_MATH |
| 03 | R10, sinA3/5, BC | ⑤ | BC=2RsinA=12. | 없음 | KEEP_MATH |
| 04 | 3π/2≤x≤2π, 2sinx+√3=0 | ② | sinx=−√3/2→x=5π/3 하나. | 없음 | KEEP_MATH |
| 05 | AP a₄5,a₉−25,Sₘ−77 | ⑤ | d=−6,a₁=23, m(26−3m)=−77→m=11. | 없음 | KEEP_MATH |
| 06 | x,5,y AP; x,4,y GP | ③ | x+y10,xy16→x²+y²=68. | 없음 | KEEP_MATH |
| 07 | √3+3cosx<0, 경계 α·β | ① | α+β=2π, tan[(α+β)/3]=−√3. | q7-solution.svg | KEEP_MATH |
| 08 | Sₙ=n²+2n−2, a₁+a₅+S₅ | ⑤ | a₁1, a₅=33−22=11, S₅33→45. | 없음 | KEEP_MATH |
| 09 | 삼차방정식 세 근의 역수 AP | ③ | 역수 근 u±d,u; u³−7u+6=0, 실수공차 가능 u−3→k−9. | 없음 | KEEP_MATH |
| 10 | 절댓값 삼각함수의 M+m+T | ④ | 3·abs(sinπx)−1, M2,m−1, 주기1→2. | q10-solution.svg | KEEP_MATH |
| 11 | 모든 x에서 삼각 부등식 ≤0 | ② | t=sinx∈[−1,1], 1−t²−4t 최대4→a≤−4. | q11-solution.svg | KEEP_MATH |
| 12 | 등비수열 A₁₀63,C₁₀7,B₁₀ | ① | a²r⁹=A/C=9; B₁₀=(a²r⁹)⁵=3¹⁰. | 없음 | KEEP_MATH |
| 13 | GP S₆6,S₁₂390, 13~18항 합 | ④ | r⁶=390/6−1=64; 제3묶음 합 6·64²=3·2¹³. | 없음 | KEEP_MATH |
| 14 | 삼각형 11·15·10과 정사각형 | ② | B(0,0),C(15,0),A(41/5,8√21/5); ΔADC=51+12√21→a+b63. | q14.png, q14-solution.svg | KEEP_MATH |
| 15 | x/(nπ)=sin4x 양의 근 개수 | ⑤ | t=4x, 양의 반파장 2n개; 첫 1회·나머지 2회→aₙ=4n−1, S₁₀=210. | q15-solution-v2.svg | KEEP_MATH |
| 16 | [단답] a11,b8,c4, cosC | 169/176 | (11²+8²−4²)/(2·11·8)=169/176. | q16.png | KEEP_MATH |
| 17 | [단답] 변 3·5·7 외접원·내접원 넓이차 | 187π/12 | Δ15√3/4, R²49/3,r²3/4→π(R²−r²)=187π/12. | q17-solution.svg | KEEP_MATH |
| 18 | [단답] a 자연수·0<b<π 조건 | 9 | tanb=1→bπ/4<1; logb<0, a^logb>b→log a<1→a1..9. | 없음 | KEEP_MATH |
| 19 | [서술형] f∘sin 실수 정의역과 M/m | √2 | sinx∈[1/2,1]→x∈[π/6,5π/6]; M1,m1/√2→√2. | q19-solution.svg | KEEP_MATH |
| 20 | [서술형] f³=f, f²(f(n+2)−2)=n | 2043231 | h=f² 멱등·전사→h=id, f(k)=k(k≥3); f(1)+f(2)=3, 합2021·2022/2. | 없음 | KEEP_MATH |

## 실제 참조 이미지 렌더 검수 (9/9)

기준 폴더 `archive/assets/images/21_매산고_1학기_기말_고2_수학I/`; Git blob SHA. 원본 PNG와 SVG→PNG 렌더 연락시트의 각도·라벨·축·보조선 대조.

| Q | 파일 | blob SHA | 렌더·시각 확인 |
|---:|---|---|---|
| 07 | q7-solution.svg | 822180e639d5c9868fa29fa1817f73f772385d10 | 코사인 부등식 열린 구간 |
| 10 | q10-solution.svg | 189e97c99c2768847a0b70cf2fb6243a0a2af02d | 절댓값 사인 그래프와 주기 |
| 11 | q11-solution.svg | f71b4ce92d0e42da5e818c7f81e80dde24d1c43e | t∈[−1,1] 최대값 보조 |
| 14 | q14.png | a12724801ffc6179f6ab159ada14cebbaa12a974 | 삼각형 ABC·정사각형 BDEC 원본, AB11·BC15·AC10 |
| 14 | q14-solution.svg | 46738920553a20dd24bab6edc84c1a9064ec1878 | **VISUAL_UPGRADE:** 원본에 없는 거대한 겹침 원 2개·영역 채색으로 넓이 분할이 혼잡; 정사각형과 세 삼각형만 명료하게 재도식 권장 |
| 15 | q15-solution-v2.svg | 29a9e066d51a49d414772c79009081d10b8630db | 사인 곡선-직선 교점 개수 |
| 16 | q16.png | a78e9764cf63834acff42184822f2bdcaa2a45ae | 삼각형 변 길이 원본 |
| 17 | q17-solution.svg | 9bd11ee7c44c3997bef53e59e2d11794184a4faa | 내·외접원 넓이 보조 |
| 19 | q19-solution.svg | 5ed3e6b620d0404748f241fe34f6f80dd690843c | 합성함수 정의역·함숫값 보조 |

## 엔진 인계

- **이미지 개선 예약 1개:** Q14 `q14-solution.svg`. 삼각형 ABC/정사각형 BDEC의 기존 구조·라벨을 살리고 혼잡한 원형 오버레이 제거 및 ΔABC+ΔBCD−ΔABD 분할 명료화. 원본 PNG나 계산식은 변경 대상으로 보지 않음.
- Q15 근 개수는 `x>0` 때문에 원점 교점을 빼고 첫 반파장만 1회로 계산. Q20은 자연수 정의역과 f²의 전사성을 보존해야 함.
- 학생 앱·수식·실기기·CI 출고 검증 **NOT_RUN**.
