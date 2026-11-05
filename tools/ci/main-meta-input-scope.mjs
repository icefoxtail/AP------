#!/usr/bin/env node
// Classify the triggering source delta, not HEAD^ of a moving main checkout.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const INPUTS=[/^archive\/exams\/.*\.js$/, /^archive\/data\/meta-foundation\/canonical\//,
  /^archive\/tools\/meta-foundation\/auto-register-merged-source\.mjs$/,
  /^tools\/ci\/(?:archive-main-auto-meta-pass\.sh|main-meta-input-scope\.mjs)$/,
  /^\.archive-meta-register\/auto\/config\.json$/, /^\.github\/workflows\/archive-main-auto-meta\.yml$/];
export function gitChangedPaths(before,after){
  if(!/^[a-f0-9]{40}$/.test(before||'')||! /^[a-f0-9]{40}$/.test(after||''))return null;
  try{return execFileSync('git',['diff','--name-only','-z',before,after,'--'],{encoding:'utf8',maxBuffer:16*1024*1024,stdio:['ignore','pipe','ignore']}).split('\0').filter(Boolean);}catch{return null;}
}
export function needsSemanticRegistration({event,eventName,gitDiff=gitChangedPaths}){
  if(eventName!=='push')return true;
  // A populated commits[] can omit added/modified/removed. Never take that as proof of no changes.
  const delta=gitDiff(event?.before,event?.after);
  if(Array.isArray(delta))return delta.some(p=>INPUTS.some(re=>re.test(String(p).normalize('NFC'))));
  const commits=Array.isArray(event?.commits)?event.commits:[];
  const complete=commits.length>0&&commits.length<20&&!event?.forced&&commits.every(c=>['added','modified','removed'].every(k=>Array.isArray(c[k])));
  const files=commits.flatMap(c=>['added','modified','removed'].flatMap(k=>Array.isArray(c[k])?c[k]:[]));
  if(files.some(p=>INPUTS.some(re=>re.test(String(p).normalize('NFC')))))return true;
  return !complete; // Uncertain scope costs a safe idempotent pass; never drops semantic work.
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 let event=null;try{event=JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));}catch{}
 const needed=needsSemanticRegistration({event,eventName:process.env.GITHUB_EVENT_NAME});
 console.log(`needed=${needed}`);if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,`needed=${needed}\n`);
}
