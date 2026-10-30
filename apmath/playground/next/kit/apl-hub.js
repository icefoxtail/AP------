/* ==========================================================================
   AP Math Lab · 허브 (apl-hub.js)
   - apl-catalog.js 하나만 읽어 목록·검색·개수·노선도를 모두 만듭니다(수작업 개수 없음).
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
    view: store.get('hubViewV2', 'map') === 'list' ? 'list' : 'map', // 노선도가 첫 화면, 목록은 한 번 눌러 보기
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
  const teachSw = h('button', { class: 'hub-switch', 'aria-pressed': String(state.teach), title: '켜면 2.0 실험실이 수업 모드(큰 글씨·굵은 선·단계 안내 줄)로 열립니다', html: `<span class="knob"></span><span class="txt">수업 모드로 열기</span>` });
  const themeBtn = h('button', { class: 'apl-icon-btn', 'aria-label': '테마 바꾸기' });
  const syncTheme = () => (themeBtn.innerHTML = icon(APLab.theme.current() === 'paper' ? 'moon' : 'sun'));
  syncTheme();
  themeBtn.addEventListener('click', () => { APLab.theme.toggle(); syncTheme(); });
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
  // 3D 우주(처음 화면)와 이전 허브로 가는 얇은 링크 줄. 머리글 위에 놓여 스크롤하면 사라집니다.
  const trail = h('nav', { class: 'hub-trail', 'aria-label': '다른 화면' }, h('div', { class: 'hub-trail-in' },
    h('a', { href: '../index.html', html: `${icon('back')}<span>AP Math Universe</span>` }),
    h('a', { href: '../teacher-hub.html', text: '이전 실험실 목록' })));

  /* ---------- 첫 안내(얇게): 노선도가 화면의 주인공입니다 ---------- */
  const total = CAT.labs.length;
  const sceneTotal = CAT.labs.reduce((n, l) => n + (l.sceneTotal || (l.scenes || []).length), 0);
  const v2count = CAT.labs.filter((l) => l.next).length;
  const introEl = h('section', { class: 'hub-intro' },
    h('div', { class: 'hub-intro-text' },
      h('h1', { html: '그림을 움직이면, <em>개념이 보입니다.</em>' }),
      h('p', { text: '중1 기본 도형부터 미적분Ⅰ·기하까지. 점을 끌고, 풀이를 한 단계씩 그림에 드러내고, 수업에서는 크게 띄워 판서합니다. 같은 대상은 언제나 같은 색으로 연결됩니다.' }),
      h('div', { class: 'hub-stats', html: `<span class="hub-stat"><b>${total}</b>실험실</span><span class="hub-stat"><b>${sceneTotal}</b>탐구 장면</span><span class="hub-stat"><b>${CAT.courses.length}</b>학년·과목</span><span class="hub-stat"><b>${v2count}</b>2.0 화면 적용</span>` })),
    h('div', { class: 'hub-cta', id: 'hubCta' }));

  /* ---------- 과정 선택 ---------- */
  const courseBar = h('div', { class: 'hub-courses', role: 'toolbar', 'aria-label': '학년·과목' });
  const viewBtns = [
    h('button', { 'aria-pressed': String(state.view === 'map'), 'aria-label': '개념 노선도 보기', title: '개념 노선도', html: icon('map') + '노선도', onclick: () => setView('map') }),
    h('button', { 'aria-pressed': String(state.view === 'list'), 'aria-label': '목록으로 보기', title: '실험실 목록으로 보기', html: icon('list') + '목록', onclick: () => setView('list') })
  ];
  const bar = h('div', { class: 'hub-bar' }, courseBar, h('div', { class: 'hub-view', role: 'group', 'aria-label': '보기 방식' }, ...viewBtns));
  function setView(v) {
    state.view = v;
    store.set('hubViewV2', v);
    viewBtns[0].setAttribute('aria-pressed', String(v === 'map'));
    viewBtns[1].setAttribute('aria-pressed', String(v === 'list'));
    render();
  }
  function setCourse(id) {
    state.course = id;
    try { history.replaceState(null, '', id === 'all' ? location.pathname + location.search : '#' + id); } catch (e) {}
    pulseCourse = id;
    render();
    if (state.view === 'map') jumpToCourse(id);
    else if (id !== 'all') window.scrollTo({ top: bar.offsetTop - 70, behavior: 'smooth' });
  }

  const shelf = h('div', { class: 'hub-shelf' });
  const content = h('div', {});
  const wrap = h('main', { class: 'hub-wrap' }, introEl, bar, shelf, content,
    h('footer', { class: 'hub-foot-note', html: `<span>AP Math 실험실 2.0 미리보기 · 카탈로그 ${esc(CAT.version)} · 실험실 ${total}개</span><span><a href="./compare.html">기존 ↔ 2.0 비교</a> · <a href="../teacher-hub.html">이전 실험실 목록</a> · <a href="../index.html">AP Math Universe</a> · <a href="./README.md">설계·이식 안내</a></span>` }));
  document.body.append(h('div', { class: 'hub' }, trail, top, wrap));

  /* ---------- 렌더 ---------- */
  function renderCourses(list) {
    const keep = courseBar.scrollLeft; // 칩 줄을 옆으로 밀어 둔 위치를 다시 그려도 유지
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
    courseBar.scrollLeft = keep;
    const on = courseBar.querySelector('[aria-pressed="true"]');
    if (on && (on.offsetLeft < courseBar.scrollLeft || on.offsetLeft + on.offsetWidth > courseBar.scrollLeft + courseBar.clientWidth)) {
      courseBar.scrollLeft = on.offsetLeft - (courseBar.clientWidth - on.offsetWidth) / 2;
    }
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

  /* ---------- 개념 노선도 ----------
     - 넓은 화면(≥1140px): 학년·과목이 가로 칸, 노선이 가로줄. 가로 스크롤 없이 한 화면에 담습니다.
     - 좁은 화면: 위에서 아래로 학년이 올라가고 노선이 세로줄로 나란히 달립니다(아래로만 스크롤).
     - 과정 칩은 노선도를 어둡게 하지 않고, 그 과정 칸(구역)으로 부드럽게 이동하며 잠깐 강조합니다.
     - 검색은 맞는 역만 또렷하게, 나머지는 흐리게 보여 줍니다. */
  // 노선 순서: 환승역이 늘 이웃 노선과 만나도록 좌표·벡터를 원·곡선과 공간 사이에 둡니다.
  const LANE_ORDER = ['shape', 'trig', 'circle', 'coord', 'space', 'func', 'calc', 'seq'];
  const STRAND = Object.fromEntries(CAT.strands.map((s) => [s.id, s]));
  const LANES = LANE_ORDER.filter((id) => STRAND[id]).concat(CAT.strands.map((s) => s.id).filter((id) => !LANE_ORDER.includes(id)));
  const LANE_AT = Object.fromEntries(LANES.map((id, i) => [id, i]));
  const STRANDS_AT = {};
  CAT.strands.forEach((s) => s.stations.forEach((id) => (STRANDS_AT[id] = STRANDS_AT[id] || []).push(s.id)));
  const ALL_V2 = CAT.labs.every((l) => l.next);
  const MAP_LABS = CAT.labs.filter((l) => Object.prototype.hasOwnProperty.call(LANE_AT, l.strand) && COURSE[l.course]);
  const wideMQ = window.matchMedia('(min-width: 1140px)');
  const shortLevel = (c) => c.level.replace('고등학교 ', '고').replace('중학교 ', '중').replace('학년', '');
  const stripLine = (n) => n.replace(/\s*노선$/, '');
  const labelOf = (l) => l.short || l.title;
  const rnd = (v) => Math.round(v * 10) / 10;

  // 글자 너비 어림값(한글은 1em, 가운뎃점·공백은 좁게)
  function textW(s, fs) {
    let w = 0;
    for (const ch of s) w += /[가-힣]/.test(ch) ? 1 : ch === '·' ? 0.45 : ch === ' ' ? 0.35 : /[A-Za-z0-9]/.test(ch) ? 0.62 : 0.8;
    return w * fs;
  }
  // 칸에 안 들어가는 이름은 가운뎃점·띄어쓰기에서 두 줄로 나눕니다.
  function wrapLabel(s, maxW, fs) {
    if (textW(s, fs) <= maxW) return [s];
    const cands = [];
    for (let i = 1; i < s.length; i++) {
      if (s[i - 1] === '·') cands.push([s.slice(0, i), s.slice(i)]);
      else if (s[i] === ' ') cands.push([s.slice(0, i), s.slice(i + 1)]);
    }
    if (!cands.length) { const m = Math.ceil(s.length / 2); cands.push([s.slice(0, m), s.slice(m)]); }
    const cost = (p) => Math.max(textW(p[0], fs), textW(p[1], fs));
    cands.sort((a, b) => cost(a) - cost(b));
    return cands[0];
  }
  const labsAt = (cid, lane) => MAP_LABS.filter((l) => l.course === cid && l.strand === lane).sort((a, b) => a.order - b.order);
  const lanesOf = (id) => STRANDS_AT[id] || [];

  /* 넓은 화면: 과정 = 가로 칸, 노선 = 가로줄 */
  function mapWide(visible, searching, pulse) {
    const DW = 1200, NAMEW = 76, PADR = 6, CGAP = 12, ROW = 84, TOPY = 76, FS = 12, LH = 13.5;
    const cs = CAT.courses;
    const slots = cs.map((c) => Math.max(1, ...LANES.map((r) => labsAt(c.id, r).length)));
    const SP = (DW - NAMEW - PADR - CGAP * (cs.length - 1)) / slots.reduce((a, b) => a + b, 0);
    const colX = {}, colW = {};
    let cx0 = NAMEW;
    cs.forEach((c, i) => { colX[c.id] = cx0; colW[c.id] = slots[i] * SP; cx0 += colW[c.id] + CGAP; });
    const H = TOPY + LANES.length * ROW + 14;
    const pos = {};
    cs.forEach((c) => LANES.forEach((r, ri) => {
      const labs = labsAt(c.id, r);
      const n = labs.length;
      if (!n) return;
      const pitch = Math.min(colW[c.id] / n, 2 * SP);
      const x0 = colX[c.id] + (colW[c.id] - pitch * n) / 2 + pitch / 2;
      const stagger = n > 1 && pitch < 1.7 * SP;
      labs.forEach((l, i) => {
        pos[l.id] = { x: x0 + i * pitch, y: TOPY + ri * ROW + ROW / 2, row: ri, side: stagger && i % 2 ? 't' : 'b', w: (n > 1 ? (stagger ? 2 * pitch : pitch) : 2 * SP) - 6 };
      });
    }));
    // 노선의 한 구간이 지나가는 점들(같은 줄이면 직선, 줄이 바뀌면 45° 안팎으로 꺾어 이웃 줄로)
    function segPts(a, b, own) {
      if (Math.abs(a.y - b.y) < 1) return [b];
      const dy = Math.abs(b.y - a.y), dx = Math.abs(b.x - a.x), dir = Math.sign(b.x - a.x) || 1;
      const step = Math.min(dy, dx * 0.6);
      // 다른 노선의 환승역에서 내 줄로 들어올 때는 환승역에서 바로 꺾고, 내 줄을 달리다 환승역으로 갈 때는 끝에서 꺾습니다.
      if (a.row !== own && b.row === own) return [{ x: a.x + dir * step, y: b.y }, b];
      return [{ x: b.x - dir * step, y: a.y }, b];
    }
    const blocked = {};
    const block = (id, st, other) => {
      if (Math.abs(other.y - st.y) < 1) return;
      (blocked[id] = blocked[id] || {})[other.y < st.y ? 't' : 'b'] = true;
    };
    let svg = `<svg viewBox="0 0 ${DW} ${H}" width="100%" role="group" aria-label="개념 노선도: 학년이 올라가며 개념이 이어지는 길" preserveAspectRatio="xMidYMin meet">`;
    // 선택한 과정 칸 강조
    if (state.course !== 'all' && colX[state.course] != null) {
      const c = COURSE[state.course];
      svg += `<rect class="band${pulse ? ' pulse' : ''}" x="${rnd(colX[c.id] - CGAP / 2)}" y="${TOPY - 40}" width="${rnd(colW[c.id] + CGAP)}" height="${H - TOPY + 30}" rx="12" fill="${hue(c.hue)}"/>`;
    }
    cs.forEach((c, i) => {
      const cx = colX[c.id] + colW[c.id] / 2;
      if (i) svg += `<line x1="${rnd(colX[c.id] - CGAP / 2)}" y1="${TOPY - 12}" x2="${rnd(colX[c.id] - CGAP / 2)}" y2="${H - 8}" stroke="var(--line)" stroke-dasharray="3 5"/>`;
      svg += `<text class="col-h" x="${rnd(cx)}" y="34" text-anchor="middle" style="fill:${hue(c.hue)}">${esc(c.name)}</text><text class="col-s" x="${rnd(cx)}" y="52" text-anchor="middle">${esc(shortLevel(c))}</text>`;
    });
    LANES.forEach((r, ri) => {
      const s = STRAND[r];
      svg += `<text class="ln-name" x="6" y="${TOPY + ri * ROW + ROW / 2 + 4}" style="fill:${hue(s.hue)}">${esc(stripLine(s.name))}</text>`;
    });
    // 노선(한 줄로 이어짐)
    LANES.forEach((r) => {
      const s = STRAND[r];
      const pts = s.stations.map((id) => pos[id]).filter(Boolean);
      if (pts.length < 2) return;
      let d = `M${rnd(pts[0].x)} ${rnd(pts[0].y)}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const seg = segPts(a, b, LANE_AT[r]);
        seg.forEach((p) => (d += ` L${rnd(p.x)} ${rnd(p.y)}`));
        const before = seg.length > 1 ? seg[seg.length - 2] : a;
        const after = seg[0];
        const idA = s.stations[i - 1], idB = s.stations[i];
        block(idA, a, after);
        block(idB, b, before);
      }
      svg += `<path d="${d}" fill="none" stroke="${hue(s.hue)}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="${searching ? 0.3 : 0.92}"/>`;
    });
    // 역
    MAP_LABS.forEach((l) => {
      const p = pos[l.id];
      if (!p) return;
      const s = STRAND[l.strand];
      const inter = lanesOf(l.id).length > 1;
      const on = visible.has(l.id);
      const R = inter ? 10 : 8;
      const bl = blocked[l.id] || {};
      let side = p.side;
      if (bl[side]) side = side === 'b' ? 't' : 'b';
      if (bl[side]) side = 'r';
      const lines = wrapLabel(labelOf(l), side === 'r' ? 80 : p.w, FS);
      let tx = p.x, anchor = 'middle', y0;
      if (side === 'b') y0 = p.y + R + 14;
      else if (side === 't') y0 = p.y - R - 8 - (lines.length - 1) * LH;
      else { tx = p.x + R + 7; anchor = 'start'; y0 = p.y + 4 - (lines.length - 1) * LH / 2; }
      svg += `<a href="${esc(hrefOf(l))}" data-id="${esc(l.id)}" data-hit="${on ? 1 : 0}" aria-label="${esc(l.title)}" opacity="${on ? 1 : 0.28}">`;
      svg += `<circle class="hit" cx="${rnd(p.x)}" cy="${rnd(p.y)}" r="17"/>`;
      svg += `<circle class="st" cx="${rnd(p.x)}" cy="${rnd(p.y)}" r="${R}" fill="${inter ? 'var(--m-ink)' : 'var(--stage)'}" stroke="${inter ? 'var(--stage)' : hue(s.hue)}" stroke-width="4"/>`;
      if (l.next && !ALL_V2) svg += `<circle cx="${rnd(p.x)}" cy="${rnd(p.y)}" r="${R + 5}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="3 3"/>`;
      svg += `<text class="st-name" text-anchor="${anchor}" x="${rnd(tx)}" y="${rnd(y0)}">${lines.map((t, i) => `<tspan x="${rnd(tx)}" dy="${i ? LH : 0}">${esc(t)}</tspan>`).join('')}</text></a>`;
    });
    svg += '</svg>';
    return { svg, anchorOf: (cid) => ({ x: colX[cid], w: colW[cid] }) };
  }

  /* 좁은 화면: 과정 = 위→아래 구역, 노선 = 나란한 세로줄 */
  function mapTall(visible, searching, pulse) {
    const VW = 360, LX0 = 22, LS = 19, TX = 178, RH = 40, BH = 42, FS = 13.5;
    const laneX = (lane) => LX0 + LANE_AT[lane] * LS;
    const bands = [];
    const pos = {};
    let y = 4;
    CAT.courses.forEach((c) => {
      const labs = MAP_LABS.filter((l) => l.course === c.id).sort((a, b) => LANE_AT[a.strand] - LANE_AT[b.strand] || a.order - b.order);
      if (!labs.length) return;
      bands.push({ c, y, labs });
      y += BH;
      labs.forEach((l, i) => (pos[l.id] = { y: y + i * RH + RH / 2 }));
      y += labs.length * RH + 6;
    });
    const H = y + 4;
    let svg = `<svg viewBox="0 0 ${VW} ${H}" width="100%" role="group" aria-label="개념 노선도: 위에서 아래로 학년이 올라가며 개념이 이어지는 길" preserveAspectRatio="xMidYMin meet">`;
    // 과정 구역 머리글 + 선택 강조
    bands.forEach(({ c, y: by, labs }, i) => {
      const bh = BH + labs.length * RH + 6;
      if (state.course === c.id) svg += `<rect class="band${pulse ? ' pulse' : ''}" x="2" y="${by}" width="${VW - 4}" height="${bh}" rx="12" fill="${hue(c.hue)}"/>`;
      if (i) svg += `<line x1="${TX - 8}" y1="${by + 1}" x2="${VW - 10}" y2="${by + 1}" stroke="var(--line)" stroke-dasharray="3 5"/>`;
      svg += `<g data-course="${esc(c.id)}"><text class="col-h" x="${TX}" y="${by + 27}" style="fill:${hue(c.hue)}">${esc(c.name)}</text><text class="col-s" x="${TX + textW(c.name, 13) + 10}" y="${by + 27}">${esc(c.level)}</text></g>`;
    });
    // 노선: 역이 있는 첫 줄부터 마지막 줄까지 세로로 한 줄
    LANES.forEach((r) => {
      const s = STRAND[r];
      const ys = s.stations.map((id) => pos[id] && pos[id].y).filter((v) => v != null);
      if (ys.length < 2) return;
      svg += `<line x1="${laneX(r)}" y1="${Math.min(...ys)}" x2="${laneX(r)}" y2="${Math.max(...ys)}" stroke="${hue(s.hue)}" stroke-width="6" stroke-linecap="round" opacity="${searching ? 0.3 : 0.92}"/>`;
    });
    // 역(한 줄 = 한 역, 줄 전체가 눌림 영역)
    bands.forEach(({ labs }) => labs.forEach((l) => {
      const p = pos[l.id];
      const on = visible.has(l.id);
      const own = lanesOf(l.id).length ? lanesOf(l.id) : [l.strand];
      const xs = own.map(laneX);
      const inter = own.length > 1;
      svg += `<a href="${esc(hrefOf(l))}" data-id="${esc(l.id)}" data-hit="${on ? 1 : 0}" aria-label="${esc(l.title)}" opacity="${on ? 1 : 0.28}">`;
      svg += `<rect class="hit" x="2" y="${p.y - RH / 2}" width="${VW - 4}" height="${RH}" rx="10"/>`;
      if (inter) {
        svg += `<rect x="${Math.min(...xs) - 10}" y="${p.y - 10}" width="${Math.max(...xs) - Math.min(...xs) + 20}" height="20" rx="10" fill="var(--stage)" stroke="var(--m-ink)" stroke-width="3"/>`;
        own.forEach((sid) => (svg += `<circle cx="${laneX(sid)}" cy="${p.y}" r="4.5" fill="${hue(STRAND[sid].hue)}"/>`));
      } else {
        svg += `<circle class="st" cx="${laneX(l.strand)}" cy="${p.y}" r="7" fill="var(--stage)" stroke="${hue(STRAND[l.strand].hue)}" stroke-width="4"/>`;
      }
      if (l.next && !ALL_V2) svg += `<circle cx="${laneX(l.strand)}" cy="${p.y}" r="${inter ? 13 : 11}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="3 3"/>`;
      svg += `<text class="st-name" x="${TX}" y="${p.y + 4.5}">${esc(labelOf(l))}</text></a>`;
    }));
    svg += '</svg>';
    return { svg };
  }

  // 과정 칩을 누르면 노선도가 그 과정으로 이동합니다(좁은 화면: 해당 구역으로 스크롤, 넓은 화면: 한 화면에 모두 보이므로 노선도 맨 위로).
  let pulseCourse = null;
  function jumpToCourse(id) {
    if (state.view !== 'map') return;
    const box = content.querySelector('.hub-metro');
    if (!box) return;
    const target = id !== 'all' && !wideMQ.matches ? box.querySelector(`[data-course="${id}"]`) : null;
    const ref = target || box;
    const off = top.getBoundingClientRect().height + bar.offsetHeight + 10; // 위에 고정된 머리글·과정 칩 줄 아래로 맞춥니다.
    const y = ref.getBoundingClientRect().top + window.scrollY - off - (target ? 6 : 0);
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
  }

  function renderMap(list, q) {
    content.innerHTML = '';
    const visible = new Set(list.map((l) => l.id));
    const wide = wideMQ.matches;
    const pulse = pulseCourse === state.course && state.course !== 'all';
    pulseCourse = null;
    const { svg } = wide ? mapWide(visible, !!q, pulse) : mapTall(visible, !!q, pulse);
    const lanes = wide ? '' : LANES.map((id) => `<span style="--c:${hue(STRAND[id].hue)}"><i></i>${esc(stripLine(STRAND[id].name))}</span>`).join('');
    const xfer = wide
      ? '<svg width="18" height="18" aria-hidden="true"><circle cx="9" cy="9" r="6" fill="var(--m-ink)" stroke="var(--stage)" stroke-width="3"/></svg>'
      : '<svg width="30" height="18" aria-hidden="true"><rect x="2" y="3" width="26" height="12" rx="6" fill="var(--stage)" stroke="var(--m-ink)" stroke-width="2.5"/><circle cx="10" cy="9" r="2.8" fill="var(--h-teal)"/><circle cx="20" cy="9" r="2.8" fill="var(--h-gold)"/></svg>';
    const qNote = q ? h('div', { class: 'q-note', html: list.length ? `‘${esc(q)}’에 맞는 <b>${list.length}개</b> 역이 또렷하게 표시됩니다.` : `‘${esc(q)}’에 맞는 실험실이 없습니다. 다른 낱말(예: 접선, 넓이, 벡터, 정다면체)로 검색해 보세요.` }) : null;
    const box = h('div', { class: 'hub-metro ' + (wide ? 'is-wide' : 'is-tall') },
      qNote,
      h('div', { class: 'legend', html: lanes + `<span>${xfer}환승역(두 노선이 만나는 개념)</span>` + (ALL_V2 ? '' : '<span><svg width="18" height="18" aria-hidden="true"><circle cx="9" cy="9" r="7" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="3 3"/></svg>2.0 화면 적용</span>') }),
      h('div', { class: 'metro-body', html: svg }),
      h('div', { class: 'note', text: '중1에서 고등학교 과목으로 학년이 올라갈수록 같은 개념이 깊어집니다. 역을 누르면 실험실이 열립니다. 검색하면 해당 역만 또렷하게 표시됩니다.' }));
    box.querySelectorAll('a[data-id]').forEach((a) => a.addEventListener('click', () => remember(LAB[a.dataset.id])));
    content.append(box);
    // 좁은 화면에서 검색하면 맞는 첫 역이 보이는 곳까지 내려 줍니다.
    if (q && !wide) {
      const first = box.querySelector('a[data-hit="1"]');
      if (first) {
        const r = first.getBoundingClientRect();
        const topH = top.getBoundingClientRect().height + bar.offsetHeight + 8;
        if (r.top < topH || r.bottom > window.innerHeight - 8) window.scrollTo({ top: Math.max(0, window.scrollY + r.top - topH - 90), behavior: 'smooth' });
      }
    }
  }

  function render() {
    const q = state.q.trim();
    const list = CAT.labs.filter((l) => matches(l, q));
    renderCourses(list);
    renderShelf();
    // 노선도에서는 지도가 먼저, 내 수업·최근 실험실은 그 아래에 둡니다.
    if (state.view === 'map') { content.after(shelf); renderMap(list, q); } else { content.before(shelf); renderList(list); }
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

  try { wideMQ.addEventListener('change', () => { if (state.view === 'map') render(); }); } catch (e) {}
  render();
})();
