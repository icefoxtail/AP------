// Real fixed-viewport PNGs complement legacy full-page references. Scrolling
// does not resize the viewport, change production CSS, or stitch image pixels.
import path from 'node:path';
import { sha256 } from './high-evidence-binding.mjs';

export const CONTENT_COVERAGE_POLICY = 'SAME_STATE_VISIBLE_DOCUMENT_REGIONS';

export function readReviewFrame() {
  const rectOf = el => {
    const r = el?.getBoundingClientRect();
    return r ? { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, bottom: r.bottom, left: r.left, right: r.right } : null;
  };
  const canvas = rectOf(lab.board.canvas);
  const question = lab.refs.problemText?.cloneNode(true);
  question?.querySelectorAll('button').forEach(b => b.remove());
  const steps = typeof lab.scene.steps === 'function' ? lab.scene.steps(lab.s, lab) : lab.scene.steps;
  const occluders = [...document.querySelectorAll('.apl-bar,.apl-rail,.apl-stage,.apl-tabs')].filter(el => {
    const r = el.getBoundingClientRect(), style = getComputedStyle(el), stickyTop = parseFloat(style.top);
    // A sticky element still in normal document flow does not cover content
    // before it. Count it only after it reaches its actual CSS sticking edge.
    const pinned = style.position === 'fixed' || style.position === 'sticky' && Number.isFinite(stickyTop) && r.top <= stickyTop + 1;
    return el.checkVisibility() && pinned && r.top < innerHeight && r.bottom > 0;
  }).map(el => ({ selector: el.className, rect: rectOf(el) }));
  const blockedTop = Math.max(0, ...occluders.map(o => Math.min(innerHeight, o.rect.bottom)));
  const region = (name, el) => {
    const rect = rectOf(el), present = !!el?.checkVisibility() && !!rect && rect.width > 0 && rect.height > 0;
    if (!present) return { name, present: false, rect };
    const top = Math.max(rect.top, blockedTop, 0), bottom = Math.min(rect.bottom, innerHeight);
    const horizontal = rect.left >= -1 && rect.right <= innerWidth + 1;
    return { name, present, rect, documentRect: { top: rect.top + scrollY, bottom: rect.bottom + scrollY, left: rect.left + scrollX, right: rect.right + scrollX },
      visibleDocumentRange: horizontal && bottom > top ? { top: top + scrollY, bottom: bottom + scrollY } : null,
      horizontal, text: el.textContent.replace(/\s+/g, ' ').trim() };
  };
  return {
    sceneId: String(lab.scene.id), tab: lab.tab, step: lab.s.step, steps: steps?.length || 0,
    revealed: !!lab.s.revealed, answerOpen: !!lab.refs.answer?.classList.contains('open'), answerPresent: !!lab.refs.answer?.querySelector('.val')?.textContent.trim(),
    parameters: Object.fromEntries(Object.entries(lab.s).filter(([, v]) => v === null || ['number', 'boolean', 'string'].includes(typeof v))),
    canvas, viewport: { width: innerWidth, height: innerHeight }, scroll: { x: scrollX, y: scrollY },
    scrollMax: Math.max(0, document.documentElement.scrollHeight - innerHeight), blockedTop, occluders,
    fonts: document.fonts.status, question: question?.textContent.replace(/\s+/g, ' ').trim() || '',
    regions: [region('question', lab.refs.problemText), region('answer', lab.refs.answer), region('review', document.querySelector('#apl-pane-review')), region('panel', document.querySelector('.apl-panel-inner'))]
  };
}

export async function readBoundReviewFrame(page) {
  const frame = await page.evaluate(readReviewFrame);
  frame.questionSha256 = sha256(frame.question); frame.questionPresent = !!frame.question; delete frame.question;
  for (const r of frame.regions) if (r.present) { r.textSha256 = sha256(r.text); delete r.text; }
  return frame;
}

export const requiredViewportRegions = frame => frame.tab === 'problem' ? ['question', ...(frame.answerOpen ? ['answer'] : [])] : frame.tab === 'review' ? ['review'] : ['panel'];
const modelSignature = p => p && typeof p === 'object' ? JSON.stringify(Object.entries(p).sort(([a], [b]) => a.localeCompare(b))) : null;
const sameState = (a, b) => ['sceneId', 'tab', 'step', 'questionSha256', 'answerOpen', 'revealed'].every(k => a?.[k] === b?.[k]) && a?.viewport?.width === b?.viewport?.width && a?.viewport?.height === b?.viewport?.height && modelSignature(a?.parameters) !== null && modelSignature(a?.parameters) === modelSignature(b?.parameters);
const finiteRect = r => r && ['top', 'bottom', 'left', 'right', 'width', 'height', 'x', 'y'].every(k => Number.isFinite(r[k])) && r.width > 0 && r.height > 0 && Math.abs(r.right - r.left - r.width) <= 1 && Math.abs(r.bottom - r.top - r.height) <= 1 && Math.abs(r.x - r.left) <= 1 && Math.abs(r.y - r.top) <= 1;
const validDocumentRect = (r, frame) => finiteRect(r?.rect) && ['top', 'bottom', 'left', 'right'].every(k => Number.isFinite(r.documentRect?.[k])) && ['top', 'bottom'].every(k => Math.abs(r.documentRect[k] - r.rect[k] - frame.scroll?.y) <= 1) && ['left', 'right'].every(k => Math.abs(r.documentRect[k] - r.rect[k] - frame.scroll?.x) <= 1);

export function viewportContentCoverage(frames, requiredRegions) {
  const first = frames[0], errors = [], regions = [];
  if (!first) return { policy: CONTENT_COVERAGE_POLICY, complete: false, requiredRegions, regions, errors: ['missing-viewport-frame'] };
  for (const frame of frames) {
    if (!sameState(first, frame)) errors.push('state-changed-between-scroll-frames');
    if (!frame) { errors.push('invalid-viewport-frame'); continue; }
    if (frame.fullPage !== false || !['x', 'y'].every(k => Number.isFinite(frame.scroll?.[k]) && frame.scroll[k] >= 0) || !['width', 'height'].every(k => Number.isFinite(frame.viewport?.[k]) && frame.viewport[k] > 0) || !Number.isFinite(frame.blockedTop) || frame.blockedTop < 0 || frame.blockedTop > frame.viewport.height) errors.push('invalid-viewport-frame');
    if (!Array.isArray(frame.occluders) || frame.occluders.some(o => !finiteRect(o.rect)) || Math.abs(frame.blockedTop - Math.max(0, ...(frame.occluders || []).map(o => Math.min(frame.viewport.height, o.rect?.bottom)))) > 1) errors.push('invalid-viewport-occlusion-evidence');
  }
  for (const name of requiredRegions) {
    const initial = first.regions?.find(r => r.name === name);
    if (!initial?.present || !validDocumentRect(initial, first) || !(initial.documentRect?.bottom > initial.documentRect?.top) || !/^[a-f0-9]{64}$/.test(initial.textSha256 || '')) {
      errors.push(`missing-content-region:${name}`); continue;
    }
    const intervals = [];
    for (const frame of frames) {
      const region = frame.regions?.find(r => r.name === name);
      if (!region?.present || !validDocumentRect(region, frame) || region.textSha256 !== initial.textSha256 || Math.abs(region.documentRect?.top - initial.documentRect.top) > 1 || Math.abs(region.documentRect?.bottom - initial.documentRect.bottom) > 1) {
        errors.push(`content-region-changed:${name}`); continue;
      }
      const v = region.visibleDocumentRange;
      // Recalculate the declared visible slice from actual viewport/scroll/rect
      // evidence. A self-reported complete flag cannot cover a hidden answer.
      const expectedTop = Math.max(region.rect.top, frame.blockedTop, 0) + frame.scroll.y;
      const expectedBottom = Math.min(region.rect.bottom, frame.viewport.height) + frame.scroll.y;
      if (v && (!region.horizontal || region.rect.left < -1 || region.rect.right > frame.viewport.width + 1 || expectedBottom <= expectedTop || !Number.isFinite(v.top) || !Number.isFinite(v.bottom) || Math.abs(v.top - expectedTop) > 1 || Math.abs(v.bottom - expectedBottom) > 1)) errors.push(`invalid-visible-region:${name}`);
      else if (v && Number.isFinite(v.top) && Number.isFinite(v.bottom) && v.bottom > v.top) intervals.push(v);
    }
    intervals.sort((a, b) => a.top - b.top);
    let cursor = initial.documentRect.top;
    const gaps = [];
    for (const v of intervals) { if (v.top > cursor + 1) gaps.push({ top: cursor, bottom: v.top }); cursor = Math.max(cursor, v.bottom); }
    if (cursor < initial.documentRect.bottom - 1) gaps.push({ top: cursor, bottom: initial.documentRect.bottom });
    if (gaps.length) errors.push(`incomplete-content-region:${name}`);
    regions.push({ name, documentRect: initial.documentRect, textSha256: initial.textSha256, intervals, gaps, complete: !gaps.length });
  }
  return { policy: CONTENT_COVERAGE_POLICY, complete: !errors.length, requiredRegions, regions, errors: [...new Set(errors)] };
}

export async function captureReviewState({ page, guard, out, name, id, state, fullPage, settle, collectContent, onCapture }) {
  const shot = async (file, full) => {
    const frame = await readBoundReviewFrame(page);
    const guarded = await guard.capture(() => page.screenshot({ path: path.join(out, file), fullPage: full }), { id, state, file, fullPage: full });
    frame.fullPage = full; frame.touchEnvironment = guarded.observation;
    const entry = { file, frame }; onCapture(entry); return entry;
  };
  await page.evaluate(async () => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); await document.fonts.ready; }); await settle();
  const raw = await shot(name, fullPage);
  if (!guard.expectedTouch) return { ...raw, supplementalFrames: [] };
  // The full-page PNG can be useful as a reference, but its pointer-media
  // paint is not certified by an after-capture environment restoration.
  await settle();
  const primary = fullPage ? await shot(name.replace(/\.png$/, '--viewport.png'), false) : raw;
  const supplementalFrames = [], required = collectContent ? requiredViewportRegions(primary.frame) : [];
  let coverage = viewportContentCoverage([primary.frame], required);
  try {
    for (let n = 1; !coverage.complete && n <= 80; n++) {
      if (coverage.errors.some(e => !e.startsWith('incomplete-content-region:'))) break;
      const last = supplementalFrames.at(-1)?.frame || primary.frame;
      const next = Math.min(last.scrollMax, last.scroll.y + Math.max(48, last.viewport.height - last.blockedTop - 32));
      if (next <= last.scroll.y + 1) break;
      await page.evaluate(y => window.scrollTo({ top: y, left: 0, behavior: 'instant' }), next); await settle();
      supplementalFrames.push(await shot(name.replace(/\.png$/, `--scroll-${String(n).padStart(3, '0')}.png`), false));
      coverage = viewportContentCoverage([primary.frame, ...supplementalFrames.map(e => e.frame)], required);
    }
    if (!coverage.complete) throw Error(`Viewport content coverage incomplete: ${coverage.errors.join(', ')}`);
  } finally {
    await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })); await settle();
  }
  return { ...primary, ...(fullPage ? { rawReference: raw } : {}), supplementalFrames, contentCoverage: coverage };
}
