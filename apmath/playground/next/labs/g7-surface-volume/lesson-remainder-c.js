/* 회전체 잔여 해설. 원본 t4.js의 고정 상태·공식만 사용합니다. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const bank = window.APL_LESSONS['g7-surface-volume'] = window.APL_LESSONS['g7-surface-volume'] || {};
  const reset = () => ({ svShowV: false, svBaseReady: false, svSideReady: false, svOtherReady: false, svBigReady: false, svSmallReady: false });
  const reset42 = (mode) => ({ ...reset(), svAxis2: 'leg', svMode: mode, sv42LengthReady: false, sv42BigReady: false, sv42SmallReady: false });
  const start42 = () => ({ s42J: 3, s42K: 1, s42A: 3, s42T: 0, svYaw: 28, svPitch: 20 });

  // r1=3, r2=6, h=4, 모선=5. 연장한 원뿔의 모선은 5·10, 높이는 4·8.
  bank['sv4-2'] = [
    {
      title: '사다리꼴 회전의 겉넓이', label: '겉넓이', tab: 'review',
      answer: '$90\\pi$', answerText: '$90\\pi$ cm²',
      summary: '겉넓이 = 부채꼴 고리 + 위·아래 원',
      task: '직접 해 보기에서 회전축을 바꾸고 입체와 전개도를 비교해 보세요',
      chapters: [
        { length: 11, title: '길이와 회전축', start: start42(), cues: [
          { at: 0, say: '윗변 3, 아랫변 6, 높이 4, 빗변 5예요.', set: reset42('surf'), to: { s42T: 0.5 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '높이인 변을 축으로 돌리면 원뿔대가 돼요.' }
        ] },
        { length: 12, title: '두 모선의 길이', cues: [
          { at: 0, say: '모선을 연장한 원뿔을 생각하며 펼쳐요.', to: { s42T: 1 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '반지름비 $3:6=1:2$라 모선비도 같아요.' },
          { at: 9, say: '차이가 5이므로 작은 모선 5, 큰 모선 10.', set: { sv42LengthReady: true } }
        ] },
        { length: 12, title: '큰 부채꼴과 작은 부채꼴', cues: [
          { at: 0, say: '큰 부채꼴은 $\\pi\\times6\\times10=60\\pi$.', step: 1, set: { sv42BigReady: true } },
          { at: 6, say: '작은 부채꼴은 $\\pi\\times3\\times5=15\\pi$.', step: 2, set: { sv42SmallReady: true } }
        ] },
        { length: 12, title: '옆면과 두 밑면', cues: [
          { at: 0, say: '옆넓이는 두 부채꼴의 차 $60\\pi-15\\pi=45\\pi$.', step: 3, set: { svSideReady: true } },
          { at: 6, say: '윗면은 $9\\pi$, 아랫면은 $36\\pi$예요.', step: 4, set: { svBaseReady: true } }
        ] },
        { length: 10, title: '겉넓이는?', cues: [
          { at: 0, say: '옆면과 위·아래 원의 넓이를 모두 더해요.' },
          { at: 4.5, say: '겉넓이 $=45\\pi+9\\pi+36\\pi=90\\pi$ cm²', set: { svShowV: true } }
        ] }
      ]
    },
    {
      title: '사다리꼴 회전의 부피', label: '부피', tab: 'review',
      answer: '$84\\pi$', answerText: '$84\\pi$ cm³',
      summary: '원뿔대의 부피 = 큰 원뿔 − 작은 원뿔',
      task: '위쪽 반지름을 바꾸고 큰 원뿔에서 작은 원뿔을 빼 보세요',
      chapters: [
        { length: 11, title: '길이와 회전축', start: start42(), cues: [
          { at: 0, say: '윗변 3, 아랫변 6, 높이 4, 빗변 5예요.', set: reset42('vol'), to: { s42T: 0.5 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '높이인 변을 축으로 돌려 원뿔대를 만들어요.' }
        ] },
        { length: 12, title: '원뿔의 높이', cues: [
          { at: 0, say: '큰 원뿔에서 작은 원뿔을 빼서 구해요.', step: 1 },
          { at: 5, say: '반지름비가 $1:2$라 높이비도 $1:2$예요.' },
          { at: 9, say: '차이가 4이므로 작은 높이 4, 큰 높이 8.', set: { svOtherReady: true } }
        ] },
        { length: 12, title: '두 원뿔의 부피', cues: [
          { at: 0, say: '큰 원뿔은 $\\frac13\\pi\\times6^2\\times8=96\\pi$.', set: { svBaseReady: true } },
          { at: 0.5, to: { s42T: 1 }, dur: 4, ease: 'smooth' },
          { at: 6, say: '작은 원뿔은 $\\frac13\\pi\\times3^2\\times4=12\\pi$.', step: 2, set: { svSideReady: true } }
        ] },
        { length: 10, title: '남은 부피는?', cues: [
          { at: 0, say: '원뿔대는 작은 원뿔을 빼고 남은 부분이에요.', step: 3 },
          { at: 4.5, say: '부피 $=96\\pi-12\\pi=84\\pi$ cm³', set: { svShowV: true } }
        ] }
      ]
    },
    {
      title: '회전축을 바꾸면', label: '축 바꾸기', tab: 'review',
      answer: '원기둥과 원뿔', answerText: '긴 밑변을 축으로 하면 원기둥과 원뿔',
      summary: '같은 사다리꼴도 회전축에 따라 입체가 달라져요',
      task: '직접 해 보기에서 두 회전축을 번갈아 눌러 보세요',
      chapters: [
        { length: 10, title: '높이를 축으로', start: start42(), cues: [
          { at: 0, say: '윗변 3, 아랫변 6, 높이 4인 사다리꼴이에요.', set: reset42('surf'), to: { s42T: 0.5 }, dur: 4.5, ease: 'smooth' },
          { at: 5, say: '높이인 변을 축으로 돌리면 원뿔대가 돼요.' }
        ] },
        { length: 10, title: '긴 밑변을 축으로', start: { s42T: 0 }, cues: [
          { at: 0, say: '이번에는 긴 밑변을 축으로 돌려요.', set: { svAxis2: 'base', svMode: 'vol' }, to: { s42T: 1 }, dur: 4.5, ease: 'smooth' },
          { at: 5, say: '직사각형 부분과 삼각형 부분을 나누어 봐요.' }
        ] },
        { length: 9, title: '어떤 입체가 될까?', cues: [
          { at: 0, say: '반지름은 높이였던 4, 두 부분의 높이는 3씩.' },
          { at: 4.5, say: '원기둥과 원뿔이 맞붙은 입체가 돼요.', set: { svShowV: true } }
        ] }
      ]
    }
  ];

  // 기존 겉넓이 해설은 보존하고, 같은 원본 상태의 부피 버튼만 덧붙입니다.
  const append = (id, lesson) => { const old = bank[id]; bank[id] = (Array.isArray(old) ? old : old ? [old] : []).concat(lesson); };
  append('sv4-3', {
    title: '이중원뿔의 부피', label: '부피', tab: 'review',
    answer: '$24\\pi$', answerText: '$24\\pi$ cm³',
    summary: '두 원뿔의 부피를 각각 구해 더해요',
    task: '두 원뿔의 높이가 다른 모양에서도 부피를 더해 보세요',
    chapters: [
      { length: 11, title: '돌려서 만든 두 원뿔', start: { s43T: 0, svYaw: 28, svPitch: 20 }, cues: [
        { at: 0, say: '삼각형을 밑변을 축으로 한 바퀴 돌려요.', set: { ...reset(), svDbl: 'D', svMode: 'vol' }, to: { s43T: 0.5 }, dur: 5, ease: 'smooth' },
        { at: 5.5, say: '반지름은 둘 다 3, 높이도 각각 4예요.' }
      ] },
      { length: 13, title: '원뿔 하나씩 구하기', cues: [
        { at: 0, say: '두 입체를 떼어 놓고 각각 부피를 구해요.', to: { s43T: 1 }, dur: 4, ease: 'smooth' },
        { at: 5, say: '아래 원뿔은 $\\frac13\\pi\\times3^2\\times4=12\\pi$.', step: 2, set: { svBaseReady: true } },
        { at: 9, say: '위 원뿔도 같은 크기이므로 $12\\pi$예요.', set: { svSideReady: true } }
      ] },
      { length: 10, title: '전체 부피는?', cues: [
        { at: 0, say: '겹치는 부피가 없으므로 두 부피를 더해요.', step: 3 },
        { at: 4.5, say: '부피 $=12\\pi+12\\pi=24\\pi$ cm³', set: { svShowV: true } }
      ] }
    ]
  });
  append('sv4-4', {
    title: '복합 입체의 부피', label: '부피', tab: 'review',
    answer: '$66\\pi$', answerText: '$66\\pi$ cm³',
    summary: '복합 입체의 부피 = 겹치지 않는 세 부피의 합',
    task: '원기둥의 높이를 바꾸고 전체 부피의 변화를 확인해 보세요',
    chapters: [
      { length: 11, title: '세 입체로 나누기', start: { s44H: 4, s44T: 0, svYaw: 28, svPitch: 22 }, cues: [
        { at: 0, say: '반지름 3, 원뿔·원기둥의 높이는 각각 4예요.', set: { ...reset(), svTri4: 'A', svMode: 'vol' }, to: { s44T: 0.5 }, dur: 5, ease: 'smooth' },
        { at: 5.5, say: '부피에는 높이를 쓰고, 모선 5는 쓰지 않아요.' }
      ] },
      { length: 13, title: '원뿔과 원기둥', cues: [
        { at: 0, say: '밑넓이에 높이를 곱하고, 원뿔은 $\\frac13$배.', to: { s44T: 1 }, dur: 4, ease: 'smooth' },
        { at: 5, say: '원뿔 $=\\frac13\\pi\\times3^2\\times4=12\\pi$.', step: 2, set: { svSideReady: true } },
        { at: 9, say: '원기둥 $=\\pi\\times3^2\\times4=36\\pi$.', set: { svOtherReady: true } }
      ] },
      { length: 10, title: '반구의 부피', cues: [
        { at: 0, say: '반구는 같은 반지름인 구의 절반이에요.' },
        { at: 5, say: '반구 $=\\frac12\\times\\frac43\\pi\\times3^3=18\\pi$.', set: { svBaseReady: true } }
      ] },
      { length: 10, title: '전체 부피는?', cues: [
        { at: 0, say: '세 입체가 겹치지 않으므로 부피를 모두 더해요.', step: 3 },
        { at: 4.5, say: '부피 $=12\\pi+36\\pi+18\\pi=66\\pi$ cm³', set: { svShowV: true } }
      ] }
    ]
  });
})();
