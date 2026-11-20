```json:exam
{ "stem": "24_여수고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 23, "totalScore": 99.9, "generatedAt": "2026-11-18" }
```


## Q01
- 형식: 객관식
- 배점: 3.5
### 발문
세 다항식 $A=2x^2-3x+1$, $B=3x^2-x+4$, $C=-x^2+2x-3$에 대하여 $A+3B-3(C+B)$를 간단히 하면?
### 선지
① $5x^2-9x+10$ ② $5x^2+3x-8$ ③ $-x^2-9x+10$ ④ $5x^2-9x-8$ ⑤ $5x^2-5x+10$
### 정답
①
### 해설
주어진 식에서 $B$가 소거되도록 먼저 정리하면 $$A+3B-3(C+B)=A+3B-3C-3B=A-3C$$ 따라서 $A$와 $C$를 대입하면 $$\begin{aligned} A-3C &= (2x^2-3x+1)-3(-x^2+2x-3) \ &= 2x^2-3x+1+3x^2-6x+9 \ &= 5x^2-9x+10 \end{aligned}$$ 정답은 ①이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q01",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "괄호를 전개해 B를 먼저 소거한 A-3C에 다항식 A와 C를 대입해 동류항을 정리한다.",
  "decisiveStep": "A+3B-3(C+B)=A-3C로 줄인 뒤 계수를 합산해 5x^2-9x+10을 얻는다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "문자를 먼저 소거해 연산을 단순화한 뒤 다항식 뺄셈을 수행하는 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "다항식의연산",
    "task": "식정리",
    "given": "세이차다항식",
    "condition": "NONE"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q02
- 형식: 객관식
- 배점: 3.5
### 발문
이차함수 $y=x^2-4x+1$의 그래프와 직선 $y=k$가 만나지 않도록 하는 모든 실수 $k$의 값의 범위는?
### 선지
① $k>-3$ ② $k\le -3$ ③ $k<3$ ④ $k<-3$ ⑤ $k\le 3$
### 정답
④
### 해설
$$y=x^2-4x+1=(x-2)^2-3$$ 아래로 볼록한 포물선이고 최솟값이 $-3$이므로 직선 $y=k$가 이 그래프와 만나지 않으려면 $k$가 최솟값보다 작아야 한다. 따라서 $k<-3$이고, 정답은 ④이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q02",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "표준형 (x-2)^2-3에서 최솟값 -3을 구하고 수평선 y=k와 만나지 않을 조건 k<-3을 도출한다.",
  "decisiveStep": "최솟값 -3보다 작은 k<-3 범위를 확정한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이차함수를 표준형으로 변형해 꼭짓점 y좌표와 상수함수의 위치관계를 비교하는 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "이차함수와직선의위치관계",
    "task": "상수범위구하기",
    "given": "이차함수와수평선",
    "condition": "만나지않음"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q03
- 형식: 객관식
- 배점: 3.6
### 발문
$x=2+\sqrt{3}$, $y=2-\sqrt{3}$일 때, $x^3+y^3$의 값은?
### 선지
① $48$ ② $52$ ③ $56$ ④ $60$ ⑤ $64$
### 정답
②
### 해설
$$x+y=(2+\sqrt{3})+(2-\sqrt{3})=4, \quad xy=(2+\sqrt{3})(2-\sqrt{3})=4-3=1$$ 곱셈 공식의 변형에 의하여 $$x^3+y^3=(x+y)^3-3xy(x+y)=4^3-3(1)(4)=64-12=52$$ 따라서 정답은 ②이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q03",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "켤레무리수의 합 x+y=4와 곱 xy=1을 구해 세제곱 합 변형식 (x+y)^3-3xy(x+y)에 대입한다.",
  "decisiveStep": "x+y=4, xy=1을 대입해 64-12=52를 계산한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "무리수 켤레쌍의 합과 곱을 구한 뒤 세제곱 합 곱셈공식 변형에 대입하는 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "곱셈공식의변형",
    "task": "세제곱합구하기",
    "given": "켤레무리수쌍",
    "condition": "NONE"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q04
- 형식: 객관식
- 배점: 3.6
### 발문
이차방정식 $x^2-8x-a=0$의 두 근의 차가 $6$일 때, 실수 $a$의 값은?
### 선지
① $-1$ ② $-3$ ③ $-4$ ④ $-5$ ⑤ $-7$
### 정답
⑤
### 해설
이차방정식 $x^2-8x-a=0$의 두 근을 $\alpha$, $\beta$라 하면 근과 계수의 관계에 의하여 $$\alpha+\beta=8, \quad \alpha\beta=-a$$ 두 근의 차가 $6$이므로 $|\alpha-\beta|=6$이고, 양변을 제곱하면 $$(\alpha-\beta)^2=(\alpha+\beta)^2-4\alpha\beta=8^2-4(-a)=64+4a=36$$ 따라서 $4a=-28 \implies a=-7$이고, 정답은 ⑤이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q04",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "근과 계수의 관계로 합 8과 곱 -a를 구한 뒤 (alpha-beta)^2=(alpha+beta)^2-4alpha*beta=36을 푼다.",
  "decisiveStep": "64+4a=36에서 a=-7을 얻는다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 근의 차 조건을 제곱 변형식과 근과 계수의 관계에 연결하는 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "근과계수의관계",
    "task": "계수구하기",
    "given": "두근의차조건이차방정식",
    "condition": "NONE"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q05
- 형식: 객관식
- 배점: 3.6
### 발문
다항식 $P(x)=ax^3+x^2+bx-6$이 $x^2-x-2$로 나누어떨어질 때, $ab$의 값은? (단, $a$, $b$는 상수)
### 선지
① $-10$ ② $-12$ ③ $-14$ ④ $-16$ ⑤ $-18$
### 정답
③
### 해설
$x^2-x-2=(x-2)(x+1)$이므로 인수정리에 의하여 $P(2)=0$, $P(-1)=0$이다. $$\begin{aligned} P(2) &= 8a+4+2b-6=0 \implies 4a+b=1 \ P(-1) &= -a+1-b-6=0 \implies a+b=-5 \end{aligned}$$ 두 식을 빼면 $3a=6 \implies a=2$이고, $b=-5-2=-7$이다. 따라서 $ab=2\times(-7)=-14$이므로 정답은 ③이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q05",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "이차 나누는 식 x^2-x-2=(x-2)(x+1)을 인수분해한 뒤 인수정리 P(2)=0, P(-1)=0을 연립한다.",
  "decisiveStep": "4a+b=1과 a+b=-5를 연립해 a=2, b=-7을 구한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이차 인수를 분해해 인수정리 두 식을 연립방정식으로 푸는 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "인수정리",
    "task": "계수곱구하기",
    "given": "삼차다항식과이차인수",
    "condition": "나누어떨어짐"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q06
- 형식: 객관식
- 배점: 3.8
### 발문
$\left(\dfrac{1-i}{\sqrt{2}}\right)^{14}+\left(\dfrac{1+i}{1-i}\right)^{15}$를 간단히 하면? (단, $i=\sqrt{-1}$)
### 선지
① $0$ ② $2i$ ③ $-2i$ ④ $2$ ⑤ $-2$
### 정답
①
### 해설
$$\left(\dfrac{1-i}{\sqrt{2}}\right)^2=\dfrac{1-2i+i^2}{2}=-i$$ 이므로 $$\left(\dfrac{1-i}{\sqrt{2}}\right)^{14}=(-i)^7=-i^7=-(-i)=i$$ 또한 $$\dfrac{1+i}{1-i}=\dfrac{(1+i)^2}{(1-i)(1+i)}=\dfrac{2i}{2}=i$$ 이므로 $\left(\dfrac{1+i}{1-i}\right)^{15}=i^{15}=-i$이다. 따라서 구하는 값은 $i+(-i)=0$이고, 정답은 ①이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q06",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "복소수를 각각 제곱·실수화하여 ±i로 단순화한 뒤 i의 4주기로 거듭제곱을 계산한다.",
  "decisiveStep": "(-i)^7=i와 i^15=-i를 각각 구해 합 0을 얻는다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "복소수 거듭제곱의 기본 변형(제곱=-i, 실수화=i)과 4주기성을 적용하는 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "복소수의거듭제곱",
    "task": "식계산",
    "given": "복소수거듭제곱합",
    "condition": "NONE"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q07
- 형식: 객관식
- 배점: 3.8
### 발문
다항식 $x^4+3x^2-4$의 인수를 <보기>에서 모두 고른 것은? <보기> ㄱ. $x-1$ ㄴ. $x+3$ ㄷ. $x^2-1$ ㄹ. $x^2+2x+1$ ㅁ. $x^2+2x+4$ ㅂ. $x^3+x^2+4x+4$
### 선지
① ㄱ, ㄷ ② ㄴ, ㄹ ③ ㄷ, ㅁ ④ ㄱ, ㄷ, ㅂ ⑤ ㄱ, ㄴ, ㅂ
### 정답
④
### 해설
$$P(x)=x^4+3x^2-4=(x^2-1)(x^2+4)=(x-1)(x+1)(x^2+4)$$ ㄱ. $x-1$은 인수이다. (참) ㄴ. $P(-3)=81+27-4=104\ne 0$이므로 인수가 아니다. (거짓) ㄷ. $x^2-1=(x-1)(x+1)$은 인수이다. (참) ㄹ. $x^2+2x+1=(x+1)^2$인데 $P(x)$는 $(x+1)$을 하나만 인수로 가지므로 인수가 아니다. (거짓) ㅁ. $x^2+2x+4$는 $P(x)$의 기약인수 $x-1, x+1, x^2+4$의 곱으로 만들 수 없으므로 인수가 아니다. (거짓) ㅂ. $x^3+x^2+4x+4=x^2(x+1)+4(x+1)=(x+1)(x^2+4)$이므로 $P(x)$의 인수이다. (참) 따라서 옳은 것은 ㄱ, ㄷ, ㅂ이므로 정답은 ④이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q07",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "복이차식을 (x-1)(x+1)(x^2+4)로 완전 인수분해한 뒤 보기 6개 식의 인수 여부를 각각 판별한다.",
  "decisiveStep": "ㅂ을 (x+1)(x^2+4)로 인수분해해 P(x)의 인수임을 확인하고 ㄹ, ㅁ과 구별한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "사차식을 기약인수까지 분해한 뒤 6개 후보 중 3차식 포함 인수 조합을 모두 가려내야 하는 3단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "인수분해",
    "task": "인수모두고르기",
    "given": "복이차식과6개후보",
    "condition": "NONE"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q08
- 형식: 객관식
- 배점: 3.8
### 발문
$(3x^3-x^2+6x-1)\div(3x-1)$의 몫과 나머지를 구하면?
### 선지
① 몫: $3x^2+6$, 나머지: $1$ ② 몫: $x^2+2$, 나머지: $1$ ③ 몫: $x^2+2$, 나머지: $-1$ ④ 몫: $3x^2+6$, 나머지: $-1$ ⑤ 몫: $x^2+3$, 나머지: $1$
### 정답
②
### 해설
$$3x^3-x^2+6x-1=x^2(3x-1)+2(3x-1)+1=(3x-1)(x^2+2)+1$$ 따라서 몫은 $x^2+2$, 나머지는 $1$이므로 정답은 ②이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q08",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "일차항 계수가 3인 일차식 3x-1로 직접 나누거나 조립제법 몫을 3으로 나누어 몫과 나머지를 구한다.",
  "decisiveStep": "x-1/3로 나눈 몫 3x^2+6을 3으로 나누어 실제 몫 x^2+2를 얻는다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "일차항 계수가 1이 아닌 일차식으로 나눌 때 몫을 최고차항 계수로 나누는 주의점을 묻는 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "다항식의나눗셈",
    "task": "몫과나머지",
    "given": "삼차다항식과일차식",
    "condition": "NONE"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q09
- 형식: 객관식
- 배점: 3.8
### 발문
$3\le x\le k$에서 $y=x^2-4x+5$의 최댓값이 $26$일 때, 상수 $k$의 값은?
### 선지
① $3$ ② $4$ ③ $5$ ④ $6$ ⑤ $7$
### 정답
⑤
### 해설
$y=x^2-4x+5=(x-2)^2+1$이므로 대칭축은 $x=2$이다. 구간 $3\le x\le k$는 대칭축 $x=2$의 오른쪽에 있으므로 이 구간에서 $x$가 커질수록 $y$가 커진다. 따라서 최댓값은 $x=k$에서 발생하므로 $$k^2-4k+5=26 \implies k^2-4k-21=(k-7)(k+3)=0$$ $k\ge 3$이므로 $k=7$이다. 정답은 ⑤이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q09",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "대칭축 x=2가 구간 [3, k]의 왼쪽에 있음을 확인해 x=k에서 최댓값 26 방정식을 푼다.",
  "decisiveStep": "k^2-4k-21=0에서 k>=3 조건으로 k=7을 선택한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": ["COND_RANGE"],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "대칭축 밖 증가 구간에서 오른쪽 끝점 최댓값 조건을 이차방정식으로 푸는 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "이차함수의최대최소",
    "task": "구간끝점구하기",
    "given": "이차함수와미정구간",
    "condition": "최댓값조건"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q10
- 형식: 객관식
- 배점: 3.9
### 발문
$f(x)=x^2+2(a-3k)x+9k^2-4k+b$가 $k$의 값에 관계없이 항상 $x$축에 접할 때, $a+b$의 값은? (단, $a$, $b$는 상수)
### 선지
① $\dfrac{2}{3}$ ② $\dfrac{8}{9}$ ③ $\dfrac{10}{9}$ ④ $\dfrac{4}{3}$ ⑤ $\dfrac{14}{9}$
### 정답
③
### 해설
$y=f(x)$의 그래프가 $x$축에 접하므로 방정식 $x^2+2(a-3k)x+9k^2-4k+b=0$의 판별식 $D=0$이다. $$\dfrac{D}{4}=(a-3k)^2-(9k^2-4k+b)=(4-6a)k+(a^2-b)=0$$ 이 등식이 $k$의 값에 관계없이 항상 성립하므로 $k$에 대한 항등식의 성질에 의하여 $$4-6a=0, \quad a^2-b=0$$ 따라서 $a=\dfrac{2}{3}$, $b=a^2=\dfrac{4}{9}$이고, $$a+b=\dfrac{2}{3}+\dfrac{4}{9}=\dfrac{10}{9}$$ 정답은 ③이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q10",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "x축 접점 조건 D/4=0을 k에 대해 정리한 뒤 k에 대한 항등식 계수비교로 a, b를 구한다.",
  "decisiveStep": "(4-6a)k+(a^2-b)=0에서 a=2/3, b=4/9를 구한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "판별식 조건식에서 k^2이 소거된 뒤 k에 대한 항등식 계수비교로 두 상수를 결정하는 3단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "판별식과항등식",
    "task": "계수합구하기",
    "given": "항상x축에접하는이차함수",
    "condition": "항등식조건"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q11
- 형식: 객관식
- 배점: 3.9
### 발문
다항식 $P(x)$를 $(x-1)^2$으로 나눈 나머지는 $2x+3$이고, $x-3$으로 나눈 나머지는 $17$이다. $P(x)$를 $(x-1)^2(x-3)$으로 나눈 나머지를 $R(x)$라 할 때, $R(0)$의 값은?
### 선지
① $2$ ② $3$ ③ $4$ ④ $5$ ⑤ $6$
### 정답
④
### 해설
$P(x)$를 $(x-1)^2(x-3)$으로 나눈 나머지 $R(x)$는 이차 이하의 다항식이고, $(x-1)^2$으로 나눈 나머지가 $2x+3$이므로 상수 $a$에 대하여 $$R(x)=a(x-1)^2+2x+3$$ 으로 놓을 수 있다. 또한 $P(x)$를 $x-3$으로 나눈 나머지가 $17$이므로 $R(3)=P(3)=17$이다. $$R(3)=a(3-1)^2+2(3)+3=4a+9=17 \implies 4a=8 \implies a=2$$ 따라서 $R(x)=2(x-1)^2+2x+3=2x^2-2x+5$이므로 $R(0)=5$이다. 정답은 ④이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q11",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "삼차식 나눗셈의 나머지 R(x)를 a(x-1)^2+2x+3으로 설정한 뒤 R(3)=17을 대입해 a를 결정한다.",
  "decisiveStep": "4a+9=17에서 a=2를 구하고 R(0)=2(1)+3=5를 계산한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "완전제곱식 인수를 포함한 삼차식 나눗셈의 나머지 설정법을 적용하는 3단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "나머지정리",
    "task": "나머지상수항구하기",
    "given": "삼차식나눗셈나머지조건",
    "condition": "NONE"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q12
- 형식: 객관식
- 배점: 4.0
### 발문
$x+y=2$일 때, 등식 $ax^2+bxy+cy^2=8$이 항상 성립하도록 하는 상수 $a$, $b$, $c$에 대하여 $abc$의 값은?
### 선지
① $16$ ② $12$ ③ $8$ ④ $24$ ⑤ $32$
### 정답
①
### 해설
$x+y=2$에서 $y=2-x$를 주어진 등식에 대입하면 $$\begin{aligned} ax^2+bx(2-x)+c(2-x)^2 &= (a-b+c)x^2+(2b-4c)x+4c=8 \end{aligned}$$ 이 등식이 모든 실수 $x$에 대하여 성립하므로 계수를 비교하면 $$4c=8 \implies c=2, \quad 2b-4c=0 \implies b=4, \quad a-b+c=0 \implies a=2$$ 따라서 $abc=2\times 4\times 2=16$이고, 정답은 ①이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q12",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "y=2-x를 대입해 x에 대한 일변수 항등식으로 바꾼 뒤 세 차수의 계수를 비교한다.",
  "decisiveStep": "4c=8, 2b-4c=0, a-b+c=0을 차례로 풀어 a=2, b=4, c=2를 얻는다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "일차관계식으로 한 문자를 소거한 뒤 이차항등식의 계수를 비교하는 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "항등식",
    "task": "계수곱구하기",
    "given": "관계식이주어진이차항등식",
    "condition": "항등식조건"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q13
- 형식: 객관식
- 배점: 4.1
### 발문
다항식 $P(x)$를 $x^3+x$로 나누었을 때의 몫은 $x+2$, 나머지는 $x+4$이다. 또 $P(x)$를 $x+1$로 나누었을 때의 몫을 $Q(x)$, 나머지를 $R$이라 하자. $Q(1)-R$의 값은?
### 선지
① $2$ ② $3$ ③ $4$ ④ $5$ ⑤ $6$
### 정답
③
### 해설
$$P(x)=(x^3+x)(x+2)+(x+4)=x^4+2x^3+x^2+3x+4$$ $P(x)$를 $x+1$로 나눈 나머지는 $R=P(-1)=1-2+1-3+4=1$이다. 조립제법으로 $P(x)$를 $x+1$로 나누면 $$P(x)=(x+1)(x^3+x^2+3)+1$$ 이므로 $Q(x)=x^3+x^2+3$이고, $Q(1)=1+1+3=5$이다. 따라서 $Q(1)-R=5-1=4$이므로 정답은 ③이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q13",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "나눗셈 식으로 P(x)를 전개한 뒤 x+1로 나눈 나머지 R=P(-1)과 조립제법 몫 Q(x)를 구한다.",
  "decisiveStep": "P(x)=x^4+2x^3+x^2+3x+4에서 R=1, Q(x)=x^3+x^2+3을 구한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다항식 복원 후 조립제법으로 몫 다항식 Q(x)와 나머지 R을 모두 구하는 3단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "다항식의나눗셈",
    "task": "몫과나머지계산",
    "given": "삼차식나눗셈조건",
    "condition": "NONE"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q14
- 형식: 객관식
- 배점: 4.1
### 발문
$(x^2-3x+2)(x^2+5x+6)+k$가 이차식의 완전제곱식일 때, 상수 $k$의 값은?
### 선지
① $-4$ ② $1$ ③ $2$ ④ $3$ ⑤ $4$
### 정답
⑤
### 해설
두 이차식을 인수분해하여 일차항의 계수가 같아지도록 짝지으면 $$(x^2-3x+2)(x^2+5x+6)+k=(x-1)(x-2)(x+2)(x+3)+k={(x-1)(x+2)}{(x-2)(x+3)}+k=(x^2+x-2)(x^2+x-6)+k$$ $t=x^2+x$라 치환하면 $$(t-2)(t-6)+k=t^2-8t+12+k=(t-4)^2-4+k$$ 이 식이 이차식의 완전제곱식이 되려면 $-4+k=0 \implies k=4$이다. 정답은 ⑤이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q14",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "두 이차식을 네 일차식으로 분해한 뒤 x^2+x가 공통으로 나오도록 재조합하여 치환·완전제곱한다.",
  "decisiveStep": "(x-1)(x+2)와 (x-2)(x+3)으로 짝지어 t^2-8t+12+k에서 k=4를 구한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이차식 곱을 4개의 일차인수로 분해·재짝짓기해 치환 완전제곱하는 3단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "치환과완전제곱식",
    "task": "상수구하기",
    "given": "두이차식곱과상수",
    "condition": "완전제곱식"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q15
- 형식: 객관식
- 배점: 4.1
### 발문
$z^2-2mz+n=0$ ($m$, $n$은 자연수)의 허근 $z$가 존재할 때, $m+n$의 최솟값은?
### 선지
① $2$ ② $3$ ③ $4$ ④ $5$ ⑤ $6$
### 정답
②
### 해설
이차방정식 $z^2-2mz+n=0$이 허근을 가지려면 판별식 $D<0$이어야 한다. $$\dfrac{D}{4}=m^2-n<0 \implies n>m^2$$ $m$, $n$이 자연수이므로 $m=1$일 때 $n>1$에서 최소의 자연수 $n=2$를 택할 수 있고, 이때 $m+n=1+2=3$이다. ($m\ge 2$이면 $n\ge 5$이므로 $m+n\ge 7$이다.) 따라서 $m+n$의 최솟값은 $3$이고, 정답은 ②이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q15",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "허근 조건 D/4=m^2-n<0에서 자연수 m=1일 때 최소 자연수 n=2를 찾아 합을 구한다.",
  "decisiveStep": "n>m^2 조건에 최소 자연수 m=1을 대입해 n=2, m+n=3을 확정한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": ["COND_NATURAL_NUMBER"],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "판별식 부등식 n>m^2을 만족시키는 최소 자연수 쌍을 찾는 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "판별식",
    "task": "자연수합최솟값",
    "given": "허근조건이차방정식",
    "condition": "자연수조건"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q16
- 형식: 객관식
- 배점: 4.3
### 발문
다항식 $P(x)=x^4+ax^2+b$가 $x^2+1$과 $x^2+4$로 각각 나누어떨어질 때, $a+b$의 값을 구하면? (단, $a$, $b$는 상수)
### 선지
① $5$ ② $6$ ③ $8$ ④ $9$ ⑤ $13$
### 정답
④
### 해설
$x^2+1$과 $x^2+4$는 서로소이고 최고차항의 계수가 $1$인 사차식 $P(x)$가 두 이차식으로 각각 나누어떨어지므로 $$P(x)=(x^2+1)(x^2+4)=x^4+5x^2+4$$ 따라서 $a=5$, $b=4$이므로 $a+b=9$이다. 정답은 ④이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q16",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "서로소인 두 이차인수 x^2+1과 x^2+4의 곱이 최고차항 계수 1인 사차식 P(x)와 같음을 이용한다.",
  "decisiveStep": "(x^2+1)(x^2+4)=x^4+5x^2+4를 전개해 a=5, b=4를 얻는다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "서로소인 두 이차 인수의 곱으로 사차다항식 P(x)를 바로 구성해 계수를 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "인수정리와다항식",
    "task": "계수합구하기",
    "given": "복이차식과두이차인수",
    "condition": "나누어떨어짐"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q17
- 형식: 객관식
- 배점: 4.3
### 발문
$x^3-4x^2+6x-5$를 $a(x-1)^3+b(x-1)^2+c(x-1)+d$로 정리할 때, $abcd$의 값은?
### 선지
① $2$ ② $-2$ ③ $4$ ④ $-4$ ⑤ $1$
### 정답
①
### 해설
$t=x-1$이라 두면 $x=t+1$이므로 주어진 식에 대입하면 $$\begin{aligned} (t+1)^3-4(t+1)^2+6(t+1)-5 &= (t^3+3t^2+3t+1)-(4t^2+8t+4)+(6t+6)-5 \ &= t^3-t^2+t-2 \end{aligned}$$ 따라서 $a=1$, $b=-1$, $c=1$, $d=-2$이므로 $$abcd=1\times(-1)\times 1\times(-2)=2$$ 정답은 ①이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q17",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "t=x-1로 치환해 x=t+1을 대입하여 전개하거나 연쇄 조립제법으로 (x-1) 내림차순 계수를 구한다.",
  "decisiveStep": "t^3-t^2+t-2의 계수 1, -1, 1, -2를 구해 곱 2를 계산한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "x-1의 거듭제곱 전개 계수를 치환 전개 또는 연쇄 조립제법으로 구하는 3단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "항등식과조립제법",
    "task": "계수곱구하기",
    "given": "삼차다항식과거듭제곱꼴",
    "condition": "NONE"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q18
- 형식: 객관식
- 배점: 4.6
### 발문
두 복소수 $z_1=a+bi$, $z_2=c+di$에서 $a$, $b$, $c$, $d$는 자연수이고 $a>b$, $c>d$이다. $z_1\bar{z}_1=25$, $z_2\bar{z}_2=10$일 때, $z_1-z_2$는? (단, $i=\sqrt{-1}$, $\bar{z}$는 $z$의 켤레복소수이다.)
### 선지
① $-1+2i$ ② $1-2i$ ③ $1+2i$ ④ $2+i$ ⑤ $7+4i$
### 정답
③
### 해설
$z_1\bar{z}_1=a^2+b^2=25$에서 $a, b$는 자연수이고 $a>b$이므로 $(a, b)=(4, 3)$이다. 마찬가지로 $z_2\bar{z}_2=c^2+d^2=10$에서 $c, d$는 자연수이고 $c>d$이므로 $(c, d)=(3, 1)$이다. 따라서 $$z_1-z_2=(4+3i)-(3+i)=1+2i$$ 정답은 ③이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q18",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "z*bar(z)=a^2+b^2 성질과 자연수·대소 조건(a>b, c>d)으로 두 제곱의 합 부정방정식을 풀어 z_1, z_2를 구한다.",
  "decisiveStep": "a^2+b^2=25에서 (4,3), c^2+d^2=10에서 (3,1)을 유일하게 결정한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": ["COND_NATURAL_NUMBER"],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "켤레곱 a^2+b^2과 자연수·대소 부정방정식 조건을 결합해 복소수를 구하는 3단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "복소수와부정방정식",
    "task": "복소수차구하기",
    "given": "두복소수켤레곱",
    "condition": "자연수대소조건"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q19
- 형식: 객관식
- 배점: 4.8
### 발문
최고차항의 계수가 $1$인 이차다항식 $P(x)=x^2+ax+b$가 $P(0)=4$를 만족시킨다. $P(x)P(x-3)$이 $(x-2)(x-5)$로 나누어떨어질 때, ${P(4)}^2$의 값을 구하면?
### 선지
① $4$ ② $8$ ③ $9$ ④ $12$ ⑤ $16$
### 정답
⑤
### 해설
$P(0)=4$이므로 $b=4$이다. $P(x)P(x-3)$이 $(x-2)(x-5)$로 나누어떨어지므로 $x=2$와 $x=5$를 대입하면 $$P(2)P(-1)=0, \quad P(5)P(2)=0$$ 만약 $P(2)\ne 0$이면 $P(-1)=0$이고 $P(5)=0$이므로 $P(x)=(x+1)(x-5)=x^2-4x-5$가 되어 상수항 $b=4$에 모순이다. 따라서 $P(2)=0$이어야 한다. $P(2)=4+2a+4=0$에서 $a=-4$이므로 $P(x)=x^2-4x+4=(x-2)^2$이다. 그러므로 $P(4)=(4-2)^2=4$이고, ${P(4)}^2=16$이다. 정답은 ⑤이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q19",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "P(2)P(-1)=0과 P(5)P(2)=0에서 P(2)!=0인 경우의 상수항 모순을 보여 P(2)=0을 확정한다.",
  "decisiveStep": "P(-1)=P(5)=0이면 상수항이 -5가 되어 P(0)=4와 모순임을 확인하고 P(x)=(x-2)^2을 얻는다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 4,
  "difficultyConfidence": "medium",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다항식 곱의 인수정리에서 경우를 나누고 상수항 조건으로 모순을 제거하는 4단계 추론 문항이다.",
  "level": "상",
  "item4slot": {
    "topic": "인수정리와다항식추론",
    "task": "함숫값제곱구하기",
    "given": "이차다항식곱나누어떨어짐",
    "condition": "상수항조건"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q20
- 형식: 객관식
- 배점: 4.8
### 발문
이차함수 $f(x)=x^2-7x+t$의 그래프 위의 세 점 $A(a, k)$, $B(b, k)$, $C(c, d)$ ($a<b<c$)에 대하여 점 $B$를 지나고 기울기가 $4$인 직선이 점 $C$를 지나고, 점 $A$를 지나고 기울기가 $2$인 직선이 점 $C$를 지난다. 이때, 삼각형 $ABC$의 넓이는?
### 선지
① $6$ ② $8$ ③ $10$ ④ $12$ ⑤ $16$
### 정답
②
### 해설
$A(a, k)$와 $B(b, k)$의 $y$좌표가 같으므로 $f(x)=x^2-7x+t$의 대칭축 $x=\dfrac{7}{2}$에 대하여 대칭이다. 따라서 $$a+b=7$$ 두 점 $B$, $C$를 지나는 직선의 기울기가 $4$이므로 $$\dfrac{f(c)-f(b)}{c-b}=\dfrac{(c^2-7c+t)-(b^2-7b+t)}{c-b}=b+c-7=4 \implies b+c=11$$ 같은 방법으로 두 점 $A$, $C$를 지나는 직선의 기울기가 $2$이므로 $$a+c-7=2 \implies a+c=9$$ 세 식을 모두 더하면 $2(a+b+c)=27 \implies a+b+c=\dfrac{27}{2}$이고, 각각 빼면 $$a=\dfrac{5}{2}, \quad b=\dfrac{9}{2}, \quad c=\dfrac{13}{2}$$ 따라서 삼각형 $ABC$의 밑변의 길이는 $\overline{AB}=b-a=2$이고, 점 $C$와 직선 $AB$ ($y=k$) 사이의 거리(높이)는 $$d-k=f(c)-f(b)=4(c-b)=4\times 2=8$$ 그러므로 삼각형 $ABC$의 넓이는 $\dfrac{1}{2}\times 2\times 8=8$이고, 정답은 ②이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q20",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "대칭성 a+b=7과 두 할선 기울기 식 b+c-7=4, a+c-7=2를 연립해 세 점의 x좌표와 삼각형 넓이를 구한다.",
  "decisiveStep": "a=5/2, b=9/2, c=13/2를 구하고 밑변 AB=2, 높이 4(c-b)=8로 넓이 8을 계산한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "medium",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "포물선 위 세 점의 대칭성과 두 할선 기울기를 연립해 좌표를 구하고 도형 넓이까지 연결하는 4단계 문항이다.",
  "level": "상",
  "item4slot": {
    "topic": "이차함수와직선넓이",
    "task": "삼각형넓이구하기",
    "given": "포물선위세점과기울기",
    "condition": "대소조건"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q21
- 형식: 단답형
- 배점: 5
### 발문
$(x-2)^4=x^4+ax^3+24x^2+bx+16$이 $x$에 대한 항등식일 때, 상수 $a$, $b$의 값을 구하시오.
### 선지
없음
### 정답
$a=-8, b=-32$
### 해설
좌변을 전개하면 $$\begin{aligned} (x-2)^4 &= (x^2-4x+4)^2 \ &= x^4-8x^3+24x^2-32x+16 \end{aligned}$$ 우변 $x^4+ax^3+24x^2+bx+16$과 계수를 비교하면 $a=-8$, $b=-32$이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q21",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "(x-2)^4=(x^2-4x+4)^2을 전개한 뒤 항등식 계수비교법으로 a, b를 구한다.",
  "decisiveStep": "x^3항 계수 -8과 x항 계수 -32를 직접 비교해 구한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "(x-2)^4 전개 후 항등식 계수비교를 적용하는 기본 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "항등식과다항식전개",
    "task": "계수구하기",
    "given": "사차거듭제곱항등식",
    "condition": "항등식조건"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q22
- 형식: 서술형
- 배점: 7
### 발문
다항식 $P(x)$를 $x^2-3x-4$로 나눈 몫이 $x^2+3x+2$이고 나머지가 $2x-5$일 때, $P(5)$의 값을 구하는 과정을 서술하시오.
### 선지
없음
### 정답
$257$
### 해설
다항식의 나눗셈의 관계식에 의하여 $$P(x)=(x^2-3x-4)(x^2+3x+2)+(2x-5)$$ 양변에 $x=5$를 대입하면 $$P(5)=(25-15-4)(25+15+2)+(10-5)=6\times 42+5=252+5=257$$ 따라서 $P(5)=257$이다.



```json
"NONE"

```


```json
{
  "sourceQid": "Q22",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "나눗셈 항등식 P(x)=(x^2-3x-4)(x^2+3x+2)+2x-5를 세우고 x=5를 대입한다.",
  "decisiveStep": "P(5)=6*42+5=257을 계산한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "나눗셈 관계식을 작성한 뒤 x=5를 대입해 함숫값을 구하는 기본 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "다항식의나눗셈",
    "task": "함숫값구하기",
    "given": "나누는식과몫나머지",
    "condition": "NONE"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```

## Q23
- 형식: 단답형
- 배점: 8
### 발문
실수 $a$, $b$에 대하여 $f(x)=x^2-2ax+b$이고 $a=\dfrac{7}{2}$이다. $0\le x\le 3$에서 $f(x)$의 최댓값을 $M$, 최솟값을 $m$이라 할 때 $M=3m$이다. $2a+b$의 값을 구하시오.
### 선지
없음
### 정답
$25$
### 해설
$a=\dfrac{7}{2}$이므로 $$f(x)=x^2-7x+b=\left(x-\dfrac{7}{2}\right)^2+b-\dfrac{49}{4}$$ 아래로 볼록한 포물선이고 대칭축 $x=\dfrac{7}{2}$이 구간 $0\le x\le 3$의 오른쪽에 있으므로 이 구간에서 $f(x)$는 감소한다. 따라서 $$M=f(0)=b, \quad m=f(3)=9-21+b=b-12$$ $M=3m$이므로 $$b=3(b-12) \implies b=3b-36 \implies 2b=36 \implies b=18$$ 그러므로 구하는 값은 $$2a+b=2\left(\dfrac{7}{2}\right)+18=7+18=25$$



```json
"NONE"

```


```json
{
  "sourceQid": "Q23",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": null,
  "curriculum": "2015",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "대칭축 x=7/2가 구간 [0, 3] 오른쪽에 있어 감소함을 이용해 M=f(0), m=f(3)으로 두고 M=3m을 푼다.",
  "decisiveStep": "b=3(b-12)에서 b=18을 구해 2a+b=25를 계산한다.",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": ["COND_RANGE"],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "대칭축 외부 감소 구간에서 최대·최솟값 식을 세우고 비례 조건 M=3m으로 미지수를 결정하는 3단계 문항이다.",
  "level": "중",
  "item4slot": {
    "topic": "이차함수의최대최소",
    "task": "식의값구하기",
    "given": "대칭축외부구간이차함수",
    "condition": "최대최소비례조건"
  },
  "hold": "정본 폴더 내 메타_키선택표_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate를 null로 보류함."
}

```
