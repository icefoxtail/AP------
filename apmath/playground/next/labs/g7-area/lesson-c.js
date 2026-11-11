/* 원본 사다리꼴·모눈·길의 조각을 사용해 넓이를 비교하는 원클릭 해설. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const bank = window.APL_LESSONS['g7-area'] = window.APL_LESSONS['g7-area'] || {};
  const reset = (goal, extra) => ({ arShowAnswer: false, arLessonGoal: goal, arBaseReady: false, arOuterReady: false, arOneReady: false, arTwoReady: false, arThreeReady: false, arSumReady: false, arWidthReady: false, arHeightReady: false, ...extra });

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
})();
