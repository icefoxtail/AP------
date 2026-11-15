#!/usr/bin/env node
// The production builder and tests share one bounded catalog/readiness closure.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import projection from '../../tools/lib/archive-test-projection.js';

export function buildReadyCatalog({root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),...options}={}) {
  if(!fs.statSync(root).isDirectory())throw Error('Archive projection requires a repository directory');
  root=path.resolve(root);
  const parent=(check=false)=>{
    const args=['archive/tools/build-basic-scope-parent-links.mjs',...(check?['--check']:[])];
    const result=(options.run||spawnSync)(process.execPath,args,{
      cwd:root,encoding:'utf8',timeout:120000,maxBuffer:32*1024*1024,stdio:'inherit',
    });
    if(result.error||result.status!==0)
      throw Error(`Archive parent projection failed: ${args.join(' ')}: ${result.error?.message||result.stderr||result.signal||result.status}`);
  };
  const result=projection.prepareArchiveTestProjection({root,...options});
  let parentRebuilds=0;
  if(result.catalogBuilds>1) {
    // Readiness changed a runtime input after build_db generated the parents.
    // Their authority digest includes that runtime, even when every parent row
    // is unchanged. Regenerate through the official writer, then bind catalog
    // and readiness to those final parent bytes. Further runtime changes fail.
    parent();parentRebuilds=1;
    const rebound=projection.prepareArchiveTestProjection({root,...options});
    result.catalogBuilds+=rebound.catalogBuilds;
    if(rebound.catalogBuilds!==1)
      throw Error('Archive runtime inputs did not stabilize after parent regeneration');
  }
  parent(true);
  return {...result,parentRebuilds,parentsVerified:true};
}

function main() {
  const args=process.argv.slice(2);
  if(args.length!==0&&(args.length!==2||args[0]!=='--repo-root'||!args[1]))
    throw Error('Usage: node archive/tools/build-archive2-ready-catalog.mjs [--repo-root PATH]');
  const result=buildReadyCatalog(args.length?{root:args[1]}:{});
  console.log(JSON.stringify({status:'PASS',...result}));
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try{main();}catch(error){console.error(error.message);process.exitCode=1;}
}
