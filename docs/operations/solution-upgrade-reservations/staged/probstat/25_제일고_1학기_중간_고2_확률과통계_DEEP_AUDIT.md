# 확통 1학기 중간 기출 심층 감사 — 25_제일고_1학기_중간_고2_확률과통계.js

- lane20 / probstat / original / 1학기 중간 / 2025
- sourcePath: `archive/exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js`; sourceRef: main; sourceBlobSha: `7e810cbcac51e9d586a44472d82768c35a1a9959`
- standardCourse: 확률과 통계; 원본 문항 분모: 23; qid=1–23
- 작업 브랜치: `work/solution-upgrade-lane-20-20261121`
- 판정: KEEP 22 / UPGRADE 1(Q21) / HOLD 0 / UNREAD 0
- MD 상태: EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE / AUDIT_DRAFT_COMPLETE (출고/시각 PASS 아님)
- 실물 그림: Q10 인라인 3×3 SVG 추출 및 Inkscape 렌더 판독(중앙 음영). 원본 PDF 대조·Golden/Negative·학생 화면 렌더: NOT_RUN.
- 기존 sourceQuestionNo의 별도 값이 없는 경우 외부 PDF 결속 검증은 NOT_RUN이며, 원본 JS 내부 id와 SHA를 기록한다.
- 하네스/감사 템플릿/판서 샘플/해설 룰북 확인; preflight·전체 core 문서 SHA 영수증 검증: NOT_RUN.

## 문항별 판정

### Q01 — KEEP

- id: `1`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=경우의 수; answer=`④`
- 문제 원문 조건: 사지선다형 문제 5개가 있다. 각 문제의 답을 하나씩 임의로 고를 때, 고를 수 있는 모든 경우의 수를 구하면? (3.7점)
- 기존 solution 실제 발췌:
  > 사지선다형 5문제이므로 각 문제마다 4가지 선택지가 있다.
  > $\therefore 4^5 = 1024$가지
- 판정 이유: 5개 사지선다의 각 선택이 4가지이므로 곱의 법칙 4^5=1024가 바로 적용된다.
- 수학 독립 계산: 4^5=1024
- 화면·Golden/Negative: NOT_RUN

### Q02 — KEEP

- id: `2`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=확률; answer=`③`
- 문제 원문 조건: 이번 시즌에서 어느 프로 농구 선수가 200번의 자유투 시도에서 140개를 성공시켰다. 이 선수가 한 번의 자유투 시도에서 성공할 확률을 구하면? (3.7점)
- 기존 solution 실제 발췌:
  > 성공 횟수 / 전체 시도 횟수 = $\frac{140}{200} = \frac{7}{10}$
- 판정 이유: 200회 중 성공 140회의 관찰 상대도수 140/200=7/10을 경험적 확률로 해석하며, 실제 성공확률을 독립 추정한 것은 아님.
- 수학 독립 계산: 140/200=7/10
- 화면·Golden/Negative: NOT_RUN

### Q03 — KEEP

- id: `3`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=원순열; answer=`①`
- 문제 원문 조건: A와 B를 포함한 6명의 가족이 원형 탁자에 둘러앉으려고 한다. A와 B가 마주 보고 앉는 모든 경우의 수를 구하면? (3.7점)\n(단, 회전하여 일치하는 것은 같은 것으로 본다.)
- 기존 solution 실제 발췌:
  > 나머지 4명의 가족을 일렬로 배열하는 경우의 수는 $4!$이다.
  > $\therefore 1 \times 4! = 24$가지
- 판정 이유: A를 고정한 뒤 B는 맞은편 1자리, 나머지 4명의 위치는 4!로 회전 동치를 정확히 제거한다.
- 수학 독립 계산: 4!=24
- 화면·Golden/Negative: NOT_RUN

### Q04 — KEEP

- id: `4`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=중복조합; answer=`①`
- 문제 원문 조건: $(a+b+c)^4$의 전개식에서 서로 다른 종류의 항의 개수를 구하면? (3.7점)
- 기존 solution 실제 발췌:
  > $a, b, c$ 3개의 문자 중에서 중복을 허용하여 4개를 선택하는 조합의 수와 같다.
  > $\therefore _{3}H_{4} = _{6}C_{4} = _{6}C_{2} = 15$
- 판정 이유: 지수 i+j+k=4의 비음수 정수해 수가 3H4=6C2=15이므로 전개항 수와 일치한다.
- 수학 독립 계산: 6C2=15
- 화면·Golden/Negative: NOT_RUN

### Q05 — KEEP

- id: `5`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=이항정리; answer=`⑤`
- 문제 원문 조건: $(2x+1)^4$의 전개식에서 $x^3$의 계수를 구하면? (3.7점)
- 기존 solution 실제 발췌:
  > $x^3$ 항은 $4-r=3 \implies r=1$ 일 때이므로,
  > 계수는 $_{4}C_{1} \times 2^3 = 4 \times 8 = 32$
- 판정 이유: x의 차수 4-r=3에서 r=1을 찾고 4C1·2^3=32를 계산한다.
- 수학 독립 계산: 4C1·2^3=32
- 화면·Golden/Negative: NOT_RUN

### Q06 — KEEP

- id: `6`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=원순열; answer=`④`
- 문제 원문 조건: 1부터 6까지의 자연수가 하나씩 적혀 있는 6장의 카드를 일정한 간격으로 원형으로 배치하고자 한다. 합이 11인 두 카드를 이웃하지 않도록 배열하는 경우의 수를 구하면? (3.9점)\n(단, 회전하여 일치하는 것은 같은 것으로 본다.)
- 기존 solution 실제 발췌:
  > 5와 6이 이웃하는 경우의 수는 이들을 하나로 묶어 배열하므로 $(5-1)! \times 2! = 48$가지이다.
  > $\therefore 120 - 48 = 72$
- 판정 이유: 전체 5!=120 원순열에서 (5,6) 인접한 묶음 4!·2!=48을 빼서 72를 얻는다.
- 수학 독립 계산: 120-48=72
- 화면·Golden/Negative: NOT_RUN

### Q07 — KEEP

- id: `7`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=중복순열; answer=`②`
- 문제 원문 조건: 두 개의 숫자 1, 2 중에서 중복을 허용하여 자연수를 만들 때, 각 자리의 숫자의 합이 10인 수의 개수를 구하면? (3.9점)
- 기존 solution 실제 발췌:
  > (vi) $y=0, x=10: \frac{10!}{10!} = 1$
  > $\therefore 1+15+35+28+9+1 = 89$개
- 판정 이유: x+2y=10인 y=0..5의 6가지로 나누고 같은 숫자가 있는 배열 수를 모두 계산해 89를 얻는다.
- 수학 독립 계산: 1+15+35+28+9+1=89
- 화면·Golden/Negative: NOT_RUN

### Q08 — KEEP

- id: `8`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=이항정리; answer=`⑤`
- 문제 원문 조건: $_{11}C_0 3^{11} + _{11}C_1 3^{10} + _{11}C_2 3^9 + \dots + _{11}C_{10} 3 + _{11}C_{11}$의 값을 구하면? (3.9점)
- 기존 solution 실제 발췌:
  > 주어진 식은 $(3+1)^{11} = 4^{11}$이다.
  > $\therefore 4^{11} = (2^2)^{11} = 2^{22}$
- 판정 이유: 이항정리의 3^(11-r) 계수합을 (3+1)^11=2^22로 옮기는 이유가 원문에 제시된다.
- 수학 독립 계산: 4^11=2^22
- 화면·Golden/Negative: NOT_RUN

### Q09 — KEEP

- id: `9`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=확률; answer=`②`
- 문제 원문 조건: 확통이가 사과 맛 사탕 6개와 포도 맛 사탕 5개가 들어있는 상자에서 임의로 사탕 2개를 동시에 꺼낼 때, 사탕 2개가 모두 사과 맛 사탕일 확률을 구하면? (3.9점)
- 기존 solution 실제 발췌:
  > 사과 맛 사탕 6개 중 2개를 택하는 경우의 수: $_{6}C_{2} = 15$
  > $\therefore P = \frac{15}{55} = \frac{3}{11}$
- 판정 이유: 동시 추출 총 11C2=55와 사과 6C2=15의 조합을 동일 표본공간에서 나누어 3/11을 얻는다.
- 수학 독립 계산: 15/55=3/11
- 화면·Golden/Negative: NOT_RUN

### Q10 — KEEP

- id: `10`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=원순열; answer=`③`
- 문제 원문 조건: 1에서 9까지 아홉 개의 자연수를 모두 사용하여 아래의 9개의 빈칸을 모두 채우려고 한다. 음영이 칠해진 가운데에는 소수를 넣어서, 숫자를 채우는 경우의 수가 $7! \times n$이라고 할 때 $n$의 값으로 알맞은 것을 고르면? (4.0점) [원본 그림] (단, 한 칸에는 하나의 숫자만 넣고, 회전하여 일치하는 것은 같은 것으로 본다.)
- 기존 solution 실제 발췌:
  > $\therefore 4 \times \frac{8!}{4} = 8! = 7! \times 8$
  > 따라서 $n=8$이다.
- 판정 이유: 실물 3×3 칸 그림의 가운데 음영을 렌더 확인했고 중앙 소수 4선택·외곽 8! 배열의 회전 4중복을 반영한다.
- 수학 독립 계산: 4·8!/4=8!=7!·8
- 화면·Golden/Negative: NOT_RUN

### Q11 — KEEP

- id: `11`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=중복순열; answer=`①`
- 문제 원문 조건: 여섯 개의 숫자 0, 1, 2, 3, 4, 5에서 중복을 허용하여 4개를 택하여 네 자리의 자연수를 만들 때, 숫자 2와 4를 각각 한 개 이상 포함하는 수의 개수를 구하면? (4.0점)
- 기존 solution 실제 발췌:
  > 2 또는 4를 포함하지 않는 수의 개수: $500 + 500 - 192 = 808$
  > $\therefore 1080 - 808 = 272$
- 판정 이유: 첫 자리 0을 제외한 5·6^3에서 숫자 2/4가 빠진 경우를 포함배제로 정확히 계산해 272를 얻는다.
- 수학 독립 계산: 1080-500-500+192=272
- 화면·Golden/Negative: NOT_RUN

### Q12 — KEEP

- id: `12`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=이항정리; answer=`③`
- 문제 원문 조건: 다항식 $\frac{1}{2}(x+2y)^n$의 전개식에서 $x^3y^2$의 계수를 $m$이라 할 때, $m+n$의 값을 구하면? (4.0점)\n(단, $n$은 자연수이다.)
- 기존 solution 실제 발췌:
  > $y^2$ 항을 구하기 위해 $r=2$를 대입하면 계수 $m = \frac{1}{2} \times _{5}C_{2} \times 2^2 = \frac{1}{2} \times 10 \times 4 = 20$
  > $\therefore m+n = 20 + 5 = 25$
- 판정 이유: 목표 x^3y^2의 총 차수로 n=5, y 차수로 r=2를 택해 m=20과 m+n=25를 얻는다.
- 수학 독립 계산: m+n=20+5=25
- 화면·Golden/Negative: NOT_RUN

### Q13 — KEEP

- id: `13`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=중복조합; answer=`④`
- 문제 원문 조건: 다음 조건을 만족시키는 정수 $a, b, c, d$의 모든 순서쌍 $(a, b, c, d)$의 개수를 구하면? (4.0점)\n(가) $a+b+c+4d=9$\n(나) $a \ge 2, b \ge -2, c \ge 1, d \ge 0$
- 기존 solution 실제 발췌:
  > (iii) $d=2: a'+b'+c'=0 \implies _{3}H_{0} = 1$
  > $\therefore 45 + 15 + 1 = 61$
- 판정 이유: b의 음수 하한은 b+2로, 나머지 하한도 이동해 a'+b'+c'+4d=8을 얻고 d=0,1,2를 전수 합한다.
- 수학 독립 계산: 45+15+1=61
- 화면·Golden/Negative: NOT_RUN

### Q14 — KEEP

- id: `14`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=경우의 수; answer=`①`
- 문제 원문 조건: 좌표평면 위를 움직이는 점 P는 원점에서 출발하여 1회에 $x$축 또는 $y$축의 양의 방향으로 1만큼씩 이동한다. 5회 이하로 움직인다고 할 때, 점 P가 도착할 수 있는 제1사분면 위의 서로 다른 점의 개수를 구하면? (4.1점)
- 기존 solution 실제 발췌:
  > (iv) $k=5: (1,4), (2,3), (3,2), (4,1) \implies 4$개
  > $\therefore 1+2+3+4 = 10$개
- 판정 이유: 제1사분면은 x,y>0이므로 이동 k=2..5에서 각각 k-1개 점만 허용돼 10개다.
- 수학 독립 계산: 1+2+3+4=10
- 화면·Golden/Negative: NOT_RUN

### Q15 — KEEP

- id: `15`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=원순열; answer=`②`
- 문제 원문 조건: 31부터 38까지의 8개의 자연수가 적힌 8장의 카드를 일정한 간격을 두고 원형으로 배열하고자 한다. 이웃한 두 수의 곱이 모두 짝수가 되도록 배열하는 경우의 수를 구하면? (4.1점)\n(단, 회전하여 일치하는 것은 같은 것으로 본다.)
- 기존 solution 실제 발췌:
  > 그 사이의 4개 빈자리에 홀수 4개를 배열: $4! = 24$가지
  > $\therefore 6 \times 24 = 144$가지
- 판정 이유: 4개 홀수의 이웃을 모두 금지하려면 홀짝 교대만 가능해 3!·4!=144가 정확하다.
- 수학 독립 계산: 3!·4!=144
- 화면·Golden/Negative: NOT_RUN

### Q16 — KEEP

- id: `16`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=경우의 수; answer=`③`
- 문제 원문 조건: 중복을 허용하여 0, 1, 2, 3, 4, 5로 만든 자연수를 크기가 작은 수부터 차례로 나열할 때, 4213은 몇 번째 수인지 구하면? (4.1점)
- 기존 solution 실제 발췌:
  > 그다음 수가 4213이다.
  > $\therefore 215 + 648 + 72 + 6 + 3 + 1 = 945$번째
- 판정 이유: 자리수별 개수 5,30,180과 4213 직전 4자리 수의 자릿값별 구간을 세어 945번째를 얻는다.
- 수학 독립 계산: 215+648+72+6+3+1=945
- 화면·Golden/Negative: NOT_RUN

### Q17 — KEEP

- id: `17`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=확률; answer=`④`
- 문제 원문 조건: 집합 $X=\{1, 2, 3, 4\}$의 공집합이 아닌 모든 부분집합 15개 중에서 임의로 서로 다른 부분집합을 뽑아 임의로 일렬로 나열하고, 나열된 순서대로 $A, B$라 할 때, $A \subset B$일 확률은? (4.3점)
- 기존 solution 실제 발췌:
  > 순서쌍의 총 개수: $12 + 24 + 14 = 50$
  > $\therefore P = \frac{50}{210} = \frac{5}{21}$
- 판정 이유: A,B는 서로 다르고 비공집합이며 A⊂B이므로 |B|=2,3,4별 진부분집합 개수 12+24+14를 15·14로 나눈다.
- 수학 독립 계산: 50/210=5/21
- 화면·Golden/Negative: NOT_RUN

### Q18 — KEEP

- id: `18`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=같은 것이 있는 순열; answer=`⑤`
- 문제 원문 조건: 3개의 서로 다른 인형과 똑같은 신발 3켤레와 똑같은 모자 3개를 가지고 있는 사람이 있다. 인형의 두 발에 신발을 신기고 모자를 씌우려고 한다. 각 인형은 모두 먼저 왼쪽 신발을 신긴 다음에 오른쪽 신발을 신기고 마지막으로 모자를 씌운다고 한다. 3개의 인형에 양쪽 신발을 신기고, 모자를 씌우는 순서를 정하는 모든 경우의 수를 구하면? (4.4점)\n(단, 각 인형에서 신발과 모자를 연속하여 신기거나 씌우지 않아도 된다.)
- 기존 solution 실제 발췌:
  > 이는 같은 것이 있는 순열의 수와 같다.
  > $\therefore \frac{9!}{3!3!3!} = \frac{362880}{6 \times 6 \times 6} = 1680$가지
- 판정 이유: 인형마다 왼발→오른발→모자의 순서가 고정된 3개 사슬을 교차 배열하므로 9!/(3!)^3=1680이다.
- 수학 독립 계산: 9!/(3!)^3=1680
- 화면·Golden/Negative: NOT_RUN

### Q19 — KEEP

- id: `19`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=중복조합; answer=`②`
- 문제 원문 조건: 볼펜 4개와 연필 3개를 4명의 학생 $A, B, C, D$에게 다음 규칙에 따라 남김없이 나누어 주는 경우의 수를 구하면? (4.5점) (단, 볼펜과 연필은 각각 구별되지 않고, 볼펜과 연필을 받지 못하는 학생이 있을 수 있다.) (가) 두 학생 $A, B$가 받은 볼펜과 연필 개수의 합은 홀수이다. (나) 학생 $C$가 받은 볼펜과 연필 개수는 학생 $D$가 받는 볼펜과 연필 개수의 3배이다. (다) 학생 $D$는 볼펜 또는 연필을 적어도 1개 받는다.
- 기존 solution 실제 발췌:
  > 따라서 전체 경우의 수는 $20+16=36$이다.
  > 따라서 정답은 ②이다.
- 판정 이유: C=3D, D≥1, 물건 총 7개에서 D=1, C=3으로 정한 뒤 D의 물건 종류별 20+16=36을 구한다.
- 수학 독립 계산: 20+16=36
- 화면·Golden/Negative: NOT_RUN

### Q20 — KEEP

- id: `20`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=경우의 수; answer=`⑤`
- 문제 원문 조건: 다음 조건을 만족시키는 다섯 개의 자연수 $a, b, c, d, e$를 일렬로 나열하는 경우의 수를 구하면? (4.4점)\n(가) $a+b+c+d+e=8$\n(나) $a \times b \times c \times d \times e$는 4의 배수이다.
- 기존 solution 실제 발췌:
  > (ii) $\{2, 2, 2, 1, 1\}$: 나열 수 $\frac{5!}{3!2!} = 10$가지
  > $\therefore 5 + 10 = 15$가지
- 판정 이유: 자연수 5개의 기본합 5에서 추가 3을 배분하며 곱이 4의 배수인 (4,1,1,1,1)과 (2,2,2,1,1)만 유효하다.
- 수학 독립 계산: 5+10=15
- 화면·Golden/Negative: NOT_RUN

### Q21 — UPGRADE

- id: `21`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=이항정리; answer=`2640`
- 문제 원문 조건: $(1+2x) + (1+2x)^2 + (1+2x)^3 + \dots + (1+2x)^{10}$의 전개식에서 $x^3$의 계수를 구하는 과정을 구체적으로 서술하시오.\n(6점, 부분 점수 있음.)
- 기존 solution 실제 발췌:
  > 분자의 $x^4$ 계수는 $_{11}C_{4} \times 2^4 = 330 \times 16 = 5280$
  > $\therefore \frac{5280}{2} = 2640$
- 판정 이유: 기존 풀이에서 (1+2x)의 기하급수식을 2x로 나누는 전환이 x=0과 다항식 계수 논리를 생략한다. 각 이항전개 x^3 계수를 바로 합하는 판서형 해설로 개선한다.
- 수학 독립 계산: 8·C(11,4)=2640
- UPGRADE 결함: LOGIC_JUMP / DIVISION_BY_VARIABLE_UNEXPLAINED.

**완성된 학생용 대체 solution**

각 $(1+2x)^k$의 이항전개에서 $k\ge3$일 때 $x^3$항은
\[
\binom{k}{3}(2x)^3=8\binom{k}{3}x^3
\]
이다. $k=1,2$일 때에는 $x^3$항이 없다.

따라서 전체 식에서 $x^3$의 계수는
\[
8\left(\binom{3}{3}+\binom{4}{3}+\cdots+\binom{10}{3}\right)
\]
이다.

파스칼 항등식 \(\binom{k+1}{4}=\binom{k}{4}+\binom{k}{3}\)을 이용하면
\[
\binom{k}{3}=\binom{k+1}{4}-\binom{k}{4}
\]
이므로 연속하여 더할 때 중간 항이 소거된다.

\[
\begin{aligned}
\binom{3}{3}+\binom{4}{3}+\cdots+\binom{10}{3}
&=(\binom{4}{4}-\binom{3}{4})+(\binom{5}{4}-\binom{4}{4})+\cdots+(\binom{11}{4}-\binom{10}{4})\\
&=\binom{11}{4}-\binom{3}{4}\\
&=\frac{11\cdot10\cdot9\cdot8}{4\cdot3\cdot2\cdot1}-0\\
&=330.
\end{aligned}
\]

따라서 구하는 계수는
\[
8\cdot330=2640
\]
이다.

- 독립 교차검산(학생용 제외): 원본 계수식으로도 $C(11,4)2^4/2=330\cdot8=2640$; Golden/Negative·sol 렌더 NOT_RUN.

### Q22 — KEEP

- id: `22`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=경우의 수; answer=`97`
- 문제 원문 조건: 주머니 속에 다섯 개의 숫자 1, 2, 3, 4, 5가 각각 하나씩 적혀 있는 공 5개가 들어있다. 이 주머니에서 1개의 공을 꺼내어 공에 적힌 수를 확인한 후 다시 넣는다고 할 때, 꺼낸 공의 수가 3 이하이면 나온 수의 점수를 얻고, 4 이상이면 0점을 얻는다. 이 과정을 4번 반복할 때, 꺼낸 공에 적혀 있는 수를 차례로 $a, b, c, d$라 하자. 얻은 네 점수의 합이 4가 되는 모든 순서쌍 $(a, b, c, d)$의 개수를 구하는 과정을 구체적으로 서술하시오.\n(7점, 부분 점수 있음.)
- 기존 solution 실제 발췌:
  > - (1, 1, 1, 1): $\frac{4!}{4!} \times 1^4 = 1$
  > $\therefore 48 + 24 + 24 + 1 = 97$개
- 판정 이유: 0점 카드 4·5의 2가지 선택을 넣어 점수 분할 (3,1,0,0),(2,2,0,0),(2,1,1,0),(1,1,1,1)을 빠짐없이 센다.
- 수학 독립 계산: 48+24+24+1=97
- 화면·Golden/Negative: NOT_RUN

### Q23 — KEEP

- id: `23`; sourceQuestionNo: `NOT_PRESENT`; source blob: `7e810cbcac51e9d586a44472d82768c35a1a9959`; category=중복조합; answer=`87`
- 문제 원문 조건: 집합 $X=\{1, 2, 3, 4, 5, 6\}$에 대하여 다음 조건을 만족시키는 함수 $f : X \to X$의 개수를 구하는 과정을 구체적으로 서술하시오.\n(7점, 부분 점수 있음.)\n(가) $f(1) \times f(6)$의 값이 4의 약수이다.\n(나) $2 f(1) \le f(2) \le f(3) \le f(4) \le f(5) \le 2 f(6)$
- 기존 solution 실제 발췌:
  > 나머지 조합은 조건 (나)에서 모순이 발생한다.
  > $\therefore 1 + 15 + 70 + 1 = 87$개
- 판정 이유: f(1)f(6)이 4의 약수인 양끝값 네 조합에서 중간 네 함수값의 비감소 조건을 중복조합으로 계산해 87을 얻는다.
- 수학 독립 계산: 1+15+70+1=87
- 화면·Golden/Negative: NOT_RUN

## 다음 작업

- Q21의 대체 해설은 이 MD에 완성했으나 원본 JS 자체는 변경하지 않는다.
- 다음 후보: 확통 2025년 1학기 중간 다른 학교 원본. 2학기 자료에는 손대지 않는다.
