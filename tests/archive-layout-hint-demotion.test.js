// 2026-11-18 사용자 결정: 문제 모드 렌더는 모든 문항을 칸에 먼저 놓는다. 데이터의 배치 태그는 힌트일 뿐이고 렌더용 사본에서만 지운다.
// 작성자가 꼭 한 단 전체를 원할 때만 layoutForce: "subjective-2up"을 따른다.
const test = require('node:test');
const assert = require('node:assert/strict');
const N = require('../archive/render-state-normalizer.js');
const layers = require('../archive/question-field-layers.js');

test('layout hints in data are ignored for the first placement', () => {
  for (const tag of ['fullwidth', 'full', 'full-width', 'wide', 'desc', 'subjective-2up', 'subjective-4up', 'grid', undefined]) {
    const source = Object.freeze({ id: 1, layoutTag: tag, wide: true, content: 'x' });
    const out = N.renderQuestionLayout(source);
    assert.equal(out.layoutTag, '', `tag ${tag}`);
    assert.equal(out.wide, false);
    assert.equal(out.content, 'x');
    assert.equal(source.wide, true, 'the data itself is not modified');
  }
  assert.equal(N.renderLayoutTag('fullwidth'), '');
});

test('layoutForce keeps a one-column question and is a render-only field', () => {
  const out = N.renderQuestionLayout({ id: 2, layoutTag: 'fullwidth', layoutForce: 'subjective-2up' });
  assert.equal(out.layoutTag, 'subjective-2up');
  assert.equal(N.renderQuestionLayout({ id: 3, layoutForce: 'fullwidth' }).layoutTag, '');
  assert.ok(N.RENDER_FIELDS.includes('layoutForce'));
  assert.ok(layers.RENDER_ONLY_FIELDS.includes('layoutForce'));
  assert.equal(layers.isRenderOnlyField('layoutForce'), true);
  assert.equal(N.renderQuestionLayout(null), null);
});

test('promotion only helps height-limited questions and the authority path promotes clipped ones instead of hiding them', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const slot = fs.readFileSync(path.join(__dirname, '../archive/equal-slot-engine.js'), 'utf8');
  assert.match(slot, /byWidth/);
  assert.match(slot, /!byWidth && canPromote/);
  assert.match(slot, /overflowReason/);
  const materializer = fs.readFileSync(path.join(__dirname, '../archive/layout-materializer.js'), 'utf8');
  assert.match(materializer, /clippedExamBoxes/);
  assert.match(materializer, /LAYOUT_OVERFLOW/);
  assert.match(materializer, /promoted\.add\(index\)/);
});
