import puppeteer from '@cloudflare/puppeteer';

const PDF_RENDER_REVISION = 'exam-pdf-v1-20260827';
const DEFAULT_ARCHIVE_BASE_URL = 'https://icefoxtail.github.io/AP------/archive';
const PDF_STATUS_READY = 'ready';

function cleanText(value, maxLength = 500) {
  return String(value ?? '').trim().slice(0, maxLength);
}

function normalizePdfQpp(value) {
  const parsed = Number.parseInt(value, 10);
  return [1, 2, 4, 6, 8].includes(parsed) ? parsed : 4;
}

function isMixedAssignment(assignment) {
  return String(assignment?.archive_file || '').startsWith('MIXED:');
}

async function sha256hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(value || '')));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function parseMixedPayload(assignment) {
  if (!isMixedAssignment(assignment)) return null;
  const parsed = JSON.parse(String(assignment?.mixed_payload_json || ''));
  if (!parsed || !Array.isArray(parsed.questions) || !parsed.questions.length) {
    throw new Error('MIXED 출제 스냅샷이 없습니다.');
  }
  return {
    questions: parsed.questions,
    meta: parsed.meta && typeof parsed.meta === 'object' ? parsed.meta : {}
  };
}

async function buildPdfIdentity(assignment) {
  const qpp = normalizePdfQpp(assignment?.pdf_qpp);
  const mixedPayload = isMixedAssignment(assignment) ? parseMixedPayload(assignment) : null;
  const canonical = JSON.stringify({
    revision: PDF_RENDER_REVISION,
    assignment_id: String(assignment?.id || ''),
    class_id: String(assignment?.class_id || ''),
    exam_title: String(assignment?.exam_title || ''),
    exam_date: String(assignment?.exam_date || ''),
    question_count: Number(assignment?.question_count || 0),
    subject: String(assignment?.subject || ''),
    archive_file: String(assignment?.archive_file || ''),
    qpp,
    mixed_payload: mixedPayload
  });
  const hash = await sha256hex(canonical);
  return {
    qpp,
    mixedPayload,
    hash,
    objectKey: `exam-pdfs/${PDF_RENDER_REVISION}/${hash}.pdf`
  };
}

function buildRenderUrl(env, assignment, identity) {
  const base = cleanText(env?.ARCHIVE_PUBLIC_BASE_URL || DEFAULT_ARCHIVE_BASE_URL, 500).replace(/\/+$/, '');
  const mixed = isMixedAssignment(assignment);
  const url = new URL(`${base}/${mixed ? 'mixed_engine.html' : 'engine.html'}`);
  url.searchParams.set('mode', 'exam');
  url.searchParams.set('qpp', String(identity.qpp));
  url.searchParams.set('fit', 'print');
  url.searchParams.set('submitQr', assignment.class_id ? '1' : '0');
  url.searchParams.set('solQr', '0');
  url.searchParams.set('assignmentRegistered', '1');
  url.searchParams.set('preRegistered', '1');
  if (assignment.class_id) url.searchParams.set('class', String(assignment.class_id));
  if (assignment.class_name) url.searchParams.set('className', String(assignment.class_name));
  if (assignment.teacher_name) url.searchParams.set('teacher', String(assignment.teacher_name));
  if (assignment.exam_date) url.searchParams.set('date', String(assignment.exam_date).slice(0, 10));
  if (assignment.question_count) url.searchParams.set('q', String(assignment.question_count));
  if (mixed) {
    url.searchParams.set('key', String(assignment.archive_file).slice('MIXED:'.length));
  } else {
    url.searchParams.set('data', String(assignment.archive_file || ''));
    if (assignment.exam_title) url.searchParams.set('title', String(assignment.exam_title));
    if (assignment.subject) url.searchParams.set('subject', String(assignment.subject));
  }
  return url.toString();
}

async function updatePdfState(env, assignmentId, fields) {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  await env.DB.prepare(`
    UPDATE class_exam_assignments
    SET ${keys.map(key => `${key} = ?`).join(', ')}, updated_at = DATETIME('now')
    WHERE id = ?
  `).bind(...keys.map(key => fields[key]), assignmentId).run();
}

async function renderAssignmentPdf(env, assignment, identity) {
  if (!env?.BROWSER) throw new Error('Cloudflare Browser Rendering 바인딩이 없습니다.');
  const browser = await puppeteer.launch(env.BROWSER);
  try {
    const page = await browser.newPage();
    page.on('dialog', async dialog => {
      console.warn('[exam-pdf] render dialog', JSON.stringify({ assignment_id: assignment.id, message: dialog.message() }));
      await dialog.dismiss();
    });

    if (identity.mixedPayload) {
      const storageKey = String(assignment.archive_file).slice('MIXED:'.length);
      const payloadJson = JSON.stringify(identity.mixedPayload);
      await page.evaluateOnNewDocument((key, rawPayload) => {
        const payload = JSON.parse(rawPayload);
        localStorage.setItem(`mixedQuestions_${key}`, JSON.stringify(payload.questions || []));
        localStorage.setItem(`mixedMeta_${key}`, JSON.stringify(payload.meta || {}));
      }, storageKey, payloadJson);
    }

    const renderUrl = buildRenderUrl(env, assignment, identity);
    await page.goto(renderUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForFunction(
      () => document.querySelectorAll('#print-area .page').length > 0,
      { timeout: 45000 }
    );
    await page.evaluate(async () => {
      if (window.__AP_RENDER_READY__) await window.__AP_RENDER_READY__;
      if (document.fonts?.ready) await document.fonts.ready;
      const images = Array.from(document.querySelectorAll('#print-area img'));
      await Promise.all(images.map(async image => {
        if (!image.complete) {
          await Promise.race([
            new Promise(resolve => {
              image.addEventListener('load', resolve, { once: true });
              image.addEventListener('error', resolve, { once: true });
            }),
            new Promise(resolve => setTimeout(resolve, 10000))
          ]);
        }
        if (typeof image.decode === 'function') {
          await Promise.race([
            image.decode().catch(() => {}),
            new Promise(resolve => setTimeout(resolve, 5000))
          ]);
        }
      }));
    });
    const pageCount = await page.evaluate(() => document.querySelectorAll('#print-area .page').length);
    if (!pageCount) throw new Error('렌더링된 시험지 페이지가 없습니다.');
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    return { pdf, pageCount };
  } finally {
    await browser.close();
  }
}

export async function ensureAssignmentPdf(env, assignment, options = {}) {
  if (!assignment?.id || !String(assignment.archive_file || '').trim()) return assignment;
  const classInfo = await env.DB.prepare('SELECT name, teacher_name FROM classes WHERE id = ? LIMIT 1')
    .bind(assignment.class_id).first();
  assignment = {
    ...assignment,
    class_name: classInfo?.name || assignment.class_name || '',
    teacher_name: classInfo?.teacher_name || assignment.teacher_name || ''
  };
  const identity = await buildPdfIdentity(assignment);
  const force = options.force === true;

  await updatePdfState(env, assignment.id, {
    pdf_status: 'generating',
    pdf_object_key: identity.objectKey,
    pdf_content_hash: identity.hash,
    pdf_qpp: identity.qpp,
    pdf_error: null
  });

  try {
    const existing = force ? null : await env.EXAM_PDF_BUCKET.head(identity.objectKey);
    let byteSize = Number(existing?.size || 0);
    let pageCount = Number(existing?.customMetadata?.pageCount || assignment.pdf_page_count || 0);

    if (!existing) {
      const rendered = await renderAssignmentPdf(env, assignment, identity);
      byteSize = rendered.pdf.byteLength;
      pageCount = rendered.pageCount;
      await env.EXAM_PDF_BUCKET.put(identity.objectKey, rendered.pdf, {
        httpMetadata: { contentType: 'application/pdf' },
        customMetadata: {
          contentHash: identity.hash,
          renderRevision: PDF_RENDER_REVISION,
          pageCount: String(pageCount)
        }
      });
    }

    await updatePdfState(env, assignment.id, {
      pdf_status: PDF_STATUS_READY,
      pdf_object_key: identity.objectKey,
      pdf_content_hash: identity.hash,
      pdf_byte_size: byteSize,
      pdf_page_count: pageCount,
      pdf_generated_at: new Date().toISOString(),
      pdf_error: null
    });
  } catch (error) {
    const message = cleanText(error?.message || error || 'PDF generation failed');
    console.error('[exam-pdf] generation failed', JSON.stringify({ assignment_id: assignment.id, error: message }));
    await updatePdfState(env, assignment.id, { pdf_status: 'failed', pdf_error: message });
  }

  return await env.DB.prepare('SELECT * FROM class_exam_assignments WHERE id = ? LIMIT 1')
    .bind(assignment.id).first();
}

function safeDownloadName(assignment) {
  const title = cleanText(assignment?.exam_title || '시험지', 100)
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_')
    .replace(/\s+/g, ' ')
    .trim() || '시험지';
  const date = cleanText(assignment?.exam_date || '', 10);
  return `${date ? `${date}_` : ''}${title}.pdf`;
}

export async function createAssignmentPdfDownloadResponse(env, assignment) {
  if (!assignment || assignment.pdf_status !== PDF_STATUS_READY || !assignment.pdf_object_key) {
    return Response.json({ success: false, error: 'PDF가 아직 준비되지 않았습니다.', pdf_status: assignment?.pdf_status || 'pending' }, { status: 409 });
  }
  const object = await env.EXAM_PDF_BUCKET.get(assignment.pdf_object_key);
  if (!object?.body) {
    await updatePdfState(env, assignment.id, { pdf_status: 'failed', pdf_error: 'R2 PDF object not found' });
    return Response.json({ success: false, error: '저장된 PDF를 찾을 수 없습니다.' }, { status: 404 });
  }

  const filename = safeDownloadName(assignment);
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Content-Type', 'application/pdf');
  headers.set('Content-Disposition', `attachment; filename="exam.pdf"; filename*=UTF-8''${encodeURIComponent(filename)}`);
  headers.set('Cache-Control', 'private, max-age=60');
  headers.set('ETag', object.httpEtag);
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(object.body, { headers });
}
