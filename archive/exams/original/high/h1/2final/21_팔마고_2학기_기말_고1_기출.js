window.examTitle = "21_팔마고_2학기_기말_고1_기출";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "유리식의 부분분수",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "유리함수",
      "부분분수"
    ],
    "wide": false,
    "content": "분모를 $0$으로 하지 않는 모든 실수 $x$에 대하여 등식 $\\dfrac{3x+1}{x^2+3x+2}=\\dfrac{a}{x+2}+\\dfrac{b}{x+1}$가 성립할 때, 상수 $a,b$에 대하여 $a+b$의 값은? [4.2점]",
    "choices": [
      "$-1$",
      "$1$",
      "$2$",
      "$3$",
      "$5$"
    ],
    "answer": "④",
    "solution": "[키포인트] 분모를 인수분해한 뒤 양변의 분자를 비교한다.\n조건 정리: $x^2+3x+2=(x+1)(x+2)$이다.\n풀이 방향: 우변을 하나의 분수로 통분하여 $x$의 계수와 상수항을 비교한다.\n정석 풀이: $\\dfrac{a}{x+2}+\\dfrac{b}{x+1}=\\dfrac{a(x+1)+b(x+2)}{(x+1)(x+2)}=\\dfrac{(a+b)x+(a+2b)}{(x+1)(x+2)}$이다. 따라서 $a+b=3$, $a+2b=1$이다. 두 식을 빼면 $b=-2$이고 $a=5$이므로 $a+b=3$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 2,
    "level": "중",
    "category": "무리식의 정의 조건",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "무리함수",
      "무리식",
      "정의조건"
    ],
    "wide": false,
    "content": "무리식 $\\dfrac{\\sqrt{x}-3}{\\sqrt{2-x}}+\\sqrt{-2x+1}$의 값이 실수이기 위한 $x$값의 범위에 속하는 정수의 개수는? [4.2점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "①",
    "solution": "[키포인트] 분자·분모의 근호 조건과 분모가 $0$이 되지 않는 조건을 동시에 만족시킨다.\n조건 정리: $\\sqrt{x}$에서 $x\\ge0$, 분모 $\\sqrt{2-x}$에서 $2-x\\gt0$, $\\sqrt{-2x+1}$에서 $-2x+1\\ge0$이다.\n풀이 방향: 세 조건의 공통 범위를 구한 뒤 그 안의 정수를 센다.\n정석 풀이: 조건을 정리하면 $x\\ge0$, $x\\lt2$, $x\\le\\dfrac12$이다. 따라서 공통 범위는 $0\\le x\\le\\dfrac12$이고, 이 범위에 속하는 정수는 $0$ 하나뿐이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 3,
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
      "유리함수",
      "그래프",
      "점근선",
      "대칭"
    ],
    "wide": false,
    "content": "다음 중 유리함수 $y=\\dfrac{-3x+2}{x+1}$의 그래프에 대한 설명으로 옳지 않은 것은? [4.6점]",
    "choices": [
      "점 $(-2,-8)$을 지난다.",
      "점근선은 두 직선 $x=-1$, $y=-3$이다.",
      "직선 $y=x-2$에 대하여 대칭이다.",
      "평행이동하였을 때, 유리함수 $y=\\dfrac{3x+8}{x+1}$의 그래프와 겹쳐진다.",
      "그래프는 제$2$사분면을 지나지 않는다."
    ],
    "answer": "⑤",
    "solution": "[키포인트] 식을 $y=-3+\\dfrac5{x+1}$로 고쳐 중심과 점근선을 읽고 각 보기를 확인한다.\n조건 정리: 그래프의 중심은 $(-1,-3)$이고 점근선은 $x=-1$, $y=-3$이다.\n풀이 방향: 점 대입, 대칭축, 평행이동, 사분면 통과 여부를 차례로 판정한다.\n정석 풀이: $x=-2$이면 $y=-8$이므로 ①은 옳다. 중심을 지나는 기울기 $1$인 대칭축은 $y+3=x+1$, 즉 $y=x-2$이므로 ③도 옳다. 또 $y=\\dfrac{3x+8}{x+1}=3+\\dfrac5{x+1}$은 주어진 그래프를 위로 $6$만큼 평행이동한 그래프이므로 ④도 옳다. 한편 $-1\\lt x\\lt0$이면 분자와 분모가 모두 양수이므로 $x\\lt0$, $y\\gt0$인 제2사분면 위의 점이 존재한다. 따라서 ⑤가 옳지 않다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 4,
    "level": "중",
    "category": "무리함수와 역함수",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "무리함수",
      "역함수",
      "그래프",
      "보기"
    ],
    "wide": false,
    "content": "다음 보기에서 무리함수 $y=-\\sqrt{-2x+1}+2$에 대한 설명으로 옳은 것만을 있는 대로 고른 것은? [4.6점]<div class=\"question-note-box\">&lt;보기&gt;<br>ㄱ. 정의역은 $\\left\\{x\\mid x\\le\\dfrac12\\right\\}$이다.<br>ㄴ. 무리함수 $y=-\\sqrt{2x}$의 그래프를 평행이동 하였을 때, 주어진 무리함수의 그래프와 겹쳐진다.<br>ㄷ. 그래프는 제$4$사분면을 지나지 않는다.<br>ㄹ. 역함수는 $y=-\\dfrac12(x-2)^2+\\dfrac12$ (단, $x\\le\\dfrac12$)이다.</div>",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄷ, ㄹ",
      "ㄴ, ㄷ, ㄹ"
    ],
    "answer": "③",
    "solution": "[키포인트] 정의역, 그래프의 방향, 사분면, 역함수의 정의역을 각각 확인한다.\n조건 정리: $-2x+1\\ge0$이므로 정의역은 $x\\le\\dfrac12$이고, 함수값은 항상 $2$ 이하이다.\n풀이 방향: ㄱ~ㄹ을 하나씩 판정한다.\n정석 풀이: ㄱ은 정의역 조건에서 참이다. ㄴ의 $y=-\\sqrt{2x}$는 오른쪽으로 뻗는 그래프인데 주어진 함수는 왼쪽으로 뻗으므로 평행이동만으로 서로 겹칠 수 없어 거짓이다. $0\\lt x\\le\\dfrac12$에서는 함수값이 양수이므로 제4사분면을 지나지 않아 ㄷ은 참이다. 역함수는 $y=-\\dfrac12(x-2)^2+\\dfrac12$이지만 그 정의역은 원래 함수의 치역인 $x\\le2$이므로 ㄹ은 거짓이다. 따라서 옳은 것은 ㄱ, ㄷ이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 5,
    "level": "중",
    "category": "유리함수의 역함수와 평행이동",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "유리함수",
      "역함수",
      "평행이동"
    ],
    "wide": false,
    "content": "유리함수 $f(x)=\\dfrac{3x+1}{x-2}$에 대하여 $y=f(x)$의 그래프를 $x$축의 방향으로 $a$만큼, $y$축의 방향으로 $b$만큼 평행이동하면 $y=f^{-1}(x)$의 그래프와 일치한다고 한다. 이때, $a,b$의 곱 $ab$의 값은? [4.9점]",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "③",
    "solution": "[키포인트] 먼저 역함수를 구한 뒤 두 유리함수의 점근선 위치를 비교한다.\n조건 정리: $f(x)=3+\\dfrac7{x-2}$이다.\n풀이 방향: $x,y$를 바꾸어 $f^{-1}$을 구하고 평행이동량을 읽는다.\n정석 풀이: $x=\\dfrac{3y+1}{y-2}$에서 $xy-2x=3y+1$이므로 $y=\\dfrac{2x+1}{x-3}=2+\\dfrac7{x-3}$이다. 따라서 $f$의 그래프를 오른쪽으로 $1$만큼 옮기면 수직점근선이 $x=3$이 되고, 아래로 $1$만큼 옮기면 수평점근선이 $y=2$가 되어 역함수의 그래프와 일치한다. 그러므로 $a=1$, $b=-1$이고 $ab=-1$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 6,
    "level": "상",
    "category": "무리함수와 역함수의 대칭",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "무리함수",
      "역함수",
      "대칭",
      "원"
    ],
    "wide": false,
    "content": "좌표평면에서 무리함수 $f(x)=-\\sqrt{-2x}$의 그래프와 원 $(x+2)^2+(y+2)^2=1$이 만나는 두 점을 각각 $P,Q$라 하고, 함수 $y=f(x)$의 역함수 $y=f^{-1}(x)$의 그래프와 원 $(x+2)^2+(y+2)^2=1$이 만나는 두 점을 $R,S$라 하자. 두 직선 $PQ,RS$의 기울기를 각각 $a_1,a_2$라 할 때, $\\dfrac12a_1a_2$의 값은? [5점]",
    "choices": [
      "$\\dfrac12$",
      "$\\dfrac{\\sqrt2}{2}$",
      "$1$",
      "$\\sqrt2$",
      "$2$"
    ],
    "answer": "①",
    "solution": "[키포인트] 역함수의 그래프는 원래 함수의 그래프를 직선 $y=x$에 대하여 대칭이동한 것이다.\n조건 정리: 원 $(x+2)^2+(y+2)^2=1$도 $x$와 $y$를 서로 바꾸어도 식이 같으므로 직선 $y=x$에 대하여 대칭이다.\n풀이 방향: $P,Q$를 $y=x$에 대하여 대칭이동한 점이 각각 역함수와 원의 교점이므로 직선 $RS$는 직선 $PQ$의 대칭선이다.\n정석 풀이: 기울기가 $a_1$인 직선을 $y=x$에 대하여 대칭이동하면 $x,y$의 역할이 바뀌므로 기울기는 $\\dfrac1{a_1}$이 된다. 따라서 $a_2=\\dfrac1{a_1}$이고 $a_1a_2=1$이다. 그러므로 $\\dfrac12a_1a_2=\\dfrac12$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 7,
    "level": "중",
    "category": "조건이 있는 순열",
    "originalCategory": "순열",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-07",
    "standardUnit": "순열",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "순열",
      "조건부배열"
    ],
    "wide": false,
    "content": "$5$개의 숫자 $1,2,3,4,5$를 일렬로 나열하여 다섯 자리의 자연수 $a_1a_2a_3a_4a_5$를 만들 때, $a_1\\ne5$, $a_2=2$, $a_k\\ne k\\ (k=1,3,4,5)$를 만족시키는 자연수의 개수는? [4.2점]",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "②",
    "solution": "[키포인트] $a_2=2$를 고정한 뒤 첫째 자리의 가능한 값을 나누어 센다.\n조건 정리: 첫째 자리는 $1,5$가 될 수 없으므로 $a_1=3$ 또는 $4$이다.\n풀이 방향: $a_1=3$인 경우와 $a_1=4$인 경우를 각각 센다.\n정석 풀이: $a_1=3$이면 남은 숫자 $1,4,5$를 셋째~다섯째 자리에 놓되 $a_4\\ne4$, $a_5\\ne5$여야 한다. 전체 $3!=6$가지에서 $a_4=4$인 $2$가지와 $a_5=5$인 $2$가지를 빼고 둘 다인 $1$가지를 더하면 $3$가지이다. $a_1=4$일 때도 같은 방법으로 $a_3\\ne3$, $a_5\\ne5$를 적용하면 $3$가지이다. 따라서 전체는 $3+3=6$가지이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 8,
    "level": "중",
    "category": "색칠하는 경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "경우의수",
      "색칠하기",
      "도형"
    ],
    "wide": false,
    "content": "오른쪽 그림의 영역 $A,B,C,D$ $4$개를 서로 다른 $4$가지 색으로 칠하려고 한다. 같은 색을 여러 번 사용해도 좋으나 인접하는 영역은 서로 다른 색으로 칠하는 모든 방법의 수를 구하면? [4.3점]",
    "choices": [
      "$80$",
      "$84$",
      "$88$",
      "$92$",
      "$96$"
    ],
    "answer": "②",
    "solution": "[키포인트] 그림에서 $A$와 $C$, $B$와 $D$는 서로 변을 공유하지 않아 같은 색을 써도 된다.\n조건 정리: 인접 관계는 $A-B$, $A-D$, $B-C$, $C-D$이다.\n풀이 방향: 먼저 $A$의 색을 정한 뒤 $B,D$의 색이 같은 경우와 다른 경우로 나눈다.\n정석 풀이: $A$의 색은 $4$가지이다. $A$의 색을 고정하면 $B$는 $3$가지이다. $B=D$인 경우 $D$의 색은 $B$와 같게 $1$가지이고, $C$는 그 색과 다른 $3$가지이므로 $3\\times3=9$가지이다. $B\\ne D$인 경우 $B,D$의 색 선택은 $3\\times2=6$가지이고, $C$는 두 색 모두와 달라야 하므로 $2$가지여서 $12$가지이다. 따라서 전체는 $4(9+12)=84$가지이다.\n따라서 정답은 ②이다.",
    "image": "assets/images/21_팔마고_2학기_기말_고1_기출/q8.png"
  },
  {
    "id": 9,
    "level": "중",
    "category": "조합의 성질",
    "originalCategory": "조합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-08",
    "standardUnit": "조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "조합",
      "파스칼항등식",
      "증명"
    ],
    "wide": false,
    "content": "다음은 $1\\le r\\lt n$일 때, 등식 ${}_{n-1}C_{r-1}+{}_{n-1}C_r=\\boxed{(가)}$가 성립함을 증명한 것이다.<div class=\"question-note-box\">&lt;증명&gt;<br>${}_{n-1}C_{r-1}+{}_{n-1}C_r$<br>$=\\dfrac{(n-1)!}{(r-1)!\\{(n-1)-(r-1)\\}!}+\\dfrac{(n-1)!}{r!\\{(n-1)-r\\}!}$<br>$=\\dfrac{\\boxed{(나)}(n-1)!}{\\boxed{(나)}(r-1)!(n-r)!}+\\dfrac{\\boxed{(다)}(n-1)!}{r!\\boxed{(다)}(n-r-1)!}$<br>$=\\dfrac{n!}{r!(n-r)!}$<br>$=\\boxed{(가)}$</div>위 증명에서 (가), (나), (다)에 알맞은 것은? [4.7점]",
    "choices": [
      "${}_nC_{r-1},\\ r-1,\\ n$",
      "${}_nC_{r-1},\\ r-1,\\ n-r$",
      "${}_nC_r,\\ r-1,\\ n-r$",
      "${}_nC_r,\\ r,\\ n-r$",
      "${}_nC_r,\\ r,\\ n$"
    ],
    "answer": "④",
    "solution": "[키포인트] 두 분수를 공통분모 $r!(n-r)!$로 맞추는 과정에서 필요한 인수를 찾는다.\n조건 정리: 첫째 항의 분모에는 $r$이, 둘째 항의 분모에는 $n-r$가 부족하다.\n풀이 방향: 각 분수의 분자와 분모에 같은 인수를 곱한 뒤 마지막 식을 조합 기호로 바꾼다.\n정석 풀이: 첫째 분수에는 $r$을 곱해야 하므로 (나)는 $r$이고, 둘째 분수에는 $n-r$를 곱해야 하므로 (다)는 $n-r$이다. 두 분자를 더하면 $r(n-1)!+(n-r)(n-1)!=n!$이므로 전체는 $\\dfrac{n!}{r!(n-r)!}={}_nC_r$이다. 따라서 (가)는 ${}_nC_r$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 10,
    "level": "중",
    "category": "순열과 조합의 성질",
    "originalCategory": "조합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-08",
    "standardUnit": "조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "순열",
      "조합",
      "항등식"
    ],
    "wide": false,
    "content": "다음 중 옳은 식을 고르면? [4.7점]",
    "choices": [
      "${}_nP_r=n\\times{}_{n-1}P_r\\ (1\\le r\\le n)$",
      "${}_nP_r={}_{n-1}P_{r-1}+{}_nP_{r-1}\\ (1\\le r\\lt n)$",
      "$r\\times{}_nC_r={}_{n-1}C_{r-1}+{}_{n-1}C_r\\ (0\\lt r\\le n)$",
      "${}_nC_r={}_{n-1}C_{r-1}+{}_nC_{r-1}\\ (1\\le r\\le n)$",
      "$r\\times{}_nC_r=n\\times{}_{n-1}C_{r-1}\\ (1\\le r\\le n)$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 각 식을 순열·조합의 팩토리얼 표현으로 확인한다.\n조건 정리: ${}_nC_r=\\dfrac{n!}{r!(n-r)!}$이다.\n풀이 방향: ⑤의 양변을 직접 정리하고 나머지는 기본 항등식과 비교한다.\n정석 풀이: ⑤의 왼쪽은 $r{}_nC_r=\\dfrac{n!}{(r-1)!(n-r)!}$이다. 오른쪽은 $n{}_{n-1}C_{r-1}=n\\dfrac{(n-1)!}{(r-1)!(n-r)!}=\\dfrac{n!}{(r-1)!(n-r)!}$이므로 두 값이 같다. 나머지 식들은 순열의 기본식 ${}_nP_r=n{}_{n-1}P_{r-1}$ 또는 조합의 기본식 ${}_nC_r={}_{n-1}C_{r-1}+{}_{n-1}C_r$와 일치하지 않는다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 11,
    "level": "중",
    "category": "여러 가지 경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "경우의수",
      "순열",
      "조합",
      "배수"
    ],
    "wide": false,
    "content": "다음에 주어진 $A,B,C$의 값을 큰 것부터 차례대로 나열한 것은? [4.7점]<div class=\"question-note-box\">$A$: 남자 $3$명과 여자 $3$명을 일렬로 세울 때, 남자와 여자가 교대로 서는 방법의 수<br>$B$: 서로 다른 $5$개의 학교 학생이 각각 $2$명씩 있다. 이 $10$명의 학생 중에서 임의로 $3$명을 선택할 때, 같은 학교의 학생이 동시에 선택되지 않을 경우의 수<br>$C$: $5$개의 숫자 $1,2,3,4,5$ 중에서 서로 다른 $3$개를 택하여 세 자리의 자연수를 만들 때, $3$의 배수의 개수</div>",
    "choices": [
      "B-A-C",
      "B-C-A",
      "A-B-C",
      "A-C-B",
      "C-A-B"
    ],
    "answer": "①",
    "solution": "[키포인트] $A,B,C$를 각각 독립적으로 계산한 뒤 크기를 비교한다.\n조건 정리: 교대 배열, 서로 다른 학교 선택, 자릿수 합의 $3$의 배수 조건을 이용한다.\n풀이 방향: 세 값을 차례로 구한다.\n정석 풀이: $A$는 남자부터 시작하거나 여자부터 시작하는 $2$가지에 남녀 각각의 배열 $3!$씩을 곱해 $A=2\\times3!\\times3!=72$이다. $B$는 $5$개 학교 중 $3$개를 고르고 각 학교에서 한 명씩 고르므로 $B={}_5C_3\\times2^3=80$이다. $C$는 나머지를 $3$으로 보았을 때 $0$인 숫자 $3$에서 하나, $1$인 $1,4$에서 하나, $2$인 $2,5$에서 하나를 골라야 하므로 숫자 집합은 $1\\times2\\times2=4$가지이고, 각 집합을 배열하는 방법이 $3!$가지여서 $C=24$이다. 따라서 $B\\gt A\\gt C$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 12,
    "level": "상",
    "category": "순열과 조합의 활용",
    "originalCategory": "조합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-08",
    "standardUnit": "조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "순열",
      "조합",
      "이차방정식",
      "근과계수"
    ],
    "wide": false,
    "content": "$x$에 대한 이차방정식 $10x^2-3\\times{}_nC_rx-3\\times{}_nP_{n-r}=0$의 두 근이 $-3$과 $6$일 때, 자연수 $n,r$에 대하여 $n-r$의 값은? [5점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "[키포인트] 두 근의 합과 곱으로 ${}_nC_r$, ${}_nP_{n-r}$의 값을 각각 구한다.\n조건 정리: 두 근의 합은 $3$, 곱은 $-18$이다.\n풀이 방향: 근과 계수의 관계를 적용한 뒤 조합값이 $10$인 $(n,r)$ 후보를 확인한다.\n정석 풀이: 근의 합에서 $\\dfrac{3{}_nC_r}{10}=3$이므로 ${}_nC_r=10$이다. 근의 곱에서 $-\\dfrac{3{}_nP_{n-r}}{10}=-18$이므로 ${}_nP_{n-r}=60$이다. ${}_nC_r=10$인 자연수 후보 중 $(n,r)=(5,2)$이면 ${}_5P_3=60$으로 두 조건을 모두 만족한다. 다른 후보 $(5,3)$, $(10,1)$, $(10,9)$는 순열 조건을 만족하지 않는다. 따라서 $n-r=5-2=3$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 13,
    "level": "중",
    "category": "조건을 만족하는 함수의 개수",
    "originalCategory": "함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-03",
    "standardUnit": "함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "함수",
      "일대일함수",
      "경우의수"
    ],
    "wide": false,
    "content": "두 집합 $X=\\{1,2,3,4,5\\}$, $Y=\\{2,3,4,5,6,7,8,9\\}$에 대하여 다음 조건을 모두 만족시키는 함수 $f:X\\to Y$의 개수는? [4.9점]<div class=\"question-note-box\">ㄱ. $x_1\\lt x_2$이면 $f(x_1)\\gt f(x_2)$<br>ㄴ. $f(3)=6$</div>",
    "choices": [
      "$6$",
      "$9$",
      "$18$",
      "$36$",
      "$72$"
    ],
    "answer": "③",
    "solution": "[키포인트] 함수값이 엄격히 감소하므로 각 쪽에서 사용할 값만 고르면 배열 순서는 자동으로 정해진다.\n조건 정리: $f(1)\\gt f(2)\\gt6\\gt f(4)\\gt f(5)$이다.\n풀이 방향: $6$보다 큰 값 두 개와 작은 값 두 개를 각각 고른다.\n정석 풀이: $6$보다 큰 값은 $7,8,9$이므로 $f(1),f(2)$에 사용할 두 값을 고르는 방법은 ${}_3C_2=3$가지이다. 고른 두 값은 큰 값부터 $f(1),f(2)$에 놓여야 하므로 추가 배열은 없다. $6$보다 작은 값은 $2,3,4,5$이고 $f(4),f(5)$에 사용할 두 값을 고르는 방법은 ${}_4C_2=6$가지이다. 역시 큰 값부터 놓이는 순서가 정해진다. 따라서 함수의 개수는 $3\\times6=18$개이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 14,
    "level": "중",
    "category": "유리함수와 무리함수의 그래프",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "무리함수",
      "유리함수",
      "그래프",
      "사분면"
    ],
    "wide": false,
    "content": "단답형1. 유리함수 $y=\\dfrac{bx+c}{x-a}$의 그래프가 오른쪽 그림과 같을 때, 무리함수 $y=a\\sqrt{x-b}+c$의 그래프가 지나는 사분면을 구하시오. [3점]",
    "choices": [],
    "answer": "제4사분면",
    "solution": "[키포인트] 유리함수의 점근선과 $y$절편의 위치에서 $a,b,c$의 부호를 읽는다.\n조건 정리: 그림에서 수직점근선 $x=a$는 $y$축의 왼쪽에 있으므로 $a\\lt0$, 수평점근선 $y=b$는 $x$축의 위쪽에 있으므로 $b\\gt0$이다. 또한 유리함수의 $y$절편이 음수이고 $y(0)=\\dfrac{c}{-a}$인데 $-a\\gt0$이므로 $c\\lt0$이다.\n풀이 방향: 이 부호들을 무리함수 $y=a\\sqrt{x-b}+c$의 정의역과 치역에 적용한다.\n정석 풀이: $x\\ge b\\gt0$이므로 그래프의 모든 점은 $y$축의 오른쪽에 있다. 또 $a\\lt0$이고 $\\sqrt{x-b}\\ge0$이므로 $a\\sqrt{x-b}\\le0$, 따라서 $y\\le c\\lt0$이다. 그러므로 그래프의 모든 점은 $x\\gt0$, $y\\lt0$인 제4사분면에 놓인다.\n따라서 구하는 사분면은 제4사분면이다.",
    "image": "assets/images/21_팔마고_2학기_기말_고1_기출/q14.png"
  },
  {
    "id": 15,
    "level": "중",
    "category": "무리함수의 최댓값과 최솟값",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "무리함수",
      "최댓값",
      "최솟값"
    ],
    "wide": false,
    "content": "단답형2. $a\\le x\\le10$에서 무리함수 $y=-\\sqrt{2x-4}-1$의 최댓값이 $-3$, 최솟값이 $m$일 때, $a+m$의 값을 구하시오. [4점]",
    "choices": [],
    "answer": "$-1$",
    "solution": "[키포인트] $x$가 커질수록 $\\sqrt{2x-4}$가 커지므로 함수는 주어진 구간에서 감소한다.\n조건 정리: 최댓값은 왼쪽 끝점 $x=a$, 최솟값은 오른쪽 끝점 $x=10$에서 갖는다.\n풀이 방향: 최댓값 조건으로 $a$를 구하고 $x=10$을 대입해 $m$을 구한다.\n정석 풀이: $-\\sqrt{2a-4}-1=-3$이므로 $\\sqrt{2a-4}=2$, 따라서 $2a-4=4$에서 $a=4$이다. 또 $m=-\\sqrt{20-4}-1=-4-1=-5$이다. 그러므로 $a+m=4-5=-1$이다.\n따라서 구하는 값은 $-1$이다."
  },
  {
    "id": 16,
    "level": "하",
    "category": "상자에 공을 넣는 경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-06",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 6,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "경우의수",
      "조합",
      "순열"
    ],
    "wide": false,
    "content": "단답형3. 서로 다른 상자 $A,B,C,D,E$ $5$개에 똑같은 공 $3$개를 넣을 때, 각 상자에 많아야 공 $1$개를 넣는 모든 방법의 수를 $a$, 서로 다른 공 $3$개를 넣을 때, 각 상자에 많아야 공 $1$개를 넣는 모든 방법의 수를 $b$라 할 때, $a$와 $b$의 값을 각각 구하시오. [4점]",
    "choices": [],
    "answer": "$a=10$, $b=60$",
    "solution": "[키포인트] 똑같은 공은 공이 들어갈 상자만 고르고, 서로 다른 공은 상자 선택과 공의 배치를 함께 고려한다.\n조건 정리: 공이 $3$개이고 한 상자에는 최대 $1$개만 들어가므로 항상 서로 다른 $3$개의 상자를 사용한다.\n풀이 방향: $a$는 조합, $b$는 순열로 계산한다.\n정석 풀이: 똑같은 공 $3$개를 넣는 경우에는 $5$개 상자 중 공을 넣을 $3$개를 고르면 되므로 $a={}_5C_3=10$이다. 서로 다른 공 $3$개를 넣는 경우에는 $5$개 상자 중 $3$개를 골라 세 공을 서로 다르게 배치하므로 $b={}_5P_3=5\\times4\\times3=60$이다.\n따라서 구하는 값은 $a=10$, $b=60$이다."
  },
  {
    "id": 17,
    "level": "중",
    "category": "사전식 배열의 순서",
    "originalCategory": "순열",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-07",
    "standardUnit": "순열",
    "standardUnitOrder": 7,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "순열",
      "사전식배열"
    ],
    "wide": false,
    "content": "단답형4. $5$개의 문자 $a,b,c,d,e$를 한 번씩만 사용하여 사전식으로 배열할 때, $cdbae$는 몇 번째에 있는지 구하시오. [4점]",
    "choices": [],
    "answer": "$63$",
    "solution": "[키포인트] 앞자리부터 목표 문자보다 앞선 문자가 올 수 있는 경우를 차례로 더하고 마지막에 $1$을 더한다.\n조건 정리: 목표 배열은 $c,d,b,a,e$이다.\n풀이 방향: 첫째, 둘째, 셋째 자리에서 앞서는 배열의 개수를 센다.\n정석 풀이: 첫째 자리가 $c$보다 작은 $a,b$이면 각각 뒤의 $4$문자를 자유롭게 배열하므로 $2\\times4!=48$개가 앞선다. 첫째가 $c$일 때 둘째가 $d$보다 작은 남은 문자 $a,b$이면 $2\\times3!=12$개가 앞선다. 앞의 두 자리가 $cd$일 때 셋째가 $b$보다 작은 $a$이면 $2!=2$개가 앞선다. 그 뒤 $a,e$는 목표 순서보다 앞서는 배열이 없다. 따라서 $cdbae$의 순서는 $48+12+2+1=63$번째이다.\n따라서 구하는 값은 $63$이다."
  },
  {
    "id": 18,
    "level": "상",
    "category": "조건이 있는 일렬배열",
    "originalCategory": "순열",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-07",
    "standardUnit": "순열",
    "standardUnitOrder": 7,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "순열",
      "이웃조건",
      "배열"
    ],
    "wide": false,
    "content": "단답형5. $A,B,C,D,E,F,G$ $7$명을 일렬로 세울 때, 다음 세 가지 조건을 모두 만족하도록 세우는 방법의 수를 구하면? [5점]<div class=\"question-note-box\">ㄱ. $A$는 반드시 $B$의 앞쪽에 선다.<br>ㄴ. $C$와 $D$는 이웃하게 선다.<br>ㄷ. $E$와 $F$는 이웃하지 않도록 선다.</div>",
    "choices": [],
    "answer": "$480$",
    "solution": "[키포인트] 먼저 $C,D$가 이웃하는 경우를 센 뒤, 그중 $E,F$까지 이웃하는 경우를 빼고 $A,B$의 앞뒤 조건을 적용한다.\n조건 정리: $CD$를 한 묶음으로 보면 $6$개의 대상을 배열하고 묶음 내부 순서는 $2$가지이다.\n풀이 방향: $CD$ 이웃 조건과 $EF$ 비이웃 조건을 포함배제 방식으로 처리한다.\n정석 풀이: $C,D$가 이웃하는 배열은 $6!\\times2$가지이다. 이 조건은 $A,B$의 이름을 서로 바꾸는 것과 대칭이므로 그중 $A$가 $B$보다 앞서는 경우는 절반인 $\\dfrac{6!\\times2}{2}=720$가지이다. 이제 $E,F$도 이웃하는 경우를 빼야 한다. $CD$, $EF$ 두 묶음과 $A,B,G$를 합한 $5$개 대상을 배열하고 두 묶음의 내부 순서를 정하면 $5!\\times2\\times2$가지이며, 그중 $A$가 앞서는 경우는 절반인 $240$가지이다. 따라서 조건을 모두 만족하는 경우는 $720-240=480$가지이다.\n따라서 구하는 값은 $480$이다."
  },
  {
    "id": 19,
    "level": "중",
    "category": "집합의 분할과 부분집합",
    "originalCategory": "집합",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-01",
    "standardUnit": "집합",
    "standardUnitOrder": 1,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "집합",
      "부분집합",
      "경우의수",
      "표"
    ],
    "wide": false,
    "content": "서술형1. 집합 $X=\\{1,2,3,4,5,6\\}$에 대하여 다음 조건을 만족시키는 $X$의 두 부분집합 $A,B$의 순서쌍 $(A,B)$의 개수를 채점기준에 알맞게 구하시오. [6점]<div class=\"question-note-box\">ㄱ. $A\\ne\\varnothing$, $B\\ne\\varnothing$<br>ㄴ. $A\\cap B=\\varnothing$, $A\\cup B=X$<br>ㄷ. $n(A)\\ge2$</div><table class=\"question-table\"><thead><tr><th>단계</th><th>채점기준</th><th>부분점수</th></tr></thead><tbody><tr><td>i</td><td>조합을 이용하여 식을 세우면</td><td>3</td></tr><tr><td>ii</td><td>식을 계산하는 과정을 보이면</td><td>2</td></tr><tr><td>iii</td><td>답을 적으면</td><td>1</td></tr></tbody></table>",
    "choices": [],
    "answer": "$56$",
    "solution": "[키포인트] $A$와 $B$가 서로소이고 합집합이 $X$이므로 $B$는 $A$의 여집합으로 하나로 정해진다.\n조건 정리: $A$는 공집합이 아니고 $n(A)\\ge2$이며, $B$도 공집합이 아니므로 $A=X$는 제외한다. 따라서 $2\\le n(A)\\le5$이다.\n풀이 방향: 가능한 크기별로 $A$를 고르면 $B=X\\setminus A$가 자동으로 결정된다.\n정석 풀이: 순서쌍 $(A,B)$의 개수는 $n(A)=2,3,4,5$인 $A$의 개수의 합과 같다. 따라서 ${}_6C_2+{}_6C_3+{}_6C_4+{}_6C_5=15+20+15+6=56$이다. 각 $A$에 대해 $B$는 정확히 하나로 정해지므로 추가로 곱할 경우의 수는 없다.\n따라서 구하는 값은 $56$이다."
  },
  {
    "id": 20,
    "level": "상",
    "category": "무리함수와 직선의 교점",
    "originalCategory": "무리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-05",
    "standardUnit": "무리함수",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "무리함수",
      "직선",
      "교점의개수",
      "표"
    ],
    "wide": false,
    "content": "서술형2. 무리함수 $y=\\sqrt{4x-8}$의 그래프와 직선 $y=x+k$가 한 점에서 만나기 위한 실수 $k$값의 범위를 채점기준에 알맞게 구하시오. [7점]<table class=\"question-table\"><thead><tr><th>단계</th><th>채점기준</th><th>부분점수</th></tr></thead><tbody><tr><td>i</td><td>무리함수와 직선의 그래프를 한 좌표평면에 그린 경우</td><td>2</td></tr><tr><td>ii</td><td>곡선과 직선이 점 $(a,0)$에서 만날 때의 $k$의 값을 이용하여 곡선과 직선이 한 점에서 만나기 위한 $k$의 값의 범위를 구한 경우</td><td>2</td></tr><tr><td>iii</td><td>곡선과 직선이 접하는 경우 $k$값을 구한 경우</td><td>2</td></tr><tr><td>iv</td><td>$k$의 값의 범위를 구한 경우</td><td>1</td></tr></tbody></table>",
    "choices": [],
    "answer": "$k\\lt-2$ 또는 $k=-1$",
    "solution": "[키포인트] 근호의 값을 새로운 변수로 놓으면 교점 문제를 음이 아닌 근을 갖는 이차방정식 문제로 바꿀 수 있다.\n조건 정리: $t=\\sqrt{4x-8}$라 하면 $t\\ge0$이고 $x=\\dfrac{t^2+8}{4}$이다.\n풀이 방향: 직선의 식에 대입하여 $t$에 대한 이차방정식을 만든 뒤 음이 아닌 근의 개수가 정확히 $1$개가 되는 $k$를 찾는다.\n정석 풀이: 교점에서는 $t=x+k=\\dfrac{t^2+8}{4}+k$이므로 $t^2-4t+8+4k=0$이다. 즉 $(t-2)^2=-4(k+1)$이다. $k=-1$이면 $t=2$ 하나만 얻어 교점이 한 개이다. $k\\lt-1$이면 두 실근은 $t=2\\pm2\\sqrt{-k-1}$이다. 이 중 작은 근이 음수가 되어 하나만 유효하려면 $2-2\\sqrt{-k-1}\\lt0$, 즉 $k\\lt-2$여야 한다. $k=-2$에서는 작은 근이 $0$이므로 두 근이 모두 유효하여 교점이 두 개이다. 따라서 한 점에서 만나는 경우는 $k\\lt-2$ 또는 $k=-1$이다.\n따라서 구하는 범위는 $k\\lt-2$ 또는 $k=-1$이다."
  },
  {
    "id": 21,
    "level": "상",
    "category": "유리함수와 부등식",
    "originalCategory": "유리함수",
    "standardCourse": "수학(하)",
    "standardUnitKey": "H15-SB-04",
    "standardUnit": "유리함수",
    "standardUnitOrder": 4,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "유리함수",
      "부등식",
      "최댓값",
      "최솟값",
      "표"
    ],
    "wide": false,
    "content": "서술형3. $1\\le x\\le3$인 모든 $x$에 대하여 부등식 $ax+1\\le\\dfrac{x-1}{x+1}\\le bx+1$이 성립할 때, 상수 $a$의 최댓값과 상수 $b$의 최솟값을 채점기준에 알맞게 구하시오. [7점]<table class=\"question-table\"><thead><tr><th>단계</th><th>채점기준</th><th>부분점수</th></tr></thead><tbody><tr><td>i</td><td>주어진 부등식에서 각 식을 함수식으로 나타낸 경우</td><td>1</td></tr><tr><td>ii</td><td>유리함수를 $y=\\dfrac{k}{x-p}+q$ 꼴로 바꾼 경우</td><td>1</td></tr><tr><td>iii</td><td>문제를 좌표평면에 그래프로 나타낸 경우</td><td>1</td></tr><tr><td>iv</td><td>$a$의 최댓값을 구한 경우</td><td>2</td></tr><tr><td>v</td><td>$b$의 최솟값을 구한 경우</td><td>2</td></tr></tbody></table>",
    "choices": [],
    "answer": "$a=-1$, $b=-\\dfrac16$",
    "solution": "[키포인트] 두 부등식을 각각 $a$, $b$에 대한 조건으로 바꾸면 같은 함수의 최솟값과 최댓값을 찾는 문제가 된다.\n조건 정리: $x\\gt0$이므로 $ax+1\\le\\dfrac{x-1}{x+1}$은 $a\\le-\\dfrac{2}{x(x+1)}$, 그리고 $\\dfrac{x-1}{x+1}\\le bx+1$은 $b\\ge-\\dfrac{2}{x(x+1)}$와 같다.\n풀이 방향: $1\\le x\\le3$에서 $g(x)=-\\dfrac{2}{x(x+1)}$의 최솟값과 최댓값을 구한다.\n정석 풀이: $1\\le x\\le3$에서는 양수 $x(x+1)$이 $2$에서 $12$까지 증가하므로 $g(x)$는 $-1$에서 $-\\dfrac16$까지 증가한다. 따라서 모든 $x$에 대해 $a\\le g(x)$가 성립하려면 $a$는 $g$의 최솟값 $-1$ 이하이어야 하므로 $a$의 최댓값은 $-1$이다. 또 모든 $x$에 대해 $b\\ge g(x)$가 성립하려면 $b$는 $g$의 최댓값 $-\\dfrac16$ 이상이어야 하므로 $b$의 최솟값은 $-\\dfrac16$이다.\n따라서 구하는 값은 $a=-1$, $b=-\\dfrac16$이다."
  }
];
