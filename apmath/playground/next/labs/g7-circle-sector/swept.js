/* ==========================================================================
   중1 원과 부채꼴 · 새 탭 모듈 D — "F06 원이 지나간 자리" · "F06 묶인 동물의 영역"
   (AP Math Lab 2.0, g7-circle-sector.html 이 APL_CS_GROUPS 를 읽어 탭으로 붙입니다)

   이 파일이 하는 일
   - 원이 도형 둘레를 실제로 한 바퀴 돌며 지나간 자리를 칠하고 → 직사각형과 모서리 부채꼴로 나눈 뒤
     → 부채꼴을 복사해 가로 한 줄로 늘어놓고 가로로만 밀어 붙여 원 하나를 만듭니다. 원의 중심이 간 길(길이)도 보여 줍니다.
   - 끈에 묶인 강아지·염소·소가 울타리를 돌며 움직일 수 있는 영역을 훑고, 큰 부채꼴과 모서리를 돌아가는 작은 부채꼴로 나눕니다.
     (정사각형 개집 · 직사각형 창고 · 정삼각형 울타리 · 정육각형 가축우리 · 정육각형 둘레에 이어지는 부채꼴)
   - 모든 도형은 슬라이더로 조절할 수 있고, 넓이·길이·정리 단계·정답이 현재 숫자에서 바로 다시 계산됩니다.
   - 이동은 가로로만: 조각을 위아래로 옮기지 않고, 복사본을 한 줄로 놓은 뒤 가로로 밀어서 붙입니다.

   수학 좌표는 y가 위쪽인 cm(m) 단위로 계산하고, 그릴 때만 무대(figure: y 아래쪽 / cartesian)에 맞춰 바꿉니다.
   모듈은 스스로 완결된 IIFE이며 전역으로는 APL_CS_GROUPS 만 씁니다.
   ========================================================================== */
(function () {
  'use strict';

  const PI = Math.PI;
  const TAU = Math.PI * 2;
  const DEG = 180 / Math.PI;
  const RAD = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerp2 = (p, q, t) => [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];
  const seg01 = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  const call = (v, ...a) => (typeof v === 'function' ? v(...a) : v);
  const num = (v, d = 2) => String(+(+v).toFixed(d)).replace('-', '−');
  const CIRC = ['①', '②', '③', '④', '⑤'];
  const wrap2pi = (x) => ((x % TAU) + TAU) % TAU;
  const cpi = (c) => (c === 1 ? 'π' : `${num(c)}π`); // 계수가 1이면 π 만

  /* ------------------------------ 식 문자열 ------------------------------ */
  /** p·π + q (정수) 를 교재식 문자열로 */
  function linPi(p, q) {
    const a = p === 0 ? '' : p === 1 ? 'π' : `${p}π`;
    const b = q === 0 ? '' : String(q);
    return a && b ? `${a}+${b}` : a || b || '0';
  }
  function linPiTex(p, q) {
    const a = p === 0 ? '' : p === 1 ? '\\pi' : `${p}\\pi`;
    const b = q === 0 ? '' : String(q);
    return a && b ? `${a}+${b}` : a || b || '0';
  }
  /** 분수 n/d (기약) 에 π 를 곱한 값 */
  function rat(n, d) { const g = gcd(n, d); return { n: n / g, d: d / g }; }
  const ratVal = (r) => r.n / r.d;
  const ratPi = (r) => (r.d === 1 ? (r.n === 1 ? 'π' : `${r.n}π`) : (r.n === 1 ? `π/${r.d}` : `${r.n}π/${r.d}`));
  const ratPiTex = (r) => (r.d === 1 ? (r.n === 1 ? '\\pi' : `${r.n}\\pi`) : `\\dfrac{${r.n}}{${r.d}}\\pi`);
  const ratAdd = (x, y) => rat(x.n * y.d + y.n * x.d, x.d * y.d);
  const ratSum = (list) => list.reduce((x, y) => ratAdd(x, y), rat(0, 1));
  const choiceTex = (p, q, unit) => (p && q ? `$(${linPiTex(p, q)})\\,\\mathrm{${unit}}$` : `$${linPiTex(p, q)}\\,\\mathrm{${unit}}$`);

  /* ------------------------------ 무대 어댑터 ------------------------------
     수학 좌표(y 위쪽) 점 [x, y] 를 무대 좌표로 바꿔 줍니다. figure 무대는 y 가 아래쪽이라 부호를 뒤집습니다. */
  function W(b) {
    const fig = b.kind === 'figure';
    const P = (p) => ({ x: p[0], y: fig ? -p[1] : p[1] });
    return {
      b,
      fig,
      P,
      unP: (q) => [q.x, fig ? -q.y : q.y],
      toS: (p) => b.toS(P(p)),
      box: (x0, x1, y0, y1) => ({ x: [x0, x1], y: fig ? [-y1, -y0] : [y0, y1] }),
      seg: (p, q, o) => b.seg(P(p), P(q), o),
      path: (pts, o) => b.path(pts.map(P), o),
      poly: (pts, o) => b.poly(pts.map(P), o),
      arc(c, R, t0, t1, o = {}) {
        const ccw = t1 >= t0;
        if (fig) b.arc(P(c), R, -t0, -t1, { ...o, ccw });
        else b.arc(P(c), R, t0, t1, { ...o, cw: !ccw });
      },
      circle(c, R, o) { this.arc(c, R, 0, TAU, o); },
      point: (p, o) => b.point(P(p), o),
      handle: (id, p, o) => b.handle(id, P(p), o),
      ticks: (p, q, o) => b.ticks(P(p), P(q), o),
      right: (v, p1, p2, o) => b.right(P(v), P(p1), P(p2), o),
      angle: (v, p1, p2, o) => b.angle(P(v), P(p1), P(p2), o),
      /** 여러 줄 가운데 맞춤 글자 */
      text(p, lines, o = {}) {
        const arr = Array.isArray(lines) ? lines : [lines];
        const gap = o.gap || 16;
        arr.forEach((ln, i) => b.text(P(p), ln, { align: 'center', baseline: 'middle', weight: 800, size: 13.5, ...o, dy: (o.dy || 0) + (i - (arr.length - 1) / 2) * gap }));
      }
    };
  }
  /** 강조(연결 하이라이트) 상태에 따른 알파 배수 */
  const emK = (b, ref) => (b._em && b._em({ ref }) === -1 ? 0.25 : 1);
  const MARK = 'ink'; // 직각·같은 각·같은 길이 표시는 한 가지 중립색으로

  /** 굵은 띠(원 중심이 지난 길을 따라 반지름 r 만큼 칠한 자리 = 원이 지나간 자리) */
  function bandStroke(w, pts, r, col, alpha) {
    const b = w.b, c = b.ctx;
    if (pts.length < 1 || alpha <= 0) return;
    c.save();
    c.beginPath();
    pts.forEach((p, i) => { const q = w.toS(p); i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); });
    const q0 = w.toS(pts[pts.length - 1]);
    c.lineTo(q0.x + 0.01, q0.y);
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.lineWidth = 2 * r * b.k;
    c.setLineDash([]);
    c.shadowBlur = 0;
    c.strokeStyle = b.color(col, alpha);
    c.stroke();
    c.restore();
  }

  /* ========================================================================
     공용 UI 도우미 (모듈 안에서만 쓰는 작은 함수)
     ======================================================================== */
  const upd = (s) => { s.swGoal = null; };
  const PARAMS = {
    swT: { value: 0, min: 0, max: 1, step: 0.002, color: 'sky', label: '움직인 정도', hint: '막대를 끌면 원이 돌고, 오른쪽 끝에서는 부채꼴이 원 하나로 모여요', format: (v) => `${Math.round(v * 100)}%`, onInput: (s) => { s.playing = false; s.swGoal = null; } },
    swA: { value: 3, min: 2, max: 6, step: 1, color: 'amber', label: '도형의 한 변', format: (v) => `${v} cm`, onInput: upd },
    swW: { value: 4, min: 2, max: 7, step: 1, color: 'amber', label: '가로', format: (v) => `${v} cm`, onInput: upd },
    swH: { value: 2, min: 2, max: 7, step: 1, color: 'sky', label: '세로', format: (v) => `${v} cm`, onInput: upd },
    swR: { value: 1, min: 1, max: 3, step: 1, color: 'green', label: '원의 반지름 r', format: (v) => `${v} cm`, onInput: upd },
    swI: { value: 6, min: 5, max: 12, step: 1, color: 'amber', label: '정사각형의 한 변', format: (v) => `${v} cm`, onInput: upd },
    gtT: { value: 0, min: 0, max: 1, step: 0.002, color: 'sky', label: '움직인 정도', hint: '막대나 그림의 노란 점을 끌어 보세요', format: (v) => `${Math.round(v * 100)}%`, onInput: (s) => { s.playing = false; } },
    gtQ: { value: 2, min: 1, max: 6, step: 1, color: 'amber', label: '개집의 한 변', format: (v) => `${v} m`, onInput: (s) => goatClamp(s) },
    gtA: { value: 5, min: 2, max: 8, step: 1, color: 'amber', label: '창고의 가로 AB', format: (v) => `${v} m`, onInput: (s) => goatClamp(s) },
    gtB: { value: 4, min: 2, max: 8, step: 1, color: 'sky', label: '창고의 세로 AD', format: (v) => `${v} m`, onInput: (s) => goatClamp(s) },
    gtS: { value: 8, min: 3, max: 10, step: 1, color: 'amber', label: '정삼각형의 한 변', format: (v) => `${v} m`, onInput: (s) => goatClamp(s) },
    gtH: { value: 6, min: 3, max: 8, step: 1, color: 'amber', label: '정육각형의 한 변', format: (v) => `${v} m`, onInput: (s) => goatClamp(s) },
    gtL: { value: 5, min: 1, max: 16, step: 1, color: 'green', label: '끈의 길이', format: (v) => `${v} m`, onInput: (s) => goatClamp(s) },
    gtP: { value: 3, min: 2, max: 5, step: 1, color: 'amber', label: '정육각형의 한 변', format: (v) => `${v} cm`, onInput: () => {} },
    gtK: { value: 3, min: 2, max: 4, step: 1, color: 'green', label: '부채꼴의 개수', format: (v) => `${v}개`, onInput: () => {} }
  };

  let styled = false;
  function injectStyle() {
    if (styled || !document.head) return;
    styled = true;
    const st = document.createElement('style');
    st.id = 'csd-style';
    st.textContent = `
.csd-stem { font-size: var(--fs-md); line-height: 1.85; }
.csd-choices { display: grid; gap: 6px; margin: 12px 0 4px; }
.csd-choice { display: flex; align-items: center; gap: 10px; min-height: 42px; padding: 6px 12px; text-align: left; cursor: pointer;
  border: 1px solid var(--line-2); background: var(--card); color: var(--text); border-radius: var(--r-sm); font: inherit; font-size: var(--fs-md); }
.csd-choice:hover { background: var(--hover); }
.csd-choice .no { font-weight: 800; color: var(--text-3); min-width: 1.3em; }
.csd-choice.ok { border-color: var(--m-green); background: color-mix(in srgb, var(--m-green) 16%, var(--card)); }
.csd-choice.bad { border-color: var(--m-red); background: color-mix(in srgb, var(--m-red) 14%, var(--card)); }
.csd-fb { min-height: 1.6em; margin: 4px 0 2px; font-size: var(--fs-sm); line-height: 1.6; color: var(--text-2); }
.csd-fb.ok { color: var(--m-green); font-weight: 800; }
.csd-fb.bad { color: var(--m-red); font-weight: 800; }
.csd-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 8px; }
.csd-ans { display: flex; align-items: center; gap: 8px; margin: 12px 0 4px; font-size: var(--fs-md); }
.csd-ans input { width: 7.5em; min-height: 42px; padding: 6px 10px; border: 1px solid var(--line-2); border-radius: var(--r-sm); background: var(--card); color: var(--text); font: inherit; font-weight: 800; text-align: right; }
.csd-ans input:focus { outline: 2px solid var(--m-sky); outline-offset: 1px; }`;
    document.head.append(st);
  }

  function ensureParams(lab) {
    for (const k of Object.keys(PARAMS)) if (!(k in lab.params)) lab.params[k] = PARAMS[k];
  }
  function defaults(s, over) {
    for (const k of Object.keys(PARAMS)) if (s[k] == null) s[k] = PARAMS[k].value;
    Object.assign(s, over || {});
  }

  /** 단계 설명 문장에 숫자가 들어 있어, 숫자가 바뀌면 정리 탭의 단계 목록을 다시 만듭니다. */
  function syncReview(lab, sc, s) {
    if (!lab || !lab.scene || lab.scene.id !== sc.id || !lab.refs || typeof lab._buildReview !== 'function') return;
    const key = JSON.stringify(call(sc.steps, s));
    if (lab.refs.__csdKey === undefined) { lab.refs.__csdKey = key; return; }
    if (lab.refs.__csdKey !== key) {
      lab.refs.__csdKey = key;
      lab._buildReview();
      lab._dirtyPanel = true;
    }
  }

  /** 서답형 정답 입력 해석: "40", "40π", "147/4", "57 π m²" … → 숫자 (π 앞의 계수) */
  function parseCoef(str) {
    const t = String(str || '').replace(/\s+/g, '').replace(/[πΠ]|pi/gi, '').replace(/m²|cm²|m2|cm2|㎡/g, '').replace(/−/g, '-');
    if (!t) return NaN;
    const m = t.match(/^(-?\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?$/);
    if (!m) return NaN;
    return m[2] ? +m[1] / +m[2] : +m[1];
  }

  /** 문제 탭의 보기 단추·숫자 바꾸기 단추 (패널에 한 번만 붙이는 위임 이벤트) */
  function bindProblemUI(lab) {
    const pane = lab.ui && lab.ui.panes && lab.ui.panes.problem;
    if (!pane || pane.__csdBound) return;
    pane.__csdBound = true;
    pane.addEventListener('click', (e) => {
      const el = e.target.closest && e.target.closest('[data-csd-act]');
      if (!el) return;
      const sc = lab.scene;
      if (!sc || !sc.csd) return;
      const s = lab.s, act = el.getAttribute('data-csd-act'), val = +el.getAttribute('data-csd-val');
      const P = sc.csd;
      if (act === 'pick') { s.csdPick = val; s.csdSig = P.sig(s); }
      else if (act === 'check') {
        const inp = pane.querySelector('[data-csd-input]');
        const v = parseCoef(inp ? inp.value : '');
        const want = ratVal(P.make(s).free.coef);
        s.csdPick = Number.isFinite(v) && Math.abs(v - want) < 1e-6 ? 1 : 2;
        s.csdSig = P.sig(s);
        s.csdText = inp ? inp.value : '';
      } else if (act === 'again') { P.again(s); resetRun(s); }
      else if (act === 'reset') { P.reset(s); resetRun(s); }
      lab.invalidate(true);
      if (act !== 'pick' && act !== 'check' && lab._saveHashSoon) lab._saveHashSoon();
    });
    pane.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target && e.target.matches && e.target.matches('[data-csd-input]')) {
        const b = pane.querySelector('[data-csd-act="check"]');
        if (b) b.click();
      }
    });
  }
  function resetRun(s) {
    s.csdPick = 0;
    s.csdText = '';
    s.step = 1;
    s.revealed = false;
    s.playing = false;
    s.swT = 0;
    s.swGoal = null;
    s.gtT = 0;
  }
  /** 문제 탭 본문(HTML): 문제 → (보기 ①~⑤ 눌러서 답해 보기 | 서답형 정답 입력) → 숫자 바꾸기 */
  function problemHTML(sc, s) {
    const P = sc.csd.make(s);
    const sig = sc.csd.sig(s);
    const pick = s.csdSig === sig ? s.csdPick || 0 : 0;
    let h = `<div class="csd-stem">${P.stem}</div>`;
    let fb;
    if (P.free) {
      const val = pick && s.csdSig === sig ? String(s.csdText || '').replace(/"/g, '&quot;') : '';
      h += `<div class="csd-ans"><span>답</span><input type="text" inputmode="decimal" autocomplete="off" data-csd-input value="${val}" aria-label="정답 입력"><span>${P.free.unit}</span><button type="button" class="apl-btn sm primary" data-csd-act="check">확인</button></div>`;
      fb = pick ? (pick === 1 ? ['ok', `정답이에요! ${P.free.show}`] : ['bad', 'π 앞의 수를 다시 구해 보세요. 정리 탭의 단계를 따라가 보세요. (분수는 147/4 처럼 써요)']) : ['', 'π 앞의 수를 써서 확인해 보세요. 예: 40 또는 147/4'];
    } else {
      h += '<div class="csd-choices">';
      P.choices.forEach((c, i) => {
        const cls = pick === i + 1 ? (i === P.ans ? ' ok' : ' bad') : '';
        h += `<button type="button" class="csd-choice${cls}" data-csd-act="pick" data-csd-val="${i + 1}"><span class="no">${CIRC[i]}</span><span>${c}</span></button>`;
      });
      h += '</div>';
      fb = pick ? (pick === P.ans + 1 ? ['ok', '정답이에요! 정리 탭에서 풀이 과정도 확인해 보세요.'] : ['bad', '아직이에요. 정리 탭의 단계를 하나씩 따라가 보세요.']) : ['', '보기를 눌러 답해 볼 수 있어요.'];
    }
    h += `<div class="csd-fb ${fb[0]}">${fb[1]}</div>`;
    h += '<div class="csd-row"><button type="button" class="apl-btn sm" data-csd-act="again">숫자 바꾸기</button>';
    if (!sc.csd.isDefault(s)) h += '<button type="button" class="apl-btn sm ghost" data-csd-act="reset">처음 숫자로</button>';
    h += '</div>';
    return h;
  }
  const pickRandom = (list, cur, same) => {
    const rest = list.filter((x) => !same(x, cur));
    const pool = rest.length ? rest : list;
    return pool[Math.floor(Math.random() * pool.length) % pool.length];
  };

  /** 정리 탭 단계에 맞춰 움직임(swT)을 부드럽게 옮기고, 재생 중이면 시간을 흘려 보냅니다. */
  function makeTick(stepT) {
    return (s, dt, lab) => {
      let again = false;
      if (lab.tab === 'review') {
        if (s.swStepSeen !== s.step) { s.swStepSeen = s.step; s.swGoal = stepT(s.step); s.playing = false; }
      } else { s.swStepSeen = -1; if (lab.tab !== 'explore') s.swGoal = null; }
      if (s.swGoal != null) {
        const d = s.swGoal - s.swT;
        if (Math.abs(d) < 0.002) { s.swT = s.swGoal; s.swGoal = null; }
        else { s.swT += Math.sign(d) * Math.min(Math.abs(d), 0.33 * dt); again = true; }
      }
      if (s.playing) {
        s.swT = Math.min(1, s.swT + dt / 16);
        if (s.swT >= 1) s.playing = false;
        again = true;
      }
      return again;
    };
  }
  /* ========================================================================
     1. 원이 지나간 자리 — 모델
     ======================================================================== */
  /** 볼록 다각형 바깥을 반지름 r 인 원이 변에 붙어 한 바퀴 도는 모델 */
  function sweepModel(shape, a, b, r) {
    if (shape === 'square') b = a;
    let V, f0 = 0.343; // f0: 원이 첫 변(edge 0) 위 어디에서 출발하는지(교재 그림처럼 변의 오른쪽 가까이)
    if (shape === 'square' || shape === 'rect') V = [[a, b], [0, b], [0, 0], [a, 0]];
    else { const h = (a * Math.sqrt(3)) / 2; V = [[0, 0], [a, 0], [a / 2, h]]; f0 = 0.5; }
    const n = V.length;
    const E = V.map((p, i) => {
      const q = V[(i + 1) % n];
      const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy);
      const d = [dx / len, dy / len];
      return { i, p, q, len, d, n: [d[1], -d[0]] };
    });
    const C = V.map((p, i) => {
      const e0 = E[(i + n - 1) % n], e1 = E[i];
      const t0 = Math.atan2(e0.n[1], e0.n[0]);
      let phi = Math.atan2(e1.n[1], e1.n[0]) - t0;
      while (phi <= 1e-9) phi += TAU;
      while (phi > TAU) phi -= TAU;
      return { i, p, t0, t1: t0 + phi, phi, deg: Math.round(phi * DEG) };
    });
    const per = E.reduce((x, e) => x + e.len, 0);
    const off = (p, e, k) => [p[0] + k * e.n[0], p[1] + k * e.n[1]];
    const e0 = E[0];
    const start = [e0.p[0] + e0.d[0] * e0.len * f0 + r * e0.n[0], e0.p[1] + e0.d[1] * e0.len * f0 + r * e0.n[1]];
    // 원의 중심이 지나는 길(변에서 r 만큼 바깥): 직선 → 호 → 직선 …
    const items = [{ k: 'line', p0: start, p1: off(e0.q, e0, r), len: e0.len * (1 - f0), edge: 0 }];
    for (let i = 1; i < n; i++) {
      items.push({ k: 'arc', c: C[i].p, R: r, t0: C[i].t0, t1: C[i].t1, len: r * C[i].phi, corner: i });
      items.push({ k: 'line', p0: off(E[i].p, E[i], r), p1: off(E[i].q, E[i], r), len: E[i].len, edge: i });
    }
    items.push({ k: 'arc', c: C[0].p, R: r, t0: C[0].t0, t1: C[0].t1, len: r * C[0].phi, corner: 0 });
    items.push({ k: 'line', p0: off(e0.p, e0, r), p1: start, len: e0.len * f0, edge: 0 });
    const Lc = items.reduce((x, it) => x + it.len, 0);

    function centerAt(sl) {
      sl = clamp(sl, 0, Lc);
      let acc = 0;
      for (let j = 0; j < items.length; j++) {
        const it = items[j];
        if (sl <= acc + it.len + 1e-12 || j === items.length - 1) {
          const u = it.len > 0 ? clamp((sl - acc) / it.len, 0, 1) : 0;
          if (it.k === 'line') {
            const p = lerp2(it.p0, it.p1, u), n = E[it.edge].n;
            return { p, contact: [p[0] - r * n[0], p[1] - r * n[1]], item: j };
          }
          const th = it.t0 + (it.t1 - it.t0) * u;
          return { p: [it.c[0] + r * Math.cos(th), it.c[1] + r * Math.sin(th)], contact: it.c, item: j };
        }
        acc += it.len;
      }
      return null;
    }
    // 촘촘히 잘라 둔 길(그리기·끌기용)
    const dense = [];
    {
      let acc = 0;
      for (const it of items) {
        const m = Math.max(2, Math.ceil(it.len / 0.08));
        for (let j = 0; j <= m; j++) {
          const u = j / m;
          const p = it.k === 'line' ? lerp2(it.p0, it.p1, u) : [it.c[0] + r * Math.cos(it.t0 + (it.t1 - it.t0) * u), it.c[1] + r * Math.sin(it.t0 + (it.t1 - it.t0) * u)];
          dense.push({ s: acc + it.len * u, p });
        }
        acc += it.len;
      }
    }
    const ptsUpTo = (sl) => {
      const out = [];
      for (const d of dense) { if (d.s > sl) break; out.push(d.p); }
      const e = centerAt(sl);
      if (e) out.push(e.p);
      return out;
    };
    const project = (pt) => {
      let best = 0, bd = Infinity;
      for (const d of dense) { const q = (d.p[0] - pt[0]) ** 2 + (d.p[1] - pt[1]) ** 2; if (q < bd) { bd = q; best = d.s; } }
      return best;
    };

    // 지나간 자리를 이루는 조각 (직사각형 · 모서리 부채꼴) / 중심이 간 길을 이루는 조각 (선분 · 호)
    const rects = E.map((e) => ({ i: e.i, pts: [e.p, e.q, off(e.q, e, 2 * r), off(e.p, e, 2 * r)], dir: e.n, len: e.len, w: 2 * r }));
    const secs = C.map((c) => ({ i: c.i, c: c.p, R: 2 * r, t0: c.t0, t1: c.t1, deg: c.deg, dir: [Math.cos((c.t0 + c.t1) / 2), Math.sin((c.t0 + c.t1) / 2)] }));
    const segs = E.map((e) => ({ i: e.i, p0: off(e.p, e, r), p1: off(e.q, e, r), dir: e.n, len: e.len }));
    const arcs = C.map((c) => ({ i: c.i, c: c.p, R: r, t0: c.t0, t1: c.t1, deg: c.deg, dir: [Math.cos((c.t0 + c.t1) / 2), Math.sin((c.t0 + c.t1) / 2)] }));

    const xs = V.map((p) => p[0]), ys = V.map((p) => p[1]);
    const bb = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
    return {
      shape, a, b, r, V, E, C, n, per, items, Lc, centerAt, ptsUpTo, project, rects, secs, segs, arcs, bb, f0, start,
      rectArea: per * 2 * r, secArea: PI * (2 * r) * (2 * r), area: per * 2 * r + PI * 4 * r * r,
      pathArea: null
    };
  }

  /** 정사각형 안쪽을 도는 경우: 한 변 a 인 정사각형 안에서 반지름 r 인 원이 벽에 붙어 한 바퀴 */
  function insideModel(a, r) {
    a = Math.max(a, 4 * r + 1); // 가운데 정사각형이 남도록
    const V = [[0, 0], [a, 0], [a, a], [0, a]]; // 반시계
    const m = a - 2 * r; // 중심이 지나는 정사각형의 한 변
    const cs = [[r, r], [a - r, r], [a - r, a - r], [r, a - r]]; // 중심이 가는 정사각형 꼭짓점(반시계)
    const f0 = 0.5;
    const items = [];
    const start = [r + m * f0, r];
    items.push({ k: 'line', p0: start, p1: cs[1], len: m * (1 - f0) });
    items.push({ k: 'line', p0: cs[1], p1: cs[2], len: m });
    items.push({ k: 'line', p0: cs[2], p1: cs[3], len: m });
    items.push({ k: 'line', p0: cs[3], p1: cs[0], len: m });
    items.push({ k: 'line', p0: cs[0], p1: start, len: m * f0 });
    const Lc = items.reduce((x, it) => x + it.len, 0);
    const dense = [];
    { let acc = 0; for (const it of items) { const k = Math.max(2, Math.ceil(it.len / 0.08)); for (let j = 0; j <= k; j++) { const u = j / k; dense.push({ s: acc + it.len * u, p: lerp2(it.p0, it.p1, u) }); } acc += it.len; } }
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // 중심에서 가장 가까운 벽 방향(아래·오른쪽·위·왼쪽)
    function centerAt(sl) {
      sl = clamp(sl, 0, Lc);
      let acc = 0;
      for (let j = 0; j < items.length; j++) {
        const it = items[j];
        if (sl <= acc + it.len + 1e-12 || j === items.length - 1) {
          const u = it.len > 0 ? clamp((sl - acc) / it.len, 0, 1) : 0;
          const p = lerp2(it.p0, it.p1, u);
          const wall = j === 0 || j === 4 ? 0 : j; // 0:아래 1:오른쪽 2:위 3:왼쪽
          return { p, contact: [p[0] + r * dirs[wall][0], p[1] + r * dirs[wall][1]], item: j };
        }
        acc += it.len;
      }
      return null;
    }
    const ptsUpTo = (sl) => { const o = []; for (const d of dense) { if (d.s > sl) break; o.push(d.p); } const e = centerAt(sl); if (e) o.push(e.p); return o; };
    const project = (pt) => { let best = 0, bd = Infinity; for (const d of dense) { const q = (d.p[0] - pt[0]) ** 2 + (d.p[1] - pt[1]) ** 2; if (q < bd) { bd = q; best = d.s; } } return best; };
    // 모서리에서 원이 닿지 못하는 조각: 한 변 r 인 정사각형에서 사분원(반지름 r)을 뺀 모양 4개
    const corners = [[0, 0, 0], [a - r, 0, 1], [a - r, a - r, 2], [0, a - r, 3]].map(([x, y, i]) => {
      const c = [[r, r], [a - r, r], [a - r, a - r], [r, a - r]][i];
      const dirOut = [[-1, -1], [1, -1], [1, 1], [-1, 1]][i];
      const nl = Math.hypot(dirOut[0], dirOut[1]);
      return { i, x, y, c, dir: [dirOut[0] / nl, dirOut[1] / nl], t0: [PI, 1.5 * PI, 0, 0.5 * PI][i], t1: [1.5 * PI, 2 * PI, 0.5 * PI, PI][i] };
    });
    const hole = a - 4 * r; // 가운데 못 가는 정사각형의 한 변
    return { shape: 'inside', a, r, V, m, cs, items, Lc, centerAt, ptsUpTo, project, corners, hole, f0, start, bb: { x0: 0, x1: a, y0: 0, y1: a },
      per: 4 * m,
      // 지나간 자리 = 바깥 정사각형 − 가운데 정사각형 − 모서리 4곳(r² − πr²/4)
      area: a * a - hole * hole - 4 * (r * r - (PI * r * r) / 4),
      outerRing: a * a - hole * hole, corner4: 4 * r * r - PI * r * r };
  }

  /* ------------------------------ 시간표 ------------------------------
     0~0.5 원이 한 바퀴 → 0.5~0.6 조각으로 나누기(제자리에서 색만 바뀜) → 0.6~0.7 부채꼴 복사본이 옆에 한 줄로 나타남
     → 0.72~0.96 복사본을 가로로만 밀어 붙여 원 하나 */
  const T = { travel: 0.5, e0: 0.5, e1: 0.6, c0: 0.6, c1: 0.7, g0: 0.72, g1: 0.96 };
  const phaseOf = (t) => (t < T.travel - 1e-9 ? 'travel' : t < T.e1 ? 'split' : t < T.g0 ? 'copy' : t < T.g1 ? 'slide' : 'done');
  const STEP_T = (step) => ({ 1: 0.6, 2: 0.6, 3: 1, 4: 1 })[step] != null ? ({ 1: 0.6, 2: 0.6, 3: 1, 4: 1 })[step] : 0.6;
  const STEP_FOCUS = { 1: 'A', 2: 'B', 3: 'C' };

  /** 복사본을 놓을 한 줄(가로)의 자리와 무대 범위. 가로가 넓으면 그림 오른쪽, 좁은 화면(세로로 긴 화면)에서는 그림 아래에 나타납니다. */
  function sweepLayout(M, pathMode, land) {
    const r = M.r, R = pathMode ? r : 2 * r;
    const pieces = pathMode ? M.arcs : M.secs;
    const mids = pieces.map((p) => (p.t0 + p.t1) / 2);
    const d = 0.9 * R;
    let hw = R;
    pieces.forEach((p, i) => { for (let k = 0; k <= 16; k++) { const th = p.t0 + ((p.t1 - p.t0) * k) / 16; hw = Math.max(hw, Math.abs(d * Math.cos(mids[i]) + R * Math.cos(th))); } });
    const mg = pathMode ? r + 1.15 : 2 * r + 0.55;
    const home = { x0: M.bb.x0 - mg, x1: M.bb.x1 + mg, y0: M.bb.y0 - mg, y1: M.bb.y1 + mg };
    const cx = (home.x0 + home.x1) / 2, cy = (home.y0 + home.y1) / 2;
    const under = 1.2; // 복사본 아래 글자 자리
    let G, box;
    if (land) {
      G = [home.x1 + 0.7 + hw, cy];
      box = { x0: home.x0, x1: G[0] + hw + 0.4, y0: Math.min(home.y0, G[1] - R - under), y1: Math.max(home.y1, G[1] + R + 0.4) };
    } else {
      G = [cx, home.y0 - 0.6 - R - under];
      box = { x0: Math.min(home.x0, G[0] - hw - 0.4), x1: Math.max(home.x1, G[0] + hw + 0.4), y0: G[1] - R - under, y1: home.y1 };
    }
    return { G, d, R, hw, mids, home, box };
  }

  /* ========================================================================
     3. 원이 지나간 자리 — 그리기
     ======================================================================== */
  function drawEdgeMarks(w, M) {
    if (M.shape === 'square' || M.shape === 'rect') {
      M.V.forEach((v, i) => w.right(v, M.V[(i + 1) % 4], M.V[(i + 3) % 4], { size: 10, color: MARK }));
      const sq = M.shape === 'square';
      M.E.forEach((e, i) => w.ticks(e.p, e.q, { color: MARK, count: sq ? 1 : (i % 2 === 0 ? 1 : 2), size: 6 }));
    } else {
      M.E.forEach((e) => w.ticks(e.p, e.q, { color: MARK, count: 1, size: 6 }));
      M.V.forEach((v, i) => w.angle(v, M.V[(i + 1) % 3], M.V[(i + 2) % 3], { r: 22, color: MARK, rings: 1 }));
    }
  }
  /** 도형 안쪽에 변의 길이 표시 */
  function drawEdgeLabels(w, M, alpha) {
    M.E.forEach((e) => {
      const mid = [(e.p[0] + e.q[0]) / 2, (e.p[1] + e.q[1]) / 2];
      w.text([mid[0] - e.n[0] * 0.45, mid[1] - e.n[1] * 0.45], num(e.len), { color: 'ink', alpha });
    });
  }
  const degTxt = (list) => (list.every((x) => x === list[0]) ? `${list[0]}°×${list.length} = 360°` : `${list.join('°+')}° = 360°`);

  function drawSweep(b, s, v, lab, sc) {
    const w = W(b);
    const thumb = !!b.thumb;
    const tab = thumb ? 'thumb' : (lab && lab.tab) || 'explore';
    if (sc.shape === 'inside') return drawInside(b, w, s, tab);
    const pathMode = sc.mode === 'path';
    const dd = sc.dims(s);
    const M = sweepModel(sc.shape, dd.a, dd.b, s.swR);
    const land = b.W >= b.H * 1.05;
    const L = sweepLayout(M, pathMode, land);
    if (tab === 'problem') return drawSweepProblem(b, w, M);
    const r = M.r, R = L.R;
    const t = thumb ? 1 : clamp(s.swT, 0, 1);
    const step = tab === 'review' ? s.step : 0;
    // 처음에는 도형 가까이를 크게, 복사본이 나타날 때 화면이 함께 넓어집니다(카메라만 움직임)
    {
      const k = ease(seg01(t, 0.55, 0.72));
      b.setFocus(w.box(lerp(L.home.x0, L.box.x0, k), lerp(L.home.x1, L.box.x1, k), lerp(L.home.y0, L.box.y0, k), lerp(L.home.y1, L.box.y1, k)), false);
    }
    const e = seg01(t, T.e0, T.e1), cp = seg01(t, T.c0, T.c1), g = ease(seg01(t, T.g0, T.g1));
    const sl = clamp(t / T.travel, 0, 1) * M.Lc;
    const dim = (grp) => (tab === 'review' && step < 4 && grp !== STEP_FOCUS[step] ? 0.3 : 1);
    const la = seg01(e, 0.6, 1); // 조각 안 글자가 나타나는 정도
    const showA = tab === 'review' ? step >= 1 : true;
    const showB = tab === 'review' ? step >= 2 : true;

    /* 1) 지나간 자리(띠)와 중심이 간 길: 한 바퀴 도는 동안 → 조각 색으로 바뀜 */
    if (!pathMode && sl > 0 && e < 1) bandStroke(w, M.ptsUpTo(sl), r, 'sky', 0.3 * (1 - e) * emK(b, 'band'));
    /* 2) 도형 */
    w.poly(M.V, { fill: 'muted', fillAlpha: 0.2, color: 'ink', width: 2.8 });
    if (!thumb) drawEdgeMarks(w, M);
    drawEdgeLabels(w, M, 0.95);
    if (pathMode && sl > 0 && e < 1) w.path(M.ptsUpTo(sl), { color: 'violet', width: 3.6, ref: 'path', alpha: (1 - e) * emK(b, 'path') });

    /* 3) 조각 (제자리) */
    if (e > 0) {
      if (!pathMode) {
        M.rects.forEach((rc) => {
          const k = dim('A') * e;
          w.poly(rc.pts, { fill: 'sky', fillAlpha: 0.3 * k, color: 'sky', width: 2.4, alpha: k, ref: 'rects' });
          if (showA && !thumb) {
            const c = [(rc.pts[0][0] + rc.pts[2][0]) / 2, (rc.pts[0][1] + rc.pts[2][1]) / 2];
            w.text(c, [`${num(rc.len)} × ${num(rc.w)}`, `= ${num(rc.len * rc.w)}`], { color: 'ink', alpha: dim('A') * la, ref: 'rects' });
          }
        });
        M.secs.forEach((sc2, si) => {
          const k = dim('B') * e * (1 - 0.5 * cp);
          const ap = sc2.c;
          w.arc(ap, sc2.R, sc2.t0, sc2.t1, { sector: true, fill: 'amber', fillAlpha: 0.34 * k, color: 'amber', width: 2.4, alpha: k, ref: 'sectors' });
          if (thumb) return;
          const p1 = [ap[0] + Math.cos(sc2.t0), ap[1] + Math.sin(sc2.t0)], p2 = [ap[0] + Math.cos(sc2.t1), ap[1] + Math.sin(sc2.t1)];
          if (sc2.deg === 90) w.right(ap, p1, p2, { size: 9, color: MARK });
          else w.angle(ap, p1, p2, { r: 16, color: MARK, rings: 1 });
          const demo = tab === 'review' && step === 2 && si === 0 && e > 0.97 && cp < 0.05;
          if (showB) {
            const mid = (sc2.t0 + sc2.t1) / 2, ang = demo ? mid - (sc2.t1 - sc2.t0) * 0.3 : mid, f = demo ? 0.68 : 0.6;
            w.text([ap[0] + Math.cos(ang) * sc2.R * f, ap[1] + Math.sin(ang) * sc2.R * f], [`r = ${num(sc2.R)}`, `${sc2.deg}°`], { color: 'ink', alpha: dim('B') * la * (1 - 0.4 * cp), ref: 'sectors' });
          }
          // 정리 2단계: 부채꼴의 반지름이 2r 인 까닭 (꼭짓점 → 중심 r, 중심 → 원의 가장자리 r)
          if (demo) {
            const cc = [ap[0] + sc2.dir[0] * r, ap[1] + sc2.dir[1] * r];
            w.circle(cc, r, { color: 'green', width: 2, dash: true });
            w.seg(ap, [ap[0] + sc2.dir[0] * 2 * r, ap[1] + sc2.dir[1] * 2 * r], { color: 'green', width: 2.4 });
            w.point(cc, { color: 'violet', r: 3.6, glow: false });
            const pp = [-sc2.dir[1], sc2.dir[0]];
            [0.5, 1.5].forEach((f) => w.text([ap[0] + sc2.dir[0] * r * f, ap[1] + sc2.dir[1] * r * f], num(r), { color: 'green', dx: pp[0] * 13, dy: -pp[1] * 13 }));
          }
        });
      } else {
        M.segs.forEach((sg) => {
          const k = dim('A') * e;
          w.seg(sg.p0, sg.p1, { color: 'violet', width: 4.2, alpha: k, ref: 'segs' });
          if (thumb) return;
          w.ticks(sg.p0, sg.p1, { color: MARK, count: M.shape === 'rect' ? (sg.i % 2 === 0 ? 1 : 2) : 1, size: 6 });
          if (showA) w.text([(sg.p0[0] + sg.p1[0]) / 2 + sg.dir[0] * 0.6, (sg.p0[1] + sg.p1[1]) / 2 + sg.dir[1] * 0.6], num(sg.len), { color: 'violet', alpha: dim('A') * la, ref: 'segs' });
        });
        M.arcs.forEach((ar) => {
          const k = dim('B') * e * (1 - 0.5 * cp);
          w.arc(ar.c, ar.R, ar.t0, ar.t1, { color: 'amber', width: 4.2, alpha: k, ref: 'arcs' });
          if (thumb) return;
          if (showB) w.text([ar.c[0] + ar.dir[0] * (ar.R + 0.75), ar.c[1] + ar.dir[1] * (ar.R + 0.75)], [`r = ${num(ar.R)}`, `${ar.deg}°`], { color: 'amber', alpha: dim('B') * la, ref: 'arcs' });
        });
      }
    }

    /* 4) 복사본: 옆에 가로 한 줄로 나타나서, 가로로만 밀려 한 점에 모임 */
    if (cp > 0) {
      const k = dim('C');
      const pieces = pathMode ? M.arcs : M.secs;
      pieces.forEach((pc, i) => {
        const ap = [L.G[0] + L.d * Math.cos(L.mids[i]) * (1 - g), L.G[1]];
        if (pathMode) w.arc(ap, R, pc.t0, pc.t1, { color: 'amber', width: 4.2, alpha: cp * k, ref: 'arcs' });
        else w.arc(ap, R, pc.t0, pc.t1, { sector: true, fill: 'amber', fillAlpha: 0.34 * cp * k, color: 'amber', width: 2.4, alpha: cp * k, ref: 'sectors' });
        if (!thumb && g < 0.3) {
          const mid = L.mids[i];
          w.text([ap[0] + Math.cos(mid) * R * 0.62, ap[1] + Math.sin(mid) * R * 0.62], `${pc.deg}°`, { color: 'ink', alpha: cp * k * (1 - g / 0.3), ref: pathMode ? 'arcs' : 'sectors', size: 12.5 });
        }
      });
      if (g > 0.98 && !thumb) {
        const small = R * b.k < 110;
        if (!pathMode) w.circle(L.G, R, { color: 'amber', width: 1.6, dash: true, alpha: 0.7 * k, ref: 'sectors' });
        const lines = pathMode ? [`r = ${num(R)}`, small ? '합 360°' : degTxt(M.arcs.map((x) => x.deg))] : [`r = ${num(R)}`, small ? `${M.secs.length}개의 합 360°` : degTxt(M.secs.map((x) => x.deg))];
        w.text(L.G, lines, { color: 'ink', alpha: k, ref: pathMode ? 'arcs' : 'sectors', gap: 17, dy: pathMode ? 0 : -18, size: small ? 12.5 : 13.5 });
        w.text([L.G[0], L.G[1] - R - 0.7], pathMode ? `원의 둘레 2π × ${num(R)} = ${num(2 * R)}π` : `π × ${num(R)}² = ${num(R * R)}π`, { color: 'amber', alpha: k, size: 14, ref: pathMode ? 'arcs' : 'sectors' });
      }
    }

    /* 5) 움직이는 원 · 중심 */
    const ca = 1 - e;
    if (ca > 0 && !thumb) {
      const cc = M.centerAt(sl);
      if (!pathMode && sl > 0) w.path(M.ptsUpTo(sl), { color: 'violet', width: 2.6, dash: true, alpha: ca * emK(b, 'path'), ref: 'path' });
      w.circle(cc.p, r, { color: 'green', width: 2.8, fill: 'green', fillAlpha: 0.14, alpha: ca, ref: 'circle' });
      w.seg(cc.p, cc.contact, { color: 'green', width: 2.4, alpha: ca, ref: 'circle' });
      const u = [(cc.contact[0] - cc.p[0]) / r, (cc.contact[1] - cc.p[1]) / r];
      const mid = [(cc.p[0] + cc.contact[0]) / 2, (cc.p[1] + cc.contact[1]) / 2];
      w.text(mid, `r = ${num(r)}`, { color: 'green', alpha: ca, dx: -u[1] * 32, dy: -u[0] * 32, ref: 'circle' });
      if (tab === 'explore' && e <= 0) {
        w.handle('swc', cc.p, {
          color: 'amber', r: 6, ariaLabel: '원을 끌어 도형 둘레를 따라 움직이기',
          drag: (q) => {
            let sNew = M.project(w.unP(q));
            if (Math.abs(sNew - sl) > M.Lc / 2) sNew = sl > M.Lc / 2 ? M.Lc : 0;
            s.swT = clamp((sNew / M.Lc) * T.travel, 0, T.travel);
            s.playing = false;
            s.swGoal = null;
          }
        });
      } else w.point(cc.p, { color: 'violet', r: 4.5, glow: false });
    }
  }

  /** 문제 탭 그림: 도형 위쪽 변에 원이 붙어 있고, 반지름·변의 길이를 크게 적습니다. */
  function drawSweepProblem(b, w, M) {
    const r = M.r, bb = M.bb, tri = M.shape === 'tri';
    b.setFocus(w.box(bb.x0 - 1.4, bb.x1 + 2 * r + 2.1, bb.y0 - (tri ? 2 * r + 1.2 : 1.2), bb.y1 + (tri ? 1 : 2 * r + 1)), false);
    w.poly(M.V, { fill: 'muted', fillAlpha: 0.2, color: 'ink', width: 2.8 });
    drawEdgeMarks(w, M);
    const cc = M.centerAt(0);
    w.circle(cc.p, r, { color: 'green', width: 2.8, fill: 'green', fillAlpha: 0.14 });
    w.point(cc.p, { color: 'ink', r: 3.6, glow: false });
    w.seg(cc.p, [cc.p[0] + r, cc.p[1]], { color: 'green', width: 2.4, dash: true });
    w.text([cc.p[0] + r, cc.p[1]], `${num(r)} cm`, { color: 'green', align: 'left', dx: 9, dy: -3 });
    if (tri) {
      const e0 = M.E[0];
      w.text([(e0.p[0] + e0.q[0]) / 2, e0.p[1] + 0.5], `${num(e0.len)} cm`, { color: 'ink' });
    } else {
      w.text([(bb.x0 + bb.x1) / 2, bb.y0 - 0.6], `${num(bb.x1 - bb.x0)} cm`, { color: 'ink' });
      if (M.shape === 'rect') w.text([bb.x1 + 0.7, (bb.y0 + bb.y1) / 2], `${num(bb.y1 - bb.y0)} cm`, { color: 'ink', align: 'left' });
    }
  }

  /** 모서리 조각(정사각형 r×r 에서 반지름 r 인 사분원을 뺀 모양). (x, y) 는 조각의 아래 왼쪽 꼭짓점, c 는 사분원 중심(조각 안 좌표) */
  function drawRemnant(w, x, y, r, c, alpha, ref) {
    const b = w.b, ctx = b.ctx, k = b.k;
    const p0 = w.toS([x, y]), p1 = w.toS([x + r, y + r]);
    const cx = Math.min(p0.x, p1.x), cy = Math.min(p0.y, p1.y), cw = Math.abs(p1.x - p0.x), ch = Math.abs(p1.y - p0.y);
    const cc = w.toS([x + c[0], y + c[1]]);
    const a = alpha * emK(b, ref);
    ctx.save();
    ctx.beginPath(); ctx.rect(cx, cy, cw, ch); ctx.clip();
    ctx.beginPath(); ctx.rect(cx, cy, cw, ch); ctx.moveTo(cc.x + r * k, cc.y); ctx.arc(cc.x, cc.y, r * k, 0, TAU);
    ctx.fillStyle = b.color('amber', 0.38 * a);
    ctx.fill('evenodd');
    ctx.setLineDash([]); ctx.shadowBlur = 0;
    ctx.strokeStyle = b.color('amber', a); ctx.lineWidth = 2.4 * b.lw;
    ctx.beginPath(); ctx.rect(cx, cy, cw, ch); ctx.stroke();
    ctx.beginPath(); ctx.arc(cc.x, cc.y, r * k, 0, TAU); ctx.stroke();
    ctx.restore();
  }

  /** 정사각형 안쪽 장면 */
  function drawInside(b, w, s, tab) {
    const thumb = !!b.thumb;
    const M = insideModel(s.swI, s.swR);
    const a = M.a, r = M.r;
    const land = b.W >= b.H * 1.05;
    const d = 0.75 * r + 0.3, hw = r + d;
    const home = { x0: -0.7, x1: a + 0.7, y0: -1.2, y1: a + 0.6 };
    let G, box;
    if (land) { G = [home.x1 + 0.7 + hw, a / 2]; box = { x0: home.x0, x1: G[0] + hw + 0.4, y0: Math.min(home.y0, G[1] - r - 1.3), y1: home.y1 }; }
    else { G = [a / 2, home.y0 - 0.5 - r - 1.4]; box = { x0: home.x0, x1: home.x1, y0: G[1] - r - 1.4, y1: home.y1 }; }
    const t = thumb ? 1 : clamp(s.swT, 0, 1);
    const k0 = ease(seg01(t, 0.55, 0.72));
    if (tab === 'problem') b.setFocus(w.box(-1.3, a + 2.2 * r + 1.5, -1.3, a + 1), false);
    else b.setFocus(w.box(lerp(home.x0, box.x0, k0), lerp(home.x1, box.x1, k0), lerp(home.y0, box.y0, k0), lerp(home.y1, box.y1, k0)), false);
    const step = tab === 'review' ? s.step : 0;
    const e = tab === 'problem' ? 0 : seg01(t, T.e0, T.e1), cp = tab === 'problem' ? 0 : seg01(t, T.c0, T.c1), g = tab === 'problem' ? 0 : ease(seg01(t, T.g0, T.g1));
    const sl = tab === 'problem' ? 0 : clamp(t / T.travel, 0, 1) * M.Lc;
    const showA = tab === 'review' ? step >= 1 : true;
    const FG = { 1: 'A', 2: 'B', 3: 'C' };
    const dim = (grp) => (tab === 'review' && step < 4 && grp !== FG[step] ? 0.3 : 1);
    const la = seg01(e, 0.6, 1);

    // 지나간 자리: 중심이 간 길을 따라 반지름 r 만큼 칠한 띠(모서리에서는 사분원까지만 칠해집니다)
    if (tab !== 'problem') {
      const slB = e > 0 ? M.Lc : sl;
      if (slB > 0) bandStroke(w, M.ptsUpTo(slB), r, 'sky', 0.3 * dim('A') * emK(b, 'band'));
    }
    w.poly(M.V, { color: 'ink', width: 2.8 });
    // 가운데 정사각형(원이 못 가는 곳)
    if (e > 0) {
      const h0 = (a - M.hole) / 2;
      w.poly([[h0, h0], [h0 + M.hole, h0], [h0 + M.hole, h0 + M.hole], [h0, h0 + M.hole]], { fill: 'muted', fillAlpha: 0.25 * e, color: 'ink', width: 1.8, alpha: 0.7 * e });
      if (!thumb && showA) w.text([a / 2, a / 2], [`${num(M.hole)} × ${num(M.hole)}`, '못 가는 곳'], { color: 'ink', alpha: la * dim('A') });
    }
    if (!thumb) {
      M.V.forEach((v, i) => w.right(v, M.V[(i + 1) % 4], M.V[(i + 3) % 4], { size: 10, color: MARK }));
      [[[0, 0], [a, 0]], [[a, 0], [a, a]], [[a, a], [0, a]], [[0, a], [0, 0]]].forEach(([p, q]) => w.ticks(p, q, { color: MARK, count: 1, size: 6 }));
      w.text([a / 2, -0.62], tab === 'problem' ? `${num(a)} cm` : `${num(a)}`, { color: 'ink' });
    }
    // 모서리에서 원이 못 가는 조각 4개 (제자리에서 색이 바뀜)
    if (e > 0) {
      M.corners.forEach((cn) => {
        drawRemnant(w, cn.x, cn.y, r, [cn.c[0] - cn.x, cn.c[1] - cn.y], e * dim('B') * (1 - 0.5 * cp), 'corners');
        if (!thumb && la > 0 && (tab !== 'review' || step >= 2)) {
          const out = [cn.x + r / 2 + cn.dir[0] * 0.12, cn.y + r / 2 + cn.dir[1] * 0.12];
          w.text(out, `${num(r)}×${num(r)}`, { color: 'ink', alpha: la * dim('B') * (1 - 0.5 * cp), size: 12.5, ref: 'corners' });
        }
      });
    }
    // 복사본 4개: 가로 한 줄 → 가로로만 밀어 붙임 (정사각형 2r×2r 에서 원 하나를 뺀 모양)
    if (cp > 0) {
      const kk = dim('C');
      const slot = [[-r, -r, 0], [0, -r, 1], [0, 0, 2], [-r, 0, 3]]; // 최종 자리(G 기준 왼쪽 아래 모서리)와 조각 번호
      slot.forEach(([ox, oy, i]) => {
        const cn = M.corners[i];
        const shift = (ox < 0 ? -d : d) * (1 - g);
        drawRemnant(w, G[0] + ox + shift, G[1] + oy, r, [cn.c[0] - cn.x, cn.c[1] - cn.y], cp * kk, 'corners');
      });
      if (g > 0.98 && !thumb) {
        w.text(G, [`${num(2 * r)} × ${num(2 * r)}`, `− π × ${num(r)}²`], { color: 'ink', alpha: kk, ref: 'corners', gap: 17 });
        w.text([G[0], G[1] - r - 0.7], `${num(4 * r * r)} − ${cpi(r * r)}`, { color: 'amber', alpha: kk, size: 14, ref: 'corners' });
      }
    }
    // 원 · 중심
    const ca = tab === 'problem' ? 0 : 1 - e;
    if (ca > 0 && !thumb) {
      const cc = M.centerAt(sl);
      if (sl > 0) w.path(M.ptsUpTo(sl), { color: 'violet', width: 2.6, dash: true, alpha: ca * emK(b, 'path'), ref: 'path' });
      w.circle(cc.p, r, { color: 'green', width: 2.8, fill: 'green', fillAlpha: 0.14, alpha: ca, ref: 'circle' });
      w.seg(cc.p, cc.contact, { color: 'green', width: 2.4, alpha: ca, ref: 'circle' });
      const u = [(cc.contact[0] - cc.p[0]) / r, (cc.contact[1] - cc.p[1]) / r];
      const mid = [(cc.p[0] + cc.contact[0]) / 2, (cc.p[1] + cc.contact[1]) / 2];
      w.text(mid, `r = ${num(r)}`, { color: 'green', alpha: ca, dx: -u[1] * 32, dy: -u[0] * 32, ref: 'circle' });
      if (tab === 'explore' && e <= 0) {
        w.handle('swc', cc.p, {
          color: 'amber', r: 6, ariaLabel: '원을 끌어 안쪽 벽을 따라 움직이기',
          drag: (q) => {
            let sNew = M.project(w.unP(q));
            if (Math.abs(sNew - sl) > M.Lc / 2) sNew = sl > M.Lc / 2 ? M.Lc : 0;
            s.swT = clamp((sNew / M.Lc) * T.travel, 0, T.travel);
            s.playing = false; s.swGoal = null;
          }
        });
      } else w.point(cc.p, { color: 'violet', r: 4.5, glow: false });
    }
    if (tab === 'problem') {
      const cc = M.centerAt(0);
      w.circle(cc.p, r, { color: 'green', width: 2.8, fill: 'green', fillAlpha: 0.14 });
      w.point(cc.p, { color: 'ink', r: 3.6, glow: false });
      w.seg(cc.p, [cc.p[0] + r, cc.p[1]], { color: 'green', width: 2.4, dash: true });
      w.text([cc.p[0] + r, cc.p[1]], `${num(r)} cm`, { color: 'green', align: 'left', dx: 9, dy: -3 });
    }
  }

  /* ========================================================================
     4. 원이 지나간 자리 — 장면 정의
     ======================================================================== */
  const PLAY_ACTIONS = (label) => [
    { id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'), label: (s) => (s.playing ? '일시 정지' : (s.swT >= 0.999 ? '처음부터 다시' : label)), on: (s) => s.playing,
      run: (s) => { if (s.playing) { s.playing = false; return; } if (s.swT >= 0.999) s.swT = 0; s.swGoal = null; s.playing = true; } },
    { id: 'reset', icon: 'reset', label: '처음으로', run: (s) => { s.playing = false; s.swGoal = null; s.swT = 0; } }
  ];
  const stageChips = [
    { label: '처음', at: 0 },
    { label: '한 바퀴 끝', at: 0.5 },
    { label: '조각으로 나누기', at: 0.6 },
    { label: '부채꼴 모으기', at: 1 }
  ];
  const stagePresets = (group, labels) => stageChips.map((c, i) => ({ group, label: (labels && labels[i]) || c.label, set: { swT: c.at }, ms: 1300, on: (s) => Math.abs(s.swT - c.at) < 0.02 }));
  const sameD = (s, o) => Object.keys(o).every((k) => s[k] === o[k]);
  const numPreset = (group, label, o) => ({ group, label, apply: (s) => { Object.assign(s, o); s.swGoal = null; }, on: (s) => sameD(s, o) });

  /** 지나간 자리 장면 공통 view */
  function sweepView(sc) {
    return (s, lab) => {
      syncReview(lab, sc, s);
      const d = sc.dims(s);
      const M = sweepModel(sc.shape, d.a, d.b, s.swR);
      const t = s.swT, ph = phaseOf(t), r = M.r;
      const path = sc.mode === 'path';
      const sl = clamp(t / T.travel, 0, 1) * M.Lc;
      const status = path
        ? (ph === 'travel' ? { tone: 'info', text: `중심이 지나온 길 ${num(sl)} cm` }
          : ph === 'split' ? { tone: 'info', text: '직선 부분과 호로 나눠요' }
            : ph === 'copy' || ph === 'slide' ? { tone: 'info', text: '호를 복사해 가로로 모아요' } : { tone: 'ok', text: `직선 ${num(M.per)} + 원의 둘레 ${num(2 * r)}π` })
        : (ph === 'travel' ? { tone: 'info', text: `중심이 지나온 길 ${num(sl)} cm` }
          : ph === 'split' ? { tone: 'info', text: '직사각형 + 모서리 부채꼴' }
            : ph === 'copy' || ph === 'slide' ? { tone: 'info', text: '부채꼴을 복사해 가로로 모아요' } : { tone: 'ok', text: `부채꼴 ${M.n}개 = 원 1개 (중심각 합 360°)` });
      const guide = ph === 'travel'
        ? (path ? '노란 점(원의 중심)을 끌어 원을 돌려 보세요. 보라색 선이 중심이 지나온 길이에요.' : '노란 점(원의 중심)을 끌어 원을 돌려 보세요. 지나간 자리가 칠해져요.')
        : ph === 'split'
          ? (path ? '중심이 지난 길 = 직선 부분 + 호(곡선 부분).' : '지나간 자리 = 직사각형 + 모서리 부채꼴.')
          : (path ? '호를 복사해 가로로 밀어 붙이면 원 하나의 둘레가 돼요.' : '부채꼴을 복사해 가로로 밀어 붙이면 원 하나가 돼요.');
      const readouts = path ? [
        { label: '원의 반지름 r', value: `${num(r)} cm`, color: 'green', ref: 'circle' },
        { label: '중심이 움직인 거리(지금까지)', value: `${num(sl)} cm`, color: 'violet', ref: 'path', wide: true },
        { label: '직선 부분', value: `${num(M.per)} cm`, color: 'violet', ref: 'segs', note: M.E.map((e) => num(e.len)).join(' + ') },
        { label: '호 부분', value: `${num(2 * r)}π cm`, color: 'amber', ref: 'arcs', note: `반지름 ${num(r)}인 원의 둘레` },
        { label: '중심이 움직인 거리', value: `${num(M.per)} + ${num(2 * r)}π ≈ ${num(M.Lc)} cm`, color: 'rose', wide: true }
      ] : [
        { label: '원의 반지름 r', value: `${num(r)} cm`, color: 'green', ref: 'circle', note: `지름 ${num(2 * r)} cm` },
        { label: '중심이 움직인 거리', value: `${num(sl)} cm`, color: 'violet', ref: 'path', note: `한 바퀴: ${num(M.per)} + ${num(2 * r)}π ≈ ${num(M.Lc)}` },
        { label: `직사각형 ${M.n}개`, value: `${num(M.rectArea)} cm²`, color: 'sky', ref: 'rects', note: `(변의 합 ${num(M.per)}) × 지름 ${num(2 * r)}` },
        { label: `모서리 부채꼴 ${M.n}개`, value: `${num(4 * r * r)}π cm²`, color: 'amber', ref: 'sectors', note: `모으면 반지름 ${num(2 * r)}인 원 1개` },
        { label: '지나간 자리의 넓이', value: `${num(M.rectArea)} + ${num(4 * r * r)}π ≈ ${num(M.area)} cm²`, color: 'rose', wide: true }
      ];
      const parts = path ? [
        { id: 'segs', name: '직선 부분', desc: '도형의 변과 같은 길이', value: `${num(M.per)}`, color: 'violet' },
        { id: 'arcs', name: '호(곡선) 부분', desc: `반지름 ${num(r)}, 중심각 합 360°`, value: `${num(2 * r)}π`, color: 'amber' },
        { id: 'circle', name: '움직이는 원', desc: `반지름 ${num(r)}`, color: 'green' }
      ] : [
        { id: 'rects', name: `직사각형 ${M.n}개`, desc: '변의 길이 × 원의 지름', value: `${num(M.rectArea)}`, color: 'sky' },
        { id: 'sectors', name: `모서리 부채꼴 ${M.n}개`, desc: `반지름 ${num(2 * r)}, 중심각 합 360°`, value: `${num(4 * r * r)}π`, color: 'amber' },
        { id: 'path', name: '원의 중심이 간 길', desc: `${num(M.per)} + ${num(2 * r)}π`, value: `${num(M.Lc)}`, color: 'violet' }
      ];
      const done = t >= 0.96;
      const chips = done ? (path
        ? [{ k: '중심이 움직인 거리', html: `$${num(M.per)}+${num(2 * r)}\\pi$ cm`, color: 'rose' }]
        : [{ k: '지나간 자리의 넓이', html: `$${num(M.rectArea)}+${num(4 * r * r)}\\pi$ cm²`, color: 'rose' }]) : [];
      const formula = path
        ? `<p><b>원의 중심이 움직인 거리</b></p><p>= (직선 부분) + (호 부분)</p><p>= (도형의 둘레) + 2π × ${num(r)}</p><p>= ${num(M.per)} + ${num(2 * r)}π (cm)</p><p style="color:var(--text-3);font-size:.92em">호의 중심각을 모두 합하면 360°. 호를 모으면 반지름 r인 원 하나의 둘레예요.</p>`
        : `<p><b>원이 지나간 자리의 넓이</b></p><p>= (직사각형의 합) + (모서리 부채꼴의 합)</p><p>= (도형의 둘레) × (원의 지름) + π × (원의 지름)²</p><p>= ${num(M.per)} × ${num(2 * r)} + π × ${num(2 * r)}² = ${num(M.rectArea)} + ${num(4 * r * r)}π (cm²)</p><p style="color:var(--text-3);font-size:.92em">부채꼴의 중심각을 모두 합하면 360°. 모으면 반지름이 지름(2r)인 원 하나예요.</p>`;
      const notes = path
        ? '<p>• 호의 반지름은 <b>원의 반지름 r</b>이에요.</p><p>• 직선 부분은 도형의 변과 <b>길이가 같아요</b>.</p><p>• 호를 모으면 원 하나의 <b>둘레(2πr)</b>예요. 넓이(πr²)와 헷갈리지 마세요.</p>'
        : '<p>• 모서리 부채꼴의 반지름은 r이 아니라 <b>지름 2r</b>이에요 (꼭짓점 → 중심 r, 중심 → 가장자리 r).</p><p>• 직사각형의 세로도 r이 아니라 <b>지름 2r</b>이에요.</p><p>• 부채꼴의 중심각 합이 360°이면 <b>원 하나</b>예요.</p>';
      return { guide, status, readouts, parts, chips, formula, notes, summary: done ? (path ? `중심이 움직인 거리 = ${num(M.per)} + ${num(2 * r)}π ≈ ${num(M.Lc)} cm` : `지나간 자리의 넓이 = ${num(M.rectArea)} + ${num(4 * r * r)}π ≈ ${num(M.area)} cm²`) : null };
    };
  }

  /* ----- 문제: 교재식 보기 만들기 ----- */
  /** 교재 18번과 같은 짜임: (π계수 × 변의 합/반지름) 조합 5개 — 교재 숫자(변 3, r 1)에서는 ①~⑤가 교재와 똑같습니다 */
  function areaChoices(M) {
    const r = M.r, P = M.per;
    return { list: [[r * r, P * r], [r * r, P * 2 * r], [2 * r * r, P * 2 * r], [4 * r * r, P * r], [4 * r * r, P * 2 * r]], ans: 4 };
  }
  function pathChoices(M) {
    const r = M.r, P = M.per;
    const raw = [[r, P], [2 * r, P], [4 * r, P], [2 * r, 2 * P], [4 * r, 2 * P]];
    const val = (x) => x[0] * PI + x[1];
    raw.sort((x, y) => val(x) - val(y));
    return { list: raw, ans: raw.findIndex((x) => x[0] === 2 * r && x[1] === P) };
  }

  function sweepProblem(sc) {
    return (s) => {
      const d = sc.dims(s);
      const M = sweepModel(sc.shape, d.a, d.b, s.swR);
      const r = M.r;
      const isPath = sc.mode === 'path';
      const { list, ans } = isPath ? pathChoices(M) : areaChoices(M);
      const choices = list.map(([p, q]) => choiceTex(p, q, isPath ? 'cm' : 'cm^2'));
      const rr = `${num(r)} cm`;
      const nm = sc.shape === 'square' ? '정사각형' : sc.shape === 'rect' ? '직사각형' : '정삼각형';
      const stem = `오른쪽 그림과 같이 반지름의 길이가 ${rr}인 원이 ${nm}의 변을 따라 한 바퀴 돌아서 제자리로 왔을 때, ${isPath ? '원의 중심이 움직인 거리는' : '원이 지나간 자리의 넓이는'}?`;
      return { stem, choices, ans, ansTex: `${CIRC[ans]} ${choices[ans]}`, M, list };
    };
  }

  const SW = {};
  function sweepScene(o) {
    const sc = {
      id: o.id, title: o.title, short: o.short,
      shape: o.shape, mode: o.mode || 'area', dims: o.dims,
      question: o.question,
      controls: o.controls,
      presets: [...stagePresets('장면 보기', o.stageLabels), ...o.numberPresets],
      actions: PLAY_ACTIONS(o.playLabel || '재생'),
      steps: o.steps,
      startStep: 1,
      focus: (s) => { const dd = o.dims(s); const M = sweepModel(o.shape, dd.a, dd.b, s.swR); const L = sweepLayout(M, o.mode === 'path', true); return W({ kind: 'figure' }).box(L.home.x0, L.home.x1, L.home.y0, L.home.y1); },
      enter: (s, lab) => {
        defaults(s, o.enter);
        Object.assign(s, o.enter);
        s.playing = false; s.swGoal = null; s.swT = 0; s.swStepSeen = -1; s.csdPick = 0;
        if (lab) { injectStyle(); ensureParams(lab); bindProblemUI(lab); }
      },
      tick: makeTick(STEP_T),
      draw: (b, s, v, lab) => drawSweep(b, s, v, lab, sc),
      problem: null,
      solution: o.solution
    };
    sc.view = sweepView(sc);
    const mk = sweepProblem(sc);
    sc.csd = {
      make: mk,
      sig: (s) => `${sc.id}|${s.swA}|${s.swW}|${s.swH}|${s.swR}`,
      isDefault: (s) => sameD(s, o.enter),
      again: (s) => { Object.assign(s, pickRandom(o.variants, s, (x, c) => Object.keys(x).every((k) => x[k] === c[k]))); },
      reset: (s) => { Object.assign(s, o.enter); }
    };
    sc.problem = {
      tag: o.tag,
      text: (s) => problemHTML(sc, s),
      answer: (s) => mk(s).ansTex,
      note: '숫자 바꾸기를 누르면 그림의 숫자와 보기가 함께 바뀌어요.'
    };
    SW[sc.id] = sc;
    return sc;
  }

  /* ----- 장면 1: 정사각형 (교재 18번) ----- */
  const sqSteps = (s) => {
    const a = s.swA, r = s.swR, P = 4 * a, d = 2 * r;
    return [
      `직사각형 부분: 가로 ${a} cm(정사각형의 한 변), 세로 ${d} cm(원의 지름)인 직사각형 4개 → ${a}×${d}×4 = ${P * d} (cm²)`,
      `모서리 부분: 꼭짓점 → 중심 ${r}, 중심 → 가장자리 ${r} 이므로 반지름 ${d} cm, 중심각 90°인 부채꼴 4개`,
      `부채꼴 4개를 복사해 가로로 모으면 중심각의 합이 90°×4 = 360° → 반지름 ${d} cm인 원 1개 → π×${d}² = ${d * d}π (cm²)`,
      `(지나간 자리의 넓이) = ${P * d} + ${d * d}π (cm²)`
    ];
  };
  sweepScene({
    id: 'sw-square',
    title: '원이 정사각형 바깥을 한 바퀴 돌 때',
    short: '정사각형',
    shape: 'square',
    dims: (s) => ({ a: s.swA, b: s.swA }),
    enter: { swA: 3, swR: 1 },
    variants: [{ swA: 3, swR: 1 }, { swA: 4, swR: 1 }, { swA: 5, swR: 1 }, { swA: 2, swR: 1 }, { swA: 3, swR: 2 }, { swA: 4, swR: 2 }, { swA: 6, swR: 1 }],
    question: '원이 정사각형 바깥을 한 바퀴 돌 때, 지나간 자리는 어떤 도형들로 이루어져 있을까?',
    controls: ['swT', 'swA', 'swR'],
    numberPresets: [numPreset('숫자', '변 3 · r 1 (교재)', { swA: 3, swR: 1 }), numPreset('숫자', '변 4 · r 1', { swA: 4, swR: 1 }), numPreset('숫자', '변 3 · r 2', { swA: 3, swR: 2 })],
    steps: sqSteps,
    tag: '교재 18번 · 실수 유발',
    solution: {
      standardTitle: '기본 풀이 (조각으로 나누기)', standardTag: '기본',
      quickTitle: '빠른 풀이 (둘레 × 지름 + 원 1개)', quickTag: '핵심',
      standard: (s) => ({ steps: `<p>① 직사각형 4개: ${s.swA}×${2 * s.swR}×4 = ${4 * s.swA * 2 * s.swR}</p><p>② 모서리 부채꼴 4개를 모으면 반지름 ${2 * s.swR}인 원 1개: π×${2 * s.swR}² = ${4 * s.swR * s.swR}π</p><p>③ 합: ${4 * s.swA * 2 * s.swR} + ${4 * s.swR * s.swR}π (cm²)</p>` }),
      quick: (s) => ({ steps: `<p>(정사각형의 둘레) × (원의 지름) + π × (원의 지름)²</p><p>= ${4 * s.swA} × ${2 * s.swR} + π × ${2 * s.swR}²</p>`, highlight: '볼록한 도형이면 어떤 도형이든 모서리 부채꼴의 중심각 합은 360°예요.' })
    }
  });

  /* ----- 장면 2: 직사각형 ----- */
  sweepScene({
    id: 'sw-rect',
    title: '[응용] 원이 직사각형 바깥을 한 바퀴 돌 때',
    short: '직사각형',
    shape: 'rect',
    dims: (s) => ({ a: s.swW, b: s.swH }),
    enter: { swW: 4, swH: 2, swR: 1 },
    variants: [{ swW: 4, swH: 2, swR: 1 }, { swW: 5, swH: 3, swR: 1 }, { swW: 6, swH: 2, swR: 1 }, { swW: 4, swH: 3, swR: 1 }, { swW: 3, swH: 2, swR: 2 }, { swW: 6, swH: 4, swR: 1 }],
    question: '직사각형 바깥을 도는 원이 지나간 자리도 같은 방법으로 나눌 수 있을까?',
    controls: ['swT', 'swW', 'swH', 'swR'],
    numberPresets: [numPreset('숫자', '4×2 · r 1', { swW: 4, swH: 2, swR: 1 }), numPreset('숫자', '5×3 · r 1', { swW: 5, swH: 3, swR: 1 }), numPreset('숫자', '3×2 · r 2', { swW: 3, swH: 2, swR: 2 })],
    steps: (s) => {
      const a = s.swW, b = s.swH, r = s.swR, P = 2 * (a + b), d = 2 * r;
      return [
        `직사각형 부분: 변이 ${a}, ${b}, ${a}, ${b}이고 세로(폭)는 모두 지름 ${d} cm → ${P}×${d} = ${P * d} (cm²)`,
        `모서리 부분: 반지름 ${d} cm(= 원의 지름), 중심각 90°인 부채꼴 4개`,
        `부채꼴 4개를 복사해 가로로 모으면 중심각의 합 360° → 반지름 ${d} cm인 원 1개 → π×${d}² = ${d * d}π (cm²)`,
        `(지나간 자리의 넓이) = ${P * d} + ${d * d}π (cm²)`
      ];
    },
    tag: '응용 · 직사각형'
  });

  /* ----- 장면 3: 정삼각형 ----- */
  sweepScene({
    id: 'sw-tri',
    title: '[응용] 원이 정삼각형 바깥을 한 바퀴 돌 때',
    short: '정삼각형',
    shape: 'tri',
    dims: (s) => ({ a: s.swA, b: s.swA }),
    enter: { swA: 3, swR: 1 },
    variants: [{ swA: 3, swR: 1 }, { swA: 4, swR: 1 }, { swA: 6, swR: 1 }, { swA: 2, swR: 1 }, { swA: 3, swR: 2 }, { swA: 4, swR: 2 }],
    question: '정삼각형은 꼭짓점이 3개예요. 모서리 부채꼴의 중심각은 얼마일까? 모으면 원 하나가 될까?',
    controls: ['swT', 'swA', 'swR'],
    numberPresets: [numPreset('숫자', '변 3 · r 1', { swA: 3, swR: 1 }), numPreset('숫자', '변 4 · r 1', { swA: 4, swR: 1 }), numPreset('숫자', '변 3 · r 2', { swA: 3, swR: 2 })],
    steps: (s) => {
      const a = s.swA, r = s.swR, P = 3 * a, d = 2 * r;
      return [
        `직사각형 부분: 가로 ${a} cm, 세로 ${d} cm(지름)인 직사각형 3개 → ${a}×${d}×3 = ${P * d} (cm²)`,
        `모서리 부분: 반지름 ${d} cm, 중심각은 바깥각 120° (내각 60°이므로 180° − 60°)인 부채꼴 3개`,
        `부채꼴 3개를 복사해 가로로 모으면 중심각의 합이 120°×3 = 360° → 반지름 ${d} cm인 원 1개 → π×${d}² = ${d * d}π (cm²)`,
        `(지나간 자리의 넓이) = ${P * d} + ${d * d}π (cm²)`
      ];
    },
    tag: '응용 · 정삼각형'
  });

  /* ----- 장면 4: 원의 중심이 움직인 거리 ----- */
  sweepScene({
    id: 'sw-center',
    title: '[응용] 원의 중심이 움직인 거리',
    short: '중심이 간 길',
    shape: 'square',
    mode: 'path',
    dims: (s) => ({ a: s.swA, b: s.swA }),
    enter: { swA: 3, swR: 1 },
    variants: [{ swA: 3, swR: 1 }, { swA: 4, swR: 1 }, { swA: 5, swR: 1 }, { swA: 2, swR: 1 }, { swA: 3, swR: 2 }, { swA: 4, swR: 2 }],
    question: '원이 정사각형 둘레를 한 바퀴 도는 동안, 원의 중심은 어떤 길을 얼마나 움직일까?',
    controls: ['swT', 'swA', 'swR'],
    numberPresets: [numPreset('숫자', '변 3 · r 1', { swA: 3, swR: 1 }), numPreset('숫자', '변 4 · r 1', { swA: 4, swR: 1 }), numPreset('숫자', '변 3 · r 2', { swA: 3, swR: 2 })],
    stageLabels: ['처음', '한 바퀴 끝', '길을 나누기', '호 모으기'],
    steps: (s) => {
      const a = s.swA, r = s.swR, P = 4 * a;
      return [
        `직선 부분: 정사각형의 변과 같은 ${a} cm가 4개 → ${a}×4 = ${P} (cm)`,
        `곡선 부분: 꼭짓점을 중심으로 반지름 ${r} cm, 중심각 90°인 호 4개 (호 하나: 2π×${r}×90/360 = ${ratPi(rat(r, 2))})`,
        `호 4개를 복사해 가로로 모으면 중심각의 합이 360° → 반지름 ${r} cm인 원 1개의 둘레 2π×${r} = ${2 * r}π (cm)`,
        `(중심이 움직인 거리) = ${P} + ${2 * r}π (cm)`
      ];
    },
    tag: '응용 · 호의 길이의 합',
    playLabel: '중심의 길 재생'
  });

  /* ----- 장면 5: 정사각형 안쪽 ----- */
  const insideScene = {
    id: 'sw-inside',
    title: '[응용] 원이 정사각형 안쪽을 한 바퀴 돌 때',
    short: '정사각형 안쪽',
    shape: 'inside',
    mode: 'area',
    question: '안쪽 벽을 따라 돌면 모서리 구석에는 닿지 못해요. 지나간 자리는 어떻게 구할까?',
    controls: ['swT', 'swI', 'swR'],
    presets: [...stagePresets('장면 보기', ['처음', '한 바퀴 끝', '조각으로 나누기', '조각 모으기']), numPreset('숫자', '한 변 6 · r 1', { swI: 6, swR: 1 }), numPreset('숫자', '한 변 8 · r 1', { swI: 8, swR: 1 }), numPreset('숫자', '한 변 9 · r 2', { swI: 9, swR: 2 })],
    actions: PLAY_ACTIONS('재생'),
    steps: (s) => {
      const r = s.swR, a = Math.max(s.swI, 4 * r + 1), hole = a - 4 * r;
      return [
        `원이 닿을 수 있는 곳은 벽에서 폭 ${2 * r} cm(지름)까지예요. 바깥 ${a}×${a} = ${a * a}에서 가운데 ${hole}×${hole} = ${hole * hole}을 빼면 ${a * a - hole * hole} (cm²)`,
        `네 모서리 구석에는 원이 닿지 못해요. 한 변이 ${r}인 정사각형에서 반지름 ${r}, 중심각 90°인 부채꼴을 뺀 모양이 4군데예요.`,
        `이 조각 4개를 복사해 가로로 모으면 한 변이 ${2 * r}인 정사각형에서 반지름 ${r}인 원 1개를 뺀 모양 → ${4 * r * r} − ${cpi(r * r)} (cm²)`,
        `(지나간 자리의 넓이) = ${a * a - hole * hole} − (${4 * r * r} − ${cpi(r * r)}) = ${a * a - hole * hole - 4 * r * r} + ${cpi(r * r)} (cm²)`
      ];
    },
    startStep: 1,
    focus: (s) => { const M = insideModel(s.swI, s.swR); return W({ kind: 'figure' }).box(-0.7, M.a + 0.7, -1.2, M.a + 0.6); },
    enter: (s, lab) => {
      defaults(s, { swI: 6, swR: 1 });
      Object.assign(s, { swI: 6, swR: 1 });
      s.playing = false; s.swGoal = null; s.swT = 0; s.swStepSeen = -1; s.csdPick = 0;
      if (lab) { injectStyle(); ensureParams(lab); bindProblemUI(lab); }
    },
    tick: makeTick(STEP_T),
    draw: (b, s, v, lab) => drawSweep(b, s, v, lab, insideScene),
    view: (s, lab) => {
      syncReview(lab, insideScene, s);
      if (s.swI < 4 * s.swR + 1) s.swI = 4 * s.swR + 1; // 가운데 정사각형이 남도록 한 변을 4r+1 이상으로
      const M = insideModel(s.swI, s.swR);
      const t = s.swT, ph = phaseOf(t), r = M.r;
      const sl = clamp(t / T.travel, 0, 1) * M.Lc;
      const status = ph === 'travel' ? { tone: 'info', text: `중심이 지나온 길 ${num(sl)} cm` }
        : ph === 'split' ? { tone: 'info', text: '바깥 − 가운데 − 모서리 4곳' }
          : ph === 'copy' || ph === 'slide' ? { tone: 'info', text: '모서리 조각을 복사해 가로로 모아요' } : { tone: 'ok', text: `모서리 조각 4개 = ${num(4 * r * r)} − π × ${num(r)}²` };
      return {
        guide: ph === 'travel' ? '노란 점(원의 중심)을 끌어 안쪽 벽을 따라 돌려 보세요. 구석에는 닿지 못해요.'
          : '지나간 자리 = 바깥 정사각형 − 가운데 정사각형 − 모서리 4곳.',
        status,
        readouts: [
          { label: '원의 반지름 r', value: `${num(r)} cm`, color: 'green', ref: 'circle' },
          { label: '중심이 움직인 거리', value: `${num(sl)} cm`, color: 'violet', ref: 'path', note: `한 바퀴: ${num(M.per)} cm` },
          { label: '벽 둘레 띠 (바깥 − 가운데)', value: `${num(M.outerRing)} cm²`, color: 'sky', ref: 'band', note: `${num(M.a)}² − ${num(M.hole)}²` },
          { label: '모서리 못 가는 조각 4개', value: `${num(4 * r * r)} − ${cpi(r * r)} cm²`, color: 'amber', ref: 'corners', note: '정사각형에서 원 1개 빼기' },
          { label: '지나간 자리의 넓이', value: `${num(M.outerRing - 4 * r * r)} + ${cpi(r * r)} ≈ ${num(M.area)} cm²`, color: 'rose', wide: true }
        ],
        parts: [
          { id: 'band', name: '벽 둘레 띠', desc: '바깥 정사각형 − 가운데 정사각형', value: `${num(M.outerRing)}`, color: 'sky' },
          { id: 'corners', name: '모서리에서 못 가는 곳 4개', desc: `${num(r)}×${num(r)} 정사각형 − 사분원`, value: `${num(4 * r * r)}−${cpi(r * r)}`, color: 'amber' }
        ],
        chips: t >= 0.96 ? [{ k: '지나간 자리의 넓이', html: `$${num(M.outerRing - 4 * r * r)}+${r * r === 1 ? '' : num(r * r)}\\pi$ cm²`, color: 'rose' }] : [],
        formula: `<p><b>안쪽을 도는 경우</b></p><p>= (바깥 정사각형) − (가운데 정사각형) − (모서리에서 못 가는 곳)</p><p>= ${num(M.a)}² − ${num(M.hole)}² − (${num(4 * r * r)} − ${cpi(r * r)}) = ${num(M.outerRing - 4 * r * r)} + ${cpi(r * r)} (cm²)</p>`,
        notes: '<p>• 바깥쪽을 돌 때는 모서리에 부채꼴이 <b>더해지지만</b>, 안쪽을 돌 때는 모서리 조각이 <b>빠져요</b>.</p><p>• 못 가는 조각은 <b>한 변 r인 정사각형에서 사분원을 뺀</b> 모양이에요.</p>'
      };
    },
    csd: null
  };
  insideScene.csd = {
    make: (s) => {
      const M = insideModel(s.swI, s.swR);
      const r = M.r, base = M.outerRing - 4 * r * r; // base + r²π
      const raw = [[r * r, M.outerRing], [r * r, base], [4 * r * r, base], [r * r, M.outerRing + 4 * r * r], [r * r, base - 4 * r * r]];
      const val = (x) => x[0] * PI + x[1];
      const list = raw.filter((x, i) => raw.findIndex((y) => y[0] === x[0] && y[1] === x[1]) === i).sort((x, y) => val(x) - val(y));
      const ans = list.findIndex((x) => x[0] === r * r && x[1] === base);
      const choices = list.map(([p, q]) => choiceTex(p, q, 'cm^2'));
      return {
        stem: `오른쪽 그림과 같이 반지름의 길이가 ${num(r)} cm인 원이 한 변의 길이가 ${num(M.a)} cm인 정사각형의 안쪽 벽을 따라 한 바퀴 돌아서 제자리로 왔을 때, 원이 지나간 자리의 넓이는?`,
        choices, ans, ansTex: `${CIRC[ans]} ${choices[ans]}`, M, list
      };
    },
    sig: (s) => `in|${s.swI}|${s.swR}`,
    isDefault: (s) => s.swI === 6 && s.swR === 1,
    again: (s) => { Object.assign(s, pickRandom([{ swI: 6, swR: 1 }, { swI: 8, swR: 1 }, { swI: 7, swR: 1 }, { swI: 9, swR: 2 }, { swI: 10, swR: 2 }, { swI: 9, swR: 1 }], s, (x, c) => x.swI === c.swI && x.swR === c.swR)); },
    reset: (s) => { Object.assign(s, { swI: 6, swR: 1 }); }
  };
  insideScene.problem = { tag: '응용 · 안쪽', text: (s) => problemHTML(insideScene, s), answer: (s) => insideScene.csd.make(s).ansTex, note: '숫자 바꾸기를 누르면 그림의 숫자와 보기가 함께 바뀌어요.' };
  SW['sw-inside'] = insideScene;

  /* ========================================================================
     5. 묶인 동물이 움직일 수 있는 영역 — 모델
     (정사각형 개집 · 직사각형 창고 · 정삼각형 울타리 · 정육각형 가축우리: 한 꼭짓점 A 에 끈으로 묶임)
     ======================================================================== */
  const GOAT_KIND = {
    square: { animal: '강아지', thing: '개집', fence: '개집' },
    rect: { animal: '강아지', thing: '창고', fence: '창고' },
    tri: { animal: '염소', thing: '울타리', fence: '울타리' },
    hex: { animal: '소', thing: '가축우리', fence: '가축우리' }
  };
  /** 울타리(볼록 다각형, 반시계)와 한 꼭짓점 A=V[0]. 정다각형은 아래 밑변에서 왼쪽으로 꺾으며 만듭니다. */
  function goatSpec(kind, s) {
    if (kind === 'rect') { const a = s.gtA, b = s.gtB; return { V: [[0, 0], [a, 0], [a, b], [0, b]], names: 'ABCD', maxL: a + b }; }
    if (kind === 'square') { const q = s.gtQ; return { V: [[0, 0], [q, 0], [q, q], [0, q]], names: 'ABCD', maxL: 2 * q }; }
    const n = kind === 'tri' ? 3 : 6, side = kind === 'tri' ? s.gtS : s.gtH;
    const V = [[0, 0]];
    let p = [0, 0], dir = 0;
    for (let i = 0; i < n - 1; i++) { p = [p[0] + side * Math.cos(dir), p[1] + side * Math.sin(dir)]; V.push(p); dir += TAU / n; }
    return { V, names: 'ABCDEF'.slice(0, n), maxL: kind === 'tri' ? 1.5 * side : 2 * side };
  }
  function goatClamp(s) {
    const k = s.gtKind;
    if (!k || k === 'spiral') return;
    s.gtL = clamp(s.gtL, 1, goatSpec(k, s).maxL);
  }
  const goatPoint = (sec, th) => [sec.c[0] + sec.R * Math.cos(th), sec.c[1] + sec.R * Math.sin(th)];

  /** 끈이 울타리 모서리를 만날 때마다 남은 끈으로 작은 부채꼴이 하나씩 생깁니다. */
  function goatModel(kind, s) {
    const sp = goatSpec(kind, s);
    const V = sp.V, n = V.length, names = sp.names;
    const L = clamp(s.gtL, 1, sp.maxL);
    const ang = (p, q) => Math.atan2(q[1] - p[1], q[0] - p[0]);
    const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
    const area = (R, deg) => rat(Math.round(R * R * deg), 360);
    let t0 = ang(V[0], V[n - 1]), t1 = ang(V[0], V[1]);
    while (t1 <= t0) t1 += TAU;
    const A = { id: names[0], idx: 0, chain: 'A', c: V[0], R: L, t0, t1, deg: Math.round((t1 - t0) * DEG), path: [V[0]], used: 0, col: 'amber' };
    A.area = area(A.R, A.deg);
    const chain = (dir) => {
      const out = [];
      let rho = L, used = 0;
      const path = [V[0]];
      for (let k = 1; k < n; k++) {
        const idx = dir > 0 ? k : n - k, prev = dir > 0 ? k - 1 : (n - k + 1) % n;
        const e = dist(V[prev], V[idx]);
        if (!(rho - e > 1e-9)) break;
        rho -= e; used += e; path.push(V[idx]);
        let a0, phi;
        if (dir > 0) { a0 = ang(V[prev], V[idx]); phi = wrap2pi(ang(V[idx], V[(idx + 1) % n]) - a0); }
        else { a0 = ang(V[idx], V[idx - 1]); phi = wrap2pi(ang(V[(idx + 1) % n], V[idx]) - a0); }
        const sec = { id: names[idx], idx, chain: dir > 0 ? 'ccw' : 'cw', c: V[idx], R: rho, t0: a0, t1: a0 + phi, deg: Math.round(phi * DEG), path: path.slice(), used, edge: e, col: dir > 0 ? 'sky' : 'green' };
        sec.area = area(sec.R, sec.deg);
        out.push(sec);
      }
      return out;
    };
    const ccw = chain(1), cw = chain(-1);
    const secs = [...cw.slice().reverse(), A, ...ccw]; // 염소의 자취가 이어지는 차례 (끝점 = 다음 시작점)
    return { kind, V, names, L, sp, A, ccw, cw, secs, order: [A, ...ccw, ...cw], area: ratSum(secs.map((x) => x.area)), maxL: sp.maxL, side: dist(V[0], V[1]), sideLast: dist(V[0], V[n - 1]), interior: 360 - A.deg };
  }
  /** 염소가 지나가는 시간표: 부채꼴의 중심각에 비례해 0~0.8 구간을 나눕니다 */
  function goatTimeline(M) {
    const total = M.secs.reduce((x, y) => x + y.deg, 0);
    let acc = 0;
    return M.secs.map((sec) => { const o = { sec, ts: 0.8 * (acc / total), te: 0.8 * ((acc + sec.deg) / total) }; acc += sec.deg; return o; });
  }
  function boxOf(points, mx, my) {
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
    return { x0: Math.min(...xs) - mx, x1: Math.max(...xs) + mx, y0: Math.min(...ys) - my, y1: Math.max(...ys) + my };
  }
  function secPoints(secs, V) {
    const pts = V.slice();
    secs.forEach((sec) => { for (let k = 0; k <= 24; k++) pts.push(goatPoint(sec, sec.t0 + ((sec.t1 - sec.t0) * k) / 24)); });
    return pts;
  }
  const goatBox = (M) => boxOf(secPoints(M.secs, M.V), 1, 1.2);

  /* ----- 정육각형 둘레를 따라 이어지는 부채꼴 (교재 17-20) ----- */
  function spiralModel(s) {
    const p = s.gtP, k = clamp(s.gtK, 1, 5);
    const h = (p * Math.sqrt(3)) / 2;
    const Vd = { A: [-p / 2, h], B: [-p, 0], C: [-p / 2, -h], D: [p / 2, -h], E: [p, 0], F: [p / 2, h] };
    const names = ['A', 'B', 'C', 'D', 'E', 'F'];
    const V = names.map((x) => Vd[x]);
    const piv = ['F', 'E', 'D', 'C', 'B', 'A'], ends = ['A', 'G', 'H', 'I', 'J', 'K'];
    const secs = [];
    for (let j = 1; j <= k; j++) {
      const id = piv[j - 1];
      secs.push({ id, idx: j - 1, c: Vd[id], R: j * p, t0: (180 - 60 * j) * RAD, t1: (180 - 60 * (j - 1)) * RAD, deg: 60, area: rat(j * j * p * p, 6), col: ['amber', 'sky', 'green', 'rose', 'violet'][j - 1], from: ends[j - 1], to: ends[j] });
    }
    return { p, k, V, names, secs, area: ratSum(secs.map((x) => x.area)) };
  }

  /* ========================================================================
     6. 묶인 동물 — 그리기
     ======================================================================== */
  function drawFence(w, M, thumb, withLetters) {
    const V = M.V, n = V.length;
    w.poly(V, { fill: 'muted', fillAlpha: 0.28, color: 'ink', width: 3.2 });
    if (thumb) return;
    const cen = [V.reduce((x, p) => x + p[0], 0) / n, V.reduce((x, p) => x + p[1], 0) / n];
    if (M.kind === 'rect' || M.kind === 'square') {
      V.forEach((p, i) => w.right(p, V[(i + 1) % 4], V[(i + 3) % 4], { size: 10, color: MARK }));
      const a = V[1][0], b = V[3][1];
      w.ticks(V[0], V[1], { color: MARK, count: 1, size: 6 });
      w.ticks(V[3], V[2], { color: MARK, count: 1, size: 6 });
      const sq = M.kind === 'square';
      w.ticks(V[1], V[2], { color: MARK, count: sq ? 1 : 2, size: 6 });
      w.ticks(V[0], V[3], { color: MARK, count: sq ? 1 : 2, size: 6 });
      w.text([a / 2, 0.55], `${num(a)} m`, { color: 'ink' });
      if (!sq) w.text([0.8, b / 2], `${num(b)} m`, { color: 'ink' });
    } else {
      V.forEach((p, i) => { w.ticks(p, V[(i + 1) % n], { color: MARK, count: 1, size: 6 }); w.angle(p, V[(i + 1) % n], V[(i + n - 1) % n], { r: 18, color: MARK, rings: 1 }); });
      const e = M.side;
      w.text([(V[0][0] + V[1][0]) / 2, V[0][1] + 0.62], `${num(e)} m`, { color: 'ink' });
    }
    if (withLetters) V.forEach((p, i) => {
      const dx = p[0] - cen[0], dy = p[1] - cen[1], l = Math.hypot(dx, dy) || 1;
      const o = i === 0 ? 0.55 : 0.6;
      w.text([p[0] + (dx / l) * o, p[1] + (dy / l) * o], M.names[i], { color: 'ink', size: 14 });
    });
  }

  /** 부채꼴 하나 (칠하기·글자·각 표시) */
  function drawGoatSector(w, sec, o) {
    const { thumb, k, u, label, ref } = o;
    const t1 = sec.t0 + (sec.t1 - sec.t0) * u;
    w.arc(sec.c, sec.R, sec.t0, t1, { sector: true, fill: sec.col, fillAlpha: 0.32 * k, color: sec.col, width: 2.4, alpha: k, ref: ref || sec.id });
    if (thumb || u < 1) return;
    if (sec.chain !== 'A' && sec.chain !== undefined) {
      const p1 = [sec.c[0] + Math.cos(sec.t0), sec.c[1] + Math.sin(sec.t0)], p2 = [sec.c[0] + Math.cos(sec.t1), sec.c[1] + Math.sin(sec.t1)];
      if (sec.deg === 90) w.right(sec.c, p1, p2, { size: 9, color: MARK });
      else w.angle(sec.c, p1, p2, { r: 17, color: MARK, rings: sec.deg === 120 ? 2 : 1 });
    }
    if (label) {
      const mid = (sec.t0 + sec.t1) / 2;
      const outside = sec.chain !== 'A' && sec.R * w.b.k < 95; // 작은 부채꼴은 글자가 들어가지 않으니 호 바깥에 적습니다
      const f = sec.chain === 'A' ? 0.58 : 0.6;
      const pos = outside ? [sec.c[0] + Math.cos(mid) * (sec.R + 0.95), sec.c[1] + Math.sin(mid) * (sec.R + 0.95)] : [sec.c[0] + Math.cos(mid) * sec.R * f, sec.c[1] + Math.sin(mid) * sec.R * f];
      w.text(pos, label, { color: outside ? sec.col : 'ink', alpha: k, ref: ref || sec.id });
    }
  }

  function drawGoat(b, s, v, lab, sc) {
    const w = W(b);
    const thumb = !!b.thumb;
    const tab = thumb ? 'thumb' : (lab && lab.tab) || 'explore';
    s.gtKind = sc.kind;
    goatClamp(s);
    const M = goatModel(sc.kind, s);
    const kd = GOAT_KIND[sc.kind];
    const bx = goatBox(M);
    b.setFocus(w.box(bx.x0, bx.x1, bx.y0, bx.y1), false);
    const sweepT = tab === 'explore' ? clamp(s.gtT, 0, 1) : 1;
    const step = tab === 'review' ? s.step : 0;
    const tl = goatTimeline(M);
    const labelsOn = tab === 'review' || tab === 'thumb' || (tab === 'explore' && sweepT >= 0.8);

    if (tab !== 'problem') {
      if (tab === 'explore') M.secs.forEach((sec) => w.arc(sec.c, sec.R, sec.t0, sec.t1, { color: 'orange', width: 1.6, dash: true, alpha: 0.3, ref: 'bound' }));
      M.secs.forEach((sec) => {
        let u = 1, k = 1;
        if (tab === 'explore') u = seg01(sweepT, tl.find((q) => q.sec === sec).ts, tl.find((q) => q.sec === sec).te);
        else if (tab === 'review') {
          const idx = M.order.indexOf(sec);
          if (!(step >= 4 || idx <= step - 1)) return;
          k = step >= 4 || idx === step - 1 ? 1 : 0.5;
        }
        if (u <= 0) return;
        let label = null;
        if (labelsOn || tab === 'review') {
          label = [`r = ${num(sec.R)}`, `${sec.deg}°`];
          if (tab === 'review' && sec.chain !== 'A') label = [`r = ${num(M.L)}−${num(sec.used)} = ${num(sec.R)}`, `${sec.deg}°`];
        }
        drawGoatSector(w, sec, { thumb, k, u, label });
      });
    }
    drawFence(w, M, thumb, true);
    w.point(M.V[0], { color: 'ink', r: 4.6, glow: false });

    // 끈과 동물
    if (tab === 'explore') {
      let cur = tl[0];
      for (const x of tl) if (sweepT >= x.ts) cur = x;
      const u = seg01(sweepT, cur.ts, cur.te);
      const P = goatPoint(cur.sec, cur.sec.t0 + (cur.sec.t1 - cur.sec.t0) * u);
      M.secs.forEach((sec) => {
        const x = tl.find((q) => q.sec === sec), uu = seg01(sweepT, x.ts, x.te);
        if (uu > 0) w.arc(sec.c, sec.R, sec.t0, sec.t0 + (sec.t1 - sec.t0) * uu, { color: 'orange', width: 3.4, ref: 'bound' });
      });
      w.path([...cur.sec.path, P], { color: 'rose', width: 3.2, ref: 'rope' });
      const samples = [];
      tl.forEach((x) => { for (let k = 0; k <= 40; k++) { const uu = k / 40; samples.push({ t: x.ts + (x.te - x.ts) * uu, p: goatPoint(x.sec, x.sec.t0 + (x.sec.t1 - x.sec.t0) * uu) }); } });
      w.handle('gp', P, {
        color: 'amber', r: 7, label: sweepT < 0.8 ? kd.animal : '', dx: 12, dy: -12, size: 13.5, ariaLabel: `${kd.animal}를 끌어 끈이 닿는 곳을 따라 움직이기`,
        drag: (q) => {
          const pt = w.unP(q);
          let best = samples[0], bd = Infinity;
          for (const x of samples) { const dd = (x.p[0] - pt[0]) ** 2 + (x.p[1] - pt[1]) ** 2; if (dd < bd) { bd = dd; best = x; } }
          s.gtT = clamp(best.t, 0, 1);
          s.playing = false;
        }
      });
    } else if (tab === 'problem') {
      const th = (M.A.t0 + M.A.t1) / 2;
      const P = [M.V[0][0] + M.L * Math.cos(th), M.V[0][1] + M.L * Math.sin(th)];
      w.seg(M.V[0], P, { color: 'rose', width: 3.2 });
      const nrm = [-Math.sin(th), Math.cos(th)];
      w.text([(M.V[0][0] + P[0]) / 2 + nrm[0] * 0.65, (M.V[0][1] + P[1]) / 2 + nrm[1] * 0.65], `${num(M.L)} m`, { color: 'rose' });
      w.point(P, { color: 'orange', r: 7.5, label: kd.animal, dx: 12, dy: -12, size: 13.5 });
    } else if (tab === 'review' && step >= 1 && step <= 3) {
      const sec = M.order[step - 1];
      if (sec) {
        const th = sec.chain === 'A' ? (sec.t0 + sec.t1) / 2 : (sec.t0 + sec.t1) / 2;
        w.path([...sec.path, goatPoint(sec, th)], { color: 'rose', width: 2.6, alpha: 0.95, ref: 'rope' });
        if (sec.chain === 'A') {
          const P = goatPoint(sec, th), nrm = [-Math.sin(th), Math.cos(th)];
          w.text([(sec.c[0] + P[0]) / 2 + nrm[0] * 0.65, (sec.c[1] + P[1]) / 2 + nrm[1] * 0.65], `끈 ${num(M.L)} m`, { color: 'rose' });
        }
      }
    }
  }

  function drawSpiral(b, s, v, lab, sc) {
    const w = W(b);
    const thumb = !!b.thumb;
    const tab = thumb ? 'thumb' : (lab && lab.tab) || 'explore';
    s.gtKind = 'spiral';
    const M = spiralModel(s);
    const bx = boxOf(secPoints(M.secs, M.V), 1.2, 1.4);
    b.setFocus(w.box(bx.x0, bx.x1, bx.y0, bx.y1), false);
    const sweepT = tab === 'explore' ? clamp(s.gtT, 0, 1) : 1;
    const step = tab === 'review' ? s.step : 0;
    const n = M.secs.length;
    const tl = M.secs.map((sec, i) => ({ sec, ts: (0.8 * i) / n, te: (0.8 * (i + 1)) / n }));
    const labelsOn = tab === 'review' || tab === 'thumb' || (tab === 'explore' && sweepT >= 0.8);
    const pt = (sec, th) => [sec.c[0] + sec.R * Math.cos(th), sec.c[1] + sec.R * Math.sin(th)];
    const revealed = (i) => (tab !== 'review' ? true : step >= 4 || i <= Math.min(step, 3) - 1 || (step === 3 && i >= 2));
    const current = (i) => (tab !== 'review' ? false : step < 4 && (i === step - 1 || (step === 3 && i >= 2)));

    {
      if (tab === 'explore') M.secs.forEach((sec) => w.arc(sec.c, sec.R, sec.t0, sec.t1, { color: 'orange', width: 1.6, dash: true, alpha: 0.3 }));
      M.secs.forEach((sec, i) => {
        let u = 1, k = 1;
        if (tab === 'explore') u = seg01(sweepT, tl[i].ts, tl[i].te);
        else if (tab === 'review') { if (!revealed(i)) return; k = step >= 4 || current(i) ? 1 : 0.5; }
        if (u <= 0) return;
        // 호는 A 쪽에서 시계 방향으로 감기므로, 칠하는 구간은 (현재 각도 ~ 시작각) 입니다
        const th = sec.t1 - (sec.t1 - sec.t0) * u;
        w.arc(sec.c, sec.R, th, sec.t1, { sector: true, fill: sec.col, fillAlpha: 0.32 * k, color: sec.col, width: 2.4, alpha: k, ref: 'S' + i });
        if (thumb || u < 1) return;
        const p1 = [sec.c[0] + Math.cos(sec.t0), sec.c[1] + Math.sin(sec.t0)], p2 = [sec.c[0] + Math.cos(sec.t1), sec.c[1] + Math.sin(sec.t1)];
        w.angle(sec.c, p1, p2, { r: 17, color: MARK, rings: 1 });
        if (labelsOn || tab === 'review') {
          const mid = (sec.t0 + sec.t1) / 2;
          w.text([sec.c[0] + Math.cos(mid) * sec.R * 0.64, sec.c[1] + Math.sin(mid) * sec.R * 0.64], [`r = ${num(sec.R)}`, '60°'], { color: 'ink', alpha: k, ref: 'S' + i });
        }
      });
    }
    // 정육각형
    w.poly(M.V, { fill: 'muted', fillAlpha: 0.28, color: 'ink', width: 3.2 });
    if (!thumb) {
      M.V.forEach((p, i) => w.ticks(p, M.V[(i + 1) % 6], { color: MARK, count: 1, size: 6 }));
      M.V.forEach((p, i) => w.angle(p, M.V[(i + 1) % 6], M.V[(i + 5) % 6], { r: 16, color: MARK, rings: 2 }));
      w.text([0, M.V[0][1] - 0.6], `${num(M.p)} cm`, { color: 'ink' });
      const cen = [0, 0];
      M.V.forEach((p, i) => { const l = Math.hypot(p[0], p[1]); w.text([p[0] + (p[0] - cen[0]) / l * 0.6, p[1] + (p[1] - cen[1]) / l * 0.6], M.names[i], { color: 'ink', size: 14 }); });
      // 호의 끝점 이름 (A, G, H, I …)
      M.secs.forEach((sec, i) => {
        const e = pt(sec, sec.t0);
        if (tab === 'explore' && sweepT < tl[i].te - 1e-9) return;
        if (tab === 'review' && !revealed(i)) return;
        w.point(e, { color: 'ink', r: 3, glow: false });
      });
      const ends = M.secs.map((sec) => ({ id: sec.to, p: pt(sec, sec.t0), i: sec }));
      ends.forEach((x, i) => { if (tab === 'explore' && sweepT < tl[i].te - 1e-9) return; if (tab === 'review' && !revealed(i)) return; w.text([x.p[0] + Math.cos(x.i.t0) * 0.7, x.p[1] + Math.sin(x.i.t0) * 0.7], x.id, { color: 'ink', size: 14 }); });
    }
    // 끈 (현재 중심 → 끝점)
    if (tab === 'explore') {
      let cur = tl[0];
      for (const x of tl) if (sweepT >= x.ts) cur = x;
      const u = seg01(sweepT, cur.ts, cur.te);
      const th = cur.sec.t1 - (cur.sec.t1 - cur.sec.t0) * u;
      const P = pt(cur.sec, th);
      w.seg(cur.sec.c, P, { color: 'rose', width: 3.2, ref: 'rope' });
      const samples = [];
      tl.forEach((x) => { for (let k = 0; k <= 40; k++) { const uu = k / 40; samples.push({ t: x.ts + (x.te - x.ts) * uu, p: pt(x.sec, x.sec.t1 - (x.sec.t1 - x.sec.t0) * uu) }); } });
      w.handle('gp', P, {
        color: 'amber', r: 7, ariaLabel: '점을 끌어 호를 따라 움직이기',
        drag: (q) => {
          const ptq = w.unP(q);
          let best = samples[0], bd = Infinity;
          for (const x of samples) { const dd = (x.p[0] - ptq[0]) ** 2 + (x.p[1] - ptq[1]) ** 2; if (dd < bd) { bd = dd; best = x; } }
          s.gtT = clamp(best.t, 0, 1); s.playing = false;
        }
      });
    } else if (tab === 'review' && step >= 1 && step <= 3) {
      const i = step - 1, sec = M.secs[i];
      if (sec) w.seg(sec.c, pt(sec, (sec.t0 + sec.t1) / 2), { color: 'rose', width: 2.6, ref: 'rope' });
    }
    
  }

  /* ========================================================================
     7. 묶인 동물 — 장면 정의
     ======================================================================== */
  const goatStagePresets = () => [{ label: '처음', t: 0 }, { label: '영역 완성', t: 1 }].map((c) => ({ group: '장면 보기', label: c.label, set: { gtT: c.t }, ms: 1300, on: (s) => Math.abs(s.gtT - c.t) < 0.02 }));
  const goatNumPreset = (label, o) => ({ group: '숫자', label, apply: (s) => { Object.assign(s, o); goatClamp(s); }, on: (s) => Object.keys(o).every((k) => s[k] === o[k]) });
  const GOAT_ACTIONS = (animal) => [
    { id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'), label: (s) => (s.playing ? '일시 정지' : (s.gtT >= 0.999 ? '처음부터 다시' : `${animal} 움직이기`)), on: (s) => s.playing,
      run: (s) => { if (s.playing) { s.playing = false; return; } if (s.gtT >= 0.999) s.gtT = 0; s.playing = true; } },
    { id: 'reset', icon: 'reset', label: '처음으로', run: (s) => { s.playing = false; s.gtT = 0; } }
  ];
  const goatTick = (s, dt) => {
    if (!s.playing) return false;
    s.gtT = Math.min(1, s.gtT + dt / 14);
    if (s.gtT >= 1) s.playing = false;
    return true;
  };
  const TEX_SUM = (secs) => secs.map((x) => ratPiTex(x.area)).join('+');

  /** 흔한 실수로 만든 보기 + 정답을 값의 크기순으로 (한 줄에 5개) */
  function goatChoicesFrom(M) {
    const ans = M.area;
    const L = M.L;
    const small = M.secs.filter((x) => x.chain !== 'A');
    const A = M.A;
    const cands = [];
    const add = (r) => { if (r.n > 0 && !cands.some((c) => c.n === r.n && c.d === r.d)) cands.push(r); };
    add(A.area); // 큰 부채꼴만
    add(rat(L * L, 1)); // 원 전체
    add(ratAdd(A.area, small[0] ? small[0].area : rat(0, 1))); // 작은 부채꼴 하나만
    if (small[1]) add(ratAdd(A.area, small[1].area));
    add(ratAdd(rat(L * L, 1), ratSum(small.map((x) => x.area)))); // 360° 로 계산
    add(ratAdd(A.area, ratSum(small.map((x) => rat(Math.round(x.R * x.R * x.deg * 2), 360))))); // 작은 부채꼴 중심각 두 배
    add(ratAdd(A.area, ratSum(small.map((x) => rat(Math.round(L * L * x.deg), 360))))); // 작은 부채꼴 반지름을 끈 전체로
    const ansV = ratVal(ans);
    let wrong = cands.filter((c) => !(c.n === ans.n && c.d === ans.d)).sort((x, y) => Math.abs(ratVal(x) - ansV) - Math.abs(ratVal(y) - ansV)).slice(0, 4);
    for (let k = 1; wrong.length < 4 && k < 40; k++) {
      [rat(ans.n * 4 + ans.d * k, ans.d * 4), rat(ans.n * 4 - ans.d * k, ans.d * 4), rat(ans.n * 2 + ans.d * k, ans.d * 2)].forEach((c) => { if (wrong.length < 4 && c.n > 0 && !wrong.some((x) => x.n === c.n && x.d === c.d) && !(c.n === ans.n && c.d === ans.d)) wrong.push(c); });
    }
    const list = [ans, ...wrong].sort((x, y) => ratVal(x) - ratVal(y));
    return { list, ans: list.findIndex((c) => c.n === ans.n && c.d === ans.d) };
  }

  const GOAT = {};
  function goatScene(o) {
    const kd = GOAT_KIND[o.kind];
    const sc = {
      id: o.id, title: o.title, short: o.short, kind: o.kind,
      question: o.question,
      controls: o.controls,
      presets: [...goatStagePresets(), ...o.numberPresets],
      actions: GOAT_ACTIONS(kd.animal),
      steps: o.steps,
      startStep: 1,
      focus: (s) => { const ss = { ...s, ...o.enter }; ss.gtKind = o.kind; const bx = goatBox(goatModel(o.kind, ss)); return W({ kind: 'figure' }).box(bx.x0, bx.x1, bx.y0, bx.y1); },
      enter: (s, lab) => {
        defaults(s);
        Object.assign(s, o.enter);
        s.gtKind = o.kind;
        s.playing = false; s.gtT = 0; s.csdPick = 0;
        if (lab) { injectStyle(); ensureParams(lab); bindProblemUI(lab); }
      },
      tick: goatTick,
      draw: (b, s, v, lab) => drawGoat(b, s, v, lab, sc),
      solution: o.solution
    };
    const mk = (s) => {
      s.gtKind = o.kind;
      goatClamp(s);
      const M = goatModel(o.kind, s);
      const out = { stem: o.stem(M), M };
      if (o.free) {
        out.free = { coef: M.area, unit: 'π m²', show: `영역의 넓이는 ${ratPi(M.area)} m² 예요.` };
        out.ans = 0;
        out.ansTex = `$${ratPiTex(M.area)}\\,\\mathrm{m}^2$`;
      } else {
        const def = o.textbook && Object.keys(o.enter).every((k) => s[k] === o.enter[k]);
        const { list, ans } = def ? { list: o.textbook.list.map(([n, d]) => rat(n, d)), ans: o.textbook.ans } : goatChoicesFrom(M);
        out.list = list;
        out.choices = list.map((r) => `$${ratPiTex(r)}\\,\\mathrm{m}^2$`);
        out.ans = ans;
        out.ansTex = `${CIRC[ans]} ${out.choices[ans]}`;
      }
      return out;
    };
    sc.csd = {
      make: mk,
      sig: (s) => `${sc.id}|${s.gtQ}|${s.gtA}|${s.gtB}|${s.gtS}|${s.gtH}|${s.gtL}`,
      isDefault: (s) => Object.keys(o.enter).every((k) => s[k] === o.enter[k]),
      again: (s) => { Object.assign(s, pickRandom(o.variants, s, (x, c) => Object.keys(x).every((k) => x[k] === c[k]))); s.gtKind = o.kind; goatClamp(s); },
      reset: (s) => { Object.assign(s, o.enter); }
    };
    sc.view = (s, lab) => {
      syncReview(lab, sc, s);
      s.gtKind = o.kind;
      goatClamp(s);
      const M = goatModel(o.kind, s);
      const tl = goatTimeline(M);
      const t = s.gtT;
      let cur = tl[0];
      for (const x of tl) if (t >= x.ts) cur = x;
      const done = t >= 0.8;
      const status = t <= 0 ? { tone: 'info', text: `끈을 팽팽히 당긴 ${kd.animal}` }
        : !done ? { tone: 'info', text: cur.sec.chain === 'A' ? `큰 부채꼴 · r = ${num(cur.sec.R)} m, ${cur.sec.deg}°` : `${cur.sec.id}를 돌아가는 부채꼴 · r = ${num(cur.sec.R)} m, ${cur.sec.deg}°` }
          : { tone: 'ok', text: `부채꼴 ${M.secs.length}개 · 넓이 ${ratPi(M.area)} m²` };
      const note = M.L >= M.maxL - 1e-9 ? `끈이 가장 길 수 있는 값(${num(M.maxL)} m)이에요. 이보다 길면 끈이 겹쳐 돌아가서 이 장면의 계산이 달라져요.` : '';
      const readouts = [{ label: '끈의 길이', value: `${num(M.L)} m`, color: 'rose', ref: 'rope', note: M.kind === 'rect' ? `AB ${num(M.side)} m, AD ${num(M.sideLast)} m` : `${kd.thing}의 한 변 ${num(M.side)} m` }];
      M.order.forEach((sec) => readouts.push({
        label: sec.chain === 'A' ? `큰 부채꼴 (${sec.id} 중심)` : `${sec.id}를 돌아가는 부채꼴`,
        value: `${ratPi(sec.area)} m²`, color: sec.col, ref: sec.id, note: `r = ${num(sec.R)} m, 중심각 ${sec.deg}°`
      }));
      readouts.push({ label: '움직일 수 있는 영역의 넓이', value: `${ratPi(M.area)} ≈ ${num(ratVal(M.area) * PI)} m²`, color: 'rose', wide: true });
      return {
        guide: t <= 0 ? `노란 점(${kd.animal})을 끌거나 재생을 눌러 보세요. 끈이 닿는 곳이 칠해져요.`
          : !done ? `${kd.thing} 모서리를 만나면 끈이 꺾여요. 남은 끈이 작은 부채꼴의 반지름이에요.` : '영역 = 큰 부채꼴 + 모서리를 돌아가는 작은 부채꼴.',
        status,
        alert: note ? { tone: 'info', text: note } : null,
        readouts,
        parts: M.order.map((sec) => ({ id: sec.id, name: sec.chain === 'A' ? '큰 부채꼴' : `${sec.id}를 돌아가는 부채꼴`, desc: `반지름 ${num(sec.R)}, 중심각 ${sec.deg}°`, value: ratPi(sec.area), color: sec.col })),
        chips: done ? [{ k: '영역의 넓이', html: `$${TEX_SUM(M.order)}=${ratPiTex(M.area)}$ m²`, color: 'rose' }] : [],
        formula: o.formula(M),
        notes: o.notes,
        summary: done ? `움직일 수 있는 영역의 넓이 = ${ratPi(M.area)} ≈ ${num(ratVal(M.area) * PI)} m²` : null
      };
    };
    sc.problem = { tag: o.tag, text: (s) => problemHTML(sc, s), answer: (s) => mk(s).ansTex, note: '숫자 바꾸기를 누르면 그림의 숫자가 바뀌어요. (끈의 굵기와 동물의 크기는 생각하지 않아요.)' };
    GOAT[sc.id] = sc;
    return sc;
  }

  /** 정리 단계: ① 큰 부채꼴 ② 한쪽 모서리 ③ 다른 쪽 모서리 ④ 합 (교재 해설과 같은 차례) */
  function goatSteps(kind) {
    const kd = GOAT_KIND[kind];
    return (s) => {
      s.gtKind = kind; goatClamp(s);
      const M = goatModel(kind, s);
      const A = M.A, L = num(M.L), f = (x) => ratPi(x.area);
      const small = (sec, edgeName, len) => `${sec.id}를 돌아가는 부채꼴: 끈 ${L} m 중 ${edgeName}(${num(len)} m)를 쓰고 남은 ${num(sec.R)} m → 반지름 ${num(sec.R)} m, 중심각 ${sec.deg}°(바깥각) → π×${num(sec.R)}²×${sec.deg}/360 = ${f(sec)} (m²)`;
      const none = (id, edgeName, len) => `끈의 길이 ${L} m가 ${edgeName}(${num(len)} m)보다 길지 않아 ${id}를 돌아가지 못해요 → 이 부채꼴은 없어요`;
      const ccw = M.ccw[0], cw = M.cw[0];
      const nm = M.names;
      const e1 = `${nm[0]}${nm[1]}`, e2 = `${nm[0]}${nm[nm.length - 1]}`;
      return [
        `큰 부채꼴: ${nm[0]}에서 끈이 닿는 곳 → 반지름 ${L} m, 중심각 360° − ${M.interior}° = ${A.deg}° → π×${L}²×${A.deg}/360 = ${f(A)} (m²)`,
        ccw ? small(ccw, e1, M.side) : none(nm[1], e1, M.side),
        cw ? small(cw, e2, M.sideLast) : none(nm[nm.length - 1], e2, M.sideLast),
        `(영역의 넓이) = ${M.order.map(f).join(' + ')} = ${ratPi(M.area)} (m²)`
      ];
    };
  }
  const GOAT_NOTES = '<p>• 큰 부채꼴의 중심각은 360°가 아니라 울타리의 <b>안쪽 각을 뺀 각</b>이에요 (직각이면 270°).</p><p>• 모서리를 돌아가는 부채꼴의 반지름은 끈 전체가 아니라 <b>남은 끈</b> (끈 − 지나온 변)이에요.</p><p>• 중심각은 안쪽 각이 아니라 <b>바깥각</b> (180° − 안쪽 각)이에요.</p><p>• 끈이 변보다 짧으면 그 모서리를 돌아가지 못해서 작은 부채꼴이 <b>없어요</b>.</p>';
  const goatFormula = (M) => `<p><b>영역의 넓이</b> = (큰 부채꼴) + (모서리를 돌아가는 작은 부채꼴들)</p><p>부채꼴의 넓이 = π × (반지름)² × (중심각/360°)</p><p>큰 부채꼴: 반지름 ${num(M.L)}, 중심각 ${M.A.deg}°. 작은 부채꼴의 반지름 = (끈의 길이) − (지나온 변의 길이)</p>`;
  const goatSolution = (kind) => ({
    standardTitle: '기본 풀이 (부채꼴로 나누기)', standardTag: '기본', quickTitle: '이 장면의 핵심', quickTag: '핵심',
    standard: (s) => { s.gtKind = kind; goatClamp(s); const M = goatModel(kind, s); return { steps: M.order.map((x) => `<p>${x.chain === 'A' ? '큰 부채꼴' : x.id + '를 돌아가는 부채꼴'}: 반지름 ${num(x.R)}, 중심각 ${x.deg}° → ${ratPi(x.area)}</p>`).join('') + `<p>합: ${ratPi(M.area)} (m²)</p>` }; },
    quick: () => ({ steps: '<p>끈이 모서리를 만날 때마다 <b>남은 끈</b>으로 바깥각만큼 작은 부채꼴이 하나씩 생겨요.</p>', highlight: '정다각형이면 작은 부채꼴의 중심각이 모두 같아요 (바깥각 = 360° ÷ 변의 수).' })
  });
  const stemTail = '(단, 강아지의 크기와 끈의 매듭의 길이는 생각하지 않는다.)';

  /* ----- 정사각형 개집 (교재 19-18) ----- */
  goatScene({
    id: 'gt-kennel', kind: 'square',
    title: '정사각형 개집에 묶인 강아지', short: '정사각형 개집',
    question: '강아지가 끈으로 움직일 수 있는 영역은 어떤 부채꼴들로 이루어져 있을까?',
    controls: ['gtT', 'gtQ', 'gtL'],
    enter: { gtQ: 2, gtL: 4 },
    variants: [{ gtQ: 2, gtL: 4 }, { gtQ: 3, gtL: 5 }, { gtQ: 3, gtL: 6 }, { gtQ: 2, gtL: 3 }, { gtQ: 4, gtL: 6 }, { gtQ: 4, gtL: 8 }, { gtQ: 3, gtL: 4 }, { gtQ: 5, gtL: 7 }],
    numberPresets: [goatNumPreset('한 변 2 · 끈 4 (교재)', { gtQ: 2, gtL: 4 }), goatNumPreset('한 변 3 · 끈 5', { gtQ: 3, gtL: 5 }), goatNumPreset('한 변 4 · 끈 6', { gtQ: 4, gtL: 6 })],
    textbook: { list: [[10, 1], [12, 1], [14, 1], [16, 1], [18, 1]], ans: 2 },
    steps: goatSteps('square'),
    tag: '교재 문제 · 실수 유발',
    stem: (M) => `오른쪽 그림과 같이 한 변의 길이가 ${num(M.side)} m인 정사각형 모양의 개집의 한 꼭짓점에 강아지가 끈으로 묶여 있다. 끈의 길이가 ${num(M.L)} m일 때, 강아지가 움직일 수 있는 영역의 최대 넓이는? (단, 개집의 내부는 제외하고, 강아지의 크기와 끈의 매듭의 길이는 생각하지 않는다.)`,
    formula: goatFormula, notes: GOAT_NOTES, solution: goatSolution('square')
  });

  /* ----- 직사각형 창고 (교재 20 예제, 서답형) ----- */
  goatScene({
    id: 'gt-warehouse', kind: 'rect', free: true,
    title: '창고 모퉁이에 묶인 강아지', short: '직사각형 창고',
    question: '창고 밖에서 강아지가 움직일 수 있는 영역은 어떤 부채꼴들로 이루어져 있을까?',
    controls: ['gtT', 'gtA', 'gtB', 'gtL'],
    enter: { gtA: 5, gtB: 4, gtL: 7 },
    variants: [{ gtA: 5, gtB: 4, gtL: 7 }, { gtA: 4, gtB: 3, gtL: 5 }, { gtA: 4, gtB: 4, gtL: 6 }, { gtA: 6, gtB: 4, gtL: 8 }, { gtA: 6, gtB: 2, gtL: 4 }, { gtA: 8, gtB: 6, gtL: 10 }, { gtA: 6, gtB: 5, gtL: 8 }, { gtA: 3, gtB: 3, gtL: 4 }],
    numberPresets: [goatNumPreset('5×4 · 끈 7 (교재)', { gtA: 5, gtB: 4, gtL: 7 }), goatNumPreset('4×3 · 끈 5', { gtA: 4, gtB: 3, gtL: 5 }), goatNumPreset('6×2 · 끈 4', { gtA: 6, gtB: 2, gtL: 4 })],
    steps: goatSteps('rect'),
    tag: '교재 20 예제 · 서답형',
    stem: (M) => `오른쪽 그림과 같이 가로의 길이가 ${num(M.side)} m, 세로의 길이가 ${num(M.sideLast)} m인 직사각형 모양의 창고의 한 모퉁이에 말뚝을 박아서 길이가 ${num(M.L)} m인 끈으로 강아지를 묶어 놓았다. 강아지가 창고 밖의 풀밭을 움직일 때, 움직일 수 있는 영역의 최대 넓이를 구하시오. ${stemTail}`,
    formula: goatFormula, notes: GOAT_NOTES, solution: goatSolution('rect')
  });

  /* ----- 정삼각형 울타리 (교재 20 유사 1) ----- */
  goatScene({
    id: 'gt-tri', kind: 'tri',
    title: '정삼각형 울타리에 묶인 염소', short: '정삼각형 울타리',
    question: '울타리가 정삼각형이면 큰 부채꼴과 모서리를 돌아가는 부채꼴의 중심각은 각각 얼마일까?',
    controls: ['gtT', 'gtS', 'gtL'],
    enter: { gtS: 8, gtL: 10 },
    variants: [{ gtS: 8, gtL: 10 }, { gtS: 6, gtL: 8 }, { gtS: 3, gtL: 4 }, { gtS: 9, gtL: 12 }, { gtS: 6, gtL: 7 }, { gtS: 4, gtL: 5 }, { gtS: 6, gtL: 9 }],
    numberPresets: [goatNumPreset('변 8 · 끈 10 (교재)', { gtS: 8, gtL: 10 }), goatNumPreset('변 6 · 끈 8', { gtS: 6, gtL: 8 }), goatNumPreset('변 3 · 끈 4', { gtS: 3, gtL: 4 })],
    textbook: { list: [[66, 1], [200, 3], [72, 1], [250, 3], [86, 1]], ans: 4 },
    steps: goatSteps('tri'),
    tag: '교재 20 유사 1 · 실수 유발',
    stem: (M) => `오른쪽 그림과 같이 한 변의 길이가 ${num(M.side)} m인 정삼각형 모양의 울타리의 한 꼭짓점에 길이가 ${num(M.L)} m인 끈으로 염소를 묶어 놓았다. 염소가 울타리 밖의 풀밭을 움직일 때, 움직일 수 있는 영역의 최대 넓이는? (단, 염소의 크기와 끈의 매듭의 길이는 생각하지 않는다.)`,
    formula: goatFormula, notes: GOAT_NOTES, solution: goatSolution('tri')
  });

  /* ----- 정육각형 가축우리 (교재 20 유사 2, 서답형) ----- */
  goatScene({
    id: 'gt-hex', kind: 'hex', free: true,
    title: '정육각형 가축우리에 묶인 소', short: '정육각형 우리',
    question: '정육각형 우리에서는 큰 부채꼴의 중심각과 작은 부채꼴의 중심각이 각각 얼마일까?',
    controls: ['gtT', 'gtH', 'gtL'],
    enter: { gtH: 6, gtL: 9 },
    variants: [{ gtH: 6, gtL: 9 }, { gtH: 4, gtL: 6 }, { gtH: 5, gtL: 7 }, { gtH: 3, gtL: 5 }, { gtH: 6, gtL: 8 }, { gtH: 4, gtL: 7 }, { gtH: 5, gtL: 10 }],
    numberPresets: [goatNumPreset('변 6 · 끈 9 (교재)', { gtH: 6, gtL: 9 }), goatNumPreset('변 4 · 끈 6', { gtH: 4, gtL: 6 }), goatNumPreset('변 5 · 끈 7', { gtH: 5, gtL: 7 })],
    steps: goatSteps('hex'),
    tag: '교재 20 유사 2 · 서답형',
    stem: (M) => `오른쪽 그림과 같이 한 변의 길이가 ${num(M.side)} m인 정육각형 모양의 가축우리의 한 꼭짓점에 길이가 ${num(M.L)} m인 끈으로 소를 묶어 놓았다. 소가 움직일 수 있는 영역의 최대 넓이를 구하시오. (단, 가축우리의 내부는 제외하고, 소의 크기와 끈의 매듭의 길이는 생각하지 않는다.)`,
    formula: goatFormula, notes: GOAT_NOTES, solution: goatSolution('hex')
  });

  /* ----- 정육각형 둘레에 이어지는 부채꼴 (교재 17-20, 서술형) ----- */
  const spiralSteps = (s) => {
    const M = spiralModel(s), p = M.p, secs = M.secs, k = secs.length;
    const f = (x) => ratPi(x.area);
    const one = (x, j) => `꼭짓점 ${x.id}를 중심으로: 반지름 ${num(x.R)} cm${j > 1 ? ` (= ${num((j - 1) * p)}+${num(p)})` : ''}, 중심각 60°(정육각형의 바깥각) → π×${num(x.R)}²×60/360 = ${f(x)} (cm²)`;
    const rest = secs.slice(2);
    return [
      one(secs[0], 1),
      one(secs[1], 2),
      rest.length ? rest.map((x, i) => one(x, i + 3)).join(' / ') : '세 번째 부채꼴은 없어요 (부채꼴이 2개예요)',
      `(색칠한 부분의 넓이) = ${secs.map(f).join(' + ')} = ${ratPi(M.area)} (cm²)`
    ];
  };
  const spiralWords = ['', '한', '두', '세', '네'];
  const spiralScene = {
    id: 'gt-spiral',
    title: '이어지는 부채꼴',
    short: '이어지는 부채꼴',
    kind: 'spiral',
    question: '반지름이 점점 커지는 부채꼴을 이어 붙이면, 색칠한 부분의 넓이는 어떻게 구할까?',
    controls: ['gtT', 'gtP', 'gtK'],
    presets: [...goatStagePresets(), goatNumPreset('변 3 · 3개 (교재)', { gtP: 3, gtK: 3 }), goatNumPreset('변 2 · 3개', { gtP: 2, gtK: 3 }), goatNumPreset('변 3 · 4개', { gtP: 3, gtK: 4 })],
    actions: GOAT_ACTIONS('점'),
    steps: spiralSteps,
    startStep: 1,
    focus: (s) => { const bx = boxOf(secPoints(spiralModel({ gtP: 3, gtK: 3 }).secs, spiralModel({ gtP: 3, gtK: 3 }).V), 1.2, 1.4); return W({ kind: 'figure' }).box(bx.x0, bx.x1, bx.y0, bx.y1); },
    enter: (s, lab) => {
      defaults(s);
      Object.assign(s, { gtP: 3, gtK: 3 });
      s.gtKind = 'spiral'; s.playing = false; s.gtT = 0; s.csdPick = 0;
      if (lab) { injectStyle(); ensureParams(lab); bindProblemUI(lab); }
    },
    tick: goatTick,
    draw: (b, s, v, lab) => drawSpiral(b, s, v, lab, spiralScene),
    view: (s, lab) => {
      syncReview(lab, spiralScene, s);
      const M = spiralModel(s);
      const t = s.gtT, n = M.secs.length, done = t >= 0.8;
      const idx = Math.min(n - 1, Math.floor((t / 0.8) * n));
      const status = t <= 0 ? { tone: 'info', text: '점이 호를 따라 움직여요' } : !done ? { tone: 'info', text: `꼭짓점 ${M.secs[idx].id} 중심 · r = ${num(M.secs[idx].R)} cm, 60°` } : { tone: 'ok', text: `부채꼴 ${n}개 · 넓이 ${ratPi(M.area)} cm²` };
      return {
        guide: t <= 0 ? '노란 점을 끌거나 재생을 눌러 보세요. 점은 꼭짓점을 중심으로 60°씩 호를 그려요.' : !done ? '꼭짓점이 바뀔 때마다 반지름이 변의 길이만큼 늘어나요.' : '색칠한 부분 = 중심각 60°인 부채꼴들의 합.',
        status,
        readouts: [
          { label: '정육각형의 한 변', value: `${num(M.p)} cm`, color: 'amber' },
          ...M.secs.map((x, i) => ({ label: `꼭짓점 ${x.id} 중심 부채꼴`, value: `${ratPi(x.area)} cm²`, color: x.col, ref: 'S' + i, note: `r = ${num(x.R)} cm, 중심각 60°` })),
          { label: '색칠한 부분의 넓이', value: `${ratPi(M.area)} ≈ ${num(ratVal(M.area) * PI)} cm²`, color: 'rose', wide: true }
        ],
        parts: M.secs.map((x, i) => ({ id: 'S' + i, name: `꼭짓점 ${x.id} 중심`, desc: `반지름 ${num(x.R)}, 중심각 60°`, value: ratPi(x.area), color: x.col })),
        chips: done ? [{ k: '색칠한 부분', html: `$${M.secs.map((x) => ratPiTex(x.area)).join('+')}=${ratPiTex(M.area)}$ cm²`, color: 'rose' }] : [],
        formula: `<p><b>색칠한 부분의 넓이</b> = (부채꼴들의 합)</p><p>정육각형의 한 바깥각은 360° ÷ 6 = 60°이므로 모든 부채꼴의 중심각이 60°예요.</p><p>반지름: ${M.secs.map((x) => num(x.R)).join(', ')} (한 변씩 늘어요)</p>`,
        notes: '<p>• 중심각은 정육각형의 <b>안쪽 각 120°</b>가 아니라 <b>바깥각 60°</b>예요.</p><p>• 반지름은 꼭짓점이 바뀔 때마다 <b>한 변의 길이만큼</b> 늘어나요 (3, 6, 9 …).</p>',
        summary: done ? `색칠한 부분의 넓이 = ${ratPi(M.area)} ≈ ${num(ratVal(M.area) * PI)} cm²` : null
      };
    },
    csd: null
  };
  spiralScene.csd = {
    make: (s) => {
      const M = spiralModel(s), k = M.secs.length;
      const names = M.secs.map((x) => x.id).join(', ');
      return {
        stem: `오른쪽 그림은 한 변의 길이가 ${num(M.p)} cm인 정육각형 ABCDEF의 ${spiralWords[k]} 꼭짓점 ${names}를 각각 중심으로 하는 부채꼴을 그린 것이다. 이때 색칠한 부분의 넓이를 구하고, 그 과정을 서술하시오.`,
        free: { coef: M.area, unit: 'π cm²', show: `색칠한 부분의 넓이는 ${ratPi(M.area)} cm² 예요.` }, ans: 0, ansTex: `$${ratPiTex(M.area)}\\,\\mathrm{cm}^2$`, M
      };
    },
    sig: (s) => `sp|${s.gtP}|${s.gtK}`,
    isDefault: (s) => s.gtP === 3 && s.gtK === 3,
    again: (s) => { Object.assign(s, pickRandom([{ gtP: 3, gtK: 3 }, { gtP: 2, gtK: 3 }, { gtP: 4, gtK: 3 }, { gtP: 3, gtK: 2 }, { gtP: 3, gtK: 4 }, { gtP: 2, gtK: 4 }, { gtP: 5, gtK: 3 }], s, (x, c) => x.gtP === c.gtP && x.gtK === c.gtK)); },
    reset: (s) => { Object.assign(s, { gtP: 3, gtK: 3 }); }
  };
  spiralScene.problem = { tag: '교재 문제 · 서술형', text: (s) => problemHTML(spiralScene, s), answer: (s) => spiralScene.csd.make(s).ansTex, note: '과정은 정리 탭의 단계를 따라 서술해 보세요.' };
  spiralScene.solution = {
    standardTitle: '기본 풀이 (부채꼴의 넓이의 합)', standardTag: '기본', quickTitle: '이 장면의 핵심', quickTag: '핵심',
    standard: (s) => { const M = spiralModel(s); return { steps: M.secs.map((x) => `<p>꼭짓점 ${x.id} 중심: 반지름 ${num(x.R)}, 60° → ${ratPi(x.area)}</p>`).join('') + `<p>합: ${ratPi(M.area)} (cm²)</p>` }; },
    quick: (s) => { const M = spiralModel(s); return { steps: `<p>중심각이 모두 60°이므로 π×(${M.secs.map((x) => num(x.R) + '²').join('+')})×60/360 으로 한꺼번에 구해도 돼요.</p>`, highlight: '반지름의 제곱의 합 × π × 1/6' }; }
  };
  GOAT['gt-spiral'] = spiralScene;

  /* ========================================================================
     8. 등록
     ======================================================================== */
  const swGroup = {
    order: 67,
    id: 'f06-swept',
    title: 'F06 원이 지나간 자리',
    short: 'F06 지나간 자리',
    params: PARAMS,
    scenes: ['sw-square', 'sw-rect', 'sw-tri', 'sw-center', 'sw-inside'].map((id) => SW[id])
  };
  const gtGroup = {
    order: 68,
    id: 'f06-goat',
    title: 'F06 묶인 동물의 영역',
    short: 'F06 묶인 동물',
    params: PARAMS,
    scenes: ['gt-kennel', 'gt-warehouse', 'gt-tri', 'gt-hex', 'gt-spiral'].map((id) => GOAT[id])
  };
  const reg = (window.APL_CS_GROUPS = window.APL_CS_GROUPS || []);
  reg.push(swGroup, gtGroup);
  // 테스트용(전역을 늘리지 않도록 그룹 객체에만 붙입니다)
  swGroup._test = { sweepModel, insideModel, goatModel, spiralModel, goatChoicesFrom, areaChoices, pathChoices, SW, GOAT, linPi, ratPi, num, rat, ratVal, goatClamp, parseCoef };
})();
