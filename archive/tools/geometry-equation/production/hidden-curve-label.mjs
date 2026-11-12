// Answer-hiding curve names (multi-curve-figure-v1): a curve whose formula text would print the answer (the asked equation, a coordinate, a parameter value)
// is drawn with a neutral name instead of its formula, so the figure still has readable text for the publication gate and every curve stays identifiable.
//
//   "curves":[{"id":"l1","kind":"LINE","coefficients":["7","0"],"domain":["-1","3"],"label":{"hidden":true,"reason":"ANSWER","name":"f"}}, ...]
//
// The object form is expanded here, once, before any stage reads the plan: it becomes the existing string label (label:"f"), so the engine, the observer and the
// publication gate see exactly what a plan that wrote label:"f" by hand sees (the gate is NOT relaxed: a hidden formula still needs a drawn name).
// A plan with no object-form label is returned unchanged (same object), so every existing plan renders byte for byte as before.
//
// Rules (each breach is a coded error, never a silent fallback):
//   HIDDEN_CURVE_LABEL_INVALID:<id>     label object is not exactly {hidden:true, reason:"ANSWER", name:<string>}
//   HIDDEN_CURVE_LABEL_NAME_INVALID:<id> name is not a neutral name: one letter (not x, y), optionally + one digit and/or "(x)"; no "=" so it cannot be a formula
//   HIDDEN_CURVE_LABEL_CONFLICT:<id>    hideLabel / hideLabels is set on the same curve
//   HIDDEN_CURVE_NAME_DUPLICATE:<name>  two curves of one graph carry the same name
//   CURVE_NOT_IDENTIFIABLE:<id>         in a graph that hides a formula this way, a curve has neither a name nor a formula label (every curve must be identifiable)
const NAME_PATTERN=/^[A-Za-z][0-9]?(?:\(x\))?$/;
const RESERVED_NAMES=new Set(['x','y','X','Y']);
const REASONS=new Set(['ANSWER']);
const isObject=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);

const hasObjectLabel=curves=>Array.isArray(curves)&&curves.some(curve=>isObject(curve)&&isObject(curve.label));

function expandCurves(curves,notes,panel){
  const names=new Map();
  const expanded=curves.map(curve=>{
    if(!isObject(curve)||!isObject(curve.label))return curve;
    const id=String(curve.id);
    const label=curve.label;
    const keys=Object.keys(label).sort().join(',');
    if(keys!=='hidden,name,reason'||label.hidden!==true||typeof label.reason!=='string'||!REASONS.has(label.reason)||typeof label.name!=='string')throw new Error('HIDDEN_CURVE_LABEL_INVALID:'+id);
    if(!NAME_PATTERN.test(label.name)||RESERVED_NAMES.has(label.name.replace(/\(x\)$/,'')))throw new Error('HIDDEN_CURVE_LABEL_NAME_INVALID:'+id);
    if('hideLabel' in curve||'hideLabels' in curve)throw new Error('HIDDEN_CURVE_LABEL_CONFLICT:'+id);
    notes.push({...(panel===undefined?{}:{panel}),curve:id,reason:label.reason,name:label.name});
    return {...curve,label:label.name};
  });
  for(const curve of expanded){
    if(!isObject(curve))continue;
    if(typeof curve.label==='string'){
      if(names.has(curve.label))throw new Error('HIDDEN_CURVE_NAME_DUPLICATE:'+curve.label);
      names.set(curve.label,String(curve.id));
    }
  }
  // Every curve of a graph that hides a formula must still be told apart: a name, or a formula label that is not hidden.
  for(const curve of expanded){
    if(!isObject(curve)||typeof curve.label==='string')continue;
    throw new Error('CURVE_NOT_IDENTIFIABLE:'+String(curve.id));
  }
  return expanded;
}

// Returns {plan, notes}. notes lists every hidden formula ([{curve,reason,name,panel?}]); plan is the same object when nothing was hidden.
export function expandHiddenCurveLabels(plan){
  const notes=[];
  if(!isObject(plan))return {plan,notes};
  const expandGraph=(source,panel)=>{
    const curves=source?.graphPlan?.curves;
    if(!hasObjectLabel(curves))return source;
    return {...source,graphPlan:{...source.graphPlan,curves:expandCurves(curves,notes,panel)}};
  };
  if(Array.isArray(plan.panels)){
    let changed=false;
    const panels=plan.panels.map((panel,index)=>{
      if(!isObject(panel)||!isObject(panel.plan))return panel;
      const inner=expandGraph(panel.plan,index);
      if(inner===panel.plan)return panel;
      changed=true;return {...panel,plan:inner};
    });
    return {plan:changed?{...plan,panels}:plan,notes};
  }
  const out=expandGraph(plan,undefined);
  return {plan:out,notes};
}
