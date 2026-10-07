import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import {createRequire} from "node:module";
const [root,exam,assetRoot,nodeModules]=process.argv.slice(2);
const require=createRequire(path.join(nodeModules,"../package.json"));
const {chromium}=require("playwright");
const b=fs.readFileSync(exam),s={window:{}};
vm.runInNewContext(b.toString("utf8"),s,{timeout:5000});
const bank=s.window.questionBank||s.window.questions;
const virtual="/archive/exams/__codex_capture__/"+path.basename(exam);
const within=(base,p)=>{const a=path.resolve(base,p),r=path.relative(base,a);if(r.startsWith("..")||path.isAbsolute(r))throw Error("PATH_ESCAPE");return a;};
const server=http.createServer((req,res)=>{try{const u=decodeURIComponent(new URL(req.url,"http://localhost").pathname);const f=u===virtual?exam:u.startsWith("/archive/assets/")?within(assetRoot,u.slice("/archive/".length)):within(root,u.slice(1));const real=fs.realpathSync(f);within(u.startsWith("/archive/assets/")?assetRoot:root,real);const ext=path.extname(f);const mime={".js":"text/javascript",".html":"text/html",".css":"text/css",".svg":"image/svg+xml",".png":"image/png",".json":"application/json",".woff2":"font/woff2"};res.writeHead(200,{"Content-Type":mime[ext]||"application/octet-stream","Cache-Control":"no-store"});res.end(fs.readFileSync(f));}catch(e){res.writeHead(404);res.end();}});
await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
const browser=await chromium.launch({channel:"chrome",headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:1000}});
 page.on("pageerror",e=>console.log("PAGEERROR",e.message));
 page.on("console",m=>{if(m.type()==="error"||m.type()==="warning")console.log("CONSOLE",m.type(),m.text());});
 await page.addInitScript(()=>{window.__mathErrorNodes=[];const scan=()=>{for(const e of document.querySelectorAll("mjx-merror")){if(!e.dataset.codexObserved){e.dataset.codexObserved="1";const q=e.closest(".q-box");window.__mathErrorNodes.push({text:e.textContent,html:e.outerHTML,qid:q?.dataset?.sourceRef||q?.querySelector(".q-num")?.textContent||null,questionText:q?.innerText||null,parentHtml:e.parentElement?.parentElement?.outerHTML?.slice(0,1800)||null});}}};new MutationObserver(scan).observe(document,{childList:true,subtree:true});});
 const origin="http://127.0.0.1:"+server.address().port;
 await page.goto(origin+"/archive/engine.html?preview=1&fit=screen&qpp=4&mode=sol&data="+encodeURIComponent(virtual.slice("/archive/".length)),{waitUntil:"load",timeout:60000});
 await page.waitForFunction(()=>document.documentElement.dataset.apRenderError||document.querySelectorAll("#print-area .q-box[data-source-ref]").length===22,{timeout:60000}).catch(()=>{});
 console.log(JSON.stringify(await page.evaluate(()=>({renderError:document.documentElement.dataset.apRenderError||null,mathErrors:window.__mathErrorNodes||[],boxCount:document.querySelectorAll("#print-area .q-box[data-source-ref]").length,title:document.title}))));
}finally{await browser.close();await new Promise(ok=>server.close(ok));}

