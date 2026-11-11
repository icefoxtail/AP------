/* 회전체 만들기 t1.js: 원본 평면도형·회전축·치수를 고정한 독립 해설. */
(function () {
  'use strict';
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g7-solids'] = all['g7-solids'] || {};
  const begin = (mode, extra = {}) => ({ soShowAnswer: false, soSupportReady: false, soFullCircle: false, soLessonMode: mode, ...extra });
  const camera = { soYaw: -25, soPitch: 25 };
  const ch = (title, length, cues, start) => ({ title, length, ...(start ? { start } : {}), cues });
  const make = (label, title, answer, summary, task, chapters) => ({ label, title, answer, answerText: answer, summary, task, tab: 'review', chapters });

  lessons['s1-1'] = [
    make('만들기', '직사각형의 회전', '원기둥', '한 변이 축이면 반대편 변이 옆면을 만들어요', '직사각형의 가로와 세로를 바꿔 만들어 보세요', [
      ch('한 변을 축으로 돌려요', 12, [
        { at: 0, say: '가로 3, 세로 5인 직사각형을 돌려요.', set: begin('shape'), to: { soT: .6 }, dur: 5 },
        { at: 5.5, say: '회전축 l은 도형이 제자리에서 도는 기준선이에요.', step: 1 }
      ], { ...camera, soR: 3, soH1: 5, soT: 0 }),
      ch('한 바퀴의 자취', 12, [
        { at: 0, say: '위아래 변은 원을, 반대편 변은 옆면을 만들어요.', to: { soT: 1 }, dur: 4 },
        { at: 5.5, say: '직사각형을 한 변 둘레로 돌리면 원기둥이에요.', step: 3, set: { soShowAnswer: true } }
      ])
    ]),
    make('반지름', '축에 수직인 변의 역할', '반지름 3 cm', '축에서 바깥쪽까지의 거리가 반지름이에요', '축으로 삼는 변을 바꾸면 반지름이 어떻게 달라질지 생각해 보세요', [
      ch('축과 변의 방향', 12, [
        { at: 0, say: '가로 3, 세로 5인 직사각형을 세로 변 둘레로 돌려요.', set: begin('radius'), to: { soT: 1 }, dur: 5 },
        { at: 5.5, say: '축에서 바깥쪽까지 뻗은 가로 변을 보세요.', step: 1 }
      ], { ...camera, soR: 3, soH1: 5, soT: 0 }),
      ch('지름과 구별해요', 11, [
        { at: 0, say: '원 중심인 축에서 원 위까지가 반지름이에요.', step: 4 },
        { at: 5, say: '가로 변이 그대로 반지름, 반지름 3 cm예요.', set: { soShowAnswer: true } }
      ])
    ]),
    make('높이', '축에 놓인 변의 역할', '높이 5 cm', '축 위의 변이 회전체의 높이가 돼요', '높이만 바꾸어 입체가 어떻게 변하는지 살펴보세요', [
      ch('축 위의 변', 12, [
        { at: 0, say: '가로 3, 세로 5인 직사각형을 세로 변 둘레로 돌려요.', set: begin('height'), to: { soT: 1 }, dur: 5 },
        { at: 5.5, say: '회전축 위의 변은 돌려도 자리가 그대로예요.', step: 2 }
      ], { ...camera, soR: 3, soH1: 5, soT: 0 }),
      ch('두 밑면 사이의 거리', 11, [
        { at: 0, say: '축 위의 변이 아래 밑면에서 위 밑면까지 이어져요.', step: 2 },
        { at: 5, say: '따라서 원기둥의 높이 5 cm예요.', step: 4, set: { soShowAnswer: true } }
      ])
    ])
  ];

  lessons['s1-2'] = ['AB', 'BC'].map(axis => {
    const r = axis === 'AB' ? 3 : 4, h = axis === 'AB' ? 4 : 3, other = axis === 'AB' ? 'BC' : 'AB';
    return make(`${axis}축`, `${axis}를 축으로 돌린 입체`, `반지름 ${r} cm · 높이 ${h} cm`, '축 위의 변은 높이, 수직인 변은 반지름', '다른 직각변을 축으로 골라 두 원뿔의 치수를 비교해 보세요', [
      ch('어느 변이 축일까요', 12, [
        { at: 0, say: `AB는 4, BC는 3인 직각삼각형을 ${axis} 둘레로 돌려요.`, set: begin('axis', { soAxis: axis }), to: { soT: .6 }, dur: 5 },
        { at: 5.5, say: '반지름은 축에서 원 위까지, 높이는 축 방향 길이예요.', step: 1 }
      ], { ...camera, soA: 3, soB: 4, soT: 0 }),
      ch('축을 기준으로 읽어요', 12, [
        { at: 0, say: `축 위 ${axis}가 높이, 수직인 ${other}가 반지름이에요.`, to: { soT: 1 }, dur: 4 },
        { at: 5.5, say: `반지름 ${r} cm · 높이 ${h} cm인 원뿔이에요.`, step: 4, set: { soShowAnswer: true } }
      ])
    ]);
  });
  lessons['s1-2'].push(make('밑넓이', '돌려서 만든 밑면의 넓이', '$9\\pi$ cm²', '밑넓이 = π × 반지름 × 반지름', '축을 BC로 바꾸고 밑넓이가 어떻게 바뀌는지 구해 보세요', [
    ch('밑면의 반지름 찾기', 12, [
      { at: 0, say: 'AB는 4, BC는 3이고 AB를 축으로 돌려요.', set: begin('area', { soAxis: 'AB' }), to: { soT: 1 }, dur: 5 },
      { at: 5.5, say: '축에 수직인 BC가 밑면인 원의 반지름이에요.', step: 3 }
    ], { ...camera, soA: 3, soB: 4, soT: 0 }),
    ch('원의 넓이 공식', 12, [
      { at: 0, say: '밑면은 원이므로 π에 반지름을 두 번 곱해요.', step: 3 },
      { at: 5.5, say: '밑넓이는 $\\pi\\times3\\times3=9\\pi$ cm²예요.', step: 4, set: { soShowAnswer: true } }
    ])
  ]));

  lessons['s1-3'] = [
    make('만들기', '사다리꼴의 회전', '원뿔대', '윗변과 아랫변이 두 원의 반지름이 돼요', '윗변 길이를 바꾸고 두 밑면의 크기를 비교해 보세요', [
      ch('높이가 되는 변을 축으로', 12, [
        { at: 0, say: '윗변 2, 아랫변 4인 사다리꼴을 돌려요.', set: begin('shape'), to: { soT: .6 }, dur: 5 },
        { at: 5.5, say: '직각 두 개를 잇는 높이 3인 변이 축이에요.', step: 1 }
      ], { ...camera, soRB: 4, soRT: 2, soH1: 3, soT: 0 }),
      ch('크기가 다른 두 밑면', 12, [
        { at: 0, say: '윗변과 아랫변은 크기가 다른 원을 만들어요.', to: { soT: 1 }, dur: 4 },
        { at: 5.5, say: '평행한 두 원을 밑면으로 하는 원뿔대가 돼요.', step: 3, set: { soShowAnswer: true } }
      ])
    ]),
    make('큰밑넓이', '더 큰 밑면의 넓이', '$16\\pi$ cm²', '긴 아랫변이 큰 밑면의 반지름이에요', '작은 밑면의 넓이도 같은 방법으로 구해 보세요', [
      ch('큰 원을 만드는 변', 12, [
        { at: 0, say: '윗변 2, 아랫변 4인 사다리꼴을 돌려요.', set: begin('area'), to: { soT: 1 }, dur: 5 },
        { at: 5.5, say: '더 긴 아랫변 4가 큰 원의 반지름이에요.', step: 3 }
      ], { ...camera, soRB: 4, soRT: 2, soH1: 3, soT: 0 }),
      ch('큰 원의 넓이', 12, [
        { at: 0, say: '두 반지름을 더하지 않고 큰 원 하나를 계산해요.', step: 4 },
        { at: 5.5, say: '큰 밑넓이는 $\\pi\\times4\\times4=16\\pi$ cm².', set: { soShowAnswer: true } }
      ])
    ])
  ];

  lessons['s1-4'] = [
    make('반원회전', '반원을 지름 둘레로 돌리기', '구', '반원의 지름을 회전축으로 삼아요', '반지름만 바꾸어 입체의 크기를 비교해 보세요', [
      ch('곧은 지름이 축이에요', 12, [
        { at: 0, say: '반원의 곧은 지름을 축으로 돌려요.', set: begin('shape'), to: { soT: .6 }, dur: 5 },
        { at: 5.5, say: '중심 O에서 둥근 경계까지의 거리는 늘 같아요.', step: 1 }
      ], { ...camera, soR: 3, soT: 0 }),
      ch('한 바퀴 돌린 자취', 12, [
        { at: 0, say: '반원이 지나간 자리를 한 바퀴 모두 채워요.', to: { soT: 1 }, dur: 4 },
        { at: 5.5, say: '반원을 지름 둘레로 한 바퀴 돌리면 구가 돼요.', step: 3, set: { soShowAnswer: true } }
      ])
    ]),
    make('반지름', '지름에서 반지름 구하기', '$4$ cm', '반지름 = 지름 ÷ 2', '다른 지름으로 바꾸어 만들어진 입체의 반지름을 구해 보세요', [
      ch('주어진 것은 지름', 12, [
        { at: 0, say: '지름 8 cm인 반원을 지름 둘레로 돌려요.', set: begin('radius'), to: { soT: 1 }, dur: 5 },
        { at: 5.5, say: '구의 반지름은 반원의 반지름과 같아요.', step: 3 }
      ], { ...camera, soR: 4, soT: 0 }),
      ch('지름의 절반', 11, [
        { at: 0, say: '중심에서 한쪽 끝까지이므로 지름을 반으로 나눠요.', step: 4 },
        { at: 5, say: '구의 반지름은 $8\\div2=4$ cm예요.', set: { soShowAnswer: true } }
      ])
    ]),
    make('원전체', '원 전체를 돌리면', '같은 구', '축 양쪽의 반원은 같은 공간을 지나가요', '반원과 원 전체의 회전 결과를 비교해 보세요', [
      ch('축 양쪽에 반원', 12, [
        { at: 0, say: '이번에는 원 전체를 지름 둘레로 돌려요.', set: begin('full', { soFullCircle: true }), to: { soT: .6 }, dur: 5 },
        { at: 5.5, say: '축 양쪽의 반원은 같은 공간을 지나가요.', step: 1 }
      ], { ...camera, soR: 3, soT: 0 }),
      ch('지나간 공간은 겹쳐요', 12, [
        { at: 0, say: '반원 두 개를 돌려도 입체의 크기가 두 배는 아니에요.', to: { soT: 1 }, dur: 4 },
        { at: 5.5, say: '원 전체를 돌려도 반원을 돌린 것과 같은 구예요.', step: 4, set: { soShowAnswer: true } }
      ])
    ])
  ];

  lessons['s1-5'] = [
    make('축에붙임', '축에 붙어 있는 직사각형', '원기둥', '축까지 도형이 채워져 있으면 가운데도 채워져요', '축에서 떨어진 거리를 늘려 결과를 비교해 보세요', [
      ch('도형과 축의 자리', 12, [
        { at: 0, say: '너비 2, 높이 4인 직사각형이 축에 붙어 있어요.', set: begin('attached', { soK5: 'rect' }), to: { soT: .6 }, dur: 5 },
        { at: 5.5, say: '축 쪽까지 도형이 있으므로 가운데도 지나가요.', step: 2 }
      ], { ...camera, soW: 2, soH1: 4, soD: 0, soK: 1, soT: 0 }),
      ch('가운데가 채워져요', 12, [
        { at: 0, say: '빈 공간 없이 축 둘레를 한 바퀴 채워요.', to: { soT: 1 }, dur: 4 },
        { at: 5.5, say: '가운데가 채워진 원기둥이 돼요.', step: 3, set: { soShowAnswer: true } }
      ])
    ]),
    make('축에서떼기', '축에서 떨어진 직사각형', '속이 빈 원기둥', '도형이 지나가지 않는 축 가까운 곳은 비어요', '축까지의 거리와 구멍의 반지름을 비교해 보세요', [
      ch('축까지의 빈 거리', 12, [
        { at: 0, say: '직사각형을 축에서 2만큼 떨어뜨려 돌려요.', set: begin('hollow', { soK5: 'rect' }), to: { soT: .6 }, dur: 5 },
        { at: 5.5, say: '너비는 2, 높이는 4이고 축에는 닿지 않아요.', step: 1 }
      ], { ...camera, soW: 2, soH1: 4, soD: 2, soK: 1, soT: 0 }),
      ch('지나가지 않은 곳', 12, [
        { at: 0, say: '축 가까운 곳은 도형이 지나가지 않아 구멍이 남아요.', to: { soT: 1 }, dur: 4 },
        { at: 5.5, say: '구멍 반지름이 2인 속이 빈 원기둥이 돼요.', step: 3, set: { soShowAnswer: true } }
      ])
    ]),
    make('빗변축', '직각삼각형의 빗변을 축으로', '두 원뿔을 밑면끼리 붙인 입체', '축에서 가장 먼 꼭짓점의 자취가 공통 밑면', '직각을 낀 변을 축으로 돌린 결과와 비교해 보세요', [
      ch('이번 축은 빗변', 12, [
        { at: 0, say: '세 변이 3, 4, 5인 삼각형을 빗변 둘레로 돌려요.', set: begin('hypotenuse', { soK5: 'tri' }), to: { soT: .6 }, dur: 5 },
        { at: 5.5, say: '축 양 끝은 그대로이고, 남은 꼭짓점이 원을 그려요.', step: 2 }
      ], { ...camera, soW: 2, soH1: 4, soD: 2, soK: 1, soT: 0 }),
      ch('위와 아래의 뾰족한 부분', 12, [
        { at: 0, say: '그 원을 기준으로 위아래에 뾰족한 부분이 생겨요.', to: { soT: 1 }, dur: 4 },
        { at: 5.5, say: '두 원뿔을 밑면끼리 붙인 입체가 돼요.', step: 3, set: { soShowAnswer: true } }
      ])
    ])
  ];

  lessons['s1-6'] = [
    ['frus', '원뿔대', '직각이 두 개인 사다리꼴', '작은 원과 큰 원의 경계를 축까지 이어 보세요.'],
    ['pencil', '원뿔붙임', '직사각형과 직각삼각형을 붙인 도형', '아래의 곧은 옆선과 위의 비스듬한 선을 이어 보세요.'],
    ['dbl', '두원뿔', '삼각형', '위아래 뾰족한 끝과 가장 넓은 곳을 이어 보세요.']
  ].map(([kind, label, answer, boundary]) => make(label, `${label}의 생성 도형 찾기`, answer, '회전축을 포함하는 단면에서 한쪽만 남겨요', '다른 입체도 거꾸로 돌려 원래 평면도형을 찾아보세요', [
    ch('회전의 자취를 거꾸로', 12, [
      { at: 0, say: '완성된 입체에서 회전한 자취를 줄여 보아요.', set: begin('reverse', { soK6: kind }), to: { soT: .4 }, dur: 5 },
      { at: 5.5, say: '문제의 조건은 축 한쪽에 놓인 도형을 찾는 것이에요.', step: 1 }
    ], { ...camera, soVR: 3, soVr: 2, soV1: 3, soV2: 2, soT: 1 }),
    ch('축 한쪽의 경계', 12, [
      { at: 0, say: boundary, to: { soT: 0 }, dur: 4 },
      { at: 5.5, say: `남은 한쪽 도형은 ${answer}이에요.`, step: 3, set: { soShowAnswer: true } }
    ])
  ]));

  lessons['s1-7'] = [
    make('원기둥', '돌려도 같은 겉모양', '회전체예요', '축 둘레로 어느 각도만큼 돌려도 모양이 같아요', '원뿔이나 원뿔대로 바꾸어 같은지 살펴보세요', [
      ch('표시한 점을 돌려요', 12, [
        { at: 0, say: '위에서 본 모양의 표시점을 축 둘레로 돌려요.', set: begin('yes', { soK7: 'cyl' }), to: { soRot: 70 }, dur: 5 },
        { at: 5.5, say: '점은 움직여도 바깥 윤곽인 원은 그대로예요.', step: 2 }
      ], { soRot: 0 }),
      ch('어느 각도에서도 같아요', 12, [
        { at: 0, say: '도는 각도를 더 바꾸어도 같은 모양이에요.', to: { soRot: 140 }, dur: 4 },
        { at: 5.5, say: '평면도형을 돌려 만들 수 있는 원기둥은 회전체예요.', step: 4, set: { soShowAnswer: true } }
      ])
    ]),
    make('직육면체', '돌리면 달라지는 겉모양', '회전체가 아니에요', '한 바퀴 뒤만 보지 말고 중간 각도도 비교해요', '사각뿔이나 삼각기둥도 돌려서 비교해 보세요', [
      ch('처음 윤곽과 비교해요', 12, [
        { at: 0, say: '직육면체를 돌려 처음의 점선 윤곽과 비교해요.', set: begin('no', { soK7: 'cuboid' }), to: { soRot: 35 }, dur: 5 },
        { at: 5.5, say: '위에서 본 모양도 돌리는 각도에 따라 달라져요.', step: 2 }
      ], { soRot: 0 }),
      ch('중간 각도가 중요해요', 12, [
        { at: 0, say: '한 바퀴 뒤에 돌아오는 것만으로 판단하지 않아요.', to: { soRot: 65 }, dur: 4 },
        { at: 5.5, say: '어느 각도에서나 같지는 않으므로 회전체가 아니에요.', step: 4, set: { soShowAnswer: true } }
      ])
    ])
  ];
})();
