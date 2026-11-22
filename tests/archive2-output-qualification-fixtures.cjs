'use strict';

// Inputs for the measurable output harness, taken from the CURRENT checkout.
// No exam file hash, question hash or past commit is pinned: exam sources are
// edited over time, and this harness only needs real questions to render.
const H = require('./archive2-solution-loading-browser.cjs');

const SOURCE_FILES = [
  'archive/exams/original/middle/m1/2final/25_왕운중_2학기_기말_중1_기출.js',
  'archive/exams/original/middle/m1/2final/25_팔마중_2학기_기말_중1_기출.js',
  'archive/exams/original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js',
  'archive/exams/original/high/h2/2final/25_매산여고_2학기_기말_고2_수학II.js',
  'archive/exams/test-fixtures/render-authority-golden.js'
];
// id, kind, questions per page, how many mixed questions an envelope/legacy fixture takes, source files
const FIXTURE_SPECS = [
  ['envelope50', 'envelope', 4, 50, [0, 1, 2]],
  ['envelope50-qpp1', 'envelope', 1, 50, [0, 1, 2]],
  ['images24', 'original', 4, 0, [1]],
  ['long23', 'original', 4, 0, [3]],
  ['ordinary', 'original', 4, 0, [0]],
  ['envelope8', 'envelope', 4, 8, [0]],
  ['legacy50', 'legacy', 4, 50, [0, 1, 2]],
  ['continuation-golden', 'original', 4, 0, [4]]
].map(([id, kind, qpp, take, sources]) => ({ id, kind, qpp, take, sources: sources.map(i => SOURCE_FILES[i]) }));

function requireThat(condition, code, details) {
  if (!condition) throw Object.assign(new Error(code), { code, details });
}

function loadQualificationFixtures(root) {
  const mixed = H.realFixture(root);
  const fixtures = FIXTURE_SPECS.map(spec => {
    const questions = spec.kind === 'original' ? H.loadBank(root, spec.sources[0]) : mixed.slice(0, spec.take);
    requireThat(questions.length > 0 && (spec.kind === 'original' || questions.length === spec.take),
      'OUTPUT_FIXTURE_QUESTIONS_MISSING', { fixture: spec.id });
    return {
      id: spec.id, kind: spec.kind, qpp: spec.qpp, questions,
      sources: spec.sources.map(file => ({ file }))
    };
  });
  // Current files are served as they are; there is no source overlay.
  return { fixtures, sourceOverlay: undefined };
}

module.exports = { loadQualificationFixtures };
