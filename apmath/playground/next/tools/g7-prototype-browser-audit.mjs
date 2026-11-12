// Run from repository root after starting a local server (ROOT runs server and audit):
// node apmath/playground/next/tools/g7-prototype-browser-audit.mjs http://127.0.0.1:8765/apmath/playground/next/labs/ --out C:/Users/USER/.codex/cache/g7-audit --scenes g7-circle-sector:SCENE_ID,g7-surface-volume:SCENE_ID
// If Playwright Chromium is not installed, first set CHROME_PATH to an installed
// Chrome executable (PowerShell: $env:CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe').
// Captures and results.json go only to --out. Review screenshots and mathematical claims independently;
// automated state comparisons do not establish mathematical or visual correctness.
// --layout-only retains all ten viewports but checks only title/caption/canvas/end-card layout.
// It seeks to the end; it is not a replacement for the full natural-playback audit.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');
const args = process.argv.slice(2);
const layoutOnly = args.includes('--layout-only');
const arg = k => { const i = args.indexOf(k); return i < 0 ? null : args[i + 1]; };
const base = (args[0] || '').replace(/\/?$/, '/');
const out = arg('--out');
const scenes = (arg('--scenes') || '').split(',').filter(Boolean).map(x => x.split(':'));
if (!args[0] || !out || scenes.length !== 2 || scenes.some(x => x.length !== 2 || !x[0] || !x[1])) throw Error('Supply base URL, --out directory, and two --scenes lab:id,lab:id');
fs.mkdirSync(out, { recursive: true });
const runs = [
  {name:'desktop-board', width:1440, height:900, theme:'board'},
  {name:'desktop-paper', width:1440, height:900, theme:'paper'},
  {name:'tablet-portrait', width:768, height:1024, theme:'board'},
  {name:'tablet-landscape', width:1024, height:768, theme:'board'},
  {name:'phone', width:390, height:844, theme:'board'}
];
const results = [];
// Prefer an explicitly supplied Chrome, otherwise use Playwright's full Chromium
// (the separately downloaded headless-shell is not required).
const browser = await chromium.launch(process.env.CHROME_PATH
  ? { executablePath: process.env.CHROME_PATH, headless: true }
  : { channel: 'chromium', headless: true });
for (const [file, id] of scenes) for (const run of runs) {
  const record = { file, id, run, scope:layoutOnly ? 'layout-only' : 'full', checks: [], errors: [], captures: [], samples: [] };
  results.push(record);
  const check = (name, pass, detail = '') => record.checks.push({name, status:pass ? 'PASS' : 'FAIL', detail});
  const ctx = await browser.newContext({viewport:{width:run.width,height:run.height}});
  const page = await ctx.newPage();
  page.on('pageerror', e => record.errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') record.errors.push('console: ' + m.text()); });
  const layoutCheck = async label => {
    const data = await page.evaluate(() => ({overflow:document.documentElement.scrollWidth > innerWidth + 1, katexErrors:[...document.querySelectorAll('.katex-error')].map(e => e.textContent)}));
    check(`horizontal overflow ${label}`, !data.overflow, JSON.stringify(data));
    check(`KaTeX errors ${label}`, !data.katexErrors.length, JSON.stringify(data.katexErrors));
  };
  const focusCheck = async label => {
    const badFocus = [];
    for (let i=0;i<40;i++) {
      await page.keyboard.press('Tab');
      const bad = await page.evaluate(() => {
        const e=document.activeElement;
        if (!e || e === document.body) return null;
        return e.closest('[hidden],[inert],[aria-hidden="true"]') || !e.checkVisibility({checkVisibilityCSS:true}) ? e.outerHTML.slice(0,250) : null;
      });
      if (bad) badFocus.push(bad);
    }
    check(`hidden focus ${label}`, !badFocus.length, JSON.stringify(badFocus));
  };
  let trackedKeys = [];
  const stableCheck = async (label, sceneAnimation = false) => {
    // Include old video's keys after navigation, so a stray callback cannot
    // silently write into the new scene even if its playback flag says idle.
    const read = () => page.evaluate(keys => ({t:lab.video.t,state:lab.video.state,raf:lab.video._raf,applyCalls:window.__videoAuditApplyCalls,index:lab.index,tab:lab.tab,values:Object.fromEntries(keys.map(k => [k,lab.s[k]]))}), trackedKeys);
    const before = await read();
    await page.waitForTimeout(300);
    const after = await read();
    const comparable = s => sceneAnimation ? {...s,values:undefined} : s;
    check(`timer cleanup ${label}`, before.raf === 0 && after.raf === 0 && before.state !== 'playing' && JSON.stringify(comparable(before)) === JSON.stringify(comparable(after)), JSON.stringify({before,after,sceneAnimation}));
  };
  const capture = async label => {
    const filename = `${file}-${id}-${run.name}-${label}.png`;
    await page.screenshot({path:path.join(out,filename), fullPage:true});
    record.captures.push(filename);
    await layoutCheck(label);
  };
  const snapshot = async label => {
    // A paused seek has a short caption entrance animation; capture readable text.
    if (await page.evaluate(() => lab.video.state !== 'playing')) await page.waitForTimeout(220);
    await capture(label);
    const data = await page.evaluate(() => {
      const p = lab.video, s = APLab.videoCore.stateAt(p.cs, p.t, p.base);
      const expected = {...s.nums,...s.sets,step:s.step,part:s.part};
      return {t:p.t, state:p.state, sample:s, expected, actual:Object.fromEntries(Object.keys(expected).map(k => [k,lab.s[k]])), caption:p.ui.cap.innerText, visibleText:document.body.innerText, titlePhase:p.ui.tbar.dataset.phase};
    });
    record.samples.push({label,...data});
    check(`stateAt ${label}`, Object.keys(data.expected).every(k => typeof data.expected[k] === 'number'
      ? typeof data.actual[k] === 'number' && Math.abs(data.actual[k]-data.expected[k]) < 1e-7
      : JSON.stringify(data.actual[k]) === JSON.stringify(data.expected[k])), JSON.stringify({expected:data.expected, actual:data.actual}));
  };
  const openVideo = async () => {
    await page.locator('.apl-toc-btn').click();
    await page.locator(`.apl-toc-item[data-i="${record.index}"]`).click();
    await page.waitForFunction(() => lab.video.state === 'playing');
    await page.evaluate(() => window.__videoAuditTexts?.clear());
    trackedKeys = await page.evaluate(() => [...new Set([...Object.keys(lab.video.cs.tracks),...lab.video.cs.setKeys,'step','part'])]);
  };
  try {
    await page.goto(`${base}${file}.html?theme=${run.theme}`, {waitUntil:'networkidle'});
    await page.waitForFunction(() => window.lab && lab.video && lab.toc);
    await page.evaluate(() => {
      window.__videoAuditApplyCalls = 0;
      const apply = lab.video.apply;
      lab.video.apply = function () {window.__videoAuditApplyCalls++;return apply.apply(this,arguments);};
    });
    const info = await page.evaluate(id => ({index:lab.list.findIndex(s => String(s.id) === id), ids:lab.list.map(s => String(s.id))}), id);
    record.index = info.index;
    if (info.index < 0) throw Error(`Scene ${id} missing: ${info.ids.join(', ')}`);
    if (layoutOnly) {
      // Exercise the real collapsed-panel entry boundary on wide viewports.
      if (run.width >= 860) {
        await page.getByRole('button',{name:'설명 패널 접기/펴기 (H)',exact:true}).click();
        check('layout starts with collapsed panel', await page.evaluate(() => lab.ui.main.classList.contains('panel-off')));
      }
      await openVideo();
      await page.waitForFunction(() => lab.video.t >= 0.5);
      await snapshot('layout-title-0.5s');
      const titleLayout=await page.evaluate(() => ({title:lab.video.ui.tBig.getBoundingClientRect().bottom,canvas:lab.ui.canvas.getBoundingClientRect().top,visible:lab.video.ui.tBig.checkVisibility({checkVisibilityCSS:true})}));
      check('large title outside canvas', titleLayout.visible && titleLayout.title <= titleLayout.canvas+1, JSON.stringify(titleLayout));
      await page.waitForFunction(() => lab.video.t >= 2.5);
      await page.getByRole('button',{name:'멈춤',exact:true}).click();
      await snapshot('layout-motion-2.5s');
      const videoLayout=await page.evaluate(() => {
        const canvas=lab.ui.canvas.getBoundingClientRect(),cap=lab.video.ui.cap.getBoundingClientRect();
        return {canvasHeight:canvas.height,captionTop:cap.top,captionBottom:cap.bottom,viewport:innerHeight,dockVisible:lab.ui.dock.checkVisibility({checkVisibilityCSS:true}),titlePhase:lab.video.ui.tbar.dataset.phase};
      });
      check('video canvas minimum height', videoLayout.canvasHeight >= 359, JSON.stringify(videoLayout));
      check('caption visible in first viewport', videoLayout.captionTop >= 0 && videoLayout.captionBottom <= videoLayout.viewport+1, JSON.stringify(videoLayout));
      check('exploration dock hidden during video', !videoLayout.dockVisible, JSON.stringify(videoLayout));
      check('small title phase', videoLayout.titlePhase === 'small', JSON.stringify(videoLayout));
      // Layout-only deliberately uses the public player's end transition rather
      // than re-claiming the previously completed natural-playback checks.
      await page.evaluate(() => {lab.video.seek(lab.video.cs.length);lab.video.finish();});
      await snapshot('layout-end');
      const endLayout=await page.evaluate(() => {
        const p=lab.video,card=p.ui.end.getBoundingClientRect(),sum=p.ui.endSum.getBoundingClientRect();
        return {panelOff:lab.ui.main.classList.contains('panel-off'),endVisible:p.ui.end.checkVisibility({checkVisibilityCSS:true}),first:lab.ui.panelInner.firstElementChild===p.ui.bar,cardTop:card.top,summaryBottom:sum.bottom,viewport:innerHeight,taskNotes:document.querySelectorAll('.apl-vtask').length};
      });
      check('end card opens collapsed panel', !endLayout.panelOff && endLayout.endVisible, JSON.stringify(endLayout));
      check('end card precedes questions and controls', endLayout.first, JSON.stringify(endLayout));
      check('end summary visible in first viewport', endLayout.cardTop >= 0 && endLayout.summaryBottom <= endLayout.viewport+1, JSON.stringify(endLayout));
      check('end task not duplicated', endLayout.taskNotes === 0, JSON.stringify(endLayout));
      await page.getByRole('button',{name:'직접 해 보기',exact:true}).click();
      check('end close restores one exploration task', await page.evaluate(() => lab.video.state === 'idle' && lab.video.ui.bar.parentNode === lab.ui.stage && document.querySelectorAll('.apl-vtask').length === 1));
    } else {
    // Capture rendered canvas labels using the same Board hook as pi-scan.mjs.
    // Sampling is observational: it never seeks, reapplies, or renders a frame.
    await page.evaluate(() => {
      const board = lab.board, text = board._text;
      window.__videoAuditTexts = new Set();
      window.__videoAuditDecimals = [];
      board._text = function (x,y,str,o,screen) {
        if (str != null && str !== '' && !this._bbox && !this.thumb) window.__videoAuditTexts.add(String(str));
        return text.apply(this,arguments);
      };
      window.__videoAuditTimer = setInterval(() => {
        const p=lab.video;
        if (p.state !== 'playing' && p.state !== 'ended') return;
        const canvas=[...window.__videoAuditTexts];
        window.__videoAuditTexts.clear();
        const dom=[lab.ui.chips,lab.ui.status,...document.querySelectorAll('.apl-mlabel, .apl-readouts')]
          .filter(Boolean)
          .filter(e=>e.checkVisibility({checkVisibilityCSS:true})).map(e=>e.innerText);
        const texts=[...canvas,...dom];
        window.__videoAuditDecimals.push({t:p.t,canvas,dom,decimalTexts:texts.filter(s=>/\d+\.\d+/.test(s))});
      },100);
    });
    await openVideo();
    check('toc starts intended scene', await page.evaluate(id => String(lab.list[lab.index].id) === id && lab.video.state === 'playing', id));
    // One complete, unseeked playback per scene and viewport also exercises the
    // natural finish boundary and records the large/small title phases.
    await page.waitForFunction(() => lab.video.t >= 0.5);
    await snapshot('title-0.5s');
    check('large title', await page.evaluate(() => lab.video.ui.tbar.dataset.phase === 'big' && lab.video.ui.tBig.classList.contains('on')));
    await page.waitForFunction(() => lab.video.t >= 2.5);
    await snapshot('motion-2.5s');
    await page.waitForFunction(() => lab.video.t >= 4);
    await snapshot('title-4s');
    check('small title', await page.evaluate(() => lab.video.ui.tbar.dataset.phase === 'small'));
    await page.waitForFunction(() => lab.video.state === 'ended', null, {timeout:25000});
    check('natural end', await page.evaluate(() => lab.video.t === lab.video.cs.length && lab.video._raf === 0 && !lab.video.ui.end.hidden));
    record.decimalSamples = await page.evaluate(() => {clearInterval(window.__videoAuditTimer);return window.__videoAuditDecimals;});
    const duration = await page.evaluate(() => lab.video.cs.length);
    check('decimal sampling spans playback', record.decimalSamples.length > 0 && record.decimalSamples[0].t < 0.5 && record.decimalSamples.at(-1).t >= duration-0.5, JSON.stringify({samples:record.decimalSamples.length,first:record.decimalSamples[0]?.t,last:record.decimalSamples.at(-1)?.t,duration}));
    const decimals = record.decimalSamples.filter(s=>s.decimalTexts.length);
    check('decimal labels during playback', !decimals.length, JSON.stringify(decimals));
    await snapshot('natural-end');
    await stableCheck('natural end');
    await focusCheck('end card');
    await page.getByRole('button',{name:'다시 보기',exact:true}).first().click();
    await page.getByRole('button',{name:'멈춤', exact:true}).click();
    const paused = await page.evaluate(() => ({t:lab.video.t, state:lab.video.state}));
    await page.waitForTimeout(300);
    check('pause freezes time', await page.evaluate(t => lab.video.state === 'paused' && Math.abs(lab.video.t-t)<0.01, paused.t));
    await stableCheck('pause');
    await focusCheck('video');
    await page.locator('.apl-vctl button[title*="1배"]').click();
    check('slow 1x speed', await page.evaluate(() => lab.video.rate === 1 && lab.video.ui.slow.getAttribute('aria-pressed') === 'true'));
    await page.getByRole('button',{name:'재생',exact:true}).click();
    await page.waitForTimeout(100);
    const rateBefore = await page.evaluate(() => ({t:lab.video.t,wall:performance.now()}));
    await page.waitForTimeout(800);
    const rateAfter = await page.evaluate(() => ({t:lab.video.t,wall:performance.now()}));
    const observedRate = (rateAfter.t-rateBefore.t)/((rateAfter.wall-rateBefore.wall)/1000);
    check('slow 1x elapsed time', observedRate > 0.8 && observedRate < 1.2, JSON.stringify({rateBefore,rateAfter,observedRate}));
    await page.getByRole('button',{name:'멈춤',exact:true}).click();
    await page.getByRole('button',{name:'다시 보기',exact:true}).first().click();
    await page.getByRole('button',{name:'멈춤',exact:true}).click();
    check('restart', await page.evaluate(() => lab.video.t < 0.5));
    await snapshot('start');
    const range = page.getByRole('slider',{name:'영상 진행 위치'});
    await range.focus(); await page.keyboard.press('Home'); await page.keyboard.press('ArrowRight');
    check('keyboard seek', await page.evaluate(() => lab.video.state === 'paused' && lab.video.t > 0));
    await range.fill('500');
    await snapshot('middle');
    await page.getByRole('button',{name:'다음 자막',exact:true}).click();
    await page.getByRole('button',{name:'다음 자막',exact:true}).click();
    if (await page.evaluate(() => lab.video.state !== 'ended')) await page.getByRole('button',{name:'다음 자막',exact:true}).click();
    check('end card', await page.evaluate(() => lab.video.state === 'ended' && !lab.video.ui.end.hidden && !!lab.video.ui.endSum.textContent && !!lab.video.ui.endTask.textContent));
    await snapshot('end');
    await stableCheck('skipped end');
    await page.getByRole('button',{name:'직접 해 보기',exact:true}).click();
    check('direct exploration', await page.evaluate(() => lab.video.state === 'idle' && lab.tab === 'explore'));
    await stableCheck('direct exploration');
    if (run.name === 'desktop-board' || run.name === 'tablet-landscape') {
      const drag = async ({from,to}) => {
        await page.mouse.move(from.x,from.y); await page.mouse.down();
        await page.mouse.move(to.x,to.y,{steps:16}); await page.mouse.up();
        await page.waitForTimeout(220);
      };
      record.pointerSamples = [];
      if (file === 'g7-circle-sector' && id === '1209') {
        for (const angle of [135,90]) {
          await page.locator('.apl-canvas').scrollIntoViewIfNeeded();
          const geometry = await page.evaluate(angle => {
            const b=lab.board,h=b.handles.find(h=>h.id==='th'),rect=b.canvas.getBoundingClientRect();
            if (!h) throw Error('Actual theta handle missing');
            const radius=Math.hypot(h.w.x,h.w.y),rad=angle*Math.PI/180;
            const target=b.toS(radius*Math.cos(rad),-radius*Math.sin(rad));
            window.__videoAuditTexts.clear();
            return {handle:h.id,before:lab.s.b1209_th,from:{x:rect.left+h.x,y:rect.top+h.y},to:{x:rect.left+target.x,y:rect.top+target.y}};
          },angle);
          await drag(geometry);
          const after = await page.evaluate(() => ({theta:lab.s.b1209_th,r:lab.s.b1209_r,labels:[...window.__videoAuditTexts],readouts:lab.ui.panes.explore.innerText}));
          const area=after.r*after.r*after.theta/360;
          check(`pointer theta ${angle} and area`, after.theta === angle && after.theta !== geometry.before && after.labels.some(t=>t.includes(`넓이 ${area}π`)) && after.readouts.includes(`${area}π`), JSON.stringify({geometry,after,area}));
          record.pointerSamples.push({kind:'theta',angle,geometry,after,area});
          await capture(`pointer-theta-${angle}`);
        }
      } else if (file === 'g7-surface-volume' && id === 'sv1-1') {
        const slider=page.getByRole('slider',{name:'펼치기',exact:true});
        for (const target of [0,0.5,1]) {
          await slider.scrollIntoViewIfNeeded();
          const geometry=await slider.evaluate((e,target) => {
            if (lab._ctls.sT.input !== e) throw Error('Unfold control is not bound to sT');
            const r=e.getBoundingClientRect(),min=+e.min,max=+e.max;
            const x=value=>r.left+10+(r.width-20)*(value-min)/(max-min);
            return {before:lab.s.sT,from:{x:x(+e.value),y:r.top+r.height/2},to:{x:x(target),y:r.top+r.height/2}};
          },target);
          const beforeImage=await page.locator('.apl-canvas').evaluate(e=>e.toDataURL());
          await drag(geometry);
          const after=await page.evaluate(() => ({sT:lab.s.sT,readouts:lab.ui.panes.explore.innerText}));
          const imageChanged=beforeImage !== await page.locator('.apl-canvas').evaluate(e=>e.toDataURL());
          check(`pointer unfold ${target}`, Math.abs(after.sT-target)<=0.02 && after.sT!==geometry.before && imageChanged, JSON.stringify({geometry,after,imageChanged}));
          record.pointerSamples.push({kind:'unfold',target,geometry,after,imageChanged});
          await capture(`pointer-unfold-${target}`);
          if (target === 0) {
            await page.locator('.apl-canvas').scrollIntoViewIfNeeded();
            // Find a transparent canvas patch outside actual handle hit regions.
            const empty=await page.evaluate(() => {
              const b=lab.board,c=b.canvas,rect=c.getBoundingClientRect(),ctx=c.getContext('2d');
              for (let y=50;y<b.H-70;y+=30) for (let x=50;x<b.W-100;x+=30) {
                if (b.handles.some(h=>Math.hypot(h.x-x,h.y-y)<45)) continue;
                if (document.elementFromPoint(rect.left+x,rect.top+y)!==c) continue;
                const pixels=ctx.getImageData(Math.round((x-5)*b.dpr),Math.round((y-5)*b.dpr),Math.round(10*b.dpr),Math.round(10*b.dpr)).data;
                if (pixels.some((v,i)=>i%4===3 && v>0)) continue;
                return {before:{yaw:lab.s.svYaw,pitch:lab.s.svPitch},from:{x:rect.left+x,y:rect.top+y},to:{x:rect.left+x+60,y:rect.top+y+25}};
              }
              throw Error('No verified empty canvas patch for orbit');
            });
            await drag(empty);
            const rotated=await page.evaluate(() => ({yaw:lab.s.svYaw,pitch:lab.s.svPitch}));
            check('pointer orbit', rotated.yaw!==empty.before.yaw && rotated.pitch!==empty.before.pitch, JSON.stringify({empty,rotated}));
            record.pointerSamples.push({kind:'orbit',geometry:empty,after:rotated});
            await capture('pointer-orbit');
          }
        }
      }
    }
    const control = page.locator('#apl-pane-explore input[type=range]:visible, .apl-dock input[type=range]:visible').first();
    if (await control.count()) {
      const before = await control.inputValue(); await control.focus(); await page.keyboard.press('ArrowRight');
      if (await control.inputValue() === before) await page.keyboard.press('ArrowLeft');
      check('direct control changes', await control.inputValue() !== before);
    } else record.checks.push({name:'direct control changes',status:'NOT_RUN',detail:'No visible slider; inspect pointer controls manually'});
    await page.screenshot({path:path.join(out,`${file}-${id}-${run.name}-explore.png`),fullPage:true});
    record.captures.push(`${file}-${id}-${run.name}-explore.png`);
    await layoutCheck('explore');
    await openVideo();
    await page.locator('.apl-canvas-wrap').click({position:{x:20,y:20}});
    check('stage interaction pauses', await page.evaluate(() => lab.video.state === 'paused' && lab.video._raf === 0));
    await stableCheck('stage interaction');
    await page.getByRole('button',{name:'재생',exact:true}).click();
    await page.locator('.apl-toc-btn').click();
    check('toc opening pauses', await page.evaluate(() => lab.video.state === 'paused' && lab.video._raf === 0));
    await stableCheck('toc opening');
    const noVideo = await page.evaluate(() => lab.list.findIndex((s,i) => !lab.video.has(i)));
    if (noVideo >= 0) {
      await page.locator(`.apl-toc-item[data-i="${noVideo}"]`).click();
      check('unscripted scene opens exploration', await page.evaluate(i => lab.index === i && lab.video.state === 'idle' && lab.tab === 'explore' && lab.video._raf === 0, noVideo));
      await stableCheck('unscripted scene');
    } else record.checks.push({name:'unscripted scene',status:'NOT_RUN',detail:'No unscripted scene available'});
    // Navigation through public shell API tests the cancellation boundary when tabs are hidden in video layout.
    await openVideo();
    const tab = await page.evaluate(() => ['review','problem'].find(x => lab._tabAvailable(x)) || null);
    if (tab) {
      await page.evaluate(t => lab.setTab(t), tab);
      check('tab transition stops playback', await page.evaluate(t => lab.tab === t && lab.video.state === 'idle' && lab.video._raf === 0, tab));
      // A new review scene may intentionally animate (e.g. surface-volume sT).
      // Time/state/RAF AND actual old video.apply invocations must stay frozen.
      await stableCheck('tab transition', true);
      record.checks.push({name:'tab transition via visible UI',status:'NOT_RUN',detail:'Tab panel hidden during video; public API transition tested'});
    } else record.checks.push({name:'tab transition',status:'NOT_RUN',detail:'No alternate tab'});
    await layoutCheck('after navigation');
    await focusCheck('after navigation');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.locator('.apl-toc-btn').click();
    await page.locator(`.apl-toc-item[data-i="${record.index}"]`).click();
    check('reduced motion starts with a paused caption', await page.evaluate(() => lab.video.stepMode && lab.video.state === 'paused' && lab.video._raf === 0 && lab.video.ui.cap.textContent.trim().length > 0));
    await stableCheck('reduced motion start');
    await snapshot('reduced-motion');
    const reducedBefore = await page.evaluate(() => lab.video.t);
    await page.locator('.apl-vctl .primary').click();
    check('reduced motion advances one caption', await page.evaluate(t => lab.video.t > t && lab.video.state === 'paused' && lab.video._raf === 0, reducedBefore));
    const captionCount = await page.evaluate(() => lab.video.cs.says.length);
    for (let i=0;i<captionCount && await page.evaluate(() => lab.video.state !== 'ended');i++) await page.locator('.apl-vctl .primary').click();
    check('reduced motion reaches end card', await page.evaluate(() => lab.video.state === 'ended' && !lab.video.ui.end.hidden));
    await stableCheck('reduced motion end');
    }
  } catch (e) { record.errors.push('audit: ' + e.stack); }
  check('page errors', !record.errors.length, record.errors.join('\n'));
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(out,'results.json'), JSON.stringify(results,null,2));
console.log(JSON.stringify(results.map(r => ({file:r.file,id:r.id,run:r.run.name,scope:r.scope,fail:r.checks.filter(c=>c.status==='FAIL'),notRun:r.checks.filter(c=>c.status==='NOT_RUN'),errors:r.errors})),null,2));
if (results.some(r => r.errors.length || r.checks.some(c=>c.status==='FAIL'))) process.exitCode=1;
