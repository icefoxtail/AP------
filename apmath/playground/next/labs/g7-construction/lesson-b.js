/* 삼각형의 결정·합동 조건: 원본 문제와 대응 관계를 고정한 해설. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = window.APL_LESSONS['g7-construction'] = window.APL_LESSONS['g7-construction'] || {};
  const ch = (title, cues, length = 10) => ({ title, length, cues });
  function make(title, label, answer, chapters, options = {}) {
    chapters[0].start = {
      cnBT: 0, cnCt: 0, cnBTrace: 0, cnSa: 6, cnSb: 7, cnSc: 8, cnSphi: 70,
      cnMb: 6, cnMc: 7, cnMA: 50, cnMp: 0, cnAA: 55, cnAB: 65, cnAc: 6,
      cnKp: 0, cnLa: 3, cnLb: 4, cnLd: 1, cnLt: 0, cnCx: 2.6, cnCy: 3.6,
      cnEA: 55, cnEB: 65, cnVa: 6, cnVb: 7, cnVc: 8, cnWs1: 6, cnWs2: 7, cnWth: 50, cnUc: 6, cnUa: 50, cnUb: 60,
      ...(options.start || {}), ...(chapters[0].start || {})
    };
    const first = chapters[0].cues[0];
    first.set = {
      cnShowAnswer: false, cnLessonProblem: !!options.problem, cnBMode: options.mode || 'concept', cnBStage: 0,
      cnBChoice: 0, cnBPart: -1, cnBAngle: false, cnBKind: '', cnCond: 'SSS', cnMmode: 'inc', cnKmode: 'aaa',
      cnGv: 0, cnAdd: [], cnTy: 0, cnPk: options.pk || { k: 0 }, ...(options.set || {}), ...(first.set || {})
    };
    if (!first.to) Object.assign(first, { to: options.motion || { cnBT: .5 }, dur: 4 });
    return { title, label, tab: 'review', answer, answerText: answer, summary: '주어진 변과 각의 위치를 확인하고 삼각형의 결정·합동 조건을 판단해요', task: '직접 해 보기에서 다른 조건과 비교해 보세요', chapters };
  }
  const choices = {
    sss: [
      [0, '① 세 변이 5, 4, 9 cm인 조건이에요.', '가장 긴 9는 5+4와 같아 일직선이 돼요.', '삼각형이 만들어져야 결정 조건을 따질 수 있어요.'],
      [1, '② CA=4 cm와 ∠C=70°만 주어졌어요.', '한 변과 한 각을 지켜도 다른 변의 길이는 달라져요.', '이 조건만으로 크기와 모양을 하나로 정할 수 없어요.'],
      [2, '③ BC=8 cm, BA=4 cm만 주어졌어요.', '두 변 사이의 각을 바꿔도 주어진 길이는 같아요.', '두 변만으로는 여러 삼각형을 만들 수 있어요.'],
      [4, '⑤ CA=9 cm, AB=7 cm, ∠C=45°예요.', '∠C는 CA와 AB가 만나는 A의 각이 아니에요.', '끼인각이 아니어서 서로 다른 두 후보가 생겨요.'],
      [3, '④ AB=4 cm, BC=6 cm, CA=6 cm예요.', '6<4+6이므로 삼각형을 만들 수 있어요.', '세 변이 정해지는 SSS 조건이므로 정답은 ④예요.']
    ],
    sas: [
      [0, '① CA=4 cm, CB=7 cm만 주어졌어요.', '두 변의 길이를 유지해도 사이의 각은 바뀔 수 있어요.', '두 변만으로는 하나로 정해지지 않아요.'],
      [1, '② CA=4 cm, ∠C=70°만 주어졌어요.', '주어진 각을 유지하면서 다른 변을 늘릴 수 있어요.', '한 변과 한 각만으로는 부족해요.'],
      [3, '④ 세 각이 모두 60°인 조건이에요.', '각을 유지해도 변의 길이가 다른 삼각형이 가능해요.', '세 각만으로는 크기가 정해지지 않아요.'],
      [4, '⑤ AB=5 cm, BC=3 cm, CA=8 cm예요.', '8=5+3이므로 막대가 일직선이 돼요.', '이 길이로는 삼각형이 만들어지지 않아요.'],
      [2, '③ AB=8 cm, AC=6 cm, ∠A=90°예요.', '∠A는 AB와 AC가 만나는 꼭짓점의 끼인각이에요.', '두 변과 끼인각인 SAS 조건, 정답은 ③예요.']
    ],
    asa: [
      [0, '① AB=4 cm, AC=4 cm만 주어졌어요.', '두 변은 같게 두고 사이의 각을 바꿀 수 있어요.', '두 변만으로는 삼각형이 정해지지 않아요.'],
      [1, '② AB=4 cm, BC=5 cm, CA=10 cm예요.', '가장 긴 10은 4+5보다 커서 닿지 않아요.', '삼각형이 만들어지지 않는 조건이에요.'],
      [2, '③ BC=9 cm, CA=6 cm, ∠B=40°예요.', 'BC와 CA 사이의 각은 ∠C라서 ∠B는 끼인각이 아니에요.', '같은 조건으로 서로 다른 두 후보가 생겨요.'],
      [4, '⑤ 세 각이 30°, 60°, 90°예요.', '세 각이 같아도 크기가 다른 삼각형을 만들 수 있어요.', '세 각만으로는 변의 길이를 정하지 못해요.'],
      [3, '④ AB=5 cm, ∠A=80°, ∠B=40°예요.', 'AB의 양 끝 A, B에 있는 두 각이 정해졌어요.', '한 변과 양 끝각인 ASA 조건, 정답은 ④예요.']
    ]
  };
  function choiceLesson(kind, pk) {
    const last = choices[kind].at(-1)[0], answer = `정답은 ${['①', '②', '③', '④', '⑤'][last]}`;
    return make('삼각형이 하나로 정해지는 보기', '보기 판별', answer, choices[kind].map(([index, a, b, c], i) => {
      const chapter = ch(`보기 ${['①', '②', '③', '④', '⑤'][index]} 확인`, [
        { at: 0, say: a, set: { cnBChoice: index, cnBStage: 0 }, to: { cnBT: 1 }, dur: 4 },
        { at: 5, say: b, set: { cnBStage: 1 } },
        { at: 9, say: c, set: i === 4 ? { cnBStage: 2, cnShowAnswer: true } : { cnBStage: 2 } }
      ], 12); chapter.start = { cnBT: 0 }; return chapter;
    }), { problem: true, mode: 'choices', pk });
  }
  Object.assign(lessons, {
    'c3-1': [make('세 변으로 삼각형 결정하기', '세 변', 'SSS: 삼각형이 하나로 정해져요', [
      ch('변의 이름과 주어진 길이', [{ at: 0, say: 'a=BC=6, b=CA=7, c=AB=8 cm예요.' }, { at: 5, say: '가장 긴 변도 8<6+7이라 삼각형을 만들 수 있어요.', step: 1 }]),
      ch('두 원의 교점 찾기', [{ at: 0, say: 'AB를 놓고 A에서 7, B에서 6만큼 떨어진 점을 찾아요.', set: { cnBStage: 1 }, to: { cnBT: 1 }, dur: 4 }, { at: 5, say: '두 원이 만나는 점에 C를 놓으면 세 변이 모두 맞아요.', step: 2 }]),
      ch('위아래 교점과 합동', [{ at: 0, say: '밑변 아래의 교점도 뒤집으면 같은 삼각형이 돼요.' }, { at: 5, say: '모양과 크기가 하나로 정해져요. SSS 조건이에요.', set: { cnShowAnswer: true }, step: 3 }])
    ]), choiceLesson('sss')]
  });
})();
