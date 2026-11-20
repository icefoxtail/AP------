window.examTitle = "25_효천고_2학기_기말_고1_유사3";
window.examDisplayTitle = "25_효천고_2학기_기말_고1_유사3";

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
    "content": "다음 중 거짓인 명제는?",
    "choices": [
      "$x^2-9=0$",
      "$18$의 약수는 모두 짝수이다.",
      "직사각형의 두 대각선의 길이는 같다.",
      "가장 작은 자연수는 $1$이다.",
      "$x+1\\lt 5$"
    ],
    "answer": "②",
    "solution": "명제는 참인지 거짓인지를 분명하게 판별할 수 있는 문장이나 식이다.\n\n①과 ⑤는 $x$의 값에 따라 참과 거짓이 달라지므로 조건이지 명제가 아니다.\n\n③과 ④는 항상 참이므로 참인 명제이다.\n\n②에서 $18$의 약수는 $1, 2, 3, 6, 9, 18$이고 이 중 $1, 3, 9$는 홀수이므로 거짓으로 판별되는 명제이다.\n\n따라서 정답은 ②이다.",
    "score": 3.1,
    "points": 3.1,
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
    "content": "정의역이 $\\{-1, 1\\}$인 두 함수 $f(x)=|x-1|+a$, $g(x)=bx+4$에 대하여 $f=g$일 때, 두 실수 $a$, $b$에 대하여 $a-b$의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "⑤",
    "solution": "두 함수가 같으려면 정의역의 모든 원소에서 함숫값이 같아야 하므로 $f(-1)=g(-1)$과 $f(1)=g(1)$이 성립해야 한다.\n\n먼저 $x=-1$을 대입하면\n$f(-1)=|-1-1|+a=2+a$\n$g(-1)=-b+4$\n이므로\n$2+a=-b+4$\n$a+b=2$\n\n다음으로 $x=1$을 대입하면\n$f(1)=|1-1|+a=a$\n$g(1)=b+4$\n이므로\n$a=b+4$\n\n$a=b+4$를 $a+b=2$에 대입하면\n$(b+4)+b=2$\n$2b=-2$\n$b=-1$\n\n$b=-1$을 $a=b+4$에 대입하면\n$a=3$\n\n따라서 구하는 값은\n$a-b=3-(-1)=4$\n\n따라서 정답은 ⑤이다.",
    "score": 3.1,
    "points": 3.1,
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
    "content": "두 함수 $f(x)=\\begin{cases}x+3&(x\\lt 0)\\\\2x-1&(x\\ge 0)\\end{cases}$, $g(x)=-x^2+2$에 대하여 $(f\\circ g)(2)+(g\\circ f)(-1)$의 값은?",
    "choices": [
      "$-3$",
      "$-1$",
      "$1$",
      "$3$",
      "$5$"
    ],
    "answer": "②",
    "solution": "합성함수는 안쪽 함수의 값부터 차례로 구한다.\n\n먼저 $g(2)$를 구하면\n$g(2)=-2^2+2=-2$\n\n$-2\\lt 0$이므로 $f(-2)$는 위쪽 식에 대입하여 구한다.\n$(f\\circ g)(2)=f(-2)=-2+3=1$\n\n다음으로 $-1\\lt 0$이므로 $f(-1)$을 구하면\n$f(-1)=-1+3=2$\n\n이를 $g$에 대입하면\n$(g\\circ f)(-1)=g(2)=-2^2+2=-2$\n\n두 값을 더하면\n$1+(-2)=-1$\n\n따라서 정답은 ②이다.",
    "score": 3.2,
    "points": 3.2,
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
    "content": "일차함수 $f(x)=ax-3$의 역함수 $y=f^{-1}(x)$의 그래프가 점 $(5,4)$를 지날 때, $f^{-1}(7)$의 값은? (단, $a$는 상수이다.)",
    "choices": [
      "$2$",
      "$4$",
      "$5$",
      "$7$",
      "$11$"
    ],
    "answer": "③",
    "solution": "함수 $y=f^{-1}(x)$의 그래프가 점 $(5,4)$를 지나므로 $f^{-1}(5)=4$이다.\n\n역함수의 성질에 의하여 $f(4)=5$이므로 $f(x)=ax-3$에 대입하면\n$4a-3=5$\n$4a=8$\n$a=2$\n\n따라서 $f(x)=2x-3$이다.\n\n$f^{-1}(7)=k$라 하면 역함수의 성질에 의하여 $f(k)=7$이므로\n$2k-3=7$\n$2k=10$\n$k=5$\n\n따라서 정답은 ③이다.",
    "score": 3.4,
    "points": 3.4,
    "sourceQid": 4,
    "variationType": "STRICT_VARIANT"
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
    "content": "다음 식의 분모를 $0$으로 만들지 않는 모든 실수 $x$에 대하여 $\\dfrac{1}{x(x+1)}+\\dfrac{1}{(x+1)(x+2)}+\\dfrac{1}{(x+2)(x+3)}$을 간단히 한 식은?",
    "choices": [
      "$\\dfrac{1}{x(x+3)}$",
      "$\\dfrac{2}{x(x+3)}$",
      "$\\dfrac{3}{x(x+3)}$",
      "$\\dfrac{3}{x(x+1)}$",
      "$\\dfrac{2x+3}{x(x+3)}$"
    ],
    "answer": "③",
    "solution": "항등식 $\\dfrac{1}{AB}=\\dfrac{1}{B-A}\\left(\\dfrac{1}{A}-\\dfrac{1}{B}\\right)$을 이용하여 각 분수를 두 분수의 차로 나눈다.\n\n$\\dfrac{1}{x(x+1)}=\\dfrac{1}{x}-\\dfrac{1}{x+1}$\n$\\dfrac{1}{(x+1)(x+2)}=\\dfrac{1}{x+1}-\\dfrac{1}{x+2}$\n$\\dfrac{1}{(x+2)(x+3)}=\\dfrac{1}{x+2}-\\dfrac{1}{x+3}$\n\n세 식을 모두 더하면 가운데 항들이 차례로 소거된다.\n$\\left(\\dfrac{1}{x}-\\dfrac{1}{x+1}\\right)+\\left(\\dfrac{1}{x+1}-\\dfrac{1}{x+2}\\right)+\\left(\\dfrac{1}{x+2}-\\dfrac{1}{x+3}\\right)$\n$=\\dfrac{1}{x}-\\dfrac{1}{x+3}$\n\n두 분수를 통분하여 정리하면\n$\\dfrac{(x+3)-x}{x(x+3)}=\\dfrac{3}{x(x+3)}$\n\n따라서 정답은 ③이다.",
    "score": 3.4,
    "points": 3.4,
    "sourceQid": 5,
    "variationType": "STRICT_VARIANT"
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
    "content": "전체집합 $U$에 대하여 세 조건 $p$, $q$, $r$의 진리집합을 각각 $P$, $Q$, $R$이라 하자.<br>$P-Q=\\varnothing$, $Q^C\\cup R=U$일 때, 다음 중 항상 참인 명제는?",
    "choices": [
      "$\\sim r\\to\\sim p$",
      "$r\\to p$",
      "$q\\to p$",
      "$p\\to\\sim q$",
      "$\\sim q\\to r$"
    ],
    "answer": "①",
    "solution": "첫째 집합식 $P-Q=\\varnothing$은 $P$의 모든 원소가 $Q$에 속한다는 뜻이므로\n$P\\subseteq Q$\n\n둘째 집합식 $Q^C\\cup R=U$의 양변에 여집합을 취하면 드모르간 법칙에 의하여\n$(Q^C\\cup R)^C=U^C$\n$Q\\cap R^C=\\varnothing$\n$Q-R=\\varnothing$\n\n따라서 $Q$의 모든 원소가 $R$에 속하므로\n$Q\\subseteq R$\n\n두 포함 관계 $P\\subseteq Q$와 $Q\\subseteq R$에서\n$P\\subseteq R$\n\n그러므로 명제 $p\\to r$이 항상 참이고, 그 대우인 $\\sim r\\to\\sim p$도 항상 참이다.\n\n따라서 정답은 ①이다.",
    "score": 3.5,
    "points": 3.5,
    "sourceQid": 6,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_유사3/q06-solution.svg",
    "solutionImageAlt": "해설 그림: 집합 사이의 포함 관계와 원소가 속한 영역을 벤 다이어그램으로 나타낸 그림이다.",
    "solutionImageCaption": "P−Q=∅에서 P⊂Q이고, Qᶜ∪R=U에서 Q−R=∅이므로 Q⊂R이다. 따라서 P⊂Q⊂R이므로 P⊂R이고, p→r과 그 대우 ~r→~p가 항상 참이다. 따라서 답은 ①이다.",
    "solutionImageSize": "full"
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
    "content": "두 조건 $p$, $q$에 대하여 보기에서 $p$는 $q$이기 위한 필요충분조건인 것만을 있는 대로 고른 것은? (단, $a$, $b$, $x$, $y$는 실수이다.)<div style=\"border:1px solid #222;padding:10px 12px;margin-top:10px;line-height:1.8;\">ㄱ. $p:|a|+|b|=0$ &nbsp;&nbsp;&nbsp; $q:a^2+b^2=0$<br>ㄴ. $p:x^2=y^2$ &nbsp;&nbsp;&nbsp; $q:x=y$<br>ㄷ. $p:a\\gt 0$이고 $b\\gt 0$ &nbsp;&nbsp;&nbsp; $q:a+b\\gt 0$</div>",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "①",
    "solution": "$p$가 $q$이기 위한 필요충분조건이려면 $p\\to q$와 $q\\to p$가 모두 참이어야 한다.\n\nㄱ. 실수 $a$, $b$에 대하여 $|a|\\ge 0$, $|b|\\ge 0$이므로 $|a|+|b|=0$은 $a=0$이고 $b=0$일 때와 같다. 또한 $a^2\\ge 0$, $b^2\\ge 0$이므로 $a^2+b^2=0$도 $a=0$이고 $b=0$일 때와 같다. 따라서 $p$는 $q$이기 위한 필요충분조건이다.\n\nㄴ. $x=y$이면 $x^2=y^2$이므로 $q\\to p$는 참이다. 그러나 $x=1$, $y=-1$이면 $x^2=y^2$이지만 $x\\ne y$이므로 $p\\to q$는 거짓이다. 따라서 필요충분조건이 아니다.\n\nㄷ. $a\\gt 0$이고 $b\\gt 0$이면 $a+b\\gt 0$이므로 $p\\to q$는 참이다. 그러나 $a=3$, $b=-1$이면 $a+b=2\\gt 0$이지만 $b\\gt 0$이 아니므로 $q\\to p$는 거짓이다. 따라서 필요충분조건이 아니다.\n\n그러므로 필요충분조건인 것은 ㄱ뿐이고 정답은 ①이다.",
    "score": 3.7,
    "points": 3.7,
    "sourceQid": 7,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_유사3/q07-solution.svg",
    "solutionImageAlt": "해설 그림: 각 원소가 어느 집합에 속하는지 표로 나타낸 그림이다.",
    "solutionImageCaption": "각 보기에서 p, q가 모두 참이 되는 (a, b) 또는 (x, y)의 예를 표로 나타냈다. ㄱ은 (0,0)에서 p, q가 모두 참이고 p와 q가 같은 조건이어서 필요충분조건이다. ㄴ은 (x,y)=(1,−1)에서 p만 참이고, ㄷ은 (a,b)=(3,−1)에서 q만 참이므로 필요충분조건이 아니다. 따라서 답은 ①이다.",
    "solutionImageSize": "full"
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
    "content": "다음 중 무리함수 $y=\\sqrt{4-2x}-1$의 그래프에 대한 설명으로 옳은 것은?",
    "choices": [
      "정의역은 $\\{x\\mid x\\ge 2\\}$이다.",
      "치역은 $\\{y\\mid y\\le -1\\}$이다.",
      "제$3$사분면을 지나지 않는다.",
      "$y=\\sqrt{-2x}$의 그래프를 $x$축의 방향으로 $-2$만큼, $y$축의 방향으로 $-1$만큼 평행이동한 것이다.",
      "$x$축과 만나는 점의 좌표는 $(2,0)$이다."
    ],
    "answer": "③",
    "solution": "근호 안이 $0$ 이상이어야 하므로\n$4-2x\\ge 0$\n$x\\le 2$\n따라서 정의역은 $\\{x\\mid x\\le 2\\}$이므로 ①은 옳지 않다.\n\n$x\\le 2$에서 $\\sqrt{4-2x}\\ge 0$이므로\n$y=\\sqrt{4-2x}-1\\ge -1$\n따라서 치역은 $\\{y\\mid y\\ge -1\\}$이므로 ②는 옳지 않다.\n\n$x\\le 0$인 범위에서는 $4-2x\\ge 4$이므로\n$y=\\sqrt{4-2x}-1\\ge \\sqrt{4}-1=1\\gt 0$\n$x$가 음수일 때 $y$는 항상 양수이므로 그래프는 제$3$사분면을 지나지 않는다. 따라서 ③은 옳다.\n\n식을 변형하면\n$y=\\sqrt{-2(x-2)}-1$\n이므로 $y=\\sqrt{-2x}$의 그래프를 $x$축의 방향으로 $2$만큼, $y$축의 방향으로 $-1$만큼 평행이동한 것이다. 따라서 ④는 옳지 않다.\n\n$y=0$을 대입하면\n$\\sqrt{4-2x}-1=0$\n$4-2x=1$\n$x=\\dfrac{3}{2}$\n$x$축과 만나는 점의 좌표는 $\\left(\\dfrac{3}{2}, 0\\right)$이므로 ⑤는 옳지 않다.\n\n따라서 정답은 ③이다.",
    "score": 3.8,
    "points": 3.8,
    "sourceQid": 8,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_유사3/q08-solution.svg",
    "solutionImageAlt": "해설 그림: 끝점 (2,−1)에서 왼쪽 위로 뻗는 파란색 무리함수 곡선과 원점에서 시작하는 주황색 점선 곡선이 그려져 있고 파란 곡선 위의 점 (0,1), (3/2,0)이 표시되어 있다.",
    "solutionImageCaption": "y=√(4−2x)−1은 점 (2,−1)에서 시작해 왼쪽 위로 뻗으며 정의역은 x≤2, 치역은 y≥−1이다. x<0에서 y>1>0이므로 제3사분면을 지나지 않고, x축과는 (3/2, 0)에서 만난다. 점선은 y=√(−2x)로, 주어진 곡선은 이 그래프를 x축 방향으로 2, y축 방향으로 −1만큼 평행이동한 것이다. 따라서 답은 ③이다.",
    "solutionImageSize": "full"
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
    "content": "임의의 두 정수 $a$, $b$에 대하여 함수 $f$가<br>$f(a+b)=f(a)+f(b)+4ab$<br>를 만족시키고 $f(3)=15$일 때, $f(-3)$의 값은?",
    "choices": [
      "$15$",
      "$21$",
      "$27$",
      "$33$",
      "$39$"
    ],
    "answer": "②",
    "solution": "조건식에 $a=0$, $b=0$을 대입하면\n$f(0)=f(0)+f(0)+0$\n$f(0)=0$\n\n이제 $b=-a$를 대입하면\n$f(0)=f(a)+f(-a)-4a^2$\n\n$f(0)=0$이므로\n$f(a)+f(-a)=4a^2$\n\n$a=3$을 대입하면\n$f(3)+f(-3)=4\\cdot 3^2=36$\n\n$f(3)=15$를 대입하면\n$15+f(-3)=36$\n$f(-3)=21$\n\n따라서 정답은 ②이다.",
    "score": 3.8,
    "points": 3.8,
    "sourceQid": 9,
    "variationType": "STRICT_VARIANT"
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
    "content": "집합 $X=\\{1,2,3,4,5,6\\}$에 대하여 함수 $f:X\\to X$가 $f(x)=$ ($5x$를 $7$로 나누었을 때의 나머지)일 때, $f^{16}(1)+f^{17}(1)$의 값은?<br>(단, $f^1=f$, $f^2=f\\circ f$, $\\cdots$, $f^{n+1}=f\\circ f^n$, $n$은 자연수)",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "①",
    "solution": "$1$에서 시작하여 함수 $f$를 반복 적용한 값을 차례로 구한다.\n$f^1(1)=5$\n$f^2(1)=f(5)=4$\n$f^3(1)=f(4)=6$\n$f^4(1)=f(6)=2$\n$f^5(1)=f(2)=3$\n$f^6(1)=f(3)=1$\n\n$6$번 합성할 때마다 다시 $1$이 나오므로 주기는 $6$이다.\n\n$16=6\\times 2+4$이므로\n$f^{16}(1)=f^4(1)=2$\n\n$17=6\\times 2+5$이므로\n$f^{17}(1)=f^5(1)=3$\n\n두 값을 더하면\n$f^{16}(1)+f^{17}(1)=2+3=5$\n\n따라서 정답은 ①이다.",
    "score": 3.9,
    "points": 3.9,
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
    "content": "두 상수 $a$, $b$에 대하여 무리함수 $f(x)=\\sqrt{2x+a}+b$가 $f^{-1}(2)=0$을 만족시키고, $y=f(x)$의 그래프와 그 역함수 $y=f^{-1}(x)$의 그래프가 점 $(4,4)$에서 만날 때, $a+b$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "두 그래프가 점 $(4,4)$에서 만나므로 $f(4)=4$이다.\n$\\sqrt{8+a}+b=4$\n\n또한 $f^{-1}(2)=0$에서 역함수의 성질에 의하여 $f(0)=2$이다.\n$\\sqrt{a}+b=2$\n\n첫째 식에서 둘째 식을 변끼리 빼면\n$\\sqrt{8+a}-\\sqrt{a}=2$\n$\\sqrt{8+a}=\\sqrt{a}+2$\n\n양변을 제곱하여 정리하면\n$8+a=a+4\\sqrt{a}+4$\n$4\\sqrt{a}=4$\n$\\sqrt{a}=1$\n$a=1$\n\n$a=1$을 $\\sqrt{a}+b=2$에 대입하면\n$1+b=2$\n$b=1$\n\n따라서 구하는 값은\n$a+b=1+1=2$\n\n따라서 정답은 ②이다.",
    "score": 4,
    "points": 4,
    "sourceQid": 11,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_유사3/q11-solution.svg",
    "solutionImageAlt": "해설 그림: 파란색 무리함수 곡선과 주황색 역함수 곡선이 점선 y=x에 대칭으로 그려져 있고 두 곡선이 y=x 위의 한 점에서 만난다. 점 (0,2)와 (2,0)도 표시되어 있다.",
    "solutionImageCaption": "f(x)=√(2x+a)+b와 그 역함수의 그래프는 직선 y=x 위의 점 (4,4)에서 만나므로 f(4)=4이다. f⁻¹(2)=0에서 f(0)=2이므로 그래프는 (0,2)를 지나고 역함수는 (2,0)을 지난다. 두 식 √(8+a)+b=4, √a+b=2에서 a=1, b=1이고 a+b=2이다. 따라서 답은 ②이다.",
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
    "content": "유리함수 $y=\\dfrac{ax+7}{x+b}$의 그래프가 두 직선 $y=x-2$, $y=-x+4$에 대하여 모두 대칭일 때, $a-b$의 값은? (단, $a$, $b$는 상수이다.)",
    "choices": [
      "$-4$",
      "$-2$",
      "$0$",
      "$2$",
      "$4$"
    ],
    "answer": "⑤",
    "solution": "유리함수의 두 대칭축의 교점은 그래프의 대칭의 중심, 즉 두 점근선의 교점과 같다.\n\n두 직선 $y=x-2$와 $y=-x+4$를 연립하여 교점을 구한다.\n$x-2=-x+4$\n$2x=6$\n$x=3$\n\n$x=3$을 $y=x-2$에 대입하면 $y=1$이므로 대칭의 중심은 $(3,1)$이다.\n\n한편 주어진 유리함수를 표준형으로 변형하면\n$y=\\dfrac{a(x+b)+7-ab}{x+b}$\n$=a+\\dfrac{7-ab}{x+b}$\n\n이 그래프의 두 점근선은 $x=-b$, $y=a$이므로 대칭의 중심은 $(-b,a)$이다.\n\n$(-b,a)=(3,1)$이므로\n$a=1$, $b=-3$\n\n따라서 구하는 값은\n$a-b=1-(-3)=4$\n\n따라서 정답은 ⑤이다.",
    "score": 4.1,
    "points": 4.1,
    "sourceQid": 12,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_유사3/q12-solution.svg",
    "solutionImageAlt": "해설 그림: 점근선 x=3, y=1을 가지는 파란색 유리함수 그래프이고 두 점근선의 교점을 기울기 −1, 1인 두 점선이 지난다.",
    "solutionImageCaption": "두 대칭축 y=x−2와 y=−x+4의 교점 (3, 1)은 점근선의 교점과 같다. 유리함수를 y=a+(7−ab)/(x+b)로 바꾸면 점근선은 x=−b, y=a이므로 a=1, b=−3이다. 따라서 a−b=4이고 답은 ⑤이다.",
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
    "content": "유리함수 $y=\\dfrac{a}{x+b}+c$의 그래프가 다음 그림과 같다.<br>무리함수 $y=-\\sqrt{a(x-b)}-c$의 그래프가 제$4$사분면을 지나지 않도록 하는 실수 $a$, $b$, $c$에 대하여 $a+b+c$의 최솟값은?",
    "choices": [
      "$-11$",
      "$-9$",
      "$-7$",
      "$-5$",
      "$-3$"
    ],
    "answer": "④",
    "solution": "그림에서 유리함수의 두 점근선은 $x=-1$, $y=-2$이고, 두 곡선이 점근선의 교점을 기준으로 제$2$, 제$4$사분면 쪽에 놓여 있으므로\n$-b=-1$, $c=-2$, $a\\lt 0$\n즉, $b=1$, $c=-2$, $a\\lt 0$이다.\n\n이를 무리함수의 식에 대입하면\n$y=-\\sqrt{a(x-1)}+2$\n\n$a\\lt 0$이므로 정의역은 $x\\le 1$이고, 그래프는 점 $(1,2)$에서 시작하여 왼쪽 아래로 내려간다.\n\n따라서 제$4$사분면을 지나지 않으려면 $x=0$일 때의 함숫값이 $0$ 이상이어야 한다.\n$-\\sqrt{-a}+2\\ge 0$\n$\\sqrt{-a}\\le 2$\n$-a\\le 4$\n$a\\ge -4$\n\n$a\\lt 0$이므로 $-4\\le a\\lt 0$이다.\n\n그러므로\n$a+b+c=a+1+(-2)=a-1$\n이고, 최솟값은 $a=-4$일 때 $-5$이다.\n\n따라서 정답은 ④이다.",
    "score": 4.3,
    "points": 4.3,
    "sourceQid": 13,
    "variationType": "STRICT_VARIANT",
    "image": "assets/images/25_효천고_2학기_기말_고1_유사3/q13-problem.svg",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_유사3/q13-solution.svg",
    "solutionImageAlt": "해설 그림: 점 (1,2)에서 왼쪽 아래로 뻗는 두 무리함수 곡선이 그려져 있다. 파란색 곡선은 원점을 지나고 주황색 점선 곡선은 원점 위쪽에서 y축과 만난다.",
    "solutionImageCaption": "유리함수의 점근선이 x=−1, y=−2이고 a<0이므로 b=1, c=−2이다. 무리함수는 y=−√(a(x−1))+2로 점 (1,2)에서 왼쪽 아래로 뻗는다. 제4사분면을 지나지 않으려면 x=0에서 y≥0이어야 하므로 −4≤a<0이다. 파란 곡선은 a=−4로 원점을 지나는 경계이고 주황 점선은 a=−1이다. a+b+c=a−1의 최솟값은 a=−4일 때 −5이므로 답은 ④이다.",
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
    "content": "두 조건 $p$, $q$에 대하여 조건 $q$가<br>$q:a^2+b^2+c^2\\gt ab+bc+ca$<br>일 때, $N(p)$를 다음과 같이 정의하자.<div style=\"border:1px solid #222;padding:10px 12px;margin-top:10px;line-height:1.8;\">$p$가 $q$이기 위한 충분조건이지만 필요조건이 아니면 $N(p)=1$<br>$p$가 $q$이기 위한 필요충분조건이면 $N(p)=2$<br>$p$가 $q$이기 위한 필요조건이지만 충분조건이 아니면 $N(p)=3$<br>$p$가 $q$이기 위한 필요조건도 충분조건도 아니면 $N(p)=4$</div><br>세 조건 $p_1$, $p_2$, $p_3$가<br>$p_1:a\\ne b$이고 $b\\ne c$이고 $c\\ne a$<br>$p_2:a\\ne b$ 또는 $b\\ne c$<br>$p_3:a+b+c\\ne 0$<br>일 때, $N(p_1)+N(p_2)+N(p_3)$의 값은? (단, $a$, $b$, $c$는 실수이다.)",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "①",
    "solution": "조건 $q$의 식을 변형하면\n$a^2+b^2+c^2-ab-bc-ca\\gt 0$\n$\\dfrac{1}{2}\\{(a-b)^2+(b-c)^2+(c-a)^2\\}\\gt 0$\n이므로 $q$는 ‘$a=b=c$가 아니다’와 같다.\n\n$p_1$: 세 실수 $a$, $b$, $c$가 모두 다르면 $a=b=c$가 아니므로 $p_1\\to q$는 참이다. 그러나 $a=1$, $b=1$, $c=2$이면 $q$는 참이지만 $p_1$은 거짓이다. 따라서 $p_1$은 $q$이기 위한 충분조건이지만 필요조건이 아니므로 $N(p_1)=1$이다.\n\n$p_2$: ‘$a\\ne b$ 또는 $b\\ne c$’를 부정하면 ‘$a=b$이고 $b=c$’, 즉 ‘$a=b=c$’이다. 따라서 $p_2$는 ‘$a=b=c$가 아니다’와 같으므로 $q$와 필요충분조건이다. 그러므로 $N(p_2)=2$이다.\n\n$p_3$: $a=1$, $b=-1$, $c=0$이면 $q$는 참이지만 $p_3$은 거짓이다. 또 $a=1$, $b=1$, $c=1$이면 $p_3$은 참이지만 $q$는 거짓이다. 따라서 $p_3$은 $q$이기 위한 필요조건도 충분조건도 아니므로 $N(p_3)=4$이다.\n\n그러므로\n$N(p_1)+N(p_2)+N(p_3)=1+2+4=7$\n\n따라서 정답은 ①이다.",
    "score": 4.4,
    "points": 4.4,
    "sourceQid": 14,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_유사3/q14-solution.svg",
    "solutionImageAlt": "해설 그림: 각 원소가 어느 집합에 속하는지 표로 나타낸 그림이다.",
    "solutionImageCaption": "q는 a=b=c가 아니다와 같다. 표에서 p1이 참이면 q도 참이지만 (1,1,2)에서 q만 참이므로 N(p1)=1이다. p2는 q와 항상 같은 값이므로 N(p2)=2이고, p3은 (1,−1,0)에서 q만 참, (1,1,1)에서 p3만 참이므로 N(p3)=4이다. 따라서 합은 7이고 답은 ①이다.",
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
    "content": "실수 전체의 집합에서 정의된 함수<br>$f(x)=\\begin{cases}(4-a)x+b&(x\\lt 1)\\\\ (a+3)x+2&(x\\ge 1)\\end{cases}$<br>의 역함수가 존재하도록 하는 두 정수 $a$, $b$에 대하여 $a+b$의 최댓값은?",
    "choices": [
      "$-2$",
      "$1$",
      "$4$",
      "$7$",
      "$10$"
    ],
    "answer": "⑤",
    "solution": "함수 $f$의 역함수가 존재하려면 $f$가 일대일대응이어야 한다.\n\n두 구간의 일차함수가 모두 증가하거나 모두 감소해야 일대일이 된다. 두 기울기가 모두 음수라면 $4-a\\lt 0$과 $a+3\\lt 0$, 즉 $a\\gt 4$와 $a\\lt -3$을 동시에 만족해야 하므로 불가능하다.\n\n따라서 두 기울기가 모두 양수이어야 한다.\n$4-a\\gt 0$, $a+3\\gt 0$\n$-3\\lt a\\lt 4$\n\n이때 $x\\lt 1$인 구간의 치역은 $(-\\infty, 4-a+b)$이고, $x\\ge 1$인 구간의 치역은 $[a+5, \\infty)$이다. 치역이 실수 전체의 집합이 되려면 두 경계값이 같아야 한다.\n$4-a+b=a+5$\n$b=2a+1$\n\n정수 $a$는 $-2, -1, 0, 1, 2, 3$이고\n$a+b=a+(2a+1)=3a+1$\n이므로 $a=3$일 때 최댓값은\n$3\\cdot 3+1=10$\n\n따라서 정답은 ⑤이다.",
    "score": 4.4,
    "points": 4.4,
    "sourceQid": 15,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_유사3/q15-solution.svg",
    "solutionImageAlt": "해설 그림: 점 (1,8)에서 이어지는 두 직선 조각의 그래프이다. 파란색 조각은 점 (0,7)을 지나는 완만한 오르막이고 주황색 조각은 가파른 오르막이다.",
    "solutionImageCaption": "역함수가 존재하려면 f가 일대일대응이어야 하므로 두 기울기 4−a, a+3이 모두 양수여야 하고 −3<a<4이다. x=1에서 두 식이 이어지려면 4−a+b=a+5, 즉 b=2a+1이다. 그림은 최댓값을 주는 a=3, b=7일 때로 f(x)=x+7 (x<1), 6x+2 (x≥1)이고 점 (1,8)에서 이어진다. 이때 a+b=10이므로 답은 ⑤이다.",
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
    "content": "서로 다른 세 실수 $a$, $b$, $c$에 대하여 집합 $X=\\{a,b,c\\}$를 정의역, 실수 전체의 집합을 공역으로 하는 함수 $f(x)=|x^2-2x-3|$이 상수함수일 때, $a^2+b^2+c^2$의 값은?",
    "choices": [
      "$19$",
      "$21$",
      "$23$",
      "$25$",
      "$27$"
    ],
    "answer": "①",
    "solution": "함수 $f$가 상수함수이려면 어떤 상수 $k$에 대하여 방정식 $|x^2-2x-3|=k$가 서로 다른 세 실근 $a$, $b$, $c$를 가져야 한다.\n\n$k=0$이면 $x^2-2x-3=0$의 실근이 $x=-1$ 또는 $x=3$의 $2$개뿐이므로 조건을 만족하지 않는다.\n\n$k\\gt 0$일 때 주어진 방정식은 다음 두 방정식과 같다.\n$x^2-2x-3=k$\n$x^2-2x-3=-k$\n\n각 식을 완전제곱식으로 변형하면\n$(x-1)^2=4+k$\n$(x-1)^2=4-k$\n\n$k\\gt 0$이므로 두 방정식은 공통근을 갖지 않으며, 첫째 방정식은 항상 서로 다른 두 실근을 갖는다. 따라서 전체가 서로 다른 세 실근을 가지려면 둘째 방정식이 중근을 가져야 하므로\n$4-k=0$\n$k=4$\n\n$k=4$일 때 두 방정식은\n$(x-1)^2=8$, $(x-1)^2=0$\n이므로 세 실근은 $1$, $1+2\\sqrt{2}$, $1-2\\sqrt{2}$이다.\n\n따라서 구하는 값은\n$a^2+b^2+c^2=1^2+(1+2\\sqrt{2})^2+(1-2\\sqrt{2})^2$\n$=1+(9+4\\sqrt{2})+(9-4\\sqrt{2})$\n$=19$\n\n따라서 정답은 ①이다.",
    "score": 4.5,
    "points": 4.5,
    "sourceQid": 16,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_유사3/q16-solution.svg",
    "solutionImageAlt": "해설 그림: 점과 도형의 관계를 확인한다.",
    "solutionImageCaption": "f(x)=|x²−2x−3|의 그래프에서 직선 y=k와 서로 다른 세 점에서 만나는 경우는 k가 꼭짓점의 높이와 같은 4일 때뿐이다. y=4와 만나는 세 점의 x좌표는 1−2√2, 1, 1+2√2이다. 따라서 세 수의 제곱의 합은 1+(9+4√2)+(9−4√2)=19이고 답은 ①이다.",
    "solutionImageSize": "full"
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
    "content": "집합 $X=\\{x\\mid 0\\le x\\le 4\\}$에 대하여 $X$에서 $X$로의 함수<br>$f(x)=\\begin{cases}4x&(0\\le x\\lt 1)\\\\-\\dfrac{4}{3}x+\\dfrac{16}{3}&(1\\le x\\le 4)\\end{cases}$<br>의 그래프는 아래 그림과 같다. $(f\\circ f\\circ f)(a)=0$을 만족시키는 실수 $a$의 개수는?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "②",
    "solution": "먼저 $f(t)=0$을 만족시키는 $t$를 구하면\n$t=0$ 또는 $t=4$\n\n따라서 $(f\\circ f\\circ f)(a)=0$이려면 $f(f(a))=0$ 또는 $f(f(a))=4$이어야 한다.\n\n$f(u)=0$의 해는 $u=0, 4$이고, $f(u)=4$의 해는 꼭짓점인 $u=1$ 하나뿐이다.\n\n따라서 $f(a)$는 $0$, $1$, $4$ 중 하나이어야 한다.\n\n$f(a)=0$의 해는 $a=0, 4$로 $2$개이다.\n$f(a)=1$의 해는 $4a=1$에서 $a=\\dfrac{1}{4}$, $-\\dfrac{4}{3}a+\\dfrac{16}{3}=1$에서 $a=\\dfrac{13}{4}$로 $2$개이다.\n$f(a)=4$의 해는 $a=1$로 $1$개이다.\n\n이 $5$개의 값은 모두 서로 다르므로 구하는 실수 $a$의 개수는 $5$이다.\n\n따라서 정답은 ②이다.",
    "score": 4.6,
    "points": 4.6,
    "sourceQid": 17,
    "variationType": "STRICT_VARIANT",
    "image": "assets/images/25_효천고_2학기_기말_고1_유사3/q17-problem.svg",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_유사3/q17-solution.svg",
    "solutionImageAlt": "해설 그림: 원점과 점 (1,4)를 잇고 (4,0)까지 내려오는 파란색 꺾은선 그래프와 y=1인 주황색 점선이 그려져 있고 두 교점과 꼭짓점이 표시되어 있다.",
    "solutionImageCaption": "f(t)=0의 해는 t=0, 4이므로 f(f(a))는 0 또는 4이고, f(u)=4의 해는 u=1뿐이다. 따라서 f(a)는 0, 1, 4 중 하나이다. f(a)=0은 a=0, 4의 2개, f(a)=1은 직선 y=1과 만나는 a=1/4, 13/4의 2개, f(a)=4는 a=1의 1개이다. 서로 다른 값이 모두 5개이므로 답은 ②이다.",
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
    "content": "상수 $a$ ($a\\lt 5$)와 양수 $b$에 대하여 유리함수 $y=\\dfrac{ax+b}{x+2}$의 그래프와 이 그래프의 두 점근선의 교점을 중심으로 하고 반지름의 길이가 $3\\sqrt{2}$인 원이 서로 다른 두 점에서 만난다. 이 원이 점 $(1,6)$을 지날 때, $a+b$의 값은?",
    "choices": [
      "$12$",
      "$14$",
      "$16$",
      "$18$",
      "$20$"
    ],
    "answer": "④",
    "solution": "주어진 유리함수를 표준형으로 변형하면\n$y=\\dfrac{a(x+2)+b-2a}{x+2}$\n$=a+\\dfrac{b-2a}{x+2}$\n\n두 점근선은 $x=-2$, $y=a$이므로 점근선의 교점은 $(-2,a)$이다.\n\n원의 중심이 $(-2,a)$이고 반지름의 길이가 $3\\sqrt{2}$이므로 원의 방정식은\n$(x+2)^2+(y-a)^2=18$\n\n이 원이 점 $(1,6)$을 지나므로 대입하면\n$(1+2)^2+(6-a)^2=18$\n$(6-a)^2=9$\n$6-a=\\pm 3$\n$a=3$ 또는 $a=9$\n\n$a\\lt 5$이므로 $a=3$이다.\n\n$a=3$을 유리함수에 대입하면\n$y=3+\\dfrac{b-6}{x+2}$\n\n$X=x+2$, $Y=y-3$으로 놓으면 유리함수는 $XY=b-6$이고, 원은 $X^2+Y^2=18$이다.\n\n두 식을 연립하여 $Y$를 소거하면 $X\\ne 0$에서\n$X^2+\\dfrac{(b-6)^2}{X^2}=18$\n$X^4-18X^2+(b-6)^2=0$\n\n$u=X^2$이라 놓으면 $u\\gt 0$이고\n$u^2-18u+(b-6)^2=0$\n\n유리함수와 원이 서로 다른 두 점에서 만나려면 이 이차방정식이 오직 하나의 양의 실근을 가져야 한다. 두 근의 합이 $18\\gt 0$이므로 중근을 가져야 한다.\n$\\dfrac{D}{4}=9^2-(b-6)^2=0$\n$(b-6)^2=81$\n$b-6=\\pm 9$\n$b=15$ 또는 $b=-3$\n\n$b\\gt 0$이므로 $b=15$이다.\n\n따라서 구하는 값은\n$a+b=3+15=18$\n\n따라서 정답은 ④이다.",
    "score": 4.8,
    "points": 4.8,
    "sourceQid": 18,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_유사3/q18-solution.svg",
    "solutionImageAlt": "해설 그림: 점근선 x=−2, y=3을 가지는 유리함수 그래프와 두 점근선의 교점 C를 중심으로 하는 원이 그려져 있다. 원은 곡선과 두 점 P, Q에서 만난다.",
    "solutionImageCaption": "유리함수를 y=a+(b−2a)/(x+2)로 바꾸면 점근선의 교점 C(−2, a)가 원의 중심이고 원은 (x+2)²+(y−a)²=18이다. 점 (1,6)을 지나므로 a=3 또는 9이고 a<5이므로 a=3이다. 서로 다른 두 점에서 만나려면 (b−6)²=81이어야 하고 b>0이므로 b=15이다. 그림은 y=3+9/(x+2)와 원이 P(1,6), Q(−5,0)에서 만나는 모양이다. 따라서 a+b=18이고 답은 ④이다.",
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
    "content": "[서술형 1] 두 함수 $f(x)=2x-1$, $g(x)=3x+2$에 대하여 $(f\\circ g)^{-1}(15)$의 값을 구하는 과정을 서술하시오.",
    "choices": [],
    "answer": "$2$",
    "solution": "$(f\\circ g)^{-1}(15)=a$라 하면 역함수의 성질에 의하여\n$(f\\circ g)(a)=15$\n$f(g(a))=15$\n\n$f(x)=2x-1$에 $g(a)$를 대입하면\n$2g(a)-1=15$\n$2g(a)=16$\n$g(a)=8$\n\n$g(x)=3x+2$에 $a$를 대입하면\n$3a+2=8$\n$3a=6$\n$a=2$\n\n따라서 구하는 값은 $2$이다.",
    "score": 5,
    "points": 5,
    "sourceQid": 19,
    "variationType": "STRICT_VARIANT"
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
    "content": "[서술형 2] 두 함수 $f(x)=ax-m$, $g(x)=bx+2n$에 대하여 $0$이 아닌 두 실수 $m$, $n$의 값에 관계없이 $(f\\circ g)(x)+3m=(g\\circ f)(x)+6n$이 성립할 때, 두 상수 $a$, $b$에 대하여 $a^2+b^2$의 값을 구하는 과정을 서술하시오.",
    "choices": [],
    "answer": "$20$",
    "solution": "주어진 등식의 좌변과 우변을 각각 전개한다.\n$(f\\circ g)(x)+3m=a(bx+2n)-m+3m$\n$=abx+2m+2an$\n\n$(g\\circ f)(x)+6n=b(ax-m)+2n+6n$\n$=abx-bm+8n$\n\n두 식이 $0$이 아닌 두 실수 $m$, $n$의 값에 관계없이 항상 같으므로 $m$과 $n$의 계수를 각각 비교한다.\n\n$m$의 계수에서\n$2=-b$\n$b=-2$\n\n$n$의 계수에서\n$2a=8$\n$a=4$\n\n따라서 구하는 값은\n$a^2+b^2=4^2+(-2)^2=16+4=20$",
    "score": 6,
    "points": 6,
    "sourceQid": 20,
    "variationType": "STRICT_VARIANT"
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
    "content": "[서술형 3] 명제 ‘어떤 실수 $x$에 대하여 $ax^2-4x+a+3\\le 0$이다.’의 부정이 참이 되도록 하는 정수 $a$의 최솟값을 구하는 과정을 서술하시오.",
    "choices": [],
    "answer": "$2$",
    "solution": "주어진 명제의 부정은 ‘모든 실수 $x$에 대하여 $ax^2-4x+a+3\\gt 0$이다.’이다.\n\n먼저 $a=0$일 때를 확인하면\n$-4x+3\\gt 0$\n이고, 이는 $x=1$일 때 성립하지 않으므로 모든 실수 $x$에 대하여 참이 아니다.\n\n$a\\ne 0$일 때, 모든 실수 $x$에 대하여 이차부등식 $ax^2-4x+a+3\\gt 0$이 성립하려면 이차항의 계수가 양수이고 판별식 $D$가 $0$보다 작아야 한다.\n\n따라서 $a\\gt 0$이고\n$\\dfrac{D}{4}=(-2)^2-a(a+3)\\lt 0$\n$4-a^2-3a\\lt 0$\n$a^2+3a-4\\gt 0$\n$(a+4)(a-1)\\gt 0$\n$a\\lt -4$ 또는 $a\\gt 1$\n\n$a\\gt 0$과의 공통 범위는 $a\\gt 1$이다.\n\n따라서 정수 $a$의 최솟값은 $2$이다.",
    "score": 6,
    "points": 6,
    "sourceQid": 21,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_유사3/q21-solution.svg",
    "solutionImageAlt": "해설 그림: 꼭짓점 (1,3)이 x축 위에 있는 파란색 아래로 볼록한 포물선과 y=3인 주황색 점선이 그려져 있다.",
    "solutionImageCaption": "주어진 명제의 부정은 모든 실수 x에 대하여 ax²−4x+a+3>0이다. a=0이면 성립하지 않고, a>0이고 판별식 D/4=4−a(a+3)<0이어야 하므로 a>1이다. 그림은 a=2일 때 y=2x²−4x+5의 그래프로, 꼭짓점 (1,3)이 x축 위에 있어 x축과 만나지 않는다. 따라서 정수 a의 최솟값은 2이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 22,
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
    "content": "[서술형 4] 유리함수 $y=\\dfrac{9}{x-2}+2$ $(x\\gt 2)$의 그래프 위의 점 $P$에서 $x$축, $y$축에 내린 수선의 발을 각각 $Q$, $R$이라 할 때, 직사각형 $OQPR$의 넓이의 최솟값을 구하는 과정을 서술하시오. (단, $O$는 원점이다.)",
    "choices": [],
    "answer": "$25$",
    "solution": "점 $P$의 좌표를 $(x,y)$라 하면 $x\\gt 2$이므로 $x\\gt 0$이고\n$y=\\dfrac{9}{x-2}+2\\gt 2\\gt 0$\n\n따라서 직사각형 $OQPR$의 넓이 $S$는\n$S=xy=x\\left(\\dfrac{9}{x-2}+2\\right)$\n\n$t=x-2$라 놓으면 $t\\gt 0$이고 $x=t+2$이므로\n$S=(t+2)\\left(\\dfrac{9}{t}+2\\right)$\n$=9+2t+\\dfrac{18}{t}+4$\n$=2t+\\dfrac{18}{t}+13$\n\n$t\\gt 0$이므로 산술평균과 기하평균의 관계에 의하여\n$2t+\\dfrac{18}{t}+13\\ge 2\\sqrt{2t\\cdot\\dfrac{18}{t}}+13$\n$=2\\sqrt{36}+13$\n$=12+13=25$\n\n등호는 $2t=\\dfrac{18}{t}$, 즉 $t=3$ ($x=5$)일 때 성립한다.\n\n따라서 직사각형 $OQPR$의 넓이의 최솟값은 $25$이다.",
    "score": 6,
    "points": 6,
    "sourceQid": 22,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_유사3/q22-solution.svg",
    "solutionImageAlt": "해설 그림: 점과 도형의 관계를 확인한다.",
    "solutionImageCaption": "점 P의 좌표를 (x,y)라 하면 직사각형 OQPR의 넓이는 S=xy이다. t=x−2로 놓으면 S=2t+18/t+13이고, 산술평균과 기하평균의 관계에서 S≥25이다. 등호는 t=3, 즉 P(5,5)일 때 성립하며 그림의 직사각형 OQPR의 넓이가 25이다. 따라서 최솟값은 25이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 23,
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
    "content": "[서술형 5] 함수 $f(x)=\\begin{cases}2x-3&(x\\ge 1)\\\\\\dfrac{1}{3}x-\\dfrac{4}{3}&(x\\lt 1)\\end{cases}$과 그 역함수 $f^{-1}(x)$에 대하여 $\\{f^{-1}(x)\\}^2=f(x)f^{-1}(x)$를 만족시키는 모든 실수 $x$의 값의 합을 구하는 과정을 서술하시오.",
    "choices": [],
    "answer": "$-\\dfrac{1}{3}$",
    "solution": "함수 $f(x)$의 두 구간의 일차함수는 모두 기울기가 양수이고 $x=1$에서 함숫값이 모두 $-1$이므로 실수 전체의 집합에서 증가하는 일대일대응이다. 따라서 역함수 $f^{-1}(x)$가 존재한다.\n\n$x\\ge 1$일 때 $y=2x-3\\ge -1$이므로 $x$와 $y$를 바꾸어 정리하면\n$x=2y-3$\n$y=\\dfrac{x+3}{2}$ $(x\\ge -1)$\n\n$x\\lt 1$일 때 $y=\\dfrac{1}{3}x-\\dfrac{4}{3}\\lt -1$이므로 $x$와 $y$를 바꾸어 정리하면\n$x=\\dfrac{1}{3}y-\\dfrac{4}{3}$\n$y=3x+4$ $(x\\lt -1)$\n\n주어진 방정식을 한쪽으로 모아 정리하면\n$f^{-1}(x)\\{f^{-1}(x)-f(x)\\}=0$\n\n먼저 $f^{-1}(x)=0$인 경우를 구한다. 역함수의 성질에 의하여 $x=f(0)$이므로\n$x=\\dfrac{1}{3}\\cdot 0-\\dfrac{4}{3}=-\\dfrac{4}{3}$\n\n다음으로 $f(x)=f^{-1}(x)$인 경우를 구한다. $f$의 식이 바뀌는 곳은 $x=1$이고 $f^{-1}$의 식이 바뀌는 곳은 $x=-1$이므로 세 구간으로 나누어 푼다.\n\n$x\\lt -1$일 때\n$\\dfrac{1}{3}x-\\dfrac{4}{3}=3x+4$\n$x-4=9x+12$\n$8x=-16$\n$x=-2$ (범위에 맞음)\n\n$-1\\le x\\lt 1$일 때\n$\\dfrac{1}{3}x-\\dfrac{4}{3}=\\dfrac{x+3}{2}$\n$2x-8=3x+9$\n$x=-17$ (범위에 맞지 않음)\n\n$x\\ge 1$일 때\n$2x-3=\\dfrac{x+3}{2}$\n$4x-6=x+3$\n$3x=9$\n$x=3$ (범위에 맞음)\n\n따라서 모든 해는 $-\\dfrac{4}{3}$, $-2$, $3$이고 그 합은\n$-\\dfrac{4}{3}+(-2)+3=-\\dfrac{1}{3}$\n\n따라서 구하는 값은 $-\\dfrac{1}{3}$이다.",
    "score": 7,
    "points": 7,
    "sourceQid": 23,
    "variationType": "STRICT_VARIANT",
    "solutionImage": "assets/images/25_효천고_2학기_기말_고1_유사3/q23-solution.svg",
    "solutionImageAlt": "해설 그림: 꺾이는 직선 모양의 f의 그래프(파란색)와 역함수의 그래프(주황색)가 점선 y=x에 대칭으로 그려져 있다. x축 위의 점 (−4/3,0)과 y=x 위의 두 교점 (−2,−2), (3,3)이 표시되어 있다.",
    "solutionImageCaption": "f의 그래프(파랑)와 역함수 f⁻¹의 그래프(주황)는 점선 y=x에 대칭이다. f⁻¹(x)=0인 x는 f(0)=−4/3이므로 점 (−4/3, 0)이다. f(x)=f⁻¹(x)인 x는 두 그래프가 y=x 위에서 만나는 점의 x좌표이므로 −2, 3이다. 따라서 모든 해의 합은 −4/3−2+3=−1/3이다.",
    "solutionImageSize": "full"
  }
];
