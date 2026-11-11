/* 직선·반직선·선분: 원본 점의 위치·이름·개수 조건에 결속한 해설. */
(function () {
  'use strict';
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g7-points-lines'] = all['g7-points-lines'] || {};
  const begin = (mode, extra = {}) => ({ plShowAnswer: false, plSupportReady: false, plOtherReady: false, plExtraReady: false, plLessonMode: mode, ...extra });
  const ch = (title, length, cues, start) => ({ title, length, ...(start ? { start } : {}), cues });
  const make = (label, title, answer, summary, task, chapters) => ({ label, title, answer, answerText: answer, summary, task, tab: 'review', chapters });

  lessons['l-ray'] = [
    make('순서바꾸기', '직선과 선분의 이름 바꾸기', '직선·선분은 같아요', '직선과 선분은 두 점의 이름 순서를 바꾸어도 같아요', 'A와 B의 위치를 바꾸어 직선과 선분을 비교해 보세요', [
      ch('두 점을 지나는 선', 12, [
        { at: 0, say: 'A와 B를 지나는 직선을 양쪽으로 그려 보아요.', set: begin('lineOrder'), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: '직선의 이름 AB와 BA는 지나는 두 점을 알려 줘요.', step: 1 }
      ], { lrA: 3, lrB: 8, plSeed: 0, plTrace: 0 }),
      ch('지나는 곳과 양 끝점', 12, [
        { at: 0, say: '직선은 지나는 곳, 선분은 양 끝점을 비교해요.', step: 2 },
        { at: 5.5, say: 'AB를 BA로 바꾸어도 직선·선분은 같아요.', step: 3, set: { plShowAnswer: true } }
      ])
    ]),
    make('반직선순서', '반직선의 이름을 바꾸면', '반직선 AB ≠ 반직선 BA', '반직선은 시작점과 뻗는 방향을 함께 비교해요', 'A를 B의 오른쪽으로 옮겨도 두 반직선이 같은지 보세요', [
      ch('처음 글자가 시작점', 12, [
        { at: 0, say: 'AB는 A에서 B 쪽으로 뻗는 반직선이에요.', set: begin('rayOrder'), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: 'BA는 B에서 A 쪽으로 뻗어요. 처음 글자를 보세요.', step: 1 }
      ], { lrA: 3, lrB: 8, plSeed: 0, plTrace: 0 }),
      ch('시작점과 방향 비교', 12, [
        { at: 0, say: '시작점이 A와 B로 다르고 뻗는 방향도 반대예요.', step: 2 },
        { at: 5.5, say: '따라서 반직선 AB ≠ 반직선 BA예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ]),
    make('공통부분', '두 반직선이 겹치는 곳', '선분 AB · 5 cm', '두 반직선이 모두 지나는 곳만 공통부분이에요', '두 점의 위치를 바꾸어 공통부분의 길이를 확인해 보세요', [
      ch('각 반직선이 지나는 곳', 12, [
        { at: 0, say: '눈금 A는 3, B는 8이에요. AB와 BA를 그려요.', set: begin('rayCommon'), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: '공통부분은 두 반직선이 모두 지나는 곳이에요.', step: 1 }
      ], { lrA: 3, lrB: 8, plSeed: 0, plTrace: 0 }),
      ch('둘 다 칠해진 부분', 12, [
        { at: 0, say: 'A의 왼쪽과 B의 오른쪽은 한 반직선만 지나가요.', step: 2 },
        { at: 5.5, say: '공통부분은 선분 AB · 5 cm. 길이는 $8-3=5$예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ])
  ];

  lessons['l-types'] = [
    make('직선', '직선의 끝과 길이', '끝점 0개 · 길이 측정 불가', '직선은 양쪽으로 끝없이 뻗으므로 길이를 잴 수 없어요', '한 점을 지나는 직선과 두 점을 지나는 직선을 비교해 보세요', [
      ch('양쪽으로 계속 뻗는 선', 12, [
        { at: 0, say: '직선 AB는 A와 B를 지나 양쪽으로 계속 뻗어요.', set: begin('typeLine'), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: '서로 다른 두 점을 지나는 직선은 오직 하나예요.', step: 1 }
      ], { lrA: 3, ltL: 5, plSeed: 0, plTrace: 0 }),
      ch('길이를 잴 끝이 있는가', 12, [
        { at: 0, say: '한 점만 정하면 직선은 무수히 많이 그을 수 있어요.', step: 2 },
        { at: 5.5, say: '직선은 끝점 0개 · 길이 측정 불가예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ]),
    make('반직선', '반직선의 끝과 길이', '끝점 1개 · 길이 측정 불가', '반직선은 시작점만 있고 한쪽으로 끝없이 뻗어요', '반직선을 선분 길이와 비교할 수 있는지 설명해 보세요', [
      ch('시작점에서 한쪽으로', 12, [
        { at: 0, say: '반직선 AB는 A에서 시작해 B 쪽으로 뻗어요.', set: begin('typeRay'), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: 'B를 지나도 계속 이어져요. B는 끝점이 아니에요.', step: 1 }
      ], { lrA: 3, ltL: 5, plSeed: 0, plTrace: 0 }),
      ch('끝없이 이어지는 쪽', 12, [
        { at: 0, say: '직선과 반직선은 길이의 두 배 관계로 비교하지 않아요.', step: 2 },
        { at: 5.5, say: '반직선은 끝점 1개 · 길이 측정 불가예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ]),
    make('선분', '선분의 끝과 길이', '끝점 2개 · 길이 5 cm', '양 끝점이 정해진 선분의 길이만 잴 수 있어요', '선분의 길이를 바꾸어 양 끝점 사이의 거리를 재어 보세요', [
      ch('두 점 사이에서 멈추기', 12, [
        { at: 0, say: '선분 AB는 눈금 3의 A와 눈금 8의 B를 이어요.', set: begin('typeSegment'), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: 'A보다 왼쪽이나 B보다 오른쪽으로 늘이지 않아요.', step: 1 }
      ], { lrA: 3, ltL: 5, plSeed: 0, plTrace: 0 }),
      ch('끝점 사이의 길이 재기', 12, [
        { at: 0, say: '양 끝점의 눈금 차 $8-3$으로 길이를 구해요.', step: 2 },
        { at: 5.5, say: '선분은 끝점 2개 · 길이 5 cm예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ])
  ];
  lessons['l-same'] = [
    { label: '같은반직선', mode: 'sameRay', title: '반직선의 다른 이름 찾기', other: 'BD', answer: '반직선 BC = 반직선 BD', second: 'C와 D는 모두 B의 오른쪽에 있어요.', reason: '시작점이 B로 같고 오른쪽으로 뻗는 방향도 같아요.' },
    { label: '시작점함정', mode: 'sameStart', title: '방향만 같으면 같은 반직선일까', other: 'CD', answer: '반직선 BC ≠ 반직선 CD', second: 'CD는 C에서 시작해 D 쪽으로 뻗는 반직선이에요.', reason: '오른쪽으로 뻗어도 처음 글자 B와 C가 달라요.' },
    { label: '방향함정', mode: 'sameDirection', title: '시작점만 같으면 같은 반직선일까', other: 'BA', answer: '반직선 BC ≠ 반직선 BA', second: 'BA는 B에서 시작해 A 쪽, 곧 왼쪽으로 뻗어요.', reason: '시작점 B는 같지만 오른쪽과 왼쪽은 반대 방향이에요.' }
  ].map(x => make(x.label, x.title, x.answer, '반직선은 시작점과 방향이 모두 같아야 같아요', '시작점을 C로 바꾸어 같은 반직선의 이름을 찾아보세요', [
    ch('첫 글자와 향하는 점', 12, [
      { at: 0, say: 'A, B, C, D 순서예요. BC는 B에서 C 쪽으로 뻗어요.', set: begin(x.mode), to: { plTrace: 1 }, dur: 4 },
      { at: 5.5, say: x.second, step: 1 }
    ], { lp0: 1, lp1: 4, lp2: 8, lp3: 11, lsS: 1, plSeed: 0, plTrace: 0 }),
    ch('두 조건을 함께 비교', 12, [
      { at: 0, say: x.reason, step: 2 },
      { at: 5.5, say: `${x.answer}예요.`, step: 3, set: { plShowAnswer: true } }
    ])
  ]));

  lessons['l-common'] = [
    make('마주봄', '마주 보는 반직선의 공통부분', '선분 BC', '공통부분은 두 반직선이 모두 지나는 부분이에요', '점을 옮겨도 공통부분의 양 끝점이 어디인지 확인해 보세요', [
      ch('위아래로 나누어 그리기', 12, [
        { at: 0, say: 'BD는 B에서 오른쪽, CA는 C에서 왼쪽으로 뻗어요.', set: begin('commonFace'), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: '같은 가로 위치에서 두 줄이 모두 칠해졌는지 보세요.', step: 1 }
      ], { lp0: 1, lp1: 4, lp2: 8, lp3: 11, lcs: 0, plSeed: 0, plTrace: 0 }),
      ch('겹치는 부분의 양 끝', 12, [
        { at: 0, say: 'B 왼쪽과 C 오른쪽은 각각 한 줄만 칠해져요.', step: 2 },
        { at: 5.5, say: 'B부터 C까지 겹치므로 공통부분은 선분 BC예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ]),
    make('같은방향', '같은 방향의 반직선이 겹치면', '반직선 BC', '같은 방향이면 더 안쪽 시작점에서 계속 겹쳐요', '공통부분을 반직선 BD라고 불러도 되는지 설명해 보세요', [
      ch('같은 쪽으로 뻗는 두 줄', 12, [
        { at: 0, say: 'AD는 A에서, BD는 B에서 오른쪽으로 뻗어요.', set: begin('commonSame'), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: 'A와 B 사이에는 위쪽 반직선만 지나가요.', step: 1 }
      ], { lp0: 1, lp1: 4, lp2: 8, lp3: 11, lcs: 1, plSeed: 0, plTrace: 0 }),
      ch('둘 다 지나는 곳 따라가기', 12, [
        { at: 0, say: 'B에서 오른쪽으로는 두 반직선이 계속 겹쳐요.', step: 2 },
        { at: 5.5, say: '공통부분은 반직선 BC예요. BD도 같은 이름이에요.', step: 3, set: { plShowAnswer: true } }
      ])
    ]),
    make('끝점비교', '등진 경우와 같은 시작점 비교', '등짐: 없음 · 같은 시작점: 점 B', '끝점도 반직선에 포함되므로 같은 시작점은 남아요', '두 반직선의 시작점이 일치하는지 먼저 확인해 보세요', [
      ch('시작점이 떨어진 두 반직선', 12, [
        { at: 0, say: '위 그림의 CD는 C에서 오른쪽, BA는 B에서 왼쪽.', set: begin('commonEnds'), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: 'B가 C보다 왼쪽이라 두 반직선은 서로 등지고 뻗어요.', step: 1 }
      ], { lp0: 1, lp1: 4, lp2: 8, lp3: 11, lcs: 2, plSeed: 0, plTrace: 0 }),
      ch('시작점이 일치하는 두 반직선', 12, [
        { at: 0, say: '아래 그림의 BA와 BD는 모두 B에서 출발해요.', step: 2 },
        { at: 5.5, say: '방향은 반대여도 각 반직선에는 시작점이 포함돼요.' }
      ]),
      ch('끝점까지 포함해서 비교', 12, [
        { at: 0, say: '위아래 두 경우에서 둘 다 지나는 위치를 찾아요.' },
        { at: 5.5, say: '등짐: 없음 · 같은 시작점: 점 B예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ])
  ];

  lessons['l-short'] = [
    make('거리뜻', '두 점 사이의 거리가 뜻하는 것', '선분 AB의 길이', '두 점 사이의 거리는 두 점을 잇는 가장 짧은 길이예요', '돌아가는 길의 높이를 바꾸어 곧은 길과 비교해 보세요', [
      ch('여러 길을 비교하기', 12, [
        { at: 0, say: 'A와 B를 곧게 이어, 돌아가거나 꺾인 길과 비교해요.', set: begin('shortPath'), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: '두 점을 잇는 길은 많지만 돌아가면 더 길어져요.', step: 1 }
      ], { lrA: 2, lrB: 9, lsH: 2, plSeed: 0, plTrace: 0 }),
      ch('양 끝 사이의 가장 짧은 길', 12, [
        { at: 0, say: '양쪽으로 끝없이 늘인 직선 전체를 재는 것이 아니에요.', step: 2 },
        { at: 5.5, say: '두 점 사이의 거리는 선분 AB의 길이예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ]),
    make('거리계산', '눈금에서 두 점 사이 거리 구하기', '7 cm', '거리는 큰 눈금에서 작은 눈금을 빼서 구해요', 'A를 B의 오른쪽으로 옮겨도 큰 값에서 작은 값을 빼세요', [
      ch('눈금과 구할 길이', 12, [
        { at: 0, say: '눈금 A는 2, B는 9예요. 두 점 사이를 곧게 이어요.', set: begin('shortDistance'), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: 'B의 눈금 9는 원점부터의 위치이고 거리 자체가 아니에요.', step: 1 }
      ], { lrA: 2, lrB: 9, lsH: 2, plSeed: 0, plTrace: 0 }),
      ch('시작 눈금만큼 빼기', 12, [
        { at: 0, say: 'A까지의 눈금을 빼면 두 점 사이의 길이만 남아요.', step: 2 },
        { at: 5.5, say: '$9-2=7$이므로 두 점 사이의 거리는 7 cm예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ])
  ];
  lessons['l-col'] = [
    make('선분', '한 직선 위 점으로 선분 세기', '선분 10개', '선분은 두 끝점의 쌍을 세고 중복을 나누어요', '점의 간격만 바꾸면 선분 개수가 변하는지 확인해 보세요', [
      ch('한 직선 위의 다섯 점', 12, [
        { at: 0, say: '한 직선 위에 점 5개예요. 호는 끝점 쌍을 표시해요.', set: begin('colSegment', { lcx: null }), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: '직선은 하나지만 끝점 쌍이 다르면 선분도 달라요.', step: 1 }
      ], { lcn: 5, lcf: 0, plSeed: 0, plTrace: 0 }),
      ch('한 점씩 기준으로 세기', 12, [
        { at: 0, say: 'A에서 나머지 4개 점으로 선분을 만들 수 있어요.', step: 2, set: { plSupportReady: true } },
        { at: 5.5, say: '모든 점에서 세면 $5×4=20$번이에요.', set: { plOtherReady: true } }
      ]),
      ch('같은 선분을 두 번 셌어요', 12, [
        { at: 0, say: 'AB와 BA는 같은 선분이므로 2번 센 것을 나누어요.' },
        { at: 5.5, say: '$20÷2=10$, 따라서 선분 10개예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ]),
    make('반직선', '한 직선 위 점으로 반직선 세기', '반직선 8개', '양 끝점은 한 방향, 안쪽 점은 두 방향을 세어요', '기준 점을 바꾸어 같은 방향의 이름이 겹치는지 보세요', [
      ch('시작점과 방향으로 구별', 12, [
        { at: 0, say: '한 직선 위 점 5개에서 가능한 방향으로 화살표를 그려요.', set: begin('colRay', { lcx: null }), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: '시작점과 방향이 같으면 이름이 달라도 하나로 세어요.', step: 1 }
      ], { lcn: 5, lcf: 0, plSeed: 1, plTrace: 0 }),
      ch('양 끝점과 안쪽 점', 12, [
        { at: 0, say: '양 끝점은 1개씩, 안쪽 세 점은 2개씩 만들어요.', step: 2, set: { plSupportReady: true } },
        { at: 5.5, say: '$1+3×2+1=8$, 따라서 반직선 8개예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ]),
    make('개수의합', '선분과 반직선 개수 더하기', '합 18개', '선분과 반직선을 각각 센 뒤 합하고 직선은 더하지 않아요', '점 6개일 때도 두 개수를 따로 구한 뒤 더해 보세요', [
      ch('구할 두 종류를 구별', 12, [
        { at: 0, say: '한 직선 위 점 5개로 만든 선분과 반직선을 세어요.', set: begin('colSum', { lcx: null }), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: '선분은 끝점 쌍, 반직선은 시작점과 방향을 기준으로 해요.', step: 1 }
      ], { lcn: 5, lcf: 0, plSeed: 2, plTrace: 0 }),
      ch('선분의 개수부터', 12, [
        { at: 0, say: '각 점에서 다른 점 4개를 이으면 같은 선분을 두 번 세요.', step: 2 },
        { at: 5.5, say: '선분은 $5×4÷2=10$개예요.', set: { plSupportReady: true } }
      ]),
      ch('반직선은 방향을 세어요', 12, [
        { at: 0, say: '양 끝점은 안쪽으로만, 안쪽 세 점은 양쪽으로 뻗어요.' },
        { at: 5.5, say: '반직선은 $1+3×2+1=8$개예요.', set: { plOtherReady: true } }
      ]),
      ch('물어본 개수만 더하기', 12, [
        { at: 0, say: '직선 하나는 더하지 않고 선분과 반직선만 합해요.' },
        { at: 5.5, say: '$10+8=18$, 구하는 합 18개예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ])
  ];

  lessons['l-gen'] = [
    make('직선과선분', '세 점이 일직선이 아닐 때 세기', '직선 10개 · 선분 10개', '두 점의 쌍이 직선과 선분을 각각 하나씩 정해요', '점을 하나 더했을 때 새로 늘어나는 선을 세어 보세요', [
      ch('어느 세 점도 일직선이 아님', 12, [
        { at: 0, say: '점은 5개이고 어느 세 점도 한 직선 위에 있지 않아요.', set: begin('genLine'), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: '각 점에서 다른 4개 점으로 직선을 그을 수 있어요.', step: 1, set: { plSupportReady: true } }
      ], { lgn: 5, lgm: 5, lgr: .7, plSeed: 0, plTrace: 0 }),
      ch('이름 순서가 바뀐 중복', 12, [
        { at: 0, say: '모든 점을 기준으로 하면 $5×4=20$번 세어요.', step: 2, set: { plOtherReady: true } },
        { at: 5.5, say: '직선 AB와 BA는 같아요. 선분 AB와 BA도 같아요.' }
      ]),
      ch('두 점의 쌍으로 정리', 12, [
        { at: 0, say: '같은 것을 두 번 셌으므로 각각 2로 나누어요.' },
        { at: 5.5, say: '$20÷2=10$. 직선 10개 · 선분 10개예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ]),
    make('반직선', '일직선이 아닌 점의 반직선 세기', '반직선 20개', '서로 다른 시작점과 방향이므로 두 번 센 것이 아니에요', '한 직선 위의 점일 때와 왜 계산이 다른지 설명해 보세요', [
      ch('각 시작점에서 방향 찾기', 12, [
        { at: 0, say: '점 5개 중 어느 세 점도 한 직선 위에 있지 않아요.', set: begin('genRay'), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: '한 점에서 나머지 4개 점을 향하는 방향이 모두 달라요.', step: 1, set: { plSupportReady: true } }
      ], { lgn: 5, lgm: 5, lgr: .7, plSeed: 1, plTrace: 0 }),
      ch('반직선은 나누지 않아요', 12, [
        { at: 0, say: 'AB와 BA는 시작점이 달라 서로 다른 반직선이에요.', step: 2 },
        { at: 5.5, say: '$5×4=20$, 따라서 반직선 20개예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ]),
    make('개수의합', '일직선이 아닌 점의 개수 합', '합 30개', '선분은 중복을 나누고 반직선은 나누지 않은 뒤 더해요', '반직선만 두 번 더하는 실수를 하지 않았는지 확인해 보세요', [
      ch('점의 배치와 구할 도형', 12, [
        { at: 0, say: '점 5개 중 어느 세 점도 한 직선 위에 있지 않아요.', set: begin('genSum'), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: '선분과 반직선의 개수를 각각 구해서 더할 거예요.', step: 1 }
      ], { lgn: 5, lgm: 5, lgr: .7, plSeed: 2, plTrace: 0 }),
      ch('선분은 중복을 나누어요', 12, [
        { at: 0, say: '한 점에서 다른 네 점을 잇고 AB와 BA의 중복을 나눠요.', step: 2 },
        { at: 5.5, say: '선분은 $5×4÷2=10$개예요.', set: { plSupportReady: true } }
      ]),
      ch('반직선은 시작점이 달라요', 12, [
        { at: 0, say: '반직선 AB와 BA는 달라서 두 번 센 것이 아니에요.' },
        { at: 5.5, say: '반직선은 $5×4=20$개예요.', set: { plOtherReady: true } }
      ]),
      ch('서로 다른 두 개수의 합', 12, [
        { at: 0, say: '구한 선분과 반직선의 개수만 합해요.' },
        { at: 5.5, say: '$10+20=30$, 구하는 합 30개예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ])
  ];

  lessons['l-mix'] = [
    make('직선', '일부 점이 일직선인 직선 개수', '직선 10개', '겹친 쌍을 모두 뺀 다음 실제 직선 하나를 다시 더해요', '마지막에 직선 하나를 더해야 하는 이유를 설명해 보세요', [
      ch('전체 점과 일직선 위의 점', 12, [
        { at: 0, say: '전체 6개 중 A, B, C, D 네 점이 한 직선 위예요.', set: begin('mixLine', { lkx: null }), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: '그 밖에는 세 점이 일직선인 경우가 없어요. 쌍부터 세요.', step: 1 }
      ], { lkn: 6, lkk: 4, plSeed: 0, plTrace: 0 }),
      ch('전체 쌍과 겹치는 쌍', 12, [
        { at: 0, say: '전체 두 점의 쌍은 $6×5÷2=15$개예요.', step: 2, set: { plSupportReady: true } },
        { at: 5.5, say: '일직선 위 네 점끼리의 $4×3÷2=6$쌍은 겹쳐요.', set: { plOtherReady: true } }
      ]),
      ch('뺀 직선 하나 다시 넣기', 12, [
        { at: 0, say: '겹친 여섯 쌍을 빼고 실제 직선 하나를 다시 더해요.', set: { plExtraReady: true } },
        { at: 5.5, say: '$15-6+1=10$, 따라서 직선 10개예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ]),
    make('반직선', '일부 점이 일직선인 반직선 개수', '반직선 24개', '일직선 위에서 같은 시작점·방향으로 겹치는 것을 바꾸어요', '일직선 위 네 점의 실제 반직선을 따로 세어 보세요', [
      ch('시작점과 향하는 점의 쌍', 12, [
        { at: 0, say: '전체 6개 중 네 점이 일직선이고 다른 겹침은 없어요.', set: begin('mixRay', { lkx: null }), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: '먼저 시작점과 향하는 점을 정한 쌍을 모두 세어요.', step: 1 }
      ], { lkn: 6, lkk: 4, plSeed: 1, plTrace: 0 }),
      ch('전체에서 겹친 이름을 빼기', 12, [
        { at: 0, say: '각 점에서 나머지 다섯 점으로 $6×5=30$쌍이에요.', step: 2, set: { plSupportReady: true } },
        { at: 5.5, say: '일직선 위 네 점끼리의 $4×3=12$쌍은 따로 빼요.', set: { plOtherReady: true } }
      ]),
      ch('실제 방향 수로 다시 넣기', 12, [
        { at: 0, say: '그 네 점의 실제 반직선은 $1+2+2+1=6$개예요.', set: { plExtraReady: true } },
        { at: 5.5, say: '$30-12+6=24$, 따라서 반직선 24개예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ]),
    make('선분', '일부 점이 일직선인 선분 개수', '선분 15개', '일직선 위에서도 끝점 쌍이 다르면 서로 다른 선분이에요', 'AB와 AC가 같은 직선 위에서도 다른 선분인 이유를 말해 보세요', [
      ch('점의 배치와 끝점 쌍', 12, [
        { at: 0, say: '전체 6개 중 네 점이 일직선이에요. 두 끝점을 이어요.', set: begin('mixSegment', { lkx: null }), to: { plTrace: 1 }, dur: 4 },
        { at: 5.5, say: '아래 호는 끝점 쌍 표시예요. AB와 AC는 다른 선분이에요.', step: 1 }
      ], { lkn: 6, lkk: 4, plSeed: 0, plTrace: 0 }),
      ch('양쪽에서 센 중복', 12, [
        { at: 0, say: '각 점에서 다른 다섯 점을 이으면 $6×5=30$번 세요.', step: 2, set: { plSupportReady: true } },
        { at: 5.5, say: 'AB와 BA처럼 같은 끝점 쌍을 두 번 셌어요.' }
      ]),
      ch('일직선의 겹침을 빼지 않기', 12, [
        { at: 0, say: '직선과 달리 끝점 쌍이 다르면 선분 개수는 줄지 않아요.' },
        { at: 5.5, say: '$30÷2=15$, 따라서 선분 15개예요.', step: 3, set: { plShowAnswer: true } }
      ])
    ])
  ];
})();
