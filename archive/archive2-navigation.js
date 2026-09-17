/* Shared task navigation; the unit shelf keeps its existing data/output owner. */
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
    host.className = 'archive-navigation';
    host.innerHTML = api.markup(mode);
    host.hidden = false;
    if (mode === 'unit') document.body.classList.add('archive2-unit-surface');
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const items = [
    ['find', '기출·자료', 'workspace.html?view=find'],
    ['unit', '단원별 기출', 'unit-past-exams.html?ready=1'],
    ['compose', '문제지 만들기', 'workspace.html?view=compose'],
    ['recent', '출제 내역', 'workspace.html?view=recent'],
  ];
  function markup(mode) {
    const active = mode === 'unit' ? 'unit' : 'find';
    return `<a class="archive-navigation-brand" href="workspace.html">JS 아카이브 <span>2.0</span></a>
      <nav class="archive-navigation-tasks" aria-label="아카이브 작업">${items.map(([key,label,url]) => {
        const current = key === active ? ' class="active" aria-current="page"' : '';
        return mode === 'workspace' && key !== 'unit'
          ? `<button type="button" data-view="${key}"${current}>${label}</button>`
          : `<a href="${url}"${current}>${label}</a>`;
      }).join('')}</nav>
      <div class="archive-navigation-tools"><a href="index.html?legacy=1">아카이브 1.0</a>${mode === 'workspace' ? '<button type="button" data-view="health">자료 점검</button>' : '<a href="workspace.html?view=health">자료 점검</a>'}</div>`;
  }
  return { markup };
});
