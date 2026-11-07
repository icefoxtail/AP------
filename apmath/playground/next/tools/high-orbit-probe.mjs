// The production Board routes an empty-canvas pointer drag through onPanDrag.
// Observe the actual camera and rendered pixels; never invoke orbit callbacks.
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
