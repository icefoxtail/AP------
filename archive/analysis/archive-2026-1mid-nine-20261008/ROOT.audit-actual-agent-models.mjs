import fs from 'node:fs';import path from 'node:path';import readline from 'node:readline';
import {execFileSync} from 'node:child_process';
import {writeFresh} from '../../tools/archive-codex-artifact-io.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const base=path.join(root,'archive/analysis/archive-2026-1mid-nine-20261008');
const original=JSON.parse(fs.readFileSync(path.join(base,'ROOT.actual-agent-model-check.json'))),parent=original.parentThreadId;
const sessionRoot='C:/Users/USER/.codex/sessions';
const files=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(entry.name.endsWith('.jsonl'))files.push(file);}}walk(sessionRoot);
const headers=[];
for(const file of files){const input=fs.createReadStream(file),lines=readline.createInterface({input,crlfDelay:Infinity});try{for await(const line of lines){const record=JSON.parse(line);if(record.type==='session_meta')headers.push({file,p:record.payload});break;}}catch{}finally{lines.close();input.destroy();}}
const byId=new Map(headers.map(h=>[h.p.id||h.p.session_id,h]));
const descendants=headers.filter(h=>{let id=h.p.parent_thread_id||h.p.source?.subagent?.thread_spawn?.parent_thread_id;const seen=new Set();while(id&&!seen.has(id)){if(id===parent)return true;seen.add(id);const p=byId.get(id)?.p;id=p?.parent_thread_id||p?.source?.subagent?.thread_spawn?.parent_thread_id;}return false;});
const rows=[];
for(const h of descendants){const input=fs.createReadStream(h.file),lines=readline.createInterface({input,crlfDelay:Infinity}),contexts=[];
 try{for await(const line of lines)if(line.slice(0,110).includes('"type":"turn_context"')||line.slice(0,110).includes('"type": "turn_context"')){const p=JSON.parse(line).payload;contexts.push({model:p.model,effort:p.effort||p.reasoning_effort||p.reasoningEffort});}}finally{lines.close();input.destroy();}
 const pairs=[...new Map(contexts.map(c=>[JSON.stringify(c),c])).values()];
 rows.push({agent:h.p.agent_path||h.p.source?.subagent?.thread_spawn?.agent_path,role:h.p.agent_role||h.p.source?.subagent?.thread_spawn?.agent_role,sessionFile:path.basename(h.file),turnContextCount:contexts.length,actualModelEffortPairs:pairs,allLunaHigh:contexts.length>0&&pairs.every(p=>p.model==='gpt-6-luna'&&p.effort==='high')});
}
const report={schemaVersion:'ROOT_ACTUAL_SUBAGENT_ALL_TURN_MODEL_CHECK_V1',checkedAt:new Date().toISOString(),parentThreadId:parent,source:'Local session_meta lineage and every actual turn_context; no prompt/answer data exported',count:rows.length,allLunaHigh:rows.length>0&&rows.every(r=>r.allLunaHigh),rows};
const output=path.join(base,process.argv[2]||'ROOT.actual-agent-model-check-20261009.json');console.log(JSON.stringify({...writeFresh(output,report),count:report.count,allLunaHigh:report.allLunaHigh,exceptions:rows.filter(r=>!r.allLunaHigh)}));
