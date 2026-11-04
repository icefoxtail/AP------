// ROOT-only metadata upgrade. Paths in the manifest are repository-relative.
// --manifest rows.json --audit-dir .tmp/svg-m1/runs/<new-directory>
// Rows: {key,assetPath,expectedSha256,titleKo,descriptionKo,sourcePath,
//        sourceRun,sourceReviewedPublishSha256,outputSvg?}; output defaults to assetPath.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import portable from './portable-root.cjs';
import {upgradeSvgAccessibility,verifySvgAccessibilityUpgrade} from '../../production/svg-accessibility-v1.mjs';

const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const readJson=file=>JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));
const normalizeSha=value=>typeof value==='string'?value.toLowerCase().replace(/^sha256:/,''):'';

export function upgradeBatch({manifestPath,auditDir,repoRoot=portable.repoRoot()}){
  const root=path.resolve(repoRoot),resolve=value=>{if(typeof value!=='string'||!value)throw Error('Missing manifest path');return path.resolve(root,value);};
  const manifest=resolve(manifestPath),audit=resolve(auditDir),auditRoot=path.join(root,'.tmp','svg-m1','runs');
  if(!audit.startsWith(auditRoot+path.sep)||fs.existsSync(audit))throw Error('Audit directory must be new and inside .tmp/svg-m1/runs');
  const bytes=fs.readFileSync(manifest),rows=readJson(manifest);
  if(!Array.isArray(rows)||!rows.length)throw Error('Empty metadata manifest');
  const keys=new Set(),outputs=new Set();
  // Validate and serialize the complete batch before any SVG is changed.
  const prepared=rows.map(row=>{
    if(!row||typeof row.key!=='string'||!/^[A-Za-z0-9_-]+$/.test(row.key)||keys.has(row.key.toLowerCase()))throw Error('Invalid or duplicate metadata key');keys.add(row.key.toLowerCase());
    const input=resolve(row.assetPath),output=resolve(row.outputSvg||row.assetPath),source=resolve(row.sourcePath),run=resolve(row.sourceRun),publish=path.join(run,'publish.json'),plan=path.join(run,'plan.json');
    if(output===audit||output.startsWith(audit+path.sep))throw Error('Output must not overwrite audit evidence');
    if(![input,output].every(file=>path.extname(file).toLowerCase()==='.svg'&&file.startsWith(path.join(root,'archive','assets')+path.sep)||path.extname(file).toLowerCase()==='.svg'&&file.startsWith(auditRoot+path.sep)))throw Error('SVG path outside archive assets or temporary runs');
    const outputKey=process.platform==='win32'?output.toLowerCase():output;if(outputs.has(outputKey))throw Error('Duplicate SVG output');outputs.add(outputKey);
    const before=fs.readFileSync(input),expected=normalizeSha(row.expectedSha256);
    if(sha(before)!==expected)throw Error('Input SHA mismatch: '+row.key);
    if(fs.existsSync(output)&&sha(fs.readFileSync(output))!==expected)throw Error('Existing output SHA mismatch: '+row.key);
    const publishBytes=fs.readFileSync(publish),planBytes=fs.readFileSync(plan),sourceBytes=fs.readFileSync(source),publishData=readJson(publish);
    if(sha(publishBytes)!==normalizeSha(row.sourceReviewedPublishSha256))throw Error('Reviewed publish SHA mismatch: '+row.key);
    const upgraded=upgradeSvgAccessibility(before,{expectedSha256:expected,title:row.titleKo,description:row.descriptionKo});
    verifySvgAccessibilityUpgrade(before,upgraded.svg,upgraded.certificate);
    return {row,input,output,before,...upgraded,provenance:{manifestPath:manifest,manifestSha256:sha(bytes),sourcePath:source,sourceSha256:sha(sourceBytes),planPath:plan,planSha256:sha(planBytes),publishPath:publish,publishSha256:sha(publishBytes),reviewedPublishAlt:publishData.alt,descriptionMatchesReviewedPublishAlt:row.descriptionKo===publishData.alt,sourceRun:run}};
  });
  fs.mkdirSync(audit,{recursive:true});fs.writeFileSync(path.join(audit,'input-manifest.json'),bytes,{flag:'wx'});const report={schemaVersion:'APMATH_SVG_ACCESSIBILITY_METADATA_BATCH_v1',status:'IN_PROGRESS',rows:[]};
  const save=()=>fs.writeFileSync(path.join(audit,'report.json'),JSON.stringify(report,null,2)+'\n');save();
  try{
    for(const entry of prepared){
      const directory=path.join(audit,entry.row.key);fs.mkdirSync(directory);
      const beforePath=path.join(directory,'before.svg'),afterPath=path.join(directory,'upgraded.svg'),certificatePath=path.join(directory,'certificate.json');
      fs.writeFileSync(beforePath,entry.before,{flag:'wx'});fs.writeFileSync(afterPath,entry.svg,{flag:'wx'});
      fs.writeFileSync(certificatePath,JSON.stringify({certificate:entry.certificate,provenance:entry.provenance},null,2)+'\n',{flag:'wx'});
      if(sha(fs.readFileSync(entry.input))!==entry.certificate.beforeSvgSha256||fs.existsSync(entry.output)&&sha(fs.readFileSync(entry.output))!==entry.certificate.beforeSvgSha256)throw Error('SVG changed after preflight: '+entry.row.key);
      fs.writeFileSync(entry.output,entry.svg);verifySvgAccessibilityUpgrade(entry.before,fs.readFileSync(entry.output),entry.certificate);
      report.rows.push({key:entry.row.key,ord:entry.row.ord,inputSvg:entry.input,outputSvg:entry.output,beforeSvgSha256:entry.certificate.beforeSvgSha256,afterSvgSha256:entry.certificate.afterSvgSha256,beforePath,afterPath,certificatePath,status:'METADATA_ONLY_UPGRADED'});save();
    }
    report.status='METADATA_ONLY_UPGRADED';save();return report;
  }catch(error){report.status='FAILED';report.error=String(error.message||error);save();throw error;}
}

if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
  const option=name=>{const i=process.argv.indexOf(name);return i<0?null:process.argv[i+1];};
  const manifestPath=option('--manifest'),auditDir=option('--audit-dir');
  if(!manifestPath||!auditDir)throw Error('usage: --manifest rows.json --audit-dir .tmp/svg-m1/runs/<new-directory>');
  const report=upgradeBatch({manifestPath,auditDir});console.log(JSON.stringify({status:report.status,count:report.rows.length,auditDir:path.resolve(auditDir)}));
}
