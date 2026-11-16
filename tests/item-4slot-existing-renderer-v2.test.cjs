'use strict';
// Fictional Git fixtures only; no operational review or approval is created.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {execFileSync}=require('node:child_process');
const H=require('../tools/4slot/rebind-existing-renderer-v2.cjs'),P=require('../tools/4slot/partial-submission.cjs');
const B=require('../tools/4slot/build-4slot-runtime.cjs');
const C=require('../archive/item-4slot.js');
const source='archive/exams/original/middle/m3/2mid/typed-test.js',compact='archive/data/item-4slot/original/middle/m3/2mid/typed-test.4slot.json';
const four='docs/operations/m3-s2-meta-full-20261114/exams/E900.4slot.json',meta=four.replace('.4slot.','.meta.');
const dict='docs/architecture/4slot/term-dictionary-v1.6.json',prefix='.archive-meta-register/evidence/m3s2-existing-renderer-test/';
const inputPath=prefix+'input.json',acceptPath=prefix+'acceptance.json',reviewPath=prefix+'independent-review.json',continuityPath=prefix+'E900.renderer-continuity.json';
const oldAsset='archive/assets/images/typed-test/old.svg',newAsset='archive/assets/images/typed-test/new.svg',companion='archive/assets/images/typed-test/solution.svg';
const json=x=>JSON.stringify(x,null,2)+'\n',bank=x=>'window.questionBank='+JSON.stringify(x)+';\n',uid=n=>'qid_v1_'+String(n).padStart(64,'0');
const tuple=n=>({questionUid:uid(n),sourceOrdinal:n,sourceQuestionNo:String(n)});
const field=(q,k)=>P.sha(P.stable({present:Object.hasOwn(q,k),value:q[k]??null}));
function setup(){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'archive-existing-renderer-test-'));
 const write=(p,v)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),typeof v==='string'||Buffer.isBuffer(v)?v:json(v));};
 const read=p=>fs.readFileSync(path.join(root,p)),git=(...a)=>execFileSync('git',['-C',root,...a],{stdio:['ignore','pipe','pipe']}).toString().trim();
 const commit=message=>{git('add','.');git('commit','-qm',message);return git('rev-parse','HEAD');};
 git('init','-q');git('config','user.name','Fictional Author');git('config','user.email','fictional@example.invalid');git('config','commit.gpgsign','false');
 const old=Array.from({length:3},(_,i)=>({id:i+1,number:i+1,content:'point '+(i+1),answer:'synthetic',solution:'use substitution'}));
 old[1].image=oldAsset.slice(8);old[1].solutionImage=companion.slice(8);
 write(source,bank(old));write(oldAsset,'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>');write(companion,'<svg xmlns="http://www.w3.org/2000/svg"><circle r="1"/></svg>');
 const dictionary={dictionaryVersion:'term-dict-v1.6-2026-11-15',terms:[{id:1,ko:'조건',status:'ACTIVE'},{id:2,ko:'값',status:'ACTIVE'},{id:3,ko:'대입',status:'ACTIVE'}]};write(dict,dictionary);
 const native={schemaVersion:'archive-meta-4slot-v0',sourceArchiveFile:source.slice(14),sourceGitBlobSha:P.blob(read(source)),dictionaryVersion:dictionary.dictionaryVersion,judgedBy:{agent:'FICTIONAL_NATIVE_AUTHOR'},items:old.map(q=>({...tuple(q.id),format:'단답',slots:{given:[{term:'조건',src:'stem',quote:q.content}],goal:[{term:'값',src:'stem',quote:q.content}],method:[{term:'대입',src:'solution',quote:q.solution,evidenceType:'NAMED'}],condition:[]}}))};write(four,native);
 const semantic={schemaVersion:'m3-s2-complete-semantic-review-v1',sourceArchiveFile:source.slice(14),author:'FICTIONAL_NATIVE_AUTHOR',sourceAfterBlob:P.blob(read(source)),sourceAfterSha256:P.sha(read(source)),items:old.map(q=>({...tuple(q.id),after:{marker:'fictional-existing-metadata'}}))};write(meta,semantic);
 write('archive/data/question_identity_map.json',{records:old.map(q=>({...tuple(q.id),sourceArchiveFile:source.slice(14),status:'VERIFIED'}))});
 const before=commit('fictional native source and reviews');
 const ref=(c,p)=>{const raw=execFileSync('git',['-C',root,'show',c+':'+p]);return{commit:c,path:p,sha256:P.sha(raw),gitBlobSha1:P.blob(raw)};};
 const sourceRef=(c,q)=>({...ref(c,source),questionSha256:P.sha(P.stable(q))});
 const nr={commit:before,path:meta,sha256:P.sha(read(meta))};
 const prior={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:native.sourceArchiveFile,sourceGitBlobSha:P.blob(read(source)),dictionaryVersion:dictionary.dictionaryVersion,evidence:{branch:'fictional',commit:before,path:four,sha256:P.sha(read(four))},reviewedBy:{agent:'FICTIONAL_PRIOR_REVIEWER',at:'2026-11-15',sampled:[1,2,3]},items:old.map(q=>({ordinal:q.id,format:'단답',given:[1],goal:[2],method:[3],condition:[],candidates:[]}))};write(compact,prior);
 const priorCommit=commit('fictional accepted full compact'),priorRef=ref(priorCommit,compact);
 const current=structuredClone(old);current[1].image=newAsset.slice(8);current[1].imageSize='full';current[2].content='outside changed point';
 write(source,bank(current));write(newAsset,'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L2 2"/></svg>');const changed=commit('fictional renderer source');
 const assetRef=(c,p)=>({...ref(c,p),visuallyInspected:true,renderSha256:P.sha('fictional raster '+p)});
 const row={...tuple(2),decision:'PASS_NARROW_RENDERER_SEMANTIC_PRESERVATION',visualInspectionPerformed:true,nativeReviewRef:nr,nativeItemSha256:P.sha(P.stable(semantic.items[1])),nativeSourceRef:sourceRef(before,old[1]),prefigureSourceRef:sourceRef(before,old[1]),currentSourceRef:sourceRef(changed,current[1]),changedRendererFields:['image','imageSize'],fieldDeltaHashes:['image','imageSize'].map(k=>({field:k,beforeSha256:field(old[1],k),afterSha256:field(current[1],k)})),contentTransition:{kind:'UNCHANGED',beforeSha256:P.sha(old[1].content),afterSha256:P.sha(current[1].content)},nonRendererFieldChanges:[],mathematicalStemBytesUnchanged:true,choicesAnswerSolutionDifficultyUnchanged:true,assets:{before:[assetRef(before,oldAsset),assetRef(before,companion)].sort((a,b)=>a.path.localeCompare(b.path)),current:[assetRef(changed,newAsset),assetRef(changed,companion)].sort((a,b)=>a.path.localeCompare(b.path))},visualEvidence:{contactSha256:P.sha('fictional contact'),renderedAssetCount:3},observed:'Fictional independent raster inspection'};
 delete row.sourceQuestionNo;
 const review={schemaVersion:'archive-independent-current-renderer-review-v2',scope:'EXACT_RENDERER_METADATA_AND_TWO_IMAGE_CONTAINERS',reviewer:'FICTIONAL_INDEPENDENT_REVIEWER',decision:row.decision,nativeReviewCommit:before,prefigureCommit:before,currentCommit:changed,counts:{selected:1,newFullMathApprovals:0,newMetadataApprovals:0,newDifficultyApprovals:0,newReviewPassCount:0},rows:[row]};
 const continuity={schemaVersion:'archive-reviewed-renderer-continuity-evidence-v1',scope:'NATIVE_SEMANTIC_REUSE_WITH_INDEPENDENT_CURRENT_RENDERER',sourceArchiveFile:native.sourceArchiveFile,expectedQuestionCount:3,selectedUidCount:1,newFullMathematicalQa:false,newReviewPassCount:0,newMetadataApprovals:0,newDifficultyJudgments:0,items:[{questionUid:uid(2),sourceOrdinal:2,nativeReviewRef:nr,nativeItemSha256:row.nativeItemSha256,prefigureSourceRef:row.prefigureSourceRef,currentSourceRef:row.currentSourceRef,independentReviewRef:{path:reviewPath,sha256:''}}]};
 write(reviewPath,review);continuity.items[0].independentReviewRef.sha256=P.sha(read(reviewPath));write(continuityPath,continuity);let proofCommit=commit('fictional published independent proof');
 const input={schemaVersion:H.INPUT_SCHEMA,requestId:'m3s2-existing-test',author:'FICTIONAL_ASSEMBLER',preparedAtUtc:'2026-11-15T00:00:00Z',source:ref(changed,source),dictionary:{path:dict,version:dictionary.dictionaryVersion,gitBlobSha1:P.blob(read(dict)),sha256:P.sha(read(dict))},priorCompact:priorRef,expectedCompactSha256:priorRef.sha256,scope:{expectedQuestionCount:3,selected:[tuple(2)],untouched:[tuple(1),tuple(3)]},items:[{...tuple(2),priorCompactItemSha256:P.sha(P.stable(prior.items[1])),nativeFourSlot:ref(before,four),nativeRowSha256:P.sha(P.stable(native.items[1])),rendererContinuity:ref(proofCommit,continuityPath)}],newSemanticApproval:0,newMathQa:0,sourceChanges:0};
 const acceptance={schemaVersion:H.ACCEPTANCE_SCHEMA,author:input.author,reviewer:'FICTIONAL_ROOT_REVIEWER',decision:H.DECISION,reviewedAtUtc:'2026-11-15T01:00:00Z',allowedScope:'FOUR_SLOT_VECTOR_ONLY',newSemanticApproval:0,otherUidApprovals:0,newMathQa:0,sourceChanges:0,candidates:[]};
 const bind=()=>{write(inputPath,input);acceptance.candidates=[{requestId:input.requestId,inputSha256:P.sha(read(inputPath))}];write(acceptPath,acceptance);};bind();
 const args=()=>({root,input:{path:inputPath,sha256:P.sha(read(inputPath))},acceptance:{path:acceptPath,sha256:P.sha(read(acceptPath))},expectedCompactSha256:input.expectedCompactSha256});
 const publishReview=()=>{write(reviewPath,review);continuity.items[0].independentReviewRef.sha256=P.sha(read(reviewPath));write(continuityPath,continuity);proofCommit=commit('fictional amended proof for negative check');input.items[0].rendererContinuity=ref(proofCommit,continuityPath);bind();};
 const rebindCurrent=()=>{write(source,bank(current));const c=commit('fictional changed source for negative check');input.source=ref(c,source);row.currentSourceRef=sourceRef(c,current[1]);continuity.items[0].currentSourceRef=row.currentSourceRef;review.currentCommit=c;row.assets.current=row.assets.current.map(r=>assetRef(c,r.path));row.fieldDeltaHashes=row.changedRendererFields.map(k=>({field:k,beforeSha256:field(old[1],k),afterSha256:field(current[1],k)}));publishReview();};
 const build=()=>B.build(root,{previous:null,reuseCache:false,readBlob:sha=>execFileSync('git',['-C',root,'cat-file','blob',sha])});
 return{root,write,read,git,commit,ref,old,current,input,acceptance,review,row,continuity,prior,bind,args,publishReview,rebindCurrent,build,cleanup:()=>fs.rmSync(root,{recursive:true,force:true})};
}
function fixture(t){const f=setup();t.after(f.cleanup);return f;}
function reject(t,change,pattern){const f=fixture(t);change(f);assert.throws(()=>H.importExistingRenderer(f.args()),pattern||/PARTIAL_4SLOT:/);}
test('typed-v2 renderer retains full three vectors and registers only the selected renderer',t=>{
 const f=fixture(t),before=f.read(compact),prior=f.build();assert.equal(prior.index.records.length,1);assert.equal(prior.index.pending.length,2);
 const dry=H.importExistingRenderer(f.args());assert.equal(dry.selected,1);assert.equal(dry.untouched,2);assert.equal(f.read(compact).toString(),before.toString());
 const written=H.importExistingRenderer({...f.args(),write:true});assert.deepEqual(written.output.items,f.prior.items);assert.deepEqual(written.output.evidence,f.prior.evidence);assert.equal(written.output.sourceGitBlobSha,f.prior.sourceGitBlobSha);
 assert.equal(H.verifyPublished(f.root,written.output).byUid.size,1);const built=f.build();assert.equal(built.index.records.length,2);assert.equal(built.index.pending.length,1);assert.equal(built.index.pending[0].reason,'STALE_STUDENT_PAYLOAD');assert.equal(built.index.records.find(r=>r.questionUid===uid(2)).sourceBinding,'SCOPED_REVIEWED_RENDERER');assert.equal(B.verify(built.index).verified,2);assert.equal(C.createIndex(built.index).get(uid(2)).rendererReceipt.sha256,written.receipt.sha256);
 assert.deepEqual(built.index.records.find(r=>r.questionUid===uid(1)),prior.index.records[0]);assert.equal(H.importExistingRenderer({...f.args(),write:true}).replay,true);
});
test('typed-v2 renderer rejects self-reviewed root acceptance',t=>reject(t,f=>{f.acceptance.reviewer=f.input.author;f.bind();},/ROOT_ACCEPTANCE/));
test('typed-v2 renderer rejects semantic approval expansion',t=>reject(t,f=>{f.acceptance.newSemanticApproval=1;f.bind();},/ROOT_ACCEPTANCE/));
test('typed-v2 renderer rejects altered accepted input bytes',t=>reject(t,f=>{f.input.preparedAtUtc='2026-11-15T00:00:01Z';f.write(inputPath,f.input);},/EXACT_ROOT_ACCEPTED_INPUT/));
test('typed-v2 renderer rejects excluded source scope before reading source',t=>reject(t,f=>{f.input.source.path=f.input.source.path.replace('/2mid/','/1mid/');f.bind();},/SOURCE_SCOPE/));
test('typed-v2 renderer rejects source disk drift',t=>reject(t,f=>{f.current[1].answer='changed';f.write(source,bank(f.current));},/LIVE_SOURCE_HEAD/));
test('typed-v2 renderer rejects missing full partition row',t=>reject(t,f=>{f.input.scope.untouched.pop();f.bind();},/PARTITION_DENOMINATOR/));
test('typed-v2 renderer rejects duplicate selected identity',t=>reject(t,f=>{f.input.scope.untouched[0]=tuple(2);f.bind();},/PARTITION_IDENTITY_OR_DUPLICATE/));
test('typed-v2 renderer rejects wrong selected UID',t=>reject(t,f=>{f.input.items[0].questionUid=uid(3);f.bind();},/SELECTED_IDENTITY/));
test('typed-v2 renderer rejects altered prior vector hash',t=>reject(t,f=>{f.input.items[0].priorCompactItemSha256='0'.repeat(64);f.bind();},/SELECTED_CURRENT_AND_VECTOR_CAS/));
test('typed-v2 renderer rejects native reference replacement',t=>reject(t,f=>{f.input.items[0].nativeFourSlot.sha256='0'.repeat(64);f.bind();},/ORIGINAL_COMPACT_NATIVE_REFERENCE/));
test('typed-v2 renderer rejects wrong native row hash',t=>reject(t,f=>{f.input.items[0].nativeRowSha256='0'.repeat(64);f.bind();},/FOUR_SLOT_NATIVE_ROW/));
test('typed-v2 renderer rejects v3 proof at this v2-only route',t=>reject(t,f=>{f.review.schemaVersion='archive-independent-current-renderer-review-v3';f.publishReview();},/INDEPENDENT_SCOPE/));
test('typed-v2 renderer rejects HOLD in original independent decision',t=>reject(t,f=>{f.row.decision='HOLD';f.publishReview();},/INDEPENDENT_ROW_BINDING/));
test('typed-v2 renderer rejects visual inspection not performed',t=>reject(t,f=>{f.row.visualInspectionPerformed=false;f.publishReview();},/INDEPENDENT_ROW_BINDING/));
test('typed-v2 renderer rejects wrong native metadata row hash',t=>reject(t,f=>{f.row.nativeItemSha256='0'.repeat(64);f.continuity.items[0].nativeItemSha256=f.row.nativeItemSha256;f.publishReview();},/NATIVE_METADATA_ROW/));
test('typed-v2 renderer rejects changed answer despite rebound accepted hashes',t=>reject(t,f=>{f.current[1].answer='changed answer';f.rebindCurrent();},/IMAGE_FIELDS_ONLY/));
test('typed-v2 renderer rejects unknown selected producer field despite rebound hashes',t=>reject(t,f=>{f.current[1].unknownProducer='unexpected';f.rebindCurrent();},/IMAGE_FIELDS_ONLY/));
test('typed-v2 renderer rejects current image bytes outside the published visual proof',t=>reject(t,f=>{f.write(newAsset,'<svg/>');},/CURRENT_ASSET_BYTES/));
test('typed-v2 renderer checks unchanged companion image bytes too',t=>reject(t,f=>{f.write(companion,'<svg/>');},/CURRENT_ASSET_BYTES/));
test('typed-v2 renderer rejects omitted companion asset reference',t=>reject(t,f=>{f.row.assets.current=f.row.assets.current.filter(r=>r.path!==companion);f.publishReview();},/ASSET_DENOMINATOR/));
test('typed-v2 renderer rejects raster digest omission',t=>reject(t,f=>{f.row.visualEvidence.contactSha256='';f.publishReview();},/COMPLETE_VISUAL_EVIDENCE/));
test('typed-v2 renderer rejects changed compact before issuing',t=>reject(t,f=>{const c=JSON.parse(f.read(compact));c.items[0].given=[2];f.write(compact,c);},/CURRENT_COMPACT_CAS/));
test('typed-v2 renderer rejects an explicit CAS argument substitution',t=>{const f=fixture(t);assert.throws(()=>H.importExistingRenderer({...f.args(),expectedCompactSha256:'0'.repeat(64)}),/EXPLICIT_COMPACT_CAS/);});
test('typed-v2 renderer rejects conflicting preexisting receipt',t=>reject(t,f=>{f.write(H.RECEIPTS+f.input.requestId+'.json','{}\n');},/IMMUTABLE_RECEIPT_CONFLICT/));
test('typed-v2 runtime rejects edited receipt with a restamped descriptor hash',t=>{const f=fixture(t),r=H.importExistingRenderer({...f.args(),write:true});r.publicReceipt.records[0].currentWholeQuestionSha256='0'.repeat(64);const bytes=json(r.publicReceipt);f.write(r.receipt.path,bytes);r.output.currentRendererRebind.receipt.sha256=P.sha(bytes);assert.throws(()=>H.verifyPublished(f.root,r.output),/PUBLISHED_DERIVATION/);});
test('typed-v2 runtime rejects any changed outside vector',t=>{const f=fixture(t),r=H.importExistingRenderer({...f.args(),write:true});r.output.items[0].method=[1];assert.throws(()=>H.verifyPublished(f.root,r.output),/PUBLISHED_DERIVATION/);});
test('typed-v2 marker removal cannot promote a renderer-changed row',t=>{const f=fixture(t),r=H.importExistingRenderer({...f.args(),write:true});delete r.output.currentRendererRebind;f.write(compact,r.output);const built=f.build();assert.equal(built.index.records.length,1);assert.equal(built.index.pending.length,2);assert.ok(!built.index.records.some(r=>r.questionUid===uid(2)));});
test('typed-v2 runtime retains selected proof after only an outside-container change',t=>{const f=fixture(t),r=H.importExistingRenderer({...f.args(),write:true});f.current[2].producerTag='transport';f.write(source,bank(f.current));f.commit('fictional outside selected source transport');assert.equal(H.verifyPublished(f.root,r.output).byUid.size,1);assert.equal(f.build().index.records.length,2);assert.throws(()=>H.importExistingRenderer(f.args()),/ISSUANCE_SOURCE_CAS/);});
test('typed-v2 public path traversal is rejected',t=>{const f=fixture(t),a=f.args();a.input.path=prefix+'../input.json';assert.throws(()=>H.importExistingRenderer(a),/UNSAFE_PATH/);});
test('typed-v2 consumer rejects missing or malformed typed receipt linkage',t=>{const f=fixture(t);H.importExistingRenderer({...f.args(),write:true});const good=f.build().index;for(const fault of ['missing','schema','path','sha','unknown']){const index=structuredClone(good),row=index.records.find(r=>r.questionUid===uid(2));if(fault==='missing')delete row.rendererReceipt;if(fault==='schema')row.rendererReceipt.schemaVersion='private';if(fault==='path')row.rendererReceipt.path='../../outside';if(fault==='sha')row.rendererReceipt.sha256='0';if(fault==='unknown')row.rendererReceipt.unreviewed=true;assert.throws(()=>C.createIndex(index),/FOUR_SLOT_RENDERER_RECEIPT_INVALID/);}});
test('typed-v2 consumer rejects relabeling scoped proof as unchanged payload',t=>{const f=fixture(t);H.importExistingRenderer({...f.args(),write:true});const index=f.build().index;index.records.find(r=>r.questionUid===uid(2)).sourceBinding='UNCHANGED_STUDENT_PAYLOAD';assert.throws(()=>C.createIndex(index),/FOUR_SLOT_SOURCE_BINDING_INVALID/);});


test('renderer lane merge refuses both certificate fields on one runtime row',t=>{
 const f=fixture(t);H.importExistingRenderer({...f.args(),write:true});
 const good=f.build().index,typed=good.records.find(r=>r.questionUid===uid(2));
 const external={path:'.archive-meta-register/4slot-renderer-continuity/synthetic.json',sha256:'a'.repeat(64)};
 const mixed=structuredClone(good);mixed.records.find(r=>r.questionUid===uid(2)).rendererContinuityRef=external;
 assert.throws(()=>C.createIndex(mixed),/FOUR_SLOT_RENDERER_CONTINUITY_REF_UNEXPECTED/);
 const registered=structuredClone(good),row=registered.records.find(r=>r.questionUid===uid(2));
 row.sourceBinding='REGISTERED_RENDERER_CONTINUITY';delete row.rendererReceipt;row.rendererContinuityRef=external;
 assert.equal(C.createIndex(registered).get(uid(2)).sourceBinding,'REGISTERED_RENDERER_CONTINUITY');
 row.rendererReceipt=structuredClone(typed.rendererReceipt);
 assert.throws(()=>C.createIndex(registered),/FOUR_SLOT_SOURCE_BINDING_INVALID/);
});
test('renderer lane merge refuses two valid authorities for the same selected UID',t=>{
 const f=fixture(t);H.importExistingRenderer({...f.args(),write:true});
 const adapter=require('../tools/4slot/registered-renderer-continuity.cjs'),original=adapter.verify;
 t.after(()=>{adapter.verify=original;});
 const sidecar='.archive-meta-register/4slot-renderer-continuity/synthetic.json';
 f.write(sidecar,{sourceArchiveFile:source.slice(14),questionUid:uid(2),sourceOrdinal:2,receiptRef:{path:'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/synthetic.json'}});
 f.write('archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/synthetic.json',{approval:{evidenceRefs:[]}});
 let calls=0;adapter.verify=()=>{calls++;return{status:'PASS'};};
 const built=f.build();assert.equal(calls,1);assert.equal(built.index.records.length,1);
 assert.equal(built.index.records[0].questionUid,uid(1));
 assert.equal(built.index.pending.find(r=>r.ordinal===2).reason,'MULTIPLE_RENDERER_CONTINUITY_AUTHORITIES');
 assert.equal(built.index.pending.find(r=>r.ordinal===3).reason,'STALE_STUDENT_PAYLOAD');
});

test('renderer and existing-vector composition refuses mixed runtime certificates',t=>{
 const f=fixture(t);H.importExistingRenderer({...f.args(),write:true});
 const good=f.build().index,mixed=structuredClone(good),row=mixed.records.find(r=>r.questionUid===uid(2));
 row.existingVectorContinuityRef={path:'.archive-meta-register/4slot-existing-vector-continuity/'+uid(2)+'.json',sha256:'b'.repeat(64)};
 assert.throws(()=>C.createIndex(mixed),/FOUR_SLOT_EXISTING_VECTOR_REF_UNEXPECTED/);
 row.sourceBinding='EXISTING_REGISTERED_VECTOR_CONTINUITY';
 assert.throws(()=>C.createIndex(mixed),/FOUR_SLOT_SOURCE_BINDING_INVALID/);
});
test('renderer and existing-vector composition refuses two independently validated authorities',t=>{
 const f=fixture(t);H.importExistingRenderer({...f.args(),write:true});
 const adapter=require('../tools/4slot/existing-registered-vector-continuity.cjs'),original=adapter.verify;
 t.after(()=>{adapter.verify=original;});
 const sidecar=adapter.DIR+'/'+uid(2)+'.json';
 f.write(sidecar,{sourceArchiveFile:source.slice(14),questionUid:uid(2),sourceOrdinal:2});
 let calls=0;adapter.verify=(_root,entry)=>{calls++;return{ref:{path:entry.path,sha256:entry.sha256},observed:[]};};
 const built=f.build();assert.equal(calls,1);assert.deepEqual(built.index.records.map(r=>r.questionUid),[uid(1)]);
 assert.equal(built.index.pending.find(r=>r.ordinal===2).reason,'MULTIPLE_RENDERER_CONTINUITY_AUTHORITIES');
 assert.equal(built.index.pending.find(r=>r.ordinal===3).reason,'STALE_STUDENT_PAYLOAD');
});
