window.examTitle = "26_복성고_1학기_기말_고1_기출";
window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "순열과 조합",
    "originalCategory": "순열과 조합",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-08",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "순열과 조합"
    ],
    "wide": false,
    "content": "$5!+{}_7C_2$의 값은? [3.4점]",
    "choices": [
      "141",
      "142",
      "143",
      "144",
      "145"
    ],
    "answer": "①",
    "solution": "[키포인트] 팩토리얼과 조합의 값을 각각 구한 뒤 더한다.\n조건 정리: $5!=5\\times4\\times3\\times2\\times1$이고, ${}_7C_2=\\dfrac{7\\times6}{2\\times1}$이다.\n풀이 방향: 두 값을 따로 계산하면 덧셈만 남는다.\n정석 풀이: $5!=120$이고 ${}_7C_2=21$이다. 따라서 $5!+{}_7C_2=120+21=141$이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H22-C-08-CORE",
    "subUnit": "순열과 조합 핵심 개념",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 2,
    "level": "하",
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
    "content": "남학생 3명과 여학생 2명이 일렬로 설 때, 여학생 2명이 이웃하게 서는 경우의 수는? [3.4점]",
    "choices": [
      "40",
      "44",
      "48",
      "52",
      "56"
    ],
    "answer": "③",
    "solution": "[키포인트] 이웃해야 하는 두 여학생을 한 묶음으로 생각한다.\n조건 정리: 여학생 2명을 한 묶음으로 보면 남학생 3명과 여학생 묶음 1개, 모두 4개를 배열하게 된다. 묶음 안에서 여학생의 순서는 서로 바뀔 수 있다.\n풀이 방향: 네 대상을 배열하는 경우와 묶음 안의 순서를 곱한다.\n정석 풀이: 네 대상을 일렬로 세우는 방법은 $4!$가지이고, 여학생 2명이 묶음 안에서 서는 순서는 $2!$가지이다. 따라서 경우의 수는 $4!\\times2!=24\\times2=48$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H22-C-08-PERMUTATION",
    "subUnit": "순열",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 3,
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
    "content": "두 행렬 <br>$A=\\begin{pmatrix}-6&a\\\\3&0\\end{pmatrix}$, $B=\\begin{pmatrix}b&1\\\\-2&0\\end{pmatrix}$에 대하여 $A=kB$일 때, $a+b+k$의 값은? [3.6점]",
    "choices": [
      "$-3$",
      "$-1$",
      "1",
      "3",
      "5"
    ],
    "answer": "③",
    "solution": "행렬이 같으면 같은 위치의 성분이 각각 같다.\n숫자만 있는 $(2,1)$성분에서 $k$를 먼저 구한다.\n$3=-2k$\n$k=-\\dfrac32$\n$(1,2)$성분을 비교하면\n$a=k\\cdot1$\n$a=-\\dfrac32$\n$(1,1)$성분을 비교하면\n$-6=kb$\n$-6=-\\dfrac32b$\n$b=4$\n따라서\n$a+b+k=-\\dfrac32+4-\\dfrac32$\n$=4-3$\n$=1$이다. 정답은 ③이다.",
    "subUnitKey": "H22-C-09-CORE",
    "subUnit": "경우의 수 핵심 개념",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 4,
    "level": "하",
    "category": "다항식",
    "originalCategory": "다항식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "다항식"
    ],
    "wide": false,
    "content": "다항식 $(a+b)(p+q+r+s)(x+y+z)$을 전개했을 때 서로 다른 항의 개수는? [3.6점]",
    "choices": [
      "12",
      "16",
      "20",
      "24",
      "28"
    ],
    "answer": "④",
    "solution": "[키포인트] 전개한 한 항은 각 괄호에서 한 항씩 선택하여 만들어진다.\n조건 정리: 첫째 괄호에는 2개, 둘째 괄호에는 4개, 셋째 괄호에는 3개의 항이 있다. 모든 문자가 서로 달라 서로 같은 항이 생기지 않는다.\n풀이 방향: 곱의 법칙으로 선택 방법의 수를 곱한다.\n정석 풀이: 첫째 괄호에서 2가지, 둘째 괄호에서 4가지, 셋째 괄호에서 3가지 중 하나씩 고르므로 서로 다른 항의 개수는 $2\\times4\\times3=24$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "H22-C-01-POLYNOMIAL_BASIC",
    "subUnit": "다항식의 연산",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 5,
    "level": "하",
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
    "content": "이차부등식 $4x^2-4x-15\\le0$을 만족시키는 정수 $x$의 개수는? [3.7점]",
    "choices": [
      "4",
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "①",
    "solution": "[키포인트] 이차식을 인수분해하여 두 근 사이의 범위를 구한다.\n조건 정리: $4x^2-4x-15=(2x+3)(2x-5)$이다.\n풀이 방향: 최고차항의 계수가 양수이므로 곱이 0 이하인 범위는 두 근 사이이다.\n정석 풀이: $(2x+3)(2x-5)\\le0$의 두 경계는 $x=-\\dfrac{3}{2}$, $x=\\dfrac{5}{2}$이다. 따라서 $-\\dfrac{3}{2}\\le x\\le\\dfrac{5}{2}$이고, 이 범위의 정수는 $-1,0,1,2$의 4개이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "H22-C-06-INEQUALITY",
    "subUnit": "여러 가지 부등식",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
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
      "행렬"
    ],
    "wide": false,
    "content": "두 행렬 <br>$A=\\begin{pmatrix}2&0\\\\-5&4\\end{pmatrix}$, $B=\\begin{pmatrix}1&-1\\\\3&2\\end{pmatrix}$에 대하여 $A+2B$의 $(1,1)$성분을 $a$, $2A-B$의 $(2,1)$성분을 $b$라 하자. $a-b$의 값은? [3.7점]",
    "choices": [
      "16",
      "17",
      "18",
      "19",
      "20"
    ],
    "answer": "②",
    "solution": "[키포인트] 필요한 위치의 성분만 계산하면 된다.\n조건 정리: $a$는 $A+2B$의 $(1,1)$성분이고, $b$는 $2A-B$의 $(2,1)$성분이다.\n풀이 방향: 전체 행렬을 모두 계산하지 않고 해당 성분을 직접 구한다.\n정석 풀이: $a=2+2\\times1=4$이다. 또한 $b=2\\times(-5)-3=-13$이다. 따라서 $a-b=4-(-13)=17$이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H22-C-09-CORE",
    "subUnit": "경우의 수 핵심 개념",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 7,
    "level": "하",
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
    "content": "부등식 $2x-3\\le5x+6\\le3x+7$의 해가 $a\\le x\\le b$일 때, $a+2b$의 값은? [3.7점]",
    "choices": [
      "$-6$",
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$"
    ],
    "answer": "⑤",
    "solution": "가운데 식이 양쪽 부등식을 모두 만족해야 하므로 두 부등식으로 나눈다.\n먼저\n$2x-3\\le5x+6$\n$-9\\le3x$\n$-3\\le x$이다.\n또\n$5x+6\\le3x+7$\n$2x\\le1$\n$x\\le\\dfrac12$이다.\n두 범위의 공통부분은\n$-3\\le x\\le\\dfrac12$이다.\n따라서 $a=-3$, $b=\\dfrac12$이고\n$a+2b=-3+2\\cdot\\dfrac12$\n$=-3+1$\n$=-2$이다. 정답은 ⑤이다.",
    "subUnitKey": "H22-C-06-SYSTEM",
    "subUnit": "연립방정식과 연립부등식",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 8,
    "level": "중",
    "category": "복소수",
    "originalCategory": "복소수",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-04",
    "standardUnit": "복소수와 이차방정식",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "복소수"
    ],
    "wide": false,
    "content": "삼차방정식 $x^3+ax^2+x+b=0$의 한 근이 $2+i$일 때, 실수 $a,b$의 값은? [4점]",
    "choices": [
      "$a=-3,b=5$",
      "$a=-2,b=4$",
      "$a=-1,b=3$",
      "$a=0,b=2$",
      "$a=1,b=1$"
    ],
    "answer": "①",
    "solution": "계수가 모두 실수이므로 $2+i$가 근이면 켤레복소수 $2-i$도 근이다.\n이 두 근을 갖는 이차인수를 구하면\n$(x-(2+i))(x-(2-i))=(x-2)^2-i^2$\n$=(x-2)^2+1$\n$=x^2-4x+5$이다.\n나머지 한 근을 $r$이라 놓으면\n$x^3+ax^2+x+b=(x^2-4x+5)(x-r)$\n$=x^3-(r+4)x^2+(4r+5)x-5r$이다.\n$x$의 계수가 $1$이므로\n$4r+5=1$\n$4r=-4$\n$r=-1$이다.\n이제 $x^2$의 계수와 상수항을 비교한다.\n$a=-(r+4)$\n$=-(-1+4)$\n$=-3$\n$b=-5r$\n$=-5(-1)$\n$=5$이다. 따라서 정답은 ①이다.",
    "subUnitKey": "H22-C-04-COMPLEX_BASIC",
    "subUnit": "복소수의 뜻과 표현",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 9,
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
    "content": "1부터 7까지 숫자가 적힌 공 중 3개를 동시에 꺼낸다. 소수가 적힌 공 2개와 소수가 아닌 수가 적힌 공 1개를 꺼내는 경우의 수를 $a$, 세 자연수의 합이 홀수인 경우의 수를 $b$라 할 때 $a+b$는? [4점]",
    "choices": [
      "26",
      "28",
      "30",
      "32",
      "34"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 두 경우의 수 $a,b$를 각각 조건에 맞게 나누어 센다.\n조건 정리: 1부터 7까지의 소수는 $2,3,5,7$의 4개이고, 소수가 아닌 수는 $1,4,6$의 3개이다. 홀수는 4개, 짝수는 3개이다.\n풀이 방향: $a$는 소수와 소수가 아닌 수의 선택을 곱하고, $b$는 합이 홀수가 되는 홀수의 개수에 따라 나눈다.\n정석 풀이: $a={}_4C_2\\times{}_3C_1=6\\times3=18$이다. 세 수의 합이 홀수이려면 홀수를 1개 또는 3개 골라야 한다. 따라서 $b={}_4C_1{}_3C_2+{}_4C_3=4\\times3+4=16$이다. 그러므로 $a+b=18+16=34$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H22-C-08-COMBINATION",
    "subUnit": "조합",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 10,
    "level": "중",
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
    "content": "$A=\\begin{pmatrix}1\\\\2\\end{pmatrix}$, $B=\\begin{pmatrix}0&-1\\\\2&1\\end{pmatrix}$일 때 보기에서 옳은 것만 고른 것은? (단, $O$는 영행렬이다.) [4.0점]<br><div class='note-box'>(가) 행렬 $A$는 1개의 행과 2개의 열로 이루어진 행렬이다.<br>(나) 행렬 $O-B$의 $(1,2)$성분은 1이다.<br>(다) 행렬 $AB$는 이차정사각행렬이다.</div>",
    "choices": [
      "(가)",
      "(나)",
      "(다)",
      "(가),(나)",
      "(나),(다)"
    ],
    "answer": "②",
    "solution": "[키포인트] 행렬의 크기와 곱셈이 정의되는 조건을 각각 확인한다.\n조건 정리: $A$는 $2\\times1$ 행렬이고 $B$는 $2\\times2$ 행렬이다. $O-B=-B$이다.\n풀이 방향: (가), (나), (다)를 하나씩 판정한다.\n정석 풀이: (가) $A$는 2개의 행과 1개의 열을 가지므로 거짓이다. (나) $O-B=-B=\\begin{pmatrix}0&1\\\\-2&-1\\end{pmatrix}$이므로 $(1,2)$성분은 1이고 참이다. (다) $AB$에서 앞 행렬의 열의 수는 1, 뒤 행렬의 행의 수는 2로 서로 다르므로 곱 $AB$는 정의되지 않는다. 따라서 거짓이다. 옳은 것은 (나)뿐이다.\n따라서 정답은 ②이다.",
    "subUnitKey": "H22-C-09-CORE",
    "subUnit": "경우의 수 핵심 개념",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 11,
    "level": "중",
    "category": "절댓값 부등식",
    "originalCategory": "절댓값 부등식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "절댓값 부등식"
    ],
    "wide": false,
    "content": "부등식 $|x+1|+|2x-3|\\le8$의 해가 $a\\le x\\le b$일 때, $a+b$의 값은? [4점]",
    "choices": [
      "1",
      "$\\dfrac{4}{3}$",
      "$\\dfrac{5}{3}$",
      "2",
      "$\\dfrac{7}{3}$"
    ],
    "answer": "②",
    "solution": "절댓값 안의 식이 $0$이 되는 $x=-1$, $x=\\dfrac32$에서 구간을 나눈다.\n① $x\\le-1$일 때 두 식 $x+1$, $2x-3$이 모두 $0$ 이하이므로\n$-(x+1)-(2x-3)\\le8$\n$-3x+2\\le8$\n$-3x\\le6$\n$x\\ge-2$이다. 음수로 나누어 부등호 방향이 바뀌었다.\n구간 조건과 합치면 $-2\\le x\\le-1$이다.\n② $-1\\le x\\le\\dfrac32$일 때\n$(x+1)-(2x-3)\\le8$\n$-x+4\\le8$\n$-x\\le4$\n$x\\ge-4$이다.\n이 구간의 모든 수는 $x\\ge-4$를 만족하므로 $-1\\le x\\le\\dfrac32$ 전체가 해이다.\n③ $x\\ge\\dfrac32$일 때\n$(x+1)+(2x-3)\\le8$\n$3x-2\\le8$\n$3x\\le10$\n$x\\le\\dfrac{10}{3}$이다.\n구간 조건과 합치면 $\\dfrac32\\le x\\le\\dfrac{10}{3}$이다.\n세 구간의 해를 합하면\n$-2\\le x\\le\\dfrac{10}{3}$이다.\n따라서\n$a+b=-2+\\dfrac{10}{3}$\n$=\\dfrac43$이다. 정답은 ②이다.",
    "subUnitKey": "H22-C-06-INEQUALITY",
    "subUnit": "여러 가지 부등식",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 12,
    "level": "중",
    "category": "순열과 조합",
    "originalCategory": "순열과 조합",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-08",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "순열과 조합"
    ],
    "wide": false,
    "content": "OTT 플랫폼의 액션 영화 4편, 로맨스 영화 3편, 공포 영화 3편 중 액션 2편, 로맨스 1편, 공포 2편을 선택하고 시청 순서를 정하는 경우의 수는? [4점]",
    "choices": [
      "6400",
      "6440",
      "6480",
      "6520",
      "6560"
    ],
    "answer": "③",
    "solution": "[키포인트] 영화를 종류별로 고른 뒤 선택된 5편의 순서를 정한다.\n조건 정리: 액션 4편 중 2편, 로맨스 3편 중 1편, 공포 3편 중 2편을 선택한다. 선택된 영화들은 서로 다른 작품이다.\n풀이 방향: 종류별 선택 방법의 수를 곱한 뒤 5편을 배열하는 $5!$을 곱한다.\n정석 풀이: 선택 방법은 ${}_4C_2\\times{}_3C_1\\times{}_3C_2=6\\times3\\times3=54$가지이다. 선택한 5편의 시청 순서는 $5!=120$가지이므로 전체 경우의 수는 $54\\times120=6480$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H22-C-08-CORE",
    "subUnit": "순열과 조합 핵심 개념",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 13,
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
    "content": "$x^3=1$의 한 허근을 $w$라 할 때, $\\dfrac{1}{w+1}+\\dfrac{1}{\\overline{w}+1}+\\dfrac{1}{w^{12}}$의 값은? (단, $\\overline{w}$는 $w$의 켤레복소수이다.) [4.1점]",
    "choices": [
      "$-2$",
      "$-1$",
      "0",
      "1",
      "2"
    ],
    "answer": "⑤",
    "solution": "$w$는 $x^3=1$의 허근이므로 $w\\ne1$이다.\n$w^3-1=(w-1)(w^2+w+1)=0$\n따라서 $w^2+w+1=0$이다.\n이 이차방정식은 실수 계수이고 허근이 $w$이므로 다른 근은 $\\overline w$이다.\n근의 합에서\n$\\overline w=-1-w$\n$\\overline w=w^2$이다.\n그러므로\n$w+1=-w^2$, $\\overline w+1=w^2+1=-w$이다.\n또 $w^3=1$이므로 $w\\ne0$이고\n$\\dfrac1{w^2}=w$, $\\dfrac1w=w^2$이다.\n구하는 식은\n$\\dfrac1{w+1}+\\dfrac1{\\overline w+1}+\\dfrac1{w^{12}}$\n$=-w-w^2+\\dfrac1{(w^3)^4}$\n$=-(w+w^2)+1$\n$=-(-1)+1$\n$=2$이다. 정답은 ⑤이다.",
    "subUnitKey": "H22-C-04-COMPLEX_ROOT",
    "subUnit": "복소수와 이차방정식",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 14,
    "level": "중",
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
    "content": "이차부등식 $x^2+2(3-k)x+11\\le0$에 대한 설명으로 옳은 것만을 보기에서 있는 대로 고른 것은? [4.2점]<br><div class='note-box'>(가) $k=9$일 때, 이차부등식의 해는 $1\\le x\\le11$이다.<br>(나) 이차부등식의 해가 존재하도록 하는 $k$값의 범위는 $k\\lt3-\\sqrt{11}$ 또는 $k\\gt3+\\sqrt{11}$이다.<br>(다) 이차부등식의 해가 존재하지 않도록 하는 모든 정수 $k$값의 합은 21이다.</div>",
    "choices": [
      "(가)",
      "(나)",
      "(나),(다)",
      "(가),(다)",
      "(가),(나),(다)"
    ],
    "answer": "④",
    "solution": "이차식의 최고차항 계수가 양수이므로 그래프가 아래로 내려가거나 $x$축에 닿아야 $0$ 이하인 값이 존재한다.\n즉 판별식 $D$가 $0$ 이상이어야 한다.\n(가) $k=9$를 대입하면\n$x^2+2(3-9)x+11\\le0$\n$x^2-12x+11\\le0$\n$(x-1)(x-11)\\le0$\n$1\\le x\\le11$이다. 따라서 (가)는 참이다.\n(나) 판별식을 계산하면\n$D=[2(3-k)]^2-4\\cdot11$\n$=4(k-3)^2-44$이다.\n해가 존재할 조건은\n$4(k-3)^2-44\\ge0$\n$(k-3)^2\\ge11$\n$|k-3|\\ge\\sqrt{11}$\n$k\\le3-\\sqrt{11}$ 또는 $k\\ge3+\\sqrt{11}$이다.\n등호일 때도 중근 하나가 부등식의 해이므로 경계값을 포함해야 한다.\n보기 (나)는 경계값 $k=3\\pm\\sqrt{11}$이 빠져 있으므로 거짓이다.\n(다) 해가 존재하지 않으려면\n$D<0$\n$(k-3)^2<11$\n$3-\\sqrt{11}<k<3+\\sqrt{11}$이다.\n$3<\\sqrt{11}<4$이므로 이 범위의 정수는 $0,1,2,3,4,5,6$이다.\n그 합은\n$0+1+2+3+4+5+6=21$이다. 따라서 (다)는 참이다.\n옳은 것은 (가), (다)이므로 정답은 ④이다.",
    "subUnitKey": "H22-C-06-INEQUALITY",
    "subUnit": "여러 가지 부등식",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 15,
    "level": "중",
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
    "content": "한 개의 주사위를 세 번 던져 나온 눈을 차례로 백의 자리, 십의 자리, 일의 자리 숫자로 만든 세 자리 자연수 중 4의 배수인 것의 개수는? [4.2점]",
    "choices": [
      "30",
      "36",
      "42",
      "48",
      "54"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 4의 배수 여부는 마지막 두 자리로 결정된다.\n조건 정리: 각 자리 숫자는 주사위 눈이므로 1부터 6까지이다. 백의 자리와 관계없이 십의 자리와 일의 자리로 만든 두 자리 수가 4의 배수여야 한다.\n풀이 방향: 가능한 마지막 두 자리를 모두 찾고 백의 자리 6가지를 곱한다.\n정석 풀이: 조건을 만족하는 마지막 두 자리는 $12,16,24,32,36,44,52,56,64$의 9개이다. 각 경우마다 백의 자리는 1부터 6까지 6가지이므로 전체 개수는 $9\\times6=54$이다.\n따라서 정답은 ⑤이다.",
    "subUnitKey": "H22-C-08-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 16,
    "level": "상",
    "category": "사차방정식",
    "originalCategory": "사차방정식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "사차방정식"
    ],
    "wide": false,
    "content": "자연수 $n$에 대하여 사차방정식 $16x^4-8(n^2+4)x^2+(n^2-4)^2=0$이 서로 다른 네 개의 정수해를 갖도록 하는 20 이하 자연수 $n$의 개수는? [4.3점]",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "④",
    "solution": "짝수 차수의 항만 있으므로 $x^2$에 대한 이차식으로 보고 인수분해한다.\n$(n+2)^2+(n-2)^2=2n^2+8$\n$(n+2)^2(n-2)^2=(n^2-4)^2$이므로\n$16x^4-8(n^2+4)x^2+(n^2-4)^2$\n$=[4x^2-(n+2)^2][4x^2-(n-2)^2]$이다.\n따라서 네 근은\n$x=\\pm\\dfrac{n+2}{2}$, $x=\\pm\\dfrac{n-2}{2}$이다.\n이 값들이 정수가 되려면 $n$이 짝수여야 하고, 짝수이면 모두 정수이다.\n서로 다른 네 근이 되려면 두 절댓값이 서로 다르고 모두 $0$이 아니어야 한다.\n$n>0$이므로 $n+2>0$이고\n$(n+2)^2-(n-2)^2=8n>0$이다.\n따라서 두 절댓값은 항상 서로 다르다.\n다만 $n=2$이면 $\\pm\\dfrac{n-2}{2}$가 모두 $0$이 되므로 제외한다.\n$20$ 이하의 짝수 자연수는 $2,4,6,\\ldots,20$의 $10$개이다.\n이 중 $2$를 제외하면\n$10-1=9$개이다. 정답은 ④이다.",
    "subUnitKey": "H22-C-06-EQUATION_BASIC",
    "subUnit": "방정식의 풀이",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 17,
    "level": "중",
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
    "content": "이차정사각행렬 $A$의 $(i,j)$성분이 $a_{ij}=0 (i<j)$, <br>$a_{ij}=1 (i\\ge j)$일 때, $A+A^2+\\cdots+A^{10}$의 모든 성분의 합은? [4.3점]",
    "choices": [
      "60",
      "65",
      "70",
      "75",
      "80"
    ],
    "answer": "④",
    "solution": "성분의 조건을 대입하면\n$A=\\begin{pmatrix}1&0\\\\1&1\\end{pmatrix}$이다.\n먼저 한 번 더 곱해 보면\n$A^2=\\begin{pmatrix}1&0\\\\1&1\\end{pmatrix}\\begin{pmatrix}1&0\\\\1&1\\end{pmatrix}$\n$=\\begin{pmatrix}1&0\\\\2&1\\end{pmatrix}$이다.\n왼쪽 아래 성분이 $m$인 행렬에 $A$를 한 번 더 곱하면\n$\\begin{pmatrix}1&0\\\\m&1\\end{pmatrix}\\begin{pmatrix}1&0\\\\1&1\\end{pmatrix}$\n$=\\begin{pmatrix}1&0\\\\m+1&1\\end{pmatrix}$이다.\n따라서 $A$를 곱할 때마다 왼쪽 아래 성분만 $1$씩 커지므로\n$A^m=\\begin{pmatrix}1&0\\\\m&1\\end{pmatrix}$이다.\n이에 따라\n$A+A^2+\\cdots+A^{10}=\\begin{pmatrix}10&0\\\\1+2+\\cdots+10&10\\end{pmatrix}$이다.\n아래 성분의 합은 앞뒤를 짝지어\n$1+2+\\cdots+10=(1+10)+(2+9)+(3+8)+(4+7)+(5+6)$\n$=5\\cdot11$\n$=55$이다.\n그러므로 모든 성분의 합은\n$10+0+55+10=75$이다. 정답은 ④이다.",
    "subUnitKey": "H22-C-09-CORE",
    "subUnit": "경우의 수 핵심 개념",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 18,
    "level": "상",
    "category": "입체도형",
    "originalCategory": "입체도형",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "입체도형",
      "도형"
    ],
    "wide": false,
    "content": "밑면의 반지름의 길이가 $a$이고 높이가 $b$인 원기둥 모양의 입체도형이 있다. 이 입체도형에서 그림과 같이 한 모서리의 길이가 $b$인 정육면체 모양의 구멍을 뚫었다. 남아 있는 입체도형의 겉넓이가 $140\\pi+18$일 때, 두 유리수 $a,b$에 대하여 $a-b$의 값은? (단, $b\\lt\\sqrt{2}a$) [4.4점]",
    "choices": [
      "4",
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "①",
    "solution": "그림의 정사각형 구멍은 원기둥의 위아래를 관통한다.\n$b<\\sqrt2a$이므로 정사각형의 대각선 $b\\sqrt2$는 밑면의 지름 $2a$보다 작다.\n겉넓이는 바깥 옆면, 구멍을 뺀 위아래 면, 구멍 안쪽 네 면의 넓이를 더한다.\n바깥 옆면의 넓이는 $2\\pi ab$이다.\n위아래 면의 넓이는 $2(\\pi a^2-b^2)$이다.\n구멍 안쪽 네 면은 가로와 세로가 각각 $b$이므로 넓이의 합이 $4b^2$이다.\n따라서 남은 입체도형의 겉넓이는\n$2\\pi ab+2(\\pi a^2-b^2)+4b^2$\n$=2\\pi ab+2\\pi a^2+2b^2$\n$=2a(a+b)\\pi+2b^2$이다.\n문제의 조건을 대입하면\n$2a(a+b)\\pi+2b^2=140\\pi+18$\n$[2a(a+b)-140]\\pi=18-2b^2$이다.\n$a,b$는 유리수이다. 왼쪽의 $\\pi$의 계수가 $0$이 아니면 이 식에서 $\\pi$가 유리수가 되어 모순이다.\n따라서\n$2a(a+b)=140$, $2b^2=18$이다.\n$2b^2=18$에서\n$b^2=9$\n$b=3$이다. 길이이므로 양수만 택했다.\n이를 첫째 식에 대입하면\n$a(a+3)=70$\n$a^2+3a-70=0$\n$(a-7)(a+10)=0$이다.\n반지름도 양수이므로 $a=7$이다.\n이때 $3<7\\sqrt2$로 주어진 조건도 만족한다.\n따라서\n$a-b=7-3=4$이다. 정답은 ①이다.",
    "image": "assets/images/26_복성고_1학기_기말_고1_기출/q18.png",
    "subUnitKey": "H22-C-06-EQUATION_APPLICATION",
    "subUnit": "방정식과 부등식의 활용",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 19,
    "level": "상",
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
      "경우의 수",
      "도형"
    ],
    "wide": false,
    "content": "그림과 같은 $A,B,C,D$ 4개의 영역을 서로 다른 $k$<br>($k\\ge4$)가지 이하의 색으로 칠하려고 한다. 같은 색을 여러 번 사용해도 좋으나 인접한 영역은 서로 다른 색으로 칠하여 구분할 때, 칠하는 방법의 수가 480이 되도록 하는 $k$의 값은? (단, 각 영역에는 한 가지 색만 칠하고, 경계선을 공유하는 경우만 인접한 영역으로 생각한다.) [4.7점]",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "②",
    "solution": "그림에서 $A,C$는 서로 경계선을 공유하고, $B,D$는 각각 $A,C$와 경계선을 공유한다.\n$B,D$끼리는 경계선을 공유하지 않으므로 같은 색을 써도 된다.\n먼저 $A$에 칠할 색은 $k$가지이다.\n$C$는 $A$와 다른 색이어야 하므로 $k-1$가지이다.\n$B$는 서로 다른 두 색을 쓴 $A,C$와 모두 달라야 하므로 $k-2$가지이다.\n$D$도 $A,C$의 두 색을 제외한 $k-2$가지 중에서 고른다.\n$B,D$의 선택은 서로 제한하지 않으므로 곱의 법칙에 따라\n$k(k-1)(k-2)(k-2)=480$\n$k(k-1)(k-2)^2=480$이다.\n$k=6$을 대입하면\n$6\\cdot5\\cdot(6-2)^2$\n$=30\\cdot16$\n$=480$이다.\n$k\\ge4$에서 네 양의 인수 $k,k-1,k-2,k-2$는 $k$가 커질수록 모두 커진다.\n따라서 곱도 커지므로 $480$이 되는 값은 $k=6$ 하나뿐이다. 정답은 ②이다.",
    "image": "assets/images/26_복성고_1학기_기말_고1_기출/q19.png",
    "subUnitKey": "H22-C-08-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 20,
    "level": "상",
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
    "content": "세 이차정사각행렬 $A=\\begin{pmatrix}a&0\\\\0&0\\end{pmatrix}$, $B,C$가 다음 조건을 만족시킨다.<br><div class='note-box'>1) $AB=CA$<br>2) 행렬 $B$의 모든 성분의 합이 $-2$이다.<br>3) 행렬 $C$의 $(1,1)$성분과 $(2,1)$성분이 같다.</div><br>$B+C=\\begin{pmatrix}0&-2\\\\1&2\\end{pmatrix}$일 때, 행렬 $C$의 모든 성분의 합은? (단, $a$는 0이 아닌 상수이다.) [4.7점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "③",
    "solution": "행렬을 더할 때는 같은 위치의 성분끼리 더한다.\n따라서 $B+C$의 모든 성분의 합은 $B$의 성분합과 $C$의 성분합을 더한 값이다.\n주어진 합행렬의 성분합은\n$0+(-2)+1+2=1$이다.\n$C$의 모든 성분의 합을 $s$라 놓으면, $B$의 성분합이 $-2$이므로\n$-2+s=1$\n$s=3$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "H22-C-09-CORE",
    "subUnit": "경우의 수 핵심 개념",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 21,
    "level": "중",
    "category": "경우의 수",
    "originalCategory": "경우의 수",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-08",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 8,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "경우의 수"
    ],
    "wide": false,
    "content": "&lt;서논술형 1&gt;<br>1부터 $n$($n\\ge8$)까지의 자연수 중에서 서로 다른 5개의 수를 뽑으려고 한다. 뽑은 5개의 수를 작은 것부터 크기 순서대로 나열했을 때, 3번째에 놓이는 수가 6인 경우의 수가 200 이상이 되도록 하는 자연수 $n$의 최솟값을 풀이과정과 함께 구하시오. [5점, 부분점수 있음]",
    "choices": [],
    "answer": "$13$",
    "solution": "작은 순서로 세 번째 수가 $6$이려면 $6$을 반드시 뽑고, 그보다 작은 수와 큰 수를 각각 두 개씩 뽑아야 한다.\n$6$보다 작은 수는 $1,2,3,4,5$의 $5$개이다.\n이 중 두 개를 뽑는 방법은\n${}_5C_2=\\dfrac{5\\cdot4}{2\\cdot1}$\n$=10$가지이다.\n$6$보다 큰 수는 $7,8,\\ldots,n$의 $n-6$개이다.\n이 중 두 개를 뽑는 방법은 ${}_{n-6}C_2$가지이다.\n뽑은 수를 작은 순서로 놓는 방법은 하나이므로, 경우의 수는\n$10{}_{n-6}C_2$이다.\n이 값이 $200$ 이상이어야 하므로\n$10{}_{n-6}C_2\\ge200$\n${}_{n-6}C_2\\ge20$이다.\n$m=n-6$이라 놓으면 $m\\ge2$이고, ${}_mC_2$는 $m$이 증가할 때마다 증가한다.\n경계의 두 값을 계산하면\n${}_6C_2=\\dfrac{6\\cdot5}{2}=15<20$\n${}_7C_2=\\dfrac{7\\cdot6}{2}=21\\ge20$이다.\n따라서 가능한 가장 작은 $m$은 $7$이다.\n$n-6=7$\n$n=13$이다. 구하는 최솟값은 $13$이다.",
    "subUnitKey": "H22-C-08-COUNTING_PRINCIPLE",
    "subUnit": "경우의 수",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 22,
    "level": "상",
    "category": "연립부등식",
    "originalCategory": "연립부등식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "여러 가지 방정식과 부등식",
    "standardUnitOrder": 6,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "연립부등식"
    ],
    "wide": false,
    "content": "&lt;서논술형2&gt;<br>$x$에 대한 연립부등식 $\\begin{cases}|x-k|\\lt3\\\\x^2-3x-4\\le0\\end{cases}$을 만족시키는 정수 $x$가 존재할 때, 이 연립부등식을 만족시키는 모든 정수 $x$값의 합을 $p$라고 하자. $p=10$이 되도록 하는 모든 정수 $k$값의 합을 풀이과정과 함께 구하시오. (7점, 부분점수 있음)",
    "choices": [],
    "answer": "$5$",
    "solution": "두 번째 부등식을 먼저 푼다.\nx²−3x−4≤0\n(x−4)(x+1)≤0\n−1≤x≤4\n따라서 가능한 정수 x는 −1,0,1,2,3,4이다.\n\n정수 x,k에 대하여 |x−k|<3이므로\n−3<x−k<3\n−3+k<x<3+k이다.\nx가 정수이므로 x=k−2,k−1,k,k+1,k+2 중 하나이다.\n\n두 조건을 만족하는 정수의 합이 10이 되도록 k를 찾는다.\n공통 정수해가 있으려면 [k−2,k+2]와 [−1,4]가 만나야 하므로\nk+2≥−1, k−2≤4,\n즉 −3≤k≤6이다. 이 정수들을 모두 조사한다.\n\nk | 공통 정수해 | 합\n−3 | −1 | −1\n−2 | −1,0 | −1\n−1 | −1,0,1 | 0\n0 | −1,0,1,2 | 2\n1 | −1,0,1,2,3 | 5\n2 | 0,1,2,3,4 | 10\n3 | 1,2,3,4 | 10\n4 | 2,3,4 | 9\n5 | 3,4 | 7\n6 | 4 | 4\n\n합이 10인 k는 2와 3이다.\n따라서 모든 k의 합은 2+3=5이다.",
    "subUnitKey": "H22-C-06-SYSTEM",
    "subUnit": "연립방정식과 연립부등식",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 23,
    "level": "중",
    "category": "행렬",
    "originalCategory": "행렬",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-09",
    "standardUnit": "행렬과 그 연산",
    "standardUnitOrder": 9,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "행렬",
      "표"
    ],
    "wide": false,
    "content": "&lt;서논술형 3&gt;<br>어느 여행사에서 순천에 있는 두 지점 1과 2 사이에 다음 표와 같은 관광 코스를 운영한다고 한다.<div class='question-table-wrap'><table class='question-table'><thead><tr><th>코스</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead><tbody><tr><th>출발 지점</th><td>1</td><td>1</td><td>2</td><td>2</td><td>2</td></tr><tr><th>도착 지점</th><td>2</td><td>2</td><td>1</td><td>1</td><td>2</td></tr></tbody></table></div>$i$지점에서 출발하여 $j$지점에 도착하는 관광 코스의 수를 $(i,j)$성분으로 하는 행렬을 $A$라 할 때, 다음 물음에 대하여 풀이과정과 함께 답하시오. (단, $i=1,2$, $j=1,2$이고, 같은 코스를 여러 번 관광할 수도 있다.) [총 8점]<br>(1) 행렬 $A$를 구하시오. [2점, 부분점수 없음]<br>(2) 행렬 $A$를 이용하여 $i$지점에서 출발하여 세 코스를 이어서 관광하고 $j$지점에 도착하는 모든 경우의 수의 합을 구하시오. [6점, 부분점수 있음]",
    "choices": [],
    "answer": "$A=\\begin{pmatrix}0&2\\\\2&1\\end{pmatrix},\\ 33$",
    "solution": "(1) 행은 출발 지점, 열은 도착 지점을 나타낸다.\n$1\\to1$인 코스는 없고, $1\\to2$인 코스는 A, B의 $2$개이다.\n$2\\to1$인 코스는 C, D의 $2$개이고, $2\\to2$인 코스는 E의 $1$개이다.\n따라서\n$A=\\begin{pmatrix}0&2\\\\2&1\\end{pmatrix}$이다.\n(2) 두 코스를 잇는 경우는 중간 지점이 $1$인 경우와 $2$인 경우로 나눈다.\n각 경우에는 첫 코스의 수와 둘째 코스의 수를 곱하고, 두 경우의 수를 더한다.\n이 계산이 행렬 곱의 성분 계산과 같으므로 두 코스를 잇는 경우의 수 행렬은 $A^2$이다.\n$A^2=\\begin{pmatrix}0\\cdot0+2\\cdot2&0\\cdot2+2\\cdot1\\\\2\\cdot0+1\\cdot2&2\\cdot2+1\\cdot1\\end{pmatrix}$\n$=\\begin{pmatrix}4&2\\\\2&5\\end{pmatrix}$이다.\n여기에 한 코스를 더 이어 붙이면 $A^2A=A^3$이 된다.\n$A^3=\\begin{pmatrix}4&2\\\\2&5\\end{pmatrix}\\begin{pmatrix}0&2\\\\2&1\\end{pmatrix}$\n$=\\begin{pmatrix}4\\cdot0+2\\cdot2&4\\cdot2+2\\cdot1\\\\2\\cdot0+5\\cdot2&2\\cdot2+5\\cdot1\\end{pmatrix}$\n$=\\begin{pmatrix}4&10\\\\10&9\\end{pmatrix}$이다.\n출발·도착 지점의 네 가지 경우는 서로 겹치지 않으므로 모든 성분을 더한다.\n$4+10+10+9=33$\n따라서 구하는 행렬은 $A=\\begin{pmatrix}0&2\\\\2&1\\end{pmatrix}$이고, 모든 경우의 수의 합은 $33$이다.",
    "subUnitKey": "H22-C-09-CORE",
    "subUnit": "경우의 수 핵심 개념",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  }
];

// 2026-07 source-fidelity corrections
{
  const question = (id) => window.questionBank.find((q) => q.id === id);
  question(14).content = question(14).content.replace(
    "$k\\lt3-\\sqrt{11}$ 또는 $k\\gt3+\\sqrt{11}$",
    "$x\\lt3-\\sqrt{11}$ 또는 $x\\gt3+\\sqrt{11}$"
  );
}
