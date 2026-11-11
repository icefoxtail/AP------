/* 중2 시범: 개념 상태와 고정 pyQ 문제 상태를 구별하여 재생한다. */
(function () {
  'use strict';
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g8-pythagoras'] = all['g8-pythagoras'] || {};
  const begin = (problem, mode, q) => ({ pyLessonProblem: problem, pyLessonMode: mode, pyShowAnswer: false, pyCalculationReady: false, pySquareAReady: false, pySquareBReady: false, pySquareCReady: false, pySupportReady: false, pyOtherReady: false, pyQ: q, pySeed: 0, pyGrid: false, pyArrange: 0 });
  const ch = (title, length, cues, start) => ({ title, length, ...(start ? { start } : {}), cues });
  const make = (label, title, answer, summary, task, chapters) => ({ label, title, answer, answerText: answer, summary, task, tab: 'review', chapters });

  lessons['py1-sq'] = [make('넓이관계', '세 정사각형의 넓이 관계', 'a² + b² = c²', '직각변 위 두 넓이의 합이 빗변 위 넓이예요', '직각변의 길이를 바꾸고 세 정사각형의 넓이를 비교해 보세요', [
    ch('세 변의 이름을 정해요', 12, [
      { at: 0, say: '직각을 낀 두 변은 a=3, b=4예요. 변 a를 따라가요.', set: begin(false, 'squares', { pyA: 3, pyB: 4 }), to: { pyTrace: 1 }, dur: 4 },
      { at: 5.5, say: '직각 C의 맞은편을 빗변 c라 해요. 넓이는 변의 제곱이에요.', step: 1 }
    ], { pyA: 3, pyB: 4, pyTrace: 0 }),
    ch('직각변 위의 두 넓이', 12, [
      { at: 0, say: 'a 위 정사각형의 넓이는 a²=3²=9예요.', step: 2, set: { pySquareAReady: true } },
      { at: 5.5, say: 'b 위 정사각형의 넓이는 b²=4²=16이에요.', set: { pySquareBReady: true } }
    ]),
    ch('빗변 위 넓이와 비교해요', 12, [
      { at: 0, say: '노란 정사각형의 넓이는 c²예요. 두 작은 넓이와 비교해요.', step: 3 },
      { at: 5.5, say: '9+16=25예요. 직각삼각형에서는 a²+b²=c²가 성립해요.', set: { pyCalculationReady: true, pyShowAnswer: true } }
    ])
  ])];

  lessons['py1-leg'] = [make('직각변', '빗변에서 직각변 구하기', 'x = 8', '직각변의 제곱은 빗변의 제곱에서 빼서 구해요', '빗변과 주어진 직각변을 바꾸고 나머지 길이를 구해 보세요', [
    ch('빗변과 미지수를 구별해요', 12, [
      { at: 0, say: '직각 맞은편 빗변 c는 10, 한 직각변 a는 6이에요.', set: begin(true, 'leg', { pyH: 10, pyL: 6, pyK: 0 }), to: { pyTrace: 1 }, dur: 4 },
      { at: 5.5, say: '구하는 직각변 b=x예요. x²=빗변²−다른 직각변²예요.', step: 1 }
    ], { pyH: 10, pyL: 6, pyTrace: 0 }),
    ch('주어진 길이를 제곱해요', 12, [
      { at: 0, say: '빗변 위 정사각형은 c²=10²=100이에요.', step: 2, set: { pySquareCReady: true } },
      { at: 5.5, say: '주어진 직각변 위 정사각형은 a²=6²=36이에요.', set: { pySquareAReady: true } }
    ]),
    ch('남은 정사각형의 넓이', 12, [
      { at: 0, say: '남은 초록색 넓이는 x²=100−36=64예요.', step: 3, set: { pyCalculationReady: true } },
      { at: 5.5, say: '64는 길이가 아니라 제곱한 값이에요. 길이를 한 번 더 구해요.' }
    ]),
    ch('양수인 길이를 찾아요', 12, [
      { at: 0, say: '어떤 양수를 제곱하면 64가 되는지 생각해 보아요.' },
      { at: 5.5, say: '8²=64이므로 나머지 직각변의 길이는 x=8이에요.', set: { pyShowAnswer: true } }
    ])
  ])];

  lessons['py2-euclid'] = [make('왼쪽넓이', '빗변 위 직사각형의 넓이', '256', '왼쪽 직사각형의 넓이는 AC의 제곱과 같아요', '다른 직각삼각형을 골라 두 직사각형과 정사각형을 짝지어 보세요', [
    ch('주어진 변과 구할 넓이', 12, [
      { at: 0, say: 'AB는 20, BC는 12예요. 구하는 x는 왼쪽 직사각형의 넓이예요.', set: begin(true, 'euclid-area', { pyP: 5 }), to: { pyG: 0.35 }, dur: 4 },
      { at: 5.5, say: '세 정사각형의 한 변은 각각 삼각형의 변이에요.', step: 1 }
    ], { pyP: 5, pyG: 0 }),
    ch('수선을 따라 나눈 두 부분', 12, [
      { at: 0, say: '수선 CH를 연장해 나눈 두 직사각형을 갈라 보아요.', to: { pyG: 1 }, dur: 4 },
      { at: 5.5, say: '왼쪽은 AC 위 초록 정사각형과 넓이가 같아요. 이유를 살펴요.', step: 2 }
    ]),
    ch('닮음으로 같은 넓이 확인', 12, [
      { at: 0, say: '직각과 공통각 A가 같아 삼각형 ABC와 ACH는 닮아요.', step: 3, set: { pySupportReady: true } },
      { at: 5.5, say: 'AB:AC=AC:AH이므로 AB×AH=AC²예요.' }
    ]),
    ch('직각변의 제곱으로 계산', 12, [
      { at: 0, say: '왼쪽 넓이는 AC²=AB²−BC²=400−144예요.', step: 4, set: { pyCalculationReady: true } },
      { at: 5.5, say: '따라서 왼쪽 직사각형의 넓이는 400−144=256이에요.', step: 5, set: { pyShowAnswer: true } }
    ])
  ])];

  function hypotenuse(problem) {
    const a = problem ? 6 : 2, b = problem ? 8 : 3, sum = a * a + b * b;
    const chapters = [
      ch('직각변과 빗변 구별', 12, [
        { at: 0, say: `직각을 낀 두 변은 ${a}, ${b}예요. 직각 맞은편이 빗변이에요.`, set: begin(problem, problem ? 'hypotenuse' : 'square-value', { pyA: a, pyB: b }), to: { pyTrace: 1 }, dur: 4 },
        { at: 5.5, say: '빗변을 c라 해요. 길이 대신 먼저 제곱한 넓이를 구해요.', step: 1 }
      ], { pyA: a, pyB: b, pyTrace: 0 }),
      ch('두 직각변의 제곱', 12, [
        { at: 0, say: `첫 정사각형의 넓이는 ${a}²=${a * a}예요.`, step: 2, set: { pySquareAReady: true } },
        { at: 5.5, say: `둘째 정사각형의 넓이는 ${b}²=${b * b}예요.`, set: { pySquareBReady: true } }
      ]),
      ch('빗변의 제곱을 구해요', 12, [
        { at: 0, say: problem ? `c²=${a * a}+${b * b}=${sum}이에요. 아직 길이는 아니에요.` : '직각삼각형이므로 두 작은 정사각형의 넓이를 더해요.', step: 3, ...(problem ? { set: { pyCalculationReady: true } } : {}) },
        { at: 5.5, say: problem ? '제곱한 값에서 양수인 빗변의 길이를 찾아야 해요.' : 'c²=4+9=13이에요. 정수가 아닌 길이를 반올림하지 않아요.', ...(!problem ? { set: { pyCalculationReady: true, pyShowAnswer: true } } : {}) }
      ])
    ];
    if (problem) chapters.push(ch('양수인 빗변의 길이', 12, [
      { at: 0, say: '어떤 양수를 제곱하면 100이 되는지 생각해 보아요.' },
      { at: 5.5, say: '10²=100이므로 빗변의 길이는 x=c=10이에요.', set: { pyShowAnswer: true } }
    ]));
    return make(problem ? '빗변문제' : '제곱으로', problem ? '두 직각변으로 빗변 구하기' : '정수가 아닌 빗변은 제곱으로', problem ? 'x = 10' : 'c² = 13', '빗변의 제곱은 두 직각변의 제곱을 더한 값이에요', '두 직각변을 바꾸고 정수 길이인지 제곱한 값인지 구별해 보세요', chapters);
  }
  lessons['py1-sq'].push(hypotenuse(true), hypotenuse(false));
  lessons['py1-leg'].push(make('제곱으로', '정수가 아닌 직각변의 제곱', 'b² = 21', '제곱한 값을 길이처럼 쓰거나 반올림하지 않아요', '빗변과 직각변을 바꾸어 정수 길이와 제곱한 값을 구별해 보세요', [
    ch('구하는 것은 직각변이에요', 12, [
      { at: 0, say: '빗변 c=5, 한 직각변 a=2예요. 다른 직각변을 b라 해요.', set: begin(false, 'leg-square', { pyH: 5, pyL: 2, pyK: 0 }), to: { pyTrace: 1 }, dur: 4 },
      { at: 5.5, say: '직각변의 제곱은 빗변의 제곱에서 다른 직각변의 제곱을 빼요.', step: 1 }
    ], { pyH: 5, pyL: 2, pyTrace: 0 }),
    ch('두 정사각형의 넓이', 12, [
      { at: 0, say: '빗변 위의 넓이는 5²=25예요.', step: 2, set: { pySquareCReady: true } },
      { at: 5.5, say: '주어진 직각변 위의 넓이는 2²=4예요.', set: { pySquareAReady: true } }
    ]),
    ch('제곱한 값으로 나타내요', 12, [
      { at: 0, say: '초록 정사각형은 전체에서 하늘색 넓이를 뺀 부분이에요.', step: 3 },
      { at: 5.5, say: 'b²=25−4=21이에요. 정수 길이로 바꾸지 않고 이렇게 써요.', set: { pyCalculationReady: true, pyShowAnswer: true } }
    ])
  ]));

  function rotated(kind) {
    const problem = kind !== 'name', a = problem ? 6 : 3, b = problem ? 8 : 4, leg = kind === 'leg';
    const chapters = [
      ch('그림을 돌려도 유지되는 것', 12, [
        { at: 0, say: problem ? leg ? '빗변은 10, 주어진 직각변은 8이에요. 그림을 돌려 보아요.' : '두 직각변은 6, 8이에요. 그림을 돌려도 길이는 같아요.' : '네모 표시가 직각 C예요. 삼각형을 돌려도 직각은 같아요.', set: begin(problem, kind === 'name' ? 'find-hyp' : 'rotated', { pyWa: a, pyWb: b, pyK: leg ? 1 : 0 }), to: { pyRot: 125 }, dur: 4 },
        { at: 5.5, say: '가로·세로 방향 대신 직각 표시와 마주 보는 변을 살펴요.', step: 1 }
      ], { pyWa: a, pyWb: b, pyK: leg ? 1 : 0, pyRot: 35 })
    ];
    if (!problem) chapters.push(ch('직각의 맞은편 변', 12, [
      { at: 0, say: '직각 C를 끼는 변은 CA와 CB예요. 나머지 한 변을 찾아요.' },
      { at: 5.5, say: 'C의 맞은편 AB가 빗변이에요. 돌려 놓아도 바뀌지 않아요.', set: { pyShowAnswer: true } }
    ]));
    else chapters.push(ch('구하는 변에 맞는 계산', 12, [
      { at: 0, say: leg ? 'x는 직각변이므로 x²=10²−8²로 빼요.' : 'x는 빗변이므로 x²=6²+8²로 더해요.', step: 2, set: { pySupportReady: true } },
      { at: 5.5, say: leg ? 'x²=100−64=36이에요. 아직 제곱한 값이에요.' : 'x²=36+64=100이에요. 아직 제곱한 값이에요.', set: { pyCalculationReady: true } }
    ]), ch('양수인 변의 길이', 12, [
      { at: 0, say: '길이는 양수예요. 계산한 값이 되도록 제곱되는 수를 찾아요.' },
      { at: 5.5, say: leg ? '6²=36이므로 구하는 직각변 x=6이에요.' : '10²=100이므로 구하는 빗변 x=10이에요.', set: { pyShowAnswer: true } }
    ]));
    return make(kind === 'name' ? '빗변찾기' : leg ? '직각변' : '빗변문제', kind === 'name' ? '돌아간 삼각형의 빗변 찾기' : leg ? '돌아간 삼각형의 직각변' : '돌아간 삼각형의 빗변', kind === 'name' ? '빗변은 AB' : leg ? 'x = 6' : 'x = 10', '그림의 방향보다 직각과 구하는 변의 위치를 봐요', '직접 삼각형을 더 돌리고 빗변이 같은지 확인해 보세요', chapters);
  }
  lessons['py1-rot'] = [rotated('name'), rotated('hyp'), rotated('leg')];

  function grid(problem) {
    return make(problem ? '넓이문제' : '넓이공식', problem ? '기울어진 정사각형의 넓이' : '모눈의 두 이동과 넓이 관계', problem ? '13' : 'S = u² + v²', '바깥 정사각형에서 직각삼각형 네 개를 빼요', '가로·세로 이동을 바꾸고 한 변을 몰라도 넓이가 구해지는지 보세요', [
      ch('모눈에서 두 이동을 읽어요', 12, [
        { at: 0, say: 'S에서 P로 갈 때 가로 u=2칸, 세로 v=3칸 이동해요.', set: begin(problem, 'grid', { pyU: 2, pyV: 3 }), to: { pyTrace: 1 }, dur: 4 },
        { at: 5.5, say: '모눈 한 칸의 한 변은 1이에요. 구하는 것은 기울어진 넓이예요.', step: 1 }
      ], { pyU: 2, pyV: 3, pyTrace: 0 }),
      ch('바깥과 네 모서리의 넓이', 12, [
        { at: 0, say: '바깥 한 변은 2+3=5, 큰 정사각형의 넓이는 25예요.', step: 2 },
        { at: 5.5, say: '직각삼각형 네 개의 넓이는 4×(2×3÷2)=12예요.', set: { pyOtherReady: true } }
      ]),
      ch('남은 넓이를 비교해요', 12, [
        { at: 0, say: '큰 정사각형에서 네 삼각형을 빼면 구하는 넓이가 남아요.', step: 3 },
        { at: 5.5, say: problem ? '구하는 넓이는 25−12=13이에요.' : '25−12=13=2²+3²예요. 일반적으로 S=u²+v²예요.', set: { pyShowAnswer: true, pyCalculationReady: true } }
      ])
    ]);
  }
  lessons['py1-grid'] = [grid(true), grid(false)];

  lessons['py1-chain'] = [make('길이의합', '공유하는 변부터 차례로 구하기', 'x + y = 18', '큰 삼각형의 공통 높이를 구해 작은 삼각형에 사용해요', '두 삼각형에서 같은 변과 다른 밑변을 구별해 보세요', [
    ch('공유하는 변을 짚어요', 12, [
      { at: 0, say: 'BD=6, DC=9, AC=17이에요. 공통 높이 AB를 따라가요.', set: begin(true, 'chain', { pyX: 8, pyM: 6, pyN: 9 }), to: { pyTrace: 1 }, dur: 4 },
      { at: 5.5, say: 'AB=x, AD=y예요. 큰 삼각형에서 x를 먼저 구해요.', step: 1 }
    ], { pyX: 8, pyM: 6, pyN: 9, pyTrace: 0 }),
    ch('큰 삼각형에서 높이 구하기', 12, [
      { at: 0, say: '큰 삼각형의 밑변은 BC=6+9=15예요.', step: 2, set: { pySquareCReady: true } },
      { at: 5.5, say: 'x²=17²−15²=64=8²이므로 x=8이에요.', step: 3, set: { pySupportReady: true } }
    ]),
    ch('작은 삼각형에서 빗변 구하기', 12, [
      { at: 0, say: '작은 삼각형의 밑변은 BD=6이에요. y²=8²+6²=100이에요.', step: 4, set: { pyCalculationReady: true } },
      { at: 5.5, say: '10²=100이므로 작은 삼각형의 빗변 y=10이에요.', set: { pyOtherReady: true } }
    ]),
    ch('물은 두 길이를 더해요', 12, [
      { at: 0, say: '구한 높이 x와 빗변 y를 더해야 해요. AC를 더하지 않아요.' },
      { at: 5.5, say: '따라서 x+y=8+10=18이에요.', step: 5, set: { pyShowAnswer: true } }
    ])
  ])];

  function perimeter(kind) {
    return make(kind ? '넓이' : '둘레', kind ? '나머지 직각변을 구한 뒤 넓이' : '빗변을 구한 뒤 둘레', kind ? '넓이 24' : '둘레 24', kind ? '서로 수직인 두 직각변의 곱을 반으로 나눠요' : '빗변을 구해 세 변의 길이를 모두 더해요', '같은 삼각형의 둘레와 넓이가 어떤 계산으로 나오는지 비교해 보세요', [
      ch('구할 값에 필요한 변', 12, [
        { at: 0, say: kind ? '빗변은 10, 한 직각변은 6이에요. 넓이를 구해요.' : '두 직각변은 6, 8이에요. 둘레에는 빗변도 필요해요.', set: begin(true, kind ? 'area' : 'perimeter', { pyWa: 6, pyWb: 8, pyK: kind }), to: { pyTrace: 1 }, dur: 4 },
        { at: 5.5, say: kind ? '넓이를 구하려면 빗변 대신 다른 직각변 b를 알아야 해요.' : '빗변 c는 직각의 맞은편이에요. 두 직각변의 제곱을 더해요.', step: 1 }
      ], { pyWa: 6, pyWb: 8, pyK: kind, pyTrace: 0 }),
      ch('부족한 한 변을 구해요', 12, [
        { at: 0, say: kind ? 'b²=10²−6²=100−36=64예요.' : 'c²=6²+8²=36+64=100이에요.', step: 2, set: { pyCalculationReady: true } },
        { at: 5.5, say: kind ? '8²=64이므로 다른 직각변 b=8이에요.' : '10²=100이므로 빗변 c=10이에요.', step: 3, set: { pySupportReady: true } }
      ]),
      ch(kind ? '밑변과 높이를 곱해요' : '세 변을 한 번씩 더해요', 12, [
        { at: 0, say: kind ? '직각변 6과 8이 밑변과 높이예요. 곱한 뒤 2로 나눠요.' : '그림 바깥의 세 변 6, 8, 10을 모두 한 번씩 더해요.', step: 4 },
        { at: 5.5, say: kind ? '삼각형의 넓이는 6×8÷2=24예요.' : '삼각형의 둘레는 6+8+10=24예요.', step: 5, set: { pyShowAnswer: true } }
      ])
    ]);
  }
  lessons['py1-perim'] = [perimeter(0), perimeter(1)];

  lessons['py2-euclid'].push(make('넓이짝', '직사각형과 정사각형 짝짓기', '왼쪽=AC², 오른쪽=BC²', '수선으로 나눈 두 넓이를 닮음으로 연결해요', '삼각형을 바꾸고 같은 색의 정사각형과 직사각형을 비교해 보세요', [
    ch('수선으로 나눈 두 넓이', 12, [
      { at: 0, say: 'a=BC=3, b=CA=4, c=AB=5예요. 두 직사각형을 나눠요.', step: 2, set: begin(false, 'euclid-pairs', { pyP: 0 }) },
      { at: 0.1, to: { pyG: 0.6 }, dur: 3.9 },
      { at: 5.5, say: 'CH는 빗변에 수직이에요. 왼쪽 넓이는 c×AH예요.' }
    ], { pyP: 0, pyG: 0 }),
    ch('왼쪽 넓이를 닮음으로', 12, [
      { at: 0, say: '공통각 A와 직각으로 삼각형 ABC와 ACH는 닮아요.', step: 3, set: { pySupportReady: true } },
      { at: 5.5, say: 'AB:AC=AC:AH에서 c×AH=AC²=b²를 얻어요.' }
    ]),
    ch('오른쪽도 같은 방법으로', 12, [
      { at: 0, say: '공통각 B를 쓰면 삼각형 ABC와 CBH가 닮아요.', step: 4, set: { pyOtherReady: true } },
      { at: 5.5, say: 'AB:BC=BC:BH에서 c×HB=BC²=a²를 얻어요.' }
    ]),
    ch('같은 색 넓이끼리 짝이에요', 12, [
      { at: 0, say: '두 직사각형을 합치면 빗변 위 정사각형 전체가 돼요.', to: { pyG: 0 }, dur: 4 },
      { at: 5.5, say: '왼쪽은 4²=16, 오른쪽은 3²=9예요. 합은 5²=25예요.', step: 5, set: { pyCalculationReady: true, pyShowAnswer: true } }
    ])
  ]));

  function bhasOne(problem) {
    const chapters = [
      ch('같은 삼각형 네 개', 12, [
        { at: 0, say: '삼각형의 직각변은 a=3, b=4예요. 변 a를 따라가요.', set: begin(problem, problem ? 'bhas-area' : 'bhas-rearrange', { pyBa: 3, pyBb: 4 }), to: { pyTrace: 1 }, dur: 4 },
        { at: 5.5, say: '큰 정사각형의 한 변은 3+4=7, 가운데 한 변은 빗변 c예요.', step: 1 }
      ], { pyBa: 3, pyBb: 4, pyTrace: 0 })
    ];
    if (problem) chapters.push(
      ch('전체에서 뺄 넓이', 12, [
        { at: 0, say: '큰 정사각형의 넓이는 7²=49예요.', step: 2, set: { pySupportReady: true } },
        { at: 5.5, say: '직각삼각형 네 개의 넓이는 4×3×4÷2=24예요.', step: 3, set: { pyOtherReady: true } }
      ]),
      ch('가운데 넓이만 남겨요', 12, [
        { at: 0, say: '전체 넓이에서 삼각형 네 개를 한 번씩 빼요.' },
        { at: 5.5, say: '가운데 정사각형의 넓이는 49−24=25예요.', set: { pyShowAnswer: true, pyCalculationReady: true } }
      ])
    );
    else chapters.push(
      ch('처음 배치의 남은 부분', 12, [
        { at: 0, say: '가운데의 네 변은 모두 빗변 c라서 넓이를 c²라 써요.', step: 2 },
        { at: 5.5, say: '똑같은 큰 정사각형 안에서 삼각형 네 개만 옮겨 놓아요.', step: 3 }
      ]),
      ch('두 번째 배치와 비교', 12, [
        { at: 0, say: '옮긴 배치에는 한 변이 a인 정사각형과 b인 정사각형이 남아요.', step: 4 },
        { at: 5.5, say: '하늘색 넓이는 3²=9, 초록색 넓이는 4²=16이에요.', set: { pySquareAReady: true, pySquareBReady: true } }
      ]),
      ch('남은 넓이는 같아요', 12, [
        { at: 0, say: '전체와 뺀 삼각형들이 같으므로 남는 넓이도 같아요.' },
        { at: 5.5, say: '따라서 c²=a²+b²예요. 이 그림에서는 25=9+16이에요.', set: { pyShowAnswer: true, pyCalculationReady: true } }
      ])
    );
    return make(problem ? '가운데넓이' : '배치증명', problem ? '큰 정사각형에서 넷 빼기' : '같은 네 삼각형을 옮긴 증명', problem ? '25' : 'a² + b² = c²', '같은 전체에서 같은 네 삼각형을 빼면 같은 넓이가 남아요', '직접 두 배치를 바꾸고 남는 정사각형을 비교해 보세요', chapters);
  }
  lessons['py2-bhas1'] = [bhasOne(false), bhasOne(true)];

  function bhasTwo(kind) {
    const problem = kind === 'area', proof = kind === 'proof';
    const chapters = [
      ch('겹치는 직각변을 비교해요', 12, [
        { at: 0, say: '네 삼각형은 합동이고 직각변은 a=3, b=5예요.', set: begin(problem, proof ? 'bhas-proof' : problem ? 'inner-area' : 'inner-side', { pyBa: 3, pyBb: 5 }), to: { pyTrace: 1 }, dur: 4 },
        { at: 5.5, say: '분홍 정사각형의 한 변은 긴 직각변에서 짧은 변을 뺀 길이예요.', step: 1 }
      ], { pyBa: 3, pyBb: 5, pyTrace: 0 }),
      ch('가운데 한 변과 넓이', 12, [
        { at: 0, say: kind === 'side' ? '이웃한 삼각형의 직각변은 같은 직선 위에서 겹쳐요.' : '가운데 한 변은 5−3=2예요. 넓이는 한 변의 제곱이에요.', step: 2, ...(kind !== 'side' ? { set: { pyCalculationReady: true } } : {}) },
        { at: 5.5, say: proof ? '가운데 정사각형의 넓이는 (5−3)²=2²=4예요.' : kind === 'side' ? '겹친 길이를 빼야 하므로 두 길이를 더하지 않아요.' : '바깥 전체가 아니라 분홍 정사각형의 넓이를 구해요.', ...(proof ? { set: { pyOtherReady: true } } : {}) }
      ])
    ];
    if (proof) chapters.push(
      ch('삼각형 넷과 가운데의 합', 12, [
        { at: 0, say: '네 삼각형의 넓이는 4×3×5÷2=30이에요.', step: 3, set: { pySquareAReady: true } },
        { at: 5.5, say: '바깥 정사각형은 이 모두의 합이므로 c²=30+4=34예요.', set: { pySquareCReady: true } }
      ]),
      ch('문자로 정리해요', 12, [
        { at: 0, say: '문자로 쓰면 c²=2ab+(b−a)²예요. 제곱을 전개해요.' },
        { at: 5.5, say: '2ab와 −2ab가 지워져 c²=a²+b²가 남아요.', set: { pyShowAnswer: true } }
      ])
    );
    else chapters.push(ch(kind === 'side' ? '긴 변에서 짧은 변 빼기' : '물은 넓이를 계산해요', 12, [
      { at: 0, say: kind === 'side' ? '구하는 것은 넓이가 아니라 정사각형의 한 변이에요.' : '한 변의 길이 2를 제곱하면 분홍 정사각형의 넓이가 돼요.' },
      { at: 5.5, say: kind === 'side' ? '가운데 정사각형의 한 변은 5−3=2예요.' : '따라서 가운데 정사각형의 넓이는 2²=4예요.', set: { pyShowAnswer: true, pyCalculationReady: true } }
    ]));
    return make(kind === 'side' ? '안쪽한변' : proof ? '넓이증명' : '안쪽넓이', kind === 'side' ? '긴 직각변에서 짧은 변 빼기' : proof ? '삼각형 넷을 더한 넓이 증명' : '둘러싸인 작은 정사각형 넓이', kind === 'side' ? '2' : proof ? 'a² + b² = c²' : '4', '가운데 한 변 b−a와 그 제곱인 넓이를 구별해요', '두 직각변을 바꾸어 가운데 한 변과 넓이를 각각 확인해 보세요', chapters);
  }
  lessons['py2-bhas2'] = [bhasTwo('side'), bhasTwo('area'), bhasTwo('proof')];

  function garfield(problem) {
    const chapters = [
      ch('평행한 두 변을 찾아요', 12, [
        { at: 0, say: '직각변은 a=3, b=5예요. 평행한 변 PL과 QR을 살펴요.', set: begin(problem, problem ? 'trapezoid-area' : 'trapezoid-proof', { pyBa: 3, pyBb: 5 }), to: { pyTrace: 1 }, dur: 4 },
        { at: 5.5, say: 'PL=3, QR=5예요. 높이는 두 평행한 변 사이의 거리 PQ예요.', step: 1 }
      ], { pyBa: 3, pyBb: 5, pyTrace: 0 }),
      ch('사다리꼴 전체의 넓이', 12, [
        { at: 0, say: '높이는 PQ=5+3=8이에요. 기울어진 윗변이 아니에요.', step: 2, set: { pySupportReady: true } },
        { at: 5.5, say: problem ? '사다리꼴 넓이는 (3+5)×8÷2로 계산해요.' : '전체 넓이는 (a+b)×(a+b)÷2, 즉 (a+b)²÷2예요.', set: { pyCalculationReady: true } }
      ])
    ];
    if (problem) chapters.push(ch('전체 넓이를 마무리해요', 12, [
      { at: 0, say: '세 삼각형 모두를 포함한 사다리꼴 전체를 구하는 문제예요.' },
      { at: 5.5, say: '(3+5)×8÷2=64÷2=32가 정답이에요.', set: { pyShowAnswer: true } }
    ]));
    else chapters.push(
      ch('세 삼각형으로 나눠요', 12, [
        { at: 0, say: '파란 삼각형은 각각 ab÷2예요. 가운데 두 변은 빗변 c예요.', step: 3 },
        { at: 5.5, say: '두 예각 합이 90°라 가운데도 직각, 넓이는 c²÷2예요.', set: { pySquareCReady: true } }
      ]),
      ch('같은 넓이를 두 식으로', 12, [
        { at: 0, say: '두 넓이 식에 2를 곱하면 (a+b)²=2ab+c²예요.', set: { pyOtherReady: true } },
        { at: 5.5, say: '왼쪽을 전개하고 양쪽의 2ab를 빼면 a²+b²=c²예요.', set: { pyShowAnswer: true } }
      ])
    );
    return make(problem ? '넓이문제' : '사다리증명', problem ? '옆으로 선 사다리꼴 넓이' : '세 삼각형과 사다리꼴 증명', problem ? '32' : 'a² + b² = c²', '평행한 두 변과 높이를 먼저 정해 전체 넓이를 구해요', '변을 바꾸고 사다리꼴의 높이와 세 삼각형의 넓이를 비교해 보세요', chapters);
  }
  lessons['py2-garf'] = [garfield(false), garfield(true)];

  function similar(problem) {
    const chapters = [
      ch('빗변에 수선을 내려요', 12, [
        { at: 0, say: problem ? 'AB=5, AC=4예요. C에서 빗변 AB에 수선 CH를 내려요.' : 'a=BC=3, b=CA=4, c=AB=5예요. 수선 CH를 내려요.', set: begin(problem, problem ? 'similar-length' : 'similar-proof', { pyP: 0 }), to: { pyTrace: 1 }, dur: 4 },
        { at: 5.5, say: 'H는 수선의 발이에요. 직각과 같은 예각을 이용해 닮음을 찾아요.', step: 1 }
      ], { pyP: 0, pyTrace: 0 }),
      ch('공통각 A를 사용하는 닮음', 12, [
        { at: 0, say: '직각과 공통각 A로 삼각형 ABC와 ACH가 닮아요.', step: 2 },
        { at: 5.5, say: problem ? '대응하는 빗변부터 AB:AC=AC:AH라고 써요.' : 'AB:AC=AC:AH이므로 b²=c×AH예요.', set: { pySupportReady: true } }
      ])
    ];
    if (problem) chapters.push(
      ch('주어진 길이를 넣어요', 12, [
        { at: 0, say: 'AH=x라 놓으면 5:4=4:x이므로 5x=4²=16이에요.', step: 3, set: { pyCalculationReady: true } },
        { at: 5.5, say: 'x의 계수 5로 나누어요. 빗변의 절반으로 나누는 것이 아니에요.' }
      ]),
      ch('정확한 분수로 답해요', 12, [
        { at: 0, say: '길이가 정수가 아니어도 계산 결과를 그대로 분수로 나타내요.' },
        { at: 5.5, say: '따라서 AH=x=16/5예요. 반올림하지 않은 정확한 길이예요.', step: 5, set: { pyShowAnswer: true } }
      ])
    );
    else chapters.push(
      ch('공통각 B를 사용하는 닮음', 12, [
        { at: 0, say: '삼각형 ABC와 CBH도 닮아요. 대응 빗변은 AB와 BC예요.', step: 3 },
        { at: 5.5, say: 'AB:BC=BC:BH에서 a²=c×HB를 얻어요.', set: { pyOtherReady: true } }
      ]),
      ch('두 식을 더해요', 12, [
        { at: 0, say: 'a²+b²=c×HB+c×AH예요. 공통인 c로 묶어요.', step: 4 },
        { at: 5.5, say: 'AH+HB=AB=c이므로 a²+b²=c×c=c²예요.', step: 5, set: { pyShowAnswer: true } }
      ])
    );
    return make(problem ? '수선과길이' : '닮음증명', problem ? '닮음비로 수선 옆 길이 구하기' : '수선이 만든 두 닮음의 합', problem ? 'AH = 16/5' : 'a² + b² = c²', '대응하는 빗변을 맞추고 닮음비를 곱셈식으로 바꾸어요', '다른 삼각형에서도 AH와 HB의 합이 빗변과 같은지 확인해 보세요', chapters);
  }
  lessons['py2-sim'] = [similar(false), similar(true)];
})();
