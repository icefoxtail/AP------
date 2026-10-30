/* ==========================================================================
   원과 부채꼴 · "중심각과 호·넓이" 탭 (basic.js, order 15)
   교재 캡처 16문항(① 원 알아보기 2 · ② 기본형 10 · ③ 길이·둘레 4)의 '그림'을 장면마다 하나씩 옮기고,
   그림의 길이·각을 모두 막대나 손잡이로 조절할 수 있게 만든 장면 모음입니다. 맨 끝에 확장 2장면.
   - 탐구 · 정리 · 문제가 같은 값으로 연결됩니다. 막대·손잡이를 움직이면 그림 속 길이·각, 정리 단계의 식과 글,
     문제의 수치·정답·보기가 함께 다시 계산됩니다(처음 값은 교재 수치, "문제 조건으로 그림 맞추기"로 되돌림).
   - 색의 약속: 주어진 값 = 노랑, 구하는 값 = 분홍, 중간 결과 = 초록, 일반 도형 = 하늘.
   - 움직임은 가로 이동과 제자리 회전만 씁니다(확장 1의 모으기).
   - 자기완결 모듈: window.APL_CS_GROUPS 에 한 묶음만 더합니다. 장면별 값은 셸 상태에 'b<장면번호>_' 이름표를 붙여 보관하고,
     장면에 들어갈 때 lab.params 에 막대 정의를 등록합니다(페이지 쪽 params 에 적을 필요 없음).
   ========================================================================== */
(function () {
  'use strict';
  const D2R = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mod = (a, n) => ((a % n) + n) % n;
  const snap = (v, st) => Math.round(v / st) * st;
  const deg = (r) => r / D2R;

  /* ---------- 수 표기 (분수·π) ---------- */
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  function rat(x) {
    if (Math.abs(x - Math.round(x)) < 1e-9) return [Math.round(x), 1];
    for (let d = 2; d <= 1440; d++) {
      const n = x * d;
      if (Math.abs(n - Math.round(n)) < 1e-7) { const nn = Math.round(n), g = gcd(nn, d); return [nn / g, d / g]; }
    }
    return [x, 0];
  }
  const decOK = (d) => { let m = d; while (m % 2 === 0) m /= 2; while (m % 5 === 0) m /= 5; return m === 1; };
  function num(x, tex) {
    const [n, d] = rat(x);
    if (d === 0) return String(+x.toFixed(2));
    if (d === 1) return String(n);
    if (decOK(d)) return String(+(n / d).toFixed(4));
    return tex ? `\\frac{${n}}{${d}}` : `${n}/${d}`;
  }
  function piS(x) { // 캔버스·일반 글자용: 13π/2
    const [n, d] = rat(x);
    if (d === 0) return `${+x.toFixed(2)}π`;
    const a = n === 1 ? 'π' : `${n}π`;
    return d === 1 ? a : `${a}/${d}`;
  }
  function piT(x) { // 수식($…$)용
    const [n, d] = rat(x);
    if (d === 0) return `${+x.toFixed(2)}\\pi`;
    if (d === 1) return n === 1 ? '\\pi' : `${n}\\pi`;
    return n === 1 ? `\\frac{\\pi}{${d}}` : `\\frac{${n}}{${d}}\\pi`;
  }
  const frS = (x) => { const [n, d] = rat(x); return d === 0 ? String(+x.toFixed(3)) : d === 1 ? String(n) : `${n}/${d}`; };
  const frT = (x) => { const [n, d] = rat(x); return d === 0 ? String(+x.toFixed(3)) : d === 1 ? String(n) : `\\frac{${n}}{${d}}`; };
  const T = (s) => '$' + s + '$';
  const d1 = (x) => String(+x.toFixed(1));
  const d2 = (x) => String(+x.toFixed(2));

  /* ---------- 문제 보기(5지선다): 교재처럼 답을 포함한 등차수열 ---------- */
  const CIRC = ['①', '②', '③', '④', '⑤'];
  function mkChoices(ans, step, pos, f) {
    let p = pos;
    while (p > 0 && ans - p * step <= 1e-9) p--;
    const items = [];
    for (let i = 0; i < 5; i++) items.push(f(ans + (i - p) * step));
    return { items, idx: p };
  }
  const chHtml = (items, one) => `<div class="cs-ch${one ? ' one' : ''}">` + items.map((t, i) => `<span>${CIRC[i]} ${t}</span>`).join('') + '</div>';
  const qHtml = (stem, items, one) => `<p class="cs-q">${stem}</p>` + chHtml(items, one);
  const ansOf = (c) => `${CIRC[c.idx]} ${c.items[c.idx]}`;

  (function css() {
    if (document.getElementById('cs-basic-css')) return;
    const st = document.createElement('style');
    st.id = 'cs-basic-css';
    st.textContent = '.cs-q{margin:0 0 4px}.cs-ch{display:grid;grid-template-columns:repeat(auto-fill,minmax(8.2em,1fr));gap:4px 14px;margin-top:10px}.cs-ch.one{grid-template-columns:1fr}.cs-ch span{white-space:nowrap}.cs-ch.one span{white-space:normal}.cs-w{margin:0 0 7px;line-height:1.8}.cs-w b{color:var(--m-amber)}';
    document.head.append(st);
  })();

  /* ---------- 그리기 도우미: 수학 좌표(y 위쪽, 각도 반시계)로 쓰면 보드 종류에 맞게 바꿔 줍니다 ---------- */
  function G(b) {
    const F = b.kind === 'figure';
    const Y = F ? -1 : 1;
    const P = (p) => [p[0], Y * p[1]];
    const pol = (c, r, d) => [c[0] + r * Math.cos(d * D2R), c[1] + r * Math.sin(d * D2R)];
    const arcPts = (c, r, d0, d1, n) => {
      const out = [];
      const m = n || Math.max(6, Math.ceil(Math.abs(d1 - d0) / 3));
      for (let i = 0; i <= m; i++) out.push(pol(c, r, d0 + ((d1 - d0) * i) / m));
      return out;
    };
    const g = {
      b, pol, arcPts,
      reserve(...pts) { pts.forEach((p) => { const q = P(p); b.toS(q[0], q[1]); }); return g; },
      seg(p, q, o) { b.seg(P(p), P(q), o); return g; },
      path(pts, o) { b.path(pts.map(P), o); return g; },
      poly(pts, o) { b.poly(pts.map(P), o); return g; },
      circle(c, r, o) { b.circle(P(c), r, o); return g; },
      arc(c, r, d0, d1, o = {}) {
        if (F) b.arc(P(c), r, -d0 * D2R, -d1 * D2R, { ...o, ccw: true });
        else b.arc(c, r, d0 * D2R, d1 * D2R, o);
        return g;
      },
      sector(c, r, d0, d1, o = {}) { return g.arc(c, r, d0, d1, { ...o, sector: true }); },
      dot(p, o = {}) {
        const oo = { ...o };
        if (b.thumb) oo.label = undefined; // 모든 장면 미리보기는 글자 없이 그림만
        if (oo.toward) oo.toward = P(oo.toward);
        b.point(P(p), oo);
        return g;
      },
      text(p, str, o = {}) {
        if (b.thumb) return g;
        b.text(P(p), str, { size: 15, weight: 800, baseline: 'middle', ...o });
        return g;
      },
      /** 점 p의 바깥쪽(각도 deg 방향)으로 화면 off 픽셀 떨어진 글자 */
      out(p, deg_, str, o = {}, off = 22) {
        return g.text(p, str, { dx: Math.cos(deg_ * D2R) * off, dy: -Math.sin(deg_ * D2R) * off, ...o });
      },
      tick(p, q, o) { b.ticks(P(p), P(q), o); return g; },
      right(v, p1, p2, o) { b.right(P(v), P(p1), P(p2), o); return g; },
      /** 각 표시: d0에서 d1까지(반시계) 부채꼴 쐐기 + 호 + 글자 */
      ang(c, d0, d1, o = {}) {
        const r = o.r || 22, col = o.color || 'amber';
        g.arc(c, r, d0, d1, { sector: true, fill: col, fillAlpha: o.fa == null ? 0.3 : o.fa, stroke: false, ref: o.ref, part: o.part });
        for (let i = 0; i < (o.rings || 1); i++) g.arc(c, r - i * 4, d0, d1, { color: col, width: o.width || 2.6, ref: o.ref, part: o.part });
        if (o.label != null) {
          const m = o.mid != null ? o.mid : (d0 + d1) / 2;
          g.text(g.pol(c, o.lr || r * 1.75, m), o.label, { color: col, size: o.size || 15, ref: o.ref, part: o.part, dx: o.dx || 0, dy: o.dy || 0 });
        }
        return g;
      },
      handle(id, p, o = {}) {
        const oo = { color: 'amber', ...o };
        if (oo.toward) oo.toward = P(oo.toward);
        if (o.drag) oo.drag = (w) => o.drag({ x: w.x, y: Y * w.y });
        b.handle(id, P(p), oo);
        return g;
      }
    };
    return g;
  }
  /** 중심 c에서 w까지의 방향(도, 수학 좌표) */
  const dirOf = (c, w) => deg(Math.atan2(w.y - c[1], w.x - c[0]));

  /* ---------- 장면 공장 ---------- */
  let LAB = null;
  const SCENES = [];

  function build(spec) {
    const pre = 'b' + spec.id + '_';
    const own = new Set(Object.keys(spec.params).concat(Object.keys(spec.state || {})));
    const defs = {};
    Object.entries(spec.state || {}).forEach(([k, v]) => { defs[k] = v; });
    Object.entries(spec.params).forEach(([k, p]) => { defs[k] = p.value; });
    // 아직 들어가 보지 않은 장면의 값은 기본값으로 읽습니다(모든 장면 보기가 단계 수를 셀 때 필요)
    const sv = (s) => new Proxy(s, {
      get: (t, k) => {
        if (typeof k === 'string' && own.has(k)) { const v = t[pre + k]; return v === undefined ? defs[k] : v; }
        return t[k];
      },
      set: (t, k, v) => { t[typeof k === 'string' && own.has(k) ? pre + k : k] = v; return true; }
    });
    const P = {};
    Object.entries(spec.params).forEach(([k, p]) => {
      P[pre + k] = {
        value: p.value, min: p.min, max: p.max, step: p.step, color: p.color || 'amber', label: p.label || k, hint: p.hint,
        format: p.format ? (v, s) => p.format(v, sv(s)) : undefined,
        onInput: (s, lab) => { if (p.onInput) p.onInput(sv(s), lab); }
      };
    });
    const modeOf = (lab) => (lab && lab.tab) || 'explore';
    const boxFocus = () => {
      const bx = spec.box || { x: [-130, 130], y: [-130, 130] };
      const fig = !LAB || LAB.board.kind === 'figure';
      return { x: bx.x.slice(), y: fig ? [-bx.y[1], -bx.y[0]] : bx.y.slice() };
    };
    const sc = {
      id: spec.id, title: spec.title, short: spec.short || spec.title,
      question: spec.question,
      guide: (s) => (typeof spec.guide === 'function' ? spec.guide(sv(s)) : spec.guide),
      notesTitle: '꼭 기억할 점',
      enter: (s, lab) => {
        if (lab && lab.params) {
          Object.keys(P).forEach((k) => { if (!(k in lab.params)) lab.params[k] = P[k]; });
          if (s === lab.s) LAB = lab;
        }
        const q = sv(s);
        Object.entries(spec.params).forEach(([k, p]) => { q[k] = p.value; });
        Object.entries(spec.state || {}).forEach(([k, v]) => { q[k] = v; });
        // 학생에게 공유한 링크(#s=장면&값…)로 열면 그 값 그대로 복원합니다
        if (lab && s === lab.s) {
          try {
            const hq = new URLSearchParams(location.hash.slice(1));
            if ((hq.get('s') || '').split('@')[0] === spec.id) {
              Object.entries(spec.params).forEach(([k, p]) => { const v = hq.get(pre + k); if (v != null && v !== '' && !isNaN(+v)) q[k] = clamp(+v, p.min, p.max); });
            }
          } catch (e) { /* 해시를 못 읽으면 기본값 */ }
        }
        if (spec.enter) spec.enter(q);
      },
      controls: () => (spec.controls || []).map((k) => pre + k),
      presets: () => (spec.presets || []).map((p) => ({
        label: p.label, group: p.group, color: p.color,
        apply: (s, lab) => p.apply(sv(s), lab),
        on: p.on ? (s) => p.on(sv(s)) : undefined
      })),
      actions: () => (spec.actions || []).map((a) => ({
        id: a.id, icon: a.icon, primary: a.primary, play: a.play, label: a.label,
        run: (s, lab) => a.run(sv(s), lab),
        on: a.on ? (s) => a.on(sv(s)) : undefined
      })),
      steps: (s) => spec.steps(sv(s)),
      problem: {
        tag: spec.tag || '교재 문제',
        text: (s) => spec.problem(sv(s)).text,
        answer: (s) => spec.problem(sv(s)).answer,
        snap: () => {
          const o = {};
          Object.entries(spec.params).forEach(([k, p]) => { if (!p.keep) o[pre + k] = p.value; });
          return o;
        }
      },
      focus: (s) => {
        if (LAB && s === LAB.s && LAB._measureFocus) {
          const f = LAB._measureFocus(LAB.scene);
          if (f) return f;
        }
        return boxFocus();
      },
      view: (s, lab) => {
        const q = sv(s);
        const mode = modeOf(lab);
        const v = spec.view ? spec.view(q, mode, lab) || {} : {};
        // 풀이 단계 글이 값에 따라 달라지므로, 달라졌으면 정리 탭의 단계 목록을 다시 만듭니다.
        if (lab && s === lab.s && lab.refs && lab.refs.steps) {
          const sig = spec.steps(q).join('\u0001');
          if (lab.refs.steps.__sig !== sig) {
            lab._buildReview();
            if (lab.refs.steps) lab.refs.steps.__sig = sig;
            lab._dirtyPanel = true;
          }
        }
        if (spec.work) {
          const w = spec.work(q);
          v.formula = '<div class="apl-rich">' + w.slice(0, Math.max(0, s.step | 0)).map((l) => `<p class="cs-w">${l}</p>`).join('') + '</div>';
        }
        if (spec.rule) v.rule = spec.rule(q);
        if (spec.chips) v.chips = spec.chips(q, mode, s.step | 0);
        return v;
      },
      draw: (b, s, v, lab) => {
        const q = sv(s);
        const mode = b.thumb ? 'problem' : modeOf(lab);
        const step = s.step | 0;
        if (mode === 'review' && spec.partOfStep) {
          const p = spec.partOfStep(step);
          b.emph = p ? { part: p, ref: p } : null;
        }
        spec.draw(G(b), q, mode, step, lab);
      }
    };
    if (spec.tick) sc.tick = (s, dt, lab) => spec.tick(sv(s), dt, lab);
    SCENES.push(sc);
    return sc;
  }

  const stat = (tone, text) => ({ tone, text });
  const rd = (label, value, color, note, ref, wide) => ({ label, value, color, note, ref, wide });

  /* ======================================================================
     ① 원 알아보기 — 개념 5지선다 (그림 위에서 문장을 하나씩 확인)
     ====================================================================== */
  const verdictParts = (list, colorOk) => list.map((p) => ({ id: p.id, name: p.name, value: p.ok ? '옳음' : '옳지 않음', ok: p.ok, color: p.ok ? (colorOk || 'green') : 'red' }));
  const chordLen = (r, th) => 2 * r * Math.sin((th * D2R) / 2);

  /* ---------- 11-01 원의 요소: 옳지 않은 것 ---------- */
  const T1101 = [
    { id: 1, name: '① 한 원에서 지름은 길이가 가장 긴 현이다.', ok: true },
    { id: 2, name: '② 원 위의 두 점을 이은 선분을 호라 한다.', ok: false },
    { id: 3, name: '③ 부채꼴이면서 동시에 활꼴인 도형은 반원이다.', ok: true },
    { id: 4, name: '④ 원에서 현과 호로 이루어진 도형을 활꼴이라 한다.', ok: true },
    { id: 5, name: '⑤ 원에서 두 반지름과 호로 이루어진 도형을 부채꼴이라 한다.', ok: true }
  ];
  build({
    id: '1101', title: '원의 요소 · 옳지 않은 것 찾기', short: '원의 요소 (11-01)',
    question: '원 위에 두 점을 잡으면 어떤 선과 어떤 도형이 생길까? 다섯 문장이 가리키는 부분을 그림에서 하나씩 확인해 보자.',
    guide: '점 <b>P, Q</b>를 끌어 보세요. 아래 ①~⑤를 누르면 그 문장이 가리키는 부분만 밝아지고, 맞는지 틀린지 그림 위에 나옵니다.',
    box: { x: [-125, 125], y: [-125, 125] },
    params: {
      th: { value: 120, min: 20, max: 340, step: 10, color: 'amber', label: '중심각 ∠POQ', format: (v) => v + '°' },
      pa: { value: 20, min: 0, max: 360, step: 5 },
      r: { value: 5, min: 3, max: 9, step: 1, color: 'sky', label: '반지름 r', format: (v) => v + ' cm' }
    },
    controls: ['th', 'r'],
    presets: [{ label: '중심각 180° (지름)', apply: (q) => { q.th = 180; }, on: (q) => q.th === 180 }],
    partOfStep: (st) => st,
    steps: () => T1101.map((p) => p.name.replace(/\.$/, '') + (p.ok ? ' → 옳음' : ' → 옳지 않음')),
    work: (q) => {
      const ch = chordLen(q.r, q.th);
      const half = q.th === 180;
      return [
        `① 중심을 지나는 현이 <b>지름</b>입니다. 지금 현 PQ = <b>${d1(ch)} cm</b>, 지름 = <b>${2 * q.r} cm</b>${half ? ' (같음: 지름)' : ' → 지름이 더 깁니다'}. <b>옳음</b>`,
        '② 두 점을 이은 <b>선분</b>은 <b>현</b>이고, 두 점 사이의 <b>곡선</b>이 <b>호</b>입니다. 선분을 호라 하면 틀립니다. <b>옳지 않음</b>',
        `③ 중심각이 180°일 때만 부채꼴과 활꼴이 겹쳐 <b>반원</b>이 됩니다. 지금 중심각 ${q.th}° → ${half ? '반원입니다' : '두 도형이 서로 다릅니다'}. <b>옳음</b>`,
        '④ 현과 호로 둘러싸인 도형이 <b>활꼴</b>입니다. <b>옳음</b>',
        '⑤ 두 반지름과 호로 둘러싸인 도형이 <b>부채꼴</b>입니다. <b>옳음</b>'
      ];
    },
    rule: (q) => (q.step >= 5 ? '정답 ② — 선분은 현, 곡선이 호' : null),
    view: (q, mode) => {
      const ch = chordLen(q.r, q.th);
      const sel = mode === 'review' ? q.step : q.part | 0;
      const half = q.th === 180;
      let st = stat('info', `중심각 ${q.th}° · 현 PQ = ${d1(ch)} cm`);
      if (sel === 1) st = half ? stat('ok', `현 PQ가 지름입니다 (${2 * q.r} cm) — 가장 긴 현`) : stat('info', `현 PQ = ${d1(ch)} cm < 지름 ${2 * q.r} cm`);
      if (sel === 2) st = stat('bad', '선분 PQ는 현, 곡선 PQ가 호입니다 → 옳지 않음');
      if (sel === 3) st = half ? stat('ok', '반원 — 부채꼴이면서 활꼴입니다') : stat('info', '지금은 부채꼴과 활꼴이 다릅니다 · 180°로 맞춰 보세요');
      if (sel === 4) st = stat('ok', '현과 호로 둘러싸인 초록 부분 = 활꼴');
      if (sel === 5) st = stat('ok', '두 반지름과 호로 둘러싸인 노랑 부분 = 부채꼴');
      return {
        status: mode === 'problem' ? null : st,
        parts: verdictParts(T1101),
        readouts: [
          rd('반지름 r', q.r + ' cm', 'sky'),
          rd('중심각 ∠POQ', q.th + '°', 'amber'),
          rd('현 PQ', d1(ch) + ' cm', 'sky', half ? '지름과 같음' : '지름 ' + 2 * q.r + ' cm보다 짧음'),
          rd('호 PQ', piS((q.r * q.th) / 180) + ' cm', 'rose')
        ]
      };
    },
    problem: () => ({
      text: qHtml('다음 중 옳지 않은 것은?', T1101.map((p) => p.name.slice(2)), true),
      answer: '② 원 위의 두 점을 이은 선분은 호가 아니라 현입니다.'
    }),
    draw(g, q, mode, step) {
      const O = [0, 0], R = 100, th = q.th, pa = q.pa, qa = pa + th, m = pa + th / 2;
      g.reserve([-R - 8, -R - 8], [R + 8, R + 8]);
      const sel = mode === 'explore' ? q.part | 0 : mode === 'review' ? step : 0;
      const P = g.pol(O, R, pa), Q = g.pol(O, R, qa), half = Math.abs(th - 180) < 0.5;
      g.arc(O, R, pa, qa, { sector: true, fill: 'amber', fillAlpha: 0.2, stroke: false, ref: [3, 5] });
      g.path(g.arcPts(O, R, pa, qa), { close: true, fill: 'green', fillAlpha: 0.3, stroke: false, ref: [3, 4] });
      g.circle(O, R, { color: 'ink', alpha: 0.9, width: 2.4 });
      if (sel === 1 || half) g.seg(g.pol(O, R, pa), g.pol(O, R, pa + 180), { color: 'rose', width: 3, dash: [7, 5], ref: 1 });
      g.seg(O, P, { color: 'amber', width: 2.6, ref: [3, 5] });
      g.seg(O, Q, { color: 'amber', width: 2.6, ref: [3, 5] });
      g.seg(P, Q, { color: 'sky', width: 3.6, ref: [1, 2, 3, 4] });
      g.arc(O, R, pa, qa, { color: 'rose', width: 4.8, ref: [2, 3, 4, 5] });
      g.ang(O, pa, qa, { r: 20, color: 'amber', label: q.th + '°', lr: 38, ref: [3, 5] });
      if (sel === 0 || sel === 2 || sel === 5) g.out(g.pol(O, R, m), m, '호 PQ', { color: 'rose', ref: [2, 4, 5] }, 28);
      const M = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
      if (sel <= 2) g.text(M, '현 PQ', { color: 'sky', ref: [1, 2, 3, 4], dx: Math.cos(m * D2R) * 30, dy: -Math.sin(m * D2R) * 30 });
      if (sel === 3 || sel === 5) g.text(g.pol(O, R * 0.62, m), '부채꼴', { color: 'amber', ref: [3, 5], size: 17 });
      if (sel === 3 || sel === 4) g.text(g.pol(O, R * 0.5 * (1 + Math.cos((th * D2R) / 2)) + 8, m), '활꼴', { color: 'green', ref: [3, 4], size: 17, dy: th < 150 ? 0 : 0 });
      if (sel === 1) g.text(g.pol(O, 0, 0), '지름', { color: 'rose', ref: 1, dx: 0, dy: -16 });
      const upd = (np, nq) => {
        let t = mod(nq - np, 360);
        if (t < 20) t = 20;
        if (t > 340) t = 340;
        q.pa = mod(nq - t, 360); q.th = t;
      };
      if (mode === 'explore') {
        g.handle('P', P, { label: 'P', toward: O, ref: [1, 2, 3, 4, 5], drag: (w) => upd(snap(dirOf(O, w), 5), qa) });
        g.handle('Q', Q, { label: 'Q', toward: O, ref: [1, 2, 3, 4, 5], drag: (w) => { let t = snap(mod(dirOf(O, w) - pa, 360), 5); if (Math.abs(t - 180) <= 7) t = 180; q.th = clamp(t, 20, 340); } });
      } else {
        g.dot(P, { color: 'ink', label: 'P', toward: O });
        g.dot(Q, { color: 'ink', label: 'Q', toward: O });
      }
      g.dot(O, { color: 'ink', r: 4, label: 'O', dx: -12, dy: 15, align: 'center' });
    }
  });

  /* ---------- 12-07 한 원에서 중심각과 호·현·넓이 ---------- */
  const T1207 = [
    { id: 1, name: '① 지름은 길이가 가장 긴 현이다.', ok: true },
    { id: 2, name: '② 호의 길이는 중심각의 크기에 정비례한다.', ok: true },
    { id: 3, name: '③ 현의 길이는 중심각의 크기에 정비례한다.', ok: false },
    { id: 4, name: '④ 같은 크기의 중심각에 대한 현의 길이는 서로 같다.', ok: true },
    { id: 5, name: '⑤ 같은 크기의 중심각에 대한 부채꼴의 넓이는 서로 같다.', ok: true }
  ];
  build({
    id: '1207', title: '중심각에 정비례하는 것 · 옳지 않은 것', short: '정비례 (12-07)',
    question: '한 원에서 중심각을 2배로 하면 호의 길이, 현의 길이, 부채꼴의 넓이는 각각 몇 배가 될까?',
    guide: '노랑·분홍 부채꼴의 <b>중심각</b>을 끌어 바꿔 보세요. 호와 넓이의 비는 중심각의 비와 같은데, <b>현의 비</b>는 어떤지 비교해 보세요.',
    box: { x: [-125, 125], y: [-125, 125] },
    params: {
      al: { value: 50, min: 10, max: 130, step: 5, color: 'amber', label: '노랑 중심각 α', format: (v) => v + '°' },
      be: { value: 100, min: 10, max: 180, step: 5, color: 'rose', label: '분홍 중심각 β', format: (v) => v + '°' },
      r: { value: 6, min: 3, max: 9, step: 1, color: 'sky', label: '반지름 r', format: (v) => v + ' cm' }
    },
    controls: ['al', 'be', 'r'],
    presets: [
      { label: '중심각 2배', apply: (q) => { q.al = 50; q.be = 100; }, on: (q) => q.be === 2 * q.al },
      { label: '같은 중심각', apply: (q) => { q.al = 60; q.be = 60; }, on: (q) => q.al === q.be },
      { label: '분홍 = 180° (지름)', apply: (q) => { q.be = 180; }, on: (q) => q.be === 180 }
    ],
    partOfStep: (st) => st,
    steps: () => T1207.map((p) => p.name.replace(/\.$/, '') + (p.ok ? ' → 옳음' : ' → 옳지 않음')),
    work: (q) => {
      const cA = chordLen(q.r, q.al), cB = chordLen(q.r, q.be), k = q.be / q.al;
      return [
        `① 현 중에서 중심을 지나는 것이 <b>지름</b>이고 가장 깁니다. 분홍 현 = ${d1(cB)} cm ≤ 지름 ${2 * q.r} cm. <b>옳음</b>`,
        `② 중심각이 ${num(k)}배 → 호의 길이도 ${num(k)}배 (${piS((q.r * q.al) / 180)} : ${piS((q.r * q.be) / 180)}). <b>옳음</b>`,
        `③ 중심각이 ${num(k)}배인데 현은 ${d2(cB / cA)}배 (${d1(cA)} cm : ${d1(cB)} cm)로 <b>비례하지 않습니다</b>. <b>옳지 않음</b>`,
        '④ 중심각이 같으면 두 반지름 사이의 현도 같은 길이입니다(합동인 이등변삼각형). <b>옳음</b>',
        '⑤ 중심각이 같으면 부채꼴이 포개어져 넓이도 같습니다. <b>옳음</b>'
      ];
    },
    rule: (q) => (q.step >= 5 ? '정답 ③ — 호·넓이는 중심각에 정비례, 현은 아님' : null),
    view: (q, mode) => {
      const cA = chordLen(q.r, q.al), cB = chordLen(q.r, q.be), k = q.be / q.al, kc = cB / cA;
      const sel = mode === 'review' ? q.step : q.part | 0;
      let st = stat('info', `중심각의 비 ${num(k)}배 → 호 ${num(k)}배 · 넓이 ${num(k)}배 · 현 ${d2(kc)}배`);
      if (sel === 1) st = q.be === 180 ? stat('ok', `분홍 현이 지름 (${2 * q.r} cm) — 가장 긴 현`) : stat('info', `분홍 현 ${d1(cB)} cm ≤ 지름 ${2 * q.r} cm`);
      if (sel === 2) st = stat('ok', `중심각 ${num(k)}배 → 호 ${num(k)}배`);
      if (sel === 3) st = Math.abs(kc - k) < 0.005 ? stat('info', '지금은 비가 같아 보여도, 중심각을 바꿔 보면 현의 비는 달라집니다') : stat('bad', `중심각 ${num(k)}배인데 현은 ${d2(kc)}배 → 정비례 아님`);
      if (sel === 4) st = q.al === q.be ? stat('ok', `같은 중심각 → 현이 같음 (${d1(cA)} cm = ${d1(cB)} cm)`) : stat('info', '두 중심각을 같게 맞춰 보세요 (같은 중심각 → 같은 현)');
      if (sel === 5) st = q.al === q.be ? stat('ok', `같은 중심각 → 넓이가 같음 (${piS((q.r * q.r * q.al) / 360)} cm²)`) : stat('info', '두 중심각을 같게 맞춰 보세요 (같은 중심각 → 같은 넓이)');
      return {
        status: mode === 'problem' ? null : st,
        parts: verdictParts(T1207),
        readouts: [
          rd('중심각의 비 β÷α', num(k), 'amber', `${q.be}° ÷ ${q.al}°`),
          rd('호의 길이의 비', num(k), 'green', '중심각의 비와 같음', 2),
          rd('부채꼴 넓이의 비', num(k), 'green', '중심각의 비와 같음', 5),
          rd('현의 길이의 비', d2(kc), 'red', Math.abs(kc - k) < 0.005 ? '' : '중심각의 비와 다름', 3)
        ]
      };
    },
    problem: () => ({
      text: qHtml('다음 중 한 원에 대한 설명으로 옳지 않은 것은?', T1207.map((p) => p.name.slice(2)), true),
      answer: '③ 현의 길이는 중심각의 크기에 정비례하지 않습니다.'
    }),
    draw(g, q, mode, step) {
      const O = [0, 0], R = 100;
      g.reserve([-R - 8, -R - 8], [R + 8, R + 8]);
      const sel = mode === 'explore' ? q.part | 0 : mode === 'review' ? step : 0;
      const a0 = 20, b0 = 200, a1 = a0 + q.al, b1 = b0 + q.be;
      const cA = chordLen(q.r, q.al), cB = chordLen(q.r, q.be);
      g.arc(O, R, a0, a1, { sector: true, fill: 'amber', fillAlpha: 0.22, stroke: false, ref: 5 });
      g.arc(O, R, b0, b1, { sector: true, fill: 'rose', fillAlpha: 0.22, stroke: false, ref: 5 });
      g.circle(O, R, { color: 'ink', alpha: 0.9, width: 2.4 });
      if (sel === 1 || q.be === 180) g.seg(g.pol(O, R, b0), g.pol(O, R, b0 + 180), { color: 'rose', width: 3, dash: [7, 5], ref: 1 });
      [[a0, a1, 'amber'], [b0, b1, 'rose']].forEach(([s0, s1, col]) => {
        g.seg(O, g.pol(O, R, s0), { color: col, width: 2.6 });
        g.seg(O, g.pol(O, R, s1), { color: col, width: 2.6 });
      });
      const PA = [g.pol(O, R, a0), g.pol(O, R, a1)], PB = [g.pol(O, R, b0), g.pol(O, R, b1)];
      g.seg(PA[0], PA[1], { color: 'sky', width: 3.4, ref: [1, 3, 4] });
      g.seg(PB[0], PB[1], { color: 'sky', width: 3.4, ref: [1, 3, 4] });
      g.arc(O, R, a0, a1, { color: 'amber', width: 4.8, ref: 2 });
      g.arc(O, R, b0, b1, { color: 'rose', width: 4.8, ref: 2 });
      if (q.al === q.be) { g.tick(PA[0], PA[1], { color: 'amber' }); g.tick(PB[0], PB[1], { color: 'amber' }); }
      g.ang(O, a0, a1, { r: 20, color: 'amber', label: q.al + '°', lr: 40 });
      g.ang(O, b0, b1, { r: 20, color: 'rose', label: q.be + '°', lr: 40 });
      const mA = (a0 + a1) / 2, mB = (b0 + b1) / 2;
      if (sel === 0 || sel === 2) {
        g.out(g.pol(O, R, mA), mA, '호 ' + piS((q.r * q.al) / 180), { color: 'amber', ref: 2 }, 36);
        g.out(g.pol(O, R, mB), mB, '호 ' + piS((q.r * q.be) / 180), { color: 'rose', ref: 2 }, 36);
      }
      if (sel === 0 || sel === 1 || sel === 3 || sel === 4) {
        const mx = (P) => [(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2];
        const sg = (th) => (th < 90 ? -16 : 26);
        g.text(mx(PA), '현 ' + d1(cA), { color: 'sky', ref: [1, 3, 4], dx: Math.cos(mA * D2R) * sg(q.al), dy: -Math.sin(mA * D2R) * sg(q.al) });
        g.text(mx(PB), '현 ' + d1(cB), { color: 'sky', ref: [1, 3, 4], dx: Math.cos(mB * D2R) * sg(q.be), dy: -Math.sin(mB * D2R) * sg(q.be) });
      }
      if (sel === 5) {
        g.text(g.pol(O, R * 0.66, mA), '넓이 ' + piS((q.r * q.r * q.al) / 360), { color: 'amber', ref: 5, size: 14 });
        g.text(g.pol(O, R * 0.66, mB), '넓이 ' + piS((q.r * q.r * q.be) / 360), { color: 'rose', ref: 5, size: 14 });
      }
      if (mode === 'explore') {
        g.handle('A', PA[1], { color: 'amber', label: 'α', toward: O, drag: (w) => { q.al = clamp(snap(mod(dirOf(O, w) - a0, 360), 5), 10, 130); } });
        g.handle('B', PB[1], { color: 'rose', label: 'β', toward: O, drag: (w) => { let t = snap(mod(dirOf(O, w) - b0, 360), 5); if (t < 5 || t > 300) t = t < 5 ? 10 : 10; q.be = clamp(t, 10, 180); } });
      }
      g.dot(O, { color: 'ink', r: 4, label: 'O', dx: -12, dy: 15, align: 'center' });
    }
  });

  /* ---------- 16-07 ∠AOB = ∠BOC ---------- */
  const T1607 = [
    { id: 1, name: '① $\\overline{AB}=\\overline{BC}$', ok: true },
    { id: 2, name: '② $\\widehat{AC}=2\\widehat{BC}$', ok: true },
    { id: 3, name: '③ $\\overline{AC}=2\\overline{BC}$', ok: false },
    { id: 4, name: '④ $\\widehat{AB}=\\widehat{BC}$', ok: true },
    { id: 5, name: '⑤ (부채꼴 AOC의 넓이)=2×(부채꼴 BOC의 넓이)', ok: true }
  ];
  build({
    id: '1607', title: '∠AOB=∠BOC · 옳지 않은 것', short: '같은 중심각 (16-07)',
    question: '∠AOB = ∠BOC 이면 AC는 BC의 2배일까? 호, 현, 넓이를 하나씩 비교해 보자.',
    guide: '점 <b>C</b>를 끌어 ∠AOB = ∠BOC 의 크기를 바꿔 보세요. 아래 ①~⑤를 누르면 비교하는 부분이 그림에서 밝아집니다.',
    box: { x: [-135, 135], y: [-135, 135] },
    params: {
      ph: { value: 40, min: 10, max: 85, step: 5, color: 'amber', label: '∠AOB = ∠BOC', format: (v) => v + '°' },
      r: { value: 6, min: 3, max: 9, step: 1, color: 'sky', label: '반지름 r', format: (v) => v + ' cm' }
    },
    controls: ['ph', 'r'],
    partOfStep: (st) => st,
    steps: () => T1607.map((p) => p.name.replace(/\$/g, '').replace(/\\overline\{(\w+)\}/g, '$1').replace(/\\widehat\{(\w+)\}/g, '호 $1') + (p.ok ? ' → 옳음' : ' → 옳지 않음')),
    work: (q) => {
      const bc = chordLen(q.r, q.ph), ac = chordLen(q.r, 2 * q.ph);
      return [
        `① 중심각이 같으면 현도 같습니다. $\\overline{AB}=\\overline{BC}$ (${d1(bc)} cm). <b>옳음</b>`,
        `② $\\angle AOC=2\\angle BOC$ 이므로 호도 2배: $\\widehat{AC}$ = ${piS((q.r * 2 * q.ph) / 180)}, $\\widehat{BC}$ = ${piS((q.r * q.ph) / 180)}. <b>옳음</b>`,
        `③ 현은 중심각에 정비례하지 않습니다. $\\overline{AC}$ = ${d1(ac)} cm, 2$\\overline{BC}$ = ${d1(2 * bc)} cm → 같지 않습니다. <b>옳지 않음</b>`,
        '④ 중심각이 같으므로 호도 같습니다. <b>옳음</b>',
        `⑤ 부채꼴의 넓이는 중심각에 정비례하므로 AOC = 2×BOC (${piS((q.r * q.r * 2 * q.ph) / 360)} cm² = 2×${piS((q.r * q.r * q.ph) / 360)} cm²). <b>옳음</b>`
      ];
    },
    rule: (q) => (q.step >= 5 ? '정답 ③ — 삼각형 ABC에서 AB+BC > AC 이므로 AC < 2BC' : null),
    view: (q, mode) => {
      const bc = chordLen(q.r, q.ph), ac = chordLen(q.r, 2 * q.ph);
      const sel = mode === 'review' ? q.step : q.part | 0;
      let st = stat('info', `∠AOC = 2×∠BOC = ${2 * q.ph}°`);
      if (sel === 1) st = stat('ok', `AB = BC = ${d1(bc)} cm`);
      if (sel === 2) st = stat('ok', `호 AC = 2×호 BC (${piS((q.r * 2 * q.ph) / 180)} = 2×${piS((q.r * q.ph) / 180)})`);
      if (sel === 3) st = stat('bad', `AC = ${d1(ac)} cm ≠ 2×BC = ${d1(2 * bc)} cm`);
      if (sel === 4) st = stat('ok', '호 AB = 호 BC');
      if (sel === 5) st = stat('ok', '부채꼴 AOC = 2 × 부채꼴 BOC');
      return {
        status: mode === 'problem' ? null : st,
        parts: verdictParts(T1607).map((p, i) => ({ ...p, name: T1607[i].name })),
        readouts: [
          rd('현 AB = 현 BC', d1(bc) + ' cm', 'amber', '중심각이 같아서', 1),
          rd('현 AC', d1(ac) + ' cm', 'rose', '', 3),
          rd('2 × 현 BC', d1(2 * bc) + ' cm', 'sky', ac < 2 * bc - 0.001 ? 'AC보다 큼' : '', 3),
          rd('호 AC ÷ 호 BC', '2', 'green', '중심각의 비와 같음', 2)
        ]
      };
    },
    problem: () => ({
      text: qHtml('오른쪽 그림의 원 O에서 $\\angle AOB=\\angle BOC$일 때, 다음 중 옳지 않은 것은?', T1607.map((p) => p.name.slice(2)), true),
      answer: '③ 현의 길이는 중심각에 정비례하지 않으므로 $\\overline{AC}\\ne 2\\overline{BC}$ 입니다.'
    }),
    draw(g, q, mode, step) {
      const O = [0, 0], R = 100, a0 = 110, ph = q.ph;
      g.reserve([-R - 18, -R - 18], [R + 18, R + 18]);
      const sel = mode === 'explore' ? q.part | 0 : mode === 'review' ? step : 0;
      const A = g.pol(O, R, a0), B = g.pol(O, R, a0 + ph), C = g.pol(O, R, a0 + 2 * ph);
      const bc = chordLen(q.r, ph), ac = chordLen(q.r, 2 * ph);
      g.arc(O, R, a0, a0 + 2 * ph, { sector: true, fill: 'sky', fillAlpha: 0.12, stroke: false, ref: 5 });
      g.arc(O, R, a0 + ph, a0 + 2 * ph, { sector: true, fill: 'rose', fillAlpha: 0.2, stroke: false, ref: 5 });
      g.circle(O, R, { color: 'ink', alpha: 0.9, width: 2.4 });
      [A, B, C].forEach((p) => g.seg(O, p, { color: 'sky', width: 2.4 }));
      g.seg(A, B, { color: 'amber', width: 3.4, ref: [1, 3] });
      g.seg(B, C, { color: 'amber', width: 3.4, ref: [1, 3] });
      g.seg(A, C, { color: 'rose', width: 3.4, ref: 3 });
      g.tick(A, B, { color: 'amber' }); g.tick(B, C, { color: 'amber' });
      g.arc(O, R, a0, a0 + ph, { color: 'amber', width: 4.8, ref: [2, 4] });
      g.arc(O, R, a0 + ph, a0 + 2 * ph, { color: 'amber', width: 4.8, ref: [2, 4] });
      g.arc(O, R + 9, a0, a0 + 2 * ph, { color: 'rose', width: 3, ref: 2 });
      g.ang(O, a0, a0 + ph, { r: 22, color: 'amber', label: ph + '°', lr: 44 });
      g.ang(O, a0 + ph, a0 + 2 * ph, { r: 22, color: 'amber', label: ph + '°', lr: 44 });
      const mid = (P, Q) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
      if (sel === 1 || sel === 3) {
        g.text(mid(A, B), d1(bc), { color: 'amber', ref: [1, 3], dx: -14, dy: -16, align: 'center' });
        g.text(mid(B, C), d1(bc), { color: 'amber', ref: [1, 3], dx: -22, dy: 6, align: 'center' });
      }
      if (sel === 3) g.text(mid(A, C), 'AC ' + d1(ac), { color: 'rose', ref: 3, dx: 28, dy: -4 });
      if (sel === 2) {
        g.out(g.pol(O, R + 9, a0 + ph), a0 + ph, '호 AC ' + piS((q.r * 2 * ph) / 180), { color: 'rose', ref: 2 }, 34);
        g.out(g.pol(O, R, a0 + 1.5 * ph), a0 + 1.5 * ph, '호 BC ' + piS((q.r * ph) / 180), { color: 'amber', ref: 2 }, 62);
      }
      if (sel === 4) {
        g.out(g.pol(O, R, a0 + 0.5 * ph), a0 + 0.5 * ph, '호 AB ' + piS((q.r * ph) / 180), { color: 'amber', ref: 4 }, 34);
        g.out(g.pol(O, R, a0 + 1.5 * ph), a0 + 1.5 * ph, '호 BC ' + piS((q.r * ph) / 180), { color: 'amber', ref: 4 }, 34);
      }
      if (sel === 5) {
        g.text(g.pol(O, R * 0.62, a0 + 0.5 * ph), 'BOC ×1', { color: 'rose', ref: 5, size: 14 });
        g.text(g.pol(O, R * 0.8, a0 + ph), 'AOC = ×2', { color: 'sky', ref: 5, size: 14, dx: 0, dy: -24 });
      }
      if (mode === 'explore') g.handle('C', C, { label: 'C', toward: O, drag: (w) => { q.ph = clamp(snap(mod(dirOf(O, w) - a0, 360) / 2, 5), 10, 85); } });
      else g.dot(C, { color: 'ink', label: 'C', toward: O });
      g.dot(A, { color: 'ink', label: 'A', toward: O });
      g.dot(B, { color: 'ink', label: 'B', toward: O });
      g.dot(O, { color: 'ink', r: 4, label: 'O', dx: 14, dy: 15, align: 'center' });
    }
  });

  /* ======================================================================
     ② 기본형 · ③ 길이·둘레 — 부채꼴 하나의 반지름·중심각·호·넓이
     (반지름 r, 중심각 θ를 조절하면 호의 길이 l = 2πr×θ/360, 넓이 S = πr²×θ/360 이 함께 바뀝니다)
     ====================================================================== */
  const SU = 100 / 12; // 1 cm = SU 월드 단위 (r 최대 12 cm가 월드 반지름 100)
  const sQ = (q) => ({ r: q.r, th: q.th, l: (q.r * q.th) / 180, S: (q.r * q.r * q.th) / 360 });
  const sectorBox = (thMax) => {
    let x0 = 0, x1 = 0, y0 = 0, y1 = 0;
    for (let a = 0; a <= thMax + 0.1; a += 5) { const p = [100 * Math.cos(a * D2R), 100 * Math.sin(a * D2R)]; x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    return [[x0 - 4, y0 - 4], [x1 + 4, y1 + 4]];
  };
  const SLAB = {
    r: (v) => `r = ${num(v)} cm`,
    th: (v) => `${num(v)}°`,
    l: (v) => `호 ${piS(v)} cm`,
    S: (v) => `넓이 ${piS(v)} cm²`
  };
  const SCOL = { r: 'sky', th: 'amber', l: 'amber', S: 'amber' };

  const sp = (list) => list.map(([r, th]) => ({ label: `r=${r} cm · ${th}°`, apply: (q) => { q.r = r; q.th = th; }, on: (q) => q.r === r && q.th === th }));
  function sectorSpec(o) {
    const thMin = o.thMin || 10, thMax = o.thMax || 350;
    const box = sectorBox(thMax);
    const stateOf = (k, mode, step) => {
      // 'val' 값을 보임 · 'ask' 물음표 · 'hide' 숨김, 그리고 글자 색
      const given = o.given.includes(k), asked = o.ask.includes(k);
      if (mode === 'explore') return { s: 'val', c: given ? 'amber' : asked ? 'rose' : 'ink' };
      if (given) return { s: 'val', c: 'amber' };
      const rv = o.reveal[k];
      if (mode === 'review' && rv != null && step >= rv) return { s: 'val', c: asked ? 'rose' : 'green' };
      return asked ? { s: 'ask', c: 'rose' } : { s: 'hide', c: 'ink' };
    };
    return {
      id: o.id, title: o.title, short: o.short, question: o.question, guide: o.guide, tag: o.tag,
      box: { x: [box[0][0] - 20, box[1][0] + 20], y: [box[0][1] - 24, box[1][1] + 30] },
      params: {
        r: { value: o.def.r, min: 3, max: 12, step: 1, color: 'sky', label: '반지름 r', format: (v) => v + ' cm' },
        th: { value: o.def.th, min: thMin, max: thMax, step: 5, color: 'amber', label: '중심각 θ', format: (v) => v + '°' }
      },
      controls: ['r', 'th'],
      presets: o.presets,
      steps: o.steps, work: o.work, rule: o.rule,
      chips: (q, mode, step) => {
        const v = sQ(q);
        if (mode === 'review') return o.chipsF ? o.chipsF(q, v, step) : [];
        return [{ k: '호', tex: `l = 2\\pi r\\times\\frac{\\theta}{360} = ${piT(v.l)}`, color: 'amber' }, { k: '넓이', tex: `S = \\pi r^2\\times\\frac{\\theta}{360} = ${piT(v.S)}`, color: 'green' }].slice(0, mode === 'explore' ? 2 : 0);
      },
      view: (q, mode) => {
        const v = sQ(q);
        const rr = [
          rd('반지름 r', q.r + ' cm', 'sky'),
          rd('중심각 θ', q.th + '°', 'amber', `원의 ${frS(q.th / 360)} 만큼`),
          rd('호의 길이 l', piS(v.l) + ' cm', 'amber', '= 원주 ' + piS(2 * q.r) + ' cm × ' + frS(q.th / 360)),
          rd('넓이 S', piS(v.S) + ' cm²', 'green', '= 원 ' + piS(q.r * q.r) + ' cm² × ' + frS(q.th / 360))
        ];
        if (o.relation) rr.push(o.relation(q, v));
        return { readouts: rr };
      },
      problem: o.problem,
      draw(g, q, mode, step) {
        const O = [0, 0], r = q.r, R = r * SU, th = q.th, m = th / 2, v = sQ(q);
        g.reserve(box[0], box[1]);
        // 원 전체(흐리게)와 부채꼴
        if (th < thMax) g.arc(O, R, th, thMax >= 350 ? 360 : thMax, { color: 'muted', alpha: 0.6, width: 1.8, dash: [5, 6] });
        g.arc(O, R, 0, th, { sector: true, fill: 'sky', fillAlpha: 0.3, stroke: false });
        g.seg(O, [R, 0], { color: 'ink', width: 2.8 });
        g.seg(O, g.pol(O, R, th), { color: 'ink', width: 2.8 });
        g.tick(O, [R, 0], { color: 'ink' });
        g.tick(O, g.pol(O, R, th), { color: 'ink' });
        const stL = stateOf('l', mode, step);
        g.arc(O, R, 0, th, { color: stL.s === 'hide' ? 'sky' : stL.c === 'ink' ? 'sky' : stL.c, width: 5 });
        const ar = Math.min(R * 0.34, 30);
        const stT = stateOf('th', mode, step);
        if (stT.s !== 'hide') g.ang(O, 0, th, { r: ar, color: stT.c === 'ink' ? 'amber' : stT.c, label: stT.s === 'ask' ? '?°' : SLAB.th(v.th), lr: ar + 15, size: 16, mid: th > 180 ? m : Math.min(m, 30) });
        const stR = stateOf('r', mode, step);
        if (stR.s !== 'hide') g.text(g.pol(O, R * 0.52, 0), stR.s === 'ask' ? 'r = ? cm' : SLAB.r(v.r), { color: stR.c === 'ink' ? 'sky' : stR.c, dy: th > 180 ? -18 : 20, size: 16 });
        if (stL.s !== 'hide') g.out(g.pol(O, R, m), m, stL.s === 'ask' ? '호 ? cm' : SLAB.l(v.l), { color: stL.c === 'ink' ? 'amber' : stL.c, size: 16 }, 32);
        const stS = stateOf('S', mode, step);
        if (stS.s !== 'hide') g.text(th > 200 ? g.pol(O, R * 0.5, 90) : g.pol(O, R * (th < 90 ? 0.8 : 0.66), m), stS.s === 'ask' ? '넓이 ? cm²' : SLAB.S(v.S), { color: stS.c === 'ink' ? 'green' : stS.c, size: 16, dy: th < 90 ? -10 : 0 });
        if (mode === 'explore') {
          g.handle('th', g.pol(O, R, th), { color: 'amber', label: 'θ', toward: O, drag: (w) => {
            let a = mod(dirOf(O, w), 360);
            if (a > (thMax + 360) / 2) a = 0;
            q.th = clamp(snap(a, 5), thMin, thMax);
          } });
          g.handle('r', [R, 0], { color: 'sky', label: 'r', dx: 12, dy: -14, drag: (w) => { q.r = clamp(Math.round(Math.hypot(w.x, w.y) / SU), 3, 12); } });
        }
        g.dot(O, { color: 'ink', r: 4, label: 'O', dx: -12, dy: 14, align: 'center' });
      }
    };
  }

  /* 입력(교재 값): 12-09, 12-10, 16-09, 16-10, 18-08 */
  /* ---------- 12-09 반지름과 중심각이 주어진 부채꼴: 호의 길이와 넓이 ---------- */
  build(sectorSpec({
    id: '1209', title: '부채꼴의 호의 길이와 넓이', short: '호·넓이 (12-09)',
    question: '반지름과 중심각을 알면 호의 길이와 넓이를 모두 구할 수 있을까? 원 전체와 비교해 보자.',
    guide: '<b>중심각 θ</b>와 <b>반지름 r</b>를 막대나 손잡이로 바꿔 보세요. 호와 넓이는 모두 <b>원 전체 × (θ/360)</b> 입니다.',
    presets: sp([[12, 120], [9, 80], [6, 60], [10, 72], [12, 45]]),
    given: ['r', 'th'], ask: ['l', 'S'], reveal: { l: 1, S: 2 }, def: { r: 12, th: 120 }, thMax: 350,
    steps: (q) => {
      const v = sQ(q);
      return [`① 호의 길이 : 2π × ${q.r} × ${q.th}/360 = ${piS(v.l)} cm`, `② 넓이 : π × ${q.r}² × ${q.th}/360 = ${piS(v.S)} cm²`];
    },
    work: (q) => {
      const v = sQ(q);
      return [
        `호의 길이 $l=2\\pi\\times${q.r}\\times\\frac{${q.th}}{360}=${piT(v.l)}$ (cm)`,
        `넓이 $S=\\pi\\times${q.r}^2\\times\\frac{${q.th}}{360}=${piT(v.S)}$ (cm²)`
      ];
    },
    chipsF: (q, v, step) => (step === 1 ? [{ k: '호', tex: `2\\pi\\times${q.r}\\times\\frac{${q.th}}{360}=${piT(v.l)}`, color: 'rose' }] : [{ k: '넓이', tex: `\\pi\\times${q.r}^2\\times\\frac{${q.th}}{360}=${piT(v.S)}`, color: 'rose' }]),
    rule: (q) => (q.step >= 2 ? '부채꼴은 원의 θ/360 만큼 → 호 = 원주 × θ/360, 넓이 = 원의 넓이 × θ/360' : null),
    problem: (q) => {
      const v = sQ(q);
      const pair = (a, b) => `${T(piT(a))} cm, ${T(piT(b))} cm²`;
      const items = [pair(v.l, 0.75 * v.S), pair(v.l, v.S), pair(1.5 * v.l, 0.5 * v.S), pair(1.5 * v.l, 0.75 * v.S), pair(1.5 * v.l, v.S)];
      return { text: qHtml(`오른쪽 그림과 같은 부채꼴(반지름 ${q.r} cm, 중심각 ${q.th}°)의 호의 길이와 넓이를 차례대로 구하면?`, items, true), answer: `② ${items[1]}` };
    },
    relation: (q) => rd('호 : 넓이', piS(sQ(q).l) + ' : ' + piS(sQ(q).S), 'violet', '둘 다 중심각에 정비례')
  }));

  /* ---------- 12-10 반지름과 넓이가 주어진 부채꼴: 호의 길이 ---------- */
  build(sectorSpec({
    id: '1210', title: '넓이와 호의 길이 사이의 관계', short: '넓이→호 (12-10)',
    question: '부채꼴의 넓이를 알면 호의 길이는 어떻게 구할까? 넓이 ÷ 호의 길이를 계산해 보자.',
    guide: '<b>중심각 θ</b>를 바꿔 보세요. 호의 길이와 넓이가 같이 변해도 <b>S ÷ l</b> 은 늘 같은 값(= r÷2)입니다.',
    presets: sp([[9, 320], [6, 300], [10, 216], [8, 135], [12, 180]]),
    given: ['r', 'S'], ask: ['l'], reveal: { l: 2 }, def: { r: 9, th: 320 }, thMax: 350,
    steps: (q) => {
      const v = sQ(q);
      return [`① 부채꼴의 넓이 S = ½ × r × l 에 넣기 : ${piS(v.S)} = ½ × ${q.r} × l`, `② l = ${piS(v.l)} cm`];
    },
    work: (q) => {
      const v = sQ(q);
      return [
        `부채꼴의 넓이 $S=\\frac{1}{2}rl$ 에 $r=${q.r},\\ S=${piT(v.S)}$ 를 넣으면 $${piT(v.S)}=\\frac{1}{2}\\times${q.r}\\times l$`,
        `$l=${piT(v.S)}\\times\\frac{2}{${q.r}}=${piT(v.l)}$ (cm)`
      ];
    },
    chipsF: (q, v, step) => (step === 1 ? [{ k: '공식', tex: 'S=\\frac{1}{2}rl', color: 'amber' }, { k: '대입', tex: `${piT(v.S)}=\\frac{1}{2}\\times${q.r}\\times l`, color: 'rose' }] : [{ k: '답', tex: `l=${piT(v.l)}`, color: 'rose' }]),
    rule: (q) => (q.step >= 2 ? '부채꼴의 넓이 S = ½ r l (호의 길이를 알면 반지름과 곱의 절반)' : null),
    problem: (q) => {
      const v = sQ(q);
      const c = mkChoices(v.l, 2, 4, (x) => `${T(piT(x))} cm`);
      return { text: qHtml(`반지름의 길이가 ${q.r} cm이고 넓이가 ${T(piT(v.S))} cm²인 부채꼴의 호의 길이는?`, c.items), answer: ansOf(c) };
    },
    relation: (q) => rd('넓이 ÷ 호의 길이', num(q.r / 2), 'violet', '= 반지름 ÷ 2 (늘 같음)')
  }));

  /* ---------- 16-09 반지름과 넓이가 주어진 부채꼴: 중심각 ---------- */
  build(sectorSpec({
    id: '1609', title: '넓이로 중심각 구하기', short: '넓이→중심각 (16-09)', tag: '교재 문제 · 서답형',
    question: '부채꼴의 넓이가 원 전체의 몇 분의 몇인지 알면 중심각을 구할 수 있을까?',
    guide: '<b>중심각 θ</b>를 바꿔 보세요. 부채꼴의 넓이는 원의 넓이의 <b>θ/360</b> 배입니다.',
    presets: sp([[9, 120], [6, 60], [12, 150], [10, 72], [8, 45]]),
    given: ['r', 'S'], ask: ['th'], reveal: { th: 2 }, def: { r: 9, th: 120 }, thMax: 350,
    steps: (q) => {
      const v = sQ(q);
      return [`① 부채꼴 넓이 ÷ 원의 넓이 : ${piS(v.S)} ÷ ${piS(q.r * q.r)} = ${frS(q.th / 360)}`, `② 중심각 = 360° × ${frS(q.th / 360)} = ${q.th}°`];
    },
    work: (q) => {
      const v = sQ(q);
      return [
        `원의 넓이 $\\pi\\times${q.r}^2=${piT(q.r * q.r)}$ 이므로 부채꼴은 원의 $\\frac{${piT(v.S)}}{${piT(q.r * q.r)}}=${frT(q.th / 360)}$ 입니다.`,
        `중심각 $=360^\\circ\\times${frT(q.th / 360)}=${num(q.th)}^\\circ$`
      ];
    },
    chipsF: (q, v, step) => (step === 1 ? [{ k: '비', tex: `\\frac{${piT(v.S)}}{${piT(q.r * q.r)}}=${frT(q.th / 360)}`, color: 'amber' }] : [{ k: '답', tex: `\\theta=360^\\circ\\times${frT(q.th / 360)}=${num(q.th)}^\\circ`, color: 'rose' }]),
    rule: (q) => (q.step >= 2 ? '넓이의 비 = 중심각의 비 → θ = 360° × (부채꼴 넓이 ÷ 원의 넓이)' : null),
    problem: (q) => {
      const v = sQ(q);
      return { text: `<p class="cs-q">반지름의 길이가 ${q.r} cm이고 넓이가 ${T(piT(v.S))} cm²인 부채꼴의 중심각의 크기를 구하시오.</p>`, answer: `${num(q.th)}°` };
    },
    relation: (q, v) => rd('S ÷ 원의 넓이', frS(q.th / 360), 'violet', '= θ ÷ 360')
  }));

  /* ---------- 16-10 호의 길이와 중심각이 주어진 부채꼴: 넓이 ---------- */
  build(sectorSpec({
    id: '1610', title: '호의 길이로 넓이 구하기', short: '호→넓이 (16-10)',
    question: '호의 길이와 중심각을 알면 반지름을 거쳐 넓이를 구할 수 있을까?',
    guide: '<b>반지름 r</b>(아래 막대 또는 파란 손잡이)과 <b>중심각 θ</b>를 바꿔 보세요. 호의 길이가 같아도 반지름이 다르면 넓이가 달라집니다.',
    presets: sp([[9, 80], [12, 60], [6, 120], [10, 72], [12, 45]]),
    given: ['l', 'th'], ask: ['S'], reveal: { r: 1, S: 2 }, def: { r: 9, th: 80 }, thMax: 180, thMin: 10,
    steps: (q) => {
      const v = sQ(q);
      return [`① 반지름 구하기 : 2π × r × ${q.th}/360 = ${piS(v.l)} → r = ${q.r}`, `② 넓이 : π × ${q.r}² × ${q.th}/360 = ${piS(v.S)} cm²`];
    },
    work: (q) => {
      const v = sQ(q);
      return [
        `반지름을 $r$ 라 하면 $2\\pi r\\times\\frac{${q.th}}{360}=${piT(v.l)}$ 이므로 $r=${q.r}$ (cm)`,
        `넓이 $S=\\pi\\times${q.r}^2\\times\\frac{${q.th}}{360}=${piT(v.S)}$ (cm²) <span style="opacity:.75">(또는 $\\frac12rl=\\frac12\\times${q.r}\\times${piT(v.l)}$)</span>`
      ];
    },
    chipsF: (q, v, step) => (step === 1 ? [{ k: '반지름', tex: `2\\pi r\\times\\frac{${q.th}}{360}=${piT(v.l)}\\ \\Rightarrow\\ r=${q.r}`, color: 'green' }] : [{ k: '넓이', tex: `\\pi\\times${q.r}^2\\times\\frac{${q.th}}{360}=${piT(v.S)}`, color: 'rose' }]),
    rule: (q) => (q.step >= 2 ? '호의 길이로 반지름을 먼저 구한 뒤 넓이 = π r² × θ/360' : null),
    problem: (q) => {
      const v = sQ(q);
      const c = mkChoices(v.S, 2, 3, (x) => `${T(piT(x))} cm²`);
      return { text: qHtml(`오른쪽 그림과 같이 호의 길이가 ${T(piT(v.l))} cm이고 중심각의 크기가 ${q.th}°인 부채꼴의 넓이는?`, c.items), answer: ansOf(c) };
    },
    relation: (q, v) => rd('넓이 ÷ 호의 길이', num(q.r / 2), 'violet', '= 반지름 ÷ 2')
  }));

  /* ---------- 18-08 중심각과 호의 길이가 주어진 부채꼴: 반지름 ---------- */
  build(sectorSpec({
    id: '1808', title: '호의 길이로 반지름 구하기', short: '호→반지름 (18-08)',
    question: '중심각이 정해졌을 때 호의 길이가 커지면 반지름은 어떻게 될까?',
    guide: '<b>반지름 r</b>(파란 손잡이)을 늘려 보세요. 중심각이 같으면 호의 길이는 반지름에 <b>정비례</b>합니다.',
    presets: sp([[12, 45], [9, 80], [6, 120], [10, 72], [12, 60]]),
    given: ['th', 'l'], ask: ['r'], reveal: { r: 2 }, def: { r: 12, th: 45 }, thMax: 180, thMin: 10,
    steps: (q) => {
      const v = sQ(q);
      return [`① 호의 길이 식 : 2π × r × ${q.th}/360 = ${piS(v.l)}`, `② r = ${q.r} cm`];
    },
    work: (q) => {
      const v = sQ(q);
      return [
        `반지름을 $r$ 라 하면 $2\\pi r\\times\\frac{${q.th}}{360}=\\frac{${q.th}}{180}\\pi r=${piT(v.l)}$`,
        `$r=${piT(v.l)}\\times\\frac{180}{${q.th}}\\div\\pi=${q.r}$ (cm)`
      ];
    },
    chipsF: (q, v, step) => (step === 1 ? [{ k: '식', tex: `2\\pi r\\times\\frac{${q.th}}{360}=${piT(v.l)}`, color: 'amber' }] : [{ k: '답', tex: `r=${q.r}\\ \\text{cm}`, color: 'rose' }]),
    rule: (q) => (q.step >= 2 ? '호의 길이 = 2πr × θ/360 에서 r을 구한다 (식을 r에 대해 푼다)' : null),
    problem: (q) => {
      const v = sQ(q);
      const c = mkChoices(q.r, 2, 4, (x) => `${num(x)} cm`);
      return { text: qHtml(`중심각의 크기가 ${q.th}°이고 호의 길이가 ${T(piT(v.l))} cm인 부채꼴의 반지름의 길이는?`, c.items), answer: ansOf(c) };
    },
    relation: (q, v) => rd('호 ÷ 반지름', piS(q.th / 180), 'violet', '= 2π × θ/360 (θ가 같으면 일정)')
  }));

  /* ======================================================================
     ② 기본형 — 중심각과 호·넓이의 비례 (원 O에서)
     ====================================================================== */

  /* ---------- 11-02 중심각 30°↔호 6 cm, 45°↔호 x, y°↔호 15 cm ---------- */
  build({
    id: '1102', title: '중심각과 호의 길이 · x+y', short: '호의 비례 (11-02)',
    question: '한 원에서 중심각이 2배, 3배가 되면 호의 길이는 어떻게 될까? 6 cm가 30°일 때 45°와 15 cm는?',
    guide: '세 부채꼴의 <b>중심각</b>을 손잡이로 끌거나 막대로 바꿔 보세요. 호의 길이가 중심각에 정비례하므로 <b>호 ÷ 중심각</b>은 늘 같습니다.',
    box: { x: [-135, 135], y: [-135, 135] },
    params: {
      u: { value: 1, min: 0.5, max: 2.5, step: 0.5, color: 'sky', label: '5°에 해당하는 호의 길이', format: (v) => v + ' cm' },
      t1: { value: 30, min: 10, max: 60, step: 5, color: 'amber', label: '왼쪽 중심각', format: (v) => v + '°' },
      t2: { value: 45, min: 10, max: 80, step: 5, color: 'amber', label: '오른쪽 중심각', format: (v) => v + '°' },
      y: { value: 75, min: 20, max: 120, step: 5, color: 'rose', label: '아래쪽 중심각 y', format: (v) => v + '°' }
    },
    controls: ['t1', 't2', 'y', 'u'],
    steps: (q) => {
      const k = q.u / 5, l1 = k * q.t1, x = k * q.t2, l3 = k * q.y;
      return [`① ${num(l1)} : x = ${q.t1} : ${q.t2} → x = ${num(x)}`, `② ${num(l1)} : ${num(l3)} = ${q.t1} : y → y = ${q.y}`, `③ x + y = ${num(x)} + ${q.y} = ${num(x + q.y)}`];
    },
    work: (q) => {
      const k = q.u / 5, l1 = k * q.t1, x = k * q.t2, l3 = k * q.y;
      return [
        `호의 길이는 중심각에 정비례하므로 $${num(l1, true)}:x=${q.t1}:${q.t2}$, $x=${num(l1, true)}\\times\\frac{${q.t2}}{${q.t1}}=${num(x, true)}$`,
        `$${num(l1, true)}:${num(l3, true)}=${q.t1}:y$, $y=${q.t1}\\times\\frac{${num(l3, true)}}{${num(l1, true)}}=${q.y}$`,
        `$x+y=${num(x, true)}+${q.y}=${num(x + q.y, true)}$`
      ];
    },
    chips: (q, mode, step) => {
      const k = q.u / 5, l1 = k * q.t1, x = k * q.t2;
      if (mode === 'review' && step === 1) return [{ k: '비례식', tex: `${num(l1, true)}:x=${q.t1}:${q.t2}\\ \\Rightarrow\\ x=${num(x, true)}`, color: 'rose' }];
      if (mode === 'review' && step === 2) return [{ k: '비례식', tex: `${num(l1, true)}:${num(k * q.y, true)}=${q.t1}:y\\ \\Rightarrow\\ y=${q.y}`, color: 'rose' }];
      if (mode === 'review') return [{ k: '합', tex: `x+y=${num(x, true)}+${q.y}=${num(x + q.y, true)}`, color: 'rose' }];
      if (mode === 'explore') return [{ k: '1°당 호', tex: `\\frac{${num(l1, true)}}{${q.t1}}=${num(k, true)}\\ \\text{cm}`, color: 'amber' }];
      return [];
    },
    rule: (q) => (q.step >= 3 ? '한 원에서 호의 길이 ∝ 중심각 → (호) : (호) = (중심각) : (중심각)' : null),
    view: (q, mode) => {
      const k = q.u / 5;
      return {
        readouts: [
          rd('원의 둘레', num(72 * q.u) + ' cm', 'sky', '중심각 360° = 5°의 72배'),
          rd('호 ÷ 중심각', num(k) + ' cm/°', 'amber', '모든 호에서 같음'),
          rd('왼쪽', `${q.t1}° ↔ ${num(k * q.t1)} cm`, 'amber'),
          rd('오른쪽 x', `${q.t2}° ↔ ${num(k * q.t2)} cm`, 'rose'),
          rd('아래쪽 y', `${q.y}° ↔ ${num(k * q.y)} cm`, 'rose')
        ]
      };
    },
    problem: (q) => {
      const k = q.u / 5, x = k * q.t2, ans = x + q.y;
      const c = mkChoices(ans, 4, 3, (v) => num(v));
      return { text: qHtml('오른쪽 그림의 원 O에서 $x+y$의 값은?', c.items), answer: ansOf(c) };
    },
    draw(g, q, mode, step) {
      const O = [0, 0], R = 100, k = q.u / 5;
      g.reserve([-R - 10, -R - 10], [R + 10, R + 10]);
      const a1 = 180 - q.t1, a2 = q.t2, b0 = 270 - q.y / 2, b1 = 270 + q.y / 2;
      const hi = (n) => (mode !== 'review' ? 0.18 : step === 3 ? 0.26 : n === 'L' ? 0.28 : step === 1 && n === 'R' ? 0.28 : step === 2 && n === 'B' ? 0.28 : 0.06);
      g.arc(O, R, a1, 180, { sector: true, fill: 'amber', fillAlpha: hi('L'), stroke: false });
      g.arc(O, R, 0, a2, { sector: true, fill: 'rose', fillAlpha: hi('R'), stroke: false });
      g.arc(O, R, b0, b1, { sector: true, fill: 'rose', fillAlpha: hi('B'), stroke: false });
      g.circle(O, R, { color: 'ink', alpha: 0.9, width: 2.4 });
      g.seg([-R, 0], [R, 0], { color: 'ink', width: 2.4 });
      [a1, a2, b0, b1].forEach((a) => g.seg(O, g.pol(O, R, a), { color: 'ink', width: 2.4 }));
      const showX = mode === 'explore' || (mode === 'review' && step >= 1);
      const showY = mode === 'explore' || (mode === 'review' && step >= 2);
      g.arc(O, R, a1, 180, { color: 'amber', width: 5 });
      g.arc(O, R, 0, a2, { color: 'rose', width: 5 });
      g.arc(O, R, b0, b1, { color: 'amber', width: 5 });
      g.ang(O, a1, 180, { r: 22, color: 'amber', label: q.t1 + '°', lr: 46 });
      g.ang(O, 0, a2, { r: 22, color: 'amber', label: q.t2 + '°', lr: 46 });
      g.ang(O, b0, b1, { r: 22, color: 'rose', label: showY ? q.y + '°' : 'y°', lr: 44, dy: 4 });
      g.out(g.pol(O, R, (a1 + 180) / 2), (a1 + 180) / 2, num(k * q.t1) + ' cm', { color: 'amber' }, 30);
      g.out(g.pol(O, R, a2 / 2), a2 / 2, showX ? 'x = ' + num(k * q.t2) + ' cm' : 'x cm', { color: 'rose' }, 34);
      g.out(g.pol(O, R, 270), 270, num(k * q.y) + ' cm', { color: 'amber' }, 28);
      if (mode === 'explore') {
        g.handle('L', g.pol(O, R, a1), { color: 'amber', label: '', drag: (w) => { const a = mod(dirOf(O, w), 360); q.t1 = clamp(snap(180 - clamp(a, 90, 190), 5), 10, 60); } });
        g.handle('R', g.pol(O, R, a2), { color: 'amber', label: '', drag: (w) => { let a = mod(dirOf(O, w), 360); if (a > 180) a = 0; q.t2 = clamp(snap(a, 5), 10, 80); } });
        g.handle('B', g.pol(O, R, b1), { color: 'rose', label: '', drag: (w) => { let a = mod(dirOf(O, w), 360); if (a < 100) a += 360; q.y = clamp(snap(2 * (clamp(a, 270, 330) - 270), 5), 20, 120); } });
      }
      g.dot(O, { color: 'ink', r: 4, label: 'O', dx: 0, dy: -16, align: 'center' });
    }
  });

  const angD = (x) => { const [n, d] = rat(x); return d !== 0 && !decOK(d) ? String(+x.toFixed(1)) : num(x); };

  /* ---------- 11-03 호의 길이의 비 AB : BC : CA = 3 : 5 : 7 → ∠AOB ---------- */
  build({
    id: '1103', title: '호의 길이의 비로 중심각 구하기', short: '호의 비 (11-03)',
    question: '원을 호의 길이의 비 3 : 5 : 7 로 나누면, 각 호에 대한 중심각은 얼마일까?',
    guide: '막대로 <b>호의 비</b>를 바꿔 보세요. 원을 비의 합만큼 똑같이 나눈 <b>한 칸</b>이 중심각 몇 도인지 눈금으로 확인합니다.',
    box: { x: [-130, 130], y: [-130, 130] },
    params: {
      a: { value: 3, min: 1, max: 9, step: 1, color: 'rose', label: '호 AB의 비', format: (v) => String(v) },
      b: { value: 5, min: 1, max: 9, step: 1, color: 'sky', label: '호 BC의 비', format: (v) => String(v) },
      c: { value: 7, min: 1, max: 9, step: 1, color: 'sky', label: '호 CA의 비', format: (v) => String(v) }
    },
    controls: ['a', 'b', 'c'],
    presets: [
      { label: '3 : 5 : 7', apply: (q) => { q.a = 3; q.b = 5; q.c = 7; }, on: (q) => q.a === 3 && q.b === 5 && q.c === 7 },
      { label: '1 : 2 : 3', apply: (q) => { q.a = 1; q.b = 2; q.c = 3; }, on: (q) => q.a === 1 && q.b === 2 && q.c === 3 },
      { label: '2 : 3 : 4', apply: (q) => { q.a = 2; q.b = 3; q.c = 4; }, on: (q) => q.a === 2 && q.b === 3 && q.c === 4 },
      { label: '3 : 4 : 5', apply: (q) => { q.a = 3; q.b = 4; q.c = 5; }, on: (q) => q.a === 3 && q.b === 4 && q.c === 5 }
    ],
    steps: (q) => {
      const tot = q.a + q.b + q.c, u = 360 / tot;
      return [`① 원 전체를 ${q.a}+${q.b}+${q.c} = ${tot} 칸으로 나눈다 (한 칸 = 360° ÷ ${tot} = ${angD(u)}°)`, `② ∠AOB = ${angD(u)}° × ${q.a} = ${angD(u * q.a)}°`];
    },
    work: (q) => {
      const tot = q.a + q.b + q.c, u = 360 / tot;
      return [
        `호의 길이의 비가 $${q.a}:${q.b}:${q.c}$ 이므로 중심각의 비도 같습니다. 전체 $${q.a}+${q.b}+${q.c}=${tot}$ 칸, 한 칸 $=360^\\circ\\div${tot}=${num(u, true)}^\\circ$`,
        `$\\angle AOB=360^\\circ\\times\\frac{${q.a}}{${tot}}=${num(u * q.a, true)}^\\circ$`
      ];
    },
    chips: (q, mode, step) => {
      const tot = q.a + q.b + q.c, u = 360 / tot;
      if (mode === 'review' && step === 1) return [{ k: '한 칸', tex: `\\frac{360^\\circ}{${tot}}=${num(u, true)}^\\circ`, color: 'green' }];
      if (mode === 'review') return [{ k: '답', tex: `\\angle AOB=360^\\circ\\times\\frac{${q.a}}{${tot}}=${num(u * q.a, true)}^\\circ`, color: 'rose' }];
      return [];
    },
    rule: (q) => (q.step >= 2 ? '한 원에서 호의 길이의 비 = 중심각의 비 → 360° × (비 ÷ 비의 합)' : null),
    view: (q) => {
      const tot = q.a + q.b + q.c, u = 360 / tot;
      return {
        alert: 360 % tot === 0 ? null : { tone: 'info', text: `비의 합 ${tot}은 360의 약수가 아니라서 각이 소수로 나옵니다(근삿값). 합이 6, 8, 9, 10, 12, 15, 18, 20, 24 가 되게 맞추면 깔끔해요.` },
        readouts: [
          rd('호의 비  AB : BC : CA', `${q.a} : ${q.b} : ${q.c}`, 'violet', `합 ${tot}`),
          rd('한 칸의 중심각', angD(u) + '°', 'green', `360° ÷ ${tot}`),
          rd('∠AOB', angD(u * q.a) + '°', 'rose'),
          rd('∠BOC', angD(u * q.b) + '°', 'sky'),
          rd('∠COA', angD(u * q.c) + '°', 'sky')
        ]
      };
    },
    problem: (q) => {
      const tot = q.a + q.b + q.c, u = 360 / tot;
      const c = mkChoices(u * q.a, 3, 0, (v) => angD(v) + '°');
      return { text: qHtml(`오른쪽 그림의 원 O에서 $\\widehat{AB}:\\widehat{BC}:\\widehat{CA}=${q.a}:${q.b}:${q.c}$일 때, $\\angle AOB$의 크기는?`, c.items), answer: ansOf(c) };
    },
    draw(g, q, mode, step) {
      const O = [0, 0], R = 100, tot = q.a + q.b + q.c, u = 360 / tot;
      g.reserve([-R - 14, -R - 14], [R + 14, R + 14]);
      const A0 = 125, B0 = A0 + u * q.a, C0 = B0 + u * q.b, E0 = A0 + 360;
      g.arc(O, R, A0, B0, { sector: true, fill: 'rose', fillAlpha: 0.24, stroke: false });
      g.circle(O, R, { color: 'ink', alpha: 0.9, width: 2.4 });
      const showTicks = mode === 'explore' || (mode === 'review' && step === 1);
      if (showTicks) for (let i = 0; i < tot; i++) { const a = A0 + u * i; g.seg(g.pol(O, R - 7, a), g.pol(O, R + 7, a), { color: 'green', width: 2.4 }); }
      g.arc(O, R, A0, B0, { color: 'rose', width: 5.2 });
      g.arc(O, R, B0, C0, { color: 'sky', width: 5.2 });
      g.arc(O, R, C0, E0, { color: 'sky', width: 5.2 });
      [A0, B0, C0].forEach((a) => g.seg(O, g.pol(O, R, a), { color: 'ink', width: 2.4 }));
      const showAng = mode === 'explore' || (mode === 'review' && step >= 2);
      g.ang(O, A0, B0, { r: 24, color: 'rose', label: showAng ? angD(u * q.a) + '°' : '?°', lr: 52, size: 17 });
      const rl = (a0, a1, n) => g.out(g.pol(O, R, (a0 + a1) / 2), (a0 + a1) / 2, String(n), { color: 'amber', size: 19 }, 24);
      rl(A0, B0, q.a); rl(B0, C0, q.b); rl(C0, E0, q.c);
      if (showTicks) g.text(O, '한 칸 ' + angD(u) + '°', { color: 'green', size: 15, dy: 48 });
      if (mode === 'explore') { g.text(g.pol(O, R * 0.5, (B0 + C0) / 2), angD(u * q.b) + '°', { color: 'sky' }); g.text(g.pol(O, R * 0.5, (C0 + E0) / 2), angD(u * q.c) + '°', { color: 'sky' }); }
      const pn = (n, a, o) => g.dot(g.pol(O, R, a), { color: 'ink', label: n, toward: O });
      pn('A', A0); pn('B', B0); pn('C', C0);
      g.dot(O, { color: 'ink', r: 4, label: 'O', dx: 12, dy: 14, align: 'center' });
    }
  });

  /* ---------- 11-06 중심각과 부채꼴의 넓이 ---------- */
  build({
    id: '1106', title: '중심각과 부채꼴의 넓이', short: '넓이의 비례 (11-06)',
    question: '한 원에서 부채꼴의 넓이는 중심각과 어떤 관계일까? 120°일 때 넓이를 알면 40°일 때는?',
    guide: '두 부채꼴의 <b>중심각</b>을 손잡이로 끌어 바꿔 보세요. 넓이의 비가 <b>중심각의 비</b>와 같습니다.',
    box: { x: [-135, 135], y: [-135, 135] },
    params: {
      S: { value: 72, min: 36, max: 144, step: 36, color: 'sky', label: '원 전체의 넓이', format: (v) => v + 'π cm²' },
      al: { value: 120, min: 30, max: 200, step: 10, color: 'amber', label: '∠AOB (노랑)', format: (v) => v + '°' },
      be: { value: 40, min: 10, max: 90, step: 10, color: 'rose', label: '∠COD (분홍)', format: (v) => v + '°' }
    },
    controls: ['al', 'be', 'S'],
    steps: (q) => {
      const a = (q.S * q.al) / 360, x = (q.S * q.be) / 360;
      return [`① 넓이는 중심각에 정비례 : ${piS(a)} : x = ${q.al} : ${q.be}`, `② x = ${piS(a)} × ${q.be}/${q.al} = ${piS(x)}`];
    },
    work: (q) => {
      const a = (q.S * q.al) / 360, x = (q.S * q.be) / 360;
      return [
        `부채꼴의 넓이는 중심각에 정비례하므로 $${piT(a)}:x=${q.al}:${q.be}$`,
        `$x=${piT(a)}\\times\\frac{${q.be}}{${q.al}}=${piT(x)}$ (cm²)`
      ];
    },
    chips: (q, mode, step) => {
      const a = (q.S * q.al) / 360, x = (q.S * q.be) / 360;
      if (mode === 'review') return step === 1 ? [{ k: '비례식', tex: `${piT(a)}:x=${q.al}:${q.be}`, color: 'amber' }] : [{ k: '답', tex: `x=${piT(a)}\\times\\frac{${q.be}}{${q.al}}=${piT(x)}`, color: 'rose' }];
      if (mode === 'explore') return [{ k: '넓이 ÷ 중심각', tex: `\\frac{${piT(a)}}{${q.al}}=\\frac{x}{${q.be}}=${piT(q.S / 360)}`, color: 'green' }];
      return [];
    },
    rule: (q) => (q.step >= 2 ? '한 원에서 부채꼴의 넓이는 중심각의 크기에 정비례한다' : null),
    view: (q) => {
      const a = (q.S * q.al) / 360, x = (q.S * q.be) / 360;
      return {
        readouts: [
          rd('원 전체의 넓이', piS(q.S) + ' cm²', 'sky'),
          rd('부채꼴 AOB (노랑)', piS(a) + ' cm²', 'amber', `중심각 ${q.al}°`),
          rd('부채꼴 COD (분홍)', piS(x) + ' cm²', 'rose', `중심각 ${q.be}°`),
          rd('넓이의 비 = 중심각의 비', `${frS(q.al / q.be)} : 1`, 'green', `${q.al}° : ${q.be}°`)
        ]
      };
    },
    problem: (q) => {
      const a = (q.S * q.al) / 360, x = (q.S * q.be) / 360;
      const c = mkChoices(x, 1, 4, (v) => `${T(piT(v))} cm²`);
      return { text: qHtml(`오른쪽 그림의 원 O에서 $\\angle AOB=${q.al}^\\circ$, $\\angle COD=${q.be}^\\circ$이고 부채꼴 AOB의 넓이가 ${T(piT(a))} cm²일 때, 부채꼴 COD의 넓이는?`, c.items), answer: ansOf(c) };
    },
    draw(g, q, mode, step) {
      const O = [0, 0], R = 100;
      g.reserve([-R - 10, -R - 10], [R + 10, R + 10]);
      const a = (q.S * q.al) / 360, x = (q.S * q.be) / 360;
      const A0 = 180 - q.al / 2, A1 = 180 + q.al / 2, D0 = -q.be / 2, D1 = q.be / 2;
      const hi = mode === 'review' && step === 1 ? 0.34 : 0.26;
      g.arc(O, R, A0, A1, { sector: true, fill: 'amber', fillAlpha: hi, stroke: false });
      g.arc(O, R, D0, D1, { sector: true, fill: 'rose', fillAlpha: hi, stroke: false });
      g.circle(O, R, { color: 'ink', alpha: 0.9, width: 2.4 });
      [A0, A1, D0, D1].forEach((t) => g.seg(O, g.pol(O, R, t), { color: 'ink', width: 2.4 }));
      g.arc(O, R, A0, A1, { color: 'amber', width: 4.6 });
      g.arc(O, R, D0, D1, { color: 'rose', width: 4.6 });
      g.ang(O, A0, A1, { r: 22, color: 'amber', label: q.al + '°', lr: 46, mid: 180, dy: 0 });
      g.ang(O, D0, D1, { r: 24, color: 'rose', label: q.be + '°', lr: 56, mid: 0 });
      const showX = mode === 'explore' || (mode === 'review' && step >= 2);
      g.text(g.pol(O, R * 0.62, 180), '넓이 ' + piS(a) + ' cm²', { color: 'amber', size: 16, dy: -34, dx: -10 });
      g.text(g.pol(O, R * 0.56, 0), showX ? '넓이 ' + piS(x) + ' cm²' : '넓이 ? cm²', { color: 'rose', size: 16, dy: -30 });
      g.dot(g.pol(O, R, A0), { color: 'ink', label: 'A', toward: O });
      g.dot(g.pol(O, R, A1), { color: 'ink', label: 'B', toward: O });
      g.dot(g.pol(O, R, D0), { color: 'ink', label: 'C', toward: O });
      g.dot(g.pol(O, R, D1), { color: 'ink', label: 'D', toward: O });
      if (mode === 'explore') {
        g.handle('A', g.pol(O, R, A0), { color: 'amber', drag: (w) => { const t = mod(dirOf(O, w), 360); q.al = clamp(snap(2 * (180 - clamp(t, 60, 200)), 10), 30, 200); } });
        g.handle('D', g.pol(O, R, D1), { color: 'rose', drag: (w) => { let t = mod(dirOf(O, w), 360); if (t > 180) t = 0; q.be = clamp(snap(2 * t, 10), 10, 90); } });
      }
      g.dot(O, { color: 'ink', r: 4, label: 'O', dx: 0, dy: 16, align: 'center' });
    }
  });

  /* ======================================================================
     ② 기본형 · ③ 길이·둘레 — 반지름·평행선·이등변삼각형으로 중심각 찾기
     ====================================================================== */
  /** 평행 표시(>) : 선분 p→q 가운데에 화살촉 모양 */
  function parMark(g, p, q, col, f = 0.5) {
    const m = [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f], a = Math.atan2(q[1] - p[1], q[0] - p[0]), L = 5.5;
    [-3, 3].forEach((o) => {
      const c = [m[0] + Math.cos(a) * o, m[1] + Math.sin(a) * o];
      g.seg(c, [c[0] - Math.cos(a - 0.6) * L, c[1] - Math.sin(a - 0.6) * L], { color: col, width: 2.2 });
      g.seg(c, [c[0] - Math.cos(a + 0.6) * L, c[1] - Math.sin(a + 0.6) * L], { color: col, width: 2.2 });
    });
  }

  /* ---------- 17-19 (서술형) AB 지름, 호 AC = n × 호 BC → ∠x ---------- */
  build({
    id: '1719', title: '지름과 호의 비로 ∠x 구하기 (서술형)', short: '∠x 구하기 (17-19)', tag: '교재 문제 · 서술형',
    question: '지름 AB 위쪽의 호 AC가 호 BC의 n배라면, 점 A에서 본 각 ∠x(= ∠CAB)는 얼마일까?',
    guide: '점 <b>C</b>를 끌거나 막대로 <b>호의 비 n</b>을 바꿔 보세요. 호의 비 n : 1 이 되는 자리에서 ∠x가 어떻게 변하는지 봅니다.',
    box: { x: [-135, 135], y: [-135, 135] },
    params: { n: { value: 4, min: 1, max: 9, step: 1, color: 'amber', label: '호 AC ÷ 호 BC', format: (v) => v + ' 배' } },
    controls: ['n'],
    steps: (q) => {
      const ph = 180 / (q.n + 1);
      return [`① 호 AC : 호 BC = ${q.n} : 1, 두 호의 합 = 반원(180°) → ∠BOC = ${num(ph)}°, ∠AOC = ${num(180 - ph)}°`, `② △OAC는 OA = OC인 이등변삼각형 → ∠x = (180° − ${num(180 - ph)}°) ÷ 2 = ${num(ph / 2)}°`];
    },
    work: (q) => {
      const ph = 180 / (q.n + 1);
      return [
        `$\\widehat{AC}+\\widehat{BC}$ 는 반원이므로 중심각의 합은 $180^\\circ$. 호의 비가 $${q.n}:1$ 이므로 $\\angle BOC=180^\\circ\\times\\frac{1}{${q.n + 1}}=${num(ph, true)}^\\circ$, $\\angle AOC=180^\\circ\\times\\frac{${q.n}}{${q.n + 1}}=${num(180 - ph, true)}^\\circ$ [3점]`,
        `$\\triangle OAC$ 에서 $\\overline{OA}=\\overline{OC}$ (반지름) 이므로 이등변삼각형. $\\angle x=\\frac{180^\\circ-${num(180 - ph, true)}^\\circ}{2}=${num(ph / 2, true)}^\\circ$ [3점]`
      ];
    },
    chips: (q, mode, step) => {
      const ph = 180 / (q.n + 1);
      if (mode === 'review') return step === 1 ? [{ k: '중심각', tex: `\\angle AOC=${num(180 - ph, true)}^\\circ,\\ \\angle BOC=${num(ph, true)}^\\circ`, color: 'green' }] : [{ k: '답', tex: `\\angle x=\\frac{180^\\circ-${num(180 - ph, true)}^\\circ}{2}=${num(ph / 2, true)}^\\circ`, color: 'rose' }];
      return [];
    },
    rule: (q) => (q.step >= 2 ? '호의 비 → 중심각 → 이등변삼각형의 밑각: ∠x = ½ × ∠BOC' : null),
    view: (q) => {
      const ph = 180 / (q.n + 1);
      return {
        readouts: [
          rd('호의 비  AC : BC', `${q.n} : 1`, 'violet'),
          rd('∠BOC', num(ph) + '°', 'green', '호 BC의 중심각'),
          rd('∠AOC', num(180 - ph) + '°', 'green', '호 AC의 중심각'),
          rd('∠x (= ∠CAB)', num(ph / 2) + '°', 'rose', '이등변삼각형의 밑각')
        ]
      };
    },
    problem: (q) => ({
      text: `<p class="cs-q">오른쪽 그림과 같은 원 O에서 $\\overline{AB}$는 지름이고 $\\widehat{AC}$의 길이가 $\\widehat{BC}$의 길이의 ${q.n}배일 때, $\\angle x$의 크기를 구하고, 그 과정을 서술하시오. [6점]</p>`,
      answer: `∠x = ${num(90 / (q.n + 1))}°`
    }),
    draw(g, q, mode, step) {
      const O = [0, 0], R = 100, ph = 180 / (q.n + 1), x = ph / 2;
      g.reserve([-R - 16, -R - 16], [R + 16, R + 16]);
      const A = [-R, 0], B = [R, 0], C = g.pol(O, R, ph);
      const s1 = mode === 'explore' || (mode === 'review' && step >= 1);
      const s2 = mode === 'explore' || (mode === 'review' && step >= 2);
      g.circle(O, R, { color: 'ink', alpha: 0.9, width: 2.4 });
      g.poly([O, A, C], { color: null, fill: 'amber', fillAlpha: 0.12, stroke: false });
      g.seg(A, B, { color: 'ink', width: 2.6 });
      g.seg(O, C, { color: 'ink', width: 2.6 });
      g.seg(A, C, { color: 'ink', width: 2.6 });
      g.tick(O, A, { color: 'amber' }); g.tick(O, C, { color: 'amber' }); g.tick(O, B, { color: 'amber' });
      g.arc(O, R, 0, ph, { color: 'sky', width: 5 });
      g.arc(O, R, ph, 180, { color: 'amber', width: 5 });
      g.out(g.pol(O, R, ph / 2), ph / 2, '1', { color: 'sky', size: 19 }, 22);
      g.out(g.pol(O, R, (ph + 180) / 2), (ph + 180) / 2, String(q.n), { color: 'amber', size: 19 }, 22);
      // ∠x 는 A에서
      g.ang(A, 0, x, { r: 34, color: 'rose', label: s2 ? num(x) + '°' : 'x', lr: 62, mid: Math.min(x / 2, 14), size: 17, dy: -8 });
      if (s1) {
        g.ang(O, 0, ph, { r: 24, color: 'sky', label: num(ph) + '°', lr: 52, size: 15, mid: Math.min(ph / 2, 24) });
        g.ang(O, ph, 180, { r: 20, color: 'amber', label: num(180 - ph) + '°', lr: 40, size: 15, mid: (ph + 180) / 2 });
      }
      if (s2) {
        // C에서의 밑각: 변 CO 방향과 변 CA 방향 사이
        const dCO = Math.atan2(-C[1], -C[0]) / D2R, dCA = Math.atan2(A[1] - C[1], A[0] - C[0]) / D2R;
        g.ang(C, Math.min(dCO, dCA), Math.max(dCO, dCA), { r: 28, color: 'rose', label: '', fa: 0.22 });
      }
      if (mode === 'explore') g.handle('C', C, { color: 'amber', label: 'C', toward: O, drag: (w) => { const a = clamp(dirOf(O, w), 5, 175); q.n = clamp(Math.round(180 / a - 1), 1, 9); } });
      else g.dot(C, { color: 'ink', label: 'C', toward: O });
      g.dot(A, { color: 'ink', label: 'A', dx: -12, dy: 16, align: 'center' });
      g.dot(B, { color: 'ink', label: 'B', dx: 12, dy: 16, align: 'center' });
      g.dot(O, { color: 'ink', r: 4, label: 'O', dx: 0, dy: 18, align: 'center' });
    }
  });

  /* ---------- 18-07 AB = CD = DE = EF, ∠COF → ∠AOB ---------- */
  build({
    id: '1807', title: '같은 길이의 현과 중심각', short: '같은 현 (18-07)',
    question: '현의 길이가 같으면 중심각도 같을까? 세 개의 같은 중심각이 모인 ∠COF로 ∠AOB를 구해 보자.',
    guide: '점 <b>F</b>를 끌거나 막대로 <b>∠COF</b>를 바꿔 보세요. 같은 현 4개에 대한 중심각은 모두 같아서, ∠AOB는 ∠COF의 3분의 1입니다.',
    box: { x: [-135, 135], y: [-135, 135] },
    params: { cof: { value: 105, min: 60, max: 180, step: 3, color: 'amber', label: '∠COF', format: (v) => v + '°' } },
    controls: ['cof'],
    steps: (q) => [`① 현의 길이가 같으면 중심각도 같다 : ∠AOB = ∠COD = ∠DOE = ∠EOF`, `② ∠COF = 3 × ∠AOB = ${q.cof}° → ∠AOB = ${num(q.cof / 3)}°`],
    work: (q) => [
      '한 원에서 길이가 같은 현에 대한 중심각의 크기는 같으므로 $\\angle AOB=\\angle COD=\\angle DOE=\\angle EOF$',
      `$\\angle COF=\\angle COD+\\angle DOE+\\angle EOF=3\\times\\angle AOB=${q.cof}^\\circ$ 이므로 $\\angle AOB=${q.cof}^\\circ\\div3=${num(q.cof / 3, true)}^\\circ$`
    ],
    chips: (q, mode, step) => (mode === 'review' ? (step === 1 ? [{ k: '같은 중심각', tex: '\\angle AOB=\\angle COD=\\angle DOE=\\angle EOF', color: 'green' }] : [{ k: '답', tex: `\\angle AOB=${q.cof}^\\circ\\div3=${num(q.cof / 3, true)}^\\circ`, color: 'rose' }]) : []),
    rule: (q) => (q.step >= 2 ? '같은 현 → 같은 중심각. ∠COF는 같은 각 3개의 합' : null),
    view: (q) => ({
      readouts: [
        rd('∠COF = 3 × (같은 각)', q.cof + '°', 'amber'),
        rd('같은 중심각 하나', num(q.cof / 3) + '°', 'rose', '∠AOB = ∠COD = ∠DOE = ∠EOF'),
        rd('같은 현 4개', 'AB = CD = DE = EF', 'green')
      ]
    }),
    problem: (q) => {
      const c = mkChoices(q.cof / 3, 5, 2, (v) => num(v) + '°');
      return { text: qHtml(`오른쪽 그림의 원 O에서 $\\overline{AB}=\\overline{CD}=\\overline{DE}=\\overline{EF}$이고 $\\angle COF=${q.cof}^\\circ$일 때, $\\angle AOB$의 크기는?`, c.items), answer: ansOf(c) };
    },
    draw(g, q, mode, step) {
      const O = [0, 0], R = 100, x = q.cof / 3;
      g.reserve([-R - 18, -R - 18], [R + 18, R + 18]);
      const cA = 180 - x / 2, cB = 180 + x / 2, c0 = -q.cof / 2;
      const ang = [c0, c0 + x, c0 + 2 * x, c0 + 3 * x]; // C D E F
      const s1 = mode !== 'problem';
      g.circle(O, R, { color: 'ink', alpha: 0.9, width: 2.4 });
      [cA, cB, ...ang].forEach((a) => g.seg(O, g.pol(O, R, a), { color: 'ink', width: 2.2 }));
      // 같은 현 4개 (눈금 한 개씩)
      const chords = [[cA, cB], [ang[0], ang[1]], [ang[1], ang[2]], [ang[2], ang[3]]];
      chords.forEach(([a, b]) => { const P = g.pol(O, R, a), Q = g.pol(O, R, b); g.seg(P, Q, { color: 'sky', width: 3.2 }); g.tick(P, Q, { color: 'amber' }); });
      // 같은 각 표시
      const showAll = mode === 'explore' || (mode === 'review' && step >= 1);
      const lab = mode === 'explore' || (mode === 'review' && step >= 2);
      g.ang(O, cA, cB, { r: 22, color: 'rose', label: lab ? num(x) + '°' : '?°', lr: 46, mid: 180, size: 16 });
      if (showAll) for (let i = 0; i < 3; i++) g.ang(O, ang[i], ang[i + 1], { r: 17, color: 'green', label: lab ? num(x) + '°' : '', lr: 33, size: 14, fa: 0.2 });
      g.ang(O, ang[0], ang[3], { r: 50, color: 'amber', label: q.cof + '°', lr: 68, size: 17, mid: 0, fa: 0.06 });
      const nm = ['A', 'B', 'C', 'D', 'E', 'F'], ang6 = [cA, cB, ...ang];
      nm.forEach((n, i) => {
        if (mode === 'explore' && n === 'F') g.handle('F', g.pol(O, R, ang6[i]), { color: 'amber', label: 'F', toward: O, drag: (w) => { const a = clamp(dirOf(O, w), 30, 90); q.cof = clamp(snap(2 * a, 3), 60, 180); } });
        else g.dot(g.pol(O, R, ang6[i]), { color: 'ink', label: n, toward: O });
      });
      g.dot(O, { color: 'ink', r: 4, label: 'O', dx: 0, dy: 16, align: 'center' });
    }
  });

  /* ---------- 11-04 AB ∥ CD, ∠AOC=40°, 호 AC=4π → 호 CD ---------- */
  build({
    id: '1104', title: '평행한 현과 호의 길이 (엇각 이용)', short: '평행선 (11-04)',
    question: 'AB ∥ CD 이면 ∠AOC와 ∠OCD는 어떤 관계일까? 이 각으로 호 CD의 중심각을 구해 보자.',
    guide: '점 <b>C</b>를 끌어 ∠AOC를 바꿔 보세요. 점 D는 CD가 AB와 평행하도록 따라 움직입니다. 노란 각 3개는 크기가 같습니다.',
    box: { x: [-135, 135], y: [-135, 135] },
    params: {
      r: { value: 18, min: 18, max: 54, step: 18, color: 'sky', label: '반지름 r', format: (v) => v + ' cm' },
      al: { value: 40, min: 20, max: 70, step: 10, color: 'amber', label: '∠AOC', format: (v) => v + '°' }
    },
    controls: ['al', 'r'],
    steps: (q) => {
      const cd = 180 - 2 * q.al, lAC = (q.r * q.al) / 180, lCD = (q.r * cd) / 180;
      return [`① AB ∥ CD → ∠OCD = ∠AOC = ${q.al}° (엇각), OC = OD → ∠ODC = ${q.al}° → ∠COD = 180° − 2×${q.al}° = ${cd}°`, `② 호의 길이는 중심각에 정비례 : ${piS(lAC)} : 호 CD = ${q.al} : ${cd} → 호 CD = ${piS(lCD)} cm`];
    },
    work: (q) => {
      const cd = 180 - 2 * q.al, lAC = (q.r * q.al) / 180, lCD = (q.r * cd) / 180;
      return [
        `$\\overline{AB}\\parallel\\overline{CD}$ 이므로 엇각 $\\angle OCD=\\angle AOC=${q.al}^\\circ$. $\\overline{OC}=\\overline{OD}$ 이므로 $\\angle ODC=${q.al}^\\circ$ 이고 $\\angle COD=180^\\circ-2\\times${q.al}^\\circ=${cd}^\\circ$`,
        `$${piT(lAC)}:\\widehat{CD}=${q.al}:${cd}$ 이므로 $\\widehat{CD}=${piT(lAC)}\\times\\frac{${cd}}{${q.al}}=${piT(lCD)}$ (cm)`
      ];
    },
    chips: (q, mode, step) => {
      const cd = 180 - 2 * q.al, lAC = (q.r * q.al) / 180, lCD = (q.r * cd) / 180;
      if (mode === 'review') return step === 1 ? [{ k: '∠COD', tex: `180^\\circ-2\\times${q.al}^\\circ=${cd}^\\circ`, color: 'green' }] : [{ k: '답', tex: `\\widehat{CD}=${piT(lAC)}\\times\\frac{${cd}}{${q.al}}=${piT(lCD)}`, color: 'rose' }];
      return [];
    },
    rule: (q) => (q.step >= 2 ? '평행선의 엇각 + 이등변삼각형 → ∠COD, 그 다음 호의 길이는 중심각의 비로' : null),
    view: (q) => {
      const cd = 180 - 2 * q.al;
      return {
        readouts: [
          rd('∠AOC = ∠OCD = ∠ODC', q.al + '°', 'amber', '엇각 · 이등변삼각형'),
          rd('∠COD', cd + '°', 'rose', `180° − 2 × ${q.al}°`),
          rd('호 AC', piS((q.r * q.al) / 180) + ' cm', 'amber'),
          rd('호 CD', piS((q.r * cd) / 180) + ' cm', 'rose')
        ]
      };
    },
    problem: (q) => {
      const cd = 180 - 2 * q.al, lAC = (q.r * q.al) / 180, lCD = (q.r * cd) / 180;
      const c = mkChoices(lCD, 1, 2, (v) => `${T(piT(v))} cm`);
      return { text: qHtml(`오른쪽 그림의 원 O에서 $\\overline{AB}\\parallel\\overline{CD}$이고 $\\angle AOC=${q.al}^\\circ$, $\\widehat{AC}=${piT(lAC)}$ cm일 때, $\\widehat{CD}$의 길이는?`, c.items), answer: ansOf(c) };
    },
    draw(g, q, mode, step) {
      const O = [0, 0], R = 100, al = q.al, cd = 180 - 2 * al;
      g.reserve([-R - 18, -R - 18], [R + 18, R + 18]);
      const A = [-R, 0], B = [R, 0], C = g.pol(O, R, 180 + al), D = g.pol(O, R, 360 - al);
      const s1 = mode === 'explore' || (mode === 'review' && step >= 1);
      const s2 = mode === 'explore' || (mode === 'review' && step >= 2);
      g.poly([O, C, D], { color: null, fill: 'rose', fillAlpha: 0.12, stroke: false });
      g.circle(O, R, { color: 'ink', alpha: 0.9, width: 2.4 });
      g.seg(A, B, { color: 'ink', width: 2.6 });
      g.seg(C, D, { color: 'ink', width: 2.6 });
      g.seg(O, C, { color: 'ink', width: 2.6 });
      g.seg(O, D, { color: 'ink', width: 2.6 });
      parMark(g, A, B, 'sky', 0.8); parMark(g, C, D, 'sky');
      g.tick(O, C, { color: 'amber' }); g.tick(O, D, { color: 'amber' });
      g.arc(O, R, 180, 180 + al, { color: 'amber', width: 5 });
      g.arc(O, R, 180 + al, 360 - al, { color: 'rose', width: 5 });
      g.ang(O, 180, 180 + al, { r: 24, color: 'amber', label: al + '°', lr: 40, size: 16, mid: 180 + Math.min(al / 2, 20) });
      g.ang(O, 180 + al, 360 - al, { r: 22, color: 'rose', label: s1 ? cd + '°' : '?°', lr: 46, size: 16, mid: 270 });
      if (s1) {
        // C에서 ∠OCD (엇각), D에서 ∠ODC
        g.ang(C, 0, al, { r: 24, color: 'amber', label: al + '°', lr: 40, size: 15 });
        g.ang(D, 180 - al, 180, { r: 24, color: 'amber', label: al + '°', lr: 40, size: 15 });
      }
      const lAC = (q.r * al) / 180, lCD = (q.r * cd) / 180;
      g.out(g.pol(O, R, 180 + al / 2), 180 + al / 2, '호 ' + piS(lAC) + ' cm', { color: 'amber' }, 36);
      g.out(g.pol(O, R, 270), 270, s2 ? '호 CD = ' + piS(lCD) + ' cm' : '호 CD = ? cm', { color: 'rose' }, 30);
      if (mode === 'explore') g.handle('C', C, { color: 'amber', label: 'C', toward: O, drag: (w) => { const a = mod(dirOf(O, w), 360); q.al = clamp(snap(clamp(a, 180, 330) - 180, 10), 20, 70); } });
      else g.dot(C, { color: 'ink', label: 'C', toward: O });
      g.dot(D, { color: 'ink', label: 'D', toward: O });
      g.dot(A, { color: 'ink', label: 'A', dx: -12, dy: -12, align: 'center' });
      g.dot(B, { color: 'ink', label: 'B', dx: 12, dy: -12, align: 'center' });
      g.dot(O, { color: 'ink', r: 4, label: 'O', dx: 0, dy: -16, align: 'center' });
    }
  });

  /* ---------- 11-05 반원 O에서 AC ∥ OD, ∠BOD → 호 AC ---------- */
  build({
    id: '1105', title: '반원에서 평행선과 호의 길이 (동위각·보조선)', short: '반원 평행선 (11-05)',
    question: 'AC ∥ OD 일 때 호 AC의 중심각은 어떻게 구할까? 보조선 OC를 그어 이등변삼각형을 찾아보자.',
    guide: '점 <b>D</b>를 끌어 ∠BOD를 바꿔 보세요. 점 C는 AC가 OD와 평행하도록 따라 움직입니다. 보조선 OC(점선)가 핵심입니다.',
    box: { x: [-135, 135], y: [-30, 135] },
    params: {
      r: { value: 30, min: 30, max: 90, step: 30, color: 'sky', label: '반지름 r', format: (v) => v + ' cm' },
      be: { value: 42, min: 18, max: 60, step: 6, color: 'amber', label: '∠BOD', format: (v) => v + '°' }
    },
    controls: ['be', 'r'],
    steps: (q) => {
      const ac = 180 - 2 * q.be, lBD = (q.r * q.be) / 180, lAC = (q.r * ac) / 180;
      return [`① AC ∥ OD → ∠OAC = ∠BOD = ${q.be}° (동위각), OA = OC → ∠OCA = ${q.be}° → ∠AOC = 180° − 2×${q.be}° = ${ac}°`, `② ${piS(lBD)} : 호 AC = ${q.be} : ${ac} → 호 AC = ${piS(lAC)} cm`];
    },
    work: (q) => {
      const ac = 180 - 2 * q.be, lBD = (q.r * q.be) / 180, lAC = (q.r * ac) / 180;
      return [
        `보조선 $OC$ 를 긋습니다. $\\overline{AC}\\parallel\\overline{OD}$ 이므로 동위각 $\\angle OAC=\\angle BOD=${q.be}^\\circ$, $\\overline{OA}=\\overline{OC}$ 이므로 $\\angle OCA=${q.be}^\\circ$ → $\\angle AOC=180^\\circ-2\\times${q.be}^\\circ=${ac}^\\circ$`,
        `$${piT(lBD)}:\\widehat{AC}=${q.be}:${ac}$ 이므로 $\\widehat{AC}=${piT(lBD)}\\times\\frac{${ac}}{${q.be}}=${piT(lAC)}$ (cm)`
      ];
    },
    chips: (q, mode, step) => {
      const ac = 180 - 2 * q.be, lBD = (q.r * q.be) / 180, lAC = (q.r * ac) / 180;
      if (mode === 'review') return step === 1 ? [{ k: '∠AOC', tex: `180^\\circ-2\\times${q.be}^\\circ=${ac}^\\circ`, color: 'green' }] : [{ k: '답', tex: `\\widehat{AC}=${piT(lBD)}\\times\\frac{${ac}}{${q.be}}=${piT(lAC)}`, color: 'rose' }];
      return [];
    },
    rule: (q) => (q.step >= 2 ? '평행선의 동위각 + 보조선 OC로 이등변삼각형 → ∠AOC, 호는 중심각의 비로' : null),
    view: (q) => {
      const ac = 180 - 2 * q.be;
      return {
        readouts: [
          rd('∠BOD = ∠OAC = ∠OCA', q.be + '°', 'amber', '동위각 · 이등변삼각형'),
          rd('∠AOC', ac + '°', 'rose', `180° − 2 × ${q.be}°`),
          rd('호 BD', piS((q.r * q.be) / 180) + ' cm', 'amber'),
          rd('호 AC', piS((q.r * ac) / 180) + ' cm', 'rose')
        ]
      };
    },
    problem: (q) => {
      const ac = 180 - 2 * q.be, lBD = (q.r * q.be) / 180, lAC = (q.r * ac) / 180;
      const c = mkChoices(lAC, 1, 1, (v) => `${T(piT(v))} cm`);
      return { text: qHtml(`오른쪽 그림의 반원 O에서 $\\overline{AC}\\parallel\\overline{OD}$이고 $\\angle BOD=${q.be}^\\circ$, $\\widehat{BD}=${piT(lBD)}$ cm일 때, $\\widehat{AC}$의 길이는?`, c.items), answer: ansOf(c) };
    },
    draw(g, q, mode, step) {
      const O = [0, 0], R = 100, be = q.be, ac = 180 - 2 * be;
      g.reserve([-R - 18, -24], [R + 28, R + 18]);
      const A = [-R, 0], B = [R, 0], D = g.pol(O, R, be), C = g.pol(O, R, 2 * be);
      const s1 = mode === 'explore' || (mode === 'review' && step >= 1);
      const s2 = mode === 'explore' || (mode === 'review' && step >= 2);
      if (s1) g.poly([O, A, C], { color: null, fill: 'rose', fillAlpha: 0.12, stroke: false });
      g.arc(O, R, 0, 180, { color: 'ink', alpha: 0.9, width: 2.4 });
      g.seg(A, B, { color: 'ink', width: 2.6 });
      g.seg(O, D, { color: 'ink', width: 2.6 });
      g.seg(A, C, { color: 'ink', width: 2.6 });
      parMark(g, A, C, 'sky'); parMark(g, O, D, 'sky');
      if (s1) { g.seg(O, C, { color: 'rose', width: 2.6, dash: [6, 5] }); g.tick(O, A, { color: 'amber' }); g.tick(O, C, { color: 'amber' }); }
      g.arc(O, R, 0, be, { color: 'amber', width: 5 });
      g.arc(O, R, 2 * be, 180, { color: 'rose', width: 5 });
      g.ang(O, 0, be, { r: 28, color: 'amber', label: be + '°', lr: 56, size: 16, mid: Math.min(be / 2, 20) });
      if (s1) {
        g.ang(A, 0, be, { r: 30, color: 'amber', label: be + '°', lr: 58, size: 15, mid: Math.min(be / 2, 16) });
        const dCO = Math.atan2(-C[1], -C[0]) / D2R;
        const dCA = Math.atan2(A[1] - C[1], A[0] - C[0]) / D2R;
        g.ang(C, Math.min(dCO, dCA), Math.max(dCO, dCA), { r: 26, color: 'amber', label: be + '°', lr: 56, size: 15, mid: 258 });
        g.ang(O, 2 * be, 180, { r: 20, color: 'rose', label: ac + '°', lr: 42, size: 16, mid: (2 * be + 180) / 2 });
      }
      const lBD = (q.r * be) / 180, lAC = (q.r * ac) / 180;
      g.out(g.pol(O, R, be / 2), be / 2, '호 ' + piS(lBD) + ' cm', { color: 'amber' }, 44);
      g.out(g.pol(O, R, (2 * be + 180) / 2), (2 * be + 180) / 2, s2 ? '호 AC = ' + piS(lAC) + ' cm' : '호 AC = ? cm', { color: 'rose' }, 40);
      if (mode === 'explore') g.handle('D', D, { color: 'amber', label: 'D', toward: O, drag: (w) => { q.be = clamp(snap(clamp(dirOf(O, w), 0, 90), 6), 18, 60); } });
      else g.dot(D, { color: 'ink', label: 'D', toward: O });
      g.dot(C, { color: 'ink', label: 'C', toward: O });
      g.dot(A, { color: 'ink', label: 'A', dx: -12, dy: 16, align: 'center' });
      g.dot(B, { color: 'ink', label: 'B', dx: 12, dy: 16, align: 'center' });
      g.dot(O, { color: 'ink', r: 4, label: 'O', dx: 0, dy: 18, align: 'center' });
    }
  });

  /* ---------- 18-09 정다각형의 한 꼭짓점을 중심으로 하는 부채꼴 ---------- */
  const POLY = [{ n: 3, nm: '정삼각형' }, { n: 4, nm: '정사각형' }, { n: 5, nm: '정오각형' }, { n: 6, nm: '정육각형' }, { n: 8, nm: '정팔각형' }];
  const polyOf = (q) => {
    const n = POLY[q.i - 1].n, inner = (180 * (n - 2)) / n;
    return { n, nm: POLY[q.i - 1].nm, inner, S: (q.r * q.r * inner) / 360 };
  };
  build({
    id: '1809', title: '정다각형 안의 부채꼴의 넓이', short: '정다각형 부채꼴 (18-09)',
    question: '정다각형의 한 꼭짓점을 중심으로 한 변을 반지름으로 하는 부채꼴의 중심각은 얼마일까?',
    guide: '<b>다각형 종류</b>와 <b>한 변의 길이</b>를 바꿔 보세요. 중심각은 정다각형의 <b>한 내각</b>이고, 반지름은 <b>한 변</b>입니다. 오른쪽 아래 손잡이를 끌어도 됩니다.',
    box: { x: [-112, 112], y: [-112, 112] },
    params: {
      i: { value: 3, min: 1, max: 5, step: 1, color: 'amber', label: '정다각형', format: (v) => POLY[v - 1].nm },
      r: { value: 10, min: 6, max: 12, step: 1, color: 'sky', label: '한 변의 길이', format: (v) => v + ' cm' }
    },
    controls: ['i', 'r'],
    presets: POLY.map((p, k) => ({ label: p.nm, apply: (q) => { q.i = k + 1; }, on: (q) => q.i === k + 1 })),
    steps: (q) => {
      const p = polyOf(q);
      return [`① ${p.nm}의 한 내각 = 180° × (${p.n} − 2) ÷ ${p.n} = ${num(p.inner)}°`, `② 반지름 ${q.r} cm, 중심각 ${num(p.inner)}° → 넓이 = π × ${q.r}² × ${num(p.inner)}/360 = ${piS(p.S)} cm²`];
    },
    work: (q) => {
      const p = polyOf(q);
      return [
        `${p.nm}의 한 내각의 크기는 $\\frac{180^\\circ\\times(${p.n}-2)}{${p.n}}=${num(p.inner, true)}^\\circ$ 이므로 부채꼴의 중심각은 $${num(p.inner, true)}^\\circ$, 반지름은 한 변의 길이 ${q.r} cm`,
        `부채꼴의 넓이 $=\\pi\\times${q.r}^2\\times\\frac{${num(p.inner, true)}}{360}=${piT(p.S)}$ (cm²)`
      ];
    },
    chips: (q, mode, step) => {
      const p = polyOf(q);
      if (mode === 'review') return step === 1 ? [{ k: '한 내각', tex: `\\frac{180^\\circ\\times(${p.n}-2)}{${p.n}}=${num(p.inner, true)}^\\circ`, color: 'green' }] : [{ k: '답', tex: `\\pi\\times${q.r}^2\\times\\frac{${num(p.inner, true)}}{360}=${piT(p.S)}`, color: 'rose' }];
      return [];
    },
    rule: (q) => (q.step >= 2 ? '정n각형의 한 내각 = 180°×(n−2)÷n → 부채꼴의 중심각' : null),
    view: (q) => {
      const p = polyOf(q);
      return {
        readouts: [
          rd('정다각형', p.nm, 'amber', `변 ${p.n}개`),
          rd('한 내각 (= 중심각)', num(p.inner) + '°', 'green', `180° × (${p.n} − 2) ÷ ${p.n}`),
          rd('반지름 (= 한 변)', q.r + ' cm', 'sky'),
          rd('색칠한 부채꼴의 넓이', piS(p.S) + ' cm²', 'rose')
        ]
      };
    },
    problem: (q) => {
      const p = polyOf(q);
      const c = mkChoices(p.S, 5, 4, (v) => `${T(piT(v))} cm²`);
      return { text: qHtml(`오른쪽 그림과 같이 한 변의 길이가 ${q.r} cm인 ${p.nm}에서 색칠한 부채꼴의 넓이는?`, c.items), answer: ansOf(c) };
    },
    draw(g, q, mode, step) {
      const p = polyOf(q), n = p.n;
      g.reserve([-106, -106], [106, 106]);
      const U = ((2 * Math.sin(Math.PI / n)) * 100) / 12; // 1 cm 의 월드 길이 (다각형 크기를 비슷하게 유지)
      const s = q.r * U, ap = s / (2 * Math.tan(Math.PI / n));
      const V = [[-s / 2, -ap]];
      for (let k = 0; k < n - 1; k++) { const a = (k * 360) / n * D2R, last = V[V.length - 1]; V.push([last[0] + s * Math.cos(a), last[1] + s * Math.sin(a)]); }
      const P0 = V[0], P1 = V[1];
      const s1 = mode === 'explore' || (mode === 'review' && step >= 1);
      const s2 = mode === 'explore' || (mode === 'review' && step >= 2);
      g.poly(V, { color: 'ink', alpha: 0.9, width: 2.6, fill: 'sky', fillAlpha: 0.06 });
      g.arc(P0, s, 0, p.inner, { sector: true, fill: 'sky', fillAlpha: mode === 'review' && step === 2 ? 0.45 : 0.32, stroke: false });
      g.arc(P0, s, 0, p.inner, { color: 'rose', width: 4.6 });
      for (let k = 0; k < n; k++) g.tick(V[k], V[(k + 1) % n], { color: 'amber' });
      g.ang(P0, 0, p.inner, { r: Math.min(30, s * 0.3), color: 'green', label: s1 ? num(p.inner) + '°' : '?°', lr: Math.min(30, s * 0.3) + 22, size: 16, mid: Math.min(p.inner / 2, 22) });
      g.text(g.pol(P0, s * 0.58, p.inner / 2 + 8), s2 ? '넓이 ' + piS(p.S) + ' cm²' : '넓이 ? cm²', { color: 'rose', size: 16 });
      g.text([(P0[0] + P1[0]) / 2, P0[1]], q.r + ' cm', { color: 'amber', size: 16, dy: 22 });
      if (mode === 'explore') g.handle('s', P1, { color: 'sky', drag: (w) => { q.r = clamp(Math.round((w.x - P0[0]) / U), 6, 12); } });
      g.dot(P0, { color: 'ink', r: 4, label: '', toward: [0, 0] });
    }
  });

  /* ======================================================================
     확장 — 교재 밖에서 더 경험해 보기
     ====================================================================== */

  /* ---------- 확장 1. 같은 부채꼴 n개를 모으면 원 하나 (가로로만 밀고 제자리에서 돌립니다) ---------- */
  build({
    id: 'x01', title: '확장 · 부채꼴을 모으면 원 하나', short: '확장 · 모아서 원',
    question: '원을 똑같이 나눈 부채꼴 n개를 가로로 늘어놓았다가 모으면, 중심각의 합·호의 합·넓이의 합은 얼마가 될까?',
    guide: '<b>모으기</b> 막대를 오른쪽으로 당기거나 <b>모으기 재생</b>을 눌러 보세요. 부채꼴들이 가로로 밀려 한 점에 모이며 원이 됩니다. n과 r도 바꿔 보세요.',
    box: { x: [-140, 140], y: [-64, 64] },
    params: {
      n: { value: 4, min: 2, max: 8, step: 1, color: 'amber', label: '나눈 조각 수 n', format: (v) => v + '조각' },
      r: { value: 6, min: 3, max: 9, step: 1, color: 'sky', label: '반지름 r', format: (v) => v + ' cm' },
      t: { value: 0, min: 0, max: 1, step: 0.01, color: 'green', label: '모으기', format: (v) => Math.round(v * 100) + '%', keep: true }
    },
    controls: ['n', 'r', 't'],
    actions: [{ id: 'play', play: true, primary: true, icon: (q) => (q.playing ? 'pause' : 'play'), label: (q) => (q.playing ? '멈춤' : '모으기 재생'), on: (q) => q.playing, run: (q) => { if (!q.playing && q.t >= 0.999) q.t = 0; q.playing = !q.playing; } }],
    tick: (q, dt, lab) => {
      if (lab && lab.tab === 'review') {
        const goal = q.step >= 2 ? 1 : 0, d = goal - q.t;
        if (Math.abs(d) < 0.004) { q.t = goal; return false; }
        q.t += Math.sign(d) * Math.min(Math.abs(d), dt * 0.9);
        return true;
      }
      if (!q.playing) return false;
      q.t = Math.min(1, q.t + dt / 3);
      if (q.t >= 1) q.playing = false;
      return true;
    },
    steps: (q) => [`① 원을 ${q.n}등분 : 중심각 360° ÷ ${q.n} = ${num(360 / q.n)}°`, `② 모으면 원 하나 : 중심각의 합 ${q.n} × ${num(360 / q.n)}° = 360°, 호의 합 = 원주 ${piS(2 * q.r)} cm`, `③ 부채꼴 하나 : 호 = ${piS(2 * q.r)} ÷ ${q.n} = ${piS((2 * q.r) / q.n)} cm, 넓이 = ${piS(q.r * q.r)} ÷ ${q.n} = ${piS((q.r * q.r) / q.n)} cm²`],
    work: (q) => [
      `원을 ${q.n}등분하면 한 부채꼴의 중심각은 $360^\\circ\\div${q.n}=${num(360 / q.n, true)}^\\circ$`,
      `${q.n}개를 모으면 원이므로 중심각의 합은 $${q.n}\\times${num(360 / q.n, true)}^\\circ=360^\\circ$, 호의 길이의 합은 원주 $2\\pi\\times${q.r}=${piT(2 * q.r)}$ (cm), 넓이의 합은 $\\pi\\times${q.r}^2=${piT(q.r * q.r)}$ (cm²)`,
      `부채꼴 하나의 호의 길이 $=${piT(2 * q.r)}\\div${q.n}=${piT((2 * q.r) / q.n)}$ (cm), 넓이 $=${piT(q.r * q.r)}\\div${q.n}=${piT((q.r * q.r) / q.n)}$ (cm²)`
    ],
    chips: (q, mode, step) => {
      if (mode === 'problem') return [];
      return [{ k: '중심각', tex: `${q.n}\\times${num(360 / q.n, true)}^\\circ=360^\\circ`, color: 'amber' }, { k: '호', tex: `${q.n}\\times${piT((2 * q.r) / q.n)}=${piT(2 * q.r)}`, color: 'rose' }];
    },
    rule: (q) => (q.step >= 3 ? '부채꼴 n개를 모으면 원 → 호 = 원주 ÷ n, 넓이 = 원의 넓이 ÷ n' : null),
    view: (q) => ({
      readouts: [
        rd('조각 수 n', q.n + '개', 'amber'),
        rd('조각 하나의 중심각', num(360 / q.n) + '°', 'amber', '모두 모으면 360°'),
        rd('조각 하나의 호', piS((2 * q.r) / q.n) + ' cm', 'rose', '모두 모으면 원주 ' + piS(2 * q.r) + ' cm'),
        rd('조각 하나의 넓이', piS((q.r * q.r) / q.n) + ' cm²', 'green', '모두 모으면 원 ' + piS(q.r * q.r) + ' cm²')
      ]
    }),
    problem: (q) => {
      const l = (2 * q.r) / q.n, c = mkChoices(l, 1, 2, (v) => `${T(piT(v))} cm`);
      return { text: qHtml(`반지름의 길이가 ${q.r} cm인 원을 똑같이 ${q.n}조각으로 나눈 부채꼴 하나의 호의 길이는?`, c.items), answer: ansOf(c) };
    },
    draw(g, q, mode, step, lab) {
      const n = q.n, th = 360 / n, Rw = 62, t = clamp(q.t, 0, 1);
      g.reserve([-126, -Rw - 28], [126, Rw + 28]);
      const c = 2 * Rw * Math.sin((Math.min(th, 180) * D2R) / 2), W = c / 2 + Rw * 0.08;
      for (let i = 0; i < n; i++) {
        const X = (i - (n - 1) / 2) * W * (1 - t);
        const p0 = i % 2 === 0 ? 90 : 270, p1 = 90 + i * th;
        const phi = p0 + t * (p1 - p0);
        const a0 = phi - th / 2, a1 = phi + th / 2, A = [X, 0];
        g.arc(A, Rw, a0, a1, { sector: true, fill: i === 0 ? 'amber' : 'sky', fillAlpha: i === 0 ? 0.42 : 0.26, stroke: false });
        g.seg(A, g.pol(A, Rw, a0), { color: 'ink', width: 2.2 });
        g.seg(A, g.pol(A, Rw, a1), { color: 'ink', width: 2.2 });
        g.arc(A, Rw, a0, a1, { color: 'rose', width: 4.6 });
        if (i === 0) {
          const ar = Math.min(Rw * 0.3, 24);
          g.ang(A, a0, a1, { r: ar, color: 'amber', label: num(th) + '°', lr: ar + 16, size: 15, mid: phi });
        }
        g.dot(A, { color: 'ink', r: 3.2, glow: false });
      }
      if (t > 0.97) g.text([0, 0], '원 하나', { color: 'ink', size: 17, dy: 0 });
      if (t < 0.03) g.text([0, -Rw - 16], `${n}개의 부채꼴 · 각각 ${num(th)}° · 가로로 밀어서 모읍니다`, { color: 'ink', size: 15, dy: 0 });
    }
  });

  /* ---------- 확장 2. 부채꼴의 둘레 = 호 + 반지름 × 2 ---------- */
  build({
    id: 'x02', title: '확장 · 부채꼴의 둘레', short: '확장 · 부채꼴 둘레',
    question: '부채꼴을 따라 한 바퀴 돌면 어떤 선들을 지날까? 둘레는 호의 길이만일까?',
    guide: '<b>r</b>과 <b>θ</b>를 바꿔 보세요. 둘레는 <b>호의 길이 + 반지름 2개</b>입니다. 호만 구하고 멈추기 쉬워요.',
    box: { x: [-112, 112], y: [-16, 116] },
    params: {
      r: { value: 6, min: 3, max: 9, step: 1, color: 'sky', label: '반지름 r', format: (v) => v + ' cm' },
      th: { value: 120, min: 30, max: 180, step: 10, color: 'amber', label: '중심각 θ', format: (v) => v + '°' }
    },
    controls: ['r', 'th'],
    presets: [[6, 120], [9, 60], [6, 90], [3, 180]].map(([r, th]) => ({ label: `r=${r} cm · ${th}°`, apply: (q) => { q.r = r; q.th = th; }, on: (q) => q.r === r && q.th === th })),
    steps: (q) => [`① 호의 길이 : 2π × ${q.r} × ${q.th}/360 = ${piS((q.r * q.th) / 180)} cm`, `② 반지름 2개 : ${q.r} + ${q.r} = ${2 * q.r} cm`, `③ 둘레 = 호 + 반지름 2개 = (${piS((q.r * q.th) / 180)} + ${2 * q.r}) cm`],
    work: (q) => [
      `호의 길이 $=2\\pi\\times${q.r}\\times\\frac{${q.th}}{360}=${piT((q.r * q.th) / 180)}$ (cm)`,
      `곧은 선(두 반지름) $=${q.r}+${q.r}=${2 * q.r}$ (cm)`,
      `둘레 $=${piT((q.r * q.th) / 180)}+${2 * q.r}$ (cm)`
    ],
    chips: (q, mode, step) => (mode === 'problem' ? [] : [{ k: '둘레', tex: `${piT((q.r * q.th) / 180)}+${q.r}+${q.r}=${piT((q.r * q.th) / 180)}+${2 * q.r}`, color: 'rose' }]),
    rule: (q) => (q.step >= 3 ? '부채꼴의 둘레 = 호의 길이 + 반지름 × 2' : null),
    view: (q) => ({
      readouts: [
        rd('호의 길이', piS((q.r * q.th) / 180) + ' cm', 'rose'),
        rd('반지름 2개', 2 * q.r + ' cm', 'sky'),
        rd('둘레', `${piS((q.r * q.th) / 180)} + ${2 * q.r} cm`, 'green')
      ]
    }),
    problem: (q) => {
      const l = (q.r * q.th) / 180;
      const it = [`${T(piT(l))} cm`, `${T(`(${piT(l)}+${q.r})`)} cm`, `${T(`(${piT(l)}+${2 * q.r})`)} cm`, `${T(`(${piT(2 * l)}+${2 * q.r})`)} cm`, `${T(`(${piT(l)}+${4 * q.r})`)} cm`];
      return { text: qHtml(`반지름의 길이가 ${q.r} cm이고 중심각의 크기가 ${q.th}°인 부채꼴의 둘레의 길이는?`, it), answer: `③ ${it[2]}` };
    },
    draw(g, q, mode, step) {
      const O = [0, 0], U2 = 100 / 9, R = q.r * U2, th = q.th, m = th / 2, l = (q.r * th) / 180;
      g.reserve([-104, -6], [104, 106]);
      const s1 = mode === 'explore' || (mode === 'review' && step >= 1), s2 = mode === 'explore' || (mode === 'review' && step >= 2);
      g.arc(O, R, 0, th, { sector: true, fill: 'sky', fillAlpha: 0.22, stroke: false });
      g.seg(O, [R, 0], { color: 'sky', width: s2 ? 4.8 : 2.6 });
      g.seg(O, g.pol(O, R, th), { color: 'sky', width: s2 ? 4.8 : 2.6 });
      g.arc(O, R, 0, th, { color: 'rose', width: s1 ? 5.4 : 3 });
      g.ang(O, 0, th, { r: Math.min(R * 0.3, 26), color: 'amber', label: th + '°', lr: Math.min(R * 0.3, 26) + 15, size: 16, mid: Math.min(m, 30) });
      g.out(g.pol(O, R, m), m, s1 ? '호 ' + piS(l) + ' cm' : '호 ? cm', { color: 'rose', size: 16 }, 32);
      { g.text(g.pol(O, R * 0.5, 0), q.r + ' cm', { color: 'sky', size: 16, dy: 20 }); g.text(g.pol(O, R * 0.5, th), q.r + ' cm', { color: 'sky', size: 16, dx: Math.cos((th + 90) * D2R) * 24, dy: -Math.sin((th + 90) * D2R) * 24 }); }
      if (mode === 'explore') {
        g.handle('th', g.pol(O, R, th), { color: 'amber', label: 'θ', toward: O, drag: (w) => { let a = mod(dirOf(O, w), 360); if (a > 270) a = 0; q.th = clamp(snap(a, 10), 30, 180); } });
        g.handle('r', [R, 0], { color: 'sky', label: 'r', dx: 12, dy: -14, drag: (w) => { q.r = clamp(Math.round(Math.hypot(w.x, w.y) / U2), 3, 9); } });
      }
      g.dot(O, { color: 'ink', r: 4, label: 'O', dx: -12, dy: 14, align: 'center' });
    }
  });

  // 교재 폴더 순서(원 알아보기 → 기본형 → 길이·둘레) 다음에 확장 장면
  const ORDER = ['1101', '1207', '1102', '1103', '1106', '1210', '1607', '1609', '1610', '1719', '1807', '1808', '1104', '1105', '1209', '1809', 'x01', 'x02'];
  SCENES.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
  (window.APL_CS_GROUPS = window.APL_CS_GROUPS || []).push({ order: 15, id: 'basic', title: '중심각과 호·넓이', short: '중심각과 호·넓이', scenes: SCENES });
})();
