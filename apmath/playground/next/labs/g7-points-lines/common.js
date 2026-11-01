/* ==========================================================================
   중1 · 기본 도형(점·선·면 실험실) — 공통 도우미 (common.js)
   - window.APL_PL 에 도우미를 등록합니다. 다른 탭 모듈(solids.js · lines.js · mid.js)이 이것을 씁니다.
   - 장면 만들기 PL.scene(spec): 탐구(조작) → 정리(풀이 단계) → 문제(5지선다 + 숫자 바꾸기)를 한 번에 짜 줍니다.
       model(s)          현재 값으로 다시 계산한 수치 묶음 M (그림·라벨·단계·정답이 모두 M 에서 나옵니다)
       draw(b, s, M, C)  C = { step, tab, hide, thumb }  (step: 정리 탭에서는 지금 단계, 그 밖에는 99)
       quiz(M, s, rng)   { tag, stem, choices:[{ t, ok, hint }] }  정답은 정확히 하나
   - 문제 탭의 그림은 정답이 되는 값 라벨을 감춥니다(C.hide).
   ========================================================================== */
(function () {
  'use strict';
  const PL = (window.APL_PL = window.APL_PL || {});
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const NUM = ['①', '②', '③', '④', '⑤'];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  Object.assign(PL, { clamp, NUM, esc });

  /* ------------------------------------------------------------------ 난수 (같은 seed → 같은 문제) */
  PL.rng = function (seed) {
    let a = (seed >>> 0) || 1;
    return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  };
  PL.hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  PL.pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
  PL.shuffle = (rng, arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  PL.randInt = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
  PL.C2 = (n) => n * (n - 1) / 2;

  /* ------------------------------------------------------------------ 그리기 도우미 */
  // 그림이 차지하는 범위를 보이지 않는 선으로 알려 줍니다(자동 맞춤이 늘 같은 범위를 쓰도록)
  PL.bbox = (b, x0, y0, x1, y1) => b.path([{ x: x0, y: y0 }, { x: x1, y: y1 }], { color: null });
  // 글자 (색: ink sky rose amber green violet muted). 휴대폰에서도 12px 이상이 되도록 기본 15
  PL.T = (b, p, t, o = {}) => b.text(p, t, { dx: o.dx || 0, dy: o.dy || 0, color: o.color || 'ink', size: o.size || 15, weight: 800, align: o.align || 'center', baseline: o.baseline || 'middle' });
  // 점과 이름: 이름은 (dx,dy) 화면 픽셀만큼 떨어진 곳
  PL.pt = (b, p, name, o = {}) => { b.point(p, { color: o.color || 'ink', r: o.r || 5.5 }); if (name) PL.T(b, p, name, { dx: o.dx || 0, dy: o.dy == null ? 20 : o.dy, color: o.nameColor || o.color || 'ink', size: o.size || 16 }); };
  // 화살표: from → to, 머리는 to 쪽
  PL.arrow = (b, from, to, o = {}) => {
    const k = b.k || 30, len = Math.hypot(to.x - from.x, to.y - from.y) || 1, ux = (to.x - from.x) / len, uy = (to.y - from.y) / len;
    const hs = (o.head || 12) / k, wg = hs * 0.5, color = o.color || 'ink';
    b.seg(from, { x: to.x - ux * hs * 0.55, y: to.y - uy * hs * 0.55 }, { color, width: o.width || 3.4, alpha: o.alpha, dash: o.dash });
    b.path([to, { x: to.x - ux * hs - uy * wg, y: to.y - uy * hs + ux * wg }, { x: to.x - ux * hs + uy * wg, y: to.y - uy * hs - ux * wg }], { close: true, fill: color, fillAlpha: o.alpha == null ? 1 : o.alpha, color, width: 1, alpha: o.alpha });
  };
  // 눈금자: x0~x1(cm) 정수 눈금과 숫자
  PL.ruler = (b, x0, x1, y, o = {}) => {
    b.seg({ x: x0, y }, { x: x1, y }, { color: 'muted', width: 1.6, alpha: 0.7 });
    for (let i = Math.ceil(x0); i <= x1; i++) {
      const big = i % (o.every || 1) === 0;
      b.seg({ x: i, y }, { x: i, y: y + (big ? 0.2 : 0.12) }, { color: 'muted', width: 1.5, alpha: 0.8 });
      if (big) PL.T(b, { x: i, y: y + 0.2 }, String(i), { dy: 13, color: 'muted', size: 12 });
    }
  };
  // 길이 표시 치수선(양 끝 작은 선 + 굵은 선 + 가운데 글자). a, c 는 같은 높이의 두 점
  PL.dim = (b, a, c, text, o = {}) => {
    const y = a.y, col = o.color || 'green', tk = o.tick == null ? 0.13 : o.tick;
    b.seg(a, c, { color: col, width: o.width || 3.4 });
    b.seg({ x: a.x, y: y - tk }, { x: a.x, y: y + tk }, { color: col, width: 2.4 });
    b.seg({ x: c.x, y: y - tk }, { x: c.x, y: y + tk }, { color: col, width: 2.4 });
    if (text) PL.T(b, { x: (a.x + c.x) / 2, y }, text, { dy: o.dy == null ? -16 : o.dy, color: col, size: o.size || 16 });
  };

  /* ------------------------------------------------------------------ 문제 도우미 */
  // 숫자 보기 5개: 정답 + 오답 후보(v, hint)로 채우고 부족하면 가까운 수로 채운 뒤 작은 수부터 정렬
  PL.numChoices = function (correct, wrongs, o = {}) {
    const fmt = o.fmt || ((v) => String(v)), minV = o.min == null ? 1 : o.min, seen = new Set([correct]), out = [];
    const add = (v, hint) => { if (!Number.isFinite(v) || v < minV || seen.has(v)) return; seen.add(v); out.push({ v, hint }); };
    (wrongs || []).forEach((w) => add(w.v, w.hint));
    const step = o.step || 1, near = o.near || '값을 다시 계산해 보세요.';
    for (let d = 1; out.length < 4 && d < 80; d++) { add(correct + d * step, near); if (out.length < 4) add(correct - d * step, near); }
    const all = [{ v: correct, ok: true, hint: '' }, ...out.slice(0, 4).map((w) => ({ v: w.v, ok: false, hint: w.hint || '' }))].sort((a, b) => a.v - b.v);
    return all.map((c) => ({ t: fmt(c.v), v: c.v, ok: c.ok, hint: c.hint }));
  };
  // 글 보기 5개: 정답 1개 + 오답들 중 4개를 섞어서
  PL.textChoices = function (rng, right, wrongs) {
    const pool = PL.shuffle(rng, wrongs).slice(0, 4);
    return PL.shuffle(rng, [{ ...right, ok: true }, ...pool.map((w) => ({ ...w, ok: false }))]);
  };
  // 옳은 설명 고르기: trues 에서 1개, falses 에서 4개
  PL.truthQuiz = function (rng, trues, falses, stem, tag) {
    const tr = PL.pick(rng, trues);
    return { tag: tag || '옳은 것 고르기', stem, choices: PL.textChoices(rng, { t: tr.t, hint: '' }, falses.map((f) => ({ t: f.t, hint: f.hint || '' }))) };
  };

  /* ------------------------------------------------------------------ 장면 만들기 */
  PL.scene = function (spec) {
    const kind = spec.kind || 'figure';
    const model = (s) => spec.model(s);
    const nSteps = (s) => spec.steps(model(s)).length;
    const ctxOf = (s, lab, thumb) => {
      const tab = lab && lab.tab ? lab.tab : 'explore';
      return { tab, hide: tab === 'problem', thumb: !!thumb, step: thumb ? 99 : tab === 'review' ? Math.min(s.step || 1, 99) : 99 };
    };
    const quizOf = (s) => spec.quiz(model(s), s, PL.rng(PL.hash(spec.id) + ((s.plSeed || 0) + 1) * 7919));
    const keyOf = (s) => spec.id + '|' + (s.plSeed || 0);
    const problemHTML = (s) => {
      const Q = quizOf(s), pk = s.plPick && s.plPick.key === keyOf(s) ? s.plPick : null;
      let h = `<div class="plq-stem">${Q.stem}</div><div class="plq-choices">`;
      Q.choices.forEach((o, i) => {
        const cls = pk && pk.idx === i ? (o.ok ? ' ok' : ' bad') : '';
        h += `<button type="button" class="plq-ch${cls}" data-plq-pick="${i}" aria-label="${NUM[i]} ${esc(String(o.t).replace(/\$/g, ''))}"><span class="n">${NUM[i]}</span><span class="v">${o.t}</span></button>`;
      });
      h += '</div>';
      if (pk) {
        const o = Q.choices[pk.idx];
        h += o.ok ? '<div class="plq-fb ok"><b>정답이에요!</b> 정리 탭에서 풀이 과정을 확인해 보세요.</div>' : `<div class="plq-fb bad"><b>다시 생각해 볼까요?</b> ${o.hint || ''}</div>`;
      }
      h += `<div class="plq-tools"><button type="button" class="apl-btn sm" data-plq-new>숫자 바꾸기</button>${Q.note ? `<span class="plq-note">${Q.note}</span>` : ''}</div>`;
      return h;
    };
    const boxOf = (b) => (typeof spec.box === 'function' ? spec.box(b) : spec.box);
    const scene = {
      id: spec.id, title: spec.title, short: spec.short || spec.title, _pl: spec, boardKind: kind,
      question: spec.question,
      guide: (s) => spec.guide(model(s), s),
      controls: () => (typeof spec.controls === 'function' ? spec.controls() : spec.controls) || [],
      presets: (s) => (spec.presets ? spec.presets(s) : []),
      actions: () => (spec.actions ? spec.actions() : []),
      steps: (s) => spec.steps(model(s)),
      notesTitle: spec.notesTitle || '자주 틀리는 부분',
      problem: {
        tag: (s) => quizOf(s).tag,
        text: (s) => problemHTML(s),
        answer: (s) => { const Q = quizOf(s), i = Q.choices.findIndex((o) => o.ok); return `${NUM[i]} ${Q.choices[i].t}`; }
      },
      autoFit: true,
      focus: () => scene._focus || null,
      enter: (s, lab) => {
        Object.assign(s, typeof spec.init === 'function' ? spec.init(s) : spec.init || {});
        s.plSeed = 0; s.plPick = null; s.playing = false;
        if (lab && lab.board && s === lab.s) {
          scene._focus = null;
          lab.board.onPanDrag = spec.orbit ? (dx, dy) => { spec.orbit(lab.s, dx, dy); lab.invalidate(true); } : null;
        } else { const bx = boxOf({ W: 900 }); scene._focus = bx ? { x: [bx[0], bx[2]], y: [bx[1], bx[3]] } : null; } // 장면 목록의 작은 그림용
      },
      tick: spec.tick,
      view: (s, lab) => {
        const M = model(s), C = ctxOf(s, lab);
        const v = { guide: spec.guide(M, s) };
        if (C.tab === 'problem') { v.status = { tone: 'info', text: '그림을 보고 풀어 보세요' }; return v; }
        v.readouts = spec.readouts ? spec.readouts(M, s) : [];
        if (C.tab === 'review') { const n = nSteps(s); v.status = { tone: s.step >= n ? 'ok' : 'info', text: `풀이 ${Math.min(Math.max(s.step || 1, 1), n)} / ${n}단계` }; }
        else if (spec.status) v.status = spec.status(M, s);
        if (spec.alert) { const a = spec.alert(M, s); if (a) v.alert = a; }
        if (spec.formula) v.formula = spec.formula(M, s);
        if (spec.rule) v.rule = spec.rule(M, s);
        if (spec.notes) v.notes = spec.notes(M, s);
        return v;
      },
      draw: (b, s, v, lab) => {
        const C = ctxOf(s, lab, b.thumb);
        const bx = boxOf(b);
        if (bx) PL.bbox(b, bx[0], bx[1], bx[2], bx[3]);
        spec.draw(b, s, model(s), C);
      }
    };
    return scene;
  };

  // 문제 탭 버튼(전역 한 번만 연결)
  document.addEventListener('click', (ev) => {
    const lab = window.lab;
    if (!lab || !ev.target || !ev.target.closest) return;
    const hit = ev.target.closest('[data-plq-pick],[data-plq-new]');
    if (!hit) return;
    const sc = lab.scene, spec = sc && sc._pl;
    if (!spec) return;
    const s = lab.s;
    if (hit.hasAttribute('data-plq-new')) {
      if (spec.reroll) spec.reroll(s, PL.rng((Date.now() & 0xffff) + (s.plSeed || 0) * 31 + 1));
      s.plSeed = (s.plSeed || 0) + 1; s.plPick = null; s.revealed = false;
      lab.setStep(1);
      return;
    }
    const idx = parseInt(hit.getAttribute('data-plq-pick'), 10);
    s.plPick = { key: spec.id + '|' + (s.plSeed || 0), idx };
    const Q = spec.quiz(spec.model(s), s, PL.rng(PL.hash(spec.id) + ((s.plSeed || 0) + 1) * 7919));
    if (Q.choices[idx] && Q.choices[idx].ok) s.revealed = true;
    lab.invalidate(true);
  });
  const st = document.createElement('style');
  st.textContent = `
.plq-stem{font-size:var(--fs-md);line-height:1.85}
.plq-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0 4px}
.plq-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left}
.plq-ch:hover{background:var(--hover)}
.plq-ch .n{color:var(--m-amber);flex:none}
.plq-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.plq-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.plq-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.plq-fb.ok{border-left-color:var(--m-green)}
.plq-fb.bad{border-left-color:var(--m-red)}
.plq-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.plq-note{font-size:var(--fs-xs);color:var(--text-3)}
@media (max-width:420px){.plq-choices{grid-template-columns:1fr}}`;
  document.head.append(st);

  /* ------------------------------------------------------------------ 탭 묶음 등록 */
  PL.group = function (g) { (window.APL_PL_GROUPS = window.APL_PL_GROUPS || []).push(g); };
})();
