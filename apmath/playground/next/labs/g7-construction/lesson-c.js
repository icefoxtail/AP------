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
      ? `<p>${Q.stem}</p><ol>${Q.choices.map(c => `<li>${c.h}</li>`).join('')}</ol>`
      : s.cnLessonQuestion || D.question;
    const original = D.draw;
    D.draw = function (b, s, M, C) {
      if (C.lesson && s.cnLessonCounter && id === 'c4-2') counterexample(b);
      else original(b, s, M, C);
      if (!C.lesson || !C.txt) return;
      const text = !s.lessonEntry && s.cnShowAnswer ? s.cnLessonAnswer : s.cnLessonMath;
      if (text) b.stext(b.W / 2, b.H - 24, text, { size: b.W < 560 ? 14 : 16, color: s.cnShowAnswer ? 'green' : 'amber', weight: 800, align: 'center' });
    };
  }
})();
