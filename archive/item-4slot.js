/* Read-only 4slot consumer. It does not modify Archive2 approval or exam eligibility. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ArchiveItem4Slot=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SLOTS=['given','goal','method','condition'];
  function createIndex(data){
    if(data?.schemaVersion!=='archive-item-4slot-runtime-v1'||!Array.isArray(data.records))throw Error('FOUR_SLOT_INDEX_INVALID');
    const byUid=new Map(),postings=new Map();
    for(const value of data.records){
      const r=JSON.parse(JSON.stringify(value));
      if(!/^qid_v1_[a-f0-9]{64}$/.test(r.questionUid)||byUid.has(r.questionUid)||r.registrationStatus!=='REGISTERED')throw Error('FOUR_SLOT_RECORD_INVALID');
      if(!['EXACT_BLOB','UNCHANGED_STUDENT_PAYLOAD'].includes(r.sourceBinding))throw Error('FOUR_SLOT_SOURCE_BINDING_INVALID');
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
