#!/usr/bin/env node
import fs from 'node:fs';

const args=process.argv.slice(2);
const arg=(name, fallback=null)=>{const i=args.indexOf(name); return i>=0 ? args[i+1] : fallback;};
const evidencePath=arg('--evidence');
const triagePath=arg('--triage');
const minCss=Number(arg('--min-css-font-px','11'));
if(!evidencePath){console.error('usage: node archive/tools/visual-physical-evidence-gate.mjs --evidence <json> [--triage <json>] [--min-css-font-px 11]');process.exit(2);}

const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const evidence=readJson(evidencePath);
const items=Array.isArray(evidence.items)?evidence.items:Array.isArray(evidence)?evidence:[];
const failures=[];
const req=(ok, code, ctx)=>{if(!ok) failures.push({code,...ctx});};

for(const item of items){
  const ctx={qid:item.qid,assetPath:item.assetPath};
  req(typeof item.finalSvgSha256==='string' && item.finalSvgSha256.startsWith('sha256:'),'MISSING_FINAL_SVG_SHA256',ctx);
  req(typeof item.finalSvgGitBlobSha==='string' && item.finalSvgGitBlobSha.length>10,'MISSING_FINAL_SVG_GIT_BLOB',ctx);
  req(Array.isArray(item.expectedFacts) && item.expectedFacts.length>0,'MISSING_EXPECTED_FACTS',ctx);
  if(Array.isArray(item.expectedFacts)){
    for(const fact of item.expectedFacts){
      req(['GIVEN','DERIVED_INTERMEDIATE','CONCLUSION'].includes(fact.role),'EXPECTED_FACT_ROLE_MISSING_OR_INVALID',{...ctx,factId:fact.id,role:fact.role});
    }
  }
  const coverage=item.expectedFactCompleteness;
  req(coverage && typeof coverage==='object','EXPECTED_FACT_COMPLETENESS_MISSING',ctx);
  if(coverage){
    req(Array.isArray(coverage.sourceConditionCoverage) && coverage.sourceConditionCoverage.length>0,'SOURCE_CONDITION_COVERAGE_MISSING',ctx);
    req(coverage.decisiveRelationCovered===true,'DECISIVE_RELATION_NOT_COVERED',ctx);
    req(Array.isArray(coverage.uncoveredCriticalConditions),'UNCOVERED_CRITICAL_CONDITIONS_MISSING',ctx);
    if(Array.isArray(coverage.uncoveredCriticalConditions)) req(coverage.uncoveredCriticalConditions.length===0,'UNCOVERED_CRITICAL_CONDITION',{...ctx,conditions:coverage.uncoveredCriticalConditions});
    req(coverage.expectedFactCompletenessStatus==='PASS','EXPECTED_FACT_COMPLETENESS_FAIL',ctx);
  }
  const identity=item.sourceSemanticIdentity;
  req(identity && typeof identity==='object','SOURCE_SEMANTIC_IDENTITY_EVIDENCE_MISSING',ctx);
  if(identity){
    req(typeof identity.applicable==='boolean','SOURCE_SEMANTIC_IDENTITY_APPLICABILITY_MISSING',ctx);
    if(identity.applicable){
      req(Array.isArray(identity.checks) && identity.checks.length>0,'SOURCE_SEMANTIC_IDENTITY_CHECKS_MISSING',ctx);
      for(const check of (identity.checks||[])){
        req(check.result==='PASS','SOURCE_SEMANTIC_IDENTITY_DRIFT',{...ctx,semanticRole:check.semanticRole,sourceLabel:check.sourceLabel,artifactLabel:check.artifactLabel});
        if(!check.renamingAuthorized) req(check.sourceLabel===check.artifactLabel,'SOURCE_SEMANTIC_LABEL_CHANGED',{...ctx,semanticRole:check.semanticRole,sourceLabel:check.sourceLabel,artifactLabel:check.artifactLabel});
      }
    } else {
      req(typeof identity.notApplicableReason==='string' && identity.notApplicableReason.trim().length>0,'SOURCE_SEMANTIC_IDENTITY_NA_REASON_MISSING',ctx);
    }
  }
  req(Array.isArray(item.factVisualizations),'FACT_VISUALIZATIONS_MISSING',ctx);
  if(Array.isArray(item.factVisualizations) && Array.isArray(item.expectedFacts)){
    const roleById=new Map(item.expectedFacts.map(f=>[f.id,f.role]));
    for(const fv of item.factVisualizations){
      req(roleById.has(fv.factId),'FACT_VISUALIZATION_UNKNOWN_FACT',{...ctx,factId:fv.factId});
      req(['GIVEN_STYLE','DERIVED_STYLE','CONCLUSION_STYLE','NOT_RENDERED'].includes(fv.encodingRole),'FACT_VISUALIZATION_ROLE_INVALID',{...ctx,factId:fv.factId,encodingRole:fv.encodingRole});
      if(roleById.get(fv.factId)==='CONCLUSION') req(fv.encodingRole!=='GIVEN_STYLE','CONCLUSION_AS_GIVEN_VISUAL',{...ctx,factId:fv.factId});
    }
  }
  req(item.pythonInputs && typeof item.pythonInputs==='object','MISSING_PYTHON_INPUTS',ctx);
  req(item.pythonCalculatedOutputs && typeof item.pythonCalculatedOutputs==='object','MISSING_PYTHON_OUTPUTS',ctx);
  req(item.coordinateModel && typeof item.coordinateModel==='object','MISSING_COORDINATE_MODEL',ctx);
  req(typeof item.visualSemanticType==='string' && item.visualSemanticType.length>0,'VISUAL_SEMANTIC_TYPE_MISSING',ctx);
  if(item.visualSemanticType==='COORDINATE_GRAPH'){
    const frame=item.coordinateFrameEvidence;
    req(frame && typeof frame==='object','COORDINATE_FRAME_EVIDENCE_MISSING',ctx);
    if(frame){
      req(frame.result==='PASS','COORDINATE_FRAME_FALSE_PASS',ctx);
      req(Number.isFinite(Number(frame.xAxisHorizontalResidual)) && Number(frame.xAxisHorizontalResidual)<=Number(frame.tolerance??1e-6),'X_AXIS_NOT_HORIZONTAL',{...ctx,observed:frame.xAxisHorizontalResidual});
      req(Number.isFinite(Number(frame.yAxisVerticalResidual)) && Number(frame.yAxisVerticalResidual)<=Number(frame.tolerance??1e-6),'Y_AXIS_NOT_VERTICAL',{...ctx,observed:frame.yAxisVerticalResidual});
      req(Number.isFinite(Number(frame.axisOrthogonalityResidual)) && Number(frame.axisOrthogonalityResidual)<=Number(frame.tolerance??1e-6),'AXES_NOT_ORTHOGONAL',{...ctx,observed:frame.axisOrthogonalityResidual});
      req(Number.isFinite(Number(frame.originIntersectionDeltaPx)) && Number(frame.originIntersectionDeltaPx)<=Number(frame.originTolerancePx??0.5),'AXES_ORIGIN_INTERSECTION_FAIL',{...ctx,observed:frame.originIntersectionDeltaPx});
      req(frame.sameCoordinateFrame===true,'PLOT_NOT_IN_AXIS_COORDINATE_FRAME',ctx);
    }
  }
  req(Array.isArray(item.actualSvgPrimitives) && item.actualSvgPrimitives.length>0,'MISSING_ACTUAL_SVG_PRIMITIVES',ctx);
  req(Array.isArray(item.observedFacts) && item.observedFacts.length>0,'MISSING_OBSERVED_FACTS',ctx);
  if(Array.isArray(item.observedFacts)) for(const fact of item.observedFacts) req(fact.result==='PASS','OBSERVED_FACT_FAIL',{...ctx,factId:fact.id,result:fact.result});
  req(item.labelOwnerBindings && typeof item.labelOwnerBindings==='object','MISSING_LABEL_OWNER_BINDINGS',ctx);
  req(item.xmlParse?.result==='PASS','XML_PARSE_FAIL',ctx);

  if(item.browserRenderStatus==='PASS'){
    const b=item.browserRenderEvidence;
    req(!!b,'MISSING_BROWSER_RAW_EVIDENCE',ctx);
    req(!b?.svgSha256 || b.svgSha256===item.finalSvgSha256,'BROWSER_SVG_SHA_MISMATCH',ctx);
    const labels=Array.isArray(b?.labels)?b.labels:[];
    for(const label of labels){
      const px=Number(label.finalViewportCssFontPx);
      req(Number.isFinite(px),'MISSING_FINAL_VIEWPORT_FONT_PX',{...ctx,labelId:label.id,text:label.text});
      if(Number.isFinite(px)) req(px>=minCss,'FINAL_VIEWPORT_FONT_TOO_SMALL',{...ctx,labelId:label.id,text:label.text,observed:px,minimum:minCss});
    }
  }
}

if(Number.isFinite(evidence.denominator)) req(evidence.denominator===items.length,'EVIDENCE_DENOMINATOR_MISMATCH',{declared:evidence.denominator,actual:items.length});

if(triagePath){
  const triage=readJson(triagePath);
  const rows=Array.isArray(triage.triage)?triage.triage:[];
  req(triage.denominator===rows.length,'TRIAGE_DENOMINATOR_MISMATCH',{declared:triage.denominator,actual:rows.length});
  for(const row of rows){
    const ctx={qid:row.qid,questionUid:row.questionUid};
    req(typeof row.action==='string','TRIAGE_ACTION_MISSING',ctx);
    req(typeof row.oneLineReason==='string' && row.oneLineReason.trim().length>0,'TRIAGE_REASON_MISSING',ctx);
    req(typeof row.decisiveRelation==='string' && row.decisiveRelation.trim().length>0,'TRIAGE_DECISIVE_RELATION_MISSING',ctx);
    if(row.action==='ADD'){
      const mb=row.marginalBenefitEvidence;
      req(!!mb,'ADD_MARGINAL_BENEFIT_EVIDENCE_MISSING',ctx);
      if(mb){
        req(typeof mb.sourceFigurePresence==='string','ADD_SOURCE_FIGURE_PRESENCE_MISSING',ctx);
        req(typeof mb.sourceFigureSufficiency==='string','ADD_SOURCE_FIGURE_SUFFICIENCY_MISSING',ctx);
        req(Array.isArray(mb.newVisualInformation) && mb.newVisualInformation.length>0,'ADD_NEW_VISUAL_INFORMATION_MISSING',ctx);
        req(typeof mb.marginalBenefitReason==='string' && mb.marginalBenefitReason.trim().length>0,'ADD_MARGINAL_BENEFIT_REASON_MISSING',ctx);
      }
    }
  }
}

const result={schemaVersion:'APMATH_VISUAL_PHYSICAL_EVIDENCE_GATE_v1',evidencePath,triagePath,minCssFontPx:minCss,itemCount:items.length,failCount:failures.length,status:failures.length===0?'PASS':'FAIL',failures};
console.log(JSON.stringify(result,null,2));
process.exit(failures.length===0?0:1);
