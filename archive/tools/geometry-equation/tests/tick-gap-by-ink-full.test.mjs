// Tick-label gap judged on the glyph ink: two golden piecewise-discontinuous plans rendered at size class "full" (base label font 20).
// Before the fix the placer accepted a label whose BOX edge was 16 from the axis, the verifier measured the INK (17.46 away) and refused the figure
// (RENDERED_LAYOUT_FAIL / TICK_LABEL_NORMAL_DISTANCE_OUT_OF_RANGE). Chrome is used: run with --test-concurrency=1.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';

const manifest=JSON.parse(fs.readFileSync(new URL('../ops/golden.manifest.json',import.meta.url),'utf8'));

for(const dir of ['item75g7b','item76g7c']){
  test(`golden ${dir} renders ARCHIVE_BOUND when size class full is requested`,{timeout:600000},async()=>{
    const meta=manifest.items.find(value=>value.dir===dir);assert.ok(meta,dir);
    const out=fs.mkdtempSync(path.join(os.tmpdir(),`tick-ink-${dir}-`));
    const r=await renderPlan({item:{sourcePath:meta.sourcePath,ordinal:meta.ordinal,dir},plan:new URL(`../ops/golden/${dir}/plan.json`,import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),outDir:out,forceSizeClass:'full'});
    assert.equal(r.status,'ARCHIVE_BOUND',JSON.stringify(r).slice(0,800));
    assert.equal(r.sizeClass,'full');
    const svg=fs.readFileSync(path.join(out,`${dir}-solution.svg`),'utf8');
    // the base font of the full class is the measured one, never below the floor of 20 (the case this guards); the exact value follows the browser's measured text widths
    const fonts=[...svg.matchAll(/data-font-px="([0-9.]+)"/g)].map(match=>Number(match[1]));
    assert.ok(fonts.some(font=>font>=20&&font<=32),JSON.stringify(fonts));
    assert.match(svg,/id="tick-y-1-label"/);
    assert.ok(!svg.includes('tickInk'),'the ink report is a placement input only');
  });
}
