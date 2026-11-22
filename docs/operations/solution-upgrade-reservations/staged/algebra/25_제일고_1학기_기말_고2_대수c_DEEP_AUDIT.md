# 25_제일고_1학기_기말_고2_대수c — 해설 DEEP AUDIT 및 이미지 실물 검수 (2026-11-22)

> 문서 전용(engine handoff) 검수. 원본 JS·PNG·SVG 및 학생 UI/엔진을 변경하지 않았다. KEEP_MATH는 수학 대조의 판정이며 출고 PASS가 아니다.

## 시험지·검증 결과

- 출제 원본: `archive/exams/original/high/h2/1final/25_제일고_1학기_기말_고2_대수c.js`, Git blob `6ef27f1a536d9f640910953792575975297ecd62`, **23문항**.
- 현재 직참조 **13개(PNG 6 / SVG 7)**. PNG 6개는 **별도 `25_제일고_1학기_기말_고2_수학I` 폴더 참조**. 누락 오판 방지를 위해 교차경로까지 검사.
- 6 PNG 원본 디코드·7 SVG Inkscape PNG 렌더 후 시각 대조. **KEEP_MATH 23 / HOLD_MATH 0**, 저대비/노이즈 원본 도형 **VISUAL_UPGRADE 2(Q09,Q12)**.
- 학생 UI·MathJax 실기기 렌더, ALIVE/preflight, Golden/Negative, CI, 엔진 적용/실배포 **NOT_RUN**.

## 문항별 정답·해설 검산 (23/23)

| Q | 발문 식별 | 현행 답 | 독립 수학 검산 | 이미지 | MD 판정 |
|---:|---|---|---|---|---|
| 01 | $y=2\cos2x$ 주기 | ① | 계수 2에 의해 주기 $2\pi/2=\pi$; 앞의 진폭 계수 무관. | 없음 | KEEP_MATH |
| 02 | $\tan(3x/2)$ 점근선 | ③ | $3x/2=\pi/2+n\pi$이므로 $x=(2n+1)\pi/3$. | q2-solution-v2.svg | KEEP_MATH |
| 03 | 삼각형 사인법칙 | ② | $AC=6\sqrt2,B=45^\circ,A=60^\circ$에서 $2R=12$, $R=6$, $BC=6\sqrt3$; 합 $6+6\sqrt3$. | q3.png, q3-solution.svg | KEEP_MATH |
| 04 | 등차수열 10항 합 | ③ | $a_1=1,a_{10}=25$, 합 $10(1+25)/2=130$. | 없음 | KEEP_MATH |
| 05 | 등비중항 방정식 | ⑤ | $2,x,3x-4$의 등비조건 $x^2=2(3x-4)$; 해 2,4의 합 6. | 없음 | KEEP_MATH |
| 06 | 두 시그마 차 | ③ | $\sum(2a_k+b_k)=38,\sum a_k=7$에서 $\sum b_k=38-14=24$. | 없음 | KEEP_MATH |
| 07 | 제1사분면의 각 변환 | ⑤ | $\sin\theta=1/\sqrt5,\cos\theta=2/\sqrt5$; 주어진 두 분수는 각각 $\cot\theta=2$, 합 4. | 없음 | KEEP_MATH |
| 08 | 변비 3:4:5 삼각형 | ③ | 사인법칙에서 변 $3k,4k,5k$의 직각삼각형, $6k^2=54\Rightarrow k=3$; 둘레 36. | q8-solution.svg | KEEP_MATH |
| 09 | 조각상 사이 코사인법칙 | ⑤ | $AP=4,BP=6,\angle APB=60^\circ$로 $AB^2=16+36-24=28$, $AB=2\sqrt7$m. | q9.png, q9-solution.svg | KEEP_MATH |
| 10 | 코사인함수 그래프의 매개변수 | ④ | 원본 그래프 최대3·최소−1→$a=2$; 마루 간격 $5\pi/2\Rightarrow b=4/5$; 양수 최소 $c=5\pi/8$, 따라서 $abc/\pi=1$. | q10.png | KEEP_MATH |
| 11 | 공차가 0 아닌 등차수열 | ① | $a_3=2a_{15}$에서 $a_1=-26d$; $a_k=3a_{20}$에서 $(k-27)d=-21d$, $k=6$. | 없음 | KEEP_MATH |
| 12 | 정사각형 반복 색칠 넓이 | ② | 색칠 넓이 $a_n=4^{-n}$, 누적 $S_n=(1-4^{-n})/3$. $S_3=21/64$는 같기만 하므로 처음 초과는 $n=4$. | q12.png | KEEP_MATH |
| 13 | 등차 세 항이 등비 | ② | 공차2, $a_3=a_1+4,a_5=a_1+8,a_{11}=a_1+20$; $(a_1+8)^2=(a_1+4)(a_1+20)$에서 $a_1=-2$, $a_{10}=16$. | 없음 | KEEP_MATH |
| 14 | 분수 시그마 망원합 | ② | $k/(k+1)+(k+1)/k=2+1/k-1/(k+1)$; 1~9 합 $18+9/10=189/10$, $a=189$. | 없음 | KEEP_MATH |
| 15 | 두 삼각부등식의 교집합 | ① | $\sin x>\sqrt2/2$는 $(\pi/4,3\pi/4)$, $\cos x<1/2$는 $(\pi/3,5\pi/3)$; 교집합 $(\pi/3,3\pi/4)$로 $ab=1/4$. | q15-solution-v2.svg | KEEP_MATH |
| 16 | $y=\sin(kx/2)$ 네 교점 합 | ④ | 사인 양·음 레벨의 처음 두 해 합은 각각 $T/2,3T/2$, 전체 $2T=8\pi/k$; $\tan(8\pi/k)=\sqrt3$에서 최소 양의 각 $\pi/3$일 때 $k$ 최대 24. | q16.png, q16-solution.svg | KEEP_MATH |
| 17 | 반원의 호 4등분·현 길이 | ② | 호 BC 중심각 $2\pi/3$, 호 CD $\pi/2$, 호 CE $\pi/4$; $CD^2-CE^2=\sqrt2 R^2=9\sqrt2$에서 $R^2=9$, $BC^2=3R^2=27$. | q17.png, q17-solution.svg | KEEP_MATH |
| 18 | 양의 등비 세 수에 관한 보기 | ④ | ㄱ: $a+c\ge2\sqrt{ac}=2b$에서 최솟값 $2b$; ㄴ: 로그는 등차이지 일반적 등비 아님; ㄷ: $(b^5)^2=a^5c^5$ 참. ㄱ·ㄷ. | 없음 | KEEP_MATH |
| 19 | 제곱한 등비수열의 합 | ① | $T_4=160$, $a_1=2$에서 $r^2=3$, $r=-\sqrt3$; $S_4=8-8\sqrt3$, $p/q+r_{\mathrm{radicand}}=-1+3=2$. | 없음 | KEEP_MATH |
| 20 | 절댓값이 있는 수열 점화 | ⑤ | $a_2=9$이며 양수항 절댓값은 이전의 2배, 음수항은 $2/3$배. $a_3a_4>0$ 분기에서 $\lvert a_5\rvert$ 최대72, 최소$8/3$, 비 27. | 없음 | KEEP_MATH |
| 21 | 삼각식의 최대·최소 서술 3부 | (1) $-t^2+t$; (2) $\pi/8,43\pi/24$; (3) $20$ | $t=\sin(2x-\pi/12)$로 $f=-t^2+t$; 최대 $t=1/2$, 최소 $t=-1$의 $0\le x<2\pi$ 해에서 $\beta-\alpha=5\pi/3$, $12(\beta-\alpha)/\pi=20$. | 없음 | KEEP_MATH |
| 22 | 다항식 두 번 나눔 서술 | $2036$ | $P(x)=\sum_{k=0}^{10}x^k$에서 $P(2)=2047$, $P(1)=11$; 몫 $Q(1)=P(2)-P(1)=2036$. | 없음 | KEEP_MATH |
| 23 | $\sum k(n-k+1)$ 계수 | $(a,b)=(1,2)$ 또는 $(2,1)$ | $\sum_{k=1}^n((n+1)k-k^2)=n(n+1)(n+2)/6$로 두 계수는 1과 2, 순서 교환 허용. | 없음 | KEEP_MATH |

## 현행 참조 이미지 13개 원본·SVG 렌더 실물 검수

경로 약어: `A/` = `archive/assets/images/25_제일고_1학기_기말_고2_수학I/`, `B/` = `archive/assets/images/25_제일고_1학기_기말_고2_대수c/`. 파일명만 보고 `대수c` 안에 PNG가 없다고 결함 처리해서는 안 됨.

| Q | 실제 원본 경로 | Git blob SHA | 원본 디코드·Inkscape 렌더 관찰 |
|---:|---|---|---|
| 02 | `B/q2-solution-v2.svg` | `7edab45d23ee3341dbc0d2d8f24c31027dccd815` | 탄젠트 주기 $2\pi/3$, 수직 점근선·원점 확인. KEEP_VISUAL. |
| 03 | `A/q3.png` | `ab42b7569a3aaf65f64ccd3d966c478e73ef99b7` | 삼각형 $AC=6\sqrt2$, A60°·B45°, R과 a 위치 판독. KEEP_VISUAL. |
| 03 | `B/q3-solution.svg` | `17df6824d47a4543db4b8378e219169dba61204d` | 동일 점 A/B/C와 AC 길이·두 각 표시. KEEP_VISUAL. |
| 08 | `B/q8-solution.svg` | `cdbc0701397da06837a1ecb4e1e38b4fe9201a15` | 직각 3k·4k·5k 및 면적 54 표시. KEEP_VISUAL. |
| 09 | `A/q9.png` | `7c33b4b0c4f2ac4f09cda5fa3ad8a4eced433ed9` | AP4m·BP6m·60°는 식별. **VISUAL_UPGRADE:** 조각상 풍경의 회색 배경 노이즈와 흐린 글자; 삼각형 핵심선만 재작도 예약. |
| 09 | `B/q9-solution.svg` | `a79fdfec1b4acd1224a18e3cd42e9e8fff1874f3` | P에서 A/B를 잇는 4·6 길이와 60° 각 표시. KEEP_VISUAL. |
| 10 | `A/q10.png` | `c968d425931a0a75385b35d5cdaafe36ce283a84` | 최소 −1·최대3, 마루 $5\pi/8,25\pi/8$, 골 $15\pi/8$ 실제 그래프에서 판독. KEEP_VISUAL. |
| 12 | `A/q12.png` | `99196561f38a7939566456d64e7f0dbe45c1fa8e` | 사각형 4등분·우하단 반복 색칠 순서 확인. **VISUAL_UPGRADE:** 마지막 미세 격자·점선이 저해상도 스캔에서 약해 반복 패턴 시인성 개선 예약. |
| 15 | `B/q15-solution-v2.svg` | `8329ccd68c6401c144e13703e576e137449af562` | 두 열린구간 $(1/4,3/4)$·$(1/3,5/3)$의 공통영역 시각화. KEEP_VISUAL. |
| 16 | `A/q16.png` | `542c266f4d99c5ca6cf5ba86e4837b15882e2bea` | $y=\pm a$와 4개 교점 $\alpha,\beta,\gamma,\delta$ 및 사인 그래프 확인. KEEP_VISUAL. |
| 16 | `B/q16-solution.svg` | `3a1690db387fc4dd7c728f53295657e3995b5e90` | $t$축과 두 기준선 및 사인 한 주기의 대칭 확인. KEEP_VISUAL. |
| 17 | `A/q17.png` | `87addcdb35554cc946325a5d12d67b8f01102934` | 반원 호 BC의 D/E 분할, C에서 이어진 현들 확인. KEEP_VISUAL. |
| 17 | `B/q17-solution.svg` | `94abdb35b8853747d6f627ff9088c5a7f2eefb63` | 반원 대칭 방향만 다르고 A/B/C/D/E 상대 호 순서·60° 일치. KEEP_VISUAL. |

## 엔진 인계

1. **23/23 KEEP_MATH**, 확정 수학 HOLD 없음. 특히 Q10은 교차 참조된 실제 원본 그래프의 마루 좌표·최솟값과 해설을 함께 확인했다.
2. 이미지 개선 예약 **Q09(스캔 노이즈), Q12(작은 격자 가독성)** 2건. 출제 의도·기존 수치 보존하는 새 벡터 그림의 별도 QA를 권장.
3. `수학I` 하위의 직참조 PNG 6개를 실제 참조 경로로 보존; 원본 JS·SVG/PNG·엔진 및 출고 변경은 수행하지 않음. UI·CI **NOT_RUN**.
