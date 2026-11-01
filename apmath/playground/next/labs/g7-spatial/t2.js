/* ==========================================================================
   중1 · 위치 관계 — 탭 ② 「공간에서의 설명」 (t2.js, order 20) — 장면 7개
   · s2-1 [함정] 한 직선에 수직인 두 직선 · s2-2 한 평면에 평행한 두 직선 · s2-3 한 평면에 수직인 두 직선(참)
   · s2-4 [함정] 한 평면에 수직인 두 평면 · s2-5 한 직선에 수직인 두 평면(참) · s2-6 [함정] 수직인 직선에 수직인 직선
   · s2-7 옳은 설명 찾기 — 보기 ①~⑤를 그림으로 하나씩 확인(반례 찾기)
   조건은 지키고 결론이 깨지는 그림(반례)을 막대로 만들어 보고, 지금 두 대상의 위치 관계가 그림 위에 숫자와 글로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SP;
  if (!G || !G.stmt) return;
  const { NUM, pick, shuffle, VIEW, rd, notes, mkText, scene3, buildSolid, drawSolid, drawVerts } = G;
  const { STM, PARAMS, render, ab, abAt, setAB } = G.stmt;
  const WORD = { same: '일치', parallel: '평행', meet: '만나는 위치', skew: '꼬인 위치', perp: '수직', sub: '평면에 포함' };
  const cop = (w) => { const c = w.charCodeAt(w.length - 1) - 0xac00; return c >= 0 && c % 28 !== 0 ? '이에요' : '예요'; }; // 받침 있으면 이에요, 없으면 예요
  const TRUE_IDS = Object.keys(STM).filter((k) => STM[k].truth), FALSE_IDS = Object.keys(STM).filter((k) => !STM[k].truth);
  const WHY = {
    p1: 'l⊥m, l⊥n이어도 m과 n은 꼬인 위치이거나 한 점에서 만날 수 있어요.',
    p2: '평면 P와 평행한 두 직선도 꼬인 위치이거나 한 점에서 만날 수 있어요.',
    p4: '바닥에 수직인 두 벽 Q, R은 교선에서 만날 수 있어요.',
    p6: '직선 m이 평면 P 위에 놓일 수도 있어요. 그러면 평행이 아니에요.',
    perp: '평면 위의 한 직선과만 수직이면 l이 기울어질 수 있어요. 서로 다른 두 직선과 모두 수직이어야 해요.'
  };
  // 문제 탭의 참고 그림: 글로 된 설명을 직육면체의 모서리·면에 대 보며 반례를 찾아볼 수 있어요.
  function refCuboid(b, s, C) {
    const D = scene3(b, s, C), sol = buildSolid('cuboid');
    D.fitPts(sol.order.map((k) => sol.verts[k]), { t: 52, b: 56, l: 44, r: 44 });
    drawSolid(D, sol, () => ({ color: 'ink', width: 3.2 }), { faceAlpha: 0.06 });
    drawVerts(D, sol, {});
    if (C.txt) b.stext(14, b.insets.top + 24, '참고 그림: 직육면체의 모서리와 면으로 반례를 찾아보세요', { color: 'amber', size: b.W < 560 ? 13 : 15, weight: 800, align: 'left', baseline: 'middle' });
    D.flush();
  }
  const span = (c, t) => `<b style="color:var(--m-${c})">${t}</b>`;

  /* 문제의 보기(설명 5개): 옳은 것은 정확히 하나 */
  function makeBank(main) {
    const ids = [];
    if (main && STM[main].truth) { ids.push(main); shuffle(FALSE_IDS).slice(0, 4).forEach((k) => ids.push(k)); }
    else {
      ids.push(pick(TRUE_IDS)); if (main) ids.push(main);
      shuffle(FALSE_IDS.filter((k) => k !== main)).slice(0, 5 - ids.length).forEach((k) => ids.push(k));
    }
    return shuffle(ids);
  }
  const bankProb = (bank, key, noteTxt) => {
    const items = bank.map((k) => ({ h: STM[k].text, p: STM[k].text.replace(/\$/g, ''), ok: STM[k].truth, hint: WHY[k] || '' }));
    return { tag: '공간에서의 옳은 설명', key: key + '|' + bank.join(','), stem: '다음 중 옳은 것은? (서로 다른 직선은 $l, m, n$, 서로 다른 평면은 $P, Q, R$이다.)', choices: mkText(items), wide: true, note: noteTxt };
  };

  /* ---------------- 설명 하나짜리 장면 */
  function propScene(o) {
    const st = STM[o.stm];
    const D = {
      id: o.id, title: o.title, short: o.short, question: o.question,
      ctl: (s) => st.ctl.concat(VIEW),
      anim: { key: 'spT', dur: 5, label: st.truth ? '다른 자리로 옮겨 보기' : '반례 만들어 보기', start: 0 },
      onAnim: (s, t) => setAB(st, s, abAt(st, t)),
      problemT: 0,
      stepT: (n) => (n >= 2 ? 1 : 0),
      init: (s) => { setAB(st, s, st.init); s.spT = 0; s.spBank = makeBank(o.stm); },
      reroll: (s) => { s.spBank = makeBank(o.stm); },
      model: (s) => {
        const bank = s.spBank || makeBank(o.stm), g0 = st.geo(st.init.a, st.init.b), g1 = st.geo(st.cex.a, st.cex.b), cur = st.geo(ab(st, s).a, ab(st, s).b);
        return { o, st, bank, g0, g1, cur };
      },
      draw(b, s, M, C) {
        if (C.problem) { refCuboid(b, s, C); return; }
        const Dr = scene3(b, s, C);
        const v = C.review ? abAt(st, C.t) : C.thumb ? st.cex : ab(st, s);
        render(Dr, st, v, C, { caption: true });
      },
      steps: (M) => {
        const { st: S, g1 } = M;
        const rel = WORD[g1.rel] || g1.rel;
        return [
          o.given,
          o.cex(M, rel),
          S.truth ? `반례를 찾을 수 없어요. 그러므로 이 설명은 항상 옳아요(참).` : `조건은 그대로인데 결론이 틀려요. 반례가 있으니 이 설명은 거짓이에요.`
        ];
      },
      view: (M, C, s) => {
        const { st: S, cur } = M;
        const rows = [rd('조건', cur.given ? '모두 지켜요' : '깨졌어요', cur.given ? 'green' : 'rose'), rd(`결론 ${S.geo(0, 0).conc}`, cur.holds ? '성립해요' : '성립하지 않아요', cur.holds ? 'green' : 'red', cur.given && !cur.holds ? '반례예요' : ''), rd('지금 두 대상', cur.relText.replace(/^[^:]*: ?/, ''), 'amber', null, null, true)];
        return {
          guide: `${o.guide} 그림 맨 위에 지금의 위치 관계가 나와요. 조건은 그대로 두고 <b>결론이 깨지는 모양</b>(반례)을 만들 수 있는지 살펴보세요. ▶를 누르면 자동으로 보여 줘요.`,
          readouts: rows,
          formula: `<p>설명: ${S.text}</p><p>${S.truth ? span('green', '참') + ' — 반례가 없어요.' : span('red', '거짓') + ' — ' + WHY[o.stm]}</p>`,
          rule: o.rule,
          notes: notes.apply(null, o.tips)
        };
      },
      prob: (M) => bankProb(M.bank, o.id, '탐구 탭의 그림으로 반례를 찾아 확인해 보세요.')
    };
    return D;
  }

  const S = [];
  S.push(propScene({
    id: 's2-1', stm: 'p1', title: '[함정] 한 직선에 수직인 두 직선', short: '[함정] 직선에 수직인 두 직선',
    question: '직선 $l$에 수직인 두 직선 $m$, $n$은 서로 평행할까? 종이 위(평면)에서는 그렇지만 공간에서도 그럴까?',
    guide: '가로로 놓인 막대 $l$에 수직인 직선 $m$과 $n$이 있어요. 막대로 $n$을 $l$ 둘레로 돌리고, $l$을 따라 가로로 옮겨 보세요.',
    given: '조건대로 그려요. 직선 $l$에 수직인 두 직선 $m$, $n$을 그려요. $n$은 $l$과 수직인 채로 $l$ 둘레를 돌고 $l$을 따라 옮길 수 있어요.',
    cex: (M, rel) => `$n$을 $l$ 둘레로 돌리면 $m$과 $n$의 위치 관계는 ${rel}${cop(rel)}. (같은 자리로 옮기면 한 점에서 만나요)`,
    rule: '평면에서는 같은 직선에 수직인 두 직선이 평행하지만, 공간에서는 평행하지 않을 수 있다',
    tips: ['“평면에서 참”이어도 공간에서는 거짓일 수 있어요. 공간에서는 회전 방향이 하나 더 있어요.', '꼬인 위치도 $l$과 수직으로 만나는 직선들이에요.'],
    pnote: ''
  }));
  S.push(propScene({
    id: 's2-2', stm: 'p2', title: '한 평면에 평행한 두 직선', short: '평면에 평행한 두 직선',
    question: '평면 $P$와 평행한 두 직선 $l$, $m$은 서로 평행할까?',
    guide: '뒤의 벽 $P$와 나란한 두 직선 $l$, $m$이 있어요. 막대로 $m$을 제자리에서 돌리고, 앞뒤로 옮겨 보세요.',
    given: '조건대로 그려요. 평면 $P$와 평행한 두 직선 $l$, $m$을 그려요. $m$은 $P$와 평행한 채로 돌거나 앞뒤로 옮길 수 있어요.',
    cex: (M, rel) => `$m$을 돌리고 옮기면 $l$과 $m$의 위치 관계는 ${rel}${cop(rel)}. ($l$과 같은 평면 위로 옮기면 한 점에서 만나요)`,
    rule: '한 평면에 평행한 두 직선은 평행할 수도, 만날 수도, 꼬인 위치일 수도 있다',
    tips: ['“평면과 평행하다”는 평면과 만나지 않는다는 뜻이에요. 두 직선끼리의 관계는 정해지지 않아요.'],
    pnote: ''
  }));
  S.push(propScene({
    id: 's2-3', stm: 'p3', title: '한 평면에 수직인 두 직선', short: '평면에 수직인 두 직선',
    question: '평면 $P$에 수직인 두 직선 $l$, $m$은 항상 평행할까? 아무리 옮겨 세워도 그럴까?',
    guide: '바닥 $P$에 수직으로 세운 두 기둥 $l$, $m$이 있어요. 막대로 $m$의 자리를 옮겨 보세요. $m$을 기울이면 바닥과 수직이 아니라서 조건이 깨져요.',
    given: '조건대로 그려요. 평면 $P$에 수직인 두 직선 $l$, $m$을 세워요.',
    cex: (M, rel) => `$m$을 다른 자리에 세워도 $l$과 $m$의 위치 관계는 계속 ${rel}${cop(rel)}.`,
    rule: '한 평면에 수직인 두 직선은 평행하다',
    tips: ['수직으로 세우면 방향이 하나로 정해져서 항상 평행해요.', '한 점을 지나 바닥에 수직인 직선은 오직 하나예요.'],
    pnote: ''
  }));
  S.push(propScene({
    id: 's2-4', stm: 'p4', title: '[함정] 한 평면에 수직인 두 평면', short: '[함정] 평면에 수직인 두 평면',
    question: '평면 $P$에 수직인 두 평면 $Q$, $R$은 서로 평행할까? 방의 앞벽과 옆벽을 떠올려 보자.',
    guide: '바닥 $P$에 수직으로 선 벽 $Q$와 $R$이 있어요. 막대로 벽 $R$을 돌리거나 앞뒤로 옮겨 보세요.',
    given: '조건대로 그려요. 바닥 $P$에 수직인 두 벽 $Q$, $R$을 세워요. $R$은 바닥에 수직인 채로 돌 수 있어요.',
    cex: (M, rel) => `벽 $R$을 돌리면 $Q$와 $R$은 교선에서 만나요.`,
    rule: '한 평면에 수직인 두 평면은 평행할 수도 있고 만날 수도 있다',
    tips: ['“바닥에 수직인 두 직선”은 평행하지만 “바닥에 수직인 두 평면”은 평행하지 않을 수 있어요.', '방의 모서리가 바로 두 벽의 교선이에요.'],
    pnote: ''
  }));
  S.push(propScene({
    id: 's2-5', stm: 'p5', title: '한 직선에 수직인 두 평면', short: '직선에 수직인 두 평면',
    question: '직선 $l$에 수직인 두 평면 $P$, $Q$는 항상 평행할까?',
    guide: '막대 $l$에 수직으로 세운 두 판 $P$, $Q$가 있어요. 막대로 $Q$를 $l$을 따라 앞뒤로 옮겨 보세요. $Q$를 기울이면 $l$과 수직이 아니라서 조건이 깨져요.',
    given: '조건대로 그려요. 직선 $l$에 수직인 두 평면 $P$, $Q$를 놓아요.',
    cex: (M, rel) => `$Q$를 $l$을 따라 옮겨도 $P$와 $Q$는 평행해요.`,
    rule: '한 직선에 수직인 두 평면은 평행하다',
    tips: ['직선에 수직인 평면은 기울기가 하나로 정해져요. 그래서 두 평면은 평행해요.', '앞의 “한 평면에 수직인 두 직선은 평행” 과 짝으로 외워요.'],
    pnote: ''
  }));
  S.push(propScene({
    id: 's2-6', stm: 'p6', title: '[함정] 수직인 직선에 수직인 직선', short: '[함정] 수직인 직선과 평면',
    question: '$l\\perp P$이고 $l\\perp m$이면 $m$은 평면 $P$와 평행할까?',
    guide: '벽 $P$에 수직으로 박힌 막대 $l$과, $l$에 수직인 직선 $m$이 있어요. 막대로 $m$을 앞뒤로 옮겨 벽(평면 $P$)에 닿게 해 보세요.',
    given: '조건대로 그려요. 평면 $P$에 수직인 직선 $l$과, $l$에 수직인 직선 $m$을 그려요. $P$에서 떨어져 있는 $m$은 $P$와 평행해요.',
    cex: (M, rel) => `$m$을 평면 $P$ 쪽으로 옮겨 닿게 하면 $m$은 평면 $P$ 위에 놓여요. 평면에 포함되고 평행이 아니에요.`,
    rule: '$l\\perp P$, $l\\perp m$이어도 직선 $m$이 평면 $P$에 포함될 수 있어서 $m\\parallel P$라고 할 수 없다',
    tips: ['“평면 $P$ 밖에 있는 직선 $m$”이라는 조건이 있으면 참이에요. 그 말이 없으면 거짓이에요.', '평행은 만나지 않는 것이라서, 평면 위에 놓인 직선은 평행이 아니에요.'],
    pnote: ''
  }));

  /* ---------------- s2-7 옳은 설명 찾기 (보기 ①~⑤) */
  const five = {
    id: 's2-7', title: '옳은 설명 찾기 (보기 5개)', short: '옳은 설명 찾기',
    question: '다섯 가지 설명 중 옳은 것은 몇 번일까? 설명마다 그림으로 반례를 찾아보자.',
    ctl: (s) => STM[(s.spBank || makeBank(null))[s.spSel || 0]].ctl.concat(VIEW),
    anim: { key: 'spT', dur: 5, label: '반례 만들어 보기', start: 0 },
    onAnim: (s, t) => { const st = STM[s.spBank[s.spSel || 0]]; setAB(st, s, abAt(st, t)); },
    problemT: 0,
    stepT: (n) => (n >= 2 ? 1 : 0),
    presets: (s) => (s.spBank || makeBank(null)).map((k, i) => ({ group: i === 0 ? '보기 고르기' : '', label: `${NUM[i]} 그림 보기`, apply: (st) => { st.spSel = i; st.spT = 0; setAB(STM[st.spBank[i]], st, STM[st.spBank[i]].init); }, on: (st) => (st.spSel || 0) === i })),
    init: (s) => { s.spBank = makeBank(null); s.spSel = 0; s.spT = 0; setAB(STM[s.spBank[0]], s, STM[s.spBank[0]].init); },
    reroll: (s) => { s.spBank = makeBank(null); s.spSel = 0; s.spT = 0; setAB(STM[s.spBank[0]], s, STM[s.spBank[0]].init); },
    model: (s) => {
      const bank = s.spBank || makeBank(null), sel = clampSel(s.spSel, bank), st = STM[bank[sel]], ok = bank.findIndex((k) => STM[k].truth);
      const firstFalse = bank.findIndex((k) => !STM[k].truth);
      return { bank, sel, st, ok, firstFalse, cur: st.geo(ab(st, s).a, ab(st, s).b) };
    },
    draw(b, s, M, C) {
      if (C.problem) { refCuboid(b, s, C); return; }
      const Dr = scene3(b, s, C);
      let st = M.st, v = ab(st, s);
      if (C.review) { const k = C.step >= 3 ? M.ok : M.firstFalse; st = STM[M.bank[k]]; v = abAt(st, C.t); } else if (C.thumb) v = st.cex;
      render(Dr, st, v, C, { caption: !C.problem });
      if (C.txt && !C.problem) {
        const k = C.review ? (C.step >= 3 ? M.ok : M.firstFalse) : M.sel;
        b.stext(14, b.insets.top + 44, `보기 ${NUM[k]}번`, { color: 'amber', size: 16, weight: 800, align: 'left', baseline: 'middle' });
      }
    },
    steps: (M) => {
      const falses = M.bank.map((k, i) => (STM[k].truth ? null : NUM[i])).filter(Boolean).join(', ');
      return [
        '보기를 하나씩 그림으로 그려요. 설명의 조건을 모두 지키는 그림이어야 해요.',
        `각 보기에서 결론이 깨지는 반례를 찾아요. 반례가 있는 보기는 ${falses}이에요. 이 보기들은 거짓이에요.`,
        `반례를 찾을 수 없는 보기 ${NUM[M.ok]}만 항상 옳아요.`
      ];
    },
    view: (M) => {
      const { st, cur, sel, bank } = M;
      return {
        guide: `위의 <b>보기 그림 보기</b> 칩으로 보기 ①~⑤를 바꿔 가며 그림을 확인해요. 막대로 조건은 그대로 두고 결론을 깨 보세요. 반례를 만들 수 있으면 그 보기는 거짓이에요.<br><b>보기 ${NUM[sel]}</b> ${st.text}`,
        readouts: [rd('조건', cur.given ? '모두 지켜요' : '깨졌어요', cur.given ? 'green' : 'rose'), rd('결론', cur.holds ? '성립해요' : '성립하지 않아요', cur.holds ? 'green' : 'red', cur.given && !cur.holds ? '반례예요' : ''), rd('지금 두 대상', cur.relText.replace(/^[^:]*: ?/, ''), 'amber', null, null, true)],
        formula: bank.map((k, i) => `<p>${NUM[i]} ${STM[k].text} → ${STM[k].truth ? span('green', '참') : span('red', '거짓')}</p>`).join(''),
        rule: '반례를 하나라도 찾으면 그 설명은 거짓, 아무리 해도 반례가 없으면 참이다',
        notes: notes('“항상” 성립해야 참이에요. 반례가 한 번이라도 나오면 거짓이에요.', '직선에 수직인 평면과 평면에 수직인 직선(기둥)이 가장 많이 헷갈려요.', '평면에 수직인 두 직선은 평행(참), 평면에 수직인 두 평면은 평행하지 않을 수 있어요(거짓).')
      };
    },
    prob: (M) => bankProb(M.bank, 's2-7', '탐구 탭의 보기 그림으로 반례를 찾아 확인해 보세요.')
  };
  function clampSel(i, bank) { return Math.max(0, Math.min(bank.length - 1, i | 0)); }
  S.push(five);

  G.register(20, 't2', '② 참·거짓과 반례', '참·거짓과 반례', PARAMS, S);
})();
