# 2023 23_복성고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2023`
- source: `archive/exams/original/high/h2/1mid/23_복성고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- course: `수학I` (파일명); `standardCourse` 누락 `0/22`, `category` 누락 `0/22`
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/23_복성고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `22` · actual question/answer/solution read: `22` · KEEP 21 · UPGRADE 0 · HOLD 1 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `Q15`
- 범위: 전 22문항의 원문 `content`·`choices`·`answer`·`solution` 및 참조 자료 검토. UPGRADE는 교체 가능한 학생용 해설 초안을 기록하고, HOLD는 수학적 충돌과 수정 권고를 기록한다. 원본 JS/그림/정답키/`main`은 수정하지 않음.

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


검토 방식: `23_복성고_1학기_중간_고2_수학I.js`의 실제 문제·보기·정답·기존 해설 22개 전수를 읽고, 방정식의 정의역·밑 및 진수·근 개수·이차함수 범위·삼각함수 부호·기하 도형 관계를 독립 검산했다. 객관식은 선지·정답 번호를 비교하고, 서답형은 수치를 직접 대조했다. 문제 이미지 1개는 모두 실제 시각 판독(원본 PNG 또는 SVG 렌더)을 수행했다. `solutionImage` 6개는 원격 원본 실파일·blob 증거를 확인했으며 **보조 해설 그림 전체의 시각 판독은 NOT_RUN**이다. `preflight.mjs`, Golden/Negative, UI 출고 게이트, SHA-256 영수증은 `NOT_RUN`이며 원본 재발행 아님.

## 문제·보조 해설 이미지 실물 증거

- Q09 `solutionImage` — `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q9-solution.svg` · Git blob `32f3bd6fb660679e15a7a0049e4fa0bf2bdaf547` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q11 `solutionImage` — `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q11-solution.svg` · Git blob `163e8db4349215fa2e499c611c3fccd2018b0f73` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q13 `solutionImage` — `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q13-solution-v2.svg` · Git blob `54b2c14a11e080984d15809d76e956c3a9e9e9d7` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q18 `solutionImage` — `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q18-solution.svg` · Git blob `c724d81cb224e43e088c04d11780ebd0918f3064` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q21 `image` — `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q21.png` · Git blob `3c25c00ec866841b599ed43c97c5e8f2669ad04c` · 실제 PNG/SVG 시각 판독 완료
- Q21 `solutionImage` — `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q21-solution-v2.svg` · Git blob `ca62be64ca2a63cf594599b3f1fbf34bd9b60dc6` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q22 `solutionImage` — `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q22-solution.svg` · Git blob `8fd93675482cc6313093a95b96d02e31e2196069` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `3.5`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
1. $4\sin\frac{\pi}{6}-\tan\frac{\pi}{4}$의 값은? [3.5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $1$
2. $2$
3. $3$
4. $4$
5. $5$
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
특수각의 값을 대입한다.
$\sin\frac{\pi}{6}=\frac12$, $\tan\frac{\pi}{4}=1$이므로
$4\sin\frac{\pi}{6}-\tan\frac{\pi}{4}=4\cdot\frac12-1=1$이다.
따라서 정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** \(4\sin(\pi/6)-\tan(\pi/4)=2-1=1\), ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `3.5`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
2. $\log_3 18 - \log_3 \frac{2}{3}$의 값은? [3.5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $1$
2. $2$
3. $3$
4. $4$
5. $5$
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
로그의 성질로 두 로그를 하나로 합친다.
$\log_3 18-\log_3\frac23=\log_3(18\div\frac23)=\log_3 27=3$이다.
따라서 정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** \(\log_3 18-\log_3(2/3)=\log_3 27=3\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `3.7`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
3. $(\sqrt[3]{36})^3 \div \sqrt{\sqrt{6^8}} \times 36^{0.25}$을 간단히 한 것은? [3.7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $1$
2. $6^{-\frac{1}{2}}$
3. $6^{-1}$
4. $6^{\frac{1}{2}}$
5. $6^{\frac{3}{2}}$
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
각 항을 밑이 $6$인 거듭제곱으로 나타낸다.
$(\sqrt[3]{36})^3=36$이고 $\sqrt{\sqrt{6^8}}=\sqrt{6^4}=36$이다.
또 $36^{0.25}=36^{\frac{1}{4}}=(6^2)^{\frac{1}{4}}=6^{\frac{1}{2}}$이다.
따라서 전체 식은 $36\div36\times6^{\frac{1}{2}}=\sqrt6$이고 정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** \(36^1/(6^2)\cdot36^{1/4}=36^{1/4}=\sqrt6\)으로 지수의 합·차를 계산, ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `3.7`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
4. $\tan\theta = 5$일 때, $\frac{1}{\cos^2\theta}$의 값은? [3.7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{1}{26}$
2. $\frac{1}{25}$
3. $\frac{1}{5}$
4. $25$
5. $26$
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$1+\tan^2\theta=\frac1{\cos^2\theta}$를 쓴다.
$\tan\theta=5$이므로 $\frac1{\cos^2\theta}=1+5^2=26$이다.
따라서 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** \(\tan\theta=5\)에서 \(1+\tan^2\theta=\sec^2\theta=26\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `3.9`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
5. 다음 중 옳지 않은 것은? (단, 거듭제곱근은 복소수 범위에서 모두 구하며, 서로 다른 근만 센다.) [3.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $-27$의 세제곱근은 $1$개다.
2. $25$의 제곱근은 $5$, $-5$이다.
3. $-16$의 네제곱근 중 실수인 것은 없다.
4. $(-3)^3$의 세제곱근 중 실수인 것은 $-3$이다.
5. $\sqrt{81}$의 네제곱근 중 실수인 것은 $\pm\sqrt{3}$이다.
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
거듭제곱근은 서로 다른 복소수 근 전체로 센다.
① $z^3=-27$에서
$z^3+27=(z+3)(z^2-3z+9)=0$이다.
첫째 인수에서 $z=-3$이고, 둘째 인수의 판별식은 $(-3)^2-4\cdot1\cdot9=-27<0$이므로 서로 다른 두 비실수 복소근이 더 있다. 둘째 인수에 $z=-3$을 넣으면 $27\ne0$이므로 두 근은 $-3$과도 다르다. 따라서 $-27$의 세제곱근은 서로 다른 세 개여서 “1개”라는 ①은 옳지 않다.
② $25$의 제곱근은 $5,-5$이다.
③ 실수 $t$이면 $t^4\ge0$이므로 $t^4=-16$은 실근이 없다.
④ $(-3)^3=-27$의 세제곱근 중 실수인 것은 $-3$이다.
⑤ $\sqrt{81}=9$이고 $t^4=9$의 실근은 $t=\pm\sqrt3$이다.
따라서 옳지 않은 것은 ①이고 정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** \(-27\)의 세제곱근은 복소수 전체에서 서로 다른 세 근, 실수 근은 하나라는 조건을 나누어 참·거짓을 판별; 오답 진술은 ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `3.9`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
6. 함수 $y=2^x$의 그래프를 $x$축의 방향으로 $-2$만큼, $y$축의 방향으로 $2$만큼 평행이동한 그래프가 점 $(1,\, a)$를 지날 때, 상수 $a$의 값은? [3.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $2$
2. $4$
3. $6$
4. $8$
5. $10$
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
왼쪽으로 $2$, 위로 $2$만큼 옮긴 그래프는 $y=2^{x+2}+2$이다.
점 $(1,a)$를 대입하면 $a=2^{1+2}+2=10$이다.
따라서 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** \(2^x\)의 왼쪽 2, 위쪽 2 이동을 적용하면 \(f(1)=2^3+2=10\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `4`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
7. 다음 로그함수 $y=\log_3(x-3)+2$에 대한 설명으로 옳은 것은? [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 정의역은 $\{x|x<3\}$이다.
2. 그래프는 점 $(4,\, 3)$을 지난다.
3. 그래프의 점근선은 직선 $x=3$이다.
4. $x$값이 증가할 때, $y$값은 감소하는 함수이다.
5. 그래프는 $y=-\log_3 x$의 그래프를 평행이동할 때와 겹쳐진다.
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
진수 조건에서 정의역은 $x>3$이다. 밑 $3>1$이므로 로그함수는 증가하고 점근선은 $x=3$이다.
$x=4$일 때 함수값은 $2$이므로 $(4,3)$을 지나지 않는다.
옳은 설명은 점근선에 관한 ③이고 정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** \(\log_3(x-3)+2\)의 진수 조건 \(x>3\), 세로 점근선 \(x=3\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `4`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
8. 실수 $x,\, y$에 대하여 $3^x=16,\, 24^y=64$일 때, $\frac{4}{x}-\frac{6}{y}$의 값은? [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $-5$
2. $-3$
3. $-1$
4. $1$
5. $3$
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$x=\log_3 16$이므로 $\frac4x=\log_2 3$이다.
$y=\log_{24}64=\frac6{3+\log_2 3}$이므로 $\frac6y=3+\log_2 3$이다.
따라서 $\frac4x-\frac6y=-3$이고 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** \(3^x=16,\ 24^y=64\)를 로그로 변환해 분모를 정리하면 \(4/x-6/y=-3\), ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `4.1`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
9. 호의 길이가 $4\pi\,\text{cm}$이고 넓이가 $12\pi\,\text{cm}^2$인 부채꼴의 중심각의 크기는? [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{\pi}{6}$
2. $\frac{\pi}{4}$
3. $\frac{\pi}{3}$
4. $\frac{2\pi}{3}$
5. $\frac{5\pi}{6}$
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
반지름 $r$, 중심각 $\theta$라 하면 $r\theta=4\pi$, $\frac12r^2\theta=12\pi$이다.
넓이를 호의 길이로 나누면 $\frac{r}{2}=3$이므로 $r=6$이다.
따라서 $\theta=4\pi/6=2\pi/3$이고 정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** 호의 길이 4π, 부채꼴 넓이 12π에서 \(r=2S/l=6\), 중심각 \(l/r=2\pi/3\), ④.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q9-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `4.1`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
10. 이차방정식 $x^2-10x+4=0$의 두 근이 각각 $\log_3 a,\, \log_3 b$일 때, $\log_a b+\log_b a$의 값은? (단, $a,\, b$는 $1$이 아닌 양수) [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $21$
2. $\frac{43}{2}$
3. $22$
4. $\frac{45}{2}$
5. $23$
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
두 근을 $u=\log_3a$, $v=\log_3b$라 하면 $u+v=10$, $uv=4$이다.
$\log_ab+\log_ba=\frac vu+\frac uv=\frac{u^2+v^2}{uv}$이다.
$u^2+v^2=100-8=92$이므로 값은 $\frac{92}{4}=23$이고 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** 이차방정식 두 근 \(u,v\)의 합 10, 곱 4일 때 \(\log_a b+\log_b a=u/v+v/u=(10^2-2\cdot4)/4=23\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `4.3`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
11. $\frac{3}{2}\pi < \theta < 2\pi$일 때, 옳은 것만을 <보기>에서 있는 대로 고른 것은? [4.3점]

ㄱ. $\sin\theta < \cos\theta$
ㄴ. $\cos\frac{\theta}{2} > 0$
ㄷ. $\tan\theta-\cos\theta < 0$
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. ㄱ
2. ㄱ, ㄴ
3. ㄱ, ㄷ
4. ㄴ, ㄷ
5. ㄱ, ㄴ, ㄷ
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$3\pi/2<\theta<2\pi$이므로 제4사분면이다. 이에 따라 $\sin\theta<\cos\theta$라서 ㄱ은 참이다.
$3\pi/4<\theta/2<\pi$이므로 $\cos(\theta/2)<0$라서 ㄴ은 거짓이다.
제4사분면에서 $\tan\theta<0<\cos\theta$이므로 ㄷ은 참이다. 정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** 제4사분면에서 \(\sin\theta<\cos\theta\) 참, 반각의 코사인은 양수, \(\tan\theta-\cos\theta<0\) 참; ㄱ·ㄷ, ③.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q11-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `4.3`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
12. 실수 $x,\, y$에 대하여 $2^x+2^y=17$, $2^{\frac{x}{2}}+2^{\frac{y}{2}}=5$일 때, $x+y$의 값은? [4.3점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $2$
2. $3$
3. $4$
4. $5$
5. $6$
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
치환 $u=2^{\frac{x}{2}}$, $v=2^{\frac{y}{2}}$를 두면 $u,v>0$이다.
주어진 조건은 $u^2+v^2=17$, $u+v=5$이다.
$(u+v)^2=u^2+2uv+v^2$이므로 $25=17+2uv$에서 $uv=4$이다.
또 $uv=2^{\frac{x+y}{2}}$이므로 $2^{\frac{x+y}{2}}=4=2^2$이다.
따라서 $x+y=4$이다.
실제로 $u,v$는 $t^2-5t+4=0$, 즉 $(t-1)(t-4)=0$의 두 양수 $1,4$가 될 수 있어 조건은 모순되지 않는다.
따라서 정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** \(u=2^{x/2},v=2^{y/2}\)라 놓으면 \(u+v=5,u^2+v^2=17\), \(uv=4\), \(2^{(x+y)/2}=4\)이므로 \(x+y=4\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `4.5`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
13. 두 함수 $y=2^x,\, y=8\times 2^x$의 그래프와 두 직선 $y=1,\, y=4$로 둘러싸인 부분의 넓이는? [4.5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $6$
2. $9$
3. $12$
4. $15$
5. $18$
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$y$를 고정하면 두 곡선에서 $x=\log_2y$와 $x=\log_2y-3$이다.
따라서 가로 길이는 항상 $3$이고, $y=1$부터 $y=4$까지 세로 길이도 $3$이다.
넓이는 $3\times3=9$이므로 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** 두 지수 곡선은 수평 방향으로 3만큼 차이, \(y=1\)부터 4까지의 높이 3을 곱한 넓이는 9, ②.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q13-solution-v2.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `4.5`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
14. 음원에서 떨어진 거리가 $d_1\,\text{m},\, d_2\,\text{m}$인 두 지점에서 소리의 크기를 각각 $S_1\,\text{dB},\, S_2\,\text{dB}$이라고 하면
$$S_2=S_1+20\log\frac{d_1}{d_2}$$
인 관계가 성립한다고 한다. 스피커에서 $5\,\text{m}$ 떨어진 곳의 소리의 크기가 $80\,\text{dB}$이라고 할 때, 이 스피커에서 $100\,\text{m}$ 떨어진 곳의 소리의 크기는? (단, $\log 5 = 0.7$로 계산한다.) [4.5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $52\,\text{dB}$
2. $54\,\text{dB}$
3. $56\,\text{dB}$
4. $58\,\text{dB}$
5. $60\,\text{dB}$
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$S_2=80+20\log(\frac{5}{100})=80+20(\log5-2)$이다.
$\log5=0.7$을 대입하면 $S_2=80+20(0.7-2)=54$이다.
따라서 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** \(80+20\log(5/100)=80+20(\log5-2)\)를 주어진 근삿값으로 계산하면 약 54dB, ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q15 — HOLD

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `4.7`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
15. 어떤 태블릿의 가격은 매년 전년에 비해 $10\%$씩 떨어진다고 한다. 2023년에 $100$만원인 태블릿의 가격이 처음으로 $30$만원 이하가 되는 해는? (단, $\log 3 = 0.48$로 계산한다.) [4.7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $2035$년
2. $2036$년
3. $2037$년
4. $2038$년
5. $2039$년
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
2023년부터 $n$년 뒤 가격은 $100(0.9)^n$만원이다.
$100(0.9)^n\le30$에서 $(0.9)^n\le0.3$이다.
$\log0.9=2\log3-1=-0.04$, $\log0.3=\log3-1=-0.52$이므로
$n\ge(-0.52)/(-0.04)=13$이다. 첫 해는 $2023+13=2036$년이며 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** **HOLD:** 2023년 100만원에서 매년 정확히 0.9배이면 \(0.9^{11}=0.313810596>0.3\), \(0.9^{12}=0.282429536\le0.3\)로 최초 도달은 **2035년**. 원본의 \(\log3=0.48\) 근사 사용 시 \(\log0.9=-0.04,\ \log0.3=-0.52\)여서 \(n\ge13\), **2036년(원본 ②)**. 정수 경계 충돌로 정답 유일성이 보장되지 않음.
- 그림 증거: 별도 문제 그림 없음
- **HOLD 사유:** 원문 문항의 수학적 조건과 원본 정답 사이에 실제 충돌이 있어 자동 출고 불가. 기존 정답키는 감사 증거로 보존하며 출제자 수정 후 재감사 필요.

**보류 근거 및 수정 권고**

- 원본 정답 `②(2036년)`을 **보존**하되 수학적 조건과 충돌하므로 출고 **HOLD**.
- 2023년으로부터 \(n\)년 후는 \(100(0.9)^n\)만원. \(n=11\)에는 \(31.3810596\)만원 \(>30\), \(n=12\)에는 \(28.2429536\)만원 \(\le30\). ‘처음’은 **2035년**이다.
- 제공된 근사 \(\log3=0.48\)로 상용로그를 계산하면 \(\log0.9=-0.04,\ \log0.3=-0.52\), 따라서 \(n\ge13\)이라는 **근사결론 2036년**이 나온다. 근삿값을 써도 문항의 실제 최소 자연수와 달라지는 경계 민감 문제이다.
- **수정 권고:** (a) 지시된 근삿값의 정밀도를 높여 두 계산 결과가 같게 만들거나, (b) 값·보기·문구를 재설계한 후 정답/해설/문항을 함께 검수. 승인 전 원본 JS/정답키는 수정하지 않는다.


### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `4.7`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
16. $\log_3 8 \times \log_2 \frac{a}{\sqrt[3]{3}}$의 값이 $4$의 배수가 되기 위한 가장 작은 자연수 $a$의 값은? [4.7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $9$
2. $18$
3. $27$
4. $36$
5. $45$
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
밑변환을 쓰면
$\log_3 8\times\log_2\frac{a}{\sqrt[3]{3}}=3\log_3 2\left(\log_2a-\frac13\log_2 3\right)=3\log_3a-1$이다.
이 값이 $4$의 배수라고 하고 $3\log_3a-1=4k$ ($k\in\mathbb Z$)라 두면
$a=3^{\frac{4k+1}{3}}$이다. $a\ge1$이므로 $4k+1\ge0$이다. 또 $a^3=3^{4k+1}$이므로 $a$는 $3$ 이외의 소인수를 가질 수 없고, 세제곱수에서 소인수 $3$의 지수는 $3$의 배수이므로 $4k+1$도 $3$의 배수이다.
따라서 $n=\dfrac{4k+1}{3}$은 음이 아닌 정수이고 $a=3^n$이다. 이때 주어진 값은 $3n-1$이다.
$n=0,1,2,3$을 작은 것부터 대입하면 그 값은 각각 $-1,2,5,8$이므로, 처음으로 $4$의 배수가 되는 것은 $n=3$일 때이다. $3^n$은 $n$이 커질수록 증가하므로 가장 작은 자연수는 $a=3^3=27$이다. 정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** \(\log_3 8\log_2(a/\sqrt[3]3)=3\log_3 a-1\)을 4의 배수로 만드는 최소 자연수 \(a=27\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `4.8`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
17. $x>1,\, y>1$이고 $3\log_x y-\log_y x+2=0$일 때, $4y^3-x^2$의 최댓값은? [4.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $1$
2. $2$
3. $3$
4. $4$
5. $5$
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$t=\log_xy>0$라 하면 $\log_yx=\frac{1}{t}$이다.
$3t-\frac{1}{t}+2=0$에서 $3t^2+2t-1=(3t-1)(t+1)=0$이므로 $t=\frac{1}{3}$이다.
따라서 $x=y^3$이고 $4y^3-x^2=4x-x^2=4-(x-2)^2\le4$이다.
$x=2$, $y=\sqrt[3]2$에서 등호가 성립하므로 최댓값은 $4$, 정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** \(\log_x y=1/3\)이므로 \(x=y^3\)로 치환; 최대치 \(4x-x^2=4\)는 \(x=2\)에서 달성, ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `4.9`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
18. 두 함수 $f(x)=2^x-1$과 $g(x)=4^{-x+k}-1$에 대하여 정의역이 $\{x|-1\le x\le 1\}$일 때, 함수 $(g\circ f)(x)$의 최솟값이 $4$이다. 이때의 최댓값은? [4.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $31$
2. $33$
3. $35$
4. $37$
5. $39$
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$(g\circ f)(x)=4^{k+1-2^x}-1$이다. $2^x$가 증가하므로 합성함수는 $[-1,1]$에서 감소한다.
최솟값은 $x=1$에서 얻어 $4^{k-1}-1=4$, 즉 $4^k=20$이다.
최댓값은 $x=-1$에서 얻어 $4^{k+\frac{1}{2}}-1=2\cdot4^k-1=39$이다.
따라서 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** \(g(f(x))=4^{k+1-2^x}-1\)은 \(x\in[-1,1]\)에서 감소. \(x=1\) 최솟값 4로 \(4^k=20\); \(x=-1\) 최댓값 39, ⑤.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q18-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `객관식` / `4.9`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
19. 두 실수 $a,\, b$에 대하여 $a^2 < a < b$가 성립할 때, 세 수 $1,\, a^a,\, a^b$의 대소관계를 옳게 나타낸 것은? [4.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $a^b < a^a < 1$
2. $a^a < a^b < 1$
3. $a^a < 1 < a^b$
4. $a^b < 1 < a^a$
5. $1 < a^a < a^b$
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$a^2<a$에서 $0<a<1$이고 $a<b$이다.
밑이 $0$과 $1$ 사이인 지수함수는 감소하므로 $a^b<a^a$이다.
또 $a>0$이므로 $a^a<1$이다. 따라서 $a^b<a^a<1$이고 정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** \(a^2<a<b\)가 가능하려면 \(0<a<1\). 지수의 증가·감소 반전에 유의하면 \(a^b<a^a<1\), ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `서술형` / `6`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
[서술형 1] $\theta$가 제2사분면의 각이고 $\sin\theta+\cos\theta=\frac{1}{5}$일 때, $\sin^3\theta-\cos^3\theta$의 값을 구하고, 그 과정을 서술하시오. [6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 별도 객관식 보기 없음)
````

- 원본 `answer`: `91/125`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$s=\sin\theta$, $c=\cos\theta$라 두면 $s+c=\frac{1}{5}$이다.
$(s+c)^2=1+2sc$에서 $sc=-\frac{12}{25}$이다.
$(s-c)^2=1-2sc=\frac{49}{25}$이고 제2사분면이므로 $s-c=\frac{7}{5}$이다.
$s^3-c^3=(s-c)(s^2+sc+c^2)=\frac75(1-\frac{12}{25})=\frac{91}{125}$이다.
````

- **독립 판정·핵심 연결/검산:** \(\sin\theta+\cos\theta=1/5\)의 제곱으로 \(2\sin\theta\cos\theta=-24/25\), 제4사분면의 부호로 \(\sin\theta-\cos\theta=-7/5\); 세제곱 차 \(91/125\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `서술형` / `6`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
[서술형 2] 그림과 같이 직선 $y=\frac{1}{2}x+1$과 두 점 $(-4,\, 0),\, (4,\, 0)$을 지나는 이차함수 $y=f(x)$의 그래프가 제1사분면에서 만나는 점의 $x$좌표가 $3$이다. 부등식
$$\log_2\{f(x)-1\} \ge \log_2 x - 1$$
을 만족하는 모든 정수 $x$를 구하고, 그 과정을 서술하시오. [6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 별도 객관식 보기 없음)
````

- 원본 `answer`: `1,2,3`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
근이 $-4,4$인 이차함수는 $f(x)=a(16-x^2)$이다.
$x=3$에서 직선과 만나므로 $f(3)=\frac32+1=\frac52$이고 $7a=\frac52$, 따라서 $a=\frac5{14}$이다.
로그의 진수 조건은 $x>0$, $f(x)-1>0$이다. 밑 $2>1$이고 $\log_2x-1=\log_2\frac{x}{2}$이므로
$\log_2\{f(x)-1\}\ge\log_2\frac{x}{2}\iff f(x)-1\ge\frac{x}{2}$이다.
$x>0$이면 오른쪽이 양수이므로 이 부등식은 $f(x)-1>0$도 보장한다.
$f(x)-1\ge\frac{x}{2}$에 대입하면
$\frac5{14}(16-x^2)-1\ge\frac{x}{2}$
$\iff 66-5x^2-7x\ge0$
$\iff 5x^2+7x-66\le0$
$\iff (5x+22)(x-3)\le0$이다.
따라서 $-\frac{22}{5}\le x\le3$이다. 여기에 $x>0$을 합치면 $0<x\le3$이고, 정수해는 $1,2,3$이다.
````

- **독립 판정·핵심 연결/검산:** 포물선의 두 영점 \(-4,4\) 및 \(x=3\)에서 직선 \(y=x/2+1\)과의 교점을 이용하면 \(f(x)=5(16-x^2)/14\). 밑/진수 조건과 부등식을 풀어 \(0<x\le3\); 정수 \(1,2,3\), 3개. 문제 그림과 좌표를 대조함.
- 그림 증거: `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q21.png` (시각 검토, blob `3c25c00ec866841b599ed43c97c5e8f2669ad04c`); 보조 solutionImage: `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q21-solution-v2.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `8b47e3cde5352fdfc906632729aa50d1de98ea5e`
- 형식/배점: `서술형` / `8`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
[서술형 3] 부등식 $\log_{|x+2|}\left(x+\frac{11}{4}\right)\le 2$를 만족시키는 실수 $x$값의 범위를 구하고, 그 과정을 서술하시오. [8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 별도 객관식 보기 없음)
````

- 원본 `answer`: `[-5/2,-2)∪(-2,-1)∪[-1/2,∞)`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
진수 조건은 $x>-\frac{11}{4}$이다. $x<-2$에서는 $0<|x+2|<1$이므로 로그함수가 감소하여 $x+11/4\ge(x+2)^2$가 필요하다.
$-\frac{11}{4}<x<-2$에서 $t=-(x+2)$이면 $0<t<3/4$, 진수는 $3/4-t$이다. $3/4-t\ge t^2$에서 $t^2+t-3/4\le0$, 즉 $0<t\le1/2$이다. 따라서 $-5/2\le x<-2$가 해이다.
$-2<x<-1$에서는 밑 $x+2$가 $0$과 $1$ 사이이므로 $x+11/4\ge(x+2)^2$이다. $t=x+2\in(0,1)$이면 $t+3/4\ge t^2$가 항상 성립하므로 전 구간이 해이다.
$x>-1$에서는 밑이 $1$보다 크므로 $x+11/4\le(x+2)^2$이다. 정리하면 $(x+\frac{5}{2})(x+\frac{1}{2})\ge0$이고 $x>-1$에서 $x\ge-\frac{1}{2}$이다.
따라서 해는 $[-\frac{5}{2},-2)\cup(-2,-1)\cup[-\frac{1}{2},\infty)$이다.
````

- **독립 판정·핵심 연결/검산:** 밑 \(|x+2|\)는 0이거나 1이면 불가, 진수 \(x+11/4>0\). 밑의 크기에 따라 부등호 방향을 나누면 \([-5/2,-2)\cup(-2,-1)\cup[-1/2,\infty)\). 끝점 \(-2,-1\)은 밑 조건으로 빠짐.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q22-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

## 종료 검증 및 다음 단계

- 전수 범위: Q01–Q22; 총 22개, UNREAD 0. 각 문항의 원문/보기/정답/기존 해설과 독립 계산을 수록.
- 판정 합계: KEEP 21, UPGRADE 0, HOLD 1 (총 22).
- 학생용 개선 초안: NONE; 모두 본문 수록.
- 보류: Q15; 출고 전 원문·선지·해설·정답 합동 수정 필요.
- 실물 원본 그림 1개 판독, 보조 해설 그림 6개 원본 존재 확인. 최종 학생 화면/UI 렌더·통합 QA `NOT_RUN`.
- 본 문서는 worker branch 감사 기록이다. 실제 운영 자료로 출고·배포한 상태가 아니며, 잔여 HOLD는 다음 시험지 검토 진행을 막지 않는다.
