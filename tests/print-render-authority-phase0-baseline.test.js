const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const artifactPath = path.join(root, 'reports', 'print-render-authority-v2.2', 'phase-0-dependency-closure.json');
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

function source(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

test('Phase 0 freezes the dependency closure rather than only three renderer files', () => {
  assert.equal(artifact.schemaVersion, 1);
  assert.equal(artifact.planVersion, 'v2.2');
  assert.equal(artifact.phase, 'PHASE_0');
  assert.equal(artifact.status, 'PASS');
  assert.equal(artifact.closureRules.dependencyClosureFrozen, true);
  assert.match(artifact.baseline.gitHead, /^[0-9a-f]{40}$/);
  assert.match(artifact.baseline.planBaseHead, /^[0-9a-f]{40}$/);

  assert.deepEqual(artifact.enginePaths, {
    archive: 'archive/engine.html',
    mixer: 'archive/mixed_engine.html',
    clinic: 'apmath/wrong_print_engine.html'
  });
  assert.ok(artifact.members.length >= 30, 'closure should include producer, transformer, consumer, test, and document edges');

  const roles = new Set(artifact.members.map(member => member.role));
  for (const required of artifact.categories) assert.ok(roles.has(required), `missing ${required} member`);

  const classifications = new Set(artifact.members.map(member => member.classification));
  for (const required of artifact.classifications) assert.ok(classifications.has(required), `missing ${required} classification`);

  for (const member of artifact.members) {
    assert.ok(fs.existsSync(path.join(root, member.path)), `closure member is missing: ${member.path}`);
    assert.ok(Array.isArray(member.evidence) && member.evidence.length > 0, `closure member needs evidence: ${member.path}`);
    if (member.sha256) assert.match(member.sha256, /^[0-9a-f]{64}$/);
  }
});

test('Phase 0 records every current production source hand-off and no false Clinic engine path', () => {
  const byPath = new Map(artifact.members.map(member => [member.path, member]));
  for (const required of [
    'archive/index.html',
    'archive/mixer.html',
    'archive/unit-past-exams.js',
    'archive/assessment/assessment-mvp.html',
    'apmath/student/index.html',
    'apmath/js/core.js',
    'apmath/js/clinic-print.js',
    'apmath/worker-backup/worker/routes/exam-pdf.js',
    'apmath/worker-backup/worker/routes/wrong-clinics.js'
  ]) {
    assert.equal(byPath.get(required)?.role, 'PRODUCER', `missing producer closure for ${required}`);
  }

  const archive = source('archive/engine.html');
  assert.match(archive, /dataUrl\s*=\s*p\.get\('data'\)/);
  assert.match(archive, /APMATH_ARCHIVE_ENGINE_LAUNCH/);

  const mixed = source('archive/mixed_engine.html');
  assert.match(mixed, /localStorage\.getItem\('mixedQuestions_' \+ AppState\.key\)/);
  assert.match(mixed, /loadAssessmentPackFallback\(p\.get\('packId'\)\)/);

  const clinic = source('apmath/wrong_print_engine.html');
  assert.match(clinic, /params\.get\('packet'\)/);
  assert.match(clinic, /params\.get\('set'\)/);
  assert.match(clinic, /params\.get\('wp'\)/);
  assert.match(clinic, /AP_CLINIC_PRINT_PAYLOAD/);
  assert.match(clinic, /AP_CLINIC_PREVIEW/);

  assert.ok(!Object.values(artifact.enginePaths).includes('archive/wrong_print_engine.html'));
  assert.equal(artifact.knownDocumentationFinding.productionPath, 'apmath/wrong_print_engine.html');
});

test('Phase 0 locks observed capability differences without canonicalizing them prematurely', () => {
  assert.deepEqual(artifact.capabilitySnapshot.qpp, {
    archiveUpstream: [4, 6],
    mixerUpstream: [2, 4, 6, 8],
    mixedEngine: [4, 6, 8],
    clinic: [4],
    unadjudicated: ['MIXER_2QPP']
  });
  assert.deepEqual(artifact.capabilitySnapshot.printTransport.archive, ['browser', 'raster', 'native', 'gdi']);
  assert.deepEqual(artifact.capabilitySnapshot.printTransport.mixer, ['browser', 'raster', 'native', 'gdi']);
  assert.deepEqual(artifact.capabilitySnapshot.printTransport.clinic, ['browser']);

  const mixerUpstream = source('archive/mixer.html');
  assert.match(mixerUpstream, /<option value="2">2문항\/P<\/option>/);
  const mixedEngine = source('archive/mixed_engine.html');
  assert.match(mixedEngine, /return \[4, 6, 8\]\.includes\(parsed\) \? parsed : 4;/);
  const clinic = source('apmath/wrong_print_engine.html');
  assert.match(clinic, /const CLINIC_QPP = 4;/);

  assert.equal(artifact.sourceContracts.clinic.knownRisk,
    'Preview currently loads URL/storage before parent payload, so stale first render is possible.');
  assert.match(artifact.closureRules.authoritativeSourceInvariant, /exactly one/);
  assert.deepEqual(artifact.closureRules.dualRunOrder, ['archive', 'mixer', 'clinic']);
});
