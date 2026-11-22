// A single figure (number line, quadratic chain, solid) stands for a one- or two-panel composite-panels-v1. The author's optional plan fields are copied
// to that composite only when the author wrote them: a field that is copied as undefined is not canonical JSON and made every such render fail
// (COMPOSITE_INPUT_NOT_CANONICAL, $.newVisualInformation) although the plan was valid. The order of the keys is the order of `keys`.
export const OPTIONAL_COMPOSITE_FIELDS=Object.freeze(['sourceConditions','newVisualInformation']);
export function presentFields(plan,keys=OPTIONAL_COMPOSITE_FIELDS){
  return Object.fromEntries(keys.filter(key=>plan?.[key]!==undefined).map(key=>[key,plan[key]]));
}
