/* 피타고라스 수·삼각형 판별·넓이 응용: 원본문제의 수치와 유형을 고정한 해설. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = window.APL_LESSONS['g8-pythagoras'] = window.APL_LESSONS['g8-pythagoras'] || {};
  const ch = (title, cues, length = 12) => ({ title, length, cues });
  function make(title, label, answer, chapters, options = {}) {
    chapters[0].start = { pyBT: 0, pyK: 1, pyF: 0, pyQ1: 3, pyQ2: 4, pyHa: 8, pyHb: 6, pyHang: 90,
      pyJa: 5, pyJb: 6, pyJc: 7, pyRp: 4, pyRq: 5, pyRx: 7, pyTa: 12, pyTb: 9, pyT1: 40, pyT2: 55,
      pyS1: 20, pyS2: 15, pyRw: 12, pyRh: 16, pyIa: 6, pyIb: 8, pyHy: 3, ...(options.start || {}), ...(chapters[0].start || {}) };
    const first = chapters[0].cues[0];
    first.set = { pyShowAnswer: false, pyCalculationReady: false, pyLessonProblem: options.problem !== false,
      pyQ: options.q || {}, pySeed: 0, pyPick: null, pyBFirstReady: false, pyBSecondReady: false,
      pyBRangeReady: false, pyBBarReady: false, pyAsk: 'c', pyUnk: 'c', pyShade: 'all', pyKind: 0,
      ...(options.set || {}), ...(first.set || {}) };
    if (!first.to) Object.assign(first, { to: { pyBT: 1 }, dur: 4 });
    return { title, label, tab: 'review', answer, answerText: answer, summary: '직각의 맞은편과 주어진 조건을 확인하고 제곱끼리 계산해요', task: '직접 해 보기에서 다른 수치와 비교해 보세요', chapters };
  }
  function familyConcept(family, index = 0) {
    const [a0, b0, c0] = family, k = 2, a = a0 * k, b = b0 * k, c = c0 * k;
    return make(`(${family.join(', ')})의 배수`, family[0] === 8 ? '8·15형' : family[0] === 7 ? '7·24형' : '배수 원리', '세 변을 같은 k배 해도 직각삼각형이에요', [
      ch('변의 이름과 배수', [{ at: 0, say: `a=${a}, b=${b}, c=${c}은 원래 세 변의 2배예요.` }, { at: 6, say: 'c는 직각 C의 맞은편인 가장 긴 변이에요.', step: 1 }]),
      ch('넓이인 제곱끼리 비교', [{ at: 0, say: '길이를 2배 하면 각 정사각형의 넓이는 4배예요.', step: 2 }, { at: 6, say: `a²=${a * a}, b²=${b * b}, c²=${c * c}이에요.`, set: { pyCalculationReady: true } }]),
      ch('같은 배수의 관계', [{ at: 0, say: '(ka)²+(kb)²=k²(a²+b²)로 묶어 보세요.' }, { at: 6, say: `이를 (kc)²로 쓸 수 있어, ${k}배도 직각삼각형이에요.`, set: { pyShowAnswer: true }, step: 5 }])
    ], { problem: false, start: { pyF: index, pyK: k }, q: { pyF: index, pyK: k, pyAsk: 'c' } });
  }
  function familyProblem(family, ask, index = 0) {
    const [a0, b0, c0] = family, k = 2, v = { a: a0 * k, b: b0 * k, c: c0 * k }, ans = v[ask];
    const known = ['a', 'b', 'c'].filter(key => key !== ask), other = ask === 'a' ? 'b' : 'a';
    return make(`피타고라스 수로 ${ask === 'c' ? '빗변' : '직각변'} 구하기`, ask === 'c' ? '빗변' : '직각변', `x=${ans}`, [
      ch('기호와 주어진 변', [{ at: 0, say: `${known.map(key => `${key}=${v[key]}`).join(', ')}이고 구할 길이는 x예요.` }, { at: 6, say: `직각 C의 맞은편 c가 빗변, x는 ${ask === 'c' ? '빗변' : '직각변'}이에요.`, step: 1 }]),
      ch('더할지 뺄지 정하기', [{ at: 0, say: ask === 'c' ? '빗변의 제곱은 두 직각변의 제곱을 더해요.' : '빗변의 제곱에서 알려진 직각변의 제곱을 빼요.', step: 2 }, { at: 6, say: ask === 'c' ? `x²=${v.a}²+${v.b}²=${ans * ans}이에요.` : `x²=${v.c}²−${v[other]}²=${ans * ans}이에요.`, set: { pyCalculationReady: true } }]),
      ch('제곱값에서 길이 확인', [{ at: 0, say: `기본 수 (${family.join(', ')})의 두 알려진 변도 2배예요.` }, { at: 6, say: `양수 ${ans}를 제곱하면 ${ans * ans}이므로 x=${ans}이에요.`, set: { pyShowAnswer: true }, step: 5 }])
    ], { start: { pyF: index, pyK: k }, q: { pyF: index, pyK: k, pyAsk: ask }, set: { pyAsk: ask } });
  }
  Object.assign(lessons, {
    'py3-345': [familyConcept([3, 4, 5]), familyProblem([3, 4, 5], 'c'), familyProblem([3, 4, 5], 'b')],
    'py3-51213': [familyConcept([5, 12, 13]), familyProblem([5, 12, 13], 'c'), familyProblem([5, 12, 13], 'a')]
  });
})();
