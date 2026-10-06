const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=process.cwd();
const run=path.join(root,'.tmp/archive/archive2-m2-codex-20261006-03/20_신흥중_2학기_기말_중2_기출');
const uid='20_신흥중_2학기_기말_중2_기출';
const exam='/archive/exams/original/middle/m2/2final/'+uid+'.js';
http.createServer((req,res)=>{
 let u=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname), f;
 if(u===exam) f=path.join(run,uid+'.js');
 else if(u.startsWith('/archive/assets/images/'+uid+'/')) f=path.join(run,'assets/images',uid,path.basename(u));
 else f=path.join(root,u.replace(/^\//,''));
 if(!f.startsWith(root)){res.writeHead(403);return res.end();}
 fs.readFile(f,(e,b)=>{if(e){res.writeHead(404);return res.end('not found '+u)};let ext=path.extname(f).toLowerCase();res.writeHead(200,{'Content-Type':ext==='.js'?'text/javascript':ext==='.png'?'image/png':ext==='.css'?'text/css':ext==='.svg'?'image/svg+xml':'text/html','Cache-Control':'no-store'});res.end(b)});
}).listen(8765,'127.0.0.1');
