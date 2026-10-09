import fs from 'node:fs';
const p=String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\evidence\R1-evidence.json`;
const e=JSON.parse(fs.readFileSync(p,'utf8'));
const summarize=v=>Array.isArray(v)?{type:'array',length:v.length,qids:v.map(x=>x?.qid??x?.id).filter(Number.isInteger),keys:v[0]?Object.keys(v[0]):[]}:v&&typeof v==='object'?{type:'object',keys:Object.keys(v),qidKeys:Object.keys(v).filter(k=>/^\d+$/.test(k))}:v;
console.log(JSON.stringify({independentFreeze:summarize(e.independentFreeze),studentFreezeRebind:summarize(e.studentFreezeRebind),postfreezeAdjudications:summarize(e.postfreezeAdjudications),goldenCalibration:{keys:Object.keys(e.goldenCalibration||{}),sampleCount:e.goldenCalibration?.samples?.length,negativeKeys:Object.keys(e.goldenCalibration?.negativeSample||{})}},null,2));
