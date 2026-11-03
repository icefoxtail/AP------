/* ==========================================================================
   AP Math Lab Kit · 목차 패널 (apl-toc.js)
   실험실의 모든 장면을 오른쪽에서 끌어 여는 패널로 보여 줍니다.
   - 영상이 있는 장면(apl-player.js 가 있고 대본이 있는 장면)에는 ▶ 표시. 누르면 그 장면으로 가서 영상을 바로 재생합니다.
   - 영상이 없는 장면은 지금처럼 탐구 화면으로 열립니다.
   - 열기: 위쪽 「목차」 단추, 오른쪽 가장자리 손잡이(탭하거나 왼쪽으로 끌기), 터치 화면은 오른쪽 가장자리에서 쓸기.
     닫기: 오른쪽으로 쓸기, 바깥 누르기, Esc.
   - 진도 표시(✓)는 두지 않습니다(학생마다 필요한 것을 골라 보는 곳이지 숙제가 아님 — 선생님 결정 2026-11-03).
   ========================================================================== */
(function () {
  'use strict';
  const APLab = window.APLab;
  if (!APLab || !APLab.h) return;
  const { h, icon, clamp } = APLab;

  class Toc {
    constructor(lab) {
      this.lab = lab;
      this.isOpen = false;
      this.onlyVideo = false;
      this._build();
      this._bind();
    }
    get player() { return this.lab.video || null; }

    _build() {
      const lab = this.lab;
      const ui = (this.ui = {});
      ui.close = h('button', { class: 'apl-icon-btn', 'aria-label': '목차 닫기', title: '닫기 (Esc)', html: icon('x'), onclick: () => this.close() });
      ui.sub = h('div', { class: 'apl-toc-sub' });
      ui.filter = h('button', { class: 'apl-chip apl-toc-filter', 'aria-pressed': 'false', html: '<span class="tri">▶</span><span>영상 있는 장면만</span>', onclick: () => this.setOnlyVideo(!this.onlyVideo) });
      ui.list = h('div', { class: 'apl-toc-list', role: 'list' });
      ui.head = h('div', { class: 'apl-toc-head' },
        h('div', { class: 'apl-toc-ttl' }, h('h2', { text: '목차' }), ui.sub), ui.close);
      ui.panel = h('aside', { class: 'apl-toc', role: 'dialog', 'aria-label': `${lab.def.title} 목차`, 'aria-hidden': 'true' },
        ui.head, h('div', { class: 'apl-toc-tools' }, ui.filter), ui.list);
      ui.panel.inert = true;
      ui.scrim = h('div', { class: 'apl-toc-scrim', hidden: true, onclick: () => this.close() });
      ui.handle = h('button', { class: 'apl-toc-handle', 'aria-label': '목차 열기', title: '목차 (오른쪽에서 끌어 열기)', 'aria-expanded': 'false', html: icon('back') + '<span class="vt">목차</span>' });
      ui.edge = h('div', { class: 'apl-toc-edge', 'aria-hidden': 'true' });
      ui.topBtn = h('button', { class: 'apl-btn sm apl-toc-btn', 'aria-label': '목차 열기', title: '목차 (영상으로 배우기)', html: icon('list') + '<span class="lbl">목차</span>', onclick: () => this.toggle() });
      document.body.append(ui.scrim, ui.panel, ui.handle, ui.edge);
      const actions = lab.ui.themeBtn && lab.ui.themeBtn.parentNode;
      if (actions) actions.prepend(ui.topBtn);
    }

    _bind() {
      const ui = this.ui;
      // 손잡이: 탭하면 열고 닫기, 왼쪽으로 끌면 따라 열림
      this._drag(ui.handle, 'open');
      this._drag(ui.edge, 'open');
      // 패널: 오른쪽으로 쓸면 닫힘(세로 스크롤은 그대로)
      this._drag(ui.panel, 'close');
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen && !document.querySelector('.apl-dialog')) { e.stopPropagation(); this.close(); }
      }, true);
      window.addEventListener('resize', () => { if (!this.isOpen) this._setX(null); });
    }

    /** 가로로 끄는 동작: from='open' 이면 닫힌 패널을 왼쪽으로 끌어 열고, 'close' 이면 열린 패널을 오른쪽으로 끌어 닫습니다. */
    _drag(el, from) {
      let st = null;
      const width = () => this.ui.panel.getBoundingClientRect().width || 360;
      el.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (from === 'close' && !this.isOpen) return;
        st = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false, dir: false, t: performance.now(), lastX: e.clientX, v: 0 };
      });
      el.addEventListener('pointermove', (e) => {
        if (!st || e.pointerId !== st.id) return;
        const dx = e.clientX - st.x, dy = e.clientY - st.y;
        if (!st.dir) {
          if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
          if (Math.abs(dx) < Math.abs(dy) * 1.3) { st = null; return; } // 세로 움직임은 스크롤로 둡니다
          if (from === 'open' && dx > 0) { st = null; return; }
          if (from === 'close' && dx < 0) { st = null; return; }
          st.dir = true;
          st.moved = true;
          try { el.setPointerCapture(e.pointerId); } catch (err) { /* 캡처를 못 해도 끌기는 됨 */ }
          this.ui.panel.classList.add('dragging');
          this.ui.panel.inert = false;
          this.ui.scrim.hidden = false;
        }
        const now = performance.now();
        st.v = (e.clientX - st.lastX) / Math.max(1, now - st.t);
        st.lastX = e.clientX; st.t = now;
        const w = width();
        const x = from === 'open' ? clamp(w + dx, 0, w) : clamp(dx, 0, w);
        this._setX(x);
        this.ui.scrim.style.opacity = String(1 - x / w);
      });
      const end = (e) => {
        if (!st || e.pointerId !== st.id) return;
        const s = st; st = null;
        this.ui.panel.classList.remove('dragging');
        if (!s.moved) {
          if (from === 'open' && el === this.ui.handle) this.toggle();
          return;
        }
        const w = width();
        const x = parseFloat(this.ui.panel.style.getPropertyValue('--toc-x')) || 0;
        const open = s.v < -0.35 ? true : s.v > 0.35 ? false : x < w * 0.5;
        this.ui.scrim.style.opacity = '';
        if (open) this.open(); else this.close();
      };
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
      el.addEventListener('click', (e) => { if (el === this.ui.edge) e.preventDefault(); });
    }
    _setX(x) {
      if (x == null) this.ui.panel.style.removeProperty('--toc-x');
      else this.ui.panel.style.setProperty('--toc-x', x + 'px');
    }

    setOnlyVideo(on) {
      this.onlyVideo = !!on;
      this.ui.filter.setAttribute('aria-pressed', String(this.onlyVideo));
      this.ui.filter.classList.toggle('on', this.onlyVideo);
      this.ui.list.classList.toggle('only-video', this.onlyVideo);
    }

    /** 장면 목록을 (다시) 그립니다. 영상이 있는 장면에 ▶ 가 붙습니다. */
    render() {
      const lab = this.lab, p = this.player;
      const list = this.ui.list;
      list.innerHTML = '';
      const grouped = lab.groups.length > 1;
      let lastG = -1, nVideo = 0, group = null;
      lab.list.forEach((sc, i) => {
        if (grouped && sc.gi !== lastG) {
          lastG = sc.gi;
          group = h('section', { class: 'apl-toc-group', role: 'group' }, h('h3', { class: 'apl-toc-gh', text: `${sc.gi + 1}. ${APLab.stripEmoji(sc.group.title)}` }));
          list.append(group);
        } else if (!grouped && !group) {
          group = h('section', { class: 'apl-toc-group', role: 'group' });
          list.append(group);
        }
        const has = !!(p && p.has(i));
        if (has) nVideo++;
        const sp = APLab.splitFlag(sc.short || sc.title);
        const cur = i === lab.index;
        const row = h('button', {
          class: 'apl-toc-item' + (has ? ' has-video' : ''), role: 'listitem', 'aria-current': cur ? 'true' : null, dataset: { i: String(i) },
          'aria-label': `${sp.text}${has ? `. 영상 ${Math.round(p.lengthOf(i))}초` : ''}`,
          onclick: () => this.go(i)
        },
        h('span', { class: 'ti' }, sp.flag ? h('i', { class: 'flag', text: sp.flag }) : null, h('span', { class: 'tx', text: sp.text })),
        has ? h('span', { class: 'vid', html: `<span class="tri">▶</span><span class="sec">${Math.round(p.lengthOf(i))}초</span>` }) : null);
        group.append(row);
      });
      // 영상 없는 장면만 있는 묶음은 「영상만」 보기에서 머리글도 숨깁니다
      list.querySelectorAll('.apl-toc-group').forEach((g) => { g.classList.toggle('no-video', !g.querySelector('.has-video')); });
      this.ui.sub.textContent = nVideo ? `${lab.def.title} · 영상 ${nVideo}개` : lab.def.title;
      this.ui.filter.hidden = !nVideo;
      if (!nVideo) this.setOnlyVideo(false);
    }

    go(i) {
      const lab = this.lab, p = this.player;
      this.close(true);
      if (p && p.has(i)) p.play(i);
      else lab.goScene(i);
    }

    open() {
      const ui = this.ui;
      if (this.player && this.player.state === 'playing') this.player.pause();
      this.render();
      this.isOpen = true;
      this._setX(null);
      ui.panel.inert = false;
      ui.panel.setAttribute('aria-hidden', 'false');
      ui.panel.classList.add('open');
      ui.scrim.hidden = false;
      ui.scrim.style.opacity = '';
      document.body.classList.add('apl-toc-open');
      ui.handle.setAttribute('aria-expanded', 'true');
      ui.topBtn.classList.add('on');
      const cur = ui.list.querySelector('[aria-current="true"]');
      if (cur) requestAnimationFrame(() => { ui.list.scrollTop = Math.max(0, cur.offsetTop - ui.list.clientHeight / 3); });
      ui.close.focus({ preventScroll: true });
    }
    close(quick) {
      const ui = this.ui;
      this.isOpen = false;
      this._setX(null);
      ui.panel.classList.remove('open');
      ui.panel.setAttribute('aria-hidden', 'true');
      ui.panel.inert = true;
      ui.scrim.hidden = true;
      ui.scrim.style.opacity = '';
      document.body.classList.remove('apl-toc-open');
      ui.handle.setAttribute('aria-expanded', 'false');
      ui.topBtn.classList.remove('on');
      if (!quick && document.activeElement && ui.panel.contains(document.activeElement)) ui.topBtn.focus({ preventScroll: true });
    }
    toggle() { if (this.isOpen) this.close(); else this.open(); }
  }

  APLab.Toc = Toc;
  (APLab.labHooks = APLab.labHooks || []).push((lab) => { lab.toc = new Toc(lab); });
})();
