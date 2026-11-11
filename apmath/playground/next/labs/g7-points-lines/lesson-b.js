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
    ]
  });
})();
