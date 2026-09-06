const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const artifactPath = path.join(root, 'reports', 'print-render-authority-v2.2', 'phase-0-dependency-closure.json');
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

const ENGINE_REFERENCE_PATTERN = /(?:engine\.html|mixed_engine\.html|wrong_print_engine\.html|mixedQuestions_|mixedMeta_|AP_CLINIC_PREVIEW|AP_CLINIC_HEADER_EDIT|AP_CLINIC_PRINT_PAYLOAD|loadAssessmentPackFallback)/;
const EXPECTED_MEMBER_PATHS = [
  '.agent/DOMAIN_LOCK_POLICY.md',
  'apmath/js/clinic-print.js',
  'apmath/js/core.js',
  'apmath/js/student.js',
  'apmath/student/index.html',
  'apmath/worker-backup/worker/routes/exam-pdf.js',
  'apmath/worker-backup/worker/routes/wrong-clinics.js',
  'apmath/wrong_print_engine.html',
  'archive/assessment/assessment-mvp.html',
  'archive/assessment/assessment-packs-1sem.generated.js',
  'archive/assessment/assessment-question-index-1sem.generated.js',
  'archive/exams/test-fixtures/render-authority-golden.js',
  'archive/concept_map.js',
  'archive/css/js-archive-theme-override.css',
  'archive/db.js',
  'archive/engine.html',
  'archive/index.html',
  'archive/internal-review-engine.js',
  'archive/internal-review-live.js',
  'archive/mathjax_render_loop.js',
  'archive/mixed_engine.html',
  'archive/mixer-school-fingerprint-runtime.js',
  'archive/mixer-school-fingerprint.js',
  'archive/mixer-selector.js',
  'archive/mixer.html',
  'archive/native_print.js',
  'archive/print_image_optimizer.js',
  'archive/print-runtime.js',
  'archive/question-identity.js',
  'archive/question-index.js',
  'archive/question-meta.js',
  'archive/print-contract.js',
  'archive/render-authority.css',
  'archive/render-authority.js',
  'archive/layout-authority.js',
  'archive/unit-past-exams-core.js',
  'archive/unit-past-exams.html',
  'archive/unit-past-exams.js',
  'check/check.js',
  'docs/agent-skills/archive-core-sop.md',
  'docs/plans/PRINT_ENGINE_UNIFICATION_NEXT_PLAN.md',
  'docs/rules/02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md',
  'reports/agent-memory/ap-workstream-locks.json',
  'tests/apmath-clinic-print-assignment-visibility.test.js',
  'tests/apmath-exam-assignment-identity.test.js',
  'tests/apmath-wrong-print-qr-solution-regression.test.js',
  'tests/archive-answer-grid-layout.test.js',
  'tests/archive-blueprint-metadata-bridge-contract.test.js',
  'tests/archive-canonical-identity-propagation.test.js',
  'tests/archive-engine-launch-fallback.test.js',
  'tests/archive-inline-view-label.test.js',
  'tests/archive-mathjax-render-loop.test.js',
  'tests/archive-print-image-optimizer.test.js',
  'tests/archive-render-authority-adapter.test.js',
  'tests/archive-solution-image.test.js',
  'tests/archive-table-preservation.test.js',
  'tests/archive-unit-past-exams-ui.test.js',
  'tests/assessment-archive-print-flow.test.js',
  'tests/assessment-assignment-metadata-flow.test.js',
  'tests/assessment-check-solution-link.test.js',
  'tests/assessment-mvp-archive-style.test.js',
  'tests/assessment-result-items-storage.test.js',
  'tests/assessment-submit-qr-student-page-route.test.js',
  'tests/clinic-render-authority-adapter.test.js',
  'tests/fixtures/mixed-print-layout-launcher.html',
  'tests/fixtures/print-render-authority-v2.2-fixtures.json',
  'tests/fixtures/wrong-print-layout-launcher.html',
  'tests/print-contract.test.js',
  'tests/print-preview-channel.test.js',
  'tests/print-readiness-adapter.test.js',
  'tests/print-render-authority-drift-ledger.test.js',
  'tests/print-runtime.test.js',
  'tests/print-render-authority-phase0-baseline.test.js',
  'tests/render-authority-normalizer.test.js',
  'tests/render-authority-question.test.js',
  'tests/render-authority-semantic-css.test.js',
  'tests/layout-authority.test.js',
  'tests/mixed-render-authority-adapter.test.js',
  'tests/student-portal-mixed-review-payload.test.js',
  'tests/student-portal-omr-review-ui.test.js'
].sort();

function text(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
}

function walk(dir, output = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(absolute, output);
    else output.push(absolute);
  }
  return output;
}

function normalizedPaths(paths) {
  return paths.map(file => file.replace(/\\/g, '/')).sort();
}

test('Phase 0 has an exact, edge-based dependency denominator instead of a three-engine file list', () => {
  assert.equal(artifact.schemaVersion, 2);
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

  const memberPaths = artifact.members.map(member => member.path).sort();
  assert.deepEqual(memberPaths, EXPECTED_MEMBER_PATHS, 'the frozen denominator must be explicit and exact');
  assert.equal(artifact.denominator.memberCount, EXPECTED_MEMBER_PATHS.length);

  const roles = new Set(artifact.members.flatMap(member => member.roles));
  for (const role of artifact.categories) assert.ok(roles.has(role), `missing ${role} edge role`);
  const classifications = new Set(artifact.members.map(member => member.classification));
  for (const classification of artifact.classifications) assert.ok(classifications.has(classification), `missing ${classification} classification`);

  for (const member of artifact.members) {
    assert.ok(fs.existsSync(path.join(root, member.path)), `closure member is missing: ${member.path}`);
    assert.ok(Array.isArray(member.roles) && member.roles.length > 0, `member needs one or more roles: ${member.path}`);
    assert.equal(Object.hasOwn(member, 'role'), false, `member must not collapse relations to one role: ${member.path}`);
    assert.ok(Array.isArray(member.evidence) && member.evidence.length > 0, `member needs evidence: ${member.path}`);
    assert.match(member.sha256, /^[0-9a-f]{64}$/, `member needs a SHA-256: ${member.path}`);
  }

  assert.ok(artifact.edges.length >= artifact.denominator.minimumEdgeCount);
  for (const edge of artifact.edges) {
    assert.ok(memberPaths.includes(edge.from), `edge source is outside closure: ${edge.from}`);
    assert.ok(memberPaths.includes(edge.to), `edge target is outside closure: ${edge.to}`);
    assert.ok(['PRODUCES', 'CONSUMES', 'TRANSFORMS', 'REGRESSES', 'GOVERNS'].includes(edge.type), `unknown edge type: ${edge.type}`);
    assert.match(edge.contract, /\S/, 'edge needs a named observable contract');
  }
});

test('Phase 0 SHA baseline locks the current bytes of every frozen closure member', () => {
  for (const member of artifact.members) {
    assert.equal(sha256(member.path), member.sha256, `SHA-256 drift: ${member.path}`);
  }
});

test('Phase 0 models multi-role source paths and the independently found production edges', () => {
  const member = new Map(artifact.members.map(item => [item.path, item]));
  for (const [file, requiredRoles] of Object.entries({
    'archive/index.html': ['PRODUCER', 'DOWNSTREAM_CONSUMER'],
    'archive/unit-past-exams.html': ['PRODUCER', 'DOWNSTREAM_CONSUMER'],
    'archive/unit-past-exams.js': ['PRODUCER', 'DOWNSTREAM_CONSUMER'],
    'apmath/student/index.html': ['PRODUCER', 'DOWNSTREAM_CONSUMER'],
    'apmath/js/clinic-print.js': ['PRODUCER', 'DOWNSTREAM_CONSUMER']
  })) {
    for (const role of requiredRoles) assert.ok(member.get(file).roles.includes(role), `${file} must retain its ${role} edge`);
  }

  const edgeKeys = new Set(artifact.edges.map(edge => `${edge.from}|${edge.type}|${edge.to}|${edge.contract}`));
  for (const required of [
    'archive/unit-past-exams.html|CONSUMES|archive/unit-past-exams-core.js|UNIT_BLUEPRINT_SELECTION',
    'archive/unit-past-exams.js|TRANSFORMS|archive/unit-past-exams-core.js|UNIT_BLUEPRINT_SELECTION',
    'archive/mixer.html|PRODUCES|archive/mixed_engine.html|MIXED_STORAGE_SNAPSHOT',
    'archive/index.html|CONSUMES|archive/mixed_engine.html|MIXED_STORAGE_SNAPSHOT',
    'check/check.js|CONSUMES|archive/mixed_engine.html|CHECK_RENDER_ENGINE_SELECTION',
    'apmath/js/clinic-print.js|PRODUCES|apmath/wrong_print_engine.html|CLINIC_PAYLOAD_AND_PREVIEW_CHANNEL'
  ]) {
    assert.ok(edgeKeys.has(required), `missing independently-reviewed closure edge: ${required}`);
  }

  assert.match(text('archive/unit-past-exams.html'), /unit-past-exams-core\.js/);
  assert.match(text('archive/unit-past-exams.js'), /core\.selectByBlueprint/);
  assert.match(text('check/check.js'), /archiveFile\.startsWith\('MIXED:'\)/);
  assert.match(text('check/check.js'), /\.\.\/archive\/mixed_engine\.html/);
  assert.match(text('.agent/DOMAIN_LOCK_POLICY.md'), /archive\/wrong_print_engine\.html/);
  assert.match(text('docs/agent-skills/archive-core-sop.md'), /archive\/wrong_print_engine\.html/);
});

test('Phase 0 registers every direct engine-reference regression test and preserves observed source/capability facts', () => {
  const directTests = normalizedPaths(
    walk(path.join(root, 'tests'))
      .filter(file => /\.test\.(?:js|mjs)$/.test(file))
      .filter(file => ENGINE_REFERENCE_PATTERN.test(fs.readFileSync(file, 'utf8')))
      .map(file => path.relative(root, file))
  );
  assert.deepEqual(artifact.denominator.engineReferenceTests.slice().sort(), directTests);

  assert.deepEqual(artifact.capabilitySnapshot.qpp, {
    archiveUpstream: [4, 6],
    mixerUpstream: [2, 4, 6, 8],
    mixedEngine: [4, 6, 8],
    clinic: [4],
    unadjudicated: ['MIXER_2QPP']
  });
  assert.match(text('archive/mixer.html'), /<option value="2">2문항\/P<\/option>/);
  assert.match(text('archive/mixed_engine.html'), /return \[4, 6, 8\]\.includes\(parsed\) \? parsed : 4;/);
  assert.match(text('apmath/wrong_print_engine.html'), /const CLINIC_QPP = 4;/);

  assert.equal(artifact.sourceContracts.clinic.knownRisk,
    'Preview currently loads URL/storage before parent payload, so stale first render is possible.');
  assert.match(artifact.closureRules.authoritativeSourceInvariant, /exactly one/);
  assert.deepEqual(artifact.closureRules.dualRunOrder, ['archive', 'mixer', 'clinic']);
  assert.equal(artifact.knownDocumentationFinding.productionPath, 'apmath/wrong_print_engine.html');
});
