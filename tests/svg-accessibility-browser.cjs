const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { chromium } = require('playwright');
const { collectSvgAccessibilitySourceIndex } = require('../archive/tools/collect-svg-accessibility-source-index.cjs');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'archive/data/svg-accessibility-manifest.v1.json');
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.css': 'text/css' };

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function gitBlobSha(bytes) {
  const header = Buffer.from(`blob ${bytes.length}\0`, 'utf8');
  return crypto.createHash('sha1').update(Buffer.concat([header, bytes])).digest('hex');
}

function watchRuntimeResources(page) {
  const rows = [];
  const pending = [];
  page.on('response', response => {
    const task = (async () => {
      let url;
      try { url = new URL(response.url()); } catch (_) { return; }
      if (url.origin !== new URL(page.url()).origin && page.url() !== 'about:blank') return;
      const localPath = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      if (![
        'archive/engine.html',
        'archive/mixed_engine.html',
        'archive/data/svg-accessibility-index.js',
        'archive/svg-accessibility.js',
        'archive/render-authority.js'
      ].includes(localPath) && !localPath.startsWith('archive/assets/')) return;
      const body = await response.body().catch(() => null);
      if (!body) return;
      const filePath = path.resolve(root, localPath);
      const localExists = filePath.startsWith(root + path.sep) && fs.existsSync(filePath) && fs.statSync(filePath).isFile();
      const localBytes = localExists ? fs.readFileSync(filePath) : null;
      rows.push({
        localPath,
        url: response.url(),
        status: response.status(),
        contentType: response.headers()['content-type'] || '',
        responseSha256: sha256(body),
        responseGitBlobSha: gitBlobSha(body),
        localSha256: localBytes ? sha256(localBytes) : '',
        localGitBlobSha: localBytes ? gitBlobSha(localBytes) : '',
        matchesLocalBytes: !!localBytes && body.equals(localBytes)
      });
    })();
    pending.push(task);
  });
  return async function collect(assetRef, enginePath, record) {
    await Promise.all(pending);
    const requiredPaths = [
      enginePath,
      'archive/data/svg-accessibility-index.js',
      'archive/svg-accessibility.js',
      'archive/render-authority.js',
      `archive/${assetRef}`
    ];
    const loaded = rows.filter(row => requiredPaths.includes(row.localPath));
    for (const requiredPath of requiredPaths) {
      const witness = loaded.find(row => row.localPath === requiredPath && row.status === 200 && row.matchesLocalBytes);
      if (!witness) throw new Error(`RUNTIME_RESOURCE_SHA_WITNESS_MISSING:${requiredPath}:${JSON.stringify(loaded)}`);
    }
    const svgWitness = loaded.find(row => row.localPath === `archive/${assetRef}`);
    if (svgWitness.responseSha256 !== record.svgSha256.replace(/^sha256:/, '') || svgWitness.responseGitBlobSha !== record.gitBlobSha) {
      throw new Error(`RUNTIME_SVG_MANIFEST_HASH_MISMATCH:${assetRef}:${JSON.stringify({ recordSha256: record.svgSha256, recordGitBlobSha: record.gitBlobSha, svgWitness })}`);
    }
    return loaded;
  };
}

function candidateForRole(manifest, role) {
  return manifest.records.find(record => {
    if (record.visualRole !== role || record.provenanceStatus !== 'SOURCE_BOUND' || !record.sourceExamRef || !record.sourceQid) return false;
    if (role === 'problem' && record.answerHintFree !== true) return false;
    if (!record.sourceExamRef.startsWith('archive/exams/') || !fs.existsSync(path.join(root, record.sourceExamRef))) return false;
    const dataPath = record.sourceExamRef.replace(/^archive\//, '');
    if (!/^exams\/[a-zA-Z0-9가-힣_\-./]+\.js$/.test(dataPath)) return false;
    return fs.existsSync(path.join(root, 'archive', record.assetRef));
  });
}

async function inspectAccessibleImage(page, assetRef, field, waitReady, record) {
  await page.waitForFunction(({ assetRef, waitReady }) => {
    if (waitReady && !(window.__AP_RENDER_READY__ || window.__AP_OUTPUT_RENDER_READY__)) return false;
    return Array.from(document.querySelectorAll('.q-image-wrap img, .sol-image-wrap img')).some(image => {
      try {
        const pathname = decodeURIComponent(new URL(image.src, location.href).pathname);
        const style = getComputedStyle(image);
        return (pathname.endsWith('/archive/' + assetRef) || pathname.endsWith('/' + assetRef)) && style.display !== 'none' && style.visibility !== 'hidden' && image.getClientRects().length > 0 && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
      } catch (_) { return false; }
    });
  }, { assetRef, waitReady }, { timeout: 90000 });
  const image = await page.evaluate(({ assetRef, field }) => {
    const matching = Array.from(document.querySelectorAll('.q-image-wrap img, .sol-image-wrap img')).filter(image => {
      try {
        const pathname = decodeURIComponent(new URL(image.src, location.href).pathname);
        return pathname.endsWith('/archive/' + assetRef) || pathname.endsWith('/' + assetRef);
      } catch (_) { return false; }
    });
    const candidate = matching.find(image => {
      const style = getComputedStyle(image);
      return style.display !== 'none' && style.visibility !== 'hidden' && image.getClientRects().length > 0;
    }) || matching[0];
    if (!candidate) return null;
    return {
      field,
      src: candidate.currentSrc || candidate.src,
      alt: candidate.alt,
      naturalWidth: candidate.naturalWidth,
      naturalHeight: candidate.naturalHeight,
    };
  }, { assetRef, field });
  if (!image || !image.alt || !/[가-힣]/.test(image.alt)) throw new Error(`MISSING_KOREAN_ACCESSIBLE_NAME:${field}:${assetRef}:${JSON.stringify(image)}`);
  if (!record?.descriptionKo || !image.alt.includes(record.descriptionKo)) {
    throw new Error(`CURATED_RELATION_DESCRIPTION_NOT_EXPOSED:${field}:${assetRef}:${JSON.stringify({ alt: image?.alt || '', descriptionKo: record?.descriptionKo || '' })}`);
  }
  if (!(image.naturalWidth > 0 && image.naturalHeight > 0)) throw new Error(`SVG_IMAGE_NOT_RENDERED:${field}:${assetRef}:${JSON.stringify(image)}`);
  const roleCount = await page.getByRole('img', { name: image.alt, exact: true }).count();
  const client = await page.context().newCDPSession(page);
  await client.send('Accessibility.enable');
  const tree = await client.send('Accessibility.getFullAXTree');
  const matchingNodes = tree.nodes.filter(node => node.role?.value === 'image' && node.name?.value === image.alt);
  const imageNode = matchingNodes.find(node => node.ignored !== true) || matchingNodes[0];
  const axEvidence = imageNode ? {
    role: imageNode.role.value,
    name: imageNode.name?.value || '',
    ignored: imageNode.ignored === true,
    ignoredReasons: imageNode.ignoredReasons || []
  } : null;
  await client.detach();
  if (!axEvidence || axEvidence.ignored || axEvidence.name !== image.alt) {
    const treeCount = tree.nodes.length;
    const imageNodeSamples = tree.nodes.filter(node => node.role?.value === 'image').slice(0, 5).map(node => ({ name: node.name?.value, ignored: node.ignored === true, ignoredReasons: node.ignoredReasons }));
    throw new Error(`CHROME_ACCESSIBLE_NAME_MISSING:${field}:${assetRef}:${JSON.stringify({ image, roleCount, axEvidence, treeCount, imageNodeSamples })}`);
  }
  return { ...image, playwrightRoleLocatorCount: roleCount, chromeAX: axEvidence };
}

function server() {
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const filePath = path.resolve(root, `.${pathname}`);
    if (!filePath.startsWith(root + path.sep) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      response.writeHead(404); response.end(); return;
    }
    response.setHeader('Content-Type', mimeTypes[path.extname(filePath)] || 'application/octet-stream');
    fs.createReadStream(filePath).pipe(response);
  });
}

(async () => {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const sourceIndexBytes = Buffer.from(JSON.stringify(collectSvgAccessibilitySourceIndex({ repoRoot: root })));
  if (manifest.schemaVersion !== 'SVG_STUDENT_ACCESSIBILITY_V1') throw new Error('INVALID_SVG_ACCESSIBILITY_MANIFEST_SCHEMA');
  const problem = candidateForRole(manifest, 'problem');
  const solution = candidateForRole(manifest, 'solution');
  if (!problem || !solution) throw new Error('BROWSER_QA_NEEDS_REFERENCED_PROBLEM_AND_SOLUTION_RECORDS');

  const httpServer = server();
  await new Promise(resolve => httpServer.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${httpServer.address().port}`;
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const evidence = {
    schemaVersion: 'SVG_ACCESSIBILITY_CHROME_QA_V1',
    browser: 'Google Chrome',
    manifestSha256: sha256(fs.readFileSync(manifestPath)),
    sourceIndexSha256: `sha256:${sha256(sourceIndexBytes)}`,
    compiledIndexSha256: sha256(fs.readFileSync(path.join(root, 'archive/data/svg-accessibility-index.js'))),
    runs: []
  };
  try {
    for (const record of [problem, solution]) {
      const original = await browser.newPage();
      const collectResources = watchRuntimeResources(original);
      const mode = record.visualRole === 'problem' ? 'exam' : 'sol';
      const dataPath = record.sourceExamRef.replace(/^archive\//, '');
      const url = `${base}/archive/engine.html?data=${encodeURIComponent(dataPath)}&mode=${mode}&prewarm=0&snapshotCache=0&printDryRun=1&svgAccessibilityQa=1`;
      await original.goto(url, { waitUntil: 'domcontentloaded' });
      const result = await inspectAccessibleImage(original, record.assetRef, record.visualRole === 'problem' ? 'image' : 'solutionImage', true, record);
      const resources = await collectResources(record.assetRef, 'archive/engine.html', record);
      evidence.runs.push({ engine: 'archive/engine.html', mode, assetRef: record.assetRef, svgSha256: record.svgSha256, gitBlobSha: record.gitBlobSha, sourceExamRef: record.sourceExamRef, sourceQid: record.sourceQid, loadedResources: resources, ...result });
      await original.close();
    }

    for (const record of [problem, solution]) {
      const mixed = await browser.newPage();
      const collectResources = watchRuntimeResources(mixed);
      const mode = record.visualRole === 'problem' ? 'exam' : 'sol';
      const key = `svg-a11y-${record.visualRole}-${Date.now()}`;
      const imageQuestion = {
        id: Number(record.sourceQid) || 1,
        sourceArchiveFile: 'tests/fixtures/svg-accessibility-runtime.js',
        _sourceFile: 'tests/fixtures/svg-accessibility-runtime.js',
        sourceOrdinal: Number(record.sourceQid) || 1,
        _sourceQuestionOrdinal: Number(record.sourceQid) || 1,
        sourceQuestionNo: Number(record.sourceQid) || 1,
        _sourceQuestionNo: Number(record.sourceQid) || 1,
        sourceQuestionUid: `svg-a11y-${record.visualRole}`,
        _sourceQuestionUid: `svg-a11y-${record.visualRole}`,
        content: '그림의 점과 선의 위치 관계를 확인하시오.',
        choices: [], answer: '1', solution: '그림에서 표시한 점과 선의 관계를 확인한다.'
      };
      if (record.visualRole === 'problem') imageQuestion.image = record.assetRef;
      else {
        imageQuestion.solutionImage = record.assetRef;
        imageQuestion.solutionImageAlt = `문항 ${imageQuestion.id} 해설 그래프`;
      }
      await mixed.addInitScript(({ key, question }) => {
        localStorage.setItem(`mixedQuestions_${key}`, JSON.stringify([question]));
        localStorage.setItem(`mixedMeta_${key}`, JSON.stringify({ title: '접근성 확인', count: 1, qpp: 4, printHeaderOptions: {} }));
      }, { key, question: imageQuestion });
      await mixed.goto(`${base}/archive/mixed_engine.html?key=${encodeURIComponent(key)}&qpp=4&mode=${mode}&fit=screen&renderAuthorityDualRun=1&svgAccessibilityQa=1`, { waitUntil: 'domcontentloaded' });
      const result = await inspectAccessibleImage(mixed, record.assetRef, record.visualRole === 'problem' ? 'image' : 'solutionImage', true, record);
      const resources = await collectResources(record.assetRef, 'archive/mixed_engine.html', record);
      evidence.runs.push({ engine: 'archive/mixed_engine.html', mode, assetRef: record.assetRef, svgSha256: record.svgSha256, gitBlobSha: record.gitBlobSha, loadedResources: resources, ...result });
      await mixed.close();
    }
  } finally {
    await browser.close();
    httpServer.close();
  }
  process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`);
})().catch(error => {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
