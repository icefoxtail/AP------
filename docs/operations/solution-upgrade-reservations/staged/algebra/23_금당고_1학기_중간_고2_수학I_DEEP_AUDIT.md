# 2023 23_금당고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2023`
- source: `archive/exams/original/high/h2/1mid/23_금당고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- standardCourse (전 문항): `수학I`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/23_금당고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `20` · actual question/answer/solution read: `20` · KEEP 20 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 전 20문항 원본·정답·기존 해설 독립 검토. 학생용 해설은 MD 초안으로 기록하며 원본 JS/SVG·main·정답키는 변경하지 않음.

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



검토 방식: 원본 `content`, `choices`, `answer`, `solution`을 전 문항 읽고 로그의 진수·밑 조건, 지수 양의 해, 삼각함수 범위·끝점, 교점 개수와 그림을 독립 대조했다. 모든 문항에 원문·선지·정답·기존 해설 발췌·구체적 수치 검산을 남긴다. UPGRADE는 원문을 대체할 수 있도록 새 풀이를 처음부터 끝까지 작성했다. 원본 정답 및 콘텐츠의 실제 치환은 이 MD 작성 범위 밖이다. 학생 실제 UI 렌더·`preflight.mjs`·Golden/Negative 게이트·운영 출고는 `NOT_RUN`.

## 실물 이미지·보조 해설 그림 증거

- `archive/assets/images/23_금당고_1학기_중간_고2_수학I/q07.png` — Git blob `cead384b20473fcb36b21de263a556c8a7cace33`; 실제 PNG 화면 렌더·원문 조건 대조 완료
- `archive/assets/images/23_금당고_1학기_중간_고2_수학I/q13.png` — Git blob `5caf357ace4850386912857a9cd87c42affd9f22`; 실제 PNG 화면 렌더·원문 조건 대조 완료
- `solutionImage` 보조 해설 자산 4개: GitHub 실제 파일과 Git blob 존재 확인. **보조 해설 그림의 전수 시각 판독·학생 최종 렌더는 NOT_RUN**.
  - Q11 `archive/assets/images/23_금당고_1학기_중간_고2_수학I/q11-solution.svg` — `e01ebd04754b24eeefafd8dccf8f3e316ea88f84`
  - Q14 `archive/assets/images/23_금당고_1학기_중간_고2_수학I/q14-solution.svg` — `008ec91ddd93699bcecf45479c3eb8a0faba3473`
  - Q18 `archive/assets/images/23_금당고_1학기_중간_고2_수학I/q18-solution.svg` — `2e68bc743f3a0316b01a2281d8bbe4c6c70dcaf2`
  - Q19 `archive/assets/images/23_금당고_1학기_중간_고2_수학I/q19-solution.svg` — `af4c96332b0efbb1b0e462e9683fc6c4272596ec`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\left(\frac{1}{2}\right)^{-2}$의 값은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
\frac{1}{2}
\frac{1}{4}
\frac{1}{8}
2
4
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
음의 지수는 밑의 역수의 양의 지수로 바꾼다.
$\left(\frac12\right)^{-2}=2^2=4$이다.
따라서 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 음의 지수법칙 \((1/2)^{-2}=2^2=4\), ⑤.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log_4 8 - \log_{\frac{1}{2}} 4$의 값은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
\frac{3}{2}
\frac{5}{2}
\frac{7}{2}
4
\frac{9}{2}
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
먼저 각 로그를 계산한다.
$\log_4 8=\frac32$이다.
또 $\left(\frac12\right)^{-2}=4$이므로 $\log_{\frac12}4=-2$이다.
따라서 $\log_4 8-\log_{\frac12}4=\frac32-(-2)=\frac72$이다.
그러므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** \(\log_4 8=3/2\), \(\log_{1/2}4=-2\); 차 \(7/2\), ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\cos\frac{23}{6}\pi$의 값은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
-\frac{\sqrt{3}}{2}
\frac{\sqrt{3}}{2}
\frac{\sqrt{2}}{2}
-\frac{1}{2}
\frac{1}{2}
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
각을 한 바퀴에 가까운 각으로 바꾼다.
$\frac{23\pi}{6}=4\pi-\frac{\pi}{6}$이므로
$\cos\frac{23\pi}{6}=\cos\left(-\frac{\pi}{6}\right)=\cos\frac{\pi}{6}=\frac{\sqrt3}{2}$이다.
따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** \(23\pi/6=4\pi-\pi/6\), 코사인 짝함수로 \(\sqrt3/2\), ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
정의역이 $\{x \mid -1 \le x \le 2\}$일 때, 함수 $y=\log_{\frac{1}{2}}(2x+4)+2$의 최댓값과 최솟값의 합은? [4.2점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
0
1
2
3
4
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
밑이 $0<\frac12<1$이므로 $y=\log_{\frac12}(2x+4)+2$는 감소한다.
정의역의 양 끝에서 값을 계산하면
$x=-1$일 때 $y=\log_{\frac12}2+2=1$,
$x=2$일 때 $y=\log_{\frac12}8+2=-1$이다.
따라서 최댓값과 최솟값의 합은 $1+(-1)=0$이다. 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 밑1/2 로그 감소함수, \(x=-1\)에서 1, \(x=2\)에서−1로 최댓값·최솟값 합0, ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
부등식 $(\log_2 x)^2 - \log_2 x^4 + 3 \le 0$을 만족시키는 자연수 $x$의 개수는? [4.2점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
3
4
5
6
7
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
로그를 하나의 변수로 바꾸어 자연수 $x$의 범위를 구한다.
$t=\log_2 x$라 두면 $\log_2 x^4=4\log_2 x=4t$이므로
$t^2-4t+3\le0$
$(t-1)(t-3)\le0$에서 $1\le t\le3$이다.
밑 $2$는 $1$보다 크므로 $2\le x\le8$이다. 이 구간의 자연수는 $2,3,4,5,6,7,8$의 일곱 개이다.
따라서 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** \(t=\log_2x\), \((t-1)(t-3)\le0\)에서 \(2\le x\le8\), 자연수 7개, ⑤.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y=3^{2x}$의 그래프를 $x$축의 방향으로 $m$만큼, $y$축의 방향으로 $n$만큼 평행이동하였더니 함수 $y=81 \times 3^{2x}-4$의 그래프와 겹쳐졌다. 상수 $m, n$에 대하여 $m+n$의 값은? [4.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
-6
-4
-2
0
2
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$y=3^{2x}$를 $x$축 방향으로 $m$만큼, $y$축 방향으로 $n$만큼 옮긴 식은
$y=3^{2(x-m)}+n=3^{2x-2m}+n$이다.
목표 식은 $81\cdot3^{2x}-4=3^{2x+4}-4$이므로 지수를 비교해 $-2m=4$, $m=-2$이고 $n=-4$이다.
따라서 $m+n=-2-4=-6$이며 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** \(81\cdot3^{2x}-4=3^{2(x+2)}-4\), 이동량 \(m=-2,n=-4\), 합−6, ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 그림과 같은 두 함수 $y=2^x$, $y=\log_2 x$의 그래프에서 $abcd$의 값은? (단, 점선은 $x$축 또는 $y$축에 평행하다.) [4.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
2^{13}
2^{15}
2^{17}
2^{21}
2^{23}
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
점선이 나타내는 좌표를 차례로 읽는다.
높이 $1$에서 로그그래프의 점선 교점의 $x$좌표가 $a$이므로 $\log_2 a=1$, 따라서 $a=2$이다.
같은 수직선에서 지수그래프의 높이가 $c$이므로 $c=2^a=4$이다.
높이 $c$에서 로그그래프의 점선 교점의 $x$좌표가 $b$이므로 $\log_2 b=c$, 따라서 $b=2^c=16$이다.
마지막으로 $x=b$에서 지수그래프의 높이가 $d$이므로 $d=2^b=2^{16}$이다.
따라서 $abcd=2\cdot4\cdot16\cdot2^{16}=2^{23}$이고, 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 실물 q07 그림의 점선과 두 곡선을 따라 \(\log_2a=1\Rightarrow a=2,c=2^a=4,b=2^c=16,d=2^b=2^{16}\). 곱 \(2^{23}\), ⑤.
- 문제 그림: `archive/assets/images/23_금당고_1학기_중간_고2_수학I/q07.png` (실물 판독 완료)
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
좌표평면에서 시초선을 원점에서 $x$축의 양의 방향으로 잡을 때 각 $\theta$를 나타내는 동경과 원점을 중심으로 하고 반지름의 길이가 $3$인 원이 만나는 점의 좌표가 $(a, b)$이다. $\cos\theta \times \tan\theta = -\frac{2}{3}$일 때, $|ab|$의 값은? [4.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
6
5
2\sqrt{5}
3\sqrt{5}
4
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
반지름이 $3$이므로 교점의 좌표는 $(a,b)$이고 $a^2+b^2=9$이다.
$\cos\theta\tan\theta=\sin\theta$이므로 $b=3\sin\theta=-2$이다.
따라서 $a^2=9-4=5$이고 $|ab|=|a(-2)|=2\sqrt5$이다.
그러므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** \(\cos\theta\tan\theta=\sin\theta=-2/3\), 원 반지름3에서 \(b=-2,a^2=5\), \(|ab|=2\sqrt5\), ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log_{a-2}(-a^2+9a-14)$가 정의되기 위한 모든 정수 $a$의 값의 합은? [4.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
9
15
17
18
22
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
로그가 정의되려면 밑은 양수이고 1이 아니며, 진수는 양수여야 한다.

먼저 밑 조건을 적용하면
$a-2>0$, $a-2\ne1$
이므로 $a>2$, $a\ne3$이다.

진수 조건은
$-a^2+9a-14>0$
$-(a-2)(a-7)>0$
이므로
$2<a<7$이다.

따라서 가능한 정수는 $3,4,5,6$이다. 이 중 밑이 1이 되는 $a=3$을 제외하면 $4,5,6$이 남는다.

구하는 합은
$4+5+6=15$이다.

그러므로 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 밑 \(a>2,a\ne3\), 진수 \(2<a<7\)에서 정수 4,5,6, 합15, ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$a,b$는 $1$보다 큰 양수이고, $x=\log_a 2$, $y=\log_b 2$라 하자. $x+y=4$, $(\log_2 a)^2+(\log_2 b)^2=14$일 때, $x^3+y^3$의 값은? [4.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
52
56
60
61
64
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$x=\log_a2$, $y=\log_b2$라 두면 $a,b>1$이므로 $x,y>0$이다. 또한
$\log_2a=\dfrac1x$, $\log_2b=\dfrac1y$
이다.

주어진 제곱합 조건은
$\dfrac1{x^2}+\dfrac1{y^2}=14$
이다. $p=xy$라 놓으면 $p>0$이고, $x+y=4$이므로
$x^2+y^2=(x+y)^2-2xy=16-2p$
이다. 따라서
$\dfrac{x^2+y^2}{p^2}=14$
$\dfrac{16-2p}{p^2}=14$
$7p^2+p-8=0$
$(7p+8)(p-1)=0$
이다. $p>0$이므로 $p=1$이다.

$x+y=4$, $xy=1$이므로 $x,y$는 $u^2-4u+1=0$의 두 근이다. 따라서 $x,y=2\pm\sqrt3$이고 둘 다 양수이다. 실제로 $a=2^{\frac{1}{x}}$, $b=2^{\frac{1}{y}}$라 두면 $a,b>1$이며 주어진 로그 조건을 만족한다.

세제곱합은
$x^3+y^3=(x+y)^3-3xy(x+y)$
$=4^3-3\cdot1\cdot4=52$
이다.

그러므로 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** \(x+y=4\), 역로그 제곱합 \(1/x^2+1/y^2=14\); \(p=xy>0\)에서 \(7p^2+p-8=0\Rightarrow p=1\), \(x^3+y^3=64-12=52\), ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
충전된 전하량이 $Q_0$인 축전기에 전구를 연결한 지 $t$초 후에 남아 있는 전하량을 $Q_t$라 하면
$$\log Q_t - \log Q_0 = kt \quad (\text{단, } k\text{는 상수})$$
가 성립한다. 충전된 전하량이 $Q_0$인 축전기에 전구를 연결한 지 $3$초 후에 남아 있는 전하량은 $\frac{1}{3}Q_0$이고, 충전된 전하량이 $Q_0$인 축전기에 전구를 연결한 지 $9$초 후에 남아 있는 전하량은 $Q_p$이다. 충전된 전하량이 $Q_0$인 축전기에 전구를 연결한 지 $12$초 후에 남아 있는 전하량은 $a \times Q_p$이다. 이 때 상수 $a$의 값을 구하시오. (단, 전하량의 단위는 쿨롱($\mathrm{C}$)이다.) [4.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
\frac{7}{3}
\frac{5}{3}
\frac{4}{3}
\frac{1}{3}
\frac{1}{9}
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
식에서 $\log Q_t-\log Q_0=\log\frac{Q_t}{Q_0}=kt$이다.
$t=3$일 때 $\frac{Q_3}{Q_0}=\frac13$이므로 $3k=\log\frac13$이다.
따라서 시간 3초가 더 지날 때마다 전하량은 다시 $\frac13$배가 된다.
$Q_9=\frac1{27}Q_0$, $Q_{12}=\frac1{81}Q_0$이므로 $Q_{12}=\frac13Q_9$이다.
따라서 $a=\frac13$이고 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 3초마다 전하량이 1/3배이므로 \(Q_9=Q_0/27,Q_{12}=Q_0/81\), 비 \(a=1/3\), ④.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$2 \le x \le 6$에서 함수 $y=\left(\frac{1}{3}\right)^{x^2-6x+3}$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $Mm$의 값은? [4.6점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
1
3
9
27
81
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
지수 $x^2-6x+3$을 정리하면
$x^2-6x+3=(x-3)^2-6$이다.
$2\le x\le6$에서 지수의 최솟값은 $-6$, 최댓값은 $3$이다.
밑 $\frac13$은 $1$보다 작으므로 함수의 최댓값은 $M=(\frac13)^{-6}=729$, 최솟값은 $m=(\frac13)^3=\frac1{27}$이다.
따라서 $Mm=729\cdot\frac1{27}=27$이고 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 지수 \((x-3)^2-6\)은 [2,6]에서 −6부터 3, 밑1/3 감소로 \(M=729,m=1/27\), 곱27, ④.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 그림과 같이 $y=\sin\frac{\pi}{4}x$의 그래프와 $y$축 사이에 직사각형 $\mathrm{ABCD}$가 내접하고 있다. 직사각형의 밑변 $\mathrm{BC}$의 길이가 $\frac{8}{3}$일 때, 직사각형 $\mathrm{ABCD}$의 넓이를 구하면? [4.6점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
\frac{2}{3}
\frac{4}{3}
\frac{5}{3}
2
\frac{7}{3}
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
그래프 $y=\sin\frac{\pi}{4}x$는 꼭짓점의 수직선 $x=2$에 대하여 대칭이다.
직사각형의 밑변 양 끝을 $x=t$와 $x=4-t$라 두면
$(4-t)-t=\frac83$이므로 $t=\frac23$이다.
높이는 $\sin(\frac{\pi}{4}\cdot\frac23)=\sin\frac\pi6=\frac12$이다.
따라서 넓이는 $\frac83\cdot\frac12=\frac43$이고 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 실물 q13 그래프에서 x2 축 대칭, 밑변 길이8/3에서 좌측 x2/3, 높이 \(\sin(\pi/6)=1/2\), 넓이4/3, ②.
- 문제 그림: `archive/assets/images/23_금당고_1학기_중간_고2_수학I/q13.png` (실물 판독 완료)
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$-\frac{3}{2}\pi \le x \le 2\pi$에서 방정식 $\cos^2\left(x-\frac{\pi}{2}\right)-\sin(x-\pi)-2\cos^2 x = 0$의 서로 다른 근의 개수는? [4.6점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
3
4
5
6
7
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
삼각함수의 이동 관계를 이용해 식을 $\sin x$로 정리한다.
$\cos^2(x-\frac\pi2)=\sin^2x$, $\sin(x-\pi)=-\sin x$이므로
$\sin^2x+\sin x-2\cos^2x=0$이다.
$\cos^2x=1-\sin^2x$를 대입하면
$3\sin^2x+\sin x-2=0$, $(3\sin x-2)(\sin x+1)=0$이다.
따라서 $\sin x=\frac23$ 또는 $\sin x=-1$이다.
주어진 구간에서 $\sin x=\frac23$의 근은 3개이고, $\sin x=-1$의 근은 2개이다. 서로 겹치지 않으므로 총 5개, 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 방정식 \((3\sin x-2)(\sin x+1)=0\), 구간 \([-3\pi/2,2\pi]\)에서 첫 근3개·둘째2개로 총5, ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$0 < \theta < \frac{\pi}{4}$일 때, $\sqrt{1+2\sin\theta\cos\theta} + \sqrt{1-2\sin\theta\cos\theta}$를 간단히 하면? [4.8점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
\sin\theta - \cos\theta
\cos\theta - \sin\theta
2\sin\theta
2\cos\theta
\sin\theta\cos\theta
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
제곱근 안을 제곱식으로 바꾼다.
$1+2\sin\theta\cos\theta=(\sin\theta+\cos\theta)^2$이고, $0<\theta<\frac\pi4$이므로 첫째 제곱근은 $\sin\theta+\cos\theta$이다.
또 $1-2\sin\theta\cos\theta=(\cos\theta-\sin\theta)^2$이며 $\cos\theta>\sin\theta$이므로 둘째 제곱근은 $\cos\theta-\sin\theta$이다.
두 값을 더하면 $2\cos\theta$이므로 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** \(0<\theta<\pi/4\)에서 \(\cos\theta>\sin\theta>0\), 두 제곱근은 \(\sin+\cos\), \(\cos-\sin\), 합 \(2\cos\theta\), ④.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
1보다 큰 실수 $a, k$에 대하여 $(a^2)^k, a^k, \left(\frac{1}{a}\right)^k, \left(\frac{1}{a}\right)^{\frac{1}{k}}$의 대소를 옳게 비교한 것은? [4.8점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
(a^2)^k \ge a^k \ge \left(\frac{1}{a}\right)^k \ge \left(\frac{1}{a}\right)^{\frac{1}{k}}
(a^2)^k \ge a^k \ge \left(\frac{1}{a}\right)^{\frac{1}{k}} \ge \left(\frac{1}{a}\right)^k
\left(\frac{1}{a}\right)^k \ge (a^2)^k \ge a^k \ge \left(\frac{1}{a}\right)^{\frac{1}{k}}
\left(\frac{1}{a}\right)^k \ge \left(\frac{1}{a}\right)^{\frac{1}{k}} \ge (a^2)^k \ge a^k
\left(\frac{1}{a}\right)^{\frac{1}{k}} \ge \left(\frac{1}{a}\right)^k \ge (a^2)^k \ge a^k
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$a>1$, $k>1$에서 $(a^2)^k>a^k>1$이다.
한편 $0<\frac1a<1$이므로 지수가 클수록 값은 작아져
$\left(\frac1a\right)^{\frac{1}{k}}>\left(\frac1a\right)^k$이다.
두 양수는 모두 $1$보다 작으므로 전체 순서는
$(a^2)^k>a^k>\left(\frac1a\right)^{\frac{1}{k}}>\left(\frac1a\right)^k$이다.
따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** \(a,k>1\)에서 \(a^{2k}>a^k>1>a^{-1/k}>a^{-k}\), 해당 순서 ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
두 함수 $f(x)=-3^{-2x+2}+k, g(x)=\left(\frac{1}{2}\right)^x+2$의 그래프가 제$2$사분면에서 만나도록 하는 자연수 $k$의 최솟값은? [4.8점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
13
14
15
16
17
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$x<0$에서 두 그래프가 만나면
$k-3^{-2x+2}=2^{-x}+2$이므로
$k=3^{-2x+2}+2^{-x}+2$이다.
$x<0$일 때 오른쪽은 $x$가 $0$에 가까워질수록 $12$에 가까워지며, $x$가 감소하면 연속적으로 증가한다. 따라서 정수 $k=13$부터 실제 $x<0$인 교점이 생긴다.
$g(x)=2^{-x}+2>0$이므로 교점은 제2사분면에 있다.
자연수 $k$의 최솟값은 $13$, 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 제2사분면 \(x<0\)에서 \(k=3^{2-2x}+2^{-x}+2>9+1+2=12\); 연속성으로 최소 자연수 \(k=13\), ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
1보다 큰 실수 $a$에 대하여 부등식
$$\left|\log_a m-\log_a 8\right|+\log_a\frac{n}{2}\le\log_a\frac{3}{2}$$
를 만족시키는 자연수 $m,n$의 모든 순서쌍 $(m,n)$의 개수는? [5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
23
27
30
33
37
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
밑이 $a>1$이므로 로그함수는 증가한다. 또
$\left|\log_a m-\log_a8\right|=\log_a\max\left(\dfrac m8,\dfrac8m\right)$
이다. 따라서 주어진 부등식은
$\log_a\left(\dfrac n2\max\left(\dfrac m8,\dfrac8m\right)\right)\le\log_a\dfrac32$
이고, 이는
$n\max\left(\dfrac m8,\dfrac8m\right)\le3$
과 같다.

먼저 $m\le8$이면 $\max(\frac{m}{8},\frac{8}{m})=\frac{8}{m}$이므로
$n\le\left\lfloor\dfrac{3m}{8}\right\rfloor$
이다. $m=1,2,3,4,5,6,7,8$에서 가능한 $n$의 개수는 차례로
$0,0,1,1,1,2,2,3$
이어서 합계 $10$개이다.

다음으로 $m\ge8$이면 $\max(\frac{m}{8},\frac{8}{m})=\frac{m}{8}$이므로
$mn\le24$
이다. $m=8$에서는 $n=1,2,3$으로 $3$쌍, $m=9,10,11,12$에서는 각각 $2$쌍, $m=13,14,\ldots,24$에서는 각각 $1$쌍이므로 이쪽은
$3+4\cdot2+12\cdot1=23$쌍이다.

두 경우에 공통으로 들어간 $m=8$, $n=1,2,3$의 $3$쌍을 한 번 빼면
$10+23-3=30$
이다.

[... 원본 solution 계속]
```

- **독립 판정·핵심 연결/검산:** 절댓값 로그를 \(\log_a\max(m/8,8/m)\)로 바꿔 \(n\max(m/8,8/m)\le3\). \(m\le8\) 10쌍, \(m\ge8\) 23쌍, \(m=8\) 3쌍 중복 제거 →30, ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
<서술형 1>
$a\ge1$을 만족하는 실수 $a$에 대하여 곡선 $y=3^{x+a}$가 $y$축과 만나는 점을 $\mathrm{A}$, 곡선 $y=\log_3(x+8)-a$가 $x$축과 만나는 점을 $\mathrm{B}$라 하자. 세 점 $\mathrm{A,B,O}$를 지나는 원의 넓이가 $10\pi$일 때, $a$의 값을 풀이과정과 함께 구하시오. [12점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `\log_3 6`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$t=3^a$라 놓으면 $a\ge1$에서 $t\ge3$이다.

$y$축과 만나는 점은 $x=0$일 때이므로
$A=(0,3^a)=(0,t)$
이다. $x$축과 만나는 점은 $\log_3(x+8)-a=0$에서
$x+8=3^a=t$
이므로
$B=(t-8,0)$
이다.

$OA$와 $OB$는 서로 수직이므로 $\triangle OAB$는 $O$에서 직각이다. 직각삼각형의 외접원의 반지름은 빗변의 절반이므로
$R^2=\dfrac{AB^2}{4}=\dfrac{t^2+(t-8)^2}{4}$
이다. 원의 넓이가 $10\pi$이므로
$\pi R^2=10\pi$
$\dfrac{t^2+(t-8)^2}{4}=10$
$t^2+(t-8)^2=40$
$2t^2-16t+24=0$
$(t-2)(t-6)=0$
이다. $t\ge3$이므로 $t=6$이다. 따라서
$3^a=6$
이고
$a=\log_3 6$
이다.

그러므로 정답은 $\log_3 6$이다.
```

- **독립 판정·핵심 연결/검산:** \(t=3^a\ge3\), \(A=(0,t),B=(t-8,0)\). 직각삼각형 외접원 반지름에서 \(t^2+(t-8)^2=40\), \(t=6\), \(a=\log_36\).
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `11e8a4caa343d6196ba42c167fa9d4e7b8976e35`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
<서술형 2>
$$\frac{\sin\left(\frac{3}{2}\pi+\theta\right)}{\sin\left(\frac{3}{2}\pi-\theta\right)\cos^2(\pi+\theta)} + \frac{\sin(\pi+\theta)\tan^2(\pi-\theta)}{\cos\left(\frac{3}{2}\pi+\theta\right)}$$
의 값을 풀이과정과 함께 구하시오. [8점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$1$`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
삼각함수의 이동 공식을 적용한다.
$\sin(\frac32\pi+\theta)=-\cos\theta$, $\sin(\frac32\pi-\theta)=-\cos\theta$, $\cos(\pi+\theta)=-\cos\theta$이므로 첫째 분수는 $\sec^2\theta$이다.
또 $\sin(\pi+\theta)=-\sin\theta$, $\tan(\pi-\theta)=\tan\theta$, $\cos(\frac32\pi+\theta)=\sin\theta$이므로 둘째 분수는 $-\tan^2\theta$이다.
따라서 전체 값은 $\sec^2\theta-\tan^2\theta=1$이다. 정답은 $1$이다.
```

- **독립 판정·핵심 연결/검산:** 두 분수를 \(\sec^2\theta\)와 \(-\tan^2\theta\)로 바꾸면 합1. 식이 정의되지 않는 \(\theta\)에서는 애초 값이 없음을 별도 명시.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

## 시험지 QA·완료 보고 경계

- **전 문항 READ_EVIDENCED**: 20/20. 문항별 원문·정답·기존 해설·독립 계산·그림 링크를 위에 기록.
- **UPGRADE 전체 풀이 초안**: 0개 완성; 학생 노출은 아직 하지 않음.
- **HOLD**: 0개. 원본 문항 조건·답 불일치가 확정된 문항은 발견되지 않음.
- **원본 보존**: original JS/SVG/PNG와 default `main` 무변경.
- **미실행**: 학생 실제 렌더, 전체 preflight, Golden/Negative, SHA-256 전체 영수증, 운영 출고. **MD 작성 완료는 출고 QA 통과를 뜻하지 않는다.**

