// Score gate (ops/score): when an observer fails a figure that was composed, the candidate SVG and every violation the observers measured
// are kept beside the failure instead of being thrown away with it. Output only: no check, no hash and no passing result reads this.
// A compose site calls noteCandidate() just before it throws; render-plan.mjs takes it when it writes the failure result.
//
// Scored acceptance (opt-in, render-plan --accept-scored 1 / APMS_ACCEPT_SCORED=1): a second render of a figure whose candidate scored SCORED_PASS.
// Then noteCandidate() (compose stage) and acceptArchiveViolations() (archive capture stage) answer true while the violations score PASS, the
// compose site / archive capture lets the figure through, and render-plan.mjs records scoreGate on the ARCHIVE_BOUND result. Off, both answer false and nothing changes.
import {scoreFigure} from '../ops/score/score.mjs';
let current=null;
let acceptance=null;
export const resetCandidate=()=>{current=null;if(acceptance){acceptance.compose=[];acceptance.archive=[];}};
// site: 'figure' (the final SVG of a one-capability figure) or 'panel' (one panel of a composite); violations: [{code,id?,degree?}]
export const noteCandidate=({site='figure',svg,violations,errors})=>{
  if(typeof svg!=='string'||!svg)return false;
  current={site,svg,violations:Array.isArray(violations)?violations:(errors||[]).map(text=>{const parts=String(text).split(':');return{code:parts[0],...(parts.length>1?{id:parts.slice(1).join(':')}:{})};}),errors:errors||[]};
  return acceptCompose(current.violations);
};
export const takeCandidate=()=>current;

export const enableScoredAcceptance=(on=true)=>{acceptance=on?{compose:[],archive:[]}:null;};
export const scoredAcceptanceEnabled=()=>acceptance!==null;
const scoreOf=violations=>scoreFigure({findings:violations.map(v=>({code:v.code,id:v.id,degree:v.degree})),hasSvg:true});
// The violations of every accepted figure / panel of one render add up (a composite is one figure for the student).
function acceptCompose(violations){
  if(!acceptance||!Array.isArray(violations)||!violations.length)return false;
  const total=[...acceptance.compose,...violations];
  if(scoreOf(total).verdict!=='PASS')return false;
  acceptance.compose=total;return true;
}
// The archive page replays the asset at the size the student sees; its violations are scored on their own (same figure, other size).
export function acceptArchiveViolations(violations){
  if(!acceptance||!Array.isArray(violations)||!violations.length)return false;
  const total=[...acceptance.archive,...violations];
  if(scoreOf(total).verdict!=='PASS')return false;
  acceptance.archive=total;return true;
}
// What render-plan writes on an ARCHIVE_BOUND result that got through on a score; null when nothing was accepted.
export function takeScoredAcceptance(){
  if(!acceptance||(!acceptance.compose.length&&!acceptance.archive.length))return null;
  const stages=[];
  if(acceptance.compose.length)stages.push({stage:'compose',violations:acceptance.compose.map(v=>({...v,stage:'compose'})),scored:scoreOf(acceptance.compose)});
  if(acceptance.archive.length)stages.push({stage:'archive',violations:acceptance.archive.map(v=>({...v,stage:'archive'})),scored:scoreOf(acceptance.archive)});
  const worst=stages.reduce((a,b)=>b.scored.score<a.scored.score?b:a);
  const s=worst.scored;
  return {violations:stages.flatMap(x=>x.violations),scoreGate:{status:'SCORED_PASS',score:s.score,passScore:s.passScore,tableVersion:s.tableVersion,stage:worst.stage,stages:Object.fromEntries(stages.map(x=>[x.stage,x.scored.score])),deductions:s.findings}};
}
