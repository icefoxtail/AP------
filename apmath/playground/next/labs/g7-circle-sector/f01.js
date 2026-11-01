/* ==========================================================================
   중1 · 원과 부채꼴 — "F01 넣기·파내기" 탐구관 (f01.js, order 61)
   - 색칠한 부분 = 전체 − 파낸 부분. 전체 도형 → 파낼 부분(주황) → 가로로 꺼내기 → 남은 부분(파랑)의 넓이.
   - 모든 도형은 길이·각을 막대(또는 점)로 바꿀 수 있고, 그림 속 길이·각·식·정리 단계·문제 보기가 그대로 다시 계산됩니다.
   - 교과서 문제 그대로: 13번(정사각형 − 사분원 4개), 서술형 2(부채꼴 − 반원, 둘레와 넓이), 연습 2-1(잎 모양), 연습 2-2.
     이어서 같은 생각의 장면(고리 부채꼴·원 안의 작은 원, 반원 둘, 활꼴, 반원 − 직각삼각형)이 있습니다.
   - 움직임은 가로 이동뿐입니다(파낸 조각을 옆으로 꺼냄). 세로 이동은 없습니다.
   - 이 파일은 APL_CS_GROUPS 에 묶음 하나를 등록할 뿐, 다른 전역은 만들지 않습니다.
     동작 변수(f1_*)는 쪽이 params 를 합쳐 주지 않아도 장면에 들어올 때 스스로 등록합니다.
   ========================================================================== */
(function () {
  'use strict';
  const PFX = 'f1';
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
     F01 · 넣기·파내기 : 색칠한 부분 = 전체 − 파낸 부분
     ① 전체 도형 → ② 파낼 부분(주황) 찾기 → ③ 파낸 부분을 가로로 꺼내기 → ④ 남은 부분(파랑)의 넓이
     ====================================================================== */
  const GAPK = 1.3;                         // 꺼낸 자리까지의 가로 거리(도형 너비의 배수)
  const cm2 = (x) => xs(x) + ' cm²';
  const guide4 = (tx, eq) => [
    `먼저 <b>전체</b> 도형이에요: ${tx.whole}. ▶ 재생을 누르거나 <b>‘움직여 보기’</b> 막대를 오른쪽으로 끌어 보세요.`,
    `<b>파낸 부분</b>(주황색)은 ${tx.part}이에요. 남은 파란 부분이 <b>색칠한 부분</b>이에요.`,
    `파낸 부분을 <b>옆으로 꺼냈어요.</b> 파란 부분 = 전체 − 파낸 부분이에요.`,
    `색칠한 부분의 넓이 = (전체) − (파낸 부분) = <b>${eq}</b>`
  ];
  const T = (p, text, o = {}) => Object.assign({ k: 'text', p, text, when: 's' }, o);
  const TICK = (p, q, o = {}) => Object.assign({ k: 'ticks', p, q, when: 'g' }, o);
  /** 방향 (nx,ny)(수학 좌표) 쪽으로 화면 픽셀만큼 밀어 놓는 글자 옵션 */
  const away = (nx, ny, L = 18) => ({ dx: nx * L, dy: -ny * L, align: nx > 0.4 ? 'left' : nx < -0.4 ? 'right' : 'center' });
  const rem = (o) => {
    const bb = bboxOf([o.outer].concat(o.ctx || []));
    const st = Object.assign({ whole: cm2(o.wholeX), part: cm2(o.partX), res: cm2(o.resX) }, o.str || {});
    const d = {
      readouts: [
        { label: o.cap.whole.l, value: st.whole, color: 'ink' },
        { label: o.cap.part.l, value: st.part, color: 'amber' },
        { label: '색칠한 부분', value: st.res, color: 'sky', wide: true, note: `≈ ${fn(xv(o.resX))} cm²` }
      ],
      guide: guide4(o.tx, st.res),
      formula: `<p><b>색칠한 부분</b> = (전체) − (파낸 부분)</p><p>= ${xs(o.wholeX)} − ${xsp(o.partX)} = <b>${xs(o.resX)}</b> (cm²)</p>`,
      rule: '(색칠한 부분의 넓이) = (전체의 넓이) − (파낸 부분의 넓이)',
      chipTex: { whole: o.wholeTex, part: o.partTex, eq: (() => { const l = `${xt(o.wholeX)}-${xtp(o.partX)}`; return l === xt(o.resX) ? l : `${l}=${xt(o.resX)}`; })() }
    };
    return Object.assign({ ctx: [], over: [], fig: [], part: [], edges: null, handles: null, notes: '' }, d, o, {
      box: [bb.x0, bb.y0, bb.x1, bb.y1],
      cap: Object.assign({}, o.cap, { res: (o.cap && o.cap.res) || { l: '색칠한 부분의 넓이', v: st.res } })
    });
  };
  const sub = (a, b, r) => `: $${xt(a)}-${xtp(b)}=${xt(r)}$`;

  function layoutRem(c) {
    const [x0, y0, x1, y1] = c.M.box;
    const tray = !c.problem && !c.mode;
    return { bb: { x0, y0, x1: tray ? x1 + (x1 - x0) * GAPK : x1, y1 }, marg: { l: 22, r: 22, t: 18, b: c.problem ? 40 : 94 } };
  }
  const whenA = (c, w) => (w === 'h' ? seg01(c.hi, 0.4, 1) : w === 'm' ? seg01(c.mv, 0.5, 1) : w === 'r' ? seg01(c.res, 0.2, 0.8) : 1);

  function renderRem(b, c) {
    const M = c.M, [x0, y0, x1, y1] = M.box, w = x1 - x0, dx = w * GAPK, cx = (x0 + x1) / 2;
    const flat = [].concat(...M.cuts.map((g) => g.polys));
    const remPolys = [M.outer].concat(flat);
    const drawCtx = (off, al) => M.ctx.forEach((p) => outline(b, shiftP(p, off), 'ink', 1.6, { alpha: al }));
    const { hi, mv, res } = c;
    if (c.problem) {
      fillEO(b, remPolys, 'sky', 0.5);
      outline(b, M.outer, 'ink', 2.6);
      flat.forEach((p) => outline(b, p, 'ink', 2.4));
      drawCtx(0, 0.9);
      M.fig.forEach((it) => { if (it.when === 'g') drawItem(b, it, 0, 1); });
      return;
    }
    if (c.mode) { renderPeri(b, c); return; }
    const ox = dx * mv;
    if (mv > 0.01) { outline(b, shiftP(M.outer, dx), 'muted', 1.8, { dash: [6, 5], alpha: 0.75 * mv }); drawCtx(dx, 0.45 * mv); }
    fillEO(b, [M.outer], 'ink', 0.1 * (1 - hi));
    fillEO(b, remPolys, 'sky', 0.44 * hi + 0.16 * res);
    M.cuts.forEach((g) => fillEO(b, g.polys.map((p) => shiftP(p, ox)), 'amber', 0.6 * hi));
    M.over.forEach((o) => {
      const a = hi * (1 - mv);
      fillEO(b, o.polys, o.color, (o.alpha || 0.2) * 0.55 * a);
      o.polys.forEach((p) => outline(b, p, o.color, 1.8, { alpha: 0.85 * a, dash: [5, 4] }));
    });
    outline(b, M.outer, 'ink', 2.6);
    drawCtx(0, 0.9);
    if (mv > 0.02) flat.forEach((p) => outline(b, p, 'amber', 2, { dash: [6, 4], alpha: 0.9 * hi }));
    M.cuts.forEach((g) => g.polys.forEach((p) => outline(b, shiftP(p, ox), 'amber', 2.4, { alpha: hi })));
    M.fig.forEach((it) => drawItem(b, it, 0, whenA(c, it.when)));
    M.part.forEach((it) => drawItem(b, it, ox, whenA(c, it.when)));
    const cp = M.cap;
    caption(b, cx, y0, cp.whole.l, cp.whole.v, 'ink', 1 - seg01(res, 0, 0.5));
    caption(b, cx, y0, cp.res.l, cp.res.v, 'sky', seg01(res, 0.5, 1));
    caption(b, cx + dx, y0, cp.part.l, cp.part.v, 'amber', seg01(mv, 0.6, 1));
    if (M.handles) M.handles.forEach((h) => b.handle(h.id, P(h.p[0], h.p[1]), { color: 'amber', ariaLabel: h.label, drag: (wp) => h.drag(wp, c) }));
  }
  function renderPeri(b, c) {
    const M = c.M, [x0, y0, x1] = M.box, cx = (x0 + x1) / 2;
    const flat = [].concat(...M.cuts.map((g) => g.polys));
    fillEO(b, [M.outer].concat(flat), 'sky', 0.2);
    outline(b, M.outer, 'ink', 1.6, { alpha: 0.5 });
    flat.forEach((p) => outline(b, p, 'ink', 1.4, { alpha: 0.5 }));
    M.ctx.forEach((p) => outline(b, p, 'ink', 1.5, { alpha: 0.7 }));
    const n = c.review ? Math.max(1, c.step) : 99;
    M.edges.forEach((e) => {
      if (e.step > n) return;
      const cur = c.review && e.step === n;
      b.path(e.pts, { color: e.color, width: cur ? 6.5 : 5, alpha: cur || !c.review ? 1 : 0.7, glow: cur });
      if (e.lstep <= n) b.text(P(e.at[0], e.at[1]), e.text, { color: e.color, size: 15, weight: 800, baseline: 'middle', dx: e.dx || 0, dy: e.dy || 0, align: e.align || 'center' });
    });
    M.fig.forEach((it) => { if (it.when === 'g') drawItem(b, it, 0, 1); });
    const done = !c.review || n >= M.stepsP.length;
    caption(b, cx, y0, '색칠한 부분의 둘레', done ? M.periV + ' cm' : '…', 'sky', 1);
  }

  /* ---------- 장면 정의 ---------- */
  const SPECS = [];

  /* ① 13번 : 정사각형 − 사분원 4개 */
  SPECS.push({
    id: 'star', title: '정사각형에서 사분원 4개 파내기', short: '사분원 4개 (13번)',
    question: '정사각형의 네 모서리에서 사분원을 파내면 별 모양이 남아요. 파낸 사분원 4개를 모으면 어떤 도형일까요?',
    vars: [{ k: 'a', sym: 'a', label: '정사각형의 한 변 a', min: 6, max: 16, step: 2, value: 10 }],
    pool: [{ a: 6 }, { a: 8 }, { a: 12 }, { a: 14 }, { a: 16 }],
    model: (V) => {
      const a = V.a, r = a / 2;
      const outer = rectP(0, 0, a, a);
      const cuts = [sectorP(0, 0, r, 0, 90), sectorP(a, 0, r, 90, 180), sectorP(a, a, r, 180, 270), sectorP(0, a, r, 270, 360)].map((p) => ({ polys: [p] }));
      const wholeX = X(a * a), partX = X(0, r * r), resX = X(a * a, -r * r);
      const arcX = X(0, Q(r, 2));
      const fig = [
        T([a / 2, 0], `${fn(a)} cm`, { when: 'g', dy: 17 }),
        TICK([0, 0], [r, 0]), TICK([r, 0], [a, 0]), TICK([0, a], [r, a]), TICK([r, a], [a, a]),
        TICK([0, 0], [0, r]), TICK([0, r], [0, a]), TICK([a, 0], [a, r]), TICK([a, r], [a, a]),
        T([r / 2, 0], `r=${fn(r)}`, { dy: -13, color: 'ink' })
      ];
      const part = [T([a / 2, a / 2], '사분원 4개', { when: 'm', color: 'amber', size: 13.5, dy: -10 }), T([a / 2, a / 2], '= 원 1개', { when: 'm', color: 'amber', size: 13.5, dy: 10 })];
      const edges = [
        { pts: arcP(0, 0, r, 0, 90), at: [r * 0.707, r * 0.707], ...away(0.7, 0.7, 15), text: xs(arcX), color: 'sky', step: 1, lstep: 2 },
        { pts: arcP(a, 0, r, 90, 180), at: [a - r * 0.707, r * 0.707], ...away(-0.7, 0.7, 15), text: xs(arcX), color: 'sky', step: 1, lstep: 2 },
        { pts: arcP(a, a, r, 180, 270), at: [a - r * 0.707, a - r * 0.707], ...away(-0.7, -0.7, 15), text: xs(arcX), color: 'sky', step: 1, lstep: 2 },
        { pts: arcP(0, a, r, 270, 360), at: [r * 0.707, a - r * 0.707], ...away(0.7, -0.7, 15), text: xs(arcX), color: 'sky', step: 1, lstep: 2 }
      ];
      const periX = X(0, 2 * r);
      return rem({
        outer, cuts, fig, part, edges, wholeX, partX, resX, periV: xs(periX),
        tx: { whole: `한 변이 ${fn(a)} cm인 정사각형(넓이 ${a * a} cm²)`, part: `네 꼭짓점이 중심인 반지름 ${fn(r)} cm 사분원 4개(모으면 원 1개)` },
        cap: { whole: { l: '전체 (정사각형)', v: cm2(wholeX) }, part: { l: '파낸 부분 (원 1개)', v: cm2(partX) } },
        wholeTex: `${a}\\times${a}=${a * a}`, partTex: `\\pi\\times${r}^2=${xt(partX)}`,
        steps: [
          `정사각형의 넓이는 $${a}\\times${a}=${a * a}$ (cm²)`,
          `파낸 부분은 반지름이 ${fn(r)} cm인 사분원 4개예요. 4개를 모으면 반지름 ${fn(r)} cm인 원 1개가 돼요`,
          `파낸 부분의 넓이는 원 1개의 넓이와 같아요: $\\pi\\times${r}^2=${xt(partX)}$ (cm²)`,
          `색칠한 부분 = 정사각형 − 원 ${sub(wholeX, partX, resX)} (cm²)`
        ],
        stepsP: [
          '색칠한 부분의 둘레는 어디일까요? 사분원의 호 4개로 이루어져 있어요.',
          `호 하나의 길이: $2\\pi\\times${r}\\times\\dfrac14=${xt(arcX)}$ (cm)`,
          `둘레 $=4\\times${xtp(arcX)}=${xt(periX)}$ (cm). 원의 둘레 $2\\pi\\times${r}$와 같아요`
        ],
        guideP: ['색칠한 부분의 둘레는 사분원의 <b>호 4개</b>예요.', '호 하나는 원의 둘레의 $\\frac14$이에요.', '호 4개를 모으면 원의 둘레 2πr와 같아요.'],
        periEq: `4\\times${xtp(arcX)}=${xt(periX)}`,
        formulaP: `<p><b>둘레</b> = 사분원의 호 4개 = 원의 둘레</p><p>= 2π×${r} = <b>${xs(periX)}</b> (cm)</p>`, ruleP: '(색칠한 부분의 둘레) = 사분원의 호 4개 = 원 1개의 둘레',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>사분원 <b>하나</b>만 빼면 안 돼요. 모서리가 4개이니 사분원도 <b>4개</b>예요.</li><li>사분원 4개를 모으면 <b>원 1개</b>이므로 넓이는 πr²이에요.</li></ul>'
      });
    },
    problem: {
      tag: '색칠한 부분의 넓이 (1) 색칠하지 않은 부분의 넓이를 빼는 경우', unit: 'cm²',
      stem: () => '오른쪽 그림에서 색칠한 부분의 넓이는?',
      choices: (V) => { const c = V.a * V.a / 4, st = Math.max(1, Math.round(c / 5)); return ladder(X(V.a * V.a, -c), X(0, st), 0, (v) => v.p[0] < 0); },
      hint: () => '정사각형의 넓이에서 사분원 4개(원 1개)의 넓이를 빼요.',
      std: (V, M) => `<b>해결 전략</b> 색칠하지 않은 부분의 넓이를 전체에서 뺀다.<br>정사각형의 넓이: $${V.a}\\times${V.a}=${V.a * V.a}$<br>사분원 4개의 넓이의 합 = 원 1개: $\\pi\\times${V.a / 2}^2=${xt(M.partX)}$<br>따라서 색칠한 부분의 넓이는 $${xt(M.resX)}$ (cm²)`,
      quick: (V, M) => `① 사분원 4개 = 원 1개 (반지름 ${V.a / 2})<br>② $${V.a}^2-\\pi\\times${V.a / 2}^2=${xt(M.resX)}$`,
      warn: () => '사분원 하나만 빼거나, 사분원 4개를 각각 원으로 계산하면 틀려요. 4개를 합쳐 원 1개예요.'
    }
  });

  /* ② 서술형 2 : 부채꼴 − 반원 (둘레와 넓이) */
  SPECS.push({
    id: 'ss2', title: '부채꼴에서 반원 파내기 (서술형 2)', short: '부채꼴−반원 (서술형 2)',
    question: '정사각형 안의 부채꼴에서 한 변을 지름으로 하는 반원을 파냈어요. 색칠한 부분의 둘레와 넓이는 얼마일까요?',
    vars: [{ k: 'a', sym: 'a', label: '정사각형의 한 변 a', min: 4, max: 12, step: 2, value: 6 }],
    pool: [{ a: 4 }, { a: 8 }, { a: 10 }, { a: 12 }],
    model: (V) => {
      const a = V.a, h = a / 2;
      const outer = sectorP(a, a, a, 180, 270);
      const S = arcP(a, h, h, 90, 270);
      const wholeX = X(0, Q(a * a, 4)), partX = X(0, Q(a * a, 8)), resX = X(0, Q(a * a, 8));
      const arcQ = X(0, Q(a, 2)), periX = X(a, a);
      const fig = [
        T([a / 2, 0], `${fn(a)} cm`, { when: 'g', dy: 17 }),
        { k: 'dot', p: [a, h], when: 'g' },
        { k: 'right', v: [a, a], p: [0, a], q: [a, 0], when: 's' },
        T([a * 0.32, a], `${fn(a)}`, { dy: 15, color: 'ink' }),
        { k: 'seg', p: [a, h], q: [h, h], color: 'amber', dash: [5, 4], w: 1.8, when: 's' },
        T([a * 0.72, h], `${fn(h)}`, { dy: -12, color: 'amber' })
      ];
      const edges = [
        { pts: S, at: [h, h], ...away(-1, 0, 20), text: xs(arcQ), color: 'violet', step: 1, lstep: 1 },
        { pts: arcP(a, a, a, 180, 270), at: [a - a * 0.707, a - a * 0.707], ...away(-0.7, -0.7, 16), text: xs(arcQ), color: 'sky', step: 2, lstep: 2 },
        { pts: [P(0, a), P(a, a)], at: [a * 0.5, a], dx: 0, dy: 16, text: fn(a), color: 'rose', step: 3, lstep: 3 }
      ];
      return rem({
        outer, cuts: [{ polys: [S] }], ctx: [rectP(0, 0, a, a)], fig, part: [], edges, wholeX, partX, resX, periV: xs(periX),
        tx: { whole: `반지름 ${fn(a)} cm, 중심각 90°인 부채꼴`, part: `정사각형의 한 변을 지름으로 하는 반원(반지름 ${fn(h)} cm)` },
        cap: { whole: { l: '전체 (부채꼴)', v: cm2(wholeX) }, part: { l: '파낸 부분 (반원)', v: cm2(partX) } },
        wholeTex: `\\pi\\times${a}^2\\times\\dfrac{90}{360}=${xt(wholeX)}`, partTex: `\\pi\\times${fn(h)}^2\\times\\dfrac12=${xt(partX)}`,
        steps: [
          `부채꼴의 넓이: $\\pi\\times${a}^2\\times\\dfrac{90}{360}=${xt(wholeX)}$ (cm²)`,
          `파낼 부분은 한 변을 지름으로 하는 반원이에요 (반지름 ${fn(h)} cm)`,
          `반원의 넓이: $\\pi\\times${fn(h)}^2\\times\\dfrac12=${xt(partX)}$ (cm²)`,
          `색칠한 부분 = 부채꼴 − 반원 ${sub(wholeX, partX, resX)} (cm²)`
        ],
        stepsP: [
          `반원의 호: $2\\pi\\times${fn(h)}\\times\\dfrac12=${xt(arcQ)}$ (cm)`,
          `부채꼴의 호: $2\\pi\\times${a}\\times\\dfrac{90}{360}=${xt(arcQ)}$ (cm)`,
          `정사각형의 한 변: $${a}$ (cm)`,
          `둘레 $=${xt(arcQ)}+${xt(arcQ)}+${a}=${xt(periX)}$ (cm)`
        ],
        guideP: ['<b>반원의 호</b>(보라색)부터 길이를 구해요.', '<b>부채꼴의 호</b>(파란색)예요. 중심각이 90°이니 원의 둘레의 $\\frac14$이에요.', '<b>정사각형의 한 변</b>(분홍색)도 둘레에 들어가요.', '세 부분을 모두 더하면 둘레예요.'],
        periEq: `${xt(arcQ)}+${xt(arcQ)}+${a}=${xt(periX)}`,
        formulaP: `<p><b>둘레</b> = (반원의 호) + (부채꼴의 호) + (정사각형의 한 변)</p><p>= ${xs(arcQ)} + ${xs(arcQ)} + ${a} = <b>${xs(periX)}</b> (cm)</p>`, ruleP: '(둘레) = (반원의 호) + (부채꼴의 호) + (정사각형의 한 변)',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>둘레에는 반원의 <b>지름</b>(정사각형의 오른쪽 변)이 들어가지 않아요. 호만 들어가요.</li><li>색칠한 부분의 넓이와 파낸 반원의 넓이가 같아요(둘 다 $\\frac{πa^2}{8}$).</li></ul>'
      });
    },
    problem: {
      tag: '색칠하지 않은 부분의 넓이를 빼서 넓이를 구하는 경우 · 서술형 2 [6점]', unit: 'cm²',
      stem: (V) => `오른쪽 그림과 같이 한 변의 길이가 ${V.a} cm인 정사각형에서 색칠한 부분의 둘레의 길이와 넓이를 각각 구하고, 그 과정을 서술하시오. [6점]`,
      answer: (V) => { const a = V.a; return `둘레 $${xt(X(a, a))}$ cm, 넓이 $${xt(X(0, Q(a * a, 8)))}$ cm²`; },
      std: (V, M) => {
        const a = V.a, h = a / 2, arcQ = X(0, Q(a, 2));
        return `<b>모범답안</b><br>❶ (색칠한 부분의 둘레의 길이)<br>=(반원의 호의 길이)+(부채꼴의 호의 길이)+(정사각형의 한 변의 길이)<br>$=2\\pi\\times${fn(h)}\\times\\dfrac12+2\\pi\\times${a}\\times\\dfrac{90}{360}+${a}$<br>$=${xt(arcQ)}+${xt(arcQ)}+${a}=${xt(X(a, a))}$ (cm) [3점]<br>`
          + `❷ (색칠한 부분의 넓이)=(부채꼴의 넓이)−(반원의 넓이)<br>$=\\pi\\times${a}^2\\times\\dfrac{90}{360}-\\pi\\times${fn(h)}^2\\times\\dfrac12$<br>$=${xt(M.wholeX)}-${xt(M.partX)}=${xt(M.resX)}$ (cm²) [3점]`;
      },
      quick: (V, M) => `둘레: 호 두 개와 변 하나 → $${xt(X(V.a, V.a))}$<br>넓이: 부채꼴 − 반원 → $${xt(M.resX)}$`,
      warn: () => '둘레를 구할 때 반원의 지름을 더하지 않도록 조심하세요. 지름은 정사각형의 변 위에 있어 둘레가 아니에요.'
    }
  });

  /* ③ 연습 2-1 : 정사각형 − 잎 모양 */
  SPECS.push({
    id: 'lens', title: '정사각형에서 잎 모양 파내기 (연습 2-1)', short: '잎 모양 (연습 2-1)',
    question: '마주 보는 두 꼭짓점을 중심으로 사분원을 그리면 가운데에 잎 모양이 생겨요. 잎 모양을 파내면 얼마가 남을까요?',
    vars: [{ k: 'a', sym: 'a', label: '정사각형의 한 변 a', min: 4, max: 12, step: 2, value: 8 }],
    pool: [{ a: 4 }, { a: 6 }, { a: 10 }, { a: 12 }],
    model: (V) => {
      const a = V.a;
      const outer = rectP(0, 0, a, a);
      const arc1 = arcP(a, 0, a, 180, 90), arc2 = arcP(0, a, a, 0, -90);
      const lens = arc1.concat(arc2.slice(1));
      const wholeX = X(a * a), partX = X(-a * a, Q(a * a, 2)), resX = X(2 * a * a, Q(-a * a, 2));
      const c45 = Math.SQRT1_2;
      const fig = [
        T([a / 2, 0], `${fn(a)} cm`, { when: 'g', dy: 17 }),
        { k: 'seg', p: [a, 0], q: [a - a * c45, a * c45], color: 'violet', dash: [5, 4], w: 1.8, when: 's' },
        T([a - a * c45 * 0.55, a * c45 * 0.55], `${fn(a)}`, { dx: 12, dy: -6, color: 'violet' })
      ];
      return rem({
        outer, cuts: [{ polys: [lens] }], fig, part: [T([a / 2, a / 2], '잎 모양', { when: 'm', color: 'amber', size: 14 })],
        over: [{ polys: [sectorP(a, 0, a, 90, 180)], color: 'violet', alpha: 0.2 }, { polys: [sectorP(0, a, a, 270, 360)], color: 'green', alpha: 0.2 }],
        wholeX, partX, resX,
        tx: { whole: `한 변이 ${fn(a)} cm인 정사각형(넓이 ${a * a} cm²)`, part: '마주 보는 두 꼭짓점을 중심으로 한 사분원이 겹친 잎 모양' },
        cap: { whole: { l: '전체 (정사각형)', v: cm2(wholeX) }, part: { l: '파낸 부분 (잎 모양)', v: cm2(partX) } },
        wholeTex: `${a}\\times${a}=${a * a}`, partTex: `2\\times\\left(\\pi\\times${a}^2\\times\\dfrac14\\right)-${a * a}=${xt(partX)}`,
        steps: [
          `정사각형의 넓이: $${a}\\times${a}=${a * a}$ (cm²)`,
          '파낼 부분은 두 사분원이 겹친 잎 모양이에요. 사분원 2개로 정사각형을 덮으면 잎 모양이 두 번 덮여요',
          `잎 모양 = 사분원 2개 − 정사각형 $=2\\times\\left(\\pi\\times${a}^2\\times\\dfrac14\\right)-${a * a}=${xt(partX)}$ (cm²)`,
          `색칠한 부분 = 정사각형 − 잎 모양 $=${a * a}-${xtp(partX)}=${xt(resX)}$ (cm²)`
        ],
        guide: guide4({ whole: `한 변이 ${fn(a)} cm인 정사각형`, part: '두 사분원이 겹친 잎 모양' }, xs(resX) + ' cm²'),
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>잎 모양의 넓이는 바로 구할 수 없어요. <b>사분원 2개 − 정사각형</b>으로 구해요.</li><li>색칠한 두 모서리 조각은 서로 합동이에요. 한 조각은 $a^2-\\frac{πa^2}{4}$이에요.</li></ul>'
      });
    },
    problem: {
      tag: '색칠하지 않은 부분의 넓이를 빼서 넓이를 구하는 경우 · 연습 2-1 [6점]', unit: 'cm²',
      stem: (V) => `오른쪽 그림과 같이 한 변의 길이가 ${V.a} cm인 정사각형에서 색칠한 부분의 넓이를 구하고, 그 과정을 서술하시오. [6점]`,
      answer: (V) => `$${xt(X(2 * V.a * V.a, Q(-V.a * V.a, 2)))}$ cm²`,
      std: (V, M) => `<b>풀이</b><br>(잎 모양의 넓이)=(사분원 2개의 넓이)−(정사각형의 넓이)<br>$=2\\times\\left(\\pi\\times${V.a}^2\\times\\dfrac14\\right)-${V.a * V.a}=${xt(M.partX)}$ (cm²)<br>(색칠한 부분의 넓이)=(정사각형의 넓이)−(잎 모양의 넓이)<br>$=${V.a * V.a}-${xtp(M.partX)}=${xt(M.resX)}$ (cm²)`,
      quick: (V, M) => `잎 모양 $=2\\times\\frac{\\pi a^2}{4}-a^2$ → 색칠 $=2a^2-\\frac{\\pi a^2}{2}=${xt(M.resX)}$`
    }
  });

  /* ④ 연습 2-2 : 정사각형 − (사분원 − 반원) */
  SPECS.push({
    id: 'ex22', title: '정사각형에서 사분원과 반원 사이 파내기 (연습 2-2)', short: '사분원·반원 (연습 2-2)',
    question: '정사각형에서 사분원 안쪽 중 반원이 아닌 흰 부분을 파냈어요. 색칠한 부분은 얼마일까요?',
    vars: [{ k: 'a', sym: 'a', label: '정사각형의 한 변 a', min: 4, max: 12, step: 2, value: 4 }],
    pool: [{ a: 6 }, { a: 8 }, { a: 10 }, { a: 12 }],
    model: (V) => {
      const a = V.a, h = a / 2;
      const outer = rectP(0, 0, a, a);
      const Qd = sectorP(a, 0, a, 90, 180), S = arcP(a, h, h, 90, 270);
      const wholeX = X(a * a), partX = X(0, Q(a * a, 8)), resX = X(a * a, Q(-a * a, 8));
      const fig = [
        T([a / 2, 0], `${fn(a)} cm`, { when: 'g', dy: 17 }),
        { k: 'dot', p: [a, h], when: 'g' },
        { k: 'right', v: [a, 0], p: [a, a], q: [0, 0], when: 's' },
        T([a * 0.4, 0], `${fn(a)}`, { dy: -13, color: 'ink' }),
        { k: 'seg', p: [a, h], q: [h, h], color: 'amber', dash: [5, 4], w: 1.8, when: 's' },
        T([a * 0.72, h], `${fn(h)}`, { dy: -12, color: 'amber' })
      ];
      return rem({
        outer, cuts: [{ polys: [Qd, S] }], fig, part: [], wholeX, partX, resX,
        tx: { whole: `한 변이 ${fn(a)} cm인 정사각형(넓이 ${a * a} cm²)`, part: '사분원에서 반원을 뺀 흰 부분(서술형 2의 색칠한 모양과 같아요)' },
        cap: { whole: { l: '전체 (정사각형)', v: cm2(wholeX) }, part: { l: '파낸 부분 (사분원−반원)', v: cm2(partX) } },
        wholeTex: `${a}\\times${a}=${a * a}`, partTex: `\\pi\\times${a}^2\\times\\dfrac14-\\pi\\times${fn(h)}^2\\times\\dfrac12=${xt(partX)}`,
        steps: [
          `정사각형의 넓이: $${a}\\times${a}=${a * a}$ (cm²)`,
          '파낼 흰 부분은 (사분원) − (반원)이에요. 서술형 2에서 색칠했던 모양과 같아요',
          `사분원 $\\pi\\times${a}^2\\times\\dfrac14=${xt(X(0, Q(a * a, 4)))}$, 반원 $\\pi\\times${fn(h)}^2\\times\\dfrac12=${xt(X(0, Q(a * a, 8)))}$ → 흰 부분 $=${xt(partX)}$ (cm²)`,
          `색칠한 부분 = 정사각형 − 흰 부분 ${sub(wholeX, partX, resX)} (cm²)`
        ],
        guide: guide4({ whole: `한 변이 ${fn(a)} cm인 정사각형`, part: '사분원에서 반원을 뺀 흰 부분' }, xs(resX) + ' cm²'),
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>색칠한 부분은 두 조각(사분원 밖 + 반원)이지만, <b>흰 부분을 파내는</b> 한 번의 뺄셈으로 구해요.</li><li>흰 부분은 <b>사분원 − 반원</b>이에요.</li></ul>'
      });
    },
    problem: {
      tag: '색칠하지 않은 부분의 넓이를 빼서 넓이를 구하는 경우 · 연습 2-2 [6점]', unit: 'cm²',
      stem: (V) => `오른쪽 그림과 같이 한 변의 길이가 ${V.a} cm인 정사각형에서 색칠한 부분의 넓이를 구하고, 그 과정을 서술하시오. [6점]`,
      answer: (V) => `$${xt(X(V.a * V.a, Q(-V.a * V.a, 8)))}$ cm²`,
      std: (V, M) => `<b>풀이</b><br>(흰 부분의 넓이)=(사분원의 넓이)−(반원의 넓이)<br>$=\\pi\\times${V.a}^2\\times\\dfrac14-\\pi\\times${fn(V.a / 2)}^2\\times\\dfrac12=${xt(M.partX)}$ (cm²)<br>(색칠한 부분의 넓이)=(정사각형의 넓이)−(흰 부분의 넓이)<br>$=${V.a * V.a}-${xtp(M.partX)}=${xt(M.resX)}$ (cm²)`,
      quick: (V, M) => `$a^2-\\left(\\frac{\\pi a^2}{4}-\\frac{\\pi a^2}{8}\\right)=${xt(M.resX)}$`
    }
  });

  /* ⑤ 부채꼴 고리 (원 안의 작은 원은 중심각 360°) */
  SPECS.push({
    id: 'ring', title: '고리 모양 : 큰 부채꼴에서 작은 부채꼴 파내기', short: '고리 부채꼴',
    question: '같은 중심의 작은 부채꼴을 파내면 고리 모양이 남아요. 중심각이 360°이면 어떤 모양일까요?',
    vars: [
      { k: 'R', sym: 'R', label: '큰 반지름 R', min: 4, max: 12, step: 1, value: 6 },
      { k: 'r', sym: 'r', label: '작은 반지름 r', hint: 'r은 R보다 작아야 해요', min: 1, max: 11, step: 1, value: 3 },
      { k: 'th', sym: '중심각', label: '중심각', min: 30, max: 360, step: 15, value: 90, fmt: (v) => `중심각 ${fn(v)}°` }
    ],
    fix: (V) => { V.r = Math.min(V.r, V.R - 1); },
    pool: [{ R: 8, r: 4, th: 90 }, { R: 10, r: 6, th: 90 }, { R: 9, r: 3, th: 120 }, { R: 12, r: 6, th: 60 }, { R: 6, r: 2, th: 180 }],
    presets: [{ group: '모양', label: '원 안의 작은 원 (360°)', set: { th: 360 } }, { group: '모양', label: '고리 사분원 (90°)', set: { th: 90 } }],
    model: (V) => {
      const R = V.R, r = V.r, th = V.th, full = th >= 359.9;
      const a0 = 90 - th / 2, a1 = 90 + th / 2;
      const outer = full ? circleP(0, 0, R) : sectorP(0, 0, R, a0, a1);
      const cut = full ? circleP(0, 0, r) : sectorP(0, 0, r, a0, a1);
      const wholeX = X(0, Q(R * R * th, 360)), partX = X(0, Q(r * r * th, 360)), resX = X(0, Q((R * R - r * r) * th, 360));
      const aR = rad(a0), ux = Math.cos(aR), uy = Math.sin(aR);
      const nx = Math.cos(aR - PI / 2), ny = Math.sin(aR - PI / 2);
      const fig = [{ k: 'dot', p: [0, 0], when: 's' }];
      if (!full) {
        fig.push({ k: 'ang', v: P(0, 0), d0: a0, d1: a1, text: `${fn(th)}°`, when: 's', r: 24 });
        fig.push(T([R * ux, R * uy], `R=${fn(R)}`, { ...away(nx, ny, 22), color: 'ink', when: 'g' }));
        fig.push(T([r * ux, r * uy], `r=${fn(r)}`, { ...away(nx, ny, 22), color: 'amber', when: 'g' }));
        fig.push({ k: 'dot', p: [R * ux, R * uy], when: 'g', r: 3 }, { k: 'dot', p: [r * ux, r * uy], when: 'g', r: 3, color: 'amber' });
      } else {
        fig.push({ k: 'seg', p: [0, 0], q: [0, R], color: 'ink', w: 1.8, when: 'g' });
        fig.push({ k: 'seg', p: [0, 0], q: [r, 0], color: 'amber', w: 2.4, when: 'g' });
        fig.push(T([0, (R + r) / 2], `R=${fn(R)}`, { dx: 24, color: 'ink', when: 'g' }), T([r / 2, 0], `r=${fn(r)}`, { dy: 14, color: 'amber', when: 'g' }));
      }
      const outArc = X(0, Q(R * th, 180)), inArc = X(0, Q(r * th, 180)), segX = X(R - r);
      const periX = full ? xadd(outArc, inArc) : xadd(xadd(outArc, inArc), X(2 * (R - r)));
      const mid = rad(90);
      const edges = [
        { pts: full ? circleP(0, 0, R).concat([P(R, 0)]) : arcP(0, 0, R, a0, a1), at: [R * Math.cos(mid), R * Math.sin(mid)], dx: 0, dy: -16, text: xs(outArc), color: 'sky', step: 1, lstep: 1 },
        { pts: full ? circleP(0, 0, r).concat([P(r, 0)]) : arcP(0, 0, r, a0, a1), at: [r * Math.cos(mid), r * Math.sin(mid)], dx: 0, dy: 16, text: xs(inArc), color: 'violet', step: 2, lstep: 2 }
      ];
      if (!full) {
        const e1 = rad(a0), e2 = rad(a1);
        edges.push({ pts: [P(r * Math.cos(e1), r * Math.sin(e1)), P(R * Math.cos(e1), R * Math.sin(e1))], at: [(r + R) / 2 * Math.cos(e1), (r + R) / 2 * Math.sin(e1)], ...away(nx, ny, 16), text: fn(R - r), color: 'rose', step: 3, lstep: 3 });
        edges.push({ pts: [P(r * Math.cos(e2), r * Math.sin(e2)), P(R * Math.cos(e2), R * Math.sin(e2))], at: [(r + R) / 2 * Math.cos(e2), (r + R) / 2 * Math.sin(e2)], ...away(-nx, ny, 16), text: fn(R - r), color: 'rose', step: 3, lstep: 3 });
      }
      const stepsP = full
        ? [`바깥 원의 둘레: $2\\pi\\times${R}=${xt(outArc)}$ (cm)`, `안쪽 원의 둘레: $2\\pi\\times${r}=${xt(inArc)}$ (cm)`, `둘레 $=${xt(outArc)}+${xt(inArc)}=${xt(periX)}$ (cm)`]
        : [`바깥쪽 호: $2\\pi\\times${R}\\times\\dfrac{${th}}{360}=${xt(outArc)}$ (cm)`, `안쪽 호: $2\\pi\\times${r}\\times\\dfrac{${th}}{360}=${xt(inArc)}$ (cm)`, `곧은 선 두 개: $(${R}-${r})\\times2=${2 * (R - r)}$ (cm)`, `둘레 $=${xt(outArc)}+${xt(inArc)}+${2 * (R - r)}=${xt(periX)}$ (cm)`];
      return rem({
        outer, cuts: [{ polys: [cut] }], fig, part: [], edges, wholeX, partX, resX, periV: xs(periX),
        handles: [{ id: 'r', label: '작은 반지름 r', p: [0, r], drag: (w, c) => c.set('r', clamp(Math.round(w.y), 1, R - 1)) }].filter(() => !full),
        tx: { whole: full ? `반지름이 ${R} cm인 원` : `반지름 ${R} cm, 중심각 ${th}°인 부채꼴`, part: full ? `같은 중심의 반지름 ${r} cm인 작은 원` : `같은 중심의 반지름 ${r} cm, 중심각 ${th}°인 작은 부채꼴` },
        cap: { whole: { l: full ? '전체 (큰 원)' : '전체 (큰 부채꼴)', v: cm2(wholeX) }, part: { l: full ? '파낸 부분 (작은 원)' : '파낸 부분 (작은 부채꼴)', v: cm2(partX) } },
        wholeTex: `\\pi\\times${R}^2${full ? '' : `\\times\\dfrac{${th}}{360}`}=${xt(wholeX)}`, partTex: `\\pi\\times${r}^2${full ? '' : `\\times\\dfrac{${th}}{360}`}=${xt(partX)}`,
        steps: [
          `큰 ${full ? '원' : '부채꼴'}의 넓이: $\\pi\\times${R}^2${full ? '' : `\\times\\dfrac{${th}}{360}`}=${xt(wholeX)}$ (cm²)`,
          `파낼 부분은 같은 중심의 작은 ${full ? '원' : '부채꼴'}이에요 (반지름 ${r} cm${full ? '' : `, 중심각 ${th}°`})`,
          `작은 ${full ? '원' : '부채꼴'}의 넓이: $\\pi\\times${r}^2${full ? '' : `\\times\\dfrac{${th}}{360}`}=${xt(partX)}$ (cm²)`,
          `색칠한 부분 = 큰 것 − 작은 것 ${sub(wholeX, partX, resX)} (cm²)`
        ],
        stepsP, guideP: ['바깥쪽 호(파란색)의 길이를 구해요.', '안쪽 호(보라색)의 길이를 구해요.', '곧은 선(분홍색)은 R − r이에요.', '모두 더하면 둘레예요.'].slice(0, stepsP.length),
        periEq: `${xt(outArc)}+${xt(inArc)}${full ? '' : `+${2 * (R - r)}`}=${xt(periX)}`,
        formulaP: `<p><b>둘레</b> = (바깥쪽 호) + (안쪽 호)${full ? '' : ' + (곧은 선 두 개)'}</p><p>= ${xs(outArc)} + ${xs(inArc)}${full ? '' : ` + ${2 * (R - r)}`} = <b>${xs(periX)}</b> (cm)</p>`, ruleP: '(둘레) = (바깥쪽 호) + (안쪽 호) + 곧은 선',
        guide: guide4({ whole: full ? `반지름 ${R} cm인 원` : `중심각 ${th}°인 큰 부채꼴`, part: '같은 중심의 작은 도형' }, xs(resX) + ' cm²'),
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>두 부채꼴의 <b>중심각은 같아요.</b> 호의 길이와 넓이는 반지름에 따라 달라져요.</li><li>둘레에는 안쪽 호와 곧은 선(R−r) 두 개까지 모두 들어가요.</li><li>넓이는 $\\frac{π(R^2-r^2)θ}{360}$로 한 번에 구할 수도 있어요.</li></ul>'
      });
    },
    problem: {
      tag: '고리 모양의 넓이', unit: 'cm²', textbook: false,
      stem: (V) => V.th >= 359.9
        ? `반지름의 길이가 ${V.R} cm인 원에서 같은 중심의 반지름의 길이가 ${V.r} cm인 작은 원을 파냈다. 색칠한 부분의 넓이는?`
        : `반지름의 길이가 ${V.R} cm이고 중심각의 크기가 ${V.th}°인 부채꼴에서 같은 중심의 반지름의 길이가 ${V.r} cm인 작은 부채꼴을 파냈다. 색칠한 부분의 넓이는?`,
      choices: (V) => {
        const k = (n) => X(0, Q(n * V.th, 360));
        const A = k(V.R * V.R - V.r * V.r);
        return ascending(A, [k(V.R * V.R), k(V.r * V.r), k(V.R * V.R + V.r * V.r), k((V.R - V.r) * (V.R - V.r)), X(0, V.R * V.R - V.r * V.r)], X(0, Q(1, 4)));
      },
      hint: () => '큰 부채꼴의 넓이에서 파낸 작은 부채꼴의 넓이를 빼요. 반지름의 제곱에 주의하세요.',
      std: (V, M) => `<b>해결 전략</b> (큰 도형의 넓이) − (작은 도형의 넓이)<br>$\\pi\\times${V.R}^2\\times\\dfrac{${V.th}}{360}-\\pi\\times${V.r}^2\\times\\dfrac{${V.th}}{360}=${xt(M.wholeX)}-${xtp(M.partX)}=${xt(M.resX)}$ (cm²)`,
      quick: (V, M) => `$\\dfrac{\\pi(${V.R}^2-${V.r}^2)\\times${V.th}}{360}=${xt(M.resX)}$`
    }
  });

  /* ⑥ 반원 둘 : 큰 반원 − 작은 반원 둘 */
  SPECS.push({
    id: 'semis', title: '큰 반원에서 작은 반원 둘 파내기', short: '반원 둘',
    question: '큰 반원의 지름을 둘로 나누어 작은 반원 둘을 파냈어요. 작은 반원의 크기를 바꿔도 둘레는 어떻게 될까요?',
    vars: [
      { k: 'R', sym: 'R', label: '큰 반원의 반지름 R', min: 4, max: 9, step: 1, value: 6 },
      { k: 'r1', sym: 'r₁', label: '왼쪽 작은 반원의 반지름 r₁', hint: '오른쪽 반지름 r₂ = R − r₁', min: 1, max: 8, step: 1, value: 3 }
    ],
    fix: (V) => { V.r1 = clamp(V.r1, 1, V.R - 1); },
    pool: [{ R: 6, r1: 2 }, { R: 8, r1: 4 }, { R: 8, r1: 2 }, { R: 9, r1: 3 }, { R: 5, r1: 2 }],
    model: (V) => {
      const R = V.R, r1 = V.r1, r2 = R - r1, c1 = -R + r1, c2 = R - r2;
      const outer = arcP(0, 0, R, 0, 180);
      const S1 = arcP(c1, 0, r1, 0, 180), S2 = arcP(c2, 0, r2, 0, 180);
      const wholeX = X(0, Q(R * R, 2)), partX = X(0, Q(r1 * r1 + r2 * r2, 2)), resX = X(0, r1 * r2);
      const fig = [
        { k: 'dot', p: [0, 0], when: 's' }, { k: 'dot', p: [c1, 0], when: 's', color: 'amber', r: 3.2 }, { k: 'dot', p: [c2, 0], when: 's', color: 'amber', r: 3.2 },
        { k: 'seg', p: [0, 0], q: [0, R], color: 'ink', w: 1.8, dash: [5, 4], when: 'g' },
        T([0, R * 0.72], `R=${fn(R)}`, { dx: 22, color: 'ink', when: 'g' }),
        T([c1, r1 * 0.45], `r₁=${fn(r1)}`, { color: 'amber', when: 'g' }),
        T([c2, r2 * 0.45], `r₂=${fn(r2)}`, { color: 'amber', when: 'g' })
      ];
      const periX = X(0, 2 * R);
      const edges = [
        { pts: outer, at: [0, R], dx: 0, dy: -15, text: xs(X(0, R)), color: 'sky', step: 1, lstep: 1 },
        { pts: S1, at: [c1, r1], dx: 0, dy: -15, text: xs(X(0, r1)), color: 'amber', step: 2, lstep: 2 },
        { pts: S2, at: [c2, r2], dx: 0, dy: -15, text: xs(X(0, r2)), color: 'violet', step: 3, lstep: 3 }
      ];
      return rem({
        outer, cuts: [{ polys: [S1] }, { polys: [S2] }], fig, part: [], edges, wholeX, partX, resX, periV: xs(periX),
        tx: { whole: `반지름이 ${R} cm인 반원`, part: `지름을 둘로 나눈 작은 반원 둘(반지름 ${r1} cm, ${r2} cm)` },
        cap: { whole: { l: '전체 (큰 반원)', v: cm2(wholeX) }, part: { l: '파낸 부분 (작은 반원 둘)', v: cm2(partX) } },
        wholeTex: `\\dfrac12\\times\\pi\\times${R}^2=${xt(wholeX)}`, partTex: `\\dfrac12\\pi\\times${r1}^2+\\dfrac12\\pi\\times${r2}^2=${xt(partX)}`,
        steps: [
          `큰 반원의 넓이: $\\dfrac12\\times\\pi\\times${R}^2=${xt(wholeX)}$ (cm²)`,
          `파낼 부분은 작은 반원 둘이에요 (지름의 합 = 큰 반원의 지름)`,
          `작은 반원 둘의 넓이: $\\dfrac12\\pi\\times${r1}^2+\\dfrac12\\pi\\times${r2}^2=${xt(partX)}$ (cm²)`,
          `색칠한 부분 = 큰 반원 − 작은 반원 둘 ${sub(wholeX, partX, resX)} (cm²)`
        ],
        stepsP: [
          `큰 반원의 호: $\\pi\\times${R}=${xt(X(0, R))}$ (cm)`,
          `왼쪽 작은 반원의 호: $\\pi\\times${r1}=${xt(X(0, r1))}$ (cm)`,
          `오른쪽 작은 반원의 호: $\\pi\\times${r2}=${xt(X(0, r2))}$ (cm)`,
          `둘레 $=${xt(X(0, R))}+${xt(X(0, r1))}+${xt(X(0, r2))}=${xt(periX)}$ (cm). $r_1+r_2=R$이라 큰 원의 둘레와 같아요`
        ],
        guideP: ['큰 반원의 <b>호</b>(파란색)예요.', '왼쪽 작은 반원의 호(주황색)예요.', '오른쪽 작은 반원의 호(보라색)예요.', '세 호를 더하면 큰 원의 둘레 2πR와 같아요.'],
        periEq: `${xt(X(0, R))}+${xt(X(0, r1))}+${xt(X(0, r2))}=${xt(periX)}`,
        formulaP: `<p><b>둘레</b> = (큰 반원의 호) + (작은 반원의 호 둘)</p><p>= ${xs(X(0, R))} + ${xs(X(0, r1))} + ${xs(X(0, r2))} = <b>${xs(periX)}</b> (cm)</p>`, ruleP: '(둘레) = πR + πr₁ + πr₂ = 2πR (r₁ + r₂ = R)',
        guide: guide4({ whole: `반지름이 ${R} cm인 반원`, part: '작은 반원 둘' }, xs(resX) + ' cm²'),
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>색칠한 부분의 넓이는 $πr_1r_2$로 간단히 쓸 수 있어요.</li><li>작은 반원의 반지름이 바뀌어도 둘레는 항상 $2πR$이에요.</li></ul>'
      });
    },
    problem: {
      tag: '반원을 파낸 넓이', unit: 'cm²', textbook: false,
      stem: (V) => `오른쪽 그림은 반지름의 길이가 ${V.R} cm인 반원에서 지름을 둘로 나누어 반지름의 길이가 각각 ${V.r1} cm, ${V.R - V.r1} cm인 반원을 파낸 것이다. 색칠한 부분의 넓이는?`,
      choices: (V) => {
        const r2 = V.R - V.r1, h = (n) => X(0, Q(n, 2));
        const A = X(0, V.r1 * r2);
        return ascending(A, [h(V.R * V.R), h(V.r1 * V.r1 + r2 * r2), h(V.R * V.R - V.r1 * V.r1), X(0, V.R * V.R), X(0, V.r1 * V.r1 + r2 * r2)], X(0, 1));
      },
      hint: () => '큰 반원의 넓이에서 작은 반원 둘의 넓이를 빼요. 반원은 원의 반이에요.',
      std: (V, M) => `<b>해결 전략</b> (큰 반원) − (작은 반원 둘)<br>$\\dfrac12\\times\\pi\\times${V.R}^2-\\left(\\dfrac12\\pi\\times${V.r1}^2+\\dfrac12\\pi\\times${V.R - V.r1}^2\\right)=${xt(M.wholeX)}-${xtp(M.partX)}=${xt(M.resX)}$ (cm²)`,
      quick: (V, M) => `$\\pi r_1 r_2=\\pi\\times${V.r1}\\times${V.R - V.r1}=${xt(M.resX)}$`
    }
  });

  /* ⑦ 활꼴 : 부채꼴 − 삼각형 */
  SPECS.push({
    id: 'seg', title: '부채꼴에서 삼각형 파내 활꼴 만들기', short: '활꼴',
    question: '부채꼴에서 두 반지름과 현으로 이루어진 삼각형을 파내면 활꼴이 남아요. 중심각을 바꾸면 활꼴은 어떻게 변할까요?',
    vars: [
      { k: 'R', sym: 'R', label: '부채꼴의 반지름 R', min: 4, max: 12, step: 2, value: 6 },
      { k: 'th', sym: '중심각', label: '중심각', min: 60, max: 120, step: 30, value: 90, fmt: (v) => `중심각 ${fn(v)}°` }
    ],
    pool: [{ R: 4, th: 90 }, { R: 8, th: 90 }, { R: 10, th: 90 }, { R: 12, th: 90 }, { R: 6, th: 60 }, { R: 6, th: 120 }],
    model: (V) => {
      const R = V.R, th = V.th, a0 = 90 - th / 2, a1 = 90 + th / 2;
      const B = P(R * Math.cos(rad(a0)), R * Math.sin(rad(a0))), A = P(R * Math.cos(rad(a1)), R * Math.sin(rad(a1)));
      const outer = sectorP(0, 0, R, a0, a1), tri = [P(0, 0), A, B];
      const wholeX = X(0, Q(R * R * th, 360));
      const rt = th === 90;
      const partX = rt ? X(Q(R * R, 2)) : X(0, 0, Q(R * R, 4));
      const resX = xsub(wholeX, partX);
      const nx = Math.cos(rad(a0) - PI / 2), ny = Math.sin(rad(a0) - PI / 2);
      const fig = [
        { k: 'dot', p: [0, 0], when: 's' },
        T([A.x * 0.5, A.y * 0.5], `${fn(R)}`, { ...away(-nx, ny, 16), color: 'ink', when: 'g' }),
        T([B.x * 0.5, B.y * 0.5], `${fn(R)}`, { ...away(nx, ny, 16), color: 'ink', when: 'g' }),
        { k: 'seg', p: [A.x, A.y], q: [B.x, B.y], color: 'rose', w: 1.6, dash: [5, 4], when: 's' },
        T([0, A.y], '현 AB', { dy: 14, color: 'rose', when: 's', size: 13 }),
        T([A.x, A.y], 'A', { dx: -12, dy: -10, when: 'g', color: 'ink' }), T([B.x, B.y], 'B', { dx: 12, dy: -10, when: 'g', color: 'ink' }), T([0, 0], 'O', { dy: 14, when: 'g', color: 'ink' })
      ];
      if (rt) fig.push({ k: 'right', v: [0, 0], p: [A.x, A.y], q: [B.x, B.y], when: 'g', size: 12 });
      else fig.push({ k: 'ang', v: P(0, 0), d0: a0, d1: a1, text: `${th}°`, when: 'g', r: 26 });
      if (th === 60) fig.push(TICK([0, 0], [A.x, A.y], { n: 1 }), TICK([0, 0], [B.x, B.y], { n: 1 }), TICK([A.x, A.y], [B.x, B.y], { n: 1 }));
      const triTex = rt ? `\\dfrac12\\times${R}\\times${R}=${xt(partX)}` : `\\dfrac12\\times${R}\\times${R}\\times\\sin${th}^\\circ=${xt(partX)}`;
      return rem({
        outer, cuts: [{ polys: [tri] }], fig, part: [], wholeX, partX, resX,
        tx: { whole: `반지름 ${R} cm, 중심각 ${th}°인 부채꼴 OAB`, part: `삼각형 OAB(두 반지름과 현 AB로 이루어진 삼각형)` },
        cap: { whole: { l: '전체 (부채꼴)', v: cm2(wholeX) }, part: { l: '파낸 부분 (삼각형)', v: cm2(partX) } },
        wholeTex: `\\pi\\times${R}^2\\times\\dfrac{${th}}{360}=${xt(wholeX)}`, partTex: triTex,
        steps: [
          `부채꼴의 넓이: $\\pi\\times${R}^2\\times\\dfrac{${th}}{360}=${xt(wholeX)}$ (cm²)`,
          '파낼 부분은 두 반지름과 현으로 이루어진 삼각형 OAB예요',
          rt ? `삼각형의 넓이(직각삼각형): $\\dfrac12\\times${R}\\times${R}=${xt(partX)}$ (cm²)` : `삼각형의 넓이: $\\dfrac12\\times${R}\\times${R}\\times\\sin${th}^\\circ=${xt(partX)}$ (cm²)`,
          `활꼴 = 부채꼴 − 삼각형 ${sub(wholeX, partX, resX)} (cm²)`
        ],
        guide: guide4({ whole: `반지름 ${R} cm, 중심각 ${th}°인 부채꼴`, part: '삼각형 OAB' }, xs(resX) + ' cm²'),
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>활꼴(현과 호로 이루어진 도형)은 <b>부채꼴 − 삼각형</b>으로 구해요.</li><li>중심각이 90°이면 삼각형은 직각삼각형이라 넓이가 $\\frac12R^2$이에요.</li></ul>'
      });
    },
    problem: {
      tag: '활꼴의 넓이', unit: 'cm²', textbook: false,
      stem: (V) => `오른쪽 그림은 반지름의 길이가 ${V.R} cm이고 중심각의 크기가 ${V.th}°인 부채꼴 OAB이다. 현 AB와 호 AB로 이루어진 활꼴(색칠한 부분)의 넓이는?`,
      choices: (V) => {
        const S = X(0, Q(V.R * V.R * V.th, 360)), T0 = V.th === 90 ? X(Q(V.R * V.R, 2)) : X(0, 0, Q(V.R * V.R, 4));
        const A = xsub(S, T0);
        return ascending(A, [xadd(S, T0), S, xsub(S, xmul(T0, 2)), xmul(S, 2), X(0, 1)].map((v) => v), X(0, 1));
      },
      hint: () => '부채꼴의 넓이에서 삼각형 OAB의 넓이를 빼요.',
      std: (V, M) => `<b>해결 전략</b> (활꼴) = (부채꼴) − (삼각형)<br>(부채꼴의 넓이) $=\\pi\\times${V.R}^2\\times\\dfrac{${V.th}}{360}=${xt(M.wholeX)}$<br>(삼각형의 넓이) $=${xt(M.partX)}$<br>따라서 활꼴의 넓이는 $${xt(M.resX)}$ (cm²)`,
      quick: (V, M) => `$${xt(M.wholeX)}-${xtp(M.partX)}=${xt(M.resX)}$`
    }
  });

  /* ⑧ 반원 − 직각삼각형 (분리된 두 영역) : AC, BC 를 정수로 바꾸면 모든 값이 정확한 식으로 나옵니다 */
  SPECS.push({
    id: 'tri', title: '반원에서 직각삼각형 파내기', short: '반원−삼각형',
    question: '지름을 한 변으로 하는 삼각형은 어떤 삼각형일까요? AC, BC를 바꾸어 삼각형을 파내고 남은 두 부분의 넓이를 구해 보세요.',
    vars: [
      { k: 'AC', sym: 'AC', label: '변 AC의 길이', min: 3, max: 15, step: 1, value: 6 },
      { k: 'BC', sym: 'BC', label: '변 BC의 길이', hint: '점 C를 끌어도 돼요 (반원 위의 점)', min: 3, max: 15, step: 1, value: 8 }
    ],
    pool: [{ AC: 6, BC: 8 }, { AC: 5, BC: 12 }, { AC: 9, BC: 12 }, { AC: 8, BC: 15 }, { AC: 12, BC: 16 }, { AC: 3, BC: 4 }, { AC: 4, BC: 6 }],
    presets: [{ group: '직각삼각형', label: '6 · 8 · 10', set: { AC: 6, BC: 8 } }, { group: '직각삼각형', label: '5 · 12 · 13', set: { AC: 5, BC: 12 } }, { group: '직각삼각형', label: '9 · 12 · 15', set: { AC: 9, BC: 12 } }],
    model: (V) => {
      const ac = V.AC, bc = V.BC, ab2 = ac * ac + bc * bc, AB = Math.sqrt(ab2), R = AB / 2, phi = Math.atan2(bc, ac);
      const intAB = Math.abs(AB - Math.round(AB)) < 1e-9;
      const outer = arcP(0, 0, R, 0, 180);
      const Ap = P(-R, 0), Bp = P(R, 0), Cp = P(R * Math.cos(2 * phi), R * Math.sin(2 * phi));
      const wholeX = X(0, Q(ab2, 8)), partX = X(Q(ac * bc, 2)), resX = xsub(wholeX, partX);
      const abTxt = intAB ? `AB=${Math.round(AB)}` : `AB=√${ab2}≈${fn(AB, 1)}`;
      const fig = [
        { k: 'right', v: [Cp.x, Cp.y], p: [Ap.x, Ap.y], q: [Bp.x, Bp.y], when: 'g', size: 12 },
        T([(Ap.x + Cp.x) / 2, (Ap.y + Cp.y) / 2], `AC=${ac}`, { dx: -4, dy: -14, color: 'ink', when: 'g' }),
        T([(Bp.x + Cp.x) / 2, (Bp.y + Cp.y) / 2], `BC=${bc}`, { dx: 6, dy: -14, color: 'ink', when: 'g' }),
        T([0, 0], abTxt, { dy: 17, color: 'ink', when: 's' }),
        { k: 'dot', p: [0, 0], when: 's' },
        T([Ap.x, 0], 'A', { dx: -10, dy: -12, when: 'g' }), T([Bp.x, 0], 'B', { dx: 10, dy: -12, when: 'g' }), T([Cp.x, Cp.y], 'C', { dy: -14, when: 'g' })
      ];
      const triS = `${fn(ac * bc / 2, 1)} cm²`;
      return rem({
        outer, cuts: [{ polys: [[Ap, Bp, Cp]] }], fig, part: [], wholeX, partX, resX,
        handles: [{ id: 'C', label: '점 C', p: [Cp.x, Cp.y], drag: (w, c) => {
          const ang = Math.atan2(Math.max(0.01, w.y), w.x) / 2;      // 중심각 2φ → φ
          c.set('AC', clamp(Math.round(AB * Math.cos(ang)), 3, 15), true);
          c.set('BC', clamp(Math.round(AB * Math.sin(ang)), 3, 15));
        } }],
        tx: { whole: `지름 AB(${abTxt.slice(3)} cm)인 반원`, part: '직각삼각형 ABC (∠C = 90°)' },
        cap: { whole: { l: '전체 (반원)', v: `${xs(wholeX)} cm²` }, part: { l: '파낸 부분 (직각삼각형)', v: triS } },
        str: { part: triS },
        wholeTex: `\\dfrac12\\times\\pi\\times\\left(\\dfrac{AB}{2}\\right)^2=${xt(wholeX)}`, partTex: `\\dfrac12\\times${ac}\\times${bc}=${fn(ac * bc / 2, 1)}`,
        steps: [
          `지름 AB를 한 변으로 하는 삼각형은 ∠C = 90°예요. 피타고라스 정리로 $AB^2=${ac}^2+${bc}^2=${ab2}$ ${intAB ? `→ AB = ${Math.round(AB)} cm, 반지름 ${fn(R, 1)} cm` : '(cm²)'}`,
          '파낼 부분은 직각삼각형 ABC예요',
          `반원의 넓이: $\\dfrac12\\times\\pi\\times\\left(\\dfrac{AB}{2}\\right)^2=\\dfrac{\\pi\\times AB^2}{8}=${xt(wholeX)}$, 삼각형의 넓이: $\\dfrac12\\times${ac}\\times${bc}=${fn(ac * bc / 2, 1)}$ (cm²)`,
          `색칠한 두 부분의 넓이의 합 = 반원 − 삼각형 : $${xt(wholeX)}-${fn(ac * bc / 2, 1)}=${xt(resX)}$ (cm²)`
        ],
        guide: guide4({ whole: `지름 AB인 반원(AB² = ${ab2})`, part: '직각삼각형 ABC' }, xs(resX) + ' cm²'),
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>반원에 대한 원주각은 90°라서 ∠C = 90°예요(점 C가 어디에 있어도).</li><li>AB를 몰라도 $AB^2=AC^2+BC^2$으로 반원의 넓이를 구할 수 있어요.</li><li>삼각형을 빼면 호 양쪽에 <b>떨어진 두 부분</b>이 남아요. 넓이의 합은 반원 − 삼각형이에요.</li></ul>'
      });
    },
    problem: {
      tag: '반원과 직각삼각형', unit: 'cm²', textbook: false,
      stem: (V) => `오른쪽 그림에서 점 C는 선분 AB를 지름으로 하는 반원 위의 점이다. AC = ${V.AC} cm, BC = ${V.BC} cm일 때, 색칠한 두 부분의 넓이의 합은?`,
      choices: (V) => {
        const ab2 = V.AC * V.AC + V.BC * V.BC, half = X(0, Q(ab2, 8)), tri = X(Q(V.AC * V.BC, 2));
        const A = xsub(half, tri);
        return ascending(A, [half, xadd(half, tri), xsub(X(0, Q(ab2, 4)), tri), xsub(half, xmul(tri, 2)), xsub(X(0, Q(ab2, 2)), tri)], X(0, Q(1, 2)));
      },
      hint: () => '반원의 넓이에서 직각삼각형의 넓이를 빼요. 반원의 넓이는 π×AB²÷8이에요.',
      std: (V, M) => `<b>해결 전략</b> ∠C = 90°이므로 AB² = AC² + BC² = ${V.AC * V.AC + V.BC * V.BC}<br>반원의 넓이 $=\\dfrac{\\pi\\times AB^2}{8}=${xt(M.wholeX)}$, 삼각형의 넓이 $=${xt(M.partX)}$<br>따라서 색칠한 부분의 넓이의 합은 $${xt(M.resX)}$ (cm²)`,
      quick: (V, M) => `$${xt(M.wholeX)}-${xtp(M.partX)}=${xt(M.resX)}$`
    }
  });

  /* ---------- F01 장면 만들기 · 등록 ---------- */
  SPECS.forEach((sp) => { sp.layout = layoutRem; sp.render = renderRem; sp.chips = chipsRem; });
  function chipsRem(c) {
    const M = c.M, ct = M.chipTex;
    if (c.mode) return c.review && c.step < 1 ? [] : [{ k: '둘레', tex: M.periEq, color: 'sky' }];
    if (c.res > 0.5) return [{ k: '색칠한 부분', tex: ct.eq, color: 'sky' }];
    if (c.hi > 0.5) return [{ k: '전체', tex: ct.whole, color: 'ink' }, { k: '파낸 부분', tex: ct.part, color: 'amber' }];
    return [{ k: '전체', tex: ct.whole, color: 'ink' }];
  }
  const GROUP_SCENES = SPECS.map(makeScene);
  GROUP_SCENES.forEach((sc) => {
    // 시험용(그림과 무관): 그려진 도형의 넓이를 표본으로 재어 식과 비교합니다.
    sc.csCheck = (s) => {
      const M = sc.csModel(s), flat = [].concat(...M.cuts.map((g) => g.polys));
      return { whole: areaEO([M.outer]), part: M.cuts.reduce((x, g) => x + areaEO(g.polys), 0), res: areaEO([M.outer].concat(flat)), wholeX: xv(M.wholeX), partX: xv(M.partX), resX: xv(M.resX) };
    };
  });
  installStyle();
  installClicks();

  /* ---------- 등록 ---------- */
  (window.APL_CS_GROUPS = window.APL_CS_GROUPS || []).push({
    order: 61,
    id: 'f01',
    title: 'F01 넣기·파내기',
    short: 'F01 넣기·파내기',
    params: PARAMS,
    scenes: GROUP_SCENES
  });
})();
