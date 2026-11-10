/* Archive 2.0 shared navigation shell (PC/tablet-landscape left menu, phone top bar + bottom menu).
   Route ownership stays with the workspace/unit runtimes. The design lives in archive/DESIGN.md. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else {
    root.Archive2Navigation = api;
    const host = document.querySelector("[data-archive-navigation]");
    if (!host) return;
    const mode = host.dataset.archiveNavigation;
    if (
      mode === "unit" &&
      new URLSearchParams(location.search).get("ready") !== "1"
    ) {
      host.remove();
      return;
    }
    document.body.classList.add("archive2-shell");
    if (mode === "unit") document.body.classList.add("archive2-unit-surface");
    host.className = "archive-navigation";
    host.innerHTML = api.markup(mode, { session: api.readSession() });
    host.hidden = false;
    api.bind(host);
    api.watchLogin(host);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  // Text only: no icons (design rule). `view` is the workspace route a button opens.
  const SIDEBAR = [
    { key: "home", label: "홈", view: "home", url: "workspace.html?view=home" },
    { key: "find", label: "학교별 기출", view: "find", url: "workspace.html?view=find" },
    { key: "unit", label: "단원별 기출", view: "", url: "unit-past-exams.html?ready=1" },
    { key: "compose", label: "문제지 만들기", view: "compose", url: "workspace.html?view=compose" },
    { key: "quick", label: "빠른 평가", view: "five-minute", url: "workspace.html?view=five-minute" },
    { key: "library", label: "보관함 · 출제 내역", view: "saved", url: "workspace.html?view=saved" },
  ];
  // Phone: 빠른 평가 is reached from the 홈 and 만들기 screens, so 만들기 stays current there.
  const TABS = [
    { key: "home", label: "홈", view: "home", url: "workspace.html?view=home" },
    { key: "find", label: "학교별", view: "find", url: "workspace.html?view=find" },
    { key: "unit", label: "단원별", view: "", url: "unit-past-exams.html?ready=1" },
    { key: "make", label: "만들기", view: "compose", url: "workspace.html?view=compose" },
    { key: "library", label: "보관함", view: "saved", url: "workspace.html?view=saved" },
  ];
  // 5분 테스트 / 소단원 평가 / 중단원 평가 / 종합평가 share the 빠른 평가 menu entry.
  const QUICK_VIEWS = ["five-minute", "subunit-test", "unit-test", "monthly-test"];
  const WORKSPACE_VIEWS = ["home", "find", "compose", "saved", "recent", "health", ...QUICK_VIEWS];
  // Name shown in the phone top bar on every screen except 홈.
  const VIEW_TITLES = {
    find: "학교별 기출",
    compose: "문제지 만들기",
    saved: "보관함",
    recent: "출제 내역",
    health: "자료 점검",
    "five-minute": "5분 테스트",
    "subunit-test": "소단원 평가",
    "unit-test": "중단원 평가",
    "monthly-test": "종합평가",
  };
  const LOGIN_URL = "../apmath/";

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  function matches(key, view) {
    if (key === "quick") return QUICK_VIEWS.includes(view);
    if (key === "make") return view === "compose" || QUICK_VIEWS.includes(view);
    if (key === "library") return view === "saved" || view === "recent";
    if (key === "unit") return view === "unit";
    return key === view;
  }

  function titleFor(view) {
    return view === "unit" ? "단원별 기출" : VIEW_TITLES[view] || "";
  }

  function currentView(mode) {
    if (mode === "unit") return "unit";
    const search = typeof location === "undefined" ? "" : location.search || "";
    const view = new URLSearchParams(search).get("view");
    return WORKSPACE_VIEWS.includes(view) ? view : "home";
  }

  // Which sidebar key is current for a view (kept for callers that want one key).
  function currentKey(mode) {
    const view = currentView(mode);
    return (SIDEBAR.find((item) => matches(item.key, view)) || {}).key || (view === "health" ? "" : "home");
  }

  function readSession() {
    try {
      return JSON.parse(localStorage.getItem("APMATH_SESSION") || "null");
    } catch (error) {
      return null;
    }
  }

  // Login is owned by AP Math OS (../apmath/); the archive only reads the shared session.
  function loginState(session, now = Date.now()) {
    if (!session || typeof session !== "object") return { loggedIn: false, name: "" };
    const token = session.session_token || session.sessionToken;
    const loginId = session.login_id || session.loginId || session.user?.login_id;
    if (!token && !loginId) return { loggedIn: false, name: "" };
    const expires = Date.parse(session.expires_at || "");
    if (Number.isFinite(expires) && expires < now) return { loggedIn: false, name: "" };
    const name = String(session.name || session.user?.name || "").trim().slice(0, 12);
    return { loggedIn: true, name };
  }

  function loginMarkup(session, role) {
    const state = loginState(session);
    const cls = `archive-login ${role}`;
    if (!state.loggedIn)
      return `<a class="${cls}" data-login="out" href="${LOGIN_URL}" target="_blank" rel="noopener">선생님 로그인</a>`;
    return `<span class="${cls} is-in" data-login="in">${state.name ? `<strong>${esc(state.name)}</strong> ` : ""}로그인됨</span>`;
  }

  function itemMarkup(mode, item, view, role) {
    const active = matches(item.key, view);
    const current = active ? ' aria-current="page" class="active"' : "";
    const keyAttr = ` data-nav-key="${item.key}"`;
    const body = `<span class="archive-nav-label">${item.label}</span>`;
    if (mode === "workspace" && item.view)
      return `<button type="button" data-view="${item.view}"${keyAttr}${current} data-nav-role="${role}">${body}</button>`;
    return `<a href="${item.url}"${keyAttr}${current} data-nav-role="${role}">${body}</a>`;
  }

  function toolsMarkup(mode) {
    const health =
      mode === "workspace"
        ? '<button type="button" data-view="health">자료 점검</button>'
        : '<a href="workspace.html?view=health">자료 점검</a>';
    return `<a href="index.html?legacy=1">아카이브 1.0</a>${health}<a href="problem-bank-search.html">유형·개념으로 문항 찾기</a>`;
  }

  function markup(mode, options = {}) {
    const view = options.view || currentView(mode);
    const session = options.session || null;
    const home = view === "home";
    const title = titleFor(view);
    return `<aside class="archive-sidebar">
        <a class="archive-navigation-brand" href="workspace.html?view=home">JS 아카이브</a>
        <nav class="archive-navigation-tasks" aria-label="주 메뉴">${SIDEBAR.map((item) => itemMarkup(mode, item, view, "task")).join("")}</nav>
        <div class="archive-sidebar-foot">${loginMarkup(session, "archive-login-side")}<div class="archive-navigation-tools">${toolsMarkup(mode)}</div></div>
      </aside>
      <div class="archive-mobile-topbar${home ? " is-home" : ""}">
        <a class="archive-mobile-brand" href="workspace.html?view=home">JS 아카이브</a>
        <span class="archive-mobile-title">${esc(title)}</span>
        ${loginMarkup(session, "archive-login-top")}
      </div>
      <nav class="archive-mobile-tabs" aria-label="하단 메뉴">${TABS.map((item) => itemMarkup(mode, item, view, "mobile")).join("")}</nav>`;
  }

  // The workspace is one page: it tells the shell which screen is showing.
  function sync(view, host) {
    const doc = typeof document === "undefined" ? null : document;
    host = host || doc?.querySelector?.("[data-archive-navigation]");
    if (!host?.querySelector) return;
    const top = host.querySelector(".archive-mobile-topbar");
    if (top) {
      top.classList.toggle("is-home", view === "home");
      const title = top.querySelector(".archive-mobile-title");
      if (title) title.textContent = titleFor(view);
    }
    host.querySelectorAll("[data-nav-key]").forEach((el) => {
      const active = matches(el.dataset.navKey, view);
      el.classList.toggle("active", active);
      if (active) el.setAttribute("aria-current", "page");
      else el.removeAttribute("aria-current");
    });
  }

  // Two-way switch shown at the top of 보관함 and 출제 내역 (they share one menu entry).
  function libraryTabs(active) {
    const tab = (view, label) =>
      `<button type="button" data-view="${view}" aria-pressed="${view === active}">${label}</button>`;
    return `<div class="view-switch" role="group" aria-label="보관함과 출제 내역">${tab("saved", "보관함")}${tab("recent", "출제 내역")}</div>`;
  }

  function bind() {}

  // A login made in another tab shows up when the teacher comes back.
  function watchLogin(host) {
    if (typeof window === "undefined" || !window.addEventListener || !document?.addEventListener) return;
    const refresh = () => {
      const session = readSession();
      host.querySelectorAll?.(".archive-login").forEach((el) => {
        const role = el.classList.contains("archive-login-top") ? "archive-login-top" : "archive-login-side";
        el.outerHTML = loginMarkup(session, role);
      });
    };
    window.addEventListener("storage", (event) => {
      if (!event.key || event.key === "APMATH_SESSION") refresh();
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refresh();
    });
  }

  return {
    markup, bind, currentKey, currentView, matches, sync, libraryTabs,
    readSession, loginState, loginMarkup, watchLogin, titleFor,
    ITEMS: { SIDEBAR, TABS },
  };
});
