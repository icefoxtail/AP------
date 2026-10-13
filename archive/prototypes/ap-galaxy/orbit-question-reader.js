// AP Galaxy: on-demand canonical exam-ID discovery and same-origin Archive engine focus.
// This is a presentation adapter. It does not re-render math, answers, or solutions.
(() => {
  'use strict';
  const SAFE_FILE = /^original\/[\p{L}\p{N}._()\-/ ]+\.js$/u;
  let active = null;
  let generation = 0;

  function abort() {
    generation++;
    if (active) {
      active.finish(null, new Error('QUESTION_LOAD_CANCELLED'));
      active = null;
    }
  }

  function load(file) {
    abort();
    if (typeof file !== 'string' || !SAFE_FILE.test(file) || file.includes('..')) {
      return Promise.reject(new Error('INVALID_EXAM_FILE'));
    }
    const token = ++generation;
    const source = new URL('../../exams/' + file, location.href);
    if (source.origin !== location.origin) return Promise.reject(new Error('CROSS_ORIGIN_EXAM_FILE'));
    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    iframe.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-10000px;top:-10000px';
    const documentText = '<!doctype html><meta charset="utf-8">' +
      '<script src="' + source.href.replaceAll('&', '&amp;').replaceAll('"', '&quot;') +
      '" onerror="window.__apGalaxyScriptFailed=true"><\/script>' +
      '<script>try{if(window.__apGalaxyScriptFailed)throw Error("EXAM_SCRIPT_LOAD_FAILED");' +
      'var raw=window.questionBank;' +
      'var items=Array.isArray(raw)?raw:(raw&&Array.isArray(raw.questions)?raw.questions:raw&&Array.isArray(raw.problems)?raw.problems:null);' +
      'if(!items||!items.length)throw Error("EMPTY_EXAM_DATA");' +
      'var rows=items.map(function(q,i){return {id:q&&q.id,ordinal:i+1,sourceUid:q&&(q.questionUid||q.sourceQuestionUid||q.source_question_uid||"")}});' +
      'parent.postMessage({kind:"AP_GALAXY_IDS",token:' + token + ',file:' +
      JSON.stringify(file).replaceAll('<', '\\u003c') + ',rows:rows},"*");' +
      '}catch(e){parent.postMessage({kind:"AP_GALAXY_IDS",token:' + token + ',file:' +
      JSON.stringify(file).replaceAll('<', '\\u003c') +
      ',error:String(e.message||e)},"*")};<\/script>';
    return new Promise((resolve, reject) => {
      let timer;
      const finish = (rows, error) => {
        window.removeEventListener('message', receive);
        clearTimeout(timer);
        iframe.remove();
        if (active?.token === token) active = null;
        if (error) reject(error);
        else resolve(rows);
      };
      const receive = (event) => {
        const data = event.data;
        if (event.source !== iframe.contentWindow || token !== generation ||
            !data || data.kind !== 'AP_GALAXY_IDS' || data.token !== token || data.file !== file) return;
        if (data.error) return finish(null, new Error(data.error));
        if (!Array.isArray(data.rows) || !data.rows.length || data.rows.length > 200) {
          return finish(null, new Error('INVALID_QUESTION_COUNT'));
        }
        const ids = new Set();
        const rows = [];
        for (const item of data.rows) {
          const id = item?.id;
          // Only source-declared IDs; never invent ordinal IDs for missing data.
          if (!(typeof id === 'string' || typeof id === 'number') || !String(id).trim()
            || !Number.isInteger(item.ordinal) || item.ordinal !== rows.length + 1 || ids.has(String(id))) {
            return finish(null, new Error('MISSING_OR_DUPLICATE_QUESTION_ID'));
          }
          ids.add(String(id));
          rows.push({ id: String(id), ordinal: item.ordinal,
            sourceUid: typeof item.sourceUid === 'string' ? item.sourceUid : '' });
        }
        finish(rows);
      };
      active = { token, finish };
      window.addEventListener('message', receive);
      timer = setTimeout(() => finish(null, new Error('EXAM_ID_LOAD_TIMEOUT')), 12000);
      iframe.srcdoc = documentText;
      document.body.appendChild(iframe);
    });
  }

  function resolveRenderedItem(doc, row, mode) {
    const area = doc.getElementById('print-area');
    if (!area) return null;
    const list = mode === 'ans'
      ? [...area.querySelectorAll('.ans-cell:not(.ans-cell-empty)')]
      : [...area.querySelectorAll('.q-box')];
    // Shared rendering remains authoritative. DOM labels are checked against
    // the exact source ordinal to avoid showing a neighboring answer.
    const expected = row.ordinal + '.';
    return list.find((node) => {
      const label = node.querySelector(mode === 'ans' ? '.ans-n' : '.q-num');
      return label && label.textContent.trim() === expected
        && (mode === 'ans' || (mode === 'sol') === node.classList.contains('sol-box'));
    }) || null;
  }

  // Screen-only view of the same engine DOM. Print rules and shared math rendering stay untouched.
  const READER_STYLE = `
    @media screen {
      body.ap-galaxy-reading { overflow-x:hidden!important; padding-top:44px!important; }
      body.ap-galaxy-reading #print-area {
        display:block!important; width:100%!important; max-width:100%!important;
        margin:0!important; padding:14px!important; box-sizing:border-box!important;
        transform:none!important; min-height:0!important;
      }
      body.ap-galaxy-reading #print-area .page {
        display:contents!important; width:auto!important; height:auto!important;
        min-height:0!important; overflow:visible!important; box-shadow:none!important;
      }
      body.ap-galaxy-reading #print-area .page-header,
      body.ap-galaxy-reading #print-area .page-exam-frame,
      body.ap-galaxy-reading #print-area .page-footer,
      body.ap-galaxy-reading #print-area .grid-container::after { display:none!important; }
      body.ap-galaxy-reading #print-area .grid-container {
        display:block!important; width:100%!important; min-height:0!important;
        grid-template-columns:minmax(0,1fr)!important;
      }
      body.ap-galaxy-reading #print-area .grid-col {
        display:block!important; width:100%!important; height:auto!important;
        min-height:0!important; padding:0!important; overflow:visible!important;
      }
      body.ap-galaxy-reading #print-area .q-box,
      body.ap-galaxy-reading #print-area .ans-cell { display:none!important; }
      body.ap-galaxy-reading #print-area .q-box.ap-galaxy-selected-question {
        display:flex!important; flex:none!important; width:100%!important; max-width:100%!important;
        min-height:0!important; padding:18px 12px!important; margin:0!important;
        height:auto!important; overflow:visible!important; font-size:16px!important;
        line-height:1.7!important; box-sizing:border-box!important;
      }
      body.ap-galaxy-reading #print-area .q-box.ap-galaxy-selected-question .q-content,
      body.ap-galaxy-reading #print-area .q-box.ap-galaxy-selected-question .choices,
      body.ap-galaxy-reading #print-area .q-box.ap-galaxy-selected-question .sol-exp {
        font-size:16px!important; line-height:1.7!important; max-width:100%!important;
      }
      body.ap-galaxy-reading #print-area .choices-compact,
      body.ap-galaxy-reading #print-area .choices-grid {
        display:flex!important; flex-direction:column!important; flex-wrap:nowrap!important;
      }
      body.ap-galaxy-reading #print-area .choice-item { width:100%!important; min-width:0!important; }
      body.ap-galaxy-reading #print-area .ans-grid {
        display:block!important; width:100%!important;
      }
      body.ap-galaxy-reading #print-area .ans-cell.ap-galaxy-selected-question {
        display:flex!important; width:100%!important; min-height:70px!important;
        padding:18px 14px!important; font-size:18px!important; box-sizing:border-box!important;
      }
      body.ap-galaxy-reading #print-area .ap-galaxy-selected-question img,
      body.ap-galaxy-reading #print-area .ap-galaxy-selected-question svg,
      body.ap-galaxy-reading #print-area .ap-galaxy-selected-question mjx-container {
        max-width:100%!important;
      }
      body.ap-galaxy-reading #print-area .ap-galaxy-selected-question {
        outline:2px solid #67a7e9!important; outline-offset:-2px!important;
        scroll-margin-top:58px!important; background:#f2f8ff!important;
        overflow-wrap:anywhere!important;
      }
    }
  `;

  function currentEngineDocument(iframe, expected) {
    try {
      const win = iframe.contentWindow;
      const doc = iframe.contentDocument;
      if (!win || !doc || win.location.origin !== location.origin) return null;
      const url = new URL(win.location.href);
      if (!url.pathname.endsWith('/archive/engine.html') ||
          url.searchParams.get('data') !== 'exams/' + expected.file ||
          url.searchParams.get('ap_galaxy_load') !== String(expected.loadGeneration) ||
          url.searchParams.get('preview') !== '1' || doc.readyState !== 'complete') return null;
      if (!doc.getElementById('print-area')) throw new Error('ENGINE_DOCUMENT_INVALID');
      return doc;
    } catch (error) {
      if (error.message === 'ENGINE_DOCUMENT_INVALID') throw error;
      return null;
    }
  }

  async function focus(iframe, row, mode, expected, isCurrent) {
    if (!row || !['exam','ans','sol'].includes(mode)) throw new Error('INVALID_QUESTION_MODE');
    if (!expected || !expected.file || !Number.isInteger(expected.loadGeneration) ||
        typeof isCurrent !== 'function') throw new Error('INVALID_ENGINE_SELECTION');
    const deadline = performance.now() + 20000;
    let readyDocument = null;
    let modeClicked = false;
    while (performance.now() < deadline) {
      if (!isCurrent()) throw new Error('STALE_QUESTION_SELECTION');
      const doc = currentEngineDocument(iframe, expected);
      if (!doc) {
        await new Promise(r => setTimeout(r, 100));
        continue;
      }
      if (readyDocument !== doc) { readyDocument = doc; modeClicked = false; }
      const tab = doc.getElementById('btn-' + mode);
      if (!tab) throw new Error('ENGINE_MODE_NOT_AVAILABLE');
      if (!modeClicked) {
        if (!tab.classList.contains('active')) tab.click();
        modeClicked = true;
      }
      if (!isCurrent()) throw new Error('STALE_QUESTION_SELECTION');
      const target = resolveRenderedItem(doc, row, mode);
      const correctMode = doc.getElementById('btn-' + mode)?.classList.contains('active');
      if (correctMode && target?.isConnected) {
        if (!doc.getElementById('ap-galaxy-question-focus-style')) {
          const style = doc.createElement('style');
          style.id = 'ap-galaxy-question-focus-style';
          style.textContent = READER_STYLE;
          doc.head.appendChild(style);
        }
        doc.querySelectorAll('.ap-galaxy-selected-question').forEach(node =>
          node.classList.remove('ap-galaxy-selected-question'));
        target.classList.add('ap-galaxy-selected-question');
        doc.body.classList.add('ap-galaxy-reading');
        target.scrollIntoView({block:'start',behavior:'instant'});
        return {ordinal:row.ordinal,id:row.id,mode,text:target.innerText.slice(0,160)};
      }
      if (doc.documentElement?.dataset?.apRenderError) throw new Error('ENGINE_RENDER_FAILED');
      await new Promise(r => setTimeout(r, 150));
    }
    throw new Error('ENGINE_OR_QUESTION_LOAD_TIMEOUT');
  }

  function clearFocus(iframe) {
    try {
      const doc = iframe.contentDocument;
      doc?.body?.classList.remove('ap-galaxy-reading');
      doc?.querySelectorAll('.ap-galaxy-selected-question').forEach(
        node => node.classList.remove('ap-galaxy-selected-question'));
    } catch (_) { /* closed or navigating iframe */ }
  }

  window.APOrbitQuestionReader = Object.freeze({ load, abort, focus, clearFocus });
})();
