import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import {bytesSha} from '../../pipeline-core/canonical.mjs';
const require=createRequire(import.meta.url);
export const dependencyRoot=fileURLToPath(new URL('../../../_generated/geometry-visual-engine/production/dependencies/',import.meta.url));
export const dependencyLock=JSON.parse(fs.readFileSync(new URL('dependency-lock.json',import.meta.url)));
export function dependency(name) {
  const root=process.env.GEOMETRY_NODE_MODULES || path.join(dependencyRoot,'node_modules');
  if(dependencyLock.node[name] && bytesSha(fs.readFileSync(path.join(root,name)))!==dependencyLock.node[name])throw Error('DEPENDENCY_HASH_MISMATCH:'+name);
  return require(path.join(root,name));
}
