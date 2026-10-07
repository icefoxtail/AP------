#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { validateCodexRootWaivedStaticReceipt, validateCodexRootWaivedMainDoneReceipt } from './archive-codex-closeout-v2.mjs';

function parseArgs(argv){
  const args={};
  for(let i=0;i<argv.length;i++){
    const key=argv[i];
    if(!['--phase','--root','--receipt'].includes(key)||i+1>=argv.length)throw new Error('USAGE: node archive/tools/archive-codex-root-waiver-intake.mjs --phase <static|main-done> --root <repo-root> --receipt <physical-receipt-relative-path>');
    args[key.slice(2)]=argv[++i];
  }
  if(!['static','main-done'].includes(args.phase)||!args.root||!args.receipt)throw new Error('USAGE: node archive/tools/archive-codex-root-waiver-intake.mjs --phase <static|main-done> --root <repo-root> --receipt <physical-receipt-relative-path>');
  return args;
}

try{
  const args=parseArgs(process.argv.slice(2)),root=path.resolve(args.root),rootReal=fs.realpathSync(root),receiptPath=path.resolve(root,args.receipt),relative=path.relative(root,receiptPath);
  if(relative.startsWith('..')||path.isAbsolute(relative))throw new Error('RECEIPT_PATH_OUTSIDE_ROOT');
  const receiptReal=fs.realpathSync(receiptPath),realRelative=path.relative(rootReal,receiptReal);
  if(realRelative.startsWith('..')||path.isAbsolute(realRelative))throw new Error('RECEIPT_SYMLINK_OUTSIDE_ROOT');
  const bytes=fs.readFileSync(receiptReal),receipt=JSON.parse(bytes.toString('utf8'));
  const result=args.phase==='static'?validateCodexRootWaivedStaticReceipt({receipt,root}):validateCodexRootWaivedMainDoneReceipt({receipt,root});
  console.log(JSON.stringify({phase:args.phase,receiptPath:relative.split(path.sep).join('/'),receiptSha256:createHash('sha256').update(bytes).digest('hex'),...result},null,2));
  process.exitCode=result.ok?0:1;
}catch(error){
  console.log(JSON.stringify({ok:false,disposition:'FAIL',issues:[error.message]},null,2));
  process.exitCode=1;
}
