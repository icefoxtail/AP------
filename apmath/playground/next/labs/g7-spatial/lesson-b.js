/* 공간 명제의 반례와 실제 입체 문제를 원본 상태에 고정합니다. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = window.APL_LESSONS['g7-spatial'] = window.APL_LESSONS['g7-spatial'] || {};
  const num = ['①', '②', '③', '④', '⑤'];
  const standardBank = ['p1', 'p2', 'p4', 'p6', 'p3'];
  const chapter = (title, cues, length = 10) => ({ title, length, cues });
  function make(title, label, answer, mode, ask, chapters, options = {}) {
    chapters[0].start = { spT: options.t || 0, spBTrace: 0, spYaw: -30, spPitch: 24, ...(chapters[0].start || {}) };
    const first = chapters[0].cues[0];
    first.set = { spShowAnswer: false, spBStage: 0, spBMode: mode, spBAsk: ask, spBank: (options.bank || standardBank).slice(), spQ: options.q || null, spSel: 0, spSpin: false, ...(first.set || {}) };
    if (!first.to) Object.assign(first, { to: options.motion || { spT: 1 }, dur: 4 });
    return { title, label, tab: 'review', answer, answerText: answer, summary: '주어진 조건과 결론을 나누어 공간에서의 관계를 확인해요', task: '직접 해 보기에서 조건을 유지하며 다른 위치에서도 확인해 보세요', chapters };
  }
  const statements = {
    p1: ['l⊥m, l⊥n이면 m∥n이라는 설명이에요.', 'n을 돌려도 두 수직 조건은 계속 지켜져요.', 'm, n이 꼬인 위치가 되는 반례가 있어요.'],
    p2: ['P와 평행한 l, m은 서로 평행하다는 설명이에요.', 'm을 돌려도 l과 m은 모두 P와 만나지 않아요.', 'l, m이 꼬인 위치가 되는 반례가 있어요.'],
    p4: ['P에 수직인 Q, R은 서로 평행하다는 설명이에요.', 'R을 돌려도 두 평면은 모두 P에 수직이에요.', 'Q, R이 교선에서 만나는 반례가 있어요.'],
    p6: ['l⊥P, l⊥m이면 m∥P라는 설명이에요.', 'm을 P로 옮겨도 두 수직 조건은 유지돼요.', 'm이 P에 포함되면 평행이 아닌 반례예요.'],
    perp: ['P 위의 m과 l이 수직이면 l⊥P라는 설명이에요.', 'l을 기울여도 m과는 계속 수직이에요.', 'P 위의 다른 직선과 직각이 아닌 반례예요.'],
    p3: ['P에 수직인 서로 다른 l, m을 옮겨 봐요.', '평면에 수직인 직선의 방향은 하나로 정해져요.', '두 직선의 방향이 같고 서로 달라 항상 평행해요.'],
    p5: ['l에 수직인 서로 다른 평면 P, Q를 옮겨 봐요.', '직선에 수직인 평면의 방향은 하나로 정해져요.', '두 평면의 방향이 같고 서로 달라 항상 평행해요.'],
    planes: ['평행한 P, Q를 R로 자른 두 교선을 살펴봐요.', '두 교선은 R 위에 있고 P, Q가 평행해 못 만나요.', '같은 평면 위에서 만나지 않는 두 교선은 평행해요.']
  };
  function bankLesson(bank) {
    return make('공간 설명 다섯 보기 판별', '다섯 보기', '정답은 ⑤', 'bank', 'choose', bank.map((id, index) => {
      const truth = index === 4, text = statements[id];
      const c = chapter(`보기 ${num[index]}의 조건과 결론`, [
        { at: 0, say: `${num[index]} ${text[0]}`, set: { spSel: index, spBStage: 0 }, to: { spT: 1 }, dur: 4 },
        { at: 5, say: text[1], set: { spBStage: 1 }, step: 2 },
        { at: 9, say: truth ? '항상 성립하는 ⑤가 옳아요. 정답은 ⑤예요.' : text[2], set: truth ? { spBStage: 2, spShowAnswer: true } : { spBStage: 2 }, step: truth ? 4 : 2 }
      ], 12);
      c.start = { spT: 0 }; return c;
    }), { bank });
  }
  function concept(title, truth, lines, bank = standardBank) {
    return make(title, '관계 확인', `설명은 ${truth ? '참' : '거짓'}`, 'concept', 'relation', [
      chapter('조건을 지키며 움직이기', [{ at: 0, say: lines[0] }, { at: 5, say: lines[1], step: 1 }]),
      chapter('위치 관계 관찰', [{ at: 0, say: lines[2], step: 2 }, { at: 5, say: lines[3], set: { spBStage: 1 } }]),
      chapter('항상 성립하는지 판단', [{ at: 0, say: lines[4], step: 3 }, { at: 5, say: `따라서 설명은 ${truth ? '참' : '거짓'}이에요.`, set: { spShowAnswer: true } }])
    ], { bank });
  }
  Object.assign(lessons, {
    's2-1': [concept('한 직선에 수직인 두 직선', false, [
      'l에 수직인 m, n이 서로 평행한지 살펴봐요.', 'n을 l 둘레로 돌려도 l⊥m, l⊥n은 유지돼요.',
      '같은 평면 안에서만 생각하지 않고 공간을 살펴요.', 'm과 n은 만나지 않고 방향도 다른 꼬인 위치예요.',
      '조건을 지키지만 결론을 깨는 그림 하나면 반례예요.'
    ]), bankLesson(standardBank)],
    's2-2': [concept('한 평면에 평행한 두 직선', false, [
      'P와 평행한 두 직선 l, m의 관계를 살펴봐요.', 'm을 제자리에서 돌려도 두 직선은 P와 만나지 않아요.',
      '각 직선과 P의 관계를 두 직선끼리의 관계와 구별해요.', '두 직선 l, m은 꼬인 위치가 될 수 있어요.',
      'P와 각각 평행해도 두 직선끼리 평행하진 않아요.'
    ]), bankLesson(standardBank)]
  });
})();
