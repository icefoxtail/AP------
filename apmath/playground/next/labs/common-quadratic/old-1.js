/* ==========================================================================
   공통수학 · 이차함수 — 옛 탐구관 1~3 의 정리·문제 탭 (15장면)
   1: 두 함수의 차 f−g & 직선의 위치 관계   2: 움직이는 대칭축 x=p 최대·최소   3: 절댓값 그래프 & 실근의 개수
   ========================================================================== */
(function () {
  'use strict';
  const O = window.APL_CQ_OLD;
  if (!O || !window.APLab) return;
  const { T, frTex, xm, par, polyTex, linTex, coef, sgn, varier, dot, lbl, boxOf, autoBox, nameOn, corner, vy, vlab, sg } = O.H;
  const above = (y) => (y >= 0 ? -16 : 22); // 점 라벨: 축 위쪽 점은 위에, 아래쪽 점은 아래에
  const add = O.add;
  const sq = (v) => v * v;

  /* ======================================================================
     1-A  diffFuncFlatten · 직선을 x축으로 내리기
     f(x)=g(x)+a(x−α)(x−β),  g(x)=mx+n,  f(t) 구하기   [도형 빠른 풀이: 핵심]
     ====================================================================== */
  const P1 = [
    { a: 1, al: -1, be: 3, m: 2, n: 1, t: 0 },
    { a: 1, al: -2, be: 2, m: 1, n: 3, t: 1 },
    { a: 2, al: 0, be: 4, m: -1, n: 2, t: 1 },
    { a: 1, al: 1, be: 5, m: 3, n: -2, t: 0 },
    { a: -1, al: -1, be: 2, m: 1, n: 2, t: 3 },
    { a: 2, al: -3, be: 1, m: 2, n: 1, t: 0 },
    { a: 1, al: -3, be: 3, m: 1, n: -1, t: 1 },
    { a: 3, al: -1, be: 1, m: -2, n: 4, t: 2 }
  ];
  const var1 = varier(P1, (c, i) => {
    const f = (x) => c.a * (x - c.al) * (x - c.be) + c.m * x + c.n, g = (x) => c.m * x + c.n, h = (x) => c.a * (x - c.al) * (x - c.be);
    return { ...c, key: 'd1_' + i, f, g, h, val: f(c.t), pc: c.m - c.a * (c.al + c.be), qc: c.n + c.a * c.al * c.be };
  });
  add('diffFuncFlatten', {
    fast: '핵심', vary: var1,
    tag: '25 매산고 기출 유형 · 2022학년도 9월 학평(인천) 유형 (곡선과 직선의 교점의 x좌표)', time: '목표 시간: 40초',
    text: (v) => `이차함수 ${T('y=f(x)')}의 그래프와 직선 ${T('y=' + linTex(v.m, v.n))}이 ${T('x')}좌표가 ${T(v.al)}, ${T(v.be)}인 두 점 A, B에서 만난다. ${T('f(x)')}의 이차항의 계수가 ${T(v.a)}일 때, ${T('f(' + v.t + ')')}의 값을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `곡선과 직선의 교점의 ${T('x')}좌표가 ${T(v.al + ',\\ ' + v.be)}입니다. 직선 ${T('y=' + linTex(v.m, v.n))}을 ${T('x')}축으로 내리면 곡선도 함께 내려와 ${T('y=f(x)-g(x)')}의 그래프가 되고, 두 교점은 ${T('x')}축 위의 점이 됩니다(점선).`,
      `${T('h(x)=f(x)-g(x)')}의 ${T('x')}절편이 ${T(v.al)}, ${T(v.be)}이고 이차항의 계수는 ${T('f')}와 같은 ${T(v.a)}이므로 ${T('h(x)=' + (v.a === 1 ? '' : v.a === -1 ? '-' : v.a) + '(' + xm(v.al) + ')(' + xm(v.be) + ')')}.`,
      `${T('f(' + v.t + ')=g(' + v.t + ')+h(' + v.t + ')=' + par(v.m * v.t + v.n) + '+' + par(v.h(v.t)) + '=' + v.val + '')}. 그림에서 ${T('x=' + v.t)}일 때 직선의 높이 ${T(v.m * v.t + v.n)}에 점선 포물선의 높이 ${T(v.h(v.t))}를 더한 값입니다.`
    ],
    quick: (v) => ({
      steps: `곡선 ${T('y=f(x)')}와 직선 ${T('y=g(x)')}의 교점의 ${T('x')}좌표가 ${T(v.al)}, ${T(v.be)}이므로 방정식 ${T('f(x)-g(x)=0')}의 두 근이 ${T(v.al)}, ${T(v.be)}입니다(그림: 직선을 ${T('x')}축으로 내려 보면 ${T('x')}절편). 이차항의 계수가 ${T(v.a)}이므로<br>${T('f(x)-g(x)=' + (v.a === 1 ? '' : v.a === -1 ? '-' : v.a) + '(' + xm(v.al) + ')(' + xm(v.be) + ')')}, 즉 ${T('f(x)=' + (v.a === 1 ? '' : v.a === -1 ? '-' : v.a) + '(' + xm(v.al) + ')(' + xm(v.be) + ')+' + linTex(v.m, v.n))}.<br>${T('f(' + v.t + ')=' + par(v.h(v.t)) + '+' + par(v.m * v.t + v.n) + '=' + v.val)}.`,
      highlight: `💡 서술형 문장: "${T('f(x)-g(x)')}는 이차항의 계수가 ${T(v.a)}이고 ${T('x=' + v.al)}, ${T('x=' + v.be)}를 근으로 가지므로 ${T('f(x)-g(x)=' + (v.a === 1 ? '' : v.a === -1 ? '-' : v.a) + '(' + xm(v.al) + ')(' + xm(v.be) + ')')}이다."`
    }),
    std: (v) => ({
      steps: `① ${T('f(x)=ax^2+px+q')}로 놓으면 ${T('a=' + v.a)}.<br>
② 교점의 조건 ${T('f(' + v.al + ')=g(' + v.al + ')')}, ${T('f(' + v.be + ')=g(' + v.be + ')')}에 대입해 ${T('p,\\ q')}의 연립방정식을 세워 풉니다 ⇒ ${T('p=' + v.pc + ',\\ q=' + v.qc)}.<br>
③ ${T('f(x)=' + polyTex(v.a, v.pc, v.qc))}이므로 ${T('f(' + v.t + ')=' + v.val)}.`,
      warning: `⚠️ 연립방정식을 거치면 계산이 길어집니다. "교점의 ${T('x')}좌표 = ${T('f-g')}의 근"을 바로 쓰면 한 줄입니다.`
    }),
    box: (v) => autoBox(Math.min(v.al, v.be, v.t) - 3, Math.max(v.al, v.be, v.t) + 3, [v.g(v.al), v.g(v.be), v.g(v.t), v.f(v.t), v.h(v.t)], 1.4),
    draw: (b, s, v, c) => {
      // 이름표는 아래·위 모서리 중 점 이름과 덜 겹치는 쪽에 둡니다
      const keyPts = [[v.al, v.g(v.al)], [v.be, v.g(v.be)], [v.t, v.f(v.t)], [v.t, v.g(v.t)], [v.t + 1.5, v.f(v.t) - 1.2], [v.al - 1.5, v.g(v.al)], [v.be + 1.5, v.g(v.be)]];
      const clear = (top) => {
        const ay = top ? c.box.y[1] - 1.7 : c.box.y[0] + 0.7;
        return Math.min(...[c.box.x[0] + 0.2, c.box.x[1] - 0.2].flatMap((ax) => keyPts.map((p) => Math.hypot((p[0] - ax) / 2.5, p[1] - ay))));
      };
      const low = clear(true) > clear(false);
      b.plot(v.g, { color: 'rose', width: 3.2, glow: true });
      b.plot(v.f, { color: 'sky', width: 3.6, glow: true });
      corner(b, c.box, '직선 y = ' + linTex(v.m, v.n).replace(/-/g, '−').replace(/\+/g, ' + ').replace(/(\d)−/g, '$1 − '), { color: 'rose' }, v.m > 0 ? 1 : -1, low);
      corner(b, c.box, 'f', { color: 'sky', size: 14 }, v.m > 0 ? -1 : 1, low);
      if (c.st(1)) {
        b.plot(v.h, { color: 'amber', width: 2.8, dash: [6, 5] });
        [v.al, v.be].forEach((x) => b.point([x, 0], { color: 'green', r: 5.5 }));
      }
      [v.al, v.be].forEach((x) => b.seg([x, v.g(x)], [x, 0], { color: 'violet', width: 1.5, dash: [4, 4] }));
      dot(b, [v.al, v.g(v.al)], 'ink', `A (x=${lbl(v.al)})`, -12, v.g(v.al) < 0 ? 12 : 0, { align: 'right', hollow: true, size: 14 });
      dot(b, [v.be, v.g(v.be)], 'ink', `B (x=${lbl(v.be)})`, 12, v.g(v.be) < 0 ? 12 : 0, { hollow: true, size: 14 });
      if (v.t !== 0) b.vline(v.t, { color: 'muted', width: 1.3, dash: [4, 5], alpha: 0.6 });
      if (c.st(3)) {
        b.point([v.t, v.g(v.t)], { color: 'rose', r: 5 });
        b.point([v.t, v.h(v.t)], { color: 'amber', r: 5 });
        b.seg([v.t, v.g(v.t)], [v.t, v.f(v.t)], { color: 'green', width: 3 });
        dot(b, [v.t, v.f(v.t)], 'green', `f(${lbl(v.t)}) = ${lbl(v.val)}`, 12, 22, { r: 6 });
      }
    }
  });

  /* ======================================================================
     1-B  tangentDiscriminant · 직선을 눕혀서 접선 찾기
     f(x)=ax²+(m−2ap)x+(q+ap²),  직선 y=mx+k 가 접할 때 k = q   [핵심]
     ====================================================================== */
  const P2 = [
    { a: 1, p: 1, q: -2, m: 2 }, { a: 1, p: -1, q: 2, m: 1 }, { a: 1, p: 2, q: -1, m: -1 }, { a: -1, p: 1, q: 3, m: -2 },
    { a: 2, p: -1, q: 1, m: 2 }, { a: 1, p: -2, q: -3, m: 1 }, { a: -1, p: -1, q: 4, m: 1 }, { a: 2, p: 1, q: -1, m: -2 }
  ];
  const var2 = varier(P2, (c, i) => {
    const [A, B, C] = [c.a, c.m - 2 * c.a * c.p, c.q + c.a * c.p * c.p];
    const f = (x) => A * x * x + B * x + C, g = (x, k) => c.m * x + k, h = (x) => A * (x - c.p) ** 2 + c.q;
    return { ...c, key: 'd2_' + i, A, B, C, f, g, h, val: c.q, k0: c.q + (c.a > 0 ? 2.5 : -2.5) };
  });
  add('tangentDiscriminant', {
    fast: '핵심', vary: var2,
    tag: '24 매산고 기출 유형 · 2023학년도 3월 학평(서울) 유형 (이차함수와 직선이 접할 조건)', time: '목표 시간: 40초',
    text: (v) => `이차함수 ${T('f(x)=' + polyTex(v.A, v.B, v.C))}의 그래프와 직선 ${T('y=' + linTex(v.m, 'k'))}가 한 점에서 만날 때(접할 때), 상수 ${T('k')}의 값을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `직선 ${T('y=' + linTex(v.m, 'k'))}가 수평이 되도록 기울기만큼 모두 내려서 봅니다. 그러면 직선은 수평선 ${T('y=k')}, 포물선은 ${T('y=f(x)-' + (v.m === 1 ? '' : par(v.m)) + 'x')}(점선)가 됩니다. "접한다"는 수평선이 점선 포물선에 한 점에서 닿는다는 뜻입니다.`,
      `수평선이 포물선에 한 점에서 닿는 곳은 꼭짓점뿐입니다. ${T('y=f(x)-' + (v.m === 1 ? '' : par(v.m)) + 'x=' + polyTex(v.A, v.B - v.m, v.C) + '=' + (v.A === 1 ? '' : v.A === -1 ? '-' : v.A) + '(' + xm(v.p) + ')^2' + (v.q < 0 ? '' : '+') + v.q)}이므로 꼭짓점은 ${T('(' + v.p + ',\\ ' + v.q + ')')}.`,
      `수평선 ${T('y=k')}가 꼭짓점의 높이에 올 때이므로 ${T('k=' + v.q)}. 원래 그림에서는 직선 ${T('y=' + linTex(v.m, v.q))}가 ${T('x=' + v.p)}인 점에서 곡선에 접합니다.`
    ],
    quick: (v) => ({
      steps: `직선을 수평으로 눕히면 ${T('f(x)-mx=k')}, 곧 포물선 ${T('y=f(x)-' + (v.m === 1 ? '' : par(v.m)) + 'x')}와 수평선 ${T('y=k')}가 한 점에서 만나는 문제입니다. 수평선이 한 점에서 만나는 곳은 꼭짓점의 높이뿐이므로 <strong>${T('k')} = 꼭짓점의 ${T('y')}좌표</strong>입니다.<br>${T('f(x)-' + (v.m === 1 ? '' : par(v.m)) + 'x=' + (v.A === 1 ? '' : v.A === -1 ? '-' : v.A) + '(' + xm(v.p) + ')^2' + (v.q < 0 ? '' : '+') + v.q)} ⇒ ${T('k=' + v.q)}.`,
      highlight: `💡 서술형 문장: "${T('f(x)=' + linTex(v.m, 'k'))}에서 ${T('f(x)-' + linTex(v.m, '') + '=k')}의 실근이 한 개이므로 ${T('y=f(x)-' + (v.m === 1 ? '' : par(v.m)) + 'x')}의 꼭짓점의 ${T('y')}좌표가 ${T('k')}이다."`
    }),
    std: (v) => ({
      steps: `① ${T('f(x)=' + linTex(v.m, 'k'))} ⇒ ${T(polyTex(v.A, v.B - v.m, v.C) + '-k=0')}.<br>② 중근을 가지므로 판별식 ${T('D=(' + (v.B - v.m) + ')^2-4\\cdot' + par(v.A) + '\\cdot(' + v.C + '-k)=0')}.<br>③ 풀면 ${T('k=' + v.q)}.`,
      warning: `⚠️ 판별식은 식이 길어질수록 계산 실수가 나기 쉽습니다. 꼭짓점의 높이를 읽는 방법이 더 짧고 검산도 됩니다.`
    }),
    box: (v) => autoBox(v.p - 4, v.p + 4, [v.q, v.f(v.p), v.g(v.p, v.k0), v.g(v.p - 2, v.k0), v.g(v.p + 2, v.k0)], 1.8),
    draw: (b, s, v, c) => {
      b.plot(v.f, { color: 'sky', width: 3.6, glow: true });
      b.plot((x) => v.g(x, v.k0), { color: 'rose', width: 3, glow: true, alpha: c.st(3) ? 0.35 : 1 });
      // 직선과 곡선의 이름은 문제 글에 있으므로 그림에는 따로 붙이지 않습니다(꼭짓점·k 라벨과 겹치지 않게).
            if (c.st(1)) {
        b.plot(v.h, { color: 'amber', width: 2.8, dash: [6, 5] });
        b.hline(v.k0, { color: 'amber', width: 1.8, dash: [4, 5], alpha: 0.8 });
      }
      if (c.st(2)) { dot(b, [v.p, v.q], 'amber', `꼭짓점 (${lbl(v.p)}, ${lbl(v.q)})`, 10, v.a > 0 ? 18 : -16, { r: 6 }); }
      if (c.st(3)) {
        b.hline(v.q, { color: 'green', width: 2.4, dash: [6, 5] });
        b.plot((x) => v.g(x, v.q), { color: 'green', width: 3.2 });
        dot(b, [v.p, v.f(v.p)], 'green', 'k = ' + lbl(v.q), 10, v.a > 0 ? 20 : -16, { r: 6 });
      }
    }
  });

  /* ======================================================================
     1-C  chordLengthVieta · 기울기 삼각형으로 선분 AB 의 길이
     f=g+a(x−α)(x−β),  AB=|β−α|√(1+m²)   [핵심]
     ====================================================================== */
  const P3 = [
    { a: 1, al: -1, be: 3, m: 1, n: 1 }, { a: 1, al: -2, be: 2, m: 2, n: 0 }, { a: 2, al: 0, be: 3, m: -1, n: 2 },
    { a: 1, al: -1, be: 2, m: -2, n: 3 }, { a: -1, al: -2, be: 2, m: 1, n: 1 }, { a: 1, al: 1, be: 5, m: 2, n: -1 },
    { a: 1, al: -3, be: 1, m: 1, n: 2 }, { a: 1, al: -2, be: 3, m: 1, n: 0 }
  ];
  const var3 = varier(P3, (c, i) => {
    const d = c.be - c.al, rt = 1 + c.m * c.m;
    const A = c.a, B = c.m - c.a * (c.al + c.be), C = c.n + c.a * c.al * c.be;
    const f = (x) => A * x * x + B * x + C, g = (x) => c.m * x + c.n;
    const tex = d + '\\sqrt{' + rt + '}';
    return { ...c, key: 'd3_' + i, d, rt, A, B, C, f, g, tex, val: d * Math.sqrt(rt) };
  });
  add('chordLengthVieta', {
    fast: '핵심', vary: var3,
    tag: '2023학년도 6월 학평(부산) 유형 · 26 금당고 기출 유형 (현의 길이)', time: '목표 시간: 40초',
    text: (v) => `이차함수 ${T('f(x)=' + polyTex(v.A, v.B, v.C))}의 그래프와 직선 ${T('y=' + linTex(v.m, v.n))}이 만나는 서로 다른 두 점을 A, B라 할 때, 선분 AB의 길이를 구하시오.`,
    ans: (v) => v.tex,
    steps: (v) => [
      `${T('f(x)-g(x)=0')}의 두 근이 두 점의 ${T('x')}좌표입니다. 직선을 ${T('x')}축으로 내린 그림(점선)에서 ${T('x')}절편을 읽으면 ${T('x=' + v.al)}, ${T('x=' + v.be)}.`,
      `${T('A(' + v.al + ',\\ ' + v.g(v.al) + ')')}, ${T('B(' + v.be + ',\\ ' + v.g(v.be) + ')')}. 가로로 ${T(v.d)}만큼 가면 직선의 기울기 ${T(v.m)} 때문에 세로로 ${T('|' + v.m + '|\\times' + v.d + '=' + Math.abs(v.m) * v.d)}만큼 오르내립니다 ⇒ 직각삼각형(밑변 ${T(v.d)}, 높이 ${T(Math.abs(v.m) * v.d)}).`,
      `피타고라스 정리로 ${T('\\overline{AB}=\\sqrt{' + v.d + '^2+' + Math.abs(v.m) * v.d + '^2}=' + v.d + '\\sqrt{1+' + v.m * v.m + '}=' + v.tex)}.`
    ],
    quick: (v) => ({
      steps: `두 교점의 가로 거리는 ${T('f-g')}의 두 근의 차 ${T(v.be + '-(' + v.al + ')=' + v.d)}. 직선의 기울기가 ${T(v.m)}이므로 가로 ${T('1')}에 세로 ${T('|' + v.m + '|')}인 기울기 삼각형을 ${T(v.d)}배 키운 직각삼각형이 생깁니다. 빗변 ${T('=\\overline{AB}')}이므로<br>${T('\\overline{AB}=' + v.d + '\\times\\sqrt{1+' + v.m * v.m + '}=' + v.tex)}.`,
      highlight: `💡 서술형 문장: "두 점 A, B의 ${T('x')}좌표의 차가 ${T(v.d)}이고 직선의 기울기가 ${T(v.m)}이므로 ${T('\\overline{AB}=\\sqrt{1+(' + v.m + ')^2}\\,|\\beta-\\alpha|=' + v.tex)}이다."`
    }),
    std: (v) => ({
      steps: `① 근의 좌표: ${T(polyTex(v.A, v.B - v.m, v.C - v.n) + '=0')} ⇒ ${T('x=' + v.al + ',\\ ' + v.be)}.<br>② 두 점의 좌표 ${T('A(' + v.al + ',\\ ' + v.g(v.al) + ')')}, ${T('B(' + v.be + ',\\ ' + v.g(v.be) + ')')}를 구합니다.<br>③ 두 점 사이의 거리 공식 ${T('\\sqrt{(' + v.be + '-' + par(v.al) + ')^2+(' + v.g(v.be) + '-' + par(v.g(v.al)) + ')^2}=' + v.tex)}.`,
      warning: `⚠️ 두 점의 ${T('y')}좌표를 따로 구하지 않아도 됩니다. 기울기 삼각형(가로 : 세로 = ${T('1:|m|')})만 알면 길이가 나옵니다.`
    }),
    box: (v) => autoBox(v.al - 3, v.be + 3, [v.g(v.al), v.g(v.be), vy(v.A, v.B, v.C), vy(v.a, -v.a * (v.al + v.be), v.a * v.al * v.be)], 1.5),
    draw: (b, s, v, c) => {
      b.plot(v.g, { color: 'rose', width: 3.2, glow: true });
      b.plot(v.f, { color: 'sky', width: 3.6, glow: true });
      corner(b, c.box, '직선 y = ' + (v.m === 1 ? '' : v.m === -1 ? '−' : lbl(v.m)) + 'x' + (v.n < 0 ? ' − ' + Math.abs(v.n) : v.n > 0 ? ' + ' + v.n : ''), { color: 'rose' }, v.m > 0 ? 1 : -1);
      const co = c.st(1);
      const A = [v.al, v.g(v.al)], B = [v.be, v.g(v.be)];
      if (co) { [v.al, v.be].forEach((x) => b.seg([x, v.g(x)], [x, 0], { color: 'muted', width: 1.4, dash: [3, 4] })); b.plot((x) => v.f(x) - v.g(x), { color: 'amber', width: 2.4, dash: [6, 5], alpha: 0.9 }); }
      dot(b, A, 'ink', co ? `A (${lbl(v.al)}, ${lbl(A[1])})` : 'A', -10, A[1] > 0 ? 18 : -14, { align: 'right', hollow: true, size: 14 });
      dot(b, B, 'ink', co ? `B (${lbl(v.be)}, ${lbl(B[1])})` : 'B', 10, B[1] > 0 ? -14 : 18, { hollow: true, size: 14 });
      if (c.st(2)) {
        const C = [v.be, A[1]];
        b.poly([A, B, C], { fill: 'green', fillAlpha: 0.16, color: 'green', width: 2.4 });
        b.text([(A[0] + C[0]) / 2, A[1] + (v.m > 0 ? -0.2 : 0.2)], String(v.d), { color: 'green', size: 13, weight: 800, dy: v.m > 0 ? 15 : -8 });
        b.text([C[0], (C[1] + B[1]) / 2], String(Math.abs(v.m) * v.d), { color: 'green', size: 13, weight: 800, dx: 14 });
      }
    }
  });

  /* ======================================================================
     1-D  minDistMaxArea · AB 와 평행한 접선으로 삼각형 PAB 의 최대 넓이
     최대 넓이 = |a|d³/8  (d = β−α)   [핵심]
     ====================================================================== */
  const P4 = [
    { a: 1, al: -1, be: 3, m: 1, n: 1 }, { a: 1, al: -2, be: 2, m: 2, n: 0 }, { a: 2, al: -1, be: 1, m: 1, n: 2 },
    { a: -1, al: -3, be: 1, m: 1, n: 2 }, { a: 1, al: -3, be: 3, m: -1, n: 3 }, { a: 2, al: 0, be: 4, m: 1, n: -1 },
    { a: 1, al: 0, be: 2, m: 2, n: 1 }, { a: -2, al: -2, be: 2, m: 1, n: 3 }
  ];
  const var4 = varier(P4, (c, i) => {
    const d = c.be - c.al, mid = (c.al + c.be) / 2;
    const A = c.a, B = c.m - c.a * (c.al + c.be), C = c.n + c.a * c.al * c.be;
    const f = (x) => A * x * x + B * x + C, g = (x) => c.m * x + c.n, h = (x) => c.a * (x - c.al) * (x - c.be);
    const gap = Math.abs(c.a) * d * d / 4, val = Math.abs(c.a) * d * d * d / 8;
    return { ...c, key: 'd4_' + i, d, mid, A, B, C, f, g, h, gap, val, px: c.al + d / 4 };
  });
  add('minDistMaxArea', {
    fast: '핵심', vary: var4,
    tag: '25 매산고 기출 유형 · 2024학년도 9월 학평(인천) 유형 (곡선 위의 점과 현이 만드는 삼각형의 넓이)', time: '목표 시간: 50초',
    text: (v) => `이차함수 ${T('f(x)=' + polyTex(v.A, v.B, v.C))}의 그래프와 직선 ${T('y=' + linTex(v.m, v.n))}이 만나는 두 점을 A, B라 하자. 점 P가 곡선 ${T('y=f(x)')} 위에서 두 점 A, B 사이를 움직일 때, 삼각형 PAB의 넓이의 최댓값을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `${T('f-g=0')}의 근을 그림(직선을 ${T('x')}축으로 내려 ${T('x')}절편)에서 읽으면 ${T('x=' + v.al + ',\\ ' + v.be)}. 밑변 AB는 고정이므로 <strong>점 P가 AB에서 가장 멀 때</strong>(AB와 평행한 접선의 접점)가 넓이 최대입니다.`,
      `포물선에서 AB와 평행한 접선의 접점은 두 교점의 한가운데입니다: ${T('x=\\dfrac{' + v.al + '+' + par(v.be) + '}{2}=' + v.mid)}. 이때 세로 길이 ${T('|f-g|=|' + v.a + '|\\cdot' + (v.mid - v.al) + '\\cdot' + (v.be - v.mid) + '=' + v.gap)}.`,
      `삼각형의 넓이는 (세로 길이) × (가로 폭) ÷ 2 입니다: ${T('\\dfrac12\\times' + v.gap + '\\times' + v.d + '=' + v.val)}.`
    ],
    quick: (v) => ({
      steps: `점 P를 곡선 위에서 움직일 때 높이가 가장 큰 곳은 AB와 평행한 접선이 닿는 점, 곧 두 교점의 한가운데 ${T('x=' + v.mid)}입니다(포물선은 ${T('x=' + v.mid)}에 대해 ${T('h=f-g')}가 대칭). 그곳에서 직선과의 세로 길이는 ${T('|h(' + v.mid + ')|=' + v.gap)}. 세로로 자른 삼각형의 넓이는 ${T('\\dfrac12\\times(\\text{세로 길이})\\times(\\text{가로 폭 }' + v.d + ')')}이므로<br>${T('S=\\dfrac12\\times' + v.gap + '\\times' + v.d + '=' + v.val)}.`,
      highlight: `💡 서술형 문장: "삼각형 PAB의 넓이는 ${T('\\dfrac12\\times\\overline{PQ}\\times|x_B-x_A|')}(PQ는 P에서 AB로 내린 세로 길이)이고, PQ는 ${T('x=\\dfrac{\\alpha+\\beta}{2}')}일 때 최대이다."`
    }),
    std: (v) => ({
      steps: `① ${T('P(x,\\ f(x))')}와 직선 ${T('y=' + linTex(v.m, v.n))} 사이의 거리를 점과 직선 사이의 거리 공식으로 구합니다.<br>② ${T('\\overline{AB}=' + v.d + '\\sqrt{' + (1 + v.m * v.m) + '}')}.<br>③ ${T('S(x)=\\dfrac12\\cdot\\overline{AB}\\cdot\\dfrac{|f(x)-g(x)|}{\\sqrt{' + (1 + v.m * v.m) + '}}=\\dfrac12\\cdot' + v.d + '\\cdot|a|(x-' + par(v.al) + ')(' + v.be + '-x)')} 이고 ${T('x=' + v.mid)}에서 최대 ${T(v.val)}.`,
      warning: `⚠️ 거리 공식의 ${T('\\sqrt{1+m^2}')}는 ${T('\\overline{AB}')}의 ${T('\\sqrt{1+m^2}')}와 약분되어 사라집니다. 처음부터 세로 길이로 보면 계산이 한 번에 끝납니다.`
    }),
    box: (v) => autoBox(v.al - 2.8, v.be + 2.8, [v.g(v.al), v.g(v.be), v.f(v.mid), vy(v.A, v.B, v.C)], 1.5),
    draw: (b, s, v, c) => {
      b.plot(v.g, { color: 'rose', width: 3.2, glow: true });
      b.plot(v.f, { color: 'sky', width: 3.6, glow: true });
      const A = [v.al, v.g(v.al)], B = [v.be, v.g(v.be)];
      const P = c.st(2) ? [v.mid, v.f(v.mid)] : [v.px, v.f(v.px)];
      b.poly([A, B, P], { fill: 'green', fillAlpha: 0.14, color: 'green', width: 2.2 });
      dot(b, A, 'ink', 'A', -10, A[1] > 0 ? 18 : -14, { align: 'right', hollow: true, size: 14 });
      dot(b, B, 'ink', 'B', 10, B[1] > 0 ? -14 : 18, { hollow: true, size: 14 });
      dot(b, P, 'violet', 'P', 10, v.a > 0 ? 20 : -14, { size: 14, r: 5.5 });
      if (c.st(1)) {
        b.line(P, v.m, { color: 'amber', width: 2.2, dash: [6, 5] });
        b.vline(v.mid, { color: 'muted', width: 1.3, dash: [4, 5], alpha: 0.7 });
      }
      if (c.st(2)) {
        const Q = [v.mid, v.g(v.mid)];
        b.seg(Q, P, { color: 'green', width: 3.2 });
        dot(b, Q, 'green', '', 0, 0, { r: 4.5 });
        b.text([v.mid, (Q[1] + P[1]) / 2], '세로 ' + v.gap, { color: 'green', size: 13, weight: 800, dx: 40 });
      }
    }
  });

  /* ======================================================================
     1-E  symmetryRootSum · 같은 높이의 두 점 → 대칭축 → 꼭짓점
     f(α)=f(β), f(t)=v ⇒ 꼭짓점의 y좌표 q = v − a(t−p)²   [핵심]
     ====================================================================== */
  const P5 = [
    { a: 1, al: -1, be: 5, t: 0, v: -3 }, { a: 1, al: -3, be: 1, t: 0, v: 2 }, { a: 2, al: 0, be: 4, t: 3, v: 5 },
    { a: 1, al: -2, be: 6, t: -1, v: 4 }, { a: 1, al: 1, be: 5, t: 0, v: 6 }, { a: -1, al: -1, be: 3, t: 2, v: 1 },
    { a: 2, al: -2, be: 2, t: 1, v: -1 }, { a: 1, al: 0, be: 6, t: 1, v: -4 }
  ];
  const var5 = varier(P5, (c, i) => {
    const p = (c.al + c.be) / 2, q = c.v - c.a * (c.t - p) ** 2;
    const f = (x) => c.a * (x - p) ** 2 + q;
    const bb = -2 * c.a * p, cc = c.v - c.a * c.t * c.t - bb * c.t;
    return { ...c, key: 'd5_' + i, p, q, f, bb, cc, val: q, hv: f(c.al) };
  });
  add('symmetryRootSum', {
    fast: '핵심', vary: var5,
    tag: '26 제일고 기출 유형 · 2021학년도 3월 학평(서울) 유형 (같은 높이의 두 점과 대칭축)', time: '목표 시간: 40초',
    text: (v) => `이차함수 ${T('y=f(x)')}의 이차항의 계수가 ${T(v.a)}이고 ${T('f(' + v.al + ')=f(' + v.be + ')')}, ${T('f(' + v.t + ')=' + v.v)}이다. 이 함수의 그래프의 꼭짓점의 ${T('y')}좌표를 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `${T('f(' + v.al + ')=f(' + v.be + ')')}이면 두 점의 높이가 같으므로 두 점은 대칭축에 대해 대칭입니다. 대칭축은 두 점의 한가운데 ${T('x=\\dfrac{' + v.al + '+' + par(v.be) + '}{2}=' + v.p)}.`,
      `꼭짓점은 대칭축 위에 있으므로 ${T('f(x)=' + (v.a === 1 ? '' : v.a === -1 ? '-' : v.a) + '(' + xm(v.p) + ')^2+q')}로 놓을 수 있습니다. 꼭짓점의 ${T('y')}좌표가 ${T('q')}입니다.`,
      `그림의 점 ${T('(' + v.t + ',\\ ' + v.v + ')')}가 곡선 위에 있으므로 ${T(v.v + '=' + v.a + '(' + v.t + '-' + par(v.p) + ')^2+q')} ⇒ ${T('q=' + v.v + '-' + par(v.a * (v.t - v.p) ** 2) + '=' + v.q)}.`
    ],
    quick: (v) => ({
      steps: `높이가 같은 두 점 ${T('x=' + v.al)}, ${T('x=' + v.be)}의 한가운데가 대칭축 ${T('x=' + v.p)}입니다. 점 ${T('(' + v.t + ',\\ ' + v.v + ')')}는 축에서 ${T(Math.abs(v.t - v.p))}만큼 떨어져 있고, 꼭짓점에서 가로로 ${T(Math.abs(v.t - v.p))} 떨어진 곳의 높이 차는 ${T('|a|\\times' + Math.abs(v.t - v.p) + '^2=' + Math.abs(v.a) * (v.t - v.p) ** 2)}. ${v.a > 0 ? '아래로 볼록한 포물선이므로 꼭짓점이 가장 낮아' : '위로 볼록한 포물선이므로 꼭짓점이 가장 높아'} ${T('q=' + v.v + (v.a > 0 ? '-' : '+') + Math.abs(v.a) * (v.t - v.p) ** 2 + '=' + v.q)}.`,
      highlight: `💡 서술형 문장: "${T('f(' + v.al + ')=f(' + v.be + ')')}이므로 이 그래프의 대칭축은 ${T('x=' + v.p)}이다. 따라서 ${T('f(x)=' + (v.a === 1 ? '' : v.a === -1 ? '-' : v.a) + '(' + xm(v.p) + ')^2+q')}로 놓을 수 있다."`
    }),
    std: (v) => ({
      steps: `① ${T('f(x)=' + v.a + 'x^2+bx+c')}로 놓고 ${T('f(' + v.al + ')=f(' + v.be + ')')}를 쓰면 ${T('b=' + v.bb)}.<br>② ${T('f(' + v.t + ')=' + v.v)}에 대입하면 ${T('c=' + v.cc)}.<br>③ ${T('f(x)=' + polyTex(v.a, v.bb, v.cc))}을 완전제곱식으로 고쳐 꼭짓점의 ${T('y')}좌표 ${T('q=' + v.q)}를 얻습니다.`,
      warning: `⚠️ 미지수 ${T('b,\\ c')}를 모두 구한 뒤 다시 꼭짓점을 계산해야 합니다. 대칭축을 먼저 읽으면 미지수가 ${T('q')} 하나로 줄어듭니다.`
    }),
    box: (v) => autoBox(Math.min(v.al, v.t) - 3, Math.max(v.be, v.t) + 3, [v.q, v.hv, v.v], 1.8),
    draw: (b, s, v, c) => {
      b.plot(v.f, { color: 'sky', width: 3.6, glow: true });
      b.seg([v.al, v.hv], [v.be, v.hv], { color: 'muted', width: 2, dash: [5, 5] });
      dot(b, [v.al, v.hv], 'violet', `x=${lbl(v.al)}`, -10, -14, { align: 'right', hollow: true, size: 14 });
      dot(b, [v.be, v.hv], 'violet', `x=${lbl(v.be)}`, 10, -14, { hollow: true, size: 14 });
      dot(b, [v.t, v.v], 'rose', `(${lbl(v.t)}, ${lbl(v.v)})`, v.t < v.p ? -10 : 10, v.v > v.q ? -14 : 20, { align: v.t < v.p ? 'right' : 'left', size: 14, r: 5.5 });
      if (c.st(1)) { b.vline(v.p, { color: 'amber', width: 2, dash: [6, 5] }); b.text([v.p, v.hv], 'x = ' + lbl(v.p), { color: 'amber', size: 13, weight: 800, dy: -14 }); }
      if (c.st(3)) dot(b, [v.p, v.q], 'green', `꼭짓점 (${lbl(v.p)}, ${lbl(v.q)})`, 12, v.a > 0 ? 18 : -14, { r: 6 });
      else if (c.st(2)) b.point([v.p, v.q], { color: 'green', r: 5.5 });
    }
  });

  /* ---------- 탐구관 2 공통: p 가 들어 있는 식 a(x−p)²+q 의 전개 글자 ---------- */
  const fexpP = (a, q) => `${coef(a)}x^2-${2 * a === 1 ? '' : 2 * a}px+${coef(a)}p^2${q === 0 ? '' : sgn(q)}`;
  const band = (b, lo, hi, y0, y1) => {
    b.poly([[lo, y0], [hi, y0], [hi, y1], [lo, y1]], { fill: 'green', fillAlpha: 0.1, color: null });
    b.vline(lo, { color: 'green', width: 1.8, dash: [6, 4], alpha: 0.8 });
    b.vline(hi, { color: 'green', width: 1.8, dash: [6, 4], alpha: 0.8 });
  };

  /* ======================================================================
     2-A  movingAxisMin · 꼭짓점이 수평선 위를 움직일 때 구간의 최솟값 = M
     f(x)=a(x−p)²+q, 구간 [lo,hi], 최솟값 M>q ⇒ 축은 구간 밖, 끝점까지 거리 d=√((M−q)/a)   [핵심]
     ====================================================================== */
  const P6 = [
    { a: 1, q: 1, lo: 0, hi: 3, d: 2 }, { a: 1, q: -2, lo: 0, hi: 2, d: 1 }, { a: 2, q: 1, lo: 1, hi: 3, d: 1 }, { a: 1, q: 0, lo: -1, hi: 2, d: 2 },
    { a: 2, q: -3, lo: 0, hi: 4, d: 1 }, { a: 1, q: 2, lo: -2, hi: 1, d: 3 }, { a: 3, q: 1, lo: 0, hi: 2, d: 1 }, { a: 1, q: -1, lo: 1, hi: 4, d: 2 }
  ].flatMap((c) => [{ ...c, ask: 'S' }, { ...c, ask: 'P' }]);
  const var6 = varier(P6, (c, i) => {
    const M = c.q + c.a * c.d * c.d, p1 = c.lo - c.d, p2 = c.hi + c.d;
    const val = c.ask === 'S' ? p1 + p2 : p1 * p2;
    const mk = (pp) => (x) => c.a * (x - pp) ** 2 + c.q;
    return { ...c, key: 'm6_' + i, M, p1, p2, val, mk, ps: (c.lo + c.hi) / 2 };
  }, (x, y) => x.ask === y.ask && x.lo === y.lo && x.hi === y.hi && x.a === y.a);
  add('movingAxisMin', {
    fast: '핵심', vary: var6,
    tag: '26 매산고 기출 유형 · 2022학년도 11월 학평(경기) 유형 (구간과 움직이는 대칭축)', time: '목표 시간: 60초',
    text: (v) => `${T(v.lo + '\\le x\\le ' + v.hi)}에서 이차함수 ${T('f(x)=' + fexpP(v.a, v.q))}의 최솟값이 ${T(v.M)}이 되도록 하는 모든 실수 ${T('p')}의 값의 ${v.ask === 'S' ? '합' : '곱'}을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `${T('f(x)=' + coef(v.a) + '(x-p)^2' + (v.q === 0 ? '' : sgn(v.q)))}이므로 꼭짓점 ${T('(p,\\ ' + v.q + ')')}는 수평선 ${T('y=' + v.q)} 위를 좌우로 움직입니다(점선). 대칭축이 구간 안에 있으면 최솟값은 꼭짓점의 높이 ${T(v.q)}인데 구하는 최솟값은 ${T(v.M)}${T('\\gt ' + v.q)}이므로 <strong>축은 구간 밖</strong>에 있어야 합니다.`,
      `축이 구간 밖이면 최솟값은 축에 가까운 쪽 끝점에서 생깁니다. 그 끝점의 높이가 ${T(v.M)}: 왼쪽 밖이면 ${T('f(' + v.lo + ')=' + v.M)}, 오른쪽 밖이면 ${T('f(' + v.hi + ')=' + v.M)} (초록 포물선 두 개).`,
      `꼭짓점에서 높이가 ${T(v.M - v.q)}만큼 올라오는 가로 거리는 ${T('d=\\sqrt{\\dfrac{' + (v.M - v.q) + '}{' + v.a + '}}=' + v.d)}. 따라서 ${T('p=' + v.lo + '-' + v.d + '=' + v.p1)} 또는 ${T('p=' + v.hi + '+' + v.d + '=' + v.p2)}. ${v.ask === 'S' ? '합' : '곱'} ${T(v.ask === 'S' ? v.p1 + '+' + par(v.p2) + '=' + v.val : par(v.p1) + '\\times' + par(v.p2) + '=' + v.val)}.`
    ],
    quick: (v) => ({
      steps: `꼭짓점은 높이 ${T(v.q)}의 수평선 위를 움직이고, 그 높이에서 ${T(v.M)}까지 오르려면 축에서 가로로 ${T('\\sqrt{(' + v.M + '-' + par(v.q) + ')/' + v.a + '}=' + v.d)} 떨어진 곳이어야 합니다. 구간 끝점 ${T('x=' + v.lo)}, ${T('x=' + v.hi)}에서 축까지 ${T(v.d)}이므로 ${T('p=' + v.lo + '-' + v.d + '=' + v.p1)}, ${T('p=' + v.hi + '+' + v.d + '=' + v.p2)}. ${v.ask === 'S' ? '합' : '곱'}은 ${T(v.val)}.`,
      highlight: `💡 서술형 문장: "최솟값 ${T(v.M)}이 꼭짓점의 ${T('y')}좌표 ${T(v.q)}보다 크므로 대칭축 ${T('x=p')}는 구간 밖에 있고, 최솟값은 구간의 끝점에서 나타난다."`
    }),
    std: (v) => ({
      steps: `${T('p\\lt ' + v.lo)}일 때 최솟값 ${T('f(' + v.lo + ')=' + v.a + '(' + v.lo + '-p)^2' + sgn(v.q) + '=' + v.M)} ⇒ ${T('p=' + v.p1)}.<br>${T(v.lo + '\\le p\\le ' + v.hi)}일 때 최솟값은 ${T('f(p)=' + v.q)}로 ${T(v.M)}이 될 수 없습니다.<br>${T('p\\gt ' + v.hi)}일 때 ${T('f(' + v.hi + ')=' + v.M)} ⇒ ${T('p=' + v.p2)}.`,
      warning: `⚠️ 축이 구간 안에 있는 경우를 빠뜨리지 말고 "${T('q\\ne M')}이므로 불가능"까지 확인해야 합니다. 그림에서는 수평선 ${T('y=' + v.q)}를 보면 바로 알 수 있습니다.`
    }),
    box: (v) => autoBox(v.p1 - 2.4, v.p2 + 2.4, [v.q, v.M], 1.6),
    draw: (b, s, v, c) => {
      band(b, v.lo, v.hi, v.q - 1.6, v.M + 1.6);
      b.hline(v.q, { color: 'amber', width: 1.8, dash: [4, 5], alpha: 0.9 });
      b.text([c.box.x[1] - 0.2, v.q], 'y = ' + lbl(v.q), { color: 'amber', size: 13, weight: 800, dy: -12, align: 'right' });
      b.hline(v.M, { color: 'rose', width: 2, dash: [6, 5], alpha: 0.9 });
      b.text([c.box.x[1] - 0.2, v.M], '최솟값 ' + lbl(v.M), { color: 'rose', size: 13, weight: 800, dy: -12, align: 'right' });
      const f0 = v.mk(v.ps);
      b.plot(f0, { color: 'sky', width: 3.4, glow: true, alpha: c.st(2) ? 0.3 : 1 });
      dot(b, [v.ps, v.q], 'sky', '꼭짓점 (p, ' + lbl(v.q) + ')', 0, 20, { r: 5.5, align: 'center' });
      if (c.st(2)) {
        [[v.p1, v.lo], [v.p2, v.hi]].forEach(([pp, xe]) => {
          b.plot(v.mk(pp), { color: 'green', width: 3.2 });
          dot(b, [xe, v.M], 'green', '', 0, 0, { r: 6 });
          dot(b, [pp, v.q], 'green', c.st(3) ? 'p = ' + lbl(pp) : '', 0, 20, { r: 4.5, align: 'center' });
        });
      }
    }
  });

  /* ======================================================================
     2-B  movingAxisMaxJump · 구간의 중점에 축이 올 때 최댓값(최솟값)이 가장 좋아진다
     a>0: M(p)=max 의 최솟값 = q + a(L/2)²,  a<0: m(p)=min 의 최댓값 = q − |a|(L/2)²   [핵심]
     ====================================================================== */
  const P7 = [
    { a: 1, q: 1, lo: 0, hi: 4 }, { a: 2, q: -1, lo: 0, hi: 2 }, { a: 1, q: 0, lo: -1, hi: 3 }, { a: 3, q: 2, lo: 1, hi: 3 },
    { a: -1, q: 3, lo: 0, hi: 4 }, { a: -2, q: 5, lo: -1, hi: 1 }, { a: 1, q: -3, lo: 2, hi: 6 }, { a: -1, q: 2, lo: -2, hi: 2 }
  ];
  const var7 = varier(P7, (c, i) => {
    const L = c.hi - c.lo, mid = (c.lo + c.hi) / 2, h = Math.abs(c.a) * (L / 2) ** 2;
    const val = c.a > 0 ? c.q + h : c.q - h;
    const mk = (pp) => (x) => c.a * (x - pp) ** 2 + c.q;
    return { ...c, key: 'm7_' + i, L, mid, h, val, mk, ps: c.lo + L / 4 };
  });
  add('movingAxisMaxJump', {
    fast: '핵심', vary: var7,
    tag: '25 매산고 기출 유형 · 2020학년도 6월 학평(부산) 유형 (최댓값이 바뀌는 경계)', time: '목표 시간: 50초',
    text: (v) => `${T(v.lo + '\\le x\\le ' + v.hi)}에서 이차함수 ${T('f(x)=' + fexpP(v.a, v.q))}의 ${v.a > 0 ? '최댓값을 ' + T('M(p)') + '라 할 때, ' + T('M(p)') + '의 최솟값' : '최솟값을 ' + T('m(p)') + '라 할 때, ' + T('m(p)') + '의 최댓값'}을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `꼭짓점 ${T('(p,\\ ' + v.q + ')')}는 수평선 ${T('y=' + v.q)} 위를 움직입니다. ${v.a > 0 ? '아래로 볼록한 포물선의 구간에서의 최댓값은 두 끝점 중 <strong>축에서 먼 쪽</strong>의 높이입니다(그림의 점선 포물선은 오른쪽 끝이 더 멉니다).' : '위로 볼록한 포물선의 구간에서의 최솟값은 두 끝점 중 <strong>축에서 먼 쪽</strong>의 높이입니다.'}`,
      `먼 쪽 끝점의 높이가 가장 ${v.a > 0 ? '낮아' : '높아'}지는 때는 양 끝이 축에서 같은 거리, 곧 <strong>축이 구간의 한가운데</strong> ${T('p=\\dfrac{' + v.lo + '+' + par(v.hi) + '}{2}=' + v.mid)}일 때입니다.`,
      `그때 끝점은 축에서 ${T('\\dfrac{L}{2}=' + v.L / 2)} 떨어져 있어 높이는 ${T('q' + (v.a > 0 ? '+' : '-') + '|a|\\left(\\dfrac L2\\right)^2=' + v.q + (v.a > 0 ? '+' : '-') + v.h + '=' + v.val)}.`
    ],
    quick: (v) => ({
      steps: `꼭짓점은 높이 ${T(v.q)}의 수평선 위를 좌우로 움직이고, 구간 ${T('[' + v.lo + ',\\ ' + v.hi + ']')}의 ${v.a > 0 ? '최댓값은 축에서 먼 끝점' : '최솟값은 축에서 먼 끝점'}에서 생깁니다. 두 끝점이 축에서 같은 거리(구간 길이의 반 ${T(v.L / 2)})일 때 ${v.a > 0 ? '최댓값이 가장 작아' : '최솟값이 가장 커'}지므로 ${T(v.q + (v.a > 0 ? '+' : '-') + Math.abs(v.a) + '\\times' + (v.L / 2) + '^2=' + v.val)}.`,
      highlight: `💡 서술형 문장: "${v.a > 0 ? 'M(p)' : 'm(p)'}는 ${T('f(' + v.lo + ')')}, ${T('f(' + v.hi + ')')} 중 하나이고, 두 값이 같아지는 ${T('p=' + v.mid)}(구간의 중점)에서 ${v.a > 0 ? '최소' : '최대'}이다."`
    }),
    std: (v) => ({
      steps: `${T('f(' + v.lo + ')=' + v.a + '(' + v.lo + '-p)^2' + sgn(v.q))}와 ${T('f(' + v.hi + ')=' + v.a + '(' + v.hi + '-p)^2' + sgn(v.q))}를 비교해 ${T('p')}에 따라 ${v.a > 0 ? '큰' : '작은'} 쪽을 ${T('p\\lt ' + v.mid + '\\ \\text{와}\\ p\\ge ' + v.mid)}로 나누어 ${v.a > 0 ? 'M(p)' : 'm(p)'}를 구한 뒤, 그 최${v.a > 0 ? '솟' : '댓'}값 ${T(v.val)}을 찾습니다.`,
      warning: `⚠️ 두 끝점의 높이를 모두 ${T('p')}의 식으로 쓰고 비교하는 길이 필요한 풀이입니다. 그림에서 "축에서 먼 끝점"을 먼저 읽으면 비교가 생략됩니다.`
    }),
    box: (v) => autoBox(v.lo - 3.2, v.hi + 3.2, [v.q, v.val, v.mk(v.ps)(v.hi), v.mk(v.mid)(v.lo)], 1.5),
    draw: (b, s, v, c) => {
      const lo = v.lo, hi = v.hi;
      band(b, lo, hi, v.q - 6, v.q + 8);
      b.hline(v.q, { color: 'amber', width: 1.8, dash: [4, 5], alpha: 0.9 });
      b.text([c.box.x[1] - 0.2, v.q], 'y = ' + lbl(v.q), { color: 'amber', size: 13, weight: 800, dy: v.a > 0 ? 18 : -12, align: 'right' });
      b.plot(v.mk(v.ps), { color: 'sky', width: 3.4, glow: true, alpha: c.st(2) ? 0.3 : 1 });
      dot(b, [v.ps, v.q], 'sky', '꼭짓점 (p, ' + lbl(v.q) + ')', 0, v.a > 0 ? 20 : -16, { r: 5.5, align: 'center' });
      if (c.st(1) && !c.st(2)) { b.point([hi, v.mk(v.ps)(hi)], { color: 'rose', r: 6 }); b.text([hi, v.mk(v.ps)(hi)], '먼 쪽 끝', { color: 'rose', size: 13, weight: 800, dx: 12, dy: v.a > 0 ? -12 : 18, align: 'left' }); }
      if (c.st(2)) {
        b.vline(v.mid, { color: 'amber', width: 1.8, dash: [6, 5] });
        b.plot(v.mk(v.mid), { color: 'green', width: 3.4, glow: true });
        [lo, hi].forEach((xe) => b.point([xe, v.mk(v.mid)(xe)], { color: 'green', r: 6 }));
        dot(b, [v.mid, v.q], 'green', '', 0, 0, { r: 4.5 });
        b.text([v.mid, v.mk(v.mid)(lo)], c.st(3) ? (v.a > 0 ? '최솟값 ' : '최댓값 ') + lbl(v.val) : '', { color: 'green', size: 13, weight: 800, dy: v.a > 0 ? -16 : 22 });
      }
    }
  });

  /* ======================================================================
     2-C  movingWindowInterval · 구간 [t, t+L] 의 최솟값 g(t)=k 의 근의 합 = 2p−L
     g(t) 의 그래프는 x=p−L/2 에 대칭이다   [핵심]
     ====================================================================== */
  const P8 = [
    { a: 1, q: -1, p: 2, L: 2, d: 2 }, { a: 1, q: 1, p: 1, L: 2, d: 2 }, { a: 2, q: -2, p: 3, L: 2, d: 1 }, { a: 1, q: 0, p: 0, L: 4, d: 2 },
    { a: 1, q: -3, p: 2, L: 4, d: 2 }, { a: 3, q: 1, p: -1, L: 2, d: 1 }, { a: 1, q: 2, p: 3, L: 2, d: 1 }, { a: 2, q: 0, p: 1, L: 2, d: 2 }
  ];
  const var8 = varier(P8, (c, i) => {
    const k = c.q + c.a * c.d * c.d, f = (x) => c.a * (x - c.p) ** 2 + c.q;
    const g = (t) => (t + c.L < c.p ? f(t + c.L) : t > c.p ? f(t) : c.q);
    const t1 = c.p - c.L - c.d, t2 = c.p + c.d, cen = c.p - c.L / 2;
    return { ...c, key: 'm8_' + i, k, f, g, t1, t2, cen, val: t1 + t2 };
  });
  add('movingWindowInterval', {
    fast: '핵심', vary: var8,
    tag: '24 매산고 기출 유형 · 2025학년도 6월 학평(부산) 유형 (움직이는 구간과 최솟값 함수)', time: '목표 시간: 60초',
    text: (v) => `이차함수 ${T('f(x)=' + polyTex(...O.H.expand(v.a, v.p, v.q)))}에 대하여 실수 ${T('t')}에 대하여 구간 ${T('[t,\\ t+' + v.L + ']')}에서 ${T('f(x)')}의 최솟값을 ${T('g(t)')}라 하자. 방정식 ${T('g(t)=' + v.k)}의 모든 실근의 합을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `구간 ${T('[t,\\ t+' + v.L + ']')}(초록 띠)가 포물선을 따라 움직입니다. 띠가 꼭짓점 ${T('x=' + v.p)}을 품으면 최솟값은 ${T(v.q)}, 띠가 축의 왼쪽에 있으면 오른쪽 끝 ${T('f(t+' + v.L + ')')}, 오른쪽에 있으면 왼쪽 끝 ${T('f(t)')}입니다. 이 값을 ${T('t')}의 그래프로 그리면 점선 ${T('y=g(t)')}: 왼쪽 가지를 ${T(v.L)}만큼 왼쪽으로 옮기고 사이를 높이 ${T(v.q)}로 잇는 모양입니다.`,
      `수평선 ${T('y=' + v.k)}가 ${T('y=g(t)')}와 만나는 점은 두 개: 왼쪽 가지 위의 점과 오른쪽 가지 위의 점입니다.`,
      `${T('g(t)')}의 그래프는 두 가지 사이 평평한 부분의 한가운데 ${T('t=' + v.cen)}에 대해 대칭이므로 두 근의 합은 ${T('2\\times' + v.cen + '=' + v.val)}.`
    ],
    quick: (v) => ({
      steps: `${T('g(t)')}의 그래프는 ${T('f')}의 왼쪽 가지를 ${T(v.L)}만큼 왼쪽으로 옮기고 평평한 부분을 끼운 모양이라 ${T('t=p-\\dfrac L2=' + v.p + '-' + v.L / 2 + '=' + v.cen)}에 대칭입니다. 높이 ${T(v.k)}의 수평선과 만나는 두 점은 이 축에 대해 대칭이므로 근의 합은 ${T('2\\times' + v.cen + '=' + v.val)}.`,
      highlight: `💡 서술형 문장: "${T('g(t)')}는 ${T('t=' + v.cen)}에 대하여 대칭인 함수이므로 ${T('g(t)=' + v.k)}의 두 근의 합은 ${T('2\\times' + v.cen + '=' + v.val)}이다."`
    }),
    std: (v) => ({
      steps: `${T('t+' + v.L + '\\lt ' + v.p)}일 때 ${T('g(t)=f(t+' + v.L + ')')}, ${T(v.p - v.L + '\\le t\\le ' + v.p)}일 때 ${T('g(t)=' + v.q)}, ${T('t\\gt ' + v.p)}일 때 ${T('g(t)=f(t)')}.<br>${T('f(t+' + v.L + ')=' + v.k)} ⇒ ${T('t=' + v.t1)}, ${T('f(t)=' + v.k)} ⇒ ${T('t=' + v.t2)}. 합 ${T(v.val)}.`,
      warning: `⚠️ 세 경우로 나눠 각각 이차방정식을 풀어야 해서 길어집니다. 대칭만 알아보면 근을 구하지 않고도 합이 나옵니다.`
    }),
    box: (v) => autoBox(v.t1 - 2, v.t2 + 2, [v.q, v.k, v.f(v.t1 + v.L)], 1.6),
    draw: (b, s, v, c) => {
      const t0 = v.p - v.L - 1.4;
      b.plot(v.f, { color: 'sky', width: 3.4, glow: true, alpha: c.st(1) ? 0.4 : 1 });
      b.poly([[t0, v.q - 1.4], [t0 + v.L, v.q - 1.4], [t0 + v.L, v.k + 1.6], [t0, v.k + 1.6]], { fill: 'green', fillAlpha: 0.14, color: null });
      b.vline(t0, { color: 'green', width: 1.8, dash: [6, 4] });
      b.vline(t0 + v.L, { color: 'green', width: 1.8, dash: [6, 4] });
      b.text([t0, v.k + 1.0], 't', { color: 'green', size: 14, weight: 800, dx: -9 });
      b.text([t0 + v.L, v.k + 1.0], 't+' + v.L, { color: 'green', size: 14, weight: 800, dx: 18 });
      b.hline(v.k, { color: 'rose', width: 2, dash: [6, 5], alpha: 0.9 });
      b.text([v.t1 - 1.4, v.k], 'y = ' + lbl(v.k), { color: 'rose', size: 13, weight: 800, dy: -14 });
      if (c.st(1)) b.plot(v.g, { color: 'amber', width: 3.4 });
      if (c.st(2)) [v.t1, v.t2].forEach((x) => b.point([x, v.k], { color: 'green', r: 6 }));
      if (c.st(3)) {
        b.vline(v.cen, { color: 'amber', width: 1.8, dash: [6, 5] });
        b.text([v.cen, v.q - 0.6], 't = ' + lbl(v.cen), { color: 'amber', size: 13, weight: 800, dy: 6 });
      }
    }
  });

  /* ======================================================================
     2-D  substitution2Stage · 치환 t=x²−2x 의 두 단계 범위
     y=(t−m)²+q, t=x²−2x, x 의 범위 → t 의 범위 → y 의 최대·최소의 합   [보통]
     ====================================================================== */
  const WIN = {
    A: { lo: 0, hi: 3, t0: -1, t1: 3 }, B: { lo: 0, hi: 2, t0: -1, t1: 0 }, C: { lo: 2, hi: 3, t0: 0, t1: 3 }, D: { lo: -1, hi: 1, t0: -1, t1: 3 }
  };
  const P9 = [
    { w: 'A', m: 2, q: -1 }, { w: 'A', m: 1, q: 1 }, { w: 'B', m: 1, q: 0 }, { w: 'C', m: 2, q: -2 },
    { w: 'D', m: 2, q: 1 }, { w: 'B', m: 2, q: -1 }, { w: 'C', m: 1, q: -1 }, { w: 'D', m: 1, q: 0 }
  ];
  const X9 = 7.2; // 오른쪽 좌표평면(t, y)의 원점이 놓이는 x
  const var9 = varier(P9, (c, i) => {
    const W = WIN[c.w], F = (t) => (t - c.m) ** 2 + c.q;
    const ys = [F(W.t0), F(W.t1)], inner = W.t0 <= c.m && c.m <= W.t1;
    const ymin = inner ? c.q : Math.min(...ys), ymax = Math.max(...ys);
    return { ...c, key: 'm9_' + i, ...W, F, ymin, ymax, inner, val: ymin + ymax, tm: inner ? c.m : (F(W.t0) < F(W.t1) ? W.t0 : W.t1), tM: F(W.t0) > F(W.t1) ? W.t0 : W.t1 };
  });
  add('substitution2Stage', {
    fast: '보통', vary: var9, noAxes: true,
    tag: '24 매산고 기출 유형 · 2021학년도 9월 학평(인천) 유형 (치환을 이용한 합성함수의 범위)', time: '목표 시간: 70초',
    text: (v) => `${T(v.lo + '\\le x\\le ' + v.hi)}에서 함수 ${T('y=(x^2-2x)^2-' + 2 * v.m + '(x^2-2x)+' + (v.m * v.m + v.q))}의 최댓값을 ${T('M')}, 최솟값을 ${T('m')}이라 할 때, ${T('M+m')}의 값을 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `1단계(왼쪽 그림): ${T('t=x^2-2x=(x-1)^2-1')}로 놓고 ${T(v.lo + '\\le x\\le ' + v.hi)}의 ${T('t')}값 범위를 읽습니다. 그래프의 높이가 ${T(v.t0)}에서 ${T(v.t1)}까지이므로 ${T(v.t0 + '\\le t\\le ' + v.t1)} (초록 선분).`,
      `2단계(오른쪽 그림): ${T('y=t^2-' + 2 * v.m + 't+' + (v.m * v.m + v.q) + '=(t-' + v.m + ')^2' + sgn(v.q))}를 ${T('t')}에 대한 이차함수로 보고, 1단계에서 얻은 범위 ${T(v.t0 + '\\le t\\le ' + v.t1)}만 남깁니다. <strong>t의 범위가 x의 범위와 다르다는 점이 함정</strong>입니다.`,
      `축 ${T('t=' + v.m)}은 범위 ${v.inner ? '안' : '밖'}에 있어 최솟값 ${T('m=' + v.ymin)}(${v.inner ? T('t=' + v.m) : T('t=' + v.tm)}), 최댓값 ${T('M=' + v.ymax)}(${T('t=' + v.tM)}). ${T('M+m=' + v.val)}.`
    ],
    quick: (v) => ({
      steps: `그림 두 장을 잇습니다. 왼쪽에서 ${T('t')}의 범위가 ${T(v.t0 + '\\le t\\le ' + v.t1)}임을 읽고(꼭짓점 높이 ${T(-1)}와 끝점의 높이), 같은 범위를 오른쪽 포물선 ${T('y=(t-' + v.m + ')^2' + sgn(v.q))}의 가로축에 옮겨 가장 낮은 점과 가장 높은 점을 찾습니다. ${T('M=' + v.ymax)}, ${T('m=' + v.ymin)} ⇒ ${T(v.val)}.`,
      highlight: `💡 서술형 문장: "${T('t=x^2-2x')}로 놓으면 ${T(v.lo + '\\le x\\le ' + v.hi)}에서 ${T(v.t0 + '\\le t\\le ' + v.t1)}이므로 ${T('y=(t-' + v.m + ')^2' + sgn(v.q))}의 이 범위에서의 최대·최소를 구한다."`
    }),
    std: (v) => ({
      steps: `① ${T('t=x^2-2x')}의 범위 ${T(v.t0 + '\\le t\\le ' + v.t1)}를 구합니다.<br>② ${T('y=(t-' + v.m + ')^2' + sgn(v.q))}에서 ${T('t=' + v.tM)}일 때 최대 ${T(v.ymax)}, ${v.inner ? T('t=' + v.m) : T('t=' + v.tm)}일 때 최소 ${T(v.ymin)}.<br>③ ${T('M+m=' + v.val)}.`,
      warning: `⚠️ ${T('t')}의 범위를 구하지 않고 ${T('t')}를 모든 실수로 보면 최솟값이 달라질 수 있습니다.`
    }),
    box: (v) => ({ x: [-2.3, X9 + 5.2], y: [-3.6, Math.max(v.ymax, v.t1, 4) + 2.2] }),
    draw: (b, s, v, c) => {
      const ax = (ox, hx, vx, lo, hi) => {
        b.seg([ox + lo, 0], [ox + hi, 0], { color: 'muted', width: 1.6 });
        b.seg([ox, -3], [ox, Math.max(v.ymax, 4) + 1.6], { color: 'muted', width: 1.6 });
        for (let i = Math.ceil(lo); i <= hi; i++) { if (i) b.text([ox + i, 0], String(i).replace('-', '−'), { color: 'muted', size: 12, weight: 700, dy: 14 }); }
        b.text([ox + hi, 0], hx, { color: 'muted', size: 13, weight: 800, dy: -12, dx: -2 });
        b.text([ox, Math.max(v.ymax, 4) + 1.6], vx, { color: 'muted', size: 13, weight: 800, dx: 12, dy: 4 });
      };
      ax(0, 'x', 't', -1.4, 4.4);
      ax(X9, 't', 'y', -1.4, 4.4);
      const tc = (x) => x * x - 2 * x;
      b.poly([[v.lo, -3], [v.hi, -3], [v.hi, v.t1 + 1.8], [v.lo, v.t1 + 1.8]], { fill: 'green', fillAlpha: 0.1, color: null });
      b.vline(v.lo, { color: 'green', width: 1.6, dash: [6, 4] }); b.vline(v.hi, { color: 'green', width: 1.6, dash: [6, 4] });
      b.plot(tc, { from: -1.4, to: 4.4, color: 'sky', width: 2, dash: [5, 5], alpha: 0.5 });
      b.plot(tc, { from: v.lo, to: v.hi, color: 'sky', width: 3.6, glow: true });
      b.text([1, -1], 't = x² − 2x', { color: 'sky', size: 13, weight: 800, dy: 22, align: 'center' });
      b.plot((xp) => v.F(xp - X9), { from: X9 - 1.4, to: X9 + 4.4, color: 'amber', width: 3, alpha: c.st(2) ? 0.4 : 1 });
      b.text([X9 + v.m, v.q], 'y = (t − ' + v.m + ')²' + (v.q ? (v.q < 0 ? ' − ' : ' + ') + Math.abs(v.q) : ''), { color: 'amber', size: 13, weight: 800, dy: v.q < 0 ? 22 : -16, align: 'center' });
      if (c.st(1)) {
        b.seg([0, v.t0], [0, v.t1], { color: 'green', width: 5 });
        b.seg([v.lo, v.t0], [0, v.t0], { color: 'green', width: 1.4, dash: [3, 4] });
        b.seg([v.lo === 0 ? v.hi : v.lo, v.t1], [0, v.t1], { color: 'green', width: 1.4, dash: [3, 4] });
        b.text([0, v.t1], 't ≤ ' + lbl(v.t1), { color: 'green', size: 13, weight: 800, dx: -12, align: 'right', dy: -4 });
        b.text([0, v.t0], lbl(v.t0) + ' ≤ t', { color: 'green', size: 13, weight: 800, dx: -12, align: 'right', dy: v.t0 === 0 ? 36 : 14 });
      }
      if (c.st(2)) {
        b.seg([X9 + v.t0, 0], [X9 + v.t1, 0], { color: 'green', width: 5 });
        b.plot((xp) => v.F(xp - X9), { from: X9 + v.t0, to: X9 + v.t1, color: 'green', width: 4, glow: true });
        [v.t0, v.t1].forEach((tt) => b.vline(X9 + tt, { color: 'green', width: 1.4, dash: [6, 4], alpha: 0.7 }));
      }
      if (c.st(3)) {
        dot(b, [X9 + v.tm, v.ymin], 'violet', 'm = ' + lbl(v.ymin), 0, 62, { r: 6, align: 'center' });
        dot(b, [X9 + v.tM, v.ymax], 'rose', 'M = ' + lbl(v.ymax), v.tM === v.t0 ? -12 : 12, -10, { r: 6, align: v.tM === v.t0 ? 'right' : 'left' });
      }
    }
  });

  /* ======================================================================
     2-E  inscribedRectParabola · 포물선에 내접하는 직사각형의 둘레의 최댓값
     y=−a(x−s)²+k,  반폭 w:  둘레 2(2w+k−aw²) 의 최댓값 = 2k+2/a  (w=1/a)   [보통]
     ====================================================================== */
  const P10 = [
    { a: 1, s: 2, k: 4 }, { a: 1, s: 3, k: 5 }, { a: 1, s: -1, k: 3 }, { a: 2, s: 1, k: 3 },
    { a: 2, s: -1, k: 5 }, { a: 1, s: 2, k: 6 }, { a: 2, s: 3, k: 4 }, { a: 1, s: -2, k: 2 }
  ];
  const var10 = varier(P10, (c, i) => {
    const f = (x) => -c.a * (x - c.s) ** 2 + c.k, wo = 1 / c.a, val = 2 * c.k + 2 / c.a;
    const w0 = Math.min(wo + 0.9, 0.8 * Math.sqrt(c.k / c.a));
    return { ...c, key: 'm10_' + i, f, wo, val, w0, A: -c.a, B: 2 * c.a * c.s, C: c.k - c.a * c.s * c.s };
  });
  const rect = (b, v, w, o) => {
    const h = v.f(v.s + w) ;
    const P = [[v.s - w, 0], [v.s + w, 0], [v.s + w, h], [v.s - w, h]];
    b.poly(P, Object.assign({ fill: 'green', fillAlpha: 0.16, color: 'green', width: 2.6 }, o || {}));
    return P;
  };
  add('inscribedRectParabola', {
    fast: '보통', vary: var10,
    tag: '25 매산고 기출 유형 · 2020학년도 9월 학평(인천) 유형 (포물선에 내접하는 직사각형)', time: '목표 시간: 60초',
    text: (v) => `이차함수 ${T('y=' + polyTex(v.A, v.B, v.C))}의 그래프와 ${T('x')}축으로 둘러싸인 부분에 그림과 같이 직사각형 ABCD를 그린다. 변 AB는 ${T('x')}축 위에 있고 꼭짓점 C, D는 곡선 위에 있을 때, 직사각형의 둘레의 길이의 최댓값을 구하시오.`,
    ans: (v) => v.a === 1 ? String(v.val) : String(v.val),
    steps: (v) => [
      `포물선의 대칭축 ${T('x=' + v.s)}를 기준으로 직사각형은 좌우 대칭입니다. 축에서 각 변까지의 거리(반폭)를 ${T('w')}라 하면 가로 ${T('\\overline{AB}=2w')}, 세로 ${T('\\overline{BC}=-' + (v.a === 1 ? '' : v.a) + 'w^2+' + v.k + '=' + v.k + '-' + (v.a === 1 ? '' : v.a) + 'w^2')}입니다(꼭짓점의 높이 ${T(v.k)}에서 ${T(v.a + 'w^2')}만큼 내려옴).`,
      `둘레 ${T('l=2(2w+' + v.k + '-' + (v.a === 1 ? '' : v.a) + 'w^2)=-' + 2 * v.a + 'w^2+4w+' + 2 * v.k)}는 ${T('w')}에 대한 이차식이므로 꼭짓점의 ${T('w=\\dfrac{4}{2\\cdot' + 2 * v.a + '}=' + frTex(1, v.a) + '')}에서 최대입니다.`,
      `${T('w=' + frTex(1, v.a))}일 때 ${T('l=' + v.val)}. (이때 ${T('w\\le\\sqrt{\\frac{' + v.k + '}{' + v.a + '}}')}도 만족합니다.)`
    ],
    quick: (v) => ({
      steps: `직사각형은 대칭축에 대해 대칭이므로 축에서 변까지 거리 ${T('w')} 하나로 가로 ${T('2w')}, 세로 ${T(v.k + '-' + (v.a === 1 ? '' : v.a) + 'w^2')}가 정해집니다. 둘레 ${T('l(w)=-' + 2 * v.a + 'w^2+4w+' + 2 * v.k)}의 꼭짓점이 ${T('w=' + frTex(1, v.a))}이므로 최댓값은 ${T('l=' + v.val)}.`,
      highlight: `💡 서술형 문장: "직사각형은 대칭축 ${T('x=' + v.s)}에 대하여 대칭이므로 ${T('A(' + v.s + '-w,\\ 0)')}, ${T('B(' + v.s + '+w,\\ 0)')}으로 놓을 수 있다."`
    }),
    std: (v) => ({
      steps: `점 ${T('B(m,\\ 0)')}로 놓고 ${T('A')}, ${T('C')}, ${T('D')}의 좌표를 각각 ${T('m')}의 식으로 쓴 뒤 둘레를 ${T('m')}에 대한 이차식으로 세워 최대를 구합니다. 대칭축 ${T('x=' + v.s)}를 쓰지 않으면 ${T('A')}의 ${T('x')}좌표를 따로 ${T(v.s * 2 + '-m')}로 구해야 해서 식이 길어집니다.`,
      warning: `⚠️ 이 문제에서 최대가 되는 직사각형이 곡선 안에 들어가는지(${T('w\\le\\sqrt{\\frac{k}{a}}')}) 확인하는 것을 잊지 마세요.`
    }),
    box: (v) => autoBox(v.s - Math.sqrt(v.k / v.a) - 1.8, v.s + Math.sqrt(v.k / v.a) + 1.8, [v.k], 1.5),
    draw: (b, s, v, c) => {
      b.plot(v.f, { from: v.s - Math.sqrt(v.k / v.a), to: v.s + Math.sqrt(v.k / v.a), color: 'sky', width: 3.6, glow: true });
      const w = c.st(3) ? v.wo : v.w0;
      const P = rect(b, v, w, c.st(3) ? { color: 'green', fillAlpha: 0.22 } : { color: 'muted', fill: 'muted', fillAlpha: 0.1, width: 2.2 });
      const [A, B, C, D] = P;
      dot(b, A, 'ink', 'A', -8, 20, { align: 'right', size: 14, r: 4.5 });
      dot(b, B, 'ink', 'B', 8, 20, { size: 14, r: 4.5 });
      dot(b, C, 'ink', 'C', 8, -12, { size: 14, r: 4.5 });
      dot(b, D, 'ink', 'D', -8, -12, { align: 'right', size: 14, r: 4.5 });
      if (c.st(1)) {
        b.vline(v.s, { color: 'amber', width: 1.8, dash: [6, 5] });
        b.seg([v.s, 0], [v.s + w, 0], { color: 'amber', width: 3.4 });
        b.text([v.s + w / 2, 0], 'w', { color: 'amber', size: 14, weight: 800, dy: 22, align: 'center' });
      }
      if (c.st(3)) b.text([v.s, v.f(v.s + w) / 2], '둘레 ' + v.val, { color: 'green', size: 13, weight: 800, align: 'center' });
    }
  });

  /* ======================================================================
     3-A  absWholeFold · y=|f(x)| 와 수평선 y=k  (f = (x−p)²−m²)
     A: 서로 다른 네 점인 정수 k 의 개수 = m²−1,  B: 세 점인 k = m²,  C: 네 점일 때 네 근의 합 = 4p   [핵심]
     ====================================================================== */
  const P11 = [[1, 2], [1, 3], [2, 2], [-1, 2], [2, 3], [-2, 3], [0, 3], [3, 2]].flatMap(([p, m]) => ['A', 'B', 'C'].map((ask) => ({ p, m, ask })));
  const var11 = varier(P11, (c, i) => {
    const D = c.m * c.m, f = (x) => (x - c.p) ** 2 - D;
    const val = c.ask === 'A' ? D - 1 : c.ask === 'B' ? D : 4 * c.p;
    return { ...c, key: 'a11_' + i, D, f, r1: c.p - c.m, r2: c.p + c.m, val, kk: D / 2 };
  }, (x, y) => x.ask === y.ask && x.p === y.p && x.m === y.m);
  add('absWholeFold', {
    fast: '핵심', vary: var11,
    tag: '26 금당고 기출 유형 · 2024학년도 3월 학평(서울) 유형 (절댓값 그래프와 수평선의 교점)', time: '목표 시간: 40초',
    text: (v) => `방정식 ${T('|' + polyTex(1, -2 * v.p, v.p * v.p - v.D) + '|=k')}가 ${v.ask === 'A' ? '서로 다른 네 실근을 갖도록 하는 정수 ' + T('k') + '의 개수를' : v.ask === 'B' ? '서로 다른 세 실근을 갖도록 하는 실수 ' + T('k') + '의 값을' : '서로 다른 네 실근을 가질 때, 네 실근의 합을'} 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `${T('f(x)=' + polyTex(1, -2 * v.p, v.p * v.p - v.D))}의 그래프에서 ${T('x')}축 아래쪽 부분(점선)을 위로 접어 올리면 ${T('y=|f(x)|')}의 그래프가 됩니다. ${T('x')}절편은 ${T(v.r1)}, ${T(v.r2)}.`,
      `접힌 부분의 꼭대기는 원래 꼭짓점 ${T('(' + v.p + ',\\ -' + v.D + ')')}의 반대쪽 ${T('(' + v.p + ',\\ ' + v.D + ')')}입니다. 수평선 ${T('y=k')}와의 교점 개수는 ${T('k')}가 ${T('0')}과 ${T(v.D)}을 지날 때만 바뀝니다.`,
      v.ask === 'A' ? `서로 다른 네 점은 ${T('0\\lt k\\lt ' + v.D)}일 때. 이 안의 정수는 ${T('1,\\ 2,\\ \\cdots,\\ ' + (v.D - 1))} ⇒ ${T(v.val)}개.`
        : v.ask === 'B' ? `서로 다른 세 점은 수평선이 접어 올린 꼭대기를 지날 때, 곧 ${T('k=' + v.D)}일 때뿐입니다.`
          : `서로 다른 네 점이면 ${T('f(x)=k')}의 두 근과 ${T('f(x)=-k')}의 두 근이 모두 대칭축 ${T('x=' + v.p)}에 대해 대칭이므로 합은 ${T('2\\times' + v.p + '\\times2=' + v.val)}.`
    ],
    quick: (v) => ({
      steps: `접어 올린 그래프(W 모양)의 꼭대기 높이는 원래 꼭짓점의 깊이 ${T(v.D)}입니다. 수평선 ${T('y=k')}를 아래에서 위로 올리면 교점 개수는 ${T('k=0')}: 2개 → ${T('0\\lt k\\lt ' + v.D)}: 4개 → ${T('k=' + v.D)}: 3개 → ${T('k\\gt ' + v.D)}: 2개로 바뀝니다. ${v.ask === 'A' ? '네 개인 구간 ' + T('0\\lt k\\lt ' + v.D) + '의 정수는 ' + T(v.val) + '개.' : v.ask === 'B' ? '세 개인 순간은 ' + T('k=' + v.D) + '.' : '네 개일 때 네 점은 모두 대칭축 ' + T('x=' + v.p) + '에 대해 좌우로 짝지어지므로 합은 ' + T('4\\times' + par(v.p) + '=' + v.val) + '.'}`,
      highlight: `💡 서술형 문장: "${T('y=|f(x)|')}의 그래프는 ${T('f')}의 ${T('x')}축 아래 부분을 위로 접은 것이므로 꼭대기의 높이는 ${T(v.D)}이다."`
    }),
    std: (v) => ({
      steps: `${T('f(x)=k')}와 ${T('f(x)=-k')}를 따로 풀어 실근의 개수를 ${T('k')}에 따라 조사합니다: ${T('D_1=' + (4 * v.D) + '+4k')}, ${T('D_2=' + (4 * v.D) + '-4k')} 등 판별식 두 개의 부호를 비교해 ${T('0\\lt k\\lt ' + v.D)}를 얻습니다.`,
      warning: `⚠️ ${T('k=' + v.D)}일 때는 ${T('f(x)=-k')}가 중근이라 근이 3개뿐입니다. 판별식 계산에서 중근을 빠뜨리기 쉽습니다.`
    }),
    box: (v) => autoBox(v.r1 - 3.2, v.r2 + 3.2, [v.D + 0.5, 0], 1.0),
    draw: (b, s, v, c) => {
      b.plot(v.f, { color: 'sky', width: 2, dash: [5, 5], alpha: 0.55 });
      b.plot((x) => Math.abs(v.f(x)), { color: 'sky', width: 3.8, glow: true });
      [v.r1, v.r2].forEach((x) => dot(b, [x, 0], 'violet', lbl(x), 0, 22, { hollow: true, r: 4.5, align: 'center', size: 13 }));
      const k0 = c.tab === 'review' && c.st(3) ? (v.ask === 'B' ? v.D : v.kk) : v.kk;
      if (!(c.st(3) && v.ask === 'A')) {
        b.hline(k0, { color: 'amber', width: 2.2, dash: [6, 5] });
        b.text([v.r2 + 2.2, k0], 'y = k', { color: 'amber', size: 13, weight: 800, dy: -12, align: 'center' });
      }
      if (c.st(2)) {
        dot(b, [v.p, v.D], 'rose', `꼭대기 (${lbl(v.p)}, ${v.D})`, 0, -14, { r: 5.5, align: 'center' });
        b.hline(v.D, { color: 'rose', width: 1.4, dash: [3, 4], alpha: 0.7 });
      }
      if (c.st(3)) {
        if (v.ask === 'A') {
          b.poly([[v.r1 - 3.5, 0], [v.r2 + 3.5, 0], [v.r2 + 3.5, v.D], [v.r1 - 3.5, v.D]], { fill: 'green', fillAlpha: 0.14, color: null });
          for (let kk = 1; kk < v.D; kk++) b.hline(kk, { color: 'green', width: 1.2, dash: [3, 4], alpha: 0.9 });
        } else if (v.ask === 'B') {
          [[v.p, v.D], [v.r1, 0], [v.r2, 0]].forEach((pt) => b.point(pt, { color: 'green', r: 6 }));
        } else {
          const kk = v.kk;
          [v.p - Math.sqrt(v.D + kk), v.p + Math.sqrt(v.D + kk), v.p - Math.sqrt(v.D - kk), v.p + Math.sqrt(v.D - kk)].forEach((x) => b.point([x, kk], { color: 'green', r: 6 }));
          b.vline(v.p, { color: 'amber', width: 1.8, dash: [6, 5] });
        }
      }
    }
  });

  /* ======================================================================
     3-B  absXSymmetry · y=x²−2m|x|+c (y축 대칭 W 모양)
     A: 네 점인 정수 k 의 개수 = m²−1,  B: 세 점인 k = c   [핵심]
     ====================================================================== */
  const P12 = [[2, -1], [2, 3], [3, -2], [3, 4], [2, 0], [3, 0], [4, -3], [2, -2]].flatMap(([m, c]) => ['A', 'B'].map((ask) => ({ m, c, ask })));
  const var12 = varier(P12, (c, i) => {
    const f = (x) => x * x - 2 * c.m * Math.abs(x) + c.c, val = c.ask === 'A' ? c.m * c.m - 1 : c.c;
    return { ...c, key: 'a12_' + i, f, val, lo: c.c - c.m * c.m, kk: c.c - (c.m * c.m) / 2 };
  }, (x, y) => x.ask === y.ask && x.m === y.m && x.c === y.c);
  const abs12 = (v) => `x^2-${2 * v.m}|x|${v.c === 0 ? '' : sgn(v.c)}`;
  add('absXSymmetry', {
    fast: '핵심', vary: var12,
    tag: '25 제일고 기출 유형 · 2022학년도 6월 학평(부산) 유형 (f(|x|)의 그래프와 수평선)', time: '목표 시간: 40초',
    text: (v) => `방정식 ${T(abs12(v) + '=k')}가 ${v.ask === 'A' ? '서로 다른 네 실근을 갖도록 하는 정수 ' + T('k') + '의 개수를' : '서로 다른 세 실근을 갖도록 하는 실수 ' + T('k') + '의 값을'} 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `${T('x\\ge0')}에서는 ${T('y=x^2-' + 2 * v.m + 'x' + (v.c === 0 ? '' : sgn(v.c)))}이고, ${T('x\\lt0')}에서는 이 그래프를 ${T('y')}축에 대해 뒤집어 붙입니다(점선이 원래 그래프의 왼쪽 부분, 실선이 뒤집어 붙인 그래프).`,
      `W 모양의 세 점: 가운데 봉우리 ${T('(0,\\ ' + v.c + ')')}, 두 골짜기 ${T('(\\pm' + v.m + ',\\ ' + (v.c - v.m * v.m) + ')')}. 수평선 ${T('y=k')}와의 교점 개수는 ${T('k')}가 ${T(v.lo)}, ${T(v.c)}를 지날 때 바뀝니다.`,
      v.ask === 'A' ? `네 점은 두 골짜기와 봉우리 사이 ${T(v.lo + '\\lt k\\lt ' + v.c)}. 정수는 ${T(v.m * v.m - 1)}개.` : `세 점은 수평선이 가운데 봉우리를 지날 때, 곧 ${T('k=' + v.c)}.`
    ],
    quick: (v) => ({
      steps: `${T('y=f(|x|)')}의 그래프는 ${T('y')}축 대칭의 W 모양입니다. 수평선을 올릴 때 교점은 ${T('k=' + v.lo)}: 2개, ${T(v.lo + '\\lt k\\lt ' + v.c)}: 4개, ${T('k=' + v.c)}: <strong>3개</strong>(봉우리는 ${T('x=0')} 하나), ${T('k\\gt ' + v.c)}: 2개. ${v.ask === 'A' ? '네 개인 구간의 정수 개수는 ' + T(v.c + '-(' + v.lo + ')-1=' + v.val) + '.' : '세 개인 값은 ' + T('k=' + v.c) + '.'}`,
      highlight: `💡 서술형 문장: "${T('x=0')}에서는 좌우의 근이 하나로 합쳐지므로 ${T('k=' + v.c)}일 때 실근이 3개이다."`
    }),
    std: (v) => ({
      steps: `${T('x\\ge0')}일 때 ${T('x^2-' + 2 * v.m + 'x' + (v.c === 0 ? '' : sgn(v.c)) + '-k=0')}의 양의 근의 개수를 ${T('k')}에 따라 조사하고, ${T('y')}축 대칭을 이용해 두 배한 뒤 ${T('x=0')}인 근을 따로 처리합니다.`,
      warning: `⚠️ ${T('x=0')}이 근인 경우는 좌우로 겹치므로 두 배하면 안 됩니다.`
    }),
    box: (v) => autoBox(-v.m - 3.2, v.m + 3.2, [v.lo, v.c + 0.5], 1.2),
    draw: (b, s, v, c) => {
      b.plot((x) => x * x - 2 * v.m * x + v.c, { from: -v.m - 3.6, to: 0, color: 'sky', width: 2, dash: [5, 5], alpha: 0.55 });
      b.plot(v.f, { color: 'sky', width: 3.8, glow: true });
      const k0 = c.st(3) && v.ask === 'B' ? v.c : v.kk;
      if (!(c.st(3) && v.ask === 'A')) { b.hline(k0, { color: 'amber', width: 2.2, dash: [6, 5] }); b.text([v.m + 2.2, k0], 'y = k', { color: 'amber', size: 13, weight: 800, dy: -12, align: 'center' }); }
      if (c.st(1)) b.vline(0, { color: 'rose', width: 1.4, dash: [4, 5], alpha: 0.7 });
      if (c.st(2)) {
        dot(b, [0, v.c], 'rose', `(0, ${lbl(v.c)})`, 14, -10, { r: 5.5 });
        dot(b, [-v.m, v.lo], 'violet', `(−${v.m}, ${lbl(v.lo)})`, 0, 22, { r: 5, align: 'center' });
        dot(b, [v.m, v.lo], 'violet', `(${v.m}, ${lbl(v.lo)})`, 0, 22, { r: 5, align: 'center' });
      }
      if (c.st(3)) {
        if (v.ask === 'A') {
          b.poly([[-v.m - 3.5, v.lo], [v.m + 3.5, v.lo], [v.m + 3.5, v.c], [-v.m - 3.5, v.c]], { fill: 'green', fillAlpha: 0.14, color: null });
          for (let kk = v.lo + 1; kk < v.c; kk++) b.hline(kk, { color: 'green', width: 1.2, dash: [3, 4] });
        } else [[0, v.c], [-2 * v.m, v.c], [2 * v.m, v.c]].forEach((pt) => b.point(pt, { color: 'green', r: 6 }));
      }
    }
  });

  /* ======================================================================
     3-C  absLineRotTangent · y=|x²−n²| 과 점 (−s,0) 을 지나는 직선 y=k(x+s) 가 세 점에서 만나는 k
     접하는 순간: k = 2s−2√(s²−n²)   [보통]
     ====================================================================== */
  const P13 = [{ s: 3, n: 2, k: '6-2\\sqrt{5}', kv: 6 - 2 * Math.sqrt(5), x: '\\sqrt{5}-3' }, { s: 5, n: 3, k: '2', kv: 2, x: '-1' }, { s: 5, n: 4, k: '4', kv: 4, x: '-2' }]
    .flatMap((c) => ['K', 'X'].map((ask) => ({ ...c, ask })));
  const var13 = varier(P13, (c, i) => {
    const f = (x) => Math.abs(x * x - c.n * c.n), xt = -c.kv / 2;
    return { ...c, key: 'a13_' + i, f, xt, yt: c.n * c.n - xt * xt, g: (x, kk) => kk * (x + c.s), val: c.ask === 'K' ? c.kv : xt, tex: c.ask === 'K' ? c.k : c.x, ks: c.kv * 1.7 };
  }, (x, y) => x.ask === y.ask && x.s === y.s);
  add('absLineRotTangent', {
    fast: '보통', vary: var13,
    tag: '26 금당고 기출 유형 · 2023학년도 11월 학평(경기) 유형 (절댓값 함수와 직선의 교점 3개)', time: '목표 시간: 70초',
    text: (v) => `함수 ${T('y=|x^2-' + v.n * v.n + '|')}의 그래프와 점 ${T('P(-' + v.s + ',\\ 0)')}을 지나는 직선 ${T('y=k(x+' + v.s + ')')}가 서로 다른 세 점에서 만나도록 하는 양수 ${T('k')}에 대하여 ${v.ask === 'K' ? T('k') + '의 값을' : '이때 직선이 곡선에 접하는 점의 ' + T('x') + '좌표를'} 구하시오.`,
    ans: (v) => v.tex,
    steps: (v) => [
      `${T('y=|x^2-' + v.n * v.n + '|')}는 ${T('-' + v.n + '\\le x\\le ' + v.n)}에서 ${T('y=-x^2+' + v.n * v.n)}(위로 볼록한 봉우리), 그 밖에서는 ${T('y=x^2-' + v.n * v.n)}입니다. 점 P를 지나는 직선을 P 둘레로 돌립니다.`,
      `기울기 ${T('k')}가 작을 때는 직선이 왼쪽 가지·봉우리(두 점)·오른쪽 가지와 만나 <strong>네 점</strong>입니다. ${T('k')}를 키우면 봉우리 위의 두 교점이 서로 가까워지다가 한 점으로 합쳐지는(접하는) 순간 <strong>세 점</strong>이 되고, 더 키우면 직선이 봉우리 위로 올라가 두 점만 남습니다.`,
      `접하는 순간은 ${T('-x^2+' + v.n * v.n + '=k(x+' + v.s + ')')}, 곧 ${T('x^2+kx+' + v.s + 'k-' + v.n * v.n + '=0')}이 중근을 가질 때: ${T('D=k^2-' + 4 * v.s + 'k+' + 4 * v.n * v.n + '=0')} ⇒ ${T('k=' + v.k)}. 접점의 ${T('x')}좌표는 중근 ${T('x=-\\dfrac k2')}이므로 ${T('x=' + v.x)}.`
    ],
    quick: (v) => ({
      steps: `점 P를 지나는 직선을 돌릴 때 세 점이 되는 순간은 직선이 봉우리 ${T('y=-x^2+' + v.n * v.n)}에 접하는 순간뿐입니다(그림의 초록 직선). 접한다는 것은 ${T('x^2+kx+' + v.s + 'k-' + v.n * v.n + '=0')}이 중근이라는 뜻이므로 ${T('D=0')}: ${T('k^2-' + 4 * v.s + 'k+' + 4 * v.n * v.n + '=0')}. 해 ${T('k=' + (2 * v.s) + '\\pm2\\sqrt{' + (v.s * v.s - v.n * v.n) + '}')} 중 접점이 봉우리 구간 안에 있는 작은 값 ${T('k=' + v.k)}${v.ask === 'X' ? '. 접점의 ' + T('x') + '좌표는 중근 ' + T('x=-\\dfrac k2=' + v.x) : ''}.`,
      highlight: `💡 서술형 문장: "직선이 ${T('y=-x^2+' + v.n * v.n)}에 접할 때 세 점에서 만나고, 이때 이차방정식이 중근을 가지므로 ${T('D=0')}이다. 접점의 ${T('x')}좌표가 ${T('-' + v.n + '\\lt x\\lt ' + v.n)}인지 확인한다."`
    }),
    std: (v) => ({
      steps: `${T('x\\lt-' + v.n + ',\\ x\\gt ' + v.n)}와 ${T('-' + v.n + '\\le x\\le ' + v.n)}로 나누어 각각 교점의 개수를 ${T('k')}로 조사한 뒤 3이 되는 경우를 모읍니다. 그림에서 직선이 접하는 순간으로 바로 좁히면 한 가지 방정식만 풀면 됩니다.`,
      warning: `⚠️ ${T('D=0')}의 두 해 중 큰 값은 접점이 봉우리 구간 밖(포물선 전체에 접하는 경우)이므로 버립니다.`
    }),
    box: (v) => autoBox(-v.s - 1.8, v.n + 3.4, [v.n * v.n + 0.5, v.g(v.n + 1, v.ks) > 12 ? 12 : v.g(v.n + 1, v.ks)], 1.0),
    draw: (b, s, v, c) => {
      b.plot((x) => x * x - v.n * v.n, { from: -v.n, to: v.n, color: 'sky', width: 2, dash: [5, 5], alpha: 0.55 });
      b.plot(v.f, { color: 'sky', width: 3.8, glow: true });
      dot(b, [-v.s, 0], 'ink', `P(−${v.s}, 0)`, 0, 22, { hollow: true, r: 5, align: 'center', size: 13 });
      const kk = c.st(3) ? v.kv : v.ks;
      b.line([-v.s, 0], kk, { color: c.st(3) ? 'green' : 'rose', width: 3, glow: true, alpha: c.st(2) && !c.st(3) ? 0.4 : 1 });
      if (c.st(1)) b.plot((x) => -x * x + v.n * v.n, { from: -v.n, to: v.n, color: 'amber', width: 3.6 });
      if (c.st(3)) dot(b, [v.xt, v.yt], 'green', '접점', -12, -10, { r: 6.5, align: 'right' });
    }
  });

  /* ======================================================================
     3-D  absPiecewiseSplit · y=x²−2hx−2n|x−h| (경계 x=h 좌우 이어 붙이기, x=h 대칭)
     A: 네 점인 정수 k 의 개수 = n²−1,  B: 네 점일 때 네 근의 합 = 4h,  C: 세 점인 k = −h²   [핵심]
     ====================================================================== */
  const P14 = [[1, 2], [1, 3], [2, 2], [-1, 2], [2, 3], [-2, 2]].flatMap(([h, n]) => ['A', 'B', 'C'].map((ask) => ({ h, n, ask })));
  const var14 = varier(P14, (c, i) => {
    const f = (x) => x * x - 2 * c.h * x - 2 * c.n * Math.abs(x - c.h), top = -c.h * c.h, bot = -c.h * c.h - c.n * c.n;
    const val = c.ask === 'A' ? c.n * c.n - 1 : c.ask === 'B' ? 4 * c.h : top;
    return { ...c, key: 'a14_' + i, f, top, bot, val, kk: (top + bot) / 2 };
  }, (x, y) => x.ask === y.ask && x.h === y.h && x.n === y.n);
  const exp14 = (v) => `x^2${v.h === 0 ? '' : '-' + (2 * v.h === 1 ? '' : 2 * v.h) + 'x'}`.replace('-' + '-', '+');
  const f14 = (v) => `x^2${v.h === 1 ? '-2x' : v.h === -1 ? '+2x' : v.h === 2 ? '-4x' : v.h === -2 ? '+4x' : ''}-${2 * v.n}|${xm(v.h)}|`;
  add('absPiecewiseSplit', {
    fast: '핵심', vary: var14,
    tag: '25 금당고 기출 유형 · 2021학년도 10월 학평(경기) 유형 (부분 절댓값과 수평선)', time: '목표 시간: 50초',
    text: (v) => `방정식 ${T(f14(v) + '=k')}가 ${v.ask === 'A' ? '서로 다른 네 실근을 갖도록 하는 정수 ' + T('k') + '의 개수를' : v.ask === 'B' ? '서로 다른 네 실근을 가질 때, 네 실근의 합을' : '서로 다른 세 실근을 갖도록 하는 실수 ' + T('k') + '의 값을'} 구하시오.`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `경계 ${T('x=' + v.h)}에서 식이 바뀝니다. ${T('x\\ge' + v.h)}에서는 ${T('y=' + polyTex(1, -2 * v.h - 2 * v.n, 2 * v.n * v.h))}, ${T('x\\lt ' + v.h)}에서는 ${T('y=' + polyTex(1, -2 * v.h + 2 * v.n, -2 * v.n * v.h))} (두 가지 조각, 두 색).`,
      `두 조각은 경계 ${T('x=' + v.h)}에 대해 좌우 대칭이고 경계점의 높이는 ${T(v.top)}. 골짜기는 ${T('(' + (v.h - v.n) + ',\\ ' + v.bot + ')')}, ${T('(' + (v.h + v.n) + ',\\ ' + v.bot + ')')}. 수평선 ${T('y=k')}와의 교점 개수는 ${T('k')}가 ${T(v.bot)}, ${T(v.top)}를 지날 때 바뀝니다.`,
      v.ask === 'A' ? `네 점: ${T(v.bot + '\\lt k\\lt ' + v.top)}. 정수는 ${T(v.val)}개.` : v.ask === 'B' ? `네 점은 대칭축 ${T('x=' + v.h)}에 대해 두 쌍으로 짝지어지므로 합은 ${T('4\\times' + par(v.h) + '=' + v.val)}.` : `세 점은 수평선이 경계점(봉우리)을 지날 때 ⇒ ${T('k=' + v.top)}.`
    ],
    quick: (v) => ({
      steps: `${T('u=x-' + v.h)}로 놓으면 ${T('y=u^2-' + 2 * v.n + '|u|-' + v.h * v.h)}로 정리되어 <strong>${T('x=' + v.h)}에 대칭인 W 모양</strong>입니다. 가운데 봉우리 높이 ${T(v.top)}, 골짜기 높이 ${T(v.bot)}. ${v.ask === 'A' ? '네 점인 정수 ' + T('k') + '는 ' + T(v.bot + '\\lt k\\lt ' + v.top) + '의 ' + T(v.val) + '개.' : v.ask === 'B' ? '네 근이 대칭축에 대해 짝지어져 합은 ' + T('4\\times' + par(v.h) + '=' + v.val) + '.' : '세 점은 ' + T('k=' + v.top) + '.'}`,
      highlight: `💡 서술형 문장: "${T('f(x)')}는 ${T('x=' + v.h)}에 대하여 대칭이므로 서로 다른 네 실근은 ${T('x=' + v.h)}에 대해 두 쌍으로 짝지어진다."`
    }),
    std: (v) => ({
      steps: `${T('x\\ge' + v.h)}와 ${T('x\\lt ' + v.h)}로 나누어 각각 이차방정식으로 쓰고, 근이 각 범위 안에 있는지 확인하면서 ${T('k')}에 따른 개수를 조사합니다.`,
      warning: `⚠️ 근이 범위(${T('x\\ge' + v.h)} 또는 ${T('x\\lt ' + v.h)}) 안에 있는지 확인하지 않으면 개수를 잘못 셉니다.`
    }),
    box: (v) => autoBox(v.h - v.n - 3.2, v.h + v.n + 3.2, [v.bot, v.top + 0.5], 1.2),
    draw: (b, s, v, c) => {
      b.plot(v.f, { from: v.h, to: v.h + v.n + 3.6, color: 'sky', width: 3.8, glow: true });
      b.plot(v.f, { from: v.h - v.n - 3.6, to: v.h, color: c.st(1) ? 'rose' : 'sky', width: 3.8, glow: true });
      const k0 = c.st(3) && v.ask === 'C' ? v.top : v.kk;
      if (!(c.st(3) && v.ask === 'A')) { b.hline(k0, { color: 'amber', width: 2.2, dash: [6, 5] }); b.text([v.h + v.n + 2.4, k0], 'y = k', { color: 'amber', size: 13, weight: 800, dy: -12, align: 'center' }); }
      if (c.st(1)) { b.vline(v.h, { color: 'violet', width: 1.6, dash: [4, 5], alpha: 0.8 }); b.text([v.h, v.bot - 0.6], 'x = ' + lbl(v.h), { color: 'violet', size: 13, weight: 800, dy: 8 }); }
      if (c.st(2)) {
        dot(b, [v.h, v.top], 'rose', `(${lbl(v.h)}, ${lbl(v.top)})`, 14, -10, { r: 5.5 });
        dot(b, [v.h - v.n, v.bot], 'violet', '', 0, 0, { r: 5 });
        dot(b, [v.h + v.n, v.bot], 'violet', '', 0, 0, { r: 5 });
      }
      if (c.st(3)) {
        if (v.ask === 'A') {
          b.poly([[v.h - v.n - 3.5, v.bot], [v.h + v.n + 3.5, v.bot], [v.h + v.n + 3.5, v.top], [v.h - v.n - 3.5, v.top]], { fill: 'green', fillAlpha: 0.14, color: null });
          for (let kk = v.bot + 1; kk < v.top; kk++) b.hline(kk, { color: 'green', width: 1.2, dash: [3, 4] });
        } else if (v.ask === 'B') {
          const u1 = Math.sqrt(v.n * v.n + (v.kk - v.bot)), u2 = v.n - Math.sqrt(v.n * v.n - (v.kk - v.bot));
          void u1; void u2;
          const rts = []; for (let x = v.h - v.n - 3.5; x < v.h + v.n + 3.5; x += 0.01) if ((v.f(x) - v.kk) * (v.f(x + 0.01) - v.kk) < 0) rts.push(x + 0.005);
          rts.forEach((x) => b.point([x, v.kk], { color: 'green', r: 6 }));
        } else {
          dot(b, [v.h, v.top], 'green', '', 0, 0, { r: 6.5 });
          [v.h - 2 * v.n, v.h + 2 * v.n].forEach((x) => b.point([x, v.top], { color: 'green', r: 6 }));
        }
      }
    }
  });

  /* ======================================================================
     3-E  maxMinEnvelope · h(x)=max{f(x), g(x)} 의 최솟값 (아래로 볼록한 f 와 직선 g)
     위쪽 포락선의 가장 낮은 점: 꼭짓점이 포락선 위에 있으면 꼭짓점, 아니면 교점   [핵심]
     ====================================================================== */
  const P15 = [
    { a: 1, al: -1, be: 3, m: 1, n: 0 }, { a: 1, al: -1, be: 3, m: -1, n: 2 }, { a: 1, al: -1, be: 1, m: -4, n: 1 }, { a: 2, al: 0, be: 2, m: 2, n: 1 },
    { a: 1, al: -1, be: 1, m: 4, n: 2 }, { a: 1, al: -2, be: 2, m: 1, n: 1 }, { a: 3, al: -1, be: 1, m: -2, n: 3 }
  ];
  const var15 = varier(P15, (c, i) => {
    const A = c.a, B = c.m - c.a * (c.al + c.be), C = c.n + c.a * c.al * c.be;
    const f = (x) => A * x * x + B * x + C, g = (x) => c.m * x + c.n, hf = (x) => Math.max(f(x), g(x));
    const xv = -B / (2 * A);
    const cands = [c.al, c.be, xv].map((x) => ({ x, y: hf(x) }));
    const best = cands.reduce((p, q) => (q.y < p.y - 1e-9 ? q : p));
    return { ...c, key: 'a15_' + i, A, B, C, f, g, hf, xv, best, val: best.y, vyv: f(xv), fOn: xv <= c.al || xv >= c.be };
  });
  add('maxMinEnvelope', {
    fast: '핵심', vary: var15,
    tag: '24 제일고 기출 유형 · 2022학년도 3월 학평(서울) 유형 (두 함수 중 큰 값의 최솟값)', time: '목표 시간: 50초',
    text: (v) => `두 함수 ${T('f(x)=' + polyTex(v.A, v.B, v.C))}, ${T('g(x)=' + linTex(v.m, v.n))}에 대하여 함수 ${T('h(x)=\\max\\{f(x),\\ g(x)\\}')}의 최솟값을 구하시오.  (단, ${T('\\max\\{a,b\\}')}는 ${T('a')}, ${T('b')} 중 크거나 같은 값이다.)`,
    ans: (v) => String(v.val),
    steps: (v) => [
      `두 그래프를 한 좌표평면에 그리고 각 ${T('x')}에서 <strong>위쪽에 있는 값</strong>을 따라가면 ${T('y=h(x)')}의 그래프(굵은 금색선)입니다. 교점 ${T('x=' + v.al)}, ${T('x=' + v.be)}에서 위쪽 그래프가 바뀝니다.`,
      `${T('h')}의 가장 낮은 점의 후보는 두 곳뿐입니다: 교점(위쪽 선이 바뀌는 점)과 ${T('f')}의 꼭짓점 ${T('(' + frTex(Math.round(2 * v.xv), 2) + ',\\ ' + frTex(Math.round(4 * v.vyv), 4) + ')')}가 ${T('h')} 위에 있을 때의 꼭짓점. 이 문제에서는 꼭짓점이 ${v.fOn ? '<strong>h 위에 있습니다</strong>(꼭짓점에서 f가 g보다 위)' : '<strong>g 아래에 가려져</strong> h 위에 없습니다'}.`,
      `${v.fOn ? '꼭짓점의 높이 ' + T(v.val) : '낮은 쪽 교점 ' + T('x=' + v.best.x) + '의 높이 ' + T(v.val)}가 ${T('h')}의 최솟값입니다 ⇒ ${T(v.val)}.`
    ],
    quick: (v) => ({
      steps: `${T('h=\\max\\{f,g\\}')}는 두 그래프의 위쪽 선입니다. 최솟값은 굵은 선의 가장 낮은 점입니다. ${v.fOn ? T('f') + '의 꼭짓점이 ' + T('g') + '보다 위에 있어 ' + T('h') + ' 위에 있으므로 최솟값은 꼭짓점의 높이 ' + T(v.val) + '.' : T('f') + '의 꼭짓점은 직선 ' + T('g') + ' 아래에 가려지므로, 위쪽 선이 바뀌는 교점 중 낮은 쪽 ' + T('(' + v.best.x + ',\\ ' + v.val + ')') + '이 가장 낮은 점입니다.'}`,
      highlight: `💡 서술형 문장: "${T('h(x)')}는 ${T('f')}와 ${T('g')} 중 큰 값이므로 그래프는 위쪽 선이고, ${T('x=' + v.al)}, ${T('x=' + v.be)}에서 위쪽 선이 바뀐다. 꼭짓점이 ${T('g')}보다 ${v.fOn ? '위' : '아래'}에 있으므로 ..."`
    }),
    std: (v) => ({
      steps: `${T('f(x)-g(x)=' + polyTex(v.A, v.B - v.m, v.C - v.n) + '=' + coef(v.A) + '(' + xm(v.al) + ')(' + xm(v.be) + ')')}의 부호로 ${T('x\\lt ' + v.al + ',\\ ' + v.al + '\\le x\\le ' + v.be + ',\\ x\\gt ' + v.be)}로 나누어 ${T('h(x)')}를 식으로 쓰고, 각 구간에서 최솟값을 비교합니다.`,
      warning: `⚠️ 구간마다 최솟값이 어디서 생기는지 따로 확인해야 해서 오래 걸립니다. 그래프에서 가장 낮은 점을 바로 찾으면 후보가 두 곳으로 줄어듭니다.`
    }),
    box: (v) => autoBox(Math.min(v.al, v.xv) - 2.4, Math.max(v.be, v.xv) + 2.4, [v.val, v.g(v.al), v.g(v.be), v.f(v.xv), v.f(v.al) ], 1.5),
    draw: (b, s, v, c) => {
      b.plot(v.g, { color: 'rose', width: 3, glow: true });
      b.plot(v.f, { color: 'sky', width: 3.4, glow: true });
      nameOn(b, c.box, v.g, Math.max(v.be, v.xv) + 1.4, 'g', { color: 'rose', size: 14, weight: 800, dy: v.m > 0 ? 18 : -12, dx: 8 });
      nameOn(b, c.box, v.f, v.xv - 1.8, 'f', { color: 'sky', size: 14, weight: 800, dx: -12, dy: -2 });
      if (c.st(1)) {
        b.plot(v.hf, { color: 'amber', width: 5, alpha: 0.9 });
        [v.al, v.be].forEach((x) => b.point([x, v.g(x)], { color: 'violet', r: 5.5 }));
      }
      if (c.st(2)) {
        dot(b, [v.xv, v.f(v.xv)], v.fOn ? 'green' : 'muted', v.fOn ? '' : '꼭짓점(가려짐)', 0, 22, { r: 5.5, hollow: !v.fOn, align: 'center' });
      }
      if (c.st(3)) dot(b, [v.best.x, v.best.y], 'green', '최솟값 ' + lbl(v.val), 0, v.best.y > v.g(v.best.x) - 1e-9 && !v.fOn ? 22 : 24, { r: 7, align: 'center' });
    }
  });
})();
