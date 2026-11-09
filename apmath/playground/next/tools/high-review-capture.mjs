// Complete review frames are an evidence gate, not an automated visual verdict.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { sha256 } from './high-evidence-binding.mjs';

export const REVIEW_LABS = Object.freeze(['common-circle-eq', 'common-functions', 'common-rational', 'common-irrational', 'alg-sequence', 'alg-sine-cosine-law']);
export const REVIEW_RUNS = Object.freeze(['pc-paper', 'pc-board', 'mobile-paper', 'mobile-board']);
const primaryStates = ['problem-hidden', 'answer-revealed'];
const keyOf = e => `${e.lab}:${e.id}:${e.run}:${e.state}`;

export function requiredReviewStates(labId, run) {
  if (!REVIEW_LABS.includes(labId) || !REVIEW_RUNS.includes(run)) return [];
  const states = [...primaryStates];
  if (labId.startsWith('alg-')) states.push('initial-explore', 'review-final');
  else if (run.endsWith('-paper')) states.push('review-final');
  return states;
}

export function createReviewManifest({ labs, provenance, sourceBindings }) {
  return {
    schema: 1, kind: 'HIGH_REVIEW_CAPTURE_MANIFEST', provenance,
    quality: 'AWAITING_INDEPENDENT_VISUAL_REVIEW',
    physicalDevices: 'NOT_RUN',
    scope: labs.map(l => ({ id: l.id, file: l.next, catalogSceneTotal: l.sceneTotal, scenes: [] })),
    runs: REVIEW_RUNS,
    sourceBindings: sourceBindings.filter(b => labs.some(l => l.id === b.lab)),
    entries: [], coverageDebt: [], notApplicable: [], targetLimitations: [],
    limitations: ['PNG coverage is not a mathematical or visual quality pass.', 'State-fixture render captures do not prove native interaction.', 'External font URLs are listed in source bindings but their response bytes are not bound.']
  };
}

export function recordReviewScenes(manifest, labId, scenes) {
  const entry = manifest.scope.find(l => l.id === labId);
  if (entry) entry.scenes = scenes.map(s => ({ id: s.id, index: s.index, title: s.title }));
}

function pngMetadata(file) {
  const data = fs.readFileSync(file);
  if (data.length < 33 || !data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) || data.toString('ascii', 12, 16) !== 'IHDR') throw Error(`Not a PNG: ${file}`);
  return { sha256: sha256(data), bytes: data.length, width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

function safeFile(out, file) {
  const resolved = path.resolve(out, file);
  if (!resolved.startsWith(path.resolve(out) + path.sep)) throw Error('Capture path leaves evidence directory');
  return resolved;
}

export function recordReviewCapture(manifest, out, entry) {
  if (manifest.entries.some(e => keyOf(e) === keyOf(entry))) throw Error(`Duplicate review frame: ${keyOf(entry)}`);
  const source = manifest.sourceBindings.find(b => b.lab === entry.lab);
  if (!source) throw Error(`Missing capture source binding: ${entry.lab}`);
  manifest.entries.push({
    ...entry,
    category: entry.state.startsWith('target-') ? 'targeted-transition' : primaryStates.includes(entry.state) ? 'problem-disclosure' : entry.state === 'initial-explore' ? 'algebra-initial-explore' : 'final-review',
    candidateHeadSha: manifest.provenance.candidateHeadSha,
    testedCheckoutSha: manifest.provenance.testedCheckoutSha,
    htmlSha256: source.htmlSha256, sourceSetSha256: source.sourceSetSha256,
    png: pngMetadata(safeFile(out, entry.file))
  });
}

export function validateReviewManifest(manifest, { out, report, verifyFiles = true } = {}) {
  const errors = [], missing = [];
  const counts = { scenes: 0, expectedScenes: 0, problemDisclosure: 0, algebraInitialExplore: 0, finalReview: 0, required: 0, capturedRequired: 0, targetedTransitions: 0, pngFiles: new Set(manifest.entries.map(e => e.file)).size };
  const expected = new Set(), actual = new Set();
  const provenance = manifest.provenance || {};
  if (provenance.sourceRole !== 'CANDIDATE' || ['sourceCommit', 'candidateHeadSha', 'testedCheckoutSha'].some(k => !/^[a-f0-9]{40}$/.test(provenance[k] || ''))) errors.push('invalid-candidate-provenance');
  if (report && (!['CANDIDATE_CHECK', 'PUBLIC_READ_ONLY_CHECK'].includes(report.mode) || report.commit !== provenance.sourceCommit || ['sourceCommit', 'candidateHeadSha', 'testedCheckoutSha'].some(k => report.provenance?.[k] !== provenance[k]))) errors.push('report-provenance-mismatch');
  if (!manifest.scope.length) errors.push('empty-capture-scope');
  for (const lab of manifest.scope) {
    const ids = lab.scenes.map(s => s.id);
    if (!Number.isInteger(lab.catalogSceneTotal) || lab.catalogSceneTotal <= 0 || ids.length !== lab.catalogSceneTotal || new Set(ids).size !== ids.length) errors.push(`scene-census-mismatch:${lab.id}`);
    const source = manifest.sourceBindings.find(b => b.lab === lab.id);
    if (!source?.candidateHeadSourceVerified || source.errors?.length) errors.push(`unverified-candidate-source:${lab.id}`);
    if (report) {
      const observed = report.labs?.find(l => l.id === lab.id);
      if (!observed || JSON.stringify(observed.scenes.map(s => s.id)) !== JSON.stringify(ids)) errors.push(`report-census-mismatch:${lab.id}`);
      const reportSource = report.sourceBindings?.find(b => b.lab === lab.id);
      if (!reportSource || reportSource.htmlSha256 !== source?.htmlSha256 || reportSource.sourceSetSha256 !== source?.sourceSetSha256) errors.push(`report-source-mismatch:${lab.id}`);
    }
    counts.scenes += ids.length;
    counts.expectedScenes += Number.isInteger(lab.catalogSceneTotal) ? lab.catalogSceneTotal : 0;
    for (const run of REVIEW_RUNS) for (const state of requiredReviewStates(lab.id, run)) {
      const count = Number.isInteger(lab.catalogSceneTotal) ? lab.catalogSceneTotal : 0;
      counts.required += count;
      if (primaryStates.includes(state)) counts.problemDisclosure += count;
      else if (state === 'initial-explore') counts.algebraInitialExplore += count;
      else counts.finalReview += count;
    }
    for (const id of ids) for (const run of REVIEW_RUNS) for (const state of requiredReviewStates(lab.id, run)) {
      const key = keyOf({ lab: lab.id, id, run, state }); expected.add(key);
      if (!manifest.entries.some(e => keyOf(e) === key)) missing.push(key);
    }
  }
  for (const entry of manifest.entries) {
    const key = keyOf(entry), source = manifest.sourceBindings.find(b => b.lab === entry.lab);
    if (actual.has(key)) errors.push(`duplicate-frame:${key}`);
    actual.add(key);
    if (!expected.has(key) && !entry.state.startsWith('target-')) errors.push(`unexpected-frame:${key}`);
    if (expected.has(key)) counts.capturedRequired++;
    if (entry.state.startsWith('target-')) counts.targetedTransitions++;
    if (!source || entry.sourceSetSha256 !== source.sourceSetSha256 || entry.htmlSha256 !== source.htmlSha256 || entry.candidateHeadSha !== manifest.provenance.candidateHeadSha || entry.testedCheckoutSha !== manifest.provenance.testedCheckoutSha) errors.push(`frame-source-mismatch:${key}`);
    if (report && !report.labs?.find(l => l.id === entry.lab)?.observations.some(o => o.id === entry.id && o.run === entry.run && o.state === entry.state)) errors.push(`missing-captured-state-observation:${key}`);
    if (expected.has(key)) {
      const frame = entry.frame;
      if (!frame || !/^[a-f0-9]{64}$/.test(frame.questionSha256 || '')) errors.push(`missing-frame-state:${key}`);
      else {
        const isMobile = entry.run.startsWith('mobile-');
        if (frame.viewport?.width !== (isMobile ? 390 : 1440) || frame.viewport?.height !== (isMobile ? 844 : 900)) errors.push(`frame-viewport-mismatch:${key}`);
        if (entry.png?.width !== frame.viewport?.width || entry.png?.height < frame.viewport?.height) errors.push(`png-viewport-mismatch:${key}`);
        if (!(frame.canvas?.width > 0 && frame.canvas?.height > 0) || frame.fonts !== 'loaded') errors.push(`frame-not-ready:${key}`);
        if (primaryStates.includes(entry.state) && !frame.questionPresent) errors.push(`empty-question-frame:${key}`);
        if (entry.state === 'problem-hidden' && (frame.tab !== 'problem' || frame.step !== 0 || frame.revealed || frame.answerOpen)) errors.push(`incorrect-hidden-frame:${key}`);
        if (entry.state === 'answer-revealed' && (frame.tab !== 'problem' || !frame.answerOpen || !frame.answerPresent)) errors.push(`incorrect-revealed-frame:${key}`);
        if (entry.state === 'initial-explore' && (frame.tab !== 'explore' || frame.step !== 0 || frame.revealed || frame.answerOpen)) errors.push(`incorrect-initial-explore-frame:${key}`);
        if (entry.state === 'review-final' && (frame.tab !== 'review' || !Number.isInteger(frame.steps) || frame.step !== frame.steps)) errors.push(`incorrect-final-review-frame:${key}`);
        if (entry.state === 'answer-revealed') {
          const hidden = manifest.entries.find(e => e.lab === entry.lab && e.id === entry.id && e.run === entry.run && e.state === 'problem-hidden');
          if (hidden?.frame?.questionSha256 !== frame.questionSha256) errors.push(`disclosure-question-changed:${key}`);
        }
      }
    }
    if (verifyFiles && out) {
      try { if (JSON.stringify(pngMetadata(safeFile(out, entry.file))) !== JSON.stringify(entry.png)) errors.push(`png-byte-mismatch:${key}`); }
      catch (e) { errors.push(`png-unreadable:${key}:${e.message}`); }
    }
  }
  if (manifest.coverageDebt.length) errors.push(`targeted-coverage-debt:${manifest.coverageDebt.length}`);
  return { complete: !errors.length && !missing.length, counts, missing, errors };
}

export function saveReviewManifest(manifest, out, report, { final = false } = {}) {
  manifest.coverage = validateReviewManifest(manifest, { out, report, verifyFiles: final });
  fs.writeFileSync(path.join(out, 'review-capture-manifest.json'), JSON.stringify(manifest, null, 2));
  return manifest.coverage;
}

function manifestFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(e => e.isDirectory() ? manifestFiles(path.join(directory, e.name)) : e.name === 'review-capture-manifest.json' ? [path.join(directory, e.name)] : []);
}

export function aggregateReviewCaptures(directory, expectedLabs) {
  const sources = manifestFiles(directory), manifests = [], errors = [], seen = new Set();
  for (const file of sources) {
    const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
    const report = JSON.parse(fs.readFileSync(path.join(path.dirname(file), 'results.json'), 'utf8'));
    const coverage = validateReviewManifest(manifest, { out: path.dirname(file), report });
    if (!coverage.complete) errors.push({ file: path.relative(directory, file), coverage });
    for (const lab of manifest.scope) {
      if (seen.has(lab.id)) errors.push({ reason: 'duplicate-lab-manifest', lab: lab.id });
      seen.add(lab.id);
    }
    manifests.push({ file: path.relative(directory, file), manifestSha256: sha256(fs.readFileSync(file)), ...manifest, coverage });
  }
  for (const lab of expectedLabs) if (!seen.has(lab)) errors.push({ reason: 'missing-lab-manifest', lab });
  for (const lab of seen) if (!expectedLabs.includes(lab)) errors.push({ reason: 'unexpected-lab-manifest', lab });
  for (const field of ['candidateHeadSha', 'testedCheckoutSha']) if (new Set(manifests.map(m => m.provenance[field])).size !== 1) errors.push({ reason: 'mixed-source-provenance', field });
  const counts = manifests.reduce((sum, m) => { for (const [key, value] of Object.entries(m.coverage.counts)) sum[key] = (sum[key] || 0) + value; return sum; }, {});
  return { schema: 1, kind: 'HIGH_REVIEW_CAPTURE_AGGREGATE', complete: !errors.length, quality: 'AWAITING_INDEPENDENT_VISUAL_REVIEW', physicalDevices: 'NOT_RUN', expectedLabs, counts, errors, manifests };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const arg = name => process.argv[process.argv.indexOf(name) + 1];
  if (!process.argv.includes('--artifacts') || !process.argv.includes('--out') || !process.argv.includes('--expected-labs')) throw Error('Usage: high-review-capture.mjs --artifacts DIR --out OUTPUT --expected-labs IDS');
  const result = aggregateReviewCaptures(path.resolve(arg('--artifacts')), arg('--expected-labs').split(',').filter(Boolean));
  fs.writeFileSync(arg('--out'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ complete: result.complete, counts: result.counts, errors: result.errors.length, quality: result.quality }));
  process.exitCode = result.complete ? 0 : 1;
}
