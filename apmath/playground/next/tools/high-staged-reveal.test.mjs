import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const APLab={clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),$$:()=>[]};
vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-shell.js',import.meta.url),'utf8'),{window:{APLab,matchMedia:()=>({matches:false})},document:{}});
function fixture(stagedReveal=true,steps=['발상','관계','결론']){
 const lab=Object.create(APLab.Lab.prototype);
 Object.assign(lab,{def:{stagedReveal},s:{step:0,revealed:false,x:2},list:[{steps,problem:{}}],index:0,tab:'explore',ui:{tabs:{},panes:{explore:{},review:{},problem:{}}},refs:{},invalidate(){},_saveHashSoon(){},_syncTabAttr(){},_placeControls(){},_autoSnap(){}});
 return lab;
}
test('opening high-school review reveals only the first step and preserves numerical input',()=>{
 const l=fixture();l.setTab('review');assert.equal(l.s.step,1);assert.equal(l.s.x,2);assert.equal(l._answerOpen(),false);
 l.setStep(2);l.setTab('explore');l.setTab('review');assert.equal(l.s.step,2);assert.equal(l._answerOpen(),false);
 l.setStep(3);assert.equal(l._answerOpen(),true);
});
test('off explicitly relocks a previously revealed answer and reopening shows step one',()=>{
 const l=fixture();l.s.revealed=true;assert.equal(l._answerOpen(),true);l.setStep(0);assert.equal(l.s.revealed,false);assert.equal(l._answerOpen(),false);
 l.setTab('review');assert.equal(l.s.step,1);assert.equal(l._answerOpen(),false);
});
test('closed comparison cannot evaluate or retain a final solution before its stage',()=>{
 const l=fixture();let reads=0;const body={innerHTML:'old final answer',__solutionSource:()=>{reads++;return{steps:'answer'};}};
 const detail={open:true,querySelector:()=>body};const section={hidden:false,querySelectorAll:()=>detail.open?[detail]:[]};l.refs.solution=section;
 l._syncSolutionDisclosure();assert.equal(section.hidden,true);assert.equal(detail.open,false);assert.equal(body.innerHTML,'');assert.equal(reads,0);
 l.setStep(3);l._syncSolutionDisclosure();assert.equal(section.hidden,false);assert.equal(reads,0);
});
test('legacy and middle-school tab/answer behavior remains unchanged without opt-in',()=>{
 const l=fixture(false);l.setTab('review');assert.equal(l.s.step,0);l.s.revealed=true;l.setStep(0);assert.equal(l.s.revealed,true);assert.equal(l._answerOpen(),true);
 const noSteps=fixture(false,undefined);noSteps.list[0].steps=undefined;assert.equal(noSteps._answerOpen(),true);
 const highNoSteps=fixture(true,undefined);highNoSteps.list[0].steps=undefined;assert.equal(highNoSteps._answerOpen(),false);
});
