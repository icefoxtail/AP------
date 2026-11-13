// Controlled technical fixtures built by the production solid/composite engine.
// Real Chrome runs only in the approved read-only qualification job.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {expandSolidFigure,solveSolidFigure} from '../production/solid-figure-v1.mjs';
import {compositePanels,composeCompositeCandidate,compositePanelBytes} from '../production/composite-candidate-svg-v1.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import {withMeasuredPanels,verifyMeasuredLabelInventory} from '../nested-panel-measurement.mjs';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const out=fileURLToPath(new URL('../../../../.tmp/svg-problem/technical-nested-measurement/',import.meta.url));

test('production nested solid glyphs and TEXT caption have exact inventories, actual font CTMs, bounds and unchanged pixels',async()=>{
 const browser=await launchBrowser();fs.mkdirSync(out,{recursive:true});
 try{
  for(const count of [6,8]){
   const solid=count===6?{kind:'PRISM',base:{kind:'POLYGON',points:[[0,0],[4,0],[4.8,2.5]]},height:3.5,names:{base:'DEF',top:'ABC'}}:{kind:'PRISM',base:{kind:'RECT',width:4,depth:3},height:2,names:{base:'FGHE',top:'BCDA'}};
   const authored={capability:'solid-figure-v1',solids:[solid],caption:'입체도형 기술 검증',sourceConditions:[{id:'fixture',condition:'Controlled technical fixture',mappedTo:'solids'}],newVisualInformation:['기술 검증']};
   const identity=assetIdentity('nested-technical-fixture|'+count,'PROBLEM_VISUAL'),plan=expandSolidFigure(authored,{identity}),checked=compositePanels(plan);
   const panels=checked.map(p=>({plan:p.plan,model:solveSolidFigure(p.plan,{identity})}));
   const composed=await composeCompositeCandidate({plan,panels,identity,typographyPolicy:{baseFontPx:20,displayScale:1,fontFloorCssPx:11},browser});
   assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
   const dimensions=Object.fromEntries([...composed.svg.matchAll(/\b(width|height)="([\d.]+)"/g)].slice(0,2).map(m=>[m[1],Number(m[2])]));
   const page=await browser.newPage({viewport:{width:Math.ceil(dimensions.width),height:Math.ceil(dimensions.height)}});
   try{
    const defaultCapture=await captureAtDisplaySize(page,composed.svg,dimensions),defaultResult=analyzeRenderedLayout(defaultCapture);
    assert.equal(defaultResult.labelMeasurements.length,1);assert.equal(defaultResult.labelMeasurements[0].baseFontPx,0);assert.equal(Object.hasOwn(defaultCapture,'problemMeasurement'),false);assert.equal(Object.hasOwn(defaultCapture,'nestedPanels'),false);assert.equal(Object.hasOwn(defaultResult,'nestedPanelEvidence'),false);
    const capture=await captureAtDisplaySize(page,composed.svg,dimensions,{surface:'PROBLEM_VISUAL'}),result=analyzeRenderedLayout(capture);
    assert.equal(result.status,'PASS',JSON.stringify(result.errors));
    assert.equal(result.labelMeasurements.length,count+1);assert.equal(result.nestedPanelEvidence[0].layout.labelMeasurements.length,count);
    assert.deepEqual(verifyMeasuredLabelInventory(composed.svg,result),{labelCount:count+1,panelCount:1});
    for(const label of result.labelMeasurements){assert.equal(label.baseFontPx,20);assert.ok(Math.abs(label.finalViewportCssFontPx-20)<1e-4,JSON.stringify(label));assert.ok(label.fontMeasurement.boundaries.length);}
    const before=await page.locator('svg').first().evaluate(e=>e.outerHTML),original=await page.screenshot();let inline;
    await withMeasuredPanels(page,'svg',{width:1440,height:1000},async(p,viewport,selector)=>{
     if(selector!=='svg')inline=await p.screenshot();
     return {labels:await p.evaluate(selector=>[...document.querySelector(selector).querySelectorAll('text,g[data-fragment-sha]')].map(e=>({id:e.id})),selector)};
    });
    assert.equal(await page.locator('svg').first().evaluate(e=>e.outerHTML),before,'Inspector DOM restored byte-for-byte');
    fs.writeFileSync(path.join(out,`solid-${count}-original.png`),original);fs.writeFileSync(path.join(out,`solid-${count}-inline.png`),inline);
    assert.deepEqual(inline,original,'Native-size exact panel replay must paint identical pixels');
    // At its unchanged natural viewport, the noncomposite panel retains
    // the same base font, final CSS font and glyph bounds as its nested replay.
    const inner=compositePanelBytes(composed.svg)[0],innerSvg=inner.bytes.toString('utf8');
    const nativeSize={width:480,height:result.nestedPanelEvidence[0].naturalViewport.height};
    const standalone=analyzeRenderedLayout(await captureAtDisplaySize(page,innerSvg,nativeSize,{surface:'PROBLEM_VISUAL'}));
    assert.equal(standalone.status,'PASS',JSON.stringify(standalone.errors));
    assert.deepEqual(standalone.labelMeasurements.map(l=>[l.id,l.baseFontPx,l.finalViewportCssFontPx,l.bbox]),result.nestedPanelEvidence[0].layout.labelMeasurements.map(l=>[l.id,l.baseFontPx,l.finalViewportCssFontPx,l.bbox]));
    fs.writeFileSync(path.join(out,`solid-${count}.svg`),composed.svg);
    fs.writeFileSync(path.join(out,`solid-${count}.json`),JSON.stringify({fixtureClassification:'CONTROLLED_TECHNICAL_FIXTURE',svgSha256:hash(composed.svg),browserVersion:browser.version(),capture,result,pixelEquality:{status:'PASS',originalSha256:hash(original),inlineSha256:hash(inline)}},null,2)+'\n');
    const hiddenAuthored={...authored,problemCaption:{scope:'PROBLEM_ONLY',visible:false}},hiddenPlan=expandSolidFigure(hiddenAuthored,{identity}),hiddenChecked=compositePanels(hiddenPlan),hiddenPanels=hiddenChecked.map(p=>({plan:p.plan,model:solveSolidFigure(p.plan,{identity})}));
    const hidden=await composeCompositeCandidate({plan:hiddenPlan,panels:hiddenPanels,identity,typographyPolicy:{baseFontPx:20,displayScale:1,fontFloorCssPx:11},browser});
    assert.equal(hidden.status,'COMPOSED',JSON.stringify(hidden.detail));assert.doesNotMatch(hidden.svg,/data-role="caption"|data-label-kind="CAPTION"/);assert.match(hidden.svg,/<title[^>]*>입체도형 기술 검증<\/title>/);assert.match(hidden.svg,/<desc[^>]*>[^<]+<\/desc>/);
    assert.deepEqual(compositePanelBytes(hidden.svg)[0].bytes,inner.bytes,'Omitting the caption must preserve the exact panel bytes');
    const hiddenCapture=await captureAtDisplaySize(page,hidden.svg,nativeSize,{surface:'PROBLEM_VISUAL'}),hiddenResult=analyzeRenderedLayout(hiddenCapture);
    assert.equal(hiddenResult.status,'PASS',JSON.stringify(hiddenResult.errors));assert.equal(hiddenResult.labelMeasurements.length,count);assert.deepEqual(verifyMeasuredLabelInventory(hidden.svg,hiddenResult),{labelCount:count,panelCount:1});
    fs.writeFileSync(path.join(out,`solid-${count}-caption-omitted.svg`),hidden.svg);fs.writeFileSync(path.join(out,`solid-${count}-caption-omitted.json`),JSON.stringify({fixtureClassification:'CONTROLLED_TECHNICAL_FIXTURE',svgSha256:hash(hidden.svg),capture:hiddenCapture,result:hiddenResult},null,2)+'\n');
    const smaller=analyzeRenderedLayout(await captureAtDisplaySize(page,composed.svg,{width:dimensions.width*.4,height:dimensions.height*.4},{surface:'PROBLEM_VISUAL'}));
    assert.equal(smaller.labelMeasurements.length,count+1);assert.equal(smaller.status,'FAIL');assert.ok(smaller.errors.some(e=>e.includes('PUBLICATION_FONT_BELOW_11_CSS_PX')));
    const missing=composed.svg.replace(/ data-font-px="[^"]*"/g,'');
    const missingCapture=await captureAtDisplaySize(page,missing,dimensions,{surface:'PROBLEM_VISUAL'}),missingResult=analyzeRenderedLayout(missingCapture);
    assert.equal(missingResult.status,'FAIL');assert.throws(()=>verifyMeasuredLabelInventory(missing,missingResult),/FONT_METADATA_REQUIRED/);
   }finally{await page.close();}
  }
 }finally{await browser.close();}
});
