import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const profile=fs.mkdtempSync(path.join(os.tmpdir(),"codex-archive2-mobile-layout-"));
const chrome="C:/Program Files/Google/Chrome/Application/chrome.exe";
const url=new URL("http://127.0.0.1:8768/archive/engine.html");
url.searchParams.set("data","exams/original/high/h2/1mid/26_매산고_1학기_중간_고2_기하.js");
url.searchParams.set("mode","exam");
url.searchParams.set("qpp","4");
url.searchParams.set("fit","screen");
const child=spawn(chrome,["--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--remote-debugging-port=0","--remote-allow-origins=*","--user-data-dir="+profile,"about:blank"],{stdio:"ignore",windowsHide:true});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const active=path.join(profile,"DevToolsActivePort");
for(let i=0;i<200&&!fs.existsSync(active);i++){if(child.exitCode!==null)throw new Error("Chrome exited "+child.exitCode);await delay(100);}
const port=fs.readFileSync(active,"utf8").trim().split(/\r?\n/)[0];
const version=await fetch("http://127.0.0.1:"+port+"/json/version").then(r=>r.json());
const ws=new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true});});
let id=0;const pending=new Map();
ws.addEventListener("message",event=>{let m;try{m=JSON.parse(String(event.data));}catch{return;}if(!m.id||!pending.has(m.id))return;const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(new Error(m.error.message));else p.resolve(m.result);});
function send(method,params={},sessionId){const requestId=++id;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(requestId);reject(new Error("timeout "+method));},30000);pending.set(requestId,{resolve,reject,timer});const message={id:requestId,method,params};if(sessionId)message.sessionId=sessionId;ws.send(JSON.stringify(message));});}
async function evaluate(expression,session){const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true},session);if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result?.value;}
try{
 const target=await send("Target.createTarget",{url:"about:blank"});
 const attached=await send("Target.attachToTarget",{targetId:target.targetId,flatten:true});
 const session=attached.sessionId;
 await send("Page.enable",{},session);await send("Runtime.enable",{},session);
 await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:false},session);
 await send("Page.navigate",{url:url.href},session);
 const expression='(function(){const e=document.documentElement,a=document.querySelector("#print-area"),p=a?.querySelector(".page"),g=p?.querySelector(".grid-container");const rect=x=>x?.getBoundingClientRect().toJSON()||null;return JSON.stringify({viewport:[innerWidth,innerHeight],bodyClass:document.body?.className||"",ready:e.dataset.apRenderReady||null,error:e.dataset.apRenderError||null,doc:{width:e.scrollWidth,client:e.clientWidth},area:{rect:rect(a),offsetWidth:a?.offsetWidth,scrollWidth:a?.scrollWidth,transform:a&&getComputedStyle(a).transform},page:{rect:rect(p),offsetWidth:p?.offsetWidth,offsetHeight:p?.offsetHeight,scrollWidth:p?.scrollWidth,clientHeight:p?.clientHeight,style:p?.getAttribute("style"),computedHeight:p&&getComputedStyle(p).height},grid:{rect:rect(g),offsetHeight:g?.offsetHeight,scrollHeight:g?.scrollHeight,columns:g&&getComputedStyle(g).gridTemplateColumns,style:g?.getAttribute("style")},cols:[...(g?.querySelectorAll(".grid-col")||[])].map(x=>({rect:rect(x),height:getComputedStyle(x).height,scrollHeight:x.scrollHeight,style:x.getAttribute("style")})),boxes:[...(g?.querySelectorAll(".q-box")||[])].slice(0,8).map(x=>({text:x.innerText.slice(0,50),rect:rect(x),height:getComputedStyle(x).height,offsetHeight:x.offsetHeight,scrollHeight:x.scrollHeight,position:getComputedStyle(x).position,flex:getComputedStyle(x).flex,style:x.getAttribute("style")})),math:[...(p?.querySelectorAll("mjx-container")||[])].slice(0,4).map(x=>({rect:rect(x),height:x.getBoundingClientRect().height,font:getComputedStyle(x).fontSize,scrollWidth:x.scrollWidth,clientWidth:x.clientWidth}))})})()';
 let state=null;
 for(let i=0;i<240;i++){state=JSON.parse(await evaluate(expression,session));if(state.ready==="true"||state.error)break;await delay(250);}
 console.log(JSON.stringify({url:url.href,state},null,2));
 const cap=await send("Page.captureScreenshot",{format:"png",fromSurface:true,captureBeyondViewport:false},session);
 fs.writeFileSync(path.join("C:/Users/USER/.codex/worktrees/archive2-exam-render-ux/AP------/archive/docs/archive2/phase2-exam-detail-render-ux/evidence/screens","debug-mobile-layout.png"),Buffer.from(cap.data,"base64"));
 await send("Target.closeTarget",{targetId:target.targetId});
}finally{
 try{await send("Browser.close");}catch{}
 try{ws.close();}catch{}
 await Promise.race([new Promise(r=>child.once("exit",r)),delay(5000)]);
 if(child.exitCode===null)try{child.kill();}catch{}
 const temp=path.resolve(os.tmpdir());const dest=path.resolve(profile);if(dest.startsWith(temp+path.sep))try{fs.rmSync(dest,{recursive:true,force:true});}catch{}
}
