import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {checkStagedRegistrationWhitespace} from '../tools/ci/archive-registration-whitespace.mjs';
import {prepareRegistration,nativeLanes,matches} from '../tools/ci/archive-registration-writer.mjs';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const normalizer='archive/tools/generated-meta/normalize-qid9-svg.cjs';
const normalize=createRequire(import.meta.url)(path.join(project,normalizer));
const directory='alive/06_EXECUTION/fixture',source=directory+'/assets/fixture.svg';
const uid='ALIVE-FIXTURE-Q01-A1',output='archive/assets/generated-lite/qid9/'+uid+'-solution.svg';
const svg='<svg xmlns="http://www.w3.org/2000/svg">\n<title>Fixture</title>\n<desc>A fixture diagram.</desc>\n<path d="M0 0 L1 1" />  \n</svg>\n';
const git=(root,...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
function write(root,rel,text) {fs.mkdirSync(path.dirname(path.join(root,rel)),{recursive:true});fs.writeFileSync(path.join(root,rel),text);}
function fixture(t,sourceText=svg) {
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'archive-whitespace-')),root=path.join(temp,'repo');fs.mkdirSync(root);
  t.after(()=>fs.rmSync(temp,{recursive:true,force:true}));
  git(root,'init','-q','--initial-branch=main');git(root,'config','user.name','fixture');git(root,'config','user.email','fixture@example.invalid');git(root,'config','core.autocrlf','false');
  write(root,normalizer,fs.readFileSync(path.join(project,normalizer)));
  write(root,'archive/data/generated-source-import-roots-v1.json',JSON.stringify({roots:[{directory}]}));
  write(root,directory+'/GPT_QID9_Q01_CREATE_DRAFT.json',JSON.stringify({questions:[{uid,solutionImage:'assets/fixture.svg'}]}));
  write(root,source,sourceText);git(root,'add','-A');git(root,'commit','-q','-m','reviewed source fixture');
  const stage=(text=normalize(sourceText,uid))=>{write(root,output,text);git(root,'add','--',output);};
  return {root,temp,stage,sourceText};
}

test('native SVG transformation may preserve reviewed body whitespace without rewriting source or asset',t=>{
  const f=fixture(t),head=git(f.root,'rev-parse','HEAD');f.stage();
  const beforeSource=fs.readFileSync(path.join(f.root,source)),beforeOutput=fs.readFileSync(path.join(f.root,output));
  const result=checkStagedRegistrationWhitespace(f.root);
  assert.equal(result.status,'INHERITED_SOURCE_WHITESPACE');assert.equal(result.rawGitExitCode,2);
  assert.equal(result.inheritedLineCount,1);assert.equal(result.inheritedAssets.length,1);
  assert.equal(result.inheritedAssets[0].source,source);assert.match(result.inheritedAssets[0].sourceBlob,/^[a-f0-9]{40}$/);
  assert.equal(git(f.root,'rev-parse','HEAD'),head);
  assert.ok(fs.readFileSync(path.join(f.root,source)).equals(beforeSource));assert.ok(fs.readFileSync(path.join(f.root,output)).equals(beforeOutput));
});

test('clean staged changes retain the actual raw Git PASS',t=>{
  const f=fixture(t);write(f.root,'out/metadata.json','{}\n');git(f.root,'add','out/metadata.json');
  assert.deepEqual(checkStagedRegistrationWhitespace(f.root),{status:'PASS',rawGitExitCode:0,inheritedLineCount:0,inheritedAssets:[]});
});

test('new whitespace and other staged output drift cannot borrow the native SVG exception',t=>{
  const f=fixture(t);f.stage(normalize(svg,uid).replace('/>  \n','/>   \n'));
  assert.throws(()=>checkStagedRegistrationWhitespace(f.root),/NATIVE_OUTPUT_MISMATCH/);
});

test('an exact native output still fails when the normalizer introduces a new trailing-space line',t=>{
  const f=fixture(t,svg.replace('/>  \n','/>\n'));
  fs.appendFileSync(path.join(f.root,normalizer),'\nconst original = module.exports; module.exports = (...args) => original(...args).replace("/>\\n", "/>  \\n");\n');
  git(f.root,'add',normalizer);git(f.root,'commit','-q','-m','fixture producer introduces whitespace');
  f.stage(normalize(f.sourceText,uid).replace('/>\n','/>  \n'));
  assert.throws(()=>checkStagedRegistrationWhitespace(f.root),/NEW_TRAILING_WHITESPACE/);
});

test('uncommitted normalizer bytes cannot bind inherited whitespace',t=>{
  const f=fixture(t);f.stage();fs.appendFileSync(path.join(f.root,normalizer),'\n// unstaged drift\n');
  assert.throws(()=>checkStagedRegistrationWhitespace(f.root),/UNCOMMITTED_NORMALIZER/);
});

test('whitespace outside native QID9 assets and unbound SVG assets remain failures',t=>{
  const f=fixture(t);write(f.root,'out/runtime.js','const value = 1;  \n');git(f.root,'add','out/runtime.js');
  assert.throws(()=>checkStagedRegistrationWhitespace(f.root),/OUTSIDE_NATIVE_ASSET/);
  git(f.root,'reset','-q','HEAD','--','out/runtime.js');fs.rmSync(path.join(f.root,'out/runtime.js'));
  const unbound=output.replace(uid,'ALIVE-UNBOUND-Q01-A1');write(f.root,unbound,normalize(svg,uid));git(f.root,'add',unbound);
  assert.throws(()=>checkStagedRegistrationWhitespace(f.root),/UNBOUND_ASSET/);
});

for(const [name,text] of [
  ['conflict marker',svg.replace('<path','<<<<<<< HEAD\n<path')],
  ['blank line at EOF',svg+'\n'],
  ['space before tab',svg.replace('<path',' \t<path')]
])test(name+' is fatal even when inherited from the reviewed source',t=>{
  const f=fixture(t,text);f.stage();assert.throws(()=>checkStagedRegistrationWhitespace(f.root),/GIT_CHECK_FAILED/);
});

test('a configured stricter Git whitespace policy is preserved',t=>{
  const f=fixture(t,svg.replace('/>  \n','/>\n').replace('<path','\t<path'));f.stage();
  git(f.root,'config','core.whitespace','tab-in-indent');
  assert.throws(()=>checkStagedRegistrationWhitespace(f.root),/GIT_CHECK_FAILED/);
  assert.equal(git(f.root,'config','core.whitespace'),'tab-in-indent');
});

test('the writer persists a nonpublishable final-gate failure with its completed native lane evidence',async t=>{
  const f=fixture(t),work=path.join(f.temp,'evidence'),head=git(f.root,'rev-parse','HEAD');
  await assert.rejects(()=>prepareRegistration({root:f.root,work,env:{},
    lanes:[{id:'shared',required:true,inputs:[source],outputs:['out/runtime.js'],commands:[]}],
    execute:async()=>write(f.root,'out/runtime.js','const value = 1;  \n')}),/OUTSIDE_NATIVE_ASSET/);
  const report=JSON.parse(fs.readFileSync(path.join(work,'report.json'),'utf8'));
  assert.equal(report.status,'FINAL_GATE_FAILED');assert.equal(report.safeToPersist,false);assert.equal(report.publishable,false);
  assert.equal(report.lanes[0].status,'VERIFIED');assert.equal(git(f.root,'rev-parse','HEAD'),head);
});

test('the new final-gate checker version invalidates every native lane proof',()=>{
  for(const lane of nativeLanes(project))assert.equal(matches('tools/ci/archive-registration-whitespace.mjs',lane.inputs),true,lane.id);
});
