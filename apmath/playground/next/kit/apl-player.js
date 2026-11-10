/* ==========================================================================
   AP Math Lab Kit · 영상·해설 재생기 (apl-player.js)
   실험실 그림을 「대본」(apl-video-core.js 설명 참고)대로 움직이는 짧은 영상(8~15초 쇼츠)과, 그 장(chapter) 여러 개를 이어 정답까지 보여 주는 「해설」을 재생합니다.
   - 영상·해설은 따로 그리지 않습니다. 장면의 상태값(lab.s)을 시간에 맞춰 바꾸고 자막을 띄울 뿐입니다.
   - 재생 화면: 상단 앱 막대와 제목 줄만 남기고 장면 띠·패널을 접어 그림을 크게 · 화면 아래 자막 막대(재생 중에는 자막+진행 막대+멈춤 단추, 멈추면 전체 조작 줄).
     휴대폰 가로(높이 480px 미만)에서는 그림 왼쪽 · 자막·조작 오른쪽 열.
   - 끝나면 한 줄 요약 + 「다음 ▶」(다음 해설 장면) · 「다시 보기」 · 「직접 해 보기」.
   - 해설(또는 영상)이 있는 장면은 학생 화면(수업 모드 아님)에서 「해설 우선」 진입 화면을 가집니다: 휴대폰(859px 이하)에서는 그림 · 문제 전문 · 큰 ▶ 하나만 보이고 탐구 조작부는 「직접 해 보기」 뒤에 있습니다.
     (?manual=1 또는 #manual=1 : 처음부터 탐구 화면. 기존 감사 도구가 지금까지와 같은 조작부를 검사하도록 하는 용도이며 진입 ▶ 버튼도 달지 않음)
   - #…&play=1 (s=장면id 와 함께): 장면을 연 뒤 바로 재생. 그 밖에는 절대 자동 재생하지 않습니다(CI 가 막음).
   - 재생 중에 그림을 만지면 멈춥니다. prefers-reduced-motion 이면 자동 재생 대신 자막을 한 칸씩 넘깁니다.
   [쓰는 법] 실험실 페이지에서 kit/apl-video-core.js · apl-player.js · apl-toc.js · apl-video.css 를 apl-shell.js 다음에 불러오고,
   createLab({ ..., videos: { 장면id: 대본 }, lessons: { 장면id: 해설 } }) 또는 장면에 video: 대본 / lesson: 해설 을 줍니다(해설이 영상보다 우선). 자세한 형식: docs/guides/APMATH_LAB_VIDEO_SCRIPT_GUIDE_CURRENT.md
   ========================================================================== */
(function () {
  'use strict';
  const APLab = window.APLab;
  const core = APLab && APLab.videoCore;
  if (!APLab || !core || !APLab.h) return;
  const { h, icon } = APLab;
  const REDUCED = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const NARROW = window.matchMedia ? window.matchMedia('(max-width: 859px)') : { matches: false };
  const TITLE_BIG_MS = 2000; // 제목이 크게 보이는 시간
  const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  /** 주소의 ?이름=값 또는 #이름=값 */
  function urlParam(name) {
    let v = null;
    try { v = new URLSearchParams(location.search).get(name); } catch (e) { /* 무시 */ }
    if (v == null) { try { v = new URLSearchParams(location.hash.slice(1)).get(name); } catch (e) { /* 무시 */ } }
    return v;
  }

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
      this._lessonOn = false; // 재생 동안 재생기가 쥐고 있는 lab 상태(tab·dragging·lessonOn)가 있는지
      this._holdDrag = false;
      this._pre = null;
      this._ch = -1;
      this.manual = urlParam('manual') === '1';
      this.explored = this.manual || this._readExplored();
      this._build();
      this._wrap();
      this._bind();
      this._syncEntry();
      // #…&play=1 : 해설 링크로 열면 장면을 연 뒤 바로 재생(그 밖에는 자동 재생하지 않음)
      if (urlParam('play') === '1' && !lab.teach) {
        requestAnimationFrame(() => setTimeout(() => { if (this.state === 'idle' && this.has(lab.index)) this.play(lab.index); }, 0));
      }
    }

    /* ------------------------------ 대본 ------------------------------ */
    lessonOf(i) {
      const sc = this.lab.list[i];
      if (!sc) return null;
      const def = this.lab.def;
      if (!sc.lesson) {
        const reg = (def.lessons && def.lessons[sc.id]) || ((window.APL_LESSONS || {})[this.lab.id] || {})[sc.id];
        if (reg) sc.lesson = reg;
      }
      return sc.lesson || null;
    }
    videoOf(i) {
      const sc = this.lab.list[i];
      if (!sc) return null;
      if (!sc.video && this.lab.def.videos && this.lab.def.videos[sc.id]) sc.video = this.lab.def.videos[sc.id];
      return sc.video || null;
    }
    /** 장면에 재생할 수 있는 원본(해설이 영상보다 우선). */
    scriptOf(i) { return this.lessonOf(i) || this.videoOf(i); }
    compiled(i) {
      const sc = this.lab.list[i];
      if (!sc) return null;
      const lesson = this.lessonOf(i);
      if (lesson) {
        let c = this._cache.get(lesson);
        if (c === undefined) {
          const v = core.validateLesson(lesson);
          if (v.errors.length) { console.warn(`[해설] ${sc.id}: ${v.errors.join(' / ')}`); c = null; } else c = core.compileLesson(lesson);
          this._cache.set(lesson, c);
        }
        if (c) return c;
      }
      const script = this.videoOf(i);
      if (!script) return null;
      let c = this._cache.get(script);
      if (c === undefined) {
        const v = core.validate(script);
        if (v.errors.length) {
          console.warn(`[영상 대본] ${sc.id}: ${v.errors.join(' / ')}`);
          c = null;
        } else {
          c = core.compile(script);
          c.kind = 'video';
          c.tab = null;
          c.answer = null;
          c.chapters = [{ at: 0, length: c.length, title: c.title || '' }];
        }
        this._cache.set(script, c);
      }
      return c;
    }
    has(i) { return !!this.compiled(i); }
    count() { return this.lab.list.reduce((n, _, i) => n + (this.has(i) ? 1 : 0), 0); }
    lengthOf(i) { const c = this.compiled(i); return c ? c.length : 0; }
    /** i 다음으로 해설·영상이 있는 장면(없으면 -1). */
    nextIndex(i) {
      for (let k = i + 1; k < this.lab.list.length; k++) if (this.has(k)) return k;
      return -1;
    }

    /* ------------------------------ 진입 화면 상태 ------------------------------ */
    _storeKey() { return `apl:lessonExplore:${this.lab.id}`; }
    _readExplored() { try { return sessionStorage.getItem(this._storeKey()) === '1'; } catch (e) { return false; } }
    /** 「직접 해 보기」를 골랐음을 이 실험실의 세션 동안 기억합니다. */
    _setExplored(on) {
      this.explored = !!on || this.manual;
      try { if (on) sessionStorage.setItem(this._storeKey(), '1'); } catch (e) { /* 저장이 막혀도 이번 화면에서는 유지 */ }
      this._syncEntry();
    }
    /** 장면에 해설·영상이 있으면 진입 ▶ 를 보이고(해설 우선 화면), 없으면 아무것도 바꾸지 않습니다. */
    _syncEntry() {
      const lab = this.lab, ui = this.ui, i = lab.index;
      const cs = this.state === 'idle' ? this.compiled(i) : null;
      const show = !!cs && !lab.teach && !this.manual;
      const first = show && NARROW.matches && !this.explored;
      document.body.classList.toggle('apl-lessonfirst', first);
      ui.entry.hidden = !show;
      if (!show) return;
      const mode = first ? 'first' : 'inline';
      ui.entry.dataset.mode = mode;
      ui.entryGo.innerHTML = icon('play') + `<span>해설 보기 · ${Math.round(cs.length)}초</span>`;
      ui.entryGo.setAttribute('aria-label', `해설 보기, ${Math.round(cs.length)}초`);
      if (mode === 'first') { if (ui.entry.parentNode !== document.body) document.body.append(ui.entry); } else if (ui.entry.parentNode !== lab.ui.panelInner || lab.ui.panelInner.firstElementChild !== ui.entry) lab.ui.panelInner.prepend(ui.entry);
    }

    /* ------------------------------ 화면 ------------------------------ */
    _build() {
      const ui = (this.ui = {});
      ui.cap = h('div', { class: 'apl-vcap', 'aria-live': 'polite' });
      ui.range = h('input', { type: 'range', class: 'apl-range apl-vrange', min: '0', max: '1', step: '0.01', value: '0', 'aria-label': '영상 진행 위치', style: { '--c': 'var(--m-sky)' } });
      ui.ticks = h('span', { class: 'apl-vticks', 'aria-hidden': 'true' });
      ui.rangeWrap = h('div', { class: 'apl-vrw' }, ui.range, ui.ticks);
      ui.time = h('span', { class: 'apl-vtime' });
      ui.mini = h('button', { class: 'apl-btn apl-vmini', 'aria-label': '멈춤', title: '멈춤 (Space)', html: icon('pause'), onclick: () => this.pause() });
      ui.play = h('button', { class: 'apl-btn primary apl-vbtn', onclick: () => this.toggle() });
      ui.prev = h('button', { class: 'apl-btn apl-vbtn', 'aria-label': '이전 자막', title: '이전 자막 (←)', html: icon('prev') + '<span class="lbl">이전</span>', onclick: () => this.skip(-1) });
      ui.next = h('button', { class: 'apl-btn apl-vbtn', 'aria-label': '다음 자막', title: '다음 자막 (→)', html: '<span class="lbl">다음</span>' + icon('next'), onclick: () => this.skip(1) });
      ui.replay = h('button', { class: 'apl-btn apl-vbtn', 'aria-label': '다시 보기', title: '처음부터 다시 보기 (R)', html: icon('reset') + '<span class="lbl">다시 보기</span>', onclick: () => this.replay() });
      ui.slow = h('button', { class: 'apl-btn apl-vbtn', 'aria-pressed': 'false', title: '천천히 보기 (0.5배)', html: '<span>느리게</span>', onclick: () => this.setRate(this.rate === 1 ? 0.5 : 1) });
      ui.close = h('button', { class: 'apl-btn apl-vbtn ghost', 'aria-label': '영상 닫고 직접 해 보기', title: '닫기 (Esc)', html: icon('x') + '<span class="lbl">탐구로</span>', onclick: () => this.close() });
      ui.live = h('div', { class: 'apl-vctl' }, ui.play, ui.prev, ui.next, ui.replay, ui.slow, h('span', { class: 'sp' }), ui.close);
      ui.prog = h('div', { class: 'apl-vprog' }, ui.rangeWrap, ui.time, ui.mini);
      ui.endSum = h('div', { class: 'apl-vsum' });
      ui.endTask = h('div', { class: 'apl-vtaskline' });
      ui.endNext = h('button', { class: 'apl-btn primary apl-vbtn apl-vnext', onclick: () => this.playNext() });
      ui.endGo = h('button', { class: 'apl-btn apl-vbtn', html: icon('hand') + '<span>직접 해 보기</span>', onclick: () => this._dismissEnd() });
      ui.endAgain = h('button', { class: 'apl-btn apl-vbtn', html: icon('reset') + '<span>다시 보기</span>', onclick: () => this.replay() });
      ui.endX = h('button', { class: 'apl-icon-btn apl-vendx', 'aria-label': '카드 닫기', html: icon('x'), onclick: () => this._dismissEnd() });
      ui.end = h('div', { class: 'apl-vend', hidden: true },
        h('div', { class: 'apl-vend-h' }, h('span', { class: 'ttl', html: icon('check') + '<span>한 줄 정리</span>' }), ui.endX),
        ui.endSum, ui.endTask, ui.endNext, h('div', { class: 'apl-vend-btns' }, ui.endAgain, ui.endGo));
      // 큰 제목과 작은 제목 모두 무대 위 별도 줄을 써 칩·도형을 가리지 않습니다.
      ui.tText = h('span', { class: 'tt' });
      ui.tbar = h('div', { class: 'apl-vtbar', 'aria-hidden': 'true' }, ui.tText);
      ui.tBig = h('div', { class: 'apl-vtbig', 'aria-hidden': 'true' });
      this.lab.ui.stage.insertBefore(ui.tbar, this.lab.ui.canvasWrap);
      ui.tbar.append(ui.tBig);
      ui.bar = h('div', { class: 'apl-vbar', hidden: true, role: 'region', 'aria-label': '영상 해설' }, ui.cap, ui.prog, ui.live, ui.end);
      this.lab.ui.stage.append(ui.bar);
      // 해설 우선 진입 ▶ (휴대폰: 화면 아래 고정 · 그 밖: 패널 맨 위)
      ui.entryGo = h('button', { class: 'apl-btn primary apl-lgo', onclick: () => this._entryGo() });
      ui.entryManual = h('button', { class: 'apl-lmanual', type: 'button', text: '직접 해 보기', onclick: () => this._setExplored(true) });
      ui.entry = h('div', { class: 'apl-lentry', hidden: true, role: 'group', 'aria-label': '해설 보기' }, ui.entryGo, ui.entryManual);
      this.lab.ui.panelInner.prepend(ui.entry);
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
        const r = orig(i, o);
        if (!this._internal) this._syncEntry();
        return r;
      };
      this._goScene = orig;
      const setTab = lab.setTab.bind(lab);
      lab.setTab = (id) => {
        if (!this._internal && this.state !== 'idle' && id !== lab.tab && lab._tabAvailable(id)) { this._leave(false); this._setExplored(true); }
        return setTab(id);
      };
      const setTeach = lab.setTeach.bind(lab);
      lab.setTeach = (on) => {
        const r = setTeach(on);
        if (on && this.state !== 'idle') this._leave(true);
        this._syncEntry();
        return r;
      };
      if (NARROW.addEventListener) NARROW.addEventListener('change', () => this._syncEntry());
    }

    _bind() {
      const lab = this.lab;
      // 재생 중 그림을 만지면 멈춥니다(만지는 순간 손잡이 끌기는 그대로 동작).
      lab.ui.canvasWrap.addEventListener('pointerdown', () => {
        // 끝 카드는 그림을 만져도 그대로 둡니다(카드 높이가 바뀌면 손잡이를 끄는 도중 그림이 다시 맞춰져 튀기 때문). 「직접 해 보기」나 ✕ 로 닫습니다.
        // 진입 ▶ 를 빠르게 두 번 눌렀을 때 둘째 탭이 (버튼이 사라진 자리의) 그림에 닿아 바로 멈추지 않도록 시작 직후 0.3초는 무시합니다.
        if (this.state === 'playing' && performance.now() - (this._startedAt || 0) > 300) { this.pause(); APLab.toast('멈췄어요. 그림을 움직여 보고, ▶ 로 이어 볼 수 있어요'); }
      }, true);
      // 정리 탭으로 그리는 해설은 s.dragging 을 true 로 쥐고 있어야 장면 tick 이 값을 끌어당기지 않습니다. 보드의 끌기가 끝나며 false 로 되돌리면 다시 쥡니다.
      const rehold = () => { if (this._holdDrag) setTimeout(() => { if (this._holdDrag && (this.state === 'playing' || this.state === 'paused')) this.lab.s.dragging = true; }, 0); };
      window.addEventListener('pointerup', rehold);
      window.addEventListener('pointercancel', rehold);
      document.addEventListener('visibilitychange', () => { if (document.hidden && this.state === 'playing') this.pause(); });
      document.addEventListener('keydown', (e) => {
        if (this.state !== 'playing' && this.state !== 'paused') return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const k = e.key;
        // 목차의 Escape와 실제 폼 컨트롤의 기본 키 동작을 보존하면서 셸 단축키는 막습니다.
        if (this.lab.toc && this.lab.toc.isOpen && k === 'Escape') return;
        const target = e.target;
        if (target && (target.matches('input, textarea, select, button, [contenteditable="true"]'))) {
          if (k !== 'Escape') {
            // document 캡처 단계에서 바로 중단하면 컨트롤 자체가 이벤트를 받지 못합니다.
            target.addEventListener('keydown', (event) => event.stopPropagation(), { once: true });
            return;
          }
        }
        let handled = true;
        if (k === ' ' || k === 'k' || k === 'K') this.toggle();
        else if (k === 'ArrowRight' || k === 'PageDown') this.skip(1);
        else if (k === 'ArrowLeft' || k === 'PageUp') this.skip(-1);
        else if (k === 'r' || k === 'R') this.replay();
        else if (k === 'Escape') this.close();
        else handled = false;
        if (!handled && (k.length === 1 || k.startsWith('Arrow'))) { e.stopImmediatePropagation(); e.preventDefault(); return; } // 영상 중에는 다른 단축키를 막습니다
        if (handled) { e.stopImmediatePropagation(); e.preventDefault(); }
      }, true);
    }

    /** 진입 ▶ : 빠르게 두 번 눌러도 재생 루프는 하나(이미 재생 중이면 무시). */
    _entryGo() {
      if (this.state !== 'idle') return;
      this.play(this.lab.index);
    }

    /** 영상 제목(대본 title, 없으면 장면 제목)을 크게 띄웠다가 TITLE_BIG_MS 뒤 머리글로 줄입니다. 해설은 큰 제목 = 해설 제목, 머리글 = 지금 장의 제목. 움직임 줄이기 설정이면 머리글만 보입니다. */
    _showTitle(i) {
      const ui = this.ui, cs = this.cs, sc = this.lab.list[i];
      const big = String((cs && cs.title) || (sc && sc.title) || '').trim();
      clearTimeout(this._titleT);
      ui.tBig.textContent = big;
      ui.tbar.hidden = !big;
      ui.tBig.classList.remove('on', 'shrink');
      this._ch = -1;
      this._setChapterTitle(core.chapterAt(cs, this.t), big);
      if (!big) return;
      if (REDUCED.matches) { ui.tbar.dataset.phase = 'small'; return; }
      ui.tbar.dataset.phase = 'big';
      void ui.tBig.offsetWidth; // 다시 보기 때도 처음부터 다시 나타나게
      ui.tBig.classList.add('on');
      this._titleT = setTimeout(() => { ui.tbar.dataset.phase = 'small'; ui.tBig.classList.add('shrink'); }, TITLE_BIG_MS);
    }
    /** 머리글의 작은 제목: 해설(장 2개 이상)이면 「2/3 · 장 제목」, 영상이면 제목 그대로. 막대의 장 눈금도 갱신. */
    _setChapterTitle(k, fallback) {
      const cs = this.cs, ui = this.ui;
      if (!cs) return;
      const n = cs.chapters.length;
      this._ch = k;
      if (n > 1) {
        ui.tText.textContent = `${k + 1}/${n} · ${cs.chapters[k].title}`;
        // 큰 제목이 떠 있는 동안 다음 장으로 넘어가(탐색 포함) 작은 머리글이 필요해지면 바로 줄입니다
        if (k > 0 && ui.tbar.dataset.phase === 'big') { clearTimeout(this._titleT); ui.tbar.dataset.phase = 'small'; ui.tBig.classList.add('shrink'); }
      } else if (fallback != null) ui.tText.textContent = fallback;
      ui.ticks.querySelectorAll('i').forEach((el, idx) => el.classList.toggle('done', idx < k));
    }
    _renderTicks() {
      const cs = this.cs, ui = this.ui;
      ui.ticks.innerHTML = '';
      if (!cs || cs.chapters.length < 2) return;
      cs.chapters.slice(1).forEach((c) => ui.ticks.append(h('i', { style: { left: `${(c.at / cs.length) * 100}%` } })));
    }
    _hideTitle() {
      clearTimeout(this._titleT);
      this.ui.tBig.classList.remove('on', 'shrink');
    }

    /** 영상 화면(패널·장면 띠 접기, 자막 막대)으로 바꾸거나 되돌립니다. */
    _layout(on) {
      document.body.classList.toggle('apl-vid', !!on);
      if (on) { try { window.scrollTo(0, 0); } catch (e) { /* 무시 */ } }
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
      this._pre = { step: s.step, part: s.part };
      // 재생 동안 재생기가 쥐는 상태: lessonOn(장면이 정답을 미리 그리지 않게 하는 표시), review 해설이면 정리 탭 + dragging
      this._lessonOn = true;
      s.lessonOn = true;
      this._holdDrag = false;
      if (cs.tab === 'review' && lab._tabAvailable('review')) { lab.tab = 'review'; s.dragging = true; this._holdDrag = true; }
      this.stepMode = !!REDUCED.matches;
      this.t = 0;
      this._startedAt = performance.now();
      this._capIndex = -2;
      this.ui.end.hidden = true;
      document.body.classList.remove('apl-vend-on');
      this.ui.entry.hidden = true;
      this.ui.bar.hidden = false;
      this.ui.bar.dataset.mode = 'play';
      this.ui.bar.dataset.step = this.stepMode ? '1' : '';
      this._renderTicks();
      lab.ui.stage.append(this.ui.bar); // 끝 카드를 패널에 옮겼다면 무대 아래로 되돌림
      this._layout(true);
      this._showTitle(i);
      this.state = 'paused';
      if (this.stepMode) { this.seek(this._stepEnd(0)); this._syncUi(); this._announce(); return true; }
      this.apply();
      this.resume();
      return true;
    }
    /** 끝 카드의 「다음 ▶」 : 다음 해설 장면을 바로 재생, 없으면 목차를 엽니다. */
    playNext() {
      const n = this.nextIndex(this.index);
      if (n >= 0) { this.play(n); return; }
      this._leave(false);
      if (this.lab.toc) this.lab.toc.open();
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
      cancelAnimationFrame(this._raf); // 빠르게 연타해도 재생 루프는 하나
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
      const ch = core.chapterAt(cs, this.t);
      if (ch !== this._ch) this._setChapterTitle(ch, null);
      ui.range.value = String(Math.round((this.t / cs.length) * 1000));
      ui.range.style.setProperty('--p', (this.t / cs.length) * 100 + '%');
      ui.time.textContent = `${mmss(this.t)} / ${mmss(cs.length)}`;
      ui.range.setAttribute('aria-valuetext', `${mmss(this.t)} / ${mmss(cs.length)}`);
      const playing = this.state === 'playing';
      document.body.classList.toggle('apl-vplaying', playing);
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
    /** 재생 동안 쥐고 있던 lab 상태를 되돌립니다(탭 · step · dragging · lessonOn). 몇 번 불러도 같습니다. */
    _release() {
      if (!this._lessonOn) return;
      const lab = this.lab, s = lab.s;
      this._lessonOn = false;
      this._holdDrag = false;
      delete s.lessonOn;
      s.dragging = false;
      lab.tab = 'explore';
      if (this._pre) { if (this.cs && this.cs.usesStep) s.step = this._pre.step; if (this.cs && this.cs.usesPart) s.part = this._pre.part; }
      document.body.classList.remove('apl-vplaying');
    }
    /** 중간에 나갈 때: 지금 자막 구간의 끝 상태(대본 작성자가 확인한 깨끗한 값)를 적용하고, 슬라이더 칸에 맞춰 값을 정리합니다. */
    _settle() {
      const lab = this.lab, cs = this.cs;
      if (!cs || (this.state !== 'playing' && this.state !== 'paused')) return;
      const k = this._curSay();
      const t = k >= 0 ? Math.max(cs.says[k].at, cs.says[k].end - 1e-3) : this.t;
      const st = core.stateAt(cs, Math.min(t, cs.length), this.base);
      const nums = {};
      for (const [key, v] of Object.entries(st.nums)) {
        const p = lab.params && lab.params[key];
        let x = v;
        if (p && typeof p.min === 'number' && typeof p.max === 'number') {
          x = Math.min(p.max, Math.max(p.min, x));
          if (p.step > 0) x = p.min + Math.round((x - p.min) / p.step) * p.step;
          x = Math.min(p.max, Math.max(p.min, Math.round(x * 1e9) / 1e9));
        }
        nums[key] = x;
      }
      Object.assign(lab.s, nums, st.sets);
      if (cs.usesStep) lab.s.step = st.step;
      if (cs.usesPart) lab.s.part = st.part;
      lab.s.playing = false;
    }
    finish() {
      if (!this.cs || this.state === 'ended' || this.state === 'idle') return;
      cancelAnimationFrame(this._raf);
      this._raf = 0;
      this.t = this.cs.length;
      this.apply();
      this.state = 'ended';
      this._hideTitle(); // 끝 카드가 나오면 제목은 숨김(머리글 줄은 영상 화면이 풀리며 함께 사라짐)
      const lab = this.lab, cs = this.cs;
      this._release();
      // 해설은 휴대폰·태블릿 세로에서 영상 화면(그림 크게 + 아래 끝 카드)을 그대로 두고, 영상(쇼츠)과 넓은 화면은 예전처럼 탐구 패널 맨 위에 끝 카드를 둡니다.
      const keepStage = cs.kind === 'lesson' && NARROW.matches;
      if (!keepStage) {
        this._layout(false); // 탐구 화면(패널)으로 돌아옴. 그림은 끝난 상태 그대로
        if (lab.ui.main.classList.contains('panel-off')) lab.togglePanel();
      }
      lab._buildPanel();
      lab.invalidate(true);
      lab._saveHashSoon();
      this.ui.bar.dataset.mode = 'end';
      this.ui.endSum.innerHTML = richHtml(cs.summary);
      this.ui.endTask.innerHTML = `<b>이제 직접 해 보세요</b><span>${richHtml(cs.task)}</span>`;
      const nxt = this.nextIndex(this.index);
      this.ui.endNext.innerHTML = nxt >= 0 ? '<span>다음</span>' + icon('play') : icon('list') + '<span>목차로</span>';
      this.ui.endNext.setAttribute('aria-label', nxt >= 0 ? '다음 해설 보기' : '목차로');
      this.ui.end.hidden = false;
      document.body.classList.add('apl-vend-on');
      document.body.classList.remove('apl-vplaying');
      // 쇼츠·넓은 화면: 끝 카드를 탐구 패널에 두어 복구된 조작부와 함께 그림 높이를 줄이지 않습니다.
      if (!keepStage) lab.ui.panelInner.prepend(this.ui.bar);
    }
    /** 영상 상태를 끝내고 화면을 원래대로 되돌립니다(rebuild: 패널을 다시 만들지 여부). */
    _leave(rebuild) {
      cancelAnimationFrame(this._raf);
      this._raf = 0;
      const was = this.state;
      if (was === 'idle') return;
      this._settle();
      this._release();
      this.state = 'idle';
      this.cs = null;
      this._hideTitle();
      this.ui.bar.hidden = true;
      this.ui.end.hidden = true;
      this.lab.ui.stage.append(this.ui.bar); // 패널 재구성 전에 재생 막대를 보존
      document.body.classList.remove('apl-vend-on', 'apl-vplaying');
      this._layout(false);
      if (rebuild) { this.lab.tab = 'explore'; this.lab._buildPanel(); this.lab.invalidate(true); this.lab._saveHashSoon(); }
      if (!this._internal) this._syncEntry();
    }
    close() {
      if (this.state === 'idle') return;
      this._leave(true);
      this._setExplored(true);
    }
    _dismissEnd(keepLabel) {
      const task = this.cs && this.cs.task;
      this._leave(false);
      this._setExplored(true);
      if (task && !keepLabel) this._taskNote(task); // 같은 안내를 끝 카드와 동시에 두 번 보이지 않음
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
    const hasAny = (lab.def.videos && Object.keys(lab.def.videos).length) || (lab.def.lessons && Object.keys(lab.def.lessons).length)
      || (window.APL_LESSONS && window.APL_LESSONS[lab.id] && Object.keys(window.APL_LESSONS[lab.id]).length)
      || lab.list.some((sc) => sc.video || sc.lesson);
    if (!hasAny) return;
    lab.video = new Player(lab);
  });
})();
