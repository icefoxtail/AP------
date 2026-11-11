/* F02 잔여 3장면: lune13 / nc / ns. nc와 ns는 둘레·넓이를 따로 재생합니다.
 * 근거: f02.js의 question, steps, problem, 실제 params 기본값.
 * f02Split(조각 분리), f02Dims(반지름), f02Calc(계산한 조각), f02Final(최종 답)을
 * 설명 시점에 맞춰 열며, 삼각형 넓이가 곧 답인 lune13은 마지막까지 보류합니다.
 */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = window.APL_LESSONS['g7-circle-sector'] = window.APL_LESSONS['g7-circle-sector'] || {};
  const begin = () => ({ f02Read: false, f02Dims: false, f02Calc: 0, f02Final: false, f02Split: false });
  lessons.lune13 = {
    title: '두 초승달의 넓이는?', tab: 'review',
    answer: '$6$', answerText: '$6$ cm²',
    summary: '작은 두 반원과 큰 반원의 넓이가 같아 삼각형만 남아요.',
    task: '직각삼각형의 변을 바꾸고 반원 세 개의 넓이를 다시 비교해 보세요.',
    chapters: [
      { length: 12, title: '더할 조각과 뺄 조각', start: { f02_lune13_p: 4, f02_lune13_q: 3, f02_lune13_u: 0 }, cues: [
        { at: 0, say: '직각삼각형의 변은 AB 4 cm, CA 3 cm, BC 5 cm예요.', step: 1, part: 'tri', set: begin() },
        { at: 4.5, say: '세 변을 지름으로 하는 반원을 비교해요.', part: 'ab' },
        { at: 8.5, say: '작은 반원 둘 + 삼각형에서 큰 반원을 빼요.', part: null, set: { f02Split: true } }
      ] },
      { length: 12, title: '지름에서 반지름으로', cues: [
        { at: 0, say: '지름 4, 3, 5를 각각 2로 나누어 반지름을 구해요.' },
        { at: 5, say: '세 반원의 반지름은 $2$, $\\frac32$, $\\frac52$ cm예요.', set: { f02Dims: true } },
        { at: 9, say: '먼저 지름 AB인 반원의 넓이를 계산해요.', part: 'ab' }
      ] },
      { length: 14, title: '작은 두 반원의 넓이', cues: [
        { at: 0, say: '반원 AB $=\\pi\\times2^2\\times\\frac12=2\\pi$ cm²', step: 2, part: 'ab', set: { f02Read: true, f02Calc: 1 } },
        { at: 5, say: '반원 AC $=\\pi\\times(\\frac32)^2\\times\\frac12=\\frac{9\\pi}{8}$ cm²', part: 'ac', set: { f02Calc: 2 } },
        { at: 9.5, say: '큰 반원 BC의 넓이와 이 둘의 합을 비교해요.', part: 'bc' }
      ] },
      { length: 12, title: '반원끼리 더하고 빼기', cues: [
        { at: 0, say: '반원 BC $=\\pi\\times(\\frac52)^2\\times\\frac12=\\frac{25\\pi}{8}$ cm²', part: 'bc', set: { f02Calc: 3 } },
        { at: 5, say: '작은 두 반원의 합은 $2\\pi+\\frac{9\\pi}{8}=\\frac{25\\pi}{8}$예요.' },
        { at: 9, say: '큰 반원과 같으니 더하고 빼면 삼각형만 남아요.', step: 3, part: 'tri' }
      ] },
      { length: 12, title: '남은 삼각형의 넓이', cues: [
        { at: 0, say: '삼각형의 넓이는 $\\frac12\\times4\\times3$ cm²예요.', step: 4, part: 'tri', set: { f02Split: false } },
        { at: 5, say: '따라서 두 초승달의 넓이는 $6$ cm²예요.', set: { f02Final: true } }
      ] }
    ]
  };

  function dividedLesson(isCircle, area) {
    const id = isCircle ? 'nc' : 'ns', shape = isCircle ? '원' : '반원';
    const label = area ? '넓이' : '둘레', unit = area ? 'cm²' : 'cm';
    const answer = isCircle ? '24\\pi' : '12\\pi';
    const big = area ? isCircle ? '36\\pi' : '18\\pi' : isCircle ? '12\\pi' : '6\\pi';
    const small = isCircle ? '4\\pi' : '2\\pi', smallSum = isCircle ? '12\\pi' : '6\\pi';
    const half = isCircle ? '' : '\\times\\frac12';
    const expr = (r) => area ? `\\pi\\times${r}^2${half}` : `2\\pi\\times${r}${half}`;
    const valueName = area ? '넓이' : isCircle ? '둘레' : '호의 길이';
    const initial = { [`f02_${id}_R`]: 6, [`f02_${id}_n`]: 3, [`f02_${id}_u`]: 0 };
    return {
      label, title: `색칠한 부분의 ${label}는?`, tab: 'review',
      answer: `$${answer}$`, answerText: `$${answer}$ ${unit}`,
      summary: area ? `큰 ${shape}에서 같은 작은 ${shape} 세 개의 넓이를 빼요.` : `큰 ${shape}과 작은 ${shape} 세 개의 곡선을 모두 더해요.`,
      task: '나누는 개수를 바꾸고 둘레와 넓이가 각각 어떻게 달라지는지 살펴보세요.',
      chapters: [
        { length: area ? 11 : 12, title: area ? '어느 부분을 뺄까' : '경계를 따라 보기', start: initial, cues: [
          { at: 0, say: `큰 ${shape}의 반지름은 6 cm, 지름을 3등분했어요.`, step: area ? 4 : 1, part: 'big', set: begin() },
          { at: 4.5, say: area ? `큰 ${shape}에서 안쪽의 작은 ${shape} 세 개를 빼요.` : `큰 ${shape}과 작은 ${shape} 세 개의 곡선을 모두 더해요.`, part: null, set: { f02Split: true } },
          ...(area ? [] : [{ at: 8, say: '지름에 그은 곧은 선은 둘레에 넣지 않아요.' }])
        ] },
        { length: 13, title: '반지름을 확인하고 계산', cues: [
          { at: 0, say: '작은 반지름은 큰 반지름의 $\\frac13$, $6\\div3=2$ cm.', part: 's0', set: { f02Dims: true } },
          { at: 5, say: area
            ? isCircle ? '원의 넓이는 $\\pi r^2$, r은 반지름이에요.' : '반원 넓이는 $\\pi r^2\\times\\frac12$, r은 반지름이에요.'
            : isCircle ? '원 둘레는 $2\\pi r$, r은 반지름이에요.' : '원주의 반 $2\\pi r\\times\\frac12$, r은 반지름이에요.' },
          { at: 9, say: `큰 ${shape}의 ${valueName} $=${expr(6)}=${big}$ ${unit}`, step: area ? 5 : 2, part: 'big', set: { f02Read: true, f02Calc: 1 } }
        ] },
        { length: 12, title: `작은 ${shape} 세 개`, cues: [
          { at: 0, say: `작은 ${shape} 하나 $=${expr(2)}=${small}$ ${unit}`, part: 's0', set: { f02Calc: 2 } },
          { at: 4.5, say: `세 개의 ${valueName} 합은 $3\\times${small}=${smallSum}$ ${unit}`, part: null, set: { f02Calc: 3 } },
          { at: 8.5, say: area ? '안쪽의 작은 조각은 넓이에서 빼는 부분이에요.' : '작은 곡선들도 색칠한 부분의 경계예요.' }
        ] },
        { length: 10, title: area ? '파낸 부분을 빼면' : '모든 경계의 길이', cues: [
          { at: 0, say: area ? '큰 넓이에서 작은 세 조각의 넓이 합을 빼요.' : '큰 곡선과 작은 곡선들의 길이 합을 더해요.' },
          { at: 5, say: `$${big}${area ? '-' : '+'}${smallSum}=${answer}$ ${unit}`, step: area ? 6 : 3, set: { f02Final: true } }
        ] }
      ]
    };
  }
  lessons.nc = [dividedLesson(true, false), dividedLesson(true, true)];
  lessons.ns = [dividedLesson(false, false), dividedLesson(false, true)];
})();
