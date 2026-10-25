import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha} from '../../pipeline-core/canonical.mjs';
import {pythonWorker} from './worker.mjs';
import {assetIdentity} from './contracts.mjs';
import {specFor,displayGeometryInventory,exactValue} from './phase2.mjs';
import {typesetter} from './typography.mjs';
import {reconstruct,compareReconstruction} from './cindy-observer.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import {bindMeasuredOwnerSafeLabelRepair} from './layout-repair.mjs';
import {auditMeasuredOwnerSafeLabelRepair} from './layout-repair-audit.mjs';

export const CANDIDATE_SVG_VERSION='construction-candidate-svg-v1';
const CAPABILITY='construction-spike-v1';
const POLICY_VERSION='REQUESTED_PROFILE_TYPOGRAPHY_v1';
const OBSERVER_SCRIPT=fileURLToPath(new URL('primitive-observer-worker.py',import.meta.url));
// Quadratic polynomial graphs and piecewise polynomial graphs (HEADER_BAND formula) follow the runPhase2 graph route: graph observer instead of the Cindy peer.
const GRAPH_CAPABILITIES=new Set(['polynomial-spike-v1','piecewise-polynomial-spike-v1','rational-spike-v1','sqrt-affine-spike-v1','absolute-value-spike-v1','piecewise-affine-spike-v1','exponential-affine-spike-v1','logarithmic-affine-spike-v1','trigonometric-spike-v1','exp-log-pair-spike-v1','piecewise-discontinuous-spike-v1']);
const GRAPH_OBSERVER_SCRIPT=fileURLToPath(new URL('graph-observer-worker.py',import.meta.url));
const PLANE_MARKS_OBSERVER_SCRIPT=fileURLToPath(new URL('plane-marks-observer-worker.py',import.meta.url));
// A plan with plane marks (angle arcs, ticks, ...) or styled segments is also read back by the plane-marks observer.
const usesPlaneMarks=plan=>!!plan?.planeMarks||(plan?.displaySegments||[]).some(segment=>segment.dashed||segment.arrow);
const observerFrame=({aspectPolicy,...frame}={})=>frame;
// Same publication viewport display-profile-audit.mjs hands to captureAtDisplaySize.
const PUBLICATION_VIEWPORT=Object.freeze({width:1440,height:1000});
const LINEAGE_KEYS=['planSha256','modelSha256','typographyPolicySha256','specSha256','fragmentSha256s','measurementsSha256','svgSha256','witnessSha256','staticAuditSha256','renderedLayoutSha256'];

// Internal control flow only: every domain outcome is returned as a status; anything else is a defect and propagates.
class Stop extends Error{constructor(status,detail=null){super(status);this.status=status;this.detail=detail;}}
const digest=(value,field,status)=>{try{return objectSha(value);}catch(error){throw new Stop(status,{field,code:error.code||error.message});}};
const errorText=error=>String(error?.message??error);
// A domain refusal is a plain Error whose message is an UPPER_SNAKE code (optionally ':detail'); TypeError and friends are defects.
const isDomainCode=error=>error?.constructor===Error&&/^[A-Z][A-Z0-9_]*(?::|$)/.test(error.message);

function checkPolicy(policy){
  const finite=value=>typeof value==='number'&&Number.isFinite(value);
  const bad=reason=>{throw new Stop('TYPOGRAPHY_POLICY_INVALID',{reason});};
  if(!policy||typeof policy!=='object'||policy.schemaVersion!==POLICY_VERSION)bad('SCHEMA_VERSION');
  const {baseFontPx,displayScale,fontFloorCssPx}=policy;
  if(![baseFontPx,displayScale,fontFloorCssPx].every(finite))bad('NON_FINITE');
  // The typesetter rejects fonts below 11 and a non-positive scale has no display size.
  if(displayScale<=0||baseFontPx<11||fontFloorCssPx<11)bad('RANGE');
  if(baseFontPx*displayScale<fontFloorCssPx)bad('FONT_BELOW_FLOOR');
}

// The identity must be exactly what contracts.mjs assetIdentity() derives from its own questionUid, surface and visualRole.
// It is handed to the typesetter unchanged, so the question, surface and role are bound into every fragment namespace.
function checkIdentity(identity){
  const bad=(reason,fields)=>{throw new Stop('FRAGMENT_IDENTITY_INVALID',{reason,...(fields?{fields}:{})});};
  if(!identity||typeof identity!=='object'||Array.isArray(identity))bad('MISSING');
  let expected;
  try{expected=assetIdentity(identity.questionUid,identity.surface,identity.visualRole);}
  catch(error){bad('NOT_RECOMPUTABLE',[errorText(error)]);}
  const fields=[...Object.keys(expected).filter(key=>identity[key]!==expected[key]),...Object.keys(identity).filter(key=>!Object.hasOwn(expected,key))];
  if(fields.length)bad('FIELD_MISMATCH',fields);
}

// The Cindy peer is also what the static audit later compares the final XML against, so it is returned.
function bindModelToPlan(plan,model){
  let peer,comparison;
  try{peer=reconstruct(plan.mathPlan);comparison=compareReconstruction(model,peer);}
  catch(error){
    // Only the peer's own domain errors are statuses; a TypeError or any other exception is a defect and propagates.
    const code=errorText(error);
    if(code.startsWith('UNSUPPORTED_CINDY_'))throw new Stop('UNSUPPORTED_NUMERIC_SCOPE',{code});
    if(code.startsWith('CINDY_'))throw new Stop('MODEL_PLAN_MISMATCH',{code});
    throw error;
  }
  if(comparison.status!=='PASS')throw new Stop('MODEL_PLAN_MISMATCH',{errors:comparison.errors??null,failedIds:(comparison.rows??[]).filter(row=>!(row.delta<=comparison.tolerance)).map(row=>row.id)});
  return peer;
}

async function call(worker,stage,payload,options){
  let response;
  try{response=await (options?worker(payload,options):worker(payload));}
  catch(error){throw new Stop('WORKER_ERROR',{stage,code:errorText(error)});}
  if(response?.status!=='OK')throw new Stop('WORKER_ERROR',{stage,workerStatus:response?.status??null,code:response?.result?.code??null});
  return response.result;
}

/**
 * One opt-in path from a construction plan and its SymPy snapshot to a candidate SVG:
 * spec -> prepare -> fragment typeset -> Chrome fragment measurement -> build -> static primitive audit -> rendered layout audit.
 * The typography policy is caller supplied and unverified; no Archive preflight, size selection or provider runs.
 * An owner-label relocation from the build is accepted only with `repairContext` ({measuredPolicy: the R1-a measureArchiveTypographyPolicy
 * outcome whose policy is `typographyPolicy`, sourceRef: fileRef of the exam JS, which also holds the solution}); it is bound with the
 * runPhase2 binder and browser audit (676-705), and captureArchiveCandidate re-checks the binding against the same measured policy.
 * The binder's refs mean something narrower than in runPhase2: solutionRef is the whole exam JS (not solution.txt), measurementRef is the
 * Archive envelope row, profilePolicySha256 the typography policy hash and policyRefsSha256 the hash of the measurement evidence.
 * One build has no repair budget: its repairs are bounded by its labels.
 * `worker` carries only prepare and build; the static observer always runs on the real pythonWorker.
 */
export async function composeConstructionCandidate({plan,model,identity,typographyPolicy,repairContext=null,worker=pythonWorker,browser,compositePanel=false}={}){
  const lineage=Object.fromEntries(LINEAGE_KEYS.map(key=>[key,null]));
  const state={svg:null,staticAudit:{status:'NOT_RUN'},renderedLayout:{status:'NOT_RUN'},layoutRepairs:[]};
  let ownBrowser=null;
  const outcome=(status,detail=null)=>({schemaVersion:CANDIDATE_SVG_VERSION,status,detail,svg:status==='COMPOSED'?state.svg:null,lineage:{...lineage},staticAudit:state.staticAudit,renderedLayout:state.renderedLayout,layoutRepairs:status==='COMPOSED'?state.layoutRepairs:[],typographyPolicyProvenance:'CALLER_SUPPLIED_UNVERIFIED',sizeSelection:'NOT_RUN',actualArchive:'NOT_RUN',independentVisualReview:'NOT_RUN',productionAuthorized:false,qualification:'NOT_RUN'});
  const chrome=async()=>browser??(ownBrowser??=await launchBrowser());
  try{
    const graph=GRAPH_CAPABILITIES.has(plan?.capability)&&!!plan.graphPlan&&!plan.mathPlan;
    if(!graph&&(plan?.capability!==CAPABILITY||!plan.mathPlan||plan.mathPlan.schemaVersion!==CAPABILITY||plan.graphPlan))throw new Stop('UNSUPPORTED_CAPABILITY');
    // A panel drawn without its formula header exists only inside a three-panel composite, which writes that formula itself.
    if(graph&&Object.hasOwn(plan.graphPlan,'compositeHeader')&&!compositePanel)throw new Stop('UNSUPPORTED_CAPABILITY',{reason:'COMPOSITE_HEADER_OUTSIDE_COMPOSITE'});
    lineage.planSha256=digest(plan,'plan','INPUT_NOT_CANONICAL');
    checkPolicy(typographyPolicy);
    lineage.typographyPolicySha256=digest(typographyPolicy,'typographyPolicy','INPUT_NOT_CANONICAL');
    checkIdentity(identity);
    lineage.modelSha256=digest(model,'model','INPUT_NOT_CANONICAL');
    let peer=null;
    if(graph){
      // runPhase2 604-605: the independent graph observer audits the model's own polyline against the (framed) graph plan.
      if(typeof model?.svg!=='string')throw new Stop('MODEL_PLAN_MISMATCH',{reason:'GRAPH_MODEL_SVG_MISSING'});
      const binding=await call(pythonWorker,'modelBinding',{graphPlan:plan.graphPlan,svg:model.svg,transform:observerFrame(model.transform)},{script:GRAPH_OBSERVER_SCRIPT,timeoutMs:120000});
      if(binding.status!=='PASS')throw new Stop('MODEL_PLAN_MISMATCH',{errors:binding.errors??null});
    }else peer=bindModelToPlan(plan,model);

    let spec;
    try{spec=specFor(plan,model,identity.assetId);}catch(error){if(!isDomainCode(error))throw error;throw new Stop('SPEC_ERROR',{code:error.message});}
    lineage.specSha256=digest(spec,'spec','OUTPUT_NOT_CANONICAL');
    // runPhase2 633-670 widens the formula panel to the measured formula; here the panel keeps the spec width and the composed layout audit
    // (inventory + rendered layout) rejects a formula that does not fit, so graph families without a HEADER_BAND (cubic/quartic) compose too.
    const prepared=await call(worker,'prepare',{action:'prepare',spec});

    // Re-enactment of runPhase2 (phase2.mjs, base commit d0bd40de6) 622-628: owner-bound fragments at the policy base font.
    const typeset=typesetter(),fragments={};
    for(const label of prepared.labels){
      if(label.kind==='CONDITION_BOX')throw new Stop('UNSUPPORTED_MULTILINE_LABEL',{labelId:label.id});
      const numericTick=label.kind==='GRAPH_ANNOTATION'&&/^[-−\d.]+$/.test(label.text);
      const role=spec.displayFacts.factRolesByLabel?.[label.id]||plan.mathPlan?.nodes.find(node=>node.id===label.target)?.factRole||'DERIVED_INTERMEDIATE';
      try{fragments[label.id]=typeset({id:label.id,owner:label.target||label.id,factRole:role,fontPx:typographyPolicy.baseFontPx,...(label.math||label.kind==='POINT_NAME'||numericTick?{kind:'MATH',tex:label.tex||label.text.replaceAll('−','-')}:{kind:'TEXT',text:label.text})},identity);}
      catch(error){if(!isDomainCode(error))throw error;throw new Stop('FRAGMENT_TYPESET_ERROR',{labelId:label.id,code:error.message});}
    }
    lineage.fragmentSha256s=Object.fromEntries(Object.entries(fragments).map(([id,fragment])=>[id,fragment.fragmentSha256]));

    // Re-enactment of runPhase2 631: each fragment measured once in Chrome (getBBox + getBoundingClientRect).
    const measurements={},page=await (await chrome()).newPage();
    try{
      for(const [id,fragment] of Object.entries(fragments)){
        await page.setContent(fragment.svg);
        const bbox=await page.locator('svg').first().evaluate(element=>{const box=element.getBBox(),rect=element.getBoundingClientRect();return {x:box.x,y:box.y,width:box.width,height:box.height,viewportWidth:rect.width,viewportHeight:rect.height};});
        if(bbox.width<=0||bbox.height<=0)throw new Stop('FRAGMENT_BROWSER_MEASUREMENT_MISSING',{labelId:id});
        // Chrome snaps the fragment viewport to a 1/64 px layout unit. Within that unit the typesetter box is the measurement, so the
        // owner-label repair binder (which requires the fragment box and the measurement to be identical) can bind; beyond it Chrome's value stands.
        const snap=(measured,intrinsic)=>Math.abs(measured-intrinsic)<=1/64?intrinsic:measured;
        measurements[id]=[snap(bbox.viewportWidth,fragment.intrinsic.width),snap(bbox.viewportHeight,fragment.intrinsic.height)];fragment.observedBBox=bbox;
      }
    }finally{await page.close();}
    lineage.measurementsSha256=digest(measurements,'measurements','OUTPUT_NOT_CANONICAL');

    const built=await call(worker,'build',{action:'build',spec,measurements,fragments});
    if(typeof built.svg!=='string'||!built.svg.includes('<svg')||!built.witness?.layout)throw new Stop('WORKER_ERROR',{stage:'build',code:'BUILD_RESULT_INVALID'});
    const {svg,witness}=built,{unresolved,suppressed,repairs=[]}=witness.layout;
    lineage.svgSha256=bytesSha(Buffer.from(svg,'utf8'));
    lineage.witnessSha256=digest(witness,'witness','OUTPUT_NOT_CANONICAL');
    if(![unresolved,suppressed,repairs].every(Array.isArray))throw new Stop('WORKER_ERROR',{stage:'build',code:'BUILD_WITNESS_LAYOUT_INVALID'});
    // Opt-in diagnostic: keep the incomplete candidate beside the failure so a person can see what the layout could not place (never read by any gate).
    if(process.env.APMS_DRAFT_DIR&&(unresolved.length||suppressed.length))(await import('node:fs')).writeFileSync((process.env.APMS_DRAFT_DIR)+'/'+(process.env.APMS_DRAFT_TAG||'draft')+'-'+Date.now()+'.svg',svg);
    if(unresolved.length||suppressed.length)throw new Stop('LAYOUT_INVENTORY_INCOMPLETE',{unresolved,suppressed});
    // Binding a repair needs Archive profile/policy refs: without repairContext never accept one silently.
    if(repairs.length&&!repairContext)throw new Stop('LAYOUT_REPAIR_NOT_BOUND',{repairs});
    if(repairs.length){
      const measured=repairContext.measuredPolicy,sourceRef=repairContext.sourceRef,archiveRow=measured?.evidence?.archiveRow;
      const badContext=reason=>{throw new Stop('LAYOUT_REPAIR_CONTEXT_INVALID',{reason});};
      if(measured?.status!=='MEASURED'||measured.provenance!=='ARCHIVE_MEASURED'||!measured.policy)badContext('NOT_ARCHIVE_MEASURED');
      let measuredPolicySha=null;
      try{measuredPolicySha=objectSha(measured.policy);}catch{}
      if(measured.policySha256!==lineage.typographyPolicySha256||measuredPolicySha!==measured.policySha256)badContext('POLICY_NOT_THE_COMPOSED_POLICY');
      if(!archiveRow||!sourceRef)badContext('REFS_MISSING');
      // A graph model carries its base math SVG; a construction model has none, so its canonical model hash stands for the base math.
      const baseMathSha256=typeof model.svg==='string'?bytesSha(Buffer.from(model.svg)):lineage.modelSha256;
      // runPhase2 674-689 with its inputs: the source exam JS is also the solution ref (the solution text lives in it).
      const ownerPointMarkers=prepared.prepared.primitives.filter(value=>value.role==='point').map(value=>({id:value.id,geometry:[...value.at,value.radius]}));
      const sourceConditionsSha256=objectSha(plan.sourceConditions||[]);
      const sourceFactsSha256=objectSha({sourceConditions:plan.sourceConditions||[],newVisualInformation:plan.newVisualInformation||[],mathPlan:plan.mathPlan||null,graphPlan:plan.graphPlan||null});
      const labelInventory=prepared.labels.map(value=>({id:value.id,kind:value.kind,target:value.target??null,text:value.text,sourceMath:value.sourceMath??null,factRole:spec.displayFacts.factRolesByLabel?.[value.id]??null}));
      const candidateSvgBytes=Buffer.from(svg),repairPage=await (await chrome()).newPage();
      try{
        for(const repair of repairs){
          const label=prepared.labels.find(value=>value.id===repair?.labelId),fragment=fragments[repair?.labelId],measurement=measurements[repair?.labelId];
          let binding,audit;
          try{
            binding=bindMeasuredOwnerSafeLabelRepair({identity,sourceRef,solutionRef:sourceRef,planSha256:lineage.planSha256,sourceConditionsSha256,sourceFactsSha256,labelInventorySha256:objectSha(labelInventory),baseMathSvgSha256:baseMathSha256,measurementRef:archiveRow,policyRefsSha256:objectSha(measured.evidence),profilePolicySha256:measured.policySha256,requestedSizeClass:measured.policy.requestedSizeClass,repair,candidateSvgBytes,expectedLabel:label,pointMarkers:ownerPointMarkers,measurement,fragment});
            audit=await auditMeasuredOwnerSafeLabelRepair({binding,candidateSvgBytes,pointMarkers:ownerPointMarkers,page:repairPage});
          }catch(error){if(!isDomainCode(error))throw error;throw new Stop('LAYOUT_REPAIR_BINDING_FAIL',{labelId:repair?.labelId??null,code:error.message});}
          state.layoutRepairs.push({repairInput:binding.repairInput,repairInputSha256:binding.repairInputSha256,repairOutput:binding.repairOutput,repairOutputSha256:binding.repairOutputSha256,candidateSvgSha256:binding.candidateSvgSha256,audit});
        }
      }finally{await repairPage.close();}
    }

    // Re-enactment of runPhase2 708-713: the displayed inventory's Cindy peer values against the final XML.
    const displayed=graph?null:displayGeometryInventory(plan,model),peerOf=(ids,values)=>ids?Object.fromEntries(Object.keys(ids).map(id=>[id,values[id]])):null;
    // Always the real worker and observer: a caller-supplied worker could otherwise answer PASS for any SVG.
    // Graph lines are audited against the plan's own exact slope and intercept (a=slope, b=-1, c=intercept for ax+by+c=0).
    // A piecewise polynomial's referenceLines are y=c (a=0, b=-1, c) or, with slope and intercept, y=m*x+c (a=m, b=-1, c).
    const graphLines=graph?Object.fromEntries([...(plan.graphPlan.lines||[]).map(line=>['line-'+line.id,[exactValue(line.slope),-1,exactValue(line.intercept)]]),...((plan.capability==='piecewise-polynomial-spike-v1'||plan.capability==='piecewise-discontinuous-spike-v1')?(plan.graphPlan.referenceLines||[]).map(line=>['line-'+line.id,[line.slope===undefined?0:exactValue(String(line.slope)),-1,exactValue(String(line.slope===undefined?line.y:line.intercept))]]):[])]):null;
    const audit=await call(pythonWorker,'staticAudit',{svg,points:peerOf(displayed?.points,peer?.points),lines:graph?graphLines:peerOf(displayed?.lines,peer?.lines),circles:peerOf(displayed?.circles,peer?.circles),segments:plan.displaySegments||[],rightAngles:plan.rightAngles||[],transform:witness.coordinateModel,fragments,coordinateMode:model.coordinateMode??'FUNCTION_GRAPH'},{script:OBSERVER_SCRIPT});
    // runPhase2 715: graphs also need the graph observer on the final SVG at the intrinsic scale.
    const graphAudit=graph?await call(pythonWorker,'graphAudit',{graphPlan:plan.graphPlan,svg,transform:{...observerFrame(witness.coordinateModel),displayScale:1}},{script:GRAPH_OBSERVER_SCRIPT,timeoutMs:120000}):null;
    // The plane-marks observer recomputes every stated angle, length, parallel and arc fact from the Cindy peer's points and the drawn primitives.
    const planeAudit=!graph&&usesPlaneMarks(plan)?await call(pythonWorker,'planeMarksAudit',{svg,points:peer.points,marks:plan.planeMarks||{},segments:plan.displaySegments||[],transform:witness.coordinateModel},{script:PLANE_MARKS_OBSERVER_SCRIPT}):null;
    lineage.staticAuditSha256=digest(graph?{primitive:audit,graph:graphAudit}:planeAudit?{primitive:audit,planeMarks:planeAudit}:audit,'staticAudit','OUTPUT_NOT_CANONICAL');
    const auditErrors=Array.isArray(audit.errors)?[...audit.errors]:[];
    // The observer reports the bytes it parsed; they must be the bytes the render below receives.
    if(audit.status==='PASS'&&audit.finalSvgSha256!==lineage.svgSha256)auditErrors.push('STATIC_AUDIT_SVG_BYTES_MISMATCH');
    state.staticAudit={status:audit.status==='PASS'&&!auditErrors.length?'PASS':'FAIL',errors:auditErrors};
    if(state.staticAudit.status!=='PASS')throw new Stop('STATIC_PRIMITIVE_AUDIT_FAIL',{errors:auditErrors});
    if(planeAudit){
      const planeErrors=Array.isArray(planeAudit.errors)?[...planeAudit.errors]:[];
      if(planeAudit.finalSvgSha256!==lineage.svgSha256)planeErrors.push('STATIC_AUDIT_SVG_BYTES_MISMATCH');
      state.staticAudit={...state.staticAudit,planeMarks:{status:planeAudit.status==='PASS'&&!planeErrors.length?'PASS':'FAIL',errors:planeErrors,observations:planeAudit.observations}};
      if(state.staticAudit.planeMarks.status!=='PASS')throw new Stop('PLANE_MARKS_AUDIT_FAIL',{errors:planeErrors});
    }
    if(graphAudit&&graphAudit.status!=='PASS'){state.staticAudit={status:'FAIL',errors:graphAudit.errors??[]};throw new Stop('STATIC_GRAPH_AUDIT_FAIL',{errors:graphAudit.errors??null});}

    // Same SVG string, policy display size; see display-profile-audit.mjs 12-15 (not an Archive mode=sol capture).
    const display={width:spec.viewport.width*typographyPolicy.displayScale,height:spec.viewport.height*typographyPolicy.displayScale};
    const renderPage=await (await chrome()).newPage({viewport:{width:Math.max(1,Math.ceil(display.width)),height:Math.max(1,Math.ceil(display.height))}});
    let layout;
    try{layout=analyzeRenderedLayout(await captureAtDisplaySize(renderPage,svg,display,{publicationViewport:PUBLICATION_VIEWPORT}));}
    finally{await renderPage.close();}
    // The record binds the analysis to the bytes it analysed.
    lineage.renderedLayoutSha256=digest({svgSha256:lineage.svgSha256,layout},'renderedLayout','OUTPUT_NOT_CANONICAL');
    state.renderedLayout={status:layout.status,display,errors:layout.errors};
    if(layout.status!=='PASS')throw new Stop('RENDERED_LAYOUT_FAIL',{errors:layout.errors});

    state.svg=svg;
    return outcome('COMPOSED');
  }catch(error){
    if(!(error instanceof Stop))throw error;
    return outcome(error.status,error.detail);
  }finally{if(ownBrowser)await ownBrowser.close();}
}
