// Score gate (ops/score): when an observer fails a figure that was composed, the candidate SVG and every violation the observers measured
// are kept beside the failure instead of being thrown away with it. Output only: no check, no hash and no passing result reads this.
// A compose site calls noteCandidate() just before it throws; render-plan.mjs takes it when it writes the failure result.
let current=null;
export const resetCandidate=()=>{current=null;};
// site: 'figure' (the final SVG of a one-capability figure) or 'panel' (one panel of a composite); violations: [{code,id?,degree?}]
export const noteCandidate=({site='figure',svg,violations,errors})=>{
  if(typeof svg!=='string'||!svg)return;
  current={site,svg,violations:Array.isArray(violations)?violations:(errors||[]).map(text=>{const parts=String(text).split(':');return{code:parts[0],...(parts.length>1?{id:parts.slice(1).join(':')}:{})};}),errors:errors||[]};
};
export const takeCandidate=()=>current;
