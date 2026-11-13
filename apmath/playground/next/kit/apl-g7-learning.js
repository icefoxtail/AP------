/* Grade 7 learning entry. The existing explorer and full lessons remain intact.
 * A short is opt-in, bound to the actual current instance, and owns a separate
 * playback model. No global speed-up or guessed solution is used as a short.
 * Source contracts: APMATH_LAB_UI_CONTRACT_CURRENT.md and
 * APMATH_G7_GEOMETRY_VISUAL_STANDARD_CURRENT.md in docs/guides/.
 */
(function () {
  'use strict';
  const A = window.APLab;
  if (!A || A.G7Learning) return;
  const clone = value => JSON.parse(JSON.stringify(value));
  const param = name => new URLSearchParams(location.search).get(name) || new URLSearchParams(location.hash.slice(1)).get(name);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sceneKey = sc => `${sc.id}@${sc.gi || 0}`;
  const safeState = s => {
    const out = clone(s);
    // The native polyhedra question cache identifies its source by reference.
    // JSON storage duplicates that object; reconnect equal source conditions so
    // leaving a proof cannot silently shuffle the student's existing choices.
    if (out.phPC && out.phQ && JSON.stringify(out.phPC.q) === JSON.stringify(out.phQ)) out.phPC.q = out.phQ;
    delete out.lessonOn; delete out.lessonEntry; out.playing = false;
    return out;
  };
  const button = (text, fn, label = text) => A.h('button', { type: 'button', class: 'apl-btn', text, 'aria-label': label, onclick: fn });

  class Learning {
    constructor(lab, entry) {
      this.lab = lab;
      this.player = lab.video;
      this.records = new Map();
      this.entryRecords = new Map();
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
      this.view = 'lesson';
      this.contents = { scrollY: 0, listY: 0, onlyVideo: false, focus: null };
      this.session = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      this.depth = 0;
      this.infoCache = new Map();
      lab.learning = this;
      this.wrap();
      this.build();
      this.bind();
      const route = new URLSearchParams(entry?.route?.hash ?? location.hash.slice(1));
      const saved = entry?.navigation || history.state?.aplG7;
      if (saved?.version === 1 && saved.lab === lab.id && this.restoreRoute(saved)) { /* Same-tab reload restores a paused route. */ }
      else {
        const existing = this.records.get(sceneKey(lab.scene));
        const conditionKeys = [...route.keys()].filter(k => k in lab.params || (lab.def.persist || []).includes(k));
        const compatible = existing && conditionKeys.every(k => {
          let value = existing.explore.s[k];
          const p = lab.params[k];
          if (p && typeof value === 'number') value = +value.toFixed(p.step && p.step < .01 ? 3 : 2);
          return String(value) === route.get(k);
        });
        if (compatible) this.restoreRecord(existing);
        else { this.mode = 'ready'; this.current = this.makeRecord(); }
        const [entryId, entryGroup] = (route.get('s') || '').split('@');
        this.hasSelection = lab.list.some(sc => sc.id === entryId && (entryGroup == null || sc.gi === +entryGroup));
        if (route.has('short') && !this.plans().some(p => p.id === route.get('short'))) this.hasSelection = false;
        if (route.get('view') === 'toc' || !this.hasSelection) {
          this.active = null; this.mode = 'ready'; this.setView('contents');
          this.lab.toc.render();
          const group = route.get('n');
          if (group) requestAnimationFrame(() => this.lab.toc.ui.list.querySelectorAll('.apl-toc-group')[Math.max(0, +group - 1)]?.scrollIntoView({ block: 'start' }));
        } else {
          const plans = this.plans(), short = route.get('short');
          const explicit = short ? plans.findIndex(p => p.id === short) : -1;
          const legacy = route.get('play');
          if (explicit >= 0) this.choice = explicit;
          else if (legacy) {
            const k = this.player._playParam(legacy, lab.index), label = this.player.lessonInfo(lab.index)[k]?.label || '';
            const found = plans.findIndex(p => p.legacyLabel === label); if (found >= 0) this.choice = found;
          }
          this.setView('lesson');
          if (route.get('learn') === 'explore') this.explore();
          else this.prepare(Number(route.get('t')) || (compatible ? this.elapsed : 0));
        }
        lab._buildPanel(); this.refresh(); this.store();
      }
      document.body.classList.remove('apl-g7-loading');
      lab.board.resize(); lab.invalidate(true);
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
    store({ history: writeHistory = true } = {}) {
      if (!this.current || !this.enabled()) return;
      if (this.view !== 'contents') {
        if (!this.active && this.player.state === 'idle') this.current.explore = this.snapshot();
        if (this.active) this.current.proof = { short: this.active.id, elapsed: this.elapsed, signature: JSON.stringify(this.current.explore.s) };
        Object.assign(this.current, { mode: this.mode === 'playing' ? 'paused' : this.mode, choice: this.choice, short: this.active?.id || this.plans()[this.choice]?.id, elapsed: this.elapsed, visited: this.current.visited || this.mode !== 'ready', touched: Date.now() });
        this.records.set(sceneKey(this.lab.scene), clone(this.current));
      }
      clearTimeout(this.lab._hashT);
      if (writeHistory && !this.navigating && !this.restoring) this.syncHistory();
      else if (this.entryId && !this.navigating && !this.restoring) this.entryRecords?.set(this.entryId, this.routeSnapshot());
      this.writeRecords();
    }
    routeHash() {
      const q = new URLSearchParams();
      q.set('view', this.view === 'contents' ? 'toc' : 'lesson');
      if (this.view === 'contents') return q;
      const state = this.current?.explore.s || this.lab.s;
      q.set('s', this.lab.scene.id + (this.lab.groups.length > 1 ? '@' + this.lab.scene.gi : ''));
      const short = this.active?.id || this.plans()[this.choice]?.id;
      if (short) q.set('short', short);
      q.set('learn', this.mode === 'explore' || this.mode === 'legacy' ? 'explore' : 'paused');
      if (this.elapsed) q.set('t', String(+this.elapsed.toFixed(2)));
      if (state.step) q.set('step', String(state.step));
      for (const [key, p] of Object.entries(this.lab.params)) if (typeof state[key] === 'number') q.set(key, String(+state[key].toFixed(p.step && p.step < .01 ? 3 : 2)));
      for (const key of this.lab.def.persist || []) if (state[key] != null) q.set(key, String(state[key]));
      if (this.lab.teach) q.set('teach', '1');
      return q;
    }
    captureContents() {
      if (this.view !== 'contents' || !this.lab.toc) return;
      const { list } = this.lab.toc.ui;
      this.contents = { ...this.contents, scrollY: window.scrollY || 0, listY: list.scrollTop, onlyVideo: this.lab.toc.onlyVideo };
    }
    syncHistory(push = false) {
      this.captureContents();
      if (push) this.depth++;
      if (push || !this.entryId) this.entryId = `${this.session}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
      const route = this.routeSnapshot();
      this.entryRecords.set(this.entryId, route);
      const state = { ...(history.state || {}), aplG7: route };
      try { history[push ? 'pushState' : 'replaceState'](state, '', '#' + this.routeHash()); } catch (_) { /* Sandboxed/offline history. */ }
    }
    routeSnapshot() {
      return { version: 1, lab: this.lab.id, session: this.session, entryId: this.entryId, depth: this.depth, view: this.view,
        scene: sceneKey(this.lab.scene), record: clone(this.current), contents: clone(this.contents), hasSelection: !!this.hasSelection,
        scrollY: window.scrollY || 0 };
    }
    transition(change, { replace = false } = {}) {
      clearTimeout(this.scrollTimer);
      this.cancelPending(); this.pause(); this.store();
      this.navigating = true;
      try { change(); } finally { this.navigating = false; }
      if (!replace) this.entryId = null;
      this.store({ history: false });
      this.syncHistory(!replace); this.writeRecords();
    }
    setView(view) {
      this.view = view;
      const toc = this.lab.toc, contents = view === 'contents' && this.enabled();
      document.body.classList.toggle('apl-g7-contents', contents);
      document.body.classList.remove('apl-toc-open');
      this.lab.ui.main.hidden = contents; this.lab.ui.main.inert = contents;
      if (toc) {
        toc.isOpen = contents;
        toc.ui.panel.hidden = !contents; toc.ui.panel.inert = !contents;
        toc.ui.panel.setAttribute('role', 'navigation');
        toc.ui.panel.setAttribute('aria-hidden', String(!contents));
        toc.ui.panel.classList.toggle('open', contents);
        toc.ui.scrim.hidden = true; toc.ui.close.hidden = true;
        toc.ui.topBtn.classList.toggle('on', contents);
        toc.ui.topBtn.setAttribute('aria-expanded', String(contents));
      }
      this.lab.board.resize(); this.lab.invalidate(true);
    }
    showContents({ replace = false } = {}) {
      if (this.view === 'contents') return;
      const destination = clone(this.contents);
      this.transition(() => {
        if (this.player.state !== 'idle') this.player._leave(false);
        this.active = null; this.mode = 'ready'; this.layout(false);
        this.restoreSnapshot(this.current.explore);
        this.lab.s.playing = false; this.lab._timerStop?.(); this.lab._tween = null;
        this.setView('contents'); this.lab.toc.render();
        this.lab.toc.setOnlyVideo(destination.onlyVideo);
        this.contents = destination; this.refresh();
        this.lab.toc.ui.list.scrollTop = destination.listY || 0;
        window.scrollTo(0, destination.scrollY || 0);
      }, { replace });
      this.restoreScroll(destination.scrollY, destination.focus);
    }
    restoreScroll(y = 0, focus) {
      const generation = this.generation, view = this.view;
      requestAnimationFrame(() => {
        if (generation !== this.generation || view !== this.view) return;
        if (this.view === 'contents') this.lab.toc.ui.list.scrollTop = this.contents.listY || 0;
        window.scrollTo(0, y || 0);
        const target = focus && this.lab.toc.ui.list.querySelector(`[data-i="${focus.i}"][data-choice="${focus.choice}"]`);
        target?.focus({ preventScroll: true });
      });
    }
    back() {
      if (this.depth > 0 && history.state?.aplG7?.session === this.session) history.back();
      else if (this.view === 'lesson') this.showContents({ replace: true });
      else if (history.length > 1) history.back();
      else if (this.homeURL) location.assign(this.homeURL);
    }
    restoreRoute(route) {
      clearTimeout(this.scrollTimer);
      this.cancelPending(); this.pause(); this.store({ history: false });
      route = this.entryRecords.get(route.entryId) || route;
      const i = this.lab.list.findIndex(sc => sceneKey(sc) === route.scene);
      if (i < 0 || !route.record?.explore?.s) return false;
      this.restoring = this.navigating = true;
      try {
        this.session = route.session; this.entryId = route.entryId; this.depth = route.depth || 0;
        this.contents = clone(route.contents || { scrollY: 0, listY: 0, onlyVideo: false });
        this.hasSelection = !!route.hasSelection;
        this.loadScene(i, {}, route.record);
        this.setView(route.view === 'contents' ? 'contents' : 'lesson');
        if (this.view === 'contents') {
          this.active = null; this.mode = 'ready'; this.layout(false); this.restoreSnapshot(this.current.explore);
          this.lab.toc.render(); this.lab.toc.setOnlyVideo(this.contents.onlyVideo);
        }
        this.refresh();
      } finally { this.restoring = this.navigating = false; }
      this.restoreScroll(route.scrollY, this.view === 'contents' ? this.contents.focus : null);
      return true;
    }
    restoreURL() {
      const q = new URLSearchParams(location.hash.slice(1)), sid = q.get('s');
      const [id, gi] = (sid || '').split('@');
      const i = this.lab.list.findIndex(sc => sc.id === id && (gi == null || sc.gi === +gi));
      const params = {};
      for (const [k, v] of q) {
        if (k in this.lab.params) params[k] = +v;
        else if ((this.lab.def.persist || []).includes(k)) params[k] = v === 'true' ? true : v === 'false' ? false : isNaN(+v) ? v : +v;
      }
      this.cancelPending(); this.pause(); this.store({ history: false });
      this.navigating = true;
      try {
        this.depth = 0; this.entryId = null;
        this.loadScene(i < 0 ? this.lab.index : i, { params });
        const validShort = !q.has('short') || this.plans().some(plan => plan.id === q.get('short'));
        this.setView(i >= 0 && validShort && q.get('view') !== 'toc' ? 'lesson' : 'contents');
        if (this.view === 'contents') { this.active = null; this.mode = 'ready'; this.layout(false); this.lab.toc.render(); }
        else {
          this.hasSelection = true;
          const at = this.plans().findIndex(p => p.id === q.get('short')); if (at >= 0) this.choice = at;
          if (q.get('learn') === 'explore') this.explore(); else this.prepare(+q.get('t') || 0);
        }
        this.refresh();
      } finally { this.navigating = false; }
      this.store(); this.restoreScroll(0);
    }
    readRecords() {
      try {
        const data = JSON.parse(sessionStorage.getItem(this.storageKey) || 'null');
        if (data?.version === 1 && Array.isArray(data.entries)) for (const [key, entry] of data.entries) if (entry?.lab === this.lab.id && entry.record?.explore?.s) this.entryRecords.set(key, entry);
        if (data?.version === 1 && Array.isArray(data.records)) for (const [key, r] of data.records) if (r?.explore?.s && ['ready', 'paused', 'ended', 'explore', 'legacy'].includes(r.mode)) this.records.set(key, r);
      } catch (_) { /* Storage disabled or corrupt: retain in-memory state. */ }
    }
    writeRecords() {
      try {
        const items = [...this.records].sort((a, b) => b[1].touched - a[1].touched).slice(0, 96);
        sessionStorage.setItem(this.storageKey, JSON.stringify({ version: 1, records: items, entries: this.entryRecords ? [...this.entryRecords].slice(-32) : [] }));
      } catch (_) { /* Quota failure never resets the live scene. */ }
    }
    restoreRecord(record) {
      this.current = clone(record);
      this.restoreSnapshot(record.explore);
      this.choice = record.choice || 0;
      const stableChoice = record.short && this.plans().findIndex(p => p.id === record.short);
      if (typeof stableChoice === 'number' && stableChoice >= 0) this.choice = stableChoice;
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
    loadScene(i, options = {}, record) {
      if (this.player.state !== 'idle') this.player._leave(false);
      this.active = null; this.layout(false);
      const hasParams = options.params && Object.keys(options.params).length > 0;
      const old = record || (!hasParams && this.records.get(sceneKey(this.lab.list[i])));
      this.lab.s = clone(this.defaultState);
      this.originalGo(i, options);
      this.choice = 0; this.elapsed = 0; this.mode = 'ready';
      this.current = this.makeRecord();
      if (old) this.restoreRecord(old);
    }
    go(i, options = {}) {
      if (!this.enabled()) return this.originalGo(i, options);
      if (!Number.isInteger(i) || i < 0 || i >= this.lab.list.length) return;
      this.transition(() => {
        this.loadScene(i, options); this.hasSelection = true;
        this.setView('lesson'); this.refresh();
      });
      window.scrollTo(0, 0);
      if (options.autoplay !== false && this.mode === 'ready') this.schedule(true);
    }
    lessonInfo(i) {
      if (this.infoCache.has(i)) return this.infoCache.get(i);
      const sc = this.lab.list[i], key = `${this.lab.id}/${sc.id}`, native = this.player.lessonInfo(i);
      let info = A.G7ShortInfo?.[key];
      if (!info && A.G7Shorts?.[key]) {
        // Some older authored models predate the metadata registry. Bind them
        // to an isolated default instance; never navigate or touch the live lab.
        const probe = Object.create(this.lab);
        probe.index = i; probe.s = clone(this.defaultState); probe.tab = 'explore';
        try { info = A.G7Shorts[key](probe, probe.s); } catch (error) { console.warn('G7 contents metadata', key, error.message); }
      }
      const rows = (info?.length ? info : native).map((r, choice) => {
        const label = r.legacyLabel ?? r.label ?? '';
        const k = native.findIndex(x => (x.label || '') === label);
        return { i, choice, k: k >= 0 ? k : choice, legacyLabel: label, label: label || r.label || '그림으로 풀이',
          length: r.duration || r.length, key: `${sceneKey(sc)}:${choice}`, title: sc.title };
      });
      this.infoCache.set(i, rows); return rows;
    }
    items() { return this.lab.list.flatMap((sc, i) => this.lessonInfo(i).length ? this.lessonInfo(i) : [{ i, choice: 0, label: sc.title, key: `${sceneKey(sc)}:0` }]); }
    selectedItem() {
      const plan = this.active || this.plans()[this.choice], rows = this.lessonInfo(this.lab.index);
      return rows.find(r => r.legacyLabel === plan?.legacyLabel) || rows[0] || { i: this.lab.index, choice: 0 };
    }
    select(i, choice = 0, { autoplay = true, explore = false } = {}) {
      if (!Number.isInteger(i) || i < 0 || i >= this.lab.list.length) return;
      if (this.view === 'contents') this.contents.focus = { i, choice };
      this.transition(() => {
        this.loadScene(i); this.hasSelection = true;
        this.setView('lesson');
        if (this.lab.tab === 'problem') this.lab.setTab('review');
        const item = this.lessonInfo(i)[choice], plans = this.plans();
        const found = plans.findIndex(p => p.legacyLabel === item?.legacyLabel);
        this.choice = found >= 0 ? found : Math.min(choice, Math.max(0, plans.length - 1));
        if (explore) this.explore();
        else if (autoplay) this.play();
        else this.prepare(0);
        this.refresh();
      });
      window.scrollTo(0, 0);
      this.ui.location.focus({ preventScroll: true });
    }
    moveItem(direction) {
      const items = this.items(), current = this.selectedItem(), at = items.findIndex(x => x.i === current.i && x.choice === current.choice), next = items[at + direction];
      if (next) this.select(next.i, next.choice);
    }
    prepare(elapsed = 0) {
      const plan = this.plans()[this.choice];
      if (!plan || !this.allowed()) return false;
      this.active = plan; this.elapsed = Math.max(0, Math.min(plan.duration, elapsed));
      this.lab.s.playing = false; this.lab.s.lessonOn = true;
      this.mode = this.elapsed >= plan.duration ? 'ended' : 'paused';
      this.layout(true); this.refresh(); return true;
    }
    wrap() {
      const lab = this.lab, p = this.player;
      const saveHash = lab._saveHashSoon?.bind(lab), shareURL = lab.shareURL?.bind(lab);
      lab._saveHashSoon = () => { clearTimeout(lab._hashT); if (!this.enabled()) return saveHash?.(); if (!this.navigating) this.store(); };
      lab.shareURL = () => this.enabled() ? location.href.split('#')[0] + '#' + this.routeHash() : shareURL?.();
      this.originalGo = lab.goScene.bind(lab);
      lab.goScene = (i, options) => this.go(i, options);
      const setTab = lab.setTab.bind(lab);
      lab.setTab = id => {
        if (!this.enabled()) return setTab(id);
        if (id !== lab.tab && lab._tabAvailable(id)) {
          // Native tab changes preserve explicitly opened explanations and controls.
          // Rebuild only when leaving playback or a pending learning entry.
          if (this.mode === 'explore' && !this.active && p.state === 'idle' && !this.timer) this.cancelPending();
          else this.explore();
        }
        const result = setTab(id);
        if (this.current) this.current.explore = this.snapshot();
        this.refresh(); this.store(); return result;
      };
      const setTeach = lab.setTeach.bind(lab);
      lab.setTeach = on => {
        if (on === lab.teach) return setTeach(on);
        if (on) {
          if (this.view === 'contents') this.select(lab.index, 0, { explore: true }); else this.explore();
          this.store();
          const result = setTeach(on); this.refresh(); return result;
        }
        // Teacher navigation is native. On returning, adopt that actual scene
        // instead of restoring a student snapshot onto an unrelated scene.
        if (p.state !== 'idle') p._leave(false);
        const result = setTeach(on);
        this.active = null; this.choice = 0; this.elapsed = 0; this.mode = 'explore';
        this.current = this.makeRecord(); this.setView('lesson'); this.refresh(); this.store(); return result;
      };
      this.originalPlay = p.play.bind(p);
      this.originalLeave = p._leave.bind(p);
      p._leave = rebuild => {
        const result = this.originalLeave(rebuild);
        if (this.legacySnapshot) { const saved = this.legacySnapshot; this.legacySnapshot = null; this.restoreSnapshot(saved); this.mode = 'explore'; this.store(); this.refresh(); }
        return result;
      };
      p.play = (i, k = 0) => {
        if (lab.teach) return this.originalPlay(i, k);
        const legacy = p.lessonInfo(i)[k], rows = this.lessonInfo(i);
        const found = rows.findIndex(row => row.legacyLabel === (legacy?.label || ''));
        return this.select(i, found >= 0 ? found : 0);
      };
      // Existing Player resets the scene before playing. Its full-lesson route
      // still resets, but the exact exploration snapshot is restored on exit.
      lab.list.forEach(sc => {
        const draw = sc.draw || lab.def.draw, tick = sc.tick, view = sc.view;
        // Native view builders may initialize question keys or other live state.
        // A short owns its model and captions, so none of that native view work
        // should run until the student returns to exploration.
        sc.view = (s, owner) => this.active && sc === lab.scene ? {}
          : view ? view.call(sc, s, owner) : lab.def.view?.(s, sc, owner) || {};
        sc.draw = (b, s, v, owner) => {
          if (this.active && sc === lab.scene) this.active.draw(b, this.elapsed, this.active.model);
          else draw?.(b, s, v, owner);
        };
        if (tick) sc.tick = (s, dt, owner) => this.active && sc === lab.scene ? false : tick(s, dt, owner);
      });
    }
    build() {
      const ui = this.ui = {};
      ui.location = A.h('div', { class: 'g7-learning-location', tabindex: '-1' });
      ui.toc = button('목차', () => this.showContents()); ui.toc.classList.add('g7-learning-toc');
      ui.nav = A.h('nav', { class: 'g7-learning-nav', 'aria-label': '현재 학습 위치' }, ui.location, ui.toc);
      ui.goal = A.h('div', { class: 'g7-learning-goal', 'aria-live': 'polite' });
      ui.targets = A.h('div', { class: 'g7-learning-targets', role: 'group', 'aria-label': '구할 것' });
      ui.play = button('풀이 보기', () => this.toggle());
      ui.play.classList.add('primary');
      ui.replay = button('다시 보기', () => this.play());
      ui.explore = button('직접 해 보기', () => this.explore());
      ui.prev = button('이전 단계', () => this.step(-1));
      ui.next = button('다음 단계', () => this.step(1));
      ui.time = A.h('span', { class: 'g7-learning-time' });
      ui.range = A.h('input', { type: 'range', class: 'g7-learning-range', min: 0, max: 1000, value: 0, step: 1, 'aria-label': '풀이 진행 위치', oninput: () => { this.pause(); this.seek(+ui.range.value / 1000 * (this.active?.duration || 0)); } });
      ui.extra = A.h('details', { class: 'g7-learning-extra' }, A.h('summary', { text: '기존 자세한 해설' }));
      ui.legacy = A.h('div', { class: 'g7-learning-legacy' }); ui.extra.append(ui.legacy);
      ui.controls = A.h('div', { class: 'g7-learning-controls' }, ui.play, ui.replay, ui.explore);
      ui.progress = A.h('div', { class: 'g7-learning-progress' }, ui.prev, ui.range, ui.next, ui.time);
      ui.prevItem = button('이전 항목', () => this.moveItem(-1)); ui.prevItem.classList.add('g7-learning-prev-item');
      ui.nextItem = button('다음 항목', () => this.moveItem(1)); ui.nextItem.classList.add('g7-learning-next-item');
      ui.itemPosition = A.h('span', { class: 'g7-learning-item-position' });
      ui.items = A.h('nav', { class: 'g7-learning-items', 'aria-label': '학습 항목 이동' }, ui.prevItem, ui.itemPosition, ui.nextItem);
      ui.caption = A.h('div', { class: 'g7-short-caption', 'aria-live': 'off' });
      ui.formula = A.h('div', { class: 'g7-short-formula', 'aria-live': 'polite' });
      this.lab.ui.canvasWrap.append(ui.caption, ui.formula);
      ui.head = A.h('section', { class: 'g7-learning-head', 'aria-label': '선택한 학습 항목' }, ui.nav, ui.goal, ui.targets);
      ui.root = A.h('section', { class: 'g7-learning', 'aria-label': '그림으로 풀이' }, ui.controls, ui.progress, ui.items, ui.extra);
      this.lab.ui.stage.insertBefore(ui.head, this.lab.ui.canvasWrap);
      this.lab.ui.canvasWrap.after(ui.root);
    }
    bind() {
      const back = document.querySelector('.apl-back');
      this.homeURL = back?.href;
      back?.addEventListener('click', event => { if (!this.enabled() || event.ctrlKey || event.metaKey || event.shiftKey) return; event.preventDefault(); this.back(); });
      back?.setAttribute('aria-label', '뒤로가기');
      window.addEventListener('popstate', event => {
        if (!this.enabled()) return;
        if (event.state?.aplG7?.lab === this.lab.id && this.restoreRoute(event.state.aplG7)) return;
        this.restoreURL();
      });
      window.addEventListener('scroll', () => {
        clearTimeout(this.scrollTimer);
        this.scrollTimer = setTimeout(() => { if (!this.restoring && !this.navigating) this.store(); }, 120);
      }, { passive: true });
      document.addEventListener('visibilitychange', () => { if (document.hidden) { this.cancelPending(); this.pause(); this.store(); } });
      window.addEventListener('pagehide', () => { this.pause(); this.store(); });
      window.addEventListener('resize', () => { if (this.active) this.lab.invalidate(true); });
      const rm = matchMedia('(prefers-reduced-motion: reduce)');
      rm.addEventListener?.('change', () => { if (rm.matches) this.pause(); this.refresh(); });
      this.lab.ui.canvasWrap.addEventListener('pointerdown', e => { if (!this.active) return; this.pause(); e.stopImmediatePropagation(); }, true);
      const edited = event => {
        if (event.target?.closest('.g7-learning,.g7-learning-head') || this.view === 'contents' || this.active || this.player.state !== 'idle') return;
        if (!event.target?.closest('.apl-panel,.apl-dock,.apl-stage-tools,.apl-stage-tr,.apl-float,.apl-presets')) return;
        queueMicrotask(() => {
          if (this.active || this.player.state !== 'idle') return;
          this.cancelPending(); this.mode = 'explore';
          this.current.explore = this.snapshot(); this.store(); this.refresh();
        });
      };
      document.addEventListener('input', edited);
      document.addEventListener('change', edited);
      document.addEventListener('click', edited);
      document.addEventListener('keydown', e => {
        if (!this.enabled() || e.ctrlKey || e.metaKey || e.altKey || document.querySelector('.apl-dialog')) return;
        if (this.view === 'contents') { e.stopPropagation(); return; }
        if (!this.active || e.target?.closest('input,textarea,select,[contenteditable=true]') || (e.key === ' ' && e.target?.closest('button'))) return;
        if (e.key === ' ') this.toggle(); else if (e.key === 'ArrowRight') this.step(1); else if (e.key === 'ArrowLeft') this.step(-1); else if (e.key === 'Escape') this.explore(); else return;
        e.preventDefault(); e.stopImmediatePropagation();
      }, true);
    }
    enabled() { return !this.lab.teach && !['exam', 'assessment', 'test'].includes(param('mode')) && param('assessment') !== '1'; }
    allowed() { return this.enabled() && this.lab.tab !== 'problem'; }
    schedule(explicit = false) {
      if (!explicit || this.view !== 'lesson' || this.mode !== 'ready' || this.current?.visited || !this.allowed() || document.hidden || !this.plans().length || reduced()) return;
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
    play({ resume = false } = {}) {
      if (!this.allowed()) return false;
      if (this.view === 'contents') return this.select(this.lab.index, this.selectedItem().choice);
      this.cancelPending(); this.cancelFrame();
      if (this.player.state !== 'idle') this.player._leave(false);
      if (!this.active) this.current.explore = this.snapshot();
      const plan = this.plans()[this.choice];
      if (!plan) return this.playLegacy(0);
      const saved = this.current.proof;
      const from = resume && saved?.short === plan.id && saved.signature === JSON.stringify(this.current.explore.s) && saved.elapsed < plan.duration ? saved.elapsed : 0;
      this.active = plan; this.elapsed = from; this.current.visited = true;
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
      const routeState = history.state, navigating = this.navigating;
      this.navigating = true;
      let result;
      try { result = this.originalPlay(this.lab.index, k); } finally { this.navigating = navigating; }
      // The legacy player clears its old URL; retain this route's history namespace.
      history.replaceState(routeState, '', '#' + this.routeHash());
      if (result) { this.legacySnapshot = before; this.mode = 'legacy'; this.current.visited = true; this.refresh(); this.store(); }
      return result;
    }
    toggle() {
      if (this.mode === 'playing') { this.pause(); this.store(); }
      else if (this.mode === 'paused' && this.active) reduced() ? this.step(1) : this.resume();
      else if (this.mode === 'legacy') { this.player.toggle(); this.refresh(); }
      else this.play({ resume: this.mode === 'explore' });
    }
    resume() {
      if (!this.active || this.view === 'contents' || document.hidden || !this.allowed() || reduced()) return;
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
      if (this.active && this.current) this.current.proof = { short: this.active.id, elapsed: this.elapsed, signature: JSON.stringify(this.current.explore.s) };
      this.cancelPending(); this.cancelFrame();
      if (this.player.state !== 'idle') this.player._leave(false);
      const snapshot = this.current?.explore;
      this.active = null; this.mode = 'explore';
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
          this.frameSignature = signature; this.ui.caption.innerHTML = A.renderMath(frame.label);
          this.ui.formula.innerHTML = A.renderMath(frame.formula || '');
        }
      }
    }
    refresh() {
      if (!this.ui) return;
      const plans = this.plans(), selected = this.active || plans[this.choice], ui = this.ui;
      const enabled = this.enabled();
      document.body.classList.toggle('apl-g7-learning', enabled);
      ui.head.hidden = !enabled;
      ui.root.hidden = !this.allowed();
      if (!enabled && this.lab.toc) {
        document.body.classList.remove('apl-g7-contents');
        this.lab.ui.main.hidden = this.lab.ui.main.inert = false;
        this.lab.toc.ui.panel.hidden = false; this.lab.toc.ui.panel.setAttribute('role', 'dialog');
        this.lab.toc.ui.close.hidden = false;
      }
      const group = A.stripEmoji(this.lab.scene.group?.title || ''), title = A.stripEmoji(this.lab.scene.short || this.lab.scene.title);
      ui.location.textContent = [group, title].filter(Boolean).join(' › ');
      const items = this.items(), current = this.selectedItem(), at = items.findIndex(x => x.i === current.i && x.choice === current.choice);
      ui.prevItem.disabled = at <= 0; ui.nextItem.disabled = at < 0 || at === items.length - 1;
      ui.itemPosition.textContent = `${at + 1} / ${items.length}`;
      ui.prevItem.title = items[at - 1] ? `${A.stripEmoji(this.lab.list[items[at - 1].i].title)} · ${items[at - 1].label}` : '첫 항목';
      ui.nextItem.title = items[at + 1] ? `${A.stripEmoji(this.lab.list[items[at + 1].i].title)} · ${items[at + 1].label}` : '마지막 항목';
      ui.goal.innerHTML = selected ? `<b>${A.esc(selected.title)}</b><span>${A.renderMath(selected.given)}</span>` : `<b>${A.esc(A.stripEmoji(this.lab.scene.title))}</b>`;
      ui.targets.replaceChildren(...plans.map((p, i) => { const b = button(p.label, () => { const row = this.lessonInfo(this.lab.index).find(x => x.legacyLabel === p.legacyLabel); this.select(this.lab.index, row?.choice || 0); }); b.setAttribute('aria-pressed', String(i === this.choice)); return b; }));
      ui.targets.hidden = plans.length < 2;
      ui.play.textContent = this.mode === 'playing' ? '일시 정지' : this.mode === 'paused' ? (reduced() ? '한 단계 보기' : '이어 보기') : this.mode === 'ended' ? '다시 보기' : plans.length ? '짧은 풀이 보기' : '예제 해설 보기';
      if (this.mode === 'explore' && this.current?.proof) ui.play.textContent = '풀이로 돌아가기';
      ui.play.setAttribute('aria-label', ui.play.textContent);
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
