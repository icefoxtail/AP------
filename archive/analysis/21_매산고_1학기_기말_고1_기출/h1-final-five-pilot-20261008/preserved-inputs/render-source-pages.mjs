import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {readPreview,storePreview} from '../../../../archive/tools/archive-preview-cache.mjs';
const root='C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------';
const pdf='C:/Users/USER/Desktop/기출정리 파일/(2)1기말/수학(상)/2021_매산고1_1기말.pdf';
const base=path.join(root,'.tmp/archive/h1-final-five-pilot-20261008/21_매산고_1학기_기말_고1_기출');
const cacheRoot=path.join(base,'preview-cache');
const pageRoot=path.join(base,'source-pages');
const poppler='C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe';
const version='Poppler pdftoppm 26.07.0';
for(let page=1;page<=6;page++){
 const parameters={page,dpi:220,cropBox:'MediaBox',rotation:'honor-pdf',format:'png',singleFile:true,colorspace:'rgb',antialias:'poppler-default',backend:'pdftoppm'};
 const paramFile=path.join(base,`preview-params-page-${page}.json`);
 fs.writeFileSync(paramFile,JSON.stringify(parameters,null,2));
 const options={cacheRoot,sourceFile:pdf,parameters,toolVersion:version};
 let result=readPreview(options);
 const out=path.join(pageRoot,`source-page-${page}.png`);
 if(result.status==='CACHE_HIT') fs.copyFileSync(result.preview.path,out);
 else {
  const prefix=path.join(pageRoot,`render-${page}`);
  const proc=spawnSync(poppler,['-f',String(page),'-l',String(page),'-r','220','-png','-cropbox','-singlefile',pdf,prefix],{encoding:'utf8'});
  if(proc.status!==0) throw Error(`PDF_RENDER_FAILED_PAGE_${page}: ${proc.stderr}`);
  const rendered=`${prefix}.png`;
  result=storePreview({...options,previewFile:rendered});
  fs.copyFileSync(result.preview.path,out);
  fs.unlinkSync(rendered);
 }
 console.log(JSON.stringify({page,status:result.status,previewSha256:result.preview.sha256,path:out}));
}

