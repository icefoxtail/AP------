import crypto from 'node:crypto';

const sha256=value=>'sha256:'+crypto.createHash('sha256').update(value).digest('hex');
const mathTokens=value=>value.match(/\\[A-Za-z]+|[A-Za-z]+|\d+|[^\s]/g)||[];
const textTokens=value=>[...value].filter(char=>!/\s/u.test(char));

export function compareSolutionTokenParity(original,patched){
 if(typeof original!=='string'||typeof patched!=='string')throw Error('SOLUTION_TEXT_REQUIRED');
 const extract=value=>{
  const math=[],text=[];let cursor=0,blockCount=0;const pattern=/\$([^$]*)\$/g;let match;
  while((match=pattern.exec(value))){
   text.push(value.slice(cursor,match.index));math.push(...mathTokens(match[1]));cursor=pattern.lastIndex;blockCount++;
  }
  const tail=value.slice(cursor);
  if((value.match(/\$/g)||[]).length!==blockCount*2)throw Error('UNBALANCED_MATH_DELIMITER');
  text.push(tail);
  return{text:textTokens(text.join('')),math};
 };
 const before=extract(original),after=extract(patched);
 const textEqual=JSON.stringify(before.text)===JSON.stringify(after.text),mathEqual=JSON.stringify(before.math)===JSON.stringify(after.math);
 return{status:textEqual&&mathEqual?'PASS':'FAIL',textTokenParity:textEqual,mathTokenParity:mathEqual,originalTextTokenSha256:sha256(before.text.join('')),patchedTextTokenSha256:sha256(after.text.join('')),originalMathTokenSha256:sha256(before.math.join('\u001f')),patchedMathTokenSha256:sha256(after.math.join('\u001f')),originalMathTokenCount:before.math.length,patchedMathTokenCount:after.math.length};
}

export function bindNativeSolutionOverlayCandidate(evidence,candidateRef){
 if(!evidence||typeof evidence!=='object'||Array.isArray(evidence)||Object.hasOwn(evidence,'candidateRef'))throw Error('NATIVE_OVERLAY_EVIDENCE_INVALID');
 if(!candidateRef||typeof candidateRef.path!=='string'||!candidateRef.path.endsWith('.js')||!Number.isSafeInteger(candidateRef.bytes)||candidateRef.bytes<0||typeof candidateRef.sha256!=='string'||!/^sha256:[a-f0-9]{64}$/.test(candidateRef.sha256))throw Error('NATIVE_OVERLAY_CANDIDATE_REF_REQUIRED');
 return{...evidence,candidateRef};
}
