/** Explicit adjudication of legacy smoke observations. All raw failures remain
 * in the result; missing content and incomplete observations are never waived.
 */
export function adjudicateSmokeMeasurement(frame, semantic) {
  const failures = [], corrections = [], legacy = semantic?.legacy;
  const result = { version: 1, status: 'FAIL', legacy, corrections, failures,
    semanticStatus: semantic?.status || 'UNKNOWN', studentVisualQuality: 'NOT_ASSERTED' };
  if (!legacy || !Number.isFinite(legacy.ink) || !Array.isArray(legacy.clipped)
      || legacy.minimumInk !== 200 || legacy.alphaThreshold !== 30 || legacy.clipToleranceCssPx !== 2) {
    failures.push('legacy-observation-incomplete-or-thresholds-changed'); return result;
  }
  if (semantic.unit !== frame.unit || String(semantic.id) !== String(frame.id)
      || (semantic.contract?.applicable && semantic.contract.key !== `${frame.unit}/${frame.id}`)
      || legacy.ink !== frame.legacy?.ink || JSON.stringify(legacy.clipped) !== JSON.stringify(frame.legacy?.clipped)
      || legacy.samplingStep !== frame.legacy?.samplingStep) failures.push('semantic-proof-observation-mismatch');
  const W = frame.canvas?.cssWidth, H = frame.canvas?.cssHeight;
  const outside = box => !['x0', 'x1', 'y0', 'y1'].every(key => Number.isFinite(box[key]))
    || Math.max(-box.x0, box.x1 - W, -box.y0, box.y1 - H) > 2;
  const visiblyPainted = box => !outside(box) && box.x1 > box.x0 && box.y1 > box.y0
    && Number.isFinite(box.effectiveAlpha) && box.effectiveAlpha * 255 > 30;
  if (!(W > 0 && H > 0) || !frame.glyphCaptureComplete || !frame.fractionBarCaptureComplete
      || frame.annotationCaptureComplete !== true) failures.push('actual-annotation-observation-incomplete');
  const marks = [...(frame.glyphs || []), ...(frame.fractionBars || [])];
  if (marks.some(outside)) failures.push('actual-glyph-or-fraction-bar-clipped-over-2px');
  if (semantic?.status === 'FAIL') failures.push('required-semantic-content-failed');
  if (semantic?.status !== 'PASS') failures.push('semantic-observation-unverified');
  const requiredInitial = frame.unit === 'g7-circle-sector' && /^(f1-(star|ss2|lens|ex22|ring|semis|tri)|f3-leaf-len)$/.test(String(frame.id))
    || frame.unit === 'g9-circle' && frame.id === 'c6-8'
    || frame.unit === 'g7-polyhedra' && frame.id === 'p2-6';
  if ((semantic?.contract?.applicable || requiredInitial) && semantic.status !== 'PASS') failures.push('required-semantic-content-unverified');
  if (requiredInitial && semantic.existingInitialContract?.status !== 'PASS') failures.push('required-initial-contract-not-pass');
  if (legacy.ink < 200) {
    if (semantic.status === 'PASS' && semantic.contract?.applicable === true
        && semantic.contract.contours?.length > 0 && semantic.checks?.length > 0 && semantic.checks.every(check => check.pass))
      corrections.push({ type: 'ANALYTIC_SPARSE_FIGURE', contract: semantic.contract.key,
        originalInk: legacy.ink, unchangedMinimumInk: 200 });
    else failures.push('legacy-low-ink-without-complete-analytic-proof');
  }
  const annotations = frame.annotations || [], ids = annotations.map(annotation => annotation.id);
  const uniqueIDs = ids.every(id => Number.isInteger(id) && id > 0) && new Set(ids).size === ids.length;
  if (!uniqueIDs || annotations.some(annotation => annotation.error || !annotation.completed)) failures.push('annotation-invocation-failed-or-ambiguous');
  const raw = (frame.rawBoxes || []).filter(outside);
  const rawMatchesLegacy = raw.length === legacy.clipped.length
    && raw.every((box, i) => box.text.slice(0, 20) === legacy.clipped[i]);
  if (!rawMatchesLegacy) failures.push('raw-clipping-observation-incomplete');
  for (const box of raw) {
    const annotation = annotations.find(item => item.id === box.invocationId);
    const glyphs = (frame.glyphs || []).filter(glyph => glyph.invocationId === box.invocationId && glyph.kind === 'fillText');
    const bars = (frame.fractionBars || []).filter(bar => bar.invocationId === box.invocationId && bar.kind === 'fraction-bar-fill');
    const expected = annotation?.expectedGlyphs;
    const complete = uniqueIDs && frame.annotationCaptureComplete === true && !!annotation && !annotation.ignored
      && annotation.completed && !annotation.error && annotation.text === box.text
      && Array.isArray(expected) && expected.length > 0 && expected.length === glyphs.length
      && expected.every((text, index) => text === glyphs[index].text && glyphs[index].parentText === box.text)
      && Number.isInteger(annotation.expectedFractionBars) && bars.length === annotation.expectedFractionBars
      && bars.every(bar => bar.text === box.text)
      && glyphs.every(visiblyPainted) && bars.every(visiblyPainted);
    if (complete) corrections.push({ type: 'ACTUAL_ANNOTATION_BOUNDS', invocationId: box.invocationId,
      rawText: box.text, glyphs: glyphs.length, fractionBars: bars.length, unchangedToleranceCssPx: 2 });
    else failures.push(`raw-clipped-annotation-unverified:${box.invocationId ?? 'missing-id'}`);
  }
  result.status = failures.length ? 'FAIL' : 'PASS';
  return result;
}
