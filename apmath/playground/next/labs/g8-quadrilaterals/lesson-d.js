/* 평행사변형의 판정과 반례: 원본 조건·보기와 결속한 원클릭 해설. */
(function () {
  'use strict';
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g8-quadrilaterals'] = all['g8-quadrilaterals'] || {};
  const ch = (title, cues) => ({ title, length: 12, cues });
  const cue = (at, say, step, set) => ({ at, say, ...(step == null ? {} : { step }), ...(set ? { set } : {}) });
  const defaults = { qbLen: 5, qbBc: 5, qbH: 4, qbBeta: 66, qbK: 0, qbL: 12, qbE: 2, qbHb: 3,
    qbA: 66, qbW: 8, qbS: 4, qbTa: 4, qbTb: 10, qbTh: 4, qbK1: 3, qbK2: 6, qbKq: 4,
    qbTh2: 70, qbM: 3, qbN: 6, qbNb: 3, qbNd: 6, qbNa: 4, qdTrace: 0, qdMatch: 0 };
  const falsePk = f => ({ wantTrue: false, f: [f], ts: [0, 1, 2, 3] });
  const truePk = { wantTrue: true, t: 4, f: [0, 1, 3, 4] };
  function make(label, title, answer, chapters, options = {}) {
    chapters[0].start = { ...defaults, ...(options.start || {}) };
    const first = chapters[0].cues[0];
    first.set = { qdLessonProblem: !!options.problem, qdShowAnswer: false, qdCalculationReady: false,
      qdSeed: 0, qdOrd: [1, 2, 0, 3, 4], qbPk: options.pk || truePk,
      qbOn: [true, false, false, false, false], qbPa: { x: 1.6, y: -4 }, qbPd: { x: 8.6, y: -4 },
      qbCn: 'trap', qdDCondition: options.condition || '', qdDQuestion: options.question || '',
      qdCompare: false, qdLine: '', ...(options.set || {}), ...(first.set || {}) };
    if (!first.to && first.step == null) Object.assign(first, { to: { qdTrace: 1 }, dur: 4 });
    return { label, title, tab: 'review', answer, answerText: answer,
      summary: '주어진 조건을 표시하고 합동 또는 반례로 판정해요',
      task: '직접 해 보기에서 조건을 바꾸며 성립 여부를 확인해 보세요', chapters };
  }
  const conditions = [
    { label: '대변 평행', given: 'AB∥DC, AD∥BC가 주어졌어요. 두 쌍을 따라가요.', plan: '대변은 마주 보는 변이에요. 이웃한 변과 구별해요.',
      a: 'AB와 DC가 한 쌍이고, AD와 BC가 다른 한 쌍이에요.', b: '두 쌍이 모두 평행한지 각각 확인해요.', end: '두 쌍의 대변이 평행하다는 정의를 그대로 만족해요.', question: '두 쌍의 대변이 각각 평행한 사각형은 어떤 사각형일까요?' },
    { label: '대변 길이', given: 'AB=CD, BC=DA예요. 같은 눈금이 마주 보고 있어요.', plan: '대각선 AC로 둘로 나누고 공통변을 더해요.',
      a: 'ABC와 CDA를 대응하는 순서로 떼어 놓았어요.', b: '세 쌍의 변이 같으므로 SSS 합동이에요.', end: '대응하는 엇각이 같아 두 쌍의 대변이 각각 평행해요.', question: '두 쌍의 대변의 길이가 각각 같으면 왜 평행사변형일까요?' },
    { label: '대각 크기', given: 'A와 C의 각이 같고, B와 D의 각도 같아요.', plan: '사각형의 네 내각의 합 360°를 이용해요.',
      a: '같은 각끼리 모으면 2×(∠A+∠B)=360°예요.', b: '따라서 이웃한 두 내각의 합은 180°예요.', end: '이웃각의 합과 평행선의 조건으로 두 쌍이 평행해요.', question: '두 쌍의 대각이 각각 같으면 왜 평행사변형일까요?' },
    { label: '서로 이등분', given: 'O는 교점이에요. OA=OC이고 OB=OD예요.', plan: 'O에서 마주 보는 두 삼각형을 비교해요.',
      a: 'AOB와 COD는 두 변과 맞꼭지각이 같아요.', b: 'SAS 합동이므로 대응하는 엇각이 같아요.', end: '나머지 두 삼각형도 비교하면 두 쌍의 대변이 평행해요.', question: '두 대각선이 서로 이등분하는 사각형은 어떤 사각형일까요?' },
    { label: '한 쌍 조건', given: 'AD∥BC이고 AD=BC예요. 바로 그 두 변을 보아요.', plan: '대각선 AC를 그어 두 삼각형을 만들어요.',
      a: 'ADC와 CBA는 AD=CB, 공통변 AC가 있어요.', b: '끼인각은 엇각으로 같으므로 SAS 합동이에요.', end: '대응하는 엇각이 같아 AB∥DC도 얻어요.', question: '한 쌍의 대변이 평행하고 그 길이가 같으면 왜 평행사변형일까요?' }
  ];
  function conditionConcept(i) {
    const item = conditions[i], pair = [1, 3, 4].includes(i);
    return make(item.label, '조건에서 도형의 성질로', '□ABCD는 평행사변형이다', [
      ch('주어진 조건을 표시', [cue(0, item.given), cue(6, item.plan, 1)]),
      ch('조건을 연결하는 이유', [cue(0, item.a, 2, { qdCompare: pair, qdLine: i === 2 ? '2×(∠A+∠B)=360°' : '' }), cue(6, item.b, 2, { qdCalculationReady: true })]),
      ch('평행한 두 쌍을 확인', [pair ? { at: 0, say: '대응하는 꼭짓점을 맞추어 겹쳐 보아요.', to: { qdMatch: 1 }, dur: 4 } : cue(0, item.end, 3),
        cue(6, pair ? item.end : '두 쌍의 대변이 각각 평행하므로 평행사변형이에요.', 3, { qdCompare: false, qdShowAnswer: true, qdLine: '□ABCD는 평행사변형이다' })])
    ], { condition: 't' + (i + 1), question: item.question, set: { qbOn: conditions.map((_, j) => i === j) } });
  }
  const counterData = [
    { id: 'f1', index: 0, qid: 'q2-5', label: '평행과 길이', title: '평행한 변과 같은 변의 짝', given: 'AD∥BC이고 AB=DC예요. 서로 다른 두 쌍이에요.',
      compare: '평행한 AD와 BC의 길이를 직접 비교해요.', a: '이 그림은 AD=4이고 BC=10이에요.', b: '주어진 평행과 같은 옆변 조건은 모두 만족해요.',
      reason: '평행사변형이라면 마주 보는 AD와 BC도 같아야 해요.', result: '두 길이가 다른 등변사다리꼴이 반례예요.', answer: '평행사변형이라고 할 수 없다' },
    { id: 'f4', index: 3, qid: 'q2-6', label: '수직 반례', title: '대각선이 수직인 사각형', given: 'AC와 BD가 O에서 수직으로 만나는 그림을 보아요.',
      compare: '직각 표시와 대각선의 반쪽 길이는 다른 조건이에요.', a: 'OB=OD=4지만 OA=3, OC=6이에요.', b: '수직인 조건은 맞지만 AC는 이등분되지 않았어요.',
      reason: '마름모라면 평행사변형이어서 두 대각선이 서로 이등분해요.', result: '이 그림은 연 모양 반례이므로 마름모라고 못 해요.', answer: '마름모라고 할 수 없다' },
    { id: 'f3', index: 2, qid: 'q2-7', label: '같은 대각선', title: '대각선 길이와 반쪽 길이', given: 'OA=OD=3이고 OB=OC=6인 그림이에요.',
      compare: '대각선 전체의 길이와 반쪽 길이를 구분해요.', a: 'AC=3+6=9이고 BD=6+3=9예요.', b: '전체 길이는 같아도 OA와 OC는 서로 달라요.',
      reason: '직사각형이라면 두 대각선이 서로 이등분해야 해요.', result: '등변사다리꼴인 이 그림이 반례가 돼요.', answer: '직사각형이라고 할 수 없다' },
    { id: 'f5', index: 4, qid: 'q2-8', label: '한쪽 이등분', title: '이등분에서 서로의 뜻', given: 'O는 교점이고 OB=OD=4로 BD가 이등분돼요.',
      compare: '다른 대각선 AC도 반으로 나뉘는지 확인해요.', a: 'OA=3, OC=6이므로 AC는 이등분되지 않았어요.', b: '한쪽이 이등분되는 조건은 만족하는 그림이에요.',
      reason: '평행사변형은 OA=OC와 OB=OD를 함께 만족해요.', result: '한쪽만 이등분된 이 그림이 반례예요.', answer: '평행사변형이라고 할 수 없다' },
    { id: 'f2', index: 1, qid: 'q2-9', label: '이웃변 비교', title: '같은 변의 이름을 따라가기', given: 'AB=BC, CD=DA의 같은 눈금을 따라가요.',
      compare: 'AB와 BC는 B에서, CD와 DA는 D에서 만나요.', a: '이웃한 변끼리 같고 대변끼리 같다는 조건은 없어요.', b: 'OA=OC=4이고 OB=3, OD=6인 연 모양이에요.',
      reason: 'OB와 OD가 달라 두 대각선이 서로 이등분하지 않아요.', result: '이웃한 변끼리 같은 연 모양이 반례예요.', answer: '평행사변형이라고 할 수 없다' }
  ];
  function counterConcept(item) {
    return make(item.label, item.title, item.answer, [
      ch('주어진 조건을 표시', [cue(0, item.given), cue(6, item.compare, 1)]),
      ch('조건과 반쪽 길이 비교', [cue(0, item.a, 2, { qdCalculationReady: true }), cue(6, item.b, 2)]),
      ch('반례로 판단하기', [cue(0, item.reason, 3), cue(6, item.result, 3, { qdShowAnswer: true, qdLine: item.answer })])
    ], { condition: item.id, question: item.id === 'f2' ? 'AB=BC, CD=DA인 사각형은 반드시 평행사변형일까요?' : '' });
  }
  function falseQuestion(item) {
    return make('반례찾기', '성립하지 않는 조건 고르기', '③', [
      ch('문제가 묻는 방향', [cue(0, '평행사변형이 되는 조건이 아닌 보기를 찾아요.'), cue(6, '조건이 충분한 보기와 반례가 있는 보기를 구분해요.', 1)]),
      ch('두 쌍의 대변 조건', [cue(0, '① 두 쌍의 대변이 평행한 것은 정의예요.', 2, { qdDCondition: 't1' }), cue(6, '② 두 쌍의 대변이 같은 것은 SSS 합동으로 증명돼요.', 2, { qdDCondition: 't2' })]),
      ch('대각과 대각선 조건', [cue(0, '④ 두 쌍의 대각이 같으면 이웃각의 합은 180°예요.', 2, { qdDCondition: 't3' }), cue(6, '⑤ 서로 이등분하면 SAS 합동으로 평행을 얻어요.', 2, { qdDCondition: 't4' })]),
      ch('남은 조건의 반례', [cue(0, item.given, 3, { qdDCondition: item.id }), cue(4, item.a, 3), cue(8, '조건은 만족해도 평행사변형은 아니므로 정답은 ③이에요.', 5, { qdShowAnswer: true, qdLine: '③은 반례가 있어 판정 조건이 아니다' })])
    ], { problem: true, pk: falsePk(item.index) });
  }
  function trueQuestion() {
    return make('조건찾기', '성립하는 조건 고르기', '③', [
      ch('평행과 같은 길이의 짝', [cue(0, '평행사변형을 반드시 만드는 조건을 찾아요.'), cue(6, '①은 평행한 변과 길이가 같은 변이 다른 쌍이에요.', 1, { qdDCondition: 'f1' })]),
      ch('이웃한 변과 수직 조건', [cue(0, '② 이웃한 변끼리 같으면 연 모양이 가능해요.', 2, { qdDCondition: 'f2' }), cue(6, '④ 대각선이 수직이어도 서로 이등분하지 않을 수 있어요.', 2, { qdDCondition: 'f4' })]),
      ch('한쪽만 나누는 조건', [cue(0, '⑤ OB=OD만으로는 OA=OC를 보장하지 못해요.', 2, { qdDCondition: 'f5' }), cue(6, '같은 한 쌍에 평행과 같은 길이가 함께 있는지 찾아요.')]),
      ch('충분한 조건 확인', [cue(0, '③ AD∥BC, AD=BC에서 대각선 AC를 그어요.', 3, { qdDCondition: 't5' }), cue(4, 'SAS 합동의 대응각으로 나머지 대변도 평행해요.', 4), cue(8, '평행한 바로 그 한 쌍의 길이도 같은 ③이 정답이에요.', 5, { qdShowAnswer: true, qdLine: '③은 한 쌍의 대변이 평행하고 길이도 같다' })])
    ], { problem: true, pk: truePk });
  }
  lessons['q2-1'] = [...conditions.map((_, i) => conditionConcept(i)), trueQuestion(), falseQuestion(counterData[0])];

  function parallelValue(perimeter) {
    return make(perimeter ? '둘레' : '대각의 크기', '한 쌍의 조건으로 값 구하기', perimeter ? '둘레=18' : 'x=66°', [
      ch('주어진 평행과 같은 길이', [cue(0, perimeter ? 'AD∥BC, AD=BC=5이고 AB=4예요.' : 'AD∥BC, AD=BC이고 B의 각은 66°예요.'), cue(6, '같은 한 쌍에 평행과 길이가 같은 조건이 모두 있어요.', 1)]),
      ch('평행사변형의 성질 연결', [cue(0, '대각선으로 나눈 두 삼각형은 SAS 합동이에요.', 2), cue(6, perimeter ? '평행사변형이므로 CD=AB=4예요.' : '평행사변형의 마주 보는 각 B와 D가 같아요.', 3, { qdCalculationReady: true, qdLine: perimeter ? 'AD=BC=5, AB=CD=4' : '∠D=∠B' })]),
      ch('물어본 값 계산', [cue(0, perimeter ? '둘레는 네 변을 모두 더한 길이예요.' : 'D는 B의 이웃각이 아닌 마주 보는 각이에요.', 3), cue(6, perimeter ? '둘레=5+4+5+4=18이에요.' : '따라서 x=∠D=66°예요.', 5, { qdShowAnswer: true, qdLine: perimeter ? '둘레=18' : 'x=66°' })])
    ], { problem: true, start: { qbK: perimeter ? 1 : 0 } });
  }
  lessons['q2-2'] = [make('조건 증명', '같은 한 쌍의 조건 연결', '□ABCD는 평행사변형이다', [
    ch('같은 두 변에 주어진 조건', [cue(0, 'AD∥BC, AD=BC예요. 대각선 AC를 그어요.'), cue(6, '평행선의 엇각 DAC와 BCA가 같아요.', 1)]),
    ch('두 삼각형의 대응', [cue(0, 'ADC와 CBA를 같은 순서로 떼어 놓았어요.', 2, { qdCompare: true }), cue(6, 'AD=CB, AC 공통, 끼인각이 같아 SAS 합동이에요.', 2)]),
    ch('나머지 평행을 얻기', [{ at: 0, say: '대응하는 부분이 맞도록 두 삼각형을 겹쳐요.', to: { qdMatch: 1 }, dur: 4 }, cue(6, '엇각 DCA와 BAC도 같아 AB∥DC인 평행사변형이에요.', 3, { qdCompare: false, qdShowAnswer: true, qdLine: '□ABCD는 평행사변형이다' })])
  ], { condition: 't5' }), parallelValue(false), parallelValue(true)];

  function hiddenValue(ef) {
    return make(ef ? 'EF 길이' : 'AE 길이', '수선의 발 사이의 길이', ef ? 'x=8' : 'x=2', [
      ch('전체 길이와 물은 부분', [cue(0, ef ? 'AC=12, AE=2예요. 수선의 발 E와 F 사이를 구해요.' : 'AC=12, EF=8이에요. 왼쪽 끝 AE의 길이를 구해요.'), cue(6, 'AB=CD이고 두 수선의 발에는 직각 표시가 있어요.', 1)]),
      ch('직각삼각형을 비교', [cue(0, 'ABE와 CDF는 빗변과 예각이 같아 RHA 합동이에요.', 2, { qdCompare: true }), cue(6, 'A↔C, B↔D, E↔F이므로 AE=CF예요.', 2)]),
      ch('전체에서 부분 나누기', [{ at: 0, say: '두 삼각형을 겹쳐서 같은 대응변을 확인해요.', to: { qdMatch: 1 }, dur: 3 }, cue(4, ef ? 'AC에서 AE와 CF를 각각 빼요.' : 'AC에서 EF를 빼면 같은 AE와 CF가 남아요.', 3, { qdCompare: false, qdCalculationReady: true, qdLine: 'AC=AE+EF+CF, AE=CF' }), cue(8, ef ? 'x=EF=12−2×2=8이에요.' : 'x=AE=(12−8)÷2=2예요.', 5, { qdShowAnswer: true, qdLine: ef ? 'x=8' : 'x=2' })])
    ], { problem: true, start: { qbK: ef ? 1 : 0 } });
  }
  lessons['q2-3'] = [make('도형 판정', '수선의 발로 만든 사각형', '□EBFD는 평행사변형이다', [
    ch('수선과 같은 빗변', [cue(0, '평행사변형 ABCD에서 BE와 DF는 AC에 수직이에요.'), cue(6, '같은 직선에 수직인 두 선분 BE와 DF는 평행해요.', 1)]),
    ch('직각삼각형의 합동', [cue(0, 'AB=CD이고 엇각 BAE와 DCF가 같아요.', 2, { qdCompare: true }), cue(6, 'ABE와 CDF는 RHA 합동이므로 BE=DF예요.', 2)]),
    ch('같은 한 쌍의 대변', [{ at: 0, say: '대응점 A↔C, B↔D, E↔F를 맞춰 겹쳐요.', to: { qdMatch: 1 }, dur: 4 }, cue(6, 'BE∥DF이고 BE=DF이므로 EBFD는 평행사변형이에요.', 3, { qdCompare: false, qdShowAnswer: true, qdLine: '□EBFD는 평행사변형이다' })])
  ], { question: '두 수선의 발 E, F와 꼭짓점 B, D를 이은 사각형 EBFD는 어떤 사각형일까요?' }), hiddenValue(false), hiddenValue(true)];

  function proofValue(blank) {
    return make(blank ? '증명 빈칸' : '외각의 크기', '이웃한 각에서 동위각으로', blank ? '③ ∠EAD' : 'x=114°', [
      ch('같은 대각과 연장선', [cue(0, blank ? 'A=C=66°, B=D=114°예요. BA를 A 너머로 늘려요.' : 'A=C, B=D이고 A=66°예요. E는 BA의 연장선 위예요.'), cue(6, 'A의 내각과 EAD는 일직선 위에서 만나는 이웃각이에요.', 1)]),
      ch('두 이웃각의 합 비교', [cue(0, '네 내각의 합이 360°라서 A와 B의 합은 180°예요.', 2, { qdCalculationReady: true, qdLine: '∠A+∠B=180°' }), cue(6, '일직선에서는 A와 EAD의 합도 180°예요.', 2, { qdLine: '∠A+∠EAD=180°' })]),
      ch('물은 각과 빈칸 확인', [cue(0, '두 식에서 같은 A를 빼면 B와 EAD가 같아요.', 3), cue(6, blank ? 'B와 동위각인 EAD를 넣으므로 정답은 ③이에요.' : 'x=∠EAD=180°−66°=114°예요.', 5, { qdShowAnswer: true, qdLine: blank ? '③ ∠EAD, AD∥BC' : 'x=114°' })])
    ], { problem: true, start: { qbK: blank ? 1 : 0 } });
  }
  lessons['q2-4'] = [make('대각 증명', '같은 대각에서 평행선 얻기', '□ABCD는 평행사변형이다', [
    ch('두 쌍의 같은 내각', [cue(0, 'A=C, B=D예요. 같은 호끼리 같은 각이에요.'), cue(6, '네 내각의 합을 같은 각끼리 묶어 보아요.', 1)]),
    ch('이웃한 내각의 합', [cue(0, '2×(∠A+∠B)=360°이므로 그 절반을 구해요.', 2, { qdLine: '2×(∠A+∠B)=360°' }), cue(6, '따라서 ∠A+∠B=180°예요.', 2, { qdLine: '∠A+∠B=180°' })]),
    ch('연장선과 동위각 비교', [cue(0, 'BA를 A 너머로 늘린 점 E를 잡아요.', 3), cue(6, '∠A+∠EAD=180°라서 ∠B=∠EAD예요.', 3, { qdLine: '∠B=∠EAD' })]),
    ch('평행한 두 쌍 확인', [cue(0, '같은 동위각이므로 AD∥BC예요.', 4), cue(6, '같은 방법으로 AB∥DC도 얻어 평행사변형이에요.', 4, { qdShowAnswer: true, qdLine: '□ABCD는 평행사변형이다' })])
  ], { question: '두 쌍의 대각이 같은 사각형에서 연장선을 그어 두 쌍의 대변이 평행함을 설명해 보세요.' }), proofValue(false), proofValue(true)];
  for (const item of counterData) lessons[item.qid] = [counterConcept(item), falseQuestion(item)];
  lessons['q2-9'].splice(1, 0, make('마주변 비교', '같은 변의 짝을 바꾸기', '□ABCD는 평행사변형이다', [
    ch('마주 보는 같은 변', [cue(0, '이번에는 AB=CD, BC=DA예요. 마주 보는 변끼리예요.'), cue(6, '대각선 AC를 그으면 두 삼각형이 생겨요.', 1)]),
    ch('세 변과 대응각', [cue(0, 'ABC와 CDA는 세 쌍의 변이 같아 SSS 합동이에요.', 2, { qdCompare: true }), cue(6, '합동인 대응각 중 두 쌍의 엇각을 찾아요.', 2)]),
    ch('두 쌍의 평행을 얻기', [{ at: 0, say: 'A↔C, B↔D, C↔A를 맞추어 겹쳐요.', to: { qdMatch: 1 }, dur: 4 }, cue(6, '두 쌍의 대변이 각각 평행하므로 평행사변형이에요.', 3, { qdCompare: false, qdShowAnswer: true, qdLine: '□ABCD는 평행사변형이다' })])
  ], { condition: 't2', question: 'AB=CD, BC=DA인 사각형은 왜 평행사변형일까요?', set: { qbCn: 'ok' } }));
})();
