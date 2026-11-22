# 2023 23_한영고_1학기_중간_고2_대수.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2023`
- source: `archive/exams/original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `74a6321713d8689d53e3f998b7ca7e054511f108`
- standardCourse: `대수`; `standardCourse` 누락 0/21, `category` 누락 0/21, `questionType` 누락·공란 21/21
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/23_한영고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `21` · actual question/answer/solution read: `21` · KEEP 20 · UPGRADE 0 · HOLD 1 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `Q13`
- 범위: 원본 JS에 수록된 21문항의 `content`·`choices`·`answer`·`solution` 전수 감사. UPGRADE는 학생용 완성 풀이, HOLD는 수학적/시각적 출제 결손의 근거와 수정 권고를 기록함. 원본 JS/PNG/SVG/정답키/`main`은 변경하지 않음.

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


검토 방식: 소스의 실제 문제·보기·정답·기존 해설 21개 전수를 읽고, 지수·로그 정의역과 밑 조건, 부등식의 끝점, 자연수 개수, 근호 실근, 기하 거리·넓이, 삼각함수 부호·주기를 독립 계산했다. 문제 원본 PNG/SVG 1개는 모두 실물 시각 판독했으며, 보조 `solutionImage` 7개는 Git blob 실파일 존재를 확인했다. 단, Q13의 보조 해설 SVG는 문제 이미지 누락을 판정하기 위해 실제 렌더·판독했다. 학생 최종 렌더·보조 그림 전수 시각 검수·`preflight.mjs`·Golden/Negative·운영 출고·SHA-256 영수증은 `NOT_RUN`.

메타데이터 주의: 비어 있는 `standardCourse`/`category`/`questionType`은 원본 공란을 그대로 `NOT_PRESENT`로 기록했다. 파일명과 표준 단원키는 참조 단서이지 원본 키 값을 임의 보충하지 않는다.

## 문제·보조 해설 이미지 원격 실물 증거

- Q03 `solutionImage` — `archive/assets/images/23_한영고_1학기_중간_고2_대수/q3-solution-v2.svg` · Git blob `4f0f211f5313c363afacc245a504b36d3dbd8875` · 실파일/blob 확인, 시각 판독 NOT_RUN
- Q09 `image` — `archive/assets/images/23_한영고_1학기_중간_고2_대수/q9.png` · Git blob `8d69ff81cd7dbb12a430fc8dcade8760886662e0` · 실제 PNG/SVG 시각 판독 완료
- Q09 `solutionImage` — `archive/assets/images/23_한영고_1학기_중간_고2_대수/q9-solution.svg` · Git blob `2916f2de461e912842fdbae4c7c49e73ae5460d6` · 실파일/blob 확인, 시각 판독 NOT_RUN
- Q11 `solutionImage` — `archive/assets/images/23_한영고_1학기_중간_고2_대수/q11-solution.svg` · Git blob `268d7f72b0cfdb33c61faa9d015ee3df21115d86` · 실파일/blob 확인, 시각 판독 NOT_RUN
- Q12 `solutionImage` — `archive/assets/images/23_한영고_1학기_중간_고2_대수/q12-solution-v2.svg` · Git blob `9f4ae00340c452602fea3bdd5509c93ead07dc5f` · 실파일/blob 확인, 시각 판독 NOT_RUN
- Q13 `solutionImage` — `archive/assets/images/23_한영고_1학기_중간_고2_대수/q13-solution.svg` · Git blob `c5cd592558ac0512bd3e1eea2f5cd96bd51c240f` · 실제 SVG 렌더·판독 완료(문제 그림 아님)
- Q14 `solutionImage` — `archive/assets/images/23_한영고_1학기_중간_고2_대수/q14-solution.svg` · Git blob `df13c2003d7463bd323bf55d67729bd888afa41b` · 실파일/blob 확인, 시각 판독 NOT_RUN
- Q21 `solutionImage` — `archive/assets/images/23_한영고_1학기_중간_고2_대수/q21-solution.svg` · Git blob `70ae8608a185dd3804a29be001b68bb5f4f612f7` · 실파일/blob 확인, 시각 판독 NOT_RUN

**Q13 결손 비교:** 문제 본문/`image`에 어떠한 그래프도 없고, `solutionImage`만 해설용 그래프를 제공함. 학생이 문제를 풀 때 필요한 데이터가 미노출 상태이므로 판정 `HOLD`(Q13).

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `지수법칙` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
$\sqrt[3]{27} \times \sqrt[6]{64}$ 의 값은? [4.0점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 6
2. 12
3. 18
4. 24
5. 48
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 거듭제곱근을 유리수 지수 형태로 변환하여 지수 법칙을 적용함.\n$i) 각 항의 밑을 소인수분해하여 정리$\n$\sqrt[3]{27} = (3^3)^{\frac{1}{3}} = 3^{3 \cdot \frac{1}{3}} = 3^1 = 3$\n$\sqrt[6]{64} = (2^6)^{\frac{1}{6}} = 2^{6 \cdot \frac{1}{6}} = 2^1 = 2$\n$ii) 두 식의 곱 계산$\n$\implies 3 \times 2 = 6$\n$\therefore 6$
````

- **독립 판정·핵심 연결/검산:** \(\sqrt[3]{27}=3,\sqrt[6]{64}=2\)이므로 곱 6, ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `로그의 정의` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
$\log_{a} 4 = 2, \log_{3} b = -1$ 일 때, $\frac{a}{b}$ 의 값은? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 3
2. 6
3. 9
4. 12
5. 15
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 로그의 정의($\log_a N = k \iff a^k = N$)를 사용하여 미지수를 구함.\n$i)  a  의 값 구하기$\n$\log_a 4 = 2 \implies a^2 = 4$\n$\because a$는 로그의 밑이므로 $a>0$ 이고 $a \neq 1$ 임.\n$\therefore a = 2$\n$ii)  b  의 값 구하기$\n$\log_3 b = -1 \implies b = 3^{-1} = \frac{1}{3}$\n$iii) 최종 비율 계산$\n$\frac{a}{b} = \frac{2}{\frac{1}{3}} = 2 \times 3 = 6$\n$\therefore 6$
````

- **독립 판정·핵심 연결/검산:** \(\log_a4=2\)에서 밑 조건으로 \(a=2\), \(\log_3b=-1\)에서 \(b=1/3\), \(a/b=6\), ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `로그함수의 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y = \log_{\frac{1}{3}}(x-2)-1$ 에 대한 설명으로 옳지 않은 것은? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 정의역은 $\{x|x>2\}$이다.
2. 그래프의 점근선은 $x=2$이다.
3. 그래프는 점 $(3, -1)$을 지난다.
4. $x$값이 증가하면 $y$값은 감소한다.
5. $y = \log_{3}x$ 그래프를 평행이동하면 겹쳐진다.
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 로그함수의 밑의 범위에 따른 증감 상태와 평행이동의 조건을 분석함.\n① 진수 조건: $x-2 > 0 \implies x > 2$ (참)\n② 점근선: 진수가 $0$이 되는 $x-2 = 0 \implies x = 2$ (참)\n③ 점 대입: $x=3$ 이면 $y = \log_{\frac{1}{3}}(3-2)-1 = \log_{\frac{1}{3}}1 - 1 = 0 - 1 = -1$ (참)\n④ 밑 분석: 밑 $a = \frac{1}{3}$ 이며 $0 < a < 1$ 이므로 감소함수임. (참)\n⑤ 평행이동 조건: $y = \log_3 x$ 의 밑은 $3$이고, 주어진 함수의 밑은 $\frac{1}{3}$임.\n$\because$ 밑이 서로 다르면 평행이동만으로 겹칠 수 없으며, 대칭이동($y$축 대칭 등)이 수반되어야 함. (거짓)\n$\therefore$ ⑤
````

- **독립 판정·핵심 연결/검산:** \(0<1/3<1\)이라 그래프 감소; 정의역 \(x>2\), 점근선 \(x=2\), 점 \((3,-1)\) 확인. \(y=\log_3x\)와 평행이동만으로 합치지 못하므로 ⑤.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_한영고_1학기_중간_고2_대수/q3-solution-v2.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `호도법과 육십분법` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
다음 중 옳지 않은 것은? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $45^{\circ} = \frac{\pi}{4}$
2. $-135^{\circ} = -\frac{3}{4}\pi$
3. $-\frac{2}{3}\pi = -120^{\circ}$
4. $\frac{9}{5}\pi = 320^{\circ}$
5. $\frac{11}{6}\pi = 330^{\circ}$
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> $180^{\circ} = \pi  rad$ 의 관계를 이용하여 각 단위를 환산함.\n④ $\frac{9}{5}\pi$ 를 육십분법으로 변환:\n$\implies \frac{9}{5} \times 180^{\circ} = 9 \times 36^{\circ} = 324^{\circ}$\n주어진 $320^{\circ}$ 와 일치하지 않음.\n$\therefore$ ④
````

- **독립 판정·핵심 연결/검산:** \((9/5)\pi\times180/\pi=324^\circ\)로 선택지의 \(320^\circ\)가 틀린 ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `지수법칙의 응용` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
실수 $x$에 대하여 $\frac{a^x - a^{-x}}{a^x + a^{-x}} = \frac{3}{5}$ 일 때, $a^{4x}$ 의 값은? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 4
2. 9
3. 16
4. 25
5. 36
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 분자·분모에 $a^x$를 곱하여 $a^{2x}$ 에 대한 관계식으로 유도함.\n$i) 식의 변형$\n$\frac{a^x(a^x - a^{-x})}{a^x(a^x + a^{-x})} = \frac{3}{5} \implies \frac{a^{2x} - 1}{a^{2x} + 1} = \frac{3}{5}$\n$ii)  a^{2x}  의 값 계산$\n$5(a^{2x} - 1) = 3(a^{2x} + 1)$\n$5a^{2x} - 5 = 3a^{2x} + 3 \implies 2a^{2x} = 8 \implies a^{2x} = 4$\n$iii) 최종 목표 값 도출$\n$a^{4x} = (a^{2x})^2 = 4^2 = 16$\n$\therefore 16$
````

- **독립 판정·핵심 연결/검산:** \(t=a^{2x}>0\)에서 \((t-1)/(t+1)=3/5\Rightarrow t=4\), \(a^{4x}=t^2=16\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `로그의 성질과 상용로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
$\log 2 = a, \log 3 = b$ 일 때, $\log_{6} 50$ 을 $a, b$에 대한 식으로 나타내면? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{1-a}{a+b}$
2. $\frac{1+a}{a-b}$
3. $\frac{2-a}{a+b}$
4. $\frac{2-a}{a-b}$
5. $\frac{2+a}{a-b}$
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 밑 변환 공식을 사용하여 주어진 상용로그의 밑($10$)으로 통일함.\n$i) 밑 변환 공식 적용$\n$\log_6 50 = \frac{\log 50}{\log 6}$\n$ii) 진수 분해$\n$분자:  \log 50 = \log(\frac{100}{2}) = \log 100 - \log 2 = 2 - a$\n$분모:  \log 6 = \log(2 \times 3) = \log 2 + \log 3 = a + b$\n$iii) 식의 결합$\n$\implies \frac{2 - a}{a + b}$\n$\therefore$ ③
````

- **독립 판정·핵심 연결/검산:** \(\log_650=(\log100-\log2)/(\log2+\log3)=(2-a)/(a+b)\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `삼각함수의 값` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
다음 중 옳지 않은 것은? [4.3점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\sin 330^{\circ} = -\frac{1}{2}$
2. $\cos(-\frac{\pi}{4}) = \frac{\sqrt{2}}{2}$
3. $\tan \frac{4}{3}\pi = \sqrt{3}$
4. $\sin 150^{\circ} = \frac{\sqrt{3}}{2}$
5. $\cos 90^{\circ} = 0$
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 각 변환 공식과 사분면에 따른 함숫값을 검증함.\n④ $\sin 150^{\circ}$ 의 계산:\n$\sin 150^{\circ} = \sin(180^{\circ} - 30^{\circ}) = \sin 30^{\circ} = \frac{1}{2}$\n주어진 $\frac{\sqrt{3}}{2}$ 와 일치하지 않음.\n$\therefore$ ④
````

- **독립 판정·핵심 연결/검산:** \(\sin150^\circ=\sin30^\circ=1/2\)이므로 \(\sqrt3/2\)라는 ④가 거짓. 다른 네 진술의 삼각비·각도 모두 맞음.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `삼각함수의 각 변환` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
$\frac{\pi}{2} < \theta < \pi$ 이고 $\sin\theta = \frac{3}{5}$ 일 때, $\sin(\frac{\pi}{2} + \theta) + \tan(\pi - \theta) - \cos\theta$ 의 값은? [4.3점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $-\frac{3}{4}$
2. $-\frac{3}{5}$
3. 0
4. $\frac{3}{5}$
5. $\frac{3}{4}$
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 사분면에 따른 삼각비의 부호를 결정한 후 각 변환 공식을 적용함.\n$i)  \cos\theta, \tan\theta  도출$\n$\theta$는 제 2사분면의 각이므로 $\cos<0, \tan<0$ 임.\n$\sin^2\theta + \cos^2\theta = 1 \implies \cos^2\theta = 1 - (\frac{3}{5})^2 = 16/25 \implies \cos\theta = -\frac{4}{5}$\n$\tan\theta = \frac{\sin\theta}{\cos\theta} = \frac{\frac{3}{5}}{-\frac{4}{5}} = -\frac{3}{4}$\n$ii) 각 변환 공식 적용$\n$\sin(\frac{\pi}{2} + \theta) = \cos\theta$\n$\tan(\pi - \theta) = -\tan\theta$\n$iii) 전체 식 계산$\n$\implies \cos\theta + (-\tan\theta) - \cos\theta = -\tan\theta$\n$\therefore -(-\frac{3}{4}) = \frac{3}{4}$
````

- **독립 판정·핵심 연결/검산:** 제2사분면에서 \(\sin\theta=3/5,\cos\theta=-4/5,\tan\theta=-3/4\). \(\sin(\pi/2+\theta)+\tan(\pi-\theta)-\cos\theta=-\tan\theta=3/4\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `지수부등식과 그래프` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
삼차함수 $y=f(x)$와 직선 $y=g(x)$의 그래프가 다음과 같을 때, 부등식 $2^{-f(x)} < 0.5^{g(x)}$ 의 해는? [4.3점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $x < -3$ 또는 $x > 2$
2. $-3 < x < -1$
3. $-1 < x < 2$
4. $-3 < x < -1$ 또는 $x > 2$
5. $x < -3$ 또는 $-1 < x < 2$
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 밑을 $2$로 통일하여 지수의 크기 관계를 그래프 상의 위치 관계로 해석함.\n$i) 밑의 통일$\n$2^{-f(x)} < (2^{-1})^{g(x)} \implies 2^{-f(x)} < 2^{-g(x)}$\n$ii) 지수 비교$\n밑 $2 > 1$ 이므로 부등호 방향이 유지됨.\n$-f(x) < -g(x) \implies f(x) > g(x)$\n$iii) 그래프 해석$\n곡선 $y=f(x)$가 직선 $y=g(x)$보다 위쪽에 있는 $x$의 범위를 찾음.\n그래프의 교점이 $-3, -1, 2$ 이고 해당 조건을 만족하는 구간은\n$\implies -3 < x < -1  또는  x > 2$\n$\therefore$ ④
````

- **독립 판정·핵심 연결/검산:** 실제 PNG에서 삼차곡선과 직선의 교점 \(x=-3,-1,2\), \(f(x)>g(x)\) 구간 \((-3,-1)\cup(2,\infty)\). \(2^{-f}<2^{-g}\iff f>g\)이므로 ④.
- 그림 증거: `archive/assets/images/23_한영고_1학기_중간_고2_대수/q9.png` (시각 검토, blob `8d69ff81cd7dbb12a430fc8dcade8760886662e0`); 보조 solutionImage: `archive/assets/images/23_한영고_1학기_중간_고2_대수/q9-solution.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `부채꼴의 성질과 사분면` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
반지름 $4$, 넓이 $S$가 $10\pi < S < 12\pi$인 부채꼴의 중심각 $\theta$에 대하여 옳지 않은 것은? [4.3점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\cos\theta < 0$
2. $\sin\theta\cos\theta > 0$
3. $\sin\theta\tan\theta < 0$
4. $\cos\theta - \sin\theta < 0$
5. $\cos\theta\tan\theta < 0$
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 부채꼴의 넓이 공식으로 중심각의 범위를 구하여 사분면을 판단함.\n$i)  \theta  의 범위 산출$\n$S = \frac{1}{2}r^2\theta = \frac{1}{2}(4^2)\theta = 8\theta$\n$10\pi < 8\theta < 12\pi \implies \frac{5}{4}\pi < \theta < \frac{3}{2}\pi$\n$\because \theta$는 제 3사분면의 각임.\n$ii) 삼각함수 부호 판정$\n제 3사분면에서 $\sin\theta < 0, \cos\theta < 0, \tan\theta > 0$ 임.\n① $\cos\theta < 0$ (참)\n② $(-)(-) = (+) > 0$ (참)\n③ $(-)(+) = (-) < 0$ (참)\n④ $\cos\theta, \sin\theta$ 모두 음수이므로 그 차의 부호는 값에 따라 결정됨 (거짓)\n⑤ $(-)(+) = (-) < 0$ (참)\n$\therefore$ ④
````

- **독립 판정·핵심 연결/검산:** 부채꼴 넓이 \(8\theta\in(10\pi,12\pi)\Rightarrow5\pi/4<\theta<3\pi/2\), 제3사분면. \(\cos-\sin\)은 음수로 고정되지 않으므로 ④가 거짓.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `지수방정식의 실근 조건` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
지수방정식 $9^{x} - 2 \cdot 3^{x+1} + k = 4$ 가 서로 다른 두 실근을 갖도록 하는 모든 자연수 $k$의 개수는? [4.3점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 8
2. 9
3. 10
4. 11
5. 12
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 지수 항을 치환하여 이차방정식의 근의 분리 문제로 전환함.\n$i) 치환 및 식 정리$\n$3^x = t$ 라 하면 ($t > 0$)\n$t^2 - 6t + (k - 4) = 0 \quad \cdots (*)$\n$\because x$ 가 서로 다른 두 실근을 가지려면, $t$ 는 서로 다른 두 <b>양의</b> 실근을 가져야 함.\n$ii) 조건 수립$\n(1) 판별식: $\frac{D}{4} = (-3)^2 - 1(k - 4) > 0 \implies 9 - k + 4 > 0 \implies k < 13$\n(2) 두 근의 합: $6 > 0$ (이미 만족)\n(3) 두 근의 곱: $k - 4 > 0 \implies k > 4$\n$iii) 공통 범위 추출 및 개수 산출$\n$4 < k < 13$\n자연수 $k \in \{5, 6, 7, 8, 9, 10, 11, 12\}$\n$\therefore 8$개
````

- **독립 판정·핵심 연결/검산:** \(t=3^x>0\)에서 \(t^2-6t+(k-4)=0\)가 서로 다른 양근 둘이려면 \(D>0,\ k-4>0\), 즉 \(4<k<13\); 자연수 8개, ①.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_한영고_1학기_중간_고2_대수/q11-solution.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `지수함수의 대소 비교` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
$x < 0$에서 $f(x) = a^x$ 그래프가 $g(x) = b^x$ 보다 항상 위에 있을 때, 옳은 것만을 보기에서 고른 것은? [4.5점]\nㄱ. $a > 1$이면 $b > 1$이다. \nㄴ. $0 < a < 1$이면 $b > 1$이다. \nㄷ. $0 < b < 1$이면 $ab < 1$이다.
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. ㄱ
2. ㄴ
3. ㄱ, ㄷ
4. ㄴ, ㄷ
5. ㄱ, ㄴ, ㄷ
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 지수가 음수일 때의 대소 관계는 밑의 크기 관계와 반대임을 이용함.\n$x < 0$ 이고 $a^x > b^x$ 이면 $a < b$ 임.\nㄱ. $1 < a < b$ 이므로 $b > 1$ (참)\nㄴ. $a < 1$ 이라 해서 반드시 $b > 1$ 일 필요는 없음. $a < b < 1$ 인 경우도 존재함. (거짓)\nㄷ. $0 < b < 1$ 이면 $0 < a < b < 1$ 이 성립함. 두 양수 모두 $1$보다 작으므로 $ab < 1$ 임. (참)\n$\therefore$ ㄱ, ㄷ
````

- **독립 판정·핵심 연결/검산:** \(x<0\)에 \(a^x>b^x\)는 양수 밑 \(a<b\)와 동치. ㄱ \(a>1\Rightarrow b>1\) 참, ㄴ은 반례 \(0<a<b<1\), ㄷ \(0<b<1\Rightarrow0<a<b<1\)로 \(ab<1\), ㄱ·ㄷ ③.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_한영고_1학기_중간_고2_대수/q12-solution-v2.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q13 — HOLD

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `삼각함수 그래프의 해석` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y = a \cos b(x-c\pi) + d$ 의 그래프를 보고 $5ab + 8cd$ 의 값을 구하시오. (단, $a>0, b>0, 0<c<1$) [4.5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 9
2. 11
3. 13
4. 15
5. 17
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 그래프의 마루(최대)와 골(최소)의 좌표를 통해 계수를 결정함.\n$i)  a, d  결정$\n최댓값 $M = 3$, 최솟값 $m = -1$ 이므로\n$a = \frac{M-m}{2} = \frac{4}{2} = 2, \ d = \frac{M+m}{2} = \frac{2}{2} = 1$\n$ii) 주기 및  b  결정$\n그래프에서 연속된 마루의 $x$좌표 차이를 조사하거나 주기를 파악함.\n주기 $T = \frac{5}{2}\pi \implies \frac{2\pi}{b} = \frac{5}{2}\pi \implies b = \frac{4}{5}$\n$iii) 평행이동  c  결정$\n첫 마루의 $x$좌표가 $\frac{5}{8}\pi$ 이므로 $x-c\pi = 0$ 지점을 대조함.\n$c = \frac{5}{8}$\n$iv) 최종 계산$\n$5ab + 8cd = 5(2)(\frac{4}{5}) + 8(\frac{5}{8})(1) = 8 + 5 = 13$\n$\therefore 13$
````

- **독립 판정·핵심 연결/검산:** **HOLD:** ‘그래프를 보고’ 계수를 구하라고 했지만 실제 문제 \`content\`와 \`image\`에 그래프가 없음. 보조 \`solutionImage=q13-solution.svg\`에만 최대3·최소-1·주기 \(5\pi/2\)·첫 극대 \(5\pi/8\)이 존재함. 현 문제 조건만으로 \(a,b,c,d\)를 결정할 수 없으며 정답13은 해당 미노출 그래프를 이용한 값이다.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_한영고_1학기_중간_고2_대수/q13-solution.svg` (실제 렌더)
- **HOLD 사유:** 원문 문제의 필수 조건/그림 결손으로 수록된 정보만으로 정답이 결정되지 않음. 원본 정답키 보존, 출제 검수·문제 이미지 복구 전 운영 출고 금지.

**보류 근거·수정 권고**

- **출제 정보 결손:** 원문 \`content\`는 ‘함수 \(y=a\cos b(x-c\pi)+d\)의 **그래프를 보고**’라고 명시하지만, 이 문항의 \`image\` 속성은 없고 \`content\`에도 이미지 태그·좌표·진폭·주기 정보가 없다. 따라서 \(a,b,c,d\)는 문제만으로 결정되지 않는다.
- GitHub에서 찾은 \`solutionImage\` \`archive/assets/images/23_한영고_1학기_중간_고2_대수/q13-solution.svg\`(blob \`c5cd592558ac0512bd3e1eea2f5cd96bd51c240f\`)을 실제 렌더해 보니, **해설용** 그림에는 최댓값 3, 최솟값 -1, 이웃 극대점의 간격 \(5\pi/2\), 첫 극대 위치 \(5\pi/8\)가 표시된다. 그 보조 그림은 학생이 문제를 풀 때 보이는 \`image\`가 아니다. 게다가 해설용 그림 상단에는 완성된 함수식까지 적혀 있다.
- 그 미노출 자료를 사용하면 \(a=(3-(-1))/2=2,\ d=(3+(-1))/2=1,\ b=2\pi/(5\pi/2)=4/5,\ c=5/8\), 따라서 \(5ab+8cd=8+5=13\), 원본 정답 \`③\`이 나온다. 그러나 현재 원문 자체로는 **무수히 많은 계수 선택이 가능**하므로 정답 유일성을 확보할 수 없다.
- **출고 HOLD / 수정 권고:** 원 문제 그림을 확보하거나, 해설식이 노출되지 않는 문제 전용 SVG/PNG에 축·최대/최소·주기·극대점 위치를 표시하여 \`content\` 또는 \`image\`로 연결한 뒤 시각 검수 및 정답 검산을 다시 수행한다. 원본 정답키와 JS는 이번 감사에서 변경하지 않는다.


### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `로그함수의 최대최소` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
$1 \le x \le 125$인 함수 $y = 3^{\log_5 x} x^{\log_5 3} - 2 \cdot 3^{\log_5 25x}$의 최댓값 $M$, 최솟값 $m$에 대하여 $\sqrt{M-m}$의 값은? [4.5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 18
2. 27
3. 36
4. 45
5. 54
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> $a^{\log_b c} = c^{\log_b a}$ 성질을 이용하여 식을 하나의 변수로 통일함.\n$i) 식의 변형 및 치환$\n$x^{\log_5 3} = 3^{\log_5 x}$ 이므로,\n$y = (3^{\log_5 x})^2 - 2 \cdot 3^{\log_5 25 + \log_5 x} = (3^{\log_5 x})^2 - 2 \cdot 3^{2 + \log_5 x}$\n$y = (3^{\log_5 x})^2 - 18 \cdot 3^{\log_5 x}$\n$3^{\log_5 x} = t$ 라 하면, $1 \le x \le 125$ 에서 $0 \le \log_5 x \le 3$ 이므로 $1 \le t \le 27$ 임.\n$ii) 이차함수 분석$\n$f(t) = t^2 - 18t = (t - 9)^2 - 81$\n범위 $1 \le t \le 27$ 에서:\n최솟값 $m = f(9) = -81$\n최댓값 $M = f(27) = (27-9)^2 - 81 = 18^2 - 81 = 324 - 81 = 243$\n$iii) 최종 계산$\n$M - m = 243 - (-81) = 324$\n$\sqrt{324} = 18$\n$\therefore 18$
````

- **독립 판정·핵심 연결/검산:** \(t=3^{\log_5x}\in[1,27]\)에서 \(y=t^2-18t=(t-9)^2-81\). 최소 -81, 최대 \(t=27\)에서 243, \(\sqrt{M-m}=\sqrt{324}=18\), ①.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_한영고_1학기_중간_고2_대수/q14-solution.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `지수의 성질 (단답형)` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
[단답형 1] $2^{\frac{7}{4}} \div 4^{\frac{1}{2}}$ 의 값을 $\sqrt[n]{a}$ 기호를 사용하여 나타내시오. [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1.  
2.  
3.  
4.  
5.
````

- 원본 `answer`: `$\sqrt[4]{8}$`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 밑을 통일하여 지수 법칙을 적용한 후 거듭제곱근 정의를 이용함.\n$2^{\frac{7}{4}} \div (2^2)^{\frac{1}{2}} = 2^{\frac{7}{4}} \div 2^1$\n$\implies 2^{\frac{7}{4} - 1} = 2^{\frac{3}{4}}$\n$\because a^{\frac{m}{n}} = \sqrt[n]{a^m}$\n$\therefore \sqrt[4]{2^3} = \sqrt[4]{8}$
````

- **독립 판정·핵심 연결/검산:** \(4=2^2\)로 통일해 \(2^{7/4}/2=2^{3/4}=\sqrt[4]8\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `삼각방정식 (단답형)` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
[단답형 2] $0 < x \le 2\pi$ 일 때, 방정식 $\tan x - 2\sin x = 0$ 의 모든 해의 합은? [5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1.  
2.  
3.  
4.  
5.
````

- 원본 `answer`: `$5\pi$`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> $\tan x$를 $\frac{\sin x}{\cos x}$로 바꾸어 공통인수를 추출함.\n$\frac{\sin x}{\cos x} - 2\sin x = 0$\n$\sin x ( \frac{1}{\cos x} - 2 ) = 0$\n$i)  \sin x = 0 \implies x = \pi, 2\pi$ (주어진 범위 확인)\n$ii)  \frac{1}{\cos x} = 2 \implies \cos x = \frac{1}{2} \implies x = \frac{\pi}{3}, \frac{5}{3}\pi$\n$iii) 모든 해의 합$\n$\pi + 2\pi + \frac{\pi}{3} + \frac{5}{3}\pi = 3\pi + 2\pi = 5\pi$\n$\therefore 5\pi$
````

- **독립 판정·핵심 연결/검산:** \(\tan x-2\sin x=\sin x(1/\cos x-2)=0\)에서 \(\cos x=0\)은 원래 정의역 제외. 해 \(\pi,2\pi,\pi/3,5\pi/3\), 합 \(5\pi\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `로그의 성질과 정수 조건 (단답형)` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
[단답형 3] (가) $2 < \log x < 3$, (나) $\log 25x^{2} - \log \frac{\sqrt[3]{x}}{4}$ 의 값이 정수일 때, $25\log x$ 의 값을 구하시오. [5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1.  
2.  
3.  
4.  
5.
````

- 원본 `answer`: `60`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 로그 식을 단순화하여 범위를 통해 가능한 정수값을 확정함.\n$i) 식 정리$\n$\log 25 + 2\log x - ( \frac{1}{3}\log x - \log 4 )$\n$= (\log 25 + \log 4) + (2 - \frac{1}{3})\log x$\n$= \log 100 + \frac{5}{3}\log x = 2 + \frac{5}{3}\log x$\n$ii) 범위 적용$\n$2 < \log x < 3 \implies \frac{10}{3} < \frac{5}{3}\log x < 5$\n$\implies 2 + \frac{10}{3} < 2 + \frac{5}{3}\log x < 2 + 5$\n$\implies 5.33\dots < (정수) < 7$\n만족하는 정수는 $6$ 뿐임.\n$iii) 계산$\n$2 + \frac{5}{3}\log x = 6 \implies \frac{5}{3}\log x = 4 \implies \log x = \frac{12}{5}$\n$25\log x = 25 \times \frac{12}{5} = 60$\n$\therefore 60$
````

- **독립 판정·핵심 연결/검산:** 표현식 \(\log(25x^2)-\log(\sqrt[3]x/4)=2+\frac53\log x\). \(2<\log x<3\)에서 가능한 정수는 6뿐, \(\log x=12/5\), \(25\log x=60\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `지수와 로그의 관계 (단답형)` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
[단답형 4] (가) $5^{a} = k^{b} = 7^{c}$, (나) $\log b = \log(5ac) - \log(a+2c)$ 일 때, $k^{5}$ 의 값을 구하시오. [6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1.  
2.  
3.  
4.  
5.
````

- 원본 `answer`: `175`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 지수 식을 상수로 두어 역수 관계를 유도한 후 로그 조건과 연립함.\n$i) 역수 합 도출$\n$b = \frac{5ac}{a+2c} \implies \frac{1}{b} = \frac{a+2c}{5ac} = \frac{1}{5c} + \frac{2}{5a}$\n$ii) 로그 변환$\n$5^a = k^b = 7^c = T$ 라 하면,\n$a = \log_5 T \implies \frac{1}{a} = \log_T 5$\n$b = \log_k T \implies \frac{1}{b} = \log_T k$\n$c = \log_7 T \implies \frac{1}{c} = \log_T 7$\n$iii) 관계식 대입$\n$\log_T k = \frac{1}{5}\log_T 7 + \frac{2}{5}\log_T 5$\n$\log_T k = \log_T ( 7^{\frac{1}{5}} \cdot 5^{\frac{2}{5}} ) = \log_T ( 7 \cdot 25 )^{\frac{1}{5}} = \log_T (175)^{\frac{1}{5}}$\n$k = (175)^{\frac{1}{5}} \implies k^5 = 175$\n$\therefore 175$
````

- **독립 판정·핵심 연결/검산:** \(b=5ac/(a+2c)\)에서 \(1/b=1/(5c)+2/(5a)\). 공통 \(T=5^a=k^b=7^c\)를 밑으로 한 로그로 바꾸면 \(\log_Tk=\frac15\log_T7+\frac25\log_T5\), \(k^5=7\cdot25=175\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `삼각부등식의 그래프 (서술형)` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
[서술형 1] $0 \le x \le 2\pi$ 일 때, 부등식 $\tan x \ge -1$ 의 해를 그래프를 활용하여 구하시오. [5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1.  
2.  
3.  
4.  
5.
````

- 원본 `answer`: `$0 \le x < \frac{\pi}{2}$ 또는 $\frac{3}{4}\pi \le x < \frac{3}{2}\pi$ 또는 $\frac{7}{4}\pi \le x \le 2\pi$`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 탄젠트 함수의 주기성과 점근선을 고려하여 직선과의 대소 관계를 분석함.\n$i) 기준점 도출$\n$\tan x = -1$ 인 $x$값은 제 2사분면과 제 4사분면에 존재함.\n$x = \pi - \frac{\pi}{4} = \frac{3}{4}\pi, \ x = 2\pi - \frac{\pi}{4} = \frac{7}{4}\pi$\n$ii) 그래프 해석$\n탄젠트 그래프가 $y=-1$ 보다 위쪽에 있는 구간을 조사함.\n(1) $0 \le x < \frac{\pi}{2}$ (제 1사분면, 항상 양수)\n(2) $\frac{3}{4}\pi \le x < \frac{3}{2}\pi$ (제 2사분면 일부 및 3사분면)\n(3) $\frac{7}{4}\pi \le x \le 2\pi$ (제 4사분면 일부)\n$\therefore$ 해의 범위는 위와 같음.
````

- **독립 판정·핵심 연결/검산:** \(\tan x\ge-1\)에서 탄젠트 점근선 \(\pi/2,3\pi/2\)은 제외, 경계 \(\tan x=-1\)은 \(3\pi/4,7\pi/4\). 해 \([0,\pi/2)\cup[3\pi/4,3\pi/2)\cup[7\pi/4,2\pi]\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `로그의 실생활 활용 (서술형)` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
[서술형 2] 유리판 통과 시 밝기가 3%씩 감소한다. (1) $n$장 통과 시 밝기 식을 세우고, (2) 500lx가 10장 통과했을 때의 밝기를 구하시오. (단, $\log 2=0.3010$, $\log 9.7=0.9868$, $\log 3.69=0.567$로 계산하고, 밝기는 $1\,\mathrm{lx}$ 단위로 반올림하여 나타내시오.) [5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1.  
2.  
3.  
4.  
5.
````

- 원본 `answer`: `(1) $I_n = A(0.97)^n, \ (2) 369\text{lx}$`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
(1) 처음 밝기를 $A\,\mathrm{lx}$라 하면, 한 장을 통과할 때마다 밝기는 직전 밝기의 $97\%$가 된다. 따라서 $n$장 통과 뒤의 밝기는 $I_n=A(0.97)^n\,\mathrm{lx}$이다.

(2) $A=500$, $n=10$을 대입하면
$I_{10}=500(0.97)^{10}=368.712063\ldots\,\mathrm{lx}$이다.
주어진 로그값을 사용하면
$\log I_{10}=(3-\log2)+10(\log9.7-1)\approx(3-0.3010)+10(0.9868-1)=2.5670$이다.
또한 $\log369=2+\log3.69=2+0.567=2.567$이므로 $I_{10}\approx369\,\mathrm{lx}$이다.
따라서 문제의 지시에 따라 밝기를 $1\,\mathrm{lx}$ 단위로 반올림하면 $369\,\mathrm{lx}$이다.
````

- **독립 판정·핵심 연결/검산:** 한 장 뒤 남는 밝기 0.97배이므로 \(I_n=A(0.97)^n\). \(500(0.97)^{10}\approx368.712\)이고 1lx 반올림 369; 주어진 로그값으로도 \(\log I_{10}\approx2.567=\log369\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `74a6321713d8689d53e3f998b7ca7e054511f108`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `지수/로그함수의 대칭과 넓이 (서술형)` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
[서술형 3] $y = a^{x-1}$과 $y = \log_a(x-1)$이 $y = -x+6$과 만나는 점을 각각 $A, B$라 하자. 점 $C=(0,0)$를 정점으로 하는 삼각형에서 $AB=4\sqrt{2}$이고 $a>1$일 때, $a$와 $\triangle ABC$의 넓이 $S$에 대한 $81S$의 값을 구하시오. [8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1.  
2.  
3.  
4.  
5.
````

- 원본 `answer`: `$a=\frac{81}{4},\quad 81S=972$`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 두 그래프는 직선 $y=x-1$에 대하여 대칭이므로 교점의 중점을 이용한다.\n$i)$ 직선 $y=-x+6$과 대칭축 $y=x-1$의 교점은 $M(\frac{7}{2},\frac{5}{2})$이다. $AB=4\sqrt{2}$이고 $AB$의 기울기는 $-1$이므로 $A(\frac{3}{2},\frac{9}{2})$, $B(\frac{11}{2},\frac{1}{2})$로 둘 수 있다.\n$ii)$ $A$가 $y=a^{x-1}$ 위의 점이므로 $\frac{9}{2}=a^{\frac{1}{2}}$, 따라서 $a=\frac{81}{4}$이다.\n$iii)$ $C=(0,0)$이므로 $S=\frac12\left|\frac32\cdot\frac12-\frac92\cdot\frac{11}{2}\right|=12$이다. 따라서 $81S=972$이다.
````

- **독립 판정·핵심 연결/검산:** 대칭축 \(y=x-1\)과 직선 \(y=-x+6\)의 교점 \(M=(7/2,5/2)\), \(AB=4\sqrt2\)에서 \(A=(3/2,9/2),B=(11/2,1/2)\). \(a^{1/2}=9/2\Rightarrow a=81/4\), \([ABC]=12\)이므로 \(81S=972\).
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_한영고_1학기_중간_고2_대수/q21-solution.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

## 종료 검증 및 다음 단계

- 원본 소스 전수: Q01–Q21, 21개, `UNREAD 0`. 원문·보기·정답·기존 해설과 독립 검산을 모두 기록.
- 판정 합계: KEEP 20, UPGRADE 0, HOLD 1 (총 21).
- 개선 해설 초안: NONE; 해당 Q에 본문 수록.
- 보류: Q13; 출제 이미지/조건 복구 뒤 재감사 필요.
- 원문 문제 그림 1개 실제 판독, 보조 해설 그림 7개 존재 검증(Q13은 시각 판독 추가). 최종 UI 출고 QA `NOT_RUN`.
- 본 MD는 worker branch 감사 기록이며 실제 JS 교체 또는 운영 병합 상태가 아니다.
