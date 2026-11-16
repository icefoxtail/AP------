const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const M=require('../tools/check-remaining-figure3-display-browser.cjs'),H=require('../tools/check-reviewed-problem-renderer-browser.cjs');
const root=path.resolve(__dirname,'..'),head=process.env.REMAINING_FIGURE_TEST_COMMIT||'HEAD';
const cache=new Map();
const read=p=>{if(!cache.has(p)){const args=process.env.REMAINING_FIGURE_TEST_GIT_DIR?['--git-dir',process.env.REMAINING_FIGURE_TEST_GIT_DIR]:['-C',root];cache.set(p,cp.execFileSync('git',[...args,'show',head+':'+p],{env:{...process.env,GIT_NO_LAZY_FETCH:'1'},maxBuffer:128*1024*1024}));}return cache.get(p);};
const reader={read,ref:(p,b=read(p))=>({commit:head,path:p,gitBlobSha1:H.gitBlob(b),sha256:H.sha256(b),bytes:b.length})};
for(const surface of ['PROBLEM','SOLUTION']) {
 const manifest=JSON.parse(fs.readFileSync(path.join(root,M.SPECS[surface].path)));
 test(surface+' exact public source asset identity and complete selected count',()=>{M.validateManifest(manifest);M.assertFinalBinding(manifest);const out=M.preflight(reader,manifest);assert.equal(out.items.length,surface==='PROBLEM'?2:3);assert(out.items.every(x=>x.assetRefs.length===1));});
 for(const mutation of [m=>m.items.pop(),m=>m.expectedCases++,m=>m.items[0].sourceOrdinal++,m=>m.items[0].questionSha256='0'.repeat(64)])test(surface+' cannot change a closed manifest '+mutation.toString(),()=>{const m=structuredClone(manifest);mutation(m);assert.throws(()=>M.validateManifest(m),/UI_EXACT_CLOSED_MANIFEST/);});
 test(surface+' incomplete case inventory is refused',()=>assert.throws(()=>M.assertCompletedResults([],{},manifest,[]),/UI_ALL_LOGICAL_CASES/));
}
test('problem mode cannot contain solution nodes',()=>assert.throws(()=>M.assertTechnicalState({mode:'exam',questions:21,readiness:'RENDER_READY',pages:1,imagesComplete:true,mathErrors:0,unrenderedMath:0,mathJaxSource:'local',solutionNodes:1},'exam',21),/UI_PROBLEM_ONLY/));
test('solution mode requires its original solution nodes',()=>assert.throws(()=>M.assertTechnicalState({mode:'sol',questions:21,readiness:'RENDER_READY',pages:1,imagesComplete:true,mathErrors:0,unrenderedMath:0,mathJaxSource:'local',solutionNodes:0},'sol',21),/UI_SOLUTION_REQUIRED/));
test('actual event commit is independently bound',()=>assert.throws(()=>M.checkoutEvidence('a'.repeat(40),{ARCHIVE_REMAINING_FIGURE3_UI_EXPECTED_SHA:'b'.repeat(40)}),/UI_CHECKOUT_MISMATCH/));
test('current source bytes cannot change under the same manifest',()=>{const m=JSON.parse(fs.readFileSync(path.join(root,M.SPECS.PROBLEM.path)));const broken={...reader,read:p=>p===m.items[0].sourcePath?Buffer.concat([read(p),Buffer.from('\n// drift\n')]):read(p)};assert.throws(()=>M.preflight(broken,m),/UI_SOURCE_GIT_DRIFT/);});
