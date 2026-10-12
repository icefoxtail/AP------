const url='https://raw.githubusercontent.com/icefoxtail/AP------/archive-progress-state/archive-progress.json';
const RUN=/^https:\/\/github\.com\/icefoxtail\/AP------\/(?:actions\/runs\/\d+(?:\/attempts\/\d+)?|pull\/\d+)$/;
const DATE=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/;
let entries=[],lastSuccess=null,fetching=false,inventoryComplete=true,history=null;
function validDate(x){return typeof x==='string'&&DATE.test(x)&&Number.isFinite(Date.parse(x))&&new Date(x).toISOString().slice(0,19)===x.slice(0,19);}
function cell(row,item,uncertain=false){
 const td=document.createElement('td'),span=document.createElement('span');
 span.textContent=item?.result||'미확인';span.className=['실패','불일치'].includes(item?.result)?'bad':item?.result==='완료'||item?.result==='통과'?'good':'unknown';
 if(item?.reason){const why=document.createElement('small');why.textContent=' ('+item.reason+')';span.append(why);}td.append(span);
 if(item?.run&&RUN.test(item.run)){
  const a=document.createElement('a');a.href=item.run;a.textContent=' ↗';a.rel='noopener noreferrer';a.target='_blank';td.append(a);
 }
 if(validDate(item?.at)){
  const small=document.createElement('small');small.textContent=' '+item.at.slice(0,16).replace('T',' ');td.append(document.createElement('br'),small);
 }
 row.append(td);
}
function render(){
 const q=document.querySelector('#search').value.toLowerCase().trim(),body=document.querySelector('#rows');body.replaceChildren();
 for(const e of entries.filter(x=>typeof x.exam==='string'&&x.exam.toLowerCase().includes(q))){
  const tr=document.createElement('tr'),name=document.createElement('td');name.textContent=e.exam;tr.append(name);
  for(const key of ['check','main','registration','deploymentJob','deployment','lastSuccessfulRelease','lastFailure'])cell(tr,e[key]);body.append(tr);
 }
}
async function refresh(){
 if(fetching)return;fetching=true;document.querySelector('#refresh').disabled=true;
 try{
  const response=await fetch(url+'?v='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw Error('HTTP '+response.status);
  const d=await response.json();if(d?.schema!==1||!d.entries||typeof d.entries!=='object')throw Error('Invalid status document');
  entries=Object.values(d.entries);inventoryComplete=d.inventoryComplete!==false;history=d.history||null;lastSuccess=new Date().toISOString();render();
  const issues=(d.incompletePRs||[]).filter(x=>Number.isInteger(x)).length;
  document.querySelector('#updated').textContent='마지막 집계: '+(validDate(d.updatedAt)?d.updatedAt:'미확인')+' · 조회 성공: '+lastSuccess+
   ' · '+entries.length+'종'+(history?.complete===false?' · 최근 기록 부분 조회 (과거 이력 전체 아님)':'')+
   (history?.runScanIsPartial?' · 최근 실행 일부만 처리 (수동 과거 재집계 가능)':'')+
   (!inventoryComplete?' · PR 파일 목록 일부 미확인'+(issues?' ('+issues+'개 PR)':''):'');
 }catch(e){
  document.querySelector('#updated').textContent='조회 실패 ('+e.message+') · 마지막 정상 조회: '+(lastSuccess||'없음')+
   ' · 화면에 남은 결과는 이전 정상 조회이며 최신 상태가 아닐 수 있습니다.';
 }finally{fetching=false;document.querySelector('#refresh').disabled=false;}
}
document.querySelector('#search').addEventListener('input',render);
document.querySelector('#refresh').addEventListener('click',refresh);
refresh();setInterval(()=>{if(!document.hidden)refresh();},60000);
