import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {readPreview,storePreview} from '../../../../archive/tools/archive-preview-cache.mjs';
const root='C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------';
const base=path.join(root,'.tmp/archive/h1-final-five-pilot-20261008/21_매산고_1학기_기말_고1_기출');
const cacheRoot=path.join(base,'preview-cache');
const magick='C:/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick.exe';
const specs=[
 {name:'q6-table',source:'source-pages/source-page-2.png',crop:'1200x800+120+1850',page:2},
 {name:'q19-source',source:'source-pages/source-page-6.png',crop:'1080x900+70+180',page:6},
 {name:'q20-source',source:'source-pages/source-page-6.png',crop:'1080x900+1080+180',page:6}
];
for(const s of specs){
 const input=path.join(base,s.source), output=path.join(base,'source-crops',`${s.name}.png`); fs.mkdirSync(path.dirname(output),{recursive:true});
 const parameters={crop:s.crop,format:'png',backend:'ImageMagick magick',page:s.page,role:s.name};
 const paramFile=path.join(base,`${s.name}-crop-params.json`); fs.writeFileSync(paramFile,JSON.stringify(parameters,null,2));
 const options={cacheRoot,sourceFile:input,parameters,toolVersion:'ImageMagick 7.1.2-Q16-HDRI'};
 let result=readPreview(options);
 if(result.status==='CACHE_MISS'){
  const proc=spawnSync(magick,[input,'-crop',s.crop,'+repage',output],{encoding:'utf8'});
  if(proc.status!==0) throw Error(proc.stderr);
  result=storePreview({...options,previewFile:output});
 } else fs.copyFileSync(result.preview.path,output);
 console.log(JSON.stringify({name:s.name,status:result.status,sha256:result.preview.sha256,path:output}));
}
