// enableBrowserReuse(): launchBrowser() hands out handles onto one shared Chrome; each handle still closes like a browser (its pages end, isConnected turns false).
import test from 'node:test';
import assert from 'node:assert/strict';
import {launchBrowser,enableBrowserReuse,closeSharedBrowser,browserLaunchCount} from '../visual-browser-runtime.mjs';

test('handles share one Chrome launch and close independently',async()=>{
  const before=browserLaunchCount();
  enableBrowserReuse();
  try{
    const a=await launchBrowser(),b=await launchBrowser();
    assert.equal(browserLaunchCount()-before,1);
    const pageA=await a.newPage({viewport:{width:80,height:60}});
    await pageA.setContent('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>');
    assert.equal(typeof a.version(),'string');
    await a.close();
    assert.equal(a.isConnected(),false);assert.equal(pageA.isClosed(),true);
    assert.equal(b.isConnected(),true);
    const pageB=await b.newPage();
    assert.equal(await pageB.evaluate(()=>1+1),2);
    const c=await launchBrowser();assert.equal(browserLaunchCount()-before,1);
    await b.close();await c.close();
  }finally{await closeSharedBrowser();}
  const after=await launchBrowser(); // reuse is off again: a plain, separate Chrome
  assert.equal(browserLaunchCount()-before,2);
  await after.close();
});
