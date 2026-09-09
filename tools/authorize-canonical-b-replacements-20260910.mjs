import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const archive = path.join(root, 'archive', 'exams', 'original', 'high', 'h1');
function bankSpan(text){const marker=text.indexOf('window.questionBank');const open=text.indexOf('[',marker);let d=0,q=null;for(let i=open;i<text.length;i++){const c=text[i];if(q){if(c==='\\')i++;else if(c===q)q=null;continue;}if(c==='"'||c==="'"){q=c;continue;}if(c==='[')d++;else if(c===']'&&--d===0)return{open,close:i};}throw new Error('bank span');}
function load(text){const c={window:{}};vm.runInNewContext(text,c,{timeout:5000});return c.window.questionBank;}
function save(text,bank){const s=bankSpan(text);return text.slice(0,s.open)+'[\n'+bank.map(q=>JSON.stringify(q)).join(',\n')+'\n]'+text.slice(s.close+1);}
function walk(d,a=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())walk(f,a);else if(e.isFile()&&e.name.endsWith('.js'))a.push(f)}return a}
let files=0,questions=0;
for(const file of walk(archive)){
  const text=fs.readFileSync(file,'utf8'); let bank; try{bank=load(text)}catch{continue;}
  let touched=false;
  for(const q of bank){if(q.variantClass==='B'){q.productionAdoptionStatus='AUTHORIZED_BY_USER_REQUEST';q.productionOriginalActive=false;q.productionRecoveredActive=true;q.replacementDisposition='DERIVED_REPLACEMENT_CANONICAL';q.reviewStatus='B_DERIVED_CANONICAL_PROMOTED';touched=true;questions++;}}
  if(touched){fs.writeFileSync(file,save(text,bank),'utf8');files++;}
}
console.log(JSON.stringify({files,questions,status:'CANONICAL_B_AUTHORIZED'},null,2));
