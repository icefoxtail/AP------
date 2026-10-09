import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root='C:/Users/USER/Desktop/AP-worktrees/archive-2026-1mid-nine/AP------';
const dir=path.join(root,'archive/analysis/archive-2026-1mid-nine-20261008/26_동산중_1학기_중간_중2_기출/registration-technical-source8');
const basePath=path.join(root,'archive/data/archive2-catalog.json');
const candidatePath=path.join(root,'.tmp/rm8/archive/data/archive2-catalog.json');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const baseBytes=fs.readFileSync(basePath),candidateBytes=fs.readFileSync(candidatePath);
const base=JSON.parse(baseBytes),candidate=JSON.parse(candidateBytes);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const prefix=Array.isArray(candidate.strings)&&candidate.strings.length>=base.strings.length&&base.strings.every((x,i)=>eq(x,candidate.strings[i]));
const baseRows=new Map();for(const row of base.records){const k=JSON.stringify(row);baseRows.set(k,(baseRows.get(k)||0)+1);}
const candidateRows=new Map();for(const row of candidate.records){const k=JSON.stringify(row);candidateRows.set(k,(candidateRows.get(k)||0)+1);}
let exactPackedNonTargetRows=0;for(const [k,n] of baseRows){if((candidateRows.get(k)||0)<n)throw new Error('BASE_PACKED_ROW_NOT_PRESERVED');exactPackedNonTargetRows+=n;}
const proof={schemaVersion:'ROOT_REGISTRATION_PACKED_CATALOG_INVARIANCE_V1',runId:'archive-2026-1mid-nine-20261008',examUid:'26_동산중_1학기_중간_중2_기출',status:'PASS',baseCatalog:{path:basePath,rawSha256:sha(baseBytes),columnCount:base.columns.length,stringCount:base.strings.length,recordCount:base.records.length},candidateCatalog:{path:candidatePath,rawSha256:sha(candidateBytes),columnCount:candidate.columns.length,stringCount:candidate.strings.length,recordCount:candidate.records.length},checks:{packedColumnCount67:base.columns.length===67&&candidate.columns.length===67,packedColumnDefinitionsExact:eq(base.columns,candidate.columns),originalStringTableIsExactPrefix:prefix,allOriginalPackedRowsUnchanged:exactPackedNonTargetRows===base.records.length,originalPackedRowsFound:exactPackedNonTargetRows,candidatePackedRowsAllHave67Columns:candidate.records.every(row=>Array.isArray(row)&&row.length===67)}};
if(Object.values(proof.checks).some(x=>x===false))throw new Error('PACKED_CATALOG_INVARIANCE_FAIL');
fs.writeFileSync(path.join(dir,'ROOT.registration.packed67-invariance.json'),JSON.stringify(proof,null,2)+'\n');
const closeoutPath=path.join(dir,'ROOT.registration.preapply-closeout.json'),closeout=JSON.parse(fs.readFileSync(closeoutPath,'utf8'));
closeout.packedCatalogInvariance={path:path.join(dir,'ROOT.registration.packed67-invariance.json'),sha256:sha(fs.readFileSync(path.join(dir,'ROOT.registration.packed67-invariance.json'))),checks:proof.checks};
closeout.producerAdapter={disposition:'BOUNDED_ISOLATED_REGISTRATION_ADAPTER',scope:'Registration row generation only; no source/assets/main-registry edits.',reason:'Canonical producer hard-codes target path/grade support to original/high and h1/h2; source8 is original/middle/m2. Adapter copied exact current nine registry bytes, derived identity/meta rows from current artifact and R1 evidence, kept M2 semantic fields and PT/TPL nulls unchanged, and used canonical question-index/catalog/package and registration validators. Source status exception is bound to ROOT promotion receipt.'};
fs.writeFileSync(closeoutPath,JSON.stringify(closeout,null,2)+'\n');
console.log(JSON.stringify({proofPath:path.join(dir,'ROOT.registration.packed67-invariance.json'),proofSha256:sha(fs.readFileSync(path.join(dir,'ROOT.registration.packed67-invariance.json'))),checks:proof.checks,closeoutPath,closeoutSha256:sha(fs.readFileSync(closeoutPath))},null,2));
