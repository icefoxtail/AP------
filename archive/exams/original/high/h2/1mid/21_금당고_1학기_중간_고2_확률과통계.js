window.examTitle = "21_금당고_1학기_중간_고2_확률과통계";

window.questionBank = [
  {
    "id": 1,
    "questionType": "객관식",
    "content": "부모와 3명의 자녀로 구성된 5명이 원탁에 둘러앉으려 한다. 부모가 이웃하도록 앉는 모든 경우의 수를 구하시오. (단, 회전하여 일치하는 것은 같은 것으로 본다.) [3점]",
    "choices": [
      "8",
      "10",
      "12",
      "14",
      "16"
    ],
    "answer": "③",
    "solution": "부모가 반드시 이웃하므로 부모 두 사람을 하나의 묶음으로 생각한다. 그러면 (부모 묶음)과 자녀 3명, 총 4개의 대상을 원탁에 배치한다.\n원탁에서는 전체를 함께 돌린 배치를 같은 것으로 보므로 4개 대상의 원순열 수는 $(4-1)!=3!=6$이다.\n각 원순열마다 부모 묶음 내부의 순서는 (부, 모), (모, 부) 두 가지다.\n따라서 $6\\times2=12$가지이므로 정답은 ③이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합",
    "standardUnitKey": "H15-PS-01",
    "subUnitKey": "H15-PS-01-PERMUTATION",
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_CIRCULAR_PERMUTATION",
    "rpmPrimaryPathId": "H2-PS-RPM-002",
    "sourceMode": "ORIGINAL",
    "curriculum": "2015"
  },
  {
    "id": 2,
    "questionType": "객관식",
    "content": "$1, 2, 3, 4$의 4개의 숫자로 중복을 허용하여 만들 수 있는 세 자리 정수의 개수를 구하시오. [3점]",
    "choices": [
      "6",
      "15",
      "24",
      "64",
      "81"
    ],
    "answer": "④",
    "solution": "백의 자리, 십의 자리, 일의 자리 각각에 $1,2,3,4$ 중 하나를 고를 수 있다.\n숫자를 중복 사용해도 되므로 한 자리를 고른 결과가 다음 자리의 선택지를 줄이지 않는다.\n따라서 곱의 법칙에 의해 $4\\times4\\times4=4^3=64$개다. 정답은 ④이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합"
  },
  {
    "id": 3,
    "questionType": "객관식",
    "content": "5개의 문자 $h, a, p, p, y$를 일렬로 나열하는 모든 경우의 수를 구하시오. [3.2점]",
    "choices": [
      "20",
      "30",
      "40",
      "50",
      "60"
    ],
    "answer": "⑤",
    "solution": "5개 문자가 모두 다르면 $5!=120$가지로 나열할 수 있다.\n하지만 두 문자 $p$는 서로 같으므로 두 $p$를 맞바꾼 나열은 새로운 경우가 아니다. 각 실제 나열이 $2!$번 중복된다.\n따라서 $\\dfrac{5!}{2!}=\\dfrac{120}{2}=60$가지이므로 정답은 ⑤이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합",
    "standardUnitKey": "H15-PS-01",
    "subUnitKey": "H15-PS-01-PERMUTATION",
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_IDENTICAL_OBJECT_PERMUTATION",
    "rpmPrimaryPathId": "H2-PS-RPM-002",
    "sourceMode": "ORIGINAL",
    "curriculum": "2015"
  },
  {
    "id": 4,
    "questionType": "객관식",
    "content": "${}_2\\mathrm{H}_{10} + {}_2\\Pi_2$를 계산하시오. [3.2점]",
    "choices": [
      "15",
      "20",
      "25",
      "30",
      "35"
    ],
    "answer": "①",
    "solution": "중복조합은 ${}_n\\mathrm{H}_r={}_{n+r-1}\\mathrm{C}_r$이므로 ${}_2\\mathrm{H}_{10}={}_{11}\\mathrm{C}_{10}=11$이다.\n중복순열은 ${}_n\\Pi_r=n^r$이므로 ${}_2\\Pi_2=2^2=4$이다.\n따라서 $11+4=15$이므로 정답은 ①이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합"
  },
  {
    "id": 5,
    "questionType": "객관식",
    "content": "$(x+2)^5$의 전개식에서 $x^4$의 계수를 구하시오. [3.4점]",
    "choices": [
      "1",
      "10",
      "40",
      "80",
      "32"
    ],
    "answer": "②",
    "solution": "이항정리에 의해 $(x+2)^5=\\sum_{k=0}^5{}_5\\mathrm C_k x^{5-k}2^k$이다.\n$x^4$가 되려면 $5-k=4$, 즉 $k=1$이어야 한다.\n따라서 $x^4$의 계수는 ${}_5\\mathrm C_1\\cdot2^1=5\\cdot2=10$이다. 정답은 ②이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "이항정리",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "이항정리",
    "originalCategory": "이항정리",
    "standardUnitKey": "H15-PS-02",
    "subUnitKey": "H15-PS-02-BINOMIAL_BASIC",
    "problemTypeKey": "PT_BINOMIAL_THEOREM",
    "templateKey": "TPL_BINOMIAL_TERM_COEFFICIENT",
    "rpmPrimaryPathId": "H2-PS-RPM-008",
    "sourceMode": "ORIGINAL",
    "curriculum": "2015"
  },
  {
    "id": 6,
    "questionType": "객관식",
    "content": "두 집합 $X=\\{1, 2, 3, 4\\}$, $Y=\\{1, 2, 3, 4\\}$에 대하여, $X$에서 $Y$로의 함수의 개수를 $m$, $X$에서 $Y$로의 일대일대응의 개수를 $n$이라 하자. $m+n$의 값을 구하시오. [3.4점]",
    "choices": [
      "24",
      "59",
      "256",
      "280",
      "291"
    ],
    "answer": "④",
    "solution": "함수에서는 $X$의 네 원소 각각이 $Y$의 네 원소 중 하나에 대응하므로 $m=4^4=256$이다.\n일대일대응은 $Y$의 네 원소를 중복 없이 모두 대응시키는 순열이다. 첫 원소부터 가능한 선택 수가 $4,3,2,1$로 줄어 $n=4!=24$다.\n따라서 $m+n=256+24=280$이므로 정답은 ④이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합"
  },
  {
    "id": 7,
    "questionType": "객관식",
    "content": "방정식 $x+y+z=6$에 대하여, 음이 아닌 정수해의 개수를 $m$, 양의 정수해의 개수를 $n$이라 하자. $mn$의 값을 구하시오. [3.6점]",
    "choices": [
      "110",
      "140",
      "180",
      "280",
      "300"
    ],
    "answer": "④",
    "solution": "먼저 음이 아닌 정수해와 양의 정수해의 차이를 구별한다.\n① **음이 아닌 정수해**는 $x,y,z\\ge0$이고 $x+y+z=6$인 경우다. 같은 물건 6개를 세 변수에 나누는 것으로 생각하면, 별표 6개 사이와 양 끝에 구분선 2개를 배치하는 경우의 수와 같다.\n별표 6개와 구분선 2개, 총 8자리 중 구분선 자리를 고르므로\n$m={}_8\\mathrm C_2=\\dfrac{8\\cdot7}{2}=28$이다.\n② **양의 정수해**에서는 세 변수에 최소 1씩 먼저 배정해야 한다. $x'=x-1$, $y'=y-1$, $z'=z-1$로 놓으면\n$x',y',z'\\ge0$, $x'+y'+z'=6-3=3$이다.\n이제 별표 3개와 구분선 2개를 배열하므로\n$n={}_5\\mathrm C_2=\\dfrac{5\\cdot4}{2}=10$이다.\n각 양의 정수해와 치환 후 음이 아닌 정수해는 일대일로 대응하므로 빠뜨리거나 중복해 세지 않았다.\n따라서 $mn=28\\times10=280$이고 정답은 ④이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합",
    "standardUnitKey": "H15-PS-01",
    "subUnitKey": "H15-PS-01-COMBINATION",
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "rpmPrimaryPathId": "H2-PS-RPM-006",
    "sourceMode": "ORIGINAL",
    "curriculum": "2015"
  },
  {
    "id": 8,
    "questionType": "객관식",
    "content": "다음 표는 순천금당고등학교의 수학 동아리 부원의 명렬표이다.<br><table border=\"1\" style=\"margin:10px auto; border-collapse:collapse; text-align:center;\"><tr><th style=\"padding:4px 12px;\"></th><th style=\"padding:4px 12px;\">1반</th><th style=\"padding:4px 12px;\">2반</th><th style=\"padding:4px 12px;\">3반</th></tr><tr><td rowspan=\"3\" style=\"padding:4px 12px;\">번호</td><td style=\"padding:4px 12px;\">1번</td><td style=\"padding:4px 12px;\">4번</td><td style=\"padding:4px 12px;\">7번</td></tr><tr><td style=\"padding:4px 12px;\">2번</td><td style=\"padding:4px 12px;\">5번</td><td style=\"padding:4px 12px;\">8번</td></tr><tr><td style=\"padding:4px 12px;\">3번</td><td style=\"padding:4px 12px;\">6번</td><td style=\"padding:4px 12px;\">9번</td></tr></table><br>9명의 학생을 일렬로 줄 세우려 할 때, 1반은 번호가 작은 순부터, 2반은 번호가 큰 순부터, 3반은 번호가 작은 순부터 줄을 서야 한다. 9명을 줄 세우는 방법의 수를 구하시오. [3.6점]",
    "choices": [
      "1670",
      "1680",
      "1690",
      "1700",
      "1710"
    ],
    "answer": "②",
    "solution": "세 반의 각 3명은 상대적인 순서가 이미 정해져 있다. 즉 1반은 $1,2,3$, 2반은 $6,5,4$, 3반은 $7,8,9$의 순서만 허용한다.\n따라서 9개의 자리 중 1반 학생이 들어갈 3자리를 고르면 ${}_9\\mathrm C_3$가지, 남은 6자리 중 2반 자리를 고르면 ${}_6\\mathrm C_3$가지다. 3반은 남은 3자리에 자동으로 정해진 순서대로 선다.\n${}_9\\mathrm C_3\\cdot{}_6\\mathrm C_3=84\\cdot20=1680$이다.\n같은 계산을 $\\dfrac{9!}{3!3!3!}=1680$으로도 할 수 있다. 정답은 ②이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합"
  },
  {
    "id": 9,
    "questionType": "객관식",
    "content": "똑같은 과자 10개를 $A, B, C$ 세 사람에게 나누어 주려고 한다. $A$에게는 2개 이상, $B$에게는 1개 이상 나누어 주는 방법의 수를 구하시오. [3.8점]",
    "choices": [
      "8",
      "13",
      "36",
      "66",
      "120"
    ],
    "answer": "③",
    "solution": "$A,B,C$가 받는 개수를 $a,b,c$라 두면 $a+b+c=10$, $a\\ge2$, $b\\ge1$, $c\\ge0$이다.\n최소 지급량을 먼저 제외하여 $a'=a-2$, $b'=b-1$로 두면 $a'+b'+c=7$이고 세 변수는 모두 음이 아닌 정수다.\n중복조합으로 ${}_3\\mathrm H_7={}_9\\mathrm C_2=\\dfrac{9\\cdot8}{2}=36$이다. 정답은 ③이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합"
  },
  {
    "id": 10,
    "questionType": "객관식",
    "content": "다음 식의 값을 구하시오.<br>$${}_{11}\\mathrm{C}_2 + {}_{11}\\mathrm{C}_4 + {}_{11}\\mathrm{C}_6 + \\cdots + {}_{11}\\mathrm{C}_{10}$$ [3.8점]",
    "choices": [
      "512",
      "1023",
      "1024",
      "2047",
      "2048"
    ],
    "answer": "②",
    "solution": "짝수 번호의 이항계수만 더하므로 $(1+1)^{11}$과 $(1-1)^{11}$을 함께 이용한다.\n짝수 번호 계수의 합을 $E={}_{11}\\mathrm C_0+{}_{11}\\mathrm C_2+\\cdots+{}_{11}\\mathrm C_{10}$, 홀수 번호 계수의 합을 $O={}_{11}\\mathrm C_1+{}_{11}\\mathrm C_3+\\cdots+{}_{11}\\mathrm C_{11}$이라 하자.\n이항정리에 $x=1$을 넣으면\n$E+O=(1+1)^{11}=2^{11}=2048$이다.\n$x=-1$을 넣으면 짝수 번호 항은 $+$, 홀수 번호 항은 $-$가 되므로\n$E-O=(1-1)^{11}=0$이다.\n두 식을 더하면 $2E=2048$이고, 따라서 $E=1024$이다.\n**주의:** $E$에는 문제에 없는 ${}_{11}\\mathrm C_0=1$까지 들어 있다. 실제 발문은 $k=2,4,6,8,10$만 더하므로\n${}_{11}\\mathrm C_2+{}_{11}\\mathrm C_4+\\cdots+{}_{11}\\mathrm C_{10}=E-{}_{11}\\mathrm C_0=1024-1=1023$이다.\n따라서 정답은 ②이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "이항정리",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "이항정리",
    "originalCategory": "이항정리"
  },
  {
    "id": 11,
    "questionType": "객관식",
    "content": "다음 그림에서 $A$에서 $B$로 가는 최단 경로의 수를 구하시오. [4.0점]<br><br><img src=\"assets/images/21_금당고_1학기_중간_고2_확률과통계/q11.png\" class=\"exam-img\">",
    "choices": [
      "62",
      "64",
      "66",
      "68",
      "70"
    ],
    "answer": "①",
    "solution": "최단 경로에서는 **오른쪽과 위쪽**으로만 움직인다. 어느 교점에 도달하는 마지막 한 걸음은 왼쪽 교점에서 오른쪽으로 오거나, 아래 교점에서 위쪽으로 오는 두 경우뿐이다.\n따라서 그 교점까지의 경로 수는 **실제로 연결된 왼쪽 도로의 경로 수 + 실제로 연결된 아래 도로의 경로 수**다. 없는 도로 쪽의 수는 더하면 안 된다.\n그림의 세로줄을 왼쪽부터 $x=0,1,2,3$, 가로줄을 아래부터 $y=0,1,\\ldots,6$이라 하자. 출발점 $A=(0,0)$에 $1$을 적고 아래 행부터 채운다.\n도로가 끊긴 곳은 정확히 다음 세 구간이다.\n$y=1$의 $x=2\\to3$, $y=3$의 $x=1\\to2$, $y=5$의 $x=0\\to1$.\n예를 들어 $(3,1)$에는 왼쪽에서 올 수 없으므로 아래 $(3,0)$의 $1$만 적는다. $(2,3)$에는 왼쪽에서 올 수 없어 아래 $(2,2)$의 $6$만 적는다. $(1,5)$도 아래 $(1,4)$의 $5$만 이어받는다.\n이 규칙으로 각 행의 경로 수를 **왼쪽에서 오른쪽 순서**로 적으면\n$y=0:\\ (1,1,1,1)$\n$y=1:\\ (1,2,3,1)$\n$y=2:\\ (1,3,6,7)$\n$y=3:\\ (1,4,6,13)$\n$y=4:\\ (1,5,11,24)$\n$y=5:\\ (1,5,16,40)$\n$y=6:\\ (1,6,22,62)$이다.\n마지막 $B=(3,6)$에는 왼쪽 $(2,6)$에서 오는 $22$가지와 아래 $(3,5)$에서 오는 $40$가지가 모두 연결되어 있으므로 $22+40=62$가지다.\n해설 그림에서도 끊긴 세 가로길을 건너뛰지 않고 같은 수를 확인할 수 있다. 따라서 정답은 ①이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합",
    "solutionImage": "assets/images/21_금당고_1학기_중간_고2_확률과통계/q11-solution.svg",
    "solutionImageAlt": "빠진 도로를 제외하고 교점마다 최단 경로 수를 누적한 도식, B는 62",
    "solutionImageCaption": "없는 도로는 건너뛰고 아래쪽·왼쪽 경로 수를 더한다.",
    "solutionImageSize": "large"
  },
  {
    "id": 12,
    "questionType": "객관식",
    "content": "그림과 같은 정육면체의 모든 면을 색칠하려 한다. 빨간색, 파란색, 노란색, 초록색, 검정색, 보라색의 6가지 색을 모두 사용하여 칠하는 경우의 수를 구하시오. (단, 회전하여 일치하는 것은 같은 것으로 본다.) [4.0점]<br><br><img src=\"assets/images/21_금당고_1학기_중간_고2_확률과통계/q12.png\" class=\"exam-img\">",
    "choices": [
      "30",
      "36",
      "42",
      "48",
      "54"
    ],
    "answer": "①",
    "solution": "정육면체의 6면에 서로 다른 6색을 하나씩 칠한다고 생각하면 면의 위치를 고정했을 때 $6!=720$가지다.\n그러나 정육면체는 한 꼭짓점을 고정한 회전만이 아니라 **공간에서 가능한 24가지 회전**을 할 수 있다. 앞면을 정하는 방법 6가지, 그 앞면을 고정하고 윗면 방향을 정하는 방법 4가지이므로 $6\\cdot4=24$가지다.\n6색이 모두 다르므로 서로 다른 비자명한 회전이 색 배치를 그대로 유지하지 않는다. 따라서 각 실제 색칠이 24번씩 중복된다.\n$\\dfrac{6!}{24}=\\dfrac{720}{24}=30$이므로 정답은 ①이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합"
  },
  {
    "id": 13,
    "questionType": "객관식",
    "content": "5명의 유권자가 투표를 하려고 한다. 각각의 유권자는 3명의 후보자 중 1명에게만 투표를 할 수 있고 기권이나 무효표는 없다고 한다. 기명 투표를 할 때의 모든 경우의 수를 $m$, 무기명 투표를 할 때의 모든 경우의 수를 $n$이라 하자. $m+n$의 값을 구하시오. [4.2점]",
    "choices": [
      "21",
      "35",
      "243",
      "264",
      "300"
    ],
    "answer": "④",
    "solution": "기명 투표에서는 5명의 유권자를 구분한다. 각자 3명 중 한 명을 택하므로 $m=3^5=243$이다.\n무기명 투표에서는 누가 누구에게 투표했는지가 아니라 후보 3명의 득표수 $(a,b,c)$만 중요하다. 따라서 $a+b+c=5$인 음이 아닌 정수해를 센다.\n$n={}_3\\mathrm H_5={}_7\\mathrm C_2=21$이다.\n그러므로 $m+n=243+21=264$이고 정답은 ④이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합"
  },
  {
    "id": 14,
    "questionType": "객관식",
    "content": "두 집합 $X=\\{1, 2, 3, 4\\}$, $Y=\\{1, 2, 3, 4, 5, 6\\}$에 대하여, $X$에서 $Y$로의 함수 $f$ 중 다음을 만족시키는 함수 $f$의 개수를 구하시오.<br>(가) 집합 $X$의 임의의 두 원소 $x_1, x_2$에 대하여 $x_1 < x_2$이면 $f(x_1) \\le f(x_2)$이다.<br>(나) $f(2)f(4)=6$ [4.2점]",
    "choices": [
      "6",
      "8",
      "10",
      "12",
      "14"
    ],
    "answer": "③",
    "solution": "(가)는 $f(1)\\le f(2)\\le f(3)\\le f(4)$를 뜻한다. 특히 $f(2)\\le f(4)$이므로 (나)의 양의 정수 인수쌍은 $(f(2),f(4))=(1,6)$ 또는 $(2,3)$뿐이다.\n① $(1,6)$이면 $f(1)\\le1$이므로 $f(1)=1$이다. $f(3)$은 1부터 6까지 자유롭게 선택할 수 있어 6가지다.\n② $(2,3)$이면 $f(1)$은 1 또는 2로 2가지이고, $f(3)$도 2 또는 3으로 2가지다. 따라서 $2\\cdot2=4$가지다.\n두 경우는 겹치지 않으므로 $6+4=10$가지다. 정답은 ③이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합"
  },
  {
    "id": 15,
    "questionType": "객관식",
    "content": "$\\dfrac{1}{x}\\left(x-\\dfrac{a}{x}\\right)^5$의 전개식에서 상수항이 90이었을 때, 양수 $a$의 값을 구하시오. [4.5점]",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "①",
    "solution": "이항정리에서 괄호 안의 다섯 인수 중 $-a/x$를 $k$번 선택하면 일반항은\n$\\dfrac1x\\cdot{}_5\\mathrm C_k x^{5-k}\\left(-\\dfrac a x\\right)^k={}_5\\mathrm C_k(-a)^k x^{4-2k}$이다.\n상수항이 되려면 $x$의 지수가 0이어야 하므로 $4-2k=0$, 즉 $k=2$다.\n상수항의 계수는 ${}_5\\mathrm C_2(-a)^2=10a^2$이고 이것이 90이므로 $10a^2=90$, $a^2=9$이다.\n$a$는 양수이므로 $a=3$이다. 정답은 ①이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "이항정리",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "이항정리",
    "originalCategory": "이항정리"
  },
  {
    "id": 16,
    "questionType": "객관식",
    "content": "아이유가 자동차로 오른쪽 그림과 같은 바둑판 모양의 도로를 따라 집에서 약속 장소인 마카롱 가게까지 최단거리로 가는 도중에, 어떤 교차로에서 약속 장소가 서점으로 바뀌었다는 연락을 받고 곧바로 서점을 향하여 도로를 따라 최단거리로 이동하였다. 아이유가 집에서 출발하여 서점까지 최단거리로 이동하는 경로의 수를 구하시오. (단, 연락받은 위치가 달라도 이동 경로가 같으면 동일한 경우로 간주한다.) [4.7점]<br><br><img src=\"assets/images/21_금당고_1학기_중간_고2_확률과통계/q16.png\" class=\"exam-img\">",
    "choices": [
      "235",
      "250",
      "265",
      "280",
      "295"
    ],
    "answer": "⑤",
    "solution": "**연락받은 교차로를 세는 문제가 아니라, 실제로 자동차가 지나간 전체 경로를 한 번씩 세는 문제**다. 같은 경로에서 연락 위치만 바뀌어도 중복해 세지 않는다.\n집은 왼쪽 아래, 서점은 오른쪽 아래, 원래 목적지인 마카롱 가게는 오른쪽 위에 있다. 도로는 오른쪽으로 3칸, 위쪽으로 4칸이다.\n집에서 원래 목적지로 가는 최단 구간에서는 **오른쪽(R)·위쪽(U)**만 움직이고, 연락받은 뒤 서점으로 가는 최단 구간에서는 **오른쪽(R)·아래쪽(D)**만 움직인다.\n따라서 실제 전체 경로에서는 모든 위쪽 이동이 아래쪽 이동보다 먼저 나온다. 경로가 도달한 **최고 높이 $h$**를 정하면 위쪽 이동 $h$번, 아래쪽 이동 $h$번, 오른쪽 이동 3번이 필요하다. 가능한 높이는 $h=0,1,2,3,4$다.\n이때 위쪽과 아래쪽 이동의 상대적인 순서는 $\\underbrace{U\\cdots U}_{h\\text{번}}\\underbrace{D\\cdots D}_{h\\text{번}}$로 고정되어 있다. 오른쪽 이동은 이 $2h$개의 세로 이동 **앞·사이·뒤**, 즉 $2h+1$개의 구간에 자유롭게 끼워 넣을 수 있다.\n각 구간에 들어가는 오른쪽 이동 횟수를 $a_0,a_1,\\ldots,a_{2h}$라 하면\n$a_0+a_1+\\cdots+a_{2h}=3$, $a_i\\ge0$이다.\n이 음이 아닌 정수해 하나가 실제 이동 순서 하나에 정확히 대응하므로, 높이 $h$인 경로 수는\n${}_{2h+1}\\mathrm H_3={}_{2h+3}\\mathrm C_3$이다.\n예를 들어 $h=2$일 때 세로 이동은 $U,U,D,D$ 순서로 고정되고, 그 앞·사이·뒤의 5곳에 오른쪽 이동 3회를 배분한다. 따라서 ${}_5\\mathrm H_3={}_7\\mathrm C_3=35$가지다. 아래 해설 그림의 색칠된 길은 그중 $UURRDDR$이라는 한 경로를 보여 준다.\n높이별로 계산하면\n$h=0:\\ {}_3\\mathrm C_3=1$\n$h=1:\\ {}_5\\mathrm C_3=10$\n$h=2:\\ {}_7\\mathrm C_3=35$\n$h=3:\\ {}_9\\mathrm C_3=84$\n$h=4:\\ {}_{11}\\mathrm C_3=165$이다.\n최고 높이가 다르면 경로 자체가 다르고, 같은 높이에서도 오른쪽 이동 배분이 다르면 실제 길이 다르다. 반대로 꼭대기에서 어느 교차로에서 연락받았는지 달라도 **같은 이동 순서**는 한 번만 센다.\n따라서 $1+10+35+84+165=295$가지이므로 정답은 ⑤이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합",
    "solutionImage": "assets/images/21_금당고_1학기_중간_고2_확률과통계/q16-solution.svg",
    "solutionImageAlt": "집·서점·마카롱 가게를 표시한 가로 3칸 세로 4칸 격자도로",
    "solutionImageCaption": "최고 높이 0~4칸으로 분류하면 중복 없이 295경로를 셉니다.",
    "solutionImageSize": "full"
  },
  {
    "id": 17,
    "questionType": "객관식",
    "content": "집합 $S=\\{x \\mid x\\text{는 } 30 \\text{ 이하의 소수}\\}$의 부분집합 중 원소 2는 포함하고 원소 23은 포함하지 않으면서, 원소의 개수가 짝수인 부분집합의 개수를 구하시오. [4.9점]",
    "choices": [
      "32",
      "64",
      "128",
      "256",
      "512"
    ],
    "answer": "③",
    "solution": "30 이하의 소수를 먼저 빠짐없이 적으면\n$S=\\{2,3,5,7,11,13,17,19,23,29\\}$로 총 10개다.\n문제에서 $2$는 반드시 포함하고 $23$은 반드시 제외하므로, 나머지 $8$개 $\\{3,5,7,11,13,17,19,29\\}$의 선택만 결정하면 된다.\n이미 $2$가 한 개 포함되어 있으므로 **전체 원소 수가 짝수**가 되려면 남은 8개에서는 **홀수 개**를 골라야 한다.\n왜 홀수 개를 고르는 경우가 전체의 절반일까? 남은 8개 중 특정 원소 $3$의 포함 여부를 뒤집어 보자. $3$을 넣은 집합에서는 빼고, 뺀 집합에서는 넣는다. 그러면 선택 원소 수의 짝·홀이 반드시 바뀌고, 같은 조작을 한 번 더 하면 원래 집합으로 돌아온다.\n따라서 홀수 개 선택과 짝수 개 선택은 정확히 일대일로 짝지어지며 개수가 같다. 남은 8개를 자유롭게 고르는 전체 경우가 $2^8=256$이므로\n$\\dfrac{2^8}{2}=2^7=128$가지다.\n따라서 정답은 ③이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합"
  },
  {
    "id": 18,
    "questionType": "객관식",
    "content": "오늘이 월요일일 때, 오늘로부터 $15^9$일 후는 무슨 요일인지 구하시오. [4.9점]",
    "choices": [
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일"
    ],
    "answer": "②",
    "solution": "요일은 7일이 지날 때마다 같은 요일로 돌아온다. 따라서 $15^9$를 실제로 계산할 필요 없이 **7로 나눈 나머지**만 구하면 된다.\n$15=7\\times2+1$이므로 15일이 지난 효과는 1일이 지난 효과와 같다.\n이 사실을 거듭제곱에도 적용할 수 있다. 예를 들어 $(7a+1)(7b+1)=7(7ab+a+b)+1$이므로, 7로 나눈 나머지가 각각 1인 두 수의 곱도 나머지가 1이다.\n15를 아홉 번 곱한 $15^9$도 7로 나눈 나머지가 1이다. 즉 어떤 정수 $k$에 대하여 $15^9=7k+1$로 쓸 수 있다.\n따라서 월요일에서 7일씩 $k$번 지난 뒤 **하루를 더** 지난 요일과 같으므로 화요일이다. 정답은 ②이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합"
  },
  {
    "id": 19,
    "questionType": "객관식",
    "content": "순경이 조례동, 덕연동, 풍덕동 세 구역을 순찰하려고 한다. 각 구역에는 적어도 한 명이 순찰하고, 세 구역을 순찰하는 순경의 총 인원은 12명 이하가 되도록 인원수를 정하는 경우의 수를 구하시오. (단, 한 명의 순경은 하나의 구역만 순찰하고, 순경은 서로 구분하지 않는다.) [5.2점]",
    "choices": [
      "140",
      "160",
      "180",
      "200",
      "220"
    ],
    "answer": "⑤",
    "solution": "순경은 서로 구별하지 않으므로 **세 구역에 몇 명씩 배정했는지**만 세면 된다. 세 구역의 인원수를 $a,b,c$라 놓으면\n$a,b,c\\ge1$, $a+b+c\\le12$다.\n먼저 각 구역에 한 명씩 배치한 뒤 남는 인원수를\n$x=a-1$, $y=b-1$, $z=c-1$이라 놓자. 그러면 $x,y,z\\ge0$이고\n$x+y+z\\le12-3=9$다.\n여기서 부등식을 등식으로 바꾸기 위해 **배정하지 않고 남겨 둔 최대 인원 여유**를 $w=9-(x+y+z)$라 둔다. $w$는 실제로 배치된 순경이 아니라, '최대 12명' 중 사용하지 않은 인원 여유를 나타낸다.\n따라서 $x+y+z+w=9$, $x,y,z,w\\ge0$이다.\n원래 배정 $(a,b,c)$가 주어지면 $x,y,z,w$는 하나로 정해지고, 거꾸로 $x,y,z,w$가 주어지면 $(a,b,c)=(x+1,y+1,z+1)$가 하나로 정해진다. 그러므로 이 치환으로 경우가 중복되거나 빠지지 않는다.\n같은 물건 9개를 네 변수에 나누는 중복조합의 수는\n${}_4\\mathrm H_9={}_{9+4-1}\\mathrm C_{4-1}={}_{12}\\mathrm C_3$\n$=\\dfrac{12\\times11\\times10}{3\\times2\\times1}=220$이다.\n따라서 정답은 ⑤이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합"
  },
  {
    "id": 20,
    "questionType": "객관식",
    "content": "빨강, 파랑, 노랑, 초록 4가지 색을 모두 사용하여 다음 그림을 칠하려 한다. 한 가지 색은 두 번 사용할 때, 색칠하는 방법의 수를 구하시오. (단, 그림에서 모든 변의 길이는 같으며, 한 면에는 한 가지 색을 칠하고, 회전하여 일치하는 것은 같은 것으로 본다.) [5.4점]<br><br><img src=\"assets/images/21_금당고_1학기_중간_고2_확률과통계/q20.png\" class=\"exam-img\">",
    "choices": [
      "20",
      "30",
      "40",
      "50",
      "60"
    ],
    "answer": "⑤",
    "solution": "그림은 정사각형 밑면 1개와 삼각형 옆면 4개로 된 사각뿔의 전개도다. 총 5면에 4색을 모두 쓰므로 한 색만 두 번 사용한다. 사각뿔은 꼭짓점을 축으로 $90^\\circ$씩 돌리는 4가지 회전이 서로 같은 색칠을 만든다.\n① **밑면의 색이 두 번 쓰이는 색인 경우**: 반복할 색 4가지, 그 색과 같은 색을 칠할 옆면의 위치 4가지, 나머지 3색을 배치하는 순서 $3!$가지다. 회전 4가지를 같은 것으로 보면 $\\dfrac{4\\cdot4\\cdot3!}{4}=24$가지다.\n② **반복한 색이 옆면 두 곳에만 쓰이는 경우**: 반복할 색 4가지, 밑면에 칠할 다른 색 3가지, 나머지 옆면 4곳에 반복 색 2개와 서로 다른 색 2개를 배치하는 경우 $\\dfrac{4!}{2!}=12$가지다. 회전 중복을 제거하면 $\\dfrac{4\\cdot3\\cdot12}{4}=36$가지다.\n회전 중복을 4로 나눌 수 있는 이유는 4색을 모두 쓰는 색칠이 $90^\\circ$, $180^\\circ$, $270^\\circ$ 회전 후 자기 자신과 같을 수 없기 때문이다. 특히 $180^\\circ$ 회전에서 같으려면 마주 보는 옆면 두 쌍이 각각 같은 색이어야 하는데, 이 경우 한 색만 두 번 쓴다는 조건에 어긋난다.\n두 경우는 겹치지 않으므로 $24+36=60$가지이고 정답은 ⑤이다. 아래 그림은 빨강을 두 번 쓰고 나머지 3색을 한 번씩 쓰는 조건을 충족한 한 예이다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합",
    "solutionImage": "assets/images/21_금당고_1학기_중간_고2_확률과통계/q20-solution.svg",
    "solutionImageAlt": "정사각형 밑면과 삼각형 옆면 4개인 사각뿔 전개도",
    "solutionImageCaption": "밑면에서 반복되는 경우와 옆면에서 반복되는 경우를 나눕니다.",
    "solutionImageSize": "full"
  },
  {
    "id": 21,
    "questionType": "서술형",
    "content": "<서답형 1> 이항정리를 이용하여 다음 등식이 성립함을 증명하시오. [10점]<br>(1) ${}_n\\mathrm{C}_0 - {}_n\\mathrm{C}_1 + {}_n\\mathrm{C}_2 - \\cdots + (-1)^n {}_n\\mathrm{C}_n = 0$ [5점]<br>(2) $n$이 홀수일 때, ${}_n\\mathrm{C}_1 + {}_n\\mathrm{C}_3 + {}_n\\mathrm{C}_5 + \\cdots + {}_n\\mathrm{C}_n = 2^{n-1}$ [5점]",
    "choices": [],
    "answer": "(1) 0임을 증명, (2) $2^{n-1}$임을 증명",
    "solution": "이항정리는 $(a+b)^n=\\sum_{k=0}^n{}_n\\mathrm C_k a^{n-k}b^k$이다.\n(1) $a=1$, $b=-1$을 대입하면 $(1-1)^n=\\sum_{k=0}^n(-1)^k{}_n\\mathrm C_k$이다. $n$이 양의 정수이므로 왼쪽은 $0^n=0$이다. 따라서 ${}_n\\mathrm C_0-{}_n\\mathrm C_1+{}_n\\mathrm C_2-\\cdots+(-1)^n{}_n\\mathrm C_n=0$이다.\n(2) $a=b=1$을 대입하면 $2^n={}_n\\mathrm C_0+{}_n\\mathrm C_1+\\cdots+{}_n\\mathrm C_n$이다.\n한편 (1)에 의해 $0={}_n\\mathrm C_0-{}_n\\mathrm C_1+{}_n\\mathrm C_2-{}_n\\mathrm C_3+\\cdots-{}_n\\mathrm C_n$이다(마지막 부호는 $n$이 홀수이므로 음수).\n두 등식에서 아래 식을 위 식에서 빼면 짝수 차수 항은 모두 없어지고 홀수 차수 항만 두 배가 되어 $2^n=2({}_n\\mathrm C_1+{}_n\\mathrm C_3+\\cdots+{}_n\\mathrm C_n)$이다.\n따라서 ${}_n\\mathrm C_1+{}_n\\mathrm C_3+\\cdots+{}_n\\mathrm C_n=2^{n-1}$임을 보였다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "이항정리",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "서술형"
    ],
    "category": "이항정리",
    "originalCategory": "이항정리"
  },
  {
    "id": 22,
    "questionType": "서술형",
    "content": "<서답형 2> $1, 2, 3, 4, 5, 6$의 숫자가 하나씩 적힌 6개의 공을 서로 다른 상자 $A, B, C$에 모두 넣으려고 한다. 어느 상자에도 공에 적힌 수의 합이 18 이상이 되는 경우가 없도록 공을 상자에 넣는 방법의 수를 구하시오. (단, 빈 상자가 있어도 되고, 빈 상자의 경우에는 넣어진 공에 적힌 수의 합을 0으로 한다.) [10점]",
    "choices": [],
    "answer": "696",
    "solution": "6개 공은 각각 적힌 숫자가 달라 서로 구별되며, 각 공은 서로 다른 상자 $A,B,C$ 중 하나에 들어간다. 아무 제한이 없다면 각 공에 3가지 선택이 있으므로\n$3^6=729$가지다.\n세 상자에 들어간 숫자의 합은 언제나 $1+2+3+4+5+6=21$이다. 조건에 어긋나는 경우, 즉 **어느 한 상자의 합이 18 이상인 경우**를 빼자.\n한 상자의 합이 18 이상이라면 **그 상자 밖**에 있는 공들의 숫자 합은 $21-18=3$ 이하이다. 공의 숫자는 모두 양수이므로 밖에 놓일 수 있는 공의 집합은 정확히\n$\\varnothing$ (합 0), $\\{1\\}$ (합 1), $\\{2\\}$ (합 2), $\\{3\\}$ (합 3), $\\{1,2\\}$ (합 3)\n다섯 가지뿐이다. 예를 들어 $\\{1,3\\}$은 합이 4이므로 해당하지 않는다.\n합이 18 이상인 상자를 $A$로 고정하자. $A$ 밖에 남는 공이 $k$개이면 각각 $B$ 또는 $C$에 들어갈 수 있으므로 $2^k$가지다. 따라서\n밖에 공 0개: $1$가지,\n밖에 공 1개인 세 집합: $2+2+2=6$가지,\n밖에 공 2개인 $\\{1,2\\}$: $2^2=4$가지,\n합계 $1+6+4=11$가지다.\n합이 18 이상인 상자를 $A,B,C$ 중 선택하면 $3\\times11=33$가지다. **두 상자가 동시에 18 이상일 수 없는 이유**는 두 상자의 합만으로도 $18+18=36>21$이 되기 때문이다. 따라서 잘못된 33가지는 서로 겹치지 않아 그대로 빼도 된다.\n결국 조건을 만족하는 경우는\n$729-33=696$가지다.",
    "standardCourse": "확률과 통계",
    "standardUnit": "순열과 조합",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "서술형"
    ],
    "category": "순열과 조합",
    "originalCategory": "순열과 조합"
  }
];
