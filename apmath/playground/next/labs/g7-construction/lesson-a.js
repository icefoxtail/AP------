/* 작도와 삼각형의 조건: 원본 도구·작도 단계·문제 변형에 결속한 해설. */
(function () {
  'use strict';
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g7-construction'] = all['g7-construction'] || {};
  const begin = (problem, mode, extra = {}) => ({ cnShowAnswer: false, cnLessonProblem: problem, cnLessonMode: mode, cnSupportReady: false, cnCompareReady: false, cnUpperReady: false, cnLowerReady: false, cnRangeReady: false, cnCardsReady: 0, ...extra });
  const ch = (title, length, cues, start) => ({ title, length, ...(start ? { start } : {}), cues });
  const make = (label, title, answer, summary, task, chapters) => ({ label, title, answer, answerText: answer, summary, task, tab: 'review', chapters });
  const toolStart = (t = 0) => ({ cnL: 3, cnPhi: 20, cnT1: t, cnSeed: 0 });
  const toolSet = (problem, tool, kind = 0) => begin(problem, tool, { cnTool: tool, cnKind: kind, cnPk: { c: 0, w: [0, 1, 2, 3] } });

  lessons['c1-1'] = [
    make('자의쓰임', '눈금 없는 자로 그리는 것', '직선은 긋고 길이는 재지 않아요', '눈금 없는 자는 점들을 잇는 직선에 사용해요', '두 점의 위치를 바꾸고 두 점을 지나는 선을 그어 보세요', [
      ch('두 점을 자에 맞춰요', 12, [
        { at: 0, say: 'A와 B는 주어진 두 점이에요. 자의 곧은 모서리를 맞춰요.', set: toolSet(false, 'ruler'), to: { cnT1: 1 }, dur: 4 },
        { at: 5.5, say: '자를 따라 두 점을 잇고 양쪽으로 길게 그어 보아요.' }
      ], toolStart(0.3)),
      ch('눈금이 없다는 뜻', 12, [
        { at: 0, say: '자로 선을 그을 수 있지만 읽을 눈금은 없어요.' },
        { at: 5.5, say: '직선은 긋고 길이는 재지 않아요. 길이는 컴퍼스로 옮겨요.', set: { cnShowAnswer: true } }
      ])
    ]),
    make('컴퍼스', '컴퍼스의 바늘과 벌림', '원·호 그리기와 길이 옮기기', '중심을 고정하면 벌린 길이가 반지름이 돼요', '컴퍼스 벌림을 바꾸고 그려지는 호의 크기를 비교해 보세요', [
      ch('바늘을 고정해요', 12, [
        { at: 0, say: '바늘은 점 P에 고정해요. 컴퍼스의 벌린 길이를 유지해요.', set: toolSet(false, 'compass'), to: { cnT1: 0.7 }, dur: 4 },
        { at: 5.5, say: '연필 끝은 P에서 같은 거리만큼 떨어진 곳을 지나가요.' }
      ], toolStart(0.4)),
      ch('같은 거리에 생기는 선', 12, [
        { at: 0, say: '연필을 계속 돌리면 원, 일부만 돌리면 호가 그려져요.', to: { cnT1: 1 }, dur: 4 },
        { at: 5.5, say: '벌림을 유지해 길이도 옮겨요. 지금 PQ는 AB와 같은 3cm예요.', set: { cnShowAnswer: true } }
      ])
    ]),
    make('길이문제', '컴퍼스로 옮긴 선분의 길이', 'PQ = 3 cm', '컴퍼스 벌림을 유지하면 옮긴 길이가 같아요', 'AB의 길이를 바꾸고 옮긴 PQ의 길이도 확인해 보세요', [
      ch('주어진 길이를 벌림으로', 12, [
        { at: 0, say: 'AB는 3cm예요. 컴퍼스를 이 길이로 벌려 P로 옮겨요.', set: toolSet(true, 'compass', 1), to: { cnT1: 0.4 }, dur: 4 },
        { at: 5.5, say: 'P는 새 선분의 시작점이에요. 옮길 때 벌림은 바꾸지 않아요.' }
      ], toolStart()),
      ch('반직선과 만나는 점', 12, [
        { at: 0, say: 'P를 중심으로 호를 그려 반직선과 만나는 점을 Q라 해요.', to: { cnT1: 1 }, dur: 4 },
        { at: 5.5, say: 'PQ는 이 호의 반지름이므로 컴퍼스를 벌린 길이와 같아요.' }
      ]),
      ch('옮긴 길이를 확인해요', 12, [
        { at: 0, say: '컴퍼스를 벌린 길이는 처음부터 AB였어요. 더하거나 나누지 않아요.' },
        { at: 5.5, say: 'PQ = AB = 3cm예요. 옮겨도 길이는 그대로예요.', set: { cnShowAnswer: true } }
      ])
    ]),
    make('도구판별', '작도에 사용할 수 있는 도구', '⑤ 두 점을 지나는 직선', '작도는 눈금 없는 자와 컴퍼스만 사용해요', '길이 재기와 길이 옮기기가 어떻게 다른지 설명해 보세요', [
      ch('허용된 도구를 확인해요', 12, [
        { at: 0, say: '주어진 도구는 눈금 없는 자와 컴퍼스예요. 자를 맞춰 보아요.', set: toolSet(true, 'ruler'), to: { cnT1: 1 }, dur: 4 },
        { at: 5.5, say: '보기의 눈금 읽기, 각도기, 삼각자 사용은 허용되지 않아요.' }
      ], toolStart(0.3)),
      ch('두 점을 잇는 작도', 12, [
        { at: 0, say: '두 점에 자의 모서리를 맞추는 데 눈금이나 각도기는 필요 없어요.' },
        { at: 5.5, say: '정답은 ⑤, 두 점을 지나는 직선을 긋는 것이에요.', set: { cnShowAnswer: true } }
      ])
    ])
  ];

  function angleCopy(problem) {
    const th = problem ? 40 : 55;
    return make(problem ? '선분관계' : '각옮기기', problem ? '작도에서 같은 길이 찾기' : '크기가 같은 각을 작도하기', problem ? '$\\overline{OA}=\\overline{AB}$' : '∠QPD = 55°',
      '같은 반지름과 옮긴 길이를 구별해서 표시해요', '각의 크기를 바꾸고 같은 길이 표시가 유지되는지 확인해 보세요', [
        ch('주어진 각에서 호 그리기', 10, [
          { at: 0, say: `주어진 ∠XOY는 ${th}°예요. O를 중심으로 호를 그려요.`, set: begin(problem, 'angle', { cnPk: { th: 40, f: 0, t: [0, 1, 2, 3] } }), to: { cnT2: 0.2 }, dur: 3.5 },
          { at: 5.5, say: '두 변과 만나는 점을 A, B라 해요. OA와 OB는 반지름이에요.' }
        ], { cnTh: 55, cnR: 2, cnT2: 0, cnS: 0, cnSeed: 0 }),
        ch('같은 벌림을 옮겨요', 10, [
          { at: 0, say: '벌림을 바꾸지 않고 P를 중심으로 같은 반지름의 호를 그려요.', to: { cnT2: 0.4 }, dur: 3.5 },
          { at: 5.5, say: '반직선 PQ와 만나는 점은 C예요. PC도 같은 반지름이에요.' }
        ]),
        ch('두 교점 사이의 길이', 10, [
          { at: 0, say: '이번에는 두 교점 A, B 사이의 길이를 컴퍼스로 재요.', to: { cnT2: 0.6 }, dur: 3.5 },
          { at: 5.5, say: 'AB는 중심에서 잰 반지름이 아니에요. 벌림이 바뀌었어요.' }
        ]),
        ch('새로운 교점을 정해요', 10, [
          { at: 0, say: 'C를 중심으로 반지름 AB인 호를 그려 교점 D를 찾아요.', to: { cnT2: 0.8 }, dur: 3.5 },
          { at: 5.5, say: 'PC와 PD는 같은 반지름, AB와 CD는 옮긴 길이예요.' }
        ]),
        ch(problem ? '보기의 등식을 판별해요' : '마지막 반직선을 그어요', 10, [
          { at: 0, say: problem ? '반직선 PD를 그어요. 반지름 네 개와 옮긴 두 길이를 구별해요.' : '반직선 PD를 그어요. OAB와 PCD는 세 변이 같아 합동이에요.', to: { cnT2: 1 }, dur: 3.5 },
          { at: 5.5, say: problem ? '옳지 않은 것은 ① $\\overline{OA}=\\overline{AB}$예요.' : '대응하는 각도 같아서 ∠QPD = ∠XOY = 55°예요.', set: { cnShowAnswer: true } }
        ])
      ]);
  }
  lessons['c1-2'] = [angleCopy(false), angleCopy(true)];

  const pointFor = degree => ({ px: 4 * Math.cos(degree * Math.PI / 180), ph: 4 * Math.sin(degree * Math.PI / 180) });
  function parallel(d) {
    const angle = d.problem ? 65 : d.mode === 'alt' ? 65 : 115;
    const p = pointFor(angle), pk = { ...pointFor(65), al: 0, f: 0, t: [0, 1, 2, 3] };
    const relation = d.mode === 'alt' ? '엇각' : '동위각';
    const answer = d.lengths ? '$\\overline{QA}=\\overline{AB}$' : d.problem ? `${relation}의 크기가 같으면 평행` : 'l ∥ m';
    return make(d.label, d.lengths ? '평행선 작도의 선분 관계' : `${relation}을 이용한 평행선 작도`, answer,
      '같은 반지름과 옮긴 길이로 같은 각을 만들어요', '점 P를 옮겨도 같은 각으로 평행선이 만들어지는지 확인해 보세요', [
        ch('점과 직선을 이어요', 10, [
          { at: 0, say: 'P는 직선 l 밖의 점, Q는 l 위의 점이에요. PQ를 그어요.', set: begin(d.problem, 'parallel', { cnPm: d.mode, cnPk: pk }), to: { cnPT: 1 / 6 }, dur: 3.5 },
          { at: 5.5, say: '이 직선이 두 각의 위치를 비교하는 기준이 돼요.' }
        ], { cnPx: p.px, cnPh: p.ph, cnPAl: 0, cnPR: 1.4, cnPT: 0, cnSeed: 0 }),
        ch('첫 각의 교점을 찾아요', 10, [
          { at: 0, say: 'Q를 중심으로 호를 그려 l 위의 A, PQ 위의 B를 정해요.', to: { cnPT: 2 / 6 }, dur: 3.5 },
          { at: 5.5, say: `QA와 QB는 같은 반지름이에요. 지금 ∠AQB는 ${angle}°예요.`, set: { cnSupportReady: true } }
        ]),
        ch('같은 반지름을 유지해요', 10, [
          { at: 0, say: '벌림을 그대로 두고 P를 중심으로 호를 그려 C를 찾아요.', to: { cnPT: 3 / 6 }, dur: 3.5 },
          { at: 5.5, say: d.mode === 'alt' ? 'C는 P에서 Q 쪽에 있어요. 두 각은 PQ의 양쪽에 놓여요.' : 'C는 P에서 Q의 반대쪽이에요. 두 각은 같은 위치에 놓여요.' }
        ]),
        ch('교점 사이의 길이를 재요', 10, [
          { at: 0, say: '이제 컴퍼스의 벌림을 두 교점 사이의 길이 AB로 바꿔요.', to: { cnPT: 4 / 6 }, dur: 3.5 },
          { at: 5.5, say: '같은 반지름의 두 호를 먼저 그린 뒤에 벌림을 바꿔야 해요.' }
        ]),
        ch('길이를 옮겨 새 점 찾기', 10, [
          { at: 0, say: 'C를 중심으로 반지름 AB인 호를 그려 교점 D를 찾아요.', to: { cnPT: 5 / 6 }, dur: 3.5 },
          { at: 5.5, say: 'QA, QB, PC, PD는 같은 반지름이고 AB와 CD는 같아요.' }
        ]),
        ch(d.lengths ? '옳지 않은 등식 찾기' : '완성한 두 각을 비교해요', 10, [
          { at: 0, say: d.lengths ? 'P와 D를 잇는 직선을 그어요. 반지름과 옮긴 길이를 구별해요.' : 'P와 D를 잇는 직선 m을 그어요. 작도한 두 각은 크기가 같아요.', to: { cnPT: 1 }, dur: 3.5 },
          { at: 5.5, say: d.lengths ? '옳지 않은 것은 ② $\\overline{QA}=\\overline{AB}$예요.' : `${relation}의 크기가 같으면 평행해요. 따라서 l ∥ m이에요.`, set: { cnShowAnswer: true } }
        ])
      ]);
  }
  lessons['c1-3'] = [parallel({ label: '동위각작도', mode: 'corr', problem: false }), parallel({ label: '선분관계', mode: 'corr', problem: true, lengths: true })];
  lessons['c1-4'] = [parallel({ label: '엇각작도', mode: 'alt', problem: false }), parallel({ label: '엇각판별', mode: 'alt', problem: true }), parallel({ label: '동위각판별', mode: 'corr', problem: true })];

  function order(problem) {
    const p = problem ? { px: 1.6, ph: 3.6 } : pointFor(70);
    const openings = [
      '㉠, 점 P와 직선 l 위의 점 Q를 잇는 직선 PQ를 그어요.',
      '㉡, Q 중심의 호를 그려 l과 PQ 위의 점 A, B를 정해요.',
      '㉢, 벌림을 유지한 채 P 중심의 호를 그려 C를 정해요.',
      '㉣, 이제 컴퍼스의 벌림을 AB의 길이로 바꿔요.',
      '㉤, C 중심으로 반지름 AB인 호를 그려 교점 D를 찾아요.',
      '㉥, D를 찾았으므로 P와 D를 지나는 직선을 그을 수 있어요.'
    ];
    const reasons = [
      'PQ가 먼저 있어야 뒤에서 호와 만나는 점 B, C를 정할 수 있어요.',
      'AB를 재기 위해 점 A, B를 먼저 찾아야 해요.',
      '두 호는 어느 쪽이 먼저여도 돼요. 둘 다 그리기 전 벌림은 같아요.',
      '이때 벌림이 바뀌므로 같은 반지름의 두 호를 먼저 그려야 해요.',
      '점 C와 AB의 길이가 있어야 이 호를 그릴 수 있어요.',
      problem ? '정답은 ②, ㉠ → ㉡ → ㉢ → ㉣ → ㉤ → ㉥이에요.' : '가능한 순서는 ㉠ → ㉡ → ㉢ → ㉣ → ㉤ → ㉥이에요.'
    ];
    const titles = ['바탕 직선부터', '첫 호의 교점', '같은 벌림의 두 번째 호', '벌림을 바꾸는 시점', '새 호의 중심과 반지름', '마지막 직선과 전체 순서'];
    return make(problem ? '순서문제' : '순서익히기', '앞 단계가 필요한 작도 순서', problem ? '② ㉠ → ㉡ → ㉢ → ㉣ → ㉤ → ㉥' : '㉠ → ㉡ → ㉢ → ㉣ → ㉤ → ㉥',
      '점·선과 같은 반지름을 준비한 뒤 벌림을 바꿔요', '같은 반지름의 두 호의 순서만 바꿔도 작도되는지 직접 해 보세요',
      titles.map((title, i) => ch(title, 10, [
        { at: 0, say: openings[i], ...(i === 0 ? { set: begin(problem, 'order', { cnOrd: [], cnMsg: null, cnPerm: [0, 1, 2, 3, 4, 5], cnPk: { perm: [0, 1, 2, 3, 4, 5], o: 0, bad: [0, 1, 2, 3], px: 1.6, ph: 3.6 } }) } : {}), to: { cnOrderT: (i + 1) / 6 }, dur: 3.5 },
        { at: 5.5, say: reasons[i], ...(i === 5 ? { set: { cnShowAnswer: true } } : {}) }
      ], i === 0 ? { cnPx: p.px, cnPh: p.ph, cnOrderT: 0, cnSeed: 0 } : undefined)));
  }
  lessons['c1-5'] = [order(false), order(true)];
})();
