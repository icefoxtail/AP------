/* ==========================================================================
   중1 · 원과 부채꼴 — "F05 복합 원호" (f05.js, order 65)
   - 여러 원호(와 선분)로 이루어진 도형의 둘레, 그리고 끈의 최소 길이.
   - 탐구: 둘레(경계)를 호와 선분 조각으로 나누고, 조각을 하나씩 강조하며 그 조각에 길이를 적은 뒤 모두 더합니다.
          호의 길이 = 2πr × (중심각/360).
   - 끈의 최소 길이: 직선 부분 = 중심끼리 이은 선분과 같은 길이, 곡선 부분 = 부채꼴 호들을 한 줄로 복사해 늘어놓고
     가로로만 밀어 한 점으로 모으면 원 하나(중심각의 합 360°) → 2πr.
   - 움직임은 가로(평행이동·제자리 돌기·나타남)만 씁니다. 세로 이동은 없습니다.
   - 모든 도형은 슬라이더(와 끌 수 있는 점)로 길이·각을 바꾸고, 그림·라벨·풀이·문제 보기가 그 값으로 다시 계산됩니다.
   - APL_CS_GROUPS 에 묶음 하나(order 65)를 등록할 뿐, 다른 전역은 만들지 않습니다.
   ========================================================================== */
(function () {
  'use strict';

  const PI = Math.PI, TAU = PI * 2, S3 = Math.sqrt(3);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const seg01 = (g, a, b) => clamp((g - a) / (b - a), 0, 1);
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const rat = (n, d) => { const g = gcd(Math.round(n), Math.round(d)) || 1; n = Math.round(n) / g; d = Math.round(d) / g; return d < 0 ? [-n, -d] : [n, d]; };
  const NUM = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pt = (x, y) => ({ x, y });
  const polar = (c, R, a) => ({ x: c.x + R * Math.cos(a), y: c.y + R * Math.sin(a) });
  const lerpP = (p, q, t) => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });
  const midP = (p, q) => lerpP(p, q, 0.5);
  const unit = (x, y) => { const l = Math.hypot(x, y) || 1; return { x: x / l, y: y / l }; };

  const SEGC = 'rose';                                   // 선분(직선 부분) 색
  const ARCC = ['green', 'violet', 'amber', 'orange'];   // 호 색
  const FILLC = 'sky';                                   // 색칠한 부분(영역) 색

  /* ------------------------------------------------------------------ 길이 값: (n/d)π + c */
  const mkL = (n, d, c) => { const r = rat(n, d); return { n: r[0], d: r[1], c: c || 0 }; };
  const addL = (a, b) => { const r = rat(a.n * b.d + b.n * a.d, a.d * b.d); return { n: r[0], d: r[1], c: a.c + b.c }; };
  const sumL = (list) => list.reduce(addL, mkL(0, 1, 0));
  const valL = (L) => (L.n / L.d) * PI + L.c;
  const scaleL = (L, pa, pb, ca, cb) => mkL(L.n * pa, L.d * pb, L.c * ca / cb);   // π 계수를 pa/pb 배, 상수를 ca/cb 배
  const cStr = (c) => (Number.isInteger(c) ? String(c) : String(+c.toFixed(2)));
  const piP = (n, d) => (n === 0 ? '0' : d === 1 ? (n === 1 ? 'π' : n + 'π') : (n === 1 ? 'π' : n + 'π') + '/' + d);
  const texPi = (L) => (L.n === 0 ? '0' : L.d === 1 ? (L.n === 1 ? '\\pi' : L.n + '\\pi') : '\\dfrac{' + L.n + '}{' + L.d + '}\\pi');
  const plainSum = (L) => (L.n === 0 ? cStr(L.c) : L.c === 0 ? piP(L.n, L.d) : piP(L.n, L.d) + '+' + cStr(L.c));
  const texSum = (L) => (L.n === 0 ? cStr(L.c) : L.c === 0 ? texPi(L) : texPi(L) + '+' + cStr(L.c));
  const cmText = (L) => (L.n !== 0 && L.c !== 0 ? '(' + plainSum(L) + ') cm' : plainSum(L) + ' cm');
  const texAns = (L) => (L.n !== 0 && L.c !== 0 ? '\\left(' + texSum(L) + '\\right)\\mathrm{cm}' : texSum(L) + '\\,\\mathrm{cm}');
  const sameL = (a, b) => a.n === b.n && a.d === b.d && Math.abs(a.c - b.c) < 1e-9;
  const cmpL = (a, b) => (a.n / a.d - b.n / b.d) || (a.c - b.c);   // 교과서처럼 (π의 계수, 상수) 순서로 줄 세움

  /* ------------------------------------------------------------------ 그림 도우미 */
  // 경로 명령으로 영역을 칠합니다. {t:'M'|'L',p} {t:'A',c,R,a0,a1,ccw}
  function regionFill(b, ops, color, alpha) {
    const c = b.ctx, k = b.k;
    c.save();
    c.beginPath();
    ops.forEach((o) => {
      if (o.t === 'M') { const s = b.toS(o.p); c.moveTo(s.x, s.y); }
      else if (o.t === 'L') { const s = b.toS(o.p); c.lineTo(s.x, s.y); }
      else { const s = b.toS(o.c); c.arc(s.x, s.y, o.R * k, o.a0, o.a1, !!o.ccw); }
    });
    c.closePath();
    c.fillStyle = b.color(color, alpha);
    c.fill();
    c.restore();
  }
  const M_ = (p) => ({ t: 'M', p });
  const L_ = (p) => ({ t: 'L', p });
  const A_ = (c, R, a0, a1, ccw) => ({ t: 'A', c, R, a0, a1, ccw: !!ccw });

  // 맞춤: 도형의 경계 상자(bb)와 화면 가장자리 여백(px)으로 보이는 범위를 정합니다. 글자는 화면 크기라 여백을 따로 줍니다.
  function fitFocus(b, bb, m) {
    m = m || {};
    const aw = Math.max(10, b.W - (b.panes ? 0 : b.insets.left + b.insets.right));
    const ah = Math.max(10, b.H - (b.panes ? 0 : b.insets.top + b.insets.bottom));
    const pad = b.pad * Math.min(aw, ah);
    const W = aw - 2 * pad, H = ah - 2 * pad;
    const narrow = aw < 560;
    const mx = m.x != null ? m.x : (narrow ? 56 : 66);
    const mt = m.t != null ? m.t : (narrow ? 30 : 38);
    const mb = m.b != null ? m.b : (narrow ? 88 : 96);
    const bw = Math.max(1e-6, bb.x1 - bb.x0), bh = Math.max(1e-6, bb.y1 - bb.y0);
    const k = Math.max(2, Math.min((W - 2 * mx) / bw, (H - mt - mb) / bh));
    b.focus = { x: [bb.x0 - mx / k, bb.x1 + mx / k], y: [bb.y0 - mt / k, bb.y1 + mb / k] };
    return k;
  }

  // 화면 아래 설명 두 줄(그림 영역의 가운데)
  function caption(b, l1, l2, c1, c2) {
    const ins = b.insets, x = ins.left + (b.W - ins.left - ins.right) / 2;
    const y2 = b.H - ins.bottom - 16;
    b.stext(x, y2 - 22, l1, { color: c1 || 'ink', size: 15, weight: 800 });
    if (l2) b.stext(x, y2, l2, { color: c2 || 'ink', size: 15, weight: 750 });
  }

  /* ------------------------------------------------------------------ 둘레 조각 (호·선분) */
  function arcPiece(o) {
    const len = mkL(o.rcm * o.deg, 180, 0);
    return Object.assign({
      kind: 'arc', len, val: valL(len),
      eq: '2\\pi\\times' + o.rcm + '\\times\\dfrac{' + o.deg + '}{360}=' + texPi(len),
      cap: '2π×' + o.rcm + '×' + o.deg + '/360 = ' + piP(len.n, len.d) + ' (cm)',
      text: piP(len.n, len.d) + ' cm', sumTerm: piP(len.n, len.d)
    }, o);
  }
  function segPiece(o) {
    const len = mkL(0, 1, o.cm);
    return Object.assign({
      kind: 'seg', len, val: o.cm, color: SEGC,
      eq: String(o.cm), cap: (o.why ? o.why + ' = ' : '') + o.cm + ' (cm)',
      text: o.cm + ' cm', sumTerm: String(o.cm)
    }, o);
  }
  function finishModel(P, extra) {
    extra = extra || {};
    const total = sumL(P.map((p) => p.len));
    const groups = extra.groups || P.map((p, i) => ({ idx: [i], name: p.name, cap: p.cap, text: p.stepText }));
    const sumText = extra.sumText || (P.map((p) => p.sumTerm).join(' + ') + ' = ' + cmText(total));
    return Object.assign({ P, total, groups, sumText, nArc: P.filter((p) => p.kind === 'arc').length, nSeg: P.filter((p) => p.kind === 'seg').length }, extra);
  }

  // 진행 상태: 설명(explore)은 t, 정리(review)는 단계에서 정합니다.
  function stateOf(M, s, tab, thumb) {
    const G = M.groups.length;
    const st = { plain: false, cur: -1, upto: 0, sum: false, fr: 1 };
    if (thumb) { st.upto = G; st.sum = true; return st; }
    if (tab === 'problem') { st.plain = true; return st; }
    if (tab === 'review') {
      const k = s.step || 0;
      if (k === 0) { st.plain = true; return st; }
      if (k === 1) return st;
      if (k <= G + 1) { st.cur = k - 2; st.upto = k - 2; return st; }
      st.upto = G; st.sum = true;
      return st;
    }
    const t = clamp(+s.f5T || 0, 0, 1);
    if (t >= 0.999) { st.upto = G; st.sum = true; return st; }
    const g = t * G;
    if (t <= 0.001) return st;
    st.cur = Math.min(G - 1, Math.floor(g));
    st.upto = st.cur;
    st.fr = ease(g - st.cur);
    return st;
  }

  // 조각 하나를 그립니다.
  function drawPieceStroke(b, P, kind, fr, ref) {
    const rev = !!P.rev;
    const col = P.color;
    const o = (w, a, glow) => ({ color: col, width: w, alpha: a, glow: !!glow, ref });
    const stroke = (f, opts) => {
      if (P.kind === 'arc') {
        if (rev) b.arc(P.c, P.R, P.a1 - (P.a1 - P.a0) * f, P.a1, opts);
        else b.arc(P.c, P.R, P.a0, P.a0 + (P.a1 - P.a0) * f, opts);
      } else b.seg(P.p, lerpP(P.p, P.q, f), opts);
    };
    if (kind === 'plain') stroke(1, { color: 'ink', width: 3, alpha: 0.95, ref });
    else if (kind === 'idle') stroke(1, o(4, 0.5));
    else if (kind === 'done') stroke(1, o(5.5, 1));
    else { stroke(1, o(4, 0.45)); stroke(fr, o(8, 1, true)); }
  }
  function drawSectorOverlay(b, P, first, multi, ref) {
    if (P.kind !== 'arc' || !P.sector) return;
    const col = P.color, c = P.c, R = P.R;
    b.arc(c, R, P.a0, P.a1, { sector: true, fill: col, fillAlpha: multi ? 0.12 : 0.2, color: null, ref });
    b.seg(c, polar(c, R, P.a0), { color: col, width: 1.8, dash: [6, 4], alpha: 0.95, ref });
    b.seg(c, polar(c, R, P.a1), { color: col, width: 1.8, dash: [6, 4], alpha: 0.95, ref });
    if (multi && !first) return;
    b.arc(c, R * 0.2, P.a0, P.a1, { color: col, width: 2.2, ref });
    const mid = (P.a0 + P.a1) / 2 + (P.degShift || 0);
    b.text(polar(c, R * (P.degR || 0.44), mid), P.deg + '°', { color: col, size: 15, baseline: 'middle', weight: 800, ref });
    if (first) b.text(polar(c, R * 0.78, P.a0 + Math.min(0.3, (P.a1 - P.a0) * 0.2)), P.rcm + ' cm', { color: 'ink', size: 14, baseline: 'middle', ref });
    b.point(c, { r: 3.6, color: col, glow: false });
  }

  function drawPieceLabel(b, P, color, size, ref) {
    const L = P.lab;
    if (!L) return;
    const d = L.dir, ctr = P.labAlign === 'center';
    const al = ctr ? 'center' : d.x > 0.35 ? 'left' : d.x < -0.35 ? 'right' : 'center';
    b.text(L.pt, P.labelText || P.text, { color, size, baseline: 'middle', weight: 800, align: al, dx: d.x * (ctr ? 8 : 14), dy: d.y * (Math.abs(d.y) > 0.35 ? (ctr ? 14 : 18) : 6), ref });
  }

  // 둘레 조각 장면의 그림 전체
  function drawPieces(D, b, s, lab) {
    const thumb = !!b.thumb;
    const tab = thumb ? 'explore' : (lab && lab.tab) || 'explore';
    const M = D.model(s);
    const st = stateOf(M, s, tab, thumb);
    fitFocus(b, D.bbox(s, M), thumb ? { x: 10, t: 10, b: 10 } : D.fit);
    D.drawBase(b, s, M, st, lab, thumb);
    const G = M.groups;
    const groupOf = {};
    G.forEach((g, gi) => g.idx.forEach((i) => { groupOf[i] = gi; }));
    // 1) 현재 조각의 부채꼴 표시(아래층)
    if (!st.plain && st.cur >= 0) {
      let first = true;
      const multi = G[st.cur].idx.length > 1;
      G[st.cur].idx.forEach((i) => { drawSectorOverlay(b, M.P[i], first, multi, 'p' + i); if (M.P[i].kind === 'arc') first = false; });
    }
    // 2) 조각 선
    M.P.forEach((P, i) => {
      const gi = groupOf[i], ref = 'p' + i;
      let kind = 'idle';
      if (st.plain) kind = 'plain';
      else if (gi === st.cur) kind = 'cur';
      else if (gi < st.upto) kind = 'done';
      drawPieceStroke(b, P, kind, st.fr, ref);
    });
    // 3) 길이 글자
    if (!thumb) {
      M.P.forEach((P, i) => {
        const gi = groupOf[i], ref = 'p' + i;
        if (st.plain) { if (P.plainLabel) drawPieceLabel(b, P, 'ink', 15, ref); return; }
        if (gi === st.cur) { if (st.fr > 0.5 || tab === 'review') drawPieceLabel(b, P, P.color, 16, ref); }
        else if (gi < st.upto) drawPieceLabel(b, P, P.color, 15, ref);
      });
      // 4) 아래 설명
      if (!st.plain) {
        if (st.sum) caption(b, '둘레 = 조각의 길이의 합', M.sumText, 'ink', 'amber');
        else if (st.cur >= 0) caption(b, NUM[st.cur] + ' ' + G[st.cur].name, G[st.cur].cap, M.P[G[st.cur].idx[0]].color, 'ink');
        else caption(b, '경계를 호와 선분으로 나누어요', '▶ 재생하면 조각마다 길이를 구해요', 'ink', 'muted');
      }
      if (tab === 'explore' && D.handles) D.handles(b, s, M, st, lab);
    }
  }

  /* ------------------------------------------------------------------ 보기·풀이·패널 (둘레 조각 장면 공통) */
  const pickOther = (list, cur) => { const pool = list.filter((x) => x !== cur); return pool[Math.floor(Math.random() * pool.length)]; };

  // 보기 다섯 개: 정답 + 그럴듯한 오답 넷. 교과서처럼 (π의 계수, 상수) 순서로 줄 세웁니다.
  function makeChoices(ans, cands) {
    const out = [ans];
    for (const c of cands) {
      if (out.length >= 5) break;
      if (!c || c.c < 0 || c.n < 0) continue;
      if (out.some((o) => sameL(o, c))) continue;
      out.push(c);
    }
    for (let k = 1; out.length < 5 && k < 30; k++) {
      const c = mkL(ans.n + ans.d * k, ans.d, ans.c + (k % 2 ? 0 : 2 * k));
      if (!out.some((o) => sameL(o, c))) out.push(c);
    }
    return out.map((L, i) => ({ L, ok: i === 0 })).sort((a, b) => cmpL(a.L, b.L)).map((o, i) => ({ i, L: o.L, ok: o.ok }));
  }
  function hintOf(o, ans) {
    const bits = [];
    const dp = o.n / o.d - ans.n / ans.d;
    if (dp < -1e-9) bits.push('호의 길이를 덜 더했어요. 경계에 있는 호를 모두 찾았는지, 호마다 2π×반지름×(중심각/360)으로 구했는지 확인해 보세요.');
    else if (dp > 1e-9) bits.push('호의 길이를 너무 많이 더했어요. 같은 호를 두 번 세지 않았는지, 중심각을 바르게 읽었는지 확인해 보세요.');
    if (o.c < ans.c - 1e-9) bits.push('직선(선분) 부분이 모자라요. 경계에 있는 선분을 빠뜨리지 않았는지 확인해 보세요.');
    else if (o.c > ans.c + 1e-9) bits.push('직선(선분) 부분이 너무 길어요. 둘레에 들어가지 않는 안쪽 선은 더하지 않아요.');
    return bits.join(' ');
  }
  const slotKey = (D, s) => D.id + '|' + ['f5A', 'f5B', 'f5C'].map((k) => (D.slots[k] ? s[k] : '-')).join('|') + '|' + (s.f5Seed || 0);

  function problemHTML(D, s) {
    const M = D.model(s);
    let h = '<div class="f5-q">' + D.stem(s, M) + '</div>';
    if (D.essay) {
      h += '<div class="f5-fb"><b>서술형 문제예요.</b> 풀이 과정을 직접 써 본 다음, <b>정리 탭</b>에서 단계별 풀이로 맞춰 보세요.</div>';
    } else {
      const opts = makeChoices(M.total, D.cands(M, s));
      const ok = opts.find((o) => o.ok);
      const key = slotKey(D, s);
      const pick = s.f5Pick && s.f5Pick.key === key ? s.f5Pick.idx : -1;
      h += '<div class="f5-choices">';
      opts.forEach((o) => {
        const cls = pick === o.i ? (o.ok ? ' ok' : ' bad') : '';
        h += '<button type="button" class="f5-ch' + cls + '" data-f5-pick="' + o.i + '" aria-label="' + NUM[o.i] + ' ' + esc(cmText(o.L)) + '"><span class="n">' + NUM[o.i] + '</span><span class="v">$' + texAns(o.L) + '$</span></button>';
      });
      h += '</div>';
      if (pick >= 0) {
        const o = opts[pick];
        h += o.ok
          ? '<div class="f5-fb ok"><b>정답이에요!</b> 둘레 = ' + esc(M.sumText) + '. 정리 탭에서 풀이 과정을 확인해 보세요.</div>'
          : '<div class="f5-fb bad"><b>다시 생각해 볼까요?</b> ' + esc(hintOf(o.L, ok.L)) + '</div>';
      }
    }
    h += '<div class="f5-tools"><button type="button" class="apl-btn sm" data-f5-new>숫자 바꾸기</button><span class="f5-note">슬라이더로 길이와 각을 바꾸면 그림과 보기가 함께 바뀌어요.</span></div>';
    return h;
  }

  function introText(D, M) {
    const a = M.nArc, g = M.nSeg;
    const parts = [];
    if (a) parts.push('호 ' + a + '개');
    if (g) parts.push('선분 ' + g + '개');
    return '둘레는 색칠한 부분의 <b>경계선 전체의 길이</b>예요. 이 경계는 ' + parts.join('와 ') + '로 나눌 수 있어요. 조각마다 길이를 구해 모두 더해요.' + (D.introExtra ? ' ' + D.introExtra(M) : '');
  }
  function stepsOf(D, s) {
    const M = D.model(s), st = [];
    st.push(introText(D, M).replace(/<\/?b>/g, ''));
    M.groups.forEach((g, i) => {
      if (g.text) { st.push(NUM[i] + ' ' + g.text); return; }
      const P = M.P[g.idx[0]];
      if (P.kind === 'arc') st.push(NUM[i] + ' ' + (P.desc || P.name) + ': 반지름 ' + P.rcm + ' cm, 중심각 ' + P.deg + '°인 부채꼴의 호 → $' + P.eq + '$ (cm)');
      else st.push(NUM[i] + ' ' + (P.desc || P.name) + ': ' + (P.why ? P.why + ' = ' : '') + P.cm + ' (cm)');
    });
    st.push('둘레 = 조각의 길이의 합 = ' + M.sumText);
    return st;
  }
  function solutionStd(D, s) {
    const M = D.model(s);
    let h = '<b>해결 전략</b><br>① 색칠한 부분의 둘레(경계)를 호와 선분으로 나눈다.<br>② 호의 길이는 $2\\pi r\\times\\dfrac{\\text{중심각}}{360}$, 선분은 길이 그대로 구하여 모두 더한다.<br><br>';
    M.groups.forEach((g, i) => {
      if (g.text) { h += NUM[i] + ' ' + g.text + '<br>'; return; }
      const P = M.P[g.idx[0]];
      h += NUM[i] + ' ' + (P.desc || P.name) + ': ' + (P.kind === 'arc' ? '$' + P.eq + '$' : (P.why ? P.why + ' = ' : '') + P.cm) + ' (cm)<br>';
    });
    h += '<br>따라서 색칠한 부분의 둘레는 $' + texAns(M.total) + '$';
    return { steps: h, warning: D.warn || '둘레는 경계선의 길이예요. 넓이를 구할 때 쓰는 보조선이나 안쪽 선은 둘레에 넣지 않아요.' };
  }
  function solutionQuick(D, s) {
    const M = D.model(s);
    return { steps: D.quick(M, s), highlight: D.quickNote || '호는 중심각이 같으면 길이도 같고, 중심각의 합이 360°가 되도록 모으면 원 하나의 둘레(2πr)가 돼요.' };
  }

  function guideOf(D, M, st, tab) {
    const G = M.groups;
    if (st.sum) return '조각을 모두 더하면 둘레는 <b>' + esc(M.sumText) + '</b>예요. 슬라이더를 움직여 숫자를 바꾸어도 같은 방법으로 구할 수 있어요.';
    if (st.cur >= 0) {
      const P = M.P[G[st.cur].idx[0]];
      return '<b>' + NUM[st.cur] + ' ' + esc(G[st.cur].name) + '</b>: ' + esc(G[st.cur].cap) + (P.kind === 'arc' ? '<br>호의 길이는 <b>2π × 반지름 × (중심각/360)</b>이에요.' : '');
    }
    if (tab === 'review') return '왼쪽 그림에서 경계를 조각으로 나누어 보아요. 위의 <b>다음 단계</b>를 눌러 조각을 하나씩 확인해 보세요.';
    return '색칠한 부분의 둘레는 호와 선분 <b>' + M.P.length + '조각</b>으로 이루어져 있어요. ▶ <b>재생</b>을 누르거나 아래 막대를 끌어 한 조각씩 길이를 구해 보세요.' + (D.guide0 ? '<br>' + D.guide0 : '');
  }

  function viewPieces(D, s, lab) {
    const M = D.model(s);
    const tab = (lab && lab.tab) || 'explore';
    const st = stateOf(M, s, tab, false);
    const G = M.groups;
    const groupOf = {};
    G.forEach((g, gi) => g.idx.forEach((i) => { groupOf[i] = gi; }));
    const v = {};
    v.guide = guideOf(D, M, st, tab);
    v.readouts = M.P.map((P, i) => ({
      label: NUM[groupOf[i]] + ' ' + P.name, value: P.text, color: P.color, ref: 'p' + i,
      note: P.kind === 'arc' ? '2π×' + P.rcm + '×' + P.deg + '/360' : (P.why || '선분')
    })).concat([{ label: '둘레', value: cmText(M.total), color: 'amber', wide: true, note: '≈ ' + valL(M.total).toFixed(2) + ' cm' }]);
    if (st.sum) v.status = { tone: 'ok', text: '둘레 = ' + cmText(M.total) };
    else if (st.cur >= 0) v.status = { tone: 'info', text: NUM[st.cur] + ' ' + G[st.cur].name + ' → ' + M.P[G[st.cur].idx[0]].text };
    else v.status = { tone: 'info', text: tab === 'problem' ? '문제의 그림' : '경계 = 호 + 선분' };
    if (tab === 'review' && st.sum) {
      v.tape = {
        title: '둘레 = ' + M.sumText,
        segments: M.P.map((P) => ({ text: P.sumTerm, weight: Math.max(0.2, P.val), color: P.color }))
      };
    }
    v.formula = '<p><b>둘레</b> = (호의 길이의 합) + (선분의 길이의 합)</p>' + (D.formula ? D.formula(M, s) : '')
      + '<p>∴ <b>' + esc(M.sumText) + '</b> ≈ ' + valL(M.total).toFixed(2) + ' cm</p>';
    v.rule = D.rule || '(호의 길이) = 2πr × (중심각/360), (둘레) = (호의 길이의 합) + (선분의 길이의 합)';
    v.notes = D.notes ? '<ul style="margin:0;padding-left:18px;display:grid;gap:4px">' + D.notes.map((x) => '<li>' + x + '</li>').join('') + '</ul>' : '';
    return v;
  }

  /* ------------------------------------------------------------------ 조절 막대(슬롯) — 장면마다 이름·범위를 바꿔 씁니다 */
  const SLOT_IDS = ['f5A', 'f5B', 'f5C'];
  const DEF_T = { value: 0, min: 0, max: 1, step: 0.005, color: 'amber', label: '둘레를 조각내어 보기' };
  function refreshReview(lab) {
    try { lab._buildReview(); } catch (e) { /* 키트가 바뀌어도 그림은 그대로 동작 */ }
    lab.invalidate(true);
  }
  function tFormat(D, v, s) {
    if (v <= 0.001) return '처음 모양';
    if (v >= 0.999) return '모두 더하기';
    const M = D.model(s);
    return NUM[Math.min(M.groups.length - 1, Math.floor(v * M.groups.length))] + ' ' + M.groups[Math.min(M.groups.length - 1, Math.floor(v * M.groups.length))].name;
  }
  function setSlots(lab, D) {
    const P = lab.params;
    P.f5T = Object.assign({}, DEF_T, { label: D.tLabel || DEF_T.label, hint: '오른쪽으로 끌면 조각이 차례로 강조되고 길이가 적혀요', format: (v, s) => tFormat(D, v, s) });
    SLOT_IDS.forEach((id) => {
      if (D.slots[id]) {
        P[id] = Object.assign({}, D.slots[id], { onInput: (s, l) => { if (D.fix) D.fix(s); s.f5Pick = null; refreshReview(l || lab); } });
      } else delete P[id];
    });
  }
  const DUR_PER = 2.4;

  function presetsOf(D) {
    return (D.presets || []).map((p) => ({
      group: '숫자 바꿔 보기', label: p.label,
      apply: (s, lab) => { Object.assign(s, p.v); s.f5Pick = null; if (D.fix) D.fix(s); refreshReview(lab); },
      on: (s) => Object.keys(p.v).every((k) => s[k] === p.v[k])
    }));
  }
  const ACTIONS = (what) => () => [
    {
      id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'),
      label: (s) => (s.playing ? '일시 정지' : s.f5T >= 0.999 ? '다시 재생' : what),
      on: (s) => s.playing,
      run: (s) => { if (s.playing) s.playing = false; else { if (s.f5T >= 0.999) s.f5T = 0; s.playing = true; } }
    },
    { id: 'reset', icon: 'reset', label: '처음으로', run: (s) => { s.playing = false; s.f5T = 0; } }
  ];

  function pieceScene(D) {
    return {
      id: D.id, title: D.title, short: D.short, f5Key: D.id,
      question: D.question,
      controls: SLOT_IDS.filter((k) => D.slots[k]).concat(['f5T']),
      presets: () => presetsOf(D),
      actions: ACTIONS('둘레 따라가기 재생'),
      steps: (s) => stepsOf(D, s),
      solution: {
        standardTitle: '교과서식 풀이 (해결 전략)', standardTag: '정석', quickTitle: '빠른 풀이 · 핵심 원리', quickTag: '핵심',
        standard: (s) => solutionStd(D, s),
        quick: (s) => solutionQuick(D, s)
      },
      notesTitle: '자주 틀리는 부분',
      problem: {
        tag: D.essay ? '서술형 · 둘레의 길이' : '둘레의 길이 구하기',
        text: (s) => problemHTML(D, s),
        answer: (s) => { const M = D.model(s); return D.essay ? '$' + texAns(M.total) + '$' : (() => { const o = makeChoices(M.total, D.cands(M, s)); const ok = o.find((x) => x.ok); return NUM[ok.i] + ' $' + texAns(ok.L) + '$'; })(); }
      },
      enter: (s, lab) => {
        s.f5T = 0; s.f5Pick = null; s.f5Seed = 0; s.playing = false;
        SLOT_IDS.forEach((id) => { if (D.slots[id]) s[id] = D.slots[id].value; });
        if (lab && s === lab.s) setSlots(lab, D);
      },
      tick: (s, dt) => {
        if (!s.playing) return false;
        const G = D.model(s).groups.length;
        s.f5T = Math.min(1, s.f5T + dt / (G * DUR_PER + 0.8));
        if (s.f5T >= 1) s.playing = false;
        return true;
      },
      view: (s, lab) => viewPieces(D, s, lab),
      draw: (b, s, v, lab) => drawPieces(D, b, s, lab),
      // 시험용 접근(그림과 무관)
      f5Kind: 'piece', f5PickKey: (s) => slotKey(D, s),
      f5Model: (s) => D.model(s),
      f5Choices: (s) => { const M = D.model(s); return makeChoices(M.total, D.cands(M, s)); },
      f5Rand: (s) => D.rand(s),
      f5Def: D
    };
  }

  /* ================================================================== 장면 정의 (조각 둘레) ================ */
  const dashed = { color: 'ink', width: 1.6, alpha: 0.55, dash: [6, 5] };
  const pointLab = (b, p, label, dx, dy, align, thumb) => { b.point(p, { r: 4, color: 'ink', glow: false }); if (!thumb) b.text(p, label, { dx, dy, align: align || 'center', size: 15, color: 'ink', baseline: 'middle' }); };
  const arrow2 = (b, p, q, o) => b.seg(p, q, o);

  /* ---------- 12-08 : 지름을 삼등분한 S자 ---------- */
  const SN = {
    id: 'f5-sn', short: 'S자 둘레', title: '지름을 삼등분한 S자의 둘레',
    question: '지름 AD를 똑같이 셋으로 나눈 점 B, C로 S자 모양을 만들었어. 이 모양의 둘레는 어떤 반원의 호들로 이루어져 있을까?',
    slots: { f5A: { label: 'AB = BC = CD', min: 2, max: 10, step: 2, value: 4, color: 'sky', format: (v) => v + ' cm', hint: '지름 AD = AB × 3' } },
    presets: [{ label: 'AD = 12 cm', v: { f5A: 4 } }, { label: 'AD = 6 cm', v: { f5A: 2 } }, { label: 'AD = 24 cm', v: { f5A: 8 } }],
    rand: (s) => ({ f5A: pickOther([2, 4, 6, 8, 10], s.f5A) }),
    model(s) {
      const a = s.f5A, h = a / 2;
      const P = [
        arcPiece({ name: 'AC 호', desc: 'AC를 지름으로 하는 반원의 호', c: pt(-0.5, 0), R: 1, a0: PI, a1: TAU, rcm: a, deg: 180, color: 'green', sector: true, lab: { pt: pt(-0.5, -1), dir: pt(0, -1) } }),
        arcPiece({ name: 'CD 호', desc: 'CD를 지름으로 하는 반원의 호', c: pt(1, 0), R: 0.5, a0: 0, a1: PI, rev: true, rcm: h, deg: 180, color: 'violet', sector: true, lab: { pt: pt(1, 0.5), dir: pt(0, -1) } }),
        arcPiece({ name: 'BD 호', desc: 'BD를 지름으로 하는 반원의 호', c: pt(0.5, 0), R: 1, a0: 0, a1: PI, rcm: a, deg: 180, color: 'amber', sector: true, lab: { pt: pt(0.5, 1), dir: pt(0, 1) } }),
        arcPiece({ name: 'AB 호', desc: 'AB를 지름으로 하는 반원의 호', c: pt(-1, 0), R: 0.5, a0: PI, a1: TAU, rev: true, rcm: h, deg: 180, color: 'orange', sector: true, lab: { pt: pt(-1, -0.5), dir: pt(0, 1) } })
      ];
      const region1 = [M_(pt(-1.5, 0)), A_(pt(-0.5, 0), 1, PI, TAU, false), L_(pt(-0.5, 0)), A_(pt(-1, 0), 0.5, 0, PI, true)];
      const region2 = [M_(pt(-0.5, 0)), A_(pt(0.5, 0), 1, PI, 0, true), A_(pt(1, 0), 0.5, 0, PI, false)];
      return finishModel(P, { regions: [region1, region2], a, AD: 3 * a });
    },
    bbox: () => ({ x0: -1.5, x1: 1.5, y0: -1.95, y1: 1.5 }),
    drawBase(b, s, M, st, lab, thumb) {
      M.regions.forEach((r) => regionFill(b, r, FILLC, 0.28));
      const A = pt(-1.5, 0), B = pt(-0.5, 0), C = pt(0.5, 0), Dd = pt(1.5, 0);
      b.circle(pt(0, 0), 1.5, { color: 'ink', width: 1.8, alpha: 0.5 });
      b.seg(A, Dd, { color: 'ink', width: 1.5, alpha: 0.5 });
      b.ticks(A, B, { color: 'ink' }); b.ticks(B, C, { color: 'ink' }); b.ticks(C, Dd, { color: 'ink' });
      pointLab(b, A, 'A', -10, -14, 'right', thumb); pointLab(b, B, 'B', -10, 16, 'right', thumb);
      pointLab(b, C, 'C', 10, -16, 'left', thumb); pointLab(b, Dd, 'D', 10, -14, 'left', thumb);
      const y = -1.82;
      b.seg(pt(-1.5, y), pt(1.5, y), { color: 'ink', width: 1.6, alpha: 0.85 });
      b.seg(pt(-1.5, y - 0.07), pt(-1.5, y + 0.07), { color: 'ink', width: 1.6, alpha: 0.85 });
      b.seg(pt(1.5, y - 0.07), pt(1.5, y + 0.07), { color: 'ink', width: 1.6, alpha: 0.85 });
      if (!thumb) b.text(pt(0, y), M.AD + ' cm', { dy: -13, color: 'ink', size: 16, baseline: 'middle' });
    },
    stem: (s, M) => '그림과 같이 지름 $\\overline{AD}$의 길이가 ' + M.AD + ' cm인 원에서 $\\overline{AB}=\\overline{BC}=\\overline{CD}$일 때, 색칠한 부분의 둘레의 길이는?',
    cands: (M) => [[1, 2], [3, 4], [5, 4], [3, 2], [2, 1], [1, 4]].map((q) => scaleL(M.total, q[0], q[1], 1, 1)),
    introExtra: () => '조각은 모두 반원의 호(중심각 180°)예요.',
    guide0: '네 호는 모두 반원이어서 중심각이 180°예요.',
    formula: (M) => '<p>지름이 ' + 2 * M.a + ', ' + 2 * M.a + ', ' + M.a + ', ' + M.a + ' cm인 반원 4개의 호예요.</p>',
    quick: (M) => '반원의 호는 <b>(지름) × π ÷ 2</b>예요. 지름이 ' + 2 * M.a + ' cm인 반원 2개와 ' + M.a + ' cm인 반원 2개이므로 $' + texSum(M.total) + '$ (cm).<br>그런데 이 값은 지름 AD인 큰 원의 원주 $\\pi\\times' + M.AD + '$와 같아요.',
    notes: ['경계는 큰 반원의 호 2개와 작은 반원의 호 2개예요. 원 바깥 둘레는 색칠한 부분의 경계가 아니에요.', '반지름은 지름의 절반이에요. AC의 지름은 AB의 2배예요.'],
    warn: '반원의 호의 길이는 원주의 절반이에요. 지름을 반지름으로 착각하지 않도록 주의해요.'
  };

  /* ---------- 12-11 · 17-21 : 부채꼴 고리의 둘레 ---------- */
  const ringModel = (s) => {
    const R = s.f5A, r = Math.min(s.f5B, R - 1), th = s.f5C, t = th * PI / 180;
    const cs = Math.cos(t), sn = Math.sin(t), O = pt(0, 0);
    const mid = -t / 2;
    const P = [
      arcPiece({ name: '바깥쪽 호', desc: '바깥쪽 호', c: O, R, a0: -t, a1: 0, rcm: R, deg: th, color: ARCC[0], sector: true, lab: { pt: polar(O, R, mid), dir: pt(Math.cos(mid), Math.sin(mid)) } }),
      segPiece({ name: '아랫변', desc: '아랫변(직선 부분)', p: pt(R, 0), q: pt(r, 0), cm: R - r, why: R + ' − ' + r, lab: { pt: pt((R + r) / 2, 0), dir: pt(0, 1) } }),
      arcPiece({ name: '안쪽 호', desc: '안쪽 호', c: O, R: r, a0: -t, a1: 0, rev: true, rcm: r, deg: th, color: ARCC[1], sector: true, degR: 0.62, lab: { pt: polar(O, r, mid), dir: pt(Math.cos(mid), Math.sin(mid)) } }),
      segPiece({ name: '옆변', desc: '옆변(직선 부분)', p: pt(r * cs, -r * sn), q: pt(R * cs, -R * sn), cm: R - r, why: R + ' − ' + r, lab: { pt: pt((R + r) / 2 * cs, -(R + r) / 2 * sn), dir: pt(-sn, -cs) } })
    ];
    const region = [M_(pt(r, 0)), L_(pt(R, 0)), A_(O, R, 0, -t, true), L_(polar(O, r, -t)), A_(O, r, -t, 0, false)];
    return finishModel(P, { region, g: { R, r, th, t, cs, sn } });
  };
  const ringDef = (essay) => ({
    id: essay ? 'f5-ring2' : 'f5-ring', essay,
    short: essay ? '고리 (서술형)' : '부채꼴 고리', title: essay ? '부채꼴 고리의 둘레 (서술형)' : '부채꼴 고리의 둘레',
    question: '큰 부채꼴에서 작은 부채꼴을 뺀 고리 모양이야. 둘레는 호 2개와 선분 2개로 이루어져 있어. 호는 어떻게 구하지?',
    slots: {
      f5A: { label: '바깥쪽 반지름', min: 4, max: 20, step: 1, value: essay ? 9 : 15, color: 'sky', format: (v) => v + ' cm' },
      f5B: { label: '안쪽 반지름', min: 1, max: 19, step: 1, value: essay ? 6 : 10, color: 'violet', format: (v) => v + ' cm', hint: '바깥쪽 반지름보다 작게' },
      f5C: { label: '중심각', min: 20, max: 170, step: 2, value: essay ? 40 : 72, color: 'amber', format: (v) => v + '°', hint: '그림의 노란 점을 끌어도 돼요' }
    },
    fix: (s) => { s.f5B = Math.min(s.f5B, s.f5A - 1); },
    presets: essay
      ? [{ label: '9·6·40° (서술형)', v: { f5A: 9, f5B: 6, f5C: 40 } }, { label: '15·10·72°', v: { f5A: 15, f5B: 10, f5C: 72 } }, { label: '12·8·60°', v: { f5A: 12, f5B: 8, f5C: 60 } }]
      : [{ label: '15·10·72° (교과서)', v: { f5A: 15, f5B: 10, f5C: 72 } }, { label: '9·6·40°', v: { f5A: 9, f5B: 6, f5C: 40 } }, { label: '12·8·60°', v: { f5A: 12, f5B: 8, f5C: 60 } }],
    rand: (s) => { const R = 8 + Math.floor(Math.random() * 13), w = 2 + Math.floor(Math.random() * Math.min(8, R - 3)); return { f5A: R, f5B: R - w, f5C: pickOther([24, 30, 36, 40, 48, 50, 60, 72, 80, 90, 100, 120], s.f5C) }; },
    model: ringModel,
    bbox: (s, M) => { const { R, t, cs } = M.g; return { x0: t >= PI / 2 ? R * cs : 0, x1: R, y0: -R * (t >= PI / 2 ? 1 : Math.max(Math.sin(t), 0.6)), y1: 0 }; },
    drawBase(b, s, M, st, lab, thumb) {
      const { R, r, th, t, cs, sn } = M.g, O = pt(0, 0);
      regionFill(b, M.region, FILLC, 0.28);
      b.seg(O, pt(r, 0), dashed);
      b.seg(O, pt(r * cs, -r * sn), dashed);
      b.point(O, { r: 4, color: 'ink', glow: false });
      if (thumb) return;
      b.angle(O, pt(1, 0), pt(cs, -sn), { r: 38, label: th + '°', color: 'amber', size: 15 });
      b.text(pt(r / 2, 0), r + ' cm', { dy: 20, color: 'ink', size: 15, baseline: 'middle' });
      b.text(polar(O, R / 2, -t), R + ' cm', { dx: -sn * 26, dy: -cs * 26, color: 'ink', size: 15, baseline: 'middle' });
      b.text(O, 'O', { dx: -14, dy: 14, color: 'ink', size: 15, baseline: 'middle' });
    },
    handles(b, s, M) {
      const { R, t, cs, sn } = M.g;
      b.handle('f5ang', pt(R * cs, -R * sn), {
        color: 'amber', r: 8,
        drag: (w) => {
          let a = Math.atan2(-w.y, w.x) * 180 / PI;
          if (a < 0) a += 360;
          if (a > 175) a = a < 270 ? 170 : 20;
          const v = clamp(Math.round(a / 2) * 2, 20, 170);
          if (v !== s.f5C) { s.f5C = v; s.f5Pick = null; refreshReview(window.lab); }
        }
      });
    },
    stem: (s, M) => essay
      ? '그림과 같은 부채꼴에서 색칠한 부분의 둘레의 길이를 구하고, 그 과정을 서술하시오. <span class="f5-pt">[6점]</span><br><small>(그림: 바깥쪽 반지름 ' + M.g.R + ' cm, 안쪽 반지름 ' + M.g.r + ' cm, 중심각 ' + M.g.th + '°)</small>'
      : '그림과 같은 부채꼴에서 색칠한 부분의 둘레의 길이는?<br><small>(그림: 바깥쪽 반지름 ' + M.g.R + ' cm, 안쪽 반지름 ' + M.g.r + ' cm, 중심각 ' + M.g.th + '°)</small>',
    cands(M) {
      const P = M.total, tp = (a, b, c1, c2) => scaleL(P, a, b, c1, c2);
      return [tp(1, 1, 3, 2), tp(3, 2, 1, 1), tp(3, 2, 3, 2), tp(3, 2, 2, 1), tp(1, 1, 1, 2), tp(1, 2, 1, 1), tp(2, 1, 1, 1), tp(1, 1, 2, 1)];
    },
    introExtra: () => '직선 부분은 두 반지름의 차이만큼이에요.',
    guide0: '직선 부분은 (바깥쪽 반지름) − (안쪽 반지름)이에요. 두 곳이에요.',
    formula: (M) => '<p>호: 반지름 ' + M.g.R + ' cm와 ' + M.g.r + ' cm, 중심각 ' + M.g.th + '°. 선분: (' + M.g.R + ' − ' + M.g.r + ') × 2 = ' + 2 * (M.g.R - M.g.r) + ' cm</p>',
    quick: (M) => '두 호의 중심각이 같으므로 <b>(바깥 + 안쪽 반지름) × 2π × 중심각/360</b>으로 한 번에: $2\\pi\\times(' + M.g.R + '+' + M.g.r + ')\\times\\dfrac{' + M.g.th + '}{360}=' + texPi(sumL([M.P[0].len, M.P[2].len])) + '$.<br>직선은 $(' + M.g.R + '-' + M.g.r + ')\\times2=' + 2 * (M.g.R - M.g.r) + '$ → $' + texSum(M.total) + '$ (cm)',
    notes: ['안쪽 호도 둘레에 들어가요. 색칠한 부분의 경계이기 때문이에요.', '직선 부분은 반지름이 아니라 (바깥쪽 반지름 − 안쪽 반지름)이에요. 두 곳이라서 2배를 해요.'],
    warn: '직선 부분은 바깥쪽 반지름 전체가 아니라 안쪽 반지름을 뺀 길이예요.'
  });
  const RING = ringDef(false), RING2 = ringDef(true);

  /* ---------- 16-11 : 고리에서 부채꼴 모양을 뺀 둘레 ---------- */
  const RING240 = {
    id: 'f5-ring240', short: '뺀 고리', title: '고리에서 부채꼴을 뺀 둘레',
    question: '안쪽 반지름 4 cm인 원과 폭이 4 cm인 고리에서, 중심각 120°인 부분을 잘라 냈어. 남은 부분의 호는 중심각이 몇 도일까?',
    slots: {
      f5A: { label: '안쪽 반지름', min: 1, max: 10, step: 1, value: 4, color: 'violet', format: (v) => v + ' cm' },
      f5B: { label: '고리의 폭', min: 1, max: 10, step: 1, value: 4, color: 'sky', format: (v) => v + ' cm' },
      f5C: { label: '잘라 낸 중심각', min: 30, max: 170, step: 10, value: 120, color: 'amber', format: (v) => v + '°', hint: '그림의 노란 점을 끌어도 돼요' }
    },
    presets: [{ label: '4·4·120° (교과서)', v: { f5A: 4, f5B: 4, f5C: 120 } }, { label: '3·3·90°', v: { f5A: 3, f5B: 3, f5C: 90 } }, { label: '6·3·60°', v: { f5A: 6, f5B: 3, f5C: 60 } }],
    rand: (s) => ({ f5A: 2 + Math.floor(Math.random() * 7), f5B: 2 + Math.floor(Math.random() * 7), f5C: pickOther([60, 90, 120, 150], s.f5C) }),
    model(s) {
      const r = s.f5A, w = s.f5B, R = r + w, phi = s.f5C, h = phi * PI / 360, rem = 360 - phi;
      const O = pt(0, 0), cs = Math.cos(h), sn = Math.sin(h);
      const P = [
        arcPiece({ name: '바깥쪽 호', desc: '바깥쪽 호', c: O, R, a0: h, a1: TAU - h, rcm: R, deg: rem, color: ARCC[0], sector: true, lab: { pt: polar(O, R, 5 * PI / 4), dir: pt(Math.cos(5 * PI / 4), Math.sin(5 * PI / 4)) } }),
        segPiece({ name: '위쪽 변', desc: '위쪽 변(직선 부분)', p: pt(R * cs, -R * sn), q: pt(r * cs, -r * sn), cm: w, why: R + ' − ' + r, plainLabel: true, lab: { pt: pt((R + r) / 2 * cs, -(R + r) / 2 * sn), dir: pt(sn, cs) } }),
        arcPiece({ name: '안쪽 호', desc: '안쪽 호', c: O, R: r, a0: h, a1: TAU - h, rev: true, rcm: r, deg: rem, color: ARCC[1], sector: true, degR: 0.62, lab: { pt: pt(-r, 0), dir: pt(-1, 0) } }),
        segPiece({ name: '아래쪽 변', desc: '아래쪽 변(직선 부분)', p: pt(r * cs, r * sn), q: pt(R * cs, R * sn), cm: w, why: R + ' − ' + r, lab: { pt: pt((R + r) / 2 * cs, (R + r) / 2 * sn), dir: pt(sn, -cs) } })
      ];
      const region = [A_(O, R, h, TAU - h, false), L_(polar(O, r, TAU - h)), A_(O, r, TAU - h, h, true)];
      return finishModel(P, { region, g: { R, r, w, phi, rem, h, cs, sn } });
    },
    bbox: (s, M) => { const { R, cs } = M.g; return { x0: -R, x1: Math.max(R * cs, 0.35 * R), y0: -R, y1: R }; },
    drawBase(b, s, M, st, lab, thumb) {
      const { R, r, w, phi, cs, sn } = M.g, O = pt(0, 0);
      regionFill(b, M.region, FILLC, 0.28);
      b.seg(O, pt(r * cs, -r * sn), dashed);
      b.seg(O, pt(r * cs, r * sn), dashed);
      b.point(O, { r: 4, color: 'ink', glow: false });
      if (thumb) return;
      b.angle(O, pt(cs, -sn), pt(cs, sn), { r: 38, label: phi + '°', color: 'amber', size: 15 });
      const q = polar(O, r, 3 * PI / 4);
      b.seg(O, q, dashed);
      b.text(midP(O, q), r + ' cm', { dx: -8, dy: 14, color: 'ink', size: 15, baseline: 'middle', align: 'right' });
      b.text(O, 'O', { dx: -4, dy: -15, color: 'ink', size: 15, baseline: 'middle' });
    },
    handles(b, s, M) {
      const { R, cs, sn } = M.g;
      b.handle('f5ang', pt(R * cs, -R * sn), {
        color: 'amber', r: 8,
        drag: (w) => {
          const a = Math.atan2(-w.y, w.x) * 180 / PI;
          const v = clamp(Math.round(a * 2 / 10) * 10, 30, 170);
          if (v !== s.f5C) { s.f5C = v; s.f5Pick = null; refreshReview(window.lab); }
        }
      });
    },
    stem: (s, M) => '그림에서 색칠한 부분의 둘레의 길이는?<br><small>(그림: 안쪽 반지름 ' + M.g.r + ' cm, 고리의 폭 ' + M.g.w + ' cm, 잘라 낸 부분의 중심각 ' + M.g.phi + '°)</small>',
    cands(M) {
      const o = M.P[0].len, i = M.P[2].len, P = M.total, C = M.g.w * 2;
      const O = mkL(o.n, o.d, 0);
      return [addL(O, mkL(0, 1, C / 2)), addL(O, mkL(0, 1, C)), addL(sumL([o, i]), mkL(0, 1, C / 2)), addL(scaleL(sumL([o, i]), 2, 1, 1, 1), mkL(0, 1, C)),
        addL(scaleL(sumL([o, i]), 1, 2, 1, 1), mkL(0, 1, C)), addL(sumL([o, i]), mkL(0, 1, 2 * C)), addL(scaleL(sumL([o, i]), 3, 2, 1, 1), mkL(0, 1, C))];
    },
    introExtra: () => '잘라 낸 부분의 호는 둘레에 들어가지 않아요. 남은 호의 중심각은 360° − (잘라 낸 각)이에요.',
    guide0: '남은 부분의 중심각은 360° − 잘라 낸 각이에요.',
    formula: (M) => '<p>남은 중심각 = 360° − ' + M.g.phi + '° = ' + M.g.rem + '°. 선분: ' + M.g.w + ' × 2 = ' + 2 * M.g.w + ' cm</p>',
    quick: (M) => '중심각이 ' + M.g.rem + '°인 호의 길이는 반지름 합 (' + M.g.R + '+' + M.g.r + ')으로 한 번에: $2\\pi\\times' + (M.g.R + M.g.r) + '\\times\\dfrac{' + M.g.rem + '}{360}=' + texPi(sumL([M.P[0].len, M.P[2].len])) + '$.<br>선분 2개: $' + 2 * M.g.w + '$ → $' + texSum(M.total) + '$ (cm)',
    notes: ['남은 호의 중심각은 360°에서 잘라 낸 각 ' + '을 뺀 값이에요. 잘라 낸 각(120°)을 그대로 쓰지 않아요.', '고리의 폭은 직선 부분 한 개의 길이예요. 직선 부분은 두 곳이라 2배를 해요.'],
    warn: '남은 호의 중심각은 360° − 잘라 낸 각이에요. 잘라 낸 각 그대로 계산하지 않도록 주의해요.'
  };

  /* ---------- 16-12 : 정사각형 속 원과 네 사분원 ---------- */
  const STAR = {
    id: 'f5-star', short: '네 잎 모양', title: '정사각형 속 네 잎 모양의 둘레',
    question: '정사각형에 꼭 맞는 원이 있고, 정사각형의 네 꼭짓점을 중심으로 하는 사분원도 그렸어. 색칠한 네 잎의 둘레는 어떤 호로 이루어져 있을까?',
    slots: { f5A: { label: '정사각형의 한 변', min: 2, max: 12, step: 2, value: 6, color: 'sky', format: (v) => v + ' cm', hint: '원의 반지름 = 한 변 ÷ 2' } },
    presets: [{ label: '한 변 6 cm (교과서)', v: { f5A: 6 } }, { label: '한 변 4 cm', v: { f5A: 4 } }, { label: '한 변 10 cm', v: { f5A: 10 } }],
    rand: (s) => ({ f5A: pickOther([2, 4, 6, 8, 10, 12], s.f5A) }),
    model(s) {
      const sd = s.f5A, rc = sd / 2, O = pt(0, 0);
      const outer = [0, 1, 2, 3].map((q) => {
        const a0 = q * PI / 2, mid = a0 + PI / 4;
        return arcPiece({ name: '원의 호', desc: '원의 호', c: O, R: 1, a0, a1: a0 + PI / 2, rcm: rc, deg: 90, color: ARCC[0], sector: true, lab: { pt: polar(O, 1, mid), dir: pt(Math.cos(mid), Math.sin(mid)) } });
      });
      const corners = [pt(-1, -1), pt(1, -1), pt(1, 1), pt(-1, 1)], starts = [0, PI / 2, PI, 3 * PI / 2];
      const inner = corners.map((c, q) => {
        const a0 = starts[q], mid = a0 + PI / 4, m = polar(c, 1, mid), d = unit(-m.x, -m.y);
        return arcPiece({ name: '사분원의 호', desc: '사분원의 호', c, R: 1, a0, a1: a0 + PI / 2, rcm: rc, deg: 90, color: ARCC[1], sector: true, degR: 0.88, labAlign: 'center', lab: { pt: m, dir: d } });
      });
      const P = outer.concat(inner);
      P.forEach((q) => { q.labelText = piP(q.len.n, q.len.d); });
      const one = P[0].len, four = mkL(one.n * 4, one.d, 0);
      const groups = [
        { idx: [0, 1, 2, 3], name: '원의 호 4개', cap: '각각 ' + P[0].cap.replace(' (cm)', '') + ', 합 ' + piP(four.n, four.d) + ' (cm)', text: '원의 호 4개: 한 개는 반지름 ' + rc + ' cm, 중심각 90° → $' + P[0].eq + '$ (cm). 4개를 모으면 원 하나의 둘레예요: $' + texPi(four) + '$ (cm)' },
        { idx: [4, 5, 6, 7], name: '사분원의 호 4개', cap: '각각 ' + P[0].cap.replace(' (cm)', '') + ', 합 ' + piP(four.n, four.d) + ' (cm)', text: '사분원의 호 4개: 한 개는 반지름 ' + rc + ' cm, 중심각 90° → $' + P[4].eq + '$ (cm). 4개를 모아도 원 하나의 둘레예요: $' + texPi(four) + '$ (cm)' }
      ];
      const tot = sumL(P.map((p) => p.len));
      const petals = [
        [M_(pt(0, -1)), A_(O, 1, -PI / 2, 0, false), A_(pt(1, -1), 1, PI / 2, PI, false)],
        [M_(pt(1, 0)), A_(O, 1, 0, PI / 2, false), A_(pt(1, 1), 1, PI, 3 * PI / 2, false)],
        [M_(pt(0, 1)), A_(O, 1, PI / 2, PI, false), A_(pt(-1, 1), 1, 3 * PI / 2, TAU, false)],
        [M_(pt(-1, 0)), A_(O, 1, PI, 3 * PI / 2, false), A_(pt(-1, -1), 1, 0, PI / 2, false)]
      ];
      return finishModel(P, { groups, petals, sd, rc, sumText: piP(one.n, one.d) + ' × 8 = ' + cmText(tot) });
    },
    bbox: () => ({ x0: -1, x1: 1, y0: -1, y1: 1.28 }),
    drawBase(b, s, M, st, lab, thumb) {
      M.petals.forEach((r) => regionFill(b, r, FILLC, 0.3));
      const O = pt(0, 0), C4 = [pt(-1, -1), pt(1, -1), pt(1, 1), pt(-1, 1)];
      b.poly(C4, { color: 'ink', width: 1.8, alpha: 0.6 });
      b.circle(O, 1, { color: 'ink', width: 1.4, alpha: 0.35 });
      b.point(O, { r: 4, color: 'ink', glow: false });
      if (thumb) return;
      const y = 1.2;
      b.seg(pt(-1, y), pt(1, y), { color: 'ink', width: 1.6, alpha: 0.85 });
      b.seg(pt(-1, y - 0.05), pt(-1, y + 0.05), { color: 'ink', width: 1.6, alpha: 0.85 });
      b.seg(pt(1, y - 0.05), pt(1, y + 0.05), { color: 'ink', width: 1.6, alpha: 0.85 });
      b.text(pt(0, y), M.sd + ' cm', { dy: 16, color: 'ink', size: 16, baseline: 'middle' });
      if (!st.plain) {
        b.seg(O, pt(1, 0), dashed);
        b.text(pt(0.74, 0), M.rc + ' cm', { dy: -13, color: 'ink', size: 15, baseline: 'middle' });
      }
    },
    stem: (s, M) => '그림과 같이 한 변의 길이가 ' + M.sd + ' cm인 정사각형에서 색칠한 부분의 둘레의 길이는?',
    cands(M) {
      const P = M.total;
      return [scaleL(P, 1, 2, 1, 1), scaleL(P, 2, 3, 1, 1), scaleL(P, 5, 6, 1, 1), scaleL(P, 7, 6, 1, 1), scaleL(P, 2, 1, 1, 1), scaleL(P, 3, 4, 1, 1)];
    },
    introExtra: () => '호는 바깥쪽 원의 호 4개와 안쪽으로 오목한 사분원의 호 4개예요.',
    guide0: '바깥쪽 호 4개는 모으면 원 하나, 안쪽 호 4개는 모으면 반지름이 같은 원 하나예요.',
    formula: (M) => '<p>원의 반지름 = 사분원의 반지름 = ' + M.rc + ' cm (한 변의 절반)</p>',
    quick: (M) => '바깥쪽 호 4개는 합치면 원 하나: $2\\pi\\times' + M.rc + '=' + 2 * M.rc + '\\pi$. 안쪽 사분원의 호 4개도 합치면 반지름 ' + M.rc + ' cm인 원 하나: $' + 2 * M.rc + '\\pi$.<br>따라서 $' + texSum(M.total) + '$ (cm)',
    notes: ['사분원의 중심은 정사각형의 꼭짓점이고, 반지름은 한 변의 절반이에요.', '정사각형의 변은 색칠한 부분의 경계가 아니에요. 둘레에 넣지 않아요.'],
    warn: '정사각형의 변은 둘레에 넣지 않아요. 색칠한 부분의 경계는 호뿐이에요.'
  };

  /* ---------- 18-10 : 서로의 중심을 지나는 두 원이 겹친 부분 ---------- */
  const LENS = {
    id: 'f5-lens', short: '겹친 두 원', title: '겹친 두 원의 둘레',
    question: '반지름이 같은 두 원이 서로의 중심을 지나게 겹쳤어. 겹친 렌즈 모양의 둘레는 호 2개야. 중심각은 몇 도일까?',
    slots: { f5A: { label: '두 원의 반지름', min: 6, max: 24, step: 3, value: 12, color: 'sky', format: (v) => v + ' cm', hint: '중심 O, O′ 사이의 거리도 같은 값' } },
    presets: [{ label: '12 cm (교과서)', v: { f5A: 12 } }, { label: '9 cm', v: { f5A: 9 } }, { label: '18 cm', v: { f5A: 18 } }],
    rand: (s) => ({ f5A: pickOther([6, 9, 12, 15, 18, 21, 24], s.f5A) }),
    model(s) {
      const R = s.f5A, O1 = pt(-0.5, 0), O2 = pt(0.5, 0), a = PI / 3;
      const P = [
        arcPiece({ name: '오른쪽 호', desc: '원 O의 호 AB', c: O1, R: 1, a0: -a, a1: a, rcm: R, deg: 120, color: ARCC[0], sector: true, degShift: 0.4, lab: { pt: polar(O1, 1, PI / 6), dir: pt(Math.cos(PI / 6), Math.sin(PI / 6)) } }),
        arcPiece({ name: '왼쪽 호', desc: '원 O′의 호 AB', c: O2, R: 1, a0: PI - a, a1: PI + a, rcm: R, deg: 120, color: ARCC[1], sector: true, degShift: -0.4, lab: { pt: polar(O2, 1, 5 * PI / 6), dir: pt(Math.cos(5 * PI / 6), Math.sin(5 * PI / 6)) } })
      ];
      const region = [A_(O1, 1, -a, a, false), A_(O2, 1, PI - a, PI + a, false)];
      return finishModel(P, { region, R, O1, O2 });
    },
    bbox: () => ({ x0: -1.5, x1: 1.5, y0: -1, y1: 1 }),
    drawBase(b, s, M, st, lab, thumb) {
      const { O1, O2, R } = M, A = pt(0, -S3 / 2), B = pt(0, S3 / 2);
      regionFill(b, M.region, FILLC, 0.3);
      b.circle(O1, 1, { color: 'ink', width: 1.8, alpha: 0.5 });
      b.circle(O2, 1, { color: 'ink', width: 1.8, alpha: 0.5 });
      b.seg(O1, O2, { color: 'ink', width: 1.8, alpha: 0.8 });
      if (!st.plain) {
        [[O1, A], [O2, A], [O1, B], [O2, B]].forEach((e) => b.seg(e[0], e[1], { color: 'ink', width: 1.4, alpha: 0.5, dash: [5, 4] }));
        b.ticks(O1, O2, { color: 'ink' }); b.ticks(O1, A, { color: 'ink' }); b.ticks(O2, A, { color: 'ink' });
      }
      pointLab(b, O1, 'O', -12, -14, 'right', thumb); pointLab(b, O2, 'O′', 12, -14, 'left', thumb);
      pointLab(b, A, 'A', 0, -16, 'center', thumb); pointLab(b, B, 'B', 0, 17, 'center', thumb);
      if (!thumb) b.text(pt(0, 0), R + ' cm', { dy: -19, color: 'ink', size: 16, baseline: 'middle' });
    },
    stem: (s, M) => '그림과 같이 반지름의 길이가 ' + M.R + ' cm인 두 원 O, O′이 서로의 중심을 지나고 두 점 A, B에서 만날 때, 색칠한 부분의 둘레의 길이는?',
    cands(M) { const R = M.R; return [mkL(R * 5, 6, 0), mkL(R, 1, 0), mkL(R * 7, 6, 0), mkL(R * 3, 2, 0), mkL(R, 2, 0), mkL(R * 2, 1, 0)]; },
    introExtra: () => '△OAO′는 세 변이 모두 반지름이라 정삼각형이에요.',
    guide0: '△OAO′는 세 변의 길이가 같은 정삼각형이라 ∠AOO′ = 60°, 그래서 ∠AOB = 120°예요.',
    formula: (M) => '<p>△OAO′는 정삼각형 → ∠AOO′ = 60° → 중심각 ∠AOB = 120°</p>',
    quick: (M) => '두 호의 모양이 같고 중심각이 120°이므로 $2\\times\\Bigl(2\\pi\\times' + M.R + '\\times\\dfrac{120}{360}\\Bigr)=' + texPi(M.total) + '$ (cm)',
    notes: ['△OAO′가 정삼각형이라는 것에서 중심각 120°를 찾아요. 60°를 그대로 쓰지 않아요.', 'OO′ 선분은 색칠한 부분의 경계가 아니에요. 둘레에 넣지 않아요.'],
    warn: '중심각은 60°가 아니라 120°예요. 중심 O에서 보면 ∠AOB = 2 × ∠AOO′이에요.'
  };

  /* ---------- 파낸 반원 (③ 길이·둘레에서 옮김) ---------- */
  const CUT = {
    id: 'f5-cut', short: '파낸 반원', title: '반원에서 작은 반원을 파낸 도형',
    question: '큰 반원에서 작은 반원을 파냈어. 안쪽으로 파인 호도 둘레에 들어갈까?',
    slots: {
      f5A: { label: '큰 반원의 반지름', min: 4, max: 12, step: 1, value: 8, color: 'sky', format: (v) => v + ' cm' },
      f5B: { label: '파낸 반원의 반지름', min: 1, max: 11, step: 1, value: 4, color: 'violet', format: (v) => v + ' cm', hint: '그림의 노란 점을 끌어도 돼요' }
    },
    fix: (s) => { s.f5B = Math.min(s.f5B, s.f5A - 1); },
    presets: [{ label: '8 cm · 4 cm', v: { f5A: 8, f5B: 4 } }, { label: '6 cm · 3 cm', v: { f5A: 6, f5B: 3 } }, { label: '10 cm · 2 cm', v: { f5A: 10, f5B: 2 } }],
    rand: (s) => { const r = 6 + Math.floor(Math.random() * 7); return { f5A: r, f5B: 2 + Math.floor(Math.random() * (r - 3)) }; },
    model(s) {
      const r = s.f5A, q = Math.min(s.f5B, r - 1), O = pt(0, 0), Cq = pt(-r + q, 0);
      const P = [
        arcPiece({ name: '큰 반원의 호', desc: '큰 반원의 호', c: O, R: r, a0: PI, a1: TAU, rcm: r, deg: 180, color: ARCC[0], sector: true, lab: { pt: pt(0, -r), dir: pt(0, -1) } }),
        segPiece({ name: '남은 지름', desc: '남은 지름(직선 부분)', p: pt(r, 0), q: pt(-r + 2 * q, 0), cm: 2 * (r - q), why: '2 × (' + r + ' − ' + q + ')', lab: { pt: pt((r + (-r + 2 * q)) / 2, 0), dir: pt(0, -1) } }),
        arcPiece({ name: '파낸 반원의 호', desc: '파낸 반원의 호', c: Cq, R: q, a0: PI, a1: TAU, rev: true, rcm: q, deg: 180, color: ARCC[1], sector: true, lab: { pt: pt(-r + q, -q), dir: pt(0, 1) } })
      ];
      const region = [M_(pt(-r, 0)), A_(O, r, PI, TAU, false), L_(pt(-r + 2 * q, 0)), A_(Cq, q, 0, PI, true)];
      return finishModel(P, { region, r, q, Cq });
    },
    bbox: (s, M) => ({ x0: -M.r, x1: M.r, y0: -M.r, y1: 0.12 * M.r }),
    drawBase(b, s, M, st, lab, thumb) {
      const { r, q } = M, O = pt(0, 0), by = 0.1 * r;
      regionFill(b, M.region, FILLC, 0.28);
      b.seg(pt(-r, 0), pt(-r + 2 * q, 0), { color: 'ink', width: 1.5, alpha: 0.5, dash: [5, 4] });
      b.point(O, { r: 4, color: 'ink', glow: false });
      if (thumb) return;
      const cap = (x0, x1) => { b.seg(pt(x0, by), pt(x1, by), { color: 'ink', width: 1.6, alpha: 0.8 }); b.seg(pt(x0, by - 0.03 * r), pt(x0, by + 0.03 * r), { color: 'ink', width: 1.6, alpha: 0.8 }); b.seg(pt(x1, by - 0.03 * r), pt(x1, by + 0.03 * r), { color: 'ink', width: 1.6, alpha: 0.8 }); };
      cap(-r, -r + 2 * q); cap(0, r);
      b.text(pt(-r + q, by), '지름 ' + 2 * q + ' cm', { dy: 17, color: 'ink', size: 15, baseline: 'middle' });
      b.text(pt(r / 2, by), '반지름 ' + r + ' cm', { dy: 17, color: 'ink', size: 15, baseline: 'middle' });
    },
    handles(b, s, M) {
      const { r, q } = M;
      b.handle('f5cut', pt(-r + 2 * q, 0), {
        color: 'amber', r: 8,
        drag: (w) => {
          const v = clamp(Math.round((w.x + r) / 2), 1, s.f5A - 1);
          if (v !== s.f5B) { s.f5B = v; s.f5Pick = null; refreshReview(window.lab); }
        }
      });
    },
    stem: (s, M) => '그림은 반지름의 길이가 ' + M.r + ' cm인 반원에서 반지름의 길이가 ' + M.q + ' cm인 반원을 파낸 도형이다. 색칠한 부분의 둘레의 길이는?',
    cands(M) { const r = M.r, q = M.q, C = 2 * (r - q); return [mkL(r, 1, C), mkL(r + q, 1, 0), mkL(r + q, 1, 2 * r), mkL(r + q, 1, C / 2), mkL(r + q, 1, 2 * C), mkL(r, 1, 0)]; },
    introExtra: () => '안쪽으로 파인 호도 경계라서 둘레에 들어가요.',
    guide0: '파낸 곳의 호도 색칠한 부분의 경계예요. 파낸 반원의 지름 부분은 경계가 아니에요.',
    formula: (M) => '<p>남은 지름 = 2 × (' + M.r + ' − ' + M.q + ') = ' + 2 * (M.r - M.q) + ' cm</p>',
    quick: (M) => '큰 반원의 호 $\\pi\\times' + M.r + '$ + 파낸 반원의 호 $\\pi\\times' + M.q + '$ + 남은 지름 $' + 2 * (M.r - M.q) + '$ → $' + texSum(M.total) + '$ (cm)',
    notes: ['넓이는 작은 반원을 빼지만, 둘레는 파낸 호도 더해요.', '파낸 반원의 지름 부분은 색칠한 부분의 경계가 아니에요. 남은 지름 부분만 더해요.'],
    warn: '파낸 부분의 호는 안쪽으로 굽어 있어도 둘레에 들어가요. 파낸 반원의 지름은 들어가지 않아요.'
  };

  /* ---------- 운동장 트랙 (③ 길이·둘레에서 옮김) ---------- */
  const TRACK = {
    id: 'f5-track', short: '운동장 트랙', title: '운동장 트랙의 둘레',
    question: '양쪽 끝이 반원인 트랙이야. 두 반원의 호를 합치면 어떤 도형의 둘레가 될까?',
    slots: {
      f5A: { label: '반원의 반지름', min: 2, max: 10, step: 1, value: 5, color: 'sky', format: (v) => v + ' cm' },
      f5B: { label: '직선 구간의 길이', min: 2, max: 20, step: 1, value: 10, color: 'violet', format: (v) => v + ' cm', hint: '그림의 노란 점을 끌어도 돼요' }
    },
    presets: [{ label: '반지름 5 · 직선 10', v: { f5A: 5, f5B: 10 } }, { label: '반지름 3 · 직선 6', v: { f5A: 3, f5B: 6 } }, { label: '반지름 6 · 직선 8', v: { f5A: 6, f5B: 8 } }],
    rand: (s) => ({ f5A: 2 + Math.floor(Math.random() * 8), f5B: 4 + Math.floor(Math.random() * 15) }),
    model(s) {
      const r = s.f5A, L = s.f5B, cl = pt(-L / 2, 0), cr = pt(L / 2, 0);
      const P = [
        segPiece({ name: '윗변', desc: '윗변(직선 구간)', p: pt(-L / 2, -r), q: pt(L / 2, -r), cm: L, plainLabel: true, lab: { pt: pt(0, -r), dir: pt(0, -1) } }),
        arcPiece({ name: '오른쪽 반원', desc: '오른쪽 반원의 호', c: cr, R: r, a0: -PI / 2, a1: PI / 2, rcm: r, deg: 180, color: ARCC[0], sector: true, lab: { pt: polar(cr, r, -PI / 4), dir: pt(Math.cos(-PI / 4), Math.sin(-PI / 4)) } }),
        segPiece({ name: '아랫변', desc: '아랫변(직선 구간)', p: pt(L / 2, r), q: pt(-L / 2, r), cm: L, lab: { pt: pt(0, r), dir: pt(0, 1) } }),
        arcPiece({ name: '왼쪽 반원', desc: '왼쪽 반원의 호', c: cl, R: r, a0: PI / 2, a1: 3 * PI / 2, rcm: r, deg: 180, color: ARCC[1], sector: true, lab: { pt: polar(cl, r, 5 * PI / 4), dir: pt(Math.cos(5 * PI / 4), Math.sin(5 * PI / 4)) } })
      ];
      const region = [M_(pt(-L / 2, -r)), L_(pt(L / 2, -r)), A_(cr, r, -PI / 2, PI / 2, false), L_(pt(-L / 2, r)), A_(cl, r, PI / 2, 3 * PI / 2, false)];
      return finishModel(P, { region, r, L });
    },
    bbox: (s, M) => ({ x0: -M.L / 2 - M.r, x1: M.L / 2 + M.r, y0: -M.r, y1: M.r }),
    drawBase(b, s, M, st, lab, thumb) {
      const { r, L } = M, cl = pt(-L / 2, 0), cr = pt(L / 2, 0);
      regionFill(b, M.region, FILLC, 0.28);
      b.seg(pt(-L / 2, -r), pt(-L / 2, r), { color: 'ink', width: 1.4, alpha: 0.4, dash: [5, 4] });
      b.seg(pt(L / 2, -r), pt(L / 2, r), { color: 'ink', width: 1.4, alpha: 0.4, dash: [5, 4] });
      b.seg(cr, pt(L / 2 + r, 0), dashed);
      b.point(cl, { r: 3.6, color: 'ink', glow: false }); b.point(cr, { r: 3.6, color: 'ink', glow: false });
      if (!thumb) b.text(pt(L / 2 + r / 2, 0), r + ' cm', { dy: -14, color: 'ink', size: 15, baseline: 'middle' });
    },
    handles(b, s, M) {
      const { r, L } = M;
      b.handle('f5len', pt(L / 2 + r, 0), {
        color: 'amber', r: 8,
        drag: (w) => {
          const v = clamp(Math.round(2 * (w.x - s.f5A)), 2, 20);
          if (v !== s.f5B) { s.f5B = v; s.f5Pick = null; refreshReview(window.lab); }
        }
      });
    },
    stem: (s, M) => '그림과 같이 양쪽 끝이 반원인 트랙이 있다. 반원의 반지름이 ' + M.r + ' cm, 직선 구간의 길이가 ' + M.L + ' cm일 때, 트랙의 둘레의 길이는?',
    cands(M) { const r = M.r, L = M.L; return [mkL(2 * r, 1, L), mkL(r, 1, 2 * L), mkL(r, 1, L), mkL(4 * r, 1, 2 * L), mkL(2 * r, 1, 4 * L), mkL(r * r, 1, 2 * L)]; },
    introExtra: () => '두 반원의 호를 합치면 원 하나의 둘레예요.',
    guide0: '두 반원의 호를 합치면 반지름 ' + '이 같은 원 하나의 둘레(2πr)가 돼요.',
    formula: (M) => '<p>두 반원 = 원 하나 → $2\\pi\\times' + M.r + '=' + 2 * M.r + '\\pi$, 직선 구간 2개 = ' + 2 * M.L + ' cm</p>',
    quick: (M) => '두 반원의 호는 합치면 원 하나: $2\\pi\\times' + M.r + '=' + 2 * M.r + '\\pi$. 직선 구간 2개: $' + M.L + '\\times2=' + 2 * M.L + '$ → $' + texSum(M.total) + '$ (cm)',
    notes: ['반원의 호 2개를 모으면 원 하나의 둘레(2πr)예요. 호 한 개를 2πr로 계산하지 않도록 주의해요.', '가운데 세로 점선은 이어 붙인 자리일 뿐 둘레가 아니에요.'],
    warn: '반원 한 개의 호는 πr이에요. 두 개를 합쳐야 2πr(원 하나)이 돼요.'
  };

  /* ================================================================== 끈의 최소 길이 (원기둥 묶기) ========== */
  // 원기둥을 위에서 본 모양(원)을 끈으로 팽팽하게 묶을 때: 끈 = 직선 부분 + 곡선 부분.
  //  · 직선 부분: 이웃한 두 원의 중심을 이은 선분과 길이가 같다(직사각형의 마주 보는 변).
  //  · 곡선 부분: 부채꼴의 호. 부채꼴을 한 줄로 복사해 늘어놓고 가로로만 밀어 한 점으로 모으면 원 하나(중심각의 합 360°).
  // 진행 t 의 구간: 직선 부분 확인(u) → 잠깐 멈춤 → 곡선 부분 모으기(g)
  const T_U0 = 0.04, T_U1 = 0.34, T_AFTER_U = 0.38, T_G0 = 0.42, T_G1 = 0.97;
  const BDUR = 14, STAG = 0.12, ROW_GAP = 0.5;
  const bdCm = (x) => x + ' cm';

  // 중심을 시계 방향으로 이은 닫힌 길(반지름 = 1단위, y 아래쪽). 한 줄에 놓인 가운데 원은 호가 0°(곧게 지나감).
  const BAND = {
    sq4: {
      id: 'f5-sq4', short: '끈 · 원 4개', title: '원기둥 4개를 묶은 끈', textbook: true, r0: 3, np: null,
      pts: () => [[0, 0], [2, 0], [2, 2], [0, 2]], count: () => 4,
      rad: { v: 0, ang: 180, lab: [12, 16] },
      ch: [[1, 1, 1, 4], [1, 1, 1, 2], [3, 2, 1, 2], [3, 2, 1, 1]]
    },
    rect: {
      id: 'f5-rect', short: '끈 · 원 2×n', title: '원기둥 2×n개를 묶은 끈', textbook: true, r0: 4, np: { label: '줄 수 (가로 2개씩)', min: 2, max: 5, step: 1, value: 3, hint: '3줄이면 원기둥 6개' },
      pts: (n) => { const p = [[0, 0], [2, 0]]; for (let k = 1; k < n; k++) p.push([2, 2 * k]); for (let k = n - 1; k >= 1; k--) p.push([0, 2 * k]); return p; },
      count: (n) => 2 * n,
      rad: { v: 1, ang: 0, lab: [8, -14] },
      ch: [[1, 2, 1, 2], [1, 2, 1, 1], [1, 1, 1, 2], [2, 1, 1, 1]]
    },
    tri3: {
      id: 'f5-tri3', short: '끈 · 원 3개', title: '원기둥 3개를 묶은 끈', textbook: true, r0: 5, np: null,
      pts: () => [[1, 0], [2, S3], [0, S3]], count: () => 3,
      rad: { v: 0, ang: 214, lab: [-6, -14] },
      ch: [[1, 3, 1, 3], [1, 3, 1, 1], [1, 1, 1, 3], [2, 1, 1, 1]]
    },
    line: {
      id: 'f5-line', short: '끈 · 한 줄', title: '원기둥을 한 줄로 묶은 끈', textbook: false, r0: 4, np: { label: '원기둥의 개수', min: 2, max: 5, step: 1, value: 2, hint: '한 줄로 늘어놓은 원기둥' },
      pts: (n) => { const p = []; for (let k = 0; k < n; k++) p.push([2 * k, 0]); for (let k = n - 2; k >= 1; k--) p.push([2 * k, 0]); return p; },
      count: (n) => n,
      rad: { v: 0, ang: 200, lab: [-6, -14] },
      ch: [[1, 2, 1, 2], [1, 2, 1, 1], [1, 1, 1, 2], [2, 1, 1, 1]]
    }
  };
  const npOf = (key, s) => (BAND[key].np ? s.f5B : 0);

  const gcache = new Map();
  function bandGeom(key, np) {
    const ck = key + '|' + np;
    if (gcache.has(ck)) return gcache.get(ck);
    const V = BAND[key].pts(np).map(([x, y]) => ({ x, y }));
    const m = V.length;
    const th = V.map((p, i) => { const q = V[(i + 1) % m]; return Math.atan2(q.y - p.y, q.x - p.x); });
    const keyOf = (p) => p.x.toFixed(4) + ',' + p.y.toFixed(4);
    const edges = V.map((p, i) => {
      const q = V[(i + 1) % m];
      return { i, a: p, b: q, th: th[i], d: { x: Math.cos(th[i]), y: Math.sin(th[i]) }, n: { x: Math.cos(th[i] - PI / 2), y: Math.sin(th[i] - PI / 2) }, dup: false, k: [keyOf(p), keyOf(q)].sort().join('|') };
    });
    const seen = new Set();
    edges.forEach((e) => { if (seen.has(e.k)) e.dup = true; seen.add(e.k); });
    const arcs = [];
    for (let i = 0; i < m; i++) {
      const prev = (i - 1 + m) % m;
      let turn = ((th[i] - th[prev]) % TAU + TAU) % TAU;
      if (turn > TAU - 1e-9) turn = 0;
      if (turn > 1e-9) arcs.push({ v: i, a0: th[prev] - PI / 2, a1: th[prev] - PI / 2 + turn, deg: turn * 180 / PI });
    }
    const uniq = []; const us = new Set();
    V.forEach((p) => { const kk = keyOf(p); if (!us.has(kk)) { us.add(kk); uniq.push(p); } });
    const xs = V.map((p) => p.x), ys = V.map((p) => p.y);
    const G = { V, uniq, edges, arcs, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
    gcache.set(ck, G);
    return G;
  }

  const mcache = new Map();
  function bandModel(key, r, np) {
    const ck = key + '|' + r + '|' + np;
    if (mcache.has(ck)) return mcache.get(ck);
    const G = bandGeom(key, np);
    const E = G.edges.length;
    const arcs = G.arcs.map((a, k) => {
      const deg = Math.round(a.deg);
      return { k, v: a.v, a0: a.a0, a1: a.a1, deg, color: ARCC[k % ARCC.length], len: rat(r * deg, 180), val: PI * r * deg / 180 };
    });
    const degSum = arcs.reduce((x, a) => x + a.deg, 0);
    const straight = 2 * r * E;
    const M = { key, r, np, E, G, arcs, degSum, each: 2 * r, straight, curveVal: arcs.reduce((x, a) => x + a.val, 0), total: mkL(2 * r, 1, straight), n: BAND[key].count(np) };
    mcache.set(ck, M);
    return M;
  }
  const bandChoices = (key, M) => {
    const ans = M.total;
    return makeChoices(ans, BAND[key].ch.map(([pn, pd, sn, sd]) => mkL(ans.n * pn, ans.d * pd, ans.c * sn / sd)));
  };

  /* ---- 진행 t → 장면 */
  const phaseOf = (t) => ({ t, u: ease((t - T_U0) / (T_U1 - T_U0)), g: clamp((t - T_G0) / (T_G1 - T_G0), 0, 1) });
  const slideP = (nA, k, gg) => ease((seg01(gg, 0.45, 1) - STAG * k) / (1 - STAG * (nA - 1)));   // k번째 복사 조각이 모이는 정도
  const appearP = (nA, k, gg) => ease(seg01(gg, 0.34 * k / nA, 0.34 * k / nA + 0.16));          // k번째 복사 조각이 나타나는 정도
  function arrivedOf(M, gg) { return M.arcs.filter((a) => slideP(M.arcs.length, a.k, gg) >= 0.999); }
  function phaseName(t) {
    if (t < 0.02) return '처음 모양';
    if (t < T_U1) return '직선 부분 확인';
    if (t < T_G0) return '직선 부분 완성';
    if (t < 0.985) return '곡선 부분 모으기';
    return '곡선 → 원 하나';
  }
  function stepTarget(M, step) {
    if (step <= 1) return 0;
    if (step < 3 + M.arcs.length) return T_AFTER_U;
    return 1;
  }

  /* ---- 배치: 그림 + (복사한 부채꼴을 한 줄로 늘어놓는 자리 = 모으는 원) */
  function arcBox(a) {
    let x0 = 0, x1 = 0;
    for (let i = 0; i <= 24; i++) { const x = Math.cos(a.a0 + (a.a1 - a.a0) * i / 24); if (x < x0) x0 = x; if (x > x1) x1 = x; }
    return { xmin: x0, xmax: x1 };
  }
  function bandLayout(b, G, M, plain) {
    const aw = Math.max(10, b.W - (b.panes ? 0 : b.insets.left + b.insets.right));
    const ah = Math.max(10, b.H - (b.panes ? 0 : b.insets.top + b.insets.bottom));
    const pad = b.pad * Math.min(aw, ah);
    const W = aw - 2 * pad, H = ah - 2 * pad;
    const fx0 = G.x0 - 1, fx1 = G.x1 + 1, fy0 = G.y0 - 1, fy1 = G.y1 + 1;
    const narrow = aw < 560;
    const tiny = !!b.thumb;
    const PAD_X = tiny ? 8 : narrow ? 38 : 52, PAD_T = tiny ? 8 : narrow ? 30 : 38, PAD_B = tiny ? 8 : narrow ? 24 : 34, BOT_TXT = 56, HALF_TXT = 96, GAP = 0.5;
    if (plain) {
      const k0 = Math.max(4, Math.min((W - 2 * PAD_X) / (fx1 - fx0), (H - PAD_T - PAD_B) / (fy1 - fy0)));
      return { mode: 'fig', D: { x: fx1 + 2, y: fy0 }, k: k0, rowC: [], focus: { x: [fx0 - PAD_X / k0, fx1 + PAD_X / k0], y: [fy0 - PAD_T / k0, fy1 + PAD_B / k0] } };
    }
    const boxes = M.arcs.map(arcBox);
    const rowW = boxes.reduce((x, bx) => x + (bx.xmax - bx.xmin), 0) + ROW_GAP * Math.max(0, boxes.length - 1);
    const Wrow = Math.max(rowW, 2.2);
    const res = [];
    for (const mode of ['right', 'below']) {
      let k = 40, box = null, D = null;
      for (let it = 0; it < 6; it++) {
        const hw = Math.max(Wrow / 2, HALF_TXT / k);
        if (mode === 'right') D = { x: fx1 + GAP + 26 / k + hw, y: (fy0 + fy1) / 2 };
        else D = { x: (fx0 + fx1) / 2, y: fy1 + GAP + 26 / k + 1 };
        box = { x0: Math.min(fx0, D.x - hw), x1: Math.max(fx1, D.x + hw), y0: Math.min(fy0, D.y - 1), y1: Math.max(fy1, D.y + 1 + BOT_TXT / k) };
        k = Math.max(4, Math.min((W - 2 * PAD_X) / (box.x1 - box.x0), (H - PAD_T - PAD_B) / (box.y1 - box.y0)));
      }
      res.push({ mode, k, D, box });
    }
    const pick = res[0].k >= res[1].k * 0.98 ? res[0] : res[1];
    // 복사 조각이 처음 놓이는 자리(같은 가로줄 y = D.y)
    const rowC = [];
    let x = pick.D.x - rowW / 2;
    boxes.forEach((bx) => { rowC.push({ x: x - bx.xmin, y: pick.D.y }); x += (bx.xmax - bx.xmin) + ROW_GAP; });
    return {
      mode: pick.mode, D: pick.D, k: pick.k, rowC,
      focus: { x: [pick.box.x0 - PAD_X / pick.k, pick.box.x1 + PAD_X / pick.k], y: [pick.box.y0 - PAD_T / pick.k, pick.box.y1 + PAD_B / pick.k] }
    };
  }

  const at = (p, d, k) => ({ x: p.x + d.x * k, y: p.y + d.y * k });

  function drawBand(b, s, lab, key) {
    const A = BAND[key], r = s.f5A, np = npOf(key, s), M = bandModel(key, r, np), G = M.G;
    const thumb = !!b.thumb;
    const tab = thumb ? 'explore' : (lab && lab.tab) || 'explore';
    const plain = !thumb && (tab === 'problem' || (tab === 'review' && s.step === 0));   // 교과서 그림 그대로
    const review = !thumb && tab === 'review' && s.step > 0;
    const step = review ? s.step : 99;
    const t = plain || thumb ? 0 : clamp(+s.f5T || 0, 0, 1);
    const ph = phaseOf(t);
    const u = ph.u, gg = ph.g;
    const nA = M.arcs.length;
    const LY = bandLayout(b, G, M, plain || thumb);
    b.focus = LY.focus;
    const D = LY.D, k = b.k;
    const txt = !thumb;
    const marks = !plain && (review ? step >= 2 : true) && u > 0.02;
    const dimStraight = review && step >= 3;
    const arcShown = (a) => !plain && (review ? step >= 3 + a.k : true);
    const colors = !plain && !(review && step === 0);

    // 1) 모으는 자리(점선 원)
    if (!plain && !thumb) {
      b.circle(D, 1, { color: 'muted', width: 1.6, dash: [5, 5], alpha: gg > 0.4 ? 0.9 : 0.45 });
      b.point(D, { r: 2.6, color: 'muted', glow: false });
      if (txt && gg < 0.02) b.text(D, '모으는 자리', { color: 'muted', size: 13, dy: 17, baseline: 'middle' });
    }

    // 2) 원(원기둥의 윗면)
    G.uniq.forEach((c) => {
      b.circle(c, 1, { color: 'ink', alpha: 0.5, width: 1.5, fill: 'ink', fillAlpha: 0.06 });
      if (!plain) b.circle(c, 0.8, { color: 'ink', alpha: 0.14, width: 1 });
      if (!plain) b.point(c, { r: 2.6, color: 'muted', glow: false });
    });

    // 3) 직선 부분이 중심 선분과 같은 길이임을 보이는 직사각형(끈 위치는 그대로) — 서서히 나타남
    if (marks) {
      G.edges.forEach((ed) => {
        const pa = at(ed.a, ed.n, 1), pb = at(ed.b, ed.n, 1);
        b.poly([ed.a, ed.b, pb, pa], { fill: SEGC, fillAlpha: 0.06 * u, color: null });
        if (!ed.dup) {
          b.seg(ed.a, ed.b, { color: SEGC, width: 2, dash: [6, 4], alpha: 0.95 * u, ref: ['straight', 'e' + ed.i] });
          b.ticks(ed.a, ed.b, { color: SEGC });
        }
        b.seg(ed.a, pa, { color: 'muted', width: 1.3, dash: [3, 3], alpha: 0.9 * u });
        b.seg(ed.b, pb, { color: 'muted', width: 1.3, dash: [3, 3], alpha: 0.9 * u });
        if (txt && u > 0.6) {
          b.right(pa, ed.a, at(pa, ed.d, 1), { color: 'muted', size: 8 });
          b.right(pb, ed.b, at(pb, ed.d, -1), { color: 'muted', size: 8 });
        }
      });
    }

    // 4) 부채꼴(색칠) — 그림 위의 호와 그 부채꼴
    M.arcs.forEach((a) => {
      if (!arcShown(a)) return;
      const ref = ['curve', 'a' + a.k], c = G.V[a.v], cur = review && step === 3 + a.k;
      b.arc(c, 1, a.a0, a.a1, { sector: true, fill: a.color, fillAlpha: cur ? 0.42 : 0.24, color: null, ref });
      b.seg(c, at(c, pt(Math.cos(a.a0), Math.sin(a.a0)), 1), { color: a.color, width: 1.6, alpha: 0.8, ref });
      b.seg(c, at(c, pt(Math.cos(a.a1), Math.sin(a.a1)), 1), { color: a.color, width: 1.6, alpha: 0.8, ref });
    });

    // 5) 직선 부분(끈) — 제자리에서 그대로
    G.edges.forEach((ed) => {
      const pa = at(ed.a, ed.n, 1), pb = at(ed.b, ed.n, 1);
      const col = plain ? 'rose' : colors ? SEGC : 'ink';
      b.seg(pa, pb, { color: col, width: plain ? 3.4 : 5.5, alpha: dimStraight ? 0.5 : 1, glow: !plain && u > 0.98 && !dimStraight, ref: ['straight', 'e' + ed.i] });
      if (marks) b.ticks(pa, pb, { color: SEGC });
      if (txt && marks && u > 0.5) b.text(midP(pa, pb), String(M.each), { color: SEGC, size: 14, dx: ed.n.x * 17, dy: ed.n.y * 17 + 1, baseline: 'middle', alpha: u, halo: u > 0.98, ref: ['straight', 'e' + ed.i] });
    });
    if (txt && marks && u > 0.98) {
      const cx = G.uniq.reduce((x, p) => x + p.x, 0) / G.uniq.length, cy = G.uniq.reduce((x, p) => x + p.y, 0) / G.uniq.length;
      const off = 0;
      b.text(pt(cx, cy), '직선 부분', { color: SEGC, size: 13, dy: off - 10, ref: 'straight' });
      b.text(pt(cx, cy), M.each + ' × ' + M.E + ' = ' + M.straight, { color: SEGC, size: 15, dy: off + 10, ref: 'straight' });
    }

    // 6) 곡선 부분(끈의 호)
    M.arcs.forEach((a) => {
      if (!arcShown(a)) return;
      const ref = ['curve', 'a' + a.k], c = G.V[a.v];
      b.arc(c, 1, a.a0, a.a1, { color: plain ? 'rose' : colors ? a.color : 'ink', width: plain ? 3.4 : 5.5, ref, glow: review && step === 3 + a.k });
    });
    if (plain) {
      G.V.length && M.arcs.forEach((a) => b.arc(G.V[a.v], 1, a.a0, a.a1, { color: 'rose', width: 3.4 }));
    }

    // 7) 부채꼴 안의 표시: 중심각 · 반지름 · (정리 탭) 호의 길이
    if (txt && !plain) {
      const small = k < 48;
      M.arcs.forEach((a) => {
        if (!arcShown(a)) return;
        const ref = ['curve', 'a' + a.k], c = G.V[a.v], mid = (a.a0 + a.a1) / 2;
        b.arc(c, 0.27, a.a0, a.a1, { color: a.color, width: 1.8, ref });
        b.text(at(c, pt(Math.cos(mid), Math.sin(mid)), small ? 0.6 : 0.52), a.deg + '°', { color: a.color, size: small ? 13 : 14, baseline: 'middle', ref });
        const showR = !small || a.k === 0 || (review && step === 3 + a.k);
        if (showR) {
          const d0 = pt(Math.cos(a.a0), Math.sin(a.a0));
          b.text(at(c, d0, 1), 'r=' + r, { color: 'ink', size: 13, baseline: 'middle', align: d0.x > 0.35 ? 'left' : d0.x < -0.35 ? 'right' : 'center', dx: d0.x * 12, dy: d0.y * (Math.abs(d0.y) > 0.35 ? 14 : 4), ref });
        }
        if (review && step >= 3 + a.k) b.text(at(c, pt(Math.cos(mid), Math.sin(mid)), 1.5), NUM[a.k] + ' ' + piP(a.len[0], a.len[1]), { color: a.color, size: 15, baseline: 'middle', ref });
      });
    }

    // 8) 복사한 부채꼴: 한 줄에 나타났다가 가로로만 밀려 한 점으로 모임(제자리 회전·세로 이동 없음)
    if (!plain && !thumb && LY.rowC.length) {
      M.arcs.forEach((a) => {
        if (!arcShown(a)) return;
        const ap = appearP(nA, a.k, gg);
        if (ap <= 0.001) return;
        const row = LY.rowC[a.k], p = slideP(nA, a.k, gg), c = { x: row.x + (D.x - row.x) * p, y: row.y };
        const ref = ['curve', 'a' + a.k];
        b.arc(c, 1, a.a0, a.a1, { sector: true, fill: a.color, fillAlpha: 0.3 * ap, color: null, ref });
        b.seg(c, at(c, pt(Math.cos(a.a0), Math.sin(a.a0)), 1), { color: a.color, width: 1.6, alpha: 0.8 * ap, ref });
        b.seg(c, at(c, pt(Math.cos(a.a1), Math.sin(a.a1)), 1), { color: a.color, width: 1.6, alpha: 0.8 * ap, ref });
        b.arc(c, 1, a.a0, a.a1, { color: a.color, width: 5.5, alpha: ap, ref });
        if (txt) {
          const mid = (a.a0 + a.a1) / 2;
          const la = ap * (1 - seg01(p, 0.12, 0.45));
          if (la > 0.04) b.text(at(c, pt(Math.cos(mid), Math.sin(mid)), 0.55), a.deg + '°', { color: a.color, size: 14, baseline: 'middle', alpha: la, halo: la > 0.98, ref });
        }
      });
    }

    // 9) 모은 원 아래의 설명
    if (txt && !plain && gg > 0.02) {
      const arrived = arrivedOf(M, gg);
      if (arrived.length) {
        const eq = M.arcs.every((a) => a.deg === M.arcs[0].deg);
        const sum = arrived.reduce((x, a) => x + a.deg, 0);
        const l1 = eq ? M.arcs[0].deg + '°×' + arrived.length : arrived.map((a) => a.deg + '°').join('+');
        b.text(D, '중심각의 합 ' + l1 + ' = ' + sum + '°', { color: 'violet', size: 14, dy: k + 18 });
      }
      if (gg >= 0.999) b.text(D, '원 하나의 둘레 2π×' + r + ' = ' + (2 * r) + 'π cm', { color: 'sky', size: 15, dy: k + 40 });
    }

    // 10) 교과서 그림의 반지름 표시
    if (txt && plain) {
      const c = G.V[A.rad.v], an = A.rad.ang * PI / 180, d = pt(Math.cos(an), Math.sin(an));
      b.seg(c, at(c, d, 1), { color: 'ink', width: 1.6, alpha: 0.9 });
      b.point(c, { r: 3.4, color: 'ink', glow: false });
      b.text(at(c, d, 1), r + ' cm', { color: 'ink', size: 15, dx: A.rad.lab[0], dy: A.rad.lab[1], align: A.rad.lab[0] < 0 ? 'right' : 'left', baseline: 'middle' });
    }
  }

  /* ---- 패널 */
  function bandGuide(A, M, ph) {
    const r = M.r;
    const base = '끈이 원기둥 ' + M.n + '개를 <b>팽팽하게</b> 감싸고 있어요(위에서 본 모양). 분홍색은 <b>직선 부분</b>, 색칠한 조각의 호는 <b>곡선 부분</b>이에요.<br>▶ 재생을 누르거나 <b>‘끈 풀어 보기’</b> 막대를 끌어 보세요.';
    if (ph.t < 0.02) return base;
    if (ph.t < T_U1) return '<b>직선 부분</b>을 살펴봐요. 두 원의 <b>중심을 이은 선분</b>과 끈은 직사각형의 마주 보는 변이라서 길이가 같아요(같은 길이 눈금). 접한 두 원의 중심 사이의 거리는 ' + r + '+' + r + ' = <b>' + 2 * r + '</b> (cm)예요.';
    if (ph.t < T_G0) return '직선 부분은 중심을 이은 선분 ' + M.E + '개와 같아요: ' + 2 * r + ' × ' + M.E + ' = <b>' + M.straight + '</b> (cm). 이제 <b>곡선 부분</b>(부채꼴의 호)만 남았어요.';
    if (ph.g < 0.999) {
      const sum = arrivedOf(M, ph.g).reduce((x, a) => x + a.deg, 0);
      return '색칠한 부채꼴을 한 줄로 <b>복사</b>해서 늘어놓고, <b>가로로 밀어</b> 한 점으로 모으고 있어요. 지금까지 모은 중심각의 합: <b>' + sum + '°</b>';
    }
    return '곡선 부분을 모으니 <b>원 하나</b>가 되었어요! 중심각의 합 = ' + M.arcs.map((a) => a.deg).join('° + ') + '° = 360°이므로 곡선 부분의 길이는 원의 둘레 2π×' + r + ' = <b>' + 2 * r + 'π</b> (cm)예요.';
  }
  function bandView(key, s, lab) {
    const A = BAND[key], r = s.f5A, M = bandModel(key, r, npOf(key, s));
    const tab = (lab && lab.tab) || 'explore';
    const review = tab === 'review';
    const ph = phaseOf(clamp(+s.f5T || 0, 0, 1));
    const nA = M.arcs.length, step = s.step || 0;
    const sumNow = arrivedOf(M, ph.g).reduce((x, a) => x + a.deg, 0);
    const totalStr = '(' + 2 * r + 'π+' + M.straight + ') cm';
    const v = {};
    v.guide = bandGuide(A, M, ph);
    v.readouts = [
      { label: '반지름 r', value: bdCm(r), color: 'ink', note: '원기둥 밑면의 반지름' },
      { label: '직선 부분', value: 2 * r + ' × ' + M.E + ' = ' + M.straight + ' cm', color: SEGC, ref: 'straight', note: '중심 사이 거리 ' + r + '+' + r + ' = ' + 2 * r + ' 가 ' + M.E + '개' },
      { label: '곡선 부분', value: '2π×' + r + ' = ' + 2 * r + 'π cm', color: 'sky', ref: 'curve', note: '중심각의 합 ' + M.degSum + '° → 원 하나의 둘레' },
      { label: '끈의 길이', value: totalStr, color: 'amber', wide: true, note: '≈ ' + valL(M.total).toFixed(2) + ' cm' },
      { label: '모은 중심각의 합', value: sumNow + '°', color: 'violet', wide: true, note: sumNow >= 360 ? '360° → 원 하나!' : '360°가 되면 원 하나가 돼요' }
    ];
    v.parts = [
      { id: 'straight', name: '직선 부분', desc: '중심끼리 이은 선분 ' + M.E + '개와 같은 길이', value: M.straight + ' cm', color: SEGC },
      { id: 'curve', name: '곡선 부분 전체', desc: '부채꼴의 호 ' + nA + '개를 모으면 원 하나', value: 2 * r + 'π cm', color: 'sky' }
    ].concat(M.arcs.map((a) => ({ id: 'a' + a.k, name: NUM[a.k] + ' 호 (중심각 ' + a.deg + '°)', desc: '2π×' + r + '×' + a.deg + '/360', value: piP(a.len[0], a.len[1]) + ' cm', color: a.color })));
    if (review) {
      const msg = step <= 1 ? '끈 = 직선 부분 + 곡선 부분'
        : step === 2 ? '직선 부분 = 중심 선분 ' + M.E + '개 = ' + M.straight + ' cm'
        : step < 3 + nA ? NUM[step - 3] + ' 호 = ' + piP(M.arcs[step - 3].len[0], M.arcs[step - 3].len[1]) + ' cm'
        : step === 3 + nA ? '중심각의 합 360° → 원 하나 → ' + 2 * r + 'π cm'
        : '끈의 길이 ' + totalStr;
      v.status = { tone: step >= 4 + nA ? 'ok' : 'info', text: msg };
    } else if (tab === 'problem') v.status = { tone: 'info', text: '밑면의 반지름 ' + r + ' cm · 원기둥 ' + M.n + '개' };
    else v.status = ph.g >= 0.999 ? { tone: 'ok', text: '곡선 부분 = 원 하나의 둘레 = ' + 2 * r + 'π cm' } : ph.t < 0.02 ? { tone: 'info', text: '끈 = 직선 부분 + 곡선 부분' } : { tone: 'info', text: phaseName(ph.t) };
    if (review && step >= 4 + nA) {
      v.tape = { title: '끈의 길이 = 직선 부분 ' + M.straight + ' + 곡선 부분 ' + 2 * r + 'π = ' + totalStr, segments: [{ text: '직선 ' + M.straight, weight: M.straight, color: SEGC }, { text: '곡선 ' + 2 * r + 'π', weight: 2 * r * PI, color: 'sky' }] };
    }
    v.formula = '<p><b>끈의 길이</b> = (직선 부분) + (곡선 부분)</p>'
      + '<p>직선 부분 = ' + 2 * r + ' × ' + M.E + ' = <b>' + M.straight + '</b> (cm) <small>중심 사이 거리 ' + r + '+' + r + '가 ' + M.E + '개</small></p>'
      + '<p>곡선 부분 = 2π × ' + r + ' = <b>' + 2 * r + 'π</b> (cm) <small>중심각의 합 ' + M.arcs.map((a) => a.deg + '°').join('+') + ' = ' + M.degSum + '°</small></p>'
      + '<p>∴ <b>' + totalStr + '</b> ≈ ' + valL(M.total).toFixed(2) + ' cm</p>';
    v.rule = '(끈의 길이) = (중심을 이은 선분의 길이의 합) + (원 한 개의 둘레 2πr)';
    v.notes = '<ul style="margin:0;padding-left:18px;display:grid;gap:4px">'
      + '<li>곡선 부분을 원마다 2πr로 모두 더하면 안 돼요. 곡선 부분은 <b>조각</b>이라서, 모으면 원 <b>하나</b>(2πr)예요.</li>'
      + '<li>직선 부분의 개수는 <b>중심을 이은 선분의 개수</b>예요. 한 줄에 놓인 가운데 원은 호가 없고(중심각 0°) 직선만 지나가요.</li>'
      + '<li>접한 두 원의 중심 사이의 거리는 <b>r+r = 2r</b>(지름)이에요. 원이 떨어져 있으면 중심 사이의 거리를 따로 구해야 해요.</li></ul>';
    return v;
  }
  function bandSteps(key, s) {
    const r = s.f5A, M = bandModel(key, r, npOf(key, s)), st = [];
    st.push('끈은 직선 부분과 곡선 부분으로 이루어져 있어요. (끈의 길이) = (직선 부분의 길이) + (곡선 부분의 길이)');
    st.push('직선 부분: 끈과 두 원의 중심을 이은 선분은 직사각형의 마주 보는 변이라 길이가 같아요. 원끼리 접해 있으니 중심 사이의 거리는 ' + r + '+' + r + ' = ' + 2 * r + ' (cm)이고, 이런 선분이 ' + M.E + '개이므로 ' + 2 * r + ' × ' + M.E + ' = ' + M.straight + ' (cm)');
    M.arcs.forEach((a) => st.push('곡선 부분 ' + NUM[a.k] + ': 반지름 ' + r + ' cm, 중심각 ' + a.deg + '°인 부채꼴의 호 → $2\\pi\\times' + r + '\\times\\dfrac{' + a.deg + '}{360}=' + texPi(mkL(a.len[0], a.len[1], 0)) + '$ (cm)'));
    st.push('곡선 부분 ' + M.arcs.map((a) => NUM[a.k]).join('') + '를 한 줄로 복사해 가로로 모으면 중심각의 합이 ' + M.arcs.map((a) => a.deg + '°').join('+') + ' = ' + M.degSum + '°이므로 반지름 ' + r + ' cm인 원 하나가 돼요. 곡선 부분 = $2\\pi\\times' + r + '=' + 2 * r + '\\pi$ (cm)');
    st.push('끈의 길이 = (직선 부분) + (곡선 부분) = ' + M.straight + ' + ' + 2 * r + 'π = (' + 2 * r + 'π+' + M.straight + ') cm');
    return st;
  }
  function bandSolStd(key, s) {
    const r = s.f5A, M = bandModel(key, r, npOf(key, s));
    const arcs = M.arcs.map((a) => NUM[a.k] + ' $2\\pi\\times' + r + '\\times\\dfrac{' + a.deg + '}{360}=' + texPi(mkL(a.len[0], a.len[1], 0)) + '$').join('<br>&nbsp;&nbsp;&nbsp;');
    return {
      steps: '<b>해결 전략</b><br>① 끈을 직선 부분과 곡선 부분으로 나누어 생각한다.<br>② 직선 부분은 중심을 이은 선분의 길이와 같고, 곡선 부분은 부채꼴의 호의 길이를 모두 더한다.<br><br>'
        + '직선 부분: $' + 2 * r + '\\times' + M.E + '=' + M.straight + '$ (cm)<br>곡선 부분의 호의 길이:<br>&nbsp;&nbsp;&nbsp;' + arcs + '<br>합: $' + M.arcs.map((a) => texPi(mkL(a.len[0], a.len[1], 0))).join('+') + '=' + 2 * r + '\\pi$ (cm)<br><br>'
        + '따라서 필요한 끈의 최소 길이는 $' + 2 * r + '\\pi+' + M.straight + '$ (cm)',
      warning: '곡선 부분의 중심각의 합은 360°라서 호의 길이를 모두 더하면 항상 원 하나의 둘레와 같아요.'
    };
  }
  function bandSolQuick(key, s) {
    const r = s.f5A, M = bandModel(key, r, npOf(key, s));
    return {
      steps: '① 곡선 부분은 항상 <b>원 하나의 둘레</b>예요: $2\\pi r = 2\\pi\\times' + r + '=' + 2 * r + '\\pi$<br>② 직선 부분은 <b>(중심을 이은 선분의 개수) × 2r</b>: $' + M.E + '\\times' + 2 * r + '=' + M.straight + '$<br>③ 합: $' + 2 * r + '\\pi+' + M.straight + '$ (cm)',
      highlight: '둘레를 따라 한 바퀴 돌면 방향이 모두 합쳐서 360° 바뀌어요. 그래서 곡선 부분의 중심각의 합이 늘 360°예요.'
    };
  }
  function bandProblemHTML(key, s) {
    const A = BAND[key], r = s.f5A, M = bandModel(key, r, npOf(key, s));
    const opts = bandChoices(key, M), ok = opts.find((o) => o.ok);
    const pk = key + '|' + r + '|' + npOf(key, s) + '|' + (s.f5Seed || 0);
    const pick = s.f5Pick && s.f5Pick.key === pk ? s.f5Pick.idx : -1;
    let h = '<div class="f5-q">그림과 같이 밑면인 원의 반지름의 길이가 ' + r + ' cm인 원기둥 ' + M.n + '개를 끈으로 묶으려고 할 때, 필요한 끈의 최소 길이는? (단, 끈의 두께와 매듭의 길이는 생각하지 않는다.)</div><div class="f5-choices">';
    opts.forEach((o) => {
      const cls = pick === o.i ? (o.ok ? ' ok' : ' bad') : '';
      h += '<button type="button" class="f5-ch' + cls + '" data-f5-pick="' + o.i + '" aria-label="' + NUM[o.i] + ' ' + esc(cmText(o.L)) + '"><span class="n">' + NUM[o.i] + '</span><span class="v">$' + texAns(o.L) + '$</span></button>';
    });
    h += '</div>';
    if (pick >= 0) {
      const o = opts[pick];
      h += o.ok
        ? '<div class="f5-fb ok"><b>정답이에요!</b> 직선 부분 ' + M.straight + ' cm + 곡선 부분(원 하나의 둘레) ' + 2 * r + 'π cm 이에요. 정리 탭에서 풀이 과정을 확인해 보세요.</div>'
        : '<div class="f5-fb bad"><b>다시 생각해 볼까요?</b> ' + esc(hintOf(o.L, ok.L).replace('호의 길이를 덜 더했어요. 경계에 있는 호를 모두 찾았는지, 호마다 2π×반지름×(중심각/360)으로 구했는지 확인해 보세요.', '곡선 부분이 너무 짧아요. 곡선 부분을 모으면 반지름 r인 원 하나의 둘레 2πr이에요.').replace('호의 길이를 너무 많이 더했어요. 같은 호를 두 번 세지 않았는지, 중심각을 바르게 읽었는지 확인해 보세요.', '곡선 부분이 너무 길어요. 원 둘레를 여러 번 더하는 게 아니에요.')) + '</div>';
    }
    h += '<div class="f5-tools"><button type="button" class="apl-btn sm" data-f5-new>숫자 바꾸기</button>' + (A.textbook ? '' : '<span class="f5-note">교과서 문제를 응용한 문제예요.</span>') + '</div>';
    return h;
  }
  const bandSlots = (A) => {
    const sl = { f5A: { label: '반지름 r', min: 2, max: 8, step: 1, value: A.r0, color: 'ink', format: bdCm, hint: '원기둥 밑면의 반지름' } };
    if (A.np) sl.f5B = { label: A.np.label, min: A.np.min, max: A.np.max, step: 1, value: A.np.value, color: 'sky', format: (v) => v + (A.np.label.indexOf('개수') >= 0 ? '개' : '줄'), hint: A.np.hint };
    return sl;
  };
  const BAND_T = {
    value: 0, min: 0, max: 1, step: 0.005, color: 'amber', label: '끈 풀어 보기',
    hint: '오른쪽으로 끌면 ① 직선 부분을 확인하고 ② 곡선 부분이 모여 원 하나가 돼요', format: (v) => phaseName(v)
  };
  function setBandSlots(lab, key) {
    const A = BAND[key], P = lab.params;
    P.f5T = Object.assign({}, BAND_T);
    const sl = bandSlots(A);
    SLOT_IDS.forEach((id) => {
      if (sl[id]) P[id] = Object.assign({}, sl[id], { onInput: (s, l) => { s.f5Pick = null; refreshReview(l || lab); } });
      else delete P[id];
    });
  }
  const bandRand = (key, s) => {
    const o = { f5A: pickOther([2, 3, 4, 5, 6, 7, 8], s.f5A) };
    return o;
  };
  function bandScene(key) {
    const A = BAND[key];
    const slots = bandSlots(A);
    const presets = () => [2, 3, 4, 5, 6, 8].map((v) => ({ group: '반지름 r (cm)', label: v + ' cm', apply: (s, lab) => { s.f5A = v; s.f5Pick = null; refreshReview(lab); }, on: (s) => s.f5A === v }));
    return {
      id: A.id, title: A.title, short: A.short, bdKey: key, f5Kind: 'band',
      question: '끈을 팽팽하게 감으면 어디는 곧은 선이고 어디는 굽은 선일까? 굽은 선(곡선 부분)을 한곳에 모으면 어떤 도형이 될까?',
      controls: SLOT_IDS.filter((k) => slots[k]).concat(['f5T']),
      presets,
      actions: ACTIONS('끈 풀어 보기 재생'),
      steps: (s) => bandSteps(key, s),
      solution: {
        standardTitle: '교과서식 풀이 (해결 전략)', standardTag: '정석', quickTitle: '빠른 풀이 · 핵심 원리', quickTag: '핵심',
        standard: (s) => bandSolStd(key, s), quick: (s) => bandSolQuick(key, s)
      },
      notesTitle: '자주 틀리는 부분',
      problem: {
        tag: '끈의 최소 길이 구하기',
        text: (s) => bandProblemHTML(key, s),
        answer: (s) => { const M = bandModel(key, s.f5A, npOf(key, s)); const ok = bandChoices(key, M).find((o) => o.ok); return NUM[ok.i] + ' $' + texAns(ok.L) + '$'; }
      },
      enter: (s, lab) => {
        s.f5T = 0; s.f5Pick = null; s.f5Seed = 0; s.playing = false;
        s.f5A = A.r0; if (A.np) s.f5B = A.np.value;
        if (lab && s === lab.s) setBandSlots(lab, key);
      },
      tick: (s, dt, lab) => {
        let again = false;
        if (s.playing) {
          s.f5T = Math.min(1, s.f5T + dt / BDUR);
          if (s.f5T >= 1) s.playing = false;
          again = true;
        } else if (lab && lab.tab === 'review') {
          const tg = stepTarget(bandModel(key, s.f5A, npOf(key, s)), s.step || 0);
          const d = tg - s.f5T;
          if (Math.abs(d) > 0.0008) { const sp = 0.25 * dt; s.f5T += clamp(d, -sp, sp); again = true; }
        }
        return again;
      },
      view: (s, lab) => bandView(key, s, lab),
      draw: (b, s, v, lab) => drawBand(b, s, lab, key),
      f5PickKey: (s) => key + '|' + s.f5A + '|' + npOf(key, s) + '|' + (s.f5Seed || 0),
      f5Choices: (s) => bandChoices(key, bandModel(key, s.f5A, npOf(key, s))),
      f5Rand: (s) => bandRand(key, s),
      f5Model: (s) => bandModel(key, s.f5A, npOf(key, s)),
      bdGeom: (s) => bandGeom(key, npOf(key, s))
    };
  }

  /* ------------------------------------------------------------------ 문제 탭의 버튼 (보기 고르기·숫자 바꾸기) */
  function installClicks() {
    const root = document.documentElement;
    if (root.dataset.f5Bound) return;
    root.dataset.f5Bound = '1';
    document.addEventListener('click', (ev) => {
      const lab = window.lab;
      if (!lab || !ev.target || !ev.target.closest) return;
      const hit = ev.target.closest('[data-f5-pick],[data-f5-new]');
      if (!hit) return;
      const sc = lab.scene;
      if (!sc || !sc.f5Kind) return;
      const s = lab.s;
      if (hit.hasAttribute('data-f5-new')) {
        Object.assign(s, sc.f5Rand(s));
        if (sc.f5Def && sc.f5Def.fix) sc.f5Def.fix(s);
        s.f5Seed = (s.f5Seed || 0) + 1;
        s.f5Pick = null; s.revealed = false; s.f5T = 0; s.playing = false;
        lab.setStep(1);
        refreshReview(lab);
        return;
      }
      const idx = parseInt(hit.getAttribute('data-f5-pick'), 10);
      const opts = sc.f5Choices(s);
      s.f5Pick = { key: sc.f5PickKey(s), idx };
      if (opts[idx] && opts[idx].ok) s.revealed = true;
      lab.invalidate(true);
    });
  }
  function installStyle() {
    if (document.getElementById('f5-css')) return;
    const st = document.createElement('style');
    st.id = 'f5-css';
    st.textContent = `
.f5-q{font-size:var(--fs-md);line-height:1.85}
.f5-q small{color:var(--text-3);font-size:var(--fs-sm)}
.f5-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0 4px}
.f5-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left}
.f5-ch:hover{background:var(--hover)}
.f5-ch .n{color:var(--m-amber);flex:none}
.f5-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.f5-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.f5-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.f5-fb.ok{border-left-color:var(--m-green)}
.f5-fb.bad{border-left-color:var(--m-red)}
.f5-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.f5-note{font-size:var(--fs-xs);color:var(--text-3)}
.f5-pt{color:var(--text-3);font-size:var(--fs-sm)}`;
    document.head.append(st);
  }
  installStyle();
  installClicks();

  /* ------------------------------------------------------------------ 등록 */
  const BASE_PARAMS = {
    f5T: DEF_T,
    f5A: { value: 4, min: 1, max: 30, step: 1, color: 'sky', label: '값 1' },
    f5B: { value: 4, min: 1, max: 30, step: 1, color: 'violet', label: '값 2' },
    f5C: { value: 60, min: 1, max: 360, step: 1, color: 'amber', label: '값 3' }
  };
  (window.APL_CS_GROUPS = window.APL_CS_GROUPS || []).push({
    order: 65,
    id: 'f5',
    title: 'F05 복합 원호',
    short: 'F05 복합 원호',
    params: BASE_PARAMS,
    scenes: [SN, RING, RING2, RING240, STAR, LENS, CUT, TRACK].map(pieceScene).concat(['sq4', 'rect', 'tri3', 'line'].map(bandScene))
  });
})();
