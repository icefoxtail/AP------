/* ==========================================================================
   중1 · 다면체와 정다면체 — 탭 ③ 「정다면체의 전개도와 꼬인 위치」 (t3.js, order 30) — 장면 8개
   · p3-1 정육면체의 전개도 11가지 · p3-2 [함정] 겹치는 꼭짓점 · p3-3 평행한 면과 수직인 면 · p3-4 정다면체에서 꼬인 위치의 모서리(정육면체·정사면체·정팔면체)
   · p3-5 정사면체의 전개도 · p3-6 정팔면체·정십이면체·정이십면체의 전개도 · p3-7 겉면 위의 최단 경로 · p3-8 주사위의 전개도
   p3-2·p3-5·p3-6은 전개도의 모든 점에 알파벳을 붙이되(교과서처럼 테두리를 따라 반시계 방향으로 A, B, C …, 「이름 바꾸기」로 시작점·방향 변경) 처음에는 회색으로 작게만 둡니다. 다 접으면 겹친 꼭짓점은 합친 이름(A·F·J)으로 모두 보이고 가려진 꼭짓점은 옅게 보입니다. 마주 보는(평행한) 면은 같은 색입니다. 점이나 모서리를 고르면 접었을 때 겹치는 점 · 붙는 모서리만 같은 강조색(노랑)으로 보이고 나머지는 회색입니다.
   모서리는 번호 대신 양 끝 점 이름(모서리 AB)으로 부릅니다(geo.js foldInfoOf 가 접은 모양의 3차원 위치로 계산). p3-1·p3-3 은 면 이름을 A~F 로 하고, p3-8(주사위)은 눈의 수를 그대로 씁니다.
   전개도는 접는 선(경첩)을 축으로 「제자리에서 회전」해 접습니다(이동 없음). 접은 모양은 불투명하게 그려 뒤쪽 글자가 앞에 비치지 않습니다. 화면 맞춤은 지금 그려지는 모양만 기준으로 합니다.
   모든 글자·색·정답은 지금의 전개도와 선택에서 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PH;
  if (!G || !G.prismS) return;
  const { jo, clamp, pick, rint, shuf, PI, DEG, LET, camOf, proj, facing, foldInfoOf, cross3, v3, add3, sub3, mul3, dot3, len3, unit3, lerp3, mid3, rotAxis, scene3, P, VIEW, mkChoices, mkText, rd, notes, fit, bboxOf, classify, ov,
    PLAT, cen3, drawPoly, banner, sRect, cubeNetOf, CUBE_NETS, BAD_NETS, cubeNetOK, cellNet, transformCells, canonCells, randCells, netSvg, polyNetsOf, hasBlock, namedNet, nameIdxOf, OCTA_PICK, TETRA_PICK } = G;

  const PARAMS = {
    phFold: P('접기', 0, 1, 0.005, 0, { color: 'amber', hint: '막대를 끌거나 ▶ 를 눌러 전개도를 접어 보세요', format: (v) => (v < 0.01 ? '펼친 전개도' : v > 0.99 ? '다 접음' : Math.round(v * 100) + '%') }),
    phEdge: P('정육면체의 한 모서리 a', 4, 14, 2, 8, { color: 'sky', hint: '모서리의 길이를 바꿔 보세요', format: (v) => `${Math.round(v)}` }),
    phAnt: P('점 P의 위치 (E에서 F까지)', 0.1, 0.9, 0.01, 0.3, { color: 'amber', hint: '경로가 모서리 EF를 지나는 점 P를 옮겨 보세요', format: (v) => `${Math.round(v * 100)}%` })
  };
  const AMB = 'amber', SKY = 'sky', GRN = 'green', RED = 'red', VIO = 'violet', ORG = 'orange';
  const span = (c, t) => `<b style="color:var(--m-${c})">${t}</b>`;
  const stepOf = (C) => (C.problem ? 0 : C.review ? C.step : 4);
  const FL = 'ABCDEF'; // 정육면체의 면 이름(전개도에서 위→아래, 왼쪽→오른쪽)
  const camFold = (s, t, kp = 30, ky = -26) => Object.assign({}, s, { phPitch: Math.max(-10, (s.phPitch == null ? 70 : s.phPitch) - kp * t), phYaw: (s.phYaw == null ? 0 : s.phYaw) + ky * t });
  /* 접은 입체의 겨냥도 시점: 전개도는 위에서(84°) 내려다보고, 접을수록 28°까지 낮춰 입체가 옆에서 보이게 합니다(교과서: 위에서 15~30°).
     옆으로 도는 각은 접은 입체마다, 꼭짓점·모서리가 포개지지 않는 방위를 점수 탐색으로 정했습니다(정육면체 -22°, 정사면체 -6°, 정팔면체 36°, 정십이면체 -14°, 정이십면체 -30°). */
  const FOLD_PITCH = 28, FOLD_YAW = { cube: -22, tetra: -6, octa: 36, dodeca: -14, icosa: -30 };
  const camFoldK = (kind) => (s, t) => camFold(s, t, Math.max(0, (s.phPitch == null ? 70 : s.phPitch) - FOLD_PITCH), FOLD_YAW[kind] != null ? FOLD_YAW[kind] : -22);
  // 접은 모양(다 접었을 때) 앞면이 하나도 없는 모서리(= 가려진 모서리)의 (면, 꼭짓점 번호) 목록
  const hiddenEdgesOf = (net, fvis) => {
    const m = new Map();
    net.faces.forEach((f, fi) => f.poly.forEach((_, vi) => { const k = net.edgeKey(fi, vi); if (!m.has(k)) m.set(k, { fi, vi, vis: false }); if (fvis[fi]) m.get(k).vis = true; }));
    return Array.from(m.values()).filter((e) => !e.vis);
  };
  const CAM0 = { yaw: 0, pitch: 84 };
  /* 평행한(마주 보는) 면은 같은 색: 정육면체 3쌍 · 정팔면체 4쌍(정사면체는 평행한 면이 없어 한 색). 채도 낮은 파스텔(투명도 0.2)이라 선·글자·노랑 강조가 위에서도 또렷하고,
     전개도와 접은 겨냥도가 같은 면에 같은 색을 씁니다. 색만으로 구분하지 않도록 면 이름(p3-3)이나 노랑 강조가 함께 있습니다. 문제 탭에서는 정답이 드러나므로 칠하지 않습니다. */
  const PAIRC = ['green', 'violet', 'rose', 'sky'];
  const PAIR_ALPHA = 0.2;
  function pairColors(net) {
    if (net._pc) return net._pc;
    const col = net.faces.map(() => null);
    if (net.kind === 'cube' || net.kind === 'octa') { let k = 0; net.opposite.forEach((o, i) => { if (o >= 0 && col[i] == null && col[o] == null) { col[i] = col[o] = PAIRC[k % PAIRC.length]; k++; } }); }
    return (net._pc = col);
  }
  const ptName = (n, k) => (n.ptName[k] || String(k + 1));

  /* ------------------------------------------------------------------ 전개도 목록 */
  const cubeSpec = (key, label) => ({ label, get: () => cubeNetOf(key) });
  const polySpec = (kind, idx, label) => ({ label, get: () => (polyNetsOf(kind)[idx] || polyNetsOf(kind)[0]) });
  // 정육면체 겹치는 점 장면(p3-2)의 첫 전개도: 교과서 그림(1-4-1형, 위 칸은 둘째 칸 위·아래 칸은 넷째 칸 아래, 이름은 테두리를 따라 A~N)
  const TEXTBOOK_CUBE = [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]];
  let textbookCubeNet = null;
  const textbookCubeSpec = (label) => ({ label, get: () => textbookCubeNet || (textbookCubeNet = cellNet(TEXTBOOK_CUBE, '1-4-1형', -1)) });
  const CUBE5 = [cubeSpec('a1', '1-4-1형 ㉮'), cubeSpec('a3', '1-4-1형 ㉯'), cubeSpec('b2', '2-3-1형'), cubeSpec('c1', '2-2-2형'), cubeSpec('d1', '3-3형')];
  const CUBE_P2 = [textbookCubeSpec('1-4-1형 ㉮'), cubeSpec('a1', '1-4-1형 ㉯'), cubeSpec('b2', '2-3-1형'), cubeSpec('c1', '2-2-2형'), cubeSpec('d1', '3-3형')];
  const CUBE_ALL = CUBE_NETS.map((d, i) => Object.assign(cubeSpec(d.key, `${d.g} ${d.g.startsWith('1-4-1') ? '㉮㉯㉰㉱㉲㉳'[CUBE_NETS.filter((q) => q.g === d.g).indexOf(d)] : d.g.startsWith('2-3-1') ? '㉮㉯㉰'[CUBE_NETS.filter((q) => q.g === d.g).indexOf(d)] : ''}`.trim()), { group: i === 0 ? '정육면체가 되는 11가지' : '', valid: true })).concat(BAD_NETS.map((d, i) => Object.assign(cubeSpec(d.key, `✕ ${d.g}`), { group: i === 0 ? '정육면체가 안 되는 모양' : '', valid: false })));
  const netOf = (s, specs) => specs[clamp(s.phNet | 0, 0, specs.length - 1)].get();
  const netPresets = (specs, fold0 = 0) => () => specs.map((sp, i) => ({ group: sp.group != null ? sp.group : i === 0 ? '전개도 모양' : '', label: sp.label, apply: (st) => { st.phNet = i; st.phFold = fold0; st.phSel = 0; st.phSelPt = null; st.phSelFace = null; st.phSelEdge = null; st.phNm = 0; }, on: (st) => (st.phNet | 0) === i }));

  /* ------------------------------------------------------------------ 그리기 공통 */
  // 평평한 모양과 접은 모양을 모두 담는 고정 화면 틀
  function fitNet(b, s, net, C, pad, camF = camFold, cur) {
    const pts = [];
    (cur == null ? [0, 0.5, 1] : [cur]).forEach((t) => { const D = scene3(b, camF(s, t), C); net.at(t).forEach((f) => f.forEach((p) => pts.push(D.P(p)))); });
    fit(b, bboxOf(pts), Object.assign({ t: C.problem ? 40 : 108, b: 46, l: 40, r: 40 }, pad || {}));
  }
  // 문제 탭의 펼친 전개도가 세로로 길면(높이 > 폭) 90° 돌려 가로로 놓습니다(그림 영역 폭을 쓰도록). 글자는 따로 수평으로 쓰므로 똑바로 보입니다. 접기 그림에는 쓰지 않습니다.
  function landscapeNet(net) {
    if (net._land !== undefined) return net._land;
    const P0 = net.at(0).flat(), bb = bboxOf(P0.map((q) => ({ x: q.x, y: q.y })));
    if (bb.y1 - bb.y0 <= bb.x1 - bb.x0 + 1e-6) return (net._land = net);
    const cx = (bb.x0 + bb.x1) / 2, cy = (bb.y0 + bb.y1) / 2, rot = (q) => v3(cx - (q.y - cy), cy + (q.x - cx), q.z);
    return (net._land = Object.assign({}, net, { at: (t) => net.at(t).map((f) => f.map(rot)), faces: net.faces.map((f) => Object.assign({}, f, { poly: f.poly.map(rot) })) }));
  }
  // 지금 그려지는 모양(시간 t)만 화면에 꼭 맞춥니다: 접은 입체가 작아지지 않고, 펼친 쪽으로 치우치지 않습니다.
  function fitNow(b, s, net, C, pad, camF, t) { fitNet(b, s, net, C, pad, camF, t); }
  // 면을 먼 것부터 불투명하게 그립니다(앞면이 뒤쪽 모서리·글자를 가립니다). col(fi) → {c,a,ec,ew}. 다 접었을 때 보이는 면(vis)도 돌려줍니다(덜 접었으면 모두 true).
  function drawFacesOp(D, net, t, col, edgeAlpha) {
    const faces = net.at(t), fin = t >= 0.97;
    const facingV = faces.map((pts, i) => { const f0 = net.faces[i].poly, sg = Math.sign(cross3(sub3(f0[1], f0[0]), sub3(f0[2], f0[0])).z) || 1; return facing(D.cam, mul3(cross3(sub3(pts[1], pts[0]), sub3(pts[2], pts[0])), -sg)); });
    const order = faces.map((p, i) => ({ i, d: D.depth(cen3(p)) })).sort((a, c) => c.d - a.d);
    // 덜 접었을 때: 더 앞에 그려진 면에 한가운데가 가려진 면은 이름을 숨깁니다(뒤쪽 글자가 앞면과 섞이지 않게).
    const polyOf = faces.map((p) => p.map((q) => D.P(q)));
    const inPoly = (pt, poly) => { let c = false; for (let a = 0, b2 = poly.length - 1; a < poly.length; b2 = a++) { if ((poly[a].y > pt.y) !== (poly[b2].y > pt.y) && pt.x < ((poly[b2].x - poly[a].x) * (pt.y - poly[a].y)) / (poly[b2].y - poly[a].y) + poly[a].x) c = !c; } return c; };
    const pos = new Map(order.map((o, k) => [o.i, k]));
    const vis = faces.map((pts, i) => (fin ? facingV[i] : !order.some((o) => pos.get(o.i) > pos.get(i) && inPoly(D.P(cen3(pts)), polyOf[o.i]))));
    order.forEach(({ i }) => {
      const st = (col && col(i)) || {};
      D.fill(faces[i], 'stage', 1);
      D.panel(faces[i], st.c || 'green', st.a == null ? 0.1 : st.a, st.ec || 'ink', st.ew || 1.8, { alpha: st.ec ? 1 : edgeAlpha });
    });
    // 다 접었으면 가려진 모서리를 점선으로(안 보이는 모서리는 점선)
    if (fin) hiddenEdgesOf(net, vis).forEach((e) => { const pts = faces[e.fi]; D.line(pts[e.vi], pts[(e.vi + 1) % pts.length], 'ink', 1.6, { dash: [6, 5], alpha: 0.55 }); });
    return { faces, vis };
  }
  // 면을 먼 것부터 그립니다(투명). col(fi) → {c,a,ec,ew,alpha}
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
  const initNet = (s, specs, extra) => { s.phNet = 0; s.phFold = 0; s.phSel = 0; s.phSelPt = null; s.phSelFace = null; s.phSelEdge = null; s.phNm = 0; if (extra) extra(s); };

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
    cam0: CAM0, pmin: FOLD_PITCH, ctl: foldCtl, anim: foldAnim, stepT: (n) => (n >= 2 ? 1 : 0),
    presets: netPresets(CUBE_ALL),
    init: (s) => { initNet(s, CUBE_ALL); s.phQ = rollQ31(); },
    reroll: (s) => { s.phQ = rollQ31(); },
    model: (s) => { const spec = CUBE_ALL[clamp(s.phNet | 0, 0, CUBE_ALL.length - 1)], net = spec.get(); return { spec, net, valid: spec.valid, Q: s.phQ, ovl: net.overlap }; },
    draw(b, s, M, C) {
      const st = stepOf(C), t = C.problem ? 1 : C.review ? C.t : (C.thumb ? 0.6 : s.phFold);
      const net = C.problem ? cubeNetOf('a1') : M.net;
      fitNow(b, s, net, C, { t: C.problem ? 40 : C.thumb ? 5 : 68, b: 18 }, camFoldK('cube'), t);
      const D = scene3(b, camFoldK('cube')(s, t), C);
      const showBad = !C.problem && !M.valid && t > 0.85;
      const { faces, vis } = drawFacesOp(D, net, t, (i) => (showBad && M.ovl[i] ? { c: RED, a: 0.5, ec: RED, ew: 3 } : { c: 'green', a: C.problem ? 0.16 : 0.14, ec: 'ink', ew: 2 }));
      if (showBad) faces.forEach((p, i) => { if (M.ovl[i]) D.panel(p, RED, 0.2, RED, 3, vis[i] ? {} : { dash: [7, 5] }); }); // 가려져도 겹치는 면이 보이게
      if (C.txt && !C.problem) {
        // 면 이름 A~F(회색). 겹치는 면은 같은 자리에 있으므로 이름을 한 번에 묶어 붉게 보입니다.
        const done = new Set();
        faces.forEach((p, i) => {
          if (done.has(i)) return;
          const same = faces.map((_, j) => j).filter((j) => len3(sub3(cen3(faces[j]), cen3(p))) < 1e-3);
          same.forEach((j) => done.add(j));
          const bad = showBad && same.some((j) => M.ovl[j]);
          if (!vis[i] && !bad) return;
          D.label(cen3(p), same.map((j) => fLet(net, j)).sort().join('·'), { color: bad ? RED : 'ink', alpha: bad ? 1 : 0.78, size: 28, at: [[0, 0]] });
        });
      }
      if (C.txt && !C.problem) {
        const L = [{ t: M.spec.label.replace('✕ ', ''), c: 'ink', size: 16 }];
        if (t > 0.9 && st !== 1) {
          const ov = faces.map((_, i) => i).filter((i) => M.ovl[i]).map((i) => fLet(net, i)).sort();
          L.push(M.valid ? { t: '여섯 면이 겹치지 않아요 → 정육면체 ○', c: GRN, size: 15 } : { t: `빨간 면(${ov.join(', ')})이 겹쳐요 → 정육면체 ✕`, c: RED, size: 15 });
        }
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
      guide: `전개도 버튼을 눌러 고르고 <b>접기</b> 막대를 끌거나 ▶를 눌러 접어 보세요. 접어서 면이 겹치면 ${span('red', '빨갛게')} 표시돼요. 정육면체가 되는 전개도는 모두 11가지예요.`,
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
    const fmt = (arr) => '점 ' + arr.slice().sort((a, c) => nm(a).localeCompare(nm(c))).map(nm).join(', ');
    const key = (arr) => arr.slice().sort((a, c) => a - c).join(',');
    const seen = new Set([key(T)]), out = [{ h: fmt(T), ok: true, set: T, hint: '' }];
    const add = (arr, hint) => { if (!arr.length || arr.length > 3) return; const kk = key(arr); if (seen.has(kk) || arr.includes(k)) return; seen.add(kk); out.push({ h: fmt(arr), ok: false, set: arr, hint }); };
    if (T.length > 1) add([T[0]], '겹치는 점이 더 있어요. 같은 점으로 모이는 점을 모두 찾아야 해요.');
    const others = all.filter((j) => !T.includes(j));
    if (others.length) add(T.concat([others[rint(0, others.length - 1)]]), '다른 점으로 모이는 점이 하나 섞여 있어요.');
    let g = 0;
    while (out.length < 5 && g++ < 200) {
      const n = rint(1, Math.max(1, Math.min(2, T.length + 1))), arr = []; while (arr.length < n) { const j = all[rint(0, all.length - 1)]; if (!arr.includes(j)) arr.push(j); }
      add(arr, '접으면 이 점들은 점 ' + nm(k) + jo(nm(k), 'wa') + ' 만나지 않아요.');
    }
    return out;
  }
  // 새 문제: 전개도 · 묻는 점 · 이름 배치(nv, 테두리 위 시작점·방향)를 함께 새로 뽑습니다. 바로 앞 문제와 같은 조합은 피합니다.
  function rollOverlapQ(specs, ptsOk, prev) {
    let last = null;
    for (let g = 0; g < 120; g++) {
      const ni = rint(0, specs.length - 1), net = specs[ni].get(), cand = net.pt.map((_, j) => j).filter((j) => samePts(net, j).length >= 1 && (!ptsOk || ptsOk(net, j)));
      if (!cand.length) continue;
      const q = { ni, k: cand[rint(0, cand.length - 1)], nv: rint(0, 99) };
      last = q;
      if (!prev || prev.ni !== q.ni || prev.k !== q.k || nameIdxOf(net, prev.nv) !== nameIdxOf(net, q.nv)) return q;
    }
    return last || { ni: 0, k: 0, nv: 0 };
  }
  /* ------------------------------------------------------------------ 접어서 겹치는 점 · 붙는 모서리 (정사면체·정육면체·정팔면체·정십이면체·정이십면체)
     전개도의 모든 점에 알파벳을 붙이되, 처음에는 회색으로 작게만 둡니다. 점이나 모서리를 고르면 그것과 겹치는 점 · 붙는 모서리만 같은 강조색(노랑)으로 보이고 나머지는 회색입니다.
     어느 점이 어느 점과 겹치고 어느 모서리가 어느 모서리와 붙는지는 foldInfoOf(geo.js)가 접은 모양의 3차원 위치에서 계산합니다.
     모서리는 번호 대신 양 끝 점 이름(모서리 AB)으로 부릅니다. */
  // 선택: phSel 0 = 없음(phSelPt 가 있으면 혼자인 점 하나), 1..nP = 붙는 모서리 쌍, 그 뒤 = 꼭짓점 모둠(접으면 한 점이 되는 점들)
  const selOf = (net, fi, s) => {
    const n = fi.nPairs + fi.groups.length, i = clamp(s.phSel | 0, 0, n);
    if (i === 0) return s.phSelPt != null && s.phSelPt >= 0 && s.phSelPt < net.pt.length ? { kind: 'p', k: s.phSelPt, idx: 0 } : { kind: 'none', idx: 0 };
    return i <= fi.nPairs ? { kind: 'e', i: i - 1, idx: i } : { kind: 'v', g: i - 1 - fi.nPairs, idx: i };
  };
  const grpIdx = (fi, g) => fi.nPairs + 1 + g;
  const lettersOf = (net, pts) => pts.map((k) => ptName(net, k)).sort((a, c) => (a.length - c.length) || (a < c ? -1 : a > c ? 1 : 0)); // 이름 순서(A, B, C …)
  const firstPartnerPt = (net) => { let k = -1; net.pt.forEach((_, j) => { if (samePts(net, j).length >= 1 && (k < 0 || ptName(net, j) < ptName(net, k))) k = j; }); return k < 0 ? 0 : k; }; // 겹치는 점이 있는 점 중 이름이 가장 빠른 점
  const eName = (net, e) => [ptName(net, e.ka), ptName(net, e.kb)].sort().join('');
  // 모서리 e 의 짝 모서리와, e 의 끝점에 겹치는 짝의 끝점 [[e 의 끝, 짝의 끝], …]
  const partnerOf = (fi, e) => {
    const e2 = fi.pairs[e.pair].find((q) => q !== e), m = [];
    if (e2) { if (e.ca === e2.ca) m.push([e.ka, e2.ka], [e.kb, e2.kb]); else m.push([e.ka, e2.kb], [e.kb, e2.ka]); }
    return { e2, m };
  };
  // 점 k 에서 시작하는 붙는 모서리 하나(없으면 null)
  const pairEdgeAt = (fi, k) => fi.E.find((e) => e.pair >= 0 && (e.ka === k || e.kb === k)) || null;
  const selectPoint = (net, fi, s, k) => { const g = fi.ptGrp[k]; if (g >= 0) { s.phSel = grpIdx(fi, g); s.phSelPt = k; } else { s.phSel = 0; s.phSelPt = k; } };
  const clearSel = (s) => { s.phSel = 0; s.phSelPt = null; };
  const nmJoin = (arr) => arr.join(', ');

  /* 그림을 직접 눌러 고르기: 그림 위에서 손가락·마우스가 거의 움직이지 않은 채 떼면 가까운 점·모서리·면을 고릅니다(끄는 동작은 시점 돌리기라서 구별합니다). */
  const TAP = { fn: null };
  function bindTap(b) {
    const cv = b.canvas;
    if (!cv || cv.__phTap) return;
    cv.__phTap = true;
    let down = null;
    cv.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: Date.now(), id: e.pointerId }; });
    cv.addEventListener('pointerup', (e) => {
      const d = down; down = null;
      if (!d || d.id !== e.pointerId || !TAP.fn) return;
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8 || Date.now() - d.t > 700) return;
      const r = cv.getBoundingClientRect();
      TAP.fn({ x: e.clientX - r.left, y: e.clientY - r.top }, e.pointerType === 'touch');
    });
  }
  // 이 장면의 탐구 탭에서만 동작하게 묶습니다(다른 장면·탭으로 가면 저절로 꺼집니다).
  function armTap(b, C, id, onTap) {
    if (C.thumb || b.thumb) return;
    bindTap(b);
    TAP.fn = C.tab === 'explore' ? (p, touch) => {
      const lab = window.lab;
      if (!lab || !lab.scene || lab.scene.id !== id || lab.tab !== 'explore') return;
      onTap(lab.s, p, touch);
      lab.invalidate(true);
    } : null;
  }
  // 선분 둘레에 작은 상자를 깔아 두어 글자가 선 위에 놓이지 않게 합니다(화면 픽셀).
  function edgeObs(D, a, c) { const n = Math.max(1, Math.ceil(Math.hypot(c.x - a.x, c.y - a.y) / 6)); for (let i = 0; i <= n; i++) { const x = a.x + ((c.x - a.x) * i) / n, y = a.y + ((c.y - a.y) * i) / n; D.boxes.push({ x0: x - 2.5, x1: x + 2.5, y0: y - 2.5, y1: y + 2.5 }); } }
  const segDist = (p, a, c) => { const dx = c.x - a.x, dy = c.y - a.y, l2 = dx * dx + dy * dy || 1, t = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / l2, 0, 1); return Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t)); };

  function foldDraw(o, b, s, M, C) {
    const net = M.net, fi = M.fi, st = stepOf(C), letters = M.letters;
    const t = C.review ? C.t : C.thumb ? 0.6 : s.phFold;
    const hasTxt = C.txt && !C.thumb;
    const cams = (tt) => camOf(camFoldK(net.kind)(s, tt)); // 접을수록 낮은 시점(28°)에서 보아 입체로 보이게
    const flatPts = (tt) => { const cam = cams(tt); return net.at(tt).flat().map((p) => { const q = proj(cam, p); return { x: q.x, y: q.y }; }); };
    const dual = !C.thumb && b.W >= 640;
    // 무엇을 강조할지: 탐구는 고른 것, 정리는 단계마다 한 쌍
    const hiPts = new Set(), hiEdges = [];
    if (C.review) {
      const k = M.k, e = pairEdgeAt(fi, k);
      if (st <= 1) hiPts.add(k);
      else if (st === 2) { hiPts.add(k); if (e) { fi.pairs[e.pair].forEach((q) => { hiEdges.push(q); hiPts.add(q.ka); hiPts.add(q.kb); }); } }
      else (fi.ptGrp[k] >= 0 ? fi.groups[fi.ptGrp[k]].pts : [k]).forEach((j) => hiPts.add(j));
    } else if (!C.thumb) {
      const sel = M.sel;
      if (sel.kind === 'v') fi.groups[sel.g].pts.forEach((j) => hiPts.add(j));
      else if (sel.kind === 'p') hiPts.add(sel.k);
      else if (sel.kind === 'e') fi.pairs[sel.i].forEach((q) => { hiEdges.push(q); hiPts.add(q.ka); hiPts.add(q.kb); });
    }
    const anyHi = hiPts.size > 0;
    // 화면 배치: 전개도(왼쪽)와 접은 모양(오른쪽 칸)을 나란히(PC). 휴대폰은 지금 모양만 화면에 꼭 맞춥니다(접을수록 입체가 커집니다).
    const curB = bboxOf(flatPts(t)), cw = curB.x1 - curB.x0, ch = curB.y1 - curB.y0;
    let box, placeL = null, placeR;
    const g = net.kind === 'octa' ? 1.5 : 0.7; // 정팔면체: 왼쪽 그림의 끝 점 이름(G)과 오른쪽 그림의 왼쪽 점 이름(C)이 맞닿지 않게 사이를 넓힙니다
    if (dual) {
      const bL = bboxOf(flatPts(0)), wL = bL.x1 - bL.x0, hL = bL.y1 - bL.y0, slot = { w: wL, h: hL * 1.9, cx: g / 2 + wL / 2 };
      placeL = { cx: -g / 2 - wL / 2, cy: 0, z: 1 };
      placeR = { cx: slot.cx, cy: 0, z: Math.max(0.2, Math.min(2.2, slot.w / cw, slot.h / ch)) };
      box = { x0: -g / 2 - wL, x1: g / 2 + wL, y0: -slot.h / 2, y1: slot.h / 2 };
    } else {
      placeR = { cx: 0, cy: 0, z: 1 };
      box = { x0: -cw / 2, x1: cw / 2, y0: -ch / 2, y1: ch / 2 };
    }
    fit(b, box, { t: C.thumb ? 5 : dual ? 100 : 84, b: 22, l: 40, r: 40 });
    const D = scene3(b, camFoldK(net.kind)(s, t), C);
    const sg = net.faces.map((f) => (Math.sign(cross3(sub3(f.poly[1], f.poly[0]), sub3(f.poly[2], f.poly[0])).z) || 1));
    const clusters = net.cl.map((_, c) => ({ c, pts: net.pt.map((__, k) => k).filter((k) => net.ptCl[k] === c) }));
    const targets = { pts: [], edges: [] };
    const pc = pairColors(net); // 마주 보는 면 쌍의 색(정육면체·정팔면체만)
    const small = net.kind === 'tetra' || net.kind === 'cube' || net.kind === 'octa'; // 점이 적어 접은 모양의 모든 꼭짓점에 이름을 붙일 수 있는 입체

    const mkPanel = (tt, place) => {
      const cam = cams(tt), F = net.at(tt), fin = tt >= 0.97;
      const pb = bboxOf(flatPts(tt)), pcx = (pb.x0 + pb.x1) / 2, pcy = (pb.y0 + pb.y1) / 2;
      const pj = (p) => { const q = proj(cam, p); return { x: (q.x - pcx) * place.z + place.cx, y: (q.y - pcy) * place.z + place.cy }; };
      const fvis = F.map((pts, i) => facing(cam, mul3(cross3(sub3(pts[1], pts[0]), sub3(pts[2], pts[0])), -sg[i])));
      // 면: 먼 것부터, 불투명하게(앞면이 뒤쪽 모서리·글자를 가립니다)
      F.map((p, i) => ({ i, d: proj(cam, cen3(p)).d })).sort((a, c) => c.d - a.d).forEach(({ i }) => {
        const poly = F[i].map(pj);
        b.path(poly, { close: true, fill: 'stage', fillAlpha: 1, color: null });
        b.path(poly, { close: true, fill: pc[i] || 'green', fillAlpha: pc[i] ? (fin && !fvis[i] ? 0.13 : PAIR_ALPHA) : (fin && fvis[i] ? 0.16 : 0.1), color: 'ink', width: 2, alpha: anyHi ? 0.72 : 1 });
      });
      // 다 접었으면 안 보이는 모서리를 점선으로
      if (fin) hiddenEdgesOf(net, fvis).forEach((e) => b.path([pj(F[e.fi][e.vi]), pj(F[e.fi][(e.vi + 1) % F[e.fi].length])], { color: 'ink', width: 1.6, alpha: 0.55, dash: [6, 5] }));
      const A = (e) => pj(F[e.fi][e.vi]), B = (e) => pj(F[e.fi][e.vj]);
      if (hasTxt) F.forEach((pts, i) => { if (!fin || fvis[i]) pts.forEach((q, j) => edgeObs(D, b.toS(pj(q)), b.toS(pj(pts[(j + 1) % pts.length])))); });
      hiEdges.forEach((e) => { const vis = !fin || fvis[e.fi]; b.path([A(e), B(e)], { color: AMB, width: vis ? 5.4 : 3.6, dash: vis ? undefined : [7, 5] }); });
      // 점
      const cp = clusters.map((cl) => ({ cl, pos: cl.pts.map((k) => pj(ptPos(net, F, k))), vis: !fin || net.cl[cl.c].members.some((m) => fvis[m[0]]) }));
      const all = cp.flatMap((q) => q.pos), cen = { x: all.reduce((a, q) => a + q.x, 0) / all.length, y: all.reduce((a, q) => a + q.y, 0) / all.length };
      cp.forEach((q) => q.pos.forEach((p, j) => {
        const k = q.cl.pts[j], h = hiPts.has(k);
        if (h) b.point(p, { color: AMB, r: 6.8, hollow: !q.vis });
        else if (q.vis) b.point(p, { color: 'muted', r: 3.2 });
        else if (small && j === 0) b.point(p, { color: 'muted', r: 3, hollow: true }); // 다 접었을 때 뒤쪽(가려진) 꼭짓점: 속이 빈 작은 점(점선 모서리 끝이 비지 않게)
        if (hasTxt) { const sp = b.toS(p); D.boxes.push({ x0: sp.x - 8, x1: sp.x + 8, y0: sp.y - 8, y1: sp.y + 8 }); }
      }));
      if (!C.thumb) {
        cp.forEach((q) => q.pos.forEach((p, j) => { if (q.vis) targets.pts.push({ k: q.cl.pts[j], s: b.toS(p) }); }));
        fi.pairs.forEach((es) => es.forEach((e) => { if (!fin || fvis[e.fi]) targets.edges.push({ pair: e.pair, a: b.toS(A(e)), c: b.toS(B(e)) }); }));
      }
      const unitTo = (p, c) => { const dx = p.x - c.x, dy = p.y - c.y, l = Math.hypot(dx, dy); return l < 1e-6 ? { x: 0, y: -1 } : { x: dx / l, y: dy / l }; };
      const labels = () => {
        if (!hasTxt || !letters) return;
        // 다 접으면 겹친 점은 합친 이름(예: A·F·J)으로 모두 보입니다. 순서: 고른 것 → 보이는 것 → 가려진 것(옅게). 덜 접었을 때는 점마다 이름을 붙입니다.
        const todo = [];
        cp.forEach((q) => {
          const mx = q.pos.reduce((a, p) => a + p.x, 0) / q.pos.length, my = q.pos.reduce((a, p) => a + p.y, 0) / q.pos.length;
          const spread = Math.max(...q.pos.map((p) => Math.hypot(p.x - mx, p.y - my))) * (b.k || 60);
          const merged = q.pos.length > 1 && (spread < 14 || (small && fin)), on = q.cl.pts.filter((k) => hiPts.has(k)), dir = unitTo({ x: mx, y: my }, cen);
          if (merged) {
            if (small) todo.push({ p: { x: mx, y: my }, text: lettersOf(net, q.cl.pts).join('·'), color: on.length ? AMB : 'ink', size: on.length ? 19 : 18, alpha: q.vis ? (on.length ? 1 : 0.85) : 0.42, rank: on.length ? 0 : q.vis ? 1 : 2, dir, gap: q.vis ? 12 : 10 });
            else if (on.length) todo.push({ p: { x: mx, y: my }, text: lettersOf(net, on).join('·'), color: AMB, size: 19, rank: 0, dir, gap: 12 }); // 점이 많은 입체: 고른 묶음만
            return;
          }
          q.cl.pts.forEach((k, j) => {
            if (hiPts.has(k)) todo.push({ p: q.pos[j], text: ptName(net, k), color: AMB, size: 19, rank: 0, dir: unitTo(q.pos[j], cen), gap: 12 });
            else if (q.vis) todo.push({ p: q.pos[j], text: ptName(net, k), color: 'ink', alpha: 0.75, size: 18, rank: 1, dir: unitTo(q.pos[j], cen), gap: 9 });
            else if (small) todo.push({ p: q.pos[j], text: ptName(net, k), color: 'ink', alpha: 0.42, size: 16, rank: 2, dir: unitTo(q.pos[j], cen), gap: 9 });
          });
        });
        todo.sort((a, c) => a.rank - c.rank).forEach((t) => D.label(t.p, t.text, { fig: true, color: t.color, alpha: t.alpha, size: t.size, dir: t.dir, gap: t.gap }));
      };
      return { pj, F, labels };
    };
    const pL = dual ? mkPanel(0, placeL) : null, pR = mkPanel(t, placeR);
    [pL, pR].forEach((p) => p && p.labels());

    if (hasTxt) {
      const nm = (j) => ptName(net, j), pre = `${net.name}의 전개도`;
      const state = t < 0.01 ? '접기 전' : t > 0.99 ? '다 접음' : '접는 중';
      const L = [{ t: dual ? pre : `${pre} · ${state}`, c: 'ink', size: 15 }];
      if (C.review) {
        if (st <= 1) L.push({ t: letters ? `점 ${nm(M.k)}${jo(nm(M.k), 'eul')} 골랐어요` : '점 하나를 골랐어요', c: AMB, size: 15 });
        else if (st === 2) { const e = pairEdgeAt(fi, M.k); L.push({ t: e && letters ? `모서리 ${eName(net, e)}${jo(eName(net, e), 'wa')} ${eName(net, partnerOf(fi, e).e2)}${jo(eName(net, partnerOf(fi, e).e2), 'i')} 붙어요` : e ? '붙는 모서리 한 쌍' : '붙는 모서리가 없어요', c: AMB, size: 15 }); }
        else L.push({ t: fi.ptGrp[M.k] >= 0 ? (letters ? `${lettersOf(net, fi.groups[fi.ptGrp[M.k]].pts).join('·')} → 접으면 한 꼭짓점` : `겹치는 점 ${fi.groups[fi.ptGrp[M.k]].pts.length}개 → 한 꼭짓점`) : '다른 점과 만나지 않아요', c: AMB, size: 15 });
      } else {
        const sel = M.sel;
        if (sel.kind === 'v') L.push({ t: letters ? `${lettersOf(net, fi.groups[sel.g].pts).join('·')} → 접으면 한 꼭짓점` : `겹치는 점 ${fi.groups[sel.g].pts.length}개 → 접으면 한 꼭짓점`, c: AMB, size: 15 });
        else if (sel.kind === 'p') L.push({ t: letters ? `점 ${nm(sel.k)}${jo(nm(sel.k), 'eun')} 다른 점과 만나지 않아요` : '이 점은 다른 점과 만나지 않아요', c: AMB, size: 15 });
        else if (sel.kind === 'e') { const q = fi.pairs[sel.i], a = eName(net, q[0]), c2 = eName(net, q[1]); L.push({ t: letters ? `모서리 ${a}${jo(a, 'wa')} ${c2}${jo(c2, 'i')} 붙어서 하나가 돼요` : '두 모서리가 붙어서 하나가 돼요', c: AMB, size: 15 }); }
        else L.push({ t: '점이나 모서리를 눌러 보세요', c: 'muted', size: 15 });
      }
      banner(b, L, C);
      if (dual) {
        const capY = b.insets.top + 66, sx = (x) => b.toS({ x, y: 0 }).x;
        b.stext(sx(placeL.cx), capY, '전개도', { color: 'muted', size: 15, weight: 800, align: 'center', baseline: 'middle' });
        b.stext(sx(placeR.cx), capY, state === '접기 전' ? '접기 전' : t > 0.99 ? '접은 모양(겨냥도)' : '접는 중', { color: 'muted', size: 15, weight: 800, align: 'center', baseline: 'middle' });
      }
    }
    // 그림을 눌러 고르기: 가까운 점 → 가까운 모서리 쌍 → 빈 곳(고른 것 지우기)
    armTap(b, C, o.id, (s2, p, touch) => {
      let best = null, bd = touch ? 24 : 16;
      targets.pts.forEach((q) => { const d = Math.hypot(q.s.x - p.x, q.s.y - p.y); if (d < bd) { bd = d; best = { k: q.k }; } });
      if (!best) { bd = touch ? 14 : 9; targets.edges.forEach((q) => { const d = segDist(p, q.a, q.c); if (d < bd) { bd = d; best = { pair: q.pair }; } }); }
      const cur = selOf(net, fi, s2);
      if (!best) { clearSel(s2); return; }
      if (best.k != null) {
        const g = fi.ptGrp[best.k];
        if ((cur.kind === 'v' && g === cur.g) || (cur.kind === 'p' && cur.k === best.k)) clearSel(s2); else selectPoint(net, fi, s2, best.k);
      } else if (cur.kind === 'e' && cur.i === best.pair) clearSel(s2);
      else { s2.phSel = 1 + best.pair; s2.phSelPt = null; }
    });
  }

  // 문제 그림: 접기 전 전개도에 점 이름을 모두 보이고, 묻는 점만 노랑으로 표시합니다.
  function vertexProblemDraw(o, b, s, M, C) {
    const net = landscapeNet(M.qnet), k = M.qk;
    // 큰 화면의 하단 도구막대 위에도 전개도 꼭짓점 이름이 남도록 여백을 둡니다.
    fitNow(b, s, net, C, { t: 56, b: b.W >= 560 ? 64 : 30, l: 40, r: 40 }, camFold, 0);
    const D = scene3(b, camFold(s, 0), C);
    const faces = drawFaces(D, net, 0, () => ({ c: 'green', a: 0.1, ec: 'ink', ew: 1.8 }));
    const cc = cen3(faces.flat());
    if (C.txt) faces.forEach((p) => p.forEach((q, i) => edgeObs(D, b.toS(D.P(q)), b.toS(D.P(p[(i + 1) % p.length])))));
    net.pt.forEach((_, j) => D.dot(ptPos(net, faces, j), j === k ? AMB : 'ink', j === k ? 7.5 : 3.4));
    net.pt.forEach((_, j) => { if (j !== k) D.label(ptPos(net, faces, j), ptName(net, j), { color: 'ink', size: 16, dir: D.out(ptPos(net, faces, j), cc), gap: 9 }); });
    D.label(ptPos(net, faces, k), ptName(net, k), { color: AMB, size: 21, dir: D.out(ptPos(net, faces, k), cc), gap: 10 });
    if (C.txt) banner(b, [{ t: `${o.name}의 전개도`, c: 'ink', size: 16 }], C);
    D.flush();
  }

  function foldSteps(M) {
    const net = M.net, fi = M.fi, k = M.k, nm = (j) => ptName(net, j), nmk = M.letters ? nm(k) : '', q = PLAT[net.kind].q;
    const tx = (a) => a.map((x) => `$\\text{${x}}$`).join(', '), ov2 = (n) => `$\\overline{\\text{${n}}}$`;
    const gk = fi.ptGrp[k], e = pairEdgeAt(fi, k);
    const who = M.letters ? `점 $\\text{${nmk}}$` : '고른 점';
    const s1 = M.letters ? `전개도에서 ${who}${jo(nmk, 'eul')} 골라요. 접으면 이 점과 겹치는 점을 찾아요.` : '전개도에서 점 하나를 골라요(노랑). 접으면 이 점과 겹치는 점을 찾아요.';
    let s2;
    if (!e) s2 = `${who}${M.letters ? jo(nmk, 'eun') : '은'} 접는 선 위에 있어서 붙는 모서리가 없어요. 다른 점과 만나지 않아요.`;
    else if (!M.letters) s2 = '고른 점에서 시작하는 모서리는 접으면 다른 모서리와 붙어서 하나가 돼요. 붙는 두 모서리의 양 끝은 서로 겹쳐요.';
    else {
      const pr = partnerOf(fi, e), a = eName(net, e), c = eName(net, pr.e2), diff = pr.m.filter(([x, y]) => x !== y), same = pr.m.filter(([x, y]) => x === y);
      const eq = diff.map(([x, y]) => `${nm(x)}${jo(nm(x), 'wa')} ${nm(y)}`).join(', '), sh = same.length ? nm(same[0][0]) : '';
      s2 = `점 ${tx([nmk])}에서 시작하는 모서리 ${ov2(a)}${jo(a, 'wa')} ${ov2(c)}${jo(c, 'i')} 접으면 붙어서 한 모서리가 돼요. 붙는 두 모서리의 양 끝이 겹치므로 ${eq}${jo(nm(diff[diff.length - 1][1]), 'i')} ${diff.length > 1 ? '각각 ' : ''}한 점이 돼요.${sh ? ` 점 ${sh}${jo(sh, 'eun')} 두 모서리가 함께 만나는 점이에요.` : ''}`;
    }
    const grp = gk >= 0 ? lettersOf(net, fi.groups[gk].pts) : null;
    const s3 = gk >= 0
      ? (M.letters ? `따라서 접으면 점 ${tx(grp)}${jo(grp[grp.length - 1], 'i')} 한 꼭짓점이 돼요. 한 꼭짓점에는 면이 $${q}$개씩 모이고, 전개도의 점 $${fi.nNetPts}$개가 접으면 꼭짓점 $${fi.nVerts}$개가 돼요.` : `따라서 접으면 겹치는 점 $${fi.groups[gk].pts.length}$개가 한 꼭짓점이 돼요. 한 꼭짓점에는 면이 $${q}$개씩 모이고, 전개도의 점 $${fi.nNetPts}$개가 접으면 꼭짓점 $${fi.nVerts}$개가 돼요.`)
      : `${who}${M.letters ? jo(nmk, 'eun') : '은'} 접어도 다른 점과 만나지 않아요. 전개도의 점 $${fi.nNetPts}$개가 접으면 꼭짓점 $${fi.nVerts}$개가 돼요.`;
    return [s1, s2, s3];
  }
  function foldView(o, M) {
    const net = M.net, fi = M.fi, nm = (j) => ptName(net, j), pl = PLAT[net.kind], sel = M.sel;
    const gk = fi.ptGrp[M.k];
    const eg = fi.pairs.map((es) => es.map((e) => eName(net, e)).join('=')), vg = fi.groups.map((g) => lettersOf(net, g.pts).join('='));
    let r0, r1;
    if (sel.kind === 'none') { r0 = rd('고른 것', '아직 없어요', 'muted'); r1 = rd('겹치는 점', '점을 눌러 보세요', 'muted'); }
    else if (sel.kind === 'e') { const q = fi.pairs[sel.i]; r0 = rd('고른 모서리', M.letters ? `${eName(net, q[0])} = ${eName(net, q[1])}` : '붙는 모서리', AMB); r1 = rd('접으면', '두 모서리가 하나', AMB); }
    else { r0 = rd('고른 점', M.letters ? `점 ${nm(M.k)}` : '선택한 점', AMB); r1 = rd('겹치는 점', M.same.length ? (M.letters ? M.same.map(nm).join(', ') : `${M.same.length}개`) : '없음', AMB); }
    return {
      guide: `<b>접기</b> 막대를 움직이면 접혀서 ${pl.name}${jo(pl.name, 'i')} 돼요. 그림의 <b>점이나 모서리를 누르거나</b> 버튼으로 고르면, 접었을 때 겹치는 점이나 붙는 모서리만 ${span('amber', '노랗게')} 보이고 나머지는 회색이에요.${net.kind === 'cube' || net.kind === 'octa' ? ' 면은 마주 보는(평행한) 면끼리 같은 색이에요.' : ''}`,
      readouts: [r0, r1, rd('전개도의 점 → 꼭짓점', `${fi.nNetPts}개 → ${fi.nVerts}개`, GRN), rd('붙는 모서리', `${fi.nPairs}쌍`, SKY), rd('한 꼭짓점에 모인 면', `${pl.q}개`, SKY)],
      formula: M.letters ? `<p>접으면 한 꼭짓점이 되는 점: ${vg.length ? vg.join(' · ') : '없음'}</p>${fi.nPairs <= 12 ? `<p>접으면 붙는 모서리 ${fi.nPairs}쌍: ${eg.join(' · ')}</p>` : ''}` : `<p>전개도의 점 ${fi.nNetPts}개가 접으면 꼭짓점 ${fi.nVerts}개가 돼요.</p>`,
      rule: '전개도를 접었을 때 같은 꼭짓점이 되는 점끼리 겹치고, 붙는 모서리끼리 하나의 모서리가 된다',
      notes: o.notes
    };
  }

  function vertexScene(o) {
    const specs = o.specs;
    return {
      id: o.id, title: o.title, short: o.short, question: o.question,
      cam0: CAM0, pmin: FOLD_PITCH, ctl: foldCtl, anim: foldAnim, stepT: (n) => (n >= 3 ? 1 : 0),
      presets: (s) => {
        const net = namedNet(netOf(s, specs), s.phNm), fi = foldInfoOf(net), out = netPresets(specs)(s), lt = net.pt.length <= 26;
        const cur = (st) => { const n = namedNet(netOf(st, specs), st.phNm); return { n, f: foldInfoOf(n) }; };
        // 이름 바꾸기: 테두리 위 시작점과 방향(반시계·시계)을 바꿉니다. 겹치는 점·붙는 모서리·정답은 모두 새 이름으로 다시 쓰입니다.
        if (lt) out.push({ group: '점 이름', label: '이름 바꾸기', apply: (st) => { st.phNm = (st.phNm | 0) + 1; }, on: () => false });
        // 단추 순서는 이름 순서(A, B, C …)로: 고르는 번호(i)는 그대로입니다.
        const gOrd = fi.groups.map((g, i) => i).sort((x, y) => { const a = lettersOf(net, fi.groups[x].pts)[0], c = lettersOf(net, fi.groups[y].pts)[0]; return a < c ? -1 : a > c ? 1 : 0; });
        const pOrd = fi.pairs.map((es, i) => i).sort((x, y) => { const a = fi.pairs[x].map((e) => eName(net, e)).sort()[0], c = fi.pairs[y].map((e) => eName(net, e)).sort()[0]; return a < c ? -1 : a > c ? 1 : 0; });
        if (lt) gOrd.forEach((i, r) => { const g = fi.groups[i]; out.push({ group: r === 0 ? '겹치는 점 고르기' : '', label: lettersOf(net, g.pts).join('·'), apply: (st) => { const { f } = cur(st), gi = grpIdx(f, i); if (st.phSel === gi) clearSel(st); else { st.phSel = gi; st.phSelPt = f.groups[i].pts[0]; } }, on: (st) => { const { n, f } = cur(st); return selOf(n, f, st).idx === grpIdx(f, i); } }); });
        if (lt && fi.nPairs <= 8) pOrd.forEach((i, r) => { const es = fi.pairs[i]; out.push({ group: r === 0 ? '붙는 모서리 고르기' : '', label: es.map((e) => eName(net, e)).join('='), apply: (st) => { if (st.phSel === 1 + i) clearSel(st); else { st.phSel = 1 + i; st.phSelPt = null; } }, on: (st) => { const { n, f } = cur(st); return selOf(n, f, st).idx === 1 + i; } }); });
        return out;
      },
      init: (s) => { initNet(s, specs); s.phQ = rollOverlapQ(o.qspecs || specs, o.ptsOk); },
      reroll: (s) => { s.phQ = rollOverlapQ(o.qspecs || specs, o.ptsOk, s.phQ); },
      model: (s) => {
        const net = namedNet(netOf(s, specs), s.phNm), fi = foldInfoOf(net), sel = selOf(net, fi, s); // 이름 배치(phNm)만 다르고 점 번호·접힘은 같음
        let k;
        if (sel.kind === 'v') k = s.phSelPt != null && fi.groups[sel.g].pts.includes(s.phSelPt) ? s.phSelPt : fi.groups[sel.g].pts[0];
        else if (sel.kind === 'p') k = sel.k;
        else if (sel.kind === 'e') k = fi.pairs[sel.i][0].ka;
        else k = o.defPt(net);
        const q = s.phQ, qspecs = o.qspecs || specs, qnet = namedNet(qspecs[clamp(q.ni, 0, qspecs.length - 1)].get(), q.nv), qk = clamp(q.k, 0, qnet.pt.length - 1);
        return { net, fi, sel, k, same: samePts(net, k), Q: q, qnet, qk, qT: samePts(qnet, qk), letters: net.pt.length <= 26 };
      },
      draw(b, s, M, C) { if (C.problem) vertexProblemDraw(o, b, s, M, C); else foldDraw(o, b, s, M, C); },
      steps: (M) => foldSteps(M),
      view: (M) => foldView(o, M),
      prob: (M) => {
        const net = M.qnet, k = M.qk, T = M.qT, nm = ptName(net, k);
        const ch = overlapChoices(net, k, T);
        const order = ch.map((x, i) => ({ x, o: (Math.sin((i + 1) * 12.9898 + k * 78.233 + M.Q.ni * 3.1) * 43758.5453) % 1 })).sort((a, c) => a.o - c.o).map((q) => q.x);
        return { tag: o.tag, key: `${M.Q.ni}|${k}|${nameIdxOf(net, M.Q.nv)}`, stem: `다음 전개도를 접어 ${o.name}${jo(o.name, 'eul')} 만들 때, 점 ${nm}${jo(nm, 'wa')} 겹치는 점을 모두 고르면?`, choices: mkText(order.map((x) => ({ h: x.h, ok: x.ok, hint: x.hint }))) };
      }
    };
  }
  const A2 = vertexScene({
    id: 'p3-2', title: '[함정] 정육면체 전개도에서 겹치는 꼭짓점', short: '[함정] 겹치는 꼭짓점', kind: 'cube', name: '정육면체', specs: CUBE_P2, tag: '전개도에서 겹치는 점 (함정)',
    question: '정육면체의 전개도를 접으면 전개도 위의 서로 다른 점이 한 꼭짓점으로 모여요. 점 하나를 골라 어떤 점과 겹치는지 찾아보자.',
    defPt: firstPartnerPt,
    notes: notes('정육면체의 꼭짓점은 8개인데 전개도의 점은 14개예요. 한 꼭짓점에 전개도의 점이 1~3개씩 모여요.', '같은 면에 있거나 이웃한 점이 한 점으로 모이는 것은 아니에요. 접어서 확인해야 해요.')
  });
  const TETRA2 = TETRA_PICK.map((_, i) => polySpec('tetra', i, `전개도 ${'㉮㉯㉰'[i]}`));
  const A5 = vertexScene({
    id: 'p3-5', title: '정사면체의 전개도', short: '정사면체 전개도', kind: 'tetra', name: '정사면체', specs: TETRA2, tag: '정사면체의 전개도',
    question: '정삼각형 4개를 이어 붙인 정사면체의 전개도예요. 접으면 어느 점들이 한 꼭짓점으로 모일까?',
    defPt: firstPartnerPt,
    notes: notes('정사면체의 꼭짓점은 4개인데 전개도의 점은 6개예요.', '같은 꼭짓점이 되는 점은 항상 3개의 면의 꼭짓점이에요. 한 꼭짓점에 모인 면은 3개예요.'),
    ptsOk: (net, j) => samePts(net, j).length >= 1
  });
  const OCTA_SPECS = OCTA_PICK.map((_, i) => polySpec('octa', i, `정팔면체 ${'㉮㉯㉰'[i]}`)); // 선생님이 고른 정팔면체 전개도(geo.js OCTA_PICK, 첫 번째가 기본)
  const POLYSPECS = OCTA_SPECS.concat([polySpec('dodeca', 0, '정십이면체'), polySpec('icosa', 0, '정이십면체')]);
  const A6 = (() => {
    const base = vertexScene({
      id: 'p3-6', title: '정팔면체·정십이면체·정이십면체의 전개도', short: '정팔·정12·정20면체 전개도', kind: 'octa', name: '정팔면체', specs: POLYSPECS, qspecs: OCTA_SPECS, tag: '정팔면체의 전개도',
      question: '정삼각형 8개로 만든 정팔면체의 전개도예요. 정십이면체와 정이십면체의 전개도도 접어 보자. 접으면 어느 점들이 한 꼭짓점이 될까?',
      defPt: firstPartnerPt,
      notes: notes('정팔면체의 꼭짓점은 6개인데 전개도의 점은 10개예요.', '한 꼭짓점에는 정팔면체는 정삼각형이 4개씩, 정십이면체는 정오각형이 3개씩, 정이십면체는 정삼각형이 5개씩 모여요.', '정십이면체는 점이 많아서 이름 대신 고른 점과 겹치는 점만 노랗게 보여 줘요.')
    });
    return base;
  })();

  /* ------------------------------------------------------------------ 마주 보는 면 · 면 장면 공통 (p3-3 평행한 면 · p3-8 주사위)
     면 이름은 전개도에서 위→아래, 왼쪽→오른쪽 순서로 A~F. 처음에는 이름만 회색으로 두고, 면을 고르면 그 면과 마주 보는 면만 같은 강조색(노랑)으로 보입니다.
     접은 모양은 불투명하게 그려 뒤쪽 면의 글자가 앞면에 비치지 않게 하고, 가려진 고른 면은 점선 테두리로 보여 줍니다. */
  const DIRS4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const fLet = (net, i) => FL[net.num[i] - 1];
  // 마주 보는 두 면(f, o)을 찾는 발상: 한 줄로 이어진 세 칸의 양 끝 · ㄹ자로 이어진 네 칸의 양 끝 · (나머지 쌍이 정해지고) 남은 두 면.
  // 11가지 전개도 모두에서 이 규칙이 틀리지 않음을 코드로 확인했습니다(접은 입체의 3차원 위치와 대조).
  function oppWhy(net, f, o) {
    const cells = net.faces.map((q) => q.cell), idx = (c) => cells.findIndex((q) => q[0] === c[0] && q[1] === c[1]), L = (i) => fLet(net, i);
    for (const d of DIRS4) {
      const c = cells[f], m = idx([c[0] + d[0], c[1] + d[1]]);
      if (m >= 0 && idx([c[0] + 2 * d[0], c[1] + 2 * d[1]]) === o) return `면 ${L(f)}, ${L(m)}, ${L(o)}${jo(L(o), 'i')} 한 줄로 이어져 있어요. 한 줄로 이어진 세 칸의 양 끝은 마주 봐요.`;
    }
    for (const d of DIRS4) for (const e of DIRS4) {
      if (d[0] * e[0] + d[1] * e[1] !== 0) continue;
      const c = cells[f], m = idx([c[0] + d[0], c[1] + d[1]]), n = m < 0 ? -1 : idx([cells[m][0] + e[0], cells[m][1] + e[1]]);
      if (n >= 0 && idx([cells[n][0] + d[0], cells[n][1] + d[1]]) === o) return `면 ${L(f)}, ${L(m)}, ${L(n)}, ${L(o)}${jo(L(o), 'i')} ㄹ자로 이어져 있어요. ㄹ자로 이어진 네 칸의 양 끝은 마주 봐요.`;
    }
    return '다른 두 쌍을 찾고 나면 남은 두 면이 마지막 한 쌍이에요.';
  }
  // 가려진 고른 면: 눈(점)은 그리지 않고, 점선 테두리만 그린 뒤 이름·숫자 배지를 입체 바깥쪽 모서리 끝에 붙입니다(보이는 면의 글자·눈과 섞이지 않게).
  function ghostFace(D, p, faces, hi, txt) {
    D.panel(p, hi, 0, hi, 3, { dash: [7, 5], alpha: 0.9 });
    const R = [[0, 0], [28, 0], [-28, 0], [0, 28], [0, -28], [28, 28], [-28, -28], [28, -28], [-28, 28], [48, 0], [-48, 0], [0, 48], [0, -48]];
    D.label(cen3(p), txt, { color: hi, size: 20, badge: true, at: R });
  }
  const IDEA = '한 줄로 이어진 세 칸의 양 끝은 마주 봐요. ㄹ자로 이어진 네 칸의 양 끝도 마주 봐요(ㄷ자는 아니에요). 그래도 남은 두 면이 마지막 한 쌍이에요.';
  const inPoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], q = poly[j]; if ((a.y > p.y) !== (q.y > p.y) && p.x < ((q.x - a.x) * (p.y - a.y)) / (q.y - a.y) + a.x) c = !c; } return c; };
  // 단계에 따라 보일 면: 같은 강조색 한 쌍(a) · 수직인 네 면(p)
  function faceRoles(C, st, f, opp, n) {
    const role = new Array(n).fill(0);
    if (f == null || f < 0) return role;
    role[f] = 'a';
    if (C.review) { if (st === 2 && opp >= 0) role[opp] = 'a'; else if (st >= 3) role.forEach((_, i) => { if (i !== f && i !== opp) role[i] = 'p'; }); } else if (opp >= 0) role[opp] = 'a';
    return role;
  }
  const ROLE = { a: { c: AMB, a: 0.42, ec: AMB, ew: 3.2 }, p: { c: SKY, a: 0.26, ec: SKY, ew: 2.4 } };
  // 면 하나 고르기(탐구): 눌린 면이 같은 면이면 고름을 지웁니다.
  function armFaceTap(b, C, id, D, faces, vis) {
    const polys = faces.map((p) => p.map((q) => b.toS(D.P(q)))), dep = faces.map((p) => D.depth(cen3(p)));
    armTap(b, C, id, (s2, p) => {
      const hit = faces.map((_, i) => i).filter((i) => vis[i] && inPoly(p, polys[i])).sort((a, c) => dep[a] - dep[c])[0];
      if (hit == null || s2.phSelFace === hit) s2.phSelFace = null; else s2.phSelFace = hit;
    });
  }

  /* ------------------------------------------------------------------ p3-3 평행한 면과 수직인 면 */
  function rollQ33() { return { ni: rint(0, CUBE5.length - 1), f: rint(0, 5) }; }
  const A3 = {
    id: 'p3-3', title: '정육면체 전개도에서 평행한 면', short: '평행한 면',
    question: '정육면체의 전개도를 접으면 서로 마주 보는 면은 평행해요. 면 하나를 골라 평행한 면과 수직인 면을 찾아보자.',
    cam0: CAM0, pmin: FOLD_PITCH, ctl: foldCtl, anim: foldAnim, stepT: (n) => (n >= 2 ? 1 : 0),
    presets: (s) => netPresets(CUBE5)(s).concat(FL.split('').map((ch, L) => ({ group: L === 0 ? '면 고르기' : '', label: `면 ${ch}`, apply: (st) => { const fi = netOf(st, CUBE5).num.indexOf(L + 1); st.phSelFace = st.phSelFace === fi ? null : fi; }, on: (st) => st.phSelFace != null && netOf(st, CUBE5).num[st.phSelFace] === L + 1 }))),
    init: (s) => { initNet(s, CUBE5); s.phQ = rollQ33(); },
    reroll: (s) => { s.phQ = rollQ33(); },
    model: (s) => {
      const net = netOf(s, CUBE5), f = s.phSelFace != null && s.phSelFace >= 0 && s.phSelFace < 6 ? s.phSelFace : null, fR = f == null ? 0 : f, q = s.phQ, qn = CUBE5[clamp(q.ni, 0, CUBE5.length - 1)].get();
      return { net, f, fR, opp: net.opposite[fR], Q: q, qn, qf: q.f, qopp: qn.opposite[q.f] };
    },
    draw(b, s, M, C) {
      const st = stepOf(C), t = C.problem ? 0 : C.review ? C.t : (C.thumb ? 0.6 : s.phFold);
      const net = C.problem ? landscapeNet(M.qn) : M.net, f = C.problem ? M.qf : C.review ? M.fR : M.f, opp = f == null ? -1 : net.opposite[f];
      fitNow(b, s, net, C, C.problem ? { t: 52, b: 26 } : { t: C.thumb ? 5 : 64, b: 18 }, camFoldK('cube'), t);
      const D = scene3(b, camFoldK('cube')(s, t), C);
      const role = faceRoles(C, st, f, C.problem ? -1 : opp, 6), any = role.some((r) => r);
      const pc = C.problem ? [] : pairColors(net); // 마주 보는(평행한) 면 쌍은 같은 색(문제 탭은 정답이 드러나 칠하지 않음). 고른 면과 짝의 노랑 강조는 그 위에 그대로
      const { faces, vis } = drawFacesOp(D, net, t, (i) => ROLE[role[i]] || (pc[i] ? { c: pc[i], a: PAIR_ALPHA } : { c: 'green', a: 0.08 }), any ? 0.72 : 1);
      const fin = t >= 0.97;
      const ghosts = [];
      faces.forEach((p, i) => {
        if (fin && !vis[i] && !role[i]) return;
        const hi = role[i] === 'a' ? AMB : role[i] === 'p' ? SKY : null;
        if (fin && !vis[i]) { ghosts.push([p, hi, fLet(net, i)]); return; }
        faceTxt(D, C, cen3(p), fLet(net, i), { color: hi || 'ink', alpha: hi || C.problem ? 1 : 0.78, size: 28, at: [[0, 0], [0, -17], [0, 17], [-17, 0], [17, 0]] });
      });
      ghosts.forEach(([p, hi, tx]) => { if (C.txt) ghostFace(D, p, faces, hi, tx); else D.panel(p, hi, 0, hi, 3, { dash: [7, 5], alpha: 0.9 }); }); // 가려진 고른 면은 맨 나중에(앞면 글자를 피해서)
      if (C.txt && !C.thumb) {
        if (C.problem) banner(b, [{ t: '정육면체의 전개도', c: 'ink', size: 16 }], C);
        else {
          const L = [{ t: `정육면체의 전개도 (${net.label})`, c: 'ink', size: 15 }];
          if (f == null) L.push({ t: '면을 눌러 보세요', c: 'muted', size: 15 });
          else if (C.review && st <= 1) L.push({ t: `면 ${fLet(net, f)}${jo(fLet(net, f), 'eul')} 골랐어요`, c: AMB, size: 15 });
          else if (C.review && st >= 3) L.push({ t: `나머지 네 면은 면 ${fLet(net, f)}${jo(fLet(net, f), 'wa')} 수직이에요`, c: SKY, size: 15 });
          else L.push({ t: `면 ${fLet(net, f)}${jo(fLet(net, f), 'wa')} 마주 보는 면 ${fLet(net, opp)}는 평행해요`, c: AMB, size: 15 });
          banner(b, L, C);
        }
      }
      D.flush();
      if (C.tab === 'explore') armFaceTap(b, C, 'p3-3', D, faces, vis);
    },
    steps: (M) => {
      const a = fLet(M.net, M.fR), c = fLet(M.net, M.opp), restL = [0, 1, 2, 3, 4, 5].filter((i) => i !== M.fR && i !== M.opp).map((i) => fLet(M.net, i)).sort(), rest = restL.map((x) => `$\\text{${x}}$`).join(', ');
      return [
        `전개도에서 면 $\\text{${a}}$${jo(a, 'eul')} 골라요.`,
        `전개도를 접으면 면 $\\text{${a}}$${jo(a, 'wa')} 마주 보는 면은 $\\text{${c}}$예요. ${oppWhy(M.net, M.fR, M.opp)} 마주 보는 두 면은 서로 $\\text{평행}$해요.`,
        `나머지 네 면 ${rest}${jo(restL[3], 'eun')} 면 $\\text{${a}}$${jo(a, 'wa')} $\\text{수직}$으로 만나요.`
      ];
    },
    view: (M) => {
      const a = fLet(M.net, M.fR), c = fLet(M.net, M.opp), none = M.f == null;
      return {
        guide: `그림의 <b>면을 누르거나</b> 버튼으로 고른 뒤 <b>접기</b> 막대로 접어 보세요. 고른 면과 마주 보는 면이 ${span('amber', '같은 노랑')}으로 보이고, 이 두 면은 평행해요. 나머지 4개 면은 수직이에요. 면을 고르기 전에도 마주 보는 면끼리는 같은 연한 색이에요.`,
        readouts: [rd('고른 면', none ? '아직 없어요' : a, none ? 'muted' : AMB), rd('평행한 면', none ? '면을 눌러 보세요' : c, none ? 'muted' : AMB), rd('수직인 면', '4개', GRN)],
        formula: `<p>면 ${a} ∥ 면 ${c}</p><p>마주 보는 면 찾는 법: ${IDEA}</p>`,
        rule: '정육면체에서 마주 보는 두 면은 평행하고, 이웃한 면은 수직이다',
        notes: notes(IDEA, '전개도에서 이웃해 보여도 접으면 마주 보는 면이 될 수 있어요. 접어서 확인하세요.')
      };
    },
    prob: (M) => {
      const net = M.qn, f = M.qf, opp = M.qopp, nf = fLet(net, f);
      const others = [0, 1, 2, 3, 4, 5].filter((i) => i !== f);
      const items = others.map((i) => ({ i, ok: i === opp })).sort((a, c) => net.num[a.i] - net.num[c.i]);
      const pickN = shuf(items.filter((x) => !x.ok)).slice(0, 4).concat(items.filter((x) => x.ok)).sort((a, c) => net.num[a.i] - net.num[c.i]);
      return { tag: '평행한 면', key: `${M.Q.ni}|${f}`, stem: `그림은 정육면체의 전개도이다. 이 전개도를 접을 때, 면 ${nf}${jo(nf, 'wa')} 평행한 면은?`, choices: mkText(pickN.map((x) => ({ h: `면 ${fLet(net, x.i)}`, ok: x.ok, hint: '접으면 이 면은 면 ' + nf + jo(nf, 'wa') + ' 이웃해서 수직이에요. 마주 보는 면을 찾아 보세요.' }))) };
    }
  };

  /* ------------------------------------------------------------------ p3-4 꼬인 위치의 모서리 (정육면체 · 정사면체 · 정팔면체)
     입체는 칩으로 고르고, 전개도를 접은 입체의 3차원 모델(net.sol)로 기준 모서리와의 관계(만남·평행·꼬인 위치)를 셉니다.
     색: 만나는 것 빨강 · 평행한 것 파랑 · 꼬인 위치 초록 · 기준 모서리 노랑. 한 단계에 한 종류만 칠하고 앞 단계는 회색으로 둡니다. 번호 대신 양 끝 점 이름으로 부릅니다. */
  const OCTA2 = POLYSPECS.slice(0, 2);
  const SOLIDS = [{ name: '정육면체', specs: CUBE5 }, { name: '정사면체', specs: TETRA2 }, { name: '정팔면체', specs: OCTA2 }];
  const solidOf = (s) => SOLIDS[clamp(s.phSolid | 0, 0, 2)];
  const edgeNm = (net, fi, vi) => net.edgeKey(fi, vi);
  function skewModel(s) {
    const sd = solidOf(s), net = netOf(s, sd.specs), sol = net.sol;
    const ref = sol.edges.find((e) => e.key === s.phSelEdge) || sol.edges[0], c = classify(sol, ref);
    return { sd, net, sol, ref, c };
  }
  const skewNames = (c) => c.g.skew.map((e) => e.name).sort();
  function rollQ34(solid, prev) { const sd = SOLIDS[solid], q = { solid, ni: rint(0, sd.specs.length - 1), seed: rint(0, 99) }; if (prev && prev.solid === solid && prev.seed === q.seed) q.seed = (q.seed + 1) % 100; return q; }
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
    void sol;
    return { tag: '전개도에서 꼬인 위치', key: key + ref.key, stem: `그림은 ${name}의 전개도이다. 이 전개도를 접어 만든 입체에서 모서리 $${ov(ref.name)}$${jo(ref.name, 'wa')} 꼬인 위치에 있는 모서리는? (같은 문자는 접으면 한 점으로 모인다.)`, choices: mkText(order.map((e) => ({ h: `$${ov(e.name)}$`, p: e.name, ok: e.rel === 'skew', hint: hint(e) }))) };
  }
  /* 접은 정사면체·정팔면체를 교과서 그림처럼 세워 보이게 하는 회전(모양은 그대로, 보는 방향만 맞춥니다).
     정사면체: 밑면이 아래, 꼭대기가 위. 정팔면체: 위·아래 꼭짓점이 세로. 그런 다음 세로축 둘레로 돌려, 기본 시점(pitch 20°·yaw -28°)에서
     꼭짓점들이 서로 떨어지고 한 꼭짓점이 다른 모서리 위에 겹치지 않으며, 정사면체는 마주 보는 모서리(꼬인 위치)가 화면에서도 교차하지 않는 방위를 찾습니다. */
  function uprightOf(net, isOcta) {
    if (net._upr) return net._upr;
    const V = Object.values(net.sol.verts), ctr = net.sol.ctr, Z = v3(0, 0, 1);
    let a = Z;
    if (isOcta) { let bd = -1; for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) { const d = len3(sub3(V[j], V[i])); if (d > bd) { bd = d; a = unit3(sub3(V[j], V[i])); } } if (a.z < 0) a = mul3(a, -1); }
    else { const top = V.reduce((m, v) => (v.z > m.z ? v : m), V[0]); a = unit3(sub3(top, cen3(V.filter((v) => v !== top)))); }
    const cr = cross3(a, Z), sn = len3(cr), ang = Math.atan2(sn, dot3(a, Z)), k = sn < 1e-9 ? Z : mul3(cr, 1 / sn);
    const cam = camOf({ phYaw: -28, phPitch: 20 }), edges = net.sol.edges, names = Object.keys(net.sol.verts);
    const segD = (p0, a0, c0) => { const dx = c0.x - a0.x, dy = c0.y - a0.y, l2 = dx * dx + dy * dy || 1, t = clamp(((p0.x - a0.x) * dx + (p0.y - a0.y) * dy) / l2, 0, 1); return Math.hypot(p0.x - a0.x - dx * t, p0.y - a0.y - dy * t); };
    const side = (a0, b0, c0) => Math.sign((b0.x - a0.x) * (c0.y - a0.y) - (b0.y - a0.y) * (c0.x - a0.x));
    let best = 0, bs = -1e9;
    for (let f = 0; f < 360; f += 3) {
      const Q = {}; names.forEach((n) => { const q = proj(cam, rotAxis(rotAxis(net.sol.verts[n], ctr, k, ang), ctr, Z, f * DEG)); Q[n] = { x: q.x, y: q.y }; });
      let minSep = 1e9, minTri = 1e9, cross = 0, hid = 0;
      for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) {
        minSep = Math.min(minSep, Math.hypot(Q[names[i]].x - Q[names[j]].x, Q[names[i]].y - Q[names[j]].y));
        for (let m = 0; m < names.length; m++) if (m !== i && m !== j) minTri = Math.min(minTri, segD(Q[names[m]], Q[names[i]], Q[names[j]]));
      }
      if (!isOcta) {
        // 정사면체: 보이는 면(앞쪽 법선) 판정 → 가려진 모서리 수(교과서 그림은 1개)와, 보이는 모서리끼리의 교차 수
        const P3 = {}; names.forEach((n) => { P3[n] = rotAxis(rotAxis(net.sol.verts[n], ctr, k, ang), ctr, Z, f * DEG); });
        const faceVis = {};
        for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) for (let m = j + 1; m < names.length; m++) {
          let n = cross3(sub3(P3[names[j]], P3[names[i]]), sub3(P3[names[m]], P3[names[i]]));
          if (dot3(n, sub3(cen3([P3[names[i]], P3[names[j]], P3[names[m]]]), ctr)) < 0) n = mul3(n, -1);
          faceVis[[names[i], names[j], names[m]].join('')] = facing(cam, n);
        }
        const hidden = (e) => !Object.keys(faceVis).some((key) => faceVis[key] && key.includes(e.u) && key.includes(e.v));
        edges.forEach((e1, i) => { if (hidden(e1)) hid++; edges.forEach((e2, j) => { if (j <= i || e1.u === e2.u || e1.u === e2.v || e1.v === e2.u || e1.v === e2.v || hidden(e1) || hidden(e2)) return; const A1 = Q[e1.u], B1 = Q[e1.v], A2 = Q[e2.u], B2 = Q[e2.v]; if (side(A1, B1, A2) * side(A1, B1, B2) < 0 && side(A2, B2, A1) * side(A2, B2, B1) < 0) cross++; }); });
      }
      const sc = (isOcta ? 0 : (hid === 1 ? 200 : 0) - 100 * cross) + minSep + minTri;
      if (sc > bs) { bs = sc; best = f; }
    }
    const phi = best * DEG;
    return (net._upr = { rot: (p, t) => rotAxis(rotAxis(p, ctr, k, ang * t), ctr, Z, phi * t) });
  }
  const A4 = {
    id: 'p3-4', title: '정다면체에서 꼬인 위치의 모서리', short: '꼬인 위치',
    question: '정육면체·정사면체·정팔면체에서 모서리 하나를 정하면 꼬인 위치에 있는 모서리는 몇 개일까? 접은 입체에서 모서리를 하나씩 분류해 보자.',
    cam0: { yaw: -4, pitch: 66 }, pmin: 16, ctl: foldCtl, anim: { key: 'phFold', dur: 5, label: '접어 보기', start: 1 }, stepT: (n) => (n >= 1 ? 1 : 0),
    presets: (s) => {
      const sd = solidOf(s), out = SOLIDS.map((q, i) => ({ group: i === 0 ? '입체 고르기' : '', label: q.name, apply: (st) => { st.phSolid = i; st.phNet = 0; st.phFold = 1; st.phSelEdge = null; st.phQ = rollQ34(i); }, on: (st) => (st.phSolid | 0) === i }));
      return out.concat(sd.specs.map((sp, i) => ({ group: i === 0 ? '전개도 모양' : '', label: sp.label, apply: (st) => { st.phNet = i; st.phFold = 1; st.phSelEdge = null; }, on: (st) => (st.phNet | 0) === i })));
    },
    init: (s) => { initNet(s, CUBE5); s.phSolid = 0; s.phFold = 1; s.phQ = rollQ34(0); },
    reroll: (s) => { s.phQ = rollQ34(s.phSolid | 0, s.phQ); s.phSelEdge = null; },
    model: (s) => {
      const M = skewModel(s), q = s.phQ, qsd = SOLIDS[clamp(q.solid | 0, 0, 2)], qn = qsd.specs[clamp(q.ni, 0, qsd.specs.length - 1)].get(), keys = qn.sol.edges.map((e) => e.key), ref = qn.sol.edges.find((e) => e.key === keys[(q.seed * 7) % keys.length]), c = classify(qn.sol, ref);
      return Object.assign(M, { Q: q, qsd, qn, qM: { net: qn, sol: qn.sol, ref, c } });
    },
    draw(b, s, M, C) {
      const st = C.problem ? 0 : C.review ? C.step + 0 : 4, t = C.problem ? 0 : C.review ? C.t : (C.thumb ? 0.6 : s.phFold);
      const MM = C.problem ? M.qM : M, net0 = C.problem ? landscapeNet(MM.net) : MM.net, ref = MM.ref, c = MM.c, sdName = C.problem ? M.qsd.name : M.sd.name;
      const sdi = SOLIDS.indexOf(C.problem ? M.qsd : M.sd), upr = sdi > 0 && !C.problem ? uprightOf(net0, sdi === 2) : null;
      const net = upr ? Object.assign({}, net0, { at: (tt) => net0.at(tt).map((f) => f.map((q) => upr.rot(q, tt))) }) : net0;
      classify(MM.sol, ref);
      // 정사면체·정팔면체는 세워서(uprightOf) 낮은 시점(pitch 약 20°)에서 비스듬히(yaw 약 -28°) 봅니다. 정육면체 시점은 그대로.
      const camA4 = (s0, t0) => (C.problem ? Object.assign({}, s0, { phYaw: 0, phPitch: 84 }) : sdi === 1 ? camFold(s0, t0, 46, -24) : sdi === 2 ? camFold(s0, t0, 48, -24) : camFold(s0, t0, Math.max(0, (s0.phPitch == null ? 66 : s0.phPitch) - FOLD_PITCH), FOLD_YAW.cube + 4));
      fitNet(b, s, net, C, C.problem ? { t: 56, b: 26, l: 30, r: 30 } : { t: C.thumb ? 5 : 70, b: 20 }, camA4, C.problem ? 0 : t);
      const D = scene3(b, camA4(s, t), C);
      const fin = t >= 0.97;
      const faces = drawFaces(D, net, t, () => ({ c: 'green', a: 0.07, ec: 'ink', ew: 0 }));
      const byKey = {}; MM.sol.edges.forEach((e) => { byKey[e.key] = e; });
      // 다 접었을 때 앞쪽에 보이는 모서리(보이는 면에 닿은 모서리). 가려진 모서리는 점선으로 그립니다.
      const visKey = new Set();
      if (fin) faces.forEach((pts, fi) => { const f0 = net.faces[fi].poly, sg = Math.sign(cross3(sub3(f0[1], f0[0]), sub3(f0[2], f0[0])).z) || 1; if (facing(D.cam, mul3(cross3(sub3(pts[1], pts[0]), sub3(pts[2], pts[0])), -sg))) pts.forEach((_, vi) => visKey.add(edgeNm(net, fi, vi))); });
      const GRY = { color: 'muted', width: 1.8, alpha: 0.55 };
      // 한 단계에 한 종류만 칠하고 앞 단계는 회색으로 둡니다(탐구는 세 종류 모두).
      const sty = (e) => {
        const r = e.rel;
        if (r === 'ref') return { color: AMB, width: 6.4, glow: true };
        if (C.problem || st === 0) return { color: 'ink', width: 3 };
        if (r === 'meet' || r === 'ext') return st === 4 || st === 1 ? { color: RED, width: st === 1 ? 5 : 4 } : GRY;
        if (r === 'par') return st === 4 || st === 2 ? { color: SKY, width: st === 2 ? 5 : 4 } : st > 2 ? GRY : { color: 'ink', width: 3 };
        if (r === 'skew') return st === 4 || st === 3 ? { color: GRN, width: 5.6, glow: st === 3 } : { color: 'ink', width: 3 };
        return { color: 'ink', width: 3 };
      };
      // 모서리: 가려진 것(점선) → 앞쪽 모서리 아래 바탕색 띠(정사면체·정팔면체: 점선이 앞 모서리에 끊겨 보여 '만나지 않음'이 드러남) → 앞쪽 모서리
      const drawE = (pass) => faces.forEach((pts, fi) => pts.forEach((p, vi) => {
        const q = pts[(vi + 1) % pts.length], key = edgeNm(net, fi, vi), e = byKey[key], s0 = sty(e), hid = fin && !visKey.has(key) && e.rel !== 'ref';
        if (pass === 'hid' ? !hid : hid) return;
        if (pass === 'gap') { D.line(p, q, 'stage', s0.width + 6, { alpha: 0.95 }); return; }
        D.line(p, q, s0.color, hid ? (sdi > 0 ? Math.max(2.4, s0.width * 0.75) : Math.max(1.8, s0.width * 0.7)) : s0.width, { alpha: (s0.alpha == null ? 1 : s0.alpha) * (hid ? (sdi > 0 ? 0.9 : 0.8) : 1), glow: s0.glow && !hid, dash: hid ? (sdi > 0 ? [7, 6] : [6, 5]) : undefined });
        if (C.txt && pass !== 'hid') edgeObs(D, b.toS(D.P(p)), b.toS(D.P(q)));
      }));
      drawE('hid'); if (sdi > 0) drawE('gap'); drawE('vis');
      if (C.txt) faces.forEach((pts, fi) => pts.forEach((p, vi) => { if (!(fin && !visKey.has(edgeNm(net, fi, vi)))) return; edgeObs(D, b.toS(D.P(p)), b.toS(D.P(pts[(vi + 1) % pts.length]))); }));
      const seen = [], cc = cen3(faces.flat());
      faces.forEach((pts, fi) => pts.forEach((p, vi) => {
        const nmv = net.cname[net.clOf[fi][vi]], sp = D.P(p), sc = b.toS(sp), isR = nmv === ref.u || nmv === ref.v;
        b.point(sp, { color: isR ? AMB : 'ink', r: 4 });
        if (seen.some((q) => q.n === nmv && Math.hypot(q.x - sc.x, q.y - sc.y) < 9)) return;
        seen.push({ n: nmv, x: sc.x, y: sc.y });
        if (C.txt) D.label(p, nmv, { color: isR ? AMB : 'ink', size: 17, dir: D.out(p, cc), gap: 9 });
      }));
      if (C.txt) {
        const cap = C.review ? (st === 1 ? `만나는 모서리 ${c.nMeet + c.nExt}개 지우기 (빨강)` : st === 2 ? (c.nPar ? `평행한 모서리 ${c.nPar}개 지우기 (파랑)` : '평행한 모서리는 0개예요') : st === 3 ? `남은 ${c.nSkew}개 = 꼬인 위치 (초록)` : '') : '';
        if (cap) b.stext(b.W / 2 - b.insets.right / 2, b.insets.top + 20, cap, { color: st === 1 ? 'red' : st === 2 ? 'sky' : 'green', size: 17, weight: 800, align: 'center', baseline: 'middle' });
        else if (C.problem) banner(b, [{ t: `${sdName}의 전개도 · 기준 모서리 ${ref.name}`, c: 'ink', size: 15 }], C);
        else banner(b, [{ t: `${sdName} · 기준 모서리 ${ref.name}`, c: AMB, size: 16 }], C);
      }
      D.flush();
      if (C.tab === 'explore' && !C.thumb) {
        const cands = []; faces.forEach((pts, fi) => pts.forEach((p, vi) => cands.push({ key: edgeNm(net, fi, vi), p: D.P(mid3(p, pts[(vi + 1) % pts.length])) })));
        const ce = cands.find((q) => q.key === ref.key) || cands[0];
        // 손잡이는 기준 모서리의 가운데에 두되, 가운데가 다른 모서리와 화면에서 교차하는 자리(정사면체의 마주 보는 모서리 등)면 교차점을 피해 옮깁니다.
        let hp = ce.p;
        {
          const refSeg = []; faces.forEach((pts, fi) => pts.forEach((p, vi) => { if (edgeNm(net, fi, vi) === ref.key && !refSeg.length) refSeg.push(D.P(p), D.P(pts[(vi + 1) % pts.length])); }));
          const others = []; faces.forEach((pts, fi) => pts.forEach((p, vi) => { if (edgeNm(net, fi, vi) !== ref.key) others.push([b.toS(D.P(p)), b.toS(D.P(pts[(vi + 1) % pts.length]))]); }));
          if (refSeg.length) {
            const at = (f) => ({ x: refSeg[0].x + (refSeg[1].x - refSeg[0].x) * f, y: refSeg[0].y + (refSeg[1].y - refSeg[0].y) * f });
            const clear = (f) => { const sp = b.toS(at(f)); let m = 1e9; others.forEach((q) => { const e0 = Math.min(Math.hypot(q[0].x - sp.x, q[0].y - sp.y), Math.hypot(q[1].x - sp.x, q[1].y - sp.y)); if (e0 > 6) m = Math.min(m, segDist(sp, q[0], q[1])); }); return m; };
            let bestF = 0.5, bestC = clear(0.5);
            if (bestC < 14) [0.3, 0.7, 0.22, 0.78].forEach((f) => { const cl = clear(f); if (cl > bestC) { bestC = cl; bestF = f; } });
            hp = at(bestF);
          }
        }
        b.handle('ref', hp, { color: 'amber', r: 9, ariaLabel: '기준 모서리 고르기', drag: (w) => { let best = cands[0], bd = 1e18; cands.forEach((q) => { const d = (q.p.x - w.x) ** 2 + (q.p.y - w.y) ** 2; if (d < bd) { bd = d; best = q; } }); s.phSelEdge = best.key; } });
        // 모서리를 눌러도 기준 모서리가 바뀝니다(가까운 모서리 가운데).
        const segs = []; faces.forEach((pts, fi) => pts.forEach((p, vi) => { if (fin && !visKey.has(edgeNm(net, fi, vi))) return; segs.push({ key: edgeNm(net, fi, vi), a: b.toS(D.P(p)), c: b.toS(D.P(pts[(vi + 1) % pts.length])) }); }));
        armTap(b, C, 'p3-4', (s2, pt, touch) => { let best = null, bd = touch ? 16 : 10; segs.forEach((q) => { const d = segDist(pt, q.a, q.c); if (d < bd) { bd = d; best = q; } }); if (best) s2.phSelEdge = best.key; });
      }
    },
    steps: (M) => {
      const { ref, c, sd } = M, r = ov(ref.name), sk = skewNames(c).map((n) => `$${ov(n)}$`).join(', ');
      return [
        `전개도를 접어 ${sd.name}${jo(sd.name, 'eul')} 만들어요. 같은 문자의 꼭짓점이 한 점으로 모여요. 기준 모서리 $${r}$${jo(ref.name, 'wa')} 만나는 모서리 $${c.nMeet + c.nExt}$개를 지워요.`,
        c.nPar ? `$${r}$${jo(ref.name, 'wa')} 평행한 모서리 $${c.nPar}$개도 지워요.` : `$${r}$${jo(ref.name, 'wa')} 평행한 모서리는 $0$개예요. ${sd.name}에는 평행한 모서리가 없어서 지울 것이 없어요.`,
        `남은 모서리 $${c.total}-1-${c.nMeet + c.nExt}-${c.nPar}=${c.nSkew}$개가 꼬인 위치예요. ${sk}${jo(c.g.skew.length ? skewNames(c).slice(-1)[0] : '', 'i')} 꼬인 위치에 있어요.`
      ];
    },
    view: (M) => {
      const { ref, c, sd } = M, none = c.nPar === 0;
      return {
        guide: `버튼으로 입체와 전개도를 고르세요. <b>노란 손잡이</b>를 끌거나 모서리를 눌러 기준 모서리를 바꾸면, 나머지 모서리는 ${span('red', '만나거나')}, ${span('sky', '평행하거나')}, ${span('green', '꼬인 위치')}예요. 같은 문자는 접으면 한 점으로 모이는 꼭짓점이에요. 막대로 펼쳐 보세요.`,
        readouts: [rd('기준 모서리', ref.name, AMB), rd('만나는 모서리', `${c.nMeet + c.nExt}개`, RED), rd('평행한 모서리', none ? '없음 (0개)' : `${c.nPar}개`, SKY), rd('꼬인 위치', `${c.nSkew}개`, GRN, `${c.total} − 1 − ${c.nMeet + c.nExt} − ${c.nPar}`)],
        formula: `<p>(꼬인 위치의 개수) $=${c.total}-1-${c.nMeet + c.nExt}-${c.nPar}=${c.nSkew}$ (개)</p><p>${sd.name}: 모서리 $${c.total}$개 · 만나는 것 $${c.nMeet + c.nExt}$ · 평행한 것 $${c.nPar}$ · 꼬인 위치 $${c.nSkew}$</p>`,
        rule: '꼬인 위치 = 만나지도 않고 평행하지도 않은 두 직선 (한 평면 위에 없다)',
        notes: notes(`${sd.name}에서는 어느 모서리를 기준으로 해도 만나는 것 ${c.nMeet + c.nExt}개, 평행한 것 ${c.nPar}개, 꼬인 위치 ${c.nSkew}개예요.`, '정사면체에는 평행한 모서리가 하나도 없어요. 그래서 만나지 않는 모서리는 모두 꼬인 위치예요(마주 보는 모서리 1개).', '정육면체와 정팔면체에서는 평행한 모서리를 지우는 것을 잊지 마세요.')
      };
    },
    prob: (M) => probSkew(M.qM, `p3-4|${M.Q.solid}|${M.Q.ni}`, M.qsd.name)
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
      questionReviewDraw: true,
      question: '정육면체의 꼭짓점 A에서 겉면을 따라 꼭짓점 G까지 가는 가장 짧은 길은 어디를 지날까? 두 면을 펼쳐서 보자.',
      cam0: { yaw: -28, pitch: 24 }, ctl: () => ['phEdge', 'phAnt', 'phFold'].concat(VIEW), anim: { key: 'phFold', dur: 4, label: '접어 보기', start: 0 }, stepT: (n) => (n >= 3 ? 0 : 0),
      init: (s) => { s.phEdge = 8; s.phAnt = 0.3; s.phFold = 0; s.phQ = rollQ(); },
      reroll: (s) => { s.phQ = rollQ(); },
      model: (s) => {
        const a = clamp(Math.round(s.phEdge / 2) * 2, 4, 14), r = Math.round(clamp(s.phAnt, 0.1, 0.9) * 100) / 100, ep = r * a;
        s.phEdge = a; s.phAnt = r; // 손잡이와 1% 간격 막대가 같은 위치를 가리키게 합니다.
        const len = (rr) => Math.hypot(rr * a, a) + Math.hypot((1 - rr) * a, a);
        return { a, r, ep, len: len(r), minLen: len(0.5), mid: Math.abs(r - 0.5) < 1e-9, Q: s.phQ };
      },
      draw(b, s, M, C) {
        if (C.questionReview) {
          const a = M.Q.a, length = a * Math.sqrt(5);
          M = { ...M, a, r: 0.5, ep: a / 2, len: length, minLen: length, mid: true };
          if (C.step < 2) C = { ...C, tab: 'problem', problem: true, review: false };
        }
        const st = stepOf(C), t = C.problem ? 1 : C.review ? 0 : (C.thumb ? 0 : s.phFold), phi = (PI / 2) * t;
        const r = C.problem || (C.review && st >= 2) ? 0.5 : M.r;
        const D0 = scene3(b, Object.assign({}, s, { phYaw: s.phYaw, phPitch: s.phPitch }), C);
        const D = D0;
        const A = fr(0, 0), Bp = fr(L, 0), E = fr(0, L), F = fr(L, L), Pp = fr(r * L, L), G = topPt(L, L, phi), H = topPt(0, L, phi);
        const flatG = topPt(L, L, 0), flatH = topPt(0, L, 0), closedG = topPt(L, L, PI / 2);
        // 지금 그려지는 모양만 화면에 맞춥니다(접은 정육면체가 펼친 모양의 자리까지 잡아 작아지지 않게)
        const fitp = [A, Bp, E, F, G, H];
        if (t > 0.02) fitp.push(v3(-L / 2, L / 2, -L / 2), v3(L / 2, L / 2, -L / 2), v3(L / 2, L / 2, L / 2), v3(-L / 2, L / 2, L / 2));
        const compact = b.W < 560 && !C.problem, thirdLine = C.review && (C.questionReview ? st >= 4 : st === 3);
        // 휴대폰은 보드가 도구막대 높이를 이미 비워 둡니다. 줄글 높이만 남겨 펼친 두 면을 읽을 만큼 키웁니다.
        D.fitPts(fitp, { t: C.problem ? 46 : compact ? (thirdLine ? 86 : 58) : 92, b: compact ? 12 : 52, l: 46, r: 46 });
        D.top = C.problem ? 42 : compact ? (thirdLine ? 78 : 52) : 76; // 위쪽 줄글 아래로 이름표가 올라가지 않게
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
        [[A, 'A'], [Bp, 'B'], [E, 'E'], [F, 'F'], [G, 'G'], [H, 'H']].forEach(([p, nm]) => {
          D.dot(p, nm === 'A' || nm === 'G' ? AMB : 'ink', nm === 'A' || nm === 'G' ? 6.5 : 3.6);
          // 문제의 맨 아래 B가 도구막대로 내려가지 않게 옆자리를 먼저 씁니다. 입체의 크기는 유지합니다.
          const beside = C.problem && nm === 'B' && b.toS(D.P(p)).y > b.H - b.insets.bottom - 80;
          if (C.txt) D.label(p, nm, { color: nm === 'A' || nm === 'G' ? AMB : 'ink', size: 18, dir: D.out(p, v3(0, 0, 0)), gap: 10, at: beside ? [[20, -2], [-20, -2], [16, -24], [-16, -24]] : undefined });
        });
        if (C.txt && !C.problem) {
          D.label(Pp, 'P', { color: AMB, size: 18, at: [[0, 20], [0, -20]] });
          const ep = r * M.a, pf = M.a - ep;
          D.obstacle(Pp, 12);
          if (!C.questionReview || st >= 4) {
            D.label(mid3(E, Pp), fmt2(ep), { color: 'rose', size: 15, at: [[0, -20], [0, -38], [-18, -24], [0, 26]] });
            D.label(mid3(Pp, F), fmt2(pf), { color: 'rose', size: 15, at: [[0, -20], [0, 26], [18, -24], [0, -38]] });
          }
          const L1 = [{ t: `한 모서리 a = ${M.a}`, c: 'ink', size: 15 }];
          if (st === 2 || st === 3) L1.push({ t: 'A와 G를 직선으로 이으면 EF의 가운데를 지나요', c: VIO, size: 14 });
          else if (M.mid && t < 0.05) L1.push({ t: 'AP와 PG가 한 직선이에요 → 가장 짧아요!', c: GRN, size: 15 });
          else L1.push({ t: `경로 A→P→G 의 길이 ≈ ${fmt1(M.len)}`, c: AMB, size: 15 });
          if (C.questionReview ? st >= 4 : st === 3) L1.push({ t: `EP = ${M.a} ÷ 2 = ${M.a / 2}`, c: GRN, size: 16 });
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
      view: (M, C) => {
        const r = C.review && C.step >= 2 ? 0.5 : M.r;
        const ep = r * M.a, length = Math.hypot(ep, M.a) + Math.hypot(M.a - ep, M.a), mid = Math.abs(r - 0.5) < 1e-9;
        return {
        guide: `<b>노란 손잡이</b>를 끌어 점 P를 모서리 EF 위에서 옮겨 보세요. 경로 A→P→G의 길이가 달라져요. 두 면을 펼치면(접기 0%) ${span('amber', '직선')}일 때 가장 짧아요.`,
        readouts: [rd('한 모서리 a', `${M.a}`, SKY), rd('EP', fmt2(ep), 'rose', `a의 ${Math.round(r * 100)}%`), rd('경로의 길이', `≈ ${fmt1(length)}`, mid ? GRN : AMB), rd('가장 짧은 경로', `≈ ${fmt1(M.minLen)}`, GRN, 'P가 EF의 가운데일 때')],
        formula: `<p>최단 경로는 두 면을 펼쳤을 때의 직선이에요. $\\overline{\\text{EP}}=\\dfrac{a}{2}=${M.a / 2}$</p>`,
        rule: '겉면 위의 최단 경로: 두 면을 한 평면 위에 펼쳤을 때 두 점을 잇는 직선',
        notes: notes('펼치면 두 변의 길이가 $a$와 $2a$인 직사각형이 돼요. 대각선이 $\\overline{\\text{EF}}$의 가운데를 지나요.', '입체에서는 꺾인 선이지만 펼치면 곧은 선이에요.')
      }; },
      prob: (M) => {
        const a = M.Q.a, ans = a / 2;
        return { tag: '겉면 위의 최단 경로', key: 'sp' + a, stem: `그림과 같이 한 모서리의 길이가 $${a}$인 정육면체의 꼭짓점 A에서 겉면을 따라 꼭짓점 G까지 가는 가장 짧은 경로가 모서리 EF와 만나는 점은 점 E에서 얼마나 떨어져 있는가?`, choices: (() => {
          const pool = []; for (let v = 0.5; v < a; v += 0.5) if (Math.abs(v - ans) > 1e-9) pool.push(v);
          const items = shuf(pool).slice(0, 4).map((v) => ({ v, ok: false, hint: Math.abs(v - ans) < 1.01 ? `가운데보다 한 칸쯤 ${v > ans ? 'F' : 'E'} 쪽으로 치우쳤어요.` : 'EF의 가운데가 아니에요. 펼친 직선이 지나는 자리를 다시 살펴보세요.' })).concat([{ v: ans, ok: true, hint: '' }]).sort((p, q) => p.v - q.v);
          return mkText(items.map((x) => ({ h: String(x.v), p: String(x.v), ok: x.ok, hint: x.hint })));
        })() };
      }
    };
  })();
  function fmt1(v) { const x = Math.round(v * 10) / 10; return Number.isInteger(x) ? String(x) : x.toFixed(1); }
  function fmt2(v) { return String(Math.round(v * 100) / 100); }

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
    cam0: CAM0, pmin: FOLD_PITCH, ctl: foldCtl, anim: foldAnim, stepT: (n) => (n >= 2 ? 1 : 0),
    presets: (s) => netPresets(CUBE5)(s).concat([1, 2, 3, 4, 5, 6].map((n) => ({ group: n === 1 ? '눈 고르기' : '', label: `눈 ${n}`, apply: (st) => { const fi = diceVals(netOf(st, CUBE5), 0).indexOf(n); st.phSelFace = st.phSelFace === fi ? null : fi; }, on: (st) => st.phSelFace != null && diceVals(netOf(st, CUBE5), 0)[st.phSelFace] === n }))),
    init: (s) => { initNet(s, CUBE5); s.phQ = rollQ38(); },
    reroll: (s) => { s.phQ = rollQ38(); },
    model: (s) => {
      const net = netOf(s, CUBE5), vals = diceVals(net, 0), f = s.phSelFace != null && s.phSelFace >= 0 && s.phSelFace < 6 ? s.phSelFace : null, fR = f == null ? 0 : f, q = s.phQ, qn = CUBE5[clamp(q.ni, 0, CUBE5.length - 1)].get(), qv = diceVals(qn, q.flip);
      const hid = q.hid, ans = qv[hid];
      return { net, vals, f, fR, opp: net.opposite[fR], Q: q, qn, qv, hid, ans };
    },
    draw(b, s, M, C) {
      const st = stepOf(C), t = C.problem ? 0 : C.review ? C.t : (C.thumb ? 0.6 : s.phFold);
      const net = C.problem ? landscapeNet(M.qn) : M.net, vals = C.problem ? M.qv : M.vals, f = C.problem ? null : C.review ? M.fR : M.f, opp = f == null ? -1 : net.opposite[f];
      fitNow(b, s, net, C, C.problem ? { t: 52, b: 26 } : { t: C.thumb ? 5 : 64, b: 18 }, camFoldK('cube'), t);
      const D = scene3(b, camFoldK('cube')(s, t), C);
      const role = faceRoles(C, st, f, opp, 6).map((r) => (r === 'p' ? 0 : r)), any = role.some((r) => r);
      const { faces, vis } = drawFacesOp(D, net, t, (i) => (C.problem && i === M.hid ? { c: AMB, a: 0.3, ec: AMB, ew: 2.6 } : ROLE[role[i]] || { c: 'green', a: 0.1 }), any ? 0.72 : 1);
      const fin = t >= 0.97;
      const ghosts = [];
      faces.forEach((p, i) => {
        if (C.problem && i === M.hid) { faceTxt(D, C, cen3(p), '?', { color: AMB, size: 26, at: [[0, 0]] }); return; }
        const hi = role[i] ? AMB : null;
        if (fin && !vis[i]) { if (hi) ghosts.push([p, String(vals[i])]); return; } // 가려진 면은 눈을 그리지 않습니다: 고른 면과 마주 보는 면만 점선 테두리와 숫자 배지
        drawPips(D, b, p, vals[i], hi || 'ink', 6.5);
        PIPS[vals[i]].forEach((q) => D.obstacle(add3(p[0], add3(mul3(sub3(p[1], p[0]), q[0]), mul3(sub3(p[3], p[0]), q[1]))), 16));
      });
      ghosts.forEach(([p, tx]) => { if (C.txt) ghostFace(D, p, faces, AMB, tx); else D.panel(p, AMB, 0, AMB, 3, { dash: [7, 5], alpha: 0.9 }); });
      if (C.txt && !C.thumb) {
        if (C.problem) banner(b, [{ t: '주사위의 전개도: 마주 보는 면의 눈의 합 = 7', c: 'ink', size: 15 }], C);
        else {
          const L = [{ t: '주사위의 전개도', c: 'ink', size: 15 }];
          if (f == null) L.push({ t: '면을 눌러 보세요', c: 'muted', size: 15 });
          else if (C.review && st <= 1) L.push({ t: `눈 ${vals[f]}인 면을 골랐어요`, c: AMB, size: 15 });
          else L.push({ t: `눈 ${vals[f]}의 맞은편은 눈 ${vals[opp]}  (${vals[f]} + ${vals[opp]} = 7)`, c: AMB, size: 15 });
          banner(b, L, C);
        }
      }
      D.flush();
      if (C.tab === 'explore') armFaceTap(b, C, 'p3-8', D, faces, vis);
    },
    steps: (M) => [
      `전개도를 접어서 마주 보는 면을 찾아요. 눈 $${M.vals[M.fR]}$의 맞은편은 눈 $${M.vals[M.opp]}$이에요. ${oppWhy(M.net, M.fR, M.opp)}`,
      `주사위에서 마주 보는 두 면의 눈의 합은 $7$이에요. $${M.vals[M.fR]}+${M.vals[M.opp]}=7$.`,
      `전개도에서 한 면의 눈을 알면 마주 보는 면의 눈은 $7-(\\text{그 눈})$으로 구해요.`
    ],
    view: (M) => {
      const none = M.f == null, v = M.vals;
      return {
        guide: `그림의 <b>면을 누르거나</b> 버튼으로 고른 뒤 <b>접기</b> 막대로 접어 보세요. 고른 면과 마주 보는 면이 ${span('amber', '같은 노랑')}으로 보이고, 두 면의 눈의 합은 늘 7이에요.`,
        readouts: [rd('고른 면의 눈', none ? '아직 없어요' : `${v[M.f]}`, none ? 'muted' : AMB), rd('마주 보는 면의 눈', none ? '면을 눌러 보세요' : `${v[M.opp]}`, none ? 'muted' : AMB), rd('두 눈의 합', none ? '7' : `${v[M.f] + v[M.opp]}`, GRN)],
        formula: `<p>(마주 보는 면의 눈) $=7-${v[M.fR]}=${v[M.opp]}$</p><p>마주 보는 면 찾는 법: ${IDEA}</p>`,
        rule: '주사위: 마주 보는 두 면의 눈의 합 = 7 (1과 6, 2와 5, 3과 4)',
        notes: notes(IDEA, '전개도에서 이웃해 보이는 면이 접으면 마주 보는 면이 아닐 수 있어요. 접어서 마주 보는 면을 확인하세요.')
      };
    },
    prob: (M) => {
      const opp = M.qn.opposite[M.hid], given = M.qv[opp], ans = M.ans, wr = [[given, '마주 보는 면의 눈 그대로예요. 합이 7이 되도록 빼야 해요.'], [ans - 1, '합이 7이 되는지 다시 계산해 보세요.'], [ans + 1, '합이 7이 되는지 다시 계산해 보세요.'], [7 - ans + 0, ''], [(ans % 6) + 1, '']];
      return { tag: '주사위의 전개도', key: `${M.Q.ni}|${M.Q.flip}|${M.hid}`, stem: '그림은 주사위의 전개도이다. 마주 보는 면의 눈의 합이 7일 때, ?에 알맞은 눈의 수는?', choices: mkChoices(ans, wr, { unit: '', valid: (v) => Number.isInteger(v) && v >= 1 && v <= 6 }) };
    }
  };

  function problemSteps(id, M, Q) {
    const answer = Q.choices.find((c) => c.ok).p;
    if (id === 'p3-1') {
      const wrong = M.Q.items.map((it, i) => ({ it, i })).filter(({ it }) => !it.ok);
      const why = (list) => list.map(({ it, i }) => `${G.NUM[i]} ${why31(it.cells)}`).join(' ');
      const correct = M.Q.items.findIndex((it) => it.ok);
      return ['정육면체의 전개도는 여섯 면이 접힌 뒤 모두 다른 자리를 차지하고, 한 꼭짓점에 세 면씩 모여야 해요.',
        why(wrong.slice(0, 2)), why(wrong.slice(2)),
        `${G.NUM[correct]}번은 여섯 면이 겹치지 않고 정육면체의 여섯 방향을 채워요. 따라서 이 전개도로 정육면체를 만들 수 있어요.`];
    }
    if (['p3-2', 'p3-5', 'p3-6'].includes(id)) {
      const name = ptName(M.qnet, M.qk), partners = M.qT.map((k) => ptName(M.qnet, k)).sort();
      return [`문제의 전개도에서 기준 점 ${name}이 있는 면을 먼저 확인해요. 점 이름은 현재 문제에 적힌 이름을 그대로 써요.`,
        '이웃한 면을 공통 모서리를 축으로 접고, 같은 입체의 꼭짓점에 닿는 점들을 따라가요. 종이에서 가까운 점이라고 겹치는 것은 아니에요.',
        `접었을 때 점 ${name}과 같은 꼭짓점으로 모이는 다른 점은 ${partners.join(', ')}이에요.`,
        `따라서 고를 보기는 ${answer}이에요. 기준 점 ${name} 자신은 다시 세지 않아요.`];
    }
    if (id === 'p3-3') {
      const base = fLet(M.qn, M.qf), opposite = fLet(M.qn, M.qopp);
      return [`문제의 전개도에서 면 ${base}를 기준으로 나머지 면을 접어요.`,
        '접은 정육면체에서 기준 면과 모서리를 공유하는 네 면은 수직이에요. 기준 면과 마주 보는 면 한 개만 평행해요.',
        `이 전개도에서는 면 ${base}와 면 ${opposite}가 서로 마주 보므로, 답은 면 ${opposite}예요.`];
    }
    if (id === 'p3-4') {
      const { ref, c } = M.qM;
      return [`문제의 전개도를 접어 ${M.qsd.name}를 만들어요. 같은 이름의 점은 한 꼭짓점으로 모이고, 기준 모서리는 ${ref.name}이에요.`,
        `기준 모서리와 만나는 모서리 ${c.nMeet + c.nExt}개와 평행한 모서리 ${c.nPar}개는 꼬인 위치가 아니에요.`,
        `남은 ${c.nSkew}개(${skewNames(c).join(', ')})는 만나지도 평행하지도 않아 꼬인 위치예요.`,
        `문제의 보기 중 여기에 해당하는 것은 모서리 ${answer}예요.`];
    }
    if (id === 'p3-7') {
      const a = M.Q.a;
      return [`문제의 정육면체는 한 모서리가 ${a}예요. 경로가 지나는 두 면을 모서리 EF를 축으로 펼쳐요.`,
        `펼친 두 면은 가로 ${2 * a}, 세로 ${a}인 직사각형이에요. 평면에서 A와 G를 잇는 직선이 가장 짧은 경로예요.`,
        '두 합동인 정사각형의 경계 EF는 직사각형의 한가운데를 지나므로, 대각선과 EF가 만나는 P는 EF의 중점이에요.',
        `따라서 $\\overline{EP}=\\dfrac{${a}}{2}=${a / 2}$예요.`];
    }
    const opposite = M.qn.opposite[M.hid], given = M.qv[opposite];
    return ['문제의 전개도를 접어 ?가 쓰인 면과 마주 보는 면을 찾아요. 옆에서 맞닿는 면은 수직이므로 제외해요.',
      `?와 마주 보는 면의 눈은 ${given}이에요. 주사위에서 마주 보는 두 면의 눈의 합은 7이에요.`,
      `따라서 $?=7-${given}=${7 - given}$이에요.`];
  }
  const scenes = [A1, A2, A3, A4, A5, A6, A7, A8];
  scenes.forEach((D) => { D.problemSteps = (M, Q) => problemSteps(D.id, M, Q); });
  G.register(30, 't3', '③ 정다면체의 전개도와 꼬인 위치', '전개도·꼬인 위치', PARAMS, scenes);
  // 문제 탭(휴대폰): 그림 아래에서 질문이 스크롤 없이 보이도록 이 탭의 '탐구 질문' 카드는 접습니다(탐구 탭에서 이미 읽은 글입니다).
  // 셸의 장면 선택 사항 sc.tabs 를 켜면 머리말에 data-tab 이 달려, 아래 CSS 가 문제 탭에서만 적용됩니다.
  (function () {
    const grp = (window.APL_PH_GROUPS || [])[(window.APL_PH_GROUPS || []).length - 1];
    if (grp) grp.scenes.forEach((sc) => { sc.tabs = {}; });
    if (document.getElementById('ph-t3-css')) return;
    const st = document.createElement('style');
    st.id = 'ph-t3-css';
    st.textContent = '@media (max-width:859px){.apl-scene-head[data-tab="problem"] .apl-question{display:none}body:has(.apl-scene-head[data-tab="problem"]) .apl-stage{height:clamp(240px,36svh,560px)}}';
    document.head.append(st);
  })();
})();
