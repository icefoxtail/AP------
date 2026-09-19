/* Archive 2.0 Classic shared navigation.
   Route ownership stays with the existing workspace/unit runtimes. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.Archive2Navigation = api;
    const host = document.querySelector('[data-archive-navigation]');
    if (!host) return;
    const mode = host.dataset.archiveNavigation;
    if (mode === 'unit' && new URLSearchParams(location.search).get('ready') !== '1') {
      host.remove();
      return;
    }
    document.body.classList.add('archive2-classic-shell');
    host.className = 'archive-navigation';
    host.innerHTML = api.markup(mode);
    host.hidden = false;
    if (mode === 'unit') document.body.classList.add('archive2-unit-surface');
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11.2 12 4l8.5 7.2"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-5.5h5V20"/></svg>',
    find: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v15H4z"/><path d="M7 3.5h10v4H7z"/><path d="M8 11h8M8 15h6"/></svg>',
    unit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7v14H4zM13 5h7v14h-7z"/><path d="M7 8h1M16 8h1M7 12h1M16 12h1"/></svg>',
    compose: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h10l4 4v12H5z"/><path d="M15 4v5h5M8 14h8M12 10v8"/></svg>',
    recent: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h7l2 2h9v11H3z"/><path d="M3 7V5h7l2 2"/></svg>'
  };
  const items = [
    ['home', '홈', '홈', 'workspace.html?view=home'],
    ['find', '기출·자료', '기출', 'workspace.html?view=find'],
    ['unit', '단원별 기출', '단원', 'unit-past-exams.html?ready=1'],
    ['compose', '문제지 만들기', '만들기', 'workspace.html?view=compose'],
    ['recent', '내 시험지', '내 시험지', 'workspace.html?view=recent']
  ];
  const esc = value => String(value || '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));

  function currentKey(mode) {
    if (mode === 'unit') return 'unit';
    const view = new URLSearchParams(location.search).get('view');
    return ['home','find','compose','recent'].includes(view) ? view : 'home';
  }

  function itemMarkup(mode, item, active) {
    const [key, desktopLabel, mobileLabel, url] = item;
    const content = `<span class="archive-nav-icon">${icons[key]}</span><span class="archive-nav-label archive-nav-label-desktop">${desktopLabel}</span><span class="archive-nav-label archive-nav-label-mobile">${mobileLabel}</span>`;
    const current = key === active ? ' class="active" aria-current="page"' : '';
    if (mode === 'workspace' && key !== 'unit') {
      return `<button type="button" data-view="${key}"${current}>${content}</button>`;
    }
    return `<a href="${url}"${current}>${content}</a>`;
  }

  function markup(mode) {
    const active = currentKey(mode);
    const p = new URLSearchParams(location.search);
    const query = esc(p.get('query') || '');
    const grade = esc(p.get('grade') || '');
    return `<aside class="archive-sidebar">
        <a class="archive-navigation-brand" href="workspace.html?view=home"><span class="archive-brand-mark">A</span><span class="archive-brand-copy"><strong>Archive 2.0</strong><small>AP MATH 문제은행</small></span></a>
        <nav class="archive-navigation-tasks" aria-label="아카이브 작업">${items.map(item => itemMarkup(mode, item, active)).join('')}</nav>
        <div class="archive-navigation-tools">
          <a href="index.html?legacy=1">아카이브 1.0</a>
          ${mode === 'workspace' ? '<button type="button" data-view="health">자료 점검</button>' : '<a href="workspace.html?view=health">자료 점검</a>'}
        </div>
      </aside>
      <div class="archive-navigation-topbar">
        <form class="archive-global-search" action="workspace.html" method="get" role="search">
          <input type="hidden" name="view" value="find">
          ${grade ? `<input type="hidden" name="grade" value="${grade}">` : ''}
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>
          <input name="query" value="${query}" placeholder="시험지 · 학교 · 단원 검색" aria-label="시험지 검색">
        </form>
        <span class="archive-topbar-spacer"></span>
        <span class="archive-topbar-profile" aria-label="AP MATH">AP</span>
      </div>`;
  }
  return { markup };
});
