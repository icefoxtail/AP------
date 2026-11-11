/* 원본 사다리꼴·모눈·길의 조각을 사용해 넓이를 비교하는 원클릭 해설. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const bank = window.APL_LESSONS['g7-area'] = window.APL_LESSONS['g7-area'] || {};
  const reset = (goal, extra) => ({ arShowAnswer: false, arLessonGoal: goal, arBaseReady: false, arOuterReady: false, arOneReady: false, arTwoReady: false, arThreeReady: false, arSumReady: false, arWidthReady: false, arHeightReady: false, ...extra });

  const trapStart = (question, t) => ({ c1A: 4, c1B: 10, c1H: 6, c1Q: question, c1T: t });
  bank['c1-trap'] = [
    { title: '돌려 붙인 도형의 밑변', label: '붙인 밑변', tab: 'review', answer: '14', answerText: '붙인 평행사변형의 밑변 14 cm',
      summary: '붙인 밑변은 원래 윗변과 아랫변의 합입니다', task: '윗변과 아랫변을 바꾸어 붙인 밑변의 길이를 다시 구해 보세요',
      chapters: [
        { length: 11, title: '같은 사다리꼴 돌리기', start: trapStart(0, 0.1), cues: [
          { at: 0, say: '윗변 4, 아랫변 10, 높이 6cm인 사다리꼴을 돌려 붙여요.', set: reset('base', { c1Mode: 1 }), to: { c1T: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '초록 복사본은 원래 사다리꼴과 모양과 크기가 같아요.' }
        ] },
        { length: 11, title: '밑변을 이루는 두 길이', cues: [
          { at: 0, say: '원래 아랫변 10cm 옆에 뒤집힌 윗변 4cm가 이어져요.', step: 2 },
          { at: 6, say: '높이 6cm는 밑변의 길이에 더하지 않아요.' }
        ] },
        { length: 10, title: '붙인 밑변의 길이', cues: [
          { at: 0, say: '평행사변형의 밑변은 이어진 두 변의 길이를 더해요.' },
          { at: 5, say: '붙인 밑변은 $10+4=14$ cm예요.', step: 2, set: { arBaseReady: true, arShowAnswer: true } }
        ] }
      ] },
    { title: '사다리꼴 넓이의 두 방법', label: '사다리꼴', tab: 'review', answer: '42', answerText: '두 방법 모두 42 cm²',
      summary: '돌려 붙인 넓이의 절반 = 두 삼각형 넓이의 합', task: '같은 조건으로 두 방법을 다시 계산해 답이 같은지 비교해 보세요',
      chapters: [
        { length: 11, title: '첫 방법은 돌려 붙이기', start: trapStart(1, 0.1), cues: [
          { at: 0, say: '윗변 4, 아랫변 10, 높이 6cm인 사다리꼴 두 개를 붙여요.', set: reset('area', { c1Mode: 1 }), to: { c1T: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '원래 사다리꼴 한 개는 붙인 도형의 절반이에요.' }
        ] },
        { length: 12, title: '붙인 평행사변형의 넓이', cues: [
          { at: 0, say: '붙인 밑변은 $4+10=14$ cm예요.', step: 2, set: { arBaseReady: true } },
          { at: 6, say: '평행사변형의 넓이는 $14×6=84$ cm²예요.', set: { arOuterReady: true } }
        ] },
        { length: 12, title: '둘째 방법은 대각선으로 나누기', cues: [
          { at: 0, say: '이번에는 같은 사다리꼴을 대각선으로 두 삼각형으로 나눠요.', set: { c1Mode: 0 }, to: { c1T: 0 }, dur: 5, ease: 'linear' },
          { at: 6, say: '두 삼각형의 밑변은 10과 4, 높이는 모두 6cm예요.', step: 1 }
        ] },
        { length: 12, title: '두 삼각형을 각각 계산하기', cues: [
          { at: 0, say: '삼각형을 떼어 각각 밑변과 높이를 곱한 뒤 2로 나누어요.', to: { c1T: 1 }, dur: 3.5, ease: 'linear' },
          { at: 4, say: '①의 넓이는 $10×6÷2=30$ cm²예요.', step: 2, set: { arOneReady: true } },
          { at: 8, say: '②의 넓이는 $4×6÷2=12$ cm²예요.', set: { arTwoReady: true } }
        ] },
        { length: 10, title: '두 방법의 넓이 비교', cues: [
          { at: 0, say: '어느 방법이든 같은 사다리꼴 한 개의 넓이를 구해요.' },
          { at: 5, say: '$30+12=42$ cm²이고, 첫 방법의 $84÷2$와도 같아요.', step: 3, set: { arShowAnswer: true } }
        ] }
      ] },
    { title: '나눈 삼각형 ACD의 넓이', label: '삼각형ACD', tab: 'review', answer: '12', answerText: '△ACD의 넓이 12 cm²',
      summary: '윗변 AD를 밑변으로 고르면 높이는 그대로입니다', task: '아랫변 쪽 삼각형과 구할 삼각형을 구별해 계산해 보세요',
      chapters: [
        { length: 11, title: '구할 삼각형 짚기', start: trapStart(2, 0), cues: [
          { at: 0, say: '윗변 AD는 4, 아랫변 BC는 10, 높이는 6cm예요.', set: reset('triangle', { c1Mode: 0 }), to: { c1T: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '구할 것은 윗변 AD가 밑변인 노란 삼각형 ACD예요.' }
        ] },
        { length: 11, title: '밑변에 맞는 높이', cues: [
          { at: 0, say: 'AD와 BC는 평행해요. 점 C에서 AD까지의 높이도 6cm예요.', step: 1 },
          { at: 6, say: '밑변 AD의 길이 4와 그 높이를 사용해요.' }
        ] },
        { length: 10, title: '삼각형의 넓이 구하기', cues: [
          { at: 0, say: '밑변에 높이를 곱하고 삼각형이므로 2로 나누어요.' },
          { at: 5, say: '삼각형 ACD의 넓이는 $4×6÷2=12$ cm²예요.', step: 2, set: { arTwoReady: true, arShowAnswer: true } }
        ] }
      ] }
  ];

  bank['c2-frame'] = {
    title: '바깥 직사각형에서 넓이 빼기', label: '바깥 빼기', tab: 'review', answer: '19', answerText: '19 cm²',
    summary: '삼각형 = 바깥 직사각형 − 세 귀퉁이', task: '꼭짓점 A와 B를 옮기고 귀퉁이 세 개를 다시 계산해 보세요',
    chapters: [
      { length: 11, title: '모눈과 주어진 길이', start: { c2W: 8, c2H: 6, c2A: 2, c2X: 3, c2T: 0 }, cues: [
        { at: 0, say: '모눈 한 변은 1cm, 바깥은 가로 8칸, 세로 6칸이에요.', set: reset('frame'), to: { c2T: 1 }, dur: 5, ease: 'linear' },
        { at: 6, say: 'A는 위에서 2칸, B는 왼쪽에서 3칸 떨어져 있어요.' }
      ] },
      { length: 11, title: '바깥 전체에서 시작하기', cues: [
        { at: 0, say: '바깥 직사각형의 넓이는 $8×6=48$ cm²예요.', step: 1, set: { arOuterReady: true } },
        { at: 6, say: '여기에서 분홍색 직각삼각형 세 개의 넓이를 빼요.' }
      ] },
      { length: 12, title: '첫째와 둘째 귀퉁이', cues: [
        { at: 0, say: '①의 밑변은 8, 높이는 2이므로 $8×2÷2=8$이에요.', step: 2, set: { arOneReady: true } },
        { at: 6, say: '②의 높이는 $6-2=4$이므로 넓이는 $3×4÷2=6$이에요.', set: { arTwoReady: true } }
      ] },
      { length: 11, title: '셋째 귀퉁이와 바깥 합', cues: [
        { at: 0, say: '③의 밑변은 $8-3=5$, 넓이는 $5×6÷2=15$예요.', set: { arThreeReady: true } },
        { at: 6, say: '세 귀퉁이의 넓이를 더하면 $8+6+15=29$ cm²예요.', set: { arSumReady: true } }
      ] },
      { length: 10, title: '남은 삼각형의 넓이', cues: [
        { at: 0, say: '파란 삼각형은 바깥 전체에서 세 귀퉁이를 뺀 부분이에요.' },
        { at: 5, say: '삼각형 ABC의 넓이는 $48-29=19$ cm²예요.', step: 3, set: { arShowAnswer: true } }
      ] }
    ]
  };

  const roadStart = () => ({ c3W: 14, c3H: 8, c3X: 2, c3T: 0 });
  bank['c3-road'] = [
    { title: '길을 빼고 잔디밭 모으기', label: '잔디밭', tab: 'review', answer: '72', answerText: '잔디밭 72 m²',
      summary: '잔디밭 = (땅의 가로 − 폭) × (땅의 세로 − 폭)', task: '땅과 길의 폭을 바꾸고 잔디 조각을 다시 모아 보세요',
      chapters: [
        { length: 11, title: '가로 방향부터 붙이기', start: roadStart(), cues: [
          { at: 0, say: '땅은 가로 14m, 세로 8m이고 두 길의 폭은 2m예요.', set: reset('grass', { c3Mode: 0 }), to: { c3T: 0.4 }, dur: 4, ease: 'linear' },
          { at: 6, say: '세로 길을 빼고 붙이면 남은 가로는 $14-2=12$ m예요.', step: 1, set: { arWidthReady: true } }
        ] },
        { length: 12, title: '돌려서 한 번 더 붙이기', cues: [
          { at: 0, say: '도형을 제자리에서 90° 돌려 다른 길도 같은 방법으로 빼요.', to: { c3T: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '남은 세로는 $8-2=6$ m예요.', step: 2, set: { arHeightReady: true } }
        ] },
        { length: 10, title: '모은 직사각형의 넓이', cues: [
          { at: 0, say: '옮기고 돌려도 네 잔디 조각의 넓이는 변하지 않아요.' },
          { at: 5, say: '잔디밭은 $12×6=72$ m²예요.', step: 3, set: { arShowAnswer: true } }
        ] }
      ] },
    { title: '비스듬한 길의 잔디 넓이', label: '비스듬잔디', tab: 'review', answer: '72', answerText: '비스듬한 길을 뺀 잔디밭 72 m²',
      summary: '비스듬한 길은 가로로 잰 폭을 뺍니다', task: '길에 수직인 폭과 가로로 잰 폭을 구별해 설명해 보세요',
      chapters: [
        { length: 12, title: '비스듬한 길의 폭 읽기', start: roadStart(), cues: [
          { at: 0, say: '땅은 14m×8m, 비스듬한 길을 가로로 잰 폭은 2m예요.', set: reset('grass', { c3Mode: 1 }), to: { c3T: 0.4 }, dur: 4, ease: 'linear' },
          { at: 4.5, say: '가로 길을 세로로 잰 폭도 2m예요.' },
          { at: 8, say: '가로로 밀어 붙이면 남은 가로는 $14-2=12$ m예요.', step: 1, set: { arWidthReady: true } }
        ] },
        { length: 12, title: '다른 길도 밀어 붙이기', cues: [
          { at: 0, say: '제자리에서 90° 돌려 가로 길도 같은 방법으로 붙여요.', to: { c3T: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '남은 세로는 $8-2=6$ m예요.', step: 2, set: { arHeightReady: true } }
        ] },
        { length: 10, title: '같은 폭이면 같은 넓이', cues: [
          { at: 0, say: '가로와 세로로 잰 폭을 각각 한 번씩만 뺐어요.' },
          { at: 5, say: '잔디밭의 넓이는 $12×6=72$ m²예요.', step: 3, set: { arShowAnswer: true } }
        ] }
      ] },
    { title: '땅에서 길의 넓이 구하기', label: '길 넓이', tab: 'review', answer: '40', answerText: '길의 넓이 40 m²',
      summary: '길의 넓이 = 땅 전체 넓이 − 잔디밭 넓이', task: '길이 만나는 부분을 두 번 빼지 않았는지 확인해 보세요',
      chapters: [
        { length: 11, title: '남은 잔디부터 모으기', start: roadStart(), cues: [
          { at: 0, say: '땅은 14m×8m, 두 길의 폭은 2m이고 구할 것은 길의 넓이예요.', set: reset('road', { c3Mode: 0 }), to: { c3T: 0.4 }, dur: 4, ease: 'linear' },
          { at: 6, say: '길을 빼고 붙인 잔디의 가로는 $14-2=12$ m예요.', step: 1, set: { arWidthReady: true } }
        ] },
        { length: 12, title: '잔디의 다른 길이 구하기', cues: [
          { at: 0, say: '제자리에서 돌린 뒤 다른 길도 밀어 붙여요.', to: { c3T: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '남은 세로는 $8-2=6$ m예요.', step: 2, set: { arHeightReady: true } }
        ] },
        { length: 11, title: '전체와 잔디를 각각 계산', cues: [
          { at: 0, say: '잔디밭은 $12×6=72$ m²예요.', set: { arTwoReady: true } },
          { at: 5.5, say: '땅 전체의 넓이는 $14×8=112$ m²예요.', set: { arOuterReady: true } }
        ] },
        { length: 10, title: '길만 남기기', cues: [
          { at: 0, say: '땅 전체에서 잔디 넓이를 빼면 길만 남아요.' },
          { at: 5, say: '길의 넓이는 $112-72=40$ m²예요.', step: 3, set: { arShowAnswer: true } }
        ] }
      ] }
  ];
})();
