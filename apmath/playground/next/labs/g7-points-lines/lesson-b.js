/* 각 관련 장면: 원본 질문·주어진 값과 결속한 자동 연속 해설. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = window.APL_LESSONS['g7-points-lines'] = window.APL_LESSONS['g7-points-lines'] || {};
  const chapter = (title, cues) => ({ title, length: 10, cues });
  const make = (id, title, label, answer, ask, state, chapters) => {
    chapters[0].start = { plBMove: 0, ...Object.fromEntries(Object.entries(state).map(([k, v]) => [id + '_' + k, v])) };
    Object.assign(chapters[0].cues[0], { set: { plShowAnswer: false, plBStage: 0, plBAsk: ask }, to: { plBMove: 1 }, dur: 4 });
    return { title, label, tab: 'review', answer, answerText: answer, summary: '주어진 조건에서 각이나 수선의 관계를 찾아 확인해요', task: '직접 해 보기에서 조건을 바꾸어 같은 관계를 확인해 보세요', chapters };
  };
  Object.assign(lessons, {
    ck1: [
      make('ck1', '시침이 돌아간 각', '시침의 각', '시침=109.5°', 'hour', { h: 3, m: 39, seed: 0 }, [
        chapter('시각과 기준선', [
          { at: 0, say: '3시 39분의 시침이 돈 각을 12에서부터 재어요.' },
          { at: 5, say: '시침은 분이 지나는 동안에도 조금씩 움직여요.', step: 1 }
        ]),
        chapter('정각까지 돈 각', [
          { at: 0, say: '시침은 12시간에 한 바퀴여서 1시간에 30° 돌아요.', step: 1 },
          { at: 5, say: '3시 정각까지 돈 각은 30°×3=90°예요.', set: { plBStage: 1 } }
        ]),
        chapter('분 동안 더 돈 각', [
          { at: 0, say: '시침은 1분에 30°÷60=0.5° 돌아요.', step: 1 },
          { at: 5, say: '39분 동안 더 돈 각은 0.5°×39=19.5°예요.', set: { plBStage: 2 } }
        ]),
        chapter('두 회전 합치기', [
          { at: 0, say: '정각까지의 90°에 39분 동안의 회전을 더해요.', step: 3 },
          { at: 5, say: '90°+19.5°이므로 시침=109.5°예요.', set: { plShowAnswer: true } }
        ])
      ]),
      make('ck1', '분침이 돌아간 각', '분침의 각', '분침=234°', 'minute', { h: 3, m: 39, seed: 0 }, [
        chapter('분침의 회전 읽기', [
          { at: 0, say: '3시 39분의 분침이 돈 각을 12에서부터 재어요.' },
          { at: 5, say: '분침은 60분 동안 한 바퀴 360°를 돌아요.', step: 1 }
        ]),
        chapter('일 분의 회전', [
          { at: 0, say: '한 바퀴를 60으로 나누어 1분의 회전을 구해요.', step: 2 },
          { at: 5, say: '분침은 1분에 360°÷60=6° 돌아요.', set: { plBStage: 1 } }
        ]),
        chapter('주어진 분 곱하기', [
          { at: 0, say: '39분 동안 돈 각은 6°를 39배 한 값이에요.', step: 3 },
          { at: 5, say: '6°×39이므로 분침=234°예요.', set: { plShowAnswer: true } }
        ])
      ]),
      make('ck1', '두 바늘의 작은 사잇각', '사잇각', '사잇각=124.5°', 'gap', { h: 3, m: 39, seed: 0 }, [
        chapter('같은 기준으로 재기', [
          { at: 0, say: '3시 39분에서 두 바늘 사이의 작은 각을 구해요.' },
          { at: 5, say: '두 바늘이 돈 각을 모두 12에서부터 재어 비교해요.', step: 1 }
        ]),
        chapter('시침의 위치', [
          { at: 0, say: '시침은 3시간의 회전과 39분의 회전을 더해요.', step: 1 },
          { at: 5, say: '시침은 30°×3+0.5°×39=109.5°예요.', set: { plBStage: 1 } }
        ]),
        chapter('분침의 위치', [
          { at: 0, say: '분침은 1분에 6°씩 돌아요.', step: 2 },
          { at: 5, say: '분침은 6°×39=234°예요.', set: { plBStage: 2 } }
        ]),
        chapter('두 위치의 차', [
          { at: 0, say: '큰 각 234°에서 작은 각 109.5°를 빼요.', step: 3 },
          { at: 5, say: '사잇각=124.5°이고 180°보다 작아요.', set: { plShowAnswer: true } }
        ])
      ])
    ],
    ck2: [
      make('ck2', '분침이 더 빠른 까닭', '회전 차이', '1분에 5.5° 더 회전', 'speed', { h: 3, m: 0, acc: 0, seed: 0 }, [
        chapter('일 분 동안 두 바늘', [
          { at: 0, say: '3시에서 1분이 지나는 동안 두 바늘을 살펴봐요.' },
          { at: 5, say: '분침뿐 아니라 시침도 같은 방향으로 돌아요.', step: 1 }
        ]),
        chapter('각 바늘의 회전 속도', [
          { at: 0, say: '같은 1분 동안 돈 각을 비교해요.', step: 2 },
          { at: 5, say: '분침은 6°, 시침은 0.5° 돌아요.', set: { plBStage: 1 } }
        ]),
        chapter('더 돈 각 구하기', [
          { at: 0, say: '분침의 회전에서 시침의 회전을 빼요.', step: 3 },
          { at: 5, say: '6°−0.5°이므로 1분에 5.5° 더 회전해요.', set: { plShowAnswer: true } }
        ])
      ]),
      make('ck2', '따라잡은 각으로 사잇각 구하기', '사잇각', '사잇각=20°', 'gap', { h: 3, m: 20, acc: 0, seed: 0 }, [
        chapter('처음과 나중의 시각', [
          { at: 0, say: '3시 정각에서 20분이 지난 시계예요.' },
          { at: 5, say: '처음 벌어진 각에서 분침이 따라잡은 각을 비교해요.', step: 1 }
        ]),
        chapter('처음 벌어진 각', [
          { at: 0, say: '정각의 분침은 12에 있고 시침은 3에 있어요.', step: 1 },
          { at: 5, say: '처음 시침이 앞선 각은 30°×3=90°예요.', set: { plBStage: 1 } }
        ]),
        chapter('일 분마다 따라잡기', [
          { at: 0, say: '분침은 6°, 시침은 0.5°씩 같은 방향으로 돌아요.', step: 2 },
          { at: 5, say: '1분에 따라잡는 각은 6°−0.5°=5.5°예요.', set: { plBStage: 2 } }
        ]),
        chapter('이십 분의 차이', [
          { at: 0, say: '1분의 차이에 지난 시간 20분을 곱해요.', step: 3 },
          { at: 5, say: '따라잡은 각은 5.5°×20=110°예요.', set: { plBStage: 3 } }
        ]),
        chapter('지나친 만큼의 각', [
          { at: 0, say: '110°는 처음의 90°보다 커서 분침이 앞질렀어요.', step: 4 },
          { at: 5, say: '110°−90°이므로 사잇각=20°예요.', set: { plShowAnswer: true } }
        ])
      ])
    ],
    vt: [
      make('vt', '맞꼭지각의 크기가 같은 까닭', '맞꼭지각', '∠c=55°', 'c', { th: 55, n: 2, seed: 0 }, [
        chapter('주어진 각과 마주 보는 각', [
          { at: 0, say: '두 직선이 만나고 주어진 ∠a는 55°예요.' },
          { at: 5, say: 'a와 마주 보는 c를, 이웃한 b를 이용해 구해요.', step: 1 }
        ]),
        chapter('이웃한 각 먼저 구하기', [
          { at: 0, say: 'a와 b는 한 직선 위에 있어 합이 180°예요.', step: 1 },
          { at: 5, say: '따라서 b=180°−55°=125°예요.', set: { plBStage: 1 } }
        ]),
        chapter('다른 평각 찾기', [
          { at: 0, say: 'b와 c도 한 직선 위에 있어요.', step: 2 },
          { at: 5, say: 'c+b=180°이므로 180°에서 b를 빼요.', set: { plBStage: 2 } }
        ]),
        chapter('맞꼭지각의 크기', [
          { at: 0, say: 'a와 c는 같은 평각에서 같은 b를 뺀 각이에요.', step: 3 },
          { at: 5, say: '∠c=55°로 a와 같아요. 맞꼭지각은 같아요.', set: { plShowAnswer: true } }
        ])
      ]),
      make('vt', '이웃한 각의 크기', '이웃한 각', '∠d=125°', 'd', { th: 55, n: 2, seed: 2 }, [
        chapter('구하는 각의 위치', [
          { at: 0, say: '주어진 ∠a는 55°이고 구하는 것은 ∠d예요.' },
          { at: 5, say: 'a와 d는 마주 보지 않고 한 변을 공유해요.', step: 1 }
        ]),
        chapter('평각의 두 부분', [
          { at: 0, say: '공유하지 않는 두 변은 한 직선을 이루어요.', step: 2 },
          { at: 5, say: '따라서 a+d=180°예요.', set: { plBStage: 1 } }
        ]),
        chapter('알려진 각 빼기', [
          { at: 0, say: '평각에서 주어진 55°를 빼요.', step: 3 },
          { at: 5, say: '180°−55°이므로 ∠d=125°예요.', set: { plShowAnswer: true } }
        ])
      ]),
      make('vt', '네 직선의 맞꼭지각 세기', '쌍의 개수', '맞꼭지각=12쌍', 'count', { th: 55, n: 4, seed: 1 }, [
        chapter('직선 두 개씩 고르기', [
          { at: 0, say: '서로 다른 네 직선이 한 점에서 만나요.' },
          { at: 5, say: '맞꼭지각은 두 직선을 고를 때마다 생겨요.', step: 1 }
        ]),
        chapter('직선 쌍의 개수', [
          { at: 0, say: '첫 직선은 4가지, 짝은 3가지이고 순서는 빼요.', step: 2 },
          { at: 5, say: '직선 두 개를 고르는 방법은 4×3÷2=6가지예요.', set: { plBStage: 1 } }
        ]),
        chapter('한 쌍의 직선에서', [
          { at: 0, say: '고른 두 직선에서 a와 c가 한 쌍이에요.', step: 3 },
          { at: 5, say: 'b와 d도 한 쌍이라 맞꼭지각은 2쌍씩 생겨요.', set: { plBStage: 2 } }
        ]),
        chapter('전체 쌍 세기', [
          { at: 0, say: '직선 쌍 6가지에 각각 생기는 2쌍을 곱해요.', step: 4 },
          { at: 5, say: '6×2이므로 맞꼭지각=12쌍이에요.', set: { plShowAnswer: true } }
        ])
      ])
    ],
    ve: [
      make('ve', '맞꼭지각으로 x 구하기', 'x 구하기', 'x=15', 'x', { a1: 3, b1: 10, a2: 5, b2: -20, x: 15, seed: 0 }, [
        chapter('두 식의 의미', [
          { at: 0, say: '맞꼭지각이 (3x+10)°와 (5x−20)°예요.' },
          { at: 5, say: '구하는 것은 각의 크기가 아니라 수 x예요.', step: 1 }
        ]),
        chapter('같은 각의 식', [
          { at: 0, say: '맞꼭지각의 크기가 같으므로 두 식을 같게 놓아요.', step: 1 },
          { at: 5, say: '3x+10=5x−20을 세워요.', set: { plBStage: 1 } }
        ]),
        chapter('동류항 정리', [
          { at: 0, say: '양변에서 3x를 빼고 양변에 20을 더해요.', step: 2 },
          { at: 5, say: '10+20=5x−3x이므로 2x=30이에요.', set: { plBStage: 2 } }
        ]),
        chapter('양변 나누기', [
          { at: 0, say: '2x는 x의 두 배이므로 양변을 2로 나눠요.', step: 3 },
          { at: 5, say: '30÷2이므로 x=15예요.', set: { plShowAnswer: true } }
        ])
      ]),
      make('ve', '식으로 주어진 각의 크기', '각의 크기', '맞꼭지각=55°', 'angle', { a1: 3, b1: 10, a2: 5, b2: -20, x: 15, seed: 1 }, [
        chapter('미지수와 구하는 각', [
          { at: 0, say: '맞꼭지각이 (3x+10)°와 (5x−20)°예요.' },
          { at: 5, say: '먼저 x를 구한 뒤 두 식에 대입해 각을 구해요.', step: 1 }
        ]),
        chapter('맞꼭지각의 방정식', [
          { at: 0, say: '맞꼭지각의 크기는 같아요.', step: 1 },
          { at: 5, say: '3x+10=5x−20이에요.', set: { plBStage: 1 } }
        ]),
        chapter('항 정리하기', [
          { at: 0, say: 'x의 항과 수를 각각 한쪽으로 모아요.', step: 2 },
          { at: 5, say: '5x−3x=10+20이므로 2x=30이에요.', set: { plBStage: 2 } }
        ]),
        chapter('대입할 수 구하기', [
          { at: 0, say: '양변을 2로 나눠요.', step: 2 },
          { at: 5, say: 'x=30÷2=15예요.', set: { plBStage: 3 } }
        ]),
        chapter('각의 크기 확인', [
          { at: 0, say: '3×15+10과 5×15−20을 각각 계산해요.', step: 3 },
          { at: 5, say: '두 식의 값이 같아서 맞꼭지각=55°예요.', set: { plShowAnswer: true } }
        ])
      ])
    ],
    th: [
      make('th', '세 직선과 한쪽의 각', '평각의 합', '∠a+∠b+∠c=180°', 'sum', { a: 40, bb: 60, seed: 0 }, [
        chapter('한쪽의 세 각', [
          { at: 0, say: '세 직선이 한 점에서 만나 여섯 각을 만들어요.' },
          { at: 5, say: '위쪽에서 a=40°, b=60°와 c를 살펴봐요.', step: 1 }
        ]),
        chapter('두 바깥 변 보기', [
          { at: 0, say: '위쪽의 세 각은 겹치거나 빈틈이 없어요.', step: 1 },
          { at: 5, say: '세 각의 바깥 두 변은 한 직선을 이루어요.', set: { plBStage: 1 } }
        ]),
        chapter('평각으로 합 구하기', [
          { at: 0, say: '한 직선을 이루는 각이 평각이에요.', step: 3 },
          { at: 5, say: '따라서 ∠a+∠b+∠c=180°예요.', set: { plShowAnswer: true } }
        ])
      ]),
      make('th', '세 직선의 식으로 x 구하기', 'x 구하기', 'x=5', 'x', { a: 40, bb: 60, seed: 0 }, [
        chapter('주어진 세 각', [
          { at: 0, say: '주어진 각은 (x+35)°, 60°, (4x+60)°예요.' },
          { at: 5, say: '아래쪽 각을 맞꼭지각인 위쪽 c로 옮길 거예요.', step: 1 }
        ]),
        chapter('맞꼭지각 이용', [
          { at: 0, say: '아래쪽 보라 각과 c는 서로 마주 보는 각이에요.', step: 2 },
          { at: 5, say: '맞꼭지각이 같으므로 c=(4x+60)°예요.', set: { plBStage: 1 } }
        ]),
        chapter('평각의 방정식', [
          { at: 0, say: '위쪽의 세 각을 모두 더하면 평각 180°예요.', step: 2 },
          { at: 5, say: '(x+35)+60+(4x+60)=180이에요.', set: { plBStage: 2 } }
        ]),
        chapter('동류항 모으기', [
          { at: 0, say: 'x를 모으면 5x이고 수를 더하면 155예요.', step: 3 },
          { at: 5, say: '5x+155=180에서 5x=25예요.', set: { plBStage: 3 } }
        ]),
        chapter('양변을 나누기', [
          { at: 0, say: '5x는 x의 다섯 배이므로 양변을 5로 나눠요.', step: 3 },
          { at: 5, say: '25÷5이므로 x=5예요.', set: { plShowAnswer: true } }
        ])
      ])
    ],
    pd: [
      make('pd', '수선과 수선의 발', '수선의 발', '수선의 발은 H', 'foot', { d: 4, q: 3, px: 0, seed: 2 }, [
        chapter('점에서 직선으로', [
          { at: 0, say: 'P는 직선 ℓ 밖에 있고 H와 Q는 ℓ 위에 있어요.' },
          { at: 5, say: '점 P에서 ℓ로 내린 선분 PH를 살펴봐요.', step: 1 }
        ]),
        chapter('수직인 선분 찾기', [
          { at: 0, say: '직각 표시는 PH와 ℓ이 90°로 만난다는 뜻이에요.', step: 1 },
          { at: 5, say: '이처럼 수직으로 만나는 선분 PH를 수선이라 해요.', set: { plBStage: 1 } }
        ]),
        chapter('만나는 점의 이름', [
          { at: 0, say: '수선이 주어진 직선과 만나는 점을 찾아요.', step: 2 },
          { at: 5, say: 'PH와 ℓ이 H에서 만나므로 수선의 발은 H예요.', set: { plShowAnswer: true } }
        ])
      ]),
      make('pd', '점에서 직선까지 가장 짧게', '최단 선분', '가장 짧은 선분은 PH', 'shortest', { d: 4, q: 3, px: 0, seed: 0 }, [
        chapter('수선과 비스듬한 선분', [
          { at: 0, say: 'P에서 직선 ℓ 위의 H와 Q로 선분을 이어요.' },
          { at: 5, say: 'PH는 직각으로, PQ는 비스듬하게 만나고 있어요.', step: 1 }
        ]),
        chapter('같은 눈금으로 비교', [
          { at: 0, say: '두 선분의 길이를 같은 눈금의 막대로 비교해요.', step: 2 },
          { at: 5, say: 'Q를 H에서 멀리 잡을수록 PQ는 길어져요.', set: { plBStage: 2 } }
        ]),
        chapter('거리의 기준', [
          { at: 0, say: 'Q가 H와 겹치면 PQ가 수선과 같아져요.', step: 3 },
          { at: 5, say: '가장 짧은 선분은 PH예요.', set: { plShowAnswer: true } }
        ])
      ]),
      make('pd', '점과 직선 사이의 거리', '거리 구하기', '거리=4 cm', 'distance', { d: 4, q: 3, px: 0, seed: 3 }, [
        chapter('주어진 길이 확인', [
          { at: 0, say: '직선 ℓ 밖의 점 P에서 그은 PH의 길이는 4 cm예요.' },
          { at: 5, say: '구하는 것은 P와 직선 ℓ 사이의 거리예요.', step: 1 }
        ]),
        chapter('수선의 발 찾기', [
          { at: 0, say: '직각 표시를 보면 PH는 ℓ에 수직이에요.', step: 1 },
          { at: 5, say: 'H가 수선의 발이므로 수선 PH의 길이를 읽어요.', set: { plBStage: 1 } }
        ]),
        chapter('수선의 길이 읽기', [
          { at: 0, say: '비스듬한 PQ나 직선 위 HQ의 길이를 쓰지 않아요.', step: 3 },
          { at: 5, say: 'PH의 길이가 4 cm이므로 거리=4 cm예요.', set: { plShowAnswer: true } }
        ])
      ])
    ],
    bs: [
      make('bs', '평각의 두 이등분선', '평각 이등분', '∠MON=90°', 'flat', { g: 70, T: 180, seed: 0 }, [
        chapter('주어진 각과 이등분선', [
          { at: 0, say: '∠AOB는 180°이고 ∠AOC는 70°예요.' },
          { at: 5, say: 'OM, ON은 두 각의 이등분선이고 절반을 ●, ×라 해요.', step: 1 }
        ]),
        chapter('첫 각의 절반', [
          { at: 0, say: 'OM이 ∠AOC를 같은 두 각으로 나누어요.', step: 1 },
          { at: 5, say: '따라서 ●=70°÷2=35°예요.', set: { plBStage: 1 } }
        ]),
        chapter('남은 각의 절반', [
          { at: 0, say: '남은 ∠COB는 180°−70°=110°예요.', step: 2 },
          { at: 5, say: 'ON이 이등분하므로 ×=110°÷2=55°예요.', set: { plBStage: 2 } }
        ]),
        chapter('이등분선 사이의 각', [
          { at: 0, say: '2●+2×=180°이고 ∠MON은 ●+×예요.', set: { plBStage: 3 }, step: 3 },
          { at: 5, say: '전체의 절반이므로 ∠MON=90°로 수직이에요.', set: { plShowAnswer: true }, step: 4 }
        ])
      ]),
      make('bs', '평각이 아닐 때의 두 이등분선', '다른 각', '∠MON=60°', 'other', { g: 70, T: 120, seed: 0 }, [
        chapter('전체 각과 두 이등분선', [
          { at: 0, say: '∠AOB는 120°이고 ∠AOC는 70°예요.' },
          { at: 5, say: 'OM, ON이 나누는 절반의 각을 ●, ×라 해요.', step: 1 }
        ]),
        chapter('첫 각 나누기', [
          { at: 0, say: 'OM은 ∠AOC의 이등분선이에요.', step: 1 },
          { at: 5, say: '따라서 ●=70°÷2=35°예요.', set: { plBStage: 1 } }
        ]),
        chapter('나머지 각 나누기', [
          { at: 0, say: '∠COB는 120°−70°=50°예요.', step: 2 },
          { at: 5, say: 'ON이 이등분하므로 ×=50°÷2=25°예요.', set: { plBStage: 2 } }
        ]),
        chapter('전체의 절반', [
          { at: 0, say: '2●+2×=120°이고 ∠MON은 ●+×예요.', set: { plBStage: 3 }, step: 3 },
          { at: 5, say: '120°의 절반이므로 ∠MON=60°예요.', set: { plShowAnswer: true }, step: 4 }
        ])
      ])
    ],
    tr: [
      make('tr', '변을 늘인 직선까지의 거리', '수선 찾기', '거리는 AH의 길이', 'height', { b: 5, h: 4, sa: -2, ti: 0, seed: 0 }, [
        chapter('삼각형과 늘인 직선', [
          { at: 0, say: 'A가 변 BC의 바깥쪽 위에 있는 삼각형이에요.' },
          { at: 5, say: '점에서 직선까지의 거리는 수직인 선분으로 재어요.', step: 1 }
        ]),
        chapter('연장선 위의 수선의 발', [
          { at: 0, say: '직선 BC를 늘여 A에서 수직으로 내려요.', step: 2 },
          { at: 5, say: '수선의 발 H가 변 밖의 연장선 위에 있어요.', set: { plBStage: 1 } }
        ]),
        chapter('구하는 거리 고르기', [
          { at: 0, say: '변의 끝 B나 C까지 비스듬하게 재지 않아요.', step: 3 },
          { at: 5, say: 'A에서 직선 BC까지의 거리는 AH의 길이예요.', set: { plShowAnswer: true } }
        ])
      ]),
      make('tr', '직각삼각형의 점과 직선 거리', '거리 구하기', '거리=4 cm', 'distance', { b: 3, h: 4, sa: 3, ti: 0, seed: 0 }, [
        chapter('주어진 직각삼각형', [
          { at: 0, say: '∠C=90°이고 AB=5, BC=3, CA=4 cm예요.' },
          { at: 5, say: '구하는 것은 A와 직선 BC 사이의 거리예요.', step: 1 }
        ]),
        chapter('직각인 변 찾기', [
          { at: 0, say: 'C가 직각이므로 AC가 BC에 수직이에요.', step: 1 },
          { at: 5, say: '수선의 발은 C이고, 빗변 AB는 수선이 아니에요.', set: { plBStage: 1 }, step: 2 }
        ]),
        chapter('수선의 길이 읽기', [
          { at: 0, say: '점과 직선 사이의 거리는 수선 AC의 길이예요.', step: 3 },
          { at: 5, say: 'AC=4 cm이므로 거리=4 cm예요.', set: { plShowAnswer: true } }
        ])
      ])
    ]
  });
})();
