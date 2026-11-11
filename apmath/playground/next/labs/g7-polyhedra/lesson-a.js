/* t1.js의 질문·고정 탐구 상태·개수 공식으로 만든 독립 원클릭 해설.
   phQ의 무작위 문제를 재사용하지 않으며, 각 해설은 모드와 공개 표시를 처음부터 맞춥니다. */
(function () {
  'use strict';
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g7-polyhedra'] = all['g7-polyhedra'] || {};
  const reset = { phShowAnswer: false, phSupportReady: false, phCountReady: false };
  const begin = (target, extra = {}) => ({ ...reset, phTarget: target, ...extra });
  const ch = (title, length, cues, start) => ({ title, length, ...(start ? { start } : {}), cues });
  const make = (label, title, answer, summary, task, chapters) => ({ label, title, answer, answerText: answer, summary, task, tab: 'review', chapters });
  const camera = { phYaw: -30, phPitch: 24 };

  lessons['p1-0'] = [
    make('다면체', '다면체를 가리는 기준', '다면체가 아니에요', '다각형인 면만으로 둘러싸이면 다면체예요', '입체를 바꾸고 곡면이 있는지 찾아보세요', [
      ch('다각형인 면', 12, [
        { at: 0, say: '오각기둥을 돌려 평평한 면을 살펴요.', set: begin('classify', { phKind: 0 }), to: { phYaw: -5 }, dur: 4 },
        { at: 5.5, say: '모든 면이 다각형인 입체를 다면체라 해요.', step: 1, set: { phSupportReady: true } }
      ], { ...camera, phN8: 5 }),
      ch('굽은 면이 있는 입체', 11, [
        { at: 0, say: '원기둥의 옆면에는 굽은 면이 있어요.', set: { phKind: 1 }, step: 1 },
        { at: 5, say: '곡면이 있으므로 원기둥은 다면체가 아니에요.', set: { phShowAnswer: true }, step: 2 }
      ])
    ]),
    make('몇면체', '면의 개수로 부르는 이름', '7면체', '몇 면체인지는 면의 개수로 정해요', '각뿔도 골라 밑면 이름과 면체 이름을 비교해 보세요', [
      ch('밑면 이름과 면체 이름', 12, [
        { at: 0, say: '오각기둥을 돌려 밑면과 옆면을 찾아요.', set: begin('faces', { phKind: 0 }), to: { phYaw: -5 }, dur: 4 },
        { at: 5.5, say: '오각은 밑면의 모양, 몇 면체는 면의 수예요.', step: 1 }
      ], { ...camera, phN8: 5 }),
      ch('모든 면을 세어요', 12, [
        { at: 0, say: '밑면 두 개와 옆면 다섯 개를 합해요.', set: { phSupportReady: true }, step: 1 },
        { at: 5.5, say: '면이 $2+5=7$개이므로 7면체예요.', set: { phShowAnswer: true }, step: 3 }
      ])
    ])
  ];

  // 밑면의 변이 다섯 개인 실제 기본 상태. 면·모서리·꼭짓점은 서로 다른 버튼입니다.
  function counting(kind) {
    const prism = kind === 'prism', name = prism ? '오각기둥' : '오각뿔';
    const data = prism ? [
      ['F', '면', 7, '밑면 두 개와 옆면 다섯 개를 따로 세어요.', '면은 밑면과 옆면을 빠짐없이 합해요.', '$2+5=7$', '면의 수 = n + 2', 1],
      ['E', '모서리', 15, '밑모서리는 다섯 개씩 두 묶음, 옆은 다섯 개.', '밑모서리 두 묶음과 옆모서리를 합해요.', '$5\\times2+5=15$', '모서리의 수 = 3n', 2],
      ['V', '꼭짓점', 10, '위 밑면에 다섯 점, 아래 밑면에도 다섯 점.', '위아래 꼭짓점을 한 번씩 모두 세어요.', '$5+5=10$', '꼭짓점의 수 = 2n', 3]
    ] : [
      ['F', '면', 6, '밑면 한 개와 옆면 다섯 개를 따로 세어요.', '밑면도 하나의 면으로 포함해요.', '$1+5=6$', '면의 수 = n + 1', 1],
      ['E', '모서리', 10, '밑모서리 다섯 개, 꼭대기로 향하는 선도 다섯 개.', '밑모서리와 옆모서리를 합해요.', '$5+5=10$', '모서리의 수 = 2n', 2],
      ['V', '꼭짓점', 6, '밑면의 다섯 점에 꼭대기 한 점이 있어요.', '꼭대기는 옆면마다 세지 않고 한 번만 세어요.', '$5+1=6$', '꼭짓점의 수 = n + 1', 3]
    ];
    return data.map(([target, label, answer, parts, strategy, calc, summary, step]) => make(label, `${name}의 ${label} 세기`, `$${answer}$개`, summary, '밑면의 변의 수 n을 바꾸고 같은 방법으로 세어 보세요', [
      ch('밑면의 변의 수', 12, [
        { at: 0, say: 'n은 밑면 한 개의 변의 수, 지금은 5예요.', set: begin(target), to: target === 'F' ? { phSplit: 0.85 } : { phYaw: -5 }, dur: 4.5 },
        { at: 5.5, say: parts, step, set: { phSupportReady: true } }
      ], { ...camera, phN: 5, phSplit: 0 }),
      ch('묶어서 계산해요', 11, [
        { at: 0, say: strategy, step },
        { at: 5, say: `${label}의 수는 ${calc}개예요.`, set: { phShowAnswer: true } }
      ])
    ]));
  }
  lessons['p1-1'] = counting('prism');
  lessons['p1-2'] = counting('pyr');

  lessons['p1-3'] = [
    ['F', '면', 6, '밑면 두 개와 사다리꼴 옆면 네 개를 세어요.', '잘라서 생긴 윗밑면도 하나의 면이에요.', '$4+2=6$', 2],
    ['E', '모서리', 12, '위아래 밑모서리는 네 개씩, 옆모서리도 네 개.', '세 묶음의 모서리를 한 번씩 세어요.', '$4\\times3=12$', 3],
    ['V', '꼭짓점', 8, '위쪽에 네 점, 아래쪽에도 네 점이 있어요.', '잘라 낸 꼭대기는 뿔대의 꼭짓점이 아니에요.', '$4\\times2=8$', 3]
  ].map(([target, label, answer, parts, caution, calc, step]) => make(label, `사각뿔대의 ${label} 세기`, `$${answer}$개`, '각뿔대의 개수는 같은 n각기둥과 같아요', '자르는 위치를 바꿔도 면과 모서리의 수가 같은지 확인해 보세요', [
    ch('평행하게 잘라요', 12, [
      { at: 0, say: '밑면에 평행하게 잘라 윗 각뿔을 떼어 내요.', set: begin(target), to: { phSep: 0.85 }, dur: 5 },
      { at: 5.5, say: '남은 입체는 사각뿔대, 밑면의 변의 수 n은 4.', step: 1 }
    ], { ...camera, phN8: 4, phCut: 0.5, phSep: 0 }),
    ch('남은 부분을 세어요', 12, [
      { at: 0, say: parts, step, set: { phSupportReady: true } },
      { at: 5.5, say: caution }
    ]),
    ch('개수를 합해요', 10, [
      { at: 0, say: `사각뿔대의 ${label}의 수를 묶어서 계산해요.`, step },
      { at: 4.5, say: `${label}의 수는 ${calc}개예요.`, set: { phShowAnswer: true } }
    ])
  ]));

  lessons['p1-4'] = [
    ['prism', '각기둥', '직사각형', '네 각이 모두 직각인 것을 확인해요.'],
    ['pyr', '각뿔', '삼각형', '세 변이 둘러싸고 위쪽 꼭짓점에서 모여요.'],
    ['fr', '각뿔대', '사다리꼴', '평행한 두 변의 길이가 다른 것을 보세요.']
  ].map(([kind, label, shape, feature]) => make(label, `${label} 옆면의 모양`, shape, '밑면을 제외한 면이 옆면이에요', '다른 옆면도 꺼내 같은 모양인지 확인해 보세요', [
    ch('옆면 하나를 꺼내요', 12, [
      { at: 0, say: `${label}에서 밑면을 뺀 옆면 하나를 꺼내요.`, set: begin('side', { phK4: kind }), to: { phOut: 1 }, dur: 5 },
      { at: 5.5, say: '밑면의 모양과 옆면의 모양을 구별해요.', step: 1 }
    ], { ...camera, phN8: 5, phFace: 1, phOut: 0 }),
    ch('변과 각을 살펴요', 11, [
      { at: 0, say: feature, step: 2, set: { phSupportReady: true } },
      { at: 5, say: `${label}의 옆면은 ${shape}이에요.`, step: 3, set: { phShowAnswer: true } }
    ])
  ]));

  lessons['p1-5'] = [
    ['prism', '각기둥', 2, 6, '육각기둥', 1],
    ['pyr', '각뿔', 1, 7, '칠각뿔', 2],
    ['fr', '각뿔대', 2, 6, '육각뿔대', 3]
  ].map(([kind, label, bases, n, name, step]) => make(label, `면의 수로 ${label} 찾기`, name, '면의 수에서 밑면 수를 빼면 옆면 수예요', '면의 수를 바꾸고 밑면이 몇 각형인지 구해 보세요', [
    ch('면이 여덟 개인 입체', 12, [
      { at: 0, say: `면이 8개인 ${label}에서 밑면을 찾아요.`, set: begin(kind), to: { phYaw: -10 }, dur: 4 },
      { at: 5.5, say: 'n은 밑면의 변의 수이자 옆면의 개수예요.', step }
    ], { ...camera, phF: 8 }),
    ch('밑면 수를 빼요', 12, [
      { at: 0, say: `밑면 ${bases}개를 빼면 옆면은 $8-${bases}=${n}$개.`, step, set: { phSupportReady: true } },
      { at: 5.5, say: `밑면이 ${n}각형이므로 이름은 ${name}이에요.`, set: { phShowAnswer: true } }
    ])
  ]));

  lessons['p1-6'] = [
    make('두밑면', '각뿔대의 두 밑면 판별', '합동이 아니에요', '평행과 합동은 다른 조건이에요', '자르는 높이를 바꾸며 두 밑면의 크기를 비교해 보세요', [
      ch('크기를 비교해요', 12, [
        { at: 0, say: '평행하게 자른 두 밑면의 크기를 비교해요.', set: begin('bases', { phStm: 2 }), to: { phCut2: 0.4 }, dur: 4 },
        { at: 5.5, say: '합동은 모양과 크기가 모두 같다는 뜻이에요.', step: 1, set: { phSupportReady: true } }
      ], { ...camera, phN8: 5, phCut2: 0.6 }),
      ch('평행과 합동을 구별해요', 11, [
        { at: 0, say: '두 밑면은 평행하지만 크기가 달라요.', step: 1 },
        { at: 5, say: '크기가 다르므로 두 밑면은 합동이 아니에요.', set: { phShowAnswer: true } }
      ])
    ]),
    make('옆면모양', '각뿔대 옆면 판별', '사다리꼴', '각뿔대는 위아래 밑면의 크기가 달라요', '각기둥의 옆면과 비교해 차이를 확인해 보세요', [
      ch('평행한 변을 찾아요', 12, [
        { at: 0, say: '각뿔대를 돌려 옆면의 위아래 변을 보세요.', set: begin('side', { phStm: 4 }), to: { phYaw: -5 }, dur: 4 },
        { at: 5.5, say: '두 변은 평행하지만 길이가 달라요.', step: 2, set: { phSupportReady: true } }
      ], { ...camera, phN8: 5, phCut2: 0.6 }),
      ch('옆면 모양을 판단해요', 11, [
        { at: 0, say: '직사각형인 각기둥의 옆면과 구별해요.', step: 2 },
        { at: 5, say: '각뿔대의 옆면은 사다리꼴이에요.', set: { phShowAnswer: true } }
      ])
    ]),
    make('옆면개수', '밑면의 변과 옆면의 수', '옆면 5개', '밑면의 변 하나마다 옆면 하나가 이어져요', 'n을 바꾸며 밑면의 변과 옆면을 짝지어 보세요', [
      ch('변과 면을 짝지어요', 12, [
        { at: 0, say: '오각뿔대를 돌려 옆면을 한 장씩 찾아요.', set: begin('count', { phStm: 5 }), to: { phYaw: -5 }, dur: 4 },
        { at: 5.5, say: '밑면의 한 변마다 옆면 하나가 붙어 있어요.', step: 2, set: { phSupportReady: true } }
      ], { ...camera, phN8: 5, phCut2: 0.6 }),
      ch('밑면의 변만큼 세어요', 11, [
        { at: 0, say: '밑면은 오각형이고 변은 다섯 개예요.', step: 2 },
        { at: 5, say: '한 변에 한 면씩, 모두 옆면 5개예요.', set: { phShowAnswer: true } }
      ])
    ])
  ];

  lessons['p1-7'] = [
    make('공식확인', '오일러 관계 확인하기', '$2$', '볼록한 다면체에서 V − E + F = 2', '각뿔이나 정다면체로 바꾸어 같은 관계를 확인해 보세요', [
      ch('세 기호의 뜻', 12, [
        { at: 0, say: 'V는 꼭짓점, E는 모서리, F는 면의 수예요.', set: begin('relation', { phE: 'prism' }), to: { phYaw: -5 }, dur: 4 },
        { at: 5.5, say: '오각기둥은 $V=10$, $E=15$, $F=7$이에요.', step: 1, set: { phSupportReady: true } }
      ], { ...camera, phN8: 5 }),
      ch('더한 뒤 빼 보아요', 12, [
        { at: 0, say: '꼭짓점과 면의 수를 더하면 $10+7=17$.', step: 2, set: { phCountReady: true } },
        { at: 5.5, say: '$17-15=2$, 따라서 $V-E+F=2$예요.', step: 3, set: { phShowAnswer: true } }
      ])
    ]),
    make('공식활용', '오일러 공식으로 모서리 구하기', '$15$개', '모서리 E = 꼭짓점 V + 면 F − 2', '다른 볼록한 다면체에서도 모서리의 수를 구해 보세요', [
      ch('주어진 수와 구할 수', 12, [
        { at: 0, say: '꼭짓점 V는 10개, 면 F는 7개예요.', set: begin('E', { phE: 'prism' }), to: { phYaw: -5 }, dur: 4 },
        { at: 5.5, say: 'E는 모서리의 수, 지금 구해야 할 값이에요.', step: 1, set: { phSupportReady: true } }
      ], { ...camera, phN8: 5 }),
      ch('공식을 정리해요', 12, [
        { at: 0, say: '볼록한 다면체는 $V-E+F=2$를 만족해요.', step: 2, set: { phCountReady: true } },
        { at: 5.5, say: '모서리는 $E=V+F-2$, 즉 $10+7-2$예요.' }
      ]),
      ch('모서리의 수', 11, [
        { at: 0, say: '꼭짓점과 면의 합 17에서 2를 빼요.', step: 2 },
        { at: 5, say: '모서리의 수는 $10+7-2=15$개예요.', step: 3, set: { phShowAnswer: true } }
      ])
    ])
  ];
})();
