import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const reviewDir = path.dirname(new URL(import.meta.url).pathname).replace(/^\/[A-Za-z]:/, m => m.slice(1));
const engineRoot = path.resolve(reviewDir, '..', '..');
const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const viewport = { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false };
const artifactPath = path.join(reviewDir, 'inputs', '25_금당고_2학기_중간_고1_기출.js');
const artifactRoute = '/archive/exams/original/high/h1/2mid/25_금당고_2학기_중간_고1_기출.js';
const exams = [
  {
    key: 'after',
    expected: 22,
    title: '25_금당고_2학기_중간_고1_기출',
    data: 'exams/original/high/h1/2mid/25_금당고_2학기_중간_고1_기출.js',
    input: 'inputs/25_금당고_2학기_중간_고1_기출.js',
  },
];

class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 0;
    this.pending = new Map();
    this.listeners = new Set();
    this.opened = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
    this.ws.addEventListener('message', event => {
      let message;
      try { message = JSON.parse(String(event.data)); } catch { return; }
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
        else pending.resolve(message.result || {});
      } else {
        for (const listener of this.listeners) listener(message);
      }
    });
  }
  async send(method, params = {}, sessionId) {
    await this.opened;
    const id = ++this.nextId;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, method });
      this.ws.send(JSON.stringify(payload));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP timeout: ${method}`));
        }
      }, 30000).unref?.();
    });
  }
  close() { try { this.ws.close(); } catch {} }
}

function mimeType(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff',
    '.ttf': 'font/ttf', '.pdf': 'application/pdf',
  })[ext] || 'application/octet-stream';
}

async function readQuestionBank(file) {
  const source = await fs.readFile(file, 'utf8');
  const assignment = source.indexOf('window.questionBank');
  const arrayStart = source.indexOf('[', assignment);
  const arrayEnd = source.lastIndexOf('];');
  if (assignment < 0 || arrayStart < 0 || arrayEnd < arrayStart) throw new Error('Could not parse frozen questionBank artifact');
  return JSON.parse(source.slice(arrayStart, arrayEnd + 1));
}

function auditInputParity(expectedQuestions, renderedQuestions) {
  const fields = ['id', 'content', 'choices', 'answer', 'solution'];
  const counts = Object.fromEntries(fields.map(field => [field, 0]));
  const mismatches = [];
  const getValue = (question, field, index) => {
    if (field === 'id') return question.id ?? index + 1;
    if (field === 'content') return question.content ?? question.question ?? null;
    if (field === 'solution') return question.solution ?? question.explanation ?? question.sol ?? null;
    return question[field] ?? null;
  };
  if (expectedQuestions.length !== renderedQuestions.length) {
    mismatches.push({ field: 'questionCount', expected: expectedQuestions.length, actual: renderedQuestions.length });
  }
  for (let index = 0; index < Math.max(expectedQuestions.length, renderedQuestions.length); index += 1) {
    const expected = expectedQuestions[index];
    const rendered = renderedQuestions[index];
    if (!expected || !rendered) continue;
    for (const field of fields) {
      if (JSON.stringify(getValue(expected, field, index)) === JSON.stringify(getValue(rendered, field, index))) counts[field] += 1;
      else mismatches.push({ index: index + 1, id: expected.id ?? index + 1, field });
    }
  }
  return { expectedQuestions: expectedQuestions.length, renderedQuestions: renderedQuestions.length, fieldParityCounts: counts, mismatches };
}

async function startServer() {
  const root = path.resolve(engineRoot);
  const server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      const file = pathname === artifactRoute ? artifactPath : path.resolve(root, `.${pathname}`);
      if (!file.startsWith(root + path.sep) && file !== root) {
        if (pathname !== artifactRoute) { res.writeHead(403).end('Forbidden'); return; }
      }
      const stat = await fs.stat(file).catch(() => null);
      if (!stat?.isFile()) { res.writeHead(404).end('Not found'); return; }
      res.writeHead(200, {
        'Content-Type': mimeType(file), 'Content-Length': stat.size,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      });
      if (req.method === 'HEAD') { res.end(); return; }
      const data = await fs.readFile(file);
      res.end(data);
    } catch (error) {
      res.writeHead(500).end(String(error));
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { server, port: server.address().port };
}

async function jsonFetch(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} ${url}`);
  return response.json();
}

async function launchChrome(profileDir) {
  await fs.mkdir(profileDir, { recursive: true });
  const child = spawn(chromeExe, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--disable-background-networking', '--force-device-scale-factor=1',
    '--remote-debugging-port=0', `--user-data-dir=${profileDir}`, 'about:blank',
  ], { stdio: 'ignore', windowsHide: true });
  const activePortFile = path.join(profileDir, 'DevToolsActivePort');
  let activePort = '';
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error(`Chrome exited early with ${child.exitCode}`);
    activePort = await fs.readFile(activePortFile, 'utf8').catch(() => '');
    if (activePort) break;
    await delay(100);
  }
  if (!activePort) throw new Error('Chrome DevToolsActivePort was not created.');
  const port = activePort.split(/\r?\n/)[0].trim();
  const version = await jsonFetch(`http://127.0.0.1:${port}/json/version`);
  const cdp = new CDP(version.webSocketDebuggerUrl);
  await cdp.opened;
  return { child, port, cdp };
}

async function evaluate(cdp, sessionId, expression, awaitPromise = false) {
  const result = await cdp.send('Runtime.evaluate', {
    expression, returnByValue: true, awaitPromise, userGesture: true,
  }, sessionId);
  if (result.exceptionDetails) {
    const text = result.exceptionDetails.exception?.description || result.exceptionDetails.text;
    throw new Error(`Page evaluation failed: ${text}`);
  }
  return result.result?.value;
}

async function readPdfPageCount(pdfPath) {
  const data = await fs.readFile(pdfPath);
  const latin = data.toString('latin1');
  return [...latin.matchAll(/\/Type\s*\/Page(?!s)\b/g)].length;
}

async function renderExam(cdp, serverPort, exam) {
  const context = await cdp.send('Target.createBrowserContext', { disposeOnDetach: true });
  const target = await cdp.send('Target.createTarget', { url: 'about:blank', browserContextId: context.browserContextId });
  const attached = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
  const sessionId = attached.sessionId;
  const consoleErrors = [];
  const consoleWarnings = [];
  const loadFailures = [];
  const responseFailures = [];
  const relevantRequests = [];
  const listener = message => {
    if (message.sessionId !== sessionId) return;
    if (message.method === 'Runtime.exceptionThrown') {
      const exception = message.params?.exceptionDetails?.exception?.description || message.params?.exceptionDetails?.text;
      consoleErrors.push({ type: 'exception', text: exception || 'Unspecified page exception' });
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params?.type === 'error') {
      consoleErrors.push({ type: 'console.error', text: (message.params.args || []).map(arg => arg.value || arg.description || '').join(' ') });
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params?.type === 'warning') {
      consoleWarnings.push((message.params.args || []).map(arg => arg.value || arg.description || '').join(' '));
    }
    if (message.method === 'Network.loadingFailed') loadFailures.push(message.params?.errorText || 'network loading failed');
    if (message.method === 'Network.responseReceived') {
      const response = message.params?.response;
      if (response?.status >= 400) responseFailures.push({url:response.url,status:response.status});
      if (/MathJax|2mid\/25_(?:\S+)_2학기_중간|fonts\.googleapis|fonts\.gstatic/i.test(response?.url || '')) relevantRequests.push({url:response.url,status:response.status});
    }
  };
  cdp.listeners.add(listener);
  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('Runtime.enable', {}, sessionId);
  await cdp.send('Network.enable', {}, sessionId);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true }, sessionId);
  await cdp.send('Network.setBypassServiceWorker', { bypass: true }, sessionId);
  await cdp.send('Emulation.setDeviceMetricsOverride', viewport, sessionId);
  await cdp.send('Emulation.setPageScaleFactor', { pageScaleFactor: 1 }, sessionId);

  const url = new URL('/archive/engine.html', `http://127.0.0.1:${serverPort}`);
  url.searchParams.set('mode', 'sol');
  url.searchParams.set('data', exam.data);
  url.searchParams.set('title', exam.title);
  await cdp.send('Page.navigate', { url: url.toString() }, sessionId);

  let lastState = null;
  const started = Date.now();
  while (Date.now() - started < 240000) {
    await delay(500);
    lastState = await evaluate(cdp, sessionId, `(() => {
      const state = typeof AppState === 'undefined' ? null : AppState;
      const count = document.querySelectorAll('.q-box.sol-box').length;
      const body = document.body?.innerText || '';
      return { ready: document.readyState, mode: state?.mode, dataCount: state?.data?.length || 0,
        boxCount: count, title: document.title, mathJax: !!window.MathJax,
        loadError: /시험지 데이터가 전달되지 않았습니다|시험지 데이터 경로가 올바르지 않아/.test(body),
        renderError: document.documentElement.dataset.apRenderError || '',
        renderReady: document.documentElement.dataset.apRenderReady === 'true', bodyText: body.slice(0,250) };
    })()`);
    if (lastState?.loadError || lastState?.renderError) {
      const debug = await evaluate(cdp, sessionId, `(() => ({ url:location.href,
        apError:document.documentElement.dataset.apRenderError || '', readiness:document.documentElement.dataset.apPrintReadiness || '',
        renderMetrics:document.documentElement.dataset.apRenderMetrics || '',
        mathJaxSource:window.__AP_MATHJAX_SOURCE__ || null, mathJax:!!window.MathJax,
        typesetPromise:typeof window.MathJax?.typesetPromise, startupPromise:!!window.MathJax?.startup?.promise,
        mathJaxVersion:window.MathJax?.version || null, questionBankCount:Array.isArray(window.questionBank)?window.questionBank.length:null,
        printAreaText:document.getElementById('print-area')?.innerText.slice(0,1200) || '',
        unrendered:window.APRenderLoop?.unrenderedMathCount(document.getElementById('print-area')) ?? null,
        scripts:[...document.scripts].map(s=>({src:s.src,readyState:s.readyState})).filter(s=>/MathJax|2mid/.test(s.src)) }))()`);
      throw new Error(`${exam.key}: engine failure: ${JSON.stringify({state:lastState,debug,consoleErrors,consoleWarnings,loadFailures,responseFailures,relevantRequests})}`);
    }
    if (lastState?.dataCount === exam.expected && lastState?.renderReady && lastState?.mode === 'sol') break;
  }
  if (lastState?.dataCount !== exam.expected || !lastState?.renderReady || lastState?.mode !== 'sol') {
    throw new Error(`${exam.key}: timed out waiting for all solution boxes: ${JSON.stringify(lastState)}`);
  }

  const stable = await evaluate(cdp, sessionId, `(async () => {
    try { if (window.__AP_MATHJAX_READY__) await window.__AP_MATHJAX_READY__; } catch {}
    try { if (window.MathJax?.startup?.promise) await window.MathJax.startup.promise; } catch {}
    try { await document.fonts.ready; } catch {}
    await Promise.all([...document.images].map(img => img.decode().catch(() => null)));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return { fonts: document.fonts.status, mathJax: !!window.MathJax,
      mathJaxSource: window.__AP_MATHJAX_SOURCE__ || null,
      mathJaxReady: !!window.MathJax?.startup?.document?.outputJax,
      imageCount: document.images.length, decodedImages: [...document.images].filter(img => img.complete && img.naturalWidth > 0).length };
  })()`, true);

  const renderedSourceData = await evaluate(cdp, sessionId, `AppState.data.map((q,index)=>({id:q.id??index+1,content:q.content??q.question??null,choices:q.choices??null,answer:q.answer??null,solution:q.solution??q.explanation??q.sol??null}))`);
  const inputParity = auditInputParity(exam.inputQuestions, renderedSourceData);

  const metrics = await evaluate(cdp, sessionId, `(() => {
    const state = AppState;
    const root = document.getElementById('print-area') || document.querySelector('[data-archive-build-root]');
    const boxes = [...document.querySelectorAll('.q-box.sol-box')];
    const fragmentRecords = boxes.map((box, index) => {
      const sourceRef = box.getAttribute('data-source-ref') || '';
      const ordinal = Number(sourceRef.match(/ordinal:(\\d+)$/)?.[1] || 0);
      const rect = box.getBoundingClientRect();
      const page = box.closest('.page');
      const solutionElement = box.querySelector('.sol-exp');
      const visibleSolutionText = solutionElement?.innerText || '';
      return {index:index+1, ordinal, sourceRef, textStart:box.innerText.slice(0,160),
        visibleSolutionText, visibleLineCount:visibleSolutionText.split(/\\r?\\n/).filter(line=>line.trim()).length,
        explicitBreakCount:solutionElement?.querySelectorAll('br').length||0,
        decisionBlockId:box.getAttribute('data-solution-decision-block-id')||null,
        layoutBlockId:box.getAttribute('data-solution-layout-block-id')||null,
        hasQuestionHeader:Boolean(box.querySelector('.q-num')),
        pageIndex:page ? [...document.querySelectorAll('.page')].indexOf(page)+1 : null,
        bbox:{x:rect.x+window.scrollX,y:rect.y+window.scrollY,width:rect.width,height:rect.height},
        classes:[...box.classList],
        autoCompressMarker:/auto.?compress|compressed|압축/i.test(String(box.className)+' '+box.innerHTML.slice(0,1500)),
        autoCompressApplied:Boolean(box.style.fontSize||box.style.lineHeight),
        inlineFontSize:box.style.fontSize||null, inlineLineHeight:box.style.lineHeight||null,
        fontSizes:[...box.querySelectorAll('.sol-exp')].map(el=>getComputedStyle(el).fontSize),
        horizontalOverflow:box.scrollWidth>box.clientWidth+1,
      };
    });
    const source = state.data.map((q, index) => {
      const lines = String(q.solution || '').split(/\\r?\\n/);
      const qid = Number(q.id ?? index + 1);
      const fragments = fragmentRecords.filter(fragment => fragment.ordinal === qid);
      const fragmentPages = [...new Set(fragments.map(fragment=>fragment.pageIndex).filter(Boolean))];
      const imgs = fragments.flatMap(fragment => [...boxes[fragment.index-1].querySelectorAll('img')]
        .map(img => ({src:img.getAttribute('src'),alt:img.alt||'',complete:img.complete,naturalWidth:img.naturalWidth})));
      return { qid:q.id??index+1, sourceLineCount:lines.length,
        sourceBlankLineCount:lines.filter(line=>!line.trim()).length,
        sourceCharCount:String(q.solution||'').length,
        renderedFragmentCount:fragments.length, fragmentPages,
        continuation:fragmentPages.length>1,
        renderedTextStarts:fragments.map(fragment=>fragment.textStart), fragments, images:imgs };
    });
    const renderedPages = [...document.querySelectorAll('.page')].map((page,index)=>{
      const r=page.getBoundingClientRect();
      const questionIds=[...new Set([...page.querySelectorAll('.q-box.sol-box')]
        .map(box=>Number((box.getAttribute('data-source-ref')||'').match(/ordinal:(\\d+)$/)?.[1]||0)).filter(Boolean))];
      return {index:index+1,x:r.x+window.scrollX,y:r.y+window.scrollY,width:r.width,height:r.height,questionIds};
    });
    const visibleText = root?.innerText || '';
    const renderedQuestionHeaders = boxes.filter(box=>box.querySelector('.q-num')).map(box=>({text:box.querySelector('.q-num').innerText.trim(),sourceRef:box.getAttribute('data-source-ref')}));
    const renderedOrdinals=[...new Set(fragmentRecords.map(fragment=>fragment.ordinal).filter(Boolean))].sort((a,b)=>a-b);
    const expectedOrdinals=state.data.map((q,index)=>Number(q.id??index+1)).sort((a,b)=>a-b);
    const missingRenderedQuestions=expectedOrdinals.filter(id=>!renderedOrdinals.includes(id));
    const unexpectedRenderedQuestions=renderedOrdinals.filter(id=>!expectedOrdinals.includes(id));
    const duplicatedRenderedQuestionHeaders=renderedQuestionHeaders.map(h=>Number(h.text.replace(/[^0-9].*$/,''))).filter((id,index,list)=>list.indexOf(id)!==index);
    const visibleImgs = [...document.images].map(img => ({src: img.getAttribute('src'), complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight}));
    const overflowElements = [...document.querySelectorAll('#print-area, #print-area *, .sol-exp, .sol-image-wrap, .MathJax_Display')]
      .filter(el => el.clientWidth && el.scrollWidth > el.clientWidth + 1)
      .slice(0,100).map(el => ({tag:el.tagName, className:el.className, text:el.innerText?.slice(0,80)||'', clientWidth:el.clientWidth, scrollWidth:el.scrollWidth}));
    const clippingElements=[...document.querySelectorAll('#print-area, #print-area *')]
      .filter(el=>{const s=getComputedStyle(el);return el.clientWidth&&['hidden','clip'].includes(s.overflowX)&&el.scrollWidth>el.clientWidth+1})
      .slice(0,100).map(el=>({tag:el.tagName,className:el.className,text:el.innerText?.slice(0,80)||'',clientWidth:el.clientWidth,scrollWidth:el.scrollWidth}));
    return {title:state.title, mode:state.mode, questionCount:state.data.length,
      solutionSourceLineCount:source.reduce((a,q)=>a+q.sourceLineCount,0),
      solutionBlankLineCount:source.reduce((a,q)=>a+q.sourceBlankLineCount,0),
      sourceQuestions:source, boxesCount:boxes.length,
      renderedQuestionHeaders, missingRenderedQuestions, unexpectedRenderedQuestions, duplicatedRenderedQuestionHeaders,
      renderer:window.__AP_RENDER_METRICS__?.renderer||null,
      continuationQuestions:source.filter(q=>q.continuation).map(q=>q.qid),
      samePageMultiFragmentQuestions:source.filter(q=>q.renderedFragmentCount>1&&!q.continuation).map(q=>q.qid),
      autoCompressQuestions:source.filter(q=>q.fragments.some(fragment=>fragment.autoCompressApplied)).map(q=>q.qid),
      autoCompressFragmentCount:fragmentRecords.filter(fragment=>fragment.autoCompressApplied).length,
      renderedPages,
      rootBounds:root ? (()=>{const r=root.getBoundingClientRect(); return {x:r.x+window.scrollX,y:r.y+window.scrollY,width:r.width,height:r.height,scrollWidth:root.scrollWidth,scrollHeight:root.scrollHeight,clientWidth:root.clientWidth}})() : null,
      rootChildStructure:root ? [...root.children].map(el=>{const r=el.getBoundingClientRect(); return {tag:el.tagName,id:el.id,className:el.className,childCount:el.children.length,text:el.innerText.slice(0,100),x:r.x+window.scrollX,y:r.y+window.scrollY,width:r.width,height:r.height}}) : [],
      imageCount:visibleImgs.length, decodedImages:visibleImgs.filter(i=>i.complete&&i.naturalWidth>0).length,
      brokenImages:visibleImgs.filter(i=>!i.complete||!i.naturalWidth),
      horizontalOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,
      overflowElements, clippingElements, fullTextLength:visibleText.length,
      unrenderedMathCount:window.APRenderLoop?.unrenderedMathCount(root)??null,
      solutionDecisionLedger:state.solutionDecisionLedger || null,
      layoutMeasurementLedger:state.layoutMeasurementLedger || null,
      fontFaces:[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight,style:f.style})),
    };
  })()`);
  metrics.inputParity = inputParity;
  metrics.inputArtifact = {path:exam.input,sha256:await sha256(path.join(reviewDir,exam.input))};

  const schoolDir = path.join(reviewDir, exam.key);
  const pageDir = path.join(schoolDir, 'pages');
  await fs.mkdir(pageDir, { recursive: true });
  const layout = await cdp.send('Page.getLayoutMetrics', {}, sessionId);
  const contentSize = layout.cssContentSize || layout.contentSize;
  const fullHeight = Math.max(viewport.height, Math.ceil(contentSize.height));
  const fullWidth = Math.max(viewport.width, Math.ceil(contentSize.width));
  try {
    const shot = await cdp.send('Page.captureScreenshot', {
      format: 'png', fromSurface: true, captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: fullWidth, height: fullHeight, scale: 1 },
    }, sessionId);
    await fs.writeFile(path.join(schoolDir, 'full-render.png'), Buffer.from(shot.data, 'base64'));
  } catch (error) {
    metrics.fullScreenshotError = String(error);
  }

  for (const page of metrics.renderedPages) {
    if (page.width <= 0 || page.height <= 0) continue;
    const x = Math.max(0, page.x - 8);
    const y = Math.max(0, page.y - 8);
    const width = Math.ceil(page.width + 16);
    const height = Math.ceil(page.height + 16);
    const shot = await cdp.send('Page.captureScreenshot', {
      format: 'png', fromSurface: true, captureBeyondViewport: true,
      clip: { x, y, width, height, scale: 1 },
    }, sessionId);
    await fs.writeFile(path.join(pageDir, `page-${String(page.index).padStart(2, '0')}.png`), Buffer.from(shot.data, 'base64'));
  }

  await cdp.send('Page.bringToFront', {}, sessionId);
  const pdf = await cdp.send('Page.printToPDF', {
    printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false,
    transferMode: 'ReturnAsBase64',
  }, sessionId);
  const pdfName = exam.key === 'after' ? 'geumdang-after-fix.pdf' : `${exam.key}.pdf`;
  const pdfPath = path.join(schoolDir, pdfName);
  await fs.writeFile(pdfPath, Buffer.from(pdf.data, 'base64'));
  metrics.actualPrintPageCount = await readPdfPageCount(pdfPath);
  metrics.capture = {
    viewport, browserZoom: 1, deviceScaleFactor: 1, cacheDisabled: true,
    freshBrowserContext: true, fontMathReady: stable, fullWidth, fullHeight,
    fullScreenshot: path.relative(reviewDir, path.join(schoolDir, 'full-render.png')).split(path.sep).join('/'),
    pageScreenshots: path.relative(reviewDir, pageDir).split(path.sep).join('/'),
    pdf: path.relative(reviewDir, pdfPath).split(path.sep).join('/'),
    pdfSha256: await sha256(pdfPath),
  };
  metrics.browserConsoleErrors = consoleErrors;
  metrics.networkLoadFailures = loadFailures;
  metrics.renderedAt = new Date().toISOString();
  await fs.writeFile(path.join(schoolDir, 'render-metrics.json'), JSON.stringify(metrics, null, 2), 'utf8');
  await cdp.send('Target.closeTarget', { targetId: target.targetId });
  await cdp.send('Target.disposeBrowserContext', { browserContextId: context.browserContextId });
  cdp.listeners.delete(listener);
  return metrics;
}

async function sha256(file) {
  const { createHash } = await import('node:crypto');
  const hash = createHash('sha256');
  hash.update(await fs.readFile(file));
  return hash.digest('hex');
}

for (const exam of exams) {
  exam.inputQuestions = await readQuestionBank(path.join(reviewDir, exam.input));
  if (exam.inputQuestions.length !== exam.expected) throw new Error(`${exam.key}: frozen input question count mismatch`);
}

const { server, port } = await startServer();
const profileDir = path.join(reviewDir, '.chrome-profile');
const chrome = await launchChrome(profileDir);
const results = [];
try {
  for (const exam of exams) {
    console.log(`Rendering ${exam.key} with ${exam.expected} questions at 1440x1100, mode=sol...`);
    const result = await renderExam(chrome.cdp, port, exam);
    console.log(JSON.stringify({ school: exam.key, questions: result.questionCount,
      boxes: result.boxesCount, lines: result.solutionSourceLineCount, blankLines: result.solutionBlankLineCount,
      pdfPages: result.actualPrintPageCount, decodedImages: result.decodedImages, brokenImages: result.brokenImages.length,
      inputParity:result.inputParity.fieldParityCounts, parityMismatches:result.inputParity.mismatches.length,
      overflow: result.horizontalOverflow, consoleErrors: result.browserConsoleErrors.length }));
    results.push(result);
  }
} finally {
  chrome.cdp.close();
  chrome.child.kill();
  await new Promise(resolve => server.close(resolve));
  await fs.rm(profileDir, { recursive: true, force: true }).catch(() => {});
}
await fs.writeFile(path.join(reviewDir, 'render-results-index.json'), JSON.stringify(results.map(result => ({
  title: result.title, mode: result.mode, questionCount: result.questionCount,
  solutionSourceLineCount: result.solutionSourceLineCount, solutionBlankLineCount: result.solutionBlankLineCount,
  inputArtifact:result.inputArtifact,inputParity:result.inputParity,
  actualPrintPageCount: result.actualPrintPageCount, capture: result.capture,
  browserConsoleErrors: result.browserConsoleErrors, networkLoadFailures: result.networkLoadFailures,
})), null, 2), 'utf8');
