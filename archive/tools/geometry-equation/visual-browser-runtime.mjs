import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
export const repoRoot=fileURLToPath(new URL('../../../',import.meta.url));
export function playwright() {
  try{return require('playwright');}catch(error){
    const root=process.env.GEOMETRY_NODE_MODULES||process.env.APMATH_NODE_MODULES||path.join(repoRoot,'.tmp/apmath-visual-engine/dependencies/node_modules');
    if(root)return require(path.join(root,'playwright'));
    throw Error('PLAYWRIGHT_REQUIRED: use installed dependency path via GEOMETRY_NODE_MODULES');
  }
}
export function assertOutput(file) {
  const root=path.resolve(repoRoot,'.tmp/archive');
  const target=path.resolve(file);
  if(!target.startsWith(root+path.sep))throw Error('TEMPORARY_WORKSPACE_REQUIRED');
  const segments=path.relative(root,target).split(path.sep);
  if(segments.length<3||!/^[A-Za-z0-9_-]{1,80}$/.test(segments[0])||!/^[\p{L}\p{N}_.-]{1,180}$/u.test(segments[1])||segments[1]==='.'||segments[1]==='..')throw Error('EVIDENCE_OUTPUT_SCOPE_VIOLATION');
  if(fs.existsSync(root)&&fs.realpathSync(root)!==root)throw Error('TEMPORARY_ROOT_REDIRECT');
  let existing=target;while(!fs.existsSync(existing))existing=path.dirname(existing);
  const real=fs.realpathSync(existing),repo=fs.realpathSync(repoRoot);
  if(real!==repo&&!real.startsWith(repo+path.sep))throw Error('TEMPORARY_WORKSPACE_ESCAPE');
  const rootReal=fs.existsSync(root)?fs.realpathSync(root):root;
  if(real!==rootReal&&!real.startsWith(rootReal+path.sep)&&!rootReal.startsWith(real+path.sep))throw Error('TEMPORARY_WORKSPACE_ESCAPE');
  return target;
}
export async function launchBrowser() {
  const executablePath=process.env.GEOMETRY_BROWSER_EXECUTABLE;
  return playwright().chromium.launch({...(executablePath?{executablePath}:{channel:process.env.GEOMETRY_BROWSER_CHANNEL||'chrome'}),headless:true});
}
