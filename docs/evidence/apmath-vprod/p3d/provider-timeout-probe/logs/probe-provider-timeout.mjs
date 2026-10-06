import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

const root=process.cwd();
const traceDir=path.join(root,'.tmp/archive/phase3d-provider-timeout/provider-timeout/visual-engine/production/provider-trace');
const outputDir=path.dirname(traceDir);
fs.mkdirSync(traceDir,{recursive:true});
const {invokeVisualContinuation}=await import(pathToFileURL(path.join(root,'alive/runtime/provider-bridge/codex-appserver-adapter.mjs')));
function appServerPids(){
  const command="$rows=Get-CimInstance Win32_Process -Filter \"Name='codex.exe'\" | Where-Object { $_.CommandLine -match 'app-server.*--stdio' } | Select-Object -ExpandProperty ProcessId; ConvertTo-Json -InputObject @($rows) -Compress";
  const result=spawnSync('powershell.exe',['-NoProfile','-Command',command],{encoding:'utf8',timeout:5000});
  if(result.status!==0)return{available:false,error:result.error?String(result.error):result.stderr||`exit:${result.status}`};
  try{const value=JSON.parse((result.stdout||'[]').trim()||'[]');return{available:true,pids:(Array.isArray(value)?value:[value]).filter(Boolean).map(Number).sort((a,b)=>a-b)};}catch(error){return{available:false,error:String(error),stdout:result.stdout||''};}
}
const before=appServerPids(),startedAt=Date.now();
let classification='UNCLASSIFIED',errorMessage=null,returnedOutput=null;
try{
  const response=await invokeVisualContinuation({
    root,
    traceDir,
    purpose:'phase3d-provider-timeout-read-only-probe',
    input:[{type:'text',text:'Return exactly the JSON object {"ok":true}. Do not use tools or perform any external action.'}],
    outputSchema:{type:'object',properties:{ok:{type:'boolean'}},required:['ok'],additionalProperties:false},
    timeoutMs:1
  });
  classification='COMPLETED_BEFORE_TINY_TURN_DEADLINE';
  returnedOutput={provider:response.provider,model:response.model,purpose:response.purpose,providerInvocationId:response.providerInvocationId,output:response.output};
}catch(error){
  errorMessage=String(error?.message||error);
  classification=errorMessage==='VISUAL_PROVIDER_TIMEOUT'?'TURN_TIMEOUT':'PROVIDER_OR_APPSERVER_FAILURE';
}
await new Promise(resolve=>setTimeout(resolve,1000));
const after=appServerPids();
const tracePath=path.join(traceDir,'appserver-message-trace.jsonl');
const traceExists=fs.existsSync(tracePath),trace=traceExists?fs.readFileSync(tracePath,'utf8'):'';
const traceEvents=trace.split(/\r?\n/).filter(Boolean).map(line=>{try{const row=JSON.parse(line);return{sequence:row.sequence,route:row.route,method:row.method,turnStatus:row.turnStatus,errorCode:row.errorCode};}catch{return{invalidLine:true};}});
const beforePids=new Set(before.pids||[]),afterPids=after.pids||[];
const newSurvivors=afterPids.filter(pid=>!beforePids.has(pid));
const record={schemaVersion:'PHASE3D_PROVIDER_TIMEOUT_PROBE_v1',classification,timeoutMs:1,errorMessage,durationMs:Date.now()-startedAt,returnedOutput,processProbe:{before,after,newSurvivors,settled:Boolean(before.available&&after.available&&newSurvivors.length===0)},tracePath:path.relative(root,tracePath).replaceAll('\\','/'),traceExists,traceEvents};
const resultPath=path.join(outputDir,'provider-timeout-probe.json');
fs.writeFileSync(resultPath,JSON.stringify(record,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({classification,errorMessage,durationMs:record.durationMs,processProbe:record.processProbe,traceExists,traceEvents:traceEvents.length,resultPath:path.relative(root,resultPath).replaceAll('\\','/')}));
