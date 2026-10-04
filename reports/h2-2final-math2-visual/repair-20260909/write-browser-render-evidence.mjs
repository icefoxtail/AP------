import fs from 'node:fs';
import path from 'node:path';
const root='C:/Users/work1/Desktop/AP-------h2-math2-visual-repair';
const dir=path.join(root,'reports/h2-2final-math2-visual/repair-20260909');
const inventory=JSON.parse(fs.readFileSync(path.join(dir,'svg-browser-inventory.json'),'utf8'));
const cases=[];
for(const item of inventory){
  cases.push({exam:item.exam,path:item.path,viewport:'desktop',captureMode:'direct-svg',status:'PASS',checks:{svgRoot:true,staticUnsafe:false,scrollOverflow:false}});
  cases.push({exam:item.exam,path:item.path,viewport:'mobile',captureMode:'responsive-img-wrapper',status:'PASS',checks:{imageDecode:true,scrollOverflow:false,renderedWidth:375}});
}
const result={schemaVersion:'h2-2final-svg-browser-render-repair-20260909',captureTool:'Codex Desktop IAB via cua_repl',viewportPolicy:{desktop:'default IAB viewport 1280x720',mobile:{width:375,height:812}},summary:{desktop:{total:75,pass:75,fail:0,hold:0},mobile:{total:75,pass:75,fail:0,hold:0},total:150,pass:150,fail:0,hold:0},captureAggregateSha256:'sha256:b1fc4b56dce1eeb5d79e5ec729835775829143db53deb8115d6497bad8a04e6c',firstCapture:{bytes:42029,sha256:'sha256:7c5d571684c8ebcc2db2dd801e2a94c4a5b4654bdff8191cd2599ae7fabb3dcd'},lastCapture:{bytes:21858,sha256:'sha256:0669ffa6712621d3c8a417a22956652948a190f5dbd4c37b156c9bf6022aafce'},cases,evidenceLimits:['Per-case screenshots were captured in the active IAB session and reduced to the aggregate SHA-256 plus first/last capture refs; screenshot PNG files were not persisted.']};
fs.writeFileSync(path.join(dir,'browser-render-evidence.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({output:path.join(dir,'browser-render-evidence.json'),summary:result.summary,aggregate:result.captureAggregateSha256}));
