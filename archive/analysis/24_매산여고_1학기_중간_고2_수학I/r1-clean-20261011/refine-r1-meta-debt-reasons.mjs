import fs from 'node:fs';import crypto from 'node:crypto';
const path=process.argv[2],x=JSON.parse(fs.readFileSync(path,'utf8'));
const debts={
  1:'H2-M1-RPM-003 is RPM_ONLY for rational exponent; no safe active PT/TPL mapping exists.',
  2:'H2-M1-RPM-008 is RPM_ONLY for logarithm base/argument conditions; preserve null PT/TPL.',
  3:'H2-M1-RPM-005 is RPM_ONLY for exponent-law calculation; preserve null PT/TPL.',
  7:'H2-M1-RPM-029 and -030 are RPM_ONLY; the list checks both general-angle coterminality and radian conversion, with no safe active projection.',
  8:'H2-M1-RPM-036 is RPM_ONLY for roots in a periodic interval; preserve null PT/TPL.',
  10:'H2-M1-RPM-009 and -010 are RPM_ONLY; source asks a multi-statement judgment across log laws/change of base, with no unique safe PT/TPL projection.',
  11:'H2-M1-RPM-005 is RPM_ONLY for exponent-law calculation. CC_ROOTS_COEFFICIENTS is a distinct active cross-concept; no safe active PT/TPL projection is established.',
  12:'The H15 RPM application records H2-M1-RPM-019 (max/min) and -020 (graph intersection) do not encode doubling-time/growth-threshold solving; no exact L4 or safe active PT/TPL projection is established.',
  13:'H2-M1-RPM-016 is RPM_ONLY for substitution in an exponential equation; preserve null PT/TPL.',
  14:'The source compares a logarithmic expression and exponential/quadratic growth over a range; H2-M1-RPM-027/-028 cover max/min or graph intersections, not a unique magnitude-order path. Preserve null PT/TPL pending exact semantic projection evidence.',
  16:'H2-M1-RPM-036 is RPM_ONLY for trig-equation roots on a periodic interval; preserve null PT/TPL.',
  17:'The source uses a half-life decay model; H2-M1-RPM-019 (max/min) and -020 (graph intersection) do not encode this model-solving L4. Preserve null PT/TPL.',
  20:'H2-M1-RPM-029 is RPM_ONLY for general angles; the paired ray-reflection congruences have no safe active PT/TPL mapping.',
  21:'H2-M1-RPM-033 is RPM_ONLY for period/symmetry of a trig function; preserve null PT/TPL.',
  22:'H2-M1-RPM-034 is RPM_ONLY for trig-function relationships; preserve null PT/TPL.',
  23:'The source combines a common exponential value, logarithm laws, and a ratio constraint; current RPM rows do not provide a unique exact L4 for this compound decisive step. Preserve null PT/TPL and record this exact gap.'
};
for(const row of x.rows){const q=row.qid,meta=row.meta;if(debts[q])meta.metaDebtReason=debts[q];if(q===5)meta.projectionReviewFlag='Current PT_FUNCTION_GRAPH_PROPERTIES/TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT differs from exact crosswalk candidate H2-M1-RPM-014 (PT_FUNCTION_GRAPH_TRANSFORM/TPL_FUNCTION_GRAPH_TRANSLATION); do not auto-remap pending semantic adjudication.';if(q===6)meta.projectionReviewFlag='Current PT_FUNCTION_GRAPH_INTERSECTION/TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS appears graph-focused, while primary exponent-inequality path H2-M1-RPM-017 is RPM_ONLY; preserve current keys only as existing source values and do not claim crosswalk binding.';}
x.metaAxis.nullProjectionDebtReasonsByQid=debts;x.metaAxis.currentKeyCrosswalkReviewFlags={5:x.rows.find(r=>r.qid===5).meta.projectionReviewFlag,6:x.rows.find(r=>r.qid===6).meta.projectionReviewFlag};
fs.writeFileSync(path,JSON.stringify(x,null,2)+String.fromCharCode(10));console.log(JSON.stringify({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'),nullDebtQids:Object.keys(debts).map(Number)},null,2));
