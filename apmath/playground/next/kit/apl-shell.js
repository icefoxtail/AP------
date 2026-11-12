/* ==========================================================================
   AP Math Lab Kit · 실험실 셸 (apl-shell.js)
   APLab.createLab(def) 하나로 모든 실험실이 같은 화면 구조를 갖습니다.

   [화면 구조]  상단 바(뒤로·제목·장면 레일·도구)  |  무대(그림)  |  패널(탐구 · 정리 · 문제)
   [실험실 작성자가 하는 일]
     1) params  : 조작할 값(슬라이더)의 범위·색·표기
     2) scenes  : 장면마다 질문·안내·단계·문제·해설(데이터)과 draw(b, s, v)(수학 그림)
     3) view(s) : 실시간 값·상태·관찰 포인트 등 변하는 내용을 돌려주는 함수
   나머지(반응형 배치, 수업 모드, 판서, 공유, 단축키, URL 상태 저장)는 셸이 책임집니다.
   [stackFractions: false로 해제 가능, 기본 true] 패널·칸·칩 글 속 '1/2'·'½'·'5π/3'(숫자 분수)를 쌓은 KaTeX 분수로 바꿉니다(APLab.stackFr). 'a/2' 같은 글자 분수는 $\frac{a}{2}$ 로 직접 씁니다.
   ========================================================================== */
(function () {
  'use strict';
  const shellScriptUrl = typeof document === 'undefined' ? null : document.currentScript?.src;
  function attachStudentNavigation() {
    if (!shellScriptUrl || document.getElementById('apl-student-navigation-script')) return;
    // Standalone labs keep their existing asset boundary. Portal links carry
    // explicit metadata; only those visits load the shared student navigation.
    const params = new URLSearchParams(window.location?.search || '');
    if (params.get('portal') !== '1' && params.get('teacher_preview') !== '1') return;
    const markLabPlayer = () => document.body?.classList.add('student-nav-lab-player');
    if (document.body) markLabPlayer();
    else document.addEventListener('DOMContentLoaded', markLabPlayer, { once: true });
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = new URL('../../../css/student-navigation.css?v=2026.11.11.4', shellScriptUrl).href;
    document.head.appendChild(css);
    const script = document.createElement('script');
    script.id = 'apl-student-navigation-script';
    script.src = new URL('../../../js/student-navigation.js?v=2026.11.11.4', shellScriptUrl).href;
    script.dataset.studentNavActive = 'labs';
    script.dataset.studentNavContextOnly = 'true';
    script.onload = () => {
      const back = document.querySelector('.apl-back');
      if (back) back.href = window.StudentPortalNavigation.withContext(back.href);
    };
    document.head.appendChild(script);
  }
  const APLab = window.APLab;
  const { h, icon, clamp } = APLab;

  const TABS = [
    { id: 'explore', label: '탐구', ico: 'hand' },
    { id: 'review', label: '정리', ico: 'layers' },
    { id: 'problem', label: '문제', ico: 'flag' }
  ];
  const TONE_ICON = { ok: 'check', warn: 'alert', bad: 'x', info: 'info', key: 'spark' };
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const call = (v, ...a) => (typeof v === 'function' ? v(...a) : v);
  const NARROW = window.matchMedia('(max-width: 859px)'); // apl.css의 모바일 기준과 같은 값
  const PEN_NAME = { amber: '노랑', rose: '분홍', sky: '하늘', ink: '기본' }; // 판서 펜 색 이름(화면 읽기 프로그램용)

  class Lab {
    constructor(def) {
      this.def = def;
      this.id = def.id;
      this.s = {};
      this.params = def.params || {};
      for (const [k, p] of Object.entries(this.params)) this.s[k] = p.value;
      Object.assign(this.s, def.state || {});
      this.s.step = 0;
      this.s.part = null;
      this.s.revealed = false;
      this.s.playing = false;
      this.tab = 'explore';
      this.teach = false;
      this.list = [];
      const groups = def.groups || [{ title: '', scenes: def.scenes || [] }];
      groups.forEach((g, gi) => g.scenes.forEach((sc) => this.list.push({ ...(def.stackFractions !== false ? APLab.stackScene(sc) : sc), gi, group: g })));
      this.groups = groups;
      this.index = 0;
      this.ink = new Map();
      this.pen = { on: false, color: 'amber', erase: false };
      this._raf = 0;
      this._tween = null;
      this._dirtyPanel = true;
      this._last = 0;
      this._build();
      this._bindKeys();
      this._restore();
      // 선택 기능(영상 재생기·목차 패널 등)이 붙는 자리: 해당 스크립트를 불러온 실험실에서만 동작합니다(kit/apl-player.js, apl-toc.js).
      if (APLab.labHooks) APLab.labHooks.forEach((hook) => hook(this));
      APLab.pushRecent({ id: this.id, title: def.title, course: def.courseName, href: location.pathname.split('/').slice(-3).join('/') });
      // 실험실을 연 탭은 허브로 돌아와도 Universe로 되돌려 보내지 않습니다(next/index.html의 입구 확인과 짝).
      try { sessionStorage.setItem('apl:viaUniverse', '1'); } catch (e) {}
    }

    /* ======================= DOM ======================= */
    _build() {
      const d = this.def;
      document.body.classList.add('apl');
      document.body.classList.toggle('apl-staged', !!d.stagedReveal);
      if (d.courseColor) document.documentElement.style.setProperty('--c-course', d.courseColor);
      const ui = (this.ui = {});

      // 상단 바
      ui.rail = h('nav', { class: 'apl-rail', role: 'tablist', 'aria-label': '장면' });
      // '모든 장면' 단추는 가로로 밀리는 장면 줄 밖에 두어 장면이 많아도 늘 오른쪽 끝에 보이게 합니다.
      ui.allBtn = h('button', { class: 'apl-btn sm apl-all-btn', 'aria-label': '모든 장면 한눈에 보기', title: '모든 장면 한눈에 보기', html: icon('list') + '<span>모든 장면</span>', onclick: () => this.openOverview() });
      ui.railWrap = h('div', { class: 'apl-railwrap' }, ui.rail, ui.allBtn);
      ui.themeBtn = h('button', { class: 'apl-icon-btn', 'aria-label': '테마 바꾸기 (칠판/종이)', title: '칠판 ↔ 종이', onclick: () => { APLab.theme.toggle(); this._syncThemeIcon(); } });
      ui.teachBtn = h('button', { class: 'apl-btn sm apl-teach-btn', 'aria-pressed': 'false', title: '수업 모드 (T)', onclick: () => this.setTeach(!this.teach), html: icon('teach') + '<span class="lbl">수업 모드</span>' });
      ui.panelBtn = h('button', { class: 'apl-icon-btn apl-hide-sm', 'aria-label': '설명 패널 접기/펴기 (H)', title: '패널 접기 (H)', html: icon('panel'), onclick: () => this.togglePanel() });
      const railCount = (d.groups ? d.groups.length : (d.scenes || []).length);
      if (railCount > 6) document.body.classList.add('apl-many');
      const bar = h('header', { class: 'apl-bar' + (railCount > 6 ? ' many' : '') },
        h('a', { class: 'apl-icon-btn apl-back', href: d.home || '../index.html', 'aria-label': '실험실 목록으로', title: '실험실 목록', html: icon('back') }),
        h('div', { class: 'apl-titlebox' },
          h('div', { class: 'apl-crumbs', html: `<b>${APLab.esc(d.courseName || '')}</b>${d.unit ? ' · ' + APLab.esc(d.unit) : ''}` }),
          h('h1', { class: 'apl-title', html: APLab.renderMath(this._sf(APLab.esc(d.title))) })),
        ui.railWrap,
        h('div', { class: 'apl-actions' },
          ui.themeBtn,
          h('button', { class: 'apl-icon-btn', 'aria-label': '학생에게 공유', title: '학생 화면으로 보내기 (QR)', html: icon('share'), onclick: () => this.openShare() }),
          h('button', { class: 'apl-icon-btn apl-hide-sm', 'aria-label': '도움말과 단축키', title: '도움말 (?)', html: icon('help'), onclick: () => this.openHelp() }),
          ui.panelBtn,
          ui.teachBtn));
      this._syncThemeIcon();

      // 무대
      ui.canvas = h('canvas', { class: 'apl-canvas', tabindex: '0', 'aria-label': `${d.title} 무대. 화살표 키로 선택한 점을 움직이고 N 키로 다른 점을 고릅니다.` });
      ui.ink = h('canvas', { class: 'apl-ink', 'aria-hidden': 'true' });
      ui.labels = h('div', { class: 'apl-labels', 'aria-hidden': 'true' });
      ui.chips = h('div', { class: 'apl-float tl' });
      ui.status = h('div', { class: 'apl-status', hidden: true, role: 'status' });
      ui.card = h('div', { class: 'apl-card-float apl-glass', hidden: true });
      ui.studentTipBody = h('span');
      ui.studentTip = h('details', { class: 'sv-student-tip', hidden: true }, h('summary', {}, '힌트 보기'), ui.studentTipBody);
      ui.tr = h('div', { class: 'apl-float tr' }, ui.status, ui.card);
      ui.gridBtn = h('button', { class: 'apl-icon-btn on', 'aria-label': '격자 켜기/끄기 (G)', title: '격자 (G)', html: icon('grid'), onclick: () => this.set({ grid: !this.s.grid }) });
      ui.penBtn = h('button', { class: 'apl-icon-btn', 'aria-label': '판서 (D)', title: '판서 펜 (D)', html: icon('pen'), onclick: () => this.setPen(!this.pen.on) });
      ui.tools = h('div', { class: 'apl-float br' },
        h('div', { class: 'apl-tools apl-glass' },
          h('button', { class: 'apl-icon-btn apl-zoom-btn', 'aria-label': '확대', title: '확대 (+)', html: icon('zoomIn'), onclick: () => this.zoom(1.2) }),
          h('button', { class: 'apl-icon-btn apl-zoom-btn', 'aria-label': '축소', title: '축소 (−)', html: icon('zoomOut'), onclick: () => this.zoom(1 / 1.2) }),
          h('button', { class: 'apl-icon-btn', 'aria-label': '처음 화면으로 맞추기 (0)', title: '화면 맞춤 (0)', html: icon('fit'), onclick: () => this.fitView() }),
          h('hr'),
          ui.penBtn,
          h('button', { class: 'apl-icon-btn apl-hide-sm', 'aria-label': '그림 저장', title: '판서 포함 그림을 파일로 저장', html: icon('camera'), onclick: () => this.capture() }),
          h('button', { class: 'apl-icon-btn apl-hide-sm', 'aria-label': '전체 화면 (F)', title: '전체 화면 (F)', html: icon('full'), onclick: () => this.fullscreen() }),
          ui.gridBtn));
      ui.gridBtn.classList.add('apl-hide-sm');
      ui.presenter = h('div', { class: 'apl-presenter apl-glass', hidden: true });
      ui.penTools = h('div', { class: 'apl-pen-tools apl-glass', hidden: true });
      ui.canvasWrap = h('div', { class: 'apl-canvas-wrap' }, ui.canvas, ui.ink, ui.labels, ui.chips, ui.studentTip, ui.tr, ui.tools, ui.presenter, ui.penTools);
      ui.tape = h('div', { class: 'apl-tape', hidden: true });
      // 넓은 화면(860px 이상)의 무대 = 위 선택 띠(세부 장면·고르기 칩) + 그림 + 아래 막대 받침(막대·버튼). 휴대폰에서는 띠에 세부 장면 한 줄만 두고 고르기 칩·받침은 비웁니다(조작부는 패널에 그대로).
      // 키보드 초점 순서: 위 띠 → 그림 → 받침 → 패널.
      ui.topNav = h('div', { class: 'apl-top-nav', hidden: true });
      ui.topPick = h('div', { class: 'apl-top-pick', hidden: true });
      ui.top = h('div', { class: 'apl-stage-top', hidden: true, role: 'group', 'aria-label': '장면 고르기' }, ui.topNav, ui.topPick);
      ui.dockCtls = h('div', { class: 'apl-dock-ctls' });
      ui.dock = h('div', { class: 'apl-dock', hidden: true, role: 'group', 'aria-label': '조절 막대' }, ui.dockCtls);
      ui.stage = h('section', { class: 'apl-stage', 'aria-label': '수학 무대' }, ui.top, ui.canvasWrap, ui.tape, ui.dock);

      // 패널
      ui.head = h('div', { class: 'apl-scene-head' });
      ui.tabs = h('div', { class: 'apl-tabs', role: 'tablist', 'aria-label': '학습 단계' });
      ui.panes = {};
      for (const t of TABS) {
        ui.panes[t.id] = h('div', { class: 'apl-tabpanel', role: 'tabpanel', id: 'apl-pane-' + t.id, hidden: true });
      }
      ui.live = h('div', { class: 'apl-sr', 'aria-live': 'polite' });
      // 실험실이 문제 탭 안을 스스로 다시 그려도 '새 문제' 단추 이름·모양이 유지되고 정리 탭 끝단계가 따라오게 합니다.
      if (window.MutationObserver) new MutationObserver(() => { if (this.scene && this.refs) { this._normNewProb(); this._syncEndStep(); } }).observe(ui.panes.problem, { childList: true, subtree: true, characterData: true });
      ui.panelInner = h('div', { class: 'apl-panel-inner' }, ui.head, ui.tabs, ...Object.values(ui.panes), ui.live);
      ui.panel = h('aside', { class: 'apl-panel', 'aria-label': '탐구 안내' }, ui.panelInner);
      ui.main = h('main', { class: 'apl-main' }, ui.stage, ui.panel);
      document.body.append(h('div', { class: 'apl-app' }, bar, ui.main));
      attachStudentNavigation();

      // 보드
      const bd = d.board || {};
      this.board = new APLab.Board(ui.canvas, {
        kind: bd.kind || 'cartesian',
        focus: bd.focus,
        pad: bd.pad,
        aspect: bd.aspect, // 'free' = 가로·세로 배율을 따로(시간 그래프). 생략하면 1:1
        labelLayer: ui.labels,
        minZoom: bd.minZoom,
        maxZoom: bd.maxZoom,
        onInteract: (why) => {
          if (why === 'drag-start') this._tween = null;
          this.invalidate(why === 'drag' || why === 'drag-start' || why === 'drag-end');
          if (why === 'drag-end') this._saveHashSoon();
        },
        onDragState: (on) => { this.s.dragging = on; },
        onPanDrag: bd.orbit ? (dx, dy) => { this._tween = null; bd.orbit(this.s, dx, dy, this); this.invalidate(true); } : null
      });
      this.s.grid = bd.grid !== false;
      this._bindInk();
      window.addEventListener('apl:theme', () => { this.board.readTheme(); this.invalidate(true); });
      window.addEventListener('resize', () => { this._sizeInk(); this.invalidate(true); });
      // 화면 폭이 859/860px 경계를 넘거나 무대 폭이 바뀌면(패널 접기 포함) 조작부를 알맞은 자리로 다시 옮깁니다.
      const replace = () => requestAnimationFrame(() => this._placeControls());
      if (NARROW.addEventListener) NARROW.addEventListener('change', replace); else if (NARROW.addListener) NARROW.addListener(replace);
      this._orientHint();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(replace); // 글꼴이 늦게 바뀌어 칩 폭이 달라져도 다시 잽니다
      if (window.ResizeObserver) {
        this._stageW = 0;
        new ResizeObserver((es) => {
          const w = Math.round(es[0].contentRect.width);
          if (w === this._stageW) return;
          this._stageW = w;
          replace();
          this.invalidate(true);
        }).observe(ui.stage);
      }
    }
    /** 태블릿 세로(폭 700~859px, 세로 방향): 처음 열 때 「가로로 돌리면…」 한 줄 안내를 그림 바깥의 독립 행에 표시합니다.
     *  닫으면 localStorage 에 기억해 다시 띄우지 않고(저장이 막혀도 이번 화면에서는 닫힌 채), 가로로 돌리면 저절로 사라집니다. 휴대폰(700px 미만)·PC에는 나오지 않습니다. */
    _orientHint() {
      const mq = window.matchMedia('(min-width: 700px) and (max-width: 859px) and (orientation: portrait)');
      const KEY = 'orientHintOff';
      if (APLab.store.get(KEY, false) || !mq.matches) return;
      const el = h('div', { class: 'apl-orient-hint', role: 'status' },
        h('span', { class: 't', text: '가로로 돌리면 그림과 막대가 더 크게 보여요' }),
        h('button', { class: 'x', 'aria-label': '안내 닫기', title: '닫기', html: icon('x'), onclick: () => close(true) }));
      const close = (remember) => {
        el.remove();
        if (remember) APLab.store.set(KEY, true);
        if (mq.removeEventListener) mq.removeEventListener('change', onChange); else if (mq.removeListener) mq.removeListener(onChange);
      };
      const onChange = () => { if (!mq.matches) close(false); }; // 가로로 돌렸거나 다른 크기가 되면 사라집니다(기억은 하지 않음)
      if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
      this.ui.stage.insertBefore(el, this.ui.canvasWrap);
    }
    _syncThemeIcon() {
      this.ui.themeBtn.innerHTML = icon(APLab.theme.current() === 'paper' ? 'moon' : 'sun');
    }

    /* ======================= 장면 ======================= */
    get scene() {
      return this.list[this.index];
    }
    sceneCount() {
      return this.list.length;
    }
    goScene(i, opts = {}) {
      i = clamp(i, 0, this.list.length - 1);
      const prev = this.scene;
      this.index = i;
      const sc = this.scene;
      // Set the destination tab before measuring its geometry; otherwise the previous
      // scene's review/problem renderer can supply an unrelated focus box.
      if (!opts.keepTab || !this._tabAvailable(this.tab)) this.tab = 'explore';
      this.board.kind = sc.boardKind || (this.def.board || {}).kind || 'cartesian'; // 장면별 좌표계(선택): 한 실험실에 수학 좌표 장면과 도형 좌표 장면을 함께 둘 때
      this.s.part = null;
      this.s.revealed = false;
      this.s.playing = false;
      this._tween = null;
      this.s.step = sc.startStep != null ? sc.startStep : sc.steps ? 1 : 0;
      if (this.def.enter) this.def.enter(this.s, sc, this);
      if (sc.enter) sc.enter(this.s, this);
      // Explicit high-school opt-in: the baseline figure precedes any solution.
      if (this.def.stagedReveal) this.s.step = 0;
      const bd = this.def.board || {};
      this.board.aspect = (sc.aspect || bd.aspect) === 'free' ? 'free' : '1:1'; // 장면별 선택: 생략하면 board.aspect(기본 1:1)
      this.board.setPanes(call(sc.panes, this.s) || null);
      let focus = call(sc.focus, this.s) || call(bd.focus, this.s);
      if (!focus && (sc.autoFit || bd.autoFit)) focus = this._measureFocus(sc);
      if (focus) this.board.setFocus(focus, !opts.keepView);
      if (opts.params) this._applyParams(opts.params);
      this._timerStop();
      this._buildRail();
      this._buildPanel();
      this.invalidate(true);
      if (prev !== sc) this._announce(`장면 ${i + 1}: ${APLab.stripEmoji(sc.title)}`);
      this._saveHashSoon();
    }
    /** 장면을 재어서(그리지 않고) 도형과 라벨 전체가 들어오는 맞춤 범위를 정합니다. */
    _measureFocus(sc) {
      const b = this.board;
      const s = this.s;
      const v = (sc.view ? sc.view(s, this) : {}) || {};
      const run = () => b.measure(() => (sc.draw || this.def.draw)(b, s, v, this));
      let bb = run();
      if (!bb) return null;
      if (b.panes) {
        const w = bb.x1 - bb.x0, hgt = bb.y1 - bb.y0;
        const px = w * 0.1 + 46, py = hgt * 0.08 + 30;
        return { x: [bb.x0 - px, bb.x1 + px], y: [bb.y0 - py, bb.y1 + py] };
      }
      // 라벨은 화면 픽셀 크기라 배율이 바뀌면 세계 좌표 크기도 바뀝니다 → 맞춘 배율에서 한 번 더 재어 정확히 맞춥니다.
      const opts = { margin: 0.08, px: 12 };
      const keep = { focus: b.focus, zoom: b.zoom, panX: b.panX, panY: b.panY };
      Object.assign(b, { focus: b.fitBox(bb, opts), zoom: 1, panX: 0, panY: 0 });
      bb = run() || bb;
      Object.assign(b, keep);
      return b.fitBox(bb, opts);
    }
    _tabAvailable(id) {
      const sc = this.scene;
      if (id === 'explore') return true;
      if (id === 'review') return !!(sc.steps || sc.solution || sc.review || sc.reviewTab);
      if (id === 'problem') return !!sc.problem;
      return false;
    }

    /* ---------- 레일 (장면 탭) ---------- */
    _buildRail() {
      const rail = this.ui.rail;
      const grouped = this.groups.length > 1;
      const cur = this.scene;
      rail.innerHTML = '';
      const items = grouped
        ? this.groups.map((g, gi) => ({ label: g.short || g.title, full: g.title, n: gi + 1, on: cur.gi === gi, go: () => this.goScene(this.list.findIndex((x) => x.gi === gi && (g.defaultId ? x.id === g.defaultId : true))) }))
        : this.list.map((sc, i) => ({ label: sc.short || sc.title, full: sc.title, n: i + 1, on: i === this.index, go: () => this.goScene(i) }));
      items.forEach((it) => {
        const b = h('button', {
          class: 'apl-scene-tab', role: 'tab', 'aria-selected': String(it.on), title: APLab.stripEmoji(it.full),
          html: `<span class="n">${it.n}</span><span class="lbl">${APLab.renderMath(this._sf(APLab.esc(APLab.stripEmoji(it.label))))}</span>`,
          onclick: it.go
        });
        rail.append(b);
      });
      this._edgeFade(rail);
      // 지금 장면 탭이 가운데에 오도록 레일만 가로로 옮깁니다(페이지는 움직이지 않습니다). 글꼴이 늦게 바뀌어도 한 번 더 맞춥니다.
      const center = () => {
        const on = rail.querySelector('[aria-selected="true"]');
        if (!on) return;
        const max = rail.scrollWidth - rail.clientWidth;
        rail.scrollLeft = Math.max(0, Math.min(max, on.offsetLeft - rail.offsetLeft - (rail.clientWidth - on.offsetWidth) / 2));
        this._edgeFade(rail);
      };
      center();
      requestAnimationFrame(center);
    }

    /* 가로로 넘치는 줄(장면 탭·세부 장면)에서 "더 있다"를 보이도록 넘친 쪽 가장자리를 흐리게 합니다. */
    _edgeFade(el) {
      if (!el.__fade) {
        el.__fade = () => {
          const max = el.scrollWidth - el.clientWidth;
          el.classList.toggle('fade-l', max > 2 && el.scrollLeft > 2);
          el.classList.toggle('fade-r', max > 2 && el.scrollLeft < max - 2);
        };
        el.addEventListener('scroll', el.__fade, { passive: true });
        if (window.ResizeObserver) new ResizeObserver(el.__fade).observe(el);
      }
      el.__fade();
    }

    /* ---------- 패널 ---------- */
    _buildPanel() {
      const sc = this.scene;
      const ui = this.ui;
      const grouped = this.groups.length > 1;
      const g = sc.group;
      // 머리말
      this._removeSubs();
      ui.head.innerHTML = '';
      const pos = grouped
        ? `${sc.gi + 1}. ${APLab.stripEmoji(g.short || g.title)}`
        : `장면 ${this.index + 1}`;
      const cnt = grouped ? `${g.scenes.indexOf(g.scenes.find((x) => x.id === sc.id)) + 1} / ${g.scenes.length}` : `${this.index + 1} / ${this.list.length}`;
      ui.head.append(h('div', { class: 'apl-eyebrow', html: `${icon('compass')}<span>${APLab.renderMath(this._sf(APLab.esc(pos)))}</span><span class="count">${cnt}</span>` }));
      const tt = APLab.splitFlag(sc.title);
      ui.head.append(h('h2', { class: 'apl-scene-title', html: (tt.flag ? `<span class="apl-tag" style="--c:var(--m-rose);margin-right:6px;vertical-align:3px">${APLab.esc(tt.flag)}</span>` : '') + APLab.renderMath(this._sf(APLab.esc(tt.text), false)) }));
      if (grouped && g.scenes.length > 1) {
        const subs = h('div', { class: 'apl-subscenes', role: 'tablist', 'aria-label': '세부 장면' });
        g.scenes.forEach((x) => {
          const sp = APLab.splitFlag(x.short || x.title);
          const idx = this.list.findIndex((y) => y.gi === sc.gi && y.id === x.id);
          subs.append(h('button', { class: 'apl-chip' + (idx === this.index ? ' on' : ''), role: 'tab', 'aria-selected': String(idx === this.index), onclick: () => this.goScene(idx), html: (sp.flag ? `<span class="flag">${APLab.esc(sp.flag)}</span>` : '') + APLab.renderMath(this._sf(APLab.esc(sp.text))) }));
        });
        ui.head.append(subs);
        this._edgeFade(subs);
        this._subs = subs;
        this._subCount = h('span', { class: 'apl-sub-count', 'aria-hidden': 'true', text: cnt }); // 넓은 화면의 위 띠 끝에 붙는 「5 / 8」 위치 표시
      }
      this._questionText = null;
      if (sc.question) {
        // 휴대폰(859px 이하)에서는 제목 바로 아래 한 줄로 접혀 있다가 누르면 펼칩니다(apl.css). 넓은 화면은 예전처럼 카드입니다.
        const qe = h('div', { class: 'apl-question', html: `<small>탐구 질문</small><span class="q">${APLab.renderMath(call(sc.question, this.s))}</span>` });
        const flipQ = () => { if (NARROW.matches) qe.setAttribute('aria-expanded', String(qe.classList.toggle('open'))); };
        qe.addEventListener('click', flipQ);
        qe.addEventListener('keydown', (e) => { if (e.target === qe && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); flipQ(); } });
        ui.head.append(qe);
        this._questionText = qe.querySelector('.q');
      }
      // 탭
      ui.tabs.innerHTML = '';
      // 장면이 sc.tabs = { order: ['explore','problem','review'], labels: { review: '풀이' } } 를 주면 탭 순서·이름을 바꿉니다(선택 사항 · 생략하면 탐구·정리·문제).
      const tcfg = sc.tabs || {};
      const tabOrder = tcfg.order ? tcfg.order.map((id) => TABS.find((t) => t.id === id)).filter(Boolean) : TABS;
      const avail = tabOrder.filter((t) => this._tabAvailable(t.id));
      ui.tabs.hidden = avail.length < 2;
      for (const t of avail) {
        const n = t.id === 'review' && sc.steps ? `<span class="cnt">${call(sc.steps, this.s).length}단계</span>` : '';
        const lbl = (tcfg.labels && tcfg.labels[t.id]) || t.label;
        ui.tabs.append(h('button', { class: 'apl-tab', role: 'tab', 'aria-selected': String(this.tab === t.id), 'aria-controls': 'apl-pane-' + t.id, html: `${lbl}${n}`, onclick: () => this.setTab(t.id) }));
      }
      for (const t of TABS) ui.panes[t.id].hidden = this.tab !== t.id;
      this._buildExplore();
      this._buildReview();
      this._buildProblem();
      this._syncTabAttr();
      this._placeControls();
      this._dirtyPanel = true;
    }
    _removeSubs() {
      if (this._subs) this._subs.remove();
      if (this._subCount) this._subCount.remove();
      this._subs = this._subCount = null;
    }
    // 선택 사항: sc.tabs 를 쓰는 장면은 머리말에 data-tab 을 달아 탭마다 머리말 모양을 달리할 수 있게 합니다(실험실 자체 CSS가 이 속성에 기대므로 sc.tabs 가 없는 장면에는 달지 않습니다).
    //  - data-qfold: 문제 탭에서 '탐구 질문' 카드를 접습니다(탐구 탭에서 이미 읽은 글). 모든 장면의 기본값이며, 장면이 sc.tabs = { compact: false } 를 주면 접지 않습니다.
    //  - data-compact: sc.tabs = { compact: true } 를 준 장면만 휴대폰 문제 탭에서 그림 무대 높이도 줄입니다(apl.css).
    _syncTabAttr() {
      const h = this.ui.head;
      const t = (this.scene && this.scene.tabs) || null;
      if (t) h.dataset.tab = this.tab; else delete h.dataset.tab;
      if (t && t.compact) h.dataset.compact = '1'; else delete h.dataset.compact;
      if (this.tab === 'problem' && !(t && t.compact === false)) h.dataset.qfold = '1'; else delete h.dataset.qfold;
    }
    setTab(id) {
      if (!this._tabAvailable(id)) return;
      const was = this.tab;
      this.tab = id;
      // Opening the review board is the student's request for the first insight.
      // Switching tabs again never resets a later step or moves a parameter.
      if (this.def.stagedReveal && id === 'review' && this.s.step === 0) {
        const steps = call(this.scene.steps, this.s) || [];
        if (steps.length) this.s.step = 1;
      }
      this._syncTabAttr();
      APLab.$$('.apl-tab', this.ui.tabs).forEach((b) => b.setAttribute('aria-selected', String(b.getAttribute('aria-controls') === 'apl-pane-' + id)));
      for (const t of TABS) this.ui.panes[t.id].hidden = this.tab !== t.id;
      this._placeControls(); // 막대·고르기 칩은 탐구 탭에서만 보입니다(받침·띠를 숨기면 그림이 커집니다)
      if (id === 'problem' && was !== 'problem') this._autoSnap();
      this._fitPending = true;
      this.invalidate(true);
    }
    /** 문제 탭에 들어올 때 그림을 지문의 조건에 한 번 맞춥니다(「문제 조건으로 그림 맞추기」와 같은 동작). 학생이 탐구하던 상태 그대로의 그림과 지문이 어긋나 보이지 않게 합니다.
     *  장면이 thumbSnap: false 이거나 problem.autoSnap: false 이면 하지 않습니다. */
    _autoSnap() {
      const sc = this.scene;
      const pr = sc && sc.problem;
      if (!pr || !pr.snap || sc.thumbSnap === false || pr.autoSnap === false) return;
      this.s.playing = false;
      this.tween(call(pr.snap, this.s), 360);
    }

    /** 학생용 칸·칩 글 속 숫자·π·근호 분수를 쌓은 분수로 바꿉니다. */
    _sf(x, tight = true) { return this.def.stackFractions !== false ? APLab.stackFr(x, tight) : x; }
    // Plain labels are escaped before math rendering; rich HTML keeps its existing trusted markup.
    _label(x, tight = true) { return APLab.renderMath(this._sf(APLab.esc(x == null ? '' : String(x)), tight)); }
    _rich(x) { return this._sf(x, false); }

    _section(title, ico, ...kids) {
      return h('section', { class: 'apl-section' }, title ? h('h3', { class: 'apl-section-h', html: `<span>${icon(ico || 'info')}${this._label(title)}</span>` }) : null, ...kids);
    }

    _buildExplore() {
      const sc = this.scene;
      const pane = this.ui.panes.explore;
      pane.innerHTML = '';
      const r = (this.refs = {});
      // 안내
      r.guide = h('div', { class: 'apl-rich' });
      pane.append(h('div', { class: 'apl-card' }, h('div', { class: 'apl-guide' }, h('span', { class: 'badge', html: icon('hand') }), r.guide)));
      // 조작
      this._clearPlaced();
      r.controls = h('div', { class: 'apl-section apl-controls' });
      pane.append(r.controls);
      this._ctlIds = null;
      // 실시간 값
      r.alert = h('div', { hidden: true });
      r.readouts = h('div', { class: 'apl-readouts' });
      r.readSec = this._section('지금 보이는 값', 'spark', r.readouts);
      pane.append(r.alert, r.readSec);
      // 관찰 포인트
      r.parts = h('div', { class: 'apl-parts' });
      r.partSec = this._section('눌러서 그림에서 확인하기', 'target', r.parts);
      r.summary = h('div', { class: 'apl-summary', hidden: true });
      pane.append(r.partSec, r.summary);
    }

    /* 조작부(막대·고르기 칩·버튼)는 항상 refs.controls 상자 안에 먼저 지어 두고 _placeControls 가 화면 폭에 맞는 자리로 옮깁니다.
       860px 이상: 막대 → 무대 아래 받침(.apl-dock), 버튼 → 받침 끝, 고르기 칩 → 무대 위 띠(두 줄을 넘으면 패널의 「고르기」 칸).
       859px 이하: 예전처럼 패널 안(막대 → 칩 → 버튼). 세부 장면 칩은 어느 폭에서나 위 띠 첫 줄입니다. 아래 캐시·_ctls·_presetRow·_actionBtns 규칙은 그대로입니다. */
    _clearPlaced() {
      const L = this._lay;
      if (L) [...L.ctls, L.presets, L.presetsSec, L.acts].forEach((el) => el && el.remove());
      this._lay = null;
    }
    _buildControls() {
      const sc = this.scene;
      const box = this.refs.controls;
      const ids = call(sc.controls, this.s) || [];
      const presets = call(sc.presets, this.s) || [];
      const actions = call(sc.actions, this.s) || [];
      const key = JSON.stringify([ids, presets.map((p) => p.label), actions.map((a) => a.id + (a.label || ''))]);
      if (key === box.__ctlKey) return false; // 캐시 키는 조작부 상자에 붙입니다 → 상자를 새로 만드는 어떤 경로든 자동으로 다시 짓습니다
      box.__ctlKey = key;
      this._clearPlaced(); // 위 띠·받침으로 옮겨 둔 예전 조작부도 함께 치웁니다
      box.innerHTML = '';
      this._ctls = {};
      const L = (this._lay = { ctls: [], presets: null, presetsSec: null, acts: null, any: !!(ids.length || presets.length || actions.length) });
      for (const id of ids) {
        const p = this.params[id];
        if (!p) continue;
        const input = h('input', { type: 'range', class: 'apl-range', min: p.min, max: p.max, step: p.step || 0.01, value: this.s[id], 'aria-label': APLab.stripEmoji(p.label) });
        const out = h('output', {});
        const hint = p.hint
          ? h('div', { class: 'apl-ctl-hint' },
            h('span', { class: 't', html: APLab.renderMath(this._sf(p.hint)) }),
            h('span', { class: 'more', 'aria-hidden': 'true', html: '<span class="full">더보기</span><span class="less">접기</span>' + icon('down') }))
          : null;
        if (hint) {
          // 받침에서는 도움말이 한 줄로 줄어듭니다(넘치면 …). 잘린 칸만 _markHints 가 「더보기」 표시를 붙이고, 누르면 그 자리에서 펼쳐집니다.
          // 마우스를 올리면 전체 글이 title 로 뜹니다(내용은 지우지 않습니다).
          hint.title = String(p.hint).replace(/<[^>]+>/g, '').replace(/\$/g, '');
          const flip = () => {
            if (!hint.classList.contains('has-more')) return;
            hint.setAttribute('aria-expanded', String(hint.classList.toggle('open')));
          };
          hint.addEventListener('click', flip);
          hint.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
        }
        const wrap = h('div', { class: 'apl-ctl', style: { '--c': `var(--m-${p.color || 'amber'})` } },
          h('div', { class: 'apl-ctl-head' }, h('label', { html: APLab.renderMath(this._sf(p.label)) }), out),
          input,
          hint);
        input.addEventListener('input', () => {
          this._tween = null;
          this.s[id] = parseFloat(input.value);
          if (p.onInput) p.onInput(this.s, this);
          this.invalidate(true);
          this._saveHashSoon();
        });
        this._ctls[id] = { input, out, p };
        L.ctls.push(wrap);
      }
      if (presets.length) {
        const row = h('div', { class: 'apl-presets' });
        const groups = {};
        presets.forEach((pr) => {
          const gname = pr.group || '';
          if (!groups[gname]) {
            groups[gname] = true;
            if (gname) row.append(h('span', { class: 'ttl', text: gname }));
          }
          const b = h('button', { class: 'apl-chip', html: (pr.color ? `<span class="dot" style="--c:var(--m-${pr.color})"></span>` : '') + APLab.renderMath(APLab.esc(APLab.stripEmoji(pr.label))) });
          b.addEventListener('click', () => {
            if (pr.apply) pr.apply(this.s, this);
            if (pr.set) this.tween(pr.set, pr.ms);
            this.invalidate(true);
            this._saveHashSoon();
          });
          b.__isOn = pr.on;
          row.append(b);
        });
        L.presets = row;
        this._presetRow = row;
      } else this._presetRow = null;
      if (actions.length) {
        const row = h('div', { class: 'apl-actions-row' });
        this._actionBtns = actions.map((a) => {
          const b = h('button', { class: 'apl-btn' + (a.primary ? ' primary' : ''), html: (a.icon ? icon(a.icon) : '') + `<span>${APLab.esc(APLab.stripEmoji(call(a.label, this.s)))}</span>` });
          b.addEventListener('click', () => { a.run(this.s, this); this.invalidate(true); this._saveHashSoon(); });
          row.append(b);
          return { a, b };
        });
        L.acts = row;
      } else this._actionBtns = [];
      return true;
    }

    /** 조작부·세부 장면 칩을 지금 화면 폭과 탭에 맞는 자리에 놓습니다(폭이 바뀔 때마다 양쪽으로 다시 옮깁니다). */
    _placeControls() {
      const ui = this.ui;
      const r = this.refs;
      if (!r || !r.controls || !this.scene) return;
      const wide = !NARROW.matches;
      const explore = this.tab === 'explore';
      const box = r.controls;
      // 접힌 탐구 질문(휴대폰)은 누를 수 있는 단추로, 넓은 화면에서는 보통 글로 되돌립니다.
      const qe = ui.head.querySelector('.apl-question');
      if (qe) {
        if (wide) { qe.removeAttribute('role'); qe.removeAttribute('tabindex'); qe.removeAttribute('aria-expanded'); qe.classList.remove('open'); }
        else { qe.setAttribute('role', 'button'); qe.tabIndex = 0; qe.setAttribute('aria-expanded', String(qe.classList.contains('open'))); }
      }
      const L = this._lay;
      const subs = this._subs;
      // 막대가 4개 이상인 장면의 탐구 탭: 휴대폰(859px 이하)에서 그림 무대를 낮춰 막대가 한 화면에 더 많이 보이게 합니다(apl.css의 data-many-ctl).
      // 막대 수가 장면 상태에 따라 바뀌어도(sc.controls 가 함수) 조작부를 다시 지을 때마다 이 함수가 불리므로 다시 셉니다.
      if (explore && L && L.ctls.length >= 4) ui.head.dataset.manyCtl = '1'; else delete ui.head.dataset.manyCtl;
      // 세부 장면 칩: 모든 폭에서 위 띠 첫 줄에 둡니다(2026-11-03 선생님 결정. 이유: 휴대폰에서 첫 막대가 약 60px 올라오고 지금 장면이 그림 바로 위에 보인다).
      // 같은 요소를 다시 옮기면 가로 위치·초점이 풀리므로 이미 띠 안에 있으면 건드리지 않습니다. 띠에 줄이 있으면 head 에 data-subnav 를 달아 휴대폰 CSS가 패널의 장면 제목 카드를 뺍니다.
      if (subs) {
        if (subs.parentNode !== ui.topNav) ui.topNav.append(subs, this._subCount);
        ui.head.dataset.subnav = '1';
      } else delete ui.head.dataset.subnav;
      ui.topNav.hidden = !subs;
      ui.topPick.hidden = true;
      ui.dock.hidden = true;
      if (L) {
        if (wide) {
          // 막대 → 받침 격자, 버튼 → 격자의 마지막 칸(= 받침 끝. 빈 칸이 있으면 거기에 들어가 높이를 아낍니다)
          ui.dockCtls.dataset.n = String(L.ctls.length + (L.acts ? 1 : 0));
          L.ctls.forEach((el) => ui.dockCtls.append(el));
          if (L.acts) ui.dockCtls.append(L.acts);
          ui.dockCtls.hidden = !(L.ctls.length || L.acts);
          ui.dock.hidden = !explore || !(L.ctls.length || L.acts);
          // 고르기 칩 → 위 띠 둘째 줄. 실제 높이를 재서 두 줄을 넘으면 묶음 통째로 패널의 「고르기」 칸으로 보냅니다(쪼개지 않습니다).
          if (L.presets) {
            if (L.presetsSec) L.presetsSec.remove();
            ui.topPick.append(L.presets);
            if (explore) {
              ui.top.hidden = false;
              ui.topPick.hidden = false;
              if (ui.topPick.scrollHeight > ui.topPick.clientHeight + 1) {
                ui.topPick.hidden = true;
                if (!L.presetsSec) L.presetsSec = this._section('고르기', 'target', L.presets);
                else L.presetsSec.append(L.presets);
                box.append(L.presetsSec);
              }
            }
          }
          box.hidden = !box.childElementCount;
        } else {
          if (L.presetsSec) L.presetsSec.remove();
          L.ctls.forEach((el) => box.append(el));
          if (L.presets) box.append(L.presets);
          if (L.acts) box.append(L.acts);
          box.hidden = !L.any;
        }
      }
      ui.top.hidden = ui.topNav.hidden && ui.topPick.hidden;
      if (subs) this._centerSub();
      this._markHints();
    }
    /** 받침에서 한 줄로 잘린 막대 도움말에만 「더보기」 표시를 붙입니다(터치 화면은 마우스 title 을 볼 수 없어서). 폭이 바뀔 때마다 다시 잽니다. */
    _markHints() {
      const L = this._lay;
      if (!L) return;
      const measure = !NARROW.matches && !this.ui.dock.hidden;
      for (const wrap of L.ctls) {
        const hint = wrap.querySelector('.apl-ctl-hint');
        if (!hint) continue;
        const open = hint.classList.contains('open');
        let more = false;
        if (measure) {
          if (open) more = true; // 펼친 칸은 접을 수 있게 표시를 그대로 둡니다
          else {
            hint.classList.remove('has-more'); // 표시가 없는 상태의 폭으로 잽니다
            const t = hint.firstElementChild;
            more = t.scrollWidth > t.clientWidth + 1;
          }
        } else hint.classList.remove('open');
        hint.classList.toggle('has-more', more);
        if (more) { hint.setAttribute('role', 'button'); hint.tabIndex = 0; hint.setAttribute('aria-expanded', String(hint.classList.contains('open'))); }
        else { hint.removeAttribute('role'); hint.removeAttribute('tabindex'); hint.removeAttribute('aria-expanded'); }
      }
    }
    /** 지금 장면 칩이 줄 안에서 늘 보이도록 줄만 가로로 옮깁니다(페이지는 움직이지 않습니다). */
    _centerSub() {
      const el = this._subs;
      if (!el) return;
      const on = el.querySelector('.apl-chip.on');
      if (!on) return;
      const max = el.scrollWidth - el.clientWidth;
      el.scrollLeft = Math.max(0, Math.min(max, on.offsetLeft - el.offsetLeft - (el.clientWidth - on.offsetWidth) / 2));
      this._edgeFade(el);
    }

    _buildReview() {
      const sc = this.scene;
      const pane = this.ui.panes.review;
      const r = this.refs;
      const steps = call(sc.steps, this.s);
      const stepsSig = JSON.stringify(steps || null);
      this._syncSolutionDisclosure();
      // Preserve an explicitly opened explanation only while its content is unchanged.
      // New numerical givens must not inherit the previous question's reveal action.
      const keepOpen = r.stepsSig === stepsSig;
      const openSol = Array.from(pane.querySelectorAll('details.apl-acc')).map((d) => keepOpen && d.open);
      pane.innerHTML = '';
      r.stepsSig = stepsSig;
      const rt = sc.reviewTitles || {}; // 선택 사항: { steps, solution } 소제목 바꾸기
      r.top = null;
      if (sc.reviewTop) { r.top = h('div', { class: 'apl-section apl-review-top' }); r.top.__h = null; pane.append(r.top); } // 선택 사항: 풀이 탭 맨 위에 문제 다시 보기
      if (steps && steps.length) {
        r.steps = h('div', { class: 'apl-steps' });
        r.stepPrev = h('button', { class: 'apl-btn sm apl-step-prev', html: icon('prev') + '<span>이전</span>', onclick: () => this.stepBy(-1) });
        r.stepNext = h('button', { class: 'apl-btn sm primary apl-step-next', html: '<span>다음 단계</span>' + icon('next'), onclick: () => this._stepNextClick() });
        r.stepAll = h('button', { class: 'apl-btn sm ghost apl-step-all', text: '모두 보기', onclick: () => this.setStep(steps.length) });
        // 마지막 단계에서만 보입니다(문제 탭에 '새 문제' 단추가 있는 장면): 문제 탭으로 가서 새 문제를 바로 냅니다.
        r.stepNew = h('button', { class: 'apl-btn sm apl-step-new', hidden: true, text: '새 문제', onclick: () => this._newProblemFromReview() });
        r.stepCtl = h('div', { class: 'apl-step-ctl' }, r.stepPrev, r.stepNext, r.stepAll, r.stepNew);
        r.nextMode = 'step';
        pane.append(this._section(rt.steps || '단계별로 그림에 나타내기', 'layers', r.steps, r.stepCtl));
        steps.forEach((t, i) => {
          // A future step is an explicit reveal action; its conclusion must not be in the visible or accessible button text yet.
          const b = h('button', { class: 'apl-step', html: `<span class="n">${i + 1}</span><span class="apl-step-body"></span>`, onclick: () => this.setStep(i + 1) });
          b.__stepHTML = APLab.renderMath(APLab.esc(String(t).replace(/^Step\s*\d+\s*·\s*/, '')).replace(/&amp;/g, '&'));
          r.steps.append(b);
        });
      } else { r.steps = null; r.stepCtl = r.stepNew = null; }
      r.formula = h('div', { class: 'apl-rich' });
      r.formulaSec = this._section('공식과 원리', 'book', h('div', { class: 'apl-card' }, r.formula));
      r.rule = h('div', { hidden: true });
      pane.append(r.formulaSec, r.rule);
      const sol = sc.solution;
      r.solution = h('div', { class: 'apl-section' });
      if (sol) {
        const mk = (key, title, tag, tone, open) => {
          if (!sol[key]) return null;
          const body = h('div', { class: 'apl-acc-body' });
          const det = h('details', { class: 'apl-acc' + (open ? '' : ''), ...(open ? { open: true } : {}) },
            h('summary', { html: `<span class="apl-tag" style="--c:var(--m-${tone})">${this._label(tag)}</span><span>${this._label(title)}</span>${icon('down', 'apl-ico chev')}` }), body);
          det.addEventListener('toggle', () => { if (det.open) this._fillSolution(body, sol[key]); });
          if (open) this._fillSolution(body, sol[key]);
          return det;
        };
        r.solution.append(...[
          h('h3', { class: 'apl-section-h', html: `<span>${icon('bulb')}${this._label(rt.solution || '두 가지 풀이 비교')}</span>` }),
          mk('standard', sol.standardTitle || '기본 풀이', sol.standardTag || '기본', 'sky', false),
          mk('quick', sol.quickTitle || '빠른 풀이 · 핵심 원리', sol.quickTag || '핵심', 'amber', false)].filter(Boolean)); // 한쪽 풀이만 있으면 빈 칸(null)을 붙이지 않습니다
        pane.append(r.solution);
      }
      Array.from(pane.querySelectorAll('details.apl-acc')).forEach((d, i) => { if (openSol[i]) d.open = true; });
      r.notes = h('div', { class: 'apl-rich' });
      r.notesSec = this._section(sc.notesTitle || this.def.notesTitle || '시험에서 자주 틀리는 부분', 'alert', h('div', { class: 'apl-card soft' }, r.notes));
      pane.append(r.notesSec);
      this._syncReviewSteps();
      this._syncSolutionDisclosure();
    }
    _syncReviewSteps() {
      const r = this.refs;
      if (!r.steps) return;
      Array.from(r.steps.children).forEach((el, i) => {
        const open = i < this.s.step;
        el.classList.toggle('done', open);
        el.classList.toggle('cur', i === this.s.step - 1);
        el.setAttribute('aria-expanded', String(open));
        if (open) el.removeAttribute('aria-label');
        else el.setAttribute('aria-label', `${i + 1}단계 열기`);
        APLab.setHTML(el.children[1], open ? el.__stepHTML : '선택하면 이 단계의 풀이가 열립니다.');
      });
    }
    _syncSolutionDisclosure() {
      const section = this.refs.solution;
      if (!section) return;
      section.hidden = !!this.def?.stagedReveal && !this._answerOpen();
      if (section.hidden) {
        section.querySelectorAll('details.apl-acc[open]').forEach(detail => {
          detail.open = false;
          const body = detail.querySelector('.apl-acc-body');
          if (body) body.innerHTML = '';
        });
        return;
      }
      section.querySelectorAll('details.apl-acc[open]').forEach((detail) => {
        const body = detail.querySelector('.apl-acc-body');
        if (!body || !body.__solutionSource) return;
        // Evaluate only an explanation the student already chose to open.
        const current = JSON.stringify(call(body.__solutionSource, this.s) || {});
        if (current !== body.__solutionSig) {
          detail.open = false;
          body.innerHTML = '';
        }
      });
    }
    _fillSolution(body, src) {
      const v = call(src, this.s) || {};
      body.__solutionSource = src;
      body.__solutionSig = JSON.stringify(v);
      body.innerHTML = '';
      if (v.steps) body.append(h('div', { class: 'apl-rich', html: APLab.renderMath(this._sf(v.steps, false)) }));
      const note = v.warning || v.highlight || v.note;
      if (note) body.append(h('div', { class: 'apl-callout', 'data-tone': v.warning ? 'warn' : 'key', html: icon(v.warning ? 'alert' : 'bulb') + `<div>${APLab.renderMath(this._sf(APLab.cleanLead(note), false))}</div>` }));
    }

    _buildProblem() {
      const sc = this.scene;
      const pane = this.ui.panes.problem;
      pane.innerHTML = '';
      const pr = sc.problem;
      const r = this.refs;
      r.problemTag = null;
      if (!pr) return;
      const meta = h('div', { class: 'apl-problem-meta' });
      if (pr.tag) {
        r.problemTag = h('span', { class: 'apl-tag', style: { '--c': 'var(--m-amber)' }, html: icon('flag') + APLab.renderMath(APLab.esc(APLab.stripEmoji(call(pr.tag, this.s)))) });
        meta.append(r.problemTag);
      }
      r.timerBtn = null;
      const secs = pr.time ? parseInt(String(call(pr.time, this.s)).replace(/[^\d]/g, ''), 10) : 0;
      if (secs) {
        r.timerBtn = h('button', { class: 'apl-btn sm apl-timer', html: icon('clock') + `<span>도전 ${secs}초</span>`, title: '목표 시간 안에 풀어 보는 도전 타이머', onclick: () => this._timerToggle(secs) });
        meta.append(r.timerBtn);
      }
      r.problemText = h('div', { class: 'apl-problem-text' });
      r.answer = pr.noAnswer ? null : h('div', { class: 'apl-answer' }); // pr.noAnswer: 잠긴 정답 칸을 만들지 않습니다(문제 글이 정답 보기 단추를 직접 둡니다)
      const snapBtn = pr.snap ? h('button', { class: 'apl-btn block', html: icon('target') + '<span>문제 조건으로 그림 맞추기</span>', onclick: () => this.snap() }) : null;
      pane.append(h('div', { class: 'apl-card apl-problem' }, meta, r.problemText, snapBtn, r.answer));
      if (pr.note) pane.append(h('div', { class: 'apl-note-line', html: APLab.renderMath(call(pr.note, this.s)) }));
    }
    /* ---------- '새 문제' 단추 통일 + 정리 탭 끝단계 연결 (2026-11 출시 전 비평 반영) ----------
       실험실마다 '새 문제'·'새 문제 (숫자 바꾸기)'·'숫자 바꾸기'로 달리 쓰던 단추를 문제 탭에서 모두 '새 문제'로 통일하고 같은 보통 단추 모양(apl-newprob)으로 맞춥니다.
       단추의 동작은 실험실 자신의 것(보통 data-xx-new 이벤트)이라 바꾸지 않습니다. 정리 탭 끝단계가 이 단추를 click()으로 불러 '새 문제'를 냅니다(공통 훅 = 문제 탭 안의 .apl-newprob).
       대상: 문제 탭 전체와 정리 탭 맨 위 '문제 다시 보기'(sc.reviewTop). 탐구 탭의 '숫자 바꿔 보기'(탐구 그림 숫자만 바꿈)는 하는 일이 달라 건드리지 않습니다. */
    _normNewProb() {
      const NAME = /^(새 문제(\s*\(숫자 바꾸기\))?|숫자 바꾸기)$/;
      const roots = [this.ui.panes.problem, this.refs.top].filter(Boolean);
      let changed = false;
      for (const root of roots) {
        root.querySelectorAll('button').forEach((b) => {
          if (!NAME.test((b.textContent || '').replace(/\s+/g, ' ').trim())) return;
          const walker = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
          for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            if (n.nodeValue.trim() && n.nodeValue.trim() !== '새 문제') { n.nodeValue = '새 문제'; changed = true; }
          }
          if (!b.classList.contains('apl-newprob')) { b.classList.add('apl-newprob'); b.classList.remove('ghost'); changed = true; }
        });
      }
      return changed;
    }
    _newProbBtn() { return this.ui.panes.problem.querySelector('button.apl-newprob'); }
    // 정리 탭 마지막 단계: 주 단추를 '문제로 가서 정답 확인'으로 바꾸고, 문제 탭에 '새 문제'가 있으면 옆에 둡니다. 문제 탭이 없으면 예전 그대로(비활성 '다음 단계').
    _syncEndStep() {
      const r = this.refs;
      if (!r.steps || !r.stepNext) return;
      const steps = call(this.scene.steps, this.s) || [];
      const end = this.s.step >= steps.length && this._tabAvailable('problem');
      const mode = end ? 'problem' : 'step';
      if (r.nextMode !== mode) {
        r.nextMode = mode;
        r.stepNext.innerHTML = end ? icon('target') + '<span>문제로 가서 정답 확인</span>' : '<span>다음 단계</span>' + icon('next');
        r.stepCtl.classList.toggle('end', end);
      }
      if (r.stepNew) r.stepNew.hidden = !(end && this._newProbBtn());
    }
    _stepNextClick() {
      if (this.refs.nextMode === 'problem') {
        this.setTab('problem');
        window.scrollTo({ top: 0 });
        // 문제 탭으로 옮긴 뒤(그리기가 끝난 다음) 열린 정답 상자가 화면 안에 오도록 스크롤합니다. 정답 상자가 없는 장면은 맨 위 그대로입니다.
        requestAnimationFrame(() => requestAnimationFrame(() => this._showAnswer()));
        return;
      }
      this.stepBy(1);
    }
    // 문제 카드가 화면에 들어가면 카드 맨 위(문제 글과 정답이 함께 보임)로, 너무 길면 정답 상자가 온전히 보이도록 옮깁니다. 가로 폭이 좁으면 고정된 그림 무대 아래를 위쪽 한계로 씁니다.
    _showAnswer() {
      const r = this.refs;
      if (this.tab !== 'problem' || !r.answer || !r.answer.classList.contains('open')) return;
      const vh = window.innerHeight;
      const topLim = (NARROW.matches ? this.ui.stage.getBoundingClientRect().bottom : 60) + 8;
      const card = r.answer.closest('.apl-problem');
      const cr = card ? card.getBoundingClientRect() : null;
      const ar = r.answer.getBoundingClientRect();
      let dy;
      if (cr && cr.height <= vh - topLim - 16) dy = cr.top - topLim;
      else dy = ar.bottom - (vh - 16);
      if (dy > 1 || dy < -1) window.scrollBy({ top: dy, behavior: 'instant' });
    }
    _newProblemFromReview() {
      const b = this._newProbBtn();
      this.setTab('problem');
      if (b) b.click();
      window.scrollTo({ top: 0 });
    }
    _answerOpen() {
      const steps = call(this.scene.steps, this.s);
      if (this.def?.stagedReveal) return this.s.revealed || !!steps?.length && this.s.step >= steps.length;
      return this.s.revealed || !steps || this.s.step >= steps.length;
    }

    /* ======================= 단계 ======================= */
    setStep(n) {
      const steps = call(this.scene.steps, this.s) || [];
      this.s.step = clamp(n, 0, steps.length);
      if (this.def?.stagedReveal && this.s.step === 0) this.s.revealed = false;
      this.invalidate(true);
      this._saveHashSoon();
    }
    stepBy(d) {
      const steps = call(this.scene.steps, this.s) || [];
      const n = this.s.step + d;
      if (n > steps.length || n < 0) return false;
      this.setStep(n);
      if (this.teach) this._announce(`단계 ${this.s.step}`);
      return true;
    }

    /* ======================= 값 변경 / 애니메이션 ======================= */
    set(patch, render = true) {
      Object.assign(this.s, patch);
      if (render) this.invalidate(true);
      this._saveHashSoon();
    }
    _applyParams(obj) {
      for (const [k, v] of Object.entries(obj)) {
        if (k in this.params) this.s[k] = clamp(+v, this.params[k].min, this.params[k].max);
        else this.s[k] = v;
      }
    }
    /** 값들을 부드럽게 목표값으로 이동 (문제 조건 맞추기·프리셋) */
    tween(target, ms = 520) {
      const from = {};
      const to = {};
      for (const [k, v] of Object.entries(target)) {
        if (typeof v === 'number' && typeof this.s[k] === 'number') { from[k] = this.s[k]; to[k] = v; }
        else this.s[k] = v;
      }
      this._tween = { from, to, t0: performance.now(), ms };
      this._loop();
    }
    snap() {
      const pr = this.scene.problem;
      if (!pr || !pr.snap) return;
      this.s.playing = false;
      this.tween(call(pr.snap, this.s));
      APLab.toast('문제의 조건으로 그림을 맞췄습니다');
    }
    zoom(f) {
      this.board.zoomAt(f);
      this.invalidate();
    }
    fitView() {
      this.board.fit();
      this.invalidate();
    }

    /* ======================= 렌더 루프 ======================= */
    invalidate(panel) {
      if (panel) this._dirtyPanel = true;
      if (!this._raf) this._raf = requestAnimationFrame((t) => this._frame(t));
    }
    _loop() {
      this.invalidate(true);
    }
    _frame(t) {
      this._raf = 0;
      const dt = this._last ? Math.min(0.05, (t - this._last) / 1000) : 0.016;
      this._last = t;
      let again = false;
      if (this._tween) {
        const tw = this._tween;
        const p = clamp((t - tw.t0) / tw.ms, 0, 1);
        const e = easeOut(p);
        for (const k of Object.keys(tw.to)) this.s[k] = tw.from[k] + (tw.to[k] - tw.from[k]) * e;
        if (p >= 1) { this._tween = null; this._saveHashSoon(); } else again = true;
        this._dirtyPanel = true;
      }
      const sc = this.scene;
      const tick = sc.tick || this.def.tick;
      if (tick && !this.s.dragging) {
        if (tick(this.s, dt, this)) { again = true; this._dirtyPanel = true; }
      }
      const panelDirty = this._dirtyPanel;
      this.render();
      if (panelDirty || this._fitPending) this._fitProblemStage();
      if (again) this.invalidate();
      else this._last = 0;
    }
    /** 휴대폰 문제 탭: 탐구 질문 카드를 접어도 문제 글이 화면 아래쪽(약 480px 아래)에서 시작하면
     *  그림 무대를 낮춥니다(54svh → 42svh). 보기가 ①만 보이던 문제를 3개 이상 보이게 하려는 것입니다. 실험실별 설정 없이 쓰며, 글이 이미 위쪽에서 시작하면 무대는 그대로입니다. */
    _fitProblemStage() {
      this._fitPending = false;
      const head = this.ui.head;
      if (this.tab !== 'problem' || !window.matchMedia('(max-width: 859px)').matches) { delete head.dataset.tight; return; }
      const pt = this.refs && this.refs.problemText;
      if (!pt || !pt.isConnected || !pt.checkVisibility()) { delete head.dataset.tight; return; }
      delete head.dataset.tight;
      const limit = Math.min(480, window.innerHeight * 0.58); // 문제 글이 화면 아래쪽 40%에서 시작하면 그림 무대를 낮춰 글과 보기 3개 이상이 첫 화면에 오게 합니다
      if (pt.getBoundingClientRect().top + window.scrollY > limit) head.dataset.tight = '1';
    }
    render() {
      const sc = this.scene;
      const b = this.board;
      const s = this.s;
      if (sc.panes) b.setPanes(call(sc.panes, s) || null);
      const v = (sc.view ? sc.view(s, this) : this.def.view ? this.def.view(s, sc, this) : {}) || {};
      this.v = v;
      b.begin({ emph: this._emph() });
      const draw = sc.draw || this.def.draw;
      try {
        if (draw) draw(b, s, v, this);
      } catch (e) {
        console.error(e);
        b.stext(b.W / 2, b.H / 2, '이 장면을 그리는 중 오류가 발생했습니다.', { color: 'red', size: 14 });
      }
      b.end();
      this._drawInk();
      this._renderStage(v);
      if (this._dirtyPanel) {
        this._dirtyPanel = false;
        this._renderPanel(v);
      }
    }
    _emph() {
      if (this._hoverRef) return { ref: this._hoverRef };
      if (this.s.part != null) return { part: this.s.part, ref: this.s.part };
      return null;
    }

    _stageInsets() {
      const ui = this.ui, narrow = NARROW.matches;
      const presH = ui.presenter.hidden ? 0 : ui.presenter.offsetHeight + 22;
      // 중등 실험실에서는 조건·꼭짓점·설명이
      // 오른쪽 아래 도구 막대와 겹치지 않게 실제 막대 높이만큼 배치 영역을 비웁니다.
      // 고등 실험실의 기존 배치는 유지합니다.
      const middle = /^g[789]-/.test(this.id);
      return {
        top: ui.chips.childElementCount ? ui.chips.offsetHeight + 18 : 0,
        right: narrow ? 0 : 16,
        bottom: narrow ? Math.max(Math.max(ui.tools.offsetHeight, Math.min(ui.tr.offsetHeight, 60)) + 14, presH)
          : middle ? presH + ui.tools.offsetHeight + 14 : presH
      };
    }

    _renderStage(v) {
      const ui = this.ui;
      // 수식 칩
      // answer:true 로 표시한 칩·띠는 문제 탭에서 숨깁니다(답이나 중간값이 그림 옆에 찍히지 않게). 탐구·정리 탭에서는 그대로 보입니다.
      const inProblem = this.tab === 'problem';
      const chips = (v.chips || []).filter((c) => !(inProblem && c.answer));
      const key = JSON.stringify(chips);
      if (key !== this._chipKey) {
        this._chipKey = key;
        ui.chips.innerHTML = '';
        if (chips.length) {
          const box = h('div', { class: 'apl-formula-chip apl-glass' });
          chips.forEach((c, i) => {
            if (i) box.append(h('span', { class: 'sep' }));
            box.append(h('span', { html: (c.k ? `<span class="k">${this._label(c.k)}</span> ` : '') + `<span style="color:${c.color ? `var(--m-${c.color})` : 'inherit'}">${c.tex ? APLab.tex(c.tex) : APLab.renderMath(this._rich(c.html || ''))}</span>` }));
          });
          ui.chips.append(box);
        }
      }
      // 상태
      // 상태 배지는 탐구용 실시간 결과(답·판정이 찍힐 수 있음)이므로 문제 탭에서는 숨깁니다. 장면이 sc.tabs = { status: true } 를 주면 문제 탭에서도 보입니다.
      const st = inProblem && !(this.scene.tabs && this.scene.tabs.status) ? null : v.status;
      ui.status.hidden = !st;
      if (st) {
        const sk = st.tone + '|' + st.text;
        if (sk !== this._stKey) {
          this._stKey = sk;
          ui.status.dataset.tone = st.tone || 'info';
          ui.status.innerHTML = icon(TONE_ICON[st.tone] || 'info') + `<span>${this._label(APLab.stripEmoji(st.text))}</span>`;
        }
      }
      // 장면별로 학생이 먼저 볼 핵심 팁을 짧게 보여줍니다.
      ui.studentTip.hidden = !v.tip;
      if (v.tip && ui.studentTipBody.textContent !== v.tip) { ui.studentTip.open = false; ui.studentTipBody.textContent = v.tip; }
      // 떠 있는 카드
      const card = v.card;
      ui.card.hidden = !card;
      if (card) {
        const ck = JSON.stringify(card);
        if (ck !== this._cardKey) {
          this._cardKey = ck;
          const min = this._cardMin != null ? this._cardMin : this.board.W < 640;
          ui.card.classList.toggle('min', min);
          ui.card.innerHTML = '';
          const tg = h('button', { 'aria-label': '카드 접기/펴기', html: icon(min ? 'down' : 'x') });
          tg.addEventListener('click', () => { this._cardMin = !ui.card.classList.contains('min'); this._cardKey = ''; this.invalidate(); });
          ui.card.append(h('h4', {}, h('span', { html: this._label(APLab.stripEmoji(card.title)) }), tg),
            h('ul', {}, ...(card.lines || []).map((l) => h('li', { style: { '--c': l.color ? this.board.color(l.color) : '' }, html: this._label(APLab.stripEmoji(l.text)) }))));
        }
      }
      // 테이프
      const tape = inProblem && v.tape && v.tape.answer ? null : v.tape;
      ui.tape.hidden = !tape;
      if (tape) {
        const tk = JSON.stringify(tape);
        if (tk !== this._tapeKey) {
          this._tapeKey = tk;
          ui.tape.innerHTML = '';
          ui.tape.append(h('div', { class: 'apl-tape-title', html: this._label(APLab.stripEmoji(tape.title || '')) }));
          if (tape.segments && tape.segments.length) {
            const bar = h('div', { class: 'apl-tape-bar' });
            tape.segments.forEach((sg) => bar.append(h('span', { style: { flexGrow: String(Math.max(0.06, sg.weight || 1)), '--c': this.board.color(sg.color) }, title: /\$/.test(sg.text) ? '' : sg.text, html: this._label(APLab.stripEmoji(sg.text)) })));
            ui.tape.append(bar);
          }
          requestAnimationFrame(() => this.board.resize() && this.invalidate());
        }
      }
      // 발표 막대
      this._renderPresenter();
      this.ui.gridBtn.classList.toggle('on', !!this.s.grid);
      // 무대 위 칩·배지·도구·발표 막대가 차지한 가장자리는 도형 배치에서 비워 둡니다(그림을 가리지 않도록).
      // 도구 막대는 어느 화면 폭에서나 그림 영역 아래 가장자리의 가로 한 줄입니다(넓은 화면은 오른쪽 아래 모서리, 좁은 화면은 상태 배지(왼쪽)와 한 줄).
      // 그래서 오른쪽은 비우지 않아 그림이 가로 폭을 다 씁니다. 수업 모드 발표 막대가 떠 있으면 넓은 화면에서는 도구 막대가 그 위로 올라갑니다.
      const presH = ui.presenter.hidden ? 0 : ui.presenter.offsetHeight + 22;
      const ins = this._stageInsets();
      ui.canvasWrap.style.setProperty('--tools-w', ui.tools.offsetWidth + 'px');
      ui.canvasWrap.style.setProperty('--pres-h', presH + 'px');
      if (['top', 'right', 'bottom'].some((k) => Math.abs(ins[k] - this.board.insets[k]) > 2)) {
        this.board.setInsets(ins);
        this.invalidate();
      }
    }

    _renderPanel(v) {
      const sc = this.scene;
      const r = this.refs;
      const s = this.s;
      if (this._questionText && typeof sc.question === 'function') APLab.setHTML(this._questionText, APLab.renderMath(call(sc.question, s)));
      // 안내
      const guide = v.guide != null ? v.guide : call(sc.guide, s);
      APLab.setHTML(r.guide, this._rich(guide || '그림의 <b>후광이 있는 점</b>을 끌거나 조절 막대를 움직여 보세요.'));
      // 조작부
      if (this._buildControls()) this._placeControls();
      for (const [id, c] of Object.entries(this._ctls || {})) {
        const val = s[id];
        if (document.activeElement !== c.input) c.input.value = val;
        const pct = ((val - c.p.min) / (c.p.max - c.p.min)) * 100;
        c.input.style.setProperty('--p', clamp(pct, 0, 100) + '%');
        APLab.setHTML(c.out, this._sf(APLab.esc(c.p.format ? c.p.format(val, s) : APLab.fmt(val))));
      }
      if (this._presetRow) APLab.$$('.apl-chip', this._presetRow).forEach((b) => { if (b.__isOn) b.classList.toggle('on', !!b.__isOn(s)); });
      for (const { a, b } of this._actionBtns || []) {
        const lbl = APLab.stripEmoji(call(a.label, s));
        const ic = call(a.icon, s);
        const html = (ic ? icon(ic) : '') + `<span>${APLab.renderMath(this._sf(APLab.esc(lbl)))}</span>`;
        if (b.__h !== html) { b.__h = html; b.innerHTML = html; }
        if (a.on) b.classList.toggle('on', !!a.on(s));
      }
      // 경고
      const al = v.alert;
      r.alert.hidden = !al;
      if (al) {
        const html = `<div class="apl-callout" data-tone="${al.tone || 'warn'}">${icon(TONE_ICON[al.tone || 'warn'])}<div>${APLab.renderMath(this._rich(APLab.cleanLead(al.text)))}</div></div>`;
        if (r.alert.__h !== html) { r.alert.__h = html; r.alert.innerHTML = html; }
      }
      // 실시간 값
      const reads = v.readouts || [];
      r.readSec.hidden = !reads.length;
      if (reads.length) {
        if (r.readouts.childElementCount !== reads.length || r.readouts.__sig !== reads.map((x) => x.label).join('|')) {
          r.readouts.__sig = reads.map((x) => x.label).join('|');
          r.readouts.innerHTML = '';
          reads.forEach((x) => {
            const el = h('div', { class: 'apl-read' + (x.wide ? ' wide' : ''), tabindex: x.ref ? '0' : null },
              h('span', { class: 'k' }), h('span', { class: 'v' }), h('span', { class: 'n' }));
            if (x.ref) {
              el.dataset.ref = x.ref;
              const on = () => { this._hoverRef = x.ref; this.invalidate(); };
              const off = () => { if (this._hoverRef === x.ref) { this._hoverRef = null; this.invalidate(); } };
              el.addEventListener('pointerenter', on);
              el.addEventListener('pointerleave', off);
              el.addEventListener('focus', on);
              el.addEventListener('blur', off);
            }
            r.readouts.append(el);
          });
        }
        reads.forEach((x, i) => {
          const el = r.readouts.children[i];
          el.style.setProperty('--c', x.color ? `var(--m-${x.color})` : 'var(--text)');
          APLab.setHTML(el.children[0], this._label(APLab.stripEmoji(x.label)));
          APLab.setHTML(el.children[1], this._label(x.value == null ? '' : String(x.value)));
          APLab.setHTML(el.children[2], this._label(x.note || ''));
          el.children[2].hidden = !x.note;
          // Opt-in spacing keeps stacked note fractions clear of the readout value.
          el.children[2].style.paddingTop = Number.isFinite(x.noteGapPx) && x.noteGapPx > 0 ? `${x.noteGapPx}px` : '';
          el.classList.toggle('hot', this._hoverRef === x.ref && !!x.ref);
        });
      }
      // 관찰 포인트
      const parts = v.parts || [];
      r.partSec.hidden = !parts.length;
      if (parts.length) {
        const sig = parts.map((p) => p.name + p.desc + p.value + p.ok + p.color).join('|') + '|' + s.part;
        if (sig !== r.parts.__sig) {
          r.parts.__sig = sig;
          r.parts.innerHTML = '';
          parts.forEach((p) => {
            const b = h('button', { class: 'apl-part' + (p.ok === false ? ' bad' : ''), 'aria-pressed': String(s.part === p.id), style: { '--c': this.board.color(p.color) } },
              h('span', { class: 'dot' }),
              h('span', {}, h('div', { class: 'nm', html: this._label(APLab.stripEmoji(p.name)) }), p.desc ? h('div', { class: 'ds', html: this._label(APLab.stripEmoji(p.desc)) }) : null),
              p.value != null ? h('span', { class: 'val', html: this._label(APLab.stripEmoji(p.value)) }) : h('span'));
            b.addEventListener('click', () => { this.s.part = this.s.part === p.id ? null : p.id; this.invalidate(true); });
            r.parts.append(b);
          });
        }
      }
      // 요약
      r.summary.hidden = !v.summary;
      if (v.summary) APLab.setHTML(r.summary, `<small>핵심 결과</small>${this._label(APLab.stripEmoji(v.summary), false)}`);
      // 정리 탭: 단계 글이 지금 상태와 달라졌으면(슬라이더·점 이동 등) 다시 만듭니다. 단계 번호(s.step)는 유지하고 줄 수가 줄면 맞춥니다.
      const stepsNow = call(sc.steps, s);
      if (r.stepsSig !== JSON.stringify(stepsNow || null)) {
        this._buildReview();
        if (stepsNow && s.step > stepsNow.length) s.step = stepsNow.length;
        const cnt = this.ui.tabs.querySelector('.apl-tab[aria-controls="apl-pane-review"] .cnt');
        if (cnt && stepsNow) cnt.textContent = stepsNow.length + '단계';
      }
      if (r.steps) {
        const steps = stepsNow;
        this._syncReviewSteps();
        r.stepPrev.disabled = s.step <= 0;
        r.stepNext.disabled = s.step >= steps.length && !this._tabAvailable('problem');
        // 선택 사항(sc.reviewTop 을 쓰는 풀이 흐름): 단계가 바뀌면 지금 단계가 화면 안에 보이도록 페이지를 조금 옮깁니다
        if (sc.reviewTop && this.tab === 'review' && r.__stepSeen !== s.step) {
          r.__stepSeen = s.step;
          const cur = r.steps.querySelector('.cur');
          if (cur) {
            const rc = cur.getBoundingClientRect(), vh = window.innerHeight;
            const topLim = NARROW.matches ? this.ui.stage.getBoundingClientRect().bottom + 8 : 60;
            if (rc.bottom > vh - 8) window.scrollBy({ top: rc.bottom - vh + 16, behavior: 'instant' });
            else if (rc.top < topLim) window.scrollBy({ top: rc.top - topLim - 8, behavior: 'instant' });
          }
        }
      }
      this._syncSolutionDisclosure();
      const formula = v.formula;
      r.formulaSec.hidden = !formula;
      if (formula) APLab.setHTML(r.formula, this._rich(formula));
      r.rule.hidden = !v.rule;
      if (v.rule) {
        const html = `<div class="apl-callout" data-tone="key">${icon('spark')}<div><b>${this._label(APLab.stripEmoji(v.rule))}</b></div></div>`;
        if (r.rule.__h !== html) { r.rule.__h = html; r.rule.innerHTML = html; }
      }
      r.notesSec.hidden = !v.notes;
      if (v.notes) APLab.setHTML(r.notes, this._rich(v.notes));
      // 문제 탭
      if (r.top && sc.reviewTop) APLab.setHTML(r.top, this._rich(call(sc.reviewTop, s)));
      const pr = sc.problem;
      // The generated target can change without rebuilding the problem card.
      if (pr && r.problemTag) APLab.setHTML(r.problemTag, icon('flag') + APLab.renderMath(APLab.esc(APLab.stripEmoji(call(pr.tag, s)))));
      if (pr && r.problemText) {
        APLab.setHTML(r.problemText, this._rich(call(pr.text, s)));
      }
      this._normNewProb();
      this._syncEndStep();
      if (pr && r.problemText && r.answer) {
        const open = this._answerOpen();
        r.answer.classList.toggle('open', open);
        const html = open
          ? `<div><span class="lbl">정답</span><span class="val">${APLab.renderMath(this._rich(call(pr.answer, s)))}</span></div>`
          : `<div style="display:flex;gap:10px;align-items:center">${icon('lock')}<div><span class="lbl">정답은 잠시 잠겨 있어요</span><span>정리 탭의 풀이 단계를 끝까지 확인하면 열립니다.</span></div></div><button class="apl-btn sm" data-reveal>지금 보기</button>`;
        if (r.answer.__h !== html) {
          r.answer.__h = html;
          r.answer.innerHTML = html;
          const rb = r.answer.querySelector('[data-reveal]');
          if (rb) rb.addEventListener('click', () => { this.s.revealed = true; this.invalidate(true); });
        }
      }
    }

    /* ======================= 수업 모드 ======================= */
    setTeach(on) {
      this.teach = !!on;
      document.documentElement.setAttribute('data-teach', on ? 'on' : 'off');
      this.board.setTeach(on);
      this.ui.teachBtn.classList.toggle('on', on);
      this.ui.teachBtn.setAttribute('aria-pressed', String(on));
      this.ui.presenter.hidden = !on;
      if (on) APLab.toast('수업 모드: ← → 단계 · [ ] 장면 · D 판서 · F 전체 화면');
      this.invalidate(true);
      this._saveHashSoon();
    }
    _problemPresenter() {
      return !!(this.def.stagedReveal && this.teach && this.tab === 'problem' && this._tabAvailable('review'));
    }
    _renderPresenter() {
      const p = this.ui.presenter;
      if (!this.teach) return;
      const sc = this.scene;
      const steps = call(sc.steps, this.s) || [];
      const cur = this.s.step;
      const problemOnly = this._problemPresenter();
      const txt = problemOnly ? '주어진 조건을 확인하세요. 다음 버튼을 누르면 풀이 그림과 설명을 함께 볼 수 있습니다.' : steps.length
        ? cur > 0 ? String(steps[cur - 1]).replace(/^Step\s*\d+\s*·\s*/, '') : '그림을 먼저 관찰해 보세요'
        : APLab.stripEmoji(APLab.splitFlag(sc.title).text);
      const label = problemOnly ? '문제의 기준 도형' : steps.length ? `단계 ${cur} / ${steps.length}` : `장면 ${this.index + 1} / ${this.list.length}`;
      const key = label + txt;
      if (p.__k === key) return;
      p.__k = key;
      p.innerHTML = '';
      p.append(
        h('button', { class: 'apl-icon-btn', 'aria-label': '이전', html: icon('prev'), onclick: () => this.prev() }),
        h('div', { class: 'txt', html: `<small>${APLab.esc(label)}</small>${APLab.renderMath(this._sf(APLab.esc(txt)))}` }),
        h('button', { class: 'apl-icon-btn', 'aria-label': '다음', html: icon('next'), onclick: () => this.next() }));
    }
    next() {
      if (this._problemPresenter()) { this.setTab('review'); return; }
      if (!this.stepBy(1)) {
        if (this.index < this.list.length - 1) this.goScene(this.index + 1);
      }
    }
    prev() {
      if (this._problemPresenter()) { this.setTab('review'); return; }
      if (!this.stepBy(-1)) {
        if (this.index > 0) {
          this.goScene(this.index - 1);
          const steps = call(this.scene.steps, this.s) || [];
          this.setStep(steps.length);
        }
      }
    }
    togglePanel() {
      const off = !this.ui.main.classList.contains('panel-off');
      this.ui.main.classList.toggle('panel-off', off);
      this.ui.panelBtn.classList.toggle('on', off);
      requestAnimationFrame(() => { this.board.resize(); this._sizeInk(); this.invalidate(); });
    }
    fullscreen() {
      const el = document.documentElement;
      if (!document.fullscreenElement) (el.requestFullscreen || el.webkitRequestFullscreen || (() => {})).call(el);
      else (document.exitFullscreen || document.webkitExitFullscreen || (() => {})).call(document);
    }

    /* ======================= 판서(펜) ======================= */
    _bindInk() {
      const cv = this.ui.ink;
      this.inkCtx = cv.getContext('2d');
      let cur = null;
      const pt = (e) => {
        const r = cv.getBoundingClientRect();
        return this.board.toW(e.clientX - r.left, e.clientY - r.top);
      };
      cv.addEventListener('pointerdown', (e) => {
        if (!this.pen.on) return;
        e.preventDefault();
        try { cv.setPointerCapture(e.pointerId); } catch (_) {}
        const w = pt(e);
        if (this.pen.erase) { this._eraseAt(w); return; }
        cur = { color: this.pen.color, width: e.pointerType === 'pen' ? 2.2 + (e.pressure || 0.5) * 3 : 3.6, pts: [w] };
        this._strokes().push(cur);
        this._drawInk();
      });
      cv.addEventListener('pointermove', (e) => {
        if (!this.pen.on || !cur) return;
        if (e.buttons === 0 && e.pointerType === 'mouse') return;
        cur.pts.push(pt(e));
        this._drawInk();
      });
      const end = () => { cur = null; };
      cv.addEventListener('pointerup', end);
      cv.addEventListener('pointercancel', end);
      this._sizeInk();
    }
    _strokes() {
      const key = this.scene ? this.scene.id + '@' + this.scene.gi : '_';
      if (!this.ink.has(key)) this.ink.set(key, []);
      return this.ink.get(key);
    }
    _sizeInk() {
      const b = this.board;
      const cv = this.ui.ink;
      cv.width = Math.round(b.W * b.dpr);
      cv.height = Math.round(b.H * b.dpr);
      this._drawInk();
    }
    _drawInk() {
      const c = this.inkCtx;
      const b = this.board;
      if (!c) return;
      if (this.ui.ink.width !== Math.round(b.W * b.dpr)) { this.ui.ink.width = Math.round(b.W * b.dpr); this.ui.ink.height = Math.round(b.H * b.dpr); }
      c.setTransform(b.dpr, 0, 0, b.dpr, 0, 0);
      c.clearRect(0, 0, b.W, b.H);
      for (const st of this._strokes()) {
        if (st.pts.length < 1) continue;
        c.strokeStyle = b.color(st.color);
        c.lineWidth = st.width * b.lw;
        c.lineCap = 'round';
        c.lineJoin = 'round';
        c.beginPath();
        st.pts.forEach((w, i) => {
          const s = b.toS(w.x, w.y);
          i ? c.lineTo(s.x, s.y) : c.moveTo(s.x, s.y);
        });
        if (st.pts.length === 1) { const s = b.toS(st.pts[0].x, st.pts[0].y); c.lineTo(s.x + 0.1, s.y); }
        c.stroke();
      }
    }
    _eraseAt(w) {
      const b = this.board;
      const s0 = b.toS(w.x, w.y);
      const list = this._strokes();
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].pts.some((p) => { const s = b.toS(p.x, p.y); return Math.hypot(s.x - s0.x, s.y - s0.y) < 14; })) {
          list.splice(i, 1);
          break;
        }
      }
      this._drawInk();
    }
    setPen(on) {
      this.pen.on = !!on;
      this.ui.ink.classList.toggle('active', this.pen.on);
      this.ui.penBtn.classList.toggle('on', this.pen.on);
      const t = this.ui.penTools;
      t.hidden = !this.pen.on;
      if (this.pen.on) {
        t.innerHTML = '';
        ['amber', 'rose', 'sky', 'ink'].forEach((c) => {
          const b = h('button', { class: 'sw' + (!this.pen.erase && this.pen.color === c ? ' on' : ''), style: { '--c': `var(--m-${c})` }, 'aria-label': `펜 색 ${PEN_NAME[c] || c}` });
          b.addEventListener('click', () => { this.pen.color = c; this.pen.erase = false; this.setPen(true); });
          t.append(b);
        });
        t.append(
          h('button', { class: 'apl-icon-btn' + (this.pen.erase ? ' on' : ''), 'aria-label': '지우개 (E)', title: '획 지우개 (E)', html: icon('eraser'), onclick: () => { this.pen.erase = !this.pen.erase; this.setPen(true); } }),
          h('button', { class: 'apl-icon-btn', 'aria-label': '되돌리기', title: '되돌리기 (Ctrl+Z)', html: icon('undo'), onclick: () => { this._strokes().pop(); this._drawInk(); } }),
          h('button', { class: 'apl-icon-btn', 'aria-label': '모두 지우기 (X)', title: '모두 지우기 (X)', html: icon('trash'), onclick: () => { this._strokes().length = 0; this._drawInk(); } }),
          h('button', { class: 'apl-icon-btn', 'aria-label': '판서 끝내기', title: '판서 끝내기 (D)', html: icon('x'), onclick: () => this.setPen(false) }));
      }
    }

    /* ======================= 저장·공유 ======================= */
    capture() {
      const b = this.board;
      const out = b.snapshot(() => this.render(), this.ui.ink);
      const c = out.getContext('2d');
      c.setTransform(b.dpr, 0, 0, b.dpr, 0, 0);
      c.font = `700 ${12}px ${b.font}`;
      c.fillStyle = b.color('muted');
      c.textAlign = 'right';
      c.fillText(`AP Math 실험실 · ${this.def.title} · ${APLab.stripEmoji(this.scene.title)}`, b.W - 12, b.H - 12);
      const a = document.createElement('a');
      a.href = out.toDataURL('image/png');
      a.download = `${this.def.title}_장면${this.index + 1}.png`;
      document.body.append(a);
      a.click();
      a.remove();
      APLab.toast('그림을 파일로 저장했습니다');
    }
    _hashState() {
      const sc = this.scene;
      const q = new URLSearchParams();
      q.set('s', sc.id + (this.groups.length > 1 ? '@' + sc.gi : ''));
      if (this.s.step) q.set('step', String(this.s.step));
      for (const k of Object.keys(this.params)) {
        const p = this.params[k];
        const v = this.s[k];
        if (typeof v === 'number') q.set(k, String(+v.toFixed(p.step && p.step < 0.01 ? 3 : 2)));
      }
      for (const k of this.def.persist || []) if (this.s[k] != null) q.set(k, String(this.s[k]));
      return q;
    }
    _saveHashSoon() {
      clearTimeout(this._hashT);
      this._hashT = setTimeout(() => {
        const q = this._hashState();
        if (this.teach) q.set('teach', '1');
        try { history.replaceState(null, '', '#' + q.toString()); } catch (e) {}
      }, 250);
    }
    _restore() {
      const q = new URLSearchParams(location.hash.slice(1));
      const sid = q.get('s');
      let i = 0;
      if (sid) {
        const [id, gi] = sid.split('@');
        const found = this.list.findIndex((x) => x.id === id && (gi == null || x.gi === +gi));
        if (found >= 0) i = found;
      } else if (q.get('n')) {
        // 허브의 장면 바로가기(#n=3): 묶음이 있으면 n번째 묶음의 첫 장면
        const n = Math.max(1, parseInt(q.get('n'), 10) || 1) - 1;
        const found = this.groups.length > 1 ? this.list.findIndex((x) => x.gi === n) : n;
        if (found >= 0 && found < this.list.length) i = found;
      }
      const params = {};
      for (const [k, v] of q.entries()) {
        if (k in this.params) params[k] = parseFloat(v);
        else if ((this.def.persist || []).includes(k)) params[k] = v === 'true' ? true : v === 'false' ? false : isNaN(+v) ? v : +v;
      }
      this.goScene(i, { params });
      if (q.get('step')) this.s.step = +q.get('step');
      if (q.get('teach') === '1' || new URLSearchParams(location.search).get('teach') === '1') this.setTeach(true);
      this.invalidate(true);
    }
    shareURL() {
      const q = this._hashState();
      return location.href.split('#')[0] + '#' + q.toString();
    }
    openShare() {
      const url = this.shareURL();
      const qr = APLab.qrSVG(url);
      const input = h('input', { class: 'apl-input', value: url, readonly: true, 'aria-label': '공유 링크' });
      const copy = h('button', { class: 'apl-btn primary', html: icon('copy') + '<span>링크 복사</span>', onclick: async () => {
        try { await navigator.clipboard.writeText(url); APLab.toast('링크를 복사했습니다'); } catch (e) { input.select(); document.execCommand && document.execCommand('copy'); APLab.toast('링크를 복사했습니다'); }
      } });
      APLab.dialog({
        title: '학생 화면으로 보내기',
        body: h('div', { class: 'apl-share' },
          qr ? h('div', { class: 'apl-qr', html: qr }) : null,
          h('div', { style: { display: 'grid', gap: '10px' } },
            h('p', { style: { margin: 0, color: 'var(--text-2)', fontSize: 'var(--fs-sm)', lineHeight: 1.7 }, html: `휴대폰 카메라로 QR을 찍으면 <b>지금 이 장면과 값 그대로</b> 학생 화면에 열립니다.<br>현재: <b>${APLab.esc(APLab.stripEmoji(this.scene.title))}</b>` }),
            input, copy))
      });
    }
    openHelp() {
      const keys = [
        [['←', '→'], '단계 이동 (끝나면 다음 장면) — 발표용 리모컨도 동작'],
        [['[', ']'], '이전 / 다음 장면'],
        [['1', '…', '9'], '장면 바로 가기'],
        [['T'], '수업 모드 (큰 글씨·굵은 선·단계 안내 줄)'],
        [['D'], '판서 펜 켜기/끄기 · E 지우개 · X 모두 지우기'],
        [['H'], '설명 패널 접기 (무대를 크게)'],
        [['F'], '전체 화면'],
        [['G'], '격자 켜기/끄기'],
        [['0'], '화면 맞춤 (확대·이동 되돌리기)'],
        [['S'], '문제 조건으로 그림 맞추기'],
        [['A'], '정답 공개'],
        [['Space'], '움직임 재생/정지'],
        [['N', '화살표'], '무대를 누른 뒤: 점 고르기 / 점 움직이기']
      ];
      const grid = h('div', { class: 'apl-keys' });
      keys.forEach(([ks, d]) => grid.append(h('span', { html: ks.map((k) => `<span class="apl-kbd">${APLab.esc(k)}</span>`).join('') }), h('span', { text: d })));
      // board.aspect:'free'(시간 그래프 등)인 실험실만 1:1 안내 대신 축척이 따로라는 안내를 보여 줍니다.
      const aspectNote = ((this.scene && this.scene.aspect) || (this.def.board || {}).aspect) === 'free'
        ? (this.scene && this.scene.aspectNote) || '이 실험실의 그래프는 가로(시간)와 세로(위치·속도)의 <b>단위가 달라 축척을 따로</b> 둡니다. 그래프가 무대를 가득 채우는 대신 기울기의 각도는 실제와 다르게 보여요.'
        : '무대는 가로·세로 축척이 항상 같아서 <b>직각은 직각으로, 기울기 1은 45°로</b> 보입니다.';
      const legend = h('div', { class: 'apl-card soft', html: `
        <div class="apl-section-h" style="margin-bottom:8px"><span>${icon('spark')}색과 모양의 약속</span></div>
        <div class="apl-rich" style="font-size:var(--fs-xs)">
          <p><b>후광이 있는 점</b>은 손으로 끌 수 있습니다. 무대를 두 손가락으로 벌리면 확대, 빈 곳을 끌면 이동합니다.</p>
          <p><b>같은 대상은 같은 색</b>입니다. 조절 막대·실시간 값·그림의 선이 같은 색이면 같은 것을 가리킵니다. 실시간 값에 마우스를 올리면 그림에서 해당 부분이 강조됩니다.</p>
          <p>${aspectNote}</p>
        </div>` });
      APLab.dialog({ title: '도움말 · 단축키', body: h('div', { style: { display: 'grid', gap: '14px' } }, legend, grid) });
    }
    openOverview() {
      const grid = h('div', { class: 'apl-scene-grid' });
      const dlg = APLab.dialog({ title: `모든 장면 (${this.list.length})`, body: grid, wide: true });
      const bd = this.def.board || {};
      let lastG = -1;
      const jobs = [];
      this.list.forEach((sc, i) => {
        // Each card needs its own initialized question. The active scene's state
        // can have a different question shape and cannot supply another's steps.
        const st = { ...this.s, step: 99, part: null, playing: false, dragging: false, grid: true };
        for (const [k, p] of Object.entries(this.params)) st[k] = p.value;
        if (this.def.enter) this.def.enter(st, sc, this);
        if (sc.enter) sc.enter(st, this);
        if (sc.problem && sc.problem.snap && sc.thumbSnap !== false) Object.assign(st, call(sc.problem.snap, st));
        if (this.groups.length > 1 && sc.gi !== lastG) {
          lastG = sc.gi;
          grid.append(h('div', { class: 'apl-group-h', html: APLab.renderMath(this._sf(APLab.esc(`${sc.gi + 1}. ${APLab.stripEmoji(sc.group.title)}`))) }));
        }
        const cv = h('canvas', {});
        const sp = APLab.splitFlag(sc.short || sc.title);
        const card = h('button', { class: 'apl-scene-card', 'aria-current': String(i === this.index), onclick: () => { dlg.close(); this.goScene(i); } },
          cv, h('b', { html: APLab.renderMath(this._sf(APLab.esc(sp.text))) }), h('small', { text: sp.flag || (sc.steps ? `${call(sc.steps, st).length}단계 풀이` : ' ') }));
        grid.append(card);
        jobs.push(() => {
          const focus = call(sc.focus, st) || call(bd.focus, st);
          APLab.Board.renderThumb(cv, { kind: sc.boardKind || bd.kind || 'cartesian', focus, pad: bd.thumbPad, aspect: sc.aspect || bd.aspect }, (b) => {
            if (sc.panes) b.setPanes(call(sc.panes, st));
            const v = (sc.view ? sc.view(st, this) : this.def.view ? this.def.view(st, sc, this) : {}) || {};
            (sc.draw || this.def.draw)(b, st, v, this);
          });
        });
      });
      // 화면이 먼저 뜨도록 썸네일은 나눠서 그립니다.
      const run = () => { const j = jobs.shift(); if (j) { j(); requestAnimationFrame(run); } };
      requestAnimationFrame(run);
    }

    /* ======================= 타이머 ======================= */
    _timerToggle(secs) {
      if (this._timer) { this._timerStop(); return; }
      const btn = this.refs.timerBtn;
      const t0 = performance.now();
      btn.classList.add('run');
      this._timer = setInterval(() => {
        const left = secs - (performance.now() - t0) / 1000;
        if (left <= 0) {
          btn.classList.remove('run');
          btn.classList.add('over');
          btn.innerHTML = icon('clock') + '<span>시간 종료!</span>';
          clearInterval(this._timer);
          this._timer = null;
          return;
        }
        btn.innerHTML = icon('clock') + `<span>${left.toFixed(1)}초</span>`;
      }, 100);
    }
    _timerStop() {
      if (this._timer) clearInterval(this._timer);
      this._timer = null;
    }

    /* ======================= 키보드 ======================= */
    _bindKeys() {
      document.addEventListener('keydown', (e) => {
        const t = e.target;
        if (t && (t.tagName === 'INPUT' && t.type !== 'range' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
        if (document.querySelector('.apl-dialog')) return;
        if (e.metaKey || e.altKey) return;
        if (e.ctrlKey) {
          if ((e.key === 'z' || e.key === 'Z') && this.pen.on) { this._strokes().pop(); this._drawInk(); e.preventDefault(); }
          return;
        }
        const k = e.key;
        const onRange = t && t.type === 'range';
        const onCanvas = t === this.ui.canvas;
        let handled = true;
        if ((k === 'ArrowRight' || k === 'PageDown') && !onRange && !onCanvas) this.next();
        else if ((k === 'ArrowLeft' || k === 'PageUp') && !onRange && !onCanvas) this.prev();
        else if (k === ']') this.goScene(this.index + 1);
        else if (k === '[') this.goScene(this.index - 1);
        else if (/^[1-9]$/.test(k)) {
          const n = +k - 1;
          if (this.groups.length > 1) { const i = this.list.findIndex((x) => x.gi === n); if (i >= 0) this.goScene(i); }
          else if (n < this.list.length) this.goScene(n);
        }
        else if (k === 't' || k === 'T') this.setTeach(!this.teach);
        else if (k === 'd' || k === 'D' || k === 'p' || k === 'P') this.setPen(!this.pen.on);
        else if ((k === 'e' || k === 'E') && this.pen.on) { this.pen.erase = !this.pen.erase; this.setPen(true); }
        else if ((k === 'x' || k === 'X') && this.pen.on) { this._strokes().length = 0; this._drawInk(); }
        else if (k === 'h' || k === 'H') this.togglePanel();
        else if (k === 'f' || k === 'F') this.fullscreen();
        else if (k === 'g' || k === 'G') this.set({ grid: !this.s.grid });
        else if (k === '0') this.fitView();
        else if (k === '+' || k === '=') this.zoom(1.2);
        else if (k === '-' || k === '_') this.zoom(1 / 1.2);
        else if (k === 's' || k === 'S') this.snap();
        else if (k === 'a' || k === 'A') { this.s.revealed = true; if (this._tabAvailable('problem')) this.setTab('problem'); this.invalidate(true); }
        else if (k === ' ' && !onRange && t.tagName !== 'BUTTON') { const a = (call(this.scene.actions, this.s) || []).find((x) => x.play); if (a) a.run(this.s, this); else handled = false; this.invalidate(true); }
        else if (k === '?') this.openHelp();
        else if (k === 'Escape' && this.pen.on) this.setPen(false);
        else handled = false;
        if (handled) e.preventDefault();
      });
    }
    _announce(msg) {
      // Keep prose intact and expose formulas through KaTeX MathML, not literal TeX.
      APLab.setHTML(this.ui.live, this._label(msg));
    }
  }

  APLab.Lab = Lab;
  APLab.createLab = function (def) {
    const start = () => {
      const lab = new Lab(def);
      window.lab = lab;
      return lab;
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
  };
})();
