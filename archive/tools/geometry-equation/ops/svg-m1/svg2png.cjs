// usage: node svg2png.cjs <in.svg> <out.png> [cssWidth=600]
const fs=require('node:fs');const path=require('node:path');const {pathToFileURL}=require('node:url');
const {repoRoot}=require('./portable-root.cjs');
(async()=>{const [i,o,w]=process.argv.slice(2);if(!i||!o)throw Error('input and output required');const width=Number(w||600);if(!Number.isFinite(width)||width<=0)throw Error('invalid width');
const {launchBrowser}=await import(pathToFileURL(path.join(repoRoot(),'archive/tools/geometry-equation/visual-browser-runtime.mjs')).href);
const svg=fs.readFileSync(i,'utf8');const b=await launchBrowser();
try{const p=await b.newPage({viewport:{width:width+40,height:800},deviceScaleFactor:1.5});
await p.setContent(`<html><body style="margin:20px;background:#fff"><div id="f" style="width:${width}px">${svg}</div><style>#f svg{width:100%;height:auto}</style></body></html>`);
await p.waitForTimeout(300);await (await p.$('#f')).screenshot({path:o});console.log('PNG',o);}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
