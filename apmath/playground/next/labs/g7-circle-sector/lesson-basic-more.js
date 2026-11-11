/* ==========================================================================
   원과 부채꼴 · basic 잔여5장면 / 7해설
   근거: basic.js의 1101·1207·1607 question/T 보기/work/rule,
   1210 sectorSpec의 sQ 및 S=½rl, x01의 n등분·모으기·합산 공식.
   선택형은 원본의 참인 문장과 그림 관계를 먼저 살피고 마지막에만 오답 번호를 공개합니다.
   1207은 허용 상태 60°/180°에서 현 r/2r을 비교합니다(삼각함수·근호 자막 없음).
   1210은 같은 원의 비율을 두 식에서 약분하는 정확한 관계를 그립니다.
   x01은 원본 질문의 중심각 합/호 합/넓이 합을 세 버튼으로 분리합니다.
   b<id>_read/show/kind/link는 basic.js의 lesson 전용 draw/view에서 소비합니다.
   검사: tools/lessons.g7-circle-sector-basic-more.test.mjs.
   ========================================================================== */
window.APL_LESSONS = window.APL_LESSONS || {};
Object.assign(window.APL_LESSONS['g7-circle-sector'] = window.APL_LESSONS['g7-circle-sector'] || {}, {
  '1101': {
    title: '원의 선과 도형 구별하기', label: '원의 요소', tab: 'review',
    answer: '②', answerText: '② — 두 점을 이은 선분은 현입니다.',
    summary: '지름, 부채꼴, 활꼴을 그림으로 확인하고 선분과 곡선을 구별해요.',
    task: '직접 해 보기에서 두 점을 움직이며 반원일 때 두 도형이 겹치는지 확인하세요.',
    chapters: [
      {
        length: 10, title: '중심을 지나는 선분',
        start: { b1101_th: 120, b1101_pa: 20, b1101_r: 5 },
        cues: [
          { at: 0, say: '원의 두 점을 잇는 선분과 중심 O를 보세요.', step: 1, set: { b1101_read: 0, b1101_show: false } },
          { at: 5, say: '중심을 지나는 지름이 가장 긴 현이에요.', set: { b1101_read: 1 } }
        ]
      },
      {
        length: 10, title: '두 반지름으로 둘러싸기',
        cues: [
          { at: 0, say: '중심 O에서 P와 Q로 반지름 둘을 이어요.', step: 5, set: { b1101_read: 2 } },
          { at: 5, say: '두 반지름과 호로 둘러싸면 부채꼴이에요.', set: { b1101_read: 3 } }
        ]
      },
      {
        length: 10, title: '직선과 곡선 사이',
        cues: [
          { at: 0, say: '직선 PQ와 원 위의 곡선 PQ 사이를 보세요.', step: 4, set: { b1101_read: 4 } },
          { at: 5, say: '이 부분이 현과 호로 둘러싸인 활꼴이에요.', set: { b1101_read: 5 } }
        ]
      },
      {
        length: 13, title: '두 도형이 겹치는 때',
        cues: [
          { at: 0, say: 'P와 Q가 지름의 양 끝이 되도록 벌려요.', step: 3 },
          { at: .3, to: { b1101_th: 180 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '중심각이 180°이면 두 반지름이 한 직선이에요.', set: { b1101_read: 6 } },
          { at: 9, say: '이 반원은 부채꼴이면서 활꼴이기도 해요.', set: { b1101_read: 7 } }
        ]
      },
      {
        length: 10, title: '곧은 선과 굽은 선',
        cues: [
          { at: 0, say: '같은 P와 Q를 잇는 직선과 곡선을 비교해요.', step: 2, set: { b1101_read: 8 } },
          { at: .3, to: { b1101_th: 120 }, dur: 2, ease: 'smooth' },
          { at: 5, say: '파란 직선이 현이고 분홍 곡선이 호예요.', set: { b1101_read: 9 } }
        ]
      },
      {
        length: 9, title: '문장과 그림 대조',
        cues: [
          { at: 0, say: '선분을 호라고 한 문장을 찾아보세요.' },
          { at: 4.5, say: '옳지 않은 문장은 ②, 선분 PQ의 이름은 현이에요.', set: { b1101_show: true } }
        ]
      }
    ]
  },
  '1207': {
    title: '중심각에 비례하는 것 찾기', label: '호와 현', tab: 'review',
    answer: '③', answerText: '③ — 현의 길이는 중심각에 정비례하지 않습니다.',
    summary: '같은 각과 다른 각을 비교하고 두 현의 길이로 확인해요.',
    task: '중심각을 바꾸며 호의 길이의 비와 현의 길이의 비를 비교해 보세요.',
    chapters: [
      {
        length: 10, title: '같은 원의 두 중심각',
        start: { b1207_al: 50, b1207_be: 100, b1207_r: 6 },
        cues: [
          { at: 0, say: '반지름 6 cm인 한 원에서 두 중심각을 봐요.', step: 2, set: { b1207_read: 0, b1207_show: false } },
          { at: 5, say: '50°와 100°로 중심각이 2배예요.', set: { b1207_read: 1 } }
        ]
      },
      {
        length: 13, title: '호와 넓이의 비율',
        cues: [
          { at: 0, say: '호는 원 둘레에서 중심각과 같은 비율을 차지해요.', set: { b1207_read: 2 } },
          { at: 4.5, say: '호의 비도 $100:50=2:1$이 되어 있어요.', set: { b1207_read: 3 } },
          { at: 9, say: '부채꼴의 넓이도 같은 비로 2배가 되어 있어요.', step: 5, set: { b1207_read: 4 } }
        ]
      },
      {
        length: 13, title: '중심각을 같게 맞추기',
        cues: [
          { at: 0, say: '이번에는 두 중심각을 같게 맞춰봐요.', step: 4, set: { b1207_read: 5 } },
          { at: .3, to: { b1207_be: 50 }, dur: 2, ease: 'smooth', snap: 5 },
          { at: 4.5, say: '같은 두 반지름과 끼인각으로 두 삼각형은 합동이에요.', set: { b1207_read: 6 } },
          { at: 9, say: '중심각이 같으면 현의 길이와 부채꼴 넓이도 같아요.', set: { b1207_read: 7 } }
        ]
      },
      {
        length: 13, title: '지름과 짧은 현',
        cues: [
          { at: 0, say: '지름은 중심을 지나는 가장 긴 현이에요.', step: 1, set: { b1207_read: 8 } },
          { at: 4.5, say: '두 각을 벌려 다른 현의 길이도 비교해봐요.', set: { b1207_read: 9 }, to: { b1207_al: 60, b1207_be: 180 }, dur: 2, ease: 'smooth', snap: 5 },
          { at: 9, say: '중심각은 60°와 180°, 3배 차이예요.', set: { b1207_read: 10 } }
        ]
      },
      {
        length: 13, title: '비교할 두 현의 길이',
        cues: [
          { at: 0, say: '밑각도 $(180°-60°)\\div2=60°$, 정삼각형이에요.', step: 3, set: { b1207_read: 11 } },
          { at: 4.5, say: '세 변이 같으므로 그 현은 반지름과 같은 6 cm예요.', set: { b1207_read: 12 } },
          { at: 9, say: '180°의 현은 지름, $6+6=12$ cm예요.', set: { b1207_read: 13 } }
        ]
      },
      {
        length: 10, title: '각의 비와 현의 비 비교',
        cues: [
          { at: 0, say: '각은 3배인데 현의 길이는 $12\\div6=2$배예요.', set: { b1207_read: 14 } },
          { at: 5, say: '옳지 않은 문장은 ③, 현은 각에 정비례하지 않아요.', set: { b1207_show: true } }
        ]
      }
    ]
  },
  '1607': {
    title: '같은 중심각과 삼각형의 변', label: '같은 중심각', tab: 'review',
    answer: '③', answerText: '③ — 현 AC는 현 BC의 2배보다 짧습니다.',
    summary: '호와 넓이는 중심각으로, 현은 삼각형의 두 변의 합으로 비교해요.',
    task: '중심각을 바꾸어도 AB와 BC가 같고 AC가 두 변의 합보다 짧은지 보세요.',
    chapters: [
      {
        length: 10, title: '같은 중심각 두 개',
        start: { b1607_ph: 40, b1607_r: 6 },
        cues: [
          { at: 0, say: '중심각 AOB와 BOC가 모두 40°인 한 원이에요.', step: 1, set: { b1607_read: 0, b1607_show: false } },
          { at: 5, say: '같은 두 반지름과 끼인각을 가진 삼각형을 비교해요.', set: { b1607_read: 1 } }
        ]
      },
      {
        length: 10, title: '같은 각이 마주 보는 부분',
        cues: [
          { at: 0, say: '두 삼각형이 합동이므로 현 AB와 BC가 같아요.', set: { b1607_read: 2 } },
          { at: 5, say: '같은 중심각이 마주 보는 호 AB와 BC도 같아요.', step: 4, set: { b1607_read: 3 } }
        ]
      },
      {
        length: 13, title: '중심각 두 개를 합치기',
        cues: [
          { at: 0, say: '큰 중심각 AOC는 $40°+40°=80°$예요.', step: 2, set: { b1607_read: 4 } },
          { at: 4.5, say: '각이 2배이므로 호 AC도 호 BC의 2배예요.', set: { b1607_read: 5 } },
          { at: 9, say: '부채꼴 AOC의 넓이도 BOC의 2배예요.', step: 5, set: { b1607_read: 6 } }
        ]
      },
      {
        length: 10, title: '세 현으로 삼각형 만들기',
        cues: [
          { at: 0, say: '현의 길이는 삼각형 ABC의 변으로 비교해봐요.', step: 3, set: { b1607_read: 7 } },
          { at: 5, say: 'A에서 B를 거쳐 C로 가는 두 변을 보세요.', set: { b1607_read: 8 } }
        ]
      },
      {
        length: 10, title: '두 변의 합과 나머지 변',
        cues: [
          { at: 0, say: '두 변 AB와 BC의 합은 곧은 변 AC보다 길어요.', set: { b1607_read: 9 } },
          { at: 5, say: 'AB와 BC가 같으므로 그 합은 BC의 2배예요.', set: { b1607_read: 10 } }
        ]
      },
      {
        length: 10, title: '현의 길이 결론',
        cues: [
          { at: 0, say: '따라서 현 AC는 현 BC의 2배보다 짧아요.', set: { b1607_read: 11 } },
          { at: 5, say: '옳지 않은 문장은 ③, $AC=2BC$는 성립하지 않아요.', set: { b1607_show: true } }
        ]
      }
    ]
  },
  '1210': {
    title: '넓이로 호의 길이 구하기', label: '호의 길이', tab: 'review',
    answer: '$6\\pi$', answerText: '$6\\pi$ cm',
    summary: '원에서 차지하는 비율이 같다는 점으로 넓이와 호를 연결해요.',
    task: '반지름을 유지하고 중심각을 바꾸며 넓이 ÷ 호가 같은지 확인해 보세요.',
    chapters: [
      {
        length: 10, title: '주어진 길이와 넓이',
        start: { b1210_r: 9, b1210_th: 120, b1210_link: 0 },
        cues: [
          { at: 0, say: '반지름은 9 cm, 넓이는 $27\\pi$ cm²예요.', set: { b1210_read: 0, b1210_show: false }, to: { b1210_link: 1 }, dur: 2, ease: 'smooth' },
          { at: 5, say: '구할 값 l은 곡선 부분의 호의 길이예요.', set: { b1210_read: 1 } }
        ]
      },
      {
        length: 13, title: '원에서 차지하는 같은 비율',
        cues: [
          { at: 0, say: '호와 넓이는 원 전체에서 같은 비율을 차지해요.', set: { b1210_read: 2 } },
          { at: 4.5, say: '넓이는 $\\pi r^2$에, 호는 $2\\pi r$에 그 비율을 곱해요.', set: { b1210_read: 3 } },
          { at: 9, say: '두 식을 나누면 같은 비율 k가 약분되어요.', set: { b1210_read: 4 } }
        ]
      },
      {
        length: 10, title: '넓이와 호를 연결하는 식',
        cues: [
          { at: 0, say: '남은 비는 $S\\div l=r\\div2$예요.', set: { b1210_read: 5 } },
          { at: 5, say: '따라서 넓이와 호는 $S=\\frac{1}{2}rl$로 연결돼요.', set: { b1210_read: 6 } }
        ]
      },
      {
        length: 10, title: '알고 있는 값 대입',
        cues: [
          { at: 0, say: '반지름 r에는 9, 넓이 S에는 $27\\pi$를 넣어요.', set: { b1210_read: 7 } },
          { at: 5, say: '양변에 2를 곱하고 9로 나누어 l을 구해요.', set: { b1210_read: 8 } }
        ]
      },
      {
        length: 10, title: '호의 길이 계산',
        cues: [
          { at: 0, say: '주어진 넓이와 반지름으로 호 길이만 계산해요.' },
          { at: 5, say: '호의 길이는 $l=27\\pi\\times2\\div9=6\\pi$ cm예요.', set: { b1210_show: true } }
        ]
      }
    ]
  },
  'x01': [
    {
      title: '부채꼴의 중심각 모으기', label: '중심각 합', tab: 'review',
      answer: '$360°$', answerText: '$360°$',
      summary: '같은 네 조각을 한 중심에 모아 한 바퀴를 만들어요.',
      task: '조각 수를 바꾸어도 중심각을 모두 모으면 한 바퀴인지 보세요.',
      chapters: [
        {
          length: 10, title: '같은 부채꼴 네 조각',
          start: { bx01_n: 4, bx01_r: 6, bx01_t: 0 },
          cues: [
            { at: 0, say: '반지름 6 cm인 원을 같은 부채꼴 네 개로 나눴어요.', set: { bx01_read: 0, bx01_show: false, bx01_kind: 0 }, to: { bx01_t: .12 }, dur: 2, ease: 'smooth' },
            { at: 5, say: '네 조각 중 한 조각의 중심각은 직각 90°예요.', set: { bx01_read: 1 } }
          ]
        },
        {
          length: 10, title: '한 중심에 모으기',
          cues: [
            { at: 0, say: '모양과 각의 크기는 그대로 두고 중심을 모아요.', to: { bx01_t: 1 }, dur: 6, ease: 'smooth' },
            { at: 6, say: '같은 중심각 네 개가 빈틈없이 한 바퀴를 이뤄요.' }
          ]
        },
        {
          length: 10, title: '중심각의 합',
          cues: [
            { at: 0, say: '한 조각의 중심각에 조각 수를 곱해요.' },
            { at: 5, say: '중심각의 합은 $90°\\times4=360°$예요.', set: { bx01_show: true } }
          ]
        }
      ]
    },
    {
      title: '부채꼴의 호 모으기', label: '호 합', tab: 'review',
      answer: '$12\\pi$', answerText: '$12\\pi$ cm',
      summary: '네 조각의 곡선을 이어 붙이면 원 둘레가 돼요.',
      task: '같은 원을 더 많은 조각으로 나누어도 호의 합이 같은지 확인하세요.',
      chapters: [
        {
          length: 10, title: '네 조각의 곡선 부분',
          start: { bx01_n: 4, bx01_r: 6, bx01_t: 0 },
          cues: [
            { at: 0, say: '반지름 6 cm인 원에서 나온 같은 부채꼴 네 개예요.', set: { bx01_read: 0, bx01_show: false, bx01_kind: 1 }, to: { bx01_t: .12 }, dur: 2, ease: 'smooth' },
            { at: 5, say: '각 조각의 분홍 곡선이 합할 호의 길이예요.', set: { bx01_read: 1 } }
          ]
        },
        {
          length: 10, title: '호를 한 바퀴로 잇기',
          cues: [
            { at: 0, say: '조각의 길이를 바꾸지 않고 한 중심에 모아요.', to: { bx01_t: 1 }, dur: 6, ease: 'smooth' },
            { at: 6, say: '네 호가 이어져 반지름 6 cm인 원 둘레가 돼요.' }
          ]
        },
        {
          length: 10, title: '원의 둘레로 계산',
          cues: [
            { at: 0, say: '호의 길이의 합에 원주 공식 $2\\pi r$을 써요.' },
            { at: 5, say: '네 호의 합은 $2\\pi\\times6=12\\pi$ cm예요.', set: { bx01_show: true } }
          ]
        }
      ]
    },
    {
      title: '부채꼴의 넓이 모으기', label: '넓이 합', tab: 'review',
      answer: '$36\\pi$', answerText: '$36\\pi$ cm²',
      summary: '네 조각을 빈틈없이 모으면 원의 넓이와 같아요.',
      task: '조각 수를 바꾸어도 같은 원에서 나온 넓이의 합이 같은지 보세요.',
      chapters: [
        {
          length: 10, title: '넓이를 합할 네 조각',
          start: { bx01_n: 4, bx01_r: 6, bx01_t: 0 },
          cues: [
            { at: 0, say: '반지름 6 cm인 원을 같은 부채꼴 네 개로 나눴어요.', set: { bx01_read: 0, bx01_show: false, bx01_kind: 2 }, to: { bx01_t: .12 }, dur: 2, ease: 'smooth' },
            { at: 5, say: '원을 나눈 것이므로 네 조각의 넓이를 모두 합해요.', set: { bx01_read: 1 } }
          ]
        },
        {
          length: 10, title: '겹침과 빈틈 없이 모으기',
          cues: [
            { at: 0, say: '조각의 모양을 바꾸지 않고 한 중심에 모아요.', to: { bx01_t: 1 }, dur: 6, ease: 'smooth' },
            { at: 6, say: '겹침과 빈틈 없이 반지름 6 cm인 원이 됐어요.' }
          ]
        },
        {
          length: 10, title: '원의 넓이로 계산',
          cues: [
            { at: 0, say: '네 넓이의 합에 원의 넓이 공식 $\\pi r^2$을 써요.' },
            { at: 5, say: '넓이의 합은 $\\pi\\times6^2=36\\pi$ cm²예요.', set: { bx01_show: true } }
          ]
        }
      ]
    }
  ]
});
