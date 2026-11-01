/* ==========================================================================
   중1 · 원과 부채꼴 — "F04 잘라서 채우기" 탐구관 (f04.js, order 64)
   - 색칠한 부분의 일부를 잘라(주황) 빈 곳에 옮겨 끼우면 간단한 도형(직각삼각형·직사각형·반원·부채꼴)이 됩니다.
     그러면 곡선의 넓이를 따로 구하지 않아도 되고, 넓이는 옮겨도 변하지 않으므로 그 도형의 넓이가 곧 답입니다.
   - 교과서 문제의 그림 그대로: 15번(정사각형 속 두 반원), 19번 14(서로의 중심을 지나는 두 원),
     13번 14(점 A를 중심으로 돌린 반원). 이어서 같은 생각의 장면: 반원·사분원 밀기, S자 곡선, 정사각형 속 원, 부채꼴 고리.
   - 움직임은 가로 이동(밀기)과 제자리 회전뿐입니다. 세로 이동은 없습니다.
   - 모든 도형은 길이·각을 막대(또는 점)로 바꿀 수 있고, 그림 속 길이·각·식·정리 단계·문제 보기가 그대로 다시 계산됩니다.
   - 이 파일은 APL_CS_GROUPS 에 묶음 하나를 등록할 뿐, 다른 전역은 만들지 않습니다.
     동작 변수(f4_*)는 쪽이 params 를 합쳐 주지 않아도 장면에 들어올 때 스스로 등록합니다.
   ========================================================================== */
(function () {
  'use strict';
  const PFX = 'f4';
  /* ======================================================================
     공통 뼈대 (f01.js · f04.js 에 같은 내용이 들어 있습니다)
     - 도형은 모두 '실제 길이(cm)'로 계산하고, 화면 배율만 그림에 맞춰 자동으로 정합니다.
     - 장면 하나 = 모델(model: 길이·넓이·글자) + 그리는 함수(render) + 문제. 아래 makeScene 이 탐구·정리·문제 탭을 만듭니다.
     - 움직임은 가로 이동·제자리 회전뿐입니다(세로 이동 없음).
     ====================================================================== */
  const PI = Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const seg01 = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const rad = (d) => (d * PI) / 180;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const NUMC = ['①', '②', '③', '④', '⑤'];
  const fn = (x, d = 2) => { const k = Math.pow(10, d); let v = Math.round(x * k) / k; if (Object.is(v, -0)) v = 0; return String(v).replace('-', '−'); };

  /* ---------- 수: 유리수 Q=[분자,분모], 식 X = c + pπ + s√3 ---------- */
  const Q = (n, d = 1) => { n = Math.round(n); d = Math.round(d); if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const qv = (q) => q[0] / q[1];
  const qadd = (a, b) => Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const qmul = (a, b) => Q(a[0] * b[0], a[1] * b[1]);
  const asQ = (v) => (Array.isArray(v) ? v : Q(v || 0));
  const X = (c, p, s) => ({ c: asQ(c), p: asQ(p), s: asQ(s) });
  const xadd = (a, b) => X(qadd(a.c, b.c), qadd(a.p, b.p), qadd(a.s, b.s));
  const xmul = (a, q) => { q = asQ(q); return X(qmul(a.c, q), qmul(a.p, q), qmul(a.s, q)); };
  const xsub = (a, b) => xadd(a, xmul(b, -1));
  const xv = (x) => qv(x.c) + qv(x.p) * PI + qv(x.s) * Math.sqrt(3);
  const xCount = (x) => ['c', 'p', 's'].filter((k) => x[k][0] !== 0).length;
  function xfmt(x, plain) {
    const order = x.p[0] > 0 ? ['p', 's', 'c'] : ['c', 's', 'p'];
    const minus = plain ? '−' : '-';
    let out = '';
    for (const k of order) {
      const q = x[k];
      if (q[0] === 0) continue;
      const neg = q[0] < 0, n = Math.abs(q[0]), d = q[1];
      const sym = k === 'c' ? '' : k === 'p' ? (plain ? 'π' : '\\pi') : (plain ? '√3' : '\\sqrt{3}');
      const head = k === 'c' ? String(n) : (n === 1 ? sym : n + sym);
      let body;
      if (d === 1) body = head;
      else body = plain ? head + '/' + d : '\\dfrac{' + head + '}{' + d + '}';
      out += (out ? (neg ? minus : '+') : (neg ? minus : '')) + body;
    }
    return out || '0';
  }
  const xs = (x) => xfmt(x, true);
  const xt = (x) => xfmt(x, false);
  const xsp = (x) => (xCount(x) > 1 ? '(' + xs(x) + ')' : xs(x));
  const xtp = (x) => (xCount(x) > 1 ? '(' + xt(x) + ')' : xt(x));
  /** 보기 5개: ans에서 d씩 어긋난 값. 정답이 want번째(조건에 맞지 않으면 다른 자리) */
  function ladder(ans, d, want, valid) {
    const mk = (idx) => [0, 1, 2, 3, 4].map((i) => xadd(ans, xmul(d, i - idx)));
    for (let k = 0; k < 5; k++) {
      const idx = (want + k) % 5;
      const vals = mk(idx);
      if (vals.every(valid || (() => true))) return { vals, ok: idx };
    }
    return { vals: mk(want), ok: want };
  }
  /** 정답 + 흔한 오답(중복 제거)을 값이 작은 것부터 늘어놓습니다. 모자라면 d씩 늘립니다. */
  function ascending(ans, wrongs, d) {
    const seen = new Set([xv(ans).toFixed(6)]);
    const list = [ans];
    for (const w of wrongs) { const k = xv(w).toFixed(6); if (!seen.has(k) && xv(w) > 0) { seen.add(k); list.push(w); } }
    let j = 1;
    while (list.length < 5 && j < 20) { const w = xadd(ans, xmul(d, j)); const k = xv(w).toFixed(6); if (!seen.has(k) && xv(w) > 0) { seen.add(k); list.push(w); } j++; }
    list.length = Math.min(list.length, 5);
    list.sort((a, b) => xv(a) - xv(b));
    return { vals: list, ok: list.findIndex((v) => v === ans) };
  }

  /* ---------- 점·다각형 ---------- */
  const P = (x, y) => ({ x, y });
  function arcP(cx, cy, r, d0, d1, step = 3) {
    const n = Math.max(6, Math.ceil(Math.abs(d1 - d0) / step));
    const out = [];
    for (let i = 0; i <= n; i++) { const a = rad(d0 + ((d1 - d0) * i) / n); out.push(P(cx + r * Math.cos(a), cy + r * Math.sin(a))); }
    return out;
  }
  const sectorP = (cx, cy, r, d0, d1) => [P(cx, cy), ...arcP(cx, cy, r, d0, d1)];
  const rectP = (x0, y0, x1, y1) => [P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)];
  const circleP = (cx, cy, r) => arcP(cx, cy, r, 0, 360).slice(0, -1);
  const shiftP = (poly, dx, dy = 0) => poly.map((p) => P(p.x + dx, p.y + dy));
  const rotP = (poly, cx, cy, deg) => { const c = Math.cos(rad(deg)), s = Math.sin(rad(deg)); return poly.map((p) => P(cx + (p.x - cx) * c - (p.y - cy) * s, cy + (p.x - cx) * s + (p.y - cy) * c)); };
  function bboxOf(polys) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const poly of polys) for (const p of poly) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
    return { x0, y0, x1, y1 };
  }
  /** evenodd 로 채운 영역의 넓이(시험용: 격자 표본) */
  function areaEO(polys, n = 360) {
    const bb = bboxOf(polys);
    const w = bb.x1 - bb.x0, h = bb.y1 - bb.y0;
    let cnt = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x = bb.x0 + ((i + 0.5) * w) / n, y = bb.y0 + ((j + 0.5) * h) / n;
      let inside = 0;
      for (const poly of polys) inside ^= pip(poly, x, y) ? 1 : 0;
      cnt += inside;
    }
    return (cnt * w * h) / (n * n);
  }
  function pip(poly, x, y) {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) c = !c;
    }
    return c;
  }

  /* ---------- 무대에 그리기 ---------- */
  function fillEO(b, polys, color, alpha) {
    if (!(alpha > 0.004)) return;
    const c = b.ctx;
    c.save();
    c.beginPath();
    for (const poly of polys) {
      poly.forEach((p, i) => { const s = b.toS(p.x, p.y); if (i) c.lineTo(s.x, s.y); else c.moveTo(s.x, s.y); });
      c.closePath();
    }
    c.fillStyle = b.color(color, alpha);
    c.fill('evenodd');
    c.restore();
  }
  const outline = (b, poly, color, w, o = {}) => b.path(poly, { close: true, color, width: w, ...o });
  /** 화면 픽셀 반지름의 각 표시(호 + 글자) */
  function angMark(b, v, d0, d1, text, color, al, rpx = 26) {
    const k = b.k, r = rpx / k;
    b.arc(v, r, rad(d0), rad(d1), { color, width: 2, alpha: al });
    if (text) {
      const m = rad((d0 + d1) / 2), rr = (rpx + 17) / k;
      b.text({ x: v.x + rr * Math.cos(m), y: v.y + rr * Math.sin(m) }, text, { color, size: 13.5, weight: 800, baseline: 'middle', alpha: al });
    }
  }
  /** 그림 요소 하나 그리기. it.k: seg|ticks|right|dot|text|ang|arcs */
  function drawItem(b, it, ox, A) {
    const al = (it.alpha == null ? 1 : it.alpha) * A;
    if (al < 0.03) return;
    const pt = (a) => (Array.isArray(a) ? { x: a[0] + ox, y: a[1] } : { x: a.x + ox, y: a.y });
    const col = it.color || 'ink';
    switch (it.k) {
      case 'seg': b.seg(pt(it.p), pt(it.q), { color: col, width: it.w || 2, dash: it.dash, alpha: al }); break;
      case 'ticks': b.ticks(pt(it.p), pt(it.q), { color: it.color || 'amber', count: it.n || 1 }); break;
      case 'right': b.right(pt(it.v), pt(it.p), pt(it.q), { color: it.color || 'amber', size: it.size || 11 }); break;
      case 'dot': b.point(pt(it.p), { r: it.r || 3.8, color: col, glow: false }); break;
      case 'text': b.text(pt(it.p), it.text, { color: col, size: it.size || 14, weight: 800, dx: it.dx || 0, dy: it.dy || 0, align: it.align || 'center', baseline: 'middle', alpha: al, halo: al > 0.9 }); break;
      case 'ang': angMark(b, pt(it.v), it.d0, it.d1, it.text, it.color || 'amber', al, it.r); break;
      default: break;
    }
  }
  /** 화면 픽셀 여백(marg)을 지키면서 그림 전체(bb)가 가장 크게 보이도록 배율·위치를 정합니다. */
  function fitPx(b, bb, m) {
    const a = b._area();
    b.pad = 0.02;
    const pad = b.pad * Math.min(a.w, a.h);
    const bw = Math.max(1e-6, bb.x1 - bb.x0), bh = Math.max(1e-6, bb.y1 - bb.y0);
    const availW = Math.max(40, a.w - 2 * pad - m.l - m.r), availH = Math.max(40, a.h - 2 * pad - m.t - m.b);
    const k = Math.min(availW / bw, availH / bh);
    const fw = (a.w - 2 * pad) / k, fh = (a.h - 2 * pad) / k;
    const cx = (bb.x0 + bb.x1) / 2 - (m.l - m.r) / 2 / k;
    const cy = (bb.y0 + bb.y1) / 2 + (m.t - m.b) / 2 / k;
    b.focus = { x: [cx - fw / 2, cx + fw / 2], y: [cy - fh / 2, cy + fh / 2] };
  }
  /** 도형 아래 두 줄 설명 */
  function caption(b, xc, y0, l1, l2, color, al, dy0 = 40) {
    if (al < 0.03) return;
    b.text({ x: xc, y: y0 }, l1, { color: 'muted', size: 12.5, weight: 800, dy: dy0, alpha: al, halo: al > 0.9 });
    b.text({ x: xc, y: y0 }, l2, { color, size: 15.5, weight: 800, dy: dy0 + 20, alpha: al, halo: al > 0.9 });
  }

  /* ---------- 공통 상태·문제 화면 ---------- */
  const PARAMS = {};
  const STEP_T = [0, 0.05, 0.3, 0.76, 1];
  const DUR = 12;
  const TL = { hi: [0.12, 0.3], mv: [0.38, 0.74], res: [0.8, 0.96] };
  const phaseOf = (t) => ({ hi: ease(seg01(t, TL.hi[0], TL.hi[1])), mv: ease(seg01(t, TL.mv[0], TL.mv[1])), res: seg01(t, TL.res[0], TL.res[1]) });
  function ensureParams(lab) { if (lab && lab.params) for (const k of Object.keys(PARAMS)) if (!lab.params[k]) lab.params[k] = PARAMS[k]; }
  function refreshReview(lab) {
    try { lab._buildReview(); } catch (e) { /* 키트가 바뀌어도 그림은 그대로 동작 */ }
    if (lab && lab.invalidate) lab.invalidate(true);
  }
  const SCENES = {};   // id → 장면 정의(클릭 처리에서 찾습니다)

  function makeScene(sp) {
    const K = (k) => PFX + '_' + sp.id + '_' + k;
    const kt = K('t'), kmode = K('mode'), kseed = K('seed'), kpick = K('pick');
    const NAMES = sp.phaseNames || ['전체 도형', '파낼 부분 찾기', '옆으로 꺼내기', '남은 부분', '완성'];
    const phaseName = (t) => (t < 0.12 ? NAMES[0] : t < 0.3 ? NAMES[1] : t < 0.74 ? NAMES[2] : t < 0.96 ? NAMES[3] : NAMES[4]);
    const onInput = (s, lab) => { s[kpick] = null; refreshReview(lab); };
    sp.vars.forEach((v) => {
      PARAMS[K(v.k)] = {
        value: v.value, min: v.min, max: v.max, step: v.step || 1, color: v.color || 'amber', label: v.label, hint: v.hint,
        format: (val) => (v.fmt ? v.fmt(val) : `${v.sym || v.k} = ${fn(val)}${v.unit == null ? ' cm' : v.unit}`),
        onInput
      };
    });
    PARAMS[kt] = { value: 0, min: 0, max: 1, step: 0.005, color: 'amber', label: sp.tLabel || '움직여 보기', hint: sp.tHint || '오른쪽으로 끌면 파낸 부분이 옆으로 나와요', format: phaseName };

    const getV = (s) => {
      const V = {};
      sp.vars.forEach((v) => { const raw = s[K(v.k)]; V[v.k] = clamp(raw == null || !Number.isFinite(+raw) ? v.value : +raw, v.min, v.max); });
      if (sp.fix) sp.fix(V);
      return V;
    };
    let cache = null;
    const modelOf = (V) => {
      const key = JSON.stringify(V);
      if (!cache || cache.key !== key) cache = { key, M: sp.model(V) };
      return cache.M;
    };
    const ctxOf = (s, lab) => {
      const tab = (lab && lab.tab) || 'explore';
      const problem = tab === 'problem';
      const seed = s[kseed] || 0;
      const V = getV(s);
      const M = modelOf(V);
      const mode = M.edges ? (s[kmode] | 0) : 0;
      const t = clamp(+s[kt] || 0, 0, 1);
      return Object.assign({ s, lab, V, M, tab, problem, review: tab === 'review', mode, t, seed, step: s.step || 0 }, phaseOf(t), {
        set: (k, val, quiet) => {
          const v = sp.vars.find((x) => x.k === k);
          s[K(k)] = clamp(val, v.min, v.max);
          s[kpick] = null;
          if (!quiet) refreshReview(lab);
        }
      });
    };
    const choicesOf = (V, seed) => (sp.problem && sp.problem.choices ? sp.problem.choices(V, seed) : null);

    function problemHTML(s, lab) {
      const c = ctxOf(s, lab);
      const V = c.V, pr = sp.problem, seed = c.seed;
      let h = `<div class="${PFX}-q">${pr.stem(V)}</div>`;
      const ch = choicesOf(V, seed);
      const pick = s[kpick];
      if (ch) {
        h += `<div class="${PFX}-choices">`;
        ch.vals.forEach((v, i) => {
          const cls = pick == null ? '' : i === pick ? (i === ch.ok ? ' ok' : ' bad') : '';
          h += `<button type="button" class="${PFX}-ch${cls}" data-${PFX}-pick="${i}" aria-label="${NUMC[i]} ${esc(xs(v))}"><span class="n">${NUMC[i]}</span><span class="v">$${xtp(v)}$&nbsp;${pr.unit || 'cm²'}</span></button>`;
        });
        h += '</div>';
        if (pick != null) {
          h += pick === ch.ok
            ? `<div class="${PFX}-fb ok"><b>정답이에요!</b> 정리 탭에서 풀이 과정을 확인해 보세요.</div>`
            : `<div class="${PFX}-fb bad"><b>다시 생각해 볼까요?</b> ${pr.hint ? pr.hint(V) : '그림에서 전체와 파낸 부분을 다시 찾아 보세요.'}</div>`;
        }
      } else {
        h += `<div class="${PFX}-note">서답형 문제예요. 풀이를 써 본 뒤 ‘모범답안 보기’를 눌러 비교해 보세요.</div>`;
        if (!s.revealed) h += `<div class="${PFX}-tools"><button type="button" class="apl-btn sm" data-${PFX}-show>모범답안 보기</button></div>`;
      }
      h += `<div class="${PFX}-tools"><button type="button" class="apl-btn sm" data-${PFX}-new>숫자 바꾸기</button>${pr.textbook === false ? `<span class="${PFX}-note">교과서 문제를 바꾼 문제예요.</span>` : ''}</div>`;
      return h;
    }

    const stepsOf = (s) => { const c = ctxOf(s, null); return c.mode ? c.M.stepsP : c.M.steps; };
    const sc = {
      id: PFX + '-' + sp.id, title: sp.title, short: sp.short, question: sp.question, csSpec: sp, csPfx: PFX,
      controls: () => [kt].concat(sp.vars.map((v) => K(v.k))),
      presets: (s) => {
        const list = [];
        const M = modelOf(getV(s));
        if (M.edges) {
          list.push({ group: '보기', label: '넓이', apply: (st, lab) => { st[kmode] = 0; st.step = 1; refreshReview(lab); }, on: (st) => !(st[kmode] | 0) });
          list.push({ group: '보기', label: '둘레', apply: (st, lab) => { st[kmode] = 1; st.step = 1; st.playing = false; refreshReview(lab); }, on: (st) => !!(st[kmode] | 0) });
        }
        (sp.presets || []).forEach((p) => list.push({ group: p.group || '예', label: p.label, apply: (st, lab) => { Object.keys(p.set).forEach((k) => { st[K(k)] = p.set[k]; }); st[kpick] = null; if (p.mode != null) st[kmode] = p.mode; refreshReview(lab); }, on: (st) => Object.keys(p.set).every((k) => Math.abs((+st[K(k)]) - p.set[k]) < 1e-6) }));
        return list;
      },
      actions: () => [
        { id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'), label: (s) => (s.playing ? '일시 정지' : s[kt] >= 0.999 ? '다시 재생' : '재생'), on: (s) => s.playing,
          run: (s) => { if (s.playing) s.playing = false; else { if (s[kt] >= 0.999) s[kt] = 0; s[kmode] = 0; s.playing = true; } } },
        { id: 'reset', icon: 'reset', label: '처음으로', run: (s) => { s.playing = false; s[kt] = 0; } }
      ],
      steps: (s) => stepsOf(s),
      solution: {
        standardTitle: '교과서식 풀이', standardTag: '정석', quickTitle: '빠른 풀이 · 핵심', quickTag: '핵심',
        standard: (s) => { const c = ctxOf(s, null); return { steps: sp.problem.std(c.V, c.M), warning: sp.problem.warn ? sp.problem.warn(c.V) : null }; },
        quick: (s) => { const c = ctxOf(s, null); return { steps: sp.problem.quick(c.V, c.M), highlight: sp.problem.key ? sp.problem.key(c.V) : null }; }
      },
      notesTitle: '자주 틀리는 부분',
      problem: {
        tag: sp.problem.tag,
        text: (s) => problemHTML(s, window.lab),
        answer: (s) => { const c = ctxOf(s, window.lab); const ch = choicesOf(c.V, c.seed); return ch ? `${NUMC[ch.ok]} $${xtp(ch.vals[ch.ok])}$ ${sp.problem.unit || 'cm²'}` : sp.problem.answer(c.V); }
      },
      enter: (s, lab) => {
        ensureParams(lab);
        sp.vars.forEach((v) => { s[K(v.k)] = v.value; });
        s[kt] = 0; s[kmode] = 0; s[kseed] = 0; s[kpick] = null; s.playing = false;
      },
      focus: () => ({ x: [0, 10], y: [0, 10] }),
      tick: (s, dt, lab) => {
        let again = false;
        const mode = (() => { try { return ctxOf(s, lab).mode; } catch (e) { return 0; } })();
        if (s.playing) { s[kt] = Math.min(1, (+s[kt] || 0) + dt / DUR); if (s[kt] >= 1) s.playing = false; again = true; }
        else if (lab && lab.tab === 'review' && !mode) {
          const st = sp.stepT || STEP_T;
          const tg = st[clamp(s.step || 0, 0, st.length - 1)];
          const d = tg - (+s[kt] || 0);
          if (Math.abs(d) > 0.0008) { s[kt] = (+s[kt] || 0) + clamp(d, -0.5 * dt, 0.5 * dt); again = true; }
        }
        return again;
      },
      view: (s, lab) => {
        const c = ctxOf(s, lab), M = c.M;
        const v = {};
        const gd = c.mode ? M.guideP : M.guide;
        const pick = c.review ? clamp(c.step - 1, 0, 3) : c.t < TL.hi[0] ? 0 : c.t < TL.hi[1] + 0.04 ? 1 : c.t < TL.mv[1] ? 2 : 3;
        v.guide = gd ? gd[c.mode ? Math.min(gd.length - 1, c.review ? c.step - 1 : 0) : pick] : null;
        v.readouts = M.readouts;
        if (!c.problem) v.chips = sp.chips ? sp.chips(c) : [];
        const stp = c.mode ? M.stepsP : M.steps;
        const STAT = sp.stepStatus || ['전체 도형', '파낼 부분 찾기', '파낸 부분 꺼내기', '색칠한 부분 = 전체 − 파낸 부분'];
        if (c.review && c.step > 0) v.status = { tone: c.step >= stp.length ? 'ok' : 'info', text: c.mode ? `둘레 ${c.step} / ${stp.length}` : STAT[Math.min(STAT.length, c.step) - 1] };
        else if (!c.problem) v.status = { tone: c.res >= 0.999 && !c.mode ? 'ok' : 'info', text: c.mode ? M.modeText || '둘레 보기' : phaseName(c.t) };
        v.formula = c.mode ? M.formulaP : M.formula;
        v.rule = c.mode ? M.ruleP : M.rule;
        v.notes = M.notes;
        return v;
      },
      draw: (b, s, v, lab) => {
        const c = ctxOf(s, lab);
        const L = sp.layout(c);
        fitPx(b, L.bb, L.marg);
        sp.render(b, c);
      },
      csModel: (s) => modelOf(getV(s)),
      csChoices: (s, lab) => { const c = ctxOf(s, lab); return choicesOf(c.V, c.seed); },
      csKeys: { K, kt, kmode, kseed, kpick }
    };
    SCENES[sc.id] = sc;
    return sc;
  }

  /* ---------- 문제 탭의 버튼 (보기 고르기 · 숫자 바꾸기 · 모범답안) ---------- */
  function installClicks() {
    const root = document.documentElement;
    if (root.dataset[PFX + 'Bound']) return;
    root.dataset[PFX + 'Bound'] = '1';
    document.addEventListener('click', (ev) => {
      const lab = window.lab;
      if (!lab || !ev.target || !ev.target.closest) return;
      const hit = ev.target.closest(`[data-${PFX}-pick],[data-${PFX}-new],[data-${PFX}-show]`);
      if (!hit) return;
      const sc = lab.scene;
      if (!sc || sc.csPfx !== PFX) return;
      const sp = sc.csSpec, k = sc.csKeys, s = lab.s;
      if (hit.hasAttribute(`data-${PFX}-show`)) { s.revealed = true; lab.invalidate(true); return; }
      if (hit.hasAttribute(`data-${PFX}-new`)) {
        const cur = JSON.stringify(sp.vars.map((v) => +s[k.K(v.k)]));
        const pool = (sp.pool || []).filter((p) => JSON.stringify(sp.vars.map((v) => p[v.k])) !== cur);
        const p = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
        if (p) sp.vars.forEach((v) => { s[k.K(v.k)] = p[v.k]; });
        s[k.kseed] = (s[k.kseed] || 0) + 1;
        s[k.kpick] = null;
        s.revealed = false;
        s[k.kt] = 0;
        s.playing = false;
        lab.setStep(1);
        refreshReview(lab);
        return;
      }
      const idx = parseInt(hit.getAttribute(`data-${PFX}-pick`), 10);
      const ch = sc.csChoices(s, lab);
      s[k.kpick] = idx;
      if (ch && idx === ch.ok) s.revealed = true;   // 정답이면 풀이 단계를 끝까지 보지 않아도 정답을 열어 줍니다
      lab.invalidate(true);
    });
  }
  function installStyle() {
    const id = PFX + '-css';
    if (document.getElementById(id)) return;
    const st = document.createElement('style');
    st.id = id;
    const q = '.' + PFX;
    st.textContent = `
${q}-q{font-size:var(--fs-md);line-height:1.85}
${q}-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0 4px}
${q}-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left}
${q}-ch:hover{background:var(--hover)}
${q}-ch .n{color:var(--m-amber);flex:none}
${q}-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
${q}-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
${q}-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
${q}-fb.ok{border-left-color:var(--m-green)}
${q}-fb.bad{border-left-color:var(--m-red)}
${q}-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
${q}-note{font-size:var(--fs-xs);color:var(--text-3);margin-top:6px}`;
    document.head.append(st);
  }
  /* ======================================================================
     F04 · 잘라서 채우기 : 일부분을 옮겨 간단한 도형으로 만들기
     ① 색칠한 처음 모양 → ② 옮길 조각(주황) 찾기 → ③ 가로 이동·제자리 회전으로 빈 곳에 끼우기 → ④ 간단한 도형의 넓이
     ====================================================================== */
  const cm2 = (x) => xs(x) + ' cm²';
  const T = (p, text, o = {}) => Object.assign({ k: 'text', p, text, when: 's' }, o);
  const away = (nx, ny, L = 18) => ({ dx: nx * L, dy: -ny * L, align: nx > 0.4 ? 'left' : nx < -0.4 ? 'right' : 'center' });
  const guide4 = (g) => [
    `먼저 <b>색칠한 처음 모양</b>이에요: ${g.start}. ▶ 재생을 누르거나 <b>‘움직여 보기’</b> 막대를 오른쪽으로 끌어 보세요.`,
    `<b>옮길 조각</b>(주황색)을 찾았어요: ${g.piece}. 점선은 조각이 들어갈 <b>빈 곳</b>이에요.`,
    `조각을 ${g.how}. 모양과 크기가 같아서 빈 곳에 꼭 맞아요.`,
    `색칠한 부분이 <b>${g.shape}</b>이(가) 되었어요 → 넓이 = <b>${g.area}</b>`
  ];
  const move = (o) => {
    const bb = bboxOf(o.bbPolys || [].concat(o.shade0, o.target, ...o.pieces.map((p) => p.dst)));
    o.margL = o.margL || 22;
    const pad = o.pad || 0;
    const resStr = cm2(o.resX);
    const d = {
      bb: { x0: bb.x0 - pad, y0: bb.y0, x1: bb.x1 + pad, y1: bb.y1 },
      readouts: [
        { label: '옮기기 전', value: o.startShort || '곡선이 섞인 모양', color: 'ink', note: o.startStr },
        { label: '옮긴 뒤 모양', value: o.shapeShort, color: 'amber', note: o.shapeStr },
        { label: '색칠한 부분의 넓이', value: resStr, color: 'sky', wide: true, note: `≈ ${fn(xv(o.resX))} cm²` }
      ],
      guide: guide4(o.g),
      formula: `<p><b>색칠한 부분</b> = (옮긴 뒤의 간단한 도형)</p><p>${o.formulaLine} = <b>${xs(o.resX)}</b> (cm²)</p>`,
      rule: '조각을 옮겨도 넓이는 변하지 않는다 → (처음 색칠한 부분) = (옮긴 뒤 도형)',
      cap: { start: { l: '색칠한 부분의 넓이는?', v: '조각을 옮겨 보세요' }, res: { l: o.capRes || '옮긴 뒤 도형의 넓이', v: resStr } },
      eqTex: o.eqTex
    };
    return Object.assign({ base: [], fig: [], notes: '' }, d, o, { bb: d.bb, cap: d.cap, steps: o.steps.map((t) => t.replace(/<\/?b>/g, '')) });
  };

  function layoutMove(c) {
    return { bb: c.M.bb, marg: { l: c.M.margL, r: 22, t: 18, b: c.problem ? 44 : 94 } };
  }
  const tfPoly = (poly, pc, p) => (pc.tf.kind === 'rot' ? rotP(poly, pc.tf.c[0], pc.tf.c[1], pc.tf.ang * p) : shiftP(poly, pc.tf.dx * p));
  const tfPt = (a, pc, p) => { const q = tfPoly([P(a[0], a[1])], pc, p)[0]; return [q.x, q.y]; };
  const whenA = (c, w) => (w === 'hm' ? seg01(c.hi, 0.4, 1) * (1 - seg01(c.mv, 0.6, 0.95)) : w === 'b' ? 1 - seg01(c.mv, 0, 0.3) : w === 'h' ? seg01(c.hi, 0.4, 1) : w === 'm' ? seg01(c.mv, 0.5, 1) : w === 'r' ? seg01(c.res, 0.2, 0.8) : 1);

  function renderMove(b, c) {
    const M = c.M, { hi, mv, res } = c, bb = M.bb, cx = (bb.x0 + bb.x1) / 2;
    const pieces = M.pieces, n = pieces.length;
    const drawBase = (al, rs = 0) => M.base.forEach((e) => b.path(e.pts, { close: e.close !== false, color: e.color || 'ink', width: e.w || 2.2, dash: e.dash, alpha: (e.alpha == null ? 1 : e.alpha) * al * (1 - (e.fade || 0) * rs) }));
    if (c.problem) {
      fillEO(b, M.shade0, 'sky', 0.5);
      drawBase(1);
      M.fig.forEach((it) => { if (it.when === 'g') drawItem(b, it, 0, 1); });
      return;
    }
    const prog = (i) => { const a = n > 1 ? (i * 0.4) / (n - 1) : 0, len = n > 1 ? 0.6 : 1; return ease(seg01(mv, a, a + len)); };
    const fillPieces = pieces.filter((p) => p.fill !== false);
    const src = [].concat(...fillPieces.map((p) => p.polys));
    if (M.crossfade) {
      fillEO(b, M.shade0, 'sky', 0.46 * (1 - res));
      fillEO(b, M.target, 'sky', 0.46 * res);
    } else {
      fillEO(b, M.shade0.concat(src), 'sky', 0.46);
    }
    pieces.forEach((pc, i) => {
      const p = prog(i), polys = pc.polys.map((q) => tfPoly(q, pc, p));
      if (pc.fill === false) fillEO(b, polys, 'amber', 0.22 * hi * (1 - res));
      else { fillEO(b, polys, 'sky', 0.46 * (1 - hi * (1 - res))); fillEO(b, polys, 'amber', 0.6 * hi * (1 - res)); }
    });
    drawBase(1, res);
    pieces.forEach((pc) => pc.dst.forEach((q) => outline(b, q, 'amber', 2, { dash: [6, 4], alpha: 0.9 * hi * (1 - res) })));
    pieces.forEach((pc, i) => { const p = prog(i); pc.polys.forEach((q) => outline(b, tfPoly(q, pc, p), 'amber', 2.4, { alpha: hi * (1 - 0.85 * res) })); });
    M.target.forEach((q) => outline(b, q, 'sky', 3.4, { alpha: res }));
    M.fig.forEach((it) => drawItem(b, it, 0, whenA(c, it.when)));
    pieces.forEach((pc, i) => { const p = prog(i); (pc.items || []).forEach((it) => drawItem(b, Object.assign({}, it, { p: tfPt(it.p, pc, p) }), 0, whenA(c, it.when))); });
    caption(b, cx, bb.y0, M.cap.start.l, M.cap.start.v, 'ink', 1 - seg01(res, 0, 0.5));
    caption(b, cx, bb.y0, M.cap.res.l, M.cap.res.v, 'sky', seg01(res, 0.5, 1));
    if (M.handles) M.handles.forEach((h) => b.handle(h.id, P(h.p[0], h.p[1]), { color: 'amber', ariaLabel: h.label, drag: (wp) => h.drag(wp, c) }));
  }
  function chipsMove(c) {
    const M = c.M;
    if (c.res > 0.5) return [{ k: '색칠한 부분', tex: M.eqTex, color: 'sky' }];
    if (c.mv > 0.5) return [{ k: '옮기면', html: esc(M.shapeShort), color: 'amber' }];
    return [];
  }
  const seg2 = (a, b, color, w = 1.8) => ({ k: 'seg', p: a, q: b, color, dash: [5, 4], w, when: 's' });
  const poly = (pts, o = {}) => Object.assign({ pts, close: true }, o);

  /* ---------- 장면 정의 ---------- */
  const SPECS = [];

  /* ① 15번 : 정사각형 안의 두 반원 → 직각삼각형 */
  SPECS.push({
    id: 'sq12', title: '정사각형 속 두 반원 → 삼각형', short: '반원 둘 → 삼각형',
    question: '잎 모양의 두 조각을 돌려 빈 곳에 끼우면 색칠한 부분은 어떤 도형이 될까요?',
    phaseNames: ['처음 모양', '옮길 조각 찾기', '조각 돌려 끼우기', '옮긴 뒤 모양', '삼각형 완성'],
    vars: [{ k: 'a', sym: 'a', label: '정사각형의 한 변 a', min: 6, max: 16, step: 2, value: 12 }],
    pool: [{ a: 6 }, { a: 8 }, { a: 10 }, { a: 14 }, { a: 16 }],
    model: (V) => {
      const a = V.a, h = a / 2;
      const sq = rectP(0, 0, a, a), SA = arcP(h, 0, h, 0, 180), SB = arcP(a, h, h, 90, 270);
      const s1 = arcP(h, 0, h, 90, 0), s2 = arcP(a, h, h, 180, 270);
      const pieces = [
        { polys: [s1], tf: { kind: 'rot', c: [h, 0], ang: 90 }, dst: [rotP(s1, h, 0, 90)], items: [T([0.8 * a, 0.3 * a], '①', { when: 'hm', color: 'amber', size: 15 })] },
        { polys: [s2], tf: { kind: 'rot', c: [a, h], ang: -90 }, dst: [rotP(s2, a, h, -90)], items: [T([0.7 * a, 0.2 * a], '②', { when: 'hm', color: 'amber', size: 15 })] }
      ];
      const resX = X(Q(a * a, 2));
      return move({
        shade0: [sq, SA, SB], pieces, target: [[P(0, 0), P(0, a), P(a, a)]], resX,
        base: [{ pts: sq, w: 2.6 }, { pts: SA, w: 2.2 }, { pts: SB, w: 2.2 }],
        fig: [
          T([a / 2, 0], `${fn(a)} cm`, { when: 'g', dy: 17 }),
          { k: 'dot', p: [h, 0], when: 'g' }, { k: 'dot', p: [a, h], when: 'g' },
          seg2([h, 0], [h, h], 'ink'), seg2([a, h], [h, h], 'ink'),
          T([h, h * 0.45], `${fn(h)}`, { dx: -12, color: 'ink' }), T([a * 0.75, h], `${fn(h)}`, { dy: -12, color: 'ink' }),
          T([a * 0.3, a * 0.7], '삼각형', { when: 'r', color: 'sky', size: 15, dy: -9 }), T([a * 0.3, a * 0.7], `${fn(a * a / 2)}`, { when: 'r', color: 'sky', size: 15, dy: 9 })
        ],
        startStr: `정사각형 ${a * a} cm² 안의 모양`, shapeStr: '정사각형의 절반', shapeShort: '직각삼각형',
        g: { start: `한 변 ${fn(a)} cm인 정사각형에서 반원 두 개 밖의 부분과 두 반원이 겹친 부분`, piece: '겹친 잎 모양의 두 조각 ①, ②', how: '각 반원의 중심을 기준으로 90°씩 <b>제자리 회전</b>시켜', shape: '직각삼각형', area: `${a}×${a}÷2 = ${a * a / 2} cm²` },
        formulaLine: `$\\dfrac12\\times${a}\\times${a}$`, eqTex: `\\dfrac12\\times${a}\\times${a}=${a * a / 2}`, shapeTex: '\\text{직각삼각형}',
        capRes: '직각삼각형의 넓이',
        steps: [
          '색칠한 부분은 정사각형에서 두 반원이 만든 흰 부분을 뺀 모양이에요. 곡선이 있어 바로 넓이를 구하기 어려워요',
          `겹친 잎 모양을 대각선 방향 현으로 나눈 두 조각 ①, ②를 잘라요. 둘 다 반지름 ${fn(h)} cm인 사분원에서 직각이등변삼각형을 뺀 활꼴이에요`,
          `①은 아래 변의 반원의 중심을, ②는 오른쪽 변의 반원의 중심을 기준으로 90°씩 돌려요. ①은 반시계 방향, ②는 시계 방향이에요`,
          `색칠한 부분이 정사각형의 대각선으로 나눈 <b>직각삼각형</b>이 돼요 → $\\dfrac12\\times${a}\\times${a}=${a * a / 2}$ (cm²)`
        ],
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>반원의 넓이(π가 들어간 값)를 구하지 않아도 돼요. 조각을 옮기면 π가 사라져요.</li><li>옮긴 조각은 모양과 크기가 같아서 <b>넓이가 변하지 않아요.</b></li></ul>'
      });
    },
    problem: {
      tag: '색칠한 부분의 넓이 (3) 도형의 일부분을 이동하는 경우', unit: 'cm²',
      stem: (V) => `오른쪽 그림과 같이 한 변의 길이가 ${V.a} cm인 정사각형에서 색칠한 부분의 넓이는?`,
      choices: (V) => { const q = V.a * V.a; return { vals: [X(Q(q, 4)), X(0, Q(q, 4)), X(Q(q, 2)), X(0, Q(q, 2)), X(Q(3 * q, 4))], ok: 2 }; },
      hint: () => '반원의 넓이를 구하지 말고, 겹친 잎 모양의 두 조각을 빈 곳으로 옮겨 보세요.',
      std: (V, M) => `<b>해결 전략</b> 색칠한 부분의 일부를 옮겨 간단한 도형으로 바꾼다.<br>잎 모양의 두 조각을 각각 90° 돌려 빈 곳에 채우면 색칠한 부분은 정사각형의 대각선으로 나눈 직각삼각형이 된다.<br>(색칠한 부분의 넓이) $=\\dfrac12\\times${V.a}\\times${V.a}=${V.a * V.a / 2}$ (cm²)`,
      quick: (V) => `정사각형의 절반 → $${V.a}\\times${V.a}\\div2=${V.a * V.a / 2}$`,
      warn: () => '반원의 넓이 πr²/2를 계산하려고 하면 복잡해져요. 두 반원이 겹친 부분을 옮겨 보세요.'
    }
  });

  /* ② 두 원이 서로의 중심을 지날 때 → 직사각형 (가로 이동) */
  SPECS.push({
    id: 'circ2', title: '서로의 중심을 지나는 두 원 → 직사각형', short: '두 원 → 직사각형',
    question: '오른쪽 원의 오른쪽 반원을 가로로 밀어 왼쪽 원 자리에 끼우면 색칠한 부분은 어떤 도형이 될까요?',
    phaseNames: ['처음 모양', '옮길 조각 찾기', '반원 밀기', '옮긴 뒤 모양', '직사각형 완성'],
    vars: [{ k: 'r', sym: 'r', label: '원의 반지름 r', min: 3, max: 10, step: 1, value: 6 }],
    pool: [{ r: 4 }, { r: 8 }, { r: 10 }, { r: 3 }],
    model: (V) => {
      const r = V.r;
      const stadium = arcP(r, r, r, 90, 270).concat(arcP(2 * r, r, r, -90, 90));
      const D1 = circleP(r, r, r), D2 = circleP(2 * r, r, r);
      const rh = arcP(2 * r, r, r, -90, 90);
      const resX = X(2 * r * r);
      return move({
        shade0: [stadium, D1], pieces: [{ polys: [rh], tf: { kind: 'slide', dx: -r }, dst: [shiftP(rh, -r)], items: [T([2.5 * r, r], '①', { when: 'hm', color: 'amber', size: 15 })] }],
        target: [rectP(r, 0, 2 * r, 2 * r)], resX,
        base: [{ pts: D1, w: 2.2 }, { pts: D2, w: 2.2 }, { pts: [P(r, 0), P(2 * r, 0)], close: false, w: 2.2 }, { pts: [P(r, 2 * r), P(2 * r, 2 * r)], close: false, w: 2.2 }],
        fig: [
          { k: 'dot', p: [r, r], when: 'g' }, { k: 'dot', p: [2 * r, r], when: 'g' },
          { k: 'seg', p: [r, r], q: [2 * r, r], color: 'ink', w: 1.8, when: 'g' }, T([1.5 * r, r], `${fn(r)} cm`, { when: 'g', dy: -13, color: 'ink' }),
          { k: 'seg', p: [r, 0], q: [r, 2 * r], color: 'rose', w: 1.6, dash: [5, 4], when: 'r' },
          T([1.5 * r, r * 0.4], `${fn(r)} × ${fn(2 * r)}`, { when: 'r', color: 'sky', size: 15, dy: 0 })
        ],
        startStr: '두 원을 감싼 도형에서 왼쪽 원을 뺀 모양', shapeStr: `가로 ${fn(r)} cm, 세로 ${fn(2 * r)} cm`, shapeShort: '직사각형',
        g: { start: `반지름 ${fn(r)} cm인 두 원이 서로의 중심을 지나요. 색칠한 곳은 두 원의 바깥 둘레선으로 감싼 도형에서 왼쪽 원을 뺀 부분`, piece: '오른쪽 원의 오른쪽 반원 ①', how: `왼쪽으로 ${fn(r)} cm <b>가로로 밀어</b>`, shape: '직사각형', area: `${fn(r)}×${fn(2 * r)} = ${fn(2 * r * r)} cm²` },
        formulaLine: `$${r}\\times${2 * r}$`, eqTex: `${r}\\times${2 * r}=${2 * r * r}`, shapeTex: '\\text{직사각형}', capRes: '직사각형의 넓이',
        steps: [
          '색칠한 부분은 두 원을 감싼 도형에서 왼쪽 원(렌즈 모양 겹침 포함)을 뺀 모양이에요',
          `오른쪽 원의 오른쪽 반원 ①을 잘라요. 중심 사이의 거리가 반지름(${fn(r)} cm)과 같아서, 왼쪽으로 ${fn(r)} cm 밀면 왼쪽 원의 오른쪽 반원 자리(빈 곳)와 꼭 겹쳐요`,
          `반원 ①을 왼쪽으로 ${fn(r)} cm 가로로 밀어 빈 곳에 끼워요`,
          `색칠한 부분이 가로 ${fn(r)} cm, 세로 ${fn(2 * r)} cm인 <b>직사각형</b>이 돼요 → $${r}\\times${2 * r}=${2 * r * r}$ (cm²)`
        ],
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>두 원이 서로의 중심을 지나므로 <b>중심 사이의 거리 = 반지름</b>이에요.</li><li>세로는 지름 2r, 가로는 r이라서 넓이는 $2r^2$이에요. π는 나오지 않아요.</li></ul>'
      });
    },
    problem: {
      tag: '일부분을 옮기는 경우 (겹치는 두 원)', unit: 'cm²',
      stem: (V) => `오른쪽 그림과 같이 반지름의 길이가 ${V.r} cm인 두 원이 서로의 중심을 지날 때, 색칠한 부분의 넓이는?`,
      choices: (V) => ({ vals: [X(10 * V.r), X(2 * V.r * V.r), X(13 * V.r), X(0, 4 * V.r), X(0, 5 * V.r)], ok: 1 }),
      hint: () => '오른쪽 반원을 왼쪽으로 가로로 밀어 빈 곳에 끼워 보세요.',
      std: (V) => `<b>해결 전략</b> 오른쪽 원의 오른쪽 반원을 왼쪽으로 ${V.r} cm 옮겨 왼쪽 원의 오른쪽 반원 자리에 채운다.<br>색칠한 부분은 가로 ${V.r} cm, 세로 ${2 * V.r} cm인 직사각형이 된다.<br>(넓이) $=${V.r}\\times${2 * V.r}=${2 * V.r * V.r}$ (cm²)`,
      quick: (V) => `반원 옮기기 → $r\\times2r=${2 * V.r * V.r}$`
    }
  });

  /* ③ 13-14 : 반원을 돌렸을 때 → 부채꼴 (제자리 회전) */
  SPECS.push({
    id: 'turn', title: '반원을 점 A를 중심으로 돌렸을 때 → 부채꼴', short: '돌린 반원 → 부채꼴',
    question: '반원을 점 A를 중심으로 돌려 놓았어요. 돌린 반원을 되돌려 처음 반원에 겹치면 색칠한 부분은 어떤 도형과 같아질까요?',
    phaseNames: ['돌린 모양', '같은 반원 찾기', '되돌려 겹치기', '넓이가 같아요', '부채꼴과 같아요'],
    vars: [
      { k: 'r', sym: 'r', label: '반원의 반지름 r', min: 2, max: 6, step: 1, value: 3 },
      { k: 'th', sym: 'θ', label: '돌린 각 θ', hint: 'B′ 점을 끌어도 돼요', min: 30, max: 150, step: 15, value: 60, fmt: (v) => `θ = ${fn(v)}°` }
    ],
    pool: [{ r: 3, th: 90 }, { r: 3, th: 120 }, { r: 6, th: 60 }, { r: 6, th: 30 }, { r: 4, th: 90 }, { r: 2, th: 90 }],
    model: (V) => {
      const r = V.r, th = V.th, R2 = 2 * r;
      const ox = r * Math.cos(rad(th)), oy = r * Math.sin(rad(th));
      const S0 = arcP(r, 0, r, 0, 180), SR = arcP(ox, oy, r, th, th + 180), SEC = sectorP(0, 0, R2, 0, th);
      const resX = X(0, Q(R2 * R2 * th, 360));
      const bbP = [[P(-R2, -0.6 * r), P(R2, 2 * R2 * 0.55)]];
      return move({
        shade0: [SEC, SR, S0], pieces: [{ polys: [SR], tf: { kind: 'rot', c: [0, 0], ang: -th }, dst: [S0], fill: false, items: [T([ox, oy], 'O′', { when: 'b', color: 'ink', dx: -14, dy: 12 })] }],
        target: [SEC], crossfade: true, resX, bbPolys: [SEC, SR, S0],
        base: [{ pts: S0, w: 2.2, fade: 0.75 }, { pts: SR, w: 2.2, fade: 0.75 }, { pts: [P(0, 0), P(R2 * Math.cos(rad(th)), R2 * Math.sin(rad(th)))], close: false, w: 2 }, { pts: [P(0, 0), P(R2, 0)], close: false, w: 2.2 }, { pts: arcP(0, 0, R2, 0, th), close: false, w: 2 }],
        fig: [
          T([0, 0], 'A', { when: 'g', dx: -11, dy: 12 }), T([R2, 0], 'B', { when: 'g', dx: 10, dy: 12 }), T([r, 0], 'O', { when: 'g', dy: 13 }),
          T([R2 * Math.cos(rad(th)), R2 * Math.sin(rad(th))], 'B′', { when: 'g', dx: 6, dy: -12, align: 'left' }),
          { k: 'dot', p: [r, 0], when: 'g' }, { k: 'dot', p: [ox, oy], when: 'g' },
          { k: 'ang', v: P(0, 0), d0: 0, d1: th, text: `${fn(th)}°`, when: 'g', r: 30 },
          T([r / 2, 0], `${fn(r)} cm`, { when: 'g', dy: 17, color: 'ink', size: 13, align: 'center' }),
          T([r * 1.5, 0], `${fn(r)} cm`, { when: 's', dy: 17, color: 'ink', size: 13 })
        ],
        handles: [{ id: 'B′', label: '점 B′ (돌린 각)', p: [R2 * Math.cos(rad(th)), R2 * Math.sin(rad(th))], drag: (w, c) => c.set('th', clamp(Math.round(Math.atan2(w.y, w.x) * 180 / PI / 15) * 15, 30, 150)) }],
        startStr: `반지름 ${fn(r)} cm 반원을 ${fn(th)}° 돌린 모양`, startShort: '돌린 반원이 겹친 모양', shapeStr: `반지름 ${fn(R2)} cm, 중심각 ${fn(th)}°`, shapeShort: '부채꼴',
        g: { start: `반지름 ${fn(r)} cm인 반원 O를 점 A를 중심으로 ${fn(th)}° 돌렸어요. 색칠한 곳은 (부채꼴)+(돌린 반원)−(처음 반원)`, piece: '돌린 반원(주황 윤곽)과 처음 반원(흰색)은 합동이에요', how: `점 A를 중심으로 ${fn(th)}° <b>제자리 회전</b>시켜 처음 반원 위에 겹치면`, shape: '부채꼴 AB′B와 넓이가 같은 모양', area: `π×${fn(R2)}²×${fn(th)}/360 = ${xs(resX)} cm²` },
        formulaLine: `$\\pi\\times${R2}^2\\times\\dfrac{${th}}{360}$`, eqTex: `\\pi\\times${R2}^2\\times\\dfrac{${th}}{360}=${xt(resX)}`, shapeTex: '\\text{반원 둘이 겹쳐 없어짐}', capRes: '부채꼴과 넓이가 같아요',
        steps: [
          `반원 O를 점 A를 중심으로 ${fn(th)}° 돌렸어요. 색칠한 부분 = (부채꼴 AB′B) + (돌린 반원) − (처음 반원)`,
          `돌린 반원과 처음 반원은 크기가 같은 합동이에요 (둘 다 반지름 ${fn(r)} cm)`,
          `돌린 반원을 점 A를 중심으로 ${fn(th)}° 되돌려 처음 반원에 겹쳐요 (제자리 회전). 더해진 반원과 빼진 반원이 서로 없어져요`,
          `색칠한 부분의 넓이 = 부채꼴 AB′B의 넓이 (반지름 ${fn(R2)} cm, 중심각 ${fn(th)}°) $=\\pi\\times${R2}^2\\times\\dfrac{${th}}{360}=${xt(resX)}$ (cm²)`
        ],
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>부채꼴의 반지름은 반원의 반지름이 아니라 <b>지름</b>(AB = 2r)이에요.</li><li>중심각은 반원을 돌린 각 θ예요.</li><li>돌린 반원과 처음 반원은 크기가 같아서, 더하고 빼면 서로 없어져요.</li></ul>'
      });
    },
    problem: {
      tag: '색칠한 부분의 넓이 (2) 도형의 넓이의 합, 차', unit: 'cm²',
      stem: (V) => `오른쪽 그림은 반지름의 길이가 ${V.r} cm인 반원 O를 점 A를 중심으로 ${V.th}°만큼 회전시킨 것이다. 이때 색칠한 부분의 넓이는?`,
      choices: (V) => ladder(X(0, Q(4 * V.r * V.r * V.th, 360)), X(0, 1), 4, (v) => v.p[0] > 0),
      hint: () => '돌린 반원과 처음 반원의 넓이가 같으니 색칠한 부분은 부채꼴과 같아요. 부채꼴의 반지름은 지름 AB예요.',
      std: (V, M) => `<b>해결 전략</b> 회전한 반원과 처음 반원의 넓이가 같으므로 색칠한 부분의 넓이는 부채꼴 AB′B의 넓이와 같다.<br>부채꼴의 반지름은 $${2 * V.r}$ cm, 중심각은 ${V.th}°이므로<br>(넓이) $=\\pi\\times${2 * V.r}^2\\times\\dfrac{${V.th}}{360}=${xt(M.resX)}$ (cm²)`,
      quick: (V, M) => `반원 둘은 없어짐 → 부채꼴 $\\pi\\times${2 * V.r}^2\\times\\dfrac{${V.th}}{360}=${xt(M.resX)}$`,
      warn: () => '부채꼴의 반지름을 반원의 반지름(r)으로 착각하지 마세요. 반지름은 지름 AB = 2r이에요.'
    }
  });

  /* ④ 반원 밀기 → 직사각형 */
  SPECS.push({
    id: 'slide', title: '파인 반원 · 붙은 반원 → 직사각형', short: '반원 밀기',
    question: '왼쪽이 반원만큼 파이고 오른쪽에 같은 반원이 붙어 있어요. 붙은 반원을 가로로 밀면 어떤 도형이 될까요?',
    phaseNames: ['처음 모양', '옮길 조각 찾기', '반원 밀기', '옮긴 뒤 모양', '직사각형 완성'],
    vars: [
      { k: 'W', sym: '가로', label: '직사각형의 가로 W', min: 6, max: 14, step: 1, value: 10 },
      { k: 'r', sym: 'r', label: '반원의 반지름 r', min: 2, max: 5, step: 1, value: 3 }
    ],
    pool: [{ W: 8, r: 2 }, { W: 12, r: 3 }, { W: 10, r: 4 }, { W: 9, r: 3 }, { W: 14, r: 5 }],
    model: (V) => {
      const W = V.W, r = V.r, H = 2 * r;
      const rect = rectP(0, 0, W, H), D = arcP(0, r, r, -90, 90), B = arcP(W, r, r, -90, 90);
      const resX = X(W * H);
      return move({
        shade0: [rect, D, B], pieces: [{ polys: [B], tf: { kind: 'slide', dx: -W }, dst: [D], items: [T([W + r * 0.5, r], '①', { when: 'hm', color: 'amber', size: 15 })] }],
        target: [rect], resX, pad: 0,
        base: [{ pts: rect, w: 2.4 }, { pts: D, w: 2.2 }, { pts: B, w: 2.2 }],
        fig: [
          T([W / 2, 0], `${fn(W)} cm`, { when: 'g', dy: 17 }),
          { k: 'seg', p: [0, r], q: [r, r], color: 'amber', dash: [5, 4], w: 1.8, when: 'g' }, T([r / 2, r], `${fn(r)}`, { when: 'g', dy: -12, color: 'amber' }),
          { k: 'dot', p: [0, r], when: 'g' }, { k: 'dot', p: [W, r], when: 'g' },
          T([W * 0.62, r], `${fn(W)} × ${fn(H)}`, { when: 'r', color: 'sky', size: 15 })
        ],
        startStr: `직사각형 ${fn(W)}×${fn(H)}에서 왼쪽 반원을 빼고 오른쪽에 반원을 붙인 모양`, startShort: '파인 곳과 붙은 곳이 있는 모양', shapeStr: `가로 ${fn(W)} cm, 세로 ${fn(H)} cm`, shapeShort: '직사각형',
        g: { start: `가로 ${fn(W)} cm, 세로 ${fn(H)} cm인 직사각형의 왼쪽을 반지름 ${fn(r)} cm 반원만큼 파내고, 오른쪽에 같은 반원을 붙인 모양`, piece: '오른쪽에 붙은 반원 ①', how: `왼쪽으로 ${fn(W)} cm <b>가로로 밀어</b>`, shape: '직사각형', area: `${fn(W)}×${fn(H)} = ${fn(W * H)} cm²` },
        formulaLine: `$${W}\\times${H}$`, eqTex: `${W}\\times${H}=${W * H}`, shapeTex: '\\text{직사각형}', capRes: '직사각형의 넓이',
        steps: [
          '색칠한 부분은 직사각형에서 왼쪽 반원을 파내고 오른쪽에 같은 반원을 붙인 모양이에요',
          `오른쪽에 붙은 반원 ①을 잘라요. 왼쪽에 파인 반원과 크기와 모양이 같아요 (반지름 ${fn(r)} cm)`,
          `반원 ①을 왼쪽으로 ${fn(W)} cm 가로로 밀어 파인 곳에 끼워요`,
          `색칠한 부분이 직사각형이 돼요 → $${W}\\times${H}=${W * H}$ (cm²)`
        ],
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>파인 반원과 붙은 반원은 <b>같은 크기</b>라서 넓이를 더하고 빼면 서로 없어져요.</li><li>그래서 반원의 넓이를 구하지 않고 <b>직사각형의 넓이 가로×세로</b>만 구하면 돼요.</li></ul>'
      });
    },
    problem: {
      tag: '일부분을 옮기는 경우 (반원 밀기)', unit: 'cm²', textbook: false,
      stem: (V) => `오른쪽 그림은 가로 ${V.W} cm, 세로 ${2 * V.r} cm인 직사각형의 왼쪽에서 반지름이 ${V.r} cm인 반원을 파내고, 오른쪽에 같은 반원을 붙인 것이다. 색칠한 부분의 넓이는?`,
      choices: (V) => { const A = X(2 * V.W * V.r), pi2 = X(0, Q(V.r * V.r, 2)); return ascending(A, [xsub(A, pi2), xadd(A, pi2), X(V.W * V.r), X(4 * V.W * V.r)], X(V.W)); },
      hint: () => '붙은 반원을 왼쪽으로 밀어 파인 곳에 끼우면 직사각형이 돼요.',
      std: (V) => `<b>해결 전략</b> 오른쪽의 반원을 왼쪽으로 ${V.W} cm 밀어 파인 곳에 끼우면 색칠한 부분은 직사각형이 된다.<br>(넓이) $=${V.W}\\times${2 * V.r}=${2 * V.W * V.r}$ (cm²)`,
      quick: (V) => `반원은 서로 없어짐 → $${V.W}\\times${2 * V.r}=${2 * V.W * V.r}$`
    }
  });

  /* ⑤ 사분원 밀기 → 직사각형 */
  SPECS.push({
    id: 'slideq', title: '파인 사분원 · 붙은 사분원 → 직사각형', short: '사분원 밀기',
    question: '왼쪽 위 모서리가 사분원만큼 파이고 오른쪽에 같은 사분원이 붙어 있어요. 붙은 사분원을 가로로 밀면 어떤 도형이 될까요?',
    phaseNames: ['처음 모양', '옮길 조각 찾기', '사분원 밀기', '옮긴 뒤 모양', '직사각형 완성'],
    vars: [
      { k: 'W', sym: '가로', label: '직사각형의 가로 W', min: 6, max: 14, step: 1, value: 10 },
      { k: 'H', sym: '세로', label: '직사각형의 세로 H', min: 4, max: 8, step: 1, value: 6 },
      { k: 'r', sym: 'r', label: '사분원의 반지름 r', hint: 'r은 세로 H보다 크면 안 돼요', min: 2, max: 6, step: 1, value: 4 }
    ],
    fix: (V) => { V.r = Math.min(V.r, V.H, V.W); },
    pool: [{ W: 8, H: 4, r: 3 }, { W: 12, H: 6, r: 4 }, { W: 10, H: 5, r: 4 }, { W: 9, H: 6, r: 6 }, { W: 14, H: 8, r: 6 }],
    model: (V) => {
      const W = V.W, H = V.H, r = V.r;
      const rect = rectP(0, 0, W, H), D = sectorP(0, H, r, 270, 360), B = sectorP(W, H, r, 270, 360);
      const resX = X(W * H);
      return move({
        shade0: [rect, D, B], pieces: [{ polys: [B], tf: { kind: 'slide', dx: -W }, dst: [D], items: [T([W + r * 0.35, H - r * 0.35], '①', { when: 'hm', color: 'amber', size: 15 })] }],
        target: [rect], resX, bbPolys: [rect, B],
        base: [{ pts: rect, w: 2.4 }, { pts: D, w: 2.2 }, { pts: B, w: 2.2 }],
        fig: [
          T([W / 2, 0], `${fn(W)} cm`, { when: 'g', dy: 17 }), T([0, H / 2], `${fn(H)} cm`, { when: 'g', dx: -8, align: 'right' }),
          { k: 'seg', p: [0, H], q: [r, H], color: 'amber', dash: [5, 4], w: 1.8, when: 'g' }, T([r / 2, H], `${fn(r)}`, { when: 'g', dy: -13, color: 'amber' }),
          { k: 'right', v: [0, H], p: [r, H], q: [0, H - r], when: 's', size: 11 },
          T([W * 0.55, H * 0.45], `${fn(W)} × ${fn(H)}`, { when: 'r', color: 'sky', size: 15 })
        ],
        startStr: `직사각형 ${fn(W)}×${fn(H)}에서 왼쪽 위 사분원을 빼고 오른쪽에 붙인 모양`, startShort: '파인 곳과 붙은 곳이 있는 모양', shapeStr: `가로 ${fn(W)} cm, 세로 ${fn(H)} cm`, shapeShort: '직사각형', margL: 44,
        g: { start: `가로 ${fn(W)} cm, 세로 ${fn(H)} cm인 직사각형의 왼쪽 위를 반지름 ${fn(r)} cm 사분원만큼 파내고, 오른쪽에 같은 사분원을 붙인 모양`, piece: '오른쪽에 붙은 사분원 ①', how: `왼쪽으로 ${fn(W)} cm <b>가로로 밀어</b>`, shape: '직사각형', area: `${fn(W)}×${fn(H)} = ${fn(W * H)} cm²` },
        formulaLine: `$${W}\\times${H}$`, eqTex: `${W}\\times${H}=${W * H}`, shapeTex: '\\text{직사각형}', capRes: '직사각형의 넓이',
        steps: [
          '색칠한 부분은 직사각형의 왼쪽 위를 사분원만큼 파내고 오른쪽에 같은 사분원을 붙인 모양이에요',
          `오른쪽에 붙은 사분원 ①을 잘라요. 파인 사분원과 크기·방향이 같아요 (반지름 ${fn(r)} cm, 중심각 90°)`,
          `사분원 ①을 왼쪽으로 ${fn(W)} cm 가로로 밀어 파인 곳에 끼워요`,
          `색칠한 부분이 직사각형이 돼요 → $${W}\\times${H}=${W * H}$ (cm²)`
        ],
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>파인 곳과 붙은 곳은 모양·크기·방향이 같아서 <b>가로로만 밀면</b> 꼭 맞아요.</li><li>사분원의 반지름 r이 얼마든 넓이는 $W\\times H$예요.</li></ul>'
      });
    },
    problem: {
      tag: '일부분을 옮기는 경우 (사분원 밀기)', unit: 'cm²', textbook: false,
      stem: (V) => `오른쪽 그림은 가로 ${V.W} cm, 세로 ${V.H} cm인 직사각형의 왼쪽 위에서 반지름이 ${V.r} cm인 사분원을 파내고, 오른쪽에 같은 사분원을 붙인 것이다. 색칠한 부분의 넓이는?`,
      choices: (V) => { const A = X(V.W * V.H), q = X(0, Q(V.r * V.r, 4)); return ascending(A, [xsub(A, q), xadd(A, q), X(Q(V.W * V.H, 2)), X(2 * V.W * V.H)], X(V.W)); },
      hint: () => '붙은 사분원을 왼쪽으로 밀어 파인 곳에 끼우면 직사각형이 돼요.',
      std: (V) => `<b>해결 전략</b> 오른쪽의 사분원을 왼쪽으로 ${V.W} cm 밀어 파인 곳에 끼우면 색칠한 부분은 직사각형이 된다.<br>(넓이) $=${V.W}\\times${V.H}=${V.W * V.H}$ (cm²)`,
      quick: (V) => `사분원은 서로 없어짐 → $${V.W}\\times${V.H}=${V.W * V.H}$`
    }
  });

  /* ⑥ 원 안의 S자(태극) → 반원 */
  SPECS.push({
    id: 'swirl', title: '원 안의 S자 곡선 → 반원', short: 'S자 곡선 → 반원',
    question: '큰 원의 지름 위에 같은 크기의 작은 반원 둘이 S자 곡선을 이뤄요. 작은 반원 하나를 큰 원의 중심을 기준으로 돌려 끼우면 어떤 도형이 될까요?',
    phaseNames: ['처음 모양', '옮길 조각 찾기', '반원 돌려 끼우기', '옮긴 뒤 모양', '반원 완성'],
    vars: [{ k: 'R', sym: 'R', label: '큰 원의 반지름 R', min: 4, max: 10, step: 2, value: 6 }],
    pool: [{ R: 4 }, { R: 8 }, { R: 10 }],
    model: (V) => {
      const R = V.R, h = R / 2;
      const UH = arcP(0, 0, R, 0, 180), SL = arcP(-h, 0, h, 0, 180), SR = arcP(h, 0, h, 180, 360);
      const resX = X(0, Q(R * R, 2));
      return move({
        shade0: [UH, SL, SR], pieces: [{ polys: [SR], tf: { kind: 'rot', c: [0, 0], ang: 180 }, dst: [SL], items: [T([h, -h * 0.55], '①', { when: 'hm', color: 'amber', size: 15 })] }],
        target: [UH], resX, bbPolys: [circleP(0, 0, R)],
        base: [{ pts: circleP(0, 0, R), w: 2.4 }, { pts: [P(-R, 0), P(R, 0)], close: false, w: 1.6, alpha: 0.7 }, { pts: SL, close: false, w: 2.4 }, { pts: SR, close: false, w: 2.4 }],
        fig: [
          { k: 'dot', p: [0, 0], when: 'g' },
          { k: 'seg', p: [0, 0], q: [0, R], color: 'ink', w: 1.8, dash: [5, 4], when: 'g' }, T([0, R * 0.7], `R=${fn(R)}`, { when: 'g', dx: 22, color: 'ink' }),
          T([-h, h * 0.5], `r=${fn(h)}`, { when: 's', color: 'amber' }),
          T([0, R * 0.55], `원의 반 : ${xs(resX)}`, { when: 'r', color: 'sky', size: 14, dy: 22 })
        ],
        startStr: '큰 반원에서 왼쪽 작은 반원을 빼고 오른쪽 아래에 작은 반원을 붙인 모양', startShort: 'S자 곡선이 있는 모양', shapeStr: `반지름 ${fn(R)} cm`, shapeShort: '큰 반원',
        g: { start: `반지름 ${fn(R)} cm인 원의 위쪽 반원에서 왼쪽 작은 반원(반지름 ${fn(h)} cm)을 파내고, 오른쪽 아래에 같은 작은 반원을 붙인 모양`, piece: '오른쪽 아래에 붙은 작은 반원 ①', how: '큰 원의 중심 O를 기준으로 180° <b>제자리 회전</b>시켜', shape: '큰 반원', area: `½×π×${fn(R)}² = ${xs(resX)} cm²` },
        formulaLine: `$\\dfrac12\\times\\pi\\times${R}^2$`, eqTex: `\\dfrac12\\times\\pi\\times${R}^2=${xt(resX)}`, shapeTex: '\\text{큰 반원}', capRes: '큰 반원의 넓이',
        steps: [
          '색칠한 부분은 큰 반원에서 왼쪽 작은 반원을 파내고 오른쪽 아래에 작은 반원을 붙인 S자 모양이에요',
          `오른쪽 아래의 작은 반원 ①을 잘라요. 왼쪽에 파인 작은 반원과 같은 크기예요 (반지름 ${fn(R / 2)} cm)`,
          '큰 원의 중심 O를 기준으로 180° 돌려(제자리 회전) 파인 곳에 끼워요',
          `색칠한 부분이 <b>큰 반원</b>이 돼요 → $\\dfrac12\\times\\pi\\times${R}^2=${xt(resX)}$ (cm²)`
        ],
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>S자 곡선은 작은 반원 둘로 이루어져요. 작은 반원의 크기가 같을 때만 이 방법이 통해요.</li><li>작은 반원의 넓이를 따로 구하지 않아도 돼요.</li></ul>'
      });
    },
    problem: {
      tag: '일부분을 옮기는 경우 (S자 곡선)', unit: 'cm²', textbook: false,
      stem: (V) => `오른쪽 그림은 반지름의 길이가 ${V.R} cm인 원의 지름 위에 반지름이 ${V.R / 2} cm인 반원 두 개를 그린 것이다. 색칠한 부분의 넓이는?`,
      choices: (V) => { const R2 = V.R * V.R; return ascending(X(0, Q(R2, 2)), [X(0, Q(R2, 4)), X(0, R2), X(0, Q(3 * R2, 4)), X(0, Q(3 * R2, 2))], X(0, Q(R2, 8))); },
      hint: () => '오른쪽 아래의 작은 반원을 큰 원의 중심을 기준으로 180° 돌려 파인 곳에 끼워 보세요.',
      std: (V, M) => `<b>해결 전략</b> 오른쪽 아래의 작은 반원을 큰 원의 중심을 기준으로 180° 돌려 왼쪽의 파인 곳에 끼우면 색칠한 부분은 큰 반원이 된다.<br>(넓이) $=\\dfrac12\\times\\pi\\times${V.R}^2=${xt(M.resX)}$ (cm²)`,
      quick: (V, M) => `큰 반원 → $\\dfrac12\\pi R^2=${xt(M.resX)}$`
    }
  });

  /* ⑦ 정사각형 속 원 → 정사각형의 절반 */
  SPECS.push({
    id: 'inscr', title: '정사각형 속 원 → 직사각형(정사각형의 절반)', short: '내접원 → 절반',
    question: '정사각형에 꼭 맞는 원이 있어요. 원의 오른쪽 반원을 돌려 왼쪽 빈 반원에 끼우면 색칠한 부분은 어떤 도형이 될까요?',
    phaseNames: ['처음 모양', '옮길 조각 찾기', '반원 돌려 끼우기', '옮긴 뒤 모양', '직사각형 완성'],
    vars: [{ k: 'r', sym: 'r', label: '원의 반지름 r', min: 2, max: 6, step: 1, value: 4 }],
    pool: [{ r: 3 }, { r: 5 }, { r: 6 }, { r: 2 }],
    model: (V) => {
      const r = V.r, s = 2 * r;
      const sq = rectP(0, 0, s, s), LHS = rectP(0, 0, r, s), LHD = arcP(r, r, r, 90, 270), RHD = arcP(r, r, r, -90, 90);
      const resX = X(2 * r * r);
      return move({
        shade0: [LHS, LHD, RHD], pieces: [{ polys: [RHD], tf: { kind: 'rot', c: [r, r], ang: 180 }, dst: [LHD], items: [T([r * 1.55, r], '①', { when: 'hm', color: 'amber', size: 15 })] }],
        target: [LHS], resX,
        base: [{ pts: sq, w: 2.4 }, { pts: circleP(r, r, r), w: 2.2 }, { pts: [P(r, 0), P(r, s)], close: false, w: 1.5, dash: [5, 4], alpha: 0.7 }],
        fig: [
          T([r, 0], `${fn(s)} cm`, { when: 'g', dy: 17 }), { k: 'dot', p: [r, r], when: 'g' },
          { k: 'seg', p: [r, r], q: [s, r], color: 'ink', w: 1.8, dash: [5, 4], when: 's' }, T([r * 1.5, r], `r=${fn(r)}`, { when: 's', dy: -12, color: 'ink' }),
          T([r * 0.5, r], `${fn(r)} × ${fn(s)}`, { when: 'r', color: 'sky', size: 14 })
        ],
        startStr: `한 변 ${fn(s)} cm인 정사각형 안의 모양`, startShort: '원 때문에 곡선이 섞인 모양', shapeStr: `가로 ${fn(r)} cm, 세로 ${fn(s)} cm (정사각형의 절반)`, shapeShort: '직사각형',
        g: { start: `한 변 ${fn(s)} cm인 정사각형에 꼭 맞는 원이 있어요. 색칠한 곳은 왼쪽 모서리 쪽(원 밖) 두 조각과 원의 오른쪽 반원`, piece: '원의 오른쪽 반원 ①', how: '원의 중심을 기준으로 180° <b>제자리 회전</b>시켜 왼쪽의 빈 반원 자리에', shape: '정사각형의 왼쪽 절반(직사각형)', area: `${fn(r)}×${fn(s)} = ${fn(2 * r * r)} cm²` },
        formulaLine: `$${r}\\times${s}$`, eqTex: `${r}\\times${s}=${2 * r * r}`, shapeTex: '\\text{직사각형}', capRes: '직사각형의 넓이',
        steps: [
          '색칠한 부분은 정사각형의 왼쪽 반에서 원 밖의 두 조각, 그리고 원의 오른쪽 반원이에요',
          `원의 오른쪽 반원 ①을 잘라요. 왼쪽의 빈 반원(흰색)과 크기가 같아요 (반지름 ${fn(r)} cm)`,
          '원의 중심을 기준으로 180° 돌려(제자리 회전) 왼쪽의 빈 반원 자리에 끼워요',
          `색칠한 부분이 정사각형의 <b>왼쪽 절반</b>이 돼요 → $${r}\\times${s}=${2 * r * r}$ (cm²)`
        ],
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>답에 π가 없어요. 원의 반원이 빈 반원 자리로 옮겨져서 원의 넓이를 구하지 않아도 돼요.</li><li>색칠한 부분의 넓이는 항상 정사각형의 $\\frac12$이에요.</li></ul>'
      });
    },
    problem: {
      tag: '일부분을 옮기는 경우 (정사각형 속 원)', unit: 'cm²', textbook: false,
      stem: (V) => `오른쪽 그림과 같이 한 변의 길이가 ${2 * V.r} cm인 정사각형에 원이 꼭 맞게 들어 있다. 색칠한 부분의 넓이는?`,
      choices: (V) => { const r2 = V.r * V.r; return ascending(X(2 * r2), [X(4 * r2, -r2), X(0, r2), X(4 * r2), X(0, 2 * r2)], X(r2)); },
      hint: () => '원의 오른쪽 반원을 중심을 기준으로 180° 돌려 왼쪽의 빈 반원 자리에 끼워 보세요.',
      std: (V) => `<b>해결 전략</b> 원의 오른쪽 반원을 원의 중심을 기준으로 180° 돌려 왼쪽의 빈 반원 자리에 끼우면 색칠한 부분은 정사각형의 왼쪽 절반이 된다.<br>(넓이) $=${V.r}\\times${2 * V.r}=${2 * V.r * V.r}$ (cm²)`,
      quick: (V) => `정사각형의 절반 → $${2 * V.r}^2\\div2=${2 * V.r * V.r}$`
    }
  });

  /* ⑧ 고리 조각 이동 → 부채꼴 */
  SPECS.push({
    id: 'ringmv', title: '부채꼴 고리의 조각 옮기기 → 부채꼴', short: '고리 조각 → 부채꼴',
    question: '작은 부채꼴과 고리 모양 조각의 중심각이 같아요. 작은 부채꼴을 돌려 고리의 빈 곳에 끼우면 어떤 도형이 될까요?',
    phaseNames: ['처음 모양', '옮길 조각 찾기', '부채꼴 돌려 끼우기', '옮긴 뒤 모양', '부채꼴 완성'],
    vars: [
      { k: 'R', sym: 'R', label: '큰 반지름 R', min: 4, max: 12, step: 2, value: 6 },
      { k: 'r', sym: 'r', label: '작은 반지름 r', hint: 'r이 바뀌어도 넓이는 변하지 않아요', min: 1, max: 11, step: 1, value: 3 },
      { k: 'th', sym: '중심각', label: '중심각', min: 30, max: 90, step: 15, value: 60, fmt: (v) => `중심각 ${fn(v)}°` }
    ],
    fix: (V) => { V.r = Math.min(V.r, V.R - 1); },
    pool: [{ R: 6, r: 2, th: 90 }, { R: 8, r: 4, th: 90 }, { R: 12, r: 6, th: 30 }, { R: 10, r: 5, th: 90 }, { R: 6, r: 4, th: 60 }],
    model: (V) => {
      const R = V.R, r = V.r, th = V.th;
      const inner = sectorP(0, 0, r, 90, 90 + th);
      const ringp = arcP(0, 0, R, 90 - th, 90).concat(arcP(0, 0, r, 90, 90 - th));
      const dst = sectorP(0, 0, r, 90 - th, 90), target = sectorP(0, 0, R, 90 - th, 90);
      const resX = X(0, Q(R * R * th, 360));
      const aR = rad(90 - th), nx = Math.cos(aR - PI / 2), ny = Math.sin(aR - PI / 2);
      return move({
        shade0: [inner, ringp], pieces: [{ polys: [inner], tf: { kind: 'rot', c: [0, 0], ang: -th }, dst: [dst], items: [T([r * 0.55 * Math.cos(rad(90 + th / 2)), r * 0.55 * Math.sin(rad(90 + th / 2))], '①', { when: 'hm', color: 'amber', size: 15 })] }],
        target: [target], resX, bbPolys: [sectorP(0, 0, R, 90 - th, 90), inner],
        base: [{ pts: inner, w: 2.2, fade: 1 }, { pts: ringp, w: 2.2, fade: 0.6 }, { pts: arcP(0, 0, r, 90 - th, 90), close: false, w: 1.6, dash: [5, 4], alpha: 0.7, fade: 1 }],
        fig: [
          { k: 'dot', p: [0, 0], when: 'g' },
          { k: 'ang', v: P(0, 0), d0: 90, d1: 90 + th, text: `${fn(th)}°`, when: 'b', r: Math.min(30, 20 + r * 1.5) },
          { k: 'ang', v: P(0, 0), d0: 90 - th, d1: 90, text: `${fn(th)}°`, when: 'g', r: Math.min(30, 20 + r * 1.5) },
          T([R * 0.8 * Math.cos(aR), R * 0.8 * Math.sin(aR)], `R=${fn(R)}`, { when: 'g', ...away(-nx, -ny, 24), align: 'center', color: 'ink' }),
          T([r * Math.cos(rad(90 + th)), r * Math.sin(rad(90 + th))], `r=${fn(r)}`, { when: 'b', ...away(-Math.cos(rad(th)), -Math.sin(rad(th)), 20), color: 'amber', align: 'right' }),
          T([R * 0.55 * Math.cos(rad(90 - th / 2)), R * 0.55 * Math.sin(rad(90 - th / 2))], `${xs(resX)}`, { when: 'r', color: 'sky', size: 15 })
        ],
        handles: [{ id: 'r', label: '작은 반지름 r', p: [0, r], drag: (w, c) => c.set('r', clamp(Math.round(Math.hypot(w.x, w.y)), 1, R - 1)) }],
        startStr: `작은 부채꼴(반지름 ${fn(r)})과 고리 조각(중심각 ${fn(th)}°)`, startShort: '조각 둘로 나뉜 모양', shapeStr: `반지름 ${fn(R)} cm, 중심각 ${fn(th)}°`, shapeShort: '큰 부채꼴', margL: 44,
        g: { start: `반지름 ${fn(r)} cm인 작은 부채꼴과, 반지름 ${fn(r)}~${fn(R)} cm 고리 모양 조각이 있어요(중심각은 둘 다 ${fn(th)}°)`, piece: '작은 부채꼴 ①', how: `중심 O를 기준으로 ${fn(th)}° <b>제자리 회전</b>시켜 고리 조각의 빈 곳에`, shape: `반지름 ${fn(R)} cm, 중심각 ${fn(th)}°인 부채꼴`, area: `π×${fn(R)}²×${fn(th)}/360 = ${xs(resX)} cm²` },
        formulaLine: `$\\pi\\times${R}^2\\times\\dfrac{${th}}{360}$`, eqTex: `\\pi\\times${R}^2\\times\\dfrac{${th}}{360}=${xt(resX)}`, shapeTex: '\\text{큰 부채꼴}', capRes: '큰 부채꼴의 넓이',
        steps: [
          `색칠한 부분은 작은 부채꼴(왼쪽)과 고리 모양 조각(오른쪽)이에요. 두 중심각은 같아요 (${th}°)`,
          '작은 부채꼴 ①을 잘라요. 고리 조각의 안쪽 빈 곳과 모양·크기가 같아요',
          `중심 O를 기준으로 ${th}° 돌려(제자리 회전) 고리 조각의 빈 곳에 끼워요`,
          `색칠한 부분이 반지름 ${R} cm, 중심각 ${th}°인 부채꼴이 돼요 → $\\pi\\times${R}^2\\times\\dfrac{${th}}{360}=${xt(resX)}$ (cm²). 작은 반지름은 필요 없어요`
        ],
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>작은 반지름 r이 얼마인지 몰라도 돼요. r 막대를 움직여도 넓이는 그대로예요.</li><li>두 조각의 <b>중심각이 같을 때만</b> 이렇게 합쳐져요.</li></ul>'
      });
    },
    problem: {
      tag: '일부분을 옮기는 경우 (부채꼴 고리)', unit: 'cm²', textbook: false,
      stem: (V) => `오른쪽 그림에서 두 부분의 중심각은 모두 ${V.th}°이고, 큰 부채꼴의 반지름은 ${V.R} cm, 작은 부채꼴의 반지름은 ${V.r} cm이다. 색칠한 부분의 넓이는?`,
      choices: (V) => {
        const A = X(0, Q(V.R * V.R * V.th, 360));
        return ascending(A, [X(0, Q(V.R * V.R * V.th, 720)), X(0, Q(V.R * V.R * V.th, 180)), X(0, V.R * V.R), X(0, Q((V.R * V.R + V.r * V.r) * V.th, 360))], X(0, Q(1, 2)));
      },
      hint: () => '작은 부채꼴을 돌려 고리 조각의 빈 곳에 끼우면 큰 부채꼴이 돼요. 반지름은 큰 쪽이에요.',
      std: (V, M) => `<b>해결 전략</b> 작은 부채꼴을 중심을 기준으로 ${V.th}° 돌려 고리 조각의 빈 곳에 끼우면 색칠한 부분은 반지름 ${V.R} cm, 중심각 ${V.th}°인 부채꼴이 된다.<br>(넓이) $=\\pi\\times${V.R}^2\\times\\dfrac{${V.th}}{360}=${xt(M.resX)}$ (cm²)`,
      quick: (V, M) => `큰 부채꼴 → $${xt(M.resX)}$`
    }
  });

  /* ---------- F04 장면 만들기 · 등록 ---------- */
  SPECS.forEach((sp) => { sp.layout = layoutMove; sp.render = renderMove; sp.chips = chipsMove; sp.stepStatus = ['처음 색칠한 모양', '옮길 조각 찾기', '조각 옮기기', '옮긴 뒤 도형의 넓이']; sp.tHint = '오른쪽으로 끌면 조각이 움직여 빈 곳에 들어가요'; });
  const GROUP_SCENES = SPECS.map(makeScene);
  GROUP_SCENES.forEach((sc) => {
    // 시험용(그림과 무관): 조각을 옮기기 전·후와 간단한 도형의 넓이를 표본으로 재어 식과 비교합니다.
    sc.csCheck = (s) => {
      const M = sc.csModel(s);
      const fillP = M.pieces.filter((p) => p.fill !== false);
      const src = [].concat(...fillP.map((p) => p.polys));
      const before = areaEO(M.shade0);
      const after = fillP.length === M.pieces.length ? areaEO(M.shade0.concat(src)) + fillP.reduce((x, p) => x + areaEO(p.dst), 0) : before;
      const dsts = [].concat(...fillP.map((p) => p.dst));
      const xor = fillP.length === M.pieces.length ? areaEO(M.shade0.concat(src, dsts, M.target)) : 0;
      return { before, after, target: areaEO(M.target), expected: xv(M.resX), xor };
    };
  });
  installStyle();
  installClicks();

  /* ---------- 등록 ---------- */
  (window.APL_CS_GROUPS = window.APL_CS_GROUPS || []).push({
    order: 64,
    id: 'f04',
    title: 'F04 잘라서 채우기',
    short: 'F04 잘라서 채우기',
    params: PARAMS,
    scenes: GROUP_SCENES
  });
})();
