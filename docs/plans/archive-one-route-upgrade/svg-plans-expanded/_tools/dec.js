// _decisions.jsonl 갱신 도우미 + 옛 플랜 history 이동
const fs=require('fs'),path=require('path'),cp=require('child_process');
const L=require('./lib.js');
const REPO='C:/Users/USER/Desktop/AP------/.claude/worktrees/svg-plans';
const BASE='docs/plans/archive-one-route-upgrade/svg-plans-expanded/';
function dirOf(examRel){return L.W+examRel;}
function upsert(examRel,no,fields){ // examRel: 'original/high/...' (no .js)
  const d=dirOf(examRel);const f=d+'/_decisions.jsonl';
  const exam='archive/exams/'+examRel+'.js';
  let lines=fs.existsSync(f)?fs.readFileSync(f,'utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l)):[];
  let i=lines.findIndex(x=>x.no===no);
  const base=i>=0?lines[i]:{exam,no};
  const nu=Object.assign({},base,fields);
  if(i>=0)lines[i]=nu;else{lines.push(nu);lines.sort((a,b)=>a.no-b.no);}
  fs.mkdirSync(d,{recursive:true});
  fs.writeFileSync(f,lines.map(x=>JSON.stringify(x)).join('\n')+'\n');
}
function toHistory(examRel,files,tag){
  for(const f of files){
    const src=BASE+examRel+'/'+f;
    const dst=BASE+'history/'+tag+'/'+examRel+'/'+f;
    fs.mkdirSync(path.dirname(REPO+'/'+dst),{recursive:true});
    cp.execFileSync('git',['-C',REPO,'mv',src,dst],{stdio:'inherit'});
  }
}
const SELF={answerHidden:false,midValuesKept:true,coordsVerified:true,captionNamesPresent:true,solutionInformationVisible:true};
module.exports={upsert,toHistory,SELF,REPO,BASE};
