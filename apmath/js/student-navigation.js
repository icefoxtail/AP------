/* Shared student destinations. Context is routing metadata, never authorization. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else {
    const script = document.currentScript;
    root.StudentPortalNavigation = factory(root, document, script?.src);
    const active = script?.dataset.studentNavActive;
    if (active) {
      const start = () => root.StudentPortalNavigation.autoMount(active, script.dataset.studentNavContextOnly === 'true', script.dataset.studentNavReviewOnly === 'true');
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
      else start();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis, function (root, doc, scriptUrl) {
  'use strict';
  const appRoot = new URL('../', scriptUrl || new URL('../js/student-navigation.js', root.location.href));
  const portal = new URL('student/', appRoot);
  const storageKey = `APMATH_STUDENT_NAV:${appRoot.pathname}`;
  const destinations = [
    ['home', '홈', '<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>'],
    ['exams', '시험지', '<path d="M7 3h8l4 4v14H5V3Z"/><path d="M14 3v5h5M8 12h8M8 16h6"/>'],
    ['labs', '실험실', '<path d="m12 3 9 17H3Z"/><circle cx="12" cy="13" r="3"/>'],
    ['planner', '플래너', '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5 3 3 5-5"/>'],
    ['more', '더보기', '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>']
  ];
  const views = new Set([...destinations.map(([key]) => key), 'assignments', 'records', 'history', 'clinic', 'materials']);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let context = null;

  function normalizeContext(value) {
    if (!value || typeof value !== 'object') return null;
    return { preview: value.preview === true, studentId: String(value.studentId || '').trim().slice(0, 160) };
  }
  function setContext(value) {
    context = normalizeContext(value);
    try {
      if (context) root.sessionStorage.setItem(storageKey, JSON.stringify(context));
      else root.sessionStorage.removeItem(storageKey);
    } catch (_) { /* URL metadata also keeps navigation working without storage. */ }
    return context;
  }
  function clearContext() {
    context = null;
    try { root.sessionStorage.removeItem(storageKey); } catch (_) {}
    doc?.body?.classList.remove('has-student-common-nav');
  }
  function safePortalTarget(value) {
    try {
      const target = new URL(value, root.location.href);
      if (target.origin !== portal.origin || ![portal.pathname, portal.pathname + 'index.html'].includes(target.pathname)) return null;
      return target;
    } catch (_) { return null; }
  }
  function readContext() {
    if (context) return context;
    const params = new URLSearchParams(root.location.search || '');
    const target = safePortalTarget(params.get('studentReturnTo') || '');
    const source = target?.searchParams || params;
    if (source.get('teacher_preview') === '1' || params.get('portal') === '1' || params.get('studentReview') === '1') {
      return setContext({ preview: source.get('teacher_preview') === '1', studentId: source.get('student_id') || '' });
    }
    try { context = normalizeContext(JSON.parse(root.sessionStorage.getItem(storageKey) || 'null')); } catch (_) {}
    return context;
  }
  function portalHref(view = 'home') {
    const target = new URL(portal.href);
    target.searchParams.set('view', views.has(view) ? view : 'home');
    const current = readContext();
    if (current?.preview) {
      target.searchParams.set('teacher_preview', '1');
      target.searchParams.set('student_id', current.studentId);
    }
    return target.href;
  }
  function withContext(value) {
    const target = new URL(value, root.location.href);
    const current = readContext();
    if (!current || target.origin !== appRoot.origin || !target.pathname.startsWith(appRoot.pathname)) return target.href;
    target.searchParams.set('portal', '1');
    if (current.preview) {
      target.searchParams.set('teacher_preview', '1');
      target.searchParams.set('student_id', current.studentId);
    }
    return target.href;
  }
  function renderMarkup(active = 'home') {
    return destinations.map(([key, label, icon]) => `<a class="student-global-link${active === key ? ' active' : ''}" data-student-destination="${key}" href="${escape(portalHref(key))}"${active === key ? ' aria-current="page"' : ''}><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icon}</svg><span>${label}</span></a>`).join('');
  }
  function mount(options = {}) {
    if (!doc?.body) return null;
    if (Object.prototype.hasOwnProperty.call(options, 'context')) setContext(options.context);
    let host = typeof options.host === 'string' ? doc.getElementById(options.host) : options.host;
    host = host || doc.getElementById('student-common-nav');
    if (!host) {
      host = doc.createElement('nav');
      host.id = 'student-common-nav';
      const header = doc.querySelector('body > header');
      if (header) header.after(host);
      else doc.body.insertBefore(host, doc.body.firstChild);
    }
    host.classList.add('student-global-nav');
    host.setAttribute('aria-label', '학생 포털');
    host.hidden = false;
    const hadFocus = host.contains(doc.activeElement);
    const markup = renderMarkup(options.active || 'home');
    if (host.innerHTML !== markup) {
      host.innerHTML = markup;
      if (hadFocus) root.requestAnimationFrame?.(() => {
        if (doc.activeElement === doc.body) doc.getElementById('app')?.focus({ preventScroll: true });
      });
    }
    host.onclick = event => {
      const link = event.target.closest?.('[data-student-destination]');
      if (!link || !host.contains(link) || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const view = link.dataset.studentDestination;
      const before = new root.CustomEvent('studentportal:before-navigate', { cancelable: true, detail: { view } });
      if (!doc.dispatchEvent(before)) { event.preventDefault(); return; }
      if (typeof options.onNavigate === 'function') {
        event.preventDefault();
        options.onNavigate(view);
      }
    };
    doc.body.classList.add('has-student-common-nav');
    return host;
  }
  function autoMount(active, contextOnly = false, reviewOnly = false) {
    if (root.parent && root.parent !== root) return null;
    const params = new URLSearchParams(root.location.search || '');
    if ((active === 'exams' || reviewOnly) && params.get('studentReview') !== '1') return null;
    if (contextOnly && !readContext()) return null;
    if (active === 'labs') doc.body.classList.add('student-nav-labs');
    if (params.get('studentReview') === '1') doc.body.classList.add('student-nav-reader');
    const host = mount({ active });
    doc.querySelectorAll('a[href]:not(.student-global-link)').forEach(link => {
      if (safePortalTarget(link.href)) link.href = portalHref(active === 'more' ? 'assignments' : 'home');
    });
    return host;
  }
  return { mount, autoMount, setContext, clearContext, portalHref, withContext, renderMarkup, safePortalTarget };
});
