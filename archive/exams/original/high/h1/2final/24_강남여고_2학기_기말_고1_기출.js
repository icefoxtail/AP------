window.examTitle = "24_강남여고_2학기_기말_고1_기출";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "유리식의 뜻",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "다음 함수 중 유리식이 아닌 것은? [2.9점]",
    "choices": [
      "$2x^2-x-1$",
      "$\\dfrac{x-1}{x}$",
      "$3x-1$",
      "$\\dfrac{y^2-y+2}{3}$",
      "$\\sqrt{2x-\\dfrac13}$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 유리식은 다항식의 사칙연산으로 나타낼 수 있고 분모에 문자가 있어도 허용되지만, 문자에 대한 근호가 포함된 식은 유리식이 아니다.\n조건 정리: ①, ③, ④는 다항식이고, ②는 두 다항식의 몫이다.\n정석 풀이: ⑤의 $\\sqrt{2x-\\dfrac13}$에는 문자 $x$가 근호 안에 있으므로 유리식이 아니다. 나머지 보기는 모두 유리식이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 2,
    "level": "하",
    "category": "무리함수의 정의역과 치역",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "다음 무리함수 $y=-\\sqrt{2x-4}+3$의 정의역과 치역을 바르게 나타낸 것은? [3점]",
    "choices": [
      "정의역 $\\{x\\mid x\\lt2\\}$, 치역 $\\{y\\mid y\\gt3\\}$",
      "정의역 $\\{x\\mid x\\ge2\\}$, 치역 $\\{y\\mid y\\le3\\}$",
      "정의역 $\\{x\\mid x\\ge3\\}$, 치역 $\\{y\\mid y\\ge2\\}$",
      "정의역 $\\{x\\mid x\\le2\\}$, 치역 $\\{y\\mid y\\ge3\\}$",
      "정의역 $\\{x\\mid x\\lt3\\}$, 치역 $\\{y\\mid y\\le2\\}$"
    ],
    "answer": "②",
    "solution": "[키포인트] 제곱근 안은 $0$ 이상이어야 하고, 제곱근 앞의 음수 때문에 함수값은 $3$ 이하가 된다.\n조건 정리: $2x-4\\ge0$이므로 $x\\ge2$이다.\n정석 풀이: $\\sqrt{2x-4}\\ge0$이므로 $-\\sqrt{2x-4}\\le0$이고, 따라서 $y=-\\sqrt{2x-4}+3\\le3$이다. $x=2$일 때 $y=3$이고 $x$가 커지면 함수값은 제한 없이 작아질 수 있다.\n따라서 정의역은 $\\{x\\mid x\\ge2\\}$, 치역은 $\\{y\\mid y\\le3\\}$이므로 정답은 ②이다."
  },
  {
    "id": 3,
    "level": "하",
    "category": "순열",
    "originalCategory": "순열",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-07",
    "standardUnit": "순열",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "서로 다른 유리병 $A$, $B$, $C$, $D$, $E$ 5개에 서로 다른 음료수 3종류를 각 유리병에 많아야 1종류씩을 넣는 모든 방법의 수는? [3.1점]",
    "choices": [
      "$45$",
      "$50$",
      "$55$",
      "$60$",
      "$65$"
    ],
    "answer": "④",
    "solution": "[키포인트] 서로 다른 음료수 3종류를 서로 다른 병에 하나씩 배정하는 순열 문제이다.\n풀이 방향: 첫 번째 음료수를 넣을 병 5가지, 두 번째는 남은 4가지, 세 번째는 남은 3가지이다.\n정석 풀이: 경우의 수는 $5\\times4\\times3={}_5P_3=60$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 4,
    "level": "하",
    "category": "조합",
    "originalCategory": "조합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-08",
    "standardUnit": "조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "서로 다른 화분 $A$, $B$, $C$, $D$, $E$, $F$ 6개에 같은 종류의 꽃 4그루를 심을 때, 각 화분에 많아야 꽃 1그루를 심는 방법의 수는? [3.2점]",
    "choices": [
      "$12$",
      "$14$",
      "$15$",
      "$30$",
      "$45$"
    ],
    "answer": "③",
    "solution": "[키포인트] 꽃은 서로 구별되지 않으므로 꽃을 심을 화분 4개를 고르면 배치가 결정된다.\n정석 풀이: 서로 다른 화분 6개 중 4개를 선택하므로 경우의 수는 ${}_6C_4={}_6C_2=15$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 5,
    "level": "하",
    "category": "유리함수의 점근선",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "그래프"
    ],
    "wide": false,
    "content": "유리함수 $y=\\dfrac{3x-5}{x-2}$의 점근선을 구하면? [3.4점]",
    "choices": [
      "$x=2$, $y=3$",
      "$x=2$, $y=\\dfrac53$",
      "$x=1$, $y=3$",
      "$x=1$, $y=5$",
      "$x=3$, $y=5$"
    ],
    "answer": "①",
    "solution": "[키포인트] 유리함수를 $\\dfrac{a}{x-p}+q$의 꼴로 바꾸면 점근선은 $x=p$, $y=q$이다.\n정석 풀이: $3x-5=3(x-2)+1$이므로 $y=3+\\dfrac1{x-2}$이다. 따라서 수직점근선은 $x=2$, 수평점근선은 $y=3$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 6,
    "level": "하",
    "category": "무리함수의 평행이동",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "그래프"
    ],
    "wide": false,
    "content": "무리함수 $y=\\sqrt{-3x}$를 $x$축으로 $2$만큼, $y$축으로 $1$만큼 평행이동한 함수는? [3.5점]",
    "choices": [
      "$y=\\sqrt{-3x+2}+1$",
      "$y=\\sqrt{-3x}+3$",
      "$y=\\sqrt{3x-3}-1$",
      "$y=\\sqrt{-3x+6}+1$",
      "$y=-\\sqrt{3x-6}+1$"
    ],
    "answer": "④",
    "solution": "[키포인트] 그래프를 오른쪽으로 $2$만큼 옮기면 식의 $x$를 $x-2$로 바꾸고, 위로 $1$만큼 옮기면 전체에 $1$을 더한다.\n정석 풀이: $y=\\sqrt{-3(x-2)}+1=\\sqrt{-3x+6}+1$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 7,
    "level": "중",
    "category": "경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "서로 다른 세 개의 주사위를 동시에 던질 때, 나오는 눈의 수의 합이 $4$ 이상 $6$ 이하인 경우의 수는? [3.7점]",
    "choices": [
      "$17$",
      "$19$",
      "$21$",
      "$23$",
      "$25$"
    ],
    "answer": "②",
    "solution": "[키포인트] 세 주사위가 서로 다르므로 순서가 다른 눈의 배열은 서로 다른 경우이다.\n정석 풀이: 합이 $4$인 양의 정수 순서쌍의 수는 ${}_3C_2=3$, 합이 $5$이면 ${}_4C_2=6$, 합이 $6$이면 ${}_5C_2=10$이다. 이 범위에서는 어떤 눈도 $6$을 넘지 않는다. 따라서 전체는 $3+6+10=19$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 8,
    "level": "하",
    "category": "함수의 개수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "집합 $X=\\{1,2,3,4\\}$에 대하여 함수 $f:X\\to X$ 중에서 $f(1)\\ne1$이고 일대일 대응인 $f$의 개수는? [3.8점]",
    "choices": [
      "$10$",
      "$12$",
      "$16$",
      "$18$",
      "$36$"
    ],
    "answer": "④",
    "solution": "[키포인트] 유한집합 $X$에서 자기 자신으로 가는 일대일 대응은 원소 4개의 순열과 같다.\n정석 풀이: 전체 일대일 대응은 $4!=24$개이다. 이 중 $f(1)=1$인 경우에는 나머지 세 원소만 순열하므로 $3!=6$개이다. 따라서 $f(1)\\ne1$인 경우는 $24-6=18$개이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 9,
    "level": "중",
    "category": "유리함수의 그래프",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "그래프"
    ],
    "wide": false,
    "content": "함수 $y=\\dfrac{k}{x+a}+b$의 그래프가 그림과 같을 때, 상수 $a$, $b$, $k$의 합 $a+b+k$의 값은? [3.9점]",
    "choices": [
      "$1$",
      "$3$",
      "$5$",
      "$7$",
      "$9$"
    ],
    "answer": "②",
    "solution": "[키포인트] $y=\\dfrac{k}{x+a}+b$의 점근선은 $x=-a$, $y=b$이다.\n조건 정리: 그림에서 수직점근선은 $x=3$, 수평점근선은 $y=2$, $x$절편은 $1$이다.\n정석 풀이: $-a=3$이므로 $a=-3$, $b=2$이다. 또 $x=1$에서 $y=0$이므로 $0=\\dfrac{k}{1-3}+2=-\\dfrac{k}{2}+2$에서 $k=4$이다. 따라서 $a+b+k=-3+2+4=3$이다.\n따라서 정답은 ②이다.",
    "image": "assets/images/24_강남여고_2학기_기말_고1_기출/q9.png"
  },
  {
    "id": 10,
    "level": "중",
    "category": "무리식의 계산",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "$x=\\dfrac{\\sqrt3+1}{\\sqrt3-1}$일 때, $\\dfrac{\\sqrt{x}-1}{\\sqrt{x}+1}+\\dfrac{\\sqrt{x}+1}{\\sqrt{x}-1}$의 값은? [4점]",
    "choices": [
      "$-2\\sqrt3$",
      "$-\\sqrt3$",
      "$2\\sqrt3$",
      "$\\sqrt3$",
      "$3\\sqrt3$"
    ],
    "answer": "③",
    "solution": "[키포인트] 두 분수를 통분하면 $\\sqrt{x}$가 사라지고 $x$에 대한 식으로 간단해진다.\n정석 풀이: 주어진 식을 $E$라 하면 $E=\\dfrac{(\\sqrt{x}-1)^2+(\\sqrt{x}+1)^2}{x-1}=\\dfrac{2(x+1)}{x-1}$이다. 또 $x=\\dfrac{\\sqrt3+1}{\\sqrt3-1}$이므로 $x+1=\\dfrac{2\\sqrt3}{\\sqrt3-1}$, $x-1=\\dfrac2{\\sqrt3-1}$이다. 따라서 $\\dfrac{x+1}{x-1}=\\sqrt3$이고 $E=2\\sqrt3$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 11,
    "level": "중",
    "category": "경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "세 자리 자연수 중에서 백의 자리 수는 소수, 십의 자리 수는 $2$의 배수, 일의 자리 수는 $6$의 약수인 것의 개수는? [4.1점]",
    "choices": [
      "$64$",
      "$72$",
      "$82$",
      "$96$",
      "$102$"
    ],
    "answer": "①",
    "solution": "[키포인트] 각 자리에서 가능한 숫자의 개수를 구한 뒤 곱의 법칙을 적용한다.\n조건 정리: 백의 자리의 소수는 $2,3,5,7$의 4가지, 십의 자리의 한 자리 양의 $2$의 배수는 $2,4,6,8$의 4가지, 일의 자리의 $6$의 약수는 $1,2,3,6$의 4가지이다.\n정석 풀이: 각 자리의 선택은 서로 독립이므로 경우의 수는 $4\\times4\\times4=64$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 12,
    "level": "중",
    "category": "순열",
    "originalCategory": "순열",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-07",
    "standardUnit": "순열",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "3명의 남자와 4명의 여자를 일렬로 세울 때, 앞에서 두 번째와 네 번째에 남자가 오도록 세우는 방법의 수는? [4.2점]",
    "choices": [
      "$144$",
      "$256$",
      "$312$",
      "$540$",
      "$720$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 지정된 두 자리에 들어갈 남자를 먼저 정하고 나머지 사람을 남은 자리에 배열한다.\n정석 풀이: 두 번째와 네 번째 자리에 들어갈 남자 2명을 순서 있게 고르는 방법은 ${}_3P_2=6$가지이다. 남은 남자 1명과 여자 4명, 총 5명을 나머지 5자리에 배열하는 방법은 $5!=120$가지이다. 따라서 전체는 $6\\times120=720$가지이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 13,
    "level": "중",
    "category": "합성함수의 반복",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\dfrac1{1-x}$에 대하여 $f^{1662}(2)$의 값은? (단, $f^{n+1}(x)=(f^n\\circ f)(x)$) [4.3점]",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$9$"
    ],
    "answer": "①",
    "solution": "[키포인트] 반복합성의 주기를 먼저 찾으면 큰 지수도 쉽게 처리할 수 있다.\n정석 풀이: $f(2)=-1$, $f^2(2)=f(-1)=\\dfrac12$, $f^3(2)=f(\\dfrac12)=2$이다. 따라서 세 번 합성할 때마다 값이 다시 $2$로 돌아온다. $1662=3\\times554$이므로 $f^{1662}(2)=2$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 14,
    "level": "중",
    "category": "무리함수의 최댓값과 최솟값",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "$2\\le x\\le a$에서 $y=\\sqrt{3x-2}+2$의 최솟값이 $m$, 최댓값이 $12$일 때, 상수 $a$, $m$의 합 $a+m$의 값은? [4.4점]",
    "choices": [
      "$14$",
      "$24$",
      "$38$",
      "$42$",
      "$45$"
    ],
    "answer": "③",
    "solution": "[키포인트] $y=\\sqrt{3x-2}+2$는 $x$가 커질수록 함수값이 커지므로 양 끝점에서 최솟값과 최댓값을 갖는다.\n정석 풀이: $x=2$일 때 $m=\\sqrt4+2=4$이다. 최댓값이 $12$이므로 $\\sqrt{3a-2}+2=12$, 따라서 $3a-2=100$에서 $a=34$이다. 그러므로 $a+m=34+4=38$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 15,
    "level": "중",
    "category": "순열",
    "originalCategory": "순열",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-07",
    "standardUnit": "순열",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "$b,e,t,i,f,u,l$의 7개의 문자를 일렬로 나열할 때, 양 끝에 모두 자음이 오는 경우의 수는? [4.5점]",
    "choices": [
      "$720$",
      "$1080$",
      "$1440$",
      "$2880$",
      "$3600$"
    ],
    "answer": "③",
    "solution": "[키포인트] 자음으로 양 끝을 먼저 채운 뒤 나머지 문자를 가운데에 배열한다.\n조건 정리: 자음은 $b,t,f,l$의 4개이다.\n정석 풀이: 양 끝에 올 서로 다른 자음 2개를 순서 있게 고르는 방법은 ${}_4P_2=12$가지이고, 남은 5개 문자를 가운데 5자리에 배열하는 방법은 $5!=120$가지이다. 따라서 전체는 $12\\times120=1440$가지이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 16,
    "level": "중",
    "category": "무리함수와 넓이",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "그래프"
    ],
    "wide": false,
    "content": "두 곡선 $y=\\sqrt{x+5}$, $y=\\sqrt{x}$와 $x$축 및 $y=2$로 둘러싸인 부분의 넓이는? [4.6점]",
    "choices": [
      "$6$",
      "$10$",
      "$12$",
      "$16$",
      "$20$"
    ],
    "answer": "②",
    "solution": "[키포인트] 두 그래프는 $x$축 방향으로 정확히 $5$만큼 평행이동한 관계이므로 같은 높이에서 두 곡선 사이의 가로 길이는 항상 $5$이다.\n정석 풀이: $y=\\sqrt{x}$를 $x$에 대해 나타내면 $x=y^2$이고, $y=\\sqrt{x+5}$는 $x=y^2-5$이다. 따라서 $0\\le y\\le2$에서 두 곡선 사이의 가로 길이는 $y^2-(y^2-5)=5$로 일정하다. 높이가 $2$이므로 둘러싸인 부분의 넓이는 $5\\times2=10$이다.\n따라서 정답은 ②이다.",
    "image": "assets/images/24_강남여고_2학기_기말_고1_기출/q16.png"
  },
  {
    "id": 17,
    "level": "중",
    "category": "역함수와 합성함수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "$f(x)=\\dfrac1{x-1}$, $g(x)=\\dfrac{x+2}{x}$이고, $(f^{-1}\\circ g^{-1})(a)=2$, $(g^{-1}\\circ f^{-1})(b)=2$일 때, $a+b$의 값은? [4.7점]",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "①",
    "solution": "[키포인트] 두 함수의 역함수를 먼저 구한 뒤 합성 조건에 대입한다.\n정석 풀이: $f^{-1}(x)=1+\\dfrac1x=\\dfrac{x+1}{x}$이고, $g^{-1}(x)=\\dfrac2{x-1}$이다. 따라서 $(f^{-1}\\circ g^{-1})(a)=1+\\dfrac{a-1}{2}=2$에서 $a=3$이다. 또 $(g^{-1}\\circ f^{-1})(b)=\\dfrac{2}{(b+1)/b-1}=2b=2$이므로 $b=1$이다. 따라서 $a+b=4$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 18,
    "level": "중",
    "category": "조합",
    "originalCategory": "조합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-08",
    "standardUnit": "조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "다음 등식을 만족하는 자연수 $n$의 값은? [4.8점]<br>${}_{n+2}C_2+{}_{n+1}C_2=100$",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "④",
    "solution": "[키포인트] 조합식을 곱셈식으로 바꾸면 완전제곱식이 된다.\n정석 풀이: ${}_{n+2}C_2+{}_{n+1}C_2=\\dfrac{(n+2)(n+1)}2+\\dfrac{n(n+1)}2=(n+1)^2$이다. 따라서 $(n+1)^2=100$이고 $n$은 자연수이므로 $n+1=10$, 즉 $n=9$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 19,
    "level": "상",
    "category": "색칠하는 경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형"
    ],
    "wide": false,
    "content": "그림의 $A$, $B$, $C$, $D$, $E$, $F$ 6개 영역을 서로 다른 4가지 색을 칠하려고 한다. 같은 색은 여러 번 사용할 수 있으나 인접하는 영역은 서로 다른 색으로 칠하려고 한다. 칠하는 방법의 수는? [4.9점]",
    "choices": [
      "$108$",
      "$128$",
      "$144$",
      "$204$",
      "$288$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 모든 다른 영역과 맞닿는 $A$의 색을 먼저 정하면 좌우 영역의 색칠을 독립적으로 셀 수 있다.\n조건 정리: $A$는 $B,C,D,E,F$와 모두 인접하고, 왼쪽에서는 $B$와 $C$가, 오른쪽에서는 $D$와 $E$, $E$와 $F$가 인접한다.\n정석 풀이: $A$의 색은 4가지이다. $A$의 색을 고정하면 $B$는 3가지, $C$는 $A$와 $B$의 색을 피해야 하므로 2가지여서 왼쪽은 $3\\times2=6$가지이다. 오른쪽은 $D$가 3가지, $E$가 2가지, $F$가 $A$와 $E$의 색을 피하는 2가지이므로 $3\\times2\\times2=12$가지이다. 따라서 전체는 $4\\times6\\times12=288$가지이다.\n따라서 정답은 ⑤이다.",
    "image": "assets/images/24_강남여고_2학기_기말_고1_기출/q19.png"
  },
  {
    "id": 20,
    "level": "중",
    "category": "조합",
    "originalCategory": "조합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-08",
    "standardUnit": "조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "어느 건물의 1층에서 5명이 함께 승강기를 탔다. 승강기를 타고 올라가다가 3층에서 2명, 4층에서 1명이 내리고, 6, 7, 8층 중 어느 한 층에서 2명이 함께 내린다고 할 때, 내리는 방법의 수는? [5점]",
    "choices": [
      "$90$",
      "$120$",
      "$150$",
      "$180$",
      "$210$"
    ],
    "answer": "①",
    "solution": "[키포인트] 3층에서 내릴 두 사람, 4층에서 내릴 한 사람, 마지막 두 사람이 함께 내릴 층을 차례로 정한다.\n정석 풀이: 3층에서 내릴 2명을 고르는 방법은 ${}_5C_2=10$가지이다. 남은 3명 중 4층에서 내릴 1명을 고르는 방법은 3가지이다. 마지막 두 사람은 함께 6층, 7층, 8층 중 한 층에서 내리므로 3가지이다. 따라서 전체는 $10\\times3\\times3=90$가지이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 21,
    "level": "중",
    "category": "유리함수와 점근선",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "그래프"
    ],
    "wide": false,
    "content": "유리함수 $y=\\dfrac{k}{x-3}+2$가 제 $1$, $2$, $3$, $4$사분면을 모두 지나도록 하는 정수 $k$의 최솟값을 구하시오. [4점]",
    "choices": [],
    "answer": "$7$",
    "solution": "[키포인트] 그래프가 제3사분면까지 지나기 위한 조건이 가장 강한 조건이다.\n조건 정리: $(x-3)(y-2)=k$이고 그래프의 중심은 $(3,2)$이다.\n풀이 방향: 제3사분면의 점에서는 $x\\lt0$, $y\\lt0$이므로 $x-3\\lt-3$, $y-2\\lt-2$이다.\n정석 풀이: 제3사분면의 점이 존재하려면 $k=(x-3)(y-2)\\gt6$이어야 한다. 반대로 $k\\gt6$이면 왼쪽 가지는 $x\\lt0$에서 제2, 제3사분면을 모두 지나고, $0\\lt x\\lt3$에서 제4사분면을 지나며, 오른쪽 가지는 제1사분면을 지난다. 따라서 필요한 조건은 $k\\gt6$이다.\n정수 $k$의 최솟값은 $7$이다.\n따라서 구하는 값은 $7$이다."
  },
  {
    "id": 22,
    "level": "중",
    "category": "나머지와 경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "content": "$1$에서 $60$까지의 자연수를 $7$로 나누었을 때, 나머지가 홀수인 경우의 수를 구하시오. [5점]",
    "choices": [],
    "answer": "$26$",
    "solution": "[키포인트] $7$개씩 한 묶음으로 나누어 나머지의 반복을 센다.\n정석 풀이: $1$부터 $56$까지는 $7$개씩 8묶음이고, 각 묶음에서 홀수 나머지 $1,3,5$가 각각 한 번씩 나오므로 $8\\times3=24$개이다. 남은 $57,58,59,60$의 나머지는 각각 $1,2,3,4$이므로 홀수 나머지는 57과 59의 2개이다. 따라서 전체는 $24+2=26$개이다.\n따라서 구하는 값은 $26$이다."
  },
  {
    "id": 23,
    "level": "중",
    "category": "조합",
    "originalCategory": "조합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-08",
    "standardUnit": "조합",
    "standardUnitOrder": 8,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "content": "옥순이가 친구 9명 중에서 6명을 생일파티를 위해 집에 초대할 때, 다음을 구하시오. [5점]<br>(1) 친구를 초대하는 모든 경우의 수 [2점]<br>(2) 친구 9명 중 3명은 세쌍둥이일 때, 이 세쌍둥이를 모두 초대하거나 3명 모두를 초대하지 않는 모든 경우의 수 [3점]",
    "choices": [],
    "answer": "(1) $84$, (2) $21$",
    "solution": "[키포인트] 순서를 고려하지 않는 사람 선택이므로 조합을 사용하고, (2)는 세쌍둥이를 모두 초대하는 경우와 한 명도 초대하지 않는 경우를 나눈다.\n정석 풀이: (1) 9명 중 6명을 고르므로 ${}_9C_6={}_9C_3=84$이다.\n(2) 세쌍둥이 3명을 모두 초대하면 나머지 6명 중 3명을 더 고르므로 ${}_6C_3=20$가지이다. 세쌍둥이를 아무도 초대하지 않으면 나머지 6명을 모두 초대해야 하므로 ${}_6C_6=1$가지이다. 따라서 $20+1=21$가지이다.\n따라서 구하는 값은 (1) $84$, (2) $21$이다."
  },
  {
    "id": 24,
    "level": "상",
    "category": "무리함수와 유리함수",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "그래프"
    ],
    "wide": false,
    "content": "무리함수 $y=\\sqrt{ax+b}+c$의 그래프가 그림과 같을 때, 유리함수 $y=\\dfrac{cx+3}{ax+b}$의 두 점근선의 좌표를 $(m,n)$이라 할 때, $m+n$의 값은? [6점]",
    "choices": [],
    "answer": "$1$",
    "solution": "[키포인트] 무리함수의 시작점과 $y$절편으로 $a,b,c$를 먼저 결정한 뒤 유리함수의 점근선을 구한다.\n조건 정리: 그림의 시작점은 $(-1,2)$이고 그래프는 $y$축과 $(0,3)$에서 만난다.\n정석 풀이: 시작점에서 $ax+b=0$이므로 $-a+b=0$, 즉 $b=a$이고, 시작점의 함수값이 2이므로 $c=2$이다. 또 $x=0$일 때 $3=\\sqrt b+2$이므로 $b=1$, 따라서 $a=1$이다. 유리함수는 $y=\\dfrac{2x+3}{x+1}=2+\\dfrac1{x+1}$이므로 두 점근선은 $x=-1$, $y=2$이다. 따라서 $(m,n)=(-1,2)$이고 $m+n=1$이다.\n따라서 구하는 값은 $1$이다.",
    "image": "assets/images/24_강남여고_2학기_기말_고1_기출/q24.png"
  }
];
