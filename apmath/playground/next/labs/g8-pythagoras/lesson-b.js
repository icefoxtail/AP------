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
      pyQ: options.q || {}, pySeed: 0, pyBFirstReady: false, pyBSecondReady: false,
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
  function trapLesson(kind) {
    const q = { pyQ1: 3, pyQ2: 4, pyKind: kind };
    if (kind === 0) return make('빗변을 정하지 않았을 때 두 경우', '두 경우', '가능한 x²의 값들의 합은 32', [
      ch('주어진 두 변과 구할 값', [{ at: 0, say: '두 변은 3, 4이고 나머지는 x예요.' }, { at: 6, say: '가장 긴 변이 누구인지 정하지 않아 두 경우를 나눠요.', step: 1 }]),
      ch('x가 빗변인 경우', [{ at: 0, say: 'x가 빗변이면 나머지 3, 4가 직각변이에요.', step: 2 }, { at: 6, say: 'x²=3²+4²=25를 첫 번째 값으로 기록해요.', set: { pyBFirstReady: true } }]),
      ch('4가 빗변인 경우', [{ at: 0, say: '4가 빗변이면 x²+3²=4²로 놓아요.', step: 3 }, { at: 6, say: 'x²=16−9=7을 두 번째 값으로 기록해요.', set: { pyBSecondReady: true } }]),
      ch('가능한 제곱값의 합', [{ at: 0, say: '3은 이미 4보다 짧아서 빗변이 될 수 없어요.' }, { at: 6, say: '두 경우를 모두 더하면 25+7=32가 정답이에요.', set: { pyShowAnswer: true }, step: 4 }])
    ], { q });
    const hyp = kind === 1 ? '4' : 'x', answer = kind === 1 ? 7 : 25;
    return make(`${hyp}가 빗변일 때 x²`, kind === 1 ? '4가 빗변' : 'x가 빗변', `x²=${answer}`, [
      ch('빗변 조건부터 읽기', [{ at: 0, say: `세 변은 3, 4, x이고 가장 긴 변은 ${hyp}예요.` }, { at: 6, say: '구할 것은 길이 x가 아니라 제곱한 값 x²예요.', step: 1 }]),
      ch('직각을 기준으로 식 세우기', [{ at: 0, say: kind === 1 ? '빗변 4의 제곱은 두 직각변 제곱의 합이에요.' : '직각변 3, 4의 제곱을 더해 빗변의 제곱을 구해요.', step: 2 }, { at: 6, say: kind === 1 ? 'x²+3²=4²이므로 x²=16−9로 계산해요.' : 'x²=3²+4²이므로 9+16으로 계산해요.' }]),
      ch('물어본 제곱값으로 답하기', [{ at: 0, say: `이 문항은 빗변이 ${hyp}라는 한 경우만 물었어요.` }, { at: 6, say: `계산한 x²=${answer}이 정답이에요.`, set: { pyShowAnswer: true }, step: 4 }])
    ], { q });
  }
  function hingeConcept() {
    return make('경첩 각도와 맞은편 변의 제곱', '경첩 원리', '∠C가 예각·직각·둔각이면 c²은 a²+b²보다 작음·같음·큼', [
      ch('기호와 움직이는 각', [{ at: 0, say: 'a=BC=8, b=CA=6은 고정하고 ∠C만 움직여요.', to: { pyBT: 1, pyHang: 90 }, dur: 4 }, { at: 6, say: 'c=AB는 ∠C의 맞은편 변이에요.', step: 1 }]),
      ch('비교할 두 막대', [{ at: 0, say: '위 막대는 a²+b², 아래 노란 막대는 c²예요.', set: { pyBBarReady: true } }, { at: 6, say: '고정한 두 변에서 a²+b²=64+36=100이에요.', set: { pyCalculationReady: true }, step: 2 }]),
      ch('각만 바꾸며 비교하기', [{ at: 0, say: '경첩을 더 벌려 맞은편 변과 아래 막대를 살펴봐요.', to: { pyHang: 120 }, dur: 4 }, { at: 6, say: '다시 좁혀도 위 막대의 값은 그대로예요.', to: { pyHang: 60 }, dur: 4 }]),
      ch('지정된 각과 제곱의 관계', [{ at: 0, say: 'c²이 a²+b²보다 작으면 ∠C가 예각이에요.', set: { pyShowAnswer: true } }, { at: 4, say: '두 값이 같을 때 ∠C가 직각이에요.' }, { at: 8, say: 'c²이 a²+b²보다 크면 ∠C가 둔각이에요.', step: 3 }])
    ], { problem: false, start: { pyHang: 60 }, q: { pyHa: 8, pyHb: 6, pyKind: 0 } });
  }
  function hingeProblem(kind) {
    const c2 = kind ? 148 : 25, th = Math.acos((100 - c2) / 96) * 180 / Math.PI, answer = kind ? '둔각' : '예각';
    return make('세 변 정보로 지정된 ∠C 판단', kind ? '제곱값 조건' : '길이 조건', `∠C는 ${answer}`, [
      ch('구할 각의 맞은편 확인', [{ at: 0, say: kind ? 'BC=8, CA=6, AB²=148이 주어졌어요.' : 'BC=8, CA=6, AB=5가 주어졌어요.' }, { at: 6, say: '판별할 ∠C의 맞은편은 AB예요.', step: 1 }]),
      ch('맞은편 제곱과 두 변 제곱의 합', [{ at: 0, say: 'AB²을 BC²+CA²과 비교하는 전략을 써요.', set: { pyBBarReady: true } }, { at: 6, say: `BC²+CA²=100, AB²=${c2}이에요.`, set: { pyCalculationReady: true }, step: 2 }]),
      ch('지정된 각에 결론 적용', [{ at: 0, say: kind ? '148>100이므로 맞은편 변의 제곱이 더 커요.' : '25<100이므로 맞은편 변의 제곱이 더 작아요.' }, { at: 6, say: `삼각형 전체가 아니라, 물어본 ∠C는 ${answer}이에요.`, set: { pyShowAnswer: true }, step: 3 }])
    ], { q: { pyHa: 8, pyHb: 6, pyHang: th, pyKind: kind }, start: { pyHang: th }, set: { pyKind: kind } });
  }
  function judgeLesson(obtuse) {
    const a = obtuse ? 4 : 5, b = obtuse ? 5 : 6, c = 7, sum = a * a + b * b, answer = obtuse ? '둔각삼각형' : '예각삼각형';
    return make(`세 변 ${a}, ${b}, ${c}의 삼각형 판별`, '세 변 판별', answer, [
      ch('삼각형과 가장 긴 변 확인', [{ at: 0, say: `세 변은 ${a}, ${b}, 7이고 가장 긴 변은 7이에요.` }, { at: 6, say: `${a}+${b}>7이라 삼각형은 만들 수 있어요.`, step: 1 }]),
      ch('가장 큰 각을 제곱으로 판단', [{ at: 0, say: '가장 긴 변의 맞은편이 가장 큰 각이에요.' }, { at: 6, say: `7²=49와 ${a}²+${b}²=${sum}을 비교해요.`, set: { pyCalculationReady: true }, step: 2 }]),
      ch('삼각형의 종류 결론', [{ at: 0, say: obtuse ? '49>41이므로 가장 큰 각이 직각보다 커요.' : '49<61이므로 가장 큰 각도 직각보다 작아요.' }, { at: 6, say: `따라서 이 삼각형은 ${answer}이에요.`, set: { pyShowAnswer: true }, step: 3 }])
    ], { q: { pyJa: a, pyJb: b, pyJc: c }, start: { pyJa: a, pyJb: b, pyJc: c } });
  }
  function rangeLesson(acute, count) {
    const p = acute ? 6 : 4, q = acute ? 8 : 5, answer = acute ? '6, 7, 8, 9' : '2, 7, 8', n = acute ? 4 : 3, type = acute ? '예각' : '둔각';
    return make(`${type}삼각형이 되는 자연수 ${count ? '개수' : '값'}`, count ? '개수 구하기' : '값 찾기', count ? `${n}개` : `x=${answer}`, [
      ch('주어진 변과 구할 자연수', [{ at: 0, say: `두 변은 ${p}, ${q}이고 나머지 변 x는 자연수예요.` }, { at: 6, say: '먼저 삼각형 조건을 구하고 가장 긴 변을 나눠 봐요.', step: 1 }]),
      ch('삼각형이 되는 범위', [{ at: 0, say: `${q}−${p} < x < ${q}+${p}가 삼각형 조건이에요.` }, { at: 6, say: `가능한 자연수는 ${q - p + 1}부터 ${q + p - 1}까지예요.`, set: { pyBRangeReady: true } }]),
      ch('x가 가장 긴 경우', [{ at: 0, say: `x>${q}일 때 x²${acute ? '<' : '>'}${p}²+${q}²이어야 ${type}이에요.`, step: 2 }, { at: 6, say: acute ? '즉 x²<100이며, 9²=81과 10²=100을 비교해요.' : '즉 x²>41이며, 6²=36과 7²=49를 비교해요.' }]),
      ch(`${q}가 가장 긴 경우`, [{ at: 0, say: `x≤${q}일 때 ${q}²${acute ? '<' : '>'}${p}²+x²로 비교해요.`, step: 3 }, { at: 6, say: acute ? 'x²>28이므로 5²=25, 6²=36과 비교해요.' : 'x²<9이며, x=3은 등호라 직각삼각형이에요.' }]),
      ch('두 경우를 합쳐 답하기', [{ at: 0, say: `범위 안에서 조건을 만족하는 x는 ${answer}예요.`, set: { pyShowAnswer: true } }, { at: 6, say: count ? `따라서 물어본 자연수 x의 개수는 ${n}개예요.` : `빠짐없이 찾은 값은 ${answer}, 모두 ${n}개예요.`, step: 4 }])
    ], { problem: count, q: { pyRp: p, pyRq: q, pyRx: q, pyAsk: acute ? 'acute' : 'obtuse' }, start: { pyRp: p, pyRq: q, pyRx: q }, set: { pyAsk: acute ? 'acute' : 'obtuse' } });
  }
  function treeLesson(abOnly) {
    const first = ch('길이와 색칠한 정사각형', [{ at: 0, say: 'AB=12, AC=9이고 가지의 꼭짓점도 직각이에요.', to: { pyT1: 55 }, dur: 4 }, { at: 6, say: abOnly ? 'AB 쪽에 색칠한 두 정사각형의 넓이를 더해요.' : '양쪽에 색칠한 네 정사각형의 넓이를 더해요.', step: 1 }]);
    const relation = ch('가지의 정사각형 두 개씩 묶기', [{ at: 0, say: '가지의 빗변은 큰 정사각형의 바깥 변이에요.', to: { pyT1: 30, pyT2: 40 }, dur: 4 }, { at: 6, say: '두 작은 넓이의 합은 그 빗변 위 정사각형의 넓이예요.', step: 2 }]);
    const chapters = abOnly ? [first, relation,
      ch('색칠한 쪽만 계산', [{ at: 0, say: 'AB 쪽 합은 AB²이고, AC 쪽은 색칠하지 않았어요.' }, { at: 6, say: '따라서 색칠한 두 넓이의 합은 12²=144예요.', set: { pyShowAnswer: true }, step: 4 }])
    ] : [first, relation,
      ch('각 가지의 중간 넓이', [{ at: 0, say: 'AB 쪽 두 넓이의 합은 AB²=12²=144예요.', set: { pyBFirstReady: true }, step: 3 }, { at: 6, say: 'AC 쪽 두 넓이의 합은 AC²=9²=81이에요.', set: { pyBSecondReady: true } }]),
      ch('네 정사각형의 합', [{ at: 0, say: '가지의 각도가 바뀌어도 두 합은 변하지 않아요.' }, { at: 6, say: '네 넓이를 모두 더하면 144+81=225예요.', set: { pyShowAnswer: true }, step: 4 }])
    ];
    return make('피타고라스 나무의 색칠한 넓이', abOnly ? '한쪽 두 개' : '양쪽 네 개', abOnly ? '넓이의 합 144' : '넓이의 합 225', chapters,
      { q: { pyTa: 12, pyTb: 9, pyShade: abOnly ? 'ab' : 'all' }, set: { pyShade: abOnly ? 'ab' : 'all' } });
  }
  function squareAreaLesson(subtract) {
    return make('주어진 정사각형 넓이끼리 계산', subtract ? '넓이 빼기' : '넓이 더하기', `x=${subtract ? 48 : 97}`, [
      ch('길이가 아니라 넓이인 조건', [{ at: 0, say: subtract ? '빗변 위 넓이는 97, 한 직각변 위 넓이는 49예요.' : '두 직각변 위 정사각형의 넓이가 49, 48이에요.' }, { at: 6, say: '숫자가 이미 넓이이므로 다시 제곱하지 않아요.', step: 1 }]),
      ch('직각 표시로 더할지 뺄지 선택', [{ at: 0, say: '직각 C의 맞은편 AB 위가 빗변의 정사각형이에요.', step: 2 }, { at: 6, say: subtract ? '49+x=97이므로 x=97−49로 빼요.' : '빗변 위 넓이 x는 49+48로 더해요.', step: 3 }]),
      ch('물어본 넓이의 값', [{ at: 0, say: subtract ? '모르는 것은 작은 쪽 넓이, 전체에서 아는 넓이를 빼요.' : '모르는 것은 빗변 위 넓이, 두 작은 넓이를 합쳐요.' }, { at: 6, say: subtract ? '계산하면 x=97−49=48이에요.' : '계산하면 x=49+48=97이에요.', set: { pyShowAnswer: true }, step: 4 }])
    ], { q: { pyS1: 49, pyS2: 48, pyUnk: subtract ? 'b' : 'c' }, start: { pyS1: 49, pyS2: 48 }, set: { pyUnk: subtract ? 'b' : 'c' } });
  }
  function rectangleLesson(diagonal) {
    return make('직사각형 바깥 네 초승달의 넓이', diagonal ? '대각선 조건' : '가로세로', '색칠한 넓이는 192', [
      ch('주어진 길이와 큰 원', [{ at: 0, say: diagonal ? '가로 AD=12, 대각선 AC=20이 주어졌어요.' : '직사각형의 가로 AD=12, 세로 AB=16이에요.' }, { at: 6, say: '대각선 AC를 지름으로 하는 큰 원과 반원들을 봐요.', step: 1 }]),
      ch(diagonal ? '알려지지 않은 세로 구하기' : '대각선의 제곱 확인', [{ at: 0, say: diagonal ? '세로 h에 대해 h²=20²−12²=256이에요.' : 'AC²=12²+16²=400이에요.', step: 2 }, { at: 6, say: diagonal ? '양수 16의 제곱이 256이므로 세로는 16이에요.' : '대각선이 큰 원의 지름이므로 그 제곱도 400이에요.', set: { pyBFirstReady: true, pyCalculationReady: true } }]),
      ch('반원 합과 큰 원 비교', [{ at: 0, say: '지름 d인 반원의 넓이는 πd²/8이에요.', step: 3 }, { at: 6, say: '네 반원 합=π(12²+16²)/4, 큰 원 넓이도 같아요.' }]),
      ch('겹치는 부분을 함께 빼기', [{ at: 0, say: '큰 원 안이면서 직사각형 밖인 부분은 공통이에요.', step: 4 }, { at: 6, say: '같은 넓이에서 공통 부분을 빼면 남은 넓이도 같아요.' }]),
      ch('직사각형 넓이로 결론', [{ at: 0, say: '네 초승달의 합은 남은 직사각형의 넓이와 같아요.' }, { at: 6, say: '색칠한 넓이는 12×16=192예요.', set: { pyShowAnswer: true }, step: 5 }])
    ], { q: { pyRw: 12, pyRh: 16, pyKind: diagonal ? 1 : 0 }, set: { pyKind: diagonal ? 1 : 0 } });
  }
  function hippoLesson(hypotenuse) {
    return make('두 초승달을 직각삼각형 넓이로', hypotenuse ? '빗변 조건' : '두 직각변', '색칠한 넓이는 24', [
      ch('직각과 주어진 길이', [{ at: 0, say: hypotenuse ? '직각 A, 직각변 AB=6과 빗변 BC=10이 주어졌어요.' : '직각 A를 끼는 AB=6, AC=8이 주어졌어요.' }, { at: 6, say: '작은 두 반원과 빗변 위 큰 반원의 넓이를 비교해요.', step: 1 }]),
      ch(hypotenuse ? '다른 직각변부터 구하기' : '반원의 넓이 식', [{ at: 0, say: hypotenuse ? 'AC²=10²−6²=64를 먼저 계산해요.' : '지름 d인 반원의 넓이는 πd²/8이에요.', step: 2 }, { at: 6, say: hypotenuse ? '8²=64이므로 다른 직각변 AC는 8이에요.' : '세 변의 제곱 관계에 같은 상수 π/8을 곱해요.', set: { pyBFirstReady: true } }]),
      ch('반원 넓이의 같은 합', [{ at: 0, say: 'AB²+AC²=BC²이므로 작은 반원 합=큰 반원이에요.', step: 3 }, { at: 6, say: '원 전체가 아니라 지름으로 만든 반원끼리 비교해요.' }]),
      ch('공통인 두 활꼴을 빼기', [{ at: 0, say: '두 쪽에서 똑같이 겹치는 두 활꼴을 빼요.', step: 4 }, { at: 6, say: '초승달 두 개의 합이 직각삼각형 넓이로 남아요.' }]),
      ch('직각을 낀 두 변으로 계산', [{ at: 0, say: '삼각형의 밑변과 높이는 직각변 6과 8이에요.' }, { at: 6, say: '색칠한 넓이는 6×8÷2=24예요.', set: { pyShowAnswer: true }, step: 5 }])
    ], { q: { pyIa: 6, pyIb: 8, pyKind: hypotenuse ? 1 : 0 }, set: { pyKind: hypotenuse ? 1 : 0 } });
  }
  function semicircleConcept() {
    return make('세 반원의 넓이가 따르는 관계', '넓이 관계', 'S₁+S₂=S₃', [
      ch('세 기호가 가리키는 넓이', [{ at: 0, say: 'S₁, S₂는 직각변 위, S₃는 빗변 위 반원 넓이예요.' }, { at: 6, say: '삼각형의 직각은 A, 빗변은 BC예요.', step: 1 }]),
      ch('지름과 반지름을 구분', [{ at: 0, say: '지름이 d이면 반지름은 d/2예요.' }, { at: 6, say: '반원 넓이는 π(d/2)²÷2=πd²/8이에요.', step: 2 }]),
      ch('피타고라스 정리를 넓이로 바꾸기', [{ at: 0, say: 'AB²+AC²=BC²의 양쪽에 π/8을 곱해요.' }, { at: 6, say: '각 항이 반원 넓이이므로 S₁+S₂=S₃예요.', set: { pyShowAnswer: true }, step: 4 }])
    ], { problem: false, q: { pyIa: 6, pyIb: 8, pyUnk: 'c' } });
  }
  function semicircleArea(subtract) {
    return make('세 반원 중 모르는 넓이 구하기', subtract ? '반원 빼기' : '반원 더하기', `x=${subtract ? '9π/2' : '25π/2'}`, [
      ch('알려진 넓이와 구할 반원', [{ at: 0, say: subtract ? 'S₂=8π, S₃=25π/2이고 S₁=x를 구해요.' : 'S₁=9π/2, S₂=8π이고 S₃=x를 구해요.' }, { at: 6, say: 'S₃는 직각 A의 맞은편인 빗변 위 반원이에요.', step: 1 }]),
      ch('넓이 관계로 식 세우기', [{ at: 0, say: '반원 넓이는 지름 제곱의 π/8배이므로 S₁+S₂=S₃예요.', step: 2 }, { at: 6, say: subtract ? '모르는 직각변 위 넓이는 x=S₃−S₂로 빼요.' : '모르는 빗변 위 넓이는 x=S₁+S₂로 더해요.', step: 3 }]),
      ch('π를 두고 계수끼리 계산', [{ at: 0, say: '8π=16π/2로 바꾸어 분모를 맞춰요.' }, { at: 6, say: subtract ? 'x=25π/2−16π/2=9π/2가 정답이에요.' : 'x=9π/2+16π/2=25π/2가 정답이에요.', set: { pyShowAnswer: true }, step: 4 }])
    ], { q: { pyIa: 6, pyIb: 8, pyUnk: subtract ? 'a' : 'c' }, set: { pyUnk: subtract ? 'a' : 'c' } });
  }
  function hypotenuseFromArea() {
    return make('반원 넓이의 합에서 빗변 구하기', '빗변 구하기', 'x=12', [
      ch('주어진 합과 구할 길이', [{ at: 0, say: '두 직각변 위 반원의 넓이의 합은 18π예요.' }, { at: 6, say: '구할 x=BC는 큰 반원의 지름이고 반지름은 r예요.', step: 1 }]),
      ch('빗변 위 반원의 넓이', [{ at: 0, say: '피타고라스 정리를 반원 넓이로 쓰면 S₁+S₂=S₃예요.', step: 2 }, { at: 6, say: '따라서 빗변 위 반원의 넓이 S₃도 18π예요.', set: { pyBFirstReady: true } }]),
      ch('먼저 반지름 계산', [{ at: 0, say: 'πr²÷2=18π이므로 r²=36이에요.' }, { at: 6, say: '양수 6의 제곱이 36이므로 반지름 r=6이에요.', set: { pyBSecondReady: true, pyCalculationReady: true } }]),
      ch('반지름에서 지름으로', [{ at: 0, say: '문제는 반지름이 아니라 빗변인 지름을 물었어요.' }, { at: 6, say: '지름 x=2r=2×6=12예요.', set: { pyShowAnswer: true }, step: 3 }])
    ], { q: { pyHy: 3 } });
  }
  Object.assign(lessons, {
    'py3-345': [familyConcept([3, 4, 5]), familyProblem([3, 4, 5], 'c'), familyProblem([3, 4, 5], 'b')],
    'py3-51213': [familyConcept([5, 12, 13]), familyProblem([5, 12, 13], 'c'), familyProblem([5, 12, 13], 'a')],
    'py3-8157': [familyConcept([8, 15, 17]), familyConcept([7, 24, 25], 1), familyProblem([8, 15, 17], 'c'), familyProblem([7, 24, 25], 'b', 1)],
    'py3-trap': [trapLesson(0), trapLesson(1), trapLesson(2)],
    'py4-hinge': [hingeConcept(), hingeProblem(0), hingeProblem(1)],
    'py4-acute': [judgeLesson(false)],
    'py4-obtuse': [judgeLesson(true)],
    'py4-orange': [rangeLesson(false, false), rangeLesson(false, true)],
    'py4-arange': [rangeLesson(true, false), rangeLesson(true, true)],
    'py5-tree': [treeLesson(false), treeLesson(true)],
    'py5-sqarea': [squareAreaLesson(false), squareAreaLesson(true)],
    'py5-rectsemi': [rectangleLesson(false), rectangleLesson(true)],
    'py5-hippo': [hippoLesson(false), hippoLesson(true)],
    'py5-semi': [semicircleConcept(), semicircleArea(false), semicircleArea(true)],
    'py5-findhyp': [hypotenuseFromArea()]
  });
})();
