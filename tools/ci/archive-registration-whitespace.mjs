// The QID9 producer preserves reviewed SVG body bytes while adding its existing accessibility
// attributes. Do not rewrite those assets to satisfy a source-code style check. Recognize only
// whitespace inherited through that exact native transformation; every other Git check stays fatal.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync,spawnSync} from 'node:child_process';

const MANIFEST='archive/data/generated-source-import-roots-v1.json';
const NORMALIZER='archive/tools/generated-meta/normalize-qid9-svg.cjs';
const ASSETS='archive/assets/generated-lite/qid9/';
const require=createRequire(import.meta.url);
const git=(root,...args)=>execFileSync('git',args,{cwd:root,maxBuffer:256*1024*1024,stdio:['ignore','pipe','pipe']});
const blob=bytes=>crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const safeSource=rel=>typeof rel==='string'&&rel.startsWith('alive/06_EXECUTION/')&&!rel.includes('\\')&&!rel.split('/').includes('..');
const fail=(reason,file='',line='')=>{throw Error(`REGISTRATION_WHITESPACE_${reason}:${file}${line?':'+line:''}`);};

function nativeAssetBindings(root,wanted) {
  const headCache=new Map();
  const head=rel=>{if(!headCache.has(rel))headCache.set(rel,git(root,'show','HEAD:'+rel));return headCache.get(rel);};
  const normalizerFile=path.resolve(root,NORMALIZER);
  if(!fs.readFileSync(normalizerFile).equals(head(NORMALIZER)))fail('UNCOMMITTED_NORMALIZER',NORMALIZER);
  delete require.cache[require.resolve(normalizerFile)];
  const normalize=require(normalizerFile),spec=JSON.parse(head(MANIFEST));
  if(!Array.isArray(spec.roots))fail('MANIFEST_INVALID',MANIFEST);
  const bindings=new Map();
  for(const entry of spec.roots) {
    const directory=entry.directory;
    if(!safeSource(directory))fail('SOURCE_PATH_INVALID',String(directory));
    const files=git(root,'ls-tree','-r','--name-only','-z','HEAD','--',directory).toString('utf8').split('\0')
      .filter(rel=>rel.startsWith(directory+'/')&&/^GPT_QID9_Q\d{2}_CREATE_DRAFT\.json$/.test(rel.slice(directory.length+1)));
    for(const file of files) {
      const draft=JSON.parse(head(file));
      for(const item of draft.questions||[])for(const [field,surface] of [['image','problem'],['solutionImage','solution']]) {
        const dest=ASSETS+item.uid+'-'+surface+'.svg';
        if(!wanted.has(dest))continue;
        if(bindings.has(dest))fail('AMBIGUOUS_BINDING',dest);
        const reference=String(item[field]||'').replaceAll('\\','/');
        const source=reference.startsWith('assets/')?directory+'/'+reference:reference;
        if(!safeSource(source)||path.extname(source).toLowerCase()!=='.svg')fail('SOURCE_PATH_INVALID',dest);
        const sourceBytes=head(source),sourceText=sourceBytes.toString('utf8');
        const labels=field==='solutionImage'?{title:item.solutionImageAlt,description:item.solutionImageCaption}
          :{title:item.imageAlt,description:item.imageCaption};
        const expected=Buffer.from(normalize(sourceText,item.uid,labels),'utf8'),staged=git(root,'show',':'+dest);
        if(!expected.equals(staged))fail('NATIVE_OUTPUT_MISMATCH',dest);
        bindings.set(dest,{source,sourceBlob:blob(sourceBytes),derivedBlob:blob(staged),
          sourceLines:new Set(sourceText.split('\n')),derivedLines:staged.toString('utf8').split('\n'),lines:0});
      }
    }
  }
  for(const dest of wanted)if(!bindings.has(dest))fail('UNBOUND_ASSET',dest);
  return bindings;
}

export function checkStagedRegistrationWhitespace(root) {
  const result=spawnSync('git',['-c','core.quotepath=false','diff','--cached','--check'],
  {cwd:root,encoding:'utf8',maxBuffer:256*1024*1024});
  if(result.error||![0,2].includes(result.status))fail('GIT_CHECK_ERROR');
  if(result.status===0)return {status:'PASS',rawGitExitCode:0,inheritedLineCount:0,inheritedAssets:[]};
  const issues=[],lines=result.stdout.split('\n');
  for(let i=0;i<lines.length;i++) {
    if(!lines[i])continue;
    const match=/^(.*):(\d+): (.*)$/.exec(lines[i]);
    if(!match)fail('CHECK_OUTPUT_INVALID');
    const [,file,line,reason]=match;
    // Conflict markers, EOF blank lines and space-before-tab are never inherited exceptions.
    if(reason!=='trailing whitespace.')fail('GIT_CHECK_FAILED',file,line);
    if(!file.startsWith(ASSETS)||!/^[-A-Za-z0-9]+-(?:problem|solution)\.svg$/.test(file.slice(ASSETS.length)))fail('OUTSIDE_NATIVE_ASSET',file,line);
    if(!lines[++i]?.startsWith('+'))fail('CHECK_OUTPUT_INVALID',file,line);
    issues.push({file,line:Number(line)});
  }
  if(!issues.length)fail('CHECK_OUTPUT_INVALID');
  const bindings=nativeAssetBindings(root,new Set(issues.map(row=>row.file)));
  for(const {file,line} of issues) {
    const binding=bindings.get(file),text=binding.derivedLines[line-1];
    if(typeof text!=='string'||!/[\t \r]$/.test(text)||!binding.sourceLines.has(text))fail('NEW_TRAILING_WHITESPACE',file,line);
    binding.lines++;
  }
  return {status:'INHERITED_SOURCE_WHITESPACE',rawGitExitCode:result.status,inheritedLineCount:issues.length,
    inheritedAssets:[...bindings].map(([file,{source,sourceBlob,derivedBlob,lines}])=>({file,source,sourceBlob,derivedBlob,lines}))};
}
