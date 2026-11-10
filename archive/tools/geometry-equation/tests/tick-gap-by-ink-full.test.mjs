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
    assert.match(svg,/data-font-px="20"/);                                  // the font floor of the full class: the case this guards
    assert.match(svg,/id="tick-y-1-label"/);
    assert.ok(!svg.includes('tickInk'),'the ink report is a placement input only');
  });
}
