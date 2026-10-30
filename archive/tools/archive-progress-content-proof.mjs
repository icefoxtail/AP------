import crypto from 'node:crypto';
const HEX=/^[0-9a-f]{40}$/;
export const REGISTRY_FILES=['archive/db.js','archive/question-index.js','archive/question-identity.js',
 'archive/question-index-report.md','archive/question-index-audit.md',
 'archive/data/archive2-catalog.json','archive/data/archive2-crosswalk-inventory.json',
 'archive/data/question_metadata.json',
 'archive/data/archive2-canonical-input-manifest.json','archive/data/archive2-canonical-projection-policy.json',
 'archive/data/archive2-item-review-overrides.json','archive/data/basic-scope-parent-links.json'];
export const sha256=items=>crypto.createHash('sha256').update([...items].sort().join('\n')).digest('hex');
export function proofFromBlobs(files){
 const exams={},registryFiles=[...REGISTRY_FILES,...Object.keys(files).filter(f=>f.startsWith('archive/data/meta-foundation/runtime/')&&f.endsWith('.json'))];
 const registry=sha256(registryFiles.map(f=>f+' '+(files[f]||'MISSING')));
 for(const [f,sha] of Object.entries(files)){
  if(!HEX.test(sha))continue;
  if(f.startsWith('archive/exams/')&&f.endsWith('.js')){
   const id=f.split('/').at(-1).slice(0,-3);
   const exam=exams[id] ||= {source:'',assets:''};
   if(exam.source && exam.source!==sha)exam.ambiguous=true;
   else exam.source=sha;
  }
  if(f.startsWith('archive/assets/images/')){
   const id=f.slice('archive/assets/images/'.length).split('/')[0];
   const exam=exams[id] ||= {source:'',assets:''};
   (exam._assets||=[]).push(f+' '+sha);
  }
 }
 for(const e of Object.values(exams)){
  e.assets=sha256(e._assets||[]);
  if(e.ambiguous)e.source='';
  delete e._assets;delete e.ambiguous;
 }
 return {registry,exams};
}
