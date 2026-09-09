import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const base = '23_여천고_2학기_중간_고1_기출';
const files = [
  path.join(root, 'archive', 'exams', 'original', 'high', 'h1', '2mid', `${base}.js`),
  path.join(root, 'archive', '_generated', 'nightly-h1-2sem', '20260908', 'packages', `${base}_EXTERNAL_REVIEW`, `${base}.js`),
];
function span(text){const marker=text.indexOf('window.questionBank');const open=text.indexOf('[',marker);let d=0,q=null;for(let i=open;i<text.length;i++){const c=text[i];if(q){if(c==='\\')i++;else if(c===q)q=null;continue;}if(c==='"'||c==="'"){q=c;continue;}if(c==='[')d++;else if(c===']'&&--d===0)return{open,close:i};}throw new Error('bank span');}
for(const file of files){const text=fs.readFileSync(file,'utf8');const c={window:{}};vm.runInNewContext(text,c,{timeout:5000});for(const q of c.window.questionBank||[]){if(q.sourceQuestionNo==='14'){q.image='assets/images/23_여천고_2학기_중간_고1_기출/q014.png';q.visualAsset=q.image;}if(q.sourceQuestionNo==='서술형3'){q.image='assets/images/23_여천고_2학기_중간_고1_기출/q021.png';q.visualAsset=q.image;}}const s=span(text);const next=text.slice(0,s.open)+'[\n'+c.window.questionBank.map(q=>JSON.stringify(q)).join(',\n')+'\n]'+text.slice(s.close+1);fs.writeFileSync(file,next,'utf8');console.log(file);}
