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
})();
