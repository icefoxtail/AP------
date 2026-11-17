'use strict';

// Revision 2 is a new reconstruction from the published SVG7 UI and current
// production code. It does not inherit a local PASS from the lost workspace.
// The exact prior display, whole banks and actual runtime lookup remain bound;
// no mathematical, semantic, Native or vector authority is created here.
const crypto=require('node:crypto');
const {parseIndex,selectEntries}=require('./existing-vector-svg-index-continuity.cjs');
const SCHEMA='archive-svg7-derived-display-continuity-v2';
const CAPTURE='45e976a5981701bef9c755d50c11636116ee788f';
const TECHNICAL_REF=Object.freeze({commit:'b9bd24223d4e523db6577682c1a30e74c11d25db',
  path:'docs/operations/m2s1-svg7-source-repair-20261116/student-ui-technical-v3.json',
  gitBlobSha1:'06cf5c2b0e38e4113ddf1fdd519a31cfa5196f39',
  sha256:'c96dcff0275aeac68bb1cd527594ebf000b0ea36e7e7be4cec943e00d9303864',bytes:303157});
const INDEX_REF=Object.freeze({commit:CAPTURE,path:'archive/data/svg-accessibility-index.js',
  gitBlobSha1:'336b40d677ec4e44e179046f22fa777566f15e42',
  sha256:'24cfc360122f8a8ce7292bed979076dbdfa8153b93b27b78618e3d41870c79ff',bytes:5556055});
const RUNTIME_REF=Object.freeze({commit:CAPTURE,path:'archive/svg-accessibility.js',
  gitBlobSha1:'f8ad8adf08f3051a7cac241b54806209471cca63',
  sha256:'a2d75ee1c5b44ad70d74bf147464ad6af8ded3d56308ce25d7e0dce571b32e81',bytes:6746});
const TABLES=[
  {schema:'archive-question-metadata-v1',ref:{commit:CAPTURE,path:'archive/data/question_metadata.json',
    gitBlobSha1:'f705bba21cd6eaad71f9317cd55ee4ce85e187c7',
    sha256:'d31132c09f3d18ba31e22ff77d19a41f496dc6f528e62b8692776f404625bbce',bytes:72167163},
    wholeBankSha256:'21d9989bc03c918b9956b0bd5f5ac05d5edb9a1786d5d9bdd6f929de2b296c28'},
  {schema:'question-identity-map-v1',ref:{commit:CAPTURE,path:'archive/data/question_identity_map.json',
    gitBlobSha1:'24c9016c5910d188c5665f2f837d47dbd6ae3e77',
    sha256:'ec6938bd2ad20bad6242fb24f2be84c563ae047abd0e01bffec32e48e9d454f5',bytes:27938431},
    wholeBankSha256:'ef8095ad88fe0593f758ffd81cae98ed3435a325c65c818f08dc3c8028713cc3'}
];
const BANKS=new Map([
  ['original/middle/m2/1final/22_풍덕중_1학기_기말_중2_수학.js',25],
  ['original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js',24],
  ['original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js',26]
]);
const ROSTER=[
  ['E037-Q3','qid_v1_0d8f5786d2c658ae440bf814c83c4315e77c0730191a8bd95b038590d7383de6',3,25],
  ['E037-Q15','qid_v1_c603060d464e3e703b01951f2c54483636632d20c77bf61478f727ea08d8ced5',15,25],
  ['E045-Q15','qid_v1_43e1fda6dcb1db1c657a86ab1e7669b0990593a621a6c7399d1281ef2055f569',15,24],
  ['E045-Q24','qid_v1_cd19408eb02abc9397f6965a5ca108287df1438b377dd6e226da6fc09f0239fd',24,24],
  ['E048-Q11','qid_v1_44b23ef95477c89c7dba6fab78c6fb336ef51d834584a6bbefc925bcbca450ec',11,26],
  ['E048-Q13','qid_v1_c46f4f225979a329fa4f253bbb57f8cd2406fd68c7d5d8c1f73b05305af4c637',13,26],
  ['E048-Q24','qid_v1_70a5f39bf8c0af03c8e6eafde27e07239e9108c4d00c0863c10b00e8c632c1ad',24,26]
];
const stable=value=>JSON.stringify(value,(_,row)=>row&&typeof row==='object'&&!Array.isArray(row)
  ?Object.fromEntries(Object.keys(row).sort().map(key=>[key,row[key]])):row);
const eq=(a,b)=>stable(a)===stable(b);
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const blob=raw=>crypto.createHash('sha1').update('blob '+raw.length+'\0').update(raw).digest('hex');
const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
const projectionCache=new WeakMap();
function fail(code){throw Error('EXISTING_VECTOR_SVG7_DERIVED_'+code);}
function need(value,code){if(!value)fail(code);}
function one(rows,predicate,code){need(Array.isArray(rows),code);const found=rows.filter(predicate);need(found.length===1,code);return found[0];}
function pinned(readRef,ref){
  const raw=readRef(ref);
  need(Buffer.isBuffer(raw)&&raw.length===ref.bytes&&sha(raw)===ref.sha256&&blob(raw)===ref.gitBlobSha1,'IMMUTABLE_BYTES');
  return raw;
}

// Selection alone grants no authority. The verifier below derives this from
// observed bytes and compares every own field to the pinned original tables.
function selectWholeBankRows(document,schema){
  need(['archive-question-metadata-v1','question-identity-map-v1'].includes(schema)&&object(document)&&
    document.schemaVersion===schema&&Array.isArray(document.records)&&document.records.every(object),'TABLE_SCHEMA');
  const rows=document.records.filter(row=>BANKS.has(row.sourceArchiveFile));
  need(rows.length===75,'WHOLE_BANK_DENOMINATOR');
  const uids=new Set(rows.map(row=>row.questionUid));
  need(uids.size===75&&[...uids].every(uid=>/^qid_v1_[a-f0-9]{64}$/.test(uid)),'WHOLE_BANK_UIDS');
  const uses=new Map([...uids].map(uid=>[uid,0]));
  for(const row of document.records)if(uses.has(row.questionUid))uses.set(row.questionUid,uses.get(row.questionUid)+1);
  need([...uses.values()].every(count=>count===1),'GLOBAL_UID_DUPLICATE');
  for(const [source,count] of BANKS){
    const bank=rows.filter(row=>row.sourceArchiveFile===source).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal);
    need(bank.length===count&&bank.every((row,index)=>row.sourceOrdinal===index+1),'BANK_ORDINALS');
  }
  return rows.slice().sort((a,b)=>a.questionUid.localeCompare(b.questionUid));
}

// Decode records individually. Retain only the complete three banks and a
// global UID count, rather than a second decoded global metadata/identity file.
function projectTableRows(raw,schema){
  need(Buffer.isBuffer(raw)&&raw.length>0,'CURRENT_TABLE_BYTES');
  let position=0,globalRecordCount=0,foundRecords=false,foundSchema;
  const selected=[],uses=new Map(),keys=new Set(),decoder=new TextDecoder('utf-8',{fatal:true});
  const white=byte=>byte===32||byte===9||byte===10||byte===13;
  const skip=()=>{while(position<raw.length&&white(raw[position]))position++;};
  const peek=()=>{skip();return raw[position];};
  const take=byte=>{skip();need(raw[position]===byte,'TABLE_JSON');position++;};
  function value(){
    skip();const start=position,first=raw[position];need(first!==undefined,'TABLE_JSON');
    if(first===123||first===91){
      const stack=[];let quoted=false,escaped=false;
      while(position<raw.length){
        const byte=raw[position++];
        if(quoted){if(escaped)escaped=false;else if(byte===92)escaped=true;else if(byte===34)quoted=false;continue;}
        if(byte===34){quoted=true;continue;}
        if(byte===123||byte===91)stack.push(byte);
        else if(byte===125||byte===93){need(stack.pop()===(byte===125?123:91),'TABLE_JSON');if(!stack.length)break;}
      }
      need(!stack.length&&!quoted,'TABLE_JSON');
    }else if(first===34){
      position++;let closed=false,escaped=false;
      while(position<raw.length){const byte=raw[position++];if(escaped)escaped=false;else if(byte===92)escaped=true;else if(byte===34){closed=true;break;}}
      need(closed,'TABLE_JSON');
    }else while(position<raw.length&&!white(raw[position])&&![44,93,125].includes(raw[position]))position++;
    need(position>start,'TABLE_JSON');
    try{return JSON.parse(decoder.decode(raw.subarray(start,position)));}catch{fail('TABLE_JSON');}
  }
  take(123);
  while(peek()!==125){
    const key=value();need(typeof key==='string'&&!keys.has(key),'TABLE_JSON');keys.add(key);take(58);
    if(key==='records'){
      foundRecords=true;take(91);
      while(peek()!==93){
        const row=value();need(object(row),'TABLE_SCHEMA');globalRecordCount++;
        uses.set(row.questionUid,(uses.get(row.questionUid)||0)+1);
        if(BANKS.has(row.sourceArchiveFile))selected.push(row);
        if(peek()===44){take(44);need(peek()!==93,'TABLE_JSON');}else need(peek()===93,'TABLE_JSON');
      }
      take(93);
    }else{const member=value();if(key==='schemaVersion')foundSchema=member;}
    if(peek()===44){take(44);need(peek()!==125,'TABLE_JSON');}else need(peek()===125,'TABLE_JSON');
  }
  take(125);skip();need(position===raw.length&&foundRecords,'TABLE_JSON');
  const rows=selectWholeBankRows({schemaVersion:foundSchema,records:selected},schema);
  need(rows.every(row=>uses.get(row.questionUid)===1),'GLOBAL_UID_DUPLICATE');
  return {rows,globalRecordCount};
}
function project(raw,schema){
  need(Buffer.isBuffer(raw)&&raw.length>0,'CURRENT_TABLE_BYTES');
  const digest=sha(raw),cached=projectionCache.get(raw);
  if(cached&&cached.digest===digest&&cached.schema===schema)return cached;
  const {rows,globalRecordCount}=projectTableRows(raw,schema);
  need(globalRecordCount===28890,'GLOBAL_TABLE_DENOMINATOR');
  const result={digest,schema,rows,wholeBankSha256:sha(stable(rows))};projectionCache.set(raw,result);return result;
}

function verifySvg7DerivedContinuity({technical,technicalRef,readRef,readLiveRef,readCurrentFile,
  questionUid,sourceOrdinal,surface,sourceRef,assetRefs}){
  need(surface==='PROBLEM'&&ROSTER.some(row=>row[1]===questionUid&&row[2]===sourceOrdinal),'EXACT_SEVEN_PROBLEMS');
  need(eq(technicalRef,TECHNICAL_REF),'TECHNICAL_REF');
  need(typeof readRef==='function'&&typeof readLiveRef==='function'&&typeof readCurrentFile==='function','READERS');
  const sealed=JSON.parse(pinned(readRef,TECHNICAL_REF));
  need(eq(technical,sealed)&&sealed.checkoutCommit===CAPTURE&&sealed.items.length===7&&
    sealed.servedFiles.length===99&&new Set(sealed.servedFiles.map(ref=>ref.path)).size===99,'SEALED_TECHNICAL');
  need(eq(one(sealed.servedFiles,ref=>ref.path===INDEX_REF.path,'INDEX_REF'),INDEX_REF)&&
    eq(one(sealed.servedFiles,ref=>ref.path===RUNTIME_REF.path,'RUNTIME_REF'),RUNTIME_REF),'CAPTURED_RUNTIME_REFS');
  pinned(readRef,RUNTIME_REF);readLiveRef(RUNTIME_REF);
  const allAssets=[],sources=new Set();
  for(const [key,uid,ordinal,count] of ROSTER){
    const item=one(sealed.items,row=>row.questionUid===uid&&row.sourceOrdinal===ordinal,'ITEM');
    const source=item.sourceRef?.path?.replace(/^archive\/exams\//,'');
    need(item.key===key&&item.expectedBankCount===count&&BANKS.get(source)===count&&
      item.sourceRef.commit===CAPTURE&&item.assetRef?.commit===CAPTURE,'ITEM_BINDING');
    pinned(readRef,item.sourceRef);pinned(readRef,item.assetRef);readLiveRef(item.sourceRef);readLiveRef(item.assetRef);
    allAssets.push(item.assetRef);sources.add(source);
    if(uid===questionUid)need(eq(sourceRef,item.sourceRef)&&eq(assetRefs,[item.assetRef]),'SELECTED_BINDING');
  }
  need(sources.size===3&&new Set(allAssets.map(ref=>ref.path)).size===7,'SOURCE_ASSET_INVENTORY');
  const tableBindings=[];
  for(const table of TABLES){
    const ref=table.schema==='question-identity-map-v1'?sealed.identityRef:one(sealed.servedFiles,row=>row.path===table.ref.path,'METADATA_REF');
    need(eq(ref,table.ref),'CAPTURED_TABLE_REF');
    const before=project(pinned(readRef,table.ref),table.schema),current=project(readCurrentFile(table.ref.path),table.schema);
    need(before.wholeBankSha256===table.wholeBankSha256&&current.wholeBankSha256===table.wholeBankSha256&&
      eq(before.rows,current.rows),'WHOLE_75_TABLE_ROWS_CHANGED');
    tableBindings.push({path:table.ref.path,currentRawSha256:current.digest,wholeBankSha256:current.wholeBankSha256});
  }
  const oldRaw=pinned(readRef,INDEX_REF),currentRaw=readCurrentFile(INDEX_REF.path);
  need(Buffer.isBuffer(currentRaw)&&currentRaw.length>0,'CURRENT_INDEX_BYTES');
  const before=parseIndex(oldRaw),current=parseIndex(currentRaw);
  const beforeEntries=selectEntries(before,allAssets),currentEntries=selectEntries(current,allAssets);
  need(beforeEntries.length===0&&eq(beforeEntries,currentEntries),'CONSUMED_INDEX_RECORDS_CHANGED');
  return {schemaVersion:SCHEMA,indexPath:INDEX_REF.path,currentIndexSha256:sha(currentRaw),selectedQuestionCount:7,
    sourceBankCount:3,wholeMetadataRows:75,wholeIdentityRows:75,consumedRecordCount:0,tableBindings,
    assertCapturedIndexRef(ref){need(eq(ref,INDEX_REF),'EXACT_INDEX_REF_ONLY');return currentRaw;}};
}
module.exports={SCHEMA,verifySvg7DerivedContinuity,selectWholeBankRows,projectTableRows};
