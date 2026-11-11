/* 기본 넓이 공식: 원본 조각 이동과 실제 문제의 길이에 결속한 해설. */
(function () {
  'use strict';
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g7-area'] = all['g7-area'] || {};
  const begin = mode => ({ arShowAnswer: false, arBaseReady: false, arAreaReady: false, arLessonMode: mode });
  const start = values => ({ arHeightT: 0, ...values });
  const ch = (title, length, cues, nums) => ({ title, length, ...(nums ? { start: start(nums) } : {}), cues });
  const make = (label, title, answer, summary, task, chapters) => ({ label, title, answer, answerText: answer, summary, task, tab: 'review', chapters });

  lessons['a1-rect'] = [
    make('칸세기', '직사각형을 채운 작은 정사각형', '24칸', '한 줄의 칸 수에 줄 수를 곱해요', '가로와 세로를 바꾸어 작은 칸을 세어 보세요', [
      ch('한 칸과 한 줄', 12, [
        { at: 0, say: '한 칸은 가로 1cm, 세로 1cm인 작은 정사각형이에요.', set: begin('count'), to: { a1T: .25 }, dur: 4 },
        { at: 5.5, say: '한 줄에 6칸이 있고, 이런 줄이 4줄 있어요.', step: 2, set: { arBaseReady: true } }
      ], { a1W: 6, a1H: 4, a1T: 0 }),
      ch('같은 수가 반복돼요', 12, [
        { at: 0, say: '6칸씩 4줄이므로 칸의 수는 곱셈으로 세어요.', to: { a1T: 1 }, dur: 5 },
        { at: 5.5, say: '$6×4=24$칸이에요.', step: 3, set: { arShowAnswer: true } }
      ])
    ]),
    make('넓이공식', '가로와 세로로 넓이 구하기', '24cm²', '직사각형의 넓이는 가로 × 세로', '둘레를 구하는 식과 넓이를 구하는 식을 비교해 보세요', [
      ch('길이와 넓이의 단위', 12, [
        { at: 0, say: '가로 6cm, 세로 4cm인 직사각형이에요.', set: begin('area'), to: { a1T: .25 }, dur: 4 },
        { at: 5.5, say: '작은 한 칸의 넓이는 1cm²이고, 6칸씩 4줄이에요.', step: 2, set: { arBaseReady: true } }
      ], { a1W: 6, a1H: 4, a1T: 0 }),
      ch('가로와 세로를 곱해요', 12, [
        { at: 0, say: '가로에 놓인 칸 수와 세로의 줄 수를 곱해요.', to: { a1T: 1 }, dur: 5 },
        { at: 5.5, say: '넓이는 가로×세로, $6×4=24$cm²예요.', step: 3, set: { arShowAnswer: true } }
      ])
    ])
  ];

  lessons['a2-para'] = [
    make('잘라붙이기', '평행사변형의 조각 옮기기', '직사각형', '높이를 따라 자른 조각을 반대쪽에 붙여요', '기울기를 바꾸고 같은 방법으로 조각을 옮겨 보세요', [
      ch('높이를 따라 자른 조각', 12, [
        { at: 0, say: '밑변 8cm, 높이 4cm예요. 높이를 따라 자른 조각을 옮겨요.', set: begin('build'), to: { a2T: .5 }, dur: 5 },
        { at: 5.5, say: '조각은 옆으로 옮겨도 모양과 넓이가 그대로예요.', step: 1 }
      ], { a2B: 8, a2H: 4, a2S: 3, a2T: 0 }),
      ch('반대쪽에 맞추어 붙여요', 12, [
        { at: 0, say: '빈자리에 맞추어 붙이면 위아래 길이가 같아져요.', to: { a2T: 1 }, dur: 4 },
        { at: 5.5, say: '가로 8cm, 세로 4cm인 직사각형이 돼요.', step: 2, set: { arShowAnswer: true, arBaseReady: true } }
      ])
    ]),
    make('넓이', '옆변과 높이를 구별하기', '32cm²', '비스듬한 옆변 대신 밑변에 수직인 높이를 곱해요', '기울기를 바꾸어도 밑변과 높이가 같으면 넓이는 같아요', [
      ch('곱할 두 길이', 12, [
        { at: 0, say: '밑변은 8cm이고, 수직인 높이는 점선의 4cm예요.', set: begin('area'), to: { arHeightT: 1 }, dur: 4 },
        { at: 5.5, say: '비스듬한 옆변 5cm는 높이가 아니에요.', step: 1 }
      ], { a2B: 8, a2H: 4, a2S: 3, a2T: 0 }),
      ch('같은 넓이의 도형으로', 12, [
        { at: 0, say: '잘라낸 조각을 옮겨 직사각형으로 만들어요.', to: { a2T: 1 }, dur: 5 },
        { at: 5.5, say: '직사각형의 가로는 밑변 8cm, 세로는 높이 4cm.', step: 2, set: { arBaseReady: true } }
      ]),
      ch('밑변과 높이를 곱해요', 10, [
        { at: 0, say: '조각을 옮겨도 넓이는 같으므로 그대로 곱해요.' },
        { at: 5, say: '평행사변형의 넓이는 $8×4=32$cm²예요.', step: 3, set: { arShowAnswer: true } }
      ])
    ])
  ];

  lessons['a3-tri'] = [
    make('붙인도형', '같은 삼각형 두 개 붙이기', '평행사변형', '복사본을 반 바퀴 돌려 옆에 붙여요', '꼭짓점 위치를 바꾸어도 같은 도형이 만들어지는지 보세요', [
      ch('같은 삼각형을 돌려요', 12, [
        { at: 0, say: '밑변 8cm, 높이 4cm인 삼각형의 복사본을 돌려요.', set: begin('build'), to: { a3T: .55 }, dur: 5 },
        { at: 5.5, say: '복사본은 원래 삼각형과 모양과 크기가 같아요.', step: 1 }
      ], { a3B: 8, a3H: 4, a3P: 3, a3T: .12 }),
      ch('옆으로 맞추어 붙여요', 12, [
        { at: 0, say: '반 바퀴 돌린 복사본을 옆으로 밀어 붙여요.', to: { a3T: 1 }, dur: 4 },
        { at: 5.5, say: '밑변 8cm, 높이 4cm인 평행사변형이 돼요.', step: 2, set: { arShowAnswer: true, arBaseReady: true } }
      ])
    ]),
    make('넓이', '삼각형 한 개의 넓이', '16cm²', '같은 삼각형 두 개로 만든 넓이를 2로 나누어요', '옆변 길이를 곱하거나 2로 나누는 것을 빼먹지 않았는지 확인해 보세요', [
      ch('밑변과 수직 높이', 12, [
        { at: 0, say: '밑변은 8cm, 수직 높이는 4cm인 삼각형이에요.', set: begin('area'), to: { arHeightT: 1 }, dur: 4 },
        { at: 5.5, say: '비스듬한 옆변 5cm를 높이로 쓰지 않아요.', step: 1, set: { arBaseReady: true } }
      ], { a3B: 8, a3H: 4, a3P: 3, a3T: 0 }),
      ch('두 개로 만든 넓이', 12, [
        { at: 0, say: '같은 삼각형을 돌려 붙여 평행사변형을 만들어요.', to: { a3T: 1 }, dur: 5 },
        { at: 5.5, say: '삼각형 두 개의 넓이는 $8×4=32$cm²예요.', step: 2, set: { arAreaReady: true } }
      ]),
      ch('한 개는 절반이에요', 10, [
        { at: 0, say: '똑같은 두 개의 넓이이므로 한 개는 2로 나누어요.' },
        { at: 5, say: '삼각형 한 개의 넓이는 $32÷2=16$cm²예요.', step: 3, set: { arShowAnswer: true } }
      ])
    ])
  ];

  lessons['a4-trap'] = [
    make('붙인도형', '같은 사다리꼴 두 개 붙이기', '평행사변형', '윗변과 아랫변이 이어져 새 밑변을 만들어요', '윗변과 아랫변의 길이를 바꾸어 새 밑변을 확인해 보세요', [
      ch('같은 사다리꼴을 돌려요', 12, [
        { at: 0, say: '윗변 4cm, 아랫변 8cm, 높이 4cm인 사다리꼴이에요.', set: begin('build'), to: { a4T: .55 }, dur: 5 },
        { at: 5.5, say: '똑같은 복사본을 반 바퀴 돌리면 위아래가 바뀌어요.', step: 1 }
      ], { a4A: 4, a4B: 8, a4H: 4, a4P: 1, a4T: .12 }),
      ch('두 변이 한 밑변으로', 12, [
        { at: 0, say: '옆으로 붙이면 윗변과 아랫변이 한 줄로 이어져요.', to: { a4T: 1 }, dur: 4 },
        { at: 5.5, say: '밑변 $4+8=12$cm, 높이 4cm인 평행사변형이에요.', step: 2, set: { arShowAnswer: true, arBaseReady: true } }
      ])
    ]),
    make('넓이', '사다리꼴 한 개의 넓이', '24cm²', '윗변과 아랫변을 더하고 높이를 곱한 뒤 2로 나누어요', '평행한 두 변과 수직 높이를 먼저 찾아 넓이를 구해 보세요', [
      ch('평행한 변과 수직 높이', 12, [
        { at: 0, say: '윗변 4cm, 아랫변 8cm이고 수직 높이는 4cm예요.', set: begin('area'), to: { arHeightT: 1 }, dur: 4 },
        { at: 5.5, say: '옆변 5cm와 높이 4cm를 구별해요.', step: 1 }
      ], { a4A: 4, a4B: 8, a4H: 4, a4P: 3, a4T: 0 }),
      ch('두 개를 붙인 새 밑변', 12, [
        { at: 0, say: '똑같은 사다리꼴을 돌려 붙여 평행사변형을 만들어요.', to: { a4T: 1 }, dur: 5 },
        { at: 5.5, say: '새 밑변은 $4+8=12$cm, 높이는 그대로 4cm예요.', step: 2, set: { arBaseReady: true } }
      ]),
      ch('전체에서 한 개로', 12, [
        { at: 0, say: '사다리꼴 두 개의 넓이는 $12×4=48$cm²예요.', set: { arAreaReady: true } },
        { at: 5.5, say: '한 개의 넓이는 $48÷2=24$cm²예요.', step: 3, set: { arShowAnswer: true } }
      ])
    ])
  ];

  lessons['a5-rhomb'] = [
    make('직사각형비', '마름모와 바깥 직사각형의 관계', '직사각형의 절반', '바깥 네 삼각형이 안쪽 네 삼각형과 꼭 겹쳐요', '두 대각선을 바꾸고 바깥 조각들을 다시 돌려 보세요', [
      ch('두 대각선과 바깥 조각', 12, [
        { at: 0, say: '두 대각선은 8cm와 6cm예요. 바깥 네 조각을 돌려요.', set: begin('fraction'), to: { a5T: 1 }, dur: 5 },
        { at: 5.5, say: '바깥의 네 삼각형은 안쪽의 네 삼각형과 꼭 겹쳐요.', step: 2 }
      ], { a5X: 8, a5Y: 6, a5T: .3 }),
      ch('같은 넓이의 두 부분', 12, [
        { at: 0, say: '바깥 직사각형은 넓이가 같은 안쪽과 바깥쪽으로 나뉘어요.' },
        { at: 5.5, say: '따라서 마름모는 그 직사각형의 절반이에요.', step: 3, set: { arShowAnswer: true } }
      ])
    ]),
    make('넓이', '두 대각선으로 마름모 넓이 구하기', '24cm²', '두 대각선의 곱은 바깥 직사각형의 넓이예요', '두 대각선을 곱한 뒤 2로 나누어 다른 마름모의 넓이를 구해 보세요', [
      ch('두 대각선으로 만든 직사각형', 12, [
        { at: 0, say: '대각선 8cm와 6cm가 바깥 직사각형의 가로와 세로예요.', set: begin('area'), to: { a5T: 1 }, dur: 5 },
        { at: 5.5, say: '돌려서 겹친 안팎 조각의 넓이가 같으므로 절반을 구해요.', step: 2 }
      ], { a5X: 8, a5Y: 6, a5T: .3 }),
      ch('직사각형의 넓이에서', 12, [
        { at: 0, say: '바깥 직사각형의 넓이는 $8×6=48$cm²예요.', set: { arAreaReady: true } },
        { at: 5.5, say: '마름모의 넓이는 $48÷2=24$cm²예요.', step: 3, set: { arShowAnswer: true } }
      ])
    ])
  ];

  lessons['a6-obt'] = [
    make('넓이유지', '꼭짓점을 옮길 때의 넓이', '넓이가 같아요', '밑변과 수직 높이가 그대로이면 삼각형의 넓이는 같아요', '꼭짓점을 평행선 위에서 움직이며 높이를 확인해 보세요', [
      ch('꼭짓점을 가로로 옮겨요', 12, [
        { at: 0, say: '밑변 BC는 6cm, 높이 AH는 4cm예요. A를 옮겨요.', set: begin('preserve'), to: { a6P: -3 }, dur: 4, ease: 'linear' },
        { at: 5.5, say: '높이는 밑변의 연장선에 내린 수선 AH의 길이예요.', step: 1 }
      ], { a6B: 6, a6H: 4, a6P: 3 }),
      ch('두 평행선 사이의 거리', 12, [
        { at: 0, say: 'A가 오른쪽 밖으로 가도 밑변과 높이는 그대로예요.', to: { a6P: 9 }, dur: 4, ease: 'linear' },
        { at: 5.5, say: '같은 밑변과 높이를 쓰므로 넓이가 같아요.', step: 3, set: { arShowAnswer: true } }
      ])
    ]),
    make('넓이', '밖에 그어진 높이로 넓이 구하기', '12cm²', '밑변을 늘인 직선에 수직인 높이를 써요', '높이가 반대쪽 밖에 있는 삼각형으로 바꾸어 넓이를 구해 보세요', [
      ch('옆변과 수선의 길이', 12, [
        { at: 0, say: '밑변 BC는 6cm이고, 수직 높이 AH는 4cm예요.', set: begin('area'), to: { arHeightT: 1 }, dur: 4 },
        { at: 5.5, say: '비스듬한 옆변 AB의 5cm는 높이가 아니에요.', step: 2, set: { arBaseReady: true } }
      ], { a6B: 6, a6H: 4, a6P: -3 }),
      ch('높이가 밖이어도 같은 공식', 12, [
        { at: 0, say: '밑변×높이는 $6×4=24$. 삼각형은 그 절반이에요.', set: { arAreaReady: true } },
        { at: 5.5, say: '넓이는 $24÷2=12$cm²예요.', step: 3, set: { arShowAnswer: true } }
      ])
    ])
  ];
})();
