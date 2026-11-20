window.examTitle = "25_순천여고_2학기_기말_고1_공통수학2_유사3";
window.examDisplayTitle = "25_순천여고_2학기_기말_고1_공통수학2_유사3";

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
    "content": "전체집합 $U$가 자연수 전체의 집합일 때, 조건<br>$p: x^2-8x+12 \\ge 0$<br>에 대하여 $\\sim p$의 진리집합의 원소의 합은? [3.8점]",
    "choices": [
      "$7$",
      "$9$",
      "$10$",
      "$12$",
      "$14$"
    ],
    "answer": "④",
    "solution": "조건 $p$를 부정하면\n$\\sim p: x^2-8x+12 < 0$\n이다.\n\n좌변을 인수분해하여 이차부등식을 풀면\n$(x-2)(x-6) < 0$\n$2 < x < 6$\n이다.\n\n전체집합 $U$가 자연수 전체의 집합이므로 $\\sim p$의 진리집합은 $\\{3, 4, 5\\}$이다.\n따라서 진리집합의 원소의 합은\n$3+4+5=12$\n이다.\n\n따라서 정답은 ④이다.",
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
    "content": "다음 <보기>에서 참인 명제인 것만을 모두 고른 것은? [4.1점]<br><br><div style=\"border: 1px solid #000; padding: 10px; margin: 10px 0;\"><b>< 보 기 ></b><br>ㄱ. 두 무리수 $a, b$에 대하여 $a+b$는 무리수이다.<br>ㄴ. $(1+i)^2+(1-i)^2=4i$<br>ㄷ. 모든 실수 $x$에 대하여 $x^2-4x+5 > 0$이다.<br>ㄹ. 어떤 자연수 $n$에 대하여 $n^2-3n \\le 0$이다.</div>",
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄹ",
      "ㄴ, ㄷ",
      "ㄷ, ㄹ"
    ],
    "answer": "⑤",
    "solution": "각 문장의 참·거짓을 차례로 판정한다.\n\nㄱ. $a=\\sqrt{3}$, $b=-\\sqrt{3}$은 모두 무리수이지만\n$a+b=0$\n으로 유리수이므로 거짓이다.\n\nㄴ. 좌변을 전개하여 계산하면\n$(1+i)^2+(1-i)^2=(1+2i-1)+(1-2i-1)$\n$=2i-2i=0$\n이므로 거짓이다.\n\nㄷ. 이차식을 완전제곱식으로 변형하면\n$x^2-4x+5=(x-2)^2+1$\n이다.\n모든 실수 $x$에 대하여 $(x-2)^2 \\ge 0$이므로 $(x-2)^2+1 \\ge 1 > 0$이 항상 성립한다. 따라서 참이다.\n\nㄹ. $n=1$을 대입하면\n$1^2-3\\times 1=-2 \\le 0$\n이므로 부등식을 만족하는 자연수 $n$이 존재한다. 따라서 참이다.\n\n참인 명제는 ㄷ, ㄹ이므로 정답은 ⑤이다.",
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
    "content": "다음은 명제 '자연수 $n$에 대하여 $n^2+2n$이 $4$의 배수이면 $n$은 짝수이다.'가 참임을 증명하는 과정이다.<br><br><div style=\"border: 1px solid #000; padding: 10px; margin: 10px 0;\">주어진 명제의 대우 '자연수 $n$에 대하여 $n$이 [ ① ]이면 $n^2+2n$은 $4$의 배수가 아니다.'를 증명하면 된다.<br>$n$이 [ ① ]이면 $n=$ [ ② ] ($k$는 $0$ 또는 자연수)로 나타낼 수 있다.<br>이때<br>$n^2+2n=($ [ ② ] $)^2+2($ [ ② ] $)=4k^2+$ [ ③ ] $+3=4($ [ ④ ] $)+$ [ ⑤ ]<br>이므로 $n^2+2n$을 $4$로 나눈 나머지가 [ ⑤ ]이어서 $n^2+2n$은 $4$의 배수가 아니다.<br>따라서 주어진 명제의 대우가 참이므로 원 명제가 참이다.</div><br>위의 증명 과정에서 빈칸에 들어갈 말이나 식으로 옳게 짝지어지지 않은 것은? [4.2점]",
    "choices": [
      "홀수",
      "$2k+1$",
      "$8k$",
      "$k^2+k$",
      "$3$"
    ],
    "answer": "④",
    "solution": "주어진 명제의 대우에서 $n$이 짝수가 아니어야 하므로 ①에는 '홀수'가 들어간다.\n$n$이 홀수이므로 $k$가 $0$ 또는 자연수일 때 $n=2k+1$로 나타낼 수 있다. 따라서 ②에는 $2k+1$이 들어간다.\n\n$n=2k+1$을 $n^2+2n$에 대입하여 전개하면\n$n^2+2n=(2k+1)^2+2(2k+1)$\n$=4k^2+4k+1+4k+2$\n$=4k^2+8k+3$\n$=4(k^2+2k)+3$\n이다.\n\n따라서 ③에는 $8k$, ④에는 $k^2+2k$, ⑤에는 $3$이 들어가야 한다.\n보기의 ④는 $k^2+k$이므로 옳게 짝지어지지 않은 것은 ④이다.\n\n따라서 정답은 ④이다.",
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
    "content": "두 실수 $x, y$에 대하여 세 조건 $p, q, r$가<br>$$p: x > 0 \\text{ 이고 } y > 0$$<br>$$q: x+y > 0 \\text{ 이고 } xy > 0$$<br>$$r: x+y > 0 \\text{ 또는 } xy > 0$$<br>일 때, <보기>에서 옳은 것만을 있는 대로 고른 것은? [4.7점]<br><br><div style=\"border: 1px solid #000; padding: 10px; margin: 10px 0;\"><b>< 보 기 ></b><br>ㄱ. $p$는 $q$이기 위한 필요충분조건이다.<br>ㄴ. 명제 $q \\to r$의 역은 참이다.<br>ㄷ. 명제 $\\sim r \\to \\sim p$는 참이다.<br>ㄹ. $r$는 $p$이기 위한 필요조건이지만 충분조건은 아니다.</div>",
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄹ",
      "ㄱ, ㄴ, ㄹ",
      "ㄱ, ㄷ, ㄹ"
    ],
    "answer": "⑤",
    "solution": "세 조건 $p, q, r$의 진리집합을 각각 $P, Q, R$이라 하자.\n\n$q$에서 $xy > 0$이므로 $x, y$는 같은 부호이고, $x+y > 0$이므로 $x > 0$이고 $y > 0$이다.\n따라서 $P=Q$이다.\n\n$p$이면 $x+y > 0$이므로 $r$가 성립한다. 즉 $P \\subset R$이다.\n한편 $x=2$, $y=-1$일 때 $x+y=1 > 0$이므로 $(2, -1) \\in R$이지만 $(2, -1) \\notin P$이다.\n결국 $P=Q \\subsetneq R$이다.\n\nㄱ. $P=Q$이므로 $p$는 $q$이기 위한 필요충분조건이다.\n\nㄴ. 명제 $q \\to r$의 역은 $r \\to q$이다. $R \\not\\subset Q$이므로 거짓이다.\n\nㄷ. 명제 $\\sim r \\to \\sim p$의 대우는 $p \\to r$이다. $P \\subset R$이므로 참이다.\n\nㄹ. $P \\subset R$이고 $R \\not\\subset P$이므로 $r$는 $p$이기 위한 필요조건이지만 충분조건은 아니다.\n\n옳은 것은 ㄱ, ㄷ, ㄹ이므로 정답은 ⑤이다.",
    "score": 4.7,
    "points": 4.7,
    "sourceQid": 4,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q4-solution.svg",
    "solutionImageAlt": "해설 그림: q에서 x와 y는 같은 부호이고 x+y>0이므로 P=Q이다. p이면 r이므로 P⊂R이지만 (2,-1)은 R의 원소이면서 P의 원소가 아니므로 P=Q⊊R이다. 따라서 ㄱ, ㄷ, ㄹ이 옳고 답은 ⑤이다.",
    "solutionImageCaption": "q에서 x와 y는 같은 부호이고 x+y>0이므로 P=Q이다. p이면 r이므로 P⊂R이지만 (2,-1)은 R의 원소이면서 P의 원소가 아니므로 P=Q⊊R이다. 따라서 ㄱ, ㄷ, ㄹ이 옳고 답은 ⑤이다.",
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
    "content": "전체집합 $U$에 대하여 세 조건 $p, q, r$의 진리집합을 각각 $P, Q, R$이라 하자. 세 집합이 다음 조건을 만족할 때, 항상 참인 명제는? [4.6점]<br><br><div style=\"border: 1px solid #000; padding: 10px; margin: 10px 0;\">(가) $P \\cup Q = Q$<br>(나) $Q \\cap R^c = Q$</div>",
    "choices": [
      "$q \\to p$",
      "$p \\to r$",
      "$r \\to q$",
      "$\\sim p \\to r$",
      "$p \\to \\sim r$"
    ],
    "answer": "⑤",
    "solution": "주어진 집합 조건을 포함관계로 바꾼다.\n\n(가) $P \\cup Q = Q$에서 $P \\subset Q$이다.\n(나) $Q \\cap R^c = Q$에서 $Q \\subset R^c$이다.\n\n따라서 $P \\subset Q \\subset R^c$이므로 $P \\subset R^c$이다.\n그러므로 명제 $p \\to \\sim r$는 항상 참이다.\n\n나머지 명제가 항상 참이 아님을 확인하기 위해 $U=\\{1, 2, 3, 4\\}$, $P=\\{1\\}$, $Q=\\{1, 2\\}$, $R=\\{3\\}$이라 하자.\n이때 (가)와 (나)를 모두 만족한다.\n\n① $2 \\in Q$이지만 $2 \\notin P$이므로 $q \\to p$는 거짓이다.\n② $1 \\in P$이지만 $1 \\notin R$이므로 $p \\to r$는 거짓이다.\n③ $3 \\in R$이지만 $3 \\notin Q$이므로 $r \\to q$는 거짓이다.\n④ $2 \\in P^c$이지만 $2 \\notin R$이므로 $\\sim p \\to r$는 거짓이다.\n\n따라서 항상 참인 명제는 ⑤이므로 정답은 ⑤이다.",
    "score": 4.6,
    "points": 4.6,
    "sourceQid": 5,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q5-solution.svg",
    "solutionImageAlt": "해설 그림: (가)에서 P⊂Q, (나)에서 Q⊂R의 여집합이므로 P⊂Q⊂R의 여집합이고, 따라서 P와 R는 공통 원소가 없다. 예: U={1,2,3,4}, P={1}, Q={1,2}, R={3}이면 P와 R는 서로 떨어져 있고 P는 R의 여집합에 포함되므로 p→∼r가 항상 참이다. 따라서 답은 ⑤이다.",
    "solutionImageCaption": "(가)에서 P⊂Q, (나)에서 Q⊂R의 여집합이므로 P⊂Q⊂R의 여집합이고, 따라서 P와 R는 공통 원소가 없다. 예: U={1,2,3,4}, P={1}, Q={1,2}, R={3}이면 P와 R는 서로 떨어져 있고 P는 R의 여집합에 포함되므로 p→∼r가 항상 참이다. 따라서 답은 ⑤이다.",
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
    "content": "두 양수 $x, y$에 대하여 식<br>$$x^2+4y+\\dfrac{36}{2x+4y}$$<br>가 $x=\\alpha, y=\\beta$일 때 최솟값 $m$을 갖는다. 이때 $\\alpha\\beta+m$의 값은? [4.9점]",
    "choices": [
      "$12$",
      "$13$",
      "$14$",
      "$16$",
      "$18$"
    ],
    "answer": "①",
    "solution": "$s=2x+4y$라 놓으면 $x, y$가 양수이므로 $s > 0$이고 $4y=s-2x$이다.\n이를 주어진 식에 대입하면\n$x^2+4y+\\dfrac{36}{2x+4y}=x^2+s-2x+\\dfrac{36}{s}$\n$=(x^2-2x)+\\left(s+\\dfrac{36}{s}\\right)$\n$=(x-1)^2-1+\\left(s+\\dfrac{36}{s}\\right)$\n이다.\n\n$(x-1)^2 \\ge 0$이고 등호는 $x=1$일 때 성립한다.\n또 $s > 0$이므로 산술평균과 기하평균의 관계에 의하여\n$s+\\dfrac{36}{s} \\ge 2\\sqrt{s\\cdot\\dfrac{36}{s}}=12$\n이고 등호는 $s=\\dfrac{36}{s}$, 즉 $s=6$일 때 성립한다.\n\n$x=1$, $s=6$일 때 $2(1)+4y=6$에서 $y=1 > 0$이므로 두 등호가 동시에 성립한다.\n따라서 최솟값은 $m=-1+12=11$이고 $\\alpha=1$, $\\beta=1$이다.\n\n그러므로 구하는 값은\n$\\alpha\\beta+m=1\\times 1+11=12$\n이다.\n\n따라서 정답은 ①이다.",
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
    "content": "다음 중 실수 전체의 집합 $R$에서 $R$로의 함수의 그래프 중에서 역함수가 존재하는 것은? [4.1점]",
    "choices": [
      "①",
      "②",
      "③",
      "④",
      "⑤"
    ],
    "answer": "③",
    "solution": "실수 전체의 집합 $R$에서 $R$로의 함수가 역함수를 가지려면 일대일대응이어야 한다.\n\n① $x < 0$에서 그래프가 없으므로 정의역이 실수 전체가 아니다.\n\n② 같은 수평선과 세 점에서 만나는 경우가 있으므로 일대일함수가 아니다.\n\n③ 모든 실수 $x$에 대하여 정의되고, 모든 수평선과 정확히 한 점에서 만나므로 일대일대응이다. 따라서 역함수가 존재한다.\n\n④ $-1 \\le y < 1$인 수평선과 만나지 않으므로 치역이 공역 $R$과 같지 않아 일대일대응이 아니다.\n\n⑤ 수평인 구간이 있어 서로 다른 $x$에 같은 함숫값이 대응하므로 일대일함수가 아니다.\n\n따라서 정답은 ③이다.",
    "score": 4.1,
    "points": 4.1,
    "sourceQid": 7,
    "variationType": "STRICT_VARIANT",
    "image": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q7.svg",
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
    "content": "일차함수 $f$가 모든 실수 $x$에 대하여 $f(2x-3)=4x+1$을 만족시킬 때, $f^{-1}(5)$의 값은? [3.9점]",
    "choices": [
      "$-1$",
      "$-2$",
      "$-3$",
      "$-5$",
      "$-7$"
    ],
    "answer": "①",
    "solution": "$f^{-1}(5)=k$라 하면 역함수의 정의에 의하여 $f(k)=5$이다.\n\n주어진 등식 $f(2x-3)=4x+1$에서 우변이 $5$가 되는 $x$의 값을 구하면\n$4x+1=5$\n$4x=4$\n$x=1$\n이다.\n\n등식에 $x=1$을 대입하면\n$f(2\\times 1-3)=4\\times 1+1$\n$f(-1)=5$\n이므로 $f^{-1}(5)=-1$이다.\n\n따라서 정답은 ①이다.",
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
    "content": "집합 $X=\\{1, 2, 3, 4\\}$에 대하여 $X$에서 $X$로의 두 함수 $f, g$가 아래 그림과 같다. $X$에서 $X$로의 함수 $h$가 $h \\circ f = g$를 만족시킬 때, $h(2)+h^{-1}(2)$의 값은? [4.2점]",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "②",
    "solution": "그림의 화살표에서\n$f(1)=4$, $f(2)=1$, $f(3)=2$, $f(4)=3$\n$g(1)=3$, $g(2)=4$, $g(3)=1$, $g(4)=2$\n이다.\n\n조건 $h \\circ f = g$에서 모든 $x \\in X$에 대하여 $h(f(x))=g(x)$가 성립한다.\n\n$x=3$을 대입하면\n$h(f(3))=g(3)$\n$h(2)=1$\n이다.\n\n$x=4$를 대입하면\n$h(f(4))=g(4)$\n$h(3)=2$\n이므로 $h^{-1}(2)=3$이다.\n\n따라서 구하는 값은\n$h(2)+h^{-1}(2)=1+3=4$\n이므로 정답은 ②이다.",
    "score": 4.2,
    "points": 4.2,
    "sourceQid": 9,
    "variationType": "STRICT_VARIANT",
    "image": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q9.svg",
    "imageSize": "full",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q9-solution.svg",
    "solutionImageAlt": "해설 그림: f의 대응(1→4, 2→1, 3→2, 4→3)과 h∘f=g, 즉 h(f(x))=g(x)에서 h(4)=3, h(1)=4, h(2)=1, h(3)=2를 얻는다. h(2)=1이고 h(3)=2이므로 h의 역함수에서 2에 대응하는 값은 3이다. 따라서 h(2)+h⁻¹(2)=1+3=4이고 답은 ②이다.",
    "solutionImageCaption": "f의 대응(1→4, 2→1, 3→2, 4→3)과 h∘f=g, 즉 h(f(x))=g(x)에서 h(4)=3, h(1)=4, h(2)=1, h(3)=2를 얻는다. h(2)=1이고 h(3)=2이므로 h의 역함수에서 2에 대응하는 값은 3이다. 따라서 h(2)+h⁻¹(2)=1+3=4이고 답은 ②이다.",
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
    "content": "일차함수 $f(x)=ax+b$ ($a>0$)에 대하여 $(f\\circ f)(x)=4x+9$일 때, $f(-1)+f^{-1}(-1)$의 값은? (단, $a, b$는 상수이다.) [4.6점]",
    "choices": [
      "$-1$",
      "$-2$",
      "$-4$",
      "$-5$",
      "$-7$"
    ],
    "answer": "①",
    "solution": "$f(x)=ax+b$이므로 합성함수를 구하면\n$(f\\circ f)(x)=f(ax+b)=a(ax+b)+b=a^2x+b(a+1)$\n이다.\n\n$(f\\circ f)(x)=4x+9$가 모든 실수 $x$에 대하여 성립하므로 계수를 비교하면\n$a^2=4$, $b(a+1)=9$\n이다.\n$a > 0$이므로 $a=2$이고, 이를 $b(a+1)=9$에 대입하면 $3b=9$에서 $b=3$이다.\n따라서 $f(x)=2x+3$이다.\n\n$f(-1)=2(-1)+3=1$이다.\n또 $f^{-1}(-1)=k$라 하면 $f(k)=-1$이므로\n$2k+3=-1$\n$2k=-4$\n$k=-2$\n이다.\n\n따라서 구하는 값은\n$f(-1)+f^{-1}(-1)=1+(-2)=-1$\n이므로 정답은 ①이다.",
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
    "content": "정의역이 $\\{x|x \\ge a\\}$인 이차함수 $f(x)=x^2-6x+12$의 역함수를 $g(x)$라 하자. 함수 $g(x)$의 정의역이 $\\{x|x \\ge a+2\\}$일 때, 실수 $a$의 값은? [4.8점]",
    "choices": [
      "$3$",
      "$5$",
      "$7$",
      "$9$",
      "$11$"
    ],
    "answer": "②",
    "solution": "$f(x)=x^2-6x+12=(x-3)^2+3$이므로 그래프는 아래로 볼록하고 꼭짓점은 $(3, 3)$이다.\n\n$x \\ge a$에서 역함수 $g(x)$가 존재하려면 $f$가 $x \\ge a$에서 일대일함수여야 하므로\n$a \\ge 3$\n이어야 한다.\n\n이때 $f$는 $x \\ge a$에서 증가하므로 $f$의 치역은 $\\{y|y \\ge f(a)\\}$이다.\n역함수 $g$의 정의역은 원래 함수 $f$의 치역과 같으므로\n$f(a)=a+2$\n이어야 한다.\n\n$a^2-6a+12=a+2$\n$a^2-7a+10=0$\n$(a-2)(a-5)=0$\n에서 $a=2$ 또는 $a=5$이다.\n\n$a \\ge 3$이어야 하므로 $a=5$이다.\n\n따라서 정답은 ②이다.",
    "score": 4.8,
    "points": 4.8,
    "sourceQid": 11,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q11-solution.svg",
    "solutionImageAlt": "해설 그림: y=x²-6x+12=(x-3)²+3의 꼭짓점은 V(3,3)이므로 역함수가 있으려면 a≥3이다. 역함수의 정의역이 f의 치역이므로 f(a)=a+2이고, 곡선과 직선 y=x+2는 B(2,4)와 A(5,7)에서 만난다. a≥3이므로 a=5이고 답은 ②이다.",
    "solutionImageCaption": "y=x²-6x+12=(x-3)²+3의 꼭짓점은 V(3,3)이므로 역함수가 있으려면 a≥3이다. 역함수의 정의역이 f의 치역이므로 f(a)=a+2이고, 곡선과 직선 y=x+2는 B(2,4)와 A(5,7)에서 만난다. a≥3이므로 a=5이고 답은 ②이다.",
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
    "content": "정의역이 $\\{x|x \\ne -3\\}$이고 치역이 $\\{y|y \\ne 4\\}$인 유리함수 $y=\\dfrac{ax+b}{x+c}$의 그래프가 점 $(-1, 1)$을 지날 때, $a+b+c$의 값은? (단, $a, b, c$는 상수이다.) [4.1점]",
    "choices": [
      "$5$",
      "$7$",
      "$9$",
      "$11$",
      "$13$"
    ],
    "answer": "⑤",
    "solution": "유리함수 $y=\\dfrac{ax+b}{x+c}$의 정의역이 $\\{x|x \\ne -3\\}$이므로 분모 $x+c$가 $x=-3$일 때 $0$이 되어야 한다.\n$-3+c=0$\n$c=3$\n이다.\n\n치역이 $\\{y|y \\ne 4\\}$이므로 수평 점근선은 $y=4$이다.\n따라서 $x$의 계수의 비에서 $a=4$이다.\n\n그래프가 점 $(-1, 1)$을 지나므로 $y=\\dfrac{4x+b}{x+3}$에 $x=-1$, $y=1$을 대입하면\n$1=\\dfrac{4(-1)+b}{-1+3}$\n$1=\\dfrac{b-4}{2}$\n$b-4=2$\n$b=6$\n이다.\n(이때 $y=4-\\dfrac{6}{x+3}$이므로 상수함수가 아닌 유리함수이다.)\n\n따라서 구하는 값은\n$a+b+c=4+6+3=13$\n이므로 정답은 ⑤이다.",
    "score": 4.1,
    "points": 4.1,
    "sourceQid": 12,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q12-solution.svg",
    "solutionImageAlt": "해설 그림: 정의역이 x≠-3이므로 c=3이고, 치역이 y≠4이므로 수평 점근선이 y=4이어서 a=4이다. 곡선이 점 A(-1,1)을 지나므로 1=(b-4)/2에서 b=6이고 곡선은 y=4-6/(x+3)이다. 따라서 a+b+c=4+6+3=13이고 답은 ⑤이다.",
    "solutionImageCaption": "정의역이 x≠-3이므로 c=3이고, 치역이 y≠4이므로 수평 점근선이 y=4이어서 a=4이다. 곡선이 점 A(-1,1)을 지나므로 1=(b-4)/2에서 b=6이고 곡선은 y=4-6/(x+3)이다. 따라서 a+b+c=4+6+3=13이고 답은 ⑤이다.",
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
    "content": "다음 <보기> 중 그 그래프가 함수 $y=\\dfrac{3x-4}{x-2}$의 그래프를 $x$축에 대하여 대칭이동한 후 평행이동하여 겹칠 수 있는 것만을 모두 고른 것은? [4.1점]<br><br><div style=\"border: 1px solid #000; padding: 10px; margin: 10px 0;\"><b>< 보 기 ></b><br>ㄱ. $y=\\dfrac{x-4}{x-2}$<br>ㄴ. $y=\\dfrac{2x}{x+1}$<br>ㄷ. $y=\\dfrac{3x-1}{x-1}$<br>ㄹ. $y=\\dfrac{-x+1}{x+1}$</div>",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄷ, ㄹ",
      "ㄱ, ㄷ, ㄹ"
    ],
    "answer": "②",
    "solution": "주어진 유리함수를 표준형으로 변형하면\n$y=\\dfrac{3x-4}{x-2}=\\dfrac{3(x-2)+2}{x-2}=3+\\dfrac{2}{x-2}$\n이다.\n\n이 그래프를 $x$축에 대하여 대칭이동하면 $y$ 대신 $-y$를 대입하므로\n$-y=3+\\dfrac{2}{x-2}$\n$y=-3-\\dfrac{2}{x-2}$\n이다.\n이를 평행이동하여 겹칠 수 있으려면 표준형 $y=q+\\dfrac{k}{x-p}$로 고쳤을 때 $k=-2$이어야 한다.\n\nㄱ. $y=\\dfrac{x-4}{x-2}=\\dfrac{(x-2)-2}{x-2}=1-\\dfrac{2}{x-2}$이므로 $k=-2$이다. 겹칠 수 있다.\n\nㄴ. $y=\\dfrac{2x}{x+1}=\\dfrac{2(x+1)-2}{x+1}=2-\\dfrac{2}{x+1}$이므로 $k=-2$이다. 겹칠 수 있다.\n\nㄷ. $y=\\dfrac{3x-1}{x-1}=\\dfrac{3(x-1)+2}{x-1}=3+\\dfrac{2}{x-1}$이므로 $k=2$이다. 겹칠 수 없다.\n\nㄹ. $y=\\dfrac{-x+1}{x+1}=\\dfrac{-(x+1)+2}{x+1}=-1+\\dfrac{2}{x+1}$이므로 $k=2$이다. 겹칠 수 없다.\n\n겹칠 수 있는 것은 ㄱ, ㄴ이므로 정답은 ②이다.",
    "score": 4.1,
    "points": 4.1,
    "sourceQid": 13,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q13-solution.svg",
    "solutionImageAlt": "해설 그림: 세 곡선의 점근선은 모두 x=2이고, f는 y=3, g는 y=-3, h는 y=1이다. 파란 곡선 f는 y=(3x-4)/(x-2)=3+2/(x-2)이고, 이를 x축에 대하여 대칭이동하면 y=-3-2/(x-2)이다. 이 곡선 g를 y축 방향으로 4만큼 평행이동하면 ㄱ의 y=1-2/(x-2)(곡선 h, 초록 점선)와 겹치고, ㄴ도 분수식의 분자가 -2이어서 겹친다. ㄷ, ㄹ은 분자가 2여서 겹치지 않으므로 답은 ②이다.",
    "solutionImageCaption": "세 곡선의 점근선은 모두 x=2이고, f는 y=3, g는 y=-3, h는 y=1이다. 파란 곡선 f는 y=(3x-4)/(x-2)=3+2/(x-2)이고, 이를 x축에 대하여 대칭이동하면 y=-3-2/(x-2)이다. 이 곡선 g를 y축 방향으로 4만큼 평행이동하면 ㄱ의 y=1-2/(x-2)(곡선 h, 초록 점선)와 겹치고, ㄴ도 분수식의 분자가 -2이어서 겹친다. ㄷ, ㄹ은 분자가 2여서 겹치지 않으므로 답은 ②이다.",
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
    "content": "유리함수 $f(x)=\\dfrac{ax+b}{x+2}$가 정의역의 모든 원소 $x$에 대하여 $(f\\circ f)(x)=x$를 만족시키고 $f(0)=-1$일 때, $a+b$의 값은? (단, $a, b$는 상수이다.) [4.3점]",
    "choices": [
      "$-4$",
      "$-3$",
      "$0$",
      "$2$",
      "$4$"
    ],
    "answer": "①",
    "solution": "$f(0)=-1$이므로 $x=0$을 대입하면\n$\\dfrac{b}{2}=-1$\n$b=-2$\n이다.\n\n따라서 $f(x)=\\dfrac{ax-2}{x+2}$이다.\n모든 정의역의 원소 $x$에 대하여 $(f\\circ f)(x)=x$이므로 $f$의 역함수는 자기 자신과 같다.\n$y=\\dfrac{ax-2}{x+2}$에서 $x$와 $y$를 서로 바꾸면\n$x=\\dfrac{ay-2}{y+2}$\n$x(y+2)=ay-2$\n$xy+2x=ay-2$\n$y(x-a)=-2x-2$\n$y=\\dfrac{-2x-2}{x-a}$\n이다.\n\n$f(x)=f^{-1}(x)$이므로\n$\\dfrac{ax-2}{x+2}=\\dfrac{-2x-2}{x-a}$\n에서 계수를 비교하면 $a=-2$이다.\n(이때 $f(x)=\\dfrac{-2x-2}{x+2}=-2+\\dfrac{2}{x+2}$이므로 유리함수 조건을 만족한다.)\n\n따라서 구하는 값은\n$a+b=-2+(-2)=-4$\n이므로 정답은 ①이다.",
    "score": 4.3,
    "points": 4.3,
    "sourceQid": 14,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q14-solution.svg",
    "solutionImageAlt": "해설 그림: f(0)=-1에서 b=-2이고, (f∘f)(x)=x이므로 f의 역함수가 f 자신이어서 그래프가 직선 y=x에 대하여 대칭이다. 점근선의 교점 C(-2,-2)가 y=x 위에 있어야 하므로 a=-2이다. 따라서 f(x)=(-2x-2)/(x+2)이고 a+b=-4이므로 답은 ①이다.",
    "solutionImageCaption": "f(0)=-1에서 b=-2이고, (f∘f)(x)=x이므로 f의 역함수가 f 자신이어서 그래프가 직선 y=x에 대하여 대칭이다. 점근선의 교점 C(-2,-2)가 y=x 위에 있어야 하므로 a=-2이다. 따라서 f(x)=(-2x-2)/(x+2)이고 a+b=-4이므로 답은 ①이다.",
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
    "content": "아래 그림과 같이 유리함수 $y=\\dfrac{k}{x}\\,(k>0)$의 그래프가 직선 $y=-x+6$과 두 점 $P, Q$에서 만난다. 선분 $PQ$의 길이가 $2\\sqrt{5}$일 때, 상수 $k$의 값은? [4.8점]",
    "choices": [
      "$\\dfrac{7}{2}$",
      "$\\dfrac{9}{2}$",
      "$\\dfrac{11}{2}$",
      "$\\dfrac{13}{2}$",
      "$\\dfrac{15}{2}$"
    ],
    "answer": "④",
    "solution": "유리함수 $y=\\dfrac{k}{x}$와 직선 $y=-x+6$의 교점 $P, Q$의 $x$좌표를 각각 $u, v$라 하면 $u, v$는 이차방정식\n$\\dfrac{k}{x}=-x+6$\n$x^2-6x+k=0$\n의 두 근이다.\n\n근과 계수의 관계에 의하여\n$u+v=6$, $uv=k$\n이다.\n\n두 점 $P(u, -u+6)$, $Q(v, -v+6)$ 사이의 거리가 $2\\sqrt{5}$이므로\n$\\overline{PQ}=\\sqrt{(u-v)^2+\\{(-u+6)-(-v+6)\\}^2}=\\sqrt{2}|u-v|=2\\sqrt{5}$\n이다.\n양변을 제곱하면\n$2(u-v)^2=20$\n$(u-v)^2=10$\n이다.\n\n곱셈 공식의 변형에 의하여\n$(u-v)^2=(u+v)^2-4uv=36-4k$\n이므로\n$36-4k=10$\n$4k=26$\n$k=\\dfrac{13}{2}$\n이다.\n(이때 판별식 $36-4k=10 > 0$이므로 서로 다른 두 점에서 만난다.)\n\n따라서 정답은 ④이다.",
    "score": 4.8,
    "points": 4.8,
    "sourceQid": 15,
    "variationType": "STRICT_VARIANT",
    "image": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q15.svg",
    "imageSize": "full",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q15-solution.svg",
    "solutionImageAlt": "해설 그림: 두 교점의 x좌표 u, v는 x²-6x+k=0의 두 근이므로 u+v=6, uv=k이다. 점 R을 직각의 꼭짓점으로 하는 직각삼각형 PRQ에서 PQ=√2·|u-v|=2√5이므로 (u-v)²=10이고, 36-4k=10에서 k=13/2이다. 따라서 답은 ④이다.",
    "solutionImageCaption": "두 교점의 x좌표 u, v는 x²-6x+k=0의 두 근이므로 u+v=6, uv=k이다. 점 R을 직각의 꼭짓점으로 하는 직각삼각형 PRQ에서 PQ=√2·|u-v|=2√5이므로 (u-v)²=10이고, 36-4k=10에서 k=13/2이다. 따라서 답은 ④이다.",
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
    "content": "함수 $f(x)=\\dfrac{3x+1}{x-3}$에 대하여 방정식 $f(f(f(x)))=f(x)+x^2-2x-3$을 만족하는 모든 실수 $x$의 값들의 합은? [4.7점]",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$1$",
      "$2$"
    ],
    "answer": "③",
    "solution": "함수 $f(x)=\\dfrac{3x+1}{x-3}$의 정의역은 $x \\ne 3$인 실수 전체이다.\n$x \\ne 3$일 때 $f(f(x))$를 구하면\n$f(f(x))=\\dfrac{3\\cdot\\dfrac{3x+1}{x-3}+1}{\\dfrac{3x+1}{x-3}-3}$\n$=\\dfrac{3(3x+1)+(x-3)}{(3x+1)-3(x-3)}$\n$=\\dfrac{10x}{10}=x$\n이다.\n(이때 $\\dfrac{3x+1}{x-3}=3$을 만족하는 $x$는 없으므로 $x \\ne 3$인 모든 $x$에서 $f(f(x))$가 정의된다.)\n\n따라서 $x \\ne 3$일 때 $f(f(f(x)))=f(x)$이므로 주어진 방정식은\n$f(x)=f(x)+x^2-2x-3$\n$x^2-2x-3=0$\n$(x-3)(x+1)=0$\n이다.\n\n따라서 $x=3$ 또는 $x=-1$이지만, $x=3$은 원래 함수 $f(x)$의 정의역에서 제외되므로 실근은 $x=-1$뿐이다.\n\n그러므로 구하는 모든 실수 $x$의 값들의 합은 $-1$이고 정답은 ③이다.",
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
    "content": "함수 $y=-\\sqrt{2x+4}+3$과 직선 $y=-x+k$의 그래프의 교점의 개수가 $2$개가 되도록 하는 상수 $k$의 값의 범위는? [4.9점]",
    "choices": [
      "$k < \\dfrac{1}{2}$",
      "$k \\ge 1$",
      "$\\dfrac{1}{2} \\le k < 1$",
      "$\\dfrac{1}{2} < k < 1$",
      "$\\dfrac{1}{2} < k \\le 1$"
    ],
    "answer": "⑤",
    "solution": "무리함수 $y=-\\sqrt{2x+4}+3$의 정의역은 $x \\ge -2$이다.\n$t=\\sqrt{2x+4}$라 놓으면 $t \\ge 0$이고 $x=\\dfrac{t^2-4}{2}$이다.\n교점에서 $-t+3=-x+k$이므로\n$-t+3=-\\dfrac{t^2-4}{2}+k$\n양변에 $2$를 곱하여 정리하면\n$-2t+6=-t^2+4+2k$\n$t^2-2t+(2-2k)=0$\n이다.\n\n$t \\ge 0$인 $t$의 값 하나에 $x$의 값이 하나씩 대응하므로, 서로 다른 두 교점을 가지려면 이 이차방정식이 $t \\ge 0$인 서로 다른 두 실근을 가져야 한다.\n\n먼저 서로 다른 두 실근을 가져야 하므로 판별식이 양수여야 한다.\n$\\dfrac{D}{4}=(-1)^2-(2-2k)=2k-1 > 0$\n$k > \\dfrac{1}{2}$\n\n또한 두 근의 합이 $2 > 0$이므로 두 실근이 모두 $0$ 이상이려면 두 근의 곱이 $0$ 이상이어야 한다.\n$2-2k \\ge 0$\n$k \\le 1$\n\n따라서 구하는 상수 $k$의 값의 범위는\n$\\dfrac{1}{2} < k \\le 1$\n이므로 정답은 ⑤이다.",
    "score": 4.9,
    "points": 4.9,
    "sourceQid": 17,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q17-solution.svg",
    "solutionImageAlt": "해설 그림: 직선 l은 y=-x+1(k=1), 점선 m은 y=-x+1/2(k=1/2)이다. t=√(2x+4)로 놓으면 t²-2t+2-2k=0이 t≥0인 서로 다른 두 실근을 가져야 한다. k=1/2이면 직선이 점 T(-3/2,2)에서 접하고, k=1이면 곡선의 시작점 A(-2,3)과 점 B(0,1)을 지난다. 따라서 1/2<k≤1이고 답은 ⑤이다.",
    "solutionImageCaption": "직선 l은 y=-x+1(k=1), 점선 m은 y=-x+1/2(k=1/2)이다. t=√(2x+4)로 놓으면 t²-2t+2-2k=0이 t≥0인 서로 다른 두 실근을 가져야 한다. k=1/2이면 직선이 점 T(-3/2,2)에서 접하고, k=1이면 곡선의 시작점 A(-2,3)과 점 B(0,1)을 지난다. 따라서 1/2<k≤1이고 답은 ⑤이다.",
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
    "content": "정의역이 $\\{x|0 \\le x \\le 2\\}$인 함수 $y=f(x)$의 그래프가 오른쪽 그림과 같을 때, 방정식 $2f(f(x))=f(x)+1$을 만족하는 모든 실근의 합은? [5.2점]",
    "choices": [
      "$\\dfrac{4}{3}$",
      "$\\dfrac{5}{3}$",
      "$\\dfrac{13}{6}$",
      "$\\dfrac{7}{3}$",
      "$\\dfrac{8}{3}$"
    ],
    "answer": "④",
    "solution": "그래프는 세 점 $(0, 0)$, $(1, 2)$, $(2, 1)$을 차례로 선분으로 이은 꺾은선이므로\n$f(x)=\\begin{cases} 2x & (0 \\le x \\le 1) \\\\ -x+3 & (1 \\le x \\le 2) \\end{cases}$\n이다.\n\n$u=f(x)$라 놓으면 $0 \\le u \\le 2$이고, 주어진 방정식은\n$2f(u)=u+1$\n$f(u)=\\dfrac{u+1}{2}$\n이다.\n\n(i) $0 \\le u \\le 1$일 때\n$2u=\\dfrac{u+1}{2}$\n$4u=u+1$\n$u=\\dfrac{1}{3}$\n이고, 이는 $0 \\le u \\le 1$을 만족한다.\n\n(ii) $1 \\le u \\le 2$일 때\n$-u+3=\\dfrac{u+1}{2}$\n$-2u+6=u+1$\n$3u=5$\n$u=\\dfrac{5}{3}$\n이고, 이는 $1 \\le u \\le 2$를 만족한다.\n\n이제 $f(x)=\\dfrac{1}{3}$ 또는 $f(x)=\\dfrac{5}{3}$을 만족하는 $x$를 구한다.\n\n$f(x)=\\dfrac{1}{3}$일 때,\n$0 \\le x \\le 1$에서는 $2x=\\dfrac{1}{3}$에서 $x=\\dfrac{1}{6}$이고,\n$1 \\le x \\le 2$에서는 $f(x) \\ge 1 > \\dfrac{1}{3}$이므로 해가 없다.\n\n$f(x)=\\dfrac{5}{3}$일 때,\n$0 \\le x \\le 1$에서는 $2x=\\dfrac{5}{3}$에서 $x=\\dfrac{5}{6}$이고,\n$1 \\le x \\le 2$에서는 $-x+3=\\dfrac{5}{3}$에서 $x=\\dfrac{4}{3}$이다.\n\n따라서 모든 실근의 합은\n$\\dfrac{1}{6}+\\dfrac{5}{6}+\\dfrac{4}{3}=1+\\dfrac{4}{3}=\\dfrac{7}{3}$\n이므로 정답은 ④이다.",
    "score": 5.2,
    "points": 5.2,
    "sourceQid": 18,
    "variationType": "STRICT_VARIANT",
    "image": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q18.svg",
    "imageSize": "full",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q18-solution.svg",
    "solutionImageAlt": "해설 그림: u=f(x)로 놓으면 f(u)=(u+1)/2이고 직선 y=(u+1)/2와 f의 교점 P(1/3,2/3), Q(5/3,4/3)에서 u=1/3, 5/3이다. f(x)=1/3에서 x=1/6, f(x)=5/3에서 x=5/6, 4/3이므로 근의 합은 1/6+5/6+4/3=7/3이다. 따라서 답은 ④이다.",
    "solutionImageCaption": "u=f(x)로 놓으면 f(u)=(u+1)/2이고 직선 y=(u+1)/2와 f의 교점 P(1/3,2/3), Q(5/3,4/3)에서 u=1/3, 5/3이다. f(x)=1/3에서 x=1/6, f(x)=5/3에서 x=5/6, 4/3이므로 근의 합은 1/6+5/6+4/3=7/3이다. 따라서 답은 ④이다.",
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
    "content": "[서술형 1] 함수 $f(x)$가<br>$$f(x)=\\begin{cases} x^2+2x-2 & (x \\ge -1) \\\\ -x^2-2x-4 & (x < -1) \\end{cases}$$<br>일 때, 임의의 실수 $x$에 대하여 $(f \\circ g)(x)=x$를 만족시키는 함수 $g(x)$가 존재한다. $(g \\circ g)(a)=0$일 때, 상수 $a$의 값을 구하는 과정을 서술하시오. [5점]",
    "choices": [],
    "answer": "-4",
    "solution": "$x \\ge -1$일 때 $f(x)=(x+1)^2-3$이므로 이 구간에서 증가하고 치역은 $[-3, \\infty)$이다.\n$x < -1$일 때 $f(x)=-(x+1)^2-3$이므로 이 구간에서 증가하고 치역은 $(-\\infty, -3)$이다.\n두 구간에서 각각 일대일이고 치역이 겹치지 않으며 합집합이 실수 전체의 집합이므로 $f$는 일대일대응이다.\n\n임의의 실수 $x$에 대하여 $(f \\circ g)(x)=x$이므로 $g=f^{-1}$이다.\n따라서 $(g \\circ g)(a)=0$의 양변에 $f$를 두 번 적용하면\n$a=(f \\circ f)(0)$\n이다.\n\n$0 \\ge -1$이므로\n$f(0)=0^2+2\\times 0-2=-2$\n이다.\n$-2 < -1$이므로\n$f(-2)=-(-2)^2-2(-2)-4=-4+4-4=-4$\n이다.\n\n따라서 $a=-4$이다.",
    "score": 5,
    "points": 5,
    "sourceQid": 19,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q19-solution.svg",
    "solutionImageAlt": "해설 그림: f는 x=-1에서 두 구간 모두 증가하고 치역이 겹치지 않으므로 일대일대응이고, (f∘g)(x)=x이므로 g는 f의 역함수이다. (g∘g)(a)=0에서 a=(f∘f)(0)이다. f(0)=-2이고 f(-2)=-4이므로 a=-4이다.",
    "solutionImageCaption": "f는 x=-1에서 두 구간 모두 증가하고 치역이 겹치지 않으므로 일대일대응이고, (f∘g)(x)=x이므로 g는 f의 역함수이다. (g∘g)(a)=0에서 a=(f∘f)(0)이다. f(0)=-2이고 f(-2)=-4이므로 a=-4이다.",
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
    "content": "[서술형 2] 두 집합 $X=\\{x|x \\ge -3\\}, Y=\\{y|y \\le 3\\}$에 대하여 $X$에서 $Y$로의 함수 $f(x)=-\\sqrt{ax+b}+c$가 제 $2, 3, 4$ 사분면만을 지나도록 하는 상수 $a, b, c$에 대하여 이를 만족하는 순서쌍 $(a, b, c)$를 모두 구하는 과정을 서술하시오. (단, $-10 \\le a, b, c \\le 10$인 정수) [7점]",
    "choices": [],
    "answer": "(1,3,1), (1,5,2), (1,6,2), (1,10,3), (2,6,1), (2,6,2), (2,7,2), (2,8,2), (2,9,2), (2,10,3), (3,9,1), (3,9,2), (3,10,2), (3,10,3)",
    "solution": "정의역이 $x \\ge -3$이므로 모든 $x \\ge -3$에서 $ax+b \\ge 0$이어야 한다. 따라서 $a \\ge 0$이고 $-3a+b \\ge 0$, 즉 $b \\ge 3a$이다.\n$a=0$이면 상수함수가 되어 세 개의 사분면을 지날 수 없으므로 $a \\ge 1$이고 $f(x)$는 감소한다.\n\n$X$에서 $Y=\\{y|y \\le 3\\}$로의 함수가 되려면 최댓값 $f(-3)$이 $3$ 이하여야 하므로\n$-\\sqrt{b-3a}+c \\le 3$\n$c \\le 3+\\sqrt{b-3a}$\n이다.\n\n그래프가 제$2, 3, 4$사분면만 지나려면 제$2$사분면($x<0, y>0$)을 지나야 하므로 $f(-3) > 0$이어야 하고, 제$1$사분면($x>0, y>0$)을 지나지 않으면서 제$3$사분면($x<0, y<0$)을 지나야 하므로 $f(0) < 0$이어야 한다. (이때 $x \\to \\infty$이면 $f(x) \\to -\\infty$이므로 제$4$사분면은 항상 지난다.)\n따라서\n$-\\sqrt{b-3a}+c > 0 \\implies c > \\sqrt{b-3a}$\n$-\\sqrt{b}+c < 0 \\implies c < \\sqrt{b}$\n이다.\n\n$b \\le 10$에서 $\\sqrt{b} \\le \\sqrt{10} < 4$이므로 정수 $c$는 $c \\le 3$이고, $c \\le 3+\\sqrt{b-3a}$는 항상 성립한다.\n$1 \\le a$이고 $3a \\le b \\le 10$이므로 $a=1, 2, 3$인 경우로 나눈다.\n\n(i) $a=1$일 때, $3 \\le b \\le 10$이고 $\\sqrt{b-3} < c < \\sqrt{b}$이다.\n$b=3$: $0 < c < \\sqrt{3}$에서 $c=1$\n$b=4$: $1 < c < 2$에서 없음\n$b=5$: $\\sqrt{2} < c < \\sqrt{5}$에서 $c=2$\n$b=6$: $\\sqrt{3} < c < \\sqrt{6}$에서 $c=2$\n$b=7$: $2 < c < \\sqrt{7}$에서 없음\n$b=8$: $\\sqrt{5} < c < \\sqrt{8}$에서 없음\n$b=9$: $\\sqrt{6} < c < 3$에서 없음\n$b=10$: $\\sqrt{7} < c < \\sqrt{10}$에서 $c=3$\n따라서 $(1,3,1), (1,5,2), (1,6,2), (1,10,3)$의 $4$개이다.\n\n(ii) $a=2$일 때, $6 \\le b \\le 10$이고 $\\sqrt{b-6} < c < \\sqrt{b}$이다.\n$b=6$: $0 < c < \\sqrt{6}$에서 $c=1, 2$\n$b=7$: $1 < c < \\sqrt{7}$에서 $c=2$\n$b=8$: $\\sqrt{2} < c < \\sqrt{8}$에서 $c=2$\n$b=9$: $\\sqrt{3} < c < 3$에서 $c=2$\n$b=10$: $2 < c < \\sqrt{10}$에서 $c=3$\n따라서 $(2,6,1), (2,6,2), (2,7,2), (2,8,2), (2,9,2), (2,10,3)$의 $6$개이다.\n\n(iii) $a=3$일 때, $9 \\le b \\le 10$이고 $\\sqrt{b-9} < c < \\sqrt{b}$이다.\n$b=9$: $0 < c < 3$에서 $c=1, 2$\n$b=10$: $1 < c < \\sqrt{10}$에서 $c=2, 3$\n따라서 $(3,9,1), (3,9,2), (3,10,2), (3,10,3)$의 $4$개이다.\n\n그러므로 구하는 순서쌍은 모두 $14$개이며\n$(1,3,1), (1,5,2), (1,6,2), (1,10,3), (2,6,1), (2,6,2), (2,7,2), (2,8,2), (2,9,2), (2,10,3), (3,9,1), (3,9,2), (3,10,2), (3,10,3)$이다.",
    "score": 7,
    "points": 7,
    "sourceQid": 20,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q20-solution.svg",
    "solutionImageAlt": "해설 그림: 예: (a,b,c)=(1,3,1)이면 y=-√(x+3)+1은 시작점 S(-3,1)에서 출발해 x절편 Z(-2,0)을 지나고 y절편 Y(0,1-√3)이 음수이다. 따라서 제2, 3, 4사분면만 지난다. 조건을 만족하는 순서쌍은 (1,3,1), (1,5,2), (1,6,2), (1,10,3), (2,6,1), (2,6,2), (2,7,2), (2,8,2), (2,9,2), (2,10,3), (3,9,1), (3,9,2), (3,10,2), (3,10,3)이다.",
    "solutionImageCaption": "예: (a,b,c)=(1,3,1)이면 y=-√(x+3)+1은 시작점 S(-3,1)에서 출발해 x절편 Z(-2,0)을 지나고 y절편 Y(0,1-√3)이 음수이다. 따라서 제2, 3, 4사분면만 지난다. 조건을 만족하는 순서쌍은 (1,3,1), (1,5,2), (1,6,2), (1,10,3), (2,6,1), (2,6,2), (2,7,2), (2,8,2), (2,9,2), (2,10,3), (3,9,1), (3,9,2), (3,10,2), (3,10,3)이다.",
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
    "content": "[서술형 3] 함수 $f:(-\\infty, 3]\\to[-1, \\infty)$를 $f(x)=(x-3)^2-1$로 정의하자. 방정식 $f^{-1}(x)=5-x$를 만족하는 모든 실수 $x$를 구하는 과정을 서술하시오. [8점]",
    "choices": [],
    "answer": "$\\dfrac{5+\\sqrt{13}}{2}$",
    "solution": "$x \\le 3$에서 $x-3 \\le 0$이므로 $y=(x-3)^2-1$을 $x$에 대하여 풀면\n$(x-3)^2=y+1$\n$x-3=-\\sqrt{y+1}$\n$x=3-\\sqrt{y+1}$\n이다.\n$x$와 $y$를 서로 바꾸면 역함수는\n$f^{-1}(x)=3-\\sqrt{x+1} \\quad (x \\ge -1)$\n이다.\n\n$f^{-1}(x)=5-x$에 대입하면\n$3-\\sqrt{x+1}=5-x$\n$\\sqrt{x+1}=x-2$\n이다.\n\n제곱하기 전에 양변의 부호를 확인하면 왼쪽이 $0$ 이상이므로 $x-2 \\ge 0$, 즉 $x \\ge 2$여야 한다.\n\n양변을 제곱하면\n$x+1=(x-2)^2$\n$x+1=x^2-4x+4$\n$x^2-5x+3=0$\n이므로\n$x=\\dfrac{5 \\pm \\sqrt{13}}{2}$\n이다.\n\n$3 < \\sqrt{13} < 4$이므로 $\\dfrac{5-\\sqrt{13}}{2} < 1 < 2$가 되어 조건 $x \\ge 2$를 만족하지 않아 제외한다.\n반면 $x=\\dfrac{5+\\sqrt{13}}{2} > 4 > 2$는 $x \\ge -1$과 $x \\ge 2$를 모두 만족하고 양변이 모두 $0$ 이상이므로 원래 방정식을 만족한다.\n\n따라서 구하는 값은 $\\dfrac{5+\\sqrt{13}}{2}$이다.",
    "score": 8,
    "points": 8,
    "sourceQid": 21,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_순천여고_2학기_기말_고1_공통수학2_유사3/q21-solution.svg",
    "solutionImageAlt": "해설 그림: f(x)=(x-3)²-1 (x≤3)의 역함수는 y=3-√(x+1) (x≥-1)이다. 이 곡선과 직선 y=-x+5의 교점을 구하면 x²-5x+3=0에서 x=(5±√13)/2이고, 제곱 전 조건 x≥2를 만족하는 것은 (5+√13)/2뿐이다. 교점은 P((5+√13)/2, (5-√13)/2)이다. 따라서 답은 (5+√13)/2이다.",
    "solutionImageCaption": "f(x)=(x-3)²-1 (x≤3)의 역함수는 y=3-√(x+1) (x≥-1)이다. 이 곡선과 직선 y=-x+5의 교점을 구하면 x²-5x+3=0에서 x=(5±√13)/2이고, 제곱 전 조건 x≥2를 만족하는 것은 (5+√13)/2뿐이다. 교점은 P((5+√13)/2, (5-√13)/2)이다. 따라서 답은 (5+√13)/2이다.",
    "solutionImageSize": "full"
  }
];
