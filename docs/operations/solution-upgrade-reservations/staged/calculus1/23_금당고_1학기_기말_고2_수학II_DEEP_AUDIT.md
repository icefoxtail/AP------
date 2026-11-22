# 23_금당고_1학기_기말_고2_수학II — lane10 calculus1 deep audit

- sourcePath: `archive/exams/original/high/h2/1final/23_금당고_1학기_기말_고2_수학II.js`; sourceRef `main`, source blob SHA `608a65db86f831d0cbdb62607de29911b4763129`; workerBranch `work/solution-upgrade-lane-10-20261121`.
- sourceExamUid: `23_금당고_1학기_기말_고2_수학II`; standardCourse: `수학II` (2015 교육과정, 현행 미적분Ⅰ 대응); sourceIntakeBatch: `h2-1final-20261012-b1`.
- 1학기 기말 기출 마지막 대상. **AUDIT_DRAFT_COMPLETE / RELEASE_QA_NOT_RUN**; denominator **20/20**; KEEP **13**, UPGRADE **2** (Q15, Q20 학생용 대체 해설 완성), HOLD **5** (Q05, Q09, Q10, Q11, Q13 원본 그림/그래프), UNREAD **0**; nextQid **NONE**.
- 사용자 최신 지시: **이미지는 별도 검수**. 원본 문제 이미지와 보기 PNG는 이번 작업에서 열어보지 않았으므로 해당 5개 문항을 **VISUAL_HOLD**로 명확히 남기고, 기존 해설 SVG(q08, q18, q19, q20) 렌더는 **NOT_RUN**. 수학적 텍스트 감사만 완료.
- 기존 문서와의 중복: 이 sourceKey의 lane10 감사 MD는 작성 전 GitHub에서 404(미존재) 확인. 기존 작업 브랜치의 2025 금당고 기말 MD와 다른 시험지.
- 작업 규칙 확인: 원격 하네스 `HARNESS_CURRENT.md`, `DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md`, `GLOBAL_QUEUE_CURRENT.md`, root/archive `AGENTS.md`, `RULEBOOK_CURRENT.md`, 학생용해설 정본·board examples 본문 확인. 자동 preflight SHA-256 receipt, Golden/Negative 독립 calibration, 전체 core 전수 검증은 **NOT_RUN**. 공유 claims는 lane10 사용자 지시로 **SKIPPED_BY_USER**.
- 원본 `content`/`choices`/`answer`/`solution` 불변. JS·SVG·원본 문제/정답·`main` 수정 **NOT_PERFORMED**. 본 문서는 운영 출고 PASS가 아닌 학생용 개선 **MD 초안**.

## 전수 결과와 출고 경계

| qid | 판정 | 수학 계산 검토 | 이미지 검토 |
| --- | --- | --- | --- |
| Q01 | KEEP | 독립 산식/이유 본문 기록 | 문항 이미지 참조 없음 |
| Q02 | KEEP | 독립 산식/이유 본문 기록 | 문항 이미지 참조 없음 |
| Q03 | KEEP | 독립 산식/이유 본문 기록 | 문항 이미지 참조 없음 |
| Q04 | KEEP | 독립 산식/이유 본문 기록 | 문항 이미지 참조 없음 |
| Q05 | HOLD | 독립 산식/이유 본문 기록 | VISUAL_HOLD |
| Q06 | KEEP | 독립 산식/이유 본문 기록 | 문항 이미지 참조 없음 |
| Q07 | KEEP | 독립 산식/이유 본문 기록 | 문항 이미지 참조 없음 |
| Q08 | KEEP | 독립 산식/이유 본문 기록 | 해설 SVG NOT_RUN |
| Q09 | HOLD | 독립 산식/이유 본문 기록 | VISUAL_HOLD |
| Q10 | HOLD | 독립 산식/이유 본문 기록 | VISUAL_HOLD |
| Q11 | HOLD | 독립 산식/이유 본문 기록 | VISUAL_HOLD |
| Q12 | KEEP | 독립 산식/이유 본문 기록 | 문항 이미지 참조 없음 |
| Q13 | HOLD | 독립 산식/이유 본문 기록 | VISUAL_HOLD |
| Q14 | KEEP | 독립 산식/이유 본문 기록 | 문항 이미지 참조 없음 |
| Q15 | UPGRADE | 독립 산식/이유 본문 기록 | 문항 이미지 참조 없음 |
| Q16 | KEEP | 독립 산식/이유 본문 기록 | 문항 이미지 참조 없음 |
| Q17 | KEEP | 독립 산식/이유 본문 기록 | 문항 이미지 참조 없음 |
| Q18 | KEEP | 독립 산식/이유 본문 기록 | 해설 SVG NOT_RUN |
| Q19 | KEEP | 독립 산식/이유 본문 기록 | 해설 SVG NOT_RUN |
| Q20 | UPGRADE | 독립 산식/이유 본문 기록 | 해설 SVG NOT_RUN |

## 문항별 원문·기존 해설·독립 검산

### Q01 — KEEP

- sourceQid: `q01`; sourceOrdinal: `1`; questionUid: `qid_v1_b645af48746ccd8fb2b6b4ffd8c06c91cc90c3528c5b0d05cf24975064327073`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
다음 중 함수 $f(x)=-x^3+3x+2$가 증가하는 구간은? [4점]
```

- 원본 보기: 

```text
① $(-\infty, -1]$
② $(-\infty, 1]$
③ $[-1, 1]$
④ $[-1, \infty)$
⑤ $[1, \infty)$
```
- 원본 answer: `③`.
- 기존 solution 원문:

```text
$f'(x)=-3(x-1)(x+1)$이므로 $f'(x)>0$은 $-1<x<1$에서 성립한다. 증가구간은 $[-1,1]$이므로 ③이다.
```

- 독립 수학 검토: 도함수 $f'(x)=-3(x-1)(x+1)$은 $-1<x<1$에서 양수, 그 밖에서 음수다. 증가하는 닫힌 구간은 $[-1,1]$로 선택지 ③과 일치한다.
- 판정 이유: 기존 해설에 도함수 인수분해·부호 범위·증가 구간의 세 단계가 모두 보인다.
- 이미지·그래프: 원본 JS에 별도 문제 image/이미지 보기 참조 없음.
- 상태: READ_EVIDENCED / KEEP / QA_NOT_RUN.

### Q02 — KEEP

- sourceQid: `q02`; sourceOrdinal: `2`; questionUid: `qid_v1_7a0fc35a9c870b84825077125b700c4937667a6a376f2e8f46069f7f587eff8e`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
함수 $f(x)$가 $f'(x)=3x^2+1$을 만족시키고 $f(1)=3$일 때, $f(0)$의 값은? [4점]
```

- 원본 보기: 

```text
① $-2$
② $-1$
③ $0$
④ $1$
⑤ $2$
```
- 원본 answer: `④`.
- 기존 solution 원문:

```text
$f(1)-f(0)=\int_0^1(3x^2+1)dx=2$이다. $f(1)=3$이므로 $f(0)=1$, 정답은 ④이다.
```

- 독립 수학 검토: $f(1)-f(0)=\int_0^1(3x^2+1)\,dx=[x^3+x]_0^1=2$, 따라서 $f(0)=3-2=1$이다.
- 판정 이유: 원문 해설의 정적분 $=2$와 끝값 관계가 바로 제시돼 있고 선택지 ④까지 연결된다.
- 이미지·그래프: 원본 JS에 별도 문제 image/이미지 보기 참조 없음.
- 상태: READ_EVIDENCED / KEEP / QA_NOT_RUN.

### Q03 — KEEP

- sourceQid: `q03`; sourceOrdinal: `3`; questionUid: `qid_v1_30aec359135aa88084d385bec9eae21f5b534d602c9f227a58226b76d72903fe`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
정적분 $\int_{-2}^{2}(6x^2-2x-3)dx$의 값은? [4점]
```

- 원본 보기: 

```text
① $18$
② $19$
③ $20$
④ $21$
⑤ $22$
```
- 원본 answer: `③`.
- 기존 solution 원문:

```text
$-2x$는 홀함수라 대칭구간 적분이 0이다. $\int_{-2}^{2}6x^2dx=32$, $\int_{-2}^{2}-3dx=-12$이므로 값은 20, 정답 ③이다.
```

- 독립 수학 검토: 대칭구간에서 홀수항 $-2x$의 적분은 $0$. $\int_{-2}^2 6x^2dx=32$, $\int_{-2}^2(-3)dx=-12$, 합은 $20$이다.
- 판정 이유: 홀함수 소거와 나머지 두 항의 적분값을 기존 해설이 각각 명시했다.
- 이미지·그래프: 원본 JS에 별도 문제 image/이미지 보기 참조 없음.
- 상태: READ_EVIDENCED / KEEP / QA_NOT_RUN.

### Q04 — KEEP

- sourceQid: `q04`; sourceOrdinal: `4`; questionUid: `qid_v1_cf91d7d0b166b80ef2a7342eceea511f9e2cfb7879b6f4c75e6ebdbe21eae03d`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
수직선 위를 움직이는 점 $P$의 시각 $t$에서 위치 $x$가 $x=t^3+2t^2-5$일 때, $t=2$에서 점 $P$의 속도는? [4점]
```

- 원본 보기: 

```text
① $0$
② $5$
③ $10$
④ $15$
⑤ $20$
```
- 원본 answer: `⑤`.
- 기존 solution 원문:

```text
속도는 위치의 도함수이므로 $v(t)=3t^2+4t$이다. $v(2)=20$, 정답 ⑤이다.
```

- 독립 수학 검토: $v(t)=\frac{dx}{dt}=3t^2+4t$, $v(2)=3\cdot4+4\cdot2=20$이다.
- 판정 이유: 위치의 시간미분이 속도라는 정의와 대입이 기존 해설에 있다.
- 이미지·그래프: 원본 JS에 별도 문제 image/이미지 보기 참조 없음.
- 상태: READ_EVIDENCED / KEEP / QA_NOT_RUN.

### Q05 — HOLD

- sourceQid: `q05`; sourceOrdinal: `5`; questionUid: `qid_v1_196e4d026058250e14e08a1b07c37af17ed8db8098b0fc79bf1b648e612a230a`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
함수 $y=x^4-8x^2+12$의 그래프의 개형으로 옳은 것은? [4.2점]
```

- 원본 보기: 

```text
① <img src="assets/images/23_금당고_1학기_기말_고2_수학II/q5-choice-1.png" class="choice-img" alt="그래프 보기 1">
② <img src="assets/images/23_금당고_1학기_기말_고2_수학II/q5-choice-2.png" class="choice-img" alt="그래프 보기 2">
③ <img src="assets/images/23_금당고_1학기_기말_고2_수학II/q5-choice-3.png" class="choice-img" alt="그래프 보기 3">
④ <img src="assets/images/23_금당고_1학기_기말_고2_수학II/q5-choice-4.png" class="choice-img" alt="그래프 보기 4">
⑤ <img src="assets/images/23_금당고_1학기_기말_고2_수학II/q5-choice-5.png" class="choice-img" alt="그래프 보기 5">
```
- 원본 answer: `②`.
- 기존 solution 원문:

```text
$y'=4x(x-2)(x+2)$이므로 임계점은 $-2,0,2$이다. 부호는 $-,+,-,+$이고 $y(\pm2)=-4$, $y(0)=12$이다. 따라서 양 끝이 위로 향하고 $\pm2$에서 같은 극소, 0에서 극대인 ②이다.
```

- 독립 수학 검토: $y'=4x(x-2)(x+2)$; 증감 부호는 $-,+,-,+$, $y(\pm2)=16-32+12=-4$, $y(0)=12$. 함수는 짝함수이고 양끝이 위를 향한다.
- 판정 이유: 기존 식으로 그래프의 필수 특징은 검산됐으나 선택지 자체가 PNG 다섯 장이다. 사용자 지시대로 이미지 판독은 별도 진행하므로 ②와 실제 그림의 일치 여부를 확정하지 않는다.
- 이미지·그래프: **VISUAL_HOLD: q5-choice-1.png ~ q5-choice-5.png (원본 보기 이미지 5장)**. 참조: `assets/images/23_금당고_1학기_기말_고2_수학II/q5-choice-1.png`, `assets/images/23_금당고_1학기_기말_고2_수학II/q5-choice-2.png`, `assets/images/23_금당고_1학기_기말_고2_수학II/q5-choice-3.png`, `assets/images/23_금당고_1학기_기말_고2_수학II/q5-choice-4.png`, `assets/images/23_금당고_1학기_기말_고2_수학II/q5-choice-5.png`.
- 상태: READ_EVIDENCED / VISUAL_HOLD.

### Q06 — KEEP

- sourceQid: `q06`; sourceOrdinal: `6`; questionUid: `qid_v1_115ae97778dd60c1a427d2dda60970474fecb2a6d048e42e9918adb7f233d9bf`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
함수 $f(x)=2x^3-3x^2+1$의 극댓값을 $M$, 극솟값을 $m$이라고 할 때, $M+m$의 값은? [4.2점]
```

- 원본 보기: 

```text
① $-2$
② $-1$
③ $0$
④ $1$
⑤ $2$
```
- 원본 answer: `④`.
- 기존 solution 원문:

```text
$f'=6x(x-1)$에서 $x=0$은 극대, $x=1$은 극소다. $M=f(0)=1$, $m=f(1)=0$이므로 $M+m=1$, ④이다.
```

- 독립 수학 검토: $f'(x)=6x(x-1)$의 부호가 $+,-,+$이므로 $x=0$에서 극대 $f(0)=1$, $x=1$에서 극소 $f(1)=0$이다. 합 $1$이다.
- 판정 이유: 기존 해설에 임계점·극대극소 구별·두 함수값이 모두 있다.
- 이미지·그래프: 원본 JS에 별도 문제 image/이미지 보기 참조 없음.
- 상태: READ_EVIDENCED / KEEP / QA_NOT_RUN.

### Q07 — KEEP

- sourceQid: `q07`; sourceOrdinal: `7`; questionUid: `qid_v1_d2eebf71461c6e7630243dbca7656eb2af1857375c519909069e21e124ef671d`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
방정식 $x^3-3x^2+3x+1=0$의 서로 다른 실근의 개수는? [4.2점]
```

- 원본 보기: 

```text
① $0$
② $1$
③ $2$
④ $3$
⑤ $4$
```
- 원본 answer: `②`.
- 기존 solution 원문:

```text
$x^3-3x^2+3x+1=(x-1)^3+2$이므로 $(x-1)^3=-2$는 실근이 하나뿐이다. 정답 ②이다.
```

- 독립 수학 검토: $(x-1)^3+2=0$은 $(x-1)^3=-2$와 동치다. 세제곱 함수는 엄격히 증가하므로 실근 $x=1-\sqrt[3]2$ 하나뿐이다.
- 판정 이유: 기존 인수형 변환과 실근 유일성 논리가 곧바로 연결된다.
- 이미지·그래프: 원본 JS에 별도 문제 image/이미지 보기 참조 없음.
- 상태: READ_EVIDENCED / KEEP / QA_NOT_RUN.

### Q08 — KEEP

- sourceQid: `q08`; sourceOrdinal: `8`; questionUid: `qid_v1_1f406aaf516f96c460cbfefd46c82acd59f92a33d2524a301801558b2acf29eb`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
다항함수 $f(x)=-3x^2+6x+9$과 $x$축으로 둘러싸인 도형의 넓이는? [4.2점]
```

- 원본 보기: 

```text
① $17$
② $22$
③ $27$
④ $32$
⑤ $37$
```
- 원본 answer: `④`.
- 기존 solution 원문:

```text
$f=-3(x-3)(x+1)$이고 두 영점 사이에서 양수다. 넓이는 $\int_{-1}^{3}f(x)dx=[-x^3+3x^2+9x]_{-1}^{3}=27-(-5)=32$, ④이다.
```

- 독립 수학 검토: $f(x)=-3(x-3)(x+1)$, 양의 구간은 $(-1,3)$이다. 원시함수 $F(x)=-x^3+3x^2+9x$에서 $F(3)=27$, $F(-1)=-5$, 면적 $32$다.
- 판정 이유: 기존 해설이 교점·부호·정적분 상하한·원시함수값을 제시해 선택지 ④를 정당화한다. 기존 해설 SVG는 별도 시각검수 예정.
- 이미지·그래프: 기존 solutionImage `assets/images/23_금당고_1학기_기말_고2_수학II/q8-solution.svg` 렌더 **NOT_RUN** (문항 원본 그림 직접 조건에는 의존하지 않음).
- 상태: READ_EVIDENCED / KEEP / QA_NOT_RUN.

### Q09 — HOLD

- sourceQid: `q09`; sourceOrdinal: `9`; questionUid: `qid_v1_32220c7ca88493ffe2a8a27459e548d3ee3ad7c81170bb914dc2530dbc5adca3`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
함수 $f(x)=-2x^3+ax^2+bx+c$의 도함수 $y=f'(x)$의 그래프가 다음 그림과 같다. 함수 $f(x)$의 극솟값이 4일 때, $f(x)$의 극댓값은? [4.2점]<br>
```

- 원본 보기: 

```text
① $1$
② $2$
③ $3$
④ $4$
⑤ $5$
```
- 원본 answer: `⑤`.
- 기존 solution 원문:

```text
그래프에서 $f'$는 $(-1,0)$에서 양수이고 그 넓이는 1이다. 따라서 $f(0)-f(-1)=1$이며 $f(0)=5$, 정답 ⑤이다.
```

- 독립 수학 검토: 기존 해설이 주장하는 도함수 부호·면적 $\int_{-1}^0f'(x)dx=1$을 전제로 하면 $f(0)=f(-1)+1=5$다. 하지만 이 전제는 원본 도함수 그래프를 읽어야 확정된다.
- 판정 이유: 원본 q9.png의 축·부호·면적 주석을 직접 판독하지 않았으므로 그림에서 도출한 수치 1과 답 ⑤의 시각 일치를 보류한다.
- 이미지·그래프: **VISUAL_HOLD: q9.png**. 참조: `assets/images/23_금당고_1학기_기말_고2_수학II/q9.png`.
- 상태: READ_EVIDENCED / VISUAL_HOLD.

### Q10 — HOLD

- sourceQid: `q10`; sourceOrdinal: `10`; questionUid: `qid_v1_87546ad24d0025d7b47386fcc48a488df36b50c39c9c9bfe1744f2503296b361`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
원점을 출발하여 수직선 위를 7초 동안 움직이는 점 P의 $t$초 후의 속도 $v(t)$가 다음 그림과 같을 때, 옳은 것만을 &lt;보기&gt;에서 있는 대로 고른 것은? [4.2점]<br><br>&lt;보기&gt;<br>ㄱ. 점 P는 출발하고 나서 1초 동안 멈춘 적이 없다.<br>ㄴ. 점 P는 움직이는 동안 방향을 4번 바꾼다.<br>ㄷ. 점 P는 출발하고 나서 2초 후 운동 방향을 바꾼다.
```

- 원본 보기: 

```text
① ㄱ
② ㄷ
③ ㄱ, ㄴ
④ ㄱ, ㄷ
⑤ ㄴ, ㄷ
```
- 원본 answer: `④`.
- 기존 solution 원문:

```text
그래프에서 속도 부호는 $(0,2)$ 양수, $(2,4)$ 음수, $(4,7)$ 양수다. 방향 전환은 2회라 ㄴ은 거짓, ㄱ·ㄷ은 참이므로 ④이다.
```

- 독립 수학 검토: 기존 해설의 구간별 속도 부호가 $+,-,+$로 맞다면 방향 전환은 $t=2,4$에서 2회라 ㄴ은 거짓이고 ㄱ·ㄷ은 참이다.
- 판정 이유: 속도 그래프 q10.png에서 영점, 부호 및 출발 직후 정지 여부를 독립 판독하지 않았다. 이미지 작업 전 ㄱ·ㄷ 확정 불가.
- 이미지·그래프: **VISUAL_HOLD: q10.png**. 참조: `assets/images/23_금당고_1학기_기말_고2_수학II/q10.png`.
- 상태: READ_EVIDENCED / VISUAL_HOLD.

### Q11 — HOLD

- sourceQid: `q11`; sourceOrdinal: `11`; questionUid: `qid_v1_705dfb153b7e97463ea1b7c26ce445695b3e82cd476d624ba99d0ed364b5f4de`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
그림과 같이 곡선 $y=3x^2$ ($x \ge 0$)과 직선 $y=a(x-3)$ 및 $y$축으로 둘러싸인 부분의 넓이를 A, 곡선 $y=3x^2$ ($x \ge 0$)과 직선 $y=a(x-3)$ 및 직선 $x=2$로 둘러싸인 부분의 넓이를 B라 하자. $\text{A}=\text{B}$일 때, 상수 $a$의 값은? (단, $a<0$) [4.8점]<br>
```

- 원본 보기: 

```text
① $-5$
② $-4$
③ $-3$
④ $-2$
⑤ $-1$
```
- 원본 answer: `④`.
- 기존 solution 원문:

```text
$A=B$이므로 $\int_0^2\{a(x-3)-3x^2\}dx=0$. 좌변은 $-4a-8$이므로 $a=-2$, ④이다.
```

- 독립 수학 검토: 기존 해설의 $A=B$에 따른 부호 있는 적분식은 $\int_0^2\{a(x-3)-3x^2\}dx=-4a-8=0$, 따라서 $a=-2$다. 이때 곡선·직선의 교점은 $x=(-1+\sqrt{19})/3\in(0,2)$이다.
- 판정 이유: A, B 두 넓이를 양쪽으로 나눈 도형의 정확한 경계와 색/영역 지정은 q11.png에 의존하므로 그림 별도 판독까지 보류한다.
- 이미지·그래프: **VISUAL_HOLD: q11.png**. 참조: `assets/images/23_금당고_1학기_기말_고2_수학II/q11.png`.
- 상태: READ_EVIDENCED / VISUAL_HOLD.

### Q12 — KEEP

- sourceQid: `q12`; sourceOrdinal: `12`; questionUid: `qid_v1_95969134224e0ca7d6523a4442057c4cb4739f87149526a88de21547042ae3e3`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
다항함수 $f(x)$가<br>$$\int_{2}^{3} f(x)dx = 5, \quad \int_{2}^{6} f(x)dx = 6, \quad \int_{6}^{8} f(x)dx = 8$$<br>을 만족시킬 때, 정적분 $\int_{3}^{8} \{f(x)-4\}dx$의 값은? [4.8점]
```

- 원본 보기: 

```text
① $-11$
② $-5$
③ $5$
④ $11$
⑤ $14$
```
- 원본 answer: `①`.
- 기존 solution 원문:

```text
$\int_3^8f=\int_2^8f-\int_2^3f=(6+8)-5=9$. 따라서 $\int_3^8(f-4)=9-20=-11$, ①이다.
```

- 독립 수학 검토: $\int_3^8 f=(\int_2^6 f+\int_6^8 f)-\int_2^3f=6+8-5=9$. $\int_3^8 4dx=4(8-3)=20$. 차이는 $-11$이다.
- 판정 이유: 적분구간의 덧셈·뺄셈과 상수 적분이 기존 해설에 명시돼 있다.
- 이미지·그래프: 원본 JS에 별도 문제 image/이미지 보기 참조 없음.
- 상태: READ_EVIDENCED / KEEP / QA_NOT_RUN.

### Q13 — HOLD

- sourceQid: `q13`; sourceOrdinal: `13`; questionUid: `qid_v1_34b58569ffe3a69b22f64f1401ec5c8b1117b9d672ff2ed388d4802979f36b32`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
오른쪽 그림과 같이 한 변의 길이가 6인 정삼각형 모양의 종이의 세 모퉁이에서 합동인 사각형을 잘라 내고 남은 부분을 접어서 뚜껑이 없는 삼각기둥 모양의 상자를 만들려고 한다. 이 상자의 부피의 최댓값은? [4.8점]<br>
```

- 원본 보기: 

```text
① $4$
② $6$
③ $8$
④ $10$
⑤ $12$
```
- 원본 answer: `①`.
- 기존 solution 원문:

```text
띠의 높이를 $h$라 하자. 각 꼭짓점에서 생기는 $30^\circ$ 직각삼각형 때문에 내접한 정삼각형의 한 변은 $6-2\sqrt3h$이다. 따라서 상자 부피는
\[V(h)=\frac{\sqrt3}{4}(6-2\sqrt3h)^2h,\quad 0<h<\sqrt3.\]
미분하면
\[V'(h)=\frac{\sqrt3}{4}(6-2\sqrt3h)(6-6\sqrt3h)\]
이므로 내부 임계점은 $h=1/\sqrt3$이다. 양 끝에서 부피는 0이고 이 점에서 최댓값이며, $V(1/\sqrt3)=4$이다. 정답은 ①이다.
```

- 독립 수학 검토: 기존 모델 $V(h)=\frac{\sqrt3}{4}(6-2\sqrt3h)^2h$, $0<h<\sqrt3$를 대수 검산하면 $V'(h)=\frac{\sqrt3}{4}(6-2\sqrt3h)(6-6\sqrt3h)$이다. $h=1/\sqrt3$에서 $V=4$다.
- 판정 이유: 원본 q13.png의 접기선·잘라내는 사각형·높이와 밑변 대응을 판독하지 않아 모델의 기하적 출발점은 확인되지 않았다.
- 이미지·그래프: **VISUAL_HOLD: q13.png**. 참조: `assets/images/23_금당고_1학기_기말_고2_수학II/q13.png`.
- 상태: READ_EVIDENCED / VISUAL_HOLD.

### Q14 — KEEP

- sourceQid: `q14`; sourceOrdinal: `14`; questionUid: `qid_v1_d95dfdb80bbe7618f95d7eb52eaed526907cd4df9c3055eb9e00506102981378`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
최고차항의 계수가 1인 삼차함수 $f(x)$가 다음 조건을 모두 만족시킨다. $g(x)=f(x)-f'(x)$라 할 때, $g(1)$의 최솟값은? [4.8점]<br>가) $f(0)=f'(0)$<br>나) $x \ge -2$인 모든 실수 $x$에 대하여 $f(x) \ge f'(x)$
```

- 원본 보기: 

```text
① $1$
② $2$
③ $3$
④ $4$
⑤ $5$
```
- 원본 answer: `③`.
- 기존 solution 원문:

```text
$g=f-f'=x^3+(a-3)x^2+(b-2a)x$이고 $g(0)=0$. $g\ge0$가 0 양옆에서 성립하려면 $g'(0)=b-2a=0$이다. 그러면 $g=x^2(x+a-3)$이고 $g(-2)\ge0$에서 $a\ge5$. $g(1)=a-2$의 최솟값은 3, ③이다.
```

- 독립 수학 검토: $f=x^3+ax^2+bx+c$에서 $f(0)=f'(0)$은 $c=b$. $g=x^3+(a-3)x^2+(b-2a)x$이고 $g(0)=0$. 내부 최소 $x=0$으로 $g'(0)=0$, $b=2a$. 따라서 $g=x^2(x+a-3)$; 모든 $x\ge-2$에서 비음수이려면 $a\ge5$. $g(1)=a-2\ge3$.
- 판정 이유: 기존 해설은 내부 영점의 미분조건을 사용하고 전체 정의역 최솟값을 $x=-2$에서 검사하는 핵심을 모두 담고 있다.
- 이미지·그래프: 원본 JS에 별도 문제 image/이미지 보기 참조 없음.
- 상태: READ_EVIDENCED / KEEP / QA_NOT_RUN.

### Q15 — UPGRADE

- sourceQid: `q15`; sourceOrdinal: `15`; questionUid: `qid_v1_8d08bae1168f634624304a231a6d5f3d569c45a55717b2761731229145ca5b33`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
최고차항의 계수가 1인 삼차함수 $f(x)$에 대하여 함수 $g(x)=|(x-1)f(x)|$가 $x=3$에서만 미분가능하지 않을 때, 함수 $h(x)=|(x-1)f'(x)|$는 $x=k$에서만 미분가능하지 않다. 상수 $k$의 값은? [4.8점]
```

- 원본 보기: 

```text
① $1$
② $\frac{4}{3}$
③ $\frac{5}{3}$
④ $2$
⑤ $\frac{7}{3}$
```
- 원본 answer: `⑤`.
- 기존 solution 원문:

```text
$(x-1)f(x)$의 절댓값이 3에서만 꺾이려면 $x=1$ 영점은 짝수 중복도여야 하므로 $f=(x-1)^2(x-3)$. 그러면 $(x-1)f'=(x-1)^2(3x-7)$이고 홀수 중복도 영점은 $\frac{7}{3}$뿐이다. 정답 ⑤이다.
```

- 독립 수학 검토: $P(x)=(x-1)f(x)$에서 $|P|$가 실근에서 미분 불가능하려면 그 근이 단순근이어야 한다. $x=1$은 중근 이상이어야 하고 $x=3$은 단순근이다. 따라서 $f(x)=(x-1)^2(x-3)$이며 $h(x)=|(x-1)^2(3x-7)|$는 $x=7/3$에서만 미분 불가능하다.
- 판정 이유: 기존 해설은 'x=1 영점은 짝수 중복도여야'라고 했지만 짝수가 아닌 3중근에서도 절댓값은 미분 가능하다. 실제 $(x-1)f(x)=(x-1)^3(x-3)$이다. 결론은 맞아도 중복도 판정이 수학적으로 틀려 완성 대체 풀이가 필요하다.
- 이미지·그래프: 원본 JS에 별도 문제 image/이미지 보기 참조 없음.

**기존 A→B 결함 및 완성 학생용 대체 solution (운영 JS 미반영)**

절댓값 함수 $|P(x)|$에서 $P(x)$가 $x=c$에서 $0$이면, $P$가 $c$에서 단순근일 때만 $|P|$가 뾰족해집니다. 근의 중복도가 $2$ 이상이면 $P(c)=P'(c)=0$이어서 $|P|$도 $c$에서 미분 가능합니다.

먼저 $P(x)=(x-1)f(x)$라 둡니다. $P(1)=0$이지만 $|P|$는 $x=1$에서 미분 가능해야 하므로 $P$는 $1$에서 중근 이상입니다. 따라서 $f(1)=0$입니다.

한편 $|P|$는 $x=3$에서 미분 가능하지 않으므로 $P(3)=0$이고, $3$은 $P$의 단순근입니다. $3\ne1$이므로 $f(3)=0$입니다.

$f$는 최고차항의 계수가 $1$인 삼차함수이므로
\[
f(x)=(x-1)(x-3)(x-r)
\]
로 놓을 수 있습니다.

만약 $r$이 $1$과 $3$ 어느 쪽도 아니라면 $|P|$는 $x=r$에서도 뾰족해집니다. 또한 $r=3$이면 $P$는 $x=3$에서 중근이 되어 그곳에서도 미분 가능해집니다. 따라서
\[
r=1,\qquad f(x)=(x-1)^2(x-3)
\]
입니다. 실제로
\[
P(x)=(x-1)^3(x-3)
\]
이므로 $x=1$에서는 미분 가능하고 $x=3$에서만 미분 가능하지 않습니다.

이제 도함수를 구하면
\[
\begin{aligned}
f'(x)&=2(x-1)(x-3)+(x-1)^2\\
&=(x-1)\{2(x-3)+(x-1)\}\\
&=(x-1)(3x-7).
\end{aligned}
\]
따라서
\[
\begin{aligned}
h(x)&=|(x-1)f'(x)|\\
&=|(x-1)^2(3x-7)|.
\end{aligned}
\]
$x=1$은 중근이므로 미분 가능하고, $x=\dfrac73$은 단순근이므로 미분 가능하지 않습니다.

따라서 $\boxed{k=\dfrac73}$이며 정답은 ⑤입니다.

- 독립 역검산: 도출한 f의 최고차항 계수 1, P의 단순근 3·3중근 1, h의 단순근 7/3 확인.
- 상태: READ_EVIDENCED / DRAFT_STAGED / QA_NOT_RUN.

### Q16 — KEEP

- sourceQid: `q16`; sourceOrdinal: `16`; questionUid: `qid_v1_4bf7270ed41b3a86767d5a9f1865d64408ce12db72d4fee38f4098eb5384c0f0`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
함수 $f(x)=x^2+2$에 대하여 함수 $g(x)$를<br>$$g(x)=(x-1)f(x)-\int_{1}^{x} tf'(t)dt$$<br>라 할 때, $g(2)$의 값은? [4.8점]
```

- 원본 보기: 

```text
① $1$
② $\frac{4}{3}$
③ $\frac{5}{3}$
④ $2$
⑤ $\frac{7}{3}$
```
- 원본 answer: `②`.
- 기존 solution 원문:

```text
$f'(t)=2t$이므로 $\int_1^2tf'(t)dt=\int_1^22t^2dt=\frac{14}{3}$. $(2-1)f(2)=6$이므로 $g(2)=6-\frac{14}{3}=\frac{4}{3}$, ②이다.
```

- 독립 수학 검토: $\int_1^2tf'(t)dt=\int_1^2 2t^2dt=[2t^3/3]_1^2=14/3$, $(2-1)f(2)=6$, $g(2)=6-14/3=4/3$이다.
- 판정 이유: 기존 해설에 도함수·적분·대입 계산이 모두 있어 선택지 ②와 연결된다.
- 이미지·그래프: 원본 JS에 별도 문제 image/이미지 보기 참조 없음.
- 상태: READ_EVIDENCED / KEEP / QA_NOT_RUN.

### Q17 — KEEP

- sourceQid: `q17`; sourceOrdinal: `17`; questionUid: `qid_v1_675a4dd2ff3e0d8e45057c9ed3d30022946a5bcf1dfbea9c1d8a75cf40cc8843`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
&lt;단답형 1&gt;<br>함수 $f(x)=x^3-3x^2-9x+k$에 대하여 함수 $g(x)$를<br>$$g(x)=|f(x)|$$<br>라 하자. 함수 $g(x)$가 $x=a, x=b$ ($a<b$)에서 극댓값을 가질 때, $|g(a)-g(b)|>10$을 만족시키는 정수 $k$의 개수를 구하시오. [5점]
```

- 원본 보기: 단답·서술형, 보기 없음
- 원본 answer: `20`.
- 기존 solution 원문:

```text
$f'(x)=3(x-3)(x+1)$이므로 $f$의 극대점은 $x=-1$, 극소점은 $x=3$이다. 두 값은 $k+5$, $k-27$이다.

$|f|$가 두 점에서 극댓값을 가지려면 $-5<k<27$이고, 이때 극댓값은 $k+5$와 $27-k$이다.

$|(k+5)-(27-k)|>10$에서 $|2k-22|>10$이다. 정수 $k$는 $-4\le k\le5$ 또는 $17\le k\le26$으로 각각 10개, 합계 20개다.
```

- 독립 수학 검토: $f(-1)=k+5$, $f(3)=k-27$. $|f|$가 두 곳에서 극대이려면 $-5<k<27$. $|2k-22|>10$으로 $k<6$ 또는 $k>16$, 정수는 $-4,\ldots,5$ (10개)와 $17,\ldots,26$ (10개) 합 20개다.
- 판정 이유: 기존 해설에 미분·두 극값·절댓값 부등식·정수 구간의 네 단계를 모두 제시했다.
- 이미지·그래프: 원본 JS에 별도 문제 image/이미지 보기 참조 없음.
- 상태: READ_EVIDENCED / KEEP / QA_NOT_RUN.

### Q18 — KEEP

- sourceQid: `q18`; sourceOrdinal: `18`; questionUid: `qid_v1_e59955fd76c8273cb0d9f8845336166abf248af3eee627c21459b5a8b17bfc4e`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
&lt;단답형 2&gt;<br>최고차항의 계수가 1인 삼차함수 $f(x)$에 대하여 함수<br>$$g(x) = \begin{cases} f(x) & (x \ge 0) \\ -f(-x) & (x < 0) \end{cases}$$<br>가 다음 조건을 만족한다.<br>(가) 함수 $g(x)$는 실수 전체의 집합에서 연속이다.<br>(나) 임의의 실수 $t$에 대하여 방정식 $|g(x)|=t$의 서로 다른 실근의 개수의 최댓값과 함수 $|g(x)|$의 미분가능하지 않은 점의 개수의 합은 8이다.<br>$\int_{0}^{1} g(x)dx = -\frac{3}{4}$일 때, $f(4)$의 값을 구하시오. [5점]
```

- 원본 보기: 단답·서술형, 보기 없음
- 원본 answer: `16`.
- 기존 solution 원문:

```text
연속성에서 $f(0)=0$이고 적분 조건은 $2a+3b=-6$이다. $H(x)=|g(x)|=|f(|x|)|$는 짝함수다.

$x>0$에서 $f(x)=x(x^2+ax+b)$를 본다. $b<0$이면 양의 단순근 하나가 생긴다. 이때 $H$의 수평선 교점 최대는 6개이고, 원점과 양·음의 단순근에서 미분 불가능하여 합이 9다. $b>0$에서 양의 근이 두 개면 최대 교점 수 10개와 미분 불가능점 5개의 합이 15다. 양의 중근이면 최대 교점 수 6개와 원점의 미분 불가능점 1개로 합이 7이다. 양의 근이 없어도 가능한 최대 교점 수는 6 이하이고 원점만 미분 불가능하므로 합은 8이 아니다.

따라서 $b=0$이어야 한다. $a<0$일 때 양의 근은 $-a$ 하나이며 $H=x^2|x+a|$의 최대 수평선 교점은 6개, 미분 불가능점은 $x=\pm(-a)$ 두 개다. 합이 8이므로 $a=-3$이고, $\int_0^1(x^3-3x^2)dx=-\frac{3}{4}$도 조건과 맞는다. 따라서 $f(4)=16$.
```

- 독립 수학 검토: 연속에서 $f(0)=0$, $f=x^3+ax^2+bx$, $\int_0^1f=1/4+a/3+b/2=-3/4$에서 $2a+3b=-6$. $H=|g|=|f(|x|)|$는 짝함수다. $b<0$이면 수평선 최대 6교점과 비미분 3점으로 합 9; $b>0$이면 양의 단순근 2개일 때 합 15, 그 외 최대 7이다. 따라서 $b=0$, $a=-3$. $H=|x|^2\lvert |x|-3\rvert$는 작은 양의 높이에서 6교점, 비미분점 $\pm3$ 두 개로 합 8. $f(4)=4^3-3\cdot4^2=16$.
- 판정 이유: 기존 긴 해설이 $b$의 부호별 교점·뾰족점 개수를 분리하고 최종 적분·정답을 검증한다. 해설 SVG 실제 렌더는 별도.
- 이미지·그래프: 기존 solutionImage `assets/images/23_금당고_1학기_기말_고2_수학II/q18-solution.svg` 렌더 **NOT_RUN** (문항 원본 그림 직접 조건에는 의존하지 않음).
- 상태: READ_EVIDENCED / KEEP / QA_NOT_RUN.

### Q19 — KEEP

- sourceQid: `q19`; sourceOrdinal: `19`; questionUid: `qid_v1_90cd7aef5bf0b281ecb3cae42c2a41afca94be074e0d678cee6404a5eef18fd3`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
&lt;서술형 1&gt;<br>두 양수 $a, k$에 대하여 함수<br>$$f(x) = \begin{cases} x^3-x^2 & (x < a) \\ x^2+k & (x \ge a) \end{cases}$$<br>는 $x=a$에서 연속이다. 함수 $y=f(x)$의 그래프와 $x$축 및 두 직선 $x=a, x=a+1$로 둘러싸인 부분의 넓이를 $S_1$, 함수 $y=f(x)$의 그래프와 $x$축으로 둘러싸인 부분의 넓이를 $S_2$라 하자. $S_1 = 256 S_2$일 때, $a+k$의 값을 풀이과정과 함께 상세하게 서술하시오. [10점]
```

- 원본 보기: 단답·서술형, 보기 없음
- 원본 answer: `12`.
- 기존 solution 원문:

```text
연속 조건에서 $a^3-a^2=a^2+k$, 따라서 $k=a^2(a-2)$이고 $k>0$에서 $a>2$다.

$a>2$이므로 유계인 $x$축과 그래프 사이 부분은 $0\le x\le1$뿐이다. $S_2=\int_0^1(x^2-x^3)dx=\frac{1}{12}$이다. 반면 $S_1=\int_a^{a+1}(x^2+k)dx=a^2+a+\frac{1}{3}+k$다.

$S_1=256S_2=\frac{64}{3}$과 $k=a^2(a-2)$를 대입하면 $a^3-a^2+a-21=(a-3)(a^2+2a+7)=0$이다. 양수 해는 $a=3$이고 $k=9$이므로 $a+k=12$다.
```

- 독립 수학 검토: 연속성 $a^3-a^2=a^2+k$에서 $k=a^2(a-2)>0$, $a>2$. $S_2=\int_0^1(x^2-x^3)dx=1/12$, $S_1=\int_a^{a+1}(x^2+k)dx=a^2+a+1/3+k$. $S_1=256/12$을 대입하면 $(a-3)(a^2+2a+7)=0$, $a=3,k=9,a+k=12$.
- 판정 이유: 기존 해설의 연속→부호/구간→두 면적→인수분해 과정이 수식으로 이어진다. 해설 SVG 렌더는 별도.
- 이미지·그래프: 기존 solutionImage `assets/images/23_금당고_1학기_기말_고2_수학II/q19-solution.svg` 렌더 **NOT_RUN** (문항 원본 그림 직접 조건에는 의존하지 않음).
- 상태: READ_EVIDENCED / KEEP / QA_NOT_RUN.

### Q20 — UPGRADE

- sourceQid: `q20`; sourceOrdinal: `20`; questionUid: `qid_v1_a19f6b2fba3914fd9d719237aee000e5c3b745cfdb608cf81199fa5f1fb3c43d`; sourceIdentityKey: **NOT_PRESENT**; 고정 source blob SHA: `608a65db86f831d0cbdb62607de29911b4763129`.
- 원문 문제 조건 (GitHub JS `content` 값 그대로):

```text
&lt;서술형 2&gt;<br>최고차항의 계수가 1인 사차함수 $f(x)$와 실수 $t$에 대하여 구간 $(-\infty, t]$에서 함수 $f(x)$의 최솟값을 $f_1(t)$라 하고, 구간 $[t, \infty)$에서 함수 $f(x)$의 최솟값을 $f_2(t)$라 할 때, 함수<br>$$g(t) = \begin{cases} f_1(t) & (t < 0) \\ f_2(t) & (t \ge 0) \end{cases}$$<br>가 다음 조건을 만족시킨다.<br>(가) 함수 $g(t)$는 실수 전체의 집합에서 연속이고, $t=1$에서만 미분가능하지 않다.<br>(나) 함수 $g(t)$가 $t=\alpha$에서 극솟값을 가질 때, $\alpha$의 최댓값이 3이다.<br>$f(1)=0$일 때, $f(4)$의 값을 풀이과정과 함께 상세하게 서술하시오. [10점]
```

- 원본 보기: 단답·서술형, 보기 없음
- 원본 answer: `\dfrac{69}{5}`.
- 기존 solution 원문:

```text
$t=0$에서 두 최소값 함수가 연속으로 이어지고 최대 국소 최솟값 위치가 3이므로, 왼쪽 가지의 경계 $x=0$과 오른쪽 최소점 $x=3$에서 $f'(0)=f'(3)=0$이다. $t=1$에서는 $f(t)$를 택하는 끝점 가지와 미래 최소값 $f(3)$인 상수 가지가 바뀐다. 따라서 $f(1)=f(3)=0$이고, 이 교체에서 기울기가 달라져 유일한 미분 불가능점이 생긴다.

사차함수의 나머지 임계점을 $r$이라 하면 $f'(x)=4x(x-r)(x-3)$이다. 두 점의 함수값이 같으므로
\[0=f(3)-f(1)=\int_1^3 4x(x-r)(x-3)\,dx=\frac{40r-72}{3},\]
따라서 $r=\frac{9}{5}$이다.

적분하면 $f(x)=x^4-32x^3/5+54x^2/5+C$이고 $f(1)=0$에서 $C=-\frac{27}{5}$다. 그러므로 $f(4)=256-\frac{2048}{5}+\frac{864}{5}-\frac{27}{5}=\frac{69}{5}$이다.
```

- 독립 수학 검토: $f_1(t)$은 구간이 확대될수록 비증가, $f_2(t)$는 비감소다. $g$의 $t=1$ 유일한 꺾임과 $t=3$ 마지막 극소 지점을 함께 이용하면 $f'(0)=f'(3)=0$, $f(1)=f(3)=0$인 가지 전환을 얻는다. $f'=4x(x-r)(x-3)$, $f(3)-f(1)=(40r-72)/3=0$에서 $r=9/5$; $f(4)-f(1)=69/5$이다.
- 판정 이유: 기존 해설은 '연속·극소 마지막 위치 3이므로 $f'(0)=f'(3)=0$' 및 '1에서 $f(t)$와 $f(3)$ 가지 교체'의 도출을 거의 생략한다. 이 부분이 문제의 핵심 구조라 수학적 연결을 보강한 전체 학생용 풀이를 아래에 작성한다.
- 이미지·그래프: 기존 solutionImage `assets/images/23_금당고_1학기_기말_고2_수학II/q20-solution.svg` 렌더 **NOT_RUN** (문항 원본 그림 직접 조건에는 의존하지 않음).

**기존 A→B 결함 및 완성 학생용 대체 solution (운영 JS 미반영)**

왼쪽 구간의 최솟값 $f_1(t)$는 $t$가 커질수록 작아지거나 그대로이고, 오른쪽 구간의 최솟값 $f_2(t)$는 $t$가 커질수록 커지거나 그대로입니다. 따라서 이어 붙인 $g(t)$는 $t=0$을 경계로 왼쪽에서 비증가, 오른쪽에서 비감소합니다.

오른쪽 구간에서 최솟값을 주는 점이 구간 내부에 남아 있으면 $f_2(t)$는 그 최솟값으로 일정하고, 최솟값을 주는 점이 왼쪽으로 빠져나간 뒤에는 끝점값 $f(t)$를 따릅니다.

극솟값을 갖는 위치의 최댓값이 $3$이고 $t=3$에서 미분 가능하므로, 오른쪽의 일정한 부분은 $t=3$에서 끝점값 $f(t)$로 매끄럽게 이어집니다. 이때
\[
f'(3)=0
\]
입니다.

유일하게 미분 가능하지 않은 $t=1$에서는 증가하던 끝점값 $f(t)$가 이후의 최솟값 $f(3)$과 만나 일정한 부분으로 바뀝니다. 따라서
\[
f(1)=f(3)
\]
입니다.

또 $t=0$에서 $g$는 연속이고 미분 가능하며, 왼쪽에서는 비증가하고 오른쪽에서는 비감소하므로 $g'(0)=0$입니다. $0\le t<1$에서는 $g(t)=f(t)$이므로
\[
f'(0)=0
\]
입니다.

$f$는 최고차항의 계수가 $1$인 사차함수입니다. 따라서 $f'$의 최고차항은 $4x^3$이고, 두 영점 $0,3$을 이미 알았으므로 나머지 영점을 $r$이라 놓으면
\[
f'(x)=4x(x-r)(x-3)
\]
입니다.

함숫값이 같은 조건 $f(3)=f(1)$을 정적분으로 나타내면
\[
\begin{aligned}
0&=f(3)-f(1)\\
&=\int_1^3 f'(x)\,dx\\
&=\int_1^3 4x(x-r)(x-3)\,dx\\
&=\int_1^3\{4x^3-4(r+3)x^2+12rx\}\,dx\\
&=\left[x^4-\frac{4(r+3)}3x^3+6rx^2\right]_1^3\\
&=\frac{40r-72}{3}.
\end{aligned}
\]
따라서
\[
40r-72=0,\qquad r=\frac{72}{40}=\frac95.
\]

그러므로
\[
\begin{aligned}
f'(x)&=4x\left(x-\frac95\right)(x-3)\\
&=4x^3-\frac{96}{5}x^2+\frac{108}{5}x.
\end{aligned}
\]

$f(1)=0$이므로 구하는 값은
\[
\begin{aligned}
f(4)&=f(1)+\int_1^4 f'(x)\,dx\\
&=\left[x^4-\frac{32}{5}x^3+\frac{54}{5}x^2\right]_1^4\\
&=\left(256-\frac{2048}{5}+\frac{864}{5}\right)
-\left(1-\frac{32}{5}+\frac{54}{5}\right)\\
&=\frac{96}{5}-\frac{27}{5}\\
&=\boxed{\frac{69}{5}}.
\end{aligned}
\]

따라서 정답은 $\dfrac{69}{5}$입니다.

- 독립 역검산: r=9/5를 도함수에 역대입하면 f'(0)=f'(3)=0이고 f(3)-f(1)=0. 원본 정답 69/5와 일치. f(1)=f(3)=0 조건 만족.
- 상태: READ_EVIDENCED / DRAFT_STAGED / QA_NOT_RUN.

## 종료 장부

- source qid Q01~Q20 20/20 직접 판독, 원문 정답·보기·solution 인용·독립 판정 기록 20/20. **KEEP 13 / UPGRADE 2 / HOLD 5 / UNREAD 0**.
- 개선 qid: **Q15** (절댓값의 단순근/다중근과 미분가능성 오류 교정), **Q20** (최솟값 함수의 분기·핵심 중간 논증 보강). 두 문항 모두 위에 전체 학생용 대체 풀이와 역검산 기록.
- 이미지 분리 인계: Q05 보기 PNG 5장, Q09 도함수 그래프, Q10 속도 그래프, Q11 두 넓이의 영역, Q13 접기 전개·높이 대응. 해당 시각적 근거 미확인인 상태에서 답/보기의 시각 PASS를 선언하지 않는다.
- 기존 해설 그림 q08, q18, q19, q20 `solutionImage`는 별도 이미지/렌더 라인에서 확인. Golden/Negative, preflight receipt, 웹 화면·SVG 렌더, 운영 JS 반영·main 병합은 **NOT_RUN / NOT_PERFORMED**.
- 기출 집계: 기존 73장/1,630문항 (KEEP 1,539, UPGRADE 32, HOLD 59)에 이번 1장/20문항을 합하면 **74장/1,650문항 (KEEP 1,552, UPGRADE 34, HOLD 64, UNREAD 0)**. 이는 감사 MD 초안 전수 기록이며 출고 마감이 아님.
- 다음 자료 단계: 1학기 기출 1mid 4/4, 1final 2/2 및 2학기 기출 2mid 42/42, 2final 26/26 모두 MD 대응. 다른 자료 종류(유사·유형·교과서·문제집)는 이 문서로 완료했다고 주장하지 않음.
