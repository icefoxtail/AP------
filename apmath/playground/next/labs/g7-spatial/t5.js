/* ==========================================================================
   중1 · 위치 관계 — 탭 ⑤ 「직선·평면의 수직과 평행」 (t5.js, order 50) — 장면 3개
   · s5-1 직선과 평면의 수직(한 직선과만 수직이면?)  · s5-2 두 평면의 수직(문짝과 경첩)  · s5-3 평행한 두 평면과 교선
   그림은 stmt.js 의 설명 그림(perp · door · planes)을 쓰고, 문제는 입체의 면·모서리를 좌표로 따져 세어요.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SP;
  if (!G || !G.stmt) return;
  const { pick, rint, v3, add3, sub3, mul3, dot3, cross3, len3, unit3, mid3, scene3, buildSolid, drawSolid, drawVerts, VIEW, rd, notes, mkChoices } = G;
  const { STM, render, ab, abAt, setAB } = G.stmt;
  const span = (c, t) => `<b style="color:var(--m-${c})">${t}</b>`;

  /* 입체의 면·모서리를 좌표로 따져 셉니다 */
  const faceName = (f) => f.v.join('');
  const edgeDir = (sol, e) => sub3(sol.verts[e.v], sol.verts[e.u]);
  const perpEdges = (sol, fi) => sol.edges.filter((e) => len3(cross3(unit3(edgeDir(sol, e)), sol.faces[fi].n)) < 1e-6);      // 면에 수직인 모서리
  const perpFaces = (sol, fi) => sol.faces.map((f, i) => i).filter((i) => i !== fi && Math.abs(dot3(sol.faces[i].n, sol.faces[fi].n)) < 1e-6); // 면에 수직인 면
  const parPairs = (sol) => { let c = 0; for (let i = 0; i < sol.faces.length; i++) for (let j = i + 1; j < sol.faces.length; j++) if (dot3(sol.faces[i].n, sol.faces[j].n) < -0.999999) c++; return c; };
  const solOf = (q) => buildSolid(q.kind, q.n || 6);
  const CASES = [
    { kind: 'prism', n: 3, face: 0 }, { kind: 'prism', n: 4, face: 0 }, { kind: 'prism', n: 5, face: 0 }, { kind: 'prism', n: 6, face: 0 },
    { kind: 'cuboid', n: 4, face: 2 }, { kind: 'cuboid', n: 4, face: 0 }, { kind: 'prism', n: 3, face: 2 }, { kind: 'prism', n: 5, face: 2 }, { kind: 'trap', n: 4, face: 2 }
  ];

  /* 설명 그림 장면의 공통 틀 */
  function stmtScene(o) {
    const st = STM[o.stm];
    return {
      id: o.id, title: o.title, short: o.short, question: o.question,
      ctl: () => st.ctl.concat(VIEW),
      anim: { key: 'spT', dur: 5, label: o.play, start: 0 },
      onAnim: (s, t) => setAB(st, s, abAt(st, t)),
      problemT: 0,
      stepT: o.rev ? (n) => (n >= 3 ? 0 : 1) : (n) => (n >= 2 ? 1 : 0),
      init: (s) => { setAB(st, s, st.init); s.spT = 0; s.spQ = o.q0; },
      reroll: (s) => { s.spQ = pick(o.cases, s.spQ); },
      model: (s) => { const q = s.spQ || o.q0, sol = solOf(q); return { q, sol, cur: st.geo(ab(st, s).a, ab(st, s).b), g0: st.geo(st.init.a, st.init.b), g1: st.geo(st.cex.a, st.cex.b) }; },
      draw(b, s, M, C) {
        const D = scene3(b, s, C);
        if (C.problem) { o.drawProb(D, b, M, C); return; }
        const v = C.review ? abAt(st, C.t) : C.thumb ? st.cex : ab(st, s);
        render(D, st, v, C, { caption: true });
      },
      steps: (M) => o.steps(M),
      view: (M) => ({
        guide: o.guide,
        readouts: [rd('조건', M.cur.given ? '모두 지켜요' : '깨졌어요', M.cur.given ? 'green' : 'rose'), rd(`결론 ${st.geo(0, 0).conc}`, M.cur.holds ? '성립해요' : '성립하지 않아요', M.cur.holds ? 'green' : 'red'), rd('지금의 상태', M.cur.relText, 'amber', null, null, true)].concat(o.extraRead ? o.extraRead(M) : []),
        formula: o.formula(M),
        rule: o.rule,
        notes: notes.apply(null, o.tips)
      }),
      prob: (M) => o.prob(M)
    };
  }
  const caseKey = (q) => `${q.kind}${q.n || ''}f${q.face}`;
  const drawSolidFace = (D, b, M, C, hl) => {
    const { sol, q } = M, f = sol.faces[q.face % sol.faces.length];
    D.fitPts(sol.order.map((k) => sol.verts[k]), { t: 46, b: 56, l: 44, r: 44 });
    drawSolid(D, sol, () => ({ color: 'ink', width: 3.2 }), { faceAlpha: 0.05 });
    if (hl) { if (D.facing(f.n)) D.fill(f.v.map((k) => sol.verts[k]), 'amber', 0.28); else D.path(f.v.map((k) => sol.verts[k]), 'amber', 3, { close: true, dash: [6, 5] }); D.path(f.v.map((k) => sol.verts[k]), 'amber', 4.4, { close: true }); }
    drawVerts(D, sol, { hot: (k) => hl && f.v.includes(k) });
    if (C.txt && hl) D.label(f.c, `면 ${faceName(f)}`, { color: 'amber', size: 17, at: [[0, 0], [0, 22], [0, -22]] });
    D.flush();
  };

  const S = [];
  S.push(stmtScene({
    id: 's5-1', stm: 'perp', title: '직선과 평면의 수직', short: '직선과 평면의 수직', rev: true, play: 'l을 쓰러뜨려 보기',
    question: '직선 $l$이 평면 $P$ 위의 한 직선과 수직이면 $l\\perp P$일까? 어떤 조건이 있어야 평면과 수직일까?',
    q0: { kind: 'prism', n: 3, face: 0 }, cases: CASES.slice(0, 4).concat([CASES[4]]),
    guide: '평면 $P$ 위의 두 직선 $m$, $n$이 한 점 $O$에서 만나요. 막대로 직선 $l$을 <b>세우거나 쓰러뜨려</b> 보세요. 기울어진 $l$은 $m$과는 수직이지만 $n$과는 아니에요.',
    steps: () => ['직선 $l$이 평면 $P$ 위의 직선 $m$과 수직이에요. 그런데 $l$은 $m$을 축으로 앞뒤로 쓰러질 수 있어요.', '평면 $P$ 위의 다른 직선 $n$과도 수직인지 살펴요. 기울어진 $l$은 $n$과 90°가 아니에요. 한 직선과만 수직이면 $l\\perp P$라고 할 수 없어요.', '점 $O$에서 만나는 서로 다른 두 직선 $m$, $n$과 모두 수직이면 $l$이 똑바로 서요. 그러면 $l\\perp P$이고 $P$ 위의 모든 직선과 수직이에요.'],
    formula: () => '<p>$l\\perp m,\\ l\\perp n$ ($m$, $n$은 점 $O$에서 만나는 평면 $P$ 위의 두 직선) $\\Rightarrow$ $l\\perp P$</p>',
    rule: '직선이 평면 위의 서로 다른 두 직선과 수직이면 그 평면과 수직이다',
    tips: ['평면 위의 <b>한 직선</b>과만 수직인 것은 부족해요. 서로 다른 <b>두 직선</b>과 수직이어야 해요.', '직선이 평면에 수직이면 평면 위의 모든 직선과 수직이에요. 거꾸로 두 직선만 확인하면 돼요.'],
    drawProb: (D, b, M, C) => drawSolidFace(D, b, M, C, true),
    prob: (M) => {
      const { sol, q } = M, fi = q.face % sol.faces.length, f = sol.faces[fi], ans = perpEdges(sol, fi).length;
      return {
        tag: '평면에 수직인 모서리', key: caseKey(q),
        stem: `그림은 ${sol.name}이다. 면 ${faceName(f)}와 수직인 모서리는 모두 몇 개인가?`,
        choices: mkChoices(ans, [[sol.edges.length - f.v.length, '면 위에 있지 않은 모서리의 개수예요. 비스듬한 모서리가 아니라 면에 수직인 모서리를 세요.'], [f.v.length, '면의 모서리의 개수예요. 그 모서리들은 면 위에 있어요.'], [ans + 1, '하나 더 세었어요.'], [ans - 1, '빠뜨리지 않고 세어 보세요.'], [sol.faces.length, '면의 개수예요.']], { unit: '개' }),
        note: '면에 수직인 모서리는 그 면과 90°로 만나는 모서리예요'
      };
    },
    extraRead: () => []
  }));
  S.push(stmtScene({
    id: 's5-2', stm: 'door', title: '두 평면의 수직 (문짝과 경첩)', short: '두 평면의 수직', play: '문 열어 보기',
    question: '평면 $P$에 수직인 직선 $l$을 포함하는 평면 $Q$는 문을 얼마나 열어도 $P$와 수직일까?',
    q0: { kind: 'cuboid', n: 4, face: 2 }, cases: CASES.slice(1),
    guide: '바닥 $P$에 수직으로 박은 경첩 $l$에 문 $Q$가 달려 있어요. 막대로 문을 열고 닫아 보세요. 두 평면이 만나는 교선과 직각 표시를 확인해요.',
    steps: () => ['바닥 평면 $P$에 수직인 직선 $l$(경첩)을 세워요.', '$l$을 포함하는 평면 $Q$(문)를 만들어요. 문을 얼마나 열어도 $Q$는 $l$을 포함해요.', '그러므로 $P\\perp Q$예요. 평면 $P$에 수직인 직선을 포함하는 평면은 $P$와 수직이에요.'],
    formula: (M) => `<p>$l\\perp P$이고 $l$이 평면 $Q$에 포함 $\\Rightarrow$ $P\\perp Q$</p><p>지금 문의 각: $${Math.round(M.cur.th)}^{\\circ}$ — 그래도 바닥과 수직이에요.</p>`,
    rule: '평면에 수직인 직선을 포함하는 평면은 그 평면과 수직이다',
    tips: ['교실 문이 얼마나 열리든 문짝은 바닥과 수직이에요. 경첩이 바닥에 수직이기 때문이에요.', '두 평면이 수직이면 한 평면의 직선이 다른 평면에 수직으로 서요.'],
    drawProb: (D, b, M, C) => drawSolidFace(D, b, M, C, true),
    prob: (M) => {
      const { sol, q } = M, fi = q.face % sol.faces.length, f = sol.faces[fi], ans = perpFaces(sol, fi).length;
      const par = sol.faces.filter((g, i) => i !== fi && dot3(g.n, f.n) < -0.999999).length;
      return {
        tag: '평면에 수직인 면', key: caseKey(q),
        stem: `그림은 ${sol.name}이다. 면 ${faceName(f)}와 수직인 면은 모두 몇 개인가?`,
        choices: mkChoices(ans, [[sol.faces.length - 1, '다른 면 모두를 셌어요. 평행한 면이나 비스듬한 면은 수직이 아니에요.'], [par, '평행한 면의 개수예요.'], [ans + 1, '하나 더 세었어요.'], [ans - 1, '빠뜨리지 않고 세어 보세요.'], [f.v.length, '면의 모서리의 개수예요.']], { unit: '개' }),
        note: '두 면이 90°로 만나면 수직이에요'
      };
    }
  }));
  S.push(stmtScene({
    id: 's5-3', stm: 'planes', title: '평행한 두 평면과 교선', short: '평행한 평면과 교선', play: '평면 R 기울여 보기',
    question: '평행한 두 평면 $P$, $Q$를 한 평면 $R$로 자를 때 생기는 두 교선 $l$, $m$은 평행할까, 꼬인 위치일까?',
    q0: { kind: 'cuboid', n: 4, face: 0 }, cases: [CASES[1], CASES[3], CASES[8], CASES[2], CASES[0]],
    guide: '평행한 두 평면 $P$, $Q$를 평면 $R$이 비스듬히 자르고 있어요. 막대로 $R$을 기울이거나 돌려 보세요. 두 교선 $l$, $m$의 위치 관계가 맨 위에 나와요.',
    steps: () => ['평행한 두 평면 $P$, $Q$를 평면 $R$로 잘라요. 두 교선 $l$, $m$이 생겨요.', '두 교선은 모두 같은 평면 $R$ 위에 있어요. 한 평면 위에 있는 두 직선은 꼬인 위치가 될 수 없어요.', '$P$와 $Q$가 만나지 않으니 $l$, $m$도 만나지 않아요. 한 평면 위에서 만나지 않는 두 직선은 평행이에요. 그러므로 $l\\parallel m$이에요.'],
    formula: () => '<p>$P\\parallel Q$일 때 평면 $R$이 두 평면과 만나는 교선 $l$, $m$ $\\Rightarrow$ $l\\parallel m$</p>',
    rule: '평행한 두 평면이 다른 평면과 만나서 생기는 두 교선은 평행하다',
    tips: ['두 교선이 같은 평면 $R$ 위에 있다는 것이 열쇠예요. 그래서 꼬인 위치가 아니에요.', '직육면체를 한 평면으로 자를 때 마주 보는 두 면에 생기는 단면의 변은 서로 평행해요.'],
    drawProb: (D, b, M, C) => {
      const { sol } = M;
      D.fitPts(sol.order.map((k) => sol.verts[k]), { t: 46, b: 56, l: 44, r: 44 });
      drawSolid(D, sol, () => ({ color: 'ink', width: 3.2 }), { faceAlpha: 0.05 });
      drawVerts(D, sol, {});
      D.flush();
    },
    prob: (M) => {
      const { sol, q } = M, ans = parPairs(sol);
      return {
        tag: '평행한 면의 쌍', key: caseKey(q),
        stem: `그림은 ${sol.name}이다. 이 입체에서 서로 평행한 두 면의 쌍은 모두 몇 쌍인가?`,
        choices: mkChoices(ans, [[sol.faces.length / 2, '면의 개수의 반이에요. 평행한 쌍은 마주 보는 면끼리만 짝이 돼요.'], [sol.faces.length, '면의 개수예요.'], [ans + 1, '하나 더 세었어요.'], [ans - 1, '밑면 한 쌍도 평행해요. 빠뜨리지 않았는지 보세요.'], [1, '밑면 한 쌍만 셌어요. 옆면에도 마주 보는 평행한 쌍이 있을 수 있어요.']], { unit: '쌍' }),
        note: '삼각기둥에서는 두 밑면만 평행하고, 옆면은 모두 서로 만나요'
      };
    }
  }));

  G.register(50, 't5', '⑤ 직선·평면의 수직과 평행', '수직과 평행', {}, S);
})();
