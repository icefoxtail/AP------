// A source-coordinate construction (recipe SOURCE_COORDINATE_AXES_v1) needs exactly one NORMALIZATION_ORIGIN and one NORMALIZATION_AXIS node (the frame the axes are drawn from:
// the origin and the unit point of length 1). They are bookkeeping, not part of the problem, so a plan that left them out gets them here instead of failing with
// CINDY_SOURCE_COORDINATE_FRAME_REFERENCES_REQUIRED. Only when the plan names what it displays (displayPoints), so the added points are never drawn; a plan with one of them
// (or any other mix) is returned untouched and fails as before.
const ID=/^[A-Za-z][A-Za-z0-9]{0,31}$/;
export function ensureCoordinateFrame(plan){
  const nodes=plan?.mathPlan?.nodes;
  if(plan?.mathPlan?.realization?.recipeId!=='SOURCE_COORDINATE_AXES_v1'||!Array.isArray(nodes)||!Array.isArray(plan.displayPoints))return plan;
  if(!nodes.some(node=>node?.op==='SOURCE_POINT'||node?.op==='SOURCE_LINE'))return plan;
  if(nodes.some(node=>node?.op==='NORMALIZATION_ORIGIN'||node?.op==='NORMALIZATION_AXIS'))return plan;
  const used=new Set(nodes.map(node=>node?.id));
  const fresh=base=>{let id=base;for(let k=2;used.has(id)||!ID.test(id);k++)id=base+k;used.add(id);return id;};
  const origin=fresh('FrameOrigin'),axis=fresh('FrameUnitAxis');
  const added=[{id:origin,op:'NORMALIZATION_ORIGIN',inputs:[],args:{},outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'},
    {id:axis,op:'NORMALIZATION_AXIS',inputs:[],args:{length:{kind:'integer',value:'1'}},outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'}];
  return {...plan,mathPlan:{...plan.mathPlan,nodes:[...nodes,...added]}};
}
