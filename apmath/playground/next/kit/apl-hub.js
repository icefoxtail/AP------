/* ==========================================================================
   AP Math Lab · 허브 (apl-hub.js)
   - catalog.js 하나만 읽어 목록·검색·개수·노선도를 모두 만듭니다(수작업 개수 없음).
   - 교사용: 수업 모드로 열기 스위치, ★ 내 수업 목록, 최근 연 실험실.
   ========================================================================== */
(function () {
  'use strict';
  const { h, icon, esc, store } = APLab;
  const CAT = APLab.catalog;
  const ROOT = '../'; // next/index.html 기준 playground 루트
  const COURSE = Object.fromEntries(CAT.courses.map((c) => [c.id, c]));
  const LAB = Object.fromEntries(CAT.labs.map((l) => [l.id, l]));
  const hue = (name) => `var(--h-${name})`;
  const state = {
    q: '',
    course: (location.hash.slice(1) && COURSE[location.hash.slice(1)]) ? location.hash.slice(1) : 'all',
    view: store.get('hubView', 'list'),
    teach: store.get('hubTeach', false),
    pins: new Set(store.get('pins', []))
  };

  function rel(p) {
    return ROOT + p.split('?')[0].split('/').map(encodeURIComponent).join('/') + (p.includes('?') ? '?' + p.split('?')[1] : '');
  }
  function hrefOf(lab, sceneNo) {
    if (lab.next) {
      let u = rel(lab.next);
      if (state.teach) u += '?teach=1';
      if (sceneNo) u += '#n=' + sceneNo;
      return u;
    }
    return rel(lab.legacy);
  }
  function remember(lab) {
    APLab.pushRecent({ id: lab.id, title: lab.title, course: COURSE[lab.course].name, href: lab.next || lab.legacy });
  }
  function glyphSVG(lab) {
    return `<svg viewBox="0 0 80 76" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${lab.glyph}</svg>`;
  }
  const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, '');
  function matches(lab, q) {
    if (!q) return true;
    const hay = norm([lab.title, lab.short, lab.summary, lab.keywords, lab.unit, COURSE[lab.course].name, (lab.scenes || []).join(' ')].join(' '));
    return q.split(/\s+/).filter(Boolean).every((t) => hay.includes(norm(t)));
  }

  /* ---------- 상단 ---------- */
  const search = h('input', { type: 'search', placeholder: '단원·개념·장면 검색 (예: 접선, 사분원, 정사영)', 'aria-label': '실험실 검색', autocomplete: 'off' });
  const teachSw = h('button', { class: 'hub-switch', 'aria-pressed': String(state.teach), title: '켜면 2.0 실험실이 수업 모드(큰 글씨·발표 막대)로 열립니다', html: `<span class="knob"></span><span class="txt">수업 모드로 열기</span>` });
  const themeBtn = h('button', { class: 'apl-icon-btn', 'aria-label': '테마 바꾸기' });
  const syncTheme = () => (themeBtn.innerHTML = icon(APLab.theme.current() === 'paper' ? 'moon' : 'sun'));
  syncTheme();
  themeBtn.addEventListener('click', () => { APLab.theme.toggle(); syncTheme(); hero && hero.board.readTheme(); });
  teachSw.addEventListener('click', () => {
    state.teach = !state.teach;
    store.set('hubTeach', state.teach);
    teachSw.setAttribute('aria-pressed', String(state.teach));
    render();
  });
  const top = h('header', { class: 'hub-top' }, h('div', { class: 'hub-top-in' },
    h('a', { class: 'hub-brand', href: './index.html', html: `<span class="hub-mark"><svg viewBox="0 0 32 32" fill="none" stroke-linecap="round"><path d="M4 24c5 0 7-14 12-14s7 8 12 8" stroke="var(--m-ink)" stroke-width="2.6"/><path d="M5 17.5 27 7.5" stroke="var(--m-rose)" stroke-width="2.2"/><circle cx="16" cy="10.6" r="3.4" fill="var(--m-amber)"/></svg></span><span><b>AP Math 실험실</b><small>도형·함수 시각화 · 2.0 미리보기</small></span>` }),
    h('div', { class: 'hub-search' }, APLab.iconEl('search'), search, h('span', { class: 'apl-kbd', text: '/' })),
    h('div', { class: 'hub-tools' }, teachSw, themeBtn)));

  /* ---------- 히어로 ---------- */
  const total = CAT.labs.length;
  const sceneTotal = CAT.labs.reduce((n, l) => n + (l.sceneTotal || (l.scenes || []).length), 0);
  const v2count = CAT.labs.filter((l) => l.next).length;
  const heroCanvas = h('canvas', { 'aria-hidden': 'true' });
  const heroEl = h('section', { class: 'hub-hero' },
    h('div', {},
      h('h1', { html: '그림을 움직이면,<br><em>개념이 보입니다.</em>' }),
      h('p', { html: `중1 기본 도형부터 미적분Ⅰ·기하까지. 점을 끌고, 풀이를 한 단계씩 그림에 드러내고, 수업에서는 크게 띄워 판서합니다. 같은 대상은 언제나 같은 색으로 연결됩니다.` }),
      h('div', { class: 'hub-stats', html: `<span class="hub-stat"><b>${total}</b>실험실</span><span class="hub-stat"><b>${sceneTotal}</b>탐구 장면</span><span class="hub-stat"><b>${CAT.courses.length}</b>학년·과목</span><span class="hub-stat"><b>${v2count}</b>2.0 셸 적용</span>` }),
      h('div', { class: 'hub-cta', id: 'hubCta' })),
    h('div', { class: 'hub-hero-stage' }, heroCanvas, h('div', { class: 'cap', html: '<span>실험실 엔진으로 그린 실시간 그림</span><span>할선 → 접선</span>' })));
  let hero = null;

  function startHero() {
    const b = new APLab.Board(heroCanvas, { kind: 'cartesian', focus: { x: [-2.6, 2.8], y: [-1.6, 3.1] }, interactive: false, pad: 0.04 });
    b.resize();
    const f = (x) => 0.38 * x * x * x - 1.15 * x + 0.9;
    const fp = (x) => 1.14 * x * x - 1.15;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let t0 = performance.now();
    let visible = true;
    const frame = (now) => {
      const t = reduce ? 1.2 : (now - t0) / 1000;
      b.resize();
      b.begin();
      b.grid();
      b.axes({ ticks: false });
      b.plot(f, { color: 'ink', width: 3, glow: true });
      const a = Math.sin(t * 0.35) * 1.6;
      const hh = 0.05 + 1.25 * (0.5 + 0.5 * Math.cos(t * 0.9));
      const ya = f(a), yb = f(a + hh), m = fp(a), sec = (yb - ya) / hh;
      b.line([a, ya], m, { extent: 1.6, color: 'rose', width: 2.6, glow: true });
      b.line([a, ya], sec, { extent: 1.9, color: 'sky', width: 2.2, dash: true });
      b.seg([a, ya], [a + hh, ya], { color: 'amber', width: 1.6, dash: [4, 4], alpha: 0.8 });
      b.seg([a + hh, ya], [a + hh, yb], { color: 'sky', width: 1.6, dash: [4, 4], alpha: 0.8 });
      b.point([a + hh, yb], { color: 'sky', r: 5 });
      b.handle('P', [a, ya], { color: 'amber' });
      b.stext(14, 26, `할선 기울기 ${APLab.fmt(sec)}  →  접선 기울기 ${APLab.fmt(m)}`, { color: 'ink', size: 13, align: 'left', weight: 750 });
      b.end();
      if (!reduce && visible) requestAnimationFrame(frame);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => {
        const was = visible;
        visible = es[0].isIntersecting;
        if (visible && !was) requestAnimationFrame(frame);
      }).observe(heroCanvas);
    }
    requestAnimationFrame(frame);
    window.addEventListener('apl:theme', () => b.readTheme());
    return { board: b };
  }

  /* ---------- 과정 선택 ---------- */
  const courseBar = h('div', { class: 'hub-courses', role: 'toolbar', 'aria-label': '학년·과목' });
  const viewBtns = [
    h('button', { 'aria-pressed': String(state.view === 'list'), 'aria-label': '목록 보기', title: '목록', html: icon('list') + '목록', onclick: () => setView('list') }),
    h('button', { 'aria-pressed': String(state.view === 'map'), 'aria-label': '개념 노선도 보기', title: '개념 노선도', html: icon('map') + '개념 노선도', onclick: () => setView('map') })
  ];
  const bar = h('div', { class: 'hub-bar' }, courseBar, h('div', { class: 'hub-view', role: 'group', 'aria-label': '보기 방식' }, ...viewBtns));
  function setView(v) {
    state.view = v;
    store.set('hubView', v);
    viewBtns[0].setAttribute('aria-pressed', String(v === 'list'));
    viewBtns[1].setAttribute('aria-pressed', String(v === 'map'));
    render();
  }
  function setCourse(id) {
    state.course = id;
    try { history.replaceState(null, '', id === 'all' ? location.pathname + location.search : '#' + id); } catch (e) {}
    render();
    if (id !== 'all') window.scrollTo({ top: bar.offsetTop - 70, behavior: 'smooth' });
  }

  const shelf = h('div', { class: 'hub-shelf' });
  const content = h('div', {});
  const wrap = h('main', { class: 'hub-wrap' }, heroEl, bar, shelf, content,
    h('footer', { class: 'hub-foot-note', html: `<span>AP Math 실험실 2.0 미리보기 · 카탈로그 ${esc(CAT.version)} · 실험실 ${total}개</span><span><a href="./compare.html">기존 ↔ 2.0 비교</a> · <a href="../teacher-hub.html">기존 허브</a> · <a href="../index.html">3D 수학 우주</a> · <a href="./README.md">설계·이식 안내</a></span>` }));
  document.body.append(h('div', { class: 'hub' }, top, wrap));

  /* ---------- 렌더 ---------- */
  function renderCourses(list) {
    courseBar.innerHTML = '';
    const counts = {};
    list.forEach((l) => (counts[l.course] = (counts[l.course] || 0) + 1));
    const mk = (id, name, n, hc) => {
      const b = h('button', { class: 'hub-course', 'aria-pressed': String(state.course === id), style: { '--hc': hc }, html: `${id === 'all' ? '' : '<span class="dot"></span>'}${esc(name)} <span class="cnt">${n}</span>` });
      b.addEventListener('click', () => setCourse(id));
      return b;
    };
    courseBar.append(mk('all', '전체', list.length, 'var(--accent)'));
    CAT.courses.forEach((c) => courseBar.append(mk(c.id, c.name, counts[c.id] || 0, hue(c.hue))));
  }
  function miniLink(entry, lab, sub) {
    const c = lab ? COURSE[lab.course] : null;
    const a = h('a', { class: 'hub-mini', href: lab ? hrefOf(lab) : rel(entry.href), style: { '--hc': c ? hue(c.hue) : 'var(--accent)' },
      html: `<i>${lab ? glyphSVG(lab) : icon('book')}</i><span>${esc(lab ? lab.title : entry.title)}<small>${esc(sub)}</small></span>` });
    if (lab) a.addEventListener('click', () => remember(lab));
    return a;
  }
  function renderShelf() {
    shelf.innerHTML = '';
    const pins = [...state.pins].map((id) => LAB[id]).filter(Boolean);
    const recent = store.get('recent', []).filter((r) => LAB[r.id]).slice(0, 6);
    const cta = document.getElementById('hubCta');
    cta.innerHTML = '';
    if (recent.length) {
      const r = recent[0];
      const lab = LAB[r.id];
      const a = h('a', { class: 'apl-btn primary', href: hrefOf(lab), html: `${icon('play')}<span>이어서 하기 · ${esc(lab.title)}</span>` });
      a.addEventListener('click', () => remember(lab));
      cta.append(a);
    }
    const tour = LAB['calc1-tangent'];
    cta.append(h('a', { class: 'apl-btn', href: hrefOf(tour), html: `${icon('spark')}<span>2.0 실험실 체험</span>` }));
    cta.append(h('a', { class: 'apl-btn ghost', href: './compare.html', html: `${icon('split')}<span>기존과 비교</span>` }));
    if (pins.length) {
      shelf.append(h('h2', { html: `${icon('star')}내 수업 목록 <span style="color:var(--text-3);font-weight:650">· ★로 고정한 실험실</span>` }),
        h('div', { class: 'hub-shelf-row' }, ...pins.map((lab) => miniLink(null, lab, `${COURSE[lab.course].name} · ${lab.unit}`))));
    }
    if (recent.length) {
      shelf.append(h('h2', { html: `${icon('clock')}최근 연 실험실` }),
        h('div', { class: 'hub-shelf-row' }, ...recent.map((r) => miniLink(r, LAB[r.id], new Date(r.at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })))));
    }
    shelf.hidden = !pins.length && !recent.length;
  }
  function card(lab) {
    const c = COURSE[lab.course];
    const n = lab.sceneTotal || (lab.scenes || []).length;
    const pin = h('button', { class: 'hub-pin', 'aria-pressed': String(state.pins.has(lab.id)), 'aria-label': `${lab.title} 내 수업 목록에 고정`, title: '내 수업 목록에 고정', html: icon('star') });
    pin.addEventListener('click', (e) => {
      e.preventDefault();
      state.pins.has(lab.id) ? state.pins.delete(lab.id) : state.pins.add(lab.id);
      store.set('pins', [...state.pins]);
      pin.setAttribute('aria-pressed', String(state.pins.has(lab.id)));
      renderShelf();
    });
    const scenes = (lab.scenes || []).slice(0, 4);
    const sceneEls = scenes.map((t, i) => (lab.next
      ? h('a', { href: hrefOf(lab, i + 1), title: t, text: `${i + 1} ${t}`, onclick: () => remember(lab) })
      : h('span', { title: t, text: `${i + 1} ${t}` })));
    if ((lab.scenes || []).length > 4) sceneEls.push(h('span', { class: 'more', text: `+${lab.scenes.length - 4}` }));
    const main = h('a', { href: hrefOf(lab), text: lab.title });
    main.addEventListener('click', () => remember(lab));
    const foot = h('div', { class: 'hub-foot' },
      h('a', { class: 'go', href: hrefOf(lab), html: `${lab.next ? '2.0 실험실 열기' : '실험실 열기'}${icon('next')}`, onclick: () => remember(lab) }),
      lab.next ? h('a', { class: 'legacy', href: rel(lab.legacy), text: '기존 버전' }) : null,
      ...(lab.extra || []).map((x) => h('a', { class: 'legacy', href: rel(x.href), text: x.label })),
      pin);
    return h('article', { class: 'hub-card', style: { '--hc': hue(c.hue) } },
      h('div', { class: 'hub-thumb', html: glyphSVG(lab) + `<div class="hub-badges"><span>${lab.next ? '<span class="hub-badge v2">2.0</span>' : ''}${(lab.tags || []).map((t) => `<span class="hub-badge">${esc(t)}</span>`).join('')}</span><span>${n ? `<span class="hub-badge">${n}장면</span>` : ''}</span></div>` }),
      h('div', { class: 'hub-body' },
        h('div', { class: 'hub-crumb', text: `${c.name} · ${lab.unit}` }),
        h('h3', {}, main),
        h('p', { text: lab.summary }),
        sceneEls.length ? h('div', { class: 'hub-scenes' }, ...sceneEls) : null),
      foot);
  }
  function renderList(list) {
    content.innerHTML = '';
    const courses = CAT.courses.filter((c) => state.course === 'all' || c.id === state.course);
    let shown = 0;
    for (const c of courses) {
      const labs = list.filter((l) => l.course === c.id);
      if (!labs.length) continue;
      shown += labs.length;
      const scenes = labs.reduce((n, l) => n + (l.sceneTotal || (l.scenes || []).length), 0);
      const sec = h('section', { class: 'hub-sec', id: 'sec-' + c.id, style: { '--hc': hue(c.hue) } },
        h('div', { class: 'hub-sec-h' },
          h('div', {}, h('h2', { html: `${esc(c.name)} <span class="lv">${esc(c.level)}</span>` }), h('p', { text: c.title })),
          h('span', { class: 'meta', text: `${labs.length}개 실험실 · ${scenes}장면` })));
      const units = [];
      labs.forEach((l) => { if (!units.includes(l.unit)) units.push(l.unit); });
      for (const u of units) {
        sec.append(h('div', { class: 'hub-unit', text: u }));
        sec.append(h('div', { class: 'hub-grid' }, ...labs.filter((l) => l.unit === u).map(card)));
      }
      content.append(sec);
    }
    if (!shown) content.append(h('div', { class: 'hub-empty', html: `<b>찾는 실험실이 없습니다</b>다른 낱말(예: 접선, 넓이, 벡터, 정다면체)로 검색해 보세요.` }));
  }

  /* ---------- 개념 노선도 ---------- */
  function renderMap(list) {
    content.innerHTML = '';
    const visible = new Set(list.map((l) => l.id));
    const rows = ['shape', 'trig', 'circle', 'coord', 'space', 'func', 'calc', 'seq'];
    const strandOf = Object.fromEntries(CAT.strands.map((s) => [s.id, s]));
    const SP = 100, ROW = 74, LEFT = 124, TOPY = 84, GAP = 22;
    // 열 너비: 과정별로 한 노선에 놓이는 역 수의 최댓값
    const colW = {};
    CAT.courses.forEach((c) => {
      let mx = 1;
      rows.forEach((r) => { mx = Math.max(mx, CAT.labs.filter((l) => l.course === c.id && l.strand === r).length); });
      colW[c.id] = mx * SP;
    });
    const colX = {};
    let x = LEFT;
    CAT.courses.forEach((c) => { colX[c.id] = x; x += colW[c.id] + GAP; });
    const W = x + 20, H = TOPY + rows.length * ROW + 30;
    const pos = {};
    CAT.courses.forEach((c) => rows.forEach((r, ri) => {
      const labs = CAT.labs.filter((l) => l.course === c.id && l.strand === r).sort((a, b) => a.order - b.order);
      const w = colW[c.id];
      const start = colX[c.id] + (w - labs.length * SP) / 2;
      labs.forEach((l, i) => (pos[l.id] = { x: start + (i + 0.5) * SP, y: TOPY + ri * ROW + ROW / 2 }));
    }));
    const lineCount = {};
    CAT.strands.forEach((s) => s.stations.forEach((id) => (lineCount[id] = (lineCount[id] || 0) + 1)));
    let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="개념 노선도: 학년이 올라가며 개념이 이어지는 길">`;
    // 열 머리
    CAT.courses.forEach((c, i) => {
      const cx = colX[c.id] + colW[c.id] / 2;
      if (i) svg += `<line x1="${colX[c.id] - GAP / 2}" y1="${TOPY - 14}" x2="${colX[c.id] - GAP / 2}" y2="${H - 16}" stroke="var(--line)" stroke-dasharray="3 5"/>`;
      svg += `<text class="col-h" x="${cx}" y="40" text-anchor="middle" style="fill:${hue(c.hue)}">${esc(c.name)}</text><text class="col-s" x="${cx}" y="58" text-anchor="middle">${esc(c.level.replace('고등학교 ', '고').replace('중학교 ', '중').replace('학년', ''))}</text>`;
    });
    // 노선
    rows.forEach((r, ri) => {
      const s = strandOf[r];
      const y = TOPY + ri * ROW + ROW / 2;
      svg += `<text class="ln-name" x="16" y="${y + 4}" style="fill:${hue(s.hue)}">${esc(s.name)}</text>`;
    });
    CAT.strands.forEach((s) => {
      const pts = s.stations.map((id) => pos[id]).filter(Boolean);
      if (pts.length < 2) return;
      let d = `M${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        if (Math.abs(a.y - b.y) < 1) d += ` L${b.x} ${b.y}`;
        else {
          const dy = Math.abs(b.y - a.y);
          const mx = b.x - Math.sign(b.x - a.x || 1) * Math.min(dy, Math.abs(b.x - a.x) * 0.6);
          d += ` L${mx} ${a.y} L${b.x} ${b.y}`;
        }
      }
      svg += `<path d="${d}" fill="none" stroke="${hue(s.hue)}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="${list.length === CAT.labs.length ? 0.92 : 0.35}"/>`;
    });
    // 역
    CAT.labs.forEach((l) => {
      const p = pos[l.id];
      if (!p) return;
      const s = strandOf[l.strand];
      const inter = lineCount[l.id] > 1;
      const on = visible.has(l.id);
      const label = l.short || l.title;
      svg += `<a href="${esc(hrefOf(l))}" data-id="${esc(l.id)}" aria-label="${esc(l.title)}" opacity="${on ? 1 : 0.28}">`;
      svg += `<circle class="st" cx="${p.x}" cy="${p.y}" r="${inter ? 11 : 9}" fill="${inter ? 'var(--m-ink)' : 'var(--stage)'}" stroke="${inter ? 'var(--stage)' : hue(s.hue)}" stroke-width="${inter ? 4 : 4}"/>`;
      if (l.next) svg += `<circle cx="${p.x}" cy="${p.y}" r="${inter ? 16 : 14}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="3 3"/>`;
      svg += `<text class="st-name" x="${p.x}" y="${p.y + 30}" text-anchor="middle">${esc(label)}</text></a>`;
    });
    svg += '</svg>';
    const box = h('div', { class: 'hub-metro' },
      h('div', { class: 'legend', html: CAT.strands.map((s) => `<span style="--c:${hue(s.hue)}"><i></i>${esc(s.name)}</span>`).join('') + `<span><svg width="18" height="18"><circle cx="9" cy="9" r="6" fill="var(--m-ink)" stroke="var(--stage)" stroke-width="3"/></svg>환승역(두 노선이 만나는 개념)</span><span><svg width="18" height="18"><circle cx="9" cy="9" r="7" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="3 3"/></svg>2.0 셸 적용</span>` }),
      h('div', { html: svg }),
      h('div', { class: 'note', text: '왼쪽(중1)에서 오른쪽(고등)으로 갈수록 같은 개념이 깊어집니다. 역을 누르면 실험실이 열립니다. 검색하면 해당 역만 또렷하게 표시됩니다.' }));
    box.querySelectorAll('a[data-id]').forEach((a) => a.addEventListener('click', () => remember(LAB[a.dataset.id])));
    content.append(box);
  }

  function render() {
    const q = state.q.trim();
    const list = CAT.labs.filter((l) => matches(l, q));
    renderCourses(list);
    renderShelf();
    if (state.view === 'map') renderMap(state.course === 'all' ? list : list.filter((l) => l.course === state.course));
    else renderList(list);
  }

  let qt = 0;
  search.addEventListener('input', () => {
    clearTimeout(qt);
    qt = setTimeout(() => { state.q = search.value; render(); }, 90);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== search) { e.preventDefault(); search.focus(); }
    if (e.key === 'Escape' && document.activeElement === search) { search.value = ''; state.q = ''; render(); search.blur(); }
  });
  window.addEventListener('hashchange', () => { const id = location.hash.slice(1); if (COURSE[id] || id === '') { state.course = id || 'all'; render(); } });

  render();
  hero = startHero();
})();
