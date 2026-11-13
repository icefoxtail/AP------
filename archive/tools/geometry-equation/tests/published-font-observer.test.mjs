// Controlled CDP-session lifecycle units only. No browser, platform-font or capture PASS is claimed.
import test from 'node:test';
import assert from 'node:assert/strict';
import {preparePublishedProblemFontObserver,closePublishedProblemFontObserver,observeProblemKoreanFont,verifyPublishedProblemFontObserver} from '../production/problem-browser-font.mjs';
function fixture({url='about:blank',failMethod=null,navigateDuring=null}={}){
 const calls=[];let current=url;
 const session={send:async method=>{calls.push(method);if(method===navigateDuring)current='http://unit.invalid/navigated';if(method===failMethod)throw Error('UNIT_CDP_ENABLE_FAILURE');return {};},detach:async()=>{calls.push('detach');}};
 const page={url:()=>current,context:()=>({newCDPSession:async target=>{assert.equal(target,page);calls.push('newCDPSession');return session;}}),evaluate:async()=>null};return {page,calls};
}
function controlledEvidence(){return {schemaVersion:'PUBLISHED_PRE_NAVIGATION_FONT_OBSERVER_v1',id:'00000000-0000-4000-8000-000000000001',preparedUrl:'about:blank',commands:[{method:'DOM.enable',completed:true},{method:'CSS.enable',completed:true}],preparedBeforeNavigation:true,reusedForPlatformFonts:true,platformFontReadComplete:true,detached:true};}
test('published session prepares actual DOM then CSS on the blank page and closes once',async()=>{
 const f=fixture(),token=await preparePublishedProblemFontObserver(f.page);assert.deepEqual(f.calls,['newCDPSession','DOM.enable','CSS.enable']);
 const evidence=await closePublishedProblemFontObserver(f.page,token);assert.equal(evidence.preparedBeforeNavigation,true);assert.equal(evidence.preparedUrl,'about:blank');assert.equal(evidence.detached,true);assert.equal(evidence.reusedForPlatformFonts,false);
 await closePublishedProblemFontObserver(f.page,token);assert.equal(f.calls.filter(v=>v==='detach').length,1);
});
test('late initialization, navigation race, wrong page and invented token are rejected',async()=>{
 const late=fixture({url:'http://unit.invalid/already-loaded'});await assert.rejects(preparePublishedProblemFontObserver(late.page),/BEFORE_NAVIGATION_REQUIRED/);assert.deepEqual(late.calls,[]);
 const race=fixture({navigateDuring:'CSS.enable'});await assert.rejects(preparePublishedProblemFontObserver(race.page),/NAVIGATION_RACE/);assert.equal(race.calls.at(-1),'detach');
 const f=fixture(),token=await preparePublishedProblemFontObserver(f.page);await assert.rejects(closePublishedProblemFontObserver(fixture().page,token),/IDENTITY_REQUIRED/);await assert.rejects(closePublishedProblemFontObserver(f.page,{id:token.id}),/IDENTITY_REQUIRED/);await closePublishedProblemFontObserver(f.page,token);
});
test('partial CDP enable failure retains completed commands and actual cleanup evidence',async()=>{
 const f=fixture({failMethod:'CSS.enable'});await assert.rejects(preparePublishedProblemFontObserver(f.page),error=>{assert.deepEqual(error.publishedFontObserverEvidence.commands,[{method:'DOM.enable',completed:true}]);assert.equal(error.publishedFontObserverEvidence.preparedBeforeNavigation,false);assert.equal(error.publishedFontObserverEvidence.detached,true);return /UNIT_CDP_ENABLE_FAILURE/.test(error.message);});assert.equal(f.calls.at(-1),'detach');
});
test('font observation reuses the prepared session without late enables and closes even on failed font setup',async()=>{
 const f=fixture();f.page.evaluate=async()=>{throw Error('UNIT_PAINT_NOT_BROWSER');};const token=await preparePublishedProblemFontObserver(f.page),result=await observeProblemKoreanFont(f.page,{publishedObserver:token});
 assert.equal(result.status,'FAIL'); // This controlled page cannot supply actual document/platform-font evidence.
 assert.equal(result.sessionLifecycle.reusedForPlatformFonts,true);assert.equal(result.sessionLifecycle.detached,true);assert.deepEqual(f.calls,['newCDPSession','DOM.enable','CSS.enable','detach']);
 await closePublishedProblemFontObserver(f.page,token);assert.equal(f.calls.filter(v=>v==='detach').length,1);
 const reused=await observeProblemKoreanFont(f.page,{publishedObserver:token});assert.equal(reused.status,'FAIL');assert.equal(reused.error.code,'PUBLISHED_FONT_OBSERVER_ALREADY_CONSUMED');
});
test('default font observer adds no published-session fields and retains its existing failure contract',async()=>{
 const f=fixture({url:'http://unit.invalid/existing-default-page'}),result=await observeProblemKoreanFont(f.page);assert.equal(result.status,'FAIL');assert.equal(Object.hasOwn(result,'sessionLifecycle'),false);assert.equal(result.runtime,'chromium-cdp-platform-fonts');
});
test('historical published evidence requires same-session preparation, actual read and cleanup; no declared flag substitutes',()=>{
 const value=controlledEvidence(),row={fixtureClassification:'UNIT_ONLY_NOT_ACTUAL_CAPTURE',publishedFontObserverEvidence:value,koreanFont:{status:'PASS',sessionLifecycle:structuredClone(value)}};assert.equal(verifyPublishedProblemFontObserver(row),value);
 for(const change of [r=>delete r.publishedFontObserverEvidence,r=>r.publishedFontObserverEvidence.preparedUrl='http://unit.invalid/late',r=>r.publishedFontObserverEvidence.commands.reverse(),r=>r.publishedFontObserverEvidence.preparedBeforeNavigation=false,r=>r.publishedFontObserverEvidence.reusedForPlatformFonts=false,r=>r.publishedFontObserverEvidence.platformFontReadComplete=false,r=>r.publishedFontObserverEvidence.detached=false,r=>r.publishedFontObserverEvidence.cleanupError='unit failure',r=>r.koreanFont.status='FAIL',r=>r.koreanFont.sessionLifecycle.id='00000000-0000-4000-8000-000000000002']){const bad=structuredClone(row);change(bad);assert.throws(()=>verifyPublishedProblemFontObserver(bad),/LIFECYCLE_REQUIRED/);}
});
