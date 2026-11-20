```json:exam
{"stem": "24_신흥중_1학기_기말_중3_유사", "sourceArchiveFile": "original/middle/m3/1final/24_신흥중_1학기_기말_중3_기출c.js", "examFolder": "1final", "grade": "중3", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-16"}
```


## Q01
- 형식: 객관식
- 배점: 3
### 발문
다음 중에서 다항식 $x^2-8x+12$의 인수인 것을 모두 고르면? (정답 2개) [3점]
### 선지
① $x+2$ ② $x-2$ ③ $x+6$ ④ $x-3$ ⑤ $x-6$
### 정답
②, ⑤
### 해설
곱해서 $12$, 더해서 $-8$이 되는 두 수는 $-2$와 $-6$이다. $x^2 - 8x + 12 = (x-2)(x-6)$ 따라서 인수인 것은 ②, ⑤이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-02", "subUnitKey": "M3-02-FACTORIZATION", "conceptClusterKey": "이차식 인수분해와 인수 고르기", "primaryMethod": "곱이 $12$이고 합이 $-8$인 두 정수를 찾아 $x^2-8x+12$를 $(x-2)(x-6)$으로 인수분해한다.", "decisiveStep": "$(x-2)(x-6)$의 두 일차인수 $x-2$와 $x-6$을 선지에서 고른다.", "rpm": {"majorUnit": "다항식의 곱셈과 인수분해", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "이차식"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_POLY_FACTORIZATION", "templateKey": null, "why": "이차식을 인수분해하여 두 일차인수를 모두 고르는 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "최고차항 계수가 1인 이차식의 기본 인수분해만으로 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_SH_1F_01", "format": "복수 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^2-8x+12$"}], "goal": [{"term": "인수", "src": "stem", "quote": "인수인 것을 모두 고르면?"}], "method": [{"term": "인수분해", "src": "solution", "quote": "x^2 - 8x + 12 = (x-2)(x-6)"}], "condition": []}, "reasons": {"method": "곱이 12, 합이 -8인 두 수로 이차식을 인수분해한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q02
- 형식: 객관식
- 배점: 4
### 발문
$a, b$가 정수일 때, 등식 $x^2+px+18=(x+a)(x+b)$를 만족시키는 수 $p$의 최솟값은? [4점]
### 선지
① $-21$ ② $-20$ ③ $-19$ ④ $-11$ ⑤ $-9$
### 정답
③
### 해설
$\begin{aligned} (x+a)(x+b) &= x^2+(a+b)x+ab \ ab &= 18, \quad p = a+b \end{aligned}$ $a, b$가 정수이고 $p=a+b$가 최소가 되려면 두 음의 정수 $a, b$의 절댓값의 합이 최대여야 한다. $(a, b) = (-1, -18)$일 때 $p = -1 + (-18) = -19$로 최소이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-02", "subUnitKey": "M3-02-FACTORIZATION", "conceptClusterKey": "정수 인수 조건과 일차항 계수의 최솟값", "primaryMethod": "우변을 전개해 $ab=18$, $p=a+b$를 얻은 뒤 음의 정수 약수 쌍 중 합이 가장 작은 쌍을 찾는다.", "decisiveStep": "음의 정수 쌍 $(-1, -18)$에서 $p=-19$가 최솟값임을 확인한다.", "rpm": {"majorUnit": "다항식의 곱셈과 인수분해", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "이차식"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_POLY_FACTORIZATION", "templateKey": null, "why": "상수항 $18$의 정수 약수 쌍 중 합 $p$가 최소인 경우를 찾는 문항이다."}, "crossConceptKeys": ["CC_INTEGER_FACTOR_PAIRS"], "conditionKeys": ["COND_INTEGER"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "정수 조건에서 음수 쌍까지 고려해 $a+b$의 최솟값을 찾아야 하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_SH_1F_02", "format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "$x^2+px+18=(x+a)(x+b)$"}], "goal": [{"term": "최솟값", "src": "stem", "quote": "수 $p$의 최솟값은?"}], "method": [{"term": "전개", "src": "solution", "quote": "(x+a)(x+b) &= x^2+(a+b)x+ab"}], "condition": [{"term": "정수", "src": "stem", "quote": "$a, b$가 정수일 때"}]}, "reasons": {"method": "전개 계수 비교로 $ab=18$을 얻고 음의 정수 쌍에서 $a+b$의 최솟값을 구한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q03
- 형식: 객관식
- 배점: 4
### 발문
$8x^2+bx-3$을 인수분해하면 $(2x+1)(4x+a)$가 될 때, 상수 $a, b$에 대하여 $a-b$의 값은? [4점]
### 선지
① $-1$ ② $1$ ③ $-5$ ④ $5$ ⑤ $2$
### 정답
①
### 해설
$\begin{aligned} (2x+1)(4x+a) &= 8x^2 + (2a+4)x + a \ a &= -3 \ b &= 2a + 4 = 2(-3) + 4 = -2 \ a - b &= -3 - (-2) = -1 \end{aligned}$



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-02", "subUnitKey": "M3-02-POLYNOMIAL_MULTIPLICATION", "conceptClusterKey": "인수분해 결과 전개 후 계수 비교", "primaryMethod": "$(2x+1)(4x+a)$를 전개해 상수항 비교로 $a=-3$을 구하고 일차항 계수로 $b$를 구한다.", "decisiveStep": "상수항 $a=-3$을 먼저 결정해 $b=2(-3)+4=-2$를 얻는다.", "rpm": {"majorUnit": "다항식의 곱셈과 인수분해", "midUnit": "다항식의 곱셈", "l3": "곱셈공식", "l4": "두 일차식의 곱"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_POLY_MULTIPLICATION", "templateKey": null, "why": "두 일차식의 곱을 전개해 원래 이차식과 계수를 비교하는 문항이다."}, "crossConceptKeys": ["CC_POLYNOMIAL_COEFFICIENT_MATCHING"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "전개 후 상수항과 일차항 계수를 순서대로 비교하면 되는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_SH_1F_03", "format": "단일 정답", "slots": {"given": [{"term": "인수분해", "src": "stem", "quote": "$8x^2+bx-3$을 인수분해하면 $(2x+1)(4x+a)$"}], "goal": [{"term": "차", "src": "stem", "quote": "$a-b$의 값은?"}], "method": [{"term": "전개", "src": "solution", "quote": "8x^2 + (2a+4)x + a"}], "condition": []}, "reasons": {"method": "$(2x+1)(4x+a)$를 전개하여 상수항과 일차항 계수를 비교한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q04
- 형식: 객관식
- 배점: 4
### 발문
다음 중에서 이차방정식을 고르면? [4점]
### 선지
① $x^2-4x+3$ ② $x^2+2=3x^3-1$ ③ $3x(x-1)=3x^2+2x$ ④ $x(x-4)=(3x+1)(x-2)$ ⑤ $(x+3)(x-3)=x^2-4x$
### 정답
④
### 해설
① 등호가 없으므로 다항식이다. ② $3x^3-x^2-3=0$이므로 삼차방정식이다. ③ $3x^2-3x=3x^2+2x \implies 5x=0$이므로 일차방정식이다. ④ $x^2-4x=3x^2-5x-2 \implies 2x^2-x-2=0$이므로 이차방정식이다. ⑤ $x^2-9=x^2-4x \implies 4x-9=0$이므로 일차방정식이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "전개 및 정리 후 이차방정식 판별", "primaryMethod": "각 식을 전개해 한쪽으로 이항한 뒤 최고차항이 $2$차인 방정식을 찾는다.", "decisiveStep": "④만 이항 후 $2x^2-x-2=0$으로 이차항이 소거되지 않음을 확인한다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "이차방정식과 해", "l4": "이차방정식 판별"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_ROOT_IDENTIFICATION", "templateKey": null, "why": "다항식, 삼차·일차방정식과 섞인 선지에서 이차방정식을 고르는 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "선지를 전개·이항해 이차항 잔존 여부만 판별하는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_SH_1F_04", "format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식을 고르면?"}], "goal": [{"term": "이차방정식", "src": "solution", "quote": "2x^2-x-2=0$이므로 이차방정식이다."}], "method": [{"term": "이항", "src": "solution", "quote": "x^2-4x=3x^2-5x-2"}], "condition": []}, "reasons": {"method": "각 선지를 전개하여 한쪽으로 이항했을 때 이차식이 남는지 확인한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q05
- 형식: 객관식
- 배점: 4
### 발문
다음 중 $x=3$을 해로 갖는 이차방정식을 고르면? [4점]
### 선지
① $x^2+3x=0$ ② $2x^2-5x-3=0$ ③ $x^2-6x-9=0$ ④ $(x-1)(x+3)=0$ ⑤ $x^2+5=2x^2-3x-10$
### 정답
②
### 해설
각 방정식에 $x=3$을 대입한다. ① $9+9=18 \ne 0$ ② $2(9)-5(3)-3=18-15-3=0$ (참) ③ $9-18-9=-18 \ne 0$ ④ $(3-1)(3+3)=12 \ne 0$ ⑤ 좌변 $= 9+5=14$, 우변 $= 18-9-10=-1$ (거짓)



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "주어진 수가 해인 이차방정식 찾기", "primaryMethod": "다섯 방정식에 $x=3$을 각각 대입해 등식이 참이 되는 것을 찾는다.", "decisiveStep": "②에 $x=3$을 대입하면 $18-15-3=0$으로 등식이 성립함을 확인한다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "이차방정식과 해", "l4": "해의 확인"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_ROOT_SUBSTITUTION", "templateKey": null, "why": "$x=3$을 대입하여 등식이 성립하는 이차방정식을 고르는 기초 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "각 선지에 $x=3$을 대입해 산술 계산만으로 판별하는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_SH_1F_05", "format": "단일 정답", "slots": {"given": [{"term": "해", "src": "stem", "quote": "$x=3$을 해로 갖는 이차방정식"}], "goal": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식을 고르면?"}], "method": [{"term": "대입", "src": "solution", "quote": "각 방정식에 $x=3$을 대입한다."}], "condition": []}, "reasons": {"method": "주어진 해 $x=3$을 각 보기에 대입해 참인 등식을 찾는다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q06
- 형식: 객관식
- 배점: 4
### 발문
다음은 이차방정식 $x^2-8x-3=0$을 완전제곱식을 이용하여 푸는 과정이다. ①~⑤에 들어갈 수로 알맞지 않은 것은? [4점] $$x^2-8x=3$$ $$x^2-8x+①=3+①$$ $$(x-②)^2=③$$ $$x-②=④$$ $$x=⑤$$
### 선지
① $16$ ② $4$ ③ $19$ ④ $\pm\sqrt{19}$ ⑤ $-4\pm\sqrt{19}$
### 정답
⑤
### 해설
$\begin{aligned} x^2 - 8x &= 3 \ x^2 - 8x + 16 &= 3 + 16 \quad (①=16) \ (x - 4)^2 &= 19 \quad (②=4,\ ③=19) \ x - 4 &= \pm\sqrt{19} \quad (④=\pm\sqrt{19}) \ x &= 4 \pm \sqrt{19} \quad (⑤=4\pm\sqrt{19}) \end{aligned}$ 따라서 ⑤에 들어갈 수는 $4\pm\sqrt{19}$이므로 알맞지 않은 것은 ⑤이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "완전제곱식을 이용한 이차방정식 풀이 과정", "primaryMethod": "일차항 계수 $-8$의 절반의 제곱 $16$을 양변에 더하고 $(x-4)^2=19$를 풀어 빈칸 ①~⑤를 채운다.", "decisiveStep": "$x-4=\\pm\\sqrt{19}$에서 $-4$를 이항하면 부호가 바뀌어 $4\\pm\\sqrt{19}$가 됨을 확인한다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "제곱근·완전제곱식을 이용한 풀이", "l4": "완전제곱식"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_SQUARE_ROOT_METHOD", "templateKey": null, "why": "완전제곱식 변형으로 이차방정식을 푸는 과정의 빈칸을 점검하는 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "완전제곱식 풀이의 각 단계를 따라가며 빈칸 값을 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_SH_1F_06", "format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-8x-3=0$"}], "goal": [{"term": "해", "src": "solution", "quote": "x &= 4 \\pm \\sqrt{19}"}], "method": [{"term": "완전제곱식", "src": "stem", "quote": "완전제곱식을 이용하여 푸는 과정"}], "condition": []}, "reasons": {"method": "일차항 계수 절반의 제곱 $16$을 양변에 더해 $(x-4)^2=19$를 푼다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q07
- 형식: 객관식
- 배점: 4
### 발문
이차방정식 $x^2+ax+8=0$의 한 근이 $-4$이고, 이차방정식 $3x^2+x-b=0$의 한 근이 $-1$일 때, 상수 $a, b$에 대하여 $ab$의 값을 구하면? [4점]
### 선지
① $12$ ② $14$ ③ $16$ ④ $18$ ⑤ $20$
### 정답
①
### 해설
$x^2+ax+8=0$에 $x=-4$를 대입하면 $\begin{aligned} (-4)^2 + a(-4) + 8 &= 0 \ 24 - 4a &= 0 \implies a = 6 \end{aligned}$ $3x^2+x-b=0$에 $x=-1$을 대입하면 $\begin{aligned} 3(-1)^2 + (-1) - b &= 0 \ 2 - b &= 0 \implies b = 2 \end{aligned}$ 따라서 $ab = 6 \times 2 = 12$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "주어진 근을 대입해 두 미정계수 결정", "primaryMethod": "각 이차방정식에 주어진 근 $x=-4$와 $x=-1$을 대입해 $a, b$를 각각 구한 뒤 곱한다.", "decisiveStep": "$24-4a=0$에서 $a=6$, $2-b=0$에서 $b=2$를 구해 $ab=12$를 계산한다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "이차방정식과 해", "l4": "해가 주어진 이차방정식의 계수 결정"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_ROOT_SUBSTITUTION", "templateKey": null, "why": "두 이차방정식에 각각 주어진 근을 대입해 계수를 구하는 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 근을 각각 방정식에 대입해 일차방정식을 푸는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_SH_1F_07", "format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+ax+8=0$의 한 근이 $-4$"}], "goal": [{"term": "곱", "src": "stem", "quote": "$ab$의 값을 구하면?"}], "method": [{"term": "대입", "src": "solution", "quote": "$x=-4$를 대입하면"}], "condition": []}, "reasons": {"method": "두 방정식에 각각의 근을 대입해 $a=6, b=2$를 구한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q08
- 형식: 객관식
- 배점: 4
### 발문
이차방정식 $2(x+3)^2-18=0$을 풀면? [4점]
### 선지
① $x=-3$ 또는 $x=3$ ② $x=-6$ 또는 $x=6$ ③ $x=-3$ 또는 $x=0$ ④ $x=-6$ 또는 $x=0$ ⑤ $x=0$ 또는 $x=3$
### 정답
④
### 해설
$\begin{aligned} 2(x+3)^2 &= 18 \ (x+3)^2 &= 9 \ x + 3 &= \pm 3 \ x &= -3 \pm 3 \end{aligned}$ 따라서 $x = -6$ 또는 $x = 0$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "제곱근을 이용한 완전제곱꼴 이차방정식 풀이", "primaryMethod": "상수항을 이항하고 $2$로 나눈 뒤 제곱근의 성질 $x+3=\\pm 3$을 적용해 해를 구한다.", "decisiveStep": "$(x+3)^2=9$에서 $x+3=\\pm 3$을 얻어 $x=-6$ 또는 $x=0$을 구한다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "제곱근·완전제곱식을 이용한 풀이", "l4": "제곱근 이용"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_SQUARE_ROOT_METHOD", "templateKey": null, "why": "$a(x-p)^2=q$ 꼴을 정리해 제곱근으로 해를 구하는 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제곱근의 정의를 바로 적용해 두 근을 구하는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_SH_1F_08", "format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $2(x+3)^2-18=0$"}], "goal": [{"term": "해", "src": "solution", "quote": "$x = -6$ 또는 $x = 0$"}], "method": [{"term": "제곱근", "src": "solution", "quote": "(x+3)^2 &= 9"}], "condition": []}, "reasons": {"method": "$(x+3)^2=9$로 정리한 뒤 제곱근을 취해 해를 구한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q09
- 형식: 객관식
- 배점: 5
### 발문
두 자리 자연수 $a, b$에 대하여 이차방정식 $x^2+ax+9b=0$이 중근을 가진다. $a$의 값이 최소가 되도록 $b$의 값을 정할 때, $a-b$의 값은? [5점]
### 선지
① $6$ ② $8$ ③ $10$ ④ $12$ ⑤ $14$
### 정답
②
### 해설
중근을 가지므로 일차항 계수의 절반의 제곱이 상수항과 같다. $\begin{aligned} \left(\frac{a}{2}\right)^2 &= 9b \ a^2 &= 36b \implies a = 6\sqrt{b} \quad (a > 0) \end{aligned}$ $a$가 자연수이므로 $b$는 제곱수이어야 하고, $b$가 두 자리 자연수이므로 가능한 $b$의 최솟값은 $b=16$이다. 이때 $a = 6\sqrt{16} = 24$로 두 자리 자연수이고 최소이다. 따라서 $a - b = 24 - 16 = 8$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "두 자리 자연수 조건과 중근의 완전제곱수 조건", "primaryMethod": "중근 조건 $\\left(\\frac{a}{2}\\right)^2=9b$에서 $a=6\\sqrt{b}$를 얻고 두 자리 자연수 $b$ 중 최소 제곱수 $16$을 찾는다.", "decisiveStep": "$b$가 두 자리 제곱수여야 하므로 최소가 $b=16$, 이때 $a=24$임을 결정한다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "근의 공식", "l4": "근의 개수·판별"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_DOUBLE_ROOT", "templateKey": null, "why": "중근 조건과 두 자리 자연수 제곱수 조건을 결합해 최소의 $(a,b)$를 구하는 문항이다."}, "crossConceptKeys": ["CC_PERFECT_SQUARE_ENUMERATION"], "conditionKeys": ["COND_NATURAL_NUMBER"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중근 조건으로 $a^2=36b$를 유도한 뒤 두 자리 자연수 범위에서 최소 제곱수 $b=16$을 찾아야 하는 3단계 문항이다.", "level": "상", "item4slot": {"questionUid": "PENDING_24_SH_1F_09", "format": "단일 정답", "slots": {"given": [{"term": "중근", "src": "stem", "quote": "이차방정식 $x^2+ax+9b=0$이 중근을 가진다."}], "goal": [{"term": "차", "src": "stem", "quote": "$a-b$의 값은?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "a^2 &= 36b"}], "condition": [{"term": "자연수", "src": "stem", "quote": "두 자리 자연수 $a, b$에 대하여"}]}, "reasons": {"method": "중근 조건 $a=6\\sqrt{b}$에서 두 자리 자연수인 최소 제곱수 $b=16$을 찾는다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q10
- 형식: 객관식
- 배점: 4
### 발문
이차방정식 $2x^2-8x+3=0$의 해가 $x=\dfrac{A\pm\sqrt{B}}{2}$일 때, $A+B$의 값은? (단, $A, B$는 유리수) [4점]
### 선지
① $12$ ② $13$ ③ $14$ ④ $15$ ⑤ $16$
### 정답
③
### 해설
짝수 근의 공식을 적용하면 ($a=2, b'=-4, c=3$) $\begin{aligned} x &= \frac{-(-4) \pm \sqrt{(-4)^2 - 2 \times 3}}{2} \ &= \frac{4 \pm \sqrt{16 - 6}}{2} = \frac{4 \pm \sqrt{10}}{2} \end{aligned}$ 따라서 $A = 4$, $B = 10$이므로 $A + B = 14$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "근의 공식을 이용한 해의 계수 결정", "primaryMethod": "짝수 근의 공식에 계수를 대입해 $x=\\frac{4\\pm\\sqrt{10}}{2}$를 구하고 $A, B$를 비교한다.", "decisiveStep": "분모가 $2$인 형태에 맞추어 $A=4, B=10$을 얻는다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "근의 공식", "l4": "근의 공식"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_SQUARE_ROOT_METHOD", "templateKey": null, "why": "짝수 근의 공식으로 해를 구해 $A, B$를 결정하는 문항이다."}, "crossConceptKeys": [], "conditionKeys": ["COND_RATIONAL"], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "짝수 근의 공식에 계수를 바로 대입해 $A, B$를 읽는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_SH_1F_10", "format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $2x^2-8x+3=0$"}], "goal": [{"term": "합", "src": "stem", "quote": "$A+B$의 값은?"}], "method": [{"term": "해", "src": "stem", "quote": "해가 $x=\\dfrac{A\\pm\\sqrt{B}}{2}$일 때"}], "condition": []}, "reasons": {"method": "짝수 근의 공식으로 해를 구해 $A=4, B=10$을 얻는다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q11
- 형식: 객관식
- 배점: 4
### 발문
다음에서 $y$가 $x$의 이차함수인 것을 모두 고르면? (정답 2개) [4점]
### 선지
① 한 변의 길이가 $(x+2)\text{ cm}$인 정사각형의 넓이 $y\text{ cm}^2$ ② 시속 $5\text{ km}$로 $x$시간 동안 달린 거리 $y\text{ km}$ ③ 한 모서리의 길이가 $x\text{ cm}$인 정육면체의 부피 $y\text{ cm}^3$ ④ 반지름의 길이가 $x\text{ cm}$이고 중심각의 크기가 $60^\circ$인 부채꼴의 넓이 $y\text{ cm}^2$ ⑤ $x$각형의 내각의 크기의 합 $y^\circ$
### 정답
①, ④
### 해설
* ① $y = (x+2)^2 = x^2+4x+4$(이차함수) * ②$y = 5x$(일차함수) * ③$y = x^3$(삼차함수) * ④$y = \pi x^2 \times \frac{60}{360} = \frac{1}{6}\pi x^2$(이차함수) * ⑤$y = 180(x-2) = 180x-360$ (일차함수) 따라서 이차함수인 것은 ①, ④이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "11", "variationType": "CONDITION", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_APPLICATION", "conceptClusterKey": "도형·속력 문장제에서 이차함수 판별", "primaryMethod": "각 보기의 수량 관계를 $y$에 대한 식으로 세워 $x$의 이차식인지 판별한다.", "decisiveStep": "정사각형 넓이(①)와 부채꼴 넓이(④)만 $x$에 대한 이차함수임을 확인한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수와 그 그래프", "l3": "이차함수의 뜻", "l4": "이차함수 판별"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_DEFINITION", "templateKey": null, "why": "다섯 문장제 상황을 식으로 세워 이차함수 2개를 고르는 문항이다."}, "crossConceptKeys": ["CC_FUNCTION_DEGREE_CLASSIFICATION", "CC_GEOMETRIC_AREA_VOLUME_FORMULA"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "도형 넓이·부피·내각 공식 등을 식으로 세워 차수를 비교해야 하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_SH_1F_11", "format": "복수 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "$y$가 $x$의 이차함수인 것을"}], "goal": [{"term": "이차함수", "src": "solution", "quote": "이차함수인 것은 ①, ④이다."}], "method": [{"term": "넓이", "src": "solution", "quote": "x^2+4x+4"}], "condition": []}, "reasons": {"method": "각 보기의 관계식을 세워 $x$에 대한 이차식인지 확인한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q12
- 형식: 객관식
- 배점: 3
### 발문
이차함수 $f(x)=x^2-3x+4$에 대하여 $f(2)+f(-1)$의 값은? [3점]
### 선지
① $6$ ② $7$ ③ $8$ ④ $9$ ⑤ $10$
### 정답
⑤
### 해설
$\begin{aligned} f(2) &= 2^2 - 3(2) + 4 = 4 - 6 + 4 = 2 \ f(-1) &= (-1)^2 - 3(-1) + 4 = 1 + 3 + 4 = 8 \ f(2) + f(-1) &= 2 + 8 = 10 \end{aligned}$



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "이차함수의 두 함숫값의 합", "primaryMethod": "$f(x)$에 $x=2$와 $x=-1$을 각각 대입해 함숫값을 구한 뒤 더한다.", "decisiveStep": "$f(2)=2$, $f(-1)=8$을 구해 $2+8=10$을 계산한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수와 그 그래프", "l3": "이차함수의 뜻", "l4": "함숫값"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_BASIC_FORM", "templateKey": null, "why": "이차함수의 두 함숫값을 대입으로 계산해 더하는 기초 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "단순 대입과 덧셈만으로 답이 나오는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_SH_1F_12", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=x^2-3x+4$"}], "goal": [{"term": "함숫값", "src": "stem", "quote": "$f(2)+f(-1)$의 값은?"}], "method": [{"term": "대입", "src": "solution", "quote": "2^2 - 3(2) + 4"}], "condition": []}, "reasons": {"method": "$x=2$와 $x=-1$을 대입해 구한 두 함숫값을 더한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q13
- 형식: 객관식
- 배점: 4
### 발문
다음 중 이차함수 $y=3x^2$의 그래프에 대한 설명으로 옳지 않은 것은? [4점]
### 선지
① 꼭짓점의 좌표는 $(3, 0)$이다. ② 점 $(1, 3)$을 지난다. ③ 아래로 볼록한 그래프이다. ④ 축의 방정식은 $x=0$이다. ⑤ 이차함수 $y=-5x^2$의 그래프보다 폭이 넓다.
### 정답
①
### 해설
$y=3x^2$의 꼭짓점의 좌표는 $(0, 0)$이다. (① 거짓) ② $x=1$일 때 $y=3$이므로 $(1, 3)$을 지난다. ③ $3>0$이므로 아래로 볼록하다. ④ 축의 방정식은 $x=0$이다. ⑤ $|3|<|-5|$이므로 $y=-5x^2$보다 폭이 넓다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "기본형 y=ax² 그래프의 성질 판별", "primaryMethod": "$y=3x^2$의 꼭짓점 $(0,0)$, 볼록 방향, 축, 폭의 성질을 선지별로 확인한다.", "decisiveStep": "기본형 $y=ax^2$의 꼭짓점은 계수와 무관하게 $(0,0)$이므로 ①이 틀렸음을 판별한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수와 그 그래프", "l3": "y=ax²의 그래프", "l4": "그래프의 모양"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_BASIC_FORM", "templateKey": null, "why": "$y=ax^2$ 기본 그래프의 성질 중 옳지 않은 것을 찾는 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기본형 $y=ax^2$의 성질을 그대로 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_SH_1F_13", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=3x^2$의 그래프"}], "goal": [{"term": "꼭짓점", "src": "solution", "quote": "꼭짓점의 좌표는 $(0, 0)$이다."}], "method": [{"term": "절댓값", "src": "solution", "quote": "|3|<|-5|"}], "condition": []}, "reasons": {"method": "$y=3x^2$의 꼭짓점이 $(0,0)$임을 이용해 거짓인 선지를 고른다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q14
- 형식: 객관식
- 배점: 4
### 발문
이차함수 $y=ax^2$의 그래프를 $y$축의 방향으로 $-4$만큼 평행이동하면 점 $(2, 8)$을 지날 때, 상수 $a$의 값은? [4점]
### 선지
① $1$ ② $2$ ③ $3$ ④ $4$ ⑤ $5$
### 정답
③
### 해설
평행이동한 그래프의 식은 $y = ax^2 - 4$이다. 점 $(2, 8)$을 지나므로 $\begin{aligned} 8 &= a(2)^2 - 4 \ 4a &= 12 \implies a = 3 \end{aligned}$



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "y축 평행이동과 지나는 점 대입", "primaryMethod": "평행이동한 식 $y=ax^2-4$를 세운 뒤 점 $(2,8)$을 대입해 $a$를 구한다.", "decisiveStep": "$8=4a-4$에서 $a=3$을 구한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "꼭짓점형", "l4": "평행이동"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_TRANSLATION", "templateKey": null, "why": "$y$축 평행이동 식에 한 점의 좌표를 대입해 계수를 구하는 문항이다."}, "crossConceptKeys": ["CC_POINT_ON_CURVE_SUBSTITUTION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "평행이동 식 $y=ax^2-4$를 세우고 좌표를 대입하면 바로 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_SH_1F_14", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=ax^2$의 그래프"}], "goal": [{"term": "계수", "src": "stem", "quote": "상수 $a$의 값은?"}], "method": [{"term": "평행이동", "src": "stem", "quote": "$y$축의 방향으로 $-4$만큼 평행이동하면"}], "condition": []}, "reasons": {"method": "$y=ax^2-4$에 $(2,8)$을 대입하여 $a$를 구한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q15
- 형식: 객관식
- 배점: 4
### 발문
이차함수 $y=3x^2$의 그래프를 $x$축의 방향으로 $m$만큼, $y$축의 방향으로 $n$만큼 평행이동하였더니 $y=3(x-4)^2-5$의 그래프와 일치하였다. 두 수 $m, n$에 대하여 $m+n$의 값은? [4점]
### 선지
① $-2$ ② $-1$ ③ $0$ ④ $1$ ⑤ $9$
### 정답
②
### 해설
$y=3x^2$을 $x$축의 방향으로 $m$만큼, $y$축의 방향으로 $n$만큼 평행이동한 식은 $y = 3(x-m)^2 + n$ 이 식이 $y = 3(x-4)^2 - 5$와 같으므로 $m = 4$, $n = -5$이다. 따라서 $m + n = 4 + (-5) = -1$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "이차함수 평행이동량 m, n 결정", "primaryMethod": "평행이동 식 $y=3(x-m)^2+n$과 주어진 식을 비교해 $m, n$을 구한다.", "decisiveStep": "$m=4$, $n=-5$의 부호를 정확히 읽어 합 $-1$을 구한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "꼭짓점형", "l4": "평행이동"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_TRANSLATION", "templateKey": null, "why": "평행이동된 꼭짓점형 식에서 $x$축·$y$축 평행이동량을 읽는 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동 공식 $y=a(x-m)^2+n$과 계수를 직접 비교하는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_SH_1F_15", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=3x^2$의 그래프"}], "goal": [{"term": "합", "src": "stem", "quote": "$m+n$의 값은?"}], "method": [{"term": "평행이동", "src": "stem", "quote": "$x$축의 방향으로 $m$만큼, $y$축의 방향으로 $n$만큼 평행이동"}], "condition": []}, "reasons": {"method": "$y=3(x-m)^2+n$과 $y=3(x-4)^2-5$를 비교해 $m, n$을 구한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q16
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y=ax+b$의 그래프가 오른쪽 그림과 같을 때, 이차함수 $y=(x-a)^2+b$의 그래프에 대한 설명으로 옳은 것은? [4점]
### 선지
① 아래로 볼록하고 꼭짓점이 제$1$사분면에 있는 포물선이다. ② 위로 볼록하고 꼭짓점이 제$2$사분면에 있는 포물선이다. ③ 아래로 볼록하고 꼭짓점이 제$3$사분면에 있는 포물선이다. ④ 아래로 볼록하고 꼭짓점이 제$2$사분면에 있는 포물선이다. ⑤ 위로 볼록하고 꼭짓점이 제$4$사분면에 있는 포물선이다.
### 정답
④
### 해설
일차함수 $y=ax+b$의 그래프가 오른쪽 아래로 향하므로 $a < 0$이고, $y$축과 양의 부분에서 만나므로 $b > 0$이다. 이차함수 $y=(x-a)^2+b$는 $x^2$의 계수가 $1 > 0$이므로 아래로 볼록하다. 꼭짓점 $(a, b)$에서 $a < 0, b > 0$이므로 꼭짓점은 제$2$사분면에 있다. 따라서 옳은 것은 ④이다.



```json
{"target": "일차함수 y=ax+b 그래프", "type": "coordinate_line", "axes": {"x": [-4, 4], "y": [-4, 4], "origin": "O"}, "line": {"slope": -1, "y_intercept": 2, "label": "y=ax+b"}, "annotations": ["기울기가 음수 (a<0)", "y절편이 양수 (b>0)"]}

```


```json
{"sourceQid": "16", "variationType": "CONDITION", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "일차함수 그래프 부호로 이차함수 개형 판정", "primaryMethod": "직선 $y=ax+b$에서 $a<0, b>0$을 읽고, 이차함수 $y=(x-a)^2+b$의 볼록 방향과 꼭짓점 $(a,b)$의 사분면을 구한다.", "decisiveStep": "꼭짓점 $(a, b)$가 $a<0, b>0$으로 제2사분면에 있음을 판정한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "그래프와 계수", "l4": "그래프 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_COEFFICIENT_SIGNS", "templateKey": null, "why": "일차함수 그래프에서 구한 $a, b$의 부호를 이차함수의 꼭짓점 위치에 연결하는 문항이다."}, "crossConceptKeys": ["CC_COEFFICIENT_SIGN_FROM_GRAPH"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차함수 그래프의 부호 판독과 이차함수 꼭짓점 사분면 판정을 순차 결합한 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_SH_1F_16", "format": "단일 정답", "slots": {"given": [{"term": "일차함수", "src": "stem", "quote": "일차함수 $y=ax+b$의 그래프"}], "goal": [{"term": "꼭짓점", "src": "solution", "quote": "꼭짓점은 제$2$사분면에 있다."}], "method": [{"term": "부호", "src": "solution", "quote": "$a < 0$이고, $y$축과 양의 부분에서 만나므로 $b > 0$이다."}], "condition": []}, "reasons": {"method": "일차함수의 기울기와 $y$절편 부호로 이차함수 꼭짓점의 사분면을 정한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q17
- 형식: 객관식
- 배점: 4
### 발문
이차함수 $y=a(x-3)^2+6$의 그래프가 제$2$사분면을 지나지 않도록 하는 음수 $a$의 최댓값은? [4점]
### 선지
① $-\dfrac{1}{3}$ ② $-\dfrac{1}{2}$ ③ $-1$ ④ $-\dfrac{4}{3}$ ⑤ $-\dfrac{2}{3}$
### 정답
⑤
### 해설
꼭짓점 $(3, 6)$은 제$1$사분면에 있고 $a<0$이므로 위로 볼록하다. 그래프가 제$2$사분면을 지나지 않으려면 $y$절편이 $0$ 이하이어야 한다. $\begin{aligned} a(0-3)^2 + 6 &\le 0 \ 9a + 6 &\le 0 \ a &\le -\frac{2}{3} \end{aligned}$ 따라서 음수 $a$의 최댓값은 $-\frac{2}{3}$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "특정 사분면을 지나지 않을 계수 범위", "primaryMethod": "꼭짓점이 제1사분면에 있고 위로 볼록할 때 제2사분면을 지나지 않을 조건인 $y$절편 $\\le 0$을 푼다.", "decisiveStep": "$x=0$을 대입한 $9a+6 \\le 0$에서 경계값 포함을 확인해 최댓값 $-\\frac{2}{3}$를 구한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "그래프와 계수", "l4": "그래프 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_QUADRANT_CONDITION", "templateKey": null, "why": "사분면 통과 조건을 $y$절편의 부호 부등식으로 바꾸어 $a$의 최댓값을 구하는 문항이다."}, "crossConceptKeys": [], "conditionKeys": ["COND_NEGATIVE", "COND_UPPER_BOUND"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "사분면 조건을 $y$절편 부등식 $9a+6\\le 0$으로 전환하고 등호 포함 여부를 따져야 하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_SH_1F_17", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=a(x-3)^2+6$의 그래프"}], "goal": [{"term": "최댓값", "src": "stem", "quote": "음수 $a$의 최댓값은?"}], "method": [{"term": "부등식", "src": "solution", "quote": "9a + 6 &\\le 0"}], "condition": [{"term": "사분면", "src": "stem", "quote": "제$2$사분면을 지나지 않도록 하는"}]}, "reasons": {"method": "꼭짓점이 제1사분면이고 위로 볼록할 때 $y$절편 $\\le 0$ 조건을 세운다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q18
- 형식: 객관식
- 배점: 4
### 발문
다음 중에서 이차함수 $y=\dfrac{1}{3}x^2-2x$의 그래프에 대한 설명으로 옳지 않은 것은? [4점]
### 선지
① $x$축과의 교점의 좌표는 $(-6, 0)$, $(0, 0)$이다. ② $y$절편은 $0$이다. ③ 꼭짓점의 좌표는 $(3, -3)$이다. ④ 제$3$사분면을 지나지 않는다. ⑤ $x>3$일 때, $x$의 값이 증가하면 $y$의 값도 증가한다.
### 정답
①
### 해설
$y = \frac{1}{3}x^2 - 2x = \frac{1}{3}(x-3)^2 - 3$


* ① $y=0$을 대입하면 $\frac{1}{3}x(x-6)=0$이므로 $x$축과의 교점은 $(0, 0)$, $(6, 0)$이다. (거짓) * ②$x=0$일 때 $y=0$이므로 $y$절편은 $0$이다. (참) * ③ 꼭짓점은$(3, -3)$이다. (참) * ④$x<0$일 때 $y = \frac{1}{3}x^2 - 2x > 0$이므로 제$3$사분면을 지나지 않는다. (참) * ⑤ 축$x=3$의 오른쪽에서 $x$가 증가하면 $y$도 증가한다. (참)



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "일반형 이차함수의 절편·꼭짓점·사분면 판별", "primaryMethod": "식을 표준형 $\\frac{1}{3}(x-3)^2-3$으로 변형하고 $y=0$을 대입해 $x$절편을 구해 선지를 검증한다.", "decisiveStep": "$\\frac{1}{3}x(x-6)=0$에서 $x$축 교점이 $(0,0), (6,0)$임을 구해 ①이 거짓임을 확인한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "일반형", "l4": "완전제곱식 변형"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_PROPERTIES", "templateKey": null, "why": "일반형 이차함수의 절편, 꼭짓점, 사분면, 증감을 종합 검증하는 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "표준형 변형과 $x$절편 계산을 모두 확인해 거짓 선지를 찾아야 하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_SH_1F_18", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=\\dfrac{1}{3}x^2-2x$의 그래프"}], "goal": [{"term": "교점", "src": "solution", "quote": "$x$축과의 교점은 $(0, 0)$, $(6, 0)$이다."}], "method": [{"term": "인수분해", "src": "solution", "quote": "\\frac{1}{3}x(x-6)=0"}], "condition": []}, "reasons": {"method": "표준형 변형과 $y=0$ 대입을 통해 각 선지의 참·거짓을 판별한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q19
- 형식: 객관식
- 배점: 4
### 발문
이차함수 $y=ax^2+bx+c$의 그래프가 다음 그림과 같을 때, $abc$의 값은? [4점]
### 선지
① $40$ ② $80$ ③ $-80$ ④ $60$ ⑤ $-40$
### 정답
②
### 해설
그림에서 꼭짓점의 좌표가 $(-2, -3)$이고, $y$축과 만나는 점이 $(0, 5)$이다. $y = a(x+2)^2 - 3$에 $(0, 5)$를 대입하면 $\begin{aligned} 5 &= a(0+2)^2 - 3 = 4a - 3 \ 4a &= 8 \implies a = 2 \end{aligned}$ $y = 2(x+2)^2 - 3 = 2x^2 + 8x + 5$이므로 $a=2, b=8, c=5$이다. 따라서 $abc = 2 \times 8 \times 5 = 80$이다.



```json
{"target": "꼭짓점이 (-2, -3)이고 (0, 5)를 지나는 포물선", "type": "coordinate_parabola", "axes": {"x": [-5, 3], "y": [-4, 7], "origin": "O"}, "parabola": {"vertex": [-2, -3], "y_intercept": [0, 5], "eq": "y=2(x+2)^2-3"}, "points": {"V": [-2, -3], "Y": [0, 5]}}

```


```json
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "꼭짓점과 한 점으로 이차함수 일반형 계수 구하기", "primaryMethod": "꼭짓점 $(-2,-3)$으로 $y=a(x+2)^2-3$을 세우고 $(0,5)$를 대입해 $a=2$를 구한 뒤 전개한다.", "decisiveStep": "$y=2(x+2)^2-3$을 전개해 $a=2, b=8, c=5$를 구한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "그래프와 계수", "l4": "조건으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_VERTEX_FORM", "templateKey": null, "why": "그래프에서 꼭짓점과 $y$절편을 읽어 이차함수 식을 결정하는 문항이다."}, "crossConceptKeys": ["CC_POINT_ON_CURVE_SUBSTITUTION"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "표준형 식 세우기, 점 대입으로 $a$ 구하기, 전개해 $a, b, c$ 곱 구하기를 순차 수행하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_SH_1F_19", "format": "단일 정답", "slots": {"given": [{"term": "꼭짓점", "src": "solution", "quote": "꼭짓점의 좌표가 $(-2, -3)$"}], "goal": [{"term": "곱", "src": "stem", "quote": "$abc$의 값은?"}], "method": [{"term": "전개", "src": "solution", "quote": "2(x+2)^2 - 3 = 2x^2 + 8x + 5"}], "condition": []}, "reasons": {"method": "꼭짓점형 $y=a(x+2)^2-3$에 $y$절편 $(0,5)$를 대입한 뒤 전개한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q20
- 형식: 객관식
- 배점: 5
### 발문
다음 그림과 같은 이차함수 $y=-x^2+8x+k$의 그래프에서 꼭짓점을 $\text{A}$라 하고, $x$축과의 두 교점을 각각 $\text{B}, \text{C}$라 하자. $\overline{\text{BC}}=6$일 때, $\triangle\text{ABC}$의 넓이는? (단, $k$는 상수이다.) [5점]
### 선지
① $18$ ② $24$ ③ $27$ ④ $36$ ⑤ $54$
### 정답
③
### 해설
$y = -x^2 + 8x + k = -(x-4)^2 + 16 + k$ 축의 방정식은 $x=4$이고, 두 교점 $\text{B}, \text{C}$는 축 $x=4$에 대하여 대칭이므로 $\overline{\text{BC}}=6$에서 두 점의 $x$좌표는 $4-3=1$, $4+3=7$이다. 점 $(7, 0)$을 지나므로 $0 = -(7-4)^2 + 16 + k = 7 + k \implies k = -7$ 따라서 꼭짓점 $\text{A}$의 좌표는 $(4, 9)$이고, $\triangle\text{ABC} = \frac{1}{2} \times 6 \times 9 = 27$



```json
{"target": "위로 볼록한 포물선과 x축 교점 B, C 및 꼭짓점 A로 이루어진 삼각형", "type": "coordinate_parabola_triangle", "axes": {"x": [-1, 9], "y": [-2, 11], "origin": "O"}, "curve": {"eq": "y=-x^2+8x-7", "domain": [0, 8]}, "points": {"A": [4, 9], "B": [1, 0], "C": [7, 0]}, "polygon": ["A", "B", "C"]}

```


```json
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "포물선 축의 대칭성과 x축 교점 삼각형 넓이", "primaryMethod": "축 $x=4$로부터 좌우로 $3$만큼 떨어진 두 교점 $(1,0), (7,0)$을 구해 $k=-7$과 꼭짓점 높이 $9$를 찾는다.", "decisiveStep": "대칭성으로 $\\text{C}(7,0)$을 구해 $k=-7$과 꼭짓점 $\\text{A}(4,9)$를 얻는다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "일반형", "l4": "완전제곱식 변형"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_X_INTERCEPTS_DISTANCE", "templateKey": null, "why": "축의 대칭성과 두 $x$절편 사이 거리를 이용해 삼각형 넓이를 구하는 문항이다."}, "crossConceptKeys": ["CC_PARABOLA_AXIS_SYMMETRY", "CC_GEOMETRIC_AREA_VOLUME_FORMULA"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "축 대칭으로 $x$절편 좌표를 찾고 $k$와 꼭짓점 높이를 구해 삼각형 넓이를 계산하는 3단계 문항이다.", "level": "상", "item4slot": {"questionUid": "PENDING_24_SH_1F_20", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=-x^2+8x+k$의 그래프"}], "goal": [{"term": "넓이", "src": "stem", "quote": "$\\triangle\\text{ABC}$의 넓이는?"}], "method": [{"term": "축", "src": "solution", "quote": "축의 방정식은 $x=4$이고"}], "condition": []}, "reasons": {"method": "축 $x=4$ 대칭으로 $x$절편을 구해 $k$와 꼭짓점 높이를 찾는다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q21
- 형식: 서답형
- 배점: 4
### 발문
다음 민지와 정숙이의 대화를 읽고, 민지네 집 현관문의 비밀번호를 구하시오. [4점] 민지: 우리 집 현관문의 비밀번호는 ⓐⓑⓒⓓ 네 개의 숫자로 이루어져 있어. 알아맞혀 봐. 정숙: 힌트 좀 줘. 민지: $4x^2-7x+3$을 인수분해하면 $(x-1)(ⓐx-ⓑ)$이고, $x^2+2x-35$를 인수분해하면 $(x-ⓒ)(x+ⓓ)$야.
### 선지
없음
### 정답
4357
### 해설
$\begin{aligned} 4x^2 - 7x + 3 &= (x - 1)(4x - 3) \implies ⓐ = 4,\ ⓑ = 3 \ x^2 + 2x - 35 &= (x - 5)(x + 7) \implies ⓒ = 5,\ ⓓ = 7 \end{aligned}$ 따라서 비밀번호는 $4357$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-02", "subUnitKey": "M3-02-FACTORIZATION", "conceptClusterKey": "두 이차식 인수분해와 숫자 자리 대응", "primaryMethod": "두 이차식을 각각 인수분해하여 각 빈칸에 들어갈 네 자리 숫자를 구한다.", "decisiveStep": "$4x^2-7x+3=(x-1)(4x-3)$과 $x^2+2x-35=(x-5)(x+7)$을 인수분해한다.", "rpm": {"majorUnit": "다항식의 곱셈과 인수분해", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "이차식"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_POLY_FACTORIZATION", "templateKey": null, "why": "두 이차식을 인수분해해 각 자릿수를 결정하는 문항이다."}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 이차식을 각각 기본 인수분해해 숫자만 대응시키면 되는 1단계 문항이다.", "level": "하", "item4slot": {"questionUid": "PENDING_24_SH_1F_21", "format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "$4x^2-7x+3$을 인수분해하면"}], "goal": [{"term": "인수분해", "src": "solution", "quote": "4x^2 - 7x + 3 &= (x - 1)(4x - 3)"}], "method": [{"term": "인수분해", "src": "stem", "quote": "$x^2+2x-35$를 인수분해하면"}], "condition": []}, "reasons": {"method": "두 이차식을 각각 일차식의 곱으로 인수분해한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q22
- 형식: 서답형
- 배점: 5
### 발문
이차방정식 $x^2-8x+a+7=0$의 해가 모두 유리수가 되도록 하는 자연수 $a$의 값을 모두 구하시오. [5점]
### 선지
없음
### 정답
$5, 8, 9$
### 해설
짝수 근의 공식을 사용하면 $\begin{aligned} x &= 4 \pm \sqrt{4^2 - (a+7)} = 4 \pm \sqrt{9 - a} \end{aligned}$ 해가 모두 유리수가 되려면 근호 안의 수 $9-a$가 $0$ 또는 양의 제곱수이어야 한다.


* $9-a = 0 \implies a = 9$
* $9-a = 1 \implies a = 8$
* $9-a = 4 \implies a = 5$
* $9-a = 9 \implies a = 0$ (자연수가 아니므로 제외) 따라서 자연수 $a$의 값은 $5, 8, 9$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION", "conceptClusterKey": "유리수 근 조건과 자연수 미정계수", "primaryMethod": "근의 공식에서 근호 안 $9-a$가 $0$ 이상의 완전제곱수가 되는 자연수 $a$를 모두 찾는다.", "decisiveStep": "$9-a \\in \\{0, 1, 4, 9\\}$ 중 $a$가 자연수인 $a=5, 8, 9$만 남긴다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 풀이", "l3": "근의 공식", "l4": "근의 개수·판별"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_DISCRIMINANT", "templateKey": null, "why": "이차방정식의 해가 유리수가 될 조건으로 자연수 $a$를 모두 구하는 문항이다."}, "crossConceptKeys": ["CC_RATIONAL_ROOT_CONDITION", "CC_PERFECT_SQUARE_ENUMERATION"], "conditionKeys": ["COND_NATURAL_NUMBER", "COND_RATIONAL"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "근호 안의 식이 $0$을 포함한 제곱수여야 함을 파악하고 자연수 조건으로 $a=0$을 걸러내야 하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_SH_1F_22", "format": "복수 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-8x+a+7=0$"}], "goal": [{"term": "자연수", "src": "stem", "quote": "자연수 $a$의 값을 모두 구하시오."}], "method": [{"term": "제곱근", "src": "solution", "quote": "\\sqrt{9 - a}"}], "condition": [{"term": "유리수", "src": "stem", "quote": "해가 모두 유리수가 되도록 하는"}]}, "reasons": {"method": "근의 공식의 근호 안 $9-a$가 $0$ 또는 제곱수가 되는 자연수 $a$를 찾는다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q23
- 형식: 서답형
- 배점: 5
### 발문
여섯 살 차이가 나는 두 남매의 나이의 곱이 $91$일 때, 동생의 나이를 구하시오. [5점]
### 선지
없음
### 정답
7살
### 해설
동생의 나이를 $x$살이라 하면 손위 형제의 나이는 $(x+6)$살이다. $\begin{aligned} x(x + 6) &= 91 \ x^2 + 6x - 91 &= 0 \ (x - 7)(x + 13) &= 0 \ x &= 7 \quad \text{또는} \quad x = -13 \end{aligned}$ 나이는 양수이므로 동생의 나이는 $7$살이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-03", "subUnitKey": "M3-03-QUADRATIC_EQUATION_WORD", "conceptClusterKey": "나이 차이 문장제의 이차방정식 활용", "primaryMethod": "동생 나이를 $x$로 놓고 $x(x+6)=91$을 세워 인수분해로 양수 해를 구한다.", "decisiveStep": "$(x-7)(x+13)=0$에서 양수 해 $x=7$을 선택한다.", "rpm": {"majorUnit": "이차방정식", "midUnit": "이차방정식의 활용", "l3": "수와 식", "l4": "연속된 수"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_EQUATION_WORD_PROBLEM", "templateKey": null, "why": "두 수의 차와 곱이 주어진 문장제를 이차방정식으로 푸는 문항이다."}, "crossConceptKeys": [], "conditionKeys": ["COND_POSITIVE"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문장제에서 미지수를 설정해 이차방정식을 세우고 양수 해를 선택하는 2단계 문항이다.", "level": "중", "item4slot": {"questionUid": "PENDING_24_SH_1F_23", "format": "단일 정답", "slots": {"given": [{"term": "곱", "src": "stem", "quote": "두 남매의 나이의 곱이 $91$일 때"}], "goal": [{"term": "양수", "src": "solution", "quote": "나이는 양수이므로 동생의 나이는 $7$살이다."}], "method": [{"term": "이차방정식", "src": "solution", "quote": "x^2 + 6x - 91 &= 0"}], "condition": []}, "reasons": {"method": "동생 나이 $x$에 대해 $x(x+6)=91$을 세워 인수분해한다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```

## Q24
- 형식: 서답형
- 배점: 6
### 발문
점 $(2, 10)$을 지나는 이차함수 $y=2(x-p)^2+q$의 그래프의 꼭짓점이 직선 $y=x-2$ 위에 있을 때, 상수 $p, q$에 대하여 $p+q$의 값을 구하시오. (단, $p>0$) [6점]
### 선지
없음
### 정답
6
### 해설
꼭짓점 $(p, q)$가 직선 $y=x-2$ 위에 있으므로 $q = p - 2$이다. 그래프가 점 $(2, 10)$을 지나므로 $y=2(x-p)^2+q$에 대입하면 $\begin{aligned} 10 &= 2(2 - p)^2 + (p - 2) \ 10 &= 2(p^2 - 4p + 4) + p - 2 \ 2p^2 - 7p - 4 &= 0 \ (2p + 1)(p - 4) &= 0 \end{aligned}$ $p > 0$이므로 $p = 4$이고, $q = 4 - 2 = 2$이다. 따라서 $p + q = 4 + 2 = 6$이다.



```json
{"target": "없음", "type": "none"}

```


```json
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-04", "subUnitKey": "M3-04-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": "꼭짓점이 직선 위에 있고 한 점을 지나는 이차함수", "primaryMethod": "꼭짓점 $(p,q)$를 직선에 대입해 $q=p-2$를 얻고, 점 $(2,10)$을 이차함수 식에 대입해 $p$에 대한 이차방정식을 푼다.", "decisiveStep": "$(2p+1)(p-4)=0$에서 조건 $p>0$에 맞는 $p=4$만 선택해 $q=2$를 구한다.", "rpm": {"majorUnit": "이차함수", "midUnit": "이차함수 y=ax²+bx+c의 그래프", "l3": "그래프와 계수", "l4": "조건으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_M3_QUADRATIC_FUNCTION_VERTEX_FORM", "templateKey": null, "why": "꼭짓점의 직선 위 조건과 지나는 점 조건을 연립해 이차방정식으로 $p, q$를 구하는 문항이다."}, "crossConceptKeys": ["CC_POINT_ON_CURVE_SUBSTITUTION", "CC_QUADRATIC_EQUATIONS"], "conditionKeys": ["COND_POSITIVE"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직선 대입, 포물선 점 대입, 이차방정식 인수분해, $p>0$ 필터링까지 4단계를 거치는 3단계 문항이다.", "level": "상", "item4slot": {"questionUid": "PENDING_24_SH_1F_24", "format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=2(x-p)^2+q$의 그래프"}], "goal": [{"term": "합", "src": "stem", "quote": "$p+q$의 값을 구하시오."}], "method": [{"term": "꼭짓점", "src": "stem", "quote": "그래프의 꼭짓점이 직선 $y=x-2$ 위에 있을 때"}], "condition": [{"term": "양수", "src": "stem", "quote": "$p>0$"}]}, "reasons": {"method": "$q=p-2$를 이차함수 식에 대입하고 $(2,10)$을 대입해 $p$에 대한 이차방정식을 푼다."}, "steps": [], "scenarioNote": ""}, "hold": ""}

```
