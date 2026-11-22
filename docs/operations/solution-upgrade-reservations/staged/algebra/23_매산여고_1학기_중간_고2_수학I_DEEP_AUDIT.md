# 2023 23_매산여고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2023`
- source: `archive/exams/original/high/h2/1mid/23_매산여고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- course: `수학I` (파일명); `standardCourse` 누락 `0/23`, `category` 누락 `0/23`
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/23_매산여고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `23` · actual question/answer/solution read: `23` · KEEP 22 · UPGRADE 1 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 전 23문항의 원문 `content`·`choices`·`answer`·`solution` 및 참조 자료 검토. UPGRADE는 교체 가능한 학생용 해설 초안을 기록하고, HOLD는 수학적 충돌과 수정 권고를 기록한다. 원본 JS/그림/정답키/`main`은 수정하지 않음.

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


검토 방식: `23_매산여고_1학기_중간_고2_수학I.js`의 실제 문제·보기·정답·기존 해설 23개 전수를 읽고, 방정식의 정의역·밑 및 진수·근 개수·이차함수 범위·삼각함수 부호·기하 도형 관계를 독립 검산했다. 객관식은 선지·정답 번호를 비교하고, 서답형은 수치를 직접 대조했다. 문제 이미지 2개는 모두 실제 시각 판독(원본 PNG 또는 SVG 렌더)을 수행했다. `solutionImage` 5개는 원격 원본 실파일·blob 증거를 확인했으며 **보조 해설 그림 전체의 시각 판독은 NOT_RUN**이다. `preflight.mjs`, Golden/Negative, UI 출고 게이트, SHA-256 영수증은 `NOT_RUN`이며 원본 재발행 아님.

## 문제·보조 해설 이미지 실물 증거

- Q09 `solutionImage` — `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q9-solution.svg` · Git blob `6331256b812d427e7ec484ea654f08126b81b86d` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q13 `solutionImage` — `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q13-solution.svg` · Git blob `797c86701b234e6b53a0ce20b346ec7de2aa3904` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q17 `image` — `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q17.png` · Git blob `e7e0ed378450b686e54d29d84abd1ce1fa6b8091` · 실제 PNG/SVG 시각 판독 완료
- Q17 `solutionImage` — `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q17-solution.svg` · Git blob `8dea1db2aba0cf204d652fbb16f4c0a2fa48ca23` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q20 `solutionImage` — `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q20-solution.svg` · Git blob `f7ea94e25b1c9e6a63df54bb81a6a28b737386c5` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q21 `image` — `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q21.png` · Git blob `4b3ea167044eebbf553ec43bab079befce8550a4` · 실제 PNG/SVG 시각 판독 완료
- Q21 `solutionImage` — `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q21-solution.svg` · Git blob `56ad24ee51ab0a24ce7314ef1969e28b3470f0c4` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `3.5`; 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\sqrt[3]{16} \times 2^{-\frac{1}{3}}$의 값을 구하면? [3.5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. \sqrt[3]{2}
2. \sqrt[3]{4}
3. 2
4. 2\sqrt[3]{2}
5. 4
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
세제곱근을 거듭제곱으로 나타내면
$\sqrt[3]{16}=2^{\frac{4}{3}}$이다.

따라서
$2^{\frac{4}{3}}\times2^{-\frac{1}{3}}=2^{(\frac{4}{3})-(\frac{1}{3})}=2$이다.

정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** 세제곱근과 음의 지수를 같은 밑 2로 통일하면 \(2^{4/3-1/3}=2\)이므로 ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `3.6`; 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\log_2 28 - \log_2 7$의 값을 구하면? [3.6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 1
2. 2
3. 3
4. 4
5. 5
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
로그의 뺄셈을 진수의 몫으로 바꾼다.

$\log_2 28-\log_2 7=\log_2\frac{28}{7}$
$=\log_2 4=2$.

정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** \(\log_2(28/7)=\log_2 4=2\)이므로 ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `3.6`; 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$5^{2x-3} < 5^{15}$을 만족시키는 정수 $x$의 최댓값을 구하면? [3.6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 5
2. 6
3. 7
4. 8
5. 9
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
밑 $5$가 $1$보다 크므로 지수의 대소가 그대로 유지된다.

$2x-3<15$
$2x<18$
$x<9$.

$x$는 정수이므로 가능한 가장 큰 값은 $8$이다.

정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** 밑 \(5>1\)이므로 \(2x-3<15\Rightarrow x<9\), 정수 최댓값 8, ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `3.6`; 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
호도법으로 나타낸 각 $\frac{\pi}{3}$를 육십분법으로 바르게 나타낸 것을 구하면? [3.6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 15^\circ
2. 30^\circ
3. 45^\circ
4. 60^\circ
5. 90^\circ
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
한 바퀴의 각도 $2\pi$는 $360^\circ$이므로

$\frac{\pi}{3}=\frac{180^\circ}{3}=60^\circ$.

정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** \(\pi/3\times180^\circ/\pi=60^\circ\), ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `3.7`; 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
예각삼각형 $\mathrm{ABC}$에 대한 다음 보기 중 옳은 것을 모두 고른 것은? [3.7점]

<보기>
ㄱ. $\sin\frac{B+C}{2} = \cos\frac{A}{2}$
ㄴ. $\tan A + \tan(B+C) = 0$
ㄷ. $\sin(A+B) + \sin C = 0$
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. ㄱ
2. ㄴ
3. ㄱ, ㄴ
4. ㄴ, ㄷ
5. ㄱ, ㄴ, ㄷ
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
삼각형의 내각의 합은 $A+B+C=\pi$이다.

ㄱ. $B+C=\pi-A$이므로
$\sin\frac{B+C}{2}=\sin\frac{\pi-A}{2}=\cos\frac A2$.
따라서 참이다.

ㄴ. $B+C=\pi-A$이므로
$\tan(B+C)=\tan(\pi-A)=-\tan A$.
따라서 $\tan A+\tan(B+C)=0$으로 참이다.

ㄷ. $A+B=\pi-C$이므로
$\sin(A+B)+\sin C=\sin C+\sin C=2\sin C\ne0$.
따라서 거짓이다.

옳은 것은 ㄱ, ㄴ이므로 정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** \(B+C=\pi-A\)를 쓰면 ㄱ은 \(\sin((B+C)/2)=\cos(A/2)\), ㄴ은 \(\tan(B+C)=-\tan A\); ㄷ은 \(2\sin C\neq0\). 따라서 ㄱ·ㄴ, ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `3.7`; 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
이차방정식 $2x^2 - x\log_3 16 + 6 = 0$의 두 근을 $\alpha, \beta$라 할 때, $3^{\alpha^2\beta + \alpha\beta^2}$의 값을 구하면? [3.7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 64
2. 81
3. 128
4. 243
5. 256
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
근과 계수의 관계에서
$\alpha+\beta=\frac{\log_3 16}{2}=\log_3 4$,
$\alpha\beta=\frac{6}{2}=3$이다.

따라서
$\alpha^2\beta+\alpha\beta^2=\alpha\beta(\alpha+\beta)=3\log_3 4$.

그러므로
$3^{\alpha^2\beta+\alpha\beta^2}=3^{3\log_3 4}=4^3=64$.

정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** 이차방정식 근의 합·곱을 대입해 지수 \(3\log_3 4=\log_3 64\)를 얻으므로 해당 값 64, ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `3.8`; 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y=2^{x+1}$의 그래프를 $x$축의 방향으로 $m$만큼, $y$축 방향으로 $n$만큼 평행이동한 후 $y$축 대칭이동하였더니, 함수 $y=4 \times \left(\frac{1}{2}\right)^{x-2}+3$의 그래프와 겹쳐졌다. 상수 $m, n$에 대하여 $m+n$의 값을 구하면? [3.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. -2
2. -1
3. 0
4. 1
5. 2
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
먼저 그래프를 오른쪽으로 $m$, 위로 $n$만큼 옮기면
$y=2^{x-m+1}+n$이다.

이 그래프를 $y$축 대칭이동하면 $x$ 대신 $-x$를 대입하여
$y=2^{-x-m+1}+n=2^{1-m}\left(\frac12\right)^x+n$이다.

주어진 함수는
$4\left(\frac12\right)^{x-2}+3=16\left(\frac12\right)^x+3$이므로 계수를 비교하면
$2^{1-m}=16=2^4$, $n=3$.

따라서 $m=-3$이고 $m+n=0$이다.

정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** \(y=2^{x+1}\) 평행이동 후 \(y\)축 대칭의 \(2\)의 지수와 상수항을 비교하면 \(m=-3,n=3\); 합 0, ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `3.9`; 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$10 < x < 1000$이고, $\log\sqrt[3]{x}$와 $\log x^2$의 차가 정수일 때, 모든 실수 $x$의 곱이 $10^{\frac{q}{p}}$이다. 이때, $p+q$의 값을 구하면? (단, $p$와 $q$는 서로소인 자연수이다.) [3.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 31
2. 32
3. 33
4. 34
5. 35
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$10<x<1000$이므로 $1<\log x<3$이다.
두 로그의 차는
$2\log x-\frac13\log x=\frac53\log x$이다.

이 값은 정수이고 $\frac53<\frac53\log x<5$이므로 가능한 정수는 $2,3,4$이다.

따라서 $\log x=\frac65,\frac95,\frac{12}{5}$이고, 모든 $x$의 곱은
$10^{6/5}\times10^{9/5}\times10^{12/5}=10^{27/5}$.

$p=5,q=27$이므로 $p+q=32$.

정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** \(1<\log x<3\)에서 \((5/3)\log x\)가 정수이면 2,3,4만 가능. 대응 \(x=10^{6/5},10^{9/5},10^{12/5}\)를 곱해 \(10^{27/5}\), \(p+q=32\), ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `4.1`; 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y=2^{|x-1|}+4$의 그래프와 직선 $y=k$가 서로 다른 두 실근을 가질 때, 실수 $k$의 값의 범위를 구하면? [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. k < 3
2. k > 3
3. 3 < k < 5
4. k < 5
5. k > 5
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$2^{|x-1|}+4$의 최솟값은 $|x-1|=0$, 즉 $x=1$일 때 $5$이다.

$k<5$이면 교점이 없고, $k=5$이면 $x=1$에서 한 점으로 만난다.
$k>5$이면 $|x-1|=\log_2(k-4)>0$이므로
$x=1-\log_2(k-4),\quad x=1+\log_2(k-4)$
의 서로 다른 두 해가 있다.

따라서 $k>5$이고 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** 절댓값 지수 \(2^{|x-1|}+4\)는 \(x=1\)에서 유일한 최솟값 5. 수평선 교점이 두 개일 조건은 \(k>5\), ⑤.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q9-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `4`; 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
모든 실수 $x$에 대하여 부등식
$$x^2 - 2x\cos\left(\frac{\pi}{2}-\theta\right) - \frac{1}{2}\cos\left(\frac{\pi}{2}+\theta\right) > 0$$
이 성립하도록 하는 $\theta$의 값의 범위가 $\alpha < \theta < \beta$이다. $\alpha+\beta$의 값을 구하면? (단, $\frac{1}{2}\pi < \theta < \pi$) [4.0점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. \frac{7}{6}\pi
2. \frac{5}{4}\pi
3. \frac{11}{6}\pi
4. \frac{5}{3}\pi
5. \frac{4}{3}\pi
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
삼각함수의 여각 관계를 쓰면
$\cos\left(\frac\pi2-\theta\right)=\sin\theta$,
$\cos\left(\frac\pi2+\theta\right)=-\sin\theta$이다.

따라서 부등식의 왼쪽은
$x^2-2x\sin\theta+\frac12\sin\theta$이다.
이 이차식이 모든 실수 $x$에서 양수이려면 판별식이 음수여야 한다.

$D=(-2\sin\theta)^2-4\cdot\frac12\sin\theta$
$=2\sin\theta(2\sin\theta-1)<0$.

$\frac\pi2<\theta<\pi$에서 $\sin\theta>0$이므로 $\sin\theta<\frac12$, 즉
$\frac{5\pi}{6}<\theta<\pi$.

따라서 $\alpha+\beta=\frac{11\pi}{6}$이고 정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** 이차식 양수 조건은 \(\sin\theta<1/2\). 제2사분면에서 \(5\pi/6<\theta<\pi\); 끝점 합 \(11\pi/6\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `4`; 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
각 $3\theta$를 나타내는 동경과 각 $7\theta$를 나타내는 동경이 일직선 위에 있고 방향이 반대일 때, $\tan\left(\theta - \frac{1}{2}\pi\right)$의 값을 구하면? (단, $\frac{\pi}{2} < \theta < \pi$) [4.0점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. -1
2. -\frac{1}{2}
3. 0
4. \frac{1}{2}
5. 1
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
두 동경이 방향이 반대이므로 두 각의 차는 홀수배의 $\pi$이다.

$7\theta-3\theta=4\theta=(2k+1)\pi$.
$\frac\pi2<\theta<\pi$에서 $2\pi<4\theta<4\pi$이므로 $4\theta=3\pi$, $\theta=\frac{3\pi}{4}$.

따라서
$\tan\left(\theta-\frac\pi2\right)=\tan\frac\pi4=1$.

정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** 서로 반대 방향인 동경의 조건에서 \(7\theta-3\theta=3\pi\), \(\theta=3\pi/4\); \(\tan(\theta-\pi/2)=1\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `3.9`; 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$1$이 아닌 양수 $x, y$에 대하여
$$\frac{1}{\log_x 3} + \frac{1}{\log_{y^2} 9} - \frac{1}{\log_4 3} = \log_3 8$$
을 만족시키는 $xy$의 값을 구하면? [3.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 24
2. 26
3. 28
4. 30
5. 32
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
로그의 역수 관계로
$\frac1{\log_x3}=\log_3x$,
$\frac1{\log_{y^2}9}=\log_9(y^2)=\log_3y$,
$\frac1{\log_4 3}=\log_3 4$이다.

따라서 주어진 식은
$\log_3x+\log_3y-\log_3 4=\log_3 8$
$\log_3\frac{xy}{4}=\log_3 8$.

그러므로 $xy=32$이고 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** 로그를 지수식으로 바꾸고 곱하면 \(\log_3(xy/4)=\log_3 8\); \(xy=32\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `4.1`; 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
전체집합 $U = \{\theta \mid 0 \le \theta < 2\pi\}$의 두 부분집합
$$A = \{\theta \mid |\sin\theta| - |\cos\theta| = \sin\theta - \cos\theta\}$$
$$B = \left\{\theta \;\middle|\; \cos\left(\frac{\pi}{2}-\theta\right) \ge \frac{1}{2}\right\}$$
에 대하여 집합 $A \cup B = \{\theta \mid \alpha \le \theta \le \beta \text{ 또는 } \theta = \gamma\}$이다. 이때 $\alpha + \beta + \gamma$의 값을 구하면? [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 2\pi
2. \frac{23}{12}\pi
3. \frac{9}{4}\pi
4. \frac{25}{12}\pi
5. \frac{13}{4}\pi
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$A$의 조건을 정리하면
$|\sin\theta|-\sin\theta=|\cos\theta|-\cos\theta$이다.

왼쪽은 $\sin\theta\ge0$일 때 $0$, $\sin\theta<0$일 때 $-2\sin\theta$이다.
오른쪽도 $\cos\theta\ge0$일 때 $0$, $\cos\theta<0$일 때 $-2\cos\theta$이다.

제1사분면에서는 양쪽이 모두 $0$이므로 $[0,\dfrac{\pi}{2}]$가 $A$에 포함된다.
제2사분면에서는 왼쪽이 $0$이고 오른쪽은 양수이므로 성립하지 않는다.
제3사분면에서는 $-2\sin\theta=-2\cos\theta$, 즉 $\sin\theta=\cos\theta$인 $\theta=\dfrac{5\pi}{4}$만 성립한다.
제4사분면에서는 왼쪽이 양수이고 오른쪽은 $0$이므로 성립하지 않는다.
따라서 $A=[0,\dfrac{\pi}{2}]\cup\{\dfrac{5\pi}{4}\}$이다.

또
$\cos(\dfrac{\pi}{2}-\theta)=\sin\theta$이므로
$B=\{\theta\mid\sin\theta\ge\dfrac12\}=[\dfrac{\pi}{6},\dfrac{5\pi}{6}]$.

따라서
$A\cup B=[0,\dfrac{5\pi}{6}]\cup\{\dfrac{5\pi}{4}\}$.
즉 $\alpha=0$, $\beta=\dfrac{5\pi}{6}$, $\gamma=\dfrac{5\pi}{4}$이므로
$\alpha+\beta+\gamma=\dfrac{25\pi}{12}$.

정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** 두 삼각함수 조건의 집합을 개별 구간으로 정리하면 합집합 \([0,5\pi/6]\cup\{5\pi/4\}\). 요구되는 끝점 합 \(25\pi/12\), ④.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q13-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `4.1`; 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
원 $x^2 + y^2 = 8$ 위의 점 $P(x, y)$에 대하여 원점 $O$와 점 $P$를 지나는 동경 $OP$가 나타내는 각의 크기를 $\theta$라 하자. $\frac{y}{x} + \frac{x}{y} = -\frac{16}{3}$일 때, $\sin\theta - \cos\theta$의 값을 구하면? (단, 점 $P$는 제 $4$사분면 위의 점이다.) [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. -\frac{\sqrt{22}}{4}
2. -\frac{\sqrt{11}}{2}
3. \sqrt{11}
4. \frac{\sqrt{22}}{4}
5. \frac{\sqrt{11}}{2}
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$P$가 제4사분면에 있으므로 $x>0$, $y<0$이다.

주어진 비의 합에서
$\frac yx+\frac xy=\frac{x^2+y^2}{xy}=-\frac{16}{3}$.
$x^2+y^2=8$이므로 $xy=-\frac32$.

따라서
$(\sin\theta-\cos\theta)^2=\frac{(y-x)^2}{8}$
$=\frac{x^2+y^2-2xy}{8}=\frac{8+3}{8}=\frac{11}{8}$.

제4사분면에서 $y-x<0$이므로
$\sin\theta-\cos\theta=-\frac{\sqrt{22}}4$.

정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** \(x^2+y^2=8\)과 \(y/x+x/y=-16/3\)에서 \(xy=-3/2\). 제4사분면의 부호로 \(\sin\theta-\cos\theta=-\sqrt{22}/4\), ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `4.2`; 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
모든 실수 $x$에 대하여 부등식 $4^x + 3 \times 2^x - 3 \ge k(2^x - 1)$이 성립하도록 하는 상수 $k$의 값의 범위를 구하면? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. k > 3
2. k \ge 3
3. 3 \le k < 7
4. 3 < k \le 7
5. 3 \le k \le 7
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$t=2^x$라 놓으면 $t>0$이고 부등식의 좌변에서 우변을 뺀 식은
$D=t^2+3t-3-k(t-1)$이다.

$t>1$에서 $u=t-1>0$로 두면
$D=(u-1)^2+(7-k)u$.
$k\le7$이면 $D\ge0$이고, $k>7$이면 $t=2$에서 $D=7-k<0$이다.

$0<t<1$에서는
$D=t^2+(k-3)(1-t)$.
$k\ge3$이면 $D\ge0$이다. $k<3$이면 $t$를 0에 충분히 가까이 잡았을 때 $D<0$이다.

$t=1$일 때는 $D=1$이다. 따라서 모든 $t>0$에서 성립하는 범위는 $3\le k\le7$이고 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** \(t=2^x>0\)로 치환해 부등식을 \(t\)의 이차식으로 바꾼 뒤 \(t\downarrow0\), \(t=1\), 접점에서의 비음수성을 함께 적용하면 \(3\le k\le7\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `4.3`; 문항 단원/과정: `로그부등식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
두 함수 $f(x) = \log_{\sqrt{3}} \frac{x}{3}$, $g(x) = x^2 - 2x$에 대하여 연립부등식
$$\begin{cases} g(f(x)) < 0 \\ f(g(x) + 3) < c \end{cases}$$
의 정수인 해의 개수가 $4$개가 되도록 하는 자연수 $c$의 값을 구하면? [4.3점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 3
2. 4
3. 5
4. 6
5. 7
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
먼저 첫째 부등식으로 정수 후보를 정한다.

$g(t)=t^2-2t=t(t-2)$이므로
$g(f(x))<0 \Longleftrightarrow 0<f(x)<2$이다.

$f(x)=\log_{\sqrt3}(x/3)$이고 밑 $\sqrt3>1$이므로 로그함수는 증가한다. 따라서
$0<\log_{\sqrt3}(\frac{x}{3})<2$
$1<x/3<3$
$3<x<9$이다.

정수 $x$는 $4,5,6,7,8$이다. 둘째 부등식은 이 후보에서 진수가 양수이며,
$f(g(x)+3)<c$
$\Longleftrightarrow \frac{g(x)+3}{3}<(\sqrt3)^c$
$\Longleftrightarrow x^2-2x+3<3^{1+c/2}$로 바뀐다.

각 후보에서 왼쪽 값은 다음과 같다.

$$\begin{array}{c|ccccc} x & 4 & 5 & 6 & 7 & 8 \\ x^2-2x+3 & 11 & 18 & 27 & 38 & 51 \end{array}$$

$c=4$이면 오른쪽은 $27$이므로 엄격한 부등식을 만족하는 정수는 $x=4,5$뿐이다. $c=5$이면 오른쪽은 $27\sqrt3$이고
$38^2=1444<2187=(27\sqrt3)^2<2601=51^2$이므로 $x=4,5,6,7$ 네 개가 해이다.

한편 $c\le4$일 때 해의 개수는 $2$개 이하이고, $c\ge6$이면 오른쪽이 $81$ 이상이어서 다섯 후보가 모두 해이다. 따라서 정수해가 정확히 $4$개가 되는 자연수는

$c=5$이다.

그러므로 정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** 첫 합성함수의 부호 조건에서 자연수 후보는 \(4,5,6,7,8\). 둘째 조건의 경계 \(x^2-2x+3=11,18,27,38,51\)을 비교하면 정확히 네 개가 되는 \(c=5\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `4.4`; 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y=\left(\frac{1}{9}\right)^x$ 위의 점 $A$를 지나는 직선이 함수 $y=\left(\frac{1}{3}\right)^x$의 그래프와 만나는 점을 $B$, $x$축과 만나는 점을 $C$라 하고, 점 $B$를 지나고 $x$축에 평행한 직선이 곡선 $y=\left(\frac{1}{9}\right)^x$과 만나는 점을 $D$라 하자. $\overline{AB} : \overline{BC} = 2 : 1$이고, $\overline{AB} = \overline{AD}$일 때, 삼각형 $ABD$의 넓이를 구하면? (단, 점 $B$의 $y$좌표는 $1$보다 크다) [4.4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 6
2. 9
3. 18
4. 27
5. 36
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$B=(t,3^{-t})$라 두면 $y_B>1$에서 $t<0$이다. B와 같은 높이에서 $y=9^{-x}$와 만나는 점은
$9^{-x_D}=3^{-t}$이므로 $x_D=\frac{t}{2}$이다.

B가 A와 C 사이에 있고 $AB:BC=2:1$이므로 세로 좌표 차도 $2:1$이다. 따라서 $y_A=3y_B=3^{1-t}$. A가 $y=9^{-x}$ 위에 있어
$9^{-x_A}=3^{1-t}$, $x_A=\frac{t-1}{2}$.

이제 두 거리의 제곱을 비교한다.
$AB^2=(x_A-t)^2+(y_A-y_B)^2=\frac{(t+1)^2}{4}+4\cdot3^{-2t}$,
$AD^2=(x_D-x_A)^2+(y_B-y_A)^2=\frac14+4\cdot3^{-2t}$.
$AB=AD$이므로 $(t+1)^2=1$. $t=0,-2$ 중 $t<0$을 만족하는 값은 $t=-2$이다.

따라서 $A=(-\frac32,27)$, $B=(-2,9)$, $D=(-1,9)$. $BD=1$이고 A와 BD의 높이 차는 18이므로
$[\triangle ABD]=\frac12\cdot1\cdot18=9$. 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** \(B=(t,3^{-t})\)에서 \(D=(t/2,3^{-t})\), \(A=((t-1)/2,3^{1-t})\). \(AB=AD\)와 \(t<0\)에서 \(t=-2\); \(BD=1\), 높이 18이므로 넓이 9, ②. 실물 그림과 점의 좌우·상하 관계 일치.
- 그림 증거: `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q17.png` (시각 검토, blob `e7e0ed378450b686e54d29d84abd1ce1fa6b8091`); 보조 solutionImage: `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q17-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `객관식` / `4.5`; 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
기울기가 $-1$인 직선 $l$이 곡선 $y=\log_2 x$와 만나는 점을 $A(a, b)$, 곡선 $y=\log_4(x+10)$과 만나는 점을 $B(c, d)$라 하자. $\overline{AB} = 2\sqrt{2}$일 때, $a+c$의 값을 구하면? (단, $1 < a < c$) [4.5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 47
2. 48
3. 49
4. 50
5. 51
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
직선의 기울기가 $-1$이고 $1<a<c$이므로
$c-a=2$이다.

두 점은 같은 직선 위에 있어 $d=b-2$. 또
$b=\log_2a$, $d=\log_4(c+10)=\frac12\log_2(c+10)$이므로
$\frac12\log_2(c+10)=\log_2a-2$.

양변을 2배하고 로그의 성질을 적용하면
$\log_2(c+10)=2\log_2a-4=\log_2\frac{a^2}{16}$.
따라서 $c+10=\frac{a^2}{16}$. $c=a+2$를 대입하여
$a^2-16a-192=0$, $(a-24)(a+8)=0$.
$a>1$이므로 $a=24$, $c=26$.

따라서 $a+c=50$이고 정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** 두 교점을 잇는 직선의 기울기 \(-1\), \(c-a=2\), \(b-d=2\)를 연립하면 \(a=24,c=26\)이므로 \(a+c=50\), ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `단답형` / `4`; 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
방정식 $(\log_3 3x)(\log_9 27x) = 4$을 만족하는 모든 실수 $x$의 값을 구하시오. [4.0점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 별도 객관식 보기 없음)
````

- 원본 `answer`: `\frac{1}{243}, 3`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$u=\log_3x$라 두면
$\log_3(3x)=u+1$,
$\log_9(27x)=\frac{\log_3(27x)}2=\frac{u+3}{2}$이다.

따라서
$(u+1)\frac{u+3}{2}=4$
$(u+1)(u+3)=8$
$u^2+4u-5=0$
$(u-1)(u+5)=0$.

$u=1$ 또는 $u=-5$이므로
$x=3$ 또는 $x=3^{-5}=\frac1{243}$.
````

- **독립 판정·핵심 연결/검산:** \(u=\log_3(3x)\), \(\log_9(27x)=(u+2)/2\)로 두어 \(u(u+2)=8\); \(u=2,-4\)이므로 \(x=3,1/243\). 두 해 모두 \(x>0\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `단답형` / `4`; 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
실수 $k$에 대하여 함수
$$f(x) = \cos^2\left(x - \frac{3}{4}\pi\right) - \cos\left(x - \frac{\pi}{4}\right) + k$$
의 최댓값은 $4$, 최솟값은 $m$이다. $m$의 값을 구하시오. [4.0점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 별도 객관식 보기 없음)
````

- 원본 `answer`: `\frac74`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$t=x-\frac\pi4$라 두면
$\cos^2(x-\frac{3\pi}4)=\sin^2t$이고 $\cos(x-\frac\pi4)=\cos t$이다.

$u=\cos t$라 두어 $-1\le u\le1$을 쓰면
$f(x)=1-u^2-u+k= k+\frac54-(u+\frac12)^2$.

최댓값은 $u=-\frac12$일 때 $k+\frac54=4$이므로 $k=\frac{11}{4}$.
최솟값은 $(u+\frac12)^2$가 가장 큰 $\frac94$일 때이므로
$m=k+\frac54-\frac94=k-1=\frac74$.
````

- **독립 판정·핵심 연결/검산:** \(t=x-3\pi/4,\ u=\sin t\in[-1,1]\)로 두면 \(f=1-u^2+u+k\). 이 부분의 최댓값은 \(5/4\), 최솟값은 \(-1\). 최대 4로 \(k=11/4\), 따라서 최소 \(k-1=7/4\).
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q20-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q21 — UPGRADE

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `서술형` / `7`; 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
그림과 같이 $1$보다 큰 상수 $a$에 대하여 직선 $y=-x+5$가 두 곡선 $y=a^x, y=\log_a x$와 서로 제 $1$사분면에서 만나는 점을 각각 $A, B$라 하자. 함수 $y=a^x$의 그래프와 $y$축의 교점을 $C$, 함수 $y=\log_a x$의 그래프와 $x$축의 교점을 $D$라 할 때, 사각형 $ACDB$의 넓이가 $8$일 때, 다음 물음에 답하시오. (단, $O$는 원점이고, $a$는 상수이다.) [7.0점]

(1) $\overline{AB}$ 사이의 거리를 구하시오. [3점]

(2) 점 $A$의 좌표와 상수 $a$의 값을 각각 구하시오. [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 별도 객관식 보기 없음)
````

- 원본 `answer`: `(1) $3\sqrt2$, (2) $A=(1,4),\ a=4$`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$y=a^x$와 $y=\log_a x$는 서로 역함수이므로 $y=x$ 대칭이다. 직선 $y=-x+5$도 이 대칭에 그대로 놓인다.

따라서 $A=(p,5-p)$일 때 $B=(5-p,p)$. $C=(0,1)$, $D=(1,0)$를 차례로 놓고 신발끈 공식에 대입하면
$[ACDB]=\dfrac12|p-1+p+(5-p)^2-p^2|=|12-4p|$.

넓이가 8이므로 $|12-4p|=8$에서 $p=1$ 또는 $p=5$. A가 제1사분면이므로 $5-p>0$이고 $p=5$는 제외되어 $p=1$.

따라서 $A=(1,4)$이고 $a^1=4$이므로 $a=4$. 또한 $B=(4,1)$이어서
$AB=\sqrt{(4-1)^2+(1-4)^2}=3\sqrt2$.

(1) $3\sqrt2$, (2) $A=(1,4)$, $a=4$이다.
````

- **독립 판정·핵심 연결/검산:** 역함수 대칭으로 \(A=(p,5-p)\), \(B=(5-p,p)\), \(C=(0,1)\), \(D=(1,0)\). 평행한 두 밑변 \(AB,CD\) 사이 거리는 \(2\sqrt2\); 넓이 8은 \(p=1\), 따라서 \(A=(1,4),a=4,AB=3\sqrt2\). 원본의 신발끈식 대신 중등과정 도형 넓이 풀이로 보완.
- 그림 증거: `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q21.png` (시각 검토, blob `4b3ea167044eebbf553ec43bab079befce8550a4`); 보조 solutionImage: `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q21-solution.svg` (존재 검증)
- **UPGRADE 사유:** 계산/의도된 정답은 유지하되 학생 이해도, 원본 표기 혼용 또는 정의역 조건의 명시성을 보완할 필요가 있음. 초안은 아래에 완성하여 남김. 원본 정답키 미수정.

**학생용 교체 해설 초안**

**(1) 역함수 대칭으로 점을 정한다.** \(y=a^x\)와 \(y=\log_a x\)는 직선 \(y=x\)에 대하여 대칭이고, \(x+y=5\)도 이 대칭에서 변하지 않는다. \(A=(t,5-t)\)라 두면 \(B=(5-t,t)\), \(C=(0,1)\), \(D=(1,0)\)이다. 그림의 배치에서 \(A\)는 \(B\)의 왼쪽 위에 있으므로 \(0<t<5/2\).

**(2) 사다리꼴의 넓이를 구한다.** \(AB\)와 \(CD\)는 각각 직선 \(x+y=5\), \(x+y=1\) 위에 있으므로 평행하다. \(AB=\sqrt2(5-2t)\), \(CD=\sqrt2\), 두 직선의 거리는 \(\frac{|5-1|}{\sqrt{1^2+1^2}}=2\sqrt2\)이다. 따라서
\[
8=[ACDB]=\frac{\sqrt2(5-2t)+\sqrt2}{2}\cdot2\sqrt2=12-4t.
\]
그래서 \(t=1\)이고 \(A=(1,4)\), \(B=(4,1)\).

**(3) 값을 마무리한다.** \(A\)는 \(y=a^x\) 위에 있으므로 \(a^1=4\Rightarrow a=4\). \(AB=\sqrt{(4-1)^2+(1-4)^2}=3\sqrt2\).

**답:** (1) \(3\sqrt2\), (2) \(A=(1,4),\ a=4\).


### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `서술형` / `7`; 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y=a\cos bx$의 그래프를 $x$축의 방향으로 $\frac{\pi}{6}$만큼, $y$축의 방향으로 $2$만큼 평행이동한 그래프를 나타내는 함수를 $y=f(x)$라 하자. 함수 $f(x)$의 주기가 $8\pi$이고 최댓값이 $3$일 때, $f\left(\frac{3}{2}\pi\right)$의 값을 구하시오. (단, $a, b$는 양의 상수이다.) [7.0점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 별도 객관식 보기 없음)
````

- 원본 `answer`: `\frac52`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
그래프를 오른쪽으로 $\frac\pi6$만큼 옮기면
$f(x)=a\cos b(x-\frac\pi6)+2$이다.

주기가 $8\pi$이므로
$\frac{2\pi}{b}=8\pi$, $b=\frac14$.
최댓값은 $a+2=3$이고 a는 양수이므로 $a=1$.

따라서
$f(\frac32\pi)=\cos[\frac14(\frac32\pi-\frac16\pi)]+2$
$=\cos\frac\pi3+2=\frac52$.
````

- **독립 판정·핵심 연결/검산:** 코사인 곡선의 진폭 1, 위아래 이동 \(b=1/4\)와 위상 조건을 대입하면 \(f(3\pi/2)=5/2\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q23 — KEEP

- source ordinal/id: `23` / `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `5ffcfd024e38a2634e1b8eddf21ee38f26abfa20`
- 형식/배점: `서술형` / `7`; 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$2 \le a \le 100$인 자연수 $a$와 유리수 $b$에 대하여 집합
$$\left\{\log_a b \;\middle|\; a\text{는 자연수}, \frac{1}{a} \le b \le a^2\right\}$$
의 원소 중 유리수의 개수를 $f(a)$라 하자. $f(a) \ge 7$를 만족하는 $a$의 개수를 구하시오. [7.0점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 별도 객관식 보기 없음)
````

- 원본 `answer`: `12`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$a=\prod p_i^{e_i}$라 하고 $g=\gcd(e_1,e_2,\ldots)$라 하자.

$\log_a b=r$가 유리수이면 $b=a^r$도 유리수여야 한다. 기약분수 r의 분모는 모든 소인수 지수 $e_i$를 나누어야 하므로 r은 $g$의 정수배인 $\frac1g$ 간격의 값이다.

$\frac1a\le b\le a^2$는 밑 $a>1$에서
$-1\le r\le2$와 같다. 따라서 가능한 유리수 r의 개수는
$f(a)=2g-(-g)+1=3g+1$.

$f(a)\ge7$이려면 $g\ge2$이므로 a는 완전거듭제곱수여야 한다.
$2\le a\le100$의 제곱수는
$4,9,16,25,36,49,64,81,100$의 9개이고, 여기에 제곱수는 아닌 완전거듭제곱수 $8,27,32$를 더한다.

따라서 구하는 a의 개수는 $9+3=12$이다.
````

- **독립 판정·핵심 연결/검산:** 가능한 유리수 로그 값 개수 \(f(a)=3g+1\) (\(g\): 소인수 지수의 최대공약수). 조건 \(g\ge2\)인 \(4\le a\le100\)은 제곱수 9개와 비제곱 완전거듭제곱 \(8,27,32\) 세 개, 합 12.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

## 종료 검증 및 다음 단계

- 전수 범위: Q01–Q23; 총 23개, UNREAD 0. 각 문항의 원문/보기/정답/기존 해설과 독립 계산을 수록.
- 판정 합계: KEEP 22, UPGRADE 1, HOLD 0 (총 23).
- 학생용 개선 초안: Q21; 모두 본문 수록.
- 보류: NONE; 출고 전 원문·선지·해설·정답 합동 수정 필요.
- 실물 원본 그림 2개 판독, 보조 해설 그림 5개 원본 존재 확인. 최종 학생 화면/UI 렌더·통합 QA `NOT_RUN`.
- 본 문서는 worker branch 감사 기록이다. 실제 운영 자료로 출고·배포한 상태가 아니며, 잔여 HOLD는 다음 시험지 검토 진행을 막지 않는다.
