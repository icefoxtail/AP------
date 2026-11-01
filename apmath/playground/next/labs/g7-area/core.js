/* ==========================================================================
   중1 · 다각형의 넓이(초등 복습) — 공용 도구 (core.js)
   - 세 탭 모듈(t1~t3.js)이 함께 쓰는 작은 도구 모음입니다. 전역은 APL_AR(도구)와 APL_AR_GROUPS(탭 묶음) 둘뿐입니다.
   - 장면 하나 = 탐구(조절·움직임·실시간 값) → 정리(단계마다 그림이 강조) → 문제(5지선다 + 숫자 바꾸기).
   - 색의 역할(이 실험실 전체): 하늘 = 처음 도형 · 노랑 = 높이(점선)·끌 수 있는 점 · 초록 = 옮기거나 붙인 조각·완성한 도형 · 분홍 = 함정(높이가 아닌 옆변)·바깥 조각 · 기본 = 도형의 변.
   - 같은 길이는 눈금, 직각은 네모, 평행선은 화살표. 길이는 그림 안에 크게 씁니다.
   - 움직임은 가로(왼쪽 → 오른쪽) 이동 또는 제자리 회전만 씁니다. 세로 이동은 없습니다.
   - 도형 좌표계: figure (y 아래쪽, 단위 = 1cm). 밑변은 y=0, 위쪽은 y<0 입니다.
   ========================================================================== */
(function () {
  'use strict';
  const PI = Math.PI, DEG = PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const seg01 = (t, a, b) => ease((t - a) / (b - a));
  const NUM = ['①', '②', '③', '④', '⑤'];
  const LET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ------------------------------------------------------------------ 숫자 서식 */
  const r1 = (v) => Math.round(v * 10) / 10;
  const isInt = (v) => Math.abs(v - Math.round(v)) < 1e-9;
  const fmtN = (v) => { const x = r1(v); return (Number.isInteger(x) ? String(x) : x.toFixed(1)).replace('-', '−'); };
  const dg = (v) => fmtN(v) + '°';
  const eqs = (v) => (isInt(v * 10) ? '=' : '≈'); // 소수 첫째 자리에서 딱 떨어지지 않으면 ≈
  const tx = (v) => fmtN(v).replace('−', '-');
  const texDeg = (v) => tx(v) + '^{\\circ}';

  /* ------------------------------------------------------------------ 기하 (figure: y 아래쪽) */
  const pt = (x, y) => ({ x, y });
  const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
  const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
  const mul = (a, k) => ({ x: a.x * k, y: a.y * k });
  const len = (a) => Math.hypot(a.x, a.y);
  const unit = (a) => { const l = len(a) || 1; return { x: a.x / l, y: a.y / l }; };
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const lerp = (a, b, f) => ({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f });
  const polar = (c, r, deg) => ({ x: c.x + r * Math.cos(deg * DEG), y: c.y + r * Math.sin(deg * DEG) });
  const dirDeg = (a, b) => Math.atan2(b.y - a.y, b.x - a.x) / DEG; // a→b 화면 각도(도)
  const angBetween = (V, A, B) => { // ∠AVB (0~180°)
    const u = sub(A, V), w = sub(B, V);
    return Math.acos(clamp((u.x * w.x + u.y * w.y) / (len(u) * len(w) || 1), -1, 1)) / DEG;
  };
  const cross = (a, b) => a.x * b.y - a.y * b.x;
  // 직선 PQ 와 직선 RS 의 교점
  function inter(P, Q, R, S) {
    const d1 = sub(Q, P), d2 = sub(S, R), den = cross(d1, d2);
    if (Math.abs(den) < 1e-12) return null;
    const t = cross(sub(R, P), d2) / den;
    return { x: P.x + d1.x * t, y: P.y + d1.y * t };
  }
  // 정다각형 꼭짓점: 중심 c, 반지름 R, 첫 꼭짓점 각도 rot(도)
  const regPoly = (n, R, rot = -90, c = pt(0, 0)) => Array.from({ length: n }, (_, i) => polar(c, R, rot + (360 * i) / n));
  // 바닥 변이 가로인 정다각형(홀수 각은 꼭대기 꼭짓점이 A, 짝수 각은 꼭대기 변의 왼쪽 끝이 A), 시계 방향
  const regUp = (n, R = 1, c = pt(0, 0)) => regPoly(n, R, n % 2 ? -90 : -90 - 180 / n, c);
  const polyArea = (P) => P.reduce((a, p, i) => a + cross(p, P[(i + 1) % P.length]), 0) / 2;
  const centroid = (P) => ({ x: P.reduce((a, p) => a + p.x, 0) / P.length, y: P.reduce((a, p) => a + p.y, 0) / P.length });
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const pick = (list, cur) => { const pool = list.filter((x) => x !== cur); return pool[Math.floor(Math.random() * pool.length)]; };
  const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const bboxOf = (pts, pad = 0) => {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach((p) => { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); });
    return { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
  };
  const unionBox = (a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) });

  /* ------------------------------------------------------------------ 그리기 도우미 */
  const textW = (t, size) => { let w = 0; for (const ch of String(t)) { const c = ch.charCodeAt(0); w += c >= 0x1100 ? size * 1.0 : ch === ' ' ? size * 0.32 : size * 0.62; } return w; };
  // 글자: 점 p 에서 화면 픽셀 (dx,dy) 만큼 옮겨 놓습니다.
  function T(b, p, str, o = {}) {
    if (str == null || str === '') return;
    b.text(p, str, { dx: o.dx || 0, dy: o.dy || 0, color: o.color || 'ink', size: o.size || 16, weight: 800, align: o.align || 'center', baseline: 'middle', alpha: o.alpha, ref: o.ref });
  }
  // 꼭짓점 이름 등: 점 p 에서 중심 c 의 반대쪽(바깥)으로 gap 픽셀 비켜 놓은 글자
  function tagOut(b, p, c, str, o = {}) {
    const u = unit(sub(p, c)), size = o.size || 17, w = textW(str, size), g = o.gap == null ? 12 : o.gap;
    const d = Math.abs(u.x) * (w / 2) + Math.abs(u.y) * size * 0.55 + g;
    T(b, p, str, { ...o, size, dx: u.x * d, dy: u.y * d });
  }
  // 점(검은 점) + 바깥 이름
  function vtx(b, p, c, name, o = {}) {
    b.point(p, { color: o.color || 'ink', r: o.r || 4.5 });
    if (name) tagOut(b, p, c, name, { size: o.size || 17, gap: o.gap == null ? 11 : o.gap, color: o.nameColor || 'ink' });
  }
  /* 각 표시: 꼭짓점 V 에서 반직선 VA → VB 방향의 작은 각(big=true 이면 큰 각). rings = 호 개수(같은 각은 같은 개수).
     직각이면 네모. label 은 이등분선 방향에 놓습니다. 반지름 r 은 화면 픽셀입니다. */
  function ang(b, V, A, B, o = {}) {
    const k = b.k || 60, r = (o.r || 26) * (b.thumb ? 0.7 : 1);
    const a0 = Math.atan2(A.y - V.y, A.x - V.x), a1 = Math.atan2(B.y - V.y, B.x - V.x);
    let d = ((a1 - a0 + PI * 3) % (PI * 2)) - PI; // (-π, π]
    if (o.big) d = d > 0 ? d - PI * 2 : d + PI * 2;
    const deg = Math.abs(d) / DEG, col = o.color || 'sky', am = a0 + d / 2;
    const rw = r / k;
    if (!o.noMark) {
      if (!o.big && Math.abs(deg - 90) < 0.6 && !o.noRight) {
        b.right(V, A, B, { size: Math.min(r * 0.62, 17), color: col });
      } else {
        b.arc(V, rw, a0, a0 + d, { sector: true, fill: col, fillAlpha: o.fa == null ? 0.2 : o.fa, color: null, ccw: d < 0, ref: o.ref });
        const rings = o.rings || 0;
        b.arc(V, rw, a0, a0 + d, { color: col, width: 2.4, ccw: d < 0, ref: o.ref });
        for (let i = 1; i < rings; i++) b.arc(V, rw - (i * 4.6) / k, a0, a0 + d, { color: col, width: 2.2, ccw: d < 0, ref: o.ref });
      }
    }
    if (o.label) {
      const size = o.size || 15;
      const need = (textW(o.label, size) / 2 + 5) / Math.max(0.2, Math.sin(clamp(Math.abs(d) / 2, 0.12, 1.5)));
      const dist = o.labelDist != null ? o.labelDist : Math.max(r + 14, Math.min(need, r + 70));
      const la = am + (o.labelRot || 0) * DEG;
      T(b, V, o.label, { dx: Math.cos(la) * dist, dy: Math.sin(la) * dist, color: o.labelColor || col, size, alpha: o.alpha });
    }
    return { deg, mid: am };
  }
  // 같은 길이 눈금
  function tick(b, p, q, count = 1, color = 'amber') { b.ticks(p, q, { color, count, size: 7 }); }
  // 평행 표시(화살표 ›): 선분 pq 의 가운데에 count 개
  function par(b, p, q, count = 1, color = 'green', f = 0.5) {
    const k = b.k || 60, u = unit(sub(q, p)), n = { x: -u.y, y: u.x }, m = lerp(p, q, f), s = 8 / k;
    for (let i = 0; i < count; i++) {
      const c = add(m, mul(u, (i - (count - 1) / 2) * 7 / k));
      b.path([add(sub(c, mul(u, s)), mul(n, s)), c, sub(sub(c, mul(u, s)), mul(n, s))], { color, width: 2.4 });
    }
  }
  const fillPoly = (b, pts, color, alpha = 0.18, o = {}) => b.path(pts, { close: true, fill: color, fillAlpha: alpha, color: null, ref: o.ref });
  const line = (b, p, q, color = 'ink', width = 3, o = {}) => b.path([p, q], { color, width, dash: o.dash, alpha: o.alpha, ref: o.ref });
  const poly = (b, pts, color = 'ink', width = 3.2, o = {}) => b.path(pts, { close: true, color, width, dash: o.dash, alpha: o.alpha, ref: o.ref, fill: o.fill, fillAlpha: o.fillAlpha });

  // 그림 상자(box)를 무대에 꼭 맞춥니다. 라벨이 상자 밖으로 나갈 자리는 화면 픽셀(pad)로 따로 줍니다.
  function fit(b, box, o = {}) {
    const narrow = b.W < 560;
    const aw = Math.max(10, b.W - b.insets.left - b.insets.right), ah = Math.max(10, b.H - b.insets.top - b.insets.bottom);
    const pp = b.pad * Math.min(aw, ah), W = aw - 2 * pp, H = ah - 2 * pp;
    const base = b.thumb ? 5 : narrow ? 30 : 46;
    const pad = { l: o.l == null ? base : o.l, r: o.r == null ? base : o.r, t: o.t == null ? base : o.t, b: o.b == null ? base : o.b };
    let bw = Math.max(1e-6, box.x1 - box.x0), bh = Math.max(1e-6, box.y1 - box.y0);
    let k = Math.max(3, Math.min((W - pad.l - pad.r) / bw, (H - pad.t - pad.b) / bh));
    if (o.maxK) k = Math.min(k, o.maxK);
    b.focus = { x: [box.x0 - pad.l / k, box.x1 + pad.r / k], y: [box.y0 - pad.t / k, box.y1 + pad.b / k] };
    return b.k;
  }

  /* ------------------------------------------------------------------ 조절 값 만들기 */
  const P = (label, min, max, step, value, o = {}) => ({ value, min, max, step, color: o.color || 'sky', label, hint: o.hint, format: o.format || ((v) => fmtN(v)) });
  const degF = (v) => fmtN(v) + '°';

  /* ------------------------------------------------------------------ 5지선다 만들기 */
  // correct: 정답 값, wrongs: [[값, 힌트], …] (자주 하는 실수 순). 모자라면 정답 ± 간격으로 채웁니다. 작은 값부터 놓습니다.
  function mkChoices(correct, wrongs, o = {}) {
    const tex = o.tex || ((v) => texDeg(v)), plain = o.plain || ((v) => dg(v)), valid = o.valid || ((v) => v > 0);
    const same = (a, b) => Math.abs(a - b) < 1e-6;
    const list = [{ v: correct, ok: true, hint: '' }];
    for (const w of wrongs) {
      const v = w[0];
      if (!Number.isFinite(v) || !valid(v) || list.some((x) => same(x.v, v))) continue;
      list.push({ v, ok: false, hint: w[1] || '' });
      if (list.length === 5) break;
    }
    const gap = o.pad || 10;
    for (let k = 1; list.length < 5 && k < 40; k++) {
      for (const sg of [1, -1]) {
        const v = correct + sg * gap * k;
        if (list.length < 5 && valid(v) && !list.some((x) => same(x.v, v))) list.push({ v, ok: false, hint: '풀이 순서대로 다시 계산해 보세요.' });
      }
    }
    list.sort((a, b) => a.v - b.v);
    return list.map((x) => ({ t: tex(x.v), p: plain(x.v), ok: x.ok, hint: x.hint, v: x.v }));
  }

  /* ------------------------------------------------------------------ 장면 상태 (탭·단계) */
  function baseCtx(s, lab, thumb) {
    const tab = thumb ? 'explore' : (lab && lab.tab) || 'explore';
    const problem = !thumb && tab === 'problem';
    const review = !thumb && tab === 'review';
    return { tab, problem, review, step: review ? s.step || 0 : 99, txt: !thumb, thumb: !!thumb, full: tab === 'explore' || thumb };
  }
  // 풀이 단계 n 이상이면(정리 탭) 또는 탐구 탭이면 true
  const showAt = (C, n) => C.step >= n;

  /* ------------------------------------------------------------------ 문제 탭 (보기 5개 · 숫자 바꾸기) */
  function problemHTML(D, s) {
    const M = D.model(s), Q = D.prob(M, s);
    const key = D.id + '|' + Q.key + '|' + (s.arSeed || 0);
    const pk = s.arPick && s.arPick.key === key ? s.arPick : null;
    let h = `<div class="ar-q">${esc(Q.stem).replace(/&amp;/g, '&')}</div>`;
    h += '<div class="ar-choices">';
    Q.choices.forEach((o, i) => {
      const cls = pk && pk.idx === i ? (o.ok ? ' ok' : ' bad') : '';
      h += `<button type="button" class="ar-ch${cls}" data-ar-pick="${i}" aria-label="${NUM[i]} ${esc(o.p)}"><span class="n">${NUM[i]}</span><span class="v">$${o.t}$</span></button>`;
    });
    h += '</div>';
    if (pk) {
      const o = Q.choices[pk.idx];
      h += o.ok ? '<div class="ar-fb ok"><b>정답이에요!</b> 정리 탭에서 풀이 과정을 확인해 보세요.</div>' : `<div class="ar-fb bad"><b>다시 생각해 볼까요?</b> ${esc(o.hint || '풀이 순서대로 다시 계산해 보세요.')}</div>`;
    }
    h += `<div class="ar-tools"><button type="button" class="apl-btn sm" data-ar-new>숫자 바꾸기</button>${Q.note ? `<span class="ar-note">${esc(Q.note)}</span>` : ''}</div>`;
    return h;
  }
  function answerText(D, s) {
    const Q = D.prob(D.model(s), s), i = Q.choices.findIndex((o) => o.ok);
    return `${NUM[i]} $${Q.choices[i].t}$`;
  }

  let curLab = null;
  function installClicks() {
    const root = document.documentElement;
    if (root.dataset.arBound) return;
    root.dataset.arBound = '1';
    document.addEventListener('click', (ev) => {
      const lab = curLab || window.lab;
      if (!lab || !ev.target || !ev.target.closest) return;
      const hit = ev.target.closest('[data-ar-pick],[data-ar-new]');
      if (!hit) return;
      const sc = lab.scene;
      if (!sc || !sc.ar) return;
      const D = sc.ar, s = lab.s;
      if (hit.hasAttribute('data-ar-new')) {
        D.reroll(s);
        s.arSeed = (s.arSeed || 0) + 1; s.arPick = null; s.revealed = false; s.playing = false;
        lab.setStep(1);
        try { lab._buildReview(); } catch (e) { /* 키트가 바뀌어도 그림은 그대로 */ }
        lab.invalidate(true);
        return;
      }
      const idx = parseInt(hit.getAttribute('data-ar-pick'), 10);
      const Q = D.prob(D.model(s), s);
      s.arPick = { key: D.id + '|' + Q.key + '|' + (s.arSeed || 0), idx };
      if (Q.choices[idx] && Q.choices[idx].ok) s.revealed = true;
      lab.invalidate(true);
    });
  }
  function installStyle() {
    if (document.getElementById('ar-css')) return;
    const st = document.createElement('style');
    st.id = 'ar-css';
    st.textContent = `
.ar-q{font-size:var(--fs-md);line-height:1.85}
.ar-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin:12px 0 4px}
.ar-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left}
.ar-ch:hover{background:var(--hover)}
.ar-ch .n{color:var(--m-amber);flex:none}
.ar-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.ar-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.ar-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.ar-fb.ok{border-left-color:var(--m-green)}
.ar-fb.bad{border-left-color:var(--m-red)}
.ar-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.ar-note{font-size:var(--fs-xs);color:var(--text-3)}
.ar-notes{margin:0;padding-left:18px;display:grid;gap:4px}`;
    document.head.append(st);
  }
  installStyle();
  installClicks();

  /* ------------------------------------------------------------------ 장면 만들기
     D = { id, title, short, question, ctl:[조절 값 id…], presets?(s), init(s), reroll(s),
           model(s)→M, draw(b,s,M,C), steps(M)→[글…], view(M,C,s)→{guide,readouts,status?,formula?,rule?,notes?,alert?},
           prob(M,s)→{tag,stem,choices,key,note?}, anim?:{key,dur,label}, stepT?(n), verify?(s)→[기하로 잰 값, 식으로 구한 값] } */
  function makeScene(D) {
    const A = D.anim;
    const actions = A ? () => [
      {
        id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'),
        label: (s) => (s.playing ? '일시 정지' : s[A.key] >= 0.999 ? '다시 재생' : A.label || '움직여 보기'),
        on: (s) => s.playing,
        run: (s) => { if (s.playing) s.playing = false; else { if (s[A.key] >= 0.999) s[A.key] = 0; s.playing = true; } }
      },
      { id: 'reset', icon: 'reset', label: '처음으로', run: (s) => { s.playing = false; s[A.key] = 0; } }
    ] : undefined;
    return {
      id: D.id, title: D.title, short: D.short || D.title, ar: D,
      question: D.question,
      controls: (s) => (typeof D.ctl === 'function' ? D.ctl(s) : D.ctl),
      presets: () => (D.presets ? D.presets() : []),
      actions,
      steps: (s) => D.steps(D.model(s)),
      notesTitle: '자주 틀리는 부분',
      problem: {
        tag: (s) => D.prob(D.model(s), s).tag,
        text: (s) => problemHTML(D, s),
        answer: (s) => answerText(D, s)
      },
      enter: (s, lab) => {
        D.init(s);
        s.arSeed = 0; s.arPick = null; s.playing = false;
        if (A) s[A.key] = A.start || 0;
        if (lab) curLab = lab;
      },
      tick: (s, dt, lab) => {
        let again = false;
        if (A && s.playing) {
          s[A.key] = Math.min(1, (s[A.key] || 0) + dt / (A.dur || 6));
          if (s[A.key] >= 1) s.playing = false;
          again = true;
        } else if (A && D.stepT && lab && lab.tab === 'review' && !s.dragging) {
          const tg = D.stepT(s.step || 0), d = tg - s[A.key];
          if (Math.abs(d) > 8e-4) { s[A.key] += clamp(d, -0.35 * dt, 0.35 * dt); again = true; }
        }
        return again;
      },
      view: (s, lab) => {
        if (lab) curLab = lab;
        const C = baseCtx(s, lab, false);
        const M = D.model(s);
        // 단계 문장은 키트가 장면에 들어올 때 한 번만 만들어서, 막대로 값을 바꾸면 정리 탭의 숫자가 옛 값으로 남습니다 → 문장이 달라지면 정리 탭을 다시 만듭니다.
        if (lab && lab.scene && lab.scene.ar === D && lab.s === s && lab.refs && lab.refs.steps) {
          const key = JSON.stringify(D.steps(M));
          if (lab.refs.steps.__ak !== key) { try { lab._buildReview(); } catch (e) { /* 그림은 그대로 */ } if (lab.refs.steps) lab.refs.steps.__ak = key; }
        }
        const v = D.view(M, C, s) || {};
        if (C.tab === 'problem') v.status = { tone: 'info', text: '그림을 보고 풀어 보세요' };
        else if (C.tab === 'review') { const n = D.steps(M).length; v.status = { tone: s.step >= n ? 'ok' : 'info', text: `풀이 ${Math.min(s.step || 1, n)} / ${n}단계` }; }
        return v;
      },
      draw: (b, s, v, lab) => {
        const C = baseCtx(s, lab, !!b.thumb);
        if (b.thumb) C.step = 99;
        const M = D.model(s);
        C.t = A ? (C.tab === 'explore' || b.thumb ? (s[A.key] || 0) : (D.stepT && C.tab === 'review' ? (s[A.key] || 0) : 1)) : 1;
        D.draw(b, s, M, C);
      }
    };
  }

  function register(order, id, title, short, params, scenes) {
    (window.APL_AR_GROUPS = window.APL_AR_GROUPS || []).push({ order, id, title, short, params, scenes: scenes.map(makeScene) });
  }
  const notes = (...li) => `<ul class="ar-notes">${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  const rd = (label, value, color, note, ref, wide) => ({ label, value, color, note, ref, wide });


  /* ------------------------------------------------------------------ 넓이 실험실 도우미 */
  const cm2 = { tex: (v) => tx(v) + '\\text{cm}^2', plain: (v) => fmtN(v) + 'cm²' };
  const cm1 = { tex: (v) => tx(v) + '\\text{cm}', plain: (v) => fmtN(v) + 'cm' };
  const rotAbout = (p, q, th) => { const c = Math.cos(th), sn = Math.sin(th), dx = p.x - q.x, dy = p.y - q.y; return pt(q.x + dx * c - dy * sn, q.y + dx * sn + dy * c); };
  const rpick = (list, cur) => { const pool = list.filter((x) => x !== cur); return pool[Math.floor(Math.random() * pool.length)]; };
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  // 변 pq 와 나란히 바깥으로 (화면 픽셀) off 만큼 띄운 치수선. 글자는 선 가운데에 놓습니다. ref(안쪽 점)의 반대쪽으로 놓습니다.
  function dim(b, p, q, str, o = {}) {
    const k = b.k || 60, u = unit(sub(q, p));
    let n = pt(-u.y, u.x);
    if (o.ref) { const d = sub(mid(p, q), o.ref); if (n.x * d.x + n.y * d.y < 0) n = mul(n, -1); }
    else if (o.side) n = mul(n, o.side);
    const off = (o.off == null ? 24 : o.off) / k, col = o.color || 'ink';
    const a = add(p, mul(n, off)), c = add(q, mul(n, off)), e = 6 / k;
    if (!o.noLine) {
      line(b, a, c, col, 1.9, { alpha: 0.75 });
      line(b, add(a, mul(n, e)), sub(a, mul(n, e)), col, 1.9, { alpha: 0.75 });
      line(b, add(c, mul(n, e)), sub(c, mul(n, e)), col, 1.9, { alpha: 0.75 });
    }
    if (str) T(b, mid(a, c), str, { color: col, size: o.size || 17, dx: o.dx || 0, dy: o.dy || 0 });
  }
  // 점 X 에서 직선 PQ 에 내린 높이: 노란 점선 + 직각 표시. 수선의 발이 선분 밖이면 밑변을 점선으로 늘입니다.
  function hgtTo(b, X, P0, Q0, o = {}) {
    const d = sub(Q0, P0), L2 = d.x * d.x + d.y * d.y || 1, tt = ((X.x - P0.x) * d.x + (X.y - P0.y) * d.y) / L2, F = add(P0, mul(d, tt));
    const col = o.color || 'amber';
    if (tt < -1e-9) line(b, P0, F, 'muted', 2.4, { dash: [6, 5] });
    else if (tt > 1 + 1e-9) line(b, Q0, F, 'muted', 2.4, { dash: [6, 5] });
    line(b, X, F, col, o.width || 3.4, { dash: [7, 5] });
    const toward = tt < 0 ? P0 : tt > 1 ? Q0 : (tt < 0.5 ? Q0 : P0);
    if (len(sub(X, F)) > 1e-6) b.right(F, X, toward, { size: o.rs || 11, color: col });
    if (o.label) {
      const side = o.side == null ? 1 : o.side;
      T(b, lerp(X, F, o.at == null ? 0.5 : o.at), o.label, { dx: side * (o.gap == null ? 10 : o.gap), dy: o.dy || 0, align: side > 0 ? 'left' : 'right', color: col, size: o.size || 17 });
    }
    return F;
  }
  const area2 = (P) => Math.abs(polyArea(P));

  window.APL_AR = {
    PI, DEG, clamp, ease, seg01, NUM, LET, esc, r1, isInt, fmtN, dg, eqs, tx, texDeg,
    pt, add, sub, mul, len, unit, mid, lerp, polar, dirDeg, angBetween, cross, inter, regPoly, regUp, polyArea, centroid, gcd, pick, rint, bboxOf, unionBox,
    textW, T, tagOut, vtx, ang, tick, par, fillPoly, line, poly, fit, P, degF, mkChoices, baseCtx, showAt, makeScene, register, notes, rd,
    cm2, cm1, rotAbout, rpick, range, dim, hgtTo, area2
  };
})();
