import fs from 'node:fs';
import path from 'node:path';
import {performance} from 'node:perf_hooks';
import {fileURLToPath} from 'node:url';
import {repoRoot,assertOutput,launchBrowser} from './visual-browser-runtime.mjs';
import {sha256} from './verify-visual-engine-static.mjs';
import {collectRenderedLayout,analyzeRenderedLayout} from './verify-rendered-layout.mjs';

export async function measureBrowser({run,archiveAttempt}) {
  run=assertOutput(run);
  if(!/^[A-Za-z0-9_-]+$/.test(archiveAttempt))throw Error('INVALID_ARCHIVE_ATTEMPT');
  const manifest=JSON.parse(fs.readFileSync(path.join(run,'fixtures/manifest.json'),'utf8'));
  const browser=await launchBrowser();const rows=[];
  try {
    for(const item of manifest)for(const [viewport,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page=await browser.newPage({viewport:{width,height}});
      const bytes=fs.readFileSync(path.join(repoRoot,item.svg));
      const started=performance.now();
      await page.setContent(bytes.toString('utf8'),{waitUntil:'load'});
      await page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
      const renderTimeMs=performance.now()-started;
      const metrics=await page.evaluate(()=>{
        const svg=document.querySelector('svg');if(!svg)throw Error('SVG_MISSING');
        const started=performance.now();
        for(const node of svg.querySelectorAll('*')){node.getBoundingClientRect();if(node instanceof SVGGraphicsElement)node.getBBox();}
        const browserLayoutTimeMs=performance.now()-started;
        const walker=document.createTreeWalker(svg,NodeFilter.SHOW_ALL);let domNodeCount=1,textNodeCount=0;
        while(walker.nextNode()){domNodeCount++;if(walker.currentNode.nodeType===Node.TEXT_NODE)textNodeCount++;}
        return{domNodeCount,textNodeCount,pathCount:svg.querySelectorAll('path').length,
          polylineCount:svg.querySelectorAll('polyline').length,textElementCount:svg.querySelectorAll('text').length,
          browserLayoutTimeMs,fontStatus:document.fonts.status};
      });
      const qa=analyzeRenderedLayout(await collectRenderedLayout(page));
      rows.push({id:item.id,viewport,status:qa.status,svgSha256:sha256(bytes),svgBytes:bytes.length,
        renderTimeMs,...metrics,qa,synthetic:false,runtime:'playwright-chromium',browserVersion:browser.version()});
      await page.close();
    }
  }finally{await browser.close();}
  const matrixFile=path.join(run,'archive-render-matrix.json');
  const matrix=JSON.parse(fs.readFileSync(matrixFile,'utf8'));
  const summary=JSON.parse(fs.readFileSync(path.join(run,'archive-render',archiveAttempt,'summary.json'),'utf8'));
  if(summary.status!=='PASS'||summary.matrixSha256!==sha256(fs.readFileSync(matrixFile)))throw Error('ARCHIVE_PERFORMANCE_BINDING_FAIL');
  const archiveRows=matrix.rows.map(item=>{
    const file=path.join(run,'archive-render',archiveAttempt,item.id+'-'+item.mode+'-'+item.viewport+'.json');
    const capture=JSON.parse(fs.readFileSync(file,'utf8'));const m=capture.state?.nativeRenderMetrics;
    if(capture.status!=='PASS'||capture.synthetic!==false||capture.sourceSha256!==item.sourceSha256||
      capture.engineSha256!==matrix.engineSha256||!m||!Number.isFinite(m.renderReadyMs)||m.renderReadyMs<0||
      !Number.isFinite(m.startedAt)||!Number.isFinite(m.finishedAt)||m.finishedAt<m.startedAt)throw Error('NATIVE_PERFORMANCE_NOT_MEASURED');
    return{id:capture.id,mode:item.mode,viewport:item.viewport,sourceSha256:item.sourceSha256,
      evidencePath:path.relative(repoRoot,file).replaceAll('\\','/'),evidenceSha256:sha256(fs.readFileSync(file)),
      renderReadyMs:m.renderReadyMs,transactionElapsedMs:m.finishedAt-m.startedAt,mathJaxTotalMs:m.mathJaxTotalMs,
      fontWaitMs:m.fontWaitMs,questionCount:capture.state.questionBlocks,pageCount:capture.state.pageCount};
  });
  const result={status:rows.length===manifest.length*2&&rows.every(r=>r.status==='PASS')?'PASS':'FAIL',
    runtime:'playwright-chromium',synthetic:false,rows,archiveRows,matrixSha256:sha256(fs.readFileSync(matrixFile)),
    notes:{renderTimeMs:'Node monotonic wall time from setContent through fonts and two animation frames',
      browserLayoutTimeMs:'browser performance.now over actual SVG geometry and text bbox reads',
      nativeArchive:'unchanged archive runtime transaction metrics in existing Phase14 actual captures',
      thresholds:'measurement only; correctness gates precede performance; no invented latency budget'}};
  const out=assertOutput(path.join(run,'performance/browser.json'));fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const arg=k=>process.argv[process.argv.indexOf(k)+1];
  const r=await measureBrowser({run:arg('--run'),archiveAttempt:arg('--archive-attempt')});
  console.log(JSON.stringify({status:r.status,svgViewportCases:r.rows.length,archiveCases:r.archiveRows.length}));
  if(r.status!=='PASS')process.exitCode=1;
}
