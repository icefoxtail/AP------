// One-command "plan -> SVG" runner (ported from the pilot runner; behavior is the same).
// author plan (unchanged) -> deterministic gate (frame/model audit -> Archive policy -> L1 with repairContext -> Archive capture) -> optional observer packet.
// EXEMPT / UNSUPPORTED author decisions are recorded as they are. Failures report the engine's own stage and detail.
// usage (from the repo root):
//   node archive/tools/geometry-equation/production/render-plan.mjs --item item.json --plan plan.json --out <outDir> [--packet-dir <dir>]
//   node archive/tools/geometry-equation/production/render-plan.mjs --manifest <packetDir> --out <outDir> [--packet-dir <dir>]
//     (<packetDir>.manifest.json lists items[{dir,sourcePath,ordinal,...}]; each plan is <packetDir>/<dir>/plan.json)
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath,pathToFileURL} from 'node:url';
import {pythonWorker} from './worker.mjs';
import {assetIdentity} from './contracts.mjs';
import {specFor} from './phase2.mjs';
import {isPlaneFigure} from './plane-marks.mjs';
import {composeConstructionCandidate} from './construction-candidate-svg-v1.mjs';
import * as cap from './construction-archive-capture-v1.mjs';
import * as obs from './archive-inverse-observation-v1.mjs';
import {fileRef} from '../../pipeline-core/canonical.mjs';
import {SOURCE_QUESTION_ID_PATTERN} from '../../pipeline-core/question-uid.mjs';
import * as comp from './composite-candidate-svg-v1.mjs';
import {expandDiscontinuousPair} from './discontinuous-pair-v1.mjs';
import {expandPlaneVectors} from './plane-vectors.mjs';
import {expandHiddenCurveLabels} from './hidden-curve-label.mjs';
import * as chain from './quadratic-inequality-chain-v1.mjs';
import * as nlf from './number-line-v1.mjs';
import * as sol from './solid-figure-v1.mjs';
import * as scf from './stat-chart-v1.mjs';
import * as sdg from './set-diagram-v1.mjs';
import * as ell from './ellipse-figure-v1.mjs';
import * as cfv from './container-fill-v1.mjs';
import * as lpf from './lattice-path-v1.mjs';
import {observeDisplayedPointNames,planNameExpectations} from './point-name-observer.mjs';
import {createAttemptLog,planDigest,stopwatch,errorCode} from './attempt-log.mjs';
import {failureGuidance} from './error-guidance.mjs';

// The git worktree root: production/ -> geometry-equation/ -> tools/ -> archive/ -> root.
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../../').replace(/\\/g,'/')+'/';
const clip=v=>JSON.stringify(v??null).slice(0,600);
// result.detail stays the 600 character clip above; result.detailFull and result.errors keep the whole thing (still capped so one huge detail cannot flood the file).
const FULL_MAX=200000;
const fullText=v=>{let t;try{t=typeof v==='string'?v:JSON.stringify(v??null);}catch{t=String(v);}return String(t??'').slice(0,FULL_MAX);};
const errorsOf=detail=>{
  const found=[];const walk=(node,depth)=>{if(found.length||depth>6||node===null||typeof node!=='object')return;if(Array.isArray(node.errors)&&node.errors.length){found.push(node.errors);return;}for(const child of Array.isArray(node)?node:Object.values(node))walk(child,depth+1);};
  walk(detail,0);
  try{return found.length?JSON.parse(JSON.stringify(found[0].slice(0,200))):undefined;}catch{return undefined;}
};
// A Python refusal may carry repair data beside its code (result.hintData). It goes to the thrown failure's hintData and is taken out of detail, so detail is what it always was.
const splitHint=result=>{
  if(result&&typeof result==='object'&&!Array.isArray(result)&&Object.hasOwn(result,'hintData')){const {hintData,...rest}=result;return {result:rest,hintData};}
  return {result,hintData:undefined};
};
// A refusal raised while one panel of a composite is specified names that panel in its repair data, so the fix path points into panels[i].
const tagPanel=(run,index)=>{try{return run();}catch(error){if(error&&typeof error.hintData==='object'&&error.hintData!==null&&error.hintData.panel===undefined)Object.defineProperty(error,'hintData',{value:{...error.hintData,panel:index},enumerable:false,configurable:true});throw error;}};
// What stdout shows: the result without the long fields (they are in <name>-result.json), each hint cut short.
const stdoutView=r=>{const {detailFull,errors,hint,...rest}=r;return {...rest,...(hint?{hint:hint.map(h=>h.length>160?h.slice(0,160)+'...':h)}:{}),...(detailFull!==undefined?{detailFile:true}:{})};};

// plan: a parsed plan object, or a path to plan.json. Returns the result record (also written as <name>-result.json).
export async function renderPlan({item,plan:planInput,outDir,packetDir,forceSizeClass}){
  fs.mkdirSync(outDir,{recursive:true});
  const meta={...item};
  const name=String(meta.dir??meta.tag??'figure');
  const tag=crypto.randomUUID().slice(0,8);
  const row={item:name,status:undefined};
  let stage='read-plan';
  // The plan as the author wrote it and as it stood when the render failed: failureGuidance names fields in the author's plan.
  const where={authored:null,plan:null};
  // Attempt log (<outDir>/attempts.jsonl, append only): one line per attempt below and one "final" line per render. Instrumentation only.
  const startedAt=Date.now(),log=createAttemptLog({outDir,item:name,invocation:tag,planSha256:planDigest(planInput)});
  const attemptVariant=suffix=>suffix?String(suffix).replace(/^-/,''):(row.fallback?.length?row.fallback[row.fallback.length-1].to:'initial');
  const write=(file,text)=>fs.writeFileSync(path.join(outDir,file),text);
  const finish=()=>{
    // code, detailFull, errors, hint and fix exist only on a failure (JSON leaves undefined out), so a successful result is byte-for-byte what it was.
    const result={status:row.status,stage:row.stage,detail:row.detail,capability:row.capability,sizeClass:row.sizeClass,fallback:row.fallback,layoutRepairs:row.layoutRepairs,panels:row.panels,hiddenFormulaLabels:row.hiddenFormulaLabels,identity:row.identity,code:row.status==='FAILED'?row.code:undefined,detailFull:row.detailFull,errors:row.errors,hint:row.hint,fix:row.fix};
    write(`${name}-result.json`,JSON.stringify(result,null,1)+'\n');
    log.final({status:row.status,stage:row.stage??stage,code:row.code,detail:row.detail,fallback:row.fallback?.map(f=>f.to),durationMs:Date.now()-startedAt,hint:row.hint,fix:row.fix});
    return result;
  };
  try{
    if(typeof meta.sourcePath!=='string'||!(Number.isSafeInteger(meta.ordinal)&&meta.ordinal>=1||typeof meta.ordinal==='string'&&SOURCE_QUESTION_ID_PATTERN.test(meta.ordinal)))throw new Error('item needs sourcePath (string) and ordinal (integer, or the string id of a bank whose ids are strings)');
    const examUid=path.basename(meta.sourcePath,'.js');
    const surface=meta.surface??'SOLUTION_VISUAL';
    if(!['SOLUTION_VISUAL','PROBLEM_VISUAL'].includes(surface))throw Error('INVALID_RENDER_SURFACE');
    if(surface==='PROBLEM_VISUAL'&&packetDir)throw Error('PROBLEM_SOLUTION_OBSERVER_PACKET_UNSUPPORTED');
    const captureApi=surface==='PROBLEM_VISUAL'?{measure:cap.measureProblemTypographyPolicy,capture:cap.captureProblemCandidate}:{measure:cap.measureArchiveTypographyPolicy,capture:cap.captureArchiveCandidate};
    const identity=assetIdentity(`${examUid}|${meta.ordinal}`,surface,'decisive-relation');
    row.identity=identity;
    process.env.APMS_DRAFT_TAG=name;
    let authored=planInput;
    if(typeof authored==='string'){
      if(!fs.existsSync(authored))throw new Error(`plan file not found: ${authored}`);
      authored=JSON.parse(fs.readFileSync(authored,'utf8'));
    }
    if(!authored||typeof authored!=='object')throw new Error('plan missing or not an object');
    where.authored=where.plan=authored;
    // A curve label {hidden:true,reason:"ANSWER",name} is the neutral-name label the plan stands for (hidden-curve-label.mjs); plans without it pass through untouched.
    {const hiddenLabels=expandHiddenCurveLabels(authored);if(hiddenLabels.notes.length){authored=hiddenLabels.plan;row.hiddenFormulaLabels=hiddenLabels.notes;}}
    if(authored.status==='EXEMPT'||authored.status==='UNSUPPORTED'){row.status=authored.status;row.detail=authored.reason;return finish();}
    // Two discontinuous functions (graphPlan.referenceCurves, layout STACKED) are the two-panel composite they stand for.
    if(authored.capability==='piecewise-discontinuous-spike-v1'&&authored.graphPlan?.referenceCurves!==undefined)authored=expandDiscontinuousPair(authored);
    // planeMarks.vectors / vectorOps (G3) are unfolded into arrows, labels and construction points before the exact model is built.
    if(authored.capability==='construction-spike-v1')authored=expandPlaneVectors(authored);
    row.capability=authored.capability;log.setPlan(authored,meta.fam);where.plan=authored;
    // Writes the shared success outputs (state, svg, optional observer packet).
    const bind=async({plan,model,composed,capture})=>{
      stage='packet';
      let packet;
      if(packetDir)packet=await obs.prepareInverseObservationPacket({capture,packetDir:path.join(packetDir,`packet-${name}-${tag}`)});
      write(`${name}-state.json`,JSON.stringify({meta,identity,plan,model,composed,capture,packetDir:packet?.packetDir,packetSha256:packet?.packetSha256},null,1));
      write(`${name}-${surface==='PROBLEM_VISUAL'?'problem':'solution'}.svg`,composed.svg);
    };
    if(authored.capability===sdg.FIGURE_CAPABILITY){
      // A standalone set diagram: the exact regions and shading derived once, composed, read back by its own observer, then the same Archive capture.
      stage='set-diagram';
      const model=sdg.checkSetDiagramPlan(authored),size=sdg.setDiagramSize(model);
      stage='measure';
      const measured=await captureApi.measure({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',intrinsicSvg:size,runId:`pilot-measure-${tag}`});
      if(measured.status!=='MEASURED')throw {stage,detail:{status:measured.status,detail:measured.detail}};
      stage='compose';
      const composed=await sdg.composeSetDiagramFigure({plan:authored,model,identity,typographyPolicy:measured.policy});
      if(composed.status!=='COMPOSED')throw {stage,detail:{status:composed.status,detail:composed.detail}};
      stage='capture';
      const capture=await captureApi.capture({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',composed,measuredPolicy:measured,alt:authored.caption||'',fixtureClassification:'PILOT_AUTHOR_PLAN_CANDIDATE',runId:`pilot-capture-${tag}`});
      if(capture.status!=='ARCHIVE_BOUND')throw {stage,detail:{status:capture.status,detail:capture.detail}};
      await bind({plan:authored,model,composed,capture});
      row.status='ARCHIVE_BOUND';row.sizeClass='full';
      return finish();
    }
    if(authored.capability===scf.FIGURE_CAPABILITY){
      // A standalone statistics / probability figure: solved exactly, composed once, read back by its own observer, then the same Archive capture.
      stage='stat-chart';
      const model=scf.checkStatChartPlan(authored);let size=scf.statChartSize(model);
      stage='measure';
      let measured=await captureApi.measure({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',intrinsicSvg:size,runId:`pilot-measure-${tag}`});
      if(measured.status!=='MEASURED')throw {stage,detail:{status:measured.status,detail:measured.detail}};
      // A frame that grows to fit its labels (a long legend, a long x title, tree path probabilities) depends on the font size the measurement gives, and the font on the size: measure again at the
      // larger size until the font that size gives needs no more room (sizes only grow; the figure is then composed at exactly the measured size).
      for(let again=1;again<=6;again++){
        const exact=scf.statChartSize(model,{fontPx:measured.policy.baseFontPx});
        if(exact.width<=size.width&&exact.height<=size.height)break;
        size={width:Math.max(size.width,exact.width),height:Math.max(size.height,exact.height)};
        measured=await captureApi.measure({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',intrinsicSvg:size,runId:`pilot-measure-${tag}-r${again}`});
        if(measured.status!=='MEASURED')throw {stage,detail:{status:measured.status,detail:measured.detail}};
      }
      stage='compose';
      const composed=await scf.composeStatChartFigure({plan:authored,model,identity,typographyPolicy:measured.policy,minSize:size});
      if(composed.status!=='COMPOSED')throw {stage,detail:{status:composed.status,detail:composed.detail}};
      stage='capture';
      const capture=await captureApi.capture({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',composed,measuredPolicy:measured,alt:authored.caption||'',fixtureClassification:'PILOT_AUTHOR_PLAN_CANDIDATE',runId:`pilot-capture-${tag}`});
      if(capture.status!=='ARCHIVE_BOUND')throw {stage,detail:{status:capture.status,detail:capture.detail}};
      await bind({plan:authored,model,composed,capture});
      row.status='ARCHIVE_BOUND';row.sizeClass='full';
      return finish();
    }
    if(authored.capability===cfv.FIGURE_CAPABILITY){
      // A standalone vessel-and-water-height figure: the exact volumes derived once, composed, read back by its own observer, then the same Archive capture.
      stage='container-fill';
      const model=cfv.checkContainerFillPlan(authored),size=cfv.containerFillSize(model);
      stage='measure';
      const measured=await captureApi.measure({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',intrinsicSvg:size,runId:`pilot-measure-${tag}`});
      if(measured.status!=='MEASURED')throw {stage,detail:{status:measured.status,detail:measured.detail}};
      stage='compose';
      const composed=await cfv.composeContainerFillFigure({plan:authored,model,identity,typographyPolicy:measured.policy});
      if(composed.status!=='COMPOSED')throw {stage,detail:{status:composed.status,detail:composed.detail}};
      stage='capture';
      const capture=await captureApi.capture({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',composed,measuredPolicy:measured,alt:authored.caption||'',fixtureClassification:'PILOT_AUTHOR_PLAN_CANDIDATE',runId:`pilot-capture-${tag}`});
      if(capture.status!=='ARCHIVE_BOUND')throw {stage,detail:{status:capture.status,detail:capture.detail}};
      await bind({plan:authored,model,composed,capture});
      row.status='ARCHIVE_BOUND';row.sizeClass='full';
      return finish();
    }
    if(authored.capability===lpf.FIGURE_CAPABILITY){
      // A standalone road-network / lattice shortest-path figure: the exact path counts derived once, composed, read back by its own brute-force observer, then the same Archive capture.
      stage='lattice-path';
      const model=lpf.checkLatticePathPlan(authored),size=lpf.latticePathSize(model);
      stage='measure';
      const measured=await captureApi.measure({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',intrinsicSvg:size,runId:`pilot-measure-${tag}`});
      if(measured.status!=='MEASURED')throw {stage,detail:{status:measured.status,detail:measured.detail}};
      stage='compose';
      const composed=await lpf.composeLatticePathFigure({plan:authored,model,identity,typographyPolicy:measured.policy});
      if(composed.status!=='COMPOSED')throw {stage,detail:{status:composed.status,detail:composed.detail}};
      stage='capture';
      const capture=await captureApi.capture({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',composed,measuredPolicy:measured,alt:authored.caption||'',fixtureClassification:'PILOT_AUTHOR_PLAN_CANDIDATE',runId:`pilot-capture-${tag}`});
      if(capture.status!=='ARCHIVE_BOUND')throw {stage,detail:{status:capture.status,detail:capture.detail}};
      await bind({plan:authored,model,composed,capture});
      row.status='ARCHIVE_BOUND';row.sizeClass='full';
      return finish();
    }
    if(authored.capability===ell.FIGURE_CAPABILITY){
      // A standalone axis-aligned ellipse figure: the exact foci/vertices/chords derived once, composed, read back by its own observer, then the same Archive capture.
      stage='ellipse';
      const model=await ell.solveEllipseFigure(authored),size=ell.ellipseFigureSize(model);
      stage='measure';
      const measured=await captureApi.measure({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',intrinsicSvg:size,runId:`pilot-measure-${tag}`});
      if(measured.status!=='MEASURED')throw {stage,detail:{status:measured.status,detail:measured.detail}};
      stage='compose';
      const composed=await ell.composeEllipseFigure({plan:authored,model,identity,typographyPolicy:measured.policy});
      if(composed.status!=='COMPOSED')throw {stage,detail:{status:composed.status,detail:composed.detail}};
      stage='capture';
      const capture=await captureApi.capture({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',composed,measuredPolicy:measured,alt:authored.caption||'',fixtureClassification:'PILOT_AUTHOR_PLAN_CANDIDATE',runId:`pilot-capture-${tag}`});
      if(capture.status!=='ARCHIVE_BOUND')throw {stage,detail:{status:capture.status,detail:capture.detail}};
      await bind({plan:authored,model,composed,capture});
      row.status='ARCHIVE_BOUND';row.sizeClass='full';
      return finish();
    }
    if(authored.capability==='composite-panels-v1'||authored.capability===chain.CHAIN_CAPABILITY||authored.capability===nlf.FIGURE_CAPABILITY||authored.capability===sol.SOLID_CAPABILITY){
      // Panels: frame -> model -> spec each; one Archive policy for the stacked size; L1 per panel inside the composite; then the same capture.
      stage='composite-panels';
      // A panel whose key point coordinates found no room retries once with only those coordinates in its band (as fallback 1 for one figure).
      // A quadratic inequality chain is the composite it stands for: its graph panel over its number-line panel (solved exactly first).
      // A standalone number-line figure (number-line-figure-v1) is the one-panel composite it stands for.
      stage=authored.capability===chain.CHAIN_CAPABILITY||authored.capability===nlf.FIGURE_CAPABILITY||authored.capability===sol.SOLID_CAPABILITY?'chain':stage;
      let current=authored.capability===chain.CHAIN_CAPABILITY?chain.expandInequalityChain(authored):authored.capability===nlf.FIGURE_CAPABILITY?nlf.expandNumberLineFigure(authored):authored.capability===sol.SOLID_CAPABILITY?sol.expandSolidFigure(authored):authored,checked,framedPanels,panelModels,plan,measured,composed;stage='composite-panels';
      for(let attempt=0;attempt<3;attempt++){
      const watch=stopwatch();
      where.plan=current;
      checked=comp.compositePanels(current);framedPanels=[];panelModels=[];const panelSizes=[];
      for(const panel of checked){
        if(comp.isPlanePanel(panel.plan)){
          // A plane-figure panel keeps the single PLANE_FIGURE_v1 pipeline: exact SymPy model, the same spec and its own marks observer.
          // A composite panel carries its caption beside the plan, so the plan gets it as its title like a graph panel does; without it
          // spec.title is undefined and the spec cannot be canonicalized (OUTPUT_NOT_CANONICAL:spec).
          const m=await pythonWorker({action:'construction',graph:panel.plan.mathPlan},{timeoutMs:90000});
          if(m.status!=='OK')throw {stage:'model',detail:{panel:panel.index,result:m.result}};
          const panelPlan={...panel.plan,caption:panel.plan.caption??comp.captionText(panel.caption)};
          const spec=tagPanel(()=>specFor(panelPlan,m.result,identity.assetId),panel.index);
          framedPanels.push({caption:panel.caption,plan:panelPlan});panelModels.push(m.result);
          panelSizes.push({width:spec.viewport.width,height:spec.viewport.height});continue;
        }
        if(comp.isSetPanel(panel.plan)){
          // A Venn panel: the exact regions derived once (like the standalone Venn), composed compact for the grid, read back by the set observer.
          const solved=sdg.solveDiagram(panel.plan.diagram);
          framedPanels.push({caption:panel.caption,plan:panel.plan});panelModels.push(solved);panelSizes.push(sdg.setDiagramSize(solved,{compact:true}));continue;
        }
        if(comp.isStatPanel(panel.plan)){
          // A statistics panel: the compact dot plot solved exactly like the standalone one, read back by the stat-chart observer inside the composite.
          const solved=scf.solveStatPanel(panel.plan.chart);
          framedPanels.push({caption:panel.caption,plan:panel.plan});panelModels.push(solved);panelSizes.push(scf.statChartSize(solved));continue;
        }
        if(comp.isSolidPanel(panel.plan)){
          const solved=sol.solveSolidFigure(panel.plan);
          framedPanels.push({caption:panel.caption,plan:panel.plan});panelModels.push(solved);panelSizes.push(sol.figurePanelSize(solved));continue;
        }
        if(comp.isNumberLinePanel(panel.plan)){
          const solved=chain.solveNumberLine(panel.plan.numberLine);
          framedPanels.push({caption:panel.caption,plan:panel.plan});panelModels.push(solved);panelSizes.push(chain.numberLinePanelSize(solved));continue;
        }
        const f=await pythonWorker({action:'frame_graph',graphPlan:panel.plan.graphPlan});if(f.status!=='OK'){const s=splitHint(f.result);throw {stage:'frame',detail:{panel:panel.index,result:s.result},...(s.hintData?{hintData:{...s.hintData,panel:panel.index}}:{})};}
        // A panel plan names its own figure: its caption defaults to the panel caption text (spec title).
        const panelPlan={...panel.plan,caption:panel.plan.caption??comp.captionText(panel.caption),graphPlan:f.result.graphPlan};
        const m=await pythonWorker({action:'graph',graphPlan:panelPlan.graphPlan});if(m.status!=='OK')throw {stage:'model',detail:{panel:panel.index,result:m.result}};
        const spec=tagPanel(()=>specFor(panelPlan,m.result,identity.assetId),panel.index);
        framedPanels.push({caption:panel.caption,plan:panelPlan});panelModels.push(m.result);
        panelSizes.push({width:spec.viewport.width,height:spec.viewport.height});
      }
      watch.lap('panels');
      plan={...current,panels:framedPanels};where.plan=plan;const stackLayout=comp.compositePanelLayout(checked,current);
      // The caption rows are as tall as the captions need at the measured font (E7): a figure whose captions fit keeps the standard row, so its measured size is the
      // first one; when the composed figure came out taller (or shorter) than measured, the policy is measured again for the size it really has and composed again.
      let captionRow=comp.COMPOSITE_CAPTION_ROW;
      for(let pass=0;pass<3;pass++){
        const {width,height}=comp.compositeStackSize(panelSizes,comp.compositeSharedRowCount(checked),stackLayout,captionRow);
        stage='measure';
        measured=await captureApi.measure({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',intrinsicSvg:{width,height},runId:`pilot-measure-${tag}${attempt?'-retry'+attempt:''}${pass?'-size'+pass:''}`});
        watch.lap('measure');
        if(measured.status!=='MEASURED')throw {stage,detail:{status:measured.status,detail:measured.detail}};
        stage='compose';
        composed=await comp.composeCompositeCandidate({plan,panels:framedPanels.map((panel,i)=>({plan:panel.plan,model:panelModels[i]})),identity,typographyPolicy:measured.policy,repairContext:{measuredPolicy:measured,sourceRef:fileRef(repo,meta.sourcePath)}});
        watch.lap('compose');
        const composedHeight=composed.status==='COMPOSED'?Number(/<svg [^>]*\sheight="([\d.]+)"/.exec(composed.svg)?.[1]):height;
        if(composed.status!=='COMPOSED'||!(composedHeight>0)||Math.abs(composedHeight-height)<1e-6)break;
        captionRow+=(composedHeight-height)/stackLayout.rows;
      }
      log.attempt({variant:attemptVariant(''),stage,ok:composed.status==='COMPOSED',code:errorCode(composed),detail:composed.detail??composed.status,fallback:row.fallback?.map(f=>f.to),watch});
      const failed=composed.status==='COMPOSITE_PANEL_NOT_COMPOSED'&&composed.detail?.status==='LAYOUT_INVENTORY_INCOMPLETE'?composed.detail:null;
      if(!failed||attempt===2)break;
      // A plane panel has no graph band or y-squeeze fallback: its own observer reports the label it could not place, and the panel fails as written.
      if(comp.isPlanePanel(current.panels[failed.panel].plan))break;
      const panelPlan=current.panels[failed.panel].plan,gp=panelPlan.graphPlan,keys=gp.requiredPoints||[],exact=gp.exactCoordinates||{};
      const bandable=point=>(Number.isSafeInteger(point?.x)&&Number.isSafeInteger(point?.y)||Object.hasOwn(exact,point?.id??''))&&/^[A-Z][0-9']?$/.test(point?.id);
      const stuck=(failed.detail?.unresolved||[]).map(id=>/^required-point-(\d+)-coordinates$/.exec(id)).filter(Boolean).map(m=>keys[Number(m[1])-1]).filter(bandable).map(point=>point.id).filter(id=>!(panelPlan.coordinatePanel||[]).includes(id));
      if(attempt===0&&stuck.length&&panelPlan.coordinatePlacement===undefined){
        (row.fallback??=[]).push({from:clip(composed.detail),to:'COORDINATE_PANEL_PARTIAL',panel:failed.panel,points:stuck});
        const retried={...panelPlan,coordinatePanel:[...(panelPlan.coordinatePanel||[]),...stuck],labelDirections:Object.fromEntries(Object.entries(panelPlan.labelDirections||{}).filter(([id])=>!stuck.includes(id)))};
        current={...current,panels:current.panels.map((panel,i)=>i===failed.panel?{...panel,plan:retried}:panel)};
        continue;
      }
      // Then that panel is re-framed with y squeezed (at most halved) for one more try.
      if(gp.axisSqueeze===true||gp.axisScale!==undefined)break;
      (row.fallback??=[]).push({from:clip(composed.detail),to:'AXIS_SQUEEZE',panel:failed.panel});
      current={...current,panels:current.panels.map((panel,i)=>i===failed.panel?{...panel,plan:{...panel.plan,graphPlan:{...panel.plan.graphPlan,axisSqueeze:true}}}:panel)};
      }
      const model={panels:panelModels};
      if(composed.status!=='COMPOSED')throw {stage,detail:{status:composed.status,detail:composed.detail}};
      // Each graph panel's final SVG must show the display names its plan gives (a number-line panel is read back by its own observer).
      stage='point-names';
      const panelSvgs=comp.compositePanelBytes(composed.svg);
      for(const [i,framed] of framedPanels.entries()){
        const expectations=planNameExpectations(framed.plan);if(!expectations.length)continue;
        const bytes=panelSvgs.find(item=>item.panel===i+1)?.bytes;
        const shown=bytes?observeDisplayedPointNames(bytes.toString('utf8'),expectations):{status:'FAIL',errors:['POINT_DISPLAY_NAME_PANEL_MISSING:'+(i+1)]};
        if(shown.status!=='PASS')throw {stage,detail:{code:'POINT_DISPLAY_NAME_MISMATCH',panel:i,errors:shown.errors}};
      }
      stage='capture';
      const capture=await captureApi.capture({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',composed,measuredPolicy:measured,alt:authored.caption||'',fixtureClassification:'PILOT_AUTHOR_PLAN_CANDIDATE',runId:`pilot-capture-${tag}`});
      if(capture.status!=='ARCHIVE_BOUND')throw {stage,detail:{status:capture.status,detail:capture.detail}};
      await bind({plan,model,composed,capture});
      row.status='ARCHIVE_BOUND';row.sizeClass='full';row.panels=checked.length;
      return finish();
    }
    let plan=authored;
    stage='frame';
    if(authored.graphPlan){const f=await pythonWorker({action:'frame_graph',graphPlan:authored.graphPlan});if(f.status!=='OK'){const s=splitHint(f.result);throw {stage,detail:s.result,...(s.hintData?{hintData:s.hintData}:{})};}plan={...authored,graphPlan:f.result.graphPlan};where.plan=plan;}
    stage='model';
    // A plane figure with non-special angles carries 22 digit rationals through its intersections: the exact model may need longer than the 10 s default.
    const m=await pythonWorker(plan.graphPlan?{action:'graph',graphPlan:plan.graphPlan}:{action:'construction',graph:plan.mathPlan},plan.graphPlan?undefined:{timeoutMs:90000});if(m.status!=='OK')throw {stage,detail:m.result};
    let model=m.result;
    // spec -> Archive policy -> L1, once; a construction plan whose labels found no room is retried once with coordinatePlacement PANEL.
    const attempt=async(candidatePlan,suffix,lastResort=false)=>{
      const watch=stopwatch();
      where.plan=candidatePlan;
      try{
      stage='spec';
      const spec=specFor(candidatePlan,model,identity.assetId);watch.lap('spec');// A plane figure carries angle arcs, ticks and expression labels: it is measured at the full profile like a coordinate figure.
      // A multi-curve figure (several curves at one scale, often tall and narrow) is requested at full like the other coordinate figures; the display profile it would
      // otherwise get at medium only shrinks the base font of a tall canvas. When full cannot be measured the figure keeps the earlier medium request.
      const multiCurve=candidatePlan.graphPlan?.family==='multi-curve';
      const fullRequested=['trigonometric','sqrt-affine'].includes(candidatePlan.graphPlan?.family)&&candidatePlan.graphPlan.displaySize==='full';
      let size=forceSizeClass??(surface==='PROBLEM_VISUAL'?'full':undefined)??(model.coordinateMode==='SOURCE_COORDINATES'||spec.displayFacts.formulaPlacement==='HEADER_BAND'||isPlaneFigure(candidatePlan)||multiCurve||fullRequested?'full':'medium');   // forceSizeClass: a test/diagnostic seam only (the CLI never sets it)
      stage='measure';
      const measure=(sizeClass,runSuffix='')=>captureApi.measure({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:sizeClass,intrinsicSvg:{width:spec.viewport.width,height:spec.viewport.height},runId:`pilot-measure-${tag}${suffix}${runSuffix}`});
      let measured=await measure(size);
      if(measured.status!=='MEASURED'&&multiCurve&&size==='full'&&forceSizeClass===undefined){size='medium';measured=await measure(size,'-medium');}
      // A wide family graph (520-610 px) cannot reach the requested profile font scale at medium; the same figure is retried once at full.
      if(measured.status!=='MEASURED'&&size==='medium'&&JSON.stringify(measured.detail??'').includes('REQUESTED_PROFILE_FONT_SCALE')){size='full';measured=await measure(size,'-full');}
      watch.lap('measure');
      if(measured.status!=='MEASURED')throw {stage,detail:{status:measured.status,detail:measured.detail}};
      stage='compose';
      const composed=await composeConstructionCandidate({plan:candidatePlan,model,identity,typographyPolicy:measured.policy,repairContext:{measuredPolicy:measured,sourceRef:fileRef(repo,meta.sourcePath)},...(lastResort?{lastResort:true}:{})});
      watch.lap('compose');
      log.attempt({variant:attemptVariant(suffix),stage,ok:composed.status==='COMPOSED',code:errorCode(composed),detail:composed.detail??composed.status,fallback:row.fallback?.map(f=>f.to),watch});
      return {size,measured,composed};
      }catch(error){
        // A thrown attempt (measure refused, composer crashed) is logged here; the render itself still fails exactly as before.
        log.attempt({variant:attemptVariant(suffix),stage:error?.stage??stage,ok:false,code:errorCode(error?.stage?error.detail:error?.message),detail:error?.stage?error.detail:error?.message,fallback:row.fallback?.map(f=>f.to),watch});
        throw error;
      }
    };
    let {size,measured,composed}=await attempt(plan,'');
    // Fallback 1: only the coordinates that found no room go to the band. Fallback 2: every coordinate goes to the band.
    // An explicit placement in the plan (coordinatePanel / labelDirections / coordinatePlacement) is never overridden: it composes or fails as written.
    // A band placement (coordinatePanel / coordinatePlacement) is never overridden. Direction hints alone allow fallback 1 (only stuck
    // points move to the band, the other hints stay) but not fallback 2 (everything to the band).
    const explicit=plan.coordinatePlacement!==undefined||plan.coordinatePanel!==undefined,directed=plan.labelDirections!==undefined;
    const keyPoints=plan.graphPlan?.requiredPoints||[],exactKeys=plan.graphPlan?.exactCoordinates||{},bandable=point=>(Number.isSafeInteger(point?.x)&&Number.isSafeInteger(point?.y)||Object.hasOwn(exactKeys,point?.id??''))&&/^[A-Z][0-9']?$/.test(point?.id);
    if(composed.status==='LAYOUT_INVENTORY_INCOMPLETE'&&((plan.mathPlan&&plan.coordinateLabels?.length)||(plan.graphPlan&&keyPoints.some(bandable)))&&!explicit){
      row.fallback=[];
      // Construction labels are <point>-coordinate; graph key point labels are required-point-<n>-coordinates (n counts from 1).
      const unresolvedIds=composed.detail?.unresolved||[];
      const stuck=(plan.graphPlan?unresolvedIds.map(id=>/^required-point-(\d+)-coordinates$/.exec(id)).filter(Boolean).map(m=>keyPoints[Number(m[1])-1]).filter(bandable).map(point=>point.id)
        :unresolvedIds.filter(id=>id.endsWith('-coordinate')).map(id=>id.slice(0,-'-coordinate'.length))).filter(id=>!(plan.coordinatePanel||[]).includes(id)&&!(plan.hiddenPointNames||[]).includes(id));
      // (G5b) Before the band: a coordinate that found no room beside its point takes the nearest free place on a leader from the dot (graph key points only).
      const leaderStuck=plan.graphPlan?unresolvedIds.map(id=>/^required-point-(\d+)-coordinates$/.exec(id)).filter(Boolean).map(m=>keyPoints[Number(m[1])-1]).filter(point=>point&&typeof point.id==='string').map(point=>point.id).filter(id=>!(plan.coordinatePanel||[]).includes(id)&&!(plan.coordinateLeader||[]).includes(id)):[];
      if(leaderStuck.length){
        const leaderPlan={...plan,coordinateLeader:[...(plan.coordinateLeader||[]),...leaderStuck]};
        let tried=null;
        try{tried=await attempt(leaderPlan,'-leader');}catch{tried=null;}
        if(tried&&tried.composed.status!=='LAYOUT_INVENTORY_INCOMPLETE'){
          row.fallback.push({from:clip(composed.detail),to:'COORDINATE_LEADER',points:leaderStuck});
          plan=leaderPlan;({size,measured,composed}=tried);
        }
      }
      if(composed.status==='LAYOUT_INVENTORY_INCOMPLETE'&&stuck.length){
        row.fallback.push({from:clip(composed.detail),to:'COORDINATE_PANEL_PARTIAL',points:stuck});
        plan={...plan,coordinatePanel:[...(plan.coordinatePanel||[]),...stuck],labelDirections:Object.fromEntries(Object.entries(plan.labelDirections||{}).filter(([id])=>!stuck.includes(id)))};
        ({size,measured,composed}=await attempt(plan,'-panel1'));
      }
      if(composed.status==='LAYOUT_INVENTORY_INCOMPLETE'&&!directed){
        row.fallback.push({from:clip(composed.detail),to:'COORDINATE_PANEL'});
        const {coordinatePanel,labelDirections,...rest}=plan;plan={...rest,coordinatePlacement:'PANEL'};
        ({size,measured,composed}=await attempt(plan,'-panel2'));
      }
    }
    // Fallback 3 (quadratic graphs): still no room at one scale -> re-frame with y squeezed (at most halved) and compose once more.
    if(composed.status==='LAYOUT_INVENTORY_INCOMPLETE'&&authored.graphPlan&&authored.graphPlan.axisSqueeze!==true&&authored.graphPlan.axisScale===undefined){
      const f=await pythonWorker({action:'frame_graph',graphPlan:{...authored.graphPlan,axisSqueeze:true}});
      if(f.status==='OK'&&f.result.graphPlan.axisRatio<1){
        const m2=await pythonWorker({action:'graph',graphPlan:f.result.graphPlan});
        if(m2.status==='OK'){
          (row.fallback??=[]).push({from:clip(composed.detail),to:'AXIS_SQUEEZE',axisRatio:f.result.graphPlan.axisRatio});
          plan={...plan,graphPlan:f.result.graphPlan};model=m2.result;
          ({size,measured,composed}=await attempt(plan,'-squeeze'));
        }
      }
    }
    // Fallback 4 (source-coordinate construction): still no room -> enlarge the canvas (framing only) once or twice, never beyond 720x600.
    if(composed.status==='LAYOUT_INVENTORY_INCOMPLETE'&&plan.mathPlan&&model.coordinateMode==='SOURCE_COORDINATES'&&plan.coordinateCanvas===undefined){
      for(const [w,h] of [[480,400],[600,500]]){
        (row.fallback??=[]).push({from:clip(composed.detail),to:'CANVAS_ENLARGE',canvas:[w,h]});
        plan={...plan,coordinateCanvas:{width:w,height:h}};
        ({size,measured,composed}=await attempt(plan,'-canvas'+w));
        if(composed.status!=='LAYOUT_INVENTORY_INCOMPLETE')break;
      }
    }
    // (CL) Last resort, only after every step above: the labels still without a place get one more composition in which a point name may take a leader across a thin stroke or two and a
    // segment label stops counting a longer segment lying over its own as a competitor. A figure that composed before is never touched; if this does not compose either, the failure stays as it was.
    if(composed.status==='LAYOUT_INVENTORY_INCOMPLETE'&&plan.mathPlan&&!plan.graphPlan){
      let last=null;
      try{last=await attempt(plan,'-last',true);}catch{last=null;}
      if(last&&last.composed.status==='COMPOSED'){(row.fallback??=[]).push({from:clip(composed.detail),to:'LAYOUT_LAST_RESORT'});({size,measured,composed}=last);}
    }
    row.layoutRepairs=composed.layoutRepairs?.length??0;
    if(composed.status!=='COMPOSED')throw {stage,detail:{status:composed.status,detail:composed.detail}};
    // The names the final SVG shows must be the plan's display names (read back from the glyphs, independent of the producer).
    stage='point-names';
    const shown=observeDisplayedPointNames(composed.svg,planNameExpectations(plan));
    if(shown.status!=='PASS')throw {stage,detail:{code:'POINT_DISPLAY_NAME_MISMATCH',errors:shown.errors}};
    stage='capture';
    const capture=await captureApi.capture({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:size,composed,measuredPolicy:measured,alt:plan.caption||'',fixtureClassification:'PILOT_AUTHOR_PLAN_CANDIDATE',runId:`pilot-capture-${tag}`});
    if(capture.status!=='ARCHIVE_BOUND')throw {stage,detail:{status:capture.status,detail:capture.detail}};
    await bind({plan,model,composed,capture});
    row.status='ARCHIVE_BOUND';row.sizeClass=size;
    return finish();
  }catch(error){
    row.status='FAILED';row.stage=error?.stage??stage;row.code=errorCode(error?.stage?error.detail:error?.message)??(error instanceof SyntaxError?'PLAN_JSON_INVALID':undefined);row.detail=error?.stage?clip(error.detail):String(error?.message||error).slice(0,600);
    // Extra fields for the author (roadmap 1-1): the whole detail, the errors list, the engine's hint and fix steps. They never replace or change row.detail above.
    try{
      const thrown=error?.stage?error.detail:String(error?.message||error);
      row.detailFull=fullText(thrown);row.errors=errorsOf(thrown);
      const guide=failureGuidance({code:row.code??null,detail:thrown,authored:where.authored,plan:where.plan,hintData:error?.hintData,fallback:(row.fallback??[]).map(f=>f.to)});
      if(guide.hint.length)row.hint=guide.hint;
      if(guide.fix.length)row.fix=guide.fix;
    }catch{/* the failure result itself must always be written */}
    return finish();
  }
}

const line=(r,name)=>JSON.stringify({item:name,status:r.status,stage:r.stage,detail:typeof r.detail==='string'?r.detail.slice(0,160):r.detail,fallback:Array.isArray(r.fallback)?r.fallback.map(f=>f.to).join('>'):undefined,code:r.code,hint:r.hint?.[0]?r.hint[0].slice(0,160):undefined,fix:r.fix?.length?true:undefined});

async function main(argv){
  const args={};
  for(let i=0;i<argv.length;i++){if(argv[i].startsWith('--'))args[argv[i].slice(2)]=argv[++i];}
  if(!args.out||!(args.manifest||(args.item&&args.plan))){
    console.error('usage: render-plan.mjs --item item.json --plan plan.json --out <outDir> [--packet-dir <dir>]\n       render-plan.mjs --manifest <packetDir> --out <outDir> [--packet-dir <dir>]');
    return 2;
  }
  fs.mkdirSync(args.out,{recursive:true});
  if(args.manifest){
    const manifest=JSON.parse(fs.readFileSync(args.manifest+'.manifest.json','utf8'));
    const results=[];
    for(const meta of manifest.items){
      const r=await renderPlan({item:meta,plan:path.join(args.manifest,meta.dir,'plan.json'),outDir:args.out,packetDir:args['packet-dir']});
      results.push({item:meta.dir,bucket:meta.bucket,fam:meta.fam,ordinal:meta.ordinal,...r});
      console.log(line(r,meta.dir));
    }
    fs.writeFileSync(path.join(args.out,'run-summary.json'),JSON.stringify(results,null,1)+'\n');
    return results.some(r=>r.status==='FAILED')?1:0;
  }
  const item=JSON.parse(fs.readFileSync(args.item,'utf8'));
  const r=await renderPlan({item,plan:args.plan,outDir:args.out,packetDir:args['packet-dir']});
  console.log(JSON.stringify(stdoutView(r)));
  return r.status==='FAILED'?1:0;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  main(process.argv.slice(2)).then(code=>process.exit(code),e=>{console.error(e);process.exit(1);});
}
