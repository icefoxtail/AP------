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
    ]), bankLesson(standardBank)],
    's2-3': [concept('한 평면에 수직인 두 직선', true, [
      '바닥 P에 수직인 서로 다른 직선 l, m을 세워요.', 'm의 자리를 옮겨도 기울이지 않아 수직을 유지해요.',
      'P에 수직인 직선의 방향은 하나로 정해져요.', '두 직선의 자리는 달라도 똑같은 방향으로 서요.',
      '서로 다른 두 직선의 방향이 같으므로 평행해요.'
    ]), bankLesson(standardBank)],
    's2-4': [concept('한 평면에 수직인 두 평면', false, [
      '바닥 P에 수직인 두 벽 Q, R의 관계를 살펴요.', 'R을 돌려도 두 벽은 모두 바닥에 수직이에요.',
      '두 벽이 바닥과 이루는 각과 두 벽 사이 각은 달라요.', 'Q, R은 방향이 달라져 교선에서 만날 수 있어요.',
      '같은 바닥에 수직인 방의 앞벽과 옆벽이 반례예요.'
    ]), bankLesson(standardBank)],
    's2-5': [concept('한 직선에 수직인 두 평면', true, [
      '직선 l에 수직인 서로 다른 평면 P, Q를 놓아요.', 'Q를 l을 따라 옮겨도 기울이지 않아 수직을 유지해요.',
      'l에 수직인 평면의 방향은 하나로 정해져요.', 'P, Q는 같은 방향이며 서로 다른 자리에 있어요.',
      '두 평면은 끝없이 넓혀도 만나지 않으므로 평행해요.'
    ], ['p1', 'p2', 'p4', 'p6', 'p5']), bankLesson(['p1', 'p2', 'p4', 'p6', 'p5'])],
    's2-6': [concept('수직인 직선과 평면에 포함되는 직선', false, [
      'l은 P에 수직이고 m은 l에 수직인 조건이에요.', 'm을 P로 옮겨도 l과 m의 직각은 그대로예요.',
      '직선과 평면의 평행은 서로 만나지 않는 관계예요.', 'm이 P에 닿으면 m 전체가 P 위에 놓여요.',
      'P에 포함된 m은 P와 만나므로 평행의 반례예요.'
    ]), bankLesson(standardBank)],
    's2-7': [bankLesson(['p1', 'p2', 'p4', 'perp', 'planes'])],
    's5-1': [
      make('평면 위 한 직선과만 수직이면', '한 직선', '한 직선만으로는 부족해요', 'concept', 'one', [
        chapter('한 직선과 수직인 조건', [{ at: 0, say: 'P는 평면이고 m, n은 P 위에서 O에 만나요.' }, { at: 5, say: 'l과 m은 수직이에요. l을 m 둘레로 기울여 봐요.', step: 1 }]),
        chapter('다른 직선과 이루는 각', [{ at: 0, say: 'l이 기울어져도 m과 이루는 직각은 유지돼요.', step: 2 }, { at: 5, say: '그런데 l과 n이 이루는 각은 직각이 아니에요.', set: { spBStage: 1 } }]),
        chapter('한 직선만으로는 부족', [{ at: 0, say: '평면과 수직이면 O를 지나는 모든 직선과 수직이에요.' }, { at: 5, say: '반례가 있으니 한 직선과 수직인 것만으로는 부족해요.', set: { spShowAnswer: true } }])
      ], { q: { kind: 'prism', n: 3, face: 0 } }),
      make('평면과 수직을 확인하는 두 직선', '두 직선', 'l ⊥ P', 'concept', 'two', [
        chapter('서로 만나는 두 직선', [{ at: 0, say: 'P 위의 서로 다른 m, n은 한 점 O에서 만나요.' }, { at: 5, say: 'O를 지나는 l이 m과 n에 모두 수직인 조건이에요.', step: 1 }]),
        chapter('두 수직 조건 함께 확인', [{ at: 0, say: '그림을 돌려 보아도 두 직각 조건은 그대로예요.', step: 2 }, { at: 5, say: '두 조건을 지키면 l은 P에 똑바로 서는 방향이에요.', set: { spBStage: 1 } }]),
        chapter('평면과 직선의 수직', [{ at: 0, say: '이때 l은 O를 지나는 P 위의 모든 직선과 수직이에요.', step: 3 }, { at: 5, say: '따라서 l은 평면 P와 수직이에요. l⊥P예요.', set: { spShowAnswer: true } }])
      ], { q: { kind: 'prism', n: 3, face: 0 }, motion: { spYaw: -42 } }),
      make('삼각기둥의 면에 수직인 모서리', '수직 모서리', '수직인 모서리 = 3개', 'solid', 'edges', [
        chapter('실제 문제의 기준 면', [{ at: 0, say: '삼각기둥에서 기준 면은 삼각형 ABC예요.' }, { at: 5, say: '면 ABC와 수직인 모서리를 빠짐없이 찾아요.', step: 1 }]),
        chapter('한 모서리로 조건 확인', [{ at: 0, say: 'AD는 면 ABC 위에서 만나는 AB, AC와 수직이에요.' }, { at: 5, say: '그래서 AD는 면 ABC에 수직이에요.', set: { spBStage: 1 }, step: 2 }]),
        chapter('조건을 만족하는 모서리', [{ at: 0, say: '다른 꼭짓점에서도 같은 조건을 확인해요.' }, { at: 5, say: '면에 수직인 모서리는 AD, BE, CF예요.', set: { spBStage: 2 }, step: 3 }]),
        chapter('모서리 개수 세기', [{ at: 0, say: '면 위의 AB, BC, CA는 평면에 수직이 아니에요.' }, { at: 5, say: 'AD, BE, CF를 한 번씩 세면 모두 3개예요.', set: { spShowAnswer: true }, step: 4 }])
      ], { q: { kind: 'prism', n: 3, face: 0 }, motion: { spBTrace: 1 } })
    ],
    's5-2': [
      make('경첩에 달린 문과 바닥의 수직', '문과 바닥', 'P ⊥ Q', 'concept', 'door', [
        chapter('바닥과 경첩의 조건', [{ at: 0, say: 'P는 바닥이고 경첩 l은 P에 수직인 직선이에요.' }, { at: 5, say: '문을 나타내는 평면 Q는 경첩 l을 포함해요.', step: 1 }]),
        chapter('조건을 지키며 문 열기', [{ at: 0, say: '문을 열거나 닫아도 Q는 계속 l을 포함해요.', step: 2 }, { at: 5, say: 'Q 안에 P에 수직인 직선이 항상 있어요.', set: { spBStage: 1 } }]),
        chapter('두 평면의 수직 판단', [{ at: 0, say: '한 평면에 수직인 직선을 포함하는 평면을 보세요.', step: 3 }, { at: 5, say: '문 Q는 얼마나 열어도 바닥 P와 수직이에요.', set: { spShowAnswer: true } }])
      ], { q: { kind: 'cuboid', n: 4, face: 2 } }),
      make('직육면체의 한 면에 수직인 면', '수직인 면', '수직인 면 = 4개', 'solid', 'faces', [
        chapter('면 ABFE를 기준으로', [{ at: 0, say: '직육면체에서 기준 면은 앞면 ABFE예요.' }, { at: 5, say: '이 면과 직각으로 만나는 다른 면을 찾아요.', step: 1 }]),
        chapter('위아래 면 확인', [{ at: 0, say: '위아래 면 ABCD, EFGH는 ABFE와 직각으로 만나요.' }, { at: 5, say: '두 면을 표시하고 옆쪽 면도 살펴봐요.', set: { spBStage: 1 }, step: 2 }]),
        chapter('양옆 면 확인', [{ at: 0, say: '양옆 면 ADHE, BCGF도 ABFE와 직각으로 만나요.' }, { at: 5, say: 'ABCD, EFGH, ADHE, BCGF를 표시해요.', set: { spBStage: 2 }, step: 3 }]),
        chapter('제외할 면과 최종 개수', [{ at: 0, say: '자기 자신 ABFE와 평행한 뒷면 DCGH는 제외해요.' }, { at: 5, say: '기준 면 ABFE에 수직인 면은 모두 4개예요.', set: { spShowAnswer: true }, step: 4 }])
      ], { q: { kind: 'cuboid', n: 4, face: 2 }, motion: { spBTrace: 1 } })
    ],
    's5-3': [
      make('평행한 두 평면을 자르는 두 교선', '두 교선', 'l ∥ m', 'concept', 'intersections', [
        chapter('세 평면과 두 교선', [{ at: 0, say: 'P와 Q는 평행하고 R은 두 평면을 모두 잘라요.' }, { at: 5, say: 'R과 P의 교선은 m, R과 Q의 교선은 l이에요.', step: 1 }]),
        chapter('같은 평면에 있는지 확인', [{ at: 0, say: 'l, m은 모두 같은 평면 R 위에 있어요.', step: 2 }, { at: 5, say: 'P와 Q가 만나지 않으므로 두 교선도 만나지 않아요.', set: { spBStage: 1 } }]),
        chapter('두 교선의 위치 관계', [{ at: 0, say: '같은 평면 위에서 만나지 않는 두 직선이에요.', step: 3 }, { at: 5, say: '따라서 l∥m이에요. 꼬인 위치가 아니에요.', set: { spShowAnswer: true } }])
      ], { q: { kind: 'cuboid', n: 4, face: 0 } }),
      make('직육면체의 평행한 면을 짝짓기', '평행한 면', '평행한 면 = 3쌍', 'solid', 'pairs', [
        chapter('면의 쌍 세는 전략', [{ at: 0, say: '직육면체에서 서로 평행한 두 면의 쌍을 찾아요.' }, { at: 5, say: '이웃한 면은 만나므로 마주 보는 면끼리 비교해요.', step: 1 }]),
        chapter('위아래 면 한 쌍', [{ at: 0, say: '위아래 면 ABCD, EFGH는 끝없이 넓혀도 못 만나요.' }, { at: 5, say: '두 면 ABCD, EFGH를 한 쌍으로 표시해요.', set: { spBStage: 1 }, step: 2 }]),
        chapter('앞뒤 면 한 쌍', [{ at: 0, say: '앞뒤 면 ABFE, DCGH도 서로 만나지 않아요.' }, { at: 5, say: '두 면 ABFE, DCGH를 다음 쌍으로 표시해요.', set: { spBStage: 2 } }]),
        chapter('양옆 면 한 쌍', [{ at: 0, say: '양옆 면 ADHE, BCGF도 서로 만나지 않아요.' }, { at: 5, say: '두 면 ADHE, BCGF를 마지막 쌍으로 표시해요.', set: { spBStage: 3 }, step: 3 }]),
        chapter('같은 쌍을 한 번씩 세기', [{ at: 0, say: '같은 두 면은 순서를 바꾸어도 같은 쌍이에요.' }, { at: 5, say: '위아래, 앞뒤, 양옆을 세면 모두 3쌍이에요.', set: { spShowAnswer: true }, step: 4 }])
      ], { q: { kind: 'cuboid', n: 4, face: 0 }, motion: { spBTrace: 1 } })
    ]
  });
})();
