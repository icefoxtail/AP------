'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const N=require('../tools/4slot/named-partial-source-continuity.cjs');
const bank=[{id:1,question:'synthetic ]; escaped " boundary',choices:[],solution:'synthetic'}];
for(const [name,source]of[
 ['questionBank','window.questionBank='+JSON.stringify(bank)+';'],
 ['examData','window.examData='+JSON.stringify({questions:bank})+';'],
 ['title and alias','/* header */\nwindow.examTitle="synthetic";window.examData='+JSON.stringify({questions:bank})+';window.questionBank=window.examData.questions;'],
 ['duplicate equal data','window.examData='+JSON.stringify({questions:bank})+';window.questionBank='+JSON.stringify(bank)+';']
])test('named partial data-only parser accepts '+name,()=>assert.deepEqual(N.parseBank(Buffer.from(source)),bank));
for(const [name,source]of[
 ['execution suffix','window.questionBank=[];process.exit(0);'],
 ['executable value','window.questionBank=[(()=>1)()];'],
 ['unquoted key','window.questionBank=[{id:1}];'],
 ['duplicate assignment','window.questionBank=[];window.questionBank=[];'],
 ['foreign assignment','globalThis.questionBank=[];'],
 ['unterminated header','/* missing close'],
 ['missing semicolon','window.questionBank=[]'],
 ['foreign alias','window.questionBank=window.other.questions;'],
 ['conflicting banks','window.examData={"questions":[]};window.questionBank=[{"id":1}];'],
 ['nonobject row','window.questionBank=[null];'],
 ['nonstring title','window.examTitle={};window.questionBank=[];'],
 ['nonarray bank','window.questionBank={};']
])test('named partial data-only parser rejects '+name,()=>assert.throws(()=>N.parseBank(Buffer.from(source)),/NAMED_PARTIAL_SOURCE:/));
test('named partial parsing is restricted to the two exact existing source paths',()=>{
 for(const subject of N.SUBJECTS)assert.deepEqual(N.parseNamedSource({sourceArchiveFile:subject.sourceArchiveFile},Buffer.from('window.questionBank='+JSON.stringify(bank)+';')),bank);
 assert.equal(N.parseNamedSource({sourceArchiveFile:'original/middle/m1/1final/other.js'},Buffer.from('never evaluate this')),null);
});
test('named partial ordinary dispatch requires neither files nor Git for an unrelated source',()=>{
 assert.equal(N.verifyNamedSourceContinuation('/definitely-nonexistent-synthetic-root',{sourceArchiveFile:'original/middle/m1/1final/other.js'}),null);
});
test('named partial missing opt-in preserves the ordinary path without Git lookup',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'named-partial-empty-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 for(const subject of N.SUBJECTS)assert.equal(N.verifyNamedSourceContinuation(root,{sourceArchiveFile:subject.sourceArchiveFile}),null);
});
for(const token of [undefined,null,{},Object.freeze(Object.create(null)),new Map()])test('named partial rejects an unissued opaque historical context',()=>{
 assert.throws(()=>N.assertHistoricalContext(token,{root:'/not-read'}),/HISTORICAL_TOKEN_NOT_ACTIVE/);
 assert.throws(()=>N.historicalRebindView(token,{root:'/not-read'}),/HISTORICAL_TOKEN_NOT_ACTIVE/);
});
test('named partial exact subject list keeps original M3 changed Q8 outside restored eleven',()=>{
 const [m1,m3]=N.SUBJECTS;assert.deepEqual(m1.allowedOrdinals,[1,4,5,7,8]);assert.deepEqual(m1.heldOrdinals,[]);
 assert.deepEqual(m3.allowedOrdinals,[1,2,3,4,5,6,7,9,10,17,21]);assert.deepEqual(m3.heldOrdinals,[8]);
 assert(Object.isFrozen(N.SUBJECTS)&&Object.isFrozen(m1)&&Object.isFrozen(m3.allowedOrdinals));
});
