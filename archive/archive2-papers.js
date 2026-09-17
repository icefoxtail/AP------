/* Paper-level completion state. An assignment receipt freezes only that paper. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2Papers = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const partIndex = (index) => Math.floor(index / 50);
  const receipt = (receipts, index) =>
    receipts.find((r) => r.partIndex === index);
  const lockedUids = (receipts) =>
    new Set(receipts.flatMap((r) => r.questionUids || []));
  function status(count, receipts) {
    const total = Math.ceil(count / 50),
      saved = new Set(receipts.map((r) => r.partIndex)).size;
    return {
      total,
      saved,
      pending: Math.max(0, total - saved),
      complete: total > 0 && saved === total,
      pdfPending: receipts.filter((r) => !r.ready).length,
    };
  }
  function preserve(before, replacements, receipts) {
    const locked = lockedUids(receipts);
    return before.map((q, i) =>
      locked.has(q.questionUid) ? q : replacements[i],
    );
  }
  return { partIndex, receipt, lockedUids, status, preserve };
});
