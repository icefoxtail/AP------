import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const examDir=path.join(root,'.tmp/archive/archive2-m2-codex-20261006-03/19_신흥중_2학기_기말_중2_기출');
const assetDir=path.join(examDir,'assets/images/19_신흥중_2학기_기말_중2_기출');
const uid='19_신흥중_2학기_기말_중2_기출';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'};
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1:4179'); const pathname=decodeURIComponent(url.pathname); let file;
 const assetPrefix=`/archive/assets/images/${uid}/`;
 if(pathname.startsWith(assetPrefix)) file=path.join(assetDir,path.basename(pathname));
 else if(pathname===`/archive/exams/${uid}.js`) file=path.join(examDir,`${uid}.js`);
 else file=path.resolve(root,'.'+pathname);
 const rel=path.relative(root,file);
 if(rel==='..'||rel.startsWith('..'+path.sep)||path.isAbsolute(rel)){res.writeHead(403);res.end('forbidden');return;}
 fs.readFile(file,(err,bytes)=>{if(err){res.writeHead(404);res.end('not found');return;}res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(bytes);});
}).listen(4179,'127.0.0.1',()=>console.log('R3 render server 127.0.0.1:4179'));


