(async function runStudentBrowserAudit(){
  'use strict';
  const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
  const {chromium}=require(process.env.AP_PLAYWRIGHT_MODULE||'playwright');
  const root=path.resolve(__dirname,'..');
  const out=process.env.STUDENT_UX_SHOTS_DIR||'/tmp/student-portal-ux';
  fs.mkdirSync(out,{recursive:true});
  const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
  const server=http.createServer((req,res)=>{
    let u;
    try{u=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.statusCode=400;return res.end();}
    u=u.replace(/^\/AP------(?=\/|$)/,'')||'/';
    if(u.endsWith('/'))u+='index.html';
    const file=path.resolve(root,'.'+u);
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;return res.end('not found');}
    res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
    res.end(fs.readFileSync(file));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const port=server.address().port,origin=`http://127.0.0.1:${port}/AP------/apmath/student/`;
  const executablePath=process.env.CHROME_BIN||process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  let browser;
  const failures=[],report=[],unexpectedApi=[];
  let completed=false;
  try{
    browser=await chromium.launch({headless:true,executablePath:executablePath||undefined,args:['--no-sandbox']});
    for(const device of [{name:'phone360',width:360,height:780},{name:'phone390',width:390,height:844},{name:'tabletP',width:800,height:1280},{name:'tabletL',width:1280,height:800},{name:'desktop',width:1440,height:900}]){
      const exams=[
        {assignment_id:'ux-a1',exam_title:'1차 단원평가',class_name:'중1A',exam_date:'2026-11-10',question_count:5,is_submitted:0,wrong_ids:[2],archive_file:'original/middle/mock.js'},
        {assignment_id:'ux-a2',exam_title:'2차 단원평가',class_name:'중1A',exam_date:'2026-11-09',question_count:5,is_submitted:0,wrong_ids:[],archive_file:'original/middle/mock.js'},
        {assignment_id:'ux-a3',exam_title:'완료 시험',class_name:'중1A',exam_date:'2026-11-08',question_count:5,is_submitted:1,score:88,archive_file:'original/middle/mock.js'},
        {assignment_id:'ux-a4',exam_title:'이전 시험',class_name:'중1A',exam_date:'2026-11-07',question_count:5,is_submitted:1,score:92,archive_file:'original/middle/mock.js'},
        {assignment_id:'ux-a5',exam_title:'상태 확인 시험',class_name:'중1A',exam_date:'2026-11-06',question_count:5,archive_file:'original/middle/mock.js'}
      ];
      const context=await browser.newContext({viewport:{width:device.width,height:device.height},deviceScaleFactor:1,serviceWorkers:'block'});
      await context.addInitScript(()=>{
        localStorage.setItem('APMATH_STUDENT_PORTAL_SESSION',JSON.stringify({student_id:'ux-student',student_token:'fixture-only',name:'테스트 학생',grade:'중1'}));
        localStorage.setItem('APMATH_SESSION',JSON.stringify({session_token:'fixture-teacher-only'}));
      });
      await context.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'text/css',body:''}));
      const sent=[];
      await context.route('https://ap-math-os-v2612.js-pdf.workers.dev/api/**',async route=>{
        const req=route.request(),url=new URL(req.url());
        if(req.method()==='OPTIONS')return route.fulfill({status:204,headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'}});
        let body={success:true};
        if(url.pathname.endsWith('/student-portal/home'))body={success:true,read_only:!!req.headers().authorization,student:{id:'ux-student',name:'테스트 학생',grade:'중1',school_name:'왕지중'},assignments:[],class_exam_assignments:exams};
        else if(url.pathname.endsWith('/student-portal/exams'))body={success:true,exams};
        else if(url.pathname.endsWith('/student-portal/wrong-clinics'))body={success:true,packets:[]};
        else if(url.pathname.endsWith('/student-portal/learning-history'))body={success:true,items:[],next_cursor:null,has_more:false};
        else if(url.pathname.endsWith('/material-omr/student-assignments'))body={success:true,items:[]};
        else if(url.pathname.endsWith('/student-portal/omr-submit')){
          const submitted=JSON.parse(req.postData()||'{}');sent.push(submitted);
          const match=exams.find(x=>x.assignment_id===submitted.assignment_id);
          if(match){match.is_submitted=1;match.score=73;match.wrong_ids=submitted.wrong_ids;}
          body={success:true,session:{id:'ux-session',score:73,wrong_ids:submitted.wrong_ids}};
        }
        else {unexpectedApi.push({path:url.pathname,method:req.method()});return route.fulfill({status:501,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify({success:false,message:'Unexpected synthetic API request'})});}
        return route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(body)});
      });
      const page=await context.newPage(),errors=[];
      page.on('pageerror',err=>errors.push(String(err)));
      await page.goto(origin,{waitUntil:'domcontentloaded'});
      await page.locator('#student-portal-omr-home-section').waitFor({timeout:20000});
      await page.locator('#portal-geometry-lab-entry').waitFor();
      const ui=await page.evaluate(()=>{
        const home=document.querySelector('#student-portal-omr-home-section');
        const lab=document.querySelector('#portal-geometry-lab-entry');
        return {
          background:getComputedStyle(document.body).backgroundColor,
          homeY:home.getBoundingClientRect().top+scrollY,
          labY:lab.getBoundingClientRect().top+scrollY,
          horizontalOverflow:document.documentElement.scrollWidth-innerWidth,
          exams:home.querySelectorAll('article.omr-card').length,
          labHref:lab.getAttribute('href'),
          version:document.querySelector('.student-app-version')?.textContent||''
        };
      });
      assert(ui.homeY<ui.labY,'exam-first home places exam before lab');
      assert.equal(ui.exams,3,'home shows only three previews');
      assert(ui.labHref.endsWith('#g7'),'middle-one grade links to matching lab');
      assert(ui.horizontalOverflow<=2,`${device.name} home has no horizontal overflow: ${ui.horizontalOverflow}`);
      assert.equal(ui.background,'rgb(250, 249, 247)','APMS stone theme is rendered');
      await page.screenshot({path:path.join(out,`${device.name}-home.png`),fullPage:true});
      await page.locator('#student-portal-omr-home-section').getByRole('button',{name:/전체.*5개 보기/}).click();
      await page.locator('#omr-panel-all').waitFor();
      assert.equal(await page.locator('.omr-list .omr-card').count(),5,'all five issued exams in full list');
      await page.screenshot({path:path.join(out,`${device.name}-list.png`),fullPage:true});
      await page.locator('#student-assignment-ux-a1 [onclick*="renderOmrInput"]').click();
      const first=page.locator('.omr-sheet .omr-no').first();
      await first.waitFor();
      const expectedScore=page.locator('#omr-draft-summary > div').nth(1).locator('strong');
      assert.equal(await expectedScore.innerText(),'80점');
      await first.click();
      assert.equal(await expectedScore.innerText(),'60점');
      assert.equal(await first.getAttribute('aria-pressed'),'true');
      assert(await first.evaluate(el=>document.activeElement===el),'OMR toggle retains keyboard focus');
      await page.screenshot({path:path.join(out,`${device.name}-omr.png`),fullPage:true});
      const omrOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
      assert(omrOverflow<=2,`${device.name} OMR has no horizontal overflow: ${omrOverflow}`);
      if(device.name==='phone390'){
        await page.locator('#omr-submit-btn').click();
        await page.locator('.recorded-score').waitFor();
        assert.equal(sent.length,1,'exactly one OMR POST');
        assert.deepEqual(sent[0].wrong_ids,[1,2],'wrong_ids remains a number array');
        assert.match(await page.locator('.recorded-score').innerText(),/73점/,'recorded score comes from server');
        assert.equal(await page.locator('#omr-submit-btn').count(),0,'recorded result cannot be resubmitted');
        await page.locator('#student-nav [onclick="renderOmrExams()"]').click();
        await page.locator('#omr-panel-all').waitFor();
        assert(await page.locator('#student-assignment-ux-a1').innerText().then(t=>t.includes('73점')),'full list keeps the same server score');
        exams.splice(0,exams.length,...Array.from({length:150},(_,i)=>({assignment_id:'ux-volume-'+(i+1),exam_title:'합성 전체 시험 '+(i+1),exam_date:'2026-11-10',class_name:'합성 학급',question_count:5,is_submitted:i%2,score:i%2?81:null,wrong_ids:[],archive_file:'original/middle/mock.js'})));
        await page.goto(origin,{waitUntil:'domcontentloaded'});
        await page.locator('#student-portal-omr-home-section').waitFor();
        assert.equal(await page.locator('#student-portal-omr-home-section article.omr-card').count(),3,'150 assignments keep a bounded home');
        await page.locator('#student-portal-omr-home-section').getByRole('button',{name:/전체.*150개 보기/}).click();
        await page.locator('#omr-panel-all').waitFor();
        assert.equal(await page.locator('#omr-panel-all article.omr-card').count(),150,'all 150 issued assignments remain accessible');
        const last=page.locator('#student-assignment-ux-volume-150');
        await last.scrollIntoViewIfNeeded();
        assert.ok(await last.isVisible(),'the last of 150 assignments can be reached');
        await page.screenshot({path:path.join(out,'phone390-all-150-last-viewport.png'),fullPage:false});
        ui.fullListVolume=150;
      }
      assert.deepEqual(errors,[],`${device.name} has no uncaught browser errors`);
      report.push({device:device.name,...ui,omrOverflow,errors});
      await context.close();
    }
    const preview=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
    await preview.addInitScript(()=>localStorage.setItem('APMATH_SESSION',JSON.stringify({session_token:'fixture-teacher-only'})));
    await preview.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'text/css',body:''}));
    const previewWrites=[];
    await preview.route('https://ap-math-os-v2612.js-pdf.workers.dev/api/**',route=>{
      if(route.request().method()==='OPTIONS')return route.fulfill({status:204,headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'}});
      if(route.request().method()!=='GET')previewWrites.push(route.request().method());
      const u=new URL(route.request().url()),data=u.pathname.endsWith('/student-portal/home')
        ? {success:true,read_only:true,student:{id:'ux-student',name:'테스트 학생',grade:'중1'},assignments:[],class_exam_assignments:[]}
        : u.pathname.endsWith('/student-portal/exams')?{success:true,exams:[{assignment_id:'preview-exam',exam_title:'교사 미리보기 시험',is_submitted:0,question_count:5,archive_file:'original/middle/mock.js'}]}
        : {success:true,items:[],packets:[]};
      return route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(data)});
    });
    const p=await preview.newPage();
    await p.goto(origin+'?teacher_preview=1&student_id=ux-student',{waitUntil:'domcontentloaded'});
    await p.locator('#student-portal-omr-home-section').waitFor({timeout:20000});
    assert.equal(await p.locator('[onclick*="renderOmrInput"], [onclick*="openHomeOmrInput"]').count(),0,'teacher preview read-only');
    const denied=await p.evaluate(async()=>{try{await apiPost('student-portal/omr-submit',{});return '';}catch(error){return error.message;}});
    assert.match(denied,/저장할 수 없습니다/,'teacher preview also rejects direct API mutations');
    assert.deepEqual(previewWrites,[],'teacher preview sends no mutation request');
    await p.screenshot({path:path.join(out,'teacher-preview.png'),fullPage:true});
    await preview.close();
    assert.deepEqual(unexpectedApi,[],'all API requests stay inside declared synthetic contracts');
    completed=true;
    console.log('Student portal browser UX audit PASS:',JSON.stringify(report.map(x=>({device:x.device,exams:x.exams,overflow:x.horizontalOverflow,omrOverflow:x.omrOverflow}))));
  }catch(error){
    failures.push({message:error.message});
    throw error;
  }finally{
    fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({source:'fixture-only; no real student data; service workers blocked',revision:process.env.STUDENT_UX_REVISION||null,completed,report,failures,unexpectedApi},null,2));
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
