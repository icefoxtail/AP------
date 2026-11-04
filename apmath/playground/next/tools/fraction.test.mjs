import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context = { window: {}, document: { documentElement: { setAttribute() {} } }, location: { search: '' }, URLSearchParams };
vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-core.js', import.meta.url), 'utf8'), context);
const { stackFr } = context.window.APLab;
test('numeric, pi and radical fractions keep exact numerator and denominator', () => {
  for (const [input, tex] of [['π/6', '\\frac{\\pi}{6}'], ['4π/3', '\\frac{4\\pi}{3}'], ['√2/2', '\\frac{\\sqrt{2}}{2}'], ['3√3/4', '\\frac{3\\sqrt{3}}{4}'], ['1/√3', '\\frac{1}{\\sqrt{3}}'], ['1/√2.5', '\\frac{1}{\\sqrt{2.5}}'], ['√2.5/3', '\\frac{\\sqrt{2.5}}{3}']]) {
    assert.equal(stackFr(input, true), `$${tex}$`);
    assert.equal(stackFr(stackFr(input, true), true), stackFr(input, true));
  }
});
test('rendered math, explicit math, URLs, dates and units survive unchanged', () => {
  for (const input of ['$\\frac{a}{b}$', '<span class="katex"><span>1/2</span></span>', '<math><mfrac><mi>a</mi><mi>b</mi></mfrac></math>', '<code>1/2</code>', 'https://example.test/1/2', '2026/11/04', 'km/h', '<a href="/1/2">링크</a>']) assert.equal(stackFr(input, true), input);
});
