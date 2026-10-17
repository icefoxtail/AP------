window.examTitle = "21_매산고_1학기_중간_고2_수학II";

window.questionBank = [
  {
    "id": 1,
    "questionType": "객관식",
    "content": "극한값 $\\lim_{x\\to1}(x^2-3x+8)$을 구하면? [4.0점]",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "②",
    "solution": "다항함수는 모든 실수에서 연속이므로 $x=1$을 그대로 대입한다.\n$\\lim_{x\\to1}(x^2-3x+8)=1^2-3\\cdot1+8=1-3+8=6$.\n따라서 정답은 ②이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "함수의 극한과 연속",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "함수의 극한과 연속",
    "originalCategory": "함수의 극한과 연속"
  },
  {
    "id": 2,
    "questionType": "객관식",
    "content": "곡선 $y=x^3+2x+2$ 위의 점 $(1,5)$에서의 접선의 기울기를 구하면? [4.0점]",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "④",
    "solution": "접선의 기울기는 해당 점의 $x$좌표에서의 미분계수이다.\n$y=x^3+2x+2$를 미분하면 $y\\prime=3x^2+2$이다.\n$x=1$을 대입하여 $y\\prime(1)=3\\cdot1^2+2=5$.\n따라서 정답은 ④이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "미분계수와 도함수",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "미분계수와 도함수",
    "originalCategory": "미분계수와 도함수"
  },
  {
    "id": 3,
    "questionType": "객관식",
    "content": "닫힌구간 $[-1,3]$에서 함수 $f(x)=x^2+2x+3$의 최댓값을 $a$, 최솟값을 $b$라 할 때 $a+b$를 구하면? [4.0점]",
    "choices": [
      "12",
      "14",
      "16",
      "18",
      "20"
    ],
    "answer": "⑤",
    "solution": "$f(x)=x^2+2x+3=(x+1)^2+2$로 완전제곱식을 만든다.\n구간 $[-1,3]$에서 $(x+1)^2$은 $x=-1$에서 $0$, $x=3$에서 $16$이다.\n따라서 최솟값은 $b=f(-1)=2$, 최댓값은 $a=f(3)=16+2=18$이다.\n$a+b=18+2=20$이므로 정답은 ⑤이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "도함수의 활용",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "도함수의 활용",
    "originalCategory": "도함수의 활용"
  },
  {
    "id": 4,
    "questionType": "객관식",
    "content": "다음 함수 $f(x)$가 $x=3$에서 연속이 되도록 하는 상수 $a,b$에 대하여 $|a+b|$의 값을 구하면? $$f(x)=\\begin{cases}\\frac{x^2+a}{x-3}&(x\\ne3)\\\\b&(x=3)\\end{cases}$$ [4.0점]",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "②",
    "solution": "연속이 되려면 $x=3$에서의 극한값이 존재하고, 그 값이 함수값 $f(3)=b$와 같아야 한다.\n먼저 $x\\to3$에서 분모 $x-3$은 $0$으로 간다. 극한이 유한하려면 분자도 $0$으로 가야 하므로\n$3^2+a=0$\n$9+a=0$\n$a=-9$이다.\n이 값을 대입하면 $x\\neq3$에서\n$f(x)=\\dfrac{x^2-9}{x-3}$\n$=\\dfrac{(x-3)(x+3)}{x-3}$\n$=x+3$이다.\n여기서 $x-3$으로 약분한 식은 $x\\neq3$일 때만 같지만, 극한값을 구할 때에는 충분하다.\n따라서 $\\lim_{x\\to3}f(x)=\\lim_{x\\to3}(x+3)=6$이다.\n연속 조건 $f(3)=\\lim_{x\\to3}f(x)$에서 $b=6$이다.\n$|a+b|=|-9+6|=|-3|=3$이므로 정답은 ②이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "함수의 극한과 연속",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "함수의 극한과 연속",
    "originalCategory": "함수의 극한과 연속"
  },
  {
    "id": 5,
    "questionType": "객관식",
    "content": "극한값 $\\lim_{x\\to\\infty}\\frac{\\sqrt{4x^2+2x-2}}{x-3}$을 구하면? [4.1점]",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "①",
    "solution": "$x\\to\\infty$에서 $x>0$이므로 $\\sqrt{x^2}=x$로 묶는다.\n$\\frac{\\sqrt{4x^2+2x-2}}{x-3}=\\frac{x\\sqrt{4+\\frac2x-\\frac2{x^2}}}{x(1-\\frac3x)}=\\frac{\\sqrt{4+\\frac2x-\\frac2{x^2}}}{1-\\frac3x}$.\n$x\\to\\infty$이면 분자 안의 분수항과 분모의 $3/x$가 모두 $0$으로 가므로 극한값은 $\\frac{\\sqrt4}{1}=2$.\n따라서 정답은 ①이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "함수의 극한과 연속",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "함수의 극한과 연속",
    "originalCategory": "함수의 극한과 연속",
    "sourceMode": "ORIGINAL",
    "provenance": {
        "originalSource": "2021_매산고2_수2_1중간.pdf p1 q5",
        "originalDriveFileId": "1T1y4PyQuPxR_CuFmt_VS3quwjVo2V2xG",
        "originalSourceSha256": "17b4421d6e0fd0b073d91a38b56fc327c2e29d0943cd6ca2a2de5c976a4d068b",
        "pinnedInputJsGitBlob": "a3f48fd1b954dfc81a8bf1d27d6368e126cca1cd",
        "pinnedInputJsGitRef": "64f0ebdeeddb10d5731528f35181ed1e8338e404",
        "sourceModeReason": "SOURCE_EXACT_TRANSCRIPTION_RESTORED_FROM_PDF_NOT_GENERATED",
        "pinnedJsBefore": "\\sqrt{4x^2+2x}-2",
        "sourcePdfAfter": "\\sqrt{4x^2+2x-2}",
        "repairHistory": "-2는 루트 밖의 감산항이 아니라 루트 안의 피개방정식 상수항. 원본 PDF q05 수식과 일치하게 전사 복원.",
        "contentModifiedInThisMasterRun": false,
        "sourceComparison": "PDF_PAGE_RENDER_VISUALLY_CONFIRMED_20261017"
    }
  },
  {
    "id": 6,
    "questionType": "객관식",
    "content": "함수 $f(x)=(x^3+1)(2x-1)$에 대하여 $f\\prime(1)$의 값을 구하면? [4.1점]",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "③",
    "solution": "두 다항식의 곱이므로 곱의 미분법을 사용한다.\n$f\\prime(x)=3x^2(2x-1)+(x^3+1)\\cdot2$.\n$x=1$에서 $f\\prime(1)=3\\cdot1^2(2-1)+(1+1)\\cdot2=3+4=7$.\n따라서 정답은 ③이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "미분계수와 도함수",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "미분계수와 도함수",
    "originalCategory": "미분계수와 도함수",
    "sourceMode": "ORIGINAL",
    "provenance": {
        "originalSource": "2021_매산고2_수2_1중간.pdf p1 q6",
        "originalDriveFileId": "1T1y4PyQuPxR_CuFmt_VS3quwjVo2V2xG",
        "originalSourceSha256": "17b4421d6e0fd0b073d91a38b56fc327c2e29d0943cd6ca2a2de5c976a4d068b",
        "pinnedInputJsGitBlob": "a3f48fd1b954dfc81a8bf1d27d6368e126cca1cd",
        "pinnedInputJsGitRef": "64f0ebdeeddb10d5731528f35181ed1e8338e404",
        "sourceModeReason": "SOURCE_EXACT_TRANSCRIPTION_RESTORED_FROM_PDF_NOT_GENERATED",
        "pinnedJsBefore": "f'",
        "sourcePdfAfter": "f'(1)",
        "repairHistory": "기존 JS는 미분한 함수만 묻는 것으로 누락. 원본 PDF q06은 f′(1)의 값을 요구.",
        "contentModifiedInThisMasterRun": false,
        "sourceComparison": "PDF_PAGE_RENDER_VISUALLY_CONFIRMED_20261017"
    }
  },
  {
    "id": 7,
    "questionType": "객관식",
    "content": "다음 중 $x=1$에서 연속이지만 미분가능하지 않은 함수는? (단, $[x]$는 $x$보다 크지 않은 최대의 정수이다.) [4.3점]",
    "choices": [
      "$f(x)=x^3-1$",
      "$f(x)=|x^2-1|$",
      "$f(x)=[x-1]$",
      "$f(x)=|x-1|^2$",
      "$f(x)=\\frac{x^2-x}{|x-1|}$"
    ],
    "answer": "②",
    "solution": "연속이면서 미분가능하지 않으려면 함수값과 좌우 극한은 같지만, 왼쪽 기울기와 오른쪽 기울기가 달라야 한다.\n① $x^3-1$은 다항함수이므로 모든 실수에서 미분가능하다.\n② $|x^2-1|$은 $x=1$에서 $0$이고, 양쪽에서 $0$으로 가까워지므로 연속이다.\n$x^2-1=(x-1)(x+1)$이고 $x=1$ 근방에서는 $x+1>0$이다.\n따라서 $x<1$이면 $|x^2-1|=-(x^2-1)$, $x>1$이면 $|x^2-1|=x^2-1$이다.\n왼쪽 미분계수는 $\\lim_{h\\to0^-}\\dfrac{|(1+h)^2-1|-0}{h}=\\lim_{h\\to0^-}(-2-h)=-2$이다.\n오른쪽 미분계수는 $\\lim_{h\\to0^+}\\dfrac{|(1+h)^2-1|-0}{h}=\\lim_{h\\to0^+}(2+h)=2$이다.\n두 값이 다르므로 ②는 연속이지만 미분가능하지 않다.\n③ $[x-1]$은 $x\\to1^-$에서 $-1$로 가지만 $x=1$에서는 $0$이므로 불연속이다.\n④ $|x-1|^2=(x-1)^2$이므로 미분가능하다.\n⑤ $x\\neq1$에서 $\\dfrac{x^2-x}{|x-1|}=x\\dfrac{x-1}{|x-1|}$이다. $x\\to1^-$이면 $-1$, $x\\to1^+$이면 $1$로 가므로 연속이 아니다.\n따라서 정답은 ②이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "미분가능성과 연속",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "미분가능성과 연속",
    "originalCategory": "미분가능성과 연속"
  },
  {
    "id": 8,
    "questionType": "객관식",
    "content": "함수 $f(x)=x^2-6x$에서 $x$의 값이 $-1$에서 $4$까지 변할 때의 평균변화율과 $x=a$에서의 미분계수가 같을 때, 상수 $a$의 값을 구하면? [4.3점]",
    "choices": [
      "1",
      "$\\frac32$",
      "2",
      "$\\frac52$",
      "3"
    ],
    "answer": "②",
    "solution": "평균변화율은 $\\frac{f(4)-f(-1)}{4-(-1)}$이다.\n$f(4)=16-24=-8$, $f(-1)=1+6=7$이므로 평균변화율은 $\\frac{-8-7}{5}=\\frac{-15}{5}=-3$.\n$f\\prime(x)=2x-6$이므로 $f\\prime(a)=2a-6=-3$.\n$2a=3$, $a=\\frac32$. 따라서 정답은 ②이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "미분계수와 도함수",
    "level": "하",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "미분계수와 도함수",
    "originalCategory": "미분계수와 도함수"
  },
  {
    "id": 9,
    "questionType": "객관식",
    "content": "임의의 양수 $x$에 대하여 $x+1<f(x)<x+3$을 만족할 때 $\\lim_{x\\to\\infty}\\frac{\\{2f(x)\\}^2}{4x^2+1}$의 값을 구하면? [4.3점]",
    "choices": [
      "-2",
      "-1",
      "0",
      "1",
      "2"
    ],
    "answer": "④",
    "solution": "주어진 부등식은 $x>0$인 모든 값에서 성립한다.\n$x+1<f(x)<x+3$이고 $x+1>0$이므로 세 항이 모두 양수이다. 따라서 부등호 방향을 바꾸지 않고 제곱할 수 있다.\n$(x+1)^2<\\{f(x)\\}^2<(x+3)^2$.\n구하려는 식의 분모 $4x^2+1$도 양수이므로 각 항에 $\\dfrac4{4x^2+1}$을 곱하면\n$\\dfrac{4(x+1)^2}{4x^2+1}<\\dfrac{\\{2f(x)\\}^2}{4x^2+1}<\\dfrac{4(x+3)^2}{4x^2+1}$이다.\n이제 양끝 식의 분자와 분모를 $x^2$로 나눈다. $x\\to\\infty$이므로 $x\\neq0$이다.\n$\\dfrac{4(x+1)^2}{4x^2+1}=\\dfrac{4(1+1/x)^2}{4+1/x^2}\\longrightarrow\\dfrac{4\\cdot1^2}{4}=1$,\n$\\dfrac{4(x+3)^2}{4x^2+1}=\\dfrac{4(1+3/x)^2}{4+1/x^2}\\longrightarrow\\dfrac{4\\cdot1^2}{4}=1$.\n양끝의 극한값이 모두 $1$이므로 샌드위치 정리에 의해 그 사이에 있는 식의 극한값도 $1$이다.\n따라서 정답은 ④이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "함수의 극한과 연속",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "함수의 극한과 연속",
    "originalCategory": "함수의 극한과 연속"
  },
  {
    "id": 10,
    "questionType": "객관식",
    "content": "다항함수 $f(x)$에 대하여 $\\lim_{x\\to-3}\\frac{f(x+2)-5}{x^3+27}=10$일 때, $\\frac{f\\prime(-1)}{f(-1)}$의 값을 구하면? [4.5점]",
    "choices": [
      "46",
      "48",
      "50",
      "52",
      "54"
    ],
    "answer": "⑤",
    "solution": "분모 $x^3+27$은 $x\\to-3$에서 $0$으로 간다. 주어진 분수의 극한값이 유한한 $10$이려면 분자 $f(x+2)-5$도 $0$으로 가야 한다.\n다항함수 $f$는 연속이므로 $f(-1)-5=0$, 즉 $f(-1)=5$이다.\n이제 분모를 인수분해하면\n$x^3+27=(x+3)(x^2-3x+9)$이다.\n$x+2-(-1)=x+3$이라는 점을 이용해 미분계수의 정의가 나타나도록 식을 나눈다.\n$\\dfrac{f(x+2)-5}{x^3+27}$\n$=\\dfrac{f(x+2)-f(-1)}{x+3}\\cdot\\dfrac1{x^2-3x+9}$\n$=\\dfrac{f(x+2)-f(-1)}{(x+2)-(-1)}\\cdot\\dfrac1{x^2-3x+9}$.\n$x\\to-3$이면 $x+2\\to-1$이므로 첫 인수의 극한값은 $f\\prime(-1)$이다.\n둘째 인수의 분모는 $(-3)^2-3(-3)+9=9+9+9=27$이므로 극한값은 $\\dfrac1{27}$이다.\n따라서 $\\dfrac{f\\prime(-1)}{27}=10$에서 $f\\prime(-1)=270$이다.\n문제에서 구할 값은 도함수값 자체가 아니라 $\\dfrac{f\\prime(-1)}{f(-1)}$이다.\n$\\dfrac{f\\prime(-1)}{f(-1)}=\\dfrac{270}{5}=54$이므로 정답은 ⑤이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "미분계수와 도함수",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "미분계수와 도함수",
    "originalCategory": "미분계수와 도함수"
  },
  {
    "id": 11,
    "questionType": "객관식",
    "content": "함수 $y=f(x)$의 그래프가 아래 그림과 같을 때, 함수 $f(x)g(x)$가 닫힌구간 $[-2,1]$에서 연속이 되도록 하는 함수 $g(x)$로 알맞은 것만을 <보기>에서 있는 대로 고른 것은?<br><div class=\"exam-img-box\"><img src=\"assets/images/21_매산고_1학기_중간_고2_수학II/q11.png\" class=\"exam-img\"></div><보기> ㄱ. $y=x$ ㄴ. $y=|2x^2-2x|$ ㄷ. $y=x^3+3x^2+2x$ [4.5점]",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ"
    ],
    "answer": "③",
    "solution": "먼저 그래프에서 $f$가 끊어지는 지점을 찾는다.\n$x=-1$에서 왼쪽 가지는 열린 점 $(-1,-1)$로 다가가고, 오른쪽 가지는 열린 점 $(-1,1)$에서 시작한다. 실제 함수값은 채워진 점 $(-1,0)$이다.\n따라서 $\\lim_{x\\to-1^-}f(x)=-1$, $\\lim_{x\\to-1^+}f(x)=1$, $f(-1)=0$이다.\n주어진 $g$ 후보들은 모두 연속이다. 곱 $f(x)g(x)$의 왼쪽 극한은 $-g(-1)$, 오른쪽 극한은 $g(-1)$이고 함수값은 $0\\cdot g(-1)=0$이다.\n세 값이 같으려면 $g(-1)=0$이어야 한다.\nㄱ. $g(x)=x$이면 $g(-1)=-1\\neq0$이므로 연속이 아니다.\nㄴ. $g(x)=|2x^2-2x|$이면 $g(-1)=|2+2|=4\\neq0$이므로 연속이 아니다.\nㄷ. $g(x)=x^3+3x^2+2x=x(x+1)(x+2)$이므로 $g(-1)=(-1)\\cdot0\\cdot1=0$이다.\n이때 곱의 좌우 극한은 모두 $0$이고 함수값도 $0$이다. 나머지 구간에서는 $f$와 $g$가 연속이므로 곱도 연속이다.\n따라서 ㄷ만 옳고 정답은 ③이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "함수의 극한과 연속",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "함수의 극한과 연속",
    "originalCategory": "함수의 극한과 연속"
  },
  {
    "id": 12,
    "questionType": "객관식",
    "content": "미분가능한 함수 $f(x)$에 대하여 $\\lim_{h\\to0}\\frac{f(1+3h)-f(1-h)}{h}=20$일 때, $\\lim_{x\\to1}\\frac{f(x^3)-f(1)}{x-1}$의 값을 구하면? [4.5점]",
    "choices": [
      "15",
      "20",
      "25",
      "30",
      "35"
    ],
    "answer": "①",
    "solution": "먼저 첫 번째 극한에서 $f\\prime(1)$을 구한다. $f$가 미분가능하므로 $x=1$에서의 차분몫을 사용할 수 있다.\n분자에 $f(1)$을 더하고 빼면\n$\\dfrac{f(1+3h)-f(1-h)}h$\n$=\\dfrac{f(1+3h)-f(1)}h+\\dfrac{f(1)-f(1-h)}h$이다.\n첫째 항은 분모를 $3h$로 만들기 위해 $3$을 곱한다.\n$\\dfrac{f(1+3h)-f(1)}h=3\\dfrac{f(1+3h)-f(1)}{3h}\\longrightarrow3f\\prime(1)$.\n둘째 항에서는 $k=-h$라고 두면 $k\\to0$이고\n$\\dfrac{f(1)-f(1-h)}h=\\dfrac{f(1+k)-f(1)}k\\longrightarrow f\\prime(1)$이다.\n따라서 주어진 극한 조건은 $3f\\prime(1)+f\\prime(1)=20$,\n$4f\\prime(1)=20$, $f\\prime(1)=5$를 뜻한다.\n이제 구하려는 극한의 분자에 있는 $x^3$을 하나의 입력으로 본다.\n$\\dfrac{f(x^3)-f(1)}{x-1}$\n$=\\dfrac{f(x^3)-f(1)}{x^3-1}\\cdot\\dfrac{x^3-1}{x-1}$\n$=\\dfrac{f(x^3)-f(1)}{x^3-1}\\cdot(x^2+x+1)$이다. 이 변형은 $x\\neq1$인 근방에서 성립한다.\n$x\\to1$이면 $x^3\\to1$이므로 첫 인수는 $f\\prime(1)=5$, 둘째 인수는 $1+1+1=3$으로 간다.\n따라서 극한값은 $5\\cdot3=15$이고 정답은 ①이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "미분계수와 도함수",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "미분계수와 도함수",
    "originalCategory": "미분계수와 도함수",
    "sourceMode": "ORIGINAL",
    "provenance": {
        "originalSource": "2021_매산고2_수2_1중간.pdf p2 q12",
        "originalDriveFileId": "1T1y4PyQuPxR_CuFmt_VS3quwjVo2V2xG",
        "originalSourceSha256": "17b4421d6e0fd0b073d91a38b56fc327c2e29d0943cd6ca2a2de5c976a4d068b",
        "pinnedInputJsGitBlob": "a3f48fd1b954dfc81a8bf1d27d6368e126cca1cd",
        "pinnedInputJsGitRef": "64f0ebdeeddb10d5731528f35181ed1e8338e404",
        "sourceModeReason": "SOURCE_EXACT_TRANSCRIPTION_RESTORED_FROM_PDF_NOT_GENERATED",
        "pinnedJsBefore": "f(x^3)-f",
        "sourcePdfAfter": "f(x^3)-f(1)",
        "repairHistory": "기존 JS 분자에서 f(1) 누락. 원본 PDF q12의 차분몫을 복원.",
        "contentModifiedInThisMasterRun": false,
        "sourceComparison": "PDF_PAGE_RENDER_VISUALLY_CONFIRMED_20261017"
    }
  },
  {
    "id": 13,
    "questionType": "객관식",
    "content": "닫힌구간 $[-1,3]$에서 정의된 두 함수 $y=f(x)$, $y=g(x)$에 대하여 $y=f(x)$의 그래프는 아래 그림과 같고, $$g(x)=\\begin{cases}x^2-ax+b&(-1\\le x<1)\\\\x^2-cx+d&(1\\le x\\le3)\\end{cases}$$일 때, 다음을 만족하는 $a,b,c,d$에 대하여 $a+b+c+d$의 값을 구하시오. (가) $y=g(x)$는 $[-1,3]$에서 연속이다. (나) $f(x)g(x)$는 $[-1,3]$에서 연속이다.<br><div class=\"exam-img-box\"><img src=\"assets/images/21_매산고_1학기_중간_고2_수학II/q13.png\" class=\"exam-img\"></div> [4.7점]",
    "choices": [
      "4",
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "③",
    "solution": "두 조건을 함께 이용한다. (가)에 따라 $g$는 $[-1,3]$에서 연속이고, (나)에 따라 $fg$도 연속이다.\n먼저 그림에서 $f$가 끊어지는 $x=0,1,2$를 찾는다. $g$가 연속이므로 이 세 점에서 곱의 연속성을 확인하면 된다.\n$x=0$에서는 $\\lim_{x\\to0^-}f(x)=2$, $f(0)=\\lim_{x\\to0^+}f(x)=3$이다.\n곱의 왼쪽 극한 $2g(0)$과 함수값 $3g(0)$이 같으려면 $g(0)=0$이어야 한다.\n첫 번째 식 $g(x)=x^2-ax+b$에 $x=0$을 넣으면 $b=0$이다.\n$x=1$에서는 $\\lim_{x\\to1^-}f(x)=\\lim_{x\\to1^+}f(x)=2$이지만 $f(1)=1$이다.\n곱의 극한 $2g(1)$과 함수값 $g(1)$이 같으려면 $g(1)=0$이어야 한다.\n또 $g$ 자체가 $x=1$에서 연속이므로\n$1-a+b=1-c+d=g(1)=0$이다.\n$b=0$을 대입하면 $1-a=0$이므로 $a=1$이고, $1-c+d=0$이므로 $d=c-1$이다.\n$x=2$에서는 $\\lim_{x\\to2^-}f(x)=f(2)=3$이지만 $\\lim_{x\\to2^+}f(x)=2$이다.\n곱이 연속이려면 $3g(2)=2g(2)$, 즉 $g(2)=0$이어야 한다.\n두 번째 식에 $x=2$를 넣으면\n$4-2c+d=0$이다.\n$d=c-1$을 대입하여 $4-2c+c-1=0$, $3-c=0$이므로 $c=3$, $d=2$이다.\n따라서 $a+b+c+d=1+0+3+2=6$이고 정답은 ③이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "함수의 극한과 연속",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "함수의 극한과 연속",
    "originalCategory": "함수의 극한과 연속"
  },
  {
    "id": 14,
    "questionType": "객관식",
    "content": "실수 전체의 집합에서 정의된 이차함수 $f(x)$가 (가) $\\lim_{x\\to2}\\frac{f(x)}{x-2}=4$, (나) $x=\\frac52$에서 최댓값을 갖는 조건을 만족한다. 이때 $\\lim_{x\\to2}\\frac{f(2x-1)}{x-2}$의 값을 구하면? [4.7점]",
    "choices": [
      "-14",
      "-12",
      "-10",
      "-8",
      "-6"
    ],
    "answer": "④",
    "solution": "(가)의 분모 $x-2$가 $0$으로 가는데 극한값이 유한한 $4$이므로, 연속인 다항함수 $f$의 분자도 $0$으로 가야 한다. 따라서 $f(2)=0$이다.\n이때 (가)의 식은 $\\dfrac{f(x)-f(2)}{x-2}$가 되어 미분계수의 정의와 같으므로 $f\\prime(2)=4$이다.\n(나)에서 이차함수의 대칭축은 $x=\\dfrac52$이다. 이미 한 근이 $2$이므로 두 근의 중점이 대칭축이라는 성질을 사용한다.\n$\\dfrac{2+\\text{다른 근}}2=\\dfrac52$이므로 다른 근은 $3$이다.\n따라서 $f(x)=k(x-2)(x-3)$으로 놓을 수 있다.\n이를 미분하면\n$f\\prime(x)=k\\{(x-3)+(x-2)\\}=k(2x-5)$이다.\n$f\\prime(2)=k(4-5)=-k=4$이므로 $k=-4$이다. 최고차항의 계수가 음수이므로 최댓값을 갖는다는 조건에도 맞는다.\n따라서 $f(x)=-4(x-2)(x-3)$이고 $f(3)=0$이다.\n구하려는 극한에서 $x\\to2$이면 $2x-1\\to3$이므로 $f(3)=0$을 이용한다.\n$\\dfrac{f(2x-1)}{x-2}$\n$=\\dfrac{f(2x-1)-f(3)}{(2x-1)-3}\\cdot\\dfrac{(2x-1)-3}{x-2}$\n$=\\dfrac{f(2x-1)-f(3)}{(2x-1)-3}\\cdot2$.\n첫 인수는 $f\\prime(3)$으로 가고, $f\\prime(3)=-4(6-5)=-4$이다.\n따라서 극한값은 $2\\cdot(-4)=-8$이고 정답은 ④이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "미분계수와 도함수",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "미분계수와 도함수",
    "originalCategory": "미분계수와 도함수"
  },
  {
    "id": 15,
    "questionType": "객관식",
    "content": "함수 $y=[x]$와 중심이 $(2,0)$이고 반지름이 $r$인 원의 교점 수를 $f(r)$이라 하자. 함수 $y=f(r)$의 불연속점의 $r$좌표를 작은 값부터 $a_1,a_2,a_3,\\ldots$라 할 때 $\\lim_{r\\to a_2^-}f(r)+\\lim_{r\\to a_4^+}f(r)$을 구하면? (단, $[x]$는 $x$보다 크지 않은 최대의 정수이다.) [5.0점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "③",
    "solution": "교점의 개수는 계단함수의 각 수평선분과 원이 만나는 점을 하나씩 세어 구한다.\n$[x]=k$인 부분은 $k\\le x<k+1$에서 높이가 $y=k$인 선분이다. 왼쪽 끝점 $(k,k)$은 포함하지만 오른쪽 끝점 $(k+1,k)$은 포함하지 않는다.\n원은 $(x-2)^2+y^2=r^2$이므로 높이 $y=k$에서는\n$(x-2)^2=r^2-k^2$\n$x=2\\pm\\sqrt{r^2-k^2}$이다. 이 두 값 중 $k\\le x<k+1$에 들어가는 값만 교점으로 센다.\n먼저 작은 반지름부터 개수가 바뀌는 곳을 찾는다.\n$0<r<1$에서는 교점이 없다.\n$1<r<\\sqrt2$에서는 $y=0$의 $0\\le x<1$에 한 점, $y=1$의 $1\\le x<2$에 한 점이 있으므로 $f(r)=2$이다.\n$\\sqrt2<r<2$에서는 $y=1$의 교점이 $x<1$로 벗어나고 $y=0$에만 한 점이 남으므로 $f(r)=1$이다.\n$r=2$에서는 $y=0$의 포함된 끝점 $(0,0)$과 $y=2$의 포함된 시작점 $(2,2)$을 각각 만나므로 $f(2)=2$이다. 하지만 $2$의 양쪽 가까운 곳에서는 교점이 한 개씩이므로 $r=2$도 불연속점이다.\n$2<r<\\sqrt5$에서는 $y=2$의 $2\\le x<3$에 한 점이 있으므로 $f(r)=1$이다.\n$r=\\sqrt5$에서는 $y=2$의 끝점 $(3,2)$과 $y=-1$의 끝점 $(0,-1)$이 모두 제외되는 점이어서 $f(\\sqrt5)=0$이다.\n$\\sqrt5<r<\\sqrt{10}$에서는 $y=-1$의 $-1\\le x<0$에 한 점이 있으므로 $f(r)=1$이다.\n따라서 작은 양의 불연속 반지름은 차례로\n$a_1=1$, $a_2=\\sqrt2$, $a_3=2$, $a_4=\\sqrt5$이다.\n구하는 값은 각 점에서의 함수값이 아니라 지정된 방향의 극한이다.\n$\\lim_{r\\to a_2^-}f(r)=\\lim_{r\\to\\sqrt2^-}f(r)=2$,\n$\\lim_{r\\to a_4^+}f(r)=\\lim_{r\\to\\sqrt5^+}f(r)=1$이다.\n따라서 $2+1=3$이고 정답은 ③이다.",
    "solutionImage": "assets/images/21_매산고_1학기_중간_고2_수학II/q15-solution.svg",
    "solutionImageAlt": "계단함수와 원의 실제 교점 수 비교: 반지름 1.2일 때 2개, 2.3일 때 1개",
    "solutionImageCaption": "원의 반지름에 따른 교점 수의 좌우극한",
    "solutionImageSize": "full",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "함수의 극한과 연속",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식"
    ],
    "category": "함수의 극한과 연속",
    "originalCategory": "함수의 극한과 연속"
  },
  {
    "id": 16,
    "questionType": "서술형",
    "content": "[단답형 1] 두 함수 $f(x),g(x)$에 대하여 <보기>의 네 명제의 참, 거짓을 판별하여 순서대로 쓰시오. (1개당 1점) <보기> ㄱ. 모든 실수 $x$에 대하여 $f(x)<g(x)$이면 $\\lim_{x\\to a}f(x)<\\lim_{x\\to a}g(x)$이다. ㄴ. $\\lim_{x\\to a}f(x)=\\infty$, $\\lim_{x\\to a}g(x)=\\alpha$ ($\\alpha$는 실수)이면 $\\lim_{x\\to a}(f(x)-g(x))=\\infty$이다. ㄷ. $\\lim_{x\\to a}f(x)=\\infty$, $\\lim_{x\\to a}g(x)=-\\infty$이면 $\\lim_{x\\to a}\\frac{f(x)}{g(x)}=-1$이다. ㄹ. $\\lim_{x\\to a}\\frac{f(x)}{g(x)}=\\alpha$ ($\\alpha$는 실수)이고 $\\lim_{x\\to a}g(x)=0$이면 $\\lim_{x\\to a}f(x)=0$이다. [4.0점]",
    "choices": [],
    "answer": "거짓, 참, 거짓, 참",
    "solution": "ㄱ. 거짓이다. $f(x)<g(x)$가 항상 성립하더라도 극한값까지 반드시 엄격한 부등호가 유지되는 것은 아니다.\n예를 들어 $f(x)=0$, $g(x)=(x-a)^2$ ($x\\neq a$), $g(a)=1$로 두면 모든 실수에서 $f(x)<g(x)$이다.\n하지만 $\\lim_{x\\to a}f(x)=0$, $\\lim_{x\\to a}g(x)=0$으로 두 극한값은 같다.\nㄴ. 참이다. $g(x)$가 유한한 실수 $\\alpha$에 가까워지는 동안 $f(x)$가 한없이 커지므로 $f(x)-g(x)$도 한없이 커진다.\n따라서 $\\lim_{x\\to a}(f(x)-g(x))=\\infty$이다.\nㄷ. 거짓이다. 두 함수가 각각 $\\infty$, $-\\infty$로 가더라도 커지는 빠르기는 정해지지 않는다.\n예를 들어 $f(x)=\\dfrac1{(x-a)^2}$, $g(x)=-\\dfrac2{(x-a)^2}$이면\n$\\dfrac{f(x)}{g(x)}=-\\dfrac12$로, 극한값은 $-1$이 아니다.\nㄹ. 참이다. $g(x)\\neq0$인 근방에서\n$f(x)=\\dfrac{f(x)}{g(x)}\\cdot g(x)$이다.\n두 인수의 극한이 각각 유한한 $\\alpha$와 $0$이므로\n$\\lim_{x\\to a}f(x)=\\alpha\\cdot0=0$이다.\n따라서 순서대로 거짓, 참, 거짓, 참이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "함수의 극한과 연속",
    "level": "중",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "서술형"
    ],
    "category": "함수의 극한과 연속",
    "originalCategory": "함수의 극한과 연속"
  },
  {
    "id": 17,
    "questionType": "서술형",
    "content": "[단답형 2] 실수 전체에서 정의된 함수 $y=f(x)$의 그래프가 그림과 같을 때, $\\lim_{x\\to\\infty}f\\left(\\frac{1-x}{2+x}\\right)+\\lim_{x\\to-\\infty}f\\left(\\frac{\\sqrt{-9x}}{\\sqrt{2-x}+2}\\right)$의 값을 구하시오.<br><div class=\"exam-img-box\"><img src=\"assets/images/21_매산고_1학기_중간_고2_수학II/q17.png\" class=\"exam-img\"></div> [5.0점]",
    "choices": [],
    "answer": "-1",
    "solution": "이 문제에서는 $f$의 입력이 어떤 값으로 가는지만이 아니라 그 값의 왼쪽과 오른쪽 중 어느 쪽에서 다가가는지를 확인해야 한다. 그래프에 열린 점과 채워진 점이 있기 때문이다.\n첫째 입력을 변형하면\n$\\dfrac{1-x}{2+x}=\\dfrac{-(x+2)+3}{x+2}=-1+\\dfrac3{x+2}$이다.\n$x\\to\\infty$일 때 $x+2>0$이고 $\\dfrac3{x+2}\\to0^+$이므로 입력은 $-1$보다 큰 쪽에서 $-1$로 접근한다.\n그래프의 $x=-1$ 오른쪽 가지는 열린 점 $(-1,1)$로 이어진다. 따라서\n$\\lim_{x\\to\\infty}f\\left(\\dfrac{1-x}{2+x}\\right)=\\lim_{u\\to-1^+}f(u)=1$이다.\n둘째 입력은 $x\\to-\\infty$이므로 $-x>0$이다. 분자와 분모를 $\\sqrt{-x}$로 나누면\n$\\dfrac{\\sqrt{-9x}}{\\sqrt{2-x}+2}$\n$=\\dfrac{3\\sqrt{-x}}{\\sqrt{-x}\\sqrt{1+2/(-x)}+2}$\n$=\\dfrac3{\\sqrt{1+2/(-x)}+2/\\sqrt{-x}}\\longrightarrow\\dfrac3{1+0}=3$이다.\n이때 분모 $\\sqrt{2-x}+2$는 $\\sqrt{-x}$보다 크므로 원래 분수는 $3$보다 작다. 즉 입력은 $3^-$에서 접근한다.\n그래프에서 $x=3$의 채워진 점은 $(3,3)$이지만 왼쪽 가지가 가까워지는 열린 점은 $(3,-2)$이다. 극한에는 함수값 $f(3)=3$이 아니라 왼쪽 극한 $-2$를 사용한다.\n$\\lim_{x\\to-\\infty}f\\left(\\dfrac{\\sqrt{-9x}}{\\sqrt{2-x}+2}\\right)=\\lim_{u\\to3^-}f(u)=-2$이다.\n따라서 두 극한의 합은 $1+(-2)=-1$이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "함수의 극한과 연속",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "서술형"
    ],
    "category": "함수의 극한과 연속",
    "originalCategory": "함수의 극한과 연속"
  },
  {
    "id": 18,
    "questionType": "서술형",
    "content": "[단답형 3] 그림과 같이 $y$축과 직선 $y=x-1$이 직선 $y=t\\,(t>0)$와 만나는 점을 각각 $\\mathrm{P,Q}$라 하자. 삼각형 $\\mathrm{POQ}$에 내접하는 원의 중심이 $(f(t),g(t))$일 때 $\\lim_{t\\to\\infty}\\frac{g(t)}{f(t)}$를 구하시오.<br><div class=\"exam-img-box\"><img src=\"assets/images/21_매산고_1학기_중간_고2_수학II/q18.png\" class=\"exam-img\"></div> [6.0점]",
    "choices": [],
    "answer": "$1+\\sqrt2$",
    "solution": "그림에서 $O=(0,0)$, $P=(0,t)$이고, 직선 $y=t$와 $y=x-1$의 교점은 $t=x-1$을 만족하므로 $Q=(t+1,t)$이다.\n따라서 $OP=t$, $PQ=t+1$, $OQ=\\sqrt{t^2+(t+1)^2}$인 직각삼각형이다.\n내접원의 반지름을 $r$이라고 하자. 원은 $x=0$인 변과 $y=t$인 변에 접하므로 중심은 두 변에서 각각 거리 $r$만큼 떨어진\n$(f(t),g(t))=(r,t-r)$이다.\n삼각형의 넓이를 두 가지 방법으로 계산한다.\n$\\text{넓이}=\\dfrac12\\,OP\\cdot PQ=\\dfrac{t(t+1)}2$이다.\n또 내심에서 세 변에 내린 수선의 길이가 모두 $r$이므로\n$\\text{넓이}=\\dfrac12r\\{OP+PQ+OQ\\}$이다.\n두 식을 같게 놓으면\n$\\dfrac{t(t+1)}2=\\dfrac r2\\{t+(t+1)+\\sqrt{t^2+(t+1)^2}\\}$,\n$r=\\dfrac{t(t+1)}{2t+1+\\sqrt{t^2+(t+1)^2}}$이다.\n따라서\n$\\dfrac{g(t)}{f(t)}=\\dfrac{t-r}{r}=\\dfrac tr-1$\n$=\\dfrac{2t+1+\\sqrt{t^2+(t+1)^2}}{t+1}-1$\n$=\\dfrac{t+\\sqrt{t^2+(t+1)^2}}{t+1}$이다.\n분자와 분모를 $t>0$으로 나누면\n$\\dfrac{g(t)}{f(t)}=\\dfrac{1+\\sqrt{1+(1+1/t)^2}}{1+1/t}$이다.\n$t\\to\\infty$이면 $1/t\\to0$이므로 구하는 극한값은 $1+\\sqrt2$이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "함수의 극한과 연속",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "서술형"
    ],
    "category": "함수의 극한과 연속",
    "originalCategory": "함수의 극한과 연속"
  },
  {
    "id": 19,
    "questionType": "서술형",
    "content": "[서술형 1] 실수 $t$에 대하여 정의역이 양의 실수인 함수 $f(x)=-x^2+12x+|2tx|-30$의 최댓값을 $g(t)$라 하자. $h(t)=(t^2-a)g(t)$가 모든 실수 $t$에서 미분가능하도록 하는 상수 $a$의 값을 구하는 과정을 서술하시오. [10.0점]",
    "choices": [],
    "answer": "0",
    "solution": "먼저 최댓값을 구할 때의 변수는 $x>0$이고, $t$는 모든 실수라는 점을 구별한다.\n$x>0$이므로 $|2tx|=2|t|x$이다.\n$f(x)=-x^2+(12+2|t|)x-30$\n$=-\\{x-(6+|t|)\\}^2+(6+|t|)^2-30$이다.\n꼭짓점의 $x$좌표 $6+|t|$는 항상 양수이므로 실제 정의역 안에서 최댓값을 갖는다.\n따라서\n$g(t)=(6+|t|)^2-30=t^2+12|t|+6$이다.\n$h(t)=(t^2-a)(t^2+12|t|+6)$이다.\n$t\\neq0$에서는 다항식과 절댓값 함수가 각각 미분가능하므로 $t=0$에서의 미분가능성만 확인하면 된다.\n$h(t)=(t^2-a)(t^2+6)+12(t^2-a)|t|$로 나누어 본다.\n첫째 항은 다항식이므로 $t=0$에서 미분계수가 $0$이다.\n둘째 항의 $t=0$에서의 함수값은 $0$이므로, 오른쪽 미분계수는\n$\\lim_{t\\to0^+}\\dfrac{12(t^2-a)|t|}{t}=\\lim_{t\\to0^+}12(t^2-a)=-12a$이다.\n왼쪽 미분계수는 $t<0$에서 $|t|=-t$임을 이용하여\n$\\lim_{t\\to0^-}\\dfrac{12(t^2-a)|t|}{t}=\\lim_{t\\to0^-}-12(t^2-a)=12a$이다.\n두 미분계수가 같아야 하므로 $-12a=12a$, $24a=0$, $a=0$이다.\n$a=0$일 때는 $h(t)=t^4+6t^2+12t^2|t|$이고, $t^2|t|$의 $t=0$에서의 미분계수는 $\\lim_{t\\to0}t|t|=0$이므로 실제로 미분가능하다.\n따라서 구하는 값은 $a=0$이다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "미분가능성과 연속",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "서술형"
    ],
    "category": "미분가능성과 연속",
    "originalCategory": "미분가능성과 연속"
  },
  {
    "id": 20,
    "questionType": "서술형",
    "content": "[서술형 2] 다항함수 $f(x)$가 다음 조건을 만족할 때 $f(x)$를 구하는 과정을 서술하시오. (가) $f(0)=2$. (나) $\\lim_{x\\to\\infty}\\frac{f(x)}{x^m}=1$을 만족하는 자연수 $m$이 존재한다. (다) $\\lim_{x\\to\\infty}\\frac{x^3f(x)}{\\{f(x)\\}^2-f(x^2)}$은 수렴한다. (라) $\\lim_{x\\to\\infty}\\frac{f\\prime(x)-4x^{n+1}}{x^n+1}=3$을 만족하는 자연수 $n$이 존재한다. (마) $\\lim_{x\\to1}\\frac{f(2x)}{x-1}=38$. [10.0점]",
    "choices": [],
    "answer": "$f(x)=x^4+x^3-6x^2-x+2$",
    "solution": "(나)의 극한이 $1$이므로 다항함수 $f(x)$는 최고차항의 계수가 $1$인 $m$차 다항식이다.\n(라)의 분모는 $x^n+1$이므로 $x\\to\\infty$에서 최고차항의 차수는 $n$이다. 분자의 극한이 유한하려면 $f\\prime(x)$의 최고차항과 $4x^{n+1}$이 서로 상쇄되어야 한다. 상쇄되지 않으면 분자에 $x^{n+1}$ 이상의 항이 남아 분모보다 한 차수 이상 커지기 때문이다.\n$f(x)$의 최고차항이 $x^m$이므로 $f\\prime(x)$의 최고차항은 $mx^{m-1}$이다. 따라서 차수와 계수가 모두 같아야 한다.\n$m-1=n+1$, $m=4$이므로 $n=2$이다.\n(가)의 $f(0)=2$까지 반영하여\n$f(x)=x^4+bx^3+cx^2+dx+2$로 놓는다.\n$f\\prime(x)=4x^3+3bx^2+2cx+d$이므로 (라)에 대입하면\n$\\lim_{x\\to\\infty}\\dfrac{(4x^3+3bx^2+2cx+d)-4x^3}{x^2+1}=3$,\n$\\lim_{x\\to\\infty}\\dfrac{3bx^2+2cx+d}{x^2+1}=3$이다.\n분자와 분모를 $x^2$로 나누면\n$\\lim_{x\\to\\infty}\\dfrac{3b+2c/x+d/x^2}{1+1/x^2}=3b=3$이므로 $b=1$이다.\n따라서 $f(x)=x^4+x^3+cx^2+dx+2$이다.\n이제 (마)를 이용한다. $x\\to1$에서 분모 $x-1\\to0$이고 극한이 유한하므로 $f(2)=0$이어야 한다.\n$f(2)=16+8+4c+2d+2=26+4c+2d=0$에서\n$4c+2d=-26$, 즉 $2c+d=-13$이다. ①\n또한 $f(2)=0$이므로 (마)의 분자는 $f(2x)-f(2)$로 쓸 수 있다.\n$\\lim_{x\\to1}\\dfrac{f(2x)-f(2)}{x-1}$\n$=\\lim_{x\\to1}\\dfrac{f(2x)-f(2)}{2x-2}\\cdot2=2f\\prime(2)=38$이다.\n따라서 $f\\prime(2)=19$이다.\n$f\\prime(2)=4\\cdot2^3+3\\cdot2^2+2c\\cdot2+d=32+12+4c+d$이므로\n$44+4c+d=19$, 즉 $4c+d=-25$이다. ②\n②에서 ①을 빼면 $2c=-12$, $c=-6$이다. ①에 대입하면 $-12+d=-13$이므로 $d=-1$이다.\n따라서 $f(x)=x^4+x^3-6x^2-x+2$이다.\n끝으로 (다)의 수렴 조건도 실제로 만족하는지 살펴본다. 구한 $f$에 대해\n$\\{f(x)\\}^2=x^8+2x^7+(1-12)x^6+\\text{차수가 5 이하인 항}$이고,\n$f(x^2)=x^8+x^6-6x^4-x^2+2$이다.\n따라서 $\\{f(x)\\}^2-f(x^2)=2x^7-12x^6+\\text{차수가 5 이하인 항}$이다.\n또 $x^3f(x)=x^7+x^6-6x^5-x^4+2x^3$이다.\n분자와 분모를 $x^7$로 나누면 분자의 극한은 $1$, 분모의 극한은 $2$이므로 (다)의 극한값은 $\\dfrac12$로 수렴한다.\n이렇게 구한 다항함수는 (가)부터 (마)까지 모두 만족한다.",
    "standardCourse": "수학Ⅱ",
    "standardUnit": "미분계수와 도함수",
    "level": "상",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "서술형"
    ],
    "category": "미분계수와 도함수",
    "originalCategory": "미분계수와 도함수",
    "sourceMode": "ORIGINAL",
    "provenance": {
        "originalSource": "2021_매산고2_수2_1중간.pdf p3 q20",
        "originalDriveFileId": "1T1y4PyQuPxR_CuFmt_VS3quwjVo2V2xG",
        "originalSourceSha256": "17b4421d6e0fd0b073d91a38b56fc327c2e29d0943cd6ca2a2de5c976a4d068b",
        "pinnedInputJsGitBlob": "a3f48fd1b954dfc81a8bf1d27d6368e126cca1cd",
        "pinnedInputJsGitRef": "64f0ebdeeddb10d5731528f35181ed1e8338e404",
        "sourceModeReason": "SOURCE_EXACT_TRANSCRIPTION_RESTORED_FROM_PDF_NOT_GENERATED",
        "pinnedJsBefore": "(가) f=2",
        "sourcePdfAfter": "(가) f(0)=2",
        "repairHistory": "기존 JS 조건 (가)에서 입력 0 누락. 원본 PDF q20은 f(0)=2.",
        "contentModifiedInThisMasterRun": false,
        "sourceComparison": "PDF_PAGE_RENDER_VISUALLY_CONFIRMED_20261017"
    }
  }
];

window.examData = { title: window.examTitle, questions: window.questionBank };
