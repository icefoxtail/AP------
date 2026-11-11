/* ==========================================================================
   원과 부채꼴 · F05 잔여 8장면의 해설
   근거: f05.js RING240/STAR/LENS/CUT/TRACK의 question·model·stepsOf·quick,
         BAND(rect/tri3/line)·bandModel·bandSteps·bandSolStd.
   수치는 각 장면 enter() 기본값과 동일하게 첫 장 start에서 고정합니다.
   f5Read/f5Given/f5Final 및 f5BandRead는 f05.js의 신규 장면 해설에서만
   그림·칩·공식을 설명 순서에 맞춰 공개하며, 직접 해 보기에는 관여하지 않습니다.
   f5-ring2는 정의만 있고 등록되지 않은 장면이므로 제작 대상에 넣지 않습니다.
   독립 계산·실제 validator·상태/표시 순서: tools/lessons.g7-circle-sector-f05.test.mjs.
   ========================================================================== */
window.APL_LESSONS = window.APL_LESSONS || {};
Object.assign(window.APL_LESSONS['g7-circle-sector'] = window.APL_LESSONS['g7-circle-sector'] || {}, {
  // r=4, 폭=4 → R=8, 잘라 낸 각=120 → 남은 각=240.
  // 바깥 호 32π/3 + 폭4 + 안쪽 호16π/3 + 폭4 = 16π+8.
  'f5-ring240': {
    title: '잘라 낸 고리의 둘레', label: '둘레', tab: 'review',
    answer: '$16\\pi+8$', answerText: '$(16\\pi+8)$ cm',
    summary: '남은 중심각으로 두 호와 두 선분을 구해요.',
    task: '잘라 낸 각을 바꾸고 남은 호의 각과 둘레를 확인해 보세요.',
    chapters: [
      {
        length: 13, title: '반지름과 남은 각',
        start: { f5A: 4, f5B: 4, f5C: 120, f5T: 0 },
        cues: [
          { at: 0, say: '안쪽 반지름 4 cm, 폭 4 cm인 고리예요.', step: 1, set: { f5Read: 0, f5Given: 0, f5Final: false } },
          { at: 4.5, say: '바깥 반지름은 $4+4=8$ cm예요.', set: { f5Given: 1 } },
          { at: 9, say: '120°를 잘라 냈으니 남은 각은 $360°-120°=240°$.', set: { f5Given: 2 } }
        ]
      },
      {
        length: 10, title: '바깥쪽 호',
        cues: [
          { at: 0, say: '바깥 호는 반지름 8 cm, 중심각 240°예요.', step: 2 },
          { at: 5, say: '원주의 $240/360$만큼, $2\\pi\\times8\\times\\frac{240}{360}=\\frac{32\\pi}{3}$ cm.', set: { f5Read: 1 } }
        ]
      },
      {
        length: 9, title: '위쪽 직선',
        cues: [
          { at: 0, say: '호 사이를 잇는 위쪽 선분도 경계예요.', step: 3 },
          { at: 4.5, say: '고리의 폭과 같으니 길이는 $8-4=4$ cm예요.', set: { f5Read: 2 } }
        ]
      },
      {
        length: 13, title: '안쪽 호와 아래 선분',
        cues: [
          { at: 0, say: '안쪽 호는 반지름 4 cm, 중심각 240°예요.', step: 4 },
          { at: 4.5, say: '호 길이는 $2\\pi\\times4\\times\\frac{240}{360}=\\frac{16\\pi}{3}$ cm예요.', set: { f5Read: 3 } },
          { at: 9, say: '아래쪽 선분도 같은 폭이므로 4 cm예요.', step: 5, set: { f5Read: 4 } }
        ]
      },
      {
        length: 10, title: '경계 전체 더하기',
        cues: [
          { at: 0, say: '두 호와 두 선분을 빠짐없이 더해요.' },
          { at: 5, say: '둘레는 $\\frac{32\\pi}{3}+4+\\frac{16\\pi}{3}+4=16\\pi+8$ cm.', step: 6, set: { f5Final: true } }
        ]
      }
    ]
  },
  // 한 변6 → 모든 호의 반지름3. 90° 호8개, 각3π/2 →12π.
  'f5-star': {
    title: '네 잎 모양의 둘레', label: '둘레', tab: 'review',
    answer: '$12\\pi$', answerText: '$12\\pi$ cm',
    summary: '바깥 원의 호와 안쪽 사분원의 호를 더해요.',
    task: '정사각형의 변을 바꾸어도 둘레를 이루는 호가 같은지 살펴보세요.',
    chapters: [
      {
        length: 13, title: '경계와 반지름 찾기',
        start: { f5A: 6, f5T: 0 },
        cues: [
          { at: 0, say: '정사각형의 한 변은 6 cm예요.', step: 1, set: { f5Read: 0, f5Given: 0, f5Final: false } },
          { at: 4.5, say: '네 잎의 경계는 바깥 호와 안쪽 호예요.' },
          { at: 9, say: '두 종류의 호 모두 반지름은 $6\\div2=3$ cm예요.', set: { f5Given: 1 } }
        ]
      },
      {
        length: 10, title: '바깥쪽 호 모으기',
        cues: [
          { at: 0, say: '초록색 호는 반지름 3 cm인 90° 호 4개예요.', step: 2 },
          { at: 5, say: '한 호 $\\frac{3\\pi}{2}$ cm, 네 호는 $\\frac{3\\pi}{2}\\times4=6\\pi$ cm.', set: { f5Read: 1 } }
        ]
      },
      {
        length: 10, title: '안쪽 호 모으기',
        cues: [
          { at: 0, say: '보라색 사분원도 반지름 3 cm, 중심각 90°예요.', step: 3 },
          { at: 5, say: '같은 길이의 호 4개이니 합도 $6\\pi$ cm예요.', set: { f5Read: 2 } }
        ]
      },
      {
        length: 10, title: '호의 길이 더하기',
        cues: [
          { at: 0, say: '정사각형의 변은 경계가 아니므로 넣지 않아요.' },
          { at: 5, say: '두 종류의 호를 더하면 $6\\pi+6\\pi=12\\pi$ cm예요.', step: 4, set: { f5Final: true } }
        ]
      }
    ]
  },
  // 서로의 중심을 지나는 같은 반지름12의 두 원. 위·아래 정삼각형의
  // 중심 쪽 각60+60=120. 각 호 2π·12·120/360=8π, 둘레16π.
  'f5-lens': {
    title: '겹친 두 원의 둘레', label: '둘레', tab: 'review',
    answer: '$16\\pi$', answerText: '$16\\pi$ cm',
    summary: '같은 반지름으로 중심각을 찾고 두 호를 더해요.',
    task: '반지름을 바꾸어도 두 호의 중심각이 같은지 확인해 보세요.',
    chapters: [
      {
        length: 13, title: '같은 반지름 찾기',
        start: { f5A: 12, f5T: 0 },
        cues: [
          { at: 0, say: '반지름 12 cm인 두 원이 서로의 중심을 지나요.', step: 1, set: { f5Read: 0, f5Given: 0, f5Final: false } },
          { at: 4.5, say: '위아래 삼각형의 세 변이 모두 반지름이에요.' },
          { at: 9, say: '두 정삼각형의 중심 쪽 각은 각각 60°예요.', set: { f5Given: 1 } }
        ]
      },
      {
        length: 9, title: '호의 중심각 찾기',
        cues: [
          { at: 0, say: '오른쪽 호를 보는 각은 위아래 두 각의 합이에요.' },
          { at: 4.5, say: '따라서 호의 중심각은 $60°+60°=120°$예요.', set: { f5Given: 2 } }
        ]
      },
      {
        length: 10, title: '오른쪽 호의 길이',
        cues: [
          { at: 0, say: '오른쪽 호는 반지름 12 cm, 중심각 120°예요.', step: 2 },
          { at: 5, say: '호 길이는 $2\\pi\\times12\\times\\frac{120}{360}=8\\pi$ cm예요.', set: { f5Read: 1 } }
        ]
      },
      {
        length: 10, title: '왼쪽 호의 길이',
        cues: [
          { at: 0, say: '왼쪽 호도 반지름과 중심각이 같아요.', step: 3 },
          { at: 5, say: '그래서 왼쪽 호의 길이도 $8\\pi$ cm예요.', set: { f5Read: 2 } }
        ]
      },
      {
        length: 10, title: '두 경계 더하기',
        cues: [
          { at: 0, say: '중심을 잇는 선분은 경계가 아니에요.' },
          { at: 5, say: '두 호를 더한 둘레는 $8\\pi+8\\pi=16\\pi$ cm예요.', step: 4, set: { f5Final: true } }
        ]
      }
    ]
  },
  // 큰 반지름8, 작은 반원의 지름8 → 작은 반지름4.
  // 큰 반원호8π + 남은 지름2(8−4)=8 + 작은 반원호4π =12π+8.
  'f5-cut': {
    title: '파낸 반원의 둘레', label: '둘레', tab: 'review',
    answer: '$12\\pi+8$', answerText: '$(12\\pi+8)$ cm',
    summary: '파낸 호도 경계에 포함하고 남은 직선만 더해요.',
    task: '작은 반원의 크기를 바꾸며 남은 직선과 두 호를 찾아보세요.',
    chapters: [
      {
        length: 13, title: '조건과 경계 찾기',
        start: { f5A: 8, f5B: 4, f5T: 0 },
        cues: [
          { at: 0, say: '큰 반지름은 8 cm, 작은 지름도 8 cm예요.', step: 1, set: { f5Read: 0, f5Given: 0, f5Final: false } },
          { at: 4.5, say: '작은 반원의 반지름은 $8\\div2=4$ cm예요.', set: { f5Given: 1 } },
          { at: 9, say: '파낸 호도 경계예요. 점선 지름은 넣지 않아요.' }
        ]
      },
      {
        length: 10, title: '큰 반원의 호',
        cues: [
          { at: 0, say: '큰 호는 반지름 8 cm, 중심각 180°예요.', step: 2 },
          { at: 5, say: '원의 반이므로 $2\\pi\\times8\\times\\frac{1}{2}=8\\pi$ cm예요.', set: { f5Read: 1 } }
        ]
      },
      {
        length: 10, title: '남은 직선 부분',
        cues: [
          { at: 0, say: '남은 직선은 두 반원의 지름 차예요.', step: 3 },
          { at: 5, say: '반지름 차의 두 배, $2\\times(8-4)=8$ cm예요.', set: { f5Read: 2 } }
        ]
      },
      {
        length: 10, title: '파낸 반원의 호',
        cues: [
          { at: 0, say: '안쪽 호는 반지름 4 cm, 중심각 180°예요.', step: 4 },
          { at: 5, say: '이 호도 더해요. 길이는 $2\\pi\\times4\\times\\frac{1}{2}=4\\pi$ cm.', set: { f5Read: 3 } }
        ]
      },
      {
        length: 10, title: '세 경계 더하기',
        cues: [
          { at: 0, say: '큰 호, 남은 직선, 파낸 호를 차례로 더해요.' },
          { at: 5, say: '둘레는 $8\\pi+8+4\\pi=12\\pi+8$ cm예요.', step: 5, set: { f5Final: true } }
        ]
      }
    ]
  },
  // 반지름5, 직선10. 호 두 개가 각각5π, 직선 둘20 →10π+20.
  'f5-track': {
    title: '운동장 트랙의 둘레', label: '둘레', tab: 'review',
    answer: '$10\\pi+20$', answerText: '$(10\\pi+20)$ cm',
    summary: '두 직선과 두 반원호를 따라 길이를 더해요.',
    task: '직선 길이와 반지름을 바꾸어 둘레의 변화를 확인해 보세요.',
    chapters: [
      {
        length: 10, title: '트랙의 경계 찾기',
        start: { f5A: 5, f5B: 10, f5T: 0 },
        cues: [
          { at: 0, say: '직선 길이 10 cm, 양쪽 반원의 반지름은 5 cm예요.', step: 1, set: { f5Read: 0, f5Given: 0, f5Final: false } },
          { at: 5, say: '직선 둘과 반원호 둘을 나누어 길이를 구해요.' }
        ]
      },
      {
        length: 13, title: '위쪽과 오른쪽 경계',
        cues: [
          { at: 0, say: '위쪽 직선 부분의 길이는 10 cm예요.', step: 2, set: { f5Read: 1 } },
          { at: 4.5, say: '오른쪽 호는 반지름 5 cm, 중심각 180°예요.', step: 3 },
          { at: 9, say: '반원호 길이는 $2\\pi\\times5\\times\\frac{1}{2}=5\\pi$ cm예요.', set: { f5Read: 2 } }
        ]
      },
      {
        length: 13, title: '아래쪽과 왼쪽 경계',
        cues: [
          { at: 0, say: '아래쪽 직선도 같은 길이 10 cm예요.', step: 4, set: { f5Read: 3 } },
          { at: 4.5, say: '왼쪽 호도 같은 반지름의 반원이에요.', step: 5 },
          { at: 9, say: '왼쪽 반원호의 길이도 $5\\pi$ cm예요.', set: { f5Read: 4 } }
        ]
      },
      {
        length: 10, title: '한 바퀴의 길이',
        cues: [
          { at: 0, say: '계산한 직선 둘과 반원호 둘을 모두 더해요.' },
          { at: 5, say: '둘레는 $10+5\\pi+10+5\\pi=10\\pi+20$ cm예요.', step: 6, set: { f5Final: true } }
        ]
      }
    ]
  },
  // BAND.rect 기본값 r4, 가로2개×세로3줄: 중심 다각형의 변6개.
  // 직선2r·6=48, 곡선90°·4=360° →8π, 합8π+48.
  'f5-rect': {
    title: '여섯 원기둥을 묶는 끈', label: '끈 길이',
    answer: '$8\\pi+48$', answerText: '$(8\\pi+48)$ cm',
    summary: '중심을 이은 직선과 모은 원의 둘레를 더해요.',
    task: '원기둥의 줄 수를 바꾸어 직선 부분과 곡선 부분을 비교해 보세요.',
    chapters: [
      {
        length: 13, title: '직선 부분의 길이',
        start: { f5A: 4, f5B: 3, f5T: 0 },
        cues: [
          { at: 0, say: '반지름 4 cm인 원기둥 6개를 팽팽하게 묶어요.', set: { f5BandRead: 0 }, to: { f5T: 0.16 }, dur: 2, ease: 'smooth' },
          { at: 4.5, say: '직선은 중심 사이 거리와 같아 $4+4=8$ cm예요.', set: { f5BandRead: 1 }, to: { f5T: 0.38 }, dur: 4, ease: 'smooth' },
          { at: 9, say: '같은 길이의 선분 6개, 직선의 합은 $8\\times6=48$ cm.', set: { f5BandRead: 2 } }
        ]
      },
      {
        length: 15, title: '모서리의 호 모으기',
        cues: [
          { at: 0, say: '네 모서리의 곡선은 중심각 90°인 호예요.', set: { f5BandRead: 3 }, to: { f5T: 0.65 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '반지름이 같은 네 호를 가로로 모아 볼게요.', to: { f5T: 1 }, dur: 5, ease: 'smooth' },
          { at: 11, say: '중심각의 합이 $90°\\times4=360°$, 원 하나예요.', set: { f5BandRead: 4 } }
        ]
      },
      {
        length: 10, title: '곡선 부분의 길이',
        cues: [
          { at: 0, say: '곡선 전체는 반지름 4 cm인 원의 둘레예요.' },
          { at: 5, say: '곡선 부분의 길이는 $2\\pi\\times4=8\\pi$ cm예요.', set: { f5BandRead: 5 } }
        ]
      },
      {
        length: 10, title: '끈의 최소 길이',
        cues: [
          { at: 0, say: '직선 48 cm와 곡선 $8\\pi$ cm를 더해요.' },
          { at: 5, say: '필요한 끈의 최소 길이는 $(8\\pi+48)$ cm예요.', set: { f5BandRead: 6 } }
        ]
      }
    ]
  },
  // BAND.tri3: 접한 세 원의 중심이 정삼각형. 내각60→회전각120.
  // r5, 직선10·3=30, 호120°·3=360° →10π, 합10π+30.
  'f5-tri3': {
    title: '세 원기둥을 묶는 끈', label: '끈 길이',
    answer: '$10\\pi+30$', answerText: '$(10\\pi+30)$ cm',
    summary: '직선 세 개와 중심각을 모은 원의 둘레를 더해요.',
    task: '반지름을 바꾸고 직선과 곡선의 길이가 어떻게 변하는지 보세요.',
    chapters: [
      {
        length: 13, title: '직선 부분의 길이',
        start: { f5A: 5, f5T: 0 },
        cues: [
          { at: 0, say: '반지름 5 cm인 원기둥 3개가 서로 접해 있어요.', set: { f5BandRead: 0 }, to: { f5T: 0.16 }, dur: 2, ease: 'smooth' },
          { at: 4.5, say: '직선은 중심 사이 거리와 같아 $5+5=10$ cm예요.', set: { f5BandRead: 1 }, to: { f5T: 0.38 }, dur: 4, ease: 'smooth' },
          { at: 9, say: '직선 부분 세 개의 합은 $10\\times3=30$ cm예요.', set: { f5BandRead: 2 } }
        ]
      },
      {
        length: 13, title: '호의 중심각 찾기',
        cues: [
          { at: 0, say: '세 중심을 이으면 세 변이 같은 정삼각형이에요.' },
          { at: 4.5, say: '내각이 60°라 바깥쪽 각은 $180°-60°=120°$예요.', set: { f5BandRead: 3 } },
          { at: 9, say: '따라서 곡선은 중심각 120°인 호 세 개예요.', to: { f5T: 0.65 }, dur: 3.5, ease: 'smooth' }
        ]
      },
      {
        length: 11, title: '세 호를 모으기',
        cues: [
          { at: 0, say: '반지름이 같은 세 호를 가로로 모아 볼게요.', to: { f5T: 1 }, dur: 6, ease: 'smooth' },
          { at: 6.5, say: '중심각의 합이 $120°\\times3=360°$, 원 하나예요.', set: { f5BandRead: 4 } }
        ]
      },
      {
        length: 10, title: '곡선 부분의 길이',
        cues: [
          { at: 0, say: '곡선 전체는 반지름 5 cm인 원의 둘레예요.' },
          { at: 5, say: '곡선 부분의 길이는 $2\\pi\\times5=10\\pi$ cm예요.', set: { f5BandRead: 5 } }
        ]
      },
      {
        length: 10, title: '끈의 최소 길이',
        cues: [
          { at: 0, say: '직선 30 cm와 곡선 $10\\pi$ cm를 더해요.' },
          { at: 5, say: '필요한 끈의 최소 길이는 $(10\\pi+30)$ cm예요.', set: { f5BandRead: 6 } }
        ]
      }
    ]
  },
  // BAND.line 기본값 r4, n2: 직선2개 각각8, 반원호2개 →8π+16.
  'f5-line': {
    title: '한 줄의 원기둥과 끈', label: '끈 길이',
    answer: '$8\\pi+16$', answerText: '$(8\\pi+16)$ cm',
    summary: '위아래 직선과 양 끝의 반원호를 더해요.',
    task: '한 줄의 원기둥 개수를 늘리고 직선 부분의 길이를 살펴보세요.',
    chapters: [
      {
        length: 13, title: '위아래 직선의 길이',
        start: { f5A: 4, f5B: 2, f5T: 0 },
        cues: [
          { at: 0, say: '반지름 4 cm인 원기둥 2개가 나란히 접해 있어요.', set: { f5BandRead: 0 }, to: { f5T: 0.16 }, dur: 2, ease: 'smooth' },
          { at: 4.5, say: '직선은 중심 사이 거리와 같아 $4+4=8$ cm예요.', set: { f5BandRead: 1 }, to: { f5T: 0.38 }, dur: 4, ease: 'smooth' },
          { at: 9, say: '위아래 두 직선의 합은 $8\\times2=16$ cm예요.', set: { f5BandRead: 2 } }
        ]
      },
      {
        length: 15, title: '양 끝의 반원호',
        cues: [
          { at: 0, say: '양 끝의 곡선은 중심각 180°인 반원호예요.', set: { f5BandRead: 3 }, to: { f5T: 0.65 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '반지름이 같은 두 반원호를 가로로 모아 볼게요.', to: { f5T: 1 }, dur: 5, ease: 'smooth' },
          { at: 11, say: '중심각의 합이 $180°+180°=360°$, 원 하나예요.', set: { f5BandRead: 4 } }
        ]
      },
      {
        length: 10, title: '곡선 부분의 길이',
        cues: [
          { at: 0, say: '곡선 전체는 반지름 4 cm인 원의 둘레예요.' },
          { at: 5, say: '곡선 부분의 길이는 $2\\pi\\times4=8\\pi$ cm예요.', set: { f5BandRead: 5 } }
        ]
      },
      {
        length: 10, title: '끈의 최소 길이',
        cues: [
          { at: 0, say: '직선 16 cm와 곡선 $8\\pi$ cm를 더해요.' },
          { at: 5, say: '필요한 끈의 최소 길이는 $(8\\pi+16)$ cm예요.', set: { f5BandRead: 6 } }
        ]
      }
    ]
  }
});
