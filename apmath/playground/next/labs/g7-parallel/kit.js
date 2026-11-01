/* ==========================================================================
   중1 · 평행선의 성질 — 공용 도구 (kit.js, window.APL_PA_KIT)
   - 이 파일은 그림 도우미(평행선·각 부채꼴·눈금), 문제(5지선다) 만들기, 장면 만들기(makeScene)만 가집니다.
   - 장면 하나는 데이터 D 로 정의합니다.
       id · title · short · question · ctl(조작 막대 id 목록) · presets · actions
       init(s) 장면에 들어올 때 값 · reroll(s) 「숫자 바꾸기」 · model(s) 지금 값에서 모든 수를 다시 계산
       draw(b, s, M, C) 그림 · steps(M) 정리 단계 글 · view(M, C, s) 안내·실시간 값 · prob(M, s) 5지선다
     C = { mode: 'explore' | 'review' | 'problem' | 'thumb', step(정리 단계, 탐구는 99), plain(문제 탭이면 true) }
   - 그림 좌표: figure(y 아래쪽). 방향은 모두 「수학 각도」(오른쪽 0°, 위쪽 90°, 반시계)로 다루고 dir(°)로 바꿉니다.
   - 색의 역할: 하늘 = 평행선 l·m · 분홍 = 횡단선·꺾인 선·접는 선 · 노랑 = 각 · 초록 = 구하는 각 x · 보라 = 다른 쪽 각 · 회색 점선 = 보조선
   - 움직임: 위치 이동은 가로로만, 접기는 접는 선에서 제자리 회전.
   ========================================================================== */
(function () {
  'use strict';
  const K = (window.APL_PA_KIT = window.APL_PA_KIT || {});
  const DEG = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const NUM = ['①', '②', '③', '④', '⑤'];
  const dir = (d) => ({ x: Math.cos(d * DEG), y: -Math.sin(d * DEG) });
  const add = (p, q) => ({ x: p.x + q.x, y: p.y + q.y });
  const mul = (p, k) => ({ x: p.x * k, y: p.y * k });
  const at = (p, d, len) => add(p, mul(dir(d), len));
  const angOf = (p, q) => Math.atan2(-(q.y - p.y), q.x - p.x) / DEG; // p→q 의 수학 각도
  const norm = (d) => ((d % 360) + 360) % 360;
  const lerp = (p, q, f) => ({ x: p.x + (q.x - p.x) * f, y: p.y + (q.y - p.y) * f });
  const ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (list, cur) => { const pool = list.filter((x) => x !== cur); return pool[Math.floor(Math.random() * pool.length)]; };
  const mi = (v) => String(v).replace('-', '−');
  const textW = (t, size) => { let w = 0; for (const ch of String(t)) { const c = ch.charCodeAt(0); w += c >= 0x1100 ? size : ch === ' ' ? size * 0.32 : size * 0.62; } return w; };
  Object.assign(K, { DEG, clamp, esc, NUM, dir, add, mul, at, angOf, norm, lerp, ease, rnd, pick, mi, textW });

  /* ------------------------------------------------------------------ 그리기 도우미 */
  // 글자: 화면 크기에 맞춰 줄이되 휴대폰에서도 14px 안팎을 지킵니다. dx·dy 는 화면 픽셀.
  const T = (b, p, t, o = {}) => b.text(p, t, { dx: o.dx || 0, dy: o.dy || 0, color: o.color || 'ink', size: (o.size || 16) * (b.W < 560 ? 0.92 : 1), weight: 800, align: o.align || 'center', baseline: 'middle', alpha: o.alpha });
  const dot = (b, p, c = 'ink', r = 5.5) => b.point(p, { color: c, r });
  // 평행선 표시 화살표(>) 를 선 위 여러 곳에 그립니다.
  function chevrons(b, P, d, ts, o = {}) {
    const k = b.k || 100, u = dir(d), n = { x: -u.y, y: u.x };
    ts.forEach((t) => {
      const Q = add(P, mul(u, t)), back = add(Q, mul(u, -7.5 / k));
      b.path([add(back, mul(n, 6.5 / k)), Q, add(back, mul(n, -6.5 / k))], { color: o.color || 'sky', width: 2.8 });
    });
  }
  // 평행선: P 를 지나는 방향 d, 선분 구간 [e0,e1]. 평행 표시(>)와 이름.
  function parLine(b, P, d, o = {}) {
    const e0 = o.e0 == null ? -5 : o.e0, e1 = o.e1 == null ? 5 : o.e1;
    b.path([at(P, d, e0), at(P, d, e1)], { color: o.color || 'sky', width: o.width || 3.4 });
    chevrons(b, P, d, o.arrows || [e0 * 0.55, e1 * 0.55], { color: o.color || 'sky' });
    if (o.name) T(b, at(P, d, o.nameAt == null ? e1 : o.nameAt), o.name, { dx: o.nameDx == null ? -4 : o.nameDx, dy: o.nameDy == null ? -17 : o.nameDy, color: o.color || 'sky', size: 18 });
  }
  // 각 부채꼴: V 에서 반직선 d1·d2(수학 각도) 사이의 (180° 이하) 각. text 는 벌어진 쪽 가운데에.
  function wedge(b, V, d1, d2, o = {}) {
    let w = norm(d2 - d1);
    if (w > 180) { const t = d1; d1 = d2; d2 = t; w = 360 - w; }
    const col = o.color || 'amber', k = b.k || 100, rpx = (o.r || 30) * (b.W < 560 ? 0.88 : 1), rw = rpx / k;
    const s0 = -(d1 + w) * DEG, s1 = -d1 * DEG;
    if (o.bare) { /* 이름만 */ }
    else if (Math.abs(w - 90) < 1e-6 && !o.noRight) b.right(V, at(V, d1, 1), at(V, d1 + w, 1), { size: 15, color: col });
    else {
      b.arc(V, rw, s0, s1, { sector: true, fill: col, fillAlpha: o.fa == null ? 0.24 : o.fa, color: null });
      for (let i = 0; i < (o.rings || 1); i++) b.arc(V, rw - (i * 5) / k, s0, s1, { color: col, width: 2.4 });
    }
    if (o.text) {
      const size = (o.size || 17) * (b.W < 560 ? 0.92 : 1), tw = textW(o.text, size), bis = d1 + w / 2, u = dir(o.flip ? -bis : bis); // flip: 가로선 반대쪽(평행선 바깥)에 글자
      if (o.at) T(b, V, o.text, { dx: o.at.dx, dy: o.at.dy, color: o.tcolor || col, size: o.size || 17 });
      else {
        // 글자 상자가 호에 닿지 않을 만큼 띄우고(Dc), 각이 좁으면 각 안쪽으로 조금 더 밀어 냅니다(최대 1.25배)
        const Dc = rpx + 8 + Math.abs(u.x) * tw / 2 + Math.abs(u.y) * size * 0.55;
        const need = (tw / 2 + 9) / Math.tan(clamp(w / 2, 14, 80) * DEG);
        const D = Math.max(Dc, Math.min(need, Dc * 1.25, o.maxD || 999));
        T(b, V, o.text, { dx: u.x * D, dy: u.y * D, color: o.tcolor || col, size: o.size || 17 });
      }
    }
    return { w, bis: d1 + w / 2 };
  }
  // 두 점을 이어 놓은 한 변의 같은 길이 눈금
  const ticks = (b, p, q, n = 1, color = 'amber') => b.ticks(p, q, { count: n, color });
  // 선 위의 점(A, B 등) 이름
  const vname = (b, p, name, dx, dy, color = 'ink') => T(b, p, name, { dx, dy, color, size: 17 });

  Object.assign(K, { T, dot, chevrons, parLine, wedge, ticks, vname });

  /* ------------------------------------------------------------------ 5지선다 만들기 (각도 값) */
  // correct: 정답, wrongs: [{v, hint}] (그럴듯한 오답 후보, 순서대로 씀), 모자라면 정답 근처 값으로 채움. 값 오름차순.
  function mkChoices(correct, wrongs, o = {}) {
    const lo = o.lo == null ? 1 : o.lo, hi = o.hi == null ? 359 : o.hi;
    const list = [{ v: correct, ok: true, hint: '' }];
    const seen = new Set([correct]);
    (wrongs || []).forEach((w) => { if (list.length < 5 && !seen.has(w.v) && w.v >= lo && w.v <= hi) { seen.add(w.v); list.push({ v: w.v, ok: false, hint: w.hint || '' }); } });
    const stepv = o.fill || 5;
    for (let i = 1; list.length < 5 && i < 60; i++) {
      [correct + i * stepv, correct - i * stepv].forEach((v) => { if (list.length < 5 && !seen.has(v) && v >= lo && v <= hi) { seen.add(v); list.push({ v, ok: false, hint: '풀이 순서대로 다시 계산해 보세요. 정리 탭의 단계를 확인해 보세요.' }); } });
    }
    list.sort((a, b) => a.v - b.v);
    return list.map((c) => ({ v: c.v, ok: c.ok, hint: c.hint, t: (o.tex ? o.tex(c.v) : mi(c.v) + '^{\\circ}'), p: (o.plain ? o.plain(c.v) : mi(c.v) + '°') }));
  }
  K.mkChoices = mkChoices;

  /* ------------------------------------------------------------------ 문제 화면 (5지선다) */
  let curLab = null;
  function refreshReview(lab) {
    try { lab._buildReview(); } catch (e) { /* 키트가 바뀌어도 그림은 그대로 */ }
    lab.invalidate(true);
  }
  K.refreshReview = refreshReview;
  const keyOf = (D, P, s) => D.id + '|' + P.key + '|' + (s.paseed || 0);
  function problemHTML(D, s) {
    const M = D.model(s);
    const P = D.prob(M, s);
    const pk = s.papick && s.papick.key === keyOf(D, P, s) ? s.papick : null;
    let h = `<div class="pa-q">${esc(P.stem).replace(/&amp;/g, '&')}</div>`;
    h += `<div class="pa-choices${P.choices.some((o) => o.html) ? ' figs' : ''}">`;
    P.choices.forEach((o, i) => {
      const cls = pk && pk.idx === i ? (o.ok ? ' ok' : ' bad') : '';
      h += `<button type="button" class="pa-ch${o.html ? ' fig' : ''}${cls}" data-pa-pick="${i}" aria-label="${NUM[i]} ${esc(o.p)}"><span class="n">${NUM[i]}</span><span class="v">${o.html ? o.html : '$' + o.t + '$'}</span></button>`;
    });
    h += '</div>';
    if (pk) {
      const o = P.choices[pk.idx];
      h += o.ok ? '<div class="pa-fb ok"><b>정답이에요!</b> 정리 탭에서 풀이 과정을 확인해 보세요.</div>' : `<div class="pa-fb bad"><b>다시 생각해 볼까요?</b> ${esc(o.hint || '그림의 각을 다시 확인해 보세요.')}</div>`;
    }
    h += `<div class="pa-tools"><button type="button" class="apl-btn sm" data-pa-new>숫자 바꾸기</button>${P.note ? `<span class="pa-note">${esc(P.note)}</span>` : ''}</div>`;
    return h;
  }
  function answerText(D, s) {
    const P = D.prob(D.model(s), s), i = P.choices.findIndex((o) => o.ok);
    return P.choices[i].html ? `${NUM[i]} (그림 ${NUM[i]})` : `${NUM[i]} $${P.choices[i].t}$`;
  }
  function installClicks() {
    const root = document.documentElement;
    if (root.dataset.paBound) return;
    root.dataset.paBound = '1';
    document.addEventListener('click', (ev) => {
      const lab = curLab || window.lab;
      if (!lab || !ev.target || !ev.target.closest) return;
      const hit = ev.target.closest('[data-pa-pick],[data-pa-new]');
      if (!hit) return;
      const sc = lab.scene;
      if (!sc || !sc.pa) return;
      const D = sc.pa, s = lab.s;
      if (hit.hasAttribute('data-pa-new')) {
        D.reroll(s);
        s.paseed = (s.paseed || 0) + 1; s.papick = null; s.revealed = false; s.playing = false;
        lab.setStep(1);
        refreshReview(lab);
        return;
      }
      const idx = parseInt(hit.getAttribute('data-pa-pick'), 10);
      const P = D.prob(D.model(s), s);
      s.papick = { key: keyOf(D, P, s), idx };
      if (P.choices[idx] && P.choices[idx].ok) s.revealed = true;
      lab.invalidate(true);
    });
  }
  function installStyle() {
    if (document.getElementById('pa-css')) return;
    const st = document.createElement('style');
    st.id = 'pa-css';
    st.textContent = `
.pa-q{font-size:var(--fs-md);line-height:1.85}
.pa-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0 4px}
.pa-ch{display:flex;gap:8px;align-items:center;min-height:46px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left}
.pa-ch:hover{background:var(--hover)}
.pa-ch .n{color:var(--m-amber);flex:none}
.pa-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.pa-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.pa-ch.fig{flex-direction:column;align-items:stretch;gap:4px}
.pa-ch.fig .n{align-self:flex-start}
.pa-choices.figs{grid-template-columns:minmax(0,1fr)}
.pa-ch.fig svg{width:100%;max-width:260px;height:auto;display:block;margin:0 auto}
.pa-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.pa-fb.ok{border-left-color:var(--m-green)}
.pa-fb.bad{border-left-color:var(--m-red)}
.pa-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.pa-note{font-size:var(--fs-xs);color:var(--text-3)}`;
    document.head.append(st);
  }
  installStyle();
  installClicks();
  K.problemHTML = problemHTML;

  /* ------------------------------------------------------------------ 장면 만들기 */
  function baseCtx(s, lab, thumb) {
    const tab = thumb ? 'explore' : (lab && lab.tab) || 'explore';
    const review = !thumb && tab === 'review';
    const problem = !thumb && tab === 'problem';
    return { mode: thumb ? 'thumb' : problem ? 'problem' : review ? 'review' : 'explore', tab, step: review ? Math.max(1, s.step || 1) : 99, plain: problem, review, problem, thumb: !!thumb };
  }
  function makeScene(D) {
    const isF = (v, s) => (typeof v === 'function' ? v(s) : v);
    return {
      id: D.id, title: D.title, short: D.short || D.title, pa: D,
      question: D.question,
      controls: (s) => isF(D.ctl, s) || [],
      presets: (s) => (D.presets ? D.presets(s) : []),
      actions: (s) => (D.actions ? D.actions(s) : []),
      steps: (s) => D.steps(D.model(s)),
      notesTitle: D.notesTitle || '자주 틀리는 부분',
      problem: {
        tag: (s) => D.prob(D.model(s), s).tag,
        text: (s) => problemHTML(D, s),
        answer: (s) => answerText(D, s)
      },
      focus: () => D.focus,
      enter: (s, lab) => {
        D.init(s);
        s.paseed = 0; s.papick = null; s.playing = false; s.pat = D.t0 == null ? 0 : D.t0;
        if (lab) curLab = lab;
      },
      tick: D.tick || null,
      view: (s, lab) => {
        if (lab) curLab = lab;
        const C = baseCtx(s, lab, false);
        const M = D.model(s);
        const v = D.view(M, C, s) || {};
        // 값이 바뀌면(막대·끌기·숫자 바꾸기) 정리 단계 글도 새 값으로 다시 쓰도록 합니다.
        if (lab && lab.scene && lab.scene.pa === D) {
          const sig = D.steps(M).join('|');
          if (D._sig !== sig) {
            const first = D._sig == null;
            D._sig = sig;
            if (!first) Promise.resolve().then(() => { if (lab.scene && lab.scene.pa === D) refreshReview(lab); });
          }
        }
        if (C.mode === 'problem') { v.status = { tone: 'info', text: '그림을 보고 풀어 보세요' }; v.chips = null; }
        else if (C.mode === 'review') { const n = D.steps(M).length; v.status = { tone: s.step >= n ? 'ok' : 'info', text: `풀이 ${Math.min(s.step || 1, n)} / ${n}단계` }; }
        return v;
      },
      draw: (b, s, v, lab) => {
        const C = baseCtx(s, lab, !!b.thumb);
        D.draw(b, s, D.model(s), C);
      }
    };
  }
  K.makeScene = makeScene;

  // 장면 묶음(탭) 등록: 모듈마다 한 번
  K.register = function (g) {
    (window.APL_PA_GROUPS = window.APL_PA_GROUPS || []).push(g);
  };

  /* ------------------------------------------------------------------ 조작 막대 정의 도우미 */
  const degF = (v) => v + '°';
  K.degF = degF;
  K.param = (o) => Object.assign({ min: 0, max: 100, step: 1, color: 'amber', format: degF }, o);
  K.reviewTick = null;

  /* ------------------------------------------------------------------ 재생(접기) 도우미 */
  // 접힘 정도 s.pat(0~1)을 0↔1 로 부드럽게 움직입니다. play 버튼은 접힘/펼침을 번갈아 합니다.
  K.foldActions = (D) => [
    {
      id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'),
      label: (s) => (s.playing ? '일시 정지' : s.pat >= 0.999 ? '펼쳤다가 다시 접기' : '접어 보기'),
      on: (s) => s.playing,
      run: (s) => { if (s.playing) s.playing = false; else { if (s.pat >= 0.999) s.pat = 0; s.playing = true; } }
    },
    { id: 'reset', icon: 'reset', label: '펼치기', run: (s) => { s.playing = false; s.pat = 0; } }
  ];
  K.foldTick = (dur, reviewTarget) => (s, dt, lab) => {
    let again = false;
    if (s.playing) { s.pat = Math.min(1, s.pat + dt / dur); if (s.pat >= 1) s.playing = false; again = true; }
    else if (lab && lab.tab === 'review' && !s.dragging) {
      const tg = reviewTarget ? reviewTarget(s) : 1, d = tg - s.pat;
      if (Math.abs(d) > 1e-3) { s.pat += clamp(d, -dt * 0.9, dt * 0.9); again = true; } else s.pat = tg;
    } else if (lab && lab.tab === 'problem' && s.pat < 1) { s.pat = Math.min(1, s.pat + dt * 1.2); again = true; }
    return again;
  };
})();
