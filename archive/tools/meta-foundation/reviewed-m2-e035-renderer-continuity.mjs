// E035 is one existing v3 consumer, not an extension of the older renderer
// allowlists. This module supplies a comparison view, never metadata values.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {validateM2ProblemRendererUiTileEvidence} from './reviewed-m2-problem-renderer-continuity.mjs';

export const M2_E035_RENDERER_SCHEMA = 'archive-reviewed-m2-e035-renderer-continuity-v1';
export const M2_E035_TRANSPORT_SCHEMA = 'archive-m2-e035-renderer-transport-evidence-v1';
export const M2_E035_REVIEW_SCHEMA = 'archive-independent-m2-e035-renderer-review-v1';
export const M2_E035_SCOPE = Object.freeze({
  questionUid: 'qid_v1_aaa151978fdd692262dad4377577bb5ee6e5b89c725920ab21afae3ea603f5c8',
  sourceArchiveFile: 'original/middle/m2/2final/21_연향중_2학기_기말_중2_기출.js',
  sourceOrdinal: 12, expectedQuestionCount: 21,
});
export const M2_E035_RENDERER_FIELDS = Object.freeze(['image', 'imageAlt', 'imageSize', 'layoutTag',
  'solutionImage', 'solutionImageAlt', 'solutionImageCaption']);
const META = ['courseKey', 'crossConceptKeys', 'curriculumKey'];
const AUTHORITY = ['schemaVersion', 'reviewCommit', 'reviewPath', 'reviewRef', 'proposalFinalization'];
const REVIEW_SCOPE = 'EXACT_E035_EXISTING_APPROVED_PRESENTATION_CONTINUITY';
const TRANSPORT_SCOPE = 'EXACT_E035_V3_CONSUMER_PRESENTATION_ONLY';
const PREFIX = /^\.archive-meta-register\/evidence\/m2-e035-current-renderer-[A-Za-z0-9_-]+\//;
const TRANSPORT_PATH = /^\.archive-meta-register\/evidence\/m2-e035-current-renderer-[A-Za-z0-9_-]+\/transport\.json$/;
const REVIEW_PATH = /^\.archive-meta-register\/evidence\/m2-e035-current-renderer-[A-Za-z0-9_-]+\/independent(?:-[A-Za-z0-9_-]+)?-observation\.json$/;
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const REF4 = ['commit', 'path', 'gitBlobSha1', 'sha256'];
const SOURCE_REF = [...REF4, 'questionSha256'];
const OBSERVED = ['beforeProblemViewed', 'beforeSolutionViewed', 'currentProblemViewed', 'currentSolutionViewed',
  'currentStemAndChoicesRead', 'currentWrittenSolutionRead', 'currentAltAndCaptionsRead'];
const CONTINUITY = ['labelsAndGivenValuesPreserved', 'givenGeometryRelationsPreserved', 'choiceOrderUnchanged',
  'noNewGivenConditions', 'noNewAnswerHint', 'currentDiagramsSupportedByExistingWrittenSolution', 'currentAltAndCaptionsSupported'];
const ZERO = ['newMetadataApprovals', 'newDefinitionApprovals', 'newDifficultyJudgments', 'newFourSlotApprovals'];
const fail = message => {throw Error(`M2 E035 renderer continuity: ${message}`);};
const text = v => typeof v === 'string' && v.trim().length > 0;
const stable = v => JSON.stringify(v, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
const same = (a, b) => stable(a) === stable(b);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const clone = v => JSON.parse(stable(v));
const keys = (v, expected) => v && typeof v === 'object' && !Array.isArray(v) && same(Object.keys(v).sort(), [...expected].sort());
const omit = (v, excluded) => Object.fromEntries(Object.entries(v).filter(([k]) => !excluded.includes(k)));
const delta = (a, b) => Object.fromEntries([...new Set([...Object.keys(a), ...Object.keys(b)])].sort()
  .filter(k => !same(a[k], b[k])).map(k => [k, {before: {present: Object.hasOwn(a, k), value: a[k] ?? null},
    after: {present: Object.hasOwn(b, k), value: b[k] ?? null}}]));
const scope = v => Object.entries(M2_E035_SCOPE).every(([k, value]) => v?.[k] === value);
const noApprovals = v => v?.newMathematicalQa === false && ZERO.every(k => v[k] === 0);

function safe(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || relative.includes('\\') || /[\x00-\x1f]/.test(relative) ||
      relative.split('/').some(p => !p || p === '.' || p === '..')) fail('unsafe repository path');
  const full = path.resolve(root, relative), base = path.resolve(root);
  for (let p = full; p !== base; p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail('symlink evidence or source');
  return full;
}
function git(root, args, maxBuffer = 32 * 1024 * 1024) {
  try {return execFileSync('git', ['-c', 'protocol.allow=never', ...args], {cwd: root,
    env: {...process.env, GIT_NO_LAZY_FETCH: '1'}, maxBuffer, stdio: ['ignore', 'pipe', 'pipe']});}
  catch {fail('immutable Git object or HEAD unavailable');}
}
function file(ctx, commit, relative) {
  safe(ctx.root, relative);
  if (!SHA1.test(commit || '') || git(ctx.root, ['rev-parse', '--verify', `${commit}^{commit}`]).toString().trim() !== commit)
    fail('exact immutable commit required');
  const key = stable([commit, relative]);
  if (!ctx.files.has(key)) {
    const inventory = git(ctx.root, ['ls-tree', '-z', commit, '--', relative]).toString();
    const match = inventory.match(/^100644 blob ([a-f0-9]{40})\t([^\0]+)\0$/);
    if (!match || match[2] !== relative) fail('regular immutable blob required');
    // The served historical metadata is a complete immutable response. Keep it
    // byte-for-byte; only this exact repository path has the larger I/O limit.
    const metadata = relative === 'archive/data/question_metadata.json';
    const metadataLimit = 128 * 1024 * 1024;
    const sizeText = metadata ? git(ctx.root, ['cat-file', '-s', match[1]]).toString().trim() : null;
    if (metadata && (!/^(?:0|[1-9][0-9]*)$/.test(sizeText) || !Number.isSafeInteger(Number(sizeText)) ||
        Number(sizeText) > metadataLimit)) fail('immutable metadata byte limit exceeded');
    const bytes = git(ctx.root, ['cat-file', 'blob', match[1]], metadata ? metadataLimit : undefined);
    if (metadata && bytes.length !== Number(sizeText)) fail('immutable metadata byte length changed');
    if (blob(bytes) !== match[1]) fail('immutable blob content mismatch');
    ctx.files.set(key, {commit, path: relative, gitBlobSha1: match[1], sha256: sha(bytes), bytes});
  }
  return ctx.files.get(key);
}
function ancestor(ctx, commit) {
  if (!SHA1.test(commit || '')) fail('exact ancestor commit required');
  git(ctx.root, ['merge-base', '--is-ancestor', commit, ctx.head]);
}
function reference(ctx, ref, source = false) {
  if (!keys(ref, source ? SOURCE_REF : REF4) || !SHA1.test(ref.gitBlobSha1 || '') || !SHA256.test(ref.sha256 || '') ||
      source && !SHA256.test(ref.questionSha256 || '')) fail('complete immutable reference required');
  const found = file(ctx, ref.commit, ref.path);
  if (found.gitBlobSha1 !== ref.gitBlobSha1 || found.sha256 !== ref.sha256) fail('immutable reference digest changed');
  return found;
}
function live(ctx, ref, requireEvidence = true) {
  if (!keys(ref, ['path', 'sha256']) || !SHA256.test(ref.sha256 || '')) fail('exact live reference required');
  if (requireEvidence) for (const refs of [ctx.request.approval.evidenceRefs, ctx.patch.evidenceRefs])
    if (!Array.isArray(refs) || refs.filter(r => same(r, ref)).length !== 1) fail('evidence must bind approval and selected item exactly once');
  let bytes;
  try {const full = safe(ctx.root, ref.path);if (!fs.statSync(full).isFile()) fail('regular live file required');bytes = fs.readFileSync(full);}
  catch {fail('bound live evidence or source missing');}
  if (sha(bytes) !== ref.sha256) fail('bound live evidence or source changed');
  return bytes;
}
function document(ctx, ref) {
  const found = reference(ctx, ref);ancestor(ctx, ref.commit);
  if (!live(ctx, {path: ref.path, sha256: ref.sha256}).equals(found.bytes)) fail('live document differs from immutable bytes');
  try {return JSON.parse(found.bytes);} catch {fail('invalid bound JSON');}
}
function snapshot(ctx, ref) {
  const found = reference(ctx, ref, true);ancestor(ctx, ref.commit);
  if (ref.path !== `archive/exams/${M2_E035_SCOPE.sourceArchiveFile}`) fail('source path outside E035');
  const bank = ctx.bankFromBytes(found.bytes), question = bank[11];
  if (!Array.isArray(bank) || bank.length !== 21 || !question || question.id !== 12 ||
      new Set(bank.map(q => q.id)).size !== 21 || sha(stable(question)) !== ref.questionSha256)
    fail('source denominator, selected object or display identity changed');
  return {ref, ...found, bank, question};
}
function png(bytes) {
  if (bytes.length < 33 || !bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ||
      bytes.toString('ascii', 12, 16) !== 'IHDR') fail('original PNG capture required');
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  if (!width || !height || width > 20000 || height > 20000) fail('invalid PNG dimensions');
  return {width, height};
}

// A small strict XML reader is sufficient for these fixed static assets. It
// also checks the existing self-contained nested SVG panels in the native file.
function svgTree(bytes, allowEmbedded = false, depth = 0) {
  const value = bytes.toString('utf8');
  if (depth > 4 || bytes.length > 2 * 1024 * 1024 || !Buffer.from(value).equals(bytes) ||
      /<!DOCTYPE|<!ENTITY|<\?xml-stylesheet|&/i.test(value)) fail('non-static or encoded SVG input');
  const allowed = new Set(['svg','title','desc','g','path','rect','line','circle','ellipse','polygon','polyline',
    'text','tspan','defs','use','clippath','mask','lineargradient','radialgradient','stop','pattern','symbol','image']);
  const tokens = /<!--[\s\S]*?-->|<\?xml[\s\S]*?\?>|<\/?(?:[^"'<>]|"[^"]*"|'[^']*')+>|[^<]+/gy;
  const stack = [], roots = [];let at = 0;
  for (let m; (m = tokens.exec(value));) {
    if (m.index !== at) fail('malformed SVG token');at = tokens.lastIndex;const token = m[0];
    if (token.startsWith('<!--') || token.startsWith('<?xml')) continue;
    if (!token.startsWith('<')) {if (token.trim()) {if (!stack.length) fail('SVG text outside root');stack.at(-1).children.push({text: token.trim()});}continue;}
    if (token.startsWith('</')) {
      const name = token.slice(2, -1).trim();if (!stack.length || stack.at(-1).rawName !== name) fail('unbalanced SVG');stack.pop();continue;
    }
    const closed = token.endsWith('/>'), body = token.slice(1, closed ? -2 : -1), nm = body.match(/^([^\s/>]+)/);
    if (!nm) fail('malformed SVG element');
    const rawName = nm[1], localName = rawName.split(':').at(-1).toLowerCase(), rawAttrs = body.slice(rawName.length), attrs = [];
    if (!allowed.has(localName) || localName === 'image' && !allowEmbedded) fail('active or unsupported SVG element');
    const attr = /\s+([^\s=\/"'<>]+)\s*=\s*("[^"]*"|'[^']*')/gy;let end = 0;
    for (let a; (a = attr.exec(rawAttrs));) {
      if (a.index !== end) fail('malformed SVG attribute');end = attr.lastIndex;
      const name = a[1], v = a[2].slice(1, -1), local = name.split(':').at(-1).toLowerCase();
      if (attrs.some(x => x.name === name) || /^on/i.test(local) || name.toLowerCase() === 'xml:base' ||
          /\\|@import|@(?:-[a-z]+-)?keyframes|animation|transition|expression\s*\(|javascript:|behavior\s*:|-moz-binding/i.test(v))
        fail('active or encoded SVG attribute');
      if (local === 'href' || local === 'src') {
        if (v.startsWith('#')) {if (!/^#[A-Za-z_][\w:.-]*$/.test(v)) fail('invalid local SVG dependency');}
        else if (allowEmbedded && localName === 'image' && /^data:image\/svg\+xml;base64,[A-Za-z0-9+/]+={0,2}$/.test(v)) {
          const b64 = v.slice('data:image/svg+xml;base64,'.length), nested = Buffer.from(b64, 'base64');
          if (nested.toString('base64') !== b64) fail('non-canonical embedded SVG');svgTree(nested, false, depth + 1);
        } else fail('external SVG dependency');
      }
      for (const u of v.matchAll(/url\s*\(\s*(['"]?)(.*?)\1\s*\)/gi))
        if (!/^#[A-Za-z_][\w:.-]*$/.test(u[2])) fail('external SVG CSS dependency');
      if (/url/i.test(v) && !/url\s*\(/i.test(v)) fail('encoded SVG URL');
      attrs.push({name, value: v});
    }
    if (rawAttrs.slice(end).trim()) fail('unparsed SVG attributes');
    const ns = new Map(stack.length ? stack.at(-1).ns : []);
    for (const a of attrs) if (a.name === 'xmlns') ns.set('', a.value);else if (a.name.startsWith('xmlns:')) ns.set(a.name.slice(6), a.value);
    const parts = rawName.split(':');if (parts.length > 2 || ns.get(parts.length === 2 ? parts[0] : '') !== 'http://www.w3.org/2000/svg') fail('non-SVG namespace');
    const node = {name: rawName.split(':').at(-1), attrs: attrs.sort((a,b) => a.name.localeCompare(b.name, 'en')), children: []};
    if (stack.length) stack.at(-1).children.push(node);else roots.push(node);
    if (!closed) stack.push({rawName, ns, children: node.children});
  }
  if (at !== value.length || stack.length || roots.length !== 1 || roots[0].name !== 'svg') fail('malformed SVG document');
  return roots[0];
}
function pair(ctx, refs, source, {current = false, requireLive = true, nativeCommit} = {}) {
  if (!keys(refs, ['problem', 'solution'])) fail('exact problem and solution inventory required');
  const expected = {problem: source.question.image, solution: source.question.solutionImage};
  const extraKeys = ['images','solutionImages','figureSvg','solutionFigureSvg'];
  if (extraKeys.some(k => source.question[k] !== undefined && source.question[k] !== null && source.question[k] !== '')) fail('additional renderer outside E035 pair');
  for (const [role, ref] of Object.entries(refs)) {
    if (typeof expected[role] !== 'string' || !/^assets\/images\//.test(expected[role]) || /[?#%\s]/.test(expected[role]) ||
        ref.path !== `archive/${expected[role]}`) fail('renderer inventory differs from selected question');
    const found = reference(ctx, ref);ancestor(ctx, ref.commit);
    if (file(ctx, source.ref.commit, ref.path).sha256 !== ref.sha256 ||
        nativeCommit && file(ctx, nativeCommit, ref.path).sha256 !== ref.sha256) fail('renderer not in the authenticated source snapshot');
    if (requireLive && !live(ctx, {path: ref.path, sha256: ref.sha256}).equals(found.bytes)) fail('live renderer changed');
    if (/\.svg$/i.test(ref.path)) svgTree(found.bytes, !current);else if (/\.png$/i.test(ref.path)) png(found.bytes);else fail('unsupported renderer file');
  }
  // The full selected payload is also compared on both metadata axes below.
  // E035 has no separately loaded content/choice renderer or inline SVG.
  for (const k of ['content','question','choices','solution']) {
    const s = stable(source.question[k] ?? null);
    if (/<(?:[^<>\s/:]+:)?(?:img|svg|image|object|iframe|embed|video|audio)\b|\b(?:src|href)\s*=|url\s*\(/i.test(s))
      fail('additional inline renderer outside fixed pair');
  }
  return refs;
}

function observation(ctx, ref, before, current, positive) {
  const value = document(ctx, ref);
  if (!keys(value, ['schemaVersion','scope','observer','observedAt','decision',...Object.keys(M2_E035_SCOPE),
    'nativeReviewRef','beforeSourceRef','currentSourceRef','beforeAssets','currentAssets','renderedViews','observed','continuity','observations',
    'newMathematicalQa',...ZERO]) || value.schemaVersion !== M2_E035_REVIEW_SCHEMA || value.scope !== REVIEW_SCOPE || !scope(value) ||
      value.decision !== (positive ? 'RETAIN_EXISTING_APPROVED_METADATA' : 'HOLD') || !text(value.observer) || !text(value.observedAt) ||
      value.observer === ctx.native.reviewer || value.observer === ctx.request.approval.approvedBy || !noApprovals(value) ||
      !same(value.nativeReviewRef, ctx.transport.nativeReviewRef) || !same(value.beforeSourceRef, before.ref) || !same(value.currentSourceRef, current.ref) ||
      !keys(value.observed, OBSERVED) || Object.values(value.observed).some(x => x !== true) ||
      !keys(value.continuity, CONTINUITY) || Object.values(value.continuity).some(x => typeof x !== 'boolean') ||
      (positive ? Object.values(value.continuity).some(x => !x) : Object.values(value.continuity).every(Boolean)) ||
      !keys(value.observations, ['problem','solution','writtenContext','altAndCaptions','unresolvedIssue']) ||
      ['problem','solution','writtenContext','altAndCaptions'].some(k => !text(value.observations[k])) ||
      (positive ? value.observations.unresolvedIssue !== null : !text(value.observations.unresolvedIssue)))
    fail('actual independent renderer observation missing, pending or contradictory');
  reference(ctx, value.nativeReviewRef);
  pair(ctx, value.beforeAssets, before, {nativeCommit: ctx.native.spec.reviewCommit});
  pair(ctx, value.currentAssets, current, {current: true, requireLive: positive});
  if (!Array.isArray(value.renderedViews) || value.renderedViews.length !== 4) fail('four actual renderer views required');
  for (const phase of ['before','current']) for (const role of ['problem','solution']) {
    const rows = value.renderedViews.filter(v => v.phase === phase && v.role === role), view = rows[0];
    if (rows.length !== 1 || !keys(view, ['phase','role','assetRef','captureRef','renderer','width','height']) ||
        !same(view.assetRef, value[`${phase}Assets`][role]) || !text(view.renderer) ||
        !keys(view.captureRef, ['path','sha256']) || !PREFIX.test(view.captureRef.path || '')) fail('actual capture inventory changed');
    const capture = live(ctx, view.captureRef), immutable = file(ctx, ref.commit, view.captureRef.path), size = png(capture);
    if (!capture.equals(immutable.bytes) || size.width !== view.width || size.height !== view.height) fail('capture bytes or dimensions changed');
  }
  return value;
}

function presentation(before, current) {
  const d = delta(before, current);
  if (!same(Object.keys(d), M2_E035_RENDERER_FIELDS) || !same(omit(before, M2_E035_RENDERER_FIELDS), omit(current, M2_E035_RENDERER_FIELDS)) ||
      !/\.png$/.test(before.image || '') || !/\.svg$/.test(current.image || '') ||
      !/\.svg$/.test(before.solutionImage || '') || !/\.svg$/.test(current.solutionImage || '') || before.solutionImage === current.solutionImage ||
      Object.hasOwn(before, 'imageAlt') || Object.hasOwn(before, 'imageSize') || current.imageSize !== 'tall' ||
      before.layoutTag !== 'grid' || current.layoutTag !== 'fullwidth' ||
      ['imageAlt','solutionImageAlt','solutionImageCaption'].some(k => !text(current[k]) || current[k].length > 2000 || /[\x00-\x1f<>]/.test(current[k])) ||
      ['solutionImageAlt','solutionImageCaption'].some(k => !text(before[k]))) fail('exact seven-field presentation transition required');
  return d;
}

function repair(ctx, ref, before, preRepair, current, repairedObservation) {
  const r = document(ctx, ref);
  if (!keys(r, ['schemaVersion','producer','stage',...Object.keys(M2_E035_SCOPE),'publicParent','sourceBlobUnchangedFrom0343',
    'priorNegativeObservationPath','priorNegativeObservationSha256','changedAssetPath','beforeSha256','afterSha256','xmlChanges','actualRootRead',
    'independentNarrowReadSha256','sourceAndProblemAssetChanges','metadataChanges','newMathematicalQa','newMetadataApprovals','newFourSlotApprovals',
    'studentUiTechnical','studentUiIndependent','registration']) || r.schemaVersion !== 'archive-e035-root-minimal-asset-repair-v1' ||
      r.stage !== 'NARROW_ASSET_REPAIR_ONLY_STUDENT_UI_PENDING' || !scope(r) || !text(r.producer) || r.producer === repairedObservation.observer ||
      r.sourceAndProblemAssetChanges !== 0 || r.metadataChanges !== 0 || r.newMathematicalQa !== false || r.newMetadataApprovals !== 0 || r.newFourSlotApprovals !== 0 ||
      !same(r.xmlChanges, {removedLineElements: 1, addedTextElements: 1, allOtherNodesOrderedExact: true, rootAttributesExact: true}) ||
      !same(r.actualRootRead, {originalProblemAndSolutionViewed: true, currentProblemAndSolutionViewed: true, repairedSolutionRasterViewed: true,
        ambiguousSubsegmentTickRemoved: true, fullEndpointRelationNowExplicit: true, existingLabelsAndMeasuresPreserved: true,
        newNumericalValues: 0, visibleOverlapOrClippingObserved: false}) || !SHA256.test(r.independentNarrowReadSha256 || '') ||
      r.studentUiTechnical !== 'NOT_RUN' || r.studentUiIndependent !== 'NOT_RUN' || r.registration !== 'NOT_RUN')
    fail('explicit independent solution repair closure required');
  const priorRef = ctx.transport.priorNegativeObservationRef, negative = observation(ctx, priorRef, before, preRepair, false),
    oldSolution = negative.currentAssets.solution, newSolution = repairedObservation.currentAssets.solution;
  ancestor(ctx, r.publicParent);
  if (r.priorNegativeObservationPath !== priorRef.path || r.priorNegativeObservationSha256 !== priorRef.sha256 ||
      r.changedAssetPath !== oldSolution.path || r.changedAssetPath !== newSolution.path || r.beforeSha256 !== oldSolution.sha256 || r.afterSha256 !== newSolution.sha256 ||
      r.sourceBlobUnchangedFrom0343 !== current.gitBlobSha1 || current.ref.commit !== ref.commit ||
      !file(ctx, r.publicParent, preRepair.ref.path).bytes.equals(preRepair.bytes) || file(ctx, r.publicParent, oldSolution.path).sha256 !== oldSolution.sha256 ||
      file(ctx, ref.commit, newSolution.path).sha256 !== newSolution.sha256 ||
      !preRepair.bytes.equals(current.bytes) || !same(preRepair.question, current.question) ||
      negative.currentAssets.problem.path !== repairedObservation.currentAssets.problem.path ||
      negative.currentAssets.problem.gitBlobSha1 !== repairedObservation.currentAssets.problem.gitBlobSha1 ||
      negative.currentAssets.problem.sha256 !== repairedObservation.currentAssets.problem.sha256 ||
      oldSolution.sha256 === newSolution.sha256)
    fail('only the same-path solution asset may repair the recorded ambiguity');
  const a = svgTree(reference(ctx, oldSolution).bytes), b = svgTree(reference(ctx, newSolution).bytes);
  const matches = [];
  if (same(omit(a, ['children']), omit(b, ['children'])) && a.children.length === b.children.length)
    for (let i = 0; i < a.children.length; i++) for (let j = 0; j < b.children.length; j++) {
      const removed = a.children[i], added = b.children[j];
      if (removed.name === 'line' && removed.children.length === 0 && added.name === 'text' &&
          added.children.length === 1 && text(added.children[0].text) && !/[0-9]/.test(added.children[0].text) &&
          same(a.children.filter((_, k) => k !== i), b.children.filter((_, k) => k !== j)))
        matches.push({removedElementSha256: sha(stable(removed)), addedElementSha256: sha(stable(added)),
          beforeTreeSha256: sha(stable(a)), afterTreeSha256: sha(stable(b)),
          preservedSequenceSha256: sha(stable(a.children.filter((_, k) => k !== i)))});
    }
  if (matches.length !== 1) fail('repair must remove one line and add one text node only');
  const history = immutableObligations(ctx.root);
  const expected = stable([priorRef.path, priorRef.sha256]);
  if (!history.negativeRefs.has(expected) || history.negativeRefs.size !== 1) fail('unresolved or missing original HOLD history');
  return {priorObservationRef: clone(priorRef), repairedObservationRef: clone(ctx.transport.observationRef), xmlDelta: matches[0],
    historicalCandidateReadIdentifier: r.independentNarrowReadSha256, historicalIdentifierUsedAsApproval: false};
}

// E035's mobile context, layout viewport and visual viewport have different
// dimensions. Validate the measured transform explicitly; the older fixed-three
// tile validator continues to receive and validate only layout CSS coordinates.
function studentViewportCapture(result) {
  const capture = result.capture, context = {width: result.viewport.width, height: result.viewport.height};
  const size = v => keys(v, ['width','height']) && [v.width,v.height].every(x => Number.isInteger(x) && x > 0);
  const shape = (value, withOrigin = false) => {
    if (!keys(value, ['layoutViewport','documentClient','visualViewport','screen','devicePixelRatio']) ||
        !size(value.layoutViewport) || !size(value.documentClient) || !same(value.screen, context) || value.devicePixelRatio !== 1 ||
        !keys(value.visualViewport, ['width','height','offsetLeft','offsetTop','scale', ...(withOrigin ? ['pageLeft','pageTop'] : [])]) ||
        Object.values(value.visualViewport).some(x => !Number.isFinite(x))) fail('exact current viewport measurements required');
    const v = value.visualViewport;
    if (v.width <= 0 || v.height <= 0 || v.scale <= 0 || v.offsetLeft < 0 || v.offsetTop < 0 ||
        Math.abs(v.width * v.scale - context.width) > 1 || Math.abs(v.height * v.scale - context.height) > 1)
      fail('visual viewport does not map to the unchanged browser context');
    return {...value, visualViewport: omit(v, ['pageLeft','pageTop'])};
  };
  if (!capture || capture.coordinateSystem !== 'LAYOUT_CSS_PIXELS' ||
      !keys(capture.viewportEvidence, ['contextViewport','isMobile','hasTouch','deviceScaleFactor','beforeScroll','afterScroll']))
    fail('explicit E035 v2 viewport evidence required');
  const evidence = capture.viewportEvidence;
  if (!same(evidence.contextViewport, context) || evidence.isMobile !== (result.viewport.name === 'mobile') ||
      evidence.hasTouch !== evidence.isMobile || evidence.deviceScaleFactor !== 1 ||
      !same(shape(evidence.beforeScroll), shape(evidence.afterScroll)) ||
      !same(capture.viewport, evidence.beforeScroll.layoutViewport) || !Array.isArray(capture.tiles))
    fail('browser viewport or layout changed during capture');
  for (const tile of capture.tiles) {
    const s = tile.screenshotEvidence, clip = tile.clip, scroll = tile.scroll;
    if (!keys(s, ['api','fullPage','scale','coordinateSystem','documentClip','contextViewportBefore','contextViewportAfter',
      'metricsBefore','metricsAfter','pngDimensions','visibleRoiContained','postprocessing']) ||
        s.api !== 'PAGE_SCREENSHOT' || s.fullPage !== true || s.scale !== 'css' || s.coordinateSystem !== 'DOCUMENT_CSS_PIXELS' ||
        s.visibleRoiContained !== true || s.postprocessing !== false || !same(s.contextViewportBefore, context) ||
        !same(s.contextViewportAfter, context) || !same(s.metricsBefore, s.metricsAfter) ||
        !same(shape(s.metricsBefore, true), evidence.beforeScroll) || !size(s.pngDimensions) ||
        !keys(clip, ['x','y','width','height']) || Object.values(clip).some(x => !Number.isFinite(x)) || clip.width <= 0 || clip.height <= 0 ||
        !keys(scroll, ['x','y']) || Object.values(scroll).some(x => !Number.isFinite(x)))
      fail('original document-coordinate screenshot evidence changed');
    const v = s.metricsBefore.visualViewport;
    if (Math.abs(v.pageLeft - scroll.x - v.offsetLeft) >= 0.01 || Math.abs(v.pageTop - scroll.y - v.offsetTop) >= 0.01 ||
        clip.x < v.offsetLeft || clip.y < v.offsetTop || clip.x + clip.width > v.offsetLeft + v.width ||
        clip.y + clip.height > v.offsetTop + v.height ||
        !same(s.documentClip, {x: clip.x + scroll.x, y: clip.y + scroll.y, width: clip.width, height: clip.height}) ||
        s.documentClip.x < 0 || s.documentClip.y < 0 ||
        !same(s.pngDimensions, {width: Math.floor(clip.width), height: Math.floor(clip.height)}))
      fail('screenshot ROI is clipped, offscreen or in a different coordinate system');
  }
  return {...result, viewport: {...result.viewport, ...capture.viewport}, capture: {
    ...omit(capture, ['coordinateSystem','viewportEvidence']),
    tiles: capture.tiles.map(tile => omit(tile, ['screenshotEvidence'])),
  }};
}

// The v3 producer captures only the current, unscaled viewport. Its historical
// tile algorithm is authenticated separately from the current served renderer.
// The v2 document-coordinate contract above remains unchanged.
const UI_V3_SCHEMA = 'archive-e035-current-renderer-student-ui-technical-v3';
const UI_V3_HELPER = Object.freeze({
  path: 'tools/check-reviewed-problem-renderer-browser.cjs',
  gitBlobSha1: 'dcb4382ada6913f9aa35a820777248ee93879e36',
  sha256: '94ec31b0e66d1461e7e9757e10af194ac2de47d9b614da4ab191e4615a17dfa4',
});
function studentViewportCaptureV3(result) {
  const capture = result.capture, context = {width: result.viewport.width, height: result.viewport.height};
  const size = v => keys(v, ['width','height']) && [v.width,v.height].every(x => Number.isInteger(x) && x > 0);
  const shape = (value, withOrigin = false) => {
    if (!keys(value, ['layoutViewport','documentClient','visualViewport','screen','devicePixelRatio']) ||
        !same(value.layoutViewport, context) || !same(value.documentClient, context) || !same(value.screen, context) ||
        value.devicePixelRatio !== 1 ||
        !keys(value.visualViewport, ['width','height','offsetLeft','offsetTop','scale', ...(withOrigin ? ['pageLeft','pageTop'] : [])]) ||
        Object.values(value.visualViewport).some(x => !Number.isFinite(x))) fail('exact v3 viewport measurements required');
    const v = value.visualViewport;
    if (v.width !== context.width || v.height !== context.height || v.scale !== 1 || v.offsetLeft !== 0 || v.offsetTop !== 0)
      fail('v3 layout, client, visual and browser context must be identical');
    return {...value, visualViewport: omit(v, ['pageLeft','pageTop'])};
  };
  if (!capture || capture.coordinateSystem !== 'LAYOUT_CSS_PIXELS' ||
      !keys(capture.viewportEvidence, ['contextViewport','isMobile','hasTouch','deviceScaleFactor','beforeScroll','afterScroll']))
    fail('explicit E035 v3 viewport evidence required');
  const evidence = capture.viewportEvidence;
  if (!same(evidence.contextViewport, context) || evidence.isMobile !== (result.viewport.name === 'mobile') ||
      evidence.hasTouch !== evidence.isMobile || evidence.deviceScaleFactor !== 1 ||
      !same(shape(evidence.beforeScroll), shape(evidence.afterScroll)) ||
      !same(capture.viewport, context) || !Array.isArray(capture.tiles))
    fail('v3 browser viewport or layout changed during capture');
  for (const tile of capture.tiles) {
    const s = tile.screenshotEvidence, clip = tile.clip, scroll = tile.scroll;
    if (!keys(s, ['api','fullPage','scale','coordinateSystem','viewportClip','documentClip','documentClipRole',
      'contextViewportBefore','contextViewportAfter','metricsBefore','metricsAfter','pngDimensions','pixelRule',
      'playwrightVersion','visibleRoiContained','postprocessing']) ||
        s.api !== 'PAGE_SCREENSHOT' || s.fullPage !== false || s.scale !== 'css' ||
        s.coordinateSystem !== 'VIEWPORT_CSS_PIXELS' || s.documentClipRole !== 'DERIVED_VISIBLE_ROI_ONLY' ||
        s.pixelRule !== 'FLOOR_CSS_PX_PLUS_0_001' || s.playwrightVersion !== '1.62.1' ||
        s.visibleRoiContained !== true || s.postprocessing !== false || !same(s.contextViewportBefore, context) ||
        !same(s.contextViewportAfter, context) || !same(s.metricsBefore, s.metricsAfter) ||
        !same(shape(s.metricsBefore, true), evidence.beforeScroll) || !size(s.pngDimensions) ||
        !keys(clip, ['x','y','width','height']) || Object.values(clip).some(x => !Number.isFinite(x)) || clip.width <= 0 || clip.height <= 0 ||
        !keys(scroll, ['x','y']) || Object.values(scroll).some(x => !Number.isFinite(x)) || !same(s.viewportClip, clip))
      fail('original v3 viewport screenshot evidence changed');
    const v = s.metricsBefore.visualViewport;
    if (v.pageLeft !== scroll.x || v.pageTop !== scroll.y || clip.x < 0 || clip.y < 0 ||
        clip.x + clip.width > context.width || clip.y + clip.height > context.height ||
        !same(s.documentClip, {x: clip.x + scroll.x, y: clip.y + scroll.y, width: clip.width, height: clip.height}) ||
        s.documentClip.x < 0 || s.documentClip.y < 0 ||
        !same(s.pngDimensions, {width: Math.floor(clip.width + 0.001), height: Math.floor(clip.height + 0.001)}))
      fail('v3 screenshot ROI, origin or exact PNG quantization changed');
  }
  return {...result, viewport: {...result.viewport, ...capture.viewport}, capture: {
    ...omit(capture, ['coordinateSystem','viewportEvidence']),
    tiles: capture.tiles.map(tile => omit(tile, ['screenshotEvidence'])),
  }};
}

function studentUi(ctx, technicalRef, visualRef, source, assets) {
  const technical = document(ctx, technicalRef), visual = document(ctx, visualRef);
  const v3 = technical.schemaVersion === UI_V3_SCHEMA;
  if (!keys(technical, ['schemaVersion','status','producer','observedAt','executionOwner','checkoutCommit','rendererRef','sourceRef','currentAssets',
    'browserVersion','producerRef','servedFiles','mirroredAssets','transportMetadata',
    ...(v3 ? ['playwrightVersion','helperRef','helperVersion'] : []),
    'sourceOverlayCount','cssWrites','domWrites','newMathematicalQa','newMetadataApprovals','newDifficultyJudgments','cases']) ||
      (!v3 && technical.schemaVersion !== 'archive-e035-current-renderer-student-ui-technical-v2') || technical.status !== 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING' ||
      !text(technical.producer) || !text(technical.observedAt) ||
      !['ROOT_CLOUD_CHROME','GITHUB_ACTIONS_SUPPORTED_CHROME'].includes(technical.executionOwner) ||
      technical.sourceOverlayCount !== 0 || technical.cssWrites !== 0 || technical.domWrites !== 0 ||
      technical.newMathematicalQa !== false || technical.newMetadataApprovals !== 0 || technical.newDifficultyJudgments !== 0 ||
      !Array.isArray(technical.cases) || technical.cases.length !== 4) fail('four actual current student UI cases required');
  if (!text(technical.browserVersion)) fail('actual browser version required');
  if (v3) {
    if (technical.executionOwner !== 'GITHUB_ACTIONS_SUPPORTED_CHROME' || technical.playwrightVersion !== '1.62.1' ||
        technical.helperVersion !== 'archive-problem-scroll-coverage-v1' || !keys(technical.helperRef, REF4) ||
        !same(omit(technical.helperRef, ['commit']), UI_V3_HELPER)) fail('exact v3 producer and historical tile helper required');
    reference(ctx, technical.helperRef);ancestor(ctx, technical.helperRef.commit);
  }
  reference(ctx, technical.producerRef);ancestor(ctx, technical.producerRef.commit);
  for (const refs of [technical.servedFiles, technical.mirroredAssets]) {
    if (!Array.isArray(refs) || new Set(refs.map(r => r?.path)).size !== refs.length) fail('exact unique served file references required');
    for (const ref of refs) {reference(ctx, ref);ancestor(ctx, ref.commit);}
  }
  const tm = technical.transportMetadata;
  if (!keys(tm, ['mode','storageKeys','questionCount','mixedQuestionsSha256','mixedMetaSha256','sourceOverlayCount']) ||
      tm.mode !== 'LEGACY_MIXED_STORAGE' || !same(tm.storageKeys, ['mixedQuestions','mixedMeta']) || tm.questionCount !== 21 ||
      tm.mixedQuestionsSha256 !== sha(stable(source.bank)) || !SHA256.test(tm.mixedMetaSha256 || '') || tm.sourceOverlayCount !== 0)
    fail('actual unchanged full-bank student storage transport required');
  ancestor(ctx, technical.checkoutCommit);
  if (technical.rendererRef?.commit !== technical.checkoutCommit || technical.rendererRef.path !== 'archive/mixed_engine.html')
    fail('actual student renderer checkout required');
  reference(ctx, technical.rendererRef);
  if (technical.sourceRef?.commit !== technical.checkoutCommit || technical.sourceRef.path !== source.ref.path ||
      !reference(ctx, technical.sourceRef).bytes.equals(source.bytes) || !keys(technical.currentAssets, ['problem','solution']))
    fail('student UI source differs from the inspected production source');
  for (const role of ['problem','solution']) {
    const ref = technical.currentAssets[role];
    if (ref?.commit !== technical.checkoutCommit || ref.path !== assets[role].path || ref.gitBlobSha1 !== assets[role].gitBlobSha1 ||
        ref.sha256 !== assets[role].sha256) fail('student UI asset differs from repaired current asset');
    reference(ctx, ref);
  }
  // The legacy production path reads the exact source bank into normal storage;
  // that source is not falsely described as an HTTP response. Assets may use
  // the production mirror URL while preserving the exact Git response bytes.
  if (technical.servedFiles.filter(r => same(r, technical.rendererRef)).length !== 1)
    fail('student renderer absent from served inventory');
  const servedAssets = [...technical.servedFiles, ...technical.mirroredAssets];
  for (const required of Object.values(technical.currentAssets))
    if (servedAssets.filter(r => same(r, required)).length !== 1) fail('student asset absent or duplicated in response inventory');
  if (!keys(visual, ['schemaVersion','scope','decision','observer','observedAt','producer','technicalRef','records',
    'newMathematicalQa','newMetadataApprovals','newDifficultyJudgments','newFourSlotApprovals']) ||
      visual.schemaVersion !== 'archive-independent-e035-current-renderer-student-ui-review-v1' || visual.scope !== 'EXACT_E035_FOUR_CURRENT_UI_CASES' ||
      visual.decision !== 'RETAIN_EXISTING_APPROVED_PRESENTATION' || !text(visual.observer) || !text(visual.observedAt) ||
      visual.observer === technical.producer || visual.observer === ctx.native.reviewer || visual.producer !== technical.producer ||
      !same(visual.technicalRef, technicalRef) || visual.newMathematicalQa !== false || visual.newMetadataApprovals !== 0 ||
      visual.newDifficultyJudgments !== 0 || visual.newFourSlotApprovals !== 0 || !Array.isArray(visual.records) || visual.records.length !== 4)
    fail('separate independent observation of the current student UI required');
  const allShots = new Set();
  for (const viewport of ['desktop','mobile']) for (const view of ['problem','solution']) {
    const id = `${viewport}-${view}`, cases = technical.cases.filter(c => c.caseId === id), reviews = visual.records.filter(r => r.caseId === id);
    const c = cases[0], v = reviews[0];
    if (cases.length !== 1 || reviews.length !== 1 || !keys(c, ['caseId','questionUid','sourceOrdinal','view','viewport','status','visualReview',
      'questionCount','readiness','imagesComplete','mathJaxSource','mathErrors','unrenderedMath','fontStatus','fontFamilies','solutionNodes',
      'pageErrors','requestFailures','capture','screenshots']) || c.questionUid !== M2_E035_SCOPE.questionUid || c.sourceOrdinal !== 12 || c.view !== view ||
        !keys(c.viewport, ['name','width','height']) || c.viewport.name !== viewport || !Number.isInteger(c.viewport.width) || !Number.isInteger(c.viewport.height) ||
        c.viewport.width < 300 || c.viewport.height < 300 || c.viewport.width > 4000 || c.viewport.height > 4000 ||
        c.status !== 'PASS' || c.visualReview !== 'PENDING' || c.questionCount !== 21 || c.readiness !== 'RENDER_READY' || c.imagesComplete !== true ||
        c.mathJaxSource !== 'local' || c.mathErrors !== 0 || c.unrenderedMath !== 0 || c.fontStatus !== 'loaded' ||
        !Array.isArray(c.fontFamilies) || !c.fontFamilies.length || c.fontFamilies.some(x => !text(x)) ||
        !Number.isInteger(c.solutionNodes) || (view === 'problem' ? c.solutionNodes !== 0 : c.solutionNodes < 1) ||
        !same(c.pageErrors, []) || !same(c.requestFailures, []) ||
        !keys(v, ['caseId','view','coverageReview','completeSolutionCoverage','glyphsLegible','observations']) || v.view !== view ||
        v.completeSolutionCoverage !== (view === 'solution') || v.glyphsLegible !== true || !text(v.observations) ||
        v.coverageReview?.questionUid !== c.questionUid || v.coverageReview.sourceOrdinal !== 12 || v.coverageReview.viewport !== viewport)
      fail('missing or contradictory four-case student UI measurements');
    const contextPreset = viewport === 'desktop' ? {name:'desktop',width:1280,height:900} : {name:'mobile',width:390,height:844};
    if (!same(c.viewport, contextPreset)) fail('exact E035 student context presets required');
    const layoutCase = v3 ? studentViewportCaptureV3(c) : studentViewportCapture(c);
    const shots = validateM2ProblemRendererUiTileEvidence(ctx, layoutCase, v.coverageReview, `e035-${view}`);
    for (const shot of shots) {
      const relative = `${path.posix.dirname(technicalRef.path)}/${shot.path}`;
      if (allShots.has(relative)) fail('duplicate UI tile');allShots.add(relative);
      const capture = live(ctx, {path: relative, sha256: shot.sha256}), original = file(ctx, technicalRef.commit, relative), size = png(capture);
      const tile = c.capture.tiles[shot.tileIndex - 1];
      if (!capture.equals(original.bytes) || capture.length !== shot.bytes ||
          // The supported DPR-1 Chromium producer emits the integer floor of
          // fractional CSS clip dimensions. This never permits a viewport-
          // clipped image: coverage and viewport geometry are checked above,
          // and the PNG must still have the complete requested dimensions.
          size.width !== Math.floor(tile.clip.width + (v3 ? 0.001 : 0)) || size.height !== Math.floor(tile.clip.height + (v3 ? 0.001 : 0)) ||
          !same(size, tile.screenshotEvidence.pngDimensions)) fail('original UI tile bytes or pixel dimensions changed');
    }
  }
  return {technicalRef: clone(technicalRef), visualRef: clone(visualRef), technicalSchemaVersion: technical.schemaVersion,
    coordinateSystem: v3 ? 'LAYOUT_CSS_PIXELS_WITH_EXACT_VIEWPORT_CAPTURE' : 'LAYOUT_CSS_PIXELS_WITH_VERIFIED_VISUAL_VIEWPORT',
    ...(v3 ? {helperRef: clone(technical.helperRef), helperVersion: technical.helperVersion, playwrightVersion: technical.playwrightVersion,
      screenshotApi: 'PAGE_SCREENSHOT', fullPage: false, pixelRule: 'FLOOR_CSS_PX_PLUS_0_001'} : {}), checkoutCommit: technical.checkoutCommit,
    rendererRef: clone(technical.rendererRef), caseCount: 4, originalTileCount: allShots.size, observer: visual.observer};
}

export function validateM2E035RendererContinuity(args) {
  const spec = args.patch.sourceReview?.m2E035RendererContinuity;
  if (spec === undefined) return null;
  const ctx = {...args, files: new Map()}, request = ctx.request, patch = ctx.patch;
  ctx.head = git(ctx.root, ['rev-parse','--verify','HEAD^{commit}']).toString().trim();
  if (!keys(spec, ['schemaVersion','transportCommit','transportRef']) || spec.schemaVersion !== M2_E035_RENDERER_SCHEMA ||
      !keys(spec.transportRef, ['path','sha256']) || !TRANSPORT_PATH.test(spec.transportRef.path || '') ||
      !scope({...request, ...patch}) || request.schemaVersion !== 'archive-reviewed-exam-meta-register-request-v2' ||
      request.scope !== 'PARTIAL_UIDS' || request.approval?.type !== 'FINAL_QA' || request.approval.metadataReviewed !== true ||
      request.registrationMode !== undefined || request.approval.sourceRebind !== undefined || patch.rebind !== undefined ||
      !Array.isArray(request.items) || request.items.length !== 1 || request.items[0] !== patch || !same(request.registryChanges, []) ||
      !keys(patch.sourceReview, [...AUTHORITY, 'm2E035RendererContinuity']) ||
      patch.sourceReview.proposalFinalization?.schemaVersion !== 'archive-native-proposal-finalization-v3' ||
      !keys(patch.sourceReview.proposalFinalization, ['schemaVersion','finalizationCommit','finalizationRef','proposalSelections']) ||
      ctx.native.review.schemaVersion !== 'm2-s2-meta-review-v1' || ctx.native.review.examId !== 'E035' ||
      !['KEEP','CORRECT'].includes(ctx.row.rpmDecision)) fail('exclusive one-UID E035 v3 consumer scope required');
  for (const refs of [request.approval.evidenceRefs, patch.evidenceRefs])
    if (!Array.isArray(refs) || refs.some(r => !keys(r, ['path','sha256']) || !SHA256.test(r.sha256 || '')) ||
        new Set(refs.map(r => r.path)).size !== refs.length) fail('unique exact evidence references required');
  const transportFile = file(ctx, spec.transportCommit, spec.transportRef.path);
  const transport = document(ctx, {commit: spec.transportCommit, gitBlobSha1: transportFile.gitBlobSha1, ...spec.transportRef});ctx.transport = transport;
  if (!keys(transport, ['schemaVersion','scope',...Object.keys(M2_E035_SCOPE),'nativeReviewRef','nativeItemSha256','frozenRequestRef',
    'productionBeforeSourceRef','preRepairSourceRef','productionCurrentSourceRef','prefigureSourceRef','currentSourceRef',
    'metadataSuffixSha256','metadataSuffixBytes','metadataPatchSha256','fieldDeltaHashes','observationRef','priorNegativeObservationRef','repairClosureRef',
    'studentUiTechnicalRef','studentUiVisualRef','newMathematicalQa',...ZERO]) ||
      transport.schemaVersion !== M2_E035_TRANSPORT_SCHEMA || transport.scope !== TRANSPORT_SCOPE || !scope(transport) || !noApprovals(transport) ||
      !same(transport.nativeReviewRef, {commit: ctx.native.spec.reviewCommit, path: ctx.native.spec.reviewPath,
        gitBlobSha1: file(ctx, ctx.native.spec.reviewCommit, ctx.native.spec.reviewPath).gitBlobSha1, sha256: ctx.native.spec.reviewRef.sha256}) ||
      transport.nativeItemSha256 !== sha(stable(ctx.row))) fail('exact transport and original native authority required');
  reference(ctx, transport.nativeReviewRef);
  const f = transport.frozenRequestRef;
  if (!keys(f, ['commit','gitPath','path','gitBlobSha1','sha256']) ||
      f.gitPath !== '.archive-meta-register/inbox/m2s2-follow6-20261115-E035.json' || !PREFIX.test(f.path || '') ||
      !f.path.endsWith('/frozen-request.json')) fail('separate immutable original request copy required');
  const frozenFile = reference(ctx, {commit: f.commit, path: f.gitPath, gitBlobSha1: f.gitBlobSha1, sha256: f.sha256});ancestor(ctx, f.commit);
  if (!live(ctx, {path: f.path, sha256: f.sha256}).equals(frozenFile.bytes)) fail('frozen request copy changed');
  let frozen;try {frozen = JSON.parse(frozenFile.bytes);}catch {fail('invalid frozen request');}
  const frozenPatch = frozen.items?.[0];
  if (!Array.isArray(frozen.items) || frozen.items.length !== 1 || !frozenPatch ||
      !same(omit(frozen, ['items','approval','expectedSourceBlobSha1']), omit(request, ['items','approval','expectedSourceBlobSha1'])) ||
      !same(omit(frozen.approval, ['evidenceRefs']), omit(request.approval, ['evidenceRefs'])) ||
      !same(omit(frozenPatch, ['after','sourceReview','evidenceRefs']), omit(patch, ['after','sourceReview','evidenceRefs'])) ||
      !same(frozenPatch.sourceReview, omit(patch.sourceReview, ['m2E035RendererContinuity'])) ||
      !same(omit(frozenPatch.after, ['sourceFingerprint','contentFingerprint']), omit(patch.after, ['sourceFingerprint','contentFingerprint'])))
    fail('original request, before, identity or approved after changed');
  for (const [prior, current] of [[frozen.approval.evidenceRefs, request.approval.evidenceRefs], [frozenPatch.evidenceRefs, patch.evidenceRefs]])
    if (!Array.isArray(prior) || prior.some(ref => current.filter(row => same(row, ref)).length !== 1)) fail('original approval reference removed or changed');
  const before = snapshot(ctx, transport.productionBeforeSourceRef), preRepair = snapshot(ctx, transport.preRepairSourceRef),
    production = snapshot(ctx, transport.productionCurrentSourceRef), prefigure = snapshot(ctx, transport.prefigureSourceRef),
    current = snapshot(ctx, transport.currentSourceRef);
  if (f.commit !== prefigure.ref.commit || frozen.expectedSourceBlobSha1 !== prefigure.gitBlobSha1 || request.expectedSourceBlobSha1 !== current.gitBlobSha1 ||
      !same(ctx.question, current.question) || !live(ctx, {path: current.ref.path, sha256: current.sha256}, false).equals(current.bytes) ||
      !prefigure.bytes.subarray(0, before.bytes.length).equals(before.bytes) || prefigure.bytes.length <= before.bytes.length)
    fail('authentic prefigure and live current source bindings required');
  const suffix = prefigure.bytes.subarray(before.bytes.length), metadata = delta(before.question, prefigure.question);
  if (suffix.length !== transport.metadataSuffixBytes || sha(suffix) !== transport.metadataSuffixSha256 ||
      !current.bytes.equals(Buffer.concat([production.bytes, suffix])) ||
      !same(Object.keys(metadata), META) || !same(metadata, delta(production.question, current.question)) ||
      META.some(k => !Object.hasOwn(frozenPatch.after, k) || !metadata[k].after.present || !same(metadata[k].after.value, frozenPatch.after[k])) ||
      transport.metadataPatchSha256 !== sha(stable(metadata)) ||
      !same(ctx.studentPayload(before.question), ctx.studentPayload(prefigure.question)) ||
      !same(ctx.studentPayload(production.question), ctx.studentPayload(current.question)))
    fail('exact frozen metadata suffix and both complete student payload axes required');
  for (let i = 0; i < 21; i++) if (i !== 11 && (!same(before.bank[i], prefigure.bank[i]) || !same(production.bank[i], current.bank[i])))
    fail('unselected current or original question changed');
  if (!same(before.bank.map(q => q.id), production.bank.map(q => q.id))) fail('full source identity order changed');
  const changes = presentation(before.question, production.question), candidateChanges = presentation(prefigure.question, current.question);
  if (!same(changes, candidateChanges) || !same(transport.fieldDeltaHashes, Object.fromEntries(M2_E035_RENDERER_FIELDS.map(k =>
    [k, {before: sha(stable(changes[k].before)), after: sha(stable(changes[k].after))}])))) fail('presentation axes or exact field hashes changed');
  for (const bank of [ctx.native.reviewedBank, ctx.native.committedBank])
    if (!same(ctx.studentPayload(prefigure.question), ctx.studentPayload(bank[11]))) fail('prefigure differs from immutable native student payload');
  const observed = observation(ctx, transport.observationRef, before, production, true);
  for (const role of ['problem','solution']) {
    const a = observed.beforeAssets[role], b = observed.currentAssets[role];
    if (file(ctx, prefigure.ref.commit, a.path).sha256 !== a.sha256 || file(ctx, current.ref.commit, b.path).sha256 !== b.sha256)
      fail('prefigure or candidate asset differs from actual observation');
  }
  const repairProof = repair(ctx, transport.repairClosureRef, before, preRepair, production, observed);
  const ui = studentUi(ctx, transport.studentUiTechnicalRef, transport.studentUiVisualRef, production, observed.currentAssets);
  // Use the complete authentic frozen object, not a synthetic baseline assembled
  // from current fields. A fresh clone prevents mutation of a caller's cache.
  const normalizedPatch = clone(patch);delete normalizedPatch.sourceReview.m2E035RendererContinuity;
  return {normalizedPatch, normalizedQuestion: clone(prefigure.question), proof: {
    ...clone(spec), ...M2_E035_SCOPE, scope: TRANSPORT_SCOPE,
    nativeReviewRef: clone(transport.nativeReviewRef), nativeItemSha256: transport.nativeItemSha256,
    frozenRequestRef: clone(f), productionBeforeSourceRef: clone(before.ref), preRepairSourceRef: clone(preRepair.ref),
    productionCurrentSourceRef: clone(production.ref), prefigureSourceRef: clone(prefigure.ref), currentSourceRef: clone(current.ref),
    nativeStudentPayloadSha256: sha(stable(ctx.studentPayload(prefigure.question))), currentStudentPayloadSha256: sha(stable(ctx.studentPayload(ctx.question))),
    metadataSuffixSha256: sha(suffix), metadataSuffixBytes: suffix.length, metadataPatchSha256: transport.metadataPatchSha256,
    changedFields: [...M2_E035_RENDERER_FIELDS], fieldDeltaHashes: clone(transport.fieldDeltaHashes),
    observationRef: clone(transport.observationRef), repairClosureRef: clone(transport.repairClosureRef), repair: repairProof,
    beforeAssets: clone(observed.beforeAssets), currentAssets: clone(observed.currentAssets), studentUi: ui,
    originalBeforeSha256: sha(stable(frozenPatch.before)), originalIdentityBeforeSha256: sha(stable(frozenPatch.identityBefore)),
    memoryOnlyNormalization: true, sourceWrites: 0, rendererWrites: 0, suppliesMetadataValues: false,
    newMathematicalQa: false, ...Object.fromEntries(ZERO.map(k => [k, 0])),
  }};
}

// Cache immutable obligation inventories only. Every approval, live document,
// source, renderer and canonical value is checked afresh by the ordinary replay.
const inventories = new Map();
function immutableObligations(root) {
  const head = git(root, ['rev-parse','--verify','HEAD^{commit}']).toString().trim(), key = stable([path.resolve(root), head]);
  if (!inventories.has(key)) {
    const ctx = {root, files: new Map()}, seen = new Set(), negativeRefs = new Set();let claimed = false;
    const commits = git(root, ['log','--full-history','--format=%H','--diff-filter=AM',head,'--',
      ':(glob).archive-meta-register/evidence/m2-e035-current-renderer-*/transport.json',
      ':(glob).archive-meta-register/evidence/m2-e035-current-renderer-*/independent*observation.json']).toString().split(/\s+/).filter(Boolean);
    for (const commit of new Set([head, ...commits])) {
      const paths = git(root, ['ls-tree','-rz','--name-only',commit,'--','.archive-meta-register/evidence']).toString().split('\0')
        .filter(p => TRANSPORT_PATH.test(p) || REVIEW_PATH.test(p));
      for (const relative of paths) {
        const f = file(ctx, commit, relative), id = stable([relative, f.sha256]);if (seen.has(id)) continue;seen.add(id);
        let doc;try {doc = JSON.parse(f.bytes);}catch {fail('invalid historical E035 obligation');}
        if (!scope(doc)) continue;
        if (doc.schemaVersion === M2_E035_TRANSPORT_SCHEMA && doc.scope === TRANSPORT_SCOPE) claimed = true;
        if (doc.schemaVersion === M2_E035_REVIEW_SCHEMA && doc.scope === REVIEW_SCOPE && doc.decision === 'HOLD') {
          claimed = true;negativeRefs.add(id);
        }
      }
    }
    if (inventories.size >= 16) inventories.delete(inventories.keys().next().value);
    inventories.set(key, {claimed, negativeRefs});
  }
  return inventories.get(key);
}
export function hasImmutableM2E035RendererClaim({root, current, runtimeRecord}) {
  if (![current, runtimeRecord].some(r => r?.questionUid === M2_E035_SCOPE.questionUid && r.sourceArchiveFile === M2_E035_SCOPE.sourceArchiveFile)) return false;
  try {return immutableObligations(root).claimed;}catch {return true;}
}
