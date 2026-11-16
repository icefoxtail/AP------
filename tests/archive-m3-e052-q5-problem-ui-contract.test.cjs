'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const H = require('../tools/check-reviewed-problem-renderer-browser.cjs');
const C = require('../tools/check-m3-e052-q5-problem-browser.cjs');
const original = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/archive-m3-e052-q5-problem-ui.json')));
const clone = value => structuredClone(value);
const sealed = () => ({ ...clone(original), bindingState: C.SEALED });
const digest = value => H.sha256(H.stable(value));

function diagnosticCase() {
  const commit = 'a'.repeat(40), item = original.items[0], source = original.sourceBindings[0];
  const selected = Object.fromEntries(['key','questionUid','sourceOrdinal','expectedBankCount','imageBinding','problemPayloadSha256',
    'problemFieldsSha256','presentationSha256','choicePresentationSha256','expectedImageWidth','expectedImageHeight'].map(k => [k,item[k]]));
  selected.sourceRef = { commit, path: source.sourcePath, gitBlobSha1: source.gitBlobSha1, sha256: source.sha256, bytes: source.bytes };
  selected.assetRef = { commit, path: item.assetPath, gitBlobSha1: item.assetGitBlobSha1, sha256: item.assetSha256, bytes: item.assetBytes };
  const refs = new Map([selected.sourceRef, selected.assetRef, ...[C.MANIFEST_PATH,C.CHECKER_PATH,C.SHARED_CHECKER_PATH].map(p=>({
    commit,path:p,gitBlobSha1:'b'.repeat(40),sha256:p===C.SHARED_CHECKER_PATH?C.SHARED_CHECKER_SHA256:'c'.repeat(64),bytes:100
  }))].map(ref=>[ref.path,ref]));
  const reader = {commit,ref:p=>clone(refs.get(p))};
  const viewport=clone(C.VIEWPORTS[0]);
  const frame={schemaVersion:'archive-problem-role-frame-v1',mode:'exam',solutionNodes:0,bankCount:25,questionNumber:5,
    sourcePageMatched:true,targetAssetMatched:true,inputUnchanged:true,cssWrites:0,domWrites:0,viewportChanges:0,scrollOperations:0,
    viewport:{width:viewport.width,height:viewport.height},domSha256:'d'.repeat(64),directNodeCount:3,visibleDirectNodeCount:2,
    directNodes:[],mediaNodes:[]};
  return {reader,item:selected,viewport,refs,frame,target:{evaluate:async()=>clone(frame)}};
}
test('Q5 diagnostic leaves a successful original capture unchanged and never probes', async()=>{
  const expected={status:'ORIGINAL_CAPTURE'},diagnostics=[];let probes=0,calls=0;
  const result=await C.captureQ5WithFailureDiagnostic({diagnostics,capture:async()=>{calls++;return expected},diagnose:async()=>{probes++;}});
  assert.equal(result,expected);assert.equal(calls,1);assert.equal(probes,0);assert.deepEqual(diagnostics,[]);
});
test('Q5 diagnostic records the two-role observation without accepting or replacing the original failure', async()=>{
  const x=diagnosticCase(),originalError=new Error('UI_COMPLETE_PROBLEM_CHILDREN'),diagnostics=[];let calls=0;
  await assert.rejects(()=>C.captureQ5WithFailureDiagnostic({...x,diagnostics,capture:async()=>{calls++;throw originalError}}),e=>e===originalError);
  assert.equal(calls,1);assert.equal(diagnostics.length,1);assert.equal(diagnostics[0].captureAccepted,false);
  assert.equal(diagnostics[0].screenshotCreated,false);assert.equal(diagnostics[0].newNativeApprovals,0);
  assert.equal(diagnostics[0].frame.visibleDirectNodeCount,2);assert.equal(diagnostics[0].frameSha256,digest(x.frame));
});
test('Q5 diagnostic does not intercept another capture error', async()=>{
  const originalError=new Error('UI_PROBLEM_FOREIGN_HIT'),diagnostics=[];let probes=0;
  await assert.rejects(()=>C.captureQ5WithFailureDiagnostic({diagnostics,capture:async()=>{throw originalError},diagnose:async()=>{probes++}}),e=>e===originalError);
  assert.equal(probes,0);assert.deepEqual(diagnostics,[]);
});
test('Q5 diagnostic failure keeps the original capture error and exports only an error hash', async()=>{
  const originalError=new Error('UI_COMPLETE_PROBLEM_CHILDREN'),diagnostics=[];
  await assert.rejects(()=>C.captureQ5WithFailureDiagnostic({diagnostics,capture:async()=>{throw originalError},diagnose:async()=>{throw Error('Synthetic private text must not leave')}}),e=>e===originalError);
  assert.equal(diagnostics[0].status,'DIAGNOSTIC_UNAVAILABLE_ORIGINAL_CAPTURE_FAILURE');assert.equal(diagnostics[0].captureAccepted,false);
  assert.equal(JSON.stringify(diagnostics).includes('Synthetic private'),false);assert.match(diagnostics[0].diagnosticErrorSha256,/^[a-f0-9]{64}$/);
});
for(const [name,change]of Object.entries({
  'foreign UID':x=>{x.item.questionUid='qid_v1_'+'f'.repeat(64)},
  'another ordinal':x=>{x.item.sourceOrdinal=6},
  '24 denominator':x=>{x.item.expectedBankCount=24},
  'changed problem hash':x=>{x.item.problemFieldsSha256='0'.repeat(64)},
  'changed choice visibility hash':x=>{x.item.choicePresentationSha256='0'.repeat(64)},
  'unknown permission':x=>{x.item.allowTwoRoles=true},
  'enlarged viewport':x=>{x.viewport.height++},
  'wrong source Git':x=>{x.item.sourceRef.gitBlobSha1='0'.repeat(40)},
  'wrong asset raw':x=>{x.item.assetRef.sha256='0'.repeat(64)},
  'extra ref key':x=>{x.item.assetRef.allowDifferent=true},
  'foreign commit':x=>{x.item.assetRef.commit='0'.repeat(40)}
}))test('Q5 diagnostic rejects '+name+' before evaluating the page',async()=>{
  const x=diagnosticCase();let calls=0;x.target.evaluate=async()=>{calls++;return x.frame};change(x);
  await assert.rejects(()=>C.readQ5RoleDiagnostic(x),/UI_Q5_DIAGNOSTIC_/);assert.equal(calls,0);
});
for(const [name,change]of Object.entries({
  'solution surface':x=>{x.frame.solutionNodes=1},
  'non-exam mode':x=>{x.frame.mode='solution'},
  'DOM mutation':x=>{x.frame.inputUnchanged=false},
  'CSS write':x=>{x.frame.cssWrites=1},
  'viewport change':x=>{x.frame.viewportChanges=1},
  'wrong selected number':x=>{x.frame.questionNumber=6}
}))test('Q5 diagnostic does not record an unsafe frame: '+name,async()=>{
  const x=diagnosticCase();change(x);await assert.rejects(()=>C.readQ5RoleDiagnostic(x),/UI_Q5_DIAGNOSTIC_FRAME/);
});
test('Q5 diagnostic re-reads all evidence after the browser observation',async()=>{
  const x=diagnosticCase();x.target.evaluate=async()=>{x.refs.get(C.CHECKER_PATH).sha256='0'.repeat(64);return x.frame};
  await assert.rejects(()=>C.readQ5RoleDiagnostic(x),/UI_Q5_DIAGNOSTIC_INPUT_CHANGED/);
});

test('closed cohort is exactly Q5, a 25-question bank, original 550 by 330 PNG and two viewports', () => {
  C.validateManifest(original);
  assert.equal(original.items.length, 1);
  const item = original.items[0];
  assert.equal(item.key, 'E052-Q5'); assert.equal(item.sourceOrdinal, 5); assert.equal(item.expectedBankCount, 25);
  assert.equal(item.expectedImageWidth, 550); assert.equal(item.expectedImageHeight, 330);
  assert.equal(item.assetSha256, 'e09a9ffa670e31766c57c4687e88a8d44fb773e0ca265cc4d1ad06e40a79ad6f');
  assert.equal(original.expectedCases, 2);
});
test('an explicit draft cannot perform any source preflight', () => {
  let reads = 0;
  const draft = { ...clone(original), bindingState: C.DRAFT };
  assert.throws(() => C.preflight({ read() { reads++; throw Error('no read'); } }, draft), /UI_Q5_PUBLIC_SOURCE_SEAL_REQUIRED/);
  assert.equal(reads, 0);
});
test('sealed state retains the exact closed item and source hashes', () => C.requireSealedManifest(sealed()));
for (const [name, change] of Object.entries({
  'unknown top-level permission': m => { m.allowFallback = true; },
  'foreign scope': m => { m.scope = 'GENERAL'; },
  'unknown state': m => { m.bindingState = 'READY'; },
  'one case': m => { m.expectedCases = 1; },
  'three cases': m => { m.expectedCases = 3; },
  'enlarged mobile viewport': m => { m.viewports[1].height = 1600; },
  'extra device scaling': m => { m.viewports[0].deviceScaleFactor = 0.5; },
  'no item': m => { m.items.pop(); },
  'second item': m => { m.items.push(clone(m.items[0])); },
  'different UID': m => { m.items[0].questionUid = 'qid_v1_' + 'a'.repeat(64); },
  'different ordinal': m => { m.items[0].sourceOrdinal = 6; },
  'bank count 24': m => { m.items[0].expectedBankCount = 24; },
  'old cropped PNG': m => { m.items[0].assetPath = m.items[0].assetPath.replace('q05-problem-source-v2.png', 'q05.png'); },
  'resealed other PNG': m => { m.items[0].assetSha256 = '0'.repeat(64); },
  'wrong image width': m => { m.items[0].expectedImageWidth = 255; },
  'wrong presentation': m => { m.items[0].presentationSha256 = '0'.repeat(64); },
  'inline profile': m => { m.items[0].imageBinding = 'CONTENT_SINGLE_IMG'; },
  'source missing': m => { m.sourceBindings.pop(); },
  'source duplicate': m => { m.sourceBindings.push(clone(m.sourceBindings[0])); },
  'source traversal': m => { m.sourceBindings[0].sourcePath = '../outside.js'; },
  'source empty seal': m => { m.sourceBindings[0].sha256 = ''; },
  'valid-shaped foreign source seal': m => { m.sourceBindings[0].sha256 = '0'.repeat(64); },
  'foreign source blob': m => { m.sourceBindings[0].gitBlobSha1 = '0'.repeat(40); },
  'foreign source bytes': m => { m.sourceBindings[0].bytes++; },
  'source allowance': m => { m.sourceBindings[0].metadataOnly = true; }
})) test('manifest rejects ' + name, () => { const m = sealed(); change(m); assert.throws(() => C.validateManifest(m)); });
test('checkout must match the explicit event-bound expected revision', () => {
  const c = 'a'.repeat(40), other = 'b'.repeat(40);
  assert.equal(C.checkoutEvidence(c, { ARCHIVE_M3_E052_Q5_UI_EXPECTED_SHA: c, GITHUB_SHA: other }).githubEventCommit, other);
  for (const env of [{}, { ARCHIVE_M3_E052_Q5_UI_EXPECTED_SHA: null }, { ARCHIVE_M3_E052_Q5_UI_EXPECTED_SHA: other },
    { ARCHIVE_M3_E052_Q5_UI_EXPECTED_SHA: c, GITHUB_SHA: 'bad' }]) assert.throws(() => C.checkoutEvidence(c, env));
});
test('engine and screen adapter exact Git/raw/bytes form a separate surface inventory', () => {
  const ref = file => ({ commit: 'a'.repeat(40), ...C.EXPECTED_SURFACE_REFS.find(row => row.path === file) });
  assert.equal(C.checkedSurface({ read: () => Buffer.from('synthetic'), ref }).length, 2);
  for (const field of ['path', 'gitBlobSha1', 'sha256', 'bytes']) assert.throws(() => C.checkedSurface({
    read: () => Buffer.from('synthetic'), ref: file => ({ ...ref(file), [field]: field === 'bytes' ? 1 : 'changed' })
  }), /UI_Q5_EXACT_CURRENT_SURFACE/);
});
const simple = () => ({ id: 5, content: 'Synthetic problem only.', choices: ['A', 'B', 'C', 'D', 'E'], image: 'assets/images/synthetic/q5.png' });
const bind = q => ({ key: 'SYNTHETIC', sourceOrdinal: 5, imageBinding: 'QUESTION_IMAGE', assetPath: 'archive/' + q.image,
  problemPayloadSha256: digest({ content: q.content ?? q.question, choices: q.choices ?? [] }),
  problemFieldsSha256: digest(C.ownSnapshot(q, ['content', 'question', 'choices'])),
  presentationSha256: digest(C.ownSnapshot(q, ['image', 'imageAlt', 'imageSize', 'layoutTag'])),
  choicePresentationSha256: digest(C.ownSnapshot(q, ['choicesEmbeddedInImage'])) });
test('exact question presentation and visible choices bind without reading answer fields', () => { const q = simple(); C.assertBoundQuestion(bind(q), q); });
for (const [name, change] of Object.entries({
  'given text': q => { q.content += ' changed'; },
  'choice order': q => { q.choices.reverse(); },
  'source ordinal': q => { q.id = 6; },
  'absent versus null question alias': q => { q.question = null; },
  'absent versus null alt': q => { q.imageAlt = null; },
  'absent versus null image size': q => { q.imageSize = null; },
  'image URI': q => { q.image = 'assets/images/foreign.png'; },
  'layout': q => { q.layoutTag = 'changed'; },
  'choice presentation flag': q => { q.choicesEmbeddedInImage = false; }
})) test('bound problem rejects changed ' + name, () => { const q = simple(), item = bind(q); change(q); assert.throws(() => C.assertBoundQuestion(item, q)); });
for (const [name, change] of Object.entries({
  'extra inline image': q => { q.content += '<img src="elsewhere.png">'; },
  'unquoted inline image': q => { q.content += '<img src=elsewhere.png>'; },
  'embedded choices': q => { q.choicesEmbeddedInImage = true; },
  'four choices': q => { q.choices.pop(); },
  'no choices': q => { delete q.choices; }
})) test('even resealed synthetic presentation rejects ' + name, () => { const q = simple(); change(q); assert.throws(() => C.assertBoundQuestion(bind(q), q)); });
test('VM executes the full bank suffix and returns ordinary JSON', () => {
  const data = C.loadQuestions(Buffer.from('window.questionBank=[{id:1}];window.questionBank[0].tag="suffix";'));
  assert.deepEqual(data, [{ id: 1, tag: 'suffix' }]);
});
for (const [name, script] of Object.entries({
  'host window constructor': 'window.questionBank=window.constructor.constructor("return process")();',
  'host console constructor': 'window.questionBank=console.log.constructor("return process")();',
  'dynamic Function': 'window.questionBank=Function("return []")();',
  'non-array bank': 'window.questionBank={};',
  'getter': 'window.questionBank=[{get id(){return 1;}}];',
  'prototype': 'window.questionBank=[Object.create({id:1})];',
  'cycle': 'window.questionBank=[];window.questionBank.push(window.questionBank);',
  'sparse array': 'window.questionBank=new Array(2);',
  'non-JSON number': 'window.questionBank=[{id:NaN}];'
})) test('VM rejects ' + name, () => assert.throws(() => C.loadQuestions(Buffer.from(script))));
function cases() {
  const m = sealed(), item = m.items[0], ref = { commit: 'a'.repeat(40), path: item.sourcePath, gitBlobSha1: 'b'.repeat(40), sha256: 'c'.repeat(64), bytes: 100 };
  const input = { ...item, sourceRef: ref, assetRef: { ...ref, path: item.assetPath, gitBlobSha1: item.assetGitBlobSha1, sha256: item.assetSha256, bytes: item.assetBytes } };
  const results = m.viewports.map(viewport => {
    const filename = `${item.key}-${viewport.name}-tile-01.png`, dom = 'd'.repeat(64);
    const tile = { tileIndex: 1, relativeInterval: [0, 100], filename, clip: { x: 28, y: 60, width: 300, height: 100 }, scroll: { x: 0, y: 0 }, scrollOperations: 1,
      feedbackIdle: true, obstructionsIntersectingClip: 0, hitTestSamples: 100, foreignContentHits: 0, domSha256: dom };
    return { status: 'PASS', key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport, sourceRef: input.sourceRef, assetRef: input.assetRef,
      screenshots: [{ tileIndex: 1, path: filename, sha256: H.sha256(filename), bytes: 16 }],
      technical: { mode: 'exam', questions: 25, pages: 1, readiness: 'RENDER_READY', imagesComplete: true, mathErrors: 0, unrenderedMath: 0, mathJaxSource: 'local', solutionNodes: 0,
        fontReadiness: { status: 'loaded', family: 'Nanum Myeongjo', weights: [400, 700, 800].map(weight => ({ weight, loadedFaces: 1, allLoaded: true, checked: true })), problemFontFamilies: ['"Nanum Myeongjo", serif'] } },
      geometry: { naturalWidth: 550, naturalHeight: 330, image: { width: 300 }, imageInsideQuestion: true },
      capture: { schemaVersion: H.TILE_SCHEMA, method: 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES', tileLimit: 8, overlapCssPixels: 32, tileCount: 1, content: { height: 100 },
        coverage: { requiredInterval: [0, 100], coveredInterval: [0, 100], complete: true }, tiles: [tile], feedbackIdle: true, foreignContentHits: 0,
        cssWrites: 0, domWrites: 0, viewportChanges: 0, compositeImageCreated: false, domSha256: dom }, visualReview: 'PENDING', pageErrors: [], requestFailures: [], externalRequests: [] };
  });
  const artifacts = results.flatMap(row => row.screenshots.map(({ path, sha256, bytes }) => ({ path, sha256, bytes }))).sort((a, b) => a.path.localeCompare(b.path));
  return { m, inputs: { items: [input] }, results, artifacts };
}
test('two logical cases require the exact raw screenshot inventory', () => { const f = cases(); assert.equal(C.assertCompletedResults(f.results, f.inputs, f.m, f.artifacts), 2); });
test('three original tiles can cover two logical cases with exact 32 px overlap', () => {
  const f = cases(), row = f.results[0], first = row.capture.tiles[0];
  row.capture.content.height = 168; row.capture.tileCount = 2;
  const second = { ...clone(first), tileIndex: 2, relativeInterval: [68, 168], filename: first.filename.replace('01.png', '02.png') };
  row.capture.tiles.push(second); row.capture.coverage = H.assertTileCoverage(168, row.capture.tiles);
  const shot = { tileIndex: 2, path: second.filename, sha256: H.sha256(second.filename), bytes: 20 };
  row.screenshots.push(shot); f.artifacts.push({ path: shot.path, sha256: shot.sha256, bytes: shot.bytes });
  assert.equal(C.assertCompletedResults(f.results, f.inputs, f.m, f.artifacts), 3);
});
for (const [name, change] of Object.entries({
  'missing case': f => { f.results.pop(); },
  'duplicate case': f => { f.results[1] = clone(f.results[0]); },
  'wrong viewport': f => { f.results[0].viewport.width--; },
  'wrong UID': f => { f.results[0].questionUid = 'qid_v1_' + '0'.repeat(64); },
  'source drift': f => { f.results[0].sourceRef = { ...f.results[0].sourceRef, sha256: '0'.repeat(64) }; },
  'asset drift': f => { f.results[0].assetRef = { ...f.results[0].assetRef, sha256: '0'.repeat(64) }; },
  'bank denominator': f => { f.results[0].technical.questions--; },
  'solution node': f => { f.results[0].technical.solutionNodes = 1; },
  'unrendered math': f => { f.results[0].technical.unrenderedMath = 1; },
  'font not loaded': f => { f.results[0].technical.fontReadiness.status = 'loading'; },
  'font missing weight': f => { f.results[0].technical.fontReadiness.weights.pop(); },
  'fallback font': f => { f.results[0].technical.fontReadiness.problemFontFamilies = ['serif']; },
  'CSS write': f => { f.results[0].capture.cssWrites = 1; },
  'DOM write': f => { f.results[0].capture.domWrites = 1; },
  'viewport write': f => { f.results[0].capture.viewportChanges = 1; },
  'composite screenshot': f => { f.results[0].capture.compositeImageCreated = true; },
  'foreign content hit': f => { f.results[0].capture.tiles[0].foreignContentHits = 1; },
  'toolbar overlap': f => { f.results[0].capture.tiles[0].obstructionsIntersectingClip = 1; },
  'missing hit tests': f => { f.results[0].capture.tiles[0].hitTestSamples = 0; },
  'changed DOM': f => { f.results[0].capture.tiles[0].domSha256 = '0'.repeat(64); },
  'incomplete coverage': f => { f.results[0].capture.tiles[0].relativeInterval[1] = 99; },
  'clipped image': f => { f.results[0].geometry.imageInsideQuestion = false; },
  'cropped original width': f => { f.results[0].geometry.naturalWidth = 255; },
  'cropped original height': f => { f.results[0].geometry.naturalHeight = 170; },
  'network error': f => { f.results[0].requestFailures = [{ urlSha256: '0'.repeat(64) }]; },
  'missing original PNG': f => { f.artifacts.pop(); },
  'extra unreviewed PNG': f => { f.artifacts.push({ path: 'foreign.png', sha256: '0'.repeat(64), bytes: 1 }); },
  'PNG hash drift': f => { f.artifacts[0].sha256 = '0'.repeat(64); },
  'old single screenshot alias': f => { f.results[0].screenshot = f.results[0].screenshots[0]; delete f.results[0].screenshots; }
})) test('technical completion rejects ' + name, () => { const f = cases(); change(f); assert.throws(() => C.assertCompletedResults(f.results, f.inputs, f.m, f.artifacts)); });
test('capture output must be empty, outside checkout and without symlink ancestors', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'q5-ui-contract-'));
  try {
    const root = path.join(base, 'checkout'); fs.mkdirSync(root);
    assert.equal(C.checkedOutput(root, path.join(base, 'out')), path.join(base, 'out'));
    assert.throws(() => C.checkedOutput(root, root)); assert.throws(() => C.checkedOutput(root, path.join(root, 'out')));
    fs.mkdirSync(path.join(base, 'used')); fs.writeFileSync(path.join(base, 'used/prior.json'), '{}');
    assert.throws(() => C.checkedOutput(root, path.join(base, 'used')));
    fs.symlinkSync(path.join(base, 'used'), path.join(base, 'alias'));
    assert.throws(() => C.checkedOutput(root, path.join(base, 'alias/child')));
  } finally { fs.rmSync(base, { recursive: true, force: true }); }
});
