'use strict';

/*
 * Actual student HTML + isolated API responses. This is browser behavior/visual
 * evidence with synthetic data, not a production account or backend integration.
 * Run: node tests/student-portal-ux-browser.cjs --output=/absolute/path
 * Optional --source-root=/absolute/path/to/baseline-checkout
 *          --baseline=/absolute/path/to/unmodified-student-index.html
 *          --screens-only (capture current surfaces without behavior assertions)
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { createStudentPortalFixture, installStudentPortalBrowserFixture } = require('./fixtures/student-portal-ux-api.cjs');
const arg = name => process.argv.find(x => x.startsWith(`--${name}=`))?.slice(name.length + 3);
const root = path.resolve(arg('source-root') || path.join(__dirname, '..'));
let playwright;
try { playwright = require('playwright'); }
catch (_) { playwright = require(require.resolve('playwright', { paths: [process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES || ''] })); }
const output = path.resolve(arg('output') || path.join(require('node:os').tmpdir(), 'student-portal-ux-browser'));
const baseline = arg('baseline');
const screensOnly = process.argv.includes('--screens-only');
const servePort = arg('serve');
const report = { fixture: 'synthetic; all API calls intercepted; no production student writes; review destination HTML is a test target, while real output-envelope code runs; CDN fonts isolated and system CJK fallback used', revision:arg('revision') || null, startedAt:new Date().toISOString(), completed:false, screenshots: [], checks: [], failures: [], pageErrors: [], unhandledApi: [], observations:[] };
const viewports = [[360,800],[390,844],[800,1280],[1280,800],[1440,900]];
fs.mkdirSync(output, { recursive: true });

function server() {
  return http.createServer((req, res) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch (_) { res.writeHead(400); return res.end(); }
    if (servePort && pathname === '/__qa__/') {
      res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
      return res.end('<!doctype html><html lang="ko"><meta name="viewport" content="width=device-width, initial-scale=1"><title>학생포털 합성 QA</title><body style="font:16px system-ui;padding:24px;line-height:2"><h1>학생포털 합성 QA</h1><p>테스트 전용 학생·응답입니다. 실제 학생 API 호출과 저장은 없습니다.</p>' + ['normal','logged-out','empty','error','reject-submit','late','high-school','teacher'].map(s => `<p><a href="/apmath/student/?qa=${s}${s==='teacher'?'&teacher_preview=1&student_id=qa-student':''}">${s}</a></p>`).join('') + '</body></html>');
    }
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (baseline && pathname.match(/^\/apmath\/student\/(index\.html)?$/)) file = baseline;
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
    const type = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.woff2':'font/woff2' }[path.extname(file)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control':'no-store' });
    if (servePort && path.extname(file) === '.html') {
      const scenario = new URL(req.url,'http://localhost').searchParams.get('qa');
      const bootstrap = `<script>(${installStudentPortalBrowserFixture.toString()})(${createStudentPortalFixture.toString()},${JSON.stringify(scenario)});</script>`;
      return res.end(fs.readFileSync(file,'utf8').replace('<head>','<head>'+bootstrap));
    }
    fs.createReadStream(file).pipe(res);
  });
}

async function instrument(context, options = {}) {
  const data = createStudentPortalFixture();
  const state = { data, requests: [], examError: false, clinicError: false, rejectSubmit: false, submitScore:83, delaySubmit: 0, delayExams: 0, delayMaterial:0, delayedExamRequests: 0, failPlanSave:false, failUpload:false, rejectHomeworkPin:false };
  if (options.empty) { data.exams = []; data.assignments = []; data.packets = []; data.materials = []; data.learning.rows=[];data.learning.types=[];data.learning.summary={}; }
  if (options.grade) data.student.grade = data.session.grade = options.grade;
  if (options.loggedIn !== false) await context.addInitScript(({ session, preview }) => {
    if (preview) localStorage.setItem('APMATH_SESSION', JSON.stringify({ session_token:'qa-teacher-fixture-token' }));
    else localStorage.setItem('APMATH_STUDENT_PORTAL_SESSION', JSON.stringify(session));
    localStorage.setItem('APMATH_STUDENT_INSTALL_DISMISSED_AT', String(Date.now()));
  }, { session: data.session, preview: options.preview });
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') {
      if (/\/archive\/(mixed_)?engine\.html$/.test(url.pathname)) return route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html lang="ko"><title>합성 출제본 링크 검수</title><h1>합성 출제본 링크 검수</h1><p>뷰어 목적지입니다. 실제 시험지·정답·해설은 사용하지 않습니다.</p></html>'});
      if (options.newVersion && url.pathname.endsWith('/student-version.json')) return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({version:'qa-new-version',message:'합성 검수용 업데이트 안내'})});
      return route.continue();
    }
    if (url.hostname !== 'ap-math-os-v2612.js-pdf.workers.dev') return route.fulfill({ status: 200, contentType: 'text/plain', body: '' });
    const endpoint = url.pathname.replace(/^\/api\//, '');
    let body = null;
    if ((request.headers()['content-type'] || '').includes('application/json')) body = request.postDataJSON();
    state.requests.push({ endpoint, method: request.method(), body, headers: request.headers() });
    const json = (obj, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin':'*' }, body: JSON.stringify(obj) });
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'*', 'Access-Control-Allow-Methods':'GET,POST,PATCH,DELETE,OPTIONS' } });
    if (endpoint === 'student-portal/auth') return json({ success: true, student: data.student, student_token: data.session.student_token });
    if (endpoint === 'student-portal/home') return json({ success: true, student: data.student, assignments: data.assignments, class_exam_assignments: data.exams, read_only: !!options.preview });
    if (endpoint === 'student-portal/exams') {
      const rows = structuredClone(data.exams);
      if (state.delayExams) { state.delayedExamRequests++; await new Promise(resolve => setTimeout(resolve, state.delayExams)); }
      if (state.examError) return json({ success:false, message:'QA 시험지 조회 실패' }, 503);
      return json({ success: true, exams: rows });
    }
    if (endpoint === 'student-portal/wrong-clinics') return state.clinicError ? json({ success:false, message:'QA 클리닉 조회 실패' }, 503) : json({ success:true, packets: data.packets });
    if (endpoint === 'student-portal/learning-history') return json(data.learning);
    if (endpoint === 'student-portal/omr-submit') {
      if (state.delaySubmit) await new Promise(resolve => setTimeout(resolve, state.delaySubmit));
      if (state.rejectSubmit) return json({ success:false, message:'QA 제출 실패: 다시 시도하세요.' }, 503);
      const exam = data.exams.find(x => x.assignment_id === body.assignment_id);
      if (!exam || exam.is_submitted || exam.is_review_only || exam.is_cancelled) return json({ success:false, message:'이미 제출했거나 제출할 수 없는 시험지입니다.' }, 409);
      Object.assign(exam, { is_submitted:1, score:state.submitScore, wrong_ids:body.wrong_ids, session_id:'qa-new-session' });
      return json({ success:true, session: { id:'qa-new-session', score:state.submitScore, wrong_ids:body.wrong_ids } });
    }
    if (/^student-portal\/wrong-clinics\/[^/]+\/(submit|review-wrongs)$/.test(endpoint)) {
      const packet = data.packets.find(x => endpoint.includes(x.packet_key + '/'));
      if (packet) Object.assign(packet, { is_submitted: 1 }, endpoint.endsWith('review-wrongs') ? { review_wrong_ids: body.wrong_ids } : {});
      return json({ success:true, packet });
    }
    if (endpoint === 'material-omr/student-assignments') return json({ success:true, items:data.materials });
    if (endpoint === 'material-omr/assignment') {
      if (state.delayMaterial) await new Promise(resolve=>setTimeout(resolve,state.delayMaterial));
      return json({ success:true, material:{ title:'기본 개념 연습', number_start:1, number_end:120 }, assignment:{ title:'수업자료 1~120번' }, submission:null });
    }
    if (endpoint === 'material-omr/submit') return json({ success:true });
    if (endpoint === 'planner-auth') return json({ success:true, student:data.student });
    if (endpoint === 'planner' && request.method()==='GET') return json({ success:true, plans:data.plans, feedback:[] });
    if (endpoint === 'planner' && request.method()==='POST') {
      if (state.failPlanSave) return json({ success:false, error:'QA 계획 저장 지연' },503);
      const plan={ ...body, id:'qa-added-'+data.plans.length, is_done:0, updated_at:new Date().toISOString() };
      data.plans.push(plan);
      return json({success:true,plans:[plan]});
    }
    if (endpoint === 'planner/settings' && request.method()==='PATCH') return json({success:true});
    if (endpoint.startsWith('planner/') && request.method()==='PATCH') {
      const plan=data.plans.find(x=>x.id===endpoint.split('/')[1]);
      if(plan)Object.assign(plan,body);
      return json({success:true,plan});
    }
    if (endpoint === 'homework-photo/assignment') return json({ success:true, assignment:data.assignments[0], student:data.student, submission:null });
    if (endpoint === 'homework-photo/auth') return state.rejectHomeworkPin ? json({success:false,error:'PIN mismatch'},401) : json({ success:true });
    if (endpoint === 'homework-photo/upload') return state.failUpload ? json({success:false,error:'upload_failed'},503) : json({success:true,submitted_at:'합성 검수 완료 시각'});
    report.unhandledApi.push(endpoint);
    return json({ success:false, message:'Unhandled QA fixture endpoint' }, 501);
  });
  return state;
}

async function capture(page, name) {
  await page.evaluate(() => document.fonts.ready);
  // Keep the actual viewport as evidence too: full-page stitching can place
  // fixed navigation and offscreen skip links in the middle of tall captures.
  await page.screenshot({ path:path.join(output, name + '-viewport.png'), fullPage:false, animations:'disabled' });
  await page.screenshot({ path:path.join(output, name + '.png'), fullPage:true, animations:'disabled' });
  const layout = await page.evaluate(() => ({ viewport:innerWidth, viewportHeight:innerHeight, scrollY, document:document.documentElement.scrollWidth, title:document.querySelector('h1')?.textContent || '', background:getComputedStyle(document.body).backgroundColor, buttons: [...document.querySelectorAll('button,a,input,select,summary')].filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).opacity!=='0' && !el.matches('input[type="file"],.skip-link')).map(el => { const r=el.getBoundingClientRect(); return { text:(el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || '').trim().slice(0,60), width:Math.round(r.width), height:Math.round(r.height), disabled:!!el.disabled }; }) }));
  report.screenshots.push({ name, file:name + '.png', viewportFile:name + '-viewport.png', layout });
  return layout;
}

async function clickCall(page, name, options = {}) {
  await page.locator(`[onclick*="${name}("]`).first().waitFor({state:'attached'});
  for (const details of await page.locator('details').all()) {
    if (await details.locator(`[onclick*="${name}("]`).count() && (await details.getAttribute('open')) === null) {
      const summary = details.locator(':scope > summary');
      if (await summary.isVisible()) await summary.click();
    }
  }
  const locator = page.locator(`[onclick*="${name}("]`).filter({ visible:true });
  if (!await locator.count()) throw new Error('No visible action: ' + name);
  await locator.first().click(options);
}

async function behaviorSuite(browser, base, check) {
  const withStudent = async (options, fn) => {
    const context = await browser.newContext({ viewport:{width:390,height:844}, serviceWorkers:'block' });
    const state = await instrument(context, options);
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.on('pageerror', error => report.pageErrors.push({ scenario:options.name || 'behavior', message:error.message }));
    try {
      await page.goto(base + '/apmath/student/' + (options.preview ? '?teacher_preview=1&student_id=qa-student' : ''));
      await page.locator(options.loggedIn === false ? '#student-name' : '#student-portal-omr-home-section').waitFor();
      await fn(page,state,context);
    } finally { await context.close(); }
  };
  const openExams = async page => { await clickCall(page,'renderOmrExams'); await page.waitForFunction(()=>document.querySelector('.omr-browser') && !document.querySelector('.omr-browser').textContent.includes('불러오는 중')); };
  const openOmr = async page => { await openExams(page); await page.locator('[data-assignment-id="qa-pending"] [onclick*="renderOmrInput"]').click(); await page.locator('#omr-submit-btn').waitFor(); };
  const openMore = async page => { await page.locator('#student-nav [data-student-destination="more"]').click(); await page.getByRole('heading',{name:'더보기',exact:true}).waitFor(); };
  const openRetainedFeature = async (page, render) => { await openMore(page); await clickCall(page,render); };

  await check('login and logout preserve student authentication flow', () => withStudent({loggedIn:false,name:'login'}, async (page,state) => {
    await page.locator('#student-name').fill('테스트 학생');
    await page.locator('#student-pin').fill('0000');
    await page.locator('#login-btn').click();
    await page.locator('#student-portal-omr-home-section').waitFor();
    assert.equal(state.requests.filter(r=>r.endpoint==='student-portal/auth'&&r.method==='POST').length,1);
    await page.locator('#logout-btn').click();
    await page.locator('#student-name').waitFor();
    assert.equal(await page.evaluate(()=>localStorage.getItem('APMATH_STUDENT_PORTAL_SESSION')),null);
    assert.equal(await page.evaluate(()=>localStorage.getItem('PLANNER_PIN')),null);
  }));
  await check('every assigned exam remains discoverable and filters are keyboard operable', () => withStudent({name:'exam-filters'}, async (page,state) => {
    assert.equal(await page.locator('#student-portal-omr-home-section .portal-recent-item').count(),1);
    assert.equal(await page.locator('[data-portal-feature]').count(),4);
    assert.equal(await page.locator('#student-portal-omr-home-section [data-assignment-id]').count(),0,'home does not stack complete exam cards');
    await openExams(page);
    assert.equal(await page.locator('#omr-panel-all [data-assignment-id]').count(),state.data.exams.length);
    await page.locator('#omr-tab-all').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#omr-tab-pending').getAttribute('aria-selected'),'true');
    assert.equal(await page.locator('#omr-panel-pending [data-assignment-id]').count(),4);
    assert.equal(await page.locator('#omr-panel-pending [data-assignment-id="qa-readonly"]').count(),0);
    await page.keyboard.press('End');
    assert.equal(await page.locator('#omr-tab-unknown').getAttribute('aria-selected'),'true');
    assert.equal(await page.locator('#omr-panel-unknown [data-assignment-id]').count(),1);
    assert.equal(await page.locator('#omr-panel-unknown [onclick*="renderOmrInput"]').count(),0);
    await capture(page,'unknown-390');
    await page.keyboard.press('Home');
    for (const id of ['qa-cancelled','qa-replaced','qa-readonly']) {
      const card=page.locator(`[data-assignment-id="${id}"]`);
      assert.equal(await card.locator('[onclick*="renderOmrInput"],[onclick*="downloadExamPdf"]').count(),0);
      assert.equal(await card.locator('[onclick*="openOmrReview"]').count(),3);
    }
    assert.equal(await page.locator('[data-assignment-id="qa-mixed-missing"] [onclick*="openOmrReview"]').count(),0);
    assert.equal(await page.locator('[data-assignment-id="qa-missing"] [onclick*="openOmrReview"]').count(),0);
    assert.equal(await page.locator('[data-assignment-id="qa-previous"] [onclick*="renderOmrInput"]').count(),1);
    assert.equal(await page.locator('[data-assignment-id="qa-pdf"] button:disabled').innerText(),'PDF 준비 중');
    for (const id of ['qa-unknown','qa-cancelled','qa-replaced','qa-readonly']) {
      await page.evaluate(id=>renderOmrInput(id),id);
      assert.equal(await page.locator('#omr-submit-btn').count(),0);
    }
  }));
  await check('navigation and browser history retain a draft without changing its assignment', () => withStudent({name:'history'},async page=>{
    await openOmr(page);
    await page.locator('.omr-no').nth(3).click();
    assert.equal(await page.locator('#student-nav [aria-current="page"]').innerText(),'시험지');
    await page.locator('#student-nav [data-student-destination="home"]').click();
    assert.ok(await page.locator('#student-portal-omr-home-section').isVisible());
    await page.goBack();
    await page.locator('#omr-submit-btn').waitFor();
    assert.equal(await page.locator('[data-omr-no="4"]').getAttribute('aria-pressed'),'true');
    assert.match(await page.locator('h1').innerText(),/삼각형/);
    await page.goBack();
    await page.locator('#omr-tab-all').waitFor();
    await page.goForward();
    await page.locator('#omr-submit-btn').waitFor();
    assert.equal(await page.locator('[data-omr-no="4"]').getAttribute('aria-pressed'),'true');
    await openMore(page);
    assert.equal(await page.locator('#student-nav [aria-current="page"]').innerText(),'더보기');
    for(const label of ['학습 기록','오답 클리닉','수업자료 오답','과제']) assert.match(await page.locator('#app').innerText(),new RegExp(label));
  }));
  await check('wrong-number toggles preserve focus and submitted score uses server record', () => withStudent({name:'omr-success'}, async (page,state) => {
    await openOmr(page);
    const third=page.locator('.omr-no').nth(2);
    await third.focus();
    await page.keyboard.press('Space');
    assert.equal(await page.locator('.omr-no').nth(2).getAttribute('aria-pressed'),'true');
    assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('data-omr-no')),'3');
    await page.locator('.omr-no').nth(6).click();
    await page.locator('.omr-no').nth(2).click();
    assert.match(await page.locator('#app').innerText(),/95\s*점/);
    state.delaySubmit=250;
    await page.locator('#omr-submit-btn').click();
    assert.equal(await page.locator('#omr-submit-btn').isDisabled(),true);
    await page.locator('#omr-submit-btn').dispatchEvent('click');
    await page.waitForFunction(()=>document.querySelector('#app')?.textContent.includes('83점') && !document.querySelector('#omr-submit-btn'));
    const submissions=state.requests.filter(r=>r.endpoint==='student-portal/omr-submit'&&r.method==='POST');
    assert.equal(submissions.length,1);
    assert.deepEqual(submissions[0].body.wrong_ids,[7]);
    assert.equal(submissions[0].body.student_id,'qa-student');
    assert.match(await page.locator('#app').innerText(),/기록.*점수|기록된.*점수/);
    await capture(page,'submitted-result-390');
    await page.goBack();
    await page.locator('#omr-tab-all').waitFor();
    await page.goForward();
    await page.locator('.recorded-score').waitFor();
    assert.equal(await page.locator('#omr-submit-btn').count(),0);
    await openExams(page);
    const card=page.locator('[data-assignment-id="qa-pending"]');
    assert.match(await card.innerText(),/83\s*점/);
    assert.equal(await card.locator('[onclick*="renderOmrInput"]').count(),0);
  }));
  await check('failed OMR submission keeps selection and permits one retry', () => withStudent({name:'omr-error'}, async (page,state) => {
    await openOmr(page);
    await page.locator('.omr-no').nth(4).click();
    state.rejectSubmit=true;
    await page.locator('#omr-submit-btn').click();
    await page.waitForFunction(()=>document.querySelector('#omr-submit-btn')?.disabled===false);
    assert.equal(await page.locator('.omr-no').nth(4).getAttribute('aria-pressed'),'true');
    assert.match(await page.locator('#toast').innerText(),/실패/);
    await capture(page,'submit-failure-390');
    state.rejectSubmit=false;
    await page.locator('#omr-submit-btn').click();
    await page.waitForFunction(()=>!document.querySelector('#omr-submit-btn'));
    assert.equal(state.requests.filter(r=>r.endpoint==='student-portal/omr-submit'&&r.method==='POST').length,2);
  }));
  await check('missing recorded score is never replaced with the estimated score',()=>withStudent({name:'score-unknown'},async(page,state)=>{
    state.submitScore=null;
    await openOmr(page);
    assert.match(await page.locator('#omr-draft-summary').innerText(),/100\s*점/);
    await page.locator('#omr-submit-btn').click();
    await page.locator('.recorded-score').waitFor();
    assert.match(await page.locator('.recorded-score').innerText(),/확인 필요/);
    assert.doesNotMatch(await page.locator('.recorded-score').innerText(),/100/);
    await capture(page,'recorded-score-unknown-390');
  }));
  await check('late exam response cannot replace a newer home view', () => withStudent({name:'late-exams'}, async (page,state) => {
    state.delayExams=600;
    await clickCall(page,'renderOmrExams');
    await page.waitForFunction(()=>document.querySelector('.omr-browser'));
    await clickCall(page,'renderHome');
    await page.waitForTimeout(850);
    assert.ok(await page.locator('#student-portal-omr-home-section').isVisible());
    assert.equal(await page.locator('.omr-list-header').count(),0);
  }));
  await check('late successful submission after logout cannot revive student data', () => withStudent({name:'late-submit'}, async (page,state) => {
    await openOmr(page);
    state.delaySubmit=500;
    await page.locator('#omr-submit-btn').click();
    await page.locator('#logout-btn').click();
    await page.waitForTimeout(750);
    assert.ok(await page.locator('#student-name').isVisible());
    assert.equal(await page.locator('#student-portal-omr-home-section').count(),0);
  }));
  await check('late material load after logout cannot revive student data',()=>withStudent({name:'late-material'},async(page,state)=>{
    state.delayMaterial=500;
    await openRetainedFeature(page,'renderMaterialList');
    await clickCall(page,'openMaterialWrongOmr');
    await page.locator('#logout-btn').click();
    await page.waitForTimeout(750);
    assert.ok(await page.locator('#student-name').isVisible());
    assert.equal(await page.locator('#material-quick-input').count(),0);
  }));
  await check('update notice preserves an unsaved OMR when update is declined',()=>withStudent({name:'pwa-update',newVersion:true},async page=>{
    await page.locator('#student-update-notice.show').waitFor();
    await openOmr(page);
    await page.locator('[data-omr-no="2"]').click();
    page.once('dialog',dialog=>dialog.dismiss());
    await page.locator('.student-update-btn').click();
    assert.equal(await page.locator('[data-omr-no="2"]').getAttribute('aria-pressed'),'true');
    await capture(page,'update-unsaved-390');
  }));
  await check('teacher preview displays data and rejects every mutation', () => withStudent({preview:true,name:'teacher-preview'}, async (page,state) => {
    assert.equal(await page.locator('#logout-btn').isVisible(),false);
    assert.equal(await page.locator('[onclick*="openHomeOmrInput"],[onclick*="renderOmrInput"]').count(),0);
    assert.equal(await page.locator('[data-portal-feature]').count(),4,'preview keeps all core learning destinations visible');
    assert.equal(await page.locator('[data-portal-feature="planner"]').count(),1);
    await openExams(page);
    assert.equal(await page.locator('[onclick*="renderOmrInput"]').count(),0);
    const denial=await page.evaluate(async()=>{try { await apiPost('student-portal/omr-submit',{});return ''; } catch(error) { return error.message; }});
    assert.match(denial,/저장할 수 없습니다/);
    assert.equal(state.requests.filter(r=>r.method==='POST').length,0);
    assert.ok(state.requests.filter(r=>r.endpoint==='student-portal/exams'&&r.method==='GET').every(r=>r.headers.authorization==='Bearer qa-teacher-fixture-token'));
    await capture(page,'teacher-preview-390');
  }));
  await check('empty and error states keep a useful exit or retry', () => withStudent({empty:true,name:'empty'}, async page => {
    await capture(page,'empty-home-390');
    await openExams(page);
    assert.match(await page.locator('#app').innerText(),/없습니다/);
    assert.ok(await page.locator('[onclick*="renderHome"]').count());
    await capture(page,'empty-exams-390');
  }));
  await check('exam load failure offers retry and recovers', () => withStudent({name:'exam-error'}, async (page,state) => {
    state.examError=true;
    await clickCall(page,'renderOmrExams');
    await page.getByText(/시험지를 불러오지 못했어요/).first().waitFor();
    await capture(page,'exam-error-390');
    state.examError=false;
    await clickCall(page,'renderOmrExams');
    await page.locator('#omr-tab-all').waitFor();
    assert.equal(await page.locator('#omr-panel-all [data-assignment-id]').count(),state.data.exams.length);
  }));
  await check('clinic wrong check is separate from immutable exam submission', () => withStudent({name:'clinic'}, async (page,state) => {
    await openRetainedFeature(page,'renderClinicList');
    await clickCall(page,'renderWrongClinicReview');
    await page.locator('#wrong-clinic-review-save-btn').waitFor();
    await page.locator('.omr-no').nth(4).click();
    await capture(page,'clinic-wrongs-390');
    await page.locator('#wrong-clinic-review-save-btn').click();
    await page.locator('#student-portal-omr-home-section').waitFor();
    const writes=state.requests.filter(r=>r.method==='POST');
    assert.equal(writes.filter(r=>r.endpoint==='student-portal/omr-submit').length,0);
    const review=writes.find(r=>r.endpoint.endsWith('/review-wrongs'));
    assert.ok(review);
    assert.deepEqual(review.body.wrong_ids,[3,5]);
  }));
  await check('unknown clinic status remains blocked from saving',()=>withStudent({name:'clinic-unknown'},async(page,state)=>{
    await openRetainedFeature(page,'renderClinicList');
    await page.locator('[onclick="renderWrongClinicReview(\'qa-clinic-unknown\')"]').waitFor();
    await page.locator('[onclick="renderWrongClinicReview(\'qa-clinic-unknown\')"]').click();
    await page.locator('#wrong-clinic-review-save-btn').click();
    assert.match(await page.locator('#toast').innerText(),/제출 상태를 확인할 수 없습니다/);
    assert.equal(state.requests.filter(r=>r.method==='POST').length,0);
  }));
  await check('learning records preserve partial, unknown and legacy meaning and source links',()=>withStudent({name:'learning'},async page=>{
    await openRetainedFeature(page,'renderLearningHistory');
    await page.locator('.clv-row').first().waitFor();
    assert.equal(await page.locator('.clv-row').count(),3);
    assert.match(await page.locator('.clv-row.is-partial,.clv-row').nth(1).innerText(),/일부|미확인/);
    const legacy=page.locator('.clv-row').last();
    assert.match(await legacy.innerText(),/오답 수만|문항 정보 없이/);
    assert.doesNotMatch(await legacy.innerText(),/집계 0/);
    assert.equal(await legacy.locator('button').count(),0);
    const periods=page.locator('.clv-tab');
    assert.ok(await periods.count()>=5);
    await periods.nth(1).click();
    await page.locator('.clv-row').first().waitFor();
    assert.equal(await periods.nth(1).getAttribute('aria-pressed'),'true');
    for(const [width,height] of viewports){ await page.setViewportSize({width,height});await capture(page,'review-records-'+width); }
    const sourceCard=page.locator('[data-assignment-id="qa-complete"]');
    await page.getByRole('button',{name:'해당 시험 보기',exact:true}).first().click();
    await sourceCard.waitFor();
    assert.ok(await sourceCard.evaluate(el=>el.style.boxShadow),'the exact source assignment is highlighted in the full exam list');
    assert.equal(await page.locator('#student-nav [aria-current="page"]').getAttribute('data-student-destination'),'exams');
  }));
  await check('material wrong entry validates ranges and remains a separate submission', () => withStudent({name:'material'}, async (page,state) => {
    await openRetainedFeature(page,'renderMaterialList');
    await page.locator('[onclick*="openMaterialWrongOmr"]').first().waitFor();
    assert.equal(await page.locator('[onclick*="openMaterialWrongOmr"]').count(),2);
    await clickCall(page,'toggleMaterialAssignmentList');
    assert.equal(await page.locator('[onclick*="openMaterialWrongOmr"]').count(),3);
    await clickCall(page,'openMaterialWrongOmr');
    await page.locator('#material-quick-input').waitFor();
    await page.locator('#material-quick-input').fill('3,7-9');
    await clickCall(page,'applyMaterialQuickInput');
    await capture(page,'material-wrongs-390');
    await page.locator('#material-submit-btn').click();
    await page.locator('#student-portal-omr-home-section').waitFor();
    const write=state.requests.find(r=>r.endpoint==='material-omr/submit'&&r.method==='POST');
    assert.deepEqual(write.body.wrong_numbers,[3,7,8,9]);
    assert.equal(state.requests.filter(r=>r.endpoint==='student-portal/omr-submit').length,0);
  }));
  await check('middle and high school lab entry preserves existing grade routing', async () => {
    for(const grade of ['중2','고2']) await withStudent({grade,name:'lab-'+grade}, async page => {
      const href=await page.locator('#portal-geometry-lab-entry').getAttribute('href');
      assert.equal(href,'../playground/next/?portal=1'+(grade==='중2'?'#g8':''));
    });
  });
  await check('legacy, original and mixed review links retain their authorized source and viewing mode',()=>withStudent({name:'review-links'},async(page,state,context)=>{
    await openExams(page);
    for(const [id,mode,pathName] of [['qa-complete','ans','engine.html'],['qa-original','sol','engine.html'],['qa-mixed','exam','mixed_engine.html']]){
      const popupPromise=page.waitForEvent('popup');
      await page.locator(`[data-assignment-id="${id}"] [onclick="openOmrReview('${id}', '${mode}')"]`).click();
      const popup=await popupPromise;
      await popup.waitForURL(url=>url.pathname.endsWith('/'+pathName));
      const url=new URL(popup.url());
      assert.equal(url.searchParams.get('mode'),mode);
      assert.equal(url.searchParams.get('fit'),'screen');
      if(id==='qa-complete') assert.equal(url.searchParams.get('data'),'qa-only.js');
      else {
        assert.ok(url.searchParams.get('outputRequestId'));
        assert.ok(url.searchParams.get('outputOwnerId'));
        assert.equal(url.searchParams.get('studentReview'),'1');
        assert.equal(url.searchParams.get('submitQr'),'0');
        assert.equal(url.searchParams.get('solQr'),'0');
        assert.equal(url.searchParams.get('assignmentId'),id);
        const payload=await page.evaluate(async input=>Archive2Output.createOutputStore().read(input.request,input.owner,input.mode),{
          request:url.searchParams.get('outputRequestId'),owner:url.searchParams.get('outputOwnerId'),mode
        });
        assert.equal(payload.assignmentId,id);
        assert.equal(payload.mode,mode);
        assert.deepEqual(payload.questions,JSON.parse(state.data.exams.find(exam=>exam.assignment_id===id).mixed_payload_json).questions);
        report.observations.push({review:id,mode,outputEnvelope:true,questionCount:payload.questions.length});
      }
      await popup.close();
    }
    assert.equal(state.requests.filter(r=>r.method==='POST').length,0);
  }));
  await check('student lab opens the actual grade hub in one tap and keeps experiment and legacy Universe routes',()=>withStudent({name:'lab-journey'},async page=>{
    await page.locator('#student-nav [data-student-destination="labs"]').click();
    await page.waitForURL(url=>/\/playground\/next\/(?:index\.html)?$/.test(url.pathname)&&url.hash==='#g8');
    assert.equal(new URL(page.url()).searchParams.get('portal'),'1');
    await page.locator('.hub-course[aria-pressed="true"]').waitFor();
    assert.match(await page.locator('.hub-course[aria-pressed="true"]').innerText(),/중2/);
    await page.getByRole('button',{name:'목록으로 보기',exact:true}).click();
    assert.equal(await page.locator('.hub-trail a').count(),2);
    assert.equal(new URL(await page.locator('.hub-portal-link').getAttribute('href'),page.url()).pathname,'/apmath/student/');
    assert.equal(await page.locator('.student-global-nav [aria-current="page"]').getAttribute('data-student-destination'),'labs');
    await capture(page,'lab-hub-g8-390');
    await page.getByRole('button',{name:'테마 바꾸기',exact:true}).click();
    await page.waitForFunction(()=>document.documentElement.dataset.theme==='board');
    await capture(page,'lab-hub-board-390');
    await page.getByRole('button',{name:'테마 바꾸기',exact:true}).click();
    await page.locator('.hub-card a[href*="g8-triangles.html"]').first().click();
    await page.waitForURL(/g8-triangles\.html/);
    await page.waitForFunction(()=>document.querySelectorAll('svg').length>0 && document.querySelector('button'));
    assert.match(await page.locator('body').innerText(),/삼각형/);
    assert.equal(await page.locator('.student-global-nav [aria-current="page"]').getAttribute('data-student-destination'),'labs');
    await capture(page,'lab-triangles-390');
    await page.goBack();
    await page.waitForURL(url=>/\/playground\/next\/(?:index\.html)?$/.test(url.pathname)&&url.hash==='#g8');
    await page.locator('.hub-portal-link').click();
    await page.locator('#student-portal-omr-home-section').waitFor();
    await page.locator('#student-nav [data-student-destination="labs"]').click();
    await page.waitForURL(url=>/\/playground\/next\/(?:index\.html)?$/.test(url.pathname));
    await page.locator('.hub-trail a').filter({hasText:'AP Math Universe'}).click();
    await page.waitForURL(url=>url.pathname.endsWith('/playground/index.html'));
    await page.locator('#btnEnterLab').waitFor();
    await page.waitForFunction(()=>sessionStorage.getItem('apl:viaUniverse')==='1');
    const fallback=page.locator('.webgl-fallback .cta-entrance');
    const fallbackVisible=await fallback.isVisible();
    report.observations.push({labUniverse:fallbackVisible?'real WebGL fallback route':'3D entry route'});
    for(const [width,height]of [[320,800],...viewports]){
      await page.setViewportSize({width,height});
      const boxes=await page.locator('.top-nav .universe-portal-link,.top-controls button').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {name:node.getAttribute('aria-label'),x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height,visible:!!node.getClientRects().length};}));
      assert.equal(boxes.length,4);
      for(const box of boxes){assert.ok(box.visible);assert.ok(box.x>=0&&box.right<=width+1,`${box.name} outside viewport`);}
      for(let a=0;a<boxes.length;a++)for(let b=a+1;b<boxes.length;b++){
        const A=boxes[a],B=boxes[b];
        assert.ok(!(Math.min(A.right,B.right)-Math.max(A.x,B.x)>1&&Math.min(A.bottom,B.bottom)-Math.max(A.y,B.y)>1),`${A.name} overlaps ${B.name}`);
      }
      await capture(page,'lab-universe-'+width);
    }
    await page.setViewportSize({width:390,height:844});
    await page.locator('.top-nav .universe-portal-link').click();
    await page.locator('#student-portal-omr-home-section').waitFor();
  }));
  await check('homework PIN, photo selection, failure recovery and completion use the real UI', () => withStudent({name:'homework'}, async (page,state) => {
    await clickCall(page,'renderAssignments');
    await capture(page,'assignments-390');
    await page.goto(base+'/apmath/homework/?assignment_id=qa-homework&student_id=qa-student');
    await page.locator('#pin-input').waitFor();
    await capture(page,'homework-pin-390');
    await page.locator('#pin-input').fill('0000');
    state.rejectHomeworkPin=true;
    await clickCall(page,'verifyPin');
    await page.getByText('PIN이 일치하지 않습니다.',{exact:true}).waitFor();
    assert.ok(await page.locator('#pin-input').isVisible());
    state.rejectHomeworkPin=false;
    await clickCall(page,'verifyPin');
    await page.waitForFunction(()=>!document.querySelector('#pin-input'));
    const image=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jQ1sAAAAASUVORK5CYII=','base64');
    const photo=number=>({name:`합성검수-${number}.png`,mimeType:'image/png',buffer:image});
    await page.getByLabel('사진 선택',{exact:true}).setInputFiles([photo(1),photo(2)]);
    await page.waitForFunction(()=>document.querySelectorAll('.selected-file').length===2);
    await page.getByRole('button',{name:'사진 2 선택 취소',exact:true}).click();
    assert.equal(await page.locator('.selected-file').count(),1);
    await page.getByRole('button',{name:'사진 1 선택 취소',exact:true}).click();
    assert.equal(await page.locator('.selected-file').count(),0);
    await page.getByLabel('사진 선택',{exact:true}).setInputFiles([photo(1)]);
    await page.waitForFunction(()=>document.querySelectorAll('.selected-file').length===1);
    for(const [width,height]of viewports){await page.setViewportSize({width,height});await capture(page,'homework-submit-'+width);}
    await page.setViewportSize({width:390,height:844});
    state.failUpload=true;
    await page.getByRole('button',{name:'제출하기',exact:true}).click();
    await page.getByText('사진 업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',{exact:true}).waitFor();
    assert.ok(await page.getByRole('button',{name:'제출하기',exact:true}).isEnabled());
    assert.equal(await page.locator('.selected-file').count(),1);
    await capture(page,'homework-upload-error-390');
    state.failUpload=false;
    await page.getByRole('button',{name:'제출하기',exact:true}).click();
    await page.getByRole('heading',{name:'제출했어요',exact:true}).waitFor();
    await capture(page,'homework-complete-390');
    assert.equal(state.requests.filter(r=>r.endpoint==='homework-photo/upload'&&r.method==='POST').length,2);
    await page.goto(base+'/apmath/homework/');
    await page.getByRole('heading',{name:'과제를 열 수 없어요',exact:true}).waitFor();
    await capture(page,'homework-invalid-link-390');
  }));
  await check('planner calendar, draft recovery, settings and timer preserve accessible controls',()=>withStudent({name:'planner'},async(page,state)=>{
    await page.goto(base+'/apmath/planner/?student_id=qa-student&pin=0000');
    await page.locator('.plan-item-title').filter({hasText:'삼각형 오답 다시 풀기'}).waitFor();
    await page.getByRole('button',{name:'다음 날짜',exact:true}).click();
    await page.getByText('아직 할 일이 없어요.',{exact:true}).waitFor();
    await page.getByRole('button',{name:'오늘',exact:true}).click();
    await page.locator('.plan-item-title').filter({hasText:'삼각형 오답 다시 풀기'}).waitFor();
    await page.locator('.mobile-calendar > summary').click();
    await capture(page,'planner-calendar-390');
    await page.locator('.mobile-calendar > summary').click();
    await page.getByRole('button',{name:'+ 할 일 추가',exact:true}).click();
    await page.getByRole('dialog').getByLabel('할 일',{exact:true}).fill('합성 검수 계획');
    state.failPlanSave=true;
    await page.getByRole('button',{name:'계획 저장',exact:true}).click();
    await page.getByText('QA 계획 저장 지연',{exact:true}).waitFor();
    assert.ok(await page.getByRole('dialog').isVisible());
    assert.equal(await page.getByRole('dialog').getByLabel('할 일',{exact:true}).inputValue(),'합성 검수 계획');
    await capture(page,'planner-save-error-390');
    state.failPlanSave=false;
    await page.getByRole('button',{name:'계획 저장',exact:true}).click();
    await page.getByText('합성 검수 계획',{exact:true}).waitFor();
    assert.equal(await page.getByRole('dialog').isVisible(),false);
    assert.equal(await page.evaluate(()=>document.activeElement?.id),'mobile-add-btn');
    await clickCall(page,'openExamDateEditor');
    await page.locator('#exam-date-input').fill('2030-12-20');
    await page.locator('#exam-date-save').click();
    await page.locator('#exam-date-input').waitFor({state:'detached'});
    const settings=state.requests.find(r=>r.endpoint==='planner/settings'&&r.method==='PATCH');
    assert.equal(settings.body.planner_exam_date,'2030-12-20');
    assert.equal(settings.body.student_id,'qa-student');
    assert.equal(settings.body.pin,'0000');
    await clickCall(page,'openExamDateEditor');
    await page.keyboard.press('Escape');
    await page.locator('#exam-date-input').waitFor({state:'detached'});
    const resizePlanner=async(width,height)=>{
      await page.setViewportSize({width,height});
      // The real planner switches its DOM after a debounced resize. Wait for
      // the requested layout, not just the viewport CSS, before judging it.
      await page.waitForFunction(()=>{
        const mobile=innerWidth<768;
        const add=document.querySelector('#mobile-add-btn');
        return !!document.querySelector(mobile?'.mobile-calendar':'.dashboard') &&
          !!add && (getComputedStyle(add).display!=='none')===mobile;
      });
    };
    for(const [width,height]of viewports){await resizePlanner(width,height);await capture(page,'planner-'+width);}
    await resizePlanner(390,844);
    await page.getByRole('button',{name:'집중 시작',exact:true}).first().click();
    await page.locator('#timer-reset').focus();
    await page.waitForTimeout(1300);
    assert.equal(await page.evaluate(()=>document.activeElement?.id),'timer-reset');
    await capture(page,'planner-timer-390');
    await page.getByRole('button',{name:'집중 타이머 닫기',exact:true}).click();
    await page.evaluate(()=>localStorage.setItem('APMATH_THEME','dark'));
    await page.reload();
    await page.locator('.plan-item-title').filter({hasText:'삼각형 오답 다시 풀기'}).waitFor();
    await capture(page,'planner-dark-390');
    assert.ok(state.requests.some(r=>r.endpoint==='planner-auth'));
  }));
}

async function run() {
  const app = server();
  await new Promise(resolve => app.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${app.address().port}`;
  let browser;
  const check = async (name, callback) => { try { await callback(); report.checks.push({ name, passed:true }); } catch (error) { report.failures.push({ name, message:error.message }); report.checks.push({ name, passed:false }); } };
  try {
    const bundledChromium=playwright.chromium.executablePath();
    browser = await playwright.chromium.launch({ executablePath:process.env.CHROMIUM_PATH || (fs.existsSync(bundledChromium) ? bundledChromium : '/usr/bin/chromium'), headless:true, args:['--no-sandbox'] });
    for (const [width,height] of viewports) {
      const context = await browser.newContext({ viewport:{width,height}, serviceWorkers:'block',locale:'ko-KR' });
      await instrument(context);
      const page = await context.newPage();
      page.on('pageerror', error => report.pageErrors.push({ viewport:width, message:error.message }));
      await page.goto(base + '/apmath/student/');
      await page.locator('#student-portal-omr-home-section').waitFor();
      await capture(page, `home-${width}`);
      await clickCall(page, 'renderOmrExams');
      await page.locator('#omr-tab-all').waitFor();
      await capture(page, `exams-${width}`);
      await page.locator('[data-assignment-id="qa-pending"] [onclick*="renderOmrInput"]').click();
      await page.locator('#omr-submit-btn').waitFor();
      await capture(page, `omr-${width}`);
      if(!screensOnly)await check(`primary controls are at least 44px at ${width}`,async()=>{
        const small=await page.locator('.omr-no,#omr-submit-btn,#student-nav .student-global-link').evaluateAll(nodes=>nodes.filter(node=>node.getClientRects().length).map(node=>{const rect=node.getBoundingClientRect();return {label:node.getAttribute('aria-label')||node.textContent,width:rect.width,height:rect.height};}).filter(rect=>rect.width<43.9||rect.height<43.9));
        assert.deepEqual(small,[]);
      });
      await context.close();
    }
    const loginContext = await browser.newContext({ viewport:{width:390,height:844}, serviceWorkers:'block' });
    await instrument(loginContext, { loggedIn:false });
    const loginPage = await loginContext.newPage();
    await loginPage.goto(base + '/apmath/student/');
    await loginPage.locator('#student-name').waitFor();
    await capture(loginPage, 'login-390');
    await loginContext.close();
    if (!screensOnly) {
      await behaviorSuite(browser,base,check);
      await check('all captured primary layouts fit viewport', () => { for (const shot of report.screenshots) assert.ok(shot.layout.document <= shot.layout.viewport + 1, `${shot.name}: ${shot.layout.document}px > ${shot.layout.viewport}px`); });
    }
    report.completed=true;
    report.finishedAt=new Date().toISOString();
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => app.close(resolve));
    fs.writeFileSync(path.join(output,'report.json'), JSON.stringify(report,null,2) + '\n');
  }
  console.log(JSON.stringify({ output, screenshots:report.screenshots.length, checks:report.checks.length, failures:report.failures, pageErrors:report.pageErrors, unhandledApi:report.unhandledApi }));
  if (report.failures.length || report.pageErrors.length || report.unhandledApi.length) process.exitCode = 1;
}

if (require.main === module) {
  if (servePort) server().listen(Number(servePort),'0.0.0.0',()=>console.log(`Synthetic student QA server on port ${servePort}; start at /__qa__/`));
  else run().catch(error => { console.error(error); report.fatal=error.message; fs.writeFileSync(path.join(output,'report.json'), JSON.stringify(report,null,2) + '\n'); process.exitCode=1; });
}
module.exports = { createStudentPortalFixture };
