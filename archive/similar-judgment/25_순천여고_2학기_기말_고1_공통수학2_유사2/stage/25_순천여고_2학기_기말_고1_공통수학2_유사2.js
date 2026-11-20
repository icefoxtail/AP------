window.examTitle = "25_순천여고_2학기_기말_고1_공통수학2_유사2";
window.examDisplayTitle = "25_순천여고_2학기_기말_고1_공통수학2_유사2";

window.questionBank = [
  {
    "id": 1,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "전체집합 $U$가 자연수 전체의 집합일 때, 조건<br>$p: |x-4| \\ge 3$<br>에 대하여 $\\sim p$의 진리집합의 모든 원소의 합은? [3.8점]",
    "choices": [
      "$12$",
      "$20$",
      "$21$",
      "$27$",
      "$28$"
    ],
    "answer": "②",
    "solution": "조건 $p$를 부정하면\n$\\sim p: |x-4| < 3$\n이다.\n\n절댓값 부등식을 풀면\n$-3 < x-4 < 3$\n$1 < x < 7$\n이다.\n\n전체집합 $U$가 자연수 전체의 집합이므로 $\\sim p$의 진리집합은 $\\{2, 3, 4, 5, 6\\}$이다.\n따라서 진리집합의 모든 원소의 합은\n$2+3+4+5+6=20$\n이다.\n\n따라서 정답은 ②이다.",
    "score": 3.8,
    "points": 3.8,
    "sourceQid": 1,
    "variationType": "STRICT_VARIANT"
  },
  {
    "id": 2,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "다음 <보기>에서 참인 명제인 것만을 모두 고른 것은? [4.1점]<br><br><div style=\"border: 1px solid #000; padding: 10px; margin: 10px 0;\"><b>&lt; 보 기 &gt;</b><br>ㄱ. 유리수 $a$와 무리수 $b$에 대하여 $ab$는 무리수이다.<br>ㄴ. 복소수 $z=1-2i$에 대하여 $z+\\overline{z}=2$이다.<br>ㄷ. 모든 실수 $x$에 대하여 $x^2+2x+1 > 0$이다.<br>ㄹ. 어떤 자연수 $n$에 대하여 $n^2-5n+4 < 0$이다.</div>",
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄴ, ㄹ",
      "ㄷ, ㄹ"
    ],
    "answer": "④",
    "solution": "각 문장의 참·거짓을 차례로 판정한다.\n\nㄱ. $a=0$, $b=\\sqrt{2}$이면 $ab=0$으로 유리수이므로 거짓이다.\n\nㄴ. $\\overline{z}=1+2i$이므로\n$z+\\overline{z}=(1-2i)+(1+2i)=2$\n따라서 참이다.\n\nㄷ. $x^2+2x+1=(x+1)^2$이므로 $x=-1$일 때 $(x+1)^2=0$이 되어 부등식이 성립하지 않는다. 따라서 거짓이다.\n\nㄹ. $n=2$일 때\n$n^2-5n+4=4-10+4=-2 < 0$\n이므로 조건을 만족하는 자연수 $n$이 존재한다. 따라서 참이다.\n\n참인 명제는 ㄴ, ㄹ이므로 정답은 ④이다.",
    "score": 4.1,
    "points": 4.1,
    "sourceQid": 2,
    "variationType": "STRICT_VARIANT"
  },
  {
    "id": 3,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "다음은 명제 '두 자연수 $a, b$에 대하여 $a^2+b^2$이 $4$의 배수이면 $a$와 $b$는 모두 짝수이다.'가 참임을 증명하는 과정이다.<br><br><div style=\"border: 1px solid #000; padding: 10px; margin: 10px 0;\">주어진 명제의 대우 '두 자연수 $a, b$에 대하여 $a$ 또는 $b$가 홀수이면 $a^2+b^2$은 [ ① ]이 아니다.'를 증명하면 된다.<br>(i) $a, b$ 중 하나만 홀수인 경우<br>$a$가 짝수, $b$가 홀수라 하면 $a=2k$, $b=2l+1$ ($k$는 자연수, $l$은 $0$ 또는 자연수)로 놓을 수 있다.<br>이때 $a^2+b^2 = 4($ [ ② ] $)+1$이므로 $a^2+b^2$은 [ ① ]이 아니다.<br>($a$가 홀수, $b$가 짝수인 경우도 마찬가지이다.)<br>(ii) $a, b$가 모두 홀수인 경우<br>$a=$ [ ③ ], $b=2l+1$ ($k, l$은 $0$ 또는 자연수)로 놓을 수 있다.<br>이때 $a^2+b^2 = 4($ [ ④ ] $)+$ [ ⑤ ]이므로 $a^2+b^2$은 [ ① ]이 아니다.<br>따라서 주어진 명제의 대우가 참이므로 원 명제가 참이다.</div><br>위의 증명 과정에서 빈칸에 들어갈 말이나 식으로 옳게 짝지어지지 않은 것은? [4.2점]",
    "choices": [
      "$4$의 배수",
      "$k^2+l^2+2l$",
      "$2k+1$",
      "$k^2+l^2+k+l$",
      "$2$"
    ],
    "answer": "②",
    "solution": "주어진 명제의 대우에서 $a^2+b^2$은 $4$의 배수가 아니어야 하므로 ①에는 '$4$의 배수'가 들어간다.\n\n(i) $a=2k$, $b=2l+1$일 때\n$a^2+b^2=(2k)^2+(2l+1)^2$\n$=4k^2+4l^2+4l+1$\n$=4(k^2+l^2+l)+1$\n따라서 ②에는 $k^2+l^2+l$이 들어가야 하므로 $k^2+l^2+2l$은 옳지 않다.\n\n(ii) $a, b$가 모두 홀수이므로 $a=2k+1$, $b=2l+1$로 놓을 수 있다. 이때\n$a^2+b^2=(2k+1)^2+(2l+1)^2$\n$=4k^2+4k+1+4l^2+4l+1$\n$=4(k^2+l^2+k+l)+2$\n따라서 ③은 $2k+1$, ④는 $k^2+l^2+k+l$, ⑤는 $2$이다.\n\n옳게 짝지어지지 않은 것은 ②이므로 정답은 ②이다.",
    "score": 4.2,
    "points": 4.2,
    "sourceQid": 3,
    "variationType": "STRICT_VARIANT"
  },
  {
    "id": 4,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "두 실수 $x, y$에 대하여 세 조건 $p, q, r$가<br>$$p: x^2+xy+y^2=0$$<br>$$q: x^2-y^2=0$$<br>$$r: x+y=0$$<br>일 때, <보기>에서 옳은 것만을 있는 대로 고른 것은? [4.7점]<br><br><div style=\"border: 1px solid #000; padding: 10px; margin: 10px 0;\"><b>&lt; 보 기 &gt;</b><br>ㄱ. $p$는 $r$이기 위한 충분조건이다.<br>ㄴ. 명제 $q \\to r$의 역은 거짓이다.<br>ㄷ. 명제 $\\sim q \\to \\sim p$의 대우는 참이다.<br>ㄹ. $r$는 $q$이기 위한 충분조건이지만 필요조건은 아니다.</div>",
    "choices": [
      "ㄱ, ㄷ",
      "ㄴ, ㄹ",
      "ㄱ, ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄹ",
      "ㄱ, ㄷ, ㄹ"
    ],
    "answer": "⑤",
    "solution": "세 조건 $p, q, r$의 진리집합을 각각 $P, Q, R$이라 하자.\n\n$p$: $x^2+xy+y^2=\\left(x+\\dfrac{y}{2}\\right)^2+\\dfrac{3}{4}y^2=0$에서 $x=0$이고 $y=0$이다.\n따라서 $P=\\{(0, 0)\\}$이다.\n\n$q$: $x^2-y^2=(x+y)(x-y)=0$이므로 $x=-y$ 또는 $x=y$이다.\n따라서 $Q=\\{(x, y)\\mid x+y=0 \\text{ 또는 } x-y=0\\}$이다.\n\n$r$: $x+y=0$이므로 $R=\\{(x, y)\\mid x+y=0\\}$이다.\n결국 $P \\subset R \\subset Q$이다.\n\nㄱ. $P \\subset R$이므로 $p \\to r$는 참이다. 즉 $p$는 $r$이기 위한 충분조건이다.\n\nㄴ. $q \\to r$의 역은 $r \\to q$이다. $R \\subset Q$이므로 $r \\to q$는 참이다. 따라서 거짓이라는 ㄴ은 옳지 않다.\n\nㄷ. $\\sim q \\to \\sim p$의 대우는 $p \\to q$이다. $P \\subset Q$이므로 대우는 참이다.\n\nㄹ. $R \\subset Q$이므로 $r$는 $q$이기 위한 충분조건이다. 한편 $(1, 1) \\in Q$이지만 $(1, 1) \\notin R$이므로 $Q \\not\\subset R$이고 필요조건은 아니다.\n\n옳은 것은 ㄱ, ㄷ, ㄹ이므로 정답은 ⑤이다.",
    "score": 4.7,
    "points": 4.7,
    "sourceQid": 4,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q4-solution.svg",
    "solutionImageAlt": "해설 그림: 세 조건의 진리집합은 P={(0,0)}, R={(x,y)|x+y=0}, Q={(x,y)|x+y=0 또는 x-y=0}이고 P⊂R⊂Q이다. P⊂R이므로 ㄱ은 참, R⊂Q이므로 역 r→q가 참이어서 ㄴ은 거짓, P⊂Q이므로 ㄷ은 참, (1,1)은 Q에만 속하므로 R은 Q의 필요조건이 아니어서 ㄹ은 참이다. 따라서 답은 ⑤이다.",
    "solutionImageCaption": "세 조건의 진리집합은 P={(0,0)}, R={(x,y)|x+y=0}, Q={(x,y)|x+y=0 또는 x-y=0}이고 P⊂R⊂Q이다. P⊂R이므로 ㄱ은 참, R⊂Q이므로 역 r→q가 참이어서 ㄴ은 거짓, P⊂Q이므로 ㄷ은 참, (1,1)은 Q에만 속하므로 R은 Q의 필요조건이 아니어서 ㄹ은 참이다. 따라서 답은 ⑤이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 5,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "전체집합 $U$에 대하여 세 조건 $p, q, r$의 진리집합을 각각 $P, Q, R$이라 하자. 세 집합이 다음 조건을 만족할 때, 항상 참인 명제는? [4.6점]<br><br><div style=\"border: 1px solid #000; padding: 10px; margin: 10px 0;\">(가) $P \\cup Q^c = U$<br>(나) $P \\cap R = P$</div>",
    "choices": [
      "$\\sim r \\to \\sim q$",
      "$p \\to q$",
      "$r \\to p$",
      "$\\sim q \\to \\sim p$",
      "$r \\to \\sim q$"
    ],
    "answer": "①",
    "solution": "집합 조건을 포함관계로 바꾼다.\n\n(가) $P \\cup Q^c = U$의 양변에 여집합을 취하면\n$P^c \\cap Q = \\varnothing$\n$Q - P = \\varnothing$\n이므로 $Q \\subset P$이다.\n\n(나) $P \\cap R = P$이므로 $P \\subset R$이다.\n\n따라서 $Q \\subset P \\subset R$이므로 $Q \\subset R$이고, 양변의 여집합을 취하면 $R^c \\subset Q^c$이다.\n그러므로 명제 $\\sim r \\to \\sim q$는 항상 참이다.\n\n나머지가 항상 참이 아님을 확인하기 위해 $U=\\{1, 2, 3, 4\\}$, $Q=\\{1\\}$, $P=\\{1, 2\\}$, $R=\\{1, 2, 3\\}$이라 하자.\n(가)와 (나)를 모두 만족하지만\n② $2 \\in P$이고 $2 \\notin Q$이므로 $p \\to q$는 거짓이다.\n③ $3 \\in R$이고 $3 \\notin P$이므로 $r \\to p$는 거짓이다.\n④ $2 \\in Q^c$이고 $2 \\notin P^c$이므로 $\\sim q \\to \\sim p$는 거짓이다.\n⑤ $1 \\in R$이고 $1 \\notin Q^c$이므로 $r \\to \\sim q$는 거짓이다.\n\n따라서 항상 참인 명제는 ①이므로 정답은 ①이다.",
    "score": 4.6,
    "points": 4.6,
    "sourceQid": 5,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q5-solution.svg",
    "solutionImageAlt": "해설 그림: (가)에서 Q⊂P, (나)에서 P⊂R이므로 Q⊂P⊂R이다. 예: U={1,2,3,4}, Q={1}, P={1,2}, R={1,2,3}으로 두면 Q⊂R이므로 R의 여집합이 Q의 여집합에 포함되어 ~r→~q만 항상 참이고, 나머지 보기는 이 예에서 거짓이다. 따라서 답은 ①이다.",
    "solutionImageCaption": "(가)에서 Q⊂P, (나)에서 P⊂R이므로 Q⊂P⊂R이다. 예: U={1,2,3,4}, Q={1}, P={1,2}, R={1,2,3}으로 두면 Q⊂R이므로 R의 여집합이 Q의 여집합에 포함되어 ~r→~q만 항상 참이고, 나머지 보기는 이 예에서 거짓이다. 따라서 답은 ①이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 6,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "두 양수 $x, y$에 대하여 식<br>$$x^2 + 2y + \\frac{k}{2x+2y}$$<br>($k>0$)의 최솟값이 $11$일 때, 상수 $k$의 값은? [4.9점]",
    "choices": [
      "$36$",
      "$49$",
      "$64$",
      "$81$",
      "$100$"
    ],
    "answer": "①",
    "solution": "$s=2x+2y$라 놓으면 $x, y$가 양수이므로 $s>0$이고 $2y=s-2x$이다.\n이를 주어진 식에 대입하면\n$x^2+s-2x+\\dfrac{k}{s}=(x^2-2x)+\\left(s+\\dfrac{k}{s}\\right)$\n$=(x-1)^2-1+\\left(s+\\dfrac{k}{s}\\right)$\n이다.\n\n$(x-1)^2 \\ge 0$이고 등호는 $x=1$일 때 성립한다.\n또 $s>0$, $k>0$이므로 산술평균과 기하평균의 관계에 의하여\n$s+\\dfrac{k}{s} \\ge 2\\sqrt{s \\cdot \\dfrac{k}{s}}=2\\sqrt{k}$\n이고 등호는 $s=\\sqrt{k}$일 때 성립한다.\n\n주어진 식의 최솟값이 $11$이므로\n$2\\sqrt{k}-1=11$\n$2\\sqrt{k}=12$\n$\\sqrt{k}=6$\n따라서 $k=36$이다.\n(이때 $x=1$, $s=6$이므로 $2y=6-2=4$, 즉 $y=2>0$이 되어 두 등호가 동시에 성립한다.)\n\n따라서 정답은 ①이다.",
    "score": 4.9,
    "points": 4.9,
    "sourceQid": 6,
    "variationType": "STRICT_VARIANT"
  },
  {
    "id": 7,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "다음 중 실수 전체의 집합 $R$에서 $R$로의 함수의 그래프 중에서 일대일함수이지만 일대일대응이 아닌 것은? [4.1점]",
    "choices": [
      "①",
      "②",
      "③",
      "④",
      "⑤"
    ],
    "answer": "④",
    "solution": "일대일함수이지만 일대일대응이 아니려면 임의의 수평선과 많아야 한 점에서 만나고, 그래프와 만나지 않는 수평선이 적어도 하나 있어야 한다.\n\n①, ② 그래프가 내려갔다 올라가는 형태이므로 같은 수평선과 두 점에서 만나는 경우가 있어 일대일함수가 아니다.\n\n③ 모든 수평선과 정확히 한 점에서 만나므로 일대일대응이다.\n\n④ 모든 수평선과 많아야 한 점에서 만나므로 일대일함수이다. 그러나 $-1 \\le y < 2$에 해당하는 수평선과는 만나지 않아 치역이 공역 $R$과 같지 않으므로 일대일대응이 아니다.\n\n⑤ 수평인 구간이 있어 서로 다른 $x$에 같은 함숫값이 대응하므로 일대일함수가 아니다.\n\n따라서 정답은 ④이다.",
    "score": 4.1,
    "points": 4.1,
    "sourceQid": 7,
    "variationType": "STRICT_VARIANT",
    "image": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q7.svg",
    "imageSize": "full"
  },
  {
    "id": 8,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "일차함수 $f(x)=2x+a$에 대하여 $f^{-1}(5)=3$일 때, 상수 $a$의 값은? [3.9점]",
    "choices": [
      "$-5$",
      "$-3$",
      "$-2$",
      "$-1$",
      "$1$"
    ],
    "answer": "④",
    "solution": "$f^{-1}(5)=3$이므로 역함수의 정의에 의하여 $f(3)=5$이다.\n\n$f(x)=2x+a$에 $x=3$을 대입하면\n$2\\times 3+a=5$\n$6+a=5$\n$a=-1$\n이다.\n\n따라서 정답은 ④이다.",
    "score": 3.9,
    "points": 3.9,
    "sourceQid": 8,
    "variationType": "STRICT_VARIANT"
  },
  {
    "id": 9,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "집합 $X=\\{1, 2, 3, 4\\}$에 대하여 $X$에서 $X$로의 두 함수 $f, g$가 아래 그림과 같을 때, $(f^{-1} \\circ g)^{-1}(2)+(f \\circ (g \\circ f)^{-1})(4)$의 값은? [4.2점]",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "③",
    "solution": "그림의 화살표에서\n$f(1)=3$, $f(2)=1$, $f(3)=4$, $f(4)=2$\n$g(1)=2$, $g(2)=4$, $g(3)=1$, $g(4)=3$\n이다.\n\n먼저 $(f^{-1} \\circ g)^{-1}=g^{-1} \\circ f$이므로\n$(f^{-1} \\circ g)^{-1}(2)=g^{-1}(f(2))=g^{-1}(1)$\n이다.\n$g(3)=1$이므로 $g^{-1}(1)=3$이다.\n\n다음으로 $(g \\circ f)^{-1}=f^{-1} \\circ g^{-1}$이므로\n$(f \\circ (g \\circ f)^{-1})(4)=(f \\circ f^{-1} \\circ g^{-1})(4)=g^{-1}(4)$\n이다.\n$g(2)=4$이므로 $g^{-1}(4)=2$이다.\n\n따라서 구하는 값은\n$3+2=5$\n이므로 정답은 ③이다.",
    "score": 4.2,
    "points": 4.2,
    "sourceQid": 9,
    "variationType": "STRICT_VARIANT",
    "image": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q9.svg",
    "imageSize": "full",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q9-solution.svg",
    "solutionImageAlt": "해설 그림: f(2)=1이고 g(3)=1이므로 g의 역함수로 g^{-1}(1)=3이다. 또 g(2)=4이므로 g^{-1}(4)=2이다. 따라서 (f^{-1}∘g)^{-1}(2)=g^{-1}(1)=3, (f∘(g∘f)^{-1})(4)=g^{-1}(4)=2이므로 합은 5이다. 따라서 답은 ③이다.",
    "solutionImageCaption": "f(2)=1이고 g(3)=1이므로 g의 역함수로 g^{-1}(1)=3이다. 또 g(2)=4이므로 g^{-1}(4)=2이다. 따라서 (f^{-1}∘g)^{-1}(2)=g^{-1}(1)=3, (f∘(g∘f)^{-1})(4)=g^{-1}(4)=2이므로 합은 5이다. 따라서 답은 ③이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 10,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "일차함수 $f:\\mathbb{R}\\to\\mathbb{R}$가 $f(x)=2x+a$ ($a$는 상수)이고 $(f\\circ f)(2)=11$일 때, $f^{-1}(7)$의 값은? [4.6점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "먼저 $(f\\circ f)(x)$를 구하면\n$(f\\circ f)(x)=f(2x+a)=2(2x+a)+a=4x+3a$\n이다.\n\n$(f\\circ f)(2)=11$이므로\n$4\\times 2+3a=11$\n$8+3a=11$\n$3a=3$\n$a=1$\n이다.\n\n따라서 $f(x)=2x+1$이다.\n$f^{-1}(7)=k$라 하면 $f(k)=7$이므로\n$2k+1=7$\n$2k=6$\n$k=3$\n이다.\n\n따라서 정답은 ③이다.",
    "score": 4.6,
    "points": 4.6,
    "sourceQid": 10,
    "variationType": "STRICT_VARIANT"
  },
  {
    "id": 11,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "두 집합 $X=\\{x|x \\le a\\}, Y=\\{y|y \\le 3a+2\\}$에 대하여 $X$에서 $Y$로의 함수 $f(x)=-x^2+6x$의 역함수가 존재하도록 하는 모든 상수 $a$의 값의 합은? [4.8점]",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=-x^2+6x=-(x-3)^2+9$이므로 그래프는 위로 볼록하고 꼭짓점은 $(3, 9)$이다.\n\n$X$에서 $Y$로의 역함수가 존재하려면 $f$가 $X$에서 $Y$로의 일대일대응이어야 한다.\n$x \\le a$에서 $f$가 일대일함수가 되려면 대칭축 $x=3$의 왼쪽에 정의역이 놓여야 하므로 $a \\le 3$이다.\n\n$a \\le 3$일 때 $f$는 $x \\le a$에서 증가하므로 치역은 $\\{y|y \\le f(a)\\}$이다.\n치역이 공역 $Y=\\{y|y \\le 3a+2\\}$와 같아야 하므로\n$f(a)=3a+2$\n$-a^2+6a=3a+2$\n$a^2-3a+2=0$\n$(a-1)(a-2)=0$\n에서 $a=1$ 또는 $a=2$이다.\n\n두 값 모두 조건 $a \\le 3$을 만족하므로 구하는 합은\n$1+2=3$\n이다.\n\n따라서 정답은 ⑤이다.",
    "score": 4.8,
    "points": 4.8,
    "sourceQid": 11,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q11-solution.svg",
    "solutionImageAlt": "해설 그림: 위로 볼록한 포물선과 오른쪽 위로 올라가는 직선이 두 점 A, B에서 만나고, 포물선의 꼭짓점 V가 표시되어 있다.",
    "solutionImageCaption": "f(x)=-x²+6x=-(x-3)²+9이므로 꼭짓점은 (3,9)이고, 역함수가 존재하려면 a≤3이어야 한다. 치역 {y|y≤f(a)}가 공역 {y|y≤3a+2}와 같아야 하므로 곡선 y=f(x)와 직선 y=3x+2가 만나는 점의 x좌표가 a이다. 교점은 x=1, x=2이므로 a의 합은 3이다. 따라서 답은 ⑤이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 12,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "유리함수 $y=\\frac{ax+b}{x+c}$의 그래프가 점 $(1, 4)$를 지나고, 두 직선 $y=x+3$과 $y=-x+1$에 대하여 모두 대칭일 때, $a+b+c$의 값은? (단, $a, b, c$는 상수이다.) [4.1점]",
    "choices": [
      "$7$",
      "$9$",
      "$11$",
      "$13$",
      "$15$"
    ],
    "answer": "②",
    "solution": "유리함수의 그래프는 두 점근선의 교점에 대하여 대칭이고, 대칭의 중심은 두 대칭축 $y=x+3$과 $y=-x+1$의 교점과 같다.\n\n두 직선의 교점을 구하면\n$x+3=-x+1$\n$2x=-2$\n$x=-1$\n이고, 이때 $y=2$이므로 대칭의 중심은 $(-1, 2)$이다.\n\n따라서 두 점근선은 $x=-1$, $y=2$이다.\n$y=\\dfrac{ax+b}{x+c}$의 두 점근선은 $x=-c$, $y=a$이므로\n$-c=-1$, $a=2$\n에서 $a=2$, $c=1$이다.\n\n그래프가 점 $(1, 4)$를 지나므로\n$4=\\dfrac{2 \\times 1+b}{1+1}$\n$4=\\dfrac{2+b}{2}$\n$2+b=8$\n$b=6$\n이다.\n\n따라서 $a+b+c=2+6+1=9$이므로 정답은 ②이다.",
    "score": 4.1,
    "points": 4.1,
    "sourceQid": 12,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q12-solution.svg",
    "solutionImageAlt": "해설 그림: 두 가지로 이루어진 유리함수 그래프와 두 점선 직선이 점 C에서 만나고, 그래프가 점 P를 지난다.",
    "solutionImageCaption": "두 대칭축 y=x+3, y=-x+1의 교점 C(-1,2)가 대칭의 중심이므로 점근선은 x=-1, y=2이다. 따라서 a=2, c=1이고, 점 P(1,4)를 지나므로 b=6이다. a+b+c=9이다. 따라서 답은 ②이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 13,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "다음 <보기> 중 그 그래프를 평행이동 또는 대칭이동하여 함수 $y=\\frac{2x+1}{x-1}$의 그래프와 겹칠 수 있는 것만을 모두 고른 것은? [4.1점]<br><br><div style=\"border: 1px solid #000; padding: 10px; margin: 10px 0;\"><b>&lt; 보 기 &gt;</b><br>ㄱ. $y=\\frac{x+5}{x+2}$<br>ㄴ. $y=\\frac{2x-3}{x-2}$<br>ㄷ. $y=\\frac{-x-1}{x-2}$<br>ㄹ. $y=\\frac{3x+1}{x+1}$</div>",
    "choices": [
      "ㄱ",
      "ㄴ, ㄹ",
      "ㄱ, ㄷ",
      "ㄷ, ㄹ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "주어진 유리함수를 변형하면\n$y=\\dfrac{2x+1}{x-1}=\\dfrac{2(x-1)+3}{x-1}=2+\\dfrac{3}{x-1}$\n이다.\n\n평행이동 또는 대칭이동하여 겹칠 수 있으려면 표준형 $y=q+\\dfrac{k}{x-p}$로 고쳤을 때 $|k|=3$, 즉 $k=3$ 또는 $k=-3$이어야 한다.\n\nㄱ. $y=\\dfrac{x+5}{x+2}=\\dfrac{(x+2)+3}{x+2}=1+\\dfrac{3}{x+2}$이므로 $k=3$이다. 겹칠 수 있다.\n\nㄴ. $y=\\dfrac{2x-3}{x-2}=\\dfrac{2(x-2)+1}{x-2}=2+\\dfrac{1}{x-2}$이므로 $k=1$이다. 겹칠 수 없다.\n\nㄷ. $y=\\dfrac{-x-1}{x-2}=\\dfrac{-(x-2)-3}{x-2}=-1-\\dfrac{3}{x-2}$이므로 $k=-3$이다. 겹칠 수 있다.\n\nㄹ. $y=\\dfrac{3x+1}{x+1}=\\dfrac{3(x+1)-2}{x+1}=3-\\dfrac{2}{x+1}$이므로 $k=-2$이다. 겹칠 수 없다.\n\n겹칠 수 있는 것은 ㄱ, ㄷ이므로 정답은 ③이다.",
    "score": 4.1,
    "points": 4.1,
    "sourceQid": 13,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q13-solution.svg",
    "solutionImageAlt": "해설 그림: 기준 f(파란색)는 y=(2x+1)/(x-1)=2+3/(x-1)이다. 보기 ㄱ을 g(주황색)로 두면 g=1+3/(x+2)로 분수 부분의 계수가 3이어서 평행이동하면 겹치고, 보기 ㄷ을 h(초록색)로 두면 h=-1-3/(x-2)로 계수가 -3이어서 대칭이동과 평행이동으로 겹친다. ㄴ(계수 1)과 ㄹ(계수 -2)은 계수의 절댓값이 3이 아니어서 겹치지 않는다. 따라서 답은 ③이다.",
    "solutionImageCaption": "기준 f(파란색)는 y=(2x+1)/(x-1)=2+3/(x-1)이다. 보기 ㄱ을 g(주황색)로 두면 g=1+3/(x+2)로 분수 부분의 계수가 3이어서 평행이동하면 겹치고, 보기 ㄷ을 h(초록색)로 두면 h=-1-3/(x-2)로 계수가 -3이어서 대칭이동과 평행이동으로 겹친다. ㄴ(계수 1)과 ㄹ(계수 -2)은 계수의 절댓값이 3이 아니어서 겹치지 않는다. 따라서 답은 ③이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 14,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "유리함수 $y=\\frac{2x+a}{x+b}$의 그래프가 점 $(3, 5)$를 지나고, 직선 $y=x$에 대하여 대칭일 때, $a+b$의 값은? (단, $a, b$는 상수이다.) [4.3점]",
    "choices": [
      "$-11$",
      "$-9$",
      "$-7$",
      "$-5$",
      "$-3$"
    ],
    "answer": "⑤",
    "solution": "유리함수 $y=\\dfrac{2x+a}{x+b}$의 그래프가 직선 $y=x$에 대하여 대칭이므로 두 점근선의 교점 $(-b, 2)$가 직선 $y=x$ 위에 있어야 한다.\n\n따라서\n$-b=2$\n$b=-2$\n이다.\n\n또한 그래프가 점 $(3, 5)$를 지나므로 $x=3$, $y=5$를 대입하면\n$5=\\dfrac{2 \\times 3+a}{3-2}$\n$5=6+a$\n$a=-1$\n이다.\n\n따라서 $a+b=-1+(-2)=-3$이므로 정답은 ⑤이다.",
    "score": 4.3,
    "points": 4.3,
    "sourceQid": 14,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q14-solution.svg",
    "solutionImageAlt": "해설 그림: 두 가지로 이루어진 유리함수 그래프와 점선 직선 y=x가 있고, 점근선의 교점 C가 직선 위에 있으며 두 점 P, Q를 잇는 점선이 직선과 수직으로 만난다.",
    "solutionImageCaption": "그래프가 직선 y=x에 대하여 대칭이므로 두 점근선의 교점 C(-b,2)가 직선 y=x 위에 있어 b=-2이다. 점 (3,5)를 지나므로 5=(6+a)/(3-2)에서 a=-1이다. 점 P(3,5)와 Q(5,3)은 y=x에 대하여 대칭이다. a+b=-3이다. 따라서 답은 ⑤이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 15,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "아래 그림과 같이 유리함수 $y=\\frac{9}{x}$의 그래프가 직선 $y=-x+m$ ($m>0$)과 두 점 $P, Q$에서 만난다. 삼각형 $OPQ$의 넓이가 $40$일 때, 상수 $m$의 값은? (단, $O$는 원점이다.) [4.8점]",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "④",
    "solution": "두 교점 $P, Q$의 $x$좌표를 $u, v$라 하면 $u, v$는 방정식\n$\\dfrac{9}{x}=-x+m$\n즉,\n$x^2-mx+9=0$\n의 두 근이므로\n$u+v=m$, $uv=9$\n이다.\n\n두 점 $P(u, m-u)$, $Q(v, m-v)$와 원점 $O$를 꼭짓점으로 하는 삼각형 $OPQ$의 넓이는\n$\\dfrac{1}{2}|u(m-v)-v(m-u)|=\\dfrac{1}{2}m|u-v|$\n이다.\n\n넓이가 $40$이므로\n$\\dfrac{1}{2}m|u-v|=40$\n$m|u-v|=80$\n이다.\n\n양변을 제곱하면\n$m^2(u-v)^2=6400$\n이고, $(u-v)^2=(u+v)^2-4uv=m^2-36$이므로\n$m^2(m^2-36)=6400$\n$m^4-36m^2-6400=0$\n$(m^2-100)(m^2+64)=0$\n이다.\n\n$m>0$이므로 $m^2=100$에서 $m=10$이다.\n(이때 판별식 $m^2-36=64>0$이므로 서로 다른 두 점에서 만난다.)\n\n따라서 정답은 ④이다.",
    "score": 4.8,
    "points": 4.8,
    "sourceQid": 15,
    "variationType": "STRICT_VARIANT",
    "image": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q15.svg",
    "imageSize": "full",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q15-solution.svg",
    "solutionImageAlt": "해설 그림: 제1사분면에서 반비례 곡선과 오른쪽 아래로 내려가는 직선이 두 점 P, Q에서 만나고, 원점 O와 P, Q를 꼭짓점으로 하는 삼각형이 색칠되어 있다.",
    "solutionImageCaption": "교점의 x좌표 u, v는 x²-mx+9=0의 두 근이므로 u+v=m, uv=9이고 삼각형 OPQ의 넓이는 (1/2)m|u-v|이다. 넓이가 40이므로 m²(m²-36)=6400에서 m²=100, m=10이다. 이때 교점은 P(1,9), Q(9,1)이다. 따라서 답은 ④이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 16,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\frac{2x+1}{x-2}$에 대하여 $f(f(x))=x^2+2x-6$을 만족하는 실수 $x$의 값들의 합은? [4.7점]",
    "choices": [
      "$-3$",
      "$-1$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "①",
    "solution": "함수 $f(x)=\\dfrac{2x+1}{x-2}$의 정의역은 $x \\ne 2$인 실수 전체이다.\n$x \\ne 2$일 때 $f(f(x))$를 구하면\n$f(f(x))=\\dfrac{2 \\cdot \\dfrac{2x+1}{x-2}+1}{\\dfrac{2x+1}{x-2}-2}$\n$=\\dfrac{2(2x+1)+(x-2)}{(2x+1)-2(x-2)}$\n$=\\dfrac{5x}{5}=x$\n이다.\n(이때 $\\dfrac{2x+1}{x-2}=2$를 만족하는 $x$는 없으므로 $x \\ne 2$인 모든 $x$에서 $f(f(x))$가 정의된다.)\n\n따라서 주어진 방정식은\n$x=x^2+2x-6$\n$x^2+x-6=0$\n$(x-2)(x+3)=0$\n이므로 $x=2$ 또는 $x=-3$이다.\n\n그런데 $x=2$는 원래 함수 $f(x)$의 정의역에서 제외되므로 조건을 만족하는 실수는 $x=-3$뿐이다.\n\n따라서 구하는 합은 $-3$이므로 정답은 ①이다.",
    "score": 4.7,
    "points": 4.7,
    "sourceQid": 16,
    "variationType": "STRICT_VARIANT"
  },
  {
    "id": 17,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "함수 $y=\\sqrt{4-x}$와 $y=-x+k$의 그래프의 교점의 개수가 $2$개가 되도록 하는 상수 $k$의 값의 범위는? [4.9점]",
    "choices": [
      "$4 < k \\le \\frac{17}{4}$",
      "$4 \\le k < \\frac{17}{4}$",
      "$k < \\frac{17}{4}$",
      "$k \\ge 4$",
      "$4 < k < \\frac{17}{4}$"
    ],
    "answer": "②",
    "solution": "$t=\\sqrt{4-x}$라 놓으면 $t \\ge 0$이고 $x=4-t^2$이다.\n교점에서 $t=-x+k$이므로\n$t=-(4-t^2)+k$\n$t^2-t+k-4=0$\n이다.\n\n서로 다른 두 교점을 가지려면 이 이차방정식이 $t \\ge 0$인 서로 다른 두 실근을 가져야 한다.\n먼저 판별식이 양수여야 하므로\n$D=(-1)^2-4(k-4)=17-4k > 0$\n$k < \\dfrac{17}{4}$\n이다.\n\n또한 두 근의 합이 $1>0$이므로 두 근이 모두 $0$ 이상이려면 두 근의 곱이 $0$ 이상이어야 한다.\n$k-4 \\ge 0$\n$k \\ge 4$\n이다.\n\n따라서 구하는 $k$의 값의 범위는 $4 \\le k < \\dfrac{17}{4}$이므로 정답은 ②이다.",
    "score": 4.9,
    "points": 4.9,
    "sourceQid": 17,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q17-solution.svg",
    "solutionImageAlt": "해설 그림: t=√(4-x)로 놓으면 t²-t+k-4=0이 t≥0인 서로 다른 두 근을 가져야 한다. k=4이면 직선이 곡선의 끝점 (4,0)과 점 (3,1)에서 만나 두 점이고, k=17/4이면 점 (15/4,1/2)에서 접해 한 점이다. 따라서 4≤k<17/4이다. 따라서 답은 ②이다.",
    "solutionImageCaption": "t=√(4-x)로 놓으면 t²-t+k-4=0이 t≥0인 서로 다른 두 근을 가져야 한다. k=4이면 직선이 곡선의 끝점 (4,0)과 점 (3,1)에서 만나 두 점이고, k=17/4이면 점 (15/4,1/2)에서 접해 한 점이다. 따라서 4≤k<17/4이다. 따라서 답은 ②이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 18,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "정의역이 $\\{x|0 \\le x \\le 2\\}$인 함수 $y=f(x)$의 그래프가 오른쪽 그림과 같을 때, 방정식 $2f(f(x))=-f(x)+2$를 만족하는 모든 실근의 합은? [5.2점]",
    "choices": [
      "$2$",
      "$\\frac{7}{3}$",
      "$\\frac{8}{3}$",
      "$3$",
      "$5$"
    ],
    "answer": "③",
    "solution": "그래프에서 함수 $f(x)$의 식은\n$f(x)=\\begin{cases} -2x+2 & (0 \\le x \\le 1) \\\\ x-1 & (1 \\le x \\le 2) \\end{cases}$\n이다.\n\n$u=f(x)$라 놓으면 $0 \\le u \\le 2$이고, 주어진 방정식은\n$2f(u)=-u+2$\n이다.\n\n$0 \\le u \\le 1$일 때\n$2(-2u+2)=-u+2$\n$-4u+4=-u+2$\n$3u=2$\n$u=\\dfrac{2}{3}$\n이고, 이는 $0 \\le u \\le 1$을 만족한다.\n\n$1 \\le u \\le 2$일 때\n$2(u-1)=-u+2$\n$2u-2=-u+2$\n$3u=4$\n$u=\\dfrac{4}{3}$\n이고, 이는 $1 \\le u \\le 2$를 만족한다.\n\n이제 $f(x)=\\dfrac{2}{3}$ 또는 $f(x)=\\dfrac{4}{3}$을 만족하는 $x$를 구한다.\n\n$f(x)=\\dfrac{2}{3}$일 때,\n$0 \\le x \\le 1$에서는 $-2x+2=\\dfrac{2}{3}$에서 $x=\\dfrac{2}{3}$이고,\n$1 \\le x \\le 2$에서는 $x-1=\\dfrac{2}{3}$에서 $x=\\dfrac{5}{3}$이다.\n\n$f(x)=\\dfrac{4}{3}$일 때,\n$0 \\le x \\le 1$에서는 $-2x+2=\\dfrac{4}{3}$에서 $x=\\dfrac{1}{3}$이고,\n$1 \\le x \\le 2$에서는 $x-1 \\le 1 < \\dfrac{4}{3}$이므로 해가 없다.\n\n따라서 모든 실근의 합은\n$\\dfrac{2}{3}+\\dfrac{5}{3}+\\dfrac{1}{3}=\\dfrac{8}{3}$\n이므로 정답은 ③이다.",
    "score": 5.2,
    "points": 5.2,
    "sourceQid": 18,
    "variationType": "STRICT_VARIANT",
    "image": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q18.svg",
    "imageSize": "full",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q18-solution.svg",
    "solutionImageAlt": "해설 그림: u=f(x)로 놓으면 2f(u)=-u+2이고, f(u)와 초록색 직선 y=(-u+2)/2의 교점에서 u=2/3, 4/3이다. 점선 y=2/3, y=4/3과 꺾은선의 교점에서 f(x)=2/3인 x는 2/3, 5/3이고 f(x)=4/3인 x는 1/3뿐이다. 모든 실근의 합은 2/3+5/3+1/3=8/3이다. 따라서 답은 ③이다.",
    "solutionImageCaption": "u=f(x)로 놓으면 2f(u)=-u+2이고, f(u)와 초록색 직선 y=(-u+2)/2의 교점에서 u=2/3, 4/3이다. 점선 y=2/3, y=4/3과 꺾은선의 교점에서 f(x)=2/3인 x는 2/3, 5/3이고 f(x)=4/3인 x는 1/3뿐이다. 모든 실근의 합은 2/3+5/3+1/3=8/3이다. 따라서 답은 ③이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 19,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "content": "[서술형 1] 함수 $f(x)$가<br>$$f(x)=\\begin{cases} x^2-4x+7 & (x \\ge 2) \\\\ -x^2+4x-1 & (x < 2) \\end{cases}$$<br>일 때, 임의의 실수 $x$에 대하여 $(g \\circ f)(x)=x$를 만족시키는 함수 $g(x)$가 존재한다. $(g \\circ g)(a)=1$일 때, 상수 $a$의 값을 구하는 과정을 서술하시오. [5점]",
    "choices": [],
    "answer": "3",
    "solution": "$x \\ge 2$일 때 $f(x)=(x-2)^2+3$이므로 이 구간에서 증가하고 치역은 $[3, \\infty)$이다.\n$x < 2$일 때 $f(x)=-(x-2)^2+3$이므로 이 구간에서 증가하고 치역은 $(-\\infty, 3)$이다.\n두 구간의 치역이 겹치지 않고 합집합이 실수 전체의 집합이므로 $f$는 일대일대응이다.\n\n임의의 실수 $x$에 대하여 $(g \\circ f)(x)=x$이므로 $g=f^{-1}$이다.\n따라서 $(g \\circ g)(a)=1$의 양변에 $f$를 두 번 적용하면\n$a=(f \\circ f)(1)$\n이다.\n\n$1 < 2$이므로\n$f(1)=-1^2+4 \\times 1-1=2$\n이다.\n$2 \\ge 2$이므로\n$f(2)=2^2-4 \\times 2+7=3$\n이다.\n\n따라서 $a=3$이다.",
    "score": 5,
    "points": 5,
    "sourceQid": 19,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q19-solution.svg",
    "solutionImageAlt": "해설 그림: x≥2에서 f(x)=(x-2)²+3은 증가하고 x<2에서 f(x)=-(x-2)²+3도 증가하며 치역이 겹치지 않아 f는 일대일대응이므로 g=f^{-1}이다. (g∘g)(a)=1에서 a=(f∘f)(1)이다. 직선 y=x를 이용한 점선 계단에서 보듯 f(1)=2, f(2)=3이므로 a=3이다.",
    "solutionImageCaption": "x≥2에서 f(x)=(x-2)²+3은 증가하고 x<2에서 f(x)=-(x-2)²+3도 증가하며 치역이 겹치지 않아 f는 일대일대응이므로 g=f^{-1}이다. (g∘g)(a)=1에서 a=(f∘f)(1)이다. 직선 y=x를 이용한 점선 계단에서 보듯 f(1)=2, f(2)=3이므로 a=3이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 20,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "content": "[서술형 2] 두 집합 $X=\\{x|x \\ge -3\\}, Y=\\{y|y \\le 2\\}$에 대하여 $X$에서 $Y$로의 함수 $f(x)=-\\sqrt{ax+b}+c$가 제 $1, 2, 4$ 사분면만을 지나도록 하는 상수 $a, b, c$에 대하여 이를 만족하는 순서쌍 $(a, b, c)$를 모두 구하는 과정을 서술하시오. (단, $-10 \\le a, b, c \\le 10$인 정수) [7점]",
    "choices": [],
    "answer": "(1,3,2), (1,4,3), (1,5,3), (1,6,3), (1,7,3), (1,7,4), (1,8,3), (1,8,4), (1,9,4), (1,10,4), (2,7,3), (2,8,3), (2,10,4)",
    "solution": "정의역이 $x \\ge -3$이므로 모든 $x \\ge -3$에서 $ax+b \\ge 0$이어야 한다. 따라서 $a \\ge 0$이고 $-3a+b \\ge 0$, 즉 $b \\ge 3a$이다.\n$a=0$이면 상수함수가 되어 세 개의 사분면을 지날 수 없으므로 $a \\ge 1$이고 $f(x)$는 감소한다.\n\n$X$에서 $Y=\\{y|y \\le 2\\}$로의 함수가 되려면 최댓값 $f(-3)$이 $2$ 이하여야 하므로\n$-\\sqrt{b-3a}+c \\le 2$\n$c \\le 2+\\sqrt{b-3a}$\n이다.\n\n그래프가 제$1, 2, 4$사분면만 지나려면 $x<0$에서 $y>0$이어야 하고 $x>0$에서 $y>0$인 부분과 $y<0$인 부분이 모두 나타나야 한다. $f(x)$는 감소하고 $x \\to \\infty$일 때 $f(x) \\to -\\infty$이므로 $y$절편 $f(0)$이 양수이면 조건을 만족한다. 따라서\n$-\\sqrt{b}+c > 0$\n$c > \\sqrt{b}$\n이다.\n\n$a \\ge 1$, $3a \\le b \\le 10$이므로 $a=1, 2, 3$인 경우로 나눈다.\n\n(i) $a=1$일 때, $3 \\le b \\le 10$이고 $\\sqrt{b} < c \\le 2+\\sqrt{b-3}$이다.\n$b=3$: $\\sqrt{3} < c \\le 2$에서 $c=2$\n$b=4$: $2 < c \\le 3$에서 $c=3$\n$b=5$: $\\sqrt{5} < c \\le 2+\\sqrt{2}$에서 $c=3$\n$b=6$: $\\sqrt{6} < c \\le 2+\\sqrt{3}$에서 $c=3$\n$b=7$: $\\sqrt{7} < c \\le 4$에서 $c=3, 4$\n$b=8$: $\\sqrt{8} < c \\le 2+\\sqrt{5}$에서 $c=3, 4$\n$b=9$: $3 < c \\le 2+\\sqrt{6}$에서 $c=4$\n$b=10$: $\\sqrt{10} < c \\le 2+\\sqrt{7}$에서 $c=4$\n따라서 $10$개이다.\n\n(ii) $a=2$일 때, $6 \\le b \\le 10$이고 $\\sqrt{b} < c \\le 2+\\sqrt{b-6}$이다.\n$b=6$: $\\sqrt{6} < c \\le 2$이므로 없다.\n$b=7$: $\\sqrt{7} < c \\le 3$에서 $c=3$\n$b=8$: $\\sqrt{8} < c \\le 2+\\sqrt{2}$에서 $c=3$\n$b=9$: $3 < c \\le 2+\\sqrt{3}$이므로 없다.\n$b=10$: $\\sqrt{10} < c \\le 4$에서 $c=4$\n따라서 $3$개이다.\n\n(iii) $a=3$일 때, $9 \\le b \\le 10$이고 $\\sqrt{b} < c \\le 2+\\sqrt{b-9}$이다.\n$b=9$: $3 < c \\le 2$이므로 없다.\n$b=10$: $\\sqrt{10} < c \\le 3$이므로 없다.\n\n따라서 구하는 순서쌍은\n$(1,3,2), (1,4,3), (1,5,3), (1,6,3), (1,7,3), (1,7,4), (1,8,3), (1,8,4), (1,9,4), (1,10,4), (2,7,3), (2,8,3), (2,10,4)$이다.",
    "score": 7,
    "points": 7,
    "sourceQid": 20,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q20-solution.svg",
    "solutionImageAlt": "해설 그림: 예: (a,b,c)=(1,3,2)이면 f(x)=-√(x+3)+2의 그래프는 시작점 (-3,2)에서 출발하여 y축의 양수 부분에서 만나고 x축을 (1,0)에서 지나 제1, 2, 4사분면만 지난다. 점선 x=-3의 오른쪽이 정의역이고 점선 y=2의 아래쪽이 공역이다. 조건을 만족하는 순서쌍은 모두 13개이다.",
    "solutionImageCaption": "예: (a,b,c)=(1,3,2)이면 f(x)=-√(x+3)+2의 그래프는 시작점 (-3,2)에서 출발하여 y축의 양수 부분에서 만나고 x축을 (1,0)에서 지나 제1, 2, 4사분면만 지난다. 점선 x=-3의 오른쪽이 정의역이고 점선 y=2의 아래쪽이 공역이다. 조건을 만족하는 순서쌍은 모두 13개이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 21,
    "standardCourse": "공통수학2",
    "curriculum": "2022",
    "curriculumKey": "2022",
    "courseKey": "공통수학2",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "content": "[서술형 3] 함수 $f:(-\\infty, 2]\\to[1, \\infty)$를 $f(x)=(x-2)^2+1$로 정의하자. 방정식 $f^{-1}(x)=4-x$를 만족하는 모든 실수 $x$를 구하는 과정을 서술하시오. [8점]",
    "choices": [],
    "answer": "$\\dfrac{5+\\sqrt{5}}{2}$",
    "solution": "$x \\le 2$에서 $x-2 \\le 0$이므로 $y=(x-2)^2+1$을 $x$에 대하여 풀면\n$(x-2)^2=y-1$\n$x-2=-\\sqrt{y-1}$\n$x=2-\\sqrt{y-1}$\n이다.\n따라서 역함수는\n$f^{-1}(x)=2-\\sqrt{x-1} \\quad (x \\ge 1)$\n이다.\n\n$f^{-1}(x)=4-x$에 대입하면\n$2-\\sqrt{x-1}=4-x$\n$\\sqrt{x-1}=x-2$\n이다.\n\n제곱하기 전에 양변의 부호를 확인하면 왼쪽이 $0$ 이상이므로 $x-2 \\ge 0$, 즉 $x \\ge 2$여야 한다.\n\n양변을 제곱하면\n$x-1=(x-2)^2$\n$x-1=x^2-4x+4$\n$x^2-5x+5=0$\n이므로\n$x=\\dfrac{5 \\pm \\sqrt{5}}{2}$\n이다.\n\n$\\dfrac{5-\\sqrt{5}}{2} < 2$이므로 조건 $x \\ge 2$를 만족하지 않아 제외한다.\n반면 $x=\\dfrac{5+\\sqrt{5}}{2} > 2$는 $x \\ge 1$과 $x \\ge 2$를 모두 만족하고 양변이 모두 $0$ 이상이므로 원래 방정식을 만족한다.\n\n따라서 구하는 값은 $\\dfrac{5+\\sqrt{5}}{2}$이다.",
    "score": 8,
    "points": 8,
    "sourceQid": 21,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사2/q21-solution.svg",
    "solutionImageAlt": "해설 그림: 역함수는 f^{-1}(x)=2-√(x-1) (x≥1)이다. 이를 4-x와 같다고 하면 √(x-1)=x-2이고, 제곱하면 x²-5x+5=0이다. x≥2를 만족하는 x=(5+√5)/2만 가능하므로 그래프에서도 곡선 y=2-√(x-1)과 직선 y=-x+4가 한 점에서 만난다. 구하는 값은 (5+√5)/2이다.",
    "solutionImageCaption": "역함수는 f^{-1}(x)=2-√(x-1) (x≥1)이다. 이를 4-x와 같다고 하면 √(x-1)=x-2이고, 제곱하면 x²-5x+5=0이다. x≥2를 만족하는 x=(5+√5)/2만 가능하므로 그래프에서도 곡선 y=2-√(x-1)과 직선 y=-x+4가 한 점에서 만난다. 구하는 값은 (5+√5)/2이다.",
    "solutionImageSize": "full"
  }
];
