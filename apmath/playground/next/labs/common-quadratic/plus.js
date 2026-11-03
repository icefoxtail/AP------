/* ==========================================================================
   공통수학 · 이차함수 — 「기출 핵심 유형」 탭 (6장면)
   common-quadratic.html 이 window.APL_CQ_GROUPS 를 읽어 7번째 탭으로 붙입니다. 기존 30장면은 건드리지 않습니다.
   근거: 고1 학평 분류표 「실험실 확장 후보 유형」 A1~A6 (2019~2026학년도 3·6·9·10·11월 학평).
   학생이 몸으로 익힐 것: 식을 "그래프의 교점 개수"로 바꿔 읽는 법.
   - 장면 1 (A2) 두 포물선을 이어 붙인 h(x)와 수평선 y=k          · 학평 24-9월 21번 · 25-10월 30번 유형
   - 장면 2 (A3) 식 {f(x)-k}{g(x)-k}=0 을 두 수평 교점으로 읽기     · 학평 25-6월 30번 유형
   - 장면 3 (A4) 원점을 지나는 직선을 돌려 접선 찾기 + 넓이        · 학평 23-6월 28번 유형
   - 장면 4 (A6) 이차부등식의 해 구간과 정수해 개수                 · 학평 26-6월 20번 · 26-10월 20번 유형
   - 장면 5 (A1) 구간 [t, t+L]을 밀며 보는 최댓값·최솟값 M(t), m(t) · 학평 19-11월 20번 · 24-6월 30번 유형
   - 장면 6 (A5) 움직이는 직선 y=k가 나누는 넓이를 k의 이차식으로   · 학평 19-6월 20번 유형
   탐구 탭은 고정된 예제를 움직여 보고, 정리·문제 탭은 변형 문항(「새 문제」로 숫자 교체)과 단계 풀이를 줍니다.
   ========================================================================== */
(function () {
  'use strict';
  const APLab = window.APLab;
  if (!APLab) return;
  const clamp = APLab.clamp;
  const T = (s) => '$' + s + '$';
  const fmt = (v, d = 2) => APLab.fmt(v, d);
  const EPS = 1e-7;
  const near = (a, b, e = EPS) => Math.abs(a - b) < e;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const sgnTxt = (v) => (v < 0 ? '−' : '') + Math.abs(v); // 화면 글자용 (유니코드 마이너스)

  /* ---------- 수식 글자 만들기 (TeX) ---------- */
  const frTex = (n, d) => {
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    n /= g; d /= g;
    return d === 1 ? String(n) : (n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(n) + '}{' + d + '}';
  };
  const xm = (v) => (v === 0 ? 'x' : v > 0 ? `x-${v}` : `x+${-v}`); // (x - v)
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

  /* ---------- 변형 생성기 ---------- */
  function varier(gen) { let cur = gen(null); return { cur: () => cur, next: () => (cur = gen(cur)) }; }
  // 직전 문제와 같은 항목이 연달아 나오지 않게 고릅니다 (same(c) 가 참이면 다시 뽑음)
  function pickNew(pool, prev, same) {
    let c;
    let guard = 0;
    do { c = pick(pool); guard++; } while (prev && same(c) && pool.length > 1 && guard < 60);
    return c;
  }
  const probHTML = (body) => `${body}<div style="margin-top:10px"><button type="button" class="apl-btn sm" data-cq-new>새 문제</button></div>`;
  document.addEventListener('click', (ev) => {
    const hit = ev.target && ev.target.closest && ev.target.closest('[data-cq-new]');
    if (!hit) return;
    const lab = window.lab, sc = lab && lab.scene;
    if (!sc || !sc.vary) return;
    sc.vary.next();
    lab.s.revealed = false;
    lab.s.cqSig = null;
    lab.setStep(0);
    try { lab._buildReview(); } catch (e) { /* 셸 내부가 바뀌어도 그림은 그대로 */ }
    lab.invalidate(true);
  });

  /* ---------- 그리기 공통 ---------- */
  const tabOf = (b, lab) => (b.thumb || !lab ? 'explore' : lab.tab);
  const shown = (tab, s, i) => (tab === 'explore' ? true : tab === 'review' ? s.step >= i : false);
  // 장면(변형)이 바뀔 때만 보이는 범위를 다시 맞춥니다(사용자가 확대한 뒤에는 건드리지 않음)
  function stage(b, s, sig, box, tick) {
    if (s.cqSig !== sig) { s.cqSig = sig; b.setFocus(box, true); }
    if (s.grid) b.grid({ step: 1 });
    b.axes({ tickStep: tick || (b.k < 32 ? 2 : 1) });
  }
  const dot = (b, p, color, label, dx, dy, o = {}) => b.point(p, Object.assign({ color, r: 5, label, dx, dy, align: 'left' }, o));

  /* ======================================================================
     장면 1·2 공통: 두 이차함수 f(위로 볼록 아님: U자), g(∩자)
       f(x)=(x-a)²+b,  g(x)=-(x-c)²+d,  f=g 의 두 근 α<β   (c=α+β-a, d=(α-a)²+(β-a)²+b)
     ====================================================================== */
  function pairOf(al, be, a, b) {
    const c = al + be - a, d = (al - a) ** 2 + (be - a) ** 2 + b;
    const f = (x) => (x - a) ** 2 + b, g = (x) => -((x - c) ** 2) + d;
    return { al, be, a, b, c, d, f, g, pa: f(al), pb: f(be), u: Math.min(f(al), f(be)), v: Math.max(f(al), f(be)) };
  }
  // 근 후보(이차식 (x-m)²=t 의 해)
  function sqRoots(m, t) {
    if (t < -EPS) return [];
    if (t < EPS) return [m];
    const r = Math.sqrt(t);
    return [m - r, m + r];
  }
  const uniq = (xs) => xs.sort((p, q) => p - q).filter((x, i, arr) => !i || Math.abs(x - arr[i - 1]) > 1e-6);
  // h(x)=f(안쪽 [α,β]) / g(바깥) 와 y=k 의 교점 x좌표
  function hPts(P, k) {
    const out = [];
    sqRoots(P.a, k - P.b).forEach((x) => { if (x >= P.al - 1e-9 && x <= P.be + 1e-9) out.push(x); });
    sqRoots(P.c, P.d - k).forEach((x) => { if (x < P.al - 1e-9 || x > P.be + 1e-9) out.push(x); });
    return uniq(out);
  }
  // {f(x)-k}{g(x)-k}=0 의 서로 다른 실근 (몇 번째 곡선의 근인지 표시)
  function prodRoots(P, k) {
    const fr = sqRoots(P.a, k - P.b), gr = sqRoots(P.c, P.d - k);
    const all = uniq(fr.concat(gr));
    return all.map((x) => ({ x, inF: fr.some((y) => near(x, y, 1e-6)), inG: gr.some((y) => near(x, y, 1e-6)) }));
  }
  const PAIR_POOL = [[-1, 3, 2, -3], [-1, 3, 0, -1], [-2, 2, 1, -2], [0, 4, 1, -4], [-2, 3, 0, -2], [-2, 2, -1, -3], [-3, 1, 0, -4]];
  const pairTex = (P) => ({ f: polyTex(1, -2 * P.a, P.a * P.a + P.b), g: polyTex(-1, 2 * P.c, P.d - P.c * P.c) });

  /* ======================= 장면 1 · 이어 붙인 h(x)와 수평선 ======================= */
  const N1_BASE = pairOf(-1, 3, 2, -3);
  const var1 = varier((prev) => {
    const cands = PAIR_POOL.map((p, i) => ({ P: pairOf(...p), i }));
    let c = cands[0], type = 'K', guard = 0;
    if (prev) {
      do {
        c = pick(cands);
        type = c.P.u - c.P.b >= 2 && Math.random() < 0.5 ? 'C' : 'K';
        guard++;
      } while (c.i === prev.i && type === prev.type && guard < 60);
    }
    const P = c.P;
    const nInt = P.u - P.b - 1; // b<k<u 인 정수 k
    const ans = type === 'K' ? { tex: String(P.b + P.u), val: P.b + P.u } : { tex: String(nInt), val: nInt };
    return { key: 'n1_' + c.i + type, i: c.i, P, type, ans, tx: pairTex(P) };
  });
  const n1Text = (v) => {
    const P = v.P;
    return `이차함수 ${T('f(x)=' + v.tx.f)}, ${T('g(x)=' + v.tx.g)}에 대하여 방정식 ${T('f(x)=g(x)')}의 서로 다른 두 실근을 ${T('\\alpha,\\ \\beta\\ (\\alpha\\lt\\beta)')}라 하고, 함수 ${T('h(x)')}를 다음과 같이 정의한다.<br>
    ${T('h(x)=\\begin{cases} f(x) & (\\alpha\\le x\\le\\beta)\\\\ g(x) & (x\\lt\\alpha\\ \\text{또는}\\ x\\gt\\beta)\\end{cases}')}<br>
    직선 ${T('y=k')}가 함수 ${T('y=h(x)')}의 그래프와 서로 다른 ${v.type === 'K' ? '세' : '네'} 점에서 만나도록 하는 ${v.type === 'K' ? '모든 실수 ' + T('k') + '의 값의 합을' : '정수 ' + T('k') + '의 개수를'} 구하시오.`;
  };
  function n1Steps(v) {
    const P = v.P;
    return [
      `${T('f(x)-g(x)=2(' + xm(P.al) + ')(' + xm(P.be) + ')=0')}이므로 ${T('\\alpha=' + P.al + ',\\ \\beta=' + P.be)}. 안쪽 ${T('[\\alpha,\\beta]')}는 ${T('f')}, 바깥쪽은 ${T('g')}를 이어 붙인 그래프입니다(두 포물선 중 아래쪽 선).`,
      `표시할 점은 이어 붙인 점 ${T('(' + P.al + ',\\ ' + P.pa + ')')}, ${T('(' + P.be + ',\\ ' + P.pb + ')')}, 그리고 ${T('f')}의 꼭짓점 ${T('(' + P.a + ',\\ ' + P.b + ')')}입니다. 교점의 개수는 이 세 점의 높이 ${T(P.b + ',\\ ' + P.u + ',\\ ' + P.v)}에서만 바뀝니다.`,
      v.type === 'K'
        ? `세 점이 되는 높이는 꼭짓점을 지날 때 ${T('k=' + P.b)}, 낮은 이어 붙인 점을 지날 때 ${T('k=' + P.u)} 두 곳뿐입니다. 합은 ${T(P.b + '+(' + P.u + ')=' + v.ans.tex)}.`
        : `네 점이 되는 구간은 꼭짓점과 낮은 이어 붙인 점 사이 ${T(P.b + '\\lt k\\lt ' + P.u)}입니다. 이 안의 정수 ${T('k')}는 ${v.ans.val}개입니다.`
    ];
  }
  const solRef = (std, quick) => ({ standardTitle: '교과서식 풀이 · 식으로', standardTag: '기본 풀이', quickTitle: '그림으로 읽기', quickTag: '그림 풀이', standard: std, quick });
  function n1Sol(which) {
    return () => {
      const v = var1.cur(), P = v.P;
      if (which === 'std') {
        return { steps: `① ${T('f(x)=g(x)')} ⇒ ${T('2(' + xm(P.al) + ')(' + xm(P.be) + ')=0')} ⇒ ${T('\\alpha=' + P.al + ',\\ \\beta=' + P.be)}<br/>
② ${T('h(x)=f(x)')} (${T(P.al + '\\le x\\le ' + P.be)}), 나머지는 ${T('g(x)')}. 꺾이는 점의 y좌표는 ${T('f(' + P.al + ')=' + P.pa)}, ${T('f(' + P.be + ')=' + P.pb)}.<br/>
③ ${T('y=k')}를 위에서 아래로 내리며 셉니다. ${T('k\\gt ' + P.v)}: 0개, ${T('k=' + P.v)}: 1개, ${T(P.u + '\\lt k\\lt ' + P.v)}: 2개, ${T('k=' + P.u)}: 3개, ${T(P.b + '\\lt k\\lt ' + P.u)}: 4개, ${T('k=' + P.b)}: 3개, ${T('k\\lt ' + P.b)}: 2개.<br/>
④ ${v.type === 'K' ? '세 점인 ' + T('k=' + P.b) + ', ' + T('k=' + P.u) + '의 합은 ' + T(v.ans.tex) : '네 점인 ' + T(P.b + '\\lt k\\lt ' + P.u) + ' 안의 정수는 ' + v.ans.val + '개'}.`,
        warning: v.type === 'K'
          ? `⚠️ ${T('k=' + P.v)}(높은 이음점)에서는 점이 1개뿐입니다. 그 높이에서 ${T('f')}의 바깥 가지는 ${T('h')}에 쓰이지 않기 때문입니다. 3개가 되는 높이는 하나씩 직접 세어 확인하세요.`
          : `⚠️ ${T('k=' + P.b)}, ${T('k=' + P.u)} 자체에서는 교점이 3개입니다. 4개인 구간은 양 끝을 뺀 열린구간 ${T(P.b + '\\lt k\\lt ' + P.u)}입니다.` };
      }
      return { steps: `${T('h')}의 그래프를 그린 뒤 ${T('y=k')}만 위아래로 움직입니다. <strong>교점 개수가 바뀌는 높이는 꼭짓점의 높이 ${T(P.b)}, 이어 붙인 두 점의 높이 ${T(P.u)}, ${T(P.v)} 세 곳뿐</strong>입니다. ${v.type === 'K' ? '3개인 높이는 ' + T(P.b) + ', ' + T(P.u) + ' ⇒ 합 ' + T(v.ans.tex) : '4개인 구간은 ' + T(P.b + '\\lt k\\lt ' + P.u) + ' ⇒ 정수 ' + v.ans.val + '개'}.`,
        highlight: `💡 구간별 함수는 "각 조각이 어느 구간에 살아 있는가"와 "조각이 이어지는 점의 높이"만 정하면 그림이 끝납니다.` };
    };
  }

  /* ---------- N1 그리기 ---------- */
  function drawPieces(b, P, o = {}) {
    const X0 = o.x0, X1 = o.x1;
    b.plot(P.f, { from: X0, to: P.al, color: 'sky', width: 2, dash: [6, 5], alpha: 0.5 });
    b.plot(P.f, { from: P.be, to: X1, color: 'sky', width: 2, dash: [6, 5], alpha: 0.5 });
    b.plot(P.g, { from: P.al, to: P.be, color: 'rose', width: 2, dash: [6, 5], alpha: 0.5 });
    b.plot(P.g, { from: X0, to: P.al, color: 'rose', width: 4.2, glow: true });
    b.plot(P.f, { from: P.al, to: P.be, color: 'sky', width: 4.2, glow: true });
    b.plot(P.g, { from: P.be, to: X1, color: 'rose', width: 4.2, glow: true });
  }
  function n1Box(P) { return { x: [P.al - 3.6, P.be + 3.6], y: [P.b - 2.6, Math.max(P.pa, P.pb) + 2.6] }; }
  function drawN1(b, s, v, lab) {
    const tab = tabOf(b, lab), ex = tab === 'explore';
    const V = var1.cur(), P = ex ? N1_BASE : V.P;
    const box = n1Box(P);
    stage(b, s, 'n1|' + tab + '|' + (ex ? 'base' : V.key), box);
    drawPieces(b, P, { x0: box.x[0] - 0.5, x1: box.x[1] + 0.5 });
    b.text([P.be + 1.5, P.f(P.be + 1.5) + 0.5], 'f', { color: 'sky', size: 14, weight: 800 });
    b.text([P.c, Math.min(P.d + 0.55, box.y[1] - 0.6)], 'g', { color: 'rose', size: 14, weight: 800 });
    // 이어 붙인 두 점: 지문의 α, β(x좌표)를 점 이름으로 늘 보여 줍니다. 좌표값은 풀이에서 구하는 값이라 문제 탭과 풀이 전에는 숨깁니다.
    const coords = shown(tab, s, 1) && tab !== 'problem';
    dot(b, [P.al, P.pa], 'ink', coords ? `α (${sgnTxt(P.al)}, ${sgnTxt(P.pa)})` : 'α', -10, -13, { align: 'right', hollow: true, size: 14 });
    dot(b, [P.be, P.pb], 'ink', coords ? `β (${sgnTxt(P.be)}, ${sgnTxt(P.pb)})` : 'β', 24, -12, { hollow: true, size: 14 });
    if (shown(tab, s, 2) && tab !== 'problem') dot(b, [P.a, P.b], 'ink', `(${sgnTxt(P.a)}, ${sgnTxt(P.b)})`, -12, 17, { align: 'right', hollow: true });
    if (!ex && tab === 'review' && s.step >= 2) [P.b, P.u, P.v].forEach((hh) => b.hline(hh, { color: 'muted', width: 1.6, dash: [4, 5], alpha: 0.8 }));
    if (!ex && tab === 'review' && s.step >= 3) {
      if (V.type === 'K') {
        [P.b, P.u].forEach((hh) => {
          b.hline(hh, { color: 'green', width: 2.2, dash: [6, 5] });
          hPts(P, hh).forEach((x) => b.point([x, hh], { color: 'green', r: 5.5 }));
        });
      } else {
        b.poly([[box.x[0] - 1, P.b], [box.x[1] + 1, P.b], [box.x[1] + 1, P.u], [box.x[0] - 1, P.u]], { fill: 'green', fillAlpha: 0.14, color: null });
        const km = (P.b + P.u) / 2 + 0.21;
        b.hline(km, { color: 'amber', width: 2.2 });
        hPts(P, km).forEach((x) => b.point([x, km], { color: 'green', r: 5.5 }));
      }
    }
    if (ex) {
      const k = s.n1k;
      b.hline(k, { color: 'amber', width: 2.6 });
      hPts(P, k).forEach((x) => b.point([x, k], { color: 'green', r: 6 }));
      b.handle('K', [box.x[1] - 1.2, k], { color: 'amber', label: 'y = k', dx: 0, dy: -17, align: 'center', ariaLabel: '직선 y=k 높이',
        drag: (w) => { s.n1k = clamp(Math.round(w.y * 20) / 20, PARAMS.n1k.min, PARAMS.n1k.max); } });
    }
  }
  function viewN1(s, lab) {
    const P = N1_BASE, k = s.n1k, pts = hPts(P, k), n = pts.length;
    const special = near(k, P.b, 1e-6) || near(k, P.u, 1e-6);
    const chips = [];
    if (lab && lab.tab === 'review') {
      const V = var1.cur(), Q = V.P;
      if (s.step >= 2) chips.push({ tex: '\\text{바뀌는 높이 }' + [Q.b, Q.u, Q.v].join(',\\ '), color: 'muted', answer: true });
      if (s.step >= 3) chips.push(V.type === 'K' ? { tex: '\\text{세 점: }k=' + Q.b + ',\\ ' + Q.u, color: 'green', answer: true } : { tex: '\\text{네 점: }' + Q.b + '\\lt k\\lt ' + Q.u, color: 'green', answer: true });
    }
    return {
      chips,
      readouts: [
        { label: '직선 y = k', value: 'k = ' + fmt(k), color: 'amber' },
        { label: '만나는 점의 개수', value: n + '개', color: 'green' },
        { label: '교점의 x좌표 합', value: n ? fmt(pts.reduce((p, q) => p + q, 0)) : '—', color: 'sky' }
      ],
      status: n === 3 ? { tone: 'key', text: '세 점! 꼭짓점 또는 낮은 이어 붙인 점의 높이' } : n === 4 ? { tone: 'ok', text: '네 점 (꼭짓점과 낮은 이어 붙인 점 사이)' } : special ? { tone: 'info', text: '경계 높이' } : null,
      summary: `교점 개수는 ${T('-3')}, ${T('-2')}, ${T('6')}에서만 바뀝니다 (꼭짓점 · 이어 붙인 두 점의 높이).`.replace(/\$/g, ''),
      formula: `• ${T('h(x)=\\min\\{f(x),\\,g(x)\\}')} 꼴: 안쪽은 ${T('f')}(U자), 바깥쪽은 ${T('g')}(∩자) — 두 그래프 중 <strong>아래쪽 선</strong>을 따라갑니다.<br/>• ${T('y=k')}를 위아래로 움직이면 교점 개수는 <strong>이어 붙인 점의 높이</strong>와 <strong>꼭짓점의 높이</strong>를 지날 때만 바뀝니다.`,
      rule: '구간별 함수와 수평선: 꺾이는 점·꼭짓점의 높이를 모두 찾아 높이 순으로 나열한 뒤, 각 구간에서 교점 개수를 한 번씩만 센다.',
      notes: `• 세 점은 "경계 높이"에서만 생깁니다. 두 값이 같으면(좌우가 대칭이면) 세 점이 아니라 두 점이 됩니다.<br/>• ${T('x\\lt\\alpha')}, ${T('x\\gt\\beta')}에서는 ${T('f')}의 가지를 쓰지 않으므로 ${T('f(x)=k')}의 근이 구간 밖이면 버립니다.`
    };
  }

  /* ======================= 장면 2 · {f(x)-k}{g(x)-k}=0 ======================= */
  const N2_BASE = pairOf(-2, 2, 1, -2);
  const N2_POOL = [0, 1, 2, 3, 5, 6].map((i) => PAIR_POOL[i]).filter((p) => {
    const P = pairOf(...p);
    return new Set([P.b, P.d, P.pa, P.pb]).size === 4;
  });
  const var2 = varier((prev) => {
    const cands = N2_POOL.map((p, i) => ({ P: pairOf(...p), i }));
    const c = prev ? pickNew(cands, prev, (x) => x.i === prev.i) : cands[0];
    const P = c.P;
    const type = !prev ? 'K' : prev.type === 'K' ? 'C' : 'K';
    const nC = P.d - P.b - 1 - 2; // b<k<d 인 정수 중 교점 높이 두 개를 뺀 개수
    const ans = type === 'K' ? { tex: String(P.b + P.d + P.pa + P.pb), val: P.b + P.d + P.pa + P.pb } : { tex: String(nC), val: nC };
    return { key: 'n2_' + c.i + type, i: c.i, P, type, ans, tx: pairTex(P) };
  });
  const n2Text = (v) => `두 이차함수 ${T('f(x)=' + v.tx.f)}, ${T('g(x)=' + v.tx.g)}에 대하여 ${T('x')}에 대한 방정식 ${T('\\{f(x)-k\\}\\{g(x)-k\\}=0')}의 서로 다른 실근의 개수가 ${v.type === 'K' ? '3이 되도록 하는 모든 실수 ' + T('k') + '의 값의 합을' : '4가 되도록 하는 정수 ' + T('k') + '의 개수를'} 구하시오.`;
  const n2Steps = (v) => {
    const P = v.P;
    return [
      `${T('\\{f(x)-k\\}\\{g(x)-k\\}=0')} ⟺ ${T('f(x)=k')} 또는 ${T('g(x)=k')}. 수평선 ${T('y=k')}가 ${T('y=f(x)')}와 만나는 점의 x좌표와 ${T('y=g(x)')}와 만나는 점의 x좌표를 모두 모으면 됩니다.`,
      `${T('f')}의 꼭짓점 높이 ${T(P.b)}(그 위에서 2개), ${T('g')}의 꼭짓점 높이 ${T(P.d)}(그 아래에서 2개). 두 곡선의 교점 ${T('(' + P.al + ',' + P.pa + ')')}, ${T('(' + P.be + ',' + P.pb + ')')}의 높이 ${T(P.pa + ',\\ ' + P.pb)}에서는 두 방정식이 같은 근을 가지므로 하나로 셉니다.`,
      v.type === 'K'
        ? `서로 다른 실근이 3개가 되는 높이는 ${T(P.b)}, ${T(P.d)}, ${T(P.pa)}, ${T(P.pb)} 네 곳입니다. 합 ${T(P.b + '+' + P.d + '+(' + P.pa + ')+(' + P.pb + ')=' + v.ans.tex)}.`
        : `${T(P.b + '\\lt k\\lt ' + P.d)}에서 보통은 4개이고, 겹치는 높이 ${T(P.pa)}, ${T(P.pb)}에서는 3개이므로 제외합니다. 정수는 ${T(P.d - P.b - 1)}개에서 2개를 뺀 ${v.ans.val}개.`
    ];
  };
  function n2Sol(which) {
    return () => {
      const v = var2.cur(), P = v.P;
      if (which === 'std') {
        return { steps: `① ${T('f(x)=k')}의 실근: ${T('k\\gt ' + P.b)}이면 2개, ${T('k=' + P.b)}이면 1개, ${T('k\\lt ' + P.b)}이면 0개.<br/>
② ${T('g(x)=k')}의 실근: ${T('k\\lt ' + P.d)}이면 2개, ${T('k=' + P.d)}이면 1개, ${T('k\\gt ' + P.d)}이면 0개.<br/>
③ 두 방정식이 같은 근 ${T('x')}를 가지면 ${T('f(x)=g(x)=k')}이므로 ${T('x=' + P.al)} 또는 ${T('x=' + P.be)}, 즉 ${T('k=' + P.pa)} 또는 ${T('k=' + P.pb)}일 때입니다(근 하나를 두 번 세지 않음).<br/>
④ ${T(P.b + '\\lt k\\lt ' + P.d)}이면 ${T('2+2=4')}개, 단 ${T('k=' + P.pa + ',\\ ' + P.pb)}이면 ${T('4-1=3')}개, ${T('k=' + P.b + ',\\ ' + P.d)}이면 ${T('1+2=3')}개입니다.<br/>
⑤ ${v.type === 'K' ? '3개가 되는 ' + T('k') + '는 ' + T(P.b + ',\\ ' + P.pb + ',\\ ' + P.pa + ',\\ ' + P.d) + ' ⇒ 합 ' + T(v.ans.tex) : '4개인 정수 ' + T('k') + ': ' + T(P.b + '\\lt k\\lt ' + P.d) + '의 정수 ' + (P.d - P.b - 1) + '개 중 ' + T(P.pa) + ', ' + T(P.pb) + ' 제외 ⇒ ' + v.ans.val + '개'}.`,
          warning: `⚠️ "개수가 3"이라는 조건에서 ${T('k=' + P.pa)}, ${T('k=' + P.pb)} 두 곳을 빠뜨리기 쉽습니다. 곱의 꼴 방정식은 <strong>두 곡선이 만나는 점의 높이</strong>에서 근이 겹칩니다.` };
      }
      return { steps: `수평선 ${T('y=k')} 하나로 두 곡선을 동시에 봅니다. 근이 달라지는 높이는 <strong>${T('f')}의 꼭짓점(${T(P.b)}), ${T('g')}의 꼭짓점(${T(P.d)}), 두 곡선의 교점 높이(${T(P.pa)}, ${T(P.pb)})</strong> 네 곳뿐입니다. ${v.type === 'K' ? '그 네 높이에서 3개 ⇒ 합 ' + T(v.ans.tex) : '그 사이 구간은 4개, 겹치는 두 높이는 3개 ⇒ ' + v.ans.val + '개'}.`,
        highlight: `💡 "방정식의 서로 다른 근의 개수"는 식을 풀지 말고 <strong>그래프와 수평선의 교점</strong>으로 바꿔 읽습니다. 곱 꼴이면 두 그래프를 한 장에 그립니다.` };
    };
  }
  function n2Box(P) { return { x: [P.al - 3.4, P.be + 3.4], y: [P.b - 1.9, P.d + 2.1] }; }
  function drawN2(b, s, v, lab) {
    const tab = tabOf(b, lab), ex = tab === 'explore';
    const V = var2.cur(), P = ex ? N2_BASE : V.P;
    const box = n2Box(P);
    stage(b, s, 'n2|' + tab + '|' + (ex ? 'base' : V.key), box);
    b.plot(P.f, { color: 'sky', width: 3.6, glow: true });
    b.plot(P.g, { color: 'rose', width: 3.6, glow: true });
    b.text([P.be + 1.1, P.f(P.be + 1.1) + 0.45], 'f', { color: 'sky', size: 14, weight: 800 });
    b.text([P.al - 1.1, P.g(P.al - 1.1) + 0.5], 'g', { color: 'rose', size: 14, weight: 800 });
    if (shown(tab, s, 2) && tab !== 'problem') {
      dot(b, [P.al, P.pa], 'violet', `(${sgnTxt(P.al)}, ${sgnTxt(P.pa)})`, -10, -13, { align: 'right', hollow: true });
      dot(b, [P.be, P.pb], 'violet', `(${sgnTxt(P.be)}, ${sgnTxt(P.pb)})`, 10, -13, { hollow: true });
      dot(b, [P.a, P.b], 'sky', '', 0, 0, { hollow: true });
      dot(b, [P.c, P.d], 'rose', '', 0, 0, { hollow: true });
    }
    const rootDots = (k) => prodRoots(P, k).forEach((r) => {
      if (r.inF && r.inG) { b.point([r.x, k], { color: 'sky', r: 8.5 }); b.point([r.x, k], { color: 'rose', r: 4.2, glow: false }); }
      else b.point([r.x, k], { color: r.inF ? 'sky' : 'rose', r: 6 });
    });
    if (!ex && tab === 'review' && s.step >= 2) [P.b, P.pb, P.pa, P.d].forEach((hh) => b.hline(hh, { color: 'muted', width: 1.6, dash: [4, 5], alpha: 0.8 }));
    if (!ex && tab === 'review' && s.step >= 3) {
      if (V.type === 'K') {
        [P.b, P.pb, P.pa, P.d].forEach((hh) => { b.hline(hh, { color: 'green', width: 2.2, dash: [6, 5] }); rootDots(hh); });
      } else {
        b.poly([[box.x[0] - 1, P.b], [box.x[1] + 1, P.b], [box.x[1] + 1, P.d], [box.x[0] - 1, P.d]], { fill: 'green', fillAlpha: 0.14, color: null });
        [P.pb, P.pa].forEach((hh) => b.hline(hh, { color: 'red', width: 2, dash: [3, 5] }));
        const km = (P.b + P.d) / 2 + 0.31; // 정수가 아닌 높이 하나를 골라 네 점을 보입니다
        b.hline(km, { color: 'amber', width: 2.2 });
        rootDots(km);
      }
    }
    if (ex) {
      const k = s.n2k;
      b.hline(k, { color: 'amber', width: 2.6 });
      rootDots(k);
      b.handle('K', [box.x[1] - 1.3, k], { color: 'amber', label: 'y = k', dx: 0, dy: -17, align: 'center', ariaLabel: '직선 y=k 높이',
        drag: (w) => { s.n2k = clamp(Math.round(w.y * 20) / 20, PARAMS.n2k.min, PARAMS.n2k.max); } });
    }
  }
  function viewN2(s, lab) {
    const P = N2_BASE, k = s.n2k, rs = prodRoots(P, k);
    const nf = rs.filter((r) => r.inF).length, ng = rs.filter((r) => r.inG).length, both = rs.filter((r) => r.inF && r.inG).length, n = rs.length;
    const chips = [];
    if (lab && lab.tab === 'review') {
      const V = var2.cur(), Q = V.P, hs = [Q.b, Q.pb, Q.pa, Q.d].sort((p, q) => p - q);
      if (s.step >= 2) chips.push({ tex: '\\text{바뀌는 높이 }' + hs.join(',\\ '), color: 'muted', answer: true });
      if (s.step >= 3) chips.push(V.type === 'K' ? { tex: '\\text{실근 3개: }k=' + hs.join(',\\ '), color: 'green', answer: true } : { tex: '\\text{실근 4개: }' + Q.b + '\\lt k\\lt ' + Q.d + '\\ (\\text{단 }' + Math.min(Q.pa, Q.pb) + ',\\ ' + Math.max(Q.pa, Q.pb) + '\\text{ 제외})', color: 'green', answer: true });
    }
    return {
      chips,
      readouts: [
        { label: 'y = f(x) 와 만나는 점', value: nf + '개', color: 'sky' },
        { label: 'y = g(x) 와 만나는 점', value: ng + '개', color: 'rose' },
        { label: '두 곡선이 함께 지나는 점', value: both + '개', color: 'violet', note: both ? '한 근으로 셉니다' : '' },
        { label: '서로 다른 실근', value: n + '개', color: 'green', wide: true, note: `${nf} + ${ng} − ${both} = ${n}` }
      ],
      status: n === 3 ? { tone: 'key', text: '서로 다른 실근 3개!' } : n === 4 ? { tone: 'ok', text: '서로 다른 실근 4개' } : null,
      formula: `• ${T('\\{f(x)-k\\}\\{g(x)-k\\}=0')} ⟺ ${T('f(x)=k')} 또는 ${T('g(x)=k')}<br/>• 서로 다른 실근의 개수 = (${T('y=f(x)')}와의 교점) + (${T('y=g(x)')}와의 교점) − (두 곡선이 <strong>함께</strong> 지나는 점)`,
      rule: '곱의 꼴 방정식은 인수마다 수평선과의 교점을 세고, 겹치는 근은 한 번만 센다. 겹치는 높이는 두 곡선이 만나는 점의 높이다.',
      notes: `• 근의 개수가 바뀌는 높이: 두 꼭짓점의 높이와 두 곡선이 만나는 점의 높이(모두 4곳).<br/>• 세 점인 높이에서는 두 점이 합쳐져 하나가 되거나(겹침), 접해서 하나가 됩니다(꼭짓점). 두 경우를 구별해서 세세요.`
    };
  }

  /* ======================= 장면 3 · 직선 돌리기와 접선 ======================= */
  // 포물선 y=x²+(a-2t)x+t²  는 직선 y=ax 에 x=t 에서 접한다.
  const N3_BASE = { t: 3, a: 2 };
  const n3Para = (t, a) => ({ t, a, p: a - 2 * t, q: t * t });
  const N3_POOL = [[3, 2, 'diff'], [3, 1, 'ratio'], [2, 1, 'diff'], [3, 2, 'ratio'], [3, 1, 'diff'], [2, 1, 'ratio']];
  const var3 = varier((prev) => {
    const c = prev ? pickNew(N3_POOL, prev, (x) => 'n3_' + x.join('_') === prev.key) : N3_POOL[0];
    const [t, a, type] = c;
    let ans;
    if (type === 'diff') { const num = t * t * (t - a); ans = { tex: frTex(num, 2), val: num / 2 }; }
    else { const g = gcd(t * t, a * a), p = t * t / g, q = a * a / g; ans = { tex: String(p + q), val: p + q, p, q }; }
    return { key: 'n3_' + c.join('_'), t, a, type, pa: n3Para(t, a), ans };
  });
  const n3Text = (v) => `이차함수 ${T('y=' + polyTex(1, v.pa.p, v.pa.q))}의 그래프가 직선 ${T('y=ax')} ${T('(a\\gt0)')}와 한 점 ${T('A')}에서 접한다. 이 그래프가 ${T('y')}축과 만나는 점을 ${T('B')}, 점 ${T('A')}에서 ${T('x')}축에 내린 수선의 발을 ${T('H')}라 하고, 선분 ${T('OA')}와 선분 ${T('BH')}가 만나는 점을 ${T('C')}라 하자. 삼각형 ${T('BOC')}의 넓이를 ${T('S_1')}, 삼각형 ${T('ACH')}의 넓이를 ${T('S_2')}라 할 때, ${v.type === 'diff' ? T('S_1-S_2') + '의 값을 구하시오.' : T('S_1:S_2=p:q') + '이다. ' + T('p+q') + '의 값을 구하시오. (단, ' + T('p,\\ q') + '는 서로소인 자연수)'} (단, ${T('O')}는 원점)`;
  function n3Steps(v) {
    const { t, a, pa } = v;
    const den = a + t;
    return [
      `접하면 ${T('x^2+(' + pa.p + ')x+' + pa.q + '=ax')}가 중근을 가집니다. ${T('x^2-(a+' + (-pa.p) + ')x+' + pa.q + '=0')}에서 ${T('D=(a+' + (-pa.p) + ')^2-' + 4 * pa.q + '=0')} ⇒ ${T('a+' + (-pa.p) + '=' + 2 * t)} ⇒ ${T('a=' + a)}. 접점은 중근 ${T('x=' + t)}이므로 ${T('A(' + t + ',\\ ' + a * t + ')')}, ${T('H(' + t + ',\\ 0)')}.`,
      `${T('B(0,\\ ' + pa.q + ')')}. 직선 ${T('OA')}: ${T('y=' + (a === 1 ? '' : a) + 'x')}, 직선 ${T('BH')}: ${T('y=-' + (t === 1 ? '' : t) + 'x+' + pa.q)}. 두 식을 연립하면 ${T('C\\left(' + frTex(t * t, den) + ',\\ ' + frTex(a * t * t, den) + '\\right)')}.`,
      `${T('S_1=\\dfrac12\\cdot' + pa.q + '\\cdot' + frTex(t * t, den) + '=' + frTex(t ** 4, 2 * den) + '')}, ${T('S_2=\\dfrac12\\cdot' + a * t + '\\cdot\\left(' + t + '-' + frTex(t * t, den) + '\\right)=' + frTex(a * a * t * t, 2 * den) + '')}. ${v.type === 'diff' ? T('S_1-S_2=' + v.ans.tex) : T('S_1:S_2=' + t * t + ':' + a * a) + (v.ans.p === t * t ? '' : ' = ' + T(v.ans.p + ':' + v.ans.q)) + ' ⇒ ' + T('p+q=' + v.ans.tex)}.`
    ];
  }
  function n3Sol(which) {
    return () => {
      const v = var3.cur(), { t, a, pa } = v;
      const tail = v.type === 'diff' ? T('S_1-S_2=' + v.ans.tex) : T('S_1:S_2=' + t * t + ':' + a * a) + ' ⇒ ' + T('p+q=' + v.ans.tex);
      if (which === 'std') {
        return { steps: `① 접선 조건 ${T('D=0')}으로 ${T('a')}와 접점 ${T('A')}를 구합니다: ${T('a=' + a + ',\\ A(' + t + ',' + a * t + ')')}.<br/>
② ${T('B(0,' + pa.q + ')')}, ${T('H(' + t + ',0)')}. 두 직선 ${T('OA,\\ BH')}를 연립해 ${T('C')}의 좌표를 구합니다.<br/>
③ 밑변과 높이를 정해 ${T('S_1,\\ S_2')}를 각각 계산합니다. ⇒ ${tail}`,
          warning: `⚠️ ${T('D=0')}에서 ${T('a')}의 값이 두 개 나옵니다(${T('a=' + a)}, ${T('a=' + (a - 4 * t) + '')}). 조건 ${T('a\\gt0')}에 맞는 값만 씁니다.` };
      }
      if (v.type === 'diff') {
        return { steps: `${T('S_1+\\triangle OCH=\\triangle BOH')}, ${T('S_2+\\triangle OCH=\\triangle AOH')}이므로 공통 부분 ${T('\\triangle OCH')}를 지워 ${T('S_1-S_2=\\triangle BOH-\\triangle AOH')}. 두 삼각형의 밑변은 ${T('OH=' + t)}, 높이는 ${T('OB=' + pa.q)}와 ${T('AH=' + a * t)}이므로<br/>${T('S_1-S_2=\\dfrac12\\cdot' + t + '\\cdot(' + pa.q + '-' + a * t + ')=' + v.ans.tex)}.`,
          highlight: `💡 넓이의 <strong>차</strong>를 구할 때는 겹치는 도형을 더해서 큰 삼각형 두 개의 차로 바꿉니다. 점 ${T('C')}의 좌표를 구하지 않아도 됩니다.` };
      }
      return { steps: `${T('OB')}와 ${T('AH')}는 모두 ${T('y')}축에 평행하므로 ${T('\\triangle BOC\\sim\\triangle AHC')}(엇각). 닮음비 ${T('OB:AH=' + pa.q + ':' + a * t + '=' + t + ':' + a)}이므로 넓이의 비는 닮음비의 제곱 ${T('S_1:S_2=' + t * t + ':' + a * a)}. ${v.ans.p === t * t ? '' : '서로소로 약분하면 ' + T(v.ans.p + ':' + v.ans.q) + '. '}${T('p+q=' + v.ans.tex)}.`,
        highlight: `💡 평행한 두 선분(${T('OB\\parallel AH')})이 만드는 두 삼각형은 닮음입니다. 넓이의 비 = 닮음비의 제곱이라 ${T('C')}의 좌표를 구하지 않고도 비가 나옵니다.` };
    };
  }
  function n3Box(t) { return { x: [-1.7, t + 3.4], y: [-1.9, t * t + 2.1] }; }
  function drawN3(b, s, v, lab) {
    const tab = tabOf(b, lab), ex = tab === 'explore';
    const V = var3.cur();
    const t = ex ? N3_BASE.t : V.t, a = ex ? N3_BASE.a : V.a, pa = n3Para(t, a);
    const box = n3Box(t);
    stage(b, s, 'n3|' + tab + '|' + (ex ? 'base' : V.key), box, ex ? (b.k < 32 ? 2 : 1) : (t > 3 ? 4 : 2));
    const f = (x) => x * x + pa.p * x + pa.q;
    b.plot(f, { color: 'ink', width: 3.6, glow: true });
    if (ex) {
      const m = s.n3a, D = (pa.p - m) ** 2 - 4 * pa.q;
      const roots = D < -EPS ? [] : near(D, 0, 1e-6) ? [(m - pa.p) / 2] : [(m - pa.p - Math.sqrt(D)) / 2, (m - pa.p + Math.sqrt(D)) / 2];
      b.line([0, 0], m, { color: 'amber', width: 3, extent: [-0.4, box.x[1] + 1] });
      roots.forEach((x) => b.point([x, m * x], { color: roots.length === 1 ? 'amber' : 'green', r: roots.length === 1 ? 7.5 : 6 }));
      if (roots.length === 1) b.text([roots[0] + 0.2, m * roots[0] + 0.7], 'A', { color: 'amber', size: 14, align: 'left', weight: 800 });
      b.handle('M', [1.5, 1.5 * m], { color: 'amber', label: 'y = ax', dx: 12, dy: 16, ariaLabel: '직선의 기울기 a',
        drag: (w) => { s.n3a = clamp(Math.round((w.y / 1.5) * 50) / 50, PARAMS.n3a.min, PARAMS.n3a.max); } });
      return;
    }
    const A = [t, a * t], B = [0, pa.q], H = [t, 0], den = a + t, C = [t * t / den, a * t * t / den];
    b.line([0, 0], a, { color: 'amber', width: 3, extent: [-0.4, t + 2.4] });
    b.seg(B, H, { color: 'violet', width: 2.6 });
    b.seg(A, H, { color: 'ink', width: 2.2 });
    b.poly([B, [0, 0], C], { fill: 'sky', fillAlpha: 0.26, color: null });
    b.poly([A, C, H], { fill: 'rose', fillAlpha: 0.3, color: null });
    const cx1 = (0 + 0 + C[0]) / 3, cy1 = (pa.q + 0 + C[1]) / 3;
    b.text([cx1 - 0.05, cy1 + 0.1], 'S₁', { color: 'sky', size: 14, weight: 800 });
    b.text([t + 0.18, a * t * 0.45], 'S₂', { color: 'rose', size: 14, weight: 800, align: 'left' });
    dot(b, A, 'amber', tab === 'problem' || s.step < 1 ? 'A' : `A(${t}, ${a * t})`, 10, -12, { r: 5.5 });
    dot(b, B, 'violet', shown(tab, s, 2) ? `B(0, ${pa.q})` : 'B', 10, -10);
    dot(b, H, 'ink', shown(tab, s, 2) ? `H(${t}, 0)` : 'H', 8, 16);
    dot(b, C, 'rose', 'C', 0, -15, { align: 'center' });
    if (shown(tab, s, 3) && tab !== 'problem') {
      b.text([cx1 - 0.05, cy1 - 0.75], frTxt(t ** 4, 2 * den), { color: 'sky', size: 13, weight: 800 });
      b.text([t + 0.18, a * t * 0.45 - 0.75], frTxt(a * a * t * t, 2 * den), { color: 'rose', size: 13, weight: 800, align: 'left' });
    }
  }
  const frTxt = (n, d) => { const g = gcd(n, d) || 1; return d / g === 1 ? String(n / g) : n / g + '/' + d / g; };
  function viewN3(s) {
    const m = s.n3a, pa = n3Para(N3_BASE.t, N3_BASE.a), D = (pa.p - m) ** 2 - 4 * pa.q;
    const n = D < -1e-6 ? 0 : near(D, 0, 1e-6) ? 1 : 2;
    return {
      readouts: [
        { label: '직선 y = ax 의 기울기 a', value: 'a = ' + fmt(m), color: 'amber' },
        { label: '판별식 D = (a+4)² − 36', value: fmt(D), color: 'violet' },
        { label: '교점의 개수', value: n + '개', color: 'green' }
      ],
      status: n === 1 ? { tone: 'key', text: '접합니다 (D = 0) → a = 2, 접점 A(3, 6)' } : n === 2 ? { tone: 'ok', text: '서로 다른 두 점에서 만납니다 (D > 0)' } : { tone: 'info', text: '만나지 않습니다 (D < 0)' },
      formula: `• 직선 ${T('y=ax')}와 포물선 ${T('y=x^2-4x+9')}의 교점 ⟺ ${T('x^2-(a+4)x+9=0')}의 실근<br/>• 접한다 ⟺ ${T('D=(a+4)^2-36=0')} ⟺ 중근. 접점의 ${T('x')}좌표는 중근 ${T('x=\\dfrac{a+4}{2}')}.`,
      rule: '직선이 포물선에 접하는 순간은 연립한 이차방정식의 판별식 D=0 (중근)이다. 직선을 돌리면 D의 부호가 + → 0 → − 로 바뀐다.',
      notes: `• ${T('D=0')}을 풀면 ${T('a')}가 두 개 나오지만 ${T('a\\gt0')}인 하나가 그림의 접선입니다(다른 하나는 ${T('a=-10')}).<br/>• 접선이 정해지면 접점 ${T('A')}가 정해져 넓이 문제로 이어집니다(문제 탭).`
    };
  }

  /* ======================= 장면 4 · 이차부등식과 정수해 ======================= */
  // (x-p)(x-k) ≤ 0 (또는 <0)  이고  (x-q)(x-r) < 0
  const N4_BASE = { p: 1, q: 2, r: 9 };
  const N4_POOL = [[1, 2, 9, 3, false], [0, 3, 10, 2, true], [2, 4, 10, 4, false], [1, 3, 9, 2, true], [-1, 1, 8, 4, false], [0, 2, 9, 5, true]];
  const var4 = varier((prev) => {
    const c = prev ? pickNew(N4_POOL, prev, (x) => 'n4_' + x.join('_') === prev.key) : N4_POOL[0];
    const [p, q, r, n, strict] = c;
    const kLo = q + n, kHi = q + n + 1;
    const rng = strict ? `${kLo}\\lt k\\le ${kHi}` : `${kLo}\\le k\\lt ${kHi}`;
    return { key: 'n4_' + c.join('_'), p, q, r, n, strict, kLo, kHi, ans: { tex: rng, val: rng } };
  });
  const n4Text = (v) => {
    const first = `x^2-(k${v.p === 0 ? '' : v.p > 0 ? '+' + v.p : '' + v.p})x${v.p === 0 ? '' : v.p === 1 ? '+k' : v.p === -1 ? '-k' : v.p > 0 ? '+' + v.p + 'k' : v.p + 'k'}${v.strict ? '\\lt0' : '\\le0'}`;
    const second = `${polyTex(1, -(v.q + v.r), v.q * v.r)}\\lt0`;
    return `${T('x')}에 대한 연립부등식 ${T('\\begin{cases}' + first + '\\\\' + second + '\\end{cases}')}을 만족시키는 정수 ${T('x')}가 정확히 ${v.n}개가 되도록 하는 실수 ${T('k')}의 값의 범위를 구하시오.`;
  };
  function n4Sets(p, k, q, r, strict) {
    const lo = Math.min(p, k), hi = Math.max(p, k);
    const inA = (x) => (strict ? x > lo + 1e-9 && x < hi - 1e-9 : x >= lo - 1e-9 && x <= hi + 1e-9);
    const inB = (x) => x > q + 1e-9 && x < r - 1e-9;
    const ints = [];
    for (let x = Math.floor(Math.min(q, p)) - 2; x <= Math.ceil(Math.max(r, k)) + 2; x++) if (inA(x) && inB(x)) ints.push(x);
    const lo2 = Math.max(lo, q), hi2 = Math.min(hi, r);
    return { lo, hi, ints, lo2, hi2 };
  }
  function n4Steps(v) {
    const { p, q, r, n, strict } = v;
    const kA = strict ? '(x-' + p + ')(x-k)\\lt0' : '(x-' + p + ')(x-k)\\le0';
    return [
      `둘째 부등식을 인수분해하면 ${T('(' + xm(q) + ')(' + xm(r) + ')\\lt0')} ⇒ ${T(q + '\\lt x\\lt ' + r)}. 이 안의 정수는 ${T((q + 1) + ',\\ \\ldots,\\ ' + (r - 1))}.`,
      `첫째 부등식 ${T(kA)}의 해는 ${T('x')}가 ${T(p)}에서 ${T('k')}까지(${strict ? '양 끝 제외' : '양 끝 포함'})입니다. ${T('k')}가 오른쪽으로 갈수록 공통 구간 ${T('(' + q + ',\\ k' + (strict ? ')' : ']'))}에 정수가 하나씩 들어옵니다.`,
      `정수가 정확히 ${n}개이려면 ${T((q + 1) + ',\\ \\ldots,\\ ' + (q + n))}까지만 들어와야 하므로 ${strict ? T(q + n + '\\lt k\\le ' + (q + n + 1)) : T(q + n + '\\le k\\lt ' + (q + n + 1))}. 정답 ${T(v.ans.tex)}.`
    ];
  }
  const upTo = (a, b) => (a === b ? a + ' 한 개' : a + '부터 ' + b + '까지 ' + (b - a + 1) + '개'); // 정수 범위 말하기
  function n4Sol(which) {
    return () => {
      const v = var4.cur(), { p, q, r, n, strict } = v;
      if (which === 'std') {
        return { steps: `① 둘째 부등식: ${T('(' + xm(q) + ')(' + xm(r) + ')\\lt0')} ⇒ ${T(q + '\\lt x\\lt ' + r)}.<br/>
② 첫째 부등식: ${T('(' + xm(p) + ')(x-k)' + (strict ? '\\lt' : '\\le') + '0')} ⇒ ${T('k\\gt ' + p)}이면 ${strict ? T(p + '\\lt x\\lt k') : T(p + '\\le x\\le k')}.<br/>
③ 공통 구간은 ${strict ? T(q + '\\lt x\\lt k') : T(q + '\\lt x\\le k')}이고 정수는 ${T((q + 1) + ',\\ (' + (q + 2) + '),\\ \\ldots')}처럼 ${T(q + 1)}부터 차례로 들어옵니다.<br/>
④ 정수 해가 ${n}개이려면 정수 ${q + n}까지는 들어오고 ${q + n + 1}부터는 들어오지 않아야 합니다. ${strict
  ? '열린 끝이라 끝점에 놓인 정수는 포함되지 않습니다. ' + T('k') + '가 ' + (q + n) + '이하이면 정수는 ' + upTo(q + 1, q + n - 1) + ', ' + T('k') + '가 ' + (q + n) + '보다 커지면 ' + n + '개이고, ' + T('k=' + (q + n + 1)) + '이 되어도 그 끝점 정수는 빠지므로 ' + n + '개입니다.'
  : '닫힌 끝이라 끝점에 놓인 정수는 포함됩니다. ' + T('k') + '가 ' + (q + n) + '보다 작으면 정수는 ' + upTo(q + 1, q + n - 1) + ', ' + T('k') + '가 ' + (q + n) + '에 닿는 순간 ' + n + '개가 됩니다. ' + T('k') + '가 ' + (q + n + 1) + '에 닿으면 ' + n + '개를 넘어 ' + (n + 1) + '개가 되므로 ' + T('k\\lt ' + (q + n + 1)) + '이어야 합니다.'}<br/>
⑤ 따라서 ${T(v.ans.tex)}.`,
          warning: `⚠️ 끝점에서 등호를 따질 때는 <strong>${T('k')}에 경계 숫자를 직접 넣어</strong> 정수 개수를 세어 봅니다(${strict ? T('k=' + (q + n + 1)) + '일 때 열린 끝이라 개수 ' + n : T('k=' + (q + n + 1)) + '일 때 닫힌 끝이라 개수 ' + (n + 1)}).` };
      }
      return { steps: `${T('x')}축을 수직선으로 보고, 첫째 부등식의 해 ${strict ? '(' : '['}${T(p)}, ${T('k')}${strict ? ')' : ']'}와 둘째 부등식의 해 ${T('(' + q + ',\\ ' + r + ')')}를 겹칩니다. ${T('k')}를 키우면 공통 구간의 오른쪽 끝이 따라 움직이며 <strong>${T('k')}가 정수를 지나는 순간마다</strong> 정수 해가 하나씩 늘어납니다. ${T(n)}개 ⇒ ${T(v.ans.tex)}.`,
        highlight: `💡 이차부등식은 포물선에서 x축 아래(또는 위) 구간을 수직선으로 옮기는 일입니다. 공통 구간의 끝이 정수에 닿을 때 닫힌 끝(포함)·열린 끝(제외)이 정수 개수를 가릅니다.` };
    };
  }
  const N4_Y = { f: 0, g: -3.7, r: -7.4 }, N4_X = [-2.6, 11.6], N4_CAP = 1.5, N4_DEPTH = 1.7;
  function sketchPath(b, lo, hi, yBase, color, width, alpha) {
    const K = (4 * N4_DEPTH) / ((hi - lo) ** 2);
    const pts = [];
    for (let x = N4_X[0]; x <= N4_X[1] + 1e-9; x += 0.05) {
      const y = K * (x - lo) * (x - hi);
      if (y <= N4_CAP) pts.push([x, yBase + y]);
    }
    if (pts.length > 1) b.path(pts, { color, width, alpha, glow: width > 3 });
  }
  function bandAxis(b, y, label, color, labelDy) {
    b.seg([N4_X[0] + 0.1, y], [N4_X[1] - 0.1, y], { color: 'muted', width: 1.5, alpha: 0.9 });
    b.text([N4_X[0] + 0.15, y + (labelDy == null ? 1.75 : labelDy)], label, { color, size: 13, align: 'left', weight: 800 });
  }
  function endDot(b, x, y, closed, color, label, dy) {
    b.point([x, y], { color, r: 5.5, hollow: !closed });
    if (label != null) b.text([x, y + (dy == null ? -0.65 : dy)], label, { color, size: 12.5, weight: 800 });
  }
  function drawN4(b, s, v, lab) {
    const tab = tabOf(b, lab), ex = tab === 'explore';
    const V = var4.cur();
    const cfg = ex ? { p: N4_BASE.p, q: N4_BASE.q, r: N4_BASE.r, strict: s.n4strict } : V;
    const { p, q, r, strict } = cfg;
    stage0(b, s, 'n4|' + tab + '|' + (ex ? 'base' : V.key), { x: N4_X, y: [-8.9, 2.9] });
    // 어떤 k 를 보여 줄까
    let k;
    if (ex) k = s.n4k;
    else if (tab === 'review' && s.step >= 2) k = strict ? V.kLo + 0.4 : V.kLo;
    else k = (q + r) / 2; // 문제 그림의 k는 그저 문자(답과 무관한 자리)
    const A = n4Sets(p, k, q, r, strict);
    const showInts = ex || shown(tab, s, 1);
    // 위: f(x) 의 포물선과 해
    bandAxis(b, N4_Y.f, strict ? 'f(x) < 0' : 'f(x) ≤ 0', 'sky');
    sketchPath(b, A.lo, A.hi, N4_Y.f, 'sky', 3.4, 1);
    b.seg([A.lo, N4_Y.f], [A.hi, N4_Y.f], { color: 'sky', width: 6, glow: true });
    endDot(b, A.lo, N4_Y.f, !strict, 'sky', cfg.p === A.lo ? String(p) : 'k', -0.85);
    endDot(b, A.hi, N4_Y.f, !strict, 'sky', cfg.p === A.hi ? String(p) : 'k', -0.85);
    if (ex) b.handle('K', [Math.max(p, k), N4_Y.f], { color: 'amber', ariaLabel: '오른쪽 끝 k', drag: (w) => { s.n4k = clamp(Math.round(w.x * 20) / 20, PARAMS.n4k.min, PARAMS.n4k.max); } });
    // 가운데: g(x)
    bandAxis(b, N4_Y.g, 'g(x) < 0', 'rose');
    sketchPath(b, q, r, N4_Y.g, 'rose', 3.4, 1);
    b.seg([q, N4_Y.g], [r, N4_Y.g], { color: 'rose', width: 6, glow: true });
    endDot(b, q, N4_Y.g, false, 'rose', String(q), -0.85);
    endDot(b, r, N4_Y.g, false, 'rose', String(r), -0.85);
    // 아래: 공통 구간과 정수
    bandAxis(b, N4_Y.r, '공통 구간 · 정수 해', 'green');
    for (let x = Math.ceil(N4_X[0] + 0.3); x <= N4_X[1] - 0.2; x++) {
      b.seg([x, N4_Y.r - 0.12], [x, N4_Y.r + 0.12], { color: 'muted', width: 1.4 });
      b.text([x, N4_Y.r - 0.62], String(x), { color: 'muted', size: 12, weight: 650 });
    }
    const hasCommon = A.hi2 > A.lo2 + 1e-9;
    if (showInts && hasCommon) {
      b.seg([A.lo2, N4_Y.r], [A.hi2, N4_Y.r], { color: 'green', width: 6, glow: true });
      b.point([A.lo2, N4_Y.r], { color: 'green', r: 4.5, hollow: true }); // 둘째 부등식의 왼쪽 끝(열린 끝)
      b.point([A.hi2, N4_Y.r], { color: 'green', r: 4.5, hollow: !(cfg.strict === false && A.hi2 < r) });
    }
    if (showInts) {
      for (let x = Math.ceil(N4_X[0]); x <= N4_X[1]; x++) {
        const on = A.ints.includes(x);
        const inB = x > q && x < r;
        if (on) b.point([x, N4_Y.r], { color: 'green', r: 6.5 });
        else if (inB && !ex) b.point([x, N4_Y.r], { color: 'muted', r: 3.6, hollow: true });
      }
      b.text([N4_X[1] - 0.15, N4_Y.r + 1.05], `정수 ${A.ints.length}개`, { color: 'green', size: 14, align: 'right', weight: 800 });
    }
    if (!ex && tab === 'review' && s.step >= 3) {
      b.point([V.kHi, N4_Y.f], { color: 'amber', r: 5.5, hollow: true, label: 'k = ' + V.kHi, dx: 11, dy: 0, align: 'left' });
    }
  }
  function stage0(b, s, sig, box) { if (s.cqSig !== sig) { s.cqSig = sig; b.setFocus(box, true); } }
  function viewN4(s) {
    const { p, q, r } = N4_BASE, k = s.n4k, strict = !!s.n4strict;
    const A = n4Sets(p, k, q, r, strict);
    const hasCommon = A.hi2 > A.lo2 + 1e-9;
    return {
      readouts: [
        { label: '오른쪽 끝 k', value: 'k = ' + fmt(k), color: 'amber' },
        { label: '첫째 해 (' + (strict ? '양 끝 제외' : '양 끝 포함') + ')', value: `${strict ? '(' : '['}${fmtEnd(p)}, ${fmtEnd(k)}${strict ? ')' : ']'}`, color: 'sky' },
        { label: '정수 해', value: A.ints.length ? A.ints.join(', ') + ` (${A.ints.length}개)` : '없음 (0개)', color: 'green', wide: true }
      ],
      status: { tone: 'info', text: `정수 해 ${A.ints.length}개` },
      formula: `• 이차부등식 ${T('(x-p)(x-k)\\le0')}의 해 = 포물선이 ${T('x')}축 아래(또는 위)인 구간 = ${T('[p,\\ k]')}<br/>• 연립부등식의 해 = 각 부등식의 해 구간을 수직선에 그려 <strong>겹치는 부분</strong>`,
      rule: '정수 해의 개수는 공통 구간의 끝점이 정수를 지나는 순간 바뀐다. 끝점이 닫혀 있으면 그 정수를 포함하고, 열려 있으면 제외한다.',
      notes: `• 등호를 따질 때는 ${T('k')}에 경계 정수를 직접 넣어 개수를 세어 봅니다.<br/>• 「첫째 부등식」 단추로 ${T('\\le')}와 ${T('\\lt')}를 바꾸면 같은 ${T('k')}에서 정수 개수가 달라집니다.`
    };
  }
  const fmtEnd = (v) => (Number.isInteger(v) ? String(v) : fmt(v, 2));

  /* ======================= 장면 5 · 구간 [t, t+L] 과 M(t), m(t) ======================= */
  const N5_BASE = { a: 1, p: 2, q: -1, L: 1 };
  const N5_POOL = [[1, 2, -1, 1, 'min'], [1, 3, 0, 2, 'min'], [2, 2, -3, 1, 'min'], [1, 2, 1, 3, 't'], [2, 3, -2, 2, 't'], [1, 4, 0, 1, 't']];
  const var5 = varier((prev) => {
    const c = prev ? pickNew(N5_POOL, prev, (x) => 'n5_' + x.join('_') === prev.key) : N5_POOL[0];
    const [a, p, q, L, type] = c;
    const val = a * L * L / 4;
    const tval = p - L / 2;
    return { key: 'n5_' + c.join('_'), a, p, q, L, type, ans: type === 'min' ? { tex: frTex(a * L * L, 4), val } : { tex: Number.isInteger(tval) ? String(tval) : frTex(2 * p - L, 2), val: tval } };
  });
  const n5Text = (v) => `이차함수 ${T('f(x)=' + (v.a === 1 ? '' : v.a) + (v.p === 0 ? 'x^2' : '(' + xm(v.p) + ')^2') + (v.q === 0 ? '' : v.q > 0 ? '+' + v.q : v.q))}에 대하여, 실수 ${T('t')}에 대한 닫힌구간 ${T('[t,\\ t+' + v.L + ']')}에서의 ${T('f(x)')}의 최댓값을 ${T('M(t)')}, 최솟값을 ${T('m(t)')}라 하자. ${v.type === 'min' ? T('M(t)-m(t)') + '의 최솟값' : T('M(t)-m(t)') + '가 최소가 되도록 하는 ' + T('t') + '의 값'}을 구하시오.`;
  const n5Fn = (P) => (x) => P.a * (x - P.p) ** 2 + P.q;
  function n5MM(P, t) {
    const f = n5Fn(P), t1 = t + P.L;
    const xs = [t, t1].concat(P.p >= t && P.p <= t1 ? [P.p] : []);
    const ys = xs.map(f);
    const M = Math.max(...ys), m = Math.min(...ys);
    return { M, m, xM: xs[ys.indexOf(M)], xm: xs[ys.indexOf(m)] };
  }
  function n5Steps(v) {
    const { a, p, q, L } = v;
    return [
      `구간이 꼭짓점의 왼쪽(${T('t+' + L + '\\le ' + p)})이면 ${T('f')}가 감소하므로 최소는 오른쪽 끝, 최대는 왼쪽 끝. 구간이 꼭짓점 오른쪽(${T('t\\ge ' + p)})이면 반대입니다.`,
      `구간 안에 꼭짓점이 있으면(${T('t\\le ' + p + '\\le t+' + L)}) 최소는 꼭짓점 ${T('m=' + q)}, 최대는 꼭짓점에서 더 먼 끝점입니다. 구간의 가운데가 축 ${T('x=' + p)}의 왼쪽이면 왼쪽 끝, 오른쪽이면 오른쪽 끝.`,
      `${T('M(t)-m(t)')}는 구간의 가운데가 축에 올 때 최소입니다: ${T('t+\\dfrac{' + L + '}{2}=' + p)} ⇒ ${T('t=' + frTex(2 * p - L, 2))}. 그때 ${T('M-m=' + (a === 1 ? '' : a) + '\\left(\\dfrac{' + L + '}{2}\\right)^2=' + frTex(a * L * L, 4))}. 정답 ${T(v.ans.tex)}.`
    ];
  }
  function n5Sol(which) {
    return () => {
      const v = var5.cur(), { a, p, q, L } = v;
      if (which === 'std') {
        return { steps: `① ${T('t+' + L + '\\lt ' + p)}: ${T('M-m=f(t)-f(t+' + L + ')')}는 ${T('t')}가 커질수록 줄어듭니다.<br/>
② ${T('t\\le ' + p + '\\le t+' + L)}: ${T('m=' + q)}. ${T('t\\le ' + frTex(2 * p - L, 2))}이면 ${T('M=f(t)')}이므로 ${T('M-m=' + (a === 1 ? '' : a) + '(' + xm(p).replace('x', 't') + ')^2')}(감소), 그 오른쪽이면 ${T('M=f(t+' + L + ')')}이므로 ${T('M-m=' + (a === 1 ? '' : a) + '(t+' + L + '-' + p + ')^2')}(증가).<br/>
③ ${T('t\\gt ' + p)}: ${T('M-m=f(t+' + L + ')-f(t)')}는 커집니다.<br/>
④ 따라서 ${T('t=' + frTex(2 * p - L, 2))}에서 최소 ${T('M-m=' + frTex(a * L * L, 4))}. ⇒ ${v.type === 'min' ? '최솟값 ' : '그때의 ' + T('t') + ' = '}${T(v.ans.tex)}`,
          warning: `⚠️ 두 값을 구별하세요. ${T('t=' + (p - L))}: 구간의 오른쪽 끝이 꼭짓점에 닿는 순간, ${T('t=' + frTex(2 * p - L, 2))}: 구간의 가운데가 축에 오는 순간(최솟값은 이때).` };
      }
      const tc = frTex(2 * p - L, 2);
      return { steps: `${T('M(t)-m(t)')}는 구간의 "높이 차"입니다. 포물선은 축에서 멀수록 가파르므로, 구간이 <strong>축에 대칭</strong>(구간의 가운데가 축 ${T('x=' + p)}에 올 때)일 때 차가 가장 작습니다. ${T('t=' + tc)}이고, 그때 양 끝의 높이가 같으므로 ${T('M-m=a\\left(\\dfrac L2\\right)^2=' + frTex(a * L * L, 4))}.`,
        highlight: `💡 구간 길이 ${T('L')}, 최고차항 계수 ${T('a')}이면 구간이 축에 대칭일 때 ${T('M-m=\\dfrac{aL^2}{4}')} 로 ${T('p,\\ q')}와 상관없이 정해집니다.` };
    };
  }
  function n5Box(P) { return { x: [P.p - 4.4, P.p + 4.4], y: [P.q - 2.2, P.q + 8.2] }; }
  function drawWindow(b, P, t, o = {}) {
    const f = n5Fn(P), t1 = t + P.L, mm = n5MM(P, t), box = o.box;
    const y0 = box.y[0], y1 = box.y[1];
    const al = o.alpha == null ? 1 : o.alpha;
    b.poly([[t, y0], [t1, y0], [t1, y1], [t, y1]], { fill: 'amber', fillAlpha: 0.12 * al, color: null });
    b.seg([t, y0], [t, y1], { color: 'amber', width: 1.8, dash: [6, 4], alpha: 0.7 * al });
    b.seg([t1, y0], [t1, y1], { color: 'amber', width: 1.8, dash: [6, 4], alpha: 0.7 * al });
    b.plot(f, { from: t, to: t1, color: 'amber', width: 4.4, glow: true, alpha: al });
    if (o.dots === false) { // 문제 탭: 구간 모양만 보여 주고 최대·최소 위치는 숨깁니다
      b.text([t, y0 + 0.5], 't', { color: 'amber', size: 13.5, weight: 800 });
      b.text([t1, y0 + 0.5], 't+' + P.L, { color: 'amber', size: 13.5, weight: 800 });
      return;
    }
    b.point([mm.xm, mm.m], { color: 'green', r: 6, label: o.labels ? '최소' : '', dx: 10, dy: 16, align: 'left' });
    b.point([mm.xM, mm.M], { color: 'rose', r: 6, label: o.labels ? '최대' : '', dx: mm.xM === t ? -10 : 10, dy: -12, align: mm.xM === t ? 'right' : 'left' });
    if (o.bracket) {
      const bx = o.bracketX == null ? t1 + 0.28 : o.bracketX;
      b.seg([bx, mm.m], [bx, mm.M], { color: 'violet', width: 2.8 });
      b.seg([bx - 0.1, mm.m], [bx + 0.1, mm.m], { color: 'violet', width: 2.8 });
      b.seg([bx - 0.1, mm.M], [bx + 0.1, mm.M], { color: 'violet', width: 2.8 });
      if (o.bracketLabel) b.text([bx + 0.18, (mm.m + mm.M) / 2], o.bracketLabel, { color: 'violet', size: 13, align: 'left', weight: 800 });
    }
  }
  function drawN5(b, s, v, lab) {
    const tab = tabOf(b, lab), ex = tab === 'explore';
    const V = var5.cur();
    const P = ex ? N5_BASE : V;
    const box = n5Box(P);
    stage(b, s, 'n5|' + tab + '|' + (ex ? 'base' : V.key), box);
    const f = n5Fn(P);
    b.plot(f, { color: 'ink', width: 3.4, glow: true });
    b.text([P.p, P.q + 7.1], 'y = f(x)', { color: 'ink', size: 13.5, weight: 800 });
    const legend = () => {
      b.stext(14, b.H - 54, '● 최댓값', { color: 'rose', size: 13, align: 'left', weight: 800 });
      b.stext(14, b.H - 32, '● 최솟값', { color: 'green', size: 13, align: 'left', weight: 800 });
    };
    if (ex) {
      legend();
      // 추적 곡선: x 자리에 t 를 놓고 M(t), m(t) 를 이어 그립니다
      const ptsM = [], ptsm = [];
      for (let t = PARAMS.n5t.min; t <= PARAMS.n5t.max + 1e-9; t += 0.04) { const mm = n5MM(P, t); ptsM.push([t, mm.M]); ptsm.push([t, mm.m]); }
      b.path(ptsM, { color: 'rose', width: 2.4, dash: [4, 4], alpha: 0.85 });
      b.path(ptsm, { color: 'green', width: 2.4, dash: [4, 4], alpha: 0.85 });
      const t = s.n5t, mm = n5MM(P, t);
      drawWindow(b, P, t, { box, bracket: true, labels: true, bracketLabel: 'M−m' });
      b.point([t, mm.M], { color: 'rose', r: 4, hollow: true });
      b.point([t, mm.m], { color: 'green', r: 4, hollow: true });
      b.handle('T', [t, box.y[0] + 0.55], { color: 'amber', label: 't', dx: 16, dy: 0, align: 'left', ariaLabel: '구간 왼쪽 끝 t',
        drag: (w) => { s.n5t = clamp(Math.round(w.x * 20) / 20, PARAMS.n5t.min, PARAMS.n5t.max); } });
      return;
    }
    const tA = P.p - P.L - 0.9, tB = P.p - 0.7 * P.L, tC = P.p - P.L / 2;
    if (tab === 'problem') {
      drawWindow(b, P, tA, { box, alpha: 0.9, dots: false });
      return;
    }
    if (s.step >= 1) legend();
    if (s.step >= 1) drawWindow(b, P, tA, { box, alpha: 0.55 });
    if (s.step >= 2) drawWindow(b, P, tB, { box, alpha: 0.55 });
    if (s.step >= 3) drawWindow(b, P, tC, { box, alpha: 1, bracket: true, bracketLabel: 'M−m = ' + fmtEnd(P.a * P.L * P.L / 4) });
  }
  function viewN5(s) {
    const P = N5_BASE, t = s.n5t, mm = n5MM(P, t), d = mm.M - mm.m;
    const side = (x) => (near(x, t) ? '왼쪽 끝 x = ' + fmt(t) : near(x, t + P.L) ? '오른쪽 끝 x = ' + fmt(t + P.L) : '꼭짓점 x = ' + P.p);
    return {
      readouts: [
        { label: '구간', value: `[${fmt(t)}, ${fmt(t + P.L)}]`, color: 'amber' },
        { label: '최솟값 m(t)', value: fmt(mm.m), color: 'green', note: side(mm.xm) },
        { label: '최댓값 M(t)', value: fmt(mm.M), color: 'rose', note: side(mm.xM) },
        { label: 'M(t) − m(t)', value: fmt(d), color: 'violet', note: near(t, P.p - P.L / 2, 0.026) ? '구간의 가운데가 축 → 최소' : '' }
      ],
      status: near(t, P.p - P.L / 2, 0.026) ? { tone: 'key', text: '구간의 가운데가 축 x=2 에 왔습니다 → M−m 최소' } : null,
      formula: `• ${T('f(x)=(x-' + P.p + ')^2' + P.q)} 에서 구간 ${T('[t,\\ t+1]')}을 밀며 점선으로 ${T('M(t)')}(분홍), ${T('m(t)')}(초록)을 그립니다.<br/>• 꼭짓점이 구간 안에 들어오면 ${T('m(t)')}는 평평해지고(${T('' + P.q)}), ${T('M(t)')}는 가운데를 기준으로 왼쪽 끝 → 오른쪽 끝으로 바뀝니다.`,
      rule: '구간을 밀 때 최대·최소가 바뀌는 순간은 ① 구간이 꼭짓점에 닿을 때 ② 구간의 가운데가 축을 지날 때다.',
      notes: `• ${T('t')}를 밀수록 ${T('M-m')}이 줄다가(오른쪽 끝이 꼭짓점을 향함), 구간이 축을 중심으로 대칭일 때 최소, 그 뒤 다시 커집니다.<br/>• ${T('m(t)')}의 그래프는 바닥이 평평한 모양, ${T('M(t)')}의 그래프는 가운데에서 꺾입니다.`
    };
  }

  /* ======================= 장면 6 · 움직이는 직선 y=k 와 넓이 ======================= */
  // 사각형 O(0,0) A(a,0) B(a,b) C(0,c), 0<k<c<b<3c,  S1=ODE, S2=OAFE, S3=EFB, S4=DEBC
  const N6_BASE = { a: 3, b: 3, c: 2 };
  const n6Areas = (P, k) => {
    const { a, b, c } = P;
    const S1 = a * k * k / (2 * b), S3 = a * (b - k) * (b - k) / (2 * b), S2 = a * k - S1, S4 = 0.5 * (b + c) * a - S1 - S2 - S3;
    return { S1, S2, S3, S4, d13: S1 - S3, d24: S2 - S4, F: (S1 - S3) ** 2 + (S2 - S4) ** 2 };
  };
  const N6_POOL = [[3, 3, 2], [3, 4, 2], [4, 4, 3], [3, 5, 3], [2, 3, 2], [4, 5, 3]];
  const var6 = varier((prev) => {
    const c = prev ? pickNew(N6_POOL, prev, (x) => 'n6_' + x.join('_') === prev.key) : N6_POOL[0];
    const [a, b, cc] = c;
    const num = a * a * (b - cc) * (b - cc);
    return { key: 'n6_' + c.join('_'), a, b, c: cc, ans: { tex: frTex(num, 8), val: num / 8 }, kStar: [b + cc, 4] };
  });
  const n6Text = (v) => `좌표평면 위의 사각형 ${T('OABC')}의 꼭짓점이 ${T('O(0,0),\\ A(' + v.a + ',0),\\ B(' + v.a + ',' + v.b + '),\\ C(0,' + v.c + ')')}이다. ${T('0\\lt k\\lt ' + v.c)}인 실수 ${T('k')}에 대하여 직선 ${T('y=k')}가 세 선분 ${T('OC,\\ OB,\\ AB')}와 만나는 점을 각각 ${T('D,\\ E,\\ F')}라 하자. 삼각형 ${T('ODE')}, 사각형 ${T('OAFE')}, 삼각형 ${T('EFB')}, 사각형 ${T('DEBC')}의 넓이를 차례로 ${T('S_1,\\ S_2,\\ S_3,\\ S_4')}라 할 때, ${T('(S_1-S_3)^2+(S_2-S_4)^2')}의 최솟값을 구하시오.`;
  function n6Steps(v) {
    const { a, b, c } = v;
    return [
      `${T('E')}는 ${T('OB')} 위의 점이므로 ${T('E\\left(' + (a === b ? '' : frTex(a, b)) + 'k,\\ k\\right)')}, ${T('D(0,k)')}, ${T('F(' + a + ',k)')}. ${T('S_1=' + frTex(a, 2 * b) + 'k^2')}, ${T('S_3=' + frTex(a, 2 * b) + '(' + b + '-k)^2')}.`,
      `${T('S_1+S_2=' + a + 'k')}(직사각형 ${T('OAFD')}), ${T('S_1+S_2+S_3+S_4=' + frTex(a * (b + c), 2))}(사각형 전체)로 차를 정리하면 ${T('S_1-S_3=' + a + '\\left(k-' + frTex(b, 2) + '\\right)')}, ${T('S_2-S_4=' + a + '\\left(k-' + frTex(c, 2) + '\\right)')}. 둘 다 ${T('k')}의 일차식입니다.`,
      `${T('' + a * a)}${T('\\left[\\left(k-' + frTex(b, 2) + '\\right)^2+\\left(k-' + frTex(c, 2) + '\\right)^2\\right]')}은 ${T('k')}의 이차식이고 두 수의 중점 ${T('k=' + frTex(b + c, 4))}(${T('0\\lt k\\lt ' + c)} 안)에서 최소입니다. 최솟값 ${T(v.ans.tex)}.`
    ];
  }
  function n6Sol(which) {
    return () => {
      const v = var6.cur(), { a, b, c } = v;
      if (which === 'std') {
        return { steps: `① ${T('S_1=\\dfrac12\\cdot k\\cdot\\dfrac{' + a + 'k}{' + b + '}')}, ${T('S_3=\\dfrac12\\cdot ' + a + '\\left(1-\\dfrac{k}{' + b + '}\\right)(' + b + '-k)')}, ${T('S_2=' + a + 'k-S_1')}, ${T('S_4=\\dfrac{' + a * (b + c) + '}{2}-' + a + 'k-S_3')}.<br/>
② ${T('S_1-S_3=' + a + 'k-' + frTex(a * b, 2))}, ${T('S_2-S_4=' + a + 'k-' + frTex(a * c, 2))}. 제곱해서 더하면 ${T(a * a)}${T('[(k-' + frTex(b, 2) + ')^2+(k-' + frTex(c, 2) + ')^2]')}.<br/>
③ ${T('(k-p)^2+(k-q)^2')}은 ${T('k=\\dfrac{p+q}{2}')}에서 최소 ${T('\\dfrac{(p-q)^2}{2}')}. ${T('p=' + frTex(b, 2) + ',\\ q=' + frTex(c, 2))} ⇒ 최솟값 ${T(a * a + '\\cdot' + frTex((b - c) * (b - c), 8) + '=' + v.ans.tex)}.`,
          warning: `⚠️ ${T('0\\lt k\\lt ' + c)}에서 최소가 되는 ${T('k=' + frTex(b + c, 4))}가 범위 안에 있는지 확인합니다. 범위 밖이면 끝점에서 최소가 됩니다.` };
      }
      return { steps: `${T('S_1-S_3,\\ S_2-S_4')}가 모두 ${T('k')}의 <strong>일차식</strong>이므로 식을 길게 전개하지 않고, 각각 ${T('0')}이 되는 ${T('k=' + frTex(b, 2))}, ${T('k=' + frTex(c, 2))}의 중점 ${T('k=' + frTex(b + c, 4))}에서 최소입니다. 최솟값 = ${T(a * a + '\\cdot\\dfrac{\\left(' + frTex(b, 2) + '-' + frTex(c, 2) + '\\right)^2}{2}=' + v.ans.tex)}.`,
        highlight: `💡 넓이를 ${T('k')}의 식으로 쓰면 이차함수의 최소 문제로 바뀝니다. 움직이는 선분이 만드는 도형은 "움직이는 부분 + 남는 부분"으로 쪼개 일차·이차 관계를 먼저 찾습니다.` };
    };
  }
  function n6Box(P) { return { x: [-1.15, P.a + 1.15], y: [-0.95, P.b + 0.95] }; }
  function drawN6(b, s, v, lab) {
    const tab = tabOf(b, lab), ex = tab === 'explore';
    const V = var6.cur();
    const P = ex ? N6_BASE : V;
    const box = n6Box(P);
    stage(b, s, 'n6|' + tab + '|' + (ex ? 'base' : V.key), box, 1);
    const { a, b: bb, c } = P;
    const kStar = (bb + c) / 4;
    const k = ex ? s.n6k : tab === 'review' && s.step >= 3 ? kStar : 0.6 * c;
    const E = [k * a / bb, k], D = [0, k], F = [a, k], O = [0, 0], A = [a, 0], B = [a, bb], C = [0, c];
    b.poly([O, A, B, C], { fill: 'ink', fillAlpha: 0.05, color: 'ink', width: 2.6 });
    const reg = (pts, col, name, lx, ly) => { b.poly(pts, { fill: col, fillAlpha: 0.3, color: null }); b.text([lx, ly], name, { color: col, size: 14, weight: 800 }); };
    const cen = (pts) => [pts.reduce((p, q) => p + q[0], 0) / pts.length, pts.reduce((p, q) => p + q[1], 0) / pts.length];
    const r1 = [O, D, E], r2 = [O, A, F, E], r3 = [E, F, B], r4 = [D, E, B, C];
    [[r1, 'sky', 'S₁'], [r2, 'green', 'S₂'], [r3, 'rose', 'S₃'], [r4, 'amber', 'S₄']].forEach(([pts, col, nm]) => {
      const ce = cen(pts);
      if (nm === 'S₁') ce[0] += 0.05;
      if (nm === 'S₂') { ce[0] = a * 0.62; ce[1] = k * 0.3; } // E 이름표와 겹치지 않게 아래쪽에 둡니다
      reg(pts, col, nm, ce[0], ce[1] - 0.08);
    });
    b.seg(O, B, { color: 'ink', width: 2.2, alpha: 0.9 });
    b.seg(D, F, { color: 'amber', width: 3.2, glow: true });
    dot(b, A, 'ink', `A(${a}, 0)`, 10, -13, { r: 4.5 });
    dot(b, B, 'ink', `B(${a}, ${bb})`, 10, -10, { r: 4.5 });
    dot(b, C, 'ink', `C(0, ${c})`, -10, -12, { r: 4.5, align: 'right' });
    const xE = a === bb ? 'k' : frTxt(a, bb) + '·k';
    const co = tab === 'review' && s.step >= 1;
    dot(b, D, 'amber', co ? 'D(0, k)' : 'D', 9, -13, { r: 4.5 });
    dot(b, E, 'amber', co ? `E(${xE}, k)` : 'E', 10, 16, { r: 4.5 });
    dot(b, F, 'amber', co ? `F(${a}, k)` : 'F', 10, 3, { r: 4.5 });
    if (ex) {
      b.handle('K', [0, k], { color: 'amber', ariaLabel: '직선 y=k 의 높이',
        drag: (w) => { s.n6k = clamp(Math.round(w.y * 50) / 50, PARAMS.n6k.min, PARAMS.n6k.max); } });
    }
  }
  function viewN6(s, lab) {
    const P = N6_BASE, { a, b: bb, c } = P, k = s.n6k, A = n6Areas(P, k);
    const kStar = (bb + c) / 4, Fmin = a * a * (bb - c) * (bb - c) / 8;
    const kT = frTxt(bb + c, 4), fT = frTxt(a * a * (bb - c) * (bb - c), 8);
    const chips = [];
    if (lab && lab.tab === 'review') {
      const V = var6.cur();
      if (s.step >= 2) chips.push({ tex: 'S_1-S_3=' + V.a + '\\left(k-' + frTex(V.b, 2) + '\\right)', color: 'green', answer: true }, { tex: 'S_2-S_4=' + V.a + '\\left(k-' + frTex(V.c, 2) + '\\right)', color: 'amber', answer: true });
      if (s.step >= 3) chips.push({ tex: '\\text{최소: }k=' + frTex(V.b + V.c, 4), color: 'violet', answer: true });
    }
    return {
      chips,
      readouts: [
        { label: 'S₁ · S₂', value: `${fmt(A.S1)} · ${fmt(A.S2)}`, color: 'sky' },
        { label: 'S₃ · S₄', value: `${fmt(A.S3)} · ${fmt(A.S4)}`, color: 'rose' },
        { label: 'S₁ − S₃ (k의 일차식)', value: fmt(A.d13), color: 'green', note: `= ${a}(k − ${frTxt(bb, 2)})` },
        { label: 'S₂ − S₄ (k의 일차식)', value: fmt(A.d24), color: 'amber', note: `= ${a}(k − ${frTxt(c, 2)})` },
        { label: '(S₁−S₃)² + (S₂−S₄)²', value: fmt(A.F, 3), color: 'violet', wide: true, note: near(k, kStar, 0.011) ? `최소 부근 (k = ${kT} 에서 ${fT})` : '' }
      ],
      status: near(k, kStar, 0.011) ? { tone: 'key', text: `k = ${kT} 일 때 최소 ${fT}` } : null,
      formula: `• 사각형 ${T('OABC')}를 직선 ${T('y=k')}로 자르면 아래쪽 ${T('S_1+S_2=' + a + 'k')}(직사각형), 전체 넓이 ${T('S_1+S_2+S_3+S_4=' + frTex(a * (bb + c), 2))}.<br/>• ${T('S_1-S_3=' + a + '\\left(k-' + frTex(bb, 2) + '\\right)')}, ${T('S_2-S_4=' + a + '\\left(k-' + frTex(c, 2) + '\\right)')} 처럼 <strong>차는 ${T('k')}의 일차식</strong>이라 제곱의 합은 이차식입니다.`,
      rule: '움직이는 직선이 만드는 넓이는 k에 대한 식으로 바꿔 쓴다. 두 넓이의 차가 일차식이면 그 제곱의 합은 두 일차식의 0점의 중점에서 최소다.',
      notes: `• 구간 ${T('0\\lt k\\lt ' + c)} 안에서만 직선이 ${T('OC,\\ OB,\\ AB')}를 모두 지납니다. 최소가 되는 ${T('k')}가 이 구간 안인지 확인하세요.<br/>• ${T('k')}를 움직이며 ${T('S_1-S_3')}이 ${T('0')}이 되는 순간과 ${T('S_2-S_4')}가 ${T('0')}이 되는 순간을 눈으로 확인해 보세요.`
    };
  }

  /* ======================================================================
     파라미터·장면 묶음
     ====================================================================== */
  const PARAMS = {
    n1k: { value: 1.5, min: -5.5, max: 8, step: 0.05, color: 'amber', label: '직선 y = k 의 높이', format: (v) => 'k = ' + fmt(v) },
    n2k: { value: 3, min: -3.5, max: 9.5, step: 0.05, color: 'amber', label: '직선 y = k 의 높이', format: (v) => 'k = ' + fmt(v) },
    n3a: { value: 0.5, min: -0.5, max: 5, step: 0.02, color: 'amber', label: '직선 y = ax 의 기울기 a', format: (v) => 'a = ' + fmt(v) },
    n4k: { value: 4.4, min: 1.2, max: 11, step: 0.05, color: 'amber', label: '첫째 부등식의 오른쪽 끝 k', format: (v) => 'k = ' + fmt(v) },
    n5t: { value: -0.2, min: -0.8, max: 3.6, step: 0.02, color: 'amber', label: '구간의 왼쪽 끝 t', format: (v) => 't = ' + fmt(v) + ',  구간 [t, t+1]' },
    n6k: { value: 0.7, min: 0.05, max: 1.95, step: 0.01, color: 'amber', label: '직선 y = k 의 높이', format: (v) => 'k = ' + fmt(v, 2) }
  };

  const tabs = { compact: true };
  // 상태 배지는 탐구 탭에서만 보입니다(정리·문제 탭 그림을 가리지 않게)
  const exploreOnly = (fn) => (s, lab) => { const v = fn(s, lab); if (lab && lab.tab !== 'explore') delete v.status; return v; };
  const baseScene = (o) => Object.assign({ tabs, reviewTab: true, notesTitle: '시험에서 자주 틀리는 부분' }, o);
  const preset = (group, label, key, val, color) => ({ group, label, color, set: { [key]: val }, ms: 700, on: (st) => Math.abs(st[key] - val) < 0.02 });

  const scenes = [
    baseScene({
      id: 'cq-glue', title: '[기출] 이어 붙인 두 포물선 h(x)와 수평선 y=k', short: '이어 붙인 h(x)와 y=k',
      question: '두 포물선을 x=α, x=β에서 이어 붙인 그래프에 수평선 y=k를 올리고 내리면, 교점 개수는 언제 바뀔까?',
      guide: `굵은 선이 ${T('h(x)')}입니다(안쪽은 ${T('f')}, 바깥쪽은 ${T('g')}). 손잡이(<b>y = k</b>)를 위아래로 끌어 <b>교점 개수가 바뀌는 높이</b>를 찾아보세요. 세 점이 되는 높이는 몇 군데일까요?`,
      focus: n1Box(N1_BASE),
      enter: (s) => { s.cqSig = null; s.n1k = 1.5; },
      controls: () => ['n1k'],
      presets: () => [
        preset('높이 y = k', 'k = −3 (꼭짓점)', 'n1k', N1_BASE.b, 'green'),
        preset('높이 y = k', 'k = −2 (낮은 이음점)', 'n1k', N1_BASE.u, 'amber'),
        preset('높이 y = k', 'k = 0', 'n1k', 0),
        preset('높이 y = k', 'k = 6 (높은 이음점)', 'n1k', N1_BASE.v, 'rose')
      ],
      steps: () => n1Steps(var1.cur()),
      reviewTop: () => `<div class="apl-rich" style="font-size:var(--fs-sm);line-height:1.75"><small style="color:var(--text-3);font-weight:800">문제</small><br>${n1Text(var1.cur())}</div>`,
      problem: { tag: '2024학년도 9월 학평(인천) 21번 · 2025학년도 10월 학평(경기) 30번 유형', time: '목표 시간: 90초', text: () => probHTML(n1Text(var1.cur())), answer: () => T(var1.cur().ans.tex) },
      solution: solRef(n1Sol('std'), n1Sol('quick')),
      view: exploreOnly(viewN1),
      draw: drawN1,
      vary: var1
    }),
    baseScene({
      id: 'cq-product', title: '[기출] 곱의 꼴 {f−k}{g−k}=0 과 수평선', short: '곱의 꼴 방정식',
      question: '곱의 꼴 방정식의 서로 다른 실근은 y=k 와 두 곡선의 교점을 모두 모으면 몇 개일까? 겹치는 근은?',
      guide: `손잡이를 끌어 ${T('y=k')}를 움직이세요. <b>파란 점은 ${T('f(x)=k')}</b>, <b>분홍 점은 ${T('g(x)=k')}</b>의 근입니다. 두 색이 겹친 점은 한 근으로 셉니다. 서로 다른 실근이 3개인 높이는 몇 군데일까요?`,
      focus: n2Box(N2_BASE),
      enter: (s) => { s.cqSig = null; s.n2k = 3; },
      controls: () => ['n2k'],
      presets: () => [
        preset('높이 y = k', 'k = −2 (f의 꼭짓점)', 'n2k', N2_BASE.b, 'sky'),
        preset('높이 y = k', 'k = −1 (교점의 높이)', 'n2k', N2_BASE.pb, 'violet'),
        preset('높이 y = k', 'k = 3', 'n2k', 3),
        preset('높이 y = k', 'k = 7 (교점의 높이)', 'n2k', N2_BASE.pa, 'violet'),
        preset('높이 y = k', 'k = 8 (g의 꼭짓점)', 'n2k', N2_BASE.d, 'rose')
      ],
      steps: () => n2Steps(var2.cur()),
      reviewTop: () => `<div class="apl-rich" style="font-size:var(--fs-sm);line-height:1.75"><small style="color:var(--text-3);font-weight:800">문제</small><br>${n2Text(var2.cur())}</div>`,
      problem: { tag: '2025학년도 6월 학평(부산) 30번 유형 · 2023학년도 6월 학평(부산) 30번 유형', time: '목표 시간: 90초', text: () => probHTML(n2Text(var2.cur())), answer: () => T(var2.cur().ans.tex) },
      solution: solRef(n2Sol('std'), n2Sol('quick')),
      view: exploreOnly(viewN2),
      draw: drawN2,
      vary: var2
    }),
    baseScene({
      id: 'cq-rotate', title: '[기출] 직선을 돌려 접선 찾기 + 넓이의 차', short: '직선 돌리기와 접선',
      question: '원점을 지나는 직선의 기울기를 키우면 교점이 0개 → 1개 → 2개로 바뀐다. 접하는 순간은 언제일까?',
      guide: `손잡이(<b>y = ax</b>)를 위아래로 끌어 기울기 ${T('a')}를 바꿔 보세요. 교점이 <b>딱 한 개</b>가 되는 순간이 접선입니다. 그때 판별식 ${T('D')}의 값은?`,
      focus: n3Box(3),
      enter: (s) => { s.cqSig = null; s.n3a = 0.5; },
      controls: () => ['n3a'],
      presets: () => [
        preset('기울기 a', 'a = 1 (만나지 않음)', 'n3a', 1),
        preset('기울기 a', 'a = 2 (접함)', 'n3a', 2, 'amber'),
        preset('기울기 a', 'a = 3.5 (두 점)', 'n3a', 3.5)
      ],
      steps: () => n3Steps(var3.cur()),
      reviewTop: () => `<div class="apl-rich" style="font-size:var(--fs-sm);line-height:1.75"><small style="color:var(--text-3);font-weight:800">문제</small><br>${n3Text(var3.cur())}</div>`,
      problem: { tag: '2023학년도 6월 학평(부산) 28번 유형 · 2025학년도 9월 학평(인천) 28번 유형', time: '목표 시간: 90초', text: () => probHTML(n3Text(var3.cur())), answer: () => T(var3.cur().ans.tex) },
      solution: solRef(n3Sol('std'), n3Sol('quick')),
      view: exploreOnly(viewN3),
      draw: drawN3,
      vary: var3
    }),
    baseScene({
      id: 'cq-integers', title: '[기출] 이차부등식의 해 구간과 정수해 개수', short: '이차부등식과 정수해',
      question: '두 이차부등식의 해를 수직선에 겹치면, 공통 구간 속 정수 개수는 k가 어디를 지날 때 바뀔까?',
      guide: `위쪽 포물선이 ${T('x')}축 아래인 구간이 ${T('f(x)\\le0')}의 해, 가운데가 ${T('g(x)\\lt0')}의 해입니다. <b>k</b>(금색 점)를 좌우로 끌어 맨 아래 <b>공통 구간의 정수</b>가 늘어나는 순간을 찾아 보세요. 단추로 ${T('\\le')}와 ${T('\\lt')}를 바꿔 보세요.`,
      focus: { x: N4_X, y: [-8.9, 2.9] },
      enter: (s) => { s.cqSig = null; s.n4k = 4.4; s.n4strict = false; },
      controls: () => ['n4k'],
      presets: () => [
        preset('k 의 위치', 'k = 4.9', 'n4k', 4.9),
        preset('k 의 위치', 'k = 5 (정수)', 'n4k', 5, 'amber'),
        preset('k 의 위치', 'k = 5.5', 'n4k', 5.5),
        preset('k 의 위치', 'k = 6 (정수)', 'n4k', 6, 'amber')
      ],
      actions: () => [{ id: 'strict', icon: 'reset', label: (s) => (s.n4strict ? '첫째 부등식: f(x) < 0 (끝 제외)' : '첫째 부등식: f(x) ≤ 0 (끝 포함)'), on: (s) => s.n4strict, run: (s) => { s.n4strict = !s.n4strict; } }],
      steps: () => n4Steps(var4.cur()),
      reviewTop: () => `<div class="apl-rich" style="font-size:var(--fs-sm);line-height:1.75"><small style="color:var(--text-3);font-weight:800">문제</small><br>${n4Text(var4.cur())}</div>`,
      problem: { tag: '2026학년도 6월 학평(부산) 20번 유형 · 2026학년도 10월 학평(경기) 20번 유형', time: '목표 시간: 90초', text: () => probHTML(n4Text(var4.cur())), answer: () => T(var4.cur().ans.tex) },
      solution: solRef(n4Sol('std'), n4Sol('quick')),
      view: exploreOnly(viewN4),
      draw: drawN4,
      vary: var4
    }),
    baseScene({
      id: 'cq-window', title: '[기출] 움직이는 구간의 최대·최소 M(t), m(t)', short: '움직이는 구간의 최대·최소',
      question: '구간 [t, t+1]을 오른쪽으로 밀면 최댓값 M(t)와 최솟값 m(t)가 어떻게 바뀌고, 그 차는 언제 가장 작을까?',
      guide: `손잡이 <b>t</b>를 좌우로 끌어 구간을 밀어 보세요. 초록 점이 <b>최솟값</b>, 분홍 점이 <b>최댓값</b>입니다. 점선은 ${T('m(t)')}, ${T('M(t)')}를 ${T('x')}자리에 ${T('t')}를 놓고 그린 그래프입니다. 보라색 막대 ${T('M-m')}이 가장 짧아지는 위치는?`,
      focus: n5Box(N5_BASE),
      enter: (s) => { s.cqSig = null; s.n5t = -0.2; },
      controls: () => ['n5t'],
      presets: () => [
        preset('구간 위치', '꼭짓점 왼쪽 (t=0)', 'n5t', 0),
        preset('구간 위치', '가운데가 축 (t=1.5)', 'n5t', 1.5, 'violet'),
        preset('구간 위치', '꼭짓점 오른쪽 (t=3)', 'n5t', 3)
      ],
      steps: () => n5Steps(var5.cur()),
      reviewTop: () => `<div class="apl-rich" style="font-size:var(--fs-sm);line-height:1.75"><small style="color:var(--text-3);font-weight:800">문제</small><br>${n5Text(var5.cur())}</div>`,
      problem: { tag: '2019학년도 11월 학평(경기) 20번 유형 · 2024학년도 6월 학평(부산) 30번 유형', time: '목표 시간: 90초', text: () => probHTML(n5Text(var5.cur())), answer: () => T(var5.cur().ans.tex) },
      solution: solRef(n5Sol('std'), n5Sol('quick')),
      view: exploreOnly(viewN5),
      draw: drawN5,
      vary: var5
    }),
    baseScene({
      id: 'cq-sweep', title: '[기출] 움직이는 직선과 넓이의 이차식', short: '움직이는 직선과 넓이',
      question: '직선 y=k를 올리며 사각형을 네 조각 S₁~S₄로 나눌 때, 조각의 넓이 차는 k에 대해 어떤 식일까?',
      guide: `금색 점(<b>k</b>)을 ${T('y')}축을 따라 끌어 보세요. 읽을 것: <b>${T('S_1-S_3')}과 ${T('S_2-S_4')}가 각각 ${T('k')}의 일차식</b>으로 변하고, 제곱의 합이 가장 작아지는 ${T('k')}가 있습니다.`,
      focus: n6Box(N6_BASE),
      enter: (s) => { s.cqSig = null; s.n6k = 0.7; },
      controls: () => ['n6k'],
      presets: () => [
        preset('높이 k', 'S₁ = S₃ (k = 3/2)', 'n6k', 1.5, 'green'),
        preset('높이 k', 'S₂ = S₄ (k = 1)', 'n6k', 1, 'amber'),
        preset('높이 k', '최소 (k = 5/4)', 'n6k', 1.25, 'violet')
      ],
      steps: () => n6Steps(var6.cur()),
      reviewTop: () => `<div class="apl-rich" style="font-size:var(--fs-sm);line-height:1.75"><small style="color:var(--text-3);font-weight:800">문제</small><br>${n6Text(var6.cur())}</div>`,
      problem: { tag: '2019학년도 6월 학평(부산) 20번 유형', time: '목표 시간: 90초', text: () => probHTML(n6Text(var6.cur())), answer: () => T(var6.cur().ans.tex) },
      solution: solRef(n6Sol('std'), n6Sol('quick')),
      view: exploreOnly(viewN6),
      draw: drawN6,
      vary: var6
    })
  ];

  window.APL_CQ_GROUPS = [{
    order: 70, id: 'kice', title: '기출 핵심 유형 (고1 학평 · 그래프의 교점으로 읽기)', short: '기출 핵심 유형',
    params: PARAMS, scenes
  }];
  window.APL_CQ_MATH = { pairOf, hPts, prodRoots, n3Para, n4Sets, n5MM, n6Areas, N1: var1, N2: var2, N3: var3, N4: var4, N5: var5, N6: var6, PAIR_POOL };
})();
