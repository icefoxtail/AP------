'use strict';
// Technical observations and independently viewed original tiles are separate
// inputs. This verifier never converts a technical PASS into visual acceptance.
const crypto = require('node:crypto');
const svg7Ui = require('./existing-registered-vector-svg7-ui.cjs');
const text3Fragments = require('../m2s1-text3-solution-fragments.cjs');
const stable = v => JSON.stringify(v, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
const sha = v => crypto.createHash('sha256').update(v).digest('hex');
const eq = (a, b) => stable(a) === stable(b);
const own = (o, k) => Object.prototype.hasOwnProperty.call(o || {}, k);
const HEX = /^[a-f0-9]{64}$/;
const UID = /^qid_v1_[a-f0-9]{64}$/;
const DECISION = 'ACCEPT_DISPLAY_CONTINUITY_ONLY';
const TECHNICAL_SCHEMA = 'archive-four-slot-existing-vector-display-ui-v1';
const VISUAL_SCHEMA = 'archive-independent-four-slot-display-ui-review-v1';
const CASES = Object.freeze({
  PROBLEM: [
    {mode:'exam', viewport:{name:'desktop', width:1365, height:1000}},
    {mode:'exam', viewport:{name:'mobile', width:390, height:844}}
  ],
  SOLUTION: [{mode:'sol', viewport:{name:'desktop', width:1440, height:1000}}]
});
// A single, separately reviewed PROBLEM18 capture implementation. Its two
// visible children are the number and complete content; the third direct
// element is independently measured as empty with zero height. This is not
// a generic two-child exception or a solution-capture alternative.
const CLOSED_PROBLEM = Object.freeze({
  manifest: {path:'tests/fixtures/archive-m2s1-current-problem-display-ui.json',gitBlobSha1:'5a78f23961292e13c061b4979feb3c4b54f3426f',sha256:'3b445bd5f807948e56685276d455eb71904385ad837529e13b3267126686d342',bytes:18095},
  helper: {path:'tools/m2s1-problem18-capture.cjs',gitBlobSha1:'058094f355588a021f2c8ac6156f0fe693507b33',sha256:'785ed7749edf170e38db86119704e19e21dcdb39798a2d23889a4925284d6377',bytes:18677},
  roles: {path:'tools/m2s1-problem-capture-diagnostic.cjs',gitBlobSha1:'da3e1e22887df491382167ce17003a6d91aa9f29',sha256:'9951724223fffe462fec790d444a5fb1d04e7a5bf9c4c0d1a2a81ad84f9e2ee9',bytes:14569},
  common: {path:'tools/check-reviewed-problem-renderer-browser.cjs',gitBlobSha1:'dcb4382ada6913f9aa35a820777248ee93879e36',sha256:'94ec31b0e66d1461e7e9757e10af194ac2de47d9b614da4ab191e4615a17dfa4',bytes:50028},
  observedFrameSha256:'16ea5f3c9d164327c5fce653bbdd36dbd84056f2c4d6bd81c518cc2f85781bef'
});
function fail(code) { throw Error('EXISTING_VECTOR_UI_' + code); }
function object(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
function exact(x, keys, code) {
  if (!object(x) || !eq(Object.keys(x).sort(), [...keys].sort())) fail(code + '_KEYS');
}
function integer(x, min = 0) { return Number.isSafeInteger(x) && x >= min; }
function finite(x) { return typeof x === 'number' && Number.isFinite(x); }
function artifact(x) {
  exact(x, ['path','sha256','bytes'], 'ARTIFACT');
  if (typeof x.path !== 'string' || !/^[A-Za-z0-9_./-]+\.png$/.test(x.path) || x.path.startsWith('/') ||
      x.path.split('/').some(p => !p || p === '.' || p === '..') || !HEX.test(x.sha256) || !integer(x.bytes, 1)) fail('ARTIFACT');
  return x;
}
function screenshot(x, visual = false) {
  exact(x, ['tileIndex','path','sha256','bytes', ...(visual ? ['decision'] : [])], 'SCREENSHOT');
  if (!integer(x.tileIndex, 1) || (visual && x.decision !== DECISION)) fail('SCREENSHOT');
  return artifact({path:x.path, sha256:x.sha256, bytes:x.bytes});
}
function caseKey(x) { return `${x.questionUid}:${x.sourceOrdinal}:${x.surface}:${x.viewport?.name}`; }
function rect(x, code) {
  exact(x, ['x','y','width','height'], code);
  if (!Object.values(x).every(finite) || x.x < 0 || x.y < 0 || x.width <= 0 || x.height <= 0) fail(code);
}
function scroll(x) {
  exact(x, ['x','y'], 'SCROLL');
  if (!Object.values(x).every(finite) || x.x < 0 || x.y < 0) fail('SCROLL');
}
function closedProblemRoles(value, row, checkoutCommit, readRef) {
  exact(value, ['schemaVersion','key','questionUid','sourceOrdinal','manifestRef','sourceRef','assetRef','helperRef','roleHelperRef',
    'observedFrameSha256','numberRoleCount','contentRoleCount','targetImageCount','emptyZeroHeightNodeCount','originalSharedHelperUnchanged'], 'CLOSED_PROBLEM_ROLES');
  if (value.schemaVersion !== 'archive-m2s1-problem18-two-direct-roles-v1' || row.surface !== 'PROBLEM' || row.mode !== 'exam' ||
      value.questionUid !== row.questionUid || value.sourceOrdinal !== row.sourceOrdinal ||
      !eq(value.sourceRef,row.sourceRef) || row.assetRefs.length !== 1 || !eq(value.assetRef,row.assetRefs[0]) ||
      value.observedFrameSha256 !== CLOSED_PROBLEM.observedFrameSha256 || value.numberRoleCount !== 1 || value.contentRoleCount !== 1 ||
      value.targetImageCount !== 1 || value.emptyZeroHeightNodeCount !== 1 || value.originalSharedHelperUnchanged !== true) fail('CLOSED_PROBLEM_ROLES');
  const fixedRef = (ref, expected) => {
    if (!eq(ref,{commit:checkoutCommit,...expected})) fail('CLOSED_PROBLEM_REF');
    return readRef(ref);
  };
  const raw = fixedRef(value.manifestRef,CLOSED_PROBLEM.manifest);
  fixedRef(value.helperRef,CLOSED_PROBLEM.helper);
  fixedRef(value.roleHelperRef,CLOSED_PROBLEM.roles);
  // The producer checked this unchanged common helper. Recheck its immutable
  // checkout bytes as well; a boolean marker alone is not sufficient.
  readRef({commit:checkoutCommit,...CLOSED_PROBLEM.common});
  if (!Buffer.isBuffer(raw) || sha(raw) !== CLOSED_PROBLEM.manifest.sha256) fail('CLOSED_PROBLEM_MANIFEST');
  const manifest=JSON.parse(raw);
  if (manifest.schemaVersion !== 'archive-existing-vector-display-manifest-v1' || manifest.scope !== 'EXISTING_DISPLAY_ONLY_NO_NEW_APPROVAL' ||
      manifest.surface !== 'PROBLEM' || manifest.mode !== 'exam' || manifest.expectedCases !== 36 ||
      !Array.isArray(manifest.items) || manifest.items.length !== 18 ||
      !eq(manifest.viewports,CASES.PROBLEM.map(c=>c.viewport)) || !manifest.viewports.some(v=>eq(v,row.viewport))) fail('CLOSED_PROBLEM_MANIFEST');
  const matches=manifest.items.filter(item=>item.questionUid===row.questionUid);
  if (matches.length !== 1) fail('CLOSED_PROBLEM_COHORT');
  const item=matches[0], source=row.sourceRef;
  if (item.key !== value.key || item.sourceOrdinal !== row.sourceOrdinal || item.sourcePath !== source.path ||
      item.sourceGitBlobSha1 !== source.gitBlobSha1 || item.sourceSha256 !== source.sha256 ||
      !Array.isArray(item.assets) || item.assets.length !== 1 ||
      !eq({path:value.assetRef.path,gitBlobSha1:value.assetRef.gitBlobSha1,sha256:value.assetRef.sha256,bytes:value.assetRef.bytes},item.assets[0])) fail('CLOSED_PROBLEM_COHORT');
}
// The reviewed E051-Q15 solution has two original production layout shells.
// Its immutable producer is fixed here, and every physical tile remains bound
// to its shell, document coordinates, source, and independently reviewed PNG.
const TEXT3_FRAGMENT_HELPER = Object.freeze({
  path:'tools/m2s1-text3-solution-fragments.cjs',
  gitBlobSha1:'8ccfc5b09602b3f348b8b842007123cbc7d9ecd1',
  sha256:'b7fbc927ec795bca33fd923c971efee8ec94cd6aeb1a606f6be6ec3760caa4d9',bytes:22828
});
function closedSolutionFragments(c, screenshots, viewport, surface, context) {
  const row=context?.row, checkout=context?.checkoutCommit, readRef=context?.readRef;
  if (surface!=='SOLUTION' || row?.surface!=='SOLUTION' || row?.mode!=='sol' ||
      row?.questionUid!==text3Fragments.UID || row?.sourceOrdinal!==15 ||
      !eq(viewport,{name:'desktop',width:1440,height:1000}) || typeof readRef!=='function' ||
      !eq(c.policy?.sourceRef,row.sourceRef) || row.assetRefs?.length!==1 ||
      !eq(c.policy?.assetRef,row.assetRefs[0]) ||
      !eq(c.policy?.helperRef,{commit:checkout,...TEXT3_FRAGMENT_HELPER})) fail('TEXT3_FRAGMENT_SCOPE');
  text3Fragments.validateCapture(c,{width:viewport.width,height:viewport.height},screenshots);
  for (const ref of [c.policy.sourceRef,c.policy.assetRef,c.policy.manifestRef,c.policy.helperRef]) {
    if (ref.commit!==checkout) fail('TEXT3_FRAGMENT_CHECKOUT');
    const raw=readRef(ref);
    if (!Buffer.isBuffer(raw) || raw.length!==ref.bytes || sha(raw)!==ref.sha256) fail('TEXT3_FRAGMENT_REF');
  }
  const close=(a,b)=>Math.abs(a-b)<=1e-6;
  let previousScroll=null;
  for (const f of c.fragments) {
    rect(f.question,'TEXT3_FRAGMENT_QUESTION'); rect(f.content,'TEXT3_FRAGMENT_CONTENT');
    scroll(f.scrollBefore); scroll(f.scrollAfter);
    if (previousScroll && !eq(f.scrollBefore,previousScroll)) fail('TEXT3_FRAGMENT_SCROLL_CHAIN');
    if (!close(f.content.x,f.question.x) || !close(f.content.width,f.question.width) ||
        f.content.y<f.question.y-1e-6 || f.content.y+f.content.height>f.question.y+f.question.height+1e-6)
      fail('TEXT3_FRAGMENT_CONTENT_GEOMETRY');
    previousScroll=f.scrollBefore;
    for (const t of f.tiles) {
      scroll(t.scroll); rect(t.clip,'TEXT3_FRAGMENT_CLIP');
      if (t.scroll.x!==0 || !integer(t.hitTestSamples,2) ||
          (t.scrollOperations===0 && !eq(t.scroll,previousScroll))) fail('TEXT3_FRAGMENT_SCROLL_CHAIN');
      if (!close(t.clip.x+t.scroll.x,f.content.x) ||
          !close(t.clip.y+t.scroll.y,f.content.y+t.relativeInterval[0]) ||
          !close(t.clip.width,f.content.width) ||
          !close(t.clip.height,t.relativeInterval[1]-t.relativeInterval[0])) fail('TEXT3_FRAGMENT_DOCUMENT_GEOMETRY');
      previousScroll=t.scroll;
    }
    if (!eq(f.scrollAfter,previousScroll)) fail('TEXT3_FRAGMENT_SCROLL_CHAIN');
  }
}
function coverage(c, screenshots, viewport, surface, context) {
  if (c?.schemaVersion===text3Fragments.SCHEMA) return closedSolutionFragments(c,screenshots,viewport,surface,context);
  // Bind the original shared capture object, including its document geometry
  // and 1-based tile indexes. No compact replacement or stitched PNG is used.
  const twoRoles=surface==='PROBLEM' && c?.visibleChildren===2;
  if (twoRoles) {
    if (typeof context?.validateClosedRoles === 'function') context.validateClosedRoles(c.closedProblemRoles,context.row);
    else closedProblemRoles(c.closedProblemRoles,context.row,context.checkoutCommit,context.readRef);
  }
  else if (own(c,'closedProblemRoles')) fail('CLOSED_PROBLEM_SCOPE');
  exact(c, ['schemaVersion','method','tileLimit','overlapCssPixels','tileCount','content','question','viewport',
    'visibleChildren','coverage','tiles','scrollBefore','scrollAfter','scrollOperations','domSha256','feedbackIdle',
    'foreignContentHits','cssWrites','domWrites','viewportChanges','compositeImageCreated',...(twoRoles?['closedProblemRoles']:[])], 'CAPTURE');
  const schema = surface === 'PROBLEM' ? 'archive-problem-scroll-coverage-v1' : 'archive-solution-scroll-coverage-v1';
  if (c.schemaVersion !== schema || c.method !== 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES' || c.tileLimit !== 8 ||
      !integer(c.tileCount, 1) || c.tileCount > 8 || c.overlapCssPixels !== 32 || !(twoRoles || integer(c.visibleChildren, 3)) ||
      !HEX.test(c.domSha256) || !Array.isArray(c.tiles) || c.tiles.length !== c.tileCount || screenshots.length !== c.tileCount ||
      c.feedbackIdle !== true || c.foreignContentHits !== 0 || c.cssWrites !== 0 || c.domWrites !== 0 ||
      c.viewportChanges !== 0 || c.compositeImageCreated !== false || !integer(c.scrollOperations)) fail('CAPTURE');
  exact(c.viewport, ['width','height'], 'CAPTURE_VIEWPORT');
  if (!eq(c.viewport,{width:viewport.width,height:viewport.height})) fail('CAPTURE_VIEWPORT');
  rect(c.content, 'CONTENT'); rect(c.question, 'QUESTION');
  // Only floating-point addition/subtraction is tolerated here; the original
  // capture has already required unchanged geometry, unclipped children and
  // per-tile hit testing before and after each actual screenshot.
  const close = (a,b) => Math.abs(a-b) <= 1e-6;
  if (!close(c.content.x,c.question.x) || !close(c.content.width,c.question.width) ||
      c.content.y < c.question.y - 1e-6 || c.content.y+c.content.height > c.question.y+c.question.height+1e-6) fail('CONTENT_GEOMETRY');
  scroll(c.scrollBefore); scroll(c.scrollAfter);
  const height=c.content.height;
  exact(c.coverage, ['requiredInterval','coveredInterval','complete'], 'COVERAGE');
  if (!eq(c.coverage, {requiredInterval:[0,height],coveredInterval:[0,height],complete:true})) fail('COVERAGE');
  let previousEnd = null, previousScroll=c.scrollBefore, operations=0;
  for (let i = 0; i < c.tileCount; i++) {
    const t = c.tiles[i], s = screenshots[i];
    exact(t, ['tileIndex','relativeInterval','filename','clip','scroll','scrollOperations','feedbackIdle','obstructionsIntersectingClip',
      'hitTestSamples','foreignContentHits','domSha256'], 'TILE');
    if (t.tileIndex !== i + 1 || s.tileIndex !== i + 1 || t.filename !== s.path || t.feedbackIdle !== true ||
        t.obstructionsIntersectingClip !== 0 || t.foreignContentHits !== 0 || !integer(t.hitTestSamples, 2) ||
        !integer(t.scrollOperations) || t.scrollOperations > 3 || t.domSha256 !== c.domSha256) fail('TILE');
    if (!Array.isArray(t.relativeInterval) || t.relativeInterval.length !== 2 || !t.relativeInterval.every(finite)) fail('INTERVAL');
    const [start,end] = t.relativeInterval;
    if (start < 0 || end <= start || end > height ||
        (i === 0 ? start !== 0 : start !== previousEnd - 32) || (i > 0 && end <= previousEnd)) fail('INTERVAL');
    rect(t.clip, 'CLIP');
    scroll(t.scroll);
    if (t.clip.x+t.clip.width > viewport.width || t.clip.y+t.clip.height > viewport.height ||
        !close(t.clip.height,end-start) || !close(t.clip.width,c.content.width) ||
        !close(t.clip.x+t.scroll.x,c.content.x) || !close(t.clip.y+t.scroll.y,c.content.y+start) ||
        (t.scrollOperations === 0 && !eq(t.scroll,previousScroll))) fail('CLIP');
    previousEnd=end; previousScroll=t.scroll; operations+=t.scrollOperations;
  }
  if (previousEnd !== height || !eq(c.scrollAfter,previousScroll) || c.scrollOperations !== operations) fail('INCOMPLETE_COVERAGE');
}
/** readRef returns exact immutable bytes; it may also validate a live source. */
function verifyUi({technical, visual, technicalRef, readRef, readLiveRef, readCurrentFile, questionUid, sourceOrdinal, surface, sourceRef, assetRefs}) {
  if (technical?.schemaVersion === svg7Ui.SCHEMA || technical?.schemaVersion === svg7Ui.CURRENT_SCHEMA) return svg7Ui.verifySvg7Ui({technical,visual,technicalRef,readRef,readLiveRef,readCurrentFile,
    questionUid,sourceOrdinal,surface,sourceRef,assetRefs,
    validateCapture:(capture,shots,viewport,context)=>coverage(capture,shots,viewport,'PROBLEM',context)});
  exact(technical, ['schemaVersion','status','executionOwner','checkoutCommit','sourceOverlayCount','domWrites','cssWrites',
    'expectedLogicalCases','completedLogicalCases','screenshotArtifactCount','screenshotArtifacts','results'], 'TECHNICAL');
  if (technical.schemaVersion !== TECHNICAL_SCHEMA || technical.status !== 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING' ||
      technical.executionOwner !== 'GITHUB_ACTIONS_SUPPORTED_CHROME' || !/^[a-f0-9]{40}$/.test(technical.checkoutCommit) ||
      technical.sourceOverlayCount !== 0 || technical.domWrites !== 0 || technical.cssWrites !== 0 ||
      !integer(technical.expectedLogicalCases, 1) || technical.completedLogicalCases !== technical.expectedLogicalCases ||
      !Array.isArray(technical.results) || technical.results.length !== technical.expectedLogicalCases ||
      !Array.isArray(technical.screenshotArtifacts) || technical.screenshotArtifactCount !== technical.screenshotArtifacts.length) fail('TECHNICAL');
  const allArtifacts = [], keys = new Set(), groups = new Map();
  for (const row of technical.results) {
    exact(row, ['questionUid','sourceOrdinal','surface','mode','viewport','sourceRef','assetRefs','status','fonts','capture','screenshots'], 'RESULT');
    if (!UID.test(row.questionUid) || !integer(row.sourceOrdinal, 1) || !own(CASES, row.surface) || row.status !== 'PASS' ||
        !CASES[row.surface].some(c => eq(row.viewport, c.viewport) && row.mode === c.mode) || !Array.isArray(row.assetRefs) ||
        !row.assetRefs.length || !Array.isArray(row.screenshots)) fail('RESULT');
    const key = caseKey(row);
    if (keys.has(key)) fail('DUPLICATE_CASE');
    keys.add(key);
    const group = `${row.questionUid}:${row.sourceOrdinal}:${row.surface}`;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(row.viewport.name);
    if (row.sourceRef?.commit !== technical.checkoutCommit || row.assetRefs.some(r => r?.commit !== technical.checkoutCommit)) fail('CHECKOUT_BINDING');
    readRef(row.sourceRef);
    const paths = new Set();
    for (const ref of row.assetRefs) { readRef(ref); if (paths.has(ref.path)) fail('DUPLICATE_ASSET'); paths.add(ref.path); }
    exact(row.fonts, ['ready','expectedFamilyLoaded','responseInventorySha256'], 'FONTS');
    if (row.fonts.ready !== true || row.fonts.expectedFamilyLoaded !== true || !HEX.test(row.fonts.responseInventorySha256)) fail('FONTS');
    for (const s of row.screenshots) allArtifacts.push(screenshot(s));
    coverage(row.capture, row.screenshots, row.viewport, row.surface,{row,checkoutCommit:technical.checkoutCommit,readRef});
  }
  for (const [group, names] of groups) {
    const s = group.split(':').at(-1);
    if (!eq(names.slice().sort(), CASES[s].map(c => c.viewport.name).sort())) fail('CASE_INVENTORY');
  }
  const sorted = list => list.slice().sort((a,b) => a.path.localeCompare(b.path, 'en'));
  if (new Set(allArtifacts.map(a => a.path)).size !== allArtifacts.length ||
      !eq(sorted(allArtifacts), sorted(technical.screenshotArtifacts.map(artifact)))) fail('ARTIFACT_INVENTORY');
  exact(visual, ['schemaVersion','reviewer','decision','technicalRef','newMathQa','newSemanticApproval','newFourSlotVector','records'], 'VISUAL');
  if (visual.schemaVersion !== VISUAL_SCHEMA || typeof visual.reviewer !== 'string' || !visual.reviewer.trim() ||
      visual.reviewer.trim() === technical.executionOwner ||
      visual.decision !== DECISION || visual.newMathQa !== 0 || visual.newSemanticApproval !== 0 || visual.newFourSlotVector !== 0 ||
      !eq(visual.technicalRef, technicalRef) || !Array.isArray(visual.records) || visual.records.length !== technical.results.length) fail('VISUAL');
  readRef(visual.technicalRef);
  const visualKeys = new Set();
  for (const row of visual.records) {
    exact(row, ['questionUid','sourceOrdinal','surface','viewport','captureSha256','decision','screenshots'], 'VISUAL_RESULT');
    const key = caseKey(row), t = technical.results.find(r => caseKey(r) === key);
    if (!t || visualKeys.has(key) || row.decision !== DECISION || !eq(row.viewport,t.viewport) ||
        row.captureSha256 !== sha(stable(t.capture)) || !Array.isArray(row.screenshots)) fail('VISUAL_CASE_BINDING');
    visualKeys.add(key);
    const seen = row.screenshots.map(s => { screenshot(s, true); const {decision,...rest}=s; return rest; });
    if (!eq(seen, t.screenshots)) fail('VISUAL_TILE_INVENTORY');
  }
  const selected = technical.results.filter(r => r.questionUid === questionUid && r.sourceOrdinal === sourceOrdinal && r.surface === surface);
  if (!own(CASES, surface) || selected.length !== CASES[surface].length || selected.some(r => !eq(r.sourceRef,sourceRef) || !eq(r.assetRefs,assetRefs))) fail('SELECTED_BINDING');
  return {logicalCases:selected.length, originalTiles:selected.reduce((n,r)=>n+r.screenshots.length,0)};
}
module.exports = {verifyUi, TECHNICAL_SCHEMA, VISUAL_SCHEMA, DECISION, CASES};
