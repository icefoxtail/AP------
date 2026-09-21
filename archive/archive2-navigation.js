/* Archive 2.0 shared navigation shell. Route ownership stays with existing workspace/unit runtimes. */
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
    host.innerHTML = api.markup(mode);
    host.hidden = false;
    api.bind(host);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11.2 12 4l8.5 7.2"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-5.5h5V20"/></svg>',
    find: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v15H4z"/><path d="M7 3.5h10v4H7z"/><path d="M8 11h8M8 15h6"/></svg>',
    unit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7v14H4zM13 5h7v14h-7z"/><path d="M7 8h1M16 8h1M7 12h1M16 12h1"/></svg>',
    compose: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h10l4 4v12H5z"/><path d="M15 4v5h5M8 14h8M12 10v8"/></svg>',
    recent: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h7l2 2h9v11H3z"/><path d="M3 7V5h7l2 2"/></svg>',
  };
  const home = ["home", "홈", "workspace.html?view=home"];
  const tasks = [
    ["find", "기출·자료", "workspace.html?view=find"],
    ["unit", "단원별 기출", "unit-past-exams.html?ready=1"],
    ["compose", "문제지 만들기", "workspace.html?view=compose"],
    ["recent", "출제 내역", "workspace.html?view=recent"],
  ];

  function currentKey(mode) {
    if (mode === "unit") return "unit";
    const view = new URLSearchParams(location.search).get("view");
    return ["home", "find", "compose", "recent", "health"].includes(view)
      ? view
      : "home";
  }

  function itemMarkup(mode, item, active, extraClass = "") {
    const [key, label, url] = item;
    const current =
      key === active ? ' aria-current="page" class="active"' : "";
    const body = `<span class="archive-nav-icon">${icons[key]}</span><span class="archive-nav-label">${label}</span>`;
    if (mode === "workspace" && key !== "unit") {
      return `<button type="button" data-view="${key}"${current}${extraClass ? ` data-nav-role="${extraClass}"` : ""}>${body}</button>`;
    }
    return `<a href="${url}"${current}${extraClass ? ` data-nav-role="${extraClass}"` : ""}>${body}</a>`;
  }

  function secondaryMarkup(mode, mobile = false) {
    const menuAttrs = mobile ? ' role="menuitem"' : "";
    const health =
      mode === "workspace"
        ? `<button type="button" data-view="health"${menuAttrs}>자료 점검</button>`
        : `<a href="workspace.html?view=health"${menuAttrs}>자료 점검</a>`;
    return `<a href="index.html?legacy=1"${menuAttrs}>아카이브 1.0</a>${health}`;
  }

  function markup(mode) {
    const active = currentKey(mode);
    const mobileItems = [home, ...tasks];
    return `<aside class="archive-sidebar">
        <a class="archive-navigation-brand" href="workspace.html?view=home"><span class="archive-brand-mark">A</span><span class="archive-brand-copy"><strong>JS 아카이브 <span>2.0</span></strong></span></a>
        <div class="archive-sidebar-home">${itemMarkup(mode, home, active, "home")}</div>
        <nav class="archive-navigation-tasks" aria-label="아카이브 작업">${tasks.map((item) => itemMarkup(mode, item, active, "task")).join("")}</nav>
        <div class="archive-navigation-tools">${secondaryMarkup(mode)}</div>
      </aside>
      <div class="archive-mobile-topbar">
        <a class="archive-mobile-brand" href="workspace.html?view=home">JS 아카이브 <span>2.0</span></a>
        <div class="archive-mobile-tools">
          <button type="button" class="archive-mobile-tools-trigger" aria-label="아카이브 1.0 · 자료 점검" aria-haspopup="menu" aria-expanded="false" aria-controls="archive-mobile-tools-menu">•••</button>
          <div id="archive-mobile-tools-menu" class="archive-mobile-tools-menu" role="menu" hidden>${secondaryMarkup(mode, true)}</div>
        </div>
      </div>
      <nav class="archive-mobile-tabs" aria-label="아카이브 작업">${mobileItems.map((item) => itemMarkup(mode, item, active, "mobile")).join("")}</nav>`;
  }

  function bind(host) {
    const trigger = host.querySelector(".archive-mobile-tools-trigger");
    const menu = host.querySelector(".archive-mobile-tools-menu");
    const tools = host.querySelector(".archive-mobile-tools");
    if (!trigger || !menu || !tools) return;

    let open = false;
    const setOpen = (next, returnFocus = false) => {
      open = Boolean(next);
      trigger.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
      if (!open && returnFocus) trigger.focus();
    };

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(!open);
    });
    menu.addEventListener("click", (event) => {
      if (event.target.closest('a,[role="menuitem"],button')) setOpen(false);
    });
    document.addEventListener("pointerdown", (event) => {
      if (open && !tools.contains(event.target)) setOpen(false);
    });
    document.addEventListener("focusin", (event) => {
      if (open && !tools.contains(event.target)) setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false, true);
      }
    });
  }

  return { markup, bind, currentKey };
});
