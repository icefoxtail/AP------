# 2022 22_금당고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2022`
- source: `archive/exams/original/high/h2/1mid/22_금당고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- standardCourse: `수학I`; `standardCourse` 누락 0/20, `category` 누락 20/20, `questionType` 누락·공란 0/20
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/22_금당고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `20` · actual question/answer/solution read: `20` · KEEP 18 · UPGRADE 2 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 원본 JS에 수록된 20문항의 `content`·`choices`·`answer`·`solution` 전수 감사. UPGRADE는 학생용 완성 풀이, HOLD는 수학적/시각적 출제 결손의 근거와 수정 권고를 기록함. 원본 JS/PNG/SVG/정답키/`main`은 변경하지 않음.

## 작업 기준·검증 경계

기준 문서의 Git blob 식별자(lane30 선행 검토에서 확인한 기준 버전; 본 작업에서 전체 preflight/SHA-256 영수증 재생성은 하지 않음):

- `AGENTS.md` — `61f2bd5223bd6e23dfc358425cf9c28e18f47dd8`
- `docs/operations/solution-upgrade-reservations/HARNESS_CURRENT.md` — `fa258f6ab998c7fd0e2b398956309a43ce967e82`
- `docs/operations/solution-upgrade-reservations/GLOBAL_QUEUE_CURRENT.md` — `259bf732ac9932f832077a506c587cb1401a4f7f`
- `docs/operations/solution-upgrade-reservations/DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md` — `eb02a8ed22515b70b0d897949945e40b013eaab6`
- `docs/operations/solution-upgrade-reservations/docs-manifest.json` — `649d90226c8dc8a936f1d41a07e4c51e09acc4e5`
- `docs/rules/RULEBOOK_CURRENT.md` — `e2c5dd43a16469d25f155a23f723071fd8988a3e`
- `docs/agents/outcome-method-review.md` — `909dfdc6a30abcc9625a2450e55765796f65ec82`
- `docs/agents/gpt-reservation.md` — `308bd8c59bbda4b1bb6fc6c2fd600b4cd8abac9a`
- `docs/rules/02_PIPELINES/gpt-reservation/README_CURRENT.md` — `0e6309c3893e50b98607c9d44c08a8a3dc73e9bb`
- `docs/agents/common.md` — `ef299aeecf718aeb3db03c4f3e19efaca47cc260`
- `archive/AGENTS.md` — `ea550cf69dde6fb60817ca1895341b80734908d2`
- `docs/agents/exam-pipeline.md` — `a3307a463626c2b21ba0c82b7d17410829f14ae3`
- `docs/agents/metadata.md` — `caf99a38f087d5e97ef0dc16b8638353ad32494c`
- `docs/agents/git-evidence.md` — `98165110adf82ddd16adec92f29951691484af21`
- `docs/rules/01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md` — `bf5b8a1b6d7488d30b4b1ced5fbe6853001c9d75`
- `docs/rules/02_PIPELINES/JS_문항품질_업그레이드.md` — `0ea5c57cdf71f8ded248b9ebd4dde0cf7b90e84c`
- `docs/rules/02_PIPELINES/Archive_작업전_Golden_Sample_Calibration_v1.md` — `693c7ed76dbd643dedd204bbcec9f707bbc2e2f2`
- `docs/operations/solution-upgrade-reservations/BOARD_SOLUTION_SAMPLES_CURRENT.md` — `f703929fa816fc4183f28235a355ecd3a1d6ace7`


검토 방식: 소스의 실제 문제·보기·정답·기존 해설 20개 전수를 읽고, 지수·로그 정의역과 밑 조건, 부등식의 끝점, 자연수 개수, 근호 실근, 기하 거리·넓이, 삼각함수 부호·주기를 독립 계산했다. 문제 원본 PNG/SVG 4개는 모두 실물 시각 판독했으며, 보조 `solutionImage` 3개는 Git blob 실파일 존재를 확인했다. 학생 최종 렌더·보조 그림 전수 시각 검수·`preflight.mjs`·Golden/Negative·운영 출고·SHA-256 영수증은 `NOT_RUN`.

메타데이터 주의: 비어 있는 `standardCourse`/`category`/`questionType`은 원본 공란을 그대로 `NOT_PRESENT`로 기록했다. 파일명과 표준 단원키는 참조 단서이지 원본 키 값을 임의 보충하지 않는다.

## 문제·보조 해설 이미지 원격 실물 증거

- Q06 `content` — `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q06.png` · Git blob `963fc26e5799b493633c6c135a4fd26bab7c2d3e` · 실제 PNG/SVG 시각 판독 완료
- Q11 `content` — `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q11.png` · Git blob `63d6785de777e29f5408b6900c611ddaa66550dc` · 실제 PNG/SVG 시각 판독 완료
- Q14 `content` — `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q14.png` · Git blob `801e94c0aa2e0a7cbed726264ee7fded9ac67e5a` · 실제 PNG/SVG 시각 판독 완료
- Q14 `solutionImage` — `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q14-solution-v2.svg` · Git blob `6eb2171bf09e9580cb9fa8ee6cc3f5589eb52f59` · 실파일/blob 확인, 시각 판독 NOT_RUN
- Q18 `content` — `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q18-problem-v2.svg` · Git blob `a9511e7ebb0fb794e4fe9fbe6bc52bc79d656996` · 실제 PNG/SVG 시각 판독 완료
- Q18 `solutionImage` — `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q18-solution-v2.svg` · Git blob `6288668a34690902267c2b1389ee74a64c978296` · 실파일/blob 확인, 시각 판독 NOT_RUN
- Q19 `solutionImage` — `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q19-solution-v2.svg` · Git blob `97a99d2839350eed3c8781d80845c0450088893c` · 실파일/blob 확인, 시각 판독 NOT_RUN

**Q18 도형 표시:** 원본 문제 SVG를 렌더하였으며 도형·반지름 관계는 맞지만 `OA=10` 라벨이 `C` 부근의 x축에 겹치는 시각 가독성 문제를 확인. 판정 `UPGRADE`(Q18).

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
${\left(\frac{2}{3}\right)}^{-2}$의 값은? [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{8}{27}$
2. $\frac{4}{9}$
3. $\frac{3}{2}$
4. $\frac{9}{4}$
5. $\frac{27}{8}$
````

- 원본 `answer`: `4`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
음의 지수는 밑을 뒤집어 양의 지수로 바꿉니다.
$\left(\frac23\right)^{-2}=\left(\frac32\right)^2=\frac{3^2}{2^2}=\frac94$입니다.
$\frac49$는 지수의 음수 부호를 빠뜨린 값이고, $\frac32$는 제곱을 빠뜨린 값입니다. 따라서 정답은 ④입니다.
````

- **독립 판정·핵심 연결/검산:** 음의 지수는 역수로 바꿔 \((2/3)^{-2}=(3/2)^2=9/4\), 원본 답 번호4=④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\log_2 \frac{1}{16}$의 값은? [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $-4$
2. $-2$
3. $0$
4. $2$
5. $4$
````

- 원본 `answer`: `1`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
로그는 지수로 바꾸어 생각합니다.
$\frac1{16}=2^{-4}$이므로 $\log_2\frac1{16}=\log_2 2^{-4}=-4$입니다.
진수가 1보다 작고 밑이 2이므로 로그값은 음수입니다. 따라서 정답은 ①입니다.
````

- **독립 판정·핵심 연결/검산:** \(1/16=2^{-4}\)이므로 \(\log_2(1/16)=-4\), 원본 답 번호1=①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
다음 중 각을 나타내는 동경이 나머지 넷과 다른 하나를 고르면? [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $-30^\circ$
2. $330^\circ$
3. $690^\circ$
4. $-780^\circ$
5. $1050^\circ$
````

- 원본 `answer`: `4`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
동경이 같으려면 두 각의 차가 $360^\circ$의 정수배여야 합니다.
$-30^\circ+360^\circ=330^\circ$, $690^\circ-360^\circ=330^\circ$, $1050^\circ-720^\circ=330^\circ$입니다.
그러나 $-780^\circ+1080^\circ=300^\circ$이므로 나머지 네 각과 동경이 다릅니다. 정답은 ④입니다.
````

- **독립 판정·핵심 연결/검산:** \(-30^\circ,330^\circ,690^\circ,1050^\circ\) 모두 동경330°, \(-780^\circ\equiv300^\circ\)만 달라서 ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
호의 길이가 $4\pi$이고 넓이가 $12\pi$인 부채꼴의 반지름의 길이를 구하면? [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 2
2. 4
3. 6
4. 8
5. 10
````

- 원본 `answer`: `3`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
부채꼴은 호의 길이를 $l$, 반지름을 $r$이라 할 때 넓이가 $S=\frac12rl$입니다. 이 식은 $l=r\theta$, $S=\frac12r^2\theta$에서 얻습니다.
$12\pi=\frac12\cdot r\cdot4\pi=2\pi r$이므로 $r=6$입니다.
따라서 정답은 ③입니다.
````

- **독립 판정·핵심 연결/검산:** 호 길이 \(4\pi\), 넓이 \(12\pi=rl/2\)에서 \(r=6\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\sqrt{\frac{3^7 + 9^7}{3^5 + 9^6}}$을 간단히 하면? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{1}{9}$
2. $\frac{1}{3}$
3. 27
4. 9
5. 3
````

- 원본 `answer`: `5`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
지수법칙으로 분자와 분모에서 같은 인수를 묶습니다. $9=3^2$이므로
$3^7+9^7=3^7+3^{14}=3^7(1+3^7)$,
$3^5+9^6=3^5+3^{12}=3^5(1+3^7)$입니다.
따라서 $\sqrt{\frac{3^7(1+3^7)}{3^5(1+3^7)}}=\sqrt{3^2}=3$입니다. 제곱근 기호는 양의 값을 뜻하므로 정답은 ⑤입니다.
````

- **독립 판정·핵심 연결/검산:** \(9=3^2\)로 \(3^7+9^7=3^7(1+3^7)\), \(3^5+9^6=3^5(1+3^7)\). 비율 \(3^2\)의 양의 제곱근3, ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y=4^{x+a}+b$의 그래프가 오른쪽 그림과 같을 때, 상수 $a, b$에 대하여 $a-b$의 값은? [4.2점]<br><br><div class="exam-img-box"><img src="assets/images/22_금당고_1학기_중간_고2_수학I/q06.png" class="exam-img" alt="증가하는 지수곡선이 세로축과 높이 1에서 만난다. 아래에 가로 점근선 y=−3이 점선으로 표시되어 있다."></div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 1
2. 2
3. 3
4. 4
5. 5
````

- 원본 `answer`: `4`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
그림에서 먼저 **수평 점근선**을 찾습니다. $4^{x+a}$는 모든 $x$에서 양수이고 $x\to-\infty$이면 $0$에 가까워지므로, $y=4^{x+a}+b$의 점근선은 $y=b$입니다. 그림의 점근선은 $y=-3$이어서 $b=-3$입니다.
다음으로 그림의 $y$축과의 교점 $(0,1)$을 식에 넣습니다. $1=4^{0+a}-3$이므로 $4^a=4=4^1$, 따라서 $a=1$입니다.
묻는 것은 $a+b$가 아니라 $a-b$이므로 $a-b=1-(-3)=4$입니다. 선택지 ④입니다. 점근선의 높이와 절편의 높이를 혼동하지 않아야 합니다.
````

- **독립 판정·핵심 연결/검산:** 실제 PNG에서 수평 점근선 \(y=-3\Rightarrow b=-3\), \(y\)절편 \((0,1)\)에서 \(4^a=4\Rightarrow a=1\). \(a-b=4\), ④.
- 그림 증거: `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q06.png` (시각 검토, blob `963fc26e5799b493633c6c135a4fd26bab7c2d3e`)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y=\log_a(x+2)+\log_a(4-x)$의 최솟값이 $-4$일 때, 상수 $a$의 값은? (단, $a>0, a\ne 1$) [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{1}{\sqrt{3}}$
2. $\frac{1}{3}$
3. 3
4. $\sqrt{3}$
5. $3\sqrt{3}$
````

- 원본 `answer`: `1`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
**① 정의역 확인.** 두 로그의 진수가 각각 양수여야 하므로 $x+2>0$, $4-x>0$입니다. 따라서 $-2<x<4$이고, 이 구간에서는 로그의 곱셈법칙을 쓸 수 있습니다.
$y=\log_a\{(x+2)(4-x)\}=\log_a\{9-(x-1)^2\}$입니다.
**② 밑의 범위 판단.** $9-(x-1)^2$은 $x=1$에서 $9$가 되고 양 끝에 가까워지면 $0$에 가까워집니다. $a>1$이면 로그가 증가하므로 진수가 $0^+$로 갈 때 $y\to-\infty$입니다. 이때는 최솟값이 **존재하지 않습니다**. 따라서 최솟값 $-4$를 갖기 위해서는 $0<a<1$이어야 합니다.
**③ 최솟값 계산.** $0<a<1$인 로그함수는 감소하므로 진수가 가장 큰 $9$일 때 함수값이 가장 작습니다. $\log_a9=-4\iff a^{-4}=9\iff a^4=\frac19$. $a>0$에서 $a=\frac1{\sqrt3}$입니다. $0<a<1$ 조건에도 맞으므로 정답은 ①입니다.
````

- **독립 판정·핵심 연결/검산:** 로그 진수 \(9-(x-1)^2\in(0,9]\). \(a>1\)일 때 아래로 무한해 최솟값이 없으므로 \(0<a<1\). \(\log_a9=-4\)로 \(a=1/\sqrt3\), ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y=-(4^x+4^{-x})+2(2^x+2^{-x})-1$은 $x=a$에서 최댓값 $b$를 갖는다. 두 실수 $a, b$에 대하여 $a+b$의 값은? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 1
2. 2
3. 3
4. 4
5. 5
````

- 원본 `answer`: `1`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$4^x=(2^x)^2$이므로 $2^x$와 $2^{-x}$를 한 묶음으로 만드는 것이 핵심입니다. $t=2^x+2^{-x}$라 놓습니다.
$2^x>0$, $2^{-x}>0$, $2^x\cdot2^{-x}=1$이므로 $t\ge2\sqrt{1}=2$이고, 등호는 $2^x=2^{-x}$, 즉 $x=0$일 때만 성립합니다.
또 $t^2=4^x+2+4^{-x}$이므로 $4^x+4^{-x}=t^2-2$입니다. 이를 원래 식에 대입하면
$y=-(t^2-2)+2t-1=-t^2+2t+1=2-(t-1)^2$입니다.
**주의:** 포물선의 꼭짓점 $t=1$은 실제 범위 $t\ge2$에 없으므로 그대로 최댓값이라고 할 수 없습니다. $t\ge2$에서는 $(t-1)^2\ge1$이고, $t=2$일 때 $y\le1$의 등호가 성립합니다.
따라서 $x=a=0$, 최댓값 $b=1$이므로 $a+b=1$, 정답은 ①입니다.
````

- **독립 판정·핵심 연결/검산:** \(t=2^x+2^{-x}\ge2\)이면 \(4^x+4^{-x}=t^2-2\), \(y=2-(t-1)^2\). 최대는 \(t=2,x=0\)에서1이므로 \(a+b=1\), ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `NOT_PRESENT` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
밑면인 원의 반지름의 길이가 $2$이고 모선의 길이가 $8$인 원뿔의 겉넓이는? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $16\pi$
2. $20\pi$
3. $24\pi$
4. $28\pi$
5. $32\pi$
````

- 원본 `answer`: `2`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
원뿔의 겉넓이는 밑면의 넓이와 옆면의 넓이를 더합니다.
밑면은 $\pi r^2=\pi\cdot2^2=4\pi$이고, 옆면은 $\pi rl=\pi\cdot2\cdot8=16\pi$입니다.
따라서 겉넓이는 $4\pi+16\pi=20\pi$이며 정답은 ②입니다. 옆면만 구하면 안 됩니다.
````

- **독립 판정·핵심 연결/검산:** 원의 밑면 \(\pi r^2=4\pi\)와 옆면 \(\pi rl=16\pi\)의 합 \(20\pi\), ②. 원본 분류상 원뿔 겉넓이(대수·구 수학Ⅰ 범위 밖)라 메타데이터/편입 출처는 별도 확인 필요하나 풀이 수치는 정확함.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\sin\theta - \cos\theta = \frac{1}{2}$일 때, $\tan\theta + \frac{1}{\tan\theta}$의 값은? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 2
2. $\frac{7}{3}$
3. $\frac{8}{3}$
4. 3
5. $\frac{10}{3}$
````

- 원본 `answer`: `3`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
주어진 식에 $\sin\theta$와 $\cos\theta$가 함께 있고, 목표식은 탄젠트와 그 역수의 합입니다. 두 식을 연결하는 것은 $\sin\theta\cos\theta$입니다.
$(\sin\theta-\cos\theta)^2=\frac14$를 전개하면 $\sin^2\theta+\cos^2\theta-2\sin\theta\cos\theta=\frac14$입니다. $\sin^2\theta+\cos^2\theta=1$이므로
$1-2\sin\theta\cos\theta=\frac14\Rightarrow 2\sin\theta\cos\theta=\frac34\Rightarrow\sin\theta\cos\theta=\frac38$입니다.
곱이 $\frac38\ne0$이므로 $\sin\theta,\cos\theta$는 모두 $0$이 아니며 $\tan\theta$와 $1/\tan\theta$가 정의됩니다. 이제
$\tan\theta+\frac1{\tan\theta}=\frac{\sin\theta}{\cos\theta}+\frac{\cos\theta}{\sin\theta}=\frac{\sin^2\theta+\cos^2\theta}{\sin\theta\cos\theta}=\frac1{\frac{3}{8}}=\frac83$입니다.
따라서 정답은 ③입니다. $\sin\theta-\cos\theta$의 부호는 제곱할 때 사라지지만, 목표식은 곱만으로 결정되므로 추가 경우 분류가 필요하지 않습니다.
````

- **독립 판정·핵심 연결/검산:** \((\sin-\cos)^2=1/4\Rightarrow\sin\cos=3/8\ne0\). \(\tan+1/\tan=(\sin^2+\cos^2)/(\sin\cos)=8/3\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
그림과 같이 직선 $x=t$ ($t>1$)와 두 곡선 $y=\log_2 x, y=\log_2 4x$가 만나는 점을 각각 $\mathrm{A, B}$라 하자. 점 $\mathrm{C}(1, 0)$과 곡선 $y=\log_2 4x$ 위의 점 $\mathrm{D}$에 대하여 점 $\mathrm{D}$와 직선 $x=t$ 사이의 거리가 선분 $\mathrm{AB}$의 길이와 같고, 두 삼각형 $\mathrm{ABC}, \mathrm{ABD}$의 넓이의 비가 $3:1$일 때, 점 $\mathrm{D}$의 좌표는 $(p, q)$이다. $p+4^q$의 값은? (단, 점 $\mathrm{D}$의 $x$좌표는 $t$보다 작다.) [4.8점]<br><br><div class="exam-img-box"><img src="assets/images/22_금당고_1학기_중간_고2_수학I/q11.png" class="exam-img" alt="두 로그곡선 y=log₂x, y=log₂(4x)와 세로선 x=t가 있다. 세로선과 두 곡선의 교점은 차례로 A, B이다. C는 가로축의 점이고, D는 세로선 왼쪽에 있는 위쪽 로그곡선의 점이다."></div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 365
2. 375
3. 385
4. 395
5. 405
````

- 원본 `answer`: `5`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
**① 수직선분 $AB$의 길이.** 두 곡선은 $x=t$에서 만나므로 $A=(t,\log_2t)$, $B=(t,\log_2(4t))$입니다. 따라서 $AB=\log_2(4t)-\log_2t=\log_24=2$입니다. 두 점의 $x$좌표가 같아 길이는 $y$좌표 차입니다.
**② 넓이의 비를 거리의 비로 바꾸기.** $\triangle ABC$와 $\triangle ABD$는 공통 밑변 $AB$를 가지므로 넓이는 각 점 $C,D$에서 직선 $x=t$까지의 수평거리와 비례합니다. $C=(1,0)$이고 $t>1$이므로 $C$의 거리는 $t-1$입니다. $D$의 거리는 문제에서 $AB=2$라고 주었습니다. 따라서 $\frac{[ABC]}{[ABD]}=\frac{t-1}{2}=3$, 즉 $t=7$입니다.
**③ $D$의 위치.** $D$의 $x$좌표가 $t$보다 작으므로 $p=t-2=5$입니다. 오른쪽 $t+2$로 잡으면 원문 조건에 어긋납니다.
**④ 로그에서 지수로.** $D$는 $y=\log_2(4x)$ 위에 있으므로 $q=\log_2(4\cdot5)=\log_220$입니다. 따라서 $2^q=20$, $4^q=(2^q)^2=400$이고 $p+4^q=5+400=405$입니다. 정답은 ⑤입니다.
````

- **독립 판정·핵심 연결/검산:** 수직선 \(x=t\)에서 두 로그 차 \(\log_2(4t)-\log_2t=2=AB\). 같은 밑변 \(AB\)를 가진 두 삼각형의 넓이비 \(3:1\)에서 \((t-1):2=3:1\Rightarrow t=7\). 왼쪽 D의 \(x=5\), \(q=\log_220\), \(p+4^q=5+400=405\), ⑤. 실제 PNG의 점 좌우관계 대조.
- 그림 증거: `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q11.png` (시각 검토, blob `63d6785de777e29f5408b6900c611ddaa66550dc`)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
등식 ${(n^{-3} \times 12)}^{-2} = m$을 만족시키는 두 자연수 $m, n$에 대하여 $m+n$의 최솟값은? [4.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 270
2. 300
3. 330
4. 360
5. 390
````

- 원본 `answer`: `3`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
음의 지수부터 양의 지수로 바꿉니다. $m=(12n^{-3})^{-2}=(n^3/12)^2=n^6/144$입니다.
**자연수 조건이 핵심입니다.** $144=2^4\cdot3^2$가 $n^6$을 나누어야 합니다. $n$에 소인수 $2$가 하나라도 있으면 $n^6$에는 $2^6$이 있고, $3$이 하나라도 있으면 $3^6$이 있습니다. 반대로 둘 중 하나가 없으면 $144$로 나누어 정수가 될 수 없습니다. 따라서 $n$은 $6$의 배수입니다.
$n$이 양수일 때 $n^6/144+n$은 $n$이 커질수록 증가하므로, 허용되는 가장 작은 $n=6$에서 최솟값을 가집니다.
$m=\frac{6^6}{144}=\frac{46656}{144}=324$, $m+n=324+6=330$입니다. $n=6$일 때 $m$도 자연수이므로 조건을 만족합니다. 정답은 ③입니다.
````

- **독립 판정·핵심 연결/검산:** \((12n^{-3})^{-2}=n^6/144=m\). \(n^6\)이 \(144=2^4\cdot3^2\)의 배수이려면 \(6\mid n\), 최소 \(n=6\)에서 \(m=324,\ m+n=330\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$1+\log_2 b = \log_3(2a+5b) = 2\log_6(2a+b)$를 만족시키는 두 양수 $a, b$에 대하여 $\log_2 \frac{12b}{a}$의 값은? [4.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 2
2. 3
3. 4
4. 5
5. 6
````

- 원본 `answer`: `2`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
세 로그의 공통값을 $t$라 두고 지수식으로 바꿉니다.
$1+\log_2b=\log_2(2b)=t$이므로 $2^t=2b$,
$\log_3(2a+5b)=t$이므로 $3^t=2a+5b$,
$2\log_6(2a+b)=t$이므로 $6^t=(2a+b)^2$입니다.
$6^t=2^t3^t$를 이용하면 $(2a+b)^2=2b(2a+5b)$입니다.
전개하여 $4a^2+4ab+b^2=4ab+10b^2$, 따라서 $4a^2=9b^2$입니다. $a,b>0$이므로 $\frac{a}{b}=\frac{3}{2}$입니다.
$\log_2\frac{12b}{a}=\log_2\frac{12}{\frac{3}{2}}=\log_28=3$이므로 정답은 ②입니다.
````

- **독립 판정·핵심 연결/검산:** 공통 로그값 \(t\)에서 \(2^t=2b,\ 3^t=2a+5b,\ 6^t=(2a+b)^2\). \((2a+b)^2=2b(2a+5b)\Rightarrow4a^2=9b^2\), 양수로 \(a/b=3/2\), \(\log_2(12b/a)=3\), ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y={\left(\frac{1}{2}\right)}^x$의 그래프를 $x$축의 방향으로 $m$만큼, $y$축의 방향으로 $n$만큼 평행이동하면 함수 $y=f(x)$의 그래프와 일치한다. 함수 $y={\left(\frac{1}{2}\right)}^x$의 그래프가 $y$축과 만나는 점 $\mathrm{A}$는 이 평행이동에 의하여 곡선 $y=f(x)$와 직선 $y=x+1$의 교점 $\mathrm{B}$로 이동된다. 또 점 $\mathrm{B}$를 지나고 기울기가 $-1$인 직선과 함수 $y=\log_2(x-n)+m$의 그래프의 교점을 $\mathrm{C}$라 하자. 삼각형 $\mathrm{ABC}$의 넓이가 $6$일 때, $f(4)$의 값은? (단, $n, m$은 양의 실수이다.) [4.8점]<br><br><div class="exam-img-box"><img src="assets/images/22_금당고_1학기_중간_고2_수학I/q14.png" class="exam-img" alt="원래 지수곡선의 세로축 교점 A, 옮긴 지수곡선과 직선 y=x+1의 교점 B, B를 지나는 내림 직선과 로그곡선의 교점 C를 표시한다."></div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 8
2. 10
3. 12
4. 14
5. 16
````

- 원본 `answer`: `2`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
**① 평행이동을 식으로.** 원래 함수 $y=(\frac{1}{2})^x$를 오른쪽으로 $m$, 위로 $n$ 이동하면 $f(x)=(\frac{1}{2})^{x-m}+n$입니다. $A=(0,1)$이 $B=(m,1+n)$으로 이동합니다.
**② $B$의 직선 조건.** $B$가 $y=x+1$ 위에 있으므로 $1+n=m+1$, 즉 $n=m$입니다. 따라서 $B=(m,m+1)$이고 $\overline{AB}=m\sqrt2$입니다($m>0$).
**③ $C$의 좌표.** 그림에서 $C$는 $B$의 오른쪽 아래에 있으며 $BC$의 기울기는 $-1$입니다. $C=(m+d,m+1-d)$ ($d>0$)로 두면 $C$가 $y=\log_2(x-m)+m$ 위에 있으므로
$m+1-d=\log_2d+m\iff 1-d=\log_2d$입니다. $d>0$에서 왼쪽은 엄격히 감소, 오른쪽은 엄격히 증가하므로 해는 하나이고, $d=1$을 넣으면 $0=0$이므로 유일한 해입니다. 따라서 $C=(m+1,m)$, $BC=\sqrt2$입니다.
**④ 넓이와 함수값.** $AB$의 기울기는 $1$, $BC$는 $-1$이어서 서로 수직입니다. $[ABC]=\frac12(m\sqrt2)(\sqrt2)=m=6$이므로 $m=n=6$입니다.
$f(4)=(\frac{1}{2})^{4-6}+6=(\frac{1}{2})^{-2}+6=4+6=10$으로 정답은 ②입니다.
````

- **독립 판정·핵심 연결/검산:** 평행이동으로 \(f(x)=(1/2)^{x-m}+n\), \(A=(0,1)\mapsto B=(m,n+1)\)가 \(y=x+1\) 위라 \(n=m>0\). C는 기울기 -1 직선과 로그곡선의 교점 \(C=(m+1,m)\), \(AB\perp BC\), 넓이 \(m=6\). \(f(4)=4+6=10\), ②. 실제 PNG와 좌표 일치.
- 그림 증거: `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q14.png` (시각 검토, blob `801e94c0aa2e0a7cbed726264ee7fded9ac67e5a`); 보조 solutionImage: `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q14-solution-v2.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
지수방정식 $4^x - k \cdot 2^{x+1} + 3k = 0$이 서로 다른 두 양의 실근을 갖기 위한 실수 $k$의 값의 범위는? [4.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $k < 0$
2. $0 < k < 1$
3. $k < 0\text{ 또는 }k > 3$
4. $k > 1$
5. $k > 3$
````

- 원본 `answer`: `5`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$2^x>0$이므로 $t=2^x$로 치환합니다. 특히 문제는 **양의 실근 $x>0$**을 요구하므로 $t>1$이어야 합니다. 식은 $t^2-2kt+3k=0$이 됩니다.
**① 서로 다른 두 근:** 판별식 $D=(-2k)^2-4(3k)=4k(k-3)>0$이므로 $k<0$ 또는 $k>3$입니다.
**② 두 근 모두 $1$보다 커야 함:** 두 근의 합은 $2k$인데 $k<0$이면 합이 음수이므로 두 근이 모두 $1$보다 클 수 없습니다. 따라서 $k>3$만 남습니다.
**③ 충분성 확인:** $k>3$이면 두 근은 $t_{1,2}=k\mp\sqrt{k^2-3k}$입니다. 큰 근은 당연히 $1$보다 큽니다. 작은 근에 대하여 $k-1>0$이므로
$k-\sqrt{k^2-3k}>1\iff (k-1)^2>k^2-3k\iff k+1>0$입니다. 이는 $k>3$에서 참입니다.
따라서 두 $t$가 서로 다르고 모두 $1$보다 커서 대응하는 $x=\log_2t$도 서로 다른 양의 실수입니다. $k>3$, 정답은 ⑤입니다. 단순히 $D>0$만으로 끝내면 안 됩니다.
````

- **독립 판정·핵심 연결/검산:** \(t=2^x>1\)의 서로 다른 두 근에 필요한 판별식 \(4k(k-3)>0\), 근합 \(2k>2\)로 \(k>3\); 이때 작은 근 \(k-\sqrt{k^2-3k}>1\)도 성립, ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$50$ 이하의 자연수 전체의 집합을 $S$라 할 때, $n \in S$에 대하여 집합 $\{k \mid k \in S\text{ 이고 }\log_2 n - \log_2 k\text{는 정수}\}$의 원소의 개수를 $f(n)$이라 하자. 예를 들어, $f(10)=4$이다. 이때 $f(n)=1$인 $n$의 개수는? [4.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 4
2. 8
3. 12
4. 16
5. 20
````

- 원본 `answer`: `3`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$\log_2n-\log_2k=\log_2(\frac{n}{k})$가 정수이면 $\frac{n}{k}=2^j$ ($j$는 정수)입니다. 따라서 $n$과 $k$는 **2의 거듭제곱 부분만 다르고 홀수 부분은 같습니다**.
각 자연수는 $n=2^rd$ ($d$는 홀수, $r\ge0$)로 유일하게 나타낼 수 있습니다. 같은 홀수 부분 $d$를 가진 수는 $d,2d,4d,\ldots$ 중 $50$ 이하인 수들이므로 그 개수가 $f(n)$입니다. 예를 들어 $d=5$이면 $5,10,20,40$ 네 개로 $f(10)=4$와 맞습니다.
$f(n)=1$이려면 $d$는 존재하지만 $2d>50$이어야 하므로 $25<d\le50$입니다. 이때 $d$ 자체만 가능하며 $n=d$입니다.
가능한 홀수는 $27,29,31,33,35,37,39,41,43,45,47,49$로 $12$개입니다. 따라서 정답은 ③입니다. $d\le25$이면 $d$와 $2d$가 모두 있어 제외됩니다.
````

- **독립 판정·핵심 연결/검산:** \(n=2^rd\) (\(d\) 홀수)로 나누면 \(\log_2(n/k)\)가 정수일 조건은 홀수 부분 \(d\)가 같은 것. \(f(n)=1\)이려면 \(25<d\le50\), 가능한 홀수 27,29,..49의 12개, ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `서술형` / `NOT_PRESENT`; 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
※ 다음은 단답형 문제입니다. 답안지 앞면에 볼펜으로 풀이과정 없이 단답형 문항번호와 정답만 적으시오.<br><br>&lt;단답형 1&gt; $a>2$인 상수 $a$에 대하여 함수 $y=\log_a x$의 그래프와 함수 $y=\log_2 x$의 그래프가 만나는 점을 $\mathrm{A}$라 하고, 직선 $x=4$가 두 함수 $y=\log_a x, y=\log_2 x$의 그래프와 만나는 점을 각각 $\mathrm{B, C}$라 하자. 삼각형 $\mathrm{ABC}$의 넓이가 $1$일 때, $a^4$의 값을 구하시오. [5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 객관식 보기 없음)
````

- 원본 `answer`: `64`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
두 로그함수의 교점 $A$를 먼저 찾습니다. $\log_a1=\log_21=0$이므로 $(1,0)$은 교점입니다. $a>2$에서 밑이 다르므로 $x\ne1$인 곳에서 두 로그값이 같을 수 없어 $A=(1,0)$뿐입니다.
$x=4$에서 $B=(4,\log_a4)$, $C=(4,2)$입니다. $a>2$이면 $\log_a4=\frac{\log_24}{\log_2a}<2$이므로 $C$가 $B$보다 위에 있습니다. 따라서 밑변 $BC$의 길이는 $2-\log_a4$입니다.
점 $A$에서 수직선 $x=4$까지의 거리는 $4-1=3$이므로 삼각형 넓이는
$1=\frac12\cdot(2-\log_a4)\cdot3\iff2-\log_a4=\frac23\iff\log_a4=\frac43$입니다.
로그를 지수로 바꾸면 $a^{\frac{4}{3}}=4$이고 양변을 세제곱하면 $a^4=4^3=64$입니다. $a=4^{\frac{3}{4}}>2$이므로 원래 조건도 만족합니다. 정답은 $64$입니다.
````

- **독립 판정·핵심 연결/검산:** 두 로그곡선의 교점 \(A=(1,0)\), \(x=4\)에서 세로 거리 \(BC=2-\log_a4\). \(\frac12\cdot3\cdot BC=1\Rightarrow\log_a4=4/3\), \(a^4=64\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q18 — UPGRADE

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `서술형` / `NOT_PRESENT`; 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
&lt;단답형 2&gt; 그림과 같이 반지름의 길이가 $10$인 부채꼴 모양의 텃밭이 있다. 선분 $\mathrm{OA, OB}$ 위에 각각 두 점 $\mathrm{C, D}$와 $\mathrm{E, F}$를 잡아 두 부채꼴 $\mathrm{OCE, ODF}$의 호 $\mathrm{CE, DF}$를 양 끝으로 하는 통로를 만들려고 한다. 두 선분 $\mathrm{OC, DA}$의 길이는 각각 자연수이고 색칠한 두 영역의 넓이는 서로 같다. 세 호 $\mathrm{CE, DF, AB}$의 길이의 합이 $4\pi$일 때, 통로 $\mathrm{CEFD}$의 넓이를 구하시오. (단, $\overline{\mathrm{OC}}=\overline{\mathrm{OE}}, \overline{\mathrm{OD}}=\overline{\mathrm{OF}}$) [5점]<br><br><div class="exam-img-box"><img src="assets/images/22_금당고_1학기_중간_고2_수학I/q18-problem-v2.svg" class="exam-img" alt="중심 O를 꼭짓점으로 하는 반지름 10인 부채꼴 개략도이다. OA 위의 점은 O–C–D–A, OB 위의 점은 O–E–F–B 순이고 세 호 CE, DF, AB가 보인다. 안쪽 부채꼴 OCE와 바깥 띠 DFBA는 같은 옅은 색, 통로 CEFD는 다른 색으로 구분한다. 선분 OA 바깥쪽(아래)에 OA=10이라 적혀 있고, 왼쪽 위에 ‘개략도’라고 적혀 있다. 길이와 각의 비율은 실제와 다르다."></div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 객관식 보기 없음)
````

- 원본 `answer`: `\frac{7\pi}{3}`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
**① 반지름과 넓이 조건.** 공통 중심각을 $\theta>0$, 안쪽 반지름을 $r=OC=OE$, 중간 반지름을 $s=OD=OF$로 둡니다. 그림에서 $0<r<s<10$입니다. $OC=r$과 $DA=10-s$가 자연수이므로 $r,s$는 정수입니다.
색칠한 안쪽 부채꼴 $OCE$와 바깥쪽 띠 $DFBA$의 넓이가 같으므로
$\frac12r^2\theta=\frac12(10^2-s^2)\theta\iff r^2+s^2=100$입니다. $0<r<s<10$인 정수해는 $r=6,s=8$뿐입니다($6^2+8^2=36+64=100$). $DA=10-8=2$도 자연수여서 원문에 맞습니다.
**② 호의 길이 조건.** 같은 중심각에서 호의 길이는 반지름에 비례합니다. 따라서 $CE+DF+AB$의 호 길이 합은 $(r+s+10)\theta=(6+8+10)\theta=24\theta=4\pi$입니다. $\theta=\pi/6$입니다.
**③ 통로 넓이.** 통로 $CEFD$는 반지름 $8$의 부채꼴에서 반지름 $6$의 부채꼴을 뺀 띠입니다.
$[CEFD]=\frac12(8^2-6^2)\cdot\frac\pi6=\frac12(64-36)\cdot\frac\pi6=\frac{7\pi}{3}$입니다.
````

- **독립 판정·핵심 연결/검산:** **UPGRADE(그림 라벨):** 공통 중심각을 \(\theta\), 안쪽·중간 반지름을 \(r<s<10\)이라 두면 면적 동일 \(r^2+s^2=100\). \(r=OC\), \(10-s=DA\)가 자연수이므로 정수해 \(r=6,s=8\). 호 길이 합 \((6+8+10)\theta=4\pi\Rightarrow\theta=\pi/6\), 통로 면적 \(\frac12(8^2-6^2)\pi/6=7\pi/3\). 원본 SVG에서 ‘OA=10’ 글자가 C 부근 x축 라벨과 겹쳐 재배치 필요.
- 그림 증거: `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q18-problem-v2.svg` (시각 검토, blob `a9511e7ebb0fb794e4fe9fbe6bc52bc79d656996`); 보조 solutionImage: `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q18-solution-v2.svg` (원격 존재 검증)
- **UPGRADE 사유:** 원문 정답 또는 계산은 유지하되 풀이의 엄밀성, 출제 조건의 명확성, 그래프 표기 가독성 개선이 필요. 학생용 보완 풀이를 완성해 아래 남김. 원본 정답키 미수정.

**학생용 교체·보완 해설 초안**

**1. 세 반지름을 정한다.** 중심각을 \(\theta>0\), 안쪽 반지름 \(r=OC=OE\), 중간 반지름 \(s=OD=OF\)라 놓는다. 그림의 순서로 \(0<r<s<10\). \(OC=r\), \(DA=10-s\)가 자연수이므로 \(r,s\)는 정수이다.

**2. 두 색칠 영역의 넓이가 같다.** 안쪽 \(OCE\)와 바깥 띠 \(DFBA\)의 넓이 동일 조건은
\[
\frac12r^2\theta=\frac12(10^2-s^2)\theta
\quad\Longrightarrow\quad r^2+s^2=100.
\]
\(0<r<s<10\)인 자연수해는 \(r=6,\ s=8\)이다.

**3. 호의 길이로 중심각을 정한다.** \(CE+DF+AB=(r+s+10)\theta=24\theta=4\pi\)이므로 \(\theta=\pi/6\).

**4. 통로 면적을 구한다.**
\[
[CEFD]=\frac12(s^2-r^2)\theta
=\frac12(64-36)\cdot\frac{\pi}{6}
=\boxed{\frac{7\pi}{3}}.
\]

**시각 보완:** 원본 SVG에서 \(\mathrm{OA}=10\) 라벨이 \(C\) 부근의 \(x\)축/점 표기와 겹쳐 보인다. 원본 도형의 반지름 순서는 맞지만, 문제 그림 문구를 바깥 여백으로 옮겨 가독성을 확보해야 한다. 실제 SVG 파일은 이번 MD 기록에서 수정하지 않는다.


### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `서술형` / `NOT_PRESENT`; 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
※ 다음은 서술형 문제입니다. 답안지 뒷면에 볼펜으로 풀이 과정을 상세하게 서술하시오.<br>(풀이 과정에 부분 점수 있으며, 답만 적으면 풀이 과정 배점하지 않음.)<br><br>&lt;서술형 1&gt; 길이가 $\sqrt[3]{54}$인 선분 $\mathrm{AB}$를 지름으로 하는 원 위의 점 $\mathrm{P}$에 대하여 $\overline{\mathrm{AP}}=\sqrt[3]{2}$이다. 점 $\mathrm{P}$에서 선분 $\mathrm{AB}$에 내린 수선의 발을 $\mathrm{H}$라 할 때, 삼각형 $\mathrm{PAH}$의 넓이는 $2^{\frac{y}{x}} \times 3^z$이다. $x+y-z$의 값을 구하시오.<br>(단, $x$와 $y$는 서로소인 자연수이고, $z$는 정수이다.) [10점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 객관식 보기 없음)
````

- 원본 `answer`: `15`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
**① 직각삼각형 확인.** $AB$가 원의 지름이고 $P$가 원 위에 있으므로 원주각 $\angle APB=90^\circ$입니다. 따라서 $AB$는 직각삼각형 $APB$의 빗변입니다.
$AB=\sqrt[3]{54}=3\sqrt[3]2=3\cdot2^{\frac{1}{3}}$, $AP=2^{\frac{1}{3}}$입니다. 피타고라스 정리로
$PB^2=AB^2-AP^2=9\cdot2^{\frac{2}{3}}-2^{\frac{2}{3}}=8\cdot2^{\frac{2}{3}}$이므로 $PB=2^{\frac{3}{2}}\cdot2^{\frac{1}{3}}=2^{\frac{11}{6}}$입니다.
**② 수선의 발 $H$.** 직각삼각형의 닮음에서 $AP^2=AB\cdot AH$이므로
$AH=\frac{AP^2}{AB}=\frac{2^{\frac{2}{3}}}{3\cdot2^{\frac{1}{3}}}=\frac{2^{\frac{1}{3}}}3$입니다.
또 같은 삼각형의 넓이를 두 방법으로 계산하면 $\frac12 AP\cdot PB=\frac12 AB\cdot PH$이므로
$PH=\frac{AP\cdot PB}{AB}=\frac{2^{\frac{1}{3}}\cdot2^{\frac{11}{6}}}{3\cdot2^{\frac{1}{3}}}=\frac{2^{\frac{11}{6}}}3$입니다.
**③ 넓이와 지수 비교.** $PH\perp AB$이므로 $[PAH]=\frac12 AH\cdot PH=\frac12\cdot\frac{2^{\frac{1}{3}}}3\cdot\frac{2^{\frac{11}{6}}}3=2^{\frac{1}{3}+\frac{11}{6}-1}\cdot3^{-2}=2^{\frac{7}{6}}\cdot3^{-2}$입니다.
$x=6$, $y=7$은 서로소이고 $z=-2$이므로 $x+y-z=6+7-(-2)=15$입니다.
````

- **독립 판정·핵심 연결/검산:** 직경 \(AB=3\cdot2^{1/3}\), \(AP=2^{1/3}\)에서 \(PB=2^{11/6}\), \(AH=AP^2/AB=2^{1/3}/3\), \(PH=AP\cdot PB/AB=2^{11/6}/3\). 삼각형 넓이 \(2^{7/6}\cdot3^{-2}\)이므로 \(x+y-z=6+7+2=15\).
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q19-solution-v2.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q20 — UPGRADE

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `b21f656851eb21bc5a755c8a5b3cb2c7834ea483`
- 형식/배점: `서술형` / `NOT_PRESENT`; 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
&lt;서술형 2&gt; 함수 $f(x)=\log_2(x+k)$와 그 역함수 $f^{-1}(x)$에 대하여 두 곡선 $y=f(x), y=f^{-1}(x)$가 서로 다른 두 점 $\mathrm{A, B}$에서 만나고 $\overline{\mathrm{AB}}=n\sqrt{2}$일 때, 점 $\mathrm{A}$의 $x$좌표를 $g(n)$이라 하자. $g(n)-g(2n)>6$을 만족시키는 자연수 $n$의 최솟값을 구하시오.<br>(단, $k$는 상수이고, 점 $\mathrm{A}$의 $x$좌표는 점 $\mathrm{B}$의 $x$좌표보다 작다.) [10점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 객관식 보기 없음)
````

- 원본 `answer`: `7`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
**① 교점은 $y=x$ 위에 있습니다.** $f(x)=\log_2(x+k)$는 정의역에서 증가합니다. $f$와 역함수의 교점 $(u,v)$라면 $f(u)=v$, $f(v)=u$입니다. $u<v$라면 증가성 때문에 $f(u)<f(v)$, 즉 $v<u$가 되어 모순이고, $u>v$도 마찬가지입니다. 따라서 $u=v$입니다.
**② 거리 조건을 좌표 차로.** 두 교점은 $(t,t)$, $(t+n,t+n)$으로 쓸 수 있습니다. 두 점 사이 거리는 $\sqrt{n^2+n^2}=n\sqrt2$이고 작은 $x$좌표가 $g(n)=t$입니다.
고정점 조건 $f(x)=x$를 지수식으로 바꾸면 $2^x=x+k$입니다. 두 교점에서
$2^t=t+k$, $2^{t+n}=t+n+k$이므로 빼서 $2^t(2^n-1)=n$입니다. 따라서 $g(n)=t=\log_2\frac{n}{2^n-1}$입니다.
**③ $2n$과 비교.** 같은 방식으로 $g(2n)=\log_2\frac{2n}{2^{2n}-1}$이므로
$g(n)-g(2n)=\log_2\left(\frac{n}{2^n-1}\cdot\frac{2^{2n}-1}{2n}\right)=\log_2\frac{2^n+1}{2}$입니다. 여기서 $2^{2n}-1=(2^n-1)(2^n+1)$을 사용했습니다.
**④ 엄격한 부등식과 경계.** $\log_2\frac{2^n+1}{2}>6$은 밑 $2>1$이므로 $\frac{2^n+1}{2}>2^6=64$, 즉 $2^n>127$과 같습니다. $2^6=64\le127$, $2^7=128>127$이므로 최소 자연수 $n=7$입니다. $>$ 조건이라 등호는 허용되지 않습니다.
````

- **독립 판정·핵심 연결/검산:** **UPGRADE(매개변수):** \(f(x)=\log_2(x+k)\)는 증가하므로 역함수와의 교점은 \(y=x\) 위의 서로 다른 두 점 \((t,t),(t+n,t+n)\). \(2^t=t+k,\ 2^{t+n}=t+n+k\)에서 \(2^t(2^n-1)=n\), \(g(n)=\log_2[n/(2^n-1)]\). \(g(n)-g(2n)=\log_2[(2^n+1)/2]>6\)에서 \(2^n>127\), 최소 자연수 \(n=7\). \(g(n)\)에서 매개변수 \(k\)는 각 거리 \(n\)에 맞게 정해지는 값임을 설명할 필요.
- 그림 증거: 별도 문제 그림 없음
- **UPGRADE 사유:** 원문 정답 또는 계산은 유지하되 풀이의 엄밀성, 출제 조건의 명확성, 그래프 표기 가독성 개선이 필요. 학생용 보완 풀이를 완성해 아래 남김. 원본 정답키 미수정.

**학생용 교체·보완 해설 초안**

**1. 증가함수와 역함수의 교점을 찾는다.** \(f(x)=\log_2(x+k)\)는 증가하므로 \(f\)와 역함수가 만나는 점은 \(y=x\) 위에 있다. 두 교점을 \(A=(t,t)\), \(B=(t+n,t+n)\)이라 하면 \(AB=n\sqrt2\)이다.

**2. 두 고정점 식을 빼서 \(k\)를 제거한다.**
\[
2^t=t+k,\qquad 2^{t+n}=t+n+k.
\]
두 식의 차는 \(2^t(2^n-1)=n\), 따라서
\[
g(n)=t=\log_2\frac{n}{2^n-1}.
\]
여기서 \(k\)는 각 거리 \(n\)을 만족시키는 함수족의 매개변수로 정해진다. \(g(n)\)과 \(g(2n)\)의 \(k\)를 반드시 같은 수로 고정하는 뜻은 아니다.

**3. 로그 차를 계산한다.**
\[
g(n)-g(2n)=
\log_2\left(\frac{n}{2^n-1}\cdot
\frac{2^{2n}-1}{2n}\right)
=\log_2\frac{2^n+1}{2}.
\]

**4. 엄격한 부등식을 푼다.** \(\log_2[(2^n+1)/2]>6\iff2^n>127\). \(2^6=64\), \(2^7=128\)이므로 최소 자연수는 **\(n=7\)**. 원본 정답은 유지하고 매개변수 의미를 명시한다.


## 종료 검증 및 다음 단계

- 원본 소스 전수: Q01–Q20, 20개, `UNREAD 0`. 원문·보기·정답·기존 해설과 독립 검산을 모두 기록.
- 판정 합계: KEEP 18, UPGRADE 2, HOLD 0 (총 20).
- 개선 해설 초안: Q18, Q20; 해당 Q에 본문 수록.
- 보류: NONE; 출제 이미지/조건 복구 뒤 재감사 필요.
- 원문 문제 그림 4개 실제 판독, 보조 해설 그림 3개 존재 검증. 최종 UI 출고 QA `NOT_RUN`.
- 본 MD는 worker branch 감사 기록이며 실제 JS 교체 또는 운영 병합 상태가 아니다.
