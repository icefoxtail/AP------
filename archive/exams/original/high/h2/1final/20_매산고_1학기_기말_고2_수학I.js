window.examTitle = "20_매산고_1학기_기말_고2_수학I";
window.questionBank = [
  {
    "id": 1,
    "questionNumber": 1,
    "questionType": "객관식",
    "content": "아래 삼각형 $\\mathrm{ABC}$와 같이 $\\overline{\\mathrm{AB}}=6\\sqrt{3}$, $\\angle\\mathrm{C}=\\frac{\\pi}{3}$일 때, 삼각형 $\\mathrm{ABC}$의 외접원의 넓이를 구하면? [3.9점]<br><br><img src=\"assets/images/20_매산고_1학기_기말_고2_수학I/q01.png\" class=\"exam-img\">",
    "choices": [
      "$16\\pi$",
      "$32\\pi$",
      "$36\\pi$",
      "$48\\pi$",
      "$50\\pi$"
    ],
    "images": [
      "assets/images/20_매산고_1학기_기말_고2_수학I/q01.png"
    ],
    "answer": "③",
    "solution": "외접원의 반지름을 $R$이라 하면 사인법칙에서\n$\\dfrac{\\overline{AB}}{\\sin C}=2R$이다.\n$\\overline{AB}=6\\sqrt3$, $\\sin C=\\sin\\dfrac{\\pi}{3}=\\dfrac{\\sqrt3}{2}$를 대입하면\n$2R=\\dfrac{6\\sqrt3}{\\sqrt3/2}=12$,\n따라서 $R=6$이다.\n외접원의 넓이는 $\\pi R^2=36\\pi$이므로 정답은 ③이다."
  },
  {
    "id": 2,
    "questionNumber": 2,
    "questionType": "객관식",
    "content": "등차수열 $\\{a_n\\}$이 $a_1=-2$, $a_5=10$일 때, 첫째항부터 제 $5$항까지의 합 $S_5$을 구하면? [3.9점]",
    "choices": [
      "$12$",
      "$14$",
      "$16$",
      "$18$",
      "$20$"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "등차수열의 공차를 $d$라 하면\n$a_5=a_1+4d$이므로 $10=-2+4d$,\n$4d=12$, $d=3$이다.\n첫째항부터 제5항까지의 합은 첫째항과 제5항의 평균에 항의 수를 곱하여\n$S_5=\\dfrac{5(a_1+a_5)}{2}=\\dfrac{5(-2+10)}{2}=20$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 3,
    "questionNumber": 3,
    "questionType": "객관식",
    "content": "$a_3=12$, $a_6=-96$를 만족시키는 등비수열에서 $-384$는 제 몇 항인지 구하면? [3.9점]",
    "choices": [
      "제 $8$항",
      "제 $9$항",
      "제 $10$항",
      "제 $11$항",
      "제 $12$항"
    ],
    "images": [],
    "answer": "①",
    "solution": "등비수열의 공비를 $r$이라 하면\n$\\dfrac{a_6}{a_3}=r^3=\\dfrac{-96}{12}=-8$이다.\n따라서 $r=-2$이고, $a_n=a_3r^{n-3}=12(-2)^{n-3}$이다.\n$12(-2)^{n-3}=-384$에서 $(-2)^{n-3}=-32=(-2)^5$이므로\n$n-3=5$, $n=8$이다.\n따라서 $-384$는 제8항이고 정답은 ①이다."
  },
  {
    "id": 4,
    "questionNumber": 4,
    "questionType": "객관식",
    "content": "$\\sum_{k=5}^{10} \\frac{2}{(2k-1)(2k+1)}$의 값을 구하면? [3.9점]",
    "choices": [
      "$\\frac{2}{63}$",
      "$\\frac{4}{63}$",
      "$\\frac{5}{63}$",
      "$\\frac{8}{63}$",
      "$\\frac{10}{63}$"
    ],
    "images": [],
    "answer": "②",
    "solution": "부분분수로 나타내면\n$\\dfrac{2}{(2k-1)(2k+1)}=\\dfrac{1}{2k-1}-\\dfrac{1}{2k+1}$이다.\n따라서\n$\\sum_{k=5}^{10}\\dfrac{2}{(2k-1)(2k+1)}$\n$=\\left(\\dfrac19-\\dfrac1{11}\\right)+\\left(\\dfrac1{11}-\\dfrac1{13}\\right)+\\cdots+\\left(\\dfrac1{19}-\\dfrac1{21}\\right)$\n$=\\dfrac19-\\dfrac1{21}=\\dfrac{7-3}{63}=\\dfrac4{63}$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 5,
    "questionNumber": 5,
    "questionType": "객관식",
    "content": "$0 \\le x < 2\\pi$ 일 때, 부등식 $1-\\sqrt{2}\\sin x < 0$의 해를 구하면? [4.2점]",
    "choices": [
      "$0 < x < \\frac{\\pi}{4}$",
      "$\\frac{\\pi}{4} < x < \\frac{\\pi}{2}$",
      "$\\frac{\\pi}{4} < x < \\frac{3}{4}\\pi$",
      "$\\frac{3}{4}\\pi < x < \\frac{5}{4}\\pi$",
      "$\\frac{5}{4}\\pi < x < \\frac{7}{4}\\pi$"
    ],
    "images": [],
    "answer": "③",
    "solution": "부등식을 정리하면\n$1-\\sqrt2\\sin x<0$에서 $\\sin x>\\dfrac1{\\sqrt2}$이다.\n$0\\le x<2\\pi$에서 $\\sin x=\\dfrac1{\\sqrt2}$가 되는 경계는 $x=\\dfrac\\pi4$, $\\dfrac{3\\pi}4$이고, 사인값이 이보다 큰 구간은 두 경계 사이이다.\n따라서 해는 $\\dfrac\\pi4<x<\\dfrac{3\\pi}4$이고 정답은 ③이다."
  },
  {
    "id": 6,
    "questionNumber": 6,
    "questionType": "객관식",
    "content": "아래와 같이 주어진 삼각형 $\\mathrm{ABC}$의 넓이를 $S_k$라고 하자. 이때 $\\sum_{k=1}^{4} S_k$의 값을 구하면? [4.2점]<br><br><img src=\"assets/images/20_매산고_1학기_기말_고2_수학I/q06.png\" class=\"exam-img\">",
    "choices": [
      "$35$",
      "$40$",
      "$45$",
      "$50$",
      "$55$"
    ],
    "images": [
      "assets/images/20_매산고_1학기_기말_고2_수학I/q06.png"
    ],
    "answer": "④",
    "solution": "그림에서 두 변의 길이는 $AB=2k$, $BC=3k+1$이고 그 사이의 각은 $\\dfrac\\pi6$이다.\n따라서 삼각형의 넓이는\n$S_k=\\dfrac12(2k)(3k+1)\\sin\\dfrac\\pi6=\\dfrac{k(3k+1)}2$이다.\n$S_1=2$, $S_2=7$, $S_3=15$, $S_4=26$이므로\n$\\sum_{k=1}^4S_k=2+7+15+26=50$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 7,
    "questionNumber": 7,
    "questionType": "객관식",
    "content": "모든 자연수 $n$에 대하여 명제 $p(n)$이 아래의 조건을 만족할 때, 다음 중 반드시 참인 것은? [4.2점]\n<div class=\"exam-box\">(가) $p(1)$이 참이다.<br>(나) $p(n)$이 참이면 $p(3n)$도 참이다.<br>(다) $p(n)$이 참이면 $p(4n)$도 참이다.</div>",
    "choices": [
      "$p(24)$",
      "$p(48)$",
      "$p(54)$",
      "$p(162)$",
      "$p(216)$"
    ],
    "images": [],
    "answer": "②",
    "solution": "$1$에서 출발하여 조건 (나)를 쓸 때마다 $3$을 곱하고, 조건 (다)를 쓸 때마다 $4$를 곱할 수 있다.\n그러므로 참이라고 보장되는 $p(n)$의 첨자는 $3^a4^b$ ($a,b$는 음이 아닌 정수) 꼴이다.\n$48=3\\cdot4^2$이므로 조건을 세 번 적용해 $p(1)\\Rightarrow p(4)\\Rightarrow p(16)\\Rightarrow p(48)$을 얻는다.\n한편 $24,54,162,216$은 소인수분해했을 때 가능한 곱 $3^a4^b$ 꼴이 아니므로 반드시 참이라고 할 수 없다.\n따라서 정답은 ②이다."
  },
  {
    "id": 8,
    "questionNumber": 8,
    "questionType": "객관식",
    "content": "아래 그림과 같이 $\\angle\\mathrm{PAB}=\\angle\\mathrm{PAC}=90^\\circ$, $\\overline{\\mathrm{PA}}=4\\mathrm{cm}$인 사면체 $\\mathrm{PABC}$에 대하여 $\\angle\\mathrm{ABP}=\\angle\\mathrm{BAC}=30^\\circ$, $\\angle\\mathrm{ACP}=45^\\circ$일 때, 선분 $\\mathrm{BC}$의 길이를 구하면? [4.3점]<br><br><img src=\"assets/images/20_매산고_1학기_기말_고2_수학I/q08.png\" class=\"exam-img\">",
    "choices": [
      "$2\\mathrm{cm}$",
      "$3\\mathrm{cm}$",
      "$4\\mathrm{cm}$",
      "$5\\mathrm{cm}$",
      "$6\\mathrm{cm}$"
    ],
    "images": [
      "assets/images/20_매산고_1학기_기말_고2_수학I/q08.png"
    ],
    "answer": "③",
    "solution": "$\\triangle PAB$에서 $\\angle PAB=90^\\circ$, $\\angle ABP=30^\\circ$, $PA=4$이므로\n$\\tan30^\\circ=\\dfrac{PA}{AB}$,\n$AB=\\dfrac4{1/\\sqrt3}=4\\sqrt3$이다.\n$\\triangle PAC$에서도 $\\angle PAC=90^\\circ$, $\\angle ACP=45^\\circ$이므로 두 직각변이 같아 $AC=PA=4$이다.\n이제 $\\triangle ABC$에서 끼인각 $\\angle BAC=30^\\circ$이므로 코사인법칙을 쓰면\n$BC^2=AB^2+AC^2-2(AB)(AC)\\cos30^\\circ$\n$=(4\\sqrt3)^2+4^2-2(4\\sqrt3)(4)\\dfrac{\\sqrt3}{2}=48+16-48=16$이다.\n길이는 양수이므로 $BC=4$cm이고 정답은 ③이다."
  },
  {
    "id": 9,
    "questionNumber": 9,
    "questionType": "객관식",
    "content": "삼각형 $\\mathrm{ABC}$의 세 각 $\\mathrm{A, B, C}$에 대하여 대변의 길이를 각각 $a, b, c$라고 하자. 세 변의 길이 $a, b, c$에 대하여 $a, b, c$가 순서대로 등비수열을 이루고, 세 내각의 $\\mathrm{A, B, C}$에 대하여 $\\sin\\mathrm{A}, \\sin\\mathrm{B}, \\sin\\mathrm{C}$가 이 순서대로 등차수열을 이룰 때, 삼각형 $\\mathrm{ABC}$는 어떤 삼각형인지 구하면? [4.3점]",
    "choices": [
      "$\\angle\\mathrm{A}$가 직각인 직각삼각형",
      "$a=b$인 이등변 삼각형",
      "$\\angle\\mathrm{B}$가 직각인 직각삼각형",
      "$a=c$인 이등변 삼각형",
      "$\\angle\\mathrm{C}$가 직각인 직각삼각형"
    ],
    "images": [],
    "answer": "②,④",
    "solution": "사인법칙에 의해 $\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}=\\dfrac{c}{\\sin C}=2R$이므로 $\\sin A=\\dfrac{a}{2R}$, $\\sin B=\\dfrac{b}{2R}$, $\\sin C=\\dfrac{c}{2R}$이다.<br>$\\sin A,\\sin B,\\sin C$가 등차수열이므로 $2\\sin B=\\sin A+\\sin C$이다.<br>이를 대입하면 $\\dfrac{2b}{2R}=\\dfrac{a+c}{2R}$이고, $R>0$이므로 $2b=a+c$이다.<br>$a,b,c$가 순서대로 등비수열이므로 $b^2=ac$이다.<br>따라서 $(a-c)^2=(a+c)^2-4ac=(2b)^2-4b^2=0$이므로 $a=c$이다.<br>또한 $2b=a+c=2a$에서 $b=a$이다.<br>그러므로 $a=b=c$인 정삼각형이므로 ②와 ④가 모두 해당한다."
  },
  {
    "id": 10,
    "questionNumber": 10,
    "questionType": "객관식",
    "content": "자연수 $n$에 대하여 이차방정식 $x^2-2nx+2n-5=0$의 두 근을 $a_n, b_n$이라고 할 때, $\\sum_{k=1}^{4} (a_k^3+b_k^3)$의 값을 구하면? [4.5점]",
    "choices": [
      "$700$",
      "$710$",
      "$720$",
      "$730$",
      "$740$"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "이차방정식의 두 근의 합과 곱은 각각 $a_n+b_n=2n$, $a_nb_n=2n-5$이다.\n따라서 두 근의 세제곱의 합은\n$a_n^3+b_n^3=(a_n+b_n)^3-3a_nb_n(a_n+b_n)$\n$=(2n)^3-3(2n-5)(2n)=8n^3-12n^2+30n$이다.\n$n=1,2,3,4$일 때 이 값은 차례로 $26,76,198,440$이므로\n$\\sum_{k=1}^{4}(a_k^3+b_k^3)=26+76+198+440=740$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 11,
    "questionNumber": 11,
    "questionType": "객관식",
    "content": "다음은 모든 자연수 $n$에 대하여\n$$\\sum_{k=1}^{n} k^3 = \\left\\{\\frac{n(n+1)}{2}\\right\\}^2 \\cdots (*)$$\n이 성립함을 수학적 귀납법으로 증명한 것이다.\n<div class=\"exam-box\">(ⅰ) $n=1$일 때,<br>&nbsp;&nbsp;&nbsp;&nbsp;(좌변)$=1$<br>&nbsp;&nbsp;&nbsp;&nbsp;(우변)$=\\left\\{\\frac{1\\times 2}{2}\\right\\}^2 = 1$<br>&nbsp;&nbsp;&nbsp;&nbsp;이므로 성립한다.<br>(ⅱ) $n=k$일 때 $(*)$이 성립한다고 가정하면<br>&nbsp;&nbsp;&nbsp;&nbsp;$\\sum_{i=1}^{k+1} i^3 = \\fbox{ (가) } + (k+1)^3$<br>&nbsp;&nbsp;&nbsp;&nbsp;$= (k+1)^2 \\times \\fbox{ (나) }$<br>&nbsp;&nbsp;&nbsp;&nbsp;$= \\{\\fbox{ (다) }\\}^2$<br>&nbsp;&nbsp;&nbsp;&nbsp;이다.<br>&nbsp;&nbsp;&nbsp;&nbsp;따라서 $n=k+1$일 때도 $(*)$이 성립한다.<br>(ⅰ), (ⅱ)에 의하여 모든 자연수 $n$에 대하여 $(*)$이 성립한다.</div>\n위의 (가), (나), (다)에 알맞은 식을 각각 $f(k), g(k), h(k)$라고 할 때, $\\frac{5\\times f(5)}{g(3)\\times h(4)}$의 값은? [4.5점]",
    "choices": [
      "$10$",
      "$11$",
      "$12$",
      "$13$",
      "$14$"
    ],
    "images": [],
    "answer": "③",
    "solution": "귀납 가정에 따라 (가)는 $f(k)=\\left\\{\\dfrac{k(k+1)}2\\right\\}^2$이다.\n이어\n$f(k)+(k+1)^3=\\dfrac{k^2(k+1)^2}{4}+(k+1)^3$\n$=(k+1)^2\\left\\{\\dfrac{k^2}{4}+k+1\\right\\}$\n$=(k+1)^2\\dfrac{(k+2)^2}{4}$이므로 (나)는 $g(k)=\\dfrac{(k+2)^2}{4}$이다.\n마지막 식을 $\\left\\{\\dfrac{(k+1)(k+2)}2\\right\\}^2$로 쓰면 (다)는 $h(k)=\\dfrac{(k+1)(k+2)}2$이다.\n따라서 $f(5)=225$, $g(3)=\\dfrac{25}{4}$, $h(4)=15$이고\n$\\dfrac{5f(5)}{g(3)h(4)}=\\dfrac{5\\cdot225}{(25/4)\\cdot15}=12$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 12,
    "questionNumber": 12,
    "questionType": "객관식",
    "content": "수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 할 때, $(S_{n+1}-S_{n-1})^2 = 4a_n a_{n+1} + 4^n$ $(n=2, 3, 4, \\cdots)$이 성립한다. $a_3=4$일 때, $a_{10}$의 값은? (단, 모든 자연수 $n$에 대하여 $a_{n+1} > a_n$이다.) [4.8점]",
    "choices": [
      "$1020$",
      "$1022$",
      "$1024$",
      "$1026$",
      "$1028$"
    ],
    "images": [],
    "answer": "①",
    "solution": "$S_{n+1}-S_{n-1}=a_n+a_{n+1}$이므로 주어진 식은\n$(a_n+a_{n+1})^2=4a_na_{n+1}+4^n$이다.\n양변을 정리하면\n$(a_{n+1}-a_n)^2=4^n$이다.\n모든 자연수 $n$에 대하여 $a_{n+1}>a_n$이므로 양의 제곱근을 택해 $a_{n+1}-a_n=2^n$이다.\n$n=3,4,\\ldots,9$에서 이 차이를 더하면\n$a_{10}=a_3+(a_4-a_3)+\\cdots+(a_{10}-a_9)$\n$=4+(2^3+2^4+\\cdots+2^9)=4+(1024-8)=1020$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 13,
    "questionNumber": 13,
    "questionType": "객관식",
    "content": "아래 그림과 같이 $\\overline{\\mathrm{AC}}=10$인 삼각형 $\\mathrm{ABC}$에서 $\\angle\\mathrm{A}$의 이등분선이 변 $\\mathrm{BC}$와 만나는 점을 $\\mathrm{D}$라 하자. $\\angle\\mathrm{BAD}=\\theta$라고 두면 $\\cos\\theta = \\frac{4}{\\sqrt{30}}$이고, $\\Delta\\mathrm{ABD}$의 넓이를 $S_1$, $\\Delta\\mathrm{ACD}$의 넓이를 $S_2$라고 하면 $S_1 : S_2 = 3 : 5$이다. $\\overline{\\mathrm{AD}} : \\overline{\\mathrm{BD}} = \\sqrt{5} : \\sqrt{3}$일 때, $S_2$를 구하면? (단, $0 < \\theta < \\frac{\\pi}{2}$, $\\overline{\\mathrm{AB}} > \\overline{\\mathrm{AD}}$) [4.8점]<br><br><img src=\"assets/images/20_매산고_1학기_기말_고2_수학I/q13.png\" class=\"exam-img\">",
    "choices": [
      "$10\\sqrt{7}$",
      "$10\\sqrt{14}$",
      "$10\\sqrt{21}$",
      "$5\\sqrt{7}$",
      "$5\\sqrt{14}$"
    ],
    "images": [
      "assets/images/20_매산고_1학기_기말_고2_수학I/q13.png"
    ],
    "answer": "⑤",
    "solution": "넓이의 비 $S_1:S_2=3:5$에서 두 삼각형은 밑변이 각각 $BD,DC$이고 높이가 같으므로 $BD:DC=3:5$이다.\n각의 이등분선 정리에 따라 $AB:AC=BD:DC=3:5$이므로 $AC=10$에서 $AB=6$이다.\n$AD:BD=\\sqrt5:\\sqrt3$이므로 $AD=\\sqrt5t$, $BD=\\sqrt3t$라 두자.\n$\\triangle ABD$에 코사인법칙을 적용하고 $\\cos\\theta=4/\\sqrt{30}$을 대입하면\n$3t^2=6^2+5t^2-2\\cdot6\\cdot\\sqrt5t\\cdot\\dfrac4{\\sqrt{30}}$\n$3t^2=36+5t^2-8\\sqrt6t$,\n$t^2-4\\sqrt6t+18=0$이다.\n이를 인수분해하면 $(t-\\sqrt6)(t-3\\sqrt6)=0$이므로 $t=\\sqrt6$ 또는 $3\\sqrt6$이다.\n$AB>AD$ 조건에서 $6>\\sqrt5t$이어야 한다. $t=3\\sqrt6$이면 $AD=3\\sqrt{30}>6$이므로 제외하고, $t=\\sqrt6$이면 $AD=\\sqrt{30}<6$이므로 가능하다.\n따라서 $AD=\\sqrt{30}$이다. $0<\\theta<\\pi/2$이므로\n$\\sin\\theta=\\sqrt{1-\\cos^2\\theta}=\\sqrt{1-\\dfrac{16}{30}}=\\sqrt{\\dfrac7{15}}$.\n$S_1=\\dfrac12\\cdot6\\cdot\\sqrt{30}\\cdot\\sqrt{\\dfrac7{15}}=3\\sqrt{14}$이고 $S_1:S_2=3:5$이므로 $S_2=5\\sqrt{14}$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 14,
    "questionNumber": 14,
    "questionType": "객관식",
    "content": "아래 그림과 같이 $\\Delta\\mathrm{ABC}$에서 $\\overline{\\mathrm{BC}}$ 위의 한 점을 $\\mathrm{D}$라고 하면 $\\overline{\\mathrm{AB}}=5\\sqrt{6}$, $\\overline{\\mathrm{AC}}=10$, $\\overline{\\mathrm{AD}}=7\\sqrt{2}$, $\\angle\\mathrm{C}=60^\\circ$이다. 이때 모든 $\\overline{\\mathrm{BD}}$의 길이의 합을 구하면? [4.8점]<br><br><img src=\"assets/images/20_매산고_1학기_기말_고2_수학I/q14.png\" class=\"exam-img\">",
    "choices": [
      "$10\\sqrt{3}$",
      "$11\\sqrt{3}$",
      "$12\\sqrt{3}$",
      "$13\\sqrt{3}$",
      "$14\\sqrt{3}$"
    ],
    "images": [
      "assets/images/20_매산고_1학기_기말_고2_수학I/q14.png"
    ],
    "answer": "①",
    "solution": "$BC=x$라 하면 $\\triangle ABC$에서 코사인법칙에 따라\n$(5\\sqrt6)^2=10^2+x^2-2\\cdot10\\cdot x\\cos60^\\circ$,\n$150=100+x^2-10x$,\n$x^2-10x-50=0$이다.\n따라서 $BC=5+5\\sqrt3$이다(길이이므로 양의 근만 취한다).\n$CD=y$라 하면 $\\triangle ACD$에 코사인법칙을 적용하여\n$(7\\sqrt2)^2=10^2+y^2-2\\cdot10\\cdot y\\cos60^\\circ$,\n$98=100+y^2-10y$,\n$y^2-10y+2=0$이다.\n따라서 가능한 $CD$는 $5+\\sqrt{23}$, $5-\\sqrt{23}$이고, 두 값 모두 $0<CD<BC$라서 점 $D$가 선분 $BC$ 위에 놓인다.\n각 경우 $BD=BC-CD$이므로 모든 $BD$의 길이의 합은\n$2BC-\\{(5+\\sqrt{23})+(5-\\sqrt{23})\\}$\n$=2(5+5\\sqrt3)-10=10\\sqrt3$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 15,
    "questionNumber": 15,
    "questionType": "객관식",
    "content": "실수 $a$에 대하여 $a^{\\log_9 125}$이 $25^n$ $(n=1,2,3,\\cdots)$이 되도록 하는 $a$를 작은 수부터 순서대로 나열할 때, $k$번째 수를 $a_k$라 하자. 이 때, $\\sum_{k=1}^{20} \\log_3 a_k$의 값은? (단, $a>1$) [4.8점]",
    "choices": [
      "$280$",
      "$290$",
      "$300$",
      "$310$",
      "$320$"
    ],
    "images": [],
    "answer": "①",
    "solution": "$a>1$이므로 양변에 밑이 3인 로그를 취해도 된다.\n$a^{\\log_9 125}=25^n$에서\n$(\\log_3a)(\\log_9 125)=n\\log_3 25$이다.\n$\\log_9 125=\\dfrac{\\log_3 125}{\\log_3 9}=\\dfrac{3\\log_3 5}{2}$이고 $\\log_3 25=2\\log_3 5$이므로\n$(\\log_3a)\\dfrac{3\\log_3 5}{2}=2n\\log_3 5$,\n$\\log_3a=\\dfrac{4n}{3}$이다.\n$n=1,2,\\ldots$일 때 대응하는 $a=3^{4n/3}$는 $n$이 커질수록 커지므로 $k$번째 수는 $a_k=3^{4k/3}$이다.\n따라서 $\\sum_{k=1}^{20}\\log_3a_k=\\sum_{k=1}^{20}\\dfrac{4k}{3}=\\dfrac43\\cdot\\dfrac{20\\cdot21}{2}=280$이다.\n정답은 ①이다."
  },
  {
    "id": 16,
    "questionNumber": 16,
    "questionType": "단답형",
    "content": "[단답형1] 수열 $\\{a_n\\}$의 첫째항부터 제 $n$항까지의 합 $S_n$이 $S_n = 2n^2-5n+6$ 일 때, 일반항 $a_n$을 구하시오. [4점]",
    "choices": [],
    "images": [],
    "answer": "a_1=3,\\quad a_n=4n-7\\ (n\\ge 2)",
    "solution": "첫째항은 $a_1=S_1=2-5+6=3$이다.\n$n\\ge2$이면 $a_n=S_n-S_{n-1}$이고\n$S_{n-1}=2(n-1)^2-5(n-1)+6=2n^2-9n+13$이다.\n그러므로 $a_n=(2n^2-5n+6)-(2n^2-9n+13)=4n-7$이다.\n따라서 $a_1=3$, $a_n=4n-7\\;(n\\ge2)$이다."
  },
  {
    "id": 17,
    "questionNumber": 17,
    "questionType": "단답형",
    "content": "[단답형2] $\\pi < x < \\frac{3}{2}\\pi$ 에서 방정식 $3\\sin^2 x - \\sin x\\cos x - 1 = 0$ 을 만족하는 $x$에 대하여 $\\cos 2x - \\sin 2x$의 값을 구하시오. [5점]",
    "choices": [],
    "images": [],
    "answer": "-1",
    "solution": "주어진 범위 $\\pi<x<\\dfrac32\\pi$에서는 $\\cos x\\ne0$이고 $\\tan x>0$이다.\n주어진 식에서 $\\sin^2x+\\cos^2x=1$을 이용하면\n$3\\sin^2x-\\sin x\\cos x-(\\sin^2x+\\cos^2x)=0$,\n$2\\sin^2x-\\sin x\\cos x-\\cos^2x=0$이다.\n$\\cos^2x$로 나누면\n$2\\tan^2x-\\tan x-1=0$이다.\n$(2\\tan x+1)(\\tan x-1)=0$이고 $\\tan x>0$이므로 $\\tan x=1$이다.\n제3사분면에서 $\\tan x=1$인 각은 $x=\\dfrac{5\\pi}{4}$이다.\n따라서 $\\cos2x-\\sin2x=\\cos\\dfrac{5\\pi}{2}-\\sin\\dfrac{5\\pi}{2}=0-1=-1$이다."
  },
  {
    "id": 18,
    "questionNumber": 18,
    "questionType": "단답형",
    "content": "[단답형3] 아래 그림과 같이 주어진 다각형 $\\mathrm{ABCD}$의 넓이는 $a+b\\sqrt{3}+c\\sqrt{6}$이다. 이때, $a+b+c$의 값을 구하시오. (단, $a, b, c$는 유리수) [6점]<br><br><img src=\"assets/images/20_매산고_1학기_기말_고2_수학I/q18.png\" class=\"exam-img\">",
    "choices": [],
    "images": [
      "assets/images/20_매산고_1학기_기말_고2_수학I/q18.png"
    ],
    "answer": "19",
    "solution": "$\\overline{BF}\\perp\\overline{DC}$가 되도록 $B$에서 $DC$에 내린 수선의 발을 $F$라 하자.\n$\\triangle BCF$에서 $BC=8$, $\\angle BCF=\\angle BCD=30^\\circ$이므로\n$BF=8\\sin30^\\circ=4$, $FC=8\\cos30^\\circ=4\\sqrt3$이다.\n$DC=4(1+\\sqrt3)$이므로 $DF=DC-FC=4$이다. 따라서 직각삼각형 $BDF$는 두 직각변이 $4$인 이등변삼각형이고,\n$BD=4\\sqrt2$, $\\angle BDC=\\angle BDF=45^\\circ$이다.\n그림에서 $DB$가 $\\angle ADC$ 안쪽에 있으므로 $\\angle ADB=105^\\circ-45^\\circ=60^\\circ$이다.\n대각선 $BD$로 다각형을 두 삼각형 $BCD$, $ABD$로 나누면\n$[BCD]=\\dfrac12\\cdot8\\cdot4(1+\\sqrt3)\\sin30^\\circ=8+8\\sqrt3$,\n$[ABD]=\\dfrac12\\cdot3\\cdot4\\sqrt2\\sin60^\\circ=3\\sqrt6$이다.\n따라서 다각형의 넓이는 $8+8\\sqrt3+3\\sqrt6$이고, $a=8$, $b=8$, $c=3$이므로 $a+b+c=19$이다."
  },
  {
    "id": 19,
    "questionNumber": 19,
    "questionType": "서술형",
    "content": "[서술형1] 함수 $f : \\{x | 0 \\le x \\le 3\\} \\to \\{y | 0 \\le y \\le 3\\}$는 아래 그림과 같은 그래프 개형을 갖는다. $0 < x < 2\\pi$에서 방정식 $f(2\\cos x)-1=0$의 서로 다른 실근의 개수를 $\\alpha$라 하자. $0 < x < 2\\pi$에서 $2\\cos^2 x + \\sin x - 2 = k$가 서로 다른 $\\alpha$개의 실근을 갖도록 하는 $k$의 범위를 구하는 과정을 서술하시오. [10점]<br><br><img src=\"assets/images/20_매산고_1학기_기말_고2_수학I/q19.png\" class=\"exam-img\">",
    "choices": [],
    "images": [
      "assets/images/20_매산고_1학기_기말_고2_수학I/q19.png"
    ],
    "answer": "(-1,0)\\cup(0,\\frac{1}{8})",
    "solution": "$t=2\\cos x$라 두면 $0\\le t\\le2$일 때만 $f(t)$가 정의된다. 그래프의 첫 번째 봉우리에서 $f(t)=1$이 되는 두 값은 선분의 방정식으로 구한다.\n$(0,0)$과 $(1,3)$을 잇는 선분에서는 $f(t)=3t$이므로 $3t=1$에서 $t=\\dfrac13$이다.\n$(1,3)$과 $(2,\\dfrac12)$를 잇는 선분의 기울기는 $\\dfrac{1/2-3}{2-1}=-\\dfrac52$이므로 $f(t)=3-\\dfrac52(t-1)$이다. $f(t)=1$을 대입하면 $t=\\dfrac95$이다.\n그래프의 오른쪽 작은 봉우리에서 $f(t)=1$인 값은 모두 $t>2$이므로 $t=2\\cos x$의 범위와 맞지 않는다. 따라서 유효한 값은 $t=\\dfrac13,\\dfrac95$뿐이다. 각각 $\\cos x=\\dfrac16,\\dfrac9{10}$은 $0<x<2\\pi$에서 각각 두 근을 가지므로 $\\alpha=4$이다.\n다음 식은\n$2\\cos^2x+\\sin x-2=2(1-\\sin^2x)+\\sin x-2=-2\\sin^2x+\\sin x$로 정리된다.\n$u=\\sin x$라 하면 $-2u^2+u=k$, 즉 $2u^2-u+k=0$이고 두 근은 $u=\\dfrac{1\\pm\\sqrt{1-8k}}4$이다.\n서로 다른 두 $u$를 얻으려면 판별식이 양수여야 하므로 $k<\\dfrac18$이다. 두 근이 모두 $-1<u<1$에 있으려면 큰 근이 $1$보다 작아야 한다.\n$\\dfrac{1+\\sqrt{1-8k}}4<1$에서 $\\sqrt{1-8k}<3$, 즉 $k>-1$을 얻는다. 이때 작은 근도 $-1$보다 크다.\n단, $k=0$이면 두 근은 $u=0,\\dfrac12$이다. 열린 구간 $0<x<2\\pi$에서 $\\sin x=0$은 $x=\\pi$ 한 개뿐이고 $\\sin x=\\dfrac12$는 두 개이므로 서로 다른 근은 3개라서 제외한다.\n$k=-1$에서는 큰 근이 $u=1$이 되어 3개, $k=\\dfrac18$에서는 중근 $u=\\dfrac14$만 생겨 2개이므로 이 값들도 제외한다.\n따라서 구하는 범위는 $-1<k<0$ 또는 $0<k<\\dfrac18$이다."
  },
  {
    "id": 20,
    "questionNumber": 20,
    "questionType": "서술형",
    "content": "[서술형2] $p < q$를 만족하고 $0$이 아닌 두 정수 $p, q$와 두 수열 $\\{a_n\\}, \\{b_n\\}$에 대하여 $\\sum_{k=1}^n a_k = pn^2 + pn$, $\\sum_{k=1}^n b_k = qn^2 - pn + q$이고 $\\sum_{k=1}^n a_k b_k = -8n^3 - 10n^2 - 2n - 12$일 때, $p, q$를 각각 구하는 과정을 서술하시오. [10점]",
    "choices": [],
    "images": [],
    "answer": "p=-2,\\quad q=3",
    "solution": "첫째 수열의 부분합을 $A_n=pn^2+pn$이라 하면\n$a_1=A_1=2p$이고, $n\\ge2$에서 $a_n=A_n-A_{n-1}=2pn$이다. 따라서 모든 $n\\ge1$에 대해 $a_n=2pn$이다.\n둘째 부분합 $B_n=qn^2-pn+q$에서 $b_1=B_1=2q-p$이다. $n\\ge2$이면\n$b_n=B_n-B_{n-1}=q(2n-1)-p$이다.\n누적 곱의 합을 $T_n=\\sum_{k=1}^na_kb_k$라 하자. $n=1$일 때 주어진 식에서\n$2p(2q-p)=T_1=-8-10-2-12=-32$,\n$p(2q-p)=-16$이다.\n$n\\ge2$에서는 $a_nb_n=T_n-T_{n-1}$이다. 우변의 차는\n$T_n-T_{n-1}=(-8n^3-10n^2-2n-12)-[-8(n-1)^3-10(n-1)^2-2(n-1)-12]$\n$=-24n^2+4n$이다.\n한편 $a_nb_n=2pn\\{q(2n-1)-p\\}$이므로\n$2pn\\{q(2n-1)-p\\}=-24n^2+4n$.\n$2n$으로 나누면 $p\\{q(2n-1)-p\\}=-12n+2$이다. 양변에서 $n$의 계수와 상수항을 비교하여 $2pq=-12$, $-pq-p^2=2$를 얻는다.\n따라서 $pq=-6$이고 $p^2=4$이므로 $p=2$ 또는 $p=-2$이다. $p<q$이고 $pq=-6$을 만족하는 경우는 $p=-2$, $q=3$뿐이다.\n$n=1$ 조건도 $p(2q-p)=(-2)(6+2)=-16$으로 만족한다. 따라서 $p=-2$, $q=3$이다."
  }
];
