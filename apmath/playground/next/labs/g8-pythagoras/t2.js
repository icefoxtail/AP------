/* ==========================================================================
   중2 · 피타고라스 정리 — 탭 ② 「정리의 증명」 (t2.js, order 20) — 장면 5개
   · py2-euclid  유클리드의 증명    · 빗변 위 정사각형을 수선으로 나누면 두 직사각형 = 두 직각변 위 정사각형
   · py2-bhas1   큰 정사각형 속 직각삼각형 4개 (바스카라 1)  · 두 가지로 놓아 c² 와 a²+b² 를 비교
   · py2-bhas2   직각삼각형 4개로 둘러싼 정사각형 (바스카라 2) · c² = 4×(½ab) + (b−a)²
   · py2-garf    사다리꼴의 넓이를 이용한 증명 (가필드)         · ½(a+b)² = ½ab + ½ab + ½c²
   · py2-sim     수선으로 나뉜 닮은 삼각형 증명                  · b² = c·p, a² = c·q 를 더하면 c² = a² + b²
   삼각형의 크기는 막대로 바꾸고, 모든 넓이는 지금의 a, b 로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PY;
  if (!G) return;
  const { clamp, pt, add, sub, mul, mid, unit, lerp, T, tagOut, sideTag, tick, line, poly, fillPoly, ang, fit, P, mkChoices, rd, notes, fmtN, squareOn, cenOf, drawSq, bboxOf, pick, rint, ratOf, texRat, plainRat, texFrac, isSqN, isq } = G;

  const TRIS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]];
  const PARAMS = {
    pyP: P('직각삼각형 고르기', 0, TRIS.length - 1, 1, 0, { color: 'amber', hint: '(a, b, c) — 세 변이 모두 정수인 삼각형', format: (v) => TRIS[clamp(Math.round(v), 0, TRIS.length - 1)].join(', ') }),
    pyG: P('직사각형 나누기', 0, 1, 0.01, 0, { color: 'rose', hint: '막대를 오른쪽으로 끌면 두 직사각형이 가로로 갈라져요', format: (v) => `${Math.round(v * 100)}%` }),
    pyBa: P('변 a', 2, 9, 1, 3, { color: 'sky', format: (v) => `${v}` }),
    pyBb: P('변 b', 2, 9, 1, 4, { color: 'green', format: (v) => `${v}` })
  };
  const triP = (s) => { const i = clamp(Math.round(s.pyP), 0, TRIS.length - 1), [a, b, c] = TRIS[i]; return { i, a, b, c }; };
  const abOf = (s) => { const a = clamp(Math.round(s.pyBa), 2, 9), b = clamp(Math.round(s.pyBb), 2, 9); return { a, b, c2: a * a + b * b, ci: isSqN(a * a + b * b) ? isq(a * a + b * b) : null }; };
  const fr = (v) => texRat(v); // 분수는 \frac{ }{ } (그림 글자는 키트가 쌓아서 그림)
  const nextTri = (prev) => { let i; do { i = rint(0, TRIS.length - 1); } while (prev && i === prev.pyP); return i; };

  /* ====================================================================== 1. 유클리드의 증명 (빗변 AB 가로 · 아래 정사각형) */
  const eu = {
    id: 'py2-euclid', title: '유클리드의 증명', short: '유클리드의 증명',
    question: '빗변 위 정사각형을 직각 꼭짓점에서 내린 수선으로 둘로 나누면, 두 직사각형의 넓이는 각각 두 직각변 위 정사각형과 같을까?',
    ctl: ['pyP', 'pyG'],
    init: (s) => { s.pyP = 0; s.pyG = 0; },
    gen: (s, prev) => ({ pyP: nextTri(prev), pyG: 0 }),
    model: (s) => { const t = triP(s); const { a, b, c } = t; return { ...t, p: (b * b) / c, q: (a * a) / c, a2: a * a, b2: b * b, c2: c * c, g: clamp(s.pyG || 0, 0, 1) }; },
    draw(b, s, M, C) {
      const { a, b: bb, c, p, g } = M;
      const A = pt(0, 0), B = pt(c, 0), Cc = pt(p, -(a * bb) / c), H = pt(p, 0), cen = G.centroid([A, B, Cc]);
      const sqA = squareOn(Cc, A, cen), sqB = squareOn(B, Cc, cen), shift = c * 0.16;
      const all = [A, B, Cc, ...sqA, ...sqB, pt(-shift, c), pt(c + shift, c)];
      const bx = bboxOf(all);
      fit(b, { x0: bx.x0, x1: bx.x1, y0: bx.y0, y1: c }, { t: 30, b: 34 });
      const stp = (n) => !C.review || C.step >= n;
      const prob = C.problem;
      const dxL = -shift * g, dxR = shift * g;
      const rectL = [pt(0, 0), pt(p, 0), pt(p, c), pt(0, c)].map((q) => pt(q.x + dxL, q.y));
      const rectR = [pt(p, 0), pt(c, 0), pt(c, c), pt(p, c)].map((q) => pt(q.x + dxR, q.y));
      const hiL = !C.review || C.step >= 3, hiR = !C.review || C.step >= 4;
      drawSq(b, sqA, 'green', prob ? '' : `b²=${M.b2}`, { fa: hiL ? 0.26 : 0.1 });
      drawSq(b, sqB, 'sky', prob ? '' : `a²=${M.a2}`, { fa: hiR ? 0.26 : 0.1 });
      if (stp(2)) {
        fillPoly(b, rectL, 'green', hiL ? 0.3 : 0.1); poly(b, rectL, 'green', 2.8);
        fillPoly(b, rectR, 'sky', hiR ? 0.3 : 0.1); poly(b, rectR, 'sky', 2.8);
        if (C.txt && !prob) { T(b, cenOf(rectL), hiL ? `${M.b2}` : '', { size: 18, color: 'green' }); T(b, cenOf(rectR), hiR ? `${M.a2}` : '', { size: 18, color: 'sky' }); }
        line(b, Cc, pt(p, c), 'rose', 2.6, { dash: [7, 6] });
      } else { fillPoly(b, [A, B, pt(c, c), pt(0, c)], 'amber', 0.1); poly(b, [A, B, pt(c, c), pt(0, c)], 'amber', 2.8); }
      T(b, pt(c / 2, c), prob ? '' : `c²=${M.c2}`, { dy: -14, size: 16, color: 'amber', alpha: stp(2) ? 0.9 : 1 });
      fillPoly(b, [A, B, Cc], 'ink', 0.08);
      poly(b, [A, B, Cc], 'ink', 3.4);
      ang(b, Cc, A, B, { color: 'amber', r: 20 });
      if (stp(2)) { b.right(H, B, Cc, { size: 11, color: 'rose' }); b.point(H, { color: 'rose', r: 4 }); T(b, H, 'H', { dx: 12, dy: -12, size: 15, color: 'rose' }); }
      [[A, 'A', -1, -1], [B, 'B', 1, -1], [Cc, 'C', 0, -1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4.5 }); T(b, q, nm, { dx: dx * 13, dy: dy * 15, size: 17 }); });
      T(b, mid(A, B), prob ? `${c}` : `c=${c}`, { dy: 16, size: 15, color: 'amber' });
      if (prob) sideTag(b, Cc, B, A, `${a}`, { color: 'sky', size: 16, gap: 12 });
    },
    steps: (M) => [
      `직각삼각형에서 빗변 $AB=${M.c}$, 직각변 $BC=${M.a}$예요. A 쪽 초록 직사각형의 넓이를 구해요.`,
      `C에서 AB에 내린 수선 CH를 연장해 큰 정사각형을 나눠요. 왼쪽은 AC 위 정사각형과, 오른쪽은 BC 위 정사각형과 넓이가 같아요.`,
      `닮음 $\\triangle ABC\\sim\\triangle ACH$에서 $AB\\times AH=AC^2$예요. 따라서 왼쪽 직사각형의 넓이는 $AC^2$예요.`,
      `$AC^2=AB^2-BC^2=${M.c}^2-${M.a}^2=${M.c2}-${M.a2}$예요.`,
      `구하는 왼쪽 직사각형의 넓이는 $${M.b2}$예요. 두 직사각형을 더하면 $${M.b2}+${M.a2}=${M.c2}$로 큰 정사각형과 같아요.`
    ],
    view: (M) => ({
      guide: '막대로 삼각형을 바꿔 보고, <b>직사각형 나누기</b> 막대를 끌면 두 직사각형이 가로로 갈라져요. 초록 직사각형은 초록 정사각형과, 파랑 직사각형은 파랑 정사각형과 넓이가 같아요.',
      readouts: [rd('왼쪽 직사각형', `${M.b2}`, 'green', `AH × c = ${fmtN(M.p)} × ${M.c}`), rd('오른쪽 직사각형', `${M.a2}`, 'sky', `HB × c = ${fmtN(M.q)} × ${M.c}`), rd('빗변 위 정사각형', `${M.c2}`, 'amber', `${M.b2} + ${M.a2}`)],
      formula: `<p>$AH=\\frac{b^2}{c}=${fr(M.p)}$, $HB=\\frac{a^2}{c}=${fr(M.q)}$</p><p>$c^2=c\\times AH+c\\times HB=b^2+a^2$</p>`,
      rule: '빗변 위 정사각형은 두 직사각형으로 나뉘고, 각 직사각형의 넓이는 이웃한 직각변 위 정사각형의 넓이와 같다',
      notes: notes('왼쪽 직사각형은 <b>변 CA</b> 위 정사각형과, 오른쪽은 <b>변 CB</b> 위 정사각형과 짝이에요. 서로 바꿔 짝지으면 안 돼요.', '수선의 발 H는 $AH=\\frac{b^2}{c}$ 위치에 있어요. 빗변을 반으로 나누는 점이 아니에요.')
    }),
    prob: (M) => {
      const { a, b: bb, c, b2 } = M;
      return {
        tag: '[증명] 빗변 위 직사각형의 넓이', key: `${a}-${bb}`,
        stem: `다음 그림은 $\\angle C=90^\\circ$인 직각삼각형 ABC의 세 변 위에 정사각형을 그리고, 점 C에서 빗변 AB에 내린 수선의 연장선으로 빗변 위 정사각형을 두 직사각형으로 나눈 것이다. $\\overline{AB}=${c}$, $\\overline{BC}=${a}$일 때, 점 A에 가까운 쪽(왼쪽) 직사각형의 넓이는?`,
        choices: mkChoices(b2, [[a * a, '왼쪽 직사각형은 변 CA 위 정사각형과 짝이에요. BC가 아니라 CA를 써요.'], [c * c, '빗변 위 정사각형 전체의 넓이예요.'], [(c * c) / 2, '수선의 발은 빗변의 한가운데가 아니에요.'], [b2 + 1, '$c^2-a^2$를 다시 계산해 보세요.'], [b2 - 1, '$c^2-a^2$를 다시 계산해 보세요.'], [bb, '넓이는 제곱이에요.']], { tex: (v) => texRat(v), plain: (v) => plainRat(v) })
      };
    }
  };

  /* ====================================================================== 2. 바스카라 1: 큰 정사각형 안에서 */
  const bh1 = {
    id: 'py2-bhas1', title: '큰 정사각형 안의 직각삼각형 4개', short: '큰 정사각형 안의 4개',
    question: '똑같은 직각삼각형 4개를 한 변이 a+b인 큰 정사각형 안에 두 가지로 놓으면, 남는 부분의 넓이를 비교해 어떤 식이 나올까?',
    ctl: ['pyBa', 'pyBb'],
    init: (s) => { s.pyBa = 3; s.pyBb = 4; },
    gen: (s, prev) => { let a, b; do { a = rint(2, 6); b = rint(a + 1, 9); } while (prev && a === prev.pyBa && b === prev.pyBb); return { pyBa: a, pyBb: b }; },
    model: (s) => { const m = abOf(s); return { ...m, sd: m.a + m.b, big: (m.a + m.b) ** 2, tri4: 2 * m.a * m.b }; },
    draw(b, s, M, C) {
      const { a, b: bb, sd, c2, ci } = M, prob = C.problem;
      const gap = Math.max(1.6, sd * 0.28);
      const ox = prob ? 0 : sd + gap;
      fit(b, { x0: 0, x1: prob ? sd : sd + ox, y0: 0, y1: sd }, { t: 38, b: 62, l: 30, r: 30 });
      const st = (n) => !C.review || C.step >= n;
      const sq1 = [pt(0, 0), pt(sd, 0), pt(sd, sd), pt(0, sd)];
      const Pq = [pt(a, 0), pt(sd, a), pt(bb, sd), pt(0, bb)];
      const tr1 = [[pt(0, 0), Pq[0], Pq[3]], [pt(sd, 0), Pq[1], Pq[0]], [pt(sd, sd), Pq[2], Pq[1]], [pt(0, sd), Pq[3], Pq[2]]];
      // 왼쪽: 직각삼각형 4개 + 가운데 기울어진 정사각형 c²
      poly(b, sq1, 'muted', 2.6);
      tr1.forEach((t) => { fillPoly(b, t, 'ink', 0.1); poly(b, t, 'ink', 2.4); b.right(t[0], t[1], t[2], { size: 9, color: 'amber' }); });
      if (st(2)) { fillPoly(b, Pq, 'amber', 0.28); poly(b, Pq, 'amber', 3); T(b, cenOf(Pq), prob ? '?' : `c²=${c2}`, { size: 18, color: 'amber' }); }
      T(b, pt(a / 2, 0), `${a}`, { dy: 13, size: 15, color: 'sky' }); T(b, pt(a + bb / 2, 0), `${bb}`, { dy: 13, size: 15, color: 'green' });
      T(b, pt(0, bb / 2), `${bb}`, { dx: 13, size: 15, color: 'green' }); T(b, pt(0, bb + a / 2), `${a}`, { dx: 13, size: 15, color: 'sky' });
      T(b, pt(sd / 2, sd), `${a}+${bb}=${sd}`, { dy: 22, size: 15, color: 'ink' });
      if (prob) return;
      // 오른쪽: 같은 삼각형 4개를 옮겨 놓으면 a²와 b²가 남음
      const X = (q) => pt(q.x + ox, q.y);
      const sq2 = sq1.map(X);
      const sqa = [pt(0, 0), pt(a, 0), pt(a, a), pt(0, a)].map(X), sqb = [pt(a, a), pt(sd, a), pt(sd, sd), pt(a, sd)].map(X);
      const t2 = [[pt(a, 0), pt(sd, 0), pt(sd, a)], [pt(a, 0), pt(sd, a), pt(a, a)], [pt(0, a), pt(a, a), pt(a, sd)], [pt(0, a), pt(a, sd), pt(0, sd)]].map((t) => t.map(X));
      poly(b, sq2, 'muted', 2.6);
      t2.forEach((t) => { fillPoly(b, t, 'ink', 0.1); poly(b, t, 'ink', 2.4); });
      b.right(X(pt(sd, a)), X(pt(a, a)), X(pt(sd, 0)), { size: 9, color: 'amber' }); b.right(X(pt(a, sd)), X(pt(a, a)), X(pt(0, sd)), { size: 9, color: 'amber' });
      if (st(3)) {
        fillPoly(b, sqa, 'sky', 0.3); poly(b, sqa, 'sky', 3); T(b, cenOf(sqa), `a²=${a * a}`, { size: 16, color: 'sky' });
        fillPoly(b, sqb, 'green', 0.3); poly(b, sqb, 'green', 3); T(b, cenOf(sqb), `b²=${bb * bb}`, { size: 16, color: 'green' });
      }
      T(b, pt(sd / 2 + ox, sd), `${a}+${bb}=${sd}`, { dy: 22, size: 15, color: 'ink' });
      if (st(4) && C.txt) T(b, pt(sd + gap / 2, sd), `${c2} = ${a * a} + ${bb * bb}`, { dy: 46, size: 17, color: 'amber' });
    },
    steps: (M) => [
      `큰 정사각형의 한 변은 $${M.sd}$, 합동인 직각삼각형의 두 직각변은 $a=${M.a}$, $b=${M.b}$예요. 가운데 정사각형의 넓이를 구해요.`,
      `가운데를 남기려면 큰 정사각형에서 같은 직각삼각형 4개를 빼요. 큰 정사각형의 넓이는 $${M.sd}^2=${M.big}$예요.`,
      `삼각형 4개의 넓이는 $4\\times\\frac{1}{2}\\times${M.a}\\times${M.b}=${M.tri4}$예요. 옮겨 놓아도 네 삼각형의 넓이는 변하지 않아요.`,
      `두 번째 배치에서는 하늘색 $a^2$와 초록색 $b^2$만 남아요. 따라서 가운데 넓이 $c^2=a^2+b^2$예요.`,
      `구하는 넓이는 $${M.big}-${M.tri4}=${M.c2}$예요. $${M.a * M.a}+${M.b * M.b}=${M.c2}$로도 확인해요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>a</b>, <b>b</b>를 바꿔 보세요. 왼쪽과 오른쪽 모두 똑같은 큰 정사각형에서 <b>같은 삼각형 4개</b>를 빼고 남은 부분이라 넓이가 같아요.',
      readouts: [rd('큰 정사각형', `${M.big}`, 'ink', `(${M.a}+${M.b})²`), rd('삼각형 4개', `${M.tri4}`, 'sky', `4 × ½ × ${M.a} × ${M.b}`), rd('남는 넓이 c²', `${M.c2}`, 'amber', `${M.big} − ${M.tri4}`), rd('a² + b²', `${M.a * M.a + M.b * M.b}`, 'green', `${M.a * M.a} + ${M.b * M.b}`)],
      formula: `<p>$c^2=(a+b)^2-4\\times\\frac{1}{2}ab=${M.big}-${M.tri4}=${M.c2}$</p><p>$a^2+b^2=${M.a * M.a}+${M.b * M.b}=${M.c2}$</p>`,
      rule: '(a+b)² − 4×(½ab) 를 두 방법으로 나타내면 c² = a² + b²',
      notes: notes('삼각형은 <b>4개</b>예요. 큰 정사각형의 한 변은 $a+b$이고 $c$가 아니에요.', '왼쪽 가운데 정사각형의 한 변은 <b>빗변 c</b>이고, 오른쪽의 두 정사각형 한 변은 각각 a, b예요.')
    }),
    prob: (M) => {
      const { a, b: bb, sd, c2 } = M;
      return {
        tag: '[증명] 큰 정사각형 속 가운데 정사각형', key: `${a}-${bb}`,
        stem: `다음 그림은 한 변의 길이가 $${sd}$인 정사각형 안에 직각을 낀 두 변의 길이가 $${a}$, $${bb}$인 합동인 직각삼각형 4개를 놓은 것이다. 가운데 기울어진 사각형이 정사각형일 때, 그 넓이는 (물음표 부분)?`,
        choices: mkChoices(c2, [[sd * sd, '큰 정사각형의 넓이예요. 삼각형 4개를 빼야 해요.'], [sd * sd - a * bb, '삼각형을 4개가 아니라 2개만 뺐어요.'], [a * a + bb * bb + 2 * a * bb, '큰 정사각형 넓이와 같아요. 삼각형 4개를 빼야 해요.'], [c2 + 1, '다시 계산해 보세요.'], [c2 - 1, '다시 계산해 보세요.'], [4 * a * bb, '삼각형 4개의 넓이 합의 2배예요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` })
      };
    }
  };

  /* ====================================================================== 3. 바스카라 2: 4개로 둘러싼 정사각형 */
  const refl = (p, A, B) => { const d = sub(B, A), t = ((p.x - A.x) * d.x + (p.y - A.y) * d.y) / (d.x * d.x + d.y * d.y), f = pt(A.x + t * d.x, A.y + t * d.y); return pt(2 * f.x - p.x, 2 * f.y - p.y); };
  const bh2 = {
    id: 'py2-bhas2', title: '직각삼각형 4개로 둘러싼 정사각형', short: '4개로 둘러싼 정사각형',
    question: '직각삼각형 4개의 빗변으로 정사각형을 만들면 가운데에 작은 정사각형이 생긴다. 이 작은 정사각형의 한 변은 얼마일까?',
    ctl: ['pyBa', 'pyBb'],
    init: (s) => { s.pyBa = 3; s.pyBb = 4; },
    gen: (s, prev) => { let a, b; do { a = rint(2, 6); b = rint(a + 1, 9); } while (prev && a === prev.pyBa && b === prev.pyBb); return { pyBa: a, pyBb: b }; },
    model: (s) => { const m = abOf(s); const d = Math.abs(m.b - m.a); return { ...m, d, d2: d * d, tri4: 2 * m.a * m.b }; },
    draw(b, s, M, C) {
      const { a, b: bb, c2, d, d2 } = M, prob = C.problem, sd = a + bb;
      const Pq = [pt(a, 0), pt(sd, a), pt(bb, sd), pt(0, bb)]; // 바깥: 한 변이 c 인 기울어진 정사각형
      const Wp = [refl(pt(0, 0), Pq[0], Pq[3]), refl(pt(sd, 0), Pq[1], Pq[0]), refl(pt(sd, sd), Pq[2], Pq[1]), refl(pt(0, sd), Pq[3], Pq[2])];
      fit(b, bboxOf(Pq), { t: 42, b: 54, l: 40, r: 40 });
      const st = (n) => !C.review || C.step >= n;
      fillPoly(b, Pq, 'amber', st(1) ? 0.12 : 0.06); poly(b, Pq, 'amber', 3.2);
      // 삼각형: 빗변이 바깥 변, 직각 꼭짓점이 안쪽(Wp)
      const sides = [[Pq[0], Pq[3], Wp[0]], [Pq[1], Pq[0], Wp[1]], [Pq[2], Pq[1], Wp[2]], [Pq[3], Pq[2], Wp[3]]];
      sides.forEach(([p, q, w]) => { fillPoly(b, [p, q, w], 'sky', 0.22); poly(b, [p, q, w], 'ink', 2.4); b.right(w, p, q, { size: 9, color: 'amber' }); });
      if (st(2)) { fillPoly(b, Wp, 'rose', 0.34); poly(b, Wp, 'rose', 2.8); T(b, cenOf(Wp), prob ? '?' : `${d2}`, { size: prob ? 18 : 16, color: 'rose' }); }
      // 직각삼각형 하나의 변 길이(한 변이 어디서나 a, b 로 읽히도록)
      const [p0, q0, w0] = sides[0];
      sideTag(b, p0, w0, cenOf(Pq), `${a}`, { color: 'sky', size: 16, gap: -26 });
      sideTag(b, q0, w0, cenOf(Pq), `${bb}`, { color: 'green', size: 16, gap: -26 });
      const [p1, q1, w1] = sides[2];
      sideTag(b, p1, w1, cenOf(Pq), `${a}`, { color: 'sky', size: 16, gap: -26 });
      sideTag(b, q1, w1, cenOf(Pq), `${bb}`, { color: 'green', size: 16, gap: -26 });
      if (!prob) sideTag(b, Pq[0], Pq[1], cenOf(Pq), M.ci ? `c=${M.ci}` : 'c', { color: 'amber', size: 16, gap: 13 });
      Pq.forEach((p, i) => { b.point(p, { color: 'ink', r: 4 }); });
      if (!prob && C.txt && st(3)) T(b, pt(sd / 2, sd), `${c2} = ${M.tri4} + ${d2}`, { dy: 40, size: 17, color: 'amber' });
    },
    steps: (M) => [
      `직각변이 $a=${M.a}$, $b=${M.b}$인 합동인 삼각형 4개예요. 가운데 분홍 정사각형의 넓이를 구해요.`,
      `이웃한 두 삼각형의 직각변을 비교하면 가운데 정사각형의 한 변은 긴 직각변에서 짧은 직각변을 뺀 길이예요.`,
      `가운데 한 변은 $${Math.max(M.a, M.b)}-${Math.min(M.a, M.b)}=${M.d}$예요. 넓이는 이 길이의 제곱이에요.`,
      `따라서 구하는 넓이는 $${M.d}^2=${M.d2}$예요. 바깥 정사각형 전체의 넓이와 구별해요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>a</b>, <b>b</b>를 바꿔 보세요. 바깥 정사각형(노랑) = 삼각형 4개(파랑) + 가운데 작은 정사각형(분홍). 가운데 정사각형의 한 변은 <b>b − a</b>예요.',
      readouts: [rd('바깥 정사각형 c²', `${M.c2}`, 'amber'), rd('삼각형 4개', `${M.tri4}`, 'sky', `4 × ½ × ${M.a} × ${M.b}`), rd('가운데 (b−a)²', `${M.d2}`, 'rose', `(${M.b} − ${M.a})²`)],
      formula: `<p>$c^2=4\\times\\frac{1}{2}ab+(b-a)^2=${M.tri4}+${M.d2}=${M.c2}$</p><p>$=a^2+b^2$</p>`,
      rule: '직각삼각형 4개로 둘러싼 정사각형: c² = 4×(½ab) + (b−a)² = a² + b²',
      notes: notes('가운데 정사각형의 한 변은 <b>b−a</b>이고 b+a가 아니에요. ($a<b$일 때)', '삼각형은 4개 모두 합동이라 빗변이 모두 $c$로 같아요.')
    }),
    prob: (M) => {
      const { a, b: bb, d2, c2 } = M;
      return {
        tag: '[증명] 가운데 작은 정사각형의 넓이', key: `${a}-${bb}`,
        stem: `다음 그림은 직각을 낀 두 변의 길이가 $${a}$, $${bb}$인 합동인 직각삼각형 4개의 빗변으로 정사각형을 만든 것이다. 가운데 작은 정사각형(분홍)의 넓이는?`,
        choices: mkChoices(d2, [[c2, '바깥 정사각형의 넓이예요.'], [(a + bb) ** 2, '$b-a$가 아니라 $a+b$를 썼어요.'], [bb - a, '넓이는 한 변의 제곱이에요.'], [d2 + 1, '다시 계산해 보세요.'], [d2 + 2, '다시 계산해 보세요.'], [c2 - 4 * a * bb / 2, '삼각형 4개를 모두 빼야 해요.']], { tex: (v) => `${v}`, plain: (v) => `${v}` })
      };
    }
  };

  /* ====================================================================== 4. 가필드: 사다리꼴 */
  const garf = {
    id: 'py2-garf', title: '사다리꼴의 넓이를 이용한 증명', short: '사다리꼴을 이용한 증명',
    question: '합동인 직각삼각형 두 개를 이어 사다리꼴을 만들면, 사다리꼴의 넓이를 두 가지 방법으로 나타내 정리를 증명할 수 있을까?',
    ctl: ['pyBa', 'pyBb'],
    init: (s) => { s.pyBa = 3; s.pyBb = 4; },
    gen: (s, prev) => { let a, b; do { a = rint(2, 7); b = rint(2, 9); } while ((prev && a === prev.pyBa && b === prev.pyBb) || a === b); return { pyBa: a, pyBb: b }; },
    model: (s) => { const m = abOf(s); const sd = m.a + m.b; return { ...m, sd, trap: (sd * sd) / 2, t1: (m.a * m.b) / 2, mid: m.c2 / 2 }; },
    draw(b, s, M, C) {
      const { a, b: bb, sd, c2, ci } = M, prob = C.problem;
      const Pp = pt(0, 0), X = pt(bb, 0), Q = pt(sd, 0), L = pt(0, -a), Rr = pt(sd, -bb);
      fit(b, { x0: 0, x1: sd, y0: -Math.max(a, bb), y1: 0 }, { t: 40, b: 56, l: 40, r: 40 });
      const st = (n) => !C.review || C.step >= n;
      fillPoly(b, [Pp, Q, Rr, L], 'ink', 0.05); poly(b, [Pp, Q, Rr, L], 'ink', 3.2);
      if (st(2) || prob) {
        fillPoly(b, [Pp, X, L], 'sky', 0.26); fillPoly(b, [X, Q, Rr], 'sky', 0.26);
        poly(b, [Pp, X, L], 'sky', 2.6); poly(b, [X, Q, Rr], 'sky', 2.6);
        fillPoly(b, [L, X, Rr], 'amber', 0.24); poly(b, [L, X, Rr], 'amber', 2.6);
        b.right(Pp, X, L, { size: 10, color: 'amber' }); b.right(Q, X, Rr, { size: 10, color: 'amber' }); b.right(X, L, Rr, { size: 11, color: 'amber' });
        if (C.txt && !prob && st(3)) {
          T(b, pt(bb * 0.3, -a * 0.28), `\\frac{${a}×${bb}}{2}`, { size: 15, color: 'sky' });
          T(b, pt(bb + a * 0.7, -bb * 0.28), `\\frac{${a}×${bb}}{2}`, { size: 15, color: 'sky' });
          T(b, pt((bb + sd) / 2 - bb * 0.0, -Math.max(a, bb) * 0.6), `\\frac{${c2}}{2}`, { size: 16, color: 'amber' });
        }
      }
      [[Pp, 'P', -1, 1], [X, 'X', 0, 1], [Q, 'Q', 1, 1], [L, 'L', -1, -1], [Rr, 'R', 1, -1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4.5 }); T(b, q, nm, { dx: dx * 13, dy: dy * 15, size: 17 }); });
      T(b, lerp(Pp, X, 0.5), `${bb}`, { dy: 16, size: 16, color: 'green' }); T(b, lerp(X, Q, 0.5), `${a}`, { dy: 16, size: 16, color: 'sky' });
      T(b, lerp(Pp, L, 0.5), `${a}`, { dx: -14, size: 16, color: 'sky' }); T(b, lerp(Q, Rr, 0.5), `${bb}`, { dx: 14, size: 16, color: 'green' });
      if (!prob) T(b, lerp(L, X, 0.5), 'c', { dx: -14, dy: -2, size: 15, color: 'amber' });
    },
    steps: (M) => [
      `두 직각삼각형의 직각변은 $a=${M.a}$, $b=${M.b}$예요. 사다리꼴 PQRL 전체의 넓이를 구해요.`,
      `평행한 두 변은 $PL=${M.a}$와 $QR=${M.b}$예요. 두 평행선 사이의 거리는 $PQ=${M.b}+${M.a}=${M.sd}$예요.`,
      `사다리꼴의 넓이는 (평행한 두 변의 합)×높이÷2이므로 $\\frac{(${M.a}+${M.b})\\times${M.sd}}{2}$예요.`,
      `구하는 넓이는 $\\frac{${M.sd * M.sd}}{2}=${texRat(M.trap)}$예요. 삼각형 두 개만의 넓이 $${M.a * M.b}$와 구별해요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>a</b>, <b>b</b>를 바꿔 보세요. 사다리꼴의 넓이는 항상 <b>두 삼각형 + 가운데 삼각형</b>의 넓이와 같아요. 가운데 삼각형은 직각이등변삼각형(두 변이 c)이에요.',
      readouts: [rd('사다리꼴의 넓이', `$${G.texRat(M.trap)}$`, 'ink', `½ × (${M.a}+${M.b})²`), rd('파란 삼각형 2개', `${M.a * M.b}`, 'sky', '½ab + ½ab'), rd('가운데 삼각형', `$${G.texRat(M.mid)}$`, 'amber', '½c²')],
      formula: `<p>$\\frac{1}{2}(a+b)^2=\\frac{1}{2}ab+\\frac{1}{2}ab+\\frac{1}{2}c^2$</p><p>$a^2+2ab+b^2=2ab+c^2 \\Rightarrow a^2+b^2=c^2$</p>`,
      rule: '사다리꼴 = 직각삼각형 2개 + 직각이등변삼각형 1개 로 나타내면 a²+b²=c²',
      notes: notes('가운데 삼각형은 <b>직각이등변삼각형</b>(두 변이 $c$)이라 넓이가 $\\frac{1}{2}c^2$이에요.', '사다리꼴의 높이는 $a+b$(두 삼각형의 밑변의 합)이에요.')
    }),
    prob: (M) => {
      const { a, b: bb, trap } = M;
      return {
        tag: '[증명] 사다리꼴의 넓이', key: `${a}-${bb}`,
        stem: `다음 그림은 직각을 낀 두 변의 길이가 $${a}$, $${bb}$인 합동인 직각삼각형 두 개와 직각이등변삼각형 하나로 사다리꼴 PQRL을 만든 것이다. 사다리꼴 PQRL의 넓이는?`,
        choices: mkChoices(trap, [[a * bb, '삼각형 두 개의 넓이만 구했어요.'], [(a + bb) ** 2, '$\\frac{1}{2}$을 곱해야 해요. 윗변+아랫변을 높이와 곱한 뒤 2로 나눠요.'], [trap + 1, '다시 계산해 보세요.'], [trap - 1, '다시 계산해 보세요.'], [(a * a + bb * bb) / 2, '가운데 삼각형만의 넓이예요.'], [trap + 0.5, '다시 계산해 보세요.']], { tex: (v) => texRat(v), plain: (v) => plainRat(v), pad: 0.5 })
      };
    }
  };

  /* ====================================================================== 5. 수선의 닮음 증명 */
  const sim = {
    id: 'py2-sim', title: '닮은 삼각형을 이용한 증명', short: '닮음을 이용한 증명',
    question: '직각 꼭짓점에서 빗변에 수선을 그으면 닮은 삼각형이 생긴다. 닮음비로 b², a² 를 구해 더하면 c² 이 될까?',
    ctl: ['pyP'],
    init: (s) => { s.pyP = 0; },
    gen: (s, prev) => ({ pyP: nextTri(prev) }),
    model: (s) => { const t = triP(s), { a, b, c } = t; const p = (b * b) / c, q = (a * a) / c; return { ...t, p, q, h: (a * b) / c, b2: b * b, a2: a * a, c2: c * c }; },
    draw(b, s, M, C) {
      const { a, b: bb, c, p, h } = M, prob = C.problem;
      const A = pt(0, 0), B = pt(c, 0), Cc = pt(p, -h), H = pt(p, 0);
      fit(b, bboxOf([A, B, Cc]), { t: 44, b: 54, l: 40, r: 40 });
      const st = (n) => !C.review || C.step >= n;
      if (st(1)) { fillPoly(b, [A, H, Cc], 'green', st(2) ? 0.28 : 0.18); fillPoly(b, [H, B, Cc], 'sky', st(3) ? 0.28 : 0.18); line(b, Cc, H, 'rose', 2.8, { dash: [7, 6] }); }
      poly(b, [A, B, Cc], 'ink', 3.4);
      ang(b, Cc, A, B, { color: 'amber', r: 20 });
      if (st(1)) {
        b.right(H, B, Cc, { size: 11, color: 'rose' });
        if (!prob) {
          ang(b, A, B, Cc, { color: 'sky', rings: 1, r: 26 }); ang(b, Cc, B, H, { color: 'sky', rings: 1, r: 30 });
          ang(b, B, A, Cc, { color: 'green', rings: 2, r: 28 }); ang(b, Cc, A, H, { color: 'green', rings: 2, r: 34 });
        }
        b.point(H, { color: 'rose', r: 4 }); T(b, H, 'H', { dx: 0, dy: 18, size: 16, color: 'rose' });
      }
      [[A, 'A', -1, 0.4], [B, 'B', 1, 0.4], [Cc, 'C', 0, -1]].forEach(([q, nm, dx, dy]) => { b.point(q, { color: 'ink', r: 4.5 }); T(b, q, nm, { dx: dx * 14, dy: dy * 16, size: 17 }); });
      // 길이: 문제에서는 주어진 AB, AC 만 보임
      sideTag(b, A, Cc, B, `${bb}`, { color: 'green', size: 16, gap: 12 });
      sideTag(b, Cc, B, A, prob ? '' : `${a}`, { color: 'sky', size: 16, gap: 12 });
      if (prob) { T(b, mid(A, B), `${c}`, { dy: 40, size: 16, color: 'amber' }); T(b, mid(A, H), 'x', { dy: 18, size: 17, color: 'rose' }); }
      else {
        T(b, mid(A, H), `${fr(p)}`, { dy: 22, size: 16, color: 'green' }); T(b, mid(H, B), `${fr(M.q)}`, { dy: 22, size: 16, color: 'sky' });
        T(b, lerp(Cc, H, 0.5), `${fr(h)}`, { dx: 16, size: 14, color: 'rose' });
        T(b, mid(A, B), `c=${c}`, { dy: 46, size: 16, color: 'amber' });
      }
    },
    steps: (M) => [
      `$AB=${M.c}$, $AC=${M.b}$이고 $CH\\perp AB$예요. 구하는 선분은 $AH=x$예요.`,
      `직각과 공통각 A를 이용하면 $\\triangle ABC\\sim\\triangle ACH$예요. 대응하는 빗변은 AB와 AC예요.`,
      `대응변의 비 $AB:AC=AC:AH$에서 $AB\\times AH=AC^2$예요.`,
      `$${M.c}x=${M.b}^2=${M.b2}$이므로 $x=\\frac{${M.b2}}{${M.c}}$예요.`,
      `따라서 $AH=x=${fr(M.p)}$예요. 빗변을 무조건 반으로 나누지 않아요.`
    ],
    view: (M) => ({
      guide: '막대로 삼각형을 바꿔 보세요. 같은 모양의 각은 같은 표시(●●, ●)예요. <b>AH</b>, <b>HB</b>는 닮음비로 구한 값이에요.',
      readouts: [rd('AH = b² ÷ c', `$${fr(M.p)}$`, 'green', `${M.b2} ÷ ${M.c}`), rd('HB = a² ÷ c', `$${fr(M.q)}$`, 'sky', `${M.a2} ÷ ${M.c}`), rd('AH + HB', `${M.c}`, 'amber', '= c')],
      formula: `<p>$b^2=c\\times AH,\\ \\ a^2=c\\times HB$</p><p>$a^2+b^2=c\\times(AH+HB)=c^2$</p>`,
      rule: '수선으로 나뉜 닮은 삼각형에서 b²=c·AH, a²=c·HB 를 더하면 a²+b²=c²',
      notes: notes('닮은 삼각형은 <b>대응하는 꼭짓점</b>을 맞춰 써야 해요. $AB:AC=AC:AH$에서 가운데 AC가 두 번 나와요.', '수선의 발 H는 빗변을 $AH=\\frac{b^2}{c}$와 $HB=\\frac{a^2}{c}$로 나눠요. 반으로 나누지 않아요.')
    }),
    prob: (M) => {
      const { b: bb, c, p } = M;
      const rr = (v) => texRat(v), pl = (v) => plainRat(v);
      return {
        tag: '[증명] 수선과 닮음', key: `${bb}-${c}`,
        stem: `다음 그림과 같이 $\\angle C=90^\\circ$인 직각삼각형 ABC의 꼭짓점 C에서 빗변 AB에 내린 수선의 발을 H라 하자. $\\overline{AB}=${c}$, $\\overline{AC}=${bb}$일 때, $x=\\overline{AH}$의 길이는?`,
        choices: mkChoices(p, [[(bb * bb) / (c * 2), '$AC^2=AH\\times AB$이므로 AB로 나누어요(2로 나누지 않아요).'], [bb / c, '$AC^2=AH\\times AB$이에요. AC를 제곱해야 해요.'], [(c * c) / bb, 'AC²을 AB로 나누어야 해요. 거꾸로 계산했어요.'], [c - p, '$HB$의 길이예요. 구하는 것은 AH예요.'], [bb, 'AC의 길이예요.'], [(bb * bb) / c + 1, '다시 계산해 보세요.']], { tex: rr, plain: pl, pad: 1 / c })
      };
    }
  };

  G.register(20, 't2', '② 정리의 증명', '정리의 증명', PARAMS, [eu, bh1, bh2, garf, sim]);
})();
