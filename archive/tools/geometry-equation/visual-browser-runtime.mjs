import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
export const repoRoot=fileURLToPath(new URL('../../../',import.meta.url));
export function playwright() {
  try{return require('playwright');}catch(error){
    const root=process.env.GEOMETRY_NODE_MODULES||process.env.APMATH_NODE_MODULES;
    if(root)return require(path.join(root,'playwright'));
    throw Error('PLAYWRIGHT_REQUIRED: use installed dependency path via GEOMETRY_NODE_MODULES');
  }
}
export function assertOutput(file) {
  const root=path.resolve(repoRoot,'archive/_generated/geometry-visual-engine');
  const target=path.resolve(file);
  if(!target.startsWith(root+path.sep))throw Error('EVIDENCE_OUTPUT_SCOPE_VIOLATION');
  return target;
}
export async function launchBrowser() {
  return playwright().chromium.launch({channel:process.env.GEOMETRY_BROWSER_CHANNEL||'chrome',headless:true});
}
