// Real-pointer probes for discrete selections that small generic drags may leave unchanged.
// No state assignment, synthetic drag callbacks, or direct scene-source modifications.

async function prepare(page, sceneId) {
  await page.evaluate(id => {
    const index = lab.list.findIndex(sc => sc.id === id);
    if (index < 0) throw Error(`Missing scene ${id}`);
    lab.goScene(index);
    lab.setTab('explore');
  }, sceneId);
  await page.waitForFunction(() => !lab._tween && lab.tab === 'explore');
  const canvas = page.locator('canvas').filter({ visible: true }).first();
  await canvas.scrollIntoViewIfNeeded();
  await page.evaluate(async () => {
    lab.render();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    lab.render();
  });
}

async function dragNative(page, probe) {
  await page.mouse.move(probe.start.x, probe.start.y);
  await page.mouse.down();
  const acquired = await page.evaluate(id => lab.board.dragging?.id === id, probe.handleId);
  if (!acquired) {
    await page.mouse.up();
    throw Error(`Native pointer did not acquire ${probe.handleId}`);
  }
  try {
    await page.mouse.move(probe.end.x, probe.end.y, { steps: 20 });
  } finally {
    await page.mouse.up();
  }
  await page.evaluate(async () => {
    lab.render();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    lab.render();
  });
  return { acquired };
}

export async function probeSpatialSelection(page, { sceneId = 's1-6', handleId = 'ref' } = {}) {
  // s1-6/ref: regular tetrahedron, stable fit. s1-7/tgt: reference/fit remains unchanged.
  if (!['ref', 'tgt'].includes(handleId)) throw Error('Expected ref or tgt');
  await prepare(page, sceneId);
  const probe = await page.evaluate(({ sceneId, handleId }) => {
    const b = lab.board, G = window.APL_SP, M = lab.scene.sp.model(lab.s);
    const handle = b.handles.find(h => h.id === handleId && typeof h.drag === 'function');
    if (!handle) throw Error(`Missing ${handleId} handle`);
    const stateKey = handleId === 'ref' ? 'spRef' : 'spTgt';
    const before = handleId === 'ref' ? M.ref.key : M.tgt.key;
    // scene3 construction and D.P only project points. Do not call fitPts or mutate the board.
    const D = G.scene3(b, lab.s, { tab: 'explore', problem: false, review: false, txt: true });
    const mids = M.sol.edges.map(e => ({
      key: e.key,
      name: e.name,
      ...b.toS(D.P(G.mid3(M.sol.verts[e.u], M.sol.verts[e.v])))
    }));
    const candidates = mids.filter(m => m.key !== before && (handleId !== 'tgt' || m.key !== M.ref.key)
      && m.x > 24 && m.x < b.W - 24 && m.y > b.insets.top + 80
      && m.y < b.H - Math.max(b.insets.bottom + 30, 70)
      && mids.every(other => other.key === m.key || Math.hypot(m.x - other.x, m.y - other.y) > 16));
    candidates.sort((a, z) => Math.hypot(z.x - handle.x, z.y - handle.y) - Math.hypot(a.x - handle.x, a.y - handle.y));
    const target = candidates[0];
    if (!target) throw Error('No unambiguous different midpoint inside the visible stage');
    const rect = b.canvas.getBoundingClientRect();
    const viewport = p => ({ x: rect.left + p.x * rect.width / b.W, y: rect.top + p.y * rect.height / b.H });
    return { sceneId, handleId, stateKey, before, expected: target.key, expectedName: target.name,
      start: viewport(handle), end: viewport(target), beforeCamera: { yaw: lab.s.spYaw, pitch: lab.s.spPitch } };
  }, { sceneId, handleId });
  await dragNative(page, probe);
  await page.waitForFunction(({ stateKey, expected }) => lab.s[stateKey] === expected, probe, { timeout: 3000 });
  const after = await page.evaluate(stateKey => {
    const M = lab.scene.sp.model(lab.s);
    return { actual: lab.s[stateKey], modelRef: M.ref.key, modelTarget: M.tgt?.key,
      legal: M.sol.edges.some(e => e.key === lab.s[stateKey]), yaw: lab.s.spYaw, pitch: lab.s.spPitch,
      tab: lab.tab, dragging: !!lab.board.dragging };
  }, probe.stateKey);
  const pass = after.actual === probe.expected && after.actual !== probe.before && after.legal && !after.dragging;
  if (!pass) throw Error(`Selection did not change to requested legal edge: ${JSON.stringify({ probe, after })}`);
  return { control: 'pointer-selection', unit: 'g7-spatial', ...probe, ...after, pass, pointer: 'mouse' };
}

export async function probePolyhedronCell(page) {
  await prepare(page, 'p2-6');
  const probe = await page.evaluate(() => {
    const b = lab.board, handle = b.handles.find(h => h.id === 'cell' && typeof h.drag === 'function');
    if (!handle) throw Error('Missing cell handle');
    const before = { phPp: lab.s.phPp, phQq: lab.s.phQq };
    // Select another valid table cell (tetrahedron or cube); coordinates match t2 P6.draw.
    const expected = before.phPp === 4 && before.phQq === 3 ? { phPp: 3, phQq: 3 } : { phPp: 4, phQq: 3 };
    const x0 = b.insets.left + 12, x1 = b.W - b.insets.right - 60;
    const top = b.insets.top + 70, bot = b.H - b.insets.bottom - 16, hw = 74, hh = 30;
    const cw = (x1 - x0 - hw) / 4, ch = Math.min((bot - top - hh) / 4, 78);
    const target = { x: x0 + hw + (expected.phQq - 3 + 0.5) * cw,
      y: top + hh + (expected.phPp - 3 + 0.5) * ch };
    const rect = b.canvas.getBoundingClientRect();
    const viewport = p => ({ x: rect.left + p.x * rect.width / b.W, y: rect.top + p.y * rect.height / b.H });
    return { sceneId: 'p2-6', handleId: 'cell', before, expected, start: viewport(handle), end: viewport(target) };
  });
  await dragNative(page, probe);
  await page.waitForFunction(({ phPp, phQq }) => lab.s.phPp === phPp && lab.s.phQq === phQq, probe.expected, { timeout: 3000 });
  const after = await page.evaluate(() => ({ phPp: lab.s.phPp, phQq: lab.s.phQq, tab: lab.tab, dragging: !!lab.board.dragging }));
  const pass = after.phPp === probe.expected.phPp && after.phQq === probe.expected.phQq
    && (after.phPp !== probe.before.phPp || after.phQq !== probe.before.phQq) && !after.dragging;
  if (!pass) throw Error(`Cell selection did not change: ${JSON.stringify({ probe, after })}`);
  return { control: 'pointer-selection', unit: 'g7-polyhedra', ...probe, ...after, pass, pointer: 'mouse' };
}

export async function probePolygonVertex(page, { sceneId } = {}) {
  const stateKey = { 'p1-one': 'pgV', 'p4-diag': 'pgDv', 'p4-fan': 'pgFv' }[sceneId];
  if (typeof stateKey !== 'string') throw Error(`Unsupported polygon vertex scene ${sceneId}`);
  await prepare(page, sceneId);
  const probe = await page.evaluate(({ sceneId, stateKey }) => {
    const b = lab.board, G = window.APL_PG, M = lab.scene.pg.model(lab.s);
    const handle = b.handles.find(h => h.id === 'v' && typeof h.drag === 'function');
    if (!handle) throw Error('Missing polygon vertex handle v');
    const beforePlaying = !!lab.s.playing;
    if (beforePlaying) throw Error('Polygon vertex probe started while playing');
    const before = lab.s[stateKey];
    if (!Number.isInteger(before) || before !== M.v || before < 0 || before >= M.n) throw Error('Invalid current polygon vertex');
    // Use the same fixed regular polygon as the production draw/nearest-vertex handle.
    // Reading model.Pn/regUp and projecting with toS must not refit or change the scene.
    const Pn = M.Pn || G.regUp(M.n, 1), rect = b.canvas.getBoundingClientRect();
    const viewport = p => ({ x: rect.left + p.x * rect.width / b.W, y: rect.top + p.y * rect.height / b.H });
    const vertices = Pn.map((p, index) => ({ index, ...b.toS(p) }));
    const candidates = vertices.filter(p => {
      const v = viewport(p);
      return p.index !== before && Number.isFinite(p.x) && Number.isFinite(p.y)
        && p.x > 16 && p.x < b.W - 16 && p.y > b.insets.top + 16 && p.y < b.H - b.insets.bottom - 16
        && v.x > 0 && v.x < innerWidth && v.y > 0 && v.y < innerHeight
        && vertices.every(other => other.index === p.index || Math.hypot(p.x - other.x, p.y - other.y) > 16);
    });
    candidates.sort((a, z) => Math.hypot(z.x - handle.x, z.y - handle.y) - Math.hypot(a.x - handle.x, a.y - handle.y));
    const target = candidates[0];
    if (!target) throw Error('No unambiguous different polygon vertex inside the visible stage');
    return { sceneId, handleId: 'v', stateKey, before, expected: target.index, vertexCount: M.n,
      start: viewport(handle), end: viewport(target), beforePlaying };
  }, { sceneId, stateKey });
  const { acquired } = await dragNative(page, probe);
  await page.waitForFunction(({ stateKey, expected }) => lab.s[stateKey] === expected, probe, { timeout: 3000 });
  const after = await page.evaluate(stateKey => {
    const M = lab.scene.pg.model(lab.s), actual = lab.s[stateKey];
    return { actual, modelVertex: M.v, vertexCountAfter: M.n,
      legal: Number.isInteger(actual) && actual >= 0 && actual < M.n,
      playing: !!lab.s.playing, tab: lab.tab, dragging: !!lab.board.dragging };
  }, stateKey);
  const changedKeys = after.actual !== probe.before ? [stateKey] : [];
  const pass = acquired && changedKeys.length > 0 && after.actual === probe.expected && after.modelVertex === probe.expected
    && after.vertexCountAfter === probe.vertexCount && after.legal && after.tab === 'explore' && !after.playing && !after.dragging;
  if (!pass) throw Error(`Polygon selection did not change to requested legal vertex: ${JSON.stringify({ probe, after, acquired, changedKeys })}`);
  return { control: 'pointer-selection', unit: 'g7-polygons', ...probe, ...after, acquired, changedKeys, pass, pointer: 'mouse' };
}

// On a 1440x900 real Chromium page, after loading the corresponding unit URL:
// await probeSpatialSelection(page, { sceneId: 's1-6', handleId: 'ref' });
// await probeSpatialSelection(page, { sceneId: 's1-7', handleId: 'tgt' });
// await probePolyhedronCell(page);
// await probePolygonVertex(page, { sceneId: 'p1-one' });
// Capture the resulting screenshot and returned before/expected/actual with the viewport/run SHA.
