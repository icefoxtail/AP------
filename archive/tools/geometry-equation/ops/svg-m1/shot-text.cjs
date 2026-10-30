// usage: node diag-mathjax.cjs <data path relative to archive/> [mode=sol]
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const ROOT='/home/user/AP------/';const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'};
const srv=http.createServer((q,r)=>{const p=decodeURIComponent(new URL(q.url,'http://x').pathname),f=path.resolve(ROOT,'.'+p);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);});
(async()=>{await new Promise(r=>srv.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+srv.address().port;
const [data,mode,needle,out]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:1400}});
await p.goto(base+'/archive/engine.html?preview=1&mode='+mode+'&data='+encodeURIComponent(data),{waitUntil:'domcontentloaded'});await p.waitForTimeout(9000);
const h=await p.evaluateHandle(n=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let x;while(x=w.nextNode()){if(x.textContent.includes(n))return x.parentElement.closest('div,section,article,li')||x.parentElement;}return null;},needle);
const el=h.asElement();if(el){await el.scrollIntoViewIfNeeded();await el.screenshot({path:out});console.log('shot');}else console.log('not found');
await b.close();srv.close();})();
