/* 정다각형 원본 모델·비율 막대·대각선·결합 그림을 사용하는 원클릭 해설. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const bank = window.APL_LESSONS['g7-polygons'] = window.APL_LESSONS['g7-polygons'] || {};
  const reset = goal => ({ pgShowAnswer: false, pgLessonGoal: goal, pgAngleReady: false, pgHalfReady: false, pgGapReady: false, pgCountReady: false });

  bank['p4-reg'] = [
    { title: '정다각형의 한 외각', label: '한 외각', tab: 'review', answer: '한 외각 = 60°',
      summary: '같은 크기의 외각 n개를 더하면 360°', task: '변의 수 n을 바꾸고 한 외각과 그 합을 비교해 보세요',
      chapters: [
        { length: 11, title: '정육각형의 같은 외각', start: { pgRn: 6, pgRt: 0 }, cues: [
          { at: 0, say: 'n은 변의 수예요. 정육각형의 n은 6이에요.', set: reset('external'), to: { pgRt: 0.5 }, dur: 5, ease: 'smooth' },
          { at: 6, say: '변을 연장해 만든 같은 크기의 외각을 모아요.' }
        ] },
        { length: 11, title: '외각을 한 바퀴로', cues: [
          { at: 0, say: '외각을 모두 모으면 한 바퀴 360°예요.', set: { pgCountReady: true }, to: { pgRt: 1 }, dur: 5, ease: 'smooth' },
          { at: 6, say: '이 한 바퀴를 같은 크기의 외각 6개로 나누어요.' }
        ] },
        { length: 10, title: '한 외각 계산하기', cues: [
          { at: 0, say: '한 외각은 외각의 합을 변의 수로 나눈 값이에요.' },
          { at: 5, say: '$360°÷6$이므로 한 외각 = 60°예요.', step: 1, set: { pgShowAnswer: true } }
        ] }
      ] },
    { title: '정다각형의 한 내각', label: '한 내각', tab: 'review', answer: '120°',
      summary: '한 내각 = 180° − 한 외각', task: '같은 꼭짓점의 내각과 외각을 더해 180°인지 확인해 보세요',
      chapters: [
        { length: 11, title: '구할 내각과 이웃 외각', start: { pgRn: 6, pgRt: 0 }, cues: [
          { at: 0, say: '정육각형에서 x는 구할 한 내각이에요.', set: reset('interior'), to: { pgRt: 1 }, dur: 5, ease: 'smooth' },
          { at: 6, say: '같은 크기의 외각 6개를 모으면 360°예요.', set: { pgCountReady: true } }
        ] },
        { length: 12, title: '외각에서 내각으로', cues: [
          { at: 0, say: '한 외각은 $360°÷6=60°$예요.', step: 1, set: { pgAngleReady: true } },
          { at: 6, say: '한 꼭짓점에서 내각과 외각의 합은 180°예요.', step: 2 }
        ] },
        { length: 10, title: '한 내각 계산하기', cues: [
          { at: 0, say: '180°에서 방금 구한 외각을 빼요.' },
          { at: 5, say: '한 내각 x는 $180°-60°=120°$예요.', step: 2, set: { pgShowAnswer: true } }
        ] }
      ] }
  ];

  bank['p4-ratio'] = [
    { title: '내각과 외각의 비로 변의 수', label: '변의 수', tab: 'review', answer: '정오각형', answerText: 'n = 5, 정오각형',
      summary: '비로 외각을 구한 뒤 360°를 외각으로 나눕니다', task: '비를 바꾸고 변의 수가 자연수인지 함께 확인해 보세요',
      chapters: [
        { length: 11, title: '비와 변의 수 구별하기', start: { pgQa: 3, pgQb: 2, pgTrace: 0 }, cues: [
          { at: 0, say: '내각과 외각의 비는 3 : 2, n은 구할 변의 수예요.', set: reset('count'), to: { pgTrace: 1 }, dur: 5, ease: 'smooth' },
          { at: 6, say: '내각과 외각을 더한 180°를 같은 크기 5칸으로 나누어요.' }
        ] },
        { length: 12, title: '외각이 차지하는 몫', cues: [
          { at: 0, say: '전체 5칸 중 외각은 2칸을 차지해요.', step: 1 },
          { at: 6, say: '한 외각은 $180°×2÷5=72°$예요.', set: { pgAngleReady: true } }
        ] },
        { length: 10, title: '외각으로 한 바퀴 채우기', cues: [
          { at: 0, say: '360°를 같은 외각으로 몇 번 채우는지 구해요.', step: 2 },
          { at: 5, say: '$n=360°÷72°=5$, 따라서 정오각형이에요.', step: 3, set: { pgShowAnswer: true } }
        ] }
      ] },
    { title: '비가 주어지면 항상 만들까', label: '존재 여부', tab: 'review', answer: '존재하지 않아요', answerText: 'n = 10/3: 정다각형은 존재하지 않아요',
      summary: '변의 수 n은 3 이상의 자연수여야 합니다', task: '조건을 만족하지 않는 비도 찾아 변의 수를 검산해 보세요',
      chapters: [
        { length: 11, title: '새 비의 뜻', start: { pgQa: 2, pgQb: 3, pgTrace: 0 }, cues: [
          { at: 0, say: '이번에는 내각과 외각의 비가 2 : 3이에요.', set: reset('exist'), to: { pgTrace: 1 }, dur: 5, ease: 'smooth' },
          { at: 6, say: '180°를 같은 크기의 5칸으로 나누어 생각해요.' }
        ] },
        { length: 12, title: '외각부터 구하기', cues: [
          { at: 0, say: '외각이 차지하는 몫은 전체의 5분의 3이에요.', step: 1 },
          { at: 6, say: '한 외각은 $180°×3÷5=108°$예요.', set: { pgAngleReady: true } }
        ] },
        { length: 10, title: '변의 수 조건 확인', cues: [
          { at: 0, say: '360°를 외각으로 나눈 n이 자연수인지 확인해요.', step: 2 },
          { at: 5, say: '$n=360÷108=10/3$은 자연수가 아니므로 존재하지 않아요.', step: 3, set: { pgShowAnswer: true } }
        ] }
      ] }
  ];

  bank['p4-diag'] = {
    title: '두 대각선이 이루는 교각', label: '교각', tab: 'review', answer: '60°',
    summary: '이등변삼각형의 밑각과 삼각형의 내각합을 씁니다', task: '꼭짓점이나 변의 수를 바꿔 같은 풀이 순서를 적용해 보세요',
    chapters: [
      { length: 11, title: '두 대각선과 교점', start: { pgDn: 6, pgDv: 0, pgTrace: 0 }, cues: [
        { at: 0, say: '정육각형의 두 대각선 AC와 BD의 교점이 P예요.', set: reset('cross'), to: { pgTrace: 1 }, dur: 5, ease: 'smooth' },
        { at: 6, say: 'x는 두 선분 PA와 PB 사이의 각 ∠APB예요.' }
      ] },
      { length: 12, title: '먼저 한 내각 구하기', cues: [
        { at: 0, say: '한 내각 ∠ABC는 $180°×4÷6=120°$예요.', step: 1, set: { pgAngleReady: true } },
        { at: 6, say: 'AB와 BC가 같아서 삼각형 ABC는 이등변삼각형이에요.' }
      ] },
      { length: 11, title: '두 보조각 구하기', cues: [
        { at: 0, say: '두 밑각은 각각 $(180°-120°)÷2=30°$예요.', step: 2, set: { pgHalfReady: true } },
        { at: 5.5, say: '∠CBD도 30°이므로 ∠ABD는 $120°-30°=90°$예요.', step: 3, set: { pgGapReady: true } }
      ] },
      { length: 10, title: '삼각형 ABP에서 마무리', cues: [
        { at: 0, say: '삼각형 ABP에서 이미 구한 두 각을 180°에서 빼요.' },
        { at: 5, say: '∠APB는 $180°-30°-90°=60°$예요.', step: 3, set: { pgShowAnswer: true } }
      ] }
    ]
  };
})();
