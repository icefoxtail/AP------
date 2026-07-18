window.examTitle = "26_팔마고_1학기_기말_고2_대수";
window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "수열의 합",
    "originalCategory": "수열의 합",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-07",
    "standardUnit": "수열의 합",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 합"
    ],
    "wide": false,
    "content": "다음은 합의 기호 $\\sum$의 사용 사례를 나타낸 것이다.<br><br>$\\displaystyle\\sum_{k=2}^{5}k^2=2^2+3^2+4^2+5^2=54$<br><br>$\\displaystyle\\sum_{k=2}^{5}k(k+1)$를 계산한 값으로 알맞은 것은? [3.3점]",
    "choices": [
      "56",
      "60",
      "64",
      "68",
      "72"
    ],
    "answer": "④",
    "solution": "[키포인트] 합 기호 안의 식에 $k=2,3,4,5$를 차례로 대입하여 각 항을 구한다.\n조건 정리: 계산할 식은 $\\displaystyle\\sum_{k=2}^{5}k(k+1)$이므로 모두 네 항이다.\n풀이 방향: $k$에 각 정수를 대입한 뒤 네 값을 더한다.\n정석 풀이: $k=2$일 때 $2\\cdot3=6$, $k=3$일 때 $3\\cdot4=12$, $k=4$일 때 $4\\cdot5=20$, $k=5$일 때 $5\\cdot6=30$이다. 따라서 $6+12+20+30=68$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 2,
    "level": "하",
    "category": "사인법칙과 코사인법칙",
    "originalCategory": "사인법칙과 코사인법칙",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-05",
    "standardUnit": "사인법칙과 코사인법칙",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "사인법칙과 코사인법칙",
      "도형"
    ],
    "wide": false,
    "content": "그림과 같이 $B=60^\\circ$, $b=6\\sqrt3$인 삼각형 ABC에서 외접원의 반지름의 길이는? [3.3점]",
    "choices": [
      "6",
      "7",
      "$5\\sqrt2$",
      "8",
      "$5\\sqrt3$"
    ],
    "answer": "①",
    "solution": "[키포인트] 한 변과 그 맞은편 각이 주어졌으므로 확장된 사인법칙 $\\dfrac{b}{\\sin B}=2R$을 이용한다.\n조건 정리: $B=60^\\circ$, $b=6\\sqrt3$이고 $R$은 외접원의 반지름이다.\n풀이 방향: 주어진 값을 사인법칙에 대입하여 $2R$을 먼저 구한다.\n정석 풀이: $\\dfrac{b}{\\sin B}=2R$이므로 $2R=\\dfrac{6\\sqrt3}{\\sin60^\\circ}=\\dfrac{6\\sqrt3}{\\sqrt3/2}=12$이다. 따라서 $R=6$이다.\n따라서 정답은 ①이다.",
    "hasVisualAsset": true,
    "visualAssetType": "source_page_diagram",
    "visualAssetStatus": "cropped_for_manual_cleanup",
    "image": "assets/images/26_팔마고_1학기_기말_고2_대수/q02.png"
  },
  {
    "id": 3,
    "level": "하",
    "category": "등차수열과 등비수열",
    "originalCategory": "등차수열과 등비수열",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-06",
    "standardUnit": "등차수열과 등비수열",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "등차수열과 등비수열"
    ],
    "wide": false,
    "content": "등차수열 $\\{a_n\\}$에 대하여 $a_3=5$, $a_5+a_9=26$일 때, $a_{14}$의 값은? [3.6점]",
    "choices": [
      "25",
      "27",
      "29",
      "31",
      "33"
    ],
    "answer": "②",
    "solution": "[키포인트] 등차수열에서는 두 항의 평균이 그 사이 가운데 항과 같다.\n조건 정리: $a_3=5$, $a_5+a_9=26$이다.\n풀이 방향: $a_5$와 $a_9$의 가운데 항인 $a_7$을 구한 뒤 공차를 찾는다.\n정석 풀이: 등차수열에서 $a_5+a_9=2a_7$이므로 $2a_7=26$, 즉 $a_7=13$이다. $a_7-a_3=4d$이므로 $13-5=4d$에서 $d=2$이다. 따라서 $a_{14}=a_3+11d=5+22=27$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 4,
    "level": "하",
    "category": "등차수열과 등비수열",
    "originalCategory": "등차수열과 등비수열",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-06",
    "standardUnit": "등차수열과 등비수열",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "등차수열과 등비수열"
    ],
    "wide": false,
    "content": "두 수 1과 16 사이에 7개의 수를 넣어 만든 수열<br>$1, x_1, x_2, x_3, x_4, x_5, x_6, x_7, 16$<br>이 이 순서대로 등비수열이 되도록 하는 $x_4$의 값으로 알맞은 것은? [3.6점]",
    "choices": [
      "2",
      "$2\\sqrt2$",
      "4",
      "$4\\sqrt2$",
      "8"
    ],
    "answer": "③",
    "solution": "[키포인트] 첫째항과 아홉째항의 관계로 공비를 구하고, 다섯째항인 $x_4$를 계산한다.\n조건 정리: $1,x_1,x_2,x_3,x_4,x_5,x_6,x_7,16$은 모두 아홉 항인 등비수열이다.\n풀이 방향: 공비를 $r$라 두면 아홉째항은 첫째항에 $r^8$을 곱한 값이다.\n정석 풀이: 첫째항이 $1$, 아홉째항이 $16$이므로 $r^8=16$이다. $x_4$는 다섯째항이므로 $x_4=r^4$이다. $r^8=16$에서 $(r^4)^2=16$이고 $r^4>0$이므로 $r^4=4$이다. 따라서 $x_4=4$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 5,
    "level": "하",
    "category": "수열의 합",
    "originalCategory": "수열의 합",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-07",
    "standardUnit": "수열의 합",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 합"
    ],
    "wide": false,
    "content": "수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합 $S_n$이 $S_n=3n^2-5n+7$일 때, $a_1+a_{10}$의 값은? [3.9점]",
    "choices": [
      "50",
      "53",
      "55",
      "57",
      "60"
    ],
    "answer": "④",
    "solution": "[키포인트] 부분합이 주어졌을 때 $a_1=S_1$, $n\\ge2$에서는 $a_n=S_n-S_{n-1}$을 이용한다.\n조건 정리: $S_n=3n^2-5n+7$이고 $a_1+a_{10}$을 구한다.\n풀이 방향: $a_1$과 $a_{10}$을 각각 부분합으로 계산한다.\n정석 풀이: $a_1=S_1=3-5+7=5$이다. 또 $a_{10}=S_{10}-S_9$이므로 $S_{10}=300-50+7=257$, $S_9=243-45+7=205$에서 $a_{10}=52$이다. 따라서 $a_1+a_{10}=5+52=57$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 6,
    "level": "중",
    "category": "수학적 귀납법",
    "originalCategory": "수학적 귀납법",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-08",
    "standardUnit": "수학적 귀납법",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수학적 귀납법",
      "도형"
    ],
    "wide": false,
    "content": "세 기둥 중에서 한 기둥에 크기가 서로 다른 $n$개의 원판이 큰 것부터 차례로 쌓여 있다. 이 원판은 한 번에 한 개씩만 다른 기둥으로 옮길 수 있고, 큰 원판을 작은 원판 위에 놓을 수 없다. 이때 $n$개의 원판을 다른 한 기둥으로 모두 옮기는 데 필요한 최소 이동 횟수를 $a_n$이라 하면 $a_2$는 다음 그림과 같이 3이다.<br>$a_6$의 값으로 알맞은 것은? [3.9점]",
    "choices": [
      "6",
      "13",
      "15",
      "31",
      "63"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 가장 큰 원판을 옮기기 전후에 나머지 원판들을 한 번씩 모두 옮겨야 한다.\n조건 정리: $a_n$은 $n$개의 원판을 다른 기둥으로 옮기는 최소 이동 횟수이다.\n풀이 방향: $n-1$개의 원판 이동, 가장 큰 원판 이동, 다시 $n-1$개의 원판 이동으로 나누어 점화식을 세운다.\n정석 풀이: 먼저 위의 $n-1$개를 빈 기둥으로 옮기는 데 $a_{n-1}$번, 가장 큰 원판을 목표 기둥으로 옮기는 데 $1$번, 다시 $n-1$개를 큰 원판 위로 옮기는 데 $a_{n-1}$번 필요하다. 따라서 $a_n=2a_{n-1}+1$이고 $a_1=1$이다. 차례로 $a_2=3$, $a_3=7$, $a_4=15$, $a_5=31$, $a_6=63$이다.\n따라서 정답은 ⑤이다.",
    "hasVisualAsset": true,
    "visualAssetType": "source_page_diagram",
    "visualAssetStatus": "cropped_for_manual_cleanup",
    "image": "assets/images/26_팔마고_1학기_기말_고2_대수/q06.png"
  },
  {
    "id": 7,
    "level": "중",
    "category": "등차수열과 등비수열",
    "originalCategory": "등차수열과 등비수열",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-06",
    "standardUnit": "등차수열과 등비수열",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "등차수열과 등비수열"
    ],
    "wide": false,
    "content": "공차가 $d$인 등차수열 $\\{a_n\\}$에 대하여 다음 문장들이 참이 되게 하는 값을 $A$, $B$, $C$라 할 때, $A+B+C$의 값으로 옳은 것은? [4.3점]<br><div class=\"note-box\">• $a_1,\\ a_3,\\ a_5,\\cdots$는 공차가 $A$인 등차수열이다.<br>• $3a_1,\\ 3a_2,\\ 3a_3,\\cdots$는 공차가 $B$인 등차수열이다.<br>• $a_1+a_2,\\ a_3+a_4,\\ a_5+a_6,\\cdots$는 공차가 $C$인 등차수열이다.</div>",
    "choices": [
      "$5d$",
      "$6d$",
      "$7d$",
      "$8d$",
      "$9d$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 원래 등차수열의 일반항을 $a_n=a_1+(n-1)d$로 나타내어 새 수열들의 공차를 구한다.\n조건 정리: 원래 수열의 공차는 $d$이다.\n풀이 방향: 각 새 수열에서 이웃한 두 항의 차를 계산한다.\n정석 풀이: $a_3-a_1=2d$이므로 $A=2d$이다. 또 $3a_2-3a_1=3d$이므로 $B=3d$이다. 마지막으로 $(a_3+a_4)-(a_1+a_2)=(a_3-a_1)+(a_4-a_2)=2d+2d=4d$이므로 $C=4d$이다. 따라서 $A+B+C=2d+3d+4d=9d$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 8,
    "level": "중",
    "category": "수열의 합",
    "originalCategory": "수열의 합",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-07",
    "standardUnit": "수열의 합",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 합"
    ],
    "wide": false,
    "content": "$1+\\dfrac1{1+2}+\\dfrac1{1+2+3}+\\cdots+\\dfrac1{1+2+3+\\cdots+50}$의 값으로 알맞은 것은? [4.3점]",
    "choices": [
      "$\\dfrac{100}{51}$",
      "$\\dfrac{101}{51}$",
      "$\\dfrac{102}{51}$",
      "$\\dfrac{103}{51}$",
      "$\\dfrac{104}{51}$"
    ],
    "answer": "①",
    "solution": "[키포인트] $1+2+\\cdots+n=\\dfrac{n(n+1)}2$를 이용한 뒤 각 항을 두 분수의 차로 바꾼다.\n조건 정리: 첫 항 $1$은 $n=1$인 경우까지 포함한 합으로 볼 수 있다.\n풀이 방향: $\\dfrac{2}{n(n+1)}=2\\left(\\dfrac1n-\\dfrac1{n+1}\\right)$로 변형하여 중간 항을 소거한다.\n정석 풀이: 주어진 합은 $\\displaystyle\\sum_{n=1}^{50}\\dfrac{2}{n(n+1)}$이다. 따라서 $2\\sum_{n=1}^{50}\\left(\\dfrac1n-\\dfrac1{n+1}\\right)=2\\left(1-\\dfrac1{51}\\right)=\\dfrac{100}{51}$이다. 중간의 $-\\dfrac12,+\\dfrac12$부터 $-\\dfrac1{50},+\\dfrac1{50}$까지 모두 소거된다.\n따라서 정답은 ①이다."
  },
  {
    "id": 9,
    "level": "중",
    "category": "등차수열과 등비수열",
    "originalCategory": "등차수열과 등비수열",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-06",
    "standardUnit": "등차수열과 등비수열",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "등차수열과 등비수열"
    ],
    "wide": false,
    "content": "다음은 연이율이 4%이고, 1년마다 복리로 매년 초에 100만 원씩 10년 동안 적립할 때, 10년째 말의 적립금의 원리합계를 구한 것은?<br>(단, $1.04^{10}=1.48$로 계산한다.) [4.6점]",
    "choices": [
      "1224만원",
      "1236만원",
      "1248만원",
      "1260만원",
      "1272만원"
    ],
    "answer": "③",
    "solution": "[키포인트] 매년 초에 넣은 돈은 마지막 해 말까지 남아 있는 기간만큼 복리로 증가한다.\n조건 정리: 첫 적립금은 $10$년, 마지막 적립금은 $1$년 동안 이자가 붙는다.\n풀이 방향: 각 적립금의 원리합계를 등비수열로 나타내어 합을 구한다.\n정석 풀이: 원리합계는 $100(1.04^{10}+1.04^9+\\cdots+1.04)$만 원이다. 순서를 바꾸면 $100(1.04+1.04^2+\\cdots+1.04^{10})$이고, 등비수열의 합을 이용하면 $100\\cdot\\dfrac{1.04(1.04^{10}-1)}{1.04-1}$이다. $1.04^{10}=1.48$을 대입하면 $100\\cdot\\dfrac{1.04\\cdot0.48}{0.04}=1248$만 원이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 10,
    "level": "중",
    "category": "사인법칙과 코사인법칙",
    "originalCategory": "사인법칙과 코사인법칙",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-05",
    "standardUnit": "사인법칙과 코사인법칙",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "사인법칙과 코사인법칙"
    ],
    "wide": false,
    "content": "삼각형 ABC에서 $a=3$, $b=4$, $\\sin(A+B)=\\dfrac14$일 때, 삼각형 ABC의 넓이는? [4.6점]",
    "choices": [
      "$\\dfrac12$",
      "1",
      "$\\dfrac32$",
      "2",
      "$\\dfrac52$"
    ],
    "answer": "③",
    "solution": "[키포인트] 삼각형에서 $A+B=\\pi-C$이므로 $\\sin(A+B)=\\sin C$이다.\n조건 정리: $a=3$, $b=4$, $\\sin(A+B)=\\dfrac14$이다.\n풀이 방향: 두 변과 끼인각을 이용하는 넓이 공식 $\\dfrac12ab\\sin C$를 사용한다.\n정석 풀이: $A+B=\\pi-C$이므로 $\\sin C=\\sin(\\pi-C)=\\sin(A+B)=\\dfrac14$이다. 따라서 삼각형의 넓이는 $\\dfrac12\\cdot3\\cdot4\\cdot\\dfrac14=\\dfrac32$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 11,
    "level": "중",
    "category": "수열의 합",
    "originalCategory": "수열의 합",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-07",
    "standardUnit": "수열의 합",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 합"
    ],
    "wide": false,
    "content": "수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합 $S_n$이 $S_n=4n^2-31n+1$일 때, 다음 보기 중 옳은 것만을 있는 대로 고른 것은? [5점]<br><div class=\"note-box\">ㄱ. 수열 $\\{a_n\\}$은 등차수열이다. $(n=1,2,3,\\cdots)$<br>ㄴ. $S_n$이 최소가 되는 자연수 $n$의 값은 $4$이다.<br>ㄷ. $a_1+a_5=-22$이다.</div>",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "[키포인트] 부분합 식에서 첫째항은 따로 구하고, $n\\ge2$인 항은 $S_n-S_{n-1}$로 구해야 한다.\n조건 정리: $S_n=4n^2-31n+1$이다.\n풀이 방향: ㄱ, ㄴ, ㄷ을 각각 독립적으로 확인한다.\n정석 풀이: $a_1=S_1=-26$이다. $n\\ge2$에서 $a_n=S_n-S_{n-1}=8n-35$이므로 $a_2=-19$, $a_3=-11$이다. $a_2-a_1=7$, $a_3-a_2=8$이므로 등차수열이 아니어서 ㄱ은 거짓이다. $S_n=4\\left(n-\\dfrac{31}{8}\\right)^2-\\dfrac{945}{16}$이고 $\\dfrac{31}{8}$에 가장 가까운 자연수는 $4$이므로 ㄴ은 참이다. $a_5=8\\cdot5-35=5$이므로 $a_1+a_5=-21$이어서 ㄷ은 거짓이다. 따라서 ㄴ만 옳다.\n따라서 정답은 ②이다."
  },
  {
    "id": 12,
    "level": "상",
    "category": "수학적 귀납법",
    "originalCategory": "수학적 귀납법",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-08",
    "standardUnit": "수학적 귀납법",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수학적 귀납법"
    ],
    "wide": false,
    "content": "다음은 $2$ 이상인 모든 자연수 $n$에 대하여 부등식<br>$\\displaystyle\\sum_{k=1}^{n-1}\\dfrac{n}{n-k}\\cdot\\dfrac1{2^{k-1}}<4\\quad\\cdots(*)$<br>이 성립함을 증명하는 과정의 일부이다. [5점]<br><div class=\"note-box\"><b>[증명]</b><br>$2$ 이상인 모든 자연수 $n$에 대하여<br>$a_n=\\displaystyle\\sum_{k=1}^{n-1}\\dfrac{n}{n-k}\\cdot\\dfrac1{2^{k-1}}$라 하자.<br>$a_{n+1}=\\displaystyle\\sum_{k=1}^{n}\\dfrac{n+1}{n+1-k}\\cdot\\dfrac1{2^{k-1}}$<br>$=<span style=\"display:inline-block;min-width:34px;padding:0 6px;border:1px solid #444;text-align:center;\">(가)</span>+\\dfrac{n+1}{n-1}\\cdot\\dfrac12+\\dfrac{n+1}{n-2}\\cdot\\dfrac1{2^2}+\\cdots+\\dfrac{n+1}{2^{n-1}}$<br>이 식을 정리하면<br>$a_{n+1}=<span style=\"display:inline-block;min-width:34px;padding:0 6px;border:1px solid #444;text-align:center;\">(나)</span>a_n+\\dfrac{n+1}{n}\\quad(n\\ge2)$를 얻는다.<br>$a_2=2<4$, $a_3=3<4$이므로 귀납적으로 $(*)$이 성립한다.</div><br>(가)의 값과 (나)의 값의 비를 구한 것으로 알맞은 것은?",
    "choices": [
      "4",
      "2",
      "1",
      "$\\dfrac12$",
      "$\\dfrac14$"
    ],
    "answer": "②",
    "solution": "[키포인트] $a_{n+1}$의 첫 항을 분리하고, 나머지 합을 $a_n$의 일정한 배로 바꾼다.\n조건 정리: $a_n=\\displaystyle\\sum_{k=1}^{n-1}\\dfrac{n}{n-k}\\dfrac1{2^{k-1}}$이다.\n풀이 방향: $a_{n+1}$에서 $k=1$인 항을 먼저 떼고, $k=2$부터의 항에 공통인수를 묶는다.\n정석 풀이: $a_{n+1}$의 $k=1$인 항은 $\\dfrac{n+1}{n}$이므로 (가)는 $\\dfrac{n+1}{n}$이다. 나머지 합에서 지수를 하나씩 맞추면\n$\\displaystyle\\sum_{j=1}^{n-1}\\dfrac{n+1}{n-j}\\dfrac1{2^j}=\\dfrac{n+1}{2n}\\sum_{j=1}^{n-1}\\dfrac{n}{n-j}\\dfrac1{2^{j-1}}=\\dfrac{n+1}{2n}a_n$이다. 따라서 (나)는 $\\dfrac{n+1}{2n}$이다. 또한 $n\\ge3$이고 $a_n<4$라 하면\n$a_{n+1}=\\dfrac{n+1}{2n}a_n+\\dfrac{n+1}{n}$\n$<\\dfrac{2(n+1)}n+\\dfrac{n+1}n=\\dfrac{3(n+1)}n\\le4$\n이므로, $a_3<4$에서 귀납적으로 부등식이 성립한다. 그러므로 두 값의 비는 $\\dfrac{(n+1)/n}{(n+1)/(2n)}=2$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 13,
    "level": "중",
    "category": "사인법칙과 코사인법칙",
    "originalCategory": "사인법칙과 코사인법칙",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-05",
    "standardUnit": "사인법칙과 코사인법칙",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "사인법칙과 코사인법칙",
      "도형"
    ],
    "wide": false,
    "content": "$\\angle A=\\dfrac\\pi3$이고 $\\overline{AB}:\\overline{AC}=3:1$인 삼각형 ABC가 있다. 삼각형 ABC의 외접원의 반지름의 길이가 7일 때, 선분 AC의 길이는? [5.3점]",
    "choices": [
      "$2\\sqrt5$",
      "$\\sqrt{21}$",
      "$\\sqrt{22}$",
      "$\\sqrt{23}$",
      "$2\\sqrt6$"
    ],
    "answer": "②",
    "solution": "[키포인트] 두 변의 비를 문자로 두고 코사인법칙으로 세 번째 변을 구한 뒤 사인법칙을 적용한다.\n조건 정리: $AB:AC=3:1$, $\\angle A=60^\\circ$, 외접반지름은 $7$이다.\n풀이 방향: $AC=x$, $AB=3x$로 두어 $BC$를 $x$로 나타낸다.\n정석 풀이: 코사인법칙으로 $BC^2=(3x)^2+x^2-2\\cdot3x\\cdot x\\cdot\\cos60^\\circ=9x^2+x^2-3x^2=7x^2$이므로 $BC=\\sqrt7x$이다. 확장된 사인법칙에서 $\\dfrac{BC}{\\sin60^\\circ}=2R=14$이므로 $\\dfrac{\\sqrt7x}{\\sqrt3/2}=14$이다. 따라서 $x=\\sqrt{21}$이고 $AC=\\sqrt{21}$이다.\n따라서 정답은 ②이다.",
    "hasVisualAsset": true,
    "visualAssetType": "source_page_diagram",
    "visualAssetStatus": "cropped_for_manual_cleanup",
    "image": "assets/images/26_팔마고_1학기_기말_고2_대수/q13.png"
  },
  {
    "id": 14,
    "level": "상",
    "category": "등차수열과 등비수열",
    "originalCategory": "등차수열과 등비수열",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-06",
    "standardUnit": "등차수열과 등비수열",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "등차수열과 등비수열"
    ],
    "wide": false,
    "content": "두 수열 $\\{a_n\\}$, $\\{b_n\\}$은 $a_1=1$, $b_1=1$이고 모든 자연수 $n$에 대하여<br>$a_{n+1}=a_n+b_n,\\quad b_{n+1}=\\sin\\dfrac{a_n}{2}\\pi$<br>를 만족시킨다. $a_{2026}+b_{2026}$의 값은? [5.3점]",
    "choices": [
      "$-4$",
      "$-2$",
      "0",
      "2",
      "4"
    ],
    "answer": "④",
    "solution": "[키포인트] 점화식에 따라 처음 몇 쌍 $(a_n,b_n)$을 직접 구하면 반복되는 주기를 찾을 수 있다.\n조건 정리: $(a_1,b_1)=(1,1)$이고 $a_{n+1}=a_n+b_n$, $b_{n+1}=\\sin\\dfrac{a_n\\pi}{2}$이다.\n풀이 방향: 항을 차례로 계산하여 처음 상태로 돌아오는 시점을 찾는다.\n정석 풀이: $(a_2,b_2)=(2,1)$, $(a_3,b_3)=(3,0)$, $(a_4,b_4)=(3,-1)$, $(a_5,b_5)=(2,-1)$, $(a_6,b_6)=(1,0)$, $(a_7,b_7)=(1,1)$이다. 따라서 주기는 $6$이다. $2026=6\\cdot337+4$이므로 $(a_{2026},b_{2026})=(a_4,b_4)=(3,-1)$이다. 따라서 $a_{2026}+b_{2026}=2$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 15,
    "level": "중",
    "category": "수열의 합",
    "originalCategory": "수열의 합",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-07",
    "standardUnit": "수열의 합",
    "standardUnitOrder": 7,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "단답형",
      "수열의 합"
    ],
    "wide": false,
    "content": "1000의 모든 양의 약수를 작은 수부터 크기순으로 나열할 때, $k$번째 수를 $a_k$라 하자. 1000의 모든 양의 약수의 개수는 $p$이고 $\\displaystyle\\sum_{k=1}^{p}a_k=q$일 때, $p+q$의 값을 구하시오. [5점]",
    "choices": [],
    "answer": "$2356$",
    "solution": "[키포인트] 소인수분해를 이용하면 약수의 개수와 모든 약수의 합을 각각 곱셈식으로 구할 수 있다.\n조건 정리: $1000=2^3\\cdot5^3$이다.\n풀이 방향: 약수의 개수 공식과 약수의 합 공식을 따로 적용한 뒤 두 값을 더한다.\n정석 풀이: 양의 약수의 개수는 $(3+1)(3+1)=16$이므로 $p=16$이다. 모든 양의 약수의 합은 $(1+2+2^2+2^3)(1+5+5^2+5^3)=15\\cdot156=2340$이므로 $q=2340$이다. 따라서 $p+q=16+2340=2356$이다.\n따라서 구하는 값은 $2356$이다."
  },
  /* 원본(2026-07-14 스캔 대조 완료)은 (가)(나)만으로 S_13이 유일하게 결정되지 않는 출제 오류.
     원본 대비 "첫째항이 1인" 조건을 추가하여 답이 64로 유일해지도록 수정함(2026-07-16). */
  {
    "id": 16,
    "level": "상",
    "category": "등차수열과 등비수열",
    "originalCategory": "등차수열과 등비수열",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-06",
    "standardUnit": "등차수열과 등비수열",
    "standardUnitOrder": 6,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "단답형",
      "등차수열과 등비수열"
    ],
    "wide": false,
    "content": "첫째항이 $1$인 수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 할 때, 수열 $\\{a_n\\}$이 모든 자연수 $n$에 대하여 다음 조건을 만족시킨다.<br><br>(가) $S_{2n}=0$<br>(나) 수열 $\\{a_na_{n+1}\\}$은 공비가 0이 아닌 등비수열이다.<br><br>$S_9=16$일 때, $S_{13}$의 값을 구하시오. [5점]",
    "choices": [],
    "answer": "$64$",
    "solution": "[키포인트] (가)에서 이웃한 두 항의 합이 0임을 이용해 홀수 번째 항만 남기고, (나)로 홀수 번째 항들이 등비수열을 이룸을 밝힌다.\n조건 정리: (가)에서 $S_2=S_4=S_6=\\cdots=0$이므로 $S_{2n}-S_{2n-2}=a_{2n-1}+a_{2n}=0$, 즉 $a_{2n}=-a_{2n-1}$이다. 따라서 $S_9=S_8+a_9=a_9=16$이고, 같은 이유로 $S_{13}=S_{12}+a_{13}=a_{13}$이다.\n풀이 방향: 수열 $\\{a_na_{n+1}\\}$의 공비를 $r$라 하고, 홀수 번째 항 사이의 관계식을 찾는다.\n정석 풀이: $a_{2k-1}a_{2k}=-a_{2k-1}^2$이고 $a_{2k}a_{2k+1}=-a_{2k-1}a_{2k+1}$이므로 이웃한 두 항의 비는 $\\dfrac{a_{2k}a_{2k+1}}{a_{2k-1}a_{2k}}=\\dfrac{a_{2k+1}}{a_{2k-1}}=r$이다. 즉 홀수 번째 항들은 공비가 $r$인 등비수열이므로 $a_{2k+1}=ra_{2k-1}$이다. $a_1=1$이므로 $a_9=r^4=16$, 즉 $r^2=4$이다. 따라서 $a_{13}=r^6=(r^2)^3=4^3=64$이므로 $S_{13}=64$이다.\n따라서 구하는 값은 $64$이다."
  },
  {
    "id": 17,
    "level": "상",
    "category": "사인법칙과 코사인법칙",
    "originalCategory": "사인법칙과 코사인법칙",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-05",
    "standardUnit": "사인법칙과 코사인법칙",
    "standardUnitOrder": 5,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "단답형",
      "사인법칙과 코사인법칙",
      "도형"
    ],
    "wide": false,
    "content": "그림과 같이 길이가 4인 선분 AB를 지름으로 하는 반원이 있다. 선분 AB의 중점을 O라 하고, 호 AB 위의 점 C에 대하여 점 A를 지나고 선분 OC와 평행한 직선과 호 AB의 교점을 P, 선분 OC와 선분 BP의 교점을 Q라 하자.<br>점 Q를 지나고 선분 PO와 평행한 직선과 선분 OB의 교점을 D라 하자. $\\angle CAB=\\dfrac\\pi6$라 할 때, 삼각형 QDB의 넓이를 $S$, 삼각형 PQC의 넓이를 $T$라 하자. $S$와 $T$의 합을 구하시오. [5점]",
    "choices": [],
    "answer": "$\\dfrac{3\\sqrt3}{4}$",
    "solution": "[키포인트] 반원의 중심을 원점으로 두고 주요 점의 좌표를 구하면 평행 조건과 넓이 계산이 간단해진다.\n조건 정리: 반지름은 $2$이고 $\\angle CAB=30^\\circ$이다.\n풀이 방향: $A=(-2,0)$, $B=(2,0)$으로 두고 직선의 교점을 순서대로 구한다.\n정석 풀이: 원을 $x^2+y^2=4$로 두면 $A$에서 $30^\\circ$ 방향으로 그은 직선과 원의 교점은 $C=(1,\\sqrt3)$이다. $OC$와 평행하고 $A$를 지나는 직선의 다른 원 위 교점은 $P=(-1,\\sqrt3)$이다. 직선 $BP$와 $OC$의 교점은 $Q=\\left(\\dfrac12,\\dfrac{\\sqrt3}{2}\\right)$이다. $Q$를 지나고 $PO$와 평행한 직선이 $OB$와 만나는 점은 $D=(1,0)$이다. 따라서 $\\triangle QDB$의 넓이는 $\\dfrac12\\cdot1\\cdot\\dfrac{\\sqrt3}{2}=\\dfrac{\\sqrt3}{4}$이다. 한편 $PC$는 수평선 위에 있고 길이가 $2$이며, 점 $Q$의 $y$좌표는 $\\dfrac{\\sqrt3}{2}$, 직선 $PC$의 $y$좌표는 $\\sqrt3$이므로 높이는 $\\dfrac{\\sqrt3}{2}$이다. 따라서 $T=[\\triangle PQC]=\\dfrac12\\cdot2\\cdot\\dfrac{\\sqrt3}{2}=\\dfrac{\\sqrt3}{2}$이다. 그러므로 $S+T=\\dfrac{3\\sqrt3}{4}$이다.\n따라서 구하는 값은 $\\dfrac{3\\sqrt3}{4}$이다.",
    "hasVisualAsset": true,
    "visualAssetType": "clean_vector_diagram",
    "visualAssetStatus": "clean",
    "image": "assets/images/26_팔마고_1학기_기말_고2_대수/q17.svg"
  },
  {
    "id": 18,
    "level": "상",
    "category": "등차수열과 등비수열",
    "originalCategory": "등차수열과 등비수열",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-06",
    "standardUnit": "등차수열과 등비수열",
    "standardUnitOrder": 6,
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": [
      "단답형",
      "등차수열과 등비수열"
    ],
    "wide": false,
    "content": "공차가 자연수인 등차수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 하자. 어떤 자연수 $k$에 대하여<br>$a_k+a_{k+1}+a_{k+2}=21, S_{k+4}=11$<br>이 성립할 때, $a_{k+5}$의 값을 구하시오. [5점]",
    "choices": [],
    "answer": "$19$",
    "solution": "[키포인트] 연속한 세 항의 합은 가운데 항의 세 배이고, 부분합 조건은 첫째항과 공차로 나타낸다.\n조건 정리: 공차 $d$는 자연수이고 $a_k+a_{k+1}+a_{k+2}=21$, $S_{k+4}=11$이다.\n풀이 방향: 먼저 $a_{k+1}$을 구한 뒤 부분합 식에서 자연수 $k,d$를 결정한다.\n정석 풀이: 연속한 세 항의 합은 $3a_{k+1}$이므로 $a_{k+1}=7$이다. 따라서 $a_1=7-kd$이다. $S_{k+4}=\\dfrac{k+4}{2}\\{2a_1+(k+3)d\\}=11$에 대입하면 $(k+4)\\{14+(3-k)d\\}=22$이다. $k+4\\ge5$이고 두 인수는 양의 정수이므로 $k+4$는 $22$의 양의 약수 중 $11$ 또는 $22$이다. $k+4=22$이면 $k=18$이고 $14-15d=1$에서 $d=\\dfrac{13}{15}$가 되어 자연수가 아니므로 제외한다. 따라서 $k+4=11$, $14+(3-k)d=2$이고, $k=7$, $d=3$이다. $a_{k+5}$는 $a_{k+1}$보다 네 항 뒤이므로 $a_{k+5}=7+4d=19$이다.\n따라서 구하는 값은 $19$이다."
  },
  {
    "id": 19,
    "level": "상",
    "category": "수학적 귀납법",
    "originalCategory": "수학적 귀납법",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-08",
    "standardUnit": "수학적 귀납법",
    "standardUnitOrder": 8,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "수학적 귀납법"
    ],
    "wide": false,
    "content": "$n\\ge2$인 모든 자연수 $n$에 대하여 다음 부등식이 성립함을 수학적 귀납법으로 증명하시오.<br>$1+\\dfrac12+\\dfrac13+\\dfrac14+\\cdots+\\dfrac1n>\\dfrac{2n}{n+1}$<br>[6점, 부분점수 있음]",
    "choices": [],
    "answer": "증명",
    "solution": "[키포인트] 수학적 귀납법에서는 첫 단계의 성립을 확인하고, $n=k$에서의 성립을 가정하여 $n=k+1$에서도 성립함을 보인다.\n조건 정리: 명제는 $H_n=1+\\dfrac12+\\cdots+\\dfrac1n>\\dfrac{2n}{n+1}$이다.\n풀이 방향: $n=2$를 확인한 뒤 귀납 가정에 $\\dfrac1{k+1}$을 더하고 목표식과 비교한다.\n정석 풀이: $n=2$일 때 $H_2=\\dfrac32>\\dfrac43$이므로 성립한다. 이제 $n=k$에서 $H_k>\\dfrac{2k}{k+1}$이라고 가정한다. 그러면 $H_{k+1}=H_k+\\dfrac1{k+1}>\\dfrac{2k+1}{k+1}$이다. 한편 $\\dfrac{2k+1}{k+1}-\\dfrac{2(k+1)}{k+2}=\\dfrac{k}{(k+1)(k+2)}>0$이므로 $H_{k+1}>\\dfrac{2(k+1)}{k+2}$이다. 따라서 $n=k+1$에서도 명제가 성립한다.\n따라서 수학적 귀납법에 의하여 주어진 부등식은 $n\\ge2$인 모든 자연수 $n$에 대하여 성립한다."
  },
  {
    "id": 20,
    "level": "상",
    "category": "수열의 합",
    "originalCategory": "수열의 합",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-07",
    "standardUnit": "수열의 합",
    "standardUnitOrder": 7,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "수열의 합",
      "도형"
    ],
    "wide": false,
    "content": "그림과 같이 직각을 낀 두 변의 길이가 1인 직각이등변삼각형이 있다. 이 직각이등변삼각형의 빗변에 2개의 꼭짓점이 있고, 직각을 낀 두 변에 나머지 2개의 꼭짓점이 있는 정사각형에 색칠하여 얻은 그림을 $R_1$이라 하자.<br>그림 $R_1$에서 합동인 2개의 직각이등변삼각형의 각각 빗변에 2개의 꼭짓점이 있고, 직각을 낀 두 변에 나머지 2개의 꼭짓점이 있는 2개의 정사각형에 색칠하여 얻은 그림을 $R_2$라고 하자.<br>그림 $R_2$에서 합동인 4개의 직각이등변삼각형의 각각 빗변에 2개의 꼭짓점이 있고, 직각을 낀 두 변에 나머지 2개의 꼭짓점이 있는 4개의 정사각형에 색칠하여 얻은 그림을 $R_3$라고 하자.<br>이와 같은 과정을 계속하여 $n$번째 얻은 그림 $R_n$에 색칠되어 있는 모든 정사각형의 넓이의 합을 $S_n$이라 할 때, $S_7$의 값이 $\\dfrac qp\\left(1-\\left(\\dfrac mn\\right)^{14}\\right)$이라고 한다. $p+q+m+n$의 값을 구하는 풀이과정과 답을 서술하시오.<br>(단, $p,q$는 서로소, $m,n$은 서로소)<br>[7점, 부분점수 있음]",
    "choices": [],
    "answer": "$12$",
    "solution": "[키포인트] 각 단계에서 새로 생기는 두 직각이등변삼각형은 이전 삼각형과 닮음이고, 새로 칠하는 정사각형 넓이의 총합은 일정한 비로 줄어든다.\n조건 정리: 처음 직각이등변삼각형의 두 직각변 길이는 $1$이다.\n풀이 방향: 첫 정사각형의 넓이와 단계별 총넓이의 공비를 구한 뒤 7항의 등비수열의 합을 계산한다.\n정석 풀이: 직각이등변삼각형을 $x\\ge0$, $y\\ge0$, $x+y\\le1$인 영역으로 두자. 정사각형의 한 변의 길이를 $s$라 하면 빗변 위의 한 변은 방향벡터 $(1,-1)$과 평행하고, 다른 두 꼭짓점은 빗변에서 안쪽으로 거리 $s$만큼 이동한 점이다. 왼쪽 꼭짓점이 $y$축, 아래 꼭짓점이 $x$축에 놓인다는 조건을 좌표로 쓰면 빗변의 길이 $\\sqrt2$가 $s+s+s=3s$로 나뉜다. 따라서 $s=\\dfrac{\\sqrt2}{3}$이고 첫 정사각형의 넓이는 $s^2=\\dfrac29$이다. 첫 정사각형 양쪽에 남는 두 직각이등변삼각형은 원래 삼각형과 닮고, 각각의 닮음비는 $\\dfrac{\\sqrt2}{3}$이다. 따라서 한 작은 삼각형에서 새로 생기는 정사각형의 넓이는 원래 정사각형 넓이의 $\\left(\\dfrac{\\sqrt2}{3}\\right)^2=\\dfrac29$배이다. 작은 삼각형이 두 개씩 생기므로 각 단계에서 새로 칠하는 정사각형 전체 넓이는 직전 단계의 $\\dfrac49$배이다. 그러므로 $S_7=\\dfrac29\\left(1+\\dfrac49+\\cdots+\\left(\\dfrac49\\right)^6\\right)=\\dfrac25\\left(1-\\left(\\dfrac23\\right)^{14}\\right)$이다. 따라서 $p=5$, $q=2$, $m=2$, $n=3$이고 $p+q+m+n=12$이다.\n따라서 구하는 값은 $12$이다.",
    "hasVisualAsset": true,
    "visualAssetType": "clean_vector_diagram",
    "visualAssetStatus": "clean",
    "image": "assets/images/26_팔마고_1학기_기말_고2_대수/q20.svg"
  },
  {
    "id": 21,
    "level": "상",
    "category": "사인법칙과 코사인법칙",
    "originalCategory": "사인법칙과 코사인법칙",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-05",
    "standardUnit": "사인법칙과 코사인법칙",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "사인법칙과 코사인법칙",
      "도형"
    ],
    "wide": false,
    "content": "그림과 같이 $\\overline{AB}=2$, $\\cos(\\angle BAC)=\\dfrac{\\sqrt3}{6}$인 삼각형 ABC가 있다. 선분 AC 위의 한 점 D에 대하여 직선 BD가 삼각형 ABC의 외접원과 만나는 점 중 B가 아닌 점을 E라 하자. $\\overline{DE}=5$, $\\overline{CD}+\\overline{CE}=5\\sqrt3$일 때, 삼각형 ABC의 외접원의 넓이를 구하는 풀이과정과 답을 서술하시오.<br>[7점, 부분점수 있음]",
    "choices": [],
    "answer": "$\\dfrac{180\\pi}{11}$",
    "solution": "[키포인트] 원주각으로 같은 각을 찾고, 두 삼각형의 닮음으로 변의 길이를 연결한 뒤 외접반지름을 구한다.\n조건 정리: $AB=2$, $\\cos A=\\dfrac{\\sqrt3}{6}$, $DE=5$, $CD+CE=5\\sqrt3$이다.\n풀이 방향: 먼저 $CD$와 $CE$를 구하고, 닮음으로 $AD$를 구하여 $AC$와 $BC$를 차례로 계산한다.\n정석 풀이: $CD=x$, $CE=y$라 두면 $x+y=5\\sqrt3$이다. $B,D,E$가 한 직선 위에 있고 $A,B,C,E$가 한 원 위에 있으므로 $\\angle CED=\\angle CEB=\\angle CAB=A$이다. 삼각형 $CDE$에서 코사인법칙을 적용하면 $x^2=y^2+25-10y\\cdot\\dfrac{\\sqrt3}{6}$이다. 이 식과 $x+y=5\\sqrt3$을 풀면 $x=3\\sqrt3$, $y=2\\sqrt3$이다. 또 $\\angle CED=\\angle BAD$, $\\angle CDE=\\angle BDA$이므로 $\\triangle CDE\\sim\\triangle BDA$이다. 닮음비는 $CE:BA=2\\sqrt3:2=\\sqrt3:1$이므로 $DE:DA=\\sqrt3:1$, 따라서 $DA=\\dfrac5{\\sqrt3}$이다. 그러므로 $AC=CD+DA=3\\sqrt3+\\dfrac5{\\sqrt3}=\\dfrac{14}{\\sqrt3}$이다. 삼각형 $ABC$에서 코사인법칙을 쓰면 $BC^2=2^2+\\left(\\dfrac{14}{\\sqrt3}\\right)^2-2\\cdot2\\cdot\\dfrac{14}{\\sqrt3}\\cdot\\dfrac{\\sqrt3}{6}=60$이다. 또한 $\\sin A=\\dfrac{\\sqrt{33}}6$이므로 $R=\\dfrac{BC}{2\\sin A}=\\dfrac{6\\sqrt{55}}{11}$이다. 따라서 외접원의 넓이는 $\\pi R^2=\\dfrac{180\\pi}{11}$이다.\n따라서 구하는 값은 $\\dfrac{180\\pi}{11}$이다.",
    "hasVisualAsset": true,
    "visualAssetType": "clean_vector_diagram",
    "visualAssetStatus": "clean",
    "image": "assets/images/26_팔마고_1학기_기말_고2_대수/q21.svg"
  }
];
