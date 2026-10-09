const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const projectRoot=path.resolve(__dirname,'../../..');
const expectedHead='518280f7f5ab73ae5c08f9e591fbe9274c131945';
const actualHead=cp.execFileSync('git',['rev-parse','origin/main'],{cwd:projectRoot,encoding:'utf8'}).trim();
if(actualHead!==expectedHead)throw new Error('REMOTE_MAIN_CHANGED:'+actualHead);
function git(args,buffer=false){const r=cp.spawnSync('git',args,{cwd:projectRoot,encoding:buffer?undefined:'utf8',maxBuffer:64*1024*1024});if(r.status!==0)throw Error('git '+args.join(' ')+' failed: '+(r.stderr?.toString?.()||r.error));return buffer?r.stdout:r.stdout.trim();}
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const sourcePaths=[
'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js',
'archive/exams/original/high/h1/1mid/26_복성고_1학기_중간_고1_기출.js',
'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',
'archive/exams/original/middle/m3/2mid/25_신흥중_2학기_중간_중3_수학.js'
];
const overlays=new Map(),sourceManifest=[],assetManifest=[];
function addRemoteFile(rel,kind){
 const blob=git(['rev-parse','origin/main:'+rel]);
 const bytes=git(['cat-file','blob','origin/main:'+rel],true);
 const absolute=path.resolve(projectRoot,rel);
 let localBlob=null,localSha=null,localBytes=null;
 try{localBytes=fs.readFileSync(absolute);localBlob=git(['hash-object','--path='+rel,'--',rel]);localSha=sha(localBytes);}catch{}
 overlays.set(rel.replaceAll(path.sep,'/'),bytes);
 const row={path:rel,remoteBlob:blob,sha256:sha(bytes),byteLength:bytes.length,localBlob,localSha256:localSha,localBytesEqual:localBytes?localBytes.equals(bytes):false};
 if(kind==='source')sourceManifest.push(row);else assetManifest.push(row);
}
for(const sourcePath of sourcePaths){
 const bytes=git(['cat-file','blob','origin/main:'+sourcePath],true);
 const text=bytes.toString('utf8');
 addRemoteFile(sourcePath,'source');
 for(const match of text.matchAll(/assets\/[^"'\s<>]+?\.(?:svg|png|jpe?g|webp)/gi)){
  const asset='archive/'+match[0].split(/[?#]/,1)[0];
  if(!assetManifest.some(item=>item.path===asset)){
   try{addRemoteFile(asset,'asset');}catch(error){assetManifest.push({path:asset,error:String(error.message||error)});}
  }
 }
}
const manifest={schemaVersion:'ARCHIVE_MAIN_SOURCE_ASSET_OVERLAY_V1',implementationCommit:expectedHead,remoteMain:actualHead,localCheckout:projectRoot,sourceCount:sourceManifest.length,assetCount:assetManifest.filter(item=>!item.error).length,localSourceMatches:sourceManifest.filter(item=>item.localBytesEqual).length,localSourceDifferences:sourceManifest.filter(item=>!item.localBytesEqual).map(item=>({path:item.path,localBlob:item.localBlob,remoteBlob:item.remoteBlob,localSha256:item.localSha256,remoteSha256:item.sha256})),sourceFiles:sourceManifest,assets:assetManifest};
fs.writeFileSync(path.join(__dirname,'post-main-source-asset-overlay.json'),JSON.stringify(manifest,null,2)+'\n','utf8');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.cjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);}catch{res.writeHead(400);res.end();return;}
 const rel=pathname.replace(/^\/+/,'').replaceAll('\\','/');
 const absolute=path.resolve(projectRoot,rel);
 if(absolute!==projectRoot&&!absolute.startsWith(projectRoot+path.sep)){res.writeHead(403);res.end();return;}
 let bytes=overlays.get(rel);
 try{if(!bytes)bytes=fs.readFileSync(absolute);}catch{res.writeHead(404,{'Cache-Control':'no-store'});res.end('Not found');return;}
 res.writeHead(200,{'Content-Type':mime[path.extname(rel).toLowerCase()]||'application/octet-stream','Content-Length':bytes.length,'Cache-Control':'no-store'});
 if(req.method==='HEAD')res.end();else res.end(bytes);
});
const port=Number(process.env.AP_OVERLAY_PORT||8767);
server.listen(port,'127.0.0.1',()=>console.log(JSON.stringify({event:'MAIN_SOURCE_OVERLAY_READY',remoteMain:actualHead,port,overlayCount:overlays.size,localSourceDifferences:manifest.localSourceDifferences.length,manifestPath:path.join(__dirname,'post-main-source-asset-overlay.json')})));
