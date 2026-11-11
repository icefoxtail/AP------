/* 원 알아보기 5장면 · 7해설.
 * 근거: g7-circle-sector.html sCenter/sDiameter/partScene의 question·steps·problem,
 * shapeOf/boundary/angleLength/rollLength 및 PARAMS(csR 2..12, csQ 0..360,
 * csD 0..100, csS 30..180, csA 30..300).
 * 중심·반지름, 지름/원주율, 호·현, 부채꼴 호/넓이, 활꼴을 분리한다.
 * csConceptRead/Show는 해당 HTML의 lessonOn/lessonEntry 그림에만 쓰며,
 * 수동 탐구·정리·문제 경로와 숫자 계산은 보존한다.
 * 숫자는 r=6의 원주·부채꼴 원본 공식으로 독립 검산한다.
 */
(function () {
  'use strict';
  const lessons = {
    'z0-center': {
      title: '중심에서 원 위까지의 거리는?',
      label: '중심·반지름', tab: 'review',
      answer: '모든 반지름은 같아요',
      answerText: '모든 반지름은 같아요. 중심에서 원 위까지의 거리는 반지름 $r$입니다.',
      summary: '원의 중심에서 원 위의 모든 점까지 거리는 같습니다.',
      task: '직접 점 P를 움직여 반지름의 길이가 변하는지 확인해 보세요',
      chapters: [
        {
          length: 10, title: '중심과 원 위의 점',
          start: { csR: 6, csQ: 90 },
          cues: [
            { at: 0, say: '중심 O와 원 위의 점 P, 반지름 6 cm를 봐요.', set: { csConceptMode: 'radius', csConceptRead: 0, csConceptShow: false }, step: 1 },
            { at: .2, to: { csQ: 180 }, dur: 4, ease: 'smooth' },
            { at: 5, say: '선분 OP는 중심과 원 위의 점을 이어요.' }
          ]
        },
        {
          length: 13, title: '다른 위치와 비교하기',
          cues: [
            { at: 0, say: 'P를 움직이며 OP의 길이가 변하는지 봐요.', to: { csQ: 270 }, dur: 5, ease: 'smooth' },
            { at: 5.5, say: '다른 점까지 이은 선분도 함께 비교해요.', step: 2 },
            { at: 9, say: '모든 반지름은 6 cm로 같아요.', set: { csConceptShow: true } }
          ]
        }
      ]
    },
    'z0-diameter': [
      {
        title: '지름은 반지름의 몇 배일까요?', label: '지름', tab: 'review',
        answer: '$2r$', answerText: '지름은 반지름의 2배, $2r$입니다.',
        summary: '중심을 지나는 지름은 반지름 두 개를 이은 길이입니다.',
        task: '반지름을 바꾸어 지름과의 관계를 확인해 보세요',
        chapters: [
          {
            length: 10, title: '중심을 지나는 선분',
            start: { csR: 6, csD: 0 },
            cues: [
              { at: 0, say: '중심 O를 지나 원 위의 두 점을 이어요.', set: { csConceptMode: 'diameter', csConceptRead: 0, csConceptShow: false }, step: 1 },
              { at: .2, to: { csD: 25 }, dur: 4, ease: 'smooth' },
              { at: 5, say: '이 선분이 지름이에요. 가운데 O에서 나눠 봐요.', set: { csConceptRead: 1 } }
            ]
          },
          {
            length: 13, title: '두 부분의 길이',
            cues: [
              { at: 0, say: '양쪽 선분은 각각 반지름 6 cm예요.', set: { csConceptRead: 2 }, step: 2 },
              { at: 5, say: '지름 $=6+6=12$ cm예요.', set: { csConceptRead: 3 } },
              { at: 9, say: '지름은 반지름의 2배, $2r$예요.', set: { csConceptShow: true } }
            ]
          }
        ]
      },
      {
        title: '원주율은 어떤 비일까요?', label: '원주율', tab: 'review',
        answer: '$\\pi$', answerText: '원주 ÷ 지름은 원주율 $\\pi$입니다.',
        summary: '원의 크기와 관계없이 원주를 지름으로 나눈 비는 같습니다.',
        task: '반지름을 바꾸고 한 바퀴 굴려 원주와 지름의 비를 살펴보세요',
        chapters: [
          {
            length: 10, title: '원을 바닥에 놓기',
            start: { csR: 6, csD: 0 },
            cues: [
              { at: 0, say: '반지름 6 cm인 원을 바닥에 놓아요.', set: { csConceptMode: 'circumference', csConceptRead: 0, csConceptShow: false }, step: 1 },
              { at: 5, say: '지름은 반지름 두 개, $6+6=12$ cm예요.', set: { csConceptRead: 1 } }
            ]
          },
          {
            length: 12, title: '한 바퀴 굴리기',
            cues: [
              { at: 0, say: '노란 점이 바닥으로 돌아오도록 한 바퀴 굴려요.', to: { csD: 100 }, dur: 7.5, ease: 'linear' },
              { at: 8, say: '굴러간 거리가 원의 둘레, 원주예요.', set: { csConceptRead: 2 } }
            ]
          },
          {
            length: 13, title: '원주와 지름의 비',
            cues: [
              { at: 0, say: '원주를 지름으로 나눈 일정한 비를 정해요.' },
              { at: 5, say: '그 값이 원주율 $\\pi$예요. 원주 $=\\pi\\times$지름.', set: { csConceptRead: 3, csConceptShow: true } },
              { at: 9, say: '지름이 12 cm이므로 원주는 $12\\pi$ cm예요.', set: { csConceptRead: 4 } }
            ]
          }
        ]
      }
    ],
    'z0-arc': {
      title: '호와 현 중 어느 쪽이 짧을까요?', label: '호·현', tab: 'review',
      answer: '현 AB가 더 짧아요', answerText: '현 AB가 더 짧아요. 두 점 사이의 최단 거리는 곧은 선분입니다.',
      summary: '호는 굽은 곡선, 현은 두 끝점을 곧게 이은 선분입니다.',
      task: '중심각을 바꿔도 현이 호보다 짧은지 비교해 보세요',
      chapters: [
        {
          length: 10, title: '같은 두 점을 잇는 선',
          start: { csR: 6, csS: 60 },
          cues: [
            { at: 0, say: '원 위의 A, B를 잇는 두 선을 비교해요.', set: { csConceptMode: 'arc', csConceptRead: 0, csConceptShow: false }, step: 2 },
            { at: .2, to: { csS: 120 }, dur: 4, ease: 'smooth', snap: 15 },
            { at: 5, say: '원주를 따라 굽은 파란 선이 호 AB예요.', set: { csConceptRead: 1 } }
          ]
        },
        {
          length: 13, title: '같은 눈금으로 비교',
          cues: [
            { at: 0, say: 'A, B를 곧게 이은 분홍 선은 현 AB예요.', set: { csConceptRead: 2 }, step: 3 },
            { at: 5, say: '같은 눈금으로 길이를 나란히 비교해요.', set: { csConceptRead: 3 } },
            { at: 9, say: '두 점 사이의 최단 거리는 곧은 현 AB예요.', set: { csConceptShow: true } }
          ]
        }
      ]
    },
    'z0-sector': ['arc', 'area'].map((kind) => {
      const area = kind === 'area';
      return {
        title: area ? '중심각이 커지면 넓이는?' : '중심각이 커지면 호의 길이는?',
        label: area ? '넓이' : '호의 길이', tab: 'review',
        answer: area ? '넓이도 2배' : '호의 길이도 2배',
        answerText: area ? '중심각이 2배이면 넓이도 2배입니다.' : '중심각이 2배이면 호의 길이도 2배입니다.',
        summary: area ? '반지름이 같을 때 부채꼴의 넓이는 중심각에 정비례합니다.' : '반지름이 같을 때 호의 길이는 중심각에 정비례합니다.',
        task: '반지름을 고정하고 중심각만 바꾸어 관계를 살펴보세요',
        chapters: [
          {
            length: 13, title: '원의 어느 부분일까?',
            start: { csR: 6, csA: 90 },
            cues: [
              { at: 0, say: '반지름 6 cm, 중심각 90°인 부채꼴이에요.', set: { csConceptMode: 'sector-' + kind, csConceptRead: 0, csConceptShow: false, csMeasure: '' }, step: area ? 1 : 2 },
              { at: 4.5, say: '90°는 한 바퀴 360°의 4분의 1이에요.', set: { csConceptRead: 1 } },
              { at: 9, say: area ? '넓이 $=\\pi\\times6^2\\times\\frac14=9\\pi$ cm².' : '호 $=2\\pi\\times6\\times\\frac14=3\\pi$ cm.', set: { csConceptRead: 2 } }
            ]
          },
          {
            length: 13, title: '중심각만 바꾸기',
            cues: [
              { at: 0, say: '반지름은 두고 중심각만 180°로 바꿔요.', set: { csConceptRead: 0 }, to: { csA: 180 }, dur: 4, ease: 'smooth', snap: 15 },
              { at: 4.5, say: '180°는 90°의 2배이고, 원의 절반이에요.', set: { csConceptRead: 1 } },
              { at: 9, say: area ? '넓이 $=\\pi\\times6^2\\times\\frac12=18\\pi$ cm².' : '호 $=2\\pi\\times6\\times\\frac12=6\\pi$ cm.', set: { csConceptRead: 2 } }
            ]
          },
          {
            length: 10, title: '앞뒤의 값을 비교하기',
            cues: [
              { at: 0, say: area ? '90°의 넓이 $9\\pi$, 180°의 넓이 $18\\pi$를 봐요.' : '90°의 호 $3\\pi$, 180°의 호 $6\\pi$를 봐요.', set: { csConceptRead: 3 } },
              { at: 5, say: area ? '$\\frac{18\\pi}{9\\pi}=2$, 넓이도 2배예요.' : '$\\frac{6\\pi}{3\\pi}=2$, 호의 길이도 2배예요.', set: { csConceptShow: true } }
            ]
          }
        ]
      };
    }),
    'z0-segment': {
      title: '활꼴의 경계는 어떤 선일까요?', label: '활꼴', tab: 'review',
      answer: '호와 현', answerText: '활꼴은 호와 현으로 둘러싸인 도형입니다.',
      summary: '호의 양 끝을 이은 현과 그 호 사이의 면이 활꼴입니다.',
      task: '중심각을 바꾸며 두 경계선과 점선 반지름을 구분해 보세요',
      chapters: [
        {
          length: 10, title: '굽은 경계 따라가기',
          start: { csR: 6, csS: 60 },
          cues: [
            { at: 0, say: '원 위의 두 점 A, B 사이의 경계를 봐요.', set: { csConceptMode: 'segment', csConceptRead: 0, csConceptShow: false }, step: 2 },
            { at: .2, to: { csS: 120 }, dur: 4, ease: 'smooth', snap: 15 },
            { at: 5, say: '원주를 따르는 굽은 선, 호 AB를 따라가요.', set: { csConceptRead: 1 } }
          ]
        },
        {
          length: 13, title: '곧은 경계와 구분하기',
          cues: [
            { at: 0, say: '호의 양 끝 A, B를 곧게 이으면 현 AB예요.', set: { csConceptRead: 2 }, step: 3 },
            { at: 5, say: '점선 반지름은 색칠한 면의 경계가 아니에요.', set: { csConceptRead: 3 } },
            { at: 9, say: '활꼴은 호와 현으로 둘러싸인 도형이에요.', set: { csConceptShow: true } }
          ]
        }
      ]
    }
  };
  window.APL_LESSONS = window.APL_LESSONS || {};
  window.APL_LESSONS['g7-circle-sector'] = Object.assign(window.APL_LESSONS['g7-circle-sector'] || {}, lessons);
}());
