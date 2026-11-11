/* 원본 t1.js sv1-3/5, t8.js sv2-6, t9.js sv2-7의 질문·계산·상태에서 만든 해설.
   굴린 거리와 겉넓이, 삼각뿔·삼각뿔대의 겉넓이와 부피는 독립 버튼입니다.
   값은 고정된 원문 조건이며, 면별 계산과 최종 답을 따로 공개합니다. */
(function () {
  'use strict';
  const all = (window.APL_LESSONS = window.APL_LESSONS || {});
  const lessons = all['g7-surface-volume'] = all['g7-surface-volume'] || {};
  const reset = { svShowV: false, svBaseReady: false, svSideReady: false, svOtherReady: false, svBigReady: false, svSmallReady: false };
  const ch = (title, length, cues, start) => ({ title, length, ...(start ? { start } : {}), cues });
  const rollStart = { sR3: 3, sH3: 5, sT3: 0, svYaw: 42, svPitch: 20 };
  lessons['sv1-3'] = [{
    title: '한 바퀴 굴린 거리', label: '굴린 거리', tab: 'review',
    answer: '$6\\pi$', answerText: '$6\\pi$ cm',
    summary: '한 바퀴 굴린 거리 = 밑면의 둘레',
    task: '반지름을 바꾸고 한 바퀴 굴려 거리가 어떻게 달라지는지 보세요',
    chapters: [
      ch('옆면이 펼쳐지는 자리', 11, [
        { at: 0, say: '반지름 3, 높이 5인 원기둥을 굴려요.', set: { ...reset, svRollMode: 'distance' }, to: { sT3: 1 }, dur: 6 },
        { at: 6.5, say: '옆면은 직사각형, 세로는 높이 5예요.' }
      ], rollStart),
      ch('가로는 밑면의 둘레', 10, [
        { at: 0, say: '한 바퀴 굴린 거리는 밑면의 둘레예요.', step: 2 },
        { at: 4.5, say: '가로는 $2\\pi\\times3=6\\pi$ cm예요.', set: { svOtherReady: true, svShowV: true } }
      ])
    ]
  }, {
    title: '굴려서 구하는 겉넓이', label: '겉넓이', tab: 'review',
    answer: '$48\\pi$', answerText: '$48\\pi$ cm²',
    summary: '겉넓이 = 원 두 개 + 펼친 옆면',
    task: '반지름과 높이를 바꾸어 밑면과 옆면의 넓이를 비교해 보세요',
    chapters: [
      ch('옆면을 펼쳐요', 11, [
        { at: 0, say: '반지름 3, 높이 5인 원기둥을 굴려요.', set: { ...reset, svRollMode: 'surf' }, to: { sT3: 1 }, dur: 6 },
        { at: 6.5, say: '한 바퀴 굴린 길이는 $2\\pi\\times3=6\\pi$.', set: { svOtherReady: true } }
      ], rollStart),
      ch('원 두 개와 직사각형', 12, [
        { at: 0, say: '밑면 하나의 넓이는 $\\pi\\times3^2=9\\pi$.', step: 1, set: { svBaseReady: true } },
        { at: 4, say: '위아래 원 두 개의 넓이는 $18\\pi$예요.' },
        { at: 8, say: '옆넓이는 $6\\pi\\times5=30\\pi$예요.', step: 2, set: { svSideReady: true } }
      ]),
      ch('겉면을 모두 더해요', 10, [
        { at: 0, say: '밑면 두 개의 넓이와 옆넓이를 더해요.', step: 3 },
        { at: 4.5, say: '겉넓이는 $18\\pi+30\\pi=48\\pi$ cm².', set: { svShowV: true } }
      ])
    ]
  }];
  lessons['sv2-6'] = [{
    title: '삼각뿔의 겉넓이', label: '겉넓이', tab: 'review',
    answer: '$138$', answerText: '$138$ cm²',
    summary: '밑면 한 개와 옆면 세 개를 더해요',
    task: '직접 전개도를 펼쳐 네 삼각형이 원래 어느 면인지 확인해 보세요',
    chapters: [
      ch('네 삼각형으로 펼쳐요', 12, [
        { at: 0, say: '밑면의 직각변은 6과 8이에요.', set: { ...reset, tpMode: 'surf', tpStarted: true }, to: { tpT: 1 }, dur: 5 },
        { at: 5.5, say: '밑넓이는 $6\\times8\\div2=24$예요.', step: 1, set: { svBaseReady: true } }
      ], { tpT: 0, svYaw: 35, svPitch: 24 }),
      ch('옆면 세 개의 넓이', 11, [
        { at: 0, say: '세 옆면의 넓이는 27, 36, 51이에요.', step: 2, set: { svSideReady: true } },
        { at: 5, say: '옆넓이는 $27+36+51=114$예요.', set: { svOtherReady: true } }
      ]),
      ch('밑면도 한 번 더해요', 10, [
        { at: 0, say: '겉넓이에는 밑면 한 개도 포함해요.', step: 3 },
        { at: 4.5, say: '겉넓이는 $24+114=138$ cm²예요.', set: { svShowV: true } }
      ])
    ]
  }, {
    title: '삼각뿔의 부피', label: '부피', tab: 'review',
    answer: '$72$', answerText: '$72$ cm³',
    summary: '뿔의 부피 = 밑넓이 × 높이 ÷ 3',
    task: '같은 밑면과 높이의 기둥과 삼각뿔을 비교해 보세요',
    chapters: [
      ch('직각삼각형인 밑면', 11, [
        { at: 0, say: '밑면의 직각변은 6과 8이에요.', set: { ...reset, tpMode: 'vol', tpStarted: true }, step: 1 },
        { at: 5, say: '밑넓이는 $6\\times8\\div2=24$예요.', set: { svBaseReady: true } }
      ], { tpT: 0, svYaw: 35, svPitch: 24 }),
      ch('밑면과 높이가 같은 기둥', 11, [
        { at: 0, say: '밑면에 수직인 높이는 9예요.', step: 2 },
        { at: 5, say: '비교하는 기둥의 부피는 $24\\times9=216$.', set: { svOtherReady: true } }
      ]),
      ch('뿔의 부피 공식', 11, [
        { at: 0, say: '뿔은 같은 밑면·높이인 기둥 부피의 $\\frac13$.', step: 3 },
        { at: 5, say: '삼각뿔의 부피는 $216\\div3=72$ cm³.', set: { svShowV: true } }
      ])
    ]
  }];
  lessons['sv2-7'] = [{
    title: '삼각뿔대의 겉넓이', label: '겉넓이', tab: 'review',
    answer: '$115.5$', answerText: '$115.5$ cm²',
    summary: '잘라 생긴 윗면도 겉넓이에 포함해요',
    task: '전개도에서 윗면, 아랫면, 세 옆면을 찾아보세요',
    chapters: [
      ch('잘라서 생긴 윗면', 12, [
        { at: 0, say: '밑면에 평행하게 자른 뿔대를 펼쳐요.', set: { ...reset, tfMode: 'surf', tfStarted: true }, to: { tfT: 1 }, dur: 5 },
        { at: 5.5, say: '아랫면 24, 윗면 6을 모두 더해야 해요.', step: 1, set: { svBaseReady: true } }
      ], { tfT: 0, svYaw: 35, svPitch: 24 }),
      ch('남은 옆면의 넓이', 12, [
        { at: 0, say: '큰 뿔 옆넓이는 114, 작은 뿔은 28.5예요.', step: 2, set: { svOtherReady: true } },
        { at: 5.5, say: '남은 옆넓이는 $114-28.5=85.5$예요.', set: { svSideReady: true } }
      ]),
      ch('두 밑면과 옆면의 합', 10, [
        { at: 0, say: '윗면과 아랫면의 넓이 합은 $24+6=30$.', step: 3 },
        { at: 4.5, say: '겉넓이는 $30+85.5=115.5$ cm²예요.', set: { svShowV: true } }
      ])
    ]
  }, {
    title: '삼각뿔대의 부피', label: '부피', tab: 'review',
    answer: '$63$', answerText: '$63$ cm³',
    summary: '뿔대 = 큰 뿔 − 잘라 낸 작은 뿔',
    task: '작은 뿔을 빼내고 남는 부분이 뿔대인지 확인해 보세요',
    chapters: [
      ch('큰 삼각뿔', 12, [
        { at: 0, say: '큰 뿔의 밑넓이는 24, 높이는 9예요.', set: { ...reset, tfMode: 'vol', tfStarted: true }, step: 1 },
        { at: 5.5, say: '큰 뿔 부피는 $24\\times9\\div3=72$예요.', set: { svBaseReady: true } }
      ], { tfT: 0, svYaw: 35, svPitch: 24 }),
      ch('잘라 낸 작은 뿔', 13, [
        { at: 0, say: '잘라 낸 작은 뿔을 옆으로 빼내요.', to: { tfT: 1 }, dur: 4 },
        { at: 4.5, say: '작은 뿔의 밑넓이는 6, 높이는 4.5예요.', step: 2, set: { svSideReady: true } },
        { at: 9, say: '작은 뿔 부피는 $6\\times4.5\\div3=9$.', set: { svOtherReady: true } }
      ]),
      ch('남은 뿔대', 10, [
        { at: 0, say: '큰 뿔에서 잘라 낸 작은 뿔의 부피를 빼요.', step: 3 },
        { at: 4.5, say: '뿔대의 부피는 $72-9=63$ cm³예요.', set: { svShowV: true } }
      ])
    ]
  }];
  // Existing surface lesson remains the same object; add only the missing volume button.
  const existing = lessons['sv1-5'];
  if (existing) lessons['sv1-5'] = [...(Array.isArray(existing) ? existing : [existing]), {
    title: '직사각형과 반원 기둥의 부피', label: '부피', tab: 'review',
    answer: '$80+10\\pi$', answerText: '$80+10\\pi$ cm³',
    summary: '부피 = 합친 밑넓이 × 기둥의 높이',
    task: '반원의 반지름과 기둥의 높이를 바꿔 부피를 비교해 보세요',
    chapters: [
      ch('밑면을 두 부분으로 나눠요', 12, [
        { at: 0, say: '밑면의 직사각형은 가로 4, 세로 4예요.', set: { ...reset, svMode: 'vol', sv15Started: true }, step: 1 },
        { at: 5.5, say: '반원의 반지름은 2, 기둥의 높이는 5예요.' }
      ], { sW: 4, sRr: 2, sH5: 5, sT5: 0, svYaw: 28, svPitch: 22 }),
      ch('합친 밑넓이', 12, [
        { at: 0, say: '직사각형은 $4\\times4=16$, 반원은 $2\\pi$.', step: 2 },
        { at: 5.5, say: '두 넓이를 합친 밑넓이는 $16+2\\pi$예요.', set: { svBaseReady: true } }
      ]),
      ch('기둥의 높이를 곱해요', 11, [
        { at: 0, say: '밑넓이에 기둥의 높이 5를 곱해요.', step: 3 },
        { at: 5, say: '부피는 $(16+2\\pi)\\times5=80+10\\pi$ cm³.', set: { svShowV: true } }
      ])
    ]
  }];
})();
