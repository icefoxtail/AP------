# 24_강남여고_1학기_기말_고2_수학I — 1학기 기말 고2 해설 DEEP AUDIT + 이미지 실물 렌더 검수 (2026-11-22)

> **문서 전용(engine handoff) 검수 기록.** 시험 원본 JS, 학생 UI, 원본 PNG/SVG, 엔진은 수정하지 않았다. 수학적 KEEP는 정식 배포/런타임 PASS가 아니다.

## 범위·원본 고정

- 대상: **24학년도 강남여고 1학기 기말**, 식별자 `24_강남여고_1학기_기말_고2_수학I`.
- 브랜치: `work/solution-upgrade-lane-30-20261121`.
- 원본 JS: `archive/exams/original/high/h2/1final/24_강남여고_1학기_기말_고2_수학I.js` (Git blob SHA `3222c7962638d94ddd350ef6b73c2d03403baa10`), **25문항**.
- 직접 참조 원본 이미지: **11개 (PNG 6 / SVG 5)**; `image`/`solutionImage`뿐 아니라 HTML 발문 내부 `<img src>` 포함, 아래 경로·SHA 확인.
- 검수: 원문 발문/보기/정답/현재 해설 및 핵심 계산·제약 조건 대조. **해설 KEEP_MATH 25 / HOLD_VISUAL_SOURCE 0**.
- 이미지: 원본 11개를 전부 확보, PNG 디코드 또는 SVG→PNG 렌더 성공 **11/11**, 연락시트 관찰 및 필요한 이미지 확대 검토. 렌더 오류 **0**.
- 이미지 예약: **0개** (없음); 기타 직접 참조 11개는 이번 원본 정지 화면 관찰에서 특정 결함을 지정하지 않음.
- 제외: 실제 앱 레이아웃·MathJax 런타임, 모바일, preflight/CI/ALIVE/Golden/Negative, 원본 이미지 교체 및 엔진 코드 반영 모두 **NOT_RUN**.

## 문항별 해설 검산 대장 (25/25)

| Q | 발문 식별자(앞부분) | 기존 정답 | 검산 근거(분기·수치·경계) | 참조 원본 | 해설 판정 |
|---:|---|---|---|---|---|
| 01 | 수열의 일반항이 $a_n=2n-3$일 때, 제7항의 값은? | ② | a7=2·7−3=11. | 없음 | KEEP_MATH |
| 02 | 두 수열 $\{a_n\}$, $\{b_n\}$에 대하여 $\sum_{k=1}^{10}a_k=9$, $\sum_{k=1}^{10}b_k=5$일 때, $\sum_{k=1}^{10}(a_k+2b_k)$의 값은? | ⑤ | Σ(a+2b)=9+2·5=19. | 없음 | KEEP_MATH |
| 03 | 첫째항이 4인 등차수열 $\{a_n\}$에 대하여 $a_{10}-a_7=6$일 때, $a_4$의 값은? | ① | a10−a7=3d=6→d=2; a4=4+3d=10. | 없음 | KEEP_MATH |
| 04 | $\sum_{k=1}^{10}(2k-3)$의 값은? | ④ | Σ(2k−3)=2·55−3·10=80. | 없음 | KEEP_MATH |
| 05 | 삼각형 ABC에서 $\overline{AB}=8$, $\overline{AC}=6$, $A=30^\circ$일 때, 삼각형 ABC의 넓이는? | ③ | (1/2)·8·6·sin30°=12. | solutionImage:q5-solution.svg | KEEP_MATH |
| 06 | 삼각형 ABC에서 $\overline{AB}=8$, $\angle ACB=\dfrac{\pi}{6}$일 때, 삼각형 ABC의 외접원의 반지름의 길이는? | ① | AB=8은 C의 대변; 2R=8/sin30°=16→R=8. | solutionImage:q6-solution.svg, image:q6.png | KEEP_MATH |
| 07 | 삼각형 ABC에서 $\overline{AB}=4$, $\overline{BC}=\sqrt{21}$, $A=60^\circ$일 때, 선분 $\overline{AC}$의 길이는? | ⑤ | BC²=AC²+AB²−2·AC·ABcos60°→x²−4x−5=0, 양근5. | solutionImage:q7-solution.svg, image:q7.png | KEEP_MATH |
| 08 | 공비가 $r$인 등비수열 $\{a_n\}$의 제4항이 8, 제8항이 128일 때, $r$의 값은? (단, $r>0$) | ② | a8/a4=r^4=128/8=16, r>0→r=2. | 없음 | KEEP_MATH |
| 09 | 삼각형 ABC에서 $a=8\sin A$일 때, 삼각형 ABC의 외접원의 넓이는? | ③ | a/sinA=2R=8, R=4→넓이16π. | 없음 | KEEP_MATH |
| 10 | 제3항이 7이고, 제8항이 $-23$인 등차수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합이 $-80$일 때, $n$의 값은? | ② | a3=7,a8=−23→d=−6,a1=19,S_n=n(22−3n); S_n=−80의 양근 n=10. | 없음 | KEEP_MATH |
| 11 | 등비수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합 $S_n$에 대하여 $\dfrac{S_6}{S_3}=9$일 때, $\dfrac{a_4}{a_2}$의 값은? | ④ | S6/S3=1+r³=9→r=2, a4/a2=r²=4. | 없음 | KEEP_MATH |
| 12 | 삼각형 ABC에서 $(a+b)^2=c^2+3ab$가 성립할 때, $\cos C$의 값은? | ① | (a+b)²=c²+3ab→a²+b²−c²=ab, cosC=1/2. | 없음 | KEEP_MATH |
| 13 | $\sum_{k=1}^{19}\dfrac{5}{\sqrt{5k-1}+\sqrt{5k+4}}=3\sqrt{a}-b$를 만족하는 자연수 $a$, $b$에 대하여 $a+b$의 값은? | ① | 5/(√(5k−1)+√(5k+4))=√(5k+4)−√(5k−1); 19항 합√99−√4=3√11−2→13. | 없음 | KEEP_MATH |
| 14 | 매년 초에 일정한 금액 $a$만 원을 적립하여 10년 후 연말까지 260만 원을 만들려고 한다. 연이율이 $4\%$이고 1년마다 복리로 계산할 때, $a$의 값은? (단, $1.04^{10}=1.5$로 계산한다.) | ⑤ | 연초 10회 원리합 1.04a[(1.5−1)/0.04]=13a=260→a=20. | 없음 | KEEP_MATH |
| 15 | $a_1=7$, $a_{n+1}=2a_n$ $(n=1,2,3,\cdots)$으로 정의된 수열 $\{a_n\}$에 대하여 $\sum_{k=3}^{10}a_k=a(2^b-1)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? | ② | Σk3..10 7·2^(k−1)=28(2^8−1); a+b=28+8=36. | 없음 | KEEP_MATH |
| 16 | $\dfrac{1}{1\times3}+\dfrac{1}{3\times5}+\dfrac{1}{5\times7}+\cdots+\dfrac{1}{(2n-1)(2n+1)}=\dfrac{50}{101}$일 때, $n$의 값은? | ④ | 부분분수 합 n/(2n+1)=50/101→n=50. | 없음 | KEEP_MATH |
| 17 | 그림과 같이 삼각형 ABC에서 $\overline{AB}=2$, $\overline{BC}=3$, $\overline{AC}=4$이고 점 D가 선분 BC를 $1:2$로 내분한다고 할 때, $\overline{AD}$의 값은? | ① | B=(0,0),C=(3,0),D=(1,0), A=(−1/2,±√15/2); AD²=6→√6. | solutionImage:q17-solution.svg, image:q17.png | KEEP_MATH |
| 18 | 수열 $\{a_n\}$은 $1<a_1<2$이고, 모든 자연수 $n$에 대하여 $a_{n+1}=\begin{cases}-2a_n & (a_n<0)\\ a_n-2 & (a_n\ge0)\end{cases}$ 을 만족시킨다. $a_7=-1$일 때, | ⑤ | 1<a1<2에서 부호별 점화 6회 전개; a7=4a1−8=−1→a1=7/4, 역대입으로 부호조건 확인. | 없음 | KEEP_MATH |
| 19 | 한 변의 길이가 1인 정사각형 모양의 종이가 있다. 이 정사각형을 4등분한 후 1개의 정사각형을 색칠하여 얻은 그림을 $R_1$이라 하자. 그림 $R_1$에서 색칠되지 않은 3개의 정사각형을 각각 4등분한 후 1개의 정사각형에 색칠하여 얻은 | ② | 각 회차 미채색 비율 3/4; S9=1−(3/4)^9. | image:q19.png | KEEP_MATH |
| 20 | 음이 아닌 정수 $n$에 대하여 명제 $p(n)$이 다음 조건을 만족한다고 한다. (가) $p(0)$이 참이다. (나) $p(k)$가 참이면 $p(2k+1)$, $p(3k+1)$도 참이다. (다) 집합 $P$는 (가), (나)를 만족하는 명 | ③ | 생성 규칙 k→2k+1,3k+1로 30 이하 닫힘 집합 {0,1,3,4,7,9,10,13,15,19,21,22,27,28} 14개; 명제 (가),(다) 참. | 없음 | KEEP_MATH |
| 21 | 그림과 같은 삼각형 ABC에서 선분 BC 위의 점 D에 대하여 $\overline{BD}=6$, $\overline{CD}=3$이다. 점 A를 중심으로 하고 반지름의 길이가 $r$인 원이 세 선분 AB, AD, AC와 만나는 점을 각각 P, | ④ | 거리차식 AB²−AD²=4r+8=12x+36; AC²−AD²=2r+3=−6x+9; x=−2/3,r=5. | solutionImage:q21-solution.svg, image:q21.png | KEEP_MATH |
| 22 | [서술형1] 아래 표에서 가로줄과 세로줄에 있는 세 수가 각각 화살표 방향의 순서대로 모두 등차수열을 이룰 때, $a$, $b$, $c$, $d$의 값을 각각 구하시오. | $a=3,\ b=7,\ c=9,\ d=1$ | 3×3 등차표: 중열 5,c,13→c=9; 하행 d,13,25→d=1; 첫열 a,2,1→a=3, 첫행→b=7. | image:q22.png | KEEP_MATH |
| 23 | [서술형2] 삼각형 ABC에서 $b=8$, $c=4$, $A=60^\circ$일 때, $a$, $B$, $C$를 각각 구하시오. | $a=4\sqrt3,\ B=90^\circ,\ C=30^\circ$ | a²=8²+4²−2·8·4·cos60°=48, cosB=0→a=4√3,B=90°,C=30°. | 없음 | KEEP_MATH |
| 24 | [서술형3] 수열 $\{a_n\}$이 모든 자연수 $n$에 대하여 $\sum_{k=1}^{n}\dfrac{1}{(2k-1)a_k}=n^2+2n$을 만족시킬 때, 일반항 $a_n$을 구하시오. | $a_n=\dfrac{1}{(2n-1)(2n+1)}$ | S1=3→a1=1/3, n≥2 차분 1/[(2n−1)an]=2n+1→an=1/[(2n−1)(2n+1)] (n=1도 성립). | 없음 | KEEP_MATH |
| 25 | [서술형4] 자연수 $n$에 대하여 $x$에 대한 이차부등식 $x^2-nx<0$을 만족시키는 모든 자연수 $x$의 값의 합을 $S_n$이라 할 때, $\sum_{k=1}^{10}S_k$의 값을 구하시오. | 165 | 정수 0<x<n의 합 S_n=n(n−1)/2; Σk=1..10 S_k=(385−55)/2=165. | 없음 | KEEP_MATH |

## 이미지별 렌더·육안 검수 대장 (11/11)

| # | Q | 필드 | 원본 파일 | Git blob SHA | 재현 방법 | 판정/예약 |
|---:|---:|---|---|---|---|---|
| 01 | 05 | `solutionImage` | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q5-solution.svg` | `6fdd8d6a06bcb395fcbb8cf15e11b51b82603b2b` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 02 | 06 | `solutionImage` | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q6-solution.svg` | `523152874ff991661dc09ebceea40022c09c141f` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 03 | 06 | `image` | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q6.png` | `6e4643e6e48d542ed87674fb8888ce5ec39a3935` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 04 | 07 | `solutionImage` | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q7-solution.svg` | `383994f60fa410413661192fdd0fd1fb871fc57a` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 05 | 07 | `image` | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q7.png` | `78b8c21b177c045f7dc18717239492ac9828ffa8` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 06 | 17 | `solutionImage` | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q17-solution.svg` | `d0b73bfdbcc8cf5a1154d86abe3e5c64597e8680` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 07 | 17 | `image` | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q17.png` | `35487b12af4254750ef7e86d416805ffc11f0055` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 08 | 19 | `image` | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q19.png` | `c58812da4b5ee52a5a7907fc76ad8e50e3996313` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 09 | 21 | `solutionImage` | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q21-solution.svg` | `03d296f32e1dcfe656c6345e06c9521d139d42ad` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 10 | 21 | `image` | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q21.png` | `04e732cbfac103582e0da70c20f6a2c5eb0850d6` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 11 | 22 | `image` | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q22.png` | `bc076f0a7bf3ea32162f517c41e76b88968f2a8b` | PNG decode(Pillow) | OBSERVED_NO_FLAG |

## 엔진 인계 예약 및 출고 차단

- 금번 원본 이미지 관찰에서 별도 예약으로 지정한 신규 결함 없음. 실제 학생 UI 종합검증 결과를 의미하지 않음.

- **수학 검산과 원본 시각 검수는 서로 다른 판정층**이다. `KEEP_MATH` 문항이라도 `VISUAL_UPGRADE` 원본 교체 예약은 유효하다.
- `HOLD_VISUAL_SOURCE`는 그림에서 값을 독립 재현할 수 없는 문항으로, 깨끗한 원출처/재스캔 또는 판독 가능한 본문 근거가 마련되어야 해제한다.
- 엔진 담당: 원본을 수정하기 전에 관련 시험지의 예약을 점검하고, 이미지 변경 시 참조 경로 및 SHA·문항 텍스트 매칭을 다시 확인하라. 이미지를 실제 화면에 렌더해 도형·레이블·선택지 중복을 관찰하고, 수학 해설 교차검산과 CI 회귀를 별도로 수행하라.

## 이번 배치 누적 인계

- 본 회차 **5개 학교/시험지, 115문항, 이미지 57개(PNG 23·SVG 34)** 모두 문서로 기록.
- 전체 대수 85개 시험지 중 **61개 문서화(기존 56개 + 이번 5개)**, **1,359/1,903문항(기존 1,244문항 + 115문항)**.
- 미완료 **24개 시험지/544문항**(일반 기말 22개 498문항 + C 계열 2개 46문항), 시점 기준 계획 수량.
- 이번 회차 해설 검산: **KEEP_MATH 114 / HOLD_VISUAL_SOURCE 1**; **이미지 예약 3건(재크롭 2, 원본 판독 보류 1)**. 다른 회차 결과와 중복 집계하지 말 것.
- 작업 범위는 MD 기록 및 인계에 한정되며, 배포 가능 판정은 별도 운영 기준 충족 이후에만 내린다.
