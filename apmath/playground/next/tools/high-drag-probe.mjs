// A bound may correctly reject the first movement. Only a genuinely acquired,
// unchanged native drag may try the opposite direction; failed acquisition and
// two unchanged attempts remain failures. Never call a lab's drag callback here.
export async function probeNativeDrag(page, canvas, settle, handleId) {
  const attempts = [];
  for (const direction of [1, -1]) {
    await canvas.scrollIntoViewIfNeeded();
    await settle();
    const point = await page.evaluate(id => {
      const h = lab.board.handles.find(h => h.id === id);
      if (!h) return null;
      const model = Object.fromEntries(Object.entries(lab.s).filter(([k]) => !['step', 'part', 'revealed', 'playing', 'dragging'].includes(k)));
      return { x:h.x, y:h.y, W:lab.board.W, H:lab.board.H, state:JSON.stringify(model) };
    }, handleId);
    const box = await canvas.boundingBox();
    if (!point || !box) return { acquired:false, changed:false, pass:false, attempts, reason:'missing-drag-handle-or-canvas' };
    const x = box.x + point.x * box.width / point.W;
    const y = box.y + point.y * box.height / point.H;
    const dx = point.x > point.W / 2 ? -48 : 48;
    // Preserve the original first probe. The fallback moves away from the
    // rejected direction without changing the student's permitted range.
    const targetX = x + direction * dx, targetY = y - direction * 28;
    await page.mouse.move(x, y);
    await page.mouse.down();
    const acquired = await page.evaluate(id => lab.board.dragging?.id === id, handleId);
    try { await page.mouse.move(targetX, targetY, {steps:6}); }
    finally { await page.mouse.up(); }
    await settle();
    const changed = point.state !== await page.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries(lab.s).filter(([k]) => !['step', 'part', 'revealed', 'playing', 'dragging'].includes(k)))));
    attempts.push({ direction:direction === 1 ? 'primary' : 'opposite', acquired, changed });
    if (!acquired || changed) break;
  }
  const last = attempts.at(-1);
  return { acquired:!!last?.acquired, changed:!!last?.changed, pass:!!last?.acquired && !!last?.changed, attempts };
}
