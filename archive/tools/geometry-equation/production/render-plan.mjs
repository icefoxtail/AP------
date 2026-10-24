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
import {composeConstructionCandidate} from './construction-candidate-svg-v1.mjs';
import * as cap from './construction-archive-capture-v1.mjs';
import * as obs from './archive-inverse-observation-v1.mjs';
import {fileRef} from '../../pipeline-core/canonical.mjs';
import * as comp from './composite-candidate-svg-v1.mjs';
import * as chain from './quadratic-inequality-chain-v1.mjs';

// The git worktree root: production/ -> geometry-equation/ -> tools/ -> archive/ -> root.
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../../').replace(/\\/g,'/')+'/';
const clip=v=>JSON.stringify(v??null).slice(0,600);

// plan: a parsed plan object, or a path to plan.json. Returns the result record (also written as <name>-result.json).
export async function renderPlan({item,plan:planInput,outDir,packetDir}){
  fs.mkdirSync(outDir,{recursive:true});
  const meta={...item};
  const name=String(meta.dir??meta.tag??'figure');
  const tag=crypto.randomUUID().slice(0,8);
  const row={item:name,status:undefined};
  let stage='read-plan';
  const write=(file,text)=>fs.writeFileSync(path.join(outDir,file),text);
  const finish=()=>{
    const result={status:row.status,stage:row.stage,detail:row.detail,capability:row.capability,sizeClass:row.sizeClass,fallback:row.fallback,layoutRepairs:row.layoutRepairs,panels:row.panels,identity:row.identity};
    write(`${name}-result.json`,JSON.stringify(result,null,1)+'\n');
    return result;
  };
  try{
    if(typeof meta.sourcePath!=='string'||!Number.isSafeInteger(meta.ordinal))throw new Error('item needs sourcePath (string) and ordinal (integer)');
    const examUid=path.basename(meta.sourcePath,'.js');
    const identity=assetIdentity(`${examUid}|${meta.ordinal}`,'SOLUTION_VISUAL','decisive-relation');
    row.identity=identity;
    process.env.APMS_DRAFT_TAG=name;
    let authored=planInput;
    if(typeof authored==='string'){
      if(!fs.existsSync(authored))throw new Error(`plan file not found: ${authored}`);
      authored=JSON.parse(fs.readFileSync(authored,'utf8'));
    }
    if(!authored||typeof authored!=='object')throw new Error('plan missing or not an object');
    if(authored.status==='EXEMPT'||authored.status==='UNSUPPORTED'){row.status=authored.status;row.detail=authored.reason;return finish();}
    row.capability=authored.capability;
    // Writes the shared success outputs (state, svg, optional observer packet).
    const bind=async({plan,model,composed,capture})=>{
      stage='packet';
      let packet;
      if(packetDir)packet=await obs.prepareInverseObservationPacket({capture,packetDir:path.join(packetDir,`packet-${name}-${tag}`)});
      write(`${name}-state.json`,JSON.stringify({meta,identity,plan,model,composed,capture,packetDir:packet?.packetDir,packetSha256:packet?.packetSha256},null,1));
      write(`${name}-solution.svg`,composed.svg);
    };
    if(authored.capability==='composite-panels-v1'||authored.capability===chain.CHAIN_CAPABILITY){
      // Panels: frame -> model -> spec each; one Archive policy for the stacked size; L1 per panel inside the composite; then the same capture.
      stage='composite-panels';
      // A panel whose key point coordinates found no room retries once with only those coordinates in its band (as fallback 1 for one figure).
      // A quadratic inequality chain is the composite it stands for: its graph panel over its number-line panel (solved exactly first).
      stage=authored.capability===chain.CHAIN_CAPABILITY?'chain':stage;
      let current=authored.capability===chain.CHAIN_CAPABILITY?chain.expandInequalityChain(authored):authored,checked,framedPanels,panelModels,plan,measured,composed;stage='composite-panels';
      for(let attempt=0;attempt<3;attempt++){
      checked=comp.compositePanels(current);framedPanels=[];panelModels=[];const panelSizes=[];
      for(const panel of checked){
        if(comp.isNumberLinePanel(panel.plan)){
          const solved=chain.solveQuadraticInequality(panel.plan.numberLine);
          framedPanels.push({caption:panel.caption,plan:panel.plan});panelModels.push(solved);panelSizes.push(chain.numberLinePanelSize(solved));continue;
        }
        const f=await pythonWorker({action:'frame_graph',graphPlan:panel.plan.graphPlan});if(f.status!=='OK')throw {stage:'frame',detail:{panel:panel.index,result:f.result}};
        // A panel plan names its own figure: its caption defaults to the panel caption text (spec title).
        const panelPlan={...panel.plan,caption:panel.plan.caption??comp.captionText(panel.caption),graphPlan:f.result.graphPlan};
        const m=await pythonWorker({action:'graph',graphPlan:panelPlan.graphPlan});if(m.status!=='OK')throw {stage:'model',detail:{panel:panel.index,result:m.result}};
        const spec=specFor(panelPlan,m.result,identity.assetId);
        framedPanels.push({caption:panel.caption,plan:panelPlan});panelModels.push(m.result);
        panelSizes.push({width:spec.viewport.width,height:spec.viewport.height});
      }
      plan={...current,panels:framedPanels};const {width,height}=comp.compositeStackSize(panelSizes,comp.compositeSharedRowCount(checked));
      stage='measure';
      measured=await cap.measureArchiveTypographyPolicy({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',intrinsicSvg:{width,height},runId:`pilot-measure-${tag}${attempt?'-retry'+attempt:''}`});
      if(measured.status!=='MEASURED')throw {stage,detail:{status:measured.status,detail:measured.detail}};
      stage='compose';
      composed=await comp.composeCompositeCandidate({plan,panels:framedPanels.map((panel,i)=>({plan:panel.plan,model:panelModels[i]})),identity,typographyPolicy:measured.policy,repairContext:{measuredPolicy:measured,sourceRef:fileRef(repo,meta.sourcePath)}});
      const failed=composed.status==='COMPOSITE_PANEL_NOT_COMPOSED'&&composed.detail?.status==='LAYOUT_INVENTORY_INCOMPLETE'?composed.detail:null;
      if(!failed||attempt===2)break;
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
      if(gp.axisSqueeze===true)break;
      (row.fallback??=[]).push({from:clip(composed.detail),to:'AXIS_SQUEEZE',panel:failed.panel});
      current={...current,panels:current.panels.map((panel,i)=>i===failed.panel?{...panel,plan:{...panel.plan,graphPlan:{...panel.plan.graphPlan,axisSqueeze:true}}}:panel)};
      }
      const model={panels:panelModels};
      if(composed.status!=='COMPOSED')throw {stage,detail:{status:composed.status,detail:composed.detail}};
      stage='capture';
      const capture=await cap.captureArchiveCandidate({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:'full',composed,measuredPolicy:measured,alt:authored.caption||'',fixtureClassification:'PILOT_AUTHOR_PLAN_CANDIDATE',runId:`pilot-capture-${tag}`});
      if(capture.status!=='ARCHIVE_BOUND')throw {stage,detail:{status:capture.status,detail:capture.detail}};
      await bind({plan,model,composed,capture});
      row.status='ARCHIVE_BOUND';row.sizeClass='full';row.panels=checked.length;
      return finish();
    }
    let plan=authored;
    stage='frame';
    if(authored.graphPlan){const f=await pythonWorker({action:'frame_graph',graphPlan:authored.graphPlan});if(f.status!=='OK')throw {stage,detail:f.result};plan={...authored,graphPlan:f.result.graphPlan};}
    stage='model';
    const m=await pythonWorker(plan.graphPlan?{action:'graph',graphPlan:plan.graphPlan}:{action:'construction',graph:plan.mathPlan});if(m.status!=='OK')throw {stage,detail:m.result};
    let model=m.result;
    // spec -> Archive policy -> L1, once; a construction plan whose labels found no room is retried once with coordinatePlacement PANEL.
    const attempt=async(candidatePlan,suffix)=>{
      stage='spec';
      const spec=specFor(candidatePlan,model,identity.assetId),size=model.coordinateMode==='SOURCE_COORDINATES'||spec.displayFacts.formulaPlacement==='HEADER_BAND'?'full':'medium';
      stage='measure';
      const measured=await cap.measureArchiveTypographyPolicy({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:size,intrinsicSvg:{width:spec.viewport.width,height:spec.viewport.height},runId:`pilot-measure-${tag}${suffix}`});
      if(measured.status!=='MEASURED')throw {stage,detail:{status:measured.status,detail:measured.detail}};
      stage='compose';
      const composed=await composeConstructionCandidate({plan:candidatePlan,model,identity,typographyPolicy:measured.policy,repairContext:{measuredPolicy:measured,sourceRef:fileRef(repo,meta.sourcePath)}});
      return {size,measured,composed};
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
        :unresolvedIds.filter(id=>id.endsWith('-coordinate')).map(id=>id.slice(0,-'-coordinate'.length))).filter(id=>!(plan.coordinatePanel||[]).includes(id));
      if(stuck.length){
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
    if(composed.status==='LAYOUT_INVENTORY_INCOMPLETE'&&authored.graphPlan&&authored.graphPlan.axisSqueeze!==true){
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
    row.layoutRepairs=composed.layoutRepairs?.length??0;
    if(composed.status!=='COMPOSED')throw {stage,detail:{status:composed.status,detail:composed.detail}};
    stage='capture';
    const capture=await cap.captureArchiveCandidate({identity,sourcePath:meta.sourcePath,ordinal:meta.ordinal,requestedSizeClass:size,composed,measuredPolicy:measured,alt:plan.caption||'',fixtureClassification:'PILOT_AUTHOR_PLAN_CANDIDATE',runId:`pilot-capture-${tag}`});
    if(capture.status!=='ARCHIVE_BOUND')throw {stage,detail:{status:capture.status,detail:capture.detail}};
    await bind({plan,model,composed,capture});
    row.status='ARCHIVE_BOUND';row.sizeClass=size;
    return finish();
  }catch(error){
    row.status='FAILED';row.stage=error?.stage??stage;row.detail=error?.stage?clip(error.detail):String(error?.message||error).slice(0,600);
    return finish();
  }
}

const line=(r,name)=>JSON.stringify({item:name,status:r.status,stage:r.stage,detail:typeof r.detail==='string'?r.detail.slice(0,160):r.detail,fallback:Array.isArray(r.fallback)?r.fallback.map(f=>f.to).join('>'):undefined});

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
  console.log(JSON.stringify(r));
  return r.status==='FAILED'?1:0;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  main(process.argv.slice(2)).then(code=>process.exit(code),e=>{console.error(e);process.exit(1);});
}
