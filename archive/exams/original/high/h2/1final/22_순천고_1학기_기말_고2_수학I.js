window.examTitle = "22_순천고_1학기_기말_고2_수학I";

window.questionBank = [
  {
    "id": 1,
    "questionType": "객관식",
    "content": "함수 $y=\\cos x$의 그래프를 $y$축에 대하여 대칭이동한 후, $x$축의 방향으로 $\\dfrac{\\pi}{2}$만큼 평행이동한 함수의 그래프는? [3.5점]",
    "choices": [
      "$y=\\sin x$",
      "$y=-\\sin x$",
      "$y=\\cos x$",
      "$y=-\\cos x$",
      "$y=\\sin 2x$"
    ],
    "answer": "①",
    "solution": "함수 $y=\\cos x$의 그래프를 $y$축에 대하여 대칭이동하면 $x$ 대신 $-x$를 대입하므로\n$y=\\cos(-x)=\\cos x$이다.\n\n이제 $x$축 방향으로 $\\dfrac{\\pi}{2}$만큼 오른쪽으로 평행이동하면 $x$ 대신 $x-\\dfrac{\\pi}{2}$를 대입한다.\n$y=\\cos\\left(x-\\dfrac{\\pi}{2}\\right)=\\sin x$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 2,
    "questionType": "객관식",
    "content": "삼각형 $ABC$에서 $A=45^\\circ$, $B=30^\\circ$, $b=\\sqrt{2}$일 때, $a$의 값은? [3.6점]",
    "choices": [
      "1",
      "$\\sqrt{3}$",
      "2",
      "$2\\sqrt{2}$",
      "$2\\sqrt{3}$"
    ],
    "answer": "③",
    "solution": "사인법칙에 따라\n$\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}$이다.\n주어진 값을 대입하면\n$\\dfrac{a}{\\sin45^\\circ}=\\dfrac{\\sqrt2}{\\sin30^\\circ}$\n$a=\\sqrt2\\cdot\\dfrac{\\sin45^\\circ}{\\sin30^\\circ}$\n$=\\sqrt2\\cdot\\dfrac{\\sqrt2/2}{1/2}=2$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 3,
    "questionType": "객관식",
    "content": "등차수열 $\\{a_n\\}$에서 $a_4=6$, $a_7-a_3=8$일 때, $a_{10}$는? [3.3점]",
    "choices": [
      "12",
      "18",
      "24",
      "30",
      "36"
    ],
    "answer": "②",
    "solution": "등차수열의 공차를 d라 하자.\n$a_7-a_3=(a_1+6d)-(a_1+2d)=4d$이므로\n$4d=8$, $d=2$이다.\n$a_{10}$은 $a_4$보다 여섯 항 뒤이므로\n$a_{10}=a_4+6d=6+6\\cdot2=18$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 4,
    "questionType": "객관식",
    "content": "세 수 $x-1$, $x+2$, $3x-1$이 이 순서대로 등비수열을 이룰 때, 모든 $x$의 값의 합은? [3.8점]",
    "choices": [
      "2",
      "$\\dfrac{7}{3}$",
      "$\\dfrac{5}{2}$",
      "3",
      "4"
    ],
    "answer": "⑤",
    "solution": "세 수가 이 순서대로 등비수열이면 가운데 항의 제곱이 양끝 항의 곱과 같다.\n$(x+2)^2=(x-1)(3x-1)$\n$x^2+4x+4=3x^2-4x+1$\n$2x^2-8x-3=0$이다.\n판별식은 $(-8)^2-4\\cdot2\\cdot(-3)=88>0$이므로 서로 다른 두 실근이 있다. $x=1$은 이 방정식의 근이 아니므로 두 근 모두 $x-1\\ne0$이다. 따라서 $r=\\dfrac{x+2}{x-1}$로 놓으면 $x+2=(x-1)r$, $3x-1=(x+2)r$가 성립하여 실제로 등비수열을 이룬다.\n두 근의 합은 이차방정식의 근과 계수의 관계에 따라\n$-\\dfrac{-8}{2}=4$이다.\n따라서 모든 x의 값의 합은 4이고, 정답은 ⑤이다."
  },
  {
    "id": 5,
    "questionType": "객관식",
    "content": "첫째항이 $1$이고, 제$2$항이 $3$인 등비수열에서 첫째항부터 제$5$항까지의 합은? [3.4점]",
    "choices": [
      "13",
      "39",
      "40",
      "81",
      "121"
    ],
    "answer": "⑤",
    "solution": "첫째항이 1이고 둘째항이 3인 등비수열의 공비는\n$r=\\dfrac{3}{1}=3$이다.\n첫째항부터 제5항까지의 합은\n$S_5=1+3+3^2+3^3+3^4$\n$=1+3+9+27+81=121$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 6,
    "questionType": "객관식",
    "content": "$\\sum_{k=1}^{5} k(k+1)(k+2)$의 값은? [3.7점]",
    "choices": [
      "400",
      "420",
      "440",
      "460",
      "480"
    ],
    "answer": "②",
    "solution": "각 항을 차례로 계산하면\n$1\\cdot2\\cdot3=6$, $2\\cdot3\\cdot4=24$, $3\\cdot4\\cdot5=60$,\n$4\\cdot5\\cdot6=120$, $5\\cdot6\\cdot7=210$이다.\n따라서\n$\\displaystyle\\sum_{k=1}^{5}k(k+1)(k+2)=6+24+60+120+210=420$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 7,
    "questionType": "객관식",
    "content": "$-\\dfrac{\\pi}{2} < x < \\dfrac{\\pi}{2}$일 때, 부등식 $-\\sqrt{3} \\le \\tan x \\le 1$의 해는 $a\\pi \\le x \\le b\\pi$이다. 이때, $a+b$의 값은? [3.9점]",
    "choices": [
      "$-\\dfrac{1}{6}$",
      "$-\\dfrac{1}{12}$",
      "0",
      "$\\dfrac{1}{12}$",
      "$\\dfrac{1}{6}$"
    ],
    "answer": "②",
    "solution": "$-\\dfrac{\\pi}{2}<x<\\dfrac{\\pi}{2}$에서 $\\tan x$는 증가한다.\n$-\\sqrt3\\le\\tan x\\le1$의 양끝을 각각 만족하는 각은\n$\\tan x=-\\sqrt3$일 때 $x=-\\dfrac{\\pi}{3}$,\n$\\tan x=1$일 때 $x=\\dfrac{\\pi}{4}$이다.\n따라서 $a=-\\dfrac13$, $b=\\dfrac14$이고\n$a+b=-\\dfrac13+\\dfrac14=-\\dfrac1{12}$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 8,
    "questionType": "객관식",
    "content": "다음 보기 중 함수 $y=\\tan \\dfrac{x}{2}$에 대한 설명으로 옳은 것의 개수는? [4.3점]<br><br><b>&lt;보 기&gt;</b><br>ㄱ. 정의역은 실수 전체의 집합이다.<br>ㄴ. 치역은 실수 전체의 집합이다.<br>ㄷ. 그래프는 $y$축에 대하여 대칭이다.<br>ㄹ. 모든 실수 $x$에 대하여 $f(x+\\pi)=f(x)$이다.<br>ㅁ. 점근선의 방정식은 $y=2n\\pi+\\dfrac{\\pi}{2}$($n$은 정수)이다.",
    "choices": [
      "1개",
      "2개",
      "3개",
      "4개",
      "5개"
    ],
    "answer": "①",
    "solution": "$f(x)=\\tan\\dfrac{x}{2}$라 하자.\nㄱ: $x=(2n+1)\\pi$에서 정의되지 않으므로 거짓이다.\nㄴ: 탄젠트함수의 치역은 실수 전체이므로 참이다.\nㄷ: $f(-x)=-f(x)$이므로 원점 대칭이고, y축 대칭은 아니어서 거짓이다.\nㄹ: 주기는 $2\\pi$이므로 $f(x+\\pi)=f(x)$는 거짓이다.\nㅁ: 점근선은 $x=(2n+1)\\pi$인 수직선이므로 제시된 식은 거짓이다.\n참인 것은 ㄴ 하나이므로 정답은 ①이다."
  },
  {
    "id": 9,
    "questionType": "객관식",
    "content": "$0 \\le x < 2\\pi$일 때, 방정식<br>$$\\sin\\left(\\dfrac{\\pi}{2}-x\\right) + \\sin(\\pi+x) = \\cos(\\pi+x) - \\cos\\left(\\dfrac{\\pi}{2}+x\\right)$$를 만족시키는 모든 $x$의 값의 합은? [4.1점]",
    "choices": [
      "$\\dfrac{3}{2}\\pi$",
      "$2\\pi$",
      "$\\dfrac{5}{2}\\pi$",
      "$3\\pi$",
      "$\\dfrac{7}{2}\\pi$"
    ],
    "answer": "①",
    "solution": "단위원에서 각 $x$에 대응하는 점의 좌표는 $(\\cos x,\\sin x)$이다. 각 $\\dfrac{\\pi}{2}-x$에 대응하는 점은 $(\\sin x,\\cos x)$이므로 $\\sin\\left(\\dfrac{\\pi}{2}-x\\right)=\\cos x$이다. 각 $\\pi+x$는 각 $x$의 대척점이므로 $\\sin(\\pi+x)=-\\sin x$, $\\cos(\\pi+x)=-\\cos x$이다. 또한 각 $\\dfrac{\\pi}{2}+x$는 각 $x$의 점을 $\\dfrac{\\pi}{2}$만큼 회전한 점 $(-\\sin x,\\cos x)$에 대응하므로 $\\cos\\left(\\dfrac{\\pi}{2}+x\\right)=-\\sin x$이다.\n\n따라서 주어진 방정식은\n$\\cos x-\\sin x=-\\cos x+\\sin x$\n$2(\\cos x-\\sin x)=0$\n으로 정리된다. 즉 $\\cos x=\\sin x$이다. 단위원에서 이 조건을 만족하는 점은 제1사분면과 제3사분면의 두 점이므로, $0\\le x<2\\pi$에서 $x=\\dfrac{\\pi}{4},\\dfrac{5\\pi}{4}$이다.\n\n두 값의 합은 $\\dfrac{3\\pi}{2}$이므로 정답은 ①이다."
  },
  {
    "id": 10,
    "questionType": "객관식",
    "content": "오른쪽 그림과 같이 원 위의 네 점 $A, B, C, D$에 대하여 $\\overline{BD}=5$, $\\overline{CD}=2$이고 $\\sin(\\angle DAB)=\\dfrac{3}{4}$일 때, $\\sin(\\angle DAC)$의 값은? [4.2점]<br><img src=\"assets/images/22_순천고_1학기_기말_고2_수학I/q10.png\" class=\"exam-img\">",
    "choices": [
      "$\\dfrac{2}{15}$",
      "$\\dfrac{1}{5}$",
      "$\\dfrac{3}{10}$",
      "$\\dfrac{3}{8}$",
      "$\\dfrac{3}{5}$"
    ],
    "answer": "③",
    "solution": "네 점 A, B, C, D가 한 원 위에 있으므로 그 원의 반지름을 R이라 하면 현 BD에 대하여\n$BD=2R\\sin\\angle DAB$이다.\n$5=2R\\cdot\\dfrac34$에서\n$R=\\dfrac{10}{3}$이다.\n현 CD는 원주각 $\\angle DAC$에 대응하므로\n$CD=2R\\sin\\angle DAC$이다.\n따라서\n$\\sin\\angle DAC=\\dfrac{CD}{2R}=\\dfrac{2}{20/3}=\\dfrac{3}{10}$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 11,
    "questionType": "객관식",
    "content": "다음 그림과 같이 반지름의 길이가 $5$인 원 $O$에 내접하는 삼각형 $ABC$에 대하여 $a=8$일 때, $bc$의 최댓값은? [4.7점]<br><img src=\"assets/images/22_순천고_1학기_기말_고2_수학I/q11.png\" class=\"exam-img\">",
    "choices": [
      "64",
      "72",
      "75",
      "80",
      "96"
    ],
    "answer": "④",
    "solution": "외접원의 반지름이 $5$이므로 사인법칙에서 $a=2R\\sin A=10\\sin A$이다. $a=8$을 대입하면 $\\sin A=\\dfrac45$이다. 따라서 $A$는 예각 또는 둔각일 수 있고, 이에 따라 $\\cos A=\\dfrac35$ 또는 $-\\dfrac35$이다.\n\n코사인법칙과 $b^2+c^2\\ge2bc$를 이용하면\n$64=b^2+c^2-2bc\\cos A\\ge2bc(1-\\cos A)$이다.\n$\\cos A=\\dfrac35$이면 $bc\\le\\dfrac{64}{2(1-3/5)}=80$이고, $\\cos A=-\\dfrac35$이면 $bc\\le\\dfrac{64}{2(1+3/5)}=20$이다. 따라서 항상 $bc\\le80$이다.\n\n이 상한은 실제로 이룰 수 있다. 원 위에서 $BC=8$인 현의 큰 호의 중점에 $A$를 잡으면 $AB=AC$이고 $A$는 예각이다. 따라서 $b=c$이고 $\\cos A=\\dfrac35$인 경우에 등호가 성립한다. 이때 코사인법칙으로\n$64=2b^2-2b^2\\cdot\\dfrac35=\\dfrac45b^2$\n이므로 $b^2=c^2=80$, 따라서 $bc=80$이다. 그러므로 최댓값은 $80$이고 정답은 ④이다."
  },
  {
    "id": 12,
    "questionType": "객관식",
    "content": "첫째항이 $1$인 등비수열 $\\{a_n\\}$에서<br>$$a_1+a_3+a_5+\\cdots+a_{2k-1}=10,$$<br>$$a_2+a_4+a_6+\\cdots+a_{2k}=30$$을 만족시키는 자연수 $k$의 값은? [4.0점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "②",
    "solution": "등비수열의 공비를 r이라 하자.\n짝수 번째 항의 합은 홀수 번째 항의 합에 r을 곱한 값이므로\n$30=r\\cdot10$에서 $r=3$이다.\n홀수 번째 항의 합은\n$1+r^2+r^4+\\cdots+r^{2k-2}=10$이다.\n$r=3$을 대입하면\n$1+9+9^2+\\cdots+9^{k-1}=\\dfrac{9^k-1}{8}=10$\n$9^k=81=9^2$이므로 $k=2$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 13,
    "questionType": "객관식",
    "content": "수열 $\\{a_n\\}$에 대하여 $\\sum_{k=1}^{n} a_k = n^2-n$일 때, $\\sum_{k=1}^{3n} a_{2k}$는? [4.5점]",
    "choices": [
      "$6n^2$",
      "$6n^2+2n$",
      "$6n^2+3n$",
      "$18n^2$",
      "$18n^2+3n$"
    ],
    "answer": "④",
    "solution": "부분합에서 일반항을 구한다.\n$n\\ge2$일 때\n$a_n=S_n-S_{n-1}$\n$=(n^2-n)-\\{(n-1)^2-(n-1)\\}$\n$=(n^2-n)-(n^2-3n+2)=2n-2$이다.\n$a_1=S_1=0$이므로 $a_n=2n-2$는 n=1에도 성립한다.\n따라서 $a_{2k}=4k-2$이고\n$\\displaystyle\\sum_{k=1}^{3n}a_{2k}=\\sum_{k=1}^{3n}(4k-2)$\n$=4\\cdot\\dfrac{3n(3n+1)}2-6n=18n^2$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 14,
    "questionType": "객관식",
    "content": "첫째항이 $0$이고 공차가 $0$이 아닌 등차수열 $\\{a_n\\}$에 대하여 수열 $\\{b_n\\}$이 $a_{n+1}b_n = \\sum_{k=1}^{n} a_k$를 만족시킬 때, $b_{2023}$의 값은? [4.4점]",
    "choices": [
      "1007",
      "1008",
      "1009",
      "1010",
      "1011"
    ],
    "answer": "⑤",
    "solution": "공차를 d라 하면 첫째항이 0이므로\n$a_n=(n-1)d$이다.\n따라서 $a_{n+1}=nd$이고\n$\\displaystyle\\sum_{k=1}^{n}a_k=d(0+1+\\cdots +(n-1))=\\dfrac{dn(n-1)}2$이다.\n주어진 관계에 대입하면\n$ndb_n=\\dfrac{dn(n-1)}2$이다.\n$n\\ge1$이고 $d\\ne0$이므로 양변을 nd로 나누어\n$b_n=\\dfrac{n-1}{2}$를 얻는다.\n$b_{2023}=\\dfrac{2022}{2}=1011$이므로 정답은 ⑤이다."
  },
  {
    "id": 15,
    "questionType": "객관식",
    "content": "$2$ 이상의 자연수 $n$으로 나누었을 때, 몫과 나머지가 같아지는 자연수를 모두 더한 값을 $a_n$이라 하자. 예를 들어 $4$로 나누었을 때, 몫과 나머지가 같아지는 자연수는 $5, 10, 15$이므로 $a_4=30$이다. 이때 $a_n > 500$을 만족시키는 자연수 $n$의 최솟값은? [4.6점]",
    "choices": [
      "9",
      "10",
      "11",
      "12",
      "13"
    ],
    "answer": "③",
    "solution": "n으로 나누어 몫과 나머지가 모두 k이면 나눗셈의 관계에서\n$N=nk+k=(n+1)k$이다.\n나머지는 0 이상 n 미만이므로, 예시처럼 양의 자연수 N에서 가능한 k는\n$1,2,\\ldots,n-1$이다.\n따라서\n$a_n=\\sum_{k=1}^{n-1}(n+1)k$\n$=(n+1)\\cdot\\dfrac{n(n-1)}2=\\dfrac{n(n^2-1)}2$이다.\n이 값은 n이 커질수록 증가한다.\n$a_{10}=\\dfrac{10(10^2-1)}2=495\\le500$,\n$a_{11}=\\dfrac{11(11^2-1)}2=660>500$이므로 최솟값은 11이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 16,
    "questionType": "객관식",
    "content": "시속 $20\\,\\text{km}$로 곧은 길을 달리는 자전거가 있다. 길 위의 지점 $P$에서 두 건물 $A$, $B$를 바라본 각의 크기가 각각 진행 방향의 왼쪽으로 $15^\\circ$, 진행 방향의 오른쪽으로 $45^\\circ$이었고, $1$시간을 달린 후 지점 $Q$에서 같은 방법으로 각도를 측정하였더니 두 건물 $A$, $B$를 바라본 각의 크기는 각각 진행 방향의 왼쪽으로 $60^\\circ$, 오른쪽으로 $90^\\circ$이었다. 두 건물 $A$와 $B$ 사이의 거리는? (단, $\\sqrt{3}=1.7$, $\\sqrt{5}=2.2$로 계산한다.) [4.8점]<br><img src=\"assets/images/22_순천고_1학기_기말_고2_수학I/q16.png\" class=\"exam-img\">",
    "choices": [
      "$19.8\\,\\text{km}$",
      "$22\\,\\text{km}$",
      "$24.2\\,\\text{km}$",
      "$26.4\\,\\text{km}$",
      "$28.6\\,\\text{km}$"
    ],
    "answer": "④",
    "solution": "자전거가 1시간 동안 간 거리는\n$PQ=20\\cdot1=20\\,\\text{km}$이다.\n삼각형 APQ에서 $\\angle APQ=15^\\circ$이고, Q에서 전진 방향과 QA가 이루는 각이 60°이므로\n$\\angle AQP=180^\\circ-60^\\circ=120^\\circ$이다.\n따라서 $\\angle PAQ=45^\\circ$이고, 사인법칙으로\n$PA=20\\cdot\\dfrac{\\sin120^\\circ}{\\sin45^\\circ}=10\\sqrt6$이다.\n삼각형 PBQ는 Q에서 직각이고 P의 각이 45°이므로\n$PB=\\dfrac{PQ}{\\sin45^\\circ}=20\\sqrt2$이다.\n또 $\\angle APB=15^\\circ+45^\\circ=60^\\circ$이다.\n코사인법칙으로\n$AB^2=(10\\sqrt6)^2+(20\\sqrt2)^2-2(10\\sqrt6)(20\\sqrt2)\\cos60^\\circ$\n$=1400-400\\sqrt3$이다.\n주어진 근삿값을 차례로 쓰면\n$AB\\approx\\sqrt{1400-400\\cdot1.7}=\\sqrt{720}=12\\sqrt5\\approx12\\cdot2.2=26.4\\,\\text{km}$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 17,
    "questionType": "객관식",
    "content": "오른쪽 그림에서 $\\overline{AC}=4$, $\\angle DAC=30^\\circ$, $\\angle AEC = \\angle ACD = 90^\\circ$이고 $\\overline{EC}=\\overline{BD}$이다. 이때 $\\overline{BC}$의 길이는? [4.9점]<br><img src=\"assets/images/22_순천고_1학기_기말_고2_수학I/q17.png\" class=\"exam-img\">",
    "choices": [
      "$\\sqrt{3}$",
      "2",
      "$\\sqrt{5}$",
      "$2\\sqrt{2}$",
      "$2\\sqrt{3}$"
    ],
    "answer": "⑤",
    "solution": "삼각형 ACD는 C에서 직각이고 A의 각이 30°이므로\n$AD=\\dfrac{AC}{\\cos30^\\circ}=\\dfrac8{\\sqrt3}$, $CD=AC\\tan30^\\circ=\\dfrac4{\\sqrt3}$이다.\n$x=BD=EC$, $y=BC$라 하자. 그림에서 E, C, B가 한 직선 위에 있고 E는 C 바깥쪽에 있으므로\n$AB=\\dfrac8{\\sqrt3}+x$, $EB=x+y$이다.\n삼각형 AEC와 AEB는 E에서 직각이므로\n$AE^2=16-x^2$,\n$\\left(\\dfrac8{\\sqrt3}+x\\right)^2=(16-x^2)+(x+y)^2$이다.\n또 $DB$는 $DA$의 연장선이고 $\\angle CDA=60^\\circ$이므로 $\\angle CDB=120^\\circ$이다.\n삼각형 BCD에 코사인법칙을 적용하면\n$y^2=x^2+\\left(\\dfrac4{\\sqrt3}\\right)^2-2x\\cdot\\dfrac4{\\sqrt3}\\cos120^\\circ$\n$=x^2+\\dfrac{16}{3}+\\dfrac{4x}{\\sqrt3}$이다.\n이를 앞 식에 대입하여 정리하면\n$\\dfrac{64}{3}+\\dfrac{16x}{\\sqrt3}+x^2=\\dfrac{64}{3}+x^2+2xy+\\dfrac{4x}{\\sqrt3}$\n$\\dfrac{12x}{\\sqrt3}=2xy$이다.\n$x=BD>0$이므로 $y=\\dfrac6{\\sqrt3}=2\\sqrt3$이다. 따라서 정답은 ⑤이다."
  },
  {
    "id": 18,
    "questionType": "객관식",
    "content": "첫째항이 양수인 등차수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 하자. $|S_3| = |S_6| = |S_{12}| - 3$을 만족시키는 모든 수열 $\\{a_n\\}$의 첫째항들을 곱하면 $\\dfrac{p}{q}$이다. 이때 $p+q$의 값은? (단, $p$와 $q$는 서로소인 자연수이다.) [5.1점]",
    "choices": [
      "44",
      "45",
      "46",
      "47",
      "48"
    ],
    "answer": "④",
    "solution": "등차수열의 첫째항을 a, 공차를 d라 하면\n$S_3=3(a+d)$, $S_6=3(2a+5d)$이다.\n$|S_3|=|S_6|$이므로\n$a+d=2a+5d$ 또는 $a+d=-(2a+5d)$이다.\n첫째 식에서는 $d=-\\dfrac a4$, 둘째 식에서는 $d=-\\dfrac a2$를 얻는다.\n\n또 $S_{12}=\\dfrac{12(2a+11d)}2=12a+66d$이다. 첫째항이 양수이므로 $a>0$이다.\n\n$d=-\\dfrac a4$이면 $|S_3|=\\dfrac{9a}{4}$이다. 이때\n$S_{12}=12a+66d=12a-\\dfrac{66a}{4}=-\\dfrac{9a}{2}<0$\n이므로 $|S_{12}|=\\dfrac{9a}{2}$이다.\n$|S_{12}|=|S_3|+3$에 대입하면\n$\\dfrac{9a}{2}=\\dfrac{9a}{4}+3$이므로 $a=\\dfrac43$이다.\n\n$d=-\\dfrac a2$이면 $|S_3|=\\dfrac{3a}{2}$이다. 이때\n$S_{12}=12a+66d=12a-33a=-21a<0$\n이므로 $|S_{12}|=21a$이다.\n$21a=\\dfrac{3a}{2}+3$에서 $a=\\dfrac2{13}$이다.\n두 첫째항의 곱은\n$\\dfrac43\\cdot\\dfrac2{13}=\\dfrac8{39}$이므로 $p+q=8+39=47$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 19,
    "questionType": "객관식",
    "content": "실수 $a$에 대하여 $a^{\\log_2 27}$이 $3^n$ ($n=1, 2, 3, \\cdots$)이 되도록 하는 $a$를 작은 수부터 순서대로 나열할 때, $k$번째 수를 $a_k$라 하자. 이때 $\\sum_{k=1}^{20} \\log_2 a_k$의 값은? (단, $a>1$) [5.2점]",
    "choices": [
      "70",
      "85",
      "105",
      "150",
      "210"
    ],
    "answer": "①",
    "solution": "$a^{\\log_2 27}=3^n$의 양변에 밑 3 로그를 취하면\n$(\\log_2 27)(\\log_3 a)=n$이다.\n따라서\n$\\log_2 27>0$이고 밑 $3$이 $1$보다 크므로 $3^{n/\\log_2 27}$은 $n$이 커질수록 증가하며 항상 $1$보다 크다. 따라서 $n$에 대응하는 값이 작은 수부터 나열한 수열의 제$n$항이다.\n$\\log_3 a_n=\\dfrac{n}{\\log_2 27}$,\n$a_n=3^{n/\\log_2 27}$이다.\n$\\log_2 27=3\\log_2 3$이므로\n$\\log_2 a_n=\\dfrac{n\\log_2 3}{3\\log_2 3}=\\dfrac n3$이다.\n그러므로\n$\\displaystyle\\sum_{k=1}^{20}\\log_2 a_k=\\dfrac13(1+2+\\cdots+20)$\n$=\\dfrac13\\cdot\\dfrac{20\\cdot21}{2}=70$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 20,
    "questionType": "서술형",
    "content": "&lt;서술형 1&gt;<br>수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라고 하자. $S_n=2n^2-n+3$일 때, $a_1+a_3+a_4$의 값을 구하는 풀이 과정과 답을 서술하시오. [6.0점, 부분점수 있음]",
    "choices": [],
    "answer": "26",
    "solution": "부분합의 정의에서 $a_1=S_1$이고, $n\\ge2$일 때 $a_n=S_n-S_{n-1}$이다.\n먼저\n$a_1=S_1=2-1+3=4$이다.\n$S_2=2\\cdot2^2-2+3=9$, $S_3=2\\cdot3^2-3+3=18$,\n$S_4=2\\cdot4^2-4+3=31$이므로\n$a_3=S_3-S_2=18-9=9$,\n$a_4=S_4-S_3=31-18=13$이다.\n따라서 $a_1+a_3+a_4=4+9+13=26$이다."
  },
  {
    "id": 21,
    "questionType": "서술형",
    "content": "&lt;서술형 2&gt;<br>다음 그림과 같이 점 $P(4, 0)$에서 출발하여 원 $x^2+y^2=16$ 위를 시계 반대 방향으로 움직이는 점 $Q$가 있다. 점 $Q$가 움직인 거리 $t$에 대하여 $f(t)=-2\\overline{PQ}+5$이라 하자. 함수 $f(t)$의 주기가 $a\\pi$이고 최댓값이 $b$, 최솟값이 $c$일 때, $a+b+c$의 값을 구하는 풀이 과정과 답을 서술하시오. (단, $a>0$) [7.0점, 부분점수 있음]<br><img src=\"assets/images/22_순천고_1학기_기말_고2_수학I/q21.png\" class=\"exam-img\">",
    "choices": [],
    "answer": "2",
    "solution": "원의 반지름은 $4$이므로 원의 둘레는 $2\\pi\\cdot4=8\\pi$이다. 점 $Q$가 거리 $8\\pi$만큼 움직이면 한 바퀴 돌아 다시 $P$에 도달하고, 그 뒤에는 같은 운동을 반복한다. 따라서 $8\\pi$는 $f(t)$의 주기이다.\n\n이 주기보다 작은 양의 주기가 없음을 확인하자. $f(0)=5$이고, 양의 주기 $T$라면 $f(T)=f(0)=5$이어야 한다. 그런데 $f(T)=-2\\overline{PQ}+5$이므로 이 등식은 $\\overline{PQ}=0$, 즉 $Q=P$일 때만 성립한다. 점 $Q$가 처음으로 $P$로 돌아오는 거리는 원의 한 바퀴인 $8\\pi$이므로, 최소 양의 주기는 $8\\pi$이고 $a=8$이다.\n\n또 두 점 사이의 거리는 $0\\le\\overline{PQ}\\le8$이므로 $f(t)=-2\\overline{PQ}+5$의 최댓값은 $5$, 최솟값은 $-11$이다. 따라서 $b=5$, $c=-11$이고\n$a+b+c=8+5-11=2$이다."
  },
  {
    "id": 22,
    "questionType": "서술형",
    "content": "&lt;서술형 3&gt;<br>수열 $\\{a_n\\}$의 모든 항은 $0, 1, 2$ 중 어느 하나의 값을 갖고, $\\sum_{k=1}^{n} a_k = 13$, $\\sum_{k=1}^{n} {a_k}^2 = 23$이 성립할 때, $\\sum_{k=1}^{n} {a_k}^4$의 값을 구하는 풀이 과정과 답을 서술하시오. [7.0점, 부분점수 있음]",
    "choices": [],
    "answer": "83",
    "solution": "항이 0, 1, 2 중 하나이므로 1인 항의 개수를 m, 2인 항의 개수를 r라 하자.\n주어진 두 합은\n$m+2r=13$,\n$m+4r=23$이다.\n둘째 식에서 첫째 식을 빼면\n$2r=10$, $r=5$이다.\n$m+2\\cdot5=13$에서 $m=3$이다.\n0인 항의 네제곱은 0이므로\n$\\displaystyle\\sum_{k=1}^{n}a_k^4=3\\cdot1^4+5\\cdot2^4$\n$=3+5\\cdot16=83$이다."
  }
];
