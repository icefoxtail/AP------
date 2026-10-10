'use strict';

// Focused, real-Chrome QA for the Palma generated mock-exam workflow.
// Run against the worktree, or pass --base-url with the deployed page URL.
// Screenshots and a JSON evidence record go to archive/analysis/.../QA by default.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_OUT = path.join(ROOT, 'archive/analysis/palma-mock-builder-20261010/QA');
const SOURCE_SHA = '4cfce909c023e5c4df4a759945c8cc3e0a63ec76';
const SOURCE_COUNT = 23;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const normalize = value => String(value ?? '').replace(/\s+/g, ' ').trim();
function mathAudit(items) {
  const perQuestion = items.map(({ qid, uid, mathSources, renderedMathSources }) => ({
    qid, uid, sourceMathCount: mathSources, renderedMathCount: renderedMathSources,
    allRendered: mathSources === renderedMathSources
  }));
  return {
    questionCount: perQuestion.length,
    sourceMathCount: perQuestion.reduce((sum, question) => sum + question.sourceMathCount, 0),
    renderedMathCount: perQuestion.reduce((sum, question) => sum + question.renderedMathCount, 0),
    allRendered: perQuestion.every(question => question.allRendered),
    perQuestion
  };
}

function options(argv) {
  const result = { baseUrl: null, outDir: DEFAULT_OUT };
  for (let index = 2; index < argv.length; index += 1) {
    if (argv[index] === '--base-url') result.baseUrl = argv[++index];
    else if (argv[index] === '--out-dir') result.outDir = path.resolve(argv[++index]);
    else if (argv[index] === '--help') {
      console.log('Usage: node tools/check-generated-mock-qa.cjs [--base-url URL] [--out-dir PATH]');
      process.exit(0);
    } else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  return result;
}

function localServer() {
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const prefix = pathname.startsWith('/qa-slow/') ? '/qa-slow' : pathname.startsWith('/qa-error/') ? '/qa-error' : '';
      const resourcePath = prefix ? pathname.slice(prefix.length) : pathname;
      const indexRequest = resourcePath === '/archive/data/generated-lite-consumer/v1/index.json';
      if (prefix === '/qa-error' && indexRequest) {
        response.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' }); response.end('QA index failure fixture'); return;
      }
      const absolute = path.resolve(ROOT, `.${resourcePath}`);
      if (!absolute.startsWith(ROOT + path.sep) || !fs.existsSync(absolute) || fs.statSync(absolute).isDirectory()) {
        response.writeHead(404); response.end('Not found'); return;
      }
      const contentType = pathname.endsWith('.json') ? 'application/json'
        : pathname.endsWith('.svg') ? 'image/svg+xml'
          : pathname.endsWith('.png') ? 'image/png'
            : pathname.endsWith('.js') ? 'text/javascript' : 'text/html';
      const serve = () => {
        response.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8`, 'Cache-Control': 'no-store' });
        fs.createReadStream(absolute).pipe(response);
      };
      if (prefix === '/qa-slow' && indexRequest) setTimeout(serve, 2000);
      else serve();
    } catch (error) {
      response.writeHead(500); response.end(String(error));
    }
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => {
    const baseUrl = `http://127.0.0.1:${server.address().port}/archive/generated-bank.html`;
    const origin = new URL(baseUrl).origin;
    resolve({ server, baseUrl, slowUrl: `${origin}/qa-slow/archive/generated-bank.html`, errorUrl: `${origin}/qa-error/archive/generated-bank.html` });
  }));
}

function approvalEligible(row) {
  if (!row || row.sourceKind !== 'generated' || row.consumerSelectable !== true) return false;
  if (row.approval === 'REVIEW_APPROVED' && row.reviewStatus === 'REVIEW_PASS') return true;
  if (row.approval === 'USER_DIRECTED_OPERATING_APPROVED') {
    return String(row.reviewApprovalBasis || '').startsWith('USER_DIRECTED_OPERATING_APPROVAL_') ||
      row.reviewApprovalBasis === 'USER_EXPLICIT_FIX_AND_MAIN_MERGE_20261008';
  }
  return row.approval === 'USER_DIRECTED_QUALITY_APPROVED' &&
    String(row.reviewApprovalBasis || '').startsWith('USER_DIRECTED_QUALITY_APPROVED');
}

function purposeOf(row) {
  const explicit = String(row.sourcePurposeGroup || row.variantPurpose || row.learningPurpose || '').toUpperCase();
  if (['A', 'B', 'C'].includes(explicit)) return explicit;
  return String(row.uid || '').match(/(?:^|-)Q\d+-([ABC])[1-3]$/)?.[1] || null;
}

function bucketOf(row) {
  const raw = row.metaProjection?.difficultyBucket ?? row.meta?.difficultyBucket ?? row.difficultyBucket;
  const value = Number(raw);
  return Number.isInteger(value) && value >= 1 && value <= 5 ? value : null;
}

function palmaPool(index) {
  const excluded = new Set(Array.isArray(index.excludedHoldUids) ? index.excludedHoldUids : []);
  return index.records.filter(row => row.school === '팔마고' && row.year === 2025 && row.grade === '고1' &&
    row.subject === '공통수학2' && row.sourceExamBlobSha === SOURCE_SHA &&
    /^ALITE-PALMA25-2MID-Q\d{2}-[ABC][1-3]$/.test(row.uid) && approvalEligible(row) && !excluded.has(row.uid));
}

function validatePool(index) {
  if (index.schemaVersion !== 'ALIVE_GENERATED_CONSUMER_INDEX_V1' || !Array.isArray(index.records)) {
    throw new Error('Generated consumer index schema is unavailable.');
  }
  const pool = palmaPool(index);
  const ids = pool.map(row => row.uid);
  if (pool.length !== 207 || new Set(ids).size !== 207) {
    throw new Error(`Expected 207 approved Palma QID9 rows after registration; found ${pool.length} (unique ${new Set(ids).size}).`);
  }
  for (let qid = 1; qid <= SOURCE_COUNT; qid += 1) {
    const group = pool.filter(row => Number(row.sourceQid) === qid);
    if (group.length !== 9 || new Set(group.map(purposeOf)).size !== 3 || group.some(row => !bucketOf(row))) {
      throw new Error(`Index coverage or purpose/difficulty metadata invalid for source q${qid}.`);
    }
  }
  if (pool.some(row => /HOLD/i.test(`${row.approval} ${row.reviewStatus}`))) {
    throw new Error('A HOLD row entered the selectable Palma pool.');
  }
  return pool;
}

async function loadApprovedQuestions(pool, pageUrl) {
  const docs = new Map();
  for (const row of pool) {
    if (!docs.has(row.shard)) {
      const url = new URL(row.shard, pageUrl).href;
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Consumer shard read failed (${response.status}): ${row.shard}`);
      const document = await response.json();
      if (document.schemaVersion !== 'ALIVE_GENERATED_CONSUMER_SHARD_V1' || !Array.isArray(document.records)) {
        throw new Error(`Consumer shard schema invalid: ${row.shard}`);
      }
      docs.set(row.shard, document);
    }
  }
  const questions = pool.map(row => {
    const shard = docs.get(row.shard);
    const matches = shard.records.filter(record => record.generatedUid === row.uid && record.localOrdinal === row.localOrdinal);
    if (matches.length !== 1 || !matches[0].question) throw new Error(`UID/ordinal does not resolve uniquely: ${row.uid}`);
    const question = matches[0].question;
    const choices = Array.isArray(question.choices) ? question.choices : null;
    const answer = String(question.answer ?? '').trim();
    const solution = String(question.solution ?? question.explanation ?? '').trim();
    const objective = question.questionType === '객관식' && choices?.length === 5 &&
      new Set(choices).size === 5 && ['①', '②', '③', '④', '⑤'].includes(answer);
    const descriptive = ['서술형', '단답형', '주관식'].includes(question.questionType) && choices?.length === 0 && answer.length > 0;
    if (!String(question.content || '').trim() || !solution || (!objective && !descriptive)) {
      throw new Error(`Unsupported or incomplete approved question shape: ${row.uid} (${question.questionType}, choices=${choices?.length})`);
    }
    return { row, question, form: objective ? 'objective-5' : 'descriptive-0' };
  });
  return {
    questions,
    formCounts: {
      objectiveFiveChoice: questions.filter(item => item.form === 'objective-5').length,
      descriptiveZeroChoice: questions.filter(item => item.form === 'descriptive-0').length
    },
    problemImages: [...new Set(questions.map(item => item.question.image).filter(Boolean))],
    solutionImages: [...new Set(questions.map(item => item.question.solutionImage).filter(Boolean))]
  };
}

function chromePath() {
  const candidates = [
    process.env.CHROME_BIN,
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium'
  ].filter(Boolean);
  const found = candidates.find(candidate => fs.existsSync(candidate));
  if (!found) throw new Error('Real Chrome unavailable; mock-exam browser QA cannot pass.');
  return found;
}

async function connectChrome(chrome, url, profile) {
  const browser = spawn(chrome, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    '--no-first-run', '--disable-background-networking', '--remote-allow-origins=*',
    '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'
  ], { stdio: 'ignore' });
  let port = 0;
  for (let attempt = 0; attempt < 150; attempt += 1) {
    if (browser.exitCode !== null) throw new Error(`Chrome exited with ${browser.exitCode}.`);
    const activePort = path.join(profile, 'DevToolsActivePort');
    if (fs.existsSync(activePort)) { port = Number(fs.readFileSync(activePort, 'utf8').split('\n')[0]); break; }
    await sleep(100);
  }
  if (!port) throw new Error('Chrome DevTools port did not start.');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target = targets.find(item => item.type === 'page');
  if (!target) throw new Error('Chrome page target is missing.');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (!pending.has(message.id)) return;
    const handlers = pending.get(message.id); pending.delete(message.id);
    if (message.error) handlers.reject(new Error(JSON.stringify(message.error)));
    else handlers.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId; pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const response = await send('Runtime.evaluate', {
      expression, returnByValue: true, awaitPromise: true, userGesture: true
    });
    if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
    return response.result?.value;
  };
  await send('Runtime.enable'); await send('Page.enable');
  await send('Page.navigate', { url });
  return { browser, port, targetId: target.id, socket, send, evaluate };
}

async function attachTarget(port, targetId) {
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target = targets.find(item => item.type === 'page' && item.id === targetId);
  if (!target) throw new Error(`Chrome target ${targetId} is unavailable.`);
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (!pending.has(message.id)) return;
    const handlers = pending.get(message.id); pending.delete(message.id);
    if (message.error) handlers.reject(new Error(JSON.stringify(message.error)));
    else handlers.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId; pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true });
    if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
    return response.result?.value;
  };
  await send('Runtime.enable'); await send('Page.enable');
  return { target, socket, send, evaluate };
}

async function waitForPopup(port, parentId, pathname, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const target = targets.find(item => item.type === 'page' && item.id !== parentId && item.url.includes(pathname));
    if (target) return target;
    await sleep(100);
  }
  throw new Error(`Timed out waiting for the ${pathname} output tab.`);
}

async function waitFor(evaluate, expression, label, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try { if (await evaluate(expression)) return; } catch (_) { /* wait for document scripts */ }
    await sleep(100);
  }
  throw new Error(`Timed out waiting for ${label}.`);
}

function cardSnapshotExpression() {
  return `(()=>[...document.querySelectorAll('.mock-question')].map(node=>({
    qid:Number(node.dataset.sourceQid),uid:node.dataset.uid,purpose:node.dataset.purpose,
    difficulty:Number(node.dataset.difficulty),loaded:node.querySelector('.mock-question-body')?.dataset.loaded==='true',
    stem:(node.querySelector('.mock-question-body .stem')?.innerText||'').replace(/\\s+/g,' ').trim(),
    stemSource:node.querySelector('.mock-question-body .stem')?.dataset.sourceText,
    choices:[...node.querySelectorAll('.mock-question-body .choice')].map(x=>x.innerText.replace(/\\s+/g,' ').trim()),
    choiceSources:[...node.querySelectorAll('.mock-question-body .choice')].map(x=>x.dataset.sourceText),
    mathSources:[...node.querySelectorAll('.mock-question-body .stem,.mock-question-body .choice')].filter(x=>(x.dataset.sourceText||'').includes('$')).length,
    renderedMathSources:[...node.querySelectorAll('.mock-question-body .stem,.mock-question-body .choice')].filter(x=>(x.dataset.sourceText||'').includes('$')&&x.querySelector('mjx-container')).length,
    images:[...node.querySelectorAll('.mock-question-body img')].map(x=>x.getAttribute('src')),
    lockPressed:node.querySelector('.mock-lock')?.getAttribute('aria-pressed')==='true',
    lockDisabled:node.querySelector('.mock-lock')?.disabled===true,
    replaceDisabled:node.querySelector('.mock-replace')?.disabled===true
  })))()`;
}

async function saveScreenshot(send, output, filename) {
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(output, filename), Buffer.from(shot.data, 'base64'));
}

async function main() {
  const opts = options(process.argv);
  const local = opts.baseUrl ? null : await localServer();
  const baseUrl = opts.baseUrl || local.baseUrl;
  const indexUrl = new URL('data/generated-lite-consumer/v1/index.json', baseUrl).href;
  const indexResponse = await fetch(indexUrl, { cache: 'no-store' });
  if (!indexResponse.ok) throw new Error(`Index read failed with HTTP ${indexResponse.status}: ${indexUrl}`);
  const index = await indexResponse.json();
  const pool = validatePool(index);
  const questionInventory = await loadApprovedQuestions(pool, baseUrl);
  const output = opts.outDir;
  fs.mkdirSync(output, { recursive: true });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'palma-mock-chrome-'));
  const chrome = chromePath();
  let session = null;
  const evidence = {
    schemaVersion: 'PALMA_GENERATED_MOCK_REAL_CHROME_QA_V1',
    status: 'RUNNING', startedAt: new Date().toISOString(), baseUrl,
    source: { exam: '2025 팔마고 고1 공통수학2 2학기 중간', sourceExamBlobSha: SOURCE_SHA, sourceCount: SOURCE_COUNT },
    registeredCandidateCount: pool.length,
    registeredSourceQids: [...new Set(pool.map(row => Number(row.sourceQid)))].sort((a, b) => a - b),
    registeredQuestionForms: questionInventory.formCounts,
    referencedProblemImageCount: questionInventory.problemImages.length,
    referencedSolutionImageCount: questionInventory.solutionImages.length,
    checks: [], screenshots: []
  };
  const check = (name, details = {}) => evidence.checks.push({ name, status: 'PASS', ...details });
  const assert = (condition, message, details = {}) => { if (!condition) throw new Error(`${message} ${JSON.stringify(details)}`); };
  try {
    session = await connectChrome(chrome, baseUrl, profile);
    const { evaluate, send } = session;
    await waitFor(evaluate, "document.getElementById('source-coverage')?.textContent.includes('23/23')", 'Palma 23/23 source coverage');
    const initial = await evaluate(`(()=>({
      fields:Object.fromEntries(['source-year','source-school','source-grade','source-subject','source-semester','source-term'].map(id=>[id,document.getElementById(id)?.value])),
      title:document.getElementById('source-exam-title')?.textContent,
      coverage:document.getElementById('source-coverage')?.textContent,
      missing:document.getElementById('source-missing-qids')?.textContent,
      purpose:['A','B','C'].map(x=>({key:x,checked:document.getElementById('purpose-'+x)?.checked})),
      teacherNoteHidden:document.getElementById('teacher-output-note')?.hidden,
      teacherToolsHidden:document.getElementById('teacher-mock-tools')?.hidden,
      legacyCards:document.querySelectorAll('#exam-cards .exam-card').length,
      manualExists:!!document.querySelector('.manual-section')
    }))()`);
    assert(initial.fields['source-year'] === '2025' && initial.fields['source-school'] === '팔마고' &&
      initial.fields['source-grade'] === '고1' && initial.fields['source-subject'] === '공통수학2' &&
      initial.fields['source-semester'] === '2' && initial.fields['source-term'] === '중간', 'Wrong default source exam.', initial);
    assert(initial.coverage.includes('23/23') && initial.missing.includes('모든 원본'), 'Full source coverage is not visible.', initial);
    assert(initial.purpose.every(item => item.checked) && initial.legacyCards === 2 && initial.manualExists &&
      initial.teacherNoteHidden === false && initial.teacherToolsHidden === true, 'Purpose defaults, teacher gating, or existing paths changed.', initial);
    const originalViewport = await evaluate('({width:window.innerWidth,height:window.innerHeight})');
    await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 1100, deviceScaleFactor: 1, mobile: false });
    const builderViewport = await evaluate(`(()=>({
      width:window.innerWidth,height:window.innerHeight,
      controls:['source-year','source-school','source-grade','source-subject','source-semester','source-term','purpose-cards','difficulty-mode-random','difficulty-mode-specified','difficulty-mode-mixed','generate-mock']
        .map(id=>({id,bottom:Math.ceil(document.getElementById(id).getBoundingClientRect().bottom)}))
    }))()`);
    assert(builderViewport.width === 1280 && builderViewport.height === 1100 && builderViewport.controls.every(control => control.bottom <= 1100),
      'The complete source and builder controls do not fit in the requested 1280x1100 review viewport.', builderViewport);
    await saveScreenshot(send, output, 'desktop-builder-controls.png'); evidence.screenshots.push('desktop-builder-controls.png');
    check('complete source and builder controls fit in a 1280x1100 desktop viewport', builderViewport);
    await send('Emulation.setDeviceMetricsOverride', { ...originalViewport, deviceScaleFactor: 1, mobile: false });
    await saveScreenshot(send, output, 'desktop-source-and-controls.png'); evidence.screenshots.push('desktop-source-and-controls.png');
    check('exact Palma source selected and legacy/manual paths remain present', initial);

    // Simulate the previously incomplete 16/23 data state without changing files.
    const partial = await evaluate(`(()=>{const prior=selectableRows;selectableRows=prior.filter(row=>Number(row.sourceQid)<=16);renderSourceSelection();const out={coverage:document.getElementById('source-coverage').textContent,missing:document.getElementById('source-missing-qids').textContent};selectableRows=prior;renderSourceSelection();return out;})()`);
    assert(partial.coverage.includes('16/23') && ['q17','q18','q19','q20','q21','q22','q23'].every(qid=>partial.missing.includes(qid)), 'Incomplete source coverage message omitted q17–q23.', partial);
    check('incomplete coverage names every missing source question', partial);

    const yearOptions = await evaluate("[...document.querySelectorAll('#source-year option')].map(option=>option.value)");
    const schoolOptions2025 = await evaluate("[...document.querySelectorAll('#source-school option')].map(option=>option.value)");
    assert(JSON.stringify(yearOptions) === JSON.stringify(['2025', '2026']) && JSON.stringify(schoolOptions2025) === JSON.stringify(['팔마고']),
      'Source filters grouped another school into the 2025 Palma exam.', { yearOptions, schoolOptions2025 });
    await evaluate("(()=>{const field=document.getElementById('source-year');field.value='2026';field.dispatchEvent(new Event('change',{bubbles:true}));return true;})()");
    const changedYear = await evaluate(`(()=>({
      year:document.getElementById('source-year').value,school:document.getElementById('source-school').value,
      schools:[...document.querySelectorAll('#source-school option')].map(option=>option.value),
      term:document.getElementById('source-term').value,title:document.getElementById('source-exam-title').textContent
    }))()`);
    assert(changedYear.year === '2026' && ['복성고', '효천고'].includes(changedYear.school) &&
      changedYear.schools.every(school=>school!=='팔마고') && !changedYear.title.includes('2025 팔마고'),
      'Changing year retained an incompatible school/source tuple.', changedYear);
    await evaluate("(()=>{const field=document.getElementById('source-year');field.value='2025';field.dispatchEvent(new Event('change',{bubbles:true}));return true;})()");
    await waitFor(evaluate, "document.getElementById('source-year')?.value==='2025' && document.getElementById('source-school')?.value==='팔마고' && document.getElementById('source-coverage')?.textContent.includes('23/23')", 'restored Palma source tuple');
    check('cascading filters preserve the exact school/year/source exam tuple', { yearOptions, schoolOptions2025, changedYear });

    const allPurposes = ['A', 'B', 'C'];
    const configure = async (purposes, mode, bucket, quotas = {}) => evaluate(`(()=>{
      for(const key of ['A','B','C']){const el=document.getElementById('purpose-'+key);el.checked=${JSON.stringify(purposes)}.includes(key);el.dispatchEvent(new Event('change',{bubbles:true}));}
      document.getElementById('difficulty-mode-'+${JSON.stringify(mode)}).checked=true;
      document.getElementById('difficulty-mode-'+${JSON.stringify(mode)}).dispatchEvent(new Event('change',{bubbles:true}));
      if(${JSON.stringify(mode)}==='specified'){const el=document.getElementById('difficulty-bucket');el.value=String(${JSON.stringify(bucket)});el.dispatchEvent(new Event('change',{bubbles:true}));}
      for(let b=1;b<=5;b++){const el=document.getElementById('quota-'+b);el.value=String(${JSON.stringify(quotas)}[b]||0);el.dispatchEvent(new Event('input',{bubbles:true}));}
      return {ready:document.getElementById('builder-readiness').textContent,disabled:document.getElementById('generate-mock').disabled};
    })()`);
    const generate = async () => {
      const feedback = await evaluate(`(()=>{document.getElementById('generate-mock').click();return {
        status:document.getElementById('message').textContent,
        placeholders:[...document.querySelectorAll('.mock-question-body')].some(node=>node.textContent.includes('불러오는 중'))
      };})()`);
      assert(normalize(feedback.status).length > 0 || feedback.placeholders, 'Generate click had no immediate visible feedback.', feedback);
      await waitFor(evaluate, "document.querySelectorAll('.mock-question-body[data-loaded=true]').length===document.querySelectorAll('.mock-question').length && document.querySelectorAll('.mock-question').length>0", 'loaded generated preview');
      return evaluate(cardSnapshotExpression());
    };
    const checkRows = (cards, purposes, mode, difficulty, quotas = {}) => {
      const requested = new Set(purposes);
      assert(cards.length > 0 && cards.every(card => card.loaded), 'Preview did not load all candidate questions.', { count: cards.length });
      assert(new Set(cards.map(card => card.qid)).size === cards.length && new Set(cards.map(card => card.uid)).size === cards.length,
        'Selection repeats a source qid or UID.', cards.map(({ qid, uid }) => ({ qid, uid })));
      assert(cards.every((card, index) => index === 0 || card.qid > cards[index - 1].qid),
        'Questions are not ordered by original source number.', cards.map(card => card.qid));
      for (const card of cards) {
        const source = pool.find(row => row.uid === card.uid);
        assert(source && Number(source.sourceQid) === card.qid && purposeOf(source) === card.purpose && bucketOf(source) === card.difficulty,
          'Preview UID/purpose/difficulty does not match approved source metadata.', card);
        assert(requested.has(card.purpose), 'A candidate outside the selected purpose was used.', card);
        if (mode === 'specified') assert(card.difficulty === Number(difficulty), 'Fixed difficulty selection used another bucket.', card);
        if (mode === 'mixed') assert((quotas[card.difficulty] || 0) > 0, 'Mixed selection used an unrequested bucket.', card);
      }
      const math = mathAudit(cards);
      assert(math.allRendered, 'A selected question has source math that was not typeset before output.', math);
      return cards.map(({ qid, uid, purpose, difficulty }) => ({ qid, uid, purpose, difficulty }));
    };

    // Random selection and individual purpose filters.
    for (const purpose of allPurposes) {
      await configure([purpose], 'random');
      const cards = await generate();
      checkRows(cards, [purpose], 'random');
      assert(cards.length === SOURCE_COUNT, `Purpose ${purpose} did not cover all 23 source questions.`, { count: cards.length });
      check(`random mode honors purpose ${purpose}`, { count: cards.length });
    }
    await configure(allPurposes, 'random');
    let cards = await generate();
    checkRows(cards, allPurposes, 'random');
    assert(cards.length === SOURCE_COUNT, 'Random mode did not produce one item for each source question.', { count: cards.length });
    assert(JSON.stringify(cards.map(card => card.qid)) === JSON.stringify(Array.from({ length: SOURCE_COUNT }, (_, index) => index + 1)),
      'Random mode failed complete ordered source coverage.', cards.map(card => card.qid));
    await saveScreenshot(send, output, 'desktop-random-preview.png'); evidence.screenshots.push('desktop-random-preview.png');
    check('random mode selects one ordered, unique candidate per source question', { count: cards.length });

    // A visible result may not be silently printed under a different set of conditions.
    const removedPurpose = cards[0].purpose;
    await evaluate(`(()=>{const el=document.getElementById('purpose-'+${JSON.stringify(removedPurpose)});el.checked=false;el.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);
    const stale = await evaluate(`(()=>({
      noteHidden:document.getElementById('mock-stale-note')?.hidden,
      note:document.getElementById('mock-stale-note')?.textContent,
      printDisabled:document.getElementById('print-mock')?.disabled,
      regenerateDisabled:document.getElementById('regenerate-unlocked')?.disabled,
      resultCount:document.querySelectorAll('.mock-question').length
    }))()`);
    assert(stale.resultCount === SOURCE_COUNT && stale.noteHidden === false && stale.printDisabled && stale.regenerateDisabled &&
      normalize(stale.note).length > 0, 'Changed conditions left an unlabelled or printable stale result.', stale);
    check('condition changes label the snapshot and block stale print/regeneration', stale);
    await configure(allPurposes, 'random');
    const restored = await evaluate(`(()=>({noteHidden:document.getElementById('mock-stale-note')?.hidden,printDisabled:document.getElementById('print-mock')?.disabled}))()`);
    assert(restored.noteHidden && !restored.printDisabled, 'Restoring the exact prior conditions did not restore its matching result snapshot.', restored);

    // Find a real purpose/bucket pair and verify that the numeric bucket is used independently.
    let fixedPair = null;
    for (const purpose of allPurposes) for (let bucket = 1; bucket <= 5; bucket += 1) {
      const qids = new Set(pool.filter(row => purposeOf(row) === purpose && bucketOf(row) === bucket).map(row => Number(row.sourceQid)));
      if (qids.size && qids.size < SOURCE_COUNT) { fixedPair = { purpose, bucket, qids: [...qids].sort((a, b) => a - b) }; break; }
    }
    assert(fixedPair, 'No sparse approved purpose/difficulty combination exists for coverage QA.');
    await configure([fixedPair.purpose], 'specified', fixedPair.bucket);
    cards = await generate();
    const fixedExpected = fixedPair.qids;
    checkRows(cards, [fixedPair.purpose], 'specified', fixedPair.bucket);
    assert(JSON.stringify(cards.map(card => card.qid)) === JSON.stringify(fixedExpected), 'Fixed mode did not show exactly the source qids with that real bucket.', { fixedPair, actual: cards.map(card => card.qid) });
    const fixedCoverage = await evaluate(`(()=>({
      summary:document.getElementById('mock-result-summary').innerText,
      missing:document.getElementById('mock-missing-qids').textContent
    }))()`);
    const fixedMissing = Array.from({ length: SOURCE_COUNT }, (_, index) => index + 1).filter(qid => !fixedExpected.includes(qid));
    assert(fixedExpected.length < SOURCE_COUNT && fixedCoverage.summary.includes(`${fixedExpected.length}개`) &&
      fixedMissing.every(qid => fixedCoverage.missing.includes('q' + qid)), 'Fixed difficulty did not make sparse source coverage explicit.', { fixedPair, fixedCoverage, fixedMissing });
    check('fixed numeric difficulty uses metadata and reports sparse coverage', { purpose: fixedPair.purpose, bucket: fixedPair.bucket, qids: fixedExpected, missing: fixedMissing });

    // Mixed quotas: choose two buckets with candidates on distinct source questions.
    const qidsByBucket = Object.fromEntries([1, 2, 3, 4, 5].map(bucket => [bucket,
      [...new Set(pool.filter(row => bucketOf(row) === bucket).map(row => Number(row.sourceQid)))].sort((a, b) => a - b)
    ]));
    let mixedBuckets = null;
    for (let left = 1; left <= 5 && !mixedBuckets; left += 1) for (let right = left; right <= 5; right += 1) {
      const leftQid = qidsByBucket[left][0];
      const rightQid = qidsByBucket[right].find(qid => qid !== leftQid);
      if (leftQid && rightQid) { mixedBuckets = [left, right]; break; }
    }
    assert(mixedBuckets, 'No feasible two-question mixed quota exists in the registered source pool.', qidsByBucket);
    const quotas = { [mixedBuckets[0]]: 1, [mixedBuckets[1]]: (mixedBuckets[0] === mixedBuckets[1] ? 2 : 1) };
    await configure(allPurposes, 'mixed', null, quotas);
    cards = await generate();
    checkRows(cards, allPurposes, 'mixed', null, quotas);
    const actualQuotas = Object.fromEntries([1, 2, 3, 4, 5].map(bucket => [bucket, cards.filter(card => card.difficulty === bucket).length]));
    assert(JSON.stringify(actualQuotas) === JSON.stringify(Object.fromEntries([1, 2, 3, 4, 5].map(bucket => [bucket, quotas[bucket] || 0]))),
      'Mixed mode failed the exact per-bucket quotas.', { quotas, actualQuotas });
    check('mixed mode satisfies exact quotas on distinct source questions', { quotas, actual: cards.map(card => ({ qid: card.qid, difficulty: card.difficulty })) });

    // Impossible conditions must disable generation with an explicit message.
    const impossible = await configure(allPurposes, 'mixed', null, { 1: SOURCE_COUNT + 1 });
    assert(impossible.disabled && normalize(impossible.ready).includes(`${SOURCE_COUNT}문항보다 1문항 많습니다`), 'Impossible quota did not show the source-size constraint.', impossible);
    check('impossible mixed quota is reported and disabled', impossible);
    await configure([], 'random');
    const nonePurpose = await evaluate(`(()=>({disabled:document.getElementById('generate-mock').disabled,readiness:document.getElementById('builder-readiness').textContent}))()`);
    assert(nonePurpose.disabled && normalize(nonePurpose.readiness).includes('학습 목적'), 'Empty purpose selection did not show an error.', nonePurpose);
    check('empty purpose selection is reported and disabled', nonePurpose);

    // Locks survive regeneration; unlocked rows change without breaking qid order or eligibility.
    await configure(allPurposes, 'random');
    cards = await generate();
    const beforeLock = cards.map(({ qid, uid, purpose, difficulty }) => ({ qid, uid, purpose, difficulty }));
    await waitFor(evaluate, "!!window.MathJax?.typesetPromise && document.querySelector('.mock-question-body mjx-container')", 'MathJax rendered preview');
    const mathBeforeLock = await evaluate(`(()=>{const nodes=[...document.querySelectorAll('.mock-question-body mjx-container')];window.__qaMathNodes=nodes;return {count:nodes.length,allRendered:nodes.every(node=>node.isConnected)};})()`);
    assert(mathBeforeLock.count > 0 && mathBeforeLock.allRendered, 'Preview has no rendered MathJax nodes to preserve.', mathBeforeLock);
    await evaluate("document.querySelector('.mock-question[data-source-qid=\"1\"] .mock-lock').click(); true");
    await waitFor(evaluate, "document.querySelector('.mock-question[data-source-qid=\"1\"] .mock-lock')?.getAttribute('aria-pressed')==='true'", 'q1 lock');
    const lockedButton = await evaluate("document.querySelector('.mock-question[data-source-qid=\"1\"] .mock-replace')?.disabled===true");
    assert(lockedButton, 'Locked question still has an active replace button.');
    const mathAfterLock = await evaluate(`(()=>{const nodes=[...document.querySelectorAll('.mock-question-body mjx-container')];return {count:nodes.length,identitiesPreserved:window.__qaMathNodes.length===nodes.length&&nodes.every((node,index)=>node===window.__qaMathNodes[index])};})()`);
    assert(mathAfterLock.count === mathBeforeLock.count && mathAfterLock.identitiesPreserved,
      'Locking a question recreated or removed already rendered math.', { before: mathBeforeLock, after: mathAfterLock });
    check('locking preserves already rendered MathJax nodes', { mathNodes: mathAfterLock.count });
    await evaluate("document.getElementById('regenerate-unlocked').click(); true");
    await waitFor(evaluate, "document.querySelectorAll('.mock-question-body[data-loaded=true]').length===23", 'regenerated unlocked preview');
    let regenerated = await evaluate(cardSnapshotExpression());
    assert(regenerated[0].uid === beforeLock[0].uid && regenerated[0].lockPressed, 'Locked candidate changed during regeneration.', { before: beforeLock[0], after: regenerated[0] });
    assert(regenerated.slice(1).every(card => card.uid !== beforeLock[card.qid - 1].uid), 'An unlocked source question failed to switch to a different candidate.',
      regenerated.filter(card => card.uid === beforeLock[card.qid - 1]?.uid).map(card => card.qid));
    checkRows(regenerated, allPurposes, 'random');
    check('locked row survives regeneration and every unlocked row changes', { lockedUid: regenerated[0].uid, unlockedChanged: 22 });

    const beforeReplace = regenerated[1];
    await evaluate("document.querySelector('.mock-question[data-source-qid=\"2\"] .mock-replace').click(); true");
    await waitFor(evaluate, `document.querySelector('.mock-question[data-source-qid="2"]')?.dataset.uid!==${JSON.stringify(beforeReplace.uid)}`, 'individual replacement');
    regenerated = await evaluate(cardSnapshotExpression());
    assert(regenerated[1].qid === beforeReplace.qid && regenerated[1].uid !== beforeReplace.uid &&
      new Set(regenerated.map(card => card.uid)).size === SOURCE_COUNT, 'Individual replacement violated qid/UID constraints.', { before: beforeReplace, after: regenerated[1] });
    checkRows(regenerated, allPurposes, 'random');
    check('individual replacement stays in its source-qid slot', { before: beforeReplace.uid, after: regenerated[1].uid });

    // Delay a shard read during replacement: changing the source must be impossible while its async result is pending.
    const beforeDelayedReplace = regenerated[2];
    await evaluate(`(()=>{
      window.__qaOriginalFetch=window.fetch.bind(window);window.__qaHeldShardReads=[];window.__qaHoldShardReads=true;
      window.fetch=(input,init)=>{
        if(window.__qaHoldShardReads&&String(input).includes('generated-lite-consumer/v1/shards/'))
          return new Promise(resolve=>window.__qaHeldShardReads.push(()=>window.__qaOriginalFetch(input,init).then(resolve)));
        return window.__qaOriginalFetch(input,init);
      };
      cache.clear();return true;
    })()`);
    await evaluate("document.querySelector('.mock-question[data-source-qid=\"3\"] .mock-replace').click(); true");
    await waitFor(evaluate, 'window.__qaHeldShardReads?.length>0', 'delayed replacement shard request');
    const pendingState = await evaluate(`(()=>({
      sourceControls:['source-year','source-school','source-grade','source-subject','source-semester','source-term'].every(id=>document.getElementById(id).disabled),
      purposeControls:['A','B','C'].every(id=>document.getElementById('purpose-'+id).disabled),
      printDisabled:document.getElementById('print-mock').disabled,
      message:document.getElementById('message').textContent,
      qid:document.querySelector('.mock-question[data-source-qid="3"]')?.dataset.sourceQid,
      sourceTitle:document.getElementById('source-exam-title').textContent
    }))()`);
    assert(pendingState.sourceControls && pendingState.purposeControls && pendingState.printDisabled &&
      pendingState.message.includes('대체 후보') && pendingState.message.includes('불러옵니다'),
      'Source or condition controls stayed active while a replacement shard was loading.', pendingState);
    await evaluate(`(()=>{const release=window.__qaHeldShardReads.splice(0);window.__qaHoldShardReads=false;window.fetch=window.__qaOriginalFetch;release.forEach(resolve=>resolve());return true;})()`);
    await waitFor(evaluate, `document.querySelector('.mock-question[data-source-qid="3"]')?.dataset.uid!==${JSON.stringify(beforeDelayedReplace.uid)} && document.querySelector('.mock-question[data-source-qid="3"] .mock-question-body[data-loaded=true]')`, 'delayed replacement completion');
    regenerated = await evaluate(cardSnapshotExpression());
    const afterDelayed = await evaluate(`(()=>({
      school:document.getElementById('source-school').value,
      title:document.getElementById('source-exam-title').textContent,
      qids:[...document.querySelectorAll('.mock-question')].map(node=>Number(node.dataset.sourceQid)),
      printDisabled:document.getElementById('print-mock').disabled
    }))()`);
    assert(afterDelayed.school === '팔마고' && afterDelayed.title === initial.title && afterDelayed.qids.length === SOURCE_COUNT &&
      afterDelayed.qids.every((qid,index)=>qid===index+1) && !afterDelayed.printDisabled,
      'A delayed replacement changed or repopulated the wrong source exam.', afterDelayed);
    checkRows(regenerated, allPurposes, 'random');
    check('async replacement keeps source controls locked and commits to the same source qid', { pendingState, after: afterDelayed });
    await saveScreenshot(send, output, 'desktop-locks-and-replacements.png'); evidence.screenshots.push('desktop-locks-and-replacements.png');

    // Print mode has exactly the same order and question content as the visible preview.
    const previewBeforePrint = regenerated.map(({ qid, uid, purpose, difficulty, stem, stemSource, choices, choiceSources, mathSources, renderedMathSources, images }) => ({
      qid, uid, purpose, difficulty, stem, stemSource, choices, choiceSources, mathSources, renderedMathSources, images
    }));
    await evaluate(`(()=>{window.__qaPrintCount=0;window.__qaPrintedMockUids=[];window.print=()=>{window.__qaPrintCount++;window.__qaPrintedMockUids=mockItems.map(item=>item.row.uid);};return true;})()`);
    await evaluate("document.getElementById('print-mock').click(); true");
    await waitFor(evaluate, 'window.__qaPrintCount===1', 'student question print invocation');
    const paper = await evaluate(`(()=>({
      title:document.getElementById('paper-title').textContent,
      uids:window.__qaPrintedMockUids,
      questions:[...document.querySelectorAll('#paper-items .paper-question')].map(node=>({
        stem:(node.querySelector('.stem')?.innerText||'').replace(/\\s+/g,' ').trim(),
        stemSource:node.querySelector('.stem')?.dataset.sourceText,
        choices:[...node.querySelectorAll('.choice')].map(x=>x.innerText.replace(/\\s+/g,' ').trim()),
        choiceSources:[...node.querySelectorAll('.choice')].map(x=>x.dataset.sourceText),
        mathSources:[...node.querySelectorAll('.stem,.choice')].filter(x=>(x.dataset.sourceText||'').includes('$')).length,
        renderedMathSources:[...node.querySelectorAll('.stem,.choice')].filter(x=>(x.dataset.sourceText||'').includes('$')&&x.querySelector('mjx-container')).length,
        images:[...node.querySelectorAll('img')].map(x=>x.getAttribute('src'))
      })),
      mathNodes:document.querySelectorAll('#paper-items mjx-container').length,
      answerBlocks:document.querySelectorAll('#paper-items .answer').length,
      hasAnswerText:/정답\\s*:|해설/.test(document.getElementById('paper-items').innerText),
      brokenImages:[...document.querySelectorAll('#paper-items img')].filter(img=>!img.complete||img.naturalWidth===0).map(img=>img.src)
    }))()`);
    assert(paper.questions.length === SOURCE_COUNT && paper.uids.length === SOURCE_COUNT &&
      JSON.stringify(paper.uids) === JSON.stringify(previewBeforePrint.map(item => item.uid)), 'Printed UID order or question count differs from preview.', { paperCount: paper.questions.length, printUids: paper.uids });
    assert(paper.answerBlocks === 0 && !paper.hasAnswerText, 'Question-only print contains an answer or solution block.');
    assert(paper.mathNodes > 0, 'Printed questions left their math unrendered.', { mathNodes: paper.mathNodes });
    for (let index = 0; index < SOURCE_COUNT; index += 1) {
      const preview = previewBeforePrint[index], printed = paper.questions[index];
      assert(preview.qid === index + 1 && preview.stemSource === printed.stemSource &&
        JSON.stringify(preview.choiceSources) === JSON.stringify(printed.choiceSources) &&
        preview.mathSources === preview.renderedMathSources && printed.mathSources === printed.renderedMathSources &&
        preview.mathSources === printed.mathSources && JSON.stringify(preview.images) === JSON.stringify(printed.images),
      'Printed question content/assets differ from preview or some source math was not typeset.', { qid: preview.qid, preview, printed });
    }
    assert(paper.brokenImages.length === 0, 'A question image failed to load in the printed sheet.', paper.brokenImages);
    await send('Emulation.setEmulatedMedia', { media: 'print' });
    const printLayout = await evaluate(`(()=>(
      {visible:getComputedStyle(document.getElementById('paper')).display!=='none',
       questionCount:document.querySelectorAll('#paper-items .paper-question').length,
       renderedMathNodes:document.querySelectorAll('#paper-items mjx-container').length,
       answerBlocks:document.querySelectorAll('#paper-items .answer').length,
       width:document.getElementById('paper').getBoundingClientRect().width}
    ))()`);
    assert(printLayout.visible && printLayout.questionCount === SOURCE_COUNT && printLayout.renderedMathNodes > 0 && printLayout.answerBlocks === 0,
      'Print media did not show the complete question-only, typeset paper.', printLayout);
    await saveScreenshot(send, output, 'student-print-output.png'); evidence.screenshots.push('student-print-output.png');
    await send('Emulation.setEmulatedMedia', { media: 'screen' });
    check('question print matches preview UID order/raw content/math/assets and excludes answers/solutions', {
      count: paper.questions.length, title: paper.title, renderedMathNodes: paper.mathNodes, printLayout,
      previewMathBeforePrint: mathAudit(previewBeforePrint),
      printedQuestionMath: mathAudit(paper.questions.map((question, index) => ({ qid: index + 1, uid: paper.uids[index], ...question })))
    });

    // The previous manual search/select entry point stays available and question-only.
    await evaluate("document.querySelector('.manual-section > summary').click(); true");
    await evaluate(`(()=>{const input=document.getElementById('generated-search');input.value='ALITE-PALMA25-2MID-Q01-A1';input.dispatchEvent(new Event('input',{bubbles:true}));return true;})()`);
    await waitFor(evaluate, "document.querySelector('#generated-results .generated-question-card')", 'manual generated search');
    const manual = await evaluate(`(()=>({
      count:document.querySelectorAll('#generated-results .generated-question-card').length,
      label:document.querySelector('#generated-results .generated-question-card')?.innerText,
      detailsOpen:document.querySelector('.manual-section')?.open===true,
      legacyExamCards:document.querySelectorAll('#exam-cards .exam-card').length
    }))()`);
    assert(manual.count === 1 && manual.detailsOpen && manual.legacyExamCards === 2 && manual.label.includes('ALITE-PALMA25-2MID-Q01-A1'),
      'Manual search/select or legacy school output path regressed.', manual);
    await evaluate("document.querySelector('#generated-results .generated-question-card button').click(); true");
    await waitFor(evaluate, "document.getElementById('generated-preview')?.hidden===false && document.querySelector('#generated-preview .paper-question')", 'manual student preview');
    const manualPreview = await evaluate(`(()=>({text:document.getElementById('generated-preview').innerText,answerBlocks:document.querySelectorAll('#generated-preview .answer').length}))()`);
    assert(manualPreview.answerBlocks === 0 && !/정답\\s*:|해설/.test(manualPreview.text), 'Manual student preview leaked solution content.', manualPreview);
    check('manual search/select remains available with question-only preview', { matchCount: manual.count, legacyExamCards: manual.legacyExamCards });

    // Teacher tools remain gated for students, then carry exact mode/UID/solution assets for teachers.
    await evaluate("localStorage.setItem('APMATH_SESSION',JSON.stringify({session_token:'qa-teacher-session',role:'teacher'})); true");
    await send('Page.reload', { ignoreCache: true });
    await waitFor(evaluate, "document.getElementById('source-coverage')?.textContent.includes('23/23') && document.getElementById('teacher-mock-tools')?.hidden===false", 'teacher session and source reload');
    await configure(allPurposes, 'random');
    const teacherCards = await generate();
    checkRows(teacherCards, allPurposes, 'random');
    assert(teacherCards.length === SOURCE_COUNT, 'Teacher mock did not retain all source questions.', { count: teacherCards.length });
    const teacherUids = teacherCards.map(card => card.uid);
    const teacherPreviewMath = mathAudit(teacherCards);
    const teacherButtons = await evaluate(`(()=>({
      visible:!document.getElementById('teacher-mock-tools').hidden,
      answerDisabled:document.getElementById('mock-answer-key').disabled,
      solutionDisabled:document.getElementById('mock-solution-sheet').disabled
    }))()`);
    assert(teacherButtons.visible && !teacherButtons.answerDisabled && !teacherButtons.solutionDisabled,
      'Teacher answer/solution controls were not available after a current preview.', teacherButtons);

    await evaluate("document.getElementById('mock-answer-key').click(); true");
    const answerTarget = await waitForPopup(session.port, session.targetId, '/archive/mixed_engine.html');
    const answerPage = await attachTarget(session.port, answerTarget.id);
    await waitFor(answerPage.evaluate, "AppState?.mode==='ans' && document.querySelector('#print-area .page')", 'answer output render');
    const answerOutput = await answerPage.evaluate(`(()=>({
      mode:AppState.mode,
      urlMode:new URLSearchParams(location.search).get('mode'),
      count:AppState.data.length,
      uids:(AppState.outputEnvelope||window.__AP_OUTPUT_ENVELOPE__)?.questionUids||[],
      answerValues:AppState.data.every(question=>question.answer!==undefined&&question.answer!==null),
      answerCells:document.querySelectorAll('#print-area .ans-cell:not(.ans-cell-empty)').length,
      title:document.getElementById('ctrl-title')?.textContent
    }))()`);
    assert(answerOutput.mode === 'ans' && answerOutput.urlMode === 'ans' && answerOutput.count === SOURCE_COUNT &&
      JSON.stringify(answerOutput.uids) === JSON.stringify(teacherUids) && answerOutput.answerValues && answerOutput.answerCells === SOURCE_COUNT,
      'Teacher answer output lost its mode, UID order, count, or answers.', answerOutput);
    await saveScreenshot(answerPage.send, output, 'teacher-answer-output.png'); evidence.screenshots.push('teacher-answer-output.png');
    check('teacher answer output preserves ans mode and all source-ordered UIDs', {
      ...answerOutput, teacherPreviewMathBeforeOutput: teacherPreviewMath
    });
    await answerPage.evaluate('window.close(); true').catch(() => {}); answerPage.socket.close();

    await waitFor(evaluate, "!document.getElementById('mock-answer-key').disabled && !document.getElementById('mock-solution-sheet').disabled", 'teacher controls ready after answer output');
    await evaluate("document.getElementById('mock-solution-sheet').click(); true");
    const solutionTarget = await waitForPopup(session.port, session.targetId, '/archive/mixed_engine.html');
    const solutionPage = await attachTarget(session.port, solutionTarget.id);
    await waitFor(solutionPage.evaluate, "AppState?.mode==='sol' && document.querySelector('#print-area .page')", 'solution output render');
    const solutionOutput = await solutionPage.evaluate(`(()=>{
      const envelope=AppState.outputEnvelope||window.__AP_OUTPUT_ENVELOPE__;
      const expected=(AppState.data||[]).filter(question=>question.solutionImage).map(question=>new URL(question.solutionImage,location.href).pathname).sort();
      const images=[...document.querySelectorAll('#print-area .sol-image-wrap img')].map(image=>({path:new URL(image.getAttribute('src'),location.href).pathname,loaded:image.complete&&image.naturalWidth>0}));
      return {
        mode:AppState.mode,urlMode:new URLSearchParams(location.search).get('mode'),count:AppState.data.length,
        uids:envelope?.questionUids||[],solutions:AppState.data.every(question=>!!question.solution),
        solutionBoxes:document.querySelectorAll('#print-area .sol-box').length,
        expectedSolutionImages:expected,renderedSolutionImages:images.map(image=>image.path).sort(),
        brokenImages:images.filter(image=>!image.loaded).map(image=>image.path),
        title:document.getElementById('ctrl-title')?.textContent
      };
    })()`);
    assert(solutionOutput.mode === 'sol' && solutionOutput.urlMode === 'sol' && solutionOutput.count === SOURCE_COUNT &&
      JSON.stringify(solutionOutput.uids) === JSON.stringify(teacherUids) && solutionOutput.solutions && solutionOutput.solutionBoxes === SOURCE_COUNT,
      'Teacher solution output lost its mode, UID order, solutions, or questions.', solutionOutput);
    assert(JSON.stringify(solutionOutput.renderedSolutionImages) === JSON.stringify(solutionOutput.expectedSolutionImages) &&
      solutionOutput.brokenImages.length === 0, 'Teacher solution output omitted or failed to load a referenced solution image.', solutionOutput);
    assert(questionInventory.solutionImages.length > 0, 'No registered solution image references were present for the teacher asset smoke.');
    const registeredAssets = [...new Set([...questionInventory.problemImages, ...questionInventory.solutionImages])];
    const allAssetLoads = await solutionPage.evaluate(`(async()=>{
      const refs=${JSON.stringify(registeredAssets)};
      return await Promise.all(refs.map(async ref=>{
        const image=new Image();image.src=new URL(ref,location.href).href;
        try{await image.decode();return {ref,loaded:image.naturalWidth>0&&image.naturalHeight>0,width:image.naturalWidth,height:image.naturalHeight};}
        catch(error){return {ref,loaded:false,error:String(error)};}
      }));
    })()`);
    assert(allAssetLoads.length === registeredAssets.length && allAssetLoads.every(asset => asset.loaded),
      'A registered problem or solution image failed its actual teacher-origin Chrome HTTP load.', allAssetLoads.filter(asset => !asset.loaded));
    await saveScreenshot(solutionPage.send, output, 'teacher-solution-output.png'); evidence.screenshots.push('teacher-solution-output.png');
    check('teacher solution output preserves sol mode, UID order, and each referenced solution image', {
      ...solutionOutput, everyRegisteredImageLoaded: allAssetLoads.length, registeredImageCount: registeredAssets.length,
      teacherPreviewMathBeforeOutput: teacherPreviewMath
    });
    await solutionPage.evaluate('window.close(); true').catch(() => {}); solutionPage.socket.close();

    // Small-screen width check and evidence capture of the student preview.
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await evaluate("window.scrollTo(0,document.querySelector('.result-section').offsetTop)");
    await sleep(200);
    const mobile = await evaluate(`(()=>({
      viewport:window.innerWidth,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,
      questionCount:document.querySelectorAll('.mock-question').length,
      horizontalOverflow:document.documentElement.scrollWidth>window.innerWidth
    }))()`);
    assert(!mobile.horizontalOverflow && mobile.questionCount === SOURCE_COUNT, 'Mobile layout overflows or drops questions.', mobile);
    await saveScreenshot(send, output, 'mobile-preview.png'); evidence.screenshots.push('mobile-preview.png');
    check('mobile preview has no horizontal overflow', mobile);

    // Locally injected index delay and failure verify that the page exposes loading and error states.
    if (local) {
      await send('Page.navigate', { url: local.slowUrl });
      await waitFor(evaluate, "document.readyState!=='loading' && document.getElementById('exam-cards')?.textContent.includes('불러오는 중') && document.getElementById('generated-search-summary')?.textContent.includes('불러오는 중')", 'visible loading state', 10000);
      const loading = await evaluate(`(()=>({
        exams:document.getElementById('exam-cards').textContent,
        generated:document.getElementById('generated-search-summary').textContent,
        source:document.getElementById('source-coverage').textContent,
        blank:!document.querySelector('main')?.innerText.trim()
      }))()`);
      assert(!loading.blank && loading.exams.includes('불러오는 중') && loading.generated.includes('불러오는 중'), 'Loading state is blank or unclear.', loading);
      await saveScreenshot(send, output, 'desktop-loading-state.png'); evidence.screenshots.push('desktop-loading-state.png');
      check('index loading is visible while generated records are pending', loading);
      await waitFor(evaluate, "document.getElementById('source-coverage')?.textContent.includes('23/23')", 'delayed index completion');

      await send('Page.navigate', { url: local.errorUrl });
      await waitFor(evaluate, "document.getElementById('message')?.textContent.includes('시험지를 불러오지 못했습니다')", 'visible index failure state');
      const failure = await evaluate(`(()=>({message:document.getElementById('message').textContent,examList:document.getElementById('exam-cards').textContent,blank:!document.querySelector('main')?.innerText.trim()}))()`);
      assert(!failure.blank && failure.message.includes('시험지를 불러오지 못했습니다') && failure.examList.includes('확인할 수 없습니다'),
        'Index failure did not show a clear recoverable page state.', failure);
      await saveScreenshot(send, output, 'desktop-error-state.png'); evidence.screenshots.push('desktop-error-state.png');
      check('index failure leaves a visible error state instead of a blank page', failure);
    }

    evidence.status = 'PASS'; evidence.completedAt = new Date().toISOString();
    fs.writeFileSync(path.join(output, 'generated-mock-qa.json'), `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
    console.log(`GENERATED_MOCK_REAL_CHROME_QA_PASS ${JSON.stringify({
      baseUrl, registeredCandidates: pool.length, sourceQids: evidence.registeredSourceQids,
      checks: evidence.checks.length, screenshots: evidence.screenshots.map(file => path.join(output, file)),
      evidence: path.join(output, 'generated-mock-qa.json')
    })}`);
  } catch (error) {
    evidence.status = 'FAIL'; evidence.completedAt = new Date().toISOString(); evidence.failure = error.stack || String(error);
    try { fs.writeFileSync(path.join(output, 'generated-mock-qa.json'), `${JSON.stringify(evidence, null, 2)}\n`, 'utf8'); } catch (_) {}
    console.error('GENERATED_MOCK_REAL_CHROME_QA_FAIL', error.stack || error);
    process.exitCode = 1;
  } finally {
    if (session?.socket) session.socket.close();
    if (session?.browser && session.browser.exitCode === null) session.browser.kill('SIGTERM');
    if (local?.server) await new Promise(resolve => local.server.close(resolve));
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_) {}
  }
}

main().catch(error => { console.error('GENERATED_MOCK_REAL_CHROME_QA_FAIL', error.stack || error); process.exitCode = 1; });
