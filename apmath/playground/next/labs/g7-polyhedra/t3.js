/* ==========================================================================
   중1 · 다면체와 정다면체 — 탭 ③ 「정다면체의 전개도와 꼬인 위치」 (t3.js, order 30) — 장면 8개
   · p3-1 정육면체의 전개도 11가지 · p3-2 [함정] 겹치는 꼭짓점 · p3-3 평행한 면과 수직인 면 · p3-4 꼬인 위치의 모서리
   · p3-5 정사면체의 전개도 · p3-6 정팔면체·정십이면체·정이십면체의 전개도 · p3-7 겉면 위의 최단 경로 · p3-8 주사위의 전개도
   전개도는 접는 선(경첩)을 축으로 「제자리에서 회전」해 접습니다(이동 없음). 접으면 한 점으로 모이는 꼭짓점이 같은 색으로 보입니다.
   모든 글자·색·정답은 지금의 전개도와 선택에서 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PH;
  if (!G || !G.prismS) return;
  const { jo, clamp, pick, rint, shuf, PI, DEG, LET, v3, add3, sub3, mul3, dot3, len3, unit3, lerp3, mid3, rotAxis, scene3, P, VIEW, mkChoices, mkText, rd, notes, fit, bboxOf, classify, ov,
    PLAT, cen3, drawPoly, banner, sRect, cubeNetOf, CUBE_NETS, BAD_NETS, cubeNetOK, cellNet, transformCells, canonCells, randCells, netSvg, polyNetsOf, hasBlock } = G;

  const PARAMS = {
    phFold: P('접기', 0, 1, 0.005, 0, { color: 'amber', hint: '막대를 끌거나 ▶ 를 눌러 전개도를 접어 보세요', format: (v) => (v < 0.01 ? '펼친 전개도' : v > 0.99 ? '다 접음' : Math.round(v * 100) + '%') }),
    phEdge: P('정육면체의 한 모서리 a', 4, 12, 2, 8, { color: 'sky', hint: '모서리의 길이를 바꿔 보세요', format: (v) => `${Math.round(v)}` }),
    phAnt: P('점 P의 위치 (E에서 F까지)', 0.1, 0.9, 0.01, 0.3, { color: 'amber', hint: '경로가 모서리 EF를 지나는 점 P를 옮겨 보세요', format: (v) => `${Math.round(v * 100)}%` })
  };
  const AMB = 'amber', SKY = 'sky', GRN = 'green', RED = 'red', VIO = 'violet', ORG = 'orange';
  const span = (c, t) => `<b style="color:var(--m-${c})">${t}</b>`;
  const stepOf = (C) => (C.problem ? 0 : C.review ? C.step : 4);
  const NUM6 = '123456';
  const camFold = (s, t, kp = 30, ky = -26) => Object.assign({}, s, { phPitch: Math.max(-10, (s.phPitch == null ? 70 : s.phPitch) - kp * t), phYaw: (s.phYaw == null ? 0 : s.phYaw) + ky * t });
  const CAM0 = { yaw: 0, pitch: 84 };
  const ptName = (n, k) => (n.ptName[k] || String(k + 1));

  /* ------------------------------------------------------------------ 전개도 목록 */
  const cubeSpec = (key, label) => ({ label, get: () => cubeNetOf(key) });
  const polySpec = (kind, idx, label) => ({ label, get: () => (polyNetsOf(kind)[idx] || polyNetsOf(kind)[0]) });
  const CUBE5 = [cubeSpec('a1', '1-4-1형 ㉮'), cubeSpec('a3', '1-4-1형 ㉯'), cubeSpec('b2', '2-3-1형'), cubeSpec('c1', '2-2-2형'), cubeSpec('d1', '3-3형')];
  const CUBE_ALL = CUBE_NETS.map((d, i) => Object.assign(cubeSpec(d.key, `${d.g} ${d.g.startsWith('1-4-1') ? '㉮㉯㉰㉱㉲㉳'[CUBE_NETS.filter((q) => q.g === d.g).indexOf(d)] : d.g.startsWith('2-3-1') ? '㉮㉯㉰'[CUBE_NETS.filter((q) => q.g === d.g).indexOf(d)] : ''}`.trim()), { group: i === 0 ? '정육면체가 되는 11가지' : '', valid: true })).concat(BAD_NETS.map((d, i) => Object.assign(cubeSpec(d.key, `✕ ${d.g}`), { group: i === 0 ? '정육면체가 안 되는 모양' : '', valid: false })));
  const netOf = (s, specs) => specs[clamp(s.phNet | 0, 0, specs.length - 1)].get();
  const netPresets = (specs, fold0 = 0) => () => specs.map((sp, i) => ({ group: sp.group != null ? sp.group : i === 0 ? '전개도 모양' : '', label: sp.label, apply: (st) => { st.phNet = i; st.phFold = fold0; st.phSelPt = null; st.phSelFace = null; st.phSelEdge = null; }, on: (st) => (st.phNet | 0) === i }));

  /* ------------------------------------------------------------------ 그리기 공통 */
  // 평평한 모양과 접은 모양을 모두 담는 고정 화면 틀
  function fitNet(b, s, net, C, pad, camF = camFold, cur) {
    const pts = [];
    (cur == null ? [0, 0.5, 1] : [cur]).forEach((t) => { const D = scene3(b, camF(s, t), C); net.at(t).forEach((f) => f.forEach((p) => pts.push(D.P(p)))); });
    fit(b, bboxOf(pts), Object.assign({ t: C.problem ? 40 : 108, b: 46, l: 40, r: 40 }, pad || {}));
  }
  // 면을 먼 것부터 그립니다. col(fi) → {c,a,ec,ew,alpha}
  function drawFaces(D, net, t, col) {
    const faces = net.at(t), order = faces.map((p, i) => ({ i, d: D.depth(cen3(p)) })).sort((a, c) => c.d - a.d);
    order.forEach(({ i }) => { const st = col ? col(i) : null; D.panel(faces[i], st ? st.c : 'green', st ? st.a : 0.1, st && st.ec ? st.ec : 'ink', st && st.ew ? st.ew : 1.8, { alpha: st && st.alpha }); });
    return faces;
  }
  // 전개도 점(평면 위의 점) 위치(시간 t 에서): 같은 점에 속한 면 꼭짓점 중 첫 번째
  function ptPos(net, faces, k) {
    for (let fi = 0; fi < net.ptOf.length; fi++) for (let vi = 0; vi < net.ptOf[fi].length; vi++) if (net.ptOf[fi][vi] === k) return faces[fi][vi];
    return v3(0, 0, 0);
  }
  const faceTxt = (D, C, p, t, o) => { if (C.txt) D.label(p, t, o); };

  const foldAnim = { key: 'phFold', dur: 5, label: '접어 보기', start: 0 };
  const foldCtl = () => ['phFold'].concat(VIEW);
  const initNet = (s, specs, extra) => { s.phNet = 0; s.phFold = 0; s.phSelPt = null; s.phSelFace = null; s.phSelEdge = null; if (extra) extra(s); };

  /* ------------------------------------------------------------------ p3-1 정육면체의 전개도 11가지 */
  function mkCells(valid) {
    // 보기에 쓸 칸 목록(회전·뒤집기 적용)
    const base = CUBE_NETS[rint(0, CUBE_NETS.length - 1)].cells;
    return valid ? transformCells(base, rint(0, 3), rint(0, 1)) : null;
  }
  function nearMiss(cells) {
    for (let tries = 0; tries < 60; tries++) {
      const i = rint(0, cells.length - 1), rest = cells.filter((_, j) => j !== i);
      if (!rest.every((c) => rest.some((d) => d !== c && Math.abs(d[0] - c[0]) + Math.abs(d[1] - c[1]) === 1))) continue;
      const cand = [];
      rest.forEach((c) => [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach((d) => { const e = [c[0] + d[0], c[1] + d[1]]; if (!rest.some((q) => q[0] === e[0] && q[1] === e[1]) && !(e[0] === cells[i][0] && e[1] === cells[i][1])) cand.push(e); }));
      if (!cand.length) continue;
      const e = cand[rint(0, cand.length - 1)], nc = rest.concat([e]), mx = Math.min(...nc.map((q) => q[0])), my = Math.min(...nc.map((q) => q[1])), out = nc.map((q) => [q[0] - mx, q[1] - my]);
      if (!cubeNetOK(out)) return out;
    }
    return null;
  }
  function rollQ31() {
    const valid = mkCells(true), items = [{ cells: valid, ok: true }], seen = new Set([canonCells(valid)]);
    let guard = 0;
    while (items.length < 5 && guard++ < 400) {
      const c = items.length < 3 ? nearMiss(valid) : randCells(6);
      if (!c || cubeNetOK(c)) continue;
      const k = canonCells(c);
      if (seen.has(k)) continue;
      seen.add(k);
      items.push({ cells: c, ok: false });
    }
    return { items: shuf(items) };
  }
  const why31 = (cells) => (hasBlock(cells) ? '한 점에 면이 4개 모여서 접으면 면이 겹쳐요.' : '접으면 겹치는 면이 있어서 정육면체가 되지 않아요.');
  const A1 = {
    id: 'p3-1', title: '정육면체의 전개도 11가지', short: '전개도 11가지',
    question: '정사각형 6개를 이어 붙인 모양 중에서 접으면 정육면체가 되는 것은 몇 가지일까? 접어서 겹치는 면을 찾아보자.',
    cam0: CAM0, ctl: foldCtl, anim: foldAnim, stepT: (n) => (n >= 2 ? 1 : 0),
    presets: netPresets(CUBE_ALL),
    init: (s) => { initNet(s, CUBE_ALL); s.phQ = rollQ31(); },
    reroll: (s) => { s.phQ = rollQ31(); },
    model: (s) => { const spec = CUBE_ALL[clamp(s.phNet | 0, 0, CUBE_ALL.length - 1)], net = spec.get(); return { spec, net, valid: spec.valid, Q: s.phQ, ovl: net.overlap }; },
    draw(b, s, M, C) {
      const st = stepOf(C), t = C.problem ? 1 : C.review ? C.t : (C.thumb ? 0.6 : s.phFold);
      const net = C.problem ? cubeNetOf('a1') : M.net;
      fitNet(b, s, net, C, null, camFold, C.problem ? 1 : C.review ? t : undefined);
      const D = scene3(b, camFold(s, t), C);
      const showBad = !C.problem && !M.valid && t > 0.85;
      const faces = drawFaces(D, net, t, (i) => (showBad && M.ovl[i] ? { c: RED, a: 0.5, ec: RED, ew: 3 } : { c: 'green', a: C.problem ? 0.16 : 0.14, ec: 'ink', ew: 2 }));
      if (C.txt && !C.problem) faces.forEach((p, i) => D.label(cen3(p), NUM6[net.num[i] - 1], { color: showBad && M.ovl[i] ? RED : AMB, size: 19, at: [[0, 0]] }));
      if (C.txt && !C.problem) {
        const L = [{ t: M.spec.label.replace('✕ ', ''), c: 'ink', size: 16 }];
        if (t > 0.9 && st !== 1) L.push(M.valid ? { t: '여섯 면이 겹치지 않아요 → 정육면체 ○', c: GRN, size: 15 } : { t: '빨간 면이 겹쳐요 → 정육면체 ✕', c: RED, size: 15 });
        banner(b, L, C);
      } else if (C.problem && C.txt) banner(b, [{ t: '정육면체', c: 'ink', size: 17 }], C);
      D.flush();
    },
    steps: (M) => [
      `전개도를 한 줄로 놓인 면의 개수로 분류해요. 이 모양은 ${M.valid ? M.spec.label.replace(/ [㉮-㉳]/, '') : '정육면체의 전개도 모양이 아니에요'}이에요.`,
      `전개도를 접어 보면서 면이 겹치는지 확인해요. ${M.valid ? '여섯 면이 서로 다른 자리에 놓여요.' : '같은 자리에 놓이는 면이 있어요.'}`,
      M.valid ? `겹치는 면이 없으므로 정육면체의 전개도예요. 정육면체의 전개도는 모두 $11$가지예요.` : `겹치는 면이 있으므로 정육면체의 전개도가 $\\text{아니에요}$.`
    ],
    view: (M) => ({
      guide: `아래 버튼으로 전개도를 고르고 <b>접기</b> 막대를 끌거나 ▶를 눌러 접어 보세요. 접어서 면이 겹치면 ${span('red', '빨갛게')} 표시돼요. 정육면체가 되는 전개도는 모두 11가지예요.`,
      readouts: [rd('전개도', M.spec.label.replace('✕ ', ''), AMB), rd('정육면체가 되나요?', M.valid ? '○ 돼요' : '✕ 안 돼요', M.valid ? GRN : RED), rd('겹치는 면', M.valid ? '없음' : `${M.ovl.filter(Boolean).length}개`, M.valid ? GRN : RED)],
      formula: '<p>정육면체의 전개도: 1-4-1형 6가지 · 2-3-1형 3가지 · 2-2-2형 1가지 · 3-3형 1가지 = 11가지</p>',
      rule: '전개도를 접었을 때 여섯 면이 겹치지 않고 모두 다른 자리에 놓이면 정육면체의 전개도이다',
      notes: notes('한 줄에 5개 이상 있거나, 4개가 한 줄로 놓이고 양끝 면이 같은 쪽에 붙은 모양은 접으면 겹쳐요.', '한 꼭짓점에는 면이 3개씩만 모여야 해요. 4개가 모이는 모양(2×2)은 안 돼요.')
    }),
    prob: (M) => {
      const its = M.Q.items;
      return {
        tag: '정육면체의 전개도', key: its.map((x) => canonCells(x.cells)).join('|'), wide: false,
        stem: '다음 중 접어서 정육면체를 만들 수 있는 전개도는?',
        choices: its.map((x) => ({ h: netSvg(x.cells, { u: 26 }), p: '전개도 모양', ok: x.ok, hint: x.ok ? '' : why31(x.cells) }))
      };
    }
  };

  /* ------------------------------------------------------------------ 점 겹침 장면 (p3-2 · p3-5 · p3-6) */
  function samePts(net, k) { const c = net.ptCl[k]; return net.pt.map((_, j) => j).filter((j) => j !== k && net.ptCl[j] === c); }
  function overlapChoices(net, k, T) {
    const nm = (j) => ptName(net, j), all = net.pt.map((_, j) => j).filter((j) => j !== k);
    const fmt = (arr) => arr.slice().sort((a, c) => nm(a).localeCompare(nm(c))).map((j) => `점 ${nm(j)}`).join(', ');
    const key = (arr) => arr.slice().sort((a, c) => a - c).join(',');
    const seen = new Set([key(T)]), out = [{ h: fmt(T), ok: true, set: T, hint: '' }];
    const add = (arr, hint) => { if (!arr.length || arr.length > 3) return; const kk = key(arr); if (seen.has(kk) || arr.includes(k)) return; seen.add(kk); out.push({ h: fmt(arr), ok: false, set: arr, hint }); };
    if (T.length > 1) add([T[0]], '겹치는 점이 더 있어요. 같은 점으로 모이는 점을 모두 찾아야 해요.');
    const others = all.filter((j) => !T.includes(j));
    if (others.length) add(T.concat([others[rint(0, others.length - 1)]]), '다른 점으로 모이는 점이 하나 섞여 있어요.');
    let g = 0;
    while (out.length < 5 && g++ < 200) {
      const n = rint(1, Math.max(1, Math.min(2, T.length + 1))), arr = []; while (arr.length < n) { const j = all[rint(0, all.length - 1)]; if (!arr.includes(j)) arr.push(j); }
      add(arr, '접으면 이 점들은 점 ' + nm(k) + '와 만나지 않아요.');
    }
    return out;
  }
  function rollOverlapQ(specs, ptsOk) {
    for (let g = 0; g < 80; g++) {
      const ni = rint(0, specs.length - 1), net = specs[ni].get(), cand = net.pt.map((_, j) => j).filter((j) => samePts(net, j).length >= 1 && (!ptsOk || ptsOk(net, j)));
      if (!cand.length) continue;
      return { ni, k: cand[rint(0, cand.length - 1)] };
    }
    return { ni: 0, k: 0 };
  }
  function vertexScene(o) {
    const specs = o.specs, solid = o.solid;
    return {
      id: o.id, title: o.title, short: o.short, question: o.question,
      cam0: CAM0, ctl: foldCtl, anim: foldAnim, stepT: (n) => (n >= 2 ? 1 : 0),
      presets: netPresets(specs),
      init: (s) => { initNet(s, specs); s.phQ = rollOverlapQ(o.qspecs || specs, o.ptsOk); },
      reroll: (s) => { s.phQ = rollOverlapQ(o.qspecs || specs, o.ptsOk); },
      model: (s) => {
        const net = netOf(s, specs), k = s.phSelPt != null && s.phSelPt < net.pt.length ? s.phSelPt : o.defPt(net);
        const q = s.phQ, qspecs = o.qspecs || specs, qnet = qspecs[clamp(q.ni, 0, qspecs.length - 1)].get(), qk = clamp(q.k, 0, qnet.pt.length - 1);
        return { net, k, same: samePts(net, k), cl: net.ptCl[k], Q: q, qnet, qk, qT: samePts(qnet, qk), letters: net.pt.length <= 26 };
      },
      draw(b, s, M, C) {
        const st = stepOf(C), t = C.problem ? 0 : C.review ? C.t : (C.thumb ? 0.6 : s.phFold);
        const net = C.problem ? M.qnet : M.net, k = C.problem ? M.qk : M.k, cl = net.ptCl[k], same = net.pt.map((_, j) => j).filter((j) => net.ptCl[j] === cl);
        fitNet(b, s, net, C, o.fitPad, camFold, C.review ? t : undefined);
        const D = scene3(b, camFold(s, t), C);
        const hl = (j) => !C.problem && st !== 0 && net.ptCl[j] === cl;
        const faces = drawFaces(D, net, t, (i) => ({ c: 'green', a: 0.1, ec: 'ink', ew: 1.8 }));
        // 점과 글자
        const seen = [];
        net.pt.forEach((_, j) => {
          const p = ptPos(net, faces, j), isHl = (C.problem ? j === k : hl(j));
          D.dot(p, isHl ? AMB : 'ink', isHl ? 7 : 3.4);
          if (!C.txt) return;
          const sc = b.toS(D.P(p));
          const draw = M.letters ? true : isHl;
          if (!draw) return;
          if (seen.some((q) => q.n === ptName(net, j) && Math.hypot(q.x - sc.x, q.y - sc.y) < 8)) return;
          seen.push({ n: ptName(net, j), x: sc.x, y: sc.y });
          const txt = M.letters ? ptName(net, j) : '';
          if (txt) D.label(p, txt, { color: isHl ? AMB : 'ink', size: isHl ? 19 : 16, dir: D.out(p, cen3(faces.flat())), gap: 10 });
        });
        if (C.txt && !C.problem) {
          const nm = (j) => ptName(net, j);
          const L = [{ t: `${net.name} 전개도 (${net.label || ''})`, c: 'ink', size: 15 }];
          if (st >= 1) L.push({ t: M.letters ? `점 ${nm(k)}${jo(nm(k), 'wa')} 겹치는 점: ${M.same.length ? M.same.map((j) => `점 ${nm(j)}`).join(', ') : '없음'}` : `고른 점과 겹치는 점 ${M.same.length}개`, c: AMB, size: 15 });
          if (t > 0.98 && st !== 1 && M.letters) { const lst = [k].concat(M.same).sort((a, c) => a - c).map(nm); L.push({ t: `접으면 ${lst.join(' = ')}${jo(lst[lst.length - 1], 'i')} 한 꼭짓점`, c: GRN, size: 14 }); }
          banner(b, L, C);
        } else if (C.problem && C.txt) banner(b, [{ t: `${o.name}의 전개도`, c: 'ink', size: 16 }], C);
        D.flush();
        if (C.tab === 'explore' && !C.thumb) {
          const p = ptPos(net, faces, k);
          b.handle('pt', D.P(p), { color: 'amber', r: 9, ariaLabel: '전개도의 점 고르기', drag: (w) => { let best = 0, bd = 1e18; net.pt.forEach((_, j) => { const q = D.P(ptPos(net, faces, j)), d = (q.x - w.x) ** 2 + (q.y - w.y) ** 2; if (d < bd) { bd = d; best = j; } }); s.phSelPt = best; } });
        }
      },
      steps: (M) => {
        const nm = (j) => ptName(M.net, j), k = nm(M.k);
        if (!M.letters) return [
          `전개도에서 점 하나를 골라요. 같은 꼭짓점으로 모이는 점은 같은 색(노랑)이에요.`,
          `전개도를 접어요. 노란 점들이 한 점으로 모이는 것을 확인해요.`,
          `이 꼭짓점에는 면이 ${PLAT[o.kind].q}개씩 모여요. 전개도에서 이 점과 겹치는 점은 $${M.same.length}$개예요.`
        ];
        return [
          `전개도에서 점 $\\text{${k}}$를 골라요.`,
          `전개도를 접으면서 $\\text{${k}}$${jo(k, 'wa')} 한 점으로 모이는 점을 찾아요. ${M.same.length ? M.same.map((j) => `점 $\\text{${nm(j)}}$`).join(', ') + '이에요.' : '겹치는 점이 없어요.'}`,
          `따라서 접으면 ${[M.k].concat(M.same).sort((a, c) => a - c).map((j) => `$\\text{${nm(j)}}$`).join(', ')}${jo(nm([M.k].concat(M.same).sort((a, c) => a - c).slice(-1)[0]), 'i')} 한 꼭짓점이 돼요. 한 꼭짓점에는 면이 $${PLAT[o.kind].q}$개씩 모여요.`
        ];
      },
      view: (M) => {
        const nm = (j) => ptName(M.net, j);
        return {
          guide: `${o.guide} <b>노란 손잡이</b>로 전개도의 점을 골라 보세요. 접으면 같은 꼭짓점이 되는 점이 ${span('amber', '노랗게')} 표시돼요.`,
          readouts: [rd('고른 점', M.letters ? `점 ${nm(M.k)}` : '노란 점', AMB), rd('겹치는 점', M.same.length ? (M.letters ? M.same.map(nm).join(', ') : `${M.same.length}개`) : '없음', AMB), rd('한 꼭짓점에 모인 면', `${PLAT[o.kind].q}개`, SKY)],
          formula: `<p>전개도의 점 중 접으면 한 점이 되는 것: ${[M.k].concat(M.same).sort((a, c) => a - c).map((j) => (M.letters ? nm(j) : '●')).join(' = ')}</p>`,
          rule: '전개도를 접었을 때 같은 꼭짓점이 되는 점들이 겹치는 점이다',
          notes: o.notes
        };
      },
      prob: (M) => {
        const net = M.qnet, k = M.qk, T = M.qT, nm = ptName(net, k);
        const ch = overlapChoices(net, k, T);
        const order = ch.map((x, i) => ({ x, o: (Math.sin((i + 1) * 12.9898 + k * 78.233 + M.Q.ni * 3.1) * 43758.5453) % 1 })).sort((a, c) => a.o - c.o).map((q) => q.x);
        return { tag: o.tag, key: `${M.Q.ni}|${k}`, stem: `다음 전개도를 접어 ${o.name}${jo(o.name, 'eul')} 만들 때, 점 ${nm}${jo(nm, 'wa')} 겹치는 점을 모두 고르면?`, choices: mkText(order.map((x) => ({ h: x.h, ok: x.ok, hint: x.hint }))) };
      }
    };
  }
  const A2 = vertexScene({
    id: 'p3-2', title: '[함정] 정육면체 전개도에서 겹치는 꼭짓점', short: '[함정] 겹치는 꼭짓점', kind: 'cube', name: '정육면체', specs: CUBE5, tag: '전개도에서 겹치는 점 (함정)',
    question: '정육면체의 전개도를 접으면 전개도 위의 서로 다른 점이 한 꼭짓점으로 모여요. 점 하나를 골라 어떤 점과 겹치는지 찾아보자.',
    defPt: (net) => 0, guide: '전개도의 점마다 이름(A, B, C …)이 붙어 있어요. 막대로 접으면 점들이 모여요.',
    notes: notes('정육면체의 꼭짓점은 8개인데 전개도의 점은 14개예요. 한 꼭짓점에 전개도의 점이 1~3개씩 모여요.', '같은 면에 있거나 이웃한 점이 한 점으로 모이는 것은 아니에요. 접어서 확인해야 해요.')
  });
  const TETRA2 = [polySpec('tetra', 0, '전개도 ㉮'), polySpec('tetra', 1, '전개도 ㉯')];
  const A5 = vertexScene({
    id: 'p3-5', title: '정사면체의 전개도', short: '정사면체 전개도', kind: 'tetra', name: '정사면체', specs: TETRA2, tag: '정사면체의 전개도',
    question: '정삼각형 4개를 이어 붙인 정사면체의 전개도예요. 접으면 어느 점들이 한 꼭짓점으로 모일까?',
    defPt: (net) => 0, guide: '정사면체는 한 꼭짓점에 정삼각형이 3개씩 모여요.',
    notes: notes('정사면체의 꼭짓점은 4개인데 전개도의 점은 6개예요.', '같은 꼭짓점이 되는 점은 항상 3개의 면의 꼭짓점이에요. 한 꼭짓점에 모인 면은 3개예요.'),
    ptsOk: (net, j) => samePts(net, j).length >= 1
  });
  const POLYSPECS = [polySpec('octa', 0, '정팔면체 ㉮'), polySpec('octa', 1, '정팔면체 ㉯'), polySpec('dodeca', 0, '정십이면체'), polySpec('icosa', 0, '정이십면체')];
  const A6 = (() => {
    const base = vertexScene({
      id: 'p3-6', title: '정팔면체·정십이면체·정이십면체의 전개도', short: '정팔·정12·정20면체 전개도', kind: 'octa', name: '정팔면체', specs: POLYSPECS, qspecs: POLYSPECS.slice(0, 2), tag: '정팔면체의 전개도',
      question: '정삼각형 8개로 만든 정팔면체의 전개도예요. 정십이면체와 정이십면체의 전개도도 접어 보자. 접으면 어느 점들이 한 꼭짓점이 될까?',
      defPt: (net) => 0, guide: '정팔면체는 한 꼭짓점에 정삼각형이 4개씩, 정십이면체는 정오각형이 3개씩, 정이십면체는 정삼각형이 5개씩 모여요.',
      notes: notes('정팔면체의 꼭짓점은 6개인데 전개도의 점은 10개예요.', '정십이면체·정이십면체는 점이 많아서 고른 점과 겹치는 점만 노란색으로 보여 줘요.'),
      fitPad: { t: 90, b: 40, l: 24, r: 24 }
    });
    // 입체에 따라 한 꼭짓점에 모인 면의 수가 달라서 문구를 바꿔 끼웁니다.
    const kindOf = (net) => net.kind;
    const v0 = base.view, s0 = base.steps;
    base.view = (M) => { const r = v0(M); const k = kindOf(M.net); r.readouts[2] = rd('한 꼭짓점에 모인 면', `${PLAT[k].q}개`, SKY); r.readouts[0] = rd('고른 점', M.letters ? `점 ${ptName(M.net, M.k)}` : '노란 점', AMB); return r; };
    base.steps = (M) => { const k = kindOf(M.net); return s0(M).map((t) => t.replace(/면이 \$?\d\$?개씩/g, `면이 $${PLAT[k].q}$개씩`).replace(/면이 \d개씩/g, `면이 ${PLAT[k].q}개씩`)); };
    return base;
  })();

  /* ------------------------------------------------------------------ p3-3 평행한 면과 수직인 면 */
  function rollQ33() { const ni = rint(0, CUBE5.length - 1), net = CUBE5[ni].get(); return { ni, f: rint(0, 5) }; }
  const A3 = {
    id: 'p3-3', title: '정육면체 전개도에서 평행한 면', short: '평행한 면',
    question: '정육면체의 전개도를 접으면 서로 마주 보는 면은 평행해요. 면 하나를 골라 평행한 면과 수직인 면을 찾아보자.',
    cam0: CAM0, ctl: foldCtl, anim: foldAnim, stepT: (n) => (n >= 2 ? 1 : 0),
    presets: netPresets(CUBE5),
    init: (s) => { initNet(s, CUBE5); s.phQ = rollQ33(); },
    reroll: (s) => { s.phQ = rollQ33(); },
    model: (s) => {
      const net = netOf(s, CUBE5), f = s.phSelFace != null && s.phSelFace < 6 ? s.phSelFace : 0, q = s.phQ, qn = CUBE5[q.ni].get();
      return { net, f, opp: net.opposite[f], Q: q, qn, qf: q.f, qopp: qn.opposite[q.f] };
    },
    draw(b, s, M, C) {
      const st = stepOf(C), t = C.problem ? 0 : C.review ? C.t : (C.thumb ? 0.6 : s.phFold);
      const net = C.problem ? M.qn : M.net, f = C.problem ? M.qf : M.f, opp = net.opposite[f];
      fitNet(b, s, net, C, null, camFold, C.review ? t : undefined);
      const D = scene3(b, camFold(s, t), C);
      const col = (i) => {
        if (C.problem) return i === f ? { c: AMB, a: 0.4, ec: AMB, ew: 3 } : { c: 'green', a: 0.12 };
        if (i === f) return { c: AMB, a: 0.42, ec: AMB, ew: 3.2 };
        if (i === opp && st !== 0 && st !== 3) return { c: SKY, a: 0.42, ec: SKY, ew: 3.2 };
        if (st === 3 || st === 4) return { c: GRN, a: 0.26, ec: GRN, ew: 2.2 };
        return { c: 'green', a: 0.1 };
      };
      const faces = drawFaces(D, net, t, col);
      faces.forEach((p, i) => faceTxt(D, C, cen3(p), NUM6[net.num[i] - 1], { color: i === f ? AMB : i === opp && !C.problem ? SKY : 'ink', size: 20, at: [[0, 0]] }));
      if (C.txt && !C.problem) {
        const a = NUM6[net.num[f] - 1], c = NUM6[net.num[opp] - 1];
        const L = [{ t: `면 ${a}${jo(a, 'wa')} 평행한 면: ${c}`, c: SKY, size: 16 }];
        if (st === 3 || st === 4) L.push({ t: `나머지 네 면은 면 ${a}${jo(a, 'wa')} 수직이에요 (초록)`, c: GRN, size: 14 });
        banner(b, L, C);
      } else if (C.problem && C.txt) banner(b, [{ t: '정육면체의 전개도', c: 'ink', size: 16 }], C);
      D.flush();
      if (C.tab === 'explore' && !C.thumb) b.handle('fc', D.P(cen3(faces[f])), { color: 'amber', r: 9, ariaLabel: '면 고르기', drag: (w) => { let best = 0, bd = 1e18; faces.forEach((p, i) => { const q = D.P(cen3(p)), d = (q.x - w.x) ** 2 + (q.y - w.y) ** 2; if (d < bd) { bd = d; best = i; } }); s.phSelFace = best; } });
    },
    steps: (M) => {
      const a = NUM6[M.net.num[M.f] - 1], c = NUM6[M.net.num[M.opp] - 1];
      return [
        `전개도에서 면 $\\text{${a}}$${jo(a, 'eul')} 골라요. (노란 면)`,
        `전개도를 접으면 면 $\\text{${a}}$${jo(a, 'wa')} 마주 보는 면은 $\\text{${c}}$예요. 마주 보는 두 면은 서로 $\\text{평행}$해요.`,
        `나머지 네 면은 면 $\\text{${a}}$${jo(a, 'wa')} $\\text{수직}$으로 만나요.`
      ];
    },
    view: (M) => {
      const a = NUM6[M.net.num[M.f] - 1], c = NUM6[M.net.num[M.opp] - 1];
      return {
        guide: `<b>노란 손잡이</b>를 끌어 면을 고르고 <b>접기</b> 막대로 접어 보세요. ${span('amber', '고른 면')}과 마주 보는 ${span('sky', '파란 면')}은 평행하고, ${span('green', '초록 면 4개')}는 수직이에요.`,
        readouts: [rd('고른 면', a, AMB), rd('평행한 면', c, SKY), rd('수직인 면', '4개', GRN)],
        formula: `<p>면 ${a} ∥ 면 ${c}</p>`,
        rule: '정육면체에서 마주 보는 두 면은 평행하고, 이웃한 면은 수직이다',
        notes: notes('전개도에서 한 줄로 놓인 4개의 면은 한 칸 건너뛴 면끼리 평행해요. (1-4-1형)', '전개도에서 이웃해 보여도 접으면 마주 보는 면이 될 수 있어요. 접어서 확인하세요.')
      };
    },
    prob: (M) => {
      const net = M.qn, f = M.qf, opp = M.qopp, nf = NUM6[net.num[f] - 1];
      const others = [0, 1, 2, 3, 4, 5].filter((i) => i !== f);
      const items = others.map((i) => ({ i, ok: i === opp })).sort((a, c) => net.num[a.i] - net.num[c.i]);
      const pickN = shuf(items.filter((x) => !x.ok)).slice(0, 4).concat(items.filter((x) => x.ok)).sort((a, c) => net.num[a.i] - net.num[c.i]);
      return { tag: '평행한 면', key: `${M.Q.ni}|${f}`, stem: `그림은 정육면체의 전개도이다. 이 전개도를 접을 때, 면 ${nf}${jo(nf, 'wa')} 평행한 면은?`, choices: mkText(pickN.map((x) => ({ h: `면 ${NUM6[net.num[x.i] - 1]}`, ok: x.ok, hint: '접으면 이 면은 면 ' + nf + jo(nf, 'wa') + ' 이웃해서 수직이에요. 마주 보는 면을 찾아 보세요.' }))) };
    }
  };

  /* ------------------------------------------------------------------ p3-4 꼬인 위치의 모서리 (정육면체) */
  const edgeNm = (net, fi, vi) => net.edgeKey(fi, vi);
  function skewModel(s) {
    const net = netOf(s, CUBE5), sol = net.sol;
    const ref = sol.edges.find((e) => e.key === s.phSelEdge) || sol.edges[0], c = classify(sol, ref);
    return { net, sol, ref, c };
  }
  function probSkew(M, key, name) {
    classify(M.sol, M.ref);
    const { sol, ref, c } = M, hash = (str) => { let h = 7; for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }, h0 = hash(key + ref.key);
    const byName = (a) => a.slice().sort((x, y) => (x.name < y.name ? -1 : 1));
    const skewL = byName(c.g.skew), othL = byName(c.g.meet.concat(c.g.par, c.g.ext));
    const items = [skewL[h0 % skewL.length]];
    for (let k = 0; items.length < 5 && k < othL.length; k++) { const e = othL[(h0 + k * 3) % othL.length]; if (!items.includes(e)) items.push(e); }
    for (let k = 0; items.length < 5 && k < othL.length; k++) if (!items.includes(othL[k])) items.push(othL[k]);
    const order = items.map((e, i) => ({ e, o: hash(key + ref.key + e.name + i) })).sort((x, y) => x.o - y.o).map((q) => q.e);
    const hint = (e) => (e.rel === 'meet' ? '접으면 기준 모서리와 한 점에서 만나요.' : e.rel === 'par' ? '접으면 기준 모서리와 평행해요.' : '');
    return { tag: '전개도에서 꼬인 위치', key: key + ref.key, stem: `그림은 ${name}의 전개도이다. 이 전개도를 접어 만든 입체에서 모서리 $${ov(ref.name)}$${jo(ref.name, 'wa')} 꼬인 위치에 있는 모서리는? (같은 문자는 접으면 한 점으로 모인다.)`, choices: mkText(order.map((e) => ({ h: `$${ov(e.name)}$`, p: e.name, ok: e.rel === 'skew', hint: hint(e) }))) };
  }
  const A4 = {
    id: 'p3-4', title: '정육면체에서 꼬인 위치의 모서리', short: '꼬인 위치',
    question: '정육면체의 모서리 하나를 정하면 꼬인 위치에 있는 모서리는 몇 개일까? 접은 입체에서 모서리를 하나씩 분류해 보자.',
    cam0: { yaw: -4, pitch: 66 }, ctl: foldCtl, anim: { key: 'phFold', dur: 5, label: '접어 보기', start: 1 }, stepT: (n) => (n >= 1 ? 1 : 0),
    presets: netPresets(CUBE5, 1),
    init: (s) => { initNet(s, CUBE5); s.phFold = 1; s.phQ = { ni: rint(0, CUBE5.length - 1), seed: rint(0, 99) }; },
    reroll: (s) => { s.phQ = { ni: rint(0, CUBE5.length - 1), seed: rint(0, 99) }; s.phSelEdge = null; },
    model: (s) => {
      const M = skewModel(s), q = s.phQ, qn = CUBE5[clamp(q.ni, 0, CUBE5.length - 1)].get(), keys = qn.sol.edges.map((e) => e.key), ref = qn.sol.edges.find((e) => e.key === keys[(q.seed * 7) % keys.length]), c = classify(qn.sol, ref);
      return Object.assign(M, { Q: q, qn, qM: { net: qn, sol: qn.sol, ref, c } });
    },
    draw(b, s, M, C) {
      const st = C.problem ? 0 : C.review ? C.step + 0 : 4, t = C.problem ? 0 : C.review ? C.t : (C.thumb ? 0.6 : s.phFold);
      const MM = C.problem ? M.qM : M, net = MM.net, ref = MM.ref, c = MM.c;
      classify(MM.sol, ref);
      const camA4 = (s0, t0) => (C.problem ? Object.assign({}, s0, { phYaw: 0, phPitch: 84 }) : camFold(s0, t0, 12, -16));
      fitNet(b, s, net, C, null, camA4, C.problem ? 0 : t);
      const D = scene3(b, camA4(s, t), C);
      const faces = drawFaces(D, net, t, () => ({ c: 'green', a: 0.07, ec: 'ink', ew: 0 }));
      const byKey = {}; MM.sol.edges.forEach((e) => { byKey[e.key] = e; });
      const sty = (e) => {
        const r = e.rel;
        if (r === 'ref') return { color: AMB, width: 6.4, glow: true };
        if (C.problem || st === 0) return { color: 'ink', width: 3 };
        if (r === 'meet') return st === 4 || st === 1 ? { color: RED, width: st === 1 ? 5 : 4 } : { color: RED, width: 1.6, alpha: 0.2 };
        if (r === 'par') return st === 4 || st === 2 ? { color: SKY, width: st === 2 ? 5 : 4 } : st > 2 ? { color: SKY, width: 1.6, alpha: 0.2 } : { color: 'ink', width: 3 };
        if (r === 'skew' || r === 'ext') return st === 4 || st === 3 ? { color: GRN, width: 5.6, glow: st === 3 } : { color: 'ink', width: 3 };
        return { color: 'ink', width: 3 };
      };
      faces.forEach((pts, fi) => pts.forEach((p, vi) => { const q = pts[(vi + 1) % pts.length], e = byKey[edgeNm(net, fi, vi)], s0 = sty(e); D.line(p, q, s0.color, s0.width, { alpha: s0.alpha, glow: s0.glow }); }));
      const seen = [], cc = cen3(faces.flat());
      faces.forEach((pts, fi) => pts.forEach((p, vi) => {
        const nmv = net.cname[net.clOf[fi][vi]], sp = D.P(p), sc = b.toS(sp), isR = nmv === ref.u || nmv === ref.v;
        b.point(sp, { color: isR ? AMB : 'ink', r: 4 });
        if (seen.some((q) => q.n === nmv && Math.hypot(q.x - sc.x, q.y - sc.y) < 9)) return;
        seen.push({ n: nmv, x: sc.x, y: sc.y });
        if (C.txt) D.label(p, nmv, { color: isR ? AMB : 'ink', size: 17, dir: D.out(p, cc), gap: 9 });
      }));
      if (C.txt && !C.problem && (st === 3 || st === 4)) {
        const done = new Set();
        faces.forEach((pts, fi) => pts.forEach((p, vi) => { const e = byKey[edgeNm(net, fi, vi)]; if (!e || e.rel !== 'skew') return; const q = pts[(vi + 1) % pts.length], m = mid3(p, q), sc = b.toS(D.P(m)), kk = e.key + '@' + Math.round(sc.x / 8) + ',' + Math.round(sc.y / 8); if (done.has(kk)) return; done.add(kk); D.label(m, String(e.idx), { color: GRN, size: 17, at: [[0, 0], [0, -15], [0, 15], [-15, 0], [15, 0]] }); }));
      }
      if (C.txt) {
        const cap = C.review ? (st === 1 ? `① 만나는 모서리 ${c.nMeet + c.nExt}개 지우기` : st === 2 ? `② 평행한 모서리 ${c.nPar}개 지우기` : st === 3 ? `③ 남은 ${c.nSkew}개 = 꼬인 위치` : '') : '';
        if (cap) b.stext(b.W / 2 - b.insets.right / 2, b.insets.top + 20, cap, { color: st === 1 ? RED : st === 2 ? SKY : GRN, size: 17, weight: 800, align: 'center', baseline: 'middle' });
        else if (C.problem) banner(b, [{ t: `정육면체의 전개도 · 기준 모서리 ${ref.name}`, c: 'ink', size: 15 }], C);
        else banner(b, [{ t: `기준 모서리 ${ref.name}`, c: AMB, size: 16 }], C);
      }
      D.flush();
      if (C.tab === 'explore' && !C.thumb) {
        const cands = []; faces.forEach((pts, fi) => pts.forEach((p, vi) => cands.push({ key: edgeNm(net, fi, vi), p: D.P(mid3(p, pts[(vi + 1) % pts.length])) })));
        const ce = cands.find((q) => q.key === ref.key) || cands[0];
        b.handle('ref', ce.p, { color: 'amber', r: 9, ariaLabel: '기준 모서리 고르기', drag: (w) => { let best = cands[0], bd = 1e18; cands.forEach((q) => { const d = (q.p.x - w.x) ** 2 + (q.p.y - w.y) ** 2; if (d < bd) { bd = d; best = q; } }); s.phSelEdge = best.key; } });
      }
    },
    steps: (M) => {
      const { ref, c } = M, r = ov(ref.name);
      return [
        `전개도를 접어 입체를 만들어요. 같은 문자의 꼭짓점이 한 점으로 모여요. 기준 모서리 $${r}$${jo(ref.name, 'wa')} 만나는 모서리 $${c.nMeet + c.nExt}$개를 지워요.`,
        `$${r}$${jo(ref.name, 'wa')} 평행한 모서리 $${c.nPar}$개도 지워요.`,
        `남은 모서리 $${c.total}-1-${c.nMeet + c.nExt}-${c.nPar}=${c.nSkew}$개가 꼬인 위치예요.`
      ];
    },
    view: (M) => {
      const { ref, c } = M;
      return {
        guide: `<b>노란 손잡이</b>를 끌어 기준 모서리를 바꿔 보세요. 나머지 모서리는 ${span('red', '만나거나')}, ${span('sky', '평행하거나')}, ${span('green', '꼬인 위치')}예요. 같은 문자는 접으면 한 점으로 모이는 꼭짓점이에요. 막대로 펼쳐 보세요.`,
        readouts: [rd('기준 모서리', ref.name, AMB), rd('만나는 모서리', `${c.nMeet + c.nExt}개`, RED), rd('평행한 모서리', `${c.nPar}개`, SKY), rd('꼬인 위치', `${c.nSkew}개`, GRN, `${c.total} − 1 − ${c.nMeet + c.nExt} − ${c.nPar}`)],
        formula: `<p>(꼬인 위치의 개수) $=${c.total}-1-${c.nMeet + c.nExt}-${c.nPar}=${c.nSkew}$ (개)</p>`,
        rule: '꼬인 위치 = 만나지도 않고 평행하지도 않은 두 직선 (한 평면 위에 없다)',
        notes: notes('정육면체에서는 어느 모서리를 기준으로 해도 만나는 것 4개, 평행한 것 3개, 꼬인 위치 4개예요.')
      };
    },
    prob: (M) => probSkew(M.qM, 'p3-4|' + M.Q.ni, '정육면체')
  };

  /* ------------------------------------------------------------------ p3-7 겉면 위의 최단 경로 */
  const A7 = (() => {
    const L = 2.6;
    const pos = (k, phi) => { // 정육면체 꼭짓점(0~L 좌표) → 윗면이 경첩 EF 로 phi 만큼 올라온 위치
      return k;
    };
    void pos;
    const topPt = (x, y, phi) => v3(x - L / 2, y * Math.sin(phi) - L / 2, L + y * Math.cos(phi) - L / 2);
    const fr = (x, z) => v3(x - L / 2, -L / 2, z - L / 2);
    const rollQ = () => ({ a: [4, 6, 8, 10, 12][rint(0, 4)] });
    return {
      id: 'p3-7', title: '겉면 위의 최단 경로', short: '최단 경로',
      question: '정육면체의 꼭짓점 A에서 겉면을 따라 꼭짓점 G까지 가는 가장 짧은 길은 어디를 지날까? 두 면을 펼쳐서 보자.',
      cam0: { yaw: -22, pitch: 14 }, ctl: () => ['phEdge', 'phAnt', 'phFold'].concat(VIEW), anim: { key: 'phFold', dur: 4, label: '접어 보기', start: 0 }, stepT: (n) => (n >= 3 ? 0 : 0),
      init: (s) => { s.phEdge = 8; s.phAnt = 0.3; s.phFold = 0; s.phQ = rollQ(); },
      reroll: (s) => { s.phQ = rollQ(); },
      model: (s) => {
        const a = Math.round(s.phEdge / 2) * 2, r = clamp(s.phAnt, 0.1, 0.9), ep = r * a;
        const len = (rr) => Math.hypot(rr * a, a) + Math.hypot((1 - rr) * a, a);
        return { a, r, ep, len: len(r), minLen: len(0.5), mid: Math.abs(r - 0.5) < 0.02, Q: s.phQ };
      },
      draw(b, s, M, C) {
        const st = stepOf(C), t = C.problem ? 1 : C.review ? 0 : (C.thumb ? 0 : s.phFold), phi = (PI / 2) * t;
        const r = C.problem ? 0.5 : C.review ? (st === 1 ? M.r : 0.5) : M.r;
        const D0 = scene3(b, Object.assign({}, s, { phYaw: s.phYaw, phPitch: s.phPitch }), C);
        const D = D0;
        const A = fr(0, 0), Bp = fr(L, 0), E = fr(0, L), F = fr(L, L), Pp = fr(r * L, L), G = topPt(L, L, phi), H = topPt(0, L, phi);
        const flatG = topPt(L, L, 0), flatH = topPt(0, L, 0), closedG = topPt(L, L, PI / 2);
        const fitp = [A, Bp, E, F, flatG, flatH, closedG, topPt(0, L, PI / 2), v3(-L / 2, L / 2, -L / 2), v3(L / 2, L / 2, -L / 2)];
        D.fitPts(fitp, { t: C.problem ? 46 : 92, b: 52, l: 46, r: 46 });
        // 나머지 네 면(접으면 보이는 입체의 겉면)은 옅게
        const back = [v3(-L / 2, L / 2, -L / 2), v3(L / 2, L / 2, -L / 2), v3(L / 2, L / 2, L / 2), v3(-L / 2, L / 2, L / 2)], bd = [v3(-L / 2, -L / 2, -L / 2), v3(L / 2, -L / 2, -L / 2)];
        if (t > 0.02) {
          const al = t * t * 0.5;
          D.line(bd[0], back[0], 'ink', 2, { dash: [6, 5], alpha: al }); D.line(bd[1], back[1], 'ink', 2, { dash: [6, 5], alpha: al }); D.line(back[0], back[1], 'ink', 2, { dash: [6, 5], alpha: al });
          D.line(back[1], back[2], 'ink', 2, { alpha: al }); D.line(back[0], back[3], 'ink', 2, { dash: [6, 5], alpha: al });
          D.line(bd[1], Bp, 'ink', 2.4, { alpha: al });
        }
        D.panel([A, Bp, F, E], SKY, 0.16, 'ink', 2.4);
        D.panel([E, F, G, H], GRN, 0.16, 'ink', 2.4);
        // 경로
        const seg = (p, q, col, w, dash) => D.line(p, q, col, w, { dash });
        if (!C.problem) {
          if (st === 2 || st === 3) seg(A, G, VIO, 3, [8, 6]);
          seg(A, Pp, AMB, 5); seg(Pp, G, AMB, 5);
          D.dot(Pp, AMB, 7);
        } else { D.line(E, F, AMB, 5, {}); }
        [[A, 'A'], [Bp, 'B'], [E, 'E'], [F, 'F'], [G, 'G'], [H, 'H']].forEach(([p, nm]) => { D.dot(p, nm === 'A' || nm === 'G' ? AMB : 'ink', nm === 'A' || nm === 'G' ? 6.5 : 3.6); if (C.txt) D.label(p, nm, { color: nm === 'A' || nm === 'G' ? AMB : 'ink', size: 18, dir: D.out(p, v3(0, 0, 0)), gap: 10 }); });
        if (C.txt && !C.problem) {
          D.label(Pp, 'P', { color: AMB, size: 18, at: [[0, 20], [0, -20]] });
          const ep = st === 3 || st === 2 ? M.a / 2 : M.ep, pf = M.a - ep;
          D.label(mid3(E, Pp), `${fmt1(ep)}`, { color: SKY, size: 15, at: [[0, -18]] });
          D.label(mid3(Pp, F), `${fmt1(pf)}`, { color: SKY, size: 15, at: [[0, -18]] });
          const L1 = [{ t: `한 모서리 a = ${M.a}`, c: 'ink', size: 15 }];
          if (st === 2 || st === 3) L1.push({ t: 'A와 G를 직선으로 이으면 EF의 가운데를 지나요', c: VIO, size: 14 });
          else if (M.mid && t < 0.05) L1.push({ t: 'AP와 PG가 한 직선이에요 → 가장 짧아요!', c: GRN, size: 15 });
          else L1.push({ t: `경로 A→P→G 의 길이 ≈ ${fmt1(M.len)}`, c: AMB, size: 15 });
          if (st === 3) L1.push({ t: `EP = ${M.a} ÷ 2 = ${M.a / 2}`, c: GRN, size: 16 });
          banner(b, L1, C);
        } else if (C.problem && C.txt) banner(b, [{ t: `정육면체의 한 모서리의 길이 a = ${M.Q.a}`, c: 'ink', size: 16 }], C);
        D.flush();
        if (C.tab === 'explore' && !C.thumb) b.handle('P', D.P(Pp), { color: 'amber', r: 9, ariaLabel: '점 P 옮기기', drag: (w) => { const a0 = D.P(E), a1 = D.P(F); const tt = ((w.x - a0.x) * (a1.x - a0.x) + (w.y - a0.y) * (a1.y - a0.y)) / ((a1.x - a0.x) ** 2 + (a1.y - a0.y) ** 2); s.phAnt = clamp(tt, 0.1, 0.9); } });
      },
      steps: (M) => [
        `두 면(앞면과 윗면)을 한 평면 위에 펼쳐요. 모서리 $\\overline{\\text{EF}}$를 사이에 두고 이어져요.`,
        `펼친 그림에서 $\\text{A}$와 $\\text{G}$를 직선으로 이어요. 직선이 가장 짧아요.`,
        `이 직선은 $\\overline{\\text{EF}}$의 가운데를 지나요. 따라서 $\\overline{\\text{EP}}=\\dfrac{${M.a}}{2}=${M.a / 2}$예요.`
      ],
      view: (M) => ({
        guide: `<b>노란 손잡이</b>를 끌어 점 P를 모서리 EF 위에서 옮겨 보세요. 경로 A→P→G의 길이가 달라져요. 두 면을 펼치면(접기 0%) ${span('amber', '직선')}일 때 가장 짧아요.`,
        readouts: [rd('한 모서리 a', `${M.a}`, SKY), rd('EP', `${fmt1(M.ep)}`, AMB, `a의 ${Math.round(M.r * 100)}%`), rd('경로의 길이', `≈ ${fmt1(M.len)}`, M.mid ? GRN : AMB), rd('가장 짧은 경로', `≈ ${fmt1(M.minLen)}`, GRN, 'P가 EF의 가운데일 때')],
        formula: `<p>최단 경로는 두 면을 펼쳤을 때의 직선이에요. $\\overline{\\text{EP}}=\\dfrac{a}{2}=${M.a / 2}$</p>`,
        rule: '겉면 위의 최단 경로: 두 면을 한 평면 위에 펼쳤을 때 두 점을 잇는 직선',
        notes: notes('펼치면 가로가 $2a$, 세로가 $a$인 직사각형이 돼요. 대각선이 $\\overline{\\text{EF}}$의 가운데를 지나요.', '입체에서는 꺾인 선이지만 펼치면 곧은 선이에요.')
      }),
      prob: (M) => {
        const a = M.Q.a, ans = a / 2;
        return { tag: '겉면 위의 최단 경로', key: 'sp' + a, stem: `그림과 같이 한 모서리의 길이가 $${a}$인 정육면체의 꼭짓점 A에서 겉면을 따라 꼭짓점 G까지 가는 가장 짧은 경로가 모서리 EF와 만나는 점은 점 E에서 얼마나 떨어져 있는가?`, choices: mkChoices(ans, [[ans + 1, '가운데보다 한 칸 F 쪽으로 치우쳤어요.'], [ans - 1, '가운데보다 한 칸 E 쪽으로 치우쳤어요.'], [ans + 2, 'EF의 가운데가 아니에요. 펼친 직선이 지나는 자리를 다시 살펴보세요.'], [ans - 2, 'EF의 가운데가 아니에요. 펼친 직선이 지나는 자리를 다시 살펴보세요.'], [ans + 0.5, ''], [ans - 0.5, ''], [ans + 1.5, ''], [ans - 1.5, '']], { unit: '', valid: (v) => v > 0 && v < a && Math.abs(v * 2 - Math.round(v * 2)) < 1e-9 }) };
      }
    };
  })();
  function fmt1(v) { const x = Math.round(v * 10) / 10; return Number.isInteger(x) ? String(x) : x.toFixed(1); }

  /* ------------------------------------------------------------------ p3-8 주사위의 전개도 */
  const PIPS = { 1: [[0.5, 0.5]], 2: [[0.28, 0.28], [0.72, 0.72]], 3: [[0.28, 0.28], [0.5, 0.5], [0.72, 0.72]], 4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]], 5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]], 6: [[0.28, 0.25], [0.72, 0.25], [0.28, 0.5], [0.72, 0.5], [0.28, 0.75], [0.72, 0.75]] };
  function diceVals(net, flip) { // 마주 보는 면의 눈의 합이 7 이 되게 눈을 정합니다
    const vals = new Array(6).fill(0), pairs = [];
    for (let i = 0; i < 6; i++) if (net.opposite[i] > i) pairs.push([i, net.opposite[i]]);
    pairs.forEach((p, k) => { const lo = k + 1, f = (flip >> k) & 1; vals[p[f ? 1 : 0]] = lo; vals[p[f ? 0 : 1]] = 7 - lo; });
    return vals;
  }
  function drawPips(D, b, poly, n, color, r) {
    const p0 = poly[0], u = sub3(poly[1], poly[0]), v = sub3(poly[3], poly[0]);
    PIPS[n].forEach((q) => D.dot(add3(p0, add3(mul3(u, q[0]), mul3(v, q[1]))), color, r));
  }
  function rollQ38() { return { ni: rint(0, CUBE5.length - 1), flip: rint(0, 7), hid: rint(0, 5) }; }
  const A8 = {
    id: 'p3-8', title: '주사위의 전개도', short: '주사위',
    question: '주사위는 마주 보는 면의 눈의 합이 7이에요. 전개도를 접어서 마주 보는 면을 찾아보자.',
    cam0: CAM0, ctl: foldCtl, anim: foldAnim, stepT: (n) => (n >= 2 ? 1 : 0),
    presets: netPresets(CUBE5),
    init: (s) => { initNet(s, CUBE5); s.phQ = rollQ38(); },
    reroll: (s) => { s.phQ = rollQ38(); },
    model: (s) => {
      const net = netOf(s, CUBE5), vals = diceVals(net, 0), f = s.phSelFace != null && s.phSelFace < 6 ? s.phSelFace : 0, q = s.phQ, qn = CUBE5[clamp(q.ni, 0, CUBE5.length - 1)].get(), qv = diceVals(qn, q.flip);
      const hid = q.hid, ans = qv[hid];
      return { net, vals, f, opp: net.opposite[f], Q: q, qn, qv, hid, ans };
    },
    draw(b, s, M, C) {
      const st = stepOf(C), t = C.problem ? 0 : C.review ? C.t : (C.thumb ? 0.6 : s.phFold);
      const net = C.problem ? M.qn : M.net, vals = C.problem ? M.qv : M.vals, f = M.f, opp = net.opposite[f];
      fitNet(b, s, net, C, null, camFold, C.review ? t : undefined);
      const D = scene3(b, camFold(s, t), C);
      const faces = drawFaces(D, net, t, (i) => (C.problem ? (i === M.hid ? { c: AMB, a: 0.3, ec: AMB, ew: 2.6 } : { c: 'green', a: 0.12 }) : i === f ? { c: AMB, a: 0.38, ec: AMB, ew: 3 } : i === opp && st !== 0 ? { c: SKY, a: 0.38, ec: SKY, ew: 3 } : { c: 'green', a: 0.1 }));
      faces.forEach((p, i) => {
        if (C.problem && i === M.hid) { faceTxt(D, C, cen3(p), '?', { color: AMB, size: 26, at: [[0, 0]] }); return; }
        drawPips(D, b, p, vals[i], i === f && !C.problem ? AMB : i === opp && st !== 0 && !C.problem ? SKY : 'ink', 6.5);
      });
      if (C.txt && !C.problem) {
        const L = [{ t: `눈 ${vals[f]}의 맞은편은 눈 ${vals[opp]}`, c: 'ink', size: 16 }];
        if (st !== 0) L.push({ t: `${vals[f]} + ${vals[opp]} = ${vals[f] + vals[opp]}`, c: GRN, size: 17 });
        banner(b, L, C);
      } else if (C.problem && C.txt) banner(b, [{ t: '주사위의 전개도: 마주 보는 면의 눈의 합 = 7', c: 'ink', size: 15 }], C);
      D.flush();
      if (C.tab === 'explore' && !C.thumb) b.handle('fc', D.P(cen3(faces[f])), { color: 'amber', r: 9, ariaLabel: '면 고르기', drag: (w) => { let best = 0, bd = 1e18; faces.forEach((p, i) => { const q = D.P(cen3(p)), d = (q.x - w.x) ** 2 + (q.y - w.y) ** 2; if (d < bd) { bd = d; best = i; } }); s.phSelFace = best; } });
    },
    steps: (M) => [
      `전개도를 접어서 마주 보는 면을 찾아요. 눈 $${M.vals[M.f]}$의 맞은편은 눈 $${M.vals[M.opp]}$이에요.`,
      `주사위에서 마주 보는 두 면의 눈의 합은 $7$이에요. $${M.vals[M.f]}+${M.vals[M.opp]}=7$.`,
      `전개도에서 한 면의 눈을 알면 마주 보는 면의 눈은 $7-(\\text{그 눈})$으로 구해요.`
    ],
    view: (M) => ({
      guide: `<b>노란 손잡이</b>로 면을 고르고 <b>접기</b> 막대로 접어 보세요. ${span('amber', '고른 면')}과 마주 보는 ${span('sky', '파란 면')}의 눈의 합은 늘 7이에요.`,
      readouts: [rd('고른 면의 눈', `${M.vals[M.f]}`, AMB), rd('마주 보는 면의 눈', `${M.vals[M.opp]}`, SKY), rd('두 눈의 합', `${M.vals[M.f] + M.vals[M.opp]}`, GRN)],
      formula: `<p>(마주 보는 면의 눈) $=7-${M.vals[M.f]}=${M.vals[M.opp]}$</p>`,
      rule: '주사위: 마주 보는 두 면의 눈의 합 = 7 (1과 6, 2와 5, 3과 4)',
      notes: notes('전개도에서 이웃해 보이는 면이 접으면 마주 보는 면이 아닐 수 있어요. 접어서 마주 보는 면을 확인하세요.')
    }),
    prob: (M) => {
      const opp = M.qn.opposite[M.hid], given = M.qv[opp], ans = M.ans, wr = [[given, '마주 보는 면의 눈 그대로예요. 합이 7이 되도록 빼야 해요.'], [ans - 1, '합이 7이 되는지 다시 계산해 보세요.'], [ans + 1, '합이 7이 되는지 다시 계산해 보세요.'], [7 - ans + 0, ''], [(ans % 6) + 1, '']];
      return { tag: '주사위의 전개도', key: `${M.Q.ni}|${M.Q.flip}|${M.hid}`, stem: '그림은 주사위의 전개도이다. 마주 보는 면의 눈의 합이 7일 때, ?에 알맞은 눈의 수는?', choices: mkChoices(ans, wr, { unit: '', valid: (v) => Number.isInteger(v) && v >= 1 && v <= 6 }) };
    }
  };

  G.register(30, 't3', '③ 정다면체의 전개도와 꼬인 위치', '전개도·꼬인 위치', PARAMS, [A1, A2, A3, A4, A5, A6, A7, A8]);
})();
