/* Read-only 4slot consumer. It does not modify Archive2 approval or exam eligibility. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ArchiveItem4Slot=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SLOTS=['given','goal','method','condition'];
  const M1S2_PROBLEM_SUBJECTS=new Map([["qid_v1_dda907fccf6844e209f2f909dacdb1ea30f2d76c258a72b76fd246c3655f4140",["original/middle/m1/2final/24_향림중_2학기_기말_중1_기출.js",13]],["qid_v1_b0046185c909143e8665ec134015703f04e8b0d17904e06717055b7771e63e15",["original/middle/m1/2final/25_팔마중_2학기_기말_중1_기출.js",17]],["qid_v1_a989f82a87d00dc1ec8c7d552fa21572235abfe58518c41fc7f95001ec9d689e",["original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js",18]],["qid_v1_7f4235f2620956516dfafbb36f1947f7edfe47aef1292379105eb747ba511fe3",["original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js",19]],["qid_v1_04a3307fa2f22f54255d293e5f2159fec8ae31d99a2c3188c242dd96b710d6e6",["original/middle/m1/2mid/23_향림중_2학기_중간_중1_기출.js",6]],["qid_v1_ebdae8cefdff3298308be0484ffbfd39d3a23075360265b27fd7b43f25af0b9c",["original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",6]],["qid_v1_0292dec1b0304cd70882882526d8b57b86e2ab60a53d14a7c6aadcbc3e1f2246",["original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",8]]]);
  function createIndex(data){
    if(data?.schemaVersion!=='archive-item-4slot-runtime-v1'||!Array.isArray(data.records))throw Error('FOUR_SLOT_INDEX_INVALID');
    const byUid=new Map(),postings=new Map();
    for(const value of data.records){
      const r=JSON.parse(JSON.stringify(value));
      if(!/^qid_v1_[a-f0-9]{64}$/.test(r.questionUid)||byUid.has(r.questionUid)||r.registrationStatus!=='REGISTERED')throw Error('FOUR_SLOT_RECORD_INVALID');
      if(!['EXACT_BLOB','UNCHANGED_STUDENT_PAYLOAD','REGISTERED_RENDERER_CONTINUITY','SCOPED_REVIEWED_RENDERER','EXISTING_REGISTERED_VECTOR_CONTINUITY','M1S2_PROBLEM_RENDERER_CONTINUITY','M3S2_EXISTING_LAYOUT_CONTINUITY'].includes(r.sourceBinding))throw Error('FOUR_SLOT_SOURCE_BINDING_INVALID');
      if(r.sourceBinding==='REGISTERED_RENDERER_CONTINUITY'){
        const ref=r.rendererContinuityRef;
        if(!ref||typeof ref!=='object'||Array.isArray(ref)||Object.keys(ref).sort().join(',')!=='path,sha256'||
           typeof ref.path!=='string'||!ref.path.startsWith('.archive-meta-register/4slot-renderer-continuity/')||!ref.path.endsWith('.json')||
           /[\\\x00-\x1f]/.test(ref.path)||ref.path.split('/').some(p=>!p||p==='.'||p==='..')||
           typeof ref.sha256!=='string'||!/^[a-f0-9]{64}$/.test(ref.sha256)||r.independentReviewClaim!==false)throw Error('FOUR_SLOT_RENDERER_CONTINUITY_REF_INVALID');
        Object.freeze(ref);
      }else if(Object.hasOwn(r,'rendererContinuityRef'))throw Error('FOUR_SLOT_RENDERER_CONTINUITY_REF_UNEXPECTED');
      if(r.sourceBinding==='SCOPED_REVIEWED_RENDERER'){
        const e=r.rendererReceipt;
        if(!/^original\/middle\/m3\/2(?:mid|final)\//.test(r.sourceArchiveFile||'')||
           !e||Object.keys(e).sort().join(',')!=='path,schemaVersion,sha256'||
           e.schemaVersion!=='archive-4slot-existing-typed-v2-renderer-receipt-v1'||
           !/^archive\/data\/item-4slot-renderer-receipts\/v1\/[A-Za-z0-9_-]+\.json$/.test(e.path||'')||
           !/^[a-f0-9]{64}$/.test(e.sha256||''))throw Error('FOUR_SLOT_RENDERER_RECEIPT_INVALID');
        Object.freeze(e);
      }else if(Object.hasOwn(r,'rendererReceipt'))throw Error('FOUR_SLOT_SOURCE_BINDING_INVALID');
      if(r.sourceBinding==='EXISTING_REGISTERED_VECTOR_CONTINUITY'){
        const ref=r.existingVectorContinuityRef;
        if(!ref||typeof ref!=='object'||Array.isArray(ref)||Object.keys(ref).sort().join(',')!=='path,sha256'||
           ref.path!=='.archive-meta-register/4slot-existing-vector-continuity/'+r.questionUid+'.json'||
           typeof ref.sha256!=='string'||!/^[a-f0-9]{64}$/.test(ref.sha256)||r.independentReviewClaim!==false)throw Error('FOUR_SLOT_EXISTING_VECTOR_REF_INVALID');
        Object.freeze(ref);
      }else if(Object.hasOwn(r,'existingVectorContinuityRef'))throw Error('FOUR_SLOT_EXISTING_VECTOR_REF_UNEXPECTED');
      if(r.sourceBinding==='M1S2_PROBLEM_RENDERER_CONTINUITY'){
        const ref=r.m1ProblemContinuityRef,subject=M1S2_PROBLEM_SUBJECTS.get(r.questionUid);
        if(!ref||typeof ref!=='object'||Array.isArray(ref)||Object.keys(ref).sort().join(',')!=='path,sha256'||
           !subject||r.sourceArchiveFile!==subject[0]||r.sourceOrdinal!==subject[1]||
           ref.path!=='.archive-meta-register/4slot-m1s2-problem-renderer-continuity/'+r.questionUid+'.json'||
           typeof ref.sha256!=='string'||!/^[a-f0-9]{64}$/.test(ref.sha256)||r.independentReviewClaim!==false)throw Error('FOUR_SLOT_M1S2_PROBLEM_CONTINUITY_REF_INVALID');
        Object.freeze(ref);
      }else if(Object.hasOwn(r,'m1ProblemContinuityRef'))throw Error('FOUR_SLOT_M1S2_PROBLEM_CONTINUITY_REF_UNEXPECTED');
      if(r.sourceBinding==='M3S2_EXISTING_LAYOUT_CONTINUITY'){
        const ref=r.layoutContinuityRef;
        if(r.questionUid!=='qid_v1_0ec5ac5da3b680c3a3e688406be0da91045d4ea581a83b6ec224927defe57bdf'||
           r.sourceArchiveFile!=='original/middle/m3/2final/25_풍덕중_2학기_기말_중3_기출.js'||r.sourceOrdinal!==16||
           !ref||typeof ref!=='object'||Array.isArray(ref)||Object.keys(ref).sort().join(',')!=='path,sha256'||
           ref.path!=='.archive-meta-register/4slot-m3s2-layout-continuity/'+r.questionUid+'.json'||
           typeof ref.sha256!=='string'||!/^[a-f0-9]{64}$/.test(ref.sha256)||r.independentReviewClaim!==false)
          throw Error('FOUR_SLOT_M3S2_LAYOUT_REF_INVALID');
        Object.freeze(ref);
      }else if(Object.hasOwn(r,'layoutContinuityRef'))throw Error('FOUR_SLOT_M3S2_LAYOUT_REF_UNEXPECTED');
      for(const s of SLOTS){if(!Array.isArray(r[s])||r[s].some(id=>!Number.isInteger(id))||new Set(r[s]).size!==r[s].length)throw Error('FOUR_SLOT_ARRAY_REQUIRED');Object.freeze(r[s]);for(const id of r[s]){const key=JSON.stringify([r.dictionaryVersion,s,id]);if(!postings.has(key))postings.set(key,new Set());postings.get(key).add(r.questionUid);}}
      if(Array.isArray(r.candidates))Object.freeze(r.candidates);
      byUid.set(r.questionUid,Object.freeze(r));
    }
    return Object.freeze({size:byUid.size,get:uid=>byUid.get(uid)||null,hasTerm:(uid,slot,id,version)=>postings.get(JSON.stringify([version,slot,id]))?.has(uid)||false,find(query,{dictionaryVersion}={}){
      if(!dictionaryVersion)throw Error('FOUR_SLOT_DICTIONARY_REQUIRED');
      let matching=null;
      for(const [slot,terms]of Object.entries(query)){if(!SLOTS.includes(slot)||!Array.isArray(terms)||terms.some(x=>!Number.isInteger(x)))throw Error('FOUR_SLOT_QUERY_INVALID');for(const id of terms){const set=postings.get(JSON.stringify([dictionaryVersion,slot,id]))||new Set();matching=matching===null?new Set(set):new Set([...matching].filter(uid=>set.has(uid)));}}
      return [...(matching||byUid.keys())].map(uid=>byUid.get(uid)).filter(r=>r.dictionaryVersion===dictionaryVersion);
    }});
  }
  async function load(url='data/item-4slot-index.json',fetcher){
    const request=fetcher||(typeof fetch==='function'?fetch:null);if(!request)throw Error('FOUR_SLOT_FETCH_UNAVAILABLE');
    const response=await request(url,{cache:'no-cache'});if(!response.ok)throw Error('FOUR_SLOT_FETCH_FAILED:'+response.status);return createIndex(await response.json());
  }
  return Object.freeze({createIndex,load});
});
