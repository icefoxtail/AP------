// usage: node diag-mathjax.cjs <data path relative to archive/> [mode=sol]
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const ROOT='/home/user/AP------/';const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'};
const srv=http.createServer((q,r)=>{const p=decodeURIComponent(new URL(q.url,'http://x').pathname),f=path.resolve(ROOT,'.'+p);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);});
(async()=>{await new Promise(r=>srv.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+srv.address().port;
const [data,needle]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:1400}});
await p.goto(base+'/archive/engine.html?preview=1&mode=exam&data='+encodeURIComponent(data)+'&assetBase=off',{waitUntil:'domcontentloaded'});
let r;for(let t=0;t<60;t++){r=await p.evaluate(n=>[...document.images].filter(i=>i.src.includes(n)).map(i=>({src:i.src.slice(-60),w:i.naturalWidth,h:i.naturalHeight,complete:i.complete})),needle);if(r.length&&r.every(x=>x.complete&&x.w>0))break;await new Promise(z=>setTimeout(z,500));}
console.log(JSON.stringify(r));const el=await p.$('img[src*="'+needle+'"]');if(el){await el.scrollIntoViewIfNeeded();await el.screenshot({path:process.argv[4]||'/home/user/AP------/.tmp/svg-m1/qimg.png'});}
await b.close();srv.close();})();
