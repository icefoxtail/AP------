/* Keep legacy handoffs intact; ordinary archive visits enter the workspace. */
(function () {
  const params = new URLSearchParams(location.search);
  if (params.get('legacy') === '1' || params.has('archive2Issue') || params.has('unitPastAssign')) return;
  const target = new URL('workspace.html', location.href);
  target.search = location.search;
  target.hash = location.hash;
  location.replace(target.href);
})();
