/*
 * Keep short inline formulas on one line.
 *
 * Every Archive page enables MathJax inline linebreaking
 * (output.linebreaks.inline) so a very long formula cannot run past its
 * column.  The side effect is that a short formula such as `y=\sqrt{2x}` or
 * `x^2-4x+k<0` is also cut at a relation/operator whenever it reaches the end
 * of a line.  MathJax does not break inside a single \mathord{} atom, so a
 * TeX pre-filter wraps only the short inline formulas in one.  Long formulas,
 * display math and multi-line environments are left alone and still break.
 *
 * Load this after the window.MathJax configuration and before the MathJax
 * script.  The page text, the stored question data and the content
 * fingerprints are not touched; only the TeX string MathJax compiles changes.
 */
(function () {
  'use strict';
  var MAX_WEIGHT = 24;
  var cfg = window.MathJax;
  if (!cfg || typeof cfg !== 'object' || window.__AP_ATOMIC_INLINE_MATH__) return;
  window.__AP_ATOMIC_INLINE_MATH__ = true;

  function plainWeight(tex) {
    return tex.replace(/\\[a-zA-Z]+/g, '__').replace(/[{}\s]/g, '').length;
  }

  // Approximate typeset width: control word = 2, stacked fraction = its wider
  // side, `cases` block = its widest row.  About 9-10 px per unit at 13px text.
  function breakWeight(tex) {
    var t = tex;
    for (var i = 0; i < 8; i++) {
      var next = t.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, function (_, a, b) {
        return '{' + 'X'.repeat(Math.max(plainWeight(a), plainWeight(b))) + '}';
      });
      if (next === t) break;
      t = next;
    }
    t = t.replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, function (_, body) {
      var widest = 0;
      body.split('\\\\').forEach(function (row) { widest = Math.max(widest, plainWeight(row.replace(/&/g, ''))); });
      return '{' + 'X'.repeat(widest) + '}';
    });
    return plainWeight(t);
  }

  function shouldAtomize(tex) {
    if (!tex || !tex.trim() || /^\s*\\mathord\{/.test(tex)) return false;
    // Only a plain `cases` block may contain row breaks and `&`.
    var outside = tex.replace(/\\begin\{cases\}[\s\S]*?\\end\{cases\}/g, '');
    if (/\\\\|\\begin|\\end|\\displaystyle|\\tag|\\newline|\\break|\\allowbreak|\\goodbreak|\\nobreak|\\text|\\mbox|\\hbox|&/.test(outside)) return false;
    var depth = 0;
    var bare = tex.replace(/\\[{}]/g, '');
    for (var i = 0; i < bare.length; i++) {
      if (bare[i] === '{') depth++;
      else if (bare[i] === '}' && --depth < 0) return false;
    }
    return depth === 0 && breakWeight(tex) <= MAX_WEIGHT;
  }

  function install() {
    var doc = window.MathJax && window.MathJax.startup && window.MathJax.startup.document;
    var tex = doc && doc.inputJax && doc.inputJax.filter(function (j) { return j.name === 'TeX'; })[0];
    if (!tex || !tex.preFilters) return;
    tex.preFilters.add(function (data) {
      var math = data.math;
      if (!math || math.display || typeof math.math !== 'string') return;
      if (shouldAtomize(math.math)) math.math = '\\mathord{' + math.math + '}';
    });
  }

  cfg.startup = cfg.startup || {};
  var previousReady = cfg.startup.ready;
  cfg.startup.ready = function () {
    if (typeof previousReady === 'function') previousReady.apply(this, arguments);
    else window.MathJax.startup.defaultReady();
    try { install(); } catch (error) { console.warn('[atomic-inline-math] install failed', error); }
  };
})();
