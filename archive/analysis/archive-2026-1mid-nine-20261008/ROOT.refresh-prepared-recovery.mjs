import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {physical,writeFresh} from '../../tools/archive-codex-artifact-io.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const base=path.join(root,'archive/analysis/archive-2026-1mid-nine-20261008');
const row=JSON.parse(fs.readFileSync(path.join(base,'roster.json')))[Number(process.argv[2])-1];
const original=path.join(row.evidenceRootAbsolute,'CREATE.item-recovery.assignment.json'),packet=JSON.parse(fs.readFileSync(original));
if(physical(packet.workingJsAbsolute).sha256!==packet.artifactRawSha256||physical(packet.nonTargetPreimage.path).sha256!==packet.nonTargetPreimage.sha256)throw Error('RECOVERY_PREIMAGE_DRIFT');
const preimage=JSON.parse(fs.readFileSync(packet.nonTargetPreimage.path));
for(const asset of preimage.assets)if(physical(asset.path).sha256!==asset.sha256)throw Error('RECOVERY_ASSET_DRIFT');
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const output=path.join(row.evidenceRootAbsolute,'CREATE.item-recovery.assignment.head-'+head.slice(0,8)+'.json');
console.log(JSON.stringify(writeFresh(output,{...packet,expectedHead:head,sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',originalAssignment:physical(original),
 headRefreshBasis:'Current unchanged source/preimage/assets; latest ROOT publication baseline',refreshedAt:new Date().toISOString()})));
