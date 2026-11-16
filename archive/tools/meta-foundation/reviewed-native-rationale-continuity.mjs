// Reuse only the two explicit immutable native rationale values. This proof
// neither inserts source fields nor gives the ordinary producer new authority.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { questionAssetReferences } from '../archive-content-inputs.mjs';

export const NATIVE_RATIONALE_CONTINUITY_SCHEMA = 'archive-native-rationale-continuity-v1';
export const NATIVE_RATIONALE_SOURCE_FIELDS = Object.freeze([
  'courseKey', 'curriculum', 'reviewStatus', 'tagConfidence', 'tagStatus', 'templateKey',
  'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility',
]);
const FIELDS = ['primaryMethod', 'decisiveStep'];
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
const equal = (a, b) => stable(a) === stable(b), sha = value => crypto.createHash('sha256').update(value).digest('hex');
const blob = value => crypto.createHash('sha1').update(`blob ${value.length}\0`).update(value).digest('hex');
const text = value => typeof value === 'string' && value.trim().length > 0;
const fail = message => { throw Error(`native rationale continuity: ${message}`); };
const exact = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) &&
  equal(Object.keys(value).sort(), [...keys].sort());
export const rationaleProtectedQuestionSha256 = question => sha(stable(Object.fromEntries(
  Object.entries(question).filter(([key]) => !NATIVE_RATIONALE_SOURCE_FIELDS.includes(key)))));
export const rationaleSourceFieldBinding = (question, field) => Object.hasOwn(question, field)
  ? { present: true, valueSha256: sha(stable(question[field])) } : { present: false, valueSha256: null };

function safe(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || /[\\\x00-\x1f]/u.test(relative) ||
      relative.split('/').some(p => !p || p === '.' || p === '..')) fail('unsafe evidence path');
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail('symlink evidence path');
  return full;
}
function immutableAsset(root, commit, relative, cache) {
  safe(root, relative);
  const key = stable(['native-rationale-asset', path.resolve(root), commit, relative]);
  if (!cache.has(key)) {
    const run = args => execFileSync('git', args, { cwd: root, env: { ...process.env, GIT_NO_LAZY_FETCH: '1' },
      maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
    let entry, bytes;
    try { entry = run(['ls-tree', '-z', commit, '--', relative]).toString(); bytes = run(['show', `${commit}:${relative}`]); }
    catch { fail('immutable renderer input unavailable'); }
    if (!/^100(?:644|755) blob [a-f0-9]{40}\t[^\0]+\0$/u.test(entry) ||
        entry.slice(entry.indexOf('\t') + 1, -1) !== relative ||
        entry.slice(0, entry.indexOf('\t')).split(' ')[2] !== blob(bytes)) fail('immutable regular renderer file required');
    cache.set(key, { path: relative, gitBlobSha1: blob(bytes), sha256: sha(bytes) });
  }
  return structuredClone(cache.get(key));
}
function rendererAssets(root, native, question, cache) {
  const refs = new Set();
  const add = value => {
    if (typeof value !== 'string' || !/^(?:archive\/)?assets\//u.test(value) || /[?#]/u.test(value))
      fail('unsupported renderer reference');
    const relative = value.startsWith('archive/') ? value : `archive/${value}`;
    safe(root, relative); refs.add(relative);
  };
  const visit = (value, key = '') => {
    if (Array.isArray(value)) { value.forEach(v => visit(v, key)); return; }
    if (value && typeof value === 'object') { Object.entries(value).forEach(([k, v]) => visit(v, k)); return; }
    if (typeof value !== 'string') return;
    if (['image', 'images', 'solutionImage', 'solutionImages'].includes(key) && value) add(value);
    if (['figureSvg', 'solutionFigureSvg'].includes(key) && value || /<(?:svg|object|iframe|image)\b|srcset\s*=/iu.test(value))
      fail('unsupported inline renderer');
    for (const tag of value.matchAll(/<img\b[^>]*>/giu)) {
      const attrs = [...tag[0].matchAll(/\bsrc\s*=\s*(["'])(.*?)\1/giu)];
      if (attrs.length !== 1 || (tag[0].match(/\bsrc\s*=/giu) || []).length !== 1) fail('malformed renderer reference');
      add(attrs[0][2]);
    }
    if (/url\s*\(/iu.test(value)) fail('unsupported inline renderer dependency');
  };
  visit(question); questionAssetReferences(question).forEach(add);
  return [...refs].sort().map(relative => {
    const original = immutableAsset(root, native.review.baseSha, relative, cache);
    if (!equal(original, immutableAsset(root, native.spec.reviewCommit, relative, cache))) fail('native renderer bytes differ');
    const bytes = fs.readFileSync(safe(root, relative));
    if (sha(bytes) !== original.sha256 || blob(bytes) !== original.gitBlobSha1) fail('current renderer bytes changed');
    if (/\.svg$/iu.test(relative)) {
      const svg = bytes.toString('utf8');
      const attrs = [...svg.matchAll(/\b(?:src|(?:xlink:)?href)\s*=\s*(["'])(.*?)\1/giu)];
      // This narrow static profile refuses base-URI rewriting and escaped CSS
      // rather than trying to normalize indirect external resource references.
      if (/<!DOCTYPE|<!ENTITY|<script\b|<foreignObject\b|\bon\w+\s*=|@import|\bxml:base\s*=|\\/iu.test(svg) ||
          (svg.match(/\b(?:src|(?:xlink:)?href)\s*=/giu) || []).length !== attrs.length ||
          attrs.some(m => !/^#[A-Za-z0-9_.:-]+$/u.test(m[2])) ||
          /url\s*\(/iu.test(svg.replace(/url\(\s*["']?#[A-Za-z0-9_.:-]+["']?\s*\)/giu, '')))
        fail('unsupported SVG dependency');
    }
    return original;
  });
}

export function bindReviewedNativeRationaleContinuity({ root, request, patch, native, row,
  question, final, rationaleBindings, canonicalBefore, canonicalAfter, cache = new Map() }) {
  const spec = patch.sourceReview?.rationaleContinuity;
  if (spec === undefined) return null;
  if (!exact(spec, ['schemaVersion']) || spec.schemaVersion !== NATIVE_RATIONALE_CONTINUITY_SCHEMA ||
      !exact(patch.sourceReview, ['schemaVersion', 'reviewCommit', 'reviewPath', 'reviewRef', 'rationaleContinuity']) ||
      request.scope !== 'PARTIAL_UIDS' || request.approval?.type !== 'FINAL_QA' || request.approval.metadataReviewed !== true ||
      request.registrationMode !== undefined || request.approval.sourceRebind !== undefined || patch.rebind !== undefined ||
      !Array.isArray(request.registryChanges) || request.registryChanges.length || patch.targetParentRef !== undefined ||
      !exact(patch.basicScopeParentRef, ['path', 'sha256']) || native.review.schemaVersion !== 'm2-s2-meta-review-v1' ||
      !/^original\/middle\/m2\/(?:2mid|2final)\/[^/]+\.js$/u.test(request.sourceArchiveFile) ||
      final.curriculum !== '2015' || final.curriculumKey !== '2015' || final.courseKey !== 'M2-2' || final.standardCourse !== '중2 수학')
    fail('exclusive M2 second-semester native metadata-parent rationale profile required');
  const ref = patch.basicScopeParentRef;
  if (!/^archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/[A-Za-z0-9][A-Za-z0-9_-]*\.parent-labels\.json$/u.test(ref.path || '') ||
      !/^[a-f0-9]{64}$/u.test(ref.sha256 || '') ||
      [request.approval.evidenceRefs, patch.evidenceRefs].some(refs => !refs?.some(r => equal(r, ref))))
    fail('exact metadata-parent evidence required');
  const parentBytes = fs.readFileSync(safe(root, ref.path)), parents = JSON.parse(parentBytes);
  if (sha(parentBytes) !== ref.sha256 || !exact(parents, ['schemaVersion', 'sourcePath', 'sourceSha256', 'records']) ||
      parents.schemaVersion !== 'archive-meta-pipeline-parent-label-evidence-v1' ||
      parents.sourcePath !== 'archive/data/question_metadata.json' || !/^[a-f0-9]{64}$/u.test(parents.sourceSha256 || '') ||
      !Array.isArray(parents.records) || parents.records.length !== request.items.length ||
      new Set(parents.records.map(r => r.questionUid)).size !== parents.records.length ||
      new Set(parents.records.map(r => r.sourceOrdinal)).size !== parents.records.length ||
      request.items.some(item => !equal(item.basicScopeParentRef, ref) ||
        !equal(item.sourceReview?.rationaleContinuity, spec) || parents.records.filter(r =>
          r.questionUid === item.questionUid && r.sourceOrdinal === item.sourceOrdinal && r.sourceArchiveFile === request.sourceArchiveFile).length !== 1))
    fail('exact selected metadata-parent inventory required');
  const parent = parents.records.find(r => r.questionUid === patch.questionUid);
  if (!equal(parent, { questionUid: patch.questionUid, sourceArchiveFile: request.sourceArchiveFile,
      sourceOrdinal: patch.sourceOrdinal, curriculumKey: final.curriculum, courseKey: final.standardCourse,
      standardUnitKey: final.standardUnitKey, subUnitKey: final.subUnitKey ?? null, L1: final.L1, L2: final.L2 }))
    fail('existing parent tuple differs from current metadata');
  const before = native.reviewedBank[patch.sourceOrdinal - 1], committed = native.committedBank[patch.sourceOrdinal - 1];
  const protectedQuestionSha256 = rationaleProtectedQuestionSha256(question);
  if ([before, committed].some(q => rationaleProtectedQuestionSha256(q) !== protectedQuestionSha256) ||
      FIELDS.some(field => [before, committed, question].some(q => Object.hasOwn(q, field)) ||
        Object.hasOwn(row.after, field) || !text(row[field]) || patch.after[field] !== row[field] || final[field] !== row[field] ||
        !equal(rationaleBindings[field], { origin: 'NATIVE_ITEM_FIELD', valueSha256: sha(row[field]) })))
    fail('exact native item rationale and unchanged protected source required');
  const status = { reviewStatus: 'reviewed_pass', tagStatus: 'reviewed_pass', tagConfidence: 'approved_final_qa' };
  for (const key of NATIVE_RATIONALE_SOURCE_FIELDS) if (Object.hasOwn(question, key) &&
      !equal(question[key], Object.hasOwn(status, key) ? status[key] : final[key])) fail('source metadata differs from issued values');
  const pt = canonicalBefore?.pt?.get(final.problemTypeKey), tpl = canonicalBefore?.tpl?.get(final.templateKey);
  const bindingKey = stable([final.curriculum, final.standardCourse, final.standardUnitKey, final.subUnitKey ?? null, final.problemTypeKey]);
  const binding = canonicalBefore?.bindings?.get(bindingKey);
  if (pt?.status !== 'ACTIVE' || tpl?.status !== 'ACTIVE' || tpl.parentProblemTypeKey !== final.problemTypeKey ||
      binding?.status !== 'ACTIVE' || !equal(pt, canonicalAfter?.pt?.get(final.problemTypeKey)) ||
      !equal(tpl, canonicalAfter?.tpl?.get(final.templateKey)) || !equal(binding, canonicalAfter?.bindings?.get(bindingKey)))
    fail('unchanged ACTIVE primary and exact binding required');
  return { schemaVersion: NATIVE_RATIONALE_CONTINUITY_SCHEMA, scope: 'ISSUED_NATIVE_RATIONALE_REUSE_ONLY',
    questionUid: patch.questionUid, sourceOrdinal: patch.sourceOrdinal,
    rationaleBindings: structuredClone(rationaleBindings), metadataParentRef: structuredClone(ref),
    metadataParentSha256: sha(stable(parent)), protectedQuestionSha256,
    currentQuestionSha256: sha(stable(question)), sourceMetadataFields: [...NATIVE_RATIONALE_SOURCE_FIELDS],
    nativeSourceMetadata: NATIVE_RATIONALE_SOURCE_FIELDS.map(field => ({ field,
      reviewed: rationaleSourceFieldBinding(before, field), committed: rationaleSourceFieldBinding(committed, field) })),
    problemTypeDefinitionSha256: sha(stable(pt)), templateDefinitionSha256: sha(stable(tpl)), bindingSha256: sha(stable(binding)),
    rendererAssets: rendererAssets(root, native, question, cache),
    sourceRationaleFieldsAdded: false, newMathematicalQa: false, newMetadataJudgments: false, newDifficultyJudgments: false };
}
