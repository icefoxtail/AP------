'use strict';

// Recover only the five source JS blobs used by measurable output qualification.
// Report hashes are computed from recovered bytes and loaded questions. The
// release gate's existing fixtureSpecs remain the authority for expected hashes.
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { qualificationSourceRevision } = require('./archive2-output-comparison-references.json');
const { fixtureSpecs } = require('./archive2-output-release-qualification.cjs');
const H = require('./archive2-solution-loading-browser.cjs');

const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sourceSpecs = new Map(fixtureSpecs.flatMap(fixture => fixture.sources.map(source => [source.file, source])));

function requireThat(condition, code, details) {
  if (!condition) throw Object.assign(new Error(code), { code, details });
}

function loadQualificationFixtures(root, { readBlob = file => execFileSync('git', ['show', qualificationSourceRevision + ':' + file], {
  cwd: root, stdio: ['ignore', 'pipe', 'pipe'], timeout: 30_000,
}) } = {}) {
  requireThat(/^[a-f0-9]{40}$/.test(qualificationSourceRevision), 'QUALIFICATION_SOURCE_REVISION_INVALID');
  const sourceBytes = new Map();
  for (const [file, expected] of sourceSpecs) {
    let bytes;
    try { bytes = readBlob(file); }
    catch { requireThat(false, 'QUALIFICATION_SOURCE_BLOB_MISSING', { file }); }
    requireThat(Buffer.isBuffer(bytes) && hash(bytes) === expected.sha256,
      'QUALIFICATION_SOURCE_HASH_MISMATCH', { file });
    sourceBytes.set(file, Buffer.from(bytes));
  }
  const readSource = file => {
    const bytes = sourceBytes.get(file);
    requireThat(bytes, 'QUALIFICATION_SOURCE_UNEXPECTED', { file });
    return bytes;
  };
  const mixed = H.realFixture(root, readSource);
  const fixtures = fixtureSpecs.map(spec => {
    const questions = spec.kind === 'original' ? H.loadBank(root, spec.sources[0].file, readSource) : mixed.slice(0, spec.questions);
    const inputSha256 = hash(JSON.stringify(questions));
    requireThat(questions.length === spec.questions && inputSha256 === spec.inputSha256,
      'QUALIFICATION_INPUT_HASH_MISMATCH', { fixture: spec.id });
    return {
      id: spec.id, kind: spec.kind, qpp: spec.qpp, questions,
      sources: spec.sources.map(({ file }) => ({ file, sha256: hash(readSource(file)) })),
      inputSha256,
    };
  });
  return {
    fixtures,
    sourceOverlay: pathname => pathname.startsWith('/') ? sourceBytes.get(pathname.slice(1)) : undefined,
  };
}

module.exports = { loadQualificationFixtures };
