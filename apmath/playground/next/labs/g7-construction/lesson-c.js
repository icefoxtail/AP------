/* 합동의 대응과 실제 정삼각형·정사각형 문제를 잇는 원클릭 해설. */
(function () {
  'use strict';
  const G = window.APL_CN;
  if (!G) return;
  window.APL_LESSONS = window.APL_LESSONS || {};
  const bank = window.APL_LESSONS['g7-construction'] = window.APL_LESSONS['g7-construction'] || {};
  const ids = ['c4-1', 'c4-2', 'c4-3', 'c6-1', 'c6-2', 'c6-3', 'c6-4'];
  const source = Object.fromEntries((window.APL_CN_GROUPS || []).flatMap(g => g.scenes).filter(s => ids.includes(s.id)).map(s => [s.id, s.cn]));
  const reset = extra => ({ cnLessonProblem: false, cnShowAnswer: false, cnLessonGoal: '', cnLessonQuestion: '', cnLessonAnswer: '', cnLessonMath: '', cnLessonCounter: false, cnPk: null, cnPmode: 'rot', cnOmode: 'order', cnOpick: null, cnQmode: 'side', cnJm: 'in', ...extra });
  const chapter = (title, a, b, one = {}, two = {}, length = 12) => ({ title, length, cues: [{ at: 0, say: a, ...one }, { at: 6, say: b, ...two }] });
  function lesson(title, label, answer, start, settings, chapters) {
    chapters[0].start = { cnPt: 0, cnGt: 0, cnHt: 0, cnKt: 0, cnJt: 0, ...start };
    chapters[0].cues[0].set = reset({ ...settings, cnLessonAnswer: answer, ...chapters[0].cues[0].set });
    return { title, label, tab: 'review', answer, summary: '그림의 조건을 확인하고 대응 관계로 구하는 값을 찾습니다', task: '직접 해 보기에서 조건을 바꾸어 같은 관계를 확인해 보세요', chapters };
  }
  const motion = (key, value) => ({ to: { [key]: value }, dur: 5, ease: 'linear' });
  const reveal = (step = 4, extra = {}) => ({ step, set: { cnShowAnswer: true, ...extra } });
  const pk4 = { q: 0, p: [1, 2, 0], k: 0, kind: 0 };
  const triStart = { cnCx: 2.4, cnCy: 3.6 };
  bank['c4-1'] = [
    lesson('포개어지는 두 삼각형', '포개기', '합동', triStart, { cnPk: pk4, cnLessonQuestion: '삼각형의 모양과 크기를 바꾸지 않고 돌리고 밀면 두 삼각형이 꼭 포개어질까요?' }, [
      chapter('모양과 크기 보존하기', '오른쪽 삼각형을 제자리에서 돌려요.', '회전해도 변의 길이와 각의 크기는 그대로예요.', motion('cnPt', 0.5)),
      chapter('꼭짓점과 변 확인하기', '방향을 맞춘 삼각형을 왼쪽으로 밀어요.', '세 꼭짓점과 변이 함께 겹치는지 확인해요.', motion('cnPt', 0.85)),
      chapter('포개어진 결과', '모양을 늘이거나 줄이지 않고 끝까지 포개요.', '모양과 크기가 같은 두 삼각형은 합동이에요.', motion('cnPt', 1), reveal(3))
    ]),
    ...[
      { label: '대응점', kind: 0, q: 0, answer: '점 E', target: '점 A', reason: '양쪽의 첫 번째 꼭짓점끼리 짝지어요.', conclusion: 'A와 같은 첫 번째 자리는 E예요. 대응점은 점 E예요.' },
      { label: '대응변', kind: 1, q: 0, answer: '변 EF', target: '변 AB', reason: '변의 양 끝점이 각각 어느 점에 대응하는지 찾아요.', conclusion: 'A는 E에, B는 F에 대응해요. 대응변은 변 EF예요.' },
      { label: '대응각', kind: 2, q: 2, answer: '∠D', target: '∠C', reason: '각의 꼭짓점이 양쪽에서 몇 번째인지 확인해요.', conclusion: 'C는 세 번째인 D에 대응해요. 대응각은 ∠D예요.' }
    ].map(item => lesson(`합동식에서 ${item.label} 찾기`, item.label, item.answer, triStart, { cnPk: { ...pk4, q: item.q, kind: item.kind }, cnLessonProblem: true }, [
      chapter('실제 문제의 대응 순서', '△ABC ≡ △EFD에서 같은 순서를 찾아요.', `${item.target}의 짝을 찾으며 오른쪽 도형의 방향을 맞춰요.`, motion('cnPt', 0.5)),
      chapter('같은 위치의 이름 찾기', item.reason, '글자의 알파벳 순서가 아니라 합동식의 순서를 써요.', motion('cnPt', 0.85)),
      chapter('포개어 확인한 대응', '도형을 끝까지 포개어 같은 위치인지 확인해요.', item.conclusion, motion('cnPt', 1), reveal(3))
    ]))
  ];

  const orderStart = { cnOa: 6, cnOb: 7, cnOc: 8, cnOs: 3, cnRw: 6, cnRh: 4, cnRw2: 6 };
  const pkOrder = { s: 0, k: 0, f: 0, tt: [0, 1, 2, 3] };
  bank['c4-2'] = [
    lesson('변의 길이로 대응 순서 찾기', '대응순서', '△ABC ≡ △EFD', orderStart, { cnPk: pkOrder, cnLessonQuestion: '그림의 변의 길이를 비교하여 △ABC와 합동인 삼각형의 꼭짓점 순서를 쓰세요.' }, [
      chapter('만나는 두 변 비교하기', '세 변의 길이가 서로 다른 두 삼각형이에요.', 'A는 길이 8과 7인 두 변이 만나는 점이에요.', { step: 1 }),
      chapter('세 꼭짓점을 짝짓기', '오른쪽에서 같은 두 길이가 만나는 점을 찾아요.', 'B와 C도 만나는 두 변의 길이를 비교해요.', { step: 2 }),
      chapter('합동식의 순서 완성하기', '대응점을 A, B, C의 순서대로 적어요.', 'A↔E, B↔F, C↔D이므로 △ABC ≡ △EFD예요.', {}, reveal(3, { cnOpick: 3 }))
    ]),
    lesson('같은 넓이와 모양 비교하기', '같은넓이', '합동이 아니에요', orderStart, { cnPk: pkOrder, cnOmode: 'area', cnLessonQuestion: '넓이가 같은 두 직사각형은 언제나 합동일까요? 가로와 세로를 함께 비교하세요.' }, [
      chapter('같은 넓이 유지하기', '왼쪽은 가로 6, 세로 4인 직사각형이에요.', '오른쪽의 가로를 늘리며 넓이는 같게 유지해요.', { to: { cnRw2: 8 }, dur: 5, snap: 1, ease: 'linear' }),
      chapter('변의 길이 비교하기', '넓이는 두 도형 모두 24예요.', '오른쪽은 8×3, 왼쪽은 6×4로 변이 달라요.', { step: 2 }),
      chapter('모양과 크기까지 확인하기', '합동이려면 대응하는 변의 길이도 같아야 해요.', '넓이가 같아도 이 두 직사각형은 합동이 아니에요.', {}, reveal(3))
    ]),
    lesson('합동에 관한 설명 판별하기', '보기판별', '넓이가 같은 두 삼각형은 합동이다.', { ...orderStart, cnRw2: 8 }, { cnPk: pkOrder, cnLessonProblem: true, cnLessonGoal: 'counterexample' }, [
      chapter('다섯 보기의 조건 읽기', '문제는 옳지 않은 설명 하나를 찾는 것이에요.', '합동이면 대응변·대응각과 모양·크기가 같아요.', { step: 1 }),
      chapter('넓이만 같은 반례 만들기', '밑변 6·높이 4와 밑변 8·높이 3을 비교해요.', '각각 밑변×높이÷2로 넓이를 구해 보세요.', { step: 2, set: { cnLessonCounter: true } }),
      chapter('반례로 보기 판별하기', '두 넓이는 12지만 직각을 낀 두 변은 달라요.', '「넓이가 같은 두 삼각형은 합동이다.」가 옳지 않아요.', {}, reveal(3))
    ])
  ];
  const pkLength = { kind: 0, x: 4, k: 2, m: 1, n: 9, b: 6, c: 7, A: 60, r: 60, p: 2, q: 0, k0: 0 };
  const pkAngle = { ...pkLength, kind: 1, x: 15, p: 3, q: 5, r: 50, A: 60 };
  const valStart = { cnQa: 6, cnQb: 7, cnQc: 8, cnQA: 50, cnQB: 60 };
  bank['c4-3'] = [
    lesson('대응변으로 미지수 구하기', '길이식', 'x = 4', valStart, { cnPk: pkLength, cnLessonProblem: true }, [
      chapter('대응점과 구할 값', '△ABC ≡ △DEF에서 B↔E, C↔F예요.', 'x는 변의 길이 식 안에 있는 미지수예요.', motion('cnPt', 0.5)),
      chapter('대응변으로 식 세우기', 'BC와 EF가 대응하므로 길이가 같아요.', '2x+1=9에서 양변의 1을 빼면 2x=8이에요.', motion('cnPt', 1)),
      chapter('미지수 구하고 확인하기', '조건이 잘 보이게 두 삼각형을 다시 떼어 놓아요.', '양변을 2로 나누면 x = 4예요. 2×4+1=9도 맞아요.', motion('cnPt', 0), reveal(3))
    ]),
    lesson('대응각으로 미지수 구하기', '각도식', 'x = 15', valStart, { cnPk: pkAngle, cnLessonProblem: true }, [
      chapter('각의 꼭짓점 대응', '△ABC ≡ △DEF에서 B와 E가 대응해요.', '구할 것은 각의 크기가 아니라 식 안의 x예요.', motion('cnPt', 0.5)),
      chapter('같은 각으로 식 세우기', '∠B=∠E이므로 3x+5=50이에요.', '양변에서 5를 빼면 3x=45가 돼요.', motion('cnPt', 1)),
      chapter('식의 해 확인하기', '양쪽 조건을 다시 보며 양변을 3으로 나눠요.', 'x = 15예요. 3×15+5=50으로 조건을 만족해요.', motion('cnPt', 0), reveal(3))
    ])
  ];

  function hidden(title, label, answer, start, settings, key, lines, last, problem = true) {
    return lesson(title, label, answer, start, { cnLessonProblem: problem, ...settings }, [
      chapter('주어진 도형과 같은 변', lines[0], lines[1], motion(key, 0.2), { step: 1 }),
      chapter('두 변 사이의 각 확인하기', lines[2], lines[3], { step: 2 }),
      chapter('회전으로 대응 확인하기', lines[4], lines[5], motion(key, 1), { step: problem ? 3 : 2 }),
      chapter('조건으로 결과 구하기', last[0], last[1], {}, reveal(problem ? 4 : 3))
    ]);
  }
  const eq1Start = { cnGa: 5, cnGb: 4 };
  const eq1PK = { y: 35, k: 0, kind: 0, q: 0 };
  const eq1Lines = [
    'ABC와 CDE는 정삼각형이고 B, C, E는 한 직선 위예요.',
    '각 정삼각형에서 BC=AC, CD=CE를 표시해요.',
    '직선 위의 각에서 60°씩 빼면 ∠ACD=60°예요.',
    '두 변 사이의 ∠BCD와 ∠ACE는 모두 120°예요.',
    '△BCD를 C를 중심으로 60° 돌려요.',
    'B↔A, C↔C, D↔E 순서로 같은 위치를 확인해요.'
  ];
  bank['c6-1'] = [
    hidden('두 정삼각형 속 대응 찾기', '합동찾기', '△BCD ≡ △ACE', eq1Start,
      { cnPk: eq1PK, cnLessonQuestion: '정삼각형 ABC와 CDE에서 B, C, E가 한 직선 위입니다. BC와 CD를 포함하는 삼각형은 어느 삼각형과 합동일까요?' }, 'cnGt', eq1Lines,
      ['두 변과 그 사이의 각이 각각 같다는 조건을 모아요.', 'SAS 합동으로 △BCD ≡ △ACE예요.'], false),
    hidden('정삼각형의 각에서 빼기', '대응각', '∠DEA = 25°', eq1Start,
      { cnPk: eq1PK }, 'cnGt', eq1Lines,
      ['합동이므로 ∠AEC=∠BDC=35°예요.', '∠DEA = 25°예요. 정삼각형의 60°에서 35°를 빼요.']),
    hidden('교차한 두 선분의 각', '교차각', '∠APB = 60°', eq1Start,
      { cnPk: { ...eq1PK, kind: 1, q: 0 } }, 'cnGt', eq1Lines,
      ['BD를 60° 돌리면 AE와 방향이 나란해져요.', '그림에서 두 선분이 만드는 작은 각은 ∠APB = 60°예요.']),
    hidden('교차각의 이웃한 각', '이웃각', '∠BPE = 120°', eq1Start,
      { cnPk: { ...eq1PK, kind: 1, q: 1 } }, 'cnGt', eq1Lines,
      ['두 선분의 작은 각 ∠APB는 60°예요.', 'A, P, E가 일직선이므로 ∠BPE = 120°예요.'])
  ];
  const eq2Start = { cnHL: 6, cnHd: 2 };
  const eq2PK = { L: 8, c: 3, kind: 0, k: 0 };
  const eq2Lines = [
    'ABC와 ADE는 정삼각형이고 D는 변 BC 위에 있어요.',
    '정삼각형의 변이므로 AB=AC, AD=AE예요.',
    'A에서 정삼각형의 각은 각각 60°예요.',
    '같은 ∠DAC를 빼면 ∠BAD=∠CAE가 돼요.',
    '△ABD를 A를 중심으로 60° 돌려요.',
    'A↔A, B↔C, D↔E 순서로 포개어 확인해요.'
  ];
  bank['c6-2'] = [
    hidden('점 A를 공유한 두 도형', '합동찾기', '△ABD ≡ △ACE', eq2Start,
      { cnPk: eq2PK, cnLessonQuestion: '정삼각형 ABC와 ADE에서 D는 BC 위에 있습니다. AB와 AD를 포함하는 삼각형의 대응을 찾아보세요.' }, 'cnHt', eq2Lines,
      ['두 변과 그 사이의 각이 각각 같아요.', 'SAS 합동으로 △ABD ≡ △ACE예요.'], false),
    hidden('대응변으로 CE 구하기', 'CE길이', 'CE = 5 cm', eq2Start,
      { cnPk: eq2PK }, 'cnHt', eq2Lines,
      ['합동인 두 삼각형에서 CE=BD예요.', 'BD=BC−CD=8−3이므로 CE = 5 cm예요.']),
    hidden('대응변을 빼서 CD 구하기', 'CD길이', 'CD = 5 cm', eq2Start,
      { cnPk: { ...eq2PK, kind: 1 } }, 'cnHt', eq2Lines,
      ['CE=BD이므로 BD의 길이는 3 cm예요.', 'CD=BC−BD=8−3이므로 CD = 5 cm예요.']),
    hidden('C에서 두 각 더하기', 'C의각', '∠DCE = 120°', eq2Start,
      { cnPk: { ...eq2PK, kind: 2 }, cnLessonGoal: 'dce' }, 'cnHt', eq2Lines,
      ['대응각 ∠ACE=∠ABD=60°예요.', '∠DCA도 60°이므로 ∠DCE = 120°예요.'])
  ];
  const sqStart = { cnKa: 6, cnKe: 3, cnKth: 35 };
  const sqPK = { kind: 0, x: 4, k: 2, m: 1, n: 9, th: 40, p: 2, q: 10, k0: 0 };
  const sqLines = [
    'ABCD와 AEFG는 꼭짓점 A를 공유한 정사각형이에요.',
    '정사각형의 변에서 AB=AD, AE=AG를 찾아요.',
    '∠BAD와 ∠EAG는 각각 직각이에요.',
    '공통인 ∠EAD를 빼면 ∠BAE=∠DAG예요.',
    '△ABE를 A를 중심으로 90° 돌려요.',
    'A↔A, B↔D, E↔G 순서로 같은 위치를 확인해요.'
  ];
  bank['c6-3'] = [
    hidden('두 정사각형의 대응 찾기', '합동찾기', 'BE = DG', sqStart,
      { cnPk: sqPK, cnLessonQuestion: '정사각형 ABCD와 AEFG가 A를 공유합니다. 삼각형 ABE와 ADG를 비교하면 BE와 DG는 어떤 관계일까요?' }, 'cnKt', sqLines,
      ['두 변과 그 사이의 각이 같아 △ABE와 △ADG는 합동이에요.', '대응하는 변의 길이가 같으므로 BE = DG예요.'], false),
    hidden('숨은 대응변으로 식 풀기', '길이식', 'x = 4', sqStart,
      { cnPk: sqPK }, 'cnKt', sqLines,
      ['합동이므로 BE=DG예요. 2x+1=9에서 2x=8이에요.', '양변을 2로 나누면 x = 4예요. 대입해도 두 길이가 같아요.']),
    hidden('숨은 대응각으로 식 풀기', '각도식', 'x = 15', sqStart,
      { cnPk: { ...sqPK, kind: 1, x: 15, p: 3, q: 5, th: 50 } }, 'cnKt', sqLines,
      ['같은 두 각에서 3x+5=50이므로 3x=45예요.', '양변을 3으로 나누면 x = 15예요. 3×15+5=50이에요.'])
  ];
  const sqtriStart = { cnJa: 6 };
  const sqtriPK = { m: 'in', q: 0, k: 0 };
  const sqtriLines = inside => [
    'ABCD는 정사각형이고 BCE는 정삼각형이에요.',
    '정사각형에서 AB=DC, 정삼각형에서 BE=CE예요.',
    inside ? 'E가 안쪽이므로 직각에서 정삼각형의 각을 빼요.' : 'E가 바깥쪽이므로 직각과 정삼각형의 각을 더해요.',
    inside ? '∠ABE=∠DCE=90°−60°=30°예요.' : '∠ABE=∠DCE=90°+60°=150°예요.',
    'BC의 수직이등분선을 축으로 △ABE를 뒤집어요.',
    'A↔D, B↔C, E↔E 순서로 포개어 확인해요.'
  ];
  bank['c6-4'] = [
    hidden('정사각형 속 삼각형 대응', '합동찾기', '△ABE ≡ △DCE', sqtriStart,
      { cnPk: sqtriPK, cnLessonQuestion: '정사각형 ABCD 안에 정삼각형 BCE를 그렸습니다. AB와 BE를 포함하는 삼각형의 대응을 찾아보세요.' }, 'cnJt', sqtriLines(true),
      ['두 변과 그 사이의 각이 각각 같아요.', 'SAS 합동으로 △ABE ≡ △DCE예요.'], false),
    hidden('안쪽 정삼각형의 밑각', '기본각', '∠BAE = 75°', sqtriStart,
      { cnPk: sqtriPK }, 'cnJt', sqtriLines(true),
      ['AB=BE이므로 △ABE의 두 밑각은 같아요.', '∠BAE = 75°예요. (180°−30°)÷2로 구해요.']),
    hidden('안쪽 점 E에서 이루는 각', '안쪽각', '∠AED = 150°', sqtriStart,
      { cnPk: { ...sqtriPK, q: 1 } }, 'cnJt', sqtriLines(true),
      ['∠BAE=(180°−30°)÷2=75°, ∠EAD=15°예요.', 'AE=DE에서 두 밑각을 빼면 ∠AED = 150°예요.']),
    hidden('바깥쪽 점 E에서 이루는 각', '바깥각', '∠AED = 30°', sqtriStart,
      { cnPk: { ...sqtriPK, m: 'out', q: 1 }, cnJm: 'out' }, 'cnJt', sqtriLines(false),
      ['∠BAE=(180°−150°)÷2=15°, ∠EAD=75°예요.', 'AE=DE에서 두 밑각을 빼면 ∠AED = 30°예요.'])
  ];

  function counterexample(b) {
    const left = [G.pt(0, 0), G.pt(6, 0), G.pt(0, -4)], right = [G.pt(9, 0), G.pt(17, 0), G.pt(9, -3)];
    G.fit(b, { x0: -1, x1: 18, y0: -5, y1: 1 }, { t: 36, b: 60 });
    for (const [tr, width, height, color] of [[left, 6, 4, 'sky'], [right, 8, 3, 'rose']]) {
      G.fillPoly(b, tr, color, 0.12); G.poly(b, tr, 'ink', 3.4);
      G.ang(b, tr[0], tr[1], tr[2], { color, r: 16 });
      G.T(b, G.mid(tr[0], tr[1]), String(width), { dy: 18, color });
      G.T(b, G.mid(tr[0], tr[2]), String(height), { dx: -18, color });
    }
  }
  for (const id of ids) {
    const D = source[id];
    if (!D) continue;
    D.lessonQuestion = (M, s, Q) => s.cnLessonProblem && Q
      ? `<p>${Q.stem}</p><ol>${Q.choices.map(c => `<li>${c.h != null ? c.h : '$' + c.t + '$'}</li>`).join('')}</ol>`
      : s.cnLessonQuestion || D.question;
    const original = D.draw;
    D.draw = function (b, s, M, C) {
      if (C.lesson && s.cnLessonCounter && id === 'c4-2') counterexample(b);
      else original(b, s, M, C);
      if (C.lesson && id === 'c4-2' && !s.cnLessonProblem && M.mode === 'order' && C.step > 0 && C.step < 3) {
        const index = C.step - 1, a = M.g.Tr[index], image = M.g.img[index];
        G.line(b, a, image, index ? 'rose' : 'sky', 2, { dash: [4, 6] });
        b.point(a, { color: index ? 'rose' : 'sky', r: 6 });
        b.point(image, { color: index ? 'rose' : 'sky', r: 6 });
      }
      if (!C.lesson || !C.txt) return;
      const text = !s.lessonEntry && s.cnShowAnswer ? s.cnLessonAnswer : s.cnLessonMath;
      if (text) b.stext(b.W / 2, b.H - 24, text, { size: b.W < 560 ? 14 : 16, color: s.cnShowAnswer ? 'green' : 'amber', weight: 800, align: 'center' });
    };
  }
})();
