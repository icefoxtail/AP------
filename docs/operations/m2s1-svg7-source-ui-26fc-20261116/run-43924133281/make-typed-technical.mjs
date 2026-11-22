import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const [input, output] = process.argv.slice(2);
if (!input || !output || path.resolve(input) === path.resolve(output)) throw Error('Use distinct raw input and typed output paths');
const insist = (value, code) => { if (!value) throw Error(code); };
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const stable = value => JSON.stringify(value, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(key => [key, x[key]])) : x);
const raw = fs.readFileSync(input);
insist(sha(raw) === '9ba001a967858cd01195424d96fe853361e63645b8ea389566644d394fc2c3c7', 'EXACT_RAW');
const doc = JSON.parse(raw);
insist(doc.status === 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING' && doc.expectedLogicalCases === 14 &&
  doc.completedLogicalCases === 14 && doc.results.length === 14 && doc.screenshotArtifactCount === 16, 'ACTUAL_SUCCESS');
insist(doc.executionOwner === 'GITHUB_ACTIONS_CHROMIUM_EXACT_PR_HEAD' && doc.execution.provider === 'GITHUB_ACTIONS' &&
  doc.execution.headSha === doc.checkoutCommit && doc.execution.runId === '43924133281', 'EXECUTION');
const resources = new Map(doc.studentFontResources.map(row => [row.resourceId, row]));
insist(resources.size === doc.studentFontResources.length, 'RESOURCE_UNIQUE');
const typed = {
  schemaVersion: 'archive-four-slot-existing-vector-display-ui-v1',
  status: doc.status,
  executionOwner: 'GITHUB_ACTIONS_SUPPORTED_CHROME',
  checkoutCommit: doc.checkoutCommit,
  sourceOverlayCount: doc.sourceOverlayCount,
  domWrites: 0,
  cssWrites: 0,
  expectedLogicalCases: 14,
  completedLogicalCases: 14,
  screenshotArtifactCount: 16,
  screenshotArtifacts: doc.screenshotArtifacts,
  results: doc.results.map(row => {
    const fonts = row.technical.fontReadiness;
    const ids = row.technical.fontResourceIds;
    insist(row.status === 'PASS' && row.capture.domWrites === 0 && row.capture.cssWrites === 0 &&
      row.capture.coverage.complete === true && row.capture.visibleChildren >= 3, 'CASE_PASS');
    insist(fonts.status === 'loaded' && fonts.family === 'Nanum Myeongjo' && [400,700,800].every(weight =>
      fonts.weights.some(item => item.weight === weight && item.loadedFaces > 0 && item.allLoaded === true && item.checked === true)) &&
      fonts.problemFontFamilies.every(family => family.includes('Nanum Myeongjo')), 'FONT_READINESS');
    insist(Array.isArray(ids) && new Set(ids).size === ids.length && ids.every(id => resources.has(id)), 'FONT_IDS');
    const selected = ids.map(id => resources.get(id)).sort((a, b) => a.resourceId.localeCompare(b.resourceId, 'en'));
    return {
      questionUid: row.questionUid,
      sourceOrdinal: row.sourceOrdinal,
      surface: row.surface,
      mode: row.mode,
      viewport: row.viewport,
      sourceRef: row.sourceRef,
      assetRefs: row.assetRefs,
      status: row.status,
      fonts: {ready: true, expectedFamilyLoaded: true, responseInventorySha256: sha(stable(selected))},
      capture: row.capture,
      screenshots: row.screenshots
    };
  })
};
const bytes = Buffer.from(JSON.stringify(typed, null, 2) + '\n');
insist(sha(bytes) === '9f2f5d13c903a7c34fb83c4ce7cabad32493b929a20be13b85b45a52cdb0bfdd', 'EXACT_TYPED_OUTPUT');
fs.mkdirSync(path.dirname(output), {recursive: true});
fs.writeFileSync(output, bytes);
console.log(JSON.stringify({rawSha256: sha(raw), typedSha256: sha(bytes), bytes: bytes.length, cases: 14, originalTiles: 16}));
