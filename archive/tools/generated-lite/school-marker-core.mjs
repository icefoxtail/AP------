// School-marker pilot: read-only projection, no production Archive2 integration.
// Quality flags fail closed; generated questions cannot enter a paper until independently approved.
function l3Key(c) {
 if(!c||!c.curriculum||!c.course||!c.l1||!c.l3)return null;
 return [c.curriculum,c.course,c.l1,c.l3].join("::");
}

function stableSeed(text){
 let h=2166136261>>>0;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return ("00000000"+h.toString(16)).slice(-8);
}

function buildReadModel({examUid,sourceArchiveFile,sourceBlobSha,originalQuestions,generatedCandidates}){
 if(!examUid||!sourceArchiveFile||!sourceBlobSha)throw Error("MISSING_SOURCE_IDENTITY");
 const slots=originalQuestions.map(q=>({slotKey:examUid+"#"+q.id,sourceQid:q.id,sourceArchiveFile,sourceBlobSha,course:q.standardCourse,l1:q.standardUnitKey,l2:q.subUnitKey||null,l3SharedKey:null,questionType:q.questionType,originalDifficultyBucket:Number.isInteger(q.difficultyBucket)?q.difficultyBucket:null}));
 if(new Set(slots.map(x=>x.sourceQid)).size!==slots.length)throw Error("DUPLICATE_SOURCE_QID");
 const uids=new Set(),l3Index={},sourceSlotIndex={};
 for(const s of slots)sourceSlotIndex[s.slotKey]=[];
 const candidates=generatedCandidates.map(c=>{
  if(uids.has(c.uid))throw Error("DUPLICATE_GENERATED_UID "+c.uid);uids.add(c.uid);
  if(!sourceSlotIndex[examUid+"#"+c.sourceQid])throw Error("SOURCE_SLOT_MISSING "+c.uid);
  const key=l3Key(c);if(!key)throw Error("UNRESOLVED_L3 "+c.uid);
  const row={...c,l3SharedKey:key,independentMathPassed:false,curriculumGatePassed:false,rendererPassed:false,supplyApproved:false,replacementSlotApprovals:[],status:"AUTHOR_CANDIDATE"};
  (l3Index[key] ||= []).push(c.uid);sourceSlotIndex[examUid+"#"+c.sourceQid].push(c.uid);
  return row;
 });
 for(const values of [...Object.values(l3Index),...Object.values(sourceSlotIndex)])values.sort();
 return {schemaVersion:"ALIVE_LITE_MARKER_READ_MODEL_v0.1",sourceExamUid:examUid,sourceArchiveFile,sourceBlobSha,slots,candidates,l3Index,sourceSlotIndex,eligibility:candidates.map(c=>({uid:c.uid,status:"UNASSESSED",eligibleSlotKeys:[]}))};
}

function searchSameL3(model,probe,{includeUnverified=false}={}){
 const key=typeof probe==="string"?probe:l3Key(probe);
 const ids=new Set(model.l3Index[key]||[]);
 return model.candidates.filter(c=>ids.has(c.uid)&&(includeUnverified||(c.independentMathPassed&&c.curriculumGatePassed&&c.rendererPassed&&c.supplyApproved))).sort((a,b)=>a.uid.localeCompare(b.uid));
}

function replacementChoices(slot,pool,{mode="SCHOOL_BALANCED",used=new Set(),avoid=new Set(),blueprints=new Set()}={}){
 if(!slot.l3SharedKey||!Number.isInteger(slot.originalDifficultyBucket))return [];
 return pool.filter(c=>c.curriculum==="2022"&&c.course===slot.course&&c.l3SharedKey===slot.l3SharedKey&&c.questionType===slot.questionType&&
 c.independentMathPassed===true&&c.curriculumGatePassed===true&&c.rendererPassed===true&&c.supplyApproved===true&&
 Array.isArray(c.replacementSlotApprovals)&&c.replacementSlotApprovals.includes(slot.slotKey)&&
 Number.isInteger(c.difficultyBucket)&&c.difficultyBucket>=1&&c.difficultyBucket<=5&&
 (mode==="L3_EXPANDED"||Math.abs(c.difficultyBucket-slot.originalDifficultyBucket)<=1)&&
 !used.has(c.uid)&&!avoid.has(c.uid)&&(!c.blueprint||!blueprints.has(c.blueprint))
 ).sort((a,b)=>a.uid.localeCompare(b.uid));
}

function generatePilotPaper({model,seed="hyocheon-001",mode="SCHOOL_BALANCED",fallback="KEEP_ORIGINAL",slots=model.slots,avoidUids=[]}){
 if(!["SCHOOL_BALANCED","L3_EXPANDED"].includes(mode))throw Error("BAD_MODE");
 if(!["KEEP_ORIGINAL","UNFILLED_REPORT"].includes(fallback))throw Error("BAD_FALLBACK");
 const used=new Set(),blueprints=new Set(),avoid=new Set(avoidUids),placements=[];
 for(const slot of slots){
  const pool=replacementChoices(slot,model.candidates,{mode,used,avoid,blueprints});
  if(pool.length===0){placements.push({slotKey:slot.slotKey,sourceQid:slot.sourceQid,assignment:fallback==="KEEP_ORIGINAL"?"ORIGINAL":"UNFILLED",sourceArchiveFile:fallback==="KEEP_ORIGINAL"?slot.sourceArchiveFile:null,reason:"NO_QUALIFIED_REPLACEMENT"});continue;}
  const c=pool[parseInt(stableSeed(seed+"|"+slot.slotKey),16)%pool.length];
  used.add(c.uid);if(c.blueprint)blueprints.add(c.blueprint);
  placements.push({slotKey:slot.slotKey,sourceQid:slot.sourceQid,assignment:"GENERATED",uid:c.uid,revision:c.revision,shard:c.shard,qid:c.qid,studentQuestion:c.studentQuestion});
 }
 const frozen={exam:model.sourceExamUid,sourceBlobSha:model.sourceBlobSha,seed,mode,fallback,slots:placements.map(s=>({slotKey:s.slotKey,assignment:s.assignment,uid:s.uid||null,revision:s.revision||null}))};
 return {schemaVersion:"ALIVE_LITE_PAPER_PREVIEW_v0.1",previewOnly:true,seed,mode,fallback,paperRevision:"pilot-"+stableSeed(JSON.stringify(frozen)),slots:placements,counts:{total:placements.length,replaced:placements.filter(s=>s.assignment==="GENERATED").length,originalKept:placements.filter(s=>s.assignment==="ORIGINAL").length,unfilled:placements.filter(s=>s.assignment==="UNFILLED").length}};
}
export {l3Key,stableSeed,buildReadModel,searchSameL3,replacementChoices,generatePilotPaper};
