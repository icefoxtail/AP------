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
})();
