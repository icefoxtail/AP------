/* Student portal: one way to download the small build files and exam JS files the self-study screens need.
   Why: a download that fails or hangs must never look like "no more questions". Every request here has a time limit
   (TIMEOUT_MS, the only place the value lives) and a failure says WHAT kind it was:
   - error.transient === true: the connection failed, the server answered 5xx / 429 / anything but "not found", or the time ran out,
     or the body could not be read. The same request may work a moment later, so the caller shows "try again", never "none left".
   - error.transient === false: the file is really not there (404 / 410). The caller skips that one question.
   Callers hand in their own fetch (tests use a fake one); nothing here touches the page. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StudentFetch = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const TIMEOUT_MS = 15000;

  function failure(code, extra) {
    const error = new Error(code);
    error.code = code;
    error.transient = true;
    return Object.assign(error, extra || {});
  }
  const isTransient = error => Boolean(error && error.transient === true);

  /**
   * GET url with a time limit; resolves the body ('text' or 'json'). Rejects with an Error carrying
   * { code: 'REQUEST_TIMEOUT' | 'REQUEST_NETWORK' | 'REQUEST_FAILED' | 'REQUEST_BODY' | 'REQUEST_NOT_FOUND', transient, status }.
   */
  function request(fetchImpl, url, { read = 'text', timeoutMs = TIMEOUT_MS } = {}) {
    if (typeof fetchImpl !== 'function') return Promise.reject(failure('REQUEST_NETWORK'));
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    let timer = null;
    const timeout = new Promise((resolve, reject) => {
      timer = setTimeout(() => {
        try { controller?.abort(); } catch (error) { /* nothing to cancel */ }
        reject(failure('REQUEST_TIMEOUT'));
      }, timeoutMs);
    });
    const work = (async () => {
      let response;
      try { response = await (controller ? fetchImpl(url, { signal: controller.signal }) : fetchImpl(url)); } catch (error) { throw failure('REQUEST_NETWORK'); }
      if (!response || !response.ok) {
        const status = Number(response?.status) || 0;
        const missing = status === 404 || status === 410;
        throw failure(missing ? 'REQUEST_NOT_FOUND' : 'REQUEST_FAILED', { status, transient: !missing });
      }
      try { return read === 'json' ? await response.json() : await response.text(); } catch (error) { throw failure('REQUEST_BODY'); }
    })();
    return Promise.race([work, timeout]).finally(() => clearTimeout(timer));
  }

  return { TIMEOUT_MS, request, isTransient, failure };
});
