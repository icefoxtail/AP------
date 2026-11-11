/* ==========================================================================
   중1 · 회전체 — 공용 도구 (core.js)
   - 탭 모듈(solid3d.js, t1~t4.js)이 함께 쓰는 도구 모음입니다. 전역은 APL_SO(도구)와 APL_RV_GROUPS(탭 묶음) 둘뿐입니다.
   - 장면 하나 = 탐구(조절·돌려 보기·실시간 값) → 정리(교과서 해결 전략 순서, 단계마다 그림이 강조) → 문제(5지선다 + 숫자 바꾸기).
   - 색의 역할(이 실험실 전체): 하늘 = 회전체(입체) · 노랑 = 평면도형·구하는 길이·끈 · 분홍 = 회전축·자르는 평면 · 초록 = 계산 결과.
   - 입체는 평행투영(원근 없음). 빈 곳을 끌면 시점이 제자리에서 돌아갑니다(이동이 아니라 회전).
   - 움직임 규칙: 이동은 가로로만(굴리기·단면판 밀기·조각 밀기). 평면도형이 축을 도는 것, 시점 돌리기는 제자리 회전이라 허용.
   ========================================================================== */
(function () {
  'use strict';
  const PI = Math.PI, DEG = PI / 180;
  // 기본 내려다보는 각(°): 밑면 타원의 세로/가로 = sin(각) ≈ 0.42. 22°일 때(0.37)보다 원기둥·원뿔 밑면이 덜 납작해 보입니다.
  const PITCH0 = 25;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const seg01 = (t, a, b) => ease((t - a) / (b - a));
  const NUM = ['①', '②', '③', '④', '⑤'];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (list, cur) => { const pool = list.filter((x) => x !== cur); return pool[Math.floor(Math.random() * pool.length)]; };
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmtN = (v, d = 1) => { const f = Math.pow(10, d), x = Math.round(v * f) / f; return (Number.isInteger(x) ? String(x) : x.toFixed(d)).replace('-', '−'); };
  const hashS = (str) => { let h = 2166136261; for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  // 씨앗이 같으면 늘 같은 순서로 섞입니다(그림을 다시 그려도 보기의 순서가 바뀌지 않게)
  const sshuffle = (arr, seedStr) => { let a = hashS(seedStr); const rnd = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; const o = arr.slice(); for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; } return o; };
  // 수식($…$) 안의 따옴표(′)는 화면에서 이스케이프되므로 ^{\prime} 로 바꿉니다
  const texFix = (str) => String(str).replace(/\$([^$]*)\$/g, (m, t) => '$' + t.replace(/'/g, '^{\\prime}') + '$');
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  // 받침에 따라 조사: 'wa'(과/와) · 'eul'(을/를) · 'eun'(은/는) · 'i'(이/가)
  const PAIR = { wa: ['과', '와'], eul: ['을', '를'], eun: ['은', '는'], i: ['이', '가'] };
  const hasBatchim = (w) => {
    const ch = String(w).trim().slice(-1), code = ch.charCodeAt(0) - 0xac00;
    if (code >= 0 && code <= 11171) return code % 28 !== 0;
    if (/[ㄱ-ㅎ]/.test(ch)) return true;
    return /[LMNRlmnr0136-8]/.test(ch);
  };
  const jo = (w, kind) => PAIR[kind][hasBatchim(w) ? 0 : 1];
  // π 가 붙은 값: 계수 k(정수 또는 반정수) → '12π'
  const piT = (k) => (Math.abs(k - 1) < 1e-9 ? 'π' : fmtN(k, 1) + 'π');
  const piTex = (k) => (Math.abs(k - 1) < 1e-9 ? '\\pi' : fmtN(k, 1) + '\\pi');
  const span = (c, t) => `<b style="color:var(--m-${c})">${t}</b>`;

  /* ------------------------------------------------------------------ 그림 맞춤·글자 */
  const textW = (t, size) => { let w = 0; for (const ch of String(t)) { const c = ch.charCodeAt(0); w += c >= 0x1100 ? size * 1.0 : ch === ' ' ? size * 0.32 : size * 0.62; } return w; };
  // 그림 상자(box: 세계 좌표)를 무대에 꼭 맞춥니다. 글자·손잡이 자리는 화면 픽셀(l r t b)로 따로 줍니다.
  function fitScale(b, box, o = {}) {
    const narrow = b.W < 560;
    const aw = Math.max(10, b.W - b.insets.left - b.insets.right), ah = Math.max(10, b.H - b.insets.top - b.insets.bottom);
    const pp = b.pad * Math.min(aw, ah), W = aw - 2 * pp, H = ah - 2 * pp;
    const base = b.thumb ? 5 : narrow ? 26 : 44;
    const pad = b.thumb ? { l: 5, r: 5, t: 5, b: 5 } : { l: o.l == null ? base : o.l, r: o.r == null ? base : o.r, t: o.t == null ? base : o.t, b: o.b == null ? base : o.b };
    const bw = Math.max(1e-6, box.x1 - box.x0), bh = Math.max(1e-6, box.y1 - box.y0);
    let k = Math.max(3, Math.min((W - pad.l - pad.r) / bw, (H - pad.t - pad.b) / bh));
    if (o.maxK) k = Math.min(k, o.maxK);
    return { k, pad };
  }
  const fitK = (b, box, o) => fitScale(b, box, o).k;
  function fit(b, box, o = {}) {
    const { k, pad } = fitScale(b, box, o);
    // 상자를 가운데에 두되, 남는 쪽으로 균형 있게 퍼지도록 focus 를 잡습니다(기본 좌우·상하 가운데).
    b.focus = { x: [box.x0 - pad.l / k, box.x1 + pad.r / k], y: [box.y0 - pad.b / k, box.y1 + pad.t / k] };
    return b.k;
  }
  // 전개도와 함께 있는 입체(원뿔·원기둥)는 휴대폰에서 전개도 크기에 끌려 작아지므로, 입체만 따로 키워 그립니다(전개도와 입체는 비율을 재는 그림이 아니라 모양을 보는 그림).
  const solidScale = (b, f = 1.4) => (b.W < 560 && !b.thumb ? f : 1);
  const bboxOf = (pts, pad = 0) => {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach((p) => { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); });
    return { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
  };
  // 글자(화면 크기 기준 px). 휴대폰에서도 13px 이상.
  const FS = (b, size) => Math.max(13, size * (b.W < 560 ? 0.92 : 1));
  function T(b, p, str, color, o = {}) {
    if (str == null || str === '' || b.thumb) return;
    b.text(p, str, Object.assign({ color: color || 'ink', size: FS(b, o.size || 16), weight: 800, align: 'center', baseline: 'middle' }, o, { size: FS(b, o.size || 16) }));
  }

  /* ------------------------------------------------------------------ 조절 값 만들기 */
  const P = (label, min, max, step, value, o = {}) => ({ value, min, max, step, color: o.color || 'sky', label, hint: o.hint, format: o.format || ((v) => fmtN(v)), onInput: o.onInput });
  // 연속 조작 중 반올림한 값에는 ≈를 붙이고, 두 자리까지 정확한 유한소수는 그대로 씁니다.
  const measureN = (v) => Math.abs(v * 100 - Math.round(v * 100)) < 1e-8 ? String(Math.round(v * 100) / 100) : '≈ ' + fmtN(v, 2);
  const complete = (t) => t >= 1 - 1e-12;
  // 서로 연결된 두 길이는 입력 막대와 그림이 같은 값을 가리키게 합니다.
  const keepSmaller = (s, small, large) => { s[small] = clamp(Math.round(s[small] || 1), 1, Math.max(1, Math.round(s[large] || 2) - 1)); };
  const cm = (v) => fmtN(v) + ' cm';
  const VIEW_PARAMS = {
    soYaw: P('좌우로 돌려 보기', -180, 180, 1, 0, { color: 'muted', format: (v) => Math.round(v) + '°' }),
    soYawL: P('좌우로 돌려 보기', -80, -10, 1, -32, { color: 'muted', format: (v) => Math.round(v) + '°' }),
    soPitch: P('위아래로 기울여 보기', 6, 80, 1, PITCH0, { color: 'muted', format: (v) => Math.round(v) + '°' })
  };
  const VIEW = ['soYaw', 'soPitch'];

  /* ------------------------------------------------------------------ 5지선다 만들기 */
  // 숫자 보기: correct 정답, wrongs [[값, 힌트], …]. fmt(v) 로 글자를 만듭니다. 모자라면 간격으로 채우고 작은 값부터 놓습니다.
  function mkNum(correct, wrongs, fmt, o = {}) {
    const valid = o.valid || ((v) => v > 0);
    const same = (a, b) => Math.abs(a - b) < 1e-6;
    const list = [{ v: correct, ok: true, hint: '' }];
    for (const w of wrongs) {
      const v = w[0];
      if (!Number.isFinite(v) || !valid(v) || list.some((x) => same(x.v, v))) continue;
      list.push({ v, ok: false, hint: w[1] || '' });
      if (list.length === 5) break;
    }
    const stp = o.step || 1;
    for (let k = 1; list.length < 5 && k < 60; k++) {
      for (const sg of [1, -1]) {
        const v = correct + sg * k * stp;
        if (list.length < 5 && valid(v) && !list.some((x) => same(x.v, v))) list.push({ v, ok: false, hint: '풀이 순서대로 다시 계산해 보세요.' });
      }
    }
    list.sort((a, b) => a.v - b.v);
    return list.map((x) => ({ h: esc(fmt(x.v)), p: fmt(x.v), ok: x.ok, hint: x.hint }));
  }
  // 글 보기: items [{h, ok, hint, p?}] 순서 그대로
  const mkText = (items) => items.map((x) => ({ h: x.html ? x.h : esc(x.h), p: x.p || x.h.replace(/<[^>]+>/g, ''), ok: !!x.ok, hint: x.hint || '' }));

  /* ------------------------------------------------------------------ 장면 상태 (탭·단계) */
  function baseCtx(s, lab, thumb) {
    const lesson = !thumb && !!(s.lessonOn || s.lessonEntry);
    const tab = thumb ? 'explore' : s.lessonEntry ? 'review' : (lab && lab.tab) || 'explore';
    const problem = !thumb && tab === 'problem';
    const review = !thumb && tab === 'review';
    return { tab, problem, review, lesson, step: s.lessonEntry ? 0 : review ? s.step || 0 : 99, txt: !thumb, thumb: !!thumb, full: tab === 'explore' || thumb };
  }

  /* ------------------------------------------------------------------ 문제 탭 (보기 5개 · 숫자 바꾸기) */
  function syncProblem(D, s, Q = D.prob(D.model(s), s)) {
    const key = D.id + '|' + Q.key + '|' + (s.soSeed || 0);
    if (s.lessonOn || s.lessonEntry) return key;
    if (s.soProblemKey != null && s.soProblemKey !== key) {
      s.soPick = null; s.revealed = false; s.step = 1;
      s.soProblemStep = 1; s.soProblemReveal = false;
    }
    s.soProblemKey = key;
    return key;
  }
  // 원리 예시와 연습문제는 서로 다른 수치를 가질 수 있어요. 문제에서 정리로 돌아오면
  // 그 문제의 그림·단계 풀이를 유지하고, 탐구로 돌아오면 원리 예시로 돌아갑니다.
  function studyContext(s, lab) {
    if (s.lessonOn || s.lessonEntry) return;
    if (lab.tab === 'problem' && !s.soReviewQuestion) {
      s.soPrincipleStep = s.step || 1;
      s.step = s.soProblemStep || 1; s.revealed = !!s.revealed || !!s.soProblemReveal;
      s.soReviewQuestion = true;
    } else if (lab.tab === 'explore' && s.soReviewQuestion) {
      s.soProblemStep = s.step || 1; s.soProblemReveal = !!s.revealed;
      s.step = s.soPrincipleStep || 1; s.revealed = false;
      s.soReviewQuestion = false;
    }
  }
  const studySteps = (D, s) => {
    const M = D.model(s);
    return !s.lessonOn && !s.lessonEntry && s.soReviewQuestion && D.problemSteps ? D.problemSteps(M, s, D.prob(M, s)) : D.steps(M);
  };
  function problemHTML(D, s) {
    const M = D.model(s), Q = D.prob(M, s);
    const key = syncProblem(D, s, Q);
    const pk = s.soPick && s.soPick.key === key ? s.soPick : null;
    let h = `<div class="so-q">${esc(Q.stem).replace(/&amp;/g, '&')}</div>`;
    h += `<div class="so-choices${Q.wide ? ' wide' : ''}${Q.fig ? ' fig' : ''}">`;
    Q.choices.forEach((o, i) => {
      const cls = pk && pk.idx === i ? (o.ok ? ' ok' : ' bad') : '';
      h += `<button type="button" class="so-ch${cls}" data-so-pick="${i}" aria-label="${NUM[i]} ${esc(o.p)}"><span class="n">${NUM[i]}</span><span class="v">${o.h}</span></button>`;
    });
    h += '</div>';
    if (pk) {
      const o = Q.choices[pk.idx];
      h += o.ok ? '<div class="so-fb ok"><b>정답이에요!</b> 정리 탭에서 풀이 과정을 확인해 보세요.</div>' : `<div class="so-fb bad"><b>다시 생각해 볼까요?</b> ${esc(o.hint || '풀이 순서대로 다시 생각해 보세요.')}</div>`;
    }
    h += `<div class="so-tools"><button type="button" class="apl-btn sm" data-so-new>숫자 바꾸기</button>${Q.note ? `<span class="so-note">${esc(Q.note)}</span>` : ''}</div>`;
    return h;
  }
  function answerText(D, s) {
    const Q = D.prob(D.model(s), s), i = Q.choices.findIndex((o) => o.ok);
    return `${NUM[i]} ${Q.choices[i].p}`;
  }

  let curLab = null;
  function installClicks() {
    const root = document.documentElement;
    if (root.dataset.soBound) return;
    root.dataset.soBound = '1';
    document.addEventListener('click', (ev) => {
      const lab = curLab || window.lab;
      if (!lab || !ev.target || !ev.target.closest) return;
      const hit = ev.target.closest('[data-so-pick],[data-so-new]');
      if (!hit) return;
      const sc = lab.scene;
      if (!sc || !sc.so) return;
      const D = sc.so, s = lab.s;
      if (hit.hasAttribute('data-so-new')) {
        D.reroll(s);
        s.soSeed = (s.soSeed || 0) + 1; s.soPick = null; s.revealed = false; s.playing = false;
        lab.setStep(1);
        try { lab._buildReview(); } catch (e) { /* 키트가 바뀌어도 그림은 그대로 */ }
        lab.invalidate(true);
        return;
      }
      const idx = parseInt(hit.getAttribute('data-so-pick'), 10);
      const Q = D.prob(D.model(s), s);
      s.soPick = { key: D.id + '|' + Q.key + '|' + (s.soSeed || 0), idx };
      if (Q.choices[idx] && Q.choices[idx].ok) s.revealed = true;
      lab.invalidate(true);
    });
  }
  function installStyle() {
    if (document.getElementById('so-css')) return;
    const st = document.createElement('style');
    st.id = 'so-css';
    st.textContent = `
.so-q{font-size:var(--fs-md);line-height:1.85}
.so-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin:12px 0 4px}
.so-choices.wide{grid-template-columns:1fr}
.so-choices.fig{grid-template-columns:repeat(2,1fr)}
.so-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left;line-height:1.5}
.so-ch:hover{background:var(--hover)}
.so-ch .n{color:var(--m-amber);flex:none}
.so-ch .v{flex:1;min-width:0}
.so-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.so-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.so-ch svg{display:block;width:100%;height:auto;max-height:150px}
.so-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.so-fb.ok{border-left-color:var(--m-green)}
.so-fb.bad{border-left-color:var(--m-red)}
.so-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.so-note{font-size:var(--fs-xs);color:var(--text-3)}
.so-notes{margin:0;padding-left:18px;display:grid;gap:4px}`;
    document.head.append(st);
  }
  installStyle();
  installClicks();

  /* ------------------------------------------------------------------ 장면 만들기
     D = { id, title, short, question, ctl:[조절 값 id…] 또는 (s)=>[…], presets?(s), init(s), reroll(s),
           model(s)→M, draw(b,s,M,C), steps(M)→[글…], view(M,C,s)→{guide,readouts,status?,formula?,rule?,notes?,alert?},
           prob(M,s)→{tag,stem,choices,key,note?,wide?,fig?}, anim?:{key,dur,label,start}, stepT?(n), onAnim?, problemT?,
           cam0?:{yaw,pitch}, lay?:boolean(축을 가로로 눕힌 장면: 시점은 좌우로만 돌아감) } */
  function makeScene(D) {
    const A = D.anim;
    const actions = () => {
      if (!A) return undefined;
      return [{
        id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'),
        label: (s) => (s.playing ? '일시 정지' : complete(s[A.key]) ? '다시 재생' : A.label || '움직여 보기'),
        on: (s) => s.playing,
        run: (s) => { if (s.playing) s.playing = false; else { if (complete(s[A.key])) { s[A.key] = 0; if (D.onAnim) D.onAnim(s, 0); } s.playing = true; } }
      }, { id: 'reset', icon: 'reset', label: '처음으로', run: (s) => { s.playing = false; s[A.key] = 0; if (D.onAnim) D.onAnim(s, 0); } }];
    };
    return {
      id: D.id, title: D.title, short: D.short || D.title, so: D,
      question: (s) => !s.lessonOn && !s.lessonEntry && s.soReviewQuestion && D.problemSteps ? D.prob(D.model(s), s).stem : (typeof D.question === 'function' ? D.question(s) : D.question),
      controls: (s) => (typeof D.ctl === 'function' ? D.ctl(s) : D.ctl).concat(D.noView ? [] : D.pitchOnly ? ['soPitch'] : D.lay ? ['soYawL'] : VIEW),
      presets: (s) => (D.presets ? D.presets(s) : []),
      actions,
      steps: (s) => studySteps(D, s).map((x) => texFix(String(x).replace(/<\/?b>/g, ''))),
      notesTitle: '자주 틀리는 부분',
      problem: {
        tag: (s) => D.prob(D.model(s), s).tag,
        text: (s) => problemHTML(D, s),
        answer: (s) => answerText(D, s)
      },
      enter: (s, lab) => {
        const c0 = D.cam0 || (D.lay ? { yaw: -32, pitch: 0 } : { yaw: 0, pitch: PITCH0 });
        s.soYaw = c0.yaw; s.soYawL = c0.yaw; s.soPitch = c0.pitch; s.soLay = !!D.lay; s.soFix = !!D.noView; s.soPO = !!D.pitchOnly;
        Object.keys(s).forEach((k) => { if (/^so[PQ]/.test(k) && k !== 'soPitch' && k !== 'soPsi') delete s[k]; }); // 문제용 상태는 장면마다 새로
        D.init(s);
        s.soSeed = 0; s.soPick = null; s.playing = false;
        s.soReviewQuestion = false; s.soProblemStep = 1; s.soProblemReveal = false; s.soPrincipleStep = 1;
        if (A) s[A.key] = A.start || 0;
        s.soProblemKey = null; syncProblem(D, s);
        if (lab) curLab = lab;
      },
      tick: (s, dt, lab) => {
        let again = false;
        if (A && s.playing) {
          s[A.key] = Math.min(1, (s[A.key] || 0) + dt / (A.dur || 6));
          if (s[A.key] >= 1) s.playing = false;
          if (D.onAnim && lab && lab.tab === 'explore') D.onAnim(s, s[A.key]);
          again = true;
        } else if (A && D.stepT && lab && lab.tab === 'review' && !s.dragging && !s.lessonOn && !s.lessonEntry) {
          const tg = D.stepT(s.step || 0, D.model(s)), d = tg - s[A.key];
          if (Math.abs(d) > 8e-4) { s[A.key] += clamp(d, -1 * dt, 1 * dt); again = true; }
        }
        return again;
      },
      view: (s, lab) => {
        if (lab) curLab = lab;
        const M = D.model(s);
        // 쉘은 장면 객체를 복제하므로 원본 정의 참조로 현재 장면을 확인합니다.
        if (!s.lessonOn && !s.lessonEntry && lab && lab.scene && lab.scene.so === D && lab.s === s) { syncProblem(D, s, D.prob(M, s)); studyContext(s, lab); }
        const C = baseCtx(s, lab, false);
        C.t = A ? (C.lesson || C.tab === 'explore' ? (s[A.key] || 0) : (D.stepT && C.tab === 'review' ? (s[A.key] || 0) : (D.problemT == null ? 1 : D.problemT))) : 1;
        // 슬라이더·손잡이로 값이 바뀌면 정리 탭의 풀이 단계 글도 새 값으로 다시 만듭니다.
        if (lab && lab.scene && lab.scene.so === D && s === lab.s && lab.refs) {
          const sig = D.id + '|' + JSON.stringify(studySteps(D, s));
          if (lab._soSig !== sig) { lab._soSig = sig; try { lab._buildReview(); lab._dirtyPanel = true; } catch (e) { /* 키트가 바뀌어도 그림은 그대로 */ } }
        }
        const practice = !C.lesson && s.soReviewQuestion && D.problemSteps;
        const Q = practice ? D.prob(M, s) : null;
        const v = practice ? {
          guide: '현재 문제의 조건으로 차례대로 풀어요. ' + esc(Q.stem),
          readouts: [],
          formula: '<p>' + esc(D.problemSteps(M, s, Q).at(-1)) + '</p>'
        } : (D.view(M, C, s) || {});
        if (C.review && !s.revealed && s.step < studySteps(D, s).length) v.formula = '';
        ['formula', 'guide', 'notes', 'rule'].forEach((k) => { if (typeof v[k] === 'string') v[k] = texFix(v[k]); });
        if (C.tab === 'problem') v.status = { tone: 'info', text: '그림을 보고 풀어 보세요' };
        else if (C.tab === 'review') { const n = studySteps(D, s).length; v.status = { tone: s.step >= n ? 'ok' : 'info', text: `${practice ? '문제 풀이' : '풀이'} ${Math.min(s.step || 1, n)} / ${n}단계` }; }
        if (C.lesson) {
          v.card = null;
          v.readouts = [];
          v.formula = null;
          v.status = null;
        }
        return v;
      },
      draw: (b, s, v, lab) => {
        const C = baseCtx(s, lab, !!b.thumb);
        if (b.thumb) C.step = 99;
        if (!b.thumb && !C.lesson && C.review && s.soReviewQuestion && D.problemSteps) C.problem = true;
        const M = D.model(s);
        C.t = A ? (C.lesson || C.tab === 'explore' || b.thumb ? (s[A.key] || 0) : (D.stepT && C.tab === 'review' ? (s[A.key] || 0) : (D.problemT == null ? 1 : D.problemT))) : 1;
        D.draw(b, s, M, C);
      }
    };
  }

  function register(order, id, title, short, params, scenes) {
    (window.APL_RV_GROUPS = window.APL_RV_GROUPS || []).push({ order, id, title, short, params: Object.assign({}, VIEW_PARAMS, params), scenes: scenes.map(makeScene) });
  }
  const notes = (...li) => `<ul class="so-notes">${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  const rd = (label, value, color, note, ref, wide) => ({ label, value, color, note, ref, wide });

  // 부채꼴의 중심각 360°×r/R이 자연수가 되는 (r, R)만 고르게 하는 도구(소수 각도가 화면에 나오지 않게)
  const angPairs = (rMax, RMax, ok) => { const o = []; for (let r = 1; r <= rMax; r++) for (let R = 2; R <= RMax; R++) if (ok(r, R) && (360 * r) % R === 0) o.push([r, R]); return o; };
  // 끌고 있는 막대(first 0: r, 1: R)를 우선해 가장 가까운 허용 쌍으로 맞춥니다
  const snapAng = (pairs, r, R, first) => { let best = pairs[0], bd = Infinity; pairs.forEach((p) => { const d = first === 0 ? Math.abs(p[0] - r) * 1000 + Math.abs(p[1] - R) : Math.abs(p[1] - R) * 1000 + Math.abs(p[0] - r); if (d < bd) { bd = d; best = p; } }); return best; };

  window.APL_SO = {
    angPairs, snapAng,
    PI, DEG, clamp, ease, seg01, NUM, esc, rint, pick, shuffle, sshuffle, texFix, fmtN, gcd, jo, piT, piTex, span, cm,
    textW, bboxOf, fit, fitK, PITCH0, solidScale, FS, T, P, measureN, complete, keepSmaller, VIEW, VIEW_PARAMS, mkNum, mkText, baseCtx, makeScene, register, notes, rd
  };
})();
