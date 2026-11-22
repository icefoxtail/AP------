# 22_효천고_1학기_기말_고2_수학I — 해설 DEEP AUDIT + 실물 이미지 검수 (2026-11-22)

> 문서 전용(engine handoff). 원본 JS/PNG/SVG·학생 UI·엔진 수정 없음. `KEEP_MATH`는 런타임 PASS와 다르다.

## 원본·검수 범위

- 원본 `archive/exams/original/high/h2/1final/22_효천고_1학기_기말_고2_수학I.js`, Git blob `9912e0881c64071733772605278691a3396e1f3c`, **25문항**.
- 정답·보기·해설의 수치·정의역·경계·도형 제약을 문항별로 대조: **KEEP_MATH 25 / HOLD_MATH 0**.
- 현행 참조 이미지 **14개(PNG 6, SVG 8)**: 원본 PNG 디코드와 SVG의 Inkscape→PNG 렌더 성공 **14/14**, 합성 연락시트 및 복잡도형 확대 육안 확인. 확정 이미지 교체 예약 없음.
- 실제 학생 앱/모바일/MathJax/preflight/CI/ALIVE/Golden/Negative **NOT_RUN**.

## 문항별 수학 검산 (25/25)

| Q | 발문 식별 | 정답 | 독립 계산·조건 확인 | 이미지 | 판정 |
|---:|---|---|---|---|---|
| 01 | 등차수열 a₂=−6, a₄=0 | ① | d=3, a₆=6. | 없음 | KEEP_MATH |
| 02 | 등비수열 일반항 | ④ | 공비 2, aₙ=2^(n−4). | 없음 | KEEP_MATH |
| 03 | Σk², k=1..12 | ③ | 12·13·25/6=650. | 없음 | KEEP_MATH |
| 04 | Σ1/[k(k+1)], k=1..9 | ⑤ | 1−1/10=9/10. | 없음 | KEEP_MATH |
| 05 | 등차수열 7항, 양끝 1·9 | ① | 공차 4/3, 가운데 세 항 합 a+c+e=15. | 없음 | KEEP_MATH |
| 06 | 삼각형 AB8, BC2√2, B135° 넓이 | ② | (1/2)·8·2√2·sin135°=8. | q06.png, q6-solution.svg | KEEP_MATH |
| 07 | 삼각함수 기본주기 비교 | ① | cos x만 2π; 비교된 절댓값·배각 함수는 π. | 없음 | KEEP_MATH |
| 08 | y=a cos(x−π)+b 그래프 | ④ | x=π 극대값 a+b=4. | q08.png | KEEP_MATH |
| 09 | 등차수열 S₃=−9,S₉=81 | ③ | d=4, a₁=−7 → aₙ=4n−11. | 없음 | KEEP_MATH |
| 10 | 등비수열 로그 항 차 | ③ | log r=2; log a₁₀−log a₆=4·2=8. | 없음 | KEEP_MATH |
| 11 | 이중 시그마의 n 조건 | ② | 합 차 n(n+2)=120→n=10. | 없음 | KEEP_MATH |
| 12 | 원·등차수열·cos 2θ | ⑤ | 지름 4√5, 삼각형의 cos 2θ=9/40. | q12.png, q12-solution.svg | KEEP_MATH |
| 13 | 월 0.2%, 24개월 월초 적립 | ⑤ | 200000·1.002·(1.05−1)/0.002=5,010,000원(문제의 24개월 근삿값). | 없음 | KEEP_MATH |
| 14 | Bernoulli 부등식 귀납 | ② | f(h)=1+2h, g(h)=1+(k+1)h, g(2)−f(k)=2. | 없음 | KEEP_MATH |
| 15 | Sₙ=2ⁿ−1 명제 판단 | ④ | aₙ=2^(n−1), 참인 ㄴ·ㄷ 선택. | 없음 | KEEP_MATH |
| 16 | 번갈아 항에 대한 점화 | ② | a₁=a₆=18, aₙ₊₂−aₙ=4, a₁₉=54, a₂₀=46 →100. | 없음 | KEEP_MATH |
| 17 | sinπx=−x/5+2 교점 | ② | (6,7)과 (8,9)에서 각각 2회, 총 4회. | q17-solution.svg | KEEP_MATH |
| 18 | sin3kx 교점 α+β+γ+δ | ④ | 첫 네 근의 합 4π/(3k); cos값 1/2인 최대 k=4. | q18.png, q18-solution.svg | KEEP_MATH |
| 19 | (x−n)²=x−n, 분모 유리화 | ③ | 근 n,n+1; Σ1/(√n+√(n+1)), 1..15=√16−√1=3. | q19-solution.svg | KEEP_MATH |
| 20 | 정수 k에 따른 분기 점화 | ① | 정규화한 2k+1항 주기와 14의 배수 조건→k=3. | 없음 | KEEP_MATH |
| 21 | 두 원·현 CD 길이 | ⑤ | θ₃=π−θ₁, r=3/2, cos θ₁=7/9 →CD=23/6. | q21.png, q21-solution-v2.svg | KEEP_MATH |
| 22 | [서술형] 등비수열 합 | 2ⁿ | S₃=14,S₆=126→r³=8,r=2,a₁=2 →aₙ=2ⁿ. | 없음 | KEEP_MATH |
| 23 | [서술형] Sₙ=n²+2n, Σkaₖ | 825 | aₖ=2k+1, 가중합 Σk(2k+1)=825. | 없음 | KEEP_MATH |
| 24 | [서술형] 지수·삼각 부등식 | π/6<x<5π/6 | 지수 2로 통일, cos²x−sin x<1 →sin x>1/2. | q24-solution.svg | KEEP_MATH |
| 25 | [서술형] 원내접 사각형·닮음 | 3√3/14 | BD=√7, CD=1, EAB∼ECD, ED=7/3, sinθ=3√3/14. | q25.png, q25-solution-v2.svg | KEEP_MATH |

## 실제 참조 이미지 렌더 검수 (14/14)

기준 폴더 `archive/assets/images/22_효천고_1학기_기말_고2_수학I/`. 표의 SHA는 개별 Git blob ID. PNG 직접 열람, SVG는 Inkscape 렌더 후 연락시트에서 확인.

| Q | 파일 | blob SHA | 렌더·시각 확인 |
|---:|---|---|---|
| 06 | q06.png | 934691b3978c513867bc20af6700e5decffdaba1 | AB·BC·135° 원본 수치 |
| 06 | q6-solution.svg | 578b4645d562148c35b5f7301cc13f4191d255c5 | 삼각형·높이 보조 |
| 08 | q08.png | 44d71b713306421f8de89d4fede1aacabe6082a8 | 코사인 그래프 극점 |
| 12 | q12.png | c4ce5926b69a7593f2eeeafb2dad478ec8c06172 | 원·각 θ |
| 12 | q12-solution.svg | 549c4f24e00f3d475e18bef84d0c53b3d25328e7 | 원내접 삼각형 보조 |
| 17 | q17-solution.svg | d1790652b42384b2b61efbd96f87679ec6d4469b | 사인 그래프 교점 |
| 18 | q18.png | 40475a9897bc75b3073aa952111aef6f8dd33221 | ±a 수평선·x교점 |
| 18 | q18-solution.svg | 529f35adaa5f58ccc79bf0fb5622734a3f8ff795 | 첫 네 근과 대칭 |
| 19 | q19-solution.svg | ec5fa00d969447b36b844ca63d4a978e7c833d30 | 두 교점 n,n+1 표시 |
| 21 | q21.png | 37c7120e60c9e9bdfc3b23ceaf944d17a13a9f1d | 두 원·현·각 원본 |
| 21 | q21-solution-v2.svg | ad889ee1dc99d66d1bd74ab2ba4b95a6e509c229 | 두 원과 각 관계 유지 |
| 24 | q24-solution.svg | 83985e8fe1d3920542ab6771d3b674bcc2f7690e | 삼각함수 부등식 구간 |
| 25 | q25.png | e5c657f8d70adb953b24284a400891a19cf0a590 | 원내접 ABCD와 E 원본 |
| 25 | q25-solution-v2.svg | 971845322def172e0b99266117360fa3342f7737 | 닮음 구조 재현; C의 60°는 주어진 A의 60°에서 유도한 외각임 |

## 엔진 인계

- Q21·Q25는 복잡한 원 도형의 점 순서와 외각/내각 대응을 유지. Q25 해설 SVG의 C 주변 60°는 **별도의 주어진 조건이 아닌 유도 외각**임을 사용자 설명에서 분명히 하면 좋다.
- Q17·Q18은 열린 구간의 경계와 사인 곡선 교점 개수를 구분한다.
- 현행 원본 이미지에서 **확정 교체 예약 없음**. 앱 실기기·수식 렌더·CI·출고 검증은 **NOT_RUN**.
