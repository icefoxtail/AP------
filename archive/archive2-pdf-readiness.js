/* Shared browser/Worker PDF readiness gate. No success is sealed on partial assets. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2PdfReadiness = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  function fail(message) {
    throw new Error(`PDF readiness failed: ${message}`);
  }

  function withTimeout(promise, timeoutMs, message) {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }

  function assertIdentity(actual, expected, label) {
    if (!actual || actual.contractVersion !== expected.contractVersion ||
        actual.outputRequestId !== expected.outputRequestId ||
        actual.payloadHash !== expected.payloadHash)
      fail(`${label} does not match the requested envelope.`);
  }

  async function assertReady(expectedEnvelope = null, options = {}) {
    const document = options.document || root.document;
    const window = options.window || root.window || root;
    if (!document) fail("document is unavailable.");

    if (window.__AP_OUTPUT_RENDER_ERROR__)
      fail(String(window.__AP_OUTPUT_RENDER_ERROR__));
    if (window.__AP_RENDER_READY__) {
      const render = await withTimeout(
        Promise.resolve(window.__AP_RENDER_READY__),
        options.renderTimeoutMs || 45_000,
        "render readiness timed out.",
      );
      if (render?.ok !== true || !Number(render.pages))
        fail(render?.message || render?.code || "render did not complete.");
    }
    if (expectedEnvelope) {
      assertIdentity(window.__AP_OUTPUT_ENVELOPE_READY__, expectedEnvelope, "verified envelope");
      if (window.__AP_OUTPUT_RENDER_READY__)
        assertIdentity(window.__AP_OUTPUT_RENDER_READY__, expectedEnvelope, "rendered output");
      else if (!window.__AP_RENDER_READY__)
        fail("render has not started for the requested envelope.");
    }

    if (document.fonts?.ready)
      await withTimeout(document.fonts.ready, options.fontTimeoutMs || 10_000, "font readiness timed out.");
    if (window.__AP_MATHJAX_READY__) {
      const mathReady = await withTimeout(
        Promise.resolve(window.__AP_MATHJAX_READY__),
        options.mathTimeoutMs || 15_000,
        "MathJax readiness timed out.",
      );
      if (mathReady === false) fail("MathJax did not become ready.");
    }
    if (window.MathJax?.startup?.promise)
      await withTimeout(window.MathJax.startup.promise, options.mathTimeoutMs || 15_000, "MathJax startup timed out.");
    const printArea = document.getElementById("print-area");
    if (window.APRenderLoop?.unrenderedMathCount &&
        window.APRenderLoop.unrenderedMathCount(printArea))
      fail("math typesetting is incomplete.");

    const images = Array.from(document.querySelectorAll("#print-area img"));
    await Promise.all(images.map(async (image, index) => {
      const imageTimeoutMs = options.imageTimeoutMs || 10_000;
      if (!image.complete) {
        await withTimeout(new Promise((resolve, reject) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", () => reject(new Error(`required image ${index + 1} failed to load.`)), { once: true });
        }), imageTimeoutMs, `required image ${index + 1} timed out.`);
      }
      if (!image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0)
        fail(`required image ${index + 1} is unavailable.`);
      if (typeof image.decode === "function")
        await withTimeout(image.decode(), options.decodeTimeoutMs || 5_000, `required image ${index + 1} decode timed out.`);
    }));

    const pages = Array.from(document.querySelectorAll("#print-area .page"));
    if (!pages.length) fail("rendered exam has no pages.");
    const tolerance = options.layoutTolerancePx ?? 3;
    const overflowing = pages.filter(page =>
      page.scrollHeight > page.clientHeight + tolerance ||
      page.scrollWidth > page.clientWidth + tolerance,
    );
    if (overflowing.length) fail(`layout overflow detected on ${overflowing.length} page(s).`);
    const clippingAncestors = Array.from(document.querySelectorAll("#print-area .page *")).filter(element => {
      const style = window.getComputedStyle?.(element) || root.getComputedStyle?.(element);
      if (!style) return false;
      const clipsX = ["hidden", "clip"].includes(style.overflowX);
      const clipsY = ["hidden", "clip"].includes(style.overflowY);
      return (clipsX && element.scrollWidth > element.clientWidth + tolerance) ||
        (clipsY && element.scrollHeight > element.clientHeight + tolerance);
    });
    if (clippingAncestors.length)
      fail(`content clipped inside ${clippingAncestors.length} element(s).`);
    return { pageCount: pages.length, imageCount: images.length };
  }

  return { assertReady };
});
