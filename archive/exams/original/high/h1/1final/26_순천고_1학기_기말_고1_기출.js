window.examTitle = "26_순천고_1학기_기말_고1_기출";
window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "합의 법칙과 곱의 법칙",
    "originalCategory": "합의 법칙과 곱의 법칙",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-07",
    "standardUnit": "합의 법칙과 곱의 법칙",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "합의 법칙과 곱의 법칙"
    ],
    "wide": false,
    "content": "4500의 양의 약수 중 5의 배수의 개수는? [3.4점]",
    "choices": [
      "18",
      "20",
      "25",
      "27",
      "30"
    ],
    "answer": "④",
    "solution": "[키포인트] 약수를 만들 때 각 소인수의 지수를 몇 가지로 정할 수 있는지 센다.\\n조건 정리: $4500=2^2\\cdot3^2\\cdot5^3$이다. 5의 배수인 약수는 5의 지수가 1 이상이어야 한다.\\n풀이 방향: 2, 3, 5의 지수를 각각 선택하는 경우의 수를 곱한다.\\n정석 풀이: 2의 지수는 $0,1,2$의 3가지, 3의 지수도 $0,1,2$의 3가지이다. 5의 지수는 5의 배수가 되어야 하므로 $1,2,3$의 3가지이다. 따라서 약수의 개수는 $3\\times3\\times3=27$이다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 2,
    "level": "하",
    "category": "행렬",
    "originalCategory": "행렬",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-09",
    "standardUnit": "행렬과 그 연산",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "행렬"
    ],
    "wide": false,
    "content": "두 이차정사각행렬 $A,B$에 대하여 $A=\\begin{pmatrix}-1&1\\\\-1&3\\end{pmatrix}$, $AB=\\begin{pmatrix}-1&-2\\\\1&-8\\end{pmatrix}$일 때, 행렬 $B$의 모든 성분의 합은? [3.4점]",
    "choices": [
      "$-1$",
      "0",
      "1",
      "2",
      "3"
    ],
    "answer": "①",
    "solution": "[키포인트] 행렬 $B$의 성분을 문자로 두고 행렬의 곱을 성분별로 비교한다.\\n조건 정리: $B=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$라 두면 $AB=\\begin{pmatrix}-a+c&-b+d\\\\-a+3c&-b+3d\\end{pmatrix}$이다.\\n풀이 방향: 같은 위치의 성분끼리 같다는 조건으로 $a,b,c,d$를 구한다.\\n정석 풀이: $-a+c=-1$, $-a+3c=1$이므로 두 식을 빼면 $2c=2$이고 $c=1$이다. 따라서 $a=2$이다. 또한 $-b+d=-2$, $-b+3d=-8$이므로 두 식을 빼면 $2d=-6$이고 $d=-3$이다. 따라서 $b=-1$이다. 모든 성분의 합은 $2+(-1)+1+(-3)=-1$이다.\\n따라서 정답은 ①이다."
  },
  {
    "id": 3,
    "level": "하",
    "category": "경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-08",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "경우의 수"
    ],
    "wide": false,
    "content": "남학생 4명과 여학생 5명 중에서 회장 1명, 부회장 1명을 뽑을 때, 적어도 한 명은 여학생이 뽑히는 경우의 수는? [3.5점]",
    "choices": [
      "30",
      "36",
      "45",
      "52",
      "60"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 전체 경우에서 두 명 모두 남학생인 경우를 뺀다.\\n조건 정리: 회장과 부회장은 서로 다른 자리이므로 뽑히는 순서가 구별된다.\\n풀이 방향: 적어도 한 명이 여학생인 경우를 직접 나누기보다 여사건을 이용한다.\\n정석 풀이: 9명 중 회장과 부회장을 뽑는 전체 경우의 수는 $9\\times8=72$이다. 두 명 모두 남학생인 경우의 수는 $4\\times3=12$이다. 따라서 적어도 한 명이 여학생인 경우의 수는 $72-12=60$이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 4,
    "level": "하",
    "category": "행렬",
    "originalCategory": "행렬",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-09",
    "standardUnit": "행렬과 그 연산",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "행렬"
    ],
    "wide": false,
    "content": "이차정사각행렬 $A$의 $(i,j)$성분 $a_{ij}$를 $a_{ij}=\\begin{cases}i(j+1)&(i\\lt j)\\\\(i+1)^j&(i\\ge j)\\end{cases}$ $(i=1,2,\\ j=1,2)$라 할 때, 행렬 $A$의 모든 성분의 합은? [3.6점]",
    "choices": [
      "14",
      "15",
      "16",
      "17",
      "18"
    ],
    "answer": "④",
    "solution": "[키포인트] 네 성분에 각각 해당하는 조건을 적용한다.\\n조건 정리: $(1,1)$, $(1,2)$, $(2,1)$, $(2,2)$의 네 위치를 차례로 계산한다.\\n풀이 방향: $i\\lt j$인지 $i\\ge j$인지 먼저 확인한 뒤 주어진 식에 대입한다.\\n정석 풀이: $a_{11}=(1+1)^1=2$, $a_{12}=1(2+1)=3$, $a_{21}=(2+1)^1=3$, $a_{22}=(2+1)^2=9$이다. 따라서 모든 성분의 합은 $2+3+3+9=17$이다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 5,
    "level": "중",
    "category": "순열",
    "originalCategory": "순열",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-08",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "순열"
    ],
    "wide": false,
    "content": "$5$ 이상인 자연수 $n$에 대하여 ${}_{n}P_{4}=4\\times{}_{n-1}P_{3}+{}_{11}P_{4}$를 만족시키는 $n$의 값은? [3.7점]",
    "choices": [
      "9",
      "10",
      "11",
      "12",
      "13"
    ],
    "answer": "④",
    "solution": "[키포인트] 순열을 연속한 자연수의 곱으로 나타내어 공통인수를 묶는다.\\n조건 정리: ${}_{n}P_{4}=n(n-1)(n-2)(n-3)$, ${}_{n-1}P_{3}=(n-1)(n-2)(n-3)$이다.\\n풀이 방향: 좌변과 우변의 공통인수 $(n-1)(n-2)(n-3)$을 이용해 네 연속한 수의 곱으로 만든다.\\n정석 풀이: 주어진 식을 옮기면 $(n-1)(n-2)(n-3)(n-4)={}_{11}P_{4}$이다. 오른쪽은 $11\\times10\\times9\\times8$이다. 따라서 $(n-1,n-2,n-3,n-4)=(11,10,9,8)$이므로 $n=12$이다. $n\\ge5$에서 왼쪽의 값은 $n$이 커질수록 증가하므로 다른 자연수 해는 없다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 6,
    "level": "하",
    "category": "행렬",
    "originalCategory": "행렬",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-09",
    "standardUnit": "행렬과 그 연산",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "행렬",
      "표"
    ],
    "wide": false,
    "content": "아래의 표는 A 식당과 B 식당의 돈가스와 우동 한 개당 가격을 나타낸 것이다. 다음 중 B 식당의 돈가스 3개와 우동 2개의 가격의 합을 나타낸 것은? [3.8점]<div class='question-table-wrap'><table class='question-table'><thead><tr><th></th><th>A식당</th><th>B식당</th></tr></thead><tbody><tr><th>돈가스</th><td>13</td><td>9</td></tr><tr><th>우동</th><td>12</td><td>8</td></tr></tbody></table></div>",
    "choices": [
      "$\\begin{pmatrix}13&9\\\\12&8\\end{pmatrix}\\begin{pmatrix}3\\\\2\\end{pmatrix}$의 $(1,1)$ 성분",
      "$\\begin{pmatrix}13&9\\\\12&8\\end{pmatrix}\\begin{pmatrix}3\\\\2\\end{pmatrix}$의 $(2,1)$ 성분",
      "$\\begin{pmatrix}3&2\\end{pmatrix}\\begin{pmatrix}13&9\\\\12&8\\end{pmatrix}$의 $(2,2)$ 성분",
      "$\\begin{pmatrix}3&2\\end{pmatrix}\\begin{pmatrix}13&9\\\\12&8\\end{pmatrix}$의 $(1,2)$ 성분",
      "$\\begin{pmatrix}3&2\\end{pmatrix}\\begin{pmatrix}13&9\\\\12&8\\end{pmatrix}$의 $(1,1)$ 성분"
    ],
    "answer": "④",
    "solution": "[키포인트] 구입 개수를 행벡터로 두고 가격표의 열과 곱한다.\\n조건 정리: 돈가스 3개와 우동 2개의 개수는 $\\begin{pmatrix}3&2\\end{pmatrix}$이고, B 식당의 가격은 가격 행렬의 두 번째 열이다.\\n풀이 방향: 행벡터와 가격 행렬을 곱했을 때 두 번째 열과의 곱이 B 식당의 합계가 된다.\\n정석 풀이: $\\begin{pmatrix}3&2\\end{pmatrix}\\begin{pmatrix}13&9\\\\12&8\\end{pmatrix}=\\begin{pmatrix}3\\times13+2\\times12&3\\times9+2\\times8\\end{pmatrix}=\\begin{pmatrix}63&43\\end{pmatrix}$이다. B 식당의 합계 $43$은 이 행렬의 $(1,2)$ 성분이다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 7,
    "level": "중",
    "category": "삼차방정식",
    "originalCategory": "삼차방정식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼차방정식"
    ],
    "wide": false,
    "content": "삼차방정식 $x^3-2x^2-7x+2=0$의 세 근을 $\\alpha,\\beta,\\gamma$라 할 때, $(\\alpha+\\beta)(\\beta+\\gamma)(\\gamma+\\alpha)$의 값은? [4점]",
    "choices": [
      "$-6$",
      "$-12$",
      "$-18$",
      "$-24$",
      "$-30$"
    ],
    "answer": "②",
    "solution": "[키포인트] 세 근의 합, 두 근씩 곱한 합, 세 근의 곱으로 주어진 식을 바꾼다.\\n조건 정리: 근과 계수의 관계에서 $\\alpha+\\beta+\\gamma=2$, $\\alpha\\beta+\\beta\\gamma+\\gamma\\alpha=-7$, $\\alpha\\beta\\gamma=-2$이다.\\n풀이 방향: $(\\alpha+\\beta)(\\beta+\\gamma)(\\gamma+\\alpha)$를 대칭식으로 정리한다.\\n정석 풀이: $(\\alpha+\\beta)(\\beta+\\gamma)(\\gamma+\\alpha)=(\\alpha+\\beta+\\gamma)(\\alpha\\beta+\\beta\\gamma+\\gamma\\alpha)-\\alpha\\beta\\gamma$이다. 따라서 값은 $2\\times(-7)-(-2)=-14+2=-12$이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 8,
    "level": "중",
    "category": "복소수와 이차방정식",
    "originalCategory": "복소수와 이차방정식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-04",
    "standardUnit": "복소수와 이차방정식",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "복소수와 이차방정식"
    ],
    "wide": false,
    "content": "삼차방정식 $x^3=1$의 한 허근을 $\\omega$라 할 때, 보기에서 옳은 것만을 있는 대로 고른 것은? [4.0점]<div class='note-box'>ㄱ. $\\dfrac{1}{\\omega}+\\dfrac{1}{\\overline{\\omega}}=-1$<br>ㄴ. $\\omega\\overline{\\omega}^{\\,2}+\\omega^2\\overline{\\omega}=1$<br>ㄷ. $1+\\omega+\\omega^2+\\cdots+\\omega^{2024}=0$</div>",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "[키포인트] $\\omega^3=1$과 $1+\\omega+\\omega^2=0$, $\\overline{\\omega}=\\omega^2$를 함께 이용한다.\\n조건 정리: $\\omega$는 실수가 아닌 세제곱근이므로 $\\omega\\ne1$이고, $\\omega^2+\\omega+1=0$이다. 또한 두 허근은 서로 켤레이므로 $\\overline{\\omega}=\\omega^2$이다.\\n풀이 방향: ㄱ, ㄴ, ㄷ을 각각 위의 관계식으로 단순화한다.\\n정석 풀이: ㄱ에서 $\\dfrac{1}{\\omega}=\\omega^2$, $\\dfrac{1}{\\overline{\\omega}}=\\dfrac{1}{\\omega^2}=\\omega$이므로 합은 $\\omega+\\omega^2=-1$이다. 따라서 ㄱ은 참이다. ㄴ의 왼쪽은 $\\omega(\\omega^2)^2+\\omega^2\\omega^2=\\omega^5+\\omega^4=\\omega^2+\\omega=-1$이므로 거짓이다. ㄷ의 합은 세 항씩 묶으면 $(1+\\omega+\\omega^2)$가 675번 나타나므로 0이다. 따라서 옳은 것은 ㄱ, ㄷ이다.\\n따라서 정답은 ③이다."
  },
  {
    "id": 9,
    "level": "중",
    "category": "연립부등식",
    "originalCategory": "연립부등식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "연립부등식",
      "표"
    ],
    "wide": false,
    "content": "아래의 표는 식품 A, B 각각의 100g 안에 포함된 열량과 단백질의 양을 나타낸 것이다. 식품 A, B를 합하여 300g을 섭취할 때, 열량은 180cal 이하, 단백질은 16g 이상이 되게 하려고 한다. 섭취해야 할 식품 A의 최소무게를 구하면? [4.1점]<div class='question-table-wrap'><table class='question-table'><thead><tr><th></th><th>열량(cal)</th><th>단백질(g)</th></tr></thead><tbody><tr><th>A</th><td>150</td><td>10</td></tr><tr><th>B</th><td>50</td><td>5</td></tr></tbody></table></div>",
    "choices": [
      "10g",
      "15g",
      "20g",
      "25g",
      "30g"
    ],
    "answer": "③",
    "solution": "[키포인트] 식품 A의 무게를 $x$g으로 두면 식품 B의 무게는 $(300-x)$g이다.\\n조건 정리: 열량은 180cal 이하이고 단백질은 16g 이상이어야 한다.\\n풀이 방향: 열량 조건과 단백질 조건을 각각 부등식으로 세워 공통 범위를 구한다.\\n정석 풀이: 열량 조건은 $\\dfrac{150x+50(300-x)}{100}\\le180$이므로 $x+150\\le180$, 즉 $x\\le30$이다. 단백질 조건은 $\\dfrac{10x+5(300-x)}{100}\\ge16$이므로 $0.05x+15\\ge16$, 즉 $x\\ge20$이다. 따라서 $20\\le x\\le30$이고 A의 최소무게는 20g이다.\\n따라서 정답은 ③이다."
  },
  {
    "id": 10,
    "level": "상",
    "category": "연립부등식",
    "originalCategory": "연립부등식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "연립부등식"
    ],
    "wide": false,
    "content": "$x$에 대한 연립부등식 $\\begin{cases}5x+6\\gt7x\\\\x-2\\gt-2x+a\\end{cases}$를 만족시키는 모든 정수 $x$의 값의 합이 $-7$이 되도록 하는 정수 $a$의 최댓값은? [4.2점]",
    "choices": [
      "$-13$",
      "$-14$",
      "$-15$",
      "$-16$",
      "$-17$"
    ],
    "answer": "③",
    "solution": "[키포인트] 정수해가 연속된 정수들이므로 합이 $-7$이 되는 해의 범위를 먼저 정한다.\\n조건 정리: 첫째 부등식에서 $x\\lt3$, 둘째 부등식에서 $x\\gt\\dfrac{a+2}{3}$이다. 따라서 전체 해는 $\\dfrac{a+2}{3}\\lt x\\lt3$이다.\\n풀이 방향: 가장 큰 정수해는 2로 고정되므로 가장 작은 정수해를 찾아 합을 맞춘 뒤, 그 정수해가 나오도록 $a$의 범위를 정한다.\\n정석 풀이: 연속된 정수 $L,L+1,\\ldots,2$의 합이 $-7$이어야 한다. $-4-3-2-1+0+1+2=-7$이므로 정수해는 $-4,-3,-2,-1,0,1,2$이다. 가장 작은 정수해가 $-4$가 되려면 $-5\\le\\dfrac{a+2}{3}\\lt-4$이어야 한다. 따라서 $-15\\le a+2\\lt-12$, 즉 $-17\\le a\\lt-14$이다. 정수 $a$는 $-17,-16,-15$이고 최댓값은 $-15$이다.\\n따라서 정답은 ③이다."
  },
  {
    "id": 11,
    "level": "상",
    "category": "이차함수",
    "originalCategory": "이차함수",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-05",
    "standardUnit": "이차방정식과 이차함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차함수"
    ],
    "wide": false,
    "content": "최고차항의 계수가 $a$ $(a\\gt0)$인 이차함수 $f(x)$가 다음 조건을 만족시킨다.<div class='note-box'>(가) 직선 $y=ax-12$와 함수 $y=f(x)$의 그래프가 만나는 두 점의 $x$좌표는 0과 3이다.<br>(나) $-3\\le x\\le4$에서 $f(x)$의 최댓값은 48이다.</div>$f(6)$의 값을 구하면? [4.3점]",
    "choices": [
      "88",
      "84",
      "80",
      "76",
      "72"
    ],
    "answer": "②",
    "solution": "[키포인트] 두 그래프의 교점 조건으로 $f(x)$를 먼저 구한 뒤 구간의 최댓값 조건을 이용한다.\\n조건 정리: $f(x)-(ax-12)$는 $x=0,3$을 근으로 갖고 최고차항의 계수는 $a$이다.\\n풀이 방향: 차를 인수분해하여 $f(x)$의 식을 만든 뒤, 꼭짓점과 양 끝점의 위치를 비교한다.\\n정석 풀이: $f(x)-(ax-12)=ax(x-3)$이므로 $f(x)=ax^2-2ax-12=a(x-1)^2-a-12$이다. $a\\gt0$이므로 이 함수는 위로 열린 포물선이고, 닫힌 구간에서의 최댓값은 양 끝점 중 하나에서 생긴다. 꼭짓점의 $x$좌표가 1이고, 1에서 $-3$까지의 거리는 4, 4까지의 거리는 3이므로 $f(-3)\\gt f(4)$이다. 따라서 최댓값은 $f(-3)=15a-12$이다. 조건 (나)에서 최댓값이 48이므로 $15a-12=48$, $a=4$이다. 따라서 $f(6)=4\\times36-8\\times6-12=84$이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 12,
    "level": "중",
    "category": "조합",
    "originalCategory": "조합",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-08",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "조합"
    ],
    "wide": false,
    "content": "1부터 9까지의 자연수가 하나씩 적혀 있는 9개의 공이 들어 있는 주머니가 있다. 이 주머니에서 3개의 공을 동시에 꺼내어 공에 적힌 수 중에서 가장 작은 수를 백의 자리에 두고 가장 큰 수를 일의 자리에 두어 세 자리의 자연수를 만들 때, 홀수의 개수는? [4.4점]",
    "choices": [
      "50",
      "62",
      "74",
      "86",
      "99"
    ],
    "answer": "①",
    "solution": "[키포인트] 만들어진 수가 홀수이려면 일의 자리에 놓이는 가장 큰 수가 홀수여야 한다.\\n조건 정리: 가장 큰 수를 정하면 그보다 작은 수 중에서 나머지 두 수를 고르면 세 자리 수가 하나로 정해진다.\\n풀이 방향: 가장 큰 수가 될 수 있는 홀수 3, 5, 7, 9에 따라 경우를 나눈다.\\n정석 풀이: 가장 큰 수가 3이면 1,2를 모두 골라야 하므로 ${}_{2}C_{2}=1$가지이다. 가장 큰 수가 5이면 1부터 4 중 2개를 골라 ${}_{4}C_{2}=6$가지이다. 같은 방법으로 가장 큰 수가 7이면 ${}_{6}C_{2}=15$가지, 9이면 ${}_{8}C_{2}=28$가지이다. 합은 $1+6+15+28=50$이다.\\n따라서 정답은 ①이다."
  },
  {
    "id": 13,
    "level": "상",
    "category": "연립부등식",
    "originalCategory": "연립부등식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "연립부등식"
    ],
    "wide": false,
    "content": "$x$에 대한 연립부등식 $\\begin{cases}(x+a)(x-5)\\lt0\\\\(x-a)(x-3)\\gt0\\end{cases}$의 해가 $3\\lt x\\lt5$일 때, 실수 $a$의 최댓값을 $M$, 최솟값을 $m$이라 하자. $M+m$의 값을 구하면? [4.5점]",
    "choices": [
      "3",
      "2",
      "0",
      "$-2$",
      "$-3$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 공통해가 $(3,5)$를 포함하는 것뿐 아니라 그 밖의 해가 생기지 않도록 해야 한다.\\n조건 정리: 첫째 부등식의 두 경계는 $-a,5$이고, 둘째 부등식의 두 경계는 $a,3$이다.\\n풀이 방향: 먼저 $(3,5)$가 두 부등식의 해에 모두 포함되도록 한 뒤, $x\\lt3$인 쪽에 추가 공통해가 생기는지를 확인한다.\\n정석 풀이: $(3,5)$가 첫째 부등식의 해에 포함되려면 첫째 부등식의 해가 $-a\\lt x\\lt5$이어야 하고 $-a\\le3$이어야 하므로 $a\\ge-3$이다. $(3,5)$가 둘째 부등식의 해에 포함되려면 $a\\le3$이어야 하며, 이때 둘째 부등식의 해는 $x\\lt a$ 또는 $x\\gt3$이다. 따라서 우선 $-3\\le a\\le3$이다. 그런데 $a\\gt0$이면 첫째 부등식의 구간 $(-a,5)$와 둘째 부등식의 구간 $(-\\infty,a)$가 겹쳐 $(-a,a)$라는 추가 해가 생긴다. 정확히 $(3,5)$만 남으려면 $a\\le0$이어야 한다. 따라서 $-3\\le a\\le0$이고 $M=0$, $m=-3$이므로 $M+m=-3$이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 14,
    "level": "중",
    "category": "순열",
    "originalCategory": "순열",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-08",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "순열"
    ],
    "wide": false,
    "content": "두 팀 A, B를 포함한 서로 다른 8개의 공연 팀 중에서 두 팀 A, B를 포함하여 서로 다른 6개의 팀을 뽑아 공연 순서를 정할 때, 두 팀 A, B는 연달아 공연을 하지 않게 되는 경우의 수는? [4.6점]",
    "choices": [
      "7200",
      "8800",
      "9600",
      "12800",
      "19200"
    ],
    "answer": "①",
    "solution": "[키포인트] A, B가 연달아 공연하는 경우를 전체 경우에서 뺀다.\\n조건 정리: A, B는 반드시 포함하고, 나머지 6팀 중 4팀을 더 골라 모두 6팀을 배열한다.\\n풀이 방향: 팀 선택과 순서 배열을 나누어 계산한 뒤, A와 B를 한 묶음으로 보는 경우를 차감한다.\\n정석 풀이: 나머지 6팀 중 4팀을 고르는 경우는 ${}_{6}C_{4}=15$가지이고, 고른 6팀을 배열하는 경우는 $6!=720$가지이므로 전체는 $15\\times720=10800$가지이다. A와 B가 붙는 경우에는 A, B의 내부 순서가 2가지이고, A와 B의 묶음과 나머지 4팀을 합한 5개를 배열하는 방법이 $5!$가지이다. 따라서 붙는 경우는 $15\\times2\\times5!=3600$가지이다. 구하는 경우의 수는 $10800-3600=7200$이다.\\n따라서 정답은 ①이다."
  },
  {
    "id": 15,
    "level": "상",
    "category": "이차부등식",
    "originalCategory": "이차부등식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차부등식"
    ],
    "wide": false,
    "content": "$x$에 대한 이차부등식 $-x^2+(n+3)x-3n\\gt0$을 만족시키는 자연수 $x$가 최소 1개, 최대 3개가 되도록 하는 모든 자연수 $n$의 값의 합은? [4.7점]",
    "choices": [
      "18",
      "19",
      "20",
      "21",
      "22"
    ],
    "answer": "②",
    "solution": "[키포인트] 두 근 3과 $n$ 사이에 있는 자연수의 개수를 $n$의 범위에 따라 센다.\\n조건 정리: $-x^2+(n+3)x-3n\\gt0$은 $(x-3)(x-n)\\lt0$과 같다. 따라서 해는 3과 $n$ 사이의 실수이다.\\n풀이 방향: $n=1,2,3,4$를 먼저 확인하고, $n\\ge5$에서는 자연수해의 개수를 식으로 나타낸다.\\n정석 풀이: $n=1$이면 $1\\lt x\\lt3$이므로 자연수해는 $x=2$ 한 개이다. $n=2,3,4$이면 두 근 사이에 자연수가 없으므로 조건을 만족하지 않는다. $n\\ge5$이면 $3\\lt x\\lt n$이고 자연수해는 $4,5,\\ldots,n-1$이므로 개수는 $n-4$개이다. 이 개수가 1개 이상 3개 이하이려면 $1\\le n-4\\le3$이므로 $n=5,6,7$이다. 따라서 가능한 $n$은 $1,5,6,7$이고 합은 $1+5+6+7=19$이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 16,
    "level": "상",
    "category": "이차함수",
    "originalCategory": "이차함수",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-05",
    "standardUnit": "이차방정식과 이차함수",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차함수"
    ],
    "wide": false,
    "content": "$0\\le x\\le a$에서 이차함수 $y=x^2-4x+3$의 최댓값과 최솟값의 합이 5가 되도록 하는 모든 양수 $a$의 값의 합을 구하면? [4.8점]",
    "choices": [
      "$4-\\sqrt3+\\sqrt6$",
      "$4-\\sqrt3+\\sqrt7$",
      "$4-\\sqrt2+\\sqrt7$",
      "$4-\\sqrt2+\\sqrt6$",
      "$4+\\sqrt3+\\sqrt6$"
    ],
    "answer": "②",
    "solution": "[키포인트] 구간의 오른쪽 끝 $a$가 꼭짓점 2와 대칭점 4를 지나는지에 따라 최댓값과 최솟값이 달라진다.\\n조건 정리: $y=x^2-4x+3=(x-2)^2-1$이며 꼭짓점은 $(2,-1)$이다.\\n풀이 방향: $0\\lt a\\le2$, $2\\lt a\\le4$, $a\\gt4$의 세 경우로 나누어 최댓값과 최솟값의 합을 구한다.\\n정석 풀이: 첫째, $0\\lt a\\le2$에서는 함수가 감소하므로 최댓값은 $f(0)=3$, 최솟값은 $f(a)=(a-2)^2-1$이다. 합이 5이므로 $(a-2)^2+2=5$이고, 이 범위에서 $a=2-\\sqrt3$이다. 둘째, $2\\lt a\\le4$에서는 최솟값이 $-1$이고 최댓값이 3이므로 합은 2여서 조건을 만족하지 않는다. 셋째, $a\\gt4$에서는 최솟값이 $-1$, 최댓값이 $f(a)=(a-2)^2-1$이다. 합이 5이므로 $(a-2)^2-2=5$이고 $a=2+\\sqrt7$이다. 따라서 모든 양수 $a$의 합은 $(2-\\sqrt3)+(2+\\sqrt7)=4-\\sqrt3+\\sqrt7$이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 17,
    "level": "중",
    "category": "절댓값 부등식",
    "originalCategory": "절댓값 부등식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "단답형",
      "절댓값 부등식"
    ],
    "wide": false,
    "content": "부등식 $|x+1|+|x-2|\\le9$를 만족시키는 정수 $x$의 개수를 구하시오. [3점]",
    "choices": [],
    "answer": "$10$",
    "solution": "[키포인트] 절댓값의 기준점 $-1$과 2를 기준으로 구간을 나눈다.\\n조건 정리: $x\\le-1$, $-1\\le x\\le2$, $x\\ge2$의 세 구간에서 절댓값을 각각 풀어 쓴다.\\n풀이 방향: 각 구간의 해를 구한 뒤 하나의 범위로 합친다.\\n정석 풀이: $x\\le-1$이면 $|x+1|+|x-2|=-2x+1\\le9$이므로 $x\\ge-4$이다. 따라서 $-4\\le x\\le-1$이다. $-1\\le x\\le2$이면 합은 $(x+1)+(2-x)=3$이므로 모든 $x$가 해이다. $x\\ge2$이면 합은 $(x+1)+(x-2)=2x-1\\le9$이므로 $x\\le5$이다. 따라서 전체 실수해는 $-4\\le x\\le5$이고, 정수는 $-4,-3,\\ldots,5$의 10개이다.\\n따라서 구하는 값은 $10$이다."
  },
  {
    "id": 18,
    "level": "하",
    "category": "직사각형",
    "originalCategory": "직사각형",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "단답형",
      "직사각형"
    ],
    "wide": false,
    "content": "지름의 길이가 $80$인 원에 내접하는 직사각형의 가로와 세로의 길이의 비가 $4:3$일 때, 직사각형의 넓이를 구하시오. [3점]",
    "choices": [],
    "answer": "$3072$",
    "solution": "[키포인트] 직사각형이 원에 내접하면 직사각형의 대각선의 길이는 원의 지름의 길이와 같다.\\n조건 정리: 가로와 세로의 길이의 비가 $4:3$이므로 가로와 세로를 각각 $4k$, $3k$라 둘 수 있다. 이때 대각선의 길이는 $\\sqrt{(4k)^2+(3k)^2}=5k$이다.\\n풀이 방향: 원의 지름이 직사각형의 대각선과 같다는 조건으로 $k$를 구한 뒤 넓이를 계산한다.\\n정석 풀이: 직사각형이 원에 내접하므로 직사각형의 대각선의 길이는 원의 지름의 길이와 같아서 $5k=80$이다. 따라서 $k=16$이다. 그러므로 가로의 길이는 $4k=64$, 세로의 길이는 $3k=48$이다. 직사각형의 넓이는 $64\\times48=3072$이다.\\n따라서 구하는 값은 $3072$이다."
  },
  {
    "id": 19,
    "level": "중",
    "category": "이차함수",
    "originalCategory": "이차함수",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-05",
    "standardUnit": "이차방정식과 이차함수",
    "standardUnitOrder": 5,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "단답형",
      "이차함수",
      "그래프"
    ],
    "wide": false,
    "content": "두 이차함수 $y=f(x)$, $y=g(x)$의 그래프가 다음 그림과 같을 때, 부등식 $0\\lt f(x)\\lt g(x)$를 만족시키는 정수 $x$의 값을 구하시오. [4점]",
    "choices": [],
    "answer": "$-4$",
    "solution": "[키포인트] $f(x)$의 값이 양수이면서 동시에 $g(x)$보다 작은 구간을 그래프에서 찾는다.\\n조건 정리: 그래프에서 $f(x)$는 $x=-5$와 $x=0$에서 $x$축과 만나고, $x=-5$와 $x=0$ 사이에서 $x$축 위에 있다. 또 두 그래프는 $x=-5$, $x=-3$, $x=0$에서 만나며, $-5\\lt x\\lt-3$에서는 $g(x)$가 $f(x)$보다 위에 있다.\\n풀이 방향: $f(x)\\gt0$인 구간과 $f(x)\\lt g(x)$인 구간의 공통부분을 구한 뒤 그 안의 정수를 찾는다.\\n정석 풀이: 그래프를 보면 $f(x)\\gt0$인 구간은 $-5\\lt x\\lt0$이다. 이 가운데 $f(x)\\lt g(x)$가 되는 부분은 두 그래프의 위치 관계로부터 $-5\\lt x\\lt-3$이다. 따라서 부등식 $0\\lt f(x)\\lt g(x)$의 해는 $-5\\lt x\\lt-3$이다. 이 구간에 있는 정수는 $-4$ 하나뿐이다.\\n따라서 구하는 값은 $-4$이다.",
    "image": "assets/images/26_순천고_1학기_기말_고1_기출/q19.png"
  },
  {
    "id": 20,
    "level": "중",
    "category": "이차함수",
    "originalCategory": "이차함수",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-05",
    "standardUnit": "이차방정식과 이차함수",
    "standardUnitOrder": 5,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "단답형",
      "이차함수"
    ],
    "wide": false,
    "content": "원가가 250원인 연필을 300원에 팔면 하루에 500개가 팔리고, 판매 가격을 5원 올릴 때마다 하루에 10개씩 덜 팔린다. 하루의 이익이 최대가 되도록 하는 연필 한 개의 판매 가격을 구하시오. [5점]",
    "choices": [],
    "answer": "$400$원",
    "solution": "[키포인트] 가격을 올린 횟수를 문자로 두어 하루 이익을 이차식으로 나타낸다.\\n조건 정리: 가격을 5원씩 $x$번 올리면 판매 가격은 $(300+5x)$원, 판매량은 $(500-10x)$개이다. 한 개당 이익은 $(50+5x)$원이다.\\n풀이 방향: 하루 이익을 아래로 열린 이차함수로 나타내고 꼭짓점에서의 $x$를 구한다.\\n정석 풀이: 하루 이익을 $P(x)$라 하면 $P(x)=(50+5x)(500-10x)=-50x^2+2000x+25000$이다. 이를 완전제곱식으로 고치면 $P(x)=-50(x-20)^2+45000$이다. 따라서 $x=20$일 때 이익이 최대이다. 이때 판매 가격은 $300+5\\times20=400$원이다.\\n따라서 구하는 값은 $400$원이다."
  },
  {
    "id": 21,
    "level": "중",
    "category": "연립방정식",
    "originalCategory": "연립방정식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "연립방정식"
    ],
    "wide": false,
    "content": "$\\begin{cases}x^2-y^2=0\\\\3x^2-2xy+y^2=24\\end{cases}$의 양의 해를 $x=a$, $y=b$라 할 때, $a+b$를 구하는 과정을 서술하시오. [6점]",
    "choices": [],
    "answer": "$4\\sqrt3$",
    "solution": "[키포인트] 첫째 식을 인수분해하고 양수 조건으로 가능한 관계를 하나로 정한다.\\n조건 정리: $x^2-y^2=(x-y)(x+y)=0$이고 $x,y$는 모두 양수이다.\\n풀이 방향: 양수이므로 $x+y=0$은 불가능하다는 점을 이용해 $x=y$를 얻은 뒤 둘째 식에 대입한다.\\n정석 풀이: $(x-y)(x+y)=0$에서 $x=y$ 또는 $x=-y$이다. 그런데 $x,y$가 양수이므로 $x=-y$는 성립할 수 없고 $x=y$이다. 둘째 식에 $y=x$를 대입하면 $3x^2-2x^2+x^2=24$, 즉 $2x^2=24$이다. 따라서 $x^2=12$이고 양수이므로 $x=2\\sqrt3$이다. $y=x$이므로 $y=2\\sqrt3$이다. 따라서 $a+b=2\\sqrt3+2\\sqrt3=4\\sqrt3$이다.\\n따라서 구하는 값은 $4\\sqrt3$이다."
  },
  {
    "id": 22,
    "level": "상",
    "category": "항등식과 나머지 정리",
    "originalCategory": "항등식과 나머지 정리",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-02",
    "standardUnit": "항등식과 나머지 정리",
    "standardUnitOrder": 2,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "항등식과 나머지 정리"
    ],
    "wide": false,
    "content": "최고차항의 계수가 1인 다항식 $f(x)$가 다음 두 조건을 만족시킨다.<div class='note-box'>(가) 다항식 $f(x)$를 다항식 $g(x)$로 나눈 몫과 나머지는 모두 $g(x)+x^2$이다.<br>(나) 방정식 $f(x)=0$은 서로 다른 세 정수근 $3,\\alpha,\\beta$를 가진다.</div>$\\alpha,\\beta$의 값을 구하는 과정과 정답을 서술하시오. (단, $\\alpha\\gt\\beta$) [7점]",
    "choices": [],
    "answer": "$\\alpha=11,\\ \\beta=-4$",
    "solution": "[키포인트] 나머지의 차수 조건으로 $g(x)$의 차수와 최고차항을 먼저 결정한다.\\n조건 정리: 몫과 나머지가 모두 $g(x)+x^2$이므로 $f(x)=g(x)(g(x)+x^2)+(g(x)+x^2)=(g(x)+1)(g(x)+x^2)$이다. 또한 나머지 $g(x)+x^2$의 차수는 $g(x)$의 차수보다 작아야 한다.\\n풀이 방향: $g(x)+x^2$에서 이차항이 없어져야 한다는 점과 $f(x)$의 최고차항 계수가 1이라는 조건을 차례로 이용한다.\\n정석 풀이: 나머지의 차수가 $g(x)$보다 작으려면 $g(x)$는 이차식이고 최고차항은 $-x^2$이어야 한다. 따라서 $g(x)=-x^2+px+q$라 두면 $g(x)+x^2=px+q$이다. 이때 $f(x)=(g(x)+1)(px+q)$의 최고차항은 $-p x^3$이므로 최고차항 계수가 1이라는 조건에서 $p=-1$이다. 따라서 $g(x)=-x^2-x+q$이고 $g(x)+x^2=-x+q$이다. 이제 $f(x)=(-x^2-x+q+1)(-x+q)$이다. $x=3$이 근이므로 $-3+q=0$ 또는 $-9-3+q+1=0$이다. 첫째 경우 $q=3$이면 나머지 두 근이 정수가 되지 않는다. 둘째 경우 $q=11$이면 $f(x)=(-x+11)(-x^2-x+12)=(x-11)(x-3)(x+4)$이다. 서로 다른 세 정수근은 $11,3,-4$이므로 $\\alpha=11$, $\\beta=-4$이다.\\n따라서 구하는 값은 $\\alpha=11$, $\\beta=-4$이다."
  },
  {
    "id": 23,
    "level": "상",
    "category": "경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-08",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 8,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "경우의 수"
    ],
    "wide": false,
    "content": "서로 다른 종류의 음료 3개와 같은 종류의 빵 2개를 4명의 학생에게 나누어 주려고 한다. 아무것도 받지 못하는 학생이 없도록 음료와 빵을 나누어 주는 경우의 수를 구하려고 할 때, 다음 물음의 조건에 따른 경우의 수를 구하는 과정과 정답을 서술하시오. [총 7점, 부분점수 있음]<div class='note-box'>(1) 1명의 학생이 빵을 2개 받는 경우 [2점]<br>(2) 1명의 학생이 음료 1개와 빵 1개를 받는 경우 [2점]<br>(3) 1명의 학생이 음료 2개를 받는 경우 [3점]</div>",
    "choices": [],
    "answer": "$24,\\ 72,\\ 36$",
    "solution": "[키포인트] 물건이 5개이고 학생이 4명이므로 정확히 한 학생만 2개를 받고 나머지 세 학생은 1개씩 받는다.\\n조건 정리: 음료 3개는 서로 다르고 빵 2개는 같은 종류이다. 각 소문항에서 2개를 받는 학생과 그 학생이 받는 물건을 먼저 정한다.\\n풀이 방향: 2개를 받을 학생을 고른 뒤 남은 서로 다른 음료를 나머지 학생들에게 배분한다.\\n정석 풀이: (1) 빵 2개를 받을 학생을 고르는 방법은 4가지이다. 남은 세 학생에게 서로 다른 음료 3개를 하나씩 주는 방법은 $3!$가지이므로 $4\\times3!=24$가지이다. (2) 음료 1개와 빵 1개를 받을 학생은 4가지, 그 학생이 받을 음료는 3가지이다. 남은 두 음료와 빵 1개를 나머지 세 학생에게 하나씩 주는 방법은 $3!$가지이므로 $4\\times3\\times3!=72$가지이다. (3) 음료 2개를 받을 학생은 4가지이고, 그 학생이 받을 음료 2개를 고르는 방법은 ${}_{3}C_{2}=3$가지이다. 남은 음료 1개를 받을 학생을 나머지 세 학생 중에서 고르면 3가지이며, 남은 두 학생은 빵을 하나씩 받는다. 따라서 $4\\times3\\times3=36$가지이다.\\n따라서 각 경우의 수는 차례대로 $24$, $72$, $36$이다."
  }
];

// 2026-07 source-defect and source-fidelity corrections
{
  const question = (id) => window.questionBank.find((q) => q.id === id);
  question(17).content = "서답형 1.(단답형)<br>" + question(17).content;
  question(18).content = "서답형 2.(단답형)<br>" + question(18).content;
  question(19).content = "서답형 3.(단답형)<br>" + question(19).content;
  question(20).content = "서답형 4.(단답형)<br>" + question(20).content;
  question(21).content = "서답형 5.(서술형)<br>" + question(21).content.replace("의 양의 해를", "의 해 중 $(a>0,\\ b>0)$인 해를");
  question(22).content = "서답형 6.(서술형)<br>" + question(22).content;
  question(23).content = "서답형 7.(서술형)<br>" + question(23).content;
}
