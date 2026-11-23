'use strict';

// Real Chrome check: the paper the teacher sees in the workspace preview (iframe)
// must have the same page structure as the output window opened by the print
// button. Both routes build the URL with the same Archive2Output helpers the
// workspace uses (archive/archive2-workspace-preview.js: outputUrl(paper, mode, preview)),
// and differ only in the preview flags (`archive2Review=1&preview=1`) and in
// being an iframe inside the page vs. a window.open() popup.
//
// Compared: number of pages and, per page, the ordered list of questions (source
// identity + printed number). Also required on both routes: render ready, no
// render error mark, no recorded render diagnostics (apRenderDiagnostics), no page
// whose content overflows its sheet. Screen-only decoration (margins, zoom
// scale) is not compared. Nothing about production data is asserted: samples are
// taken from the current real fixture and only defect conditions are checked.
//
// Local static server only; no API call leaves the machine (/api/** is stubbed).
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const H = require('./archive2-solution-loading-browser.cjs');

const root = path.resolve(__dirname, '..');
const reportDir = path.resolve(process.env.ARCHIVE_PARITY_REPORT_DIR || path.join(os.tmpdir(), 'archive-preview-print-parity'));
// Test hook (negative check): "preview:2" makes the preview route ask for a different
// number of questions per page than the print route.
const sabotage = process.env.ARCHIVE_PARITY_SABOTAGE || '';
const PREVIEW_FRAME = { width: 900, height: 820 }; // workspace preview iframe is a ~900x820 box
const PRINT_VIEWPORT = { width: 1280, height: 900 };
const report = { schema: 'ARCHIVE_PREVIEW_PRINT_PARITY_V1', rows: [] };

function requireThat(value, code, details = {}) {
  if (!value) throw Object.assign(new Error(code), { code, details });
}

// Each sample: a slice of the real 50-question fixture (image questions and the
// 서술형 questions that take a whole column are inside every slice).
const SAMPLES = [
  { name: 'exam-qpp4', mode: 'exam', qpp: 4, from: 14, to: 30 },
  { name: 'exam-qpp2', mode: 'exam', qpp: 2, from: 18, to: 28 },
  { name: 'sol-qpp4', mode: 'sol', qpp: 4, from: 0, to: 16 },
];

function readRoute() {
  // Runs inside Chrome (page or iframe). Returns only identities and counts.
  return async (routeName) => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const startedAt = Date.now();
    // __AP_RENDER_READY__ first holds a RENDER_NOT_STARTED placeholder; the real result
    // exists once the screen runtime has finished an attempt (same wait as the other Chrome checks).
    const settled = () => {
      if (window.__AP_OUTPUT_RENDER_ERROR__) return true;
      const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime;
      const attempt = runtime?.inspect().attempts.at(-1);
      if (!runtime || runtime.busy || !['SUCCEEDED', 'FAILED'].includes(attempt?.state)) return false;
      return attempt.state === 'FAILED' || Boolean(window.__AP_OUTPUT_RENDER_READY__);
    };
    while (!settled() && Date.now() - startedAt < 60000) await wait(50);
    const ready = await Promise.race([
      Promise.resolve(window.__AP_RENDER_READY__).then((result) => ({ ok: result?.ok === true, code: result?.code || null }), () => ({ ok: false, code: 'READY_REJECTED' })),
      wait(60000).then(() => ({ ok: false, code: 'READY_TIMEOUT' })),
    ]);
    const area = document.getElementById('print-area');
    const sheets = [...(area?.querySelectorAll('.page') || [])];
    const blockSelector = '.q-box,.ans-cell:not(.ans-cell-empty)';
    const pages = sheets.map((sheet) => [...sheet.querySelectorAll(blockSelector)].map((block) => ({
      ref: block.dataset.sourceRef || '',
      no: (block.querySelector('.q-num,.q-n,.qn,.ans-n')?.textContent || '').trim(),
    })));
    return {
      route: routeName,
      mode: new URLSearchParams(location.search).get('mode'),
      qppParam: new URLSearchParams(location.search).get('qpp'),
      ready,
      renderErrorMark: Boolean(window.__AP_OUTPUT_RENDER_ERROR__ || document.documentElement.dataset.apRenderError),
      diagnostics: Array.isArray(window.apRenderDiagnostics) ? window.apRenderDiagnostics.length : null,
      diagnosticsMark: document.documentElement.dataset.apRenderDiagnostics ?? null,
      overflowedPages: sheets.filter((sheet) => sheet.scrollHeight > sheet.clientHeight + 3 || sheet.scrollWidth > sheet.clientWidth + 3).length,
      pageCount: sheets.length,
      pages,
    };
  };
}

async function main() {
  const chrome = process.env.CHROME_BIN;
  requireThat(chrome && fs.existsSync(chrome), 'REAL_CHROME_BIN_REQUIRED');
  const fixture = H.realFixture(root);
  requireThat(fixture.length >= 30, 'REAL_FIXTURE_TOO_SMALL', { questions: fixture.length });
  requireThat(fixture.slice(14, 30).some((q) => q.image) && fixture.slice(14, 30).some((q) => q.questionType === '서술형'),
    'SAMPLE_LACKS_FIGURE_OR_ESSAY');

  const { chromium } = require('playwright');
  const server = await H.serve(root);
  const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    for (const sample of SAMPLES) {
      const questions = fixture.slice(sample.from, sample.to);
      const row = { name: sample.name, mode: sample.mode, qpp: sample.qpp, questions: questions.length, routes: {} };
      report.rows.push(row);
      const context = await browser.newContext({ viewport: PRINT_VIEWPORT, serviceWorkers: 'block' });
      try {
        await context.route('**/api/**', (route) => route.fulfill({ contentType: 'application/json', body: '{"success":true}' }));
        const errors = [];
        const opener = await context.newPage();
        opener.on('pageerror', (error) => errors.push(String(error.message).slice(0, 120)));
        await opener.goto(`${server.origin}/__loading/seed.html`, { waitUntil: 'domcontentloaded' });
        await opener.addScriptTag({ url: `${server.origin}/archive/archive2-output-contract.js` });
        await opener.addScriptTag({ url: `${server.origin}/archive/archive2-output.js` });

        // Same call shape as the workspace: envelope per route, URL from outputEnvelopeUrl.
        const urlFor = (preview, qpp) => opener.evaluate(async ({ questions, mode, qpp, preview }) => {
          const questionUids = questions.map((q) => q.questionUid || q.source_question_uid || q._sourceQuestionUid || null);
          const meta = { title: '미리보기 인쇄 쪽 구성 검증', qpp, includeQr: false, questionUids,
            printHeaderOptions: { title: '미리보기 인쇄 쪽 구성 검증' } };
          const envelope = await window.Archive2Output.publishOutputEnvelope({ sourceKind: 'archive2-compose',
            sourceId: 'preview-print-parity', mode, questionCount: questions.length, questionUids, meta, questions });
          const url = window.Archive2Output.outputEnvelopeUrl('mixed_engine.html',
            new URL('/archive/workspace.html', location.href).href, envelope, { studio: true, preview });
          url.searchParams.set('assetBase', 'off'); // local images only; same for both routes
          return url.href;
        }, { questions, mode: sample.mode, qpp, preview });

        // (a) preview route: iframe inside a same-origin host page.
        const previewQpp = sabotage === 'preview:2' ? 2 : sample.qpp;
        const previewUrl = await urlFor(true, previewQpp);
        await opener.evaluate(({ src, size }) => {
          const frame = document.createElement('iframe');
          frame.id = 'preview';
          frame.style.cssText = `width:${size.width}px;height:${size.height}px;border:0`;
          frame.src = src;
          document.body.append(frame);
        }, { src: previewUrl, size: PREVIEW_FRAME });
        const frameHandle = await opener.waitForSelector('#preview');
        const frame = await frameHandle.contentFrame();
        row.routes.preview = await frame.evaluate(readRoute(), 'preview');
        row.routes.preview.url = new URL(previewUrl).search.replace(/(outputRequestId|outputOwnerId)=[^&]+/g, '$1=…');

        // (b) print route: window.open('about:blank') then location.href, as printOnce() does.
        const printUrl = await urlFor(false, sample.qpp);
        const [popup] = await Promise.all([
          context.waitForEvent('page'),
          opener.evaluate((url) => { const win = window.open('about:blank', '_blank'); win.location.href = url; }, printUrl),
        ]);
        popup.on('pageerror', (error) => errors.push(String(error.message).slice(0, 120)));
        await popup.waitForURL('**/mixed_engine.html*', { waitUntil: 'domcontentloaded' });
        row.routes.print = await popup.evaluate(readRoute(), 'print');
        row.routes.print.url = new URL(printUrl).search.replace(/(outputRequestId|outputOwnerId)=[^&]+/g, '$1=…');

        // Checks.
        const { preview, print } = row.routes;
        const problems = [];
        for (const route of [preview, print]) {
          if (!route.ready.ok) problems.push(`${route.route}: 렌더 준비 실패 ${route.ready.code}`);
          if (route.renderErrorMark) problems.push(`${route.route}: 렌더 오류 표식`);
          if (route.diagnostics) problems.push(`${route.route}: 렌더 진단 ${route.diagnostics}건`);
          if (route.overflowedPages) problems.push(`${route.route}: 칸 밖으로 넘친 쪽 ${route.overflowedPages}`);
          if (route.pageCount === 0) problems.push(`${route.route}: 쪽 없음`);
          const refs = route.pages.flat().map((block) => block.ref);
          if (refs.length !== questions.length || new Set(refs).size !== questions.length) problems.push(`${route.route}: 문항 수 ${refs.length}/${questions.length}`);
        }
        if (preview.pageCount !== print.pageCount) problems.push(`쪽 수 다름: 미리보기 ${preview.pageCount} / 인쇄 ${print.pageCount}`);
        const perPage = (route) => route.pages.map((blocks) => blocks.map((block) => `${block.no || '?'}:${block.ref.split(':').pop()}`).join(','));
        const a = perPage(preview), b = perPage(print);
        for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
          if (a[index] !== b[index]) problems.push(`${index + 1}쪽 문항 다름: 미리보기 [${a[index] ?? '없음'}] / 인쇄 [${b[index] ?? '없음'}]`);
        }
        if (errors.length) problems.push(`브라우저 오류 ${errors.length}건`);
        row.problems = problems;
        row.pass = problems.length === 0;
        console.log(JSON.stringify({ sample: sample.name, pass: row.pass, pages: [preview.pageCount, print.pageCount], questions: questions.length, problems }));
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
    await server.close();
  }
  report.pass = report.rows.every((row) => row.pass);
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'preview-print-parity.json'), JSON.stringify(report, null, 2));
  if (!report.pass) {
    console.error('PREVIEW_PRINT_PARITY_FAILED');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(JSON.stringify({ pass: false, code: error.code || error.message, details: error.details || null }));
  process.exitCode = 1;
});
