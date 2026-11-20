```json:exam
{"stem": "24_연향중_1학기_기말_중3_유사", "sourceArchiveFile": "original/middle/m3/1final/24_연향중_1학기_기말_중3_기출c.js", "examFolder": "1final", "grade": "중3", "curriculum": "2015", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-16"}
```


## Q01
- 형식: 객관식
- 배점: 3
### 발문
다음 중 이차방정식이 아닌 것을 모두 고른 것은? [3점] ㄱ. $x^2-5=3x$ \quad ㄴ. $3x^2+2=x+3x^2$ ㄷ. $(x-1)(x+4)=0$ \quad ㄹ. $x(x-2)=(x+1)(x-4)$ ㅁ. $x(x-4)=5-2x^2$ \quad ㅂ. $(3+x)(3-x)=-2x^2+1$
### 선지
① ㄱ, ㄹ ② ㄴ, ㄹ ③ ㄴ, ㅂ ④ ㄷ, ㅁ ⑤ ㄱ, ㅂ
### 정답
②
### 해설
모든 항을 좌변으로 이항하여 정리했을 때 $x^2$항이 남는지 확인한다.


* ㄱ: $x^2-3x-5=0$(이차방정식) * ㄴ:$-x+2=0$(일차방정식) * ㄷ:$x^2+3x-4=0$(이차방정식) * ㄹ:$x^2-2x=x^2-3x-4 \implies x+4=0$(일차방정식) * ㅁ:$3x^2-4x-5=0$(이차방정식) * ㅂ:$9-x^2=-2x^2+1 \implies x^2+8=0$ (이차방정식) 따라서 이차방정식이 아닌 것은 ㄴ, ㄹ이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "전개·이항 후 이차방정식 판별", "primaryMethod": "각 방정식을 전개하고 한쪽으로 이항하여 $x^2$항이 소거되는 식을 찾는다.", "decisiveStep": "ㄴ과 ㄹ에서 양변의 $x^2$항이 소거되어 일차방정식이 됨을 확인한다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "이차방정식과 해", "l4": "이차방정식 판별"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_ROOT_IDENTIFICATION", "templateKey": null, "why": "전개 및 이항 후 이차항이 사라져 이차방정식이 아닌 것을 고르는 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "전개 후 이차항 소거 여부만 확인하면 되는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_YH_1F_01", "format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식이 아닌 것을 모두 고른 것은?"}], "goal": [{"term": "일차방정식", "src": "solution", "quote": "-x+2=0$ (일차방정식)"}], "method": [{"term": "이항", "src": "solution", "quote": "모든 항을 좌변으로 이항하여"}], "condition": []}, "reasons": {"method": "전개 후 좌변으로 이항하여 $x^2$항이 소거되는 식을 판별한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q02
- 형식: 객관식
- 배점: 4
### 발문
이차방정식 $2x^2+5x-4=0$의 두 근이 $x=\alpha$ 또는 $x=\beta$일 때, $(2\alpha^2+5\alpha-1)(2\beta^2+5\beta+2)$의 값은? [4점]
### 선지
① $6$ ② $12$ ③ $15$ ④ $18$ ⑤ $24$
### 정답
④
### 해설
$\alpha, \beta$가 모두 방정식의 근이므로 $2\alpha^2 + 5\alpha = 4$, $2\beta^2 + 5\beta = 4$ $\begin{aligned} (2\alpha^2+5\alpha-1)(2\beta^2+5\beta+2) &= (4-1)(4+2) \ &= 3 \times 6 = 18 \end{aligned}$



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "방정식의 근 대입과 이차식의 값", "primaryMethod": "두 근 $\\alpha, \\beta$를 방정식에 대입해 $2\\alpha^2+5\\alpha=4$, $2\\beta^2+5\\beta=4$를 얻어 식에 대입한다.", "decisiveStep": "근의 공식 없이 $2\\alpha^2+5\\alpha=4$와 $2\\beta^2+5\\beta=4$를 바로 치환한다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "이차방정식과 해", "l4": "해의 확인"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_ROOT_SUBSTITUTION", "templateKey": null, "why": "방정식의 근을 대입한 관계식을 괄호 식에 바로 대입해 값을 구하는 문항이다."}, "crossConceptKeys": ["CC_EQUATION_ROOT_SUBSTITUTION_IDENTITY"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근을 직접 구하지 않고 이차식 덩어리 값을 치환하는 발상이 필요한 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_YH_1F_02", "format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $2x^2+5x-4=0$의 두 근"}], "goal": [{"term": "식의값", "src": "stem", "quote": "$(2\\alpha^2+5\\alpha-1)(2\\beta^2+5\\beta+2)$의 값은?"}], "method": [{"term": "대입", "src": "solution", "quote": "2\\alpha^2 + 5\\alpha = 4"}], "condition": []}, "reasons": {"method": "$2\\alpha^2+5\\alpha=4$와 $2\\beta^2+5\\beta=4$를 주어진 곱에 대입한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q03
- 형식: 객관식
- 배점: 4
### 발문
이차방정식 $x^2+2ax+15=0$의 한 근이 $-3$일 때, $a$의 값과 다른 한 근을 $b$라 하면 $a+b$의 값은? [4점]
### 선지
① $-1$ ② $-9$ ③ $1$ ④ $4$ ⑤ $9$
### 정답
①
### 해설
$x=-3$을 대입하면 $\begin{aligned} (-3)^2 + 2a(-3) + 15 &= 0 \ 24 - 6a &= 0 \implies a = 4 \end{aligned}$ $x^2 + 8x + 15 = (x+3)(x+5) = 0$이므로 다른 한 근은 $b = -5$이다. 따라서 $a + b = 4 + (-5) = -1$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "한 근이 주어진 이차방정식의 계수와 다른 근", "primaryMethod": "주어진 근 $x=-3$을 대입해 $a=4$를 구한 뒤 방정식을 인수분해해 다른 근 $b=-5$를 찾는다.", "decisiveStep": "$a=4$를 대입한 $x^2+8x+15=0$을 인수분해해 $b=-5$를 구한다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "이차방정식과 해", "l4": "해가 주어진 이차방정식의 계수 결정"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_ROOT_SUBSTITUTION", "templateKey": null, "why": "주어진 근으로 미정계수를 정한 뒤 인수분해로 나머지 근을 구하는 문항이다."}, "crossConceptKeys": ["CC_ZERO_PRODUCT_PROPERTY"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "근 대입과 인수분해를 순차적으로 2단계 수행하는 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_YH_1F_03", "format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+2ax+15=0$의 한 근이 $-3$"}], "goal": [{"term": "합", "src": "stem", "quote": "$a+b$의 값은?"}], "method": [{"term": "인수분해", "src": "solution", "quote": "x^2 + 8x + 15 = (x+3)(x+5) = 0"}], "condition": []}, "reasons": {"method": "$x=-3$을 대입해 $a=4$를 구하고 인수분해로 $b=-5$를 구한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q04
- 형식: 객관식
- 배점: 4
### 발문
다음 이차방정식 중 해가 유리수가 아닌 것은? [4점]
### 선지
① $x^2-4=0$ ② $3(x-1)^2=12$ ③ $(x+2)^2=18$ ④ $x^2-7x+10=0$ ⑤ $5x^2-8x=(2x-2)^2$
### 정답
③
### 해설
* ① $x = \pm 2$(유리수) * ②$(x-1)^2 = 4 \implies x = 3$ 또는 $x = -1$(유리수) * ③$(x+2)^2 = 18 \implies x = -2 \pm 3\sqrt{2}$(무리수) * ④$(x-2)(x-5) = 0 \implies x = 2$ 또는 $x = 5$(유리수) * ⑤$5x^2-8x = 4x^2-8x+4 \implies x^2-4=0 \implies x = \pm 2$ (유리수) 따라서 해가 유리수가 아닌 것은 ③이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "이차방정식 해의 유리수/무리수 판별", "primaryMethod": "다섯 이차방정식을 각각 풀어 근호가 남는 무리수 해를 갖는 것을 고른다.", "decisiveStep": "③에서 $18$이 제곱수가 아니므로 $x=-2\\pm 3\\sqrt{2}$가 무리수임을 확인한다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "제곱근·완전제곱식을 이용한 풀이", "l4": "제곱근 이용"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_SQUARE_ROOT_METHOD", "templateKey": null, "why": "각 이차방정식의 해를 구해 무리수 해를 찾는 문항이다."}, "crossConceptKeys": ["CC_RATIONAL_ROOT_CONDITION"], "conditionKeys": ["COND_RATIONAL"], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "다섯 개의 방정식을 각각 정리해 해가 유리수인지 판별해야 하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_YH_1F_04", "format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "다음 이차방정식 중"}], "goal": [{"term": "유리수", "src": "stem", "quote": "해가 유리수가 아닌 것은?"}], "method": [{"term": "제곱근", "src": "solution", "quote": "x = -2 \\pm 3\\sqrt{2}"}], "condition": []}, "reasons": {"method": "각 방정식의 해를 구해 제곱근이 소거되지 않는 것을 찾는다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q05
- 형식: 객관식
- 배점: 4
### 발문
이차방정식 $3x^2-8x-p=0$의 해가 $x=\dfrac{q\pm\sqrt{22}}{3}$일 때, 상수 $p$, $q$에 대하여 $p+q$의 값은? [4점]
### 선지
① $-2$ ② $2$ ③ $4$ ④ $5$ ⑤ $6$
### 정답
⑤
### 해설
짝수 근의 공식을 적용하면 ($a=3, b'=-4, c=-p$) $\begin{aligned} x &= \frac{-(-4) \pm \sqrt{(-4)^2 - 3(-p)}}{3} = \frac{4 \pm \sqrt{16+3p}}{3} \ q &= 4, \quad 16 + 3p = 22 \implies 3p = 6 \implies p = 2 \ p + q &= 2 + 4 = 6 \end{aligned}$



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "근의 공식 결과와 무리수 해 계수 비교", "primaryMethod": "짝수 근의 공식을 적용해 얻은 식의 유리수 부분과 근호 안 식을 주어진 해와 비교한다.", "decisiveStep": "$q=4$와 $16+3p=22$를 비교해 $p=2$를 구한다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "근의 공식", "l4": "근의 공식"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_SQUARE_ROOT_METHOD", "templateKey": null, "why": "짝수 근의 공식 결과와 주어진 해를 비교해 미정계수를 구하는 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "짝수 근의 공식에 대입해 바로 비교하면 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_YH_1F_05", "format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $3x^2-8x-p=0$"}], "goal": [{"term": "합", "src": "stem", "quote": "$p+q$의 값은?"}], "method": [{"term": "해", "src": "stem", "quote": "해가 $x=\\dfrac{q\\pm\\sqrt{22}}{3}$일 때"}], "condition": []}, "reasons": {"method": "짝수 근의 공식을 적용해 분자와 근호 안을 비교한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q06
- 형식: 객관식
- 배점: 4
### 발문
이차방정식 $9x^2+px+16=0$이 중근을 가질 때, 음수 $p$의 값과 그때의 이차방정식의 해 $q$에 대하여 $p-q$의 값은? [4점]
### 선지
① $-\dfrac{70}{3}$ ② $-\dfrac{76}{3}$ ③ $\dfrac{70}{3}$ ④ $\dfrac{76}{3}$ ⑤ $-20$
### 정답
②
### 해설
$9x^2+px+16=0$이 중근을 가지므로 판별식 $p^2 - 4(9)(16) = 0$이다. $p^2 = 576 \implies p = \pm 24$ $p < 0$이므로 $p = -24$이다. 이때 방정식은 $9x^2 - 24x + 16 = (3x - 4)^2 = 0$이므로 중근은 $q = \frac{4}{3}$이다. $p - q = -24 - \frac{4}{3} = -\frac{76}{3}$



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "중근 조건으로 계수와 중근 동시에 구하기", "primaryMethod": "중근 조건으로 음수 $p=-24$를 정한 뒤 완전제곱식 $(3x-4)^2=0$에서 중근 $q=\\frac{4}{3}$를 구한다.", "decisiveStep": "음수 $p=-24$를 대입해 $(3x-4)^2=0$을 풀어 $q=\\frac{4}{3}$를 얻는다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "근의 공식", "l4": "근의 개수·판별"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_DOUBLE_ROOT", "templateKey": null, "why": "중근 조건에서 음수 계수 $p$와 그때의 중근 $q$를 함께 구하는 문항이다."}, "crossConceptKeys": [], "conditionKeys": ["COND_NEGATIVE"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중근 조건으로 $p$를 결정한 뒤 방정식에 대입해 중근 $q$까지 구하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_YH_1F_06", "format": "단일 정답", "slots": {"given": [{"term": "중근", "src": "stem", "quote": "이차방정식 $9x^2+px+16=0$이 중근을 가질 때"}], "goal": [{"term": "차", "src": "stem", "quote": "$p-q$의 값은?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "(3x - 4)^2 = 0"}], "condition": [{"term": "음수", "src": "stem", "quote": "음수 $p$의 값"}]}, "reasons": {"method": "판별식 $=0$으로 $p=-24$를 정하고 $(3x-4)^2=0$에서 중근 $q$를 구한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q07
- 형식: 객관식
- 배점: 4
### 발문
이차방정식 $(x-2)(x+4)=3x-6$의 두 근 중 큰 근을 $p$라고 할 때, 이차방정식 $px^2-(p^2+1)x-3=0$의 두 근의 합은? [4점]
### 선지
① $-\dfrac{5}{2}$ ② $-\dfrac{1}{2}$ ③ $\dfrac{3}{2}$ ④ $\dfrac{5}{2}$ ⑤ $\dfrac{7}{2}$
### 정답
④
### 해설
$(x-2)(x+4) = 3(x-2)$에서 $(x-2)(x+4-3) = (x-2)(x+1) = 0$이므로 두 근은 $2, -1$이다. 큰 근은 $p = 2$이다. $p=2$를 두 번째 방정식에 대입하면 $\begin{aligned} 2x^2 - 5x - 3 &= 0 \ (2x + 1)(x - 3) &= 0 \ x &= -\frac{1}{2} \quad \text{또는} \quad x = 3 \end{aligned}$ 따라서 두 근의 합은 $-\frac{1}{2} + 3 = \frac{5}{2}$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "첫 방정식의 근을 계수로 갖는 이차방정식", "primaryMethod": "첫 번째 방정식을 풀어 큰 근 $p=2$를 구하고 두 번째 방정식에 대입해 인수분해한다.", "decisiveStep": "$p=2$를 대입한 $2x^2-5x-3=(2x+1)(x-3)=0$의 두 근을 더한다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "인수분해를 이용한 풀이", "l4": "기본 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_ZERO_PRODUCT", "templateKey": null, "why": "두 이차방정식을 순차적으로 인수분해해 두 근의 합을 구하는 문항이다."}, "crossConceptKeys": ["CC_ZERO_PRODUCT_PROPERTY"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "첫 번째 방정식을 정리해 $p$를 찾고 두 번째 방정식을 인수분해해 두 근의 합을 구하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_YH_1F_07", "format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $(x-2)(x+4)=3x-6$"}], "goal": [{"term": "합", "src": "stem", "quote": "두 근의 합은?"}], "method": [{"term": "인수분해", "src": "solution", "quote": "(2x + 1)(x - 3) &= 0"}], "condition": []}, "reasons": {"method": "두 이차방정식을 차례로 인수분해해 두 근의 합을 구한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q08
- 형식: 객관식
- 배점: 3
### 발문
다음 중 이차함수 $y=2x^2$의 그래프에 대한 설명으로 옳지 않은 것은? [3점]
### 선지
① 위로 볼록한 포물선이다. ② 꼭짓점은 원점이다. ③ 점 $(-2, 8)$을 지난다. ④ $y=3x^2$의 그래프보다 폭이 더 넓다. ⑤ $x<0$일 때, $x$의 값이 증가하면 $y$의 값은 감소한다.
### 정답
①
### 해설
$y=2x^2$은 $x^2$의 계수가 $2>0$이므로 아래로 볼록한 포물선이다. (① 거짓) ② 꼭짓점은 원점 $(0,0)$이다. ③ $x=-2$일 때 $y=2(-2)^2=8$이므로 $(-2, 8)$을 지난다. ④ $|2|<|3|$이므로 $y=3x^2$보다 폭이 넓다. ⑤ $x<0$일 때, $x$가 증가하면 $y$는 감소한다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "기본형 y=ax² 그래프의 성질", "primaryMethod": "$y=2x^2$에서 $a=2>0$임을 이용해 볼록 방향, 꼭짓점, 폭, 증감을 선지별로 확인한다.", "decisiveStep": "$a=2>0$이므로 아래로 볼록함을 확인해 ①이 거짓임을 밝힌다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수와 그 그래프", "l3": "y=ax²의 그래프", "l4": "그래프의 모양"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_BASIC_FORM", "templateKey": null, "why": "기본형 $y=2x^2$의 그래프 성질을 판별하는 기초 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기본형 이차함수의 부호와 폭 성질만 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_YH_1F_08", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=2x^2$의 그래프"}], "goal": [{"term": "포물선", "src": "solution", "quote": "아래로 볼록한 포물선이다."}], "method": [{"term": "계수", "src": "solution", "quote": "$x^2$의 계수가 $2>0$이므로"}], "condition": []}, "reasons": {"method": "$a=2>0$이므로 아래로 볼록함을 확인해 틀린 보기를 고른다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q09
- 형식: 객관식
- 배점: 5
### 발문
다음 그림과 같이 점 $\text{A}, \text{B}$는 $x$축 위에 있고, 점 $\text{C}, \text{D}$는 이차함수 $y=3x^2$의 그래프 위에 있다. 직사각형 $\text{ABCD}$의 넓이가 $48$일 때, 직사각형 $\text{ABCD}$의 둘레의 길이는? (단, 점 $\text{B}, \text{C}$는 제$1$사분면 방향에 있다.) [5점]
### 선지
① $16$ ② $24$ ③ $32$ ④ $36$ ⑤ $48$
### 정답
③
### 해설
제$1$사분면 위의 점 $\text{C}$의 좌표를 $(t, 3t^2)\ (t>0)$이라 하면 $y=3x^2$은 $y$축에 대하여 대칭이므로 $\text{D}(-t, 3t^2)$이다. 직사각형 $\text{ABCD}$의 가로는 $2t$, 세로는 $3t^2$이고 넓이가 $48$이므로 $\begin{aligned} 2t \times 3t^2 &= 48 \ 6t^3 &= 48 \ t^3 &= 8 \implies t = 2 \end{aligned}$ 따라서 가로의 길이는 $4$, 세로의 길이는 $12$이므로 둘레의 길이는 $2(4 + 12) = 32$이다.



```json
{"target": "y=3x^2 그래프와 x축 사이에 내접하는 직사각형 ABCD", "type": "coordinate_parabola_rectangle", "axes": {"x": [-3, 3], "y": [-1, 14], "origin": "O"}, "curve": {"eq": "y=3x^2", "domain": [-2.2, 2.2]}, "points": {"A": [-2, 0], "B": [2, 0], "C": [2, 12], "D": [-2, 12]}, "polygon": ["A", "B", "C", "D"]}

```


```json
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "포물선 내접 직사각형의 넓이와 둘레", "primaryMethod": "제1사분면 위 꼭짓점 $\\text{C}(t, 3t^2)$을 잡고 $y$축 대칭으로 가로 $2t$, 세로 $3t^2$을 구해 넓이 방정식을 푼다.", "decisiveStep": "넓이 $6t^3=48$에서 $t=2$를 구해 가로 $4$, 세로 $12$를 얻는다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수와 그 그래프", "l3": "그래프와 식", "l4": "점의 좌표"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_INSCRIBED_RECTANGLE", "templateKey": null, "why": "포물선 $y=3x^2$에 내접하는 직사각형의 넓이 조건으로 둘레를 구하는 문항이다."}, "crossConceptKeys": ["CC_PARABOLA_AXIS_SYMMETRY", "CC_GEOMETRIC_AREA_VOLUME_FORMULA"], "conditionKeys": ["COND_POSITIVE"], "integrationPattern": "INTERDEPENDENT", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "점의 좌표를 미지수 $t$로 설정하고 대칭성으로 변의 길이를 표현해 $t^3=8$을 풀어야 하는 3단계 문항이다.", "level": "상", "item4slot": {"questionUid": "PENDING_24_YH_1F_09", "format": "단일 정답", "slots": {"given": [{"term": "직사각형", "src": "stem", "quote": "직사각형 $\\text{ABCD}$의 넓이가 $48$일 때"}], "goal": [{"term": "둘레", "src": "stem", "quote": "직사각형 $\\text{ABCD}$의 둘레의 길이는?"}], "method": [{"term": "대칭성", "src": "solution", "quote": "$y$축에 대하여 대칭이므로"}], "condition": [{"term": "사분면", "src": "stem", "quote": "제$1$사분면 방향에 있다."}]}, "reasons": {"method": "$y$축 대칭으로 $\\text{C}(t, 3t^2)$을 잡아 넓이 $6t^3=48$을 푼다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q10
- 형식: 객관식
- 배점: 4
### 발문
두 이차함수 $y=-2x^2$과 $y=-2x^2-7$의 그래프가 다음 그림과 같을 때, $\overline{\text{AB}}$의 길이는? (단, $\overline{\text{AB}}$는 $y$축에 평행하다.) [4점]
### 선지
① $2$ ② $4$ ③ $5$ ④ $6$ ⑤ $7$
### 정답
⑤
### 해설
선분 $\text{AB}$가 $y$축에 평행하므로 두 점 $\text{A}, \text{B}$의 $x$좌표를 $t$라 하면 $\text{A}(t, -2t^2)$, $\text{B}(t, -2t^2-7)$ $\overline{\text{AB}} = (-2t^2) - (-2t^2 - 7) = 7$



```json
{"target": "평행이동 관계인 두 포물선 사이의 수직 선분 AB", "type": "coordinate_two_parabolas", "axes": {"x": [-3, 3], "y": [-12, 2], "origin": "O"}, "curves": [{"eq": "y=-2x^2", "domain": [-2, 2]}, {"eq": "y=-2x^2-7", "domain": [-2, 2]}], "segment": {"A": [1, -2], "B": [1, -9], "parallel": "y-axis"}}

```


```json
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "y축 평행이동된 두 포물선 사이의 세로 길이", "primaryMethod": "같은 $x=t$에서의 두 함숫값 차가 평행이동 거리 $7$과 같음을 이용한다.", "decisiveStep": "$(-2t^2)-(-2t^2-7)=7$로 $t$에 관계없이 길이가 일정함을 확인한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "꼭짓점형", "l4": "평행이동"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_TRANSLATION", "templateKey": null, "why": "상하 평행이동된 두 포물선 위의 같은 $x$좌표 두 점 사이 거리를 구하는 문항이다."}, "crossConceptKeys": ["CC_QUADRATIC_VERTICAL_TRANSLATION", "CC_VERTICAL_SEGMENT_LENGTH"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동한 양만큼 세로 거리가 일정함을 바로 읽는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_YH_1F_10", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "두 이차함수 $y=-2x^2$과 $y=-2x^2-7$의 그래프"}], "goal": [{"term": "길이", "src": "stem", "quote": "$\\overline{\\text{AB}}$의 길이는?"}], "method": [{"term": "평행", "src": "stem", "quote": "$\\overline{\\text{AB}}$는 $y$축에 평행하다."}], "condition": []}, "reasons": {"method": "같은 $x$좌표 $t$에서의 $y$좌표 차이를 계산한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q11
- 형식: 객관식
- 배점: 3
### 발문
다음 중 $y$가 $x$에 관한 이차함수인 것은? [3점]
### 선지
① $y=x(x+4)$ ② $y=3x-5$ ③ $y=x^3-2x^2+4$ ④ $y=-(x+2)^2+x^2$ ⑤ $y=3+\dfrac{1}{x}$
### 정답
①
### 해설
* ① $y = x^2 + 4x$ (이차함수)
* ② 일차함수
* ③ 삼차함수
* ④ $y = -4x - 4$(일차함수) * ⑤ 분모에$x$가 있으므로 다항함수가 아니다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "식 전개 후 이차함수 판별", "primaryMethod": "각 식을 전개해 $y=ax^2+bx+c\\ (a\\ne 0)$ 꼴이 되는 것을 찾는다.", "decisiveStep": "④에서 $x^2$항이 소거됨을 확인하고 ①만 $y=x^2+4x$임을 판별한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수와 그 그래프", "l3": "이차함수의 뜻", "l4": "이차함수 판별"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_DEFINITION", "templateKey": null, "why": "일차·삼차·분수식 중에서 이차함수를 고르는 기초 문항이다."}, "crossConceptKeys": ["CC_FUNCTION_DEGREE_CLASSIFICATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "식을 전개해 $x^2$항의 잔존 여부만 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_YH_1F_11", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "$y$가 $x$에 관한 이차함수인 것은?"}], "goal": [{"term": "이차함수", "src": "solution", "quote": "y = x^2 + 4x$ (이차함수)"}], "method": [{"term": "일차함수", "src": "solution", "quote": "y = -4x - 4$ (일차함수)"}], "condition": []}, "reasons": {"method": "선지를 전개해 $x^2$항이 살아 있는 식을 고른다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q12
- 형식: 객관식
- 배점: 4
### 발문
다음 그림은 이차함수 $y=ax^2$의 그래프를 평행이동한 것이다. 이 그래프가 점 $(6, k)$를 지날 때, $k$의 값은? (단, $a$는 상수) [4점]
### 선지
① $3$ ② $4$ ③ $6$ ④ $7$ ⑤ $9$
### 정답
④
### 해설
그림에서 꼭짓점의 좌표가 $(3, 0)$이므로 축의 방정식은 $x=3$이고, 그래프는 점 $(0, 7)$을 지난다. $x=0$과 $x=6$은 축 $x=3$으로부터 같은 거리 $3$만큼 떨어져 있으므로 함숫값이 같다. 따라서 $k = 7$이다.



```json
{"target": "꼭짓점이 (3, 0)이고 (0, 7)을 지나는 포물선", "type": "coordinate_parabola", "axes": {"x": [-2, 8], "y": [-1, 9], "origin": "O"}, "parabola": {"vertex": [3, 0], "y_intercept": [0, 7], "eq": "y=7/9*(x-3)^2"}, "points": {"V": [3, 0], "Y": [0, 7]}}

```


```json
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "포물선 축 대칭을 이용한 함숫값 구하기", "primaryMethod": "꼭짓점 $(3,0)$에서 축이 $x=3$임을 읽고 $(0,7)$과 대칭인 점 $(6,7)$을 구한다.", "decisiveStep": "$a$를 구하지 않고도 $x=0$과 $x=6$이 축 $x=3$에 대칭임을 이용한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수와 그 그래프", "l3": "y=ax²의 그래프", "l4": "대칭축·증감"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY", "templateKey": null, "why": "축에 대한 대칭성을 이용해 대칭점의 $y$좌표를 바로 구하는 문항이다."}, "crossConceptKeys": ["CC_PARABOLA_AXIS_SYMMETRY"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "대칭축 $x=3$을 읽어 대칭점의 함숫값이 같음을 이용하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_YH_1F_12", "format": "단일 정답", "slots": {"given": [{"term": "꼭짓점", "src": "solution", "quote": "꼭짓점의 좌표가 $(3, 0)$"}], "goal": [{"term": "함숫값", "src": "solution", "quote": "함숫값이 같다."}], "method": [{"term": "축", "src": "solution", "quote": "축의 방정식은 $x=3$이고"}], "condition": []}, "reasons": {"method": "축 $x=3$에 대한 대칭성으로 $x=0$과 $x=6$의 함숫값이 같음을 이용한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q13
- 형식: 객관식
- 배점: 4
### 발문
축의 방정식이 $x=-1$이고 $y$축과 만나는 점의 $y$좌표가 $3$인 이차함수의 그래프가 두 점 $(1, 9)$, $(2, k)$를 지날 때, $k$의 값은? [4점]
### 선지
① $15$ ② $19$ ③ $21$ ④ $11$ ⑤ $25$
### 정답
②
### 해설
축이 $x=-1$이므로 이차함수의 식을 $y = a(x+1)^2 + q$라 놓는다. 두 점 $(0, 3)$, $(1, 9)$를 지나므로 $\begin{aligned} a + q &= 3 \ 4a + q &= 9 \end{aligned}$ 두 식을 연립하면 $3a = 6 \implies a = 2$, $q = 1$이다. 따라서 $y = 2(x+1)^2 + 1$이고, $x=2$를 대입하면 $k = 2(3)^2 + 1 = 19$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "축과 두 점이 주어진 이차함수 식 구하기", "primaryMethod": "축 $x=-1$로 $y=a(x+1)^2+q$를 세우고 $(0,3), (1,9)$를 대입해 $a, q$를 구한 뒤 $x=2$를 대입한다.", "decisiveStep": "연립방정식 $a+q=3, 4a+q=9$에서 $a=2, q=1$을 구한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "그래프와 계수", "l4": "조건으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_VERTEX_FORM", "templateKey": null, "why": "축의 방정식과 두 점의 좌표로부터 이차함수 식을 결정해 함숫값을 구하는 문항이다."}, "crossConceptKeys": ["CC_SYSTEM_OF_EQUATIONS", "CC_POINT_ON_CURVE_SUBSTITUTION"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "축을 이용해 식을 세우고 두 점을 대입해 연립방정식을 푼 뒤 $k$를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_YH_1F_13", "format": "단일 정답", "slots": {"given": [{"term": "축", "src": "stem", "quote": "축의 방정식이 $x=-1$"}], "goal": [{"term": "함숫값", "src": "stem", "quote": "$k$의 값은?"}], "method": [{"term": "대입", "src": "solution", "quote": "$x=2$를 대입하면"}], "condition": []}, "reasons": {"method": "$y=a(x+1)^2+q$에 두 점을 대입해 $a, q$를 구하고 $x=2$를 대입한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q14
- 형식: 객관식
- 배점: 4
### 발문
이차함수 $y=a(x+p)^2$의 그래프가 아래 그림과 같을 때, 다음 중 이차함수 $y=ax^2+p$의 그래프로 알맞은 설명은? (단, $a$, $p$는 상수이다.) [4점]
### 선지
① 아래로 볼록하고 꼭짓점이 $y$축의 양의 부분에 있는 포물선이다. ② 아래로 볼록하고 꼭짓점이 $y$축의 음의 부분에 있는 포물선이다. ③ 위로 볼록하고 꼭짓점이 $y$축의 양의 부분에 있는 포물선이다. ④ 위로 볼록하고 꼭짓점이 원점인 포물선이다. ⑤ 위로 볼록하고 꼭짓점이 $y$축의 음의 부분에 있는 포물선이다.
### 정답
⑤
### 해설
주어진 그림에서 포물선이 위로 볼록하므로 $a < 0$이고, 꼭짓점 $(-p, 0)$이 $y$축의 오른쪽에 있으므로 $-p > 0 \implies p < 0$이다. 따라서 이차함수 $y=ax^2+p$의 그래프는 $a<0$이므로 위로 볼록하고, 꼭짓점 $(0, p)$에서 $p<0$이므로 $y$축의 음의 부분에 있다. 그러므로 옳은 것은 ⑤이다.



```json
{"target": "위로 볼록하고 꼭짓점이 x축의 양의 부분에 있는 포물선", "type": "coordinate_parabola", "axes": {"x": [-2, 6], "y": [-5, 2], "origin": "O"}, "parabola": {"vertex": [3, 0], "direction": "down", "eq": "y=a(x+p)^2"}, "annotations": ["위로 볼록 (a<0)", "꼭짓점 (-p, 0)이 원점 오른쪽 (-p>0, 즉 p<0)"]}

```


```json
{"sourceQid": "14", "variationType": "CONDITION", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "주어진 포물선 부호로 변환된 이차함수 개형 판정", "primaryMethod": "원래 그래프에서 $a<0$과 $-p>0$($p<0$)을 읽어 새 식 $y=ax^2+p$의 볼록 방향과 꼭짓점 위치를 구한다.", "decisiveStep": "꼭짓점 $(-p,0)$이 오른쪽에 있어 $-p>0$, 즉 $p<0$임을 정확히 변환한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "그래프와 계수", "l4": "그래프 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_COEFFICIENT_SIGNS", "templateKey": null, "why": "그래프에서 계수 $a, p$의 부호를 읽어 다른 이차함수 그래프의 개형을 찾는 문항이다."}, "crossConceptKeys": ["CC_COEFFICIENT_SIGN_FROM_GRAPH"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "꼭짓점 $(-p,0)$에서 $p$의 부호를 반대 부호로 읽어야 하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_YH_1F_14", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=a(x+p)^2$의 그래프"}], "goal": [{"term": "꼭짓점", "src": "solution", "quote": "꼭짓점 $(0, p)$에서 $p<0$"}], "method": [{"term": "부호", "src": "solution", "quote": "-p > 0 \\implies p < 0"}], "condition": []}, "reasons": {"method": "그래프의 볼록 방향과 꼭짓점 위치에서 $a<0, p<0$을 구해 새 그래프를 판정한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q15
- 형식: 객관식
- 배점: 4
### 발문
이차함수 $y=x^2-4ax+3a^2+b$의 그래프의 꼭짓점의 좌표가 $(4, -2)$일 때, 상수 $a$, $b$에 대하여 $a+2b$의 값은? [4점]
### 선지
① $2$ ② $4$ ③ $6$ ④ $8$ ⑤ $10$
### 정답
③
### 해설
$\begin{aligned} y &= x^2 - 4ax + 4a^2 - a^2 + b \ &= (x - 2a)^2 - a^2 + b \end{aligned}$ 꼭짓점 $(2a, -a^2+b)$가 $(4, -2)$와 같으므로 $2a = 4 \implies a = 2$ $-a^2 + b = -4 + b = -2 \implies b = 2$ 따라서 $a + 2b = 2 + 2(2) = 6$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "문자 계수 이차함수의 완전제곱식 변형과 꼭짓점", "primaryMethod": "문자가 포함된 일반형을 완전제곱식으로 고쳐 꼭짓점 $(2a, -a^2+b)$를 $(4,-2)$와 비교한다.", "decisiveStep": "$y=(x-2a)^2-a^2+b$로 정리해 $2a=4$, $-a^2+b=-2$를 연립한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "일반형", "l4": "완전제곱식 변형"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_VERTEX_FORM", "templateKey": null, "why": "문자 계수 일반형을 표준형으로 변형해 주어진 꼭짓점과 비교하는 문항이다."}, "crossConceptKeys": ["CC_QUADRATIC_GENERAL_FORM"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문자가 포함된 일반형을 완전제곱식으로 변형해 두 식을 비교해야 하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_YH_1F_15", "format": "단일 정답", "slots": {"given": [{"term": "꼭짓점", "src": "stem", "quote": "꼭짓점의 좌표가 $(4, -2)$일 때"}], "goal": [{"term": "합", "src": "stem", "quote": "$a+2b$의 값은?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "(x - 2a)^2 - a^2 + b"}], "condition": []}, "reasons": {"method": "문자가 포함된 일반형을 $(x-2a)^2-a^2+b$로 고쳐 꼭짓점과 비교한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q16
- 형식: 객관식
- 배점: 4
### 발문
이차함수 $y=-2x^2+kx-3$의 그래프가 점 $(2, 5)$를 지날 때, 이 그래프의 축의 방정식은? [4점]
### 선지
① $x=-2$ ② $x=2$ ③ $x=4$ ④ $x=-4$ ⑤ $x=1$
### 정답
②
### 해설
점 $(2, 5)$를 대입하면 $\begin{aligned} 5 &= -2(2)^2 + 2k - 3 \ 5 &= -11 + 2k \implies 2k = 16 \implies k = 8 \end{aligned}$ $y = -2x^2 + 8x - 3 = -2(x-2)^2 + 5$ 따라서 축의 방정식은 $x = 2$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "지나는 점으로 계수 결정 후 축의 방정식", "primaryMethod": "점 $(2,5)$를 대입해 $k=8$을 구한 뒤 표준형으로 고쳐 축의 방정식을 찾는다.", "decisiveStep": "$k=8$을 구해 $y=-2(x-2)^2+5$에서 축 $x=2$를 얻는다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "일반형", "l4": "완전제곱식 변형"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY", "templateKey": null, "why": "한 점을 대입해 일차항 계수를 구한 뒤 축의 방정식을 구하는 문항이다."}, "crossConceptKeys": ["CC_POINT_ON_CURVE_SUBSTITUTION"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "점 대입으로 $k$를 구하고 표준형 변형으로 축을 찾는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_YH_1F_16", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=-2x^2+kx-3$의 그래프"}], "goal": [{"term": "축", "src": "stem", "quote": "축의 방정식은?"}], "method": [{"term": "대입", "src": "solution", "quote": "점 $(2, 5)$를 대입하면"}], "condition": []}, "reasons": {"method": "$(2,5)$를 대입해 $k=8$을 구하고 표준형으로 바꾸어 축을 구한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q17
- 형식: 객관식
- 배점: 4
### 발문
이차함수 $y=2x^2$의 그래프를 $x$축의 방향으로 $3$만큼, $y$축의 방향으로 $-7$만큼 평행이동하면 이차함수 $y=2x^2+px+q$의 그래프와 완전히 포개어진다. 이때 $p+q$의 값은? (단, $p$, $q$는 상수이다.) [4점]
### 선지
① $-12$ ② $-5$ ③ $1$ ④ $11$ ⑤ $-1$
### 정답
⑤
### 해설
$\begin{aligned} y &= 2(x - 3)^2 - 7 \ &= 2(x^2 - 6x + 9) - 7 \ &= 2x^2 - 12x + 11 \end{aligned}$ 따라서 $p = -12$, $q = 11$이므로 $p + q = -12 + 11 = -1$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "평행이동한 이차함수의 일반형 계수 구하기", "primaryMethod": "평행이동 식 $y=2(x-3)^2-7$을 전개해 일반형 계수 $p, q$를 구한다.", "decisiveStep": "$2(x-3)^2-7=2x^2-12x+11$로 전개해 $p=-12, q=11$을 얻는다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "꼭짓점형", "l4": "평행이동"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_TRANSLATION", "templateKey": null, "why": "평행이동한 표준형을 전개해 일반형 계수의 합을 구하는 문항이다."}, "crossConceptKeys": ["CC_BINOMIAL_SQUARE_EXPANSION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "평행이동 식을 세워 전개만 하면 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_YH_1F_17", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=2x^2$의 그래프"}], "goal": [{"term": "합", "src": "stem", "quote": "$p+q$의 값은?"}], "method": [{"term": "평행이동", "src": "stem", "quote": "$x$축의 방향으로 $3$만큼, $y$축의 방향으로 $-7$만큼 평행이동"}], "condition": []}, "reasons": {"method": "$y=2(x-3)^2-7$을 전개해 $p, q$를 구한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q18
- 형식: 객관식
- 배점: 4
### 발문
다음 중 이차함수 $y=-x^2+6x-4$의 그래프에 대한 설명으로 옳지 않은 것은? [4점]
### 선지
① 축의 방정식은 $x=-3$이다. ② $y$절편은 $-4$이다. ③ 꼭짓점의 좌표는 $(3, 5)$이다. ④ $x<3$일 때, $x$의 값이 증가하면 $y$의 값은 증가한다. ⑤ $y=-x^2$의 그래프를 평행이동하면 완전히 포개어진다.
### 정답
①
### 해설
$y = -(x-3)^2 + 5$


* ① 축의 방정식은 $x = 3$이다. (거짓) * ②$x=0$일 때 $y=-4$이므로 $y$절편은 $-4$이다. (참) * ③ 꼭짓점의 좌표는$(3, 5)$이다. (참) * ④$x<3$일 때, $x$가 증가하면 $y$는 증가한다. (참) * ⑤$x^2$의 계수가 $-1$로 같으므로 평행이동하면 완전히 포개어진다. (참)



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "일반형 이차함수의 축·꼭짓점·증감 판별", "primaryMethod": "$y=-(x-3)^2+5$로 변형해 축, $y$절편, 꼭짓점, 증감 구간을 확인한다.", "decisiveStep": "표준형에서 축의 방정식이 $x=3$임을 확인해 ①이 거짓임을 밝힌다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "일반형", "l4": "완전제곱식 변형"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_PROPERTIES", "templateKey": null, "why": "일반형 이차함수를 표준형으로 고쳐 그래프의 성질을 판별하는 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "완전제곱식 변형 후 5개 보기의 성질을 검증하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_YH_1F_18", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=-x^2+6x-4$의 그래프"}], "goal": [{"term": "축", "src": "solution", "quote": "축의 방정식은 $x = 3$이다."}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "y = -(x-3)^2 + 5"}], "condition": []}, "reasons": {"method": "$y=-(x-3)^2+5$로 변형해 축이 $x=3$임을 확인한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q19
- 형식: 객관식
- 배점: 5
### 발문
다음 그림과 같은 이차함수 $y=ax^2+bx+c$의 그래프에서 꼭짓점을 $\text{A}$라고 하자. $\triangle\text{OAB}$의 넓이가 $8$일 때, $a+b+c$의 값은? (단, $a$, $b$, $c$는 상수이고, $\text{O}$는 원점, $\text{B}(4, 0)$이다.) [5점]
### 선지
① $-6$ ② $-5$ ③ $-4$ ④ $-3$ ⑤ $-2$
### 정답
④
### 해설
그래프가 원점 $\text{O}(0, 0)$과 점 $\text{B}(4, 0)$을 지나므로 $y = ax(x - 4)$ 꼭짓점 $\text{A}$의 $x$좌표는 $2$이고, $x$축 아래에 있으므로 높이를 $h>0$이라 하면 $\triangle\text{OAB} = \frac{1}{2} \times 4 \times h = 8 \implies h = 4$ 따라서 꼭짓점 $\text{A}$의 좌표는 $(2, -4)$이다. $-4 = a(2)(2-4) = -4a \implies a = 1$ $y = x(x-4) = x^2 - 4x$이므로 $a=1, b=-4, c=0$이고, $a+b+c = 1-4+0 = -3$이다.



```json
{"target": "원점 O와 B(4,0)을 지나고 꼭짓점 A가 제4사분면에 있는 포물선", "type": "coordinate_parabola_triangle", "axes": {"x": [-1, 5], "y": [-5, 2], "origin": "O"}, "curve": {"eq": "y=x^2-4x", "domain": [-0.5, 4.5]}, "points": {"O": [0, 0], "A": [2, -4], "B": [4, 0]}, "polygon": ["O", "A", "B"]}

```


```json
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "x절편과 삼각형 넓이로 이차함수 계수 구하기", "primaryMethod": "두 $x$절편 $0, 4$로 $y=ax(x-4)$를 세우고 $\\triangle\\text{OAB}$ 넓이에서 꼭짓점 $(2,-4)$를 구해 $a$를 결정한다.", "decisiveStep": "넓이 $8$에서 높이 $4$를 구해 꼭짓점 $\\text{A}(2,-4)$를 확정하고 $a=1$을 구한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "그래프와 계수", "l4": "조건으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_GRAPH_GEOMETRY", "templateKey": null, "why": "두 $x$절편과 꼭짓점 삼각형의 넓이로 이차함수 식을 결정하는 문항이다."}, "crossConceptKeys": ["CC_GEOMETRIC_AREA_VOLUME_FORMULA", "CC_PARABOLA_AXIS_SYMMETRY"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "$x$절편으로 식을 세우고 삼각형 넓이로 꼭짓점 좌표를 역산해 $a, b, c$를 모두 구하는 3단계 문항이다.", "level": "상", "item4slot": {"questionUid": "PENDING_24_YH_1F_19", "format": "단일 정답", "slots": {"given": [{"term": "꼭짓점", "src": "stem", "quote": "꼭짓점을 $\\text{A}$라고 하자."}], "goal": [{"term": "합", "src": "stem", "quote": "$a+b+c$의 값은?"}], "method": [{"term": "넓이", "src": "stem", "quote": "$\\triangle\\text{OAB}$의 넓이가 $8$일 때"}], "condition": []}, "reasons": {"method": "두 $x$절편으로 식을 세우고 삼각형 넓이로부터 꼭짓점 $(2,-4)$를 구한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q20
- 형식: 객관식
- 배점: 4
### 발문
세 점 $(2, 0)$, $(6, 0)$, $(5, k)$를 지나는 포물선을 그래프로 하는 이차함수의 식을 $y=x^2+bx+c$라고 할 때, $b+c-k$의 값은? (단, $b$, $c$는 상수) [4점]
### 선지
① $1$ ② $4$ ③ $7$ ④ $10$ ⑤ $12$
### 정답
③
### 해설
$x^2$의 계수가 $1$이고 두 $x$절편이 $2, 6$이므로 $\begin{aligned} y &= (x - 2)(x - 6) = x^2 - 8x + 12 \ b &= -8, \quad c = 12 \end{aligned}$ 점 $(5, k)$를 대입하면 $k = (5-2)(5-6) = -3$이다. 따라서 $b + c - k = -8 + 12 - (-3) = 7$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "두 x절편이 주어진 이차함수 식 구하기", "primaryMethod": "두 $x$절편 $(2,0), (6,0)$으로 $y=(x-2)(x-6)$을 세워 전개한 뒤 $x=5$를 대입해 $k$를 구한다.", "decisiveStep": "$y=(x-2)(x-6)$을 전개해 $b=-8, c=12$를 구하고 $k=-3$을 대입한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "그래프와 계수", "l4": "조건으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_THREE_POINTS", "templateKey": null, "why": "두 $x$절편과 한 점이 주어진 이차함수 식을 결정하는 문항이다."}, "crossConceptKeys": ["CC_POINT_ON_CURVE_SUBSTITUTION"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 $x$절편으로 인수분해형을 바로 세워 전개하고 세 번째 점의 $y$좌표를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_YH_1F_20", "format": "단일 정답", "slots": {"given": [{"term": "포물선", "src": "stem", "quote": "세 점 $(2, 0)$, $(6, 0)$, $(5, k)$를 지나는 포물선"}], "goal": [{"term": "식의값", "src": "stem", "quote": "$b+c-k$의 값은?"}], "method": [{"term": "인수분해", "src": "solution", "quote": "y &= (x - 2)(x - 6)"}], "condition": []}, "reasons": {"method": "두 $x$절편으로 $(x-2)(x-6)$을 세우고 전개 및 대입으로 $b, c, k$를 구한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q21
- 형식: 서답형
- 배점: 7
### 발문
아래 그림과 같이 반지름의 길이가 $8\text{ cm}$인 원이 있다. 이 원의 반지름의 길이를 $x\text{ cm}$만큼 늘인 원의 넓이는 처음 원의 넓이의 $2$배가 되었다. 이때 $x$의 값을 구하시오. [7점]
### 선지
없음
### 정답
$8\sqrt{2}-8$
### 해설
처음 원의 넓이는 $\pi \times 8^2 = 64\pi\text{ (cm}^2\text{)}$이다. 반지름을 $x\text{ cm}$ 늘인 원의 넓이는 $\pi(8+x)^2$이므로 $\begin{aligned} \pi(8+x)^2 &= 2 \times 64\pi \ (8+x)^2 &= 128 \ 8+x &= 8\sqrt{2} \quad (x > 0) \ x &= 8\sqrt{2} - 8 \end{aligned}$



```json
{"target": "반지름이 8cm인 원과 반지름을 xcm 늘인 동심원", "type": "concentric_circles", "inner_radius": 8, "outer_radius_label": "8+x", "annotations": ["처음 반지름 8cm", "늘어난 반지름 xcm"]}

```


```json
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION_WORD", "conceptClusterKey": "원의 넓이 배수 조건과 제곱근 이차방정식", "primaryMethod": "넓이 조건 $\\pi(8+x)^2=128\\pi$를 세우고 제곱근을 이용해 양수 $x$를 구한다.", "decisiveStep": "$(8+x)^2=128$에서 $x>0$이므로 $8+x=8\\sqrt{2}$만 택한다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 활용", "l3": "도형", "l4": "길이·넓이"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_WORD_PROBLEM", "templateKey": null, "why": "원의 넓이가 2배가 되는 반지름 증가량을 제곱근 풀이로 구하는 문항이다."}, "crossConceptKeys": ["CC_GEOMETRIC_AREA_VOLUME_FORMULA"], "conditionKeys": ["COND_POSITIVE"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "원의 넓이 식으로 $(8+x)^2=128$을 세우고 양수 조건에 맞는 무리수 해를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_YH_1F_21", "format": "단일 정답", "slots": {"given": [{"term": "원", "src": "stem", "quote": "반지름의 길이가 $8\\text{ cm}$인 원"}], "goal": [{"term": "길이", "src": "stem", "quote": "이때 $x$의 값을 구하시오."}], "method": [{"term": "넓이", "src": "stem", "quote": "원의 넓이는 처음 원의 넓이의 $2$배"}], "condition": [{"term": "양수", "src": "solution", "quote": "(x > 0)"}]}, "reasons": {"method": "$(8+x)^2=128$을 세워 양수 해 $x=8\\sqrt{2}-8$을 구한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q22
- 형식: 서답형
- 배점: 7
### 발문
이차함수 $f(x)=\dfrac{1}{2}x^2-2x+3$에서 $f(p)=p$를 만족시키는 모든 $p$의 값의 합을 구하시오. [7점]
### 선지
없음
### 정답
6
### 해설
$f(p) = p$에서 $\begin{aligned} \frac{1}{2}p^2 - 2p + 3 &= p \ p^2 - 4p + 6 &= 2p \ p^2 - 6p + 6 &= 0 \ (p - 3)^2 &= 3 \ p &= 3 \pm \sqrt{3} \end{aligned}$ 따라서 모든 $p$의 값의 합은 $(3+\sqrt{3}) + (3-\sqrt{3}) = 6$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "f(p)=p를 만족시키는 이차방정식 해의 합", "primaryMethod": "$f(p)=p$를 이차방정식 $p^2-6p+6=0$으로 정리해 두 근 $3\\pm\\sqrt{3}$을 구한 뒤 더한다.", "decisiveStep": "분모 $2$를 없앤 $p^2-6p+6=0$을 풀어 두 근의 합 $6$을 구한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수와 그 그래프", "l3": "이차함수의 뜻", "l4": "함숫값"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_BASIC_FORM", "templateKey": null, "why": "함숫값 조건 $f(p)=p$를 이차방정식으로 바꾸어 모든 해의 합을 구하는 문항이다."}, "crossConceptKeys": ["CC_QUADRATIC_EQUATIONS"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함숫값 조건을 이차방정식으로 전환해 두 무리수 근의 합을 구하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_YH_1F_22", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=\\dfrac{1}{2}x^2-2x+3$"}], "goal": [{"term": "합", "src": "stem", "quote": "모든 $p$의 값의 합을 구하시오."}], "method": [{"term": "이차방정식", "src": "solution", "quote": "p^2 - 6p + 6 &= 0"}], "condition": []}, "reasons": {"method": "$f(p)=p$를 이차방정식 $p^2-6p+6=0$으로 정리해 두 근을 구해 더한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q23
- 형식: 서답형
- 배점: 7
### 발문
이차함수 $y=ax^2+bx+c$의 그래프의 꼭짓점의 좌표가 $(2, n)$이고 $x$축과 만나는 두 점 사이의 거리가 $6$일 때, $\dfrac{b-n}{a}$의 값을 구하시오. (단, $a$, $b$, $c$는 상수이고 $a>0$이다.) [7점]
### 선지
없음
### 정답
5
### 해설
꼭짓점의 $x$좌표가 $2$이므로 축의 방정식은 $x=2$이다. $x$축과 만나는 두 점 사이의 거리가 $6$이므로 두 교점의 $x$좌표는 $2-3=-1$과 $2+3=5$이다. 따라서 $y = a(x+1)(x-5) = ax^2 - 4ax - 5a$이므로 $b = -4a$이다. 또한 $n$은 $x=2$일 때의 함숫값이므로 $n = a(2+1)(2-5) = -9a$ $\frac{b - n}{a} = \frac{-4a - (-9a)}{a} = \frac{5a}{a} = 5$



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "축과 x절편 거리로 문자 계수 소거 및 식의 값", "primaryMethod": "축 $x=2$ 대칭으로 두 $x$절편 $-1, 5$를 구해 $b=-4a, n=-9a$를 $a$로 나타낸 뒤 약분한다.", "decisiveStep": "$b=-4a$와 $n=-9a$를 $a$에 관한 식으로 표현해 $\\frac{b-n}{a}$에서 $a$를 약분한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "그래프와 계수", "l4": "조건으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_X_INTERCEPTS_DISTANCE", "templateKey": null, "why": "축과 $x$절편 거리로부터 $b, n$을 $a$로 표현해 비의 값을 구하는 문항이다."}, "crossConceptKeys": ["CC_PARABOLA_AXIS_SYMMETRY", "CC_ALGEBRAIC_FRACTION_SIMPLIFY"], "conditionKeys": ["COND_POSITIVE"], "integrationPattern": "INTERDEPENDENT", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "$a$의 값이 구체적으로 주어지지 않은 상태에서 $b, n$을 모두 $a$의 배수로 표현해 약분해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"questionUid": "PENDING_24_YH_1F_23", "format": "단일 정답", "slots": {"given": [{"term": "꼭짓점", "src": "stem", "quote": "꼭짓점의 좌표가 $(2, n)$이고"}], "goal": [{"term": "식의값", "src": "stem", "quote": "$\\dfrac{b-n}{a}$의 값을 구하시오."}], "method": [{"term": "축", "src": "solution", "quote": "축의 방정식은 $x=2$이다."}], "condition": [{"term": "양수", "src": "stem", "quote": "$a>0$"}]}, "reasons": {"method": "축 $x=2$ 대칭으로 $x$절편 $-1, 5$를 찾아 $b, n$을 $a$로 나타낸다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```
