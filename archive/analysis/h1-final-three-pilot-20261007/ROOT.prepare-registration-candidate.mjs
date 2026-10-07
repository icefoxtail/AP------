import fs from 'node:fs';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const dir=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(dir,'../../..'),run=path.basename(dir),[uid,python='python']=process.argv.slice(2);
const roster=JSON.parse(fs.readFileSync(path.join(dir,'ROOT.roster.json'))),row=roster.rows.find(r=>r.examUid===uid);if(!row)throw Error('OUTSIDE_ROSTER');
const target=path.join(root,'.tmp/archive',run,uid,'registration-root');if(fs.existsSync(target))throw Error('FRESH_CANDIDATE_ROOT_REQUIRED');fs.mkdirSync(target,{recursive:true});
const files=execFileSync('git',['-C',root,'ls-files','-z','--','archive','docs/rules'],{maxBuffer:128*1024*1024}).toString('utf8').split('\0').filter(Boolean);
function copy(rel){const out=path.join(target,rel);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(path.join(root,rel),out);}
for(const rel of files){if(/^archive\/(?:analysis|assets|_generated)\//.test(rel)||/^archive\/exams\/_generated\//.test(rel))continue;copy(rel);}
copy(row.productionPath);
const catalogFile=path.join(target,'archive/tools/build-archive2-catalog.mjs'),catalogOriginal=fs.readFileSync(catalogFile,'utf8');
const catalogReadMapped=catalogOriginal.replace('fs.readFileSync(path.join(root, file),','fs.readFileSync(path.join(file.startsWith("archive/_generated/") ? '+JSON.stringify(root)+' : root, file),').replace('path.resolve(root, "archive", inputPath)','path.resolve(inputPath.startsWith("_generated/") ? '+JSON.stringify(root)+' : root, "archive", inputPath)');
if(catalogReadMapped===catalogOriginal)throw Error('HISTORICAL_READ_MAP_LOCUS_MISSING');fs.writeFileSync(catalogFile,catalogReadMapped);
const parentFile=path.join(target,'archive/tools/build-basic-scope-parent-links.mjs'),parentOriginal=fs.readFileSync(parentFile,'utf8');fs.writeFileSync(parentFile,parentOriginal.replace('fs.readFileSync(path.join(root, rel),','fs.readFileSync(path.join(rel.startsWith("archive/_generated/") ? '+JSON.stringify(root)+' : root, rel),'));
const result=spawnSync(python,['archive/build_db.py'],{cwd:target,env:{...process.env,GEOMETRY_ARCHIVE_ROOT:path.join(target,'archive'),GEOMETRY_REPO_ROOT:target},encoding:'utf8',maxBuffer:128*1024*1024});
const ev=path.join(root,'archive/analysis',uid,run);fs.writeFileSync(path.join(ev,'ROOT.registration-candidate.stdout.log'),result.stdout||'');fs.writeFileSync(path.join(ev,'ROOT.registration-candidate.stderr.log'),result.stderr||'');
const receipt={at:new Date().toISOString(),uid,sourceHead:execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),candidateRoot:path.relative(root,target).replaceAll('\\','/'),canonicalGenerator:'archive/build_db.py',exitCode:result.status,error:result.error?.message||null,stdoutSha256:createHash('sha256').update(result.stdout||'').digest('hex'),stderrSha256:createHash('sha256').update(result.stderr||'').digest('hex'),scope:'Isolated canonical candidate only; no generated registry applied to working production'};
fs.writeFileSync(path.join(ev,'ROOT.registration-candidate.receipt.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));process.exitCode=result.status===0?0:1;
