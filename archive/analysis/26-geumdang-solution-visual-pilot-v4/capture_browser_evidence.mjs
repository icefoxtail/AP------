import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(here,'../../..');
const svgDir=path.join(repo,'archive/assets/images/26_금당고_2학기_중간_고1_기출');
const qids=[3,5,9,10,11,12,13,14,15,16,17,18,20];

function exists(p){try{return !!p&&fs.existsSync(p);}catch{return false;}}
function discoverChrome(){
  if(exists(process.env.GEOMETRY_BROWSER_EXECUTABLE))return process.env.GEOMETRY_BROWSER_EXECUTABLE;
  const candidates=process.platform==='win32'
    ? [
        path.join(process.env.PROGRAMFILES||'','Google/Chrome/Application/chrome.exe'),
        path.join(process.env['PROGRAMFILES(X86)']||'','Google/Chrome/Application/chrome.exe'),
        path.join(process.env.LOCALAPPDATA||'','Google/Chrome/Application/chrome.exe'),
        path.join(process.env.PROGRAMFILES||'','Microsoft/Edge/Application/msedge.exe')
      ]
    : ['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'];
  return candidates.find(exists);
}

const chrome=discoverChrome();
if(!chrome)throw new Error('CHROMIUM_EXECUTABLE_NOT_FOUND: set GEOMETRY_BROWSER_EXECUTABLE');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'apmath-visual-v4-'));
const checks=[];

for(const qid of qids){
  const name='q'+String(qid).padStart(2,'0')+'-solution.svg';
  const svg=fs.readFileSync(path.join(svgDir,name),'utf8');
  const html='<!doctype html><meta charset="utf-8"><style>html,body{margin:0}#wrap{width:340px}#wrap>svg{display:block;width:340px;height:auto}</style><div id="wrap">'+svg+'</div><script>(async()=>{await document.fonts.ready;const s=document.querySelector("svg");const sr=s.getBoundingClientRect();const labels=[...s.querySelectorAll("text")].map(e=>{const b=e.getBoundingClientRect(),bb=e.getBBox(),cs=getComputedStyle(e);return{text:e.textContent,x:b.x,y:b.y,width:b.width,height:b.height,bbox:{x:bb.x,y:bb.y,width:bb.width,height:bb.height},fontFamily:cs.fontFamily,fontSize:cs.fontSize}});const overlap=(a,b)=>a.x<b.x+b.width&&b.x<a.x+a.width&&a.y<b.y+b.height&&b.y<a.y+a.height;let overlaps=0;for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++)if(overlap(labels[i],labels[j]))overlaps++;const clipped=labels.filter(b=>b.x<sr.x-.5||b.y<sr.y-.5||b.x+b.width>sr.x+sr.width+.5||b.y+b.height>sr.y+sr.height+.5).length;document.body.setAttribute("data-evidence",encodeURIComponent(JSON.stringify({fontStatus:document.fonts.status,svg:{x:sr.x,y:sr.y,width:sr.width,height:sr.height},labelCount:labels.length,labelOverlapCount:overlaps,clippedLabelCount:clipped,labels})));})();</script>';
  const file=path.join(tmp,'q'+qid+'.html');
  fs.writeFileSync(file,html);
  const uri='file:///'+file.replaceAll('\\','/');
  const out=execFileSync(chrome,['--headless=new','--disable-gpu','--no-sandbox','--allow-file-access-from-files','--dump-dom',uri],{encoding:'utf8',maxBuffer:16*1024*1024});
  const m=out.match(/data-evidence="([^"]+)"/);
  if(!m)throw new Error('BROWSER_EVIDENCE_MISSING:q'+qid);
  const row=JSON.parse(decodeURIComponent(m[1].replaceAll('&amp;','&')));
  row.qid=qid;
  row.status=row.fontStatus==='loaded'&&row.labelOverlapCount===0&&row.clippedLabelCount===0?'PASS':'FAIL';
  checks.push(row);
}
const result={schemaVersion:'apmath-visual-browser-evidence-v1',browserExecutable:path.basename(chrome),viewportCssWidth:340,actualBrowser:true,checks,status:checks.every(x=>x.status==='PASS')?'PASS':'FAIL'};
const outPath=path.join(here,'browser-evidence.json');
fs.writeFileSync(outPath,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,out:outPath,checks:checks.map(x=>({qid:x.qid,status:x.status,labels:x.labelCount,overlap:x.labelOverlapCount,clipped:x.clippedLabelCount}))},null,2));
if(result.status!=='PASS')process.exitCode=1;
