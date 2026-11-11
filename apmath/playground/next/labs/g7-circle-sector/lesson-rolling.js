/* 원과 부채꼴: 굴리기 잔여 4장면. 원본 rolling.js question/steps/rl.base 근거.
 * rlT는 전체 회전 진행(0..1), rlRead는 계산을 마친 호 개수,
 * rlFocus는 설명 중인 회전(0부터, -1은 전체), rlAngle은 계산한 나머지 내각 공개.
 * 정답은 rlShow를 마지막 자막과 함께 열 때만 공개합니다.
 * 검산: tools/lessons.g7-circle-sector-rolling.test.mjs. 실제 모바일 검수는 별도 게이트입니다.
 */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = window.APL_LESSONS['g7-circle-sector'] = window.APL_LESSONS['g7-circle-sector'] || {};
  Object.assign(lessons, {
    'rl-rtri': {
      title: '점 B가 움직인 거리는?',
      answer: '$\\frac{13\\pi}{2}$', answerText: '$\\frac{13\\pi}{2}$ cm',
      summary: '회전 중심마다 반지름과 돌아간 각을 찾아 호의 길이를 더해요.',
      task: 'BC의 길이를 바꾸고 두 회전의 반지름을 다시 찾아보세요.',
      chapters: [
        { length: 9, title: '자취를 나누어 보기', start: { rlT: 0, rlRa: 3, rlRb: 60 }, cues: [
          { at: 0, say: '직각삼각형의 점 B가 그리는 길을 따라가요.', set: { rlShow: false, rlRead: 0, rlFocus: 0, rlAngle: false, rlAngles: 0 }, to: { rlT: 0.04 }, dur: 2, ease: 'smooth' },
          { at: 4.5, say: '회전 중심에서 점 B까지가 호의 반지름이에요.' }
        ] },
        { length: 12, title: '점 C를 중심으로', cues: [
          { at: 0, say: '점 C가 중심이면 반지름은 BC, 3 cm예요.', to: { rlT: 0.5 }, dur: 3.5, ease: 'smooth' },
          { at: 4, say: '직각을 넘어 돈 각은 $180°-90°=90°$예요.', set: { rlAngles: 1 } },
          { at: 8, say: '첫 호 $=2\\pi\\times3\\times\\frac{90}{360}=\\frac{3\\pi}{2}$ cm', set: { rlRead: 1 } }
        ] },
        { length: 13, title: '점 A를 중심으로', cues: [
          { at: 0, say: '이번에는 점 A가 중심. 반지름은 AB, 6 cm예요.', set: { rlFocus: 1 }, to: { rlT: 1 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '∠A는 $180°-90°-60°=30°$, 돌아간 각은 150°.', set: { rlAngle: true, rlAngles: 2 } },
          { at: 9, say: '둘째 호 $=2\\pi\\times6\\times\\frac{150}{360}=5\\pi$ cm', set: { rlRead: 2 } }
        ] },
        { length: 9, title: '두 길이의 합', cues: [
          { at: 0, say: '점 B가 움직인 거리는 두 호의 길이의 합이에요.', set: { rlFocus: -1 } },
          { at: 4.5, say: '$\\frac{3\\pi}{2}+5\\pi=\\frac{13\\pi}{2}$ cm', set: { rlShow: true } }
        ] }
      ]
    },
    'rl-turn45': {
      title: '점 A가 움직인 거리는?',
      answer: '$6\\pi$', answerText: '$6\\pi$ cm',
      summary: '∠ACB를 먼저 구하고, 직선까지 돌아간 각으로 호의 길이를 구해요.',
      task: 'AC와 ∠ABC를 바꾸고 회전 중심각을 다시 계산해 보세요.',
      chapters: [
        { length: 9, title: '회전 중심과 반지름', start: { rlT: 0, rlTd: 8, rlTb: 45 }, cues: [
          { at: 0, say: '점 C가 회전 중심이고 AC는 8 cm예요.', set: { rlShow: false, rlRead: 0, rlFocus: 0, rlAngle: false, rlAngles: 0 }, to: { rlT: 0.2 }, dur: 3, ease: 'smooth' },
          { at: 4.5, say: '점 A의 자취는 반지름 8 cm인 호예요.' }
        ] },
        { length: 10, title: '삼각형의 나머지 각', cues: [
          { at: 0, say: '∠A는 직각이고, 주어진 ∠B는 45°예요.' },
          { at: 5, say: '세 각의 합이 180°라 ∠C는 $180°-90°-45°=45°$.', set: { rlAngle: true } }
        ] },
        { length: 10, title: '직선까지 돌아간 각', cues: [
          { at: 0, say: '점 A가 직선 위의 A′에 닿을 때까지 돌려요.', to: { rlT: 1 }, dur: 4, ease: 'smooth' },
          { at: 5, say: '호의 중심각은 $180°-45°=135°$예요.', set: { rlAngles: 1 } }
        ] },
        { length: 9, title: '호의 길이 계산', cues: [
          { at: 0, say: '거리 $=2\\pi\\times8\\times\\frac{135}{360}$' },
          { at: 4.5, say: '점 A가 움직인 거리는 $6\\pi$ cm예요.', set: { rlShow: true, rlRead: 1, rlFocus: -1 } }
        ] }
      ]
    },
    'rl-semi': {
      title: '반원의 중심이 움직인 거리는?',
      answer: '$18\\pi$', answerText: '$18\\pi$ cm',
      summary: '중심 O의 자취는 호, 곧은 선, 호로 이어져요.',
      task: '반지름을 바꾸고 곧은 구간과 두 호의 길이를 각각 구해 보세요.',
      chapters: [
        { length: 12, title: '끝점 B를 중심으로', start: { rlT: 0, rlSR: 9 }, cues: [
          { at: 0, say: '반지름 9 cm인 반원의 중심 O를 따라가요.', set: { rlShow: false, rlRead: 0, rlFocus: 0, rlAngles: 0 }, to: { rlT: 1 / 3 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: 'B가 중심인 90° 회전이에요. 호의 반지름은 9 cm.', set: { rlAngles: 1 } },
          { at: 8.5, say: '첫 호 $=2\\pi\\times9\\times\\frac{90}{360}=\\frac{9\\pi}{2}$ cm', set: { rlRead: 1 } }
        ] },
        { length: 13, title: '둥근 부분으로 굴리기', cues: [
          { at: 0, say: '둥근 부분으로 굴러가면 O는 가로로 움직여요.', set: { rlFocus: 1 }, to: { rlT: 2 / 3 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '굴러간 반원호는 180°, 곧은 구간과 길이가 같아요.', set: { rlAngles: 2 } },
          { at: 9, say: '곧은 구간 $=2\\pi\\times9\\times\\frac{180}{360}=9\\pi$ cm', set: { rlRead: 2 } }
        ] },
        { length: 12, title: '끝점 A를 중심으로', cues: [
          { at: 0, say: '마지막은 점 A를 중심으로 다시 돌아요.', set: { rlFocus: 2 }, to: { rlT: 1 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '반지름 9 cm, 돌아간 각 90°인 호예요.', set: { rlAngles: 3 } },
          { at: 8.5, say: '마지막 호도 $\\frac{9\\pi}{2}$ cm예요.', set: { rlRead: 3 } }
        ] },
        { length: 9, title: '세 길이의 합', cues: [
          { at: 0, say: '호 + 곧은 선 + 호, 세 길이를 모두 더해요.', set: { rlFocus: -1 } },
          { at: 4.5, say: '$\\frac{9\\pi}{2}+9\\pi+\\frac{9\\pi}{2}=18\\pi$ cm', set: { rlShow: true } }
        ] }
      ]
    },
    'rl-square': {
      title: '점 C가 움직인 거리는?',
      answer: '$4\\pi$', answerText: '$4\\pi$ cm',
      summary: '회전의 중심이 된 점은 움직이지 않으므로 생긴 호만 더해요.',
      task: '추적하는 점이나 회전 횟수를 바꾸고 움직이지 않는 구간을 찾아보세요.',
      chapters: [
        { length: 12, title: '점 B를 중심으로', start: { rlT: 0, rlS: 4 }, cues: [
          { at: 0, say: '한 변 4 cm인 정사각형의 점 C를 따라가요.', set: { rlShow: false, rlRead: 0, rlFocus: 0, rlAngles: 0 }, to: { rlT: 1 / 3 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '점 B가 중심. 반지름 BC는 4 cm, 회전각은 90°.', set: { rlAngles: 1 } },
          { at: 8.5, say: '첫 호 $=2\\pi\\times4\\times\\frac{90}{360}=2\\pi$ cm', set: { rlRead: 1 } }
        ] },
        { length: 9, title: '점 C가 회전의 중심', cues: [
          { at: 0, say: '다음은 점 C 자체가 회전의 중심이에요.', set: { rlFocus: 1 }, to: { rlT: 2 / 3 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '이 회전에서 점 C는 제자리라 이동 거리가 0이에요.' }
        ] },
        { length: 12, title: '점 D를 중심으로', cues: [
          { at: 0, say: '마지막은 점 D가 중심. 반지름 CD는 4 cm예요.', set: { rlFocus: 2 }, to: { rlT: 1 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '사각형이 90° 돌아 호가 하나 더 생겨요.', set: { rlAngles: 3 } },
          { at: 8.5, say: '두 번째 호도 $2\\pi$ cm예요.', set: { rlRead: 2 } }
        ] },
        { length: 9, title: '움직인 길이만 더하기', cues: [
          { at: 0, say: '가운데 회전에서는 점 C가 움직이지 않았어요.', set: { rlFocus: -1 } },
          { at: 4.5, say: '$2\\pi+0+2\\pi=4\\pi$ cm', set: { rlShow: true } }
        ] }
      ]
    }
  });
})();
