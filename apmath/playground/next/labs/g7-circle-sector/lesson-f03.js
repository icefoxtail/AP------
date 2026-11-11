/* ==========================================================================
   원과 부채꼴 · F03 겹치기/빼기 잔여 8장면의 해설
   근거: f03.js 각 SCENES 항목의 question/model/draw/steps/rule/std.
   review는 원본의 truth 모델을 사용합니다. rect-sector의 AD와 half-sector의 x는
   넓이가 같은 조건의 그림이며, 탐구 막대 초기값을 답으로 사용하지 않습니다.
   f3Read는 설명한 보조 길이·각·계산의 공개 순서, f3Show는 마지막 정답 표시입니다.
   최초 진입은 원본 문제 그림, 마지막 재생값은 entry/다시 보기에서 재사용하지 않습니다.
   기존 f3-leaf-len 해설은 이 파일에서 수정하지 않습니다.
   검사: tools/lessons.g7-circle-sector-f03.test.mjs. 모바일 실제 검수는 별도입니다.
   ========================================================================== */
window.APL_LESSONS = window.APL_LESSONS || {};
Object.assign(window.APL_LESSONS['g7-circle-sector'] = window.APL_LESSONS['g7-circle-sector'] || {}, {
  // AB4, 직사각형=반지름4의90°부채꼴=4π. 4·AD=4π →AD=π.
  'f3-rect-sector': {
    title: '넓이가 같을 때 AD', label: 'AD 길이', tab: 'review',
    answer: '$AD=\\pi$', answerText: '$AD=\\pi$ cm',
    summary: '공통 부분을 더해 직사각형과 부채꼴을 비교해요.',
    task: 'AB를 바꾼 뒤에도 넓이가 같을 때 AD를 같은 방법으로 구해 보세요.',
    chapters: [
      {
        length: 13, title: '같은 공통 부분 더하기',
        start: { f3b: 4, f3w: 2, f3t: 0 },
        cues: [
          { at: 0, say: 'AB는 4 cm이고, 색칠한 (가)와 (나)의 넓이가 같아요.', step: 1, set: { f3Read: 0, f3Show: false } },
          { at: 4.5, say: '두 부분에 똑같은 공통 부분을 더해 보세요.', step: 2 },
          { at: 9, say: '직사각형 전체와 부채꼴 전체의 넓이가 같아져요.', step: 3 }
        ]
      },
      {
        length: 10, title: '부채꼴 넓이 구하기',
        cues: [
          { at: 0, say: '부채꼴의 반지름은 AB, 4 cm이고 중심각은 90°예요.', step: 4, set: { f3Read: 1 } },
          { at: 5, say: '부채꼴 넓이는 $\\pi\\times4^2\\times\\frac{90}{360}=4\\pi$ cm²예요.', set: { f3Read: 2 } }
        ]
      },
      {
        length: 10, title: '직사각형의 가로 찾기',
        cues: [
          { at: 0, say: '직사각형의 세로가 4 cm이니 $4\\times AD=4\\pi$예요.', set: { f3Read: 3 } },
          { at: 5, say: '양변을 4로 나누면 $AD=\\pi$ cm예요.', step: 5, set: { f3Show: true } }
        ]
      }
    ]
  },
  // a9. E는 반지름9인 두 원호의 교점: EBC 정삼각형, 남은 각30.
  // 30°부채꼴 하나27π/4, 둘27π/2. 정사각형81에서 빼면81−27π/2.
  'f3-two-arcs': {
    title: '정삼각형과 두 호의 넓이', label: '넓이', tab: 'review',
    answer: '$81-\\frac{27\\pi}{2}$', answerText: '$(81-\\frac{27\\pi}{2})$ cm²',
    summary: '같은 반지름으로 각을 찾고 두 부채꼴을 빼요.',
    task: '한 변을 바꾸어도 정삼각형과 빼는 두 부채꼴을 찾을 수 있나요?',
    chapters: [
      {
        length: 13, title: '세 변이 같은 삼각형',
        start: { f3a: 9, f3t: 0 },
        cues: [
          { at: 0, say: '한 변이 9 cm인 정사각형에서 두 호가 E에서 만나요.', step: 1, set: { f3Read: 0, f3Show: false } },
          { at: 4.5, say: 'BE와 CE는 반지름, BC와 같은 9 cm예요.' },
          { at: 9, say: '세 변이 같은 정삼각형이므로 두 밑각은 60°예요.', set: { f3Read: 1 } }
        ]
      },
      {
        length: 10, title: '빼는 부채꼴의 각',
        cues: [
          { at: 0, say: '정사각형의 직각 90°에서 삼각형의 60°를 빼요.', step: 2 },
          { at: 5, say: '두 부채꼴의 중심각은 각각 $90°-60°=30°$예요.', set: { f3Read: 2 } }
        ]
      },
      {
        length: 9, title: '넓이를 구할 전략',
        cues: [
          { at: 0, say: '정사각형에서 두 부채꼴을 빼면 파란 부분이 남아요.', step: 3 },
          { at: 4.5, say: '두 부채꼴의 반지름과 각이 같으니 한 개를 구해 두 배 해요.' }
        ]
      },
      {
        length: 13, title: '두 부채꼴 넓이',
        cues: [
          { at: 0, say: '한 부채꼴 넓이는 $\\pi\\times9^2\\times\\frac{30}{360}=\\frac{27\\pi}{4}$ cm².', step: 4, set: { f3Read: 3 } },
          { at: 4.5, say: '30° 두 개를 가로로 붙여 60° 부채꼴로 만들어요.', to: { f3t: 1 }, dur: 4, ease: 'smooth' },
          { at: 9, say: '원의 $1/6$, 두 부채꼴의 합은 $\\frac{27\\pi}{2}$ cm²예요.', set: { f3Read: 4 } }
        ]
      },
      {
        length: 10, title: '정사각형에서 빼기',
        cues: [
          { at: 0, say: '정사각형 넓이는 $9\\times9=81$ cm²예요.', set: { f3Read: 5 } },
          { at: 5, say: '두 부채꼴을 빼면 $81-\\frac{27\\pi}{2}$ cm²예요.', step: 5, set: { f3Show: true } }
        ]
      }
    ]
  },
  // a6,h3. 큰사분원9π=반원9π/2 두 개의 합.
  // 초승달=반원들의 공통부분=사분원9π/4 두 개−한 칸9=9π/2−9.
  'f3-crescent': {
    title: '초승달과 겹친 부분', label: '넓이', tab: 'review',
    answer: '$\\frac{9\\pi}{2}-9$', answerText: '$(\\frac{9\\pi}{2}-9)$ cm²',
    summary: '두 번 뺀 겹친 부분을 돌려주어 초승달을 구해요.',
    task: '한 변을 바꾸어 초승달과 겹친 부분의 넓이가 같은지 살펴보세요.',
    chapters: [
      {
        length: 10, title: '초승달의 경계 확인',
        start: { f3e: 6, f3t: 0 },
        cues: [
          { at: 0, say: '한 변이 6 cm인 정사각형 안에 초승달이 있어요.', step: 1, set: { f3Read: 0, f3Show: false } },
          { at: 5, say: '큰 사분원과 두 반원이 겹치는 부분을 살펴봐요.' }
        ]
      },
      {
        length: 10, title: '큰 사분원',
        cues: [
          { at: 0, say: '큰 사분원은 반지름 6 cm, 중심각 90°예요.', step: 2 },
          { at: 5, say: '넓이는 $\\pi\\times6^2\\times\\frac{1}{4}=9\\pi$ cm²예요.', set: { f3Read: 1 } }
        ]
      },
      {
        length: 13, title: '같은 두 반원',
        cues: [
          { at: 0, say: '반원의 지름은 6 cm, 반지름은 $6\\div2=3$ cm예요.', step: 3, set: { f3Read: 2 } },
          { at: 4.5, say: '반원 하나의 넓이는 $\\frac{1}{2}\\pi\\times3^2=\\frac{9\\pi}{2}$ cm².', set: { f3Read: 3 } },
          { at: 9, say: '두 반원의 합은 $9\\pi$ cm², 큰 사분원과 같아요.', set: { f3Read: 4 } }
        ]
      },
      {
        length: 10, title: '두 번 뺀 곳 돌려주기',
        cues: [
          { at: 0, say: '두 반원을 빼면 겹친 곳을 두 번 빼게 돼요.', step: 4 },
          { at: 5, say: '그곳을 한 번 돌려주면 초승달과 겹친 넓이가 같아요.' }
        ]
      },
      {
        length: 13, title: '겹친 부분 나누기',
        cues: [
          { at: 0, say: '겹친 곳은 작은 사분원 둘에서 정사각형 한 칸을 뺀 거예요.', step: 5 },
          { at: 4.5, say: '한 칸의 변은 3 cm, 넓이는 $3\\times3=9$ cm²예요.', set: { f3Read: 5 } },
          { at: 9, say: '반지름 3 cm인 사분원 둘의 넓이는 $\\frac{9\\pi}{2}$ cm²예요.', set: { f3Read: 6 } }
        ]
      },
      {
        length: 10, title: '초승달의 넓이',
        cues: [
          { at: 0, say: '초승달은 겹친 부분과 같으니 사분원 둘에서 한 칸을 빼요.' },
          { at: 5, say: '초승달의 넓이는 $\\frac{9\\pi}{2}-9$ cm²예요.', set: { f3Show: true } }
        ]
      }
    ]
  },
  // 한 변4 → 각 칸/r2. 사분원π, 한 칸4, 잎 하나2π−4, 넷8π−16.
  'f3-four-leaf': {
    title: '네 잎을 합친 넓이', label: '네 잎 넓이', tab: 'review',
    answer: '$8\\pi-16$', answerText: '$(8\\pi-16)$ cm²',
    summary: '잎 하나를 사분원 둘에서 한 칸을 빼서 구해요.',
    task: '한 변을 바꾸고 잎 하나를 구한 뒤 네 잎의 넓이를 구해 보세요.',
    chapters: [
      {
        length: 10, title: '작은 칸의 반지름',
        start: { f3e: 4, f3t: 0 },
        cues: [
          { at: 0, say: '한 변이 4 cm인 정사각형에 같은 잎 네 개가 있어요.', step: 1, set: { f3Read: 0, f3Show: false } },
          { at: 5, say: '한 칸의 변과 사분원의 반지름은 $4\\div2=2$ cm예요.', step: 2, set: { f3Read: 1 } }
        ]
      },
      {
        length: 10, title: '한 번 더 덮인 잎',
        cues: [
          { at: 0, say: '두 사분원이 한 칸을 덮고, 잎 부분은 두 번 덮어요.' },
          { at: 5, say: '그래서 잎 하나는 두 사분원에서 한 칸을 빼면 돼요.' }
        ]
      },
      {
        length: 13, title: '두 사분원 넓이',
        cues: [
          { at: 0, say: '사분원은 반지름 2 cm, 중심각 90°예요.' },
          { at: 4.5, say: '사분원 하나는 $\\frac{1}{4}\\pi\\times2^2=\\pi$ cm²예요.', set: { f3Read: 2 } },
          { at: 9, say: '같은 사분원 두 개의 넓이 합은 $2\\pi$ cm²예요.', set: { f3Read: 3 } }
        ]
      },
      {
        length: 13, title: '한 칸에서 잎 하나',
        cues: [
          { at: 0, say: '정사각형 한 칸의 넓이는 $2\\times2=4$ cm²예요.', step: 3, set: { f3Read: 4 } },
          { at: 4.5, say: '두 사분원에서 빼면 잎 하나는 $2\\pi-4$ cm²예요.', set: { f3Read: 5 } },
          { at: 9, say: '같은 잎이 네 개이므로 잎 하나의 넓이를 네 배 해요.', step: 4 }
        ]
      },
      {
        length: 10, title: '네 잎의 넓이',
        cues: [
          { at: 0, say: '잎 하나의 넓이 $2\\pi-4$에 4를 곱해요.' },
          { at: 5, say: '네 잎의 넓이는 $4(2\\pi-4)=8\\pi-16$ cm²예요.', set: { f3Show: true } }
        ]
      }
    ]
  },
  // r6,d6. 오른쪽 덧붙은 반원이 왼쪽 빈 반원으로 평행이동 →6×12=72.
  'f3-two-circles': {
    title: '두 원을 감싼 도형의 넓이', label: '넓이', tab: 'review',
    answer: '$72$', answerText: '$72$ cm²',
    summary: '같은 반원을 가로로 옮겨 직사각형으로 바꿔요.',
    task: '반지름을 바꾸고 남는 직사각형의 가로와 세로를 찾아보세요.',
    chapters: [
      {
        length: 13, title: '같은 반원 찾기',
        start: { f3r: 6, f3k: 1, f3t: 0 },
        cues: [
          { at: 0, say: '반지름은 6 cm, 서로의 중심을 지나 거리도 6 cm예요.', step: 1, set: { f3Read: 0, f3Show: false } },
          { at: 4.5, say: '색칠한 곳은 감싼 도형에서 왼쪽 원을 뺀 곳이에요.', step: 2 },
          { at: 9, say: '직사각형에 반원을 더하고, 같은 반원을 뺀 모양이에요.', step: 3 }
        ]
      },
      {
        length: 10, title: '반원을 가로로 옮기기',
        cues: [
          { at: 0, say: '두 반원은 반지름 6 cm로 같아 넓이도 같아요.', step: 4 },
          { at: 4.5, say: '오른쪽 반원을 왼쪽 빈자리에 가로로 밀어 넣어요.', to: { f3t: 1 }, dur: 4, ease: 'smooth' }
        ]
      },
      {
        length: 10, title: '남은 직사각형',
        cues: [
          { at: 0, say: '남은 직사각형의 세로는 지름, $2\\times6=12$ cm예요.', set: { f3Read: 1 } },
          { at: 5, say: '가로는 중심 사이 거리 6 cm예요.' }
        ]
      },
      {
        length: 10, title: '색칠한 넓이 구하기',
        cues: [
          { at: 0, say: '옮겨도 넓이는 같으니 직사각형의 넓이를 구해요.' },
          { at: 5, say: '가로 곱하기 세로, $6\\times12=72$ cm²예요.', step: 5, set: { f3Show: true } }
        ]
      }
    ]
  },
  // 반원 지름12/r6 →18π. 부채꼴 r12 →144π·x/360.
  // 같은 넓이: x/360=18/144=1/8 →45°.
  'f3-half-sector': {
    title: '넓이가 같을 때 중심각', label: '중심각', tab: 'review',
    answer: '$45°$', answerText: '$45°$',
    summary: '공통 부분을 더해 반원과 부채꼴의 넓이를 같게 해요.',
    task: '반원의 지름이 바뀌어도 같은 방법으로 중심각을 구할 수 있나요?',
    chapters: [
      {
        length: 13, title: '공통 부분 더하기',
        start: { f3q: 12, f3x: 30, f3t: 0 },
        cues: [
          { at: 0, say: '반원의 지름은 12 cm, (가)와 (나)의 넓이가 같아요.', step: 1, set: { f3Read: 0, f3Show: false } },
          { at: 4.5, say: '양쪽에 같은 공통 부분을 더해 보세요.', step: 2 },
          { at: 9, say: '반원 전체와 부채꼴 전체의 넓이가 같아져요.', step: 3 }
        ]
      },
      {
        length: 10, title: '반원의 반지름과 넓이',
        cues: [
          { at: 0, say: '반원의 반지름은 지름의 반, $12\\div2=6$ cm예요.', step: 4, set: { f3Read: 1 } },
          { at: 5, say: '반원 넓이는 $\\frac{1}{2}\\pi\\times6^2=18\\pi$ cm²예요.', set: { f3Read: 2 } }
        ]
      },
      {
        length: 10, title: '부채꼴의 넓이와 비교',
        cues: [
          { at: 0, say: '부채꼴 반지름은 12 cm, 중심각은 $x$예요.' },
          { at: 5, say: '넓이가 같으니 $18\\pi=144\\pi\\times\\frac{x}{360}$예요.', set: { f3Read: 3 } }
        ]
      },
      {
        length: 10, title: '중심각 계산하기',
        cues: [
          { at: 0, say: '양변을 $144\\pi$로 나누면 $\\frac{x}{360}=\\frac{1}{8}$예요.', set: { f3Read: 4 } },
          { at: 5, say: '따라서 중심각은 $360°\\times\\frac{1}{8}=45°$예요.', step: 5, set: { f3Show: true } }
        ]
      }
    ]
  },
  // a6. 사분원9π 두 개가 정사각형36과 잎을 덮음 →18π−36.
  'f3-leaf-area': {
    title: '겹친 잎 모양의 넓이', label: '넓이', tab: 'review',
    answer: '$18\\pi-36$', answerText: '$(18\\pi-36)$ cm²',
    summary: '두 번 덮인 잎은 두 사분원에서 정사각형을 빼요.',
    task: '정사각형을 바꾸고 두 사분원과 잎의 넓이를 비교해 보세요.',
    chapters: [
      {
        length: 13, title: '사분원의 중심과 반지름',
        start: { f3a: 6, f3t: 0 },
        cues: [
          { at: 0, say: '한 변이 6 cm인 정사각형에 잎 모양이 있어요.', step: 1, set: { f3Read: 0, f3Show: false } },
          { at: 4.5, say: '사분원의 중심은 꼭짓점, 반지름은 한 변 6 cm예요.', step: 2 },
          { at: 9, say: '두 사분원이 겹친 곳을 찾아 넓이를 구할 거예요.' }
        ]
      },
      {
        length: 10, title: '사분원 하나의 넓이',
        cues: [
          { at: 0, say: '반지름 6 cm, 중심각 90°인 사분원이에요.' },
          { at: 5, say: '사분원 하나는 $\\frac{1}{4}\\pi\\times6^2=9\\pi$ cm²예요.', set: { f3Read: 1 } }
        ]
      },
      {
        length: 13, title: '두 번 덮인 잎',
        cues: [
          { at: 0, say: '다른 사분원도 같으니 두 넓이의 합은 $18\\pi$ cm²예요.', step: 3, set: { f3Read: 2 } },
          { at: 4.5, say: '정사각형 전체는 한 번, 잎은 한 번 더 덮여요.' },
          { at: 9, say: '정사각형의 넓이는 $6\\times6=36$ cm²예요.', set: { f3Read: 3 } }
        ]
      },
      {
        length: 10, title: '정사각형 빼기',
        cues: [
          { at: 0, say: '두 사분원에서 정사각형을 빼면 겹친 잎만 남아요.', step: 4 },
          { at: 5, say: '따라서 잎 모양의 넓이는 $18\\pi-36$ cm²예요.', step: 5, set: { f3Show: true } }
        ]
      }
    ]
  },
  // h3,wA5,wB4,o2 →A15,B12,겹침6,합친넓이21.
  'f3-two-rects': {
    title: '두 직사각형을 합친 넓이', label: '합친 넓이', tab: 'review',
    answer: '$21$', answerText: '$21$ cm²',
    summary: '각 직사각형의 넓이에서 두 번 센 겹침을 빼요.',
    task: '겹친 폭을 바꾸어 합친 도형의 넓이가 어떻게 변하는지 보세요.',
    chapters: [
      {
        length: 10, title: '조건과 계산 전략',
        start: { f3h: 3, f3o: 2, f3t: 0 },
        cues: [
          { at: 0, say: 'A의 가로 5 cm, B의 가로 4 cm, 세로는 3 cm예요.', step: 1, set: { f3Read: 0, f3Show: false } },
          { at: 5, say: '각 넓이를 더하고, 두 번 센 겹친 부분을 한 번 빼요.' }
        ]
      },
      {
        length: 10, title: '각 직사각형의 넓이',
        cues: [
          { at: 0, say: '직사각형 A의 넓이는 $5\\times3=15$ cm²예요.', set: { f3Read: 1 } },
          { at: 5, say: '직사각형 B의 넓이는 $4\\times3=12$ cm²예요.', set: { f3Read: 2 } }
        ]
      },
      {
        length: 13, title: '가로로 겹쳐 놓기',
        cues: [
          { at: 0, say: 'B를 가로로 밀어 A와 겹쳐 놓아 볼게요.', step: 2 },
          { at: 0.5, to: { f3t: 1 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '겹친 부분의 가로는 2 cm, 세로는 3 cm예요.', set: { f3Read: 3 } },
          { at: 9, say: '겹친 곳은 A에도 B에도 포함되어 두 번 세었어요.' }
        ]
      },
      {
        length: 10, title: '중복한 넓이 구하기',
        cues: [
          { at: 0, say: '겹친 부분의 넓이는 $2\\times3=6$ cm²예요.', step: 3, set: { f3Read: 4 } },
          { at: 5, say: '두 넓이의 합에서 이 6 cm²를 한 번만 빼요.' }
        ]
      },
      {
        length: 10, title: '합친 넓이 계산하기',
        cues: [
          { at: 0, say: '윤곽 안의 전체를 한 번씩만 세어 볼게요.', step: 4 },
          { at: 5, say: '합친 넓이는 $15+12-6=21$ cm²예요.', set: { f3Show: true } }
        ]
      }
    ]
  }
});
