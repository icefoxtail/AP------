// The production Board routes an empty-canvas pointer drag through onPanDrag.
// Observe the actual camera and rendered pixels; never invoke orbit callbacks.

// Reviewed scene contracts keep a disappeared camera/handler from becoming N/A.
// These scenes project 3D coordinates through yaw/pitch in the production source.
export const REQUIRED_ORBIT_SCENES = Object.freeze({
  'common-poly-solid': ['cube', 'box', 'cut', 'prism'],
  'geom-space': Array.from({ length: 9 }, (_, i) => `mode${i + 1}`),
  'geom-projection': Array.from({ length: 7 }, (_, i) => `mode${i + 1}`),
  'geom-space-coord': Array.from({ length: 8 }, (_, i) => `mode${i + 1}`)
});
const locked2D = new Set(['dist', 'binom', 'std', 'sym', 'pdf', 'mean', 'ci']);

export function classifyOrbitCapability(labId, sceneId, facts) {
  const controls = facts.controlKeys || [];
  const activeCamera = ['yaw', 'pitch'].every(k => controls.includes(k));
  const anyCameraControl = ['yaw', 'pitch'].some(k => controls.includes(k));
  const finiteCamera = [facts.yaw, facts.pitch].every(Number.isFinite);
  const declaredCamera = !!facts.yawParam && !!facts.pitchParam;
  const required = REQUIRED_ORBIT_SCENES[labId]?.includes(sceneId) || false;
  const result = (status, reason) => ({ status, reason, requiredBySceneContract: required, facts });
  if (required || activeCamera) {
    if (!(activeCamera && finiteCamera && declaredCamera && facts.declaredOrbit && facts.handler)) {
      return result('INVALID', '3d-scene-missing-active-camera-or-orbit-handler');
    }
    return result('REQUIRED', required ? 'reviewed-3d-scene-with-active-camera' : 'active-yaw-pitch-camera-and-declared-orbit');
  }
  // prob-stats deliberately declares a no-op orbit to lock 2D background pan.
  if (labId === 'prob-stats' && locked2D.has(sceneId) && !anyCameraControl && !facts.yawParam && !facts.pitchParam && !finiteCamera) {
    return result('NOT_APPLICABLE', 'reviewed-2d-statistics-pan-lock');
  }
  // sq draws a flat polynomial area model. The global BOARD3 is also used by
  // four solid scenes, so global camera params alone do not prove a 3D scene.
  if (labId === 'common-poly-solid' && sceneId === 'sq' && !anyCameraControl) {
    return result('NOT_APPLICABLE', 'reviewed-2d-square-scene-with-shared-board');
  }
  if (facts.handler || facts.declaredOrbit || anyCameraControl) {
    return result('INVALID', 'unclassified-orbit-scene-needs-capability-review');
  }
  return result('NOT_APPLICABLE', 'scene-has-no-orbit-camera-or-handler');
}

// Serializable Playwright evaluator; evaluates only the current scene's controls.
export function currentOrbitFacts() {
  const keys = typeof lab.scene.controls === 'function' ? lab.scene.controls(lab.s, lab) : lab.scene.controls;
  return {
    controlKeys: Array.isArray(keys) ? keys : [],
    yawParam: !!lab.params.yaw, pitchParam: !!lab.params.pitch,
    yaw: Number.isFinite(lab.s.yaw) ? lab.s.yaw : null,
    pitch: Number.isFinite(lab.s.pitch) ? lab.s.pitch : null,
    declaredOrbit: typeof lab.def.board?.orbit === 'function',
    handler: typeof lab.board.onPanDrag === 'function'
  };
}

const orbitSnapshot = () => {
  const b = lab.board;
  const pixels = b.ctx.getImageData(0, 0, b.canvas.width, b.canvas.height).data;
  let inkHash = 2166136261;
  for (let i = 0; i < pixels.length; i++) inkHash = Math.imul(inkHash ^ pixels[i], 16777619);
  return { yaw:lab.s.yaw, pitch:lab.s.pitch, inkHash:inkHash >>> 0 };
};

export async function probeNativeOrbit(page, canvas, settle) {
  await canvas.scrollIntoViewIfNeeded();
  await settle();
  const point = await page.evaluate(() => {
    const b=lab.board, cv=b.canvas, r=cv.getBoundingClientRect();
    if (typeof b.onPanDrag !== 'function' || r.width < 120 || r.height < 120) return null;
    for (const fy of [0.3,0.5,0.7]) for (const fx of [0.25,0.5,0.75]) {
      const x=fx*b.W, y=fy*b.H;
      if (b.handles.some(h=>Math.hypot(h.x-x,h.y-y)<35)) continue;
      const clientX=r.left+x*r.width/b.W, clientY=r.top+y*r.height/b.H;
      if (document.elementFromPoint(clientX,clientY)!==cv) continue;
      return { x:clientX, y:clientY, dx:Math.min(60,r.width*0.12), dy:Math.min(24,r.height*0.06) };
    }
    return null;
  });
  if (!point) return { pass:false, acquired:false, cameraChanged:false, pixelsChanged:false, reason:'no-visible-empty-orbit-canvas' };
  const before=await page.evaluate(orbitSnapshot);
  if (![before.yaw,before.pitch].every(Number.isFinite)) return { pass:false, acquired:false, cameraChanged:false, pixelsChanged:false, reason:'invalid-orbit-camera' };
  await page.mouse.move(point.x,point.y);
  await page.mouse.down();
  let acquired=false;
  try {
    acquired=await page.evaluate(()=>lab.board.canvas.classList.contains('is-dragging') && !lab.board.dragging && typeof lab.board.onPanDrag==='function');
    await page.mouse.move(point.x+point.dx,point.y+point.dy,{steps:6});
  } finally { await page.mouse.up(); }
  await settle();
  const after=await page.evaluate(orbitSnapshot);
  const cameraChanged=[after.yaw,after.pitch].every(Number.isFinite) && (Math.abs(after.yaw-before.yaw)>1e-8 || Math.abs(after.pitch-before.pitch)>1e-8);
  const pixelsChanged=before.inkHash!==after.inkHash;
  return { pass:acquired&&cameraChanged&&pixelsChanged, acquired, cameraChanged, pixelsChanged, before, after };
}
