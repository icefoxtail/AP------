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
      capture: { equalSlotEvidence: [input.sourceRef, input.assetRef, ...[C.MANIFEST_PATH, C.CHECKER_PATH, C.SHARED_CHECKER_PATH].map(p=>({ ...ref,path:p,sha256:p===C.SHARED_CHECKER_PATH?C.SHARED_CHECKER_SHA256:ref.sha256 })), ...C.Q5_EQUAL_SLOT_SURFACE.map(r=>({commit:ref.commit,...r}))], equalSlotRoles: clone(C.Q5_EQUAL_SLOT_ROLES), visibleChildren: 1, visibleRoleDescendants: 4, measuredEnvelopeRects: 5, schemaVersion: H.TILE_SCHEMA, method: 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES', tileLimit: 8, overlapCssPixels: 32, tileCount: 1, content: { height: 100 },
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
  'missing equal-slot proof': f => { delete f.results[0].capture.equalSlotRoles; },
  'missing equal-slot surface refs': f => { f.results[0].capture.equalSlotEvidence.pop(); },
  'mutated equal-slot code': f => { f.results[0].capture.equalSlotEvidence[5].sha256 = '0'.repeat(64); },
  'wrong direct count': f => { f.results[0].capture.visibleChildren = 5; },
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

function equalSlotCase() {
  const x = diagnosticCase();
  for (const ref of C.Q5_EQUAL_SLOT_SURFACE) x.refs.set(ref.path, { commit: x.reader.commit, ...ref });
  const r = (x,y,width,height) => ({x,y,width,height});
  x.frame = { question:r(20,150,300,500), children:[r(20,160,300,300),r(20,160,300,20),r(20,185,300,50),r(20,240,300,180),r(20,425,300,35)],
    image:r(25,240,290,174), viewport:{width:1365,height:1000}, scroll:{x:0,y:0}, obstructions:[r(0,0,1365,116)],
    feedbackIdle:true,readiness:'RENDER_READY',solutionNodes:0,questionNumber:'5.',mandatoryChildrenVisible:true,
    domSha256:'d'.repeat(64),equalSlotRoles:clone(C.Q5_EQUAL_SLOT_ROLES) };
  x.target = { evaluate:async(fn)=>fn.name==='inspectQ5CaptureHits'?{samples:10,outsideQuestion:0}:clone(x.frame) };
  x.shots=[];x.page={waitForFunction:async()=>{},evaluate:async(fn,arg)=>{if(typeof arg==='number'){
    x.frame.scroll.y+=arg;for(const rect of [x.frame.question,x.frame.image,...x.frame.children])rect.y-=arg;
  }},screenshot:async options=>{x.shots.push(options)}};
  x.filename='/tmp/q5-equal-slot-synthetic.png';
  return x;
}
test('original shared helper still rejects the actual one-wrapper structure',()=>{
  const x=equalSlotCase();x.frame.children=[x.frame.children[0]];
  assert.throws(()=>H.problemContentClip(x.frame),/UI_COMPLETE_PROBLEM_CHILDREN/);
});
test('closed Q5 actual wrapper and four measured descendants preserve the complete wrapper envelope',async()=>{
  const x=equalSlotCase(),out=await C.captureQ5EqualSlotProblem(x);
  assert.equal(out.visibleChildren,1);assert.equal(out.visibleRoleDescendants,4);assert.equal(out.measuredEnvelopeRects,5);
  assert.equal(out.content.y,158);assert.equal(out.content.height,304);assert.equal(out.equalSlotEvidence.length,7);
  assert.equal(out.tileCount,1);assert.equal(x.shots.length,1);assert.equal(out.foreignContentHits,0);
  assert.equal(out.cssWrites,0);assert.equal(out.domWrites,0);assert.equal(out.viewportChanges,0);
});
test('closed Q5 tall content uses original scroll tiles with exact 32 pixel overlap',async()=>{
  const x=equalSlotCase();x.frame.question.height=2000;x.frame.children[0].height=1800;
  const out=await C.captureQ5EqualSlotProblem(x);assert(out.tileCount>1);assert.equal(out.tileCount,x.shots.length);
  assert.deepEqual(out.coverage,H.assertTileCoverage(out.content.height,out.tiles));
  for(let i=1;i<out.tiles.length;i++)assert.equal(out.tiles[i-1].relativeInterval[1]-out.tiles[i].relativeInterval[0],32);
});
for(const[name,change]of Object.entries({
  'unknown wrapper':x=>{x.frame.equalSlotRoles.wrapperClass='other'},
  'missing number':x=>{x.frame.equalSlotRoles.roleOrder.shift()},
  'wrong number':x=>{x.frame.questionNumber='6.'},
  'missing content':x=>{x.frame.equalSlotRoles.roleDescendants=3},
  'hidden choice':x=>{x.frame.equalSlotRoles.hiddenRoles=1},
  'four choices':x=>{x.frame.equalSlotRoles.choiceItems=4},
  'extra choice':x=>{x.frame.equalSlotRoles.choiceItems=6},
  'foreign image':x=>{x.frame.equalSlotRoles.targetImages=2},
  'foreign media':x=>{x.frame.equalSlotRoles.foreignMedia=1},
  'unsafe direct node':x=>{x.frame.equalSlotRoles.unknownDirectNodes=1},
  'omitted wrapper envelope':x=>{x.frame.equalSlotRoles.completeWrapperEnvelope=false},
  'role outside wrapper':x=>{x.frame.children[4].y=500},
  'role outside question':x=>{x.frame.children[0].x=-5},
  'solution node':x=>{x.frame.solutionNodes=1},
  'not ready':x=>{x.frame.readiness='PENDING'},
  'viewport changed':x=>{x.frame.viewport.height=1200},
  'altered equal-slot code':x=>{x.refs.get(C.Q5_EQUAL_SLOT_SURFACE[0].path).sha256='0'.repeat(64)},
  'different source':x=>{x.item.sourceRef.gitBlobSha1='0'.repeat(40)},
  'foreign UID':x=>{x.item.questionUid='qid_v1_'+'0'.repeat(64)}
}))test('closed Q5 rejects '+name+' before original PNG capture',async()=>{
  const x=equalSlotCase();change(x);await assert.rejects(()=>C.captureQ5EqualSlotProblem(x));assert.equal(x.shots.length,0);
});
test('closed Q5 rejects foreign hit content before screenshot',async()=>{
  const x=equalSlotCase();x.target.evaluate=async(fn)=>fn.name==='inspectQ5CaptureHits'?{samples:10,outsideQuestion:1}:clone(x.frame);
  await assert.rejects(()=>C.captureQ5EqualSlotProblem(x),/UI_CAPTURE_FOREIGN_CONTENT/);assert.equal(x.shots.length,0);
});
test('closed Q5 retains DOM and geometry comparisons after screenshot',async()=>{
  const x=equalSlotCase();x.page.screenshot=async()=>{x.frame.domSha256='e'.repeat(64)};
  await assert.rejects(()=>C.captureQ5EqualSlotProblem(x),/UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE/);
});
test('closed Q5 rereads production wrapper code after original capture',async()=>{
  const x=equalSlotCase();x.page.screenshot=async()=>{x.refs.get(C.Q5_EQUAL_SLOT_SURFACE[0].path).bytes++};
  await assert.rejects(()=>C.captureQ5EqualSlotProblem(x),/UI_Q5_EQUAL_SLOT_INPUT_CHANGED/);
});
test('closed Q5 keeps the eight-tile ceiling',async()=>{
  const x=equalSlotCase();x.frame.question.height=20000;x.frame.children[0].height=19000;
  await assert.rejects(()=>C.captureQ5EqualSlotProblem(x),/UI_SCROLL_TILE_LIMIT/);assert.equal(x.shots.length,0);
});

function syntheticQ5Dom() {
  const vm=require('node:vm'),webcrypto=require('node:crypto').webcrypto;
  const r=(y,h=20)=>({x:20,y,width:300,height:h});
  class E {
    constructor(tag,classes,rect,text=''){this.nodeType=1;this.tagName=tag;this.className=classes;this.r=rect;this.textContent=text;this.children=[];this.childNodes=[];this.css={display:'block',visibility:'visible',opacity:'1',position:'static'};this.classList={contains:n=>this.className.split(' ').includes(n)};this.outerHTML='<synthetic-unchanged/>';}
    add(...nodes){for(const node of nodes){node.parent=this;this.children.push(node);this.childNodes.push(node);}return this;}
    contains(node){return node===this||this.children.some(c=>c.contains(node));}
    closest(sel){if(sel==='.q-box'&&this.classList.contains('q-box'))return this;return this.parent?.closest(sel);}
    getBoundingClientRect(){return this.r;}
    querySelectorAll(sel){const match=n=>sel.split(',').some(t=>t[0]==='.'?n.classList.contains(t.slice(1)):n.tagName===t.toUpperCase());const all=[];for(const c of this.children){if(match(c))all.push(c);all.push(...c.querySelectorAll(sel));}return all;}
  }
  const box=new E('DIV','q-box ap-equal-slot',r(150,500)),wrapper=new E('DIV','ap-slot-content',r(160,300));box.add(wrapper);
  const number=new E('DIV','q-num',r(160),'5.'),content=new E('DIV','q-content',r(185,50),'Synthetic'),imageWrap=new E('DIV','q-image-wrap image-large',r(240,180)),choices=new E('DIV','choices choices-grid',r(425,35),'Choices');wrapper.add(number,content,imageWrap,choices);
  for(let i=0;i<5;i++)content.add(new E('MJX-CONTAINER','',r(190,14),'M'));
  const image=new E('IMG','',r(240,180));image.complete=true;image.naturalWidth=550;image.naturalHeight=330;image.src='http://127.0.0.1/archive/assets/images/21_풍덕중_2학기_기말_중3_기출/q05-problem-source-v2.png';imageWrap.add(image);
  for(let i=0;i<5;i++)choices.add(new E('DIV','choice-item',r(425,30),'C').add(new E('SPAN','choice-no',r(425,20),['①','②','③','④','⑤'][i]),new E('SPAN','choice-text',r(425,20),'C').add(new E('MJX-CONTAINER','',r(425,14),'M'))));
  const area=new E('DIV','',r(0,2000)).add(box);const doc={querySelector:s=>s==='#print-area'?area:null,querySelectorAll:s=>s==='body *'?[area,box,wrapper,...wrapper.children]:[],getElementById:()=>null,documentElement:{dataset:{apPrintReadiness:'{"state":"RENDER_READY"}'}}};
  const context={AppState:{mode:'exam',data:new Array(25)},document:doc,Node:{ELEMENT_NODE:1,TEXT_NODE:3},URL,location:{href:'http://127.0.0.1/archive/engine.html?mode=exam&studentReview=1&data=exams/original/middle/m3/2final/21_%ED%92%8D%EB%8D%95%EC%A4%91_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EC%A4%913_%EA%B8%B0%EC%B6%9C.js'},getComputedStyle:n=>n.css,innerWidth:1365,innerHeight:1000,scrollX:0,scrollY:0,crypto:webcrypto,TextEncoder,image};
  return {box,wrapper,number,content,imageWrap,choices,image,area,E,context,run:()=>vm.runInNewContext('('+C.measureQ5EqualSlotCapture.toString()+')(image)',context,{timeout:1000})};
}
test('actual browser collector reads exact engine wrapper roles without exporting text or changing DOM',async()=>{
  const x=syntheticQ5Dom(),out=JSON.parse(JSON.stringify(await x.run()));
  assert.deepEqual(out.equalSlotRoles,C.Q5_EQUAL_SLOT_ROLES);assert.equal(out.children.length,5);assert.equal(out.solutionNodes,0);
  assert.equal(JSON.stringify(out).includes('Synthetic'),false);assert.equal(x.box.outerHTML,'<synthetic-unchanged/>');
});
for(const[name,change]of Object.entries({
  'hidden number':x=>{x.number.css.display='none'},
  'hidden content':x=>{x.content.css.visibility='hidden'},
  'missing choice':x=>{x.choices.children.pop();x.choices.childNodes.pop()},
  'hidden choice marker':x=>{x.choices.children[0].children[0].css.opacity='0'},
  'foreign media':x=>{x.content.add(new x.E('IMG','',{x:20,y:190,width:30,height:20}))},
  'extra sibling':x=>{x.box.add(new x.E('DIV','',{x:20,y:200,width:30,height:20},'not captured'))},
  'unsafe text sibling':x=>{x.box.childNodes.push({nodeType:3,textContent:'unaccounted'})},
  'missing number':x=>{x.number.className='other'},
  'different wrapper':x=>{x.wrapper.className='different'},
  'role overflow':x=>{x.content.r.x=500},
  'another question':x=>{x.number.textContent='6.'},
  'cropped PNG':x=>{x.image.naturalWidth=255},
  'new source URL':x=>{x.context.location.href=x.context.location.href.replace('2final','2mid')},
  'loaded original asset':x=>{x.image.src=x.image.src.replace('q05-problem-source-v2.png','q05.png')}
}))test('actual browser collector rejects '+name,async()=>{
  const x=syntheticQ5Dom();change(x);await assert.rejects(()=>x.run(),/UI_Q5_EQUAL_SLOT_/);
});

test('closed Q5 uses the unchanged mobile viewport',async()=>{ const x=equalSlotCase(); x.viewport=clone(C.VIEWPORTS[1]); x.frame.viewport={width:x.viewport.width,height:x.viewport.height}; x.frame.obstructions[0].width=x.viewport.width; const out=await C.captureQ5EqualSlotProblem(x); assert.deepEqual(out.viewport,x.frame.viewport); assert.equal(out.viewportChanges,0); });
