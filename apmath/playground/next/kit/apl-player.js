/* ==========================================================================
   AP Math Lab Kit · 영상 재생기 (apl-player.js)
   실험실 그림을 「대본」(apl-video-core.js 설명 참고)대로 움직이는 짧은 영상(8~15초 쇼츠)을 재생합니다.
   - 영상은 따로 그리지 않습니다. 장면의 상태값(lab.s)을 시간에 맞춰 바꾸고 자막을 띄울 뿐입니다.
   - 영상 화면: 오른쪽 패널을 접어 그림을 크게 · 아래 자막 막대 · 재생/멈춤, 느리게, 이전/다음 자막, 다시 보기, 닫기.
   - 영상이 끝나면 한 줄 요약 + 「이제 직접 해 보세요」 카드를 띄우고 탐구 화면으로 돌아갑니다(끝난 상태 그대로 조작 가능).
   - 재생 중에 그림을 만지면 멈춥니다. prefers-reduced-motion 이면 자동 재생 대신 자막을 한 칸씩 넘깁니다.
   [쓰는 법] 실험실 페이지에서 kit/apl-video-core.js · apl-player.js · apl-toc.js · apl-video.css 를 apl-shell.js 다음에 불러오고,
   createLab({ ..., videos: { 장면id: 대본 } }) 또는 장면에 video: 대본 을 줍니다. 제목: 대본 title(없으면 장면 제목)을 시작 때 크게 → 2초 뒤 머리글로. 자세한 형식: docs/guides/APMATH_LAB_VIDEO_SCRIPT_GUIDE_CURRENT.md
   ========================================================================== */
(function () {
  'use strict';
  const APLab = window.APLab;
  const core = APLab && APLab.videoCore;
  if (!APLab || !core || !APLab.h) return;
  const { h, icon } = APLab;
  const REDUCED = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const TITLE_BIG_MS = 2000; // 제목이 크게 보이는 시간
  const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  /** 자막/요약 글: **굵게**, $수식$ 만 허용. 수식 바깥만 HTML 이스케이프합니다. */
  function richHtml(text) {
    return String(text == null ? '' : text).split(/(\$[^$]*\$)/).map((p) => (p.length > 1 && p[0] === '$' && p.endsWith('$')
      ? APLab.tex(p.slice(1, -1))
      : APLab.esc(p).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'))).join('');
  }

  class Player {
    constructor(lab) {
      this.lab = lab;
      this.state = 'idle'; // idle | playing | paused | ended
      this.index = -1;
      this.cs = null;
      this.base = null;
      this.t = 0;
      this.rate = 1;
      this.stepMode = false; // prefers-reduced-motion: 자동 재생 대신 자막 한 칸씩
      this._raf = 0;
      this._last = 0;
      this._internal = false;
      this._cache = new WeakMap();
      this._build();
      this._wrap();
      this._bind();
    }

    /* ------------------------------ 대본 ------------------------------ */
    scriptOf(i) {
      const sc = this.lab.list[i];
      if (!sc) return null;
      if (!sc.video && this.lab.def.videos && this.lab.def.videos[sc.id]) sc.video = this.lab.def.videos[sc.id];
      return sc.video || null;
    }
    compiled(i) {
      const script = this.scriptOf(i);
      if (!script) return null;
      let c = this._cache.get(script);
      if (c === undefined) {
        const v = core.validate(script);
        if (v.errors.length) {
          console.warn(`[영상 대본] ${this.lab.list[i].id}: ${v.errors.join(' / ')}`);
          c = null;
        } else c = core.compile(script);
        this._cache.set(script, c);
      }
      return c;
    }
    has(i) { return !!this.compiled(i); }
    count() { return this.lab.list.reduce((n, _, i) => n + (this.has(i) ? 1 : 0), 0); }
    lengthOf(i) { const c = this.compiled(i); return c ? c.length : 0; }

    /* ------------------------------ 화면 ------------------------------ */
    _build() {
      const ui = (this.ui = {});
      ui.cap = h('div', { class: 'apl-vcap', 'aria-live': 'polite' });
      ui.range = h('input', { type: 'range', class: 'apl-range apl-vrange', min: '0', max: '1', step: '0.01', value: '0', 'aria-label': '영상 진행 위치', style: { '--c': 'var(--m-sky)' } });
      ui.time = h('span', { class: 'apl-vtime' });
      ui.play = h('button', { class: 'apl-btn primary apl-vbtn', onclick: () => this.toggle() });
      ui.prev = h('button', { class: 'apl-btn apl-vbtn', 'aria-label': '이전 자막', title: '이전 자막 (←)', html: icon('prev') + '<span class="lbl">이전</span>', onclick: () => this.skip(-1) });
      ui.next = h('button', { class: 'apl-btn apl-vbtn', 'aria-label': '다음 자막', title: '다음 자막 (→)', html: '<span class="lbl">다음</span>' + icon('next'), onclick: () => this.skip(1) });
      ui.replay = h('button', { class: 'apl-btn apl-vbtn', 'aria-label': '다시 보기', title: '처음부터 다시 보기 (R)', html: icon('reset') + '<span class="lbl">다시 보기</span>', onclick: () => this.replay() });
      ui.slow = h('button', { class: 'apl-btn apl-vbtn', 'aria-pressed': 'false', title: '천천히 보기 (0.5배)', html: '<span>느리게</span>', onclick: () => this.setRate(this.rate === 1 ? 0.5 : 1) });
      ui.close = h('button', { class: 'apl-btn apl-vbtn ghost', 'aria-label': '영상 닫고 직접 해 보기', title: '닫기 (Esc)', html: icon('x') + '<span class="lbl">탐구로</span>', onclick: () => this.close() });
      ui.live = h('div', { class: 'apl-vctl' }, ui.play, ui.prev, ui.next, ui.replay, ui.slow, h('span', { class: 'sp' }), ui.close);
      ui.prog = h('div', { class: 'apl-vprog' }, ui.range, ui.time);
      ui.endSum = h('div', { class: 'apl-vsum' });
      ui.endTask = h('div', { class: 'apl-vtaskline' });
      ui.endGo = h('button', { class: 'apl-btn primary apl-vbtn', html: icon('hand') + '<span>직접 해 보기</span>', onclick: () => this._dismissEnd() });
      ui.endAgain = h('button', { class: 'apl-btn apl-vbtn', html: icon('reset') + '<span>다시 보기</span>', onclick: () => this.replay() });
      ui.endX = h('button', { class: 'apl-icon-btn apl-vendx', 'aria-label': '카드 닫기', html: icon('x'), onclick: () => this._dismissEnd() });
      ui.end = h('div', { class: 'apl-vend', hidden: true },
        h('div', { class: 'apl-vend-h' }, h('span', { class: 'ttl', html: icon('check') + '<span>한 줄 정리</span>' }), ui.endX),
        ui.endSum, ui.endTask, h('div', { class: 'apl-vend-btns' }, ui.endGo, ui.endAgain));
      // 제목: 재생이 시작되면 그림 위쪽에 크게(tBig) 떴다가 약 2초 뒤 무대 맨 위 머리글 줄(tbar)로 줄어듭니다. 머리글 줄은 그림 위 별도 줄이라 칩·도형을 가리지 않습니다.
      ui.tText = h('span', { class: 'tt' });
      ui.tbar = h('div', { class: 'apl-vtbar', 'aria-hidden': 'true' }, ui.tText);
      ui.tBig = h('div', { class: 'apl-vtbig', 'aria-hidden': 'true' });
      this.lab.ui.stage.insertBefore(ui.tbar, this.lab.ui.canvasWrap);
      this.lab.ui.canvasWrap.append(ui.tBig);
      ui.bar = h('div', { class: 'apl-vbar', hidden: true, role: 'region', 'aria-label': '영상 해설' }, ui.cap, ui.prog, ui.live, ui.end);
      this.lab.ui.stage.append(ui.bar);
      // 진행 막대는 0~1000 정수 위치로 다룹니다
      ui.range.max = '1000';
      ui.range.step = '1';
      ui.range.addEventListener('input', () => {
        if (!this.cs || this.state === 'idle' || this.state === 'ended') return;
        const to = (+ui.range.value / 1000) * this.cs.length; // pause() 가 막대 위치를 되돌리기 전에 읽어 둡니다
        this.pause();
        this.seek(to);
      });
    }

    _wrap() {
      const lab = this.lab;
      const orig = lab.goScene.bind(lab);
      lab.goScene = (i, o) => {
        if (!this._internal && this.state !== 'idle') this._leave(false);
        this._clearTaskNote();
        return orig(i, o);
      };
      this._goScene = orig;
    }

    _bind() {
      const lab = this.lab;
      // 재생 중 그림을 만지면 멈춥니다(만지는 순간 손잡이 끌기는 그대로 동작).
      lab.ui.canvasWrap.addEventListener('pointerdown', () => {
        // 끝 카드는 그림을 만져도 그대로 둡니다(카드 높이가 바뀌면 손잡이를 끄는 도중 그림이 다시 맞춰져 튀기 때문). 「직접 해 보기」나 ✕ 로 닫습니다.
        if (this.state === 'playing') { this.pause(); APLab.toast('멈췄어요. 그림을 움직여 보고, ▶ 로 이어 볼 수 있어요'); }
      }, true);
      document.addEventListener('visibilitychange', () => { if (document.hidden && this.state === 'playing') this.pause(); });
      document.addEventListener('keydown', (e) => {
        if (this.state !== 'playing' && this.state !== 'paused') return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const k = e.key;
        let handled = true;
        if (k === ' ' || k === 'k' || k === 'K') { if (e.target && e.target.tagName === 'BUTTON') return; this.toggle(); }
        else if (k === 'ArrowRight' || k === 'PageDown') this.skip(1);
        else if (k === 'ArrowLeft' || k === 'PageUp') this.skip(-1);
        else if (k === 'r' || k === 'R') this.replay();
        else if (k === 'Escape') this.close();
        else handled = false;
        if (!handled && (k.length === 1 || k.startsWith('Arrow'))) { e.stopImmediatePropagation(); e.preventDefault(); return; } // 영상 중에는 다른 단축키를 막습니다
        if (handled) { e.stopImmediatePropagation(); e.preventDefault(); }
      }, true);
    }

    /** 영상 제목(대본 title, 없으면 장면 제목)을 크게 띄웠다가 TITLE_BIG_MS 뒤 머리글로 줄입니다. 움직임 줄이기 설정이면 머리글만 보입니다. */
    _showTitle(i) {
      const ui = this.ui, script = this.scriptOf(i), sc = this.lab.list[i];
      const text = String((script && script.title) || (sc && sc.title) || '').trim();
      clearTimeout(this._titleT);
      ui.tText.textContent = text;
      ui.tBig.textContent = text;
      ui.tbar.hidden = !text;
      ui.tBig.classList.remove('on', 'shrink');
      if (!text) return;
      if (REDUCED.matches) { ui.tbar.dataset.phase = 'small'; return; }
      ui.tbar.dataset.phase = 'big';
      void ui.tBig.offsetWidth; // 다시 보기 때도 처음부터 다시 나타나게
      ui.tBig.classList.add('on');
      this._titleT = setTimeout(() => { ui.tbar.dataset.phase = 'small'; ui.tBig.classList.add('shrink'); }, TITLE_BIG_MS);
    }
    _hideTitle() {
      clearTimeout(this._titleT);
      this.ui.tBig.classList.remove('on', 'shrink');
    }

    /** 영상 화면(오른쪽 패널 접기, 자막 막대)으로 바꾸거나 되돌립니다. */
    _layout(on) {
      document.body.classList.toggle('apl-vid', !!on);
      const lab = this.lab;
      requestAnimationFrame(() => { if (lab.board.resize()) lab.invalidate(true); lab._sizeInk && lab._sizeInk(); lab.invalidate(); });
    }

    /* ------------------------------ 재생 ------------------------------ */
    play(i) {
      const lab = this.lab;
      const cs = this.compiled(i);
      if (!cs) { lab.goScene(i); return false; }
      if (this.state !== 'idle') this._leave(false);
      if (lab.pen && lab.pen.on) lab.setPen(false);
      try { clearTimeout(lab._hashT); history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* 해시를 못 지워도 영상은 재생됨 */ }
      this._internal = true;
      try { this._goScene(i); } finally { this._internal = false; }
      this._clearTaskNote();
      const s = lab.s;
      this.index = i;
      this.cs = cs;
      this.base = { nums: {}, sets: {}, step: s.step, part: s.part };
      Object.keys(cs.tracks).forEach((k) => { this.base.nums[k] = typeof s[k] === 'number' ? s[k] : 0; });
      cs.setKeys.forEach((k) => { this.base.sets[k] = s[k]; });
      this.stepMode = !!REDUCED.matches;
      this.t = 0;
      this._capIndex = -2;
      this.ui.end.hidden = true;
      document.body.classList.remove('apl-vend-on');
      this.ui.bar.hidden = false;
      this.ui.bar.dataset.mode = 'play';
      this.ui.bar.dataset.step = this.stepMode ? '1' : '';
      this._layout(true);
      this._showTitle(i);
      this.state = 'paused';
      if (this.stepMode) { this.seek(this._stepEnd(0)); this._syncUi(); this._announce(); return true; }
      this.apply();
      this.resume();
      return true;
    }
    toggle() {
      if (this.state === 'playing') this.pause();
      else if (this.state === 'paused') { if (this.stepMode) this.skip(1); else this.resume(); }
      else if (this.state === 'ended') this.replay();
    }
    resume() {
      if (this.state !== 'paused' || this.stepMode) return;
      if (this.t >= this.cs.length - 0.02) this.t = 0;
      this.state = 'playing';
      this._last = 0;
      this._syncUi();
      this._tick = this._tick || ((now) => this._frame(now));
      this._raf = requestAnimationFrame(this._tick);
    }
    pause() {
      if (this.state !== 'playing') return;
      this.state = 'paused';
      cancelAnimationFrame(this._raf);
      this._raf = 0;
      this._syncUi();
    }
    _frame(now) {
      this._raf = 0;
      if (this.state !== 'playing') return;
      const dt = this._last ? Math.min(0.1, (now - this._last) / 1000) : 0;
      this._last = now;
      this.t = Math.min(this.cs.length, this.t + dt * this.rate);
      this.apply();
      if (this.t >= this.cs.length - 1e-6) { this.finish(); return; }
      this._raf = requestAnimationFrame(this._tick);
    }
    seek(t) {
      if (!this.cs) return;
      this.t = Math.max(0, Math.min(this.cs.length, t));
      this.apply();
    }
    skip(dir) {
      if (!this.cs || (this.state !== 'playing' && this.state !== 'paused')) return;
      if (this.stepMode) {
        const k = this._curSay();
        const to = k + dir;
        if (to >= this.cs.says.length) { this.seek(this.cs.length); this.finish(); return; }
        this.seek(this._stepEnd(Math.max(0, to)));
        return;
      }
      if (dir > 0) {
        const at = core.nextSayAt(this.cs, this.t);
        if (at == null) { this.seek(this.cs.length); this.finish(); } else this.seek(at);
      } else this.seek(core.prevSayAt(this.cs, this.t));
    }
    _curSay() { return core.stateAt(this.cs, this.t, this.base).say; }
    _stepEnd(k) { const s = this.cs.says[k]; return s ? Math.max(s.at, s.end - 0.001) : this.cs.length; }
    setRate(r) {
      this.rate = r;
      this.ui.slow.setAttribute('aria-pressed', String(r !== 1));
      this.ui.slow.classList.toggle('on', r !== 1);
      this.ui.slow.innerHTML = r === 1 ? '<span>느리게</span>' : '<span>0.5배</span>';
    }
    replay() {
      if (this.index < 0) return;
      this.play(this.index);
    }

    /** 시각 t 의 상태를 장면에 적용합니다. */
    apply() {
      const lab = this.lab, cs = this.cs, s = lab.s;
      const st = core.stateAt(cs, this.t, this.base);
      Object.assign(s, st.nums, st.sets);
      if (cs.usesStep) s.step = st.step;
      if (cs.usesPart) s.part = st.part;
      s.playing = false;
      lab.invalidate(false);
      this._syncUi(st);
    }

    _syncUi(st) {
      const cs = this.cs, ui = this.ui;
      if (!cs) return;
      st = st || core.stateAt(cs, this.t, this.base);
      if (st.say !== this._capIndex) {
        this._capIndex = st.say;
        ui.cap.innerHTML = st.say >= 0 ? `<span class="t">${richHtml(cs.says[st.say].text)}</span>` : '';
        ui.cap.classList.remove('pop');
        void ui.cap.offsetWidth;
        ui.cap.classList.add('pop');
      }
      ui.range.value = String(Math.round((this.t / cs.length) * 1000));
      ui.range.style.setProperty('--p', (this.t / cs.length) * 100 + '%');
      ui.time.textContent = `${mmss(this.t)} / ${mmss(cs.length)}`;
      const playing = this.state === 'playing';
      if (this.stepMode) {
        ui.play.innerHTML = icon('next') + '<span>다음 자막</span>';
        ui.play.setAttribute('aria-label', '다음 자막');
      } else {
        ui.play.innerHTML = icon(playing ? 'pause' : 'play') + `<span>${playing ? '멈춤' : '재생'}</span>`;
        ui.play.setAttribute('aria-label', playing ? '멈춤' : '재생');
      }
    }
    _announce() { /* 자막은 aria-live 영역에 이미 있음 */ }

    /* ------------------------------ 끝·닫기 ------------------------------ */
    finish() {
      if (!this.cs || this.state === 'ended' || this.state === 'idle') return;
      cancelAnimationFrame(this._raf);
      this._raf = 0;
      this.t = this.cs.length;
      this.apply();
      this.state = 'ended';
      this._hideTitle(); // 끝 카드가 나오면 제목은 숨김(머리글 줄은 영상 화면이 풀리며 함께 사라짐)
      const lab = this.lab, cs = this.cs;
      this._layout(false); // 탐구 화면(패널)으로 돌아옴. 그림은 끝난 상태 그대로
      lab.tab = 'explore';
      lab._buildPanel();
      lab.invalidate(true);
      lab._saveHashSoon();
      this.ui.bar.dataset.mode = 'end';
      this.ui.endSum.innerHTML = richHtml(cs.summary);
      this.ui.endTask.innerHTML = `<b>이제 직접 해 보세요</b><span>${richHtml(cs.task)}</span>`;
      this.ui.end.hidden = false;
      document.body.classList.add('apl-vend-on'); // 휴대폰: 끝 카드만큼 그림 무대를 키움
      this._taskNote(cs.task);
    }
    /** 영상 상태를 끝내고 화면을 원래대로 되돌립니다(rebuild: 패널을 다시 만들지 여부). */
    _leave(rebuild) {
      cancelAnimationFrame(this._raf);
      this._raf = 0;
      const was = this.state;
      this.state = 'idle';
      this.cs = null;
      this._hideTitle();
      this.ui.bar.hidden = true;
      this.ui.end.hidden = true;
      document.body.classList.remove('apl-vend-on');
      this._layout(false);
      if (rebuild && was !== 'idle') { this.lab.tab = 'explore'; this.lab._buildPanel(); this.lab.invalidate(true); this.lab._saveHashSoon(); }
    }
    close() {
      if (this.state === 'idle') return;
      this._leave(true);
    }
    _dismissEnd() {
      this._leave(false);
    }
    _taskNote(task) {
      this._clearTaskNote();
      const pane = this.lab.ui.panes.explore;
      if (!pane) return;
      this._note = h('div', { class: 'apl-callout apl-vtask', 'data-tone': 'key', html: icon('hand') + `<div><b>해 볼 일</b> · ${richHtml(task)}</div>` });
      pane.prepend(this._note);
    }
    _clearTaskNote() {
      if (this._note) { this._note.remove(); this._note = null; }
    }
  }


  APLab.Player = Player;
  (APLab.labHooks = APLab.labHooks || []).push((lab) => {
    const hasAny = (lab.def.videos && Object.keys(lab.def.videos).length) || lab.list.some((sc) => sc.video);
    if (!hasAny) return;
    lab.video = new Player(lab);
  });
})();
