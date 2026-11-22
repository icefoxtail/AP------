# lane20 확통 1학기 중간 기출 딥 감사 — 22_매산고_1학기_중간_고2_확률과통계.js

- **sourcePath**: `archive/exams/original/high/h2/1mid/22_매산고_1학기_중간_고2_확률과통계.js`
- **sourceRef / blob SHA**: `main` / `5424109db02f11f788078db25e0bfcbe204f0e48`
- **라인·범위**: lane20 / 확률과 통계(`probstat`) / 고2 / **1학기 중간 기출**. 1학기 기말은 후속, 2학기 확통은 별도 라인 전담.
- **원본 과목 검증**: 전 문항 `standardCourse=확률과 통계`; 시험지 경로·학교·학년·학기·중간·실제 문항 대조.
- **문항 총수·실제 읽음**: 22 / 22. **KEEP 22 · UPGRADE 0 · HOLD 0 · UNREAD 0**.
- **원본 이미지**: 확인된 자산 3개(PNG 3, SVG 0)를 GitHub `main`에서 취득. 모든 PNG는 직접 시각 판독했고 모든 SVG는 PNG로 렌더하여 눈으로 검토.
- **작업 브랜치**: `work/solution-upgrade-lane-20-20261121` / `docs/operations/solution-upgrade-reservations/staged/probstat/22_매산고_1학기_중간_고2_확률과통계_DEEP_AUDIT.md`
- **수준 경계**: EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE / AUDIT_DRAFT_COMPLETE. 이는 원본 문항별 딥 감사·개선 풀이 초안 완료만 뜻한다. 전체 core 직접 열람 read-receipt·preflight·Golden/Negative·원본 PDF 페이지 대조·학생 화면 회귀는 **NOT_RUN / EVIDENCE_DEBT**. JS/SVG/main 배포 변경 없음, 출고 PASS 아님.

## Q01 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 1 / 1 / `NOT_PRESENT` / `qid_v1_be54c6c4fe511a1af17c334e1ce4b43f72ac1af5e7ad7fdd873443bc73bfa9b7`
- **category / answer**: 순열과 조합 / `②` (보기: 2 | 3 | 6 | 8 | 9)
- **문제 실제 조건**: 다음 다섯 개의 문자 $a, a, b, c, c$를 일렬로 배열할 때, 양 끝에 모음이 오는 경우의 수는?
- **기존 solution 실제 발췌**: > 모음은 a뿐이므로 양 끝에는 a를 하나씩 놓아야 한다. 가운데 세 자리는 b,c,c의 배열이므로 경우의 수는 3!/2!=3이다. 따라서 정답은 ②이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 양 끝 모음 a,a 고정, 가운데 b·c·c의 3!/2!=3; ②.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q02 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 2 / 2 / `NOT_PRESENT` / `qid_v1_bce72ae6633ab46c41292c5182cef4ad767a7a6bd82b4e6ba303eb3989dc1b1c`
- **category / answer**: 순열과 조합 / `①` (보기: 210 | 105 | 450 | 630 | 360)
- **문제 실제 조건**: 오른쪽 그림과 같이 정사각형을 4등분 한 4개의 영역을 서로 다른 7가지 색 중에서 4가지 색을 택하여 칠하는 경우의 수는? (단, 각 영역에는 한 가지 색만 칠하고, 회전하여 일치하는 것은 같은 것으로 본다.) / [그림 자산: `assets/images/22_매산고_1학기_중간_고2_확률과통계/q02.png`]
- **기존 solution 실제 발췌**: > 7가지 중 사용할 4가지 색을 고르는 방법은 C(7,4)=35이다. 서로 다른 네 색을 네 영역에 놓는 배열은 4!가지이고, 네 번의 회전은 각 배열을 서로 다른 배열로 보내므로 같은 칠하기의 수는 35×4!/4=210이다. 따라서 정답은 ①이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 7색 중 4색 C7,4와 2×2 네 칸 회전동치4, 색 모두 다름 ⇒C7,4·4!/4=210; 그림 2×2 확인; ①.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q03 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 3 / 3 / `NOT_PRESENT` / `qid_v1_fc4e1de800680accb7ad5b0b9cd07a6a259f9a312e74496833129da1c916fcde`
- **category / answer**: 순열과 조합 / `②` (보기: 124 | 144 | 160 | 172 | 196)
- **문제 실제 조건**: 남학생 4명과 여학생 4명이 원탁에 둘러앉을 때, 남학생과 여학생이 교대로 앉는 경우의 수는?
- **기존 solution 실제 발췌**: > 원탁의 회전만 같은 것으로 보므로 남학생 네 명을 먼저 원순열로 앉히는 방법은 (4-1)!=3!가지이다. 남학생 사이 네 자리에 여학생 네 명을 배열하는 방법은 4!가지이므로 3!×4!=144이다. 따라서 정답은 ②이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 남학생 4명 원순열3! 배치, 사이 네 틈에 여학생4! ⇒144; ②.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q04 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 4 / 4 / `NOT_PRESENT` / `qid_v1_630f50cb68f20bd4b1102fddc1d2c1cb3881e8d405aa5af7b39bf9699cf015e5`
- **category / answer**: 순열과 조합 / `③` (보기: 10 | 11 | 15 | 36 | 45)
- **문제 실제 조건**: 방정식 $x+y+z=7$에 대하여 양의 정수해의 개수는?
- **기존 solution 실제 발췌**: > x,y,z가 양의 정수이므로 x'=x-1, y'=y-1, z'=z-1로 두면 x'+y'+z'=4인 음이 아닌 정수해의 수와 같다. 별과 막대의 원리에 따라 C(4+3-1,3-1)=C(6,2)=15이다. 따라서 정답은 ③이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 양의 x+y+z=7, 1씩 빼 비음수 합4의 C6,2=15; ③.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q05 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 5 / 5 / `NOT_PRESENT` / `qid_v1_c5e4592a8c23535ebc483257ea29fffeb680b5f8da16e2ffa8c48170d4362046`
- **category / answer**: 이항정리 / `⑤` (보기: -144 | -160 | 144 | 210 | 216)
- **문제 실제 조건**: $(2x^2-3x)^4$의 전개식에서 $x^6$의 계수는?
- **기존 solution 실제 발췌**: > 네 인수 중 2x^2를 두 번, -3x를 두 번 선택해야 x의 차수가 2·2+2·1=6이 된다. 그 계수는 C(4,2)·2^2·(-3)^2=6·4·9=216이다. 따라서 정답은 ⑤이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: (2x²−3x)^4에서 x² 두 번, x 두 번 선택 C4,2·2²·(−3)²=216; ⑤.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q06 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 6 / 6 / `NOT_PRESENT` / `qid_v1_245313426918afbc58613a44b68c21c56fc61578696af44ddb62dd68c7b0640c`
- **category / answer**: 순열과 조합 / `④` (보기: 80 | 100 | 110 | 120 | 240)
- **문제 실제 조건**: 3개의 숫자 1, 2, 3과 3개의 문자 $a, b, c$를 일렬로 나열할 때, $c12ab3$, $1ab23c$와 같이 숫자는 크기가 작은 것부터 순서대로 나열하는 경우의 수는?
- **기존 solution 실제 발췌**: > 숫자 1,2,3의 상대적 순서는 고정되어 있으므로 여섯 자리 중 숫자가 놓일 세 자리를 고르는 방법은 C(6,3)가지이다. 나머지 세 자리에 a,b,c를 배열하는 방법은 3!가지이다. 따라서 C(6,3)·3!=20·6=120이고 정답은 ④이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 숫자 1·2·3 상대순서 고정, 숫자 자리 C6,3, 문자 a·b·c 배치3! ⇒120; ④.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q07 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 7 / 7 / `NOT_PRESENT` / `qid_v1_8125d00a3f37afb012dad3c886cb3302ea7a4111e50cb2b94ea69adfd7768ff6`
- **category / answer**: 확률의 뜻과 활용 / `⑤` (보기: $\frac{1}{2}$ | $\frac{1}{6}$ | $\frac{10}{30}$ | $\frac{8}{30}$ | $\frac{3}{5}$)
- **문제 실제 조건**: 인원이 30명인 어느 학급에서 학생들의 혈액형을 조사하였더니 다음 표와 같았다. 이 학급의 학생 중에서 임의로 한 명을 뽑을 때, 혈액형이 $A$형 또는 $B$형일 확률은? / 혈액형 A형 B형 AB형 O형 / 학생수 10 8 5 7 /
- **기존 solution 실제 발췌**: > A형 또는 B형 학생은 10+8=18명이고 전체는 30명이다. 따라서 확률은 $\frac{18}{30}$=$\frac{3}{5}$이며 정답은 ⑤이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: A형·B형 학생은 10+8=18명, 전체30 ⇒3/5; ⑤.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q08 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 8 / 8 / `NOT_PRESENT` / `qid_v1_ca20970fc7f4f2ef09964dc5916c09baf14005e63784cc6c2199e2bf93704bce`
- **category / answer**: 순열과 조합 / `②` (보기: 60 | 66 | 126 | 186 | 286)
- **문제 실제 조건**: 다음 그림과 같은 도로망이 있다. 지점 P에서 지점 Q까지 가는 최단 경로의 수를 구하면? / [그림 자산: `assets/images/22_매산고_1학기_중간_고2_확률과통계/q08.png`]
- **기존 solution 실제 발췌**: > 각 교차점에 P에서 그 점까지 가는 최단 경로의 수를 적는다. 어떤 점에 도착하는 경로는 바로 왼쪽 점에서 오는 경우와 바로 아래 점에서 오는 경우의 합이다. 도로가 없는 구간에서는 그 방향의 경로를 더하지 않고, P에는 1을 적는다. 아래 행부터 위 행까지 누적하면 다음과 같다. $$\begin{array}{c|rrrrrr}y&0&1&2&3&4&5\\\hline4&1&5&15&25&40&66\\3&1&4&10&10&15&26\\2&1&3&6&0&5&11\\1&1&2&3&4&5&6\\0&1&1&1&1&1&1\end{array}$$ 따라서 Q까지 가는 최단 경로는 66개이고, 정답은 ②이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 5R·4U 도로망의 가운데 일부 도로 끊김을 원본 그림에서 확인. 교차점 누적표 최상단 Q=66; 통상 C9,4 대신 결손 간선을 제외한 DP로 66; ②.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q09 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 9 / 9 / `NOT_PRESENT` / `qid_v1_d3c30a10c8a468b2efb0ddd8a847636f647d4848d07b6d0e58ece891c55d0f07`
- **category / answer**: 순열과 조합 / `①` (보기: 240 | 360 | 480 | 540 | 720)
- **문제 실제 조건**: 오른쪽 그림과 같이 6명의 학생을 정삼각형 모양의 탁자에 앉히는 방법의 수는? / [그림 자산: `assets/images/22_매산고_1학기_중간_고2_확률과통계/q09.png`]
- **기존 solution 실제 발췌**: > 정삼각형 모양의 탁자에서는 회전하여 같은 배치만 같은 것으로 본다. 여섯 학생을 여섯 자리의 서로 다른 배열로 놓는 6!가지 중 정삼각형의 세 회전이 같은 배치를 나타내므로 6!/3=240이다. 따라서 정답은 ①이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 정삼각형 각 변 두 자리 도형의 회전군3, 사람6! 배치를 3으로 나눠240; ①.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q10 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 10 / 10 / `NOT_PRESENT` / `qid_v1_5e871bbf2fcda9b035e6a20199a6dca094fbf6e378db40e28e812a84540be7a3`
- **category / answer**: 확률의 뜻과 활용 / `③` (보기: ㄱ | ㄴ | ㄱ, ㄴ | ㄱ, ㄷ, ㄹ | ㄱ, ㄴ, ㄷ, ㄹ)
- **문제 실제 조건**: 표본공간을 $S$, 절대로 일어나지 않을 사건을 $\varnothing$이라 할 때, 임의의 두 사건 $A, B$에 대하여 옳은 것만을 보기에서 있는 대로 고른 것은? / ㄱ. $0 \le P(A) \le 1$ / ㄴ. $P(S) + P(\varnothing) = 1$ / ㄷ. $1 \le P(A) + P(B) \le 2$ / ㄹ. $A \cup B = S$ 이면, $P(A) + P(B) = 0$ /
- **기존 solution 실제 발췌**: > ㄱ은 확률의 범위이므로 참이다. ㄴ은 P(S)=1, P(∅)=0이므로 참이다. ㄷ은 두 사건이 모두 공집합일 수 있으므로 합이 1 이상이라는 주장은 거짓이다. ㄹ은 A∪B=S일 때 합이 0이 아니라 적어도 1이므로 거짓이다. 따라서 ㄱ, ㄴ만 옳아 정답은 ③이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: ㄱ P(A)∈[0,1], ㄴ 1+0=1 참; ㄷ 하한 거짓, ㄹ 합집합 S면 P(A)+P(B)≥1이므로 거짓 ⇒ㄱ·ㄴ,③.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q11 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 11 / 11 / `NOT_PRESENT` / `qid_v1_29b81ce5dadd6b43feeaf2d309013610dfa53636e4f541bac772f2622ebb360b`
- **category / answer**: 순열과 조합 / `①` (보기: 194 | 185 | 256 | 625 | 720)
- **문제 실제 조건**: 5개의 숫자 2, 3, 5, 7, 9 중에서 중복을 허용하여 네 자리 자연수를 만들 때, 숫자 2와 숫자 3을 반드시 포함하는 것의 개수는?
- **기존 solution 실제 발췌**: > 전체 네 자리 수열 5^4개에서 2가 없는 수열 4^4개와 3이 없는 수열 4^4개를 빼고, 둘 다 없는 수열 3^4개를 더한다. 포함배제 원리에 따라 5^4-2·4^4+3^4=625-512+81=194이다. 따라서 정답은 ①이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 5종 4자리 수열 중 숫자 2·3 둘 다 포함 포함배제 5⁴−2·4⁴+3⁴=194; ①.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q12 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 12 / 12 / `NOT_PRESENT` / `qid_v1_349ca8b825fbca346200712b6e1853328cdc7e07cd0e43c6b811c18f7ff30314`
- **category / answer**: 이항정리 / `④` (보기: 1 | 2 | $\frac{\sqrt{2}}{2}$ | $\sqrt{2}$ | $\sqrt{3}$)
- **문제 실제 조건**: $(x-a)^5$의 전개식에서 $x$의 계수와 $x^3$의 계수가 서로 같을 때, 양수 $a$의 값은?
- **기존 solution 실제 발췌**: > (x-a)^5에서 x의 계수는 C(5,1)(-a)^4=5a^4이고, x^3의 계수는 C(5,3)(-a)^2=10a^2이다. 두 계수가 같고 a>0이므로 5a^4=10a^2에서 a^2=2, a=√2이다. 따라서 정답은 ④이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: x 계수5a⁴, x³ 계수10a², 양수 a에서 a²=2⇒√2; ④.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q13 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 13 / 13 / `NOT_PRESENT` / `qid_v1_7689f24b394e304f5171f868cfac1f7914a422431b524b9df7029b6c6264ce84`
- **category / answer**: 순열과 조합 / `④` (보기: 10 | 11 | 24 | 33 | 48)
- **문제 실제 조건**: 세 문자 $a, b, c$ 중에서 중복을 허락하여 4개를 택해 일렬로 나열할 때, 문자 $a$가 두 번 이상 나오는 경우의 수는?
- **기존 solution 실제 발췌**: > 전체 배열은 3^4=81가지이다. a가 나오지 않는 배열은 2^4=16가지이고, a가 한 번만 나오는 배열은 그 자리를 고르는 4가지와 나머지 자리에 b,c를 놓는 2^3가지를 곱한 32가지이다. 따라서 a가 두 번 이상 나오는 경우는 81-16-32=33가지이고 정답은 ④이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 전체 3⁴에서 a 미사용 2⁴와 a 정확히1회 4·2³을 빼81−16−32=33; ④.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q14 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 14 / 14 / `NOT_PRESENT` / `qid_v1_3cf4d6c76ea9483105801c0beec9f6f7cf294bb19c45c1568d443a453630d159`
- **category / answer**: 이항정리 / `⑤` (보기: 15 | 18 | 60 | 81 | 90)
- **문제 실제 조건**: 자연수 $N$에 대하여 / $$N = 9^2 \times {}_{10}\mathrm{C}_1 + 9^3 \times {}_{10}\mathrm{C}_2 + 9^4 \times {}_{10}\mathrm{C}_3 + \dots + 9^{11} \times {}_{10}\mathrm{C}_{10}$$ / 일 때, $N$의 각 자리의 숫자의 합을 구하면?
- **기존 solution 실제 발췌**: > N=Σ(k=1..10) C(10,k)9^(k+1)=9Σ(k=1..10)C(10,k)9^k=9((1+9)^10-1)=89,999,999,991이다. 각 자리 숫자의 합은 8+9×9+1=90이다. 따라서 정답은 ⑤이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: ∑k=1..10 C10,k·9^(k+1)=9((1+9)^10−1)=89,999,999,991, 각 자리 합8+9·9+1=90; ⑤.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q15 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 15 / 15 / `NOT_PRESENT` / `qid_v1_c97c3f9f2b2f0cba9cc2f4eb26f54b148ed5f8bb4c51774d0537411023d430eb`
- **category / answer**: 이항정리 / `①` (보기: $\frac{1}{2}\left(1 - \frac{1}{3^{15}}\right)$ | $\frac{1}{2}\left(1 - \frac{1}{3^{16}}\right)$ | $1 - \frac{1}{3^{15}}$ | $1 - \frac{1}{3^{16}}$ | $2 - \frac{1}{3^{15}}$)
- **문제 실제 조건**: $x = 0, 1, 2, \dots, 15$에 대하여 $f(x) = {}_{15}\mathrm{C}_x \left(\frac{1}{3}\right)^{15-x} \left(\frac{2}{3}\right)^x$이라 할 때, $f(0) + f(2) + f(4) + \dots + f(14)$의 값은?
- **기존 solution 실제 발췌**: > p=2/3, q=1/3으로 두면 주어진 합은 이항정리의 짝수 항의 합이다. 짝수 항의 합은 ((p+q)^15+(q-p)^15)/2이므로 (1+(-1/3)^15)/2=1/2(1-1/3^15)이다. 따라서 정답은 ①이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 이항분포 짝수 x 합 (1+(1/3−2/3)^15)/2=(1−1/3^15)/2; ①.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q16 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 16 / 16 / `NOT_PRESENT` / `qid_v1_f0f76c2ab951583422fac88f4bf0b38aa58cca24225579efab8e9049f3352e3d`
- **category / answer**: 확률의 뜻과 활용 / `②` (보기: 0.2 | 0.3 | 0.6 | 0.7 | 0.8)
- **문제 실제 조건**: 두 사건 $A, B$에 대하여 / $$P(A^c \cap B) = 0.1,\quad P(A^c \cup B^c) = 0.8,\quad P(A) = 0.5$$ / 일 때, $P(B)$는?
- **기존 solution 실제 발췌**: > 드모르간 법칙으로 P(A^c∪B^c)=1-P(A∩B)=0.8이므로 P(A∩B)=0.2이다. 또한 A^c∩B는 B에서 A와 겹치는 부분을 제외한 것이므로 P(B)-P(A∩B)=0.1이다. 따라서 P(B)=0.3이고 정답은 ②이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 여집합 합 P(Aᶜ∪Bᶜ)=0.8⇒P(A∩B)=0.2; B의 A밖 0.1 더해 P(B)=0.3; ②.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q17 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 17 / 17 / `NOT_PRESENT` / `qid_v1_5b072ec2418a72452f1edcb54b874a69b3eb48eb523174db108204f97b851f8a`
- **category / answer**: 확률의 뜻과 활용 / `②` (보기: $\frac{5}{9}$ | $\frac{4}{9}$ | $\frac{3}{4}$ | $\frac{2}{3}$ | $\frac{1}{2}$)
- **문제 실제 조건**: 한 개의 주사위를 두 번 던져서 첫 번째 나온 눈의 수를 $a$, 두 번째 나온 눈의 수를 $b$라 할 때, 방정식 / $$x^2 - (a+b)x + ab + 1 = 0$$ / 의 근이 존재하지 않을 확률은?
- **기존 solution 실제 발췌**: > 판별식은 D=(a+b)^2-4(ab+1)=(a-b)^2-4이다. 실근이 없으려면 D<0, 즉 |a-b|<2이어야 한다. 순서쌍 36개 중 a=b인 6개와 |a-b|=1인 10개, 합 16개가 조건을 만족한다. 확률은 $\frac{16}{36}$=$\frac{4}{9}$이므로 정답은 ②이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 판별식 D=(a−b)²−4<0 ⇔차 0 또는±1, 6+10=16쌍/36=4/9; ②.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q18 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 18 / 18 / `NOT_PRESENT` / `qid_v1_0c35922c59b11036a609a5afbf12633883311115c67a0145dfff1955d9c30c83`
- **category / answer**: 순열과 조합 / `24; 4; 20`
- **문제 실제 조건**: 집합 $X=\{1, 2, 3\}$에서 집합 $Y=\{1, 2, 3, 4\}$로의 함수 $f$ 중에서 다음 조건을 만족시키는 함수의 개수를 구하시오. / (1) $x_1 \ne x_2$이면 $f(x_1) \ne f(x_2)$의 개수 / (2) $x_1 < x_2$이면 $f(x_1) < f(x_2)$의 개수 / (3) $x_1 < x_2$이면 $f(x_1) \le f(x_2)$의 개수
- **기존 solution 실제 발췌**: > (1) 서로 다른 세 원소의 상은 Y의 서로 다른 세 원소를 순서 있게 고르는 것이므로 4P3=24이다. (2) 엄격히 증가하는 함수는 Y에서 크기 순으로 3개를 고르는 것과 일대일 대응하므로 C(4,3)=4이다. (3) 약하게 증가하는 함수는 1≤f(1)≤f(2)≤f(3)≤4인 중복조합과 같으므로 C(4+3-1,3)=C(6,3)=20이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 서로 다름 f는 P4,3=24, 엄격 증가 C4,3=4, 비감소 H4,3=C6,3=20.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q19 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 19 / 19 / `NOT_PRESENT` / `qid_v1_69aab9d735f7359c3f86abfcd2edfd544a3371646787fb173ffb08456d459053`
- **category / answer**: 순열과 조합 / `56`
- **문제 실제 조건**: ${}_3\mathrm{H}_0 + {}_3\mathrm{H}_1 + {}_3\mathrm{H}_2 + {}_3\mathrm{H}_3 + {}_3\mathrm{H}_4 + {}_3\mathrm{H}_5$의 값을 구하면?
- **기존 solution 실제 발췌**: > {}_3H_k=C(k+2,2)이므로 합은 Σ(k=0..5)C(k+2,2)이다. 하키스틱 항등식으로 이 합은 C(8,3)=56이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 3Hk=C(k+2,2), k0..5 하키스틱 C8,3=56.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q20 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 20 / 20 / `NOT_PRESENT` / `qid_v1_aafb7222458524f4b3fe0ffd0f8cb922847c43a56aed357880849b5b62d2edb5`
- **category / answer**: 확률의 뜻과 활용 / `6`
- **문제 실제 조건**: 표본공간 $S=\{3, 4, 5, 6, 7, 8, 9, 10\}$에 대하여 두 사건 $A, B$가 $A=\{3, 4, 5, 6, 7\}$, $B=\{4, 6, 8, 10\}$일 때, 다음 조건을 만족시키는 사건 $C$의 개수는? / (가) $A$와 $C$는 서로 배반사건이다. / (나) $B$와 $C$는 서로 배반사건이 아니다. /
- **기존 solution 실제 발췌**: > A와 서로 배반이려면 C는 S\\A={8,9,10}의 부분집합이어야 한다. 이 중 B={4,6,8,10}과 서로 배반이 아닌 조건은 C가 8 또는 10을 포함한다는 뜻이다. {8,9,10}의 부분집합 8개에서 8과 10을 모두 포함하지 않는 ∅와 {9} 두 개를 제외하면 6개이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: C⊂{8,9,10}이며 8 또는10 포함; 2³−2=6개.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q21 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 21 / 21 / `NOT_PRESENT` / `qid_v1_f01fe2918900c2414c9bc24dead81a49922f38943abe222a1a93104c1f75c712`
- **category / answer**: 확률의 뜻과 활용 / `8; 6/7`
- **문제 실제 조건**: 세 집합 $X=\{1, 2, 3\}$, $Y=\{1, 2, 3, 4\}$, $Z=\{0, 1\}$에 대하여 조건 (가)를 만족시키는 모든 함수 $f: X \to Y$ 중에서 임의로 하나를 택하고, 조건 (나)를 만족시키는 모든 함수 $g: Y \to Z$ 중에서 임의로 하나를 택하여 합성함수 $g \circ f: X \to Z$를 만드는 과정을 서술하시오. / (가) 정의역 $X$의 두 원소 $x_1, x_2$에 대하여 $x_1 \ne x_2$이면 $f(x_1) \ne f(x_2)$ / (나) 함수 $g$의 치역은 $Z$이다. / (1) 합성함수 $g \circ f$의 개수를 서술하시오. [6.0점] / (2) 합성함수 $g \circ f$의 치역이 $Z$일 확률을 서술하시오. [4.0점]
- **기존 solution 실제 발췌**: > (1) f가 X의 세 원소를 Y의 세 서로 다른 원소에 대응시키므로 g∘f의 값은 선택된 세 점에서의 g의 값이다. 모든 이진 배열 2^3개가 가능하다. 배열이 상수여도 선택되지 않은 Y의 한 점에서 g가 반대 값을 가지면 g는 전사이므로 합성함수는 8개이다. (2) 고정된 f에 대해 전사 g는 모두 14개이다. 선택된 세 점에서 g의 값이 상수인 배열은 2개이며, 이때 남은 한 점은 전사 조건상 반대 값으로 고정된다. 비상수 배열은 6개이고 남은 한 점에 두 값 중 하나를 줄 수 있어 12개이다. 합성함수의 치역이 Z일 확률은 $\frac{12}{14}$=$\frac{6}{7}$이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: 합성함수는 X→{0,1} 2³=8개 모두 가능(남는 Y 한 점으로 g 전사 구현). 고정 f에서 전사 g14 중 선택된 세 점의 g 상수인2개를 제외해12/14=6/7.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## Q22 — KEEP

- **qid / ordinal / sourceQid / questionUid**: 22 / 22 / `NOT_PRESENT` / `qid_v1_e07b2e55c2afbfe4fbc7c6053f706e837696d84be7e38e84f1ecfb41dcced61f`
- **category / answer**: 순열과 조합 / `176`
- **문제 실제 조건**: 세 명의 학생 $A, B, C$에게 서로 다른 종류의 사탕 5개를 다음 규칙에 따라 남김없이 나누어 주는 경우의 수를 서술하시오. (단, 사탕을 받지 못하는 학생이 있을 수 있다.) / (가) 학생 $A$는 적어도 하나의 사탕을 받는다. / (나) 학생 $B$가 받는 사탕의 개수는 2 이하이다. /
- **기존 solution 실제 발췌**: > B가 받는 사탕 수를 k라 하면 k=0,1,2이다. B에게 줄 사탕을 고른 뒤 나머지 5-k개는 각각 A 또는 C에게 준다. A가 하나 이상 받도록 모든 배분 2^(5-k)개 중 전부 C에게 가는 한 가지를 뺀다. 따라서 Σ(k=0..2)C(5,k)(2^(5-k)-1)=31+5·15+10·7=176이다.
- **KEEP/UPGRADE 판정 근거 및 독립 검산**: B 사탕 k=0..2 고르고 나머지 A,C 배분 중 A 비어있는1가지를 제외, 합 C5,k(2^(5−k)−1)=31+75+70=176.
- **현재 상태**: READ_EVIDENCED / QA_NOT_RUN

## 시험지 완료 / 인계

- 문항 22개를 원문·보기·정답·기존 solution과 일대일 대조하여 판정 완료. **KEEP 22, UPGRADE 0, HOLD 0, UNREAD 0**.
- 현재 본 시험지에서 학생용 교체 풀이 대상은 발견되지 않았다. 새 JS 수정·실제 반영 없음.
- PNG 3개·SVG 0개 시각 확인. 외부 정답지/원본 PDF 대조·Golden/Negative·회귀 및 출고는 **NOT_RUN**.
- 이 문서는 학습자 배포 파일이 아닌 심층 감사용 **AUDIT_DRAFT_COMPLETE** 기록이다. 변경 대상은 이 MD 한 개뿐이며 원본 시험지·그림·다른 lane 및 `main`은 수정하지 않는다.
