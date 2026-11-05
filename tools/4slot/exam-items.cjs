// Read source schemas without changing their raw IDs or inventing display numbers.
const fs = require('fs'), vm = require('vm');
function sourceNumber(q) {
  const positive = v => (typeof v === 'number' || (typeof v === 'string' && /^\d+$/.test(v))) && Number.isInteger(Number(v)) && Number(v) > 0 ? Number(v) : null;
  const id = positive(q.id), number = positive(q.number);
  if (id !== null && number !== null && id !== number) throw Error('AMBIGUOUS_SOURCE_NUMBER');
  const n = id ?? number;
  if (n === null) throw Error('SOURCE_NUMBER_MISSING');
  return n;
}
function sourceIdentityNumber(q) { return String(q.id ?? q.number ?? ''); }
function loadExam(file) {
  const ctx = { window: {}, console: { log(){},warn(){},error(){} } };ctx.globalThis=ctx;
  vm.createContext(ctx,{codeGeneration:{strings:false,wasm:false}});
  vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file,timeout:3000});
  const w=ctx.window, bank=w.questionBank||w.questions||ctx.questionBank||ctx.questions||w.examData?.questions;
  if(!Array.isArray(bank))throw Error('UNKNOWN_EXAM_SCHEMA '+file);
  const seen=new Set();
  return bank.map(q=>{
    const ordinal=sourceNumber(q);if(seen.has(ordinal))throw Error('DUPLICATE_SOURCE_NUMBER');seen.add(ordinal);
    return {ordinal,sourceId:sourceIdentityNumber(q),aliases:[...new Set([ordinal,q.id,q.number].filter(x=>x!=null).map(String))],stem:q.content||q.question||'',choices:Array.isArray(q.choices)?q.choices:[],solution:q.solution||'',image:q.image||null};
  });
}
function itemLookup(exam) {
  const map=new Map();
  for(const q of exam)for(const key of q.aliases||[String(q.ordinal)]) {
    if(map.has(String(key))&&map.get(String(key))!==q)throw Error('AMBIGUOUS_SOURCE_ALIAS:'+key);
    map.set(String(key),q);
  }
  return map;
}
module.exports={loadExam,sourceNumber,sourceIdentityNumber,itemLookup};
if(require.main===module){const[f,a,b]=process.argv.slice(2);for(const q of loadExam(f)){if(a&&q.ordinal<+a)continue;if(b&&q.ordinal>+b)continue;console.log(`=== ${q.ordinal}`);console.log('Q: '+q.stem);if(q.choices.length)console.log('C: '+q.choices.map((c,i)=>`${i+1}) ${c}`).join(' | '));console.log('S: '+q.solution);if(q.image)console.log('IMG: '+JSON.stringify(q.image));}}
