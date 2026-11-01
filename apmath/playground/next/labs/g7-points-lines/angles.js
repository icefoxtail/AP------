/* ==========================================================================
   중1 · 기본 도형 — 「시계의 각 · 맞꼭지각 · 수직과 수선」 탭 모듈 (angles.js)
   g7-points-lines.html 이 window.APL_PL_GROUPS 를 읽어 탭으로 붙입니다.
     ④ 시계의 각     (order 40)  시·분 조절 / 분이 지나면 사잇각은?
     ⑤ 맞꼭지각      (order 50)  맞꼭지각의 성질(+쌍의 개수) / 맞꼭지각으로 식 세우기 / 한 점에서 만나는 세 직선
     ⑥ 수직과 수선   (order 60)  수선과 점·직선 사이의 거리 / 평각의 두 이등분선 / 삼각형에서 점과 변 사이의 거리
   원칙(학생 가독성)
   - 모든 그림은 막대 또는 끌 수 있는 점(손잡이)으로 바뀌고, 그림 속 글자·식·정리 단계·문제의 보기와 정답이 그 값으로 다시 계산됩니다.
   - 같은 크기의 각은 같은 표시(호의 개수·색), 직각은 네모, 같은 길이는 눈금으로 나타냅니다.
   - 색의 약속: 노랑=주어진 각·시침 · 분홍=구하는 각 · 하늘=선·분침 · 초록=결과 · 연보라=보조
   - 움직임은 제자리 회전과 가로 이동뿐입니다. √·피타고라스는 쓰지 않습니다.
   - 탐구 → 정리(교과서 풀이 순서, 단계마다 그림이 강조) → 문제(5지선다 + 숫자 바꾸기).
   - 자기완결 모듈: 전역은 APL_PL_GROUPS 하나뿐. 장면별 값은 셸 상태에 '<장면 id>_' 이름표를 붙여 보관하고,
     장면에 들어갈 때 lab.params 에 막대 정의를 등록합니다.
   ========================================================================== */
(function () {
  'use strict';
  const D2R = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mod = (a, n) => ((a % n) + n) % n;
  const CIRC = ['①', '②', '③', '④', '⑤'];
  const esc = (t) => APLab.esc(t);
  const M = (t) => APLab.renderMath(APLab.esc(t));
  const RICH = (...p) => `<div class="apl-rich">${p.map((x) => `<p>${x}</p>`).join('')}</div>`;
  const n1 = (x) => { const r = Math.round(x * 10) / 10; return String(Math.abs(r) < 1e-9 ? 0 : r).replace('-', '−'); };
  const sgn = (v) => (v < 0 ? '−' + (-v) : '+' + v);          // +10, −20
  const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pickOf = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const textW = (t, size) => { let w = 0; for (const ch of String(t)) { const c = ch.charCodeAt(0); w += c >= 0x1100 ? size : ch === ' ' ? size * 0.32 : size * 0.62; } return w; };

  (function css() {
    if (document.getElementById('pl-angles-css')) return;
    const st = document.createElement('style');
    st.id = 'pl-angles-css';
    st.textContent = `
.pl-q{font-size:var(--fs-md);line-height:1.85;margin:0 0 4px}
.pl-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0 4px}
.pl-choices.list{grid-template-columns:1fr}
.pl-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left;line-height:1.5}
.pl-ch:hover{background:var(--hover)}
.pl-ch .n{color:var(--m-amber);flex:none}
.pl-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.pl-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.pl-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.pl-fb.ok{border-left-color:var(--m-green)}
.pl-fb.bad{border-left-color:var(--m-red)}
.pl-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.pl-note{font-size:var(--fs-xs);color:var(--text-3)}`;
    document.head.append(st);
  })();

  /* ---------- 그리기 도우미: 수학 좌표(y 위쪽, 각도는 반시계 방향)로 쓰면 보드(figure, y 아래쪽)에 맞춰 줍니다 ---------- */
  function G(b) {
    const P = (p) => [p[0], -p[1]];
    const pol = (c, r, d) => [c[0] + r * Math.cos(d * D2R), c[1] + r * Math.sin(d * D2R)];
    const K = () => b.k || 100;
    const g = {
      b, pol, thumb: !!b.thumb,
      k: (u) => u * K(),                                  // 세계 길이 → 화면 픽셀
      u: (px) => px / K(),                                // 화면 픽셀 → 세계 길이
      box(x0, y0, x1, y1) { b.path([P([x0, y0]), P([x1, y1])], { color: null }); return g; }, // 맞춤 범위 알림(보이지 않음)
      seg(p, q, o) { b.seg(P(p), P(q), o); return g; },
      path(pts, o) { b.path(pts.map(P), o); return g; },
      poly(pts, o) { b.poly(pts.map(P), o); return g; },
      circle(c, r, o) { b.circle(P(c), r, o); return g; },
      dot(p, o = {}) { const oo = { ...o }; if (b.thumb) oo.label = undefined; b.point(P(p), oo); return g; },
      text(p, str, o = {}) {
        if (b.thumb) return g;
        b.text(P(p), str, { size: 16, weight: 800, baseline: 'middle', ...o });
        return g;
      },
      /** 점 p 에서 방향 deg(수학 각도) 쪽으로 화면 off 픽셀 떨어진 글자 */
      out(p, deg, str, o = {}, off = 20) { return g.text(p, str, { dx: Math.cos(deg * D2R) * off, dy: -Math.sin(deg * D2R) * off, ...o }); },
      tick(p, q, o) { b.ticks(P(p), P(q), o); return g; },
      right(v, p1, p2, o) { b.right(P(v), P(p1), P(p2), o); return g; },
      arc(c, r, d0, d1, o = {}) { b.arc(P(c), r, -d0 * D2R, -d1 * D2R, { ...o, ccw: true }); return g; },
      /** 각 표시: d0 → d1(반시계)의 색칠한 부채꼴 + 호(rings 개). r 은 화면 픽셀 */
      ang(c, d0, d1, o = {}) {
        const r = (o.r || 28) / K(), col = o.color || 'amber';
        g.arc(c, r, d0, d1, { sector: true, fill: col, fillAlpha: o.fa == null ? 0.32 : o.fa, stroke: false, ref: o.ref });
        for (let i = 0; i < (o.rings || 1); i++) g.arc(c, r - (i * 4.5) / K(), d0, d1, { color: col, width: 2.6, ref: o.ref });
        return g;
      },
      /** 각의 값 글자: 이등분선 쪽, 호 밖으로 글자 상자가 닿지 않을 만큼 */
      angText(c, d0, d1, str, o = {}) {
        const size = o.size || 16, half = Math.max(0.12, Math.min(1.45, Math.abs(d1 - d0) * D2R / 2));
        const dist = clamp(Math.max((o.r || 28) + 14, (textW(str, size) / 2 + 6) / Math.sin(half)), 0, Math.max((o.r || 28) + 14, o.max || K() * 1.05));
        const m = (d0 + d1) / 2;
        return g.text(c, str, { dx: Math.cos(m * D2R) * dist, dy: -Math.sin(m * D2R) * dist, color: o.color || 'amber', size, ref: o.ref });
      },
      handle(id, p, o = {}) {
        const oo = { color: 'amber', ...o };
        if (o.drag) oo.drag = (w) => o.drag({ x: w.x, y: -w.y });
        b.handle(id, P(p), oo);
        return g;
      }
    };
    return g;
  }

  /* ---------- 객관식(5지선다): 정답 하나 + 흔한 오답. 값 순서로 정렬해 교과서처럼 보입니다 ---------- */
  // cands: [{v, hint}] 우선순위 순서의 오답 후보. valid(v): 보기로 쓸 수 있는 값인지
  function mkNumChoices(ans, cands, fmt, valid, fill) {
    const seen = new Set([Math.round(ans * 100)]), out = [{ v: ans, ok: true }];
    const add = (v, hint) => {
      if (out.length >= 5 || !Number.isFinite(v)) return;
      const key = Math.round(v * 100);
      if (seen.has(key) || (valid && !valid(v))) return;
      seen.add(key); out.push({ v, ok: false, hint });
    };
    cands.forEach((c) => add(c.v, c.hint));
    const stp = fill || 5;
    for (let i = 1; out.length < 5 && i < 40; i++) { add(ans + i * stp, '값을 다시 계산해 보세요.'); add(ans - i * stp, '값을 다시 계산해 보세요.'); }
    out.sort((a, b) => a.v - b.v);
    return out.map((c) => ({ ...c, t: fmt(c.v) }));
  }

  /* ---------- 장면 공장 ---------- */
  let LAB = null;
  const ALL = [];
  const PARAMS = {};
  const CANON = { x: [-5, 5], y: [-4, 4] };
  const unionFocus = (a, b) => (a ? { x: [Math.min(a.x[0], b.x[0]), Math.max(a.x[1], b.x[1])], y: [Math.min(a.y[0], b.y[0]), Math.max(a.y[1], b.y[1])] } : b);
  const stat = (tone, text) => ({ tone, text });
  const rd = (label, value, color, note, ref, wide) => ({ label, value, color, note, ref, wide });

  function build(spec) {
    const pre = spec.id + '_';
    const defs = { pk: '', pi: -1, seed: 0 };
    Object.entries(spec.state || {}).forEach(([k, v]) => { defs[k] = v; });
    Object.entries(spec.params || {}).forEach(([k, p]) => { defs[k] = p.value; });
    const own = new Set(Object.keys(defs));
    const sv = (s) => new Proxy(s, {
      get: (t, k) => {
        if (typeof k === 'string' && own.has(k)) { const v = t[pre + k]; return v === undefined ? defs[k] : v; }
        return t[k];
      },
      set: (t, k, v) => { t[typeof k === 'string' && own.has(k) ? pre + k : k] = v; return true; }
    });
    const P = {};
    Object.entries(spec.params || {}).forEach(([k, p]) => {
      P[pre + k] = {
        value: p.value, min: p.min, max: p.max, step: p.step, color: p.color || 'amber', label: p.label || k, hint: p.hint,
        format: p.format ? (v, s) => p.format(v, sv(s)) : undefined,
        onInput: (s, lab) => { if (p.onInput) p.onInput(sv(s), lab); }
      };
      PARAMS[pre + k] = P[pre + k];
    });
    const modeOf = (lab) => (lab && lab.tab) || 'explore';
    let measuring = false;
    const box = spec.box || { x: [-2, 2], y: [-2, 2] };
    const sc = {
      id: spec.id, title: spec.title, short: spec.short || spec.title, question: spec.question,
      boardKind: 'figure', autoFit: true, notesTitle: spec.notesTitle || '꼭 기억할 점',
      __spec: spec, __sv: sv, __params: P,
      guide: (s) => (typeof spec.guide === 'function' ? spec.guide(sv(s)) : spec.guide),
      enter: (s, lab) => {
        const main = !!lab && s === lab.s;
        if (main) {
          LAB = lab;
          Object.keys(P).forEach((k) => { if (!(k in lab.params)) lab.params[k] = P[k]; });
        }
        const q = sv(s);
        Object.entries(defs).forEach(([k, v]) => { q[k] = v; });
        if (spec.enter) spec.enter(q, lab);
        s.playing = false;
        sc._focus = null;
        if (main && lab.board && lab._measureFocus) {
          const keep = { ...s }, b = lab.board, view = { focus: b.focus, zoom: b.zoom, panX: b.panX, panY: b.panY }, tab = lab.tab, step = s.step;
          b.setFocus(CANON, true);
          let uni = null;
          measuring = true;
          try {
            for (const patch of spec.fit || [{}]) {
              Object.keys(patch).forEach((k) => { q[k] = patch[k]; });
              for (const md of ['explore', 'review', 'problem']) {
                lab.tab = md; s.step = md === 'review' ? 99 : step;
                const f = lab._measureFocus(sc);
                if (f) uni = unionFocus(uni, f);
              }
            }
          } catch (e) { /* 맞춤 실패 시 기본 범위 */ }
          measuring = false;
          lab.tab = tab;
          Object.keys(keep).forEach((k) => { s[k] = keep[k]; });
          Object.assign(b, view);
          sc._focus = uni;
        }
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
        tag: spec.tag || '확인 문제',
        text: (s) => problemHTML(spec, sv(s)),
        answer: (s) => { const p = spec.problem(sv(s)); const i = p.choices.findIndex((c) => c.ok); return `${CIRC[i]} ${p.choices[i].t}`; }
      },
      focus: () => sc._focus || { x: box.x.slice(), y: [-box.y[1], -box.y[0]] },
      view: (s, lab) => {
        const q = sv(s), mode = modeOf(lab);
        const v = (spec.view ? spec.view(q, mode, lab) : {}) || {};
        if (lab && s === lab.s && !measuring && lab.refs && lab.refs.steps) {
          const sig = spec.steps(q).join('\u0001');
          if (lab.refs.steps.__sig !== sig) { lab._buildReview(); if (lab.refs.steps) lab.refs.steps.__sig = sig; lab._dirtyPanel = true; }
        }
        if (mode === 'problem') v.status = stat('info', '그림을 보고 풀어 보세요');
        else if (mode === 'review') { const n = spec.steps(q).length; v.status = stat((s.step | 0) >= n ? 'ok' : 'info', `풀이 ${Math.min(Math.max(s.step | 0, 1), n)} / ${n}단계`); }
        if (spec.work && mode !== 'explore') v.formula = spec.work(q, s.step | 0);
        if (spec.rule) v.rule = spec.rule(q);
        return v;
      },
      draw: (b, s, v, lab) => {
        const q = sv(s), mode = b.thumb ? 'explore' : modeOf(lab), step = b.thumb ? 0 : (s.step | 0);
        if (mode === 'review' && spec.partOfStep && step < spec.steps(q).length) { const p = spec.partOfStep(step, q); b.emph = p ? { part: p, ref: p } : null; }
        spec.draw(G(b), q, mode, step, lab);
      }
    };
    if (spec.tick) sc.tick = (s, dt, lab) => spec.tick(sv(s), dt, lab);
    ALL.push(sc);
    return sc;
  }

  /* ---------- 문제 탭: 보기 누르기 · 숫자 바꾸기 ---------- */
  function problemHTML(spec, q) {
    const P = spec.problem(q), key = P.key + '|' + q.seed;
    const picked = q.pk === key ? q.pi : -1;
    let h = `<p class="pl-q">${M(P.stem)}</p><div class="pl-choices${P.list ? ' list' : ''}">`;
    P.choices.forEach((c, i) => {
      const cls = picked === i ? (c.ok ? ' ok' : ' bad') : '';
      h += `<button type="button" class="pl-ch${cls}" data-plk="${i}" aria-label="${CIRC[i]} ${esc(c.t)}"><span class="n">${CIRC[i]}</span><span class="v">${M(c.t)}</span></button>`;
    });
    h += '</div>';
    if (picked >= 0) {
      const c = P.choices[picked];
      h += c.ok ? '<div class="pl-fb ok"><b>정답이에요!</b> 정리 탭에서 풀이 과정을 확인해 보세요.</div>' : `<div class="pl-fb bad"><b>다시 생각해 볼까요?</b> ${M(c.hint || '')}</div>`;
    }
    h += `<div class="pl-tools"><button type="button" class="apl-btn sm" data-pln>숫자 바꾸기</button>${P.note ? `<span class="pl-note">${M(P.note)}</span>` : ''}</div>`;
    return h;
  }
  document.addEventListener('click', (ev) => {
    const t = ev.target && ev.target.closest ? ev.target.closest('[data-plk],[data-pln]') : null;
    if (!t) return;
    const lab = LAB || window.lab;
    const sc = lab && lab.scene;
    if (!sc || !sc.__spec) return;
    const spec = sc.__spec, q = sc.__sv(lab.s);
    if (t.hasAttribute('data-pln')) {
      spec.reroll(q, lab);
      q.seed = (q.seed | 0) + 1; q.pk = ''; q.pi = -1;
      lab.s.revealed = false; lab.s.playing = false;
      lab.setStep(1);
      return;
    }
    const P = spec.problem(q), idx = parseInt(t.getAttribute('data-plk'), 10);
    q.pk = P.key + '|' + q.seed; q.pi = idx;
    if (P.choices[idx] && P.choices[idx].ok) lab.s.revealed = true;
    lab.invalidate(true);
  });
  // 막대 범위가 바뀌는 장면(숫자 바꾸기 뒤)에서 조작부를 다시 짓습니다.
  function rebuildControls(lab) {
    if (!lab || !lab.refs || !lab.refs.controls) return;
    lab.refs.controls.__ctlKey = null;
    lab._buildControls();
  }
  const group = (order, id, title, short, scenes) => {
    const params = {};
    scenes.forEach((sc) => Object.assign(params, sc.__params));
    return { order, id, title, short, params, scenes };
  };


  /* ======================================================================
     ④ 시계의 각
     ====================================================================== */
  const clockOf = (h, m) => {
    const hh = h % 12, th = 30 * hh + 0.5 * m, tm = 6 * m, raw = Math.abs(th - tm);
    const gap = raw > 180 ? 360 - raw : raw;
    const start = raw <= 180 ? Math.min(th, tm) : Math.max(th, tm);
    return { hh, th, tm, raw, gap, start, len: gap };
  };
  const timeTxt = (h, m) => `${h}시 ${m === 0 ? '정각' : m + '분'}`;
  const clockPresets = [[3, 39], [6, 0], [9, 0], [12, 30], [2, 20]];
  const timePresets = (key) => clockPresets.map(([h, m], i) => ({
    group: i === 0 ? '시각' : '', label: timeTxt(h, m), apply: (q) => { q.h = h; q.m = m; }, on: (q) => q.h === h && q.m === m
  }));
  const hourParam = { value: 3, min: 1, max: 12, step: 1, color: 'amber', label: '시 (시침)', hint: '그림의 노란 시침 끝을 끌어도 됩니다', format: (v) => `${Math.round(v)}시` };
  const minParam = { value: 39, min: 0, max: 59, step: 1, color: 'sky', label: '분 (분침)', hint: '그림의 하늘색 분침 끝을 끌어도 됩니다', format: (v) => `${Math.round(v)}분` };
  const gapChoices = (h, m, wrongNotes) => {
    const c = clockOf(h, m), fold = (x) => { const r = mod(Math.abs(x), 360); return r > 180 ? 360 - r : r; };
    const cands = [
      { v: fold(30 * c.hh - 6 * m), hint: '시침도 1분에 0.5°씩 움직여요. 시침의 각은 30°×시 + 0.5°×분이에요.' },
      { v: 360 - c.gap, hint: '두 바늘 사이의 각은 180° 이하인 작은 쪽 각이에요.' },
      { v: fold(30 * c.hh + m - 6 * m), hint: '시침은 1분에 1°가 아니라 0.5°씩 움직여요.' },
      { v: fold(c.th + c.tm), hint: '두 각을 더하지 않고, 큰 각에서 작은 각을 빼야 해요.' },
      { v: fold(30 * c.hh + 0.5 * m - 5 * m), hint: '분침은 1분에 5°가 아니라 6°씩 움직여요.' }
    ];
    return mkNumChoices(c.gap, cands, (v) => n1(v) + '°', (v) => v >= 0 && v <= 360, 15);
  };
  const clockRerollTime = (q) => {
    let h, m;
    do { h = rint(1, 12); m = Math.random() < 0.5 ? rint(0, 29) * 2 : rint(0, 11) * 5; } while (h === q.h && m === q.m);
    q.h = h; q.m = m;
  };

  // 시계 그림(공통): 얼굴 · 눈금 · 숫자 · 시침 · 분침 · 끌 수 있는 바늘 끝
  function drawClock(g, q, mode, o = {}) {
    const c = clockOf(q.h, q.m), O = [0, 0];
    g.box(-1.08, -1.08, 1.08, 1.12);
    g.circle(O, 1, { fill: 'ink', fillAlpha: 0.07, color: 'ink', width: 3.4, alpha: 0.9 });
    for (let i = 0; i < 60; i++) {
      const a = 90 - i * 6, hr = i % 5 === 0;
      g.seg(g.pol(O, hr ? 0.88 : 0.94, a), g.pol(O, 1, a), { color: 'ink', width: hr ? 2.8 : 1.2, alpha: hr ? 0.9 : 0.55 });
    }
    for (let n = 1; n <= 12; n++) g.text(g.pol(O, 0.82, 90 - n * 30), String(n), { size: 17, color: 'ink' });
    if (o.ref12) g.seg(O, [0, 0.9], { color: 'muted', width: 2, dash: [6, 5], alpha: 0.9 });
    (o.wedges || []).forEach((w) => {
      if (w.len < 0.01) return;
      const d0 = 90 - (w.from + w.len), d1 = 90 - w.from, r = g.k(w.r);
      g.ang(O, d0, d1, { r, color: w.color, rings: w.rings || 1, ref: w.ref, fa: w.fa });
      if (w.label) g.angText(O, d0, d1, w.label, { r, color: w.color, size: 16, ref: w.ref, max: g.k(0.7) });
    });
    if (o.ghostHour != null) g.seg(O, g.pol(O, 0.42, 90 - o.ghostHour), { color: 'amber', width: 6, dash: [6, 6], alpha: 0.7, ref: 'h' });
    const hp = g.pol(O, 0.42, 90 - c.th), mp = g.pol(O, 0.63, 90 - c.tm);
    g.seg(O, mp, { color: 'sky', width: 5, ref: 'm' });
    g.seg(O, hp, { color: 'amber', width: 8, ref: 'h' });
    g.dot(O, { color: 'ink', r: 6 });
    const phi = (w) => mod(Math.atan2(w.x, w.y) / D2R, 360);
    g.handle('mh', mp, { color: 'sky', ariaLabel: '분침 끝', priority: 1, drag: (w) => { q.m = Math.round(phi(w) / 6) % 60; } });
    g.handle('hh', hp, { color: 'amber', ariaLabel: '시침 끝', drag: (w) => { const hh = mod(Math.round((phi(w) - 0.5 * q.m) / 30), 12); q.h = hh === 0 ? 12 : hh; } });
    g.text([0, 1.04], timeTxt(q.h, q.m), { dy: -26, size: 20, color: 'ink' });
    return c;
  }
  const lineAt = (g, i, str, color, o = {}) => g.text([0, -1], str, { dy: 36 + i * 28, size: 17, color, ...o });

  /* ---- 4-1 시침과 분침이 이루는 각 ---- */
  const sClock = build({
    id: 'ck1', title: '시침과 분침이 이루는 각', short: '두 바늘의 각',
    question: '시계의 시침과 분침은 각각 12에서 몇 도 돌아 있을까? 두 바늘 사이의 각은 어떻게 구할까?',
    guide: '아래 막대나 <b>바늘 끝(노랑·하늘 점)</b>을 끌어 시각을 바꿔 보세요. 분침은 1분에 <b>6°</b>, 시침은 1시간에 <b>30°</b>(1분에 <b>0.5°</b>)씩 움직여서, 분이 지나면 <b>시침도 조금씩</b> 앞으로 가요.',
    box: { x: [-1.3, 1.3], y: [-3, 1.3] },
    params: { h: hourParam, m: minParam },
    controls: ['h', 'm'],
    presets: timePresets(),
    fit: [{ h: 3, m: 39 }, { h: 12, m: 0 }, { h: 9, m: 59 }],
    partOfStep: (st) => ['', 'h', 'm', 'g'][st] || null,
    steps: (q) => {
      const c = clockOf(q.h, q.m);
      return [
        `시침은 1시간에 30°, 1분에 0.5°씩 움직여요. ${q.h}시 ${q.m}분의 시침은 12에서 30°×${c.hh} + 0.5°×${q.m} = ${n1(c.th)}°${q.h === 12 ? ' (12시는 0으로 계산해요)' : ''}`,
        `분침은 1분에 6°씩 움직여요. 분침은 12에서 6°×${q.m} = ${n1(c.tm)}°`,
        `두 바늘 사이의 각은 큰 각에서 작은 각을 뺀 값이에요: |${n1(c.tm)}° − ${n1(c.th)}°| = ${n1(c.raw)}°` + (c.raw > 180 ? ` → 180°보다 크므로 작은 쪽 각은 360° − ${n1(c.raw)}° = ${n1(c.gap)}°` : ` → 180° 이하이므로 이것이 두 바늘 사이의 각이에요.`)
      ];
    },
    work: (q, st) => {
      const c = clockOf(q.h, q.m);
      return RICH(M('시침의 각 = 30° × (시) + 0.5° × (분)'), M('분침의 각 = 6° × (분)'), M('사잇각 = |분침의 각 − 시침의 각| (180°보다 크면 360°에서 뺀다)'), `<b>${esc(timeTxt(q.h, q.m))}</b>: ${M(`시침 ${n1(c.th)}°, 분침 ${n1(c.tm)}° → 사잇각 ${n1(c.gap)}°`)}`);
    },
    notes: null,
    view: (q, mode) => {
      const c = clockOf(q.h, q.m);
      return {
        status: stat('info', `${timeTxt(q.h, q.m)} · 두 바늘 사이의 각 ${n1(c.gap)}°`),
        readouts: [rd('시침이 돈 각', n1(c.th) + '°', 'amber', `30°×${c.hh} + 0.5°×${q.m}`, 'h'), rd('분침이 돈 각', n1(c.tm) + '°', 'sky', `6°×${q.m}`, 'm'), rd('두 바늘 사이의 각', n1(c.gap) + '°', 'green', c.raw > 180 ? `360° − ${n1(c.raw)}°` : `|${n1(c.tm)}° − ${n1(c.th)}°|`, 'g', true)],
        alert: { tone: 'key', text: '분이 지나면 시침도 움직여요! 시침은 숫자 위에 딱 멈춰 있지 않아요.' }
      };
    },
    draw: (g, q, mode, step) => {
      const c = clockOf(q.h, q.m), rev = mode === 'review', show = (n) => mode === 'explore' || (rev && step >= n);
      const wedges = [];
      if (rev && step >= 1) wedges.push({ from: 0, len: c.th, r: 0.2, color: 'amber', ref: 'h', label: n1(c.th) + '°', fa: 0.22 });
      if (rev && step >= 2) wedges.push({ from: 0, len: c.tm, r: 0.4, color: 'sky', ref: 'm', label: n1(c.tm) + '°', fa: 0.16 });
      if (mode === 'explore' || (rev && step >= 3)) wedges.push({ from: c.start, len: c.gap, r: 0.3, color: 'green', rings: 2, ref: 'g', label: c.gap >= 25 ? n1(c.gap) + '°' : '' });
      drawClock(g, q, mode, { wedges, ref12: rev && step <= 2 });
      g.box(-1, -1, 1, -1);
      if (mode === 'problem') return;
      if (show(1)) lineAt(g, 0, `시침  30°×${c.hh} + 0.5°×${q.m} = ${n1(c.th)}°`, 'amber', { ref: 'h' });
      if (show(2)) lineAt(g, 1, `분침  6°×${q.m} = ${n1(c.tm)}°`, 'sky', { ref: 'm' });
      if (show(3)) {
        lineAt(g, 2, `사잇각  |${n1(c.tm)}° − ${n1(c.th)}°| = ${n1(c.raw)}°`, 'green', { ref: 'g' });
        lineAt(g, 3, c.raw > 180 ? `180°보다 커서  360° − ${n1(c.raw)}° = ${n1(c.gap)}°` : '', 'green', { ref: 'g' });
      }
    },
    problem: (q) => {
      const ch = gapChoices(q.h, q.m);
      return { key: `${q.h}:${q.m}`, stem: `시계가 ${q.h}시 ${q.m}분을 가리킬 때, 시침과 분침이 이루는 각 중 작은 쪽의 크기는?`, choices: ch, note: '그림의 시계로 확인하세요' };
    },
    reroll: (q) => clockRerollTime(q)
  });


  /* ---- 4-2 분이 지나면 사잇각은? (분침이 시침을 1분에 5.5°씩 따라잡는다) ---- */
  const sChase = build({
    id: 'ck2', title: '분이 지나면 사잇각은?', short: '분이 지나면',
    question: '분침은 1분에 6°, 시침은 1분에 0.5° 움직여요. 분이 지날수록 두 바늘 사이의 각은 어떻게 변할까?',
    guide: '<b>분 막대</b>를 끌거나 ▶를 눌러 분침을 돌려 보세요. 분침이 시침보다 1분에 <b>5.5°</b>씩 더 가서 따라잡기 때문에, 사잇각이 5.5°씩 줄어요. 분침이 시침을 지나면 다시 늘어나요.',
    box: { x: [-1.3, 1.3], y: [-3.3, 1.3] },
    params: { h: { ...hourParam, hint: '정각일 때 시침의 자리가 바뀌어요' }, m: { ...minParam, value: 20, hint: '그림의 분침 끝을 끌어도 됩니다' }, acc: { value: 0, min: 0, max: 1, step: 1 } },
    controls: ['h', 'm'],
    presets: [{ group: '시', label: '3시', apply: (q) => { q.h = 3; q.m = 0; }, on: (q) => q.h === 3 }, { label: '6시', apply: (q) => { q.h = 6; q.m = 0; }, on: (q) => q.h === 6 }, { label: '9시', apply: (q) => { q.h = 9; q.m = 0; }, on: (q) => q.h === 9 }, { label: '12시', apply: (q) => { q.h = 12; q.m = 0; }, on: (q) => q.h === 12 }],
    actions: [{
      id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'),
      label: (s) => (s.playing ? '일시 정지' : '분침 돌려 보기'),
      on: (q) => q.playing,
      run: (q) => { if (q.playing) q.playing = false; else { if (q.m >= 58) q.m = 0; q.playing = true; } }
    }],
    tick: (q, dt) => {
      if (!q.playing) return false;
      q.acc += dt;
      if (q.acc >= 0.16) { q.acc = 0; q.m = Math.min(59, q.m + 1); if (q.m >= 59) q.playing = false; }
      return true;
    },
    fit: [{ h: 3, m: 20 }, { h: 12, m: 0 }, { h: 9, m: 59 }, { h: 11, m: 0 }],
    partOfStep: (st) => ['', 'h', null, 'm', 'g'][st] || null,
    steps: (q) => {
      const c = clockOf(q.h, q.m), A0 = 30 * c.hh, ch = 5.5 * q.m, d = A0 - ch;
      return [
        `${q.h}시 정각에는 분침이 12(0°)에, 시침이 30°×${c.hh} = ${A0}°에 있어요. 시침이 분침보다 ${A0}° 앞서 있어요.`,
        '1분마다 분침은 6°, 시침은 0.5° 움직여요. 분침이 시침보다 6° − 0.5° = 5.5°씩 더 가서 따라잡아요.',
        `${q.m}분 동안 따라잡은 각 = 5.5° × ${q.m} = ${n1(ch)}°`,
        `사잇각 = |${A0}° − ${n1(ch)}°| = ${n1(Math.abs(d))}°` + (Math.abs(d) > 180 ? ` → 180°보다 크므로 작은 쪽 각은 360° − ${n1(Math.abs(d))}° = ${n1(c.gap)}°` : ` (분침이 시침을 ${d >= 0 ? '아직 못 따라잡았어요' : '지나쳤어요'})`)
      ];
    },
    work: (q) => RICH(M('분침이 시침을 따라잡는 속도 = 6° − 0.5° = 5.5° (1분에)'), M('사잇각 = |30° × (시) − 5.5° × (분)| (180°보다 크면 360°에서 뺀다)'), `<b>${esc(timeTxt(q.h, q.m))}</b>: ${M(`|${30 * (q.h % 12)}° − ${n1(5.5 * q.m)}°| → 사잇각 ${n1(clockOf(q.h, q.m).gap)}°`)}`),
    view: (q) => {
      const c = clockOf(q.h, q.m), A0 = 30 * c.hh, ch = 5.5 * q.m, d = A0 - ch;
      const nx = clockOf(q.h, Math.min(59, q.m + 1)).gap - c.gap;
      return {
        status: stat('info', `${timeTxt(q.h, q.m)} · 사잇각 ${n1(c.gap)}°` + (q.m < 59 ? (nx < 0 ? ' · 줄어드는 중' : nx > 0 ? ' · 늘어나는 중' : '') : '')),
        readouts: [rd(`${q.h}시 정각의 시침`, A0 + '°', 'amber', '30° × 시', 'h'), rd('따라잡은 각', n1(ch) + '°', 'sky', `5.5° × ${q.m}`, 'm'), rd('두 바늘 사이의 각', n1(c.gap) + '°', 'green', `|${A0}° − ${n1(ch)}°|`, 'g', true)]
      };
    },
    draw: (g, q, mode, step) => {
      const c = clockOf(q.h, q.m), A0 = 30 * c.hh, ch = 5.5 * q.m, d = A0 - ch, ad = Math.abs(d), rev = mode === 'review';
      const wedges = [];
      if (rev && step === 1 && A0 > 0) wedges.push({ from: 0, len: A0, r: 0.25, color: 'amber', ref: 'h', label: A0 + '°', fa: 0.22 });
      if (mode === 'explore' || (rev && step >= 4)) wedges.push({ from: c.start, len: c.gap, r: 0.3, color: 'green', rings: 2, ref: 'g', label: c.gap >= 25 ? n1(c.gap) + '°' : '' });
      drawClock(g, q, mode, { wedges, ref12: rev && step <= 1, ghostHour: rev && step === 1 ? A0 : null });
      g.box(-1, -1, 1, -1);
      if (mode === 'problem') return;
      const lines = [];
      if (mode === 'explore' || (rev && step >= 3)) lines.push({ t: `5.5°×${q.m} = ${n1(ch)}°  따라잡음`, c: 'sky', ref: 'm' });
      if (mode === 'explore' || (rev && step >= 4)) {
        lines.push({ t: `사잇각  |${A0}° − ${n1(ch)}°| = ${n1(ad)}°`, c: 'green', ref: 'g' });
        if (ad > 180) lines.push({ t: `180°보다 커서  360° − ${n1(ad)}° = ${n1(c.gap)}°`, c: 'green', ref: 'g' });
      }
      // 사잇각 막대(0°~180°): 분이 지날수록 길이가 달라져요 (시계 바로 아래, 그 밑으로 풀이 글자)
      const yb = -1.24, x0 = -1.1, x1 = 1.1, xe = x0 + (x1 - x0) * c.gap / 180;
      g.seg([x0, yb], [x1, yb], { color: 'muted', width: 12, alpha: 0.4, cap: 'butt' });
      if (c.gap > 0) g.seg([x0, yb], [xe, yb], { color: 'green', width: 12, cap: 'butt', ref: 'g' });
      g.dot([xe, yb], { color: 'green', r: 5 });
      g.text([x0, yb], '0°', { dy: 24, size: 14, color: 'muted', align: 'left' });
      g.text([x1, yb], '180°', { dy: 24, size: 14, color: 'muted', align: 'right' });
      lines.forEach((l, i) => g.text([0, yb], l.t, { dy: 52 + i * 27, size: 17, color: l.c, ...(l.ref ? { ref: l.ref } : {}) }));
    },
    problem: (q) => {
      const ch = gapChoices(q.h, q.m);
      return { key: `${q.h}:${q.m}`, stem: `시계가 ${q.h}시 정각에서 ${q.m}분이 지나 ${q.h}시 ${q.m}분이 되었다. 분침이 시침을 따라잡는 것을 이용해, 두 바늘이 이루는 작은 쪽 각의 크기를 구하면?`, choices: ch, note: '5.5°×분 으로 따라잡은 각을 먼저 구해 보세요' };
    },
    reroll: (q) => clockRerollTime(q)
  });

  /* ======================================================================
     ⑤ 맞꼭지각
     ====================================================================== */
  const wedgeR = (g) => clamp(g.k(0.34), 30, 70);
  const lineDirs = (th, n) => { const a = [0, th]; for (let j = 2; j < n; j++) a.push(th + (180 - th) * (j - 1) / (n - 1)); return a.slice(0, n); };
  const lineAnchor = (g, i, str, color, o = {}) => g.text([0, -1.72], str, { dy: 30 + i * 27, size: 17, color, ...o });
  // 직선의 한쪽 끝을 끌어 기울기 정하기: 점의 방향(mod 180)을 5° 단위로
  const dirOf180 = (w) => mod(Math.atan2(w.y, w.x) / D2R, 180);
  const rr5 = (v) => Math.round(v / 5) * 5;
  function sgnTxt(v) { return v < 0 ? '−' + (-v) : String(v); }

  /* ---- 5-1 맞꼭지각의 성질과 쌍의 개수 ---- */
  const nEffV = (q, mode) => (mode === 'problem' && q.seed % 2 === 1 ? Math.max(3, q.n) : q.n);
  const sVert = build({
    id: 'vt', title: '맞꼭지각은 크기가 같다', short: '맞꼭지각의 성질',
    question: '두 직선이 한 점에서 만나면 네 개의 각이 생겨요. 서로 마주 보는 각(맞꼭지각)의 크기는 어떤 관계일까?',
    guide: '<b>직선 끝의 노란 점</b>을 끌거나 막대를 움직여 보세요. 마주 보는 두 각(<b>맞꼭지각</b>)은 같은 표시(같은 색·같은 호의 수)이고 크기도 언제나 같아요. 아래 막대로 <b>직선의 개수</b>도 바꿔 보세요.',
    box: { x: [-1.8, 1.8], y: [-3.1, 1.8] },
    params: {
      th: { value: 55, min: 30, max: 150, step: 5, color: 'amber', label: '교차하는 각 ∠a', format: (v) => `${Math.round(v)}°` },
      n: { value: 2, min: 2, max: 6, step: 1, color: 'violet', label: '한 점에서 만나는 직선의 수 n', hint: '3개 이상이면 맞꼭지각이 몇 쌍인지 세어 보세요', format: (v) => `${Math.round(v)}개` }
    },
    controls: ['th', 'n'],
    presets: [30, 55, 90, 120, 150].map((a, i) => ({ group: i === 0 ? '∠a' : '', label: a + '°', apply: (q) => { q.th = a; }, on: (q) => q.th === a })),
    fit: [{ th: 55, n: 2 }, { th: 30, n: 6 }, { th: 150, n: 4 }],
    partOfStep: (st) => ['', 'ab', 'cb', 'v', 'n'][st] || null,
    steps: (q) => [
      `두 직선이 만나 생긴 ∠a와 ∠b는 한 직선 위에 있으므로 ∠a + ∠b = 180° → ∠b = 180° − ${q.th}° = ${180 - q.th}°`,
      `∠c와 ∠b도 한 직선 위에 있으므로 ∠c + ∠b = 180° → ∠c = 180° − ${180 - q.th}° = ${q.th}°. 따라서 ∠a = ∠c`,
      `마주 보는 각 ∠a와 ∠c, ∠b와 ∠d를 맞꼭지각이라 해요. 맞꼭지각의 크기는 같아요: ∠a = ∠c = ${q.th}°, ∠b = ∠d = ${180 - q.th}°`,
      `직선 ${q.n}개가 한 점에서 만날 때, 직선 2개를 고르는 방법은 ${q.n}×${q.n - 1}÷2 = ${q.n * (q.n - 1) / 2}가지이고 한 번에 맞꼭지각이 2쌍씩 생겨요. 모두 ${q.n}×${q.n - 1} = ${q.n * (q.n - 1)}쌍`
    ],
    work: () => RICH(M('맞꼭지각의 크기는 같다'), M('직선 n개가 한 점에서 만날 때 맞꼭지각 = n × (n − 1) 쌍')),
    view: (q) => ({
      status: stat('ok', `∠a = ∠c = ${q.th}° · ∠b = ∠d = ${180 - q.th}°`),
      readouts: [rd('∠a = ∠c', q.th + '°', 'amber', '맞꼭지각', 'a'), rd('∠b = ∠d', 180 - q.th + '°', 'rose', '맞꼭지각', 'b'), rd(`직선 ${q.n}개의 맞꼭지각`, q.n * (q.n - 1) + '쌍', 'green', `${q.n} × ${q.n - 1}`, 'n', true)],
      alert: { tone: 'key', text: '∠a + ∠b = 180°이고 ∠c + ∠b = 180°이므로 ∠a = ∠c. 맞꼭지각은 크기가 같아요.' }
    }),
    draw: (g, q, mode, step) => {
      const th = q.th, n = nEffV(q, mode), O = [0, 0], L = 1.55, rev = mode === 'review', r = wedgeR(g), kind = q.seed % 2;
      g.box(-1.7, -1.7, 1.7, 1.7);
      lineDirs(th, n).forEach((a, i) => g.seg(g.pol(O, L, a), g.pol(O, L, a + 180), { color: i < 2 ? 'sky' : 'muted', width: i < 2 ? 4.5 : 3, alpha: i < 2 ? 1 : 0.8, ref: ['ab', 'cb', 'v', 'n'] }));
      const W = [
        { k: 'a', d0: 0, d1: th, col: 'amber', ring: 1, val: th, ref: ['a', 'ab', 'v'], on: 1 },
        { k: 'b', d0: th, d1: 180, col: 'rose', ring: 2, val: 180 - th, ref: ['b', 'ab', 'cb', 'v'], on: 1 },
        { k: 'c', d0: 180, d1: 180 + th, col: 'amber', ring: 1, val: th, ref: ['c', 'cb', 'v'], on: 2 },
        { k: 'd', d0: 180 + th, d1: 360, col: 'rose', ring: 2, val: 180 - th, ref: ['d', 'v'], on: 3 }
      ];
      W.forEach((w) => {
        g.ang(O, w.d0, w.d1, { r, color: w.col, rings: w.ring, ref: w.ref });
        let txt = '';
        if (mode === 'explore') txt = `∠${w.k}=${w.val}°`;
        else if (rev) txt = step >= w.on ? `∠${w.k}=${w.val}°` : `∠${w.k}`;
        else if (kind === 0) txt = w.k === 'a' ? `∠a=${th}°` : `∠${w.k}`;
        if (txt) g.angText(O, w.d0, w.d1, txt, { r, color: w.col, ref: w.ref });
      });
      g.dot(O, { color: 'ink', r: 5 });
      if (mode !== 'review') {
        const h = (id, a) => g.handle(id, g.pol(O, L, a), { color: 'amber', ariaLabel: '직선 기울기 손잡이', drag: (w) => { q.th = clamp(rr5(dirOf180(w)), 30, 150); } });
        h('t1', th); h('t2', th + 180);
      }
      const L1 = [];
      if (mode === 'explore') L1.push([`∠a = ∠c = ${th}°  (맞꼭지각)`, 'amber'], [`∠b = ∠d = ${180 - th}°  (맞꼭지각)`, 'rose'], [`직선 ${n}개 → ${n}×${n - 1} = ${n * (n - 1)}쌍`, 'green']);
      if (rev) {
        if (step >= 1) L1.push([`∠a + ∠b = ${th}° + ${180 - th}° = 180°`, 'ink', ['ab']]);
        if (step >= 2) L1.push([`∠c + ∠b = 180° → ∠a = ∠c = ${th}°`, 'ink', ['cb']]);
        if (step >= 3) L1.push([`∠b = ∠d = ${180 - th}°`, 'rose', ['v']]);
        if (step >= 4) L1.push([`직선 ${n}개 → ${n}×${n - 1} = ${n * (n - 1)}쌍`, 'green', ['n']]);
      }
      const keep = rev ? L1.slice(-3) : L1;
      keep.forEach((l, i) => lineAnchor(g, i, l[0], l[1], l[2] ? { ref: l[2] } : {}));
    },
    problem: (q) => {
      const th = q.th;
      if (q.seed % 2 === 0) {
        const askC = ((q.seed >> 1) % 2) === 0, ans = askC ? th : 180 - th;
        const cands = askC
          ? [{ v: 180 - th, hint: '∠c는 ∠a와 이웃한 각이 아니라 마주 보는 각(맞꼭지각)이라 ∠a와 같아요.' }, { v: 90 - th / 2, hint: '맞꼭지각은 크기가 같아요.' }, { v: 360 - th, hint: '한 점 둘레의 각의 합 360°가 아니라 맞꼭지각이 같다는 것을 쓰세요.' }, { v: th * 2, hint: '맞꼭지각은 2배가 아니라 같은 크기예요.' }]
          : [{ v: th, hint: '∠d는 ∠a와 이웃한 각이에요. 이웃한 두 각의 합이 180°이므로 ∠d = 180° − ∠a예요.' }, { v: 90 - th / 2, hint: '이웃한 두 각의 합은 180°예요.' }, { v: 360 - th, hint: '한 직선 위의 각의 합은 180°예요.' }, { v: th * 2, hint: '∠a의 2배가 아니에요.' }];
        return { key: `a${th}${askC}`, stem: `그림과 같이 두 직선이 한 점에서 만난다. ∠a = ${th}°일 때, ∠${askC ? 'c' : 'd'}의 크기는?`, choices: mkNumChoices(ans, cands, (v) => n1(v) + '°', (v) => v > 0 && v < 360, 10), note: '그림의 노란 점을 끌어 확인할 수 있어요' };
      }
      const np = Math.max(3, q.n), ans = np * (np - 1);
      const cands = [{ v: np * (np - 1) / 2, hint: '직선 2개를 고르는 방법의 수예요. 한 번에 맞꼭지각이 2쌍씩 생기므로 2배를 해야 해요.' }, { v: 2 * np, hint: '직선마다 2쌍이 아니라, 직선 2개를 고를 때마다 2쌍이에요.' }, { v: np * np, hint: '자기 자신과는 짝을 지을 수 없어요. n × (n − 1)이에요.' }, { v: np * (np - 1) + np, hint: '맞꼭지각은 n × (n − 1)쌍이에요.' }, { v: np + 1, hint: '직선 2개를 고르는 모든 경우를 세어 보세요.' }];
      return { key: `n${np}`, stem: `한 점에서 ${np}개의 직선이 만날 때, 생기는 맞꼭지각은 모두 몇 쌍인가?`, choices: mkNumChoices(ans, cands, (v) => v + '쌍', (v) => v > 0, 2), note: '직선 막대로 개수를 바꿔 보세요' };
    },
    reroll: (q) => {
      let t; do { t = rr5(rint(30, 150)); } while (t === q.th || t === 90);
      q.th = t; q.n = rint(3, 6);
    }
  });

  /* ---- 5-2 맞꼭지각으로 식 세우기 ---- */
  const ex1 = (a, b) => `${a}x${b === 0 ? '' : b > 0 ? '+' + b : '−' + (-b)}`;
  const xRange = (c) => {
    let lo = null, hi = null;
    for (let x = 1; x <= 80; x++) {
      const A1 = c.a1 * x + c.b1, A2 = c.a2 * x + c.b2;
      if (A1 >= 18 && A1 <= 162 && A2 >= 18 && A2 <= 162) { if (lo == null) lo = x; hi = x; }
    }
    return lo == null ? [5, 30] : [lo, hi];
  };
  const solOf = (c) => { const x = (c.b2 - c.b1) / (c.a1 - c.a2); return { x, V: c.a1 * x + c.b1 }; };
  const applyRange = (q) => {
    const [lo, hi] = xRange(q), P = PARAMS.ve_x;
    P.min = lo; P.max = hi; q.x = clamp(q.x, lo, hi);
  };
  const sVeq = build({
    id: 've', title: '맞꼭지각으로 식 세우기', short: '맞꼭지각과 방정식',
    question: '맞꼭지각은 크기가 같아요. 두 맞꼭지각이 x에 대한 식으로 주어지면 x는 어떻게 구할까?',
    guide: '막대나 <b>두 반직선의 끝점</b>을 끌어 x를 바꿔 보세요. 두 각 <b>(3x+10)°</b>와 <b>(5x−20)°</b>가 같아질 때만 두 반직선이 <b>한 직선</b>이 되어 맞꼭지각이 돼요. 그때 x를 찾으면 돼요.',
    box: { x: [-1.8, 1.8], y: [-3.2, 1.9] },
    state: { a1: 3, b1: 10, a2: 5, b2: -20 },
    params: { x: { value: 8, min: 8, max: 36, step: 1, color: 'amber', label: 'x의 값', hint: '두 각이 같아지는 x를 찾아보세요', format: (v) => `x = ${Math.round(v)}` } },
    controls: ['x'],
    enter: (q) => { applyRange(q); q.x = Math.max(PARAMS.ve_x.min, Math.min(PARAMS.ve_x.max, 8)); },
    fit: [{ x: 8 }, { x: 15 }, { x: 30 }],
    partOfStep: (st) => ['', 'eq', 'x', 'val'][st] || null,
    steps: (q) => {
      const so = solOf(q), dA = q.a2 - q.a1, k = Math.abs(dA), r = Math.abs(q.b1 - q.b2);
      const move = dA > 0 ? `${q.b1} − (${sgnTxt(q.b2)}) = ${q.a2}x − ${q.a1}x → ${q.b1 - q.b2} = ${dA}x` : `${q.b2} − (${sgnTxt(q.b1)}) = ${q.a1}x − ${q.a2}x → ${q.b2 - q.b1} = ${-dA}x`;
      return [
        `맞꼭지각의 크기는 같으므로 (${ex1(q.a1, q.b1)})° = (${ex1(q.a2, q.b2)})°`,
        `x의 항은 한쪽으로, 숫자는 다른 쪽으로 옮겨요: ${move}. 양변을 ${k}로 나누면 x = ${r} ÷ ${k} = ${so.x}`,
        `x = ${so.x}를 대입하면 (${q.a1}×${so.x}${sgn(q.b1)})° = ${so.V}°, (${q.a2}×${so.x}${sgn(q.b2)})° = ${so.V}° → 맞꼭지각의 크기는 ${so.V}°`
      ];
    },
    work: () => RICH(M('맞꼭지각의 크기는 같다 → 두 식을 = 로 놓고 x를 구한다'), M('구한 x를 두 식에 넣어 각의 크기가 같은지 확인한다')),
    view: (q, mode) => {
      const A1 = q.a1 * q.x + q.b1, A2 = q.a2 * q.x + q.b2, eq = A1 === A2;
      return {
        status: eq ? stat('ok', `x = ${q.x}에서 두 각이 같아요! 맞꼭지각 ${A1}°`) : stat('info', `${A1}° ≠ ${A2}° · 아직 두 반직선이 한 직선이 아니에요`),
        readouts: [rd(`(${ex1(q.a1, q.b1)})°`, A1 + '°', eq ? 'green' : 'amber', 'x = ' + q.x, 'a'), rd(`(${ex1(q.a2, q.b2)})°`, A2 + '°', eq ? 'green' : 'rose', 'x = ' + q.x, 'b'), rd('두 각의 차', Math.abs(A1 - A2) + '°', 'sky', eq ? '같아요' : '0°가 되는 x를 찾아요', null, true)],
        alert: { tone: 'key', text: `맞꼭지각이 같으려면 (${ex1(q.a1, q.b1)})° = (${ex1(q.a2, q.b2)})° 를 만족해야 해요.` }
      };
    },
    draw: (g, q, mode, step) => {
      const rev = mode === 'review', x = rev ? solOf(q).x : q.x, A1 = q.a1 * x + q.b1, A2 = q.a2 * x + q.b2, O = [0, 0], L = 1.55, r = wedgeR(g), eq = A1 === A2;
      g.box(-1.7, -1.7, 1.7, 1.7);
      const c1 = eq ? 'green' : 'amber', c2 = eq ? 'green' : 'rose';
      g.seg(g.pol(O, L, 0), g.pol(O, L, 180), { color: 'sky', width: 4.5 });
      if (!eq) g.seg(O, g.pol(O, L, A1 + 180), { color: 'muted', width: 3, dash: [6, 6], alpha: 0.9 });
      g.seg(O, g.pol(O, L, A1), { color: 'sky', width: 4.5 });
      g.seg(O, g.pol(O, L, 180 + A2), { color: 'sky', width: 4.5 });
      g.ang(O, 0, A1, { r, color: c1, rings: eq ? 2 : 1, ref: ['a', 'eq', 'x', 'val'] });
      g.ang(O, 180, 180 + A2, { r, color: c2, rings: eq ? 2 : 1, ref: ['b', 'eq', 'x', 'val'] });
      g.dot(O, { color: 'ink', r: 5 });
      const lab1 = `(${ex1(q.a1, q.b1)})°`, lab2 = `(${ex1(q.a2, q.b2)})°`;
      g.angText(O, 0, A1, lab1, { r, color: c1, ref: ['a', 'eq', 'x', 'val'] });
      g.angText(O, 180, 180 + A2, lab2, { r, color: c2, ref: ['b', 'eq', 'x', 'val'] });
      if (!rev) {
        g.handle('u1', g.pol(O, L, A1), { color: 'amber', ariaLabel: '위쪽 반직선 끝', drag: (w) => { const a = mod(Math.atan2(w.y, w.x) / D2R, 360); q.x = clamp(Math.round((a - q.b1) / q.a1), PARAMS.ve_x.min, PARAMS.ve_x.max); } });
        g.handle('u2', g.pol(O, L, 180 + A2), { color: 'rose', ariaLabel: '아래쪽 반직선 끝', drag: (w) => { const a = mod(Math.atan2(w.y, w.x) / D2R - 180, 360); q.x = clamp(Math.round((a - q.b2) / q.a2), PARAMS.ve_x.min, PARAMS.ve_x.max); } });
      }
      const so = solOf(q), lines = [];
      if (mode === 'explore') {
        lines.push([`x = ${q.x}  →  (${ex1(q.a1, q.b1)})° = ${A1}°`, c1], [`(${ex1(q.a2, q.b2)})° = ${A2}°`, c2], [eq ? '두 각이 같아요!' : `${A1}° ≠ ${A2}°  달라요`, eq ? 'green' : 'ink']);
      }
      if (rev) {
        if (step >= 1) lines.push([`(${ex1(q.a1, q.b1)})° = (${ex1(q.a2, q.b2)})°`, 'ink', ['eq']]);
        if (step >= 2) lines.push([`x = ${so.x}`, 'green', ['x']]);
        if (step >= 3) lines.push([`${A1}° = ${A2}°`, 'green', ['val']]);
      }
      lines.forEach((l, i) => lineAnchor(g, i, l[0], l[1], l[2] ? { ref: l[2] } : {}));
    },
    problem: (q) => {
      const so = solOf(q), askX = q.seed % 2 === 0, e1 = ex1(q.a1, q.b1), e2 = ex1(q.a2, q.b2);
      const pos = (v) => v > 0 && v < 200;
      const cands = [];
      const push = (v, hint) => { if (Number.isInteger(v)) cands.push({ v, hint }); };
      if (askX) {
        push(so.V, '각의 크기가 아니라 x의 값을 구해야 해요.');
        push((q.b1 - q.b2) / (q.a1 + q.a2), '맞꼭지각이 같다고 했으니 두 식을 빼서 정리해야 해요(더하지 않아요).');
        push((180 - q.b1 - q.b2) / (q.a1 + q.a2), '맞꼭지각은 합이 180°가 아니라 크기가 같아요.');
        push((q.b2 + q.b1) / (q.a2 + q.a1), '이항할 때 부호를 바꿔요.');
        push(so.x + 2, '이항한 뒤 계산을 다시 확인해 보세요.'); push(so.x - 2, '이항한 뒤 계산을 다시 확인해 보세요.');
        return { key: `x${q.a1}${q.b1}${q.a2}${q.b2}`, stem: `그림과 같이 두 직선이 한 점에서 만날 때, 두 맞꼭지각의 크기가 (${e1})°, (${e2})°이다. x의 값은?`, choices: mkNumChoices(so.x, cands, (v) => String(v), (v) => v > 0, 1), note: '식의 x를 바꿔 두 각이 같아지는 곳을 찾아도 돼요' };
      }
      push(so.x, 'x가 아니라 각의 크기를 구해야 해요. x를 식에 대입해 보세요.');
      push(180 - so.V, '맞꼭지각이 아니라 이웃한 각의 크기예요.');
      push(so.V + 10, '대입한 계산을 다시 확인해 보세요.'); push(so.V - 10, '대입한 계산을 다시 확인해 보세요.');
      push(so.V * 2, '맞꼭지각 두 개의 합이에요. 한 각의 크기를 구해야 해요.');
      return { key: `v${q.a1}${q.b1}${q.a2}${q.b2}`, stem: `그림과 같이 두 직선이 한 점에서 만날 때, 두 맞꼭지각의 크기가 (${e1})°, (${e2})°이다. 이 맞꼭지각의 크기는?`, choices: mkNumChoices(so.V, cands, (v) => v + '°', pos, 5), note: '먼저 x를 구한 뒤 대입하세요' };
    },
    reroll: (q, lab) => {
      for (let t = 0; t < 400; t++) {
        const a1 = rint(2, 6), a2 = rint(2, 6);
        if (a1 === a2) continue;
        const xs = rint(8, 30), V = rint(8, 28) * 5, b1 = V - a1 * xs, b2 = V - a2 * xs;
        if (Math.abs(b1) > 60 || Math.abs(b2) > 60 || b1 === 0 || b2 === 0 || b1 === q.b1) continue;
        const [lo, hi] = xRange({ a1, b1, a2, b2 });
        if (xs < lo || xs > hi || hi - lo < 8 || V < 30 || V > 150) continue;
        q.a1 = a1; q.b1 = b1; q.a2 = a2; q.b2 = b2; break;
      }
      applyRange(q); q.x = PARAMS.ve_x.min;
      rebuildControls(lab);
    }
  });

  /* ---- 5-3 한 점에서 만나는 세 직선 ---- */
  // 문제 설정: 지금 그림의 ∠a, ∠b, ∠c(= 180° − ∠a − ∠b)에서 x와 계수를 정해 (x+p)°, b°, (r·x+s)° 로 바꿔 씁니다.
  const thrCfg = (q) => {
    const A = q.a, B = q.bb, C = 180 - A - B, out = [];
    for (const lim of [[40, 60], [80, 120]]) {
      for (let xs = 5; xs <= 60; xs++) for (let r = 2; r <= 4; r++) {
        const p = A - xs, s = C - r * xs;
        if (Math.abs(p) <= lim[0] && Math.abs(s) <= lim[1] && p !== 0 && s !== 0) out.push({ xs, r, p, s });
      }
      if (out.length) break;
    }
    const c = out[(q.seed * 7) % out.length] || { xs: 20, r: 3, p: A - 20, s: C - 60 };
    return { ...c, A, B, C, e1: `x${c.p < 0 ? '−' + (-c.p) : '+' + c.p}`, e3: `${c.r}x${c.s < 0 ? '−' + (-c.s) : '+' + c.s}` };
  };
  const sThr = build({
    id: 'th', title: '한 점에서 만나는 세 직선', short: '세 직선과 평각',
    question: '세 직선이 한 점에서 만나면 여섯 개의 각이 생겨요. 한 직선 위의 각을 모두 더하면 몇 도일까?',
    guide: '<b>직선 끝의 노란 점</b>을 끌어 각을 바꿔 보세요. 한 직선 위에 놓인 세 각 ∠a, ∠b, ∠c의 합은 언제나 <b>평각 180°</b>이고, 마주 보는 각(같은 색·같은 호의 수)은 크기가 같아요.',
    box: { x: [-1.8, 1.8], y: [-3.2, 1.8] },
    params: {
      a: { value: 40, min: 15, max: 120, step: 5, color: 'amber', label: '∠a', hint: '그림의 직선 끝점을 끌어도 돼요', format: (v) => `${Math.round(v)}°`, onInput: (q) => { q.bb = Math.min(q.bb, 165 - q.a); } },
      bb: { value: 60, min: 15, max: 120, step: 5, color: 'rose', label: '∠b', format: (v) => `${Math.round(v)}°`, onInput: (q) => { q.a = Math.min(q.a, 165 - q.bb); } }
    },
    controls: ['a', 'bb'],
    fit: [{ a: 40, bb: 60 }, { a: 15, bb: 120 }, { a: 120, bb: 15 }],
    partOfStep: (st) => ['', 'flat', 'vert', 'x'][st] || null,
    steps: (q) => {
      const c = thrCfg(q), k = 1 + c.r, cst = c.p + c.B + c.s, R = 180 - cst;
      return [
        `한 직선 위에 있는 세 각의 합은 평각 180°이므로 ∠a + ∠b + ∠c = 180°`,
        `∠c와 ∠c′은 맞꼭지각이므로 ∠c = ∠c′ = (${c.e3})°. 식을 세우면 (${c.e1}) + ${c.B} + (${c.e3}) = 180`,
        `정리하면 ${k}x ${cst < 0 ? '−' : '+'} ${Math.abs(cst)} = 180 → ${k}x = ${R} → x = ${R} ÷ ${k} = ${c.xs}`
      ];
    },
    work: () => RICH(M('한 직선 위의 각의 합 = 180° (평각)'), M('맞꼭지각의 크기는 같다')),
    view: (q, mode) => {
      const C = 180 - q.a - q.bb;
      return {
        status: stat('ok', `∠a + ∠b + ∠c = ${q.a}° + ${q.bb}° + ${C}° = 180°`),
        readouts: [rd('∠a = ∠a′', q.a + '°', 'amber', '맞꼭지각', 'a'), rd('∠b = ∠b′', q.bb + '°', 'rose', '맞꼭지각', 'b'), rd('∠c = ∠c′', C + '°', 'violet', '180° − ∠a − ∠b', 'c'), rd('한 직선 위의 합', '180°', 'green', '평각', 'flat')],
        alert: { tone: 'key', text: '∠a와 ∠b를 어떻게 바꿔도 ∠a + ∠b + ∠c는 항상 180°예요.' }
      };
    },
    draw: (g, q, mode, step) => {
      const A = q.a, B = q.bb, C = 180 - A - B, O = [0, 0], L = 1.55, r = wedgeR(g), rev = mode === 'review', cfg = thrCfg(q);
      g.box(-1.7, -1.7, 1.7, 1.7);
      [0, A, A + B].forEach((a) => g.seg(g.pol(O, L, a), g.pol(O, L, a + 180), { color: 'sky', width: 4.5, ref: ['flat', 'vert', 'x'] }));
      const S = A + B;
      const W = [
        { k: 'a', d0: 0, d1: A, col: 'amber', ring: 1, ref: ['a', 'flat', 'x'], txt: mode === 'explore' ? `∠a=${A}°` : `(${cfg.e1})°` },
        { k: 'b', d0: A, d1: S, col: 'rose', ring: 2, ref: ['b', 'flat', 'x'], txt: mode === 'explore' ? `∠b=${B}°` : `${B}°` },
        { k: 'c', d0: S, d1: 180, col: 'violet', ring: 3, ref: ['c', 'flat', 'vert', 'x'], txt: mode === 'explore' ? `∠c=${C}°` : rev && step >= 2 ? `(${cfg.e3})°` : '∠c' },
        { k: 'a2', d0: 180, d1: 180 + A, col: 'amber', ring: 1, ref: ['a2'], txt: mode === 'explore' ? `${A}°` : '' },
        { k: 'b2', d0: 180 + A, d1: 180 + S, col: 'rose', ring: 2, ref: ['b2'], txt: mode === 'explore' ? `${B}°` : '' },
        { k: 'c2', d0: 180 + S, d1: 360, col: 'violet', ring: 3, ref: ['c2', 'vert', 'x'], txt: mode === 'explore' ? `${C}°` : `(${cfg.e3})°` }
      ];
      W.forEach((w) => {
        g.ang(O, w.d0, w.d1, { r, color: w.col, rings: w.ring, ref: w.ref });
        if (w.txt) g.angText(O, w.d0, w.d1, w.txt, { r: r + 16, color: w.col, ref: w.ref });
      });
      g.dot(O, { color: 'ink', r: 5 });
      if (mode !== 'review') {
        g.handle('r2', g.pol(O, L, A), { color: 'amber', ariaLabel: '둘째 직선 끝', drag: (w) => { q.a = clamp(rr5(dirOf180(w)), 15, 165 - q.bb); } });
        g.handle('r2b', g.pol(O, L, A + 180), { color: 'amber', ariaLabel: '둘째 직선 반대쪽 끝', drag: (w) => { q.a = clamp(rr5(dirOf180(w)), 15, 165 - q.bb); } });
        g.handle('r3', g.pol(O, L, S), { color: 'rose', ariaLabel: '셋째 직선 끝', drag: (w) => { q.bb = clamp(rr5(dirOf180(w)) - q.a, 15, 165 - q.a); } });
        g.handle('r3b', g.pol(O, L, S + 180), { color: 'rose', ariaLabel: '셋째 직선 반대쪽 끝', drag: (w) => { q.bb = clamp(rr5(dirOf180(w)) - q.a, 15, 165 - q.a); } });
      }
      const k = 1 + cfg.r, cst = cfg.p + B + cfg.s, lines = [];
      if (mode === 'explore') lines.push(['∠a + ∠b + ∠c', 'ink'], [`= ${A}° + ${B}° + ${C}° = 180°`, 'green']);
      if (rev) {
        if (step >= 1) lines.push(['∠a + ∠b + ∠c = 180°', 'ink', ['flat']]);
        if (step >= 2) lines.push([`(${cfg.e1}) + ${B} + (${cfg.e3}) = 180`, 'ink', ['vert']]);
        if (step >= 3) lines.push([`${k}x ${cst < 0 ? '−' : '+'} ${Math.abs(cst)} = 180  →  x = ${cfg.xs}`, 'green', ['x']]);
      }
      lines.slice(-3).forEach((l, i) => lineAnchor(g, i, l[0], l[1], l[2] ? { ref: l[2] } : {}));
    },
    problem: (q) => {
      const c = thrCfg(q), k = 1 + c.r, cst = c.p + c.B + c.s;
      const cands = [
        { v: (360 - cst) / k, hint: '한 직선 위의 각의 합은 360°가 아니라 평각 180°예요.' },
        { v: (180 - c.p - c.s) / k, hint: `${c.B}°인 각도 한 직선 위에 있어요. 세 각을 모두 더해야 해요.` },
        { v: (180 - cst) / c.r, hint: 'x가 들어 있는 각이 두 개예요. x의 계수를 모두 더하세요.' },
        { v: (180 - c.p - c.B + c.s) / k, hint: '식을 세울 때 부호를 확인해 보세요.' },
        { v: (90 - cst) / k, hint: '평각은 직각(90°)이 아니라 180°예요.' }
      ].filter((o) => Number.isInteger(o.v));
      return {
        key: `${c.A},${c.B},${c.xs},${c.r}`, stem: `그림과 같이 세 직선이 한 점에서 만날 때, 세 각이 (${c.e1})°, ${c.B}°, (${c.e3})°이다. x의 값은?`,
        choices: mkNumChoices(c.xs, cands, (v) => String(v), (v) => v > 0, 2), note: '∠c′과 ∠c가 맞꼭지각인 것을 이용하세요'
      };
    },
    reroll: (q) => {
      let a, b; do { a = rint(4, 14) * 5; b = rint(6, 16) * 5; } while (a + b > 150 || (a === q.a && b === q.bb));
      q.a = a; q.bb = b;
    }
  });

  /* ======================================================================
     ⑥ 수직과 수선
     ====================================================================== */
  /* ---- 6-1 수선의 발과 점과 직선 사이의 거리 ---- */
  const pdBank = (q) => {
    const d = q.d, dq = Math.abs(q.q), nz = dq > 0.01;
    const T = [
      { t: '점 P와 직선 ℓ 사이의 거리는 선분 PH의 길이이다.' },
      { t: '선분 PH와 직선 ℓ은 서로 수직이다.' },
      { t: '점 H는 점 P에서 직선 ℓ에 내린 수선의 발이다.' },
      { t: `점 P와 직선 ℓ 사이의 거리는 ${d} cm이다.` },
      { t: '직선 ℓ 위의 점 중에서 점 P와의 거리가 가장 짧은 점은 점 H이다.' }
    ];
    const F = [
      { t: '직선 ℓ 위의 점 Q가 점 H에서 멀어질수록 선분 PQ의 길이는 짧아진다.', h: '점 Q가 H에서 멀어질수록 PQ는 길어져요. PH가 가장 짧아요.' },
      { t: '점 P에서 직선 ℓ에 그을 수 있는 수선은 무수히 많다.', h: '점 P에서 직선 ℓ에 그은 수선은 하나뿐이에요.' },
      { t: '점 P와 직선 ℓ 사이의 거리는 선분 HQ의 길이이다.', h: 'HQ는 직선 ℓ 위의 선분이에요. 거리는 수선 PH의 길이예요.' },
      { t: '수선의 발은 직선 ℓ 위에 있지 않다.', h: '수선의 발 H는 수선과 직선 ℓ이 만나는 점이라 직선 ℓ 위에 있어요.' }
    ];
    if (nz) {
      F.push({ t: '점 P와 직선 ℓ 사이의 거리는 선분 PQ의 길이이다.', h: '비스듬한 PQ가 아니라 직선 ℓ에 수직인 PH의 길이예요.' });
      F.push({ t: '선분 PQ와 직선 ℓ은 서로 수직이다.', h: 'PQ는 비스듬해서 직각이 아니에요. 직각 표시가 있는 것은 PH예요.' });
      F.push({ t: '점 Q는 점 P에서 직선 ℓ에 내린 수선의 발이다.', h: '수선의 발은 직각 표시가 있는 점 H예요.' });
      F.push({ t: '직선 ℓ 위의 점 중에서 점 P와의 거리가 가장 짧은 점은 점 Q이다.', h: 'P와 가장 가까운 점은 수선의 발 H예요.' });
      F.push({ t: '선분 PQ의 길이는 선분 PH의 길이보다 짧거나 같다.', h: 'PH가 가장 짧아서 PQ는 PH보다 길어요.' });
      if (dq !== d) F.push({ t: `점 P와 직선 ℓ 사이의 거리는 ${q.q > 0 ? q.q : -q.q} cm이다.`, h: '그 값은 HQ의 길이예요. 거리는 PH의 길이 ' + d + ' cm예요.' });
    }
    return { T, F };
  };
  const stmtChoices = (bank, seed) => {
    const t = bank.T[seed % bank.T.length], fs = [];
    for (let i = 0; fs.length < 4 && i < bank.F.length * 2; i++) { const f = bank.F[(seed * 3 + i) % bank.F.length]; if (!fs.includes(f)) fs.push(f); }
    const arr = [{ t: t.t, ok: true }, ...fs.map((f) => ({ t: f.t, ok: false, hint: f.h }))];
    const key = (s) => { let h = seed * 131 + 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 9973; return h; };
    return arr.sort((a, b) => key(a.t) - key(b.t));
  };
  const sPerp = build({
    id: 'pd', title: '수선의 발과 점·직선 사이의 거리', short: '수선과 거리',
    question: '직선 ℓ 밖의 점 P에서 직선 ℓ 위의 점까지 선분을 그을 때, 가장 짧은 것은 어느 선분일까?',
    guide: '<b>점 P</b>와 <b>점 Q</b>를 가로로 끌어 보세요(P의 높이는 막대로 바꿔요). 점 Q가 어디에 있든 <b>직각(∟) 표시가 있는 PH</b>가 가장 짧아요. 점 H가 <b>수선의 발</b>이고, 점 P와 직선 ℓ 사이의 거리는 PH의 길이예요.',
    box: { x: [-5.4, 5.4], y: [-2.9, 5.6] },
    state: { px: 0 },
    params: {
      d: { value: 4, min: 2, max: 5, step: 1, color: 'rose', label: '점 P와 직선 ℓ 사이의 거리 PH', format: (v) => `${Math.round(v)} cm` },
      q: { value: 3, min: -4, max: 4, step: 0.5, color: 'violet', label: '점 Q의 위치 (H에서 좌우로)', hint: '그림의 점 Q를 가로로 끌어도 돼요', format: (v) => (v === 0 ? 'Q = H' : (v > 0 ? '오른쪽 ' : '왼쪽 ') + Math.abs(v) + ' cm') }
    },
    controls: ['d', 'q'],
    presets: [{ group: '점 Q', label: 'H와 겹치기', apply: (q) => { q.q = 0; }, on: (q) => q.q === 0 }, { label: '가까이', apply: (q) => { q.q = 1; }, on: (q) => q.q === 1 }, { label: '멀리', apply: (q) => { q.q = 4; }, on: (q) => q.q === 4 }],
    fit: [{ d: 4, q: 3, px: 0 }, { d: 5, q: -4, px: 2 }, { d: 2, q: 4, px: -2 }],
    partOfStep: (st) => ['', 'ph', 'h', 'bar'][st] || null,
    steps: (q) => [
      `직선 ℓ 위의 점과 점 P를 잇는 선분 중에서 직선 ℓ과 직각(90°)으로 만나는 선분이 PH예요. 이때 ℓ ⊥ PH이고, PH를 직선 ℓ의 수선이라고 해요.`,
      `수선 PH가 직선 ℓ과 만나는 점 H를 수선의 발이라고 해요.`,
      `점 Q가 어디에 있어도 PQ는 PH보다 길거나 같아요. 그래서 점 P와 직선 ℓ 사이의 거리는 수선의 발 H까지의 길이 PH = ${q.d} cm예요.`
    ],
    work: () => RICH(M('직선 ℓ 밖의 점 P에서 직선 ℓ에 수직인 선분 PH를 그을 때'), M('H = 수선의 발, 점 P와 직선 ℓ 사이의 거리 = 선분 PH의 길이')),
    view: (q) => {
      const hyp = Math.hypot(q.d, q.q), same = Math.abs(q.q) < 0.01;
      return {
        status: stat('info', same ? 'Q가 H와 같아요 · PQ = PH (가장 짧아요)' : 'PQ는 PH보다 길어요 · PH가 가장 짧아요'),
        readouts: [rd('점 P와 직선 ℓ 사이의 거리', q.d + ' cm', 'rose', 'PH의 길이', 'ph', true), rd('H에서 Q까지', Math.abs(q.q) + ' cm', 'violet', 'HQ의 길이', 'pq'), rd('PQ와 PH 비교', same ? 'PQ = PH' : 'PQ > PH', same ? 'green' : 'violet', hyp > q.d + 1e-9 ? 'PQ가 더 길어요' : 'Q가 H와 같을 때', 'bar')],
        alert: { tone: 'key', text: '직선 밖의 점에서 직선 위의 점까지 이은 선분 중 가장 짧은 것은 수선이에요.' }
      };
    },
    draw: (g, q, mode, step) => {
      const d = q.d, qq = q.q, px = q.px, P = [px, d], H = [px, 0], Q = [px + qq, 0], hyp = Math.hypot(d, qq), same = Math.abs(qq) < 0.01;
      g.box(-5.4, -2.9, 5.4, d + 0.9);
      g.seg([-5.2, 0], [5.2, 0], { color: 'sky', width: 4.5 });
      g.text([5.0, 0], 'ℓ', { dy: -20, size: 20, color: 'sky' });
      if (!same) g.seg(P, Q, { color: 'violet', width: 3.5, ref: ['pq', 'bar'] });
      g.seg(P, H, { color: 'rose', width: 5.5, ref: ['ph', 'bar'] });
      g.right(H, P, [px + 1, 0], { size: 15, color: 'amber', ref: ['ph', 'h'] });
      g.text(H, 'ℓ ⊥ PH', { dx: 52, dy: -26, size: 16, color: 'amber', ref: ['ph'] });
      const w = textW(`PH = ${d} cm`, 17);
      g.text([px, d / 2], `PH = ${d} cm`, { dx: -(w / 2 + 12), size: 17, color: 'rose', ref: ['ph', 'bar'] });
      if (!same) g.text([px + qq / 2, d / 2], 'PQ', { dx: (qq > 0 ? 1 : -1) * 20, size: 17, color: 'violet', ref: ['pq', 'bar'] });
      g.dot(H, { color: 'ink', r: 5.5, ref: ['h'] });
      g.text(H, same ? 'H = Q' : (mode === 'review' && step >= 2 ? '수선의 발 H' : 'H'), { dy: 26, size: 17, color: 'ink', ref: ['h'] });
      if (!same) { g.dot(Q, { color: 'violet', r: 5.5 }); g.text(Q, 'Q', { dy: Math.abs(qq) < 1.5 ? 50 : 26, size: 17, color: 'violet' }); }
      g.dot(P, { color: 'rose', r: 6 });
      g.text(P, 'P', { dy: -24, size: 19, color: 'rose' });
      g.handle('P', P, { color: 'amber', ariaLabel: '점 P (가로로 끌기)', drag: (w2) => { q.px = clamp(Math.round(w2.x * 4) / 4, -2, 2); } });
      if (!same) g.handle('Q', Q, { color: 'violet', ariaLabel: '점 Q (가로로 끌기)', drag: (w2) => { q.q = clamp(Math.round((w2.x - q.px) * 2) / 2, -4, 4); } });
      else g.handle('Q', Q, { color: 'violet', ariaLabel: '점 Q (가로로 끌기)', r: 7, drag: (w2) => { q.q = clamp(Math.round((w2.x - q.px) * 2) / 2, -4, 4); } });
      // 길이 비교 막대(그림과 같은 눈금): PH와 PQ
      const x0 = -5, y1 = -1.8, y2 = -2.4;
      g.seg([x0, y1], [x0 + d, y1], { color: 'rose', width: 10, cap: 'butt', ref: ['ph', 'bar'] });
      g.text([x0 + d, y1], `PH = ${d} cm`, { dx: 10, align: 'left', size: 16, color: 'rose', ref: ['ph', 'bar'] });
      g.seg([x0, y2], [x0 + hyp, y2], { color: 'violet', width: 10, cap: 'butt', ref: ['pq', 'bar'] });
      g.text([x0 + hyp, y2], same ? 'PQ = PH' : 'PQ > PH', { dx: 10, align: 'left', size: 16, color: 'violet', ref: ['pq', 'bar'] });
    },
    problem: (q) => {
      const ch = stmtChoices(pdBank(q), q.seed);
      return { key: `${q.d},${q.q},${q.seed}`, stem: '그림에서 점 P와 직선 ℓ 사이의 거리에 대한 설명으로 옳은 것은?', choices: ch.map((c) => ({ ...c })), list: true, note: '그림의 P·Q를 움직여 확인해 보세요' };
    },
    reroll: (q) => {
      q.d = rint(2, 5);
      let v; do { v = rint(-8, 8) / 2; } while (v === 0 || v === q.q);
      q.q = v; q.px = pickOf([-1.5, -1, 0, 1, 1.5]);
    }
  });

  /* ---- 6-2 평각의 두 이등분선이 이루는 각 ---- */
  const bisAng = (q) => ({ aA: 180, aC: 180 - q.g, aB: 180 - q.T, aM: 180 - q.g / 2, aN: 180 - (q.T + q.g) / 2 });
  const sBis = build({
    id: 'bs', title: '평각의 두 이등분선이 이루는 각', short: '이등분선 사이의 각',
    question: '평각 AOB 안에 반직선 OC를 긋고, 각 AOC와 각 COB를 각각 이등분하면 두 이등분선 사이의 각은 얼마일까?',
    guide: '<b>반직선 OC의 끝(노랑 점)</b>을 끌어 보세요. OM은 ∠AOC를, ON은 ∠COB를 이등분해요. OC를 어디로 옮겨도 ∠MON은 <b>언제나 90°</b>(직각)예요. 막대로 ∠AOB를 평각보다 작게 줄여도 ∠MON = ∠AOB ÷ 2예요.',
    box: { x: [-1.8, 1.8], y: [-3.2, 1.8] },
    params: {
      g: { value: 70, min: 15, max: 165, step: 5, color: 'amber', label: '∠AOC', hint: '그림의 점 C를 끌어도 돼요', format: (v) => `${Math.round(v)}°`, onInput: (q) => { q.g = Math.min(q.g, q.T - 15); } },
      T: { value: 180, min: 60, max: 180, step: 10, color: 'sky', label: '∠AOB (180°이면 평각)', hint: '점 B를 끌어도 돼요', format: (v) => `${Math.round(v)}°`, onInput: (q) => { q.g = Math.min(q.g, q.T - 15); } }
    },
    controls: ['g', 'T'],
    presets: [{ group: '∠AOB', label: '평각 180°', apply: (q) => { q.T = 180; }, on: (q) => q.T === 180 }, { label: '120°', apply: (q) => { q.T = 120; q.g = Math.min(q.g, 105); }, on: (q) => q.T === 120 }],
    fit: [{ g: 70, T: 180 }, { g: 15, T: 60 + 0 }, { g: 165, T: 180 }, { g: 45, T: 60 }],
    partOfStep: (st) => ['', 'am', 'nb', 'all', 'mon'][st] || null,
    steps: (q) => {
      const t = q.T, g1 = q.g, g2 = t - q.g;
      return [
        `OM은 ∠AOC = ${g1}°를 이등분하므로 ∠AOM = ∠MOC = ● = ${g1}° ÷ 2 = ${n1(g1 / 2)}°`,
        `ON은 ∠COB = ${g2}°를 이등분하므로 ∠CON = ∠NOB = × = ${g2}° ÷ 2 = ${n1(g2 / 2)}°`,
        `∠AOB = 2● + 2× = ${t}°${t === 180 ? ' (평각)' : ''}이므로 ● + × = ${t}° ÷ 2 = ${n1(t / 2)}°`,
        `∠MON = ∠MOC + ∠CON = ● + × = ${n1(t / 2)}°${t === 180 ? '. 따라서 OM ⊥ ON (직각)이에요.' : ''}`
      ];
    },
    work: () => RICH(M('∠AOB = 2● + 2× 이므로 ● + × = ∠AOB ÷ 2'), M('∠MON = ● + × = ∠AOB ÷ 2 (평각이면 90°)')),
    view: (q) => ({
      status: stat('ok', `∠MON = ${n1(q.T / 2)}°${q.T === 180 ? ' (직각)' : ''}`),
      readouts: [rd('● (∠AOC의 절반)', n1(q.g / 2) + '°', 'amber', `${q.g}° ÷ 2`, 'am'), rd('× (∠COB의 절반)', n1((q.T - q.g) / 2) + '°', 'rose', `${q.T - q.g}° ÷ 2`, 'nb'), rd('∠MON = ● + ×', n1(q.T / 2) + '°', 'green', q.T === 180 ? '언제나 직각' : '∠AOB의 절반', 'mon', true)],
      alert: { tone: 'key', text: 'OC를 어디로 옮겨도 ● + ×는 변하지 않아요. ∠MON은 ∠AOB의 절반이에요.' }
    }),
    draw: (g, q, mode, step) => {
      const O = [0, 0], L = 1.6, T = q.T, gg = q.g, a = bisAng(q), r = clamp(g.k(0.3), 28, 70), rev = mode === 'review';
      g.box(-1.75, -0.05, 1.75, 1.75);
      g.seg(O, g.pol(O, L, a.aA), { color: 'sky', width: 4.5 }); g.seg(O, g.pol(O, L, a.aB), { color: 'sky', width: 4.5 });
      g.seg(O, g.pol(O, L, a.aC), { color: 'ink', width: 4 });
      g.seg(O, g.pol(O, L, a.aM), { color: 'green', width: 3.5, ref: ['am', 'all', 'mon'] }); g.seg(O, g.pol(O, L, a.aN), { color: 'green', width: 3.5, ref: ['nb', 'all', 'mon'] });
      const h1 = gg / 2, h2 = (T - gg) / 2;
      const Wd = [
        { d0: a.aM, d1: a.aA, col: 'amber', ring: 1, v: h1, ref: ['am', 'all'] }, { d0: a.aC, d1: a.aM, col: 'amber', ring: 1, v: h1, ref: ['am', 'all'] },
        { d0: a.aN, d1: a.aC, col: 'rose', ring: 2, v: h2, ref: ['nb', 'all'] }, { d0: a.aB, d1: a.aN, col: 'rose', ring: 2, v: h2, ref: ['nb', 'all'] }
      ];
      Wd.forEach((w) => { g.ang(O, w.d0, w.d1, { r, color: w.col, rings: w.ring, ref: w.ref }); g.angText(O, w.d0, w.d1, (w.col === 'amber' ? '● ' : '× ') + n1(w.v) + '°', { r: r + 14, color: w.col, ref: w.ref }); });
      if (mode === 'explore' || (rev && step >= 4)) {
        if (T === 180) g.right(O, g.pol(O, 1, a.aM), g.pol(O, 1, a.aN), { size: 14, color: 'green' });
        else g.ang(O, a.aN, a.aM, { r: r * 0.55, color: 'green', rings: 1, ref: ['mon'] });
      }
      g.dot(O, { color: 'ink', r: 5 });
      [['A', a.aA, 'sky'], ['B', a.aB, 'sky'], ['C', a.aC, 'ink'], ['M', a.aM, 'green'], ['N', a.aN, 'green']].forEach(([nm, ang, col]) => g.out(g.pol(O, L, ang), ang, nm, { size: 19, color: col }, 17));
      const rel = (w) => { const ang = w.y < 0 ? (w.x < 0 ? 180 : 0) : Math.atan2(w.y, w.x) / D2R; return ang; };
      g.handle('C', g.pol(O, L, a.aC), { color: 'amber', ariaLabel: '반직선 OC 끝', drag: (w) => { q.g = clamp(rr5(180 - rel(w)), 15, q.T - 15); } });
      g.handle('B', g.pol(O, L, a.aB), { color: 'sky', ariaLabel: '반직선 OB 끝', drag: (w) => { q.T = clamp(Math.round((180 - rel(w)) / 10) * 10, 60, 180); q.g = Math.min(q.g, q.T - 15); } });
      const lines = [];
      if (mode === 'explore' || (rev && step >= 1)) lines.push([`∠AOC = ${gg}° → ● = ${n1(h1)}°`, 'amber', ['am']]);
      if (mode === 'explore' || (rev && step >= 2)) lines.push([`∠COB = ${T - gg}° → × = ${n1(h2)}°`, 'rose', ['nb']]);
      if (rev && step === 3) lines.push([`2● + 2× = ${T}° → ● + × = ${n1(T / 2)}°`, 'ink', ['all']]);
      if (mode === 'explore' || (rev && step >= 4)) lines.push([`∠MON = ● + × = ${n1(T / 2)}°`, 'green', ['mon']]);
      lines.slice(-3).forEach((l, i) => g.text([0, -0.02], l[0], { dy: 42 + i * 27, size: 17, color: l[1], ref: l[2] }));
    },
    problem: (q) => {
      const h = q.T / 2, ch = [
        { v: q.g / 2, hint: '● 하나(∠AOC의 절반)만 구했어요. ∠MON은 ● + ×예요.' }, { v: (q.T - q.g) / 2, hint: '× 하나(∠COB의 절반)만 구했어요. ∠MON은 ● + ×예요.' },
        { v: q.T, hint: '∠MON은 ∠AOB 전체가 아니라 그 절반이에요.' }, { v: q.T / 4, hint: '절반을 한 번 더 나누지 않아요. ∠MON = ∠AOB ÷ 2예요.' }, { v: q.g, hint: '∠AOC는 ∠MON과 관계없이 정해져요. ∠MON은 ∠AOB의 절반이에요.' }
      ];
      return { key: `${q.g},${q.T}`, stem: `그림에서 ∠AOB = ${q.T}°${q.T === 180 ? '(평각)' : ''}이고 OM은 ∠AOC의 이등분선, ON은 ∠COB의 이등분선이다. ∠AOC = ${q.g}°일 때, ∠MON의 크기는?`, choices: mkNumChoices(h, ch, (v) => n1(v) + '°', (v) => v > 0 && v <= 360, 10), note: 'OC를 움직여도 ∠MON이 변하는지 확인해 보세요' };
    },
    reroll: (q) => {
      q.T = pickOf([180, 180, 120, 140, 100, 160]);
      let v; do { v = rint(2, Math.floor((q.T - 20) / 10)) * 10; } while (v === q.g || v > q.T - 15);
      q.g = v;
    }
  });

  /* ---- 6-3 삼각형에서 점과 변 사이의 거리 ---- */
  const TRIPLES = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10]]; // [BC, CA, AB]
  const sTri = build({
    id: 'tr', title: '삼각형에서 점과 변 사이의 거리', short: '삼각형의 높이와 거리',
    question: '삼각형 ABC에서 꼭짓점 A와 변 BC(를 늘인 직선) 사이의 거리는 어느 선분의 길이일까?',
    guide: '<b>점 A</b>를 가로로 끌어 보세요. A에서 직선 BC에 직각으로 내린 선분 <b>AH</b>가 점 A와 직선 BC 사이의 거리예요. A가 변 BC 밖으로 나가면 수선의 발 H는 <b>변을 늘인 직선</b> 위에 생겨요.',
    box: { x: [-2.6, 8.6], y: [-3, 6.8] },
    state: { sa: 2, ti: 0 },
    params: {
      b: { value: 5, min: 3, max: 6, step: 1, color: 'sky', label: '변 BC의 길이', format: (v) => `${Math.round(v)} cm` },
      h: { value: 4, min: 2, max: 6, step: 1, color: 'rose', label: '점 A와 직선 BC 사이의 거리 AH', format: (v) => `${Math.round(v)} cm` }
    },
    controls: ['b', 'h'],
    presets: [{ group: '점 A의 자리', label: '변 BC 위쪽', apply: (q) => { q.sa = 2; }, on: (q) => q.sa === 2 }, { label: '∠C = 90°', apply: (q) => { q.sa = q.b; }, on: (q) => q.sa === q.b }, { label: '∠B = 90°', apply: (q) => { q.sa = 0; }, on: (q) => q.sa === 0 }, { label: '변 밖 (둔각)', apply: (q) => { q.sa = -2; }, on: (q) => q.sa === -2 }],
    fit: [{ b: 5, h: 4, sa: 2, ti: 0 }, { b: 6, h: 6, sa: -2, ti: 0 }, { b: 3, h: 2, sa: 8, ti: 0 }, { b: 6, h: 4, sa: 2, ti: 2 }, { b: 6, h: 4, sa: 2, ti: 3 }],
    partOfStep: (st) => ['', 'ac', 'dist', 'ab'][st] || null,
    steps: (q) => {
      const [pb, ph, pab] = TRIPLES[q.ti];
      return [
        `점 A에서 직선 BC에 수선을 그어 수선의 발을 찾아요. ∠C = 90°이므로 AC ⊥ BC → 수선의 발은 점 C`,
        `점 A와 직선 BC 사이의 거리 = 수선 AC의 길이 = ${ph} cm`,
        `AB(= ${pab} cm)는 직각삼각형의 빗변이라 수선이 아니에요. 그래서 거리는 AB가 아니라 AC = ${ph} cm`
      ];
    },
    work: (q) => RICH(M('점 A와 직선 BC 사이의 거리 = A에서 직선 BC에 내린 수선 AH의 길이'), M('직각삼각형에서 직각을 낀 두 변은 서로 수선이에요')),
    view: (q, mode) => {
      const inside = q.sa >= 0 && q.sa <= q.b;
      return {
        status: stat('info', inside ? `H는 변 BC 위 · 거리 AH = ${q.h} cm` : `H는 BC의 연장선 위 · 거리 AH = ${q.h} cm`),
        readouts: [rd('점 A와 직선 BC 사이의 거리', q.h + ' cm', 'rose', 'AH의 길이', 'ah', true), rd('변 BC', q.b + ' cm', 'sky', '', 'bc'), rd('수선의 발 H', inside ? '변 BC 위' : '연장선 위', 'amber', q.sa === 0 || q.sa === q.b ? '꼭짓점과 겹쳐요(직각삼각형)' : '', 'h')],
        alert: { tone: 'key', text: '점 A의 높이를 그대로 두고 옆으로 움직여도 거리 AH는 변하지 않아요.' }
      };
    },
    draw: (g, q, mode, step) => {
      const rev = mode === 'review', prob = mode === 'problem';
      if (rev || prob) {
        const [pb, ph, pab] = TRIPLES[q.ti], B = [0, 0], C = [pb, 0], A = [pb, ph];
        g.box(-0.8, -1.8, 8.8, 8.6);
        g.poly([B, C, A], { color: 'sky', width: 4.5, fill: 'sky', fillAlpha: 0.1, ref: ['ac', 'dist', 'ab'] });
        if (rev && step >= 1) g.seg(C, A, { color: 'rose', width: 6, ref: ['ac', 'dist'] });
        if (rev && step >= 3) g.seg(B, A, { color: 'violet', width: 5, dash: [8, 6], ref: ['ab'] });
        g.right(C, B, A, { size: 15, color: 'amber', ref: ['ac'] });
        g.dot(A, { color: 'ink', r: 5.5 }); g.dot(B, { color: 'ink', r: 5.5 }); g.dot(C, { color: 'ink', r: 5.5 });
        g.text(A, 'A', { dy: -22, size: 20 }); g.text(B, 'B', { dx: -16, dy: 18, size: 20 }); g.text(C, 'C', { dx: 18, dy: 18, size: 20 });
        g.text([pb / 2, 0], `BC = ${pb} cm`, { dy: 46, size: 17, color: 'sky' });
        g.text([pb, ph / 2], `CA = ${ph} cm`, { dx: 12, align: 'left', size: 17, color: rev && step >= 1 ? 'rose' : 'sky', ref: ['ac', 'dist'] });
        g.text([pb / 2, ph / 2], `AB = ${pab} cm`, { dx: -14, dy: -18, size: 17, color: rev && step >= 3 ? 'violet' : 'sky', align: 'center', ref: ['ab'] });
        if (rev && step >= 1) g.text(C, '∠C = 90°', { dx: -62, dy: -22, size: 16, color: 'amber', ref: ['ac'] });
        if (rev && step >= 2) g.text([pb, 0], `거리 = AC = ${ph} cm`, { dy: 54, size: 17, color: 'green', ref: ['dist'] });
        return;
      }
      const b = q.b, h = q.h, s = clamp(q.sa, -2, b + 2), B = [0, 0], C = [b, 0], A = [s, h], H = [s, 0], inside = s >= 0 && s <= b;
      g.box(-2.6, -1.8, b + 2.6, h + 0.9);
      g.poly([B, C, A], { color: 'sky', width: 4.5, fill: 'sky', fillAlpha: 0.1 });
      if (!inside) g.seg(s < 0 ? H : C, s < 0 ? B : H, { color: 'sky', width: 3, dash: [8, 6], alpha: 0.85 });
      g.seg(A, H, { color: 'rose', width: 5.5, ref: ['ah'] });
      g.right(H, A, [s + 1, 0], { size: 15, color: 'amber', ref: ['ah', 'h'] });
      const wl = textW(`AH = ${h} cm`, 17);
      const onRight = s < 0 ? false : s > b ? true : (b - s) >= s; // 도형 안에서는 자리가 넓은 쪽, 변 밖이면 도형의 반대쪽에 글자를 둡니다
      const sideDx = s < 0 ? (wl / 2 + 12) : s > b ? -(wl / 2 + 12) : (onRight ? 1 : -1) * (wl / 2 + 12);
      g.text([s, h / 2], `AH = ${h} cm`, { dx: sideDx, size: 17, color: 'rose', ref: ['ah'] });
      g.dot(A, { color: 'ink', r: 5.5 }); g.dot(B, { color: 'ink', r: 5.5 }); g.dot(C, { color: 'ink', r: 5.5 }); g.dot(H, { color: 'amber', r: 5, ref: ['h'] });
      g.text(A, 'A', { dy: -24, size: 20 }); g.text(B, 'B', { dx: -16, dy: 18, size: 20 }); g.text(C, 'C', { dx: 18, dy: 18, size: 20 });
      const near = Math.min(Math.abs(s), Math.abs(s - b)) * g.k(1) < 40;
      if (!(s === 0 || s === b)) g.text(H, 'H', { dy: near ? 44 : 24, size: 18, color: 'amber', ref: ['h'] });
      else g.text(H, s === 0 ? 'H = B' : 'H = C', { dy: 40, size: 16, color: 'amber', ref: ['h'] });
      g.text([b / 2, 0], `BC = ${b} cm`, { dy: 62, size: 17, color: 'sky', ref: ['bc'] });
      g.handle('A', A, { color: 'amber', ariaLabel: '점 A (가로로 끌기)', drag: (w) => { q.sa = clamp(Math.round(w.x * 2) / 2, -2, q.b + 2); } });
    },
    problem: (q) => {
      const [pb, ph, pab] = TRIPLES[q.ti];
      const ch = [
        { v: pab, hint: 'AB는 직각삼각형의 빗변이에요. 수선이 아니라서 점과 직선 사이의 거리가 아니에요.' },
        { v: pb, hint: 'BC는 직선 BC 위에 있는 선분이에요. 점 A에서 내린 수선의 길이를 찾아야 해요.' },
        { v: pb * ph / 2, hint: '삼각형의 넓이예요. 거리는 수선 AC의 길이예요.' }, { v: pb + ph, hint: '두 변의 합이 아니라 수선 하나의 길이예요.' }
      ];
      return { key: `${q.ti}`, stem: `그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 AB = ${pab} cm, BC = ${pb} cm, CA = ${ph} cm이다. 점 A와 직선 BC 사이의 거리는?`, choices: mkNumChoices(ph, ch, (v) => v + ' cm', (v) => v > 0, 1), note: '직각 표시가 있는 선분을 찾으세요' };
    },
    reroll: (q) => { q.ti = (q.ti + 1 + (q.seed % 2)) % TRIPLES.length; }
  });

  /*__MORE__*/

  const GROUPS = [
    group(40, 'p4', '시계의 각', '시계의 각', [sClock, sChase]),
    group(50, 'p5', '맞꼭지각', '맞꼭지각', [sVert, sVeq, sThr]),
    group(60, 'p6', '수직과 수선', '수직과 수선', [sPerp, sBis, sTri])
  ];

  (window.APL_PL_GROUPS = window.APL_PL_GROUPS || []).push(...GROUPS);
})();
