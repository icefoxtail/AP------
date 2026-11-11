/* 직선·반직선·선분: 원본 점의 위치·이름·개수 조건에 결속한 해설. */
(function () {
  'use strict';
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g7-points-lines'] = all['g7-points-lines'] || {};
  const begin = (mode, extra = {}) => ({ plShowAnswer: false, plSupportReady: false, plOtherReady: false, plLessonMode: mode, ...extra });
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
})();
