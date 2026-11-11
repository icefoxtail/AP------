/* ==========================================================================
   원과 부채꼴 · F06 잔여 6장면의 원클릭 해설
   근거: swept.js의 question·steps·sweepModel·insideModel·goatModel·spiralModel.
   첫 장의 start는 실제 enter 기본값이며, 치수 → 관계 → 조각 계산 → 합의 순서입니다.
   swRead/swMeasure/swInner/swShow, gtRead/gtCalc/gtInner/gtShow는 lesson 전용 공개 상태입니다.
   sw-inside의 swRead 1..7: 가운데 변·바깥 넓이·가운데 넓이·띠·구석 치수·모은 치수·구석 넓이.
   직접 해 보기의 탐구·정리·문제에는 이 상태가 영향을 주지 않습니다.
   ========================================================================== */
window.APL_LESSONS = window.APL_LESSONS || {};
Object.assign(window.APL_LESSONS['g7-circle-sector'] = window.APL_LESSONS['g7-circle-sector'] || {}, {
  'sw-rect': {
    title: '직사각형 밖에서 원이 지나간 넓이', label: '넓이',
    answer: '$24+4\\pi$', answerText: '$(24+4\\pi)$ cm²',
    summary: '변 옆의 직사각형과 모서리 부채꼴을 나누어 더해요.',
    task: '가로와 세로를 바꾸고 두 종류의 직사각형 넓이를 확인해 보세요.',
    chapters: [
      {
        length: 12, title: '지나간 자리를 나누기',
        start: { swW: 4, swH: 2, swR: 1, swT: 0 },
        cues: [
          { at: 0, say: '가로 4 cm, 세로 2 cm인 직사각형이에요.', set: { swRead: 0, swMeasure: 0, swInner: false, swShow: false }, to: { swT: 0.5 }, dur: 8, ease: 'smooth' },
          { at: 4, say: '반지름 1 cm인 원이 바깥을 한 바퀴 돌아요.' },
          { at: 8, say: '변 옆은 직사각형, 모서리는 부채꼴로 나눠요.', to: { swT: 0.6 }, dur: 3.5, ease: 'smooth' }
        ]
      },
      {
        length: 13, title: '띠의 폭과 조각의 넓이',
        cues: [
          { at: 0, say: '직사각형 띠의 폭은 원의 지름이에요.', set: { swMeasure: 1 } },
          { at: 4.5, say: '반지름 두 개이므로 폭은 $1+1=2$ cm예요.', set: { swMeasure: 2 } },
          { at: 9, say: '긴 변 쪽은 $4\\times2=8$, 짧은 쪽은 $2\\times2=4$ cm².', set: { swRead: 1, swMeasure: 0 } }
        ]
      },
      {
        length: 9, title: '직사각형 네 조각',
        cues: [
          { at: 0, say: '8 cm²인 조각과 4 cm²인 조각이 각각 두 개예요.' },
          { at: 4.5, say: '직사각형의 넓이 합은 $8\\times2+4\\times2=24$ cm².', set: { swRead: 2 } }
        ]
      },
      {
        length: 13, title: '모서리 부채꼴 모으기',
        cues: [
          { at: 0, say: '모서리 조각의 중심은 직사각형의 꼭짓점이에요.' },
          { at: 4.5, say: '끝까지는 반지름 두 개, 2 cm이고 중심각은 90°예요.', set: { swRead: 3 } },
          { at: 9, say: '네 각의 합은 $90°\\times4=360°$. 원으로 모아요.', set: { swRead: 4 }, to: { swT: 1 }, dur: 3.5, ease: 'smooth' }
        ]
      },
      {
        length: 10, title: '모은 원의 넓이',
        cues: [
          { at: 0, say: '반지름 2 cm인 원 하나로 모였어요.' },
          { at: 5, say: '모서리 부분의 넓이는 $\\pi\\times2^2=4\\pi$ cm²예요.', set: { swRead: 5 } }
        ]
      },
      {
        length: 10, title: '두 부분을 더하기',
        cues: [
          { at: 0, say: '직사각형의 넓이와 모은 원의 넓이를 더해요.' },
          { at: 5, say: '원이 지나간 넓이는 $24+4\\pi$ cm²예요.', set: { swShow: true } }
        ]
      }
    ]
  },
  'sw-tri': {
    title: '정삼각형 밖에서 원이 지나간 넓이', label: '넓이',
    answer: '$18+4\\pi$', answerText: '$(18+4\\pi)$ cm²',
    summary: '직사각형 세 개와 바깥각으로 생긴 부채꼴을 더해요.',
    task: '변의 길이와 반지름을 바꾸고 모서리 부채꼴의 각을 확인해 보세요.',
    chapters: [
      {
        length: 12, title: '직선 옆과 모서리',
        start: { swA: 3, swR: 1, swT: 0 },
        cues: [
          { at: 0, say: '한 변 3 cm인 정삼각형을 살펴봐요.', set: { swRead: 0, swMeasure: 0, swInner: false, swShow: false }, to: { swT: 0.5 }, dur: 8, ease: 'smooth' },
          { at: 4, say: '반지름 1 cm인 원이 바깥을 한 바퀴 돌아요.' },
          { at: 8, say: '지나간 자리를 직사각형과 부채꼴로 나눠요.', to: { swT: 0.6 }, dur: 3.5, ease: 'smooth' }
        ]
      },
      {
        length: 13, title: '직사각형 한 조각',
        cues: [
          { at: 0, say: '직사각형 띠의 폭은 원의 지름이에요.', set: { swMeasure: 1 } },
          { at: 4.5, say: '반지름 두 개이므로 폭은 $1+1=2$ cm예요.', set: { swMeasure: 2 } },
          { at: 9, say: '변의 길이와 폭을 곱하면 $3\\times2=6$ cm²예요.', set: { swRead: 1, swMeasure: 0 } }
        ]
      },
      {
        length: 9, title: '같은 직사각형 세 개',
        cues: [
          { at: 0, say: '세 변의 길이가 같아 직사각형 세 개도 같아요.' },
          { at: 4.5, say: '세 조각의 넓이 합은 $6\\times3=18$ cm²예요.', set: { swRead: 2 } }
        ]
      },
      {
        length: 13, title: '바깥각과 부채꼴',
        cues: [
          { at: 0, say: '정삼각형의 내각은 60°. 꼭짓점 바깥쪽을 봐요.', set: { swInner: true } },
          { at: 4.5, say: '반지름은 2 cm, 중심각은 $180°-60°=120°$예요.', set: { swRead: 3 } },
          { at: 9, say: '$120°\\times3=360°$이므로 원 하나로 모여요.', set: { swRead: 4 }, to: { swT: 1 }, dur: 3.5, ease: 'smooth' }
        ]
      },
      {
        length: 10, title: '부채꼴 세 개의 넓이',
        cues: [
          { at: 0, say: '모인 원의 반지름도 원래 지름인 2 cm예요.' },
          { at: 5, say: '그 넓이는 $\\pi\\times2^2=4\\pi$ cm²예요.', set: { swRead: 5 } }
        ]
      },
      {
        length: 10, title: '지나간 넓이 구하기',
        cues: [
          { at: 0, say: '직사각형 부분과 모서리 부분을 더해요.' },
          { at: 5, say: '원이 지나간 넓이는 $18+4\\pi$ cm²예요.', set: { swShow: true } }
        ]
      }
    ]
  },
  'sw-center': {
    title: '원의 중심이 움직인 거리', label: '거리',
    answer: '$12+2\\pi$', answerText: '$(12+2\\pi)$ cm',
    summary: '중심이 간 직선 길이와 모서리의 호 길이를 더해요.',
    task: '변과 반지름을 바꾸어 직선 부분과 호 부분이 어떻게 변하는지 보세요.',
    chapters: [
      {
        length: 12, title: '중심이 간 길 보기',
        start: { swA: 3, swR: 1, swT: 0 },
        cues: [
          { at: 0, say: '한 변 3 cm인 정사각형 바깥을 원이 돌아요.', set: { swRead: 0, swMeasure: 0, swInner: false, swShow: false }, to: { swT: 0.5 }, dur: 8, ease: 'smooth' },
          { at: 4, say: '반지름은 1 cm. 원의 중심이 간 길을 보세요.' },
          { at: 8, say: '중심이 간 길을 직선과 호로 나누어 구해요.', to: { swT: 0.6 }, dur: 3.5, ease: 'smooth' }
        ]
      },
      {
        length: 10, title: '직선 부분의 길이',
        cues: [
          { at: 0, say: '직선 네 개는 정사각형의 변과 같은 3 cm예요.', set: { swRead: 1 } },
          { at: 5, say: '직선 길이의 합은 $3\\times4=12$ cm예요.', set: { swRead: 2 } }
        ]
      },
      {
        length: 10, title: '모서리에서 그리는 호',
        cues: [
          { at: 0, say: '각 꼭짓점 중심으로 반지름 1 cm, 90°인 호를 그려요.', set: { swRead: 3 } },
          { at: 5, say: '$90°\\times4=360°$. 네 호를 모으면 원의 둘레예요.', set: { swRead: 4 }, to: { swT: 1 }, dur: 4.5, ease: 'smooth' }
        ]
      },
      {
        length: 10, title: '호의 길이 합',
        cues: [
          { at: 0, say: '반지름 1 cm인 원의 둘레를 구하면 돼요.' },
          { at: 5, say: '네 호의 길이 합은 $2\\pi\\times1=2\\pi$ cm예요.', set: { swRead: 5 } }
        ]
      },
      {
        length: 10, title: '중심이 간 거리',
        cues: [
          { at: 0, say: '직선 부분과 호 부분의 길이를 더해요.' },
          { at: 5, say: '원의 중심이 움직인 거리는 $12+2\\pi$ cm예요.', set: { swShow: true } }
        ]
      }
    ]
  },
  'sw-inside': {
    title: '정사각형 안쪽에서 원이 지나간 넓이', label: '넓이',
    answer: '$28+\\pi$', answerText: '$(28+\\pi)$ cm²',
    summary: '전체에서 가운데와 모서리의 못 가는 곳을 차례로 빼요.',
    task: '정사각형과 원의 크기를 바꾸고 못 가는 가운데와 구석을 찾아보세요.',
    chapters: [
      {
        length: 12, title: '원이 닿지 못하는 곳',
        start: { swI: 6, swR: 1, swT: 0 },
        cues: [
          { at: 0, say: '한 변 6 cm인 정사각형 안쪽을 원이 돌아요.', set: { swRead: 0, swMeasure: 0, swInner: false, swShow: false }, to: { swT: 0.5 }, dur: 8, ease: 'smooth' },
          { at: 4, say: '반지름은 1 cm. 가운데와 구석에는 못 가는 곳이 있어요.' },
          { at: 8, say: '전체에서 이 두 종류의 빈곳을 차례로 빼요.', to: { swT: 0.6 }, dur: 3.5, ease: 'smooth' }
        ]
      },
      {
        length: 13, title: '벽에서 닿는 폭',
        cues: [
          { at: 0, say: '벽에서 원의 반대쪽 끝까지는 지름만큼이에요.', set: { swMeasure: 1 } },
          { at: 4.5, say: '반지름 두 개이므로 폭은 $1+1=2$ cm예요.', set: { swMeasure: 2 } },
          { at: 9, say: '가운데 정사각형의 한 변은 $6-2-2=2$ cm예요.', set: { swRead: 1 } }
        ]
      },
      {
        length: 13, title: '먼저 가운데 빼기',
        cues: [
          { at: 0, say: '바깥 정사각형의 넓이는 $6^2=36$ cm²예요.', set: { swRead: 2 } },
          { at: 4.5, say: '가운데 빈 정사각형의 넓이는 $2^2=4$ cm²예요.', set: { swRead: 3 } },
          { at: 9, say: '바깥에서 가운데를 빼면 $36-4=32$ cm²예요.', set: { swRead: 4 } }
        ]
      },
      {
        length: 10, title: '모서리에 남은 빈곳',
        cues: [
          { at: 0, say: '모서리의 빈곳도 빼야 해요. 같은 모양 네 조각이에요.' },
          { at: 5, say: '각각 $1\\times1$ 정사각형에서 반지름 1 cm, 90° 부채꼴을 빼요.', set: { swRead: 5, swMeasure: 0 } }
        ]
      },
      {
        length: 13, title: '네 구석을 모아 계산',
        cues: [
          { at: 0, say: '구석 조각을 모으면 정사각형과 원으로 비교할 수 있어요.', to: { swT: 1 }, dur: 4.5, ease: 'smooth' },
          { at: 4.5, say: '한 변 2 cm인 정사각형에서 반지름 1 cm인 원을 빼요.', set: { swRead: 6 } },
          { at: 9, say: '구석의 넓이 합은 $2^2-\\pi\\times1^2=4-\\pi$ cm²예요.', set: { swRead: 7 } }
        ]
      },
      {
        length: 10, title: '지나간 자리만 남기기',
        cues: [
          { at: 0, say: '가운데를 뺀 띠에서 구석의 빈곳도 빼요.' },
          { at: 5, say: '넓이는 $32-(4-\\pi)=28+\\pi$ cm²예요.', set: { swShow: true } }
        ]
      }
    ]
  },
  'gt-hex': {
    title: '정육각형 우리 밖의 영역', label: '넓이',
    answer: '$57\\pi$', answerText: '$57\\pi$ m²',
    summary: '꺾인 뒤 남은 끈과 바깥쪽 각으로 부채꼴을 구해요.',
    task: '우리의 한 변과 끈의 길이를 바꾸고 세 부채꼴의 반지름을 비교해 보세요.',
    chapters: [
      {
        length: 9, title: '끈과 우리 살펴보기',
        start: { gtH: 6, gtL: 9, gtT: 0 },
        cues: [
          { at: 0, say: '한 변 6 m인 정육각형 우리에 9 m 끈으로 묶였어요.', set: { gtRead: 0, gtCalc: 0, gtInner: false, gtShow: false }, to: { gtT: 0.03 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '정육각형의 한 내각은 120°. 끈이 꺾이는 곳을 보세요.', set: { gtInner: true } }
        ]
      },
      {
        length: 10, title: 'F를 돌아가는 끈',
        cues: [
          { at: 0, say: 'F를 돌면 한 변을 따라간 만큼 끈이 짧아져요.', to: { gtT: 0.8 / 6 }, dur: 4.5, ease: 'smooth' },
          { at: 5, say: 'F에서 남은 끈은 $9-6=3$ m, 각은 $180°-120°=60°$.', set: { gtRead: 1 } }
        ]
      },
      {
        length: 10, title: 'A를 중심으로 도는 영역',
        cues: [
          { at: 0, say: 'A에서는 끈이 꺾이지 않아 전체 길이가 반지름이에요.', to: { gtT: 0.8 * 5 / 6 }, dur: 4.5, ease: 'smooth' },
          { at: 5, say: '반지름은 9 m, 중심각은 $360°-120°=240°$예요.', set: { gtRead: 2 } }
        ]
      },
      {
        length: 10, title: 'B를 돌아가는 영역',
        cues: [
          { at: 0, say: '다른 모서리 B에서도 끈이 한 변을 따라 꺾여요.', to: { gtT: 1 }, dur: 4.5, ease: 'smooth' },
          { at: 5, say: '남은 끈은 $9-6=3$ m, 중심각도 $180°-120°=60°$.', set: { gtRead: 3 } }
        ]
      },
      {
        length: 13, title: '부채꼴별 넓이',
        cues: [
          { at: 0, say: 'F의 넓이는 $\\pi\\times3^2\\times\\frac{60}{360}=\\frac{3\\pi}{2}$ m²예요.', set: { gtCalc: 1 } },
          { at: 4.5, say: 'A의 넓이는 $\\pi\\times9^2\\times\\frac{240}{360}=54\\pi$ m²예요.', set: { gtCalc: 2 } },
          { at: 9, say: 'B도 반지름과 각이 같아 넓이는 $\\frac{3\\pi}{2}$ m²예요.', set: { gtCalc: 3 } }
        ]
      },
      {
        length: 10, title: '세 영역의 넓이 합',
        cues: [
          { at: 0, say: '서로 겹치지 않는 세 부채꼴의 넓이를 더해요.' },
          { at: 5, say: '넓이는 $\\frac{3\\pi}{2}+54\\pi+\\frac{3\\pi}{2}=57\\pi$ m²예요.', set: { gtShow: true } }
        ]
      }
    ]
  },
  'gt-spiral': {
    title: '이어지는 세 부채꼴의 넓이', label: '넓이',
    answer: '$21\\pi$', answerText: '$21\\pi$ cm²',
    summary: '한 변씩 늘어나는 반지름과 같은 바깥각을 이용해요.',
    task: '정육각형의 변과 부채꼴 개수를 바꾸고 반지름이 커지는 규칙을 확인해 보세요.',
    chapters: [
      {
        length: 12, title: 'F를 중심으로 그린 호',
        start: { gtP: 3, gtK: 3, gtT: 0 },
        cues: [
          { at: 0, say: '한 변 3 cm인 정육각형의 꼭짓점 F에서 시작해요.', set: { gtRead: 0, gtCalc: 0, gtShow: false }, to: { gtT: 0.8 / 3 }, dur: 4.5, ease: 'smooth' },
          { at: 5, say: '반지름은 한 변인 3 cm, 바깥각은 $360°\\div6=60°$.', set: { gtRead: 1 } }
        ]
      },
      {
        length: 10, title: 'E로 바뀌는 중심',
        cues: [
          { at: 0, say: '다음 중심은 E예요. 반지름이 한 변만큼 늘어나요.', to: { gtT: 0.8 * 2 / 3 }, dur: 4.5, ease: 'smooth' },
          { at: 5, say: '반지름은 $3+3=6$ cm, 중심각은 같은 60°예요.', set: { gtRead: 2 } }
        ]
      },
      {
        length: 10, title: 'D를 중심으로 그린 호',
        cues: [
          { at: 0, say: '중심이 D로 바뀌면 반지름이 다시 한 변만큼 늘어요.', to: { gtT: 1 }, dur: 4.5, ease: 'smooth' },
          { at: 5, say: '반지름은 $6+3=9$ cm, 중심각은 60°예요.', set: { gtRead: 3 } }
        ]
      },
      {
        length: 13, title: '같은 각의 부채꼴 계산',
        cues: [
          { at: 0, say: 'F의 넓이는 $\\pi\\times3^2\\times\\frac{60}{360}=\\frac{3\\pi}{2}$ cm²예요.', set: { gtCalc: 1 } },
          { at: 4.5, say: 'E의 넓이는 $\\pi\\times6^2\\times\\frac{60}{360}=6\\pi$ cm²예요.', set: { gtCalc: 2 } },
          { at: 9, say: 'D의 넓이는 $\\pi\\times9^2\\times\\frac{60}{360}=\\frac{27\\pi}{2}$ cm²예요.', set: { gtCalc: 3 } }
        ]
      },
      {
        length: 10, title: '세 부채꼴 더하기',
        cues: [
          { at: 0, say: '세 부채꼴은 겹치지 않으므로 넓이를 모두 더해요.' },
          { at: 5, say: '넓이는 $\\frac{3\\pi}{2}+6\\pi+\\frac{27\\pi}{2}=21\\pi$ cm²예요.', set: { gtShow: true } }
        ]
      }
    ]
  }
});
