#!/usr/bin/env node
// Explicit task-entry gate. This never grants publication/quality approval.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CAP = new Set(['gitRead','gitWrite','notionRead','driveRead','libraryRead','browser']);
const STATES = new Set(['AVAILABLE','UNAVAILABLE','UNKNOWN']);
const POLICIES = new Set(['local-file','optional-local-file','stage-owned']);
function relativeFile(root, relative, label) {
  if (typeof relative !== 'string' || !relative.trim() || path.isAbsolute(relative) || /^[A-Za-z]:[\\/]/.test(relative))
    throw Error(label+'_INVALID: non-relative or empty path');
  const parts = relative.replace(/\\/g,'/').split('/');
  if (parts.some(p => !p || p === '.' || p === '..')) throw Error(label+'_INVALID: non-canonical path');
  const resolved = path.resolve(root, ...parts);
  if (resolved === root || !(root === path.parse(root).root ? resolved.startsWith(root) : resolved.startsWith(root+path.sep)))
    throw Error(label+'_INVALID: escapes repository');
  let cursor = root;
  for (const part of parts) {
    cursor = path.join(cursor,part);
    if (!fs.existsSync(cursor)) break;
    if (fs.lstatSync(cursor).isSymbolicLink()) throw Error(label+'_INVALID: symlink');
  }
  return resolved;
}
function git(root,...args) {
  const p = spawnSync('git',['-C',root,...args],{encoding:'utf8',timeout:4000,windowsHide:true});
  return p.status === 0 ? p.stdout.trim() : null;
}
function parseCaps(s) {
  if (!s) return {};
  const out = {};
  for (const part of s.split(',')) {
    const [name,state,extra] = part.split('=');
    if (extra !== undefined || !CAP.has(name) || !STATES.has(state) || out[name] || name === 'gitRead')
      throw Error('CAPABILITY_INPUT_INVALID: local gitRead is never caller-attested; other states must be AVAILABLE|UNAVAILABLE|UNKNOWN');
    out[name]=state;
  }
  return out;
}
function validateRegistry(m) {
  if (m?.schemaVersion!==1 || !Array.isArray(m.routes) || !m.routes.length) throw Error('ROUTES_INVALID: schema');
  const names = new Set();
  for (const r of m.routes) {
    if (!r || !r.task || names.has(r.task) || !POLICIES.has(r.target) ||
        !Array.isArray(r.requiredCapabilities) || !Array.isArray(r.optionalCapabilities))
      throw Error('ROUTES_INVALID: route');
    names.add(r.task);
    relativeFile('/',r.authority,'AUTHORITY_PATH');
    const caps=[...r.requiredCapabilities,...r.optionalCapabilities];
    if (caps.length!==new Set(caps).size || caps.some(c=>!CAP.has(c)) || !r.requiredCapabilities.includes('gitRead'))
      throw Error('ROUTES_INVALID: capabilities');
  }
}
const instructions = {
  TASK_NOT_ROUTED:'Choose the exact declared task kind; never guess a route from filenames.',
  GIT_READ_UNAVAILABLE:'Open an actual Git worktree and confirm origin/main separately.',
  AUTHORITY_NOT_FOUND:'Refresh the exact canonical file from current Git; do not fuzzy-search.',
  TARGET_UNSPECIFIED:'Bind the exact existing local file before starting.',
  TARGET_NOT_FOUND:'Inspect the exact folder and path rather than concluding absence from a filename search.',
  TARGET_TYPE_MISMATCH:'Library stage targets must be resolved by their owning connector, not a local path.',
  CAPABILITY_UNAVAILABLE:'Do not execute this step; restore permission/connection or hand off the blocked step.',
  CAPABILITY_UNKNOWN:'Probe this capability using the actual provider tool and record the result.',
  CAPABILITY_REQUIRES_PROVIDER_PROBE:'AVAILABLE supplied by an agent is not a tool attestation. Probe the provider before acting.',
  ENTRY_READY:'Read only the selected authority and target; actual quality and release require their own evidence.'
};
function next(code,detail){return {code,detail,instruction:instructions[code]};}
export function evaluate({root,manifest,task,target=null,caps={}}) {
  validateRegistry(manifest);
  const route=manifest.routes.find(r=>r.task===task);
  const out={contract:'AP_HARNESS_ENTRY_v1',scope:'ENTRY_ONLY_NOT_QUALITY_OR_RELEASE',task,
    authority:route?.authority??null,decision:'BLOCKED',
    requiredCapabilities:{},optionalCapabilities:{},git:{checked:false,head:null},nextRecommendedAction:null};
  if (!route) {out.nextRecommendedAction=next('TASK_NOT_ROUTED',task);return out;}
  const head=git(root,'rev-parse','HEAD'), checkout=git(root,'rev-parse','--show-toplevel');
  if (!head || !checkout || path.resolve(checkout)!==root) {
    out.nextRecommendedAction=next('GIT_READ_UNAVAILABLE',root);return out;
  }
  out.git={checked:true,head};
  const authority=relativeFile(root,route.authority,'AUTHORITY_PATH');
  if (!fs.existsSync(authority)||!fs.statSync(authority).isFile()){
    out.nextRecommendedAction=next('AUTHORITY_NOT_FOUND',route.authority);return out;
  }
  if (route.target==='local-file' && !target) {
    out.nextRecommendedAction=next('TARGET_UNSPECIFIED',task);return out;
  }
  if (target) {
    if (route.target==='stage-owned') {
      out.nextRecommendedAction=next('TARGET_TYPE_MISMATCH',target);return out;
    }
    const exact=relativeFile(root,target,'TARGET_PATH');
    if (!fs.existsSync(exact)||!fs.statSync(exact).isFile()){
      out.nextRecommendedAction=next('TARGET_NOT_FOUND',target);return out;
    }
    out.target=target;
  }
  for (const c of route.requiredCapabilities) out.requiredCapabilities[c]=c==='gitRead'
    ? {state:'AVAILABLE',provenance:'local-git-command'}
    : {state:caps[c]??'UNKNOWN',provenance:'caller-report-unverified'};
  for (const c of route.optionalCapabilities) out.optionalCapabilities[c]=
    {state:caps[c]??'UNKNOWN',provenance:'caller-report-unverified'};
  const missing=Object.entries(out.requiredCapabilities).find(([,s])=>s.state==='UNAVAILABLE');
  if (missing){out.nextRecommendedAction=next('CAPABILITY_UNAVAILABLE',missing[0]);return out;}
  const unknown=Object.entries(out.requiredCapabilities).find(([,s])=>s.state==='UNKNOWN');
  if (unknown){out.decision='PROBE_REQUIRED';out.nextRecommendedAction=next('CAPABILITY_UNKNOWN',unknown[0]);return out;}
  const reported=route.requiredCapabilities.find(c=>c!=='gitRead');
  if (reported) {
    out.decision='PROBE_REQUIRED';
    out.nextRecommendedAction=next('CAPABILITY_REQUIRES_PROVIDER_PROBE',reported);return out;
  }
  out.decision='ENTRY_READY';out.nextRecommendedAction=next('ENTRY_READY',route.authority);
  return out;
}
export function main(args=process.argv.slice(2)) {
  try {
    const options={root:ROOT,task:null,target:null,caps:null,routes:null};
    for(let i=0;i<args.length;i++){
      if (args[i]==='--json')continue;
      const key=args[i].slice(2);
      if (!['root','task','target','caps','routes'].includes(key)||!args[i+1]||args[i+1].startsWith('--'))
        throw Error('ARGUMENT_INVALID: '+args[i]);
      if (options[key]!==null && key!=='root')throw Error('ARGUMENT_DUPLICATE: '+key);
      options[key]=args[++i];
    }
    if(!options.task)throw Error('TASK_REQUIRED');
    const root=path.resolve(options.root);
    const manifest=JSON.parse(fs.readFileSync(options.routes?path.resolve(options.routes):path.join(root,'tools/harness/routes.v1.json'),'utf8'));
    const result=evaluate({root,manifest,task:options.task,target:options.target,caps:parseCaps(options.caps)});
    console.log(JSON.stringify(result,null,2));
    return result.decision==='ENTRY_READY'?0:result.decision==='PROBE_REQUIRED'?2:1;
  } catch(e){
    console.error(JSON.stringify({contract:'AP_HARNESS_ENTRY_v1',decision:'BLOCKED',error:e.message}));
    return 1;
  }
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))process.exitCode=main();
