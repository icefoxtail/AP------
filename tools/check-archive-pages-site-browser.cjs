'use strict';

const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const mimeTypes = {
  '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};

function option(args, name, fallback) {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
}

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium',
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function createServer(siteRoot, basePath) {
  const root = fs.realpathSync(siteRoot);
  return http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!pathname.startsWith(basePath)) {
        response.writeHead(404); response.end('Not Found'); return;
      }
      let relative = pathname.slice(basePath.length);
      if (!relative || relative.endsWith('/')) relative += 'index.html';
      const file = path.resolve(root, ...relative.split('/'));
      const rel = path.relative(root, file);
      if (!rel || rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel) ||
          !fs.existsSync(file) || !fs.statSync(file).isFile()) {
        response.writeHead(404); response.end('Not Found'); return;
      }
      response.writeHead(200, {
        'Content-Type': `${mimeTypes[path.extname(file).toLowerCase()] || 'application/octet-stream'}; charset=utf-8`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      fs.createReadStream(file).pipe(response);
    } catch (error) {
      response.writeHead(500); response.end(String(error.message || error));
    }
  });
}

async function main() {
  const args = process.argv.slice(2);
  const siteRoot = path.resolve(option(args, '--site-root', path.join(repoRoot, '_site')));
  const basePath = option(args, '--base-path', '/AP------/');
  if (!basePath.startsWith('/') || !basePath.endsWith('/') || basePath.includes('..'))
    throw new Error('base path must be an absolute URL path ending in /');
  if (!fs.existsSync(path.join(siteRoot, 'index.html')))
    throw new Error(`Staged site index is missing: ${siteRoot}`);
  const chrome = findChrome();
  if (!chrome) throw new Error('Google Chrome is unavailable; Pages browser smoke cannot pass');

  const server = createServer(siteRoot, basePath);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const tempProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-pages-chrome-'));
  const browser = spawn(chrome, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    '--disable-background-networking', '--no-first-run', '--remote-allow-origins=*',
    '--remote-debugging-port=0', `--user-data-dir=${tempProfile}`, 'about:blank',
  ], { stdio: 'ignore' });
  let socket;
  try {
    let devtoolsPort = 0;
    for (let attempt = 0; attempt < 150; attempt += 1) {
      if (browser.exitCode !== null) throw new Error(`Chrome exited with code ${browser.exitCode}`);
      const portFile = path.join(tempProfile, 'DevToolsActivePort');
      if (fs.existsSync(portFile)) {
        devtoolsPort = Number(fs.readFileSync(portFile, 'utf8').split('\n')[0]);
        break;
      }
      await sleep(100);
    }
    if (!devtoolsPort) throw new Error('Chrome remote debugging port did not start');
    const targets = await (await fetch(`http://127.0.0.1:${devtoolsPort}/json/list`)).json();
    const target = targets.find((item) => item.type === 'page');
    if (!target) throw new Error('Chrome page target is missing');
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      socket.addEventListener('open', resolve, { once: true });
      socket.addEventListener('error', reject, { once: true });
    });
    let commandId = 0;
    const pending = new Map();
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      message.error ? waiter.reject(new Error(JSON.stringify(message.error))) : waiter.resolve(message.result);
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++commandId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
    const evaluate = async (expression) => {
      const result = await send('Runtime.evaluate', {
        expression, returnByValue: true, awaitPromise: true, userGesture: true,
      });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    const waitFor = async (expression, label) => {
      for (let attempt = 0; attempt < 300; attempt += 1) {
        try { if (await evaluate(expression)) return; } catch (error) {
          if (attempt > 290) throw error;
        }
        await sleep(100);
      }
      throw new Error(`Timed out waiting for ${label}`);
    };

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Page.addScriptToEvaluateOnNewDocument', { source: `(()=>{
      window.__pagesSmokeScriptErrors=[];
      window.addEventListener('error',event=>{
        if(event.target&&event.target.tagName==='SCRIPT')window.__pagesSmokeScriptErrors.push(event.target.src||event.target.textContent||'inline script');
      },true);
      const nativeFetch=window.fetch.bind(window);
      window.fetch=(input,init={})=>{
        const request=input instanceof Request?input:null;
        const url=new URL(request?.url||String(input),location.href);
        const method=String(init.method||request?.method||'GET').toUpperCase();
        if(url.hostname.includes('workers.dev')||url.pathname.includes('/api/')){
          if(method!=='GET'&&method!=='HEAD')return Promise.reject(new Error('Pages smoke blocked a non-read-only API request'));
          return Promise.resolve(new Response(JSON.stringify({success:true,data:[],students:[],assignments:[],records:[]}),{status:200,headers:{'Content-Type':'application/json'}}));
        }
        return nativeFetch(input,init);
      };
      window.print=()=>{window.__pagesSmokePrintCount=(window.__pagesSmokePrintCount||0)+1;};
    })();` });
    await send('Page.navigate', { url: `http://127.0.0.1:${port}${basePath}` });
    await waitFor("document.querySelector('a[href=\\\"apmath-home/\\\"]') && document.title", 'the public hub under the project base path');
    const hub = await evaluate("({title:document.title,apmath:!!document.querySelector('a[href=\\\"apmath-home/\\\"]'),eie:!!document.querySelector('a[href=\\\"eie-home/\\\"]'),cmath:!!document.querySelector('a[href=\\\"cmath-home/\\\"]')})");
    if (!hub.apmath || !hub.eie || !hub.cmath) throw new Error(`Hub links did not load: ${JSON.stringify(hub)}`);

    const frontendRoutes = [
      ['apmath-home/index.html', 'AP Math public site', 'main'],
      ['eie-home/index.html', 'EIE public site', 'main'],
      ['cmath-home/index.html', 'Cmath public site', 'main'],
      ['apmath/index.html', 'APMS application entry', 'main#app-root'],
      ['eie/index.html', 'EIE application entry', 'main#eie-app'],
      ['archive/index.html', 'Archive legacy entry', 'body'],
    ];
    const frontendChecks = [];
    for (const [route, label, selector] of frontendRoutes) {
      await send('Page.navigate', { url: `http://127.0.0.1:${port}${basePath}${route}` });
      await waitFor(`document.readyState==='complete'&&document.querySelector(${JSON.stringify(selector)})`, label);
      const result = await evaluate(`({title:document.title,failedScripts:window.__pagesSmokeScriptErrors||[],target:!!document.querySelector(${JSON.stringify(selector)})})`);
      if (!result.target || result.failedScripts.length)
        throw new Error(`${label} did not load all local runtime scripts: ${JSON.stringify(result)}`);
      frontendChecks.push({ route, title: result.title, scripts: 'loaded' });
    }

    const archiveWorkspace = `http://127.0.0.1:${port}${basePath}archive/workspace.html?view=home`;
    await send('Page.navigate', { url: archiveWorkspace });
    await waitFor('window.Archive2Canonical && window.Archive2Canonical.loadInputBundle', 'Archive 2.0 runtime modules');
    const canonical = await evaluate(`(async()=>{
      const bundle = await window.Archive2Canonical.loadInputBundle((url)=>fetch(url,{cache:'no-cache'}), document.baseURI);
      const sourceIndexResponse = await fetch(new URL('data/archive2-source-verification-index.json', document.baseURI));
      if (!sourceIndexResponse.ok) throw new Error('source verification index HTTP '+sourceIndexResponse.status);
      const sourceIndex = await sourceIndexResponse.json();
      // The shard path is derived from the source file (prefix + sha256(sourceFile) + ".json").
      const firstSource = sourceIndex.files?.[0];
      let shardPath = firstSource?.path;
      if (!shardPath && firstSource?.sourceFile) {
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(firstSource.sourceFile));
        shardPath = 'data/archive2-source-verification/v1/' + Array.from(new Uint8Array(digest), (v) => v.toString(16).padStart(2, '0')).join('') + '.json';
      }
      const shardResponse = shardPath ? await fetch(new URL(shardPath, document.baseURI)) : null;
      const consumerResponse = await fetch(new URL('data/generated-lite-consumer/v1/index.json', document.baseURI));
      if (!consumerResponse.ok) throw new Error('generated consumer index HTTP '+consumerResponse.status);
      const consumerIndex = await consumerResponse.json();
      const consumerShardPath = consumerIndex.records?.find(row=>row.shard)?.shard;
      const consumerShard = consumerShardPath ? await fetch(new URL(consumerShardPath, document.baseURI)) : null;
      return {
        canonicalProjectionVersion: bundle.projectionVersion,
        canonicalMasterRecords: bundle.resources[window.Archive2Canonical.CANONICAL_MASTER_PATH]?.records?.length || 0,
        sourceShardCount: sourceIndex.files?.length || 0,
        sourceShardStatus: shardResponse?.status || 0,
        generatedConsumerRows: consumerIndex.recordCount || consumerIndex.records?.length || 0,
        generatedShardStatus: consumerShard?.status || 0,
      };
    })()`);
    if (!canonical.canonicalProjectionVersion || canonical.canonicalMasterRecords < 1 ||
        canonical.sourceShardCount < 1 || canonical.sourceShardStatus !== 200 ||
        canonical.generatedConsumerRows < 1 || canonical.generatedShardStatus !== 200)
      throw new Error(`Runtime file closure failed under the Pages base path: ${JSON.stringify(canonical)}`);

    const sourceFile = 'original/high/h2/1final/22_매산고_1학기_기말_고2_기하_기출.js';
    const archive1Modes = [];
    for (const mode of ['exam', 'sol', 'ans']) {
      const params = new URLSearchParams({ data: `exams/${sourceFile}`, mode });
      await send('Page.navigate', { url: `http://127.0.0.1:${port}${basePath}archive/engine.html?${params}` });
      await waitFor(`typeof AppState!=='undefined'&&AppState.mode===${JSON.stringify(mode)}&&AppState.data.length>0&&JSON.parse(document.documentElement.dataset.apPrintReadiness||'{}').state==='RENDER_READY'`, `Archive 1 ${mode} original exam render`);
      const rendered = await evaluate(`(async()=>{const result=await window.__AP_RENDER_READY__;const images=[...document.querySelectorAll('#print-area img')].map(image=>({loaded:image.complete&&image.naturalWidth>0,width:image.naturalWidth}));return {mode:AppState.mode,questions:AppState.data.length,pages:document.querySelectorAll('#print-area .page').length,render:result,images};})()`);
      if (rendered.mode !== mode || rendered.questions < 1 || rendered.pages < 1 || rendered.render?.ok !== true || rendered.images.some((image) => !image.loaded))
        throw new Error(`Archive 1 ${mode} render or image asset failed: ${JSON.stringify(rendered)}`);
      archive1Modes.push({ mode: rendered.mode, questions: rendered.questions, pages: rendered.pages, images: rendered.images.length });
    }

    console.log('ARCHIVE_PAGES_SITE_CHROME_PASS ' + JSON.stringify({
      basePath, hub, frontendChecks, canonicalProjectionVersion: canonical.canonicalProjectionVersion,
      canonicalMasterRecords: canonical.canonicalMasterRecords,
      sourceVerificationShards: canonical.sourceShardCount,
      sourceShardStatus: canonical.sourceShardStatus,
      generatedConsumerRows: canonical.generatedConsumerRows,
      generatedShardStatus: canonical.generatedShardStatus,
      archive1Modes,
      apiMode: 'in-memory GET fixtures; non-read-only methods rejected',
      liveApiIntegration: false,
      readOnly: true,
    }));
  } finally {
    if (socket) socket.close();
    browser.kill('SIGTERM');
    await new Promise((resolve) => server.close(resolve));
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch { /* best-effort Chrome profile cleanup */ }
  }
}

main().catch((error) => {
  console.error('ARCHIVE_PAGES_SITE_CHROME_FAIL', error);
  process.exitCode = 1;
});
