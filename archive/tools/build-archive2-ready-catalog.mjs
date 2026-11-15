#!/usr/bin/env node
// The production builder and tests share one bounded catalog/readiness closure.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import projection from '../../tools/lib/archive-test-projection.js';

export function buildReadyCatalog({root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),...options}={}) {
  if(!fs.statSync(root).isDirectory())throw Error('Archive projection requires a repository directory');
  return projection.prepareArchiveTestProjection({root:path.resolve(root),...options});
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
