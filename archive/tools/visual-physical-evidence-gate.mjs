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
  req(item.pythonInputs && typeof item.pythonInputs==='object','MISSING_PYTHON_INPUTS',ctx);
  req(item.pythonCalculatedOutputs && typeof item.pythonCalculatedOutputs==='object','MISSING_PYTHON_OUTPUTS',ctx);
  req(item.coordinateModel && typeof item.coordinateModel==='object','MISSING_COORDINATE_MODEL',ctx);
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
