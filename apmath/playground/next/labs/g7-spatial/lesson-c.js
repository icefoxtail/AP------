/* 평면 조건과 실제 접힌 전개도 좌표를 사용하는 공간도형 해설. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const bank = window.APL_LESSONS['g7-spatial'] = window.APL_LESSONS['g7-spatial'] || {};
  const reset = (goal, mode = 'fan', pq = null) => ({ spShowAnswer: false, spLessonGoal: goal, spLessonMode: mode, spPq: pq, spPlanePair: [0, 1], spPlaneReady: false, spFirstReady: false, spSecondReady: false, spCountReady: false, spDupReady: false, spMembersReady: false, spFaceReady: false, spMeetReady: false, spParReady: false });
  const pointStart = on => ({ spCd: on ? 0 : 1.2, spTh: on ? 0 : 75, spT: 0, spYaw: -28, spPitch: 30 });

  bank['s3-1'] = [
    { title: '한 직선 밖의 세 번째 점', label: '밖의 점', tab: 'review', answer: '평면 1개',
      summary: '직선 AB를 포함하는 평면 중 C를 지나는 것을 찾습니다', task: 'C를 직선 위로 옮기면 조건이 어떻게 달라지는지 보세요',
      chapters: [
        { length: 12, title: '세 점과 기준 직선', start: pointStart(false), cues: [
          { at: 0, say: '직선 AB를 축으로 평면을 돌려요. C는 그 직선 밖에 있어요.', set: reset('outside', 'fan', { col: false }), to: { spTh: 35, spT: 35 / 180 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'A, B뿐 아니라 C까지 같은 평면 위에 있어야 해요.' }
        ] },
        { length: 12, title: 'C까지 지나는 방향 찾기', cues: [
          { at: 0, say: '시험 평면을 C가 있는 방향으로 맞춰 봐요.', to: { spTh: 0, spT: 0 }, dur: 5, ease: 'linear' },
          { at: 6, say: '직선 밖의 C를 놓치지 않으려면 이 위치에서 더 돌릴 수 없어요.', step: 2 }
        ] },
        { length: 10, title: '세 점이 정하는 평면', cues: [
          { at: 0, say: '조건은 세 점이 한 직선 위에 있지 않다는 것이에요.' },
          { at: 5, say: '세 점을 모두 지나는 것은 평면 1개예요.', step: 3, set: { spPlaneReady: true, spShowAnswer: true } }
        ] }
      ] },
    { title: '세 점이 한 직선 위에 있을 때', label: '위의 점', tab: 'review', answer: '무수히 많아요',
      summary: '직선 둘레로 돌려도 세 점을 계속 포함하는지 봅니다', task: '평면을 여러 방향으로 돌려도 세 점이 남는지 확인해 보세요',
      chapters: [
        { length: 12, title: '한 직선 위의 세 점', start: pointStart(true), cues: [
          { at: 0, say: 'A, B, C가 한 직선 위에 있어요. 그 직선을 축으로 평면을 돌려요.', set: reset('collinear', 'fan', { col: true }), to: { spTh: 65, spT: 65 / 180 }, dur: 5, ease: 'linear' },
          { at: 6, say: '평면의 방향이 달라져도 세 점은 모두 회전축 위에 남아 있어요.' }
        ] },
        { length: 12, title: '다른 방향에서도 확인하기', cues: [
          { at: 0, say: '다른 방향으로 더 돌려도 세 점을 계속 지나요.', to: { spTh: 145, spT: 145 / 180 }, dur: 5, ease: 'linear' },
          { at: 6, say: '세 점이 한 직선 위에 있으면 지나는 평면은 무수히 많아요.', step: 3, set: { spShowAnswer: true } }
        ] }
      ] }
  ];

  bank['s3-2'] = [
    { title: '직선 밖의 점이 평면 정하기', label: '밖의 점', tab: 'review', answer: '평면 1개',
      summary: '직선 l과 그 밖의 점 A를 함께 포함하는 방향을 찾습니다', task: '점 A가 직선 밖에 있어야 하는 이유를 설명해 보세요',
      chapters: [
        { length: 12, title: '직선 l과 점 A', start: pointStart(false), cues: [
          { at: 0, say: 'l은 직선이고 A는 그 직선 밖의 점이에요. l을 축으로 평면을 돌려요.', set: reset('outside', 'fan', { on: false }), to: { spTh: 35, spT: 35 / 180 }, dur: 5, ease: 'linear' },
          { at: 6, say: '직선 l만 포함하는 것으로는 부족해요. 점 A까지 지나야 해요.' }
        ] },
        { length: 12, title: '직선 밖의 점까지 포함하기', cues: [
          { at: 0, say: '평면을 A가 있는 방향으로 맞춰 봐요.', to: { spTh: 0, spT: 0 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'l 위의 두 점과 A를 고르면 한 직선 위에 있지 않은 세 점이 돼요.', step: 2 }
        ] },
        { length: 10, title: '직선과 밖의 점의 조건', cues: [
          { at: 0, say: '직선뿐 아니라 그 밖의 점까지 지나는 평면을 생각해요.' },
          { at: 5, say: '직선 l과 밖의 점 A를 모두 포함하는 것은 평면 1개예요.', step: 3, set: { spPlaneReady: true, spShowAnswer: true } }
        ] }
      ] },
    { title: '직선 위의 점은 조건이 부족해요', label: '위의 점', tab: 'review', answer: '무수히 많아요',
      summary: '직선을 포함하면 그 위의 점은 언제나 함께 포함됩니다', task: '직선 밖의 점과 위의 점에서 결과를 비교해 보세요',
      chapters: [
        { length: 12, title: '이번에는 직선 위의 점', start: pointStart(true), cues: [
          { at: 0, say: '이번에는 점 A가 직선 l 위에 있어요. l을 축으로 평면을 돌려요.', set: reset('on-line', 'fan', { on: true }), to: { spTh: 65, spT: 65 / 180 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'l을 포함하는 평면은 이미 그 위의 A도 포함하고 있어요.' }
        ] },
        { length: 12, title: '방향을 바꾸어도 같은 조건', cues: [
          { at: 0, say: '평면을 다른 방향으로 돌려도 l과 A가 계속 들어 있어요.', to: { spTh: 145, spT: 145 / 180 }, dur: 5, ease: 'linear' },
          { at: 6, say: '직선 l과 그 위의 A를 포함하는 평면은 무수히 많아요.', step: 3, set: { spShowAnswer: true } }
        ] }
      ] }
  ];

  const lineStart = () => ({ spAl: 60, spCl: 1.2, spTh: 75, spT: 0, spYaw: -28, spPitch: 30 });
  function pairCountLesson(parallel, k) {
    const answer = k * (k - 1) / 2;
    return { title: `${parallel ? '평행한' : '한 점에서 만나는'} ${k}직선의 평면`, label: `${k}직선`, tab: 'review', answer: `평면 ${answer}개`,
      summary: '두 직선의 쌍을 세고 선택 순서의 중복을 없앱니다', task: '어느 세 직선도 한 평면 위에 없다는 조건이 필요한 이유를 설명해 보세요',
      chapters: [
        { length: 12, title: '실제 문제의 직선들', start: lineStart(), cues: [
          { at: 0, say: parallel ? `${k}개의 직선이 서로 평행해요. 두 직선씩 골라 평면을 만들어요.` : `${k}개의 직선이 O에서 만나요. 두 직선씩 골라 평면을 만들어요.`, set: reset('count', 'problem', { k }), to: { spYaw: -44 }, dur: 5, ease: 'linear' },
          { at: 6, say: '어느 세 직선도 한 평면 위에 없으므로 다른 쌍은 다른 평면을 만들어요.' }
        ] },
        { length: 15, title: '두 직선씩 선택하기', cues: [
          { at: 0, say: '먼저 l과 m을 고르면 초록색 평면이 정해져요.', step: 1, set: { spPlaneReady: true, spPlanePair: [0, 1] } },
          { at: 5, say: '이번에는 l과 n을 골라요. 앞에서 고른 쌍과는 다른 평면이에요.', set: { spPlanePair: [0, 2] } },
          { at: 10, say: `첫 직선 ${k}가지, 다음 ${k - 1}가지라 순서를 따지면 ${k * (k - 1)}가지예요.`, step: 2, set: { spPlanePair: [1, 2], spCountReady: true } }
        ] },
        { length: 10, title: '선택 순서의 중복 없애기', cues: [
          { at: 0, say: 'l, m과 m, l은 같은 쌍이에요. 두 번씩 셌으니 2로 나눠요.' },
          { at: 5, say: `따라서 평면 ${answer}개예요. ${k}×${k - 1}÷2로 구해요.`, step: 3, set: { spShowAnswer: true } }
        ] }
      ] };
  }
  bank['s3-3'] = [
    { title: '만나는 두 직선이 정하는 평면', label: '두 직선', tab: 'review', answer: '평면 1개',
      summary: '교점이 아닌 다른 점으로 직선 밖의 한 점 조건을 만듭니다', task: '두 직선이 이루는 각을 바꿔도 평면이 정해지는지 보세요',
      chapters: [
        { length: 12, title: '교점 O와 두 직선', start: lineStart(), cues: [
          { at: 0, say: 'l과 m은 O에서 만나요. l을 축으로 평면을 돌려요.', set: reset('cross', 'fan', { k: 3 }), to: { spTh: 55, spT: 55 / 180 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'm 위에서 O가 아닌 점을 잡으면 그 점은 l 밖에 있어요.' }
        ] },
        { length: 12, title: '직선 밖의 점 조건으로 바꾸기', cues: [
          { at: 0, say: 'l을 포함하는 평면이 m의 다른 점까지 지나도록 맞춰요.', to: { spTh: 35, spT: 35 / 180 }, dur: 5, ease: 'linear' },
          { at: 6, say: '이 평면은 O와 m의 다른 점을 지나므로 직선 m 전체를 포함해요.', step: 2 }
        ] },
        { length: 10, title: '두 직선이 정하는 결과', cues: [
          { at: 0, say: '한 직선과 그 밖의 한 점이 평면을 정하는 조건을 썼어요.' },
          { at: 5, say: '한 점에서 만나는 두 직선을 포함하는 것은 평면 1개예요.', step: 3, set: { spPlaneReady: true, spShowAnswer: true } }
        ] }
      ] },
    pairCountLesson(false, 3), pairCountLesson(false, 5)
  ];
  bank['s3-4'] = [
    { title: '평행한 두 직선이 정하는 평면', label: '두 직선', tab: 'review', answer: '평면 1개',
      summary: '한 직선과 다른 직선 위의 한 점으로 평면을 정합니다', task: '두 직선 사이의 간격을 바꿔도 결과가 유지되는지 보세요',
      chapters: [
        { length: 12, title: '떨어진 평행한 두 직선', start: lineStart(), cues: [
          { at: 0, say: 'l과 m은 서로 다른 평행한 직선이에요. l을 축으로 평면을 돌려요.', set: reset('parallel', 'fan', { k: 3 }), to: { spTh: 35, spT: 35 / 180 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'm 위의 한 점은 l 밖에 있어요. 그 점까지 지나는 평면을 찾아요.' }
        ] },
        { length: 12, title: '평행한 방향을 함께 포함하기', cues: [
          { at: 0, say: '평면을 m 쪽으로 맞추면 같은 방향으로 뻗는 m 전체가 들어와요.', to: { spTh: 0, spT: 0 }, dur: 5, ease: 'linear' },
          { at: 6, say: '직선 밖의 한 점과 평행한 방향이 평면의 위치를 정해 줘요.', step: 2 }
        ] },
        { length: 10, title: '평행한 두 직선의 결과', cues: [
          { at: 0, say: '두 직선이 같은 직선이 아니라 떨어져 있다는 조건도 확인해요.' },
          { at: 5, say: '서로 다른 평행한 두 직선을 포함하는 것은 평면 1개예요.', step: 3, set: { spPlaneReady: true, spShowAnswer: true } }
        ] }
      ] },
    pairCountLesson(true, 3), pairCountLesson(true, 5)
  ];

  const skewStart = same => ({ spDs: same ? 0 : 0.9, spGm: same ? 0 : 55, spTl: same ? 0 : 35, spTh: same ? 0 : 75, spT: 0, spYaw: -28, spPitch: 30 });
  bank['s3-5'] = [
    { title: '꼬인 두 직선을 포함하는 평면', label: '꼬인 위치', tab: 'review', answer: '평면 0개',
      summary: '한 점을 지나는 것과 직선 전체를 포함하는 것을 구별합니다', task: '시험 평면이 m과 만나는 점 하나가 m 전체는 아닌지 확인해 보세요',
      chapters: [
        { length: 12, title: '서로 다른 높이와 방향', start: skewStart(false), cues: [
          { at: 0, say: 'l과 m은 꼬인 위치에 있어요. l을 포함하는 시험 평면을 돌려 봐요.', set: reset('skew', 'fan', { kind: 'cuboid', ref: 'AB' }), to: { spTh: 35, spT: 35 / 180 }, dur: 5, ease: 'linear' },
          { at: 6, say: '찾는 평면은 l뿐 아니라 m 전체도 포함해야 해요.' }
        ] },
        { length: 12, title: '한 점만 만나는 경우 구별하기', cues: [
          { at: 0, say: '다른 방향으로 돌려도 m 전체가 평면 안에 놓이지 않아요.', to: { spTh: 125, spT: 125 / 180 }, dur: 5, ease: 'linear' },
          { at: 6, say: '평면이 m과 한 점에서 만나는 것만으로는 m을 포함한 것이 아니에요.', step: 2 }
        ] },
        { length: 10, title: '꼬인 위치의 뜻', cues: [
          { at: 0, say: '꼬인 두 직선은 한 평면 위에 함께 놓일 수 없어요.' },
          { at: 5, say: '두 직선을 모두 포함하는 것은 평면 0개예요.', step: 3, set: { spShowAnswer: true } }
        ] }
      ] },
    { title: '두 직선이 일치할 때의 평면', label: '일치', tab: 'review', answer: '무수히 많아요',
      summary: '이름이 둘이어도 같은 직선이면 추가 조건이 아닙니다', task: '일치와 서로 다른 두 직선이 한 점에서 만나는 경우를 구별해 보세요',
      chapters: [
        { length: 12, title: '두 이름과 한 직선', start: skewStart(true), cues: [
          { at: 0, say: '이번에는 l과 m이 일치해요. 이름은 둘이지만 같은 직선이에요.', set: reset('same', 'fan', { kind: 'cuboid', ref: 'AB' }), to: { spTh: 65, spT: 65 / 180 }, dur: 5, ease: 'linear' },
          { at: 6, say: '그 직선을 축으로 평면을 돌려도 l과 m은 모두 평면 안에 있어요.' }
        ] },
        { length: 12, title: '다른 방향에서도 포함하기', cues: [
          { at: 0, say: '다른 방향으로 돌려도 같은 직선을 계속 포함해요.', to: { spTh: 145, spT: 145 / 180 }, dur: 5, ease: 'linear' },
          { at: 6, say: '일치하는 두 직선을 포함하는 평면은 무수히 많아요.', step: 3, set: { spShowAnswer: true } }
        ] }
      ] },
    { title: 'AB와 한 평면 위의 모서리', label: '모서리 수', tab: 'review', answer: '모서리 7개',
      summary: '기준 모서리와 만나거나 평행한 모서리를 합합니다', task: '기준 AB 자체와 꼬인 위치의 모서리를 제외했는지 확인해 보세요',
      chapters: [
        { length: 12, title: '원본문제의 직육면체', start: skewStart(false), cues: [
          { at: 0, say: '직육면체에서 기준 모서리는 AB예요. AB 자신은 개수에서 제외해요.', set: reset('coplanar-edges', 'problem', { kind: 'cuboid', ref: 'AB' }), to: { spYaw: -40 }, dur: 5, ease: 'linear' },
          { at: 6, say: '서로 다른 두 직선이 한 평면 위에 있으면 만나거나 평행해요.' }
        ] },
        { length: 12, title: '만나는 것과 평행한 것', cues: [
          { at: 0, say: 'AB와 만나는 모서리는 BC, DA, AE, BF로 4개예요.', step: 1, set: { spFirstReady: true } },
          { at: 6, say: 'AB와 평행한 모서리는 CD, EF, GH로 3개예요.', step: 2, set: { spSecondReady: true } }
        ] },
        { length: 10, title: '두 종류 합하기', cues: [
          { at: 0, say: '꼬인 위치는 빼고 만나는 것 4개와 평행한 것 3개를 더해요.' },
          { at: 5, say: 'AB와 한 평면 위에 있는 것은 모서리 7개예요.', step: 3, set: { spShowAnswer: true } }
        ] }
      ] }
  ];

  const solidStart = () => ({ spYaw: -30, spPitch: 22 });
  const solidSet = kind => ({ ...reset('vertex-planes', 'solid'), spK6: kind, spSel3: ['A', 'B', 'C'] });
  bank['s3-6'] = [
    { title: '직육면체 꼭짓점의 평면 개수', label: '직육면체', tab: 'review', answer: '평면 20개',
      summary: '세 점 선택에서 같은 평면을 여러 번 센 만큼 뺍니다', task: 'ABC와 ABD가 서로 다른 세 점이지만 같은 평면인지 확인해 보세요',
      chapters: [
        { length: 12, title: '세 점과 평면 구별하기', start: solidStart(), cues: [
          { at: 0, say: '직육면체의 꼭짓점은 8개예요. 세 점을 골라 정해지는 평면을 세어요.', set: solidSet('cuboid'), to: { spYaw: -38 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'A, B, C를 골라요. 세 점 선택과 서로 다른 평면 수는 구별해요.', step: 1, set: { spPlaneReady: true } }
        ] },
        { length: 12, title: '세 점 선택과 같은 평면', cues: [
          { at: 0, say: '세 점을 고르는 방법은 8×7×6÷6=56가지예요.', set: { spFirstReady: true } },
          { at: 6, say: 'A, B, D도 같은 평면을 정해요. 이 평면에는 네 꼭짓점이 있어요.', set: { spMembersReady: true, spSel3: ['A', 'B', 'D'] } }
        ] },
        { length: 12, title: '네 점이 놓인 평면들', cues: [
          { at: 0, say: '직육면체의 겉면 여섯 개에는 꼭짓점이 네 개씩 놓여요.', step: 2 },
          { at: 4, say: 'AB와 GH를 지나는 것처럼 대각선 평면도 여섯 개 있어요.', set: { spSel3: ['A', 'B', 'G'] } },
          { at: 8, say: '네 점이 놓인 평면은 6+6=12개예요.', set: { spSecondReady: true } }
        ] },
        { length: 12, title: '초과해서 센 만큼 빼기', cues: [
          { at: 0, say: '네 점 중 세 점 선택은 네 가지예요. 같은 평면을 세 번 더 셌어요.' },
          { at: 6, say: '그런 평면이 12개라 중복은 12×3=36가지예요.', set: { spDupReady: true } }
        ] },
        { length: 10, title: '서로 다른 평면의 수', cues: [
          { at: 0, say: '전체 선택 56가지에서 중복으로 센 36가지를 빼요.' },
          { at: 5, say: '서로 다른 것은 평면 20개예요. 56−36으로 구해요.', step: 3, set: { spShowAnswer: true } }
        ] }
      ] },
    { title: '정사각뿔 꼭짓점의 평면 개수', label: '정사각뿔', tab: 'review', answer: '평면 7개',
      summary: '네 밑면 꼭짓점이 만드는 같은 평면의 중복을 뺍니다', task: '밑면의 서로 다른 세 점을 골라도 같은 평면인지 확인해 보세요',
      chapters: [
        { length: 12, title: '다섯 꼭짓점에서 세 점 고르기', start: solidStart(), cues: [
          { at: 0, say: '정사각뿔의 꼭짓점은 V와 A, B, C, D의 다섯 개예요.', set: solidSet('pyr4'), to: { spYaw: -38 }, dur: 5, ease: 'linear' },
          { at: 6, say: '세 점이 만드는 평면을 세되, 같은 평면을 여러 번 세지 않아요.', step: 1, set: { spPlaneReady: true } }
        ] },
        { length: 12, title: '같은 밑면이 반복되는 경우', cues: [
          { at: 0, say: '세 점을 고르는 방법은 5×4×3÷6=10가지예요.', set: { spFirstReady: true } },
          { at: 6, say: 'ABC와 ABD는 같은 밑면을 정해요. 밑면에는 꼭짓점 네 개가 있어요.', set: { spMembersReady: true, spSel3: ['A', 'B', 'D'] } }
        ] },
        { length: 12, title: '밑면의 중복만 제외하기', cues: [
          { at: 0, say: '네 꼭짓점이 한 평면 위에 있는 경우는 밑면 하나예요.', step: 2, set: { spSecondReady: true } },
          { at: 6, say: '밑면을 네 번 셌으니 한 번만 남기고 중복 세 번을 빼요.', set: { spDupReady: true } }
        ] },
        { length: 10, title: '서로 다른 평면 세기', cues: [
          { at: 0, say: '세 점 선택 10가지에서 중복 3가지를 빼요.' },
          { at: 5, say: '서로 다른 것은 평면 7개예요. 10−3으로 구해요.', step: 3, set: { spShowAnswer: true } }
        ] }
      ] },
    { title: '정사면체 꼭짓점의 평면 개수', label: '정사면체', tab: 'review', answer: '평면 4개',
      summary: '세 점을 고르는 것은 빠질 꼭짓점 하나를 고르는 것과 같습니다', task: '네 꼭짓점이 한 평면 위에 있지 않다는 것을 확인해 보세요',
      chapters: [
        { length: 12, title: '겹치지 않는 세 점의 선택', start: solidStart(), cues: [
          { at: 0, say: '정사면체의 네 꼭짓점 V, A, B, C 중 세 점을 골라요.', set: solidSet('tetra'), to: { spYaw: -38 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'ABC의 평면에 V는 없어요. 네 꼭짓점이 같은 평면 위에 있지 않아요.', step: 1, set: { spPlaneReady: true } }
        ] },
        { length: 12, title: '빠질 꼭짓점으로 세기', cues: [
          { at: 0, say: '세 점을 고르는 것은 빠질 꼭짓점 하나를 고르는 것과 같아요.' },
          { at: 6, say: '빠질 꼭짓점이 네 가지라 서로 다른 것은 평면 4개예요.', step: 3, set: { spShowAnswer: true } }
        ] }
      ] }
  ];
})();
