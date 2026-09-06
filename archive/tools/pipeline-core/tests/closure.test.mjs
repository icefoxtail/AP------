import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { auditRun, profiles, denominatorInput, runInputSha } from '../closure.mjs';
import { fileRef } from '../canonical.mjs';
import { closureFromFile, closureFromArgs } from '../integration.mjs';
import { fixture } from './fixture.mjs';

for (const pipeline of Object.keys(profiles.pipelines)) test(`complete test fixture passes the ${pipeline} adapter with explicit scope`, () => {
  const f = fixture(pipeline, { visual: profiles.pipelines[pipeline].visual });
  try { const report = auditRun(f.root, f.run); assert.equal(report.status, 'PASS', JSON.stringify(report.errors)); assert.equal(report.productionAuthorized, false); assert.equal(report.verifiedScope, profiles.pipelines[pipeline].scope); } finally { f.cleanup(); }
});

const mutations = {
  'empty questions': f => { f.run.questions = []; },
  'duplicate UID': f => { f.run.questions.push(structuredClone(f.run.questions[0])); },
  'wrong UID identity': f => { f.run.questions[0].questionUid = 'other'; },
  'stale candidate bytes': f => { fs.appendFileSync(path.join(f.root, 'candidate.js'), '\n// changed'); },
  'stale rule bytes': f => { fs.appendFileSync(path.join(f.root, 'docs/rules/00_RULES_INDEX.md'), '\nchanged'); },
  'forged input SHA': f => { f.run.inputSha = `sha256:${'0'.repeat(64)}`; },
  'overlapping active registry': f => { f.run.registry.push({ ...f.run.registry[0], recordId: 'other' }); },
  'missing supersedes revision': f => { f.run.registry[0].revision = 2; },
  'missing math': f => { delete f.run.questions[0].evidence.math; },
  'math builder self-review': f => f.rewriteEvidence('math', e => { e.reviewSessionId = f.run.builderSessionId; }),
  'unchecked choices': f => f.rewriteEvidence('math', e => { e.payload.allChoicesChecked = false; }),
  'same V1 V2 session': f => f.rewriteEvidence('v2', e => { e.reviewSessionId = 'session-v1'; }),
  'V2 expected visibility': f => f.rewriteEvidence('v2', e => { e.inputVisibilityProfile = 'SOURCE_ONLY'; }),
  'V1 answer leak': f => { const e = f.records.get('v1'); f.rewriteEvidence('v1', r => { r.payload.inputBundle = f.write('v1-input.json', { questionUid: f.run.questions[0].questionUid, content: 'x', choices: [], answer: '1' }); }); },
  'V3 before freeze': f => f.rewriteEvidence('v3', e => { e.startedAt = '2026-09-06T00:59:00Z'; }),
  'V3 refers to unrelated evidence hash': f => f.rewriteEvidence('v3', e => { e.payload.v1EvidenceSha = f.run.evidence.find(r => r.path.endsWith('math.json')).sha256; }),
  'malformed typed fact': f => f.rewriteEvidence('v2', e => { e.payload.fact.semantic.maximumIntersection = -1; }),
  'observed copied but missing input proof': f => f.rewriteEvidence('v2', e => { delete e.payload.inputBundle; }),
  'changed artifact extraction identity': f => f.rewriteEvidence('v2', e => { e.payload.artifactSha = `sha256:${'0'.repeat(64)}`; }),
  'decisive edge FAIL': f => f.rewriteEvidence('v3', e => { e.payload.checks.decisiveStep = 'FAIL'; }),
  'alt caption NOT_TESTED': f => f.rewriteEvidence('v3', e => { e.payload.checks.altCaptionParity = 'NOT_TESTED'; }),
  'source unresolved': f => { f.run.questions[0].sourceStatus = 'BLOCKED'; },
  'all render reports forced FAIL': f => { for (const id of ['solution-desktop', 'solution-mobile']) f.rewriteEvidence(id, e => { e.status = 'FAIL'; }); },
  'review PASS without capture evidence': f => { f.run.evidence = f.run.evidence.filter(ref => !ref.path.endsWith('-capture.json')); },
  'review omits capture SHA': f => f.rewriteEvidence('solution-mobile', e => { delete e.payload.captureEvidenceSha; }),
  'capture and reviewer use same session': f => f.rewriteEvidence('solution-mobile', e => { e.reviewSessionId = 'session-solution-mobile-capture'; }),
  'review starts before capture freeze': f => f.rewriteEvidence('solution-mobile', e => { e.startedAt = '2026-09-06T00:59:00Z'; }),
  'capture changes after review': f => f.rewriteEvidence('solution-mobile-capture', e => { e.payload.metrics = { changed: true }; }),
  'review binds wrong runtime bundle': f => f.rewriteEvidence('solution-mobile', e => { e.payload.runtimeBundleSha = `sha256:${'0'.repeat(64)}`; }),
  'capture response bundle is forged': f => f.rewriteEvidence('solution-mobile-capture', e => { e.payload.runtimeResponses[0].bytes += 1; }),
  'runtime dependency changes after freeze': f => { fs.writeFileSync(path.join(f.root, 'native_print.js'), '// changed runtime dependency'); },
  'runtime CSS changes after freeze': f => { fs.writeFileSync(path.join(f.root, 'styles.css'), 'body{display:none}'); },
  'MathJax font changes after freeze': f => { fs.writeFileSync(path.join(f.root, 'vendor/mathjax-tex-font/test.woff2'), 'changed-font'); },
  'runtime input is omitted': f => { f.run.inputs = f.run.inputs.filter(ref => ref.path !== 'native_print.js'); },
  'missing mobile': f => { f.run.evidence = f.run.evidence.filter(r => !r.path.includes('solution-mobile')); },
  'unreadable mobile': f => f.rewriteEvidence('solution-mobile', e => { e.payload.checks.readability = 'FAIL'; }),
  'mobile width substituted desktop': f => f.rewriteEvidence('solution-mobile-capture', e => { e.payload.viewport.width = 1280; }),
  'missing screenshot file': f => { fs.unlinkSync(path.join(f.root, 'screens/solution-mobile.png')); },
  'PNG truncated but rehashed': f => f.rewriteEvidence('solution-mobile-capture', e => { e.payload.screenshot = f.write('screens/solution-mobile.png', Buffer.from('89504e470d0a1a0a', 'hex')); }),
  'asset association wrong UID': f => f.rewriteEvidence('solution-mobile-capture', e => { e.payload.assetAssociations[0].questionUid = 'other'; }),
  'old FROZEN denominator input': f => { f.run.denominator.inputSha = `sha256:${'0'.repeat(64)}`; },
  'explicit stale denominator': f => { f.run.denominator.stale = true; },
  'OPTIONAL attached excluded from denominator': f => { f.run.denominator.requiredUidSet = []; },
  'unresolved evidence finding': f => f.rewriteEvidence('static', e => { e.findings = [{ status: 'OPEN', reason: 'missing label' }]; })
};
for (const [name, mutate] of Object.entries(mutations)) test(`fails closed: ${name}`, () => {
  const f = fixture(); try { mutate(f); const result = auditRun(f.root, f.run); assert.equal(result.status, 'BLOCKED', name); assert.ok(result.errors.length); } finally { f.cleanup(); }
});

test('closure manifest must bind the actual output, not another passing run', () => {
  const f = fixture(); try {
    const manifest = path.join(f.root, 'run.json'); fs.writeFileSync(manifest, JSON.stringify(f.run));
    f.write('unreviewed.js', 'window.questionBank=[]');
    assert.equal(closureFromFile(f.root, 'logic-visual', manifest, [path.join(f.root, 'candidate.js')]).status, 'PASS');
    assert.equal(closureFromFile(f.root, 'logic-visual', manifest, [path.join(f.root, 'unreviewed.js')]).status, 'BLOCKED');
    assert.equal(closureFromArgs(f.root, 'logic-visual', []).status, 'BLOCKED');
  } finally { f.cleanup(); }
});

test('new source/rule/spec input requires re-freeze even when C UID set is unchanged', () => {
  const f = fixture(); try {
    const old = denominatorInput(f.run); f.write('spec.json', { version: 'changed' });
    f.run.inputs = f.run.inputs.map(ref => ref.path === 'spec.json' ? { ...fileRef(f.root, 'spec.json'), role: 'spec' } : ref);
    f.run.inputSha = runInputSha(f.run); const next = denominatorInput(f.run);
    assert.deepEqual(next.requiredUidSet, old.requiredUidSet); assert.notEqual(next.inputSha, old.inputSha);
    assert.equal(auditRun(f.root, f.run).status, 'BLOCKED');
  } finally { f.cleanup(); }
});
