/* ==========================================================================
   원과 부채꼴 · F04 잔여2개 해설
   근거: f04.js circ2/turn의 question·model·steps·rule·problem.
   circ2는 원의 반지름 r=6, 중심거리=r, 직사각형의 세로=지름2r=12.
   turn은 반원 r=3, 지름AB=6이 부채꼴의 반지름이고 회전각60°가 중심각.
   이 두 장면에만 f4_*_read로 길이 의미와 도출값을 차례로 표시합니다.
   f4_*_show는 마지막 정답까지 false. 직접 해 보기 및 기존6해설은 보존합니다.
   검사: tools/lessons.g7-circle-sector-f04.test.mjs.
   ========================================================================== */
window.APL_LESSONS = window.APL_LESSONS || {};
Object.assign(window.APL_LESSONS['g7-circle-sector'] = window.APL_LESSONS['g7-circle-sector'] || {}, {
  'f4-circ2': {
    title: '반원을 옮겨 직사각형으로', label: '넓이',
    answer: '$72$', answerText: '$72$ cm²',
    summary: '같은 반원을 옮겨 가로와 세로가 보이는 도형으로 바꿔요.',
    task: '반지름을 바꾼 뒤 직사각형의 가로가 반지름, 세로가 지름인지 보세요.',
    chapters: [
      {
        length: 13, title: '반지름과 중심 사이 거리',
        start: { f4_circ2_r: 6, f4_circ2_t: 0 },
        cues: [
          { at: 0, say: '반지름 6 cm인 두 원이 서로의 중심을 지나요.', set: { f4_circ2_read: 0, f4_circ2_show: false }, to: { f4_circ2_t: .3 }, dur: 2, ease: 'smooth' },
          { at: 4.5, say: '두 중심 사이의 거리도 반지름과 같은 6 cm예요.', set: { f4_circ2_read: 1 } },
          { at: 9, say: '같은 반원을 옮겨 빈곳에 채워도 넓이는 같아요.' }
        ]
      },
      {
        length: 10, title: '빈 반원 자리에 끼우기',
        cues: [
          { at: 0, say: '오른쪽 반원을 왼쪽으로 6 cm 가로로 밀어요.', to: { f4_circ2_t: .78 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '빈 반원 자리에 꼭 맞아 직사각형이 남아요.', to: { f4_circ2_t: .96 }, dur: 2, ease: 'smooth' }
        ]
      },
      {
        length: 10, title: '가로는 반지름 세로는 지름',
        cues: [
          { at: 0, say: '세로는 지름이므로 $2\\times6=12$ cm예요.', set: { f4_circ2_read: 2 } },
          { at: 5, say: '가로는 중심 사이 거리와 같은 6 cm예요.' }
        ]
      },
      {
        length: 10, title: '처음 도형의 넓이',
        cues: [
          { at: 0, say: '처음 색칠한 넓이는 옮긴 직사각형의 넓이와 같아요.' },
          { at: 5, say: '가로 곱하기 세로, $6\\times12=72$ cm²예요.', set: { f4_circ2_show: true } }
        ]
      }
    ]
  },
  'f4-turn': {
    title: '돌린 반원과 부채꼴 넓이', label: '넓이',
    answer: '$6\\pi$', answerText: '$6\\pi$ cm²',
    summary: '두 반원을 겹치고 지름 AB를 부채꼴의 반지름으로 써요.',
    task: '반원의 반지름과 돌린 각을 바꾸어 부채꼴의 넓이를 확인해 보세요.',
    chapters: [
      {
        length: 13, title: '반지름과 지름 구별하기',
        start: { f4_turn_r: 3, f4_turn_th: 60, f4_turn_t: 0 },
        cues: [
          { at: 0, say: '반지름 3 cm인 반원을 A 중심으로 60° 돌렸어요.', set: { f4_turn_read: 0, f4_turn_show: false }, to: { f4_turn_t: .3 }, dur: 2, ease: 'smooth' },
          { at: 4.5, say: 'AB는 반원의 지름이므로 $3+3=6$ cm예요.', set: { f4_turn_read: 1 } },
          { at: 9, say: '돌리기 전후의 반원은 같은 크기라 넓이도 같아요.' }
        ]
      },
      {
        length: 10, title: '반원을 되돌려 겹치기',
        cues: [
          { at: 0, say: '돌린 반원을 A 주위로 60° 되돌려 겹쳐요.', to: { f4_turn_t: .78 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '더한 반원과 뺀 반원이 상쇄되어 부채꼴과 넓이가 같아요.', to: { f4_turn_t: .96 }, dur: 2, ease: 'smooth' }
        ]
      },
      {
        length: 10, title: '부채꼴의 반지름 확인',
        cues: [
          { at: 0, say: '부채꼴의 반지름 AB는 6 cm, 중심각은 60°예요.', set: { f4_turn_read: 2 } },
          { at: 5, say: '원의 넓이 중 $60/360=1/6$만큼이에요.', set: { f4_turn_read: 3 } }
        ]
      },
      {
        length: 10, title: '부채꼴 넓이 계산',
        cues: [
          { at: 0, say: '반원의 지름인 6 cm를 부채꼴 반지름에 넣어요.' },
          { at: 5, say: '넓이는 $\\pi\\times6^2\\times\\frac{1}{6}=6\\pi$ cm²예요.', set: { f4_turn_show: true } }
        ]
      }
    ]
  }
});
