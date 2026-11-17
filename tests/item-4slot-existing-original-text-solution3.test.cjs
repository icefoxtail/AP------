'use strict';
// Hash-only scope boundaries and synthetic text fields. These tests do not
// supply a static/UI review, source payload, or new registration approval.
const test = require('node:test');
const assert = require('node:assert/strict');
const route = require('../tools/4slot/existing-original-text-solution3.cjs');
const copy = x => structuredClone(x);
const claim = () => ({schemaVersion:route.SCHEMA});
const binding = (index=0) => {
  const {key,nativeItemSha256,...value} = route.SUBJECTS[index];
  return copy(value);
};
for (let i=0;i<3;i++) test(`exact named hash-only binding ${i+1}`, () => {
  assert.equal(route.checkExactBinding(claim(),binding(i)).questionUid,route.SUBJECTS[i].questionUid);
});
const mutations = [
  ['foreign UID',x=>x.questionUid='qid_v1_'+'f'.repeat(64)],
  ['foreign ordinal',x=>x.sourceOrdinal++],
  ['foreign display number',x=>x.sourceQuestionNo='1'],
  ['wrong bank denominator',x=>x.sourceQuestionCount++],
  ['problem-surface use',x=>x.surface='PROBLEM'],
  ['unknown binding key',x=>x.allowFallback=true],
  ['changed original whole question',x=>x.priorQuestionSha256='1'.repeat(64)],
  ['changed current whole question',x=>x.currentQuestionSha256='1'.repeat(64)],
  ['changed registered vector',x=>x.vectorSha256='1'.repeat(64)],
  ['changed original metadata row',x=>x.priorMetadataSha256='1'.repeat(64)],
  ['changed original identity row',x=>x.priorIdentitySha256='1'.repeat(64)],
  ['nonempty original asset inventory',x=>x.priorAssets=[copy(x.currentAssets[0])]],
  ['missing current asset',x=>x.currentAssets=[]],
  ['duplicate current asset',x=>x.currentAssets.push(copy(x.currentAssets[0]))],
  ['foreign current asset path',x=>x.currentAssets[0].path='archive/assets/images/foreign.svg'],
  ['changed current asset bytes',x=>x.currentAssets[0].sha256='1'.repeat(64)],
  ['changed current asset byte count',x=>x.currentAssets[0].bytes++],
  ['changed current asset Git object',x=>x.currentAssets[0].gitBlobSha1='1'.repeat(40)],
  ['current asset ref extension',x=>x.currentAssets[0].authority='ACCEPT'],
  ['different asset and source checkouts',x=>x.currentAssets[0].commit='1'.repeat(40)],
  ['unbound current source revision',x=>x.currentSourceRef.commit=null],
  ['changed current whole source',x=>x.currentSourceRef.sha256='1'.repeat(64)],
  ['changed current source path',x=>x.currentSourceRef.path='archive/exams/foreign.js'],
  ['changed current source byte count',x=>x.currentSourceRef.bytes++],
  ['current source ref extension',x=>x.currentSourceRef.extra=true],
  ['changed original source commit',x=>x.priorSourceRef.commit='1'.repeat(40)],
  ['changed original source Git object',x=>x.priorSourceRef.gitBlobSha1='1'.repeat(40)],
  ['missing solution field transition',x=>x.changedFields.pop()],
  ['duplicate solution field transition',x=>x.changedFields.push(copy(x.changedFields[0]))],
  ['changed solution field digest',x=>x.changedFields[0].afterOwnSha256='1'.repeat(64)],
  ['text transition declaration',x=>x.changedFields[0].field='solution'],
  ['problem transcription declaration',x=>x.inlineEdits=[{kind:'ORIGINAL_IMAGE_PROCESS_TRANSCRIPTION'}]],
];
for (const [label,mutate] of mutations) test(`reject ${label}`, () => {
  const x=binding();mutate(x);assert.throws(()=>route.checkExactBinding(claim(),x),/EXISTING_ORIGINAL_TEXT_SOLUTION3_/);
});
for (const value of [null,{},[],{schemaVersion:'legacy'},{schemaVersion:route.SCHEMA,allowEmpty:true}])
  test(`reject absent, malformed or extended opt-in ${JSON.stringify(value)}`,()=>{
    assert.throws(()=>route.checkExactBinding(value,binding()),/EXISTING_ORIGINAL_TEXT_SOLUTION3_/);
  });
test('current source and asset commit can move together only with all pinned byte fields',()=>{
  const x=binding();x.currentSourceRef.commit='1'.repeat(40);x.currentAssets[0].commit=x.currentSourceRef.commit;
  assert.equal(route.checkExactBinding(claim(),x).questionUid,x.questionUid);
  // Immutable Git/live-byte verification remains in the existing caller.
});
function questions(){
  return {prior:{id:21,solution:'Synthetic unchanged explanation',answer:'SYNTHETIC'},
    current:{id:21,solution:'Synthetic unchanged explanation',answer:'SYNTHETIC',
      solutionImage:'assets/images/synthetic.svg',solutionImageAlt:'Synthetic display',
      solutionImageCaption:'Synthetic caption',solutionImageSize:'medium'}};
}
test('synthetic original text with four new display-only fields',()=>{
  const x=questions();assert.equal(route.checkOriginalTextFields(x.prior,x.current),undefined);
});
const fieldMutations = [
  ['original own-null image',x=>x.prior.solutionImage=null],
  ['original own-empty image',x=>x.prior.solutionImage=''],
  ['original image',x=>x.prior.solutionImage='assets/images/old.svg'],
  ['original alternate solution asset',x=>x.prior.solutionImages=[]],
  ['original unknown solution field',x=>x.prior.solutionMarkup='synthetic'],
  ['original missing text',x=>delete x.prior.solution],
  ['original null text',x=>x.prior.solution=null],
  ['original empty text',x=>{x.prior.solution='';x.current.solution='';}],
  ['current changed text',x=>x.current.solution+=' changed'],
  ['current missing text',x=>delete x.current.solution],
  ['current null text',x=>x.current.solution=null],
  ['current unknown solution field',x=>x.current.solutionFigureSvg='<svg/>'],
  ['current missing caption',x=>delete x.current.solutionImageCaption],
  ['current null caption',x=>x.current.solutionImageCaption=null],
  ['current empty image',x=>x.current.solutionImage=''],
  ['current nonstring display size',x=>x.current.solutionImageSize=12],
  ['changed answer',x=>x.current.answer='SYNTHETIC_CHANGED'],
  ['answer own-presence change',x=>delete x.current.answer],
  ['answer absence to null',x=>{delete x.prior.answer;x.current.answer=null;}],
];
for (const [label,mutate] of fieldMutations) test(`reject ${label}`,()=>{
  const x=questions();mutate(x);assert.throws(()=>route.checkOriginalTextFields(x.prior,x.current),/EXISTING_ORIGINAL_TEXT_SOLUTION3_/);
});
test('a valid scope cannot stand in for the immutable real whole questions',()=>{
  const x=questions();assert.throws(()=>route.verifyOriginalTextSolutionFigure({claim:claim(),binding:binding(),
    priorQuestion:x.prior,currentQuestion:x.current,nativeItemSha256:route.SUBJECTS[0].nativeItemSha256}),/WHOLE_QUESTION_BINDING/);
});
test('a valid scope cannot stand in for the exact Native item',()=>{
  const x=questions();assert.throws(()=>route.verifyOriginalTextSolutionFigure({claim:claim(),binding:binding(),
    priorQuestion:x.prior,currentQuestion:x.current,nativeItemSha256:'1'.repeat(64)}),/NATIVE_ITEM_BINDING/);
});
test('named immutable subject definitions cannot be modified through exports',()=>{
  assert(Object.isFrozen(route.SUBJECTS));
  for(const subject of route.SUBJECTS){assert(Object.isFrozen(subject));assert(Object.isFrozen(subject.currentAssets));
    assert(Object.isFrozen(subject.currentSourceRef));assert(Object.isFrozen(subject.changedFields));}
});
test('all hash-only scope refs exclude private workspace locators',()=>{
  const serialized=JSON.stringify(route.SUBJECTS);
  assert(!serialized.includes('/workspace/'));
  assert(!serialized.includes('privateLocalPath'));
  for(const s of route.SUBJECTS)for(const r of [s.priorSourceRef,s.currentSourceRef,...s.currentAssets])
    assert.deepEqual(Object.keys(r).sort(),['commit','path','gitBlobSha1','sha256','bytes'].sort());
});

test('changing only the named helper bytes invalidates a previously reusable builder cache', t => {
  const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
  const Module = require('node:module');
  const filename = require.resolve('../tools/4slot/build-4slot-runtime.cjs');
  const helper = require.resolve('../tools/4slot/existing-original-text-solution3.cjs');
  const source = fs.readFileSync(filename, 'utf8');
  // Run the actual builder with just its one dependency read returning different
  // bytes. No production file or global fs method is changed by this test.
  function load(extra) {
    const fresh = new Module(filename, module);
    fresh.filename = filename;
    fresh.paths = Module._nodeModulePaths(path.dirname(filename));
    const ordinaryRequire = fresh.require.bind(fresh);
    fresh.require = name => name === 'node:fs' ? {...fs, readFileSync(file, ...args) {
      const raw = fs.readFileSync(file, ...args);
      if (typeof file !== 'string' || path.resolve(file) !== helper) return raw;
      return typeof raw === 'string' ? raw + extra : Buffer.concat([raw, Buffer.from(extra)]);
    }} : ordinaryRequire(name);
    fresh._compile(source, filename);
    return fresh.exports;
  }
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'text-solution3-cache-'));
  t.after(() => fs.rmSync(root, {recursive:true, force:true}));
  function put(rel, value) {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), {recursive:true});
    fs.writeFileSync(full, typeof value === 'string' ? value : JSON.stringify(value));
  }
  const first = load('');
  const sourceFile = 'original/middle/m2/1mid/synthetic.js';
  const question = {id:1, content:'Synthetic cache input', answer:'synthetic', solution:'synthetic'};
  const bank = 'window.questionBank=' + JSON.stringify([question]) + ';';
  put('archive/exams/' + sourceFile, bank);
  put('docs/architecture/4slot/term-dictionary-v1.5.json', {dictionaryVersion:'1.5', terms:[
    {id:1, ko:'synthetic given', status:'ACTIVE'}, {id:2, ko:'synthetic goal', status:'ACTIVE'},
    {id:3, ko:'synthetic method', status:'ACTIVE'}]});
  put('archive/data/question_identity_map.json', {records:[{
    questionUid:'qid_v1_' + 'a'.repeat(64), sourceArchiveFile:sourceFile,
    sourceOrdinal:1, sourceQuestionNo:'1', status:'VERIFIED', sourceFingerprint:first.identityHash(question)}]});
  put('archive/data/item-4slot/' + sourceFile.replace(/\.js$/, '.4slot.json'), {
    schemaVersion:'archive-meta-4slot-compact-v1', sourceArchiveFile:sourceFile,
    sourceGitBlobSha:first.blob(bank), dictionaryVersion:'1.5',
    reviewedBy:{agent:'SYNTHETIC_EXISTING', at:'2026-01-01', sampled:[1]},
    evidence:{branch:'synthetic', commit:'a'.repeat(40), path:'docs/synthetic.json'},
    items:[{ordinal:1, format:'단일 정답', given:[1], goal:[2], method:[3], condition:[], candidates:[]}]
  });
  const before = first.build(root, {reuseCache:false});
  assert.equal(before.index.counts.registered, 1);
  assert.equal(first.build(root, {previous:before.index}).stats.reusedFiles, 1);
  const after = load('\n// Synthetic dependency-only byte change.\n').build(root, {previous:before.index});
  assert.notEqual(after.index.builderSha256, before.index.builderSha256);
  assert.notEqual(after.index.files[0].inputHash, before.index.files[0].inputHash);
  assert.equal(after.stats.reusedFiles, 0);
  assert.equal(after.stats.revalidatedFiles, 1);
  assert.deepEqual(after.index.records, before.index.records);
});
