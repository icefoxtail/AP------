/* ==========================================================================
   중1 · 겉넓이와 부피 — 탭 ① 「기둥의 겉넓이와 부피」 (t1.js, order 10) — 장면 5개
   · sv1-1 전개도로 보는 겉넓이(직사각형·직각삼각형·사다리꼴·원 밑면) · sv1-2 부채꼴기둥[함정: 호만 곱함]
   · sv1-3 원기둥 굴리기(2πr) · sv1-4 부피 V=Sh(밑면이 아래, 판이 왼쪽에서 들어와 위로 쌓임) · sv1-5 기둥 종합(직사각형+반원 밑면)
   전개도가 겉넓이 식의 첫 단계입니다: 입체를 펼치면 「밑면 2개 + 옆면 직사각형 1개(가로 = 밑면 둘레 전체, 세로 = 높이)」가 보입니다.
   모든 글자·식·보기·정답은 지금의 값으로 다시 계산됩니다. 정확한 값은 π 가 들어간 식으로 씁니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SV;
  if (!G) return;
  const { cube8, PI, DEG, clamp, ease, seg01, lin01, v3, add3, sub3, mul3, lerp3, mid3, dot3, unit3, len3, V, vadd, vmul, vnum, tx, plainVal, mkV, mkText, P, fmtN, jo, pick, rint, shuffle, notes, rd, span, scene3, solidNet, circleBase, sectorBase, netScene, roleStyle, layoutTiles, drawTiles, prismMesh, revolveMesh, xfMesh, rotM } = G;

  const PARAMS = {
    sA: P('가로 a', 2, 8, 1, 4, { color: 'amber', format: (v) => v + ' cm' }),
    sB: P('세로 b', 2, 8, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    sK: P('직각삼각형의 크기 k', 1, 3, 1, 1, { color: 'amber', hint: '세 변이 3k, 4k, 5k인 직각삼각형이에요', format: (v) => `${3 * v}·${4 * v}·${5 * v} cm` }),
    sU: P('사다리꼴의 윗변', 1, 6, 1, 3, { color: 'amber', hint: '아랫변은 윗변보다 6 cm 길고, 높이 4 cm·다리 5 cm는 그대로예요', format: (v) => `${v} cm (아랫변 ${v + 6} cm)` }),
    sR: P('반지름 r', 1, 5, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    sH: P('기둥의 높이 h', 2, 8, 1, 5, { color: 'sky', format: (v) => v + ' cm' }),
    sT: P('펼치기', 0, 1, 0.01, 0, { color: 'green', hint: '오른쪽으로 끌수록 입체가 전개도로 펼쳐져요', format: (v) => (v < 0.02 ? '입체' : v > 0.98 ? '전개도' : Math.round(v * 100) + '%') }),
    // sv1-2 부채꼴기둥
    sTh: P('부채꼴의 중심각', 60, 300, 30, 120, { color: 'amber', format: (v) => v + '°' }),
    sR2: P('부채꼴의 반지름 r', 2, 8, 1, 6, { color: 'amber', format: (v) => v + ' cm' }),
    sH2: P('기둥의 높이 h', 2, 8, 1, 5, { color: 'sky', format: (v) => v + ' cm' }),
    sT2: P('펼치기', 0, 1, 0.01, 0, { color: 'green', format: (v) => (v < 0.02 ? '입체' : v > 0.98 ? '전개도' : Math.round(v * 100) + '%') }),
    // sv1-3 굴리기
    sR3: P('원기둥의 반지름 r', 1, 6, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    sH3: P('원기둥의 높이 h', 2, 10, 1, 5, { color: 'sky', format: (v) => v + ' cm' }),
    sT3: P('굴러 가기', 0, 1, 0.01, 0, { color: 'green', hint: '한 바퀴 굴러 간 길이가 옆면의 가로예요', format: (v) => (v < 0.02 ? '출발' : v > 0.98 ? '한 바퀴' : Math.round(v * 100) + '%') }),
    // sv1-4 판 쌓기
    sT4: P('판 쌓기', 0, 1, 0.01, 0, { color: 'green', hint: '얇은 판이 하나씩 쌓여 높이만큼 늘어나요', format: (v) => (v < 0.02 ? '시작' : v > 0.98 ? '모두 쌓음' : Math.round(v * 100) + '%') }),
    // sv1-5 종합
    sW: P('직사각형 부분의 길이 w', 2, 8, 1, 4, { color: 'amber', format: (v) => v + ' cm' }),
    sRr: P('반원의 반지름 r', 1, 4, 1, 2, { color: 'amber', format: (v) => v + ' cm' }),
    sH5: P('기둥의 높이 h', 2, 8, 1, 5, { color: 'sky', format: (v) => v + ' cm' })
  };

  /* ------------------------------------------------------------ 밑면 모델 (직사각형·직각삼각형·사다리꼴·원) */
  const SHAPE_ORDER = ['rect', 'tri', 'trap', 'circ'];
  const SHAPE_LABEL = { rect: '직사각형', tri: '직각삼각형', trap: '사다리꼴', circ: '원' };
  const SHAPE_SOLID = { rect: '직육면체', tri: '삼각기둥', trap: '사각기둥', circ: '원기둥' };
  function baseModel(shape, s) {
    let m;
    if (shape === 'rect') {
      const a = clamp(Math.round(s.sA), 2, 8), b = clamp(Math.round(s.sB), 2, 8);
      m = { poly: [[-a / 2, -b / 2], [a / 2, -b / 2], [a / 2, b / 2], [-a / 2, b / 2]], smooth: null, sides: [a, b, a, b], root: 1, area: V(a * b), per: V(2 * (a + b)), areaTex: `${a}\\times${b}`, perTex: `2\\times(${a}+${b})`, given: `가로 ${a} cm, 세로 ${b} cm`, one: V(a) };
    } else if (shape === 'tri') {
      const k = clamp(Math.round(s.sK), 1, 3);
      m = { poly: [[0, 0], [3 * k, 0], [0, 4 * k]], smooth: null, sides: [3 * k, 5 * k, 4 * k], root: 0, area: V(6 * k * k), per: V(12 * k), areaTex: `\\frac{1}{2}\\times${3 * k}\\times${4 * k}`, perTex: `${3 * k}+${4 * k}+${5 * k}`, given: `세 변 ${3 * k} cm, ${4 * k} cm, ${5 * k} cm`, one: V(3 * k), legs: [3 * k, 4 * k] };
    } else if (shape === 'trap') {
      const u = clamp(Math.round(s.sU), 1, 6), wb = u + 6;
      m = { poly: [[-wb / 2, 0], [wb / 2, 0], [u / 2, 4], [-u / 2, 4]], smooth: null, sides: [wb, 5, u, 5], root: 0, area: V(((u + wb) * 4) / 2), per: V(u + wb + 10), areaTex: `\\frac{1}{2}\\times(${u}+${wb})\\times4`, perTex: `${u}+${wb}+5+5`, given: `윗변 ${u} cm, 아랫변 ${wb} cm, 높이 4 cm, 다리 5 cm`, one: V(u), u, wb };
    } else {
      const r = clamp(Math.round(s.sR), 1, 5);
      m = { poly: circleBase(r, 36), smooth: Array(36).fill(true), sides: null, root: 18, area: V(0, r * r), per: V(0, 2 * r), areaTex: `\\pi\\times${r}^2`, perTex: `2\\pi\\times${r}`, given: `반지름 ${r} cm`, one: V(0, r), r };
    }
    const xs = m.poly.map((p) => p[0]), zs = m.poly.map((p) => p[1]);
    m.shape = shape; m.name = SHAPE_LABEL[shape]; m.solid = SHAPE_SOLID[shape];
    m.cx = (Math.min(...xs) + Math.max(...xs)) / 2; m.cz = (Math.min(...zs) + Math.max(...zs)) / 2;
    m.ex = Math.max(...xs) - Math.min(...xs); m.ez = Math.max(...zs) - Math.min(...zs);
    return m;
  }
  const scaledPoly = (bm, sc) => bm.poly.map((p) => [(p[0] - bm.cx) * sc, (p[1] - bm.cz) * sc]);
  const hNum = (h) => `\\times${h}`;

  /* ================================================================ sv1-1 전개도로 보는 겉넓이 */
  function sv11() {
    const model = (s) => {
      const shape = SHAPE_ORDER.includes(s.svShape) ? s.svShape : 'rect', bm = baseModel(shape, s), h = clamp(Math.round(s.sH), 2, 8);
      const L = vmul(bm.per, h), S2 = vmul(bm.area, 2), tot = vadd(S2, L);
      return { shape, bm, h, S: bm.area, S2, P: bm.per, L, tot };
    };
    const topKnown = (ctx) => ctx.front(ctx.tp.length - 1) && ctx.tp[ctx.tp.length - 1].pc.tag === 'top';
    const draw = (b, s, M, C) => {
      const bm = M.bm, sc = 5.2 / Math.max(bm.ex, bm.ez, M.h), hu = M.h * sc, poly = scaledPoly(bm, sc);
      const sn = solidNet(poly, hu, 1, bm.smooth, bm.root);
      const n = poly.length, st = C.step;
      const lvB = !C.review ? 1 : st === 1 ? 2 : st === 2 ? 1 : 3, lvL = !C.review ? 1 : st === 1 ? 0 : st === 2 ? 2 : 3;
      const t = C.problem ? 0 : C.t;
      netScene(b, s, C, {
        sn, t, fitOpt: { l: 40, r: 40, t: 40, b: 40 },
        style: (pc) => roleStyle(pc.tag === 'lat' ? 'lat' : 'base', pc.tag === 'lat' ? lvL : lvB),
        labels: (ctx) => {
          const { D, tp } = ctx, vw = D.vw;
          const m = sn.lat.indexOf(sn.root), A = sn.A, B = sn.B;
          // 옆면마다 밑변의 길이 (보이는 쪽)
          if (bm.sides) {
            sn.lat.forEach((idx, k) => {
              if (dot3(tp[idx].n, vw) < 0.35) return;
              const p = lerp3(mid3(A[k], A[(k + 1) % n]), mid3(B[k], B[(k + 1) % n]), 0.2);
              D.tag(ctx.at(idx, p), fmtN(bm.sides[k]), { size: 15, color: C.problem ? 'ink' : 'ink' });
            });
          }
          // 뒤쪽 옆면의 밑변 길이는 윗면의 변에 적어 줍니다(보이는 변과 길이가 같으면 생략)
          if (bm.sides && ctx.e < 0.5 && topKnown(ctx)) {
            sn.lat.forEach((idx, k) => {
              if (dot3(tp[idx].n, vw) >= 0.35) return;
              const val = bm.sides[k];
              if (sn.lat.some((j, kk) => dot3(tp[j].n, vw) >= 0.35 && bm.sides[kk] === val)) return;
              D.elabel(ctx.at(sn.top, B[k]), ctx.at(sn.top, B[(k + 1) % n]), fmtN(val), { from: ctx.at(sn.top, G.centroid(B)), size: 14, gap: 6 });
            });
          }
          // 높이
          const rootK = m, a1 = A[rootK], b1 = B[rootK];
          D.elabel(ctx.at(sn.root, a1), ctx.at(sn.root, b1), `h=${M.h}`, { side: { x: -1, y: 0 }, color: 'amber', gap: 9 });
          // 밑면의 정보
          const topK = sn.top, botK = sn.bot;
          const showBase = (k, pts, first) => {
            if (dot3(tp[k].n, vw) < 0.3) return false;
            const ctr = ctx.at(k, G.centroid(pts));
            if (bm.shape === 'circ') {
              const rim = ctx.at(k, pts[0]), c0 = ctx.at(k, G.centroid(pts));
              D.line(c0, rim, 'ink', 2.2);
              D.dot(c0, 'ink', 3.5);
              if (first) D.tag(mid3(c0, rim), `r=${bm.r}`, { dy: -12, size: 14 });
            } else if (bm.shape === 'tri') {
              D.right(ctx.at(k, pts[0]), sub3(ctx.at(k, pts[1]), ctx.at(k, pts[0])), sub3(ctx.at(k, pts[2]), ctx.at(k, pts[0])), 0.32, 'amber');
            } else if (bm.shape === 'trap') {
              const a0 = ctx.at(k, pts[0]), a1 = ctx.at(k, pts[1]), t2 = ctx.at(k, pts[2]), dir = unit3(sub3(a1, a0)), foot = add3(a0, mul3(dir, dot3(sub3(t2, a0), dir)));
              D.line(t2, foot, 'amber', 2.2, { dash: [5, 4] });
              D.tag(mid3(t2, foot), '4', { dx: 9, size: 14, color: 'amber' });
            }
            if (!C.problem) D.tag(ctr, `S=${plainVal(M.S)}`, { size: 15, color: lvB === 2 ? 'ink' : 'ink', dy: bm.shape === 'circ' ? 14 : 0 });
            return true;
          };
          if (topK >= 0) { showBase(topK, B, true); showBase(botK, A, false); }
          // 전개도에서 옆면 전체 가로
          if (!C.problem && ctx.e > 0.8) {
            const cs = sn.lat.map((idx, k) => ctx.at(idx, lerp3(mid3(A[k], A[(k + 1) % n]), mid3(B[k], B[(k + 1) % n]), 0.8)));
            D.tag(G.centroid(cs), `밑면의 둘레 ${plainVal(M.P)}`, { size: 15, color: 'amber' });
          }
        }
      });
    };
    return {
      id: 'sv1-1', title: '전개도로 보는 겉넓이', short: '전개도 겉넓이',
      question: '기둥을 펼쳐 보면 어떤 조각들이 나올까? 옆면은 어떤 모양이고, 가로 길이는 밑면의 무엇과 같을까?',
      anim: { key: 'sT', dur: 5, label: '펼쳐 보기' }, cam0: { yaw: 28, pitch: 22 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: (s) => ({ rect: ['sA', 'sB'], tri: ['sK'], trap: ['sU'], circ: ['sR'] }[s.svShape || 'rect'].concat(['sH', 'sT'])),
      presets: () => SHAPE_ORDER.map((k, i) => ({ group: i === 0 ? '밑면 모양' : '', label: SHAPE_LABEL[k], apply: (st) => { st.svShape = k; }, on: (st) => (st.svShape || 'rect') === k })),
      init: (s) => { s.svShape = 'rect'; s.sA = 4; s.sB = 3; s.sK = 1; s.sU = 3; s.sR = 3; s.sH = 5; s.sT = 0; },
      reroll: (s) => {
        s.svShape = pick(SHAPE_ORDER, s.svShape);
        s.sA = rint(2, 7); s.sB = pick([2, 3, 4, 5, 6, 7], s.sA); s.sK = rint(1, 2); s.sU = rint(1, 5); s.sR = rint(2, 5); s.sH = rint(2, 8); s.sT = 0;
      },
      model, draw,
      check: (s) => {
        const M = model(s), poly = M.shape === 'circ' ? circleBase(M.bm.r, 4000) : M.bm.poly;
        let A2 = 0, Pm = 0;
        poly.forEach((p, i) => { const q = poly[(i + 1) % poly.length]; A2 += p[0] * q[1] - q[0] * p[1]; Pm += Math.hypot(q[0] - p[0], q[1] - p[1]); });
        return { ans: Math.abs(A2) + Pm * M.h, model: vnum(M.tot) };
      },
      steps: (M) => {
        const { bm, h } = M;
        return [
          `밑면은 ${bm.name}이고 2개예요. 밑넓이 $S=${bm.areaTex}=${tx(M.S)}$이므로 $2S=${tx(M.S)}\\times2=${tx(M.S2)}\\,\\mathrm{cm}^2$예요.`,
          `전개도에서 옆면은 직사각형 하나예요. 가로는 밑면의 둘레 전체 $P=${bm.perTex}=${tx(M.P)}$, 세로는 높이 $${h}$이므로 옆넓이는 $P\\times h=${tx(M.P)}\\times${h}=${tx(M.L)}\\,\\mathrm{cm}^2$예요.`,
          `(겉넓이) $=$ (밑넓이)$\\times2+$(옆넓이) $=${tx(M.S2)}+${tx(M.L)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
        ];
      },
      view: (M, C) => {
        const { bm, h } = M;
        return {
          guide: `아래 막대 <b>펼치기</b>를 끌거나 ▶를 눌러 ${bm.solid}를 펼쳐 보세요. <b>밑면 모양 칩</b>과 <b>길이 막대</b>로 값을 바꿀 수 있고, 빈 곳을 끌면 입체가 돌아가요. 펼치면 ${span('sky', '밑면 2개')}와 ${span('green', '옆면 직사각형 1개')}가 나와요.`,
          readouts: [
            rd('밑넓이 S', plainVal(M.S) + ' cm²', 'sky', bm.areaTex.replace(/\\frac\{1\}\{2\}/g, '½').replace(/\\times/g, '×').replace(/\\pi/g, 'π')),
            rd('밑면의 둘레 P', plainVal(M.P) + ' cm', 'amber', '옆면의 가로'),
            rd('옆넓이 P×h', plainVal(M.L) + ' cm²', 'green', `${plainVal(M.P)} × ${h}`),
            rd('겉넓이', plainVal(M.tot) + ' cm²', 'amber', `2×${plainVal(M.S)} + ${plainVal(M.L)}`)
          ],
          formula: `<p>(겉넓이) $=2S+P\\times h$ &nbsp; ($S$ 밑넓이, $P$ 밑면의 둘레, $h$ 높이)</p>`,
          rule: '기둥의 옆면은 직사각형: 가로 = 밑면의 둘레 전체, 세로 = 높이',
          notes: notes('옆면의 가로는 밑면의 <b>한 변이 아니라 둘레 전체</b>예요. 전개도에서 옆면을 한 줄로 펴 보면 알 수 있어요.', '밑면은 위·아래 <b>2개</b>예요. 밑넓이를 두 번 더해요.', '부피($S\\times h$)와 겉넓이를 헷갈리지 않아요. 겉넓이는 면의 넓이의 합이에요.')
        };
      },
      prob: (M) => {
        const { bm, h } = M, one = vmul(bm.one, h);
        const wrongs = [
          [vadd(M.S, M.L), '밑면은 위·아래 2개예요. 밑넓이를 두 번 더해야 해요.'],
          [M.L, '옆넓이만 구했어요. 밑넓이 2개도 더해야 해요.'],
          [vmul(M.S, h), '부피(밑넓이×높이)를 구했어요. 겉넓이는 면의 넓이의 합이에요.'],
          [vadd(M.S2, one), '옆면의 가로는 한 변(또는 반지름)이 아니라 밑면의 둘레 전체예요.'],
          [vadd(M.S2, vmul(M.L, 2)), '옆면은 한 번만 더해요.']
        ];
        const stem = { rect: `그림과 같이 밑면의 가로가 $${bm.sides ? bm.sides[0] : ''}\\,\\mathrm{cm}$, 세로가 $${bm.sides ? bm.sides[1] : ''}\\,\\mathrm{cm}$이고 높이가 $${h}\\,\\mathrm{cm}$인 직육면체의 겉넓이는?`,
          tri: `그림과 같이 밑면이 세 변의 길이가 $${bm.sides ? bm.sides.join('\\,\\mathrm{cm},\\ ') : ''}\\,\\mathrm{cm}$인 직각삼각형이고 높이가 $${h}\\,\\mathrm{cm}$인 삼각기둥의 겉넓이는?`,
          trap: `그림과 같이 밑면이 윗변 $${bm.u}\\,\\mathrm{cm}$, 아랫변 $${bm.wb}\\,\\mathrm{cm}$, 높이 $4\\,\\mathrm{cm}$, 다리 $5\\,\\mathrm{cm}$인 사다리꼴이고 기둥의 높이가 $${h}\\,\\mathrm{cm}$인 사각기둥의 겉넓이는?`,
          circ: `그림과 같이 밑면의 반지름이 $${bm.r}\\,\\mathrm{cm}$이고 높이가 $${h}\\,\\mathrm{cm}$인 원기둥의 겉넓이는?` }[M.shape];
        return { tag: '기둥의 겉넓이', key: `${M.shape}|${bm.given}|${h}`, stem, choices: mkV(M.tot, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv1-2 부채꼴기둥 */
  function sv12() {
    const model = (s) => {
      const th = clamp(Math.round(s.sTh / 30) * 30, 60, 300), r = clamp(Math.round(s.sR2), 2, 8), h = clamp(Math.round(s.sH2), 2, 8);
      const S = V(0, (r * r * th) / 360), arc = V(0, (r * th) / 180), Pm = vadd(arc, V(2 * r)), L = vmul(Pm, h), S2 = vmul(S, 2), tot = vadd(S2, L);
      return { th, r, h, S, arc, P: Pm, L, S2, tot };
    };
    const draw = (b, s, M, C) => {
      const { th, r, h } = M, sc = 5.2 / Math.max(r * (th > 180 ? 2 : 1.4), h), ru = r * sc, hu = h * sc;
      const sb = sectorBase(ru, th), N = sb.pts.length - 2;
      const sn = solidNet(sb.pts, hu, 1, sb.smooth, 1 + Math.floor(N / 2));
      const A = sn.A, B = sn.B, n = sb.pts.length, st = C.step;
      const lvB = !C.review ? 1 : st === 1 ? 2 : st === 2 ? 1 : 3, lvL = !C.review ? 1 : st === 1 ? 0 : st === 2 ? 2 : 3;
      const t = C.problem ? 0 : C.t;
      netScene(b, s, C, {
        sn, t, fitOpt: { l: 40, r: 40, t: 40, b: 40 },
        style: (pc) => roleStyle(pc.tag === 'lat' ? 'lat' : 'base', pc.tag === 'lat' ? lvL : lvB),
        labels: (ctx) => {
          const { D, tp } = ctx, vw = D.vw;
          // 반지름 면 두 개: 밑변의 길이 r
          [0, n - 1].forEach((k) => {
            const idx = sn.lat[k];
            if (dot3(tp[idx].n, vw) < 0.3) return;
            D.tag(ctx.at(idx, lerp3(mid3(A[k], A[(k + 1) % n]), mid3(B[k], B[(k + 1) % n]), 0.2)), `r=${r}`, { size: 14 });
          });
          // 높이
          D.elabel(ctx.at(sn.root, A[1 + Math.floor(N / 2)]), ctx.at(sn.root, B[1 + Math.floor(N / 2)]), `h=${h}`, { side: { x: -1, y: 0 }, color: 'amber', gap: 9 });
          // 부채꼴 위: 중심각, 반지름, 넓이
          const fr = (k, pts) => {
            if (dot3(tp[k].n, vw) < 0.3) return false;
            const O = pts[0], arcPts = [];
            for (let i = 1; i < n; i++) arcPts.push(ctx.at(k, lerp3(O, pts[i], 0.3)));
            D.path(arcPts, 'amber', 2.4);
            D.tag(ctx.at(k, lerp3(O, pts[1 + Math.floor(N / 2)], 0.5)), `${th}°`, { size: 14, color: 'amber' });
            D.line(ctx.at(k, O), ctx.at(k, pts[1]), 'ink', 2.4);
            if (!C.problem) D.tag(ctx.at(k, lerp3(O, pts[1 + Math.floor(N / 2)], 0.82)), `S=${plainVal(M.S)}`, { size: 14 });
            const cen = ctx.at(k, G.centroid(pts));
            D.elabel(ctx.at(k, O), ctx.at(k, pts[1]), `r=${r}`, { from: cen, size: 14, gap: 6 });
            D.elabel(ctx.at(k, O), ctx.at(k, pts[n - 1]), `r=${r}`, { from: cen, size: 14, gap: 6 });
            return true;
          };
          fr(sn.top, B); fr(sn.bot, A);
          if (!C.problem && ctx.e > 0.8) {
            const cs = sn.lat.slice(2, sn.lat.length - 2).map((idx) => ctx.at(idx, G.centroid(sn.net.pieces[idx].pts)));
            D.tag(G.centroid(cs), `호 ${plainVal(M.arc)} + 2r = ${plainVal(M.P)}`, { size: 14, color: 'amber' });
          }
        }
      });
    };
    return {
      id: 'sv1-2', title: '부채꼴기둥', short: '부채꼴기둥 [함정]',
      question: '밑면이 부채꼴인 기둥을 펼치면 옆면의 가로는 얼마일까? 호의 길이만 곱하면 될까?',
      anim: { key: 'sT2', dur: 5, label: '펼쳐 보기' }, cam0: { yaw: 28, pitch: 22 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: () => ['sTh', 'sR2', 'sH2', 'sT2'],
      init: (s) => { s.sTh = 120; s.sR2 = 6; s.sH2 = 5; s.sT2 = 0; },
      reroll: (s) => {
        const th = pick([60, 90, 120, 180, 240, 270, 300], s.sTh);
        const rs = { 60: [3, 6], 90: [2, 4, 6, 8], 120: [3, 6], 180: [2, 4, 6, 8], 240: [3, 6], 270: [2, 4, 6, 8], 300: [3, 6] }[th];
        s.sTh = th; s.sR2 = pick(rs, -1); s.sH2 = rint(2, 8); s.sT2 = 0;
      },
      model, draw,
      check: (s) => {
        const M = model(s), r = M.r, th = M.th * DEG, N = 4000;
        let per = 2 * r, A = 0;
        for (let i = 0; i < N; i++) { const a0 = (th * i) / N, a1 = (th * (i + 1)) / N; per += Math.hypot(r * (Math.cos(a1) - Math.cos(a0)), r * (Math.sin(a1) - Math.sin(a0))); A += 0.5 * r * r * Math.sin(a1 - a0); }
        return { ans: 2 * A + per * M.h, model: vnum(M.tot) };
      },
      steps: (M) => [
        `밑면은 반지름 $${M.r}$, 중심각 $${M.th}^\\circ$인 부채꼴이 2개예요. $S=\\pi\\times${M.r}^2\\times\\frac{${M.th}}{360}=${tx(M.S)}$이므로 $2S=${tx(M.S2)}\\,\\mathrm{cm}^2$예요.`,
        `옆면은 직사각형 하나이고 가로는 밑면의 둘레 전체예요. 호의 길이는 $2\\pi\\times${M.r}\\times\\frac{${M.th}}{360}=${tx(M.arc)}$이고 반지름 2개($2\\times${M.r}$)도 더해야 해요. $P=${tx(M.arc)}+${2 * M.r}=${tx(M.P)}$, 옆넓이 $=${tx(M.P)}\\times${M.h}=${tx(M.L)}\\,\\mathrm{cm}^2$예요.`,
        `(겉넓이) $=${tx(M.S2)}+${tx(M.L)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M) => ({
        guide: `<b>중심각·반지름·높이 막대</b>를 움직이고 <b>펼치기</b>를 끌어 보세요. 부채꼴기둥의 옆면은 ${span('green', '곡면 1개 + 평평한 직사각형 2개')}가 한 줄로 이어진 직사각형이에요.`,
        readouts: [
          rd('밑넓이 S', plainVal(M.S) + ' cm²', 'sky', `π×${M.r}²×${M.th}/360`),
          rd('호의 길이', plainVal(M.arc) + ' cm', 'amber', `2π×${M.r}×${M.th}/360`),
          rd('옆면의 가로', plainVal(M.P) + ' cm', 'amber', '호 + 반지름 2개'),
          rd('겉넓이', plainVal(M.tot) + ' cm²', 'green', `2×${plainVal(M.S)} + ${plainVal(M.L)}`)
        ],
        formula: `<p>(옆면의 가로) $=$ (호의 길이) $+2r$ &nbsp;→&nbsp; (겉넓이) $=2S+(\\text{호}+2r)\\times h$</p>`,
        rule: '부채꼴기둥: 옆면의 가로 = 호 + 반지름 2개 (밑면의 둘레 전체)',
        notes: notes('<b>함정</b>: 호의 길이만 곱하면 안 돼요. 부채꼴의 두 <b>반지름</b> 위에도 옆면(직사각형)이 있어요.', '중심각이 $180^\\circ$를 넘어도 같아요. 넘으면 부채꼴이 오목하게 보일 뿐이에요.')
      }),
      prob: (M) => {
        const wrongs = [
          [vadd(M.S2, vmul(M.arc, M.h)), '옆면의 가로에 반지름 2개를 빠뜨렸어요. 호 + 반지름 2개 = 둘레 전체예요.'],
          [vadd(M.S, M.L), '밑면은 2개예요.'],
          [M.L, '옆넓이만 구했어요. 밑넓이 2개도 더해야 해요.'],
          [vadd(M.S2, vmul(V(2 * M.r, 2 * M.r), M.h)), '호가 아니라 원 전체의 둘레를 썼어요. 부채꼴의 호는 중심각만큼만이에요.'],
          [vmul(M.S, M.h), '부피를 구했어요.']
        ];
        return { tag: '부채꼴기둥의 겉넓이 (함정: 호만 곱함)', key: `${M.th}|${M.r}|${M.h}`, stem: `그림과 같이 밑면이 반지름 $${M.r}\\,\\mathrm{cm}$, 중심각 $${M.th}^\\circ$인 부채꼴이고 높이가 $${M.h}\\,\\mathrm{cm}$인 기둥의 겉넓이는?`, choices: mkV(M.tot, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv1-3 원기둥 굴리기 */
  function sv13() {
    const model = (s) => {
      const r = clamp(Math.round(s.sR3), 1, 6), h = clamp(Math.round(s.sH3), 2, 10);
      const S = V(0, r * r), S2 = vmul(S, 2), per = V(0, 2 * r), L = vmul(per, h), tot = vadd(S2, L);
      return { r, h, S, S2, per, L, tot };
    };
    const draw = (b, s, M, C) => {
      const { r, h } = M, sc = 2.2 / Math.max(r, h * 0.42), ru = r * sc, hu = h * sc, Ltot = 2 * PI * ru;
      const t = C.problem ? 0 : ease(C.t), xs = -Ltot / 2, xc = C.problem ? 0 : xs + Ltot * t;
      const D = scene3(b, s, C);
      const cylM = revolveMesh([[0, -hu / 2], [ru, -hu / 2], [ru, hu / 2], [0, hu / 2]], { axis: 'z', O: v3(xc, 0, 0), N: 44, tags: ['back', 'side', 'front'] });
      const st = C.step, lvC = !C.review ? 1 : st === 1 ? 2 : st === 2 ? 1 : 3, lvR = !C.review ? 1 : st === 1 ? 0 : st === 2 ? 2 : 3;
      const row = C.problem ? null : layoutTiles([
        { w: 2 * r, h: 2 * r, shape: 'circle', fill: 'sky', label: plainVal(M.S), cap: 'πr² (밑면)', hl: lvC },
        { w: 2 * PI * r, h: h, shape: 'rect', fill: 'green', label: plainVal(M.L), cap: `2πr×h (옆면)`, hl: lvR },
        { w: 2 * r, h: 2 * r, shape: 'circle', fill: 'sky', label: plainVal(M.S), cap: 'πr² (밑면)', hl: lvC }
      ], 2 * PI * ru + 2 * ru, 2.6, 0.5);
      const xe = C.problem ? 0 : -xs, xb = C.problem ? 0 : xs;
      const corners = [v3(xb - ru, -ru, -hu / 2), v3(xe + ru, -ru, -hu / 2), v3(xb - ru, ru, hu / 2), v3(xe + ru, ru, hu / 2), v3(xb, -ru, hu / 2), v3(xe, -ru, hu / 2)];
      const bb = G.bboxOf(corners.map(D.P));
      const extra = row ? [{ x: -row.total / 2, y: bb.y1 + 0.9 }, { x: row.total / 2, y: bb.y1 + 0.9 + row.height + 0.9 }] : [];
      D.fit(corners, extra, { l: 36, r: 36, t: 36, b: 36 });
      // 굴러간 자리(옆면이 펼쳐진 직사각형)
      if (!C.problem && xc > xs + 1e-3) D.panel([v3(xs, -ru, -hu / 2), v3(xc, -ru, -hu / 2), v3(xc, -ru, hu / 2), v3(xs, -ru, hu / 2)], 'green', lvR === 2 ? 0.5 : 0.3, lvR === 2 ? 'amber' : 'green', 2.4);
      if (!C.problem) { D.line(v3(xs - ru * 1.2, -ru, -hu / 2), v3(-xs + ru * 1.2, -ru, -hu / 2), 'muted', 1.4, { alpha: 0.5 }); D.line(v3(xs - ru * 1.2, -ru, hu / 2), v3(-xs + ru * 1.2, -ru, hu / 2), 'muted', 1.4, { alpha: 0.5 }); }
      D.body({ mesh: cylM, fill: 'sky', alpha: 0.2, faceStyle: (f) => (f.tag === 'front' && lvC === 2 ? { fill: 'amber', alpha: 0.42 } : f.tag === 'back' && lvC === 2 ? { fill: 'amber', alpha: 0.3 } : f.tag === 'side' && lvR === 2 ? { fill: 'amber', alpha: 0.3 } : {}) });
      // 출발선과 지금 닿는 선(옆면 위의 같은 자리)
      if (!C.problem) {
        D.line(v3(xs, -ru, -hu / 2), v3(xs, -ru, hu / 2), 'amber', 4);
        const phi = -PI / 2 - (xc - xs) / ru, nrm = v3(Math.cos(phi), Math.sin(phi), 0), pa = add3(v3(xc, 0, -hu / 2), mul3(nrm, ru)), pb = add3(v3(xc, 0, hu / 2), mul3(nrm, ru));
        D.line(pa, pb, 'amber', 4, { dash: dot3(nrm, D.vw) > 0 ? undefined : [6, 5] });
        D.dot(add3(v3(xc, 0, hu / 2), mul3(nrm, ru)), 'amber', 5);
      }
      // 반지름·높이
      const fc = v3(xc, 0, hu / 2);
      D.line(fc, add3(fc, v3(ru, 0, 0)), 'ink', 2.4);
      D.dot(fc, 'ink', 3.5);
      D.tag(add3(fc, v3(ru * 0.5, 0, 0)), `r=${r}`, { size: 14, dy: -11 });
      D.line(v3(xe + (C.problem ? ru : 0), -ru, -hu / 2), v3(xe + (C.problem ? ru : 0), -ru, hu / 2), 'amber', 3);
      D.elabel(v3(xe + (C.problem ? ru : 0), -ru, -hu / 2), v3(xe + (C.problem ? ru : 0), -ru, hu / 2), `h=${h}`, { side: { x: 1, y: 0 }, color: 'amber', gap: 8 });
      if (!C.problem) {
        const done = t > 0.985;
        D.label(v3((xs + xc) / 2, -ru, hu / 2), done ? `옆면의 가로 2πr = ${plainVal(M.per)}` : t > 0.02 ? `한 바퀴의 ${Math.round(t * 100)}%` : '', { dir: { x: 0, y: 1 }, gap: 10, color: 'amber', size: 15 });
        if (row) drawTiles(D, row, 0, bb.y1 + 0.9);
      }
    };
    return {
      id: 'sv1-3', title: '원기둥 굴리기', short: '원기둥 굴리기',
      question: '원기둥을 한 바퀴 굴리면 옆면이 어떤 모양으로 펼쳐질까? 가로의 길이는 얼마일까?',
      anim: { key: 'sT3', dur: 6, label: '굴려 보기' }, cam0: { yaw: 22, pitch: 13 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: () => ['sR3', 'sH3', 'sT3'],
      init: (s) => { s.sR3 = 3; s.sH3 = 5; s.sT3 = 0; },
      reroll: (s) => { s.sR3 = rint(1, 6); s.sH3 = rint(2, 10); s.sT3 = 0; },
      model, draw,
      check: (s) => { const M = model(s); return { ans: 2 * PI * M.r * M.r + 2 * PI * M.r * M.h, model: vnum(M.tot) }; },
      steps: (M) => [
        `밑면은 반지름 $${M.r}$인 원이 2개예요. 밑넓이 $\\pi\\times${M.r}^2=${tx(M.S)}$, 2개이면 $${tx(M.S2)}\\,\\mathrm{cm}^2$예요.`,
        `한 바퀴 굴러 간 길이는 원의 둘레 $2\\pi\\times${M.r}=${tx(M.per)}$예요. 옆면은 가로 $${tx(M.per)}$, 세로 $${M.h}$인 직사각형이므로 옆넓이는 $${tx(M.per)}\\times${M.h}=${tx(M.L)}\\,\\mathrm{cm}^2$예요.`,
        `(겉넓이) $=${tx(M.S2)}+${tx(M.L)}=${tx(M.tot)}\\,\\mathrm{cm}^2$ &nbsp;($=2\\pi r(r+h)$)`
      ],
      view: (M) => ({
        guide: `<b>굴러 가기</b> 막대를 끌거나 ▶를 눌러 보세요. 노란 선이 바닥에 한 바퀴 닿아 ${span('green', '옆면')}이 펼쳐져요. 아래 줄은 전개도 조각(${span('sky', '밑면 2개')} + ${span('green', '옆면')})이에요.`,
        readouts: [
          rd('밑넓이 πr²', plainVal(M.S) + ' cm²', 'sky'),
          rd('옆면의 가로 2πr', plainVal(M.per) + ' cm', 'amber', '원의 둘레'),
          rd('옆넓이 2πr×h', plainVal(M.L) + ' cm²', 'green'),
          rd('겉넓이', plainVal(M.tot) + ' cm²', 'amber', `2πr(r+h) = 2π×${M.r}×${M.r + M.h}`)
        ],
        formula: `<p>(겉넓이) $=2\\times\\pi r^2+2\\pi r\\times h=2\\pi r(r+h)$</p>`,
        rule: '원기둥의 옆면은 가로 2πr, 세로 h인 직사각형',
        notes: notes('옆면의 가로는 <b>지름이 아니라 원의 둘레 $2\\pi r$</b>예요.', '밑면은 2개이므로 $\\pi r^2$을 두 번 더해요.', '반지름이 아니라 지름이 주어지면 반으로 나눈 뒤 계산해요.')
      }),
      prob: (M) => {
        const wrongs = [
          [vadd(M.S, M.L), '밑면은 위·아래 2개예요.'],
          [M.L, '옆넓이만 구했어요. 밑넓이 2개도 더해야 해요.'],
          [vmul(M.S, M.h), '부피 $\\pi r^2h$를 구했어요.'],
          [vadd(M.S2, vmul(V(0, M.r), M.h)), '옆면의 가로는 $2\\pi r$이에요. $\\pi r$만 썼어요.'],
          [vadd(vmul(V(0, 2 * M.r), 1), M.L), '밑넓이는 $\\pi r^2$이에요. $2\\pi r$(둘레)를 밑넓이로 썼어요.']
        ];
        return { tag: '원기둥의 겉넓이', key: `${M.r}|${M.h}`, stem: `그림과 같이 밑면의 반지름이 $${M.r}\\,\\mathrm{cm}$이고 높이가 $${M.h}\\,\\mathrm{cm}$인 원기둥의 겉넓이는?`, choices: mkV(M.tot, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv1-4 부피 V = Sh (판 쌓기) */
  function sv14() {
    const model = (s) => {
      const shape = SHAPE_ORDER.includes(s.svShape) ? s.svShape : 'rect', bm = baseModel(shape, s), h = clamp(Math.round(s.sH), 2, 8);
      return { shape, bm, h, S: bm.area, vol: vmul(bm.area, h), L: vmul(bm.per, h) };
    };
    // 밑면이 아래: 얇은 판(두께 1cm)을 위로 쌓습니다. 판은 왼쪽에서 오른쪽으로(가로로) 들어와 제자리에 놓여요.
    const slab = (bm, sc, y0, y1) => (bm.shape === 'circ' ? revolveMesh([[0, y0], [bm.r * sc, y0], [bm.r * sc, y1], [0, y1]], { N: 32, tags: ['bot', 'side', 'top'] }) : prismMesh(scaledPoly(bm, sc), y0, y1));
    const draw = (b, s, M, C) => {
      const { bm, h } = M, sc = Math.min(3.0 / Math.max(bm.ex, bm.ez), 5.0 / h), t = C.problem ? 1 : C.t, D = scene3(b, s, C);
      const ext = Math.max(bm.ex, bm.ez) * sc, H = h * sc, y0 = -H / 2, cnt = t * h, slide = ext * 1.7 + 0.6, st = C.step;
      const plates = [];
      for (let k = 0; k < h; k++) {
        const loc = clamp(cnt - k, 0, 1);
        if (loc <= 0 && !C.problem) continue;
        const off = -(1 - ease(loc)) * slide; // 왼쪽에서 오른쪽으로 들어옴
        plates.push({ k, loc, mesh: xfMesh(slab(bm, sc, y0 + k * sc, y0 + (k + 1) * sc), G.shiftT(D.hx(off))), fly: loc < 1 });
      }
      const nDone = plates.filter((p) => p.loc >= 1).length;
      const pts = cube8(v3(0, 0, 0), Math.max(ext / 2, H / 2)).map((p) => v3(p.x, p.y, p.z)).concat([add3(v3(-ext / 2, y0, 0), D.hx(-slide))]);
      D.fit(pts, [], { l: 40, r: 70, t: 36, b: 40 });
      const hlS = !C.review ? 1 : st === 1 ? 2 : 1, hlH = !C.review ? 1 : st === 2 ? 2 : 1;
      if (!C.problem) D.body({ mesh: prismMesh(bm.shape === 'circ' ? G.circleBase(bm.r * sc, 32) : scaledPoly(bm, sc), y0, y0 + H), fill: null, edge: 'muted', edgeW: 1.6, hiddenAlpha: 0.5, hidden: true });
      plates.forEach((p) => D.body({ mesh: p.mesh, fill: hlH === 2 ? 'amber' : 'sky', alpha: p.fly ? 0.34 : 0.2, edge: 'ink', edgeW: 2.2, faceStyle: (f) => (p.k === 0 && f.tag === 'bot' ? {} : f.tag === 'top' && p.k === h - 1 && hlS === 2 ? { fill: 'amber', alpha: 0.5 } : {}) }));
      // 밑넓이 라벨(맨 위 판의 윗면) · 길이
      const topY = y0 + H;
      if (!C.problem) { if (nDone === h || t >= 0.999) D.tag(v3(0, topY, 0), `S=${plainVal(M.S)}`, { size: 15, color: 'ink' }); }
      else D.tag(v3(0, topY, 0), bm.shape === 'circ' ? `r=${bm.r}` : bm.shape === 'rect' ? `${bm.sides[0]}×${bm.sides[1]}` : bm.shape === 'tri' ? `${bm.sides[0]}·${bm.sides[2]}·${bm.sides[1]}` : `${bm.u}, ${bm.wb}`, { size: 14 });
      // 높이 h: 오른쪽 앞 모서리를 따라 (쌓인 만큼)
      const nShow = C.problem ? h : nDone;
      if (nShow > 0) {
        const xr = bm.shape === 'circ' ? ext / 2 : ext / 2, p0 = v3(xr, y0, ext / 2), p1 = v3(xr, y0 + nShow * sc, ext / 2);
        D.line(p0, p1, 'amber', 4);
        D.elabel(p0, p1, `높이 h = ${nShow}`, { side: { x: 1, y: 0 }, color: 'amber', size: 15, gap: 10 });
      }
      if (!C.problem) plates.forEach((p) => { if (p.loc >= 1 && h <= 8) D.tag(v3(0, y0 + (p.k + 0.5) * sc, ext / 2 * (bm.shape === 'circ' ? 1 : 1)), String(p.k + 1), { size: 12, color: 'ink' }); });
    };
    return {
      id: 'sv1-4', title: '기둥의 부피 V=Sh', short: '기둥의 부피',
      question: '밑면과 같은 모양의 얇은 판을 한 장씩 쌓으면 기둥이 만들어져. 판이 쌓일수록 부피는 어떻게 늘어날까?',
      anim: { key: 'sT4', dur: 6, label: '판 쌓기', start: 1 }, cam0: { yaw: 28, pitch: 22 }, stepT: (st) => 1, thumbT: 1, problemT: 1,
      ctl: (s) => ({ rect: ['sA', 'sB'], tri: ['sK'], trap: ['sU'], circ: ['sR'] }[s.svShape || 'rect'].concat(['sH', 'sT4'])),
      presets: () => SHAPE_ORDER.map((k, i) => ({ group: i === 0 ? '밑면 모양' : '', label: SHAPE_LABEL[k], apply: (st) => { st.svShape = k; }, on: (st) => (st.svShape || 'rect') === k })),
      init: (s) => { s.svShape = 'rect'; s.sA = 4; s.sB = 3; s.sK = 1; s.sU = 3; s.sR = 3; s.sH = 5; s.sT4 = 1; },
      reroll: (s) => {
        s.svShape = pick(SHAPE_ORDER, s.svShape);
        s.sA = rint(2, 7); s.sB = pick([2, 3, 4, 5, 6, 7], s.sA); s.sK = rint(1, 2); s.sU = rint(1, 5); s.sR = rint(2, 5); s.sH = rint(2, 8); s.sT4 = 1;
      },
      model, draw,
      check: (s) => {
        const M = model(s), poly = M.shape === 'circ' ? circleBase(M.bm.r, 4000) : M.bm.poly;
        let A2 = 0;
        poly.forEach((p, i) => { const q = poly[(i + 1) % poly.length]; A2 += p[0] * q[1] - q[0] * p[1]; });
        return { ans: Math.abs(A2) / 2 * M.h, model: vnum(M.vol) };
      },
      steps: (M) => [
        `밑면은 ${M.bm.name}이에요. 밑넓이 $S=${M.bm.areaTex}=${tx(M.S)}\\,\\mathrm{cm}^2$예요. (판 한 장의 부피가 $S\\times1$)`,
        `높이가 $h=${M.h}$이면 판이 $${M.h}$장 쌓여요. 판 한 장의 부피가 $${tx(M.S)}\\times1$이므로 $${M.h}$장이면 $${tx(M.S)}\\times${M.h}$예요.`,
        `(부피) $=S\\times h=${tx(M.S)}\\times${M.h}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
      ],
      view: (M) => ({
        guide: `<b>판 쌓기</b> 막대를 끌거나 ▶를 눌러 보세요. 같은 모양의 판이 왼쪽에서 가로로 들어와 ${span('sky', '높이')}만큼 위로 쌓여요. 밑면 모양 칩과 길이 막대로 바꿔 보세요.`,
        readouts: [
          rd('밑넓이 S', plainVal(M.S) + ' cm²', 'sky', M.bm.areaTex.replace(/\\frac\{1\}\{2\}/g, '½').replace(/\\times/g, '×').replace(/\\pi/g, 'π')),
          rd('높이 h', M.h + ' cm', 'amber', `판 ${M.h}장`),
          rd('부피 S×h', plainVal(M.vol) + ' cm³', 'green', `${plainVal(M.S)} × ${M.h}`)
        ],
        formula: `<p>(기둥의 부피) $V=S\\times h$ &nbsp; ($S$ 밑넓이, $h$ 높이)</p>`,
        rule: '기둥의 부피 = (밑넓이) × (높이)',
        notes: notes('부피는 <b>밑넓이를 한 번만</b> 곱해요. 밑면이 2개라고 2를 곱하지 않아요(겉넓이와 달라요).', '밑넓이는 밑면의 모양(직사각형·삼각형·사다리꼴·원)에 맞게 구해요.')
      }),
      prob: (M) => {
        const wrongs = [
          [vadd(M.S, V(M.h)), '부피는 밑넓이에 높이를 더하는 것이 아니라 곱해요.'],
          [vmul(M.vol, 1 / 3), '$\\frac{1}{3}$을 곱하는 것은 뿔의 부피예요. 기둥은 $S\\times h$예요.'],
          [vmul(M.vol, 2), '밑면이 2개라고 2를 곱하지 않아요.'],
          [M.L, '옆넓이를 구했어요. 부피는 밑넓이×높이예요.'],
          [vadd(vmul(M.S, 2), M.L), '겉넓이를 구했어요. 부피는 밑넓이×높이예요.']
        ];
        const bm = M.bm;
        const stem = { rect: `그림과 같이 밑면의 가로가 $${bm.sides ? bm.sides[0] : ''}\\,\\mathrm{cm}$, 세로가 $${bm.sides ? bm.sides[1] : ''}\\,\\mathrm{cm}$이고 높이가 $${M.h}\\,\\mathrm{cm}$인 직육면체의 부피는?`,
          tri: `그림과 같이 밑면이 세 변의 길이가 $${bm.sides ? bm.sides.join('\\,\\mathrm{cm},\\ ') : ''}\\,\\mathrm{cm}$인 직각삼각형이고 높이가 $${M.h}\\,\\mathrm{cm}$인 삼각기둥의 부피는? (직각을 낀 두 변은 $${bm.legs ? bm.legs.join('\\,\\mathrm{cm},\\ ') : ''}\\,\\mathrm{cm}$)`,
          trap: `그림과 같이 밑면이 윗변 $${bm.u}\\,\\mathrm{cm}$, 아랫변 $${bm.wb}\\,\\mathrm{cm}$, 높이 $4\\,\\mathrm{cm}$인 사다리꼴이고 기둥의 높이가 $${M.h}\\,\\mathrm{cm}$인 사각기둥의 부피는?`,
          circ: `그림과 같이 밑면의 반지름이 $${bm.r}\\,\\mathrm{cm}$이고 높이가 $${M.h}\\,\\mathrm{cm}$인 원기둥의 부피는?` }[M.shape];
        return { tag: '기둥의 부피', key: `${M.shape}|${bm.given}|${M.h}`, stem, choices: mkV(M.vol, wrongs, { dim: 3 }) };
      }
    };
  }

  /* ================================================================ sv1-5 기둥 종합 (직사각형 + 반원 밑면) */
  function sv15() {
    const model = (s) => {
      const w = clamp(Math.round(s.sW), 2, 8), r = clamp(Math.round(s.sRr), 1, 4), h = clamp(Math.round(s.sH5), 2, 8), mode = s.svMode === 'vol' ? 'vol' : 'surf';
      const S = V(2 * w * r, (r * r) / 2), Pm = V(2 * w + 2 * r, r), L = vmul(Pm, h), S2 = vmul(S, 2), tot = vadd(S2, L), vol = vmul(S, h);
      return { w, r, h, mode, S, P: Pm, L, S2, tot, vol, ans: mode === 'vol' ? vol : tot };
    };
    const polyOf = (w, r) => {
      const poly = [[0, -r], [w, -r]], sm = [false, false], N = 14;
      for (let i = 1; i < N; i++) { const a = -PI / 2 + (PI * i) / N; poly.push([w + r * Math.cos(a), r * Math.sin(a)]); sm.push(true); }
      poly.push([w, r]); sm.push(false); poly.push([0, r]); sm.push(false);
      // 아치 모양에서 호의 양 끝(w,-r),(w,r)도 곡면과 평면의 경계(각진 꼭짓점)
      return { poly, sm };
    };
    const draw = (b, s, M, C) => {
      const { w, r, h } = M, sc = 5 / Math.max(w + r, 2 * r, h), D = scene3(b, s, C);
      const { poly, sm } = polyOf(w * sc, r * sc), cxm = ((w + r) * sc) / 2, hu = h * sc;
      const pc = poly.map((p) => [p[0] - cxm, p[1]]), ctr = v3(0, hu / 2, 0);
      const mesh = prismMesh(pc, 0, hu, { smooth: sm, ctr });
      const st = C.step;
      const lvB = !C.review ? 1 : st <= 1 ? 2 : 1, lvL = !C.review ? 1 : st === 2 ? 2 : 1;
      const pts = []; pc.forEach((p) => { pts.push(v3(p[0], 0, p[1])); pts.push(v3(p[0], hu, p[1])); });
      const bb = G.bboxOf(pts.map(D.P));
      const row = C.problem ? null : layoutTiles([
        { w: w + r, h: 2 * r, shape: 'poly', pts: poly.map((p) => [(p[0] / sc) / (w + r), (p[1] / sc + r) / (2 * r)]), fill: 'sky', label: plainVal(M.S), cap: '밑면 S ×2', count: 2, hl: M.mode === 'vol' ? (st === 1 ? 2 : 1) : lvB },
        { w: Number(vnum(M.P).toFixed(3)), h: h, shape: 'rect', fill: 'green', label: plainVal(M.L), cap: '옆면 P×h', hl: M.mode === 'vol' ? 0 : lvL }
      ], 6, 2.1, 0.7);
      D.fit(pts, row ? [{ x: -row.total / 2, y: bb.y1 + 0.8 }, { x: row.total / 2, y: bb.y1 + 0.8 + row.height + 0.9 }] : [], { l: 36, r: 36, t: 36, b: 36 });
      D.body({ mesh, fill: 'sky', alpha: 0.2, edge: 'ink', faceStyle: (f) => ((f.tag === 'top' || f.tag === 'bot') && (M.mode === 'vol' || lvB === 2) ? { fill: 'amber', alpha: 0.4 } : f.tag === 'side' && M.mode === 'surf' && lvL === 2 ? { fill: 'amber', alpha: 0.34 } : f.tag === 'side' ? { fill: 'green', alpha: 0.2 } : {}) });
      // 길이 표시 (윗면 위에)
      const topP = (i) => v3(pc[i][0], hu, pc[i][1]);
      D.elabel(topP(0), topP(1), `w=${w}`, { side: { x: 0, y: 1 }, size: 15, gap: 6 });
      D.elabel(topP(pc.length - 1), topP(0), `${2 * r}`, { side: { x: -1, y: 0 }, size: 15, gap: 6 });
      const O = v3(w * sc - cxm, hu, 0), top = poly.length - 1;
      void top;
      D.line(O, v3(O.x + r * sc, hu, 0), 'amber', 2.4);
      D.dot(O, 'ink', 3.5);
      D.tag(v3(O.x + r * sc * 0.5, hu, 0), `r=${r}`, { size: 14, dy: -10, color: 'amber' });
      D.elabel(v3(pc[0][0], 0, pc[0][1]), v3(pc[0][0], hu, pc[0][1]), `h=${h}`, { side: { x: -1, y: 0 }, color: 'amber', gap: 8 });
      if (row) drawTiles(D, row, 0, bb.y1 + 0.8);
    };
    return {
      id: 'sv1-5', title: '기둥 종합 문제', short: '기둥 종합',
      question: '밑면이 직사각형에 반원을 붙인 모양이어도 같은 방법으로 풀 수 있을까? 겉넓이와 부피를 각각 구해 보자.',
      cam0: { yaw: 28, pitch: 22 }, problemT: 1,
      ctl: () => ['sW', 'sRr', 'sH5'],
      presets: () => [{ group: '구하는 것', label: '겉넓이', apply: (st) => { st.svMode = 'surf'; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st) => { st.svMode = 'vol'; }, on: (st) => st.svMode === 'vol' }],
      init: (s) => { s.sW = 4; s.sRr = 2; s.sH5 = 5; s.svMode = 'surf'; },
      reroll: (s) => { s.sW = rint(2, 8); s.sRr = rint(1, 4); s.sH5 = rint(2, 8); s.svMode = pick(['surf', 'vol'], s.svMode); },
      model, draw,
      check: (s) => {
        const M = model(s), N = 4000, w = M.w, r = M.r;
        let per = 2 * w + 2 * r, A = 2 * w * r;
        for (let i = 0; i < N; i++) { const a0 = -PI / 2 + (PI * i) / N, a1 = -PI / 2 + (PI * (i + 1)) / N; per += Math.hypot(r * (Math.cos(a1) - Math.cos(a0)), r * (Math.sin(a1) - Math.sin(a0))); A += 0.5 * r * r * Math.sin(a1 - a0); }
        return { ans: M.mode === 'vol' ? A * M.h : 2 * A + per * M.h, model: vnum(M.ans) };
      },
      steps: (M) => M.mode === 'vol' ? [
        `밑면은 직사각형($${M.w}\\times${2 * M.r}$)과 반원(반지름 $${M.r}$)을 붙인 모양이에요. 직사각형의 넓이는 $${M.w}\\times${2 * M.r}=${2 * M.w * M.r}$예요.`,
        `반원의 넓이는 $\\frac{1}{2}\\times\\pi\\times${M.r}^2=${tx(V(0, M.r * M.r / 2))}$이므로 밑넓이 $S=${tx(M.S)}$예요.`,
        `(부피) $=S\\times h=${tx(M.S)}\\times${M.h}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
      ] : [
        `밑넓이: 직사각형 $${2 * M.w * M.r}$ + 반원 $${tx(V(0, M.r * M.r / 2))}$ $=${tx(M.S)}$이고 밑면이 2개이므로 $2S=${tx(M.S2)}\\,\\mathrm{cm}^2$예요.`,
        `밑면의 둘레(붙인 변은 뺌): $${M.w}+${M.w}+${2 * M.r}+\\pi\\times${M.r}=${tx(M.P)}$. 옆넓이 $=${tx(M.P)}\\times${M.h}=${tx(M.L)}\\,\\mathrm{cm}^2$예요.`,
        `(겉넓이) $=${tx(M.S2)}+${tx(M.L)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M) => ({
        guide: `<b>길이 막대</b>로 값을 바꾸고 위 칩에서 <b>겉넓이·부피</b>를 골라 보세요. 아래 줄은 전개도 조각(밑면 2개 + 옆면)이에요. 반원의 호 $\\pi r$가 둘레에 들어가는 것에 주의해요.`,
        readouts: [
          rd('밑넓이 S', plainVal(M.S) + ' cm²', 'sky', '직사각형 + 반원'),
          rd('밑면의 둘레 P', plainVal(M.P) + ' cm', 'amber', '2w + 2r + πr'),
          rd('겉넓이', plainVal(M.tot) + ' cm²', M.mode === 'surf' ? 'green' : 'muted'),
          rd('부피', plainVal(M.vol) + ' cm³', M.mode === 'vol' ? 'green' : 'muted')
        ],
        formula: `<p>(겉넓이) $=2S+P\\times h$ &nbsp;,&nbsp; (부피) $=S\\times h$</p>`,
        rule: '밑면이 복잡해도: 밑넓이 S와 둘레 P만 구하면 기둥은 모두 같은 식',
        notes: notes('둘레 $P$에는 붙인 변(반원의 지름)이 들어가지 않아요. 바깥 테두리만 세요: $2w+2r+\\pi r$.', '반원의 넓이는 원의 <b>절반</b> $\\frac{1}{2}\\pi r^2$예요.')
      }),
      prob: (M) => {
        const half = V(0, M.r * M.r / 2);
        let wrongs, stem;
        if (M.mode === 'vol') {
          wrongs = [
            [vmul(V(2 * M.w * M.r), M.h), '반원 부분의 넓이를 빠뜨렸어요.'],
            [vmul(V(2 * M.w * M.r, M.r * M.r), M.h), '반원의 넓이는 원의 절반 $\\frac{1}{2}\\pi r^2$이에요. 원 전체를 더했어요.'],
            [M.S, '높이를 곱하지 않았어요.'],
            [vmul(M.vol, 2), '부피에는 2를 곱하지 않아요.'],
            [vadd(M.S, V(M.h)), '밑넓이에 높이를 더하지 않고 곱해요.']
          ];
          stem = `그림과 같이 밑면이 직사각형($${M.w}\\,\\mathrm{cm}\\times${2 * M.r}\\,\\mathrm{cm}$)에 반원(반지름 $${M.r}\\,\\mathrm{cm}$)을 붙인 모양이고 높이가 $${M.h}\\,\\mathrm{cm}$인 기둥의 부피는?`;
        } else {
          wrongs = [
            [vadd(M.S2, vmul(V(2 * M.w + 2 * M.r), M.h)), '옆면의 가로에 반원의 호 $\\pi r$를 빠뜨렸어요.'],
            [vadd(M.S2, vmul(V(2 * M.w + 4 * M.r, M.r), M.h)), '붙인 변(반원의 지름)은 겉면이 아니므로 둘레에 들어가지 않아요.'],
            [vadd(M.S, M.L), '밑면은 2개예요.'],
            [vadd(vmul(vadd(V(2 * M.w * M.r), V(0, M.r * M.r)), 2), M.L), '반원의 넓이는 원의 절반이에요.'],
            [M.vol, '부피를 구했어요.']
          ];
          void half;
          stem = `그림과 같이 밑면이 직사각형($${M.w}\\,\\mathrm{cm}\\times${2 * M.r}\\,\\mathrm{cm}$)에 반원(반지름 $${M.r}\\,\\mathrm{cm}$)을 붙인 모양이고 높이가 $${M.h}\\,\\mathrm{cm}$인 기둥의 겉넓이는?`;
        }
        return { tag: M.mode === 'vol' ? '기둥의 부피 (종합)' : '기둥의 겉넓이 (종합·킬러)', key: `${M.mode}|${M.w}|${M.r}|${M.h}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  G.register(10, 't1', '① 기둥', '기둥', PARAMS, [sv11(), sv12(), sv13(), sv14(), sv15()]);
})();
