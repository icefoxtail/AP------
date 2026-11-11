/* 수선·접기·최단거리와 세 가지 제곱합 관계: 원본 수치 조건에 결속한 해설. */
(function () {
  'use strict';
  const G = window.APL_PY;
  if (!G) return;
  window.APL_LESSONS = window.APL_LESSONS || {};
  const bank = window.APL_LESSONS['g8-pythagoras'] = window.APL_LESSONS['g8-pythagoras'] || {};
  const ids = ['py6-iso', 'py6-trap', 'py6-rect', 'py7-rect', 'py7-tri', 'py7-refl', 'py7-box', 'py7-cyl', 'py8-quad', 'py8-rectP', 'py8-cross'];
  const source = Object.fromEntries((window.APL_PY_GROUPS || []).flatMap(g => g.scenes).filter(s => ids.includes(s.id)).map(s => [s.id, s.py]));
  const reset = extra => ({ pyLessonProblem: true, pyShowAnswer: false, pyCalculationReady: false, pyQ: {}, pySeed: 0, pyLessonGoal: '', pyLessonQuestion: '', pyLessonAnswer: '', pyLessonMath: '', pyRoute: 0, ...extra });
  const ch = (title, a, b, one = {}, two = {}, length = 12) => ({ title, length, cues: [{ at: 0, say: a, ...one }, { at: 6, say: b, ...two }] });
  function lesson(title, label, answer, start, settings, chapters) {
    chapters[0].start = { pyFp: 0, ...start };
    chapters[0].cues[0].set = reset({ ...settings, pyLessonAnswer: answer.replace(/\$/g, ''), ...chapters[0].cues[0].set });
    return { title, label, tab: 'review', answer, summary: '원본 조건에서 직각삼각형을 찾아 제곱 관계로 계산합니다', task: '직접 해 보기에서 조건과 구하는 선분을 바꾸어 확인해 보세요', chapters };
  }
  const calc = (step, math = '') => ({ step, set: { pyCalculationReady: true, pyLessonMath: math } });
  const finish = (step = 5) => ({ step, set: { pyShowAnswer: true } });
  const move = (key, value, snap) => ({ to: { [key]: value }, dur: 5, ease: 'linear', ...(snap ? { snap } : {}) });
  const isoQ = kind => ({ pyIb: 10, pyIl: 13, pyKind: kind });
  bank['py6-iso'] = [
    lesson('이등변삼각형에서 높이 찾기', '높이', 'AH = 12', { pyIb: 10, pyIl: 13 }, { pyQ: isoQ(0) }, [
      ch('높이와 빗변 구별하기', 'AH는 밑변에 수직인 높이예요. x로 놓아요.', '같은 두 변 AB와 AC의 길이는 각각 13이에요.', { step: 1 }),
      ch('밑변을 반으로 나누기', '이등변삼각형의 높이는 밑변을 이등분해요.', 'BC=10이므로 BH=HC=5예요.', { step: 2 }),
      ch('직각삼각형에서 높이 계산', 'ABH의 빗변은 AB예요. x²=13²−5²예요.', 'x²=144이고 길이는 양수이므로 AH = 12예요.', { step: 3 }, finish())
    ]),
    lesson('높이를 이용해 넓이 구하기', '넓이', '넓이 = 60', { pyIb: 10, pyIl: 13, pyKind: 0 }, { pyQ: isoQ(0), pyLessonProblem: false, pyLessonGoal: 'iso-area', pyLessonQuestion: 'AB=AC=13, BC=10인 이등변삼각형 ABC의 넓이를 구하세요. AH는 밑변에 내린 수선입니다.' }, [
      ch('넓이에 필요한 높이', '넓이에 쓰는 높이는 비스듬한 AB가 아니라 AH예요.', 'A에서 수선을 내리고 밑변을 반으로 나눠요.', { step: 1 }, { step: 2 }),
      ch('직각삼각형으로 높이 구하기', 'BH=5이고 빗변은 13이므로 AH²=13²−5²예요.', 'AH²=144에서 높이는 12예요.', { step: 3 }, calc(3)),
      ch('밑변과 수직인 높이 곱하기', '삼각형의 넓이는 밑변×높이÷2예요.', '10×12÷2를 계산하면 넓이 = 60이에요.', {}, finish())
    ]),
    lesson('넓이로 같은 변 길이 구하기', '같은변', 'AB = 13', { pyIb: 10, pyIl: 13 }, { pyQ: isoQ(1) }, [
      ch('주어진 넓이에서 출발하기', '밑변은 10, 넓이는 60이에요. 구할 변은 AB예요.', '수선 AH를 내리면 밑변의 반은 5예요.', { step: 1 }, { step: 2 }),
      ch('넓이 식에서 높이 찾기', '60=10×AH÷2이므로 AH=60×2÷10이에요.', '높이는 12예요. 이제 직각삼각형 ABH를 봐요.', {}, calc(3)),
      ch('빗변인 같은 변 구하기', 'AB²=12²+5²=169예요.', '길이는 양수이고 13²=169이므로 AB = 13이에요.', { step: 4 }, finish())
    ])
  ];
  const trapQ = kind => kind ? { pyTu: 4, pyTh: 12, pyTd1: 5, pyTd2: 5, pyKind: 1 } : { pyTu: 6, pyTh: 12, pyTd1: 5, pyTd2: 9, pyKind: 0 };
  bank['py6-trap'] = [
    lesson('사다리꼴의 수직인 높이', '높이', 'AH = 12', {}, { pyQ: trapQ(0) }, [
      ch('직각삼각형을 만들기', 'AH는 높이이고 AB는 비스듬한 다리예요.', 'A에서 밑변으로 수선을 내려 ABH를 봐요.', { step: 1 }),
      ch('빗변과 한 변 사용하기', '직각삼각형 ABH에서 빗변 AB=13, BH=5예요.', 'AH²=AB²−BH²=13²−5²로 계산해요.', { step: 2 }, { step: 3 }),
      ch('높이와 다리 구별하기', 'AH²=169−25=144예요.', '12²=144이므로 높이는 AH = 12예요.', calc(4), finish())
    ]),
    lesson('이등변사다리꼴의 둘레', '둘레', '둘레 = 44', {}, { pyQ: trapQ(1) }, [
      ch('둘레에 필요한 네 변', '윗변은 4, 아랫변은 14, 수직인 높이는 12예요.', '수선 두 개를 내려 양쪽의 직각삼각형을 봐요.', { step: 1 }),
      ch('남는 밑변을 반씩 나누기', '가운데 HI는 윗변과 같은 4예요.', '양옆은 같으므로 BH=IC=(14−4)÷2=5예요.', { step: 2 }, calc(3)),
      ch('비스듬한 다리 구하기', '직각삼각형에서 AB²=12²+5²=169예요.', 'AB=CD=13이므로 네 변을 모두 더해요.', {}, calc(4)),
      ch('네 변의 합', '높이 12가 아니라 다리 13을 두 번 더해요.', '4+14+13+13을 계산하면 둘레 = 44예요.', {}, finish())
    ]),
    lesson('높이로 사다리꼴 넓이 구하기', '넓이', '넓이 = 156', trapQ(0), { pyQ: trapQ(0), pyLessonProblem: false, pyLessonGoal: 'trap-area', pyLessonQuestion: '그림의 사다리꼴은 윗변이 6, 아랫변이 20, 수직인 높이가 12입니다. 넓이를 구하세요.' }, [
      ch('평행한 두 변과 높이', '윗변은 6, 아랫변은 20, 높이는 12예요.', '수선으로 나누면 직사각형과 두 직각삼각형이 돼요.', { step: 1 }),
      ch('넓이를 더해 공식 만들기', '가운데와 양옆의 넓이를 같은 높이로 묶어요.', '넓이는 (윗변+아랫변)×높이÷2예요.', { step: 2 }),
      ch('조건을 넣어 계산하기', '(6+20)×12÷2를 계산해요.', '26×6이므로 넓이 = 156이에요.', calc(3), finish())
    ])
  ];
  const rectQ = kind => ({ pyWw: 8, pyWh: 6, pyKind: kind });
  bank['py6-rect'] = [
    lesson('대각선 양쪽의 높이 더하기', '수선합', 'AP+CQ = $\\frac{48}{5}$', {}, { pyQ: rectQ(0) }, [
      ch('두 수선과 대각선', 'AP와 CQ는 대각선 BD에 수직인 높이예요.', 'AB=6, BC=8인 직사각형에서 두 높이의 합을 구해요.', { step: 1 }),
      ch('대각선과 넓이 이용하기', 'BD²=6²+8²=100이므로 BD=10이에요.', '같은 삼각형 ABD의 넓이를 두 번 나타내요.', calc(2)),
      ch('높이 하나 구하기', '6×8÷2=10×AP÷2이므로 $AP=\\frac{24}{5}$예요.', '합동인 삼각형 ABD와 CDB의 높이는 서로 같아요.', calc(3)),
      ch('같은 두 높이 더하기', 'CQ도 AP와 같으므로 같은 값을 두 번 더해요.', '$AP+CQ=\\frac{24}{5}+\\frac{24}{5}=\\frac{48}{5}$예요.', {}, finish())
    ]),
    lesson('대각선에 내린 높이 하나', 'AP길이', 'AP = $\\frac{24}{5}$', {}, { pyQ: rectQ(2) }, [
      ch('높이의 기준 변 확인하기', 'AP는 AB가 아니라 대각선 BD에 내린 높이예요.', '직각삼각형 ABD의 넓이를 두 방식으로 써요.', { step: 1 }),
      ch('피타고라스로 밑변 구하기', 'BD²=6²+8²=100이므로 BD=10이에요.', '넓이 식은 6×8÷2=10×AP÷2예요.', calc(2)),
      ch('같은 넓이 식 풀기', '양쪽의 2를 없애면 10×AP=48이에요.', '따라서 $AP=\\frac{24}{5}$예요.', { step: 3 }, finish())
    ]),
    lesson('수선의 발 사이 거리', 'PQ길이', 'PQ = $\\frac{14}{5}$', {}, { pyQ: rectQ(1) }, [
      ch('발의 위치로 거리 구하기', 'P와 Q는 대각선 위 수선의 발이에요.', 'B에서 잰 P와 Q의 위치 차로 PQ를 구해요.', { step: 1 }),
      ch('대각선과 닮음 사용하기', 'BD²=6²+8²=100이므로 BD=10이에요.', '△ABP∼△DBA에서 BP=AB²÷BD예요.', calc(2)),
      ch('같은 기준점에서 위치 재기', '$BP=\\frac{36}{10}=\\frac{18}{5}$이고 DQ=BP예요.', '$BQ=10-\\frac{18}{5}=\\frac{32}{5}$예요.', calc(3, 'BP=\\frac{18}{5}  ·  BQ=\\frac{32}{5}'), { step: 4 }),
      ch('위치의 차를 양수로 구하기', '같은 기준 B에서 잰 두 위치를 빼요.', '$PQ=\\frac{32}{5}-\\frac{18}{5}=\\frac{14}{5}$예요.', {}, finish())
    ])
  ];

  for (const id of ids) {
    const D = source[id];
    if (!D) continue;
    D.lessonQuestion = (M, s, Q) => s.pyLessonProblem && Q
      ? `<p>${Q.stem || Q.html}</p><ol>${Q.choices.map(c => `<li>${c.h}</li>`).join('')}</ol>`
      : s.pyLessonQuestion || D.question;
    const original = D.draw;
    D.draw = function (b, s, M, C) {
      let context = C;
      if (C.lesson && s.pyLessonGoal === 'iso-area') context = { ...C, answer: C.calculation };
      original(b, s, M, context);
      if (!C.lesson || !C.txt) return;
      const text = C.answer ? s.pyLessonAnswer : C.calculation ? s.pyLessonMath : '';
      if (text) b.stext(b.W / 2, b.H - 24, text, { size: b.W < 560 ? 14 : 16, color: C.answer ? 'green' : 'amber', weight: 800, align: 'center' });
    };
  }
})();
