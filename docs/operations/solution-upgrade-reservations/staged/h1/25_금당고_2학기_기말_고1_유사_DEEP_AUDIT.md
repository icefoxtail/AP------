# 고1 2025 금당고 2학기 기말 유사시험지 — 1장 심층 감사 샘플

- **scope:** `h1` / 공통수학2 / `similar` / 2학기 기말 / 2025 금당고 1장만. 원본 기출·타 과목 미변경.
- **sourcePath:** `archive/exams/similar/high/h1/2final/25_금당고_2학기_기말_고1_유사.js` (`main`, Git blob `518239dcd17a2484de18416f2c46fd1af834cbfc`). `examTitle=25_금당고_2학기_기말_고1_유사`.
- **worker branch:** `work/solution-upgrade-h1-similar-sample-20261122` (다른 활성 예약 lane 및 MD 브랜치와 분리).
- **status:** `AUDIT_DRAFT_COMPLETE` (수학·문항별 텍스트 감사 초안만 완료). **22문항/22문항 읽음; KEEP 22 / UPGRADE 0 / HOLD 0 / UNREAD 0**. `nextQid=NONE`. 개선이 필요한 수학/해설 결함을 이번 샘플에서 발견하지 못함. 검증되지 않은 출고 PASS 아님.
- **original provenance:** `sourceKind`/`sourceExamPath`/`sourceQid`는 각 항목에 원래 기록되어 있고, `standardCourse` 22/22 모두 `공통수학2`. JS `content`/`choices`/`answer`/`solution` 변경 없음.
- **image boundary:** 실제 문제 SVG 두 개(q06, q16)의 Git blob 및 SVG 내부 구조·그림 생성계획을 대조했으나 시각 렌더를 열어 판독하지 않음. 기존 solutionImage 9개 학생 화면 렌더·크기·잘림 검사는 `NOT_RUN` (이미지 후속 전담). 문제 SVG 이미지 상태를 `VISUAL_QA_PENDING`으로 둔다. 그림을 보지 않고 최종 시각 PASS를 선언하지 않음.
- **image references:** Q06 `q06-problem-v2.svg` (blob `5f920b2f5121f999818b98ff117394456a715eb8`, 실제 대응도 화살표 인덱스 원문 대조); Q16 `q16-problem-v2.svg` (blob `dab711d49ee6adcb800482f1176b5155a6307a8f`, 점근선·한 점의 생성계획 대조). q06/q16 이미지 입력은 문제의 수학적 사실과 부합하지만 육안·렌더 검사는 별도.
- **execution boundary:** 실제 Golden/Negative 독립 calibration, full core SHA receipt/preflight, 전체 이미지 렌더, JS/SVG 학생 화면, 배포 QA, `main` 운영 병합 `NOT_RUN/NOT_PERFORMED`. 사용자 요청에 따라 1장 완료 후 중단.

## 판정표

| 문항 | 유형 | 판정 | 자료 상태 |
| --- | --- | --- | --- |
| Q01 | 객관식 | KEEP | 별도 image 필드 없음 |
| Q02 | 객관식 | KEEP | 별도 image 필드 없음 |
| Q03 | 객관식 | KEEP | 별도 image 필드 없음 |
| Q04 | 객관식 | KEEP | 별도 image 필드 없음 |
| Q05 | 객관식 | KEEP | 별도 image 필드 없음 |
| Q06 | 객관식 | KEEP | 문제 SVG 구조 확인, 렌더 대기 |
| Q07 | 객관식 | KEEP | 별도 image 필드 없음 |
| Q08 | 객관식 | KEEP | 별도 image 필드 없음 |
| Q09 | 객관식 | KEEP | 해설 SVG 렌더 대기 |
| Q10 | 객관식 | KEEP | 해설 SVG 렌더 대기 |
| Q11 | 객관식 | KEEP | 별도 image 필드 없음 |
| Q12 | 객관식 | KEEP | 해설 SVG 렌더 대기 |
| Q13 | 객관식 | KEEP | 별도 image 필드 없음 |
| Q14 | 객관식 | KEEP | 별도 image 필드 없음 |
| Q15 | 객관식 | KEEP | 해설 SVG 렌더 대기 |
| Q16 | 객관식 | KEEP | 문제 SVG 구조 확인, 렌더 대기 |
| Q17 | 객관식 | KEEP | 별도 image 필드 없음 |
| Q18 | 객관식 | KEEP | 해설 SVG 렌더 대기 |
| Q19 | 객관식 | KEEP | 해설 SVG 렌더 대기 |
| Q20 | 객관식 | KEEP | 해설 SVG 렌더 대기 |
| Q21 | 서술형 | KEEP | 별도 image 필드 없음 |
| Q22 | 서술형 | KEEP | 해설 SVG 렌더 대기 |

## 전 문항 원문·기존 풀이·독립 검산

### Q01 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=1`; `id=1`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
다음 모임 중 집합이 아닌 것은?
```

- 원본 보기: 

```text
① 키가 $170\mathrm{cm}$ 이상인 학생들의 모임
② 방정식 $x^2-5x+6=0$의 실근들의 모임
③ $10$ 이하의 짝수들의 모임
④ 맛있는 과일들의 모임
⑤ $20$ 이하의 $3$의 배수들의 모임
```
- 원본 answer: `④`.
- 기존 solution 원문:

```text
[키포인트] 집합은 각 대상이 그 모임에 속하는지 여부를 객관적으로 분명하게 판정할 수 있어야 한다.
정석 풀이:
1. ‘키가 $170\mathrm{cm}$ 이상’인지는 측정으로 판정할 수 있고, 방정식의 실근들의 모임은 $\{2,3\}$으로 명확하다. 또한 $10$ 이하의 짝수와 $20$ 이하의 $3$의 배수도 객관적으로 정해진다.
2. 반면 ‘맛있는 과일’은 사람마다 판단 기준이 달라 원소가 명확하게 정해지지 않는다.
3. 따라서 집합이 아닌 것은 ④이다.
따라서 정답은 ④이다.
```

- 독립 수학 검산: 집합인지 여부는 원소 소속을 객관적으로 판정할 수 있는지로 결정한다. '맛있는 과일'은 사람에 따라 달라지지만 키·방정식 근·짝수·3의 배수는 명확하다. 객관적 기준이 없는 ④만 집합이 아니다.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 그림: 원본 JS에 문항 image/solutionImage 참조 없음.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q02 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=2`; `id=2`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
집합 $A=\{1,2,3,4,5,6\}$에 대하여 $A$의 원소 중 짝수만을 모은 집합을 $B$라 하자. 다음 중 $B$의 부분집합이 아닌 것은?
```

- 원본 보기: 

```text
① $\{2,6\}$
② $\{2,4,5\}$
③ $\varnothing$
④ $\{4\}$
⑤ $\{2,4,6\}$
```
- 원본 answer: `②`.
- 기존 solution 원문:

```text
[키포인트] 먼저 조건제시법으로 주어진 $B$의 원소를 확정한 뒤 부분집합 여부를 판단한다.
정석 풀이:
1. $A$의 원소 중 짝수는 $2,4,6$이므로 $B=\{2,4,6\}$이다.
2. ①, ③, ④, ⑤는 모든 원소가 $B$에 들어 있으므로 $B$의 부분집합이다.
3. ②의 원소 $5$는 $B$에 속하지 않으므로 $\{2,4,5\}$는 $B$의 부분집합이 아니다.
따라서 정답은 ②이다.
```

- 독립 수학 검산: $B=\{2,4,6\}$. ②의 $5\notin B$, 나머지 네 보기는 모두 원소가 $B$ 안에 있으며 공집합도 모든 집합의 부분집합이다. ②.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 그림: 원본 JS에 문항 image/solutionImage 참조 없음.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q03 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=3`; `id=3`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
세 집합 $A=\{4,a+1\}$, $B=\{4,9\}$, $C=\{a,9\}$가 있다. 양의 정수 $a$에 대하여 $A=B$일 때, $n(A\cup C)$의 값은?
```

- 원본 보기: 

```text
① 7
② 6
③ 5
④ 4
⑤ 3
```
- 원본 answer: `⑤`.
- 기존 solution 원문:

```text
[키포인트] 집합의 상등으로 $a$를 먼저 정한 뒤 새 집합 $C$와의 합집합을 계산한다.
정석 풀이:
1. $A=B$이고 두 집합에 $4$가 공통으로 있으므로 $a+1=9$이다. 따라서 $a=8$이다.
2. 그러면 $A=\{4,9\}$, $C=\{8,9\}$이다.
3. 따라서 $A\cup C=\{4,8,9\}$이고 원소의 개수는 $3$이다.
따라서 정답은 ⑤이다.
```

- 독립 수학 검산: $A=B$에서 $a+1=9\Rightarrow a=8$이다. $C=\{8,9\}$, $A\cup C=\{4,8,9\}$이므로 원소 수는 3, ⑤.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 그림: 원본 JS에 문항 image/solutionImage 참조 없음.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q04 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=4`; `id=4`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
명제 $\sim p\to q$가 거짓일 때, 다음 중 반드시 거짓인 명제는?
```

- 원본 보기: 

```text
① $\sim q\to p$
② $p\to q$
③ $q\to p$
④ $p\to\sim q$
⑤ $\sim p\to\sim q$
```
- 원본 answer: `①`.
- 기존 solution 원문:

```text
[키포인트] 명제 「가정이면 결론이다」가 거짓인 경우는 가정이 참이고 결론이 거짓일 때뿐이다.
정석 풀이:
1. $\sim p\to q$가 거짓이므로 $\sim p$는 참이고 $q$는 거짓이다. 즉 $p$는 거짓, $q$는 거짓이고, $\sim p$와 $\sim q$는 모두 참이다.
2. ① $\sim q\to p$는 가정 $\sim q$가 참이고 결론 $p$가 거짓이므로 거짓이다. (주어진 명제의 대우이므로 참, 거짓이 같다.)
3. ② $p\to q$와 ③ $q\to p$는 가정이 거짓이므로 참이다.
4. ④ $p\to\sim q$도 가정 $p$가 거짓이므로 참이고, ⑤ $\sim p\to\sim q$는 가정과 결론이 모두 참이므로 참이다.
5. 따라서 반드시 거짓인 명제는 ① 하나이다.
따라서 정답은 ①이다.
```

- 독립 수학 검산: $\sim p\to q$가 거짓이면 $\sim p$가 참이고 $q$가 거짓이므로 $p=F,q=F$이다. ① $\sim q\to p$는 $T\to F$로 거짓이고 나머지 명제는 모두 참. 기존의 대우 비교도 정확하다.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 그림: 원본 JS에 문항 image/solutionImage 참조 없음.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q05 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=5`; `id=5`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
정수 $x$에 대하여 $p$: ‘$x$는 $6$의 배수이다.’, $q$: ‘$x$는 $3$의 배수이다.’라 하자. $p$는 $q$이기 위한 어떤 조건인가?
```

- 원본 보기: 

```text
① 충분조건이지만 필요조건은 아니다.
② 필요조건이지만 충분조건은 아니다.
③ 필요충분조건이다.
④ 충분조건도 필요조건도 아니다.
⑤ 항상 거짓인 조건이다.
```
- 원본 answer: `①`.
- 기존 solution 원문:

```text
[키포인트] 충분조건은 $p\to q$, 필요조건은 $q\to p$를 확인한다.
정석 풀이:
1. $6$의 배수는 항상 $3$의 배수이므로 $p\to q$는 참이다.
2. 그러나 $x=3$이면 $q$는 참이지만 $p$는 거짓이므로 $q\to p$는 거짓이다.
3. 따라서 $p$는 $q$의 충분조건이지만 필요조건은 아니다.
따라서 정답은 ①이다.
```

- 독립 수학 검산: $6\mid x\Rightarrow3\mid x$, 역은 $x=3$에서 거짓이다. 따라서 충분조건만 성립하며 ①.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 그림: 원본 JS에 문항 image/solutionImage 참조 없음.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q06 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=6`; `id=6`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
집합 $X=\{-2,-1,0,1\}$, $Y=\{0,1,2,3\}$에 대하여 아래 대응도로 정의된 함수 $f:X\to Y$의 설명 중 옳지 않은 것은?
```

- 원본 보기: 

```text
① 정의역은 $X$이다.
② 공역은 $Y$이다.
③ 치역은 $Y$이다.
④ $f$는 일대일대응이다.
⑤ $f^{-1}(1)=2$
```
- 원본 answer: `⑤`.
- 기존 solution 원문:

```text
[키포인트] 대응도의 화살표를 읽어 정의역·공역·치역·일대일대응·역함수 값을 차례로 확인한다.
정석 풀이:
1. 화살표는 $-2\mapsto1$, $-1\mapsto3$, $0\mapsto0$, $1\mapsto2$이다. 따라서 치역은 $Y$ 전체이고 모든 함숫값이 서로 다르므로 일대일대응이다.
2. $f(-2)=1$이므로 $f^{-1}(1)=-2$이다.
3. 따라서 다섯 번째 설명만 옳지 않다.
따라서 정답은 ⑤이다.
```

- 독립 수학 검산: 실제 q06 SVG의 X 원소 순서는 $-2,-1,0,1$, Y 순서는 $0,1,2,3$이고 화살표 인덱스가 $0\to1,1\to3,2\to0,3\to2$로 저장됐다. 즉 $f(-2)=1,f(-1)=3,f(0)=0,f(1)=2$. 전단사이지만 $f^{-1}(1)=-2\ne2$, ⑤만 거짓이다.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 문제 그림: `assets/images/25_금당고_2학기_기말_고1_유사/q06-problem-v2.svg` 소스 SVG 및 엔진 계획 대조 완료, SVG 렌더 시각 QA **NOT_RUN**. `VISUAL_QA_PENDING`.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q07 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=7`; `id=7`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
두 함수 $f(x)=3x-2$, $g(x)=x^2+1$에 대하여 $(f\circ g)(-1)$의 값은?
```

- 원본 보기: 

```text
① 2
② 3
③ 4
④ 5
⑤ 6
```
- 원본 answer: `③`.
- 기존 solution 원문:

```text
[키포인트] $(f\circ g)(x)$는 $g(x)$를 먼저 계산한 뒤 그 결과를 $f$에 대입한다.
정석 풀이:
1. $g(-1)=(-1)^2+1=2$이다.
2. 따라서 $(f\circ g)(-1)=f(2)=3\cdot2-2=4$이다.
따라서 정답은 ③이다.
```

- 독립 수학 검산: $g(-1)=(-1)^2+1=2$, $f(g(-1))=f(2)=3\cdot2-2=4$로 ③.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 그림: 원본 JS에 문항 image/solutionImage 참조 없음.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q08 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=8`; `id=8`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
함수 $f(x)=ax+b$가 $f(2)=5$, $f^{-1}(11)=4$를 만족시킬 때, $a+b$의 값은?
```

- 원본 보기: 

```text
① 0
② 1
③ 2
④ 3
⑤ 4
```
- 원본 answer: `③`.
- 기존 solution 원문:

```text
[키포인트] $f^{-1}(11)=4$는 $f(4)=11$과 같은 뜻이다.
정석 풀이:
1. $2a+b=5$, $4a+b=11$이다.
2. 두 식을 빼면 $2a=6$이므로 $a=3$, $b=-1$이다.
3. 따라서 $a+b=2$이다.
따라서 정답은 ③이다.
```

- 독립 수학 검산: $f^{-1}(11)=4\Leftrightarrow f(4)=11$. $2a+b=5$, $4a+b=11$에서 $2a=6$, $a=3,b=-1$, $a+b=2$로 ③.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 그림: 원본 JS에 문항 image/solutionImage 참조 없음.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q09 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=9`; `id=9`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
유리함수 $y=\dfrac{k}{x-p}+q$ $(k\ne0)$의 두 점근선이 $x=2$, $y=-1$이고 그래프가 점 $(4,3)$을 지난다. 이 그래프 위에서 $y=1$인 점의 $x$좌표를 $r$라 할 때, $k+r$의 값은?
```

- 원본 보기: 

```text
① 12
② 14
③ 16
④ 18
⑤ 20
```
- 원본 answer: `②`.
- 기존 solution 원문:

```text
[키포인트] 점근선으로 $p,q$를 정하고 한 점으로 $k$를 복원한 뒤 새로운 함수값 조건을 한 번 더 사용한다.
정석 풀이:
1. 점근선에서 $p=2$, $q=-1$이다.
2. $(4,3)$을 대입하면 $3=\dfrac{k}{2}-1$이므로 $k=8$이다.
3. $y=1$이면 $1=\dfrac8{x-2}-1$이므로 $x-2=4$, 따라서 $r=6$이다.
4. 그러므로 $k+r=8+6=14$이다.
따라서 정답은 ②이다.
```

- 독립 수학 검산: 점근선으로 $p=2,q=-1$, 점 $(4,3)$으로 $3=k/2-1\Rightarrow k=8$. $1=8/(r-2)-1$에서 $r-2=4$, $r=6$, 합 $14$로 ②.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 기존 해설 그림: `assets/images/25_금당고_2학기_기말_고1_유사/q09-solution.svg` 사용, 실제 화면 렌더 **NOT_RUN**.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q10 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=10`; `id=10`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
두 무리식 $\sqrt{2x+4}$, $\sqrt{16-x}$의 값이 모두 실수가 되게 하는 정수 $x$ 전체의 집합을 $A$라 하자. $n(A)+\min A+\max A$의 값은?
```

- 원본 보기: 

```text
① 30
② 31
③ 32
④ 33
⑤ 34
```
- 원본 answer: `④`.
- 기존 solution 원문:

```text
[키포인트] 두 진수 조건의 공통 범위를 먼저 구한 뒤 정수 집합의 개수와 양 끝값을 함께 사용한다.
정석 풀이:
1. $2x+4\ge0$에서 $x\ge-2$, $16-x\ge0$에서 $x\le16$이다.
2. 따라서 $A=\{-2,-1,0,\ldots,16\}$이고 $n(A)=19$이다.
3. $\min A=-2$, $\max A=16$이므로 $19-2+16=33$이다.
따라서 정답은 ④이다.
```

- 독립 수학 검산: 두 루트가 실수인 조건은 $x\ge-2$, $x\le16$이다. 정수는 $-2,-1,\ldots,16$의 $16-(-2)+1=19$개. 합 $19-2+16=33$, ④.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 기존 해설 그림: `assets/images/25_금당고_2학기_기말_고1_유사/q10-solution.svg` 사용, 실제 화면 렌더 **NOT_RUN**.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q11 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=11`; `id=11`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
자연수 $k$의 양의 약수 전체의 집합을 $A_k$라 하자. $A_3\subseteq A_n\subseteq A_{36}$을 만족시키는 자연수 $n$의 개수는?
```

- 원본 보기: 

```text
① 6
② 7
③ 8
④ 9
⑤ 10
```
- 원본 answer: `①`.
- 기존 solution 원문:

```text
[키포인트] 약수집합의 포함관계를 자연수의 배수·약수 관계로 바꾼다.
정석 풀이:
1. $A_3\subseteq A_n$이면 $3$의 모든 약수가 $n$의 약수이므로 $n$은 $3$의 배수이다.
2. $A_n\subseteq A_{36}$이면 $n$은 $36$의 약수이다.
3. $36$의 약수 중 $3$의 배수는 $3,6,9,12,18,36$으로 모두 $6$개이다.
따라서 정답은 ①이다.
```

- 독립 수학 검산: $A_3\subseteq A_n$은 $3\mid n$, $A_n\subseteq A_{36}$은 $n\mid36$. 두 조건을 만족하는 $n$은 $3,6,9,12,18,36$의 6개, ①.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 그림: 원본 JS에 문항 image/solutionImage 참조 없음.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q12 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=12`; `id=12`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
두 실수 $x,y$에 대한 명제 ‘$4x+y\ge k$이면 $x\ge2$ 또는 $y\ge1$이다.’가 참이 되도록 하는 정수 $k$ 중 $0\le k\le12$인 것의 개수는?
```

- 원본 보기: 

```text
① 0
② 1
③ 2
④ 3
⑤ 4
```
- 원본 answer: `⑤`.
- 기존 solution 원문:

```text
[키포인트] 조건명제의 결론이 거짓인 범위에서 전제가 참인 반례가 없어야 한다.
정석 풀이:
1. 결론 '$x\ge2$ 또는 $y\ge1$'이 거짓이려면 $x<2$, $y<1$이어야 한다.
2. 이때 $4x+y<4\cdot2+1=9$이므로 $k\ge9$이면 전제 '$4x+y\ge k$'는 성립할 수 없다.
3. 반대로 $k<9$이면 $x=2-\varepsilon$, $y=1-\varepsilon$ ($0<\varepsilon\le\dfrac{9-k}{5}$)로 놓을 수 있다. 이때 $x<2$, $y<1$이지만 $4x+y=9-5\varepsilon\ge k$이므로 반례가 된다.
4. 따라서 필요한 조건은 $k\ge9$이고, $0\le k\le12$인 정수 중 가능한 것은 $9,10,11,12$의 네 개이다.
따라서 정답은 ⑤이다.
```

- 독립 수학 검산: 결론이 거짓인 경우 $x<2,y<1$이어서 $4x+y<9$. 따라서 모든 실수 반례를 막는 경계는 $k\ge9$이고 $k<9$에서는 $x=2-\epsilon,y=1-\epsilon$로 반례 구성 가능. 정수 $9,10,11,12$ 네 개로 ⑤.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 기존 해설 그림: `assets/images/25_금당고_2학기_기말_고1_유사/q12-solution.svg` 사용, 실제 화면 렌더 **NOT_RUN**.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q13 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=13`; `id=13`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
두 양수 $x,y$가 $x+y=10$을 만족할 때, $xy$의 최댓값을 $M$, 그때의 $x,y$를 각각 $a,b$라 하자. $M+a+b$의 값은?
```

- 원본 보기: 

```text
① 33
② 34
③ 35
④ 36
⑤ 37
```
- 원본 answer: `③`.
- 기존 solution 원문:

```text
[키포인트] 합이 일정한 두 양수의 곱은 두 수가 같을 때 최대이다.
정석 풀이:
1. 산술평균과 기하평균의 관계에서 $\dfrac{x+y}{2}\ge\sqrt{xy}$이므로 $5\ge\sqrt{xy}$, 따라서 $xy\le25$이다.
2. 등호는 $x=y=5$일 때 성립하므로 $M=25$, $a=5$, $b=5$이다.
3. 따라서 $M+a+b=25+5+5=35$이다.
따라서 정답은 ③이다.
```

- 독립 수학 검산: $xy\le\{(x+y)/2\}^2=25$, 등호 $x=y=5$에서 성립. $M+a+b=25+5+5=35$로 ③.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 그림: 원본 JS에 문항 image/solutionImage 참조 없음.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q14 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=14`; `id=14`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
집합 $X=\{0,1,2,3,4\}$에서 함수 $f:X\to X$의 함숫값 $f(x)$를 $2x+1$을 $5$로 나눈 나머지로 정한다. $f^3(0)+f^4(0)$의 값은? (단, $f^n$은 $f$를 $n$번 합성한 함수를 뜻한다.)
```

- 원본 보기: 

```text
① 1
② 2
③ 3
④ 4
⑤ 5
```
- 원본 answer: `②`.
- 기존 solution 원문:

```text
[키포인트] $0$에서 시작하여 함숫값의 궤도를 순서대로 따라간다.
정석 풀이:
1. $f(0)=1$, $f(1)=3$, $f(3)=2$, $f(2)=0$이다.
2. 따라서 $f^3(0)=2$, $f^4(0)=0$이다.
3. 그러므로 $f^3(0)+f^4(0)=2$이다.
따라서 정답은 ②이다.
```

- 독립 수학 검산: $0\xmapsto{f}1\xmapsto{f}3\xmapsto{f}2\xmapsto{f}0$이므로 $f^3(0)=2$, $f^4(0)=0$, 합2로 ②.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 그림: 원본 JS에 문항 image/solutionImage 참조 없음.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q15 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=15`; `id=15`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
함수 $f(x)=(x-5)^2+5$ $(x\ge5)$의 그래프와 그 역함수 $y=f^{-1}(x)$의 그래프가 만나는 두 점을 $P,Q$라 하자. 선분 $PQ$의 중점을 $M(r,s)$라 할 때, $r+s$의 값은?
```

- 원본 보기: 

```text
① 8
② 9
③ 10
④ 11
⑤ 12
```
- 원본 answer: `④`.
- 기존 solution 원문:

```text
[키포인트] 이 함수는 $x\ge5$에서 증가하므로 함수와 역함수의 교점은 고정점 $f(x)=x$로 찾을 수 있다.
정석 풀이:
1. $x\ge5$에서 $x$가 커질수록 $(x-5)^2$이 커지므로 $f$는 증가한다. 따라서 $f(a)=b$, $f(b)=a$인 서로 다른 $a,b$가 생길 수 없고, 교점은 $f(x)=x$를 만족한다.
2. $(x-5)^2+5=x$에서 $(x-5)(x-6)=0$이므로 교점은 $(5,5)$, $(6,6)$이다.
3. 중점은 $M\left(\dfrac{11}{2},\dfrac{11}{2}\right)$이므로 $r+s=11$이다.
따라서 정답은 ④이다.
```

- 독립 수학 검산: $x\ge5$에서 $f$는 엄격히 증가하므로 $f(a)=b,f(b)=a$인 $a\ne b$는 불가능하여 교점은 $y=x$에 있다. $(x-5)^2+5=x\Rightarrow(x-5)(x-6)=0$, 두 교점 $(5,5),(6,6)$의 중점은 $(11/2,11/2)$이고 합11, ④.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 기존 해설 그림: `assets/images/25_금당고_2학기_기말_고1_유사/q15-solution.svg` 사용, 실제 화면 렌더 **NOT_RUN**.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q16 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=16`; `id=16`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
유리함수 $y=\dfrac{ax+b}{x+c}$의 그래프가 아래 그림과 같다. 무리함수 $y=\sqrt{ax+b}+c$의 그래프의 끝점을 $(p,q)$라 할 때, $p+q$의 값은?
```

- 원본 보기: 

```text
① 1
② $\dfrac32$
③ 2
④ $\dfrac52$
⑤ 3
```
- 원본 answer: `②`.
- 기존 solution 원문:

```text
[키포인트] 그림에서 유리함수의 점근선과 한 점을 읽어 $a,b,c$를 복원한 뒤 무리함수의 끝점을 구한다.
정석 풀이:
1. 그림의 수평점근선이 $y=2$이므로 $a=2$이고, 수직점근선이 $x=-3$이므로 $c=3$이다.
2. 그래프가 $(0,1)$을 지나므로 $1=\dfrac{b}{3}$에서 $b=3$이다.
3. 따라서 무리함수는 $y=\sqrt{2x+3}+3$이다. 끝점은 진수가 $0$이 되는 $x=-\dfrac32$에서 생기므로 $(p,q)=\left(-\dfrac32,3\right)$이다.
4. 그러므로 $p+q=\dfrac32$이다.
따라서 정답은 ②이다.
```

- 독립 수학 검산: 실제 q16 SVG 생성계획의 유리함수는 $(2x+3)/(x+3)$로 수평점근선 $y=2$, 수직점근선 $x=-3$, 점 $(0,1)$을 지난다. $a=2,b=3,c=3$, 무리함수 $\sqrt{2x+3}+3$의 시작점은 $(-3/2,3)$이므로 합 $3/2$, ②.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 문제 그림: `assets/images/25_금당고_2학기_기말_고1_유사/q16-problem-v2.svg` 소스 SVG 및 엔진 계획 대조 완료, SVG 렌더 시각 QA **NOT_RUN**. `VISUAL_QA_PENDING`.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q17 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=17`; `id=17`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
집합 $A=\{2,3,5,7\}$에 대하여 자연수 $k$의 양의 약수 전체의 집합을 $B$, $k$ 이하인 $5$의 양의 배수 전체의 집합을 $C$라 하자. $A\cap B$의 모든 원소의 합이 $7$이고 $n(A\cup C)=7$일 때, 자연수 $k$의 값은?
```

- 원본 보기: 

```text
① 5
② 10
③ 15
④ 20
⑤ 25
```
- 원본 answer: `④`.
- 기존 solution 원문:

```text
[키포인트] $A\cap B$는 $k$의 한 자리 소수 약수들이고, $C$는 $5$의 배수를 $k$까지 모은 집합이다.
정석 풀이:
1. $C$와 $A$가 공통으로 갖는 원소는 $5$ 하나뿐이므로 $n(A\cup C)=4+\left\lfloor\dfrac{k}{5}\right\rfloor-1$이다. 이 값이 $7$이므로 $\left\lfloor\dfrac{k}{5}\right\rfloor=4$, 따라서 $20\le k\le24$이다.
2. $20,21,22,23,24$의 한 자리 소수 약수를 확인하면 각각 $\{2,5\}$, $\{3,7\}$, $\{2\}$, $\varnothing$, $\{2,3\}$이다.
3. 이 중 원소의 합이 $7$인 것은 $k=20$일 때의 $\{2,5\}$뿐이다.
따라서 정답은 ④이다.
```

- 독립 수학 검산: $C$는 $5,10,\ldots,5\lfloor k/5\rfloor$, $A\cap C=\{5\}$ (해당 후보 범위)이고 $7=4+\lfloor k/5\rfloor-1\Rightarrow\lfloor k/5\rfloor=4$, 즉 $20\le k\le24$. 각 소수 약수의 합이 7인 경우는 20의 $\{2,5\}$뿐, ④.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 그림: 원본 JS에 문항 image/solutionImage 참조 없음.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q18 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=18`; `id=18`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
좌표평면 위에 두 점 $A(-1,3)$, $B(1,-3)$과 직선 $l:2x-y=k$가 있다. 명제 ‘직선 $l$ 위의 어떤 점 $P$에 대하여 $\angle APB=90^\circ$이다.’가 참이 되도록 하는 정수 $k$의 최댓값은?
```

- 원본 보기: 

```text
① 5
② 6
③ 7
④ 8
⑤ 9
```
- 원본 answer: `③`.
- 기존 solution 원문:

```text
[키포인트] 직각인 점 $P$의 자취를 $AB$를 지름으로 하는 원으로 바꿔 원과 직선의 교점 조건을 이용한다.
정석 풀이:
1. $A(-1,3)$, $B(1,-3)$의 중점은 원점이고 $AB=\sqrt{(1+1)^2+(-3-3)^2}=2\sqrt{10}$이다. 따라서 직각인 점 $P$의 자취는 두 끝점 $A,B$를 제외한 원 $x^2+y^2=10$ 위에 있다.
2. 원점에서 직선 $2x-y-k=0$까지의 거리는 $\dfrac{|k|}{\sqrt5}$이다. 원과 직선이 만나려면 $\dfrac{|k|}{\sqrt5}\le\sqrt{10}$, 즉 $|k|\le5\sqrt2$이어야 한다.
3. $7<5\sqrt2<8$이므로 가능한 정수 $k$의 최댓값은 $7$이다.
4. 실제로 $k=7$일 때 $P(3,-1)$은 $2(3)-(-1)=7$과 $3^2+(-1)^2=10$을 만족하며, $A,B$ 어느 점도 아니다. 따라서 직각 조건을 충족하는 점이 존재한다.
따라서 정답은 ③이다.
```

- 독립 수학 검산: $AB$를 지름으로 하는 원은 중심 $(0,0)$, 반지름 $\sqrt{10}$. 직선 $2x-y=k$의 원점 거리 $|k|/\sqrt5\le\sqrt{10}$에서 $|k|\le5\sqrt2$, 가능한 최대 정수 7. $P(3,-1)$은 원·직선 위이면서 A,B와 다르므로 실제 직각 조건도 성립, ③.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 기존 해설 그림: `assets/images/25_금당고_2학기_기말_고1_유사/q18-solution.svg` 사용, 실제 화면 렌더 **NOT_RUN**.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q19 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=19`; `id=19`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
서로 다른 네 실수 $a,b,c,d$로 이루어진 집합 $X=\{a,b,c,d\}$를 정의역으로 하는 함수 $f(x)=|(x-1)(x-5)|$가 상수함수라고 하자. 이 상수함수의 함숫값을 $k$라 할 때, 가능한 정수 $k$의 최댓값은?
```

- 원본 보기: 

```text
① 1
② 2
③ 3
④ 4
⑤ 5
```
- 원본 answer: `③`.
- 기존 solution 원문:

```text
[키포인트] 네 개의 서로 다른 원소에서 함숫값이 모두 $k$가 되려면 방정식 $|(x-1)(x-5)|=k$가 서로 다른 네 실근을 가져야 한다.
정석 풀이:
1. 절댓값의 값이므로 $k\ge0$이다. $k=0$이면 근이 $x=1,5$의 두 개뿐이다.
2. $k>0$일 때 $(x-1)(x-5)=k$와 $(x-1)(x-5)=-k$로 나눈다.
3. 첫째 식은 $(x-3)^2=4+k$이므로 두 실근 $x=3\pm\sqrt{4+k}$를 갖는다.
4. 둘째 식은 $(x-3)^2=4-k$이다. 여기에서 서로 다른 두 실근을 얻으려면 $4-k>0$, 즉 $k<4$이어야 한다. $k=4$에서는 $x=3$ 한 개만 나오고, $k>4$에서는 실근이 없다.
5. $k>0$에서는 첫째 식과 둘째 식의 근이 겹치지 않는다. 따라서 네 개의 서로 다른 실근이 존재할 필요충분조건은 $0<k<4$이다.
6. 가능한 정수 $k$는 $1,2,3$이고 그 최댓값은 $3$이다.
따라서 정답은 ③이다.
```

- 독립 수학 검산: $|(x-1)(x-5)|=|(x-3)^2-4|=k$의 서로 다른 네 실근이 존재하려면 $k>0$, $(x-3)^2=4+k$에서 2근, $(x-3)^2=4-k$에서 2근이 나와야 한다. 따라서 $0<k<4$, 최대 정수3으로 ③.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 기존 해설 그림: `assets/images/25_금당고_2학기_기말_고1_유사/q19-solution.svg` 사용, 실제 화면 렌더 **NOT_RUN**.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q20 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=20`; `id=20`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
정의역과 공역이 각각 실수 전체인 함수 $f$가 $f(x)=\begin{cases}x+c&(x\lt1)\\ax^2+bx+7&(x\ge1)\end{cases}$ $(a\gt0)$이고 $f(0)=4$를 만족한다. $f$의 역함수가 존재하도록 하는 $a$의 값이 최소일 때 그 역함수를 $g$라 하자. $a-b+g(3)$의 값은?
```

- 원본 보기: 

```text
① 2
② 3
③ 4
④ 5
⑤ 6
```
- 원본 answer: `④`.
- 기존 solution 원문:

```text
[키포인트] 먼저 $f(0)$으로 $c$를 복원한 뒤 두 조각의 치역이 겹치지 않고 실수 전체를 덮도록 이차함수의 경계값과 축의 위치를 맞춘다.
정석 풀이:
1. $f(0)=c=4$이므로 첫째 조각은 $x+4$이고 $x\lt1$에서 치역은 $(-\infty,5)$이다.
2. 역함수가 존재하려면 둘째 조각은 $x\ge1$에서 일대일이고 치역이 $[5,\infty)$이어야 한다. 따라서 $f(1)=5$이므로 $a+b+7=5$, 즉 $a+b=-2$이다.
3. $a\gt0$인 이차함수가 $x\ge1$에서 증가하려면 대칭축 $x=-\dfrac{b}{2a}$가 $1$의 왼쪽 또는 $1$에 있어야 한다. 따라서 $2a+b\ge0$이다. $b=-a-2$를 대입하면 $a\ge2$이므로 최소값은 $a=2$, $b=-4$이다.
4. $3$은 첫째 조각의 치역에 속하므로 $x+4=3$에서 $g(3)=-1$이다.
5. 따라서 $a-b+g(3)=2-(-4)-1=5$이다.
따라서 정답은 ④이다.
```

- 독립 수학 검산: $f(0)=c=4$, 왼쪽 치역 $(-\infty,5)$. 전단사 조건으로 오른쪽 치역 $[5,\infty)$와 $f(1)=5$여서 $a+b=-2$. $x\ge1$에서 이차함수 증가 조건 $2a+b\ge0$으로 $a\ge2$, 최소 $a=2,b=-4$. $g(3)=3-4=-1$, 결과5로 ④.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 기존 해설 그림: `assets/images/25_금당고_2학기_기말_고1_유사/q20-solution.svg` 사용, 실제 화면 렌더 **NOT_RUN**.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q21 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=21`; `id=21`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
세 집합 $A=\{1,3,5\}$, $B=\{2,4,6\}$, $C=\{3,6\}$가 있다. (1) $A$와 $B$가 서로소인지 교집합을 이용하여 설명하고, (2) $A$와 $C$가 서로소인지 판정한 뒤 $A\cap C$를 구하시오.
```

- 원본 보기: 서술형, 보기 없음
- 원본 answer: `$A\cap B=\varnothing$이므로 서로소; $A\cap C=\{3\}$이므로 서로소가 아님`.
- 기존 solution 원문:

```text
[키포인트] 두 집합이 서로소라는 것은 교집합이 공집합이라는 뜻이다.
정석 풀이:
1. $A$와 $B$에는 공통 원소가 없으므로 $A\cap B=\varnothing$이다. 따라서 $A$와 $B$는 서로소이다.
2. $A$와 $C$에는 공통 원소 $3$이 있으므로 $A\cap C=\{3\}$이다. 따라서 $A$와 $C$는 서로소가 아니다.
따라서 구하는 결과는 $A\cap B=\varnothing$이므로 서로소이고, $A\cap C=\{3\}$이므로 서로소가 아니다.
```

- 독립 수학 검산: $A\cap B=\varnothing$이고 $A\cap C=\{3\}$. 따라서 A/B는 서로소, A/C는 서로소가 아니다. 서술 정답과 동일하다.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 그림: 원본 JS에 문항 image/solutionImage 참조 없음.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

### Q22 — KEEP

- source identity: `sourceExamPath=original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`; `sourceQid=22`; `id=22`; `standardCourse=공통수학2`; `sourceBlob=518239dcd17a2484de18416f2c46fd1af834cbfc`.
- 원본 문제:

```text
무리함수 $y=\sqrt{x-1}$의 그래프와 직선 $y=2x+k$가 서로 다른 두 점에서 만나도록 하는 $k$의 범위를 $p\le k\lt q$라 하자. $8(p+q)$의 값을 구하시오.
```

- 원본 보기: 서술형, 보기 없음
- 원본 answer: `$-31$`.
- 기존 solution 원문:

```text
[키포인트] $t=\sqrt{x-1}$로 치환하면 교점의 개수는 $t\ge0$인 이차방정식의 서로 다른 두 근 조건으로 바뀐다.
정석 풀이:
1. $t=\sqrt{x-1}\ge0$이면 $x=t^2+1$이다. 교점에서 $t=2(t^2+1)+k$이므로 $2t^2-t+(k+2)=0$이다.
2. 서로 다른 두 실근을 가지려면 판별식이 양수여야 하므로 $1-8(k+2)\gt0$, 즉 $k\lt-\dfrac{15}{8}$이다.
3. 두 근의 합은 $\dfrac12\gt0$이고 곱은 $\dfrac{k+2}{2}$이다. 두 근이 모두 $0$ 이상이려면 $k\ge-2$이어야 한다. $k=-2$에서는 근이 $0,\dfrac12$로 서로 다르므로 포함된다.
4. 따라서 $-2\le k\lt-\dfrac{15}{8}$이므로 $p=-2$, $q=-\dfrac{15}{8}$이다.
5. $8(p+q)=8\left(-2-\dfrac{15}{8}\right)=-31$이다.
따라서 구하는 값은 $-31$이다.
```

- 독립 수학 검산: $t=\sqrt{x-1}\ge0$로 놓으면 $2t^2-t+(k+2)=0$. 두 서로 다른 비음수근은 $D=1-8(k+2)>0$, 근의 합 $1/2>0$, 곱 $(k+2)/2\ge0$로 결정된다. 즉 $-2\le k<-15/8$; $8(p+q)=8(-2-15/8)=-31$이다.
- KEEP 근거: 기존 풀이가 위 검산에서 필요한 조건·중간 계산·선택지/답의 연결을 제공한다. 이번 문항은 수학 오류 또는 학생 이해를 막는 핵심 생략이 발견되지 않아 불필요한 재작성 없음.
- 기존 해설 그림: `assets/images/25_금당고_2학기_기말_고1_유사/q22-solution.svg` 사용, 실제 화면 렌더 **NOT_RUN**.
- 판정 상태: `READ_EVIDENCED / KEEP / RELEASE_QA_NOT_RUN`.

## 샘플 마무리 / 후속 인계

- **전수 텍스트 판정:** Q01~Q22 = 22/22, KEEP 22·UPGRADE 0·HOLD 0·UNREAD 0. 기존 풀이 수학 오류를 발견하지 못했고 원본 JS/정답/보기/SVG는 일절 수정하지 않음.
- **시각 검사 별도:** 문제 그림 Q06 대응도, Q16 유리함수 좌표그래프의 육안/엔진 렌더 점검과 기존 해설 SVG 9개 렌더는 별도 작업 필요. 이 범위에 대한 최종 시각 PASS는 미선언.
- **샘플 기준:** 최신 연도 2025 금당고 1개에 대한 텍스트 MD 완료. 다른 2학기 기말 유사시험지는 이 문서에서 완료 처리하지 않음.
