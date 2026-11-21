# 2025 순천여고 2학기 기말 공통수학2 — 서술형 19번 해설 개선

- 상태: **DRAFT_STAGED / NOT_PRODUCTION / REVIEW_REQUIRED**
- 자료: original / 2학기 기말 / 2025
- 원본: `archive/exams/original/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2.js`
- 원본 Git blob SHA: `70cb32b708e1a4209b98b4f83ffaf6fddeeeb220`
- sourceIdentityKey: `sha256:5729d6f3d8cac3c69fbbfa8c2fb27533b51868a4c00b8c3b010b6c30f6c7e947|19`
- qid/number/sourceQuestionNo: `19` / 서술형 1
- standardCourse: `공통수학2`
- 원본 answer: `-5`
- 상태 판정: **UPGRADE 초안** (운영 확정 아님)

## 기존 해설에서 학생이 멈추는 지점

기존 solution은 `g∘f=I`에서 `g=f^{-1}`를 얻은 직후, `g(g(a))=1`에 `f∘f`를 한꺼번에 적용하여 `a=f(f(1))`로 이동한다. 역함수 합성의 상쇄가 두 번 일어나는 과정을 학생이 재현하기 어렵다. 함숫값의 범위와 일대일대응 판단도 한 번 더 명확히 한다.

## 제안 학생용 solution 전체

주어진 함수식을 완전제곱식으로 고치면

$$
f(x)=\begin{cases}
4-(x-2)^2 &(x\ge2),\\
4+(x-2)^2 &(x<2)
\end{cases}
$$

이다.

$x<2$에서는 $f(x)=4+(x-2)^2>4$이고, $x$가 증가하면 $(x-2)^2$가 감소하므로 $f(x)$는 감소한다. 이 구간의 치역은 $(4,\infty)$이다.

$x\ge2$에서는 $f(x)=4-(x-2)^2\le4$이고, $x$가 증가하면 $f(x)$는 감소한다. 이 구간의 치역은 $(-\infty,4]$이다.

각 구간에서 함숫값이 중복되지 않고, 두 구간의 치역이 겹치지 않으며 합치면 실수 전체이므로 $f$는 실수 전체에서 실수 전체로의 일대일대응이다.

따라서 $g\circ f=I$를 만족하는 함수는 역함수 $g=f^{-1}$이고,

$$f(g(t))=t$$

가 모든 실수 $t$에 대하여 성립한다.

이제 주어진 식은

$$g(g(a))=1$$

이다. 양변에 $f$를 **한 번** 적용하면

$$
\begin{aligned}
f(g(g(a)))&=f(1)\\
g(a)&=f(1)
\end{aligned}
$$

이다. 여기서 $f(g(t))=t$를 사용했다.

$1<2$이므로 두 번째 식을 이용하여

$$
\begin{aligned}
g(a)&=f(1)\\
&=1^2-4\cdot1+8\\
&=1-4+8\\
&=5
\end{aligned}
$$

이다.

따라서 $g(a)=5$이다. 양변에 $f$를 **다시 한 번** 적용하면

$$
\begin{aligned}
f(g(a))&=f(5)\\
a&=f(5)
\end{aligned}
$$

이다.

$5\ge2$이므로

$$
\begin{aligned}
a&=-5^2+4\cdot5\\
&=-25+20\\
&=-5
\end{aligned}
$$

이다.

따라서 구하는 값은 $\boxed{-5}$이다.

## 독립 수학 검산

$f(1)=5$, $f(5)=-5$이므로 $g(-5)=5$, $g(5)=1$이다. 따라서 $g(g(-5))=g(5)=1$로 원문 조건을 만족한다. 각 조각은 엄격히 감소하고 치역이 서로 분리되어 일대일대응임도 확인했다.

## SVG / QA / JS 이행

- SVG_REQUEST: 없음. 문항에 필수 그림 없음.
- 원본 JS의 문제·보기·정답과 solution을 대조했으며, 위 학생용 해설은 **운영 미반영 초안**이다.
- Golden 2~3개·Negative calibration 독립 판독, 문서 SHA-256 receipt 검증, preflight 실행, 학생 화면 렌더, 운영 보호 필드 diff: **NOT_RUN / REVIEW_REQUIRED**.
- 추후 원본 sourceIdentityKey와 blob SHA를 다시 확인하고, 독립 QA 후 **19번 solution만** 반영한다. content/choices/answer/image/메타/SVG는 변경하지 않는다.
- 동일 시험지 15번은 이미 별도 staged MD가 있으므로 중복 생성하지 않았다.
- 재개 커서: original → 2학기 기말 → 2025 → `25_순천여고_2학기_기말_고1_공통수학2.js` → 19번 작성 완료, 같은 시험지의 나머지 문항/다른 2025 기말 시험지 계속 확인.
