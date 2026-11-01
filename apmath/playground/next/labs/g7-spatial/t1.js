/* ==========================================================================
   중1 · 위치 관계 — 탭 ① 「꼬인 위치」 (t1.js, order 10) — 장면 7개
   · s1-1 직육면체 · s1-2 삼각기둥 · s1-3 사다리꼴기둥[함정] · s1-4 육각기둥[함정] · s1-5 사각뿔 · s1-6 사면체
   · s1-7 n각기둥 — n 을 바꾸면 모서리 수와 꼬인 모서리 수가 어떻게 달라지는지, 두 모서리를 골라 위치 관계 알아보기
   기준 모서리 하나를 정하면 나머지 모서리를 「만나는(빨강) · 평행한(파랑) · 꼬인 위치(초록)」로 자동 분류합니다.
   모든 글자·색·개수·정답은 지금의 입체와 기준 모서리로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SP;
  if (!G) return;
  const { clamp, pick, rint, buildSolid, classify, relEdges, edgeByKey, scene3, drawSolid, drawVerts, add3, mid3, lineMeetPoint, sub3, lerp3, len3, v3, P, VIEW, mkChoices, rd, notes, ov, DEG } = G;

  const PARAMS = {
    spExt: P('모서리 늘이기', 0, 1, 0.01, 1, { color: 'violet', hint: '두 모서리를 쭉 늘이면 한 점에서 만나는 것이 있어요', format: (v) => Math.round(v * 100) + '%' }),
    spN: P('밑면의 변의 수 n', 3, 8, 1, 6, { color: 'amber', hint: '막대를 움직여 n각기둥을 바꿔 보세요', format: (v) => `${Math.round(v)}각기둥` })
  };
  const RED = 'red', BLUE = 'sky', GREEN = 'green', AMB = 'amber', VIO = 'violet';
  const span = (c, t) => `<b style="color:var(--m-${c})">${t}</b>`;

  /* 장면 정의 공통 틀 */
  function skewScene(cfg) {
    const vary = !!cfg.pair; // s1-7 만 n 을 바꿀 수 있어요
    const nOf = (s) => (vary ? clamp(Math.round(s.spN), 3, 8) : cfg.n);
    const solOf = (s) => buildSolid(cfg.kind, nOf(s));
    return {
      id: cfg.id, title: cfg.title, short: cfg.short, question: cfg.question,
      ctl: (s) => (vary ? ['spN'] : []).concat(M0(s).nExt ? ['spExt'] : [], VIEW),
      presets: (s) => {
        const sol = solOf(s);
        return cfg.refs(sol).map((r, i) => ({ group: i === 0 ? '기준 모서리' : '', label: `${r.label} ${edgeByKey(sol, r.key).name}`, apply: (st) => { st.spRef = r.key; }, on: (st) => st.spRef === r.key }));
      },
      init: (s) => { s.spRef = cfg.refs(solOf(s))[0].key; s.spTgt = cfg.tgt || null; s.spExt = cfg.ext0 != null ? cfg.ext0 : 1; if (vary) s.spN = cfg.n0 || 6; },
      reroll: (s) => {
        const sol = solOf(s);
        if (vary) {
          s.spN = pick([3, 4, 5, 6, 7, 8], clamp(Math.round(s.spN), 3, 8));
          const so2 = solOf(s);
          s.spRef = pick(['t0', 't1', 's0', 's1'].filter((k) => so2.edges.some((e) => e.key === k)), s.spRef);
        } else s.spRef = pick(sol.edges.map((e) => e.key), s.spRef);
      },
      model: (s) => M0(s),
      draw, steps, view, prob,
      verify: (s) => {
        // 모서리마다 따로 판별해(끝점 공유 → 방향벡터 → 부피) 꼬인 위치를 세어 모델의 값과 맞춥니다.
        const M = M0(s), V = M.sol.verts; let c = 0;
        M.sol.edges.forEach((e) => {
          if (e.key === M.ref.key || e.u === M.ref.u || e.u === M.ref.v || e.v === M.ref.u || e.v === M.ref.v) return;
          const u = sub3(V[M.ref.v], V[M.ref.u]), w = sub3(V[e.v], V[e.u]), r = sub3(V[e.u], V[M.ref.u]);
          const cr = { x: u.y * w.z - u.z * w.y, y: u.z * w.x - u.x * w.z, z: u.x * w.y - u.y * w.x };
          if (len3(cr) < 1e-9) return;
          if (Math.abs(r.x * cr.x + r.y * cr.y + r.z * cr.z) > 1e-9) c++;
        });
        return { ans: c, model: M.nSkew };
      }
    };
    function M0(s) {
      const sol = solOf(s), ref = edgeByKey(sol, s.spRef, cfg.refs(sol)[0].key), c = classify(sol, ref);
      const tgt = cfg.pair ? edgeByKey(sol, s.spTgt, sol.edges.find((e) => e !== ref).key) : null;
      return { cfg, sol, ref, g: c.g, total: c.total, nMeet: c.nMeet, nExt: c.nExt, nPar: c.nPar, nSkew: c.nSkew, tgt, tgtRel: tgt ? relEdges(sol, ref, tgt) : null, n: sol.n };
    }

    /* ---------------- 그림 */
    function draw(b, s, M, C) {
      const { sol, ref, g } = M;
      const D = scene3(b, s, C);
      const explore = C.tab === 'explore' || C.thumb;
      const st = C.problem ? 0 : C.review ? C.step : 4; // 4 = 탐구(모두 색칠)
      const fadedM = st >= 2 && st < 4, fadedP = st >= 3 && st < 4;
      const A = sol.verts[ref.u], B = sol.verts[ref.v];
      // 연장하면 만나는 모서리: 만나는 점
      const exts = g.ext.map((e) => ({ e, X: lineMeetPoint(A, B, sol.verts[e.u], sol.verts[e.v]) })).filter((q) => q.X);
      const extAt = C.problem || st === 0 ? 0 : C.review ? (st >= 1 ? 1 : 0) : s.spExt;
      D.fitPts(sol.order.map((k) => sol.verts[k]).concat(extAt > 0.02 ? exts.map((q) => q.X) : []), { t: C.problem ? 44 : 58, b: 54, l: exts.length ? 64 : 40, r: exts.length ? 64 : 40 });
      const style = (e) => {
        const r = e.rel;
        if (r === 'ref') return { color: AMB, width: 6.4, glow: true };
        if (st === 0) return { color: 'ink', width: 3.2 };
        if (r === 'meet' || r === 'ext') return st === 4 || st === 1 ? { color: RED, width: st === 1 ? 5 : 4, dash: r === 'ext' ? [7, 5] : undefined } : { color: RED, width: 1.6, alpha: 0.2, dash: r === 'ext' ? [7, 5] : undefined };
        if (r === 'par') return st === 4 || st === 2 ? { color: BLUE, width: st === 2 ? 5 : 4 } : st > 2 ? { color: BLUE, width: 1.6, alpha: 0.2 } : { color: 'ink', width: 3 };
        if (r === 'skew') return st === 4 || st === 3 ? { color: GREEN, width: 5.6, glow: st === 3 } : { color: 'ink', width: 3 };
        return { color: 'ink', width: 3 };
      };
      // 안 보이는 모서리는 점선, 면은 아주 연하게
      const { vis } = drawSolid(D, sol, style, { faceAlpha: 0.06 });
      // 늘인 선(연장선)과 만나는 점
      if (extAt > 0 && !C.problem && (st === 4 || st === 1)) {
        exts.forEach(({ e, X }) => {
          const near = (P0, P1) => (len3(sub3(P0, X)) < len3(sub3(P1, X)) ? P0 : P1);
          [[A, B], [sol.verts[e.u], sol.verts[e.v]]].forEach(([P0, P1]) => {
            const n0 = near(P0, P1);
            D.line(n0, lerp3(n0, X, extAt), VIO, 3.2, { dash: [6, 5] });
          });
          if (extAt > 0.98) { b.point(D.P(X), { color: VIO, r: 6 }); D.obstacle(X, 9); }
        });
        if (extAt > 0.98) exts.forEach(({ X }) => D.label(X, '만나요', { color: VIO, size: 15, dir: D.out(X, sol.ctr), gap: 10 }));
      }
      // 평행 표시(화살표)
      if (!C.problem && (st === 4 || st === 2 || (st === 3 && false))) {
        [ref].concat(g.par).forEach((e) => { if (vis(e)) D.par(sol.verts[e.u], sol.verts[e.v], 1, BLUE, 0.5); });
      }
      drawVerts(D, sol, { hot: (k) => k === ref.u || k === ref.v });
      // 꼬인 위치 번호 (모서리 가운데에 놓고, 겹치면 비켜 놓음)
      if (C.txt && (st === 4 || st === 3)) g.skew.forEach((e) => D.label(mid3(sol.verts[e.u], sol.verts[e.v]), String(e.idx), { color: GREEN, size: 18, at: [[0, 0], [0, -15], [0, 15], [-15, 0], [15, 0], [11, -11], [-11, 11], [11, 11], [-11, -11]] }));
      // 기준 모서리 이름표
      if (C.txt) D.label(mid3(A, B), `기준 ${ref.name}`, { color: AMB, size: 16, dir: D.out(mid3(A, B), sol.ctr), gap: 14 });
      // 두 모서리 판별(s1-7): 고른 둘째 모서리
      if (M.tgt && M.tgt.key !== ref.key && !C.problem && !C.review) {
        const t = M.tgt, col = M.tgtRel === 'skew' ? GREEN : M.tgtRel === 'par' ? BLUE : RED;
        D.line(sol.verts[t.u], sol.verts[t.v], VIO, 7, { alpha: 0.55 });
        D.line(sol.verts[t.u], sol.verts[t.v], col, 4, {});
        D.label(mid3(sol.verts[t.u], sol.verts[t.v]), `고른 ${t.name}`, { color: VIO, size: 16, dir: D.out(mid3(sol.verts[t.u], sol.verts[t.v]), sol.ctr), gap: 14 });
      }
      // 맨 위 설명 한 줄
      if (C.txt) {
        const cap = C.problem ? null : st === 1 ? `① 만나는 모서리 ${M.nMeet + M.nExt}개 지우기` : st === 2 ? `② 평행한 모서리 ${M.nPar}개 지우기` : st === 3 ? `③ 남은 ${M.nSkew}개 = 꼬인 위치` : null;
        if (cap) b.stext(b.W / 2 - b.insets.right / 2, b.insets.top + 20, cap, { color: st === 1 ? RED : st === 2 ? BLUE : GREEN, size: 17, weight: 800, align: 'center', baseline: 'middle' });
      }
      D.flush();
      // 손잡이: 기준 모서리(노랑), 둘째 모서리(보라)
      if (explore && C.txt && !C.thumb) {
        const mids = sol.edges.map((e) => ({ e, p: D.P(mid3(sol.verts[e.u], sol.verts[e.v])) }));
        const nearest = (w) => { let best = mids[0], bd = 1e18; mids.forEach((q) => { const d = (q.p.x - w.x) ** 2 + (q.p.y - w.y) ** 2; if (d < bd) { bd = d; best = q; } }); return best.e; };
        if (cfg.pair && M.tgt) b.handle('tgt', D.P(mid3(sol.verts[M.tgt.u], sol.verts[M.tgt.v])), { color: VIO, r: 8, priority: 1, ariaLabel: '둘째 모서리 고르기', drag: (w) => { s.spTgt = nearest(w).key; } });
        b.handle('ref', D.P(mid3(A, B)), { color: AMB, r: 8.5, ariaLabel: '기준 모서리 고르기', drag: (w) => { s.spRef = nearest(w).key; } });
      }
    }

    /* ---------------- 정리 */
    function steps(M) {
      const { ref, nMeet, nExt, nPar, nSkew, total } = M;
      const r = ov(ref.name);
      return [
        `기준 모서리 $${r}$와 만나는 모서리를 지워요. 끝점에서 만나는 것이 $${nMeet}$개${nExt ? `, 늘이면 한 점에서 만나는 것이 $${nExt}$개이니 모두 $${nMeet + nExt}$개예요` : '예요'}.`,
        `$${r}$와 평행한 모서리 $${nPar}$개도 지워요.`,
        `남은 모서리 $${total}-1-${nMeet + nExt}-${nPar}=${nSkew}$개가 $${r}$와 꼬인 위치예요.`
      ];
    }

    /* ---------------- 탐구 화면 글 */
    function view(M, C) {
      const { ref, nMeet, nExt, nPar, nSkew, total, sol } = M;
      const r = ov(ref.name);
      const readouts = [
        rd('기준 모서리', ref.name, AMB),
        rd('만나는 모서리', `${nMeet + nExt}개`, RED, nExt ? `끝점 ${nMeet} + 늘이면 ${nExt}` : '끝점에서 만남'),
        rd('평행한 모서리', `${nPar}개`, BLUE),
        rd('꼬인 위치', `${nSkew}개`, GREEN, `${total} − 1 − ${nMeet + nExt} − ${nPar}`)
      ];
      if (M.tgt) {
        const t = M.tgt, rel = M.tgtRel;
        readouts.push(rd(`${ref.name}와 ${t.name}`, rel === 'ref' ? '같은 모서리' : rel === 'skew' ? '꼬인 위치' : rel === 'par' ? '평행' : '만남', rel === 'skew' ? GREEN : rel === 'par' ? BLUE : RED, rel === 'ext' ? '늘이면 만나요' : rel === 'meet' ? '끝점에서 만나요' : '', null, true));
      }
      return {
        guide: `<b>노란 손잡이</b>를 끌어 <b>기준 모서리</b>를 바꿔 보세요.${M.tgt ? ' <b>보라 손잡이</b>로는 둘째 모서리를 골라 둘의 관계를 확인해요.' : ''} 빈 곳을 끌면 입체가 돌아가요. 나머지 모서리는 ${span('red', '만나거나')}, ${span('sky', '평행하거나')}, ${span('green', '꼬인 위치')}예요. 안 보이는 모서리는 점선이에요.${nExt ? ' 막대로 모서리를 늘이면 한 점에서 만나는 것이 보여요.' : ''}`,
        readouts,
        formula: `<p>(꼬인 위치의 개수) $=${total}-1-${nMeet + nExt}-${nPar}=${nSkew}$ (개)</p>`,
        rule: '꼬인 위치 = 만나지도 않고 평행하지도 않은 두 직선 (한 평면 위에 없다)',
        notes: cfg.notes(M) + notes(`두 모서리가 한 평면 위에 있으면 ${span('red', '만나거나')} ${span('sky', '평행해요')}. 꼬인 위치는 그 두 가지가 아니에요.`)
      };
    }

    /* ---------------- 문제 */
    function prob(M) {
      const { cfg: c, ref, nMeet, nExt, nPar, nSkew, total, n, sol } = M;
      const shape = c.kind === 'prism' ? `${sol.name}` : sol.name;
      const wr = [
        [nMeet + nExt, '만나는 모서리의 개수예요. 꼬인 위치는 만나지도 평행하지도 않은 것이에요.'],
        [nPar, '평행한 모서리의 개수예요.'],
        [nSkew + nExt, '늘이면 한 점에서 만나는 모서리까지 꼬인 위치로 셌어요. 직선은 끝없이 뻗으니 늘이면 만나는 것도 만나는 위치예요.'],
        [nSkew + nPar, '평행한 모서리를 꼬인 위치로 잘못 셌어요.'],
        [total - 1 - nMeet - nPar, '끝점에서 만나는 것과 평행한 것만 지웠어요. 늘이면 만나는 모서리도 지워야 해요.'],
        [nSkew + 1, '기준 모서리 자신은 꼬인 위치가 아니에요.']
      ];
      return {
        tag: c.trap ? '꼬인 위치의 개수 (함정)' : '꼬인 위치의 개수',
        key: `${c.id}|${n}|${ref.key}`,
        stem: `그림은 ${shape}이다. 모서리 $${ov(ref.name)}$와 꼬인 위치에 있는 모서리의 개수는?`,
        choices: mkChoices(nSkew, wr)
      };
    }
  }

  /* ====================================================================== 장면 정의 */
  const baseSide = (bk, sk) => (sol) => [{ label: '밑면의 모서리', key: bk }, { label: '옆모서리', key: sk }];
  const nA = (M) => '';
  void nA;
  const S = [];
  S.push(skewScene({
    id: 's1-1', title: '직육면체에서 꼬인 위치', short: '직육면체', kind: 'cuboid', n: 4,
    question: '직육면체의 모서리 하나를 정하면, 꼬인 위치에 있는 모서리는 몇 개일까? 모서리가 12개나 있는데 빠뜨리지 않고 어떻게 찾을까?',
    refs: baseSide('AB', 'AE'),
    notes: (M) => notes('직육면체에서는 모서리마다 만나는 것 4개, 평행한 것 3개, 꼬인 것 4개로 똑같아요. 기준 모서리를 바꿔 확인해 보세요.')
  }));
  S.push(skewScene({
    id: 's1-2', title: '삼각기둥에서 꼬인 위치', short: '삼각기둥', kind: 'tri', n: 3,
    question: '삼각기둥에서는 모서리가 9개예요. 밑면의 모서리와 옆모서리 중 어느 것을 기준으로 하느냐에 따라 꼬인 위치의 개수가 달라질까?',
    refs: baseSide('t0', 's0'),
    notes: (M) => notes('밑면의 모서리를 기준으로 하면 평행한 모서리가 1개뿐이에요. 옆모서리를 기준으로 하면 평행한 모서리가 2개예요. 기준을 바꿔 개수를 비교해 보세요.')
  }));
  S.push(skewScene({
    id: 's1-3', title: '[함정] 사다리꼴기둥에서 꼬인 위치', short: '[함정] 사다리꼴기둥', kind: 'trap', n: 4, trap: true,
    question: '사다리꼴기둥에서 사다리꼴의 다리 $\\overline{AB}$와 $\\overline{CD}$는 평행하지 않아요. 그렇다면 꼬인 위치일까?',
    refs: (sol) => [{ label: '다리', key: 'AB' }, { label: '긴 밑변', key: 'AD' }, { label: '옆모서리', key: 'AE' }],
    notes: (M) => notes('사다리꼴의 평행하지 않은 두 변(다리)은 <b>늘이면 한 점에서 만나요</b>. 같은 평면 위에 있으므로 꼬인 위치가 아니에요.', '막대로 모서리를 늘여서 만나는 점을 꼭 확인하세요.')
  }));
  S.push(skewScene({
    id: 's1-4', title: '[함정] 정육각기둥에서 꼬인 위치', short: '[함정] 육각기둥', kind: 'prism', n: 6, n0: 6, trap: true,
    question: '정육각기둥은 모서리가 18개예요. 밑면의 모서리 $\\overline{AB}$와 이웃하지 않은 같은 밑면의 모서리는 모두 꼬인 위치일까?',
    refs: baseSide('t0', 's0'),
    notes: (M) => notes('같은 밑면에서 이웃하지 않은 모서리는 평행하거나 <b>늘이면 만나요</b>. 모두 한 평면 위에 있으므로 꼬인 위치가 아니에요.', '꼬인 위치는 반대쪽 밑면의 모서리와 옆모서리 중에 있어요.')
  }));
  S.push(skewScene({
    id: 's1-5', title: '사각뿔에서 꼬인 위치', short: '사각뿔', kind: 'pyr4', n: 4,
    question: '사각뿔의 옆모서리는 모두 꼭짓점 V에서 만나요. 그러면 꼬인 위치는 어떤 모서리일까?',
    refs: baseSide('AB', 'VA'),
    notes: (M) => notes('각뿔의 옆모서리끼리는 모두 꼭짓점 V에서 만나서 꼬인 위치가 될 수 없어요.', '밑면의 모서리를 기준으로 하면, 반대쪽으로 올라가는 옆모서리가 꼬인 위치예요.')
  }));
  S.push(skewScene({
    id: 's1-6', title: '정사면체에서 꼬인 위치', short: '정사면체', kind: 'tetra', n: 3,
    question: '정사면체의 모서리는 6개예요. 한 모서리와 꼬인 위치에 있는 모서리는 몇 개일까?',
    refs: baseSide('AB', 'VA'),
    notes: (M) => notes('사면체에서는 어느 모서리를 기준으로 해도 마주 보는 모서리 1개만 꼬인 위치예요.', '각뿔대·각뿔처럼 한 점에서 만나는 모서리가 많으면 꼬인 위치는 적어져요.')
  }));
  S.push(skewScene({
    id: 's1-7', title: 'n각기둥에서 꼬인 위치', short: 'n각기둥', kind: 'prism', n: 6, n0: 5, ext0: 0, pair: true,
    tgt: 's3',
    question: 'n각기둥의 밑면의 변의 수 n을 늘리면, 한 모서리와 꼬인 위치에 있는 모서리는 몇 개가 될까? 두 모서리를 골라 위치 관계도 알아보자.',
    refs: baseSide('t0', 's0'),
    notes: (M) => notes('n각기둥의 모서리는 모두 $3n$개예요.', 'n이 짝수이면 밑면에 평행한 모서리가 더 많아져서 꼬인 위치가 한 개 줄어들 수 있어요. 막대로 n을 바꿔 세어 보세요.')
  }));

  G.register(10, 't1', '① 꼬인 위치', '꼬인 위치', PARAMS, S);
})();
