'use strict';
// Test-side adapter only. The production full-file validator and immutable
// negative-history reader decide eligibility; an item marker never grants it.
const fs=require('node:fs');
const runtime=require('../../tools/4slot/build-4slot-runtime.cjs');
const negative=require('../../tools/4slot/current-renderer-negative-hold.cjs');
const studentFields=['id','number','questionType','content','question','choices','answer','solution','image','images','figureSvg','svg','solutionImage','solutionImages','solutionFigureSvg'];
const stable=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
// Same raw local-asset inventory as the builder, without fetching remote assets.
function assetRefs(q){
  const found=new Set(),text=JSON.stringify(Object.fromEntries(studentFields.map(k=>[k,q[k]??null]))).replaceAll('\\/','/');
  for(const m of text.matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi))found.add(m[0].startsWith('archive/')?m[0]:'archive/'+m[0]);
  return [...found].sort();
}
function createCurrentNegativeContext(root,identity){
  const hp={safe:runtime.safe,sha:runtime.sha,blob:runtime.blob,stable,payloadHash:runtime.payloadHash,identityHash:runtime.identityHash,assetRefs,loadBank:runtime.loadBank,identity,studentFields};
  const obligation=negative.createObligationReader(root,hp);
  return (data,dictionary)=>{
    const context={currentRendererNegativeValidated:false};
    try{
      const raw=fs.readFileSync(runtime.safe(root,'archive/exams/'+data.sourceArchiveFile));
      const required=obligation(data,runtime.blob(raw));
      if(required.errors.length)return {errors:required.errors,context};
      if(!negative.has(data))return {errors:[],context};
      const errors=negative.validateFile(root,data,{...hp,dictionary});
      if(errors.length)return {errors,context};
      return {errors:[],context:{currentRendererNegativeValidated:true}};
    }catch(error){return {errors:['CURRENT_RENDERER_HOLD_DATA_CHECK:'+error.message],context};}
  };
}
module.exports={createCurrentNegativeContext};
