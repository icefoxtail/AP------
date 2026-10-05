// Independent observation of fact types absent from the legacy narrow verifier.
// No imports from the builder, Python witness, or its expression serializer.
const attrs = s => Object.fromEntries([...s.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
const finite = v => typeof v === 'number' && Number.isFinite(v);
const near = (a,b,t) => finite(a) && finite(b) && Math.abs(a-b)<=t;
const pairs = value => { const a=String(value).trim().split(/[\s,]+/).map(Number); if(a.length%2||a.length<4||a.some(v=>!finite(v))) throw Error('INVALID_POINTS');return Array.from({length:a.length/2},(_,i)=>a.slice(2*i,2*i+2)); };
function evalFrozen(tree,x) {
  if(finite(tree))return tree;
  if(tree==='x')return x;
  if(!Array.isArray(tree)||tree.length<2)throw Error('INVALID_FROZEN_FUNCTION');
  const [op,...args]=tree;const a=args.map(v=>evalFrozen(v,x));
  if(op==='+')return a[0]+a[1];if(op==='-')return a.length===1?-a[0]:a[0]-a[1];
  if(op==='*')return a[0]*a[1];if(op==='/')return a[0]/a[1];if(op==='^')return a[0]**a[1];
  if(['sqrt','exp','log','sin','cos','tan','abs'].includes(op)&&a.length===1)return Math[op](a[0]);
  throw Error('UNSUPPORTED_FROZEN_FUNCTION');
}
export function observeExtraPrimitives(svg,input) {
  const model=input.coordinateModel;const errors=[];const observed=[];
  const elements=new Map([...svg.matchAll(/<(circle|polyline|line)\b([^>]*)\/?\s*>/g)].map(m=>{const a=attrs(m[2]);return[a.id,{kind:m[1],a}];}));
  const inverse=p=>[(p[0]-model.originX)/model.sx,(model.originY-p[1])/model.sy];
  const read=id=>{const e=elements.get(id);if(!e)throw Error('ELEMENT_MISSING:'+id);return e;};
  const points=e=>e.kind==='circle'?[[Number(e.a.cx),Number(e.a.cy)]]:e.kind==='line'?[[Number(e.a.x1),Number(e.a.y1)],[Number(e.a.x2),Number(e.a.y2)]]:pairs(e.a.points);
  const covered=new Set((input.expectedFacts||[]).filter(v=>['POINT','MIDPOINT','ROOT','OPEN_CLOSED_POINT'].includes(v.type)).map(v=>v.element));
  for(const fact of input.extraFacts||[]) {
    try {
      const tolerance=fact.tolerance??(fact.type==='CIRCLE'?1e-7:.02);if(!finite(tolerance)||tolerance<0||tolerance>.05)throw Error('EXTRA_TOLERANCE_POLICY');
      if(fact.type==='CIRCLE') {
        const e=read(fact.element);if(e.kind!=='circle')throw Error('CIRCLE_REQUIRED');
        const center=inverse(points(e)[0]);const radius=Number(e.a.r)/model.sx;if(!finite(radius)||radius<=0)throw Error('DEGENERATE_ACTUAL_CIRCLE');
        if(!near(model.sx,model.sy,1e-9)||!center.every((v,i)=>near(v,fact.center[i],tolerance))||!near(radius,fact.radius,tolerance))throw Error('ACTUAL_CIRCLE_PARITY_FAIL');
        covered.add(fact.element);observed.push({id:fact.element,center,radius});
      } else if(fact.type==='FUNCTION_GRAPH') {
        const branches=[...elements].filter(([id,e])=>id.startsWith(fact.prefix+'-branch-')&&e.kind==='polyline');
        if(!branches.length)throw Error('GRAPH_BRANCH_MISSING');
        for(const [id,e] of branches) {
          const p=points(e).map(inverse);
          if((fact.poles||[]).some(x=>p[0][0]<x&&x<p.at(-1)[0]))throw Error('FALSE_CONNECTION_ACROSS_DISCONTINUITY');
          for(const [x,y] of p)if(!near(y,evalFrozen(fact.expression,x),tolerance))throw Error('ACTUAL_FUNCTION_SAMPLE_PARITY_FAIL');
          observed.push({id,sampleCount:p.length});
        }
      } else if(fact.type==='RIGHT_ANGLE_MARK') {
        const p=points(read(fact.element));const vertex=points(read(fact.vertexElement))[0];
        if(p.length!==3||!p[0].map((v,i)=>v+p[2][i]-p[1][i]).every((v,i)=>near(v,vertex[i],.02)))throw Error('MARK_VERTEX_PARITY_FAIL');
        const u=p[1].map((v,i)=>v-p[0][i]),v=p[2].map((v,i)=>v-p[1][i]);
        const norm=Math.hypot(...u)*Math.hypot(...v);
        if(!norm||Math.abs((u[0]*v[0]+u[1]*v[1])/norm)>1e-6)throw Error('WRONG_RIGHT_ANGLE_MARK');
        const directions=fact.lines.map(id=>{const q=points(read(id));return q[1].map((v,i)=>v-q[0][i]);});
        const parallel=(a,b)=>Math.abs(a[0]*b[1]-a[1]*b[0])/(Math.hypot(...a)*Math.hypot(...b))<1e-6;
        if(!((parallel(u,directions[0])&&parallel(v,directions[1]))||(parallel(u,directions[1])&&parallel(v,directions[0]))))throw Error('MARK_RAY_ORIENTATION_FAIL');
        observed.push({id:fact.element,status:'PASS'});
      } else throw Error('UNSUPPORTED_EXTRA_FACT');
    }catch(error){errors.push({fact:fact.element||fact.prefix,error:String(error.message)});}
  }
  for(const [id,e] of elements)if(e.kind==='circle'&&!covered.has(id))errors.push({fact:id,error:'UNVERIFIED_CIRCLE_OR_POINT'});
  return {status:errors.length?'FAIL':'PASS',observed,errors};
}
