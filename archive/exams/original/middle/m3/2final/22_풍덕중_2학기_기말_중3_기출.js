window.examTitle = "22_풍덕중_2학기_기말_중3_기출";

const U = {
  "원의 성질": ["M3-06", 6],
  "통계": ["M3-07", 7]
};

function q({ id, level, unit, type, tags = [], content, choices = [], answer, solution, image = "" }) {
  const [standardUnitKey, standardUnitOrder] = U[unit];
  return {
    id,
    level,
    category: unit,
    originalCategory: unit,
    standardCourse: "중3 수학",
    standardUnitKey,
    standardUnit: unit,
    standardUnitOrder,
    questionType: type,
    layoutTag: "grid",
    tags,
    wide: false,
    ...(image ? { image } : {}),
    content,
    choices,
    answer,
    solution
  };
}

const IMG = "assets/images/22_풍덕중_2학기_기말_중3_기출";

window.questionBank = [
  q({
    id: 1, level: "하", unit: "원의 성질", type: "객관식", tags: ["도형"], image: `${IMG}/q1.png`,
    content: String.raw`오른쪽 원 $O$에서 $\angle x$의 크기는? (3점)`,
    choices: [String.raw`$13^\circ$`, String.raw`$24^\circ$`, String.raw`$50^\circ$`, String.raw`$52^\circ$`, String.raw`$62^\circ$`],
    answer: "④",
    solution: String.raw`[키포인트] 같은 호에 대한 중심각은 원주각의 2배이다.\n$26^\circ$의 원주각과 $\angle x$의 중심각이 같은 호를 보고 있으므로 $x=2\times26=52$이다.\n따라서 정답은 ④이다.`
  }),
  q({
    id: 2, level: "중", unit: "원의 성질", type: "객관식", tags: ["도형"], image: `${IMG}/q2.png`,
    content: String.raw`오른쪽 원 $O$에서 $x$의 값은? (3점)`,
    choices: [String.raw`$3$`, String.raw`$4$`, String.raw`$5$`, String.raw`$6$`, String.raw`$7$`],
    answer: "②",
    solution: String.raw`[키포인트] 같은 원에서 호의 길이의 비는 그 호에 대한 원주각의 크기의 비와 같다.\n왼쪽의 길이 $2\rm\,cm$인 호와 오른쪽의 길이 $x\rm\,cm$인 호에 대한 원주각은 각각 $25^\circ$, $50^\circ$이다.\n따라서 $2:x=25:50=1:2$이므로 $x=4$이다.\n따라서 정답은 ②이다.`
  }),
  q({
    id: 3, level: "하", unit: "원의 성질", type: "객관식", tags: ["도형"], image: `${IMG}/q3.png`,
    content: String.raw`오른쪽 그림에서 □$ABCD$가 원에 내접할 때, $\angle x$, $\angle y$의 크기를 각각 구하면? (3점)`,
    choices: [
      String.raw`$\angle x=60^\circ,\ \angle y=100^\circ$`,
      String.raw`$\angle x=60^\circ,\ \angle y=90^\circ$`,
      String.raw`$\angle x=60^\circ,\ \angle y=95^\circ$`,
      String.raw`$\angle x=70^\circ,\ \angle y=100^\circ$`,
      String.raw`$\angle x=70^\circ,\ \angle y=90^\circ$`
    ],
    answer: "②",
    solution: String.raw`[키포인트] 원에 내접하는 사각형의 서로 마주 보는 두 각의 합은 $180^\circ$이다.\n$\angle B=120^\circ$이므로 $x=180-120=60^\circ$이다. 또 $\angle A=90^\circ$이므로 $y=180-90=90^\circ$이다.\n따라서 정답은 ②이다.`
  }),
  q({
    id: 4, level: "중", unit: "원의 성질", type: "객관식",
    content: String.raw`다음 보기 중 옳은 것을 고르면? (3점)`,
    choices: [
      String.raw`반원에 대한 원주각의 크기는 $180^\circ$이다.`,
      String.raw`원에서 한 호에 대한 원주각은 한 개만 있다.`,
      String.raw`원에서 한 호에 대한 중심각은 무수히 많다.`,
      String.raw`길이가 같은 호에 대한 원주각의 크기는 항상 같다.`,
      String.raw`원에서 현의 길이와 중심각의 크기는 정비례한다.`
    ],
    answer: "④",
    solution: String.raw`[키포인트] 원주각과 중심각의 기본 성질을 보기별로 확인한다.\n반원에 대한 원주각은 $90^\circ$이므로 ①은 틀리다. 한 호를 보는 원주각은 여러 개 존재하므로 ②는 틀리고, 한 호에 대한 중심각은 하나이므로 ③도 틀리다. 길이가 같은 호는 같은 크기의 원주각을 만들므로 ④는 옳다. 현의 길이와 중심각의 크기는 정비례하지 않으므로 ⑤는 틀리다.\n따라서 정답은 ④이다.`
  }),
  q({
    id: 5, level: "하", unit: "원의 성질", type: "객관식", tags: ["도형"], image: `${IMG}/q5.png`,
    content: String.raw`다음 그림에서 직선 $AT$는 원 $O$의 접선이고 점 $A$는 그 접점일 때, $\angle x$의 크기는? (3점)`,
    choices: [String.raw`$36^\circ$`, String.raw`$38^\circ$`, String.raw`$44^\circ$`, String.raw`$52^\circ$`, String.raw`$56^\circ$`],
    answer: "⑤",
    solution: String.raw`[키포인트] 접선과 현이 이루는 각은 그 현에 대한 원주각과 같다.\n$\angle ACB=56^\circ$이고 $\angle x$는 접선 $AT$와 현 $AB$가 이루는 각이므로 접선과 현의 성질에 의해 $x=56^\circ$이다.\n따라서 정답은 ⑤이다.`
  }),
  q({
    id: 6, level: "중", unit: "원의 성질", type: "객관식", tags: ["도형"], image: `${IMG}/q6.png`,
    content: String.raw`오른쪽 그림과 같이 두 현 $AC$와 $BD$의 교점을 $P$라고 할 때, $\angle x$의 크기를 구하면? (3점)`,
    choices: [String.raw`$95^\circ$`, String.raw`$100^\circ$`, String.raw`$110^\circ$`, String.raw`$115^\circ$`, String.raw`$120^\circ$`],
    answer: "③",
    solution: String.raw`[키포인트] 원 안에서 두 현이 만날 때 생기는 각은 마주 보는 두 호의 크기의 합의 절반이다.\n$\angle BAC=60^\circ$이므로 $\wideparen{BC}=120^\circ$이고, $\angle ACD=50^\circ$이므로 $\wideparen{AD}=100^\circ$이다.\n따라서 $x=\dfrac{120+100}{2}=110^\circ$이다.\n따라서 정답은 ③이다.`
  }),
  q({
    id: 7, level: "중", unit: "원의 성질", type: "객관식", tags: ["도형"], image: `${IMG}/q7.png`,
    content: String.raw`오른쪽 그림에서 $\overline{AB}$가 원 $O$의 지름이고, $\triangle ABC$가 원 $O$에 내접할 때, $x$의 값을 구하면? (4점)`,
    choices: [String.raw`$9$`, String.raw`$10$`, String.raw`$11$`, String.raw`$12$`, String.raw`$13$`],
    answer: "④",
    solution: String.raw`[키포인트] 지름에 대한 원주각과 호의 길이의 비를 함께 이용한다.\n$\overline{AB}$가 지름이므로 $\angle ACB=90^\circ$이다. 따라서 $\angle ABC=180-90-40=50^\circ$이다.\n$\wideparen{AC}$와 $\wideparen{BC}$의 크기는 각각 $2\times50=100^\circ$, $2\times40=80^\circ$이므로 두 호의 길이의 비는 $100:80=5:4$이다.\n$\wideparen{AC}$의 길이가 $15\rm\,cm$이므로 $15:x=5:4$, 따라서 $x=12$이다.\n따라서 정답은 ④이다.`
  }),
  q({
    id: 8, level: "중", unit: "원의 성질", type: "객관식", tags: ["도형"], image: `${IMG}/q8.png`,
    content: String.raw`오른쪽 원 $O$에서 $\wideparen{AB}:\wideparen{BC}:\wideparen{CA}=3:4:5$일 때, $\angle x$의 크기를 구하면? (4점)`,
    choices: [String.raw`$45^\circ$`, String.raw`$56^\circ$`, String.raw`$60^\circ$`, String.raw`$66^\circ$`, String.raw`$75^\circ$`],
    answer: "③",
    solution: String.raw`[키포인트] 호의 비로 각 호의 중심각을 구한 뒤 원주각을 구한다.\n세 호의 비의 합은 $3+4+5=12$이므로 $\wideparen{BC}$의 크기는 $360^\circ\times\dfrac{4}{12}=120^\circ$이다.\n$\angle x$는 $\wideparen{BC}$에 대한 원주각이므로 $x=\dfrac{120}{2}=60^\circ$이다.\n따라서 정답은 ③이다.`
  }),
  q({
    id: 9, level: "상", unit: "원의 성질", type: "객관식", tags: ["도형"], image: `${IMG}/q9.png`,
    content: String.raw`다음 그림에서 $\overline{PQ}$는 두 원 $O$, $O'$의 공통인 현일 때, $\angle x+\angle y$를 구하면? (4점)`,
    choices: [String.raw`$197^\circ$`, String.raw`$195^\circ$`, String.raw`$192^\circ$`, String.raw`$187^\circ$`, String.raw`$185^\circ$`],
    answer: "①",
    solution: String.raw`[키포인트] 오른쪽 원에서 $P,Q$의 각을 구한 뒤 일직선과 왼쪽 원의 내접사각형 성질을 연결한다.\n오른쪽 원의 내접사각형 $PDCQ$에서 $\angle PQC=180-83=97^\circ$, $\angle DPQ=180-80=100^\circ$이다.\n$B,Q,C$가 일직선이므로 $\angle PQB=180-97=83^\circ$이고, $A,P,D$가 일직선이므로 $\angle APQ=180-100=80^\circ$이다.\n왼쪽 원의 내접사각형 $APQB$에서 $x=180-83=97^\circ$, $y=180-80=100^\circ$이다.\n따라서 $x+y=197^\circ$이므로 정답은 ①이다.`
  }),
  q({
    id: 10, level: "상", unit: "원의 성질", type: "객관식", tags: ["도형"], image: `${IMG}/q10.png`,
    content: String.raw`다음 그림과 같이 $\overline{AB}$를 지름으로 하는 반원 $O$에서 $\wideparen{AD}=\wideparen{CD}$일 때, $\angle x$의 크기를 구하면? (4점)`,
    choices: [String.raw`$64^\circ$`, String.raw`$62^\circ$`, String.raw`$60^\circ$`, String.raw`$58^\circ$`, String.raw`$54^\circ$`],
    answer: "①",
    solution: String.raw`[키포인트] 원주각으로 호의 크기를 구하고, 반원의 호를 나눈 뒤 교차하는 두 현의 각을 이용한다.\n$\angle ABD=26^\circ$이므로 $\wideparen{AD}=52^\circ$이다. $\wideparen{AD}=\wideparen{CD}$이므로 $\wideparen{CD}=52^\circ$이다.\n반원 $\wideparen{AB}$의 크기가 $180^\circ$이므로 $\wideparen{CB}=180-52-52=76^\circ$이다.\n교차하는 현 $AC$, $BD$에 의해 $x=\dfrac{\wideparen{AD}+\wideparen{CB}}{2}=\dfrac{52+76}{2}=64^\circ$이다.\n따라서 정답은 ①이다.`
  }),
  q({
    id: 11, level: "상", unit: "원의 성질", type: "객관식", tags: ["도형"], image: `${IMG}/q11.png`,
    content: String.raw`다음 그림에서 두 점 $A$, $B$는 점 $P$에서 원 $O$에 그은 두 접선의 접점이고 $\angle APB=30^\circ$이다. $\wideparen{AC}:\wideparen{BC}=1:2$일 때, $\angle x$의 크기를 구하면? (4점)`,
    choices: [String.raw`$27^\circ$`, String.raw`$29^\circ$`, String.raw`$32^\circ$`, String.raw`$35^\circ$`, String.raw`$37^\circ$`],
    answer: "④",
    solution: String.raw`[키포인트] 두 접선이 이루는 각으로 작은 호 $AB$를 구하고, 큰 호 $ACB$를 비로 나눈다.\n두 접선이 이루는 각이 $30^\circ$이므로 작은 호 $\wideparen{AB}$의 크기는 $180-30=150^\circ$이다. 따라서 큰 호 $\wideparen{ACB}$는 $360-150=210^\circ$이다.\n$\wideparen{AC}:\wideparen{BC}=1:2$이므로 $\wideparen{AC}=210\times\dfrac13=70^\circ$이다.\n$\angle x=\angle ABC$는 $\wideparen{AC}$에 대한 원주각이므로 $x=35^\circ$이다.\n따라서 정답은 ④이다.`
  }),
  q({
    id: 12, level: "하", unit: "통계", type: "객관식",
    content: String.raw`다음 자료의 최빈값을 구하면? (3점)\n$3\quad1\quad2\quad3\quad3\quad4\quad5$`,
    choices: [String.raw`$1$`, String.raw`$2$`, String.raw`$3$`, String.raw`$4$`, String.raw`$5$`],
    answer: "③",
    solution: String.raw`[키포인트] 최빈값은 자료에서 가장 많이 나타나는 값이다.\n$3$은 세 번 나타나고 나머지 값은 한 번씩 나타난다. 따라서 최빈값은 $3$이다.\n따라서 정답은 ③이다.`
  }),
  q({
    id: 13, level: "중", unit: "통계", type: "객관식",
    content: String.raw`다음 설명 중 옳지 않은 것은? (4점)`,
    choices: [
      String.raw`편차의 합은 항상 0이다.`,
      String.raw`최빈값은 두 개 이상일 수 있다.`,
      String.raw`중앙값은 반드시 하나로 정해진다.`,
      String.raw`편차의 절댓값이 클수록 평균에서 멀리 떨어져 있다.`,
      String.raw`편차의 제곱의 평균을 표준편차라 한다.`
    ],
    answer: "⑤",
    solution: String.raw`[키포인트] 분산과 표준편차의 정의를 구별한다.\n편차의 제곱의 평균은 분산이고, 표준편차는 분산의 양의 제곱근이다. 따라서 ⑤의 설명이 옳지 않다. 나머지 설명은 모두 옳다.\n따라서 정답은 ⑤이다.`
  }),
  q({
    id: 14, level: "중", unit: "통계", type: "객관식", tags: ["그래프"], image: `${IMG}/q14.png`,
    content: String.raw`다음 막대그래프는 순천풍덕중학교 학생 15명의 턱걸이 횟수를 측정하여 나타낸 것이다. 보기 중에서 옳은 것을 모두 찾으면? (4점)`,
    choices: ["ㄱ", "ㄴ", "ㄴ, ㄷ", "ㄱ, ㄴ", "ㄱ, ㄴ, ㄷ"],
    answer: "③",
    solution: String.raw`[키포인트] 막대그래프에서 각 횟수의 도수를 읽어 평균, 중앙값, 최빈값을 각각 확인한다.\n턱걸이 횟수 $1,2,3,4,5$의 도수는 각각 $2,4,5,3,1$이다. 평균은 $\dfrac{1\times2+2\times4+3\times5+4\times3+5\times1}{15}=\dfrac{42}{15}=2.8$이므로 ㄱ은 거짓이다.\n15명 중 8번째 자료는 $3$이므로 중앙값은 $3$이고, 도수가 가장 큰 값도 $3$이므로 최빈값 역시 $3$이다. 따라서 ㄴ, ㄷ이 옳다.\n따라서 정답은 ③이다.`
  }),
  q({
    id: 15, level: "상", unit: "통계", type: "객관식", image: `${IMG}/q15.png`,
    content: String.raw`다음이 모두 성립할 때, $a$값의 범위는? (4점)`,
    choices: [String.raw`$8\le a\le12$`, String.raw`$8\le a\le14$`, String.raw`$8\le a\le10$`, String.raw`$11\le a\le12$`, String.raw`$11\le a\le16$`],
    answer: "①",
    solution: String.raw`[키포인트] 두 중앙값 조건에서 각각 $a$의 범위를 구한 뒤 공통 범위를 찾는다.\n5개의 수 $3,4,8,11,a$의 중앙값이 $8$이 되려면 $a\ge8$이어야 한다.\n6개의 수 $8,12,16,17,23,a$의 중앙값은 가운데 두 수의 평균이다. $a\le12$이면 가운데 두 수가 $12,16$이 되어 중앙값이 $14$이고, $a\gt12$이면 이 조건을 만족하지 않는다. 따라서 $a\le12$이다.\n두 조건을 함께 만족시키면 $8\le a\le12$이다.\n따라서 정답은 ①이다.`
  }),
  q({
    id: 16, level: "중", unit: "통계", type: "객관식", tags: ["표"], image: `${IMG}/q16.png`,
    content: String.raw`다음 표는 순천풍덕중학교 3학년 세 학급의 학생들이 1년 동안 영화를 관람한 횟수의 평균과 표준편차를 나타낸 것이다. 다음 중 옳은 것은? (4점)`,
    choices: [
      String.raw`2반 학생은 모두 6회 이상 영화를 보았다.`,
      String.raw`영화를 가장 많이 본 학생은 2반에 있다.`,
      String.raw`영화 관람 횟수는 3반이 2반보다 더 고르다.`,
      String.raw`편차의 합이 가장 작은 반은 2반이다.`,
      String.raw`3반이 1반보다 평균적으로 영화 관람을 더 많이 했다.`
    ],
    answer: "⑤",
    solution: String.raw`[키포인트] 평균은 자료의 중심을, 표준편차는 자료의 흩어진 정도를 나타낸다.\n2반의 평균이 $7$이라고 해서 모든 학생이 $6$회 이상이라고 할 수 없고, 최댓값이 어느 반에 있는지도 평균과 표준편차만으로 알 수 없다. 표준편차는 2반이 $1$, 3반이 $3$이므로 2반이 더 고르다. 또한 각 반의 편차의 합은 모두 $0$이다.\n3반의 평균은 $6$, 1반의 평균은 $5$이므로 3반이 평균적으로 영화를 더 많이 관람했다.\n따라서 정답은 ⑤이다.`
  }),
  q({
    id: 17, level: "하", unit: "통계", type: "객관식",
    content: String.raw`민준이의 4회에 걸친 수학 시험의 평균 점수가 88점이고, 5번째 수학 시험 후에 5회까지의 평균 점수가 90점이 되었을 때, 5번째 수학 시험의 점수를 구하면? (4점)`,
    choices: ["92점", "94점", "96점", "97점", "98점"],
    answer: "⑤",
    solution: String.raw`[키포인트] 평균에 자료의 개수를 곱해 총점을 구한다.\n처음 4회의 총점은 $88\times4=352$점이고, 5회까지의 총점은 $90\times5=450$점이다.\n따라서 5번째 시험 점수는 $450-352=98$점이다.\n따라서 정답은 ⑤이다.`
  }),
  q({
    id: 18, level: "하", unit: "통계", type: "객관식",
    content: String.raw`5개의 변량 $A,B,C,D,E$의 평균이 83이고 분산이 3일 때, $A-3,B-3,C-3,D-3,E-3$의 분산은? (4점)`,
    choices: [String.raw`$0$`, String.raw`$2$`, String.raw`$3$`, String.raw`$4$`, String.raw`$6$`],
    answer: "③",
    solution: String.raw`[키포인트] 모든 자료에 같은 수를 더하거나 빼면 편차는 변하지 않아 분산도 변하지 않는다.\n각 변량에서 모두 $3$을 빼면 평균도 $3$만큼 줄어들므로 각 자료의 편차는 그대로이다. 따라서 분산은 원래와 같은 $3$이다.\n따라서 정답은 ③이다.`
  }),
  q({
    id: 19, level: "중", unit: "원의 성질", type: "객관식", tags: ["도형"], image: `${IMG}/q19.png`,
    content: String.raw`오른쪽 그림과 같이 육각형 $ABCDEF$가 원에 내접할 때, $\angle B+\angle D+\angle F$의 값을 구하면? (5점)`,
    choices: [String.raw`$340^\circ$`, String.raw`$360^\circ$`, String.raw`$380^\circ$`, String.raw`$400^\circ$`, String.raw`$420^\circ$`],
    answer: "②",
    solution: String.raw`[키포인트] 각 원주각이 보는 호를 모두 더해 각 호가 몇 번씩 포함되는지 확인한다.\n원의 여섯 호를 차례로 $a,b,c,d,e,f$라 하자. $\angle B$, $\angle D$, $\angle F$가 보는 큰 호의 크기를 모두 더하면 여섯 호가 각각 두 번씩 포함된다.\n따라서 $\angle B+\angle D+\angle F=\dfrac12\times2(a+b+c+d+e+f)=360^\circ$이다.\n따라서 정답은 ②이다.`
  }),
  q({
    id: 20, level: "상", unit: "원의 성질", type: "객관식", tags: ["도형"], image: `${IMG}/q20.png`,
    content: String.raw`다음 그림과 같이 원 $O$ 위의 점 $A$에서 그은 접선 $AT$와 지름 $CB$의 연장선의 교점을 $P$라고 하자. $\overline{AP}=\overline{AC}$일 때, $\angle CAT$의 크기를 구하면? (5점)`,
    choices: [String.raw`$80^\circ$`, String.raw`$60^\circ$`, String.raw`$56^\circ$`, String.raw`$48^\circ$`, String.raw`$30^\circ$`],
    answer: "②",
    solution: String.raw`[키포인트] 접선-현의 각, 지름에 대한 원주각, 이등변삼각형을 연결한다.\n$\angle CAT=\theta$라 하자. $P,A,T$가 일직선이므로 $\angle PAC=180^\circ-\theta$이다. $AP=AC$이므로 이등변삼각형 $APC$에서 $\angle APC=\angle ACP=\dfrac{\theta}{2}$이다.\n$B,C,P$가 일직선이므로 $\angle ACB=\dfrac{\theta}{2}$이다. 또한 $BC$가 지름이므로 $\angle BAC=90^\circ$이고, 따라서 $\angle ABC=90^\circ-\dfrac{\theta}{2}$이다.\n접선과 현의 성질에 의해 $\angle CAT=\angle ABC$이므로 $\theta=90^\circ-\dfrac{\theta}{2}$. 따라서 $\theta=60^\circ$이다.\n따라서 정답은 ②이다.`
  }),
  q({
    id: 21, level: "상", unit: "원의 성질", type: "객관식", tags: ["도형"], image: `${IMG}/q21.png`,
    content: String.raw`사각형 $ABCD$는 원에 내접하고, 호 $BC$의 길이가 원의 둘레의 $\dfrac15$이고 $5\angle ABE=3\angle AED$일 때, $\angle ACD$를 구하면? (5점)`,
    choices: [String.raw`$54^\circ$`, String.raw`$52^\circ$`, String.raw`$50^\circ$`, String.raw`$48^\circ$`, String.raw`$46^\circ$`],
    answer: "①",
    solution: String.raw`[키포인트] 호 $BC$의 크기와 교차하는 두 현이 만드는 각의 식을 세운다.\n호 $BC$의 길이가 원 둘레의 $\dfrac15$이므로 $\wideparen{BC}=72^\circ$이다. $\wideparen{AD}=d^\circ$라 하자.\n$E$가 $AC$와 $BD$의 교점이므로 $\angle ABE=\angle ABD=\dfrac{d}{2}$이고, $\angle AED=\dfrac{d+72}{2}$이다.\n$5\angle ABE=3\angle AED$이므로 $5d=3(d+72)$, 따라서 $d=108$이다.\n$\angle ACD$는 $\wideparen{AD}$에 대한 원주각이므로 $\angle ACD=54^\circ$이다.\n따라서 정답은 ①이다.`
  }),
  q({
    id: 22, level: "중", unit: "통계", type: "서술형", tags: ["서술형", "그래프"], image: `${IMG}/q22.png`,
    content: String.raw`[서술형 1]\n다음 막대그래프는 세 학생 $A$, $B$, $C$가 각각 과녁판에 14회씩 활을 쏘아 얻은 점수를 조사하여 나타낸 것이다.`,
    answer: String.raw`학생 $B$, 분산이 가장 작기 때문이다.`,
    solution: String.raw`[키포인트] 세 학생의 점수는 모두 평균 $8$을 중심으로 분포하므로 평균에서 떨어진 정도를 제곱해 비교한다.\n학생 $A$의 분산은 $\dfrac{2\cdot(6-8)^2+3\cdot(7-8)^2+4\cdot0^2+3\cdot(9-8)^2+2\cdot(10-8)^2}{14}=\dfrac{11}{7}$이다.\n학생 $B$의 분산은 $\dfrac{4\cdot(7-8)^2+6\cdot0^2+4\cdot(9-8)^2}{14}=\dfrac{4}{7}$이다.\n학생 $C$의 분산은 $\dfrac{4\cdot(6-8)^2+3\cdot(7-8)^2+3\cdot(9-8)^2+4\cdot(10-8)^2}{14}=\dfrac{19}{7}$이다.\n분산이 가장 작은 학생은 $B$이므로 학생 $B$의 점수가 가장 고르게 나타난다.\n따라서 구하는 답은 학생 $B$, 분산이 가장 작기 때문이다.`
  }),
  q({
    id: 23, level: "중", unit: "통계", type: "서술형", tags: ["서술형"], image: `${IMG}/q23.png`,
    content: String.raw`[서술형 2]\n다음은 어느 지역의 5일 동안의 정오 기온의 편차이다.`,
    answer: String.raw`(1) $3$  (2) $\sqrt{6}$`,
    solution: String.raw`[키포인트] 편차의 합은 $0$이고, 표준편차는 편차의 제곱의 평균의 양의 제곱근이다.\n(1) $2+x-4+0-1=0$이므로 $x=3$이다.\n(2) 분산은 $\dfrac{2^2+3^2+(-4)^2+0^2+(-1)^2}{5}=\dfrac{30}{5}=6$이다. 따라서 표준편차는 $\sqrt{6}$이다.\n따라서 구하는 값은 (1) $3$, (2) $\sqrt{6}$이다.`
  }),
  q({
    id: 24, level: "상", unit: "통계", type: "서술형", tags: ["서술형"],
    content: String.raw`[서술형 3]\n4개의 자료 $x,y,3,5$의 평균이 4이고, 분산이 10일 때, 4개의 자료 $x,y,6,2$의 평균, 분산, 표준편차를 구하고 그 과정을 서술하시오. (8점)`,
    answer: String.raw`평균 $4$, 분산 $\dfrac{23}{2}$, 표준편차 $\dfrac{\sqrt{46}}{2}$`,
    solution: String.raw`[키포인트] 첫 자료의 평균과 분산으로 $x+y$와 $(x-4)^2+(y-4)^2$를 구해 새 자료에 그대로 이용한다.\n첫 자료의 평균이 $4$이므로 $x+y+3+5=16$, 따라서 $x+y=8$이다.\n분산이 $10$이므로 편차의 제곱의 합은 $40$이다. 따라서 $(x-4)^2+(y-4)^2+(3-4)^2+(5-4)^2=40$에서 $(x-4)^2+(y-4)^2=38$이다.\n새 자료 $x,y,6,2$의 합은 $x+y+8=16$이므로 평균은 $4$이다. 편차의 제곱의 합은 $38+(6-4)^2+(2-4)^2=38+4+4=46$이다.\n따라서 분산은 $\dfrac{46}{4}=\dfrac{23}{2}$이고, 표준편차는 $\sqrt{\dfrac{23}{2}}=\dfrac{\sqrt{46}}{2}$이다.\n따라서 구하는 값은 평균 $4$, 분산 $\dfrac{23}{2}$, 표준편차 $\dfrac{\sqrt{46}}{2}$이다.`
  }),
  q({
    id: 25, level: "중", unit: "통계", type: "서술형", tags: ["서술형", "그래프"], image: `${IMG}/q25.png`,
    content: String.raw`[서술형 4]\n아래 물음에 답하시오. (4점)\n다음 그림은 학생 20명의 과학 성적과 수학 성적에 대한 산점도이다.`,
    answer: String.raw`(1) $45\%$  (2) 양의 상관관계`,
    solution: String.raw`[키포인트] 가로축이 과학 성적, 세로축이 수학 성적이므로 과학 성적이 더 높은 학생은 $x\gt y$인 점을 센다.\n(1) $x\gt y$인 점은 $(50,40)$, $(60,40)$, $(60,50)$, $(70,50)$, $(70,60)$, $(80,60)$, $(80,70)$, $(90,80)$, $(100,90)$의 9개이다. 따라서 비율은 $\dfrac{9}{20}\times100=45\%$이다.\n(2) 과학 성적이 높을수록 수학 성적도 대체로 높아지는 경향이 있으므로 양의 상관관계가 있다.\n따라서 구하는 답은 (1) $45\%$, (2) 양의 상관관계이다.`
  })
];
