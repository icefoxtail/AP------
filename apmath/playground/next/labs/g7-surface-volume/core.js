/* ==========================================================================
   중1 · 겉넓이와 부피 — 공용 도구 (core.js)
   - 탭 모듈(t1~t5.js)이 함께 쓰는 도구: 정확한 분수·π 수 계산(Val), 5지선다 만들기, 조각 줄(2D 타일), 장면 틀(makeScene).
   - 전역은 APL_SV(도구)와 APL_SV_GROUPS(탭 묶음) 둘뿐입니다.
   - 장면 하나 = 탐구(조절·돌려 보기·실시간 값) → 정리(교과서 풀이 순서, 단계마다 그림이 강조) → 문제(5지선다 + 숫자 바꾸기).
   - 색의 역할(이 실험실 전체): 하늘(sky) = 기준 입체·곡면 · 노랑(amber) = 지금 보는 것·구하는 것·손잡이 · 초록(green) = 결과·합 · 빨강(red) = 자른 면·함정.
   - 입체는 평행투영 · 가려진 모서리는 점선 · 이동은 가로로만, 접기·돌리기는 제자리 회전입니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = (window.APL_SV = window.APL_SV || {});
  const PI = Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const NUM = ['①', '②', '③', '④', '⑤'];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pick = (list, cur) => { const pool = list.filter((x) => x !== cur); return pool[Math.floor(Math.random() * pool.length)]; };
  const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const PAIR = { wa: ['과', '와'], eul: ['을', '를'], eun: ['은', '는'], i: ['이', '가'] };
  const hasBatchim = (w) => {
    const ch = String(w).trim().slice(-1), code = ch.charCodeAt(0) - 0xac00;
    if (code >= 0 && code <= 11171) return code % 28 !== 0;
    if (/[ㄱ-ㅎ]/.test(ch)) return true;
    return /[LMNRlmnr]/.test(ch);
  };
  const jo = (w, kind) => PAIR[kind][hasBatchim(w) ? 0 : 1];
  const fmtN = (v) => { const x = Math.round(v * 100) / 100; return (Number.isInteger(x) ? String(x) : String(x)).replace('-', '−'); };

  /* ------------------------------------------------------------------ 정확한 수: 분수 · (상수 + 분수×π) */
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const toFr = (x) => {
    for (let d = 1; d <= 240; d++) { const n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-7) return fr(n, d); }
    return fr(Math.round(x * 240), 240);
  };
  const fadd = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const fmul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
  // Val: { c: 상수, p: π의 계수 }  (둘 다 분수)
  const V = (c, p = 0) => ({ c: toFr(c), p: toFr(p) });
  const vadd = (a, b) => ({ c: fadd(a.c, b.c), p: fadd(a.p, b.p) });
  const vneg = (a) => ({ c: fr(-a.c[0], a.c[1]), p: fr(-a.p[0], a.p[1]) });
  const vsub = (a, b) => vadd(a, vneg(b));
  const vmul = (a, k) => { const f = typeof k === 'number' ? toFr(k) : k; return { c: fmul(a.c, f), p: fmul(a.p, f) }; };
  const veq = (a, b) => a.c[0] === b.c[0] && a.c[1] === b.c[1] && a.p[0] === b.p[0] && a.p[1] === b.p[1];
  const vnum = (a) => a.c[0] / a.c[1] + (a.p[0] / a.p[1]) * PI;
  const texFr = (f) => (f[1] === 1 ? String(f[0]) : (f[0] < 0 ? '-' : '') + `\\frac{${Math.abs(f[0])}}{${f[1]}}`);
  const texP = (f) => { // π 항 (부호 제외한 크기)
    const a = Math.abs(f[0]);
    if (f[1] === 1) return (a === 1 ? '' : String(a)) + '\\pi';
    return `\\frac{${a === 1 ? '' : a}\\pi}{${f[1]}}`.replace('{\\pi}', '{\\pi}');
  };
  function texVal(v) {
    const c = v.c, p = v.p;
    if (c[0] === 0 && p[0] === 0) return '0';
    if (p[0] === 0) return texFr(c);
    if (c[0] === 0) return (p[0] < 0 ? '-' : '') + texP(p);
    return texFr(c) + (p[0] < 0 ? '-' : '+') + texP(p);
  }
  const plainFr = (f) => (f[1] === 1 ? String(f[0]) : f[0] + '/' + f[1]);
  function plainVal(v) {
    const c = v.c, p = v.p;
    const pp = (f) => { const a = Math.abs(f[0]); return (f[1] === 1 ? (a === 1 ? '' : a) + 'π' : (a === 1 ? '' : a) + 'π/' + f[1]); };
    if (c[0] === 0 && p[0] === 0) return '0';
    if (p[0] === 0) return plainFr(c);
    if (c[0] === 0) return (p[0] < 0 ? '−' : '') + pp(p);
    return plainFr(c) + (p[0] < 0 ? '−' : '+') + pp(p);
  }
  // 곱 표기: 정수 a 와 b 의 곱 등을 TeX 로
  const tx = (v) => texVal(v);
  const nTex = (n) => String(Math.round(n * 100) / 100).replace('-', '\\text{−}');
  const UNIT = { 1: 'cm', 2: 'cm²', 3: 'cm³' };
  const UNITTEX = { 1: '\\mathrm{cm}', 2: '\\mathrm{cm}^2', 3: '\\mathrm{cm}^3' };

  /* ------------------------------------------------------------------ 5지선다 만들기 */
  // correct: Val, wrongs: [[Val, 힌트]…], o.dim: 1|2|3(단위 차원) · o.fill(정답 근처에서 채울 값 만들기)
  function mkV(correct, wrongs, o = {}) {
    const dim = o.dim || 2;
    const list = [{ v: correct, ok: true, hint: '' }];
    const okV = (v) => vnum(v) > 1e-9 && !list.some((x) => veq(x.v, v));
    for (const w of wrongs) {
      if (!w || !w[0] || !okV(w[0])) continue;
      list.push({ v: w[0], ok: false, hint: w[1] || '' });
      if (list.length === 5) break;
    }
    // 모자라면 정답 근처의 값으로 채웁니다(π 계수 또는 상수를 조금 바꿈)
    for (let k = 1; list.length < 5 && k < 60; k++) {
      for (const sg of [1, -1]) {
        if (list.length >= 5) break;
        const cand = correct.p[0] !== 0 ? vadd(correct, { c: fr(0), p: fr(sg * k) }) : vadd(correct, { c: fr(sg * k), p: fr(0) });
        if (okV(cand)) list.push({ v: cand, ok: false, hint: '풀이 순서대로 다시 계산해 보세요.' });
      }
    }
    list.sort((a, b) => vnum(a.v) - vnum(b.v));
    const out = list.map((x) => ({ h: `$${texVal(x.v)}\\,${UNITTEX[dim]}$`, p: plainVal(x.v) + UNIT[dim], ok: x.ok, hint: x.hint, val: x.v }));
    out._ans = correct;
    return out;
  }
  // 정수 개수·단순 숫자 보기
  function mkN(correct, wrongs, o = {}) {
    const unit = o.unit == null ? '' : o.unit;
    return mkV(V(correct), wrongs.map((w) => [V(w[0]), w[1]]), { dim: 0, ...o }).map((c) => c);
  }
  UNITTEX[0] = ''; UNIT[0] = '';
  // 글 보기: items [{h, ok, hint}] 순서 그대로
  const mkText = (items) => items.map((x) => ({ h: x.h, p: x.p || x.h, ok: !!x.ok, hint: x.hint || '' }));

  /* ------------------------------------------------------------------ 조각 줄 (2D 타일) */
  /* tile: { w, h, shape:'rect'|'circle'|'hole'|'sector'|'poly', fill, alpha, label, cap, count, hl, deg, pts, x(덮어쓰기: 왼쪽 위치), edge }
     layoutTiles → 크기·위치를 정해 줍니다(세계 좌표). 그림은 drawTiles 가 그립니다. */
  function layoutTiles(tiles, W, Hmax, gap = 0.45, o = {}) {
    const sumW = tiles.reduce((s, t) => s + t.w, 0) + gap * 0 + (tiles.length - 1) * (gap / (o.unitScale || 1));
    const maxH = Math.max(...tiles.map((t) => t.h));
    // 타일 내부 크기 단위 → 세계 단위 배율
    let k = Math.min(W / (sumW), Hmax / maxH);
    if (o.maxK) k = Math.min(k, o.maxK);
    const gapW = gap / (o.unitScale || 1);
    const total = tiles.reduce((s, t) => s + t.w * k, 0) + (tiles.length - 1) * gapW * k;
    let x = -total / 2;
    const out = tiles.map((t) => {
      const q = Object.assign({}, t, { k, sw: t.w * k, sh: t.h * k, x });
      x += q.sw + gapW * k;
      return q;
    });
    return { tiles: out, k, total, height: maxH * k };
  }
  // 여러 줄(휴대폰용): 줄마다 타일 목록, 모든 줄이 같은 배율을 씁니다
  function layoutTileRows(rows, W, Hmax, gap = 0.5, rowGap = 1.3) {
    const ks = rows.map((r) => layoutTiles(r, W, Hmax, gap).k), k = Math.min(...ks);
    const Ls = rows.map((r) => layoutTiles(r, W, Hmax, gap, { maxK: k }));
    let h = 0; Ls.forEach((L, i) => { L.offset = h; h += L.height + (i < Ls.length - 1 ? rowGap : 0); });
    return { rows: Ls, height: h, total: Math.max(...Ls.map((L) => L.total)) };
  }
  function drawTileRows(D, R, cx, top) { R.rows.forEach((L) => drawTiles(D, L, cx, top + L.offset)); }
  // 타일을 (cx, topY) 기준 줄로 그립니다. 반환: 글자 상자 배열(세계 좌표 점들)
  function drawTiles(D, L, cx, top, op = {}) {
    const { b } = D;
    const base = top + L.height; // 아래 정렬
    L.tiles.forEach((t) => {
      const x0 = cx + t.x, y1 = base, y0 = base - t.sh, sw = t.sw;
      const hl = t.hl == null ? 1 : t.hl;
      const alpha = (t.alpha == null ? 0.3 : t.alpha) * (hl === 0 ? 0.35 : hl === 2 ? 1.35 : 1);
      const ecol = t.edge || t.fill || 'sky';
      const ew = hl === 2 ? 3.4 : hl === 0 ? 1.3 : 2.4;
      const ea = hl === 0 ? 0.45 : 1;
      const n = t.count || 1;
      for (let c = n - 1; c >= 0; c--) {
        const ox = c * 0.09 * Math.min(1, t.k * 2), oy = -c * 0.09 * Math.min(1, t.k * 2);
        const X0 = x0 + ox, Y0 = y0 + oy;
        const a = c === 0 ? alpha : alpha * 0.7;
        const shape = t.shape || 'rect';
        if (shape === 'rect') {
          b.path([{ x: X0, y: Y0 }, { x: X0 + sw, y: Y0 }, { x: X0 + sw, y: Y0 + t.sh }, { x: X0, y: Y0 + t.sh }], { close: true, fill: t.fill, fillAlpha: a, color: ecol, width: ew, alpha: ea });
        } else if (shape === 'circle') {
          b.circle({ x: X0 + sw / 2, y: Y0 + t.sh / 2 }, Math.min(sw, t.sh) / 2, { fill: t.fill, fillAlpha: a, color: ecol, width: ew, alpha: ea });
        } else if (shape === 'hole') {
          const c0 = b.ctx;
          const s0 = b.toS({ x: X0, y: Y0 }), s1 = b.toS({ x: X0 + sw, y: Y0 + t.sh }), cs = b.toS({ x: X0 + sw / 2, y: Y0 + t.sh / 2 });
          const rr = (Math.min(sw, t.sh) * (t.holeR == null ? 0.3 : t.holeR)) * b.k;
          c0.save(); c0.beginPath(); c0.rect(s0.x, s0.y, s1.x - s0.x, s1.y - s0.y); c0.moveTo(cs.x + rr, cs.y); c0.arc(cs.x, cs.y, rr, 0, Math.PI * 2, true);
          c0.fillStyle = b.color(t.fill, a); c0.fill('evenodd'); c0.restore();
          b.path([{ x: X0, y: Y0 }, { x: X0 + sw, y: Y0 }, { x: X0 + sw, y: Y0 + t.sh }, { x: X0, y: Y0 + t.sh }], { close: true, color: ecol, width: ew, alpha: ea });
          b.circle({ x: X0 + sw / 2, y: Y0 + t.sh / 2 }, rr / b.k, { color: ecol, width: ew, alpha: ea, dash: undefined });
        } else if (shape === 'sector') {
          const R = Math.min(sw, t.sh * (t.deg > 180 ? 1 : 1)) / (t.deg > 180 ? 2 : 1);
          const pts = [], deg = t.deg, cxm = X0 + sw / 2, cym = Y0 + t.sh / 2;
          const rad = Math.min(sw, t.sh) / 2;
          const a0 = -Math.PI / 2 - (deg * Math.PI) / 360;
          pts.push({ x: cxm, y: cym });
          for (let i = 0; i <= 40; i++) { const a = a0 + (deg * Math.PI / 180) * i / 40; pts.push({ x: cxm + rad * Math.cos(a), y: cym + rad * Math.sin(a) }); }
          void R;
          b.path(pts, { close: true, fill: t.fill, fillAlpha: a, color: ecol, width: ew, alpha: ea });
        } else if (shape === 'poly') {
          b.path(t.pts.map((p) => ({ x: X0 + p[0] * sw, y: Y0 + p[1] * t.sh })), { close: true, fill: t.fill, fillAlpha: a, color: ecol, width: ew, alpha: ea });
        }
      }
      // 글자
      const size = D.fs(t.size || 15), eff = size * b.fs * b._ts();
      const sPx = sw * b.k;
      if (t.label) {
        const lw = G.textW(t.label, eff) + 6;
        if (lw <= sPx && t.sh * b.k >= eff * 1.4) b.text({ x: x0 + sw / 2, y: y0 + t.sh / 2 }, t.label, { color: t.tcolor || 'ink', size, weight: 800, align: 'center', baseline: 'middle' });
        else b.text({ x: x0 + sw / 2, y: y1 }, t.label, { dy: eff * 0.95, color: t.tcolor || 'ink', size, weight: 800, align: 'center', baseline: 'middle' });
      }
      if (t.cap) {
        const lw = G.textW(t.label || '', eff) + 6;
        const below = t.label && !(lw <= sPx && t.sh * b.k >= eff * 1.4);
        b.text({ x: x0 + sw / 2, y: y1 }, t.cap, { dy: eff * (below ? 2.15 : 0.95), color: t.ccolor || 'muted', size: D.fs(t.csize || 13), weight: 750, align: 'center', baseline: 'middle' });
      }
      if (n > 1) b.text({ x: x0 + sw, y: y0 }, '×' + n, { dx: 4, dy: -4 + -n * 1.5, color: 'amber', size: D.fs(14), weight: 800, align: 'right', baseline: 'bottom' });
    });
  }

  /* ------------------------------------------------------------------ 단계 강조 / 상태 */
  function baseCtx(s, lab, thumb) {
    const tab = thumb ? 'explore' : (lab && lab.tab) || 'explore';
    const problem = !thumb && tab === 'problem';
    const review = !thumb && tab === 'review';
    const step = review ? s.step || 0 : 99;
    // hl(k): 단계 k 의 대상을 얼마나 강조할지 — 0 흐리게 · 1 보통 · 2 강하게
    const hl = (k) => (!review ? 1 : step === k ? 2 : step > k ? 1 : 0);
    return { tab, problem, review, step, hl, txt: !thumb, thumb: !!thumb, full: tab === 'explore' || thumb };
  }

  /* ------------------------------------------------------------------ 조절 값 */
  const P = (label, min, max, step, value, o = {}) => ({ value, min, max, step, color: o.color || 'sky', label, hint: o.hint, format: o.format || ((v) => fmtN(v)) });
  const cm = (v) => fmtN(v) + 'cm';

  /* ------------------------------------------------------------------ 문제 탭 */
  function problemHTML(D, s) {
    const M = D.model(s), Q = D.prob(M, s);
    const key = D.id + '|' + Q.key + '|' + (s.svSeed || 0);
    const pk = s.svPick && s.svPick.key === key ? s.svPick : null;
    let h = `<div class="sv-q">${esc(Q.stem).replace(/&amp;/g, '&')}</div>`;
    h += `<div class="sv-choices${Q.wide ? ' wide' : ''}">`;
    Q.choices.forEach((o, i) => {
      const cls = pk && pk.idx === i ? (o.ok ? ' ok' : ' bad') : '';
      h += `<button type="button" class="sv-ch${cls}" data-sv-pick="${i}" aria-label="${NUM[i]} ${esc(o.p)}"><span class="n">${NUM[i]}</span><span class="v">${o.h}</span></button>`;
    });
    h += '</div>';
    if (pk) {
      const o = Q.choices[pk.idx];
      h += o.ok ? '<div class="sv-fb ok"><b>정답이에요!</b> 정리 탭에서 풀이 과정을 확인해 보세요.</div>' : `<div class="sv-fb bad"><b>다시 생각해 볼까요?</b> ${esc(o.hint || '풀이 순서대로 다시 생각해 보세요.')}</div>`;
    }
    h += `<div class="sv-tools"><button type="button" class="apl-btn sm" data-sv-new>숫자 바꾸기</button>${Q.note ? `<span class="sv-note">${esc(Q.note)}</span>` : ''}</div>`;
    return h;
  }
  function answerText(D, s) {
    const Q = D.prob(D.model(s), s), i = Q.choices.findIndex((o) => o.ok);
    return `${NUM[i]} ${Q.choices[i].h}`;
  }
  let curLab = null;
  function installClicks() {
    const root = document.documentElement;
    if (root.dataset.svBound) return;
    root.dataset.svBound = '1';
    document.addEventListener('click', (ev) => {
      const lab = curLab || window.lab;
      if (!lab || !ev.target || !ev.target.closest) return;
      const hit = ev.target.closest('[data-sv-pick],[data-sv-new]');
      if (!hit) return;
      const sc = lab.scene;
      if (!sc || !sc.sv) return;
      const D = sc.sv, s = lab.s;
      if (hit.hasAttribute('data-sv-new')) {
        D.reroll(s);
        s.svSeed = (s.svSeed || 0) + 1; s.svPick = null; s.revealed = false; s.playing = false;
        lab.setStep(1);
        try { lab._buildReview(); } catch (e) { /* 키트가 바뀌어도 그림은 그대로 */ }
        lab.invalidate(true);
        return;
      }
      const idx = parseInt(hit.getAttribute('data-sv-pick'), 10);
      const Q = D.prob(D.model(s), s);
      s.svPick = { key: D.id + '|' + Q.key + '|' + (s.svSeed || 0), idx };
      if (Q.choices[idx] && Q.choices[idx].ok) s.revealed = true;
      lab.invalidate(true);
    });
  }
  function installStyle() {
    if (document.getElementById('sv-css')) return;
    const st = document.createElement('style');
    st.id = 'sv-css';
    st.textContent = `
.sv-q{font-size:var(--fs-md);line-height:1.85}
.sv-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:12px 0 4px}
.sv-choices.wide{grid-template-columns:1fr}
.sv-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left;line-height:1.5}
.sv-ch:hover{background:var(--hover)}
.sv-ch .n{color:var(--m-amber);flex:none}
.sv-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.sv-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.sv-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.sv-fb.ok{border-left-color:var(--m-green)}
.sv-fb.bad{border-left-color:var(--m-red)}
.sv-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.sv-note{font-size:var(--fs-xs);color:var(--text-3)}
.sv-notes{margin:0;padding-left:18px;display:grid;gap:4px}`;
    document.head.append(st);
  }
  installStyle();
  installClicks();

  /* ------------------------------------------------------------------ 장면 틀
     D = { id, title, short, question, ctl, presets?, init(s), reroll(s), model(s)→M, draw(b,s,M,C), steps(M)→[글…], view(M,C,s)→{guide,readouts,formula,rule,notes,alert},
           prob(M,s)→{tag,stem,choices,key,note?}, anim?:{key,dur,label,start}, stepT?(n), cam0?:{yaw,pitch}, spin?:false } */
  const VIEWS = [['기본', 28, 22], ['앞에서', 0, 0], ['옆에서', 90, 0], ['위에서', 0, 80]];
  function makeScene(D) {
    const A = D.anim;
    const actions = () => {
      const out = [];
      if (A) {
        out.push({
          id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'),
          label: (s) => (s.playing ? '일시 정지' : s[A.key] >= 0.999 ? '다시 재생' : A.label || '움직여 보기'),
          on: (s) => s.playing,
          run: (s) => { if (s.playing) s.playing = false; else { if (s[A.key] >= 0.999) s[A.key] = 0; s.playing = true; } }
        });
        out.push({ id: 'reset', icon: 'reset', label: '처음으로', run: (s) => { s.playing = false; s[A.key] = 0; } });
      }
      return out.length ? out : undefined;
    };
    return {
      id: D.id, title: D.title, short: D.short || D.title, sv: D,
      question: D.question,
      controls: (s) => (typeof D.ctl === 'function' ? D.ctl(s) : D.ctl),
      presets: (s) => {
        const list = D.presets ? D.presets(s) : [];
        if (D.view3 === false) return list;
        const c0 = D.cam0 || { yaw: 28, pitch: 22 };
        const vl = [['기본', c0.yaw, c0.pitch]].concat(VIEWS.slice(1));
        return list.concat(vl.map((v, i) => ({ group: i === 0 ? '시점' : '', label: v[0], apply: (st) => { st.svYaw = v[1]; st.svPitch = v[2]; }, on: (st) => Math.abs((st.svYaw == null ? c0.yaw : st.svYaw) - v[1]) < 1.5 && Math.abs((st.svPitch == null ? c0.pitch : st.svPitch) - v[2]) < 1.5 })));
      },
      actions,
      steps: (s) => D.steps(D.model(s)).map((t) => String(t).replace(/<\/?b>/g, '')),
      notesTitle: '자주 틀리는 부분',
      problem: {
        tag: (s) => D.prob(D.model(s), s).tag,
        text: (s) => problemHTML(D, s),
        answer: (s) => answerText(D, s)
      },
      enter: (s, lab) => {
        const c0 = D.cam0 || { yaw: 28, pitch: 22 };
        s.svYaw = c0.yaw; s.svPitch = c0.pitch;
        D.init(s);
        s.svSeed = 0; s.svPick = null; s.playing = false;
        if (A) s[A.key] = A.start || 0;
        if (lab) { curLab = lab; lab._svOwner = D.id; lab._svSig = null; }
      },
      tick: (s, dt, lab) => {
        let again = false;
        if (A && s.playing) {
          s[A.key] = Math.min(1, (s[A.key] || 0) + dt / (A.dur || 6));
          if (s[A.key] >= 1) s.playing = false;
          again = true;
        } else if (A && D.stepT && lab && lab.tab === 'review' && !s.dragging) {
          const tg = D.stepT(s.step || 0), d = tg - s[A.key];
          if (Math.abs(d) > 8e-4) { s[A.key] += clamp(d, -0.9 * dt, 0.9 * dt); again = true; }
        }
        return again;
      },
      view: (s, lab) => {
        if (lab) curLab = lab;
        const C = baseCtx(s, lab, false);
        const M = D.model(s);
        const v = D.view(M, C, s) || {};
        // 조절 막대로 값이 바뀌면 정리 탭의 풀이 글도 그 값으로 다시 만듭니다
        if (lab && lab._svOwner === D.id && typeof lab._buildReview === 'function') {
          const sig = JSON.stringify(D.steps(M));
          if (lab._svSig !== sig) { const first = lab._svSig == null; lab._svSig = sig; if (!first) { try { lab._buildReview(); lab._dirtyPanel = true; } catch (e) { /* 키트가 바뀌어도 그림은 그대로 */ } } }
        }
        if (C.tab === 'problem') v.status = { tone: 'info', text: '그림을 보고 풀어 보세요' };
        else if (C.tab === 'review') { const n = D.steps(M).length; v.status = { tone: s.step >= n ? 'ok' : 'info', text: `풀이 ${Math.min(s.step || 1, n)} / ${n}단계` }; }
        return v;
      },
      draw: (b, s, v, lab) => {
        const C = baseCtx(s, lab, !!b.thumb);
        const M = D.model(s);
        C.t = A ? (C.tab === 'explore' || b.thumb ? (s[A.key] == null ? 0 : s[A.key]) : (D.stepT && C.tab === 'review' ? (s[A.key] || 0) : (D.problemT == null ? 1 : D.problemT))) : 1;
        if (b.thumb && A && D.thumbT != null) C.t = D.thumbT;
        D.draw(b, s, M, C);
      }
    };
  }

  function register(order, id, title, short, params, scenes) {
    (window.APL_SV_GROUPS = window.APL_SV_GROUPS || []).push({ order, id, title, short, params: Object.assign({}, params), scenes: scenes.map(makeScene) });
  }
  const notes = (...li) => `<ul class="sv-notes">${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  const rd = (label, value, color, note, ref, wide) => ({ label, value, color, note, ref, wide });
  const span = (c, t) => `<b style="color:var(--m-${c})">${t}</b>`;

  Object.assign(G, {
    clamp, NUM, esc, pick, rint, shuffle, jo, fmtN, gcd, fr, toFr, V, vadd, vneg, vsub, vmul, veq, vnum, texVal, texFr, plainVal, tx, nTex, UNIT, UNITTEX,
    mkV, mkN, mkText, layoutTiles, layoutTileRows, drawTileRows, drawTiles, baseCtx, P, cm, makeScene, register, notes, rd, span
  });
})();
