/* Grade 7 learning entry. The existing explorer and full lessons remain intact.
 * A short is opt-in, bound to the actual current instance, and owns a separate
 * playback model. No global speed-up or guessed solution is used as a short.
 * Source contract: docs/guides/APMATH_G7_VISUAL_SHORTS_CURRENT.md.
 */
(function () {
  'use strict';
  const A = window.APLab;
  if (!A || A.G7Learning) return;
  const clone = value => JSON.parse(JSON.stringify(value));
  const param = name => new URLSearchParams(location.search).get(name) || new URLSearchParams(location.hash.slice(1)).get(name);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sceneKey = sc => `${sc.id}@${sc.gi || 0}`;
  const safeState = s => { const out = clone(s); delete out.lessonOn; delete out.lessonEntry; out.playing = false; return out; };
  const button = (text, fn, label = text) => A.h('button', { type: 'button', class: 'apl-btn', text, 'aria-label': label, onclick: fn });

  class Learning {
    constructor(lab, entry) {
      this.lab = lab;
      this.player = lab.video;
      this.records = new Map();
      this.mode = 'ready';
      this.active = null;
      this.elapsed = 0;
      this.choice = 0;
      this.timer = 0;
      this.raf = 0;
      this.generation = 0;
      this.restoring = false;
      this.defaultState = {};
      for (const [key, p] of Object.entries(lab.params)) this.defaultState[key] = p.value;
      Object.assign(this.defaultState, clone(lab.def.state || {}));
      this.defaultState = { ...this.defaultState, step: 0, part: null, revealed: false, playing: false };
      this.storageKey = `apl:g7-learning:v1:${lab.id}`;
      this.readRecords();
      this.player.manual = true; // Replace the old mobile entry only in this opt-in learning route.
      this.player._syncEntry();
      if (entry) { lab.s = safeState(entry.s); lab.tab = entry.tab; this.restoreView(entry.view); }
      this.wrap();
      this.build();
      this.bind();
      document.body.classList.add('apl-g7-learning');
      const existing = this.records.get(sceneKey(lab.scene));
      const explicit = new URLSearchParams(location.hash.slice(1));
      // A new shared seed/condition wins over a previous visit; a scene-only link can resume.
      const conditionKeys = [...explicit.keys()].filter(k => !['s', 'n', 'step', 'play', 'manual', 'teach'].includes(k));
      const compatible = existing && conditionKeys.every(k => {
        let value = existing.explore.s[k];
        const p = lab.params[k];
        if (p && typeof value === 'number') value = +value.toFixed(p.step && p.step < .01 ? 3 : 2);
        return String(value) === explicit.get(k);
      });
      if (compatible) this.restoreRecord(existing);
      else { this.mode = 'ready'; this.current = this.makeRecord(); }
      lab._buildPanel(); lab.invalidate(true); this.refresh();
      this.schedule();
    }

    captureView() {
      const b = this.lab.board;
      return clone({ focus: b.focus, zoom: b.zoom, panX: b.panX, panY: b.panY, kind: b.kind, aspect: b.aspect, panes: b.panes, insets: b.insets });
    }
    restoreView(v) {
      if (!v) return;
      const b = this.lab.board;
      for (const k of ['focus', 'zoom', 'panX', 'panY', 'kind', 'aspect', 'panes']) if (v[k] !== undefined) b[k] = clone(v[k]);
      if (v.insets && b.setInsets) b.setInsets(v.insets);
    }
    snapshot() { return { s: safeState(this.lab.s), tab: this.lab.tab, view: this.captureView() }; }
    restoreSnapshot(value) {
      if (!value) return;
      // Each scene has its own entire state object. Restoring one never mutates
      // another scene's saved parameters, problem seed, answer choice or camera.
      this.lab.s = safeState(value.s);
      this.lab.tab = value.tab || 'explore';
      this.restoreView(value.view);
      this.lab._buildPanel(); this.lab.invalidate(true);
    }
    makeRecord() { return { explore: this.snapshot(), mode: 'ready', choice: 0, elapsed: 0, visited: false, touched: Date.now() }; }
    store() {
      if (!this.current) return;
      if (!this.active && this.player.state === 'idle') this.current.explore = this.snapshot();
      Object.assign(this.current, { mode: this.mode === 'playing' ? 'paused' : this.mode, choice: this.choice, elapsed: this.elapsed, visited: this.current.visited || this.mode !== 'ready', touched: Date.now() });
      this.records.set(sceneKey(this.lab.scene), clone(this.current));
      this.writeRecords();
      // Commit the exploration instance before reload/navigation. The native
      // 250 ms debounce can otherwise leave an older seed in the URL.
      const state = this.current.explore.s, q = new URLSearchParams();
      q.set('s', this.lab.scene.id + (this.lab.groups.length > 1 ? '@' + this.lab.scene.gi : ''));
      if (state.step) q.set('step', String(state.step));
      for (const [key, p] of Object.entries(this.lab.params)) if (typeof state[key] === 'number') q.set(key, String(+state[key].toFixed(p.step && p.step < .01 ? 3 : 2)));
      for (const key of this.lab.def.persist || []) if (state[key] != null) q.set(key, String(state[key]));
      if (this.lab.teach) q.set('teach', '1');
      clearTimeout(this.lab._hashT);
      try { history.replaceState(history.state, '', '#' + q); } catch (_) { /* Embedded/offline context. */ }
    }
    readRecords() {
      try {
        const data = JSON.parse(sessionStorage.getItem(this.storageKey) || 'null');
        if (data?.version === 1 && Array.isArray(data.records)) for (const [key, r] of data.records) if (r?.explore?.s && ['ready', 'paused', 'ended', 'explore', 'legacy'].includes(r.mode)) this.records.set(key, r);
      } catch (_) { /* Storage disabled or corrupt: retain in-memory state. */ }
    }
    writeRecords() {
      try {
        const items = [...this.records].sort((a, b) => b[1].touched - a[1].touched).slice(0, 96);
        sessionStorage.setItem(this.storageKey, JSON.stringify({ version: 1, records: items }));
      } catch (_) { /* Quota failure never resets the live scene. */ }
    }
    restoreRecord(record) {
      this.current = clone(record);
      this.restoreSnapshot(record.explore);
      this.choice = record.choice || 0;
      this.mode = record.mode === 'legacy' ? 'explore' : record.mode;
      this.elapsed = record.elapsed || 0;
      if (this.mode === 'paused' || this.mode === 'ended') {
        const plan = this.plans()[this.choice];
        if (plan) { this.active = plan; this.lab.s.lessonOn = true; this.elapsed = Math.min(plan.duration, this.elapsed); this.layout(true); }
        else this.mode = 'explore';
      }
    }
    plans() {
      const build = (A.G7Shorts || {})[`${this.lab.id}/${this.lab.scene.id}`];
      if (!build) return [];
      try { return build(this.lab, clone((this.current?.explore || this.snapshot()).s)) || []; }
      catch (e) { console.error('G7 short binding failed', this.lab.scene.id, e); return []; }
    }
    cancelPending() { clearTimeout(this.timer); this.timer = 0; this.generation++; }
    cancelFrame() { cancelAnimationFrame(this.raf); this.raf = 0; this.last = 0; }
    go(i, options = {}) {
      if (!Number.isInteger(i) || i < 0 || i >= this.lab.list.length) return;
      this.cancelPending(); this.pause(); this.store();
      if (this.player.state !== 'idle') this.player._leave(false);
      this.active = null; this.layout(false);
      const hasParams = options.params && Object.keys(options.params).length > 0;
      const old = !hasParams && this.records.get(sceneKey(this.lab.list[i]));
      this.lab.s = clone(this.defaultState);
      this.originalGo(i, options);
      this.choice = 0; this.elapsed = 0; this.mode = 'ready';
      this.current = this.makeRecord();
      if (old) this.restoreRecord(old);
      this.refresh(); this.schedule();
    }
    wrap() {
      const lab = this.lab, p = this.player;
      if (lab.toc) { const open = lab.toc.open.bind(lab.toc); lab.toc.open = () => { this.pause(); return open(); }; }
      this.originalGo = lab.goScene.bind(lab);
      lab.goScene = (i, options) => this.go(i, options);
      const setTab = lab.setTab.bind(lab);
      lab.setTab = id => { if (id !== lab.tab && lab._tabAvailable(id)) this.explore(); const result = setTab(id); this.current.explore = this.snapshot(); this.refresh(); return result; };
      const setTeach = lab.setTeach.bind(lab);
      lab.setTeach = on => { this.explore(); const result = setTeach(on); this.refresh(); return result; };
      this.originalPlay = p.play.bind(p);
      this.originalLeave = p._leave.bind(p);
      p._leave = rebuild => {
        const result = this.originalLeave(rebuild);
        if (this.legacySnapshot) { const saved = this.legacySnapshot; this.legacySnapshot = null; this.restoreSnapshot(saved); this.mode = 'explore'; this.store(); this.refresh(); }
        return result;
      };
      p.play = (i, k = 0) => {
        // An explicit solution click may leave a question tab; automatic entry never does.
        if (lab.tab === 'problem') lab.setTab('review');
        if (i !== lab.index) this.go(i);
        const legacy = p.lessonInfo(i)[k];
        const choices = this.plans();
        const found = choices.findIndex(c => c.legacyLabel === legacy?.label);
        if (found >= 0) { this.choice = found; return this.play(); }
        return this.playLegacy(k);
      };
      // Existing Player resets the scene before playing. Its full-lesson route
      // still resets, but the exact exploration snapshot is restored on exit.
      lab.list.forEach(sc => {
        const draw = sc.draw || lab.def.draw, tick = sc.tick;
        sc.draw = (b, s, v, owner) => {
          if (this.active && sc === lab.scene) this.active.draw(b, this.elapsed, this.active.model);
          else draw?.(b, s, v, owner);
        };
        if (tick) sc.tick = (s, dt, owner) => this.active && sc === lab.scene ? false : tick(s, dt, owner);
      });
    }
    build() {
      const ui = this.ui = {};
      ui.goal = A.h('div', { class: 'g7-learning-goal', 'aria-live': 'polite' });
      ui.targets = A.h('div', { class: 'g7-learning-targets', role: 'group', 'aria-label': '구할 것' });
      ui.play = button('풀이 보기', () => this.toggle());
      ui.play.classList.add('primary');
      ui.replay = button('다시 보기', () => this.play());
      ui.explore = button('직접 해 보기', () => this.explore());
      ui.prev = button('이전', () => this.step(-1));
      ui.next = button('다음', () => this.step(1));
      ui.time = A.h('span', { class: 'g7-learning-time' });
      ui.range = A.h('input', { type: 'range', class: 'g7-learning-range', min: 0, max: 1000, value: 0, step: 1, 'aria-label': '풀이 진행 위치', oninput: () => { this.pause(); this.seek(+ui.range.value / 1000 * (this.active?.duration || 0)); } });
      ui.extra = A.h('details', { class: 'g7-learning-extra' }, A.h('summary', { text: '기존 자세한 해설' }));
      ui.legacy = A.h('div', { class: 'g7-learning-legacy' }); ui.extra.append(ui.legacy);
      ui.controls = A.h('div', { class: 'g7-learning-controls' }, ui.play, ui.replay, ui.explore);
      ui.progress = A.h('div', { class: 'g7-learning-progress' }, ui.prev, ui.range, ui.next, ui.time);
      ui.caption = A.h('div', { class: 'g7-short-caption', 'aria-live': 'off' });
      ui.formula = A.h('div', { class: 'g7-short-formula', 'aria-live': 'polite' });
      this.lab.ui.canvasWrap.append(ui.caption, ui.formula);
      ui.root = A.h('section', { class: 'g7-learning', 'aria-label': '그림으로 풀이' }, ui.goal, ui.targets, ui.controls, ui.progress, ui.extra);
      this.lab.ui.stage.insertBefore(ui.root, this.lab.ui.canvasWrap);
    }
    bind() {
      document.addEventListener('visibilitychange', () => { if (document.hidden) { this.cancelPending(); this.pause(); this.store(); } else this.schedule(); });
      window.addEventListener('pagehide', () => { this.pause(); this.store(); });
      window.addEventListener('resize', () => { if (this.active) this.lab.invalidate(true); });
      const rm = matchMedia('(prefers-reduced-motion: reduce)');
      rm.addEventListener?.('change', () => { if (rm.matches) this.pause(); this.refresh(); });
      this.lab.ui.canvasWrap.addEventListener('pointerdown', e => { if (!this.active) return; this.pause(); e.stopImmediatePropagation(); }, true);
      const edited = event => {
        if (event.target?.closest('.g7-learning') || this.active || this.player.state !== 'idle') return;
        if (!event.target?.closest('.apl-panel,.apl-dock,.apl-stage-tools,.apl-stage-tr,.apl-float,.apl-presets')) return;
        queueMicrotask(() => {
          if (this.active || this.player.state !== 'idle') return;
          this.cancelPending(); this.mode = 'explore'; this.choice = 0;
          this.current.explore = this.snapshot(); this.store(); this.refresh();
        });
      };
      document.addEventListener('input', edited);
      document.addEventListener('change', edited);
      document.addEventListener('click', edited);
      document.addEventListener('keydown', e => {
        if (!this.active || e.ctrlKey || e.metaKey || e.altKey || e.target?.closest('input,textarea,select,button,[contenteditable=true]') || this.lab.toc?.isOpen || document.querySelector('.apl-dialog')) return;
        if (e.key === ' ') this.toggle(); else if (e.key === 'ArrowRight') this.step(1); else if (e.key === 'ArrowLeft') this.step(-1); else if (e.key === 'Escape') this.explore(); else return;
        e.preventDefault(); e.stopImmediatePropagation();
      }, true);
    }
    allowed() { return !this.lab.teach && this.lab.tab !== 'problem' && !['exam', 'assessment', 'test'].includes(param('mode')) && param('assessment') !== '1'; }
    schedule() {
      if (this.mode !== 'ready' || this.current?.visited || !this.allowed() || document.hidden || !this.plans().length || reduced()) return;
      this.cancelPending(); const generation = this.generation, id = sceneKey(this.lab.scene);
      // Two paints plus a short initial hold: loading time never consumes the short.
      Promise.resolve(document.fonts?.ready).then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
        if (generation !== this.generation) return;
        this.timer = setTimeout(() => {
          this.timer = 0;
          const r = this.lab.ui.canvasWrap.getBoundingClientRect();
          if (generation === this.generation && id === sceneKey(this.lab.scene) && this.mode === 'ready' && this.allowed() && !document.hidden && r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0 && !this.lab.toc?.isOpen) this.play();
        }, 600);
      })));
    }
    play() {
      if (!this.allowed()) return false;
      this.cancelPending(); this.cancelFrame();
      if (this.player.state !== 'idle') this.player._leave(false);
      if (!this.active) this.current.explore = this.snapshot();
      const plan = this.plans()[this.choice];
      if (!plan) return this.playLegacy(0);
      this.active = plan; this.elapsed = 0; this.current.visited = true;
      this.lab.s.playing = false; this.lab.s.lessonOn = true;
      this.layout(true); this.mode = 'paused'; this.refresh(); this.lab.invalidate(true);
      if (!reduced()) this.resume();
      this.store(); return true;
    }
    playLegacy(k) {
      this.cancelPending();
      if (!this.allowed()) return false;
      this.explore();
      const before = this.snapshot();
      const result = this.originalPlay(this.lab.index, k);
      if (result) { this.legacySnapshot = before; this.mode = 'legacy'; this.current.visited = true; this.refresh(); }
      return result;
    }
    toggle() {
      if (this.mode === 'playing') this.pause();
      else if (this.mode === 'paused' && this.active) reduced() ? this.step(1) : this.resume();
      else if (this.mode === 'legacy') { this.player.toggle(); this.refresh(); }
      else this.play();
    }
    resume() {
      if (!this.active || document.hidden || !this.allowed() || reduced()) return;
      this.cancelFrame(); this.mode = 'playing'; this.last = 0; this.refresh();
      const frame = now => {
        this.raf = 0; if (this.mode !== 'playing') return;
        if (document.hidden) { this.pause(); return; }
        if (this.last) this.elapsed = Math.min(this.active.duration, this.elapsed + Math.min(.1, (now - this.last) / 1000));
        this.last = now; this.lab.invalidate(); this.syncProgress();
        if (this.elapsed >= this.active.duration) { this.mode = 'ended'; this.cancelFrame(); this.refresh(); this.store(); }
        else this.raf = requestAnimationFrame(frame);
      };
      this.raf = requestAnimationFrame(frame);
    }
    pause() { if (this.mode === 'playing') { this.mode = 'paused'; this.cancelFrame(); this.refresh(); } if (this.player.state === 'playing') this.player.pause(); }
    seek(t) { if (!this.active) return; this.elapsed = Math.max(0, Math.min(this.active.duration, t)); this.mode = this.elapsed >= this.active.duration ? 'ended' : 'paused'; this.lab.invalidate(true); this.syncProgress(); this.refresh(); this.store(); }
    step(direction) {
      if (!this.active) { this.play(); this.pause(); }
      if (!this.active) return;
      this.pause(); const cuts = [0, ...this.active.stops, this.active.duration];
      this.seek(direction > 0 ? cuts.find(t => t > this.elapsed + .02) ?? this.active.duration : [...cuts].reverse().find(t => t < this.elapsed - .02) ?? 0);
    }
    explore() {
      // The student can edit any native slider/preset before opening a lesson.
      // Capture live exploration before restoring, not the earlier entry value.
      if (!this.active && this.player.state === 'idle' && this.current) this.current.explore = this.snapshot();
      this.cancelPending(); this.cancelFrame();
      if (this.player.state !== 'idle') this.player._leave(false);
      const snapshot = this.current?.explore;
      this.active = null; this.elapsed = 0; this.mode = 'explore';
      this.layout(false); if (snapshot) this.restoreSnapshot(snapshot);
      if (this.current) this.current.visited = true;
      this.refresh(); this.store();
    }
    layout(on) { document.body.classList.toggle('g7-short-active', on); this.lab.board.resize(); this.lab.invalidate(true); }
    syncProgress() {
      const plan = this.active; this.ui.progress.hidden = !plan;
      this.ui.range.value = plan ? Math.round(this.elapsed / plan.duration * 1000) : 0;
      this.ui.range.setAttribute('aria-valuetext', plan ? `${this.elapsed.toFixed(1)} / ${plan.duration}초` : '풀이 준비');
      this.ui.time.textContent = plan ? `${this.elapsed.toFixed(1)} / ${plan.duration}초` : '';
      this.ui.caption.hidden = this.ui.formula.hidden = !plan;
      if (plan?.frame) {
        const frame = plan.frame(this.elapsed, plan.model), signature = JSON.stringify(frame);
        if (signature !== this.frameSignature) {
          this.frameSignature = signature; this.ui.caption.textContent = frame.label;
          this.ui.formula.innerHTML = A.renderMath(frame.formula || '');
        }
      }
    }
    refresh() {
      if (!this.ui) return;
      const plans = this.plans(), selected = this.active || plans[this.choice], ui = this.ui;
      document.body.classList.toggle('apl-g7-learning', this.allowed());
      ui.root.hidden = !this.allowed();
      ui.goal.innerHTML = selected ? `<b>${A.esc(selected.title)}</b><span>${A.renderMath(selected.given)}</span>` : `<b>${A.esc(A.stripEmoji(this.lab.scene.title))}</b>`;
      ui.targets.replaceChildren(...plans.map((p, i) => { const b = button(p.label, () => { this.explore(); this.choice = i; this.mode = 'ready'; this.refresh(); this.play(); }); b.setAttribute('aria-pressed', String(i === this.choice)); return b; }));
      ui.targets.hidden = plans.length < 2;
      ui.play.textContent = this.mode === 'playing' ? '일시 정지' : this.mode === 'paused' ? (reduced() ? '다음 단계' : '이어 보기') : this.mode === 'ended' ? '다시 보기' : plans.length ? '짧은 풀이 보기' : '예제 해설 보기';
      if (this.mode === 'legacy') ui.play.textContent = this.player.state === 'playing' ? '일시 정지' : this.player.state === 'paused' ? '이어 보기' : '예제 다시 보기';
      ui.replay.hidden = !this.active || this.mode === 'ended';
      ui.prev.hidden = ui.next.hidden = !this.active;
      const entries = this.player.lessonInfo(this.lab.index);
      ui.legacy.replaceChildren(...entries.map(x => button(`${x.label || '해설'} · 예제 조건`, () => this.playLegacy(x.k))));
      ui.extra.hidden = !entries.length || !!this.active;
      ui.play.disabled = !plans.length && !entries.length;
      ui.root.dataset.status = plans.length ? 'authored' : 'legacy';
      ui.root.dataset.mode = this.mode;
      this.syncProgress();
    }
  }
  A.G7Learning = { Learning, clone, sceneKey, install(lab, entry) {
    if (!lab?.id?.startsWith('g7-') || !lab.video || lab.learning || param('manual') === '1' || param('teach') === '1' || lab.teach || ['exam', 'assessment', 'test'].includes(param('mode')) || param('assessment') === '1') return null;
    lab.learning = new Learning(lab, entry); return lab.learning;
  } };
})();
