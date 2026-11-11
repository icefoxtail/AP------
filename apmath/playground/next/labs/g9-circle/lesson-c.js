/* 내접사각형·접선과 현·원의 넓이: 고정 원문 조건과 실제 보조선을 재생합니다. */
(function () {
  'use strict';
  const G = window.APL_CI, all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g9-circle'] = all['g9-circle'] || {};
  const scenes = (window.APL_CI_GROUPS || []).flatMap(group => group.scenes);
  const source = id => scenes.find(scene => scene.id === id).ci;
  function fixture(id, kind = 0, seed = 1) {
    const D = source(id), initial = {}; D.init(initial);
    const pk = G.fixedPk(id, kind, seed), state = { ...initial, ciPk: pk, ciN: kind, ciSeed: 0 };
    const sol = G.currentSolution(D, state);
    return { id, kind, seed, pk, initial, sol, Q: sol.question, g: sol.model.g };
  }
  const cue = (at, say, step) => ({ at, say, ...(step == null ? {} : { step }) });
  const ch = (title, a, b, sa = 2, sb = 3) => ({ title, length: 12, cues: [cue(0, a, sa), cue(6, b, sb)] });
  const formula = f => `$${f.sol.target}=${f.sol.tex}${f.sol.target.startsWith('\\angle') ? '^\\circ' : ''}$`;
  const done = f => `따라서 ${formula(f)}, 정답은 ${G.NUM[f.Q.choices.findIndex(choice => choice.ok)]}예요.`;
  function make(f, label, title, chapters, options = {}) {
    const first = chapters[0].cues[0], last = chapters.at(-1).cues.at(-1);
    chapters[0].start = { ...Object.fromEntries(Object.entries(f.initial).filter(([, v]) => typeof v === 'number')), ciCTrace: 0, c7f: 0 };
    first.step = 0;
    first.set = { ciPk: f.pk, ciN: f.kind, ciSeed: 0, ciLessonProblem: !options.concept, ciLessonSource: true,
      ciShowAnswer: false, ciCalculationReady: false, ciCQuestion: options.question || '', ciCAnimateFold: f.id === 'c7-2' };
    chapters[0].cues.splice(1, 0, { at: .1, to: { ciCTrace: 1 }, dur: 4 });
    chapters.at(-1).cues[0].set = { ciCalculationReady: true };
    last.step = f.sol.steps.length; last.set = { ciShowAnswer: true, ciCalculationReady: true };
    const ordinal = G.NUM[f.Q.choices.findIndex(choice => choice.ok)], answer = options.answer || ordinal;
    const item = { label, title, tab: 'review', answer, answerText: options.answer || `${ordinal} ${formula(f)}`,
      summary: '주어진 조건과 같은 호·닮음·넓이의 관계를 연결해요', task: '직접 해 보기에서 조건을 바꾸고 같은 전략으로 확인해 보세요', chapters };
    (lessons[f.id] = lessons[f.id] || []).push(item);
    return item;
  }
  const concept = (f, label, title, answer, question, chapters) => make(f, label, title, chapters, { concept: true, answer, question });

  {
    const fs = [0, 1, 2].map(k => fixture('c5-1', k));
    concept(fs[1], '대각의 합', '내접사각형의 마주 보는 각', '$\\angle A+\\angle C=180^\\circ$', '원에 내접하는 사각형에서 마주 보는 두 각의 합을 설명해 보세요.', [
      ch('마주 보는 두 각', 'A와 C는 이웃한 꼭짓점이 아니라 마주 보는 꼭짓점이에요.', '두 각을 현 BD가 나누는 두 호와 연결해요.', 0, 1),
      ch('두 원주각이 보는 호', 'A는 호 BCD, C는 호 DAB를 보는 원주각이에요.', '이 두 호를 합치면 원 전체 360°가 돼요.'),
      ch('원주각의 절반 관계', '각각의 원주각은 자신이 보는 호의 크기의 절반이에요.', '따라서 $\\angle A+\\angle C=360^\\circ/2=180^\\circ$예요.', 4, 5)
    ]);
    fs.forEach(f => { const q = f.pk, k = q.kind, expr = `2x${q.c1 >= 0 ? '+' + q.c1 : '-' + (-q.c1)}`;
      make(f, ['∠D 계산', '∠C 계산', '방정식'][k], '마주 보는 두 각의 합 활용', [
        ch('조건과 구하는 값', k === 2 ? `각 A는 (x+${q.a1})°, 각 C는 (${expr})°예요.` : `주어진 각 ${k === 0 ? 'B' : 'A'}는 ${k === 0 ? q.b : q.a}°예요.`, k === 2 ? 'A와 C가 마주 보는 두 각인지 확인해요.' : `구하는 각 ${k === 0 ? 'D' : 'C'}는 주어진 각과 마주 봐요.`, 0, 1),
        ch('원주각과 두 호 연결', '두 각이 보는 호를 합하면 원 전체를 이루어요.', k === 2 ? `$(x+${q.a1})+(${expr})=180$으로 식을 세워요.` : '내접사각형의 마주 보는 두 각의 합은 180°예요.'),
        ch('모르는 각 또는 x 계산', k === 2 ? `$3x=${180 - q.a1 - q.c1}$에서 양변을 3으로 나누어요.` : `$x=180^\\circ-${k === 0 ? q.b : q.a}^\\circ$를 계산해요.`, done(f), 4, 5)
      ]);
    });
  }
  {
    const fs = [0, 1, 2].map(k => fixture('c5-2', k));
    concept(fs[0], '외각 원리', '한 외각과 마주 보는 내각', '$\\angle DCE=\\angle A$', 'BC의 연장선 위에 E가 있을 때 외각 DCE와 내각 A의 관계를 설명해 보세요.', [
      ch('연장선 위의 외각', '점 B, C, E는 한 직선 위에 있어요.', 'C에서 내각 BCD와 외각 DCE를 구별해요.', 0, 1),
      ch('두 가지 보각 관계', '내접사각형이므로 각 A와 내각 BCD의 합이 180°예요.', '일직선이므로 내각 BCD와 외각 DCE의 합도 180°예요.'),
      ch('공통인 내각 없애기', '두 식에서 같은 내각 BCD를 빼요.', '따라서 $\\angle DCE=\\angle A$예요.', 4, 5)
    ]);
    fs.forEach(f => { const q = f.pk, k = q.kind; make(f, ['외각 계산', '대각 계산', '내각 계산'][k], '외각과 내각 구별하기', [
      ch('그림의 연장선 확인', k === 0 ? `내각 A=${q.a}°이고 외각 DCE를 구해요.` : `외각 DCE=${q.a}°이고 ${k === 1 ? '내각 A' : '내각 BCD'}를 구해요.`, 'BC를 C 쪽으로 연장한 선 위에 점 E가 있어요.', 0, 1),
      ch('두 보각 관계 선택', '내각 BCD는 내각 A와 더해도, 외각 DCE와 더해도 180°예요.', k === 2 ? '구하는 BCD는 주어진 외각에 이웃한 내각이에요.' : '내각 A와 외각 DCE는 같은 내각의 보각이에요.'),
      ch('구하는 각 계산', k === 2 ? `$x=180^\\circ-${q.a}^\\circ$를 계산해요.` : '같은 각의 보각이므로 외각과 그 대각은 크기가 같아요.', done(f), 4, 5)
    ]); });
  }
  {
    const fs = [0, 1, 2].map(k => fixture('c5-3', k));
    concept(fs[0], '연장선 원리', '두 교점의 각을 연결하기', '$\\angle P+\\angle Q+2\\angle A=180^\\circ$', '두 쌍의 대변을 연장한 교점 P, Q의 각과 내각 A의 관계를 설명해 보세요.', [
      ch('연장선이 만드는 삼각형', 'P에서 삼각형 PAD, Q에서 삼각형 QAB를 찾아요.', '두 삼각형 모두 내접사각형의 각 A를 포함해요.', 0, 1),
      ch('삼각형의 내각 합 두 번', '$\\angle P+\\angle A+\\angle D=180^\\circ$예요.', '$\\angle Q+\\angle A+\\angle B=180^\\circ$예요.'),
      ch('내접사각형의 대각 적용', '두 식을 더하면 각 A가 두 번 들어가요.', '내접사각형이므로 각 B와 각 D의 합은 180°예요.', 3, 4),
      ch('관계식 정리', '더한 두 내각 합 360°에서 각 B와 각 D의 합을 빼요.', '따라서 $\\angle P+\\angle Q+2\\angle A=180^\\circ$예요.', 4, 5)
    ]);
    fs.forEach(f => { const q = f.pk, k = q.kind, a = (180 - q.p - q.q) / 2; make(f, ['∠A 계산', '∠Q 계산', '∠B 계산'][k], '두 연장선의 교점 활용', [
      ch('주어진 각의 위치', k === 1 ? `내각 A=${a}°, 교점의 각 P=${q.p}°예요.` : `교점의 각은 P=${q.p}°, Q=${q.q}°예요.`, '삼각형 PAD와 QAB의 각을 내접사각형과 연결해요.', 0, 1),
      ch('두 내각 합 더하기', '두 삼각형의 내각 합을 더하면 각 A가 두 번 나와요.', '$\\angle P+\\angle Q+2\\angle A=180^\\circ$예요.'),
      ch('먼저 필요한 각 찾기', k === 1 ? `$\\angle Q=180^\\circ-${q.p}^\\circ-2\\times${a}^\\circ$예요.` : `$2\\angle A=180^\\circ-${q.p}^\\circ-${q.q}^\\circ$예요.`, k === 2 ? `각 A=${a}°를 구한 뒤 삼각형 QAB를 보아요.` : '모르는 각에 곱해진 수까지 확인해 계산해요.', 3, 4),
      ch('목표 각 결론', k === 2 ? `$\\angle B=180^\\circ-${a}^\\circ-${q.q}^\\circ$예요.` : '구하는 각은 그림에서 x가 표시된 각이에요.', done(f), 4, 5)
    ]); });
  }
  {
    const fs = [0, 1, 2].map(k => fixture('c5-4', k));
    concept(fs[0], '두 호의 합', '내접오각형에 보조선 긋기', '$\\angle ACE=\\angle B+\\angle D-180^\\circ$', '내접오각형에서 보조선 AC, CE와 각 B, D가 보는 호로 각 ACE를 설명해 보세요.', [
      ch('대각선 AC와 CE', '두 대각선을 그으면 현 EA를 보는 원주각 ACE가 생겨요.', '각 B는 호 CDEA, 각 D는 호 EABC를 보아요.', 0, 1),
      ch('겹쳐서 세는 호 찾기', '두 호의 크기는 각각 각 B와 각 D의 두 배예요.', '두 호를 합치면 원 전체에 호 EA가 한 번 더 들어가요.'),
      ch('호와 원주각 연결', '$2\\angle B+2\\angle D=360^\\circ+\\text{호 EA}$예요.', '호 EA의 절반이 원주각 ACE예요.', 3, 4),
      ch('양변을 절반으로', '전체 호 360°를 절반으로 바꾸면 180°예요.', '따라서 $\\angle ACE=\\angle B+\\angle D-180^\\circ$예요.', 4, 5)
    ]);
    fs.forEach(f => { const q = f.pk, k = q.kind, x = q.B0 + q.D0 - 180; make(f, ['ACE 계산', '∠D 역산', '∠B 역산'][k], '내접오각형의 각 구하기', [
      ch('조건과 보조선', k === 0 ? `각 B=${q.B0}°, 각 D=${q.D0}°이고 ACE를 구해요.` : `각 ACE=${x}°, 각 ${k === 1 ? 'B' : 'D'}=${k === 1 ? q.B0 : q.D0}°예요.`, 'AC와 CE를 그어 호 EA를 보는 각 ACE를 확인해요.', 0, 1),
      ch('두 호의 합 이용', '각 B와 각 D가 보는 호에는 원 전체와 호 EA가 들어가요.', '$\\angle B+\\angle D=180^\\circ+\\angle ACE$예요.'),
      ch('목표 각만 남기기', k === 0 ? `$\\angle ACE=${q.B0}^\\circ+${q.D0}^\\circ-180^\\circ$예요.` : k === 1 ? `$\\angle D=180^\\circ+${x}^\\circ-${q.B0}^\\circ$예요.` : `$\\angle B=180^\\circ+${x}^\\circ-${q.D0}^\\circ$예요.`, done(f), 4, 5)
    ]); });
  }
  {
    const fs = [0, 1, 2].map(k => fixture('c5-5', k));
    const statements = ['$\\angle B+\\angle D=180^\\circ$', '$\\angle DCE=\\angle A$', '$\\angle ABD=\\angle ACD$'];
    fs.forEach((f, k) => concept(f, ['대각 조건', '외각 조건', '같은 쪽 각'][k], '사각형이 원에 내접할 조건', statements[k], ['마주 보는 두 각으로 네 점이 한 원 위에 놓이는 조건을 설명해 보세요.', '변 BC의 연장선 위에 E가 있을 때 외각과 대각의 내접 조건을 설명해 보세요.', 'B와 C가 선분 AD의 같은 쪽에 있을 때 네 점의 내접 조건을 설명해 보세요.'][k], [
      ch('네 점과 기준 확인', ['B와 D는 마주 보는 꼭짓점이에요.', 'B, C, E는 한 직선 위에 있어요.', '두 점 B와 C는 현 AD의 같은 쪽에 있어요.'][k], ['두 각이 이웃한 각인지 마주 보는 각인지 구별해요.', '외각 DCE와 이웃한 내각 BCD를 구별해요.', 'B와 C에서 같은 선분 AD를 보는 두 각을 비교해요.'][k], 0, 1),
      ch('원 위의 각 관계', ['내접사각형의 대각은 원 전체를 나누는 두 호를 봐요.', '내각 BCD의 보각으로 외각 DCE와 대각 A가 연결돼요.', '같은 호 AD를 보는 두 원주각은 크기가 같아요.'][k], '이 성질의 역으로 네 점이 한 원 위에 있는지 확인해요.'),
      ch('내접 조건 정리', ['두 호의 합 360°의 절반을 사용해요.', '두 보각 관계에서 공통인 내각 BCD를 없애요.', '두 꼭짓점이 현의 같은 쪽이라는 조건을 꼭 확인해요.'][k], `따라서 ${statements[k]}이면 네 점이 한 원 위에 있어요.`, 4, 5)
    ]));
    fs.forEach(f => { const q = f.pk, k = q.kind, given = Math.round(G.angBetween(f.g.B, f.g.A, f.g.D)); make(f, ['대각 계산', '외각 계산', '원주각 계산'][k], '내접하도록 하는 각 구하기', [
      ch('내접 조건이 필요한 문제', k === 0 ? `각 B=${q.a}°이고 마주 보는 각 D를 구해요.` : k === 1 ? `외각 DCE=${q.a}°이고 대각 A를 구해요.` : `같은 쪽의 각 ABD=${given}°이고 ACD를 구해요.`, k === 2 ? 'B와 C가 현 AD의 같은 쪽인지 확인해요.' : '네 꼭짓점이 같은 원 위에 놓이도록 조건을 세워요.', 0, 1),
      ch('알맞은 내접 조건 선택', k === 0 ? '마주 보는 두 각의 합은 180°여야 해요.' : k === 1 ? '한 외각과 그 대각의 크기는 같아야 해요.' : '같은 쪽에서 선분 AD를 보는 두 각은 같아야 해요.', `사용할 식은 ${statements[k]}예요.`),
      ch('필요한 각 결정', k === 0 ? `$\\angle D=180^\\circ-${q.a}^\\circ$예요.` : '선택한 등각 관계에 주어진 각의 크기를 넣어요.', done(f), 4, 5)
    ]); });
  }
  {
    function shape(ty) {
      const kind = ty <= 2 ? 0 : ty <= 4 ? 1 : 2;
      for (let seed = 1; seed <= 64; seed++) { const f = fixture('c5-6', kind, seed); if (f.pk.ty === ty) return f; }
      throw new Error('원문 사각형 유형을 찾지 못함: ' + ty);
    }
    const fs = [0, 1, 2, 3, 4, 5].map(shape);
    concept(fs[0], '판정 기준', '항상 내접하는 사각형 판단', '마주 보는 두 각의 합이 180°', '네 변의 길이보다 마주 보는 두 각의 합으로 원에 내접하는지 설명해 보세요.', [
      ch('사각형의 모양과 각', 'A와 C처럼 마주 보는 두 각을 골라요.', '이웃한 두 각이나 같은 변의 길이와 구별해요.', 0, 1),
      ch('필요충분조건 사용', '네 점이 한 원 위에 놓일 조건을 각으로 확인해요.', 'A, B, C를 지나는 원에 D까지 놓일 수 있는지 판단해요.'),
      ch('내접 여부의 기준', '마주 보는 두 각을 더해 기준값과 비교해요.', '따라서 마주 보는 두 각의 합이 180°이면 원에 내접해요.', 4, 5)
    ]);
    fs.forEach(f => { const g = f.g, ty = f.pk.ty, answer = g.cyc ? '원에 내접해요' : '원에 내접하지 않아요';
      make(f, ['직사각형', '정사각형', '등변사다리꼴', '평행사변형', '마름모', '일반사다리꼴'][ty], '사각형 종류별 내접 판정', [
        ch('주어진 모양과 각', `그림은 ${g.name}이고 각 A=${g.a}°, 각 C=${g.cc}°예요.`, '두 각은 사각형에서 서로 마주 보는 각이에요.', 0, 1),
        ch('모양의 이름과 판정 구별', ty <= 1 ? '네 내각이 직각이라는 조건을 사용해요.' : ty === 2 ? '등변사다리꼴은 같은 밑변의 두 각이 같아요.' : ty <= 4 ? '일반적인 평행사변형이나 마름모의 대각은 서로 같아요.' : '평행한 한 쌍의 변만으로는 내접이 보장되지 않아요.', ty === 3 ? '평행사변형은 직사각형일 때만 내접할 수 있어요.' : ty === 4 ? '마름모는 정사각형일 때만 내접할 수 있어요.' : '마주 보는 각의 합이 180°인지 확인해야 해요.'),
        ch('두 각의 합으로 결론', `$${g.a}^\\circ+${g.cc}^\\circ=${g.a + g.cc}^\\circ$로 계산해요.`, `따라서 이 사각형은 ${answer}. 정답은 ${G.NUM[f.Q.choices.findIndex(c => c.ok)]}예요.`, 4, 5)
      ], { answer: g.cyc ? '원에 내접' : '내접하지 않음' });
    });
  }

  for (const id of Object.keys(lessons).filter(id => /^c[567]-/.test(id))) {
    const D = source(id);
    D.lessonQuestion = (M, s) => s.ciLessonProblem ? null : s.ciCQuestion;
    D.lessonAfterDraw = (b, s, M, C) => {
      const amount = C.entry ? 0 : s.ciCTrace || 0;
      if (!(amount > 0)) return;
      const g = M.g, pair = id === 'c7-2' ? [g.C, g.D] : id === 'c7-1' ? [G.pt(0, 0), g.A] : id === 'c6-8' ? [g.P, g.T] : g.P ? [g.P, g.A] : [g.A, g.B || g.C];
      G.line(b, pair[0], G.lerp(pair[0], pair[1], Math.min(1, amount)), 'amber', 5, { alpha: .78 });
    };
  }
})();
