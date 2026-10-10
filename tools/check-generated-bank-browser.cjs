'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),http=require('node:http');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function main(){
  const chrome=process.env.CHROME_BIN||['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium'].find(p=>fs.existsSync(p));
  if(!chrome||!fs.existsSync(chrome))throw Error('Real Chrome unavailable: smoke PASS prohibited');
  const server=http.createServer((req,res)=>{
    try{const n=decodeURIComponent(new URL(req.url,'http://localhost').pathname),p=path.resolve(root,'.'+n);
      if(!p.startsWith(root+path.sep)||!fs.existsSync(p)||fs.statSync(p).isDirectory()){res.writeHead(404);res.end();return;}
      res.writeHead(200,{'Content-Type':(n.endsWith('.json')?'application/json':n.endsWith('.svg')?'image/svg+xml':n.endsWith('.png')?'image/png':n.endsWith('.js')?'text/javascript':'text/html')+'; charset=utf-8'});
      fs.createReadStream(p).pipe(res);
    }catch(e){res.writeHead(500);res.end(String(e));}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const url='http://127.0.0.1:'+server.address().port+'/archive/generated-bank.html';
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'b03-chrome-'));
  const browser=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
    '--no-first-run','--disable-background-networking','--remote-allow-origins=*',
    '--remote-debugging-port=0','--user-data-dir='+temp,'about:blank'],{stdio:'ignore'});
  let ws;
  try{
    let port=0;
    for(let k=0;k<100;k++){
      if(browser.exitCode!==null)throw Error('Chrome exited '+browser.exitCode);
      const p=path.join(temp,'DevToolsActivePort');
      if(fs.existsSync(p)){port=Number(fs.readFileSync(p,'utf8').split('\n')[0]);break;}
      await sleep(100);
    }
    if(!port)throw Error('Chrome debugging port not found');
    const targets=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();
    const target=targets.find(x=>x.type==='page');
    if(!target)throw Error('Chrome page target missing');
    ws=new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
    let id=0;const pending=new Map();
    ws.addEventListener('message',ev=>{
      const d=JSON.parse(ev.data);if(!pending.has(d.id))return;
      const p=pending.get(d.id);pending.delete(d.id);d.error?p.reject(Error(JSON.stringify(d.error))):p.resolve(d.result);
    });
    const send=(method,params={})=>new Promise((resolve,reject)=>{
      const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));
    });
    const ev=async expression=>{
      const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});
      if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));
      return r.result.value;
    };
    await send('Runtime.enable');await send('Page.enable');await send('Page.navigate',{url});
    async function wait(expression,label){
      for(let i=0;i<120;i++){try{if(await ev(expression))return;}catch(e){if(i>115)throw e;}await sleep(100);}
      throw Error('Real Chrome mock-exam failure: '+label);
    }
    await wait("document.getElementById('source-year')?.value==='2025'&&document.getElementById('source-school')?.value==='팔마고'&&document.getElementById('source-semester')?.value==='2'&&document.getElementById('source-term')?.value==='중간'&&document.getElementById('source-coverage')?.textContent.includes('/'+sourceExamChoice.count)",'Palma source filters and approved coverage load');
    const home=await ev("(()=>({year:document.getElementById('source-year').value,school:document.getElementById('source-school').value,grade:document.getElementById('source-grade').value,subject:document.getElementById('source-subject').value,semester:document.getElementById('source-semester').value,term:document.getElementById('source-term').value,schoolOptions:[...document.getElementById('source-school').options].map(x=>x.value),semesterOptions:[...document.getElementById('source-semester').options].map(x=>x.value),sourceCount:sourceExamChoice.count,coverage:document.getElementById('source-coverage').textContent,purposeLabels:[...document.querySelectorAll('[data-purpose-card]')].map(x=>x.textContent),separate:document.getElementById('purpose-difficulty-note').textContent,randomChecked:document.getElementById('difficulty-mode-random').checked,legacyCards:document.querySelectorAll('#exam-cards .exam-card').length,expectedLegacyCards:availableExams().length,teacherToolsHidden:document.getElementById('teacher-mock-tools').hidden,teacherNote:document.getElementById('teacher-output-note').textContent}))()");
    if(home.year!=='2025'||home.school!=='팔마고'||home.grade!=='고1'||home.subject!=='공통수학2'||home.semester!=='2'||home.term!=='중간'||JSON.stringify(home.schoolOptions)!==JSON.stringify(['팔마고'])||JSON.stringify(home.semesterOptions)!==JSON.stringify(['2'])||!home.coverage.includes(String(home.sourceCount))||!home.purposeLabels.some(x=>x.includes('A')&&x.includes('유형 익히기'))||!home.purposeLabels.some(x=>x.includes('B')&&x.includes('응용 넓히기'))||!home.purposeLabels.some(x=>x.includes('C')&&x.includes('심화 도전하기'))||!home.separate.includes('별도로')||!home.randomChecked||(home.legacyCards!==home.expectedLegacyCards||home.expectedLegacyCards<4)||!home.teacherToolsHidden||!home.teacherNote.includes('교사 로그인'))throw Error('Mock builder source/purpose screen incorrect '+JSON.stringify(home));
    await ev("(()=>{const year=document.getElementById('source-year');year.value='2026';year.dispatchEvent(new Event('change',{bubbles:true}));return true})()");
    const afterYear=await ev("(()=>({year:document.getElementById('source-year').value,school:document.getElementById('source-school').value,schoolOptions:[...document.getElementById('source-school').options].map(x=>x.value),title:document.getElementById('source-exam-title').textContent}))()");
    if(afterYear.year!=='2026'||!['복성고','효천고'].includes(afterYear.school)||afterYear.schoolOptions.length!==2||!afterYear.title.includes(afterYear.school))throw Error('Year filter did not constrain school choices '+JSON.stringify(afterYear));
    await ev("(()=>{const school=document.getElementById('source-school');school.value='효천고';school.dispatchEvent(new Event('change',{bubbles:true}));return true})()");
    const afterSchool=await ev("(()=>({year:document.getElementById('source-year').value,school:document.getElementById('source-school').value,semester:document.getElementById('source-semester').value,term:document.getElementById('source-term').value,title:document.getElementById('source-exam-title').textContent}))()");
    if(afterSchool.year!=='2026'||afterSchool.school!=='효천고'||afterSchool.semester!=='1'||afterSchool.term!=='중간'||!afterSchool.title.includes('효천고'))throw Error('School filter changed to an unrelated source exam '+JSON.stringify(afterSchool));
    await ev("(()=>{const year=document.getElementById('source-year');year.value='2025';year.dispatchEvent(new Event('change',{bubbles:true}));return true})()");
    await ev("(()=>{window.__paperPrintCount=0;window.print=()=>window.__paperPrintCount++;document.getElementById('generate-mock').click();return true})()");
    await wait("!mockBusy && document.querySelectorAll('#mock-questions .mock-question').length>1&&[...document.querySelectorAll('#mock-questions .mock-question-body')].every(x=>x.dataset.loaded==='true')",'random Palma mock questions load');
    const firstMock=await ev("(()=>{const cards=[...document.querySelectorAll('#mock-questions .mock-question')];const qids=cards.map(x=>Number(x.dataset.sourceQid));const uids=cards.map(x=>x.dataset.uid);const candidateQids=[...new Set(rows.filter(r=>r.sourceExamBlobSha==='4cfce909c023e5c4df4a759945c8cc3e0a63ec76'&&r.consumerSelectable===true&&/^ALITE-PALMA25-2MID-Q\\d+-[ABC][123]$/.test(r.uid)).map(r=>Number(r.sourceQid)))].sort((a,b)=>a-b);const sourceCount=sourceExamChoice.count,expectedMissing=Array.from({length:sourceCount},(_,i)=>i+1).filter(qid=>!candidateQids.includes(qid));const missingText=document.getElementById('mock-missing-qids').textContent;return {count:cards.length,sourceCount,covered:[...new Set(qids)].sort((a,b)=>a-b),expected:candidateQids,expectedMissing,uniqueUids:new Set(uids).size,uniqueQids:new Set(qids).size,coverageText:document.getElementById('mock-result-summary').textContent,missingMatches:expectedMissing.length?expectedMissing.every(qid=>missingText.includes('q'+qid)):missingText.includes('모든 원본 문항'),allPreviewed:cards.every(x=>x.querySelector('.mock-question-body')?.dataset.loaded==='true'),studentSafe:cards.every(x=>!x.querySelector('.answer'))}})()");
    if(firstMock.count!==firstMock.expected.length||JSON.stringify(firstMock.covered)!==JSON.stringify(firstMock.expected)||firstMock.uniqueUids!==firstMock.count||firstMock.uniqueQids!==firstMock.count||!firstMock.coverageText.includes('기준 시험지 '+firstMock.sourceCount+'문항 중 원본 번호 '+firstMock.expected.length+'개를 사용합니다.')||firstMock.expectedMissing.length!==0||!firstMock.missingMatches||!firstMock.allPreviewed||!firstMock.studentSafe)throw Error('QID9 source coverage/preview mismatch '+JSON.stringify(firstMock));
    await ev("(()=>{document.getElementById('purpose-B').click();return true})()");
    const stale=await ev("(()=>({visible:!document.getElementById('mock-stale-note').hidden,printDisabled:document.getElementById('print-mock').disabled,summary:document.getElementById('mock-result-summary').textContent}))()");
    if(!stale.visible||!stale.printDisabled||!stale.summary.includes('B 응용 넓히기'))throw Error('Changed conditions left an unlabelled old selection printable '+JSON.stringify(stale));
    await ev("(()=>{document.getElementById('purpose-B').click();return true})()");
    await ev("(()=>{const body=document.querySelector('#mock-questions .mock-question-body');document.querySelector('#mock-questions .mock-question .mock-lock').click();window.__mockLockPreservedBody=document.querySelector('#mock-questions .mock-question-body')===body;window.__lockedMockUid=document.querySelector('#mock-questions .mock-question').dataset.uid;document.getElementById('regenerate-unlocked').click();return true})()");
    await wait("!mockBusy && window.__mockLockPreservedBody&&document.querySelector('#mock-questions .mock-question')?.dataset.uid===window.__lockedMockUid&&document.querySelectorAll('#mock-questions .mock-question').length>1&&[...document.querySelectorAll('#mock-questions .mock-question-body')].every(x=>x.dataset.loaded==='true')",'locked question and preview DOM remain during regeneration');
    const replaceBefore=await ev("(()=>{const x=document.querySelectorAll('#mock-questions .mock-question')[1];return {uid:x.dataset.uid,qid:x.dataset.sourceQid}})()");
    await ev("(()=>document.querySelectorAll('#mock-questions .mock-question .mock-replace')[1].click())()");
    try{await wait("!mockBusy && document.querySelectorAll('#mock-questions .mock-question')[1]?.dataset.uid!=="+JSON.stringify(replaceBefore.uid),'unlocked question replacement');}catch(error){const debug=await ev("(()=>({current:document.querySelectorAll('#mock-questions .mock-question')[1]?.dataset.uid,status:document.getElementById('message').textContent,disabled:document.querySelectorAll('#mock-questions .mock-replace')[1]?.disabled,busy:mockBusy,stale:document.getElementById('mock-stale-note').hidden}))()");throw Error(error.message+' '+JSON.stringify({...debug,before:replaceBefore}));}
    const replaceAfter=await ev("(()=>{const x=document.querySelectorAll('#mock-questions .mock-question')[1];const cards=[...document.querySelectorAll('#mock-questions .mock-question')];return {uid:x.dataset.uid,qid:x.dataset.sourceQid,unique:new Set(cards.map(c=>c.dataset.uid)).size===cards.length}})()");
    if(replaceAfter.qid!==replaceBefore.qid||!replaceAfter.unique)throw Error('Per-question replacement changed source slot or duplicated UID '+JSON.stringify(replaceAfter));
    await ev("(()=>{for(const p of ['A','B','C'])document.getElementById('purpose-'+p).checked=p==='A';document.getElementById('difficulty-bucket').value='2';document.getElementById('difficulty-bucket').dispatchEvent(new Event('change',{bubbles:true}));document.getElementById('difficulty-mode-specified').click();document.getElementById('generate-mock').click();return true})()");
    await wait("!mockBusy && document.querySelectorAll('#mock-questions .mock-question').length>0&&[...document.querySelectorAll('#mock-questions .mock-question')].every(x=>x.dataset.purpose==='A'&&x.dataset.difficulty==='2')&&[...document.querySelectorAll('#mock-questions .mock-question-body')].every(x=>x.dataset.loaded==='true')",'A purpose with numeric difficulty 2');
    await ev("(()=>{for(let i=1;i<=5;i++)document.getElementById('quota-'+i).value='0';document.getElementById('quota-2').value='1';document.getElementById('difficulty-mode-mixed').click();document.getElementById('generate-mock').click();return true})()");
    try{await wait("!mockBusy && document.querySelectorAll('#mock-questions .mock-question').length===1&&document.querySelector('#mock-questions .mock-question').dataset.difficulty==='2'",'exact mixed quota output');}catch(error){const debug=await ev("(()=>({mode:document.getElementById('difficulty-mode-mixed').checked,purposes:['A','B','C'].map(x=>[x,document.getElementById('purpose-'+x).checked]),quota:document.getElementById('quota-2').value,ready:document.getElementById('builder-readiness').textContent,generateDisabled:document.getElementById('generate-mock').disabled,cards:[...document.querySelectorAll('#mock-questions .mock-question')].map(x=>[x.dataset.sourceQid,x.dataset.difficulty]),status:document.getElementById('message').textContent,busy:mockBusy}))()");throw Error(error.message+' '+JSON.stringify(debug));}
    await ev("(()=>{document.getElementById('quota-2').value='0';document.getElementById('quota-1').value=String(sourceExamChoice.count+1);document.getElementById('quota-1').dispatchEvent(new Event('input',{bubbles:true}));return true})()");
    const impossibleMix=await ev("(()=>({sourceCount:sourceExamChoice.count,ready:document.getElementById('builder-readiness').textContent,generateDisabled:document.getElementById('generate-mock').disabled,printDisabled:document.getElementById('print-mock').disabled,staleVisible:!document.getElementById('mock-stale-note').hidden}))()");
    if(!impossibleMix.ready.includes(impossibleMix.sourceCount+'문항보다 1문항 많습니다')||!impossibleMix.generateDisabled||!impossibleMix.printDisabled||!impossibleMix.staleVisible)throw Error('Impossible mixed quota was not shown fail-closed '+JSON.stringify(impossibleMix));
    await ev("(()=>{document.getElementById('quota-1').value='0';document.getElementById('quota-2').value='1';document.getElementById('quota-2').dispatchEvent(new Event('input',{bubbles:true}));return true})()");
    await ev("(()=>{document.getElementById('print-mock').click();return true})()");
    async function inspectExamPopup(count,school){
      let target;for(let n=0;n<200;n++){const targets=await send('Target.getTargets');target=targets.targetInfos.find(t=>t.type==='page'&&t.url.includes('mixed_engine.html')&&t.url.includes('mode=exam'));if(target)break;await sleep(100);}
      if(!target)throw Error('Mixer exam popup missing '+school);
      const attached=await send('Target.attachToTarget',{targetId:target.targetId,flatten:true}),sessionId=attached.sessionId;
      const popupEv=async expression=>{const id2=++id;const result=await new Promise((resolve,reject)=>{pending.set(id2,{resolve,reject});ws.send(JSON.stringify({id:id2,method:'Runtime.evaluate',params:{expression,returnByValue:true,awaitPromise:true},sessionId}));});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value;};
      let view;for(let n=0;n<400;n++){try{view=await popupEv("({mode:AppState.mode,count:AppState.data.length,boxes:document.querySelectorAll('#print-area .q-box').length,title:AppState.meta.title,answers:document.querySelectorAll('#print-area .sol-box,#print-area .ans-cell').length})");if(view.boxes===count)break;}catch{}await sleep(100);}
      if(view?.mode!=='exam'||view.count!==count||view.boxes!==count||!view.title.includes(school)||view.answers)throw Error('Mixer question output mismatch '+JSON.stringify(view));
      await popupEv('window.close();true');
    }
    await inspectExamPopup(1,'팔마고');
    await ev("(()=>{const btn=[...document.querySelectorAll('#exam-cards .exam-card')].find(x=>x.textContent.includes('복성고'));btn.click();document.getElementById('print').click();return true})()");
    const bokCount=await ev("availableExams().find(exam=>exam.school==='복성고').count");
    if(bokCount!==22)throw Error('Current Bokseong source-backed qid coverage changed '+bokCount);
    await inspectExamPopup(bokCount,'복성고');
    await ev("(()=>{const btn=[...document.querySelectorAll('#exam-cards .exam-card')].find(x=>x.textContent.includes('효천고'));btn.click();document.getElementById('print').click();return true})()");
    const hyoCount=await ev("availableExams().find(exam=>exam.school==='효천고').count");if(hyoCount!==19)throw Error('Current Hyocheon source-backed qid coverage changed '+hyoCount);await inspectExamPopup(hyoCount,'효천고');
    // Hyocheon 92 historically approved rows are expected to be selectable.
    const source=await ev("(async()=>{const bok=rows.filter(r=>r.school==='복성고'),hyo=rows.filter(r=>r.school==='효천고'),palma=rows.filter(r=>r.school==='팔마고');const passes=await Promise.all(rows.filter(isSelectable).map(async x=>{const q=await questionFor(x);return !!q.content&&q.answer!=null&&q.solution!=null}));return {total:rows.length,bok:bok.length,hyo:hyo.length,hyoSelectable:hyo.filter(x=>x.consumerSelectable===true).length,palma:palma.length,pass:passes.filter(Boolean).length,selectableCount:rows.filter(isSelectable).length,holdExcluded:!rows.some(x=>x.uid==='ALITE-20261008-HYC26-Q18-003'||x.uid==='ALITE-20261008-HYC26-Q10-001')};})()");
    if(source.total<382||source.bok!==191||source.hyo!==94||source.hyoSelectable!==94||source.palma<99||source.pass!==source.selectableCount||source.holdExcluded)throw Error('Data supply regression '+JSON.stringify(source));
    const palmaQid9=await ev("(async()=>{const uids=rows.filter(r=>r.sourceExamBlobSha===sourceExamChoice.sha&&r.consumerSelectable===true&&/^ALITE-PALMA25-2MID-Q\\d+-[ABC][123]$/.test(r.uid));const qs=await Promise.all(uids.map(questionFor));const expectedQids=Array.from({length:sourceExamChoice.count},(_,i)=>i+1);const actualQids=[...new Set(uids.map(r=>Number(r.sourceQid)))].sort((a,b)=>a-b);const perQid=Object.fromEntries(expectedQids.map(qid=>[qid,uids.filter(r=>Number(r.sourceQid)===qid).length]));const fullCoverage=JSON.stringify(actualQids)===JSON.stringify(expectedQids),ninePerQid=fullCoverage&&Object.values(perQid).every(count=>count===9);const indexHealthy=uids.every(r=>(['USER_DIRECTED_OPERATING_APPROVED','USER_DIRECTED_QUALITY_APPROVED'].includes(r.approval)||(r.approval==='REVIEW_APPROVED'&&r.reviewStatus==='REVIEW_PASS')));const validForms=qs.every(q=>(q.questionType==='객관식'&&q.choices.length===5&&'①②③④⑤'.includes(q.answer))||(['서술형','단답형','주관식'].includes(q.questionType)&&q.choices.length===0&&String(q.answer||'').trim()!==''));return {count:uids.length,sourceCount:sourceExamChoice.count,sourceQids:actualQids,unique:new Set(uids.map(r=>r.uid)).size,loaded:qs.length,fullCoverage,ninePerQid,validForms,objective:qs.filter(q=>q.questionType==='객관식').length,descriptive:qs.filter(q=>['서술형','단답형','주관식'].includes(q.questionType)).length,allSolutions:qs.every(q=>!!q.solution&&!!q.content),indexHealthy};})()");
    if(palmaQid9.count!==palmaQid9.sourceCount*9||palmaQid9.unique!==palmaQid9.count||palmaQid9.loaded!==palmaQid9.count||!palmaQid9.fullCoverage||!palmaQid9.ninePerQid||!palmaQid9.validForms||!palmaQid9.allSolutions||!palmaQid9.indexHealthy)throw Error('Palma QID9 generated live student lookup failed '+JSON.stringify(palmaQid9));
    const b12=await ev("(async()=>{const matched=rows.filter(r=>r.uid.startsWith('ALITE-BSG26-B01R2-')||r.uid.startsWith('ALITE-BSG26-B02-'));const qs=await Promise.all(matched.map(questionFor));return {count:matched.length,b01:matched.filter(r=>r.uid.includes('B01R2')).length,b02:matched.filter(r=>r.uid.includes('B02')).length,unique:new Set(matched.map(r=>r.uid)).size,valid:qs.every(q=>q.choices.length===5&&!!q.content&&!!q.answer&&!!q.solution),q11Released:rows.filter(r=>r.uid.startsWith('ALITE-BSG26-B02-Q11-')).length}})()");
    if(b12.count!==83||b12.b01!==45||b12.b02!==38||b12.unique!==83||!b12.valid||b12.q11Released!==9)throw Error('B01/B02 83 real Chrome student lookup including nine q11 items mismatch '+JSON.stringify(b12));
    const q11=await ev("(async()=>{const items=rows.filter(r=>r.uid.startsWith('ALITE-BSG26-B02-Q11-'));const qs=await Promise.all(items.map(questionFor));return {count:items.length,rpm:qs.filter(q=>['H1-RPM-184','H1-RPM-185'].includes(q.rpmRecordId)).length,ext:qs.filter(q=>q.extensionL3Id==='EXT-H1-BSG26-ABS-PIECEWISE-L3').length,valid:qs.every(q=>q.content&&q.choices.length===5&&q.answer&&q.solution)}})()");
    if(q11.count!==9||q11.rpm!==3||q11.ext!==6||!q11.valid)throw Error('B02 q11 semantic Chrome verification '+JSON.stringify(q11));
    const q22=await ev("(async()=>{const items=rows.filter(r=>r.uid.startsWith('ALITE-BSG26-B05R2-Q22-'));const questions=await Promise.all(items.map(questionFor));return {count:items.length,subjective:questions.filter(q=>q.choices.length===0).length,valid:questions.every(q=>q.content&&q.answer&&q.solution),meta:items.every(r=>r.rpmRecordId)}})()");
    if(q22.count!==10||q22.subjective!==10||!q22.valid||!q22.meta)throw Error('B05 q22 10 subjective student lookup failed '+JSON.stringify(q22));
    const b06=await ev("(async()=>{const b=rows.filter(r=>r.uid.startsWith('ALITE-BSG26-B06-'));const questions=await Promise.all(b.map(r=>questionFor(r)));const sources=[...new Set(questions.map(q=>q.image))];const graphics=await Promise.all(sources.map(src=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve({src,valid:img.naturalWidth>0,w:img.naturalWidth,h:img.naturalHeight});img.onerror=()=>resolve({src,valid:false});img.src=new URL(src,location.href).href;})));return {registered:b.length,objective:questions.filter(q=>q.choices.length===5).length,subjective:questions.filter(q=>q.choices.length===0).length,imageCount:sources.length,images:graphics,remainingMarkdown:questions.filter(q=>q.content.includes('**')).length,s01:questions.find(q=>q.uid.endsWith('B06-Q19-S01'))?.answer,s15:questions.find(q=>q.uid.endsWith('B06-Q19-S15'))?.answer}})()");
    if(b06.registered!==25||b06.objective!==23||b06.subjective!==2||b06.imageCount!==9||b06.remainingMarkdown||b06.s01!=='⑤'||b06.s15!=='④'||b06.images.some(x=>!x.valid))throw Error('B06 real SVG and original-pixel wrapper load mismatch '+JSON.stringify(b06));

    const table=await ev("(async()=>{const row=rows.find(x=>x.uid==='ALITE-BSG26-B04R2-Q23-S01');const q=await questionFor(row);const root=document.createElement('section');questionMarkup(root,q,row,true);return {table:root.querySelectorAll('table.question-table').length,rows:root.querySelectorAll('tr').length,noRaw:!root.textContent.includes('<table'),answer:root.textContent.includes('정답:')};})()");
    if(table.table!==1||table.rows!==3||!table.noRaw||!table.answer)throw Error('HTML table/subjective regression '+JSON.stringify(table));
    console.log('GENERATED_BANK_REAL_CHROME_SMOKE_PASS '+JSON.stringify({screen:'source-filters-purpose-difficulty-preview-lock-replace-print',bokseongPrinted:22,hyocheonPrinted:19,registered:source.total,bokseongAvailable:191,hyocheonAvailable:94,palmaAvailable:source.palma,palmaNewLookupVerified:palmaQid9.count,mainSourceAvailableIndependentOfReview:true,tableSubjective:true}));
  }finally{
    if(ws)ws.close();
    browser.kill('SIGTERM');
    await new Promise(r=>server.close(r));
    try{fs.rmSync(temp,{recursive:true,force:true});}catch(e){}
  }
}
main().catch(e=>{console.error('GENERATED_BANK_REAL_CHROME_SMOKE_FAIL',e);process.exitCode=1;});
