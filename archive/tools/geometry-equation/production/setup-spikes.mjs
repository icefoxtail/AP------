import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {bytesSha} from '../../pipeline-core/canonical.mjs';
import {generatedPath,GENERATED_ROOT} from './store.mjs';
const root=fileURLToPath(new URL('../../../../',import.meta.url));
const destination=generatedPath(root,'archive/_generated/geometry-visual-engine/production/dependencies');
fs.mkdirSync(destination,{recursive:true});
// Runtime modules stay under generated; manifests are the reproducible source.
for(const name of ['package.json','package-lock.json'])fs.copyFileSync(new URL('runtime-'+name,import.meta.url),path.join(destination,name));
function command(cmd,args){const r=spawnSync(cmd,args,{stdio:'inherit',windowsHide:true,shell:false});if(r.error||r.status!==0)throw Error('DEPENDENCY_SETUP_FAILED:'+cmd);}
// npm.cmd requires cmd.exe on Windows; a fixed command with no interpolated paths.
if(process.platform==='win32'){
  const r=spawnSync('cmd.exe',['/d','/c','npm.cmd ci --no-audit --no-fund'],{cwd:destination,stdio:'inherit',windowsHide:true});
  if(r.status!==0)throw Error('NPM_SETUP_FAILED');
}else command('npm',['ci','--prefix',destination,'--no-audit','--no-fund']);
command(process.env.GEOMETRY_PYTHON||'python',['-m','pip','install','--require-hashes','--target',path.join(destination,'python'),'-r',fileURLToPath(new URL('requirements.txt',import.meta.url))]);
const lock=JSON.parse(fs.readFileSync(new URL('dependency-lock.json',import.meta.url)));
for(const [file,url] of [['NotoSansKR.ttf',lock.font.url],['OFL.txt',lock.font.licenseUrl]]){
  const response=await fetch(url);if(!response.ok)throw Error('FONT_DOWNLOAD_FAILED');
  const raw=Buffer.from(await response.arrayBuffer());
  if(file.endsWith('.ttf')&&bytesSha(raw)!==lock.font.sha256)throw Error('FONT_DEPENDENCY_HASH_MISMATCH');
  fs.writeFileSync(path.join(destination,file),raw);
}
console.log(JSON.stringify({status:'INSTALLED',generatedRoot:path.relative(root,destination).replaceAll('\\','/'),qualification:'NOT_RUN'}));
