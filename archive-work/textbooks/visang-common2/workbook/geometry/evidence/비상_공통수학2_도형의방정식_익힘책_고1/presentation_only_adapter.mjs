import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { extractSvgGeometry, verifySvgGeometry } from '../../../../../../../archive/tools/pipeline-core/visual.mjs';
import { objectSha, fileRef } from '../../../../../../../archive/tools/pipeline-core/canonical.mjs';

const root=process.cwd();
const base='archive-work/textbooks/visang-common2/workbook/geometry';
const setKey='비상_공통수학2_도형의방정식_익힘책_고1';
const evidence=path.join(base,'evidence',setKey);
const pipelineEvidence=path.join(evidence,'pipeline-core');
const factDir=path.join(pipelineEvidence,'expected-facts');
const witnessDir=path.join(pipelineEvidence,'final-witnesses');
const jsPath=path.join(root,base,'js','비상_공통수학2_도형의방정식_익힘책_고1.js');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(jsPath,'utf8'),ctx);
const bank=ctx.window.questionBank;
const sha=value=>'sha256:'+crypto.createHash('sha256').update(value).digest('hex');
const annotations={
  '01':['AP:PB = 3:2'],
  '02':['G lies on x−y+3=0'],
  '04':['k=10: H(−2,−2); d=√13','k=−16: H₂(2,4); d=√13'],
  '05':['The line through C bisects the circle'],
  '06':['HC=2√10; CP=√10'],
  '07':['O=(1,2); circumradius=√5'],
  '08':['AB=6; AM=3; CM=4','CA²=3²+4²=25'],
  '09':['OT=5; r=√10','d(O,PQ)=2; schematic, no scale'],
  '10':['O is the midpoint of AP'],
  '12':['C′=(−3,3); r=3','The translated circle touches both axes'],
  '13':['A′B′=√74','P and Q are distinct crossings'],
  '14':['Translate by (−7,2)','Then reflect across the x-axis']
};
fs.mkdirSync(witnessDir,{recursive:true});
const rows=[];
const parityReportPath=path.join(pipelineEvidence,'v2_exact_geometry_parity_report.json');
const priorRows=fs.existsSync(parityReportPath)?new Map(JSON.parse(fs.readFileSync(parityReportPath,'utf8')).rows.map(row=>[row.id,row])):new Map();
for(let i=0;i<bank.length;i++){
  const q=bank[i];
  if(!q.solutionImage)continue;
  const no=String(i+1).padStart(2,'0');
  const factPath=path.join(factDir,'q'+no+'_expected.json');
  const fact=JSON.parse(fs.readFileSync(factPath,'utf8'));
  if(fact.questionUid!==q.id)throw new Error('FACT_UID_MISMATCH:q'+no);
  const svgPath=path.join(root,base,q.solutionImage);
  const svg=fs.readFileSync(svgPath,'utf8');
  const currentSha=sha(svg);
  const prior=priorRows.get(q.id);
  const finalWitnessPath=path.join(witnessDir,'q'+no+'_final_build_witness.json');
  if(no!=='01'&&prior&&prior.finalArtifactSha===currentSha&&fs.existsSync(finalWitnessPath)){
    const currentWitness=JSON.parse(fs.readFileSync(finalWitnessPath,'utf8'));
    if(currentWitness.artifactSha===currentSha&&currentWitness.presentationOnlyAdapter?.v2FinalParity==='PASS'){
      rows.push(prior);
      continue;
    }
  }
  if(no==='01'){
    const previous=priorRows.get(q.id);
    if(!previous||previous.geometryVerification!=='PASS')throw new Error('Q01_PRIOR_CORE_WITNESS_REQUIRED');
    const previousCoreWitnessPath=path.join(root,previous.coreGeneratorWitnessPath);
    const coreWitness=JSON.parse(fs.readFileSync(previousCoreWitnessPath,'utf8'));
    if(coreWitness.artifactSha!==previous.baseArtifactSha)throw new Error('Q01_CORE_WITNESS_BASE_SHA_MISMATCH');
    const priorFinalPath=path.join(root,base,'assets','images',setKey,'q01_geometry_core_final.svg');
    const priorFinalObservation=extractSvgGeometry(fs.readFileSync(priorFinalPath,'utf8'));
    const priorFinalParity=verifySvgGeometry(fact,priorFinalObservation);
    if(priorFinalParity.status!=='PASS')throw new Error('Q01_PRIOR_FINAL_V2_FAIL');
    const currentObservation=extractSvgGeometry(svg);
    const currentParity=verifySvgGeometry(fact,currentObservation);
    if(currentParity.status!=='PASS')throw new Error('Q01_COORDINATE_CONTEXT_V2_FAIL:'+JSON.stringify(currentParity.errors));
    const targetPrimitiveKey=primitive=>JSON.stringify(primitive);
    const currentPrimitiveSet=new Set(currentObservation.primitives.map(targetPrimitiveKey));
    if(priorFinalObservation.primitives.some(primitive=>!currentPrimitiveSet.has(targetPrimitiveKey(primitive))))throw new Error('Q01_TARGET_GEOMETRY_CHANGED');
    const repairEvidencePath=path.join(pipelineEvidence,'q01_coordinate_context_repair.json');
    const repairEvidence=JSON.parse(fs.readFileSync(repairEvidencePath,'utf8'));
    if(repairEvidence.artifactSha!==currentSha||repairEvidence.v2GeometryParity!=='PASS'||repairEvidence.sourceTargetPrimitivesPreserved!==true)throw new Error('Q01_COORDINATE_CONTEXT_EVIDENCE_MISMATCH');
    const finalWitness={...coreWitness,artifactSha:currentSha,presentationOnlyAdapter:{path:path.relative(root,path.join(evidence,'presentation_only_adapter.mjs')).replaceAll('\\','/'),adapterSha:sha(fs.readFileSync(path.join(evidence,'presentation_only_adapter.mjs'))),baseArtifactSha:previous.baseArtifactSha,sourcePresentationArtifactSha:previous.finalArtifactSha,coordinateGeometryChanged:false,textOnlyChanges:false,coordinateContextAdded:true,targetGeometryPrimitivesPreserved:true,coordinateContextEvidence:fileRef(root,path.relative(root,repairEvidencePath).replaceAll('\\','/')),v2FinalParity:currentParity.status}};
    fs.writeFileSync(finalWitnessPath,JSON.stringify(finalWitness,null,2),'utf8');
    rows.push({...previous,expectedFactPath:path.relative(root,factPath).replaceAll('\\','/'),expectedFactSha:sha(fs.readFileSync(factPath)),coreGeneratorWitnessPath:path.relative(root,previousCoreWitnessPath).replaceAll('\\','/'),coreGeneratorWitnessSha:sha(fs.readFileSync(previousCoreWitnessPath)),finalArtifactPath:path.relative(root,svgPath).replaceAll('\\','/'),finalArtifactSha:currentSha,finalWitnessPath:path.relative(root,finalWitnessPath).replaceAll('\\','/'),observedPrimitiveCount:currentObservation.primitives.length,geometryVerification:currentParity.status,textOnlyAdapter:false,coordinateGeometryChanged:false,coordinateContextAdded:true,coordinateTextReplacements:0,addedTextAnnotations:['A (2, −3)','P (5, 3)','B (7, 7)','AP:PB = 3:2']});
    continue;
  }
  const baseSha=sha(svg);
  const baseObservation=extractSvgGeometry(svg);
  const baseParity=verifySvgGeometry(fact,baseObservation);
  if(baseParity.status!=='PASS')throw new Error('BASE_V2_FAIL:q'+no+':'+JSON.stringify(baseParity.errors));
  const dimension=/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/.exec(svg);
  if(!dimension)throw new Error('SVG_VIEWBOX_MISSING:q'+no);
  const width=Number(dimension[1]),height=Number(dimension[2]);
  let adapted=svg.replace('<g font-family="Arial, sans-serif">','<g font-family="Noto Sans KR, Pretendard, Apple SD Gothic Neo, Malgun Gothic, sans-serif">');
  adapted=adapted.replace(/<svg\b([^>]*)>/,(_m,attrs)=>'<svg'+attrs+
    ' data-geometry-style-version="AP_GEOMETRY_PRINT_V1_0_DRAFT"'+
    ' data-geometry-mode="GEOMETRY"'+
    ' data-geometry-preset="PIPELINE_CORE_GEOMETRY"'+
    ' data-geometry-fact-hash="'+objectSha(fact)+'"'+
    ' data-visual-provenance="pipeline-core-generator+presentation-only-text"'+'>');
  adapted=adapted.replace(/<title id="title">[\s\S]*?<\/title>/,'<title id="title">'+escapeXml('도형의 방정식 '+no+'번 풀이 그림')+'</title>');
  adapted=adapted.replace(/<desc id="desc">[\s\S]*?<\/desc>/,'<desc id="desc">'+escapeXml(q.solutionImageAlt||'풀이에 사용한 도형의 관계를 나타낸다.')+'</desc>');
  const coordinateReplacements=[];
  adapted=adapted.replace(/(<text\b[^>]*>)([\s\S]*?)(<\/text>)/g,(_m,open,text,close)=>{
    let next=text.replace(/([A-Za-z][A-Za-z0-9_]*)\([^()]*\)/g,'$1');
    next=next.replace(/,\s*r=-?\d+(?:\.\d+)?/g,'');
    if(next!==text)coordinateReplacements.push({before:text,after:next});
    return open+next+close;
  });
  const lines=annotations[no]||[];
  if(no==='14'){
    adapted=adapted.replace(/<text\b[^>]*>[\s\S]*?<\/text>/g,'');
    coordinateReplacements.push({presentation:'removed dense point and segment coordinate legend; geometry primitives unchanged'});
  }
  let labels=lines.map((line,j)=>'<text data-role="presentationAnnotation" x="180" y="'+(height-10-(lines.length-1-j)*16)+'" text-anchor="middle" font-family="Noto Sans KR, Pretendard, Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="11" fill="#111">'+escapeXml(line)+'</text>').join('');
  if(no==='14'){
    labels+='<text data-role="stageLabel" x="276" y="65" text-anchor="middle" font-family="Noto Sans KR, sans-serif" font-size="14" font-style="italic" fill="#111">f</text>';
    labels+='<text data-role="stageLabel" x="111" y="31" text-anchor="middle" font-family="Noto Sans KR, sans-serif" font-size="14" font-style="italic" fill="#555">f₁</text>';
    labels+='<text data-role="stageLabel" x="111" y="283" text-anchor="middle" font-family="Noto Sans KR, sans-serif" font-size="14" font-style="italic" fill="#111">g</text>';
  }
  adapted=adapted.replace('</g></svg>',labels+'</g></svg>');
  const finalObservation=extractSvgGeometry(adapted);
  const finalParity=verifySvgGeometry(fact,finalObservation);
  if(finalParity.status!=='PASS')throw new Error('FINAL_V2_FAIL:q'+no+':'+JSON.stringify(finalParity.errors));
  fs.writeFileSync(svgPath,adapted,'utf8');
  const finalSha=sha(adapted);
  const witnessCandidates=fs.readdirSync(pipelineEvidence).filter(name=>/^build-q[0-9]+(?:-[a-z0-9-]+)?\.json$/i.test(name)&&name.startsWith('build-q'+no+'-'));
  const matchedWitness=witnessCandidates.map(name=>({name,witness:JSON.parse(fs.readFileSync(path.join(pipelineEvidence,name),'utf8'))})).find(row=>row.witness.artifactSha===baseSha);
  if(!matchedWitness)throw new Error('GENERATOR_WITNESS_BASE_SHA_MISMATCH:q'+no+':'+baseSha);
  const baseWitnessPath=path.join(pipelineEvidence,matchedWitness.name);
  const witness=matchedWitness.witness;
  const finalWitness={...witness,artifactSha:finalSha,presentationOnlyAdapter:{path:'archive-work/textbooks/visang-common2/workbook/geometry/evidence/'+setKey+'/presentation_only_adapter.mjs',adapterSha:sha(fs.readFileSync(path.join(evidence,'presentation_only_adapter.mjs'))),baseArtifactSha:baseSha,coordinateGeometryChanged:false,textOnlyChanges:true,coordinateReplacements,addedTextAnnotations:lines,v2FinalParity:finalParity.status}};
  fs.writeFileSync(finalWitnessPath,JSON.stringify(finalWitness,null,2),'utf8');
  rows.push({displayNo:no,id:q.id,questionUid:fact.questionUid,expectedFactPath:path.relative(root,factPath).replaceAll('\\','/'),expectedFactSha:sha(fs.readFileSync(factPath)),coreGeneratorWitnessPath:path.relative(root,baseWitnessPath).replaceAll('\\','/'),coreGeneratorWitnessSha:sha(fs.readFileSync(baseWitnessPath)),baseArtifactSha:baseSha,finalArtifactPath:path.relative(root,svgPath).replaceAll('\\','/'),finalArtifactSha:finalSha,finalWitnessPath:path.relative(root,finalWitnessPath).replaceAll('\\','/'),observedPrimitiveCount:finalObservation.primitives.length,geometryVerification:finalParity.status,textOnlyAdapter:true,coordinateGeometryChanged:false,coordinateTextReplacements:coordinateReplacements.length,addedTextAnnotations:lines});
}
fs.writeFileSync(path.join(pipelineEvidence,'v2_exact_geometry_parity_report.json'),JSON.stringify({status:rows.every(r=>r.geometryVerification==='PASS')?'PASS':'FAIL',verification:'pipeline-core visual.mjs extractSvgGeometry + verifySvgGeometry on final presentation-adapted SVG bytes',visualCount:rows.length,rows},null,2),'utf8');
console.log(JSON.stringify({visualCount:rows.length,pass:rows.filter(r=>r.geometryVerification==='PASS').length,rows:rows.map(r=>({q:r.displayNo,status:r.geometryVerification,sha:r.finalArtifactSha}))},null,2));

function escapeXml(value){
  return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}
