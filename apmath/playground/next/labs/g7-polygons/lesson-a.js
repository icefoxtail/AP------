/* 다각형·삼각형의 내외각: 실제 장면의 고정 조건을 쓰는 원클릭 해설. */
(function () {
  'use strict';
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g7-polygons'] = all['g7-polygons'] || {};
  const begin = mode => ({ pgShowAnswer: false, pgSupportReady: false, pgSecondReady: false, pgLessonMode: mode });
  const ch = (title, length, cues, start) => ({ title, length, ...(start ? { start } : {}), cues });
  const make = (label, title, answer, summary, task, chapters) => ({ label, title, answer, answerText: answer, summary, task, tab: 'review', chapters });

  lessons['p1-one'] = [
    make('대각선', '한 꼭짓점에서 그은 대각선', '대각선 4개', '자기 자신과 이웃 두 꼭짓점을 제외해요', '꼭짓점의 수를 바꾸어 n−3을 확인해 보세요', [
      ch('어느 점과 이을까요', 12, [
        { at: 0, say: '7각형의 한 꼭짓점에서 대각선을 그어요.', set: begin('diag'), to: { pgT: .5 }, dur: 4 },
        { at: 5.5, say: '자기 자신과 이웃한 두 꼭짓점은 제외해요.', step: 1 }
      ], { pgN: 7, pgV: 0, pgT: 0 }),
      ch('이을 수 있는 점의 수', 12, [
        { at: 0, say: '전체 7개에서 제외한 3개를 빼요.', to: { pgT: 1 }, dur: 4 },
        { at: 5.5, say: '대각선은 $7-3=4$개예요.', step: 2, set: { pgShowAnswer: true, pgSupportReady: true } }
      ])
    ]),
    make('삼각형', '대각선으로 나누어진 삼각형', '삼각형 5개', '대각선의 수보다 나누어진 삼각형이 하나 더 많아요', '대각선과 삼각형을 따로 세어 차이를 확인해 보세요', [
      ch('한 꼭짓점에서 나누어요', 12, [
        { at: 0, say: '7각형의 한 꼭짓점에서 대각선을 모두 그어요.', set: begin('tri'), to: { pgT: 1 }, dur: 5 },
        { at: 5.5, say: '자신과 이웃한 두 점에는 대각선을 그리지 않아요.', step: 1 }
      ], { pgN: 7, pgV: 0, pgT: 0 }),
      ch('선과 영역을 구별해요', 12, [
        { at: 0, say: '대각선 4개 사이의 삼각형은 하나 더 많아요.', step: 3, set: { pgSupportReady: true } },
        { at: 5.5, say: '삼각형은 $4+1=7-2=5$개예요.', set: { pgShowAnswer: true } }
      ])
    ]),
    make('a+b', '대각선과 삼각형의 개수 더하기', '$a+b=9$', 'a는 대각선 수, b는 삼각형 수로 따로 구해요', '다른 다각형에서 a와 b를 구하고 더해 보세요', [
      ch('두 수의 뜻', 12, [
        { at: 0, say: '7각형에서 대각선 수를 a, 삼각형 수를 b라 해요.', set: begin('sum'), to: { pgT: 1 }, dur: 5 },
        { at: 5.5, say: '전체 대각선이 아니라 한 꼭짓점에서만 세어요.', step: 1 }
      ], { pgN: 7, pgV: 0, pgT: 0 }),
      ch('각각 세어 보아요', 12, [
        { at: 0, say: '제외할 꼭짓점은 셋, 대각선 a는 $7-3=4$.', step: 2, set: { pgSupportReady: true } },
        { at: 5.5, say: '나누어진 삼각형 b는 $7-2=5$개예요.', step: 3, set: { pgSecondReady: true } }
      ]),
      ch('물은 값을 완성해요', 10, [
        { at: 0, say: '문제는 a 또는 b가 아니라 두 수의 합을 물어요.' },
        { at: 5, say: '$a+b=4+5=9$예요.', set: { pgShowAnswer: true } }
      ])
    ])
  ];

  lessons['p1-all'] = make('전체개수', '꼭짓점마다 센 대각선', '대각선 9개', '양쪽 끝에서 두 번씩 센 값을 2로 나누어요', '다른 다각형에서도 같은 대각선이 두 번 세어지는지 확인해 보세요', [
    ch('한 꼭짓점에서 시작', 12, [
      { at: 0, say: '6각형의 대각선을 꼭짓점마다 세어 보아요.', set: begin('all'), to: { pgT: 1 / 6 }, dur: 5 },
      { at: 5.5, say: '한 꼭짓점에서는 $6-3=3$개예요.', step: 1, set: { pgSupportReady: true } }
    ], { pgN: 6, pgT: 0 }),
    ch('모든 꼭짓점에서 세면', 12, [
      { at: 0, say: '6개 꼭짓점에서 각각 3개씩 세어요.', to: { pgT: 1 }, dur: 5 },
      { at: 5.5, say: '이렇게 센 합은 $6×3=18$이에요.', step: 2, set: { pgSecondReady: true } }
    ]),
    ch('겹쳐 센 것을 고쳐요', 12, [
      { at: 0, say: '같은 대각선을 양쪽 끝에서 두 번씩 세었어요.', step: 3 },
      { at: 5.5, say: '따라서 대각선은 $18÷2=9$개예요.', set: { pgShowAnswer: true } }
    ])
  ]);

  lessons['p1-find'] = make('몇각형', '대각선의 개수에서 꼭짓점 수 찾기', '9각형', 'n과 n−3은 차이가 3인 두 자연수예요', '목표 대각선 수를 바꾸고 후보를 찾아보세요', [
    ch('조건과 미지수', 12, [
      { at: 0, say: '대각선은 27개예요. 꼭짓점 수를 n이라 해요.', set: begin('find'), to: { pgN: 7 }, dur: 1 },
      { at: 5.5, say: '후보 7각형은 $7×4÷2=14$개로 부족해요.', step: 1, set: { pgSupportReady: true } }
    ], { pgN: 6, pgM: 27 }),
    ch('공식을 거꾸로 써요', 12, [
      { at: 0, say: '전체 대각선 공식으로 $n(n-3)÷2=27$.', set: { pgSupportReady: false } },
      { at: 5.5, say: '양변에 2를 곱하면 $n(n-3)=54$예요.', step: 2, set: { pgSecondReady: true } }
    ]),
    ch('차이가 3인 두 수', 12, [
      { at: 0, say: '곱이 54이고 차이가 3인 두 자연수를 찾아요.', to: { pgN: 9 }, dur: 3 },
      { at: 5.5, say: '$9×6=54$이므로 n은 9, 9각형이에요.', step: 3, set: { pgShowAnswer: true } }
    ])
  ]);

  lessons['p2-ext'] = make('외각', '평행 보조선으로 외각 구하기', '$x=110°$', '외각은 이웃하지 않는 두 내각의 합이에요', '두 내각을 바꾸어 외각과 비교해 보세요', [
    ch('평행한 선을 그어요', 12, [
      { at: 0, say: '∠A는 50°, ∠B는 60°예요. C에서 보조선을 그어요.', set: begin('ext'), to: { pgEt: .34 }, dur: 5 },
      { at: 5.5, say: '보조선 CE는 AB와 평행하고, 구하는 외각은 x예요.', step: 1 }
    ], { pgEa: 50, pgEb: 60, pgEt: 0 }),
    ch('같은 각을 옮겨요', 12, [
      { at: 0, say: '평행선의 엇각과 동위각은 각각 같아요.', to: { pgEt: .67 }, dur: 4 },
      { at: 5.5, say: 'C의 두 부분은 ∠A와 같은 50°, ∠B와 같은 60°.', step: 2 }
    ]),
    ch('외각은 두 부분의 합', 12, [
      { at: 0, say: '외각 x는 이웃하지 않는 두 내각을 합친 각이에요.', to: { pgEt: 1 }, dur: 4 },
      { at: 5.5, say: '$x=50°+60°=110°$예요.', step: 3, set: { pgShowAnswer: true } }
    ])
  ]);

  lessons['p2-star'] = [
    make('다섯각합', '별의 뾰족한 다섯 각', '180°', '외각을 이용해 다섯 각을 한 삼각형의 세 내각으로 모아요', '별의 모양을 바꾸어 같은 관계를 찾아보세요', [
      ch('별 안의 삼각형 찾기', 12, [
        { at: 0, say: '별의 뾰족한 다섯 각을 더해요. 두 삼각형을 보세요.', set: begin('starSum'), to: { pgStarT: 1 }, dur: 5 },
        { at: 5.5, say: 'P와 S는 선이 만나는 점이고, 외각의 성질을 써요.', step: 1 }
      ], { pgSa: 36, pgSb: 36, pgSc: 36, pgSd: 36, pgStarT: 0 }),
      ch('외각을 작은 삼각형에 모아요', 12, [
        { at: 0, say: 'P의 각은 ∠C+∠E, S의 각은 ∠B+∠D예요.', step: 2 },
        { at: 5.5, say: '여기에 ∠A를 더하면 △APS의 세 내각이에요.' }
      ]),
      ch('삼각형의 내각의 합', 12, [
        { at: 0, say: '다섯 뾰족한 각이 한 삼각형의 세 내각으로 모였어요.' },
        { at: 5.5, say: '따라서 다섯 각의 합은 180°예요.', step: 3, set: { pgShowAnswer: true } }
      ])
    ]),
    make('빈각', '별에서 주어지지 않은 각', '$∠E=40°$', '다섯 각의 합에서 주어진 네 각의 합을 빼요', '주어진 네 각을 바꾸고 남은 각을 구해 보세요', [
      ch('주어진 각과 구하는 각', 12, [
        { at: 0, say: '네 각은 32°, 36°, 38°, 34°이고 ∠E를 x라 해요.', set: begin('starSolve'), to: { pgStarT: 1 }, dur: 5 },
        { at: 5.5, say: 'P와 S에서 삼각형의 외각을 찾아요.', step: 1 }
      ], { pgSa: 32, pgSb: 36, pgSc: 38, pgSd: 34, pgStarT: 0 }),
      ch('다섯 각의 합을 써요', 12, [
        { at: 0, say: '외각을 모은 △APS에서 다섯 각의 합은 180°예요.', step: 2 },
        { at: 5.5, say: '주어진 네 각의 합은 $32+36+38+34=140°$.', set: { pgSecondReady: true } }
      ]),
      ch('남은 각을 구해요', 12, [
        { at: 0, say: '전체 180°에서 주어진 네 각의 합 140°를 빼요.' },
        { at: 5.5, say: '$∠E=x=180°-140°=40°$예요.', step: 3, set: { pgShowAnswer: true } }
      ])
    ])
  ];

  lessons['p2-bis'] = [1, 2, 3].map(k => {
    const label = ['내각둘', '외각둘', '내외각'][k - 1], value = [120, 60, 30][k - 1];
    const intro = ['B와 C의 내각을 각각 반으로 나누어요.', 'B와 C의 외각을 각각 반으로 나누어요.', 'B의 내각과 C의 외각을 각각 반으로 나누어요.'][k - 1];
    const relation = ['∠A가 60°이므로 2●+2×=180°−60°.', '외각 둘의 합은 $360°-(180°-60°)=240°$.', 'C의 외각에서 2×=60°+2●예요.'][k - 1];
    const mid = ['둘로 나누면 ●+×=60°예요.', '둘로 나누면 ●+×=120°예요.', '△DBC의 외각에서도 ×=●+x예요.'][k - 1];
    const strategy = ['△IBC의 내각의 합에서 ●와 ×를 빼요.', '△EBC의 내각의 합에서 ●와 ×를 빼요.', '두 식을 비교하면 $2x=60°$예요.'][k - 1];
    const finish = ['$x=180°-60°=120°$예요.', '$x=180°-120°=60°$예요.', '$x=60°÷2=30°$예요.'][k - 1];
    return make(label, ['내각 이등분선 둘이 만드는 각', '외각 이등분선 둘이 만드는 각', '내각과 외각의 이등분선'][k - 1], `$x=${value}°$`, '같은 표시의 각을 정하고 내각의 합과 외각의 성질을 써요', '이등분선의 종류를 바꾸어 서로 다른 결과를 비교해 보세요', [
      ch('이등분선과 기호', 12, [
        { at: 0, say: intro, set: begin(`bis${k}`), to: { pgBisT: 1 }, dur: 5 },
        { at: 5.5, say: '∠A는 60°. 같은 표시의 반쪽 각을 ●와 ×라 해요.', step: 1 }
      ], { pgKa: 60, pgKb: 60, pgK: k, pgBisT: 0 }),
      ch('각 사이의 관계', 12, [
        { at: 0, say: relation, step: 2, set: { pgSupportReady: true } },
        { at: 5.5, say: mid, ...(k !== 3 ? { set: { pgSecondReady: true } } : {}) }
      ]),
      ch('구하는 각을 남겨요', 12, [
        { at: 0, say: strategy, ...(k === 3 ? { set: { pgSecondReady: true } } : {}) },
        { at: 5.5, say: finish, step: 3, set: { pgShowAnswer: true } }
      ])
    ]);
  });

  lessons['p2-chain'] = [false, true].map(solve => make(solve ? 'x구하기' : '연쇄유도', solve ? '이등변삼각형 연쇄에서 x 구하기' : '같은 변으로 이어진 삼각형의 각', solve ? '$x=18°$' : '$∠EDF=4x$', '이등변삼각형의 밑각과 외각의 성질을 번갈아 써요', '주어진 마지막 각을 바꾸고 x를 구해 보세요', [
    ch('첫 삼각형의 밑각', 12, [
      { at: 0, say: solve ? '∠EDF는 72°. 같은 길이의 변이 이어지고 ∠A를 x라 해요.' : 'AB=BC=CD=DE=EF이고, ∠A를 x라 해요.', set: begin(solve ? 'chainSolve' : 'chain'), to: { pgCt: .25 }, dur: 5 },
      { at: 5.5, say: 'AB=BC이므로 △ABC의 두 밑각은 x예요.', step: 1 }
    ], { pgCx: 18, pgCt: 0 }),
    ch('외각과 같은 밑각', 12, [
      { at: 0, say: '△ABC의 외각 ∠CBD는 $x+x=2x$예요.', to: { pgCt: .5 }, dur: 5 },
      { at: 5.5, say: 'BC=CD이므로 다음 밑각 ∠CDB도 2x예요.', step: 2 }
    ]),
    ch('다시 같은 원리를 써요', 12, [
      { at: 0, say: '△ACD의 외각 ∠DCE는 $x+2x=3x$예요.', to: { pgCt: .75 }, dur: 5 },
      { at: 5.5, say: 'CD=DE이므로 ∠DEC도 3x예요.', step: 3 }
    ]),
    ch('마지막 삼각형까지', 12, [
      { at: 0, say: '△ADE의 외각 ∠EDF는 x와 3x를 합한 각이에요.', to: { pgCt: 1 }, dur: 5 },
      { at: 5.5, say: solve ? '$4x=72°$이므로 $x=72°÷4=18°$예요.' : '따라서 $∠EDF=x+3x=4x$예요.', step: 4, set: { pgShowAnswer: true } }
    ])
  ]));

  lessons['p2-iso'] = make('붙인삼각형', '이등변삼각형과 외각', '$∠D=35°$', '새 삼각형의 외각은 같은 두 밑각의 합이에요', '∠B를 바꾸어 ∠D가 항상 절반인지 확인해 보세요', [
    ch('첫 삼각형의 밑각', 12, [
      { at: 0, say: 'AB=AC인 삼각형에서 ∠B는 70°예요. BC를 늘여요.', set: begin('iso'), to: { pgIt: .7 }, dur: 5 },
      { at: 5.5, say: '이등변삼각형의 밑각은 같아서 ∠ACB도 70°예요.', step: 1, set: { pgSupportReady: true } }
    ], { pgIb: 70, pgIt: 0 }),
    ch('새 삼각형도 이등변', 12, [
      { at: 0, say: 'CD=CA가 되게 해요. 새 삼각형 ACD를 보세요.', to: { pgIt: 1 }, dur: 4 },
      { at: 5.5, say: 'CA=CD이므로 두 밑각 ∠CAD와 ∠D를 x라 해요.', step: 2 }
    ]),
    ch('외각에서 두 밑각으로', 12, [
      { at: 0, say: '∠ACB는 △ACD의 외각이므로 $70°=x+x=2x$.', set: { pgSecondReady: true } },
      { at: 5.5, say: '$∠D=70°÷2=35°$. ∠B의 절반이에요.', step: 3, set: { pgShowAnswer: true } }
    ])
  ]);
})();
