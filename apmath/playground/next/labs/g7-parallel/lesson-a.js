/* 동위각·엇각과 꺾인 선: 원본 각·평행 조건에 결속한 독립 해설. */
(function () {
  'use strict';
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g7-parallel'] = all['g7-parallel'] || {};
  const begin = (mode, extra = {}) => ({ paShowAnswer: false, paSupportReady: false, paCaseReady: false, paCase: 0, paLessonMode: mode, ...extra });
  const ch = (title, length, cues, start) => ({ title, length, ...(start ? { start } : {}), cues });
  const make = (label, title, answer, summary, task, chapters) => ({ label, title, answer, answerText: answer, summary, task, tab: 'review', chapters });

  lessons['p1-1'] = ['corr', 'alt'].map(kind => {
    const name = kind === 'corr' ? '동위각' : '엇각', partner = kind === 'corr' ? 'g' : 'f';
    return make(name, `각 c의 ${name} 찾기`, `∠${partner}`, '각의 크기보다 두 교점에서의 위치를 먼저 살펴요', '다른 각을 골라 그 각의 동위각과 엇각을 찾아보세요', [
      ch('두 교점의 위치', 12, [
        { at: 0, say: 'l과 m은 평행하고 n이 가로질러요. 초록 각 c를 보세요.', set: begin('position', { pMode: kind, pKind: kind, pTar: 'c' }), to: { paTrace: .6 }, dur: 4 },
        { at: 5.5, say: kind === 'corr' ? '동위각은 서로 다른 교점의 같은 쪽, 같은 위치예요.' : '엇각은 두 직선 사이에서 횡단선의 반대쪽에 있어요.', step: 1 }
      ], { pT: 65, pX: 0, pPair: 0, paTrace: 0 }),
      ch('다른 교점에서 짝 찾기', 12, [
        { at: 0, say: kind === 'corr' ? '한 교점 안에서 고르지 말고 같은 위치를 따라가요.' : '두 직선 안쪽에서 엇갈린 Z 모양을 따라가요.', to: { paTrace: 1 }, dur: 4 },
        { at: 5.5, say: `∠c의 ${name}은 ∠${partner}예요.`, step: 3, set: { paShowAnswer: true } }
      ])
    ]);
  });

  lessons['p1-2'] = ['corr', 'alt'].map(kind => {
    const name = kind === 'corr' ? '동위각' : '엇각', first = kind === 'corr' ? 'b' : 'c';
    return make(`${name}조건`, `${name}으로 평행 조건 확인`, 'l ∥ m', '동위각이나 엇각 한 쌍의 크기가 같으면 평행해요', '평행선의 성질과 평행이 되는 조건을 거꾸로 읽어보세요', [
      ch('같은 크기의 두 각', 12, [
        { at: 0, say: `횡단선 n과 만난 각 ${first}, f는 모두 65°예요.`, set: begin('condition', { qMode: kind, qGiven: 'a', qAsk: 'f' }), to: { paTrace: 1 }, dur: 4 },
        { at: 5.5, say: kind === 'corr' ? '같은 쪽, 같은 위치이므로 두 각은 동위각이에요.' : '두 직선 안쪽에서 엇갈린 위치이므로 엇각이에요.', step: 1 }
      ], { qT: 65, qPhi: 0, paTrace: 0 }),
      ch('각에서 직선의 관계로', 12, [
        { at: 0, say: `크기가 같은 ${name} 한 쌍이 있음을 확인했어요.`, step: 2 },
        { at: 5.5, say: `${name}이 같으므로 두 직선은 평행, l ∥ m이에요.`, step: 3, set: { paShowAnswer: true } }
      ])
    ]);
  });
  lessons['p1-2'].push(make('각크기', '동위각과 평각으로 각 구하기', 'x=65°', '동위각을 옮긴 뒤 이웃한 두 각의 합을 써요', '다른 각을 주어진 각으로 정해 x를 다시 구해 보세요', [
    ch('주어진 각과 구하는 각', 12, [
      { at: 0, say: 'l과 m은 평행해요. 위쪽 각 a는 115°, 아래쪽 각은 x.', set: begin('conditionSolve', { qMode: 'corr', qGiven: 'a', qAsk: 'f' }), to: { paTrace: 1 }, dur: 4 },
      { at: 5.5, say: 'a와 아래쪽 각 e는 같은 위치의 동위각이에요.', step: 1 }
    ], { qT: 65, qPhi: 0, paTrace: 0 }),
    ch('같은 각과 이웃한 각', 12, [
      { at: 0, say: '평행선의 동위각은 같으므로 e도 115°예요.', step: 2, set: { paSupportReady: true } },
      { at: 5.5, say: 'e와 x는 한 직선 위에 이웃해 합이 180°예요.' }
    ]),
    ch('평각에서 주어진 각 빼기', 12, [
      { at: 0, say: '구하는 x는 평각 180°에서 e를 뺀 각이에요.' },
      { at: 5.5, say: '$x=180°-115°=65°$예요.', step: 3, set: { paShowAnswer: true } }
    ])
  ]));

  lessons['p1-3'] = [
    make('같은각', '표시한 각으로 평행 판별하기', 'l ∥ m', '크기를 비교하기 전에 동위각인지 확인해요', '두 각을 다르게 바꾸어 평행 여부를 확인해 보세요', [
      ch('표시한 두 각의 위치', 12, [
        { at: 0, say: '노란 각 p와 보라 각 q는 각각 70°예요.', set: begin('judgeEqual', { rMode: 'corr' }), to: { paTrace: 1 }, dur: 4 },
        { at: 5.5, say: '두 교점의 같은 위치에 있으므로 동위각이에요.', step: 1 }
      ], { rA: 70, rB: 70, paTrace: 0 }),
      ch('주어진 크기를 비교해요', 12, [
        { at: 0, say: '동위각 p와 q의 크기가 같은지 비교해요.', step: 2 },
        { at: 5.5, say: '둘 다 70°로 같으므로 l ∥ m이에요.', step: 3, set: { paShowAnswer: true } }
      ])
    ]),
    make('합180함정', '더해서 평각이 되면 평행일까', '평행하지 않아요', '동위각·엇각은 합이 아니라 같은 크기인지 비교해요', '90°와 90°는 크기도 같다는 점을 함께 생각해 보세요', [
      ch('표시한 두 각은 엇각', 12, [
        { at: 0, say: '노란 각 p는 70°, 보라 각 q는 110°예요.', set: begin('judgeTrap', { rMode: 'alt' }), to: { paTrace: 1 }, dur: 4 },
        { at: 5.5, say: '두 직선 안쪽에서 엇갈린 위치의 엇각이에요.', step: 1 }
      ], { rA: 70, rB: 110, paTrace: 0 }),
      ch('합과 같음을 구별해요', 12, [
        { at: 0, say: '더하면 180°지만 평행 조건은 두 엇각의 크기가 같음이에요.', step: 2 },
        { at: 5.5, say: '70°와 110°는 다르므로 평행하지 않아요.', step: 3, set: { paShowAnswer: true } }
      ])
    ]),
    make('보기판별', '다섯 그림에서 평행한 것 찾기', '⑤', '각 그림의 동위각·엇각을 확인하고 크기를 비교해요', '직접 해 보기의 새 다섯 그림도 같은 순서로 비교해 보세요', [
      ch('첫 번째 그림', 10, [
        { at: 0, say: '다섯 그림을 차례로 비교해요. ①은 동위각 70°, 90°.', set: begin('judge', { rMode: 'corr' }), to: { paTrace: 1 }, dur: 4 },
        { at: 5, say: '동위각의 크기가 다르므로 ①은 제외해요.', step: 1, set: { paCaseReady: true } }
      ], { rA: 70, rB: 90, paTrace: 0 }),
      ch('두 번째 그림', 10, [
        { at: 0, say: '②의 엇각은 70°와 110°예요.', set: { paCase: 1, paCaseReady: false } },
        { at: 5, say: '합이 180°여도 크기는 다르므로 ②도 제외해요.', set: { paCaseReady: true } }
      ]),
      ch('세 번째 그림', 10, [
        { at: 0, say: '③의 동위각은 60°와 80°예요.', set: { paCase: 2, paCaseReady: false } },
        { at: 5, say: '동위각의 크기가 다르므로 ③도 제외해요.', set: { paCaseReady: true } }
      ]),
      ch('네 번째 그림', 10, [
        { at: 0, say: '④의 엇각은 100°와 115°예요.', set: { paCase: 3, paCaseReady: false } },
        { at: 5, say: '엇각의 크기가 다르므로 ④도 제외해요.', set: { paCaseReady: true } }
      ]),
      ch('마지막 그림', 10, [
        { at: 0, say: '마지막 그림의 동위각은 둘 다 65°예요.', set: { paCase: 4, paCaseReady: false } },
        { at: 5, say: '동위각이 같아 두 직선이 평행해요. 정답은 ⑤예요.', step: 3, set: { paShowAnswer: true, paCaseReady: true } }
      ])
    ])
  ];

  lessons['p2-1'] = [false, true].map(numeric => make(numeric ? '각크기' : '각의관계', numeric ? '평행선 사이의 꺾인 각 계산' : '꺾인 각과 두 엇각의 관계', numeric ? 'x=80°' : 'x=a+b', '꺾인 점을 지나는 평행 보조선에 두 엇각을 모아요', '주어진 두 각을 바꾸고 같은 보조선을 그어 보세요', [
    ch('주어진 각과 평행 보조선', 12, [
      { at: 0, say: 'A쪽 각 a는 50°, B쪽 각 b는 30°예요.', set: begin(numeric ? 'bendSolve' : 'bendRelation'), to: { paTrace: 1 }, dur: 4 },
      { at: 5.5, say: '꺾인 점 P를 지나 l, m에 평행한 보조선을 그어요.', step: 1 }
    ], { bA: 50, bB: 30, bP: 1, bAux: 0, paTrace: 0 }),
    ch('모인 두 엇각', 12, [
      { at: 0, say: '엇각으로 옮긴 50°와 30°가 P에서 이웃해요.', step: 2, set: { paSupportReady: true } },
      { at: 5.5, say: numeric ? '$x=50°+30°=80°$예요.' : 'x는 두 각을 합한 각이므로 $x=a+b$예요.', step: 3, set: { paShowAnswer: true } }
    ])
  ]));

  lessons['p2-3'] = [make('보조선조건', '엇각을 쓸 수 있는 보조선', '보조선 ∥ l', '꺾인 점을 지나고 주어진 두 직선에 평행해야 해요', '직접 보조선을 돌려 같은 조건을 맞춰 보세요', [
    ch('꺾인 점을 지나는 선', 12, [
      { at: 0, say: '꺾인 점 P를 지나는 보조선의 방향을 바꿔 보아요.', set: begin('auxCondition'), to: { cPsi: 10 }, dur: 4, snap: 1 },
      { at: 5.5, say: 'P를 지나도 방향이 다르면 엇각이 같다고 할 수 없어요.', step: 1 }
    ], { cA: 45, cB: 35, cP: 1, cDir: 1, cPsi: 28, paTrace: 1 }),
    ch('두 직선과 같은 방향', 12, [
      { at: 0, say: '보조선을 l, m과 같은 방향으로 맞추어요.', to: { cPsi: 0 }, dur: 4, snap: 1 },
      { at: 5.5, say: '보조선 ∥ l이어야 엇각의 성질을 쓸 수 있어요.', step: 3, set: { paShowAnswer: true } }
    ])
  ])];
  for (const side of [1, -1]) lessons['p2-3'].push(make(side === 1 ? '오른쪽꺾임' : '왼쪽꺾임', '평행 보조선으로 꺾인 각 구하기', 'x=80°', '꺾인 방향이 달라도 평행 보조선과 엇각을 써요', '꺾인 방향을 바꾸고 같은 두 각을 찾아보세요', [
    ch('주어진 각과 꺾인 점', 12, [
      { at: 0, say: 'A쪽 각 a는 45°, B쪽 각 b는 35°예요.', set: begin('auxSolve'), to: { paTrace: 1 }, dur: 4 },
      { at: 5.5, say: 'P를 지나는 보조선을 l, m과 평행하게 그어요.', step: 1 }
    ], { cA: 45, cB: 35, cP: 1, cDir: side, cPsi: 0, paTrace: 0 }),
    ch('방향이 달라도 같은 방법', 12, [
      { at: 0, say: '엇각인 45°와 35°를 P로 옮기면 두 각이 이웃해요.', step: 2, set: { paSupportReady: true } },
      { at: 5.5, say: '$x=45°+35°=80°$예요.', step: 3, set: { paShowAnswer: true } }
    ])
  ]));

  lessons['p2-2'] = [1, 2, 3].map(k => {
    const target = k === 3 ? 3 : 1, name = k === 3 ? 'R' : 'P', answer = k === 3 ? 105 : 95;
    const chapters = [ch('꺾인 점마다 평행 보조선', 12, [
      { at: 0, say: `꺾인 점은 ${k}개예요. ${name}에서의 초록 각을 x라 해요.`, set: begin('zig'), to: { paTrace: 1 }, dur: 5 },
      { at: 5.5, say: 'l과 m은 평행해요. 각 꺾인 점에도 평행선을 그어요.', step: 1 }
    ], { kK: k, uA: 55, uB: 40, uC: 60, uD: 45, zTar: target, zAux: 0, paTrace: 0 })];
    if (k === 1) chapters.push(ch('두 방향의 각을 모아요', 12, [
      { at: 0, say: '오른쪽의 55°와 40°가 엇각으로 옮겨져 x를 이루어요.', step: 2, set: { paSupportReady: true } },
      { at: 5.5, say: '따라서 $x=55°+40°=95°$예요.', step: 3, set: { paShowAnswer: true } }
    ]));
    else {
      chapters.push(ch('열린 방향에 따라 더해요', 12, [
        { at: 0, say: '엇각을 모으면 오른쪽으로 열린 각의 합과 왼쪽 합이 같아요.', step: 2 },
        { at: 5.5, say: k === 2 ? '오른쪽은 $55°+100°=155°$, 왼쪽은 $x+60°$예요.' : '오른쪽은 $55°+100°+45°=200°$, 왼쪽은 $95°+x$.', set: { paSupportReady: true } }
      ]));
      chapters.push(ch('같은 쪽의 나머지를 빼요', 12, [
        { at: 0, say: k === 2 ? '왼쪽의 다른 각 60°를 오른쪽 합 155°에서 빼요.' : '왼쪽의 다른 각 95°를 오른쪽 합 200°에서 빼요.' },
        { at: 5.5, say: k === 2 ? '$x=155°-60°=95°$예요.' : '$x=200°-95°=105°$예요.', step: 3, set: { paShowAnswer: true } }
      ]));
    }
    return make(['한번꺾임', '두번꺾임', '세번꺾임'][k - 1], '열린 방향별 각의 합으로 계산', `x=${answer}°`, '끝점의 각도 포함해서 열린 방향별로 더해요', '꺾인 점 수와 구할 각을 바꾸어 같은 식을 세워 보세요', chapters);
  });
})();
