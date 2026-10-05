/** Real Chromium bbox tests; these are NOT actual Archive-page evidence. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {verifyRenderedFile} from '../verify-rendered-layout.mjs';
import {repoRoot} from '../visual-browser-runtime.mjs';
const run=path.join(repoRoot,'archive/_generated/geometry-visual-engine/publication-tests');
const fixtures=JSON.parse(fs.readFileSync(path.join(run,'manifest.json'),'utf8'));
const rows=[];
for(const f of fixtures)for(const width of [320,390]){
  const result=await verifyRenderedFile(path.join(repoRoot,f.svg),{width:390,height:844,display:{width,height:width},screenshot:path.join(run,`${f.id}-${width}.png`)});
  assert.equal(result.svgSha256,f.svgSha256,'STALE_FIXTURE_SHA');
  fs.writeFileSync(path.join(run,`${f.id}-${width}.browser.json`),JSON.stringify(result,null,2));
  rows.push({id:f.id,width,status:result.status,errors:result.errors,minCssFont:Math.min(...result.capture.labels.map(v=>v.effectiveFontPx)),svgSha256:result.svgSha256});
}
const small=await verifyRenderedFile(path.join(repoRoot,fixtures[0].svg),{width:390,height:844,display:{width:240,height:240}});
assert.equal(small.status,'FAIL');assert.ok(small.errors.some(v=>v.startsWith('PUBLICATION_FONT_BELOW_11')));
fs.writeFileSync(path.join(run,'browser-summary.json'),JSON.stringify({scope:'STANDALONE_CHROMIUM_NOT_ARCHIVE',publicationAuthorized:false,rows,smallFontNegative:'PASS'},null,2));
console.log(JSON.stringify(rows));if(rows.some(r=>r.status!=='PASS'))process.exitCode=1;
