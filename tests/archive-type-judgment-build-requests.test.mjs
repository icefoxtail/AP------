import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assignRow, eligibility, buildAll, buildRequests, summarize, tplKeyFromHint, ptKeyFromBundle, tplKeyFromBundle,
  isApprovedRow, writeOutputs, bundleLinks, parseJsonl, normalizeExam, COURSE_PACK
} from '../archive/tools/type-judgment/build-requests.mjs';
import { ensureOverlay } from '../archive/tools/type-judgment/dry-run-requests.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Synthetic context: no repository, no registrar. Only the conversion rules are under test.
function ctxFixture() {
  const pt = (key, ownerPack = 'MIDDLE2') => [key, { problemTypeKey: key, status: 'ACTIVE', ownerPack, canonicalLabelKo: key }];
  const tpl = (key, parent, label = key) => [key, { templateKey: key, parentProblemTypeKey: parent, status: 'ACTIVE', ownerPack: 'MIDDLE2', canonicalLabelKo: label }];
  const master = new Map([['M2-01', { key: 'M2-01', keyType: 'standardUnitKey', status: 'ACTIVE', labelKo: '유리수' }],
    ['M2-01-A', { key: 'M2-01-A', keyType: 'subUnitKey', status: 'ACTIVE', standardUnitKey: 'M2-01', labelKo: '순환소수' }]]);
  const approvedFs = { standardUnit: 'approved_review2', subUnit: 'approved_review2', difficulty: 'approved_review2' };
  const hold = (n, extra = {}) => ({ curriculum: '2015', questionUid: `u${n}`, sourceArchiveFile: 'ex/a.js', sourceOrdinal: n, sourceQuestionNo: String(n), standardCourse: '중2 수학', standardUnitKey: 'M2-01',
    subUnitKey: 'M2-01-A', difficultyBucket: 2, problemTypeKey: '', templateKey: '', crossConceptKeys: null, conditionKeys: null, integrationPattern: null,
    metadataStatus: 'approved_partial_with_explicit_holds', fieldStatus: { ...approvedFs, problemType: 'manual_review_pending' }, ...extra });
  const records = new Map([hold(1), hold(2), hold(3), hold(4, { difficultyBucket: 2, fieldStatus: { standardUnit: 'approved_review2', subUnit: 'approved_review2', difficulty: 'manual_review_pending' } }),
    hold(5, { problemTypeKey: 'PT_OLD', templateKey: 'TPL_OLD', reviewStatus: 'reviewed_pass', metadataStatus: 'approved_semantic_review' }), hold(6)].map(r => [r.questionUid, r]));
  const bank = Array.from({ length: 6 }, (_, i) => ({ id: i + 1 }));
  const ctx = {
    head: 'testhead', relax: new Set(), identity: new Map(), crossKeys: new Set(['CC_X']), master, records,
    registry: { problemTypes: new Map([pt('PT_OLD'), pt('PT_EXISTING')]), templates: new Map([tpl('TPL_OLD', 'PT_OLD'), tpl('TPL_EXISTING', 'PT_EXISTING', '기존 이름')]),
      concepts: new Map(), conditions: new Map(), bindingRows: [{ problemTypeKey: 'PT_OLD', curriculum: '2015', standardCourse: '중2 수학', standardUnitKey: 'M2-01', subUnitKey: 'M2-01-A', ownerPack: 'MIDDLE2', status: 'ACTIVE', L1: '수와 식', L2: '순환소수' }] },
    packs: new Map([['MIDDLE2', { packId: 'MIDDLE2', ownerPack: 'MIDDLE2', packVersion: '1.0.0', curricula: ['2015'], standardCourses: ['중2 수학'] }]]),
    checkFingerprint: () => {}, bank: () => bank, blobSha: () => 'a'.repeat(40)
  };
  const bundles = { ptBundles: [{ bundle: 'NPT_M2_REPEATING_DECIMAL', nameKo: '순환소수', definition: '순환소수 정의', course: 'middle2', absorbInto: null },
      { bundle: 'NPT_M2_ABSORBED', nameKo: '흡수', definition: 'd', course: 'middle2', absorbInto: 'PT_EXISTING' }],
    ptAssign: [{ uid: 'u2', bundle: 'NPT_M2_REPEATING_DECIMAL', tplHint: '분수로 변환', conditionHints: ['미정계수'], crossConceptHints: [] },
      { uid: 'u3', bundle: 'NPT_M2_ABSORBED', tplHint: '기존 이름', conditionHints: [], crossConceptHints: [] },
      { uid: 'u6', bundle: null, tplHint: 'x', conditionHints: [], crossConceptHints: [] }],
    tplBundles: [], tplAssign: [] };
  return { ctx, bundles };
}
const dots = (uid, extra) => ({ uid, exam: 'archive/exams/ex/a.js', no: 1, step: '근거 문장', figure: false, check: 'PASS', _file: 'f.jsonl', ...extra });
const rowsFor = () => [
  dots('u1', { decision: 'PICK', pt: 'PT_EXISTING', tpl: 'TPL_EXISTING' }),
  dots('u2', { decision: 'NEW_KEY', pt: null, tpl: null }),
  dots('u3', { decision: 'NEW_KEY', pt: null, tpl: null }),
  dots('u4', { decision: 'PICK', pt: 'PT_EXISTING', tpl: 'TPL_EXISTING' }),
  dots('u5', { decision: 'PICK', pt: 'PT_EXISTING', tpl: 'TPL_EXISTING' }),
  dots('u6', { decision: 'NEW_KEY', pt: null, tpl: null })
];

test('key names: bundle ids map to PT_/TPL_, hint TPL keys are deterministic and ASCII', () => {
  assert.equal(ptKeyFromBundle('NPT_M2_FINITE_DECIMAL'), 'PT_M2_FINITE_DECIMAL');
  assert.equal(tplKeyFromBundle('NTPL_M3_X'), 'TPL_M3_X');
  const key = tplKeyFromHint('PT_M2_A', '분수로 변환');
  assert.match(key, /^TPL_M2_A_H[0-9A-F]{6}$/);
  assert.equal(key, tplKeyFromHint('PT_M2_A', ' 분수로 변환 '));
  assert.notEqual(key, tplKeyFromHint('PT_M2_A', '다른 힌트'));
});

test('assignRow never invents a key the tables do not allow', () => {
  const { ctx, bundles } = ctxFixture();
  const idx = { pt: new Map(bundles.ptBundles.map(b => [b.bundle, b])), tpl: new Map(), ptAssign: new Map(bundles.ptAssign.map(a => [a.uid, a])), tplAssign: new Map() };
  assert.equal(assignRow(ctx, idx, dots('x', { decision: 'HOLD' })).skip, 'HOLD');
  assert.equal(assignRow(ctx, idx, dots('x', { decision: 'PICK', pt: 'PT_MISSING', tpl: null })).skip, 'PT_NOT_ACTIVE');
  assert.equal(assignRow(ctx, idx, dots('x', { decision: 'PICK', pt: 'PT_OLD', tpl: 'TPL_EXISTING' })).skip, 'TPL_PARENT_MISMATCH');
  assert.equal(assignRow(ctx, idx, dots('x', { decision: 'PICK', pt: 'PT_OLD', tpl: 'TPL_NONE' })).skip, 'TPL_NOT_ACTIVE');
  const ptOnly = assignRow(ctx, idx, dots('x', { decision: 'PICK', pt: 'PT_OLD', tpl: null }));
  assert.equal(ptOnly.ptOnly, true); assert.equal(ptOnly.tpl, null);
  assert.equal(assignRow(ctx, idx, dots('u6', { decision: 'NEW_KEY' })).skip, 'NEW_KEY_BUNDLE_NULL');
  assert.equal(assignRow(ctx, idx, dots('nobody', { decision: 'NEW_KEY' })).skip, 'NEW_KEY_NOT_IN_PT_ASSIGN');
  const fresh = assignRow(ctx, idx, dots('u2', { decision: 'NEW_KEY' }));
  assert.equal(fresh.pt, 'PT_M2_REPEATING_DECIMAL'); assert.ok(fresh.newPt && fresh.newTpl);
  const absorbed = assignRow(ctx, idx, dots('u3', { decision: 'NEW_KEY' }));
  assert.equal(absorbed.pt, 'PT_EXISTING'); assert.equal(absorbed.newPt, null);
  assert.equal(absorbed.tpl, 'TPL_EXISTING', 'a hint equal to an existing TPL label of the absorbed PT reuses that TPL');
});

test('requests: already-approved rows are never requested; no missing key, parent mismatch, duplicate uid or key collision', () => {
  const { ctx, bundles } = ctxFixture();
  const built = buildAll({ ctx, resultRows: rowsFor(), bundles });
  const info = buildRequests({ ctx, built, tag: 'unit', approvedBy: 'test' });
  const requested = info.requests.flatMap(r => r.items.map(i => i.questionUid));
  assert.ok(!requested.includes('u5'), 'approved type row must stay out of the request');
  assert.equal(built.conflicts.length, 1); assert.equal(built.conflicts[0].uid, 'u5');
  assert.ok(!requested.includes('u4'), 'unapproved difficulty row is skipped');
  assert.equal(new Set(requested).size, requested.length);
  const newPt = new Set(built.keysEvidence.newProblemTypes.map(k => k.key)), newTpl = new Map(built.keysEvidence.newTemplates.map(k => [k.key, k.parent]));
  for (const request of info.requests) for (const item of request.items) {
    const { problemTypeKey: p, templateKey: t } = item.after;
    assert.ok(ctx.registry.problemTypes.has(p) || newPt.has(p), `PT must exist or be created: ${p}`);
    const parent = ctx.registry.templates.get(t)?.parentProblemTypeKey ?? newTpl.get(t);
    assert.equal(parent, p, `TPL parent must equal the chosen PT: ${t}`);
    assert.ok(item.reason.includes('근거 문장'), 'step sentence carried into the item');
    assert.ok(item.before && Object.keys(item.after).every(k => Object.hasOwn(item.before, k)), 'every after field has a before value');
  }
  for (const key of [...newPt, ...newTpl.keys()]) {
    assert.ok(!ctx.registry.problemTypes.has(key) && !ctx.registry.templates.has(key) && !ctx.crossKeys.has(key), `new key must not collide: ${key}`);
  }
  const created = info.requests.flatMap(r => r.registryChanges || []).filter(c => c.before === null).map(c => JSON.stringify([c.path, c.match]));
  assert.equal(new Set(created).size, created.length, 'one request creates a registry row once');
});

test('a new key that collides with an existing key is quarantined with its rows, not registered', () => {
  const { ctx, bundles } = ctxFixture();
  ctx.registry.problemTypes.set('PT_M2_REPEATING_DECIMAL', { problemTypeKey: 'PT_M2_REPEATING_DECIMAL', status: 'ACTIVE', ownerPack: 'MIDDLE2' });
  const built = buildAll({ ctx, resultRows: rowsFor(), bundles });
  assert.equal(built.plan.collisions.length > 0, true);
  assert.ok(!built.planned.some(p => p.uid === 'u2'));
  assert.ok(built.skipped.some(s => s.uid === 'u2' && s.reason === 'KEY_COLLISION'));
});

test('defaults for empty cross/condition/integration are explicit, and source parity blocks a request instead of changing the source', () => {
  const { ctx, bundles } = ctxFixture();
  const built = buildAll({ ctx, resultRows: rowsFor(), bundles });
  const item = buildRequests({ ctx, built, tag: 'unit', approvedBy: 'test' }).requests[0].items[0];
  assert.deepEqual(item.after.crossConceptKeys, []); assert.equal(item.after.integrationPattern, 'NONE');
  assert.equal(built.planned[0].values.defaulted.length, 3);
  const mismatch = ctxFixture();
  mismatch.ctx.bank = () => [{ problemTypeKey: 'PT_OTHER' }, {}, {}, {}, {}, {}];
  const result = eligibility(mismatch.ctx, mismatch.ctx.records.get('u1'), { problemTypeKey: 'PT_OTHER' }, { pt: 'PT_EXISTING', tpl: 'TPL_EXISTING' });
  assert.equal(result.skip, 'SOURCE_JS_TYPE_DIFFERS');
});

test('eligibility uses the registrar approval predicate and reports every reason', () => {
  const { ctx } = ctxFixture();
  assert.equal(isApprovedRow({ reviewStatus: 'reviewed_pass' }), true);
  assert.equal(isApprovedRow({ metadataStatus: 'approved_partial_with_explicit_holds' }), true);
  assert.equal(isApprovedRow({ metadataStatus: 'registration_pending_semantic_review' }), false);
  const row = { ...ctx.records.get('u1'), fieldStatus: {}, standardUnitKey: 'NOPE' };
  const r = eligibility(ctx, row, {}, { pt: 'PT_EXISTING', tpl: 'TPL_EXISTING' });
  assert.ok(r.all.includes('UNIT_NOT_APPROVED') && r.all.includes('DIFFICULTY_NOT_APPROVED') && r.all.includes('UNIT_NOT_IN_MASTER'));
});

test('summary mode counts, output stays outside the repository, files are write-once', () => {
  const { ctx, bundles } = ctxFixture();
  const built = buildAll({ ctx, resultRows: rowsFor(), bundles });
  const info = buildRequests({ ctx, built, tag: 'unit', approvedBy: 'test' });
  const summary = summarize({ built, requestsInfo: info });
  assert.equal(summary.itemsToFill, built.planned.length);
  assert.ok(summary.skippedByFirstReason.TYPE_ALREADY_APPROVED === 1);
  assert.throws(() => writeOutputs(path.join(ROOT, 'tmp-should-not-exist'), { built, requestsInfo: info, summary, links: bundleLinks({ ptBundles: [], tplBundles: [] }) }), /OUTPUT_INSIDE_REPOSITORY/);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'type-requests-test-'));
  try {
    writeOutputs(path.join(temp, 'out'), { built, requestsInfo: info, summary, links: bundleLinks({ ptBundles: [], tplBundles: [] }) });
    assert.ok(fs.existsSync(path.join(temp, 'out', 'summary.json')));
    assert.ok(fs.readdirSync(path.join(temp, 'out', 'requests')).length === info.requests.length);
    assert.throws(() => writeOutputs(path.join(temp, 'out'), { built, requestsInfo: info, summary, links: bundleLinks({ ptBundles: [], tplBundles: [] }) }), /EEXIST/);
    assert.throws(() => ensureOverlay({ repo: ROOT, overlay: path.join(ROOT, 'archive', 'tmp-overlay') }), /OVERLAY_INSIDE_REPOSITORY/);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});

test('helpers: jsonl parsing, exam path normalization, course-to-pack table points at ACTIVE packs', () => {
  assert.deepEqual(parseJsonl('{"a":1}\n\n{"a":2}\n'), [{ a: 1 }, { a: 2 }]);
  assert.throws(() => parseJsonl('{"a":1}\nnot json\n'), /BROKEN_JSONL_LINE/);
  assert.equal(normalizeExam('archive/exams/original/x.js'), 'original/x.js');
  const index = JSON.parse(fs.readFileSync(path.join(ROOT, 'archive/data/meta-foundation/canonical/registry_index.json'), 'utf8'));
  const active = new Set(index.activePacks.filter(p => p.status === 'ACTIVE').map(p => p.id));
  for (const pack of Object.values(COURSE_PACK)) assert.ok(active.has(pack), `COURSE_PACK target must be an ACTIVE pack: ${pack}`);
});
