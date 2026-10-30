// usage: node svg2png.cjs <in.svg> <out.png> [cssWidth=600]
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [i,o,w]=process.argv.slice(2);const svg=fs.readFileSync(i,'utf8');const b=await chromium.launch();
const p=await b.newPage({viewport:{width:Number(w||600)+40,height:800},deviceScaleFactor:1.5});
await p.setContent(`<html><body style="margin:20px;background:#fff"><div id="f" style="width:${Number(w||600)}px">${svg}</div><style>#f svg{width:100%;height:auto}</style></body></html>`);
await p.waitForTimeout(300);const el=await p.$('#f');await el.screenshot({path:o});await b.close();console.log('PNG',o);})().catch(e=>{console.error(e.message);process.exit(1);});
