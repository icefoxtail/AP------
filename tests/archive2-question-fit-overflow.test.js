'use strict';
// S17: a question that cannot be squeezed into its slot by the font/image steps is scaled to fit,
// never cut off by the slot's overflow:hidden (that cut-off made "PDF readiness failed: content
// clipped" fail whole compose papers whenever the random draw hit such a question).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '..', 'archive', 'mixed_engine.html'), 'utf8');
const start = html.indexOf('const Q_FIT_SCALE_MIN');
const end = html.indexOf('function makeSolutionHtmlChunks');
const fitSource = html.slice(start, end);
const autoCompressSource = html.slice(html.indexOf('function autoCompress'), html.indexOf('// 마지막 수단'));
const svgRule = /\.q-content svg\[viewBox\][^{]*\{[^}]*\}/.exec(html)?.[0] || '';

test('the fit helpers and the inline-SVG rule are present in the compose output page', () => {
  assert.ok(start > 0 && end > start, 'fitQuestionOverflow block is missing');
  assert.match(fitSource, /function fitQuestionOverflow\(box\)/);
  assert.match(fitSource, /function fitQuestionBox\(box\)[\s\S]*fitQuestionOverflow\(box\)/);
  assert.match(svgRule, /max-width:\s*100%/);
  assert.match(svgRule, /height:\s*auto/);
});

function loadChromium() {
  try {
    const modulePath = process.env.AP_PLAYWRIGHT_MODULE || 'playwright';
    return require(modulePath).chromium;
  } catch (_) { return null; }
}

test('questions wider or taller than their slot are scaled to fit, fitting ones are untouched', async (t) => {
  const chromium = loadChromium();
  if (!chromium) return t.skip('playwright is not installed');
  let browser;
  try { browser = await chromium.launch(); } catch (_) { return t.skip('chromium is not available'); }
  try {
    const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
    await page.setContent(`<!doctype html><style>
      body{margin:0}.grid-col{display:flex;flex-direction:column;width:316px;height:470px;overflow:hidden}
      .q-box{flex:1;padding:10px 0;display:flex;flex-direction:column;min-height:0;overflow:hidden}
      .fit-tight{font-size:9.1pt!important}.fit-tighter{font-size:8.6pt!important}.fit-micro{font-size:8.1pt!important}
      .q-content{overflow-wrap:anywhere} ${svgRule}
      </style><div class="grid-col" id="col"></div>`);
    const result = await page.evaluate(({ fitSource, autoCompressSource }) => {
      const factory = new Function(`${autoCompressSource}\n${fitSource}\nreturn { fitQuestionBox, resetQuestionFitScale };`);
      const { fitQuestionBox } = factory();
      const col = document.getElementById('col');
      const make = (name, body) => {
        col.innerHTML = '';
        const box = document.createElement('div');
        box.className = 'q-box';
        box.innerHTML = `<div class="q-num">1.</div><div class="q-content">${body}</div>`;
        col.appendChild(box);
        return box;
      };
      const state = box => ({
        fits: box.scrollHeight <= box.clientHeight + 1 && box.scrollWidth <= box.clientWidth + 3,
        scale: box.dataset.fitScale || null,
        wrapped: !!box.querySelector(':scope > .q-fit-scale'),
      });
      const cases = {};
      const run = (name, body) => {
        const box = make(name, body);
        const text = box.textContent;
        const before = state(box);
        fitQuestionBox(box);
        const after = state(box);
        fitQuestionBox(box); // re-running (print guard repair) must be idempotent
        cases[name] = { before, after, again: state(box), textKept: box.textContent === text };
      };
      run('short', '<p>짧은 문항</p>');
      run('wide-block', `<div style="width:641px">${'가나다라 '.repeat(8)}</div>`);
      run('tall-block', `<div style="height:1500px">${'긴 문항'}</div>`);
      run('fixed-svg', '<svg width="400" height="180" viewBox="0 0 400 180"><rect width="400" height="180" fill="#ccc"/></svg>');
      run('inline-style-image', '<div style="display:block;width:320px;height:100px;background:#ccc"></div>');
      return cases;
    }, { fitSource, autoCompressSource });
    assert.deepEqual(result.short.after, { fits: true, scale: null, wrapped: false }, 'a fitting question must be left alone');
    for (const name of ['wide-block', 'tall-block', 'inline-style-image']) {
      assert.equal(result[name].before.fits, false, `${name} should overflow before fitting`);
      assert.equal(result[name].after.fits, true, `${name} should fit afterwards`);
      assert.ok(Number(result[name].after.scale) > 0 && Number(result[name].after.scale) < 1, `${name} scale`);
      assert.equal(result[name].again.fits, true, `${name} stays fitted when fitted again`);
      assert.equal(result[name].textKept, true, `${name} text must be unchanged`);
    }
    // The CSS rule alone keeps a fixed-width SVG inside the column, without scaling the question.
    assert.equal(result['fixed-svg'].after.fits, true);
    assert.equal(result['fixed-svg'].after.scale, null);
  } finally { await browser.close(); }
});
