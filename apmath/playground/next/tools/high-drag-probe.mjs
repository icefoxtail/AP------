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

// Chromium touch input, separate from the mouse probe above. CDP touch points
// use viewport CSS pixels; touchEnd must have an empty touchPoints array.
// https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-dispatchTouchEvent
// No lab drag callbacks, synthetic DOM events, or mouse fallback are used.
export async function probeNativeTouchDrag(page, canvas, settle, handleId) {
  const attempts = [];
  const result = { input:'touch', transport:'CDP.Input.dispatchTouchEvent', attempts };
  const finish = (reason, error) => {
    const last = attempts.at(-1), pass = reason === 'touch-drag-complete';
    Object.assign(result, { acquired:!!last?.acquired, held:!!last?.held, changed:!!last?.changed,
      released:!!last?.released, pass, status:pass ? 'PASS' : 'FAIL', reason });
    if (error) result.error = String(error.message || error);
    return result;
  };
  let session;
  try {
    if (!await page.evaluate(() => navigator.maxTouchPoints > 0)) return finish('touch-capability-unavailable');
    try { session = await page.context().newCDPSession(page); }
    catch (error) { return finish('touch-cdp-unavailable', error); }
    for (const direction of [1, -1]) {
      await canvas.scrollIntoViewIfNeeded();
      await settle();
      const point = await page.evaluate(id => {
        const h = lab.board.handles.find(h => h.id === id);
        if (!h) return null;
        const model = Object.fromEntries(Object.entries(lab.s).filter(([k]) => !['step', 'part', 'revealed', 'playing', 'dragging'].includes(k)));
        return { x:h.x, y:h.y, W:lab.board.W, H:lab.board.H, state:JSON.stringify(model),
          dragging:!!lab.board.dragging || lab.s.dragging === true, viewportW:innerWidth, viewportH:innerHeight };
      }, handleId);
      const box = await canvas.boundingBox();
      if (!point || !box) return finish('missing-drag-handle-or-canvas');
      if (point.dragging) return finish('preexisting-touch-drag');
      if (![point.x,point.y,point.W,point.H,point.viewportW,point.viewportH,box.x,box.y,box.width,box.height].every(Number.isFinite)
        || Math.min(point.W,point.H,point.viewportW,point.viewportH,box.width,box.height) <= 0) return finish('invalid-touch-geometry');
      const x = box.x + point.x * box.width / point.W, y = box.y + point.y * box.height / point.H;
      const left = Math.max(0,box.x), right = Math.min(point.viewportW,box.x+box.width);
      const top = Math.max(0,box.y), bottom = Math.min(point.viewportH,box.y+box.height);
      if (right-left <= 2 || bottom-top <= 2 || x<left || x>right || y<top || y>bottom) return finish('touch-handle-outside-viewport');
      const dx = point.x > point.W / 2 ? -48 : 48;
      const targetX = Math.max(left+1,Math.min(right-1,x+direction*dx));
      const targetY = Math.max(top+1,Math.min(bottom-1,y-direction*28));
      const attempt = { direction:direction === 1 ? 'primary' : 'opposite', acquired:false, held:false,
        changed:false, released:false, from:{x,y}, to:{x:targetX,y:targetY}, events:[] };
      attempts.push(attempt);
      const send = async (type, touchPoints) => {
        await session.send('Input.dispatchTouchEvent', { type, touchPoints });
        attempt.events.push(type);
      };
      const touch = (x,y) => [{ x,y,id:1,radiusX:1,radiusY:1,force:1 }];
      try {
        await send('touchStart', touch(x,y));
        attempt.acquired = await page.evaluate(id => lab.board.dragging?.id === id, handleId);
        if (attempt.acquired) {
          for (let i=1;i<=6;i++) await send('touchMove',touch(x+(targetX-x)*i/6,y+(targetY-y)*i/6));
          attempt.held = await page.evaluate(id => lab.board.dragging?.id === id, handleId);
        }
      } catch (error) { attempt.inputError = String(error.message || error); }
      finally {
        // Release even if acquisition, a move, or the start request failed.
        try { await send('touchEnd', []); }
        catch (error) { attempt.releaseError = String(error.message || error); }
      }
      await settle();
      const after = await page.evaluate(() => ({
        state:JSON.stringify(Object.fromEntries(Object.entries(lab.s).filter(([k]) => !['step', 'part', 'revealed', 'playing', 'dragging'].includes(k)))),
        released:!lab.board.dragging && lab.s.dragging !== true
      }));
      attempt.changed = point.state !== after.state;
      attempt.released = after.released;
      if (attempt.inputError) return finish('touch-input-error', attempt.inputError);
      if (attempt.releaseError) return finish('touch-end-error', attempt.releaseError);
      if (!attempt.acquired) return finish('touch-handle-not-acquired');
      if (!attempt.held) return finish('touch-drag-lost-during-move');
      if (!attempt.released) return finish('touch-drag-not-released');
      if (attempt.changed) return finish('touch-drag-complete');
      // Retry only a genuinely acquired, held, released, unchanged drag.
      // A rejected boundary direction is not evidence of a dead handle.
    }
    return finish('touch-model-unchanged');
  } catch (error) { return finish('touch-probe-error', error); }
  finally {
    if (session) {
      try { await session.detach(); }
      catch (error) {
        result.pass = false; result.status = 'FAIL'; result.reason = 'touch-session-detach-error';
        result.cleanupError = String(error.message || error);
      }
    }
  }
}
