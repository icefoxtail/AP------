/* ==========================================================================
   공통수학 · 이차함수 — 옛 탐구관 1~6(장면 30개)에 「문제 · 풀이 · 새 문제」를 얹는 공용 틀
   탐구 탭(그림·조작·문구)은 common-quadratic.html 의 원본 그대로입니다. 이 파일들은 정리·문제 탭만 보탭니다.
   - old-core.js : 공용 도우미 + 장면에 붙이는 attach()
   - old-1.js    : 탐구관 1~3 (차 f−g · 움직이는 대칭축 · 절댓값 그래프) 15장면
   - old-2.js    : 탐구관 4~6 (근의 분리 · 항상 성립 · 함정 연구소) 15장면
   각 장면은 spec = { fast, tag, time, vary, text, steps, std, quick, ans, box, draw } 로 등록합니다.
   이 실험실의 도형적 빠른 접근은 "그래프 읽기"입니다: 두 함수의 차를 x축으로 내리기, 대칭축과 구간의 위치,
   수평선·직선과의 교점 개수, 근의 분리를 f(p)의 부호·축·판별식 그림으로 보기. 그래프 풀이를 먼저, 식 계산은 짧게 비교합니다.
   ========================================================================== */
(function () {
  'use strict';
  const APLab = window.APLab;
  if (!APLab) return;
  const O = (window.APL_CQ_OLD = window.APL_CQ_OLD || { specs: {} });
  const T = (s) => '$' + s + '$';
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const sg = (v) => (v < 0 ? '−' : '') + Math.abs(v); // 화면 글자용(유니코드 마이너스)

  /* ---------- 수식 글자 ---------- */
  const frTex = (n, d) => {
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    n /= g; d /= g;
    return d === 1 ? String(n) : (n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(n) + '}{' + d + '}';
  };
  const xm = (v) => (v === 0 ? 'x' : v > 0 ? `x-${v}` : `x+${-v}`); // (x − v)
  const par = (v) => (v < 0 ? '(' + v + ')' : String(v)); // 음수는 괄호
  function polyTex(a, b, c, v = 'x') {
    const term = (co, mono, first) => {
      if (!co) return '';
      const sign = co < 0 ? '-' : first ? '' : '+';
      const ab = Math.abs(co);
      return sign + (mono === '' ? String(ab) : (ab === 1 ? '' : String(ab)) + mono);
    };
    let s = term(a, v + '^2', true);
    s += term(b, v, s === '');
    s += term(c, '', s === '');
    return s || '0';
  }
  // 일차식 m x + n
  const linTex = (m, n, v = 'x') => {
    if (typeof n !== 'string' || n === '') return polyTex(0, m, n || 0, v);
    const head = m ? polyTex(0, m, 0, v) : '';
    return head + (head && n[0] !== '-' ? '+' : '') + n;
  };
  // a·(x−p)²+q 꼴의 전개 계수
  const expand = (a, p, q) => [a, -2 * a * p, a * p * p + q];

  /* ---------- 변형 생성기 ---------- */
  // pool 에서 직전과 다른 것을 고릅니다. make(item, i) 가 변형 객체를 만듭니다(i 는 풀 안 번호).
  function varier(pool, make, same) {
    let cur = null, last = -1;
    const next = () => {
      let i = 0, guard = 0;
      if (cur) { do { i = Math.floor(Math.random() * pool.length); guard++; } while (pool.length > 1 && guard < 80 && (i === last || (same && same(make(pool[i], i), cur)))); }
      last = i;
      cur = make(pool[i], i);
      return cur;
    };
    next();
    return { cur: () => cur, next, pool, make };
  }
  const probHTML = (body) => `${body}<div style="margin-top:10px"><button type="button" class="apl-btn sm" data-cq-new>새 문제</button></div>`;
  // 풀이 두 갈래(그림으로 읽기 / 식으로)
  const sol = (quick, std) => ({ quickTitle: '그림으로 읽기 (도형 풀이)', quickTag: '그림 풀이', standardTitle: '교과서식 풀이 · 식으로 비교', standardTag: '식 풀이', quick, standard: std });

  /* ---------- 그림 공용 ---------- */
  const tabOf = (b, lab) => (b.thumb || !lab ? 'explore' : lab.tab);
  // 변형(또는 탭)이 바뀔 때만 보이는 범위를 다시 맞춥니다(사용자가 확대한 뒤에는 건드리지 않음)
  function stage(b, s, sig, box, tick) {
    if (s.cqSig !== sig) { s.cqSig = sig; b.setFocus(box, true); }
    if (s.grid) b.grid({ step: 1 });
    if (tick === false) return; // 장면이 직접 축을 그림
    const w = box.x[1] - box.x[0];
    const need = 36 / Math.max(b.k, 1); // 눈금 글자 사이가 36px 이상 되도록 눈금 간격을 고릅니다
    b.axes({ tickStep: tick || (need <= 1 ? 1 : need <= 2 ? 2 : need <= 5 ? 5 : 10) });
  }
  const dot = (b, p, color, label, dx, dy, o = {}) => b.point(p, Object.assign({ color, r: 5, label, dx, dy, align: 'left' }, o));
  // 점 이름과 값 글자: 그림 라벨은 TeX가 아니라 글자입니다. 분수는 b.text 가 쌓아 줍니다(예: 3/2).
  const lbl = (v) => String(v).replace(/-/g, '−');
  const coef = (a) => (a === 1 ? '' : a === -1 ? '-' : String(a)); // 계수 글자(1은 생략)
  const sgn = (n) => (n < 0 ? String(n) : '+' + n); // 부호를 붙인 수
  // 값 범위에서 보기 좋은 상자를 만듭니다(1:1 축척은 보드가 맞춥니다)
  const boxOf = (x0, x1, y0, y1) => ({ x: [x0, x1], y: [y0, y1] });
  // 함수 모음의 y 범위(표본)
  function yRange(fns, x0, x1, n = 80) {
    let lo = Infinity, hi = -Infinity;
    fns.forEach((f) => { for (let i = 0; i <= n; i++) { const y = f(x0 + ((x1 - x0) * i) / n); if (Number.isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); } } });
    return [lo, hi];
  }

  // 보여 줄 핵심 높이들(ys)로 상자를 만듭니다: x축이 보이게 0을 포함하고 위아래로 pad 만큼 여유를 둡니다.
  // (포물선의 팔은 위·아래로 화면을 벗어나도 괜찮습니다. 꼭짓점·교점·표시한 점이 들어오게 ys 를 줍니다.)
  function autoBox(x0, x1, ys, pad = 1.3) {
    const lo = Math.min(0, ...ys) - pad, hi = Math.max(0, ...ys) + pad;
    return { x: [x0, x1], y: [lo, hi] };
  }
  // 곡선 이름 글자: 곡선이 화면 안에 있는 곳(글자 폭까지 고려)을 상자 중심 쪽으로 걸어가며 찾아 붙입니다(포물선 팔이 화면 밖으로 나가도 이름이 잘리지 않게).
  function nameOn(b, box, fn, xs, text, o = {}) {
    const cx = (box.x[0] + box.x[1]) / 2, dir = xs < cx ? 1 : -1;
    const wpx = String(text).length * 8.5 * ((o.size || 13) / 13), wu = wpx / Math.max(b.k, 1) + 0.3;
    const al = o.align || 'center';
    let x = xs;
    for (let i = 0; i < 600; i++) {
      const y = fn(x);
      const xl = al === 'left' ? x : al === 'right' ? x - wu : x - wu / 2, xr = al === 'left' ? x + wu : al === 'right' ? x : x + wu / 2;
      if (xl > box.x[0] + 0.2 && xr < box.x[1] - 0.2 && y > box.y[0] + 0.9 && y < box.y[1] - 0.9) break;
      x += dir * 0.05;
    }
    b.text([x, fn(x)], text, o);
  }
  // 구석 이름표: 곡선·직선 이름을 그림 모서리(오른쪽 아래, side<0 이면 왼쪽 아래)에 둡니다(곡선·점 라벨과 겹치지 않게).
  function corner(b, box, text, o = {}, side = 1, top = false) {
    b.text([side > 0 ? box.x[1] - 0.2 : box.x[0] + 0.2, top ? box.y[1] - 1.7 : box.y[0] + 0.7], text, Object.assign({ size: 13, weight: 800, align: side > 0 ? 'right' : 'left' }, o));
  }
  const vy = (A, B, C) => C - (B * B) / (4 * A); // 꼭짓점의 y좌표
  // 점선 세로선과 x 값 이름(위쪽에 붙임)
  function vlab(b, box, x, text, color = 'muted', dx = 0) {
    b.vline(x, { color, width: 1.5, dash: [4, 5], alpha: 0.85 });
    b.text([x, box.y[1] - 0.55], text, { color, size: 13, weight: 800, dx });
  }

  /* ---------- 장면에 붙이기 ---------- */
  O.attach = function (sc, opts) {
    const spec = O.specs[sc.id];
    if (!spec) return sc;
    const DEF = (opts && opts.focus) || { x: [-6, 8], y: [-5.4, 6.9] };
    const origDraw = sc.draw, origView = sc.view;
    // 키트는 단계 목록(steps)을 글자로만 넣습니다(태그가 그대로 보임). 그래서 강조·줄바꿈 태그는 여기서 걷어 냅니다. 풀이 칸(quick/std)과 reviewTop 은 HTML 이라 그대로 둡니다.
    const plain = (t) => String(t).replace(/<br\s*\/?>/gi, ' ').replace(/<\/?(?:strong|em|b|i|u|sub|sup|small)>/gi, '');
    sc.steps = () => spec.steps(spec.vary.cur()).map(plain);
    sc.reviewTop = () => `<div class="apl-rich" style="font-size:var(--fs-sm);line-height:1.75"><small style="color:var(--text-3);font-weight:800">문제</small><br>${spec.text(spec.vary.cur())}</div>`;
    sc.problem = {
      tag: spec.tag,
      time: spec.time || '목표 시간: 90초',
      text: () => probHTML(spec.text(spec.vary.cur())),
      answer: () => T(spec.ans(spec.vary.cur()))
    };
    sc.solution = sol(() => spec.quick(spec.vary.cur()), () => spec.std(spec.vary.cur()));
    sc.vary = spec.vary;
    sc.view = (s, lab) => {
      const v = origView(s, lab);
      if (!lab || lab.tab === 'explore') return v;
      // 고정된 탐구 예제의 답/수치를 현재 변형 문제 옆에 남기지 않는다.
      return { readouts: [], status: null, guide: '', parts: [], summary: '', rule: '', formula: '', tape: null,
        notes: lab.tab === 'review' && s.step >= 3 ? spec.std(spec.vary.cur()).warning : '' };
    };
    sc.draw = (b, s, v, lab) => {
      const tab = tabOf(b, lab);
      if (tab === 'explore') {
        if (s.cqOld) { s.cqOld = false; s.cqSig = null; b.setFocus(DEF, true); }
        return origDraw(b, s, v, lab);
      }
      s.cqOld = true;
      const V = spec.vary.cur();
      const st = (n) => tab === 'review' && s.step >= n;
      stage(b, s, spec.id + '|' + tab + '|' + V.key, spec.box(V), spec.noAxes ? false : undefined);
      spec.draw(b, s, V, { tab, st, lab, box: spec.box(V) });
    };
    return sc;
  };
  // 정의 도우미: 장면 spec 등록
  O.add = (id, spec) => { spec.id = id; O.specs[id] = spec; };
  O.H = { T, gcd, pick, sg, frTex, xm, par, polyTex, linTex, expand, coef, sgn, varier, probHTML, sol, dot, lbl, boxOf, yRange, autoBox, nameOn, corner, vy, vlab, stage };
})();
