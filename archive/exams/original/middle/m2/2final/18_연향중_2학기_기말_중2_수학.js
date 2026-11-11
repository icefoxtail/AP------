window.examData = {
  "id": "18_연향중_2학기_기말_중2_수학",
  "title": "2018학년도 2학기 기말고사 [중2] 수학",
  "slug": "18_연향중_2학기_기말_중2_수학",
  "questions": [
    {
      "id": 1,
      "score": 3.5,
      "question": "다음 그림과 같은 평행사변형 $\\text{ABCD}$가 정사각형이 되는 조건으로 옳은 것은?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q1.png\" />",
      "choices": [
        "$\\angle\\text{ABC}=90^\\circ$, $\\overline{\\text{AO}}=\\overline{\\text{BO}}$",
        "$\\overline{\\text{AC}}=\\overline{\\text{BD}}$, $\\overline{\\text{CO}}=\\overline{\\text{DO}}$",
        "$\\angle\\text{BAO}=45^\\circ$, $\\overline{\\text{AO}}=\\overline{\\text{DO}}$",
        "$\\overline{\\text{AC}} \\perp \\overline{\\text{BD}}$, $\\overline{\\text{AB}}=\\overline{\\text{BC}}$",
        "$\\overline{\\text{AB}}=\\overline{\\text{AD}}$, $\\angle\\text{BAO}=\\angle\\text{DAO}$"
      ],
      "answer": "③",
      "solution": "정사각형은 직사각형이면서 마름모이어야 한다.\n평행사변형이 직사각형이 되려면 한 내각이 $90^\\circ$이거나 두 대각선의 길이가 같아야 하고, 마름모가 되려면 이웃하는 두 변의 길이가 같거나 두 대각선이 서로 수직이어야 한다.\n① 한 각이 $90^\\circ$, $\\overline{AO}=\\overline{BO}$ (대각선의 길이가 같음): 직사각형 조건만 있다.\n② 대각선의 길이가 같다: 직사각형 조건만 있다.\n③ $\\overline{AO}=\\overline{DO}$이면 $\\overline{AC}=\\overline{BD}$이므로 직사각형이다. 직사각형에서는 두 대각선이 서로 다른 것을 이등분하므로 $\\overline{AO}=\\overline{BO}$이고, $\\angle BAO=45^\\circ$이므로 $\\triangle ABO$에서 $\\angle ABO=\\angle BAO=45^\\circ$, $\\angle AOB=90^\\circ$이다. 두 대각선이 수직이므로 마름모이다. 따라서 정사각형이다.\n④ 대각선이 수직, 이웃하는 두 변이 같다: 마름모 조건만 있다.\n⑤ $\\overline{AB}=\\overline{AD}$이므로 마름모이고 $\\angle BAO=\\angle DAO$는 마름모에서 항상 성립한다. 직사각형 조건이 없다.\n정답은 ③이다."
    },
    {
      "id": 2,
      "score": 3.5,
      "question": "$\\triangle\\text{ABC}$와 $\\triangle\\text{DEF}$에서 $\\angle\\text{C}=\\angle\\text{F}=90^\\circ$일 때, 다음 중 $\\triangle\\text{ABC} \\equiv \\triangle\\text{DEF}$라 할 수 없는 것은?",
      "choices": [
        "$\\overline{\\text{AB}}=\\overline{\\text{DE}}$, $\\overline{\\text{BC}}=\\overline{\\text{EF}}$",
        "$\\overline{\\text{AB}}=\\overline{\\text{DE}}$, $\\angle\\text{B}=\\angle\\text{E}$",
        "$\\angle\\text{A}=\\angle\\text{D}$, $\\overline{\\text{AC}}=\\overline{\\text{DF}}$",
        "$\\overline{\\text{BC}}=\\overline{\\text{EF}}$, $\\angle\\text{B}=\\angle\\text{E}$",
        "$\\angle\\text{A}=\\angle\\text{D}$, $\\angle\\text{B}=\\angle\\text{E}$"
      ],
      "answer": "⑤",
      "solution": "두 직각삼각형의 합동 조건을 확인한다.\n① 빗변과 다른 한 변이 각각 같다(RHS 합동).\n② 빗변과 한 예각이 각각 같다(RHA 합동).\n③ $\\angle A=\\angle D$, $\\angle C=\\angle F=90^\\circ$이고 $\\overline{AC}=\\overline{DF}$이므로 한 변과 양 끝각이 같다(ASA 합동).\n④ $\\angle B=\\angle E$, $\\angle C=\\angle F=90^\\circ$이고 $\\overline{BC}=\\overline{EF}$이므로 ASA 합동이다.\n⑤ 세 각이 각각 같을 뿐 변의 길이가 같다는 조건이 없어 합동이라 할 수 없다. (닮음이다.)\n정답은 ⑤이다."
    },
    {
      "id": 3,
      "score": 4.0,
      "question": "다음 그림에서 $\\overline{\\text{DC}} // \\overline{\\text{AF}}$이고 $\\overline{\\text{BE}} : \\overline{\\text{EF}} = 2 : 3$이다. $\\triangle\\text{DBE}=8\\text{ cm}^2$일 때, $\\square\\text{ADEC}$의 넓이를 구하면?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q3.png\" />",
      "choices": [
        "$8\\text{cm}^2$",
        "$12\\text{cm}^2$",
        "$15\\text{cm}^2$",
        "$18\\text{cm}^2$",
        "$20\\text{cm}^2$"
      ],
      "answer": "②",
      "solution": "$\\overline{DC}//\\overline{AF}$이므로 $\\triangle ADC$와 $\\triangle DCF$는 밑변 $DC$가 공통이고 높이가 같아 넓이가 같다.\n따라서 $\\square ADEC=\\triangle ADC+\\triangle DEC=\\triangle DCF+\\triangle DEC=\\triangle DEF$이다.\n$\\triangle DBE$와 $\\triangle DEF$는 높이가 같으므로 넓이의 비는 밑변의 길이의 비와 같다.\n$\\triangle DBE:\\triangle DEF=\\overline{BE}:\\overline{EF}=2:3$\n$8:\\triangle DEF=2:3$이므로 $\\triangle DEF=12\\text{ cm}^2$이다.\n따라서 $\\square ADEC=12\\text{ cm}^2$이고 정답은 ②이다."
    },
    {
      "id": 4,
      "score": 4.0,
      "question": "다음 그림에서 점 $\\text{O}$는 $\\triangle\\text{ABC}$의 외심이다. $\\angle\\text{OBA}=50^\\circ$, $\\angle\\text{OCA}=30^\\circ$일 때, $\\angle x$의 크기를 구하면?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q4.png\" />",
      "choices": [
        "$50^\\circ$",
        "$60^\\circ$",
        "$65^\\circ$",
        "$70^\\circ$",
        "$75^\\circ$"
      ],
      "answer": "④",
      "solution": "점 $O$는 외심이므로 $\\overline{OA}=\\overline{OB}=\\overline{OC}$이다.\n$\\triangle OAB$에서 $\\angle OAB=\\angle OBA=50^\\circ$, $\\triangle OAC$에서 $\\angle OAC=\\angle OCA=30^\\circ$이다.\n그림에서 점 $O$는 변 $AC$의 바깥쪽에 있으므로 $\\angle BAC=50^\\circ-30^\\circ=20^\\circ$이다.\n$\\triangle OBC$에서 $\\overline{OB}=\\overline{OC}$이므로 $\\angle OCB=\\angle OBC=\\angle x$이다.\n그러면 $\\angle ABC=50^\\circ+\\angle x$, $\\angle ACB=\\angle x-30^\\circ$이다.\n$\\triangle ABC$의 내각의 합에서\n$20^\\circ+(50^\\circ+\\angle x)+(\\angle x-30^\\circ)=180^\\circ$\n$2\\angle x=140^\\circ$\n$\\angle x=70^\\circ$이고 정답은 ④이다."
    },
    {
      "id": 5,
      "score": 4.0,
      "question": "다음 그림과 같은 사각형 $\\text{ABCD}$에서 $\\overline{\\text{AE}}=\\overline{\\text{DE}}$일 때, $\\triangle\\text{AED}$의 넓이를 구하면?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q5.png\" />",
      "choices": [
        "$12\\text{ cm}^2$",
        "$15\\text{ cm}^2$",
        "$16\\text{ cm}^2$",
        "$17\\text{ cm}^2$",
        "$18\\text{ cm}^2$"
      ],
      "answer": "④",
      "solution": "$\\triangle ABE$와 $\\triangle ECD$에서 $\\overline{AE}=\\overline{ED}$, $\\angle B=\\angle C=90^\\circ$이다.\n$\\angle AED=90^\\circ$이므로 $\\angle AEB+\\angle CED=90^\\circ$이고, $\\angle AEB+\\angle BAE=90^\\circ$이므로 $\\angle BAE=\\angle CED$이다.\n따라서 $\\triangle ABE\\equiv\\triangle ECD$(RHA 합동)이므로 $\\overline{BE}=\\overline{CD}=5\\text{ cm}$, $\\overline{EC}=\\overline{AB}=3\\text{ cm}$이다.\n$\\overline{BC}=5+3=8\\text{ cm}$이므로 사다리꼴 $ABCD$의 넓이는\n$\\dfrac{1}{2}\\times(3+5)\\times8=32\\text{ cm}^2$\n$\\triangle ABE=\\triangle ECD=\\dfrac{1}{2}\\times3\\times5=\\dfrac{15}{2}\\text{ cm}^2$이므로\n$\\triangle AED=32-\\dfrac{15}{2}-\\dfrac{15}{2}=17\\text{ cm}^2$이다.\n정답은 ④이다."
    },
    {
      "id": 6,
      "score": 4.0,
      "question": "다음 그림에서 원 $\\text{I}$는 $\\triangle\\text{ABC}$의 내접원이다. $\\overline{\\text{AD}}=2\\text{cm}$, $\\overline{\\text{BD}}=4\\text{cm}$, $\\overline{\\text{BC}}=9\\text{cm}$일 때, $\\overline{\\text{AC}}$의 길이는?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q6.png\" />",
      "choices": [
        "$7\\text{ cm}$",
        "$7.4\\text{ cm}$",
        "$7.6\\text{ cm}$",
        "$8\\text{ cm}$",
        "$9\\text{ cm}$"
      ],
      "answer": "①",
      "solution": "내접원이 변에 접하는 점 $D,E,F$에서 한 꼭짓점에서 접점까지의 길이는 서로 같다.\n$\\overline{AF}=\\overline{AD}=2\\text{ cm}$, $\\overline{BE}=\\overline{BD}=4\\text{ cm}$이다.\n$\\overline{CF}=\\overline{CE}=\\overline{BC}-\\overline{BE}=9-4=5\\text{ cm}$이다.\n따라서 $\\overline{AC}=\\overline{AF}+\\overline{CF}=2+5=7\\text{ cm}$이다.\n정답은 ①이다."
    },
    {
      "id": 7,
      "score": 4.0,
      "question": "다음 그림과 같이 $\\overline{\\text{AB}}=\\overline{\\text{AC}}$인 이등변삼각형 $\\text{ABC}$에서 $\\angle\\text{B}$의 이등분선과 $\\angle\\text{C}$의 외각의 이등분선이 만나는 점을 $\\text{D}$라고 하면 $\\angle\\text{A}=44^\\circ$일 때, $\\angle\\text{BDC}$의 크기는?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q7.png\" />",
      "choices": [
        "$18^\\circ$",
        "$20^\\circ$",
        "$22^\\circ$",
        "$25^\\circ$",
        "$27^\\circ$"
      ],
      "answer": "③",
      "solution": "$\\overline{AB}=\\overline{AC}$이므로 $\\angle ABC=\\angle ACB=\\dfrac{180^\\circ-44^\\circ}{2}=68^\\circ$이다.\n$\\overline{BD}$는 $\\angle B$의 이등분선이므로 $\\angle DBC=34^\\circ$이다.\n$\\angle ACE=180^\\circ-68^\\circ=112^\\circ$이고 $\\overline{CD}$는 이 외각의 이등분선이므로 $\\angle DCE=56^\\circ$이다.\n$\\triangle DBC$에서 $\\angle DCE$는 $\\angle C$의 외각이므로 $\\angle DCE=\\angle DBC+\\angle BDC$이다.\n$56^\\circ=34^\\circ+\\angle BDC$이므로 $\\angle BDC=22^\\circ$이다.\n정답은 ③이다."
    },
    {
      "id": 8,
      "score": 4.0,
      "question": "다음 중에서 $\\square\\text{ABCD}$가 평행사변형이 되지 않는 것은?<br>(단, 점 $\\text{O}$는 두 대각선의 교점이다.)",
      "choices": [
        "$\\overline{\\text{AB}}=4\\text{cm}$, $\\overline{\\text{BC}}=5\\text{cm}$, $\\overline{\\text{CD}}=4\\text{cm}$, $\\overline{\\text{DA}}=5\\text{cm}$",
        "$\\angle\\text{A}=110^\\circ$, $\\angle\\text{B}=70^\\circ$, $\\angle\\text{C}=110^\\circ$, $\\angle\\text{D}=70^\\circ$",
        "$\\overline{\\text{OA}}=2\\text{cm}$, $\\overline{\\text{OB}}=3\\text{cm}$, $\\overline{\\text{OC}}=2\\text{cm}$, $\\overline{\\text{OD}}=3\\text{cm}$",
        "$\\overline{\\text{AD}} // \\overline{\\text{BC}}$, $\\overline{\\text{AB}}=7\\text{cm}$, $\\overline{\\text{BC}}=8\\text{cm}$, $\\overline{\\text{AD}}=8\\text{cm}$",
        "$\\overline{\\text{AB}} // \\overline{\\text{DC}}$, $\\overline{\\text{AB}}=5\\text{cm}$, $\\overline{\\text{BC}}=5\\text{cm}$, $\\overline{\\text{CD}}=6\\text{cm}$"
      ],
      "answer": "⑤",
      "solution": "① 두 쌍의 대변의 길이가 각각 같으므로 평행사변형이다.\n② 두 쌍의 대각의 크기가 각각 같으므로 평행사변형이다.\n③ 두 대각선이 서로 다른 것을 이등분하므로($\\overline{OA}=\\overline{OC}$, $\\overline{OB}=\\overline{OD}$) 평행사변형이다.\n④ 한 쌍의 대변이 평행하고 그 길이가 같으므로($\\overline{AD}//\\overline{BC}$, $\\overline{AD}=\\overline{BC}=8\\text{ cm}$) 평행사변형이다.\n⑤ $\\overline{AB}//\\overline{DC}$이지만 $\\overline{AB}=5\\text{ cm}$, $\\overline{CD}=6\\text{ cm}$로 평행한 대변의 길이가 다르다. 이 경우 사다리꼴이므로 평행사변형이 되지 않는다.\n정답은 ⑤이다."
    },
    {
      "id": 9,
      "score": 4.0,
      "question": "다음 그림과 같이 $\\overline{\\text{AD}} // \\overline{\\text{BC}}$인 사다리꼴에서 $\\overline{\\text{AB}}=\\overline{\\text{AD}}=\\overline{\\text{DC}}=\\frac{1}{2}\\overline{\\text{BC}}$일 때, $\\angle\\text{DAC}$의 크기는?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q9.png\" />",
      "choices": [
        "$25^\\circ$",
        "$30^\\circ$",
        "$35^\\circ$",
        "$40^\\circ$",
        "$45^\\circ$"
      ],
      "answer": "②",
      "solution": "$\\overline{BC}$의 중점을 $M$이라 하면 $\\overline{BM}=\\overline{MC}=\\dfrac{1}{2}\\overline{BC}=\\overline{AD}$이고 $\\overline{AD}//\\overline{BM}$이므로 $\\square ABMD$는 평행사변형이다.\n따라서 $\\overline{DM}=\\overline{AB}$이다. 조건에서 $\\overline{AB}=\\overline{DC}=\\overline{MC}$이므로 $\\overline{DM}=\\overline{DC}=\\overline{MC}$이다.\n즉 $\\triangle DMC$는 정삼각형이므로 $\\angle C=60^\\circ$이다.\n$\\overline{AD}//\\overline{BC}$이므로 $\\angle ADC=180^\\circ-60^\\circ=120^\\circ$이다.\n$\\triangle ADC$에서 $\\overline{AD}=\\overline{DC}$이므로 $\\angle DAC=\\dfrac{180^\\circ-120^\\circ}{2}=30^\\circ$이다.\n정답은 ②이다."
    },
    {
      "id": 10,
      "score": 4.0,
      "question": "다음 그림과 같은 마름모 $\\text{ABCD}$에서 두 대각선의 교점을 $\\text{O}$라 하고, $\\overline{\\text{BC}}=12\\text{cm}$, $\\overline{\\text{BE}}=\\overline{\\text{BF}}=8\\text{cm}$일 때, 대각선 $\\overline{\\text{BD}}$의 길이는?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q10.png\" />",
      "choices": [
        "$15\\text{cm}$",
        "$16\\text{cm}$",
        "$18\\text{cm}$",
        "$20\\text{cm}$",
        "$21\\text{cm}$"
      ],
      "answer": "④",
      "solution": "직선 $AF$가 $\\overline{BC}$와 만나는 점을 $G$라 하자.\n$\\triangle ABF$와 $\\triangle CBF$에서 $\\overline{AB}=\\overline{CB}$, $\\angle ABF=\\angle CBF$, $\\overline{BF}$는 공통이므로 합동(SAS)이고 $\\angle BAF=\\angle BCF$이다.\n$E,F,C$가 한 직선 위에 있으므로 $\\angle BCF=\\angle BCE$이다. 따라서 $\\angle BAG=\\angle BCE$이다.\n$\\triangle ABG$와 $\\triangle CBE$에서 $\\angle B$는 공통, $\\overline{AB}=\\overline{CB}$, $\\angle BAG=\\angle BCE$이므로 합동(ASA)이고 $\\overline{BG}=\\overline{BE}=8\\text{ cm}$이다.\n$\\overline{AD}//\\overline{BG}$이므로 $\\triangle FBG\\sim\\triangle FDA$(AA 닮음)이다.\n$\\overline{BF}:\\overline{DF}=\\overline{BG}:\\overline{DA}=8:12$이고 $\\overline{BF}=8$이므로 $\\overline{DF}=12\\text{ cm}$이다.\n따라서 $\\overline{BD}=\\overline{BF}+\\overline{DF}=8+12=20\\text{ cm}$이다.\n정답은 ④이다."
    },
    {
      "id": 11,
      "score": 4.5,
      "question": "다음 그림과 같이 $\\overline{\\text{AB}}=\\overline{\\text{AC}}$인 이등변삼각형 $\\text{ABC}$에서 점 $\\text{O}$와 점 $\\text{I}$는 각각 $\\triangle\\text{ABC}$의 외심과 내심이다. $\\angle\\text{A}=52^\\circ$일 때, $\\angle\\text{OBI}$의 크기는?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q11.png\" />",
      "choices": [
        "$6^\\circ$",
        "$8^\\circ$",
        "$10^\\circ$",
        "$12^\\circ$",
        "$15^\\circ$"
      ],
      "answer": "①",
      "solution": "$\\overline{AB}=\\overline{AC}$이므로 $\\angle ABC=\\angle ACB=\\dfrac{180^\\circ-52^\\circ}{2}=64^\\circ$이다.\n내심 $I$는 각의 이등분선의 교점이므로 $\\angle ABI=\\dfrac{1}{2}\\times64^\\circ=32^\\circ$이다.\n외심 $O$는 $\\overline{OA}=\\overline{OB}=\\overline{OC}$이므로 $\\triangle OAB\\equiv\\triangle OAC$(SSS 합동)이고 $\\angle OAB=\\dfrac{1}{2}\\angle A=26^\\circ$이다.\n$\\triangle OAB$는 $\\overline{OA}=\\overline{OB}$인 이등변삼각형이므로 $\\angle OBA=\\angle OAB=26^\\circ$이다.\n$\\angle OBI=\\angle ABI-\\angle OBA=32^\\circ-26^\\circ=6^\\circ$이다.\n정답은 ①이다."
    },
    {
      "id": 12,
      "score": 4.5,
      "question": "다음 그림과 같은 평행사변형 $\\text{ABCD}$에서 $\\overline{\\text{AE}}$ 위의 점 $\\text{P}$에 대하여 $\\overline{\\text{AP}} : \\overline{\\text{PE}} = 2 : 3$이고 $\\triangle\\text{PBC}=36\\text{ cm}^2$일 때, $\\triangle\\text{PAD}$의 넓이를 구하면?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q12.png\" />",
      "choices": [
        "$20\\text{ cm}^2$",
        "$24\\text{ cm}^2$",
        "$25\\text{ cm}^2$",
        "$28\\text{ cm}^2$",
        "$32\\text{ cm}^2$"
      ],
      "answer": "②",
      "solution": "$\\overline{AD}//\\overline{BC}$이므로 $\\overline{AE}$ 위의 점 $P$에서 $\\overline{AD}$까지의 거리와 $\\overline{BC}$까지의 거리의 비는 $\\overline{AP}:\\overline{PE}=2:3$이다.\n$\\triangle PAD$와 $\\triangle PBC$는 밑변의 길이가 $\\overline{AD}=\\overline{BC}$로 같으므로 넓이의 비는 높이의 비와 같다.\n$\\triangle PAD:\\triangle PBC=2:3$\n$\\triangle PAD:36=2:3$이므로 $\\triangle PAD=24\\text{ cm}^2$이다.\n정답은 ②이다."
    },
    {
      "id": 13,
      "score": 3.5,
      "question": "다음 그림과 같은 삼각형 $\\text{ABC}$, 삼각형 $\\text{DEF}$가 서로 닮음이라고 할 때, $x+y$의 값은?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q13.png\" />",
      "choices": [
        "48",
        "52",
        "64",
        "70",
        "74"
      ],
      "answer": "⑤",
      "solution": "$\\triangle ABC\\sim\\triangle DFE$이고 $\\angle A=\\angle D$, $\\angle B=\\angle F$, $\\angle C=\\angle E$가 대응한다. 길이가 주어진 변끼리 $\\overline{BC}$와 $\\overline{FE}$, $\\overline{AB}$와 $\\overline{DF}$가 대응해야 $x$를 구할 수 있기 때문이다.\n$\\overline{BC}$의 대각이 $\\angle A$, $\\overline{FE}$의 대각이 $\\angle D$이므로 $\\angle D=\\angle A=66^\\circ$이다.\n$\\triangle DEF$에서 $y=180-66-44=70$이다.\n닮음비는 $\\overline{BC}:\\overline{FE}=5:10=1:2$이다.\n$\\overline{AB}:\\overline{DF}=1:2$이므로 $x:8=1:2$, $x=4$이다.\n$x+y=4+70=74$이다.\n정답은 ⑤이다."
    },
    {
      "id": 14,
      "score": 4.0,
      "question": "다음 그림과 같은 두 평행사변형 $\\text{ABCD}$, $\\text{EFGH}$에 대하여 $\\square\\text{ABCD} \\sim \\square\\text{EFGH}$이고 그 닮음비가 $2:3$이라고 할 때, $\\square\\text{EFGH}$의 둘레의 길이는?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q14.png\" />",
      "choices": [
        "$18\\text{cm}$",
        "$26\\text{cm}$",
        "$30\\text{cm}$",
        "$36\\text{cm}$",
        "$52\\text{cm}$"
      ],
      "answer": "③",
      "solution": "$\\square ABCD\\sim\\square EFGH$이고 닮음비가 $2:3$이다.\n대응하는 변은 $\\overline{CD}$와 $\\overline{GH}$이므로 $\\overline{CD}:\\overline{GH}=2:3$이다. $\\overline{GH}=9\\text{ cm}$이므로 $\\overline{CD}=6\\text{ cm}$이다.\n평행사변형 $ABCD$의 둘레는 $2\\times(4+6)=20\\text{ cm}$이다.\n닮은 도형의 둘레의 비는 닮음비와 같으므로 $20:(\\square EFGH\\text{의 둘레})=2:3$이다.\n따라서 $\\square EFGH$의 둘레는 $30\\text{ cm}$이다.\n정답은 ③이다."
    },
    {
      "id": 15,
      "score": 4.0,
      "question": "다음 그림과 같이 정삼각형 모양의 색종이에서 꼭짓점 $\\text{A}$가 $\\overline{\\text{BC}}$ 위의 점 $\\text{D}$에 오도록 접었을 때, $\\overline{\\text{AF}}$의 길이는?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q15.png\" />",
      "choices": [
        "$10.2\\text{cm}$",
        "$10.6\\text{cm}$",
        "$11.2\\text{cm}$",
        "$11.8\\text{cm}$",
        "$12.4\\text{cm}$"
      ],
      "answer": "③",
      "solution": "그림에서 $\\overline{DE}=14\\text{ cm}$이다. 접은 부분은 겹쳐지므로 $\\overline{AE}=\\overline{DE}=14\\text{ cm}$, $\\overline{AF}=\\overline{DF}$이다.\n정삼각형의 한 변의 길이는 $\\overline{BC}=\\overline{AC}=\\overline{AE}+\\overline{EC}=14+10=24\\text{ cm}$이다.\n$\\overline{BD}=\\overline{BC}-\\overline{DC}=24-16=8\\text{ cm}$이다.\n$\\triangle FBD$와 $\\triangle DCE$에서 $\\angle B=\\angle C=60^\\circ$이다.\n$\\angle FDE=\\angle A=60^\\circ$이므로 $\\angle BDF+\\angle CDE=120^\\circ$이고, $\\triangle FBD$에서 $\\angle BDF+\\angle BFD=120^\\circ$이므로 $\\angle BFD=\\angle CDE$이다.\n따라서 $\\triangle FBD\\sim\\triangle DCE$(AA 닮음)이다.\n$\\overline{BD}:\\overline{CE}=\\overline{DF}:\\overline{ED}$에서 $8:10=\\overline{DF}:14$이므로 $\\overline{DF}=\\dfrac{8\\times14}{10}=11.2\\text{ cm}$이다.\n$\\overline{AF}=\\overline{DF}=11.2\\text{ cm}$이고 정답은 ③이다."
    },
    {
      "id": 16,
      "score": 4.0,
      "question": "다음 그림에서 $x$의 값은?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q16.png\" />",
      "choices": [
        "$11\\text{cm}$",
        "$12\\text{cm}$",
        "$13\\text{cm}$",
        "$14\\text{cm}$",
        "$15\\text{cm}$"
      ],
      "answer": "⑤",
      "solution": "$\\overline{BD}=\\overline{BC}-\\overline{DC}=18-10=8\\text{ cm}$이다.\n$\\triangle BAD$와 $\\triangle BCA$에서 $\\angle B$는 공통이고\n$\\overline{BA}:\\overline{BC}=12:18=2:3$, $\\overline{BD}:\\overline{BA}=8:12=2:3$이다.\n두 쌍의 변의 길이의 비가 같고 그 끼인각이 같으므로 $\\triangle BAD\\sim\\triangle BCA$(SAS 닮음)이고 닮음비는 $2:3$이다.\n$\\overline{AD}:\\overline{CA}=2:3$에서 $10:x=2:3$이므로 $x=15\\text{ cm}$이다.\n정답은 ⑤이다."
    },
    {
      "id": 17,
      "score": 4.0,
      "question": "다음 그림과 같이 $\\triangle\\text{ABC}$의 꼭짓점 $\\text{B}$, $\\text{C}$에서 $\\overline{\\text{AC}}$, $\\overline{\\text{AB}}$에 내린 수선의 발을 각각 $\\text{E}$, $\\text{D}$라고 하고, $\\overline{\\text{AD}}=3\\text{cm}$, $\\overline{\\text{AC}}=12\\text{cm}$, $\\overline{\\text{EC}}=8\\text{cm}$일 때, $\\overline{\\text{BD}}$의 길이는?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q17.png\" />",
      "choices": [
        "$12\\text{cm}$",
        "$13\\text{cm}$",
        "$14\\text{cm}$",
        "$15\\text{cm}$",
        "$16\\text{cm}$"
      ],
      "answer": "②",
      "solution": "그림에서 $D$는 $\\overline{AB}$ 위, $E$는 $\\overline{AC}$ 위에 있고 $\\overline{CD}\\perp\\overline{AB}$, $\\overline{BE}\\perp\\overline{AC}$이다.\n$\\overline{AE}=\\overline{AC}-\\overline{EC}=12-8=4\\text{ cm}$이다.\n$\\triangle ADC$와 $\\triangle AEB$에서 $\\angle A$는 공통이고 $\\angle ADC=\\angle AEB=90^\\circ$이므로 $\\triangle ADC\\sim\\triangle AEB$(AA 닮음)이다.\n$\\overline{AD}:\\overline{AE}=\\overline{AC}:\\overline{AB}$에서 $3:4=12:\\overline{AB}$이므로 $\\overline{AB}=16\\text{ cm}$이다.\n따라서 $\\overline{BD}=\\overline{AB}-\\overline{AD}=16-3=13\\text{ cm}$이다.\n정답은 ②이다."
    },
    {
      "id": 18,
      "score": 4.0,
      "question": "다음 그림에서 $\\overline{\\text{PQ}}$의 길이는?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q18.png\" />",
      "choices": [
        "$1\\text{cm}$",
        "$2\\text{cm}$",
        "$3\\text{cm}$",
        "$4\\text{cm}$",
        "$5\\text{cm}$"
      ],
      "answer": "④",
      "solution": "$\\overline{AB}//\\overline{DC}$이므로 $\\triangle PAB\\sim\\triangle PCD$(AA 닮음)이고 닮음비는 $\\overline{AB}:\\overline{CD}=6:12=1:2$이다.\n따라서 $\\overline{BP}:\\overline{PD}=1:2$이고 $\\overline{BP}:\\overline{BD}=1:3$이다.\n$\\overline{PQ}//\\overline{DC}$이므로 $\\triangle BQP\\sim\\triangle BCD$(AA 닮음)이다.\n$\\overline{PQ}:\\overline{DC}=\\overline{BP}:\\overline{BD}=1:3$이므로 $\\overline{PQ}=\\dfrac{1}{3}\\times12=4\\text{ cm}$이다.\n정답은 ④이다."
    },
    {
      "id": 19,
      "score": 4.0,
      "question": "다음 직사각형 $\\text{ABCD}$의 꼭짓점 $\\text{B}$, $\\text{D}$에서 대각선 $\\overline{\\text{AC}}$에 내린 수선의 발을 각각 $\\text{E}$, $\\text{F}$라고 할 때, $\\overline{\\text{EF}}$의 길이는?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q19.png\" />",
      "choices": [
        "$2.8\\text{cm}$",
        "$3.2\\text{cm}$",
        "$3.6\\text{cm}$",
        "$4\\text{cm}$",
        "$4.4\\text{cm}$"
      ],
      "answer": "①",
      "solution": "$\\overline{AD}=8\\text{ cm}$, $\\overline{CD}=\\overline{AB}=6\\text{ cm}$, $\\overline{AC}=10\\text{ cm}$이다.\n$\\triangle AFD$와 $\\triangle ADC$에서 $\\angle A$는 공통이고 $\\angle AFD=\\angle ADC=90^\\circ$이므로 닮음(AA)이다.\n$\\overline{AF}:\\overline{AD}=\\overline{AD}:\\overline{AC}$에서 $\\overline{AF}=\\dfrac{8^2}{10}=6.4\\text{ cm}$이다.\n같은 방법으로 $\\triangle AEB\\sim\\triangle ABC$이므로 $\\overline{AE}:\\overline{AB}=\\overline{AB}:\\overline{AC}$에서 $\\overline{AE}=\\dfrac{6^2}{10}=3.6\\text{ cm}$이다.\n따라서 $\\overline{EF}=\\overline{AF}-\\overline{AE}=6.4-3.6=2.8\\text{ cm}$이다.\n정답은 ①이다."
    },
    {
      "id": 20,
      "score": 4.5,
      "question": "다음 그림과 같은 직각삼각형 $\\text{ABC}$에 대해, $\\text{D}$는 $\\text{A}$에서 내린 수선의 발이고, $\\text{E}$는 $\\overline{\\text{BD}}=\\overline{\\text{DE}}$가 되도록 $\\overline{\\text{CD}}$ 위에 그린 점이다. 또, $\\text{F}$는 $\\overline{\\text{AC}}$와 $\\overline{\\text{FE}}$가 평행하도록 $\\overline{\\text{AD}}$ 위에 그린 점이라고 할 때, $\\frac{\\overline{\\text{BD}}}{\\overline{\\text{FE}}}$의 값은?<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q20.png\" />",
      "choices": [
        "$\\frac{4}{5}$",
        "$\\frac{9}{4}$",
        "$\\frac{9}{5}$",
        "$\\frac{5}{9}$",
        "$\\frac{4}{9}$"
      ],
      "answer": "①",
      "solution": "$\\overline{AB}=3$, $\\overline{AC}=4$, $\\overline{BC}=5$이고 $3^2+4^2=5^2$이므로 $\\angle A=90^\\circ$이다.\n$\\triangle ABD$와 $\\triangle CBA$에서 $\\angle B$는 공통, $\\angle ADB=\\angle CAB=90^\\circ$이므로 닮음(AA)이다.\n$\\overline{BD}:\\overline{BA}=\\overline{BA}:\\overline{BC}$에서 $\\overline{BD}=\\dfrac{3^2}{5}=\\dfrac{9}{5}$이다.\n$\\overline{DE}=\\overline{BD}=\\dfrac{9}{5}$, $\\overline{DC}=5-\\dfrac{9}{5}=\\dfrac{16}{5}$이다.\n$\\overline{FE}//\\overline{AC}$이므로 $\\triangle DFE\\sim\\triangle DAC$(AA 닮음)이다.\n$\\overline{FE}:\\overline{AC}=\\overline{DE}:\\overline{DC}$에서 $\\overline{FE}=4\\times\\dfrac{9}{5}\\div\\dfrac{16}{5}=\\dfrac{9}{4}$이다.\n$\\dfrac{\\overline{BD}}{\\overline{FE}}=\\dfrac{9}{5}\\div\\dfrac{9}{4}=\\dfrac{4}{5}$이다.\n정답은 ①이다."
    },
    {
      "id": 21,
      "score": 5.0,
      "question": "【 서술형 1 】 다음 그림과 같이 $\\overline{\\text{AC}}=\\overline{\\text{AE}}$, $\\overline{\\text{AB}} \\perp \\overline{\\text{DE}}$인 직각삼각형 $\\text{ABC}$에서 $\\overline{\\text{AB}}=17\\text{ cm}$, $\\overline{\\text{BC}}=15\\text{ cm}$, $\\overline{\\text{AC}}=8\\text{ cm}$일 때, 물음에 답하여라.<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q21.png\" /><br>(1) $\\triangle\\text{AED} \\equiv \\triangle\\text{ACD}$임을 설명하여라. [2점]<br>(2) $\\triangle\\text{BDE}$의 둘레의 길이를 구하여라. [3점]",
      "choices": [],
      "answer": "(1) RHS 합동 (2) $24\\text{ cm}$",
      "solution": "(1) $\\triangle AED$와 $\\triangle ACD$에서\n$\\angle AED=\\angle ACD=90^\\circ$ (…①)\n$\\overline{AD}$는 공통 (…②)\n$\\overline{AE}=\\overline{AC}$ (…③)\n①, ②, ③에서 직각삼각형의 빗변과 다른 한 변의 길이가 각각 같으므로 $\\triangle AED\\equiv\\triangle ACD$(RHS 합동)이다.\n\n(2) $\\overline{BE}=\\overline{AB}-\\overline{AE}=17-8=9\\text{ cm}$이다.\n(1)에서 $\\triangle AED\\equiv\\triangle ACD$이므로 $\\overline{DE}=\\overline{DC}$이다.\n따라서 $\\triangle BDE$의 둘레의 길이는\n$\\overline{BE}+\\overline{BD}+\\overline{DE}=\\overline{BE}+\\overline{BD}+\\overline{DC}=\\overline{BE}+\\overline{BC}=9+15=24\\text{ cm}$이다."
    },
    {
      "id": 22,
      "score": 5.0,
      "question": "【 서술형 2 】 다음 그림과 같은 직각삼각형 $\\text{ABC}$에서 $\\overline{\\text{AB}}=10\\text{ cm}$, $\\overline{\\text{BC}}=6\\text{ cm}$, $\\overline{\\text{CA}}=8\\text{ cm}$일 때, 외접원과 내접원의 넓이의 차를 구하여라.<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q22.png\" />",
      "choices": [],
      "answer": "$21\\pi\\text{ cm}^2$",
      "solution": "직각삼각형의 외심은 빗변의 중점이므로 외접원의 반지름은 빗변의 절반인 $\\dfrac{10}{2}=5\\text{ cm}$이다.\n외접원의 넓이는 $\\pi\\times5^2=25\\pi\\text{ cm}^2$이다.\n내접원의 반지름을 $r$라 하면 $\\triangle ABC$의 넓이는 $\\dfrac{1}{2}\\times6\\times8=24\\text{ cm}^2$이고, 내접원을 이용해 나타내면 $\\dfrac{1}{2}r(6+8+10)=12r$이다.\n$12r=24$이므로 $r=2\\text{ cm}$이고 내접원의 넓이는 $\\pi\\times2^2=4\\pi\\text{ cm}^2$이다.\n따라서 두 원의 넓이의 차는 $25\\pi-4\\pi=21\\pi\\text{ cm}^2$이다."
    },
    {
      "id": 23,
      "score": 5.0,
      "question": "【 서술형 3 】 다음 그림에서 $\\angle\\text{ABD}=\\angle\\text{ACB}$일 때, 닮음의 성질을 이용하여 $x$의 값을 구하여라.<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q23.png\" />",
      "choices": [],
      "answer": "$\\dfrac{14}{3}\\text{ cm}$",
      "solution": "$\\triangle ABD$와 $\\triangle ACB$에서 $\\angle A$는 공통이고 $\\angle ABD=\\angle ACB$이므로 $\\triangle ABD\\sim\\triangle ACB$(AA 닮음)이다.\n대응하는 변의 길이의 비가 같으므로 $\\overline{AB}:\\overline{AC}=\\overline{AD}:\\overline{AB}$이다.\n$\\overline{AC}=6+x$이므로 $8:(6+x)=6:8$\n$6(6+x)=64$\n$6+x=\\dfrac{32}{3}$\n$x=\\dfrac{32}{3}-6=\\dfrac{14}{3}$이다."
    },
    {
      "id": 24,
      "score": 5.0,
      "question": "【 서술형 4 】 다음 그림에서 $\\overline{\\text{AB}} // \\overline{\\text{DE}}$일 때 $x$를 구하여라.<br><img src=\"assets/images/18_연향중_2학기_기말_중2_수학/asset_q24.png\" />",
      "choices": [],
      "answer": "$10\\text{ cm}$",
      "solution": "$\\overline{AB}//\\overline{DE}$이므로 엇각의 크기가 같아 $\\angle BAC=\\angle DEC$, $\\angle ABC=\\angle EDC$이다.\n따라서 $\\triangle ABC\\sim\\triangle EDC$(AA 닮음)이다.\n대응하는 변의 길이의 비가 같으므로 $\\overline{AB}:\\overline{ED}=\\overline{AC}:\\overline{EC}$이다.\n$15:x=9:6$\n$9x=90$\n$x=10\\text{ cm}$이다."
    }
  ]
};
