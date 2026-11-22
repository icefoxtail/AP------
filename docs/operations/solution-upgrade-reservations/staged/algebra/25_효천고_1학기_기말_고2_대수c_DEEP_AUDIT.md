# 25_효천고_1학기_기말_고2_대수c — 해설 DEEP AUDIT 및 이미지 실물 검수 (2026-11-22)

> 문서 전용 엔진 인계. 문제·정답·해설 원본 JS 및 PNG/SVG는 건드리지 않았다. KEEP_MATH는 출고 PASS·학생 화면 검증이 아니다.

## 대상·검수 경계

- 원본: `archive/exams/original/high/h2/1final/25_효천고_1학기_기말_고2_대수c.js`, Git blob `f2bce50dd3cf7009e7c9647c130ce9f9a98a590f`; **23문항**.
- 직접 참조 **12개(PNG 5 / SVG 7)**. PNG 5개는 이 시험지와 다른 `25_효천고_1학기_기말_고2_대수` 폴더에 있음. 이 교차 참조를 빠짐없이 확인.
- 원본 PNG 5개와 Inkscape SVG 렌더 7개를 모두 디코드/화면 관찰했고, **KEEP_MATH 23 / HOLD_MATH 0**. 원본 Q16 스캔의 도형·축 레이블 가독성 **VISUAL_UPGRADE 1**.
- 학생 UI/MathJax, ALIVE/preflight, Golden/Negative, CI, 실제 엔진 적용·배포 **NOT_RUN**.

## 문항별 해설·정답 검산 (23/23)

| Q | 발문 식별 | 정답 | 독립 검산·예외 조건 | 이미지 | MD 판정 |
|---:|---|---|---|---|---|
| 01 | 등차수열 두 항 | ④ | $a_2=-4,a_4=0$에서 $d=2$, $a_6=4$. | 없음 | KEEP_MATH |
| 02 | 등비수열 일반항 | ② | $1,2,4,8,\ldots$의 첫째항 1·공비 2, $a_n=2^{n-1}$. | 없음 | KEEP_MATH |
| 03 | 합 $S_n$에서 $a_1$ | ① | $S_n=3n^2+n-1$이면 $a_1=S_1=3$; 첫 항에 $S_n-S_{n-1}$을 무분별 적용하지 않음. | 없음 | KEEP_MATH |
| 04 | 등차수열 13항 합 | ② | $a_1=1,a_{13}=25$, $S_{13}=13(1+25)/2=169$. | 없음 | KEEP_MATH |
| 05 | 두 변·끼인각 삼각형 넓이 | ⑤ | $AB=4,AC=5,\angle A=45^\circ$에서 넓이 $4\cdot5\sin45^\circ/2=5\sqrt2$. | q5.png, q5-solution.svg | KEEP_MATH |
| 06 | 시그마 성질 오답 찾기 | ③ | $\sum a_kb_k$를 $(\sum a_k)(\sum b_k)$로 분리하는 성질은 성립하지 않음. | 없음 | KEEP_MATH |
| 07 | 등차수열 합과 제9항 | ① | $S_n=pn^2+3n$, 공차 2로 $p=1$; $a_n=2n+2$, $a_9=20$. | 없음 | KEEP_MATH |
| 08 | 제곱합 시작 인덱스 | ② | $\sum_{k=4}^{10}k^2=385-(1+4+9)=371$. | 없음 | KEEP_MATH |
| 09 | 지름이 있는 원의 이중각 | ⑤ | $AB=10,AP=8$, 직각삼각형에서 $\cos\theta=4/5$, $\cos2\theta=2(4/5)^2-1=7/25$. | q9.png, q9-solution.svg | KEEP_MATH |
| 10 | 이웃항 곱 점화식 | ② | $a_{n-1}a_{n+1}=a_na_{n+2}$ 및 초항 $1,3,9$로 주기 $1,3,9,3$; 24항 합 $6(1+3+9+3)=96$. | 없음 | KEEP_MATH |
| 11 | 음의 첫항 등비수열 | ③ | $a_3a_5=8a_8$, 절댓값 식과 $a_1<0$을 합쳐 $r=-1/2$, $a_1=-4$, $a_2=2$. | 없음 | KEEP_MATH |
| 12 | 자연수 이어쓰기 자리수 | ⑤ | 1~9는 한 자리, 10은 두 자리; 해당 $b_n$의 첫 10항 합 55. | 없음 | KEEP_MATH |
| 13 | 귀납법 부등식의 빈칸 | ④ | $1+1/2^2+\cdots+1/n^2<2-1/n$에서 다음 단계 차분은 $-1/[k(k+1)^2]$ 방향. | 없음 | KEEP_MATH |
| 14 | 원에 내접하는 사각형 넓이 | ④ | 변 $AB=BC=2,CD=3,DA=4$와 대각 보각으로 $\cos B=-17/32$, $\sin B=7\sqrt{15}/32$; 전체 넓이 $7\sqrt{15}/4$. | q14-solution.svg | KEEP_MATH |
| 15 | 등차수열 합 조건의 $m$ | ① | 공차 3 및 $\sum a_{k+1}=253$, $\sum(a_k+m)=341$에서 $m^2-3m-88=(m-11)(m+8)=0$, 자연수 $m=11$. | 없음 | KEEP_MATH |
| 16 | 수선·등차·등비 비율의 기울기 | ② | $AO,3OC,EA$의 등차 조건과 도형 속 직각삼각형의 닮음·등비 길이를 결합해 $BC$ 기울기 $-1/\sqrt6$. | q16.png, q16-solution.svg | KEEP_MATH |
| 17 | 등차수열 역수 곱 망원합 | ① | $d>0,a_6+a_8=0$에서 $a_7=0$; $\sum_{k=1}^5 1/(a_ka_{k+1})=5/54$로 $d=3$, $a_n=3n-21$. | 없음 | KEEP_MATH |
| 18 | 원주각과 넓이비 복합 도형 | ① | 각의 이등분선과 $BD=R=\sqrt3$으로 $\angle A=60^\circ,BC=3$; 넓이비 4에서 $t=b^2$의 방정식 $t^2-15t+48=0$, $BE=3-t/4$; 두 해의 $BE$ 곱 $3/4$. | q18.png, q18-solution.svg | KEEP_MATH |
| 19 | 분기 수열 $a_{12}-a_{15}$ | ④ | $1<a_1<2$ 및 $a_{12}-a_{15}=6$으로 분기·주기 계산; $a_3=2$, $a_1=3/2,a_2=4$. | 없음 | KEEP_MATH |
| 20 | 등비수열의 일반항 서술 | $a_n=2^n$ | $S_2=6,S_4=30$으로 공비 2·첫항 2를 정하고 일반항 $2^n$. | 없음 | KEEP_MATH |
| 21 | 선분 내분과 외접원 반지름 | $8\sqrt7/7$ | 사인비로 $PQ=1$, 따라서 $BC=6,BQ=4$; $AB=5,AQ=\sqrt{11}$에서 $\cos B=3/4,AC=4$, $R=8\sqrt7/7$. | q21.png, q21-solution.svg | KEEP_MATH |
| 22 | 등차·등비를 동시에 만족하는 세 수 | $a=-1/2,b=1/2$ | 두 순서의 중항 조건을 연립하고 부호·비영 조건으로 $a=-1/2,b=1/2$ 확인. | 없음 | KEEP_MATH |
| 23 | 두 같은 원과 중심각 합 | $14$ | $AB^2=2R^2(1-\cos\theta_1)=4$, $O_1D^2=2R^2(1+\cos\theta_1)=32$에서 $R^2=9$, $2R^2\cos\theta_1=14$. | q23-solution-v2.svg | KEEP_MATH |

## 실제 참조 이미지 렌더 대장 (12/12)

경로 약어: `A/` = `archive/assets/images/25_효천고_1학기_기말_고2_대수/`, `B/` = `archive/assets/images/25_효천고_1학기_기말_고2_대수c/`. **두 폴더 모두 실제 사용**한다. SHA는 현행 Git blob.

| Q | 자산 원본 경로 | blob SHA | 원본 디코드·SVG 렌더 관찰 |
|---:|---|---|---|
| 05 | `A/q5.png` | `0c7df92e572c996810cb2ecedb576bde990f81c9` | AB4·AC5·끼인각 45°를 원본 삼각형에서 판독. KEEP_VISUAL. |
| 05 | `B/q5-solution.svg` | `d94f133c5688def668c8f77ced8df55c4b2608be` | 동일 두 변과 끼인각 보조도형; 원본과 방향 달라도 수치 일치. KEEP_VISUAL. |
| 09 | `A/q9.png` | `58e97b867c629bfb129d45f41c99d1d77b32eb99` | 지름 10, $AP=8$, $P$의 직각 위치 확인. KEEP_VISUAL. |
| 09 | `B/q9-solution.svg` | `d2e1d9d0d305354f2d68095275951648bb57a14d` | 원 안 직각삼각형과 우측에 별도 확대한 AP=8 선분; 점을 점선으로 연결해 의미 구분됨. KEEP_VISUAL. |
| 14 | `B/q14-solution.svg` | `24f4ced38a3df6855238d105e5aa448d4fb63ce8` | 원 내접 사각형·B,D 보각, 두 삼각형 변 2·3·4 표기 확인. KEEP_VISUAL. |
| 16 | `A/q16.png` | `e11014c69395b22ffbac66f0a9b616999d28b21e` | 축 위 A/O/B와 C가 한 구역에 밀집. **VISUAL_UPGRADE:** 원본 스캔에서 점 A·B·원점 O 레이블 겹침 및 흐린 선; 선명한 재도식 예약. |
| 16 | `B/q16-solution.svg` | `e54f6998887245d3ef6a27b459536ead425519e7` | 수선 AB·BC·CD·DE, E/A/O/D 배치와 직각 표시 확인. KEEP_VISUAL. |
| 18 | `A/q18.png` | `f64ea6718ac5a89ac6e3035466c7e53c47d99172` | 원에 내접한 A/B/C/D, AD와 BC 교점 E 확인. KEEP_VISUAL. |
| 18 | `B/q18-solution.svg` | `286c97e2379948d2e94627962b0c7ffc9e5ab1a2` | 원호·현 BD·CE 및 각 30°, 넓이비 보조선 확인. KEEP_VISUAL. |
| 21 | `A/q21.png` | `eb966886dd7d44e7bd7fcd94cf141a278dd76763` | B-P-Q-C 순서, AB5·AQ√11 확인. KEEP_VISUAL. |
| 21 | `B/q21-solution.svg` | `24160b8849981cbd6dbc0eed85f44a85be3d76cd` | 내분 길이 3:1:2와 AB5·AC4, AQ√11를 본문 식과 재대조. KEEP_VISUAL. |
| 23 | `B/q23-solution-v2.svg` | `e9def5028ca6ef37b218756a946c769796f350da` | 두 동일 반지름 원·중심 O1/O2, A/B/C/D 및 길이 $4\sqrt2$ 표시 확인. KEEP_VISUAL. |

## 엔진 인계 결론

1. **23/23 KEEP_MATH**, 확정 수학 HOLD/오답 변경 없음. Q18의 두 해는 실제 변 길이 조건을 만족하는지 학생 풀이 단계에서도 재확인.
2. **Q16 원본 `A/q16.png` 가독성** 개선 예약 1개; 재작도 시 점 A·B·O와 직각 위치의 구분을 최우선으로 한다.
3. 교차 참조 PNG 5개를 `대수c` 하위로 복사·이동하지 말고 현재 경로 기준 엔진 참조를 확인. 실제 원본 변경·UI QA·CI·출고는 **NOT_RUN**.
