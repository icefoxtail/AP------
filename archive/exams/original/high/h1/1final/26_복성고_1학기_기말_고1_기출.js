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
    "subUnit": "permutation",
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
    "content": "두 행렬 $A=\\begin{pmatrix}-6&a\\\\3&0\\end{pmatrix}$, $B=\\begin{pmatrix}b&1\\\\-2&0\\end{pmatrix}$에 대하여 $A=kB$일 때, $a+b+k$의 값은? [3.6점]",
    "choices": [
      "$-3$",
      "$-1$",
      "1",
      "3",
      "5"
    ],
    "answer": "③",
    "solution": "[키포인트] 행렬의 같은 위치에 있는 성분끼리 비교한다.\n조건 정리: $A=kB$이므로 $A$의 각 성분은 $B$의 같은 위치 성분에 $k$를 곱한 값과 같다.\n풀이 방향: 수치가 바로 보이는 $(2,1)$성분에서 $k$를 먼저 구한 뒤 $a,b$를 구한다.\n정석 풀이: $(2,1)$성분을 비교하면 $3=-2k$이므로 $k=-\\dfrac{3}{2}$이다. $(1,2)$성분에서 $a=k=-\\dfrac{3}{2}$이다. $(1,1)$성분에서 $-6=kb$이므로 $-6=-\\dfrac{3}{2}b$이고 $b=4$이다. 따라서 $a+b+k=-\\dfrac{3}{2}+4-\\dfrac{3}{2}=1$이다.\n따라서 정답은 ③이다.",
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
    "content": "두 행렬 $A=\\begin{pmatrix}2&0\\\\-5&4\\end{pmatrix}$, $B=\\begin{pmatrix}1&-1\\\\3&2\\end{pmatrix}$에 대하여 $A+2B$의 $(1,1)$성분을 $a$, $2A-B$의 $(2,1)$성분을 $b$라 하자. $a-b$의 값은? [3.7점]",
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
    "solution": "[키포인트] 연속부등식을 두 개의 부등식으로 나누어 푼다.\n조건 정리: $2x-3\\le5x+6$과 $5x+6\\le3x+7$을 동시에 만족해야 한다.\n풀이 방향: 각각의 해를 구한 뒤 공통 범위를 정한다.\n정석 풀이: 첫째 부등식에서 $-9\\le3x$이므로 $x\\ge-3$이다. 둘째 부등식에서 $2x\\le1$이므로 $x\\le\\dfrac{1}{2}$이다. 따라서 $-3\\le x\\le\\dfrac{1}{2}$이므로 $a=-3$, $b=\\dfrac{1}{2}$이다. 따라서 $a+2b=-3+1=-2$이다.\n따라서 정답은 ⑤이다.",
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
    "solution": "[키포인트] 실수 계수 다항식은 허근과 그 켤레복소수를 함께 근으로 갖는다.\n조건 정리: $2+i$가 근이므로 $2-i$도 근이다. 나머지 한 근을 $r$이라 둔다.\n풀이 방향: 세 근에 대한 근과 계수의 관계를 이용해 $r,a,b$를 차례로 구한다.\n정석 풀이: 두 허근의 곱은 $(2+i)(2-i)=5$이고 합은 4이다. 두 근씩 곱한 합이 $x$의 계수 1과 같으므로 $5+4r=1$에서 $r=-1$이다. 세 근의 합은 $4+(-1)=3=-a$이므로 $a=-3$이다. 세 근의 곱은 $5\\times(-1)=-5=-b$이므로 $b=5$이다.\n따라서 정답은 ①이다.",
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
    "subUnit": "combination",
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
    "solution": "[키포인트] 절댓값 안의 식이 0이 되는 두 점을 기준으로 구간을 나눈다.\n조건 정리: 기준점은 $x=-1$, $x=\\dfrac{3}{2}$이다.\n풀이 방향: 세 구간에서 절댓값을 풀어 쓴 뒤 얻은 해를 합친다.\n정석 풀이: $x\\le-1$이면 $|x+1|+|2x-3|=-3x+2\\le8$이므로 $x\\ge-2$이고 $-2\\le x\\le-1$이다. $-1\\le x\\le\\dfrac{3}{2}$이면 식은 $-x+4\\le8$이므로 이 구간의 모든 $x$가 해이다. $x\\ge\\dfrac{3}{2}$이면 식은 $3x-2\\le8$이므로 $x\\le\\dfrac{10}{3}$이다. 따라서 전체 해는 $-2\\le x\\le\\dfrac{10}{3}$이고 $a+b=-2+\\dfrac{10}{3}=\\dfrac{4}{3}$이다.\n따라서 정답은 ②이다.",
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
    "solution": "[키포인트] $w^3=1$과 $1+w+w^2=0$을 이용해 각 분수를 간단히 한다.\n조건 정리: $w$는 허근이므로 $\\overline{w}=w^2$, $w^{12}=1$이다. 또한 $w+1=-w^2$, $w^2+1=-w$이다.\n풀이 방향: 앞의 두 분수를 각각 $w$의 식으로 바꾼 뒤 마지막 항과 더한다.\n정석 풀이: $\\dfrac{1}{w+1}=\\dfrac{1}{-w^2}=-w$이고, $\\dfrac{1}{\\overline{w}+1}=\\dfrac{1}{w^2+1}=\\dfrac{1}{-w}=-w^2$이다. 따라서 앞의 두 항의 합은 $-(w+w^2)=1$이다. 또 $\\dfrac{1}{w^{12}}=1$이므로 전체 값은 $1+1=2$이다.\n따라서 정답은 ⑤이다.",
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
    "content": "이차부등식 $x^2+2(3-k)x+11\\le0$에 대한 설명으로 옳은 것만을 보기에서 있는 대로 고른 것은? [4.2점]<br><div class='note-box'>(가) $k=9$일 때, 이차부등식의 해는 $1\\le x\\le11$이다.<br>(나) 이차부등식의 해가 존재하도록 하는 $k$값의 범위는 $x\\lt3-\\sqrt{11}$ 또는 $x\\gt3+\\sqrt{11}$이다.<br>(다) 이차부등식의 해가 존재하지 않도록 하는 모든 정수 $k$값의 합은 21이다.</div>",
    "choices": [
      "(가)",
      "(나)",
      "(나),(다)",
      "(가),(다)",
      "(가),(나),(다)"
    ],
    "answer": "④",
    "solution": "[키포인트] 각 설명을 판별식과 인수분해로 따로 확인한다.\n조건 정리: 이차식의 최고차항 계수는 양수이므로 부등식의 해가 존재하려면 판별식이 0 이상이어야 한다.\n풀이 방향: (가)는 직접 인수분해하고, (나)와 (다)는 판별식의 부호를 이용한다.\n정석 풀이: (가) $k=9$이면 $x^2-12x+11=(x-1)(x-11)$이므로 해는 $1\\le x\\le11$이고 참이다. (나) 판별식은 $4(3-k)^2-44$이므로 해가 존재할 조건은 $(k-3)^2\\ge11$, 즉 $k\\le3-\\sqrt{11}$ 또는 $k\\ge3+\\sqrt{11}$이다. 보기에는 등호가 없으므로 거짓이다. (다) 해가 존재하지 않을 조건은 $3-\\sqrt{11}\\lt k\\lt3+\\sqrt{11}$이다. 이 범위의 정수는 $0,1,2,3,4,5,6$이고 합은 21이므로 참이다. 따라서 옳은 것은 (가), (다)이다.\n따라서 정답은 ④이다.\\n[원본 문항 주의] (나)는 $k$의 범위를 묻지만 인쇄된 식에는 $x$가 쓰였고 경계의 등호도 빠져 있다. 원문을 그대로 판정하면 (나)는 거짓이며 정답 ④는 유지된다. 올바른 존재 조건은 $k\\le3-\\sqrt{11}$ 또는 $k\\ge3+\\sqrt{11}$이다.\\n[원본 문항 주의] (나)는 $k$의 범위를 묻지만 인쇄된 식에는 $x$가 쓰였고 경계의 등호도 빠져 있다. 원문을 그대로 판정하면 (나)는 거짓이며 정답 ④는 유지된다. 올바른 존재 조건은 $k\\le3-\\sqrt{11}$ 또는 $k\\ge3+\\sqrt{11}$이다.\\n[원본 문항 주의] (나)는 $k$의 범위를 묻지만 인쇄된 식에는 $x$가 쓰였고 경계의 등호도 빠져 있다. 원문을 그대로 판정하면 (나)는 거짓이며 정답 ④는 유지된다. 올바른 존재 조건은 $k\\le3-\\sqrt{11}$ 또는 $k\\ge3+\\sqrt{11}$이다.\\n[원본 문항 주의] (나)는 $k$의 범위를 묻지만 인쇄된 식에는 $x$가 쓰였고 경계의 등호도 빠져 있다. 원문을 그대로 판정하면 (나)는 거짓이며 정답 ④는 유지된다. 올바른 존재 조건은 $k\\le3-\\sqrt{11}$ 또는 $k\\ge3+\\sqrt{11}$이다.\\n[원본 문항 주의] (나)는 $k$의 범위를 묻지만 인쇄된 식에는 $x$가 쓰였고 경계의 등호도 빠져 있다. 원문을 그대로 판정하면 (나)는 거짓이며 정답 ④는 유지된다. 올바른 존재 조건은 $k\\le3-\\sqrt{11}$ 또는 $k\\ge3+\\sqrt{11}$이다.",
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
    "subUnit": "counting principle",
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
    "solution": "[키포인트] 사차식을 두 이차식의 곱으로 인수분해하여 네 근을 직접 나타낸다.\n조건 정리: 주어진 식은 $[4x^2-(n+2)^2][4x^2-(n-2)^2]=0$으로 인수분해된다.\n풀이 방향: 네 근이 모두 정수이면서 서로 달라지도록 하는 $n$의 조건을 찾는다.\n정석 풀이: 근은 $x=\\pm\\dfrac{n+2}{2}$, $x=\\pm\\dfrac{n-2}{2}$이다. 네 근이 정수가 되려면 $n$은 짝수여야 한다. $n=2$이면 뒤의 두 근이 모두 0이 되어 서로 다른 근이 3개뿐이므로 제외한다. 따라서 20 이하에서 가능한 $n$은 $4,6,8,10,12,14,16,18,20$의 9개이다.\n따라서 정답은 ④이다.",
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
    "content": "이차정사각행렬 $A$의 $(i,j)$성분이 $a_{ij}=0 (i<j)$, $a_{ij}=1 (i\\ge j)$일 때, $A+A^2+\\cdots+A^{10}$의 모든 성분의 합은? [4.3점]",
    "choices": [
      "60",
      "65",
      "70",
      "75",
      "80"
    ],
    "answer": "④",
    "solution": "[키포인트] 행렬을 단위행렬과 제곱하면 0이 되는 행렬의 합으로 본다.\n조건 정리: $A=\\begin{pmatrix}1&0\\\\1&1\\end{pmatrix}=E+N$, $N=\\begin{pmatrix}0&0\\\\1&0\\end{pmatrix}$이고 $N^2=O$이다.\n풀이 방향: $(E+N)^m=E+mN$을 이용해 각 거듭제곱의 형태를 구한다.\n정석 풀이: $N^2=O$이므로 $A^m=E+mN=\\begin{pmatrix}1&0\\\\m&1\\end{pmatrix}$이다. 따라서 $A+A^2+\\cdots+A^{10}=\\begin{pmatrix}10&0\\\\1+2+\\cdots+10&10\\end{pmatrix}=\\begin{pmatrix}10&0\\\\55&10\\end{pmatrix}$이다. 모든 성분의 합은 $10+0+55+10=75$이다.\n따라서 정답은 ④이다.",
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
    "solution": "[키포인트] 남은 겉넓이를 원기둥의 바깥 면, 위아래 면, 구멍 안쪽 면으로 나누어 센다.\n조건 정리: 원기둥의 옆넓이는 $2\\pi ab$이다. 위아래 원에서는 한 변이 $b$인 정사각형이 각각 빠지고, 구멍 안쪽에는 한 변이 $b$인 정사각형 4개가 새로 생긴다.\n풀이 방향: 각 면의 넓이를 합한 뒤 $\\pi$가 붙은 부분과 붙지 않은 부분을 비교한다.\n정석 풀이: 위아래 면의 넓이는 $2(\\pi a^2-b^2)$이고 구멍 안쪽 네 면의 넓이는 $4b^2$이다. 따라서 남은 입체도형의 겉넓이는 $2\\pi ab+2(\\pi a^2-b^2)+4b^2=2\\pi a(a+b)+2b^2$이다. 이것이 $140\\pi+18$과 같으므로 $2a(a+b)=140$, $2b^2=18$이다. 길이이므로 $b=3$이고, $a(a+3)=70$에서 $(a-7)(a+10)=0$이다. 반지름은 양수이므로 $a=7$이다. 따라서 $a-b=7-3=4$이다.\n따라서 정답은 ①이다.",
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
    "content": "그림과 같은 $A,B,C,D$ 4개의 영역을 서로 다른 $k$($k\\ge4$)가지 이하의 색으로 칠하려고 한다. 같은 색을 여러 번 사용해도 좋으나 인접한 영역은 서로 다른 색으로 칠하여 구분할 때, 칠하는 방법의 수가 480이 되도록 하는 $k$의 값은? (단, 각 영역에는 한 가지 색만 칠하고, 경계선을 공유하는 경우만 인접한 영역으로 생각한다.) [4.7점]",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "②",
    "solution": "[키포인트] 영역의 인접 관계를 따라 색을 차례로 정한다.\n조건 정리: 그림에서 $A$와 $C$는 인접하고, $B$와 $D$는 서로 경계선을 공유하지 않아 같은 색을 사용할 수 있다. $B$와 $D$는 각각 $A,C$와 인접한다.\n풀이 방향: $A$, $C$의 색을 먼저 정한 뒤 $B$, $D$의 색을 독립적으로 정한다.\n정석 풀이: $A$의 색은 $k$가지이다. $C$는 $A$와 다른 색이어야 하므로 $k-1$가지이다. $B$는 $A,C$와 모두 다른 색이어야 하므로 $k-2$가지이고, $D$도 같은 이유로 $k-2$가지이다. $B,D$는 서로 인접하지 않으므로 같은 색을 써도 된다. 따라서 경우의 수는 $k(k-1)(k-2)^2$이다. 보기의 값을 대입하면 $k=6$일 때 $6\\times5\\times4^2=480$이다.\n따라서 정답은 ②이다.",
    "image": "assets/images/26_복성고_1학기_기말_고1_기출/q19.png",
    "subUnitKey": "H22-C-08-COUNTING_PRINCIPLE",
    "subUnit": "counting principle",
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
    "content": "세 이차정사각행렬 $A=\\begin{pmatrix}a&0\\\\0&0\\end{pmatrix}$, $B,C$가 다음 조건을 만족시킨다.<br><div class='note-box'>1) $AB=CA$<br>2) 행렬 $B$의 모든 성분의 합이 $-2$이다.<br>3) 행렬 $C$의 $(1,1)$성분과 $(2,1)$성분이 같다.</div>$B+C=\\begin{pmatrix}0&-2\\\\1&2\\end{pmatrix}$일 때, 행렬 $C$의 모든 성분의 합은? (단, $a$는 0이 아닌 상수이다.) [4.7점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "③",
    "solution": "[키포인트] 미지의 행렬 성분을 문자로 두고 $AB=CA$와 나머지 조건을 함께 사용한다.\n조건 정리: $B=\\begin{pmatrix}b&c\\\\d&e\\end{pmatrix}$, $C=\\begin{pmatrix}f&g\\\\h&i\\end{pmatrix}$라 둔다. $a\\ne0$이다.\n풀이 방향: 먼저 $AB=CA$에서 성분 관계를 구하고, $B+C$와 성분합 조건으로 나머지 값을 정한다.\n정석 풀이: $AB=\\begin{pmatrix}ab&ac\\\\0&0\\end{pmatrix}$이고 $CA=\\begin{pmatrix}af&0\\\\ah&0\\end{pmatrix}$이다. 따라서 $b=f$, $c=0$, $h=0$이다. 또 $C$의 $(1,1)$성분과 $(2,1)$성분이 같으므로 $f=h=0$이고, 이에 따라 $b=0$이다. $B+C=\\begin{pmatrix}0&-2\\\\1&2\\end{pmatrix}$에서 $g=-2$, $d=1$, $e+i=2$이다. $B$의 모든 성분의 합이 $-2$이므로 $0+0+1+e=-2$에서 $e=-3$이고 $i=5$이다. 따라서 $C$의 모든 성분의 합은 $0-2+0+5=3$이다.\n따라서 정답은 ③이다.",
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
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "경우의 수"
    ],
    "wide": false,
    "content": "&lt;서논술형 1&gt;<br>&lt;서논술형 1&gt;<br>&lt;서논술형 1&gt;<br>&lt;서논술형 1&gt;<br>&lt;서논술형 1&gt;<br>1부터 $n$($n\\ge8$)까지의 자연수 중에서 서로 다른 5개의 수를 뽑으려고 한다. 뽑은 5개의 수를 작은 것부터 크기 순서대로 나열했을 때, 3번째에 놓이는 수가 6인 경우의 수가 200 이상이 되도록 하는 자연수 $n$의 최솟값을 풀이과정과 함께 구하시오. [5점, 부분점수 있음]",
    "choices": [],
    "answer": "$13$",
    "solution": "[키포인트] 세 번째 수가 6이 되려면 6보다 작은 수 2개와 큰 수 2개를 골라야 한다.\n조건 정리: 6보다 작은 자연수는 $1,2,3,4,5$의 5개이고, 6보다 큰 자연수는 $7$부터 $n$까지 $n-6$개이다.\n풀이 방향: 경우의 수를 조합으로 나타낸 뒤 200 이상이 되는 가장 작은 $n$을 찾는다.\n정석 풀이: 6보다 작은 수 2개를 고르는 방법은 ${}_5C_2=10$가지이고, 6보다 큰 수 2개를 고르는 방법은 ${}_{n-6}C_2$가지이다. 따라서 경우의 수는 $10{}_{n-6}C_2$이다. 이 값이 200 이상이므로 ${}_{n-6}C_2\\ge20$이다. $n-6=6$이면 ${}_6C_2=15$로 부족하고, $n-6=7$이면 ${}_7C_2=21$로 조건을 만족한다. 따라서 가장 작은 값은 $n-6=7$, 즉 $n=13$이다.\n따라서 구하는 값은 $13$이다.",
    "subUnitKey": "H22-C-08-COUNTING_PRINCIPLE",
    "subUnit": "counting principle",
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
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "연립부등식"
    ],
    "wide": false,
    "content": "&lt;서논술형 2&gt;<br>&lt;서논술형 2&gt;<br>&lt;서논술형 2&gt;<br>&lt;서논술형 2&gt;<br>&lt;서논술형 2&gt;<br>$x$에 대한 연립부등식 $\\begin{cases}|x-k|\\lt3\\\\x^2-3x-4\\le0\\end{cases}$을 만족시키는 정수 $x$가 존재할 때, 이 연립부등식을 만족시키는 모든 정수 $x$값의 합을 $p$라고 하자. $p=10$이 되도록 하는 모든 정수 $k$값의 합을 풀이과정과 함께 구하시오. [7점, 부분점수 있음]",
    "choices": [],
    "answer": "$5$",
    "solution": "[키포인트] 둘째 부등식의 정수해를 먼저 고정하고, 첫째 부등식이 선택하는 정수들의 합을 조사한다.\n조건 정리: $(x-4)(x+1)\\le0$이므로 둘째 부등식의 정수해는 $-1,0,1,2,3,4$이다. 정수 $x,k$에 대하여 $|x-k|\\lt3$은 $k-2\\le x\\le k+2$와 같다.\n풀이 방향: $[-1,4]$의 정수 중 $[k-2,k+2]$에 들어가는 수의 합이 10이 되는 $k$를 찾는다.\n정석 풀이: 두 정수 구간 $[-1,4]$와 $[k-2,k+2]$가 만나려면 $k+2\\ge-1$이고 $k-2\\le4$이어야 하므로 $-3\\le k\\le6$만 확인하면 된다. $k=2$이면 공통 정수해는 $0,1,2,3,4$이고 합은 10이다. $k=3$이면 공통 정수해는 $1,2,3,4$이고 합은 10이다. $-3\\le k\\le1$에서는 포함되는 정수들의 합이 10보다 작고, $4\\le k\\le6$에서는 합이 $2+3+4=9$ 이하가 된다. 따라서 조건을 만족하는 정수 $k$는 2와 3이고, 그 합은 $2+3=5$이다.\n따라서 구하는 값은 $5$이다.",
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
    "questionType": "서술형",
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
    "solution": "[키포인트] 한 번 이동하는 코스 수를 행렬로 나타내면 세 코스를 이어 가는 경우는 행렬의 세제곱으로 계산할 수 있다.\n조건 정리: 1지점에서 1지점으로 가는 코스는 0개, 1지점에서 2지점으로 가는 코스는 A, B의 2개이다. 2지점에서 1지점으로 가는 코스는 C, D의 2개이고, 2지점에서 2지점으로 가는 코스는 E의 1개이다.\n풀이 방향: 먼저 코스 수 행렬 $A$를 만든 뒤 $A^3$을 계산하고 모든 성분을 더한다.\n정석 풀이: (1) 각 출발·도착 지점에 따른 코스 수를 배열하면 $A=\\begin{pmatrix}0&2\\\\2&1\\end{pmatrix}$이다. (2) 두 코스를 이어 가는 경우는 $A^2$의 성분으로 나타나며 $A^2=\\begin{pmatrix}4&2\\\\2&5\\end{pmatrix}$이다. 세 코스를 이어 가는 경우는 $A^3=A^2A=\\begin{pmatrix}4&10\\\\10&9\\end{pmatrix}$이다. 따라서 출발 지점과 도착 지점의 모든 경우를 합한 값은 $4+10+10+9=33$이다.\n따라서 구하는 행렬은 $A=\\begin{pmatrix}0&2\\\\2&1\\end{pmatrix}$이고, 모든 경우의 수의 합은 $33$이다.",
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
  question(14).solution += "\\n[원본 문항 주의] (나)는 $k$의 범위를 묻지만 인쇄된 식에는 $x$가 쓰였고 경계의 등호도 빠져 있다. 원문을 그대로 판정하면 (나)는 거짓이며 정답 ④는 유지된다. 올바른 존재 조건은 $k\\le3-\\sqrt{11}$ 또는 $k\\ge3+\\sqrt{11}$이다.";
  question(21).content = "&lt;서논술형 1&gt;<br>" + question(21).content;
  question(22).content = "&lt;서논술형 2&gt;<br>" + question(22).content;
}
