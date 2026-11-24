// Loads the figure names (archive/data/svg-accessibility-index.js) the way a phone on a slow network can afford: only the records of the figures the
// window is about to draw, as one small file per exam (tools/lib/build-archive2-svg-alt-part.mjs), instead of the 1.4 MB compressed whole index
// as a parser-blocking script that held window.onload (and with it the exam file and the first question) back for seconds.
//
// The window calls APSvgAccessibilityLazy.prepare(questions, examFiles) after it has the questions and before it draws the first one, so the alternative
// text is attached when the figure is drawn, exactly as before: the same records reach the same resolver (archive/svg-accessibility.js), only fewer.
// A file is used only when it belongs to the release of the shard index fetched with it, names this exam, and lists (`refs`) every figure the
// questions are about to draw. Anything else (no file, another release, a figure the file does not list, no crypto, a slow answer of more than
// 8 seconds) loads the whole index script exactly as the static tag did. prepare() never rejects and never waits forever.
(function (root) {
  'use strict';
  const SCHEMA = 'archive2-svg-alt-v1';
  const DIR = 'data/archive2-catalog-shards-v1/';
  const TIMEOUT_MS = 8000;
  const resolver = root.APSvgAccessibility;
  const baseUri = () => (root.document && root.document.baseURI) || (root.location && root.location.href) || '';

  // the same normalization as archive/question-meta.js sourceFile() (and the builder's normalizeExamFile)
  const sourceFile = value => String(value || '').replace(/\\/g, '/').replace(/^\.?\/?archive\/exams\//, '').replace(/^\.?\/?exams\//, '').replace(/^\/+/, '').replace(/[?#].*$/, '').trim();
  const examKey = async exam => {
    const bytes = new TextEncoder().encode(exam);
    const digest = new Uint8Array(await root.crypto.subtle.digest('SHA-256', bytes));
    return Array.from(digest.slice(0, 16), byte => byte.toString(16).padStart(2, '0')).join('');
  };
  const fetchJson = (name, init) => {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), TIMEOUT_MS) : null;
    return fetch(new URL(name, baseUri()), { ...init, ...(controller ? { signal: controller.signal } : {}) })
      .then(response => { if (!response.ok) throw new Error('svg alt HTTP ' + response.status); return response.json(); })
      .finally(() => { if (timer) clearTimeout(timer); });
  };

  let indexPromise = null; // the shard index of this release, fetched once per window
  const readIndex = () => indexPromise || (indexPromise = fetchJson(DIR + 'index.json', { cache: 'no-cache' }));
  const slices = new Map(); // exam file -> Promise<doc>; a failed read stays failed for this window
  const readSlice = exam => {
    if (!slices.has(exam)) {
      slices.set(exam, (async () => {
        if (!exam || !root.crypto || !root.crypto.subtle || typeof TextEncoder !== 'function') throw new Error('no exam file to read');
        const [index, doc] = await Promise.all([readIndex(), examKey(exam).then(key => fetchJson(DIR + 'svg-alt/' + key + '.json'))]);
        if (!index || !index.svgAlt || index.svgAlt.schemaVersion !== SCHEMA || !doc || doc.schemaVersion !== SCHEMA ||
            !index.indexVersion || doc.indexVersion !== index.indexVersion || doc.sourceArchiveFile !== exam ||
            !Array.isArray(doc.refs) || !Array.isArray(doc.records)) throw new Error('svg alt file does not belong to this release or exam');
        return doc;
      })());
      slices.get(exam).catch(() => {}); // read by prepare(); an unread failure must not be reported as unhandled
    }
    return slices.get(exam);
  };

  let fullPromise = null;
  const loadFull = () => fullPromise || (fullPromise = new Promise(resolve => {
    if (root.APSvgAccessibilityIndex && Array.isArray(root.APSvgAccessibilityIndex.records) && !root.APSvgAccessibilityIndex.slice) { resolve('full'); return; }
    const script = root.document.createElement('script');
    script.src = new URL('data/svg-accessibility-index.js?v=20261014.1', baseUri()).href;
    script.onload = () => resolve('full');
    script.onerror = () => { console.warn('[svg-accessibility] 색인 로드 실패 — 그림 이름 한국어 기본값 사용'); resolve('none'); };
    root.document.head.appendChild(script);
  }));

  const figuresOf = questions => {
    const refs = new Set();
    for (const question of Array.isArray(questions) ? questions : []) {
      for (const field of ['image', 'solutionImage']) {
        const value = question && question[field];
        const ref = typeof value === 'string' && resolver ? resolver.normalizeAssetRef(value) : '';
        if (ref) refs.add(ref);
      }
    }
    return refs;
  };

  let installedCover = null; // the figures the installed records cover
  async function prepare(questions, examFiles) {
    try {
      if (!resolver) return 'none';
      const need = figuresOf(questions);
      if (!need.size) return 'none'; // no figure is drawn: the resolver is never asked
      if (root.APSvgAccessibilityIndex && Array.isArray(root.APSvgAccessibilityIndex.records) && !root.APSvgAccessibilityIndex.slice) return 'full';
      // a window that draws again (mode switch) asks again: the records installed before already hold every row of the figures they cover
      if (installedCover && root.APSvgAccessibilityIndex && root.APSvgAccessibilityIndex.slice && [...need].every(ref => installedCover.has(ref))) return 'slice';
      const exams = [...new Set((examFiles || []).map(sourceFile).filter(Boolean))];
      if (!exams.length) return loadFull();
      let timer;
      const docs = await Promise.race([
        Promise.all(exams.map(readSlice)),
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('svg alt files are slow')), TIMEOUT_MS); }),
      ]).finally(() => clearTimeout(timer));
      const covered = new Set();
      const seen = new Set();
      const records = [];
      for (const doc of docs) {
        for (const ref of doc.refs) covered.add(ref);
        for (const record of doc.records) {
          const key = String(record && record.assetRef) + '\u0000' + String(record && record.visualRole);
          if (seen.has(key)) continue;
          seen.add(key);
          records.push(record);
        }
      }
      for (const ref of need) if (!covered.has(ref)) throw new Error('a figure of the questions is not listed in the exam file');
      root.APSvgAccessibilityIndex = { schemaVersion: 'SVG_STUDENT_ACCESSIBILITY_V1', slice: true, records };
      installedCover = covered;
      return 'slice';
    } catch (error) {
      installedCover = null;
      return loadFull();
    }
  }

  // The original-exam window names its exam in the address: start reading its file now, in parallel with the scripts and the exam itself.
  try {
    const exam = sourceFile(new URLSearchParams(root.location.search).get('data'));
    if (exam && root.crypto && root.crypto.subtle) readSlice(exam);
  } catch (error) { /* prepare() reads it when it is needed */ }

  root.APSvgAccessibilityLazy = Object.freeze({ prepare, sourceFile });
}(typeof globalThis !== 'undefined' ? globalThis : this));
