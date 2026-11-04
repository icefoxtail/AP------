/* ==========================================================================
   로그함수 실험실 2개(alg-log · alg-log-deep) 공용 「새 문제」 변형 생성기 + 문제·정리 탭 그림
   - 탐구 탭(옛 장면)은 건드리지 않습니다. 이 파일은 문제 탭·정리 탭에서만 쓰입니다.
   - 첫 문제는 옛 문제 그대로(풀이 글은 호출하는 쪽이 넘긴 원문), 「새 문제」를 누르면 같은 구조에서
     숫자·상황만 바꾼 변형이 나옵니다. 정답이 정수·간단한 분수·근호로 떨어지는 변형만 골랐고,
     원래 문제가 노린 학습 포인트(세로 간격 일정, 왼쪽 가지, 두 교점의 곱 1, 역함수 대칭, 대칭축, 등변사다리꼴의 √2 약분,
     원과 대칭인 두 점, 가로줄로 세기)가 그대로 쓰이는 것만 담았습니다.
   - 문제 그림은 변형의 조건대로 그립니다(탐구 슬라이더 상태가 아님). 풀이 단계(st)가 올라야 답과 답으로 가는 보조선이 나옵니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = typeof window !== 'undefined' ? window : globalThis;
  const tx = (s) => '$' + s + '$';
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const frac = (n, d) => { // 기약분수 TeX (정수면 정수)
    const g = gcd(n, d) || 1;
    n /= g; d /= g;
    if (d < 0) { n = -n; d = -d; }
    return d === 1 ? String(n) : (n < 0 ? '-' : '') + `\\dfrac{${Math.abs(n)}}{${d}}`;
  };
  const fstr = (n, d) => { // 그림 글자용 분수 "17/8"
    const g = gcd(n, d) || 1;
    n /= g; d /= g;
    if (d < 0) { n = -n; d = -d; }
    return d === 1 ? String(n) : `${n}/${d}`;
  };
  const rint = (n) => Math.floor(Math.random() * n);
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const sub = (n) => String(n).split('').map((c) => (SUB[+c] != null && /\d/.test(c) ? SUB[+c] : c)).join('');
  const rich = (t) => String(t == null ? '' : t).replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>').replace(/➔/g, '→');
  // 조사: 숫자·수식 끝소리에 맞춰 와/과, 이/가, 은/는, 로/으로
  const hasBat = (str) => { const t = String(str).replace(/[)}$\s]+$/g, ''); const c = t.slice(-1); return /\d/.test(c) ? '013678'.includes(c) : false; };
  const jw = (x) => (hasBat(x) ? '과' : '와'), ji = (x) => (hasBat(x) ? '이' : '가'), jn = (x) => (hasBat(x) ? '은' : '는');
  const jr = (x) => { const t = String(x).replace(/[)}$\s]+$/g, ''), c = t.slice(-1); return hasBat(x) && !(/\d/.test(c) && '178'.includes(c)) ? '으로' : '로'; };
  const sgn = (n) => (n > 0 ? `+${n}` : n < 0 ? `-${-n}` : '');
  const num = (n) => String(Math.round(n * 1000) / 1000);
  const sqrtCoef = (c, tail = '') => (c === 1 ? '' : String(c)) + '\\sqrt{2}' + tail;
  const triTex = (n) => (n * n % 4 === 0 ? `${n * n / 4 === 1 ? '' : n * n / 4}\\sqrt{3}` : `\\dfrac{${n * n === 1 ? '' : n * n}\\sqrt{3}}{4}`);
  const hTex = (d) => (d % 2 === 0 ? sqrtCoef(d / 2) : `\\dfrac{${d === 1 ? '' : d}\\sqrt{2}}{2}`);
  const rootTex = (c) => { // 2^(c/2)
    if (c % 2 === 0) return String(2 ** (c / 2));
    const k = 2 ** ((c - 1) / 2);
    return (k === 1 ? '' : String(k)) + '\\sqrt{2}';
  };

  /* ---------------- 수치 도우미 ---------------- */
  function bisect(f, lo, hi) { // f(lo), f(hi) 부호가 다를 때
    let flo = f(lo);
    for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2, fm = f(mid); if (flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; } }
    return (lo + hi) / 2;
  }
  const expX = (a, m, n, k) => bisect((x) => Math.pow(a, x - m) + n + x - k, -60, 60);   // a^(x-m)+n = -x+k
  const logX = (a, p, q, k) => bisect((x) => Math.log(x - p) / Math.log(a) + q + x - k, p + 1e-12, p + 400); // log_a(x-p)+q = -x+k
  const crossings = (f, lo, hi, N = 6000) => { // f(x)=0 의 근(부호 변화) 모음
    const out = [];
    let px = lo, py = f(lo);
    for (let i = 1; i <= N; i++) {
      const x = lo + ((hi - lo) * i) / N, y = f(x);
      if (Number.isFinite(py) && Number.isFinite(y) && py * y < 0) out.push(bisect(f, px, x));
      px = x; py = y;
    }
    return out;
  };

  /* ---------------- 변형 묶음(varier) ---------------- */
  let serial = 0;
  function varier(pool, build) {
    let cur = null, idx = -1;
    const mk = (i) => { idx = i; cur = build(pool[i], i); cur.sid = ++serial; cur.idx = i; return cur; };
    mk(0);
    return {
      cur: () => cur,
      next: () => { let i; do i = rint(pool.length); while (pool.length > 1 && i === idx); return mk(i); },
      pool, size: pool.length
    };
  }

  /* ==========================================================================
     종류별 변형: build(e, orig) → { text, ans, steps[3], std[], quick[], win, ... }
     orig(첫 문제만): 호출하는 쪽이 넘긴 옛 문제 글 { text, std[], quick[] }
     ========================================================================== */
  const KINDS = {};

  /* ----- vert: 로그함수의 세로 방향의 간격과 넓이 ----- */
  KINDS.vert = (e) => {
    const n = Math.log2(e.k), w = e.x2 - e.x1, S = w * n;
    const f = (x) => Math.log2(x), g = (x) => Math.log2(e.k * x);
    const common = [
      `$\\log_2(${e.k}x)=\\log_2x+\\log_2${e.k}=\\log_2x+${n}$ 이므로 $y=\\log_2(${e.k}x)$ 는 $y=\\log_2x$ 를 $y$축 방향으로 $${n}$ 만큼 평행이동한 그래프입니다.`
    ];
    let text, ans, steps, quick;
    if (e.ask === 'tri') {
      text = `두 곡선 $y = \\log_2 x$와 $y = \\log_2(${e.k}x)$가 직선 $x = t$와 만나는 두 점을 $A, B$라 할 때, 한 변이 $\\overline{AB}$인 정삼각형 $ABC$의 넓이를 구하시오.`;
      ans = tx(triTex(n));
      steps = [common[0], `직선 $x=t$ 를 어디에 그어도 $\\overline{AB}=\\log_2${e.k}=${n}$ 로 일정합니다. $t$ 를 구할 필요가 없습니다.`, `한 변이 $${n}$ 인 정삼각형의 넓이는 $\\dfrac{\\sqrt{3}}{4}\\times${n}^2=${triTex(n)}$.`];
      quick = [`$t$ 를 구하지 않아도 $\\overline{AB}=\\log_2${e.k}=${n}$ 입니다. 정삼각형의 넓이 $\\dfrac{\\sqrt{3}}{4}\\times${n}^2=${triTex(n)}$.`];
    } else {
      text = e.ask === 'S'
        ? `두 함수 $y = \\log_2 x, y = \\log_2(${e.k}x)$와 두 직선 $x = ${e.x1}, x = ${e.x2}$${jr(e.x2)} 둘러싸인 영역의 넓이 $S$를 구하시오.`
        : `두 함수 $f(x) = \\log_2 x$와 $g(x) = \\log_2(${e.k}x)$의 그래프가 두 직선 $x = ${e.x1}, x = ${e.x2}$${jw(e.x2)} 만나는 네 점으로 둘러싸인 곡선 영역의 넓이 $S$와 수직 선분 $\\overline{AB}$의 길이를 구하시오.`;
      ans = e.ask === 'S' ? tx(`S=${S}`) : tx(`S=${S},\\ \\overline{AB}=${n}`);
      steps = [common[0], `어느 $x$ 에서 세로로 잘라도 두 곡선 사이의 길이는 $\\log_2${e.k}=${n}$ 로 같습니다. 즉 $\\overline{AB}=${n}$.`, `곡선 부분을 평행이동해 겹치면 둘러싸인 영역은 가로 $${e.x2}-${e.x1}=${w}$, 세로 $${n}$ 인 직사각형과 넓이가 같습니다. $S=${w}\\times${n}=${S}$.`];
      quick = [`세로 간격은 어디서나 $\\log_2${e.k}=${n}$ 이므로 넓이 $=(\\text{가로 간격})\\times(\\text{세로 간격})=${w}\\times${n}=${S}$.`];
    }
    const std = steps.map((t, i) => `${i + 1}) ${t}`);
    const win = { x: [-1.6, Math.max(9.8, e.x2 + 2.6)], y: [-3.4, Math.max(6.8, g(Math.max(e.x2, 2)) + 1.6)] };
    return { e, text, ans, steps, std, quick, win, f, g, n, w, S };
  };

  /* ----- wing: 진수 함정 log₂(x²) = 2log₂|x| ----- */
  KINDS.wing = (e) => {
    const F = (x) => 2 * Math.log2(Math.abs(x));
    if (e.ask === 'prod') {
      const c = e.c, r = rootTex(c), P = 2 ** c, rv = 2 ** (c / 2);
      const text = `방정식 $\\log_2 x^2 = ${c}$의 모든 실근의 곱과, 함수 $y = \\log_2 x^2$의 그래프와 직선 $y = ${c}$의 교점 개수($2$개)를 $y = 2\\log_2 x$ ($1$개)와 비교하시오.`;
      const steps = [
        `$y=2\\log_2x$ 는 진수 조건이 $x\\gt 0$ 이라 오른쪽 가지만 있습니다. $2\\log_2x=${c}$ 의 근은 $x=${r}$ 하나입니다.`,
        `$\\log_2x^2=2\\log_2|x|$ 는 $y$축에 대하여 대칭인 왼쪽 가지도 가집니다. 그래서 $x=-${r}$ 도 근이고 교점은 $2$개입니다.`,
        `$x^2=2^{${c}}=${P}$ 이므로 두 근은 $\\pm${r}$, 곱은 $(-${r})(${r})=-${P}$.`
      ];
      return { e, text, ans: tx(`-${P}`) + ` (교점은 $2$개, $y=2\\log_2x$ 는 $1$개)`, steps, std: steps.map((t, i) => `${i + 1}) ${t}`),
        quick: [`$\\log_2x^2=${c}$ 는 $x^2=2^{${c}}=${P}$ 이므로 $x=\\pm${r}$ 두 개이고 곱은 $-${P}$ 입니다. $2\\log_2x=${c}$ 로 바꾸면 음수 근을 놓칩니다.`],
        win: { x: [-Math.max(9, rv + 2.4), Math.max(9, rv + 2.4)], y: [-5, Math.max(6.5, c + 2.2)] }, F, c, root: rv, rootTex: r };
    }
    // 직선 y = m x + k 와의 교점의 개수
    const L = (x) => e.m * x + e.k;
    const left = crossings((x) => F(x) - L(x), -400, -1e-6), right = crossings((x) => F(x) - L(x), 1e-6, 400);
    const R = right.length, total = left.length + R;
    const lineTex = `${e.m === 1 ? '' : num(e.m)}x${e.k > 0 ? '+' + e.k : e.k < 0 ? '-' + (-e.k) : ''}`;
    const text = `함수 $y = \\log_2 x^2$의 그래프와 직선 $y = ${lineTex}$${ji(lineTex)} 만나는 서로 다른 교점의 개수를 구하시오.`;
    const steps = [
      `$x\\lt 0$ 인 왼쪽 가지 $y=2\\log_2(-x)$ 는 감소하고 직선은 증가(기울기 $${num(e.m)}\\gt 0$)하므로 왼쪽에서는 정확히 $1$개 만납니다.`,
      R === 0 ? `$x\\gt 0$ 인 오른쪽 가지 $y=2\\log_2x$ 는 직선 아래에만 있어 만나지 않습니다($0$개).` : `$x\\gt 0$ 인 오른쪽 가지 $y=2\\log_2x$ 와 직선은 $${R}$개의 점에서 만납니다.`,
      `따라서 교점은 $1+${R}=${total}$개입니다.`
    ];
    const xr = Math.max(9, ...(right.length ? [right[right.length - 1] + 2.5] : [9]));
    const win = { x: [-9, xr], y: [-6, Math.max(7, L(xr) + 1.5)] };
    return { e, text, ans: tx(String(total)) + '개', steps, std: steps.map((t, i) => `${i + 1}) ${t}`),
      quick: [`왼쪽 가지는 증가하는 직선과 반드시 한 번 만나고, 오른쪽 가지에서 ${R === 0 ? '만나지 않아' : `$${R}$개`} 더해 모두 $${total}$개입니다. $x\\gt 0$ 인 부분만 그리면 왼쪽 교점을 놓칩니다.`],
      win, F, L, left, right, total, R };
  };

  /* ----- absM: |log₂(x−p)| = t 의 두 교점: 곱 1, 중점, 합 ----- */
  KINDS.absM = (e) => {
    const { p, t } = e;
    const q = 4 ** t + 1, den = 2 ** t;       // 2^t + 2^-t = q/den
    const d1 = 1 / den, d2 = den;
    const x1 = p + d1, x2 = p + d2;
    const M = fstr(2 * p * den + q, 2 * den);  // (x1+x2)/2 = p + q/(2 den)
    const Mt = frac(2 * p * den + q, 2 * den), St = frac(2 * p * den + q, den);
    const xm = p === 0 ? 'x' : `(x-${p})`, a1 = p === 0 ? 'x_1' : `(x_1-${p})`, a2 = p === 0 ? 'x_2' : `(x_2-${p})`;
    const fn = p === 0 ? '|\\log_2 x|' : `|\\log_2(x-${p})|`;
    const text = e.ask === 'prodM'
      ? `함수 $y = ${fn}$와 직선 $y = ${t}$${ji(t)} 만나는 두 점의 $x$좌표를 $x_1, x_2$ ($x_1 \\lt x_2$)라 할 때, $${a1}${a2}$의 값과 두 점의 중점 $M = \\dfrac{x_1+x_2}{2}$의 $x$좌표를 구하시오.`
      : `함수 $y = ${fn}$와 직선 $y = ${t}$${ji(t)} 만나는 두 점의 $x$좌표 $x_1, x_2$에 대하여 $${a1}${a2}$의 값과 $x_1 + x_2$의 값을 구하시오.`;
    const ans = e.ask === 'prodM' ? tx(`${a1}${a2}=1,\\ M=${Mt}`) : tx(`${a1}${a2}=1,\\ x_1+x_2=${St}`);
    const dd1 = frac(1, den), dd2 = String(den);
    const steps = [
      `$y=${fn}$ 은 점근선 $x=${p}$ 의 오른쪽에서 점 $(${p + 1},0)$ 을 경계로 꺾이고, 직선 $y=${t}$ 와 $x_1\\lt ${p + 1}\\lt x_2$ 인 두 점에서 만납니다.`,
      `$-\\log_2(x_1-${p})=\\log_2(x_2-${p})=${t}$ 에서 $x_1-${p}=${dd1}$, $x_2-${p}=${dd2}$ 이므로 $${a1}${a2}=${dd1}\\times${dd2}=1$.`,
      e.ask === 'prodM'
        ? `$x_1=${frac(p * den + 1, den)}$, $x_2=${p + den}$ 이므로 $M=\\dfrac{x_1+x_2}{2}=${Mt}$ (꺾인 점의 $x$좌표 $${p + 1}$ 보다 오른쪽).`
        : `$x_1=${frac(p * den + 1, den)}$, $x_2=${p + den}$ 이므로 $x_1+x_2=${St}$.`
    ];
    const hi = p + d2;
    return { e, text, ans, steps, std: steps.map((s, i) => `${i + 1}) ${s}`),
      quick: [`두 교점에서 점근선까지의 거리의 곱은 $t$ 에 관계없이 항상 $1$ 입니다. 거리는 $2^{-${t}}, 2^{${t}}$ 이고, 합은 $2^{${t}}+2^{-${t}}\\gt 2$ 이므로 중점은 꺾인 점의 오른쪽에 있습니다.`],
      win: { x: [Math.min(p - 2.6, -1.4), hi + 2.0], y: [-1.6, t + 2.4] }, p, t, x1, x2, M, d1, d2 };
  };

  /* ----- absTF: |log₂x| = t 의 두 교점에 대한 ㄱㄴㄷ ----- */
  KINDS.absTF = (e) => {
    const t = e.t, den = 2 ** t, q = 4 ** t + 1;
    const Mt = frac(q, 2 * den), Mstr = fstr(q, 2 * den);
    const claim = e.c.claim;                    // [ㄷ] 가 주장하는 중점 값 (TeX)
    const okC = e.c.ok;
    const YN = (b) => (b ? '참' : '거짓');
    const text = `함수 $y = |\\log_2 x|$와 직선 $y = t$ ($t > 0$)가 만나는 두 점의 $x$좌표를 각각 $x_1, x_2$ ($x_1 \\lt x_2$)라 할 때, 다음 [ㄱ], [ㄴ], [ㄷ]의 참, 거짓을 판별하시오. [ㄱ] $${e.a.tex}$ [ㄴ] $${e.b.tex}$ [ㄷ] $t=${t}$일 때 두 점의 중점의 $x$좌표는 $${claim}$이다.`;
    const ans = `ㄱ ${YN(e.a.ok)}, ㄴ ${YN(e.b.ok)}, ㄷ ${YN(okC)}`;
    const steps = [
      `$y=|\\log_2x|$ 는 점 $(1,0)$ 에서 꺾이고, 직선 $y=t$ 와 $0\\lt x_1\\lt 1\\lt x_2$ 인 두 점에서 만납니다.`,
      `$-\\log_2x_1=\\log_2x_2=t$ 에서 $x_1=2^{-t}$, $x_2=2^t$ 이므로 $x_1x_2=1$ 이고, $x_1+x_2=2^t+2^{-t}\\gt 2\\sqrt{x_1x_2}=2$ ($x_1\\ne x_2$). [ㄱ] ${YN(e.a.ok)}, [ㄴ] ${YN(e.b.ok)}.`,
      `$t=${t}$ 이면 $x_1=${frac(1, den)}$, $x_2=${den}$ 이므로 중점은 $\\dfrac{${frac(1, den)}+${den}}{2}=${Mt}$. [ㄷ]의 값 $${claim}$ 와 ${okC ? '같으므로' : '다르므로'} ${YN(okC)}.`
    ];
    return { e, text, ans, steps, std: steps.map((s, i) => `${i + 1}) ${s}`),
      quick: [`$x_1x_2=1$ (서로 역수), $x_1+x_2\\gt 2$ (산술평균·기하평균의 관계), 중점은 $1$ 보다 크다는 세 가지로 보기를 하나씩 확인합니다.`],
      win: { x: [-1.4, den + 2.2], y: [-1.6, t + 2.4] }, p: 0, t, M: Mstr };
  };

  /* ----- inv: 서로 역함수인 y=aˣ, y=log_a x 와 기울기 −1 인 직선 ----- */
  KINDS.inv = (e) => {
    const a = e.a;
    if (e.ask === 'kS') {
      const al = e.al, be = a ** al, d = be - al, k = al + be, dd = d === 1 ? '' : String(d);
      const text = `두 곡선 $y = ${a}^x, y = \\log_${a} x$가 직선 $y = -x + k$와 만나는 두 점 $A, B$가 모두 제1사분면에 있다. $\\overline{AB} = ${dd}\\sqrt{2}$일 때, 상수 $k$의 값과 $\\triangle OAB$의 넓이를 구하시오.`;
      const area = frac(k * d, 2);
      const steps = [
        `$y=${a}^x$ 와 $y=\\log_${a}x$ 는 직선 $y=x$ 에 대하여 대칭이므로 $A(\\alpha,\\beta)$ 이면 $B(\\beta,\\alpha)$, 중점 $M\\left(\\dfrac{k}{2},\\dfrac{k}{2}\\right)$ 이고 $k=\\alpha+\\beta$ 입니다.`,
        `$\\overline{AB}=\\sqrt{2}(\\beta-\\alpha)=${dd}\\sqrt{2}$ 에서 $\\beta-\\alpha=${d}$. $\\beta=${a}^{\\alpha}$ 이므로 $${a}^{\\alpha}=\\alpha+${d}$ 를 만족시키는 $\\alpha=${al}$, $\\beta=${be}$ 입니다.`,
        `$k=${al}+${be}=${k}$. $\\overline{OM}=\\dfrac{${k}}{\\sqrt{2}}\\perp\\overline{AB}$ 이므로 $\\triangle OAB=\\dfrac{1}{2}\\times\\dfrac{${k}}{\\sqrt{2}}\\times${dd}\\sqrt{2}=${area}$.`
      ];
      const hi = Math.max(be, k / 2) + 1.7;
      return { e, text, ans: tx(`k=${k},\\ \\triangle OAB=${area}`), steps, std: steps.map((s, i) => `${i + 1}) ${s}`),
        quick: [`$\\overline{AB}=d\\sqrt{2}$ 이면 $x$좌표의 차가 $d=${d}$ 입니다. $${a}^{\\alpha}-\\alpha=${d}$ 에서 $\\alpha=${al}$ 이므로 $A(${al},${be}),\\ B(${be},${al})$, $k=${k}$. 넓이는 $\\dfrac{k}{2}\\times d=${area}$.`],
        win: { x: [-2.6, hi], y: [-2.6, hi] }, a, al, be, d, k, area };
    }
    // ask 'M'
    const k = e.k, h = frac(k, 2);
    const text = `직선 $y = -x + ${k}$${ji(k)} $y = ${a}^x, y = \\log_${a} x$와 만나는 두 점 $A, B$의 중점 $M$의 좌표와 $x_A + x_B$, $y_A + y_B$의 값을 구하시오.`;
    const steps = [
      `$y=${a}^x$ 와 $y=\\log_${a}x$ 는 $y=x$ 에 대칭이고, 직선 $y=-x+${k}$ 는 $y=x$ 에 수직이므로 두 교점 $A, B$ 도 $y=x$ 에 대하여 대칭입니다.`,
      `따라서 중점 $M$ 은 $y=x$ 위에 있고, $y=x$ 와 $y=-x+${k}$ 의 교점 $M\\left(${h},${h}\\right)$ 입니다.`,
      `$x_A+x_B=2\\times${h}=${k}$, $y_A+y_B=${k}$. 방정식 $${a}^x=-x+${k}$ 를 풀지 않아도 됩니다.`
    ];
    const hi = Math.max(k * 0.78, 6.5) + 1.5;
    return { e, text, ans: tx(`M\\left(${h},${h}\\right),\\ ${k},\\ ${k}`), steps, std: steps.map((s, i) => `${i + 1}) ${s}`),
      quick: [`두 곡선과 직선이 모두 $y=x$ 에 대칭이므로 $x_A+x_B=y_A+y_B=k=${k}$, 중점은 $\\left(\\dfrac{k}{2},\\dfrac{k}{2}\\right)$ 입니다.`],
      win: { x: [-2.6, hi], y: [-2.6, hi] }, a, k };
  };

  /* ----- xlat: 평행이동한 지수함수·로그함수의 대칭축 ----- */
  const expTex = (m, n) => `2^{${m === 0 ? 'x' : m > 0 ? `x-${m}` : `x+${-m}`}}${sgn(n)}`;
  const logTex = (p, q) => `\\log_2${p === 0 ? ' x' : `(x-${p})`}${sgn(q)}`;
  KINDS.xlat = (e) => {
    const { m, n, q } = e, p = m + n - q, C = q - m;
    const P1 = [m, n + 1], P2 = [p + 1, q];
    const M0 = [(P1[0] + P2[0]) / 2, (P1[1] + P2[1]) / 2];
    const Cs = C === 0 ? '' : sgn(C);
    let text, ans, steps, quick;
    const s1 = `지수함수에서 지수가 $0$ 이 되는 점 $P_1(${P1[0]},${P1[1]})$ 와 로그함수에서 진수가 $1$ 이 되는 점 $P_2(${P2[0]},${P2[1]})$ 는 서로 대칭인 점입니다.`;
    const s2 = `두 점의 중점 $M_0\\left(${frac(P1[0] + P2[0], 2)},${frac(P1[1] + P2[1], 2)}\\right)$ 를 지나고 기울기가 $1$ 인 직선이 대칭축입니다. $${frac(P1[1] + P2[1], 2)}=${frac(P1[0] + P2[0], 2)}+C$ 에서 $C=${C}$.`;
    if (e.ask === 'CM') {
      const k = e.k, mx = frac(k - C, 2), my = frac(k + C, 2);
      text = e.given
        ? `두 곡선 $y = ${expTex(m, n)}$ (위의 점 $(${P1[0]},${P1[1]})$)${jw(P1[1])} $y = ${logTex(p, q)}$ (위의 점 $(${P2[0]},${P2[1]})$)의 대칭축 $y = x + C$를 구하고, 직선 $y = -x + ${k}$${ji(k)} 두 곡선과 만나는 두 점의 중점 $M$의 좌표를 구하시오.`
        : `두 곡선 $y = ${expTex(m, n)}$${jw(expTex(m, n))} $y = ${logTex(p, q)}$${jn(logTex(p, q))} 직선 $y = x + C$에 대하여 대칭이다. 상수 $C$의 값과, 두 곡선이 직선 $y = -x + ${k}$${jw(k)} 만나는 두 점 $A, B$의 중점 $M$의 좌표를 구하시오.`;
      ans = tx(`C=${C},\\ M\\left(${mx},${my}\\right)`);
      steps = [s1, s2, `대칭축 $y=x${Cs}$ 와 $y=-x+${k}$ 를 연립하면 $M\\left(${mx},${my}\\right)$. 두 교점이 대칭축에 대해 대칭이므로 중점은 대칭축 위에 있습니다.`];
      quick = [`두 점 $(${P1[0]},${P1[1]}),\\ (${P2[0]},${P2[1]})$ 의 중점 $\\left(${frac(P1[0] + P2[0], 2)},${frac(P1[1] + P2[1], 2)}\\right)$ 을 $y=x+C$ 에 대입하면 $C=${C}$. 연립하면 $M\\left(${mx},${my}\\right)$ 입니다.`];
    } else {
      text = `두 곡선 $y = ${expTex(m, n)}$ (위의 점 $(${P1[0]},${P1[1]})$)과 $y = ${logTex(p, q)}$ (위의 점 $(${P2[0]},${P2[1]})$)의 대칭축 $y = x + C$를 두 점의 중점을 이용하여 구하시오.`;
      ans = tx(`C=${C}`);
      steps = [s1, s2, `선분 $P_1P_2$ 의 기울기는 $-1$ 이므로 대칭축 $y=x${Cs}$ 에 수직으로 만납니다. 두 곡선이 이 직선에 대해 대칭이라는 것이 확인됩니다.`];
      quick = [`중점 $\\left(${frac(P1[0] + P2[0], 2)},${frac(P1[1] + P2[1], 2)}\\right)$ 에서 $y-x=${C}$ 이므로 대칭축은 $y=x${Cs}$ 입니다.`];
    }
    const pts = [P1, P2, M0, [0, 0]];
    if (e.ask === 'CM') {
      const xa = expX(2, m, n, e.k), xb = logX(2, p, q, e.k);
      pts.push([xa, e.k - xa], [xb, e.k - xb], [(e.k - C) / 2, (e.k + C) / 2]);
    }
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    pts.forEach((z) => { x0 = Math.min(x0, z[0]); x1 = Math.max(x1, z[0]); y0 = Math.min(y0, z[1]); y1 = Math.max(y1, z[1]); });
    return { e, text, ans, steps, std: steps.map((s, i) => `${i + 1}) ${s}`), quick, p, C, P1, P2, M0,
      win: { x: [x0 - 2.4, x1 + 2.4], y: [y0 - 2.4, y1 + 2.4] } };
  };

  /* ----- trap: 기울기가 −1 인 두 직선과 등변사다리꼴 ----- */
  const NICE = { 1: [0, 1], 3: [1, 2], 6: [2, 4], 11: [3, 8] };
  KINDS.trap = (e) => {
    const { k1, k2 } = e, dk = Math.abs(k2 - k1);
    const nice = NICE[k1] && NICE[k2];
    const K = (k) => num(k);
    let text, ans, steps, quick, S = null, d1 = null, d2 = null;
    const lineS = `${num(k1)}`;
    if (e.ask === 'h0') {
      text = `두 곡선 $y = 2^x, y = \\log_2 x$가 직선 $y = -x + ${K(k1)}$와 만나는 두 점을 $A, B$라 하고, 직선 $y = -x + ${K(k2)}$와 만나는 두 점을 $C, D$라 할 때, 등변사다리꼴 $ABDC$의 높이 $h$와 넓이 공식을 확인하시오.`;
      ans = tx(`h=${hTex(dk)},\\ S=\\Delta x_1+\\Delta x_2`);
      steps = [
        `직선 $y=-x+${K(k1)}$ 과 $y=-x+${K(k2)}$ 가 곡선과 만나는 네 점 $A, B, C, D$ 를 잡습니다. 두 곡선은 $y=x$ 에 대칭이어서 $A, B$ 도 $C, D$ 도 $y=x$ 에 대칭입니다.`,
        `두 평행선 $x+y-${K(k1)}=0$, $x+y-${K(k2)}=0$ 사이의 거리(높이)는 $h=\\dfrac{|${K(k2)}-${K(k1)}|}{\\sqrt{2}}=${hTex(dk)}$.`,
        `$\\overline{AB}=\\Delta x_1\\sqrt{2}$, $\\overline{CD}=\\Delta x_2\\sqrt{2}$ 이므로 $S=\\dfrac{1}{2}(\\Delta x_1\\sqrt{2}+\\Delta x_2\\sqrt{2})\\times${hTex(dk)}=\\Delta x_1+\\Delta x_2$ ($\\sqrt{2}$ 가 약분됩니다).`
      ];
      quick = [`윗변·아랫변에 곱해진 $\\sqrt{2}$ 와 높이의 분모 $\\sqrt{2}$ 가 약분되어 넓이 $=\\dfrac{1}{2}|k_2-k_1|(\\Delta x_1+\\Delta x_2)$.`];
    } else if (e.ask === 'S') {
      const [a1, b1] = NICE[k1], [a2, b2] = NICE[k2];
      d1 = b1 - a1; d2 = b2 - a2; S = fstr(dk * (d1 + d2), 2);
      const St = frac(dk * (d1 + d2), 2);
      text = `두 곡선 $y = 2^x, y = \\log_2 x$가 직선 $y = -x + ${k1}$${jw(k1)} 만나는 두 점을 $A, B$라 하고, 직선 $y = -x + ${k2}$${jw(k2)} 만나는 두 점을 $C, D$라 할 때, 등변사다리꼴 $ABDC$의 넓이를 구하시오.`;
      ans = tx(`S=${St}`);
      steps = [
        `$y=-x+${k1}$ 과 곡선의 교점은 $A(${a1},${b1}),\\ B(${b1},${a1})$, $y=-x+${k2}$ 와의 교점은 $C(${a2},${b2}),\\ D(${b2},${a2})$ 입니다 (두 곡선이 $y=x$ 에 대칭).`,
        `$\\overline{AB}=\\sqrt{2}\\times${d1}$, $\\overline{CD}=\\sqrt{2}\\times${d2}$ 이고, 두 평행선 사이의 거리(높이)는 $h=\\dfrac{${dk}}{\\sqrt{2}}$ 입니다.`,
        `$S=\\dfrac{1}{2}(\\sqrt{2}\\cdot${d1}+\\sqrt{2}\\cdot${d2})\\cdot\\dfrac{${dk}}{\\sqrt{2}}=\\dfrac{1}{2}\\cdot${dk}\\cdot(${d1}+${d2})=${St}$.`
      ];
      quick = [`$\\sqrt{2}$ 가 약분되어 $S=\\dfrac{1}{2}|k_2-k_1|(\\Delta x_1+\\Delta x_2)=\\dfrac{1}{2}\\times${dk}\\times(${d1}+${d2})=${St}$.`];
    } else {
      text = `두 직선 $y = -x + ${K(k1)}$${jw(K(k1))} $y = -x + ${K(k2)}$ 사이의 거리 $h$를 구하고, 대칭축 $y=x$가 사다리꼴의 두 밑변을 수직이등분함을 그림에서 확인하시오.`;
      ans = tx(`h=${hTex(dk)}`) + ` (그리고 $y=x$ 는 두 밑변의 수직이등분선)`;
      steps = [
        `직선 $y=-x+${K(k1)}$, $y=-x+${K(k2)}$ 와 두 곡선이 만나는 네 점 $A, B, C, D$ 로 사다리꼴 $ABDC$ 를 잡습니다.`,
        `두 곡선이 $y=x$ 에 대칭이므로 $y=x$ 는 두 밑변 $\\overline{AB}, \\overline{CD}$ 를 수직이등분하고, 두 평행선에 모두 수직입니다.`,
        `두 밑변의 중점 $\\left(\\dfrac{${K(k1)}}{2},\\dfrac{${K(k1)}}{2}\\right)$, $\\left(\\dfrac{${K(k2)}}{2},\\dfrac{${K(k2)}}{2}\\right)$ 사이의 거리가 높이이므로 $h=\\dfrac{|${K(k2)}-${K(k1)}|}{\\sqrt{2}}=${hTex(dk)}$.`
      ];
      quick = [`기울기가 $-1$ 인 두 직선 $y=-x+k_1$, $y=-x+k_2$ 사이의 거리는 $|k_2-k_1|$ 이 아니라 $\\dfrac{|k_2-k_1|}{\\sqrt{2}}=${hTex(dk)}$ 입니다.`];
    }
    const hi = Math.max(k2 * 0.62, 5) + 2.2;
    return { e, text, ans, steps, std: steps.map((s, i) => `${i + 1}) ${s}`), quick, nice: !!nice && e.ask === 'S', dk, S, d1, d2,
      win: { x: [-2.4, hi], y: [-2.4, hi] } };
  };

  /* ----- circ: 원 x²+y²=r² 과 y=aˣ, y=log_a x 의 대칭인 두 교점 ----- */
  KINDS.circ = (e) => {
    const { al, be, a } = e, r2 = al * al + be * be, d = be - al, dd = d === 1 ? '' : String(d), r = Math.sqrt(r2);
    const cl = e.clause ? ' (단, $P$의 $x$좌표가 $Q$의 $x$좌표보다 작다)' : '';
    const aa = e.clause ? ' (단, $a\\gt 1$)' : '';
    const text = e.ask === 'Pa'
      ? `원 $x^2 + y^2 = ${r2}$${ji(r2)} 두 곡선 $y = a^x, y = \\log_a x$ ($a \\gt 1$)와 제1사분면에서 만나는 점 중 $y = x$에 대칭인 두 점을 $P, Q$라 하자.${cl} $\\overline{PQ} = ${dd}\\sqrt{2}$일 때, 점 $P$의 좌표와 상수 $a$의 값을 구하시오.`
      : `원 $x^2 + y^2 = ${r2}$${jw(r2)} $y = a^x, y = \\log_a x$의 대칭인 교점 $P, Q$ 사이의 거리가 $\\overline{PQ} = ${dd}\\sqrt{2}$일 때, 상수 $a$의 값을 구하시오.${aa}`;
    const ans = e.ask === 'Pa' ? tx(`P(${al},${be}),\\ a=${a}`) : tx(`a=${a}`);
    const steps = [
      `원과 두 곡선 모두 $y=x$ 에 대하여 대칭이므로 두 교점은 $P(\\alpha,\\beta),\\ Q(\\beta,\\alpha)$ ($\\alpha\\lt\\beta$) 로 놓을 수 있고, 현 $PQ$ 의 기울기는 $-1$ 입니다.`,
      `$\\overline{PQ}=\\sqrt{2}(\\beta-\\alpha)=${dd}\\sqrt{2}$ 에서 $\\beta-\\alpha=${d}$. 또 $P$ 가 원 위의 점이므로 $\\alpha^2+\\beta^2=${r2}$.`,
      `$\\alpha^2+(\\alpha+${d})^2=${r2}$ 에서 $\\alpha=${al}$, $\\beta=${be}$ 이므로 $P(${al},${be})$. $P$ 가 $y=a^x$ 위의 점이므로 $a^{${al}}=${be}$, 즉 $a=${a}$.`
    ];
    return { e, text, ans, steps, std: steps.map((s, i) => `${i + 1}) ${s}`),
      quick: [`제곱의 합이 $${r2}$ 이고 차가 $${d}$ 인 두 양의 정수는 $${al}$ 과 $${be}$ ($${al}^2+${be}^2=${r2}$, $${be}-${al}=${d}$) 입니다. $P(${al},${be})$ 를 $y=a^x$ 에 대입하면 $a=${a}$.`],
      win: { x: [-r - 1.5, r + 1.5], y: [-r - 1.5, r + 1.5] }, r, r2, d };
  };

  /* ----- latt: 로그함수 아래의 격자점 (가로줄로 세기) ----- */
  KINDS.latt = (e) => {
    const K = e.K, rows = [];
    for (let y = 1; 2 ** y <= K; y++) rows.push({ y, x0: 2 ** y, cnt: K - 2 ** y + 1 });
    const total = rows.reduce((s, r) => s + r.cnt, 0);
    const text = e.ask === 'A'
      ? `$1 \\le x \\le ${K}$이고 $1 \\le y \\le \\log_2 x$를 만족시키는 자연수 순서쌍 $(x, y)$의 총개수를 **가로줄($y = 1, 2, 3$)마다 세어** 구하시오.`
      : `$1 \\le x \\le ${K},\\; 1 \\le y \\le \\log_2 x$를 만족시키는 자연수 격자점의 개수를 가로줄 공식 $(${K} - 2^1 + 1) + (${K} - 2^2 + 1) + (${K} - 2^3 + 1)$로 구하시오.`;
    const list = rows.map((r) => r.cnt).join(' + ');
    const steps = [
      `$y\\le\\log_2x$ 는 $x\\ge2^y$ 와 같습니다. 범위 $1\\le x\\le ${K}$ 의 자연수 격자점을 표시합니다 ($y$ 는 $1$ 부터 $${rows.length}$ 까지).`,
      `세로줄 $x=2,3,\\dots,${K}$ 마다 세려면 줄마다 따로 세어 더해야 해서 항이 ${K - 1}개나 됩니다.`,
      `가로줄 $y=m$ 위의 점은 $2^m\\le x\\le ${K}$ 이므로 $${K}-2^m+1$개. ${rows.map((r) => `$y=${r.y}$: $${r.cnt}$개`).join(', ')} ⇒ $${list}=${total}$개.`
    ];
    return { e, text, ans: tx(`${total}`) + '개', steps, std: steps.map((s, i) => `${i + 1}) ${s}`),
      quick: [`가로줄 $y=m$ 마다 $x\\ge2^m$ 인 점의 개수 $${K}-2^m+1$ 을 더하면 $${list}=${total}$개입니다.`],
      win: { x: [-0.8, K + 2.2], y: [-0.8, rows.length + 1.8] }, rows, total, K };
  };

  /* ==========================================================================
     변형 풀(가장 앞 항목 = 옛 문제 그대로)
     ========================================================================== */
  const POOLS = {
    vertSAB: [{ k: 4, x1: 2, x2: 5, ask: 'SAB' }, { k: 2, x1: 1, x2: 4, ask: 'SAB' }, { k: 8, x1: 1, x2: 3, ask: 'SAB' }, { k: 4, x1: 3, x2: 7, ask: 'SAB' }, { k: 16, x1: 2, x2: 6, ask: 'SAB' }],
    vertS: [{ k: 4, x1: 2, x2: 5, ask: 'S' }, { k: 2, x1: 1, x2: 4, ask: 'S' }, { k: 8, x1: 1, x2: 3, ask: 'S' }, { k: 4, x1: 3, x2: 7, ask: 'S' }, { k: 16, x1: 2, x2: 6, ask: 'S' }],
    vertTri: [{ k: 8, ask: 'tri', x1: 2, x2: 2 }, { k: 2, ask: 'tri', x1: 2, x2: 2 }, { k: 4, ask: 'tri', x1: 2, x2: 2 }, { k: 16, ask: 'tri', x1: 2, x2: 2 }],
    wingProd: [{ ask: 'prod', c: 2 }, { ask: 'prod', c: 4 }, { ask: 'prod', c: 6 }, { ask: 'prod', c: 3 }, { ask: 'prod', c: 1 }],
    wingLine: [{ ask: 'line', m: 0.4, k: 2 }, { ask: 'line', m: 1, k: 0 }, { ask: 'line', m: 1, k: 3 }, { ask: 'line', m: 0.5, k: 1 }, { ask: 'line', m: 0.5, k: 4 }],
    absProdM: [{ p: 0, t: 2, ask: 'prodM' }, { p: 0, t: 1, ask: 'prodM' }, { p: 0, t: 3, ask: 'prodM' }, { p: 1, t: 2, ask: 'prodM' }, { p: 2, t: 1, ask: 'prodM' }],
    absProdSum: [{ p: 2, t: 1, ask: 'prodSum' }, { p: 1, t: 2, ask: 'prodSum' }, { p: 3, t: 1, ask: 'prodSum' }, { p: 2, t: 3, ask: 'prodSum' }, { p: 1, t: 1, ask: 'prodSum' }],
    absTF: [
      { t: 2, a: { tex: 'x_1 x_2 = 1', ok: true }, b: { tex: 'x_1 + x_2 \\gt 2', ok: true }, c: { claim: '\\dfrac{17}{8}', ok: true } },
      { t: 1, a: { tex: 'x_1 x_2 = 1', ok: true }, b: { tex: 'x_1 + x_2 \\lt 2', ok: false }, c: { claim: '\\dfrac{5}{4}', ok: true } },
      { t: 3, a: { tex: 'x_1 x_2 = 2', ok: false }, b: { tex: '\\dfrac{x_1 + x_2}{2} \\gt 1', ok: true }, c: { claim: '\\dfrac{65}{16}', ok: true } },
      { t: 2, a: { tex: 'x_1 \\lt 1 \\lt x_2', ok: true }, b: { tex: 'x_1 + x_2 \\gt 2', ok: true }, c: { claim: '\\dfrac{9}{4}', ok: false } },
      { t: 1, a: { tex: 'x_1 + x_2 = 2', ok: false }, b: { tex: 'x_2 - x_1 \\gt 0', ok: true }, c: { claim: '\\dfrac{5}{4}', ok: true } },
      { t: 3, a: { tex: 'x_1 x_2 = 1', ok: true }, b: { tex: 'x_1 + x_2 \\lt 2', ok: false }, c: { claim: '\\dfrac{33}{8}', ok: false } }
    ],
    invKS: [{ a: 2, al: 2, ask: 'kS' }, { a: 2, al: 1, ask: 'kS' }, { a: 2, al: 3, ask: 'kS' }, { a: 3, al: 1, ask: 'kS' }, { a: 4, al: 1, ask: 'kS' }],
    invM: [{ a: 2, k: 6, ask: 'M' }, { a: 2, k: 4, ask: 'M' }, { a: 2, k: 5, ask: 'M' }, { a: 2, k: 7, ask: 'M' }, { a: 2, k: 8, ask: 'M' }],
    xlatCM: [{ m: 1, n: 2, q: -1, k: 6, ask: 'CM' }, { m: 0, n: 3, q: 2, k: 6, ask: 'CM' }, { m: 2, n: 1, q: 0, k: 7, ask: 'CM' }, { m: 0, n: 2, q: 1, k: 5, ask: 'CM' }, { m: 1, n: 1, q: 0, k: 5, ask: 'CM' }, { m: 2, n: 2, q: 1, k: 6, ask: 'CM' }],
    xlatC: [{ m: 0, n: 3, q: 2, ask: 'C' }, { m: 1, n: 2, q: -1, ask: 'C' }, { m: 0, n: 2, q: 1, ask: 'C' }, { m: 2, n: 1, q: 0, ask: 'C' }, { m: 1, n: 1, q: 0, ask: 'C' }],
    trapA: [{ k1: 4, k2: 6, ask: 'h0' }, { k1: 3, k2: 6, ask: 'S' }, { k1: 6, k2: 11, ask: 'S' }, { k1: 3, k2: 11, ask: 'S' }],
    trapB: [{ k1: 3.5, k2: 6.5, ask: 'h' }, { k1: 3, k2: 5, ask: 'h' }, { k1: 2, k2: 6, ask: 'h' }, { k1: 4, k2: 9, ask: 'h' }, { k1: 4.5, k2: 5.5, ask: 'h' }],
    circPa: [{ al: 1, be: 3, a: 3, ask: 'Pa' }, { al: 1, be: 2, a: 2, ask: 'Pa' }, { al: 1, be: 5, a: 5, ask: 'Pa' }, { al: 2, be: 4, a: 2, ask: 'Pa' }, { al: 3, be: 8, a: 2, ask: 'Pa' }],
    circA: [{ al: 1, be: 4, a: 4, ask: 'a' }, { al: 1, be: 2, a: 2, ask: 'a' }, { al: 1, be: 3, a: 3, ask: 'a' }, { al: 1, be: 5, a: 5, ask: 'a' }, { al: 2, be: 4, a: 2, ask: 'a' }],
    lattA: [{ K: 9, ask: 'A' }, { K: 10, ask: 'A' }, { K: 11, ask: 'A' }, { K: 13, ask: 'A' }, { K: 14, ask: 'A' }, { K: 15, ask: 'A' }],
    lattB: [{ K: 12, ask: 'B' }, { K: 10, ask: 'B' }, { K: 11, ask: 'B' }, { K: 13, ask: 'B' }, { K: 14, ask: 'B' }, { K: 15, ask: 'B' }]
  };
  POOLS.circPa.forEach((e, i) => { e.clause = i > 0; });
  POOLS.circA.forEach((e, i) => { e.clause = i > 0; });
  POOLS.xlatCM.forEach((e) => { e.given = false; });
  POOLS.xlatC.forEach((e) => { e.given = true; });
  POOLS.xlatCMg = POOLS.xlatCM.map((e) => ({ ...e, given: true }));

  /* alg-log 의 두 번째 장면(진수 함정과 곱)은 |log₂x| 두 교점과 log₂x² 두 가지를 번갈아 냅니다 */
  const MIX = [
    { kind: 'absM', p: 0, t: 2, ask: 'prodM' }, { kind: 'wing', ask: 'prod', c: 2 }, { kind: 'absM', p: 0, t: 1, ask: 'prodM' },
    { kind: 'wing', ask: 'prod', c: 4 }, { kind: 'absM', p: 0, t: 3, ask: 'prodM' }, { kind: 'wing', ask: 'prod', c: 6 }
  ];
  POOLS.mixWingAbs = MIX;

  /* ==========================================================================
     그림 (문제·정리 탭): draw(b, v, st, view)
     b: APLab.Board · v: 변형 · st: 풀이 단계(문제 탭은 늘 0) · view: 카드 줄을 모으는 곳
     ========================================================================== */
  function tagAt(b, f, text, color, o = {}) { // 곡선 이름표: 곡선이 보이는 범위 안에서 다른 글자·점과 가장 멀리 떨어진 자리에 붙입니다. o.skip: 피할 점들, o.avoid: 피할 x들
    const vb = b.viewBox();
    const W = vb.x1 - vb.x0, H = vb.y1 - vb.y0, k = b.k || 30;
    const wu = (String(text).length * 7.6) / k; // 글자 폭(세계 단위)
    const dy = o.dy == null ? -12 : o.dy;
    const pts = (o.skip || []).slice();
    (o.avoid || []).forEach((a) => { const y = f(a); if (Number.isFinite(y)) pts.push([a, y]); });
    let best = null;
    for (let i = 0; i < 170; i++) {
      const x = o.left ? vb.x0 + W * 0.05 + i * W * 0.0055 : vb.x1 - W * 0.06 - i * W * 0.0055;
      const y = f(x);
      if (!(Number.isFinite(y) && y > vb.y0 + H * 0.1 && y < vb.y1 - H * 0.12)) continue;
      if (o.left ? x + wu > vb.x1 - 8 / k : x - wu < vb.x0 + 8 / k) continue; // 글자가 무대 밖으로 나가지 않게
      { const sp = b.toS(x, y), wpx = wu * k; // 무대 아래쪽 도구 막대·그림 설명 카드에 가려지는 자리는 피합니다
        const x0p = o.left ? sp.x : sp.x - wpx, x1p = o.left ? sp.x + wpx : sp.x;
        if (sp.y > b.H - 92 && (x1p > b.W - 125 || x0p < 125)) continue; }
      const cx = o.left ? x + wu / 2 : x - wu / 2, cy = y - dy / k;
      // 점과의 거리: 글자 상자(가로 wu, 세로 ~0.8 단위 아님 → 화면 24px)와 점 사이 여유
      let sc = Infinity;
      pts.forEach((q) => { const ddx = Math.max(0, Math.abs(cx - q[0]) - wu / 2) * k, ddy = Math.max(0, Math.abs(cy - q[1]) * k - 7); sc = Math.min(sc, Math.hypot(ddx, ddy)); });
      if (!best || sc > best.sc + 1e-9) best = { x, y, sc };
      if (sc >= 44) break;
    }
    if (best) b.text([best.x, best.y], text, { color, size: 12.5, weight: 800, align: o.left ? 'left' : 'right', dx: o.left ? 8 : -8, dy });
  }
  const lab = (b, p, name, color, o = {}) => b.point(p, { color, r: o.r || 5.5, label: name, dx: o.dx, dy: o.dy, align: o.align, size: o.size });
  const card = (view, line, color) => { if (!view.__lines) view.__lines = []; view.__lines.push({ text: line, color }); };

  function drawVert(b, v, st, view) {
    const { e, f, g, n, w, S } = v;
    b.plot(f, { color: 'green', width: 2.8, from: 0.05, to: 14 });
    b.plot(g, { color: 'sky', width: 2.8, from: 0.05, to: 14 });
    const av = [e.x1, e.x2];
    tagAt(b, f, 'y = log₂x', 'green', { dy: 16, avoid: av });
    tagAt(b, g, `y = log₂(${e.k}x)`, 'sky', { dy: -12, avoid: av });
    if (e.ask === 'tri') {
      const t = 2, yA = f(t), yB = g(t), ym = (yA + yB) / 2, hC = Math.sqrt(3) / 2 * n;
      const C = [t + hC, ym];
      b.seg([t, 0], [t, yB + 0.7], { color: 'amber', width: 2, dash: true });
      b.text([t, yB + 0.7], 'x = t', { color: 'amber', size: 12.5, weight: 800, dy: -8 });
      if (st >= 3) b.poly([[t, yA], [t, yB], C], { fill: 'amber', fillAlpha: 0.22, color: 'amber', width: 2.2 });
      else b.poly([[t, yA], [t, yB], C], { color: 'ink', width: 1.8, alpha: 0.8 });
      if (st >= 2) b.seg([t, yA], [t, yB], { color: 'amber', width: 4 });
      lab(b, [t, yA], 'A', 'green', { dx: -10, dy: 12, align: 'right' });
      lab(b, [t, yB], 'B', 'sky', { dx: -10, dy: -8, align: 'right' });
      lab(b, C, 'C', 'rose', { dx: 10, dy: 0 });
      if (st >= 2) b.text([t, ym], `AB = ${n}`, { color: 'amber', size: 12.5, weight: 800, align: 'right', dx: -12 });
      if (st >= 3) card(view, `정삼각형 ABC의 넓이 = (√3/4) × ${n}² = ${triTex(n).replace(/\\dfrac\{(\d+)\\sqrt\{3\}\}\{4\}/, '$1√3/4').replace(/\\sqrt\{3\}/, '√3')}`, '#fbbf24');
      return;
    }
    const { x1, x2 } = e;
    const pts = [];
    for (let x = x1; x <= x2 + 1e-9; x += 0.05) pts.push([x, f(x)]);
    for (let x = x2; x >= x1 - 1e-9; x -= 0.05) pts.push([x, g(x)]);
    b.poly(pts, { fill: 'amber', fillAlpha: st >= 3 ? 0.24 : 0.1, color: null });
    [[x1, 'amber'], [x2, 'rose']].forEach(([x, c]) => {
      b.seg([x, 0], [x, g(x) + 0.6], { color: c, width: 2, dash: true });
      b.text([x, g(x) + 0.6], `x = ${x}`, { color: c, size: 12.5, weight: 800, dy: -8 });
    });
    if (st >= 2) {
      b.seg([x1, f(x1)], [x1, g(x1)], { color: 'amber', width: 4.2 });
      b.seg([x2, f(x2)], [x2, g(x2)], { color: 'rose', width: 4.2 });
      b.text([x1, (f(x1) + g(x1)) / 2], `AB = ${n}`, { color: 'amber', size: 12.5, weight: 800, align: 'left', dx: 10 });
      b.text([x2, (f(x2) + g(x2)) / 2], `CD = ${n}`, { color: 'rose', size: 12.5, weight: 800, align: 'left', dx: 10 });
    }
    if (st >= 3) {
      // 같은 넓이의 직사각형(가로 w × 세로 n)을 x축 아래 빈 곳에 따로 그립니다
      b.poly([[x1, -1.1], [x2, -1.1], [x2, -1.1 - n], [x1, -1.1 - n]], { fill: 'violet', fillAlpha: 0.14, color: 'violet', width: 2.2 });
      b.text([(x1 + x2) / 2, -1.1 - n / 2], `가로 ${w} × 세로 ${n}`, { color: 'violet', size: 12.5, weight: 800 });
      card(view, `S = ${w} × ${n} = ${S}`, '#fbbf24');
    }
    lab(b, [x1, f(x1)], 'A', 'green', { dx: -10, dy: 12, align: 'right' });
    lab(b, [x1, g(x1)], 'B', 'sky', { dx: -10, dy: -8, align: 'right' });
    lab(b, [x2, f(x2)], 'C', 'green', { dx: 10, dy: 12 });
    lab(b, [x2, g(x2)], 'D', 'sky', { dx: 10, dy: -8 });
  }

  function drawWing(b, v, st, view) {
    const { e, F } = v;
    const vb = b.viewBox();
    const lo = vb.x0 - 0.3, hi = vb.x1 + 0.3;
    const wingR = (x) => 2 * Math.log2(x), wingL = (x) => 2 * Math.log2(-x);
    b.plot(wingR, { color: 'ink', width: 2.8, from: 0.03, to: hi });
    b.plot(wingL, { color: 'ink', width: 2.8, from: lo, to: -0.03 });
    tagAt(b, wingR, 'y = log₂x²', 'ink', { dy: -12 });
    if (e.ask === 'prod') {
      const c = e.c, rv = v.root;
      b.hline(c, { color: 'amber', width: 2.4 });
      b.text([vb.x1 - 0.2, c], `y = ${c}`, { color: 'amber', size: 12.5, weight: 800, align: 'right', dy: 14 });
      if (st >= 1) { b.plot(wingR, { color: 'green', width: 4.4, from: 0.03, to: hi }); b.point([rv, c], { color: 'green', r: 6.5, label: `x = ${v.rootTex.replace('\\sqrt{2}', '√2')}`, dx: 8, dy: -14 }); }
      if (st >= 2) { b.plot(wingL, { color: 'rose', width: 4.4, from: lo, to: -0.03 }); b.point([-rv, c], { color: 'rose', r: 6.5, label: `x = -${v.rootTex.replace('\\sqrt{2}', '√2')}`, dx: -8, dy: -14, align: 'right' }); }
      if (st >= 3) card(view, `두 근의 곱 = (−${v.rootTex.replace('\\sqrt{2}', '√2')}) × (${v.rootTex.replace('\\sqrt{2}', '√2')}) = −${2 ** c}`, '#fbbf24');
      return;
    }
    const { L } = v;
    b.plot(L, { color: 'amber', width: 2.4 });
    tagAt(b, L, `y = ${e.m === 1 ? '' : num(e.m)}x${e.k > 0 ? ' + ' + e.k : e.k < 0 ? ' − ' + (-e.k) : ''}`, 'amber', { left: true, dy: 16 });
    if (st >= 1) v.left.forEach((x) => b.point([x, L(x)], { color: 'rose', r: 6.5 }));
    if (st >= 2) v.right.forEach((x) => b.point([x, L(x)], { color: 'green', r: 6.5 }));
    if (st >= 3) card(view, `교점의 개수 = 왼쪽 1개 + 오른쪽 ${v.R}개 = ${v.total}개`, '#fbbf24');
  }

  function drawAbs(b, v, st, view, names) {
    const { p, t, x1, x2 } = v, M = (x1 + x2) / 2;
    if (p > 0) b.seg([p, -6], [p, 8], { color: 'violet', width: 1.8, dash: true, alpha: 0.7 });
    b.plot((x) => -Math.log2(x - p), { color: 'rose', width: 2.8, from: p + 0.004, to: p + 1 });
    b.plot((x) => Math.log2(x - p), { color: 'green', width: 2.8, from: p + 1, to: 60 });
    const vb = b.viewBox();
    b.hline(t, { color: 'amber', width: 2.4 });
    b.text([vb.x1 - 0.2, t], `y = ${t}`, { color: 'amber', size: 12.5, weight: 800, align: 'right', dy: 14 });
    if (st >= 1) lab(b, [p + 1, 0], `(${p + 1}, 0)`, 'ink', { r: 5, dx: 8, dy: 34 });
    if (st >= 2) {
      b.seg([x1, t], [x1, 0], { color: 'rose', width: 1.8, dash: true });
      b.seg([x2, t], [x2, 0], { color: 'green', width: 1.8, dash: true });
    }
    const den = 2 ** t;
    const s1 = st >= 2 ? `x₁ = ${fstr(p * den + 1, den)}` : 'x₁', s2 = st >= 2 ? `x₂ = ${p + den}` : 'x₂';
    b.point([x1, t], { color: 'rose', r: 6, label: s1, dx: -8, dy: -14, align: 'right' });
    b.point([x2, t], { color: 'green', r: 6, label: s2, dx: 8, dy: -14 });
    if (st >= 3 && !names) {
      b.seg([M, t], [M, 0], { color: 'sky', width: 2.2, dash: true });
      lab(b, [M, t], 'M', 'sky', { r: 6, dx: 8, dy: -14 });
      card(view, `(x₁−${p})(x₂−${p}) = 1,  M = ${v.M}`, '#38bdf8');
    } else if (st >= 3) {
      card(view, `x₁x₂ = 1,  x₁ + x₂ > 2`, '#fbbf24');
    }
  }

  function drawInv(b, v, st, view) {
    const { a } = v.e;
    const vb = b.viewBox();
    b.plot((x) => Math.pow(a, x), { color: 'green', width: 2.8, from: -6, to: 12 });
    b.plot((x) => Math.log(x) / Math.log(a), { color: 'sky', width: 2.8, from: 0.01, to: 14 });
    const avI = v.e.ask === 'kS' ? [v.al, v.be] : [expX(a, 0, 0, v.e.k), v.e.k - expX(a, 0, 0, v.e.k)];
    const skI = v.e.ask === 'kS' ? [[v.al, v.be], [v.be, v.al], [v.k / 2, v.k / 2], [v.al, (v.al + v.be) / 2], [(v.al + v.be) / 2, v.al], [0, 0]] : [[avI[0], avI[1]], [avI[1], avI[0]], [v.e.k / 2, v.e.k / 2]];
    tagAt(b, (x) => Math.pow(a, x), `y = ${a}ˣ`, 'green', { left: true, dy: -10, avoid: avI, skip: skI });
    tagAt(b, (x) => Math.log(x) / Math.log(a), `y = log${sub(a)} x`, 'sky', { dy: 16, avoid: avI, skip: skI });
    const k = v.e.ask === 'kS' ? v.k : v.e.k;
    b.plot((x) => -x + k, { color: 'amber', width: 2.4, from: -6, to: 14 });
    if (v.e.ask === 'M') tagAt(b, (x) => -x + k, `y = −x + ${k}`, 'amber', { dy: -12, avoid: avI, skip: skI });
    const xA = expX(a, 0, 0, k), yA = k - xA;
    if (st >= 1) b.plot((x) => x, { color: 'violet', width: 1.9, dash: true, from: -6, to: 14 });
    if (v.e.ask === 'kS') {
      const A = [v.al, v.be], B = [v.be, v.al], O = [0, 0], Mid = [k / 2, k / 2];
      b.poly([O, A, B], st >= 3 ? { fill: 'amber', fillAlpha: 0.2, color: 'amber', width: 2.2 } : { color: 'ink', width: 1.8, alpha: 0.8 });
      if (st >= 2) {
        b.seg(A, [A[0], B[1]], { color: 'amber', width: 2, dash: true });
        b.seg([A[0], B[1]], B, { color: 'amber', width: 2, dash: true });
        b.text([A[0], (A[1] + B[1]) / 2], `${v.d}`, { color: 'amber', size: 12.5, weight: 800, align: 'right', dx: -8 });
        b.text([(A[0] + B[0]) / 2, B[1]], `${v.d}`, { color: 'amber', size: 12.5, weight: 800, dy: 16 });
      }
      lab(b, O, 'O', 'ink', { r: 4.5, dx: -10, dy: 14, align: 'right' });
      lab(b, A, st >= 2 ? `A(${A[0]}, ${A[1]})` : 'A', 'green', { dx: -10, dy: -8, align: 'right' });
      lab(b, B, st >= 2 ? `B(${B[0]}, ${B[1]})` : 'B', 'sky', { dx: 8, dy: 16 });
      if (st >= 1) lab(b, Mid, st >= 3 ? `M(${k / 2}, ${k / 2})` : 'M', 'violet', { r: 5, dx: 12, dy: 0 });
      if (st >= 3) { b.seg(O, Mid, { color: 'violet', width: 2, dash: true }); card(view, `k = ${v.al} + ${v.be} = ${k},  △OAB = ½ × OM × AB = ${fstr(k * v.d, 2)}`, '#fbbf24'); }
    } else {
      const A = [xA, yA], B = [yA, xA];
      lab(b, A, 'A', 'green', { dx: -10, dy: -8, align: 'right' });
      lab(b, B, 'B', 'sky', { dx: 8, dy: 16 });
      if (st >= 1) {
        b.seg(A, B, { color: 'amber', width: 3 });
        lab(b, [k / 2, k / 2], st >= 2 ? `M(${fstr(k, 2)}, ${fstr(k, 2)})` : 'M', 'violet', { r: 6, dx: 12, dy: 0 });
      }
      if (st >= 3) card(view, `x_A + x_B = y_A + y_B = ${k}  (M은 y = x 위, M(${fstr(k, 2)}, ${fstr(k, 2)}))`, '#fbbf24');
    }
  }

  function drawXlat(b, v, st, view) {
    const { e, p, C, P1, P2, M0 } = v, { m, n, q } = e;
    b.plot((x) => Math.pow(2, x - m) + n, { color: 'green', width: 2.8, from: -8, to: 14 });
    b.plot((x) => Math.log2(x - p) + q, { color: 'sky', width: 2.8, from: p + 0.002, to: 40 });
    const skX = [P1, P2, M0, [0, 0]].concat(e.ask === 'CM' ? [[expX(2, m, n, e.k), e.k - expX(2, m, n, e.k)], [logX(2, p, q, e.k), e.k - logX(2, p, q, e.k)], [(e.k - C) / 2, (e.k + C) / 2], [(e.k - C) / 2 + 45 / b.k, (e.k + C) / 2], [(e.k - C) / 2 + 90 / b.k, (e.k + C) / 2]] : []);
    tagAt(b, (x) => Math.pow(2, x - m) + n, '지수함수', 'green', { left: true, dy: -12, skip: skX });
    tagAt(b, (x) => Math.log2(x - p) + q, '로그함수', 'sky', { dy: 16, skip: skX });
    if (e.given || st >= 1) {
      lab(b, P1, `(${P1[0]}, ${P1[1]})`, 'green', { r: 5.5, dx: -8, dy: -12, align: 'right' });
      lab(b, P2, `(${P2[0]}, ${P2[1]})`, 'sky', { r: 5.5, dx: 8, dy: 14 });
    }
    if (st >= 1) b.seg(P1, P2, { color: 'rose', width: 2, dash: true });
    if (st >= 2) {
      b.plot((x) => x + C, { color: 'violet', width: 2.6, dash: true, from: -12, to: 16 });
      lab(b, M0, `(${fstr(P1[0] + P2[0], 2)}, ${fstr(P1[1] + P2[1], 2)})`, 'rose', { r: 5, dx: 10, dy: 14 });
      tagAt(b, (x) => x + C, `대칭축 y = x ${C >= 0 ? '+' : '−'} ${Math.abs(C)}`, 'violet', { left: true, dy: -14, skip: skX });
    }
    if (e.ask === 'CM') {
      const k = e.k, xa = expX(2, m, n, k), xb = logX(2, p, q, k);
      b.plot((x) => -x + k, { color: 'amber', width: 2.4, from: -12, to: 16 });
      lab(b, [xa, k - xa], 'A', 'green', { dx: -10, dy: -8, align: 'right' });
      lab(b, [xb, k - xb], 'B', 'sky', { dx: 8, dy: -10 });
      if (st >= 3) {
        b.seg([xa, k - xa], [xb, k - xb], { color: 'amber', width: 3.4 });
        lab(b, [(k - C) / 2, (k + C) / 2], `M(${fstr(k - C, 2)}, ${fstr(k + C, 2)})`, 'violet', { r: 6.5, dx: 12, dy: 0 });
        card(view, `대칭축 y = x ${C >= 0 ? '+' : '−'} ${Math.abs(C)}  ⇒  C = ${C},  M(${fstr(k - C, 2)}, ${fstr(k + C, 2)})`, '#c084fc');
      }
    } else if (st >= 3) {
      b.right(M0, P1, [M0[0] + 1, M0[1] + 1], { color: 'amber', size: 13 });
      card(view, `P₁P₂의 기울기 −1 ⟂ 대칭축 y = x ${C >= 0 ? '+' : '−'} ${Math.abs(C)}  ⇒  C = ${C}`, '#c084fc');
    }
  }

  function drawTrap(b, v, st, view) {
    const { e } = v, { k1, k2 } = e;
    b.plot((x) => Math.pow(2, x), { color: 'green', width: 2.8, from: -6, to: 12 });
    b.plot((x) => Math.log2(x), { color: 'sky', width: 2.8, from: 0.01, to: 14 });
    const L1 = (x) => -x + k1, L2 = (x) => -x + k2;
    b.plot(L1, { color: 'amber', width: 2.4, from: -6, to: 14 });
    b.plot(L2, { color: 'rose', width: 2.4, from: -6, to: 14 });
    const xa = expX(2, 0, 0, k1), xc = expX(2, 0, 0, k2);
    const avT = [xa, k1 - xa, xc, k2 - xc];
    const skT = [[xa, k1 - xa], [k1 - xa, xa], [xc, k2 - xc], [k2 - xc, xc]];
    tagAt(b, L1, `y = −x + ${num(k1)}`, 'amber', { dy: 16, avoid: avT, skip: skT });
    tagAt(b, L2, `y = −x + ${num(k2)}`, 'rose', { dy: -12, avoid: avT, skip: skT });
    const A = [xa, k1 - xa], B = [k1 - xa, xa], C = [xc, k2 - xc], D = [k2 - xc, xc];
    const M1 = [k1 / 2, k1 / 2], M2 = [k2 / 2, k2 / 2];
    const poly = [A, B, D, C];
    b.poly(poly, st >= 3 && e.ask !== 'h' ? { fill: 'amber', fillAlpha: 0.2, color: 'ink', width: 1.8 } : { color: 'ink', width: 1.8, alpha: 0.75 });
    if (st >= (e.ask === 'h' ? 1 : 2)) b.plot((x) => x, { color: 'violet', width: 1.9, dash: true, from: -6, to: 14 });
    if (st >= 2) {
      b.seg(M1, M2, { color: 'green', width: 3.4 });
      lab(b, M1, '', 'green', { r: 4.5 }); lab(b, M2, '', 'green', { r: 4.5 });
      const mid = [(M1[0] + M2[0]) / 2, (M1[1] + M2[1]) / 2];
      b.text(mid, 'h', { color: 'green', size: 13, weight: 800, dx: 14, dy: 12 });
    }
    if (e.ask === 'h' && st >= 2) {
      b.right(M1, [M1[0] + 1, M1[1] + 1], [M1[0] + 1, M1[1] - 1], { color: 'amber', size: 10 });
      b.right(M2, [M2[0] - 1, M2[1] - 1], [M2[0] + 1, M2[1] - 1], { color: 'amber', size: 10 });
    }
    const nm = (z, s, c, o) => lab(b, z, s, c, o);
    const co = (z) => `(${z[0]}, ${z[1]})`;
    const withC = v.nice && st >= 1;
    nm(A, withC ? 'A' + co(A) : 'A', 'green', { dx: -10, dy: -8, align: 'right' });
    nm(B, withC ? 'B' + co(B) : 'B', 'sky', { dx: 8, dy: 14 });
    nm(C, withC ? 'C' + co(C) : 'C', 'green', { dx: -10, dy: -8, align: 'right' });
    nm(D, withC ? 'D' + co(D) : 'D', 'sky', { dx: 8, dy: 14 });
    if (st >= 3) {
      if (e.ask === 'S') card(view, `S = ½ × ${v.dk} × (${v.d1} + ${v.d2}) = ${v.S}`, '#fbbf24');
      else if (e.ask === 'h0') card(view, `h = $\\frac{${num(Math.abs(k2 - k1))}}{\\sqrt2}$,  S = Δx₁ + Δx₂ (√2 약분)`, '#fbbf24');
      else card(view, `h = $\\frac{${num(Math.abs(k2 - k1))}}{\\sqrt2}$  (y = x 는 두 밑변의 수직이등분선)`, '#fbbf24');
    }
  }

  function drawCirc(b, v, st, view) {
    const { e, r, r2, d } = v, { al, be, a } = e;
    b.circle([0, 0], r, { color: 'violet', width: 2.6 });
    b.plot((x) => Math.pow(a, x), { color: 'green', width: 2.8, from: -8, to: 6 });
    b.plot((x) => Math.log(x) / Math.log(a), { color: 'sky', width: 2.8, from: 0.01, to: 12 });
    b.text([-r * 0.707, r * 0.707], `x² + y² = ${r2}`, { color: 'violet', size: 12.5, weight: 800, align: 'right', dx: -8, dy: -6 });
    tagAt(b, (x) => Math.pow(a, x), 'y = aˣ', 'green', { left: true, dy: -10 });
    const P = [al, be], Q = [be, al];
    if (st >= 1) {
      b.plot((x) => x, { color: 'ink', width: 1.8, dash: true, alpha: 0.7, from: -r - 1, to: r + 1 });
      b.seg(P, Q, { color: 'amber', width: 3 });
    }
    if (st >= 2) {
      b.seg(P, [al, al], { color: 'amber', width: 2, dash: true });
      b.seg([al, al], Q, { color: 'amber', width: 2, dash: true });
      b.text([al, (be + al) / 2], `${d}`, { color: 'amber', size: 12.5, weight: 800, align: 'right', dx: -8 });
      b.text([(al + be) / 2, al], `${d}`, { color: 'amber', size: 12.5, weight: 800, dy: 16 });
    }
    lab(b, P, st >= 3 ? `P(${al}, ${be})` : 'P', 'green', { dx: -10, dy: -10, align: 'right' });
    lab(b, Q, st >= 3 ? `Q(${be}, ${al})` : 'Q', 'sky', { dx: 8, dy: 14 });
    if (st >= 3) card(view, `α² + β² = ${r2},  β − α = ${d}  ⇒  P(${al}, ${be}),  a^${al} = ${be},  a = ${a}`, '#fbbf24');
  }

  function drawLatt(b, v, st, view) {
    const { e, rows, K, total } = v;
    const fn = (x) => Math.log2(x);
    b.plot(fn, { color: 'green', width: 2.8, from: 0.2, to: 20 });
    { const xm = Math.max(3, K * 0.5); b.text([xm, fn(xm)], 'y = log₂x', { color: 'green', size: 12.5, weight: 800, align: 'center', dy: -14 }); }
    const reg = [[2, 1]];
    for (let x = 2; x <= K + 1e-9; x += 0.1) reg.push([x, fn(x)]);
    reg.push([K, 1]);
    b.poly(reg, { fill: 'amber', fillAlpha: 0.1, color: null });
    b.seg([K, 0], [K, fn(K) + 0.7], { color: 'amber', width: 2.2, dash: true });
    b.text([K, fn(K) + 0.7], `x = ${K}`, { color: 'amber', size: 12.5, weight: 800, dy: -8 });
    if (st >= 2) for (let x = 2; x <= K; x++) b.seg([x, 0], [x, Math.floor(Math.log2(x) + 1e-9)], { color: 'sky', width: 1.4, dash: true });
    if (st >= 3) rows.forEach((r) => {
      b.seg([r.x0, r.y], [K, r.y], { color: 'rose', width: 3.2 });
      b.text([K, r.y], `${r.cnt}개`, { color: 'rose', size: 12.5, weight: 800, align: 'left', dx: 12 });
    });
    if (st >= 1) rows.forEach((r) => { for (let x = r.x0; x <= K; x++) b.point([x, r.y], { color: 'amber', r: 4.6 }); });
    if (st >= 3) card(view, `가로줄별 개수의 합 = ${rows.map((r) => r.cnt).join(' + ')} = ${total}개`, '#fb7185');
  }

  const DRAW = { vert: drawVert, wing: drawWing, absM: (b, v, st, view) => drawAbs(b, v, st, view, false), absTF: (b, v, st, view) => drawAbs(b, v, st, view, true), inv: drawInv, xlat: drawXlat, trap: drawTrap, circ: drawCirc, latt: drawLatt };

  /* ==========================================================================
     공개 API
     ========================================================================== */
  const ALV = {
    KINDS, POOLS, frac, fstr, rich, tx, bisect, crossings, expX, logX,
    /** 변형 묶음 만들기. kind: 'vert'…, pool: POOLS 항목, orig: { text, std[], quick[] } (첫 문제의 옛 글) */
    make(kind, pool, orig) {
      const build = (e, i) => {
        const fn = e.kind ? KINDS[e.kind] : KINDS[kind];
        const v = fn(e);
        v.kind = e.kind || kind;
        if (i === 0 && orig) {
          if (orig.text) v.text = orig.text;
          if (orig.std) v.std = orig.std;
          if (orig.quick) v.quick = orig.quick;
        }
        return v;
      };
      return varier(pool, build);
    },
    /** 장면에 붙일 부분: 문제·풀이·단계·새 문제 */
    ext(V, o = {}) {
      const probHTML = (body) => `${rich(body)}<div style="margin-top:10px"><button type="button" class="apl-btn sm" data-alv-new>새 문제</button></div>`;
      return {
        startStep: 0,
        steps: () => V.cur().steps.map((t, i) => `${i + 1}단계 · ${t}`),
        reviewTop: () => `<div class="apl-rich" style="font-size:var(--fs-sm);line-height:1.75"><small style="color:var(--text-3);font-weight:800">문제</small><br>${rich(V.cur().text)}</div>`,
        problem: { tag: o.tag, time: o.time, text: () => probHTML(V.cur().text), answer: () => V.cur().ans },
        vary: V,
        solution: {
          // 첫 문제(옛 문제)는 옛 풀이 제목 그대로, 「새 문제」의 풀이는 일반 제목
          get standardTitle() { return V.cur().idx === 0 && o.standardTitle ? o.standardTitle : '풀이 과정'; }, standardTag: '기본 풀이',
          get quickTitle() { return V.cur().idx === 0 && o.quickTitle ? o.quickTitle : '핵심만 보는 풀이'; }, quickTag: '10초 컷',
          standard: () => ({ steps: V.cur().std.map((x) => `<div>${rich(x)}</div>`).join('') }),
          quick: () => ({ steps: V.cur().quick.map((x) => `<div>${rich(x)}</div>`).join('') })
        }
      };
    },
    /** 문제·정리 탭 그림. grid/축은 호출하는 쪽에서 그립니다. */
    draw(b, v, st, view) {
      view.__lines = null;
      DRAW[v.kind](b, v, st, view);
      if (view.__lines) view.card = { title: '그림 설명', lines: view.__lines };
      delete view.__lines;
    },
    /** 장면(또는 변형)마다 보이는 범위를 한 번만 맞춥니다. 사용자가 확대·이동한 뒤에는 건드리지 않습니다. */
    /** 격자·축: 격자점 장면은 정수 눈금으로 */
    gridAxes(b, s, v) {
      const step = v && v.kind === 'latt' ? 1 : [1, 2, 5, 10, 20].find((x) => x >= 46 / (b.k || 30)) || 20; // 눈금은 정수 간격(0.5·2.5 같은 간격 없이)
      const o = { step, tickStep: step };
      if (s.grid) b.grid(o);
      b.axes(o);
    },
    focus(b, key, box) {
      if (b._alvKey === key) return;
      b._alvKey = key;
      b.setFocus(box, true);
    }
  };
  G.ALV = ALV;

  if (typeof document !== 'undefined') {
    document.addEventListener('click', (ev) => {
      const hit = ev.target && ev.target.closest && ev.target.closest('[data-alv-new]');
      if (!hit) return;
      const L = G.lab, sc = L && L.scene;
      if (!sc || !sc.vary) return;
      sc.vary.next();
      L.s.revealed = false;
      L.setStep(0);
      try { L._buildReview(); } catch (err) { /* 키트가 바뀌어도 그림은 그대로 */ }
      L.invalidate(true);
    });
  }
})();
